(function () {
    class Example {
        method(): void {
            document.body.querySelectorAll("*").forEach((child) => Array.from(child.classList));
        }
    }
})();
