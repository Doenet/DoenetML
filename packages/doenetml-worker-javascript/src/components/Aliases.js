import TextComponent from "./Text";
import TextOrInline from "./abstract/TextOrInline";
import InlineComponent from "./abstract/InlineComponent";
import BlockComponent from "./abstract/BlockComponent";
import MathComponent from "./Math";
import Label from "./Label";
import MathList from "./MathList";
import { Div } from "./Divisions";
import Setup from "./Setup";
import P from "./P";
import Case from "./Case";
import { returnPassThroughListItemChildStateVariableDefinitions } from "../utils/listItemChild";

export class Title extends TextOrInline {
    static componentType = "title";

    static componentDocs = {
        summary: "A title displayed at the top of a section or document.",
    };
}

export class RightHandSide extends MathComponent {
    static componentType = "rightHandSide";

    static componentDocs = {
        summary:
            "A right-hand-side expression of an equation in an ODE system.",
    };
    static rendererType = "math";
}

export class Description extends BlockComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
        });
    }
    static componentType = "description";

    static componentDocs = {
        summary:
            "Extra information about an enclosing component, shown to all users in a popup or disclosure.",
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

export class XLabel extends Label {
    static componentType = "xLabel";

    static componentDocs = {
        summary: "A label for the x-axis of a graph.",
    };
    static rendererType = "label";
}

export class YLabel extends Label {
    static componentType = "yLabel";

    static componentDocs = {
        summary: "A label for the y-axis of a graph.",
    };
    static rendererType = "label";
}

export class MatrixRow extends MathList {
    static componentType = "matrixRow";

    static componentDocs = {
        summary: "A list of math values defining the row of a matrix.",
        docsSlug: "row_matrix",
    };
    static excludeFromSchema = true;
}

export class MatrixColumn extends MathList {
    static componentType = "matrixColumn";

    static componentDocs = {
        summary: "A list of math values defining the column of a matrix.",
        docsSlug: "matrix",
    };
    static excludeFromSchema = true;
}

export class Statement extends Div {
    static componentType = "statement";

    static componentDocs = {
        summary: "A theorem-like statement block.",
    };
}

export class Introduction extends Div {
    static componentType = "introduction";

    static componentDocs = {
        summary: "An introductory block displayed at the start of a section.",
    };
}

export class Conclusion extends Div {
    static componentType = "conclusion";

    static componentDocs = {
        summary: "A concluding block displayed at the end of a section.",
    };
}

export class Topic extends TextComponent {
    static componentType = "topic";
    static rendererType = "text";

    static componentDocs = {
        summary: "A topic label rendered as text (e.g. for tagging content).",
    };
}

export class RepeatSetup extends Setup {
    static componentType = "_repeatSetup";
}

export class Placeholder extends Setup {
    static componentType = "_placeholder";
}

export class Br extends InlineComponent {
    static componentType = "br";

    static componentDocs = {
        summary: "A line break.",
    };
}

export class Hr extends BlockComponent {
    static componentType = "hr";

    static componentDocs = {
        summary: "A horizontal rule used to separate content.",
    };
}

export class cascadeMessage extends P {
    static componentType = "cascadeMessage";
    static rendererType = "p";
    static inSchemaOnlyInheritAs = [];

    static componentDocs = {
        summary: "An individual message displayed within a `<cascade>`.",
    };
}

// TODO: Else is never used, as it is sugared into a Case.
// The component is created just so that it is added to the schema.
// Consider an approach to add to the schema without creating a component.
export class Else extends Case {
    static componentType = "else";

    static componentDocs = {
        summary:
            "Default branch within a `<conditionalContent>`; matched when no `<case>` condition is true.",
    };
}
