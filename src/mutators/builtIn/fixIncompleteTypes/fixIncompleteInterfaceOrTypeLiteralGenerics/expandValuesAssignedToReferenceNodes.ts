import * as ts from "typescript";

import { AssignedTypeValue } from "../../../../mutations/assignments";
import { isNodeAssigningBinaryExpression } from "../../../../shared/nodes";
import { getTypeAtLocationIfNotError } from "../../../../shared/types";
import { FileMutationsRequest } from "../../../fileMutator";

export const expandValuesAssignedToReferenceNodes = (
    request: FileMutationsRequest,
    originalType: ts.Type,
    genericReferenceNodes: ts.Node[],
) => {
    const assignedValues = new Set<AssignedTypeValue>();

    for (const genericReferenceNode of genericReferenceNodes) {
        const assignedGenericValue = getAssignedGenericValue(request, originalType, genericReferenceNode);
        if (assignedGenericValue !== undefined) {
            assignedValues.add(assignedGenericValue);
        }
    }

    return Array.from(assignedValues);
};

const getAssignedGenericValue = (request: FileMutationsRequest, originalType: ts.Type, node: ts.Node): AssignedTypeValue | undefined => {
    // Case:
    //   function container<T>(values: T) { }
    //   type Values = {};
    //   container<Values>({ laterAssigned: true, });
    // Case:
    //   declare class Container<T> { values: t; }
    //   type Values = {};
    //   new Container<Values>({ laterAssigned: true, });
    // Case:
    //   declare class Container<T> { setValues(values: t): void; }
    //   type Values = {};
    //   new Container<Values>({}).setValues({ laterAssigned: true });
    if (ts.isObjectLiteralExpression(node)) {
        return assignedTypeOrUndefined({
            type: getTypeAtLocationIfNotError(request, node),
        });
    }

    if (ts.isIdentifier(node) && ts.isPropertyAccessExpression(node.parent)) {
        // Case:
        //   declare class Container<T> { values: t; }
        //   type Values = {};
        //   const container = new Container<Values>({});
        //   container.values = { laterAssigned: true, };
        if (isNodeAssigningBinaryExpression(node.parent.parent) && getTypeAtLocationIfNotError(request, node.parent) === originalType) {
            return assignedTypeOrUndefined({
                type: getTypeAtLocationIfNotError(request, node.parent.parent.right),
            });
        }

        // Case:
        //   declare class Container<T> { values: T; }
        //   type Values = {};
        //   const container = new Container<Values>({});
        //   container.values.laterAssigned = true;
        // Case:
        //   declare class Container<T> { values: T; }
        //   type Values = {};
        //   new Container<Values>({}).values.quicklyAssigned = true;
        if (
            ts.isPropertyAccessExpression(node.parent.parent) &&
            ts.isIdentifier(node.parent.parent.name) &&
            isNodeAssigningBinaryExpression(node.parent.parent.parent) &&
            getTypeAtLocationIfNotError(request, node.parent) === originalType
        ) {
            return assignedTypeOrUndefined({
                name: node.parent.parent.name.getText(),
                type: getTypeAtLocationIfNotError(request, node.parent.parent.parent.right),
            });
        }
    }

    return undefined;
};

const assignedTypeOrUndefined = (assignedType: Partial<AssignedTypeValue>): AssignedTypeValue | undefined =>
    assignedType.type === undefined ? undefined : (assignedType as AssignedTypeValue);
