import * as tsutils from "ts-api-utils";
import ts from "typescript";

/**
 * Checks if a type contains a type flag, accounting for deep nested type unions.
 * @param parentType   Parent type to check for the type flag.
 * @param typeFlag   Type flag to check within the parent type.
 * @returns Whether the parent type contains the type flag.
 */
export const isTypeFlagSetRecursively = (
	parentType: ts.Type,
	typeFlag: ts.TypeFlags,
): boolean => {
	if (tsutils.isTypeFlagSet(parentType, typeFlag)) {
		return true;
	}

	if (tsutils.isUnionOrIntersectionType(parentType)) {
		for (const childType of parentType.types) {
			if (isTypeFlagSetRecursively(childType, typeFlag)) {
				return true;
			}
		}
	}

	return false;
};
