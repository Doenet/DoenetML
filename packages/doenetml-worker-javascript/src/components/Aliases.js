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

export class Title extends TextOrInline {
    static componentType = "title";

    static componentDocs = {
        summary:
            "Creates a title within a document, section, or other block component",
    };
}

export class RightHandSide extends MathComponent {
    static componentType = "rightHandSide";

    static componentDocs = {
        summary: "A right-hand-side expression of an equation in an ODE system",
    };
    static rendererType = "math";
}

export class XLabel extends Label {
    static componentType = "xLabel";

    static componentDocs = {
        summary: "A label for the x-axis of a graph",
    };
    static rendererType = "label";
}

export class YLabel extends Label {
    static componentType = "yLabel";

    static componentDocs = {
        summary: "A label for the y-axis of a graph",
    };
    static rendererType = "label";
}

export class MatrixRow extends MathList {
    static componentType = "matrixRow";

    // Author-facing tag is `<row>` — `<matrixRow>` is an implementation
    // detail produced by `<matrix>`'s row/column sugar. The docs index uses
    // `displayName`/`displayContext` to render this entry as
    // `<row> (in a matrix)`, parallel to `<row> (in a table)` (which is
    // declared on the regular `Row` class).
    static componentDocs = {
        summary: "A list of math values defining the row of a matrix",
        docsSlug: "row_matrix",
        displayName: "row",
        displayContext: "in a matrix",
    };
    static excludeFromSchema = true;
}

export class MatrixColumn extends MathList {
    static componentType = "matrixColumn";

    // Author-facing tag is `<column>` — `<matrixColumn>` is an implementation
    // detail produced by `<matrix>`'s row/column sugar. The docs index uses
    // `displayName`/`displayContext` to render this entry as
    // `<column> (in a matrix)`, parallel to `<column> (in a table)`
    // (which is declared on the regular `Column` class) and to the same
    // split that `<row>` uses.
    static componentDocs = {
        summary: "A list of math values defining the column of a matrix",
        docsSlug: "column_matrix",
        displayName: "column",
        displayContext: "in a matrix",
    };
    static excludeFromSchema = true;
}

export class Statement extends Div {
    static componentType = "statement";

    static componentDocs = {
        summary:
            "A block container for the statement of a problem, theorem, or similar",
    };
}

export class Introduction extends Div {
    static componentType = "introduction";

    static componentDocs = {
        summary: "A block container for the introduction of a section",
    };
}

export class Conclusion extends Div {
    static componentType = "conclusion";

    static componentDocs = {
        summary: "A block container for the conclusion of a section",
    };
}

export class Topic extends TextComponent {
    static componentType = "topic";
    static rendererType = "text";

    // Present for PreTeXt-conversion compatibility but not surfaced to
    // authors via the schema/autocomplete/reference docs.
    static excludeFromSchema = true;

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
        summary: "A line break",
    };
}

export class Hr extends BlockComponent {
    static componentType = "hr";

    static componentDocs = {
        summary: "A horizontal rule used to separate content",
    };
}

export class cascadeMessage extends P {
    static componentType = "cascadeMessage";
    static rendererType = "p";
    static inSchemaOnlyInheritAs = [];

    static componentDocs = {
        summary:
            "Placeholder shown inside a `<cascade>` in place of a not-yet-revealed entry",
    };
}

// TODO: Else is never used, as it is sugared into a Case.
// The component is created just so that it is added to the schema.
// Consider an approach to add to the schema without creating a component.
export class Else extends Case {
    static componentType = "else";

    static componentDocs = {
        summary:
            "Default branch within a `<conditionalContent>`; matched when no `<case>` condition is true",
    };
}
