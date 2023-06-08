import * as ts from "typescript";

import {
    DiagnosticWithStart,
    getLineForDiagnostic,
    isDiagnosticWithStart,
    stringifyDiagnosticMessageText,
} from "../../../shared/diagnostics";
import { FileMutator } from "../../../shared/fileMutator";

export const suppressRemainingTypeIssues: FileMutator = (request) => {
    if (!request.options.cleanups.suppressTypeErrors) {
        return undefined;
    }

    const allDiagnostics = request.services.program.getSemanticDiagnostics(request.sourceFile).filter(isDiagnosticWithStart);
    if (!allDiagnostics.length) {
        return undefined;
    }

    const diagnosticsPerLine = new Map<number, DiagnosticWithStart[]>();

    for (const diagnostic of allDiagnostics) {
        const line = getLineForDiagnostic(diagnostic, request.sourceFile);
        const existing = diagnosticsPerLine.get(line);

        if (existing) {
            existing.push(diagnostic);
        } else {
            diagnosticsPerLine.set(line, [diagnostic]);
        }
    }

    return Array.from(diagnosticsPerLine).map(([line, diagnostics]) => {
        const messages = diagnostics.map(stringifyDiagnosticMessageText).join(" ");
        return {
            insertion: `// @ts-expect-error -- TODO: ${messages}\n`,
            range: {
                begin: ts.getPositionOfLineAndCharacter(request.sourceFile, line, 0),
            },
            type: "text-insert",
        };
    });
};
