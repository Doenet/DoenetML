import BaseComponent from "./BaseComponent";
import {
    DIVISION_SEQUENCE,
    returnSequenceNumbersOfChildrenDefinition,
} from "../../utils/sequenceNumbering";

export default class BlockComponent extends BaseComponent {
    static componentType = "_block";

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        // A block that bounds the division sequence — a `<sideBySide>`, a
        // `<paginator>`, a `<hint>`, … — numbers the divisions among its
        // children from 1, counting through any `<div>` or `<cascade>` among
        // them. So does a section. A block the sequence passes through
        // replaces this. See `utils/sequenceNumbering.js`.
        stateVariableDefinitions.divisionNumbersOfChildren =
            returnSequenceNumbersOfChildrenDefinition(DIVISION_SEQUENCE);

        return stateVariableDefinitions;
    }
}
