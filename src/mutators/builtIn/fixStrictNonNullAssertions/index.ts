import { findFirstMutations } from "../../../shared/runtime";
import { FileMutationsRequest } from "../../fileMutator";

import { fixStrictNonNullAssertionBinaryExpressions } from "./fixStrictNonNullAssertionBinaryExpressions";
import { fixStrictNonNullAssertionCallExpressions } from "./fixStrictNonNullAssertionCallExpressions";
import { fixStrictNonNullAssertionPropertyAccesses } from "./fixStrictNonNullAssertionPropertyAccesses";
import { fixStrictNonNullAssertionReturnTypes } from "./fixStrictNonNullAssertionReturnTypes";

export const fixStrictNonNullAssertions = (request: FileMutationsRequest) =>
    request.options.fixes.strictNonNullAssertions
        ? findFirstMutations(request, [
              ["fixStrictNonNullAssertionBinaryExpressions", fixStrictNonNullAssertionBinaryExpressions],
              ["fixStrictNonNullAssertionCallExpressions", fixStrictNonNullAssertionCallExpressions],
              ["fixStrictNonNullAssertionPropertyAccesses", fixStrictNonNullAssertionPropertyAccesses],
              ["fixStrictNonNullAssertionReturnTypes", fixStrictNonNullAssertionReturnTypes],
          ])
        : undefined;
