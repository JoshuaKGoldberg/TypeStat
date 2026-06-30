(function () {
	function receivesPair(text: string | number, enabled: boolean | string): void {
		console.log(text, enabled);
	}

	receivesPair("known", true);
	receivesPair(123, "yes");
})();
