(function() {
    const returnThisMember = function () {
        return this.member;
    }

    class Container {
        member = "sample";
        returnThisMember = returnThisMember;
    };
})();
