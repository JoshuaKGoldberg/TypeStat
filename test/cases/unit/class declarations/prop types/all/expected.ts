import React from "react";
import PropTypes from "prop-types";

{

interface MyComponentProps {
    bool?: boolean;
    boolRequired: boolean;
    func?: Function;
    funcRequired: Function;
    instanceOfString?: String;
    instanceOfStringRequired: String;
    node?: ReactNode;
    nodeRequired: ReactNode;
    number?: number;
    numberRequired: number;
    string?: string;
    stringRequired: string;
}

    class MyComponent extends React.Component {
        static propTypes = {
            bool: PropTypes.bool,
            boolRequired: PropTypes.bool.isRequired,
            func: PropTypes.func,
            funcRequired: PropTypes.func.isRequired,
            instanceOfString: PropTypes.instanceOf(String),
            instanceOfStringRequired: PropTypes.instanceOf(String).isRequired,
            node: PropTypes.node,
            nodeRequired: PropTypes.node.isRequired,
            number: PropTypes.number,
            numberRequired: PropTypes.number.isRequired,
            numbers: PropTypes.oneOf([1, 2, 3]),
            numbersRequired: PropTypes.oneOf([1, 2, 3]).isRequired,
            numbersType: PropTypes.oneOfType([PropTypes.number]),
            shape: PropTypes.shape({
                subShape: PropTypes.shape({
                    subSubNumber: PropTypes.number,
                    subSubNumberRequired: PropTypes.number.isRequired,
                }),
                subShapeRequired: PropTypes.shape({
                    subSubNumber: PropTypes.number,
                    subSubNumberRequired: PropTypes.number.isRequired,
                }).isRequired,
            }),
            shapeRequired: PropTypes.shape({
                subShape: PropTypes.shape({
                    subSubNumber: PropTypes.number,
                    subSubNumberRequired: PropTypes.number.isRequired,
                }),
                subShapeRequired: PropTypes.shape({
                    subSubNumber: PropTypes.number,
                    subSubNumberRequired: PropTypes.number.isRequired,
                }).isRequired,
            }).isRequired,
            string: PropTypes.string,
            stringRequired: PropTypes.string.isRequired,
            strings: PropTypes.oneOf([1, 2, 3]),
            stringsRequired: PropTypes.oneOf([1, 2, 3]).isRequired,
            stringsType: PropTypes.oneOfType([PropTypes.string]),
        }
    }
}