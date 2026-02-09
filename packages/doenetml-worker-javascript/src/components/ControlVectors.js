import VectorListComponent from "./VectorList";

export default class ControlVectors extends VectorListComponent {
    static componentType = "controlVectors";

    static inSchemaOnlyInheritAs = [];

    // don't let it appear in schema as a vector
    static allowInSchemaAsComponent = undefined;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.direction = {
            createComponentOfType: "text",
            createStateVariable: "direction",
            defaultValue: "symmetric",
            public: true,
            toLowerCase: true,
            validValues: ["symmetric", "previous", "next", "both", "none"],
        };
        attributes.pointNumber = {
            createComponentOfType: "number",
            createStateVariable: "pointNumber",
            defaultValue: null,
            public: true,
        };
        return attributes;
    }
}
