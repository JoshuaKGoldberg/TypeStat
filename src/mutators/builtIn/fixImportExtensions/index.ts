import { TextInsertMutation } from "automutate";
import { glob } from "glob";
import * as path from "path";
import * as ts from "typescript";

import { getTypeAtLocationIfNotError } from "../../../shared/types";
import { collectMutationsFromNodes } from "../../collectMutationsFromNodes";
import { FileMutator, FileMutationsRequest } from "../../../shared/fileMutator";

type ExtensionlessExportOrImport = (ts.ExportDeclaration | ts.ImportDeclaration) & {
    moduleSpecifier: ts.StringLiteral;
};

export const fixImportExtensions: FileMutator = (request: FileMutationsRequest) =>
    request.options.fixes.importExtensions
        ? collectMutationsFromNodes(request, isExtensionlessExportOrImport, visitExportOrImportDeclaration)
        : undefined;

const isExtensionlessExportOrImport = (node: ts.Node): node is ExtensionlessExportOrImport => {
    return (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier !== undefined &&
        ts.isStringLiteral(node.moduleSpecifier) &&
        !path.basename(node.moduleSpecifier.text).includes(".")
    );
};

const visitExportOrImportDeclaration = (
    node: ExtensionlessExportOrImport,
    request: FileMutationsRequest,
): TextInsertMutation | undefined => {
    // If the type of the import is already known, we don't need to fix it
    if (getTypeAtLocationIfNotError(request, node.moduleSpecifier) !== undefined) {
        return undefined;
    }

    // Try each path that the import could resolve to
    const basePath = path.join(path.dirname(request.sourceFile.fileName), node.moduleSpecifier.text);

    for (const filePath of [basePath, path.join(basePath, "index")]) {
        // If no files exist under that path, ignore this possibility
        const possibilities = glob.sync(filePath + ".*");
        if (possibilities.length === 0) {
            continue;
        }

        // Figure out which extension might be relevant (i.e. anything but build artifacts)
        const mostLikely = possibilities.find((possibility) => !/\.(((j|t)sx?)|map)$/.test(possibility));
        if (mostLikely === undefined) {
            continue;
        }

        // Add the file's full extension to the original module specifier
        return {
            insertion: "." + path.basename(mostLikely).split(".").slice(1).join("."),
            range: {
                begin: node.moduleSpecifier.end - 1,
            },
            type: "text-insert",
        };
    }

    return undefined;
};
