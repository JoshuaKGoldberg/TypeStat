import { functionThisMutator } from "./builtIn/functionThisMutator";
import { parameterMutator } from "./builtIn/parameterMutator";
import { propertyAccessExpressionMutator } from "./builtIn/propertyAccessExpressionMutator";
import { propertyDeclarationMutator } from "./builtIn/propertyDeclarationMutator";
import { returnMutator } from "./builtIn/returnThisMutator";
import { variableMutator } from "./builtIn/variableMutator";
import { FileMutator } from "./fileMutator";

export const builtInFileMutators: ReadonlyArray<[string, FileMutator]> = [
    ["variableMutator", variableMutator],
    ["returnMutator", returnMutator],
    ["propertyDeclarationMutator", propertyDeclarationMutator],
    ["parameterMutator", parameterMutator],
    ["propertyAccessExpressionMutator", propertyAccessExpressionMutator],
    ["functionThisMutator", functionThisMutator],
];
