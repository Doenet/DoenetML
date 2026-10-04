import me from "math-expressions";
import BaseComponent from "./BaseComponent";
import { reportInternalError } from "../../utils/internalErrors";

/**
 * A value reference: the component a bare `$n` becomes when it stands where
 * only a value is read, such as inside `<math>$n+1</math>` or in the content
 * of an attribute (`displayDigits="$n"`).
 *
 * It reads one state variable of its referent and takes the place, in its
 * parent's child groups, of a component of `presentedComponentType`:
 * `number` for `$n` in a `<number>`, `math` for the same `$n` in a `<math>`,
 * where it reads `n.math` instead of `n.value`. `ChildMatcher` matches it by
 * the presented type.
 *
 * It resolves its own reference. Made from the document
 * (`utils/dast/valueReferences.ts`), it carries the reference's
 * `refResolution` and resolves it the way a `_copy` does, re-resolving as
 * the index of `$l[$i]` changes; made by a `_copy` that expanded
 * (`replacementFromProp` in `Copy.js`, for the references whose type is
 * only known at run time), its target is fixed in `doenetAttributes`. Either
 * way `referentInfo` names the referent and the variable, and `value` reads
 * that variable through a dependency determined by it, so a change of target
 * swaps the dependency and creates no component.
 *
 * It defines almost no state of its own. Whatever its parent asks of it that
 * it does not define (`displayDigits`, `text`, `latex`, …) is made on demand
 * from the presented type's definitions, redirected to the referent for the
 * settings that travel with the referenced variable
 * (`createOnDemandStateVariableDefinitions`), so a reference costs the
 * variables that are actually read and nothing else. It has no attributes
 * and no `fixed` of its own: a write through it lands on the referent, whose
 * own `fixed` refuses it there. It has no renderer either; it is not made in
 * a position whose parent renders its children.
 *
 * Part of Doenet/DoenetML#2128.
 */
export default class ValueRef extends BaseComponent {
    static componentType = "_ref";
    static rendererType = undefined;
    static excludeFromSchema = true;
    static primaryStateVariableForDefinition = "value";

    constructor(args) {
        super(args);

        // The type that holds values of this reference's kind is the
        // presented one, for whoever asks: `_emptyPrimaryValue` in
        // `StateVariableDefinitionFactory`, when this reference is itself
        // shadowed by a copy's reference and has no value.
        this.state.value.shadowingInstructions = {
            createComponentOfType: this.presentedComponentType,
        };

        // What is known at construction trims the resolution chain. A
        // reference whose referent a copy fixed (`fixedReferent`) resolves
        // nothing: `referentInfo` is that constant, and the variables that
        // would be determined by it read it directly. One whose path has no
        // component between its brackets has no index values to wait for
        // before resolving.
        if (this.doenetAttributes.fixedReferent) {
            for (const name of [
                "referentInfo",
                "value",
                "canBeModified",
                "unordered",
                "isNumber",
            ]) {
                this.state[name].stateVariablesDeterminingDependencies =
                    undefined;
            }
        } else if (!pathHasIndexComponents(this.refResolution)) {
            for (const name of [
                "extendIdx",
                "unresolvedPath",
                "originalPath",
            ]) {
                this.state[name].stateVariablesDeterminingDependencies =
                    undefined;
            }
        }
    }

    /**
     * The referent and variable this reference reads, when a copy fixed
     * them as it made the reference (`Copy.js`); `undefined` for a
     * reference that resolves itself, whose `referentInfo` works them out.
     */
    get fixedReferent() {
        return this.doenetAttributes.fixedReferent;
    }

    static createAttributesObject() {
        return {};
    }

    static returnChildGroups() {
        return [];
    }

    /**
     * The component type this reference stands in for when its parent matches
     * children to child groups, and that its parent's definitions see as its
     * `componentType`.
     */
    get presentedComponentType() {
        return this.doenetAttributes.presentedComponentType;
    }

    /**
     * Whether this reference stands in for an adapter of its referent: it
     * presents as a type the referent adapts to and reads the adapter's
     * variable (`n.math` for `$n` in a `<math>`), so for anything that asks
     * about an adapter's source, the referent is that source.
     */
    get presentsAsAdapter() {
        return this.doenetAttributes.adapterVariable !== undefined;
    }

    static returnStateVariableDefinitions() {
        const baseDefinitions = super.returnStateVariableDefinitions();
        const stateVariableDefinitions = {};

        // The three variables that resolve the reference are the ones a
        // `_copy` has. They are inert for a reference whose referent a copy
        // fixed: no `refResolution`, no dependency, and nothing asks them.

        // The components written between the brackets of the reference's
        // path, whose values the index is read from.
        stateVariableDefinitions.refResolutionIndexDependencies = {
            returnDependencies() {
                if (!pathHasIndexComponents(this.svComponent.refResolution)) {
                    return {};
                }
                return {
                    refResolutionIndexDependencies: {
                        dependencyType: "refResolutionIndexDependencies",
                    },
                };
            },
            definition: ({ dependencyValues }) => ({
                setValue: {
                    refResolutionIndexDependencies:
                        dependencyValues.refResolutionIndexDependencies ?? [],
                },
            }),
        };

        stateVariableDefinitions.refResolutionIndexDependencyValues = {
            stateVariablesDeterminingDependencies: [
                "refResolutionIndexDependencies",
            ],
            returnDependencies: ({ stateValues }) => {
                const dependencies = {};
                for (const cIdx of stateValues.refResolutionIndexDependencies) {
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
                    refResolutionIndexDependencyValues: dependencyValues,
                },
            }),
        };

        // The component the reference resolved to, with the path left to
        // resolve on it (`null` for the implicit prop); `-1` when there is
        // none.
        stateVariableDefinitions.extendIdx = {
            additionalStateVariablesDefined: ["unresolvedPath", "originalPath"],
            stateVariablesDeterminingDependencies: [
                "refResolutionIndexDependencyValues",
            ],
            // `stateValues` is absent when the path has no index components
            // (the constructor then drops the determining variable)
            returnDependencies({ stateValues = {} }) {
                if (!this.svComponent.refResolution) {
                    return {};
                }
                return {
                    refResolution: {
                        dependencyType: "refResolution",
                        indexDependencyValues:
                            stateValues.refResolutionIndexDependencyValues ??
                            {},
                    },
                };
            },
            definition({ dependencyValues }) {
                const resolution = dependencyValues.refResolution;
                if (resolution) {
                    return {
                        setValue: {
                            extendIdx: resolution.extendIdx,
                            unresolvedPath: resolution.unresolvedPath,
                            originalPath: resolution.originalPath,
                        },
                    };
                }
                const fixedReferent = this.svComponent.fixedReferent;
                return {
                    setValue: {
                        extendIdx: fixedReferent?.componentIdx ?? -1,
                        unresolvedPath: fixedReferent
                            ? [
                                  {
                                      name: fixedReferent.referencedVariable,
                                      index: [],
                                  },
                              ]
                            : null,
                        originalPath: [],
                    },
                };
            },
        };

        // The referent and the variable read on it: `{componentIdx,
        // componentType, variableName, referencedVariable,
        // referencedPrimaryValue, companions}`, or `null` while there is
        // nothing to read. The variable read is the adapter's when the
        // reference presents as an adapter's type; `referencedVariable` is
        // the one the author's reference resolved to, whose companions
        // travel with it. Worked out by a `referent` dependency on the
        // component the reference resolved to, or fixed by the copy that
        // made the reference (`fixedReferent`).
        //
        // Shadowed when a copy of the component holding this reference
        // shadows it, so that the copy's reference reads the same referent.
        stateVariableDefinitions.referentInfo = {
            shadowVariable: true,
            stateVariablesDeterminingDependencies: [
                "extendIdx",
                "unresolvedPath",
            ],
            // `stateValues` is absent for a fixed referent (the constructor
            // then drops the determining variables)
            returnDependencies({ stateValues = {} }) {
                if (
                    this.svComponent.fixedReferent ||
                    stateValues.extendIdx == null ||
                    stateValues.extendIdx === -1
                ) {
                    return {};
                }
                return {
                    referent: {
                        dependencyType: "referent",
                        componentIdx: stateValues.extendIdx,
                        unresolvedPath: stateValues.unresolvedPath,
                    },
                };
            },
            definition({ dependencyValues, componentInfoObjects }) {
                const fixedReferent = this.svComponent.fixedReferent;
                if (fixedReferent) {
                    return {
                        setValue: { referentInfo: fixedReferent },
                        checkForActualChange: { referentInfo: true },
                    };
                }
                const referent = dependencyValues.referent;
                let referentInfo = null;
                if (referent) {
                    const { adapterVariable, referencedComponentType } =
                        this.svComponent.doenetAttributes;
                    if (
                        referent.createComponentOfType !== undefined &&
                        referencedComponentType !== undefined &&
                        !componentInfoObjects.isInheritedComponentType({
                            inheritedComponentType:
                                referent.createComponentOfType,
                            baseComponentType: referencedComponentType,
                        })
                    ) {
                        // The reference was planned, and matched to its
                        // parent's child groups, for a variable of another
                        // type; reading this one would hand the parent a
                        // value of the wrong kind.
                        reportInternalError(
                            `Value reference ${this.svComponent.componentIdx} planned for a ${referencedComponentType} resolved to ${referent.variableName} of ${referent.componentIdx}, a ${referent.createComponentOfType}.`,
                        );
                    } else {
                        referentInfo = {
                            componentIdx: referent.componentIdx,
                            componentType: referent.componentType,
                            variableName:
                                adapterVariable ?? referent.variableName,
                            referencedVariable: referent.variableName,
                            referencedPrimaryValue: referent.isPrimaryValue,
                            companions: referent.companions,
                        };
                    }
                }
                return {
                    setValue: { referentInfo },
                    checkForActualChange: { referentInfo: true },
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
        stateVariableDefinitions.value = {
            shadowVariable: true,
            stateVariablesDeterminingDependencies: ["referentInfo"],
            // the inverse needs no dependency values; computing them would
            // re-evaluate the referent's variable in the middle of a write
            excludeDependencyValuesInInverseDefinition: true,
            returnDependencies({ stateValues = {} }) {
                const fixedReferent = this.svComponent.fixedReferent;
                const referentInfo = fixedReferent ?? stateValues.referentInfo;
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
                            value: emptyValueOfType(
                                this.svComponent.presentedComponentType,
                                componentInfoObjects,
                            ),
                        },
                    };
                }
                return { setValue: { value: target } };
            },
            async inverseDefinition({
                desiredStateVariableValues,
                stateValues,
            }) {
                if (!(await stateValues.referentInfo)) {
                    return { success: false };
                }
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "target",
                            desiredValue: desiredStateVariableValues.value,
                        },
                    ],
                };
            },
        };

        // A reference is hidden with its parent or with the composite that
        // made it, never with its referent: `$n` shows the value of a hidden
        // `n`.
        stateVariableDefinitions.hidden = {
            returnDependencies: () => ({
                parentHidden: {
                    dependencyType: "parentStateVariable",
                    variableName: "hidden",
                },
                sourceCompositeHidden: {
                    dependencyType: "sourceCompositeStateVariable",
                    variableName: "hidden",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    hidden: Boolean(
                        dependencyValues.parentHidden ||
                        dependencyValues.sourceCompositeHidden,
                    ),
                },
            }),
            markStale: () => ({ updateParentRenderedChildren: true }),
        };

        // The composite expander sets this directly on every replacement of
        // a composite that withholds some of them, so it must exist here.
        stateVariableDefinitions.isInactiveCompositeReplacement =
            baseDefinitions.isInactiveCompositeReplacement;

        // Three variables a parent reads from every `math` or `number` child
        // before using it. When the reference is to the referent's own value
        // and the referent has the variable, the referent answers; otherwise
        // the reference answers as a component of the presented type holding
        // this value would.

        // Whether a write through this reference can succeed. Inputs have no
        // `canBeModified`; a `math` standing in for one answers from the
        // referent's `fixed` and `modifyIndirectly`.
        stateVariableDefinitions.canBeModified = referentOrFallback({
            stateVariable: "canBeModified",
            fallbackDependencies: (referentIdx) =>
                referentIdx === undefined
                    ? {}
                    : {
                          targetFixed: {
                              dependencyType: "stateVariable",
                              componentIdx: referentIdx,
                              variableName: "fixed",
                              variablesOptional: true,
                          },
                          modifyIndirectly: {
                              dependencyType: "stateVariable",
                              componentIdx: referentIdx,
                              variableName: "modifyIndirectly",
                              variablesOptional: true,
                          },
                      },
            fallback: (dependencyValues) =>
                !dependencyValues.targetFixed &&
                dependencyValues.modifyIndirectly !== false,
        });

        // A `math` with no `unordered` attribute and no math children is
        // ordered.
        stateVariableDefinitions.unordered = referentOrFallback({
            stateVariable: "unordered",
            fallback: () => false,
        });

        // `Math.js`: whether the value is a finite number.
        stateVariableDefinitions.isNumber = referentOrFallback({
            stateVariable: "isNumber",
            fallbackDependencies: () => ({
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                },
            }),
            fallback: ({ value }) =>
                Number.isFinite(
                    typeof value === "number" ? value : value?.tree,
                ),
        });

        return stateVariableDefinitions;
    }

    /**
     * A value reference has no children, so a child dependency of a
     * definition it borrows from its presented type finds none, whatever the
     * group.
     */
    returnMatchedChildIndices() {
        return [];
    }

    /**
     * The definitions to give this reference for a state variable it was not
     * built with, asked for by a dependency of its parent. Returned as
     * `[name, definition]` pairs: usually the one variable, sometimes more
     * (the array an entry name belongs to, or a whole group of variables one
     * definition computes together); empty when nothing fits.
     *
     * The definition is the presented type's own
     * (`classDefinitions(presentedClass)`), so the reference derives `text`,
     * `latex`, `isNumber`, a `matrixEntry`, … from its value exactly as a
     * component of that type would, with no attributes and no children. A
     * definition of one scalar is made to look at `referentInfo` first: when
     * the referenced variable's shadowing instructions name a companion for
     * the variable on the referent (`companions`), it reads that instead and
     * writes there, the way a shadow would, mirroring the referent's
     * `usedDefault`; the `displayDigits` of `$n` are then `n`'s, so a parent
     * falling through to a sole child's display settings sees what it would
     * see on the referent. Only those companions redirect: the referent's own
     * `text` describes the referent's value, not `$m.styleDescription`, and
     * does not take a write, whereas the borrowed `text` inverts to `value`
     * and so to the referent. Arrays and definitions of several variables
     * are borrowed as they are.
     */
    createOnDemandStateVariableDefinitions({
        stateVariable,
        classDefinitions,
    }) {
        const presentedClass =
            this.componentInfoObjects.allComponentClasses[
                this.presentedComponentType
            ];
        if (!presentedClass) {
            return [];
        }
        const presentedDefinitions = classDefinitions(presentedClass);

        // The name of an array entry (`matrixEntry1_1`) asks for its array.
        let name = stateVariable;
        if (!presentedDefinitions[name]) {
            const arrayEntryPrefixes =
                this.componentInfoObjects.stateVariableInfo[
                    this.presentedComponentType
                ].arrayEntryPrefixes;
            const prefix = Object.keys(arrayEntryPrefixes)
                .filter((p) => name.startsWith(p))
                .sort((a, b) => b.length - a.length)[0];
            if (prefix !== undefined) {
                name = arrayEntryPrefixes[prefix].arrayVariableName;
                if (name in this.state) {
                    return [];
                }
            }
        }

        const classDef = presentedDefinitions[name];
        if (!classDef || classDef.isAlias) {
            // an alias is substituted by the dependency before it gets here;
            // one that was not is left missing rather than built from a
            // definition that has no dependencies of its own
            return [];
        }

        const group = [
            name,
            ...(classDef.additionalStateVariablesDefined ?? []),
        ];
        if (group.length === 1 && !classDef.isArray) {
            return [
                [name, companionOrBorrowed(name, classDef, this.fixedReferent)],
            ];
        }
        return group.map((varName) => [
            varName,
            Object.create(presentedDefinitions[varName]),
        ]);
    }
}

/**
 * Whether the reference's path has a component written between its brackets
 * (`$l[$i]`), whose value the index is read from.
 */
function pathHasIndexComponents(refResolution) {
    return Boolean(
        refResolution?.originalPath.some((pathPart) =>
            pathPart.index.some(
                (indexPart) => typeof indexPart.value[0] !== "string",
            ),
        ),
    );
}

/**
 * The empty values of the four kinds of value a reference can present as,
 * for a presented type whose `value` declares no default of its own (a
 * `math` computes its value from `unnormalizedValue`, which is where its
 * default lives).
 */
const EMPTY_VALUE_BY_BASE_TYPE = {
    number: NaN,
    math: me.fromAst("\uff3f"),
    text: "",
    boolean: false,
};

/**
 * The value a component of `componentType` holds when it holds nothing: the
 * declared default of its `value`, or the nearest ancestor type's for a type
 * whose `value` declares none (`integer` takes `number`'s `NaN`), or else
 * the empty value of the kind it is (`＿` for a `math`).
 */
function emptyValueOfType(componentType, componentInfoObjects) {
    let componentClass =
        componentInfoObjects.allComponentClasses[componentType];
    while (componentClass?.componentType) {
        const defaultValue =
            componentInfoObjects.publicStateVariableInfo[
                componentClass.componentType
            ]?.stateVariableDescriptions.value?.defaultValue;
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        componentClass = Object.getPrototypeOf(componentClass);
    }
    for (const baseType in EMPTY_VALUE_BY_BASE_TYPE) {
        if (
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: componentType,
                baseComponentType: baseType,
            })
        ) {
            return EMPTY_VALUE_BY_BASE_TYPE[baseType];
        }
    }
    return null;
}

/**
 * A state variable definition that answers with the referent's variable of
 * the same name when the reference is to the referent's own value
 * (`referentInfo.referencedPrimaryValue`) and the referent has the variable,
 * and with `fallback` otherwise. `fallbackDependencies(referentIdx)` are the
 * dependencies the fallback reads; `fallback(dependencyValues)` computes it.
 */
function referentOrFallback({
    stateVariable,
    fallbackDependencies = () => ({}),
    fallback,
}) {
    return {
        stateVariablesDeterminingDependencies: ["referentInfo"],
        returnDependencies({ stateValues = {} }) {
            const referentInfo =
                this.svComponent.fixedReferent ?? stateValues.referentInfo;
            const dependencies = fallbackDependencies(
                referentInfo?.componentIdx,
            );
            if (referentInfo?.referencedPrimaryValue) {
                dependencies.fromReferent = {
                    dependencyType: "stateVariable",
                    componentIdx: referentInfo.componentIdx,
                    variableName: stateVariable,
                    variablesOptional: true,
                };
            }
            return dependencies;
        },
        definition({ dependencyValues }) {
            const fromReferent = dependencyValues.fromReferent;
            const value =
                fromReferent === null || fromReferent === undefined
                    ? fallback(dependencyValues)
                    : fromReferent;
            return { setValue: { [stateVariable]: Boolean(value) } };
        },
    };
}

/**
 * The definition `classDef` of the scalar `name`, made to read the
 * referent's companion for `name` when `referentInfo` (or the referent a
 * copy fixed, `fixedReferent`) names one, and to run as the presented type's
 * own definition otherwise. In the first case the value is the companion's,
 * the referent's `usedDefault` is mirrored the way `shadowDefinition` in the
 * factory mirrors it, and a write goes to the companion.
 */
function companionOrBorrowed(name, classDef, fixedReferent) {
    const definition = Object.create(classDef);
    if (!fixedReferent) {
        definition.stateVariablesDeterminingDependencies = [
            ...(classDef.stateVariablesDeterminingDependencies ?? []),
            "referentInfo",
        ];
    }

    definition.returnDependencies = function (args) {
        const referentInfo = fixedReferent ?? args.stateValues?.referentInfo;
        const companion = referentInfo?.companions?.[name];
        if (companion) {
            return {
                fromReferent: {
                    dependencyType: "stateVariable",
                    componentIdx: referentInfo.componentIdx,
                    variableName: companion,
                    variablesOptional: true,
                },
            };
        }
        return classDef.returnDependencies.call(this, args);
    };

    definition.definition = function (args) {
        if (!("fromReferent" in args.dependencyValues)) {
            return classDef.definition.call(this, args);
        }
        const value = args.dependencyValues.fromReferent;
        if (
            args.usedDefault.fromReferent &&
            this.hasEssential &&
            this.defaultValue !== undefined
        ) {
            return {
                useEssentialOrDefaultValue: {
                    [name]: { defaultValue: value },
                },
            };
        }
        return { setValue: { [name]: value } };
    };

    definition.inverseDefinition = async function (args) {
        const referentInfo = await args.stateValues.referentInfo;
        if (!referentInfo?.companions?.[name]) {
            if (classDef.inverseDefinition) {
                return classDef.inverseDefinition.call(this, args);
            }
            return { success: false };
        }
        return {
            success: true,
            instructions: [
                {
                    setDependency: "fromReferent",
                    desiredValue: args.desiredStateVariableValues[name],
                    shadowedVariable: true,
                },
            ],
        };
    };

    return definition;
}
