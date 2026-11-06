/**
 * Which replacements of a composite are hidden by the composite rather than
 * by their own `hide`: `replacementsToHide`, which `hidden` and
 * `hiddenIgnoreParent` of each replacement read (`BaseComponent`).
 */

/**
 * The definitions of `replacementsToHide` of a `<sort>` or `<shuffle>` that
 * stays a composite: the replacements whose source is hidden by a container
 * of it inside the composite, such as a `<group hide>` or a
 * `<repeatForSequence hide>` among its children, or by a hidden list whose
 * entry it is (D29 rule 3, #2394).
 *
 * Each replacement is a copy of its source, made apart from that container,
 * so the container's `hide` would be lost. `hidden` and `hiddenIgnoreParent`
 * of each replacement read this list (`BaseComponent`), so such an entry is
 * not drawn and is `hidden`, but its `hide` is still its source's own, and a
 * reference to it (`$s[1]`) placed elsewhere is shown.
 *
 * `sourceKeysVariable` names the state variable that lists, in the order of
 * the replacements, what each one copies: a component index, or
 * `"listIdx|listInd"` for an entry of a list component. A source's
 * `hiddenIgnoreParent` holds its own `hide` and that of every composite it
 * is a replacement of, but not the composite's own hiding or that of its
 * parent, which each replacement already reads.
 */
export function returnReplacementsToHideDefinitions(sourceKeysVariable) {
    return {
        // Whether the source of each replacement, in order, is hidden.
        replacementSourcesHidden: {
            stateVariablesDeterminingDependencies: [sourceKeysVariable],
            returnDependencies({ stateValues }) {
                const dependencies = {
                    sourceKeys: {
                        dependencyType: "stateVariable",
                        variableName: sourceKeysVariable,
                    },
                };
                for (const key of stateValues[sourceKeysVariable]) {
                    const { componentIdx, listInd } = parseSourceKey(key);
                    const name = `source${componentIdx}`;
                    if (listInd === undefined) {
                        dependencies[name] ??= {
                            dependencyType: "multipleStateVariables",
                            componentIdx,
                            variableNames: ["hiddenIgnoreParent"],
                            variablesOptional: true,
                        };
                    } else {
                        dependencies[name] = {
                            dependencyType: "multipleStateVariables",
                            componentIdx,
                            variableNames: [
                                "hiddenIgnoreParent",
                                "entryHiddenIgnoreParents",
                            ],
                            variablesOptional: true,
                        };
                    }
                }
                return dependencies;
            },
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        replacementSourcesHidden:
                            dependencyValues.sourceKeys.map((key) => {
                                const { componentIdx, listInd } =
                                    parseSourceKey(key);
                                const stateValues =
                                    dependencyValues[`source${componentIdx}`]
                                        ?.stateValues;
                                return Boolean(
                                    stateValues?.hiddenIgnoreParent ||
                                    (listInd !== undefined &&
                                        stateValues?.entryHiddenIgnoreParents?.[
                                            listInd
                                        ]),
                                );
                            }),
                    },
                };
            },
        },
        replacementsToHide: {
            stateVariablesDeterminingDependencies: ["replacementSourcesHidden"],
            returnDependencies({ stateValues }) {
                const dependencies = {
                    replacementSourcesHidden: {
                        dependencyType: "stateVariable",
                        variableName: "replacementSourcesHidden",
                    },
                };
                // The composite's own replacements are read only when it
                // hides any, as reading them from `hidden` of each
                // replacement changes when they are expanded.
                if (stateValues.replacementSourcesHidden.includes(true)) {
                    dependencies.replacements = {
                        dependencyType: "replacement",
                    };
                }
                return dependencies;
            },
            definition({ dependencyValues }) {
                const { replacementSourcesHidden, replacements } =
                    dependencyValues;
                // A replacement is made for each source still there, in
                // order, so they line up unless a source is gone, or the
                // replacements are not yet updated to new sources. Hide
                // nothing until they do.
                if (
                    !replacements ||
                    replacements.length !== replacementSourcesHidden.length
                ) {
                    return { setValue: { replacementsToHide: [] } };
                }
                return {
                    setValue: {
                        replacementsToHide: replacements
                            .filter((_r, ind) => replacementSourcesHidden[ind])
                            .map((r) => r.componentIdx),
                    },
                };
            },
        },
    };
}

/**
 * The component and, for an entry of a list component, the entry's index
 * that a key of `returnReplacementsToHideDefinitions` names.
 */
function parseSourceKey(key) {
    if (typeof key === "string") {
        const [componentIdx, listInd] = key.split("|").map(Number);
        return { componentIdx, listInd };
    }
    return { componentIdx: key };
}

/**
 * The definitions of `replacementsToHide` of a `_copy`, for a reference to a
 * whole `<sort>` or `<shuffle>` (`$s`) that stays a composite, or to such a
 * reference in turn.
 *
 * The copy is made of copies of the composite's replacements, made apart
 * from the composite, so the replacements it hides (its own
 * `replacementsToHide`) would be shown here. A reference to the whole list
 * reproduces its content, the hidden containers included, so each
 * replacement of the copy whose shadow source the composite hides is hidden
 * too. A reference to one entry (`$s[1]`), or to a property, is not hidden
 * by this, as an entry referenced on its own is shown (D29 rule 4).
 */
export function returnCopyReplacementsToHideDefinitions() {
    return {
        // the `replacementsToHide` of the composite the copy is made of
        // the replacements of
        extendedReplacementsToHide: {
            stateVariablesDeterminingDependencies: [
                "extendedComponent",
                "usedReplacements",
                "unresolvedPath",
            ],
            returnDependencies({ stateValues }) {
                if (
                    !stateValues.extendedComponent ||
                    !stateValues.usedReplacements ||
                    stateValues.unresolvedPath?.length > 0
                ) {
                    return {};
                }
                return {
                    extendedReplacementsToHide: {
                        dependencyType: "stateVariable",
                        componentIdx:
                            stateValues.extendedComponent.componentIdx,
                        variableName: "replacementsToHide",
                        variablesOptional: true,
                    },
                };
            },
            definition: ({ dependencyValues }) => ({
                setValue: {
                    extendedReplacementsToHide:
                        dependencyValues.extendedReplacementsToHide ?? [],
                },
            }),
        },
        // The copy's own replacements, read only when the composite hides
        // any. Reading them otherwise, from `hidden` of every replacement of
        // every copy, changes when the replacements of a copy are expanded,
        // and so the order in which chained actions fire.
        replacementsIfHiding: {
            stateVariablesDeterminingDependencies: [
                "extendedReplacementsToHide",
            ],
            returnDependencies({ stateValues }) {
                if (stateValues.extendedReplacementsToHide.length === 0) {
                    return {};
                }
                return {
                    replacements: {
                        dependencyType: "replacement",
                    },
                };
            },
            definition: ({ dependencyValues }) => ({
                setValue: {
                    replacementsIfHiding: dependencyValues.replacements ?? [],
                },
            }),
        },
        replacementsToHide: {
            stateVariablesDeterminingDependencies: [
                "extendedReplacementsToHide",
                "replacementsIfHiding",
            ],
            returnDependencies({ stateValues }) {
                const dependencies = {
                    extendedReplacementsToHide: {
                        dependencyType: "stateVariable",
                        variableName: "extendedReplacementsToHide",
                    },
                };
                if (stateValues.replacementsIfHiding.length > 0) {
                    // A copy that shadows another copy of the composite
                    // (`$g` of a `<group name="g">$s</group>`) is made of
                    // copies of that copy's replacements, so it hides those
                    // that copy hides.
                    dependencies.copiedCopyReplacementsToHide = {
                        dependencyType: "shadowSourceStateVariable",
                        variableName: "replacementsToHide",
                    };
                }
                for (const replacement of stateValues.replacementsIfHiding) {
                    if (typeof replacement === "object") {
                        dependencies[
                            `shadowSource${replacement.componentIdx}`
                        ] = {
                            dependencyType: "shadowSource",
                            componentIdx: replacement.componentIdx,
                        };
                    }
                }
                return dependencies;
            },
            definition({ dependencyValues }) {
                const toHide = [
                    ...dependencyValues.extendedReplacementsToHide,
                    ...(dependencyValues.copiedCopyReplacementsToHide ?? []),
                ];
                const replacementsToHide = [];
                for (const [name, source] of Object.entries(dependencyValues)) {
                    if (
                        name.startsWith("shadowSource") &&
                        source &&
                        toHide.includes(source.componentIdx)
                    ) {
                        replacementsToHide.push(
                            Number(name.slice("shadowSource".length)),
                        );
                    }
                }
                return { setValue: { replacementsToHide } };
            },
        },
    };
}
