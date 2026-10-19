import TextOrInline from "./abstract/TextOrInline";

/**
 * What a screen reader announces after a reader presses the button of an
 * `<updateValue>`, `<callAction>` or `<triggerSet>` (Doenet/DoenetML#2277).
 *
 * Like `<shortDescription>`, it is never drawn: a sighted reader already sees
 * what the button changed, so the message exists only for assistive
 * technology, which receives it through the parent's `statusMessage` state
 * variable (`utils/statusMessage.js`). Its `text` is read *after* the action
 * has run, so a reference such as `$n` names the new value.
 */
export default class StatusMessage extends TextOrInline {
    static componentType = "statusMessage";

    static componentDocs = {
        summary:
            "A message announced to screen readers after an action button (e.g. `<updateValue>`) is pressed",
    };
    // Never rendered visually — read only by the parent button's live region.
    static rendererType = undefined;

    // Valid only where a parent lists it as a child, not wherever an inline is.
    static inSchemaOnlyInheritAs = [];

    static returnStateVariableDefinitions() {
        const stateVariableDefinitions = super.returnStateVariableDefinitions();

        // Never drawn, so never hidden. Otherwise a button that hides itself
        // when pressed, such as one with `hide="$shown"` that reveals a hint,
        // would hide what the message refers to as well, and the press would
        // be announced with every `$n` and `<math>` in it left out.
        stateVariableDefinitions.hidden = {
            ...stateVariableDefinitions.hidden,
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { hidden: false } }),
            inverseDefinition: undefined,
        };

        return stateVariableDefinitions;
    }
}
