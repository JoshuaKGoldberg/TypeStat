import enruirer from "enquirer";

export enum InitializationImports {
	No = "No",
	Yes = "Yes",
}

export const initializeImports = async () => {
	const { imports } = await enruirer.prompt<{ imports: InitializationImports }>(
		[
			{
				choices: [InitializationImports.No, InitializationImports.Yes],
				initial: 1,
				message:
					"Would you like imports without extensions to have those extensions added in?",
				name: "imports",
				type: "select",
			},
		],
	);

	return imports;
};
