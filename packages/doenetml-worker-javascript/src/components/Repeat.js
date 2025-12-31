import CompositeComponent from "./abstract/CompositeComponent";
import { deepClone } from "@doenet/utils";
import {
    gatherVariantComponents,
    setUpVariantSeedAndRng,
} from "../utils/variants";
import {
    addSource,
    convertUnresolvedAttributesForComponentType,
    unwrapSource,
} from "../utils/dast/convertNormalizedDast";
import { createNewComponentIndices } from "../utils/componentIndices";
export default class Repeat extends CompositeComponent {
    static componentType = "repeat";

    static allowInSchemaAsComponent = ["_inline", "_block", "_graphical"];

    static createsVariants = true;

    static includeBlankStringChildren = true;

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    // Since we add components with names into the `for` attribute
    // (which cannot be done with DoenetML)
    // we need to add the `for` attribute to the resolver
    static addAttributeToResolver = "for";

    static keepChildrenSerialized({ serializedComponent }) {
        if (serializedComponent.children === undefined) {
            return [];
        } else {
            return Object.keys(serializedComponent.children);
        }
    }

    // since don't have child groups, tell schema about children here
    static additionalSchemaChildren = ["_base"];

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.valueName = {
            createPrimitiveOfType: "string",
            createStateVariable: "valueName",
            defaultValue: null,
        };

        attributes.indexName = {
            createPrimitiveOfType: "string",
            createStateVariable: "indexName",
            defaultValue: null,
        };

        attributes.for = {
            createComponentOfType: "group",
        };

        attributes.type = {
            createPrimitiveOfType: "string",
        };

        attributes.isResponse = {
            leaveRaw: true,
        };

        attributes.asList = {
            createPrimitiveOfType: "boolean",
            createStateVariable: "asList",
            defaultValue: true,
        };

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.sourcesComponentIdx = {
            returnDependencies: () => ({
                forAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "for",
                },
            }),
            definition({ dependencyValues }) {
                let sourcesComponentIdx = null;
                if (dependencyValues.forAttr) {
                    sourcesComponentIdx = dependencyValues.forAttr.componentIdx;
                }
                return { setValue: { sourcesComponentIdx } };
            },
        };

        stateVariableDefinitions.numIterates = {
            additionalStateVariablesDefined: ["sourcesChildIndices"],
            stateVariablesDeterminingDependencies: ["sourcesComponentIdx"],
            returnDependencies: ({ stateValues }) => {
                if (stateValues.sourcesComponentIdx != null) {
                    return {
                        sources: {
                            dependencyType: "replacement",
                            compositeIdx: stateValues.sourcesComponentIdx,
                            recursive: true,
                            recurseNonStandardComposites: true,
                        },
                    };
                } else {
                    return {};
                }
            },
            definition: function ({ dependencyValues }) {
                if (dependencyValues.sources) {
                    const nonBlankSources = dependencyValues.sources.filter(
                        (s) => typeof s !== "string" || s.trim() !== "",
                    );

                    let numIterates = nonBlankSources.length;
                    let sourcesChildIndices = nonBlankSources.map(
                        (x) => x.componentIdx,
                    );

                    return {
                        setValue: {
                            numIterates,
                            sourcesChildIndices,
                        },
                    };
                } else {
                    return {
                        setValue: { numIterates: 0, sourcesChildIndices: [] },
                    };
                }
            },
        };

        stateVariableDefinitions.serializedChildren = {
            additionalStateVariablesDefined: ["valueDummyIdx", "indexDummyIdx"],
            returnDependencies: () => ({
                serializedChildren: {
                    dependencyType: "serializedChildren",
                    doNotProxy: true,
                },
            }),
            definition: function ({ dependencyValues }) {
                let valueDummyIdx = null;
                let indexDummyIdx = null;

                const repeatSetup = dependencyValues.serializedChildren.find(
                    (child) => child.componentType === "_repeatSetup",
                );

                if (repeatSetup != undefined) {
                    for (const child of repeatSetup.children) {
                        if (child.componentType === "_placeholder") {
                            valueDummyIdx = child.componentIdx;
                        } else if (child.componentType === "integer") {
                            indexDummyIdx = child.componentIdx;
                        }
                    }
                }

                const serializedChildren =
                    dependencyValues.serializedChildren.filter(
                        (child) => child.componentType !== "_repeatSetup",
                    );

                // Trim of leading whitespace
                if (serializedChildren.length > 0) {
                    if (typeof serializedChildren[0] === "string") {
                        const trimmed = serializedChildren[0].trimStart();
                        if (trimmed.length > 0) {
                            serializedChildren[0] = trimmed;
                        } else {
                            serializedChildren.splice(0, 1);
                        }
                    }
                }
                // Trim of trailing whitespace
                const n = serializedChildren.length;
                if (n > 0) {
                    if (typeof serializedChildren[n - 1] === "string") {
                        const trimmed = serializedChildren[n - 1].trimEnd();
                        if (trimmed.length > 0) {
                            serializedChildren[n - 1] = trimmed;
                        } else {
                            serializedChildren.pop();
                        }
                    }
                }

                return {
                    setValue: {
                        serializedChildren,
                        valueDummyIdx,
                        indexDummyIdx,
                    },
                };
            },
        };

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({
                numIterates: {
                    dependencyType: "stateVariable",
                    variableName: "numIterates",
                },
            }),
            // when this state variable is marked stale
            // it indicates we should update replacement
            // For this to work, must get value in replacement functions
            // so that the variable is marked fresh
            markStale: () => ({ updateReplacements: true }),
            definition: function () {
                return { setValue: { readyToExpandWhenResolved: true } };
            },
        };

        stateVariableDefinitions.isVariantComponent = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { isVariantComponent: true } }),
        };

        stateVariableDefinitions.generatedVariantInfo = {
            returnDependencies: ({
                sharedParameters,
                componentInfoObjects,
            }) => ({
                variantSeed: {
                    dependencyType: "value",
                    value: sharedParameters.variantSeed,
                },
                variantDescendants: {
                    dependencyType: "descendant",
                    componentTypes: Object.keys(
                        componentInfoObjects.componentTypesCreatingVariants,
                    ),
                    variableNames: [
                        "isVariantComponent",
                        "generatedVariantInfo",
                    ],
                    useReplacementsForComposites: true,
                    recurseToMatchedChildren: false,
                    variablesOptional: true,
                    includeNonActiveChildren: true,
                    ignoreReplacementsOfEncounteredComposites: true,
                },
            }),
            definition({ dependencyValues, componentIdx }) {
                let generatedVariantInfo = {
                    seed: dependencyValues.variantSeed,
                    meta: {
                        createdBy: componentIdx,
                    },
                };

                let subvariants = (generatedVariantInfo.subvariants = []);
                for (let descendant of dependencyValues.variantDescendants) {
                    if (descendant.stateValues.isVariantComponent) {
                        subvariants.push(
                            descendant.stateValues.generatedVariantInfo,
                        );
                    } else if (descendant.stateValues.generatedVariantInfo) {
                        subvariants.push(
                            ...descendant.stateValues.generatedVariantInfo
                                .subvariants,
                        );
                    }
                }

                return {
                    setValue: {
                        generatedVariantInfo,
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }

    static async createSerializedReplacements({
        component,
        components,
        nComponents,
        workspace,
        componentInfoObjects,
        isUpdate = false,
    }) {
        // console.log(`create serialized replacements for ${component.componentIdx}`);

        let errors = [];
        let warnings = [];

        const numIterates = await component.stateValues.numIterates;

        workspace.lastReplacementParameters = {
            sourcesChildIndices:
                await component.stateValues.sourcesChildIndices,
            numIterates,
            replacementsToWithhold: 0,
            withheldSubstitutionChildNames: [],
        };

        let replacements = [];

        for (let iter = 0; iter < numIterates; iter++) {
            const res = await this.replacementForIter({
                component,
                iter,
                componentInfoObjects,
                components,
                nComponents,
                isUpdate,
            });
            replacements.push(...res.replacements);
            errors.push(...res.errors);
            warnings.push(...res.warnings);
            nComponents = res.nComponents;
        }

        return { replacements, errors, warnings, nComponents };
    }

    static async replacementForIter({
        component,
        iter,
        componentInfoObjects,
        components,
        isUpdate = false,
        nComponents,
    }) {
        let errors = [];
        let warnings = [];

        let replacements = [
            {
                type: "serialized",
                componentType: "group",
                componentIdx: 0, // will be replaced, below
                attributes: {},
                doenetAttributes: {},
                state: {},
                children: deepClone(
                    await component.stateValues.serializedChildren,
                ),
            },
        ];

        const idxResult = createNewComponentIndices(replacements, nComponents);
        replacements = idxResult.components;
        nComponents = idxResult.nComponents;

        let compositeAttributesObj = this.createAttributesObject();

        // pass isResponse to replacements
        // (only isResponse will be copied, as it is only attribute with leaveRaw)

        const res = convertUnresolvedAttributesForComponentType({
            attributes: component.attributes,
            componentType: replacements[0].componentType,
            componentInfoObjects,
            compositeAttributesObj,
            nComponents,
        });

        const attributesFromComposite = res.attributes;
        nComponents = res.nComponents;

        Object.assign(replacements[0].attributes, attributesFromComposite);

        const aliasResult = await addAndLinkAliasComponents(
            replacements[0],
            component,
            iter,
            nComponents,
        );

        replacements[0] = aliasResult.replacement;
        nComponents = aliasResult.nComponents;

        if (component.unlinkedCopySource && !isUpdate) {
            await copyStateFromUnlinkedSource({
                components,
                component,
                iterateNumber: iter,
                replacement: replacements[0],
            });
        }

        return { replacements, errors, warnings, nComponents };
    }

    static async calculateReplacementChanges({
        component,
        components,
        workspace,
        componentInfoObjects,
        nComponents,
    }) {
        // console.log(`calculate replacement changes for ${component.componentIdx}`)

        let errors = [];
        let warnings = [];

        let replacementChanges = [];

        let lrp = workspace.lastReplacementParameters;
        let recreateReplacements = false;

        let numIterates = await component.stateValues.numIterates;
        let sourcesChildIndices =
            await component.stateValues.sourcesChildIndices;

        let allSameChildSubstitutionNames = true;

        if (lrp.numIterates === undefined) {
            recreateReplacements = true;
        } else {
            let currentNIters = numIterates;
            let prevNIters = lrp.numIterates;
            if (currentNIters !== prevNIters) {
                allSameChildSubstitutionNames = false;
            }
            let minNiters = Math.min(currentNIters, prevNIters);
            for (let ind = 0; ind < minNiters; ind++) {
                if (sourcesChildIndices[ind] != lrp.sourcesChildIndices[ind]) {
                    recreateReplacements = true;
                    allSameChildSubstitutionNames = false;
                    break;
                }
            }
        }

        if (allSameChildSubstitutionNames) {
            // if all childSubstitutionNames are unchanged, don't do anything
            return { replacementChanges: [], nComponents };
        }

        if (recreateReplacements) {
            let replacementResults = await this.createSerializedReplacements({
                component,
                components,
                workspace,
                componentInfoObjects,
                nComponents,
                isUpdate: true,
            });

            let newSerializedReplacements = replacementResults.replacements;
            errors.push(...replacementResults.errors);
            warnings.push(...replacementResults.warnings);
            nComponents = replacementResults.nComponents;

            let replacementInstruction = {
                changeType: "add",
                changeTopLevelReplacements: true,
                firstReplacementInd: 0,
                numberReplacementsToReplace: component.replacements.length,
                serializedReplacements: newSerializedReplacements,
                replacementsToWithhold: 0,
            };

            replacementChanges.push(replacementInstruction);

            workspace.lastReplacementParameters = {
                sourcesChildIndices,
                numIterates,
                replacementsToWithhold: 0,
                withheldSubstitutionChildNames: [],
            };

            return { replacementChanges, nComponents };
        }

        let currentNumIterates = await component.stateValues.numIterates;
        let prevNumIterates = lrp.numIterates;
        let newReplacementsToWithhold = 0;
        let currentReplacementsToWithhold = component.replacementsToWithhold;
        if (!currentReplacementsToWithhold) {
            currentReplacementsToWithhold = 0;
        }
        let withheldSubstitutionChildNames = lrp.withheldSubstitutionChildNames;

        // Check if any previous substitution child names
        // or any previously withheld child names
        // correspond to components that are now deleted

        let foundDeletedSourcesChild = false;
        if (currentNumIterates < prevNumIterates) {
            for (let ind = currentNumIterates; ind < prevNumIterates; ind++) {
                if (components[lrp.sourcesChildIndices[ind]] === undefined) {
                    foundDeletedSourcesChild = true;
                }
            }

            if (!foundDeletedSourcesChild) {
                // check if any of the previously withheld substitutionChildNames are deleted
                for (let name of lrp.withheldSubstitutionChildNames) {
                    if (components[name] === undefined) {
                        foundDeletedSourcesChild = true;
                    }
                }
            }
        }

        if (foundDeletedSourcesChild) {
            // delete all the extra replacements
            let firstReplacementToDelete = Math.min(
                currentNumIterates,
                prevNumIterates,
            );
            let numberReplacementsToDelete =
                component.replacements.length - firstReplacementToDelete;
            let replacementInstruction = {
                changeType: "delete",
                changeTopLevelReplacements: true,
                firstReplacementInd: firstReplacementToDelete,
                numberReplacementsToDelete,
                replacementsToWithhold: 0,
            };
            replacementChanges.push(replacementInstruction);

            withheldSubstitutionChildNames = [];
            currentReplacementsToWithhold = 0;
        }

        // if have fewer iterates than before
        // mark old replacements as hidden
        // unless one of the former sources child names does not exist
        if (currentNumIterates < prevNumIterates) {
            if (!foundDeletedSourcesChild) {
                newReplacementsToWithhold =
                    component.replacements.length - currentNumIterates;

                let replacementInstruction = {
                    changeType: "changeReplacementsToWithhold",
                    replacementsToWithhold: newReplacementsToWithhold,
                };
                replacementChanges.push(replacementInstruction);

                let withheldNames = lrp.withheldSubstitutionChildNames;
                if (withheldNames) {
                    withheldNames = [...withheldNames];
                } else {
                    withheldNames = [];
                }
                withheldNames = new Set([
                    ...lrp.sourcesChildIndices.slice(currentNumIterates),
                    ...withheldNames,
                ]);

                withheldSubstitutionChildNames = withheldNames;
            }
        } else if (currentNumIterates > prevNumIterates) {
            let numReplacementsToAdd = currentNumIterates - prevNumIterates;

            if (currentReplacementsToWithhold > 0) {
                if (currentReplacementsToWithhold >= numReplacementsToAdd) {
                    newReplacementsToWithhold =
                        currentReplacementsToWithhold - numReplacementsToAdd;
                    numReplacementsToAdd = 0;

                    let replacementInstruction = {
                        changeType: "changeReplacementsToWithhold",
                        replacementsToWithhold: newReplacementsToWithhold,
                    };
                    replacementChanges.push(replacementInstruction);
                } else {
                    numReplacementsToAdd -= currentReplacementsToWithhold;
                    prevNumIterates += currentReplacementsToWithhold;
                    newReplacementsToWithhold = 0;
                    // don't need to send changedReplacementsToWithhold instructions
                    // since will send add instructions,
                    // which will also recalculate replacements in parent
                }
            }

            if (numReplacementsToAdd > 0) {
                let replacements = [];

                for (
                    let iter = prevNumIterates;
                    iter < currentNumIterates;
                    iter++
                ) {
                    let res = await this.replacementForIter({
                        component,
                        iter,
                        componentInfoObjects,
                        components,
                        isUpdate: true,
                        nComponents,
                    });
                    replacements.push(...res.replacements);
                    errors.push(...res.errors);
                    warnings.push(...res.warnings);
                    nComponents = res.nComponents;
                }

                let replacementInstruction = {
                    changeType: "add",
                    changeTopLevelReplacements: true,
                    firstReplacementInd: prevNumIterates,
                    serializedReplacements: replacements,
                    replacementsToWithhold: 0,
                };
                replacementChanges.push(replacementInstruction);
            }
        }

        workspace.lastReplacementParameters = {
            sourcesChildIndices,
            numIterates,
            replacementsToWithhold: newReplacementsToWithhold,
            withheldSubstitutionChildNames,
        };

        return { replacementChanges, nComponents };
    }

    static setUpVariant({
        serializedComponent,
        sharedParameters,
        descendantVariantComponents,
    }) {
        setUpVariantSeedAndRng({
            serializedComponent,
            sharedParameters,
            descendantVariantComponents,
            useSubpartVariantRng: true,
        });
    }

    static determineNumberOfUniqueVariants({
        serializedComponent,
        componentInfoObjects,
    }) {
        let numVariants = serializedComponent.variants?.numVariants;

        if (numVariants !== undefined) {
            return { success: true, numVariants };
        }

        let descendantVariantComponents = gatherVariantComponents({
            serializedComponents: serializedComponent.children,
            componentInfoObjects,
        });

        let numVariantsByDescendant = [];
        for (let descendant of descendantVariantComponents) {
            let descendantClass =
                componentInfoObjects.allComponentClasses[
                    descendant.componentType
                ];
            let result = descendantClass.determineNumberOfUniqueVariants({
                serializedComponent: descendant,
                componentInfoObjects,
            });
            if (!result.success) {
                return { success: false };
            }
            numVariantsByDescendant.push(result.numVariants);
        }

        if (numVariantsByDescendant.every((x) => x === 1)) {
            // we have no extra variants created by our descendants,
            // so will have a single variant even if don't know how many times we are repeated
            serializedComponent.variants.numVariants = 1;

            return {
                success: true,
                numVariants: 1,
            };
        }

        return { success: false };
    }

    static getUniqueVariant({
        serializedComponent,
        variantIndex,
        componentInfoObjects,
    }) {
        let numVariants = serializedComponent.variants?.numVariants;
        if (numVariants === undefined) {
            return { success: false };
        }

        if (
            !Number.isInteger(variantIndex) ||
            variantIndex < 1 ||
            variantIndex > numVariants
        ) {
            return { success: false };
        }

        // so far, only have case where don't have any variants
        // so variantIndex will be one and we don't have subvariants

        let desiredVariant = { index: variantIndex };
        return { success: true, desiredVariant };
    }

    get allPotentialRendererTypes() {
        let allPotentialRendererTypes = super.allPotentialRendererTypes;

        let additionalRendererTypes =
            this.potentialRendererTypesFromSerializedComponents(
                this.serializedChildren,
            );
        for (let rendererType of additionalRendererTypes) {
            if (!allPotentialRendererTypes.includes(rendererType)) {
                allPotentialRendererTypes.push(rendererType);
            }
        }

        return allPotentialRendererTypes;
    }
}

// If a repeat is an unlinked copy of another repeat,
// then when its replacements are created,
// they should be initialized with the current state
// of the original repeat's replacements.
// For example, if the original repeat has points that were
// moved before a snapshot was taken, the snapshot should
// be initialized with the the moved points.
export async function copyStateFromUnlinkedSource({
    components,
    component,
    iterateNumber,
    replacement,
}) {
    let sourceGroup =
        components[component.unlinkedCopySource].replacements[iterateNumber];

    if (sourceGroup) {
        let serializedSourceGroup = await sourceGroup.serialize({
            copyAll: true,
            copyVariants: true,
            copyPrimaryEssential: true,
            copyEssentialState: true,
        });

        copyStateFromUnlinkedSourceSub(
            replacement.children,
            serializedSourceGroup.children,
        );
    }
}

function copyStateFromUnlinkedSourceSub(replacements, sources) {
    for (let [i, repl] of replacements.entries()) {
        let src = sources[i];

        if (
            typeof repl === "object" &&
            repl.componentType === src.componentType
        ) {
            repl.state = src.state;

            if (repl.children && src.children) {
                copyStateFromUnlinkedSourceSub(repl.children, src.children);
            }

            for (let attrName in repl.attributes) {
                if (
                    repl.attributes[attrName].component &&
                    src.attributes[attrName]?.component
                ) {
                    copyStateFromUnlinkedSourceSub(
                        [repl.attributes[attrName].component],
                        [src.attributes[attrName].component],
                    );
                }
            }
        }
    }
}

async function addAndLinkAliasComponents(
    thisRepl,
    component,
    iter,
    nComponents,
) {
    let sourcesComponentIdx = await component.stateValues.sourcesComponentIdx;

    const setupComponent = {
        type: "serialized",
        componentType: "setup",
        componentIdx: nComponents++,
        attributes: {},
        doenetAttributes: {},
        state: {},
        children: [],
    };

    const valueName = await component.stateValues.valueName;

    // a mapping from the dummy or value component indices to the new alias components we're creating
    const extendIdxMapping = {};

    if (valueName) {
        const valueComponentIdx = nComponents++;
        const valueDummyIdx = await component.stateValues.valueDummyIdx;
        if (valueDummyIdx != null) {
            extendIdxMapping[valueDummyIdx] = valueComponentIdx;
        }

        // Create reference with name `valueName` that will link to sources
        setupComponent.children.push({
            type: "serialized",
            componentType: "_copy",
            componentIdx: nComponents++,
            attributes: {
                createComponentIdx: {
                    type: "primitive",
                    name: "createComponentIdx",
                    primitive: { type: "number", value: valueComponentIdx },
                },
                createComponentName: {
                    type: "primitive",
                    name: "createComponentName",
                    primitive: { type: "string", value: valueName },
                },
            },
            doenetAttributes: {},
            children: [],
            state: {},
            extending: {
                Ref: {
                    nodeIdx: sourcesComponentIdx,
                    originalPath: [
                        { name: "", index: [{ value: [`${iter + 1}`] }] },
                    ],
                    unresolvedPath: [
                        // get the item from the sources
                        { name: "", index: [{ value: [`${iter + 1}`] }] },
                    ],
                    nodesInResolvedPath: [sourcesComponentIdx],
                },
            },
        });
    }

    const indexName = await component.stateValues.indexName;

    if (indexName) {
        const indexComponentIdx = nComponents++;
        const indexDummyIdx = await component.stateValues.indexDummyIdx;
        if (indexDummyIdx != null) {
            extendIdxMapping[indexDummyIdx] = indexComponentIdx;
        }

        setupComponent.children.push({
            type: "serialized",
            componentType: "integer",
            componentIdx: indexComponentIdx,
            attributes: {
                name: {
                    type: "primitive",
                    name: "name",
                    primitive: { type: "string", value: indexName },
                },
            },
            doenetAttributes: {},
            children: [],
            state: { value: iter + 1, fixed: true },
        });
    }

    const newRepl = { ...thisRepl };

    if (Object.keys(extendIdxMapping).length > 0) {
        newRepl.children = remapExtendIndices(
            thisRepl.children,
            extendIdxMapping,
        );
    }

    newRepl.children.push(setupComponent);

    return { replacement: newRepl, nComponents };
}

export function remapExtendIndices(components, extendIdxMapping) {
    const newComponents = [];
    for (const comp of components) {
        if (typeof comp === "string") {
            newComponents.push(comp);
            continue;
        }

        let newComponent = { ...comp };
        const extending = newComponent.extending;
        if (extending) {
            const refResolution = unwrapSource(extending);

            const newRefResolution = { ...refResolution };

            const remapIdx = extendIdxMapping[refResolution.nodeIdx];
            if (remapIdx != undefined) {
                newRefResolution.nodeIdx = remapIdx;
            }

            if (refResolution.unresolvedPath) {
                newRefResolution.unresolvedPath = remapExtendIndicesInPath(
                    refResolution.unresolvedPath,
                    extendIdxMapping,
                );
            }

            newRefResolution.originalPath = remapExtendIndicesInPath(
                refResolution.originalPath,
                extendIdxMapping,
            );

            newRefResolution.nodesInResolvedPath =
                refResolution.nodesInResolvedPath.map((idx) => {
                    const remapIdx = extendIdxMapping[idx];
                    if (remapIdx != undefined) {
                        return remapIdx;
                    } else {
                        return idx;
                    }
                });

            newComponent.extending = addSource(newRefResolution, extending);
        }

        newComponent.children = remapExtendIndices(
            newComponent.children,
            extendIdxMapping,
        );

        const attributes = { ...newComponent.attributes };
        for (const attrName in attributes) {
            const attr = attributes[attrName];
            if (attr.type === "component") {
                attr.component = remapExtendIndices(
                    [attr.component],
                    extendIdxMapping,
                )[0];
            } else if (attr.type === "references") {
                attr.references = remapExtendIndices(
                    attr.references,
                    extendIdxMapping,
                );
            } else if (attr.type === "unresolved") {
                attr.children = remapExtendIndices(
                    attr.children,
                    extendIdxMapping,
                );
            }
        }

        newComponent.attributes = attributes;

        newComponents.push(newComponent);
    }

    return newComponents;
}
function remapExtendIndicesInPath(path, extendIdxMapping) {
    const unresolvedPath = [];
    for (const pathPath of path) {
        const newPathPart = { ...pathPath };
        const index = [];
        for (const indexPart of newPathPart.index) {
            const newIndexPart = { ...indexPart };

            newIndexPart.value = remapExtendIndices(
                newIndexPart.value,
                extendIdxMapping,
            );
            index.push(newIndexPart);
        }
        newPathPart.index = index;
        unresolvedPath.push(newPathPart);
    }
    return unresolvedPath;
}
