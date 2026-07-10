import { deepClone } from "@doenet/utils";
import type { ComponentIdx } from "@doenet/utils";
import type { ComponentInstance } from "../../types/componentInstance";
import type { DependencyHandler } from "./DependencyHandler";
import { arrayEntryNamesFromPropIndex } from "../StateVariableInitializer";

/**
 * Base class shared by every concrete dependency type. Concrete subclasses
 * (in sibling modules within `core/dependencies/`) override
 * `setUpParameters`, `determineDownstreamComponents`, and occasionally
 * `getValue` / `deleteFromUpdateTriggers`.
 *
 * The class carries an index signature: subclasses freely set arbitrary
 * fields (`this.componentIdx`, `this.staticValue`, `this.parentIdx`, …)
 * during graph construction. Tightening that to a per-subclass interface
 * would be a follow-up to typing the subclasses themselves; the index
 * signature lets the dynamic fields satisfy `noImplicitAny` without
 * blanketing the file with `// @ts-nocheck`.
 */

export function cloneChangeMetadataIfNeeded({
    changeMetadata,
    consumeChanges,
}: {
    changeMetadata: any;
    consumeChanges: boolean;
}) {
    return consumeChanges ? changeMetadata : deepClone(changeMetadata);
}

/**
 * Shared initial change record for every downstream variable of every new
 * dependency. Frozen: code that needs to record additional change metadata
 * must replace the record (writers check `Object.isFrozen`; see
 * `recordActualChangeInUpstreamDependencies` and `StalenessPropagator`).
 * One shared object instead of one `{ changed: true }` per
 * (dependency, downstream component, variable).
 */
const INITIAL_CHANGE_RECORD = Object.freeze({ changed: true });

export class Dependency {
    [key: string]: any;

    static dependencyType = "_base";
    static convertToArraySize?: boolean;

    downstreamVariableNameIfNoVariables = "__identity";

    /** Display name on `dependencyHandler.downstreamDependencies`. */
    dependencyName: string;
    /** Back-reference to the owning handler, used for graph mutations. */
    dependencyHandler: DependencyHandler;
    /** Component this dependency was attached to. */
    upstreamComponentIdx: ComponentIdx;
    /** Variables on the upstream component this dependency feeds. */
    upstreamVariableNames: string[];
    /** Snapshot of the dependency-definition entry that produced this
     * instance. */
    definition: Record<string, any>;
    /** State variable this dependency was created for; used for diagnostics. */
    representativeStateVariable: string;

    returnSingleVariableValue: boolean;
    returnSingleComponent: boolean;
    originalDownstreamVariableNames: string[];

    constructor({
        component,
        stateVariable,
        allStateVariablesAffected,
        dependencyName,
        dependencyDefinition,
        dependencyHandler,
    }: {
        component: ComponentInstance;
        stateVariable: string;
        allStateVariablesAffected: string[];
        dependencyName: string;
        dependencyDefinition: any;
        dependencyHandler: DependencyHandler;
    }) {
        this.dependencyName = dependencyName;
        this.dependencyHandler = dependencyHandler;

        this.upstreamComponentIdx = component.componentIdx;
        this.upstreamVariableNames = allStateVariablesAffected;

        // Store the definition by reference: nothing writes to the stored
        // object (its nested arrays were shared under the previous shallow
        // copy anyway), and `returnDependencies` produces a fresh object per
        // call, so per-instance copies only wasted memory.
        this.definition = dependencyDefinition;
        this.representativeStateVariable = stateVariable;

        if (dependencyDefinition.doNotProxy) {
            this.doNotProxy = true;
        }

        if (dependencyDefinition.variablesOptional) {
            this.variablesOptional = true;
        }

        if (dependencyDefinition.publicStateVariablesOnly) {
            this.publicStateVariablesOnly = true;
        }

        if (dependencyDefinition.caseInsensitiveVariableMatch) {
            this.caseInsensitiveVariableMatch = true;
        }

        if (dependencyDefinition.useMappedVariableNames) {
            this.useMappedVariableNames = true;
        }

        if (dependencyDefinition.propIndex) {
            if (dependencyDefinition.propIndex.every(Number.isFinite)) {
                this.propIndex = dependencyDefinition.propIndex.map(Math.round);
            } else {
                this.propIndex = [];
            }
        }

        // if returnSingleVariableValue, then
        // return just the value of the state variable when there is
        // exactly one (downstreamComponentIdx, downstreamVariableName)
        // and return null otherwise
        this.returnSingleVariableValue = false;

        // if returnSingleComponent, then
        // return just the component object (rather than an array) when there
        // is exactly one downstreamComponentIdx
        // and return null otherwise
        this.returnSingleComponent = false;

        this.originalDownstreamVariableNames = [];

        // this.checkForCircular();
    }

    get dependencyType() {
        return (this.constructor as typeof Dependency).dependencyType;
    }

    setUpParameters() {}

    async determineDownstreamComponents(_args?: any): Promise<any> {
        return {
            success: true,
            downstreamComponentIndices: [],
            downstreamComponentTypes: [],
        };
    }

    async initialize() {
        // 1. set up parameters
        // 2. determine downstream components
        // 3. add this dependency to the downstreamDependencies of the upstream component
        // 4. for each downstreamComponentIdx, add this dependency to upstreamDependencies
        // 5. map originalDownstreamVariableNames to mappedDownstreamVariableNamesByComponent
        // 6. possibly create array entry variables in downstream components if they don't exist
        // 7. keep track of any unresolved dependencies

        this.setUpParameters();

        // Note: determineDownstreamComponents has side effects
        // of setting class variables and adding to updateTrigger objects
        let downComponents = await this.determineDownstreamComponents();

        let downstreamComponentIndices =
            downComponents.downstreamComponentIndices;
        let downstreamComponentTypes = downComponents.downstreamComponentTypes;

        this.componentIdentitiesChanged = true;

        let upCompDownDeps =
            this.dependencyHandler.downstreamDependencies[
                this.upstreamComponentIdx
            ];
        if (!upCompDownDeps) {
            upCompDownDeps = this.dependencyHandler.downstreamDependencies[
                this.upstreamComponentIdx
            ] = {};
        }

        for (let varName of this.upstreamVariableNames) {
            if (!upCompDownDeps[varName]) {
                upCompDownDeps[varName] = {};
            }
            upCompDownDeps[varName][this.dependencyName] = this;
        }

        if (
            this.originalDownstreamVariableNames.length === 0 &&
            !this.originalVariablesByComponent
        ) {
            delete this.mappedDownstreamVariableNamesByComponent;
            delete this.upValuesChanged;
        } else {
            this.mappedDownstreamVariableNamesByComponent = [];
            this.valuesChanged = [];
        }

        this.downstreamComponentIndices = [];
        this.downstreamComponentTypes = [];

        for (let [
            index,
            downstreamComponentIdx,
        ] of downstreamComponentIndices.entries()) {
            await this.addDownstreamComponent({
                downstreamComponentIdx,
                downstreamComponentType: downstreamComponentTypes[index],
                index,
            });
        }

        // The parallel downstream arrays repeat heavily across dependencies
        // (mostly length 1, and all the dependencies of one component point
        // at the same targets), so share one frozen array per distinct list.
        // The mutators below thaw before changing the downstream set.
        this.downstreamComponentIndices =
            this.dependencyHandler.internComponentIndexList(
                this.downstreamComponentIndices,
            );
        this.downstreamComponentTypes =
            this.dependencyHandler.internComponentTypeList(
                this.downstreamComponentTypes,
            );
        if (this.mappedDownstreamVariableNamesByComponent) {
            this.mappedDownstreamVariableNamesByComponent =
                this.dependencyHandler.internNameListArray(
                    this.mappedDownstreamVariableNamesByComponent,
                );
        }
    }

    /**
     * Replace the interned (frozen, shared) parallel downstream arrays with
     * mutable copies before changing the downstream set.
     */
    thawDownstreamArrays() {
        if (Object.isFrozen(this.downstreamComponentIndices)) {
            this.downstreamComponentIndices = [
                ...this.downstreamComponentIndices,
            ];
        }
        if (Object.isFrozen(this.downstreamComponentTypes)) {
            this.downstreamComponentTypes = [...this.downstreamComponentTypes];
        }
        if (
            this.mappedDownstreamVariableNamesByComponent &&
            Object.isFrozen(this.mappedDownstreamVariableNamesByComponent)
        ) {
            this.mappedDownstreamVariableNamesByComponent = [
                ...this.mappedDownstreamVariableNamesByComponent,
            ];
        }
    }

    async addDownstreamComponent({
        downstreamComponentIdx,
        downstreamComponentType,
        index,
    }: any) {
        this.componentIdentitiesChanged = true;

        this.thawDownstreamArrays();

        this.downstreamComponentIndices.splice(
            index,
            0,
            downstreamComponentIdx,
        );
        this.downstreamComponentTypes.splice(index, 0, downstreamComponentType);

        let downComponent =
            this.dependencyHandler._components[downstreamComponentIdx];

        if (downComponent) {
            let originalVarNames;

            if (this.originalVariablesByComponent) {
                originalVarNames =
                    this.originalDownstreamVariableNamesByComponent[index];
            } else {
                originalVarNames = this.originalDownstreamVariableNames;
            }

            if (this.caseInsensitiveVariableMatch) {
                originalVarNames =
                    this.dependencyHandler.core.findCaseInsensitiveMatches({
                        stateVariables: originalVarNames,
                        componentClass: downComponent.constructor,
                    });
            }

            if (this.publicStateVariablesOnly) {
                originalVarNames =
                    this.dependencyHandler.core.matchPublicStateVariables({
                        stateVariables: originalVarNames,
                        componentClass: downComponent.constructor,
                    });
            }

            let mappedVarNames = this.dependencyHandler.core.substituteAliases({
                stateVariables: originalVarNames,
                componentClass: downComponent.constructor,
            });

            if ((this.constructor as typeof Dependency).convertToArraySize) {
                mappedVarNames = mappedVarNames.map(function (vName: string) {
                    let stateVarObj = downComponent.state[vName];
                    if (stateVarObj) {
                        if (stateVarObj.arraySizeStateVariable) {
                            return stateVarObj.arraySizeStateVariable;
                        } else {
                            return `__${vName}_is_not_an_array`;
                        }
                    }

                    // check if vName begins when an arrayEntry
                    if (downComponent.arrayEntryPrefixes) {
                        let arrayEntryPrefixesLongestToShortest = Object.keys(
                            downComponent.arrayEntryPrefixes,
                        ).sort((a, b) => b.length - a.length);
                        for (let arrayEntryPrefix of arrayEntryPrefixesLongestToShortest) {
                            if (
                                vName.substring(0, arrayEntryPrefix.length) ===
                                arrayEntryPrefix
                            ) {
                                let arrayVariableName =
                                    downComponent.arrayEntryPrefixes[
                                        arrayEntryPrefix
                                    ];
                                let arrayStateVarObj =
                                    downComponent.state[arrayVariableName];
                                let arrayKeys =
                                    arrayStateVarObj.getArrayKeysFromVarName({
                                        arrayEntryPrefix,
                                        varEnding: vName.substring(
                                            arrayEntryPrefix.length,
                                        ),
                                        numDimensions:
                                            arrayStateVarObj.numDimensions,
                                    });

                                if (arrayKeys.length > 0) {
                                    return downComponent.state[
                                        arrayVariableName
                                    ].arraySizeStateVariable;
                                }
                            }
                        }
                    }
                    return `__${vName}_is_not_an_array`;
                });
            }

            if (this.propIndex !== undefined) {
                mappedVarNames = await arrayEntryNamesFromPropIndex({
                    core: this.dependencyHandler.core,
                    stateVariables: mappedVarNames,
                    component: downComponent,
                    propIndex: this.propIndex,
                });
            }

            // Note: mappedVarNames contains all original variables mapped with any aliases.
            // If variablesOptional, downVarNames may be filtered to just include
            // variables that exist in the component.
            // (If not variablesOptional and variable doesn't exist, will eventually get an error)
            let downVarNames = mappedVarNames;

            if (
                originalVarNames.length > 0 ||
                this.originalVariablesByComponent
            ) {
                // Intern the (frozen) name list: most dependencies map the
                // same few lists, so share one array per distinct list.
                mappedVarNames =
                    this.dependencyHandler.internVariableNameList(
                        mappedVarNames,
                    );

                this.mappedDownstreamVariableNamesByComponent.splice(
                    index,
                    0,
                    mappedVarNames,
                );

                let valsChanged: Record<string, any> = {};
                for (let downVar of mappedVarNames) {
                    valsChanged[downVar] = INITIAL_CHANGE_RECORD;
                }
                this.valuesChanged.splice(index, 0, valsChanged);

                if (this.variablesOptional) {
                    // if variables are optional, then include variables in downVarNames
                    // only if the variable exists in the downstream component
                    // (or could be created as an array entry)
                    downVarNames = downVarNames.filter(
                        (downVar: string) =>
                            downVar in downComponent.state ||
                            this.dependencyHandler.core.checkIfArrayEntry({
                                stateVariable: downVar,
                                component: downComponent,
                            }).isArrayEntry,
                    );
                }

                for (let downVar of downVarNames) {
                    if (!downComponent.state[downVar]) {
                        await this.dependencyHandler.core.createFromArrayEntry({
                            component: downComponent,
                            stateVariable: downVar,
                        });
                    }

                    if (!downComponent.state[downVar].isResolved) {
                        for (let varName of this.upstreamVariableNames) {
                            await this.dependencyHandler.addBlocker({
                                blockerComponentIdx: downstreamComponentIdx,
                                blockerType: "stateVariable",
                                blockerStateVariable: downVar,
                                componentIdxBlocked: this.upstreamComponentIdx,
                                typeBlocked: "stateVariable",
                                stateVariableBlocked: varName,
                            });
                            if (
                                this.dependencyType === "determineDependencies"
                            ) {
                                await this.dependencyHandler.addBlocker({
                                    blockerComponentIdx: downstreamComponentIdx,
                                    blockerType: "stateVariable",
                                    blockerStateVariable: downVar,
                                    componentIdxBlocked:
                                        this.upstreamComponentIdx,
                                    typeBlocked: "determineDependencies",
                                    stateVariableBlocked: varName,
                                    dependencyBlocked: this.dependencyName,
                                });
                            }
                        }
                    }
                }
            }

            // if don't have any state variables,
            // then just record the upstream dependencies on the downstream component
            // under "__identity"
            if (downVarNames.length === 0) {
                downVarNames = [this.downstreamVariableNameIfNoVariables];
            }

            let downCompUpDeps =
                this.dependencyHandler.upstreamDependencies[
                    downstreamComponentIdx
                ];
            if (!downCompUpDeps) {
                downCompUpDeps = this.dependencyHandler.upstreamDependencies[
                    downstreamComponentIdx
                ] = {};
            }

            for (let varName of downVarNames) {
                if (downCompUpDeps[varName] === undefined) {
                    downCompUpDeps[varName] = [];
                }
                downCompUpDeps[varName].push(this);

                if (varName !== this.downstreamVariableNameIfNoVariables) {
                    for (let upstreamVarName of this.upstreamVariableNames) {
                        this.dependencyHandler.resetCircularCheckPassed(
                            this.upstreamComponentIdx,
                            upstreamVarName,
                        );
                    }
                }
            }
        }

        for (let upVarName of this.upstreamVariableNames) {
            if (
                this.dependencyHandler._components[this.upstreamComponentIdx]
                    .state[upVarName].initiallyResolved
            ) {
                await this.dependencyHandler.core.markStateVariableAndUpstreamDependentsStale(
                    {
                        component:
                            this.dependencyHandler.components[
                                this.upstreamComponentIdx
                            ],
                        varName: upVarName,
                    },
                );
            }
        }
    }

    async removeDownstreamComponent({
        indexToRemove,
        recordChange = true,
    }: {
        indexToRemove: number;
        recordChange?: boolean;
    }) {
        // console.log(`remove downstream ${indexToRemove}, ${this.downstreamComponentIndices[indexToRemove]} dependency: ${this.dependencyName}`)
        // console.log(this.upstreamComponentIdx, this.representativeStateVariable);

        // remove downstream component specified by indexToRemove from this dependency

        if (recordChange) {
            this.componentIdentitiesChanged = true;
        }

        this.thawDownstreamArrays();

        let componentIdx = this.downstreamComponentIndices[indexToRemove];

        this.downstreamComponentIndices.splice(indexToRemove, 1);
        this.downstreamComponentTypes.splice(indexToRemove, 1);

        if (componentIdx in this.dependencyHandler._components) {
            let affectedDownstreamVariableNames;

            if (!this.mappedDownstreamVariableNamesByComponent) {
                affectedDownstreamVariableNames = [
                    this.downstreamVariableNameIfNoVariables,
                ];
            } else {
                affectedDownstreamVariableNames =
                    this.mappedDownstreamVariableNamesByComponent[
                        indexToRemove
                    ];
                this.mappedDownstreamVariableNamesByComponent.splice(
                    indexToRemove,
                    1,
                );
                this.valuesChanged.splice(indexToRemove, 1);

                if (this.variablesOptional) {
                    // if variables are optional, it's possble no variables were found
                    // so add placeholder variable name just in case
                    // (It doesn't matter if extra variables are included,
                    // as they will be skipped below.  And, since the component may have
                    // been deleted already, we don't want to check its state.)
                    // Copy first: the name list is interned (frozen) and
                    // shared with other dependencies.
                    affectedDownstreamVariableNames = [
                        ...affectedDownstreamVariableNames,
                        this.downstreamVariableNameIfNoVariables,
                    ];
                }
            }

            // delete from upstream dependencies of downstream component
            for (let vName of affectedDownstreamVariableNames) {
                let downCompUpDeps =
                    this.dependencyHandler.upstreamDependencies[componentIdx][
                        vName
                    ];
                if (downCompUpDeps) {
                    let ind = downCompUpDeps.indexOf(this);
                    // if find an upstream dependency, delete
                    if (ind !== -1) {
                        if (downCompUpDeps.length === 1) {
                            delete this.dependencyHandler.upstreamDependencies[
                                componentIdx
                            ][vName];
                        } else {
                            downCompUpDeps.splice(ind, 1);
                        }
                    }
                }

                if (vName !== this.downstreamVariableNameIfNoVariables) {
                    for (let upstreamVarName of this.upstreamVariableNames) {
                        // TODO: check why have to do this when remove a component from a dependency
                        this.dependencyHandler.resetCircularCheckPassed(
                            this.upstreamComponentIdx,
                            upstreamVarName,
                        );
                    }
                }
            }
        }

        if (recordChange) {
            for (let upVarName of this.upstreamVariableNames) {
                if (
                    this.dependencyHandler._components[
                        this.upstreamComponentIdx
                    ].state[upVarName].initiallyResolved
                ) {
                    await this.dependencyHandler.core.markStateVariableAndUpstreamDependentsStale(
                        {
                            component:
                                this.dependencyHandler.components[
                                    this.upstreamComponentIdx
                                ],
                            varName: upVarName,
                        },
                    );
                }
            }
        }
    }

    async swapDownstreamComponents(index1: number, index2: number) {
        this.componentIdentitiesChanged = true;

        this.thawDownstreamArrays();

        [
            this.downstreamComponentIndices[index1],
            this.downstreamComponentIndices[index2],
        ] = [
            this.downstreamComponentIndices[index2],
            this.downstreamComponentIndices[index1],
        ];

        [
            this.downstreamComponentTypes[index1],
            this.downstreamComponentTypes[index2],
        ] = [
            this.downstreamComponentTypes[index2],
            this.downstreamComponentTypes[index1],
        ];

        if (
            this.originalDownstreamVariableNames.length > 0 ||
            this.originalVariablesByComponent
        ) {
            [
                this.mappedDownstreamVariableNamesByComponent[index1],
                this.mappedDownstreamVariableNamesByComponent[index2],
            ] = [
                this.mappedDownstreamVariableNamesByComponent[index2],
                this.mappedDownstreamVariableNamesByComponent[index1],
            ];

            [this.valuesChanged[index1], this.valuesChanged[index2]] = [
                this.valuesChanged[index2],
                this.valuesChanged[index1],
            ];
        }

        for (let upVarName of this.upstreamVariableNames) {
            if (
                this.dependencyHandler._components[this.upstreamComponentIdx]
                    .state[upVarName].initiallyResolved
            ) {
                await this.dependencyHandler.core.markStateVariableAndUpstreamDependentsStale(
                    {
                        component:
                            this.dependencyHandler.components[
                                this.upstreamComponentIdx
                            ],
                        varName: upVarName,
                    },
                );
            }
        }
    }

    deleteDependency() {
        // console.log(`deleting dependency: ${this.dependencyName}`)
        // console.log(this.upstreamComponentIdx, this.representativeStateVariable);

        let affectedDownstreamVariableNamesByUpstreamComponent: any[] = [];

        if (!this.mappedDownstreamVariableNamesByComponent) {
            affectedDownstreamVariableNamesByUpstreamComponent = Array(
                this.downstreamComponentIndices.length,
            ).fill([this.downstreamVariableNameIfNoVariables]);
        } else {
            affectedDownstreamVariableNamesByUpstreamComponent =
                this.mappedDownstreamVariableNamesByComponent;
            if (this.variablesOptional) {
                let newVarNames = [];
                for (let [
                    ind,
                    cIdx,
                ] of this.downstreamComponentIndices.entries()) {
                    let varNamesForComponent = [];
                    for (let vName of affectedDownstreamVariableNamesByUpstreamComponent[
                        ind as number
                    ]) {
                        if (
                            this.dependencyHandler.components[cIdx as number]
                                .state[vName as string]
                        ) {
                            varNamesForComponent.push(vName);
                        }
                    }

                    // if variablesOptional, it is possible that no variables were found
                    if (varNamesForComponent.length > 0) {
                        newVarNames.push(varNamesForComponent);
                    } else {
                        newVarNames.push([
                            this.downstreamVariableNameIfNoVariables,
                        ]);
                    }
                }
                affectedDownstreamVariableNamesByUpstreamComponent =
                    newVarNames;
            }
        }

        // delete from upstream dependencies of downstream components
        for (let [
            cInd,
            downCompIdx,
        ] of this.downstreamComponentIndices.entries()) {
            for (let vName of affectedDownstreamVariableNamesByUpstreamComponent[
                cInd as number
            ]) {
                let downCompUpDeps =
                    this.dependencyHandler.upstreamDependencies[
                        downCompIdx as number
                    ][vName as string];
                if (downCompUpDeps) {
                    let ind = downCompUpDeps.indexOf(this);
                    // if find an upstream dependency, delete
                    if (ind !== -1) {
                        if (downCompUpDeps.length === 1) {
                            delete this.dependencyHandler.upstreamDependencies[
                                downCompIdx as number
                            ][vName as string];
                        } else {
                            downCompUpDeps.splice(ind, 1);
                        }
                    }
                }

                for (let upVar of this.upstreamVariableNames) {
                    this.dependencyHandler.deleteFromNeededToResolve({
                        componentIdxBlocked: this.upstreamComponentIdx,
                        typeBlocked: "stateVariable",
                        stateVariableBlocked: upVar,
                        blockerType: "stateVariable",
                        blockerCode: downCompIdx + "|" + vName,
                    });
                }

                if (vName !== this.downstreamVariableNameIfNoVariables) {
                    for (let upstreamVarName of this.upstreamVariableNames) {
                        // TODO: check why have to do this when delete a dependency
                        this.dependencyHandler.resetCircularCheckPassed(
                            this.upstreamComponentIdx,
                            upstreamVarName,
                        );
                    }
                }
            }
        }

        this.deleteFromUpdateTriggers();

        // delete from downstream dependencies of upstream components

        let upCompDownDeps =
            this.dependencyHandler.downstreamDependencies[
                this.upstreamComponentIdx
            ];

        for (let varName of this.upstreamVariableNames) {
            delete upCompDownDeps[varName][this.dependencyName];
        }
    }

    deleteFromUpdateTriggers() {}

    async getValueNoProxy({
        verbose = false,
        consumeChanges = true,
    }: { verbose?: boolean; consumeChanges?: boolean } = {}) {
        return await Dependency.prototype.getValue.call(this, {
            verbose,
            skipProxy: true,
            consumeChanges,
        });
    }

    /**
     * Return current dependency value, change metadata, and used-default metadata.
     * When consumeChanges is false, this method reports current change flags without
     * clearing them from dependency state.
     */
    async getValue({
        verbose = false,
        skipProxy = false,
        consumeChanges = true,
    }: {
        verbose?: boolean;
        skipProxy?: boolean;
        consumeChanges?: boolean;
    } = {}): Promise<any> {
        let value: any = [];
        let changes: any = {};
        let usedDefault: any = [];

        if (this.componentIdentitiesChanged) {
            changes.componentIdentitiesChanged = true;
            if (consumeChanges) {
                this.componentIdentitiesChanged = false;
            }
        }

        for (let [
            componentInd,
            componentIdx,
        ] of this.downstreamComponentIndices.entries()) {
            let depComponent = this.dependencyHandler._components[componentIdx];

            usedDefault[componentInd] = false;

            if (depComponent) {
                let componentObj: any = {
                    componentType: depComponent.componentType,
                };

                if (!this.skipComponentIndices) {
                    componentObj.componentIdx = componentIdx;
                }

                if (depComponent.position) {
                    componentObj.position = JSON.parse(
                        JSON.stringify(depComponent.position),
                    );

                    componentObj.sourceDoc = depComponent.sourceDoc;
                }

                let originalVarNames;
                if (this.originalVariablesByComponent) {
                    originalVarNames =
                        this.originalDownstreamVariableNamesByComponent[
                            componentInd
                        ];
                } else {
                    originalVarNames = this.originalDownstreamVariableNames;
                }

                if (originalVarNames.length > 0) {
                    componentObj.stateValues = {};

                    let usedDefaultObj: any = {};
                    let foundOneUsedDefault = false;

                    for (let [
                        varInd,
                        originalVarName,
                    ] of originalVarNames.entries()) {
                        let mappedVarName =
                            this.mappedDownstreamVariableNamesByComponent[
                                componentInd
                            ][varInd];

                        let nameForOutput = this.useMappedVariableNames
                            ? mappedVarName
                            : originalVarName;

                        if (
                            !this.variablesOptional ||
                            mappedVarName in depComponent.state
                        ) {
                            let mappedStateVarObj =
                                depComponent.state[mappedVarName];
                            if (!mappedStateVarObj.deferred) {
                                componentObj.stateValues[nameForOutput] =
                                    await mappedStateVarObj.value;
                                // absent when already consumed and not
                                // marked changed since
                                let valueChanged =
                                    this.valuesChanged[componentInd][
                                        mappedVarName
                                    ];
                                if (valueChanged?.changed) {
                                    if (!changes.valuesChanged) {
                                        changes.valuesChanged = {};
                                    }
                                    if (!changes.valuesChanged[componentInd]) {
                                        changes.valuesChanged[componentInd] =
                                            {};
                                    }
                                    changes.valuesChanged[componentInd][
                                        nameForOutput
                                    ] = cloneChangeMetadataIfNeeded({
                                        changeMetadata: valueChanged,
                                        consumeChanges,
                                    });
                                }
                                if (consumeChanges) {
                                    // delete rather than reset to `{}`:
                                    // change records are recreated on demand,
                                    // and empty leftovers were a major
                                    // retained-memory cost
                                    delete this.valuesChanged[componentInd][
                                        mappedVarName
                                    ];
                                }

                                if (mappedStateVarObj.usedDefault) {
                                    usedDefaultObj[nameForOutput] = true;
                                    foundOneUsedDefault = true;
                                } else if (
                                    mappedStateVarObj.isArrayEntry &&
                                    mappedStateVarObj.arrayKeys.length === 1
                                ) {
                                    // if have an array entry with just one arrayKey,
                                    // check if used default for that arrayKey
                                    let arrayStateVarObj =
                                        depComponent.state[
                                            mappedStateVarObj.arrayStateVariable
                                        ];
                                    if (
                                        arrayStateVarObj.usedDefaultByArrayKey[
                                            mappedStateVarObj.arrayKeys[0]
                                        ]
                                    ) {
                                        usedDefaultObj[nameForOutput] = true;
                                        foundOneUsedDefault = true;
                                    }
                                }
                            }
                        }
                    }

                    if (foundOneUsedDefault) {
                        usedDefault[componentInd] = usedDefaultObj;
                    }
                }

                value.push(componentObj);
            } else {
                // no component, which means skipComponentIndices must be true
                // and we have no variables
                value.push({
                    componentType: this.downstreamComponentTypes[componentInd],
                });
            }
        }

        if (!verbose) {
            if (this.returnSingleVariableValue) {
                if (value.length === 1) {
                    value = value[0];
                    if (changes.valuesChanged && changes.valuesChanged[0]) {
                        changes.valuesChanged = changes.valuesChanged[0];
                    } else {
                        delete changes.valuesChanged;
                    }
                    usedDefault = usedDefault[0];

                    let stateVariables = Object.keys(value.stateValues);
                    if (stateVariables.length === 1) {
                        let nameForOutput = stateVariables[0];
                        value = value.stateValues[nameForOutput];

                        if (
                            changes.valuesChanged &&
                            changes.valuesChanged[nameForOutput]
                        ) {
                            changes.valuesChanged =
                                changes.valuesChanged[nameForOutput];
                        }

                        if (usedDefault) {
                            usedDefault = usedDefault[nameForOutput];
                        }
                    } else {
                        value = null;
                        changes = {};
                        usedDefault = false;
                    }
                } else {
                    value = null;
                    changes = {};
                    usedDefault = false;
                }
            } else if (this.returnSingleComponent) {
                if (value.length === 1) {
                    value = value[0];
                    if (changes.valuesChanged && changes.valuesChanged[0]) {
                        changes.valuesChanged = changes.valuesChanged[0];
                    } else {
                        delete changes.valuesChanged;
                    }
                    usedDefault = usedDefault[0];
                } else {
                    value = null;
                    usedDefault = false;
                }
            }
        }

        // if (!this.doNotProxy && !skipProxy &&
        //   value !== null && typeof value === 'object'
        // ) {
        //   value = new Proxy(value, readOnlyProxyHandler)
        // }

        return { value, changes, usedDefault };
    }

    checkForCircular() {
        for (let varName of this.upstreamVariableNames) {
            this.dependencyHandler.resetCircularCheckPassed(
                this.upstreamComponentIdx,
                varName,
            );
        }
        for (let varName of this.upstreamVariableNames) {
            this.dependencyHandler.checkForCircularDependency({
                componentIdx: this.upstreamComponentIdx,
                varName,
            });
        }
    }

    async recalculateDownstreamComponents({ force = false } = {}) {
        // console.log(`recalc down of ${this.dependencyName} of ${this.representativeStateVariable} of ${this.upstreamComponentIdx}`)

        let newDownComponents = await this.determineDownstreamComponents({
            force,
        });

        // this.downstreamComponentIndices = newDownComponents.downstreamComponentIndices;
        // this.downstreamComponentTypes = newDownComponents.downstreamComponentTypes;

        let newComponentIndices = newDownComponents.downstreamComponentIndices;

        let foundChange =
            newComponentIndices.length !==
                this.downstreamComponentIndices.length ||
            this.downstreamComponentIndices.some(
                (v: any, i: number) => v != newComponentIndices[i],
            );

        if (foundChange) {
            this.componentIdentitiesChanged = true;

            // first remove any components that are no longer present

            let nRemoved = 0;
            for (let [ind, downCompIdx] of [
                ...this.downstreamComponentIndices,
            ].entries()) {
                if (!newComponentIndices.includes(downCompIdx)) {
                    await this.removeDownstreamComponent({
                        indexToRemove: ind - nRemoved,
                    });
                    nRemoved++;
                }
            }

            for (let [ind, downCompIdx] of newComponentIndices.entries()) {
                let oldInd =
                    this.downstreamComponentIndices.indexOf(downCompIdx);

                if (oldInd !== -1) {
                    if (oldInd !== ind) {
                        await this.swapDownstreamComponents(oldInd, ind);
                    }
                } else {
                    await this.addDownstreamComponent({
                        downstreamComponentIdx: downCompIdx,
                        downstreamComponentType:
                            newDownComponents.downstreamComponentTypes[ind],
                        index: ind,
                    });
                }
            }
        }

        if (this.originalVariablesByComponent) {
            for (let [ind, downCompIdx] of [
                ...this.downstreamComponentIndices,
            ].entries()) {
                if (
                    this.mappedDownstreamVariableNamesByComponent[ind]
                        .length !==
                        this.originalDownstreamVariableNamesByComponent[ind]
                            .length ||
                    this.mappedDownstreamVariableNamesByComponent[ind].some(
                        (v: any, i: number) =>
                            this.originalDownstreamVariableNamesByComponent[
                                ind
                            ][i] !== v,
                    )
                ) {
                    // remove and add back downstream component
                    // so that the variables are reinitialized

                    await this.removeDownstreamComponent({
                        indexToRemove: ind,
                    });

                    await this.addDownstreamComponent({
                        downstreamComponentIdx: downCompIdx,
                        downstreamComponentType:
                            newDownComponents.downstreamComponentTypes[ind],
                        index: ind,
                    });
                }
            }
        }

        return { success: newDownComponents.success };
    }

    /**
     * Add resolve blockers to this dependency due to the component with `componentIdx`
     * not existing as well as update triggers that will attempt to resolve
     * this dependency when the component is created.
     */
    async addBlockerUpdateTriggerForMissingComponent(componentIdx: number) {
        this.addUpdateTriggerForMissingComponent(componentIdx);

        for (const varName of this.upstreamVariableNames) {
            await this.dependencyHandler.addBlocker({
                blockerComponentIdx: componentIdx,
                blockerType: "componentIdentity",
                componentIdxBlocked: this.upstreamComponentIdx,
                typeBlocked: "recalculateDownstreamComponents",
                stateVariableBlocked: varName,
                dependencyBlocked: this.dependencyName,
            });

            await this.dependencyHandler.addBlocker({
                blockerComponentIdx: this.upstreamComponentIdx,
                blockerType: "recalculateDownstreamComponents",
                blockerStateVariable: varName,
                blockerDependency: this.dependencyName,
                componentIdxBlocked: this.upstreamComponentIdx,
                typeBlocked: "stateVariable",
                stateVariableBlocked: varName,
            });
        }
    }

    /**
     * Add update triggers to the component with `componentIdx`
     * that will update this dependency when the component is created.
     */
    async addUpdateTriggerForMissingComponent(componentIdx: number) {
        let dependenciesMissingComponent =
            this.dependencyHandler.updateTriggers
                .dependenciesMissingComponentBySpecifiedName[componentIdx];
        if (!dependenciesMissingComponent) {
            dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                    componentIdx
                ] = [];
        }
        if (!dependenciesMissingComponent.includes(this)) {
            dependenciesMissingComponent.push(this);
        }
    }

    /**
     * Delete any update triggers for this component based on `componentIdx` not yet existing
     */
    async deleteUpdateTriggerForMissingComponent(componentIdx: number) {
        const dependenciesMissingComponent =
            this.dependencyHandler.updateTriggers
                .dependenciesMissingComponentBySpecifiedName[componentIdx];
        if (dependenciesMissingComponent) {
            const ind = dependenciesMissingComponent.indexOf(this);
            if (ind !== -1) {
                dependenciesMissingComponent.splice(ind, 1);
            }
        }
    }

    /**
     * Add a resolve blocker to this dependency based on `varName` of `componentIdx`
     * not yet being resolved.
     */
    async addBlockerForUnresolvedStateVariable(
        componentIdx: number,
        varName: string,
    ) {
        for (const vName of this.upstreamVariableNames) {
            await this.dependencyHandler.addBlocker({
                blockerComponentIdx: componentIdx,
                blockerType: "stateVariable",
                blockerStateVariable: varName,
                componentIdxBlocked: this.upstreamComponentIdx,
                typeBlocked: "recalculateDownstreamComponents",
                stateVariableBlocked: vName,
                dependencyBlocked: this.dependencyName,
            });

            await this.dependencyHandler.addBlocker({
                blockerComponentIdx: this.upstreamComponentIdx,
                blockerType: "recalculateDownstreamComponents",
                blockerStateVariable: vName,
                blockerDependency: this.dependencyName,
                componentIdxBlocked: this.upstreamComponentIdx,
                typeBlocked: "stateVariable",
                stateVariableBlocked: vName,
            });
        }
    }

    /**
     * Add a resolve blocker to this dependency based on `composite`
     * not yet being expanded.
     */
    async addBlockerForUnexpandedComposite(composite: any) {
        for (const varName of this.upstreamVariableNames) {
            await this.dependencyHandler.addBlocker({
                blockerComponentIdx: this.upstreamComponentIdx,
                blockerType: "recalculateDownstreamComponents",
                blockerStateVariable: varName,
                blockerDependency: this.dependencyName,
                componentIdxBlocked: this.upstreamComponentIdx,
                typeBlocked: "stateVariable",
                stateVariableBlocked: varName,
            });

            await this.dependencyHandler.addBlocker({
                blockerComponentIdx: composite.componentIdx,
                blockerType: "expandComposite",
                componentIdxBlocked: this.upstreamComponentIdx,
                typeBlocked: "recalculateDownstreamComponents",
                stateVariableBlocked: varName,
                dependencyBlocked: this.dependencyName,
            });
        }

        if (!composite.state.readyToExpandWhenResolved.isResolved) {
            await this.dependencyHandler.addBlocker({
                blockerComponentIdx: composite.componentIdx,
                blockerType: "stateVariable",
                blockerStateVariable: "readyToExpandWhenResolved",
                componentIdxBlocked: composite.componentIdx,
                typeBlocked: "expandComposite",
            });
        }
    }

    /** Add an update trigger to this dependency that will update it
     * if the replacements of any composite in `composites` are changed. */
    addUpdateTriggersForCompositeReplacements(composites: number[]) {
        for (let cIdx of composites) {
            let replacementDependencies =
                this.dependencyHandler.updateTriggers
                    .replacementDependenciesByComposite[cIdx];
            if (!replacementDependencies) {
                replacementDependencies =
                    this.dependencyHandler.updateTriggers.replacementDependenciesByComposite[
                        cIdx
                    ] = [];
            }
            if (!replacementDependencies.includes(this)) {
                replacementDependencies.push(this);
            }
        }
    }

    /**
     * Delete any update triggers for this dependency based on the replacements of `composites`.
     */
    deleteUpdateTriggersForCompositeReplacements(composites: number[]) {
        for (let compositeIdx of composites) {
            let replacementDeps =
                this.dependencyHandler.updateTriggers
                    .replacementDependenciesByComposite[compositeIdx];
            if (replacementDeps) {
                let ind = replacementDeps.indexOf(this);
                if (ind !== -1) {
                    replacementDeps.splice(ind, 1);
                }
            }
        }
    }
}
