import { Mutation } from "automutate";
import * as ts from "typescript";

import { MutationsComplaint } from "../mutators/complaint.js";
import { TSEnhanceOptions } from "../options/types.js";
import { LanguageServices } from "../services/language.js";
import { FileInfoCache } from "./FileInfoCache.js";
import { NameGenerator } from "./NameGenerator.js";

/**
 * Source file, metadata, and settings to collect mutations in the file.
 */
export interface FileMutationsRequest {
	readonly fileInfoCache: FileInfoCache;
	readonly filteredNodes: Set<ts.Node>;
	readonly nameGenerator: NameGenerator;
	readonly options: TSEnhanceOptions;
	readonly services: LanguageServices;
	readonly sourceFile: ts.SourceFile;
}

/**
 * Finds mutations of a certain node type to run on a file.
 * @param request   Source file, metadata, and settings to collect mutations in the file.
 * @returns Any mutations found to apply to the file, or a wrapped error complaint, if either is found.
 */
export type FileMutator = (
	request: FileMutationsRequest,
) => MutationsComplaint | readonly Mutation[] | undefined;
