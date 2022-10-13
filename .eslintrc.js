module.exports = {
    extends: ["plugin:@typescript-eslint/recommended", "plugin:@typescript-eslint/recommended-requiring-type-checking", "prettier"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.eslint.json",
        sourceType: "module",
    },
    plugins: ["deprecation", "no-only-tests"],
    rules: {
        "deprecation/deprecation": "error",
        "no-only-tests/no-only-tests": "error",

        // These rules are off because we don't want them
        // "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
    },
};
