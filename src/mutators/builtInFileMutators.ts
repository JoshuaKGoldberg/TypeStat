import { binaryExpressionMutator } from "./builtIn/binaryExpressionMutator";
import { callExpressionMutator } from "./builtIn/callExpressionMutator";
import { classDeclarationMutator } from "./builtIn/classDeclarationMutator";
import { functionThisMutator } from "./builtIn/functionThisMutator";
import { parameterMutator } from "./builtIn/parameterMutator";
import { propertyAccessExpressionMutator } from "./builtIn/propertyAccessExpressionMutator";
import { propertyDeclarationMutator } from "./builtIn/propertyDeclarationMutator";
import { returnTypeMutator } from "./builtIn/returnTypeMutator";
import { variableDeclarationMutator } from "./builtIn/variableDeclarationMutator";
import { FileMutator } from "./fileMutator";

export const builtInFileMutators: ReadonlyArray<[string, FileMutator]> = [
    ["binaryExpressionMutator", binaryExpressionMutator],
    ["callExpression", callExpressionMutator],
    ["classDeclaration", classDeclarationMutator],
    ["variableDeclarationMutator", variableDeclarationMutator],
    ["returnTypeMutator", returnTypeMutator],
    ["propertyDeclarationMutator", propertyDeclarationMutator],
    ["parameterMutator", parameterMutator],
    ["propertyAccessExpressionMutator", propertyAccessExpressionMutator],
    ["functionThisMutator", functionThisMutator],
];
