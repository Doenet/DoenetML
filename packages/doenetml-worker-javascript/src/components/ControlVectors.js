import VectorListComponent from "./VectorList";

export default class ControlVectors extends VectorListComponent {
    static componentType = "controlVectors";

    static componentDocs = {
        summary:
            "Bezier control vectors at a polyline/curve vertex (used inside <bezierControls>).",
    };

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
            description:
                "Direction in which the control vectors apply at the vertex.",
        };
        attributes.pointNumber = {
            createComponentOfType: "number",
            createStateVariable: "pointNumber",
            defaultValue: null,
            public: true,
            description:
                "1-based index of the vertex these control vectors attach to.",
        };
        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        // Control vectors are interactive editing handles for jsxgraph and have
        // no meaning in the prefigure (static) renderer. Overriding hidden to
        // always be true ensures they propagate parentHidden=true to their
        // vector children, causing the prefigure dispatcher to skip them.
        // BezierControls reads controlVectors.hide (the raw attribute SV),
        // not .hidden, for its hiddenControls array, so this override does
        // not affect jsxgraph control handle visibility.
        stateVariableDefinitions.hidden = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { hidden: true } }),
        };

        return stateVariableDefinitions;
    }
}
