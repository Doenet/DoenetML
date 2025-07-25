/**
 * This solution is a workaround to compensate for a side effect
 * from our approach to copying lists.
 * When a list is copied, it is converted to a list component
 * with a child that is the copy. When this is occurred,
 * the doenet attributes `extendListViaComposite` or `copyListViaComposite` are added.
 * These state variable chase down the sources of those composites to determine
 * if the source list was unordered.
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

    // Find the component extended or copied to create the list
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
            if (dependencyValues.extendListSourceIdx) {
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
    stateVariableDefinitions.copyListSourceIdx = {
        stateVariablesDeterminingDependencies: ["copyListViaComposite"],
        returnDependencies({ stateValues }) {
            if (stateValues.copyListViaComposite) {
                return {
                    copyListSourceIdx: {
                        dependencyType: "stateVariable",
                        componentIdx: stateValues.copyListViaComposite,
                        variableName: "extendIdx",
                    },
                };
            } else {
                return {};
            }
        },
        definition({ dependencyValues }) {
            if (dependencyValues.copyListSourceIdx) {
                return {
                    setValue: {
                        copyListSourceIdx: dependencyValues.copyListSourceIdx,
                    },
                };
            } else {
                return { setValue: { copyListSourceIdx: null } };
            }
        },
    };

    // We have yet one more step for copy to make sure that the `unordered` is immutable
    stateVariableDefinitions.unorderedFromCopyListSource = {
        immutable: true,
        hasEssential: true,
        defaultValue: false,
        stateVariablesDeterminingDependencies: ["copyListSourceIdx"],
        returnDependencies({ stateValues }) {
            if (stateValues.copyListSourceIdx) {
                return {
                    unorderedFromCopy: {
                        dependencyType: "stateVariable",
                        componentIdx: stateValues.copyListSourceIdx,
                        variableName: "unordered",
                        variablesOptional: true,
                    },
                };
            } else {
                return {};
            }
        },
        definition({ dependencyValues, usedDefault }) {
            if (
                dependencyValues.unorderedFromCopy != undefined &&
                !usedDefault.unorderedFromCopy
            ) {
                return {
                    setValue: {
                        unorderedFromCopyListSource:
                            dependencyValues.unorderedFromCopy,
                    },
                };
            } else {
                return {
                    useEssentialOrDefaultValue: {
                        unorderedFromCopyListSource: true,
                    },
                };
            }
        },
    };

    stateVariableDefinitions.unordered = {
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
                unorderedFromCopyListSource: {
                    dependencyType: "stateVariable",
                    variableName: "unorderedFromCopyListSource",
                },
            };

            if (stateValues.extendListSourceIdx) {
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
            } else if (!usedDefault.unorderedFromCopyListSource) {
                return {
                    setValue: {
                        unordered: dependencyValues.unorderedFromCopyListSource,
                    },
                };
            } else {
                return { useEssentialOrDefaultValue: { unordered: true } };
            }
        },
    };

    return stateVariableDefinitions;
}
