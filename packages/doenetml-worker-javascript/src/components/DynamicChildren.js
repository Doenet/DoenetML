import { createNewComponentIndices } from "../utils/componentIndices";
import CompositeComponent from "./abstract/CompositeComponent";
import { deepClone } from "@doenet/utils";
export default class DynamicChildren extends CompositeComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            addChildren: this.addChildren.bind(this),
            deleteChildren: this.deleteChildren.bind(this),
        });
    }

    static componentType = "_dynamicChildren";

    static treatAsComponentForRecursiveReplacements = true;

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.dynamicChildren = {
            hasEssential: true,
            defaultValue: [],
            returnDependencies: () => ({}),
            definition: function () {
                return {
                    useEssentialOrDefaultValue: { dynamicChildren: true },
                };
            },
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "dynamicChildren",
                            value: desiredStateVariableValues.dynamicChildren,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.nGroups = {
            returnDependencies: () => ({
                dynamicChildren: {
                    dependencyType: "stateVariable",
                    variableName: "dynamicChildren",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        nGroups: dependencyValues.dynamicChildren.length,
                    },
                };
            },
        };

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({
                dynamicChildren: {
                    dependencyType: "stateVariable",
                    variableName: "dynamicChildren",
                },
            }),
            definition: function () {
                return { setValue: { readyToExpandWhenResolved: true } };
            },
            markStale() {
                return { updateReplacements: true };
            },
        };

        return stateVariableDefinitions;
    }

    async addChildren({
        serializedComponents,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        if (serializedComponents && serializedComponents.length > 0) {
            const dynamicChildren = [
                ...(await this.stateValues.dynamicChildren),
            ];
            dynamicChildren.push({
                type: "serialized",
                componentType: "group",
                componentIdx: 0, // will be replaced when actual components added
                attributes: {},
                doenetAttributes: {},
                state: {},
                children: deepClone(serializedComponents),
            });

            return await this.coreFunctions.performUpdate({
                updateInstructions: [
                    {
                        updateType: "updateValue",
                        componentIdx: this.componentIdx,
                        stateVariable: "dynamicChildren",
                        value: dynamicChildren,
                    },
                ],
                actionId,
                sourceInformation,
                skipRendererUpdate,
            });
        }
    }

    async deleteChildren({
        number,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        const nGroups = await this.stateValues.nGroups;
        let numberToDelete = Math.min(number, nGroups);

        if (numberToDelete > 0) {
            const dynamicChildren = (
                await this.stateValues.dynamicChildren
            ).slice(0, nGroups - numberToDelete);

            return await this.coreFunctions.performUpdate({
                updateInstructions: [
                    {
                        updateType: "updateValue",
                        componentIdx: this.componentIdx,
                        stateVariable: "dynamicChildren",
                        value: dynamicChildren,
                    },
                ],
                actionId,
                sourceInformation,
                skipRendererUpdate,
            });
        }
    }

    static async createSerializedReplacements({
        component,
        nComponents,
        workspace,
    }) {
        let errors = [];
        let warnings = [];

        if (workspace.replacementsCreated === undefined) {
            workspace.replacementsCreated = 0;
        }

        workspace.replacementsCreatedThroughGroup = [];

        let replacements = [];

        const nGroups = await component.stateValues.nGroups;
        for (let groupNum = 0; groupNum < nGroups; groupNum++) {
            let groupReplacementResult = await this.replacementForGroup({
                component,
                groupNum,
                nComponents,
                workspace,
            });
            let groupReplacements = groupReplacementResult.replacements;
            nComponents = groupReplacementResult.nComponents;

            replacements.push(...groupReplacements);
        }

        workspace.nGroups = nGroups;

        // console.log(`serialized replacements for ${component.componentIdx}`)
        // console.log(JSON.parse(JSON.stringify(verificationResult.replacements)))

        return {
            replacements,
            errors,
            warnings,
            nComponents,
        };
    }

    static async replacementForGroup({
        component,
        groupNum,
        nComponents,
        workspace,
    }) {
        let replacements = [
            deepClone((await component.stateValues.dynamicChildren)[groupNum]),
        ];

        const stateIdInfo = {
            prefix: `${component.stateId}|`,
            num: workspace.replacementsCreated,
        };

        const idxResult = createNewComponentIndices(
            replacements,
            nComponents,
            stateIdInfo,
        );
        replacements = idxResult.components;
        nComponents = idxResult.nComponents;

        workspace.replacementsCreated = stateIdInfo.num;

        workspace.replacementsCreatedThroughGroup = [
            ...workspace.replacementsCreatedThroughGroup,
            workspace.replacementsCreated,
        ];

        return {
            replacements,
            nComponents,
        };
    }

    static async calculateReplacementChanges({
        component,
        nComponents,
        workspace,
    }) {
        const nGroups = await component.stateValues.nGroups;

        if (nGroups === workspace.nGroups) {
            return {
                replacementChanges: [],
                nComponents,
            };
        } else if (nGroups < workspace.nGroups) {
            const replacementChanges = [
                {
                    changeType: "delete",
                    changeTopLevelReplacements: true,
                    firstReplacementInd: nGroups,
                    numberReplacementsToDelete: workspace.nGroups - nGroups,
                },
            ];

            workspace.nGroups = nGroups;

            workspace.replacementsCreated =
                workspace.replacementsCreatedThroughGroup[nGroups - 1] || 0;

            workspace.replacementsCreatedThroughGroup =
                workspace.replacementsCreatedThroughGroup.slice(0, nGroups);

            return {
                replacementChanges,
                nComponents,
            };
        }

        let newSerializedReplacements = [];

        for (let groupNum = workspace.nGroups; groupNum < nGroups; groupNum++) {
            let groupReplacementResult = await this.replacementForGroup({
                component,
                groupNum,
                nComponents,
                workspace,
            });
            let groupReplacements = groupReplacementResult.replacements;
            nComponents = groupReplacementResult.nComponents;

            newSerializedReplacements.push(...groupReplacements);
        }

        let replacementInstruction = {
            changeType: "add",
            changeTopLevelReplacements: true,
            firstReplacementInd: workspace.nGroups,
            numberReplacementsToReplace: 0,
            serializedReplacements: newSerializedReplacements,
            replacementsToWithhold: 0,
        };

        workspace.nGroups = nGroups;

        return {
            replacementChanges: [replacementInstruction],
            nComponents,
        };
    }
}
