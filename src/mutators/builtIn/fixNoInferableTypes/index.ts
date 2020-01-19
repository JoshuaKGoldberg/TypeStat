import { findFirstMutations } from "../../../shared/runtime";
import { FileMutationsRequest } from "../../fileMutator";

import { fixNoInferableTypesParameters } from "./fixNoInferableTypesParameters";
import { fixNoInferableTypesPropertyDeclarations } from "./fixNoInferableTypesPropertyDeclarations";
import { fixNoInferableTypesVariableDeclarations } from "./fixNoInferableTypesVariableDeclarations";

export const fixNoInferableTypes = (request: FileMutationsRequest) =>
    request.options.fixes.noInferableTypes
        ? findFirstMutations(request, [
              ["fixNoInferableTypesParameters", fixNoInferableTypesParameters],
              ["fixNoInferableTypesPropertyDeclarations", fixNoInferableTypesPropertyDeclarations],
              ["fixNoInferableTypesVariableDeclarations", fixNoInferableTypesVariableDeclarations],
          ])
        : undefined;
