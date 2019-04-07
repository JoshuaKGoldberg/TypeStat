# Incomplete React Types

React components can have types their props and states filled in using:

* Component classes:
  * `static propTypes = ...` properties
  * Later-assigned `.propTypes = ...` properties
* Functional components: `propTypes` properties
* Both: regular usage in JSX

Component classes will generate `interface`s, while functional components will generate `type`s.

For example, the change to this `NameGreeter` component would be:

```diff
+ interface NameGreeterProps {
+     name: string;
+ }

- class NameGreeter extends React.Component {
+ class NameGreeter extends React.Component<NameGreeterProps> {
    static propTypes = {
        name: PropTypes.string.isRequired,
    };

    render() {
        return `Hello, ${this.props.name}!`;
    }
}
```

> So far, only `static propTypes` are implemented.
> See [#129](https://github.com/JoshuaKGoldberg/TypeStat/pull/129) for tracking on more!
