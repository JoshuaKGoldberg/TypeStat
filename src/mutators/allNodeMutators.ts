import { NodeMutator } from "../runtime/mutator";
import { propertyMutator } from "./propertyMutator";
import { returnMutator } from "./returnMutator";
import { variableMutator } from "./variableMutator";

export const allNodeMutators: ReadonlyArray<NodeMutator> = [
    propertyMutator,
    returnMutator,
    variableMutator,
];
