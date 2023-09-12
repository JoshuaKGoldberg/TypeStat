import * as ts from "typescript";

import { FileMutationsRequest } from "../../../../../../shared/fileMutator.js";
import { getApparentNameOfComponent } from "../../getApparentNameOfComponent.js";
import { ReactComponentNode } from "../../reactFiltering/isReactComponentNode.js";
import { createPropTypesProperty } from "./propTypesProperties.js";

export const createInterfaceFromPropTypes = (
	request: FileMutationsRequest,
	node: ReactComponentNode,
	propTypes: ts.ObjectLiteralExpression,
) => {
	const members: ts.TypeElement[] = [];

	for (const rawProperty of propTypes.properties) {
		const member = createPropTypesProperty(request, rawProperty);
		if (member !== undefined) {
			members.push(member);
		}
	}

	const interfaceName = `${getApparentNameOfComponent(request, node)}Props`;

	const interfaceNode = ts.factory.createInterfaceDeclaration(
		undefined /* modifiers */,
		interfaceName,
		undefined /* typeParameters */,
		undefined /* heritageClauses */,
		members,
	);

	return { interfaceName, interfaceNode };
};
