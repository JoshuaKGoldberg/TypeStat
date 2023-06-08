import { MutationsWave } from "automutate";
import { TypeStatOptions } from "../options/types";

export interface ProvidedMutationsWave {
    mutationsWave?: MutationsWave;
    newOptions?: TypeStatOptions;
}

export type Provider = () => ProvidedMutationsWave | undefined | Promise<ProvidedMutationsWave | undefined>;

export type ProviderCreator = (options: TypeStatOptions) => Provider | undefined;
