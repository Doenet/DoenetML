import { returnGraphicalStyleDescriptionDefinitions } from "@doenet/utils";
import GraphicalComponent from "./abstract/GraphicalComponent";

export default class VectorField extends GraphicalComponent {
    static componentType = "vectorField";
    static styleOverrideCategories = ["line"];

    static componentDocs = {
        summary:
            "A vector field drawn as arrows on a lattice, from a function with two outputs",
    };

    // Children that sugar can turn into the function attribute.
    static additionalSchemaChildren = ["math", "number", "string"];

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.function = {
            createComponentOfType: "function",
            description:
                "A function with two outputs giving the vector at each point, such as (y, -x). May take one input or two.",
        };

        attributes.dx = {
            createComponentOfType: "number",
            createStateVariable: "dx",
            defaultValue: 1,
            public: true,
            forRenderer: true,
            description: "Horizontal spacing between arrows.",
        };

        attributes.dy = {
            createComponentOfType: "number",
            createStateVariable: "dy",
            defaultValue: 1,
            public: true,
            forRenderer: true,
            description: "Vertical spacing between arrows.",
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
            defaultValue: 24,
            public: true,
            forRenderer: true,
            description:
                "Length of the longest arrow, in pixels. Arrows keep this length whatever the axis scaling.",
        };

        attributes.normalize = {
            createComponentOfType: "boolean",
            createStateVariable: "normalize",
            defaultValue: false,
            public: true,
            forRenderer: true,
            description:
                "Draw every arrow the same length, showing direction only rather than magnitude.",
        };

        attributes.maxMarks = {
            createComponentOfType: "number",
            createStateVariable: "maxMarks",
            defaultValue: 2500,
            public: true,
            forRenderer: true,
            description:
                "Upper bound on how many arrows are drawn. Zooming out past this coarsens the lattice rather than drawing an unbounded number of arrows.",
        };

        return attributes;
    }

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        sugarInstructions.push({
            replacementFunction({ matchedChildren, nComponents, stateIdInfo }) {
                if (
                    matchedChildren.length === 0 ||
                    matchedChildren.every(
                        (child) =>
                            typeof child === "string" && child.trim() === "",
                    )
                ) {
                    return { success: false };
                }

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
                noun: "vector-field",
            }),
        );

        stateVariableDefinitions.functions = {
            additionalStateVariablesDefined: [
                {
                    variableName: "haveFunctions",
                    forRenderer: true,
                },
                {
                    variableName: "fDefinitions",
                    forRenderer: true,
                },
                {
                    // See SlopeField: a one-input function's second parameter
                    // is `overrideDomain`, so the renderer must call by arity.
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
                        "fDefinitions",
                    ],
                },
            }),
            definition({ dependencyValues }) {
                const attr = dependencyValues.functionAttr;

                if (
                    attr === null ||
                    (attr.stateValues.numInputs !== 1 &&
                        attr.stateValues.numInputs !== 2) ||
                    attr.stateValues.numOutputs !== 2
                ) {
                    return {
                        setValue: {
                            functions: [() => NaN, () => NaN],
                            haveFunctions: false,
                            fDefinitions: [{}, {}],
                            numInputs: 0,
                        },
                    };
                }

                return {
                    setValue: {
                        functions: [
                            attr.stateValues.numericalfs[0],
                            attr.stateValues.numericalfs[1],
                        ],
                        haveFunctions: true,
                        fDefinitions: [
                            attr.stateValues.fDefinitions[0],
                            attr.stateValues.fDefinitions[1],
                        ],
                        numInputs: attr.stateValues.numInputs,
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}
