import * as ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";
import { isNotUndefined } from "../../shared/arrays";
import { findAliasOfType } from "../aliasing";

/**
 * String equivalents to print for literal node types.
 */
const keywordLiteralEquivalents = new Map([
    [ts.SyntaxKind.NullKeyword, "null"],
    [ts.SyntaxKind.StringKeyword, "string"],
    [ts.SyntaxKind.BooleanKeyword, "boolean"],
    [ts.SyntaxKind.TrueKeyword, "true"],
    [ts.SyntaxKind.FalseKeyword, "false"],
    [ts.SyntaxKind.UnknownKeyword, "unknown"],
    [ts.SyntaxKind.UndefinedKeyword, "undefined"],
    [ts.SyntaxKind.NumberKeyword, "number"],
    [ts.SyntaxKind.BigIntKeyword, "bigint"],
]);

/**
 * Nodes types known to be literals allowed in --typesOnlyPrimitives.
 */
const primitiveNodeKinds = new Set([
    ...keywordLiteralEquivalents.keys(),
    ts.SyntaxKind.NumericLiteral,
    ts.SyntaxKind.StringLiteral,
    ts.SyntaxKind.BigIntLiteral,
]);

/**
 * String literals to instead return undefined from for results.
 *
 * @remarks
 * It's very rare that a type is exclusively `null` or `undefined`.
 * An end result of just either of those (not in a union) is more likely a TypeScript inference bug.
 */
const invalidExtractedTypeResults = new Set(["", "null", "undefined"]);

/**
 * Given a type added by a TypeScript codefix, extrats the equivalent type to add per TypeStat type settings.
 */
export const extractRawCodefixUnionTypes = (request: FileMutationsRequest, newText: string): string | undefined => {
    if (!newText.startsWith(": ")) {
        return undefined;
    }

    /**
     * Converts a type node into its equivalent printed string, or `undefined` to not be printed.
     */
    const processTypeNode = (type: ts.TypeNode): string | undefined => {
        if (ts.isUnionTypeNode(type)) {
            return processUnionTypeNode(type);
        }

        if (request.options.types.onlyPrimitives && !primitiveNodeKinds.has(type.kind)) {
            return undefined;
        }

        const textForNode = getTextForNode(type);
        const textAlias = findAliasOfType(textForNode, request.options.types.aliases);

        if (
            request.options.types.matching !== undefined &&
            !request.options.types.matching.some((matcher) => textAlias.match(matcher) !== null)
        ) {
            return undefined;
        }

        return textAlias;
    };

    const processUnionTypeNode = (type: ts.UnionTypeNode): string | undefined => {
        const processedTypes = type.types.map(processTypeNode);
        const filteredProcessedTypes = processedTypes.filter(isNotUndefined);

        // When types.onlyPrimitives is enabled, elide all types if any are complex
        // We don't want cases like `let callbackOrUndefined: undefined = () => {};`
        return processedTypes.length === filteredProcessedTypes.length ? filteredProcessedTypes.join(" | ") : undefined;
    };

    const getTextForNode = (type: ts.TypeNode): string => {
        const keywordEquivalent = keywordLiteralEquivalents.get(type.kind);
        if (keywordEquivalent !== undefined) {
            return keywordEquivalent;
        }

        return type.getText(request.sourceFile);
    };

    // This creates a full TypeScript source file to accomodate for difficult-to-parse syntax such as { [i: string]: {} | [] }
    // Within that source file, a dummy type is the only statement, and its nodes are parsed to retrieve type info
    const sourceText = `type _ = ${newText.substring(": ".length)}`;
    const sourceFile = ts.createSourceFile("_.tsx", sourceText, ts.ScriptTarget.Latest);
    const typeResult = processTypeNode((sourceFile.statements[0] as ts.TypeAliasDeclaration).type);

    if (typeResult === undefined || invalidExtractedTypeResults.has(typeResult)) {
        return undefined;
    }

    return typeResult;
};
