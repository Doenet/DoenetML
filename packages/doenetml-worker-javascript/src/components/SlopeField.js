import { returnGraphicalStyleDescriptionDefinitions } from "@doenet/utils";
import GraphicalComponent from "./abstract/GraphicalComponent";

export default class SlopeField extends GraphicalComponent {
    static componentType = "slopeField";
    static styleOverrideCategories = ["line"];

    static componentDocs = {
        summary:
            "A slope field for a differential equation y' = f(x,y), drawn as tick marks on a lattice",
    };

    // Children that sugar can turn into the function attribute.
    static additionalSchemaChildren = ["math", "number", "string"];

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.function = {
            createComponentOfType: "function",
            description:
                "The function giving the slope y' at each point. May take one input, f(x), or two, f(x,y).",
        };

        attributes.dx = {
            createComponentOfType: "number",
            createStateVariable: "dx",
            defaultValue: 1,
            public: true,
            forRenderer: true,
            description: "Horizontal spacing between marks.",
        };

        attributes.dy = {
            createComponentOfType: "number",
            createStateVariable: "dy",
            defaultValue: 1,
            public: true,
            forRenderer: true,
            description: "Vertical spacing between marks.",
        };

        attributes.xoffset = {
            createComponentOfType: "number",
            createStateVariable: "xoffset",
            defaultValue: 0,
            public: true,
            forRenderer: true,
            description: "Horizontal offset of the lattice origin.",
        };

        attributes.yoffset = {
            createComponentOfType: "number",
            createStateVariable: "yoffset",
            defaultValue: 0,
            public: true,
            forRenderer: true,
            description: "Vertical offset of the lattice origin.",
        };

        attributes.markLength = {
            createComponentOfType: "number",
            createStateVariable: "markLength",
            defaultValue: 20,
            public: true,
            forRenderer: true,
            description:
                "Length of each mark, in pixels. Marks keep this length whatever the axis scaling, so slopes are drawn at their true visual angle.",
        };

        attributes.maxMarks = {
            createComponentOfType: "number",
            createStateVariable: "maxMarks",
            defaultValue: 2500,
            public: true,
            forRenderer: true,
            description:
                "Upper bound on how many marks are drawn. Zooming out past this coarsens the lattice rather than drawing an unbounded number of marks.",
        };

        return attributes;
    }

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        sugarInstructions.push({
            replacementFunction({ matchedChildren, nComponents, stateIdInfo }) {
                // Nothing to do if there are no children, or only whitespace.
                if (
                    matchedChildren.length === 0 ||
                    matchedChildren.every(
                        (child) =>
                            typeof child === "string" && child.trim() === "",
                    )
                ) {
                    return { success: false };
                }

                // Wrap the children in a <function>, and hand it over as the
                // `function` attribute. Sugar recurses into attribute
                // components, so <function>'s own sugar wraps the strings in
                // <math> from here.
                return {
                    success: true,
                    newAttributes: {
                        function: {
                            type: "component",
                            name: "function",
                            component: {
                                type: "serialized",
                                componentType: "function",
                                componentIdx: nComponents++,
                                stateId: stateIdInfo
                                    ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                                    : undefined,
                                children: matchedChildren,
                                attributes: {},
                                doenetAttributes: {},
                                state: {},
                            },
                        },
                    },
                    nComponents,
                };
            },
        });

        return sugarInstructions;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnGraphicalStyleDescriptionDefinitions({
                kind: "line",
                noun: "slope-field",
            }),
        );

        stateVariableDefinitions.function = {
            additionalStateVariablesDefined: [
                {
                    variableName: "haveFunction",
                    forRenderer: true,
                },
                {
                    variableName: "fDefinition",
                    forRenderer: true,
                },
                {
                    // The renderer must know the arity: a one-input function
                    // created by `createFunctionFromDefinition` has signature
                    // (x, overrideDomain), so calling it as f(x, y) would
                    // quietly pass y as overrideDomain.
                    variableName: "numInputs",
                    forRenderer: true,
                },
            ],
            returnDependencies: () => ({
                functionAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "function",
                    variableNames: [
                        "numericalfs",
                        "numInputs",
                        "numOutputs",
                        "fDefinition",
                    ],
                },
            }),
            definition({ dependencyValues }) {
                const attr = dependencyValues.functionAttr;

                if (
                    attr === null ||
                    (attr.stateValues.numInputs !== 1 &&
                        attr.stateValues.numInputs !== 2) ||
                    attr.stateValues.numOutputs !== 1
                ) {
                    return {
                        setValue: {
                            function: () => NaN,
                            haveFunction: false,
                            fDefinition: {},
                            numInputs: 0,
                        },
                    };
                }

                return {
                    setValue: {
                        function: attr.stateValues.numericalfs[0],
                        haveFunction: true,
                        fDefinition: attr.stateValues.fDefinition,
                        numInputs: attr.stateValues.numInputs,
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}
