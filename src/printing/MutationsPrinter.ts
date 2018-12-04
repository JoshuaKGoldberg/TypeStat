import { ITextInsertMutation } from "automutate";
import * as ts from "typescript";

import { TypeStatOptions } from "../options/types";
import { setSubtract } from "../shared/sets";
import { isTypeFlagSetRecursively, joinIntoType } from "./types";

/**
 * Additional type flags and aliases to check when in more than just --onlyStrictNullTypes mode.
 */
const nonStrictTypeFlagAliases: ReadonlyArray<[ts.TypeFlags, string]> = [
    [ts.TypeFlags.Boolean, "boolean"],
    [ts.TypeFlags.BooleanLiteral, "boolean"],
    [ts.TypeFlags.Number, "number"],
    [ts.TypeFlags.NumberLiteral, "number"],
    [ts.TypeFlags.String, "string"],
    [ts.TypeFlags.StringLiteral, "string"],
];

/**
 * Creates mutations for type changes in a file.
 */
export class MutationPrinter {
    /**
     * Type flags we're willing to print into types, keyed to their type aliases.
     */
    private readonly knownTypeFlagsWithAliases: ReadonlyMap<ts.TypeFlags, string>;

    public constructor(
        private readonly options: TypeStatOptions,
    ) {
        const knownTypeFlagsWithAliases = new Map([
            [ts.TypeFlags.Null, "null"],
            [ts.TypeFlags.Undefined, "undefined"],
        ]);

        if (!options.onlyStrictNullTypes) {
            for (const [typeFlag, alias] of (nonStrictTypeFlagAliases)) {
                knownTypeFlagsWithAliases.set(typeFlag, alias);
            }
        }

        this.knownTypeFlagsWithAliases = knownTypeFlagsWithAliases;
    }

    /**
     * Creates a mutation to add types to an existing type, if any are new.
     * 
     * @param typeNode   Original type declaration node.
     * @param declaredType   Declared type from the node.
     * @param assignedTypes   Types now assigned to the node.
     * @returns Mutation to add any new assigned types, if any are missing from the declared type.
     */
    public createTypeAdditionMutation(
        typeNode: ts.TypeNode,
        declaredType: ts.Type,
        assignedTypes: ReadonlyArray<ts.Type>,
    ): ITextInsertMutation | undefined {
        const { missingFlags, missingSymbols } = this.collectUsageFlagsAndSymbols(declaredType, assignedTypes);

        // If nothing is missing, rejoice! The type was already fine.
        if (missingFlags.size === 0 && missingSymbols.size === 0) {
            return undefined;
        }

        // Create a mutation insertion that adds the missing types in
        return {
            insertion: ` | ${joinIntoType(missingFlags, missingSymbols, this.options.typeAliases)}`,
            range: {
                begin: typeNode.end,
            },
            type: "text-insert",
        }
    };

    /**
     * Creates a mutation to add types to a node without a type, if any are new.
     * 
     * @param node   Original node with its own type.
     * @param declaredType   Declared type from the node.
     * @param assignedTypes   Types now assigned to the node.
     * @returns Mutation to add any new assigned types, if any are missing from the declared type.
     */
    public createTypeCreationMutation(
        begin: number,
        declaredType: ts.Type,
        assignedTypes: ReadonlyArray<ts.Type>,
    ): ITextInsertMutation | undefined {
        const { assignedFlags, assignedSymbols, missingFlags, missingSymbols } = this.collectUsageFlagsAndSymbols(declaredType, assignedTypes);

        // If nothing is missing, rejoice! The type was already fine.
        if (missingFlags.size === 0 && missingSymbols.size === 0) {
            return undefined;
        }

        // Create a mutation insertion that adds the assigned types in
        return {
            insertion: `: ${joinIntoType(assignedFlags, assignedSymbols, this.options.typeAliases)}`,
            range: {
                begin,
            },
            type: "text-insert",
        }
    };

    private collectUsageFlagsAndSymbols(declaredType: ts.Type, assignedTypes: ReadonlyArray<ts.Type>) {
        const [declaredFlags, declaredSymbols] = this.collectFlagsAndSymbolsFromType(declaredType);
        const [assignedFlags, assignedSymbols] = this.collectFlagsAndSymbolsFromType(...assignedTypes);

        const missingFlags = setSubtract(assignedFlags, declaredFlags);
        const missingSymbols = this.findMissingSymbols(assignedSymbols, declaredSymbols);

        return { assignedFlags, assignedSymbols, missingFlags, missingSymbols };
    }

    private collectFlagsAndSymbolsFromType(...assignedTypes: ts.Type[]): [ReadonlySet<string>, ReadonlySet<ts.Symbol>] {
        const assignedFlags = new Set<string>();
        const assignedSymbols = new Set<ts.Symbol>();

        // Scan each assigned type for undeclared type additions
        for (const assignedType of assignedTypes) {
            // For any simple type flag, add its alias if it's in the assigned type but not the declared type
            for (const [typeFlag, alias] of this.knownTypeFlagsWithAliases) {
                if (isTypeFlagSetRecursively(assignedType, typeFlag)) {
                    assignedFlags.add(alias);
                }
            }

            // Add any assigned symbol (complex type)
            const assigningSymbol = assignedType.getSymbol();
            if (assigningSymbol !== undefined) {
                assignedSymbols.add(assigningSymbol);
            }
        }

        return [assignedFlags, assignedSymbols];
    }

    private findMissingSymbols(assignedSymbols: ReadonlySet<ts.Symbol>, declaredSymbols: ReadonlySet<ts.Symbol>): ReadonlySet<ts.Symbol> {
        if (this.options.onlyStrictNullTypes) {
            return new Set<ts.Symbol>();
        }

        // Todo: ignore types assignable to each other
        // https://github.com/joshuakgoldberg/typestat/issues/12

        return setSubtract(assignedSymbols, declaredSymbols);
    }
}
