import { IMutation } from "automutate";
import * as ts from "typescript";

import { TypeStatOptions } from "../options/types";
import { LanguageServices } from "../services/language";
import { FileInfoCache } from "../shared/FileInfoCache";
import { NameGenerator } from "../shared/NameGenerator";

import { MutationsComplaint } from "./complaint";

/**
 * Source file, metadata, and settings to collect mutations in the file.
 */
export interface FileMutationsRequest {
    readonly fileInfoCache: FileInfoCache;
    readonly filteredNodes: Set<ts.Node>;
    readonly nameGenerator: NameGenerator;
    readonly options: TypeStatOptions;
    readonly services: LanguageServices;
    readonly sourceFile: ts.SourceFile;
}

/**
 * Finds mutations of a certain node type to run on a file.
 *
 * @param request   Source file, metadata, and settings to collect mutations in the file.
 * @returns Any mutations found to apply to the file, or a wrapped error complaint, if either is found.
 */
export type FileMutator = (request: FileMutationsRequest) => readonly IMutation[] | MutationsComplaint | undefined;
