module.exports = {
	plugins: [
		"@babel/plugin-proposal-nullish-coalescing-operator",
		"@babel/plugin-proposal-optional-chaining",
	],
	presets: [
		["@babel/preset-env", { targets: { node: "current" } }],
		"@babel/preset-typescript",
	],
};
