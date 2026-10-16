/**
 * The state variables by which a child of a `<cascade>` learns what the
 * cascade is doing with it: `hideChildren`, whether the cascade is holding it
 * back as a step it has not reached (so it keeps its heading and hides the
 * rest), and `showCascadeMessage`, whether it is the one held-back step the
 * cascade has nominated to show its `<cascadeMessage>` children.
 *
 * Both read only the parent, and a parent that is not a cascade supplies
 * neither variable, so outside a cascade both are `false`.
 *
 * Shared by every sectioning component and by `<cascade>` itself, which is a
 * step like any other when it is nested inside another cascade.
 *
 * @returns {object} state variable definitions keyed by name
 */
export function returnCascadeStepStateVariableDefinitions() {
    const stateVariableDefinitions = {};

    stateVariableDefinitions.hideChildren = {
        returnDependencies: () => ({
            parentChildrenToHideChildren: {
                dependencyType: "parentStateVariable",
                variableName: "childrenToHideChildren",
            },
        }),
        definition({ dependencyValues, componentIdx }) {
            let hideChildren = Boolean(
                dependencyValues.parentChildrenToHideChildren?.includes(
                    componentIdx,
                ),
            );

            return { setValue: { hideChildren } };
        },
    };

    /**
     * Whether this section is the one step of its `<cascade>` that is
     * currently showing its `<cascadeMessage>` children.
     *
     * At most one message is shown per cascade, and the cascade picks which
     * (`sectionToShowCascadeMessage` in `Cascade.js`). A section whose parent
     * is not a cascade gets `undefined` from the dependency — `parent`
     * dependencies are always optional — and so shows no message, which is
     * what a `<cascadeMessage>` outside a cascade should do.
     */
    stateVariableDefinitions.showCascadeMessage = {
        returnDependencies: () => ({
            parentSectionToShowCascadeMessage: {
                dependencyType: "parentStateVariable",
                variableName: "sectionToShowCascadeMessage",
            },
        }),
        definition({ dependencyValues, componentIdx }) {
            return {
                setValue: {
                    showCascadeMessage:
                        dependencyValues.parentSectionToShowCascadeMessage ===
                        componentIdx,
                },
            };
        },
    };

    return stateVariableDefinitions;
}
