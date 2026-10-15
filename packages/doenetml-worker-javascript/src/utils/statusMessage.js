/**
 * The `statusMessage` state variable shared by the components drawn as an
 * action button — `<updateValue>`, `<callAction>` and `<triggerSet>` — which
 * the `button` renderer announces in a polite live region once a press of the
 * button has been carried out (Doenet/DoenetML#2277).
 *
 * It is the text of the component's `<statusMessage>` child, the *last* one
 * winning as for `<shortDescription>`, or `""` when there is none. The
 * renderer, not the core, supplies the default announcement for `""`, because
 * the default is addressed to the reader and so is spoken in their language
 * (`uiLocale`), which the core is never told.
 *
 * A component using this must declare a `statusMessages` child group.
 */
export function returnStatusMessageStateVariableDefinition() {
    return {
        statusMessage: {
            description:
                "The message announced to screen readers after the button is pressed, or an empty string to announce the default.",
            forRenderer: true,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                statusMessageChild: {
                    dependencyType: "child",
                    childGroups: ["statusMessages"],
                    variableNames: ["text"],
                },
            }),
            definition({ dependencyValues }) {
                const children = dependencyValues.statusMessageChild;
                const statusMessage =
                    children.length > 0
                        ? children[children.length - 1].stateValues.text.trim()
                        : "";

                return { setValue: { statusMessage } };
            },
        },
    };
}
