import * as tsutils from "tsutils";
import * as ts from "typescript";

export class FileInfoCache {
    private variableUsage: ReadonlyMap<ts.Identifier, tsutils.VariableInfo> | undefined;;

    public constructor(
        private readonly sourceFile: ts.SourceFile,
    ) { }
    
    public getVariableUsage(): ReadonlyMap<ts.Identifier, tsutils.VariableInfo> {
        if (this.variableUsage === undefined) {
            this.variableUsage = tsutils.collectVariableUsage(this.sourceFile);
        }

        return this.variableUsage;
    }
}
