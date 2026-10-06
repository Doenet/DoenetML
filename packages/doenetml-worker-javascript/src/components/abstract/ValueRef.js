import me from "math-expressions";
import BaseComponent from "./BaseComponent";
import { reportInternalError } from "../../utils/internalErrors";
import { currentReferentValue } from "../../utils/referentDescription";
import { LIST_ENTRY_PREFIX } from "../../utils/listEntryReference";
import {
    parentDrawsValueReferences,
    variableOfCopiedReferentVariable,
    variableOfReferentVariable,
} from "../../utils/valueReference";

/**
 * A value reference: the component a bare `$n` becomes when it stands where
 * only a value is read, such as inside `<math>$n+1</math>` or in the content
 * of an attribute (`displayDigits="$n"`), or where its value is drawn, as in
 * `<p>The value is $n.</p>` (below).
 *
 * It reads one state variable of its referent and takes the place, in its
 * parent's child groups, of a component of `presentedComponentType`:
 * `number` for `$n` in a `<number>`, `math` for the same `$n` in a `<math>`,
 * where it reads `n.math` instead of `n.value`. `ChildMatcher` matches it by
 * the presented type. Written between the brackets of another reference's
 * path (`$i` of `$l[$i]`), it presents as an `integer` and gives that
 * reference its index (`refResolutionDependencies.ts`).
 *
 * It resolves its own reference. Made from the document
 * (`utils/dast/valueReferences.ts`), it carries the reference's
 * `refResolution` and resolves it the way a `_copy` does, re-resolving as
 * the index of `$P.xs[$i]` changes; made by a `_copy` that expanded
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
 * variables that are actually read and nothing else. It has no `fixed` of
 * its own: a write through it lands on the referent, whose own `fixed`
 * refuses it there. (A drawn one that stands for a copy of its referent
 * reads the referent's `fixed` for its renderer, below.) It declares no attributes. The only attributes it can
 * hold are the marks by which an `<answer>` records what a reference in its
 * awards reads as a response (`isPotentialResponse`, `isResponse`); the
 * answer asks for them, and they are made on demand like the rest and read
 * the reference's own marks. The answer then records the referenced value
 * as it is on the referent (`valueAsResponse`).
 *
 * In a parent that renders its children (`$n` in
 * `<p>The value is $n.</p>`, `parentDrawsValueReferences`), it is drawn by
 * the renderer of the type it presents as (`isDrawn`), from the few of its
 * variables that renderer reads outside a graph (`rendererVariables`):
 * `text` or `latex` with the referent's display settings, a boolean's
 * `value`, `selectedStyle` and `hidden`. `renderAsMath`, `renderMode` and
 * `clickTarget` are sent at the value a component of that type has by
 * default (`rendererConstants`), unless it stands for a copy of its referent
 * (`copiesReferent`), when they, `selectedStyle` and `fixed` are read from
 * the referent. Nothing that places it in a graph is sent.
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

        // A drawn reference that stands for a copy of its referent is
        // clicked and focused as its referent is: the copy made for it was
        // a click target when the referent was. The action is passed to the
        // referent the reference reads when it is performed, so it follows
        // the reference if that changes.
        if (this.doenetAttributes.copiesReferent && this.isDrawn) {
            for (const actionName of this._referentActionNames()) {
                this.actions[actionName] = (args = {}) =>
                    this._performOnReferent(actionName, args);
            }
        }

        // What is known at construction trims the resolution chain. A
        // reference whose referent a copy fixed (`fixedReferent`) resolves
        // nothing: `referentInfo` is that constant, and the variables that
        // would be determined by it read it directly. One whose path has no
        // component between its brackets has no index values to wait for
        // before resolving. Only a drawn reference's `hidden` reads its
        // referent.
        if (this.doenetAttributes.fixedReferent || !this.isDrawn) {
            this.state.hidden.stateVariablesDeterminingDependencies = undefined;
        }
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
     * Whether this reference is drawn: its parent renders its children and
     * draws value references there (`parentDrawsValueReferences`).
     */
    get isDrawn() {
        const parentClass = this.ancestors?.[0]?.componentClass;
        if (this._drawnInParentClass !== parentClass) {
            this._drawnInParentClass = parentClass;
            this._isDrawn = parentDrawsValueReferences(
                parentClass,
                this.componentInfoObjects,
            );
        }
        return this._isDrawn;
    }

    /**
     * The renderer of the type this reference presents as, when it is
     * drawn; none otherwise.
     */
    get rendererType() {
        if (!this.isDrawn) {
            return undefined;
        }
        return this.componentInfoObjects.allComponentClasses[
            this.presentedComponentType
        ]?.rendererType;
    }

    /**
     * The state variables a drawn reference sends its renderer, as an
     * object keyed by their names (the shape of
     * `Core.rendererVariablesByComponentType`, which these take the place
     * of): those of the presented type's renderer variables
     * (`rendererVariablesByComponentType`) that it reads outside a graph and
     * that vary, `DRAWN_REFERENCE_VARIABLES`. None when the reference is not
     * drawn, so no change to it queues a renderer update.
     */
    get rendererVariables() {
        if (!this.isDrawn) {
            return NO_RENDERER_VARIABLES;
        }
        if (this._rendererVariables === undefined) {
            this._rendererVariables = {};
            for (const name of this._presentedRendererVariableNames()) {
                if (
                    DRAWN_REFERENCE_VARIABLES.has(name) ||
                    (this.doenetAttributes.copiesReferent &&
                        COPIED_REFERENT_VARIABLES.has(name))
                ) {
                    this._rendererVariables[name] = true;
                }
            }
        }
        return this._rendererVariables;
    }

    /**
     * What a drawn reference sends its renderer for the rest of the
     * presented type's renderer variables: the value a component of that
     * type with no attributes has (`DRAWN_REFERENCE_CONSTANTS`), except
     * those it reads from its referent when it stands for a copy of it
     * (`copiesReferent`). A reference is not drawn in a graph, so what
     * places it on one is not sent.
     */
    get rendererConstants() {
        const constants = {};
        for (const name of this._presentedRendererVariableNames()) {
            if (
                name in DRAWN_REFERENCE_CONSTANTS &&
                !(name in this.rendererVariables)
            ) {
                constants[name] = DRAWN_REFERENCE_CONSTANTS[name];
            }
        }
        return constants;
    }

    /**
     * Do for `actionName` (a click or a focus) what the referent this
     * reference reads now does for it (`numberClicked` in `Number.js`, …):
     * nothing when the referent is fixed (`fixed`, which a drawn reference
     * that stands for a copy of its referent reads from it), and otherwise
     * trigger the actions chained to a click or focus on the referent.
     */
    async _performOnReferent(
        actionName,
        { actionId, sourceInformation = {}, skipRendererUpdate = false } = {},
    ) {
        const referentInfo =
            this.fixedReferent ?? (await this.stateValues.referentInfo);
        if (!referentInfo || (await this.stateValues.fixed)) {
            return;
        }
        await this.coreFunctions.triggerChainedActions({
            triggeringAction: actionName.endsWith("Clicked")
                ? "click"
                : "focus",
            componentIdx: referentInfo.componentIdx,
            actionId,
            sourceInformation,
            skipRendererUpdate,
        });
    }

    /**
     * The actions by which the renderer of the presented type reports a
     * click or a focus (`REFERENT_ACTIONS`).
     */
    _referentActionNames() {
        for (const baseType in REFERENT_ACTIONS) {
            if (
                this.componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: this.presentedComponentType,
                    baseComponentType: baseType,
                })
            ) {
                return REFERENT_ACTIONS[baseType];
            }
        }
        return [];
    }

    /** The names of the renderer variables of the presented type. */
    _presentedRendererVariableNames() {
        if (this._presentedRendererNames === undefined) {
            const presentedClass =
                this.componentInfoObjects.allComponentClasses[
                    this.presentedComponentType
                ];
            this._presentedRendererNames = Object.keys(
                presentedClass?.returnStateVariableInfo({
                    onlyForRenderer: true,
                }).stateVariableDescriptions ?? {},
            );
        }
        return this._presentedRendererNames;
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
                // A reference to an entry of a list component, planned to
                // read the entry's property that an adapter of the entries'
                // type reads (`$l[$i]` in a `<math>` reads `$l[$i].math`,
                // `planListEntryAdapterReference`).
                const adapterProperty =
                    this.svComponent.doenetAttributes.listEntryAdapterProperty;
                return {
                    referent: {
                        dependencyType: "referent",
                        componentIdx: stateValues.extendIdx,
                        unresolvedPath:
                            adapterProperty === undefined
                                ? stateValues.unresolvedPath
                                : [
                                      ...(stateValues.unresolvedPath ?? []),
                                      { name: adapterProperty, index: [] },
                                  ],
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
                            listEntryPosition: referent.listEntryPosition,
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
                return targetDependencies(
                    this.svComponent.fixedReferent,
                    stateValues.referentInfo,
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
        // made it. One that is read for its value is never hidden with its
        // referent: `<math>$n+1</math>` uses the value of a hidden `n`. One
        // that is drawn is hidden where the copy made for it would not have
        // been shown: when it has nothing to read (`valueMissing`; the copy
        // made no component) and, when it stands for a copy of its referent
        // (`copiesReferent`), with the referent's `hide`, which that copy
        // shadowed (`$t` of `<text hide>`; not `$t.value`).
        stateVariableDefinitions.hidden = {
            stateVariablesDeterminingDependencies: ["referentInfo"],
            returnDependencies({ stateValues = {} }) {
                const dependencies = {
                    parentHidden: {
                        dependencyType: "parentStateVariable",
                        variableName: "hidden",
                    },
                    sourceCompositeHidden: {
                        dependencyType: "sourceCompositeStateVariable",
                        variableName: "hidden",
                    },
                };
                const component = this.svComponent;
                if (!component.isDrawn) {
                    return dependencies;
                }
                if (!component.fixedReferent) {
                    dependencies.valueMissing = {
                        dependencyType: "stateVariable",
                        variableName: "valueMissing",
                    };
                }
                const referentInfo =
                    component.fixedReferent ?? stateValues.referentInfo;
                if (component.doenetAttributes.copiesReferent && referentInfo) {
                    dependencies.referentHide = {
                        dependencyType: "stateVariable",
                        componentIdx: referentInfo.componentIdx,
                        variableName: "hide",
                        variablesOptional: true,
                    };
                }
                // An entry of a list that shows each entry as its source
                // (`<collect>`, `<sort>`) is hidden as the copy of the entry
                // was: by the source's own `hide`, unless the list sets one.
                // Not a property of the entry (`$c[1].hidden`).
                Object.assign(
                    dependencies,
                    listEntryHideDependencies(referentInfo),
                );
                return dependencies;
            },
            definition: ({ dependencyValues }) => {
                const entryHide = listEntryHide(dependencyValues);
                return {
                    setValue: {
                        hidden: Boolean(
                            dependencyValues.parentHidden ||
                            dependencyValues.sourceCompositeHidden ||
                            dependencyValues.valueMissing ||
                            dependencyValues.referentHide ||
                            entryHide,
                        ),
                    },
                };
            },
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
        // An entry of a list component answers from the list's
        // `entriesCanBeModified` in place of its `fixed`: the entries of a
        // `<sequence>` are fixed while the list's own `fixed` is not, and a
        // `<math>` that holds one (`$q$s[1]^2`) must solve for its other
        // operands, as it did for the fixed component a copy made for the
        // entry. The list's `modifyIndirectly` still applies, as the write
        // to the list is refused when it is false.
        stateVariableDefinitions.canBeModified = referentOrFallback({
            stateVariable: "canBeModified",
            fallbackDependencies: (referentIdx, referentInfo) =>
                referentIdx === undefined
                    ? {}
                    : {
                          ...(referentInfo.listEntryPosition !== undefined
                              ? {
                                    entriesCanBeModified: {
                                        dependencyType: "stateVariable",
                                        componentIdx: referentIdx,
                                        variableName: "entriesCanBeModified",
                                        variablesOptional: true,
                                    },
                                }
                              : {
                                    targetFixed: {
                                        dependencyType: "stateVariable",
                                        componentIdx: referentIdx,
                                        variableName: "fixed",
                                        variablesOptional: true,
                                    },
                                }),
                          modifyIndirectly: {
                              dependencyType: "stateVariable",
                              componentIdx: referentIdx,
                              variableName: "modifyIndirectly",
                              variablesOptional: true,
                          },
                      },
            fallback: (dependencyValues) =>
                ("entriesCanBeModified" in dependencyValues
                    ? dependencyValues.entriesCanBeModified !== false
                    : !dependencyValues.targetFixed) &&
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
     * Serialize this reference. It is copied as a value reference, which
     * reads what this one reads: within a component being copied (a `<p>` or
     * `<math>` holding it), and as the replacement of a copy of the
     * composite that made it, which stands where that composite does. Asked
     * for as a component (`valueReferenceAsComponent`), when it is what a
     * `<collect>` found or what a reference names (`<text extend="$cc"/>` of
     * a composite that made it, `$s[2]` of a `<sort>`), it is copied as a
     * component of the type it presents as, as the component a `_copy` made
     * for it was. What a linked copy of it shadows is set below: the
     * referent's variable when the referent cannot move, this reference when
     * it can. The component a `_copy` made took the settings that travel
     * with the referenced value (`fixed`, the display settings) as attribute
     * components shadowing the referent's
     * (`addAttributeComponentsShadowingStateVariables` in `Copy.js`), and so
     * does this copy: attribute components shadowing the variables of the
     * referent this reference reads them from (`companions`;
     * `shadowsVariableOf`, `utils/copy.js`).
     */
    async serialize(parameters = {}) {
        const serialized = await super.serialize(parameters);
        if (
            !parameters.valueReferenceAsComponent ||
            parameters.serializingDescendant
        ) {
            return serialized;
        }
        serialized.componentType = this.presentedComponentType;
        delete serialized.extending;
        for (const name of VALUE_REFERENCE_DOENET_ATTRIBUTES) {
            delete serialized.doenetAttributes[name];
            delete serialized.originalDoenetAttributes[name];
        }

        const referentInfo =
            this.fixedReferent ?? (await this.stateValues.referentInfo);
        const attributesObject =
            this.componentInfoObjects.allComponentClasses[
                this.presentedComponentType
            ]?.createAttributesObject() ?? {};
        // An unlinked copy (`copyAll`) takes the settings as they are now,
        // read from the referent among the `components` its caller passes.
        const referent = parameters.copyAll
            ? parameters.components?.[referentInfo?.componentIdx]
            : undefined;
        for (const name in referentInfo?.companions ?? {}) {
            const attributeComponentType =
                attributesObject[name]?.createComponentOfType;
            if (!attributeComponentType || name in serialized.attributes) {
                continue;
            }
            const component = {
                type: "serialized",
                componentType: attributeComponentType,
                // no component of its own to copy; given an index with the
                // copy's others (`createNewComponentIndices`)
                componentIdx: -1,
                attributes: {},
                doenetAttributes: {},
                state: {},
                children: [],
            };
            if (parameters.copyAll) {
                if (!referent) {
                    continue;
                }
                component.state.value = await currentReferentValue(
                    referent,
                    referentInfo.companions[name],
                );
                // it has no original to be an unlinked copy of
                component.dontShadowOriginalIndex = true;
            } else {
                component.shadowsVariableOf = {
                    componentIdx: referentInfo.componentIdx,
                    variableName: referentInfo.companions[name],
                };
            }
            serialized.attributes[name] = {
                type: "component",
                name,
                component,
            };
        }
        // When what it reads cannot move to another referent or variable
        // (its path has no component between its brackets), it is copied as
        // the component a `_copy` made for it was: shadowing the variable it
        // reads on the referent rather than this reference, so that an
        // unlinked copy of it has a value to copy. One that stands for a copy
        // of its referent (`copiesReferent`) shadows it as that copy did, as
        // its implicit prop, and so takes the referent's attributes too
        // (`hide`, `styleNumber`, `renderMode`, …). One whose referent moves
        // (`$l[$i]`) shadows this reference, which follows it.
        if (
            referentInfo &&
            (this.fixedReferent || !pathHasIndexComponents(this.refResolution))
        ) {
            serialized.shadowsVariableOf = {
                componentIdx: referentInfo.componentIdx,
                variableName: referentInfo.variableName,
            };
            if (this.doenetAttributes.copiesReferent) {
                serialized.shadowsVariableOf.fromImplicitProp = true;
                serialized.doenetAttributes.fromImplicitProp = true;
            }
        }
        // An unlinked copy (`<number copy="$s[2]"/>`) shadows nothing, so it
        // is given the value this reference reads now, as an unlinked copy
        // of the component a `_copy` made for it was given that component's.
        if (parameters.copyAll) {
            // One that stands for a copy of its referent (`copiesReferent`)
            // also takes the referent's settings that are not their
            // defaults (`hide`, `styleNumber`, `simplify`, …): the copy a
            // `_copy` made shadowed all of the referent's attributes, and an
            // unlinked copy of it took their values
            // (`copyEssentialStateIfShadow`).
            if (this.doenetAttributes.copiesReferent && referent) {
                for (const varName in referent.state) {
                    const stateVar = referent.state[varName];
                    if (!stateVar.hasEssential) {
                        continue;
                    }
                    const value = await referent.stateValues[varName];
                    if (!referent.state[varName].usedDefault) {
                        serialized.state[varName] = value;
                    }
                }
            }
            serialized.state.value = await this.stateValues.value;
        }
        return serialized;
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
     *
     * A name made by `referentVariableName` (`utils/valueReference.ts`) asks
     * instead for a variable of the referent as it is there
     * (`readsReferentVariable`): what a dependency on this reference's
     * adapter source reads (`adapterDependencies.ts`), since the referent is
     * that source.
     * A name made by `copiedReferentVariableName` asks for it only when the
     * reference stands for a copy of its referent (`copiesReferent`), and is
     * `null` otherwise.
     *
     * `valueMissing`, whether the reference has nothing to read, is its own
     * (`valueMissingDefinition`). The parents that treat such a reference
     * differently ask for it, and so do the reference's own `valueAsResponse`
     * and `componentTypeAsResponse` (`valueAsResponseDefinition`), which only
     * an `<answer>` (of the references in its awards) and a
     * `<considerAsResponses>` (of its children) ask for. A reference a copy
     * made at run time has no `valueMissing`, but has the other two.
     * `pastEndOfList` (`pastEndOfListDefinition`), which a list asks of its
     * children, is likewise the reference's own.
     */
    createOnDemandStateVariableDefinitions({
        stateVariable,
        classDefinitions,
    }) {
        if (stateVariable === "valueMissing") {
            return this.fixedReferent
                ? []
                : [[stateVariable, valueMissingDefinition()]];
        }
        if (stateVariable === "pastEndOfList") {
            return this.fixedReferent
                ? []
                : [[stateVariable, pastEndOfListDefinition()]];
        }
        if (stateVariable === "valueAsResponse") {
            return [
                [
                    stateVariable,
                    valueAsResponseDefinition(
                        this.doenetAttributes.referencedComponentType,
                        this.fixedReferent,
                    ),
                ],
            ];
        }
        if (stateVariable === "componentTypeAsResponse") {
            return [
                [
                    stateVariable,
                    componentTypeAsResponseDefinition(
                        this.doenetAttributes.referencedComponentType,
                        this.fixedReferent,
                    ),
                ],
            ];
        }
        // A drawn reference that stands for a copy of its referent shows as
        // the referent does: the copy made for it shadowed the referent's
        // attributes.
        if (
            this.doenetAttributes.copiesReferent &&
            this.isDrawn &&
            COPIED_REFERENT_VARIABLES.has(stateVariable)
        ) {
            return [
                [
                    stateVariable,
                    readsReferentVariable(
                        stateVariable,
                        stateVariable,
                        this.fixedReferent,
                    ),
                ],
            ];
        }
        // A name made by `copiedReferentVariableName` reads the referent's
        // variable only when this reference stands for a copy of it.
        const copiedVariable = variableOfCopiedReferentVariable(stateVariable);
        if (copiedVariable !== undefined) {
            return [
                [
                    stateVariable,
                    this.doenetAttributes.copiesReferent
                        ? readsReferentVariable(
                              stateVariable,
                              copiedVariable,
                              this.fixedReferent,
                          )
                        : {
                              returnDependencies: () => ({}),
                              definition: () => ({
                                  setValue: { [stateVariable]: null },
                              }),
                          },
                ],
            ];
        }
        const referentVariable = variableOfReferentVariable(stateVariable);
        if (referentVariable !== undefined) {
            return [
                [
                    stateVariable,
                    readsReferentVariable(
                        stateVariable,
                        referentVariable,
                        this.fixedReferent,
                    ),
                ],
            ];
        }

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
 * The `doenetAttributes` that make a component a value reference, which a
 * copy of one made as a component of its presented type does not keep.
 */
const VALUE_REFERENCE_DOENET_ATTRIBUTES = [
    "presentedComponentType",
    "referencedComponentType",
    "adapterVariable",
    "fixedReferent",
    "copiesReferent",
    "listEntryAdapterProperty",
];

/** The renderer variables of a reference that is not drawn. */
const NO_RENDERER_VARIABLES = Object.freeze({});

/**
 * The renderer variables of `<number>`, `<math>`, `<text>` and `<boolean>`
 * that a drawn reference sends from its own state (`rendererVariables`).
 * Its `hidden` is its own; the rest are made on demand from the presented
 * type's definitions, with the referent's display settings.
 */
const DRAWN_REFERENCE_VARIABLES = new Set([
    "hidden",
    "text",
    "latex",
    "value",
    "selectedStyle",
]);

/**
 * The renderer variables, read outside a graph, that a drawn reference
 * sends at the value a component of its presented type with no attributes
 * has (`rendererConstants`): a reference takes no attributes, and these are
 * not among the settings that travel with a value. One that stands for a
 * copy of its referent (`copiesReferent`) reads them from the referent
 * instead (`COPIED_REFERENT_VARIABLES`).
 */
const DRAWN_REFERENCE_CONSTANTS = Object.freeze({
    renderAsMath: false,
    renderMode: "inline",
    clickTarget: false,
});

/**
 * The renderer variables a drawn reference that stands for a copy of its
 * referent (`copiesReferent`) reads from the referent as they are there,
 * because the copy made for it shadowed the attributes they come from:
 * the style, how it is typeset, and whether it is a click target that
 * takes clicks (`fixed`).
 */
const COPIED_REFERENT_VARIABLES = new Set([
    "selectedStyle",
    "fixed",
    ...Object.keys(DRAWN_REFERENCE_CONSTANTS),
]);

/**
 * The actions by which the renderer of a type reports a click or a focus,
 * which a drawn reference that stands for a copy of its referent passes on
 * to the referent (`_performOnReferent`).
 */
const REFERENT_ACTIONS = {
    number: ["numberClicked", "numberFocused"],
    math: ["mathClicked", "mathFocused"],
    text: ["textClicked", "textFocused"],
};

/**
 * Whether the reference's path has a component written between its brackets
 * (`$P.xs[$i]`), whose value the index is read from.
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
 * The dependencies through which a reference reads its referent's variable:
 * `target`, the variable, and, for a reference that resolves itself,
 * `targetInactive`, whether the referent is a withheld replacement of a
 * composite. None while there is no referent. `referentInfo` is the
 * reference's own; `fixedReferent` replaces it for a reference a copy made.
 */
function targetDependencies(fixedReferent, referentInfo) {
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

/**
 * The definition of `valueMissing`, made on demand for a reference that
 * resolves itself: whether it has nothing to read where the copy it replaced
 * made no component at all. That is so with no referent (an index past the
 * end of a list), a referent without the variable (`$P.z` of a point in the
 * plane, a `<choiceInput>`'s `selectedIndex` before a choice), or a withheld
 * referent (a sample a `<sampleRandomNumbers>` withholds once its
 * `numSamples` drops). Its `value` is then the empty value of the type it
 * presents as (`NaN`, `""`, `false`, `＿`), and an empty value alone cannot
 * say so, since a referent can hold `NaN` or `""` too. A variable that holds
 * `null`, such as an attribute with no default (an `<award>`'s
 * `feedbackText`), is not missing: the copy made a component for it, holding
 * the empty value `value` also holds. One case differs from the copy: an
 * array entry whose key is there but that holds no value is missing, where
 * the copy made a component holding the empty value. The known such entries
 * are those of a function's global minimum, maximum, infimum or supremum
 * when none is found (`$f.globalMinimumLocation` of `x`, any of them for a
 * function of two variables), whose arrays keep their keys when empty
 * (`Function.js`).
 *
 * The parents for which a copy that made nothing gave a different result
 * ask for it. That copy gave a blank math in a comparison
 * (`returnChildrenByCodeStateVariableDefinitions` in `utils/booleanLogic.js`)
 * and nothing at all among the operands of a math or boolean operator
 * (`MathBaseOperator.js`, `BooleanBaseOperator.js`). So do an `<answer>`, of
 * every reference in its awards, and a `<considerAsResponses>`, of its
 * children, through `valueAsResponse` and `componentTypeAsResponse`: the
 * answer records such a reference as a blank math. Nothing else asks, and
 * there the reference holds the empty value of the presented type.
 *
 * A reference a copy made at run time (`fixedReferent`) has no
 * `valueMissing`. The copy makes no reference for an entry that is not
 * there (`Copy.js`), and a reference it made stands for the component it
 * made before value references, which held the empty value of its type once
 * its variable held no value (`$c.selectedValue` after the selected choice
 * is withheld).
 */
function valueMissingDefinition() {
    return {
        stateVariablesDeterminingDependencies: ["referentInfo"],
        returnDependencies({ stateValues }) {
            return targetDependencies(undefined, stateValues.referentInfo);
        },
        definition({ dependencyValues }) {
            return {
                setValue: {
                    valueMissing:
                        dependencyValues.target === undefined ||
                        Boolean(dependencyValues.targetInactive),
                },
            };
        },
    };
}

/**
 * The definition of `pastEndOfList`, made on demand for a reference that
 * resolves itself: whether it reads an entry of a list component past the
 * list's last entry (`$l[5]` of a list of two). It reads the number of the
 * list's entries, not the entry's value, so a list that skips such a
 * reference among its values (`AuthoredValueList.js`) counts its entries
 * from the sizes of the lists it reads entries of.
 */
function pastEndOfListDefinition() {
    return {
        stateVariablesDeterminingDependencies: ["referentInfo"],
        returnDependencies({ stateValues, componentInfoObjects }) {
            const referentInfo = stateValues.referentInfo;
            const countVariable =
                referentInfo?.listEntryPosition === undefined
                    ? undefined
                    : componentInfoObjects.allComponentClasses[
                          referentInfo.componentType
                      ]?.listEntryCountVariable;
            if (countVariable === undefined) {
                return {};
            }
            return {
                referentInfo: {
                    dependencyType: "stateVariable",
                    variableName: "referentInfo",
                },
                numEntries: {
                    dependencyType: "stateVariable",
                    componentIdx: referentInfo.componentIdx,
                    variableName: countVariable,
                },
            };
        },
        definition({ dependencyValues }) {
            return {
                setValue: {
                    pastEndOfList:
                        dependencyValues.numEntries !== undefined &&
                        dependencyValues.referentInfo.listEntryPosition >
                            dependencyValues.numEntries,
                },
            };
        },
    };
}

/**
 * The definition of `valueAsResponse`, made on demand: the value an
 * `<answer>` records when it records this reference as a response
 * (`currentResponses` in `Answer.js`), in an award or as a child of a
 * `<considerAsResponses>`. That is the referenced variable as it
 * is on the referent, not what the reference presents: `$n` inside
 * `<math>$n+1</math>` presents as a math and reads `n.math`, but is recorded
 * as `n`'s number, as the copy it replaced was, whose adapter the answer's
 * search skips over. A blank math when there is nothing to read
 * (`valueMissing`), as a copy with nothing to read made in a comparison or a
 * `<math>` at the top of the document. It is one too where that copy made
 * nothing (in a repeat iteration, a `<group>` or a copy, directly in an
 * `<award>`, among a `<considerAsResponses>`'s children, or among the
 * operands of an operator such as `<sum>` or `<and>`) or an empty text (in a
 * `<text>`), so that the number of responses does not depend on where the
 * answer is or whether an entry is there. A reference a copy made at run
 * time has no `valueMissing` and is never missing: the copy makes no
 * reference for an entry that is not there.
 *
 * A variable that is there but holds no value is recorded as the empty value
 * of the referenced type (`referencedComponentType`), as the copy's
 * component holding it was: `null` for an attribute with no default (an
 * `<award>`'s `feedbackText`), or `undefined` for a variable a copy made the
 * reference for and that has lost its value since (`$c.selectedValue` once
 * the selected choice is withheld). Submitting an answer fails on a
 * response of `null` or `undefined`.
 */
function valueAsResponseDefinition(referencedComponentType, fixedReferent) {
    const definition = {
        returnDependencies({ stateValues = {} }) {
            const referentInfo = fixedReferent ?? stateValues.referentInfo;
            const dependencies = fixedReferent
                ? {}
                : {
                      valueMissing: {
                          dependencyType: "stateVariable",
                          variableName: "valueMissing",
                      },
                  };
            if (referentInfo) {
                dependencies.referenced = {
                    dependencyType: "stateVariable",
                    componentIdx: referentInfo.componentIdx,
                    variableName: referentInfo.referencedVariable,
                    variablesOptional: true,
                };
            }
            return dependencies;
        },
        definition({ dependencyValues, componentInfoObjects }) {
            let valueAsResponse = dependencyValues.referenced;
            if (dependencyValues.valueMissing) {
                valueAsResponse = me.fromAst("\uff3f");
            } else if (
                valueAsResponse === undefined ||
                valueAsResponse === null
            ) {
                valueAsResponse = emptyValueOfType(
                    referencedComponentType,
                    componentInfoObjects,
                );
            }
            return { setValue: { valueAsResponse } };
        },
    };
    if (!fixedReferent) {
        definition.stateVariablesDeterminingDependencies = ["referentInfo"];
    }
    return definition;
}

/**
 * The definition of `componentTypeAsResponse`, made on demand: the type of
 * `valueAsResponse`. That is the type of the referenced variable
 * (`referencedComponentType`, `$P.x` a `math`), or `math` for the blank math
 * recorded when there is nothing to read (never, for a reference a copy
 * made at run time).
 */
function componentTypeAsResponseDefinition(
    referencedComponentType,
    fixedReferent,
) {
    return {
        returnDependencies: () =>
            fixedReferent
                ? {}
                : {
                      valueMissing: {
                          dependencyType: "stateVariable",
                          variableName: "valueMissing",
                      },
                  },
        definition({ dependencyValues }) {
            return {
                setValue: {
                    componentTypeAsResponse: dependencyValues.valueMissing
                        ? "math"
                        : referencedComponentType,
                },
            };
        },
    };
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
                referentInfo,
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

/**
 * The dependencies of `listEntryHide` for a reference whose referent is
 * `referentInfo`: none unless it reads an entry of a list.
 */
function listEntryHideDependencies(referentInfo) {
    if (referentInfo?.listEntryPosition === undefined) {
        return {};
    }
    return {
        entryPosition: {
            dependencyType: "value",
            value: referentInfo.listEntryPosition,
        },
        referentVariable: {
            dependencyType: "value",
            value: referentInfo.variableName,
        },
        referentEntryPrefix: {
            dependencyType: "stateVariable",
            componentIdx: referentInfo.componentIdx,
            variableName: "listEntryVariablePrefix",
            variablesOptional: true,
        },
        referentEntryHides: {
            dependencyType: "stateVariable",
            componentIdx: referentInfo.componentIdx,
            variableName: "entryHides",
            variablesOptional: true,
        },
    };
}

/**
 * Whether the entry a reference reads (`$c[1]`, not `$c[1].hidden`) is
 * hidden as the copy of the entry was, from `listEntryHideDependencies`: by
 * the entry's `hide` (`entryHides`) in a list that shows each entry as its
 * source (`<collect>`, `<sort>`); `undefined` for any other reference.
 */
function listEntryHide(dependencyValues) {
    const position = dependencyValues.entryPosition;
    if (
        !dependencyValues.referentEntryHides ||
        (dependencyValues.referentVariable !==
            `${dependencyValues.referentEntryPrefix}${position}` &&
            dependencyValues.referentVariable !==
                `${LIST_ENTRY_PREFIX}value_${position}`)
    ) {
        return undefined;
    }
    return Boolean(dependencyValues.referentEntryHides[position - 1]);
}

/**
 * A definition of `name` that reads `variableName` of the referent as it is
 * there, mirroring the referent's `usedDefault` and passing a write on to
 * it; `null` while there is no referent or the referent lacks the variable.
 * Made on demand under `referentVariableName(variableName)` for the
 * adapter-source dependencies (`adapterDependencies.ts`), which read the
 * source's variables through the reference. Its dependency is determined by
 * `referentInfo`, so it follows a retargeting, and names the referent, so it
 * is re-attached when the referent is deleted and remade.
 */
function readsReferentVariable(name, variableName, fixedReferent) {
    const definition = {
        // for `useEssentialOrDefaultValue`, which mirrors `usedDefault`
        hasEssential: true,
        defaultValue: null,
        returnDependencies({ stateValues = {} }) {
            const referentInfo = fixedReferent ?? stateValues.referentInfo;
            if (!referentInfo) {
                return {};
            }
            return {
                fromReferent: {
                    dependencyType: "stateVariable",
                    componentIdx: referentInfo.componentIdx,
                    variableName,
                    variablesOptional: true,
                },
            };
        },
        definition({ dependencyValues, usedDefault }) {
            const value = dependencyValues.fromReferent;
            if (value === undefined || value === null) {
                return { setValue: { [name]: null } };
            }
            if (usedDefault.fromReferent) {
                return {
                    useEssentialOrDefaultValue: {
                        [name]: { defaultValue: value },
                    },
                };
            }
            return { setValue: { [name]: value } };
        },
        async inverseDefinition({ desiredStateVariableValues, stateValues }) {
            if (!(await stateValues.referentInfo)) {
                return { success: false };
            }
            return {
                success: true,
                instructions: [
                    {
                        setDependency: "fromReferent",
                        desiredValue: desiredStateVariableValues[name],
                    },
                ],
            };
        },
    };
    if (!fixedReferent) {
        definition.stateVariablesDeterminingDependencies = ["referentInfo"];
    }
    return definition;
}
