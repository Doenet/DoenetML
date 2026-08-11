import GraphicalComponent from "./abstract/GraphicalComponent";

export default class Pegboard extends GraphicalComponent {
    static componentType = "pegboard";

    // A pegboard fills the whole visible region, so there is nowhere for a
    // label to sit beside it and the renderer draws none.
    static includeLabels = false;

    static componentDocs = {
        summary: "Renders a grid of pegs on a graph",
    };

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.dx = {
            createComponentOfType: "number",
            createStateVariable: "dx",
            defaultValue: 1,
            public: true,
            forRenderer: true,
            description: "Horizontal spacing between pegs.",
        };

        attributes.dy = {
            createComponentOfType: "number",
            createStateVariable: "dy",
            defaultValue: 1,
            public: true,
            forRenderer: true,
            description: "Vertical spacing between pegs.",
        };

        attributes.xoffset = {
            createComponentOfType: "number",
            createStateVariable: "xoffset",
            defaultValue: 0,
            public: true,
            forRenderer: true,
            description: "Horizontal offset of the peg grid origin.",
        };

        attributes.yoffset = {
            createComponentOfType: "number",
            createStateVariable: "yoffset",
            defaultValue: 0,
            public: true,
            forRenderer: true,
            description: "Vertical offset of the peg grid origin.",
        };

        return attributes;
    }
}
