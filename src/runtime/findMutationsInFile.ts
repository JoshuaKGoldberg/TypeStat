import { IMutation } from "automutate";
import chalk from "chalk";
import * as ts from "typescript";

import { allMutators } from "../mutators/allMutators";
import { MutatorMatcher } from "../mutators/mutatorMatcher";
import { TypeUpOptions } from "../options/types";
import { LanguageServices } from "../services/language";
import { FileInfoCache } from "./FileInfoCache";

/**
 * Metadata and settings to collect mutations in a file.
 */
export interface FileMutationsRequest {
    readonly fileInfoCache: FileInfoCache;
    readonly options: TypeUpOptions;
    readonly services: LanguageServices;
    readonly sourceFile: ts.SourceFile;
}

/**
 * Collects all mutations that should apply to a file.
 */
export const findMutationsInFile = async (request: FileMutationsRequest): Promise<ReadonlyArray<IMutation>> => {
    process.stdout.write(chalk.grey(`Checking ${chalk.bold(request.sourceFile.fileName)}...`));
    const mutations: IMutation[] = [];
    const matcher = new MutatorMatcher(allMutators);

    const visitNode = (node: ts.Node) => {
        for (const mutator of matcher.getMutators(node)) {
            const mutation = mutator.run(node, request);

            if (mutation !== undefined) {
                mutations.push(mutation);
            }
        }

        ts.forEachChild(node, visitNode);
    };

    ts.forEachChild(request.sourceFile, visitNode);

    if (mutations.length === 0) {
        process.stdout.write(chalk.grey(" nothing going.\n"));
    } else {
        process.stdout.write(` ${chalk.green(`${mutations.length}`)} found.\n`);
    }

    return mutations;
};
