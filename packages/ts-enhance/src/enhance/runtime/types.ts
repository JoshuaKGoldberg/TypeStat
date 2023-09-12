import { MutationsWave } from "automutate";

import { TSEnhanceOptions } from "../../options/types.js";

export interface ProvidedMutationsWave {
	mutationsWave?: MutationsWave;
	newOptions?: TSEnhanceOptions;
}

export type Provider = () =>
	| Promise<ProvidedMutationsWave | undefined>
	| ProvidedMutationsWave
	| undefined;

export type ProviderCreator = (
	options: TSEnhanceOptions,
) => Provider | undefined;
