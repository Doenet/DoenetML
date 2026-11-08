import AuthoredValueList from "./abstract/AuthoredValueList";
import { parseMathText } from "./MathList";
import { isOneBracketedText, splitListEntries } from "./commonsugar/lists";

/**
 * A list of intervals. An interval is a math value, so its entries are maths
 * read as intervals, as an `<interval>` reads them.
 */
export default class IntervalList extends AuthoredValueList {
    static componentType = "intervalList";

    static componentDocs = {
        summary: "A list of intervals",
    };

    static listEntryComponentType = "interval";

    static allowInSchemaAsComponent = ["interval"];

    // Include children that can be added due to sugar
    static additionalSchemaChildren = ["math", "string"];

    static listChildGroups = [
        {
            group: "intervals",
            componentTypes: ["interval"],
        },
    ];

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.unordered = {
            createComponentOfType: "boolean",
            createStateVariable: "unorderedPrelim",
            defaultValue: false,
            description:
                "Whether the order of intervals in this list should be treated as unordered (e.g. for matching).",
        };

        return attributes;
    }

    static textCanBeInvalid = true;

    // The pieces are the intervals, separated by the rule for lists, each
    // in brackets, any closer closing any opener (`(1, 2]`). Text with a
    // piece that is not in brackets is not a list of intervals, so gives
    // none, and is reported. A piece that holds a reference is an
    // `<interval>`, made by sugar.
    static splitTextIntoPieces(text, splitting) {
        const pieces = splitListEntries(text, splitting);
        return pieces.every(
            (piece) => piece === "" || isOneBracketedText(piece),
        )
            ? pieces
            : null;
    }

    static parseTextPiece(text) {
        return parseMathText(text, {}, { createIntervals: true });
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.numIntervals = {
            isAlias: true,
            targetVariableName: "numComponents",
            description: "The number of intervals in the list.",
        };

        return stateVariableDefinitions;
    }
}
