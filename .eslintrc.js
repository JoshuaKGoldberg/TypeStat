module.exports = {
    env: {
        es6: true,
        node: true,
    },
    extends: [
        "plugin:import/errors",
        "plugin:import/typescript",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "prettier",
        "prettier/@typescript-eslint",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.json",
        sourceType: "module",
    },
    plugins: ["import", "no-only-tests"],
    rules: {
        // These rules might eventually be useful, but haven't been tried out in TypeStat
        "@typescript-eslint/prefer-regexp-exec": "off",

        // These rules are off because we don't want them
        "@typescript-eslint/unbound-method": "off",
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-use-before-define": "off",
    },
};
