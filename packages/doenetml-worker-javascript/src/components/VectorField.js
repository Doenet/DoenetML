import { returnGraphicalStyleDescriptionDefinitions } from "@doenet/utils";
import GraphicalComponent from "./abstract/GraphicalComponent";
import {
    returnFieldFunctionStateVariableDefinitions,
    returnFieldFunctionSugarInstruction,
    returnFieldLatticeAttributes,
} from "../utils/field";

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

        Object.assign(
            attributes,
            returnFieldLatticeAttributes({
                markNoun: "arrows",
                markLengthDefault: 24,
                markLengthDescription:
                    "Length in pixels of the longest arrow, or of every arrow when normalize is set. Arrows keep this length whatever the axis scaling.",
            }),
        );

        attributes.normalize = {
            createComponentOfType: "boolean",
            createStateVariable: "normalize",
            defaultValue: false,
            public: true,
            forRenderer: true,
            description:
                "Draw every arrow the same length, showing direction only rather than magnitude.",
        };

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
                noun: "vector-field",
            }),
            returnFieldFunctionStateVariableDefinitions({ numOutputs: 2 }),
        );

        return stateVariableDefinitions;
    }
}
