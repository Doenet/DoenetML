/**
 * The `statusMessage` state variable shared by the components drawn as an
 * action button — `<updateValue>`, `<callAction>` and `<triggerSet>` — which
 * the viewer announces in its document's live region once a press of the
 * button has been carried out (Doenet/DoenetML#2277; see
 * `finishActionButtonPress`).
 *
 * It is the text of the component's `<statusMessage>` child, the *last* one
 * winning as for `<shortDescription>`, or `""` when there is none. The
 * viewer, not the core, supplies the default announcement for `""`, because
 * the default is addressed to the reader and so is spoken in their language
 * (`uiLocale`), which the core is never told.
 *
 * Not sent to the renderer: the button has nothing to draw with it, and a
 * button that hides itself when pressed is no longer rendered by the time
 * its message is read.
 *
 * A component using this must declare a `statusMessages` child group.
 */
export function returnStatusMessageStateVariableDefinition() {
    return {
        statusMessage: {
            description:
                "The message announced to screen readers after the button is pressed, or an empty string to announce the default.",
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

/**
 * Finish the action of a press of an action button: run the actions chained
 * to it (`triggerWith`), then send the renderers their updates together with
 * the button's `statusMessage`, which the viewer announces (#2277).
 *
 * The message is read after the chained actions and before the update goes
 * out, so a `$n` in it names the value the press left `$n` with, and it
 * arrives with the update that settles the press. It travels with the update
 * rather than as the button's renderer state because a button that hides
 * itself when pressed is no longer rendered, so its renderer state is no
 * longer sent.
 *
 * A press can also delete its own button, for example when it changes the
 * case of the `<conditionalContent>` holding it. The deleted button's message
 * can no longer be read, so the viewer's default is announced instead.
 *
 * Only a press is announced. Every other caller of these actions — a
 * `triggerWhen`, a `<triggerSet>` running its children, an action chained to
 * another, a `<callAction>` targeting the action — passes
 * `skipRendererUpdate`, and leaves the update to whoever asked.
 */
export async function finishActionButtonPress(
    component,
    { actionId, sourceInformation, skipRendererUpdate },
) {
    await component.coreFunctions.triggerChainedActions({
        componentIdx: component.componentIdx,
        actionId,
        sourceInformation,
        skipRendererUpdate: true,
    });

    if (skipRendererUpdate) {
        return;
    }

    const announcement = component.coreFunctions.componentExists(
        component.componentIdx,
    )
        ? await component.stateValues.statusMessage
        : "";

    await component.coreFunctions.updateRenderers({
        actionId,
        sourceInformation,
        announcement,
    });
}
