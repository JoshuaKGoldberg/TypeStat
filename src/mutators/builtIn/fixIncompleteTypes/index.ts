import { findFirstMutations } from "../../../shared/runtime";
import { FileMutationsRequest } from "../../fileMutator";

import { fixIncompleteParameterTypes } from "./fixIncompleteParameterTypes";
import { fixIncompletePropertyDeclarationTypes } from "./fixIncompletePropertyDeclarationTypes";
import { fixIncompleteReactTypes } from "./fixIncompleteReactTypes";
import { fixIncompleteReturnTypes } from "./fixIncompleteReturnTypes";
import { fixIncompleteVariableTypes } from "./fixIncompleteVariableTypes";

export const fixIncompleteTypes = (request: FileMutationsRequest) =>
    request.options.fixes.incompleteTypes
        ? findFirstMutations(request, [
              ["fixIncompleteParameterTypes", fixIncompleteParameterTypes],
              ["fixIncompletePropertyDeclarationTypes", fixIncompletePropertyDeclarationTypes],
              ["fixIncompleteReactTypes", fixIncompleteReactTypes],
              ["fixIncompleteReturnTypes", fixIncompleteReturnTypes],
              ["fixIncompleteVariableTypes", fixIncompleteVariableTypes],
          ])
        : undefined;
