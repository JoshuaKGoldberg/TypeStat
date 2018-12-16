import { FileMutator } from "./fileMutator";
import { functionThisMutator } from "./functionThisMutator";
import { parameterMutator } from "./parameterMutator";
import { propertyAccessExpressionMutator } from "./propertyAccessExpressionMutator";
import { propertyDeclarationMutator } from "./propertyDeclarationMutator";
import { returnMutator } from "./returnThisMutator";
import { variableMutator } from "./variableMutator";

export const defaultFileMutators: ReadonlyArray<[string, FileMutator]> = [
    ["variableMutator", variableMutator],
    ["returnMutator", returnMutator],
    ["propertyDeclarationMutator", propertyDeclarationMutator],
    ["parameterMutator", parameterMutator],
    ["propertyAccessExpressionMutator", propertyAccessExpressionMutator],
    ["functionThisMutator", functionThisMutator],
];
