import BlockComponent from "./abstract/BlockComponent";
import { returnPassThroughListItemChildStateVariableDefinitions } from "../utils/listItemChild";

export default class Description extends BlockComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
        });
    }
    static componentType = "description";

    static componentDocs = {
        summary:
            "Extra information about an enclosing component, shown to all users in a popup or disclosure",
    };
    static rendererType = "containerBlock";
    static renderChildren = true;

    static canDisplayChildErrors = true;

    static includeBlankStringChildren = true;

    // `description` is only valid as an explicit child of the components that
    // declare a `description`/`descriptions` child group; it should not appear
    // as a generic block child everywhere.
    static inSchemaOnlyInheritAs = [];

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
