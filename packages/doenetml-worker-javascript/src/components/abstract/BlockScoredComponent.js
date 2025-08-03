import {
    returnStandardAnswerAttributes,
    returnStandardAnswerStateVariableDefinition,
} from "../../utils/answer";
import { renameStateVariable } from "../../utils/stateVariables";
import BlockComponent from "./BlockComponent";

export default class BlockScoredComponent extends BlockComponent {
    static componentType = "_blockScoredComponent";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        Object.assign(attributes, returnStandardAnswerAttributes());
        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        // rename disabled to disabledOriginal
        renameStateVariable({
            stateVariableDefinitions,
            oldName: "disabled",
            newName: "disabledOriginal",
        });

        Object.assign(
            stateVariableDefinitions,
            returnStandardAnswerStateVariableDefinition(),
        );
        return stateVariableDefinitions;
    }
}
