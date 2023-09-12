import * as https from "https";

/**
 * Removes package names that don't have a corresponding DefinitelyTyped package.
 * @param packageNames   Package names to filter.
 * @returns Promise for just the package names with a corresponding DefinitelyTyped package.
 */
export const filterTypedPackageNames = async (
	packageNames: readonly string[],
) => {
	const processedPackageNames = await Promise.all(
		packageNames.map(filterTypedPackageName),
	);

	return processedPackageNames.filter(
		(packageName): packageName is string => packageName !== undefined,
	);
};

const filterTypedPackageName = async (
	packageName: string,
): Promise<string | undefined> => {
	return new Promise((resolve) => {
		https.get(
			`https://www.npmjs.com/package/@types/${packageName}`,
			(result) => {
				resolve(result.statusCode === 200 ? packageName : undefined);
			},
		);
	});
};
