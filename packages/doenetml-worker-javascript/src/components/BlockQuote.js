import BlockComponent from "./abstract/BlockComponent";
import { returnPassThroughListItemChildStateVariableDefinitions } from "../utils/listItemChild";

export default class BlockQuote extends BlockComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
        });
    }
    static componentType = "blockQuote";
    // Content, one type with all content (COLL-4, D46; `utils/componentKinds.ts`).
    static isContent = true;
    static rendererType = "blockQuote";
    static renderChildren = true;

    static canDisplayChildErrors = true;

    static includeBlankStringChildren = true;

    static componentDocs = {
        summary: "A block-level quotation",
    };

    static returnChildGroups() {
        return [
            {
                group: "anything",
                componentTypes: ["_base"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnPassThroughListItemChildStateVariableDefinitions(),
        );

        return stateVariableDefinitions;
    }

    recordVisibilityChange({ isVisible }) {
        this.coreFunctions.requestRecordEvent({
            verb: "visibilityChanged",
            object: {
                componentIdx: this.componentIdx,
                componentType: this.componentType,
            },
            result: { isVisible },
        });
    }
}
