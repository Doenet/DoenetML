import { SERIALIZE_ENCOUNTERED_COMPONENT_PREFIX } from "./BaseComponent";
import CompositeComponent from "./CompositeComponent";
import ValueListComponent from "./ValueListComponent";
import Group from "../Group";
import {
    postProcessCopy,
    verifyReplacementsMatchSpecifiedType,
    addAttributesToSingleReplacement,
    addAttributesToSingleReplacementChange,
    getSelfReferentialFallbackPropName,
} from "../../utils/copy";
import { flattenDeep, flattenLevels, deepClone } from "@doenet/utils";
import {
    convertAttributeValuesForComponentType,
    primaryEssentialStateVariableOf,
    convertUnresolvedAttributesForComponentType,
} from "../../utils/dast/convertNormalizedDast";
import { createNewComponentIndices } from "../../utils/componentIndices";
import { copyOfLiteralAttribute } from "../../utils/literalAttribute";
import { codedDiagnostic } from "../../utils/diagnostics";
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
        delete attributes.modifyIndirectly;
        delete attributes.fixed;
        delete attributes.fixLocation;
        delete attributes.styleNumber;
        delete attributes.isResponse;
        delete attributes.isPotentialResponse;
        delete attributes.hide;

        attributes.createComponentOfType = {
            createPrimitiveOfType: "string",
        };
        attributes.createComponentIdx = {
            createPrimitiveOfType: "integer",
        };
        attributes.createComponentName = {
            createPrimitiveOfType: "string",
        };
        attributes.numComponents = {
            createPrimitiveOfType: "number",
        };
        attributes.copyInChildren = {
            createPrimitiveOfType: "boolean",
        };
        attributes.uri = {
            createPrimitiveOfType: "string",
            createStateVariable: "uri",
            defaultValue: null,
            public: true,
        };
        attributes.link = {
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

        stateVariableDefinitions.cid = {
            additionalStateVariablesDefined: ["doenetId"],
            returnDependencies: () => ({
                uri: {
                    dependencyType: "stateVariable",
                    variableName: "uri",
                },
            }),
            definition: function ({ dependencyValues }) {
                if (
                    !dependencyValues.uri ||
                    dependencyValues.uri.substring(0, 7).toLowerCase() !==
                        "doenet:"
                ) {
                    return {
                        setValue: { cid: null, doenetId: null },
                    };
                }

                let cid = null,
                    doenetId = null;

                let result = dependencyValues.uri.match(/[:&]cid=([^&]+)/i);
                if (result) {
                    cid = result[1];
                }
                result = dependencyValues.uri.match(/[:&]doenetid=([^&]+)/i);
                if (result) {
                    doenetId = result[1];
                }

                return { setValue: { cid, doenetId } };
            },
        };

        stateVariableDefinitions.createComponentOfType = {
            returnDependencies: () => ({
                typeAttr: {
                    dependencyType: "attributePrimitive",
                    attributeName: "createComponentOfType",
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
                        attributeName: "createComponentOfType",
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

        stateVariableDefinitions.numComponentsSpecified = {
            returnDependencies: () => ({
                numComponentsAttr: {
                    dependencyType: "attributePrimitive",
                    attributeName: "numComponents",
                },
                typeAttr: {
                    dependencyType: "attributePrimitive",
                    attributeName: "createComponentOfType",
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
                    if (dependencyValues.numComponentsAttr !== null) {
                        numComponentsSpecified =
                            dependencyValues.numComponentsAttr;
                    } else {
                        numComponentsSpecified = 1;
                    }
                } else if (dependencyValues.numComponentsAttr !== null) {
                    throw Error(
                        `You must specify createComponentOfType when specifying numComponents for a copy.`,
                    );
                } else {
                    numComponentsSpecified = null;
                }

                return { setValue: { numComponentsSpecified } };
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

        stateVariableDefinitions.needsReplacementsUpdatedWhenStale = {
            stateVariablesDeterminingDependencies: [
                "extendedComponent",
                "replacementSourceIdentities",
                "effectivePropNameBySource",
                "unresolvedPath",
                "link",
                "removeEmptyArrayEntries",
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

        // evaluate numComponentsSpecified so get error if specify numComponents without createComponentOfType
        await component.stateValues.numComponentsSpecified;

        workspace.numReplacementsBySource = [];
        workspace.numNonStringReplacementsBySource = [];
        workspace.propVariablesCopiedBySource = [];
        workspace.sourceIndices = [];

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

            if (component.attributes.copyInChildren?.primitive.value) {
                // even though don't have valid target,
                // if copyInChildren, then include children added directly to component

                let componentType =
                    componentInfoObjects.componentTypeLowerCaseMapping[
                        component.attributes.createComponentOfType.primitive.value.toLowerCase()
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

            if (component.attributes.createComponentOfType?.primitive) {
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
                    component.attributes.copyInChildren?.primitive.value,
            });

            diagnostics.push(...results.diagnostics);
            nComponents = results.nComponents;

            workspace.propVariablesCopiedBySource[sourceNum] =
                results.propVariablesCopiedByReplacement;

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

    static async createReplacementForSource({
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
                            component.attributes.createComponentOfType.primitive.value.toLowerCase()
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
                }),
            ];

            let res = createNewComponentIndices(
                serializedReplacements,
                nComponents,
                stateIdInfo,
            );
            serializedReplacements = res.components;
            nComponents = res.nComponents;
        } catch (e) {
            // When the error is "Encountered X", it means this Copy is a descendant of its
            // own source component (a self-referential copy, e.g., `$a` inside `a`'s label).
            // In recognized rendering contexts, fall back to the source's public `value`
            // state variable rather than showing an error.
            if (e.message?.startsWith(SERIALIZE_ENCOUNTERED_COMPONENT_PREFIX)) {
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
                        component.attributes.createComponentOfType?.primitive
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
            return { serializedReplacements, diagnostics, nComponents };
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
            workspace.numReplacementsBySource = [];
            workspace.numNonStringReplacementsBySource = [];
            workspace.propVariablesCopiedBySource = [];

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

        let maxSourceLength = Math.max(
            replacementSourceIdentities.length,
            workspace.numReplacementsBySource.length,
        );

        let recreateRemaining = false;

        let numSourcesRecreated = 0;

        for (let sourceNum = 0; sourceNum < maxSourceLength; sourceNum++) {
            let numComponentsForSource;

            if (component.attributes.createComponentOfType?.primitive) {
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
                        workspace.numReplacementsBySource
                            .slice(sourceNum)
                            .forEach(
                                (v, i) =>
                                    (workspace.numReplacementsBySource[i] = 0),
                            );
                        workspace.numNonStringReplacementsBySource
                            .slice(sourceNum)
                            .forEach(
                                (v, i) =>
                                    (workspace.numNonStringReplacementsBySource[
                                        i
                                    ] = 0),
                            );
                    }
                }

                numReplacementsBySource[sourceNum] = 0;
                numNonStringReplacementsBySource[sourceNum] = 0;
                propVariablesCopiedBySource.push([]);

                continue;
            }

            let prevSourceIdx = workspace.sourceIndices[sourceNum];

            // check if replacementSource has changed
            let needToRecreate =
                prevSourceIdx === undefined ||
                replacementSource.componentIdx !== prevSourceIdx ||
                recreateRemaining;

            if (!needToRecreate) {
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
                        workspace.numReplacementsBySource
                            .slice(sourceNum)
                            .forEach(
                                (v, i) =>
                                    (workspace.numReplacementsBySource[i] = 0),
                            );
                        workspace.numNonStringReplacementsBySource
                            .slice(sourceNum)
                            .forEach(
                                (v, i) =>
                                    (workspace.numNonStringReplacementsBySource[
                                        i
                                    ] = 0),
                            );
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
                    component.attributes.copyInChildren?.primitive.value,
            });
            diagnostics.push(...results.diagnostics);
            const nComponentsForNew = results.nComponents;

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
                workspace.numReplacementsBySource
                    .slice(sourceNum)
                    .forEach(
                        (v, i) => (workspace.numReplacementsBySource[i] = 0),
                    );
                workspace.numNonStringReplacementsBySource
                    .slice(sourceNum)
                    .forEach(
                        (v, i) =>
                            (workspace.numNonStringReplacementsBySource[i] = 0),
                    );
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
                component.attributes.copyInChildren?.primitive.value,
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
            };
        } else {
            return {
                numReplacements: 0,
                numNonStringReplacements: 0,
                propVariablesCopiedByReplacement,
                replacementInstruction: null,
                diagnostics,
                nComponents,
            };
        }
    }
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
    // index both set `createComponentOfType`, and the component they ask for
    // is made as it always was.
    const parentClass = component.ancestors[0]?.componentClass;
    const mayBeValueReference =
        link && !component.attributes.createComponentOfType?.primitive;

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
                                    if (!usedDefault) {
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
 * Warnings for what an `extend` of a composite or a list cannot apply
 * (#2041). `copyInChildren` marks a `_copy` an author wrote as `extend=` or
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

    const declaredAttributes = replacementClass.createAttributesObject();
    const sharedAttributes = new Set([
        ...Object.keys(
            (isComposite
                ? CompositeComponent
                : ValueListComponent
            ).createAttributesObject(),
        ),
        // The number-display attributes, where they apply: a class that
        // declares them, and a `<collect>`, which passes them on to the
        // copies it makes. A `<module>` reads one only as a parameter of
        // its own, which its extend ignores as any other.
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
        // The `_copy`'s own attributes (`createComponentIdx`,
        // `copyInChildren`, …), which a class that accepts any attribute
        // (`<module>`, `<collect>`) is handed along with the author's.
        ...copyAttributeNames,
    ]);

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
