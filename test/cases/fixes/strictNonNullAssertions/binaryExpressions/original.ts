(function () {
    function improperStringOrUndefined(text: string | undefined) {
        let recipient = '';
        recipient = text;
    }

    function improperStringOrNull(text: string | null) {
        let recipient = '';
        recipient = text;
    }

    function improperStringOrNullOrUndefined(text: string | null | undefined) {
        let recipient = '';
        recipient = text;
    }

    function properStringOrUndefined(text: string | undefined) {
        let recipient = Math.random() ? '' : undefined;
        recipient = text;
    }

    function properStringOrNull(text: string | null) {
        let recipient = Math.random() ? '' : null;
        recipient = text;
    }

    function properStringOrNullOrUndefined(text: string | null | undefined) {
        let recipient = Math.random() ? '' : undefined;
        recipient = text;
    }
})();
