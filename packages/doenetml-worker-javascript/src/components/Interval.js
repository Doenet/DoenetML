import MathComponent from "./Math";

export default class Interval extends MathComponent {
    static componentType = "interval";
    static rendererType = "math";

    static componentDocs = {
        summary: "A math expression treated as an interval of real numbers.",
    };

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        delete attributes.createIntervals;
        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.createIntervals = {
            description:
                "Whether this math component renders intervals as intervals (always true for <interval>).",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { createIntervals: true } }),
        };

        return stateVariableDefinitions;
    }

    // TODO: do we want to give warnings or errors if value is not in form of an interval?
}
