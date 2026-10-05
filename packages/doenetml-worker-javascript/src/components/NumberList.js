import AuthoredValueList from "./abstract/AuthoredValueList";
import { plainComplex } from "../utils/math";
import { numberFromString } from "./Number";

export default class NumberList extends AuthoredValueList {
    static componentType = "numberList";

    static componentDocs = {
        summary: "A list of numbers",
    };

    static listEntryComponentType = "number";

    static allowInSchemaAsComponent = ["number"];

    static listChildGroups = [
        {
            group: "numbers",
            componentTypes: ["number"],
        },
        {
            group: "maths",
            componentTypes: ["math"],
        },
    ];

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.unordered = {
            createComponentOfType: "boolean",
            createStateVariable: "unorderedPrelim",
            defaultValue: false,
            description:
                "Whether the order of items in this list should be treated as unordered (e.g. for matching).",
        };

        return attributes;
    }

    // A number is read from text as a `<number>` reads it.
    static parseTextPiece(text) {
        return plainComplex(numberFromString(text));
    }

    // A single math child whose value is a list (`1, 2, 3`) is one entry
    // per item.
    static mergesMathChild({ sources }) {
        return (
            sources.length === 1 &&
            typeof sources[0] !== "string" &&
            sources[0].componentType === "math"
        );
    }
}
