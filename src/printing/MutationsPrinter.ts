import { ITextInsertMutation } from "automutate";
import * as ts from "typescript";

import { TypeStatOptions } from "../options/types";
import { LanguageServices } from "../services/language";
import { setSubtract } from "../shared/sets";
import { isTypeFlagSetRecursively, joinIntoType } from "./types";
import { createTypescriptTypeAdditionMutation, createTypescriptTypeCreationMutation } from "./typescript";

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
        private readonly services: LanguageServices,
    ) {
        const knownTypeFlagsWithAliases = new Map([
            [ts.TypeFlags.Null, "null"],
            [ts.TypeFlags.Undefined, "undefined"],
        ]);

        if (options.fixes.strictNullChecks) {
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
     * @param allAssignedTypes   Types now assigned to the node.
     * @returns Mutation to add any new assigned types, if any are missing from the declared type.
     */
    public createTypeAdditionMutation(
        typeNode: ts.TypeNode,
        declaredType: ts.Type,
        allAssignedTypes: ReadonlyArray<ts.Type>,
    ): ITextInsertMutation | undefined {
        // Find the any missing flags and symbols (a.k.a. types)
        const { missingFlags, missingTypes } = this.collectUsageFlagsAndSymbols(declaredType, allAssignedTypes);

        // If nothing is missing, rejoice! The type was already fine.
        if (missingFlags.size === 0 && missingTypes.size === 0) {
            return undefined;
        }

        // Join the missing types into a type string to declare
        const newTypeAlias = joinIntoType(missingFlags, missingTypes, this.options.typeAliases);

        // Create a mutation insertion that adds the missing types in
        return createTypescriptTypeAdditionMutation(typeNode, newTypeAlias);
    };

    /**
     * Creates a mutation to add types to a node without a type, if any are new.
     * 
     * @param begin   Starting position to add types at.
     * @param declaredType   Declared type from the node.
     * @param allAssignedTypes   Types now assigned to the node.
     * @returns Mutation to add any new assigned types, if any are missing from the declared type.
     */
    public createTypeCreationMutation(
        begin: number,
        declaredType: ts.Type,
        allAssignedTypes: ReadonlyArray<ts.Type>,
    ): ITextInsertMutation | undefined {
        // Find the already assigned flags and symbols, as well as any missing ones
        const { assignedFlags, assignedTypes, missingFlags, missingTypes } = this.collectUsageFlagsAndSymbols(declaredType, allAssignedTypes);

        // If nothing is missing, rejoice! The type was already fine.
        if (missingFlags.size === 0 && missingTypes.size === 0) {
            return undefined;
        }

        // Join the missing types into a type string to declare
        const newTypeAlias = joinIntoType(assignedFlags, assignedTypes, this.options.typeAliases);

        // Create a mutation insertion that adds the assigned types in
        return createTypescriptTypeCreationMutation(begin, newTypeAlias);
    };

    private collectUsageFlagsAndSymbols(declaredType: ts.Type, allAssignedTypes: ReadonlyArray<ts.Type>) {
        const [declaredFlags, declaredTypes] = this.collectFlagsAndTypesFromTypes(declaredType);
        const [assignedFlags, assignedTypes] = this.collectFlagsAndTypesFromTypes(...allAssignedTypes);

        const missingFlags = setSubtract(assignedFlags, declaredFlags);
        const missingTypes = this.findMissingTypes(assignedTypes, declaredTypes);

        return { assignedFlags, assignedTypes, missingFlags, missingTypes };
    }

    private collectFlagsAndTypesFromTypes(...allTypes: ts.Type[]): [ReadonlySet<string>, ReadonlySet<ts.Type>] {
        const foundFlags = new Set<string>();
        const foundTypes = new Set<ts.Type>();

        // Scan each type for undeclared type additions
        for (const type of allTypes) {
            // For any simple type flag, add its alias if it's in the assigned type but not the declared type
            for (const [typeFlag, alias] of this.knownTypeFlagsWithAliases) {
                if (isTypeFlagSetRecursively(type, typeFlag)) {
                    foundFlags.add(alias);
                }
            }

            // If the type is an intersection, add any flags or types found within it
            if ("types" in type) {
                const subTypes = recursivelyCollectSubTypes(type);
                const [subFlags, deepSubTypes] = this.collectFlagsAndTypesFromTypes(...subTypes);

                for (const subFlag of subFlags) {
                    foundFlags.add(subFlag);
                }

                for (const deepSubType of deepSubTypes) {
                    foundTypes.add(deepSubType);
                }
            }
            // If the type otherwise is a rich type (has a symbol), add it in directly
            else if (type.getSymbol() !== undefined) {
                foundTypes.add(type);
            }
        }

        return [foundFlags, foundTypes];
    }

    private findMissingTypes(assignedTypes: ReadonlySet<ts.Type>, declaredTypes: ReadonlySet<ts.Type>): ReadonlySet<ts.Type> {
        const rootLevelAssignedTypes = new Set(assignedTypes);

        const shouldRemoveAssignedType = (assignedType: ts.Type) => {
            for (const potentialParentType of [...assignedTypes, ...declaredTypes]) {
                if (areTypesRoughlyEqual(assignedType, potentialParentType)) {
                    continue;
                }

                if (this.typeIsChildOf(assignedType, potentialParentType)) {
                    return true;
                }
            }

            return false;
        };

        for (const assignedType of assignedTypes) {
            if (shouldRemoveAssignedType(assignedType)) {
                rootLevelAssignedTypes.delete(assignedType);
            }
        }

        return setSubtract(rootLevelAssignedTypes, declaredTypes);
    }

    private typeIsChildOf(child: ts.Type, potentialParent: ts.Type): boolean {
        if (areTypesRoughlyEqual(child, potentialParent)) {
            return true;
        }

        if (!isInterfaceType(child) || !isInterfaceType(potentialParent)) {
            return false;
        }

        if (child.getSymbol() !== undefined && child.getSymbol() === potentialParent.getSymbol()) {
            return true;
        }

        const typeChecker = this.services.program.getTypeChecker();
        const childBaseTypes = typeChecker.getBaseTypes(child);

        for (const baseType of childBaseTypes) {
            if (isInterfaceType(baseType)) {
                if (this.typeIsChildOf(baseType, potentialParent)) {
                    return true;
                }
            }

            if (isIntersectionType(baseType)) {
                for (const type of baseType.types) {
                    if (this.typeIsChildOf(type, potentialParent)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }
}

const areTypesRoughlyEqual = (a: ts.Type, b: ts.Type) => {
    return a.flags === b.flags && a.symbol.name === b.symbol.name;
}

const isInterfaceType = (type: ts.Type): type is ts.InterfaceType => {
    return (type.flags & ts.ObjectFlags.ClassOrInterface) !== 0;
};

const isIntersectionType = (type: ts.Type): type is ts.IntersectionType => {
    return (type.flags & ts.TypeFlags.Intersection) !== 0;
};

const recursivelyCollectSubTypes = (type: ts.IntersectionType): ts.Type[] => {
    const subTypes: ts.Type[] = [];

    for (const subType of type.types) {
        if (isIntersectionType(subType)) {
            subTypes.push(...recursivelyCollectSubTypes(subType));
        } else {
            subTypes.push(subType);
        }
    }

    return subTypes;
};
