(function () {
    class Component<TState = {}> {
        state: TState;
    }

    class Clickable extends Component {
        constructor() {
            super();
            this.state = {
                clicked: true,
            };
        }
    }
})();
