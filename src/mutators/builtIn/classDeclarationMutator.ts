import { IMutation, ITextInsertMutation } from "automutate";
import * as ts from "typescript";

import { printNewLine } from "../../shared/printing";
import { collectMutationsFromNodes } from "../collectMutationsFromNodes";
import { FileMutationsRequest, FileMutator } from "../fileMutator";

import { createInterfaceFromPropTypes } from "./classDeclarations/propTypes/createInterfaceFromPropTypes";
import { getPropTypesValue } from "./classDeclarations/propTypes/getPropTypesValue";

export const classDeclarationMutator: FileMutator = (request: FileMutationsRequest): ReadonlyArray<IMutation> => {
    // This fixer is only relevant if fixing incomplete types is enabled
    if (!request.options.fixes.incompleteTypes) {
        return [];
    }

    const isVisitableComponentClass = (node: ts.Node): node is ts.ClassDeclaration =>
        ts.isClassDeclaration(node) && classExtendsReactComponent(node);

    const classExtendsReactComponent = (node: ts.ClassDeclaration): boolean => {
        const { heritageClauses } = node;
        if (heritageClauses === undefined) {
            return false;
        }

        const classExtension = heritageClauses.find((clause) => clause.token === ts.SyntaxKind.ExtendsKeyword);
        if (classExtension === undefined) {
            return false;
        }

        return extensionExpressionIsReactComponent(classExtension.types[0]);
    };

    const extensionExpressionIsReactComponent = (node: ts.ExpressionWithTypeArguments): boolean => {
        // Todo: actually check the type for this
        return node.getText().includes("Component");
    };

    return collectMutationsFromNodes(request, isVisitableComponentClass, visitClassDeclaration);
};

const visitClassDeclaration = (node: ts.ClassDeclaration, request: FileMutationsRequest): ITextInsertMutation | undefined => {
    // Try to find a static `propTypes` member to indicate the interface
    // If it doesn't exist, we can't infer anything about the class (yet!), so we bail out
    const propTypes = getPropTypesValue(node, request);
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
