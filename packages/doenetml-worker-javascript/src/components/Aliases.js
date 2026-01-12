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
}

export class RightHandSide extends MathComponent {
    static componentType = "rightHandSide";
    static rendererType = "math";
}

export class ShortDescription extends TextOrInline {
    static componentType = "shortDescription";
    static rendererType = "containerInline";
}

export class Description extends Div {
    static componentType = "description";
    static rendererType = "containerBlock";
}

export class XLabel extends Label {
    static componentType = "xLabel";
    static rendererType = "label";
}

export class YLabel extends Label {
    static componentType = "yLabel";
    static rendererType = "label";
}

export class MatrixRow extends MathList {
    static componentType = "matrixRow";
    static excludeFromSchema = true;
}

export class MatrixColumn extends MathList {
    static componentType = "matrixColumn";
    static excludeFromSchema = true;
}

export class Statement extends Div {
    static componentType = "statement";
}

export class Introduction extends Div {
    static componentType = "introduction";
}

export class Conclusion extends Div {
    static componentType = "conclusion";
}

export class Topic extends TextComponent {
    static componentType = "topic";
    static rendererType = "text";
}

export class RepeatSetup extends Setup {
    static componentType = "_repeatSetup";
}

export class Placeholder extends Setup {
    static componentType = "_placeholder";
}

export class Br extends InlineComponent {
    static componentType = "br";
}

export class Hr extends BlockComponent {
    static componentType = "hr";
}

export class cascadeMessage extends P {
    static componentType = "cascadeMessage";
    static rendererType = "p";
    static inSchemaOnlyInheritAs = [];
}

// TODO: Else is is never used, as it is sugared into a Case.
// The component is created just so that it is added to the schema.
// Consider an approach to add to the schema without creating a component.
export class Else extends Case {
    static componentType = "else";
}
