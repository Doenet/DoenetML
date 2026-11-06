import { publicCaseInsensitiveAliasSubstitutions } from "../../StateVariableNameResolver";
import { SERIALIZE_ENCOUNTERED_COMPONENT_PREFIX } from "./BaseComponent";
import CompositeComponent from "./CompositeComponent";
import ValueListComponent from "./ValueListComponent";
import Group from "../Group";
import {
    namesReachedThroughCopy,
    postProcessCopy,
    verifyReplacementsMatchSpecifiedType,
    TAGS_OF_LIST_FORMS,
    addAttributesToSingleReplacement,
    addAttributesToSingleReplacementChange,
    getSelfReferentialFallbackPropName,
    replacementIsOfType,
} from "../../utils/copy";
import { flattenDeep, flattenLevels, deepClone } from "@doenet/utils";
import {
    convertAttributeValuesForComponentType,
    primaryEssentialStateVariableOf,
    convertUnresolvedAttributesForComponentType,
} from "../../utils/dast/convertNormalizedDast";
import {
    createNewComponentIndices,
    stateIdSegmentForCopyOf,
} from "../../utils/componentIndices";
import { copyOfLiteralAttribute } from "../../utils/literalAttribute";
import { codedDiagnostic } from "../../utils/diagnostics";
import { applySugar } from "../../utils/dast/sugar";
import { typeChangeAtLoadDiagnostic } from "../../utils/dast/typeChangeAtLoad";
import AuthoredValueList from "./AuthoredValueList";
import { typeChangeRule, valueAllowsTypeChange } from "../../utils/typeChange";
import {
    doenetMLDollarsForReference,
    doenetMLStringForReference,
} from "../../utils/sourceLocation";
import { returnNumberDisplayAttributes } from "../../utils/numberDisplay";
import { isListEntryArrayVariable } from "../../utils/listEntryReference";
import { isValueEntriesVariable } from "../../utils/mathVectorMatrixStateVariables";
import {
    attributeShadowIsReference,
    shadowAttributeReference,
} from "../../utils/variableRefAttribute";
import { errorComponentState } from "../../utils/dast/errors";
import { unwrapSource } from "../../utils/dast/convertNormalizedDast";
import {
    CONTEXT_ATTRIBUTES,
    writtenEntryAttributeComponent,
} from "../../utils/contextAttribute";
import {
    applyCopySnapshot,
    copySnapshotOf,
    readHeldCopySnapshot,
} from "../../utils/copySnapshot";
import { gatherVariantComponents } from "../../utils/variants";
import {
    holdAttributeComponentAt,
    holdUnresolvedAttributeAt,
    valueAsWritten,
} from "../../utils/heldChoiceAttribute";
import { returnCopyReplacementsToHideDefinitions } from "../../utils/replacementsToHide";
import {
    copiesReferent,
    planValueReference,
    separateResponseMarks,
    serializeValueReference,
    valueReferenceDiffers,
} from "../../utils/valueReference";

export default class Copy extends CompositeComponent {
    static componentType = "_copy";

    static excludeFromSchema = true;

    static acceptAnyAttribute = true;

    static includeBlankStringChildren = true;

    static stateVariableToEvaluateAfterReplacements =
        "needsReplacementsUpdatedWhenStale";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        // delete off attributes from base component that should apply to replacements instead
        // (using acceptAnyAttribute)
        delete attributes.disabled;
        delete attributes.fixed;
        delete attributes.fixLocation;
        delete attributes.styleNumber;
        delete attributes.isResponse;
        delete attributes.isPotentialResponse;
        delete attributes.hide;

        // The `_copy`'s own settings, set by core when it turns a reference,
        // `extend` or `copy` into a `_copy`. The leading `_` keeps them apart
        // from the attributes an author writes on the component, which the
        // `_copy` passes on to what it makes.
        attributes._createComponentOfType = {
            createPrimitiveOfType: "string",
        };
        attributes._createComponentIdx = {
            createPrimitiveOfType: "integer",
        };
        attributes._createComponentName = {
            createPrimitiveOfType: "string",
        };
        attributes._copyInChildren = {
            createPrimitiveOfType: "boolean",
        };
        attributes._link = {
            createPrimitiveOfType: "boolean",
            createStateVariable: "link",
            defaultValue: true,
        };
        // Set for `copyWithState`: an unlinked copy that also carries its
        // source's reader state and random choices (CPY-2, CPY-8). A `copy`
        // carries neither: it is its source's DoenetML pasted (CPY-1, D33).
        attributes._copyWithState = {
            createPrimitiveOfType: "boolean",
            createStateVariable: "copyWithState",
            defaultValue: false,
        };

        // Note: only implemented with no wrapping components
        attributes.removeEmptyArrayEntries = {
            createPrimitiveOfType: "boolean",
            createStateVariable: "removeEmptyArrayEntries",
            defaultValue: false,
        };

        attributes.asList = {
            createPrimitiveOfType: "boolean",
            createStateVariable: "asListPreliminary",
            defaultValue: true,
            description:
                "Whether to render the items separated by commas (true) or with no separator (false).",
        };

        return attributes;
    }

    /**
     * Hand the subvariants of a variant this copy generated
     * (`generatedVariantInfo`, one per random child added to it) to those
     * added children, by position. The copy is given that variant when it is
     * serialized with `copyVariants`, as when a container holding it that
     * hands out no subvariants of its own (a `<p>`) is copied. An added child
     * already handed a variant, by a container that does hand them out (a
     * `<section>`) or by the document, keeps it.
     */
    static setUpVariant({ serializedComponent, descendantVariantComponents }) {
        const subvariants =
            serializedComponent.variants?.desiredVariant?.subvariants;
        if (!subvariants) {
            return;
        }
        for (const [ind, variantComponent] of descendantVariantComponents
            .slice(0, subvariants.length)
            .entries()) {
            variantComponent.variants.desiredVariant ??= subvariants[ind];
        }
    }

    /**
     * A `copy` serialized with its variant (`copyVariants`), as a container
     * holding it is copied with `copyWithState`, carries the seed what it
     * made drew from (`seedFreshCopy`), so the copy made again draws the
     * same.
     */
    async serialize(parameters = {}) {
        const serialized = await super.serialize(parameters);
        if (parameters.copyVariants && this.freshCopySeed !== undefined) {
            serialized.variants = {
                ...serialized.variants,
                desiredVariant: {
                    ...serialized.variants?.desiredVariant,
                    seed: this.freshCopySeed,
                },
            };
        }
        return serialized;
    }

    static keepChildrenSerialized({ serializedComponent }) {
        if (serializedComponent.children === undefined) {
            return [];
        } else {
            return Object.keys(serializedComponent.children);
        }
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        // The list of component indices that are in any of the indices of the unresolved path in the ref resolution
        stateVariableDefinitions.refResolutionIndexDependencies = {
            returnDependencies: () => ({
                refResolutionIndexDependencies: {
                    dependencyType: "refResolutionIndexDependencies",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    refResolutionIndexDependencies:
                        dependencyValues.refResolutionIndexDependencies,
                },
            }),
        };

        // The value of the `value` state variable of the components from `refResolutionIndexDependencies`
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

        // The componentIdx of the component we are extending, along with any remaining unresolved path.
        stateVariableDefinitions.extendIdx = {
            additionalStateVariablesDefined: ["unresolvedPath", "originalPath"],
            stateVariablesDeterminingDependencies: [
                "refResolutionIndexDependencyValues",
            ],
            returnDependencies: ({ stateValues }) => {
                return {
                    refResolution: {
                        dependencyType: "refResolution",
                        indexDependencyValues:
                            stateValues.refResolutionIndexDependencyValues,
                    },
                };
            },
            definition: ({ dependencyValues }) => {
                return {
                    setValue: {
                        extendIdx: dependencyValues.refResolution.extendIdx,
                        unresolvedPath:
                            dependencyValues.refResolution.unresolvedPath,
                        originalPath:
                            dependencyValues.refResolution.originalPath,
                    },
                };
            },
        };

        stateVariableDefinitions.extendedComponent = {
            shadowVariable: true,
            stateVariablesDeterminingDependencies: ["extendIdx"],
            // TODO: if it turns out we don't need `determineDependenciesImmediately`,
            // then remove the relevant code from `Dependencies`
            // determineDependenciesImmediately: true,
            returnDependencies({ stateValues }) {
                if (stateValues.extendIdx !== -1) {
                    return {
                        extendedComponent: {
                            dependencyType: "componentIdentity",
                            componentIdx: stateValues.extendIdx,
                        },
                    };
                } else {
                    return {};
                }
            },
            definition: function ({ dependencyValues }) {
                let extendedComponent = null;
                if (dependencyValues.extendedComponent) {
                    extendedComponent = dependencyValues.extendedComponent;
                }

                return {
                    setValue: { extendedComponent },
                };
            },
        };

        stateVariableDefinitions.targetInactive = {
            stateVariablesDeterminingDependencies: ["extendedComponent"],
            returnDependencies({ stateValues }) {
                if (stateValues.extendedComponent) {
                    return {
                        targetIsInactiveCompositeReplacement: {
                            dependencyType: "stateVariable",
                            componentIdx:
                                stateValues.extendedComponent.componentIdx,
                            variableName: "isInactiveCompositeReplacement",
                        },
                    };
                } else {
                    return {};
                }
            },
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        targetInactive: Boolean(
                            dependencyValues.targetIsInactiveCompositeReplacement,
                        ),
                    },
                };
            },
        };

        stateVariableDefinitions.createComponentOfType = {
            returnDependencies: () => ({
                typeAttr: {
                    dependencyType: "attributePrimitive",
                    attributeName: "_createComponentOfType",
                },
            }),
            definition({ dependencyValues }) {
                let createComponentOfType = null;
                if (dependencyValues.typeAttr) {
                    createComponentOfType = dependencyValues.typeAttr;
                }
                return { setValue: { createComponentOfType } };
            },
        };

        stateVariableDefinitions.replacementSourceIdentities = {
            stateVariablesDeterminingDependencies: [
                "extendedComponent",
                "unresolvedPath",
                "createComponentOfType",
            ],
            additionalStateVariablesDefined: ["usedReplacements"],
            returnDependencies: function ({
                stateValues,
                componentInfoObjects,
            }) {
                let dependencies = {
                    numComponentsSpecified: {
                        dependencyType: "stateVariable",
                        variableName: "numComponentsSpecified",
                    },
                };

                let useReplacements = false;

                if (stateValues.extendedComponent !== null) {
                    if (
                        stateValues.extendedComponent.componentType ===
                            "_copy" ||
                        (componentInfoObjects.isCompositeComponent({
                            componentType:
                                stateValues.extendedComponent.componentType,
                            includeNonStandard: true,
                        }) &&
                            stateValues.extendedComponent.componentType !==
                                stateValues.createComponentOfType)
                    ) {
                        // If the target is a copy (no matter what),
                        // then we'll use replacements.
                        // For any other composite, we'll use replacements
                        // only if we're not extending the component (where createComponentOfType == componentType)

                        useReplacements = true;

                        // If the first part of the unresolved path has a prop name,
                        // and a composite has a public state variable that matches the prop,
                        // then we will stop and return the composite rather than its replacements
                        // so that we can get the prop from the composite.
                        let firstPropNameFromPath =
                            stateValues.unresolvedPath?.[0]?.name;

                        if (firstPropNameFromPath === "") {
                            firstPropNameFromPath = null;
                        }

                        // Note: it is possible that we have more than one target
                        // for the case where we have a prop and a composite target
                        dependencies.targets = {
                            dependencyType: "replacement",
                            compositeIdx:
                                stateValues.extendedComponent.componentIdx,
                            recursive: true,
                            recurseNonStandardComposites:
                                stateValues.unresolvedPath != null,
                            // While a path is still to be resolved, the
                            // recursion has to reach every replacement. Once
                            // the reference has resolved to the composite
                            // itself, a list composite among its replacements
                            // is kept whole, so the copy shows its commas.
                            stopAtListComposites:
                                stateValues.unresolvedPath == null,
                            includeWithheldReplacements: true,
                            stopIfHaveProp: firstPropNameFromPath,
                        };
                    }

                    if (!useReplacements) {
                        dependencies.targets = {
                            dependencyType: "stateVariable",
                            variableName: "extendedComponent",
                        };
                    }

                    dependencies.usedReplacements = {
                        dependencyType: "value",
                        value: useReplacements,
                    };
                }

                return dependencies;
            },
            definition({ dependencyValues }) {
                let replacementSourceIdentities = null;
                if (dependencyValues.targets) {
                    replacementSourceIdentities = dependencyValues.targets;
                    if (!Array.isArray(replacementSourceIdentities)) {
                        replacementSourceIdentities = [
                            replacementSourceIdentities,
                        ];
                    }

                    // If need to have only one component and there are more than 1 replacement source,
                    // trim off any blank strings from the ends.
                    // We do this so we get a linked point in this example:
                    // <group name="g"> <point>(1,2)</point> </group>  <point extend="$g" />
                    if (
                        dependencyValues.numComponentsSpecified === 1 &&
                        replacementSourceIdentities.length > 1
                    ) {
                        // trim off blank strings
                        const firstNonBlankIdx =
                            replacementSourceIdentities.findIndex(
                                (repl) =>
                                    typeof repl !== "string" ||
                                    repl.trim() !== "",
                            );
                        const lastNonBlankIdx =
                            replacementSourceIdentities.findLastIndex(
                                (repl) =>
                                    typeof repl !== "string" ||
                                    repl.trim() !== "",
                            );
                        if (firstNonBlankIdx !== -1 && lastNonBlankIdx !== -1) {
                            replacementSourceIdentities =
                                replacementSourceIdentities.slice(
                                    firstNonBlankIdx,
                                    lastNonBlankIdx + 1,
                                );
                        }
                    }
                }

                return {
                    setValue: {
                        replacementSourceIdentities,
                        usedReplacements: Boolean(
                            dependencyValues.usedReplacements,
                        ),
                    },
                };
            },
        };

        stateVariableDefinitions.asList = {
            stateVariablesDeterminingDependencies: [
                "usedReplacements",
                "extendedComponent",
            ],
            returnDependencies({ stateValues }) {
                const dependencies = {
                    asListPreliminary: {
                        dependencyType: "stateVariable",
                        variableName: "asListPreliminary",
                    },
                    usedReplacements: {
                        dependencyType: "stateVariable",
                        variableName: "usedReplacements",
                    },
                };
                if (stateValues.usedReplacements) {
                    dependencies.extendedComponentAsList = {
                        dependencyType: "stateVariable",
                        componentIdx:
                            stateValues.extendedComponent.componentIdx,
                        variableName: "asList",
                        variablesOptional: true,
                    };
                }
                return dependencies;
            },
            definition({ dependencyValues, usedDefault }) {
                // If the copy is based on replacements (`usedReplacements` is `true`),
                // then the `asList` state variable of the extended composite skipped.
                // In this case, we add look up that `asList` variable
                // and modify the copy's `asList` if it wasn't specifically set on the copy.
                if (
                    usedDefault.asListPreliminary &&
                    dependencyValues.usedReplacements &&
                    typeof dependencyValues.extendedComponentAsList ===
                        "boolean"
                ) {
                    return {
                        setValue: {
                            asList: dependencyValues.extendedComponentAsList,
                        },
                    };
                } else {
                    return {
                        setValue: {
                            asList: dependencyValues.asListPreliminary,
                        },
                    };
                }
            },
        };

        // In some cases, we will add an implicit prop to a copy that does
        // not already have a prop.
        // The potential implicit prop is given by state variableForImplicitProp
        // variable on a component class.
        // There are two reasons for adding an implicit prop:
        // 1. To automatically create a different component type than the source type
        //    such as a mathinput automatically giving a math based on its value.
        //    One must specify the createComponentOfType attribute to counteract this.
        // 2. To make an more efficient copy that does not copy all the children
        //    (and hence cause the component to recalculate state variables from children).
        //    For example, when copying a <math>, if we know the children aren't needed,
        //    then we want to avoid reparsing the children to create the math
        //    and just copy the source's value state variable.
        stateVariableDefinitions.implicitProp = {
            stateVariablesDeterminingDependencies: [
                "replacementSourceIdentities",
                "unresolvedPath",
            ],
            returnDependencies({ stateValues }) {
                let dependencies = {
                    unresolvedPath: {
                        dependencyType: "stateVariable",
                        variableName: "unresolvedPath",
                    },
                    usedReplacements: {
                        dependencyType: "stateVariable",
                        variableName: "usedReplacements",
                    },
                };

                if (!stateValues.unresolvedPath) {
                    dependencies.replacementSourceIdentities = {
                        dependencyType: "stateVariable",
                        variableName: "replacementSourceIdentities",
                    };
                    dependencies.typeAttr = {
                        dependencyType: "attributePrimitive",
                        attributeName: "_createComponentOfType",
                    };
                }

                return dependencies;
            },
            definition({ dependencyValues, componentInfoObjects }) {
                if (
                    dependencyValues.unresolvedPath ||
                    dependencyValues.usedReplacements ||
                    !(dependencyValues.replacementSourceIdentities?.length > 0)
                ) {
                    return { setValue: { implicitProp: null } };
                }

                let source = dependencyValues.replacementSourceIdentities[0];

                let variableForImplicitProp =
                    componentInfoObjects.allComponentClasses[
                        source.componentType
                    ]?.variableForImplicitProp;

                if (!variableForImplicitProp) {
                    return { setValue: { implicitProp: null } };
                }

                if (dependencyValues.typeAttr) {
                    // if specify createComponentOfType (which can occur either through
                    // specifying the createComponentOfType attribute directly or using the copySource form)
                    // and the variableForImplicitProp doesn't match that componentType
                    // then we won't create an implicit type.
                    // (Exception: if the componentType of variableForImplicitProp is undefined, we allow an implicit type)

                    let componentTypeFromAttr =
                        componentInfoObjects.componentTypeLowerCaseMapping[
                            dependencyValues.typeAttr.toLowerCase()
                        ];

                    // if createComponentOfType matches the source's componentType,
                    // we won't allow an implicit prop
                    // We could alternatively check to make sure that no attributes or children were added
                    // (so that we know state variables won't have to be recalculated)
                    // and that no name was specified,
                    // (so that we know it can't be extended to gain attributes or children)
                    // and make an exception in those cases.
                    if (componentTypeFromAttr === source.componentType) {
                        return { setValue: { implicitProp: null } };
                    }

                    let varInfo =
                        componentInfoObjects.publicStateVariableInfo[
                            source.componentType
                        ].stateVariableDescriptions[variableForImplicitProp];

                    if (
                        varInfo.createComponentOfType !== undefined &&
                        varInfo.createComponentOfType !== componentTypeFromAttr
                    ) {
                        return { setValue: { implicitProp: null } };
                    }
                }

                // We have a variableForImplicitProp and no typeAttr

                return { setValue: { implicitProp: variableForImplicitProp } };
            },
        };

        // replacementSources adds the value of the state variable from prop
        // to the replacement sources.
        // It also adds the implicit prop if it is specified.
        stateVariableDefinitions.replacementSources = {
            stateVariablesDeterminingDependencies: [
                "replacementSourceIdentities",
                "unresolvedPath",
                "implicitProp",
                "usedReplacements",
                "extendedComponent",
            ],
            additionalStateVariablesDefined: ["effectivePropNameBySource"],
            returnDependencies: function ({
                stateValues,
                componentInfoObjects,
            }) {
                let dependencies = {
                    replacementSourceIdentities: {
                        dependencyType: "stateVariable",
                        variableName: "replacementSourceIdentities",
                    },
                };

                // An index left over on a composite (`$g[2]`) is past the items
                // it is indexed by, and is passed on to each replacement. A list
                // component (`listEntryComponentType`) among them takes one of
                // those items, so the index would read one of its entries as an
                // item past the list (`$g[2]` of `<group name="g"><sequence /></group>`).
                const indexPastComposite =
                    stateValues.usedReplacements &&
                    stateValues.extendedComponent?.componentType !== "_copy" &&
                    !stateValues.implicitProp &&
                    stateValues.unresolvedPath?.[0]?.name === "";

                if (stateValues.replacementSourceIdentities !== null) {
                    for (let [
                        ind,
                        source,
                    ] of stateValues.replacementSourceIdentities.entries()) {
                        let thisUnresolvedPath = stateValues.unresolvedPath;

                        if (stateValues.implicitProp) {
                            thisUnresolvedPath = [
                                { name: stateValues.implicitProp, index: [] },
                            ];
                        }

                        let thisTarget;

                        if (thisUnresolvedPath) {
                            // at least when we had propIndex, we had to make a shallow copy
                            // so that can detect if it changed
                            // when update dependencies. Doing the same for unresolved path just in case.
                            thisUnresolvedPath = [...thisUnresolvedPath];

                            dependencies["unresolvedPath" + ind] = {
                                dependencyType: "value",
                                value: thisUnresolvedPath,
                            };

                            if (
                                typeof source === "string" ||
                                (indexPastComposite &&
                                    componentInfoObjects.allComponentClasses[
                                        source.componentType
                                    ]?.listEntryComponentType !== undefined)
                            ) {
                                continue;
                            }

                            thisTarget = {
                                dependencyType:
                                    "stateVariableFromUnresolvedPath",
                                componentIdx: source.componentIdx,
                                unresolvedPath: thisUnresolvedPath,
                                returnAsComponentObject: true,
                                variablesOptional: true,
                                caseInsensitiveVariableMatch: true,
                                publicStateVariablesOnly: true,
                                useMappedVariableNames: true,
                                // An index past the composite's items was
                                // reported where the reference was resolved,
                                // so it is not reported again as an index
                                // into each replacement's value.
                                indexPastComposite,
                            };
                        } else {
                            if (typeof source === "string") {
                                continue;
                            }

                            thisTarget = {
                                dependencyType: "componentIdentity",
                                componentIdx: source.componentIdx,
                            };
                        }

                        dependencies["target" + ind] = thisTarget;
                    }
                }

                return dependencies;
            },
            definition({ dependencyValues }) {
                let replacementSources = null;
                let effectivePropNameBySource = null;

                if (dependencyValues.replacementSourceIdentities !== null) {
                    replacementSources = [];
                    effectivePropNameBySource = [];

                    for (let ind in dependencyValues.replacementSourceIdentities) {
                        let targetDep = dependencyValues["target" + ind];
                        if (targetDep) {
                            replacementSources.push(targetDep);

                            let propName;
                            if (targetDep.stateValues) {
                                propName = Object.keys(
                                    targetDep.stateValues,
                                )[0];
                            }
                            if (
                                !propName &&
                                dependencyValues["unresolvedPath" + ind]
                            ) {
                                // a propName was specified, but it just wasn't found
                                propName = "__prop_name_not_found";
                            }
                            effectivePropNameBySource.push(propName);
                        } else {
                            const replSource =
                                dependencyValues.replacementSourceIdentities[
                                    ind
                                ];

                            if (typeof replSource === "string") {
                                if (dependencyValues["unresolvedPath" + ind]) {
                                    const propName = "__prop_name_not_found";
                                    effectivePropNameBySource.push(propName);
                                } else {
                                    replacementSources.push(replSource);
                                    effectivePropNameBySource.push(undefined);
                                }
                            } else {
                                // Target not found. Create an invalid effective prop name so that get no replacement
                                replacementSources.push(undefined);
                                effectivePropNameBySource.push(
                                    "__no_target_found",
                                );
                            }
                        }
                    }
                }

                return {
                    setValue: { replacementSources, effectivePropNameBySource },
                };
            },
        };

        // A copy given a valid type always makes exactly one component of
        // that type, or of its list form (`replacementIsOfType`), as a
        // `<collect>` of values is made as a `_collectList`.
        // `verifyReplacementsMatchSpecifiedType` makes sure of it:
        // it passes the type on to a lone `group`/`_copy` replacement, or else
        // makes one new component of that type (wrapping a lone replacement
        // in it when it can). Without a type, or with an invalid one, the
        // number of components isn't specified.
        stateVariableDefinitions.numComponentsSpecified = {
            returnDependencies: () => ({
                typeAttr: {
                    dependencyType: "attributePrimitive",
                    attributeName: "_createComponentOfType",
                },
            }),
            definition({ dependencyValues, componentInfoObjects }) {
                let numComponentsSpecified;

                if (dependencyValues.typeAttr) {
                    let componentType =
                        componentInfoObjects.componentTypeLowerCaseMapping[
                            dependencyValues.typeAttr.toLowerCase()
                        ];

                    if (
                        !(
                            componentType in
                            componentInfoObjects.allComponentClasses
                        )
                    ) {
                        return {
                            setValue: { numComponentsSpecified: null },
                            sendDiagnostics: [
                                codedDiagnostic({
                                    type: "warning",
                                    code: "doenet-w0065",
                                    args: { type: dependencyValues.typeAttr },
                                }),
                            ],
                        };
                    }
                    numComponentsSpecified = 1;
                } else {
                    numComponentsSpecified = null;
                }

                return { setValue: { numComponentsSpecified } };
            },
        };

        // The random components among the children added to the copy
        // (`<p copy="$a"><selectFromSequence/></p>`), found as
        // `gatherVariantComponents` finds them among its serialized
        // children. They keep their indices in the replacement.
        stateVariableDefinitions.addedVariantComponentIndices = {
            returnDependencies: () => ({
                serializedChildren: {
                    dependencyType: "serializedChildren",
                    doNotProxy: true,
                },
            }),
            definition({ dependencyValues, componentInfoObjects }) {
                const serializedChildren =
                    dependencyValues.serializedChildren ?? [];
                const addedVariantComponentIndices =
                    serializedChildren.length === 0
                        ? []
                        : gatherVariantComponents({
                              serializedComponents:
                                  deepClone(serializedChildren),
                              componentInfoObjects,
                          }).map((comp) => comp.componentIdx);
                return { setValue: { addedVariantComponentIndices } };
            },
        };

        stateVariableDefinitions.isVariantComponent = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { isVariantComponent: false } }),
        };

        // A copy is not a variant component. What it copies takes its
        // variant from its source, so a component containing the copy reads
        // from it (`variantDescendantComponentTypes`) only the variants of
        // the random children added to it, one per
        // `addedVariantComponentIndices`, which line up with those its
        // serialized children are handed when it is made again.
        stateVariableDefinitions.generatedVariantInfo = {
            stateVariablesDeterminingDependencies: [
                "addedVariantComponentIndices",
            ],
            returnDependencies({ stateValues, componentInfoObjects }) {
                if (stateValues.addedVariantComponentIndices.length === 0) {
                    return {};
                }
                return {
                    addedVariantComponentIndices: {
                        dependencyType: "stateVariable",
                        variableName: "addedVariantComponentIndices",
                    },
                    variantDescendants: {
                        dependencyType: "descendant",
                        componentTypes: Object.keys(
                            componentInfoObjects.componentTypesCreatingVariants,
                        ),
                        variableNames: [
                            "generatedVariantInfo",
                            "variantsOfMergedComponents",
                        ],
                        useReplacementsForComposites: true,
                        recurseToMatchedChildren: true,
                        variablesOptional: true,
                        includeNonActiveChildren: true,
                    },
                };
            },
            definition({ dependencyValues }) {
                const variantInfoByIdx = {};
                for (const descendant of dependencyValues.variantDescendants ??
                    []) {
                    variantInfoByIdx[descendant.componentIdx] =
                        descendant.stateValues.generatedVariantInfo;
                    // an added child merged into a descendant, as the
                    // arranger of the problems added to a `<pretzel copy>`
                    Object.assign(
                        variantInfoByIdx,
                        descendant.stateValues.variantsOfMergedComponents,
                    );
                }

                // An added child not found, as when it was not made (the
                // copy has no single replacement to add it to), holds its
                // place with no variant
                const subvariants = (
                    dependencyValues.addedVariantComponentIndices ?? []
                ).map((idx) => variantInfoByIdx[idx] ?? {});

                return {
                    setValue: { generatedVariantInfo: { subvariants } },
                };
            },
        };

        // For unlinked copies, we create a dependency to gather descendants
        // just to make sure any composite descendants are expanded.
        // This variable will be a dependency of `readyToExpandWhenResolved`
        stateVariableDefinitions.unlinkedDescendants = {
            stateVariablesDeterminingDependencies: ["extendIdx", "link"],
            returnDependencies({ stateValues }) {
                let dependencies = {};
                if (!stateValues.link) {
                    dependencies.targetDescendants = {
                        dependencyType: "descendant",
                        ancestorIdx: stateValues.extendIdx,
                        componentTypes: ["_composite"],
                    };
                } else {
                    dependencies.targetItself = {
                        dependencyType: "componentIdentity",
                        componentIdx: stateValues.extendIdx,
                    };
                }

                return dependencies;
            },
            definition() {
                return {
                    setValue: {
                        unlinkedDescendants: true,
                    },
                };
            },
        };

        // The `<select>`s among the descendants of the target of an unlinked
        // copy, including those in the replacements of composites (see
        // `unlinkedSelectsExpanded`). Empty for a linked copy.
        stateVariableDefinitions.unlinkedSelectDescendants = {
            stateVariablesDeterminingDependencies: ["extendIdx", "link"],
            returnDependencies({ stateValues }) {
                if (stateValues.link) {
                    return {};
                }
                return {
                    selectDescendants: {
                        dependencyType: "descendant",
                        ancestorIdx: stateValues.extendIdx,
                        componentTypes: ["select"],
                        useReplacementsForComposites: true,
                        includeNonActiveChildren: true,
                    },
                };
            },
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        unlinkedSelectDescendants: (
                            dependencyValues.selectDescendants ?? []
                        ).map((select) => select.componentIdx),
                    },
                };
            },
        };

        // An unlinked copy gives each `<select>` in its target the variant
        // the select generated (`copyVariants`). That variant holds the
        // random choices in the content of the chosen options only once the
        // select has created that content, which it does when it is
        // expanded. `unlinkedTargetsExpanded` expands the target's
        // replacements, recursively, and `unlinkedDescendants` the composites
        // among the target's own descendants. Neither reaches a select inside
        // a replacement (one in a `<div>` in a copied `<group>`) or in the
        // chosen option of another select, so such a select may not be
        // expanded yet. The copy waits for each select, and each select in
        // the content of the options it chose, to be expanded
        // (`Select.expandedWithSelectsInReplacements`).
        // Otherwise the copy's select would make those choices anew.
        // For unlinked copies, this variable is a dependency of
        // `readyToExpandWhenResolved`.
        stateVariableDefinitions.unlinkedSelectsExpanded = {
            stateVariablesDeterminingDependencies: [
                "unlinkedSelectDescendants",
            ],
            returnDependencies({ stateValues }) {
                const dependencies = {};
                for (const selectIdx of stateValues.unlinkedSelectDescendants) {
                    dependencies[`selectExpanded${selectIdx}`] = {
                        dependencyType: "stateVariable",
                        componentIdx: selectIdx,
                        variableName: "expandedWithSelectsInReplacements",
                    };
                }
                return dependencies;
            },
            definition() {
                return { setValue: { unlinkedSelectsExpanded: true } };
            },
        };

        // For unlinked copies, we create a dependency on target replacements
        // just to make sure any composite target is expanded.
        // This variable will be a dependency of `readyToExpandWhenResolved`
        stateVariableDefinitions.unlinkedTargetsExpanded = {
            stateVariablesDeterminingDependencies: [
                "extendedComponent",
                "link",
            ],
            returnDependencies({ stateValues, componentInfoObjects }) {
                let dependencies = {};
                if (
                    !stateValues.link &&
                    stateValues.extendedComponent &&
                    componentInfoObjects.isInheritedComponentType({
                        inheritedComponentType:
                            stateValues.extendedComponent.componentType,
                        baseComponentType: "_composite",
                    })
                ) {
                    dependencies.targetReplacements = {
                        dependencyType: "replacement",
                        compositeIdx:
                            stateValues.extendedComponent.componentIdx,
                        recursive: true,
                        recurseNonStandardComposites: true,
                    };
                }
                return dependencies;
            },
            definition() {
                return { setValue: { unlinkedTargetsExpanded: true } };
            },
        };

        stateVariableDefinitions.readyToExpandWhenResolved = {
            stateVariablesDeterminingDependencies: [
                "extendedComponent",
                "unresolvedPath",
                "link",
            ],
            returnDependencies({ stateValues, componentInfoObjects }) {
                let dependencies = {
                    extendedComponent: {
                        dependencyType: "stateVariable",
                        variableName: "extendedComponent",
                    },
                    needsReplacementsUpdatedWhenStale: {
                        dependencyType: "stateVariable",
                        variableName: "needsReplacementsUpdatedWhenStale",
                    },
                    // replacementSources: {
                    //   dependencyType: "stateVariable",
                    //   variableName: "replacementSources",
                    // },
                    link: {
                        dependencyType: "stateVariable",
                        variableName: "link",
                    },
                    // propName: {
                    //   dependencyType: "stateVariable",
                    //   variableName: "propName",
                    // },
                    unlinkedTargetsExpanded: {
                        dependencyType: "stateVariable",
                        variableName: "unlinkedTargetsExpanded",
                    },
                    unlinkedDescendants: {
                        dependencyType: "stateVariable",
                        variableName: "unlinkedDescendants",
                    },
                };
                if (!stateValues.link) {
                    dependencies.unlinkedSelectsExpanded = {
                        dependencyType: "stateVariable",
                        variableName: "unlinkedSelectsExpanded",
                    };
                }
                // XXX: how do we deal here if we ended up grabbing a prop from a composite.
                // Same question for `needsReplacementsUpdatedWhenStale`
                if (
                    stateValues.extendedComponent &&
                    componentInfoObjects.isCompositeComponent({
                        componentType:
                            stateValues.extendedComponent.componentType,
                        includeNonStandard: false,
                    })
                ) {
                    dependencies.targetReadyToExpandWhenResolved = {
                        dependencyType: "stateVariable",
                        componentIdx:
                            stateValues.extendedComponent.componentIdx,
                        variableName: "readyToExpandWhenResolved",
                    };
                }

                if (
                    stateValues.extendedComponent &&
                    stateValues.unresolvedPath === null
                ) {
                    // since `generatedVariantInfo` may be accessed when serializing a component,
                    // make sure it is resolved so we don't end up resolving it while expanding
                    dependencies.extendedVariantInfo = {
                        dependencyType: "stateVariable",
                        componentIdx:
                            stateValues.extendedComponent.componentIdx,
                        variableName: "generatedVariantInfo",
                        variablesOptional: true,
                    };
                }

                // since will be creating complete replacement when expand,
                // make sure all replacement sources are resolved
                if (!stateValues.link) {
                    dependencies.replacementSources = {
                        dependencyType: "stateVariable",
                        variableName: "replacementSources",
                    };
                }

                return dependencies;
            },
            definition() {
                return { setValue: { readyToExpandWhenResolved: true } };
            },
        };

        // What an `extend` or `copy` written as a different tag than what
        // it is of watches as the document runs (`typeChangeStatus`): the
        // state variable of its source whose value decides whether the tag
        // can be made from it, the `value` of a math for
        // `<point extend="$m"/>` (`utils/typeChange.js`) or `numEntries` of
        // a list, which stands for its one entry; or, for a composite,
        // `"content"`, what it holds (`typeChangeContent`), whose one
        // component it is made from, and `"contentValue"`, also the value of
        // the math it holds. A value reference (`_ref`) is of the type it
        // presents (`typeStoodFor`).
        stateVariableDefinitions.typeChangeValueCheck = {
            stateVariablesDeterminingDependencies: ["extendedComponent"],
            returnDependencies: ({ stateValues }) => ({
                extendedComponent: {
                    dependencyType: "stateVariable",
                    variableName: "extendedComponent",
                },
                ...(stateValues.extendedComponent?.componentType === "_ref" && {
                    presentedComponentType: {
                        dependencyType: "doenetAttribute",
                        componentIdx:
                            stateValues.extendedComponent.componentIdx,
                        attributeName: "presentedComponentType",
                    },
                }),
                writtenType: {
                    dependencyType: "attributePrimitive",
                    attributeName: "_createComponentOfType",
                },
                copyInChildren: {
                    dependencyType: "attributePrimitive",
                    attributeName: "_copyInChildren",
                },
            }),
            definition({ dependencyValues, componentInfoObjects }) {
                const sourceType =
                    dependencyValues.presentedComponentType ??
                    dependencyValues.extendedComponent?.componentType;
                const writtenType =
                    dependencyValues.writtenType &&
                    componentInfoObjects.componentTypeLowerCaseMapping[
                        dependencyValues.writtenType.toLowerCase()
                    ];
                const writtenClass =
                    componentInfoObjects.allComponentClasses[writtenType];
                if (
                    !dependencyValues.copyInChildren ||
                    !sourceType ||
                    !writtenClass ||
                    writtenClass.listEntryComponentType !== undefined ||
                    writtenType === "group" ||
                    replacementIsOfType(sourceType, writtenType)
                ) {
                    return { setValue: { typeChangeValueCheck: null } };
                }
                if (
                    componentInfoObjects.isCompositeComponent({
                        componentType: sourceType,
                    })
                ) {
                    // What a composite holds is decided when the document
                    // loads (D36, `utils/dast/typeChangeAtLoad.ts`). It is
                    // still watched as it changes (`"content"`,
                    // `typeChangeContent`): the copy is made from the one
                    // component it holds (`componentStoodFor`), which
                    // changes when a case or a pick further in does, and
                    // `"contentValue"` when, written as a point, vector,
                    // coords or boolean, the extend is also checked against
                    // the value of a math it holds (`typeChangeContentValue`).
                    // A composite tag is made from its own kind only, which
                    // what it holds does not change.
                    let typeChangeValueCheck = null;
                    if (
                        !componentInfoObjects.isCompositeComponent({
                            componentType: writtenType,
                        })
                    ) {
                        typeChangeValueCheck = typeChangeRule({
                            writtenType,
                            sourceType: "math",
                            componentInfoObjects,
                        }).valueCheck
                            ? "contentValue"
                            : "content";
                    }
                    return { setValue: { typeChangeValueCheck } };
                }
                const sourceClass =
                    componentInfoObjects.allComponentClasses[sourceType];
                if (sourceClass?.listEntryComponentType !== undefined) {
                    // `"numEntriesValue"` when, written as a point, vector,
                    // coords or boolean, the one entry is also checked
                    // against its value, as a math is.
                    let typeChangeValueCheck = null;
                    if (listIsDecided(sourceType, { componentInfoObjects })) {
                        typeChangeValueCheck = typeChangeRule({
                            writtenType,
                            sourceType: "math",
                            componentInfoObjects,
                        }).valueCheck
                            ? "numEntriesValue"
                            : "numEntries";
                    }
                    return { setValue: { typeChangeValueCheck } };
                }
                return {
                    setValue: {
                        typeChangeValueCheck: typeChangeRule({
                            writtenType,
                            sourceType,
                            componentInfoObjects,
                        }).valueCheck
                            ? "value"
                            : null,
                    },
                };
            },
        };

        stateVariableDefinitions.needsReplacementsUpdatedWhenStale = {
            stateVariablesDeterminingDependencies: [
                "extendedComponent",
                "replacementSourceIdentities",
                "effectivePropNameBySource",
                "unresolvedPath",
                "link",
                "removeEmptyArrayEntries",
                "typeChangeValueCheck",
            ],
            returnDependencies: function ({
                stateValues,
                componentInfoObjects,
            }) {
                // if don't link, never update replacements
                if (!stateValues.link) {
                    return {};
                }

                let dependencies = {
                    extendedComponent: {
                        dependencyType: "stateVariable",
                        variableName: "extendedComponent",
                    },
                    targetInactive: {
                        dependencyType: "stateVariable",
                        variableName: "targetInactive",
                    },
                    replacementSourceIdentities: {
                        dependencyType: "stateVariable",
                        variableName: "replacementSourceIdentities",
                    },
                };

                if (stateValues.effectivePropNameBySource !== null) {
                    for (let [
                        ind,
                        propName,
                    ] of stateValues.effectivePropNameBySource.entries()) {
                        if (propName) {
                            // if we have a propName, then we just need the array size state variable,
                            // as we need to update only if a component changes
                            // or the size of the corresponding array changes.
                            // (The actual values of the prop state variables will
                            // be updated directly through dependencies)

                            let source =
                                stateValues.replacementSourceIdentities[ind];

                            dependencies["sourceArraySize" + ind] = {
                                dependencyType: "stateVariableArraySize",
                                componentIdx: source.componentIdx,
                                variableName: propName,
                                variablesOptional: true,
                                caseInsensitiveVariableMatch: true,
                            };

                            dependencies["sourceComponentType" + ind] = {
                                dependencyType: "stateVariableComponentType",
                                componentIdx: source.componentIdx,
                                variableName: propName,
                                variablesOptional: true,
                                caseInsensitiveVariableMatch: true,
                            };
                        }
                    }
                }

                if (
                    stateValues.extendedComponent !== null &&
                    componentInfoObjects.isCompositeComponent({
                        componentType:
                            stateValues.extendedComponent.componentType,
                        includeNonStandard: false,
                    })
                ) {
                    // XXX: how do we deal with this now?
                    // Also because removed `obtainPropFromComposite` so that where we stop with replacements is inferred

                    // Include identities of all replacements (and inactive target variable)
                    // without filtering by sourceIndex,
                    // as components other than the one at that index could change
                    // the identity of the component at the relevant index

                    dependencies.allReplacementIdentities = {
                        dependencyType: "replacement",
                        compositeIdx:
                            stateValues.extendedComponent.componentIdx,
                        recursive: true,
                        variableNames: ["isInactiveCompositeReplacement"],
                    };
                }

                if (
                    ["value", "numEntries", "numEntriesValue"].includes(
                        stateValues.typeChangeValueCheck,
                    ) &&
                    !stateValues.effectivePropNameBySource?.[0]
                ) {
                    // whether the type the extend is written as can be made
                    // from its source (`typeChangeStatus`)
                    dependencies.typeChangeSourceValue = {
                        dependencyType: "stateVariable",
                        componentIdx:
                            stateValues.extendedComponent.componentIdx,
                        variableName:
                            stateValues.typeChangeValueCheck === "value"
                                ? "value"
                                : "numEntries",
                        variablesOptional: true,
                    };
                    if (
                        stateValues.typeChangeValueCheck === "numEntriesValue"
                    ) {
                        // the value of the first entry, which is checked
                        // when it is the only one. Only an entry that is a
                        // math is (`utils/typeChange.js`): of a list of
                        // maths, `math1`, or of intervals, `interval1`; the
                        // list has one of them, a list of other entries
                        // neither.
                        dependencies.typeChangeSourceEntryValue = {
                            dependencyType: "stateVariable",
                            componentIdx:
                                stateValues.extendedComponent.componentIdx,
                            variableName: "math1",
                            variablesOptional: true,
                        };
                        dependencies.typeChangeSourceIntervalValue = {
                            dependencyType: "stateVariable",
                            componentIdx:
                                stateValues.extendedComponent.componentIdx,
                            variableName: "interval1",
                            variablesOptional: true,
                        };
                    }
                }

                if (stateValues.removeEmptyArrayEntries) {
                    // if we are to remove empty array entries,
                    // then we have to recalculate whenever replacement sources change
                    dependencies.replacementSources = {
                        dependencyType: "stateVariable",
                        variableName: "replacementSources",
                    };
                }

                return dependencies;
            },
            // the whole point of this state variable is to return updateReplacements
            // on mark stale
            markStale() {
                return { updateReplacements: true };
            },
            definition: () => ({
                setValue: { needsReplacementsUpdatedWhenStale: true },
            }),
        };

        // What a composite an `extend` is of holds, through every composite
        // in it (an iteration, a pick, a case, a group), for making the
        // extend again from the one component it holds, and checking again
        // the value of a math it holds, when that changes
        // (`typeChangeValueCheck` "content", `typeChangeStatus`). Whether
        // the type can be made from it is decided when the document loads
        // (D36). Unlike `needsReplacementsUpdatedWhenStale`,
        // it is not needed to expand the extend, so nothing waits on it: an
        // extend inside what it is of, or two extends of each other, would
        // wait on themselves. It is evaluated, and so watches for changes,
        // only once the extend has found all that content expanded
        // (`watchTypeChangeContent`); a change marks it stale, which updates
        // the replacements.
        stateVariableDefinitions.typeChangeContent = {
            stateVariablesDeterminingDependencies: [
                "typeChangeValueCheck",
                "extendedComponent",
                "link",
            ],
            returnDependencies({ stateValues }) {
                if (
                    !stateValues.link ||
                    !watchesContent(stateValues.typeChangeValueCheck)
                ) {
                    return {};
                }
                return {
                    content: {
                        dependencyType: "replacement",
                        compositeIdx:
                            stateValues.extendedComponent.componentIdx,
                        recursive: true,
                        recurseNonStandardComposites: true,
                        variableNames: ["isInactiveCompositeReplacement"],
                    },
                };
            },
            markStale: () => ({ updateReplacements: true }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        typeChangeContent: (dependencyValues.content ?? [])
                            .filter(
                                (x) =>
                                    typeof x === "object" &&
                                    !x.stateValues
                                        .isInactiveCompositeReplacement,
                            )
                            .map((x) => ({
                                componentIdx: x.componentIdx,
                                componentType: x.componentType,
                            })),
                    },
                };
            },
        };

        // The value of each math in what a composite holds
        // (`typeChangeContent`) when the type an `extend` is written as is
        // checked against it (`typeChangeValueCheck` "contentValue"), such
        // as a math for `<point extend="$g"/>` of a group holding one, so
        // the extend is decided again when it changes. Content holding more
        // of them than `MAX_VALUES_WATCHED` does not stand for one
        // component, whatever their values, so they are not watched.
        stateVariableDefinitions.typeChangeContentValue = {
            stateVariablesDeterminingDependencies: [
                "typeChangeContent",
                "typeChangeValueCheck",
            ],
            returnDependencies({ stateValues, componentInfoObjects }) {
                if (stateValues.typeChangeValueCheck !== "contentValue") {
                    return {};
                }
                return {
                    ...Object.fromEntries(
                        valueChecked(stateValues.typeChangeContent, {
                            componentInfoObjects,
                        }).map((x, i) => [
                            `value${i}`,
                            {
                                dependencyType: "stateVariable",
                                componentIdx: x.componentIdx,
                                variableName: "value",
                                variablesOptional: true,
                            },
                        ]),
                    ),
                };
            },
            markStale: () => ({ updateReplacements: true }),
            definition: () => ({
                setValue: { typeChangeContentValue: true },
            }),
        };

        Object.assign(
            stateVariableDefinitions,
            returnCopyReplacementsToHideDefinitions(),
        );

        return stateVariableDefinitions;
    }

    /**
     * The replacements (`createReplacementsFromSources`). An unlinked copy
     * keeps what it made of its source through a reload: it takes the
     * snapshot a save holds for it, and records its own, with how to make it
     * again, for a save to compare (`utils/copySnapshot.js`). The snapshot
     * holds state by `stateId` and `componentType`, not the replacements'
     * shape, and a copy made again need not make what it made before (a copy
     * of a `<conditionalContent>` is made from whichever case is active). So
     * the save also holds what decided what the copy made
     * (`heldCopySnapshot`), and a copy made again is made as it was: from
     * the case it was made from (`heldCaseSource`), or that what it copies
     * was named in (`$cc.p`, `heldSourceInCase`), and from its source or
     * missing (`missingOfWrittenType`), as it was when written as a
     * different tag (`heldTypeChange`). A copy made again with a different
     * shape all the same (one whose shape no held case decides, as of a
     * `<collect>`, or one from a save that held the snapshot alone) is made
     * from its source as restored, and keeps nothing it cannot apply: it
     * records only its own snapshot. What else was saved of a component it
     * makes then applies only to one of the same type
     * (`checkForStateVariablesUpdatesForNewComponent`).
     */
    static async createSerializedReplacements(args) {
        const result = await this.createSerializedReplacementsOfCopy(args);
        await reportMissingProperty(args);
        await missingSourceInPlace({ ...args, result });
        return result;
    }

    static async createSerializedReplacementsOfCopy(args) {
        const { component } = args;
        const unlinked = (await component.stateValues.link) === false;
        const held = unlinked
            ? readHeldCopySnapshot(
                  component.coreFunctions.savedCopySnapshot?.(
                      component.stateId,
                  ),
              )
            : undefined;
        // Only a `copyWithState` carries its source's state, so only it has
        // a snapshot of that state. A `copy` holds a snapshot only of what it
        // made from a property or a list entry (`holdsValue`), which holds
        // the value it was made with (CPY-5). It still keeps what decided
        // what it made (`madeFrom`), so a reload makes it from the same
        // case; its other components save their own state, as written
        // content's do (D33).
        const withState =
            unlinked && (await component.stateValues.copyWithState);
        const snapshotOf = (replacements) =>
            copySnapshotOf(replacements, { onlyHeldValues: !withState });
        const result = await this.createReplacementsFromSources({
            ...args,
            heldMadeFrom: held?.madeFrom,
        });
        if (unlinked) {
            if (held) {
                applyCopySnapshot(result.replacements, held.snapshot);
            }
            component.unlinkedSnapshot = snapshotOf(result.replacements);
            component.unlinkedMadeFrom = args.workspace.madeFrom;
            component.freshUnlinkedSnapshot = async () => {
                const workspace = {};
                const { replacements } =
                    await this.createReplacementsFromSources({
                        ...args,
                        workspace,
                    });
                return {
                    snapshot: snapshotOf(replacements),
                    madeFrom: workspace.madeFrom,
                };
            };
        }
        return result;
    }

    static async createReplacementsFromSources({
        component,
        components,
        nComponents,
        workspace,
        allDoenetMLs,
        componentInfoObjects,
        resolveItem,
        publicCaseInsensitiveAliasSubstitutions,
        heldMadeFrom,
    }) {
        // console.log(`create serialized replacements of ${component.componentIdx}`)

        // console.log(await component.stateValues.extendedComponent);
        // console.log(await component.stateValues.effectivePropNameBySource);
        // console.log(await component.stateValues.replacementSources)

        if (workspace.replacementsCreated === undefined) {
            workspace.replacementsCreated = 0;
        }

        let diagnostics = [];

        workspace.numReplacementsBySource = [];
        workspace.numNonStringReplacementsBySource = [];
        workspace.propVariablesCopiedBySource = [];
        workspace.sourceIndices = [];
        workspace.typeChangeKey = undefined;
        reportTypeChange(workspace, undefined);
        // The reference as written, which a diagnostic made when its
        // replacements change quotes (`indexNamesNothing`).
        if (allDoenetMLs && workspace.referenceAsWritten === undefined) {
            const originalPath = await component.stateValues.originalPath;
            if (originalPath?.length > 0) {
                workspace.referenceAsWritten = `${doenetMLDollarsForReference(
                    originalPath,
                    allDoenetMLs,
                )}${doenetMLStringForReference(originalPath, allDoenetMLs)}`;
            }
        }
        // What decided what an unlinked copy made, for a save to hold
        // (`heldCopySnapshot`)
        workspace.madeFrom = {};
        // Whether this copy is inside source `sourceNum` (see
        // `calculateReplacementChanges`).
        workspace.sourceContainsCopyBySource = [];

        let compositeAttributesObj = this.createAttributesObject();

        // What the DoenetML could decide was decided when the document
        // loaded (D36): its error, or its missing tag, whatever its source
        // holds or its index names now. Decided before anything is made from
        // the source, which, for a tag in what it is of (`<math
        // extend="$g"/>` in a `<group name="g">` holding two components, or
        // `<math extend="$r"/>` in a repeat), would report it as circular
        // too, once it is made.
        const atLoad = await typeChangeAtLoadError({
            component,
            components,
            componentInfoObjects,
            workspace,
        });
        if (atLoad) {
            const stateIdInfo = {
                prefix: `${component.stateId}|`,
                num: workspace.replacementsCreated,
            };
            workspace.typeChangeKey = typeChangeKey(atLoad);
            diagnostics.push(atLoad.diagnostic);
            const inPlace = inPlaceOfCopy({
                component,
                componentInfoObjects,
                compositeAttributesObj,
                typeChange: atLoad,
                stateIdInfo,
                nComponents,
            });
            workspace.numReplacementsBySource = [inPlace.replacements.length];
            workspace.numNonStringReplacementsBySource = [
                inPlace.replacements.length,
            ];
            workspace.replacementsCreated = stateIdInfo.num;
            return {
                replacements: inPlace.replacements,
                diagnostics,
                nComponents: inPlace.nComponents,
            };
        }

        let replacementSourceIdentities =
            await component.stateValues.replacementSourceIdentities;
        // A copy of a component named in a case of a `<conditionalContent>`
        // (`$cc.p`) is made from the case it was made from before, when a
        // save held it or it was kept while the copy was deleted, though
        // what it names now is in another case, or nowhere
        // (`heldSourceInCase`).
        const heldSource = await heldSourceInCase({
            component,
            components,
            heldMadeFrom,
        });
        if (
            !heldSource &&
            (!(await component.stateValues.extendedComponent) ||
                !replacementSourceIdentities)
        ) {
            // no valid target, so no replacements other than copied in children
            let replacements = [];

            const stateIdInfo = {
                prefix: `${component.stateId}|`,
                num: workspace.replacementsCreated,
            };

            if (await isBareReferenceToOneThing(component, components)) {
                // A bare reference with no referent (`$nothing`) is a blank,
                // as `<T extend="$nothing"/>` is (D37, REF-1).
                replacements = [
                    missingReplacement({
                        nComponents: nComponents++,
                        stateIdInfo,
                    }),
                ];
                workspace.numReplacementsBySource.push(1);
                workspace.numNonStringReplacementsBySource.push(1);
            } else if (component.attributes._copyInChildren?.primitive.value) {
                // The tag is missing, whatever it adds (D37).
                const blank = missingOfWrittenType({
                    component,
                    componentInfoObjects,
                    compositeAttributesObj,
                    nComponents,
                    stateIdInfo,
                });
                replacements = blank.replacements;
                nComponents = blank.nComponents;

                workspace.numReplacementsBySource.push(replacements.length);
                workspace.numNonStringReplacementsBySource.push(
                    replacements.filter((x) => typeof x !== "string").length,
                );
            }

            // An index that names nothing now (D36).
            const info = await indexNamesNothing({
                component,
                componentInfoObjects,
                workspace,
            });
            reportTypeChange(workspace, info);
            recordIndexNamesNothing(workspace, info);

            let verificationResult = await verifyReplacementsMatchSpecifiedType(
                {
                    component,
                    replacements,
                    workspace,
                    componentInfoObjects,
                    compositeAttributesObj,
                    components,
                    nComponents,
                    stateIdInfo,
                    publicCaseInsensitiveAliasSubstitutions,
                },
            );
            diagnostics.push(...verificationResult.diagnostics);
            nComponents = verificationResult.nComponents;

            addAttributesToSingleReplacement(
                verificationResult.replacements,
                component,
                componentInfoObjects,
            );

            workspace.replacementsCreated = stateIdInfo.num;

            return {
                replacements: verificationResult.replacements,
                diagnostics,
                nComponents,
            };
        }

        // resolve determine dependencies of replacementSources
        // and resolve recalculateDownstreamComponents of its target dependencies
        // so any array entry prop is created
        let resolveResult = await resolveItem({
            componentIdx: component.componentIdx,
            type: "determineDependencies",
            stateVariable: "replacementSources",
            dependency: "__determine_dependencies",
            expandComposites: false,
        });

        if (!resolveResult.success) {
            throw Error(
                `Couldn't resolve determineDependencies of replacementSources of ${component.componentIdx}`,
            );
        }

        let effectivePropNameBySource =
            await component.stateValues.effectivePropNameBySource;
        for (let ind in replacementSourceIdentities) {
            let thisUnresolvedPath = effectivePropNameBySource[ind];

            if (thisUnresolvedPath) {
                resolveResult = await resolveItem({
                    componentIdx: component.componentIdx,
                    type: "recalculateDownstreamComponents",
                    stateVariable: "replacementSources",
                    dependency: "target" + ind,
                    expandComposites: false,
                });

                if (!resolveResult.success) {
                    throw Error(
                        `Couldn't resolve recalculateDownstreamComponents for target${ind} of replacementSources of ${component.componentIdx}`,
                    );
                }
            }
        }

        let replacements = [];
        const stateIdInfo = {
            prefix: `${component.stateId}|`,
            num: workspace.replacementsCreated,
        };

        let numReplacementsBySource = [];
        let numNonStringReplacementsBySource = [];
        let madeBlankBySource = [];
        let numReplacementsSoFar = 0;
        let numNonStringReplacementsSoFar = 0;

        // A copy of a `<conditionalContent>` is made from the case it was
        // made from before, when a save held it or it was kept while the
        // copy was deleted (`heldCaseSource`).
        const caseSource = heldSource
            ? undefined
            : await caseSourceOf({
                  component,
                  components,
                  componentInfoObjects,
              });
        let heldCase = heldSource;
        if (heldSource) {
            workspace.madeFrom.sourceCase = heldSource.sourceCase;
        } else if (caseSource) {
            heldCase = await heldCaseSource({
                caseSource,
                components,
                heldMadeFrom,
            });
            workspace.madeFrom.caseIndex = heldCase
                ? heldCase.caseIndex
                : (caseSource.replacementsWorkspace.previousSelectedIndex ??
                  null);
        }
        const sourceNums = heldCase
            ? heldCase.group
                ? ["0"]
                : []
            : Object.keys(replacementSourceIdentities);
        // made from one component, which can be one named in a case
        // (`sourceCaseOf`)
        const oneSource = !heldCase && sourceNums.length === 1;

        for (let sourceNum of sourceNums) {
            let numComponentsForSource;

            if (component.attributes._createComponentOfType?.primitive) {
                let numComponentsTotal =
                    await component.stateValues.numComponentsSpecified;
                let numSources = heldCase
                    ? 1
                    : replacementSourceIdentities.length;

                // arbitrarily divide these components among the sources
                numComponentsForSource = Math.floor(
                    numComponentsTotal / numSources,
                );
                let nExtras = numComponentsTotal % numSources;
                if (sourceNum < nExtras) {
                    numComponentsForSource++;
                }
            }

            let results = await this.createReplacementForSource({
                component,
                sourceNum,
                components,
                nComponents,
                stateIdInfo,
                allDoenetMLs,
                numReplacementsSoFar,
                numNonStringReplacementsSoFar,
                compositeAttributesObj,
                componentInfoObjects,
                numComponentsForSource,
                publicCaseInsensitiveAliasSubstitutions,

                copyInChildren:
                    Number(sourceNum) === 0 &&
                    component.attributes._copyInChildren?.primitive.value,
                heldCase,
            });

            diagnostics.push(...results.diagnostics);
            nComponents = results.nComponents;
            if (oneSource && results.sourceCase) {
                workspace.madeFrom.sourceCase = results.sourceCase;
            }

            workspace.propVariablesCopiedBySource[sourceNum] =
                results.propVariablesCopiedByReplacement;
            workspace.sourceContainsCopyBySource[sourceNum] = Boolean(
                results.sourceContainsCopy,
            );

            let sourceReplacements = results.serializedReplacements;
            numReplacementsBySource[sourceNum] = sourceReplacements.length;
            numNonStringReplacementsBySource[sourceNum] =
                sourceReplacements.filter((x) => typeof x !== "string").length;
            madeBlankBySource[sourceNum] = Boolean(results.madeBlank);
            numReplacementsSoFar += numReplacementsBySource[sourceNum];
            numNonStringReplacementsSoFar +=
                numNonStringReplacementsBySource[sourceNum];
            replacements.push(...sourceReplacements);
        }

        workspace.numReplacementsBySource = numReplacementsBySource;
        workspace.numNonStringReplacementsBySource =
            numNonStringReplacementsBySource;
        workspace.madeBlankBySource = madeBlankBySource;
        workspace.sourceIndices = (replacementSourceIdentities ?? []).map(
            (x) => x.componentIdx,
        );

        // A copy written as a different tag than what it copies makes one
        // only between related types (D26, `typeChangeStatus`).
        // An extend that would change what its source makes is that error
        // instead (`extendChangesContentErrors`).
        const found = {};
        const typeChange = heldTypeChange(
            replacements.some((x) => x?.doenetAttributes?.inPlaceOfExtend)
                ? undefined
                : await typeChangeStatus({
                      component,
                      components,
                      componentInfoObjects,
                      propReplacements: replacements,
                      found,
                      workspace,
                  }),
            heldMadeFrom,
        );
        workspace.typeChangeKey = typeChangeKey(typeChange);
        reportTypeChange(workspace, typeChange);
        if (workspace.typeChangeKey !== undefined) {
            workspace.madeFrom.typeChange = {
                key: workspace.typeChangeKey,
                ...(typeChange && { diagnostic: typeChange.diagnostic }),
            };
        }
        await recordTypeChangeContent({
            component,
            components,
            componentInfoObjects,
            workspace,
            canWatch: found.canWatch,
        });
        if (typeChange?.level === "error" || typeChange?.level === "warning") {
            diagnostics.push(typeChange.diagnostic);
            const inPlace = inPlaceOfCopy({
                component,
                componentInfoObjects,
                compositeAttributesObj,
                typeChange,
                stateIdInfo,
                nComponents,
            });
            replacements = inPlace.replacements;
            nComponents = inPlace.nComponents;
            workspace.numReplacementsBySource = [replacements.length];
            workspace.numNonStringReplacementsBySource = [replacements.length];
            workspace.propVariablesCopiedBySource = [];
            workspace.replacementsCreated = stateIdInfo.num;
            return { replacements, diagnostics, nComponents };
        }
        if (typeChange?.level === "info") {
            // While the value does not convert, the copy is missing (D37).
            const blank = missingOfWrittenType({
                component,
                componentInfoObjects,
                compositeAttributesObj,
                nComponents,
                stateIdInfo,
            });
            replacements = blank.replacements;
            nComponents = blank.nComponents;
            workspace.numReplacementsBySource = [replacements.length];
            workspace.numNonStringReplacementsBySource = [replacements.length];
            workspace.propVariablesCopiedBySource = [];
        } else if (
            typeChange === undefined &&
            namesNothing(numNonStringReplacementsBySource, madeBlankBySource)
        ) {
            // An index that names nothing now (D36).
            const info = await indexNamesNothing({
                component,
                componentInfoObjects,
                workspace,
            });
            if (info) {
                reportTypeChange(workspace, info);
                recordIndexNamesNothing(workspace, info);
            }
        }

        let verificationResult = await verifyReplacementsMatchSpecifiedType({
            component,
            replacements,
            workspace,
            componentInfoObjects,
            compositeAttributesObj,
            components,
            nComponents,
            stateIdInfo,
            publicCaseInsensitiveAliasSubstitutions,
        });
        diagnostics.push(...verificationResult.diagnostics);
        nComponents = verificationResult.nComponents;
        replacements = verificationResult.replacements;

        if (
            !replacements.some((x) => typeof x === "object") &&
            (await isBareReferenceToOneThing(component, components))
        ) {
            // A bare reference to one thing that is not there (`$s[2]` of
            // a select that picked one, `$n.nonexistent`) is a blank (D37).
            // It names no source then, so it is made from its source again
            // once that makes something.
            replacements = [
                missingReplacement({ nComponents: nComponents++, stateIdInfo }),
            ];
            workspace.numReplacementsBySource = [1];
            workspace.numNonStringReplacementsBySource = [1];
            workspace.sourceIndices = [];
            workspace.propVariablesCopiedBySource = [];
            workspace.sourceContainsCopyBySource = [];
        }

        addAttributesToSingleReplacement(
            replacements,
            component,
            componentInfoObjects,
        );

        workspace.replacementsCreated = stateIdInfo.num;

        // console.log(`serialized replacements for ${component.componentIdx}`);
        // console.log(JSON.parse(JSON.stringify(replacements)));

        return {
            replacements,
            diagnostics,
            nComponents,
        };
    }

    /**
     * The replacements made from source `sourceNum`
     * (`replacementForSource`). The `_copy` of an `extend` or `copy` of a
     * list (`forList`, `convertToCopy.ts`) fills the list written in the
     * document, which has the author's name, so what it makes has no name of
     * its own. Otherwise the name of the list it copies would be a name
     * inside the copy (`$c.l` of a copy `c` of `l`), and a reference written
     * in the list by that name (`$l.h`) would find the copy's own child
     * rather than `l`'s, as it does not in a copy of a `<p>`.
     */
    static async createReplacementForSource(args) {
        const results = await this.replacementForSource(args);
        if (args.component.doenetAttributes.forList !== undefined) {
            for (const replacement of results.serializedReplacements ?? []) {
                if (typeof replacement === "object") {
                    delete replacement.attributes?.name;
                }
            }
        }
        return results;
    }

    static async replacementForSource({
        component,
        sourceNum,
        components,
        nComponents,
        stateIdInfo,
        allDoenetMLs,
        numReplacementsSoFar,
        numNonStringReplacementsSoFar,
        compositeAttributesObj,
        componentInfoObjects,
        numComponentsForSource,
        publicCaseInsensitiveAliasSubstitutions,
        copyInChildren,
        heldCase,
    }) {
        // console.log(`create replacement for sourceNum ${sourceNum}`);
        // console.log(
        //   `propName: ${component.stateValues.effectivePropNameBySource[sourceNum]}`,
        // );

        let diagnostics = [];

        // Made from the case of a `<conditionalContent>` the copy was made
        // from before, not one made now (`heldCaseSource`)
        let replacementSource = heldCase
            ? undefined
            : (await component.stateValues.replacementSourceIdentities)[
                  sourceNum
              ];
        if (!heldCase && typeof replacementSource !== "object") {
            if (component.stateValues.effectivePropNameBySource[sourceNum]) {
                // Cannot get a prop off a non-object (e.g., off a string component)
                return {
                    serializedReplacements: [],
                    diagnostics,
                    nComponents,
                };
            } else {
                return {
                    serializedReplacements: [replacementSource],
                    diagnostics,
                    nComponents,
                };
            }
        }
        const replacementSourceComponent = heldCase
            ? undefined
            : components[replacementSource.componentIdx];

        // Don't create any replacement if the source is inactive
        if (
            !heldCase &&
            (await replacementSourceComponent.stateValues
                .isInactiveCompositeReplacement)
        ) {
            return {
                serializedReplacements: [],
                diagnostics,
                nComponents,
            };
        }

        // if not linking or removing empty array entries,
        // then replacementSources is resolved,
        // which we need for state variable value
        let propName = heldCase
            ? undefined
            : (await component.stateValues.effectivePropNameBySource)[
                  sourceNum
              ];
        let link = await component.stateValues.link;
        const withState = !link && (await component.stateValues.copyWithState);
        if (
            !heldCase &&
            (!link ||
                (propName &&
                    (await component.stateValues.removeEmptyArrayEntries)))
        ) {
            const replacementSourceWithProp = (
                await component.stateValues.replacementSources
            )[sourceNum];

            if (replacementSourceWithProp) {
                replacementSource = replacementSourceWithProp;
            }
        }

        // if creating copy from a prop
        // manually create the serialized component
        if (propName) {
            let results = await replacementFromProp({
                component,
                components,
                nComponents,
                stateIdInfo,
                replacementSource,
                propName,
                allDoenetMLs,
                numReplacementsSoFar,
                numNonStringReplacementsSoFar,
                compositeAttributesObj,
                componentInfoObjects,
                numComponentsForSource,
                publicCaseInsensitiveAliasSubstitutions,
            });
            diagnostics.push(...results.diagnostics);
            nComponents = results.nComponents;

            let serializedReplacements = results.serializedReplacements;
            if (!link) {
                // made from a value, not DoenetML, so held through a reload
                // (`copySnapshotOf`, CPY-5)
                for (const repl of serializedReplacements) {
                    if (typeof repl === "object") {
                        repl.holdsValue = true;
                    }
                }
            }
            let propVariablesCopiedByReplacement =
                results.propVariablesCopiedByReplacement;
            // Whether what is made is the missing tag (`missingOfWrittenType`),
            // made of nothing of the prop.
            let madeBlank = false;

            if (copyInChildren && component.serializedChildren.length > 0) {
                if (serializedReplacements.length === 0) {
                    // The prop gives nothing, so the tag is missing, whatever
                    // children it adds (D37).
                    const missing = missingOfWrittenType({
                        component,
                        componentInfoObjects,
                        compositeAttributesObj,
                        nComponents,
                        stateIdInfo,
                    });
                    nComponents = missing.nComponents;
                    serializedReplacements = missing.replacements;

                    propVariablesCopiedByReplacement = [[]];
                    madeBlank = true;
                } else if (serializedReplacements.length === 1) {
                    addChildrenFromComposite({
                        replacements: serializedReplacements,
                        children: component.serializedChildren,
                        componentInfoObjects,
                    });
                }
            }

            return {
                serializedReplacements,
                propVariablesCopiedByReplacement,
                diagnostics,
                nComponents,
                madeBlank,
            };
        }

        // if creating copy directly from the target component,
        // create a serialized copy of the entire component

        // A case, a pick or an iteration that holds one component of a type
        // related to the one the copy is written as is made into that type
        // from the component, as `$cc[1]` is (`componentStoodFor`).
        const sourceToSerialize = heldCase
            ? undefined
            : ((await componentStoodFor({
                  component,
                  source: replacementSourceComponent,
                  components,
                  componentInfoObjects,
              })) ?? replacementSourceComponent);

        // If we are copying without linking a source that is shadowing another source,
        // then the attributes and children of the source may not be sufficient
        // to determine its state variables (as values linked from its source may be used).
        // Therefore, we copy the primary state variable
        // and copy the essential state of the source.

        let serializedReplacements;
        // Where the copy was made from, when that is a component named in a
        // case of a `<conditionalContent>` (`sourceCaseOf`)
        let sourceCase;
        try {
            serializedReplacements = [
                heldCase
                    ? // the case's DoenetML, which the copy's snapshot gives
                      // the state it had (`applyCopySnapshot`)
                      deepClone(
                          serializedStoodFor({
                              component,
                              group: heldCase.group,
                              componentInfoObjects,
                          }) ?? heldCase.group,
                      )
                    : await sourceToSerialize.serialize({
                          // a value reference is copied as a component of its
                          // type (`ValueRef.serialize`); unlinked, it reads the
                          // settings it takes from its referent here
                          valueReferenceAsComponent: true,
                          components: link ? undefined : components,
                          copyAll: !link,
                          componentSourceAttributesToIgnore: ["labelIsName"],
                          // the source's DoenetML, and, for `copyWithState`,
                          // its reader state and random choices (D33)
                          copyVariants: withState,
                          copyPrimaryEssentialIfShadow: !link,
                          copyEssentialStateIfShadow: withState,
                          withoutReaderState: !link && !withState,
                          errorIfEncounterComponent: [component.componentIdx],
                          namesReachedThroughCopy:
                              link && namesReachedThroughCopy(component),
                      }),
            ];

            // Counted from the copy's own `stateId`, the ids would be the
            // same whichever case of a `<conditionalContent>` the copy is made
            // from, so what was saved of one case would be applied to another.
            const segment = heldCase
                ? heldCase.segment
                : await stateIdSegmentForCopyOf(sourceToSerialize);
            const sourceStateIdInfo = {
                prefix: `${stateIdInfo.prefix}${segment}`,
                num: stateIdInfo.num,
            };
            if (!link && !heldCase) {
                sourceCase = await sourceCaseOf({
                    component,
                    source: replacementSourceComponent,
                    segment,
                });
            }
            // An unlinked copy is its source's DoenetML pasted, whose
            // references keep the referents they have in the source (D1).
            let res = createNewComponentIndices(
                serializedReplacements,
                nComponents,
                sourceStateIdInfo,
                undefined,
                { keepReferents: !link },
            );
            stateIdInfo.num = sourceStateIdInfo.num;
            serializedReplacements = res.components;
            nComponents = res.nComponents;
            if (!link && !withState) {
                seedFreshCopy(component);
            }
        } catch (e) {
            // When the error is "Encountered X", it means this Copy is a descendant of its
            // own source component (a self-referential copy, e.g., `$a` inside `a`'s label).
            // In recognized rendering contexts, fall back to the source's public `value`
            // state variable rather than showing an error.
            const copyIsInsideSource = Boolean(
                e.message?.startsWith(SERIALIZE_ENCOUNTERED_COMPONENT_PREFIX),
            );
            if (copyIsInsideSource) {
                // Walk up the ancestor chain to determine if we're in a recognized context.
                // ancestor.componentClass gives the class of each ancestor (closest first).
                // We walk through transparent composites (treatAsComponentForRecursiveReplacements,
                // e.g. <group>) since they pass their contents into their parent's context
                // unchanged. Any other component (e.g. <point>, <math>) establishes its own
                // context, so we stop there. For example, `$a` inside
                // `<label><math>$a</math></label>` uses math's context rather than label's.
                const fallbackPropName = getSelfReferentialFallbackPropName({
                    componentAncestors: component.ancestors,
                    componentInfoObjects,
                    replacementSourceComponentType:
                        replacementSourceComponent.componentType,
                });

                if (fallbackPropName) {
                    try {
                        let fallbackResults = await replacementFromProp({
                            component,
                            components,
                            nComponents,
                            stateIdInfo,
                            replacementSource: replacementSourceComponent,
                            propName: fallbackPropName,
                            allDoenetMLs,
                            compositeAttributesObj,
                            componentInfoObjects,
                            numComponentsForSource,
                            publicCaseInsensitiveAliasSubstitutions,
                        });
                        diagnostics.push(...fallbackResults.diagnostics);
                        nComponents = fallbackResults.nComponents;
                        return {
                            serializedReplacements:
                                fallbackResults.serializedReplacements,
                            propVariablesCopiedByReplacement:
                                fallbackResults.propVariablesCopiedByReplacement,
                            diagnostics,
                            nComponents,
                            sourceContainsCopy: true,
                        };
                    } catch (innerError) {
                        // Fall through to the circular dependency handler below
                        // so this still reports as the original self-reference.
                    }
                }
            }

            console.error("we're calling this circular", e);
            // Same situation the composite expander reports, so the same code.
            const circular = codedDiagnostic({
                type: "error",
                code: "doenet-e0005",
                args: {
                    componentType:
                        component.attributes._createComponentOfType?.primitive
                            ?.value ?? "none",
                },
            });
            serializedReplacements = [
                {
                    type: "serialized",
                    componentType: "_error",
                    componentIdx: nComponents++,
                    stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                    state: errorComponentState(circular.message, circular),
                    attributes: {},
                    doenetAttributes: {},
                    children: [],
                },
            ];
            diagnostics.push(circular);
            return {
                serializedReplacements,
                diagnostics,
                nComponents,
                // Only a copy inside its source would be made the same way
                // again; another error may not recur, so the copy is remade.
                sourceContainsCopy: copyIsInsideSource,
            };
        }

        // An unlinked copy (`copy`, not `extend`) is the DoenetML of its
        // source pasted where it sits: it takes the `fixed` and `fixLocation`
        // written on its source, or on what its source is a reference to, as
        // its own attributes (`serialize`), and the rest from where it sits
        // (`utils/contextAttribute.js`). What fixed its source otherwise (its
        // parent, a write to it, the composite that made it, as a
        // `<sequence>` its entries and a `<repeat>` its index) is not
        // carried.
        if (!link && typeof serializedReplacements[0] === "object") {
            for (const attributeName of CONTEXT_ATTRIBUTES) {
                delete serializedReplacements[0].state?.[attributeName];
                delete serializedReplacements[0].state?.[
                    `${attributeName}Preliminary`
                ];
            }
        }

        // console.log(`serializedReplacements for ${component.componentIdx}`);
        // console.log(JSON.parse(JSON.stringify(serializedReplacements)));

        serializedReplacements = postProcessCopy({
            serializedComponents: serializedReplacements,
            componentIdx: component.componentIdx,
            addShadowDependencies: link,
            unlinkExternalCopies: false,
            withoutReaderState: !link && !withState,
        });

        for (let repl of serializedReplacements) {
            if (typeof repl !== "object") {
                continue;
            }

            // add attributes
            if (!repl.attributes) {
                repl.attributes = {};
            }
            const res = convertUnresolvedAttributesForComponentType({
                attributes: component.attributes,
                componentType: repl.componentType,
                componentInfoObjects,
                compositeAttributesObj,
                dontSkipAttributes: ["asList"],
                nComponents,
                stateIdInfo,
            });

            const attributesFromComposite = res.attributes;
            nComponents = res.nComponents;

            deleteReplacedAttributes({
                attributes: repl.attributes,
                attributesFromComposite,
                componentType: repl.componentType,
                componentInfoObjects,
            });

            const errors = link
                ? extendChangesContentErrors({
                      replacementType: repl.componentType,
                      writtenType:
                          component.attributes._createComponentOfType?.primitive
                              ?.value,
                      copyInChildren,
                      attributeNames: Object.keys(attributesFromComposite),
                      copyAttributeNames: Object.keys(compositeAttributesObj),
                      children: component.serializedChildren,
                      sourceChildren: repl.children,
                      source: referenceAsWritten(
                          await component.stateValues.originalPath,
                          replacementSourceComponent,
                      ),
                      componentInfoObjects,
                  })
                : withState && copyInChildren
                  ? await copyWithStateChangesChoicesErrors({
                        replacementType: repl.componentType,
                        attributeNames: Object.keys(attributesFromComposite),
                        children: component.serializedChildren,
                        source: replacementSourceComponent,
                        componentInfoObjects,
                    })
                  : [];
            if (errors.length > 0) {
                // What the extend would change is what it shares with its
                // source, and what the `copyWithState` would change is what
                // it carries from its source, so it shows an error in place
                // of the content. One, as an extend makes one replacement,
                // which takes its place (`adjustForCreateComponentIdxName`);
                // each error is still reported.
                diagnostics.push(...errors);
                return {
                    serializedReplacements: [
                        {
                            type: "serialized",
                            componentType: "_error",
                            componentIdx: nComponents++,
                            stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                            state: errorComponentState(
                                errors[0].message,
                                errors[0],
                            ),
                            attributes: {},
                            // Not given the type the extend is written
                            // as (`verifyReplacementsMatchSpecifiedType`)
                            doenetAttributes: { inPlaceOfExtend: true },
                            children: [],
                        },
                    ],
                    diagnostics,
                    nComponents,
                };
            }

            if (withState && copyInChildren) {
                diagnostics.push(
                    ...(await keepChoicesReachedByModuleAttributes({
                        replacement: repl,
                        attributeNames: Object.keys(attributesFromComposite),
                        components,
                        componentInfoObjects,
                    })),
                );
            }

            if (link && copyInChildren) {
                const ignored = extendIgnoresAttributesAndChildren({
                    replacementType: repl.componentType,
                    attributeNames: Object.keys(attributesFromComposite),
                    copyAttributeNames: Object.keys(compositeAttributesObj),
                    children: component.serializedChildren,
                    componentInfoObjects,
                });
                diagnostics.push(...ignored.diagnostics);
                // Keep the source's value of an ignored attribute, so that,
                // for example, `type` on a sequence's extend does not change
                // the class its values are made for.
                for (const attrName of ignored.attributeNames) {
                    delete attributesFromComposite[attrName];
                }
            }

            Object.assign(repl.attributes, attributesFromComposite);

            if (!link && attributesFromComposite.type) {
                nComponents = retypeTextPieces({
                    replacement: repl,
                    componentInfoObjects,
                    nComponents,
                    stateIdInfo,
                    diagnostics,
                });
            }
        }

        // if have copy target, then add additional children from the composite itself
        if (
            copyInChildren &&
            serializedReplacements.length === 1 &&
            component.serializedChildren.length > 0
        ) {
            addChildrenFromComposite({
                replacements: serializedReplacements,
                children: component.serializedChildren,
                componentInfoObjects,
            });
        }

        // console.log(
        //     `ending serializedReplacements for ${component.componentIdx}`,
        // );
        // console.log(JSON.parse(JSON.stringify(serializedReplacements)));

        return {
            serializedReplacements,
            diagnostics,
            nComponents,
            sourceCase,
        };
    }

    static async calculateReplacementChanges(args) {
        const result = await this.calculateReplacementChangesOfCopy(args);
        await reportMissingProperty(args);
        await blankInPlaceOfNothing({ ...args, result });
        await missingSourceInPlace({ ...args, result });
        return result;
    }

    static async calculateReplacementChangesOfCopy({
        component,
        nComponents,
        componentChanges,
        components,
        workspace,
        componentInfoObjects,

        resolveItem,
        publicCaseInsensitiveAliasSubstitutions,
    }) {
        // console.log(
        //   "Calculating replacement changes for " + component.componentIdx,
        // );

        let diagnostics = [];
        if ((await component.stateValues.link) === false) {
            return { replacementChanges: [], diagnostics, nComponents };
        }

        // What the DoenetML could decide was decided when the document loaded
        // (D36): its error (or, for a reference that names nothing, its
        // missing tag, D37), and only that, stays in place of the copy
        // whatever its source does now, whether it names nothing, is in a
        // case not active (`targetInactive`), or has changed.
        const atLoad = await typeChangeAtLoadError({
            component,
            components,
            componentInfoObjects,
            workspace,
        });
        if (atLoad) {
            const key = typeChangeKey(atLoad);
            workspace.sourceIndices = [];
            if (
                key === workspace.typeChangeKey &&
                (atLoad.level === "warning"
                    ? component.replacements.every(
                          (x) => x.isMissing || x.componentType === "_missing",
                      )
                    : component.replacements.length === 1 &&
                      component.replacements[0].componentType === "_error")
            ) {
                return {
                    replacementChanges: unwithheldChanges(component),
                    diagnostics,
                    nComponents,
                };
            }
            const stateIdInfo = {
                prefix: `${component.stateId}|`,
                num: workspace.replacementsCreated,
            };
            workspace.typeChangeKey = key;
            reportTypeChange(workspace, atLoad);
            diagnostics.push(atLoad.diagnostic);
            const inPlace = inPlaceOfCopy({
                component,
                componentInfoObjects,
                typeChange: atLoad,
                stateIdInfo,
                nComponents,
            });
            const replacements = inPlace.replacements;
            nComponents = inPlace.nComponents;
            workspace.numReplacementsBySource = [replacements.length];
            workspace.numNonStringReplacementsBySource = [replacements.length];
            workspace.propVariablesCopiedBySource = [];
            workspace.replacementsCreated = stateIdInfo.num;
            return {
                replacementChanges: [
                    ...unwithheldChanges(component),
                    {
                        changeType: "add",
                        changeTopLevelReplacements: true,
                        firstReplacementInd: 0,
                        numberReplacementsToReplace:
                            component.replacements.length,
                        serializedReplacements: replacements,
                    },
                ],
                diagnostics,
                nComponents,
            };
        }

        let compositeAttributesObj = this.createAttributesObject();

        let replacementSourceIdentities =
            await component.stateValues.replacementSourceIdentities;
        if (
            !(await component.stateValues.extendedComponent) ||
            !replacementSourceIdentities
        ) {
            let replacementChanges = [];
            const stateIdInfo = {
                prefix: `${component.stateId}|`,
                num: workspace.replacementsCreated,
            };

            let previousZeroSourceIndices =
                workspace.sourceIndices.length === 0;

            workspace.numReplacementsBySource = [];
            workspace.numNonStringReplacementsBySource = [];

            if (
                component.attributes._copyInChildren?.primitive.value &&
                !previousZeroSourceIndices
            ) {
                // The missing tag, as when it is made with no source
                // (`createReplacementsFromSources`, D37)
                const blank = missingOfWrittenType({
                    component,
                    componentInfoObjects,
                    compositeAttributesObj,
                    nComponents,
                    stateIdInfo,
                });
                nComponents = blank.nComponents;
                replacementChanges.push({
                    changeType: "add",
                    changeTopLevelReplacements: true,
                    firstReplacementInd: 0,
                    numberReplacementsToReplace: component.replacements.length,
                    serializedReplacements: blank.replacements,
                });
                workspace.numReplacementsBySource.push(
                    blank.replacements.length,
                );
                workspace.numNonStringReplacementsBySource.push(
                    blank.replacements.length,
                );
            } else if (component.replacements.length > 0) {
                let replacementInstruction = {
                    changeType: "delete",
                    changeTopLevelReplacements: true,
                    firstReplacementInd: 0,
                    numberReplacementsToDelete: component.replacements.length,
                };
                replacementChanges.push(replacementInstruction);
            }

            workspace.sourceIndices = [];
            workspace.typeChangeKey = undefined;
            // An index that names nothing now (D36).
            reportTypeChange(
                workspace,
                await indexNamesNothing({
                    component,
                    componentInfoObjects,
                    workspace,
                }),
            );
            workspace.propVariablesCopiedBySource = [];
            workspace.sourceContainsCopyBySource = [];

            let verificationResult = await verifyReplacementsMatchSpecifiedType(
                {
                    component,
                    replacementChanges,
                    workspace,
                    componentInfoObjects,
                    compositeAttributesObj,
                    components,
                    nComponents,
                    stateIdInfo,
                    publicCaseInsensitiveAliasSubstitutions,
                },
            );
            diagnostics.push(...verificationResult.diagnostics);
            nComponents = verificationResult.nComponents;

            // Note: this has to run after verify,
            // as verify has side effects of setting workspace variables,
            // such as numReplacementsBySource
            if (previousZeroSourceIndices) {
                // didn't have sources before and still don't have sources.
                // we're just getting filler components being recreated.
                // Don't actually make those changes
                return { replacementChanges: [], diagnostics, nComponents };
            }

            addAttributesToSingleReplacementChange(
                component,
                verificationResult.replacementChanges,
                componentInfoObjects,
            );

            workspace.replacementsCreated = stateIdInfo.num;

            return {
                replacementChanges: verificationResult.replacementChanges,
                diagnostics,
                nComponents,
            };
        }

        if (await component.stateValues.targetInactive) {
            let replacementChanges = [];
            const stateIdInfo = {
                prefix: `${component.stateId}|`,
                num: workspace.replacementsCreated,
            };

            if (
                await isBareReferenceToOneThing(component, components, {
                    withheld: true,
                })
            ) {
                // A bare reference to one thing in a case that is not active
                // (`$cc.x`) is a blank while it is not (D37), not withheld.
                return {
                    ...missingInPlaceOfReplacements({
                        component,
                        workspace,
                        stateIdInfo,
                        nComponents,
                        keepShown: true,
                    }),
                    diagnostics,
                };
            }

            // What its index names is not shown now, as when its index
            // named nothing when the document loaded (`doenet-i0054`), so
            // the info is the same whether it was withheld then or since. A
            // composite named as a whole in a case not shown (`<math
            // extend="$g"/>` of a `<group>` there) gives no info, as at load,
            // not the info of a composite holding nothing (`doenet-i0055`).
            const withheldInfo = await indexNamesNothing({
                component,
                componentInfoObjects,
                workspace,
            });
            reportTypeChange(
                workspace,
                withheldInfo?.diagnostic.code === "doenet-i0054"
                    ? withheldInfo
                    : undefined,
            );

            if (
                component.attributes._createComponentOfType?.primitive &&
                component.replacements.length === 1 &&
                component.replacements[0].isMissing &&
                !(component.replacementsToWithhold > 0)
            ) {
                // Already the missing tag it is while what it names is not
                // active (D37), which `verifyReplacementsMatchSpecifiedType`
                // made in place of its withheld replacement. Withheld and
                // made again, it would change its parent's children on every
                // update, which can update the copy again, without end
                // (Doenet/DoenetML#2430).
                return { replacementChanges: [], diagnostics, nComponents };
            }

            let nReplacements = component.replacements.length;
            if (nReplacements > 0) {
                if (component.replacementsToWithhold !== nReplacements) {
                    let replacementInstruction = {
                        changeType: "changeReplacementsToWithhold",
                        replacementsToWithhold: nReplacements,
                    };
                    replacementChanges.push(replacementInstruction);
                }

                let verificationResult =
                    await verifyReplacementsMatchSpecifiedType({
                        component,
                        replacementChanges,
                        workspace,
                        componentInfoObjects,
                        compositeAttributesObj,
                        components,
                        nComponents,
                        stateIdInfo,
                        publicCaseInsensitiveAliasSubstitutions,
                    });
                diagnostics.push(...verificationResult.diagnostics);
                nComponents = verificationResult.nComponents;

                replacementChanges = verificationResult.replacementChanges;
            }

            addAttributesToSingleReplacementChange(
                component,
                replacementChanges,
                componentInfoObjects,
            );

            workspace.replacementsCreated = stateIdInfo.num;

            return { replacementChanges, diagnostics, nComponents };
        }

        // resolve determine dependencies of replacementSources
        // and resolve recalculateDownstreamComponents of its target dependencies
        // so any array entry prop is created
        let resolveResult = await resolveItem({
            componentIdx: component.componentIdx,
            type: "determineDependencies",
            stateVariable: "replacementSources",
            dependency: "__determine_dependencies",
            expandComposites: false,
        });

        if (!resolveResult.success) {
            throw Error(
                `Couldn't resolve determineDependencies of replacementSources of ${component.componentIdx}`,
            );
        }

        let effectivePropNameBySource =
            await component.stateValues.effectivePropNameBySource;

        for (let ind in replacementSourceIdentities) {
            let thisUnresolvedPath = effectivePropNameBySource[ind];

            if (thisUnresolvedPath) {
                resolveResult = await resolveItem({
                    componentIdx: component.componentIdx,
                    type: "recalculateDownstreamComponents",
                    stateVariable: "replacementSources",
                    dependency: "target" + ind,
                    expandComposites: false,
                });

                if (!resolveResult.success) {
                    throw Error(
                        `Couldn't resolve recalculateDownstreamComponents for target${ind} of replacementSources of ${component.componentIdx}`,
                    );
                }
            }
        }

        // A type change that was not allowed, or is no longer, makes its
        // replacements again (`typeChangeStatus`). A copy of a prop is decided
        // only when made.
        if (effectivePropNameBySource[0]) {
            if (workspace.typeChangeKey?.startsWith("mismatch")) {
                return {
                    replacementChanges: unwithheldChanges(component),
                    diagnostics,
                    nComponents,
                };
            }
        } else {
            const found = {};
            const typeChange = await typeChangeStatus({
                component,
                components,
                componentInfoObjects,
                found,
                workspace,
            });
            const key = typeChangeKey(typeChange);
            const valueCheck = await component.stateValues.typeChangeValueCheck;
            const sameSources =
                !(component.replacementsToWithhold > 0) &&
                !(await component.stateValues.removeEmptyArrayEntries) &&
                workspace.sourceIndices.length ===
                    replacementSourceIdentities.length &&
                replacementSourceIdentities.every(
                    (source, ind) =>
                        source.componentIdx === workspace.sourceIndices[ind],
                );
            if (found.listCountPending && sameSources) {
                // Decided once the list's count has caught up with its
                // values (the dependency on its first entry fires first).
                return { replacementChanges: [], diagnostics, nComponents };
            }
            reportTypeChange(workspace, typeChange);
            // What a composite holds: whether it changed where the
            // dependency `allReplacementIdentities` sees it, which would
            // update the extend whatever was decided
            // (`replacementIdentity`).
            let contentChanged = false;
            if (watchesContent(valueCheck)) {
                const previousIdentity = workspace.typeChangeContentIdentity;
                await recordTypeChangeContent({
                    component,
                    components,
                    componentInfoObjects,
                    workspace,
                    canWatch: found.canWatch,
                });
                contentChanged =
                    workspace.typeChangeContentIdentity !== previousIdentity;
            }
            if (
                key !== workspace.typeChangeKey &&
                watchesContent(valueCheck) &&
                !key?.startsWith("mismatch") &&
                !workspace.typeChangeKey?.startsWith("mismatch") &&
                sameSources &&
                !contentChanged
            ) {
                // Decided now, or no longer, with the same content, made as
                // it was (`verifyReplacementsMatchSpecifiedType`).
                workspace.typeChangeKey = key;
                return { replacementChanges: [], diagnostics, nComponents };
            }
            if (
                key !== workspace.typeChangeKey ||
                (key === "allowed" &&
                    watchesContent(valueCheck) &&
                    (contentChanged || !sameSources))
            ) {
                if (
                    key?.startsWith("mismatch") ||
                    workspace.typeChangeKey?.startsWith("mismatch") ||
                    (key === "allowed" && watchesContent(valueCheck))
                ) {
                    const result = await this.createReplacementsFromSources({
                        component,
                        components,
                        nComponents,
                        workspace,
                        componentInfoObjects,
                        resolveItem,
                        publicCaseInsensitiveAliasSubstitutions,
                    });
                    diagnostics.push(...result.diagnostics);
                    return {
                        replacementChanges: [
                            ...unwithheldChanges(component),
                            {
                                changeType: "add",
                                changeTopLevelReplacements: true,
                                firstReplacementInd: 0,
                                numberReplacementsToReplace:
                                    component.replacements.length,
                                serializedReplacements: result.replacements,
                            },
                        ],
                        diagnostics,
                        nComponents: result.nComponents,
                    };
                }
                workspace.typeChangeKey = key;
            } else if (key?.startsWith("mismatch")) {
                // An info naming a new value (`typeChangeKey`) replaces the
                // one before it (`reportTypeChange`).
                return {
                    replacementChanges: unwithheldChanges(component),
                    diagnostics,
                    nComponents,
                };
            } else if (
                valueCheck &&
                sameSources &&
                !(watchesContent(valueCheck) && contentChanged)
            ) {
                // Made from the same source, as the same type: only what
                // the type change checks (`typeChangeValueCheck`), such as
                // the value of a math, or what a composite holds further in
                // than `allReplacementIdentities` sees, changed, which the
                // replacements follow through their own dependencies. Made
                // again, a replacement wrapped in the type the copy is
                // written as would be remade on every change of that value.
                return { replacementChanges: [], diagnostics, nComponents };
            }
        }

        let replacementChanges = [];
        const stateIdInfo = {
            prefix: `${component.stateId}|`,
            num: workspace.replacementsCreated,
        };

        if (component.replacementsToWithhold > 0) {
            let replacementInstruction = {
                changeType: "changeReplacementsToWithhold",
                replacementsToWithhold: 0,
            };
            replacementChanges.push(replacementInstruction);
        }

        let numReplacementsSoFar = 0;
        let numNonStringReplacementsSoFar = 0;

        let numReplacementsBySource = [];
        let numNonStringReplacementsBySource = [];
        let madeBlankBySource = [];
        let propVariablesCopiedBySource = [];
        let sourceContainsCopyBySource = [];

        let maxSourceLength = Math.max(
            replacementSourceIdentities.length,
            workspace.numReplacementsBySource.length,
        );

        let recreateRemaining = false;
        // Whether every source is withheld now, as the content of a case
        // that is not active, which then names nothing (D37)
        let withheldAll = false;

        let numSourcesRecreated = 0;

        for (let sourceNum = 0; sourceNum < maxSourceLength; sourceNum++) {
            let numComponentsForSource;

            if (component.attributes._createComponentOfType?.primitive) {
                let numComponentsTotal =
                    await component.stateValues.numComponentsSpecified;
                let numSources = replacementSourceIdentities.length;

                // arbitrarily divide these components among the sources
                numComponentsForSource = Math.floor(
                    numComponentsTotal / numSources,
                );
                let nExtras = numComponentsTotal % numSources;
                if (sourceNum < nExtras) {
                    numComponentsForSource++;
                }
            }

            let replacementSource = replacementSourceIdentities[sourceNum];

            // check if replacementSource and all remaining replacement sources are withheld replacements
            if (
                !recreateRemaining &&
                (await components[replacementSource?.componentIdx]?.stateValues
                    .isInactiveCompositeReplacement)
            ) {
                let allWithheld = true;

                for (
                    let otherSourceNum = sourceNum + 1;
                    otherSourceNum < maxSourceLength;
                    otherSourceNum++
                ) {
                    const otherSource =
                        replacementSourceIdentities[otherSourceNum];
                    if (
                        !(await components[otherSource?.componentIdx]
                            ?.stateValues.isInactiveCompositeReplacement)
                    ) {
                        allWithheld = false;
                        break;
                    }
                }

                if (
                    allWithheld &&
                    sourceNum === 0 &&
                    (await isBareReferenceToOneThing(component, components, {
                        withheld: true,
                    }))
                ) {
                    // A bare reference to one thing withheld, as in a case
                    // that is not active (`$cc.x`), is a blank while it is
                    // (D37), as for `targetInactive`, above.
                    return {
                        ...missingInPlaceOfReplacements({
                            component,
                            workspace,
                            stateIdInfo,
                            nComponents,
                        }),
                        diagnostics,
                    };
                }
                if (allWithheld) {
                    withheldAll = sourceNum === 0;
                    let numberReplacementsLeft =
                        workspace.numReplacementsBySource
                            .slice(sourceNum)
                            .reduce((a, c) => a + c, 0);

                    if (numberReplacementsLeft > 0) {
                        let replacementInstruction = {
                            changeType: "changeReplacementsToWithhold",
                            replacementsToWithhold: numberReplacementsLeft,
                        };

                        replacementChanges.push(replacementInstruction);
                    }

                    // Mark bookkeeping variables for all remaining sources to be the same as they were before
                    // so we can simply stop withholding them if the sources stop being withheld
                    for (
                        let otherSourceNum = sourceNum;
                        otherSourceNum < maxSourceLength;
                        otherSourceNum++
                    ) {
                        numReplacementsBySource[otherSourceNum] =
                            workspace.numReplacementsBySource[otherSourceNum];
                        numNonStringReplacementsBySource[otherSourceNum] =
                            workspace.numNonStringReplacementsBySource[
                                otherSourceNum
                            ];
                        propVariablesCopiedBySource[otherSourceNum] =
                            workspace.propVariablesCopiedBySource[
                                otherSourceNum
                            ];
                        sourceContainsCopyBySource[otherSourceNum] =
                            workspace.sourceContainsCopyBySource[
                                otherSourceNum
                            ];
                    }

                    break;
                } else {
                    // Some later replacement is not withheld.
                    // Set `replacementSource` to be undefined so it is treated the same as though it were deleted
                    replacementSource = undefined;
                }
            }

            if (replacementSource === undefined) {
                if (workspace.numReplacementsBySource[sourceNum] > 0) {
                    if (!recreateRemaining) {
                        // since deleting replacement will shift the remaining replacements
                        // delete all remaining and mark to be recreated

                        let numberReplacementsLeft =
                            workspace.numReplacementsBySource
                                .slice(sourceNum)
                                .reduce((a, c) => a + c, 0);

                        if (numberReplacementsLeft > 0) {
                            let replacementInstruction = {
                                changeType: "delete",
                                changeTopLevelReplacements: true,
                                firstReplacementInd: numReplacementsSoFar,
                                numberReplacementsToDelete:
                                    numberReplacementsLeft,
                            };

                            replacementChanges.push(replacementInstruction);
                        }

                        recreateRemaining = true;

                        // since deleted remaining, change in workspace
                        // so that don't attempt to delete again
                        clearReplacementCountsFrom(workspace, sourceNum);
                    }
                }

                numReplacementsBySource[sourceNum] = 0;
                numNonStringReplacementsBySource[sourceNum] = 0;
                propVariablesCopiedBySource.push([]);
                sourceContainsCopyBySource[sourceNum] = false;

                continue;
            }

            let prevSourceIdx = workspace.sourceIndices[sourceNum];

            // check if replacementSource has changed
            let needToRecreate =
                prevSourceIdx === undefined ||
                replacementSource.componentIdx !== prevSourceIdx ||
                recreateRemaining;

            // A copy inside its own source (`$S` in `S`, or its counterpart
            // in a copy `S2` of `S`, which names `S2`) is replaced by the
            // circular-dependency error, or by the source's value
            // (`replacementForSource`), neither of which shadows the source.
            // The copy stays inside the source while the source is the same
            // component, so it would be made the same way again. Remaking it
            // would change the source's descendants, which would mark the
            // copy to be updated again, without end (Doenet/DoenetML#2405).
            if (
                !needToRecreate &&
                !workspace.sourceContainsCopyBySource[sourceNum]
            ) {
                // make sure the current replacements still shadow the replacement source
                for (
                    let ind = 0;
                    ind < workspace.numReplacementsBySource[sourceNum];
                    ind++
                ) {
                    let currentReplacement =
                        component.replacements[numReplacementsSoFar + ind];

                    if (!currentReplacement) {
                        needToRecreate = true;
                        break;
                    } else if (
                        !effectivePropNameBySource[sourceNum] &&
                        currentReplacement.shadows?.componentIdx !==
                            replacementSourceIdentities[sourceNum].componentIdx
                    ) {
                        needToRecreate = true;
                        break;
                    }
                }
            }

            if (needToRecreate) {
                numSourcesRecreated++;
                let prevNumReplacements = 0;
                if (sourceNum in workspace.numReplacementsBySource) {
                    prevNumReplacements =
                        workspace.numReplacementsBySource[sourceNum];
                }

                let numReplacementsToDelete = prevNumReplacements;
                if (recreateRemaining) {
                    // already deleted old replacements
                    numReplacementsToDelete = 0;
                }

                let results = await this.recreateReplacements({
                    component,
                    sourceNum,
                    numReplacementsSoFar,
                    numNonStringReplacementsSoFar,
                    numReplacementsToDelete,
                    components,
                    nComponents,
                    stateIdInfo,
                    compositeAttributesObj,
                    componentInfoObjects,
                    numComponentsForSource,
                    publicCaseInsensitiveAliasSubstitutions,
                });
                diagnostics.push(...results.diagnostics);
                nComponents = results.nComponents;

                numReplacementsSoFar += results.numReplacements;
                numNonStringReplacementsSoFar +=
                    results.numNonStringReplacements;

                numReplacementsBySource[sourceNum] = results.numReplacements;
                numNonStringReplacementsBySource[sourceNum] =
                    results.numNonStringReplacements;
                madeBlankBySource[sourceNum] = results.madeBlank;

                propVariablesCopiedBySource[sourceNum] =
                    results.propVariablesCopiedByReplacement;
                sourceContainsCopyBySource[sourceNum] =
                    results.sourceContainsCopy;

                let replacementInstruction = results.replacementInstruction;

                if (!recreateRemaining) {
                    if (results.numReplacements !== prevNumReplacements) {
                        // we changed the number of replacements which shifts remaining ones
                        // since names won't match, we need to delete
                        // all the remaining replacements and recreate them

                        let numberReplacementsLeft =
                            workspace.numReplacementsBySource
                                .slice(sourceNum)
                                .reduce((a, c) => a + c, 0);

                        replacementInstruction.numberReplacementsToReplace =
                            numberReplacementsLeft;

                        recreateRemaining = true;

                        // since deleted remaining, change in workspace
                        // so that don't attempt to delete again
                        clearReplacementCountsFrom(workspace, sourceNum);
                    }
                }

                if (replacementInstruction) {
                    replacementChanges.push(replacementInstruction);
                }

                continue;
            }

            if (
                !effectivePropNameBySource[sourceNum] &&
                workspace.numReplacementsBySource[sourceNum] > 0
            ) {
                // if previously had replacements and target still isn't inactive
                // then don't check for changes if don't have a propName
                numReplacementsSoFar +=
                    workspace.numReplacementsBySource[sourceNum];
                numNonStringReplacementsSoFar +=
                    workspace.numNonStringReplacementsBySource[sourceNum];
                numReplacementsBySource[sourceNum] =
                    workspace.numReplacementsBySource[sourceNum];
                numNonStringReplacementsBySource[sourceNum] =
                    workspace.numNonStringReplacementsBySource[sourceNum];
                madeBlankBySource[sourceNum] =
                    workspace.madeBlankBySource?.[sourceNum];
                sourceContainsCopyBySource[sourceNum] =
                    workspace.sourceContainsCopyBySource[sourceNum];
                continue;
            }

            const newStateIdInfo = {
                prefix: `${component.stateId}|`,
                num: stateIdInfo.num,
            };

            let results = await this.createReplacementForSource({
                component,
                sourceNum,
                components,
                nComponents,
                stateIdInfo: newStateIdInfo,
                numReplacementsSoFar,
                numNonStringReplacementsSoFar,
                compositeAttributesObj,
                componentInfoObjects,
                numComponentsForSource,
                publicCaseInsensitiveAliasSubstitutions,
                copyInChildren:
                    Number(sourceNum) === 0 &&
                    component.attributes._copyInChildren?.primitive.value,
            });
            diagnostics.push(...results.diagnostics);
            const nComponentsForNew = results.nComponents;
            sourceContainsCopyBySource[sourceNum] = Boolean(
                results.sourceContainsCopy,
            );

            let propVariablesCopiedByReplacement =
                results.propVariablesCopiedByReplacement;

            let newSerializedReplacements = results.serializedReplacements;

            let nNewReplacements = newSerializedReplacements.length;
            let nOldReplacements = workspace.numReplacementsBySource[sourceNum];

            if (nNewReplacements !== nOldReplacements) {
                // changing the number of replacements will shift the remaining replacements
                // and change resulting names,
                // delete all remaining and mark to be recreated

                let numberReplacementsLeft = workspace.numReplacementsBySource
                    .slice(sourceNum)
                    .reduce((a, c) => a + c, 0);

                let replacementInstruction = {
                    changeType: "add",
                    changeTopLevelReplacements: true,
                    firstReplacementInd: numReplacementsSoFar,
                    numberReplacementsToReplace: numberReplacementsLeft,
                    serializedReplacements: newSerializedReplacements,
                };

                replacementChanges.push(replacementInstruction);

                recreateRemaining = true;
                nComponents = nComponentsForNew;
                stateIdInfo.num = newStateIdInfo.num;

                // since deleted remaining, change in workspace
                // so that don't attempt to delete again
                clearReplacementCountsFrom(workspace, sourceNum);
            } else {
                let nonStringInd = 0;
                for (let ind = 0; ind < nNewReplacements; ind++) {
                    let foundDifference =
                        propVariablesCopiedByReplacement[ind].length !==
                        workspace.propVariablesCopiedBySource[sourceNum][ind]
                            .length;
                    let onlyDifferenceIsType = !foundDifference;
                    if (!foundDifference) {
                        if (
                            workspace.propVariablesCopiedBySource[sourceNum][
                                ind
                            ].some(
                                (v, i) =>
                                    v !==
                                    propVariablesCopiedByReplacement[ind][i],
                            )
                        ) {
                            onlyDifferenceIsType = false;
                            foundDifference = true;
                        } else {
                            let currentReplacement =
                                component.replacements[
                                    numReplacementsSoFar + ind
                                ];

                            // Two value references share the type `_ref`;
                            // one that stands in for another type must be
                            // remade all the same.
                            if (
                                currentReplacement.componentType !==
                                    newSerializedReplacements[ind]
                                        .componentType ||
                                valueReferenceDiffers(
                                    currentReplacement,
                                    newSerializedReplacements[ind],
                                )
                            ) {
                                foundDifference = true;
                            }
                        }
                    }

                    if (ind == 0 && foundDifference && onlyDifferenceIsType) {
                        let requiredLength =
                            await component.stateValues.numComponentsSpecified;

                        let wrapExistingReplacements =
                            requiredLength === 1 &&
                            nNewReplacements === 1 &&
                            !(component.replacementsToWithhold > 0) &&
                            workspace.sourceIndices.length === 1;

                        if (wrapExistingReplacements) {
                            foundDifference = false;
                        }
                    }

                    if (foundDifference) {
                        // TODO: we could be more conservative and calculate the maximum componentIdx in the new replacements we used
                        nComponents = nComponentsForNew;
                        stateIdInfo.num = newStateIdInfo.num;
                        let replacementInstruction = {
                            changeType: "add",
                            changeTopLevelReplacements: true,
                            firstReplacementInd: numReplacementsSoFar + ind,
                            numberReplacementsToReplace: 1,
                            serializedReplacements: [
                                newSerializedReplacements[ind],
                            ],
                        };
                        replacementChanges.push(replacementInstruction);
                    }

                    if (typeof newSerializedReplacements[ind] !== "string") {
                        nonStringInd++;
                    }
                }
            }

            let nNewNonStrings = newSerializedReplacements.filter(
                (x) => typeof x !== "string",
            ).length;

            numReplacementsSoFar += nNewReplacements;
            numNonStringReplacementsSoFar += nNewNonStrings;

            numReplacementsBySource[sourceNum] = nNewReplacements;
            numNonStringReplacementsBySource[sourceNum] = nNewNonStrings;
            madeBlankBySource[sourceNum] = Boolean(results.madeBlank);

            propVariablesCopiedBySource[sourceNum] =
                propVariablesCopiedByReplacement;
        }

        let previousZeroSourceIndices = workspace.sourceIndices.length === 0;

        workspace.numReplacementsBySource = numReplacementsBySource;
        workspace.numNonStringReplacementsBySource =
            numNonStringReplacementsBySource;
        workspace.sourceIndices = replacementSourceIdentities.map(
            (x) => x.componentIdx,
        );
        workspace.propVariablesCopiedBySource = propVariablesCopiedBySource;
        workspace.sourceContainsCopyBySource = sourceContainsCopyBySource;
        workspace.madeBlankBySource = madeBlankBySource;

        // An index that names nothing now, or names something again (D36).
        // A value that does not convert reports itself (`doenet-i0053`).
        if (!workspace.typeChangeKey?.startsWith("mismatch")) {
            reportTypeChange(
                workspace,
                !withheldAll &&
                    !namesNothing(
                        numNonStringReplacementsBySource,
                        madeBlankBySource,
                    )
                    ? undefined
                    : await indexNamesNothing({
                          component,
                          componentInfoObjects,
                          workspace,
                      }),
            );
        }

        let verificationResult = await verifyReplacementsMatchSpecifiedType({
            component,
            replacementChanges,
            workspace,
            componentInfoObjects,
            compositeAttributesObj,
            components,
            nComponents,
            stateIdInfo,
            publicCaseInsensitiveAliasSubstitutions,
        });
        diagnostics.push(...verificationResult.diagnostics);
        nComponents = verificationResult.nComponents;
        replacementChanges = verificationResult.replacementChanges;

        // Note: this has to run after verify,
        // as verify has side effects of setting workspace variables,
        // such as numReplacementsBySource
        if (previousZeroSourceIndices && workspace.sourceIndices.length === 0) {
            // didn't have sources before and still don't have sources.
            // we're just getting filler components being recreated.
            // Don't actually make those changes
            return { replacementChanges: [], diagnostics, nComponents };
        }

        addAttributesToSingleReplacementChange(
            component,
            replacementChanges,
            componentInfoObjects,
        );

        // console.log("replacementChanges");
        // console.log(replacementChanges);

        workspace.replacementsCreated = stateIdInfo.num;

        return {
            replacementChanges,
            diagnostics,
            nComponents,
        };
    }

    static async recreateReplacements({
        component,
        sourceNum,
        numReplacementsSoFar,
        numNonStringReplacementsSoFar,
        numReplacementsToDelete,
        components,
        nComponents,
        stateIdInfo,
        compositeAttributesObj,
        componentInfoObjects,
        numComponentsForSource,
        publicCaseInsensitiveAliasSubstitutions,
    }) {
        let diagnostics = [];

        let results = await this.createReplacementForSource({
            component,
            sourceNum,
            numReplacementsSoFar,
            numNonStringReplacementsSoFar,
            components,
            nComponents,
            stateIdInfo,
            compositeAttributesObj,
            componentInfoObjects,
            numComponentsForSource,
            publicCaseInsensitiveAliasSubstitutions,
            copyInChildren:
                Number(sourceNum) === 0 &&
                component.attributes._copyInChildren?.primitive.value,
        });
        diagnostics.push(...results.diagnostics);
        nComponents = results.nComponents;

        let propVariablesCopiedByReplacement =
            results.propVariablesCopiedByReplacement;

        let newSerializedChildren = results.serializedReplacements;

        if (newSerializedChildren.length > 0 || numReplacementsToDelete > 0) {
            let replacementInstruction = {
                changeType: "add",
                changeTopLevelReplacements: true,
                firstReplacementInd: numReplacementsSoFar,
                numberReplacementsToReplace: numReplacementsToDelete,
                serializedReplacements: newSerializedChildren,
            };

            return {
                numReplacements: newSerializedChildren.length,
                numNonStringReplacements: newSerializedChildren.filter(
                    (x) => typeof x !== "string",
                ).length,
                propVariablesCopiedByReplacement,
                replacementInstruction,
                diagnostics,
                nComponents,
                sourceContainsCopy: Boolean(results.sourceContainsCopy),
                madeBlank: Boolean(results.madeBlank),
            };
        } else {
            return {
                numReplacements: 0,
                numNonStringReplacements: 0,
                propVariablesCopiedByReplacement,
                replacementInstruction: null,
                diagnostics,
                nComponents,
                sourceContainsCopy: Boolean(results.sourceContainsCopy),
            };
        }
    }
}

/**
 * The warning for a reference that reached `replacementSource` with an index
 * left over that names nothing there (D27), or `undefined` when it has already
 * been reported.
 *
 * An index left over on a composite (`$s[3]` on a `<select>` that made two
 * picks) was reported where the reference was resolved
 * (`refResolutionDependencies.ts`), and the composite's replacements are
 * what is left to try it on, so it is not reported again. On any other
 * component, the index names nothing because the component produces nothing an
 * index selects: `$sec[2]` does not select a child of a `<section>`
 * (`doenet-w0180`). A component with a value (`variableForImplicitProp`) whose
 * value has no entries, as a `<number>` or a `<text>`, is reported as an index
 * into a value with no entries is (`doenet-w0100`), the same as `$n.value[1]`
 * and as `$m[1]` of a `<math>` holding a scalar (D27). A component whose
 * values an index selects through one of its properties
 * (`indexThroughProperty`, a `<spreadsheet>`'s `cells`) is reported with that
 * property put in (`doenet-w0182`). A component that does produce something
 * an index selects, as a list does its entries, took the index already, and
 * an index past what it produces is silent (#1499).
 */
async function diagnosticForUnusedIndex({
    component,
    replacementSource,
    allDoenetMLs,
    componentInfoObjects,
}) {
    const extendedComponent = await component.stateValues.extendedComponent;
    if (
        !extendedComponent ||
        componentInfoObjects.isCompositeComponent({
            componentType: extendedComponent.componentType,
            includeNonStandard: true,
        }) ||
        replacementSource.componentIdx !== extendedComponent.componentIdx
    ) {
        return undefined;
    }

    const originalPath = await component.stateValues.originalPath;
    const dollars = doenetMLDollarsForReference(originalPath, allDoenetMLs);
    const reference = `${dollars}${doenetMLStringForReference(
        originalPath,
        allDoenetMLs,
    )}`;
    const sourceClass =
        componentInfoObjects.allComponentClasses[
            replacementSource.componentType
        ];

    const property = sourceClass?.indexThroughProperty;
    if (property) {
        // The reference with the property put in front of the index left
        // over: `$ss[1][2]` becomes `$ss.cells[1][2]`.
        const unresolvedPath = await component.stateValues.unresolvedPath;
        const pathStart = originalPath?.[0]?.position?.start.offset;
        const pathEnd =
            originalPath?.[originalPath.length - 1]?.position?.end.offset;
        const indexStart =
            unresolvedPath?.[0]?.index?.[0]?.position?.start.offset;
        const source =
            allDoenetMLs?.[originalPath?.[0]?.sourceDoc ?? 0] ?? undefined;
        if (
            source !== undefined &&
            pathStart != undefined &&
            pathEnd != undefined &&
            indexStart != undefined
        ) {
            return codedDiagnostic({
                type: "warning",
                code: "doenet-w0182",
                args: {
                    reference,
                    component: replacementSource.componentType,
                    suggestion: `${dollars}${source.substring(
                        pathStart,
                        indexStart,
                    )}.${property}${source.substring(indexStart, pathEnd)}`,
                    property,
                },
            });
        }
    }

    if (sourceClass?.variableForImplicitProp) {
        return codedDiagnostic({
            type: "warning",
            code: "doenet-w0100",
            args: { reference },
        });
    }

    return codedDiagnostic({
        type: "warning",
        code: "doenet-w0180",
        args: {
            reference,
            component: replacementSource.componentType,
        },
    });
}

export async function replacementFromProp({
    component,
    components,
    nComponents,
    stateIdInfo,
    replacementSource,
    propName,
    allDoenetMLs,
    // numReplacementsSoFar,
    compositeAttributesObj,
    componentInfoObjects,
    numComponentsForSource,
    publicCaseInsensitiveAliasSubstitutions,
}) {
    // console.log(`replacement from prop for ${component.componentIdx}`)
    // console.log(replacementSource)

    let diagnostics = [];

    let serializedReplacements = [];
    let propVariablesCopiedByReplacement = [];

    // if (replacementSource === null) {
    //   return { serializedReplacements, propVariablesCopiedByReplacement };
    // }

    let replacementInd = -1; //numReplacementsSoFar - 1;

    let target = undefined;
    let varName = undefined;

    if (replacementSource) {
        target = components[replacementSource.componentIdx];

        // An entry of a list component, or a property of its entries, was
        // resolved to an array of the list (`utils/listEntryReference.ts`).
        varName =
            isListEntryArrayVariable(target, propName) ||
            isValueEntriesVariable(propName)
                ? propName
                : publicCaseInsensitiveAliasSubstitutions({
                      stateVariables: [propName],
                      componentClass: target.constructor,
                  })[0];
    }

    if (varName === undefined || varName.slice(0, 12) === "__not_public") {
        if (propName === "__no_target_found") {
            // find name of prop from unresolvedPath position and doenetML
            const unresolvedPath = await component.stateValues.unresolvedPath;

            if (unresolvedPath[0].name === "") {
                // An index was left over: what the reference reached produces
                // nothing an index selects, or a composite has no instance at
                // that index.
                const indexDiagnostic = await diagnosticForUnusedIndex({
                    component,
                    replacementSource,
                    allDoenetMLs,
                    componentInfoObjects,
                });
                if (indexDiagnostic) {
                    diagnostics.push(indexDiagnostic);
                }
                return {
                    serializedReplacements: [],
                    propVariablesCopiedByReplacement: [],
                    diagnostics,
                    nComponents,
                };
            }

            const startOffset = unresolvedPath[0].position?.start.offset;
            const endOffset =
                unresolvedPath[unresolvedPath.length - 1].position?.end.offset;

            let unresolvedPropName = "";
            if (startOffset != undefined && endOffset != undefined) {
                const sourceDoc = unresolvedPath[0].sourceDoc ?? 0;
                unresolvedPropName = allDoenetMLs?.[sourceDoc]?.substring(
                    startOffset,
                    endOffset,
                );
            }
            diagnostics.push(
                codedDiagnostic({
                    type: "info",
                    code: "doenet-i0018",
                    args: {
                        property: unresolvedPropName,
                        component: replacementSource.componentType,
                    },
                }),
            );
        } else if (propName !== "__prop_name_not_found") {
            diagnostics.push(
                codedDiagnostic({
                    type: "info",
                    code: "doenet-i0018",
                    args: {
                        property: propName,
                        component: replacementSource.componentType,
                    },
                }),
            );
        }
        return {
            serializedReplacements: [],
            propVariablesCopiedByReplacement: [],
            diagnostics,
            nComponents,
        };
    }

    let stateVarObj = target.state[varName];
    let stateVarValue = await stateVarObj.value;

    let link = await component.stateValues.link;
    const implicitProp = await component.stateValues.implicitProp;

    // The component that will hold the replacements. When it reads only
    // values from its children, or draws them (`<p>`), a linked reference to
    // one state variable can be a value reference (`_ref`) instead of a full
    // component with shadow attribute components (Doenet/DoenetML#2128).
    // Not when the reference was
    // given a type: an `extend` or `copy` (`<number extend="$P.x" />`) and an
    // index both set `_createComponentOfType`, and the component they ask for
    // is made as it always was.
    const parentClass = component.ancestors[0]?.componentClass;
    const mayBeValueReference =
        link && !component.attributes._createComponentOfType?.primitive;

    if (stateVarObj.isArray || stateVarObj.isArrayEntry) {
        let arrayStateVarObj, unflattenedArrayKeys, arraySize, arrayKeys;
        if (stateVarObj.isArray) {
            arrayStateVarObj = stateVarObj;
            arraySize = await stateVarObj.arraySize;
            unflattenedArrayKeys = stateVarObj.getAllArrayKeys(
                arraySize,
                false,
            );
        } else {
            arrayStateVarObj = target.state[stateVarObj.arrayStateVariable];
            unflattenedArrayKeys = await stateVarObj.unflattenedArrayKeys;
            arrayKeys = await stateVarObj.arrayKeys;
        }

        if (arrayStateVarObj.shadowingInstructions?.hasVariableComponentType) {
            await component.stateValues.replacementSources;
            if (!arrayStateVarObj.shadowingInstructions.createComponentOfType) {
                return {
                    serializedReplacements: [],
                    propVariablesCopiedByReplacement: [],
                    diagnostics,
                    nComponents,
                };
            }
        }

        // See description of returnWrappingComponents in Core.js.
        let wrappingComponents = stateVarObj.wrappingComponents;
        let numWrappingComponents = wrappingComponents.length;

        let numReplacementsForSource = numComponentsForSource;

        if (stateVarObj.isArray) {
            if (arraySize.some((v) => v === 0)) {
                numReplacementsForSource = 0;
            } else {
                numReplacementsForSource = arraySize
                    .slice(0, arraySize.length - numWrappingComponents)
                    .reduce((a, c) => a * c, 1);
            }
        } else {
            if (arrayKeys.length === 0) {
                // have an undefined array entry
                numReplacementsForSource = 0;
            } else if (numWrappingComponents === 0) {
                // with no wrapping components, will just output
                // one component for each component of the array
                numReplacementsForSource = arrayKeys.length;
            } else if (numWrappingComponents >= stateVarObj.numDimensions) {
                // if had an outer wrapping component, would just have a single component
                numReplacementsForSource = 1;
            } else if (
                numWrappingComponents ===
                stateVarObj.numDimensions - 1
            ) {
                // if the second from outer dimension is wrapped
                // then just count the number of entries in the original array
                numReplacementsForSource = unflattenedArrayKeys.length;
            } else {
                // if have at least two unwrapped dimensions,
                // flatten the array so that the entries counted are the outermost wrapped
                // Note: we need to create a 3D array entry to access this,
                // so this code is so far untested
                let nLevelsToFlatten =
                    stateVarObj.numDimensions - numWrappingComponents - 1;
                numReplacementsForSource = flattenLevels(
                    unflattenedArrayKeys,
                    nLevelsToFlatten,
                ).length;
            }
        }

        // A reference to a whole array of values (`$P.xs`, `$l.text`) whose
        // parent takes components rather than values is one list component
        // shadowing the array (Doenet/DoenetML#2160).
        const listReplacement = stateVarObj.isArray
            ? await arrayListReplacement({
                  component,
                  components,
                  target,
                  varName,
                  arrayStateVarObj,
                  numWrappingComponents,
                  link,
                  mayBeValueReference,
                  parentClass,
                  componentInfoObjects,
                  compositeAttributesObj,
                  nComponents,
                  stateIdInfo,
              })
            : undefined;
        if (listReplacement) {
            return {
                serializedReplacements: [listReplacement.serializedComponent],
                propVariablesCopiedByReplacement: [[varName]],
                diagnostics,
                nComponents: listReplacement.nComponents,
            };
        }

        if (numWrappingComponents === 0) {
            // return flattened entries

            let flattenedArrayKeys = flattenDeep(unflattenedArrayKeys);

            for (let ind = 0; ind < numReplacementsForSource; ind++) {
                let arrayKey = flattenedArrayKeys[ind];

                if (await component.stateValues.removeEmptyArrayEntries) {
                    // check if value of replacementSource is undefined or null
                    // if so, skip

                    if (!arrayKey) {
                        // skip because didn't match array key
                        continue;
                    }

                    let arrayIndex = arrayStateVarObj.keyToIndex(arrayKey);
                    if (!Array.isArray(arrayIndex)) {
                        arrayIndex = [arrayIndex];
                    }
                    let propStateValue = await arrayStateVarObj.value;
                    for (let ind2 of arrayIndex) {
                        propStateValue = propStateValue[ind2];
                    }

                    if (
                        propStateValue === undefined ||
                        propStateValue === null
                    ) {
                        continue;
                    }
                }

                replacementInd++;
                let propVariablesCopied = (propVariablesCopiedByReplacement[
                    replacementInd
                ] = []);

                let createComponentOfType =
                    arrayStateVarObj.shadowingInstructions
                        .createComponentOfType;
                if (Array.isArray(createComponentOfType)) {
                    // TODO: multidimensional arrays?

                    if (
                        createComponentOfType[
                            arrayStateVarObj.keyToIndex(arrayKey)
                        ]
                    ) {
                        createComponentOfType =
                            createComponentOfType[
                                arrayStateVarObj.keyToIndex(arrayKey)
                            ];
                    } else {
                        // TODO: better way to handle no match?
                        createComponentOfType = createComponentOfType[0];
                    }
                    // if (stateVarObj.isArrayEntry) {
                    //   createComponentOfType = createComponentOfType[arrayStateVarObj.keyToIndex(arrayKey)];
                    // } else {
                    //   createComponentOfType = createComponentOfType[ind];
                    // }
                }

                if (arrayKey) {
                    let propVariable =
                        arrayStateVarObj.arrayVarNameFromArrayKey(arrayKey);

                    propVariablesCopied.push(propVariable);

                    const res = convertUnresolvedAttributesForComponentType({
                        attributes: component.attributes,
                        componentType: createComponentOfType,
                        componentInfoObjects,
                        compositeAttributesObj,
                        nComponents,
                        stateIdInfo,
                    });

                    const attributesFromComposite = res.attributes;
                    nComponents = res.nComponents;

                    let attributeComponentsShadowingStateVariables;
                    if (
                        arrayStateVarObj.shadowingInstructions
                            .addAttributeComponentsShadowingStateVariables
                    ) {
                        attributeComponentsShadowingStateVariables = {};

                        for (let attrName in arrayStateVarObj
                            .shadowingInstructions
                            .addAttributeComponentsShadowingStateVariables) {
                            let stateVariableToShadow =
                                arrayStateVarObj.shadowingInstructions
                                    .addAttributeComponentsShadowingStateVariables[
                                    attrName
                                ].stateVariableToShadow;

                            let sObj = target.state[stateVariableToShadow];
                            if (sObj.isArray) {
                                stateVariableToShadow =
                                    sObj.arrayVarNameFromArrayKey(arrayKey);
                            }

                            attributeComponentsShadowingStateVariables[
                                attrName
                            ] = {
                                stateVariableToShadow,
                            };
                        }
                    }

                    let stateVariablesShadowingStateVariables;
                    if (
                        arrayStateVarObj.shadowingInstructions
                            .addStateVariablesShadowingStateVariables
                    ) {
                        stateVariablesShadowingStateVariables = {};

                        for (let attrName in arrayStateVarObj
                            .shadowingInstructions
                            .addStateVariablesShadowingStateVariables) {
                            let stateVariableToShadow =
                                arrayStateVarObj.shadowingInstructions
                                    .addStateVariablesShadowingStateVariables[
                                    attrName
                                ].stateVariableToShadow;

                            let sObj = target.state[stateVariableToShadow];
                            if (sObj.isArray) {
                                stateVariableToShadow =
                                    sObj.arrayVarNameFromArrayKey(arrayKey);
                            }

                            stateVariablesShadowingStateVariables[attrName] = {
                                stateVariableToShadow,
                            };
                        }
                    }

                    const { responseMarks, otherAttributes } =
                        separateResponseMarks(attributesFromComposite);
                    const valueReference = mayBeValueReference
                        ? planValueReference({
                              parentClass,
                              targetComponentType: target.componentType,
                              valueComponentType: createComponentOfType,
                              // An adapter's variable lives on the referent
                              // only for its implicit prop, never for an
                              // entry of one of its arrays.
                              fromImplicitProp: false,
                              hasAttributes:
                                  Object.keys(otherAttributes).length > 0,
                              allowDrawn: true,
                              componentInfoObjects,
                          })
                        : undefined;

                    if (valueReference) {
                        serializedReplacements.push(
                            serializeValueReference({
                                ...valueReference,
                                referencedVariable: propVariable,
                                valueComponentType: createComponentOfType,
                                target,
                                componentIdx: nComponents++,
                                stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                                responseMarks,
                            }),
                        );
                    } else if (link) {
                        let attributesForReplacement = {};

                        const doenetAttributesForReplacement =
                            listEntrySourceDoenetAttributes({
                                arrayStateVarObj,
                                arrayKey,
                                target,
                            });
                        // a variable read from the list is not also an
                        // attribute, which would override the component's
                        // parent's (`fixed`)
                        const readFromList =
                            doenetAttributesForReplacement.listEntrySource
                                ?.variables ?? {};

                        if (attributeComponentsShadowingStateVariables) {
                            let classOfComponentToCreate =
                                componentInfoObjects.allComponentClasses[
                                    createComponentOfType
                                ];
                            let attrObj =
                                classOfComponentToCreate.createAttributesObject();

                            for (let attrName in attributeComponentsShadowingStateVariables) {
                                if (attrName in readFromList) {
                                    continue;
                                }
                                let stateVariableToShadow =
                                    attributeComponentsShadowingStateVariables[
                                        attrName
                                    ].stateVariableToShadow;
                                let attributeComponentType =
                                    attrObj[attrName]?.createComponentOfType;

                                if (
                                    attributeShadowIsReference(
                                        attributeComponentType,
                                    )
                                ) {
                                    attributesForReplacement[attrName] =
                                        shadowAttributeReference({
                                            attrName,
                                            attributeComponentType,
                                            target,
                                            stateVariableToShadow,
                                        });
                                } else if (attributeComponentType) {
                                    let shadowComponent = {
                                        type: "serialized",
                                        componentType: attributeComponentType,
                                        componentIdx: nComponents++,
                                        stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                                        attributes: {},
                                        doenetAttributes: {},
                                        state: {},
                                        children: [],
                                        downstreamDependencies: {
                                            [target.componentIdx]: [
                                                {
                                                    compositeIdx:
                                                        component.componentIdx,
                                                    dependencyType:
                                                        "referenceShadow",
                                                    propVariable:
                                                        stateVariableToShadow,
                                                },
                                            ],
                                        },
                                    };

                                    attributesForReplacement[attrName] = {
                                        component: shadowComponent,
                                    };
                                }
                            }
                        }

                        deleteReplacedAttributes({
                            attributes: attributesForReplacement,
                            attributesFromComposite,
                            componentType: createComponentOfType,
                            componentInfoObjects,
                        });

                        Object.assign(
                            attributesForReplacement,
                            attributesFromComposite,
                        );

                        serializedReplacements.push({
                            type: "serialized",
                            componentType: createComponentOfType,
                            componentIdx: nComponents++,
                            stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                            attributes: attributesForReplacement,
                            doenetAttributes: doenetAttributesForReplacement,
                            children: [],
                            state: {},
                            downstreamDependencies: {
                                [replacementSource.componentIdx]: [
                                    {
                                        dependencyType: "referenceShadow",
                                        compositeIdx: component.componentIdx,
                                        propVariable,
                                        additionalStateVariableShadowing:
                                            stateVariablesShadowingStateVariables,
                                    },
                                ],
                            },
                        });
                    } else {
                        // no link

                        let attributesForReplacement = {};

                        if (attributeComponentsShadowingStateVariables) {
                            let classOfComponentToCreate =
                                componentInfoObjects.allComponentClasses[
                                    createComponentOfType
                                ];
                            let attrObj =
                                classOfComponentToCreate.createAttributesObject();

                            let additionalAttributes = {};
                            for (let attrName in attributeComponentsShadowingStateVariables) {
                                if (attrObj[attrName]?.createComponentOfType) {
                                    let vName =
                                        attributeComponentsShadowingStateVariables[
                                            attrName
                                        ].stateVariableToShadow;
                                    let attributeStateVarObj =
                                        target.state[vName];
                                    let attributeValue;
                                    let usedDefault;
                                    if (attributeStateVarObj) {
                                        attributeValue =
                                            await attributeStateVarObj.value;
                                        usedDefault =
                                            attributeStateVarObj.usedDefault;
                                    } else {
                                        // an entry, not read yet, of an
                                        // array holding the companion of
                                        // each entry: read from the array
                                        const companionArray =
                                            target.state[
                                                arrayStateVarObj
                                                    .shadowingInstructions
                                                    .addAttributeComponentsShadowingStateVariables[
                                                    attrName
                                                ].stateVariableToShadow
                                            ];
                                        attributeValue = (
                                            await companionArray.value
                                        )[
                                            arrayStateVarObj.keyToIndex(
                                                arrayKey,
                                            )
                                        ];
                                        usedDefault = Boolean(
                                            companionArray
                                                .usedDefaultByArrayKey?.[
                                                arrayKey
                                            ],
                                        );
                                    }
                                    // An entry's `hide` is pasted even when
                                    // it is the default `false`: a reader can
                                    // hide or show the entry's source, and a
                                    // copy made again on reload must have the
                                    // same components, in the same order, for
                                    // the snapshot it was made with to apply
                                    // (`applyCopySnapshot`)
                                    if (!usedDefault || attrName === "hide") {
                                        additionalAttributes[attrName] =
                                            attributeValue;
                                    }
                                }
                            }

                            const res = convertAttributeValuesForComponentType({
                                attributeValues: additionalAttributes,
                                componentType: createComponentOfType,
                                componentInfoObjects,
                                nComponents,
                                stateIdInfo,
                            });

                            const attributesFromComponent = res.attributes;
                            nComponents = res.nComponents;

                            if (
                                stateVarObj.shadowingInstructions
                                    .attributesToShadow
                            ) {
                                for (let attrName of stateVarObj
                                    .shadowingInstructions.attributesToShadow) {
                                    if (
                                        target.attributes[attrName]?.component
                                    ) {
                                        const serializedComponent =
                                            await target.attributes[
                                                attrName
                                            ].component.serialize({
                                                copyAll: true,
                                                copyVariants: true,
                                            });

                                        let res = createNewComponentIndices(
                                            [serializedComponent],
                                            nComponents,
                                            stateIdInfo,
                                            undefined,
                                            // pasted from the source, its references keep the
                                            // referents they have there (D1)
                                            { keepReferents: true },
                                        );
                                        nComponents = res.nComponents;

                                        attributesFromComponent[attrName] = {
                                            type: "component",
                                            name: attrName,
                                            component: res.components[0],
                                        };
                                    } else if (
                                        target.attributes[attrName]?.type ===
                                        "literal"
                                    ) {
                                        // a literal: copied as its attribute component was
                                        attributesFromComponent[attrName] =
                                            copyOfLiteralAttribute(
                                                target.attributes[attrName],
                                                target,
                                            );
                                    } else if (
                                        target.attributes[attrName]
                                            ?.primitive !== undefined
                                    ) {
                                        attributesFromComponent[attrName] = {
                                            type: "primitive",
                                            name: attrName,
                                            primitive: JSON.parse(
                                                JSON.stringify(
                                                    target.attributes[attrName]
                                                        .primitive,
                                                ),
                                            ),
                                        };
                                    }
                                }
                            }

                            Object.assign(
                                attributesForReplacement,
                                attributesFromComponent,
                            );
                        }

                        // A copy of an entry, pasted, takes the `fixed` and
                        // `fixLocation` written on the list
                        // (`<mathList fixed="$b">`), or else, for a list of
                        // points or vectors, on the entry's source
                        // (`writtenEntryAttributeComponent`).
                        const entryAttributes =
                            componentInfoObjects.allComponentClasses[
                                createComponentOfType
                            ].createAttributesObject();
                        const entryIndex =
                            arrayStateVarObj.keyToIndex(arrayKey);
                        for (const attrName of CONTEXT_ATTRIBUTES) {
                            if (
                                !entryAttributes[attrName] ||
                                !Number.isInteger(entryIndex) ||
                                !isListEntryArrayVariable(target, varName)
                            ) {
                                continue;
                            }
                            const written =
                                await writtenEntryAttributeComponent({
                                    list: target,
                                    index: entryIndex,
                                    attributeName: attrName,
                                    components,
                                });
                            if (!written) {
                                continue;
                            }
                            if (written.literal) {
                                attributesForReplacement[attrName] =
                                    written.literal;
                                continue;
                            }
                            const res = createNewComponentIndices(
                                [
                                    await written.serialize({
                                        copyAll: true,
                                        copyVariants: true,
                                        components,
                                    }),
                                ],
                                nComponents,
                                stateIdInfo,
                                undefined,
                                // pasted from the list, its references keep
                                // the referents they have there (D1)
                                { keepReferents: true },
                            );
                            nComponents = res.nComponents;
                            attributesForReplacement[attrName] = {
                                type: "component",
                                name: attrName,
                                component: res.components[0],
                            };
                        }

                        deleteReplacedAttributes({
                            attributes: attributesForReplacement,
                            attributesFromComposite,
                            componentType: createComponentOfType,
                            componentInfoObjects,
                        });

                        Object.assign(
                            attributesForReplacement,
                            attributesFromComposite,
                        );

                        const primaryEssentialStateVariable =
                            primaryEssentialStateVariableOf({
                                componentType: createComponentOfType,
                                componentInfoObjects,
                            });

                        let arrayIndex = arrayStateVarObj.keyToIndex(arrayKey);
                        if (!Array.isArray(arrayIndex)) {
                            arrayIndex = [arrayIndex];
                        }
                        let propStateValue = await arrayStateVarObj.value;
                        for (let ind2 of arrayIndex) {
                            propStateValue = propStateValue[ind2];
                        }

                        // The copy takes its index and stateId before its
                        // `<label>` child, so its stateId is the same whether
                        // or not the entry has a label.
                        const componentIdx = nComponents++;
                        const stateId = `${stateIdInfo.prefix}${stateIdInfo.num++}`;

                        const entrySource = await listEntrySourceSnapshot({
                            arrayStateVarObj,
                            arrayKey,
                            target,
                            nComponents,
                            stateIdInfo,
                        });
                        nComponents = entrySource.nComponents;

                        let serializedComponent = {
                            type: "serialized",
                            componentType: createComponentOfType,
                            componentIdx,
                            stateId,
                            attributes: attributesForReplacement,
                            doenetAttributes: {},
                            state: {
                                ...entrySource.state,
                                [primaryEssentialStateVariable]: propStateValue,
                            },
                            children: entrySource.children,
                        };

                        serializedReplacements.push(serializedComponent);
                    }
                } else {
                    // didn't match an array key, so just add an empty component of createComponentOfType

                    serializedReplacements.push({
                        type: "serialized",
                        componentType: createComponentOfType,
                        componentIdx: nComponents++,
                        stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                        attributes: {},
                        doenetAttributes: {},
                        children: [],
                        state: {},
                    });
                }
            }
        } else {
            // Have wrapping components.
            // See description of returnWrappingComponents in Core.js.

            let createReplacementPiece = async function (
                subArrayKeys,
                numDimensionsLeft,
                init = false,
            ) {
                let pieces = [];
                let propVariablesCopiedByPiece = [];

                if (numDimensionsLeft > 1) {
                    // since numDimensionsLeft > 1, each component of subArray should be an array
                    for (let subSubArrayKeys of subArrayKeys) {
                        // recurse down to previous dimension
                        let result = await createReplacementPiece(
                            subSubArrayKeys,
                            numDimensionsLeft - 1,
                        );
                        pieces.push(...result.pieces);
                        propVariablesCopiedByPiece.push(
                            ...result.propVariablesCopiedByPiece,
                        );
                    }
                } else {
                    // down to last piece
                    for (let arrayKey of subArrayKeys) {
                        let propVariable =
                            arrayStateVarObj.arrayVarNameFromArrayKey(arrayKey);
                        let propVariablesCopiedForThisPiece = [propVariable];

                        let createComponentOfType =
                            arrayStateVarObj.shadowingInstructions
                                .createComponentOfType;
                        if (Array.isArray(createComponentOfType)) {
                            // TODO: multidimensional arrays?
                            createComponentOfType =
                                createComponentOfType[
                                    arrayStateVarObj.keyToIndex(arrayKey)
                                ];
                        }

                        let attributeComponentsShadowingStateVariables;
                        if (
                            arrayStateVarObj.shadowingInstructions
                                .addAttributeComponentsShadowingStateVariables
                        ) {
                            attributeComponentsShadowingStateVariables = {};

                            let attributeShadowingInfo =
                                arrayStateVarObj.shadowingInstructions
                                    .addAttributeComponentsShadowingStateVariables;

                            for (let attrName in attributeShadowingInfo) {
                                if (
                                    !attributeShadowingInfo[attrName]
                                        .addToOuterIfWrappedArray
                                ) {
                                    let stateVariableToShadow =
                                        attributeShadowingInfo[attrName]
                                            .stateVariableToShadow;

                                    let sObj =
                                        target.state[stateVariableToShadow];
                                    if (sObj.isArray) {
                                        stateVariableToShadow =
                                            sObj.arrayVarNameFromArrayKey(
                                                arrayKey,
                                            );
                                    }

                                    attributeComponentsShadowingStateVariables[
                                        attrName
                                    ] = {
                                        stateVariableToShadow,
                                    };
                                }
                            }
                        }

                        let stateVariablesShadowingStateVariables;
                        if (
                            arrayStateVarObj.shadowingInstructions
                                .addStateVariablesShadowingStateVariables
                        ) {
                            stateVariablesShadowingStateVariables = {};

                            for (let attrName in arrayStateVarObj
                                .shadowingInstructions
                                .addStateVariablesShadowingStateVariables) {
                                let stateVariableToShadow =
                                    arrayStateVarObj.shadowingInstructions
                                        .addStateVariablesShadowingStateVariables[
                                        attrName
                                    ].stateVariableToShadow;

                                let sObj = target.state[stateVariableToShadow];
                                if (sObj.isArray) {
                                    stateVariableToShadow =
                                        sObj.arrayVarNameFromArrayKey(arrayKey);
                                }

                                stateVariablesShadowingStateVariables[
                                    attrName
                                ] = {
                                    stateVariableToShadow,
                                };
                            }
                        }

                        if (link) {
                            let attributesForReplacement = {};

                            if (attributeComponentsShadowingStateVariables) {
                                let classOfComponentToCreate =
                                    componentInfoObjects.allComponentClasses[
                                        createComponentOfType
                                    ];
                                let attrObj =
                                    classOfComponentToCreate.createAttributesObject();

                                for (let attrName in attributeComponentsShadowingStateVariables) {
                                    let stateVariableToShadow =
                                        attributeComponentsShadowingStateVariables[
                                            attrName
                                        ].stateVariableToShadow;
                                    let attributeComponentType =
                                        attrObj[attrName]
                                            ?.createComponentOfType;

                                    if (
                                        attributeShadowIsReference(
                                            attributeComponentType,
                                        )
                                    ) {
                                        attributesForReplacement[attrName] =
                                            shadowAttributeReference({
                                                attrName,
                                                attributeComponentType,
                                                target,
                                                stateVariableToShadow,
                                            });
                                    } else if (attributeComponentType) {
                                        let shadowComponent = {
                                            type: "serialized",
                                            componentType:
                                                attributeComponentType,
                                            componentIdx: nComponents++,
                                            stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                                            attributes: {},
                                            doenetAttributes: {},
                                            state: {},
                                            children: [],
                                            downstreamDependencies: {
                                                [target.componentIdx]: [
                                                    {
                                                        compositeIdx:
                                                            component.componentIdx,
                                                        dependencyType:
                                                            "referenceShadow",
                                                        propVariable:
                                                            stateVariableToShadow,
                                                    },
                                                ],
                                            },
                                        };

                                        attributesForReplacement[attrName] = {
                                            component: shadowComponent,
                                        };
                                    }
                                }
                            }

                            pieces.push({
                                type: "serialized",
                                componentType: createComponentOfType,
                                componentIdx: nComponents++,
                                stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                                attributes: attributesForReplacement,
                                doenetAttributes: {},
                                children: [],
                                state: {},
                                downstreamDependencies: {
                                    [replacementSource.componentIdx]: [
                                        {
                                            dependencyType: "referenceShadow",
                                            compositeIdx:
                                                component.componentIdx,
                                            propVariable,
                                            additionalStateVariableShadowing:
                                                stateVariablesShadowingStateVariables,
                                        },
                                    ],
                                },
                            });
                        } else {
                            let attributesForReplacement = {};

                            if (attributeComponentsShadowingStateVariables) {
                                let classOfComponentToCreate =
                                    componentInfoObjects.allComponentClasses[
                                        createComponentOfType
                                    ];
                                let attrObj =
                                    classOfComponentToCreate.createAttributesObject();
                                let additionalAttributes = {};
                                for (let attrName in attributeComponentsShadowingStateVariables) {
                                    if (
                                        attrObj[attrName]?.createComponentOfType
                                    ) {
                                        let vName =
                                            attributeComponentsShadowingStateVariables[
                                                attrName
                                            ].stateVariableToShadow;
                                        let attributeStateVarObj =
                                            target.state[vName];
                                        let attributeValue =
                                            await attributeStateVarObj.value;
                                        if (attributeStateVarObj.isArray) {
                                            // Assume attribute has same dimensions as original
                                            // TODO: multidimensional arrays?
                                            attributeValue =
                                                attributeValue[
                                                    attributeStateVarObj
                                                        .keyToIndex[arrayKey]
                                                ];
                                        }
                                        if (!target.state[vName].usedDefault) {
                                            additionalAttributes[attrName] =
                                                attributeValue;
                                        }
                                    }
                                }

                                const res =
                                    convertAttributeValuesForComponentType({
                                        attributeValues: additionalAttributes,
                                        componentType: createComponentOfType,
                                        componentInfoObjects,
                                        nComponents,
                                        stateIdInfo,
                                    });

                                const attributesFromComponent = res.attributes;
                                nComponents = res.nComponents;

                                if (
                                    stateVarObj.shadowingInstructions
                                        .attributesToShadow
                                ) {
                                    for (let attrName of stateVarObj
                                        .shadowingInstructions
                                        .attributesToShadow) {
                                        if (
                                            target.attributes[attrName]
                                                ?.component
                                        ) {
                                            let serializedComponent =
                                                await target.attributes[
                                                    attrName
                                                ].component.serialize({
                                                    copyAll: true,
                                                    copyVariants: true,
                                                });

                                            let res = createNewComponentIndices(
                                                [serializedComponent],
                                                nComponents,
                                                stateIdInfo,
                                                undefined,
                                                // pasted from the source, its references keep the
                                                // referents they have there (D1)
                                                { keepReferents: true },
                                            );
                                            nComponents = res.nComponents;

                                            attributesFromComponent[attrName] =
                                                {
                                                    type: "component",
                                                    name: attrName,
                                                    component:
                                                        res.components[0],
                                                };
                                        } else if (
                                            target.attributes[attrName]
                                                ?.type === "literal"
                                        ) {
                                            // a literal: copied as its attribute component was
                                            attributesFromComponent[attrName] =
                                                copyOfLiteralAttribute(
                                                    target.attributes[attrName],
                                                    target,
                                                );
                                        } else if (
                                            target.attributes[attrName]
                                                ?.primitive !== undefined
                                        ) {
                                            attributesFromComponent[attrName] =
                                                {
                                                    type: "primitive",
                                                    name: attrName,
                                                    primitive: JSON.parse(
                                                        JSON.stringify(
                                                            target.attributes[
                                                                attrName
                                                            ].primitive,
                                                        ),
                                                    ),
                                                };
                                        }
                                    }
                                }

                                Object.assign(
                                    attributesForReplacement,
                                    attributesFromComponent,
                                );
                            }

                            const primaryEssentialStateVariable =
                                primaryEssentialStateVariableOf({
                                    componentType: createComponentOfType,
                                    componentInfoObjects,
                                });

                            let arrayIndex =
                                arrayStateVarObj.keyToIndex(arrayKey);
                            if (!Array.isArray(arrayIndex)) {
                                arrayIndex = [arrayIndex];
                            }

                            let propStateValue = await arrayStateVarObj.value;
                            for (let ind of arrayIndex) {
                                propStateValue = propStateValue[ind];
                            }

                            let serializedComponent = {
                                type: "serialized",
                                componentType: createComponentOfType,
                                componentIdx: nComponents++,
                                stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                                attributes: attributesForReplacement,
                                doenetAttributes: {},
                                children: [],
                                state: {
                                    [primaryEssentialStateVariable]:
                                        propStateValue,
                                },
                            };

                            pieces.push(serializedComponent);
                        }

                        propVariablesCopiedByPiece.push(
                            propVariablesCopiedForThisPiece,
                        );
                    }
                }

                // we wrap this dimension if have corresponding wrapping components
                let wrapCs = wrappingComponents[numDimensionsLeft - 1];
                if (pieces.length > 0 && wrapCs && wrapCs.length > 0) {
                    for (let ind = wrapCs.length - 1; ind >= 0; ind--) {
                        let wrapCT =
                            typeof wrapCs[ind] === "object"
                                ? wrapCs[ind].componentType
                                : wrapCs[ind];

                        let children = [];
                        let attributes = {};

                        for (let p of pieces) {
                            if (p.isAttributeNamed) {
                                let attr = p.isAttributeNamed;
                                delete p.isAttributeNamed;
                                attributes[attr] = { component: p };
                            } else {
                                children.push(p);
                            }
                        }

                        pieces = [
                            {
                                type: "serialized",
                                componentType: wrapCT,
                                componentIdx: nComponents++,
                                stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                                children,
                                attributes,
                                doenetAttributes: {},
                                state: {},
                                skipSugar: true,
                            },
                        ];
                        if (typeof wrapCs[ind] === "object") {
                            if (wrapCs[ind].isAttributeNamed) {
                                pieces[0].isAttributeNamed =
                                    wrapCs[ind].isAttributeNamed;
                            }
                        }
                    }
                    propVariablesCopiedByPiece = [
                        flattenDeep(propVariablesCopiedByPiece),
                    ];
                }

                if (
                    init &&
                    arrayStateVarObj.shadowingInstructions
                        .addAttributeComponentsShadowingStateVariables
                ) {
                    let attributeComponentsShadowingStateVariables = {};

                    let attributeShadowingInfo =
                        arrayStateVarObj.shadowingInstructions
                            .addAttributeComponentsShadowingStateVariables;

                    for (let attrName in attributeShadowingInfo) {
                        if (
                            attributeShadowingInfo[attrName]
                                .addToOuterIfWrappedArray
                        ) {
                            let stateVariableToShadow =
                                attributeShadowingInfo[attrName]
                                    .stateVariableToShadow;

                            attributeComponentsShadowingStateVariables[
                                attrName
                            ] = {
                                stateVariableToShadow,
                            };
                        }
                    }

                    if (
                        Object.keys(attributeComponentsShadowingStateVariables)
                            .length > 0
                    ) {
                        for (let piece of pieces) {
                            let attributesForReplacement = piece.attributes;
                            if (!attributesForReplacement) {
                                attributesForReplacement = piece.attributes =
                                    {};
                            }

                            let classOfComponentToCreate =
                                componentInfoObjects.allComponentClasses[
                                    piece.componentType
                                ];
                            let attrObj =
                                classOfComponentToCreate.createAttributesObject();

                            if (link) {
                                for (let attrName in attributeComponentsShadowingStateVariables) {
                                    let stateVariableToShadow =
                                        attributeComponentsShadowingStateVariables[
                                            attrName
                                        ].stateVariableToShadow;
                                    let attributeComponentType =
                                        attrObj[attrName]
                                            ?.createComponentOfType;

                                    if (
                                        attributeShadowIsReference(
                                            attributeComponentType,
                                        )
                                    ) {
                                        attributesForReplacement[attrName] =
                                            shadowAttributeReference({
                                                attrName,
                                                attributeComponentType,
                                                target,
                                                stateVariableToShadow,
                                            });
                                    } else if (attributeComponentType) {
                                        let shadowComponent = {
                                            type: "serialized",
                                            componentType:
                                                attributeComponentType,
                                            componentIdx: nComponents++,
                                            stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                                            attributes: {},
                                            doenetAttributes: {},
                                            state: {},
                                            children: [],
                                            downstreamDependencies: {
                                                [target.componentIdx]: [
                                                    {
                                                        compositeIdx:
                                                            component.componentIdx,
                                                        dependencyType:
                                                            "referenceShadow",
                                                        propVariable:
                                                            stateVariableToShadow,
                                                    },
                                                ],
                                            },
                                        };

                                        attributesForReplacement[attrName] = {
                                            component: shadowComponent,
                                        };
                                    }
                                }
                            } else {
                                let additionalAttributes = {};
                                for (let attrName in attributeComponentsShadowingStateVariables) {
                                    if (
                                        attrObj[attrName]?.createComponentOfType
                                    ) {
                                        let vName =
                                            attributeComponentsShadowingStateVariables[
                                                attrName
                                            ].stateVariableToShadow;
                                        let attributeStateVarObj =
                                            target.state[vName];
                                        let attributeValue =
                                            await attributeStateVarObj.value;

                                        if (!target.state[vName].usedDefault) {
                                            additionalAttributes[attrName] =
                                                attributeValue;
                                        }
                                    }
                                }

                                if (
                                    Object.keys(additionalAttributes).length > 0
                                ) {
                                    const res =
                                        convertAttributeValuesForComponentType({
                                            attributeValues:
                                                additionalAttributes,
                                            componentType: piece.componentType,
                                            componentInfoObjects,
                                            nComponents,
                                            stateIdInfo,
                                        });

                                    additionalAttributes = res.attributes;
                                    nComponents = res.nComponents;

                                    Object.assign(
                                        attributesForReplacement,
                                        additionalAttributes,
                                    );
                                }
                            }
                        }
                    }
                }

                return { pieces, propVariablesCopiedByPiece };
            };

            let result = await createReplacementPiece(
                unflattenedArrayKeys,
                stateVarObj.numDimensions,
                true,
            );

            let newReplacements = result.pieces;
            propVariablesCopiedByReplacement =
                result.propVariablesCopiedByPiece;

            // add downstream dependencies and attributes to top level replacements
            // (which are wrappers, so didn't get downstream dependencies originally)
            for (let replacement of newReplacements) {
                if (typeof replacement !== "object") {
                    continue;
                }

                if (!replacement.attributes) {
                    replacement.attributes = {};
                }

                const res = convertUnresolvedAttributesForComponentType({
                    attributes: component.attributes,
                    componentType: replacement.componentType,
                    componentInfoObjects,
                    compositeAttributesObj,
                    nComponents,
                    stateIdInfo,
                });

                const attributesFromComposite = res.attributes;
                nComponents = res.nComponents;

                deleteReplacedAttributes({
                    attributes: replacement.attributes,
                    attributesFromComposite,
                    componentType: replacement.componentType,
                    componentInfoObjects,
                });
                Object.assign(replacement.attributes, attributesFromComposite);

                if (link) {
                    replacement.downstreamDependencies = {
                        [replacementSource.componentIdx]: [
                            {
                                dependencyType: "referenceShadow",
                                compositeIdx: component.componentIdx,
                                propVariable: varName,
                                ignorePrimaryStateVariable: true,
                            },
                        ],
                    };
                }
            }

            replacementInd += newReplacements.length;

            serializedReplacements.push(...newReplacements);

            if (newReplacements.length < numReplacementsForSource) {
                // we didn't create enough replacements,
                // which could happen if we have componentType and numComponentsSpecified set

                // just create additional replacements,
                // even though they won't yet refer to the right dependencies

                for (
                    let ind = newReplacements.length;
                    ind < numReplacementsForSource;
                    ind++
                ) {
                    replacementInd++;
                    propVariablesCopiedByReplacement[replacementInd] = [];

                    let createComponentOfType;
                    let wrapCs = wrappingComponents[0];
                    let wrapDoenetAttributes;
                    if (wrapCs && wrapCs.length > 0) {
                        if (typeof wrapCs[0] === "object") {
                            createComponentOfType = wrapCs[0].componentType;
                            wrapDoenetAttributes = Object.assign(
                                {},
                                wrapCs[0].doenetAttributes,
                            );
                        } else {
                            createComponentOfType = wrapCs[0];
                        }
                    } else {
                        createComponentOfType =
                            arrayStateVarObj.shadowingInstructions
                                .createComponentOfType;
                        if (Array.isArray(createComponentOfType)) {
                            // TODO: multidimensional arrays?
                            if (stateVarObj.isArrayEntry) {
                                createComponentOfType =
                                    createComponentOfType[
                                        arrayStateVarObj.keyToIndex(
                                            arrayKeys[ind],
                                        )
                                    ];
                            } else {
                                createComponentOfType =
                                    createComponentOfType[ind];
                            }
                        }
                    }

                    // just add an empty component of createComponentOfType

                    let newReplacement = {
                        type: "serialized",
                        componentType: createComponentOfType,
                        componentIdx: nComponents++,
                        stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                        attributes: {},
                        doenetAttributes: {},
                        state: {},
                        children: [],
                    };
                    if (wrapDoenetAttributes) {
                        newReplacement.doenetAttributes = wrapDoenetAttributes;
                    }
                    serializedReplacements.push(newReplacement);
                }
            } else if (newReplacements > numReplacementsForSource) {
                throw Error(
                    `Something went wrong when creating replacements for ${component.componentIdx} as we ended up with too many replacements`,
                );
            }
        }
    } else {
        // not an array or array entry

        if (stateVarObj.shadowingInstructions?.hasVariableComponentType) {
            // evaluate stateVarObj to make sure createComponentOfType is calculated and up-to-date
            await stateVarObj.value;
        }

        if (!stateVarObj.shadowingInstructions?.createComponentOfType) {
            return {
                serializedReplacements: [],
                propVariablesCopiedByReplacement: [],
                diagnostics,
                nComponents,
            };
        }

        replacementInd++;

        let propVariablesCopied = (propVariablesCopiedByReplacement[
            replacementInd
        ] = []);

        propVariablesCopied.push(varName);

        if (
            stateVarObj.shadowingInstructions.createComponentOfType === "string"
        ) {
            serializedReplacements.push(await stateVarObj.value);
        } else {
            const res = convertUnresolvedAttributesForComponentType({
                attributes: component.attributes,
                componentType:
                    stateVarObj.shadowingInstructions.createComponentOfType,
                componentInfoObjects,
                compositeAttributesObj,
                nComponents,
                stateIdInfo,
            });

            const attributesFromComposite = res.attributes;
            nComponents = res.nComponents;

            const { responseMarks, otherAttributes } = separateResponseMarks(
                attributesFromComposite,
            );
            const valueReference = mayBeValueReference
                ? planValueReference({
                      parentClass,
                      targetComponentType: target.componentType,
                      valueComponentType:
                          stateVarObj.shadowingInstructions
                              .createComponentOfType,
                      fromImplicitProp: Boolean(implicitProp),
                      hasAttributes: Object.keys(otherAttributes).length > 0,
                      allowDrawn: true,
                      componentInfoObjects,
                  })
                : undefined;

            if (valueReference) {
                serializedReplacements.push(
                    serializeValueReference({
                        ...valueReference,
                        referencedVariable: varName,
                        valueComponentType:
                            stateVarObj.shadowingInstructions
                                .createComponentOfType,
                        target,
                        componentIdx: nComponents++,
                        stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                        responseMarks,
                        copiesReferent: copiesReferent({
                            fromImplicitProp: Boolean(implicitProp),
                            targetClass: target.constructor,
                            plan: valueReference,
                        }),
                    }),
                );
            } else if (link) {
                let attributesForReplacement = {};

                if (
                    stateVarObj.shadowingInstructions
                        .addAttributeComponentsShadowingStateVariables
                ) {
                    let classOfComponentToCreate =
                        componentInfoObjects.allComponentClasses[
                            stateVarObj.shadowingInstructions
                                .createComponentOfType
                        ];
                    let attrObj =
                        classOfComponentToCreate.createAttributesObject();

                    for (let attrName in stateVarObj.shadowingInstructions
                        .addAttributeComponentsShadowingStateVariables) {
                        let stateVariableToShadow =
                            stateVarObj.shadowingInstructions
                                .addAttributeComponentsShadowingStateVariables[
                                attrName
                            ].stateVariableToShadow;
                        let attributeComponentType =
                            attrObj[attrName]?.createComponentOfType;

                        if (
                            attributeShadowIsReference(attributeComponentType)
                        ) {
                            attributesForReplacement[attrName] =
                                shadowAttributeReference({
                                    attrName,
                                    attributeComponentType,
                                    target,
                                    stateVariableToShadow,
                                });
                        } else if (attributeComponentType) {
                            let shadowComponent = {
                                type: "serialized",
                                componentType: attributeComponentType,
                                componentIdx: nComponents++,
                                stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                                attributes: {},
                                doenetAttributes: {},
                                state: {},
                                children: [],
                                downstreamDependencies: {
                                    [target.componentIdx]: [
                                        {
                                            compositeIdx:
                                                component.componentIdx,
                                            dependencyType: "referenceShadow",
                                            propVariable: stateVariableToShadow,
                                        },
                                    ],
                                },
                            };

                            attributesForReplacement[attrName] = {
                                component: shadowComponent,
                            };
                        }
                    }
                }

                deleteReplacedAttributes({
                    attributes: attributesForReplacement,
                    attributesFromComposite,
                    componentType:
                        stateVarObj.shadowingInstructions.createComponentOfType,
                    componentInfoObjects,
                });

                Object.assign(
                    attributesForReplacement,
                    attributesFromComposite,
                );

                serializedReplacements.push({
                    type: "serialized",
                    componentType:
                        stateVarObj.shadowingInstructions.createComponentOfType,
                    componentIdx: nComponents++,
                    stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                    attributes: attributesForReplacement,
                    doenetAttributes: {},
                    state: {},
                    children: [],
                    downstreamDependencies: {
                        [target.componentIdx]: [
                            {
                                dependencyType: "referenceShadow",
                                compositeIdx: component.componentIdx,
                                propVariable: varName,
                                additionalStateVariableShadowing:
                                    stateVarObj.shadowingInstructions
                                        .addStateVariablesShadowingStateVariables,
                            },
                        ],
                    },
                });
            } else {
                // no link
                let attributesForReplacement = {};

                if (
                    stateVarObj.shadowingInstructions
                        .addAttributeComponentsShadowingStateVariables
                ) {
                    let classOfComponentToCreate =
                        componentInfoObjects.allComponentClasses[
                            stateVarObj.shadowingInstructions
                                .createComponentOfType
                        ];
                    let attrObj =
                        classOfComponentToCreate.createAttributesObject();

                    let additionalAttributes = {};
                    for (let attrName in stateVarObj.shadowingInstructions
                        .addAttributeComponentsShadowingStateVariables) {
                        if (attrObj[attrName]?.createComponentOfType) {
                            // a copy of a prop holds its value, not the
                            // `fixed` and `fixLocation` of what it is a
                            // prop of
                            if (!CONTEXT_ATTRIBUTES.includes(attrName)) {
                                let vName =
                                    stateVarObj.shadowingInstructions
                                        .addAttributeComponentsShadowingStateVariables[
                                        attrName
                                    ].stateVariableToShadow;
                                let attributeValue =
                                    await target.state[vName].value;
                                if (!target.state[vName].usedDefault) {
                                    additionalAttributes[attrName] = {
                                        type: "unresolved",
                                        name: attrName,
                                        children: [attributeValue.toString()],
                                    };
                                }
                            }
                        }
                    }

                    const res = convertUnresolvedAttributesForComponentType({
                        attributes: additionalAttributes,
                        componentType:
                            stateVarObj.shadowingInstructions
                                .createComponentOfType,
                        componentInfoObjects,
                        nComponents,
                        stateIdInfo,
                    });

                    const attributesFromComponent = res.attributes;
                    nComponents = res.nComponents;

                    if (stateVarObj.shadowingInstructions.attributesToShadow) {
                        for (let attrName of stateVarObj.shadowingInstructions
                            .attributesToShadow) {
                            if (target.attributes[attrName]?.component) {
                                let serializedComponent =
                                    await target.attributes[
                                        attrName
                                    ].component.serialize({
                                        copyAll: true,
                                        copyVariants: true,
                                    });

                                let res = createNewComponentIndices(
                                    [serializedComponent],
                                    nComponents,
                                    stateIdInfo,
                                    undefined,
                                    // pasted from the source, its references keep the
                                    // referents they have there (D1)
                                    { keepReferents: true },
                                );
                                nComponents = res.nComponents;

                                attributesFromComponent[attrName] = {
                                    type: "component",
                                    name: attrName,
                                    component: res.components[0],
                                };
                            } else if (
                                target.attributes[attrName]?.type === "literal"
                            ) {
                                // a literal: copied as its attribute component was
                                attributesFromComponent[attrName] =
                                    copyOfLiteralAttribute(
                                        target.attributes[attrName],
                                        target,
                                    );
                            } else if (
                                target.attributes[attrName]?.primitive !==
                                undefined
                            ) {
                                attributesFromComponent[attrName] = {
                                    type: "primitive",
                                    name: attrName,
                                    primitive: JSON.parse(
                                        JSON.stringify(
                                            target.attributes[attrName]
                                                .primitive,
                                        ),
                                    ),
                                };
                            }
                        }
                    }

                    Object.assign(
                        attributesForReplacement,
                        attributesFromComponent,
                    );
                }

                deleteReplacedAttributes({
                    attributes: attributesForReplacement,
                    attributesFromComposite,
                    componentType:
                        stateVarObj.shadowingInstructions.createComponentOfType,
                    componentInfoObjects,
                });

                Object.assign(
                    attributesForReplacement,
                    attributesFromComposite,
                );

                const primaryEssentialStateVariable =
                    primaryEssentialStateVariableOf({
                        componentType:
                            stateVarObj.shadowingInstructions
                                .createComponentOfType,
                        componentInfoObjects,
                    });

                let serializedComponent = {
                    type: "serialized",
                    componentType:
                        stateVarObj.shadowingInstructions.createComponentOfType,
                    componentIdx: nComponents++,
                    stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                    attributes: attributesForReplacement,
                    doenetAttributes: {},
                    children: [],
                    state: {
                        [primaryEssentialStateVariable]: stateVarValue,
                    },
                };

                serializedReplacements.push(serializedComponent);
            }
        }
    }

    if (implicitProp) {
        for (let repl of serializedReplacements) {
            // A value reference is never marked: the mark would make it
            // shadow the referent's standard variables under its own names
            // (reading `n.value` where it should read `n.math`) and have
            // essential writes to the referent mirrored into it.
            if (repl.componentType === "_ref") {
                continue;
            }
            if (!repl.doenetAttributes) {
                repl.doenetAttributes = {};
            }
            repl.doenetAttributes.fromImplicitProp = true;
            if (repl.downstreamDependencies?.[target.componentIdx]?.[0]) {
                repl.downstreamDependencies[
                    target.componentIdx
                ][0].fromImplicitProp = true;
            }
        }
    }

    // console.log(`serializedReplacements for ${component.componentIdx}`)
    // console.log(JSON.parse(JSON.stringify(serializedReplacements)))
    // console.log(serializedReplacements)

    return {
        serializedReplacements,
        propVariablesCopiedByReplacement,
        diagnostics,
        nComponents,
    };
}

/**
 * A copy is its source's DoenetML pasted (CPY-1), so `type` on a copy of a
 * tag that reads its text as its `type` (`<sort>`, `<shuffle>`,
 * `<sortIndices>`, `<tally>`, `<indexOf>` and the other list index
 * operators) decides how the text written in it is read, as it does on the
 * source (`<sort copy="$s" type="text"/>` sorts `10 3 1` as
 * text, #2414). The source has already read that text as its own `type`
 * (`returnBreakStringsIntoTypeSugarInstruction`), so each component it made
 * from a piece of text (`textPiece`) is given back as the text, and the
 * replacement's sugar is applied again with the copy's `type`.
 *
 * Returns the new `nComponents`.
 */
function retypeTextPieces({
    replacement,
    componentInfoObjects,
    nComponents,
    stateIdInfo,
    diagnostics,
}) {
    if (
        !replacement.children?.some(
            (child) => typeof child?.doenetAttributes?.textPiece === "string",
        )
    ) {
        return nComponents;
    }
    // A piece of text was separated by white space from what is beside it
    // (`groupIntoComponentTypeSeparatedBySpacesOutsideParens`), so it is
    // given back with spaces around it, or it would join a reference next to
    // it: `10 $x 3` would be read as the one text `10$x3`.
    const children = [];
    for (const child of replacement.children) {
        const item =
            typeof child?.doenetAttributes?.textPiece === "string"
                ? ` ${child.doenetAttributes.textPiece} `
                : child;
        const last = children[children.length - 1];
        if (typeof item === "string" && typeof last === "string") {
            children[children.length - 1] = `${last}${item}`;
        } else {
            children.push(item);
        }
    }
    const res = applySugar({
        serializedComponents: [{ ...replacement, children }],
        componentInfoObjects,
        nComponents,
        stateIdInfo,
    });
    replacement.children = res.components[0].children;
    // The sugar makes the components it wraps text in with no `stateId`
    // (`returnBreakStringsIntoTypeSugarInstruction`), so they are given the
    // copy's, as its other replacements are: an id from where a component
    // was made in the build moves with what is made before it, and a
    // reader's change to one would come back on another after a reload, or
    // on none (`copySnapshotOf` holds only components with a `stateId`).
    function giveStateIds(component) {
        if (typeof component !== "object" || component === null) {
            return;
        }
        if (component.stateId === undefined) {
            component.stateId = `${stateIdInfo.prefix}${stateIdInfo.num++}`;
        }
        component.children?.forEach(giveStateIds);
    }
    replacement.children.forEach(giveStateIds);
    diagnostics.push(...res.diagnostics);
    return res.nComponents;
}

/**
 * What `typeChangeStatus` decided, as a string to compare with what it
 * decided before: `undefined` when there was nothing to decide, `"allowed"`,
 * or `"mismatch:"` and the error or warning shown, or, for an info, during
 * which the copy is missing, its code. The message of an info names the
 * source's value (`doenet-i0053`), which can change while the copy stays
 * missing; it
 * replaces the info before it without making the replacements again
 * (`calculateReplacementChanges`, `reportTypeChange`).
 */
function typeChangeKey(typeChange) {
    if (typeChange === undefined) {
        return undefined;
    }
    if (typeChange === null) {
        return "allowed";
    }
    return typeChange.level === "info"
        ? `mismatch:info:${typeChange.diagnostic.code}`
        : `mismatch:${typeChange.level}:${typeChange.diagnostic.message}`;
}

/**
 * Report what is decided now as the `"typeChange"` condition of the copy
 * (`reportConditionDiagnostics`): an info while a value does not convert
 * (`doenet-i0053`) or an index names nothing (`doenet-i0054`,
 * `indexNamesNothing`), nothing once it does or once there is nothing to
 * decide. Each decision replaces the one before, so one info is shown
 * while it lasts, naming the value as it is now, and none after it ends
 * (B33, #2442). Called wherever it is decided again; a path that does not
 * decide it leaves it as it was.
 *
 * An error, or the warning of a reference that names nothing when the
 * document loads, is not reported here: it is decided by what the author
 * wrote (`typeChangeAtLoad`), so it does not come and go, and it is returned
 * with the replacements (`inPlaceOfCopy`).
 */
function reportTypeChange(workspace, typeChange) {
    workspace.conditionDiagnostics = {
        ...workspace.conditionDiagnostics,
        typeChange: typeChange?.level === "info" ? [typeChange.diagnostic] : [],
    };
}

/**
 * Record, for a save to hold (`heldCopySnapshot`), that an unlinked copy was
 * made missing because its index named nothing (`info`, from
 * `indexNamesNothing`), as a value that does not convert is
 * (`heldTypeChange`): a reload makes it missing again, with the info, though
 * its index names something by then.
 */
function recordIndexNamesNothing(workspace, info) {
    if (info) {
        workspace.madeFrom.typeChange = {
            key: typeChangeKey(info),
            diagnostic: info.diagnostic,
        };
    }
}

/**
 * Whether the sources of a copy made nothing of what its reference names:
 * each made no component (`numNonStringReplacementsBySource`), or only the
 * missing tag (`madeBlankBySource`, `missingOfWrittenType`).
 */
function namesNothing(numNonStringReplacementsBySource, madeBlankBySource) {
    return numNonStringReplacementsBySource.every(
        (n, ind) => !(n > 0) || madeBlankBySource[ind],
    );
}

/** The change that shows any replacements `component` withholds. */
function unwithheldChanges(component) {
    return component.replacementsToWithhold > 0
        ? [
              {
                  changeType: "changeReplacementsToWithhold",
                  replacementsToWithhold: 0,
              },
          ]
        : [];
}

/**
 * The type `component` stands for: its own, or, for a value reference
 * (`$x` in a case, `$g[1]` of a group holding `$n.value`), the type it
 * presents its referent's value as (`ValueRef`).
 */
function typeStoodFor(component) {
    return component.componentType === "_ref"
        ? (component.doenetAttributes?.presentedComponentType ?? "_ref")
        : component.componentType;
}

/**
 * Whether a list of type `listType` has the entries the author wrote
 * (`<mathList>1 2</mathList>`), rather than ones the document makes (a
 * `<sequence>`, a `<selectFromSequence>`, or the list form of a `<collect>`
 * or `<sort>`).
 */
function isAuthoredList(listType, { componentInfoObjects }) {
    return (
        componentInfoObjects.allComponentClasses[listType]?.prototype instanceof
            AuthoredValueList && !Object.hasOwn(TAGS_OF_LIST_FORMS, listType)
    );
}

/**
 * Whether the type a list of type `listType` stands for is decided
 * (`typeChangeStatus`): a list the author writes (`isAuthoredList`), a list
 * the document makes, such as a `<sequence>` or `<selectFromSequence>`, or
 * the list form of a tag (`TAGS_OF_LIST_FORMS`). The lists a document makes
 * for itself, such as a `<repeatForSequence>` made into a list inside a
 * `<repeat>` (`_repeatValueList`), are not named by what the author wrote,
 * so they are not decided.
 */
function listIsDecided(listType, { componentInfoObjects }) {
    return (
        componentInfoObjects.allComponentClasses[listType]
            ?.listEntryComponentType !== undefined &&
        (!listType.startsWith("_") ||
            Object.hasOwn(TAGS_OF_LIST_FORMS, listType))
    );
}

/** Whether a `typeChangeValueCheck` is of what a composite holds. */
function watchesContent(typeChangeValueCheck) {
    return (
        typeChangeValueCheck === "content" ||
        typeChangeValueCheck === "contentValue"
    );
}

/** See `typeChangeContentValue`. */
const MAX_VALUES_WATCHED = 4;

/**
 * The components of `content` (`typeChangeContent`) whose value a point,
 * vector, coords or boolean is checked against (`typeChangeRule`), or none
 * when there are more than `MAX_VALUES_WATCHED`.
 */
function valueChecked(content, { componentInfoObjects }) {
    const checked = (content ?? []).filter(
        (x) =>
            x.componentType === "_ref" ||
            (componentInfoObjects.allComponentClasses[x.componentType] &&
                typeChangeRule({
                    writtenType: "point",
                    sourceType: x.componentType,
                    componentInfoObjects,
                }).valueCheck),
    );
    return checked.length > MAX_VALUES_WATCHED ? [] : checked;
}

/**
 * The components a composite stands for as the dependency
 * `allReplacementIdentities` of `needsReplacementsUpdatedWhenStale` sees
 * them: through the composites it holds other than a `<group>`, which is
 * where that dependency stops, with whether each is inactive. When this is
 * unchanged, nothing that dependency watches changed, so an extend updated
 * only because what it is of changed further in (`typeChangeContent`) is
 * left as it is when it is decided the same way.
 */
async function replacementIdentity(
    composite,
    components,
    componentInfoObjects,
) {
    const parts = [];
    async function walk(comp) {
        let replacements = comp.replacements ?? [];
        if (comp.replacementsToWithhold > 0) {
            replacements = replacements.slice(0, -comp.replacementsToWithhold);
        }
        for (const replacement of replacements) {
            if (typeof replacement === "string") {
                parts.push(JSON.stringify(replacement));
                continue;
            }
            const child = components[replacement.componentIdx];
            if (!child) {
                parts.push(`?${replacement.componentIdx}`);
            } else if (
                child.isExpanded &&
                componentInfoObjects.isCompositeComponent({
                    componentType: child.componentType,
                    includeNonStandard: false,
                })
            ) {
                parts.push(`(${child.componentIdx}`);
                await walk(child);
                parts.push(")");
            } else {
                parts.push(
                    `${child.componentIdx}${(await child.stateValues.isInactiveCompositeReplacement) ? "i" : ""}`,
                );
            }
        }
    }
    await walk(composite);
    return parts.join(",");
}

/**
 * For an `extend` or `copy` of what a composite holds
 * (`typeChangeValueCheck` "content"), record what the composite holds as
 * `allReplacementIdentities` sees it (`replacementIdentity`) in
 * `workspace.typeChangeContentIdentity`, and watch it for changes
 * (`watchTypeChangeContent`) when `canWatch`.
 */
async function recordTypeChangeContent({
    component,
    components,
    componentInfoObjects,
    workspace,
    canWatch,
}) {
    if (!watchesContent(await component.stateValues.typeChangeValueCheck)) {
        return;
    }
    const source =
        components[
            (await component.stateValues.extendedComponent)?.componentIdx
        ];
    workspace.typeChangeContentIdentity = source
        ? await replacementIdentity(source, components, componentInfoObjects)
        : undefined;
    await watchTypeChangeContent(component, canWatch);
}

/**
 * Watch what the composite `component` is of holds for changes, which
 * decide again whether the type `component` is written as can be made from
 * it (`typeChangeContent`, `typeChangeContentValue`), when `canWatch`: when
 * all that content is expanded and does not hold `component`, so that
 * nothing it holds is waited for. Otherwise `component` is decided again
 * only when it is updated for another reason.
 */
async function watchTypeChangeContent(component, canWatch) {
    if (
        canWatch &&
        !component.readingTypeChangeValue &&
        (await component.stateValues.link) &&
        watchesContent(await component.stateValues.typeChangeValueCheck)
    ) {
        await readTypeChangeValue(component, async () => {
            await component.stateValues.typeChangeContentValue;
            await component.stateValues.typeChangeContent;
        });
    }
}

/**
 * The value `read` reads for deciding whether the type `component` is
 * written as can be made from what it is of. A value that depends on
 * `component` itself (`<boolean name="B" extend="$g"/>` of a group holding
 * `<math>$B</math>`) expands `component` while it is read, which would
 * decide it, and read the value, again without end: that is not decided
 * (`typeChangeStatus`), and the circular dependency is reported as where it
 * is not checked.
 */
async function readTypeChangeValue(component, read) {
    component.readingTypeChangeValue = true;
    try {
        return await read();
    } finally {
        component.readingTypeChangeValue = false;
    }
}

/**
 * The component `component` is a shadow of, through any chain of shadows,
 * or `component` itself.
 */
function shadowedOriginal(component, components) {
    let original = component;
    while (original.shadows && components[original.shadows.componentIdx]) {
        original = components[original.shadows.componentIdx];
    }
    return original;
}

/**
 * The one component a case, a pick or an iteration (`source`, a `<group>`
 * that `replacementSourceIdentities` stops at) holds, when `component`, an
 * `extend` or `copy` written as a tag, is written as another type that may
 * be made from it (`typeChangeRule`):
 * `<point extend="$cc"/>` while the active case holds one math. The copy is
 * made from that component, as `<point extend="$cc[1]"/>` is, rather than
 * from the group, which, given the type, could only make an empty component
 * of it (`verifyReplacementsMatchSpecifiedType`). Otherwise `undefined`.
 *
 * A `<setup>` and blank strings show nothing. What a group holds is fixed
 * when it is made, so the copy is made again when its source is another
 * group (another case, pick or iteration), as it is made again from the
 * group. A `_copy` is not looked into: what it holds is made again without
 * its source changing, which a copy of its shadow follows and a copy of
 * the component it held would not (a group holding
 * `<point extend="$cc[1]"/>`, extended as a vector).
 */
async function componentStoodFor({
    component,
    source,
    components,
    componentInfoObjects,
}) {
    const writtenType = typeStandingFor(component, { componentInfoObjects });
    if (!writtenType) {
        return undefined;
    }
    let one = source;
    while (one?.componentType === "group") {
        if (!one.isExpanded || one.componentIdx === component.componentIdx) {
            return undefined;
        }
        let replacements = one.replacements ?? [];
        if (one.replacementsToWithhold > 0) {
            replacements = replacements.slice(0, -one.replacementsToWithhold);
        }
        const shown = [];
        for (const replacement of replacements) {
            if (typeof replacement === "string") {
                if (replacement.trim() !== "") {
                    return undefined;
                }
                continue;
            }
            const comp = components[replacement.componentIdx];
            if (!comp) {
                return undefined;
            }
            if (comp.componentType !== "setup") {
                shown.push(comp);
            }
        }
        if (shown.length !== 1) {
            return undefined;
        }
        one = shown[0];
    }
    if (
        one === source ||
        !canStandFor(one.componentType, writtenType, { componentInfoObjects })
    ) {
        return undefined;
    }
    return one;
}

/**
 * The type `component` is written as, when a case, a pick or an iteration
 * holding one component may stand for that component (`componentStoodFor`),
 * otherwise `undefined`.
 */
function typeStandingFor(component, { componentInfoObjects }) {
    const writtenValue =
        component.attributes._createComponentOfType?.primitive?.value;
    if (
        !writtenValue ||
        !component.attributes._copyInChildren?.primitive?.value
    ) {
        return undefined;
    }
    const writtenType =
        componentInfoObjects.componentTypeLowerCaseMapping[
            writtenValue.toLowerCase()
        ];
    const writtenClass = componentInfoObjects.allComponentClasses[writtenType];
    if (
        !writtenClass ||
        writtenClass.listEntryComponentType !== undefined ||
        writtenType === "group"
    ) {
        return undefined;
    }
    return writtenType;
}

/**
 * Whether a component of type `oneType`, the one component a group holds,
 * is made into `writtenType` in place of the group (`componentStoodFor`).
 */
function canStandFor(oneType, writtenType, { componentInfoObjects }) {
    const oneClass = componentInfoObjects.allComponentClasses[oneType];
    return Boolean(
        oneClass &&
        oneClass.listEntryComponentType === undefined &&
        !componentInfoObjects.isCompositeComponent({
            componentType: oneType,
            includeNonStandard: true,
        }) &&
        !replacementIsOfType(oneType, writtenType) &&
        typeChangeRule({
            writtenType,
            sourceType: oneType,
            componentInfoObjects,
        }).allowed,
    );
}

/**
 * `componentStoodFor` of the serialized `<group>` a case of a
 * `<conditionalContent>` makes (`heldCaseSource`): the one component it
 * holds, through any groups in it, as the components made from it would
 * have, or `undefined`.
 */
function serializedStoodFor({ component, group, componentInfoObjects }) {
    const writtenType = typeStandingFor(component, { componentInfoObjects });
    if (!writtenType) {
        return undefined;
    }
    let one = group;
    while (one?.componentType === "group") {
        const shown = [];
        for (const child of one.children ?? []) {
            if (typeof child === "string") {
                if (child.trim() !== "") {
                    return undefined;
                }
                continue;
            }
            if (child.componentType !== "setup") {
                shown.push(child);
            }
        }
        if (shown.length !== 1) {
            return undefined;
        }
        one = shown[0];
    }
    if (
        one === group ||
        !canStandFor(one.componentType, writtenType, { componentInfoObjects })
    ) {
        return undefined;
    }
    return one;
}

/**
 * The `<conditionalContent>` an unlinked copy `component` copies the
 * replacements of (`$cc`, not a prop or index of it), whose case it is made
 * from: the case active when it is made, or, on load, the case it was made
 * from before (`heldCaseSource`). Not one that shadows another, whose
 * replacements' ids name the case of what it shadows
 * (`stateIdSegmentForCopiesOfReplacements`). Not for a copy written as a
 * `<conditionalContent>` (`<conditionalContent copy="$cc"/>`), which is a new
 * one, deciding its own case from what its DoenetML refers to (#2476), on a
 * reload as before one.
 */
async function caseSourceOf({ component, components, componentInfoObjects }) {
    if ((await component.stateValues.link) !== false) {
        return undefined;
    }
    const writtenValue =
        component.attributes._createComponentOfType?.primitive?.value;
    const writtenType =
        writtenValue &&
        componentInfoObjects.componentTypeLowerCaseMapping[
            writtenValue.toLowerCase()
        ];
    if (
        writtenType &&
        componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: writtenType,
            baseComponentType: "conditionalContent",
        })
    ) {
        return undefined;
    }
    const extended = await component.stateValues.extendedComponent;
    const source = components[extended?.componentIdx];
    if (
        source?.componentType !== "conditionalContent" ||
        source.replacementsWorkspace?.stateIdSegmentOfShadowed !== undefined ||
        (await component.stateValues.effectivePropNameBySource)?.[0] ||
        (await component.stateValues.unresolvedPath)?.length > 0 ||
        (await component.stateValues.replacementSourceIdentities)?.length > 1
    ) {
        return undefined;
    }
    return source;
}

/**
 * When an unlinked copy of the `<conditionalContent>` `caseSource` was made
 * from another case than the one active now (`heldMadeFrom.caseIndex`, held
 * by a save or kept while the copy was deleted, `heldCopySnapshot`), what
 * to make it from again, so it shows what it showed: `{ caseIndex, group,
 * segment }`, the serialized `<group>` that case makes, as the
 * `<conditionalContent>` makes it (`getReplacements`), and the segment of
 * the `stateId`s of its copy (`stateIdSegmentForCopyOf`), which are then
 * those the copy had, so its snapshot applies. `group` is `null` when the
 * copy was made while no case was active, and made nothing. `undefined`
 * when it is made from the active case.
 */
async function heldCaseSource({ caseSource, components, heldMadeFrom }) {
    const caseIndex = heldMadeFrom?.caseIndex;
    if (
        caseIndex === undefined ||
        caseIndex === caseSource.replacementsWorkspace.previousSelectedIndex
    ) {
        return undefined;
    }
    if (caseIndex === null) {
        return { caseIndex, group: null };
    }
    const caseChildren = await caseSource.stateValues.caseChildren;
    if (!Number.isInteger(caseIndex) || !caseChildren[caseIndex]) {
        return undefined;
    }
    const group = (
        await caseSource.constructor.getReplacements(
            caseSource,
            components,
            caseIndex,
        )
    ).replacements[0];
    const ownSegment =
        (await caseSource.stateValues.numCases) === 1
            ? ""
            : `case${caseIndex}|`;
    return {
        caseIndex,
        group,
        segment: (await stateIdSegmentForCopyOf(caseSource)) + ownSegment,
    };
}

/**
 * Where the unlinked copy `component` was made from, when it is made from
 * one component `source` named in a case of a `<conditionalContent>` (`$cc.p`,
 * `$cc.p.a`, or a name inside a `<group>` in the case), for a save to hold
 * (`heldCopySnapshot`): the `stateId` of `source`, which comes from the
 * document and is the same in the DoenetML of the case
 * (`ConditionalContent.getReplacements`); the `stateId` and case of each
 * `<conditionalContent>` it is in, outermost first; and the segment of the
 * `stateId`s of what the copy made (`stateIdSegmentForCopyOf`), which names
 * those cases. `undefined` when `source` is in no case, or a case of one
 * that shadows another, whose replacements' ids name the case of what it
 * shadows (`stateIdSegmentForCopiesOfReplacements`).
 */
async function sourceCaseOf({ component, source, segment }) {
    if (
        typeof source?.stateId !== "string" ||
        (await component.stateValues.replacementSourceIdentities)?.length !==
            1 ||
        (await component.stateValues.effectivePropNameBySource)?.[0]
    ) {
        return undefined;
    }
    const cases = [];
    for (
        let composite = source.replacementOf;
        composite;
        composite = composite.replacementOf
    ) {
        if (composite.componentType !== "conditionalContent") {
            continue;
        }
        const caseIndex =
            composite.replacementsWorkspace?.previousSelectedIndex;
        if (
            composite.replacementsWorkspace?.stateIdSegmentOfShadowed !==
                undefined ||
            typeof composite.stateId !== "string" ||
            !Number.isInteger(caseIndex)
        ) {
            return undefined;
        }
        cases.unshift({ stateId: composite.stateId, caseIndex });
    }
    if (cases.length === 0) {
        return undefined;
    }
    return { stateId: source.stateId, cases, segment };
}

/**
 * When the unlinked copy `component` was made from a component named in a
 * case of a `<conditionalContent>` (`heldMadeFrom.sourceCase`, held by a save
 * or kept while the copy was deleted, `sourceCaseOf`), and one of those
 * `<conditionalContent>`s has another case active now, what to make it from
 * again, so it shows what it showed (SAVE-1): `{ group, segment, sourceCase
 * }`, the serialized component, as it is in the DoenetML of the case it was
 * made from (`ConditionalContent.getReplacements`), found by its `stateId`,
 * and the segment of the `stateId`s of its copy, which are then those the copy
 * had, so its snapshot and what the reader did in it apply. A name in only
 * some cases is thus made from the case it was made from, though the
 * reference names nothing now. `undefined` when it is made from what its
 * reference names now: when each case it was made through is active, or
 * what it was made from cannot be found again (one made by a composite in
 * the case, such as a `<repeat>`, is not in its DoenetML).
 */
async function heldSourceInCase({ component, components, heldMadeFrom }) {
    const sourceCase = heldMadeFrom?.sourceCase;
    if (!sourceCase) {
        return undefined;
    }
    for (const { stateId, caseIndex } of sourceCase.cases) {
        const conditionalContent =
            component.coreFunctions.componentOfStateId?.(stateId);
        if (conditionalContent?.componentType !== "conditionalContent") {
            return undefined;
        }
        const active =
            conditionalContent.replacementsWorkspace?.previousSelectedIndex ??
            (await conditionalContent.stateValues.selectedIndex);
        if (active === caseIndex) {
            continue;
        }
        const caseChildren = await conditionalContent.stateValues.caseChildren;
        if (!Number.isInteger(caseIndex) || !caseChildren[caseIndex]) {
            return undefined;
        }
        const caseGroup = (
            await conditionalContent.constructor.getReplacements(
                conditionalContent,
                components,
                caseIndex,
            )
        ).replacements[0];
        const group = serializedWithStateId(caseGroup, sourceCase.stateId);
        return group
            ? { group, segment: sourceCase.segment, sourceCase }
            : undefined;
    }
    return undefined;
}

/**
 * The serialized component with `stateId` in `serialized`, or `undefined`.
 */
function serializedWithStateId(serialized, stateId) {
    if (typeof serialized !== "object" || serialized === null) {
        return undefined;
    }
    if (serialized.stateId === stateId) {
        return serialized;
    }
    for (const child of serialized.children ?? []) {
        const found = serializedWithStateId(child, stateId);
        if (found) {
            return found;
        }
    }
    for (const attribute of Object.values(serialized.attributes ?? {})) {
        const found = serializedWithStateId(attribute?.component, stateId);
        if (found) {
            return found;
        }
    }
    return undefined;
}

/**
 * What `typeChangeStatus` decided for an unlinked copy made again
 * (`typeChange`), given what was decided when it was made
 * (`heldMadeFrom.typeChange`, `heldCopySnapshot`). A decision made from a
 * value at run time (allowed, or an info) is the one made before, so the
 * copy is made as it was: one made from a math while its value was a
 * tuple, which is not one now, is still made from it, and one made while
 * it was not is still missing, as is one made while its index named nothing
 * (`doenet-i0054`, `recordIndexNamesNothing`). What a composite holds is
 * decided when the document loads (D36), so only a value or an index
 * decides it here. A
 * decision that follows from what the author wrote (an error, a warning,
 * or nothing to decide when it was made) is the same on every load, and is
 * kept.
 */
function heldTypeChange(typeChange, heldMadeFrom) {
    const held = heldMadeFrom?.typeChange;
    if (
        held === undefined ||
        typeChange?.level === "error" ||
        typeChange?.level === "warning"
    ) {
        return typeChange;
    }
    if (held.key === "allowed") {
        return null;
    }
    if (held.key?.startsWith("mismatch:info") && held.diagnostic) {
        return { level: "info", diagnostic: held.diagnostic };
    }
    return typeChange;
}

/**
 * The error found when the document loaded for the reference written as a
 * tag `component` (D36, `doenetAttributes.typeChangeAtLoad`, set by
 * `utils/dast/typeChangeAtLoad.ts`), as a `typeChangeStatus` mismatch, or
 * `undefined` when there is none. It names the tag as written: for the copy
 * that fills a list (`forList`), the list's. It names the reference as
 * written (`workspace.referenceAsWritten`, `$r[$k]`), where that is known,
 * since it is decided by what is written, not by the value of an index.
 */
async function typeChangeAtLoadError({
    component,
    components,
    componentInfoObjects,
    workspace,
}) {
    const mark = component.doenetAttributes?.typeChangeAtLoad;
    if (!mark || mark === "allowed") {
        return undefined;
    }
    const forList = component.doenetAttributes.forList;
    // The list the copy fills is its parent; `forList` is the index of the
    // list as written, which in an iteration of a repeat is in the template,
    // not made.
    const writtenValue =
        forList !== undefined
            ? (components[forList] ?? components[component.parentIdx])
                  ?.componentType
            : component.attributes._createComponentOfType?.primitive?.value;
    const writtenType =
        writtenValue &&
        (componentInfoObjects.componentTypeLowerCaseMapping[
            writtenValue.toLowerCase()
        ] ??
            writtenValue);
    const extended = await component.stateValues.extendedComponent;
    const source =
        workspace?.referenceAsWritten ??
        referenceAsWritten(
            await component.stateValues.originalPath,
            components[extended?.componentIdx],
        );
    // The same diagnostic the document reported when it loaded
    // (`reportTypeChangesAtLoad`), which is kept once.
    return typeChangeAtLoadDiagnostic({ mark, writtenType, source });
}

/**
 * The warning for a reference written as a tag, scalar or list, whose
 * property none of its sources has (`$t.nothing`, or `$g.nothing` of a
 * `<group>` holding a `<text>`): the tag is missing, with the warning the
 * same reference written bare gives (D37, #2434). `undefined` otherwise, as
 * while a composite has made nothing to look in, or for a name a composite
 * does not hold now.
 */
async function missingPropertyError({
    component,
    components,
    componentInfoObjects,
}) {
    if (component.readingTypeChangeValue) {
        return undefined;
    }
    const isList = component.doenetAttributes?.forList !== undefined;
    if (!isList) {
        const writtenValue =
            component.attributes._createComponentOfType?.primitive?.value;
        const writtenType =
            writtenValue &&
            componentInfoObjects.componentTypeLowerCaseMapping[
                writtenValue.toLowerCase()
            ];
        const writtenClass =
            componentInfoObjects.allComponentClasses[writtenType];
        if (
            !component.attributes._copyInChildren?.primitive?.value ||
            !writtenClass ||
            writtenClass.listEntryComponentType !== undefined ||
            writtenType === "group"
        ) {
            return undefined;
        }
    }
    const extendedComponent = await component.stateValues.extendedComponent;
    const sourceComponent = components[extendedComponent?.componentIdx];
    if (!sourceComponent) {
        return undefined;
    }
    const propNames = await component.stateValues.effectivePropNameBySource;
    if (
        !(propNames?.length > 0) ||
        !propNames.every((name) => name === "__prop_name_not_found")
    ) {
        return undefined;
    }
    // The property, not an index after it (`$p.styleDescription[1]`,
    // `doenet-w0100`), is what is missing, as for the bare reference
    // (`reportMissingProperty`).
    const propName = (await component.stateValues.unresolvedPath)?.[0]?.name;
    if (
        propName &&
        typeHasProperty({
            componentType: sourceComponent.componentType,
            propName,
            componentInfoObjects,
        })
    ) {
        return undefined;
    }
    if (
        componentInfoObjects.isCompositeComponent({
            componentType: sourceComponent.componentType,
        }) &&
        !component.doenetAttributes?.pathStartsWithProperty
    ) {
        // What a composite holds now need not have a name it can hold
        // (`$cc.c` of a case not active), and an index into what it made
        // names nothing now (`indexNamesNothing`). Only a property, which
        // no component of the document is named (`typeChangeAtLoad.ts`),
        // is an error.
        return undefined;
    }
    return {
        level: "warning",
        diagnostic: codedDiagnostic({
            type: "warning",
            code: "doenet-w0104",
            args: {
                reference: referenceAsWritten(
                    await component.stateValues.originalPath,
                    sourceComponent,
                ),
            },
        }),
    };
}

/**
 * Report, as the `"missingProperty"` condition of the copy `component`
 * (`reportConditionDiagnostics`), a reference not written as a tag to a
 * property that what it names does not have (`$n.nonexistent`, `$$f.x(2)`):
 * `doenet-w0104`, as it is a mistake in what the author wrote (DIAG-2,
 * #2434). It is the property the referent's type lacks, not one with no value
 * now: `$P.z` of a point in two dimensions stays silent (VAL-5). What follows
 * the referent is first looked up as a name, so it is a property only if no
 * component of the document has that name (`pathStartsWithProperty`,
 * `typeChangeAtLoad.ts`): `$sec.t` of a `t` written elsewhere, or `$cc.c` of a
 * name the case active now does not hold, is not reported here. For a
 * composite, it is reported when none of what it holds now has it. A
 * reference written as a tag reports it with its missing tag instead
 * (`missingPropertyError`).
 */
async function reportMissingProperty({
    component,
    components,
    componentInfoObjects,
    workspace,
}) {
    if (!workspace) {
        return;
    }
    let diagnostics = [];
    const isTag =
        component.attributes._createComponentOfType?.primitive?.value !==
            undefined || component.doenetAttributes?.forList !== undefined;
    const extendedComponent = isTag
        ? undefined
        : await component.stateValues.extendedComponent;
    const sourceComponent = components[extendedComponent?.componentIdx];
    const propName = (await component.stateValues.unresolvedPath)?.[0]?.name;
    if (sourceComponent && propName) {
        const propNames = await component.stateValues.effectivePropNameBySource;
        const sources =
            (await component.stateValues.replacementSourceIdentities) ?? [];
        if (
            propNames?.length > 0 &&
            propNames.every((name) => name === "__prop_name_not_found") &&
            // a name of the document is looked up as a name first, so it is
            // not a property (`$sec.t` of a `t` written elsewhere)
            component.doenetAttributes?.pathStartsWithProperty &&
            // the property, not an index after it (`$n.value[1]`,
            // `doenet-w0100`), is what is missing
            !sources.some(
                (source) =>
                    typeof source === "object" &&
                    typeHasProperty({
                        componentType: source.componentType,
                        propName,
                        componentInfoObjects,
                    }),
            )
        ) {
            diagnostics = [
                codedDiagnostic({
                    type: "warning",
                    code: "doenet-w0104",
                    args: {
                        // as written, `$$` and all (`createReplacementsFromSources`)
                        reference:
                            workspace.referenceAsWritten ??
                            referenceAsWritten(
                                await component.stateValues.originalPath,
                                sourceComponent,
                            ),
                    },
                }),
            ];
        }
    }
    workspace.conditionDiagnostics = {
        ...workspace.conditionDiagnostics,
        missingProperty: diagnostics,
    };
}

/**
 * Whether a component of type `componentType` has the public property
 * `propName`, matched as a reference matches it (without regard to case,
 * through aliases and array entries).
 */
function typeHasProperty({ componentType, propName, componentInfoObjects }) {
    const componentClass =
        componentInfoObjects.allComponentClasses[componentType];
    if (!componentClass) {
        return false;
    }
    const [mapped] = publicCaseInsensitiveAliasSubstitutions({
        stateVariables: [propName],
        componentClass,
        componentInfoObjects,
    });
    return mapped !== undefined && !mapped.startsWith("__not_public_");
}

/**
 * What is in place of the copy `component` for the mismatch `typeChange`
 * decided by what the author wrote (`typeChangeAtLoadError`,
 * `missingPropertyError`): an `_error` for an error, and for a warning (a
 * reference that names nothing) the missing tag (`missingOfWrittenType`,
 * D37), or nothing for the copy that fills a list (`forList`), whose list
 * then has no entries from it, and for a copy not written as a tag.
 * `{ replacements, nComponents }`.
 */
function inPlaceOfCopy({
    component,
    componentInfoObjects,
    compositeAttributesObj,
    typeChange,
    stateIdInfo,
    nComponents,
}) {
    if (typeChange.level !== "warning") {
        return {
            replacements: errorInPlaceOfCopy({
                component,
                componentInfoObjects,
                diagnostic: typeChange.diagnostic,
                stateIdInfo,
                nComponents: nComponents++,
            }),
            nComponents,
        };
    }
    if (
        component.doenetAttributes?.forList !== undefined ||
        !component.attributes._createComponentOfType?.primitive?.value
    ) {
        return { replacements: [], nComponents };
    }
    const missing = missingOfWrittenType({
        component,
        componentInfoObjects,
        compositeAttributesObj:
            compositeAttributesObj ??
            component.constructor.createAttributesObject(),
        nComponents,
        stateIdInfo,
    });
    addAttributesToSingleReplacement(
        missing.replacements,
        component,
        componentInfoObjects,
    );
    return missing;
}

/**
 * Whether the copy `component` is a bare reference (not written as a tag,
 * with no type it must make) to one thing (D37, rule 1): it has no referent,
 * it has an index (`$s[2]`), or it names a component, or a property of one,
 * that is not a collection named as a whole. Such a reference that makes
 * nothing is a blank (`missingReplacement`). A reference to a collection as
 * a whole, a composite or a list (`$r` or `$r.y` of a `<repeat>`, `$g` of a
 * `<group>`), gives its members, possibly none. A parent that needs every
 * composite to make something (`compositesMustHaveAReplacement`, a
 * `<math>`) gets its blank of the type it needs instead
 * (`verifyReplacementsMatchSpecifiedType`). With `withheld`, what it names
 * is withheld, as in a case that is not active, so any name after the
 * first is one thing.
 */
async function isBareReferenceToOneThing(
    component,
    components,
    { withheld = false } = {},
) {
    if (
        component.componentType !== "_copy" ||
        component.attributes._createComponentOfType?.primitive ||
        component.sharedParameters.compositesMustHaveAReplacement ||
        component.doenetAttributes?.forList !== undefined
    ) {
        return false;
    }
    if (component.doenetAttributes?.noReferent) {
        return true;
    }
    const extended = await component.stateValues.extendedComponent;
    const originalPath = await component.stateValues.originalPath;
    if (!extended) {
        // An index that names nothing now, as one below 1 (`$r[$i]` while
        // `i` is 0), leaves no referent: what it names is one thing.
        return Boolean(originalPath?.some((part) => part.index.length > 0));
    }
    if (extended.componentType === "setup") {
        return false;
    }
    const unresolvedPath = await component.stateValues.unresolvedPath;
    if (originalPath?.some((part) => part.index.length > 0)) {
        return true;
    }
    if (withheld && originalPath?.length > 1) {
        // A name in a branch that is not active (`$cc.x`), whatever it
        // names, as it is decided before the branch is made
        return true;
    }
    // A name, or a property of what it names: one thing, unless it names a
    // collection as a whole, a composite or a list, whose property is one
    // of each of its members (`$r.y` of a `<repeat>`), possibly none. A
    // name after it (`$cc.x` of a name in a case, `pathStartsWithProperty`
    // unset) is one thing.
    if (
        unresolvedPath?.length > 0 &&
        !component.doenetAttributes?.pathStartsWithProperty
    ) {
        return true;
    }
    const componentInfoObjects = component.componentInfoObjects;
    if (
        componentInfoObjects.isCompositeComponent({
            componentType: extended.componentType,
        }) ||
        componentInfoObjects.allComponentClasses[extended.componentType]
            ?.listEntryComponentType !== undefined
    ) {
        return false;
    }
    // A property that is an array, such as `$ci.selectedValues` or
    // `$f.minima`, is a list: its members, possibly none. So is an entry of
    // an array that spans entries, such as `$f.minimumValues`, unlike one
    // that is one entry, such as `$P.x` or `$f.minimumValue1`.
    if (unresolvedPath?.length > 0) {
        const propName = (
            await component.stateValues.effectivePropNameBySource
        )?.[0];
        const stateVarObj =
            propName && components[extended.componentIdx]?.state[propName];
        if (
            stateVarObj?.isArray ||
            (stateVarObj?.isArrayEntry &&
                stateVarObj.numDimensions >
                    (stateVarObj.wrappingComponents?.length ?? 0))
        ) {
            return false;
        }
    }
    return true;
}

/**
 * Make the changes `result` that leave the bare reference to one thing
 * `component` (`isBareReferenceToOneThing`) showing no component leave it
 * showing a blank instead (D37), whatever path decided them: an index that
 * comes to name nothing at run time (`$r[3]` once `r` has two iterations,
 * `$m[2]` once `m` is a scalar). The copy then names no source, so it is
 * made from its source again once that makes something.
 */
async function blankInPlaceOfNothing({
    component,
    components,
    workspace,
    result,
}) {
    if (
        component.componentType !== "_copy" ||
        (await component.stateValues.link) === false
    ) {
        return;
    }
    // What the copy shows once `result` is applied: whether each of its
    // top-level replacements is a component, and how many it withholds.
    const isComponent = component.replacements.map(
        (x) => typeof x === "object",
    );
    let withhold = component.replacementsToWithhold ?? 0;
    for (const change of result.replacementChanges ?? []) {
        if (change.changeType === "add" && change.changeTopLevelReplacements) {
            isComponent.splice(
                change.firstReplacementInd,
                change.numberReplacementsToReplace ?? 0,
                ...change.serializedReplacements.map(
                    (x) => typeof x === "object",
                ),
            );
        } else if (
            change.changeType === "delete" &&
            change.changeTopLevelReplacements
        ) {
            isComponent.splice(
                change.firstReplacementInd,
                change.numberReplacementsToDelete,
            );
        } else if (change.changeType === "changeReplacementsToWithhold") {
            withhold = change.replacementsToWithhold;
        }
    }
    const shown = isComponent.slice(0, isComponent.length - withhold);
    const oneThing = await isBareReferenceToOneThing(component, components);
    const changesTopLevel = (result.replacementChanges ?? []).some(
        (change) =>
            change.changeTopLevelReplacements &&
            (change.changeType === "add" || change.changeType === "delete"),
    );
    if (
        !oneThing &&
        !changesTopLevel &&
        component.replacements.length > 0 &&
        component.replacements.every((x) => x.componentType === "_missing")
    ) {
        // The blank it showed while it named nothing, now that it names
        // what shows nothing (a `<setup>`), or a collection
        result.replacementChanges = [
            ...(result.replacementChanges ?? []),
            {
                changeType: "delete",
                changeTopLevelReplacements: true,
                firstReplacementInd: 0,
                numberReplacementsToDelete: component.replacements.length,
            },
        ];
        workspace.numReplacementsBySource = [];
        workspace.numNonStringReplacementsBySource = [];
        return;
    }
    if (shown.some(Boolean) || !oneThing) {
        return;
    }
    const stateIdInfo = {
        prefix: `${component.stateId}|`,
        num: workspace.replacementsCreated,
    };
    const missing = missingReplacement({
        nComponents: result.nComponents++,
        stateIdInfo,
    });
    workspace.replacementsCreated = stateIdInfo.num;
    result.replacementChanges = [
        ...(result.replacementChanges ?? []),
        ...(withhold > 0
            ? [
                  {
                      changeType: "changeReplacementsToWithhold",
                      replacementsToWithhold: 0,
                  },
              ]
            : []),
        {
            changeType: "add",
            changeTopLevelReplacements: true,
            firstReplacementInd: 0,
            numberReplacementsToReplace: isComponent.length,
            serializedReplacements: [missing],
        },
    ];
    workspace.numReplacementsBySource = [1];
    workspace.numNonStringReplacementsBySource = [1];
    workspace.sourceIndices = [];
    workspace.propVariablesCopiedBySource = [];
    workspace.sourceContainsCopyBySource = [];
}

/**
 * The changes that make a `_missing` (`missingReplacement`) the one shown
 * replacement of the bare reference to one thing `component` while what it
 * names is withheld, as in a case that is not active (`$cc.x`, D37), and
 * the workspace that goes with it: it names no source then, so it is made
 * from its source again once the case is active. With `keepShown`, no
 * change when it already shows that blank. `{ replacementChanges,
 * nComponents }`.
 */
function missingInPlaceOfReplacements({
    component,
    workspace,
    stateIdInfo,
    nComponents,
    keepShown = false,
}) {
    workspace.sourceIndices = [];
    workspace.propVariablesCopiedBySource = [];
    workspace.sourceContainsCopyBySource = [];
    if (
        keepShown &&
        component.replacements.length === 1 &&
        component.replacements[0].componentType === "_missing" &&
        !(component.replacementsToWithhold > 0)
    ) {
        return { replacementChanges: [], nComponents };
    }
    workspace.numReplacementsBySource = [1];
    workspace.numNonStringReplacementsBySource = [1];
    const missing = missingReplacement({
        nComponents: nComponents++,
        stateIdInfo,
    });
    workspace.replacementsCreated = stateIdInfo.num;
    return {
        replacementChanges: [
            ...unwithheldChanges(component),
            {
                changeType: "add",
                changeTopLevelReplacements: true,
                firstReplacementInd: 0,
                numberReplacementsToReplace: component.replacements.length,
                serializedReplacements: [missing],
            },
        ],
        nComponents,
    };
}

/**
 * Make the replacements of the copy `component`, written as a tag, the
 * missing tag (`missingOfWrittenType`) when what it names is itself missing
 * (`BaseComponent.isMissing`): a property of a missing component is missing
 * (D37), so `<number extend="$n.value"/>` of a missing `n` is missing, not a
 * `<number>` holding `NaN`. `result` holds the replacements a copy is first
 * made with (`replacements`), or the changes it makes to them
 * (`replacementChanges`), which this replaces with one change to the
 * missing tag unless it is missing already. A copy of a component, not of
 * a property of it, is made missing already, as it serializes the source's
 * `doenetAttributes`, and is left without the children it adds. A copy of a
 * `_missing` (a missing `<group>`) is missing too. When the source is there again, it is a new
 * component, and the copy is made from it.
 */
async function missingSourceInPlace({
    component,
    components,
    componentInfoObjects,
    workspace,
    result,
}) {
    if (
        component.componentType !== "_copy" ||
        !component.attributes._copyInChildren?.primitive?.value ||
        !component.attributes._createComponentOfType?.primitive?.value ||
        component.doenetAttributes?.forList !== undefined
    ) {
        return;
    }
    const extended = await component.stateValues.extendedComponent;
    const source = components[extended?.componentIdx];
    if (!source?.isMissing && source?.componentType !== "_missing") {
        return;
    }
    const stateIdInfo = {
        prefix: `${component.stateId}|`,
        num: workspace.replacementsCreated,
    };
    if (result.replacements) {
        if (
            result.replacements.length > 0 &&
            result.replacements.every(
                (x) =>
                    x.doenetAttributes?.missing ||
                    x.componentType === "_missing",
            )
        ) {
            // A missing tag holds none of the children it adds
            // (`addChildrenFromComposite`), which are not made while it is
            // missing.
            for (const replacement of result.replacements) {
                replacement.children = [];
            }
            return;
        }
    } else if (
        result.replacementChanges?.length > 0 &&
        result.replacementChanges.every(
            (change) =>
                change.changeType !== "add" ||
                change.serializedReplacements.every(
                    (x) =>
                        x.doenetAttributes?.missing ||
                        x.componentType === "_missing",
                ),
        )
    ) {
        for (const change of result.replacementChanges) {
            for (const replacement of change.serializedReplacements ?? []) {
                replacement.children = [];
            }
        }
        return;
    } else if (
        !result.replacementChanges?.length &&
        component.replacements.length > 0 &&
        component.replacements.every(
            (x) => x.isMissing || x.componentType === "_missing",
        )
    ) {
        return;
    }
    const missing = missingOfWrittenType({
        component,
        componentInfoObjects,
        compositeAttributesObj: component.constructor.createAttributesObject(),
        nComponents: result.nComponents,
        stateIdInfo,
    });
    addAttributesToSingleReplacement(
        missing.replacements,
        component,
        componentInfoObjects,
    );
    result.nComponents = missing.nComponents;
    workspace.replacementsCreated = stateIdInfo.num;
    workspace.numReplacementsBySource = [missing.replacements.length];
    workspace.numNonStringReplacementsBySource = [missing.replacements.length];
    workspace.propVariablesCopiedBySource = [];
    // It names no source then, so it is made from its source again once the
    // source is there.
    workspace.sourceIndices = [];
    workspace.sourceContainsCopyBySource = [];
    if (result.replacements) {
        result.replacements = missing.replacements;
        return;
    }
    result.replacementChanges = [
        ...unwithheldChanges(component),
        {
            changeType: "add",
            changeTopLevelReplacements: true,
            firstReplacementInd: 0,
            numberReplacementsToReplace: component.replacements.length,
            serializedReplacements: missing.replacements,
        },
    ];
}

/** A `_missing` (`Missing.js`), as the one replacement of a copy. */
function missingReplacement({ nComponents, stateIdInfo }) {
    return {
        type: "serialized",
        componentType: "_missing",
        componentIdx: nComponents,
        stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
        attributes: {},
        doenetAttributes: {},
        state: {},
        children: [],
    };
}

/**
 * The `_error` shown in place of the copy `component` for `diagnostic`, as
 * its one replacement, with the index `componentIdx`.
 */
function errorInPlaceOfCopy({
    component,
    componentInfoObjects,
    diagnostic,
    stateIdInfo,
    nComponents: componentIdx,
}) {
    const replacements = [
        {
            type: "serialized",
            componentType: "_error",
            componentIdx,
            stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
            state: errorComponentState(diagnostic.message, diagnostic),
            attributes: {},
            // Not given the type the copy is written as
            // (`verifyReplacementsMatchSpecifiedType`)
            doenetAttributes: { inPlaceOfExtend: true },
            children: [],
        },
    ];
    addAttributesToSingleReplacement(
        replacements,
        component,
        componentInfoObjects,
    );
    return replacements;
}

/**
 * A missing `T` (D37, `BaseComponent.isMissing`), for the reference
 * `component` written as the tag `T`: what it is while its source is missing,
 * whatever it adds. That is while it names nothing (a name, a property, or an
 * index that names nothing now, `doenet-i0054`), while the value it is made
 * from does not convert (`doenet-i0053`), and while the composite it is made
 * from holds nothing (`doenet-i0055`). It is a `T` with the tag's own
 * attributes, so `hide` still hides it, but without its children: it is
 * drawn as a blank, and the value it holds, `<T/>`'s, never equals anything.
 * A composite `T`, such as a `<group>`, is a `_missing` instead. It is made
 * from its source again, with its children, once the source is there.
 */
function missingOfWrittenType({
    component,
    componentInfoObjects,
    compositeAttributesObj,
    nComponents,
    stateIdInfo,
}) {
    const componentType =
        componentInfoObjects.componentTypeLowerCaseMapping[
            component.attributes._createComponentOfType.primitive.value.toLowerCase()
        ];

    if (componentInfoObjects.isCompositeComponent({ componentType })) {
        // A composite, such as a `<group>`, has nothing of its type to be
        // missing as (`convertNormalizedDast.ts`).
        return {
            replacements: [
                missingReplacement({
                    nComponents: nComponents++,
                    stateIdInfo,
                }),
            ],
            nComponents,
        };
    }

    const res = convertUnresolvedAttributesForComponentType({
        attributes: component.attributes,
        componentType,
        componentInfoObjects,
        compositeAttributesObj,
        nComponents,
        stateIdInfo,
    });
    nComponents = res.nComponents;

    return {
        replacements: [
            {
                type: "serialized",
                componentType,
                componentIdx: nComponents++,
                stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                attributes: res.attributes,
                doenetAttributes: { missing: true },
                state: {},
                children: [],
            },
        ],
        nComponents,
    };
}

/**
 * The info for a reference written as a scalar tag whose index names
 * nothing now (`<math extend="$r[$i]"/>` past the iterations of `r`,
 * `doenet-i0054`), or that names a composite holding nothing now
 * (`<math extend="$cc"/>` while no case of `cc` is true, `doenet-i0055`),
 * which is then missing (`missingOfWrittenType`, D37) until it names
 * something again: `{ level: "info", diagnostic }`, as `typeChangeStatus`
 * gives, or `undefined` when `component` is not such a reference.
 */
async function indexNamesNothing({
    component,
    componentInfoObjects,
    workspace,
}) {
    const writtenValue =
        component.attributes._createComponentOfType?.primitive?.value;
    if (
        !writtenValue ||
        !component.attributes._copyInChildren?.primitive?.value
    ) {
        return undefined;
    }
    const writtenType =
        componentInfoObjects.componentTypeLowerCaseMapping[
            writtenValue.toLowerCase()
        ];
    const writtenClass = componentInfoObjects.allComponentClasses[writtenType];
    if (
        !writtenClass ||
        writtenClass.listEntryComponentType !== undefined ||
        writtenType === "group" ||
        componentInfoObjects.isCompositeComponent({
            componentType: writtenType,
        })
    ) {
        return undefined;
    }
    const originalPath = await component.stateValues.originalPath;
    const extendedType = (await component.stateValues.extendedComponent)
        ?.componentType;
    if (
        // a `<setup>`, reached by the index of a child (`doenet-w0179`),
        // which shows nothing
        extendedType === "setup"
    ) {
        return undefined;
    }
    if (!originalPath?.some((part) => part.index.length > 0)) {
        // A composite named as a whole that holds nothing now, such as a
        // `<conditionalContent>` with no case true and no `<else>` (D37).
        const unresolvedPath = await component.stateValues.unresolvedPath;
        if (
            !extendedType ||
            unresolvedPath?.length > 0 ||
            !componentInfoObjects.isCompositeComponent({
                componentType: extendedType,
            })
        ) {
            return undefined;
        }
        return {
            level: "info",
            diagnostic: codedDiagnostic({
                type: "info",
                code: "doenet-i0055",
                args: {
                    componentType: writtenType,
                    source:
                        workspace.referenceAsWritten ??
                        referenceAsWritten(originalPath, undefined),
                },
            }),
        };
    }
    return {
        level: "info",
        diagnostic: codedDiagnostic({
            type: "info",
            code: "doenet-i0054",
            args: {
                componentType: writtenType,
                source:
                    workspace.referenceAsWritten ??
                    referenceAsWritten(originalPath, undefined),
            },
        }),
    };
}

/**
 * Whether the `extend` or `copy` `component`, written as a different tag than
 * what it is of, makes something allowed (D26, D36, REF-5,
 * `utils/typeChange.js`):
 * - `undefined` when it is not decided, and what it copies is made the type
 *   it is written as without these rules (`verifyReplacementsMatchSpecifiedType`):
 *   the copy is not one an author wrote as a tag (`_copyInChildren`), it is written as a
 *   list or a `<group>`, it is of a `<setup>`, what it copies is not known
 *   yet (a reference that names nothing yet, content not yet expanded, a
 *   prop that makes several components), it is of a list the document
 *   makes for itself (`listIsDecided`), or of content holding a list or
 *   the extend itself (below);
 * - `null` when the type change is allowed;
 * - otherwise `{ level, diagnostic }`, the mismatch: `level` is `"error"`
 *   when it follows from what the author wrote, and `"info"` when from the
 *   value of a math (`<point extend="$m"/>` while `$m` is not a tuple,
 *   `doenet-i0053`, DIAG-2), or `"warning"` for a reference that names
 *   nothing found when the document loaded or a property the source does
 *   not have (D37). An error is shown in place of the copy; during an info
 *   or a warning the copy is missing (`missingOfWrittenType`), and a linked
 *   extend is decided again when the value changes
 *   (`calculateReplacementChanges`).
 *
 * What a composite, or a list the document makes, holds is decided when the
 * document loads (D36, `utils/dast/typeChangeAtLoad.ts`), which records an
 * error on the copy (`typeChangeAtLoad`): a `<select>` whose `numToSelect`
 * is not written as 1, a
 * `<repeat>`, cases of two types. What is left to decide here is the value
 * of the one math it holds. A list whose entries are written
 * (`isAuthoredList`) is decided by what the author wrote, too. A composite is read from the components it
 * has made, so it must be expanded, as an `extend` or `copy` of it waits for
 * (`needsReplacementsUpdatedWhenStale`, `unlinkedTargetsExpanded`).
 *
 * `propReplacements` are the replacements made of a prop (`$P.coords`),
 * whose type is the source's; without them, a copy of a prop is not decided.
 * `found.canWatch` is set to whether what a composite holds can be watched
 * for changes (`watchTypeChangeContent`).
 */
async function typeChangeStatus({
    component,
    components,
    componentInfoObjects,
    propReplacements,
    found = {},
    workspace,
}) {
    found.canWatch = false;
    const atLoad = await typeChangeAtLoadError({
        component,
        components,
        componentInfoObjects,
        workspace,
    });
    if (atLoad) {
        return atLoad;
    }
    const missing = await missingPropertyError({
        component,
        components,
        componentInfoObjects,
    });
    if (missing) {
        return missing;
    }
    if (
        !component.attributes._copyInChildren?.primitive?.value ||
        component.readingTypeChangeValue
    ) {
        // Not decided while what decides it is being read
        // (`readTypeChangeValue`).
        return undefined;
    }
    const writtenValue =
        component.attributes._createComponentOfType?.primitive?.value;
    const writtenType =
        writtenValue &&
        componentInfoObjects.componentTypeLowerCaseMapping[
            writtenValue.toLowerCase()
        ];
    const writtenClass = componentInfoObjects.allComponentClasses[writtenType];
    if (
        !writtenClass ||
        writtenClass.listEntryComponentType !== undefined ||
        writtenType === "group"
    ) {
        // A list is made from what it copies by its own rules (#2231), and a
        // `<group>` holds whatever it is made from.
        return undefined;
    }

    // What the reference names: a composite is its own source here, not
    // the components it made (`replacementSourceIdentities`).
    const extendedComponent = await component.stateValues.extendedComponent;
    const sourceComponent = components[extendedComponent?.componentIdx];
    if (!sourceComponent) {
        return undefined;
    }

    const propName = (
        await component.stateValues.effectivePropNameBySource
    )?.[0];
    if (
        propName?.startsWith("__") ||
        (!propName && (await component.stateValues.unresolvedPath)?.length > 0)
    ) {
        // A reference that names nothing yet, such as `$r[1].A` of a repeat
        // with no iterations, which makes nothing (`doenet-w0072`).
        return undefined;
    }
    const source = referenceAsWritten(
        await component.stateValues.originalPath,
        sourceComponent,
    );

    /** The mismatch, reported with code `code`. */
    function mismatch({ level = "error", code, args }) {
        return {
            level,
            diagnostic: codedDiagnostic({
                type: level,
                code,
                args: {
                    componentType: writtenType,
                    source,
                    ...args,
                    ...(args.sourceType && {
                        sourceType:
                            TAGS_OF_LIST_FORMS[args.sourceType] ??
                            args.sourceType,
                    }),
                },
            }),
        };
    }

    /**
     * Whether `writtenType` can be made from a component of `sourceType`,
     * whose value, if one must be checked, is read by `readValue`. At
     * `level` `"info"`, for the one component a composite holds or the one
     * entry of a list the document makes, only the value is checked: its
     * type was decided when the document loaded (`typeChangeAtLoad`), and
     * a type found otherwise here, such as while a composite in it is made
     * again, is not decided.
     */
    async function decide({ sourceType, readValue, level = "error" }) {
        // What content made at run time is, other than its value, was
        // decided when the document loaded (`typeChangeAtLoad`).
        const valueOnly = level === "info";
        if (
            replacementIsOfType(sourceType, writtenType) ||
            sourceType === "_error" ||
            sourceType === "_missing"
        ) {
            // An error in place of what is referenced has been reported
            // already, and is not a type the author wrote.
            return null;
        }
        const rule = typeChangeRule({
            writtenType,
            sourceType,
            componentInfoObjects,
        });
        if (!rule.allowed && valueOnly) {
            return undefined;
        }
        if (rule.kind === "inputFromValue" && level === "error") {
            return mismatch({
                code: "doenet-e0062",
                args: {
                    sourceType,
                    hasPrefill:
                        "prefill" in writtenClass.createAttributesObject()
                            ? "true"
                            : "false",
                },
            });
        }
        if (rule.kind === "container" && level === "error") {
            return mismatch({ code: "doenet-e0063", args: { sourceType } });
        }
        if (!rule.allowed) {
            return mismatch({
                level,
                code: "doenet-e0065",
                args: { sourceType },
            });
        }
        if (rule.valueCheck && readValue) {
            const value = await readTypeChangeValue(component, readValue);
            if (!valueAllowsTypeChange(rule.valueCheck, value)) {
                return mismatch({
                    level: "info",
                    code: "doenet-i0053",
                    args: {
                        sourceType,
                        valueCheck: rule.valueCheck,
                        value: value?.toString?.() ?? String(value),
                    },
                });
            }
        }
        return null;
    }

    if (propName) {
        if (!propReplacements) {
            return undefined;
        }
        const nonStrings = propReplacements.filter(
            (x) => typeof x === "object",
        );
        if (
            nonStrings.length !== 1 ||
            nonStrings[0].doenetAttributes?.inPlaceOfExtend ||
            componentInfoObjects.isCompositeComponent({
                componentType: nonStrings[0].componentType,
            })
        ) {
            return undefined;
        }
        return decide({ sourceType: typeStoodFor(nonStrings[0]) });
    }

    const sourceType = typeStoodFor(sourceComponent);
    if (
        sourceType === "_error" ||
        sourceType === "setup" ||
        // what is missing with no type to be missing as (`Missing.js`), as a
        // missing `<group>`: the copy is missing too (`missingSourceInPlace`)
        sourceType === "_missing"
    ) {
        // An error is reported already, where it was made. A `<setup>`,
        // reached by name or by the deprecated index of a child (`$g[1]`,
        // `doenet-w0179`), is not content written to be shown.
        return undefined;
    }
    const sourceClass = componentInfoObjects.allComponentClasses[sourceType];

    if (
        componentInfoObjects.isCompositeComponent({
            componentType: writtenType,
        })
    ) {
        // A composite is made from its own kind only: what a `<collect>`
        // shows is what it collects, not what it is given.
        if (
            replacementIsOfType(sourceType, writtenType) ||
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: sourceType,
                baseComponentType: writtenType,
            })
        ) {
            return null;
        }
        return mismatch({ code: "doenet-e0065", args: { sourceType } });
    }

    if (sourceClass?.listEntryComponentType !== undefined) {
        // A list stands for its entries, as a composite for its content.
        // How many a list the author writes (`<mathList>`) holds is fixed
        // by what they wrote; any other list's was decided when the
        // document loaded (`typeChangeAtLoad`), and only the value of its
        // one entry is checked here.
        if (replacementIsOfType(sourceType, writtenType)) {
            return null;
        }
        if (!listIsDecided(sourceType, { componentInfoObjects })) {
            return undefined;
        }
        const level = isAuthoredList(sourceType, { componentInfoObjects })
            ? "error"
            : "info";
        const count = await sourceComponent.stateValues.numEntries;
        if (
            sourceComponent.state.numEntries?.shadowOfComponentIdx ===
                undefined &&
            (await sourceComponent.stateValues.computedNumEntries) !== count
        ) {
            // The values changed and `numEntries` has not caught up yet
            // (`EssentialValueWriter.updateListEntryCount`), which updates
            // the extend again when it does.
            found.listCountPending = true;
        }
        if (count !== 1) {
            if (level === "info") {
                return undefined;
            }
            return mismatch({
                level,
                code: "doenet-e0064",
                args: {
                    reason: "count",
                    sourceType,
                    part: "other",
                    count,
                    holdsNothing: count === 0 ? "true" : "false",
                    // An index selects an entry of a list.
                    indexSelectsOne: "true",
                },
            });
        }
        // The type of the entries is the source's own: the list form of a
        // `<collect>`, `<sort>` or `<shuffle>` is registered under one
        // class, whatever the type of what it holds
        // (`classForSerializedComponent`). The one entry's value is checked
        // as a math's is (`numEntriesValue`).
        if (sourceComponent.componentType !== sourceType) {
            return decide({
                sourceType: sourceClass.listEntryComponentType,
                level,
            });
        }
        const listClass = sourceComponent.constructor;
        return decide({
            sourceType: listClass.listEntryComponentType,
            readValue: async () =>
                (
                    await sourceComponent.stateValues[
                        listClass.listValuesArrayName
                    ]
                )?.[0],
            level,
        });
    }

    if (
        !componentInfoObjects.isCompositeComponent({
            componentType: sourceType,
        })
    ) {
        return decide({
            sourceType,
            readValue: async () => sourceComponent.stateValues.value,
        });
    }

    if (!sourceComponent.isExpanded) {
        return undefined;
    }

    // The components the composite stands for, through the composites it
    // holds. What they are was decided when the document loaded
    // (`typeChangeAtLoad`): the one component found here is checked only
    // for its value.
    const content = [];
    let allExpanded = true;
    let holdsList = false;
    let holdsSelf = false;
    let holdsShadowOfSelf = false;
    async function gather(composite) {
        let replacements = composite.replacements ?? [];
        if (composite.replacementsToWithhold > 0) {
            replacements = replacements.slice(
                0,
                -composite.replacementsToWithhold,
            );
        }
        for (const replacement of replacements) {
            await gatherOne(replacement);
        }
    }
    /** Adds what `replacement` stands for to `content`. */
    async function gatherOne(replacement) {
        if (typeof replacement === "string") {
            if (replacement.trim() !== "") {
                content.push({ componentType: "text" });
            }
            return;
        }
        const comp = components[replacement.componentIdx];
        if (
            !comp ||
            comp.componentType === "setup" ||
            (await comp.stateValues.isInactiveCompositeReplacement)
        ) {
            return;
        }
        if (comp.componentIdx === component.componentIdx) {
            // The extend in what it is of (`doenet-e0005`).
            holdsSelf = true;
            return;
        }
        if (shadowedOriginal(comp, components) === component) {
            // A copy of the extend in what it is of, through extends of
            // each other (`<math extend="$c2"/>` in a case of `c1`, and
            // `<math extend="$c1"/>` in a case of `c2`), each made from
            // the other without end: a circular dependency, shown in its
            // place, which ends it.
            holdsShadowOfSelf = true;
            return;
        }
        if (
            componentInfoObjects.allComponentClasses[comp.componentType]
                ?.listEntryComponentType !== undefined
        ) {
            holdsList = true;
            return;
        }
        if (
            componentInfoObjects.isCompositeComponent({
                componentType: comp.componentType,
            })
        ) {
            if (comp.isExpanded) {
                await gather(comp);
            } else {
                allExpanded = false;
            }
        } else {
            content.push(comp);
        }
    }
    await gather(sourceComponent);
    if (holdsSelf || holdsList) {
        return undefined;
    }
    if (holdsShadowOfSelf) {
        return {
            level: "error",
            diagnostic: codedDiagnostic({
                type: "error",
                code: "doenet-e0005",
                args: { componentType: writtenType },
            }),
        };
    }
    found.canWatch =
        allExpanded &&
        (await everyCompositeExpanded(sourceComponent, components, {
            componentInfoObjects,
        }));
    if (content.length !== 1) {
        // Not expanded yet, which updates an `extend` of it when it is
        // (`needsReplacementsUpdatedWhenStale`), or content that was not
        // decided when the document loaded.
        return undefined;
    }
    const one = content[0];
    return decide({
        sourceType: typeStoodFor(one),
        readValue: one.stateValues
            ? async () => one.stateValues.value
            : undefined,
        level: "info",
    });
}

/**
 * Whether every composite in what `composite` holds, through all of them,
 * is expanded, as the dependency `typeChangeContent` walks it (its
 * replacements, but not those withheld), so that it waits for nothing.
 */
async function everyCompositeExpanded(
    composite,
    components,
    { componentInfoObjects },
) {
    let replacements = composite.replacements ?? [];
    if (composite.replacementsToWithhold > 0) {
        replacements = replacements.slice(0, -composite.replacementsToWithhold);
    }
    for (const replacement of replacements) {
        if (typeof replacement !== "object") {
            continue;
        }
        const comp = components[replacement.componentIdx];
        if (
            !comp ||
            !componentInfoObjects.isCompositeComponent({
                componentType: comp.componentType,
            })
        ) {
            continue;
        }
        if (
            !comp.isExpanded ||
            !(await everyCompositeExpanded(comp, components, {
                componentInfoObjects,
            }))
        ) {
            return false;
        }
    }
    return true;
}

/**
 * The tags whose content an `extend` cannot change (D32, #2404): those whose
 * content is made rather than written. Their extend is the same component
 * again, sharing its source's content, so an attribute that decides the
 * content, or children that would be its content or its inputs, are errors.
 * A `<group>` and a `<module>` are left out: their children are written, and
 * children added to their extend are added after their own.
 */
const TAGS_MAKING_THEIR_CONTENT = new Set([
    "repeat",
    "repeatForSequence",
    "select",
    "selectFromSequence",
    "selectPrimeNumbers",
    "selectRandomNumbers",
    "sampleRandomNumbers",
    "samplePrimeNumbers",
    "sampleMultivariateRandomNumber",
    "shuffle",
    "conditionalContent",
    "collect",
    "sort",
    // The indices that sort its children.
    "sortIndices",
    "sequence",
    "intersection",
    "substitute",
    "split",
    "lorem",
    "idx",
    // Its arrangement of its problems is made by an internal composite.
    "pretzel",
]);

/**
 * What children written inside the extend of a tag would be, which picks the
 * wording of the error. Any other tag's children are the inputs it makes its
 * content from.
 */
const KIND_OF_CHILDREN = {
    repeat: "template",
    repeatForSequence: "template",
    select: "options",
    conditionalContent: "cases",
    pretzel: "problems",
};

/**
 * The parts of a choosing tag, each mapped to the tag it is part of. They
 * mean something only there, so they cannot be extended at all. An `<else>`
 * is a `<case>` by the time it is extended (`conditionalContentSugar`), so it
 * is named as written.
 */
const PARTS_OF_CHOOSING_TAGS = {
    case: "conditionalContent",
    else: "conditionalContent",
    option: "select",
};

/**
 * Seed the random choices of what a `copy` (`component`) makes of its
 * source, as written content's are, in place of its source's choices (D33,
 * D17). What it makes draws from random number generators of the copy's
 * own (its `sharedParameters`, with which its replacements are made),
 * seeded from the copy's seed (`freshCopySeed`): made from the variant's
 * seed and where the copy is (its `stateId`), so two copies of one source
 * differ, and each is the same for a given variant and through a reload.
 * A copy made again from a serialized one (a `copyWithState` of a container
 * holding it) is given that seed as its variant (`Copy.serialize`), so it
 * draws the same. Each time the copy makes its replacements, they draw
 * from the start of that seed.
 */
function seedFreshCopy(component) {
    const sharedParameters = component.sharedParameters;
    component.freshCopySeed ??=
        component.variants?.desiredVariant?.seed ??
        `${sharedParameters.variantSeed ?? ""}|${component.stateId}`;
    const seed = component.freshCopySeed;
    sharedParameters.variantSeed = seed;
    sharedParameters.variantRng = sharedParameters.rngClass(seed);
    sharedParameters.subpartVariantRng = sharedParameters.rngClass(`${seed}s`);
}

/**
 * For a `copyWithState` of a `<module>` (`replacement`), keep the choices it
 * carries where a module attribute written on it (`attributeNames`, among
 * those its `<moduleAttributes>` declares) reaches an attribute that decides
 * what a choosing tag inside it chooses (`attributesDeterminingChoices`), as
 * `k` in `<module copyWithState="$m" k="4"/>` does where `m` holds
 * `<select numToSelect="$k">`, or reaches it through another component
 * inside the module, as through `n` where `m` holds
 * `<integer name="n">$k+1</integer>` and `<select numToSelect="$n">`.
 * What a module attribute reaches includes the references of an attribute
 * held as an expression (`<point name="P">($k, 0)</point>`) and what is
 * written between the brackets of a reference (`$ns[$k]`), and a choosing
 * tag can be inside an attribute component (the `radians` of
 * `<angle><selectFromSequence/></angle>`). That attribute of the choosing
 * tag is given the value it had in the source, so the carried choices still
 * fit, and the module attribute itself takes the written value. What was
 * written for it is kept with it (`authoredComponent`), which a `copy` of
 * the module is given in its place (`serialize`), so that copy chooses again
 * from the module attributes it is given. Each such module attribute
 * gets a warning (`doenet-w0186`), which says to use `copy` to choose again.
 * It is found as the copy is made, as what a module attribute reaches is
 * only known from the module's content (DIAG-2). A value that can't be
 * written back as text (`valueAsWritten`) is left to the module attribute,
 * without a warning.
 */
async function keepChoicesReachedByModuleAttributes({
    replacement,
    attributeNames,
    components,
    componentInfoObjects,
}) {
    const moduleClass = componentInfoObjects.allComponentClasses.module;
    const replacementClass =
        componentInfoObjects.allComponentClasses[replacement.componentType];
    if (
        !replacementClass ||
        !(
            replacementClass === moduleClass ||
            replacementClass.prototype instanceof moduleClass
        )
    ) {
        return [];
    }
    // The module attributes written on the copy, by the index of the
    // component in the copy's `<moduleAttributes>` that declares each
    const writtenByIdx = new Map();
    const writtenNames = new Map(
        attributeNames.map((name) => [name.toLowerCase(), name]),
    );
    for (const declaration of (replacement.children ?? [])
        .filter((child) => child?.componentType === "moduleAttributes")
        .flatMap((child) => child.children ?? [])) {
        const name =
            declaration?.attributes?.name?.primitive?.value?.toLowerCase();
        if (name && writtenNames.has(name)) {
            writtenByIdx.set(declaration.componentIdx, writtenNames.get(name));
        }
    }
    if (writtenByIdx.size === 0) {
        return [];
    }

    // The components inside the module, by index, through which a module
    // attribute can reach a choosing tag (`<integer name="n">$k+1</integer>`
    // and `<select numToSelect="$n">`)
    const inModule = new Map();
    (function collect(component) {
        if (typeof component !== "object" || component === null) {
            return;
        }
        if (component.componentIdx !== undefined) {
            inModule.set(component.componentIdx, component);
        }
        for (const child of component.children ?? []) {
            collect(child);
        }
        for (const attribute of Object.values(component.attributes ?? {})) {
            collect(attribute?.component);
            for (const reference of attribute?.references ?? []) {
                collect(reference);
            }
        }
    })(replacement);

    /**
     * The written module attributes `component` refers to, also through
     * what it refers to inside the module. `visited` holds the components
     * inside the module already followed, as references can make a cycle.
     */
    function referencedModuleAttributes(
        component,
        found = new Set(),
        visited = new Set(),
    ) {
        if (typeof component !== "object" || component === null) {
            return found;
        }
        /**
         * Follow a reference's resolution `ref` (`refResolution`), also
         * into the components written between the brackets of its path
         * (`$k` of `$ns[$k]`), which decide what it refers to.
         */
        function follow(ref) {
            if (!ref) {
                return;
            }
            for (const pathPart of ref.originalPath ?? []) {
                for (const index of pathPart?.index ?? []) {
                    for (const indexComponent of index?.value ?? []) {
                        referencedModuleAttributes(
                            indexComponent,
                            found,
                            visited,
                        );
                    }
                }
            }
            if (writtenByIdx.has(ref.nodeIdx)) {
                found.add(writtenByIdx.get(ref.nodeIdx));
            } else if (inModule.has(ref.nodeIdx) && !visited.has(ref.nodeIdx)) {
                visited.add(ref.nodeIdx);
                referencedModuleAttributes(
                    inModule.get(ref.nodeIdx),
                    found,
                    visited,
                );
            }
        }
        follow(component.extending && unwrapSource(component.extending));
        for (const child of component.children ?? []) {
            referencedModuleAttributes(child, found, visited);
        }
        for (const attribute of Object.values(component.attributes ?? {})) {
            // the references of an attribute held as an expression, with no
            // attribute component (`xs` of `<point>($k, 0)</point>`,
            // `utils/expressionAttribute.js`)
            if (attribute?.type === "expression") {
                for (const slot of attribute.slots ?? []) {
                    follow(slot.refResolution);
                }
            }
            referencedModuleAttributes(attribute?.component, found, visited);
            for (const reference of attribute?.references ?? []) {
                referencedModuleAttributes(reference, found, visited);
            }
        }
        return found;
    }

    const reaching = new Set();
    /**
     * `inTemplate`: inside the template of a `<repeat>` or
     * `<repeatForSequence>`, whose components are not made in the source
     * (only its iterations are).
     */
    async function visit(component, inTemplate = false) {
        if (typeof component !== "object" || component === null) {
            return;
        }
        // A choosing tag written with `copy` or `extend`
        // (`<select copy="$s" numToSelect="$k"/>`) is a `_copy` of the type
        // it is written as, which holds the attributes written on it
        // unresolved, as written, and gives them to what it makes
        // (`attributesFromComposite`).
        const writtenType =
            component.attributes?._createComponentOfType?.primitive?.value;
        const isWrapper =
            component.componentType === "_copy" && writtenType !== undefined;
        const choosingType = isWrapper
            ? (componentInfoObjects.componentTypeLowerCaseMapping[
                  writtenType.toLowerCase()
              ] ?? writtenType)
            : component.componentType;
        const choiceAttributes = new Set(
            (
                componentInfoObjects.allComponentClasses[choosingType]
                    ?.attributesDeterminingChoices ?? []
            ).map((name) => name.toLowerCase()),
        );
        for (const [attrName, attribute] of Object.entries(
            component.attributes ?? {},
        )) {
            if (!choiceAttributes.has(attrName.toLowerCase())) {
                continue;
            }
            if (isWrapper && attribute?.type === "unresolved") {
                const names = new Set();
                for (const child of attribute.children ?? []) {
                    referencedModuleAttributes(child, names);
                }
                if (names.size === 0) {
                    continue;
                }
                // the value the source's wrapper gave what it made
                const madeBySource =
                    components[component.originalIdx]?.replacements?.[0];
                const sourceAttribute = Object.entries(
                    madeBySource?.attributes ?? {},
                ).find(
                    ([name]) => name.toLowerCase() === attrName.toLowerCase(),
                )?.[1]?.component;
                if (madeBySource === undefined && inTemplate) {
                    // held at the value of the source's iteration, as
                    // below
                    attribute.keepSourceIterationValue = true;
                    for (const name of names) {
                        reaching.add(name);
                    }
                    continue;
                }
                const text = await valueAsWritten(sourceAttribute);
                if (text === undefined) {
                    continue;
                }
                holdUnresolvedAttributeAt({ attribute, text });
                for (const name of names) {
                    reaching.add(name);
                }
                continue;
            }
            if (attribute?.type !== "component") {
                continue;
            }
            const names = referencedModuleAttributes(attribute.component);
            if (names.size === 0) {
                continue;
            }
            const sourceAttribute = components[attribute.component.originalIdx];
            if (sourceAttribute === undefined) {
                // Inside the template of a `<repeat>` or
                // `<repeatForSequence>`, which has no live component: each
                // iteration of the copy is held at the value of the
                // source's iteration it takes its state from
                // (`copyStateFromUnlinkedSource` in `Repeat.js`).
                if (!inTemplate) {
                    continue;
                }
                attribute.keepSourceIterationValue = true;
            } else {
                const text = await valueAsWritten(sourceAttribute);
                if (text === undefined) {
                    continue;
                }
                // the value the source chose with, in place of what refers
                // to the module attribute
                holdAttributeComponentAt({
                    attribute,
                    text,
                    componentInfoObjects,
                });
            }
            for (const name of names) {
                reaching.add(name);
            }
        }
        // also a choosing tag inside an attribute component, as the
        // `<selectFromSequence>` of `<angle><selectFromSequence/></angle>`,
        // which the angle's `radians` holds (as `collect`, above)
        const childrenInTemplate =
            inTemplate ||
            ["repeat", "repeatForSequence"].includes(component.componentType);
        for (const child of component.children ?? []) {
            await visit(child, childrenInTemplate);
        }
        for (const attribute of Object.values(component.attributes ?? {})) {
            await visit(attribute?.component, inTemplate);
            for (const reference of attribute?.references ?? []) {
                await visit(reference, inTemplate);
            }
        }
    }
    await visit(replacement);

    return [...reaching].map((attribute) =>
        codedDiagnostic({
            type: "warning",
            code: "doenet-w0186",
            args: { attribute },
        }),
    );
}

/**
 * The errors of a `copyWithState` that writes what decides what its source
 * chooses (D33): an attribute in the class's `attributesDeterminingChoices`,
 * as `numToSelect` on a `<select>`, `doenet-e0068`; or a child added that is
 * one of what the tag chooses from (`choiceChildTypes`), as an `<option>`
 * added to a `<select>`, `doenet-e0069`. Another child, as a `<label>` added
 * to a `<choiceInput>`, is not one of its choices, so is allowed. For a
 * `<choiceInput>` (`choiceChildrenOnlyWhenShuffled`), a `<choice>` is an
 * error only when its source shuffles its choices. A `copyWithState` keeps
 * its source's choices, so it could not apply them. The check goes by name,
 * whatever the value written, so `numToSelect="2"` and `numToSelect="$n"`
 * are the same, and by the type a child is written as, also when written as
 * a reference (`<option copy="$o"/>`); it is known when the document loads.
 * Of a tag whose text children become its choices (`choiceTextChildren`, as
 * the pieces of `<shuffle>1 2 3</shuffle>`), text that is not whitespace is
 * also added choices.
 * Only what the author wrote on the copy (`copyInChildren`) is checked, and
 * `copy` instead makes a new component that chooses again.
 */
async function copyWithStateChangesChoicesErrors({
    replacementType,
    attributeNames,
    children,
    source,
    componentInfoObjects,
}) {
    // the tag a list form (`_shuffleList`) is made of, whose choices it makes
    const tag = TAGS_OF_LIST_FORMS[replacementType] ?? replacementType;
    const replacementClass = componentInfoObjects.allComponentClasses[tag];
    if (!replacementClass) {
        return [];
    }
    const errors = [];
    const choiceAttributes = new Set(
        (replacementClass.attributesDeterminingChoices ?? []).map((name) =>
            name.toLowerCase(),
        ),
    );
    for (const attribute of attributeNames) {
        if (choiceAttributes.has(attribute.toLowerCase())) {
            errors.push(
                codedDiagnostic({
                    type: "error",
                    code: "doenet-e0068",
                    args: { attribute, componentType: tag },
                }),
            );
        }
    }

    const choiceChildTypes =
        replacementClass.choiceChildrenOnlyWhenShuffled &&
        !(await source?.stateValues?.shuffleOrder)
            ? []
            : (replacementClass.choiceChildTypes ?? []);
    // A pretzel's problems are wrapped in an arranger of its own
    // (`pretzelSugar`), made whether or not any are written.
    const writtenChildren = (children ?? []).flatMap((child) =>
        child?.componentType === "_pretzelArranger"
            ? (child.children ?? [])
            : [child],
    );
    /** The type `child` is written as, also as a reference (`_copy`). */
    function writtenType(child) {
        const written =
            child.attributes?._createComponentOfType?.primitive?.value;
        return written === undefined
            ? child.componentType
            : (componentInfoObjects.componentTypeLowerCaseMapping[
                  written.toLowerCase()
              ] ?? written);
    }
    const addedChild = writtenChildren.find(
        (child) =>
            (typeof child === "string" &&
                replacementClass.choiceTextChildren &&
                choiceChildTypes.length > 0 &&
                child.trim() !== "") ||
            (typeof child === "object" &&
                child !== null &&
                choiceChildTypes.some((choiceType) =>
                    componentInfoObjects.isInheritedComponentType({
                        inheritedComponentType: writtenType(child),
                        baseComponentType: choiceType,
                    }),
                )),
    );
    if (addedChild !== undefined) {
        errors.push(
            codedDiagnostic({
                type: "error",
                code: "doenet-e0069",
                args: {
                    // text, whose pieces would be added as choices
                    childType:
                        typeof addedChild === "string"
                            ? "text"
                            : (addedChild.attributes?._createComponentOfType
                                  ?.primitive?.value ??
                              addedChild.componentType),
                    kind: typeof addedChild === "string" ? "text" : "element",
                    componentType: tag,
                },
            }),
        );
    }
    return errors;
}

/**
 * The errors for an `extend` that would change what its source makes (D32,
 * #2404). An extend is the same component again: it shares its source's
 * content and state. It can have its own name and look different, but it
 * cannot change what the component makes or what its state can hold.
 *
 * `$x` is the same as a bare `<T extend="$x"/>`, so a bare extend is never an
 * error, except of a part of a choosing tag, which cannot be extended at all.
 * Otherwise only what the author wrote on the extend (`copyInChildren`) is
 * checked:
 * - on a tag that makes its content (`TAGS_MAKING_THEIR_CONTENT`), an
 *   attribute its class declares beyond those an extend applies
 *   (`attributesAnExtendApplies`), which are those that only change how it
 *   looks, and any children;
 * - on a `<pretzel>`, `mode` and any problems;
 * - on a `<module>`, any module attribute: one its `<moduleAttributes>`
 *   declares, read from its serialized children (`sourceChildren`). Another
 *   attribute is no parameter of the module, so it is only ignored
 *   (`extendIgnoresAttributesAndChildren`);
 * - on a `<choiceInput>`, `shuffleOrder` and any choices, as an extend shares
 *   its selection, which indexes its source's choices in its source's order.
 *
 * `source` is the reference the extend is of, as written (`$r`).
 */
function extendChangesContentErrors({
    replacementType,
    writtenType,
    copyInChildren,
    attributeNames,
    copyAttributeNames,
    children,
    sourceChildren,
    source,
    componentInfoObjects,
}) {
    const partType = Object.hasOwn(PARTS_OF_CHOOSING_TAGS, writtenType)
        ? writtenType
        : Object.hasOwn(PARTS_OF_CHOOSING_TAGS, replacementType)
          ? replacementType
          : null;
    if (partType) {
        return [
            codedDiagnostic({
                type: "error",
                code: "doenet-e0061",
                args: {
                    componentType: partType,
                    parentType: PARTS_OF_CHOOSING_TAGS[partType],
                },
            }),
        ];
    }

    if (!copyInChildren) {
        return [];
    }

    const replacementClass =
        componentInfoObjects.allComponentClasses[replacementType];
    if (!replacementClass) {
        return [];
    }

    const errors = [];

    if (replacementType === "choiceInput") {
        if (attributeNames.includes("shuffleOrder")) {
            errors.push(
                codedDiagnostic({
                    type: "error",
                    code: "doenet-e0059",
                    args: { source },
                }),
            );
        }
        if (
            children.some(
                (child) =>
                    child?.componentType === "choice" ||
                    child?.attributes?._createComponentOfType?.primitive
                        ?.value === "choice",
            )
        ) {
            errors.push(
                codedDiagnostic({
                    type: "error",
                    code: "doenet-e0058",
                    args: { source },
                }),
            );
        }
        return errors;
    }

    const isModule =
        replacementType === "module" ||
        replacementClass.prototype instanceof
            componentInfoObjects.allComponentClasses.module;
    const tag = TAGS_OF_LIST_FORMS[replacementType] ?? replacementType;
    if (!isModule && !TAGS_MAKING_THEIR_CONTENT.has(tag)) {
        return [];
    }

    let changingAttributes;
    if (replacementType === "pretzel") {
        changingAttributes = attributeNames.filter(
            (attrName) => attrName === "mode",
        );
    } else {
        const appliedAttributes = attributesAnExtendApplies({
            replacementType,
            replacementClass,
            isComposite: componentInfoObjects.isCompositeComponent({
                componentType: replacementType,
            }),
            copyAttributeNames,
        });
        changingAttributes = attributeNames.filter(
            (attrName) => !appliedAttributes.has(attrName),
        );
    }

    if (isModule) {
        // Only an attribute its `<moduleAttributes>` declares is a module
        // attribute, matched ignoring case, as `<moduleAttributes>` does.
        const declared = new Set(
            (sourceChildren ?? [])
                .filter((child) => child?.componentType === "moduleAttributes")
                .flatMap((child) => child.children ?? [])
                .map((child) =>
                    child?.attributes?.name?.primitive?.value?.toLowerCase(),
                )
                .filter(Boolean),
        );
        changingAttributes = changingAttributes.filter((attrName) =>
            declared.has(attrName.toLowerCase()),
        );
    }

    for (const attribute of changingAttributes) {
        errors.push(
            isModule
                ? codedDiagnostic({
                      type: "error",
                      code: "doenet-e0060",
                      args: { attribute, source },
                  })
                : codedDiagnostic({
                      type: "error",
                      code: "doenet-e0056",
                      args: { attribute, componentType: tag, source },
                  }),
        );
    }

    if (isModule) {
        return errors;
    }

    // A pretzel's problems are wrapped in an arranger of its own
    // (`pretzelSugar`), made whether or not any are written.
    const writtenChildren =
        replacementType === "pretzel"
            ? children.flatMap((child) =>
                  child?.componentType === "_pretzelArranger"
                      ? (child.children ?? [])
                      : [child],
              )
            : children;
    if (
        writtenChildren.some(
            (child) => typeof child !== "string" || child.trim() !== "",
        )
    ) {
        errors.push(
            codedDiagnostic({
                type: "error",
                code: "doenet-e0057",
                args: {
                    componentType: tag,
                    kind: KIND_OF_CHILDREN[tag] ?? "inputs",
                    source,
                },
            }),
        );
    }

    return errors;
}

/**
 * The reference an extend is of, as written: `$r`, `$g.r`, `$s[2]`. An index
 * is shown with the value it has when the extend is expanded, so `$s[$n]` is
 * shown as `$s[2]` while `$n` is 2, and as `[…]` when that value is not text.
 */
function referenceAsWritten(originalPath, sourceComponent) {
    const parts = (originalPath ?? []).map(
        (part) =>
            part.name +
            part.index
                .map((indexPart) =>
                    indexPart.value.every((x) => typeof x === "string")
                        ? `[${indexPart.value.join("").trim()}]`
                        : "[…]",
                )
                .join(""),
    );
    if (parts.length > 0 && parts[0] !== "") {
        return `$${parts.join(".")}`;
    }
    const name = sourceComponent?.attributes?.name?.primitive?.value;
    return name ? `$${name}` : `<${sourceComponent?.componentType}>`;
}

/**
 * Warnings for what an `extend` of a composite or a list cannot apply
 * (#2041), where it is not an error (`extendChangesContentErrors`): on a
 * list whose content is written (`<mathList>`), or on a composite that does
 * not make its content. `_copyInChildren` marks a `_copy` an author wrote as `extend=` or
 * `copy=`, and a linked one is an `extend`.
 *
 * Such an extend is a shadow of what it extends: a composite copies the
 * replacements of the composite it shadows (`expandShadowingComposite`), and a
 * list reads the values of the list it shadows (`shadowVariable`). So an
 * attribute that its own class declares, beyond what every composite or list
 * has, cannot change what it shows: `to` on `<sequence extend="$s" to="5"/>`,
 * `for` on a `<repeat>`. Such an attribute is returned in `attributeNames`, for
 * the caller to leave off the extend, which then keeps the source's value. Set
 * on the extend, some would break it instead: `type` on a sequence's extend
 * picks the class its values are made for. `asList` is read by the parent,
 * and the number-display attributes, where declared, by the replacements
 * themselves, so those still apply. Children written inside the extend of a
 * composite are dropped as well, except by a class that adds them after the
 * replacements it copies (`<group>`). A list takes no children, which is
 * already reported as invalid children. A `<group>`, or a class built on it,
 * makes its replacements again on its extend, so the attributes a group
 * declares (`rendered`) apply there too.
 */
function extendIgnoresAttributesAndChildren({
    replacementType,
    attributeNames,
    copyAttributeNames,
    children,
    componentInfoObjects,
}) {
    const replacementClass =
        componentInfoObjects.allComponentClasses[replacementType];
    if (!replacementClass) {
        return { attributeNames: [], diagnostics: [] };
    }

    const isComposite = componentInfoObjects.isCompositeComponent({
        componentType: replacementType,
    });
    const isList = replacementClass.prototype instanceof ValueListComponent;
    if (!isComposite && !isList) {
        return { attributeNames: [], diagnostics: [] };
    }

    const sharedAttributes = attributesAnExtendApplies({
        replacementType,
        replacementClass,
        isComposite,
        copyAttributeNames,
    });

    const diagnostics = [];
    const ignoredAttributeNames = attributeNames.filter(
        (attrName) => !sharedAttributes.has(attrName),
    );

    for (const attrName of ignoredAttributeNames) {
        diagnostics.push(
            codedDiagnostic({
                type: "warning",
                code: "doenet-w0168",
                args: {
                    attribute: attrName,
                    componentType: replacementType,
                },
            }),
        );
    }

    if (
        isComposite &&
        !replacementClass.addExtraSerializedChildrenWhenShadowing &&
        children.some((x) => typeof x !== "string" || x.trim() !== "")
    ) {
        diagnostics.push(
            codedDiagnostic({
                type: "warning",
                code: "doenet-w0169",
                args: { componentType: replacementType },
            }),
        );
    }

    return { attributeNames: ignoredAttributeNames, diagnostics };
}

/**
 * The attributes an extend of a composite or a list applies: those every
 * composite or list has, the number-display attributes where they apply, a
 * group's own on a `<group>` or a class built on it, and the `_copy`'s own.
 * Any other attribute its class declares would change what it shows, which
 * it shares with its source.
 */
function attributesAnExtendApplies({
    replacementType,
    replacementClass,
    isComposite,
    copyAttributeNames,
}) {
    const declaredAttributes = replacementClass.createAttributesObject();
    return new Set([
        ...Object.keys(
            (isComposite
                ? CompositeComponent
                : ValueListComponent
            ).createAttributesObject(),
        ),
        // The number-display attributes, where they apply: a class that
        // declares them, and a `<collect>`, which passes them on to the
        // copies it makes. A `<module>` reads one only as a parameter of
        // its own, which its extend can't change, as any other.
        ...Object.keys(returnNumberDisplayAttributes()).filter(
            (attrName) =>
                replacementType === "collect" || attrName in declaredAttributes,
        ),
        // A `<group>`, and a `<module>`, shadows by making its replacements
        // again (`addExtraSerializedChildrenWhenShadowing`), so it reads the
        // attributes a group declares, such as `rendered`, on its extend.
        ...(replacementClass === Group ||
        replacementClass.prototype instanceof Group
            ? Object.keys(Group.createAttributesObject())
            : []),
        // The `_copy`'s own attributes. Of these, only `asList` is handed on
        // to what it makes (`dontSkipAttributes`), and the parent reads it.
        ...copyAttributeNames,
    ]);
}

export function addChildrenFromComposite({
    replacements,
    children,
    componentInfoObjects,
}) {
    let repl = replacements[0];
    if (!repl.children) {
        repl.children = [];
    }
    let newChildren = deepClone(children);
    let componentClass =
        componentInfoObjects.allComponentClasses[repl.componentType];

    if (!componentClass.includeBlankStringChildren) {
        newChildren = newChildren.filter(
            (x) => typeof x !== "string" || x.trim() !== "",
        );
    }

    // An unlinked `<group copy>` given its source's variant (`copyVariants`)
    // hands the subvariants of that variant to its source's random
    // descendants, which keeps their choices. A random child added to the
    // copy gets no subvariant, so it draws from the source's seed and can
    // repeat a choice the source made with it. The copy draws from a seed
    // of its own instead, made from the source's so that it is the same for
    // a given variant. Only a group is changed: other components, such as a
    // `<conditionalContent>`, make their random choices from the seed
    // itself, so a new seed would change the choices copied from the source.
    const desiredVariant = repl.variants?.desiredVariant;
    if (
        desiredVariant?.seed !== undefined &&
        componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: repl.componentType,
            baseComponentType: "group",
        }) &&
        gatherVariantComponents({
            // it marks what it gathers, which is left to the copy's setup
            serializedComponents: deepClone(newChildren),
            componentInfoObjects,
        }).length > 0
    ) {
        repl.variants.desiredVariant = {
            ...desiredVariant,
            seed: `${desiredVariant.seed}c`,
        };
    }

    repl.children.push(...newChildren);
}

/**
 * The list component of each type of value that an array of such values is
 * read as (`arrayListReplacement`).
 */
const LIST_TYPE_OF_VALUE_TYPE = {
    math: "mathList",
    number: "numberList",
    text: "textList",
    boolean: "booleanList",
};

/**
 * The replacement for a reference to the whole array `varName` of `target`
 * (`$P.xs`): one list component of the array's values, which shadows the
 * array and whose entries a parent reads, and the viewer draws, as one child
 * per value, each of the type a value of the array has on its own. It carries
 * the companions the array's values have (`displayDigits` of a `<point>`),
 * shadowing them. `undefined`, for one replacement per value as before, when
 * the array is not one dimension of math, number, text or boolean values,
 * when the reference is not linked, was given a type or attributes of its
 * own, skips empty entries, or sits where a parent reads values, where each
 * value is a value reference of its own, or must have a replacement.
 */
async function arrayListReplacement({
    component,
    components,
    target,
    varName,
    arrayStateVarObj,
    numWrappingComponents,
    link,
    mayBeValueReference,
    parentClass,
    componentInfoObjects,
    compositeAttributesObj,
    nComponents,
    stateIdInfo,
}) {
    const valueType =
        arrayStateVarObj.shadowingInstructions?.createComponentOfType;
    const listType =
        typeof valueType === "string"
            ? LIST_TYPE_OF_VALUE_TYPE[valueType]
            : undefined;
    if (
        listType === undefined ||
        (arrayStateVarObj.numDimensions ?? 1) !== 1 ||
        numWrappingComponents > 0 ||
        !link ||
        !mayBeValueReference ||
        (await component.stateValues.removeEmptyArrayEntries) ||
        // where a reference must have a replacement, an empty array is one
        // blank replacement, which a value written to it fills
        components[component.parentIdx]?.sharedParameters
            ?.compositesMustHaveAReplacement ||
        // values whose display settings differ from value to value (the
        // `number` of each entry of a `<mathList>`) each keep their own
        Object.values(
            arrayStateVarObj.shadowingInstructions
                .addAttributeComponentsShadowingStateVariables ?? {},
        ).some(
            ({ stateVariableToShadow }) =>
                target.state[stateVariableToShadow]?.companionOfEachEntry,
        )
    ) {
        return undefined;
    }

    const res = convertUnresolvedAttributesForComponentType({
        attributes: component.attributes,
        componentType: listType,
        componentInfoObjects,
        compositeAttributesObj,
        nComponents: 0,
        stateIdInfo: { prefix: "", num: 0 },
    });
    const { otherAttributes } = separateResponseMarks(res.attributes);
    if (
        Object.keys(otherAttributes).length > 0 ||
        planValueReference({
            parentClass,
            targetComponentType: target.componentType,
            valueComponentType: valueType,
            fromImplicitProp: false,
            hasAttributes: false,
            componentInfoObjects,
        })
    ) {
        return undefined;
    }

    const converted = convertUnresolvedAttributesForComponentType({
        attributes: component.attributes,
        componentType: listType,
        componentInfoObjects,
        compositeAttributesObj,
        nComponents,
        stateIdInfo,
    });
    nComponents = converted.nComponents;
    const attributes = {};

    const listAttributes =
        componentInfoObjects.allComponentClasses[
            listType
        ].createAttributesObject();
    const shadowing =
        arrayStateVarObj.shadowingInstructions
            .addAttributeComponentsShadowingStateVariables ?? {};
    for (const attrName in shadowing) {
        const stateVariableToShadow = shadowing[attrName].stateVariableToShadow;
        const attributeComponentType =
            listAttributes[attrName]?.createComponentOfType;
        // a companion that differs from value to value has no place on the
        // list
        if (
            !attributeComponentType ||
            target.state[stateVariableToShadow]?.isArray
        ) {
            continue;
        }
        if (attributeShadowIsReference(attributeComponentType)) {
            attributes[attrName] = shadowAttributeReference({
                attrName,
                attributeComponentType,
                target,
                stateVariableToShadow,
            });
            continue;
        }
        attributes[attrName] = {
            component: {
                type: "serialized",
                componentType: attributeComponentType,
                componentIdx: nComponents++,
                stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                attributes: {},
                doenetAttributes: {},
                state: {},
                children: [],
                downstreamDependencies: {
                    [target.componentIdx]: [
                        {
                            compositeIdx: component.componentIdx,
                            dependencyType: "referenceShadow",
                            propVariable: stateVariableToShadow,
                        },
                    ],
                },
            },
        };
    }
    Object.assign(attributes, converted.attributes);

    return {
        serializedComponent: {
            type: "serialized",
            componentType: listType,
            componentIdx: nComponents++,
            stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
            attributes,
            doenetAttributes: {},
            children: [],
            state: {},
            downstreamDependencies: {
                [target.componentIdx]: [
                    {
                        dependencyType: "referenceShadow",
                        compositeIdx: component.componentIdx,
                        propVariable: varName,
                    },
                ],
            },
        },
        nComponents,
    };
}

/**
 * The `doenetAttributes` of a component made from entry `arrayKey` of the
 * array `arrayStateVarObj` of `target`: when the array is a list's values
 * and the list holds, for each entry, variables of the entry's source that
 * the component reads from the list rather than takes as attributes
 * (`listEntrySourceVariables`, a list of points or vectors: the label,
 * `fixed`, `fixLocation`, and a vector's draggable head and tail),
 * `listEntrySource`, which names the list, the arrays holding them, and the
 * entry's index into them, so that the component reads them as the copy of
 * the source it stood for had them (`utils/label.ts`,
 * `utils/listEntrySource.ts`).
 */
function listEntrySourceDoenetAttributes({
    arrayStateVarObj,
    arrayKey,
    target,
}) {
    const variables =
        arrayStateVarObj.shadowingInstructions.listEntrySourceVariables;
    const index = arrayStateVarObj.keyToIndex(arrayKey);
    if (!variables || !Number.isInteger(index)) {
        return {};
    }
    return {
        listEntrySource: {
            componentIdx: target.componentIdx,
            index,
            variables,
        },
    };
}

/**
 * For an unlinked copy of entry `arrayKey` of a list (`copy="$pl[1]"`), the
 * variables of the entry's source that a linked component reads from the list
 * (`listEntrySourceVariables`) and that the copy does not take as attributes,
 * as they are when it is made: the label, as a
 * `<label>` child as an unlinked copy of a labeled point has, and any other
 * (a vector's `headDraggable` and `tailDraggable`) the source sets, as state.
 * A linked component reads them from the list instead
 * (`listEntrySourceDoenetAttributes`).
 */
async function listEntrySourceSnapshot({
    arrayStateVarObj,
    arrayKey,
    target,
    nComponents,
    stateIdInfo,
}) {
    const children = [];
    const state = {};
    const variables =
        arrayStateVarObj.shadowingInstructions.listEntrySourceVariables;
    const index = arrayStateVarObj.keyToIndex(arrayKey);
    if (!variables || !Number.isInteger(index)) {
        return { children, state, nComponents };
    }

    // what an unlinked copy takes as attributes, and `fixed` and
    // `fixLocation`, which it takes as written on the list or the entry's
    // source
    const attributes =
        arrayStateVarObj.shadowingInstructions
            .addAttributeComponentsShadowingStateVariables ?? {};

    for (const [variable, arrayName] of Object.entries(variables)) {
        if (variable === "labelHasLatex") {
            // carried by the label's text (`Label`'s `hasLatex`)
            continue;
        }
        if (variable in attributes || CONTEXT_ATTRIBUTES.includes(variable)) {
            continue;
        }
        const value = (await target.state[arrayName].value)[index];
        if (variable === "label") {
            if (typeof value === "string" && value !== "") {
                children.push({
                    type: "serialized",
                    componentType: "label",
                    componentIdx: nComponents++,
                    stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                    attributes: {},
                    doenetAttributes: {},
                    state: { valueShadow: value },
                    children: [],
                });
            }
        } else if (value !== null && value !== undefined) {
            state[variable] = value;
        }
    }

    return { children, state, nComponents };
}

/**
 * Remove from `attributes`, those a copy or extend takes from its source,
 * the ones that an attribute written on it (`attributesFromComposite`)
 * replaces as well as itself (`replacesOnReference`): with `variable="t"`,
 * a copy takes none of its source's `variables`, as an extend does not.
 */
function deleteReplacedAttributes({
    attributes,
    attributesFromComposite,
    componentType,
    componentInfoObjects,
}) {
    const attributesObj =
        componentInfoObjects.allComponentClasses[
            componentType
        ]?.createAttributesObject() ?? {};
    for (const attrName in attributesFromComposite) {
        for (const replaced of attributesObj[attrName]?.replacesOnReference ??
            []) {
            delete attributes[replaced];
        }
    }
}

/**
 * Zero the replacement counts in `workspace` for sources `sourceNum` and
 * later, once `calculateReplacementChanges` has deleted their replacements
 * to remake them. Doenet/DoenetML#2417: this cleared the counts for the
 * first sources instead, indexing by position in a slice.
 */
export function clearReplacementCountsFrom(workspace, sourceNum) {
    workspace.numReplacementsBySource.fill(0, sourceNum);
    workspace.numNonStringReplacementsBySource.fill(0, sourceNum);
}
