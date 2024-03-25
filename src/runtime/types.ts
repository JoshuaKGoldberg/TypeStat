import { MutationsWave } from "automutate";

import { TypeStatOptions } from "../options/types.js";

export interface ProvidedMutationsWave {
	mutationsWave?: MutationsWave;
	newOptions?: TypeStatOptions;
}

export type Provider = () =>
	| Promise<ProvidedMutationsWave | undefined>
	| ProvidedMutationsWave
	| undefined;

export type ProviderCreator = (
	options: TypeStatOptions,
) => Provider | undefined;
