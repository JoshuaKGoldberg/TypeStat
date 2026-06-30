(function () {
	function receivesPair(text: string, enabled: boolean): void {
		console.log(text, enabled);
	}

	receivesPair("known", true);
	receivesPair(123, "yes");
})();
