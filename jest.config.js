module.exports = {
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    roots: ["<rootDir>/src"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testRegex: "((\\.|/)test)\\.tsx?$",
};
