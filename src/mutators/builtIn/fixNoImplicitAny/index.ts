import { findFirstMutations } from "../../../shared/runtime";
import { FileMutationsRequest } from "../../fileMutator";

import { fixNoImplicitAnyParameters } from "./fixNoImplicitAnyParameters";
import { fixNoImplicitAnyPropertyDeclarations } from "./fixNoImplicitAnyPropertyDeclarations";
import { fixNoImplicitAnyVariableDeclarations } from "./fixNoImplicitAnyVariableDeclarations";

export const fixNoImplicitAny = (request: FileMutationsRequest) =>
    request.options.fixes.noImplicitAny
        ? findFirstMutations(request, [
              ["fixNoImplicitAnyPropertyDeclarations", fixNoImplicitAnyPropertyDeclarations],
              ["fixNoImplicitAnyParameters", fixNoImplicitAnyParameters],
              ["fixNoImplicitAnyVariableDeclarations", fixNoImplicitAnyVariableDeclarations],
          ])
        : undefined;
