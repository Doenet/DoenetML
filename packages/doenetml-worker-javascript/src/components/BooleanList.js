import AuthoredValueList from "./abstract/AuthoredValueList";

export default class BooleanList extends AuthoredValueList {
    static componentType = "booleanList";

    static componentDocs = {
        summary: "A list of booleans",
    };

    static listEntryComponentType = "boolean";

    static allowInSchemaAsComponent = ["boolean"];

    static listChildGroups = [
        {
            group: "booleans",
            componentTypes: ["boolean"],
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

    // The words `true` and `false` are read by the list. Any other piece of
    // text (`x=x`) is a `<boolean>` that evaluates it.
    static keepsTextPiece(text) {
        return /^(true|false)$/i.test(text);
    }

    static parseTextPiece(text) {
        return text.toLowerCase() === "true";
    }
}
