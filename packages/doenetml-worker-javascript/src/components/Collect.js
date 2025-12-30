import CompositeComponent from "./abstract/CompositeComponent";
import { postProcessCopy } from "../utils/copy";
import { convertUnresolvedAttributesForComponentType } from "../utils/dast/convertNormalizedDast";
import { createNewComponentIndices } from "../utils/componentIndices";
export default class Collect extends CompositeComponent {
    static componentType = "collect";

    static allowInSchemaAsComponent = ["_inline", "_block", "_graphical"];

    static acceptAnyAttribute = true;

    static stateVariableToEvaluateAfterReplacements =
        "needsReplacementsUpdatedWhenStale";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        // delete off attributes from base component that should apply to replacements instead
        // (using acceptAnyAttribute)
        delete attributes.disabled;
        delete attributes.modifyIndirectly;
        delete attributes.fixed;
        delete attributes.styleNumber;
        delete attributes.isResponse;
        delete attributes.hide;

        attributes.maxNumber = {
            createComponentOfType: "number",
            createStateVariable: "maxNumber",
            defaultValue: null,
            public: true,
        };

        attributes.from = {
            createReferences: true,
        };

        attributes.componentType = {
            createComponentOfType: "text",
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

        stateVariableDefinitions.link = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { link: true } }),
        };

        stateVariableDefinitions.sourceComponentIdx = {
            returnDependencies: () => ({
                from: {
                    dependencyType: "attributeRefResolutions",
                    attributeName: "from",
                },
            }),
            definition({ dependencyValues }) {
                if (
                    dependencyValues.from?.length === 1 &&
                    dependencyValues.from[0].unresolvedPath === null
                ) {
                    return {
                        setValue: {
                            sourceComponentIdx:
                                dependencyValues.from[0].componentIdx,
                        },
                    };
                } else {
                    return {
                        setValue: {
                            sourceComponentIdx: null,
                        },
                    };
                }
            },
        };

        stateVariableDefinitions.sourceComponent = {
            stateVariablesDeterminingDependencies: ["sourceComponentIdx"],
            returnDependencies({ stateValues }) {
                if (stateValues.sourceComponentIdx != null) {
                    return {
                        sourceComponent: {
                            dependencyType: "componentIdentity",
                            componentIdx: stateValues.sourceComponentIdx,
                        },
                    };
                } else {
                    return {};
                }
            },
            definition: function ({ dependencyValues }) {
                let sourceComponent = null;
                if (dependencyValues.sourceComponent) {
                    sourceComponent = dependencyValues.sourceComponent;
                }

                return {
                    setValue: { sourceComponent },
                };
            },
        };

        stateVariableDefinitions.sourceInactive = {
            stateVariablesDeterminingDependencies: ["sourceComponent"],
            returnDependencies({ stateValues }) {
                if (stateValues.sourceComponent) {
                    return {
                        sourceIsInactiveCompositeReplacement: {
                            dependencyType: "stateVariable",
                            componentIdx:
                                stateValues.sourceComponent.componentIdx,
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
                        sourceInactive: Boolean(
                            dependencyValues.sourceIsInactiveCompositeReplacement,
                        ),
                    },
                };
            },
        };

        stateVariableDefinitions.sourceName = {
            returnDependencies: () => ({
                sourceComponent: {
                    dependencyType: "stateVariable",
                    variableName: "sourceComponent",
                },
            }),
            definition: function ({ dependencyValues }) {
                if (dependencyValues.sourceComponent === null) {
                    let warning = {
                        message: "No source found for collect.",
                        level: 1,
                    };
                    return {
                        setValue: { sourceName: "" },
                        sendWarnings: [warning],
                    };
                }
                return {
                    setValue: {
                        sourceName:
                            dependencyValues.sourceComponent.componentIdx,
                    },
                };
            },
        };

        stateVariableDefinitions.componentTypeToCollect = {
            shadowVariable: true,
            returnDependencies: () => ({
                componentTypeAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "componentType",
                    variableNames: ["value"],
                },
            }),
            definition: function ({ dependencyValues, componentInfoObjects }) {
                let componentTypeToCollect = null;
                let warnings = [];

                if (dependencyValues.componentTypeAttr !== null) {
                    const cType =
                        dependencyValues.componentTypeAttr.stateValues.value;
                    let componentType =
                        componentInfoObjects.componentTypeLowerCaseMapping[
                            cType.toLowerCase()
                        ];
                    let cClass =
                        componentInfoObjects.allComponentClasses[componentType];

                    if (cClass) {
                        componentTypeToCollect = componentType;
                    } else {
                        let message =
                            "Cannot collect components of type <" +
                            cType +
                            "> as it is an invalid component type.";
                        warnings.push({ message, level: 1 });
                    }
                }

                return {
                    setValue: {
                        componentTypeToCollect,
                    },
                    sendWarnings: warnings,
                };
            },
        };

        stateVariableDefinitions.collectedComponents = {
            stateVariablesDeterminingDependencies: [
                "componentTypeToCollect",
                "sourceName",
            ],
            returnDependencies: function ({ stateValues }) {
                if (!stateValues.sourceName) {
                    return {};
                }

                let descendants = {
                    dependencyType: "descendant",
                    ancestorIdx: stateValues.sourceName,
                    componentTypes: [stateValues.componentTypeToCollect],
                    useReplacementsForComposites: true,
                    includeNonActiveChildren: true,
                    recurseToMatchedChildren: false,
                };

                return {
                    descendants,
                    maxNumber: {
                        dependencyType: "stateVariable",
                        variableName: "maxNumber",
                    },
                };
            },
            definition: function ({ dependencyValues }) {
                // console.log(`definition of collectedComponents for ${componentIdx}`)
                // console.log(dependencyValues)

                let collectedComponents = dependencyValues.descendants;
                if (!collectedComponents) {
                    collectedComponents = [];
                }

                if (
                    dependencyValues.maxNumber !== null &&
                    collectedComponents.length > dependencyValues.maxNumber
                ) {
                    let maxnum = Math.max(
                        0,
                        Math.floor(dependencyValues.maxNumber),
                    );
                    collectedComponents = collectedComponents.slice(0, maxnum);
                }

                return { setValue: { collectedComponents } };
            },
        };

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({
                collectedComponents: {
                    dependencyType: "stateVariable",
                    variableName: "collectedComponents",
                },
                needsReplacementsUpdatedWhenStale: {
                    dependencyType: "stateVariable",
                    variableName: "needsReplacementsUpdatedWhenStale",
                },
            }),
            definition: () => ({
                setValue: { readyToExpandWhenResolved: true },
            }),
        };

        stateVariableDefinitions.needsReplacementsUpdatedWhenStale = {
            returnDependencies() {
                return {
                    collectedComponents: {
                        dependencyType: "stateVariable",
                        variableName: "collectedComponents",
                    },
                };
            },
            // the whole point of this state variable is to return updateReplacements
            // on mark stale
            markStale() {
                return { updateReplacements: true };
            },
            definition() {
                return {
                    setValue: { needsReplacementsUpdatedWhenStale: true },
                };
            },
        };

        return stateVariableDefinitions;
    }

    static async createSerializedReplacements({
        component,
        components,
        workspace,
        componentInfoObjects,
        numComponentsForSource,
        publicCaseInsensitiveAliasSubstitutions,
        nComponents,
    }) {
        // console.log(`create serialized replacements for ${component.componentIdx}`)
        // console.log(await component.stateValues.collectedComponents)

        let errors = [];
        let warnings = [];

        workspace.numReplacementsByCollected = [];
        workspace.collectedNames = [];
        workspace.replacementNamesByCollected = [];

        if (!(await component.stateValues.sourceComponent)) {
            return { replacements: [], errors, warnings, nComponents };
        }

        let replacements = [];

        let numReplacementsByCollected = [];
        let numReplacementsSoFar = 0;
        let replacementNamesByCollected = [];

        let compositeAttributesObj = this.createAttributesObject();

        let collectedComponents =
            await component.stateValues.collectedComponents;
        for (
            let collectedNum = 0;
            collectedNum < collectedComponents.length;
            collectedNum++
        ) {
            if (collectedComponents[collectedNum]) {
                let results = await this.createReplacementForCollected({
                    component,
                    collectedNum,
                    components,
                    numReplacementsSoFar,
                    componentInfoObjects,
                    compositeAttributesObj,
                    numComponentsForSource,
                    publicCaseInsensitiveAliasSubstitutions,
                    nComponents,
                });
                errors.push(...results.errors);
                warnings.push(...results.warnings);
                nComponents = results.nComponents;

                let collectedReplacements = results.serializedReplacements;
                numReplacementsByCollected[collectedNum] =
                    collectedReplacements.length;
                numReplacementsSoFar += collectedReplacements.length;
                replacements.push(...collectedReplacements);
                replacementNamesByCollected[collectedNum] =
                    collectedReplacements.map((x) => x.componentIdx);
            } else {
                numReplacementsByCollected[collectedNum] = 0;
                replacementNamesByCollected[collectedNum] = [];
            }
        }

        workspace.numReplacementsByCollected = numReplacementsByCollected;
        workspace.collectedNames = collectedComponents.map(
            (x) => x.componentIdx,
        );
        workspace.replacementNamesByCollected = replacementNamesByCollected;
        return { replacements, errors, warnings, nComponents };
    }

    static async createReplacementForCollected({
        component,
        components,
        collectedNum,
        numReplacementsSoFar,
        componentInfoObjects,
        compositeAttributesObj,
        numComponentsForSource,
        publicCaseInsensitiveAliasSubstitutions,
        nComponents,
    }) {
        // console.log(`create replacement for collected ${collectedNum}, ${numReplacementsSoFar}`)

        let errors = [];
        let warnings = [];

        let collectedObj = (await component.stateValues.collectedComponents)[
            collectedNum
        ];
        let collectedName = collectedObj.componentIdx;
        let collectedComponent = components[collectedName];

        let serializedReplacements = [];

        // since we delayed recalculating descendants,
        // it's possible that a collectedComponent no longer exists
        // but hasn't been removed from the state variable
        // In this case, skip
        if (!collectedComponent) {
            return {
                serializedReplacements,
                errors,
                warnings,
            };
        }

        serializedReplacements = [await collectedComponent.serialize()];

        let res = createNewComponentIndices(
            serializedReplacements,
            nComponents,
        );
        serializedReplacements = res.components;
        nComponents = res.nComponents;

        serializedReplacements = postProcessCopy({
            serializedComponents: serializedReplacements,
            componentIdx: component.componentIdx,
            identifierPrefix: collectedNum + "|",
        });

        for (let repl of serializedReplacements) {
            // add attributes
            if (!repl.attributes) {
                repl.attributes = {};
            }
            const res = convertUnresolvedAttributesForComponentType({
                attributes: component.attributes,
                componentType: repl.componentType,
                componentInfoObjects,
                compositeAttributesObj,
                nComponents,
            });

            const attributesFromComposite = res.attributes;
            nComponents = res.nComponents;
            Object.assign(repl.attributes, attributesFromComposite);
        }

        return {
            serializedReplacements,
            errors,
            warnings,
            nComponents,
        };
    }

    static async calculateReplacementChanges({
        component,
        componentChanges,
        components,
        nComponents,
        workspace,
        componentInfoObjects,
        numComponentsForSource,
        publicCaseInsensitiveAliasSubstitutions,
    }) {
        // console.log("Calculating replacement changes for " + component.componentIdx);
        // console.log((await component.stateValues.collectedComponents).map(x => x.componentIdx))
        // console.log(deepClone(workspace));
        // console.log(component.replacements.map(x => x.componentIdx))

        // TODO: don't yet have a way to return errors and warnings!
        let errors = [];
        let warnings = [];

        let numReplacementsFoundSoFar = 0;

        workspace.numReplacementsByCollected = [
            ...workspace.numReplacementsByCollected,
        ];

        // adjust workspace variables by any replacements that were deleted
        for (
            let collectedNum = 0;
            collectedNum < workspace.numReplacementsByCollected.length;
            collectedNum++
        ) {
            let indsDeleted = [];
            for (let [ind, repName] of workspace.replacementNamesByCollected[
                collectedNum
            ].entries()) {
                if (
                    !component.replacements[numReplacementsFoundSoFar] ||
                    component.replacements[numReplacementsFoundSoFar]
                        .componentIdx !== repName
                ) {
                    indsDeleted.push(ind);
                } else {
                    numReplacementsFoundSoFar++;
                }
            }

            for (let ind of indsDeleted.reverse()) {
                workspace.replacementNamesByCollected[collectedNum].splice(
                    ind,
                    1,
                );
            }
            workspace.numReplacementsByCollected[collectedNum] -=
                indsDeleted.length;
        }

        let replacementChanges = [];

        let numReplacementsSoFar = 0;

        let numReplacementsByCollected = [];
        let replacementNamesByCollected = [];

        let collectedComponents =
            await component.stateValues.collectedComponents;
        let maxCollectedLength = Math.max(
            collectedComponents.length,
            workspace.numReplacementsByCollected.length,
        );

        let recreateRemaining = false;

        let compositeAttributesObj = this.createAttributesObject();

        for (
            let collectedNum = 0;
            collectedNum < maxCollectedLength;
            collectedNum++
        ) {
            let collected = collectedComponents[collectedNum];
            if (collected === undefined) {
                if (workspace.numReplacementsByCollected[collectedNum] > 0) {
                    if (!recreateRemaining) {
                        // since deleting replacement will shift the remaining replacements
                        // and change resulting names,
                        // delete all remaining and mark to be recreated

                        let numberReplacementsLeft =
                            workspace.numReplacementsByCollected
                                .slice(collectedNum)
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
                        workspace.numReplacementsByCollected
                            .slice(collectedNum)
                            .forEach(
                                (v, i) =>
                                    (workspace.numReplacementsByCollected[i] =
                                        0),
                            );
                    }
                }

                numReplacementsByCollected[collectedNum] = 0;
                replacementNamesByCollected.push([]);

                continue;
            }

            let prevCollectedName = workspace.collectedNames[collectedNum];

            // check if collected has changed
            if (
                prevCollectedName === undefined ||
                collected.componentIdx !== prevCollectedName ||
                recreateRemaining
            ) {
                let prevNumReplacements = 0;
                if (prevCollectedName !== undefined) {
                    prevNumReplacements =
                        workspace.numReplacementsByCollected[collectedNum];
                }

                let numReplacementsToDelete = prevNumReplacements;
                if (recreateRemaining) {
                    // already deleted old replacements
                    numReplacementsToDelete = 0;
                }

                let results = await this.recreateReplacements({
                    component,
                    collectedNum,
                    numReplacementsSoFar,
                    numReplacementsToDelete,
                    components,
                    nComponents,
                    componentInfoObjects,
                    compositeAttributesObj,
                    numComponentsForSource,
                    publicCaseInsensitiveAliasSubstitutions,
                });
                errors.push(...results.errors);
                warnings.push(...results.warnings);
                nComponents = results.nComponents;

                numReplacementsSoFar += results.numReplacements;

                numReplacementsByCollected[collectedNum] =
                    results.numReplacements;

                let replacementInstruction = results.replacementInstruction;

                replacementNamesByCollected[collectedNum] =
                    replacementInstruction.serializedReplacements.map(
                        (x) => x.componentIdx,
                    );

                if (!recreateRemaining) {
                    if (results.numReplacements !== prevNumReplacements) {
                        // we changed the number of replacements which shifts remaining ones
                        // since names won't match, we need to delete
                        // all the remaining replacements and recreate them

                        let numberReplacementsLeft =
                            workspace.numReplacementsByCollected
                                .slice(collectedNum)
                                .reduce((a, c) => a + c, 0);

                        replacementInstruction.numberReplacementsToReplace =
                            numberReplacementsLeft;

                        recreateRemaining = true;

                        // since deleted remaining, change in workspace
                        // so that don't attempt to delete again
                        workspace.numReplacementsByCollected
                            .slice(collectedNum)
                            .forEach(
                                (v, i) =>
                                    (workspace.numReplacementsByCollected[i] =
                                        0),
                            );
                    }
                }

                replacementChanges.push(replacementInstruction);

                continue;
            }

            numReplacementsSoFar +=
                workspace.numReplacementsByCollected[collectedNum];
            numReplacementsByCollected[collectedNum] =
                workspace.numReplacementsByCollected[collectedNum];
            replacementNamesByCollected[collectedNum] =
                workspace.replacementNamesByCollected[collectedNum];
        }

        workspace.numReplacementsByCollected = numReplacementsByCollected;
        workspace.collectedNames = collectedComponents.map(
            (x) => x.componentIdx,
        );
        workspace.replacementNamesByCollected = replacementNamesByCollected;

        return { replacementChanges, nComponents };
    }

    static async recreateReplacements({
        component,
        collectedNum,
        numReplacementsSoFar,
        numReplacementsToDelete,
        components,
        componentInfoObjects,
        compositeAttributesObj,
        numComponentsForSource,
        publicCaseInsensitiveAliasSubstitutions,
        nComponents,
    }) {
        let errors = [];
        let warnings = [];

        let results = await this.createReplacementForCollected({
            component,
            collectedNum,
            components,
            numReplacementsSoFar,
            componentInfoObjects,
            compositeAttributesObj,
            numComponentsForSource,
            publicCaseInsensitiveAliasSubstitutions,
            nComponents,
        });
        errors.push(...results.errors);
        warnings.push(...results.warnings);
        nComponents = results.nComponents;

        let newSerializedChildren = results.serializedReplacements;

        let replacementInstruction = {
            changeType: "add",
            changeTopLevelReplacements: true,
            firstReplacementInd: numReplacementsSoFar,
            numberReplacementsToReplace: numReplacementsToDelete,
            serializedReplacements: newSerializedChildren,
        };

        return {
            numReplacements: newSerializedChildren.length,
            replacementInstruction,
            errors,
            warnings,
            nComponents,
        };
    }
}
