const fs = require("node:fs/promises");
const { EOL } = require("node:os");

const writeToFiles = async () => {
	for (const filePath of process.argv.slice(2)) {
		await fs.writeFile(
			filePath,
			["// Processed!", await fs.readFile(filePath)].join(EOL.repeat(2)),
		);
	}
};

writeToFiles();
