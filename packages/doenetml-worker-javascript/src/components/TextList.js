import AuthoredValueList from "./abstract/AuthoredValueList";

export default class TextList extends AuthoredValueList {
    static componentType = "textList";

    static componentDocs = {
        summary: "A list of texts",
    };

    static listEntryComponentType = "text";

    static allowInSchemaAsComponent = ["text"];

    static listChildGroups = [
        {
            group: "texts",
            componentTypes: ["text"],
        },
    ];

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.unordered = {
            description:
                "Whether the order of items should be treated as unordered.",
            createComponentOfType: "boolean",
            createStateVariable: "unorderedPrelim",
            defaultValue: false,
        };

        return attributes;
    }

    static parseTextPiece(text) {
        return text;
    }
}
