import { FileMutator } from "../runtime/mutator";
import { propertyMutator } from "./propertyMutator";
import { returnMutator } from "./returnMutator";
import { variableMutator } from "./variableMutator";

export const defaultFileMutators: ReadonlyArray<FileMutator> = [
    propertyMutator,
    returnMutator,
    variableMutator,
];
