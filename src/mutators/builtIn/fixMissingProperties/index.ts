import { findFirstMutations } from "../../../shared/runtime";
import { FileMutationsRequest } from "../../fileMutator";

import { fixMissingPropertyAccesses } from "./fixMissingPropertyAccesses";

export const fixMissingProperties = (request: FileMutationsRequest) =>
    request.options.fixes.missingProperties
        ? findFirstMutations(request, [["fixMissingPropertyAccesses", fixMissingPropertyAccesses]])
        : undefined;
