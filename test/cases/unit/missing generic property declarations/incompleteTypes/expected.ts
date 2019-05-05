(function () {
    class Component<TState = {}> {
        state: TState;
    }

    type ClickableState = {
        clicked: boolean;
    };

    class Clickable extends Component<ClickableState> {
        constructor() {
            super();
            this.state = {
                clicked: true,
            };
        }
    }
})();
