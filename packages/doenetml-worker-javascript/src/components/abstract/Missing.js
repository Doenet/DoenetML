import InlineComponent from "./InlineComponent";
import { BLANK_RENDERER_TYPE, MISSING_TEXT } from "../../utils/missing";

/**
 * What is missing where there is no type to be missing as (D37): a bare
 * reference with no referent (`$nothing`), which is a blank with the same
 * warning as `<T extend="$nothing"/>` (REF-1), and a `<group>` whose source
 * is missing, which holds this in place of what it would hold. It is drawn
 * as a blank (`＿` inline, not drawn in a graph), reads as a blank in its
 * parent's text, and is missing (`valueMissing`), so it never equals
 * anything. A tag of a type whose source is missing is a missing component
 * of that type instead (`BaseComponent.isMissing`).
 */
export default class Missing extends InlineComponent {
    static componentType = "_missing";
    static rendererType = BLANK_RENDERER_TYPE;
    static excludeFromSchema = true;

    static returnStateVariableDefinitions() {
        const stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.valueMissing = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { valueMissing: true } }),
        };

        stateVariableDefinitions.text = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { text: MISSING_TEXT } }),
        };

        return stateVariableDefinitions;
    }
}
