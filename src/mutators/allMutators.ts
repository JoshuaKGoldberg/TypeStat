import { propertyMutator } from "../mutators/propertyMutator";
import { variableMutator } from "../mutators/variableMutator";
import { Mutator } from "../runtime/mutator";
import { returnMutator } from "./returnMutator";

export const allMutators: ReadonlyArray<Mutator> = [
    propertyMutator,
    returnMutator,
    variableMutator,
];
