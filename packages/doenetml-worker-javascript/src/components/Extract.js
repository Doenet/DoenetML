import CompositeComponent from "./abstract/CompositeComponent";
import { replacementFromProp, addChildrenFromComposite } from "./Copy";
import { verifyReplacementsMatchSpecifiedType } from "../utils/copy";

export default class Extract extends CompositeComponent {
    static componentType = "_extract";

    static excludeFromSchema = true;

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

        attributes.asList = {
            createPrimitiveOfType: "boolean",
            createStateVariable: "asList",
            defaultValue: true,
        };
        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "anything",
                componentTypes: ["_base"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.link = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { link: true } }),
        };

        // The unresolved path we will attempt to extract
        // Set `wrapWithExtract` to `true` if there is the unresolved path array is longer than 1,
        // as we'll use an extract to attempt to extract the additional unresolved path.
        stateVariableDefinitions.unresolvedPath = {
            additionalStateVariablesDefined: ["wrapWithExtract"],
            returnDependencies: () => ({
                unresolvedPath: {
                    dependencyType: "doenetAttribute",
                    attributeName: "unresolvedPath",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        unresolvedPath: dependencyValues.unresolvedPath,
                        wrapWithExtract:
                            dependencyValues.unresolvedPath.length > 1,
                    },
                };
            },
        };

        stateVariableDefinitions.numComponentsSpecified = {
            returnDependencies: () => ({
                wrapWithExtract: {
                    dependencyType: "stateVariable",
                    variableName: "wrapWithExtract",
                },
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

                if (dependencyValues.wrapWithExtract) {
                    // if wrap with extract, extract will deal with numComponents
                    numComponentsSpecified = null;
                } else if (dependencyValues.typeAttr) {
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
                        throw Error(
                            `Invalid componentType ${dependencyValues.typeAttr} of copy.`,
                        );
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

        stateVariableDefinitions.childComponentIdx = {
            returnDependencies: () => ({
                child: {
                    dependencyType: "child",
                    childGroups: ["anything"],
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        childComponentIdx:
                            dependencyValues.child[0]?.componentIdx,
                    },
                };
            },
        };

        stateVariableDefinitions.sourceComponents = {
            stateVariablesDeterminingDependencies: [
                "unresolvedPath",
                "childComponentIdx",
            ],
            additionalStateVariablesDefined: ["effectivePropNameBySource"],
            returnDependencies: function ({ stateValues }) {
                return {
                    child: {
                        dependencyType: "stateVariableFromUnresolvedPath",
                        componentIdx: stateValues.childComponentIdx,
                        unresolvedPath: stateValues.unresolvedPath,
                        returnAsComponentObject: true,
                        variablesOptional: true,
                        caseInsensitiveVariableMatch: true,
                        publicStateVariablesOnly: true,
                        useMappedVariableNames: true,
                    },
                };
            },
            definition: function ({ dependencyValues }) {
                let sourceComponents = [];

                let effectivePropNameBySource = [];

                if (dependencyValues.child) {
                    sourceComponents.push(dependencyValues.child);
                    let propName;
                    if (dependencyValues.child.stateValues) {
                        propName = Object.keys(
                            dependencyValues.child.stateValues,
                        )[0];
                    }
                    if (!propName) {
                        propName = "__prop_name_not_found";
                    }
                    effectivePropNameBySource.push(propName);
                } else {
                    // Child not found. Create an invalid effective prop name so that get no replacement
                    effectivePropNameBySource.push("__no_child_found");
                }

                return {
                    setValue: {
                        sourceComponents,
                        effectivePropNameBySource,
                    },
                };
            },
        };

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({
                replacementClasses: {
                    dependencyType: "stateVariable",
                    variableName: "sourceComponents",
                },
                needsReplacementsUpdatedWhenStale: {
                    dependencyType: "stateVariable",
                    variableName: "needsReplacementsUpdatedWhenStale",
                },
            }),
            definition() {
                return { setValue: { readyToExpandWhenResolved: true } };
            },
        };

        stateVariableDefinitions.needsReplacementsUpdatedWhenStale = {
            returnDependencies() {
                return {
                    sourceComponents: {
                        dependencyType: "stateVariable",
                        variableName: "sourceComponents",
                    },
                };
            },
            // the whole point of this state variable is to return updateReplacements
            // on mark stale
            markStale: () => ({ updateReplacements: true }),
            definition: () => ({
                setValue: { needsReplacementsUpdatedWhenStale: true },
            }),
        };

        return stateVariableDefinitions;
    }

    static async createSerializedReplacements({
        component,
        components,
        nComponents,
        workspace,
        componentInfoObjects,
        flags,
        publicCaseInsensitiveAliasSubstitutions,
    }) {
        // console.log(`calculating replacements for ${component.componentIdx}`);

        let errors = [];
        let warnings = [];

        let replacements = [];

        let numReplacementsBySource = [];
        let numReplacementsSoFar = 0;

        workspace.propVariablesCopiedBySource = [];

        workspace.uniqueIdentifiersUsedBySource = {};

        let compositeAttributesObj = this.createAttributesObject();

        let sourceComponents = await component.stateValues.sourceComponents;

        const wrapWithExtract = await component.stateValues.wrapWithExtract;

        for (
            let sourceNum = 0;
            sourceNum < sourceComponents.length;
            sourceNum++
        ) {
            if (sourceComponents[sourceNum] !== undefined) {
                let uniqueIdentifiersUsed =
                    (workspace.uniqueIdentifiersUsedBySource[sourceNum] = []);
                let results = await this.createReplacementForSource({
                    component,
                    sourceNum,
                    components,
                    nComponents,
                    numReplacementsSoFar,
                    uniqueIdentifiersUsed,
                    componentInfoObjects,
                    compositeAttributesObj,
                    publicCaseInsensitiveAliasSubstitutions,

                    copyInChildren:
                        Number(sourceNum) === 0 &&
                        component.attributes.copyInChildren?.primitive.value &&
                        !wrapWithExtract,
                });
                errors.push(...results.errors);
                warnings.push(...results.warnings);
                nComponents = results.nComponents;

                workspace.propVariablesCopiedBySource[sourceNum] =
                    results.propVariablesCopiedByReplacement;

                let sourceReplacements = results.serializedReplacements;
                numReplacementsBySource[sourceNum] = sourceReplacements.length;
                numReplacementsSoFar += sourceReplacements.length;
                replacements.push(...sourceReplacements);
            } else {
                numReplacementsBySource[sourceNum] = 0;
            }
        }

        workspace.numReplacementsBySource = numReplacementsBySource;
        workspace.numNonStringReplacementsBySource = [
            ...numReplacementsBySource,
        ];
        workspace.sourceNames = sourceComponents.map((x) => x.componentIdx);

        let verificationResult = await verifyReplacementsMatchSpecifiedType({
            component,
            replacements,
            workspace,
            componentInfoObjects,
            compositeAttributesObj,
            flags,
            components,
            nComponents,
            publicCaseInsensitiveAliasSubstitutions,
        });
        errors.push(...verificationResult.errors);
        warnings.push(...verificationResult.warnings);
        nComponents = verificationResult.nComponents;
        replacements = verificationResult.replacements;

        if (replacements.length === 1 && !wrapWithExtract) {
            if (
                component.attributes.createComponentName?.primitive.value !=
                undefined
            ) {
                replacements[0].attributes.name = {
                    type: "primitive",
                    name: "name",
                    primitive: {
                        type: "string",
                        value: component.attributes.createComponentName
                            .primitive.value,
                    },
                };
            }
            if (
                component.attributes.createComponentIdx?.primitive.value !=
                undefined
            ) {
                replacements[0].componentIdx =
                    component.attributes.createComponentIdx.primitive.value;
            }
        }

        // console.log(`serialized replacements for ${component.componentIdx}`)
        // console.log(JSON.parse(JSON.stringify(verificationResult.replacements)))

        return {
            replacements,
            errors,
            warnings,
            nComponents,
        };
    }

    static async createReplacementForSource({
        component,
        components,
        nComponents,
        sourceNum,
        numReplacementsSoFar,
        uniqueIdentifiersUsed,
        componentInfoObjects,
        compositeAttributesObj,
        publicCaseInsensitiveAliasSubstitutions,
        copyInChildren,
    }) {
        // console.log(`create replacement for source ${sourceNum}, ${numReplacementsSoFar} of ${component.componentIdx}`)

        let errors = [];
        let warnings = [];

        let propName = (await component.stateValues.effectivePropNameBySource)[
            sourceNum
        ];

        let results = await replacementFromProp({
            component,
            components,
            nComponents,
            replacementSource: (await component.stateValues.sourceComponents)[
                sourceNum
            ],
            propName,
            // numReplacementsSoFar,
            uniqueIdentifiersUsed,
            compositeAttributesObj,
            componentInfoObjects,
            publicCaseInsensitiveAliasSubstitutions,
        });
        errors.push(...results.errors);
        warnings.push(...results.warnings);
        nComponents = results.nComponents;

        let serializedReplacements = results.serializedReplacements;
        let propVariablesCopiedByReplacement =
            results.propVariablesCopiedByReplacement;

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

        return {
            serializedReplacements,
            propVariablesCopiedByReplacement,
            errors,
            warnings,
            nComponents,
        };
    }

    static async calculateReplacementChanges({
        component,
        components,
        nComponents,
        workspace,
        componentInfoObjects,
        flags,
        publicCaseInsensitiveAliasSubstitutions,
    }) {
        // console.log(`calculating replacement changes for ${component.componentIdx}`);
        // console.log(workspace.numReplacementsBySource);
        // console.log(component.replacements);

        // TODO: don't yet have a way to return errors and warnings!
        let errors = [];
        let warnings = [];

        let replacementChanges = [];

        let numReplacementsSoFar = 0;

        let numReplacementsBySource = [];
        let propVariablesCopiedBySource = [];

        let compositeAttributesObj = this.createAttributesObject();

        let sourceComponents = await component.stateValues.sourceComponents;

        let maxSourceLength = Math.max(
            sourceComponents.length,
            workspace.numReplacementsBySource.length,
        );

        let recreateRemaining = false;

        const wrapWithExtract = await component.stateValues.wrapWithExtract;

        for (let sourceNum = 0; sourceNum < maxSourceLength; sourceNum++) {
            let source = sourceComponents[sourceNum];
            if (source === undefined) {
                if (workspace.numReplacementsBySource[sourceNum] > 0) {
                    if (!recreateRemaining) {
                        // since deleting replacement will shift the remaining replacements
                        // and change resulting names,
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
                    }

                    workspace.uniqueIdentifiersUsedBySource[sourceNum] = [];
                }

                numReplacementsBySource[sourceNum] = 0;
                propVariablesCopiedBySource.push([]);

                continue;
            }

            let prevSourceName = workspace.sourceNames[sourceNum];

            // check if source has changed
            let needToRecreate =
                prevSourceName === undefined ||
                source.componentIdx !== prevSourceName ||
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
                    }
                }
            }

            if (needToRecreate) {
                let prevNumReplacements = 0;
                if (prevSourceName !== undefined) {
                    prevNumReplacements =
                        workspace.numReplacementsBySource[sourceNum];
                }

                let numReplacementsToDelete = prevNumReplacements;
                if (recreateRemaining) {
                    // already deleted old replacements
                    numReplacementsToDelete = 0;
                }

                let uniqueIdentifiersUsed =
                    (workspace.uniqueIdentifiersUsedBySource[sourceNum] = []);
                let results = await this.recreateReplacements({
                    component,
                    nComponents,
                    sourceNum,
                    numReplacementsSoFar,
                    numReplacementsToDelete,
                    components,
                    uniqueIdentifiersUsed,
                    componentInfoObjects,
                    compositeAttributesObj,
                    publicCaseInsensitiveAliasSubstitutions,
                });
                errors.push(...results.errors);
                warnings.push(...results.warnings);
                nComponents = results.nComponents;

                numReplacementsSoFar += results.numReplacements;

                numReplacementsBySource[sourceNum] = results.numReplacements;

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
                    }
                }

                replacementChanges.push(replacementInstruction);

                continue;
            }

            // use new uniqueIdentifiersUsed
            // so will get the same names for pieces that match
            let uniqueIdentifiersUsed =
                (workspace.uniqueIdentifiersUsedBySource[sourceNum] = []);

            let results = await this.createReplacementForSource({
                component,
                sourceNum,
                components,
                nComponents,
                numReplacementsSoFar,
                uniqueIdentifiersUsed,
                componentInfoObjects,
                compositeAttributesObj,
                publicCaseInsensitiveAliasSubstitutions,

                copyInChildren:
                    Number(sourceNum) === 0 &&
                    component.attributes.copyInChildren?.primitive.value &&
                    !wrapWithExtract,
            });
            errors.push(...results.errors);
            warnings.push(...results.warnings);
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
                    assignNamesOffset: numReplacementsSoFar,
                };

                replacementChanges.push(replacementInstruction);

                recreateRemaining = true;
                nComponents = nComponentsForNew;

                // since deleted remaining, change in workspace
                // so that don't attempt to delete again
                workspace.numReplacementsBySource
                    .slice(sourceNum)
                    .forEach(
                        (v, i) => (workspace.numReplacementsBySource[i] = 0),
                    );
            } else {
                for (let ind = 0; ind < nNewReplacements; ind++) {
                    if (
                        propVariablesCopiedByReplacement[ind].length !==
                            workspace.propVariablesCopiedBySource[sourceNum][
                                ind
                            ].length ||
                        workspace.propVariablesCopiedBySource[sourceNum][
                            ind
                        ].some(
                            (v, i) =>
                                v !== propVariablesCopiedByReplacement[ind][i],
                        )
                    ) {
                        // XXX: what to do about nComponents here?
                        let replacementInstruction = {
                            changeType: "add",
                            changeTopLevelReplacements: true,
                            firstReplacementInd: numReplacementsSoFar + ind,
                            numberReplacementsToReplace: 1,
                            serializedReplacements: [
                                newSerializedReplacements[ind],
                            ],
                            assignNamesOffset: numReplacementsSoFar + ind,
                        };
                        replacementChanges.push(replacementInstruction);
                    }
                }
            }

            numReplacementsSoFar += nNewReplacements;

            numReplacementsBySource[sourceNum] = nNewReplacements;

            propVariablesCopiedBySource[sourceNum] =
                propVariablesCopiedByReplacement;
        }

        workspace.numReplacementsBySource = numReplacementsBySource;
        workspace.numNonStringReplacementsBySource = [
            ...numReplacementsBySource,
        ];
        workspace.sourceNames = sourceComponents.map((x) => x.componentIdx);
        workspace.propVariablesCopiedBySource = propVariablesCopiedBySource;

        let verificationResult = await verifyReplacementsMatchSpecifiedType({
            component,
            replacementChanges,
            workspace,
            componentInfoObjects,
            compositeAttributesObj,
            flags,
            components,
            nComponents,
            publicCaseInsensitiveAliasSubstitutions,
        });
        errors.push(...verificationResult.errors);
        warnings.push(...verificationResult.warnings);
        nComponents = verificationResult.nComponents;
        replacementChanges = verificationResult.replacementChanges;

        // If, after changes, we have a single component that has a componentName and componentIdx
        // given by the Copy, then assign those to the replacement
        // We have dealt just with the special case that we arrive at one replacement with a single "add" change.
        // We could generalize if we need to.

        const { replacementTypes, replacementsToWithhold } =
            calculateReplacementTypesFromChanges(component, replacementChanges);
        if (
            !wrapWithExtract &&
            replacementTypes.length === 1 &&
            !(replacementsToWithhold > 0)
        ) {
            if (
                replacementChanges.length === 1 &&
                replacementChanges[0].changeType === "add" &&
                replacementChanges[0].serializedReplacements.length === 1
            ) {
                const theNewReplacement =
                    replacementChanges[0].serializedReplacements[0];

                if (
                    component.attributes.createComponentName?.primitive.value !=
                    undefined
                ) {
                    theNewReplacement.attributes.name = {
                        type: "primitive",
                        name: "name",
                        primitive: {
                            type: "string",
                            value: component.attributes.createComponentName
                                .primitive.value,
                        },
                    };
                }
                if (
                    component.attributes.createComponentIdx?.primitive.value !=
                    undefined
                ) {
                    theNewReplacement.componentIdx =
                        component.attributes.createComponentIdx.primitive.value;
                }
            }
        }

        // console.log("replacementChanges");
        // console.log(replacementChanges);

        return { replacementChanges, nComponents };
    }

    static async recreateReplacements({
        component,
        sourceNum,
        numReplacementsSoFar,
        numReplacementsToDelete,
        uniqueIdentifiersUsed,
        components,
        nComponents,
        componentInfoObjects,
        compositeAttributesObj,
        publicCaseInsensitiveAliasSubstitutions,
    }) {
        let errors = [];
        let warnings = [];

        const wrapWithExtract = await component.stateValues.wrapWithExtract;

        let results = await this.createReplacementForSource({
            component,
            sourceNum,
            numReplacementsSoFar,
            components,
            nComponents,
            uniqueIdentifiersUsed,
            componentInfoObjects,
            compositeAttributesObj,
            publicCaseInsensitiveAliasSubstitutions,

            copyInChildren:
                Number(sourceNum) === 0 &&
                component.attributes.copyInChildren?.primitive.value &&
                !wrapWithExtract,
        });
        errors.push(...results.errors);
        warnings.push(...results.warnings);
        nComponents = results.nComponents;

        let propVariablesCopiedByReplacement =
            results.propVariablesCopiedByReplacement;

        let newSerializedChildren = results.serializedReplacements;

        let replacementInstruction = {
            changeType: "add",
            changeTopLevelReplacements: true,
            firstReplacementInd: numReplacementsSoFar,
            numberReplacementsToReplace: numReplacementsToDelete,
            serializedReplacements: newSerializedChildren,
            assignNamesOffset: numReplacementsSoFar,
        };

        return {
            numReplacements: newSerializedChildren.length,
            propVariablesCopiedByReplacement,
            replacementInstruction,
            errors,
            warnings,
            nComponents,
        };
    }
}
