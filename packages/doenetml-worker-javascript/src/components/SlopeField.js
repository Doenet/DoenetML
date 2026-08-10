import { returnGraphicalStyleDescriptionDefinitions } from "@doenet/utils";
import GraphicalComponent from "./abstract/GraphicalComponent";
import {
    functionAttrIsUsableField,
    returnFieldFunctionSugarInstruction,
    returnFieldLatticeAttributes,
} from "../utils/field";

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

        Object.assign(
            attributes,
            returnFieldLatticeAttributes({
                markNoun: "marks",
                markLengthDefault: 20,
                markLengthDescription:
                    "Length of each mark, in pixels. Marks keep this length whatever the axis scaling, so slopes are drawn at their true visual angle.",
            }),
        );

        return attributes;
    }

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        sugarInstructions.push(returnFieldFunctionSugarInstruction());

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

                if (!functionAttrIsUsableField(attr, 1)) {
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
