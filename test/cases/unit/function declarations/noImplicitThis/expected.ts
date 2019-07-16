(function() {
    const returnThisMember = function (this: Container) {
        return this.member;
    }

    class Container {
        member = "sample";
        returnThisMember = returnThisMember;
    };
})();
