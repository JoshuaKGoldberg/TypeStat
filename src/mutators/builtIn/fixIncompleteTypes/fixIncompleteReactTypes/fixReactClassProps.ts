import { IMutation, ITextInsertMutation } from "automutate";
import * as ts from "typescript";

import { getClassExtendsType } from "../../../../shared/nodes";
import { printNewLine } from "../../../../shared/printing";
import { collectMutationsFromNodes } from "../../../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../../../fileMutator";

import { createInterfaceFromPropTypes } from "./propTypes/createInterfaceFromPropTypes";
import { getPropTypesValue } from "./propTypes/getPropTypesValue";

export const fixReactClassProps: FileMutator = (request: FileMutationsRequest): ReadonlyArray<IMutation> => {
    const isVisitableComponentClass = (node: ts.Node): node is ts.ClassDeclaration =>
        ts.isClassDeclaration(node) && classExtendsReactComponent(node);

    const classExtendsReactComponent = (node: ts.ClassDeclaration): boolean => {
        const extendsType = getClassExtendsType(node);

        return extendsType === undefined ? false : extensionExpressionIsReactComponent(extendsType);
    };

    const extensionExpressionIsReactComponent = (node: ts.ExpressionWithTypeArguments): boolean => {
        // Todo: actually check the type for this
        // See https://github.com/JoshuaKGoldberg/TypeStat/issues/135
        return node.getText().includes("Component");
    };

    return collectMutationsFromNodes(request, isVisitableComponentClass, visitClassDeclaration);
};

const visitClassDeclaration = (node: ts.ClassDeclaration, request: FileMutationsRequest): ITextInsertMutation | undefined => {
    // Try to find a static `propTypes` member to indicate the interface
    // If it doesn't exist, we can't infer anything about the class here, so we bail out
    const propTypes = getPropTypesValue(node);
    if (propTypes === undefined) {
        return undefined;
    }

    // Since we did find the propTypes object, we can generate an interface from its members
    // That interface will be injected with blank lines around it just before the class
    const interfaceNode = createInterfaceFromPropTypes(node, propTypes);
    const interfaceNodeText = request.services.printNode(interfaceNode);
    const endline = printNewLine(request.options.compilerOptions);

    return {
        insertion: [endline, endline, interfaceNodeText, endline].join(""),
        range: {
            begin: node.pos,
        },
        type: "text-insert",
    };
};
