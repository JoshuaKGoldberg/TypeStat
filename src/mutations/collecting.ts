import * as tsutils from "ts-api-utils";
import ts from "typescript";

import { FileMutationsRequest } from "../shared/fileMutator.js";
import { isKnownGlobalBaseType } from "../shared/nodeTypes.js";
import { setSubtract } from "../shared/sets.js";
import { getApplicableTypeAliases } from "./aliasing/aliases.js";
import { isTypeFlagSetRecursively } from "./collecting/flags.js";

/**
 * Collects assigned and missing types, recursively accounting for type unions.
 * @param request   Metadata and settings to collect mutations in a file.
 * @param declaredType   Original type declared on a node.
 * @param allAssignedTypes   All types immediately or later assigned to the node.
 */
export const collectUsageSymbols = (
	request: FileMutationsRequest,
	declaredType: ts.Type,
	allAssignedTypes: readonly ts.Type[],
) => {
	// Collect which types are later assigned to the type
	const assignedTypes = collectRawTypesFromTypes(request, allAssignedTypes);

	// If the declared type is the general 'any', then we assume all are missing
	// Similarly, if it's a plain Function or Object, we'll want to replace its contents
	if (
		tsutils.isIntrinsicAnyType(declaredType) ||
		isKnownGlobalBaseType(declaredType)
	) {
		return {
			assignedTypes,
			missingTypes: assignedTypes,
		};
	}

	// Otherwise, collect which types are declared (as a type annotation)...
	const declaredTypes = collectRawTypesFromTypes(request, [declaredType]);

	// Subtract the above to find any types assigned but not declared
	return {
		assignedTypes,
		missingTypes: findMissingTypes(request, assignedTypes, declaredTypes),
	};
};

/**
 * Separates raw type node(s) into their contained types.
 * @param request   Metadata and settings to collect mutations in a file.
 * @param allTypes   Any number of raw type nodes.
 * @returns Types found within the raw type nodes.
 */
export const collectRawTypesFromTypes = (
	request: FileMutationsRequest,
	allTypes: readonly ts.Type[],
): Set<ts.Type> => {
	const foundTypes = new Set<ts.Type>();

	// Scan each type for undeclared type additions
	for (const type of allTypes) {
		// If the type is a union, add any types found within it
		if (tsutils.isUnionType(type)) {
			const subTypes = recursivelyCollectSubTypes(type);
			const deepSubTypes = collectRawTypesFromTypes(request, subTypes);

			for (const deepSubType of deepSubTypes) {
				foundTypes.add(deepSubType);
			}
			continue;
		}

		// Otherwise, it's likely either an intrinsic, primitive, or a shape
		foundTypes.add(type);
	}

	return foundTypes;
};

export const recursivelyCollectSubTypes = (type: ts.UnionType): ts.Type[] => {
	const subTypes: ts.Type[] = [];

	for (const subType of type.types) {
		if (tsutils.isUnionType(subType)) {
			subTypes.push(...recursivelyCollectSubTypes(subType));
		} else {
			subTypes.push(subType);
		}
	}

	return subTypes;
};

const findMissingTypes = (
	request: FileMutationsRequest,
	assignedTypes: ReadonlySet<ts.Type>,
	declaredTypes: ReadonlySet<ts.Type>,
): ReadonlySet<ts.Type> => {
	// If anything is of type `any`, then bail out immediately: we have no idea what's missing
	for (const type of [...assignedTypes, ...declaredTypes]) {
		if (isTypeFlagSetRecursively(type, ts.TypeFlags.Any)) {
			return new Set();
		}
	}

	const declaredTypesContainFunction =
		Array.from(declaredTypes).some(typeContainsFunction);
	const remainingMissingTypes = new Set(assignedTypes);

	const isAssignedTypeMissingFromDeclared = (assignedType: ts.Type) => {
		// We ignore assigned function types when the declared type(s) include function(s).
		// These non-assigned function types are more likely what users would consider bugs.
		// For example, covariant functions might not be assignable, but should be fixed manually.
		if (declaredTypesContainFunction && typeContainsFunction(assignedType)) {
			return false;
		}

		// For each potential missing type:
		for (const potentialParentType of declaredTypes) {
			// If the potential parent type is unknown, then ignore it
			if (potentialParentType.flags === ts.TypeFlags.Unknown) {
				continue;
			}

			// If the assigned type is assignable to it, then it's a no
			if (
				request.services.program
					.getTypeChecker()
					.isTypeAssignableTo(assignedType, potentialParentType)
			) {
				return false;
			}
		}

		return true;
	};

	for (const assignedType of assignedTypes) {
		// The 'void' type shouldn't be assigned to anything, so we ignore it
		if (assignedType.flags === ts.TypeFlags.Void) {
			remainingMissingTypes.delete(assignedType);
		}

		if (!isAssignedTypeMissingFromDeclared(assignedType)) {
			remainingMissingTypes.delete(assignedType);
		}
	}

	return setSubtract(remainingMissingTypes, declaredTypes);
};

const typeContainsFunction = (type: ts.Type) =>
	type.getCallSignatures().length !== 0;
