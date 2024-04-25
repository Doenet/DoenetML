import { convertValueToMathExpression } from "@doenet/utils";
import { processAssignNames } from "../utils/naming";
import BaseComponent from "./abstract/BaseComponent";
import CompositeComponent from "./abstract/CompositeComponent";

export class VertexConstraints extends CompositeComponent {
    static componentType = "vertexConstraints";

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    static inSchemaOnlyInheritAs = [];

    static returnChildGroups() {
        return [
            {
                group: "constraints",
                componentTypes: ["_constraint"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.numVertices = {
            returnDependencies: () => ({
                parentNumVertices: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "polyline",
                    variableName: "numVertices",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        numVertices: dependencyValues.parentNumVertices,
                    },
                };
            },
        };

        stateVariableDefinitions.constraintNames = {
            returnDependencies: () => ({
                constraintChildren: {
                    dependencyType: "child",
                    childGroups: ["constraints"],
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        constraintNames:
                            dependencyValues.constraintChildren.map(
                                (child) => child.componentName,
                            ),
                    },
                };
            },
        };

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({
                numVertices: {
                    dependencyType: "stateVariable",
                    variableName: "numVertices",
                },
            }),
            markStale() {
                return { updateReplacements: true };
            },
            definition() {
                return { setValue: { readyToExpandWhenResolved: true } };
            },
        };

        return stateVariableDefinitions;
    }

    static async createSerializedReplacements({
        component,
        workspace,
        componentInfoObjects,
    }) {
        let serializedComponents = [];

        let numVertices = await component.stateValues.numVertices;
        let constraintNames = await component.stateValues.constraintNames;

        workspace.previousNumVertices = numVertices;

        for (let vertexInd = 0; vertexInd < numVertices; vertexInd++) {
            let constraintCopies = constraintNames.map((cname) => ({
                componentType: "copy",
                doenetAttributes: { target: cname },
                // attributes: { link: { primitive: false } },
            }));

            serializedComponents.push({
                componentType: "_constrainedVertex",
                state: { vertexNum: vertexInd + 1 },
                uniqueIdentifier: vertexInd,
                children: [
                    {
                        componentType: "constraints",
                        children: constraintCopies,
                    },
                ],
            });
        }

        let newNamespace = component.attributes.newNamespace?.primitive;

        let processResult = processAssignNames({
            serializedComponents: serializedComponents,
            parentName: component.componentName,
            parentCreatesNewNamespace: newNamespace,
            componentInfoObjects,
        });

        return {
            replacements: processResult.serializedComponents,
            errors: processResult.errors,
            warnings: processResult.warnings,
        };
    }

    static async calculateReplacementChanges({ component, workspace }) {
        let replacementChanges = [];

        let previousNumVertices = workspace.previousNumVertices;
        let numVertices = await component.stateValues.numVertices;

        let newReplacementsToWithhold;

        let numReplacementsToAdd = 0;

        // if have fewer replacements than before
        // mark old replacements as hidden
        if (numVertices < previousNumVertices) {
            newReplacementsToWithhold =
                component.replacements.length - numVertices;

            let replacementInstruction = {
                changeType: "changeReplacementsToWithhold",
                replacementsToWithhold: newReplacementsToWithhold,
            };
            replacementChanges.push(replacementInstruction);
        } else if (numVertices > previousNumVertices) {
            numReplacementsToAdd = numVertices - previousNumVertices;

            if (component.replacementsToWithhold > 0) {
                if (component.replacementsToWithhold >= numReplacementsToAdd) {
                    newReplacementsToWithhold =
                        component.replacementsToWithhold - numReplacementsToAdd;
                    previousNumVertices += numReplacementsToAdd;
                    numReplacementsToAdd = 0;

                    let replacementInstruction = {
                        changeType: "changeReplacementsToWithhold",
                        replacementsToWithhold: newReplacementsToWithhold,
                    };
                    replacementChanges.push(replacementInstruction);
                } else {
                    numReplacementsToAdd -= component.replacementsToWithhold;
                    previousNumVertices += component.replacementsToWithhold;
                    newReplacementsToWithhold = 0;
                    // don't need to send changedReplacementsToWithold instructions
                    // since will send add instructions,
                    // which will also recalculate replacements in parent
                }
            }
        }

        if (numReplacementsToAdd > 0) {
            // Need to add more replacement components

            let newSerializedReplacements = [];

            let constraintNames = await component.stateValues.constraintNames;

            for (
                let vertexInd = previousNumVertices;
                vertexInd < numVertices;
                vertexInd++
            ) {
                let constraintCopies = constraintNames.map((cname) => ({
                    componentType: "copy",
                    doenetAttributes: { target: cname },
                    // attributes: { link: { primitive: false } },
                }));

                newSerializedReplacements.push({
                    componentType: "_constrainedVertex",
                    state: { vertexNum: vertexInd + 1 },
                    uniqueIdentifier: vertexInd,
                    children: [
                        {
                            componentType: "constraints",
                            children: constraintCopies,
                        },
                    ],
                });
            }

            let replacementInstruction = {
                changeType: "add",
                changeTopLevelReplacements: true,
                firstReplacementInd: previousNumVertices,
                serializedReplacements: newSerializedReplacements,
                replacementsToWithhold: 0,
                assignNamesOffset: previousNumVertices,
            };
            replacementChanges.push(replacementInstruction);
        }

        workspace.previousNumVertices = numVertices;

        return replacementChanges;
    }
}

export class ConstrainedVertex extends BaseComponent {
    static componentType = "_constrainedVertex";
    static rendererType = undefined;

    static returnChildGroups() {
        return [
            {
                group: "constraints",
                componentTypes: ["constraints"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.arrayVariableForConstraints = {
            returnDependencies: () => ({}),
            definition: () => ({
                setValue: { arrayVariableForConstraints: "unconstrainedXs" },
            }),
        };

        stateVariableDefinitions.arrayEntryPrefixForConstraints = {
            returnDependencies: () => ({}),
            definition: () => ({
                setValue: { arrayEntryPrefixForConstraints: "unconstrainedX" },
            }),
        };

        stateVariableDefinitions.numDimensionsForConstraints = {
            isAlias: true,
            targetVariableName: "numDimensions",
        };

        stateVariableDefinitions.vertexNum = {
            defaultValue: 1,
            hasEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: { vertexNum: true },
            }),
        };

        stateVariableDefinitions.numDimensions = {
            returnDependencies: () => ({
                parentNumDimensions: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "polyline",
                    variableName: "numDimensions",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        numDimensions: dependencyValues.parentNumDimensions,
                    },
                };
            },
        };

        stateVariableDefinitions.unconstrainedXs = {
            isArray: true,
            entryPrefixes: ["unconstrainedX"],
            defaultValueByArrayKey: () => me.fromAst(0),
            stateVariablesDeterminingDependencies: ["vertexNum"],
            returnArraySizeDependencies: () => ({
                numDimensions: {
                    dependencyType: "stateVariable",
                    variableName: "numDimensions",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numDimensions];
            },
            returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
                let vertexNum = stateValues.vertexNum;

                let dependenciesByKey = {};
                for (let arrayKey of arrayKeys) {
                    let varEnding = Number(arrayKey) + 1;
                    dependenciesByKey[arrayKey] = {
                        x: {
                            dependencyType: "parentStateVariable",
                            parentComponentType: "polyline",
                            variableName:
                                "unconstrainedVertexX" +
                                vertexNum +
                                "_" +
                                varEnding,
                        },
                    };
                }

                return { dependenciesByKey };
            },
            arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
                let newXs = {};

                for (let arrayKey of arrayKeys) {
                    newXs[arrayKey] = dependencyValuesByKey[arrayKey].x;
                }

                return {
                    setValue: { unconstrainedXs: newXs },
                };
            },
            inverseArrayDefinitionByKey({
                desiredStateVariableValues,
                dependencyNamesByKey,
            }) {
                let instructions = [];

                for (let arrayKey of Object.keys(
                    desiredStateVariableValues.unconstrainedXs,
                ).reverse()) {
                    let desiredValue = convertValueToMathExpression(
                        desiredStateVariableValues.unconstrainedXs[arrayKey],
                    );
                    instructions.push({
                        setDependency: dependencyNamesByKey[arrayKey].x,
                        desiredValue,
                        childIndex: 0,
                        variableIndex: 0,
                    });
                }

                return {
                    success: true,
                    instructions,
                };
            },
        };

        stateVariableDefinitions.xs = {
            isArray: true,
            entryPrefixes: ["x"],
            returnArraySizeDependencies: () => ({
                numDimensions: {
                    dependencyType: "stateVariable",
                    variableName: "numDimensions",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numDimensions];
            },
            returnArrayDependenciesByKey({ arrayKeys }) {
                let dependenciesByKey = {};
                for (let arrayKey of arrayKeys) {
                    let varEnding = Number(arrayKey) + 1;

                    let keyDeps = {};
                    keyDeps.unconstrainedX = {
                        dependencyType: "stateVariable",
                        variableName: `unconstrainedX${varEnding}`,
                    };
                    keyDeps.constraintsChild = {
                        dependencyType: "child",
                        childGroups: ["constraints"],
                        variableNames: [`constraintResult${varEnding}`],
                    };
                    dependenciesByKey[arrayKey] = keyDeps;
                }
                return { dependenciesByKey };
            },
            arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
                let xs = {};

                for (let arrayKey of arrayKeys) {
                    if (
                        dependencyValuesByKey[arrayKey].constraintsChild
                            .length > 0
                    ) {
                        let varEnding = Number(arrayKey) + 1;
                        xs[arrayKey] = convertValueToMathExpression(
                            dependencyValuesByKey[arrayKey].constraintsChild[0]
                                .stateValues["constraintResult" + varEnding],
                        );
                    } else {
                        xs[arrayKey] = convertValueToMathExpression(
                            dependencyValuesByKey[arrayKey].unconstrainedX,
                        );
                    }
                }

                if (arrayKeys.length > 0) {
                    return { setValue: { xs } };
                } else {
                    return {};
                }
            },
            async inverseArrayDefinitionByKey({
                desiredStateVariableValues,
                dependencyValuesByKey,
                dependencyNamesByKey,
            }) {
                let instructions = [];
                for (let arrayKey of Object.keys(
                    desiredStateVariableValues.xs,
                ).reverse()) {
                    if (!dependencyValuesByKey[arrayKey]) {
                        continue;
                    }
                    if (
                        dependencyValuesByKey[arrayKey].constraintsChild
                            .length > 0
                    ) {
                        instructions.push({
                            setDependency:
                                dependencyNamesByKey[arrayKey].constraintsChild,
                            desiredValue:
                                desiredStateVariableValues.xs[arrayKey],
                            childIndex: 0,
                            variableIndex: 0,
                        });
                    } else {
                        instructions.push({
                            setDependency:
                                dependencyNamesByKey[arrayKey].unconstrainedX,
                            desiredValue:
                                desiredStateVariableValues.xs[arrayKey],
                        });
                    }
                }

                return {
                    success: true,
                    instructions,
                };
            },
        };

        return stateVariableDefinitions;
    }
}
