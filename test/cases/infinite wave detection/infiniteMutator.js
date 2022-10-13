module.exports.fileMutator = () => {
    return [
        {
            insertion: "/* This should extend only to line 25 */\n",
            range: {
                begin: 0,
            },
            type: "text-insert",
        },
    ];
};
