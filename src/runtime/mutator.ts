import { IMutation } from "automutate";
import * as ts from "typescript";

import { TypeStatOptions } from "../options/types";
import { MutationPrinter } from "../printing/MutationsPrinter";
import { LanguageServices } from "../services/language";
import { FileInfoCache } from "./FileInfoCache";

/**
 * Source file, metadata, and settings to collect mutations in the file.
 */
export interface FileMutationsRequest {
    readonly fileInfoCache: FileInfoCache;
    readonly options: TypeStatOptions;
    readonly printer: MutationPrinter;
    readonly services: LanguageServices;
    readonly sourceFile: ts.SourceFile;
}

/**
 * Finds mutations of a certain type to run on a file.
 * 
 * @param request   Source file, metadata, and settings to collect mutations in the file.
 * @returns Any mutations found to apply to the file.
 */
export type FileMutator = (request: FileMutationsRequest) => ReadonlyArray<IMutation>;
