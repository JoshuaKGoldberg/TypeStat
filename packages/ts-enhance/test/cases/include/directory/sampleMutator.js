const prefix = "/* foo */ ";

module.exports.fileMutator = (request) => {
	return request.sourceFile.getFullText().indexOf(prefix) === -1
		? [
				{
					insertion: prefix,
					range: {
						begin: 0,
					},
					type: "text-insert",
				},
		  ]
		: [];
};
