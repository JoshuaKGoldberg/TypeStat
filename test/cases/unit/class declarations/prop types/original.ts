import React from "react";
import PropTypes from "prop-types";

{
    class MyComponent extends React.Component {
        static propTypes = {
            array: PropTypes.array,
            arrayRequired: PropTypes.array.isRequired,
            bool: PropTypes.bool,
            boolRequired: PropTypes.bool.isRequired,
            element: PropTypes.element,
            elementRequired: PropTypes.element.isRequired,
            func: PropTypes.func,
            funcRequired: PropTypes.func.isRequired,
            instanceOfString: PropTypes.instanceOf(String),
            instanceOfStringRequired: PropTypes.instanceOf(String).isRequired,
            node: PropTypes.node,
            nodeRequired: PropTypes.node.isRequired,
            number: PropTypes.number,
            numberRequired: PropTypes.number.isRequired,
            numbers: PropTypes.arrayOf(PropTypes.number),
            numbersRequired: PropTypes.arrayOf(PropTypes.number).isRequired,
            numbersExact: PropTypes.oneOf([1, 2, 3]),
            numbersExactRequired: PropTypes.oneOf([1, 2, 3]).isRequired,
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
            strings: PropTypes.oneOf(["a", "bc", "def"]),
            stringsRequired: PropTypes.oneOf(["a", "bc", "def"]).isRequired,
            stringsAndNumbers: PropTypes.oneOf(["a", 2, "def", 4]),
            stringsAndNumbersRequired: PropTypes.oneOf(["a", 2, "def", 4]).isRequired,
            stringsType: PropTypes.oneOfType([PropTypes.string]),
            stringsOrNumbersType: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        };
    }
}
