import { FileMutator } from "./fileMutator";
import { functionThisMutator } from "./functionThisMutator";
import { parameterMutator } from "./parameterMutator";
import { propertyMutator } from "./propertyMutator";
import { returnMutator } from "./returnMutator";
import { variableMutator } from "./variableMutator";

export const defaultFileMutators: ReadonlyArray<[string, FileMutator]> = [
    ["propertyMutator", propertyMutator],
    ["returnMutator", returnMutator],
    ["variableMutator", variableMutator],
    ["parameterMutator", parameterMutator],
    ["functionThisMutator", functionThisMutator],
];
