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
import AuthoredValueList from "./AuthoredValueList";
import { typeChangeRule, valueAllowsTypeChange } from "../../utils/typeChange";
import {
    indexSelectsInstances,
    instanceKindOf,
} from "../../utils/indexInstances";
import {
    doenetMLDollarsForReference,
    doenetMLStringForReference,
} from "../../utils/sourceLocation";
import { returnNumberDisplayAttributes } from "../../utils/numberDisplay";
import { isListEntryArrayVariable } from "../../utils/listEntryReference";
import {
    attributeShadowIsReference,
    shadowAttributeReference,
} from "../../utils/variableRefAttribute";
import { errorComponentState } from "../../utils/dast/errors";
import {
    CONTEXT_ATTRIBUTES,
    writtenEntryAttributeComponent,
} from "../../utils/contextAttribute";
import { applyCopySnapshot, copySnapshotOf } from "../../utils/copySnapshot";
import { gatherVariantComponents } from "../../utils/variants";
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

        // The state variable of what an `extend` or `copy` is of that decides
        // whether the type it is written as can be made from it
        // (`typeChangeStatus`): the `value` of a math for `<point
        // extend="$m"/>` (`utils/typeChange.js`), `numEntries` of a list,
        // which stands for its one entry, or, of a composite, `content`, what
        // it stands for, and `contentValue`, that and its value.
        stateVariableDefinitions.typeChangeValueCheck = {
            returnDependencies: () => ({
                extendedComponent: {
                    dependencyType: "stateVariable",
                    variableName: "extendedComponent",
                },
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
                    replacementIsOfType(sourceType, writtenType)
                ) {
                    return { setValue: { typeChangeValueCheck: null } };
                }
                if (
                    componentInfoObjects.allComponentClasses[sourceType]
                        ?.listEntryComponentType !== undefined
                ) {
                    return {
                        setValue: { typeChangeValueCheck: "numEntries" },
                    };
                }
                if (
                    componentInfoObjects.isCompositeComponent({
                        componentType: sourceType,
                    })
                ) {
                    // What a composite stands for, its content through
                    // any composites it made, and also the value of that
                    // content when the written type can be made from a math
                    // only for some values
                    if (
                        componentInfoObjects.isCompositeComponent({
                            componentType: writtenType,
                        })
                    ) {
                        return { setValue: { typeChangeValueCheck: null } };
                    }
                    return {
                        setValue: {
                            typeChangeValueCheck: typeChangeRule({
                                writtenType,
                                sourceType: "math",
                                componentInfoObjects,
                            }).valueCheck
                                ? "contentValue"
                                : "content",
                        },
                    };
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
                    ["content", "contentValue"].includes(
                        stateValues.typeChangeValueCheck,
                    ) &&
                    !stateValues.effectivePropNameBySource?.[0]
                ) {
                    // What the composite stands for (`typeChangeStatus`):
                    // its content through every composite it made,
                    // including the `<group>`s of its iterations, picks and
                    // cases, which `allReplacementIdentities` stops at, and
                    // the value of that content, checked when it is a math.
                    dependencies.typeChangeContent = {
                        dependencyType: "replacement",
                        compositeIdx:
                            stateValues.extendedComponent.componentIdx,
                        recursive: true,
                        recurseNonStandardComposites: true,
                        // Without waiting for a copy in it to be expanded:
                        // this copy, or another that waits for it, may be
                        // in that content.
                        doNotWaitForCopies: true,
                        variableNames: [
                            "isInactiveCompositeReplacement",
                            ...(stateValues.typeChangeValueCheck ===
                            "contentValue"
                                ? ["value"]
                                : []),
                        ],
                        variablesOptional: true,
                    };
                } else if (
                    stateValues.typeChangeValueCheck &&
                    !stateValues.effectivePropNameBySource?.[0]
                ) {
                    // whether the type the extend is written as can be made
                    // from its source (`typeChangeStatus`)
                    dependencies.typeChangeSourceValue = {
                        dependencyType: "stateVariable",
                        componentIdx:
                            stateValues.extendedComponent.componentIdx,
                        variableName: stateValues.typeChangeValueCheck,
                        variablesOptional: true,
                    };
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

        return stateVariableDefinitions;
    }

    /**
     * The replacements (`createReplacementsFromSources`). An unlinked copy
     * keeps what it made of its source through a reload: it takes the
     * snapshot a save holds for it, and records its own, with how to make it
     * again, for a save to compare (`utils/copySnapshot.js`). The snapshot
     * holds state by `stateId` and `componentType`, not the replacements'
     * shape, and a copy made again need not make what it made before (a copy
     * of a `<conditionalContent>` is made from whichever case is active). A
     * copy made again with a different shape is made from its source as
     * restored, and keeps nothing it cannot apply: it records only its own
     * snapshot.
     */
    static async createSerializedReplacements(args) {
        const result = await this.createReplacementsFromSources(args);
        const { component } = args;
        if ((await component.stateValues.link) === false) {
            const saved = component.coreFunctions.savedCopySnapshot?.(
                component.stateId,
            );
            if (saved) {
                applyCopySnapshot(result.replacements, saved);
            }
            component.unlinkedSnapshot = copySnapshotOf(result.replacements);
            component.freshUnlinkedSnapshot = async () =>
                copySnapshotOf(
                    (
                        await this.createReplacementsFromSources({
                            ...args,
                            workspace: {},
                        })
                    ).replacements,
                );
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
        workspace.typeChangeContent = undefined;
        // Whether this copy is inside source `sourceNum` (see
        // `calculateReplacementChanges`).
        workspace.sourceContainsCopyBySource = [];

        let compositeAttributesObj = this.createAttributesObject();

        let replacementSourceIdentities =
            await component.stateValues.replacementSourceIdentities;
        if (
            !(await component.stateValues.extendedComponent) ||
            !replacementSourceIdentities
        ) {
            // no valid target, so no replacements other than copied in children
            let replacements = [];

            const stateIdInfo = {
                prefix: `${component.stateId}|`,
                num: workspace.replacementsCreated,
            };

            if (component.attributes._copyInChildren?.primitive.value) {
                // even though don't have valid target,
                // if copyInChildren, then include children added directly to component

                let componentType =
                    componentInfoObjects.componentTypeLowerCaseMapping[
                        component.attributes._createComponentOfType.primitive.value.toLowerCase()
                    ];

                let componentClass =
                    componentInfoObjects.allComponentClasses[componentType];

                const res = convertUnresolvedAttributesForComponentType({
                    attributes: component.attributes,
                    componentType,
                    componentInfoObjects,
                    compositeAttributesObj,
                    nComponents,
                    stateIdInfo,
                });

                const attributesFromComposite = res.attributes;
                nComponents = res.nComponents;

                let children = deepClone(component.serializedChildren);
                if (!componentClass.includeBlankStringChildren) {
                    children = children.filter(
                        (x) => typeof x !== "string" || x.trim() !== "",
                    );
                }

                let attributes = attributesFromComposite;

                replacements = [
                    {
                        type: "serialized",
                        componentType,
                        componentIdx: nComponents++,
                        stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                        attributes,
                        doenetAttributes: {},
                        state: {},
                        children,
                    },
                ];

                workspace.numReplacementsBySource.push(replacements.length);
                workspace.numNonStringReplacementsBySource.push(
                    replacements.filter((x) => typeof x !== "string").length,
                );
            }

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
        let numReplacementsSoFar = 0;
        let numNonStringReplacementsSoFar = 0;

        for (let sourceNum in replacementSourceIdentities) {
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
            });

            diagnostics.push(...results.diagnostics);
            nComponents = results.nComponents;

            workspace.propVariablesCopiedBySource[sourceNum] =
                results.propVariablesCopiedByReplacement;
            workspace.sourceContainsCopyBySource[sourceNum] = Boolean(
                results.sourceContainsCopy,
            );

            let sourceReplacements = results.serializedReplacements;
            numReplacementsBySource[sourceNum] = sourceReplacements.length;
            numNonStringReplacementsBySource[sourceNum] =
                sourceReplacements.filter((x) => typeof x !== "string").length;
            numReplacementsSoFar += numReplacementsBySource[sourceNum];
            numNonStringReplacementsSoFar +=
                numNonStringReplacementsBySource[sourceNum];
            replacements.push(...sourceReplacements);
        }

        workspace.numReplacementsBySource = numReplacementsBySource;
        workspace.numNonStringReplacementsBySource =
            numNonStringReplacementsBySource;
        workspace.sourceIndices = replacementSourceIdentities.map(
            (x) => x.componentIdx,
        );

        // A copy written as a different tag than what it copies makes one
        // only between related types (D26, `typeChangeStatus`).
        // An extend that would change what its source makes is that error
        // instead (`extendChangesContentErrors`).
        const contentFound = {};
        const typeChange = replacements.some(
            (x) => x?.doenetAttributes?.inPlaceOfExtend,
        )
            ? undefined
            : await typeChangeStatus({
                  component,
                  components,
                  componentInfoObjects,
                  propReplacements: replacements,
                  contentFound,
              });
        workspace.typeChangeKey = typeChangeKey(typeChange);
        workspace.typeChangeContent = contentFound.identity;
        if (typeChange) {
            diagnostics.push(typeChange.diagnostic);
            replacements =
                typeChange.level === "error"
                    ? [
                          {
                              type: "serialized",
                              componentType: "_error",
                              componentIdx: nComponents++,
                              stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                              state: errorComponentState(
                                  typeChange.diagnostic.message,
                                  typeChange.diagnostic,
                              ),
                              attributes: {},
                              // Not given the type the copy is written as
                              // (`verifyReplacementsMatchSpecifiedType`)
                              doenetAttributes: { inPlaceOfExtend: true },
                              children: [],
                          },
                      ]
                    : [];
            addAttributesToSingleReplacement(
                replacements,
                component,
                componentInfoObjects,
            );
            workspace.numReplacementsBySource = [replacements.length];
            workspace.numNonStringReplacementsBySource = [replacements.length];
            workspace.propVariablesCopiedBySource = [];
            workspace.replacementsCreated = stateIdInfo.num;
            return { replacements, diagnostics, nComponents };
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
    }) {
        // console.log(`create replacement for sourceNum ${sourceNum}`);
        // console.log(
        //   `propName: ${component.stateValues.effectivePropNameBySource[sourceNum]}`,
        // );

        let diagnostics = [];

        let replacementSource = (
            await component.stateValues.replacementSourceIdentities
        )[sourceNum];
        if (typeof replacementSource !== "object") {
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
        const replacementSourceComponent =
            components[replacementSource.componentIdx];

        // Don't create any replacement if the source is inactive
        if (
            await replacementSourceComponent.stateValues
                .isInactiveCompositeReplacement
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
        let propName = (await component.stateValues.effectivePropNameBySource)[
            sourceNum
        ];
        let link = await component.stateValues.link;
        if (
            !link ||
            (propName && (await component.stateValues.removeEmptyArrayEntries))
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
            let propVariablesCopiedByReplacement =
                results.propVariablesCopiedByReplacement;

            if (copyInChildren && component.serializedChildren.length > 0) {
                if (serializedReplacements.length === 0) {
                    // even though don't have valid prop,
                    // if copyInChildren, then include children added directly to component

                    let componentType =
                        componentInfoObjects.componentTypeLowerCaseMapping[
                            component.attributes._createComponentOfType.primitive.value.toLowerCase()
                        ];

                    let componentClass =
                        componentInfoObjects.allComponentClasses[componentType];

                    const res = convertUnresolvedAttributesForComponentType({
                        attributes: component.attributes,
                        componentType,
                        componentInfoObjects,
                        compositeAttributesObj,
                        nComponents,
                        stateIdInfo,
                    });

                    const attributesFromComposite = res.attributes;
                    nComponents = res.nComponents;

                    let children = deepClone(component.serializedChildren);
                    if (!componentClass.includeBlankStringChildren) {
                        children = children.filter(
                            (x) => typeof x !== "string" || x.trim() !== "",
                        );
                    }

                    let attributes = attributesFromComposite;

                    serializedReplacements = [
                        {
                            type: "serialized",
                            componentType,
                            componentIdx: nComponents++,
                            stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                            attributes,
                            doenetAttributes: {},
                            state: {},
                            children,
                        },
                    ];

                    propVariablesCopiedByReplacement = [[]];
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
            };
        }

        // if creating copy directly from the target component,
        // create a serialized copy of the entire component

        // If we are copying without linking a source that is shadowing another source,
        // then the attributes and children of the source may not be sufficient
        // to determine its state variables (as values linked from its source may be used).
        // Therefore, we copy the primary state variable
        // and copy the essential state of the source.

        let serializedReplacements;
        try {
            serializedReplacements = [
                await replacementSourceComponent.serialize({
                    // a value reference is copied as a component of its
                    // type (`ValueRef.serialize`); unlinked, it reads the
                    // settings it takes from its referent here
                    valueReferenceAsComponent: true,
                    components: link ? undefined : components,
                    copyAll: !link,
                    componentSourceAttributesToIgnore: ["labelIsName"],
                    copyVariants: !link,
                    copyPrimaryEssentialIfShadow: !link,
                    copyEssentialStateIfShadow: !link,
                    errorIfEncounterComponent: [component.componentIdx],
                    namesReachedThroughCopy:
                        link && namesReachedThroughCopy(component),
                }),
            ];

            // Counted from the copy's own `stateId`, the ids would be the
            // same whichever case of a `<conditionalContent>` the copy is made
            // from, so what was saved of one case would be applied to another.
            const sourceStateIdInfo = {
                prefix: `${stateIdInfo.prefix}${await stateIdSegmentForCopyOf(replacementSourceComponent)}`,
                num: stateIdInfo.num,
            };
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

            if (link) {
                const errors = extendChangesContentErrors({
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
                });
                if (errors.length > 0) {
                    // What the extend would change is what it shares with its
                    // source, so it shows an error in place of the content.
                    // One, as an extend makes one replacement, which takes its
                    // place (`adjustForCreateComponentIdxName`); each error
                    // is still reported.
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
        };
    }

    static async calculateReplacementChanges({
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

            if (component.replacements.length > 0) {
                let replacementInstruction = {
                    changeType: "delete",
                    changeTopLevelReplacements: true,
                    firstReplacementInd: 0,
                    numberReplacementsToDelete: component.replacements.length,
                };
                replacementChanges.push(replacementInstruction);
            }

            let previousZeroSourceIndices =
                workspace.sourceIndices.length === 0;

            workspace.sourceIndices = [];
            workspace.typeChangeKey = undefined;
            workspace.typeChangeContent = undefined;
            workspace.numReplacementsBySource = [];
            workspace.numNonStringReplacementsBySource = [];
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

        // A type change that was not allowed, or is no longer, or that is
        // decided only now, makes its replacements again (`typeChangeStatus`):
        // one made before what its source holds was expanded
        // (`doNotWaitForCopies`) is made as decided. A copy of a prop is
        // decided only when made.
        if (effectivePropNameBySource[0]) {
            if (workspace.typeChangeKey?.startsWith("mismatch")) {
                return {
                    replacementChanges: unwithheldChanges(component),
                    diagnostics,
                    nComponents,
                };
            }
        } else {
            const contentFound = {};
            const typeChange = await typeChangeStatus({
                component,
                components,
                componentInfoObjects,
                contentFound,
            });
            const key = typeChangeKey(typeChange);
            const previousContent = workspace.typeChangeContent;
            workspace.typeChangeContent = contentFound.identity;
            if (key !== workspace.typeChangeKey) {
                if (
                    key?.startsWith("mismatch") ||
                    workspace.typeChangeKey?.startsWith("mismatch") ||
                    workspace.typeChangeKey === undefined
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
                return {
                    replacementChanges: unwithheldChanges(component),
                    diagnostics,
                    nComponents,
                };
            } else if (
                (["value", "numEntries"].includes(
                    await component.stateValues.typeChangeValueCheck,
                ) ||
                    (key === "allowed" &&
                        contentFound.identity !== undefined &&
                        contentFound.identity === previousContent)) &&
                !(component.replacementsToWithhold > 0) &&
                !(await component.stateValues.removeEmptyArrayEntries) &&
                workspace.sourceIndices.length ===
                    replacementSourceIdentities.length &&
                replacementSourceIdentities.every(
                    (source, ind) =>
                        source.componentIdx === workspace.sourceIndices[ind],
                )
            ) {
                // Made from the same source, as the same type, or from the
                // same content of a composite: only what the type change
                // checks (`typeChangeValueCheck`), such as the value of a
                // math, changed, which the replacements
                // follow through their own dependencies. Made again, a
                // replacement wrapped in the type the copy is written as
                // would be remade on every change of that value.
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
        let propVariablesCopiedBySource = [];
        let sourceContainsCopyBySource = [];

        let maxSourceLength = Math.max(
            replacementSourceIdentities.length,
            workspace.numReplacementsBySource.length,
        );

        let recreateRemaining = false;

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

                if (allWithheld) {
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
 * index selects: `$sec[2]` does not select a child of a `<section>`, nor `$n[1]`
 * anything of a `<number>` (`doenet-w0180`). A component that does produce
 * something an index selects, as a list does its entries, took the index
 * already, and an index past what it produces is silent (#1499).
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

    return codedDiagnostic({
        type: "warning",
        code: "doenet-w0180",
        args: {
            reference: `${doenetMLDollarsForReference(
                originalPath,
                allDoenetMLs,
            )}${doenetMLStringForReference(originalPath, allDoenetMLs)}`,
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
        varName = isListEntryArrayVariable(target, propName)
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
    diagnostics.push(...res.diagnostics);
    return res.nComponents;
}

/**
 * What `typeChangeStatus` decided, as a string to compare with what it
 * decided before: `undefined` when there was nothing to decide, `"allowed"`,
 * or `"mismatch:"` and the diagnostic.
 */
function typeChangeKey(typeChange) {
    if (typeChange === undefined) {
        return undefined;
    }
    if (typeChange === null) {
        return "allowed";
    }
    return `mismatch:${typeChange.level}:${typeChange.diagnostic.message}`;
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
 * What the `<group>` an iteration, a pick or a case is made as is, by
 * `instanceOf`, the type of the component that made it (`_instanceOf`):
 * `iteration`, `pick` or `case`, or `other` for any other `<group>`.
 */
function containerKind(instanceOf) {
    if (instanceOf === "conditionalContent") {
        return "case";
    }
    const kind = instanceKindOf(instanceOf);
    return kind === "iteration" || kind === "pick" ? kind : "other";
}

/**
 * The composites whose content is fixed by the document, so that a type
 * change of one that does not match is a mistake in what the author wrote
 * (an error), not a state the document is in for now (an info).
 */
const COMPOSITES_WITH_WRITTEN_CONTENT = new Set(["group", "_copy"]);

/**
 * Whether the `extend` or `copy` `component`, written as a different tag than
 * what it is of, makes something allowed (D26, REF-5, `utils/typeChange.js`):
 * - `undefined` when there is nothing to decide: the copy is not one an
 *   author wrote as a tag (`_copyInChildren`), it is written as a list or a
 *   `<group>`, it is of a `<setup>`, or what it copies is not known yet (a
 *   reference that names nothing yet, content not yet expanded or holding a
 *   list, a prop that makes several components);
 * - `null` when the type change is allowed;
 * - otherwise `{ level, diagnostic }`, the mismatch: `level` is `"error"`
 *   when it follows from what the author wrote, and `"info"` when from what
 *   the document makes at run time (the active case, the pick, how many
 *   components a collect holds, a math's value), during which nothing is
 *   shown (DIAG-2).
 *
 * A composite stands for its content when that is exactly one component
 * (D27): `<text extend="$cc"/>` while the active case holds one text. Its
 * content is read from the components it has made, so the composite must be
 * expanded, as an `extend` or `copy` of it waits for
 * (`needsReplacementsUpdatedWhenStale`, `unlinkedTargetsExpanded`). An
 * `extend` is decided again when that content, or the value of a math in it,
 * changes (`typeChangeValueCheck`), through every composite it made.
 *
 * `propReplacements` are the replacements made of a prop (`$P.coords`),
 * whose type is the source's; without them, a copy of a prop is not decided.
 *
 * `contentFound.identity` is set to the components a composite's content was
 * found to be, as a string, so that a change of only their values can be told
 * from a change of what they are (`calculateReplacementChanges`).
 */
async function typeChangeStatus({
    component,
    components,
    componentInfoObjects,
    propReplacements,
    contentFound = {},
}) {
    if (!component.attributes._copyInChildren?.primitive?.value) {
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
    function mismatch({ level, code, args }) {
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
     * whose value, if one must be checked, is read by `readValue`.
     */
    async function decide({ sourceType, readValue, level }) {
        if (
            replacementIsOfType(sourceType, writtenType) ||
            sourceType === "_error"
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
        if (rule.kind === "inputFromValue") {
            return mismatch({
                level,
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
        if (rule.kind === "container") {
            return mismatch({
                level,
                code: "doenet-e0063",
                args: { sourceType },
            });
        }
        if (!rule.allowed) {
            return mismatch({
                level,
                code: "doenet-e0065",
                args: { sourceType },
            });
        }
        if (rule.valueCheck && readValue) {
            const value = await readValue();
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
        return decide({
            sourceType: typeStoodFor(nonStrings[0]),
            level: "error",
        });
    }

    /** The value of `comp`, or of the value of an input. */
    function valueReader(comp) {
        return async () => comp.stateValues.value;
    }

    const sourceType = typeStoodFor(sourceComponent);
    if (sourceType === "_error" || sourceType === "setup") {
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
        return mismatch({
            level: "error",
            code: "doenet-e0065",
            args: { sourceType },
        });
    }

    if (sourceClass?.listEntryComponentType !== undefined) {
        // A list stands for its entries, as a composite for its content. A
        // list whose entries are written (`<mathList>`) has as many as the
        // author wrote; any other is made at run time (a `<collect>` or
        // `<sort>` of values, a `<selectFromSequence>`).
        if (replacementIsOfType(sourceType, writtenType)) {
            return null;
        }
        const level =
            sourceClass.prototype instanceof AuthoredValueList &&
            !Object.hasOwn(TAGS_OF_LIST_FORMS, sourceType)
                ? "error"
                : "info";
        const count = await sourceComponent.stateValues.numEntries;
        if (count !== 1) {
            return mismatch({
                level,
                code: "doenet-e0064",
                args: {
                    sourceType,
                    container: "other",
                    count,
                    holdsNothing: count === 0 ? "true" : "false",
                    // An index selects an entry of a list.
                    indexSelectsOne: "true",
                },
            });
        }
        return decide({
            sourceType: sourceClass.listEntryComponentType,
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
            readValue: valueReader(sourceComponent),
            level: "error",
        });
    }

    if (!sourceComponent.isExpanded) {
        return undefined;
    }

    // The components the composite stands for, through any composites it
    // made, and whether any of those can change what they hold.
    const content = [];
    let changes = !COMPOSITES_WITH_WRITTEN_CONTENT.has(sourceType);
    let allExpanded = true;
    // Whether the content holds a list, which is not decided: what a list
    // stands for, its entries, can change without the composite making new
    // replacements, which is all an `extend` of it is updated for.
    let holdsList = false;
    // How many components each instance of the source (its iterations,
    // picks or items) holds, and so whether `$x[1]` would select one
    // component.
    const instanceSizes = [];
    // What was gathered, composites and strings included (`contentFound`).
    const identityParts = [];
    async function gather(composite, depth = 0) {
        let replacements = composite.replacements ?? [];
        if (composite.replacementsToWithhold > 0) {
            replacements = replacements.slice(
                0,
                -composite.replacementsToWithhold,
            );
        }
        for (const replacement of replacements) {
            const before = content.length;
            if ((await gatherOne(replacement, depth)) && depth === 0) {
                instanceSizes.push(content.length - before);
            }
        }
    }
    /**
     * Adds what `replacement` stands for to `content`; returns whether it is
     * content at all (not a blank string or an inactive replacement).
     */
    async function gatherOne(replacement, depth) {
        if (typeof replacement === "string") {
            if (replacement.trim() === "") {
                return false;
            }
            identityParts.push(JSON.stringify(replacement));
            content.push({ componentType: "text" });
            return true;
        }
        const comp = components[replacement.componentIdx];
        if (
            !comp ||
            comp.componentType === "setup" ||
            (await comp.stateValues.isInactiveCompositeReplacement)
        ) {
            // A `<setup>`, the author's or the one a repeat adds to an
            // iteration for its `valueName`, shows nothing.
            return false;
        }
        identityParts.push(comp.componentIdx);
        if (
            componentInfoObjects.allComponentClasses[comp.componentType]
                ?.listEntryComponentType !== undefined
        ) {
            holdsList = true;
        }
        if (
            componentInfoObjects.isCompositeComponent({
                componentType: comp.componentType,
            })
        ) {
            if (!COMPOSITES_WITH_WRITTEN_CONTENT.has(comp.componentType)) {
                changes = true;
            }
            if (comp.isExpanded) {
                await gather(comp, depth + 1);
            } else {
                allExpanded = false;
            }
        } else {
            content.push(comp);
        }
        return true;
    }
    await gather(sourceComponent);
    contentFound.identity = allExpanded ? identityParts.join(",") : undefined;
    if (holdsList) {
        return undefined;
    }
    if (!allExpanded && content.length < 2) {
        // Decided when it is expanded, which updates an `extend` of it
        // (`needsReplacementsUpdatedWhenStale`). Two components already found
        // are more than one, whatever the rest makes.
        return undefined;
    }

    // An iteration, a pick or a case is made as a `<group>`, which the
    // author did not write; it is named by what made it. What a pick or a
    // case holds is decided at run time, as what a `<select>` or a
    // `<conditionalContent>` holds is.
    const instanceOf =
        sourceComponent.attributes?._instanceOf?.primitive?.value;
    const container = containerKind(instanceOf);
    const level =
        changes || container === "pick" || container === "case"
            ? "info"
            : "error";
    if (content.length !== 1) {
        return mismatch({
            level,
            code: "doenet-e0064",
            args: {
                sourceType: container === "other" ? sourceType : instanceOf,
                container,
                count: content.length,
                holdsNothing: content.length === 0 ? "true" : "false",
                // An index selects an instance, never a child of a
                // `<group>` or of what a `<conditionalContent>` shows
                // (D27), and one component only if each instance is one.
                indexSelectsOne:
                    indexSelectsInstances(sourceType, componentInfoObjects) &&
                    instanceSizes.every((size) => size === 1)
                        ? "true"
                        : "false",
            },
        });
    }
    return decide({
        sourceType: typeStoodFor(content[0]),
        readValue: content[0].stateValues ? valueReader(content[0]) : undefined,
        level,
    });
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
