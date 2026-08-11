import { returnGraphicalStyleDescriptionDefinitions } from "@doenet/utils";
import GraphicalComponent from "./abstract/GraphicalComponent";
import {
    returnFieldFunctionAttribute,
    returnFieldFunctionStateVariableDefinitions,
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

        Object.assign(
            attributes,
            returnFieldFunctionAttribute({
                description:
                    "The function giving the slope y' at each point, as an expression such as y-x or a reference to a <function>. May take one input, f(x), or two, f(x,y).",
            }),
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
            returnFieldFunctionStateVariableDefinitions({ numOutputs: 1 }),
        );

        return stateVariableDefinitions;
    }
}
