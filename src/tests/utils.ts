// Copy from https://github.com/JoshuaKGoldberg/ts-api-utils/blob/dce51e83093c9523b397d325ef6233d39335b2da/src/test/utils.ts

import * as tsvfs from "@typescript/vfs";
import ts from "typescript";

export function createNodeAndSourceFile<Node extends ts.Node>(
	sourceText: string,
): { node: Node; sourceFile: ts.SourceFile } {
	const sourceFile = createSourceFile(sourceText);
	const statement = sourceFile.statements.at(-1)!;

	const node = (ts.isExpressionStatement(statement)
		? statement.expression
		: statement) as unknown as Node;

	return { node, sourceFile };
}

export function createSourceFile(sourceText: string): ts.SourceFile {
	return ts.createSourceFile(
		"file.tsx",
		sourceText,
		ts.ScriptTarget.ESNext,
		true,
	);
}

export function createNode<Node extends ts.Node>(
	nodeOrSourceText: Node | string,
): Node {
	if (typeof nodeOrSourceText !== "string") {
		return nodeOrSourceText;
	}

	return createNodeAndSourceFile<Node>(nodeOrSourceText).node;
}

interface SourceFileAndTypeChecker {
	sourceFile: ts.SourceFile;
	typeChecker: ts.TypeChecker;
}

export function createSourceFileAndTypeChecker(
	sourceText: string,
	fileName = "file.tsx",
): SourceFileAndTypeChecker {
	const compilerOptions: ts.CompilerOptions = {
		lib: ["ES2018"],
		target: ts.ScriptTarget.ES2018,
	};

	const fsMap = tsvfs.createDefaultMapFromNodeModules(compilerOptions, ts);
	fsMap.set(fileName, sourceText);

	const system = tsvfs.createSystem(fsMap);
	const env = tsvfs.createVirtualTypeScriptEnvironment(
		system,
		[fileName],
		ts,
		compilerOptions,
	);

	const program = env.languageService.getProgram();
	if (program === undefined) {
		throw new Error("Failed to get program.");
	}

	return {
		sourceFile: program.getSourceFile(fileName)!,
		typeChecker: program.getTypeChecker(),
	};
}
