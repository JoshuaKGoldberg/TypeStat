import { callExpressionMutator } from "./builtIn/callExpressionMutator";
import { functionThisMutator } from "./builtIn/functionThisMutator";
import { parameterMutator } from "./builtIn/parameterMutator";
import { propertyAccessExpressionMutator } from "./builtIn/propertyAccessExpressionMutator";
import { propertyDeclarationMutator } from "./builtIn/propertyDeclarationMutator";
import { returnTypeMutator } from "./builtIn/returnTypeMutator";
import { variableDeclarationMutator } from "./builtIn/variableDeclarationMutator";
import { FileMutator } from "./fileMutator";

export const builtInFileMutators: ReadonlyArray<[string, FileMutator]> = [
    ["callExpression", callExpressionMutator],
    ["variableDeclarationMutator", variableDeclarationMutator],
    ["returnTypeMutator", returnTypeMutator],
    ["propertyDeclarationMutator", propertyDeclarationMutator],
    ["parameterMutator", parameterMutator],
    ["propertyAccessExpressionMutator", propertyAccessExpressionMutator],
    ["functionThisMutator", functionThisMutator],
];
