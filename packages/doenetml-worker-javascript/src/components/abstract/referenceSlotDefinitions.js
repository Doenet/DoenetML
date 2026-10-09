import { reportInternalError } from "../../utils/internalErrors";
import { refResolutionAt } from "../../utils/referenceSlot";

/**
 * The state variables that resolve one reference and read its value: those
 * of a value reference (`_ref`, `ValueRef.js`) for the reference it carries,
 * and, under names of their own, those of a component that holds an
 * attribute as text and references, for each reference in it (a *slot*,
 * `utils/referenceSlot.ts`). Doenet/DoenetML#2252; see
 * `docs/b4-coordinate-attributes.md`.
 *
 * In order, each read by the next:
 * - `refResolutionIndexDependencies` and `refResolutionIndexDependencyValues`:
 *   the components written between the brackets of the reference's path
 *   (`$i` of `$l[$i]`), and their values;
 * - `extendIdx`, with `unresolvedPath` and `originalPath`: the component the
 *   reference resolved to, with the path left to resolve on it, re-resolved
 *   when an index changes (`refResolution` dependency);
 * - `referentInfo`: the referent and the variable read on it (`referent`
 *   dependency);
 * - `value`: that variable, whose inverse writes it there.
 *
 * `names` gives each its name (`DEFAULT_NAMES`, a value reference's own).
 * `slot` says where the reference is, read with `refResolutionAt`; none for
 * the component's own `refResolution`. `fixedReferentOf(component)` is the
 * referent a copy fixed as it made the component, if any, which none of
 * these then works out. `readPlanOf(component)` is how the reference was
 * planned to be read (`utils/dast/valueReferences.ts`): the
 * `adapterVariable`, `readsReferentAdapter`, `listEntryAdapterProperty` and
 * `referencedComponentType` of a value reference's `doenetAttributes`.
 * `emptyValueOf(component, componentInfoObjects)` is `value` while there is
 * nothing to read.
 */
export function referenceSlotDefinitions({
    names = DEFAULT_NAMES,
    slot,
    fixedReferentOf,
    readPlanOf,
    emptyValueOf,
}) {
    const definitions = {};

    // The three variables that resolve the reference are the ones a `_copy`
    // has. They are inert for a reference whose referent a copy fixed: no
    // `refResolution`, no dependency, and nothing asks them.

    // The components written between the brackets of the reference's path,
    // whose values the index is read from.
    definitions[names.refResolutionIndexDependencies] = {
        returnDependencies() {
            if (
                !pathHasIndexComponents(refResolutionAt(this.svComponent, slot))
            ) {
                return {};
            }
            return {
                refResolutionIndexDependencies: {
                    dependencyType: "refResolutionIndexDependencies",
                    slot,
                },
            };
        },
        definition: ({ dependencyValues }) => ({
            setValue: {
                [names.refResolutionIndexDependencies]:
                    dependencyValues.refResolutionIndexDependencies ?? [],
            },
        }),
    };

    definitions[names.refResolutionIndexDependencyValues] = {
        stateVariablesDeterminingDependencies: [
            names.refResolutionIndexDependencies,
        ],
        returnDependencies: ({ stateValues }) => {
            const dependencies = {};
            for (const cIdx of stateValues[
                names.refResolutionIndexDependencies
            ]) {
                dependencies[cIdx] = {
                    dependencyType: "stateVariable",
                    componentIdx: cIdx,
                    variableName: "value",
                };
            }
            return dependencies;
        },
        definition: ({ dependencyValues }) => ({
            setValue: {
                [names.refResolutionIndexDependencyValues]: dependencyValues,
            },
        }),
    };

    // The component the reference resolved to, with the path left to resolve
    // on it (`null` for the implicit prop); `-1` when there is none.
    definitions[names.extendIdx] = {
        additionalStateVariablesDefined: [
            names.unresolvedPath,
            names.originalPath,
        ],
        stateVariablesDeterminingDependencies: [
            names.refResolutionIndexDependencyValues,
        ],
        // `stateValues` is absent when the path has no index components (a
        // value reference then drops the determining variable)
        returnDependencies({ stateValues = {} }) {
            if (!refResolutionAt(this.svComponent, slot)) {
                return {};
            }
            return {
                refResolution: {
                    dependencyType: "refResolution",
                    slot,
                    indexDependencyValues:
                        stateValues[names.refResolutionIndexDependencyValues] ??
                        {},
                },
            };
        },
        definition({ dependencyValues }) {
            const resolution = dependencyValues.refResolution;
            if (resolution) {
                return {
                    setValue: {
                        [names.extendIdx]: resolution.extendIdx,
                        [names.unresolvedPath]: resolution.unresolvedPath,
                        [names.originalPath]: resolution.originalPath,
                    },
                };
            }
            const fixedReferent = fixedReferentOf(this.svComponent);
            return {
                setValue: {
                    [names.extendIdx]: fixedReferent?.componentIdx ?? -1,
                    [names.unresolvedPath]: fixedReferent
                        ? [
                              {
                                  name: fixedReferent.referencedVariable,
                                  index: [],
                              },
                          ]
                        : null,
                    [names.originalPath]: [],
                },
            };
        },
    };

    // The referent and the variable read on it: `{componentIdx,
    // componentType, variableName, referencedVariable, referencedPrimaryValue,
    // referencedWholeComponent, isLocation, companions}`, or `null` while there
    // is nothing to read. The variable read is the adapter's when the
    // reference presents as an adapter's type; `referencedVariable` is the one
    // the author's reference resolved to, whose companions travel with it.
    // Worked out by a `referent` dependency on the component the reference
    // resolved to, or fixed by the copy that made the reference
    // (`fixedReferentOf`).
    //
    // Shadowed when a copy of the component holding this reference shadows
    // it, so that the copy's reference reads the same referent.
    definitions[names.referentInfo] = {
        shadowVariable: true,
        stateVariablesDeterminingDependencies: [
            names.extendIdx,
            names.unresolvedPath,
        ],
        // `stateValues` is absent for a fixed referent (a value reference
        // then drops the determining variables)
        returnDependencies({ stateValues = {} }) {
            const extendIdx = stateValues[names.extendIdx];
            if (
                fixedReferentOf(this.svComponent) ||
                extendIdx == null ||
                extendIdx === -1
            ) {
                return {};
            }
            // A reference to an entry of a list component, planned to read
            // the entry's property that an adapter of the entries' type reads
            // (`$l[$i]` in a `<math>` reads `$l[$i].math`,
            // `planListEntryAdapterReference`). A reference to the whole of a
            // component with no implicit prop, planned to read the variable of
            // the referent's adapter that its parent takes (`$P` in a
            // `<boolean>` reads `P.coords`, `planReferentAdapterReference`).
            const readPlan = readPlanOf(this.svComponent);
            const adapterProperty = readPlan.readsReferentAdapter
                ? readPlan.adapterVariable
                : readPlan.listEntryAdapterProperty;
            const unresolvedPath = stateValues[names.unresolvedPath];
            return {
                referent: {
                    dependencyType: "referent",
                    componentIdx: extendIdx,
                    unresolvedPath:
                        adapterProperty === undefined
                            ? unresolvedPath
                            : [
                                  ...(unresolvedPath ?? []),
                                  { name: adapterProperty, index: [] },
                              ],
                },
            };
        },
        definition({ dependencyValues, componentInfoObjects }) {
            const fixedReferent = fixedReferentOf(this.svComponent);
            if (fixedReferent) {
                return {
                    setValue: { [names.referentInfo]: fixedReferent },
                    checkForActualChange: { [names.referentInfo]: true },
                };
            }
            const referent = dependencyValues.referent;
            let referentInfo = null;
            if (referent) {
                const readPlan = readPlanOf(this.svComponent);
                const { adapterVariable, referencedComponentType } = readPlan;
                if (
                    referent.createComponentOfType !== undefined &&
                    referencedComponentType !== undefined &&
                    !componentInfoObjects.isInheritedComponentType({
                        inheritedComponentType: referent.createComponentOfType,
                        baseComponentType: referencedComponentType,
                    })
                ) {
                    // The reference was planned, and matched to its parent's
                    // child groups, for a variable of another type; reading
                    // this one would hand the parent a value of the wrong
                    // kind.
                    reportInternalError(
                        `Value reference ${this.svComponent.componentIdx} planned for a ${referencedComponentType} resolved to ${referent.variableName} of ${referent.componentIdx}, a ${referent.createComponentOfType}.`,
                    );
                } else {
                    referentInfo = {
                        componentIdx: referent.componentIdx,
                        componentType: referent.componentType,
                        variableName: adapterVariable ?? referent.variableName,
                        referencedVariable: referent.variableName,
                        referencedPrimaryValue: referent.isPrimaryValue,
                        // a reference to the whole referent, read through its
                        // adapter (`$P` in a `<mathList>`), which a list
                        // places its entry as (`graphSourceOf`), as it placed
                        // the copy
                        ...(readPlan.readsReferentAdapter
                            ? { referencedWholeComponent: true }
                            : {}),
                        isLocation: referent.isLocation,
                        companions: referent.companions,
                        listEntryPosition: referent.listEntryPosition,
                    };
                }
            }
            return {
                setValue: { [names.referentInfo]: referentInfo },
                checkForActualChange: { [names.referentInfo]: true },
            };
        },
    };

    // The referent's variable, read through a dependency that
    // `referentInfo` determines; the inverse writes it there, as a write
    // from outside the referent (not a shadow's write: a `<mathInput>`
    // whose `immediateValue` is written through a reference updates its
    // `value` as it would for any other write). The empty value of the
    // presented type when there is nothing to read, or the referent is a
    // withheld replacement of a composite (a reference with a fixed
    // referent leaves that to the copy that made it, which removes the
    // reference when its target is withheld).
    definitions[names.value] = {
        shadowVariable: true,
        stateVariablesDeterminingDependencies: [names.referentInfo],
        // the inverse needs no dependency values; computing them would
        // re-evaluate the referent's variable in the middle of a write
        excludeDependencyValuesInInverseDefinition: true,
        returnDependencies({ stateValues = {} }) {
            return targetDependencies(
                fixedReferentOf(this.svComponent),
                stateValues[names.referentInfo],
            );
        },
        definition({ dependencyValues, componentInfoObjects }) {
            const target = dependencyValues.target;
            if (
                target === undefined ||
                target === null ||
                dependencyValues.targetInactive
            ) {
                return {
                    setValue: {
                        [names.value]: emptyValueOf(
                            this.svComponent,
                            componentInfoObjects,
                        ),
                    },
                };
            }
            return { setValue: { [names.value]: target } };
        },
        async inverseDefinition({ desiredStateVariableValues, stateValues }) {
            if (!(await stateValues[names.referentInfo])) {
                return { success: false };
            }
            return {
                success: true,
                instructions: [
                    {
                        setDependency: "target",
                        desiredValue: desiredStateVariableValues[names.value],
                    },
                ],
            };
        },
    };

    return definitions;
}

/** The names of the state variables of a value reference's own reference. */
export const DEFAULT_NAMES = Object.freeze({
    refResolutionIndexDependencies: "refResolutionIndexDependencies",
    refResolutionIndexDependencyValues: "refResolutionIndexDependencyValues",
    extendIdx: "extendIdx",
    unresolvedPath: "unresolvedPath",
    originalPath: "originalPath",
    referentInfo: "referentInfo",
    value: "value",
});

/**
 * Whether the path of `refResolution` has components written between its
 * brackets (`$i` of `$l[$i]`), whose values give an index.
 */
export function pathHasIndexComponents(refResolution) {
    return Boolean(
        refResolution?.originalPath.some((pathPart) =>
            pathPart.index.some(
                (indexPart) => typeof indexPart.value[0] !== "string",
            ),
        ),
    );
}

/**
 * The dependencies through which a reference reads its referent's variable:
 * `target`, the variable, and, for a reference that resolves itself,
 * `targetInactive`, whether the referent is a withheld replacement of a
 * composite. None while there is no referent. `referentInfo` is the
 * reference's own; `fixedReferent` replaces it for a reference a copy made.
 */
export function targetDependencies(fixedReferent, referentInfo) {
    referentInfo = fixedReferent ?? referentInfo;
    if (!referentInfo) {
        return {};
    }
    const dependencies = {
        target: {
            dependencyType: "stateVariable",
            componentIdx: referentInfo.componentIdx,
            variableName: referentInfo.variableName,
            variablesOptional: true,
        },
    };
    if (!fixedReferent) {
        dependencies.targetInactive = {
            dependencyType: "stateVariable",
            componentIdx: referentInfo.componentIdx,
            variableName: "isInactiveCompositeReplacement",
            variablesOptional: true,
        };
    }
    return dependencies;
}
