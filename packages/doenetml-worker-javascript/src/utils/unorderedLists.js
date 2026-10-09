/**
 * This solution is a workaround to compensate for a side effect
 * from our approach to copying lists.
 * When a list is copied, it is converted to a list component
 * with a child that is the copy. When this is occurred,
 * the doenet attributes `extendListViaComposite` or `copyListViaComposite` are added.
 * These state variables chase down the source of an extend to determine
 * if the source list was unordered. A copy takes `unordered` as written on
 * the list, with its other attributes (`copyListViaComposite` in
 * `AttributeComponentDependency`).
 */

export function returnUnorderedListStateVariableDefinitions() {
    const stateVariableDefinitions = {};

    // check for the presence of the doenet attributes
    stateVariableDefinitions.extendListViaComposite = {
        returnDependencies: () => ({
            extendListViaComposite: {
                dependencyType: "doenetAttribute",
                attributeName: "extendListViaComposite",
            },
        }),
        definition({ dependencyValues }) {
            return {
                setValue: {
                    extendListViaComposite:
                        dependencyValues.extendListViaComposite,
                },
            };
        },
    };
    stateVariableDefinitions.copyListViaComposite = {
        returnDependencies: () => ({
            copyListViaComposite: {
                dependencyType: "doenetAttribute",
                attributeName: "copyListViaComposite",
            },
        }),
        definition({ dependencyValues }) {
            return {
                setValue: {
                    copyListViaComposite: dependencyValues.copyListViaComposite,
                },
            };
        },
    };

    // Find the component extended to create the list
    stateVariableDefinitions.extendListSourceIdx = {
        stateVariablesDeterminingDependencies: ["extendListViaComposite"],
        returnDependencies({ stateValues }) {
            if (stateValues.extendListViaComposite) {
                return {
                    extendListSourceIdx: {
                        dependencyType: "stateVariable",
                        componentIdx: stateValues.extendListViaComposite,
                        variableName: "extendIdx",
                    },
                };
            } else {
                return {};
            }
        },
        definition({ dependencyValues }) {
            if (
                typeof dependencyValues.extendListSourceIdx === "number" &&
                dependencyValues.extendListSourceIdx !== -1
            ) {
                return {
                    setValue: {
                        extendListSourceIdx:
                            dependencyValues.extendListSourceIdx,
                    },
                };
            } else {
                return { setValue: { extendListSourceIdx: null } };
            }
        },
    };
    stateVariableDefinitions.unordered = {
        description:
            "Whether the order of items in this list should be treated as unordered (e.g. for matching).",
        defaultValue: false,
        hasEssential: true,
        public: true,
        shadowingInstructions: {
            createComponentOfType: "boolean",
        },
        stateVariablesDeterminingDependencies: ["extendListSourceIdx"],
        returnDependencies({ stateValues }) {
            const dependencies = {
                unorderedPrelim: {
                    dependencyType: "stateVariable",
                    variableName: "unorderedPrelim",
                },
            };

            if (stateValues.extendListSourceIdx !== null) {
                dependencies.unorderedFromExtended = {
                    dependencyType: "stateVariable",
                    componentIdx: stateValues.extendListSourceIdx,
                    variableName: "unordered",
                    variablesOptional: true,
                };
            }

            return dependencies;
        },
        definition({ dependencyValues, usedDefault }) {
            if (!usedDefault.unorderedPrelim) {
                return {
                    setValue: {
                        unordered: dependencyValues.unorderedPrelim,
                    },
                };
            } else if (
                dependencyValues.unorderedFromExtended != undefined &&
                !usedDefault.unorderedFromExtended
            ) {
                return {
                    setValue: {
                        unordered: dependencyValues.unorderedFromExtended,
                    },
                };
            } else {
                return { useEssentialOrDefaultValue: { unordered: true } };
            }
        },
    };

    return stateVariableDefinitions;
}
