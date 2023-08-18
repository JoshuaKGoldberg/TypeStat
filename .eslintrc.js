module.exports = {
    extends: ["eslint:recommended", "plugin:@typescript-eslint/strict-type-checked", "plugin:@typescript-eslint/stylistic-type-checked"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.eslint.json",
        sourceType: "module",
    },
    plugins: ["deprecation", "no-only-tests"],
    rules: {
        "deprecation/deprecation": "error",
        "no-only-tests/no-only-tests": "error",
    },
};
