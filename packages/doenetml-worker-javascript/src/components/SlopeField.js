import { returnGraphicalStyleDescriptionDefinitions } from "@doenet/utils";
import GraphicalComponent from "./abstract/GraphicalComponent";
import {
    returnFieldFunctionChildGroup,
    returnFieldFunctionStateVariableDefinitions,
    returnFieldLatticeAttributes,
    returnFieldVariablesAttribute,
} from "../utils/field";

export default class SlopeField extends GraphicalComponent {
    static componentType = "slopeField";
    static styleOverrideCategories = ["line"];

    // A field covers the whole visible region, so there is nowhere for a label
    // to sit beside it and the renderer draws none.
    static includeLabels = false;

    static componentDocs = {
        summary:
            "A slope field for a differential equation y' = f(x,y), drawn as tick marks on a lattice",
    };

    // Children that sugar can turn into the <function> child.
    static additionalSchemaChildren = ["math", "number", "string"];

    static returnChildGroups() {
        let groups = super.returnChildGroups();
        groups.push(returnFieldFunctionChildGroup());

        return groups;
    }

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        Object.assign(
            attributes,
            returnFieldVariablesAttribute(),
            returnFieldLatticeAttributes({
                markNoun: "marks",
                markLengthDefault: 20,
                markLengthDescription:
                    "Length of each mark, in pixels. Marks keep this length whatever the axis scaling, so slopes are drawn at their true visual angle.",
            }),
        );

        return attributes;
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
