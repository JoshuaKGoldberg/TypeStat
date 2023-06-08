import { findFirstMutations } from "../../../shared/runtime";
import { FileMutationsRequest } from "../../../shared/fileMutator";

import { fixStrictNonNullAssertionBinaryExpressions } from "./fixStrictNonNullAssertionBinaryExpressions";
import { fixStrictNonNullAssertionCallExpressions } from "./fixStrictNonNullAssertionCallExpressions";
import { fixStrictNonNullAssertionObjectLiterals } from "./fixStrictNonNullAssertionObjectLiterals";
import { fixStrictNonNullAssertionPropertyAccesses } from "./fixStrictNonNullAssertionPropertyAccesses";
import { fixStrictNonNullAssertionReturnTypes } from "./fixStrictNonNullAssertionReturnTypes";

export const fixStrictNonNullAssertions = (request: FileMutationsRequest) =>
    request.options.fixes.strictNonNullAssertions
        ? findFirstMutations(request, [
              ["fixStrictNonNullAssertionBinaryExpressions", fixStrictNonNullAssertionBinaryExpressions],
              ["fixStrictNonNullAssertionCallExpressions", fixStrictNonNullAssertionCallExpressions],
              ["fixStrictNonNullAssertionObjectLiterals", fixStrictNonNullAssertionObjectLiterals],
              ["fixStrictNonNullAssertionPropertyAccesses", fixStrictNonNullAssertionPropertyAccesses],
              ["fixStrictNonNullAssertionReturnTypes", fixStrictNonNullAssertionReturnTypes],
          ])
        : undefined;
