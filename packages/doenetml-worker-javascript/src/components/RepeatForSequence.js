import CompositeComponent from "./abstract/CompositeComponent";
import { deepClone } from "@doenet/utils";
import {
    gatherVariantComponents,
    setUpVariantSeedAndRng,
} from "../utils/variants";
import {
    returnSequenceValues,
    returnStandardSequenceAttributes,
    returnStandardSequenceStateVariableDefinitions,
} from "../utils/sequence";
import { convertUnresolvedAttributesForComponentType } from "../utils/dast/convertNormalizedDast";
import { createNewComponentIndices } from "../utils/componentIndices";
import { copyStateFromUnlinkedSource, remapExtendIndices } from "./Repeat";
export default class RepeatForSequence extends CompositeComponent {
    static componentType = "repeatForSequence";

    static allowInSchemaAsComponent = ["_inline", "_block", "_graphical"];

    static createsVariants = true;

    static includeBlankStringChildren = true;

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

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
        const attributes = super.createAttributesObject();

        const sequenceAttributes = returnStandardSequenceAttributes();
        Object.assign(attributes, sequenceAttributes);

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
        const stateVariableDefinitions = super.returnStateVariableDefinitions();

        const sequenceDefs = returnStandardSequenceStateVariableDefinitions();
        Object.assign(stateVariableDefinitions, sequenceDefs);

        stateVariableDefinitions.forValues = {
            additionalStateVariablesDefined: ["numIterates"],
            returnDependencies: () => ({
                type: {
                    dependencyType: "stateVariable",
                    variableName: "type",
                },
                length: {
                    dependencyType: "stateVariable",
                    variableName: "length",
                },
                from: {
                    dependencyType: "stateVariable",
                    variableName: "from",
                },
                step: {
                    dependencyType: "stateVariable",
                    variableName: "step",
                },
                exclude: {
                    dependencyType: "stateVariable",
                    variableName: "exclude",
                },
                lowercase: {
                    dependencyType: "stateVariable",
                    variableName: "lowercase",
                },
            }),
            definition({ dependencyValues }) {
                let forValues = returnSequenceValues(dependencyValues);

                return {
                    setValue: {
                        forValues,
                        numIterates: forValues.length,
                    },
                };
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
    }) {
        // console.log(`create serialized replacements for ${component.componentIdx}`);

        let errors = [];
        let warnings = [];

        if (!(await component.stateValues.validSequence)) {
            workspace.lastReplacementParameters = {
                from: null,
                length: null,
                step: null,
                type: null,
                exclude: null,
            };
            return { replacements: [], errors, warnings, nComponents };
        }

        let from = await component.stateValues.from;
        let length = await component.stateValues.length;
        let step = await component.stateValues.step;
        let type = await component.stateValues.type;
        let exclude = await component.stateValues.exclude;

        workspace.lastReplacementParameters = {
            from,
            length,
            step,
            type,
            exclude,
        };

        const numIterates = await component.stateValues.numIterates;

        let replacements = [];

        workspace.valueComponentIndices = [];

        for (let iter = 0; iter < numIterates; iter++) {
            const res = await this.replacementForIter({
                component,
                iter,
                componentInfoObjects,
                components,
                nComponents,
            });
            replacements.push(...res.replacements);
            errors.push(...res.errors);
            warnings.push(...res.warnings);
            nComponents = res.nComponents;
            workspace.valueComponentIndices.push(res.valueComponentIdx);
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
        const valueComponentIdx = aliasResult.valueComponentIdx;

        if (component.unlinkedCopySource && !isUpdate) {
            await copyStateFromUnlinkedSource({
                components,
                component,
                iterateNumber: iter,
                replacement: replacements[0],
            });
        }

        return {
            replacements,
            errors,
            warnings,
            nComponents,
            valueComponentIdx,
        };
    }

    static async calculateReplacementChanges({
        component,
        components,
        workspace,
        componentInfoObjects,
        nComponents,
    }) {
        let errors = [];
        let warnings = [];

        let replacementChanges = [];

        let lrp = { ...workspace.lastReplacementParameters };

        // if invalid, withhold any previous replacements
        if (!(await component.stateValues.validSequence)) {
            let currentReplacementsWithheld = component.replacementsToWithhold;
            if (!currentReplacementsWithheld) {
                currentReplacementsWithheld = 0;
            }

            if (
                component.replacements.length - currentReplacementsWithheld >
                0
            ) {
                let replacementsToWithhold = component.replacements.length;
                let replacementInstruction = {
                    changeType: "changeReplacementsToWithhold",
                    replacementsToWithhold,
                };
                replacementChanges.push(replacementInstruction);
            }

            // leave all previous replacement parameters as they were before
            // except make length zero.
            // That way, if later restore to previous parameter set,
            // we can restore the old replacements
            lrp.length = 0;

            workspace.lastReplacementParameters = lrp;

            return { replacementChanges };
        }

        let from = await component.stateValues.from;
        let length = await component.stateValues.length;
        let step = await component.stateValues.step;
        let type = await component.stateValues.type;
        let exclude = await component.stateValues.exclude;

        // check if changed type
        // or have excluded elements
        // TODO: don't completely recreate if have excluded elements
        if (lrp.type !== type || lrp.exclude.length > 0 || exclude.length > 0) {
            // calculate new serialized replacements
            let replacementResults = await this.createSerializedReplacements({
                component,
                workspace,
                componentInfoObjects,
                nComponents,
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
        } else {
            let modifyExistingValues = false;
            if (type === "math") {
                if (!(from.equals(lrp.from) && step.equals(lrp.step))) {
                    modifyExistingValues = true;
                }
            } else {
                if (from !== lrp.from || step !== lrp.step) {
                    modifyExistingValues = true;
                }
            }

            let prevLength = lrp.length;
            let numReplacementsToAdd = 0;
            let numToModify = 0;
            let firstToModify = prevLength;
            let newReplacementsToWithhold;

            // if have fewer replacements than before
            // mark old replacements as hidden
            if (length < prevLength) {
                newReplacementsToWithhold =
                    component.replacements.length - length;

                let replacementInstruction = {
                    changeType: "changeReplacementsToWithhold",
                    replacementsToWithhold: newReplacementsToWithhold,
                };

                replacementChanges.push(replacementInstruction);
            } else if (length > prevLength) {
                numReplacementsToAdd = length - prevLength;

                if (component.replacementsToWithhold > 0) {
                    if (
                        component.replacementsToWithhold >= numReplacementsToAdd
                    ) {
                        newReplacementsToWithhold =
                            component.replacementsToWithhold -
                            numReplacementsToAdd;
                        numToModify += numReplacementsToAdd;
                        prevLength += numReplacementsToAdd;
                        numReplacementsToAdd = 0;

                        let replacementInstruction = {
                            changeType: "changeReplacementsToWithhold",
                            replacementsToWithhold: newReplacementsToWithhold,
                        };
                        replacementChanges.push(replacementInstruction);
                    } else {
                        numReplacementsToAdd -=
                            component.replacementsToWithhold;
                        numToModify += component.replacementsToWithhold;
                        prevLength += component.replacementsToWithhold;
                        newReplacementsToWithhold = 0;
                        // don't need to send changedReplacementsToWithhold instructions
                        // since will send add instructions,
                        // which will also recalculate replacements in parent
                    }
                }
            }

            if (modifyExistingValues === true) {
                numToModify = prevLength;
                firstToModify = 0;
            }

            if (numToModify > 0) {
                // need to modify values of the first prevLength components

                for (
                    let ind = firstToModify;
                    ind < firstToModify + numToModify;
                    ind++
                ) {
                    if (workspace.valueComponentIndices[ind] != undefined) {
                        const componentValue = (
                            await component.stateValues.forValues
                        )[ind];

                        const replacementInstruction = {
                            changeType: "updateStateVariables",
                            component: {
                                componentIdx:
                                    workspace.valueComponentIndices[ind],
                            },
                            stateChanges: { value: componentValue },
                        };

                        replacementChanges.push(replacementInstruction);
                    }
                }
            }

            if (numReplacementsToAdd > 0) {
                // Need to add more replacement components

                let newSerializedReplacements = [];

                for (
                    let ind = prevLength;
                    ind < (await component.stateValues.length);
                    ind++
                ) {
                    const res = await this.replacementForIter({
                        component,
                        iter: ind,
                        componentInfoObjects,
                        components,
                        nComponents,
                    });
                    newSerializedReplacements.push(...res.replacements);
                    errors.push(...res.errors);
                    warnings.push(...res.warnings);
                    nComponents = res.nComponents;
                    workspace.valueComponentIndices[ind] =
                        res.valueComponentIdx;
                }

                let replacementInstruction = {
                    changeType: "add",
                    changeTopLevelReplacements: true,
                    firstReplacementInd: prevLength,
                    serializedReplacements: newSerializedReplacements,
                    replacementsToWithhold: 0,
                };

                replacementChanges.push(replacementInstruction);
            }
        }
        lrp.type = type;
        lrp.from = from;
        lrp.length = length;
        lrp.step = step;
        lrp.exclude = exclude;

        workspace.lastReplacementParameters = lrp;

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

async function addAndLinkAliasComponents(
    thisRepl,
    component,
    iter,
    nComponents,
) {
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

    let valueComponentIdx;

    if (valueName) {
        valueComponentIdx = nComponents++;
        const valueDummyIdx = await component.stateValues.valueDummyIdx;
        if (valueDummyIdx != null) {
            extendIdxMapping[valueDummyIdx] = valueComponentIdx;
        }

        let type = await component.stateValues.type;
        if (type === "letters") {
            type = "text";
        }

        // Create reference with name `valueName` that will link to sources
        setupComponent.children.push({
            type: "serialized",
            componentType: type,
            componentIdx: valueComponentIdx,
            attributes: {
                name: {
                    type: "primitive",
                    name: "name",
                    primitive: { type: "string", value: valueName },
                },
            },
            doenetAttributes: {},
            children: [],
            state: {
                fixed: true,
                value: (await component.stateValues.forValues)[iter],
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

    return { replacement: newRepl, nComponents, valueComponentIdx };
}
