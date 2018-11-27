import { IMutation } from "automutate";
import chalk from "chalk";
import * as ts from "typescript";

import { allNodeMutators } from "../mutators/allNodeMutators";
import { MutatorMatcher } from "../mutators/mutatorMatcher";
import { TypeStatOptions } from "../options/types";
import { MutationPrinter } from "../printing/MutationsPrinter";
import { LanguageServices } from "../services/language";
import { FileInfoCache } from "./FileInfoCache";

/**
 * Metadata and settings to collect mutations in a file.
 */
export interface FileMutationsRequest {
    readonly fileInfoCache: FileInfoCache;
    readonly options: TypeStatOptions;
    readonly services: LanguageServices;
    readonly sourceFile: ts.SourceFile;
}

/**
 * Collects all mutations that should apply to a file.
 */
export const findMutationsInFile = async (fileRequest: FileMutationsRequest): Promise<ReadonlyArray<IMutation>> => {
    fileRequest.options.logger.write(chalk.grey(`Checking ${chalk.bold(fileRequest.sourceFile.fileName)}...`));
    const mutations: IMutation[] = [];
    const matcher = new MutatorMatcher(allNodeMutators);
    const nodeRequest = {
        ...fileRequest,
        printer: new MutationPrinter(fileRequest),
    };

    const visitNode = (node: ts.Node) => {
        for (const mutator of matcher.getMutators(node)) {
            const mutation = mutator.run(node, nodeRequest);

            if (mutation !== undefined) {
                mutations.push(mutation);
            }
        }

        ts.forEachChild(node, visitNode);
    };

    ts.forEachChild(fileRequest.sourceFile, visitNode);

    if (mutations.length === 0) {
        fileRequest.options.logger.write(chalk.grey(" nothing going.\n"));
    } else {
        fileRequest.options.logger.write(` ${chalk.green(`${mutations.length}`)} found.\n`);
    }

    return mutations;
};
