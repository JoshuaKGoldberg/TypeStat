import * as ts from "typescript";

import { FileMutationsRequest } from "../../mutators/fileMutator";

/**
 * Type flags and aliases to check when --strictNullChecks is not enabled.
 */
const nonStrictTypeFlagAliases = new Map([
    [ts.TypeFlags.Boolean, "boolean"],
    [ts.TypeFlags.BooleanLiteral, "boolean"],
    [ts.TypeFlags.Number, "number"],
    [ts.TypeFlags.NumberLiteral, "number"],
    [ts.TypeFlags.String, "string"],
    [ts.TypeFlags.StringLiteral, "string"],
]);

/**
 * Type flags and aliases to check when --strictNullChecks is enabled.
 */
const strictTypeFlagsWithAliases = new Map([
    ...nonStrictTypeFlagAliases,
    [ts.TypeFlags.Null, "null"],
    [ts.TypeFlags.Undefined, "undefined"],
]);

/**
 * @returns Built-in type flags and aliases per overall request strictNullChecks setting.
 */
export const getApplicableTypeAliases = (request: FileMutationsRequest, alwaysAllowStrictNullCheckAliases = false) =>
    alwaysAllowStrictNullCheckAliases ||
    request.options.types.strictNullChecks ||
    request.services.program.getCompilerOptions().strictNullChecks
        ? strictTypeFlagsWithAliases
        : nonStrictTypeFlagAliases;
