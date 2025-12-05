import ParameterStack from "./ParameterStack";
import Numerics from "./Numerics";
import seedrandom from "seedrandom";
import me from "math-expressions";
import {
    serializedComponentsReplacer,
    serializedComponentsReviver,
    deepClone,
    assignDoenetMLRange,
    findAllNewlines,
    flattenDeep,
    data_format_version,
} from "@doenet/utils";
import { convertToErrorComponent } from "./utils/dast/errors";
import { gatherVariantComponents, getNumVariants } from "./utils/variants";
import {
    removeFunctionsMathExpressionClass,
    preprocessMathInverseDefinition,
} from "./utils/math";
import {
    addAttributesToSingleReplacement,
    postProcessCopy,
    verifyReplacementsMatchSpecifiedType,
} from "./utils/copy";
import {
    convertUnresolvedAttributesForComponentType,
    unwrapSource,
} from "./utils/dast/convertNormalizedDast";
import { DependencyHandler } from "./Dependencies";
import {
    returnDefaultArrayVarNameFromPropIndex,
    returnDefaultGetArrayKeysFromVarName,
} from "./utils/stateVariables";
import { set as idb_set } from "idb-keyval";
import {
    createComponentIndicesFromSerializedChildren,
    createNewComponentIndices,
    extractCreateComponentIdxMapping,
} from "./utils/componentIndices";
import {
    addNodesToFlatFragment,
    getEffectiveComponentIdx,
} from "./utils/resolver";

// string to componentClass: this.componentInfoObjects.allComponentClasses["string"]
// componentClass to string: componentClass.componentType

export default class Core {
    constructor({
        doenetML,
        serializedDocument,
        nComponentsInit,
        componentInfoObjects,
        flags,
        allDoenetMLs,
        // Note: we ignore preliminary errors, as we'll gather those from the dast when processing it.
        preliminaryErrors: _preliminaryErrors,
        preliminaryWarnings,
        activityId,
        cid,
        docId,
        attemptNumber = 1,
        requestedVariant,
        requestedVariantIndex,
        initializeCounters = {},
        theme,
        prerender = false,
        stateVariableChanges: stateVariableChangesString,
        coreId,
        addNodesToResolver,
        replaceIndexResolutionsInResolver,
        deleteNodesFromResolver,
        resolvePath,
        calculateRootNames,
        updateRenderersCallback,
        reportScoreAndStateCallback,
        requestAnimationFrame,
        cancelAnimationFrame,
        copyToClipboard,
        sendEvent,
        requestSolutionView,
    }) {
        // console.time('core');

        // console.log("serialized document", serializedDocument);

        this.coreId = coreId;
        this.activityId = activityId;
        this.docId = docId;
        this.attemptNumber = attemptNumber;
        this.doenetML = doenetML;
        this.allDoenetMLs = allDoenetMLs;
        this.serializedDocument = serializedDocument;
        this.nComponentsInit = nComponentsInit;
        this.createComponentIdxMapping = {};

        this.addNodesToResolver = addNodesToResolver;
        this.replaceIndexResolutionsInResolver =
            replaceIndexResolutionsInResolver;
        this.deleteNodesFromResolver = deleteNodesFromResolver;
        this.resolvePath = resolvePath;
        this.calculateRootNames = calculateRootNames;

        this.rootNames = this.calculateRootNames?.().names;

        this.updateRenderersCallback = updateRenderersCallback;
        this.reportScoreAndStateCallback = reportScoreAndStateCallback;
        this.requestAnimationFrame = requestAnimationFrame;
        this.cancelAnimationFrame = cancelAnimationFrame;
        this.copyToClipboard = copyToClipboard;
        this.sendEvent = sendEvent;
        this.requestSolutionViewCallback = requestSolutionView;

        this.cid = cid;

        this.errorWarnings = {};

        this.errorWarnings.errors = [];
        this.errorWarnings.warnings = [...preliminaryWarnings];

        this.numerics = new Numerics();
        // this.flags = new Proxy(flags, readOnlyProxyHandler); //components shouldn't modify flags
        this.flags = flags;
        this.theme = theme;

        this.getDast = this.generateDast.bind(this);
        this.getStateVariableValue = this.getStateVariableValue.bind(this);

        this.componentInfoObjects = componentInfoObjects;

        this.initializeCounters = initializeCounters;

        const stateVariableChanges = stateVariableChangesString
            ? JSON.parse(
                  stateVariableChangesString,
                  serializedComponentsReviver,
              )
            : {};

        this.receivedStateVariableChanges = Boolean(stateVariableChangesString);

        this.coreFunctions = {
            requestUpdate: this.requestUpdate.bind(this),
            performUpdate: this.performUpdate.bind(this),
            requestAction: this.requestAction.bind(this),
            performAction: this.performAction.bind(this),
            triggerChainedActions: this.triggerChainedActions.bind(this),
            updateRenderers: this.updateRenderers.bind(this),
            requestRecordEvent: this.requestRecordEvent.bind(this),
            requestAnimationFrame: this.requestAnimationFrame.bind(this),
            cancelAnimationFrame: this.cancelAnimationFrame.bind(this),
            requestSolutionView: this.requestSolutionView.bind(this),
            requestComponentDoenetML: this.requestComponentDoenetML.bind(this),
            copyToClipboard: this.copyToClipboard.bind(this),
            navigateToTarget: this.navigateToTarget.bind(this),
        };

        this.updateInfo = {
            componentsToUpdateRenderers: new Set([]),
            compositesToExpand: new Set([]),
            compositesToUpdateReplacements: new Set([]),
            inactiveCompositesToUpdateReplacements: new Set([]),
            componentsToUpdateActionChaining: {},

            unresolvedDependencies: {},
            unresolvedByDependent: {},
            deletedStateVariables: {},
            deletedComponents: {},
            // parentsToUpdateDescendants: new Set(),
            compositesBeingExpanded: [],
            // stateVariableUpdatesForMissingComponents: deepClone(stateVariableChanges),
            stateVariableUpdatesForMissingComponents: JSON.parse(
                JSON.stringify(
                    stateVariableChanges,
                    serializedComponentsReplacer,
                ),
                serializedComponentsReviver,
            ),
            stateVariablesToEvaluate: [],
        };

        this.newErrorWarning = true;

        this.cumulativeStateVariableChanges = JSON.parse(
            JSON.stringify(stateVariableChanges, serializedComponentsReplacer),
            serializedComponentsReviver,
        );

        this.requestedVariantIndex = requestedVariantIndex;
        this.requestedVariant = requestedVariant;

        this.visibilityInfo = {
            componentsCurrentlyVisible: {},
            infoToSend: {},
            timeLastSent: new Date(),
            saveDelay: 60000,
            saveTimerId: null,
            suspendDelay: 3 * 60000,
            suspendTimerId: null,
            suspended: false,
            documentHasBeenVisible: false,
        };

        // console.time('serialize doenetML');

        this.parameterStack = new ParameterStack();

        this.parameterStack.parameters.rngClass = seedrandom.alea;
        this.parameterStack.parameters.prerender = prerender;
    }

    /**
     * Construct core from the DoenetML in order to generate the Dast that can be used
     * to render the document.
     *
     * Creates all components and resolves all dependencies necessary to determine
     * state variables that are marked `forRenderer`.
     *
     * The dast is communicated back to the renderer via calls to `updateRenderersCallback`.
     */
    async generateDast() {
        this.doenetMLNewlines = findAllNewlines(this.allDoenetMLs[0]);

        let serializedComponents = [deepClone(this.serializedDocument)];

        // console.log(`serialized components at the beginning`)
        // console.log(deepClone(serializedComponents));

        numberAnswers(serializedComponents, this.componentInfoObjects);

        this.documentIdx = serializedComponents[0].componentIdx;

        if (!serializedComponents[0].state) {
            serializedComponents[0].state = {};
        }
        serializedComponents[0].state.theme = this.theme;

        serializedComponents[0].doenetAttributes.cid = this.cid;

        this._components = [];
        this._components[this.nComponentsInit - 1] = undefined;
        this.componentsToRender = {};
        this.componentsWithChangedChildrenToRender = new Set([]);

        this.stateVariableChangeTriggers = {};
        this.actionsChangedToActions = {};
        this.originsOfActionsChangedToActions = {};

        this.essentialValuesSavedInDefinition = {};

        this.saveStateToDBTimerId = null;

        // rendererState the current state of each renderer, keyed by componentIdx
        this.rendererState = {};

        // rendererVariablesByComponentType is a description
        // of the which variables are sent to the renderers,
        // keyed by componentType
        this.rendererVariablesByComponentType = {};
        for (let componentType in this.componentInfoObjects
            .allComponentClasses) {
            Object.defineProperty(
                this.rendererVariablesByComponentType,
                componentType,
                {
                    get: function () {
                        let varDescriptions =
                            this.componentInfoObjects.allComponentClasses[
                                componentType
                            ].returnStateVariableInfo({
                                onlyForRenderer: true,
                            }).stateVariableDescriptions;
                        delete this.rendererVariablesByComponentType[
                            componentType
                        ];
                        return (this.rendererVariablesByComponentType[
                            componentType
                        ] = varDescriptions);
                    }.bind(this),
                    configurable: true,
                },
            );
        }

        this.processQueue = [];

        this.stopProcessingRequests = false;

        this.dependencies = new DependencyHandler({
            _components: this._components,
            componentInfoObjects: this.componentInfoObjects,
            core: this,
        });

        this.unmatchedChildren = {};

        // console.timeEnd('serialize doenetML');

        let numVariants = getNumVariants({
            serializedComponent: serializedComponents[0],
            componentInfoObjects: this.componentInfoObjects,
        }).numVariants;

        if (!this.requestedVariant) {
            // don't have full variant, just requested variant index

            this.requestedVariantIndex =
                ((((this.requestedVariantIndex - 1) % numVariants) +
                    numVariants) %
                    numVariants) +
                1;

            if (serializedComponents[0].variants.uniqueVariants) {
                let docClass =
                    this.componentInfoObjects.allComponentClasses[
                        serializedComponents[0].componentType
                    ];

                let result = docClass.getUniqueVariant({
                    serializedComponent: serializedComponents[0],
                    variantIndex: this.requestedVariantIndex,
                    componentInfoObjects: this.componentInfoObjects,
                });

                if (result.success) {
                    this.requestedVariant = result.desiredVariant;
                }
            }

            // either didn't have unique variants
            // or getting unique variant failed,
            // so just set variant index
            // and rest of variant will be generated from that index
            if (!this.requestedVariant) {
                this.requestedVariant = { index: this.requestedVariantIndex };
            }
        }

        this.parameterStack.parameters.variant = this.requestedVariant;
        serializedComponents[0].variants.desiredVariant =
            this.parameterStack.parameters.variant;

        // //Make these variables available for cypress
        // window.state = {
        //   components: this._components,
        //   componentsToRender: this.componentsToRender,
        //   renderedComponentTypes: this.renderedComponentTypes,
        //   dependencies: this.dependencies,
        //   core: this,
        //   componentInfoObjects: this.componentInfoObjects,
        // }

        // this.changedStateVariables = {};

        await this.addComponents({
            serializedComponents,
            initialAdd: true,
        });

        this.updateInfo.componentsToUpdateRenderers.clear();

        // evaluate componentCreditAchieved so that will be fresh
        // and can detect changes when it is marked stale
        await this.document.stateValues.componentCreditAchieved;

        // console.log(serializedComponents)
        // console.timeEnd('start up time');
        // console.log("** components at the end of the core constructor **");
        // console.log(this._components);

        this.canonicalGeneratedVariantString = JSON.stringify(
            await this.document.stateValues.generatedVariantInfo,
            serializedComponentsReplacer,
        );
        this.canonicalDocVariantStrings = (
            await this.document.stateValues.docVariantInfo
        ).map((x) => JSON.stringify(x, serializedComponentsReplacer));

        // Note: coreInfo is fixed even though this.rendererTypesInDocument could change
        // Note 2: both canonical variant strings and original rendererTypesInDocument
        // could differ depending on the initial state
        this.coreInfo = {
            generatedVariantString: this.canonicalGeneratedVariantString,
            allPossibleVariants: deepClone(
                await this.document.sharedParameters.allPossibleVariants,
            ),
            rendererTypesInDocument: deepClone(this.rendererTypesInDocument),
            documentToRender: this.documentRendererInstructions,
        };

        this.coreInfoString = JSON.stringify(
            this.coreInfo,
            serializedComponentsReplacer,
        );

        if (this.cumulativeStateVariableChanges.__componentNeedingUpdateValue) {
            await this.performAction({
                actionName: "updateValue",
                componentIdx:
                    this.cumulativeStateVariableChanges
                        .__componentNeedingUpdateValue,
                args: { doNotIgnore: true },
            });
        }

        if (!this.receivedStateVariableChanges) {
            // TODO: find a way to delay this until after send the result on
            this.saveState();
        }

        const returnResult = {
            coreInfo: this.coreInfo,
        };

        // warning if there are any children that are unmatched
        if (Object.keys(this.unmatchedChildren).length > 0) {
            for (const componentIdxStr in this.unmatchedChildren) {
                let parent = this._components[componentIdxStr];
                this.addErrorWarning({
                    type: "warning",
                    message: this.unmatchedChildren[componentIdxStr].message,
                    level: 1,
                    position: parent.position,
                    sourceDoc: parent.sourceDoc,
                });
            }
        }

        let errorWarnings = undefined;
        if (this.newErrorWarning) {
            errorWarnings = this.getErrorWarnings().errorWarnings;
        }

        return { ...returnResult, errorWarnings };
    }

    async onDocumentFirstVisible() {
        this.requestRecordEvent({
            verb: "experienced",
            object: {
                componentIdx: this.document.componentIdx,
                componentType: "document",
            },
        });

        await this.document.stateValues.scoredDescendants; // to evaluated scoredDescendants

        setTimeout(
            this.sendVisibilityChangedEvents.bind(this),
            this.visibilityInfo.saveDelay,
        );
    }

    async callUpdateRenderers(args, init = false) {
        let errorWarnings = undefined;
        if (this.newErrorWarning) {
            errorWarnings = this.getErrorWarnings().errorWarnings;
        }

        this.updateRenderersCallback({ ...args, init, errorWarnings });
    }

    getErrorWarnings() {
        // keep only the last warnings
        let warningLimit = 1000;
        this.errorWarnings.warnings =
            this.errorWarnings.warnings.slice(-warningLimit);

        this.newErrorWarning = false;

        return { errorWarnings: this.errorWarnings };
    }

    addErrorWarning({ type, message, position, sourceDoc, level }) {
        if (type === "warning") {
            this.errorWarnings.warnings.push({
                type,
                message,
                position,
                sourceDoc,
                level,
            });
        } else if (type === "error") {
            this.errorWarnings.errors.push({
                type,
                message,
                position,
                sourceDoc,
            });
        } else {
            throw Error("Invalid error or warning: type not specified");
        }
        this.newErrorWarning = true;
    }

    async addComponents({
        serializedComponents,
        parentIdx,
        indexOfDefiningChildren,
        initialAdd = false,
    }) {
        if (!Array.isArray(serializedComponents)) {
            serializedComponents = [serializedComponents];
        }

        let parent;
        let ancestors = [];

        if (!initialAdd) {
            parent = this._components[parentIdx];
            if (!parent) {
                this.addErrorWarning({
                    type: "warning",
                    message: `Cannot add children to parent ${parentIdx} as ${parentIdx} does not exist`,
                    level: 1,
                });
                return [];
            }

            ancestors = [
                {
                    componentIdx: parentIdx,
                    componentClass: parent.constructor,
                },
                ...parent.ancestors,
            ];

            this.parameterStack.push(parent.sharedParameters, false);

            if (!this.nTimesAddedComponents) {
                this.nTimesAddedComponents = 1;
            } else {
                this.nTimesAddedComponents++;
            }

            this.addComponentsToResolver(serializedComponents, parentIdx);
        }
        let createResult = await this.createIsolatedComponents({
            serializedComponents,
            ancestors,
        });
        if (!initialAdd) {
            this.parameterStack.pop();
        }

        const newComponents = createResult.components;

        let deletedComponents = {};
        let addedComponents = {};
        newComponents.forEach((x) => (addedComponents[x.componentIdx] = x));

        if (initialAdd) {
            if (newComponents.length !== 1) {
                throw Error(
                    "Initial components need to be an array of just one component.",
                );
            }
            // this.setAncestors(newComponents[0]);
            this.document = newComponents[0];

            await this.expandAllComposites(this.document);

            await this.expandAllComposites(this.document, true);

            if (this.updateInfo.stateVariablesToEvaluate) {
                let stateVariablesToEvaluate =
                    this.updateInfo.stateVariablesToEvaluate;
                this.updateInfo.stateVariablesToEvaluate = [];
                for (let {
                    componentIdx,
                    stateVariable,
                } of stateVariablesToEvaluate) {
                    let comp = this._components[componentIdx];
                    if (comp && comp.state[stateVariable]) {
                        await this.getStateVariableValue({
                            component: comp,
                            stateVariable,
                        });
                    }
                }
            }

            // calculate any replacement changes on composites touched
            await this.replacementChangesFromCompositesToUpdate();

            let results = await this.initializeRenderedComponentInstruction(
                this.document,
            );

            // initializing renderer instructions could trigger more composite updates
            // (presumably from deriving child results)
            // if so, make replacement changes and update renderer instructions again
            // TODO: should we check for child results earlier so we don't have to check them
            // when updating renderer instructions?
            if (this.updateInfo.compositesToUpdateReplacements.size > 0) {
                await this.replacementChangesFromCompositesToUpdate();

                let componentNamesToUpdate = [
                    ...this.updateInfo.componentsToUpdateRenderers,
                ];
                this.updateInfo.componentsToUpdateRenderers.clear();

                await this.updateRendererInstructions({
                    componentNamesToUpdate,
                });
            }

            this.documentRendererInstructions = results.componentToRender;

            let updateInstructions = [
                {
                    instructionType: "updateRendererStates",
                    rendererStatesToUpdate: results.rendererStatesToUpdate,
                },
            ];

            this.callUpdateRenderers({ updateInstructions }, true);

            // if have some states to force update
            // then post these updates without setting init to true
            if (results.rendererStatesToForceUpdate.length > 0) {
                let updateInstructions = [
                    {
                        instructionType: "updateRendererStates",
                        rendererStatesToUpdate:
                            results.rendererStatesToForceUpdate,
                    },
                ];
                this.callUpdateRenderers({ updateInstructions });
            }

            await this.processStateVariableTriggers(true);
        } else {
            if (parent === undefined) {
                throw Error("Must specify parent when adding components.");
            }
            if (indexOfDefiningChildren === undefined) {
                indexOfDefiningChildren = parent.definingChildren.length;
            }

            let addResults = await this.addChildrenAndRecurseToShadows({
                parent,
                indexOfDefiningChildren: indexOfDefiningChildren,
                newChildren: newComponents,
            });
            if (!addResults.success) {
                throw Error(
                    "Couldn't satisfy child logic result.  Need informative error message",
                );
            }
            Object.assign(addedComponents, addResults.addedComponents);
            Object.assign(deletedComponents, addResults.deletedComponents);

            await this.expandAllComposites(this.document);
            await this.expandAllComposites(this.document, true);

            if (this.updateInfo.stateVariablesToEvaluate) {
                let stateVariablesToEvaluate =
                    this.updateInfo.stateVariablesToEvaluate;
                this.updateInfo.stateVariablesToEvaluate = [];
                for (let {
                    componentIdx,
                    stateVariable,
                } of stateVariablesToEvaluate) {
                    let comp = this._components[componentIdx];
                    if (comp && comp.state[stateVariable]) {
                        await this.getStateVariableValue({
                            component: comp,
                            stateVariable,
                        });
                    }
                }
            }
            // calculate any replacement changes on composites touched
            await this.replacementChangesFromCompositesToUpdate();

            await this.updateRendererInstructions({
                componentNamesToUpdate:
                    await this.componentAndRenderedDescendants(parent),
            });

            // updating renderer instructions could trigger more composite updates
            // (presumably from deriving child results)
            // if so, make replacement changes and update renderer instructions again
            // TODO: should we check for child results earlier so we don't have to check them
            // when updating renderer instructions?
            if (this.updateInfo.compositesToUpdateReplacements.size > 0) {
                await this.replacementChangesFromCompositesToUpdate();

                let componentNamesToUpdate = [
                    ...this.updateInfo.componentsToUpdateRenderers,
                ];
                this.updateInfo.componentsToUpdateRenderers.clear();

                await this.updateRendererInstructions({
                    componentNamesToUpdate,
                });
            }

            await this.processStateVariableTriggers(true);
        }

        return newComponents;
    }

    async updateRendererInstructions({
        componentNamesToUpdate,
        sourceOfUpdate = {},
        actionId,
    }) {
        let deletedRenderers = [];

        let updateInstructions = [];
        let rendererStatesToUpdate = [];

        let newChildrenInstructions = {};

        // copy components with changed children and reset for next time
        let componentsWithChangedChildrenToRenderInProgress =
            this.componentsWithChangedChildrenToRender;
        this.componentsWithChangedChildrenToRender = new Set([]);

        //TODO: Figure out what we need from here
        for (let componentIdx of componentsWithChangedChildrenToRenderInProgress) {
            if (componentIdx in this.componentsToRender) {
                // check to see if current children who render are
                // different from last time rendered

                let currentChildIdentifiers = [];
                let unproxiedComponent = this._components[componentIdx];
                let indicesToRender = [];

                if (
                    unproxiedComponent &&
                    unproxiedComponent.constructor.renderChildren
                ) {
                    if (!unproxiedComponent.matchedCompositeChildren) {
                        await this.deriveChildResultsFromDefiningChildren({
                            parent: unproxiedComponent,
                            expandComposites: true,
                            forceExpandComposites: true,
                        });
                    }

                    indicesToRender =
                        await this.returnActiveChildrenIndicesToRender(
                            unproxiedComponent,
                        );

                    let renderedInd = 0;
                    for (let [
                        ind,
                        child,
                    ] of unproxiedComponent.activeChildren.entries()) {
                        if (indicesToRender.includes(ind)) {
                            if (child.rendererType) {
                                currentChildIdentifiers.push(
                                    `nameType:${child.componentIdx};${child.componentType}`,
                                );
                                renderedInd++;
                            } else if (typeof child === "string") {
                                currentChildIdentifiers.push(
                                    `string${renderedInd}:${child}`,
                                );
                                renderedInd++;
                            } else if (typeof child === "number") {
                                currentChildIdentifiers.push(
                                    `number${renderedInd}:${child.toString()}`,
                                );
                                renderedInd++;
                            } else {
                                currentChildIdentifiers.push("");
                            }
                        } else {
                            currentChildIdentifiers.push("");
                        }
                    }
                }

                let previousChildRenderers =
                    this.componentsToRender[componentIdx].children;

                let previousChildIdentifiers = [];
                for (let [ind, child] of previousChildRenderers.entries()) {
                    if (child === null) {
                        previousChildIdentifiers.push("");
                    } else if (child.componentIdx != undefined) {
                        previousChildIdentifiers.push(
                            `nameType:${child.componentIdx};${child.componentType}`,
                        );
                    } else if (typeof child === "string") {
                        previousChildIdentifiers.push(`string${ind}:${child}`);
                    } else if (typeof child === "number") {
                        previousChildIdentifiers.push(
                            `number${ind}:${child.toString()}`,
                        );
                    }
                }

                if (
                    currentChildIdentifiers.length !==
                        previousChildIdentifiers.length ||
                    currentChildIdentifiers.some(
                        (v, i) => v !== previousChildIdentifiers[i],
                    )
                ) {
                    // delete old renderers
                    for (let child of previousChildRenderers) {
                        if (child?.componentIdx != undefined) {
                            let deletedNames =
                                this.deleteFromComponentsToRender({
                                    componentIdx: child.componentIdx,
                                    recurseToChildren: true,
                                    componentsWithChangedChildrenToRenderInProgress,
                                });
                            deletedRenderers.push(...deletedNames);
                        }
                    }

                    // create new renderers
                    let childrenToRender = [];
                    if (indicesToRender.length > 0) {
                        for (let [
                            ind,
                            child,
                        ] of unproxiedComponent.activeChildren.entries()) {
                            if (indicesToRender.includes(ind)) {
                                if (child.rendererType) {
                                    let results =
                                        await this.initializeRenderedComponentInstruction(
                                            child,
                                            componentsWithChangedChildrenToRenderInProgress,
                                        );
                                    childrenToRender.push(
                                        results.componentToRender,
                                    );
                                    rendererStatesToUpdate.push(
                                        ...results.rendererStatesToUpdate,
                                    );
                                } else if (typeof child === "string") {
                                    childrenToRender.push(child);
                                } else if (typeof child === "number") {
                                    childrenToRender.push(child.toString());
                                } else {
                                    childrenToRender.push(null);
                                }
                            } else {
                                childrenToRender.push(null);
                            }
                        }
                    }

                    this.componentsToRender[componentIdx].children =
                        childrenToRender;

                    newChildrenInstructions[componentIdx] = childrenToRender;

                    componentsWithChangedChildrenToRenderInProgress.delete(
                        componentIdx,
                    );

                    if (!componentNamesToUpdate.includes(componentIdx)) {
                        componentNamesToUpdate.push(componentIdx);
                    }
                }
            }
        }

        for (let componentIdx of componentNamesToUpdate) {
            if (
                componentIdx in this.componentsToRender
                // && !deletedRenderers.includes(componentIdx)  TODO: what if recreate with same name?
            ) {
                let component = this._components[componentIdx];
                if (component) {
                    let stateValuesForRenderer = {};
                    for (let stateVariable in component.state) {
                        if (component.state[stateVariable].forRenderer) {
                            let value = removeFunctionsMathExpressionClass(
                                await component.state[stateVariable].value,
                            );
                            // if (value !== null && typeof value === 'object') {
                            //   value = new Proxy(value, readOnlyProxyHandler)
                            // }
                            stateValuesForRenderer[stateVariable] = value;
                        }
                    }

                    if (component.compositeReplacementActiveRange) {
                        stateValuesForRenderer._compositeReplacementActiveRange =
                            component.compositeReplacementActiveRange;
                    }

                    let newRendererState = {
                        componentIdx,
                        stateValues: stateValuesForRenderer,
                        rendererType: component.rendererType, // TODO: need this to ignore baseVariables change: is this right place?
                    };

                    // this.renderState is used to save the renderer state to the database
                    if (!this.rendererState[componentIdx]) {
                        this.rendererState[componentIdx] = {};
                    }

                    this.rendererState[componentIdx].stateValues =
                        stateValuesForRenderer;

                    // only add childrenInstructions if they changed
                    if (newChildrenInstructions[componentIdx]) {
                        newRendererState.childrenInstructions =
                            newChildrenInstructions[componentIdx];
                        this.rendererState[componentIdx].childrenInstructions =
                            newChildrenInstructions[componentIdx];
                    }

                    rendererStatesToUpdate.push(newRendererState);
                }
            }
        }

        // rendererStatesToUpdate = rendererStatesToUpdate.filter(x => !deletedRenderers.includes(x))
        if (rendererStatesToUpdate.length > 0) {
            let instruction = {
                instructionType: "updateRendererStates",
                rendererStatesToUpdate,
                sourceOfUpdate,
            };
            updateInstructions.splice(0, 0, instruction);
        }

        this.callUpdateRenderers({ updateInstructions, actionId });
    }

    async initializeRenderedComponentInstruction(
        component,
        componentsWithChangedChildrenToRenderInProgress = new Set([]),
    ) {
        if (component.rendererType === undefined) {
            return;
        }

        if (!component.matchedCompositeChildren) {
            await this.deriveChildResultsFromDefiningChildren({
                parent: component,
                expandComposites: true, //forceExpandComposites: true,
            });
        }

        let rendererStatesToUpdate = [];
        let rendererStatesToForceUpdate = [];

        let stateValuesForRenderer = {};
        let stateValuesForRendererAlwaysUpdate = {};
        let alwaysUpdate = false;
        for (let stateVariable in component.state) {
            if (component.state[stateVariable].forRenderer) {
                stateValuesForRenderer[stateVariable] =
                    removeFunctionsMathExpressionClass(
                        await component.state[stateVariable].value,
                    );
                if (component.state[stateVariable].alwaysUpdateRenderer) {
                    alwaysUpdate = true;
                }
            }
        }

        if (component.compositeReplacementActiveRange) {
            stateValuesForRenderer._compositeReplacementActiveRange =
                component.compositeReplacementActiveRange;
        }

        if (alwaysUpdate) {
            stateValuesForRendererAlwaysUpdate = stateValuesForRenderer;
        }

        let componentIdx = component.componentIdx;

        let childrenToRender = [];
        if (component.constructor.renderChildren) {
            let indicesToRender =
                await this.returnActiveChildrenIndicesToRender(component);
            for (let [ind, child] of component.activeChildren.entries()) {
                if (indicesToRender.includes(ind)) {
                    if (child.rendererType) {
                        let results =
                            await this.initializeRenderedComponentInstruction(
                                child,
                                componentsWithChangedChildrenToRenderInProgress,
                            );
                        childrenToRender.push(results.componentToRender);
                        rendererStatesToUpdate.push(
                            ...results.rendererStatesToUpdate,
                        );
                        rendererStatesToForceUpdate.push(
                            ...results.rendererStatesToForceUpdate,
                        );
                    } else if (typeof child === "string") {
                        childrenToRender.push(child);
                    } else if (typeof child === "number") {
                        childrenToRender.push(child.toString());
                    } else {
                        childrenToRender.push(null);
                    }
                } else {
                    childrenToRender.push(null);
                }
            }
        }

        rendererStatesToUpdate.push({
            componentIdx,
            stateValues: stateValuesForRenderer,
            childrenInstructions: childrenToRender,
        });
        if (Object.keys(stateValuesForRendererAlwaysUpdate).length > 0) {
            rendererStatesToForceUpdate.push({
                componentIdx,
                stateValues: stateValuesForRendererAlwaysUpdate,
            });
        }

        // this.renderState is used to save the renderer state to the database
        this.rendererState[componentIdx] = {
            stateValues: stateValuesForRenderer,
            childrenInstructions: childrenToRender,
        };

        componentsWithChangedChildrenToRenderInProgress.delete(componentIdx);

        let requestActions = {};
        for (let actionName in component.actions) {
            requestActions[actionName] = {
                actionName,
                componentIdx: component.componentIdx,
            };
        }

        for (let actionName in component.externalActions) {
            let action = await component.externalActions[actionName];
            if (action) {
                requestActions[actionName] = {
                    actionName,
                    componentIdx: action.componentIdx,
                };
            }
        }

        let rendererInstructions = {
            componentIdx: componentIdx,
            effectiveIdx: component.componentOrAdaptedIdx,
            id: this.getRendererId(component),
            componentType: component.componentType,
            rendererType: component.rendererType,
            actions: requestActions,
        };

        this.componentsToRender[componentIdx] = {
            children: childrenToRender,
        };

        return {
            componentToRender: rendererInstructions,
            rendererStatesToUpdate,
            rendererStatesToForceUpdate,
        };
    }

    /**
     * Get the `rendererId` of `component`,
     * where `rendererId` is the `rootName` of the component, if it exists,
     * else the `componentIdx` as a string.
     *
     * The `rootName` is the simplest unique reference to the component
     * when the document root is the origin. As `rootName` is designed to be
     * a HTML id, indices are represented with `:`. For example,
     * if `$a.b[2][3].c` is the simplest reference to a component from the root,
     * then its root name will be `a.b:2:3.c`.
     *
     * If a component was adapted from another component,
     * then the `renderedId` of the original component is used instead,
     * as that corresponds to the component that was authored.
     */
    getRendererId(component) {
        return (
            this.rootNames?.[component.componentOrAdaptedIdx] ??
            component.componentOrAdaptedIdx.toString()
        );
    }

    deleteFromComponentsToRender({
        componentIdx,
        recurseToChildren = true,
        componentsWithChangedChildrenToRenderInProgress,
    }) {
        let deletedComponentNames = [componentIdx];
        if (recurseToChildren) {
            let componentInstruction = this.componentsToRender[componentIdx];
            if (componentInstruction) {
                for (let child of componentInstruction.children) {
                    if (child) {
                        let additionalDeleted =
                            this.deleteFromComponentsToRender({
                                componentIdx: child.componentIdx,
                                recurseToChildren,
                                componentsWithChangedChildrenToRenderInProgress,
                            });
                        deletedComponentNames.push(...additionalDeleted);
                    }
                }
            }
        }
        delete this.componentsToRender[componentIdx];
        componentsWithChangedChildrenToRenderInProgress.delete(componentIdx);

        return deletedComponentNames;
    }

    async processStateVariableTriggers(updateRenderersIfTriggered = false) {
        // TODO: can we make this more efficient by only checking components that changed?
        // componentsToUpdateRenderers is close, but it includes only rendered components
        // and we could have components with triggers that are not rendered

        let triggeredAction = false;

        for (const componentIdxStr in this.stateVariableChangeTriggers) {
            const componentIdx = Number(componentIdxStr);
            let component = this._components[componentIdx];
            for (let stateVariable in this.stateVariableChangeTriggers[
                componentIdx
            ]) {
                let triggerInstructions =
                    this.stateVariableChangeTriggers[componentIdx][
                        stateVariable
                    ];

                let value = await component.state[stateVariable].value;

                if (value !== triggerInstructions.previousValue) {
                    let previousValue = triggerInstructions.previousValue;
                    triggerInstructions.previousValue = value;
                    let action = component.actions[triggerInstructions.action];
                    if (action) {
                        await this.performAction({
                            componentIdx,
                            actionName: triggerInstructions.action,
                            args: {
                                stateValues: { [stateVariable]: value },
                                previousValues: {
                                    [stateVariable]: previousValue,
                                },
                                skipRendererUpdate: true,
                            },
                        });
                        triggeredAction = true;
                    }
                }
            }
        }

        if (triggeredAction && updateRenderersIfTriggered) {
            await this.updateAllChangedRenderers();
        }
    }

    async expandAllComposites(component, force = false) {
        // console.log(`*****expand all composites force=${force} *****`);

        let parentsWithCompositesNotReady =
            await this.expandCompositesOfDescendants(component, force);

        let expandedAnother = true;

        while (expandedAnother) {
            expandedAnother = false;

            for (let parentIdx of parentsWithCompositesNotReady) {
                let parent = this._components[parentIdx];
                let foundReady = false;
                for (let compositeIdx of parent.unexpandedCompositesNotReady) {
                    let composite = this._components[compositeIdx];
                    if (composite.state.readyToExpandWhenResolved.isResolved) {
                        foundReady = true;
                        break;
                    } else {
                        let resolveResult = await this.dependencies.resolveItem(
                            {
                                componentIdx: composite.componentIdx,
                                type: "stateVariable",
                                stateVariable: "readyToExpandWhenResolved",
                                force,
                                recurseUpstream: true,
                            },
                        );

                        if (resolveResult.success) {
                            foundReady = true;
                            break;
                        }
                    }
                }

                if (foundReady) {
                    let parent = this._components[parentIdx];
                    await this.deriveChildResultsFromDefiningChildren({
                        parent,
                        expandComposites: true,
                        forceExpandComposites: force,
                    });
                    expandedAnother = true;
                }
            }
        }

        // console.log(`*********finished expanding all composites*****`)
    }

    async expandCompositesOfDescendants(
        component,
        forceExpandComposites = false,
    ) {
        // console.log(`expand composites of descendants of ${component.componentIdx}, forceExpandComposites = ${forceExpandComposites}`)

        // attempt to expand the composites of all descendants
        // include attributes with children

        let parentsWithCompositesNotReady = [];

        if (!component.matchedCompositeChildren) {
            await this.deriveChildResultsFromDefiningChildren({
                parent: component,
                expandComposites: true,
                forceExpandComposites,
            });
            if (component.unexpandedCompositesNotReady.length > 0) {
                parentsWithCompositesNotReady.push(component.componentIdx);
            } else {
                // console.log(`resolving blockers from changed active children of ${component.componentIdx}`)
                await this.dependencies.resolveBlockersFromChangedActiveChildren(
                    component,
                    forceExpandComposites,
                );
                // console.log(`done resolving blockers from changed active children of ${component.componentIdx}`)
            }
        }

        for (let attrName in component.attributes) {
            let attrComp = component.attributes[attrName].component;
            if (attrComp) {
                let additionalParentsWithNotReady =
                    await this.expandCompositesOfDescendants(
                        attrComp,
                        forceExpandComposites,
                    );
                parentsWithCompositesNotReady.push(
                    ...additionalParentsWithNotReady,
                );
            }
        }

        for (let childIdxStr in component.allChildren) {
            let child = component.allChildren[childIdxStr].component;
            if (typeof child !== "object") {
                continue;
            }

            let additionalParentsWithNotReady =
                await this.expandCompositesOfDescendants(
                    child,
                    forceExpandComposites,
                );
            parentsWithCompositesNotReady.push(
                ...additionalParentsWithNotReady,
            );
        }
        // console.log(`done expanding composites of descendants of ${component.componentIdx}`)

        return parentsWithCompositesNotReady;
    }

    async componentAndRenderedDescendants(component) {
        if (component?.componentIdx == undefined) {
            return [];
        }

        let componentIndices = [component.componentIdx];
        if (component.constructor.renderChildren) {
            if (!component.matchedCompositeChildren) {
                await this.deriveChildResultsFromDefiningChildren({
                    parent: component,
                    expandComposites: true, //forceExpandComposites: true,
                });
            }
            for (let child of component.activeChildren) {
                componentIndices.push(
                    ...(await this.componentAndRenderedDescendants(child)),
                );
            }
        }
        return componentIndices;
    }

    async createIsolatedComponents({
        serializedComponents,
        ancestors,
        shadow = false,
        componentsReplacementOf,
    }) {
        const newComponents = [];

        let lastErrorMessage = "";

        const res = extractCreateComponentIdxMapping(serializedComponents);
        Object.assign(
            this.createComponentIdxMapping,
            res.createComponentIdxMapping,
        );

        for (let serializedComponent of serializedComponents) {
            // console.timeLog('core','<-Top serializedComponents ',serializedComponent.componentIdx);

            if (typeof serializedComponent !== "object") {
                newComponents.push(serializedComponent);
                continue;
            }

            let componentClass =
                this.componentInfoObjects.allComponentClasses[
                    serializedComponent.componentType
                ];
            if (componentClass === undefined) {
                // Note: This error shouldn't get reached from author-typed code,
                // as it should get caught by the correctComponentTypeCapitalization function.
                // However, it could get called from Javascript if developers
                // create a serialized component that doesn't exist.
                const message = `Invalid component type: <${serializedComponent.componentType}>.`;

                this.newErrorWarning = true;

                const convertResult = convertToErrorComponent(
                    serializedComponent,
                    message,
                );
                serializedComponent = convertResult.component;

                lastErrorMessage = message;

                componentClass =
                    this.componentInfoObjects.allComponentClasses[
                        serializedComponent.componentType
                    ];
            }

            if (!serializedComponent.doenetAttributes) {
                serializedComponent.doenetAttributes = {};
            }

            let componentIdx = serializedComponent.componentIdx;
            if (componentIdx == undefined) {
                throw Error(
                    "Found a serialized component without a componentIdx",
                    serializedComponent,
                );
            }

            const createResult = await this.createChildrenThenComponent({
                serializedComponent,
                componentIdx,
                ancestors,
                componentClass,
                shadow,
                componentsReplacementOf,
            });

            const newComponent = createResult.newComponent;
            newComponents.push(newComponent);

            if (createResult.lastErrorMessage) {
                lastErrorMessage = createResult.lastErrorMessage;
            }

            // console.timeLog('core','<-Bottom serializedComponents ',serializedComponent.componentIdx);
        }

        let results = {
            components: newComponents,
            lastErrorMessage,
        };

        return results;
    }

    async createChildrenThenComponent({
        serializedComponent,
        componentIdx,
        ancestors,
        componentClass,
        shadow = false,
        componentsReplacementOf,
    }) {
        let lastErrorMessage = "";
        let lastErrorMessageFromAttribute = "";

        if (!(Number.isInteger(componentIdx) && componentIdx >= 0)) {
            throw Error(`Found an invalid componentIdx: ${componentIdx}`);
        }

        if (this._components[componentIdx] !== undefined) {
            console.log(this._components[componentIdx], serializedComponent);
            throw Error(`Found a duplicate componentIdx: ${componentIdx}`);
        }

        // first recursively create children and attribute components
        const serializedChildren = serializedComponent.children;
        let definingChildren = [];
        const childrenToRemainSerialized = [];

        const ancestorsForChildren = [
            { componentIdx, componentClass },
            ...ancestors,
        ];

        // add a new level to parameter stack;
        const parentSharedParameters = this.parameterStack.parameters;
        this.parameterStack.push();
        const sharedParameters = this.parameterStack.parameters;

        if (
            componentClass.descendantCompositesMustHaveAReplacement &&
            !shadow
        ) {
            sharedParameters.compositesMustHaveAReplacement = true;
            sharedParameters.compositesDefaultReplacementType =
                componentClass.descendantCompositesDefaultReplacementType;
        } else if (
            componentClass.descendantCompositesMustHaveAReplacement === false ||
            shadow
        ) {
            sharedParameters.compositesMustHaveAReplacement = false;
        }

        if (serializedChildren !== undefined) {
            if (componentClass.preprocessSerializedChildren) {
                componentClass.preprocessSerializedChildren({
                    serializedChildren,
                    attributes: serializedComponent.attributes,
                    componentIdx,
                });
            }

            if (componentClass.setUpVariant) {
                const descendantVariantComponents = gatherVariantComponents({
                    serializedComponents: serializedChildren,
                    componentInfoObjects: this.componentInfoObjects,
                });

                componentClass.setUpVariant({
                    serializedComponent,
                    sharedParameters,
                    descendantVariantComponents,
                });
            }

            if (componentClass.keepChildrenSerialized) {
                const childrenAddressed = new Set([]);

                const keepSerializedInds =
                    componentClass.keepChildrenSerialized({
                        serializedComponent,
                        componentInfoObjects: this.componentInfoObjects,
                    });

                for (const ind of keepSerializedInds) {
                    if (childrenAddressed.has(Number(ind))) {
                        throw Error(
                            "Invalid instructions to keep children serialized from " +
                                componentClass.componentType +
                                ": child repeated",
                        );
                    }
                    childrenAddressed.add(Number(ind));
                    childrenToRemainSerialized.push(serializedChildren[ind]);
                }

                // create any remaining children
                const childrenToCreate = [];
                for (const [ind, child] of serializedChildren.entries()) {
                    if (!childrenAddressed.has(ind)) {
                        childrenToCreate.push(child);
                    }
                }

                if (childrenToCreate.length > 0) {
                    const childrenResult = await this.createIsolatedComponents({
                        serializedComponents: childrenToCreate,
                        ancestors: ancestorsForChildren,
                        shadow,
                        componentsReplacementOf,
                    });

                    definingChildren = childrenResult.components;
                    if (childrenResult.lastErrorMessage) {
                        lastErrorMessage = childrenResult.lastErrorMessage;
                    }
                }
            } else {
                //create all children

                const childrenResult = await this.createIsolatedComponents({
                    serializedComponents: serializedChildren,
                    ancestors: ancestorsForChildren,
                    shadow,
                    componentsReplacementOf,
                });

                definingChildren = childrenResult.components;
                if (childrenResult.lastErrorMessage) {
                    lastErrorMessage = childrenResult.lastErrorMessage;
                }
            }
        }

        let attributes = {};

        if (serializedComponent.attributes) {
            for (const attrName in serializedComponent.attributes) {
                const attribute = serializedComponent.attributes[attrName];

                if (attribute.component) {
                    if (attrName === componentClass.addAttributeToResolver) {
                        this.addComponentsToResolver(
                            [attribute.component],
                            serializedComponent.componentIdx,
                        );
                    }

                    try {
                        const attrResult = await this.createIsolatedComponents({
                            serializedComponents: [attribute.component],
                            ancestors: ancestorsForChildren,
                            shadow,
                            componentsReplacementOf,
                        });

                        if (attrResult.lastErrorMessage) {
                            lastErrorMessage = attrResult.lastErrorMessage;
                            lastErrorMessageFromAttribute =
                                attrResult.lastErrorMessage;
                        }

                        attributes[attrName] = {
                            component: attrResult.components[0],
                        };
                    } catch (e) {
                        console.error(e);
                        if (e.message.includes("Circular dependency")) {
                            throw Error(
                                this.dependencies.getCircularDependencyMessage([
                                    serializedComponent,
                                ]),
                            );
                        } else {
                            throw e;
                        }
                    }
                } else if (attribute.references) {
                    try {
                        const attrResult = await this.createIsolatedComponents({
                            serializedComponents: attribute.references,
                            ancestors: ancestorsForChildren,
                            shadow,
                            componentsReplacementOf,
                        });

                        if (attrResult.lastErrorMessage) {
                            lastErrorMessage = attrResult.lastErrorMessage;
                            lastErrorMessageFromAttribute =
                                attrResult.lastErrorMessage;
                        }

                        attributes[attrName] = {
                            references: attrResult.components,
                            stringChildren: attribute.stringChildren,
                        };
                    } catch (e) {
                        console.error(e);
                        throw e;
                    }
                } else {
                    attributes[attrName] =
                        serializedComponent.attributes[attrName];
                }
            }
        }

        // If `serializedComponent` has a `extending`
        // then create components for all the indices of the original path.
        let refResolution = null;
        if (serializedComponent.extending) {
            refResolution = unwrapSource(serializedComponent.extending);

            const nodeIdx = refResolution.nodeIdx;

            const originalPath = [];
            for (const pathPart of refResolution.originalPath) {
                const index = [];
                for (const indexPiece of pathPart.index) {
                    const valueResult = await this.createIsolatedComponents({
                        serializedComponents: indexPiece.value,
                        ancestors: ancestorsForChildren,
                        shadow,
                        componentsReplacementOf,
                    });
                    if (valueResult.lastErrorMessage) {
                        lastErrorMessage = valueResult.lastErrorMessage;
                    }
                    const value = valueResult.components;
                    index.push({
                        value,
                        position: indexPiece.position,
                        sourceDoc: indexPiece.sourceDoc,
                    });
                }
                originalPath.push({
                    name: pathPart.name,
                    index,
                    position: pathPart.position,
                    sourceDoc: pathPart.sourceDoc,
                });
            }
            refResolution = {
                nodeIdx,
                unresolvedPath: refResolution.unresolvedPath,
                originalPath,
                nodesInResolvedPath: refResolution.nodesInResolvedPath,
            };
        }

        if (serializedComponent.componentType === "_error") {
            lastErrorMessage = serializedComponent.state.message;

            this.addErrorWarning({
                type: "error",
                message: serializedComponent.state.message,
                position: serializedComponent.position,
                sourceDoc: serializedComponent.sourceDoc,
            });
        } else if (
            lastErrorMessageFromAttribute ||
            (lastErrorMessage && !componentClass.canDisplayChildErrors)
        ) {
            // We have to deal with two special cases where errors wouldn't be displayed:
            // 1. there is an error message from an attribute, or
            // 2. this component cannot display errors from children
            // In these cases, we turn this component into an error component
            // to ensure the error message is displayed.

            const convertResult = convertToErrorComponent(
                serializedComponent,
                lastErrorMessageFromAttribute || lastErrorMessage,
            );
            serializedComponent = convertResult.component;

            attributes = {};
            componentClass =
                this.componentInfoObjects.allComponentClasses[
                    serializedComponent.componentType
                ];
        }

        const prescribedDependencies = {};

        if (serializedComponent.downstreamDependencies) {
            for (const idxStr in serializedComponent.downstreamDependencies) {
                const idx = Number(idxStr);
                if (idx === componentIdx) {
                    throw Error(
                        this.dependencies.getCircularDependencyMessage([
                            serializedComponent,
                        ]),
                    );
                }
                if (this.components[idx]) {
                    prescribedDependencies[idx] =
                        serializedComponent.downstreamDependencies[idx];
                } else {
                    throw Error(
                        this.dependencies.getCircularDependencyMessage([
                            serializedComponent,
                        ]),
                    );
                }
            }
        }

        const stateVariableDefinitions =
            await this.createStateVariableDefinitions({
                componentClass,
                prescribedDependencies,
                componentIdx,
            });

        // in case component with same name was deleted before, delete from deleteComponents and deletedStateVariable
        delete this.updateInfo.deletedComponents[componentIdx];
        delete this.updateInfo.deletedStateVariables[componentIdx];

        // create component itself
        const newComponent = new componentClass({
            componentIdx,
            rootName: this.rootNames?.[componentIdx] ?? componentIdx.toString(),
            ancestors,
            definingChildren,
            stateVariableDefinitions,
            serializedChildren: childrenToRemainSerialized,
            serializedComponent,
            attributes,
            componentInfoObjects: this.componentInfoObjects,
            coreFunctions: this.coreFunctions,
            flags: this.flags,
            shadow,
            numerics: this.numerics,
            sharedParameters,
            parentSharedParameters,
            refResolution,
        });

        this.registerComponent(newComponent);

        if (componentsReplacementOf) {
            newComponent.replacementOf = componentsReplacementOf;
        }

        if (serializedComponent.adaptedFrom) {
            // record adapter relationship
            newComponent.adaptedFrom =
                this._components[serializedComponent.adaptedFrom];
            newComponent.adaptedFrom.adapterUsed = newComponent;
        }

        for (const idxStr in prescribedDependencies) {
            const idx = Number(idxStr);
            const depArray = prescribedDependencies[idx];
            for (const dep of depArray) {
                if (dep.dependencyType === "referenceShadow") {
                    const shadowInfo = {
                        componentIdx: idx,
                    };
                    Object.assign(shadowInfo, dep);
                    delete shadowInfo.dependencyType;
                    // newComponent.shadows = new Proxy(shadowInfo, readOnlyProxyHandler);
                    newComponent.shadows = shadowInfo;

                    if (dep.firstLevelReplacement) {
                        newComponent.firstLevelReplacement = true;
                    }

                    const shadowedComponent = this._components[idx];
                    if (!shadowedComponent.shadowedBy) {
                        shadowedComponent.shadowedBy = [];
                    }
                    shadowedComponent.shadowedBy.push(newComponent);

                    const mediatingShadowComposite =
                        this._components[shadowInfo.compositeIdx];
                    if (!mediatingShadowComposite.mediatesShadows) {
                        mediatingShadowComposite.mediatesShadows = [];
                    }
                    mediatingShadowComposite.mediatesShadows.push({
                        shadowing: newComponent.componentIdx,
                        shadowed: idx,
                        propVariable: dep.propVariable,
                    });

                    if (dep.isPrimaryShadow) {
                        shadowedComponent.primaryShadow =
                            newComponent.componentIdx;

                        if (
                            this.dependencies.updateTriggers
                                .primaryShadowDependencies[idx]
                        ) {
                            for (const dep of this.dependencies.updateTriggers
                                .primaryShadowDependencies[idx]) {
                                await dep.recalculateDownstreamComponents();
                            }
                        }
                    }

                    break;
                }
            }
        }

        if (serializedComponent.unlinkedCopySource) {
            newComponent.unlinkedCopySource =
                serializedComponent.unlinkedCopySource;
        }

        await this.deriveChildResultsFromDefiningChildren({
            parent: newComponent,
            expandComposites: false,
        });

        await this.initializeComponentStateVariables(newComponent);

        await this.dependencies.setUpComponentDependencies(newComponent);

        const variablesChanged =
            await this.dependencies.checkForDependenciesOnNewComponent(
                componentIdx,
            );

        for (const varDescription of variablesChanged) {
            await this.markStateVariableAndUpstreamDependentsStale({
                component: this._components[varDescription.componentIdx],
                varName: varDescription.varName,
            });
        }

        await this.checkForStateVariablesUpdatesForNewComponent(componentIdx);

        await this.dependencies.resolveStateVariablesIfReady({
            component: newComponent,
        });

        this.recordStateVariablesMustEvaluate(componentIdx);

        await this.checkForActionChaining({ component: newComponent });

        // this.dependencies.collateCountersAndPropagateToAncestors(newComponent);

        // remove a level from parameter stack;
        this.parameterStack.pop();

        const results = { newComponent: newComponent, lastErrorMessage };

        return results;
    }

    async checkForStateVariablesUpdatesForNewComponent(componentIdx) {
        if (
            componentIdx in
            this.updateInfo.stateVariableUpdatesForMissingComponents
        ) {
            let result = await this.processNewStateVariableValues({
                [componentIdx]:
                    this.updateInfo.stateVariableUpdatesForMissingComponents[
                        componentIdx
                    ],
            });

            // In order to make sure that a component takes on the same value
            // that was saved to the database,
            // it may be necessary for a component to treat the value received differently
            // in the first pass of the definition.
            // hence we set justUpdatedForNewComponent which will
            // Hence, we run the definition of all variables with the extra flag
            // justUpdatedForNewComponent = true
            let comp = this._components[componentIdx];
            if (
                comp.constructor.processWhenJustUpdatedForNewComponent ||
                result.foundIgnore
            ) {
                for (let vName in this.updateInfo
                    .stateVariableUpdatesForMissingComponents[componentIdx]) {
                    if (comp.state[vName]) {
                        this.updateInfo.stateVariablesToEvaluate.push({
                            componentIdx,
                            stateVariable: vName,
                        });
                        comp.state[vName].justUpdatedForNewComponent = true;
                        if (result.foundIgnore) {
                            // This is a kludge
                            // The only case so far with ignored children is that Math ignores strings
                            // (set in inverse definition of expressionWithCodes).
                            // We need change its value a second time after evaluating
                            // so that the next time the definition of expressionWithCodes is run,
                            // the strings don't show any changes and we'll use the essential value
                            // of expressionWithCodes
                            comp.reprocessAfterEvaluate =
                                this.updateInfo.stateVariableUpdatesForMissingComponents[
                                    componentIdx
                                ];
                        }
                    }
                }
            }

            delete this.updateInfo.stateVariableUpdatesForMissingComponents[
                componentIdx
            ];
        }
    }

    recordStateVariablesMustEvaluate(componentIdx) {
        let comp = this._components[componentIdx];

        for (let vName in comp.state) {
            if (comp.state[vName].mustEvaluate) {
                this.updateInfo.stateVariablesToEvaluate.push({
                    componentIdx,
                    stateVariable: vName,
                });
            }
        }
    }

    async deriveChildResultsFromDefiningChildren({
        parent,
        expandComposites = true,
        forceExpandComposites = false,
    }) {
        // console.log(`derive child results for ${parent.componentIdx}, ${expandComposites}, ${forceExpandComposites}`)

        if (!this.derivingChildResults) {
            this.derivingChildResults = [];
        }
        if (this.derivingChildResults.includes(parent.componentIdx)) {
            // console.log(`not deriving child results of ${parent.componentIdx} while in the middle of deriving them already`)
            return { success: false, skipping: true };
        }
        this.derivingChildResults.push(parent.componentIdx);

        // create allChildren and activeChildren from defining children
        // apply child logic and substitute adapters to modify activeChildren

        // if (parent.activeChildren) {
        //   // if there are any deferred child state variables
        //   // evaluate them before changing the active children
        //   this.evaluatedDeferredChildStateVariables(parent);
        // }

        // attempt to expand composites before modifying active children
        let result = await this.expandCompositeOfDefiningChildren(
            parent,
            parent.definingChildren,
            expandComposites,
            forceExpandComposites,
        );
        parent.unexpandedCompositesReady = result.unexpandedCompositesReady;
        parent.unexpandedCompositesNotReady =
            result.unexpandedCompositesNotReady;

        let previousActiveChildren;

        if (parent.activeChildren) {
            previousActiveChildren = parent.activeChildren.map((child) =>
                child.componentIdx ? child.componentIdx : child,
            );
        }

        parent.activeChildren = parent.definingChildren.slice(); // shallow copy

        // allChildren include activeChildren, definingChildren,
        // and possibly some children that are neither
        // (which could occur when a composite is expanded and the result is adapted)
        // ignores string and number primitive children
        parent.allChildren = {};

        // allChildrenOrdered contains same children as allChildren,
        // but retaining an order that we can use for counters.
        // If defining children are replaced my composite replacements or adapters,
        // those children will come immediately after the corresponding defining child
        parent.allChildrenOrdered = [];

        for (let ind = 0; ind < parent.activeChildren.length; ind++) {
            let child = parent.activeChildren[ind];
            let childIdx;
            if (typeof child !== "object") {
                continue;
            }

            childIdx = child.componentIdx;

            parent.allChildren[childIdx] = {
                activeChildrenIndex: ind,
                definingChildrenIndex: ind,
                component: child,
            };

            parent.allChildrenOrdered.push(childIdx);
        }

        // if any of activeChildren are expanded compositeComponents
        // replace with new components given by the composite component
        await this.replaceCompositeChildren(parent);

        let childGroupResults = await this.matchChildrenToChildGroups(parent);

        if (childGroupResults.success) {
            delete this.unmatchedChildren[parent.componentIdx];
            parent.childrenMatchedWithPlaceholders = true;
            parent.matchedCompositeChildrenWithPlaceholders = true;
        } else {
            parent.childrenMatchedWithPlaceholders = false;
            parent.matchedCompositeChildrenWithPlaceholders = true;

            let unmatchedChildrenTypes = [];
            for (let child of childGroupResults.unmatchedChildren) {
                if (typeof child === "string") {
                    unmatchedChildrenTypes.push("string");
                } else {
                    unmatchedChildrenTypes.push(
                        "<" + child.componentType + ">",
                    );
                    if (
                        this.componentInfoObjects.isInheritedComponentType({
                            inheritedComponentType: child.componentType,
                            baseComponentType: "_composite",
                        })
                    ) {
                        parent.matchedCompositeChildrenWithPlaceholders = false;
                    }
                }
            }

            if (parent.doenetAttributes.isAttributeChildFor) {
                let attributeForComponentType =
                    parent.ancestors[0].componentClass.componentType;
                this.unmatchedChildren[parent.componentIdx] = {
                    message: `Invalid format for attribute ${parent.doenetAttributes.isAttributeChildFor} of <${attributeForComponentType}>.`,
                };
            } else {
                this.unmatchedChildren[parent.componentIdx] = {
                    message: `Invalid children for <${
                        parent.componentType
                    }>: Found invalid children: ${unmatchedChildrenTypes.join(
                        ", ",
                    )}`,
                };
            }
        }

        await this.dependencies.addBlockersFromChangedActiveChildren({
            parent,
        });

        let ind = this.derivingChildResults.indexOf(parent.componentIdx);

        this.derivingChildResults.splice(ind, 1);

        if (parent.constructor.renderChildren) {
            let childrenUnchanged =
                previousActiveChildren &&
                previousActiveChildren.length == parent.activeChildren.length &&
                parent.activeChildren.every((child, ind) =>
                    child.componentIdx
                        ? child.componentIdx === previousActiveChildren[ind]
                        : child === previousActiveChildren[ind],
                );
            if (!childrenUnchanged) {
                this.componentsWithChangedChildrenToRender.add(
                    parent.componentIdx,
                );
            }
        }

        return childGroupResults;
    }

    async expandCompositeOfDefiningChildren(
        parent,
        children,
        expandComposites,
        forceExpandComposites,
    ) {
        // if composite is not directly matched by any childGroup
        // then replace the composite with its replacements,
        // expanding it if not already expanded

        // console.log(`expanding defining children of of ${parent.componentIdx}`)

        let unexpandedCompositesReady = [];
        let unexpandedCompositesNotReady = [];

        for (let childInd = 0; childInd < children.length; childInd++) {
            let child = children[childInd];

            if (
                child instanceof
                this.componentInfoObjects.allComponentClasses._composite
            ) {
                // if composite itself is in the child logic
                // then don't replace it with its replacements
                // but leave the composite as an activeChild
                if (
                    this.findChildGroup(child.componentType, parent.constructor)
                        .success
                ) {
                    continue;
                }

                // expand composite if it isn't already
                if (!child.isExpanded) {
                    // console.log(`child ${child.componentIdx} is not expanded`)
                    // console.log(child.state.readyToExpandWhenResolved.isResolved)

                    if (!child.state.readyToExpandWhenResolved.isResolved) {
                        if (expandComposites) {
                            let resolveResult =
                                await this.dependencies.resolveItem({
                                    componentIdx: child.componentIdx,
                                    type: "stateVariable",
                                    stateVariable: "readyToExpandWhenResolved",
                                    expandComposites, //: forceExpandComposites,
                                    force: forceExpandComposites,
                                });

                            if (!resolveResult.success) {
                                unexpandedCompositesNotReady.push(
                                    child.componentIdx,
                                );
                                this.updateInfo.compositesToExpand.add(
                                    child.componentIdx,
                                );
                                continue;
                            }
                        } else {
                            unexpandedCompositesNotReady.push(
                                child.componentIdx,
                            );
                            this.updateInfo.compositesToExpand.add(
                                child.componentIdx,
                            );
                            continue;
                        }
                    } else if (!expandComposites) {
                        unexpandedCompositesReady.push(child.componentIdx);
                        this.updateInfo.compositesToExpand.add(
                            child.componentIdx,
                        );
                        continue;
                    }

                    // will either succeed or throw error since is ready to expand
                    await this.expandCompositeComponent(child);
                }

                // recurse on replacements
                let result = await this.expandCompositeOfDefiningChildren(
                    parent,
                    child.replacements,
                    expandComposites,
                    forceExpandComposites,
                );

                unexpandedCompositesReady.push(
                    ...result.unexpandedCompositesReady,
                );
                unexpandedCompositesNotReady.push(
                    ...result.unexpandedCompositesNotReady,
                );
            }
        }

        // console.log(`done expanding defining children of of ${parent.componentIdx}`)

        return { unexpandedCompositesReady, unexpandedCompositesNotReady };
    }

    async matchChildrenToChildGroups(parent) {
        parent.childMatchesByGroup = {};

        for (let groupName in parent.constructor.childGroupIndsByName) {
            parent.childMatchesByGroup[groupName] = [];
        }

        let success = true;

        let unmatchedChildren = [];

        for (let [ind, child] of parent.activeChildren.entries()) {
            let childType =
                typeof child !== "object" ? typeof child : child.componentType;

            if (childType === undefined) {
                success = false;
                unmatchedChildren.push(child);
                continue;
            }

            let result = this.findChildGroup(childType, parent.constructor);

            if (result.success) {
                parent.childMatchesByGroup[result.group].push(ind);

                if (result.adapterIndUsed !== undefined) {
                    await this.substituteAdapter({
                        parent,
                        childInd: ind,
                        adapterIndUsed: result.adapterIndUsed,
                    });
                }
            } else {
                success = false;
                unmatchedChildren.push(child);
            }
        }

        return { success, unmatchedChildren };
    }

    findChildGroup(childType, parentClass) {
        let result = this.findChildGroupNoAdapters(childType, parentClass);

        if (result.success) {
            return result;
        } else if (childType === "string") {
            return { success: false };
        }

        // check if can match with adapters
        let childClass =
            this.componentInfoObjects.allComponentClasses[childType];

        // if didn't match child, attempt to match with child's adapters
        let numAdapters = childClass.numAdapters;

        for (let n = 0; n < numAdapters; n++) {
            let adapterComponentType = childClass.getAdapterComponentType(
                n,
                this.componentInfoObjects.publicStateVariableInfo,
            );

            result = this.findChildGroupNoAdapters(
                adapterComponentType,
                parentClass,
            );

            if (result.success) {
                result.adapterIndUsed = n;
                return result;
            }
        }

        // lastly try to match with afterAdapters set to true
        return this.findChildGroupNoAdapters(childType, parentClass, true);
    }

    findChildGroupNoAdapters(
        componentType,
        parentClass,
        afterAdapters = false,
    ) {
        if (parentClass.childGroupOfComponentType[componentType]) {
            return {
                success: true,
                group: parentClass.childGroupOfComponentType[componentType],
            };
        }

        for (let group of parentClass.childGroups) {
            for (let typeFromGroup of group.componentTypes) {
                if (
                    this.componentInfoObjects.isInheritedComponentType({
                        inheritedComponentType: componentType,
                        baseComponentType: typeFromGroup,
                    })
                ) {
                    if (group.matchAfterAdapters && !afterAdapters) {
                        continue;
                    }
                    // don't match composites to the base component
                    // so that they will expand
                    if (
                        !(
                            typeFromGroup === "_base" &&
                            this.componentInfoObjects.isInheritedComponentType({
                                inheritedComponentType: componentType,
                                baseComponentType: "_composite",
                            })
                        )
                    ) {
                        parentClass.childGroupOfComponentType[componentType] =
                            group.group;

                        return {
                            success: true,
                            group: group.group,
                        };
                    }
                }
            }
        }

        return { success: false };
    }

    async returnActiveChildrenIndicesToRender(component) {
        let indicesToRender = [];
        let numChildrenToRender = Infinity;
        if ("numChildrenToRender" in component.state) {
            numChildrenToRender =
                await component.stateValues.numChildrenToRender;
        }
        let childIndicesToRender = null;
        if ("childIndicesToRender" in component.state) {
            childIndicesToRender =
                await component.stateValues.childIndicesToRender;
        }

        for (let [ind, child] of component.activeChildren.entries()) {
            if (ind >= numChildrenToRender) {
                break;
            }

            if (childIndicesToRender && !childIndicesToRender.includes(ind)) {
                continue;
            }

            if (typeof child === "object") {
                if (
                    child.constructor.sendToRendererEvenIfHidden ||
                    !(await child.stateValues.hidden)
                ) {
                    indicesToRender.push(ind);
                }
            } else {
                // if have a primitive,
                // will be hidden if a composite source is hidden
                let hidden = false;
                if (component.compositeReplacementActiveRange) {
                    for (let compositeInfo of component.compositeReplacementActiveRange) {
                        let composite =
                            this._components[compositeInfo.compositeIdx];
                        if (await composite.stateValues.hidden) {
                            if (
                                compositeInfo.firstInd <= ind &&
                                compositeInfo.lastInd >= ind
                            ) {
                                hidden = true;
                                break;
                            }
                        }
                    }
                }
                if (!hidden) {
                    indicesToRender.push(ind);
                }
            }
        }

        return indicesToRender;
    }

    async substituteAdapter({ parent, childInd, adapterIndUsed }) {
        // replace activeChildren with their adapters

        let originalChild = parent.activeChildren[childInd];

        let newSerializedChild;
        if (originalChild.componentIdx != undefined) {
            newSerializedChild = originalChild.getAdapter(adapterIndUsed);
            newSerializedChild.componentIdx = this._components.length;
            this._components[this._components.length] = undefined;
        } else {
            // XXX: how does this work with the new componentIdx approach?

            // child isn't a component, just an object with a componentType
            // Create an object that is just the componentType of the adapter
            newSerializedChild = {
                componentType: this.componentInfoObjects.allComponentClasses[
                    originalChild.componentType
                ].getAdapterComponentType(
                    adapterIndUsed,
                    this.componentInfoObjects.publicStateVariableInfo,
                ),
                placeholderInd: originalChild.placeholderInd + "adapt",
            };
        }

        let adapter = originalChild.adapterUsed;

        if (
            adapter === undefined ||
            adapter.componentType !== newSerializedChild.componentType
        ) {
            if (originalChild.componentIdx != undefined) {
                newSerializedChild.adaptedFrom = originalChild.componentIdx;
                assignDoenetMLRange(
                    [newSerializedChild],
                    originalChild.position,
                    originalChild.sourceDoc,
                );
                let newChildrenResult = await this.createIsolatedComponents({
                    serializedComponents: [newSerializedChild],
                    shadow: true,
                    ancestors: originalChild.ancestors,
                });

                adapter = newChildrenResult.components[0];
            } else {
                // XXX: how does this work with the new componentIdx approach?

                // didn't have a component for the original child, just a componentType
                // Adapter will also just be the componentType returned from childmatches
                newSerializedChild.adaptedFrom = originalChild;
                adapter = newSerializedChild;
            }
        }

        // Replace originalChild with its adapter in activeChildren
        parent.activeChildren.splice(childInd, 1, adapter);

        // TODO: if originalChild is a placeholder, we lose track of it
        // (other than through adaptedFrom of adapted)
        // once we splice it out of activeChildren.  Is that a problem?

        // Update allChildren to show that originalChild is no longer active
        // and that adapter is now an active child
        if (originalChild.componentIdx != undefined) {
            // ignore placeholder active children
            delete parent.allChildren[originalChild.componentIdx]
                .activeChildrenIndex;
            parent.allChildren[adapter.componentIdx] = {
                activeChildrenIndex: childInd,
                component: adapter,
            };
        }

        // find index of originalChild in allChildrenOrdered
        // and place adapter immediately afterward
        if (originalChild.componentIdx != undefined) {
            let originalInd = parent.allChildrenOrdered.indexOf(
                originalChild.componentIdx,
            );
            parent.allChildrenOrdered.splice(
                originalInd + 1,
                0,
                adapter.componentIdx,
            );
        } else {
            // adapter of placeholder
            let originalInd = parent.allChildrenOrdered.indexOf(
                originalChild.placeholderInd,
            );
            parent.allChildrenOrdered.splice(
                originalInd + 1,
                0,
                adapter.placeholderInd,
            );
        }
    }

    async expandCompositeComponent(component) {
        if (!("readyToExpandWhenResolved" in component.state)) {
            throw Error(
                `Could not find state variable readyToExpandWhenResolved of composite ${component.componentIdx}`,
            );
        }

        if (!component.state.readyToExpandWhenResolved.isResolved) {
            this.updateInfo.compositesToExpand.add(component.componentIdx);
            return { success: false };
        }

        this.updateInfo.compositesToExpand.delete(component.componentIdx);

        // console.log(`expanding composite ${component.componentIdx}`);

        this.updateInfo.compositesBeingExpanded.push(component.componentIdx);

        if (component.parent) {
            if (component.parent.unexpandedCompositesReady) {
                let ind = component.parent.unexpandedCompositesReady.indexOf(
                    component.componentIdx,
                );
                if (ind !== -1) {
                    component.parent.unexpandedCompositesReady.splice(ind, 1);
                }
            }
            if (component.parent.unexpandedCompositesNotReady) {
                let ind = component.parent.unexpandedCompositesNotReady.indexOf(
                    component.componentIdx,
                );
                if (ind !== -1) {
                    component.parent.unexpandedCompositesNotReady.splice(
                        ind,
                        1,
                    );
                }
            }
        }

        if (
            component.shadows &&
            !component.shadows.propVariable &&
            !component.constructor.doNotExpandAsShadowed
            //&&
            // this.componentInfoObjects.isCompositeComponent({
            //   componentType: component.componentType,
            //   includeNonStandard: false,
            // })
        ) {
            return await this.expandShadowingComposite(component);
        }

        // Call the static function createSerializedReplacements from the composite component
        // which returns an object containing a key "replacements" with value an array
        // of serialized components that will be turned into real components.
        // The replacement components will be used to replace
        // the composite itself as children for the composite's parent
        // Arguments
        // component: the composite component
        // components: all components in the document
        // workspace: an initially empty object that a composite can use to store information that will then
        //   be provided when updating composite replacements via calculateReplacementChanges
        // componentInfoObjects
        // flags
        // resolveItem: a function that the composite can use to resolve any state variables
        // publicCaseInsensitiveAliasSubstitutions: a function that can be used to find a case insensitive match
        //   to a public state variable, substituting aliases if necessary
        let initialNComponents;
        let result;
        do {
            initialNComponents = this.components.length;
            result = await component.constructor.createSerializedReplacements({
                component: this.components[component.componentIdx], // to create proxy
                components: this.components,
                nComponents: this.components.length,
                workspace: component.replacementsWorkspace,
                componentInfoObjects: this.componentInfoObjects,
                allDoenetMLs: this.allDoenetMLs,
                flags: this.flags,
                resolveItem: this.dependencies.resolveItem.bind(
                    this.dependencies,
                ),
                publicCaseInsensitiveAliasSubstitutions:
                    this.publicCaseInsensitiveAliasSubstitutions.bind(this),
            });

            // If `this.components` changed in length while `createSerializedReplacements` was executing,
            // it means that some other action (like calling another `createSerializedReplacements`)
            // occurred while resolving state variables.
            // Since this would lead to collisions in assigned component indices, we rerun `createSerializedReplacements`.
            // TODO: are there any scenarios where this will lead to an infinite loop?
        } while (this.components.length !== initialNComponents);

        const newNComponents = result.nComponents;

        if (
            !(
                Number.isInteger(newNComponents) &&
                newNComponents >= this._components.length
            )
        ) {
            throw Error(
                `Invalid nComponents returned by createSerializedReplacements for ${component.componentType}: `,
                newNComponents,
            );
        }

        let position = this.components[component.componentIdx].position;
        let sourceDoc = this.components[component.componentIdx].sourceDoc;
        let overwriteDoenetMLRange = component.componentType === "_copy";

        this.gatherErrorsAndAssignDoenetMLRange({
            components: result.replacements,
            errors: result.errors,
            warnings: result.warnings,
            position,
            sourceDoc,
            overwriteDoenetMLRange,
        });

        // console.log(`expand result for ${component.componentIdx}`);
        // console.log(JSON.parse(JSON.stringify(result)));

        if (component.constructor.stateVariableToEvaluateAfterReplacements) {
            // console.log(`evaluating ${component.constructor.stateVariableToEvaluateAfterReplacements} of ${component.componentIdx}`)
            await component.stateValues[
                component.constructor.stateVariableToEvaluateAfterReplacements
            ];
            // console.log(`done evaluating ${component.constructor.stateVariableToEvaluateAfterReplacements} of ${composite.componentIdx}`)
        }

        if (result.replacements) {
            let serializedReplacements = result.replacements;

            await this.addReplacementsToResolver({
                serializedReplacements,
                component,
            });

            // expand `this._components` to length `newNComponents` so that the component indices will not be reused
            if (newNComponents > this._components.length) {
                this._components[newNComponents - 1] = undefined;
            }

            await this.createAndSetReplacements({
                component,
                serializedReplacements,
            });
        } else {
            throw Error(
                `Invalid createSerializedReplacements of ${component.componentIdx}`,
            );
        }

        // record that are finished expanding the composite
        let targetInd = this.updateInfo.compositesBeingExpanded.indexOf(
            component.componentIdx,
        );
        if (targetInd === -1) {
            throw Error(
                `Something is wrong as we lost track that we were expanding ${component.componentIdx}`,
            );
        }
        this.updateInfo.compositesBeingExpanded.splice(targetInd, 1);

        return { success: true, compositesExpanded: [component.componentIdx] };
    }

    async addReplacementsToResolver({
        serializedReplacements,
        component,
        overrideReplacementsAlreadyInResolver,
        updateOldReplacementsStart,
        updateOldReplacementsEnd,
        blankStringReplacements,
    }) {
        if (
            component.constructor.replacementsAlreadyInResolver &&
            !overrideReplacementsAlreadyInResolver
        ) {
            return;
        }

        const { parentIdx, indexResolution } =
            await this.determineParentAndIndexResolutionForResolver({
                component,
                updateOldReplacementsStart,
                updateOldReplacementsEnd,
                blankStringReplacements,
            });

        // If `createComponentIdx` was specified, the one replacement is already in the resolver,
        // so we just add its children and attribute components/references.
        // Otherwise add all replacements.
        const fragmentChildren = [];
        let parentSourceSequence = null;
        if (component.attributes.createComponentIdx != null) {
            if (serializedReplacements[0]?.children) {
                fragmentChildren.push(...serializedReplacements[0].children);
            }
            for (const attrName in serializedReplacements[0]?.attributes) {
                const attribute =
                    serializedReplacements[0].attributes[attrName];
                if (attribute.type === "component") {
                    fragmentChildren.push(attribute.component);
                } else if (attribute.type === "references") {
                    fragmentChildren.push(...attribute.references);
                }
            }

            // if the replacement that is the fragment parent has a source sequence,
            // then add that as the `parentSourceSequence` of the flat fragment
            let sourceSequence =
                serializedReplacements[0]?.attributes["source:sequence"];
            if (sourceSequence) {
                parentSourceSequence = {
                    type: "attribute",
                    name: "source:sequence",
                    parent: component.attributes.createComponentIdx.primitive
                        .number,
                    children: sourceSequence.children.filter(
                        (child) => typeof child === "string",
                    ),
                    sourceDoc: sourceSequence.sourceDoc,
                };
            }
        } else {
            fragmentChildren.push(...serializedReplacements);
        }

        // We add all the parent's descendants to the resolver
        const flatFragment = {
            children: fragmentChildren.map((child) =>
                typeof child === "string"
                    ? child
                    : getEffectiveComponentIdx(child),
            ),
            nodes: [],
            parentIdx,
            parentSourceSequence,
            idxMap: {},
        };

        addNodesToFlatFragment({
            flatFragment,
            serializedComponents: fragmentChildren,
            parentIdx,
        });

        if (
            (flatFragment.nodes.length > 0 || indexResolution !== "None") &&
            this.addNodesToResolver
        ) {
            // console.log("add nodes to resolver", {
            //     flatFragment,
            //     indexResolution,
            // });
            this.addNodesToResolver(flatFragment, indexResolution);

            this.rootNames = this.calculateRootNames?.().names;

            let indexParent =
                indexResolution.ReplaceAll?.parent ??
                indexResolution.ReplaceRange?.parent ??
                null;

            if (
                indexParent !== null &&
                indexParent !== component.componentIdx
            ) {
                const indexParentComposite = this._components[indexParent];

                if (indexParentComposite) {
                    await this.dependencies.addBlockersFromChangedReplacements(
                        indexParentComposite,
                    );
                }
            }
        }
    }

    async determineParentAndIndexResolutionForResolver({
        component,
        updateOldReplacementsStart,
        updateOldReplacementsEnd,
        blankStringReplacements,
    }) {
        // If the composite was created as a child for a list,
        // then the parent for resolving names is that list (the parent of the resolver).
        // If `createComponentIdx` was specified, then that should be the parent for resolving names.
        // Else, the composite should be the parent for resolving names.

        let update_start = updateOldReplacementsStart;
        let update_end = updateOldReplacementsEnd;

        if (
            updateOldReplacementsStart !== undefined &&
            updateOldReplacementsEnd !== undefined
        ) {
            // We are replacing a range of replacement, but these include blank strings.
            // Adjust the range to ignore blank strings
            for (const [
                i,
                isBlankString,
            ] of blankStringReplacements.entries()) {
                if (i >= updateOldReplacementsEnd) {
                    break;
                }
                if (isBlankString) {
                    update_end--;
                    if (i < updateOldReplacementsStart) {
                        update_start--;
                    }
                }
            }
        }

        let parentIdx;

        let indexResolution = "None";

        if (component.doenetAttributes.forList) {
            // Don't add index resolutions in this case,
            // we're just adding to the children of the list, not the replacements of the list
            parentIdx = component.parentIdx;
        } else if (component.attributes.createComponentIdx?.primitive) {
            // If `createComponentIdx` is set, then we have a copy component created from an `extend` attribute.
            // That component is already in the resolver so will be the parent of the fragment added to the browser.
            parentIdx =
                component.attributes.createComponentIdx?.primitive.value;

            // If the component type of that parent, specified by `createComponentOfType`, is a composite,
            // then it could have an index specified, so we add an index resolution
            if (
                component.attributes.createComponentOfType?.primitive &&
                this.componentInfoObjects.isCompositeComponent({
                    componentType:
                        component.attributes.createComponentOfType.primitive
                            .value,
                    includeNonStandard: true,
                })
            ) {
                indexResolution = { ReplaceAll: { parent: parentIdx } };

                if (update_start !== undefined && update_end !== undefined) {
                    const parent = this._components[parentIdx];

                    indexResolution = {
                        ReplaceRange: {
                            parent: parentIdx,
                            range: { start: update_start, end: update_end },
                        },
                    };
                }
            }
        } else if (component.componentType === "_copy") {
            // If we have a copy that wasn't from an extend, then it was from a reference.
            // Although references don't have names that can be
            // Copy components are typically not part of the resolver structure and generally skipped.
            // Since we don't allow direct authoring of copy components,
            // they should occur only from references

            // determine if is a replacement of another type of composite
            let copyComponent = component;
            parentIdx = component.componentIdx;

            while (copyComponent.replacementOf) {
                if (copyComponent.replacementOf.componentType === "_copy") {
                    copyComponent = copyComponent.replacementOf;
                    continue;
                } else {
                    break;
                }
            }

            // now we have a copyComponent that is not a replacement of a copy
            if (copyComponent.replacementOf) {
                const indexParent = copyComponent.replacementOf;

                // determine where the replacement will end up being spliced in

                let start_idx, end_idx;

                async function calcStartEndIdx(replacements) {
                    let nonWithheldReplacements = [];
                    for (const repl of replacements) {
                        if (
                            typeof repl === "string" ||
                            !(await repl.stateValues
                                .isInactiveCompositeReplacement)
                        ) {
                            nonWithheldReplacements.push(repl);
                        }
                    }

                    const nonBlankStringReplacements =
                        nonWithheldReplacements.filter(
                            (x) => typeof x !== "string" || x.trim() !== "",
                        );
                    const replacementsWithoutExpandedCopies = [];

                    let i = 0;

                    for (const repl of nonBlankStringReplacements) {
                        if (repl.componentType == "_copy") {
                            if (!repl.isExpanded) {
                                if (
                                    repl.componentIdx ===
                                    copyComponent.componentIdx
                                ) {
                                    start_idx = i;
                                    end_idx = i + 1;
                                }
                                replacementsWithoutExpandedCopies.push(repl);
                                i++;
                            } else {
                                let replReplacements = repl.replacements;
                                if (repl.replacementsToWithhold) {
                                    replReplacements = replReplacements.slice(
                                        0,
                                        replReplacements.length -
                                            repl.replacementsToWithhold,
                                    );
                                }

                                const newReplacements =
                                    await calcStartEndIdx(replReplacements);
                                const n = newReplacements.length;

                                if (
                                    repl.componentIdx ===
                                    copyComponent.componentIdx
                                ) {
                                    if (
                                        update_start !== undefined &&
                                        update_end !== undefined
                                    ) {
                                        start_idx = i + update_start;
                                        end_idx = i + update_end;
                                    } else {
                                        start_idx = i;
                                        end_idx = i + n;
                                    }
                                }

                                replacementsWithoutExpandedCopies.push(
                                    ...newReplacements,
                                );
                                i += n;
                            }
                        } else {
                            replacementsWithoutExpandedCopies.push(repl);
                            i++;
                        }
                    }

                    return replacementsWithoutExpandedCopies;
                }

                await calcStartEndIdx(indexParent.replacements);

                if (start_idx !== undefined && end_idx !== undefined) {
                    indexResolution = {
                        ReplaceRange: {
                            parent: indexParent.componentIdx,
                            range: { start: start_idx, end: end_idx },
                        },
                    };
                } else {
                    // if the copy was not found as a replacement of the composite,
                    // then it wasn't a top-level replacement and it doesn't affect the composite's index resolution
                    indexResolution = "None";
                }
            } else {
                parentIdx = copyComponent.componentIdx;
                indexResolution = { ReplaceAll: { parent: parentIdx } };
            }
        } else {
            parentIdx = component.componentIdx;

            if (
                this.componentInfoObjects.isCompositeComponent({
                    componentType: component.componentType,
                    includeNonStandard: true,
                })
            ) {
                if (update_start !== undefined && update_end !== undefined) {
                    indexResolution = {
                        ReplaceRange: {
                            parent: parentIdx,
                            range: { start: update_start, end: update_end },
                        },
                    };
                } else {
                    indexResolution = { ReplaceAll: { parent: parentIdx } };
                }
            }
        }

        return { parentIdx, indexResolution };
    }

    addComponentsToResolver(components, parentIdx) {
        const flatFragment = {
            children: components.map((child) =>
                typeof child === "string"
                    ? child
                    : getEffectiveComponentIdx(child),
            ),
            nodes: [],
            parentIdx,
            idxMap: {},
        };

        addNodesToFlatFragment({
            flatFragment,
            serializedComponents: components,
            parentIdx,
        });

        // console.log("add nodes from components to resolver", {
        //     flatFragment,
        // });

        if (this.addNodesToResolver) {
            this.addNodesToResolver(flatFragment, "None");

            this.rootNames = this.calculateRootNames?.().names;
        }
    }

    gatherErrorsAndAssignDoenetMLRange({
        components,
        errors,
        warnings,
        position,
        sourceDoc,
        overwriteDoenetMLRange = false,
    }) {
        assignDoenetMLRange(
            components,
            position,
            sourceDoc,
            overwriteDoenetMLRange,
        );
        assignDoenetMLRange(errors, position, sourceDoc);
        assignDoenetMLRange(warnings, position, sourceDoc);

        for (const error of errors) {
            this.addErrorWarning({
                ...error,
                type: "error",
            });
        }
        for (const warning of warnings) {
            this.addErrorWarning({
                ...warning,
                type: "warning",
            });
        }
    }

    async expandShadowingComposite(component) {
        // console.log(`expand shadowing composite, ${component.componentIdx}`);

        if (
            this.updateInfo.compositesBeingExpanded.includes(
                component.shadows.componentIdx,
            )
        ) {
            // found a circular dependency,
            // as we are in the middle of expanding a composite
            // that we are now trying to shadow
            let compositeInvolved =
                this._components[component.shadows.componentIdx];
            // find non-shadow for error message, as that would be a component from document
            while (compositeInvolved.shadows) {
                compositeInvolved =
                    this._components[compositeInvolved.shadows.componentIdx];
            }
            throw Error(
                `Circular dependency involving ${compositeInvolved.componentIdx}.`,
            );
        }

        let shadowedComposite =
            this._components[component.shadows.componentIdx];
        let compositesExpanded = [];

        // console.log(`shadowedComposite: ${shadowedComposite.componentIdx}`);
        // console.log(shadowedComposite.isExpanded);
        if (!shadowedComposite.isExpanded) {
            let result = await this.expandCompositeComponent(shadowedComposite);

            if (!result.success) {
                throw Error(
                    `expand result of ${component.componentIdx} was not a success even though ready to expand.`,
                );
            }
            compositesExpanded.push(...result.compositesExpanded);
        }

        // we'll copy the replacements of the shadowed composite
        // and make those be the replacements of the shadowing composite
        let serializedReplacements = [];

        let nComponents = this._components.length;
        let newNComponents = nComponents;

        // We address one complication from shadowing a component with copied in children.
        // In this case, the name resolver will already have the component indices of the serialized children of `component`.
        // The corresponding replacements of `component` should have those component indices.
        // However, those replacements already exist in the replacements of `shadowedComposite` which we are copying.
        // As a workaround, we create a map from the indices of the children of `shadowedComposite`
        // to the indices of the children of `component` and override the component indices created on the new replacements.
        const idxMapOverride = {};
        const copyInChildren =
            shadowedComposite.attributes.copyInChildren?.primitive.value;
        if (copyInChildren) {
            const componentChildren = JSON.parse(
                JSON.stringify(component.serializedChildren),
            );
            const shadowedChildren = JSON.parse(
                JSON.stringify(shadowedComposite.serializedChildren),
            );

            // We are reusing this code that maps indices from serialized components to get the map
            // from indices of `shadowedChildren` to indices of `componentChildren`.
            const res = createComponentIndicesFromSerializedChildren(
                shadowedChildren,
                componentChildren,
                newNComponents,
            );

            for (const idx in res.idxMap) {
                // the above code might also have created new indices, which we ignore
                if (res.idxMap[idx] < newNComponents) {
                    idxMapOverride[idx] = res.idxMap[idx];
                }
            }
        }

        for (let [idx, repl] of shadowedComposite.replacements.entries()) {
            if (typeof repl === "object") {
                const serializedComponent = await repl.serialize();

                if (
                    component.constructor.useSerializedChildrenComponentIndices
                ) {
                    const res = createComponentIndicesFromSerializedChildren(
                        [serializedComponent],
                        [component.serializedChildren[idx]],
                        newNComponents,
                    );
                    newNComponents = res.nComponents;

                    serializedReplacements.push(...res.components);
                } else {
                    const res = createNewComponentIndices(
                        [serializedComponent],
                        newNComponents,
                        idxMapOverride,
                    );
                    newNComponents = res.nComponents;

                    serializedReplacements.push(...res.components);
                }
            } else {
                serializedReplacements.push(repl);
            }
        }

        if (component.constructor.addExtraSerializedChildrenWhenShadowing) {
            // add any serialized children that are beyond the replacements we already have
            serializedReplacements.push(
                ...deepClone(
                    component.serializedChildren.slice(
                        serializedReplacements.length,
                    ),
                ),
            );
        }

        this.adjustForCreateComponentIdxName(serializedReplacements, component);

        // console.log(
        //     `serialized replacements of ${shadowedComposite.componentIdx}`,
        // );
        // console.log(JSON.parse(JSON.stringify(serializedReplacements)));

        // Have three composites involved:
        // 1. the shadowing composite (component, the one we're trying to expand)
        // 2. the shadowed composite
        // 3. the composite mediating the shadowing
        //    (of which shadowing composite is the replacement)

        let nameOfCompositeMediatingTheShadow = component.shadows.compositeIdx;
        let compositeMediatingTheShadow =
            this.components[nameOfCompositeMediatingTheShadow];
        serializedReplacements = postProcessCopy({
            serializedComponents: serializedReplacements,
            componentIdx: nameOfCompositeMediatingTheShadow,
        });

        // console.log("--------------");
        // console.log(
        //   `name of composite mediating shadow: ${nameOfCompositeMediatingTheShadow}`,
        // );
        // console.log(`name of composite shadowing: ${component.componentIdx}`);
        // console.log(
        //   `name of shadowed composite: ${shadowedComposite.componentIdx}`,
        // );

        // If shadowed composite mediates the shadow of compositeMediatingTheShadow,
        // then we have a circular reference.
        // mediatesShadows is an array of objects with keys shadows and shadowed,
        // that the shadow mediated by the component.
        // We check if shadowedComposite mediates the shadow of compositeMediatingTheShadow,
        // or, recursively, if one of those shadowed components
        // mediates the shadow of compositeMediatingTheShadow

        let foundCircular = false;
        let shadowedByShadowed = shadowedComposite.mediatesShadows
            ?.filter((v) => v.propVariable === undefined)
            .map((v) => v.shadowed);

        while (shadowedByShadowed?.length > 0) {
            if (
                shadowedByShadowed.includes(nameOfCompositeMediatingTheShadow)
            ) {
                foundCircular = true;
                let message = "Circular dependency detected";
                if (component.attributes.createComponentOfType?.primitive) {
                    message += ` involving <${component.attributes.createComponentOfType.primitive.value}> component`;
                }
                message += ".";
                serializedReplacements = [
                    {
                        type: "serialized",
                        componentType: "_error",
                        componentIdx: newNComponents++,
                        attributes: {},
                        doenetAttributes: {},
                        children: [],
                        state: { message },
                        position: compositeMediatingTheShadow.position,
                        sourceDoc: compositeMediatingTheShadow.sourceDoc,
                    },
                ];
                this.addErrorWarning({
                    type: "error",
                    message,
                    position: compositeMediatingTheShadow.position,
                    sourceDoc: compositeMediatingTheShadow.sourceDoc,
                });

                break;
            }

            // recurse to check if one the shadowed components mediates
            // the shadow of compositeMediatingTheShadow
            shadowedByShadowed = shadowedByShadowed.reduce((acc, cIdx) => {
                let comp = this.components[cIdx];
                if (comp?.mediatesShadows) {
                    return [
                        ...acc,
                        ...comp.mediatesShadows
                            .filter((v) => v.propVariable === undefined)
                            .map((v) => v.shadowed),
                    ];
                } else {
                    return acc;
                }
            }, []);
        }

        // XXX: what is the replacement for targetComponentIdx?
        // let target =
        //     this._components[
        //         compositeMediatingTheShadow.doenetAttributes.targetComponentIdx
        //     ];

        // if (
        //     target?.componentIdx === shadowedComposite.componentIdx &&
        //     compositeMediatingTheShadow.attributes.copyInChildren?.primitive
        //         .value
        // ) {
        //     let newReplacements = deepClone(
        //         compositeMediatingTheShadow.serializedChildren,
        //     );
        //     let componentClass =
        //         this.componentInfoObjects.allComponentClasses[
        //             component.componentType
        //         ];

        //     if (!componentClass.includeBlankStringChildren) {
        //         newReplacements = newReplacements.filter(
        //             (x) => typeof x !== "string" || x.trim() !== "",
        //         );
        //     }

        //     serializedReplacements.push(...newReplacements);
        // }

        if (!foundCircular) {
            let verificationResult = await verifyReplacementsMatchSpecifiedType(
                {
                    component,
                    replacements: serializedReplacements,
                    componentInfoObjects: this.componentInfoObjects,
                    compositeAttributesObj:
                        component.constructor.createAttributesObject(),
                    components: this._components,
                    nComponents: newNComponents,
                    publicCaseInsensitiveAliasSubstitutions:
                        this.publicCaseInsensitiveAliasSubstitutions.bind(this),
                },
            );

            for (const error of verificationResult.errors) {
                this.addErrorWarning({
                    ...error,
                    type: "error",
                });
            }
            for (const warning of verificationResult.warnings) {
                this.addErrorWarning({
                    ...warning,
                    type: "warning",
                });
            }

            newNComponents = verificationResult.nComponents;

            serializedReplacements = verificationResult.replacements;

            addAttributesToSingleReplacement(
                serializedReplacements,
                component,
                this.componentInfoObjects,
            );
        }

        // console.log(
        //     `serialized replacements for ${component.componentIdx} who is shadowing ${shadowedComposite.componentIdx}`,
        // );
        // console.log(deepClone(serializedReplacements));

        await this.addReplacementsToResolver({
            serializedReplacements,
            component,
        });

        // expand `this._components` to length `newNComponents` so that the component indices will not be reused
        if (newNComponents > this._components.length) {
            this._components[newNComponents - 1] = undefined;
        }

        await this.createAndSetReplacements({
            component,
            serializedReplacements,
        });

        if (shadowedComposite.replacementsToWithhold > 0) {
            component.replacementsToWithhold =
                shadowedComposite.replacementsToWithhold;
        }

        // record that are finished expanding the composite
        let targetInd = this.updateInfo.compositesBeingExpanded.indexOf(
            component.componentIdx,
        );
        if (targetInd === -1) {
            throw Error(
                `Something is wrong as we lost track that we were expanding ${component.componentIdx}`,
            );
        }
        this.updateInfo.compositesBeingExpanded.splice(targetInd, 1);

        compositesExpanded.push(component.componentIdx);

        return { success: true, compositesExpanded };
    }

    /**
     * If `composite` has `createComponentIdx` specified,
     * then its one replacement should have the componentIdx.
     * Similarly, if it has `createComponentName` specified,
     * then its one replacement receive that name.
     */
    adjustForCreateComponentIdxName(serializedReplacements, composite) {
        if (serializedReplacements.length === 1) {
            if (
                composite.attributes.createComponentIdx?.primitive.value !=
                undefined
            ) {
                serializedReplacements[0].componentIdx =
                    composite.attributes.createComponentIdx.primitive.value;
            }

            if (
                composite.attributes.createComponentName?.primitive.value !=
                undefined
            ) {
                serializedReplacements[0].attributes.name = {
                    type: "primitive",
                    name: "name",
                    primitive: {
                        type: "string",
                        value: composite.attributes.createComponentName
                            .primitive.value,
                    },
                };
            }
        }
    }

    async createAndSetReplacements({ component, serializedReplacements }) {
        this.parameterStack.push(component.sharedParameters, false);

        try {
            let replacementResult = await this.createIsolatedComponents({
                serializedComponents: serializedReplacements,
                ancestors: component.ancestors,
                shadow: true,
                componentsReplacementOf: component,
            });
            component.replacements = replacementResult.components;
        } catch (e) {
            console.error(e);
            // throw e;
            component.replacements = await this.setErrorReplacements({
                composite: component,
                message: e.message,
            });
        }
        this.parameterStack.pop();

        await this.dependencies.addBlockersFromChangedReplacements(component);

        component.isExpanded = true;
    }

    async replaceCompositeChildren(parent) {
        // if composite is not directly matched by any childGroup
        // then replace the composite with its replacements,
        // expanding it if not already expanded

        // console.log(`replace composite children of ${parent.componentIdx}`)

        delete parent.placeholderActiveChildrenIndices;
        delete parent.placeholderActiveChildrenIndicesByComposite;
        delete parent.compositeReplacementActiveRange;

        let undisplayableErrorChildren;

        let nPlaceholdersAdded = 0;

        for (
            let childInd = 0;
            childInd < parent.activeChildren.length;
            childInd++
        ) {
            let child = parent.activeChildren[childInd];

            if (
                child instanceof
                this.componentInfoObjects.allComponentClasses._composite
            ) {
                // if composite itself is in the child logic
                // then don't replace it with its replacements
                // but leave the composite as an activeChild
                if (
                    this.findChildGroup(child.componentType, parent.constructor)
                        .success
                ) {
                    continue;
                }

                let replaceWithPlaceholders = false;

                // if an unexpanded composite has a createComponentOfType specified
                // replace with placeholders
                // otherwise, leave composite as an activeChild
                if (!child.isExpanded) {
                    if (child.attributes.createComponentOfType?.primitive) {
                        replaceWithPlaceholders = true;
                    } else {
                        continue;
                    }
                }

                let replacements;

                if (replaceWithPlaceholders) {
                    let numComponents;

                    if (child.attributes.numComponents) {
                        numComponents =
                            child.attributes.numComponents.primitive.value;
                    } else {
                        numComponents = 1;
                    }

                    let componentType =
                        this.componentInfoObjects.componentTypeLowerCaseMapping[
                            child.attributes.createComponentOfType.primitive.value.toLowerCase()
                        ];
                    replacements = [];

                    for (let i = 0; i < numComponents; i++) {
                        replacements.push({
                            componentType,
                            fromComposite: child.componentIdx,
                            placeholderInd: nPlaceholdersAdded,
                        });
                        nPlaceholdersAdded++;
                    }

                    parent.hasPlaceholderActiveChildren = true;
                    let placeholdInds = [...Array(numComponents).keys()].map(
                        (x) => x + childInd,
                    );

                    if (!parent.placeholderActiveChildrenIndices) {
                        parent.placeholderActiveChildrenIndices = [];
                    }
                    parent.placeholderActiveChildrenIndices.push(
                        ...placeholdInds,
                    );

                    if (!parent.placeholderActiveChildrenIndicesByComposite) {
                        parent.placeholderActiveChildrenIndicesByComposite = {};
                    }
                    parent.placeholderActiveChildrenIndicesByComposite[
                        child.componentIdx
                    ] = placeholdInds;
                } else {
                    // don't use any replacements that are marked as being withheld
                    await this.markWithheldReplacementsInactive(child);

                    replacements = child.replacements;
                    if (child.replacementsToWithhold > 0) {
                        replacements = replacements.slice(
                            0,
                            -child.replacementsToWithhold,
                        );
                    }

                    // don't include blank string replacements if parent excludes blank children
                    if (
                        !parent.constructor.includeBlankStringChildren ||
                        parent.constructor.removeBlankStringChildrenPostSugar
                    ) {
                        replacements = replacements.filter(
                            (x) => typeof x !== "string" || /\S/.test(x),
                        );
                    }
                }

                if (!parent.compositeReplacementActiveRange) {
                    parent.compositeReplacementActiveRange = [];
                }

                // Record whether or not each component can be considered an element of a list.
                // If this composite or a containing composite has asList set,
                // then it may be turned into a list if all the components can be list elements.

                // All inline components and any components with canBeInList set
                // are considered potential components for a list.
                let replacementsCanBeInList = replacements.map((repl) =>
                    Boolean(
                        typeof repl !== "object" ||
                        (this.componentInfoObjects.isInheritedComponentType({
                            inheritedComponentType: repl.componentType,
                            baseComponentType: "_inline",
                        }) &&
                            repl.constructor.canBeInList !== false) ||
                        repl.constructor.canBeInList,
                    ),
                );

                for (let otherCompositeObject of parent.compositeReplacementActiveRange) {
                    if (otherCompositeObject.lastInd >= childInd) {
                        otherCompositeObject.lastInd += replacements.length - 1;
                        otherCompositeObject.potentialListComponents.splice(
                            childInd,
                            1,
                            ...replacementsCanBeInList,
                        );
                    }
                }

                if (
                    replacements.some(
                        (repl) => repl.componentType === "_error",
                    ) &&
                    !parent.constructor.canDisplayChildErrors
                ) {
                    // The composite returned an error but this parent cannot display child errors,
                    // so remove it from the replacements
                    // (to avoid a confusing warning about an invalid _error child)
                    // and store it in undisplayableErrorChildren.
                    // We will add these error children to an ancestor that can display them, below.

                    if (!undisplayableErrorChildren) {
                        undisplayableErrorChildren = [];
                    }
                    let errorReplacements = replacements.filter(
                        (repl) => repl.componentType === "_error",
                    );
                    replacements = replacements.filter(
                        (repl) => repl.componentType !== "_error",
                    );
                    undisplayableErrorChildren.push(...errorReplacements);
                }

                // compositeReplacementActiveRange will be used
                // - in renderers to determined if they should add commas
                // - in child dependencies, where they will be translated for matched children
                //   and used in some components to determine if those children can be formed into a list
                if (child.isExpanded) {
                    parent.compositeReplacementActiveRange.push({
                        compositeIdx: child.componentIdx,
                        compositeName:
                            this.rootNames?.[child.componentIdx] ??
                            child.componentIdx.toString(),
                        extendIdx: await child.stateValues.extendIdx,
                        unresolvedPath: await child.stateValues.unresolvedPath,
                        firstInd: childInd,
                        lastInd: childInd + replacements.length - 1,
                        asList: await child.stateValues.asList,
                        potentialListComponents: replacementsCanBeInList,
                    });
                }

                parent.activeChildren.splice(childInd, 1, ...replacements);

                // Update allChildren object with info on composite and its replacemnts
                let allChildrenObj = parent.allChildren[child.componentIdx];
                delete allChildrenObj.activeChildrenIndex;
                for (let ind2 = 0; ind2 < replacements.length; ind2++) {
                    let replacement = replacements[ind2];
                    if (replacement.componentIdx != undefined) {
                        // ignore placeholder, string, and primitive number active children
                        parent.allChildren[replacement.componentIdx] = {
                            activeChildrenIndex: childInd + ind2,
                            component: replacement,
                        };
                    }
                }

                // find index of child in allChildrenOrdered
                // and place replacements immediately afterward
                let ind2 = parent.allChildrenOrdered.indexOf(
                    child.componentIdx,
                );
                parent.allChildrenOrdered.splice(
                    ind2 + 1,
                    0,
                    ...replacements
                        .filter((x) => typeof x === "object")
                        .map((x) =>
                            x.componentIdx ? x.componentIdx : x.placeholderInd,
                        ),
                );

                if (replacements.length !== 1) {
                    // if replaced composite with anything other than one replacement
                    // shift activeChildrenIndices of later children
                    let nShift = replacements.length - 1;
                    for (
                        let ind2 = childInd + replacements.length;
                        ind2 < parent.activeChildren.length;
                        ind2++
                    ) {
                        let child2 = parent.activeChildren[ind2];
                        if (child2.componentIdx != undefined) {
                            parent.allChildren[
                                child2.componentIdx
                            ].activeChildrenIndex += nShift;
                        }
                    }
                }

                // rewind one index, in case any of the new activeChildren are composites
                childInd--;
            }
        }

        if (undisplayableErrorChildren) {
            await this.addUndisplayableErrorChildrenToAncestor(
                parent,
                undisplayableErrorChildren,
            );
        }
    }

    async addUndisplayableErrorChildrenToAncestor(
        parent,
        undisplayableErrorChildren,
    ) {
        // If parent had an error added by a composite, but it can't display errors,
        // then look for an ancestor that can display errors
        // (which will exist since document can display errors).
        // Add the errors to the defining children of that ancestor.
        // Note: this breaks the rules of DoenetML and
        // it is possible that these errors will accumulate in the ancestor
        // if this code is repeated. But, the DoenetML is broken anyway with errors,
        // and the purpose is just to make sure that the error is prominently displayed.

        let ancestorToDisplayErrors = parent;
        let definingChildIndToAddError;
        while (!ancestorToDisplayErrors.constructor.canDisplayChildErrors) {
            let nextAncestor =
                this._components[ancestorToDisplayErrors.parentIdx];

            definingChildIndToAddError = nextAncestor.definingChildren.indexOf(
                ancestorToDisplayErrors,
            );

            ancestorToDisplayErrors = nextAncestor;
        }

        // if child wasn't a defining child, put the error as the first child
        if (definingChildIndToAddError === -1) {
            definingChildIndToAddError = 0;
        }

        ancestorToDisplayErrors.definingChildren.splice(
            definingChildIndToAddError,
            0,
            ...undisplayableErrorChildren,
        );

        await this.processNewDefiningChildren({
            parent: ancestorToDisplayErrors,
            expandComposites: false,
        });
    }

    async markWithheldReplacementsInactive(composite) {
        let numActive = composite.replacements.length;

        if (await composite.stateValues.isInactiveCompositeReplacement) {
            numActive = 0;
        } else if (composite.replacementsToWithhold > 0) {
            numActive -= composite.replacementsToWithhold;
        }

        for (let repl of composite.replacements.slice(0, numActive)) {
            await this.changeInactiveComponentAndDescendants(repl, false);
        }

        for (let repl of composite.replacements.slice(numActive)) {
            await this.changeInactiveComponentAndDescendants(repl, true);
        }

        // composite is newly active
        // if updates to replacements were postponed
        // add them back to the queue
        if (!(await composite.stateValues.isInactiveCompositeReplacement)) {
            let cIdx = composite.componentIdx;
            if (
                this.updateInfo.inactiveCompositesToUpdateReplacements.has(cIdx)
            ) {
                this.updateInfo.inactiveCompositesToUpdateReplacements.delete(
                    cIdx,
                );
                this.updateInfo.compositesToUpdateReplacements.add(cIdx);
            }
        }
    }

    async changeInactiveComponentAndDescendants(component, inactive) {
        if (typeof component !== "object") {
            return;
        }

        if (
            (await component.stateValues.isInactiveCompositeReplacement) !==
            inactive
        ) {
            component.state.isInactiveCompositeReplacement.value = inactive;
            await this.markUpstreamDependentsStale({
                component,
                varName: "isInactiveCompositeReplacement",
            });
            this.dependencies.recordActualChangeInUpstreamDependencies({
                component,
                varName: "isInactiveCompositeReplacement",
            });
            for (const childIdxStr in component.allChildren) {
                await this.changeInactiveComponentAndDescendants(
                    this._components[childIdxStr],
                    inactive,
                );
            }

            for (let attrName in component.attributes) {
                let attrComp = component.attributes[attrName].component;
                if (attrComp) {
                    await this.changeInactiveComponentAndDescendants(
                        this._components[attrComp.componentIdx],
                        inactive,
                    );
                }
            }

            if (component.replacements) {
                await this.markWithheldReplacementsInactive(component);
            }
        }
    }

    findShadowedChildInSerializedComponents({
        serializedComponents,
        shadowedComponentName,
    }) {
        for (let serializedComponent of serializedComponents) {
            if (serializedComponent.originalIdx === shadowedComponentName) {
                return serializedComponent;
            }
            if (serializedComponent.children) {
                let result = this.findShadowedChildInSerializedComponents({
                    serializedComponents: serializedComponent.children,
                    shadowedComponentName,
                });
                if (result) {
                    return result;
                }
            }
        }

        return;
    }

    async createStateVariableDefinitions({
        componentClass,
        prescribedDependencies,
        componentIdx,
    }) {
        let redefineDependencies;

        if (prescribedDependencies) {
            for (const idxStr in prescribedDependencies) {
                const idx = Number(idxStr);
                let depArray = prescribedDependencies[idx];
                for (let dep of depArray) {
                    if (dep.dependencyType === "referenceShadow") {
                        if (idx === componentIdx) {
                            throw Error(
                                `Circular dependency involving ${componentIdx}.`,
                            );
                        }
                        redefineDependencies = {
                            linkSource: "referenceShadow",
                            targetIdx: idx,
                            compositeIdx: dep.compositeIdx,
                            propVariable: dep.propVariable,
                            fromImplicitProp: dep.fromImplicitProp,
                            arrayStateVariable: dep.arrayStateVariable,
                            arrayKey: dep.arrayKey,
                            ignorePrimaryStateVariable:
                                dep.ignorePrimaryStateVariable,
                            substituteForPrimaryStateVariable:
                                dep.substituteForPrimaryStateVariable,
                            firstLevelReplacement: dep.firstLevelReplacement,
                            additionalStateVariableShadowing:
                                dep.additionalStateVariableShadowing,
                        };
                    } else if (dep.dependencyType === "adapter") {
                        redefineDependencies = {
                            linkSource: "adapter",
                            adapterTargetIdentity: dep.adapterTargetIdentity,
                            adapterVariable: dep.adapterVariable,
                            substituteForPrimaryStateVariable:
                                dep.substituteForPrimaryStateVariable,
                            stateVariablesToShadow: dep.stateVariablesToShadow,
                        };
                    }
                }
            }
        }

        let stateVariableDefinitions = {};

        if (!redefineDependencies) {
            this.createAttributeStateVariableDefinitions({
                stateVariableDefinitions,
                componentClass,
            });
        }

        //  add state variable definitions from component class
        let newDefinitions =
            componentClass.returnNormalizedStateVariableDefinitions(
                this.numerics,
            );

        Object.assign(stateVariableDefinitions, newDefinitions);

        if (redefineDependencies) {
            if (redefineDependencies.linkSource === "adapter") {
                this.createAdapterStateVariableDefinitions({
                    redefineDependencies,
                    stateVariableDefinitions,
                    componentClass,
                });
            } else {
                await this.createReferenceShadowStateVariableDefinitions({
                    redefineDependencies,
                    stateVariableDefinitions,
                    componentClass,
                });
            }
        }

        return stateVariableDefinitions;
    }

    createAttributeStateVariableDefinitions({
        componentClass,
        stateVariableDefinitions,
    }) {
        let attributes = componentClass.createAttributesObject();

        for (let attrName in attributes) {
            let attributeSpecification = attributes[attrName];
            if (!attributeSpecification.createStateVariable) {
                continue;
            }

            let varName = attributeSpecification.createStateVariable;

            let stateVarDef = (stateVariableDefinitions[varName] = {
                isAttribute: true, // Note: isAttribute is not accessed anywhere
                hasEssential: true,
                provideEssentialValuesInDefinition: true,
            });

            if (attributeSpecification.public) {
                stateVarDef.public = true;
                stateVarDef.shadowingInstructions = {};
                if (attributeSpecification.createPrimitiveOfType) {
                    stateVarDef.shadowingInstructions.createComponentOfType =
                        attributeSpecification.createPrimitiveOfType;
                    if (
                        stateVarDef.shadowingInstructions
                            .createComponentOfType === "string"
                    ) {
                        stateVarDef.shadowingInstructions.createComponentOfType =
                            "text";
                    } else if (
                        stateVarDef.shadowingInstructions
                            .createComponentOfType === "stringArray"
                    ) {
                        stateVarDef.shadowingInstructions.createComponentOfType =
                            "textList";
                    } else if (
                        stateVarDef.shadowingInstructions
                            .createComponentOfType === "numberArray"
                    ) {
                        stateVarDef.shadowingInstructions.createComponentOfType =
                            "numberList";
                    }
                } else if (attributeSpecification.createReferences) {
                    throw Error(
                        "Cannot make a public state variable from an attribute with createReferences",
                    );
                } else {
                    stateVarDef.shadowingInstructions.createComponentOfType =
                        attributeSpecification.createComponentOfType;
                }
            }

            let stateVariableForAttributeValue;

            if (attributeSpecification.createComponentOfType) {
                let attributeClass =
                    this.componentInfoObjects.allComponentClasses[
                        attributeSpecification.createComponentOfType
                    ];
                if (!attributeClass) {
                    throw Error(
                        `Component type ${attributeSpecification.createComponentOfType} does not exist so cannot create state variable for attribute ${attrName} of componentType ${componentClass.componentType}.`,
                    );
                }

                stateVariableForAttributeValue =
                    attributeSpecification.componentStateVariableForAttributeValue;
                if (stateVariableForAttributeValue === undefined) {
                    stateVariableForAttributeValue =
                        attributeClass.stateVariableToBeShadowed;
                    if (stateVariableForAttributeValue === undefined) {
                        stateVariableForAttributeValue = "value";
                    }
                }
            }

            stateVarDef.returnDependencies = function () {
                let dependencies = {};
                if (attributeSpecification.fallBackToParentStateVariable) {
                    dependencies.parentValue = {
                        dependencyType: "parentStateVariable",
                        variableName:
                            attributeSpecification.fallBackToParentStateVariable,
                    };
                }
                if (
                    attributeSpecification.fallBackToSourceCompositeStateVariable
                ) {
                    dependencies.sourceCompositeValue = {
                        dependencyType: "sourceCompositeStateVariable",
                        variableName:
                            attributeSpecification.fallBackToSourceCompositeStateVariable,
                    };
                }
                if (attributeSpecification.createPrimitiveOfType) {
                    dependencies.attributePrimitive = {
                        dependencyType: "attributePrimitive",
                        attributeName: attrName,
                    };
                } else if (attributeSpecification.createReferences) {
                    dependencies.attributeRefResolutions = {
                        dependencyType: "attributeRefResolutions",
                        attributeName: attrName,
                    };
                } else {
                    dependencies.attributeComponent = {
                        dependencyType: "attributeComponent",
                        attributeName: attrName,
                        variableNames: [stateVariableForAttributeValue],
                    };
                }

                return dependencies;
            };

            stateVarDef.definition = function ({
                dependencyValues,
                usedDefault,
                essentialValues,
            }) {
                let attributeValue;
                if (dependencyValues.attributeComponent) {
                    attributeValue =
                        dependencyValues.attributeComponent.stateValues[
                            stateVariableForAttributeValue
                        ];
                } else if (dependencyValues.attributePrimitive != null) {
                    attributeValue = dependencyValues.attributePrimitive;
                } else if (
                    dependencyValues.attributeRefResolutions != null &&
                    !usedDefault.attributeRefResolutions
                ) {
                    attributeValue = dependencyValues.attributeRefResolutions;
                } else {
                    // parentValue would be undefined if fallBackToParentStateVariable wasn't specified
                    // parentValue would be null if the parentValue state variables
                    // did not exist or its value was null
                    let haveParentValue = dependencyValues.parentValue != null;
                    if (
                        haveParentValue &&
                        !usedDefault.parentValue &&
                        essentialValues[varName] === undefined
                    ) {
                        return {
                            setValue: {
                                [varName]: dependencyValues.parentValue,
                            },
                            checkForActualChange: { [varName]: true },
                        };
                    } else {
                        // sourceCompositeValue would be undefined if fallBackToSourceCompositeStateVariable wasn't specified
                        // sourceCompositeValue would be null if the sourceCompositeValue state variables
                        // did not exist or its value was null

                        let haveSourceCompositeValue =
                            dependencyValues.sourceCompositeValue != null;
                        if (
                            haveSourceCompositeValue &&
                            !usedDefault.sourceCompositeValue &&
                            essentialValues[varName] === undefined
                        ) {
                            return {
                                setValue: {
                                    [varName]:
                                        dependencyValues.sourceCompositeValue,
                                },
                                checkForActualChange: { [varName]: true },
                            };
                        } else {
                            return {
                                useEssentialOrDefaultValue: {
                                    [varName]: true,
                                },
                                checkForActualChange: { [varName]: true },
                            };
                        }
                    }
                }

                let res = validateAttributeValue({
                    value: attributeValue,
                    attributeSpecification,
                    attribute: attrName,
                });

                return {
                    setValue: { [varName]: res.value },
                    checkForActualChange: { [varName]: true },
                    sendWarnings: res.warnings,
                };
            };

            if (!attributeSpecification.noInverse) {
                stateVarDef.inverseDefinition = async function ({
                    desiredStateVariableValues,
                    dependencyValues,
                    usedDefault,
                    essentialValues,
                }) {
                    if (!dependencyValues.attributeComponent) {
                        if (dependencyValues.attributePrimitive != null) {
                            // can't invert if have primitive
                            return { success: false };
                        }
                        if (dependencyValues.attributeRefResolutions != null) {
                            // can't invert if have attribute ref resolutions
                            return { success: false };
                        }

                        let haveParentValue =
                            dependencyValues.parentValue != null;
                        if (
                            haveParentValue &&
                            !usedDefault.parentValue &&
                            essentialValues[varName] === undefined
                        ) {
                            // value from parent was used, so propagate back to parent
                            return {
                                success: true,
                                instructions: [
                                    {
                                        setDependency: "parentValue",
                                        desiredValue:
                                            desiredStateVariableValues[varName],
                                    },
                                ],
                            };
                        } else {
                            let haveSourceCompositeValue =
                                dependencyValues.sourceCompositeValue != null;
                            if (
                                haveSourceCompositeValue &&
                                !usedDefault.sourceCompositeValue &&
                                essentialValues[varName] === undefined
                            ) {
                                // value from source composite was used, so propagate back to source composite
                                return {
                                    success: true,
                                    instructions: [
                                        {
                                            setDependency:
                                                "sourceCompositeValue",
                                            desiredValue:
                                                desiredStateVariableValues[
                                                    varName
                                                ],
                                        },
                                    ],
                                };
                            } else {
                                // no component or primitive, so value is essential and give it the desired value, but validated

                                let res = validateAttributeValue({
                                    value: desiredStateVariableValues[varName],
                                    attributeSpecification,
                                    attribute: attrName,
                                });

                                return {
                                    success: true,
                                    instructions: [
                                        {
                                            setEssentialValue: varName,
                                            value: res.value,
                                        },
                                    ],
                                    sendWarnings: res.warnings,
                                };
                            }
                        }
                    }

                    // attribute based on component

                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "attributeComponent",
                                desiredValue:
                                    desiredStateVariableValues[varName],
                                variableIndex: 0,
                            },
                        ],
                    };
                };
            }

            let attributesToCopy = [
                "forRenderer",
                "defaultValue",
                "propagateToProps",
                "triggerActionOnChange",
                "ignoreFixed",
                "isLocation",
                "essentialVarName",
            ];

            for (let attrName2 of attributesToCopy) {
                if (attrName2 in attributeSpecification) {
                    stateVarDef[attrName2] = attributeSpecification[attrName2];
                }
            }
        }
    }

    createAdapterStateVariableDefinitions({
        redefineDependencies,
        stateVariableDefinitions,
        componentClass,
    }) {
        // attributes depend on adapterTarget (if attribute exists in adapterTarget)
        let adapterTargetComponent =
            this._components[
                redefineDependencies.adapterTargetIdentity.componentIdx
            ];

        let attributes = componentClass.createAttributesObject();

        for (let attrName in attributes) {
            let attributeSpecification = attributes[attrName];
            if (!attributeSpecification.createStateVariable) {
                continue;
            }

            let varName = attributeSpecification.createStateVariable;

            let stateVarDef = (stateVariableDefinitions[varName] = {
                isAttribute: true, // Note: isAttribute is not accessed anywhere
                hasEssential: true,
            });

            if (attributeSpecification.public) {
                stateVarDef.public = true;
                stateVarDef.shadowingInstructions = {};
                if (attributeSpecification.createPrimitiveOfType) {
                    stateVarDef.shadowingInstructions.createComponentOfType =
                        attributeSpecification.createPrimitiveOfType;
                    if (
                        stateVarDef.shadowingInstructions
                            .createComponentOfType === "string"
                    ) {
                        stateVarDef.shadowingInstructions.createComponentOfType =
                            "text";
                    } else if (
                        stateVarDef.shadowingInstructions
                            .createComponentOfType === "stringArray"
                    ) {
                        stateVarDef.shadowingInstructions.createComponentOfType =
                            "textList";
                    } else if (
                        stateVarDef.shadowingInstructions
                            .createComponentOfType === "numberArray"
                    ) {
                        stateVarDef.shadowingInstructions.createComponentOfType =
                            "numberList";
                    }
                } else if (attributeSpecification.createReferences) {
                    throw Error(
                        "Cannot make a public state variable from an attribute with createReferences",
                    );
                } else {
                    stateVarDef.shadowingInstructions.createComponentOfType =
                        attributeSpecification.createComponentOfType;
                }
            }

            if (varName in adapterTargetComponent.state) {
                stateVarDef.returnDependencies = () => ({
                    adapterTargetVariable: {
                        dependencyType: "stateVariable",
                        componentIdx:
                            redefineDependencies.adapterTargetIdentity
                                .componentIdx,
                        variableName: varName,
                    },
                });
            } else {
                stateVarDef.returnDependencies = () => ({});
            }

            stateVarDef.definition = function ({
                dependencyValues,
                usedDefault,
            }) {
                if (
                    dependencyValues.adapterTargetVariable === undefined ||
                    usedDefault.adapterTargetVariable
                ) {
                    return {
                        useEssentialOrDefaultValue: {
                            [varName]: true,
                        },
                        checkForActualChange: { [varName]: true },
                    };
                } else {
                    return {
                        setValue: {
                            [varName]: dependencyValues.adapterTargetVariable,
                        },
                        checkForActualChange: { [varName]: true },
                    };
                }
            };

            if (!attributeSpecification.noInverse) {
                stateVarDef.inverseDefinition = async function ({
                    desiredStateVariableValues,
                    dependencyValues,
                }) {
                    if (dependencyValues.adapterTargetVariable === undefined) {
                        return {
                            success: true,
                            instructions: [
                                {
                                    setEssentialValue: varName,
                                    value: desiredStateVariableValues[varName],
                                },
                            ],
                        };
                    } else {
                        return {
                            success: true,
                            instructions: [
                                {
                                    setDependency: "adapterTargetVariable",
                                    desiredValue:
                                        desiredStateVariableValues[varName],
                                },
                            ],
                        };
                    }
                };
            }

            let attributesToCopy = [
                "forRenderer",
                "defaultValue",
                "propagateToProps",
                "ignoreFixed",
                "isLocation",
                "essentialVarName",
            ];

            for (let attrName2 of attributesToCopy) {
                if (attrName2 in attributeSpecification) {
                    stateVarDef[attrName2] = attributeSpecification[attrName2];
                }
            }
        }

        // primaryStateVariableForDefinition is the state variable that the componentClass
        // being created has specified should be given the value when it
        // is created from an outside source like a reference to a prop or an adapter
        let primaryStateVariableForDefinition = "value";
        if (redefineDependencies.substituteForPrimaryStateVariable) {
            primaryStateVariableForDefinition =
                redefineDependencies.substituteForPrimaryStateVariable;
        } else if (componentClass.primaryStateVariableForDefinition) {
            primaryStateVariableForDefinition =
                componentClass.primaryStateVariableForDefinition;
        }
        let stateDef =
            stateVariableDefinitions[primaryStateVariableForDefinition];
        stateDef.isShadow = true;
        stateDef.returnDependencies = () => ({
            adapterTargetVariable: {
                dependencyType: "stateVariable",
                componentIdx:
                    redefineDependencies.adapterTargetIdentity.componentIdx,
                variableName: redefineDependencies.adapterVariable,
            },
        });
        if (stateDef.set) {
            stateDef.definition = function ({ dependencyValues }) {
                return {
                    setValue: {
                        [primaryStateVariableForDefinition]: stateDef.set(
                            dependencyValues.adapterTargetVariable,
                        ),
                    },
                };
            };
        } else {
            stateDef.definition = function ({ dependencyValues }) {
                return {
                    setValue: {
                        [primaryStateVariableForDefinition]:
                            dependencyValues.adapterTargetVariable,
                    },
                };
            };
        }
        stateDef.inverseDefinition = function ({ desiredStateVariableValues }) {
            return {
                success: true,
                instructions: [
                    {
                        setDependency: "adapterTargetVariable",
                        desiredValue:
                            desiredStateVariableValues[
                                primaryStateVariableForDefinition
                            ],
                    },
                ],
            };
        };

        if (redefineDependencies.stateVariablesToShadow) {
            this.modifyStateDefsToBeShadows({
                stateVariablesToShadow:
                    redefineDependencies.stateVariablesToShadow,
                stateVariableDefinitions,
                targetComponent: adapterTargetComponent,
            });
        }
    }

    async createReferenceShadowStateVariableDefinitions({
        redefineDependencies,
        stateVariableDefinitions,
        componentClass,
    }) {
        let targetComponent = this._components[redefineDependencies.targetIdx];

        if (redefineDependencies.propVariable) {
            // if we have an array entry state variable that hasn't been created yet
            // create it now
            if (
                !targetComponent.state[redefineDependencies.propVariable] &&
                this.checkIfArrayEntry({
                    stateVariable: redefineDependencies.propVariable,
                    component: targetComponent,
                }).isArrayEntry
            ) {
                await this.createFromArrayEntry({
                    stateVariable: redefineDependencies.propVariable,
                    component: targetComponent,
                });
            }
        }

        // attributes depend
        // - first on attributes from component attribute components, if they exist
        // - then on targetComponent (if not copying a prop and attribute exists in targetComponent)

        let attributes = componentClass.createAttributesObject();

        for (let attrName in attributes) {
            let attributeSpecification = attributes[attrName];
            let varName = attributeSpecification.createStateVariable;
            if (!varName) {
                continue;
            }

            let stateVarDef = (stateVariableDefinitions[varName] = {
                isAttribute: true, // Note: isAttribute is not accessed anywhere
                hasEssential: true,
                provideEssentialValuesInDefinition: true,
            });

            let attributeFromPrimitive =
                !attributeSpecification.createComponentOfType;

            if (attributeSpecification.public) {
                stateVarDef.public = true;
                stateVarDef.shadowingInstructions = {};
                if (attributeSpecification.createPrimitiveOfType) {
                    stateVarDef.shadowingInstructions.createComponentOfType =
                        attributeSpecification.createPrimitiveOfType;
                    if (
                        stateVarDef.shadowingInstructions
                            .createComponentOfType === "string"
                    ) {
                        stateVarDef.shadowingInstructions.createComponentOfType =
                            "text";
                    } else if (
                        stateVarDef.shadowingInstructions
                            .createComponentOfType === "stringArray"
                    ) {
                        stateVarDef.shadowingInstructions.createComponentOfType =
                            "textList";
                    } else if (
                        stateVarDef.shadowingInstructions
                            .createComponentOfType === "numberArray"
                    ) {
                        stateVarDef.shadowingInstructions.createComponentOfType =
                            "numberList";
                    }
                } else if (attributeSpecification.createReferences) {
                    throw Error(
                        "Cannot make a public state variable from an attribute with createReferences",
                    );
                } else {
                    stateVarDef.shadowingInstructions.createComponentOfType =
                        attributeSpecification.createComponentOfType;
                }
            }

            let stateVariableForAttributeValue;

            if (attributeSpecification.createComponentOfType) {
                let attributeClass =
                    this.componentInfoObjects.allComponentClasses[
                        attributeSpecification.createComponentOfType
                    ];
                if (!attributeClass) {
                    throw Error(
                        `Component type ${attributeSpecification.createComponentOfType} does not exist so cannot create state variable for attribute ${attrName} of componentType ${componentClass.componentType}.`,
                    );
                }

                stateVariableForAttributeValue =
                    attributeSpecification.componentStateVariableForAttributeValue;
                if (stateVariableForAttributeValue === undefined) {
                    stateVariableForAttributeValue =
                        attributeClass.stateVariableToBeShadowed;
                    if (stateVariableForAttributeValue === undefined) {
                        stateVariableForAttributeValue = "value";
                    }
                }
            }

            let thisDependencies = {};

            if (attributeSpecification.createPrimitiveOfType) {
                thisDependencies.attributePrimitive = {
                    dependencyType: "attributePrimitive",
                    attributeName: attrName,
                };
            } else if (attributeSpecification.createReferences) {
                thisDependencies.attributeRefResolutions = {
                    dependencyType: "attributeRefResolutions",
                    attributeName: attrName,
                };
            } else {
                thisDependencies.attributeComponent = {
                    dependencyType: "attributeComponent",
                    attributeName: attrName,
                    variableNames: [stateVariableForAttributeValue],
                };
            }

            if (attributeSpecification.fallBackToParentStateVariable) {
                thisDependencies.parentValue = {
                    dependencyType: "parentStateVariable",
                    variableName:
                        attributeSpecification.fallBackToParentStateVariable,
                };
            }
            if (attributeSpecification.fallBackToSourceCompositeStateVariable) {
                thisDependencies.sourceCompositeValue = {
                    dependencyType: "sourceCompositeStateVariable",
                    variableName:
                        attributeSpecification.fallBackToSourceCompositeStateVariable,
                };
            }

            stateVarDef.returnDependencies = () => thisDependencies;

            stateVarDef.definition = function ({
                dependencyValues,
                usedDefault,
                essentialValues,
            }) {
                let attributeValue;
                if (dependencyValues.attributeComponent) {
                    attributeValue =
                        dependencyValues.attributeComponent.stateValues[
                            stateVariableForAttributeValue
                        ];
                } else if (dependencyValues.attributePrimitive != null) {
                    attributeValue = dependencyValues.attributePrimitive;
                } else if (
                    dependencyValues.attributeRefResolutions != null &&
                    !usedDefault.attributeRefResolutions
                ) {
                    attributeValue = dependencyValues.attributeRefResolutions;
                } else {
                    // parentValue would be undefined if fallBackToParentStateVariable wasn't specified
                    // parentValue would be null if the parentValue state variables
                    // did not exist or its value was null
                    let haveParentValue = dependencyValues.parentValue != null;
                    if (
                        haveParentValue &&
                        !usedDefault.parentValue &&
                        essentialValues[varName] === undefined
                    ) {
                        return {
                            setValue: {
                                [varName]: dependencyValues.parentValue,
                            },
                            checkForActualChange: { [varName]: true },
                        };
                    } else {
                        // sourceCompositeValue would be undefined if fallBackToSourceCompositeStateVariable wasn't specified
                        // sourceCompositeValue would be null if the sourceCompositeValue state variables
                        // did not exist or its value was null

                        let haveSourceCompositeValue =
                            dependencyValues.sourceCompositeValue != null;
                        if (
                            haveSourceCompositeValue &&
                            !usedDefault.sourceCompositeValue &&
                            essentialValues[varName] === undefined
                        ) {
                            return {
                                setValue: {
                                    [varName]:
                                        dependencyValues.sourceCompositeValue,
                                },
                                checkForActualChange: { [varName]: true },
                            };
                        } else {
                            return {
                                useEssentialOrDefaultValue: {
                                    [varName]: true,
                                },
                                checkForActualChange: { [varName]: true },
                            };
                        }
                    }
                }

                let res = validateAttributeValue({
                    value: attributeValue,
                    attributeSpecification,
                    attribute: attrName,
                });

                return {
                    setValue: { [varName]: res.value },
                    checkForActualChange: { [varName]: true },
                    sendWarnings: res.warnings,
                };
            };

            if (!attributeSpecification.noInverse) {
                stateVarDef.inverseDefinition = async function ({
                    desiredStateVariableValues,
                    dependencyValues,
                    usedDefault,
                    essentialValues,
                    stateValues,
                    workspace,
                }) {
                    if (!dependencyValues.attributeComponent) {
                        if (dependencyValues.attributePrimitive != null) {
                            // can't invert if have primitive
                            return { success: false };
                        }
                        if (dependencyValues.attributeRefResolutions != null) {
                            // can't invert if have attribute ref resolutions
                            return { success: false };
                        }

                        let haveParentValue =
                            dependencyValues.parentValue != null;
                        if (
                            haveParentValue &&
                            !usedDefault.parentValue &&
                            essentialValues[varName] === undefined
                        ) {
                            // value from parent was used, so propagate back to parent
                            return {
                                success: true,
                                instructions: [
                                    {
                                        setDependency: "parentValue",
                                        desiredValue:
                                            desiredStateVariableValues[varName],
                                    },
                                ],
                            };
                        } else {
                            let haveSourceCompositeValue =
                                dependencyValues.sourceCompositeValue != null;
                            if (
                                haveSourceCompositeValue &&
                                !usedDefault.sourceCompositeValue &&
                                essentialValues[varName] === undefined
                            ) {
                                // value from source composite was used, so propagate back to source composite
                                return {
                                    success: true,
                                    instructions: [
                                        {
                                            setDependency:
                                                "sourceCompositeValue",
                                            desiredValue:
                                                desiredStateVariableValues[
                                                    varName
                                                ],
                                        },
                                    ],
                                };
                            } else {
                                // no component or primitive, so value is essential and give it the desired value, but validated
                                let res = validateAttributeValue({
                                    value: desiredStateVariableValues[varName],
                                    attributeSpecification,
                                    attribute: attrName,
                                });

                                return {
                                    success: true,
                                    instructions: [
                                        {
                                            setEssentialValue: varName,
                                            value: res.value,
                                        },
                                    ],
                                    sendWarnings: res.warnings,
                                };
                            }
                        }
                    }
                    // attribute based on child

                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "attributeComponent",
                                desiredValue:
                                    desiredStateVariableValues[varName],
                                variableIndex: 0,
                            },
                        ],
                    };
                };
            }

            let attributesToCopy = [
                "forRenderer",
                "defaultValue",
                "propagateToProps",
                "ignoreFixed",
                "isLocation",
                "essentialVarName",
            ];

            for (let attrName2 of attributesToCopy) {
                if (attrName2 in attributeSpecification) {
                    stateVarDef[attrName2] = attributeSpecification[attrName2];
                }
            }
        }

        if (redefineDependencies.propVariable) {
            if (!redefineDependencies.ignorePrimaryStateVariable) {
                // primaryStateVariableForDefinition is the state variable that the componentClass
                // being created has specified should be given the value when it
                // is created from an outside source like a reference to a prop or an adapter
                let primaryStateVariableForDefinition = "value";
                if (redefineDependencies.substituteForPrimaryStateVariable) {
                    primaryStateVariableForDefinition =
                        redefineDependencies.substituteForPrimaryStateVariable;
                } else if (componentClass.primaryStateVariableForDefinition) {
                    primaryStateVariableForDefinition =
                        componentClass.primaryStateVariableForDefinition;
                }
                let stateDef =
                    stateVariableDefinitions[primaryStateVariableForDefinition];
                if (!stateDef) {
                    if (
                        redefineDependencies.substituteForPrimaryStateVariable
                    ) {
                        throw Error(
                            `Invalid public state variable of componentType ${componentClass.componentType}: substituteForPrimaryStateVariable ${redefineDependencies.substituteForPrimaryStateVariable} does not exist`,
                        );
                    } else {
                        throw Error(
                            `Cannot have a public state variable with componentType ${componentClass.componentType} as the class doesn't have a primary state variable for definition`,
                        );
                    }
                }
                stateDef.isShadow = true;
                stateDef.returnDependencies = () => ({
                    targetVariable: {
                        dependencyType: "stateVariable",
                        componentIdx: targetComponent.componentIdx,
                        variableName: redefineDependencies.propVariable,
                    },
                });

                let setDefault = false;
                if (
                    targetComponent.state[redefineDependencies.propVariable]
                        .defaultValue !== undefined
                ) {
                    stateDef.defaultValue =
                        targetComponent.state[
                            redefineDependencies.propVariable
                        ].defaultValue;
                    if (stateDef.set) {
                        stateDef.defaultValue = stateDef.set(
                            stateDef.defaultValue,
                        );
                    }
                    stateDef.hasEssential = true;
                    setDefault = true;
                }

                let targetVariableIsArray =
                    targetComponent.state[redefineDependencies.propVariable]
                        .isArray;

                if (stateDef.set) {
                    stateDef.definition = function ({
                        dependencyValues,
                        usedDefault,
                    }) {
                        let targetVariable = dependencyValues.targetVariable;
                        if (
                            targetVariable === undefined ||
                            (targetVariableIsArray &&
                                targetVariable.length === 0)
                        ) {
                            // allow for case where we depend on array entry that does not yet exist
                            return {
                                useEssentialOrDefaultValue: {
                                    [primaryStateVariableForDefinition]: true,
                                },
                            };
                        }
                        let valueFromTarget = stateDef.set(targetVariable);
                        if (setDefault && usedDefault.targetVariable) {
                            return {
                                useEssentialOrDefaultValue: {
                                    [primaryStateVariableForDefinition]: {
                                        defaultValue: valueFromTarget,
                                    },
                                },
                            };
                        }
                        return {
                            setValue: {
                                [primaryStateVariableForDefinition]:
                                    valueFromTarget,
                            },
                        };
                    };
                } else {
                    stateDef.definition = function ({
                        dependencyValues,
                        usedDefault,
                    }) {
                        let targetVariable = dependencyValues.targetVariable;
                        if (
                            targetVariable === undefined ||
                            (targetVariableIsArray &&
                                targetVariable.length === 0)
                        ) {
                            // allow for case where we depend on array entry that does not yet exist
                            return {
                                useEssentialOrDefaultValue: {
                                    [primaryStateVariableForDefinition]: true,
                                },
                            };
                        }
                        if (setDefault && usedDefault.targetVariable) {
                            return {
                                useEssentialOrDefaultValue: {
                                    [primaryStateVariableForDefinition]: {
                                        defaultValue: targetVariable,
                                    },
                                },
                            };
                        }
                        return {
                            setValue: {
                                [primaryStateVariableForDefinition]:
                                    targetVariable,
                            },
                        };
                    };
                }
                stateDef.inverseDefinition = function ({
                    desiredStateVariableValues,
                }) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "targetVariable",
                                desiredValue:
                                    desiredStateVariableValues[
                                        primaryStateVariableForDefinition
                                    ],
                            },
                        ],
                    };
                };
            }

            let shadowStandardVariables = false;
            let stateVariablesToShadow = [];
            if (targetComponent.constructor.implicitPropReturnsSameType) {
                if (redefineDependencies.fromImplicitProp) {
                    shadowStandardVariables = true;
                }

                // shadow any variables marked as shadowVariable
                for (let varName in targetComponent.state) {
                    let stateObj = targetComponent.state[varName];
                    if (stateObj.shadowVariable || stateObj.isShadow) {
                        stateVariablesToShadow.push(varName);
                    }
                }
            }

            if (redefineDependencies.additionalStateVariableShadowing) {
                // since using parallel arrays, start with empty array to match next indices
                let differentStateVariablesInTarget = Array(
                    stateVariablesToShadow.length,
                );
                for (let varName in redefineDependencies.additionalStateVariableShadowing) {
                    if (!stateVariablesToShadow.includes(varName)) {
                        stateVariablesToShadow.push(varName);
                        differentStateVariablesInTarget.push(
                            redefineDependencies
                                .additionalStateVariableShadowing[varName]
                                .stateVariableToShadow,
                        );
                    }
                }

                this.modifyStateDefsToBeShadows({
                    stateVariablesToShadow,
                    stateVariableDefinitions,
                    targetComponent,
                    differentStateVariablesInTarget,
                });
            } else if (shadowStandardVariables) {
                this.modifyStateDefsToBeShadows({
                    stateVariablesToShadow,
                    stateVariableDefinitions,
                    targetComponent,
                });
            }

            // for referencing a prop variable, don't shadow standard state variables
            // (unless except for above cases)
            // so just return now
            return;
        }

        let foundReadyToExpandWhenResolved = false;
        if ("readyToExpandWhenResolved" in stateVariableDefinitions) {
            // if shadowing a composite
            // make readyToExpandWhenResolved depend on the same variable
            // of the targetComponent also being resolved

            foundReadyToExpandWhenResolved = true;

            let stateDef = stateVariableDefinitions.readyToExpandWhenResolved;
            let originalReturnDependencies =
                stateDef.returnDependencies.bind(stateDef);
            let originalDefinition = stateDef.definition;

            stateDef.returnDependencies = function (args) {
                let dependencies = originalReturnDependencies(args);
                dependencies.targetReadyToExpandWhenResolved = {
                    dependencyType: "stateVariable",
                    componentIdx: targetComponent.componentIdx,
                    variableName: "readyToExpandWhenResolved",
                };
                return dependencies;
            };

            // change definition so that it is false if targetComponent isn't ready to expand
            stateDef.definition = function (args) {
                let result = originalDefinition(args);

                if (
                    result.setValue &&
                    result.setValue.readyToExpandWhenResolved
                ) {
                    if (
                        !args.dependencyValues.targetReadyToExpandWhenResolved
                    ) {
                        result.setValue.readyToExpandWhenResolved = false;
                    }
                }
                return result;
            };
        }

        let stateVariablesToShadow = [];

        // shadow any variables marked as shadowVariable
        for (let varName in targetComponent.state) {
            let stateObj = targetComponent.state[varName];
            if (stateObj.shadowVariable || stateObj.isShadow) {
                stateVariablesToShadow.push(varName);
            }
        }

        this.modifyStateDefsToBeShadows({
            stateVariablesToShadow,
            stateVariableDefinitions,
            foundReadyToExpandWhenResolved,
            targetComponent,
        });
    }

    modifyStateDefsToBeShadows({
        stateVariablesToShadow,
        stateVariableDefinitions,
        foundReadyToExpandWhenResolved,
        targetComponent,
        differentStateVariablesInTarget = [],
    }) {
        // Note: if add a markStale function to these shadow,
        // will need to modify array size state variable definition
        // (createArraySizeStateVariable)
        // to not overwrite markStale when it finds a shadow

        let deleteStateVariablesFromDefinition = {};
        for (let [varInd, varName] of stateVariablesToShadow.entries()) {
            let stateDef = stateVariableDefinitions[varName];

            if (stateDef === undefined) {
                if (varName.slice(0, 8) === "__array_") {
                    // have an array variable name that is created on the fly
                    // rather than being specified in original definition.
                    stateDef = stateVariableDefinitions[varName] = {};
                } else {
                    continue;
                }
            }

            stateDef.isShadow = true;

            if (stateDef.additionalStateVariablesDefined) {
                for (let varName2 of stateDef.additionalStateVariablesDefined) {
                    if (!stateVariablesToShadow.includes(varName2)) {
                        // varName2 is not shadowed, however, it includes varName
                        // in its definition
                        if (!deleteStateVariablesFromDefinition[varName2]) {
                            deleteStateVariablesFromDefinition[varName2] = [];
                        }
                        deleteStateVariablesFromDefinition[varName2].push(
                            varName,
                        );
                    }
                }
            }
            delete stateDef.additionalStateVariablesDefined;
            if (!foundReadyToExpandWhenResolved) {
                // if didn't find a readyToExpandWhenResolved,
                // then won't use original dependencies so can delete any
                // stateVariablesDeterminingDependencies
                delete stateDef.stateVariablesDeterminingDependencies;
            }

            let copyComponentType =
                stateDef.public &&
                stateDef.shadowingInstructions.hasVariableComponentType;

            if (stateDef.isArray) {
                let overrideVarNameWith =
                    differentStateVariablesInTarget[varInd];

                stateDef.returnArrayDependenciesByKey = function ({
                    arrayKeys,
                }) {
                    let dependenciesByKey = {};

                    for (let key of arrayKeys) {
                        dependenciesByKey[key] = {
                            targetVariable: {
                                dependencyType: "stateVariable",
                                componentIdx: targetComponent.componentIdx,
                                variableName:
                                    overrideVarNameWith ||
                                    this.arrayVarNameFromArrayKey(key),
                            },
                        };
                    }

                    let globalDependencies = {};

                    if (copyComponentType) {
                        globalDependencies.targetVariableComponentType = {
                            dependencyType: "stateVariableComponentType",
                            componentIdx: targetComponent.componentIdx,
                            variableName: varName,
                        };
                    }

                    if (stateDef.inverseShadowToSetEntireArray) {
                        globalDependencies.targetArray = {
                            dependencyType: "stateVariable",
                            componentIdx: targetComponent.componentIdx,
                            variableName: varName,
                        };
                    }

                    return { globalDependencies, dependenciesByKey };
                };

                stateDef.arrayDefinitionByKey = function ({
                    globalDependencyValues,
                    dependencyValuesByKey,
                    arrayKeys,
                }) {
                    // console.log(`shadow array definition by key for ${varName}`)
                    // console.log(JSON.parse(JSON.stringify(globalDependencyValues)))
                    // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)))
                    // console.log(JSON.parse(JSON.stringify(arrayKeys)))

                    let newEntries = {};

                    for (let arrayKey of arrayKeys) {
                        if (
                            "targetVariable" in dependencyValuesByKey[arrayKey]
                        ) {
                            newEntries[arrayKey] =
                                dependencyValuesByKey[arrayKey].targetVariable;
                        } else {
                            // put in a placeholder value until this can be rerun
                            // with the updated dependencies
                            newEntries[arrayKey] =
                                stateDef.defaultValueByArrayKey?.(arrayKey);
                        }
                    }

                    let result = {
                        setValue: { [varName]: newEntries },
                    };

                    // TODO: how do we make it do this just once?
                    if (
                        "targetVariableComponentType" in globalDependencyValues
                    ) {
                        result.setCreateComponentOfType = {
                            [varName]:
                                globalDependencyValues.targetVariableComponentType,
                        };
                    }

                    return result;
                };

                stateDef.inverseArrayDefinitionByKey = function ({
                    desiredStateVariableValues,
                    dependencyValuesByKey,
                    dependencyNamesByKey,
                    arraySize,
                    initialChange,
                }) {
                    if (stateDef.inverseShadowToSetEntireArray) {
                        return {
                            success: true,
                            instructions: [
                                {
                                    setDependency: "targetArray",
                                    desiredValue:
                                        desiredStateVariableValues[varName],
                                    treatAsInitialChange: initialChange,
                                },
                            ],
                        };
                    }

                    let instructions = [];
                    for (let key in desiredStateVariableValues[varName]) {
                        if (!dependencyValuesByKey[key]) {
                            continue;
                        }

                        instructions.push({
                            setDependency:
                                dependencyNamesByKey[key].targetVariable,
                            desiredValue:
                                desiredStateVariableValues[varName][key],
                            shadowedVariable: true,
                        });
                    }
                    return {
                        success: true,
                        instructions,
                    };
                };
            } else {
                let returnStartingDependencies = () => ({});

                if (foundReadyToExpandWhenResolved) {
                    // even though won't use original dependencies
                    // if found a readyToExpandWhenResolved
                    // keep original dependencies so that readyToExpandWhenResolved
                    // won't be resolved until all its dependent variables are resolved
                    returnStartingDependencies =
                        stateDef.returnDependencies.bind(stateDef);
                }

                let varNameInTarget = differentStateVariablesInTarget[varInd];
                if (!varNameInTarget) {
                    varNameInTarget = varName;
                }

                stateDef.returnDependencies = function (args) {
                    let dependencies = Object.assign(
                        {},
                        returnStartingDependencies(args),
                    );

                    dependencies.targetVariable = {
                        dependencyType: "stateVariable",
                        componentIdx: targetComponent.componentIdx,
                        variableName: varNameInTarget,
                    };
                    if (copyComponentType) {
                        dependencies.targetVariableComponentType = {
                            dependencyType: "stateVariableComponentType",
                            componentIdx: targetComponent.componentIdx,
                            variableName: varNameInTarget,
                        };
                    }
                    return dependencies;
                };
                stateDef.definition = function ({
                    dependencyValues,
                    usedDefault,
                }) {
                    let result = {};

                    // TODO: how do we make it do this just once?
                    if ("targetVariableComponentType" in dependencyValues) {
                        result.setCreateComponentOfType = {
                            [varName]:
                                dependencyValues.targetVariableComponentType,
                        };
                    }

                    if (
                        usedDefault.targetVariable &&
                        "defaultValue" in stateDef &&
                        stateDef.hasEssential
                    ) {
                        result.useEssentialOrDefaultValue = {
                            [varName]: {
                                defaultValue: dependencyValues.targetVariable,
                            },
                        };
                    } else {
                        result.setValue = {
                            [varName]: dependencyValues.targetVariable,
                        };
                    }

                    return result;
                };
                stateDef.excludeDependencyValuesInInverseDefinition = true;
                stateDef.inverseDefinition = function ({
                    desiredStateVariableValues,
                }) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "targetVariable",
                                desiredValue:
                                    desiredStateVariableValues[varName],
                                shadowedVariable: true,
                            },
                        ],
                    };
                };
            }
        }
        for (let varName in deleteStateVariablesFromDefinition) {
            this.modifyStateDefToDeleteVariableReferences({
                varNamesToDelete: deleteStateVariablesFromDefinition[varName],
                stateDef: stateVariableDefinitions[varName],
            });
        }
    }

    modifyStateDefToDeleteVariableReferences({ varNamesToDelete, stateDef }) {
        // delete variables from additionalStateVariablesDefined
        for (let varName2 of varNamesToDelete) {
            let ind =
                stateDef.additionalStateVariablesDefined.indexOf(varName2);
            stateDef.additionalStateVariablesDefined.splice(ind, 1);
        }

        // remove variables from definition
        let originalDefinition = stateDef.definition;
        stateDef.definition = function (args) {
            let results = originalDefinition(args);
            for (let key in results) {
                if (Array.isArray(results[key])) {
                    for (let varName2 of varNamesToDelete) {
                        let ind = results[key].indexOf(varName2);
                        if (ind !== -1) {
                            results[key].splice(ind, 1);
                        }
                    }
                } else {
                    for (let varName2 of varNamesToDelete) {
                        delete results[key][varName2];
                    }
                }
            }
            return results;
        };
    }

    async initializeComponentStateVariables(component) {
        for (let stateVariable in component.state) {
            if (component.state[stateVariable].isAlias) {
                if (!component.stateVarAliases) {
                    component.stateVarAliases = {};
                }
                component.stateVarAliases[stateVariable] =
                    component.state[stateVariable].targetVariableName;

                // TODO: do we want to delete alias from state?
                delete component.state[stateVariable];
            } else {
                await this.initializeStateVariable({
                    component,
                    stateVariable,
                });
            }
        }
    }

    async initializeStateVariable({
        component,
        stateVariable,
        arrayStateVariable,
        arrayEntryPrefix,
    }) {
        let getStateVar = this.getStateVariableValue;
        if (!component.state[stateVariable]) {
            component.state[stateVariable] = {};
        }
        let stateVarObj = component.state[stateVariable];
        stateVarObj.isResolved = false;
        Object.defineProperty(stateVarObj, "value", {
            get: () => getStateVar({ component, stateVariable }),
            configurable: true,
        });
        // Object.defineProperty(stateVarObj, 'value', {
        //   get:
        //     async function () {
        //       try {
        //         return getStateVar({ component, stateVariable });
        //       } catch (e) {
        //         console.log(`got an error in getter`, e);
        //         throw e;
        //       }
        //     },
        //   configurable: true
        // });

        // Object.defineProperty(stateVarObj, 'value', { get: () => Promise.resolve(getStateVar({ component, stateVariable })), configurable: true });

        if (arrayEntryPrefix !== undefined) {
            await this.initializeArrayEntryStateVariable({
                stateVarObj,
                arrayStateVariable,
                arrayEntryPrefix,
                component,
                stateVariable,
            });
        } else if (stateVarObj.isArray) {
            await this.initializeArrayStateVariable({
                stateVarObj,
                component,
                stateVariable,
            });
        }

        if (stateVarObj.triggerActionOnChange) {
            let componentTriggers =
                this.stateVariableChangeTriggers[component.componentIdx];
            if (!componentTriggers) {
                componentTriggers = this.stateVariableChangeTriggers[
                    component.componentIdx
                ] = {};
            }
            componentTriggers[stateVariable] = {
                action: stateVarObj.triggerActionOnChange,
            };
        }
    }

    async checkForActionChaining({ component, stateVariables }) {
        if (!component) {
            return;
        }

        if (!stateVariables) {
            stateVariables = Object.keys(component.state);
        }

        for (let varName of stateVariables) {
            let stateVarObj = component.state[varName];

            if (stateVarObj.chainActionOnActionOfStateVariableTargets) {
                let chainInfo =
                    stateVarObj.chainActionOnActionOfStateVariableTargets;
                let targetIds = await stateVarObj.value;

                let originObj =
                    this.originsOfActionsChangedToActions[
                        component.componentIdx
                    ];

                let previousIds;
                if (originObj) {
                    previousIds = originObj[varName];
                }

                if (!previousIds) {
                    previousIds = [];
                }

                let newTargets = [];

                if (Array.isArray(targetIds)) {
                    newTargets = [...targetIds];
                    for (let id of newTargets) {
                        let indPrev = previousIds.indexOf(id);

                        if (indPrev === -1) {
                            // found a component/action that wasn't previously chained
                            let componentActionsChained =
                                this.actionsChangedToActions[id];
                            if (!componentActionsChained) {
                                componentActionsChained =
                                    this.actionsChangedToActions[id] = [];
                            }

                            componentActionsChained.push({
                                componentIdx: component.componentIdx,
                                actionName: chainInfo.triggeredAction,
                                stateVariableDefiningChain: varName,
                                args: {},
                            });
                        } else {
                            // target was already chained
                            // remove from previous names to indicate it should still be chained
                            previousIds.splice(indPrev, 1);
                        }
                    }
                }

                // if any ids are left in previousIds,
                // then they should no longer be chained
                for (let idToNoLongerChain of previousIds) {
                    let componentActionsChained =
                        this.actionsChangedToActions[idToNoLongerChain];
                    if (componentActionsChained) {
                        let newComponentActionsChained = [];

                        for (let chainedInfo of componentActionsChained) {
                            if (
                                chainedInfo.componentIdx !==
                                    component.componentIdx ||
                                chainedInfo.stateVariableDefiningChain !==
                                    varName
                            ) {
                                newComponentActionsChained.push(chainedInfo);
                            }
                        }

                        this.actionsChangedToActions[idToNoLongerChain] =
                            newComponentActionsChained;
                    }
                }

                if (newTargets.length > 0) {
                    if (!originObj) {
                        originObj = this.originsOfActionsChangedToActions[
                            component.componentIdx
                        ] = {};
                    }
                    originObj[varName] = newTargets;
                } else if (originObj) {
                    delete originObj[varName];

                    if (Object.keys(originObj).length === 0) {
                        delete this.originsOfActionsChangedToActions[
                            component.componentIdx
                        ];
                    }
                }
            }
        }
    }

    async initializeArrayEntryStateVariable({
        stateVarObj,
        arrayStateVariable,
        arrayEntryPrefix,
        component,
        stateVariable,
    }) {
        // This function used for initializing array entry variables
        // (not the original array variable)
        // It adds many attributes to state variables corresponding to
        // array entries, including
        // - arrayStateVariable: the name of the array for which this is an entry
        // - arrayKeys: an array of the key(s) that constitute this entry
        // - markStale: function from array state variable
        // - freshnessInfo: object from array state variable
        // - getValueFromArrayValues: function used to get this entry's value
        // - isLocation: array entries are locations if the array state variable is
        //   (See expanation of location in fixLocation state variable of BaseComponent.js)

        stateVarObj.isArrayEntry = true;

        stateVarObj.arrayStateVariable = arrayStateVariable;
        let arrayStateVarObj = component.state[arrayStateVariable];
        stateVarObj.definition = arrayStateVarObj.definition;
        stateVarObj.inverseDefinition = arrayStateVarObj.inverseDefinition;
        stateVarObj.markStale = arrayStateVarObj.markStale;
        stateVarObj.freshnessInfo = arrayStateVarObj.freshnessInfo;
        stateVarObj.getPreviousDependencyValuesForMarkStale =
            arrayStateVarObj.getPreviousDependencyValuesForMarkStale;
        stateVarObj.provideEssentialValuesInDefinition =
            arrayStateVarObj.provideEssentialValuesInDefinition;
        stateVarObj.providePreviousValuesInDefinition =
            arrayStateVarObj.providePreviousValuesInDefinition;
        stateVarObj.isLocation = arrayStateVarObj.isLocation;

        stateVarObj.numDimensions =
            arrayStateVarObj.returnEntryDimensions(arrayEntryPrefix);
        stateVarObj.entryPrefix = arrayEntryPrefix;
        stateVarObj.varEnding = stateVariable.slice(arrayEntryPrefix.length);

        if (arrayStateVarObj.createWorkspace) {
            stateVarObj.createWorkspace = true;
            stateVarObj.workspace = arrayStateVarObj.workspace;
        }

        if (arrayStateVarObj.basedOnArrayKeyStateVariables) {
            stateVarObj.basedOnArrayKeyStateVariables = true;
        }

        // if any of the additional state variables defined are arrays,
        // (which should be all of them)
        // transform to their array entry
        if (arrayStateVarObj.additionalStateVariablesDefined) {
            stateVarObj.additionalStateVariablesDefined = [];

            let entryPrefixInd =
                arrayStateVarObj.entryPrefixes.indexOf(arrayEntryPrefix);

            for (let varName of arrayStateVarObj.additionalStateVariablesDefined) {
                let sObj = component.state[varName];

                if (sObj.isArray) {
                    // find the same array entry prefix in the other array state variable
                    let newArrayEntryPrefix =
                        sObj.entryPrefixes[entryPrefixInd];
                    let arrayEntryVarName =
                        newArrayEntryPrefix + stateVarObj.varEnding;

                    stateVarObj.additionalStateVariablesDefined.push(
                        arrayEntryVarName,
                    );
                } else {
                    stateVarObj.additionalStateVariablesDefined.push(varName);
                }
            }
        }

        if (arrayStateVarObj.shadowingInstructions) {
            stateVarObj.shadowingInstructions = {};

            // See description of returnWrappingComponents in initializeArrayStateVariable, below.
            stateVarObj.wrappingComponents =
                arrayStateVarObj.shadowingInstructions.returnWrappingComponents(
                    arrayEntryPrefix,
                );

            if (arrayStateVarObj.shadowingInstructions.attributesToShadow) {
                stateVarObj.shadowingInstructions.attributesToShadow =
                    arrayStateVarObj.shadowingInstructions.attributesToShadow;
            }

            if (arrayStateVarObj.shadowingInstructions.createComponentOfType) {
                let entryPrefixInd =
                    arrayStateVarObj.entryPrefixes.indexOf(arrayEntryPrefix);
                if (
                    arrayStateVarObj.shadowingInstructions
                        .createComponentOfType[entryPrefixInd]
                ) {
                    stateVarObj.shadowingInstructions.createComponentOfType = [
                        arrayStateVarObj.shadowingInstructions
                            .createComponentOfType[entryPrefixInd],
                    ];
                }
            }
        }

        // Each arrayEntry state variable will have a function getValueFromArrayValue
        // that will be used to retrieve the actual value of the components
        // specified by this entry from the whole array stored in arrayValues
        // Note: getValueFromArrayValues assumes that arrayValues has been populated
        if (arrayStateVarObj.getEntryValues) {
            // the function getEntryValues must have been overwritten by the class
            // so use this function instead
            stateVarObj.getValueFromArrayValues = async function () {
                return await arrayStateVarObj.getEntryValues({
                    varName: stateVariable,
                });
            };
        } else {
            // getValueFromArrayValues returns an array of the values
            // that correspond to the arrayKeys of this entry state variable
            // (returning a scalar instead if it is just a single value)
            // It uses the function getArrayValue, which gets the values
            // from arrayValues of the corresponding array state variable
            stateVarObj.getValueFromArrayValues = async function () {
                let arrayKeys = await stateVarObj.arrayKeys;
                if (arrayKeys.length === 0) {
                    return;
                }
                let value = [];
                for (let arrayKey of arrayKeys) {
                    value.push(arrayStateVarObj.getArrayValue({ arrayKey }));
                }
                if (value.length === 1) {
                    return value[0];
                } else {
                    return value;
                }
            };
        }

        stateVarObj.arraySizeStateVariable =
            arrayStateVarObj.arraySizeStateVariable;

        stateVarObj._arrayKeys = [];
        stateVarObj._unflattenedArrayKeys = [];

        Object.defineProperty(stateVarObj, "arrayKeys", {
            get: function () {
                return (async () => {
                    // first evaluate arraySize so _arrayKeys is recalculated
                    // in case arraySize change
                    await arrayStateVarObj.arraySize;
                    return stateVarObj._arrayKeys;
                })();
            },
        });

        Object.defineProperty(stateVarObj, "unflattenedArrayKeys", {
            get: function () {
                return (async () => {
                    // first evaluate arraySize so _unflattenedArrayKeys is recalculated
                    // in case arraySize change
                    await arrayStateVarObj.arraySize;
                    return stateVarObj._unflattenedArrayKeys;
                })();
            },
        });

        if (
            component.state[stateVarObj.arraySizeStateVariable]
                .initiallyResolved
        ) {
            let arraySize = await arrayStateVarObj.arraySize;
            let arrayKeys = arrayStateVarObj.getArrayKeysFromVarName({
                arrayEntryPrefix: stateVarObj.entryPrefix,
                varEnding: stateVarObj.varEnding,
                arraySize,
                numDimensions: arrayStateVarObj.numDimensions,
            });

            stateVarObj._unflattenedArrayKeys = arrayKeys;
            stateVarObj._arrayKeys = flattenDeep(arrayKeys);

            // for each arrayKey, add this entry name to the array's list variables
            let varNamesIncluding = arrayStateVarObj.varNamesIncludingArrayKeys;
            for (let arrayKey of stateVarObj._arrayKeys) {
                if (!varNamesIncluding[arrayKey]) {
                    varNamesIncluding[arrayKey] = [];
                }
                varNamesIncluding[arrayKey].push(stateVariable);
            }
        }

        arrayStateVarObj.arrayEntryNames.push(stateVariable);

        Object.defineProperty(stateVarObj, "arraySize", {
            get: () => arrayStateVarObj.arraySize,
        });

        // TODO: delete since arrayEntrySize isn't currently used?
        Object.defineProperty(stateVarObj, "arrayEntrySize", {
            get: function () {
                return (async () => {
                    // assume array is rectangular, so just look at first subarray of each dimension
                    let unflattenedArrayKeys =
                        await stateVarObj.unflattenedArrayKeys;
                    let arrayEntrySize = [];
                    let subArray = [unflattenedArrayKeys];
                    for (let i = 0; i < stateVarObj.numDimensions; i++) {
                        subArray = subArray[0];
                        arrayEntrySize.push(subArray.length);
                    }
                    arrayEntrySize.reverse(); // so starts with inner dimension
                    return arrayEntrySize;
                })();
            },
        });

        if (arrayStateVarObj.stateVariablesDeterminingDependencies) {
            if (!stateVarObj.stateVariablesDeterminingDependencies) {
                stateVarObj.stateVariablesDeterminingDependencies = [];
            }

            for (let varName of arrayStateVarObj.stateVariablesDeterminingDependencies) {
                if (
                    !stateVarObj.stateVariablesDeterminingDependencies.includes(
                        varName,
                    )
                ) {
                    stateVarObj.stateVariablesDeterminingDependencies.push(
                        varName,
                    );
                }
            }
        }

        // add a returnDependencies function based on the array returnDependencies
        let arrayReturnDependencies =
            arrayStateVarObj.returnDependencies.bind(arrayStateVarObj);
        stateVarObj.returnDependencies = async function (args) {
            // add array size to argument of return dependencies
            args.arraySize = await stateVarObj.arraySize;
            args.arrayKeys = await stateVarObj.arrayKeys;
            let dependencies = await arrayReturnDependencies(args);

            // We keep track of how many names were defined when we calculate dependencies
            // If this number changes, it should be treated as dependencies changing
            // so that we recalculate the value of the arrayEntry variable
            // TODO: we are communicating this to updateDependencies by adding
            // an attribute to the arguments?  Is there a better way of doing it.
            // Didn't want to add to the return value, as that would add complexity
            // to how we normally define returnDependencies
            // We could change returnDependencies to output an object.
            // That would probably be cleaner.
            let numNames = Object.keys(
                arrayStateVarObj.dependencyNames.namesByKey,
            ).length;
            if (stateVarObj.numberNamesInPreviousReturnDep !== numNames) {
                args.changedDependency = true;
            }
            stateVarObj.numberNamesInPreviousReturnDep = numNames;

            return dependencies;
        };
    }

    async initializeArrayStateVariable({
        stateVarObj,
        component,
        stateVariable,
    }) {
        // This function used for initializing original array variables
        // (not array entry variables)

        // Arrays values are stored in a (possibly-multidimensional) array
        // called arrayValues.  However, so that core doesn't have to deal
        // with special cases for multiple dimensions, array values are typically
        // referenced with an arrayKey, which is a single string that corresponds
        // to a single entry in the array.
        // For one dimension, index is an integer and arrayKey is its string representation
        // For multiple dimensions, index is an array of integers, e.g. [i,j,k]
        // and arrayKey is its string representation, i.e., "i,j,k"

        // The function adds attributes to array state variables, including
        // - arrayValues: the array of the current values of the array
        //   (i.e., based on index rather than arrayKey)
        //   arrayValues is used rather than value given that value is
        //   sometimes deleted and replaced by a getter.  arrayValues is
        //   never deleted, but entries are marked as stale using freshnessInfo
        // - freshnessInfo: this object can be used to track information about the
        //   freshness of the array entries or other array features, such as size.
        //   freshnessInfo is prepopulated with
        //     - a freshByKey object for tracking by key
        //     - a freshArraySize for tracking array size
        //   To take advantage of this object, a component can read and modify
        //   freshnessInfo (as core will pass it in as an argument) in
        //   - the state variable's definition function
        //     (to short circuit calculation of something that is already fresh and/or
        //     to indicate what is now fresh)
        //   - the state variable's optional markStale function
        //     (to indicate what is no longer fresh)
        // - keyToIndex: maps arrayKey (single string) to (multi-)index
        // - indexToKey: maps (multi-)index to arrayKey
        // - setArrayValue: sets value in arrayValues corresponding to arrayKey
        // - getArrayValue: gets value in arrayValues corresponding to arrayKey
        // - getArrayKeysFromVarName: returns array of the arrayKeys that correspond
        //   to a given variable name of an array entry
        // - arrayVarNameFromArrayKey: returns the variable name of an array entry
        //   that contains a given array key (if there are many, just return one)
        //   This variable may not yet be created.

        let core = this;

        stateVarObj.arrayValues = [];

        if (stateVarObj.numDimensions === undefined) {
            stateVarObj.numDimensions = 1;
        }

        let entryPrefixes = stateVarObj.entryPrefixes;

        if (!entryPrefixes) {
            entryPrefixes = stateVarObj.entryPrefixes = [stateVariable];
        }

        if (!component.arrayEntryPrefixes) {
            component.arrayEntryPrefixes = {};
        }
        for (let prefix of entryPrefixes) {
            component.arrayEntryPrefixes[prefix] = stateVariable;
        }

        if (stateVarObj.numDimensions > 1) {
            // for multiple dimensions, have to convert from arrayKey
            // to multi-index when getting or setting
            // Note: we don't check that arrayKey has the appropriate number of dimensions
            // If it has fewer dimensions than numDimensions, it will set the slice
            // to the given value
            // (useful, for example, to set entire rows)
            // If it has more dimensinos than numDimensions, behavior isn't determined
            // (it should throw an error, assuming the array entries aren't arrays)
            stateVarObj.keyToIndex = (key) =>
                key.split(",").map((x) => Number(x));
            stateVarObj.setArrayValue = function ({
                value,
                arrayKey,
                arraySize,
                arrayValues = stateVarObj.arrayValues,
            }) {
                let index = stateVarObj.keyToIndex(arrayKey);
                let numDimensionsInArrayKey = index.length;
                if (!numDimensionsInArrayKey > stateVarObj.numDimensions) {
                    core.errorWarnings.warnings.push({
                        message:
                            "Cannot set array value.  Number of dimensions is too large.",
                        level: 2,
                        position: component.position,
                        sourceDoc: component.sourceDoc,
                    });
                    core.newErrorWarning = true;
                    return { nFailures: 1 };
                }
                let arrayValuesDrillDown = arrayValues;
                let arraySizeDrillDown = arraySize;
                for (let indComponent of index.slice(0, index.length - 1)) {
                    if (
                        indComponent >= 0 &&
                        indComponent < arraySizeDrillDown[0]
                    ) {
                        if (!arrayValuesDrillDown[indComponent]) {
                            arrayValuesDrillDown[indComponent] = [];
                        }
                        arrayValuesDrillDown =
                            arrayValuesDrillDown[indComponent];
                        arraySizeDrillDown = arraySizeDrillDown.slice(1);
                    } else {
                        core.errorWarnings.warnings.push({
                            message: "ignore setting array value out of bounds",
                            level: 2,
                            position: component.position,
                            sourceDoc: component.sourceDoc,
                        });
                        core.newErrorWarning = true;
                        return { nFailures: 1 };
                    }
                }

                let nFailures = 0;

                if (numDimensionsInArrayKey < stateVarObj.numDimensions) {
                    // if dimensions from arrayKey is less than number of dimensions
                    // then attempt to get additional dimensions from
                    // array indices of value

                    let setArrayValuesPiece = function (
                        desiredValue,
                        arrayValuesPiece,
                        arraySizePiece,
                    ) {
                        // try to set value of entries of arrayValuePiece to entries of desiredValue
                        // given that size of arrayValuesPieces is arraySizePiece

                        if (!Array.isArray(desiredValue)) {
                            core.errorWarnings.warnings.push({
                                message:
                                    "ignoring array values with insufficient dimensions",
                                level: 2,
                                position: component.position,
                                sourceDoc: component.sourceDoc,
                            });
                            core.newErrorWarning = true;
                            return { nFailures: 1 };
                        }

                        let nFailuresSub = 0;

                        let currentSize = arraySizePiece[0];
                        if (desiredValue.length > currentSize) {
                            core.errorWarnings.warnings.push({
                                message: "ignoring array values of out bounds",
                                level: 2,
                                position: component.position,
                                sourceDoc: component.sourceDoc,
                            });
                            core.newErrorWarning = true;
                            nFailuresSub += desiredValue.length - currentSize;
                            desiredValue = desiredValue.slice(0, currentSize);
                        }

                        if (arraySizePiece.length === 1) {
                            // down to last dimension
                            for (let [ind, val] of desiredValue.entries()) {
                                arrayValuesPiece[ind] = val;
                            }
                        } else {
                            for (let [ind, val] of desiredValue.entries()) {
                                if (!arrayValuesPiece[ind]) {
                                    arrayValuesPiece = [];
                                }
                                let result = setArrayValuesPiece(
                                    val,
                                    arrayValuesPiece[ind],
                                    arraySizePiece[ind],
                                );
                                nFailuresSub += result.nFailures;
                            }
                        }

                        return { nFailures: nFailuresSub };
                    };

                    let result = setArrayValuesPiece(
                        value,
                        arrayValuesDrillDown,
                        arraySizeDrillDown,
                    );
                    nFailures += result.nFailures;
                } else {
                    arrayValuesDrillDown[index[index.length - 1]] = value;
                }

                return { nFailures };
            };
            stateVarObj.getArrayValue = function ({
                arrayKey,
                arrayValues = stateVarObj.arrayValues,
            }) {
                let index = stateVarObj.keyToIndex(arrayKey);
                let aVals = arrayValues;
                for (let indComponent of index.slice(0, index.length - 1)) {
                    aVals = aVals[indComponent];
                    if (!aVals) {
                        return undefined;
                    }
                }
                return aVals[index[index.length - 1]];
            };

            if (!stateVarObj.getAllArrayKeys) {
                stateVarObj.getAllArrayKeys = function (
                    arraySize,
                    flatten = true,
                    desiredSize,
                ) {
                    function prependToAllKeys(keys, newStuff) {
                        for (let [ind, key] of keys.entries()) {
                            if (Array.isArray(key)) {
                                prependToAllKeys(key, newStuff);
                            } else {
                                keys[ind] = newStuff + "," + key;
                            }
                        }
                    }

                    function getAllArrayKeysSub(subArraySize) {
                        if (subArraySize.length === 1) {
                            // array of numbers from 0 to subArraySize[0], cast to strings
                            return Array.from(Array(subArraySize[0]), (_, i) =>
                                String(i),
                            );
                        } else {
                            let currentSize = subArraySize[0];
                            let subSubKeys = getAllArrayKeysSub(
                                subArraySize.slice(1),
                            );
                            let subKeys = [];
                            for (let ind = 0; ind < currentSize; ind++) {
                                if (flatten) {
                                    subKeys.push(
                                        ...subSubKeys.map((x) => ind + "," + x),
                                    );
                                } else {
                                    let newSubSubKeys = deepClone(subSubKeys);
                                    prependToAllKeys(newSubSubKeys, ind);
                                    subKeys.push(newSubSubKeys);
                                }
                            }
                            return subKeys;
                        }
                    }

                    if (desiredSize) {
                        if (desiredSize.length === 0) {
                            return [];
                        } else {
                            return getAllArrayKeysSub(desiredSize);
                        }
                    } else if (!arraySize || arraySize.length === 0) {
                        return [];
                    } else {
                        return getAllArrayKeysSub(arraySize);
                    }
                };
            }

            if (!stateVarObj.arrayVarNameFromArrayKey) {
                stateVarObj.arrayVarNameFromArrayKey = function (arrayKey) {
                    return (
                        entryPrefixes[0] +
                        arrayKey
                            .split(",")
                            .map((x) => Number(x) + 1)
                            .join("_")
                    );
                };
            }

            // arrayVarNameFromPropIndex is a function that calculates the name
            // an array entry state variable that corresponds to the specified propIndex.
            // It is a consequence of retrofitting the ability to index an array (e.g., $a.b[1])
            // onto a system that was designed with just array entry variables (e..g, $a.b1).
            // arrayVarNameFromPropIndex can be specified in the definition of the array state variable.
            // Since numDimensions > 1 here, the default arrayVarNameFromPropIndex
            // is to turn $a.b[1][2][3] to $a.p1_2_3,
            // where "p" is the first entry prefix of the array "b".

            // TODO: if we redesign arrays to be based on indices (or even slices),
            // then arrayVarNameFromPropIndex will be obsolete.
            if (!stateVarObj.arrayVarNameFromPropIndex) {
                stateVarObj.arrayVarNameFromPropIndex =
                    returnDefaultArrayVarNameFromPropIndex(
                        stateVarObj.numDimensions,
                        entryPrefixes[0],
                    );
            }

            stateVarObj.adjustArrayToNewArraySize = async function () {
                function resizeSubArray(subArray, subArraySize) {
                    subArray.length = subArraySize[0];

                    if (subArraySize.length > 1) {
                        let subSubArraySize = subArraySize.slice(1);
                        for (let [ind, subSubArray] of subArray.entries()) {
                            if (!subSubArray) {
                                // add in any empty entries
                                subSubArray = subArray[ind] = [];
                            }
                            resizeSubArray(subSubArray, subSubArraySize);
                        }
                    }
                }

                let arraySize = await stateVarObj.arraySize;
                resizeSubArray(stateVarObj.arrayValues, arraySize);
            };
        } else {
            // have just one dimension
            stateVarObj.keyToIndex = (key) => Number(key);
            stateVarObj.setArrayValue = function ({
                value,
                arrayKey,
                arraySize,
                arrayValues = stateVarObj.arrayValues,
            }) {
                let ind = stateVarObj.keyToIndex(arrayKey);
                if (ind >= 0 && ind < arraySize[0]) {
                    arrayValues[ind] = value;
                    return { nFailures: 0 };
                } else {
                    core.errorWarnings.warnings.push({
                        message: `Ignoring setting array values out of bounds: ${arrayKey} of ${stateVariable}`,
                        level: 2,
                        position: component.position,
                        sourceDoc: component.sourceDoc,
                    });
                    core.newErrorWarning = true;
                    return { nFailures: 1 };
                }
            };
            stateVarObj.getArrayValue = function ({
                arrayKey,
                arrayValues = stateVarObj.arrayValues,
            }) {
                return arrayValues[arrayKey];
            };

            if (!stateVarObj.getAllArrayKeys) {
                stateVarObj.getAllArrayKeys = function (
                    arraySize,
                    flatten,
                    desiredSize,
                ) {
                    if (desiredSize) {
                        if (desiredSize.length === 0) {
                            return [];
                        } else {
                            // array of numbers from 0 to desiredSize[0], cast to strings
                            return Array.from(Array(desiredSize[0]), (_, i) =>
                                String(i),
                            );
                        }
                    } else if (!arraySize || arraySize.length === 0) {
                        return [];
                    } else {
                        // array of numbers from 0 to arraySize[0], cast to strings
                        return Array.from(Array(arraySize[0]), (_, i) =>
                            String(i),
                        );
                    }
                };
            }

            if (!stateVarObj.arrayVarNameFromArrayKey) {
                stateVarObj.arrayVarNameFromArrayKey = function (arrayKey) {
                    return entryPrefixes[0] + String(Number(arrayKey) + 1);
                };
            }

            // arrayVarNameFromPropIndex is a function that calculates the name
            // an array entry state variable that corresponds to the specified propIndex.
            // It is a consequence of retrofitting the ability to index an array (e.g., $a.b[1])
            // onto a system that was designed with just array entry variables (e..g, $a.b1).
            // arrayVarNameFromPropIndex can be specified in the definition of the array state variable.
            // Since numDimensions = 1 here, the default arrayVarNameFromPropIndex
            // is to turn $a.b[1] to $a.p1,
            // where "p" is the first entry prefix of the array "b".

            // TODO: if we redesign arrays to be based on indices (or even slices),
            // then arrayVarNameFromPropIndex will be obsolete.
            if (!stateVarObj.arrayVarNameFromPropIndex) {
                stateVarObj.arrayVarNameFromPropIndex =
                    returnDefaultArrayVarNameFromPropIndex(1, entryPrefixes[0]);
            }

            stateVarObj.adjustArrayToNewArraySize = async function () {
                // console.log(`adjust array ${stateVariable} of ${component.componentIdx} to new array size: ${stateVarObj.arraySize[0]}`);
                let arraySize = await stateVarObj.arraySize;
                stateVarObj.arrayValues.length = arraySize[0];
            };
        }

        if (!stateVarObj.getArrayKeysFromVarName) {
            stateVarObj.getArrayKeysFromVarName =
                returnDefaultGetArrayKeysFromVarName(stateVarObj.numDimensions);
        }

        // converting from index to key is the same for single and multiple
        // dimensions, as we just want the string representation
        stateVarObj.indexToKey = (index) => String(index);

        if (!stateVarObj.returnEntryDimensions) {
            stateVarObj.returnEntryDimensions = () => 0;
        }

        if (stateVarObj.shadowingInstructions) {
            // returnWrappingComponents is a function that returns the wrapping components for
            // - the whole array (if called with no arguments), or
            // - an array entry (if called with an array entry prefix as the argument)
            // It returns wrappingComponents, which is an array of arrays.
            // Each inner array corresponds to a dimension of the array,
            // starting with the inner dimension,
            // so that wrappingComponents[numDimensions-1], if it exists,
            // corresponds to the wrapping of the entire array (or array entry),
            // leading to the return of a single component.
            // Each element of the inner array indicates a wrapping of the corresponding dimension,
            // and they are applied in reverse order.
            // Each element can be either:
            // - a string corresponding to the component type used to wrap
            // - an object with fields:
            //   - componentType: a string corresponding to the component type used to wrap
            //   - isAttributeNamed: a string giving the name of the attribute that this
            //     wrapping component should be for the wrapping component immediately preceding
            //     (no effect if isAttributeNamed appears in the first wrapping component)
            // Unless the subsequent wrapping component has been designated isAttributeNamed,
            // each wrapping component takes as children either
            // - the subsequent wrapping component if it exists,
            // - else the original array components.
            //
            // TODO: wrapping components (like most array features) was designed before
            // we had array indexing such as $a.b[1].
            // Hence it is based on array entries such as $a.b1, where b is the "prefix".
            // $a.b[1] has to be converted to something like $a.b1
            // before calculating wrapping components.
            // We should rework wrapping components (and other array features)
            // to make array indexing (maybe even including slices) be the basis.

            if (!stateVarObj.shadowingInstructions.returnWrappingComponents) {
                stateVarObj.shadowingInstructions.returnWrappingComponents = (
                    prefix,
                ) => [];
            }
            stateVarObj.wrappingComponents =
                stateVarObj.shadowingInstructions.returnWrappingComponents();
        }

        stateVarObj.usedDefaultByArrayKey = {};

        stateVarObj.arrayEntryNames = [];
        stateVarObj.varNamesIncludingArrayKeys = {};

        let allStateVariablesAffected = [stateVariable];
        if (stateVarObj.additionalStateVariablesDefined) {
            allStateVariablesAffected.push(
                ...stateVarObj.additionalStateVariablesDefined,
            );
        }

        // create the definition, etc., functions for the array state variable

        // create returnDependencies function from returnArrayDependenciesByKey
        stateVarObj.returnDependencies = async function (args) {
            // console.log(`return dependencies for array ${stateVariable} of ${component.componentIdx}`)
            // console.log(JSON.parse(JSON.stringify(args)));

            args.arraySize = await stateVarObj.arraySize;

            // delete the internally added dependencies from args.stateValues
            for (let key in args.stateValues) {
                if (key.slice(0, 8) === "__array_") {
                    delete args.stateValues[key];
                }
            }

            if (args.arrayKeys === undefined) {
                args.arrayKeys = stateVarObj.getAllArrayKeys(args.arraySize);
            }

            // link all dependencyNames of additionalStateVariablesDefined
            // to the same object, as they will share the same freshnessinfo
            // TODO: a better idea?  This seems like it could lead to confusion.
            if (!stateVarObj.dependencyNames) {
                stateVarObj.dependencyNames = {
                    namesByKey: {},
                    keysByName: {},
                    global: [],
                };
                if (stateVarObj.additionalStateVariablesDefined) {
                    for (let vName of stateVarObj.additionalStateVariablesDefined) {
                        component.state[vName].dependencyNames =
                            stateVarObj.dependencyNames;
                    }
                }
            }

            let dependencies = {};

            if (
                stateVarObj.basedOnArrayKeyStateVariables &&
                args.arrayKeys.length > 1
            ) {
                for (let arrayKey of args.arrayKeys) {
                    for (let vName of allStateVariablesAffected) {
                        let sObj = component.state[vName];
                        dependencies[vName + "_" + arrayKey] = {
                            dependencyType: "stateVariable",
                            variableName:
                                sObj.arrayVarNameFromArrayKey(arrayKey),
                        };
                    }
                }
            } else {
                let arrayDependencies =
                    stateVarObj.returnArrayDependenciesByKey(args);

                if (arrayDependencies.globalDependencies) {
                    stateVarObj.dependencyNames.global = Object.keys(
                        arrayDependencies.globalDependencies,
                    );
                    Object.assign(
                        dependencies,
                        arrayDependencies.globalDependencies,
                    );
                }

                if (!arrayDependencies.dependenciesByKey) {
                    arrayDependencies.dependenciesByKey = {};
                }

                for (let arrayKey of args.arrayKeys) {
                    // namesByKey also functions to indicate that dependencies
                    // have been returned for that arrayKey

                    // If had additional nameByKey, it should be treated as dependencies changing
                    // so that we recalculate the value of the array variable
                    // TODO: we are communicating this to updateDependencies by adding
                    // an attribute to the arguments?  Is there a better way of doing it.
                    // Didn't want to add to the return value, as that would add complexity
                    // to how we normally define returnDependencies
                    // We could change returnDependencies to output an object.
                    // That would probably be cleaner.
                    if (!(arrayKey in stateVarObj.dependencyNames.namesByKey)) {
                        args.changedDependency = true;
                    }
                    stateVarObj.dependencyNames.namesByKey[arrayKey] = {};
                    for (let depName in arrayDependencies.dependenciesByKey[
                        arrayKey
                    ]) {
                        let extendedDepName = "__" + arrayKey + "_" + depName;
                        dependencies[extendedDepName] =
                            arrayDependencies.dependenciesByKey[arrayKey][
                                depName
                            ];
                        stateVarObj.dependencyNames.namesByKey[arrayKey][
                            depName
                        ] = extendedDepName;
                        if (
                            !stateVarObj.dependencyNames.keysByName[
                                extendedDepName
                            ]
                        ) {
                            stateVarObj.dependencyNames.keysByName[
                                extendedDepName
                            ] = [];
                        }
                        if (
                            !stateVarObj.dependencyNames.keysByName[
                                extendedDepName
                            ].includes(arrayKey)
                        ) {
                            stateVarObj.dependencyNames.keysByName[
                                extendedDepName
                            ].push(arrayKey);
                        }
                    }
                }

                // to tie into making sure array size is a dependency, below
                stateVarObj.dependencyNames.global.push("__array_size");
            }

            // make sure array size is a dependency
            dependencies.__array_size = {
                dependencyType: "stateVariable",
                variableName: stateVarObj.arraySizeStateVariable,
            };

            // console.log(`resulting dependencies for ${stateVariable} of ${component.componentIdx}`)
            // console.log(dependencies)
            return dependencies;
        };

        stateVarObj.getCurrentFreshness = function ({
            freshnessInfo,
            arrayKeys,
            arraySize,
        }) {
            // console.log(`getCurrentFreshness for array ${stateVariable} of ${component.componentIdx}`)
            // console.log(arrayKeys, arraySize);
            // console.log(JSON.parse(JSON.stringify(freshnessInfo)))

            if (arrayKeys === undefined) {
                arrayKeys = stateVarObj.getAllArrayKeys(arraySize);
            }

            let freshByKey = freshnessInfo.freshByKey;

            let numberFresh = freshnessInfo.freshArraySize ? 1 : 0;
            for (let arrayKey of arrayKeys) {
                if (freshByKey[arrayKey]) {
                    numberFresh += 1;
                }
            }

            if (numberFresh > 0) {
                if (numberFresh === arrayKeys.length + 1) {
                    return { fresh: { [stateVariable]: true } };
                } else {
                    return { partiallyFresh: { [stateVariable]: numberFresh } };
                }
            } else {
                return { fresh: { [stateVariable]: false } };
            }
        };

        stateVarObj.markStale = function ({
            freshnessInfo,
            changes,
            arrayKeys,
            arraySize,
        }) {
            // console.log(`markStale for array ${stateVariable} of ${component.componentIdx}`)
            // console.log(changes, arrayKeys, arraySize);
            // console.log(JSON.parse(JSON.stringify(freshnessInfo)))

            let result = {};

            if (arrayKeys === undefined) {
                arrayKeys = stateVarObj.getAllArrayKeys(arraySize);
            }

            if (stateVarObj.markStaleByKey) {
                result = stateVarObj.markStaleByKey({ arrayKeys, changes });
            }

            let freshByKey = freshnessInfo.freshByKey;

            if (changes.__array_size) {
                freshnessInfo.freshArraySize = false;
                // everything is stale
                freshnessInfo.freshByKey = {};
                result.fresh = { [stateVariable]: false };
                return result;
            }

            if (Object.keys(freshByKey).length === 0) {
                // everything is stale, except possibly array size
                // (check for nothing fresh as a shortcut, as mark stale could
                // be called repeated if size doesn't change, given that it's partially fresh)
                freshnessInfo.freshByKey = {};
                if (freshnessInfo.freshArraySize) {
                    result.partiallyFresh = { [stateVariable]: 1 };
                    return result;
                } else {
                    result.fresh = { [stateVariable]: false };
                    return result;
                }
            }

            for (let changeName in changes) {
                if (stateVarObj.dependencyNames.global.includes(changeName)) {
                    // everything is stale, except possible array size
                    freshnessInfo.freshByKey = {};
                    if (freshnessInfo.freshArraySize) {
                        result.partiallyFresh = { [stateVariable]: 1 };
                        return result;
                    } else {
                        result.fresh = { [stateVariable]: false };
                        return result;
                    }
                }

                if (
                    stateVarObj.basedOnArrayKeyStateVariables &&
                    arrayKeys.length > 1
                ) {
                    delete freshByKey[changeName];
                } else {
                    for (let key of stateVarObj.dependencyNames.keysByName[
                        changeName
                    ]) {
                        delete freshByKey[key];
                    }
                }
            }

            // check if the array keys requested are fresh
            let numberFresh = freshnessInfo.freshArraySize ? 1 : 0;
            for (let arrayKey of arrayKeys) {
                if (freshByKey[arrayKey]) {
                    numberFresh += 1;
                }
            }

            // console.log(`ending freshness`)
            // console.log(JSON.parse(JSON.stringify(freshnessInfo)))

            if (numberFresh > 0) {
                if (numberFresh === arrayKeys.length + 1) {
                    result.fresh = { [stateVariable]: true };
                    return result;
                } else {
                    result.partiallyFresh = { [stateVariable]: numberFresh };
                    return result;
                }
            } else {
                result.fresh = { [stateVariable]: false };
                return result;
            }
        };

        stateVarObj.freshenOnNoChanges = function ({
            arrayKeys,
            freshnessInfo,
            arraySize,
        }) {
            // console.log(`freshenOnNoChanges for ${stateVariable} of ${component.componentIdx}`)
            let freshByKey = freshnessInfo.freshByKey;

            if (arrayKeys === undefined) {
                arrayKeys = stateVarObj.getAllArrayKeys(arraySize);
            }

            for (let arrayKey of arrayKeys) {
                freshByKey[arrayKey] = true;
            }
        };

        function extractArrayDependencies(
            dependencyValues,
            arrayKeys,
            usedDefault,
        ) {
            // console.log(`extract array dependencies`, dependencyValues, arrayKeys, usedDefault)
            // console.log(JSON.parse(JSON.stringify(arrayKeys)))

            let globalDependencyValues = {};
            let globalUsedDefault = {};
            for (let dependencyName of stateVarObj.dependencyNames.global) {
                globalDependencyValues[dependencyName] =
                    dependencyValues[dependencyName];
                globalUsedDefault[dependencyName] = usedDefault[dependencyName];
            }

            let dependencyValuesByKey = {};
            let usedDefaultByKey = {};
            let foundAllDependencyValuesForKey = {};
            for (let arrayKey of arrayKeys) {
                dependencyValuesByKey[arrayKey] = {};
                usedDefaultByKey[arrayKey] = {};
                if (arrayKey in stateVarObj.dependencyNames.namesByKey) {
                    foundAllDependencyValuesForKey[arrayKey] = true;
                    for (let dependencyName in stateVarObj.dependencyNames
                        .namesByKey[arrayKey]) {
                        let extendedDepName =
                            stateVarObj.dependencyNames.namesByKey[arrayKey][
                                dependencyName
                            ];
                        if (extendedDepName in dependencyValues) {
                            dependencyValuesByKey[arrayKey][dependencyName] =
                                dependencyValues[extendedDepName];
                            usedDefaultByKey[arrayKey][dependencyName] =
                                usedDefault[extendedDepName];
                        } else {
                            foundAllDependencyValuesForKey[arrayKey] = false;
                        }
                    }
                }
            }

            return {
                globalDependencyValues,
                globalUsedDefault,
                dependencyValuesByKey,
                usedDefaultByKey,
                foundAllDependencyValuesForKey,
            };
        }

        stateVarObj.definition = function (args) {
            // console.log(`definition in array ${stateVariable} of ${component.componentIdx}`)
            // console.log(JSON.parse(JSON.stringify(args)));
            // console.log(args.arrayKeys)
            // console.log(args.dependencyValues)

            if (args.arrayKeys === undefined) {
                args.arrayKeys = stateVarObj.getAllArrayKeys(args.arraySize);
            }

            if (
                stateVarObj.basedOnArrayKeyStateVariables &&
                args.arrayKeys.length > 1
            ) {
                // if based on array key state variables and have more than one array key
                // then must have calculated all the relevant array keys
                // when retrieving the dependency values
                // Hence there is nothing to do, as arrayValues has been populated
                // with all the requisite values

                return {};
            } else {
                let extractedDeps = extractArrayDependencies(
                    args.dependencyValues,
                    args.arrayKeys,
                    args.usedDefault,
                );
                let globalDependencyValues =
                    extractedDeps.globalDependencyValues;
                let globalUsedDefault = extractedDeps.globalUsedDefault;
                let dependencyValuesByKey = extractedDeps.dependencyValuesByKey;
                let usedDefaultByKey = extractedDeps.usedDefaultByKey;
                let foundAllDependencyValuesForKey =
                    extractedDeps.foundAllDependencyValuesForKey;

                delete args.dependencyValues;
                args.globalDependencyValues = globalDependencyValues;
                args.globalUsedDefault = globalUsedDefault;
                args.dependencyValuesByKey = dependencyValuesByKey;
                args.usedDefaultByKey = usedDefaultByKey;

                let arrayKeysToRecalculate = [];
                let freshByKey = args.freshnessInfo.freshByKey;
                for (let arrayKey of args.arrayKeys) {
                    // only recalculate if
                    // - arrayKey isn't fresh, and
                    // - found all dependency values for array key (i.e., have calculated dependencies for arrayKey)
                    if (
                        !freshByKey[arrayKey] &&
                        foundAllDependencyValuesForKey[arrayKey]
                    ) {
                        freshByKey[arrayKey] = true;
                        arrayKeysToRecalculate.push(arrayKey);
                    }
                }

                let result;
                if (arrayKeysToRecalculate.length === 0) {
                    // console.log(`nothing to recalculate`)
                    // console.log(`was going to recalculate`, args.arrayKeys)
                    // console.log(JSON.parse(JSON.stringify(args.freshnessInfo)))
                    // console.log(JSON.parse(JSON.stringify(stateVarObj.dependencyNames)))
                    result = {};
                } else {
                    args.arrayKeys = arrayKeysToRecalculate;

                    if (!stateVarObj.arrayDefinitionByKey) {
                        throw Error(
                            `For ${stateVariable} of ${component.componentType}, arrayDefinitionByKey must be a function`,
                        );
                    }

                    result = stateVarObj.arrayDefinitionByKey(args);

                    // in case definition returns additional array entries,
                    // mark all array keys received as fresh as well
                    if (result.setValue && result.setValue[stateVariable]) {
                        for (let arrayKey in result.setValue[stateVariable]) {
                            freshByKey[arrayKey] = true;
                        }
                    }
                    if (
                        result.useEssentialOrDefaultValue &&
                        result.useEssentialOrDefaultValue[stateVariable]
                    ) {
                        for (let arrayKey in result.useEssentialOrDefaultValue[
                            stateVariable
                        ]) {
                            freshByKey[arrayKey] = true;
                        }
                    }
                }

                if (!args.freshnessInfo.freshArraySize) {
                    if (args.changes.__array_size) {
                        result.arraySizeChanged = [stateVariable];
                        if (stateVarObj.additionalStateVariablesDefined) {
                            for (let varName of stateVarObj.additionalStateVariablesDefined) {
                                // do we have to check if it is array?
                                if (component.state[varName].isArray) {
                                    result.arraySizeChanged.push(varName);
                                }
                            }
                        }
                    }
                    args.freshnessInfo.freshArraySize = true;
                }

                // console.log(`result of array definition of ${stateVariable} of ${component.componentIdx}`)
                // console.log(JSON.parse(JSON.stringify(result)))
                // console.log(JSON.parse(JSON.stringify(args.freshnessInfo)))
                return result;
            }
        };

        stateVarObj.inverseDefinition = function (args) {
            // console.log(`inverse definition args for ${stateVariable}`)
            // console.log(args)

            if (!stateVarObj.inverseArrayDefinitionByKey) {
                return { success: false };
            }

            if (args.arrayKeys === undefined) {
                args.arrayKeys = stateVarObj.getAllArrayKeys(args.arraySize);
            }

            if (
                stateVarObj.basedOnArrayKeyStateVariables &&
                args.arrayKeys.length > 1
            ) {
                let instructions = [];

                for (let vName of allStateVariablesAffected) {
                    for (let key in args.desiredStateVariableValues[vName]) {
                        let depName = vName + "_" + key;
                        if (depName in args.dependencyValues) {
                            instructions.push({
                                setDependency: depName,
                                desiredValue:
                                    args.desiredStateVariableValues[vName][key],
                                treatAsInitialChange: args.initialChange,
                            });
                        }
                    }
                }

                return {
                    success: true,
                    instructions,
                };
            } else {
                let extractedDeps = extractArrayDependencies(
                    args.dependencyValues,
                    args.arrayKeys,
                    args.usedDefault,
                );
                let globalDependencyValues =
                    extractedDeps.globalDependencyValues;
                let globalUsedDefault = extractedDeps.globalUsedDefault;
                let dependencyValuesByKey = extractedDeps.dependencyValuesByKey;
                let usedDefaultByKey = extractedDeps.usedDefaultByKey;
                // let foundAllDependencyValuesForKey = extractedDeps.foundAllDependencyValuesForKey;

                delete args.dependencyValues;
                args.globalDependencyValues = globalDependencyValues;
                args.globalUsedDefault = globalUsedDefault;
                args.dependencyValuesByKey = dependencyValuesByKey;
                args.usedDefaultByKey = usedDefaultByKey;

                args.dependencyNamesByKey =
                    stateVarObj.dependencyNames.namesByKey;

                if (!stateVarObj.allowExtraArrayKeysInInverse) {
                    // by default, inverseArrayDefinitionByKey does not need to be
                    // programmed defensively against arrayKeys that don't exist
                    // as they are filtered out here.
                    // However, if allowExtraArrayKeysInInverse, then we skip this
                    // filtering to allow the possibility that the array size
                    // could be changed.
                    let newDesiredStateVariableValues = {};
                    for (let vName in args.desiredStateVariableValues) {
                        newDesiredStateVariableValues[vName] = {};
                        for (let key in args.desiredStateVariableValues[
                            vName
                        ]) {
                            if (args.arrayKeys.includes(key)) {
                                newDesiredStateVariableValues[vName][key] =
                                    args.desiredStateVariableValues[vName][key];
                            }
                        }
                    }
                    args.desiredStateVariableValues =
                        newDesiredStateVariableValues;
                }

                let result = stateVarObj.inverseArrayDefinitionByKey(args);
                // console.log(`result of inverse definition of array`)
                // console.log(JSON.parse(JSON.stringify(result)))
                return result;
            }
        };

        await this.createArraySizeStateVariable({
            stateVarObj,
            component,
            stateVariable,
        });

        stateVarObj.arraySizeStale = true;
        stateVarObj.previousArraySize = [];

        Object.defineProperty(stateVarObj, "arraySize", {
            get: function () {
                return (async () => {
                    if (
                        !component.state[stateVarObj.arraySizeStateVariable]
                            .initiallyResolved
                    ) {
                        return [];
                    }
                    if (stateVarObj.arraySizeStale) {
                        await stateVarObj.recalculateArraySizeDependentQuantities();
                    }
                    return await component.stateValues[
                        stateVarObj.arraySizeStateVariable
                    ];
                })();
            },
        });

        stateVarObj.recalculateArraySizeDependentQuantities =
            async function () {
                let newArraySize =
                    await component.stateValues[
                        stateVarObj.arraySizeStateVariable
                    ];
                if (
                    stateVarObj.previousArraySize.length !==
                        newArraySize.length ||
                    stateVarObj.previousArraySize.some(
                        (v, i) => v != newArraySize[i],
                    )
                ) {
                    stateVarObj.previousArraySize = [...newArraySize];
                    let varNamesIncluding =
                        (stateVarObj.varNamesIncludingArrayKeys = {});
                    for (let entryName of stateVarObj.arrayEntryNames) {
                        let entryStateVarObj = component.state[entryName];
                        let arrayKeys = stateVarObj.getArrayKeysFromVarName({
                            arrayEntryPrefix: entryStateVarObj.entryPrefix,
                            varEnding: entryStateVarObj.varEnding,
                            arraySize: newArraySize,
                            numDimensions: stateVarObj.numDimensions,
                        });
                        entryStateVarObj._unflattenedArrayKeys = arrayKeys;
                        entryStateVarObj._arrayKeys = flattenDeep(arrayKeys);

                        // for each arrayKey, add this entry name to the array's list variables
                        for (let arrayKey of entryStateVarObj._arrayKeys) {
                            if (!varNamesIncluding[arrayKey]) {
                                varNamesIncluding[arrayKey] = [];
                            }
                            varNamesIncluding[arrayKey].push(entryName);
                        }
                    }
                }
                stateVarObj.arraySizeStale = false;
            };

        // link all freshnessInfo of additionalStateVariablesDefined
        // to the same object, as they will share the same freshnessinfo
        // TODO: a better idea?  This seems like it could lead to confusion.
        if (!stateVarObj.freshnessInfo) {
            stateVarObj.freshnessInfo = { freshByKey: {} };
            if (stateVarObj.additionalStateVariablesDefined) {
                for (let vName of stateVarObj.additionalStateVariablesDefined) {
                    if (!component.state[vName]) {
                        component.state[vName] = {};
                    }
                    component.state[vName].freshnessInfo =
                        stateVarObj.freshnessInfo;
                }
            }
        }
    }

    async createArraySizeStateVariable({
        stateVarObj,
        component,
        stateVariable,
    }) {
        let allStateVariablesAffected = [stateVariable];
        if (stateVarObj.additionalStateVariablesDefined) {
            allStateVariablesAffected.push(
                ...stateVarObj.additionalStateVariablesDefined,
            );
        }
        allStateVariablesAffected.sort();

        let arraySizeStateVar =
            `__array_size_` + allStateVariablesAffected.join("_");
        stateVarObj.arraySizeStateVariable = arraySizeStateVar;

        let originalStateVariablesDeterminingDependencies;
        let originalAdditionalStateVariablesDefined;

        // Make the array's dependencies depend on the array size state variable
        if (stateVarObj.stateVariablesDeterminingDependencies) {
            originalStateVariablesDeterminingDependencies = [
                ...stateVarObj.stateVariablesDeterminingDependencies,
            ];
            stateVarObj.stateVariablesDeterminingDependencies.push(
                arraySizeStateVar,
            );
        } else {
            stateVarObj.stateVariablesDeterminingDependencies = [
                arraySizeStateVar,
            ];
        }

        // If array size state variable has already been created,
        // either it was created due to being shadowed
        // or from an additional state variable defined.
        // If it is shadowing target array size state variable,
        // make it mark the array's arraySize as stale on markStale
        if (component.state[arraySizeStateVar]) {
            if (component.state[arraySizeStateVar].isShadow) {
                let arraySizeStateVarObj = component.state[arraySizeStateVar];
                arraySizeStateVarObj.markStale = function () {
                    for (let varName of allStateVariablesAffected) {
                        component.state[varName].arraySizeStale = true;
                    }
                    return {};
                };
            }
            return;
        }

        component.state[arraySizeStateVar] = {
            returnDependencies: stateVarObj.returnArraySizeDependencies,
            definition({ dependencyValues }) {
                let arraySize = stateVarObj.returnArraySize({
                    dependencyValues,
                });
                for (let [ind, value] of arraySize.entries()) {
                    if (!(Number.isInteger(value) && value >= 0)) {
                        arraySize[ind] = 0;
                    }
                }
                return { setValue: { [arraySizeStateVar]: arraySize } };
            },
            markStale() {
                for (let varName of allStateVariablesAffected) {
                    component.state[varName].arraySizeStale = true;
                }
                return {};
            },
        };

        if (stateVarObj.stateVariablesDeterminingArraySizeDependencies) {
            component.state[
                arraySizeStateVar
            ].stateVariablesDeterminingDependencies =
                stateVarObj.stateVariablesDeterminingArraySizeDependencies;
        }

        await this.initializeStateVariable({
            component,
            stateVariable: arraySizeStateVar,
        });
    }

    // arrayEntryNamesFromPropIndex is essentially a wrapper around
    // stateVarObj.arrayVarNameFromPropIndex.
    // (See above description of arrayVarNameFromPropIndex for technical debt commentary.)
    // It calls arrayVarNameFromPropIndex on each of an array of stateVariables,
    // first creating any missing array entry state variables,
    // logs warnings,
    // and returns an array of the resulting state variables.
    async arrayEntryNamesFromPropIndex({
        stateVariables,
        component,
        propIndex,
    }) {
        let newVarNames = [];
        for (let varName of stateVariables) {
            let stateVarObj = component.state[varName];
            if (!stateVarObj) {
                if (
                    !this.checkIfArrayEntry({
                        stateVariable: varName,
                        component,
                    }).isArrayEntry
                ) {
                    // varName doesn't exist.  Ignore error here
                    newVarNames.push(varName);
                    continue;
                }
                await this.createFromArrayEntry({
                    stateVariable: varName,
                    component,
                });
                stateVarObj = component.state[varName];
            }

            let newName;
            if (stateVarObj.isArray) {
                newName = stateVarObj.arrayVarNameFromPropIndex(
                    propIndex,
                    varName,
                );
            } else if (stateVarObj.isArrayEntry) {
                let arrayStateVarObj =
                    component.state[stateVarObj.arrayStateVariable];
                newName = arrayStateVarObj.arrayVarNameFromPropIndex(
                    propIndex,
                    varName,
                );
            } else {
                this.addErrorWarning({
                    type: "warning",
                    message: `Cannot get propIndex from ${varName} of ${component.componentIdx} as it is not an array or array entry state variable`,
                    level: 1,
                    position: component.position,
                    sourceDoc: component.sourceDoc,
                });
                newName = varName;
            }
            if (newName) {
                newVarNames.push(newName);
            } else {
                this.addErrorWarning({
                    type: "warning",
                    message: `Cannot get propIndex from ${varName} of ${component.componentIdx}`,
                    level: 1,
                    position: component.position,
                    sourceDoc: component.sourceDoc,
                });
                newVarNames.push(varName);
            }
        }

        return newVarNames;
    }

    recursivelyReplaceCompositesWithReplacements({
        replacements,
        recurseNonStandardComposites = false,
        forceExpandComposites = false,
        includeWithheldReplacements = false,
        stopIfHaveProp,
    }) {
        let compositesFound = [];
        let newReplacements = [];
        let unexpandedCompositesReady = [];
        let unexpandedCompositesNotReady = [];

        for (let replacement of replacements) {
            if (
                this.componentInfoObjects.isCompositeComponent({
                    componentType: replacement.componentType,
                    includeNonStandard: recurseNonStandardComposites,
                })
            ) {
                if (stopIfHaveProp) {
                    const checkForPublic = this.matchPublicStateVariables({
                        stateVariables: [stopIfHaveProp],
                        componentClass: replacement.constructor,
                    })[0];

                    if (!checkForPublic.startsWith("__not_public_")) {
                        // The composite has a public state variable that matches `stopIfHaveProp`.
                        // Therefore, we don't recurse to its replacements but treat the composite itself as the replacement
                        newReplacements.push(replacement);
                        continue;
                    }
                }

                compositesFound.push(replacement.componentIdx);

                if (!replacement.isExpanded) {
                    if (
                        replacement.state.readyToExpandWhenResolved.isResolved
                    ) {
                        unexpandedCompositesReady.push(
                            replacement.componentIdx,
                        );
                    } else {
                        unexpandedCompositesNotReady.push(
                            replacement.componentIdx,
                        );
                    }
                }

                if (replacement.isExpanded) {
                    let replacementReplacements = replacement.replacements;
                    if (
                        !includeWithheldReplacements &&
                        replacement.replacementsToWithhold > 0
                    ) {
                        replacementReplacements = replacementReplacements.slice(
                            0,
                            -replacement.replacementsToWithhold,
                        );
                    }
                    let recursionResult =
                        this.recursivelyReplaceCompositesWithReplacements({
                            replacements: replacementReplacements,
                            recurseNonStandardComposites,
                            forceExpandComposites,
                            includeWithheldReplacements,
                            stopIfHaveProp,
                        });
                    compositesFound.push(...recursionResult.compositesFound);
                    newReplacements.push(...recursionResult.newReplacements);
                    unexpandedCompositesReady.push(
                        ...recursionResult.unexpandedCompositesReady,
                    );
                    unexpandedCompositesNotReady.push(
                        ...recursionResult.unexpandedCompositesNotReady,
                    );
                } else {
                    newReplacements.push(replacement);
                }
            } else {
                newReplacements.push(replacement);
            }
        }

        return {
            compositesFound,
            newReplacements,
            unexpandedCompositesReady,
            unexpandedCompositesNotReady,
        };
    }

    async getStateVariableValue({ component, stateVariable }) {
        // console.log(`getting value of state variable ${stateVariable} of ${component.componentIdx}`)

        let stateVarObj = component.state[stateVariable];
        if (!stateVarObj) {
            throw Error(
                `Can't get value of ${stateVariable} of ${component.componentIdx} as it doesn't exist.`,
            );
        }

        if (component.reprocessAfterEvaluate) {
            // This is a kludge
            // due to the fact that Math ignores strings
            // (set in inverse definition of expressionWithCodes).
            // We need change its value a second time after evaluating
            // so that the next time the definition of expressionWithCodes is run,
            // the strings don't show any changes and we'll use the essential value
            // of expressionWithCodes
            let reprocessAfterEvaluate = component.reprocessAfterEvaluate;
            delete this._components[component.componentIdx]
                .reprocessAfterEvaluate;

            for (let vName in reprocessAfterEvaluate) {
                if (component.state[vName]) {
                    await this.getStateVariableValue({
                        component,
                        stateVariable: vName,
                    });
                }
            }

            await this.processNewStateVariableValues({
                [component.componentIdx]: reprocessAfterEvaluate,
            });
        }

        let additionalStateVariablesDefined =
            stateVarObj.additionalStateVariablesDefined;

        let allStateVariablesAffected = [stateVariable];
        if (additionalStateVariablesDefined) {
            allStateVariablesAffected.push(...additionalStateVariablesDefined);
        }

        let justUpdatedForNewComponent = false;

        for (let varName of allStateVariablesAffected) {
            if (!component.state[varName].isResolved) {
                let result = await this.dependencies.resolveItem({
                    componentIdx: component.componentIdx,
                    type: "stateVariable",
                    stateVariable: varName,
                    force: true,
                });

                if (!result.success) {
                    throw Error(
                        `Can't get value of ${stateVariable} of ${component.componentIdx} as ${varName} couldn't be resolved.`,
                    );
                }
            }

            if (component.state[varName].justUpdatedForNewComponent) {
                delete this._components[component.componentIdx].state[varName]
                    .justUpdatedForNewComponent;
                justUpdatedForNewComponent = true;
            }
        }

        let definitionArgs = await this.getStateVariableDefinitionArguments({
            component,
            stateVariable,
        });
        definitionArgs.componentInfoObjects = this.componentInfoObjects;
        definitionArgs.justUpdatedForNewComponent = justUpdatedForNewComponent;

        definitionArgs.freshnessInfo = stateVarObj.freshnessInfo;

        // arraySize will be defined if have array or arrayEntry
        // (If have multiple state variables defined, they must be of same size)
        let arraySize = definitionArgs.arraySize;

        // if (component instanceof this.componentInfoObjects.allComponentClasses._composite) {
        //   definitionArgs.replacementsWorkspace = new Proxy(component.replacementsWorkspace, readOnlyProxyHandler);
        // }

        let result;

        if (
            Object.keys(definitionArgs.changes).length === 0 &&
            stateVarObj._previousValue !== undefined &&
            !stateVarObj.forceRecalculation
        ) {
            let noChanges = [stateVariable];
            if (additionalStateVariablesDefined) {
                noChanges.push(...additionalStateVariablesDefined);
            }
            // console.log(`no changes for ${stateVariable} of ${component.componentIdx}`);
            // console.log(noChanges)
            result = { noChanges };

            if (stateVarObj.freshenOnNoChanges) {
                stateVarObj.freshenOnNoChanges(definitionArgs);
            }
        } else {
            delete stateVarObj.forceRecalculation;
            result = stateVarObj.definition(definitionArgs);
        }

        let receivedValue = {
            [stateVariable]: false,
        };

        let valuesChanged = {};

        if (additionalStateVariablesDefined) {
            for (let otherVar of additionalStateVariablesDefined) {
                receivedValue[otherVar] = false;
            }
        }

        // console.log(`result for ${stateVariable} of ${component.componentIdx}`)
        // console.log(result);

        for (let varName in result.setValue) {
            if (!(varName in component.state)) {
                throw Error(
                    `Definition of state variable ${stateVariable} of ${component.componentIdx} returned value of ${varName}, which isn't a state variable.`,
                );
            }

            let matchingArrayEntry;

            if (!(varName in receivedValue)) {
                if (
                    component.state[varName].isArray &&
                    component.state[varName].arrayEntryNames
                ) {
                    for (let arrayEntryName of component.state[varName]
                        .arrayEntryNames) {
                        if (arrayEntryName in receivedValue) {
                            matchingArrayEntry = arrayEntryName;
                            receivedValue[arrayEntryName] = true;
                            valuesChanged[arrayEntryName] = true;
                            break;
                        }
                    }
                }
                if (!matchingArrayEntry) {
                    throw Error(
                        `Attempting to set value of stateVariable ${varName} in definition of ${stateVariable} of ${component.componentIdx}, but it's not listed as an additional state variable defined.`,
                    );
                }
            } else {
                receivedValue[varName] = true;

                if (component.state[varName].isArray) {
                    if (!valuesChanged[varName]) {
                        valuesChanged[varName] = { arrayKeysChanged: {} };
                    }
                } else {
                    valuesChanged[varName] = true;
                }
            }

            if (!component.state[varName].isResolved) {
                if (
                    !matchingArrayEntry ||
                    !component.state[matchingArrayEntry].isResolved
                ) {
                    throw Error(
                        `Attempting to set value of stateVariable ${varName} of ${component.componentIdx} while it is still unresolved!`,
                    );
                }
            }

            if (component.state[varName].isArray) {
                if (!valuesChanged[varName]) {
                    valuesChanged[varName] = { arrayKeysChanged: {} };
                }

                let checkForActualChange = {};
                if (
                    result.checkForActualChange &&
                    result.checkForActualChange[varName]
                ) {
                    checkForActualChange = result.checkForActualChange[varName];
                }

                for (let arrayKey in result.setValue[varName]) {
                    if (checkForActualChange[arrayKey]) {
                        let prevValue = component.state[varName].getArrayValue({
                            arrayKey,
                        });
                        let newValue = result.setValue[varName][arrayKey];
                        if (prevValue !== newValue) {
                            component.state[varName].setArrayValue({
                                value: result.setValue[varName][arrayKey],
                                arrayKey,
                                arraySize,
                            });
                            component.state[varName].usedDefaultByArrayKey[
                                arrayKey
                            ] = false;
                            valuesChanged[varName].arrayKeysChanged[arrayKey] =
                                true;
                        }
                    } else {
                        component.state[varName].setArrayValue({
                            value: result.setValue[varName][arrayKey],
                            arrayKey,
                            arraySize,
                        });
                        component.state[varName].usedDefaultByArrayKey[
                            arrayKey
                        ] = false;
                        valuesChanged[varName].arrayKeysChanged[arrayKey] =
                            true;
                    }
                }
            } else {
                // not an array

                // if (!(Object.getOwnPropertyDescriptor(component.state[varName], 'value').get || component.state[varName].immutable)) {
                //   throw Error(`${varName} of ${component.componentIdx} is not stale, but still setting its value!!`)
                // }

                // delete before assigning value to remove any getter for the property
                delete component.state[varName].value;
                component.state[varName].value = result.setValue[varName];
                delete component.state[varName].usedDefault;

                if (result.checkForActualChange?.[varName]) {
                    let newValue = component.state[varName].value;
                    let previousValue = component.state[varName]._previousValue;

                    if (newValue === previousValue) {
                        delete valuesChanged[varName];
                    } else if (
                        Array.isArray(newValue) &&
                        Array.isArray(previousValue)
                    ) {
                        // for arrays, do a shallow comparison along first dimension
                        // TODO: is there a reason to check deeper?
                        // Probably, not as have array state variables that would usually handle this
                        if (
                            newValue.length === previousValue.length &&
                            newValue.every((v, i) => v === previousValue[i])
                        ) {
                            delete valuesChanged[varName];
                        }
                    }
                }
            }
        }

        for (let varName in result.useEssentialOrDefaultValue) {
            if (!(varName in component.state)) {
                throw Error(
                    `Definition of state variable ${stateVariable} of ${component.componentIdx} requested essential or default value of ${varName}, which isn't a state variable.`,
                );
            }

            if (!component.state[varName].hasEssential) {
                throw Error(
                    `Definition of state variable ${stateVariable} of ${component.componentIdx} requested essential or default value of ${varName}, but hasEssential is not set.`,
                );
            }

            let matchingArrayEntry;

            if (!(varName in receivedValue)) {
                if (
                    component.state[varName].isArray &&
                    component.state[varName].arrayEntryNames
                ) {
                    for (let arrayEntryName of component.state[varName]
                        .arrayEntryNames) {
                        if (arrayEntryName in receivedValue) {
                            matchingArrayEntry = arrayEntryName;
                            receivedValue[arrayEntryName] = true;
                            valuesChanged[arrayEntryName] = true;
                            break;
                        }
                    }
                }
                if (!matchingArrayEntry) {
                    throw Error(
                        `Attempting to set value of stateVariable ${varName} in definition of ${stateVariable} of ${component.componentIdx}, but it's not listed as an additional state variable defined.`,
                    );
                }
            } else {
                receivedValue[varName] = true;
                if (component.state[varName].isArray) {
                    if (!valuesChanged[varName]) {
                        valuesChanged[varName] = { arrayKeysChanged: {} };
                    }
                } else {
                    valuesChanged[varName] = true;
                }
            }

            if (!component.state[varName].isResolved) {
                if (
                    !matchingArrayEntry ||
                    !component.state[matchingArrayEntry].isResolved
                ) {
                    throw Error(
                        `Attempting to set value of stateVariable ${varName} of ${component.componentIdx} while it is still unresolved!`,
                    );
                }
            }

            let essentialVarName = varName;

            if (component.state[varName].essentialVarName) {
                essentialVarName = component.state[varName].essentialVarName;
            }
            let essentialValue = component.essentialState[essentialVarName];

            if (component.state[varName].isArray) {
                // if have an array state variable,
                // then need to have an object keyed on arrayKey

                if (!valuesChanged[varName]) {
                    valuesChanged[varName] = { arrayKeysChanged: {} };
                }

                let checkForActualChange = {};
                if (
                    result.checkForActualChange &&
                    result.checkForActualChange[varName]
                ) {
                    checkForActualChange = result.checkForActualChange[varName];
                }

                for (let arrayKey in result.useEssentialOrDefaultValue[
                    varName
                ]) {
                    let prevValue;
                    if (checkForActualChange[arrayKey]) {
                        prevValue = component.state[varName].getArrayValue({
                            arrayKey,
                        });
                    }

                    let essentialValueForArrayKey;
                    if (Array.isArray(essentialValue)) {
                        essentialValueForArrayKey = component.state[
                            varName
                        ].getArrayValue({
                            arrayKey,
                            arrayValues: essentialValue,
                        });
                    } else {
                        essentialValue = component.essentialState[
                            essentialVarName
                        ] = [];
                    }

                    if (essentialValueForArrayKey !== undefined) {
                        component.state[varName].setArrayValue({
                            value: essentialValueForArrayKey,
                            arrayKey,
                            arraySize,
                        });
                    } else {
                        let defaultValue =
                            result.useEssentialOrDefaultValue[varName][arrayKey]
                                .defaultValue;
                        if (defaultValue !== undefined) {
                            // save to state variable
                            component.state[varName].setArrayValue({
                                value: defaultValue,
                                arrayKey,
                                arraySize,
                            });

                            component.state[varName].usedDefaultByArrayKey[
                                arrayKey
                            ] = true;
                        } else if (
                            component.state[varName].defaultValueByArrayKey?.(
                                arrayKey,
                            ) !== undefined
                        ) {
                            component.state[varName].setArrayValue({
                                value: component.state[
                                    varName
                                ].defaultValueByArrayKey(arrayKey),
                                arrayKey,
                                arraySize,
                            });
                            component.state[varName].usedDefaultByArrayKey[
                                arrayKey
                            ] = true;
                        } else {
                            throw Error(
                                `Neither value nor default value specified; state variable: ${varName}, component: ${component.componentIdx}, arrayKey: ${arrayKey}.`,
                            );
                        }
                    }

                    if (checkForActualChange[arrayKey]) {
                        let newValue = component.state[varName].getArrayValue({
                            arrayKey,
                        });
                        if (newValue !== prevValue) {
                            valuesChanged[varName].arrayKeysChanged[arrayKey] =
                                true;
                        }
                    } else {
                        valuesChanged[varName].arrayKeysChanged[arrayKey] =
                            true;
                    }
                }
            } else {
                if (essentialValue !== undefined) {
                    // delete before assigning essential value to remove any getter for the property
                    delete component.state[varName].value;
                    component.state[varName].value = essentialValue;
                } else {
                    let defaultValue =
                        result.useEssentialOrDefaultValue[varName].defaultValue;
                    if (defaultValue !== undefined) {
                        // save state variable value
                        delete component.state[varName].value;
                        component.state[varName].value = defaultValue;

                        component.state[varName].usedDefault = true;
                    } else if (
                        component.state[varName].defaultValue !== undefined
                    ) {
                        // This default value will be the same every time,
                        // so we don't need to save its value

                        // delete before assigning value to remove any getter for the property
                        delete component.state[varName].value;
                        component.state[varName].value =
                            component.state[varName].defaultValue;
                        component.state[varName].usedDefault = true;
                    } else {
                        throw Error(
                            `Neither value nor default value specified; state variable: ${varName}, component: ${component.componentIdx}.`,
                        );
                    }
                }

                if (result.checkForActualChange?.[varName]) {
                    let newValue = component.state[varName].value;
                    let previousValue = component.state[varName]._previousValue;

                    if (newValue === previousValue) {
                        delete valuesChanged[varName];
                    } else if (
                        Array.isArray(newValue) &&
                        Array.isArray(previousValue)
                    ) {
                        // for arrays, do a shallow comparison along first dimension
                        // TODO: is there a reason to check deeper?
                        // Probably, not as have array state variables that would usually handle this
                        if (
                            newValue.length === previousValue.length &&
                            newValue.every((v, i) => v === previousValue[i])
                        ) {
                            delete valuesChanged[varName];
                        }
                    }
                }
            }
        }

        for (let varName in result.markAsUsedDefault) {
            if (!component.state[varName].isResolved) {
                throw Error(
                    `Marking state variable as used default when it isn't yet resolved: ${varName} of ${component.componentIdx}`,
                );
            }

            if (!(varName in receivedValue)) {
                let matchingArrayEntry;
                if (
                    component.state[varName].isArray &&
                    component.state[varName].arrayEntryNames
                ) {
                    for (let arrayEntryName of component.state[varName]
                        .arrayEntryNames) {
                        if (arrayEntryName in receivedValue) {
                            matchingArrayEntry = arrayEntryName;
                            break;
                        }
                    }
                }
                if (!matchingArrayEntry) {
                    throw Error(
                        `Marking state variable  ${varName} as used default in definition of ${stateVariable} of ${component.componentIdx}, but it's not listed as an additional state variable defined.`,
                    );
                }
            }

            if (Array.isArray()) {
                for (let arrayKey in result.markAsUsedDefault[varName]) {
                    component.state[varName].usedDefaultByArrayKey[arrayKey] =
                        Boolean(result.markAsUsedDefault[varName][arrayKey]);
                }
            } else {
                component.state[varName].usedDefault = Boolean(
                    result.markAsUsedDefault[varName],
                );
            }
        }

        if (result.noChanges) {
            for (let varName of result.noChanges) {
                if (!component.state[varName].isResolved) {
                    // TODO: is this the correct response to having no changes but a variable not resolved?
                    // This scenario was occasionally occurring with readyToExpandWhenResolved in tests
                    component.state[varName].isResolved = true;
                    // throw Error(`Claiming state variable is unchanged when it isn't yet resolved: ${varName} of ${component.componentIdx}`)
                }

                if (!(varName in receivedValue)) {
                    let matchingArrayEntry;
                    if (
                        component.state[varName].isArray &&
                        component.state[varName].arrayEntryNames
                    ) {
                        for (let arrayEntryName of component.state[varName]
                            .arrayEntryNames) {
                            if (arrayEntryName in receivedValue) {
                                matchingArrayEntry = arrayEntryName;
                                break;
                            }
                        }
                    }
                    if (!matchingArrayEntry) {
                        throw Error(
                            `Claiming stateVariable ${varName} is unchanged in definition of ${stateVariable} of ${component.componentIdx}, but it's not listed as an additional state variable defined.`,
                        );
                    }
                }

                receivedValue[varName] = true;

                if (
                    Object.getOwnPropertyDescriptor(
                        component.state[varName],
                        "value",
                    ).get ||
                    component.state[varName].immutable
                ) {
                    // have getter, so state variable was marked as stale
                    // delete getter then assign previous value
                    delete component.state[varName].value;
                    component.state[varName].value =
                        component.state[varName]._previousValue;
                }
            }
        }

        for (let varName in result.setEssentialValue) {
            if (!(varName in component.state)) {
                throw Error(
                    `Definition of state variable ${stateVariable} of ${component.componentIdx} tried to make ${varName} essential, which isn't a state variable.`,
                );
            }

            if (!(varName in receivedValue)) {
                let matchingArrayEntry;
                if (
                    component.state[varName].isArray &&
                    component.state[varName].arrayEntryNames
                ) {
                    for (let arrayEntryName of component.state[varName]
                        .arrayEntryNames) {
                        if (arrayEntryName in receivedValue) {
                            matchingArrayEntry = arrayEntryName;
                            break;
                        }
                    }
                }
                if (!matchingArrayEntry) {
                    throw Error(
                        `Attempting to set essential value of stateVariable ${varName} in definition of ${stateVariable} of ${component.componentIdx}, but it's not listed as an additional state variable defined.`,
                    );
                }
            }

            if (!component.state[varName].hasEssential) {
                throw Error(
                    `Attempting to set the essential value of stateVariable ${varName} in definition of ${stateVariable} of ${component.componentIdx}, but it does not have an essential value`,
                );
            }

            // Setting essential value is only valid if the essential value is not shadowed
            // (or if the state variable itself is shadowed,
            // which implicitly means the essential value is not shadowed)
            // Otherwise, changing the essential value could change the effective dependencies
            // of the shadowed state variables, which would necessitate recalculating those values.
            // Not only is marking those values stale not available when getting state variable values,
            // but it would cause an infinite loop when those definitions also set the essential value

            if (
                !(
                    component.state[varName].shadowVariable ||
                    component.state[varName].doNotShadowEssential
                )
            ) {
                throw Error(
                    `Attempting to set the essential value of stateVariable ${varName} in definition of ${stateVariable} of ${component.componentIdx}, but it is not allowed unless the state variable is shadowed or the essential state is not shadowed.`,
                );
            }

            if (
                !this.essentialValuesSavedInDefinition[component.componentIdx]
            ) {
                this.essentialValuesSavedInDefinition[component.componentIdx] =
                    {};
            }

            let essentialVarName = varName;
            if (component.state[varName].essentialVarName) {
                essentialVarName = component.state[varName].essentialVarName;
            }

            if (component.state[varName].isArray) {
                let essentialArray = component.essentialState[essentialVarName];

                if (!Array.isArray(essentialArray)) {
                    essentialArray = component.essentialState[
                        essentialVarName
                    ] = [];
                }

                // Since setting an essential value during a definition,
                // we also add the value to essentialValuesSavedInDefinition
                // so that it will be saved to the database during the next update

                if (
                    !this.essentialValuesSavedInDefinition[
                        component.componentIdx
                    ][varName]
                ) {
                    // include key mergeObject to let external functions
                    // know that new attributes of the object
                    // should be merged into the old object
                    this.essentialValuesSavedInDefinition[
                        component.componentIdx
                    ][varName] = {
                        mergeObject: true,
                    };
                }
                for (let arrayKey in result.setEssentialValue[varName]) {
                    component.state[varName].setArrayValue({
                        value: result.setEssentialValue[varName][arrayKey],
                        arrayKey,
                        arraySize,
                        arrayValues: essentialArray,
                    });

                    this.essentialValuesSavedInDefinition[
                        component.componentIdx
                    ][varName][arrayKey] =
                        result.setEssentialValue[varName][arrayKey];
                }
            } else {
                component.essentialState[essentialVarName] =
                    result.setEssentialValue[varName];

                // Since setting an essential value during a definition,
                // we also add the value to essentialValuesSavedInDefinition
                // so that it will be saved to the database during the next update
                this.essentialValuesSavedInDefinition[component.componentIdx][
                    varName
                ] = result.setEssentialValue[varName];
            }
        }

        if (result.setCreateComponentOfType) {
            for (let varName in result.setCreateComponentOfType) {
                if (
                    !component.state[varName].shadowingInstructions
                        ?.hasVariableComponentType
                ) {
                    throw Error(
                        `Cannot set type of ${varName} of ${component.componentIdx} as it it does not have the hasVariableComponentType attribute.`,
                    );
                }
                let changedComponentType = false;
                let shadowingInstructions =
                    component.state[varName].shadowingInstructions;
                if (!shadowingInstructions) {
                    shadowingInstructions = component.state[
                        varName
                    ].shadowingInstructions = {};
                }
                let originalCreateComponentOfType =
                    shadowingInstructions.createComponentOfType;
                let newCreateComponentOfType =
                    result.setCreateComponentOfType[varName];
                if (Array.isArray(originalCreateComponentOfType)) {
                    if (Array.isArray(newCreateComponentOfType)) {
                        if (
                            originalCreateComponentOfType.length !==
                            newCreateComponentOfType.length
                        ) {
                            changedComponentType = true;
                        } else if (
                            originalCreateComponentOfType.some(
                                (v, i) => v != newCreateComponentOfType[i],
                            )
                        ) {
                            changedComponentType = true;
                        }
                    } else {
                        changedComponentType = true;
                    }
                } else if (Array.isArray(newCreateComponentOfType)) {
                    changedComponentType = true;
                } else {
                    changedComponentType =
                        originalCreateComponentOfType !==
                        newCreateComponentOfType;
                }
                if (changedComponentType) {
                    valuesChanged[varName] = true;
                }
                shadowingInstructions.createComponentOfType =
                    result.setCreateComponentOfType[varName];
                if (
                    component.state[varName].isArray &&
                    component.state[varName].arrayEntryNames
                ) {
                    let arrayComponentType =
                        result.setCreateComponentOfType[varName];
                    let arrayComponentTypeIsArray =
                        Array.isArray(arrayComponentType);
                    for (let arrayEntryName of component.state[varName]
                        .arrayEntryNames) {
                        // TODO: address multidimensional arrays
                        if (arrayComponentTypeIsArray) {
                            let arrayKeys =
                                await component.state[arrayEntryName].arrayKeys;
                            let componentType = [];
                            for (let arrayKey of arrayKeys) {
                                let ind =
                                    component.state[varName].keyToIndex(
                                        arrayKey,
                                    );
                                componentType.push(arrayComponentType[ind]);
                            }
                            component.state[
                                arrayEntryName
                            ].shadowingInstructions.createComponentOfType =
                                componentType;
                        } else {
                            component.state[
                                arrayEntryName
                            ].shadowingInstructions.createComponentOfType =
                                arrayComponentType;
                        }
                    }
                }
            }
        }

        if (result.arraySizeChanged) {
            for (let varName of result.arraySizeChanged) {
                await component.state[varName].adjustArrayToNewArraySize();

                if (valuesChanged[varName] === undefined) {
                    valuesChanged[varName] = { arrayKeysChanged: {} };
                } else if (valuesChanged[varName] === true) {
                    valuesChanged[varName] = {
                        allArrayKeysChanged: true,
                        arrayKeysChanged: {},
                    };
                }
                valuesChanged[varName].arraySizeChanged = true;
            }
        }

        if (result.sendWarnings) {
            let position = component.position;
            let sourceDoc = component.sourceDoc;
            let comp = component;
            while (position === undefined) {
                if (!(comp.parentIdx > 0)) {
                    break;
                }
                comp = this._components[comp.parentIdx];
                position = comp.position;
                sourceDoc = comp.sourceDoc;
            }

            for (let warning of result.sendWarnings) {
                this.addErrorWarning({
                    type: "warning",
                    position,
                    sourceDoc,
                    ...warning,
                });
            }
        }

        for (let varName in receivedValue) {
            if (
                !(
                    receivedValue[varName] ||
                    component.state[varName].isArrayEntry ||
                    component.state[varName].isArray
                )
            ) {
                throw Error(
                    `definition of ${stateVariable} of ${component.componentIdx} didn't return value of ${varName}`,
                );
            }

            if (component.state[varName].isArray) {
                // delete before assigning value to remove any getter for the property
                delete component.state[varName].value;
                component.state[varName].value =
                    component.state[varName].arrayValues;
            } else if (component.state[varName].isArrayEntry) {
                delete component.state[varName].value;
                component.state[varName].value =
                    await component.state[varName].getValueFromArrayValues();
            }
        }

        for (let varName in valuesChanged) {
            this.dependencies.recordActualChangeInUpstreamDependencies({
                component,
                varName,
                changes: valuesChanged[varName], // so far, just in case is an array state variable
            });

            if (component.state[varName].isArray) {
                let arrayVarNamesChanged = [];
                if (
                    valuesChanged[varName] === true ||
                    valuesChanged[varName].allArrayKeysChanged ||
                    valuesChanged.arraySizeChanged
                ) {
                    if (component.state[varName].arrayEntryNames) {
                        arrayVarNamesChanged =
                            component.state[varName].arrayEntryNames;
                    }
                } else {
                    let varNamesByArrayKey =
                        component.state[varName].varNamesIncludingArrayKeys;
                    for (let arrayKeyChanged in valuesChanged[varName]
                        .arrayKeysChanged) {
                        let additionalVarNamesChanged =
                            varNamesByArrayKey[arrayKeyChanged];
                        if (additionalVarNamesChanged) {
                            arrayVarNamesChanged.push(
                                ...additionalVarNamesChanged,
                            );
                        }
                    }
                }

                // remove duplicates
                arrayVarNamesChanged = [...new Set(arrayVarNamesChanged)];

                for (let arrayVarName of arrayVarNamesChanged) {
                    this.dependencies.recordActualChangeInUpstreamDependencies({
                        component,
                        varName: arrayVarName,
                    });
                }
            }
        }

        return await stateVarObj.value;
    }

    async getStateVariableDefinitionArguments({
        component,
        stateVariable,
        excludeDependencyValues,
    }) {
        // console.log(`get state variable dependencies of ${component.componentIdx}, ${stateVariable}`)

        let args;
        if (excludeDependencyValues) {
            args = {};
        } else {
            args = await this.dependencies.getStateVariableDependencyValues({
                component,
                stateVariable,
            });
        }

        args.componentIdx = component.componentIdx;

        let stateVarObj = component.state[stateVariable];
        if (stateVarObj.isArrayEntry) {
            args.arrayKeys = await stateVarObj.arrayKeys;
            args.arraySize = await stateVarObj.arraySize;
        } else if (stateVarObj.isArray) {
            args.arraySize = await stateVarObj.arraySize;
        }

        if (stateVarObj.createWorkspace) {
            args.workspace = stateVarObj.workspace;
        }

        if (
            stateVarObj.providePreviousValuesInDefinition ||
            stateVarObj.provideEssentialValuesInDefinition
        ) {
            let allStateVariablesDefined = [stateVariable];
            if (stateVarObj.additionalStateVariablesDefined) {
                allStateVariablesDefined.push(
                    ...stateVarObj.additionalStateVariablesDefined,
                );
            }
            if (stateVarObj.providePreviousValuesInDefinition) {
                let previousValues = {};
                for (let varName of allStateVariablesDefined) {
                    if (component.state[varName].isArrayEntry) {
                        varName = component.state[varName].arrayStateVariable;
                    }
                    previousValues[varName] =
                        component.state[varName]._previousValue;
                }
                // args.previousValues = new Proxy(previousValues, readOnlyProxyHandler);
                args.previousValues = previousValues;
            }
            if (stateVarObj.provideEssentialValuesInDefinition) {
                let essentialValues = {};
                for (let varName of allStateVariablesDefined) {
                    if (component.state[varName].isArrayEntry) {
                        varName = component.state[varName].arrayStateVariable;
                    }
                    let essentialVarName = varName;
                    if (component.state[varName].essentialVarName) {
                        essentialVarName =
                            component.state[varName].essentialVarName;
                    }

                    essentialValues[varName] =
                        component.essentialState[essentialVarName];
                }
                // args.essentialValues = new Proxy(essentialValues, readOnlyProxyHandler);
                args.essentialValues = essentialValues;
            }
        }

        return args;
    }

    async recordActualChangeInStateVariable({ componentIdx, varName }) {
        let component = this._components[componentIdx];

        // mark stale always includes additional state variables defined
        await this.markStateVariableAndUpstreamDependentsStale({
            component,
            varName,
        });

        let allStateVariables = [varName];
        if (component.state[varName].additionalStateVariablesDefined) {
            allStateVariables.push(
                ...component.state[varName].additionalStateVariablesDefined,
            );
        }

        for (let vName of allStateVariables) {
            component.state[vName].forceRecalculation = true;
            this.dependencies.recordActualChangeInUpstreamDependencies({
                component,
                varName: vName,
            });
        }
    }

    findCaseInsensitiveMatches({ stateVariables, componentClass }) {
        let stateVarInfo =
            this.componentInfoObjects.stateVariableInfo[
                componentClass.componentType
            ];

        let newVariables = [];

        for (let stateVariable of stateVariables) {
            let foundMatch = false;

            let lowerCaseVarName = stateVariable.toLowerCase();

            for (let varName in stateVarInfo.stateVariableDescriptions) {
                if (lowerCaseVarName === varName.toLowerCase()) {
                    foundMatch = true;
                    newVariables.push(varName);
                    break;
                }
            }

            if (foundMatch) {
                continue;
            }

            let isArraySize = false;
            let lowerCaseNameMinusSize = lowerCaseVarName;
            if (lowerCaseVarName.substring(0, 13) === "__array_size_") {
                isArraySize = true;
                lowerCaseNameMinusSize = lowerCaseVarName.substring(13);
            }

            for (let aliasName in stateVarInfo.aliases) {
                if (lowerCaseNameMinusSize === aliasName.toLowerCase()) {
                    // don't substitute alias here, just fix case
                    if (isArraySize) {
                        aliasName = "__array_size_" + aliasName;
                    }
                    newVariables.push(aliasName);
                    foundMatch = true;
                    break;
                }
            }
            if (foundMatch) {
                continue;
            }

            let arrayEntryPrefixesLongestToShortest = Object.keys(
                stateVarInfo.arrayEntryPrefixes,
            ).sort((a, b) => b.length - a.length);
            for (let prefix of arrayEntryPrefixesLongestToShortest) {
                if (
                    lowerCaseVarName.substring(0, prefix.length) ===
                    prefix.toLowerCase()
                ) {
                    // TODO: the varEnding is still a case-senstitive match
                    // Should we require that getArrayKeysFromVarName have
                    // a case-insensitive mode?
                    let arrayVariableName =
                        stateVarInfo.arrayEntryPrefixes[prefix]
                            .arrayVariableName;
                    let arrayStateVarDescription =
                        stateVarInfo.stateVariableDescriptions[
                            arrayVariableName
                        ];
                    let arrayKeys =
                        arrayStateVarDescription.getArrayKeysFromVarName({
                            arrayEntryPrefix: prefix,
                            varEnding: stateVariable.substring(prefix.length),
                            numDimensions:
                                arrayStateVarDescription.numDimensions,
                        });
                    if (arrayKeys.length > 0) {
                        let newVarName =
                            prefix + lowerCaseVarName.substring(prefix.length);
                        foundMatch = true;
                        newVariables.push(newVarName);
                        break;
                    }
                }
            }

            if (foundMatch) {
                continue;
            }

            // no match, so don't alter
            newVariables.push(stateVariable);
        }

        return newVariables;
    }

    matchPublicStateVariables({ stateVariables, componentClass }) {
        let stateVarInfo =
            this.componentInfoObjects.publicStateVariableInfo[
                componentClass.componentType
            ];

        let newVariables = [];

        for (let stateVariable of stateVariables) {
            if (stateVariable in stateVarInfo.stateVariableDescriptions) {
                // found public
                newVariables.push(stateVariable);
                continue;
            }

            let varName = stateVariable;

            if (varName in stateVarInfo.aliases) {
                varName = stateVarInfo.aliases[varName];

                // check again to see if alias is public
                if (varName in stateVarInfo.stateVariableDescriptions) {
                    // found public
                    newVariables.push(varName);
                    continue;
                }
            }

            let foundMatch = false;

            let arrayEntryPrefixesLongestToShortest = Object.keys(
                stateVarInfo.arrayEntryPrefixes,
            ).sort((a, b) => b.length - a.length);
            for (let prefix of arrayEntryPrefixesLongestToShortest) {
                if (varName.substring(0, prefix.length) === prefix) {
                    let arrayVariableName =
                        stateVarInfo.arrayEntryPrefixes[prefix]
                            .arrayVariableName;
                    let arrayStateVarDescription =
                        stateVarInfo.stateVariableDescriptions[
                            arrayVariableName
                        ];
                    let arrayKeys =
                        arrayStateVarDescription.getArrayKeysFromVarName({
                            arrayEntryPrefix: prefix,
                            varEnding: varName.substring(prefix.length),
                            numDimensions:
                                arrayStateVarDescription.numDimensions,
                        });
                    if (arrayKeys.length > 0) {
                        foundMatch = true;
                        break;
                    }
                }
            }

            if (foundMatch) {
                newVariables.push(stateVariable);
            } else {
                // no match, so make it a name that won't match
                newVariables.push("__not_public_" + stateVariable);
            }
        }

        return newVariables;
    }

    substituteAliases({ stateVariables, componentClass }) {
        let newVariables = [];

        let stateVarInfo =
            this.componentInfoObjects.stateVariableInfo[
                componentClass.componentType
            ];

        for (let stateVariable of stateVariables) {
            let isArraySize = false;
            if (stateVariable.substring(0, 13) === "__array_size_") {
                isArraySize = true;
                stateVariable = stateVariable.substring(13);
            }
            stateVariable =
                stateVariable in stateVarInfo.aliases
                    ? stateVarInfo.aliases[stateVariable]
                    : stateVariable;
            if (isArraySize) {
                stateVariable = "__array_size_" + stateVariable;
            }
            newVariables.push(stateVariable);
        }

        return newVariables;
    }

    publicCaseInsensitiveAliasSubstitutions({
        stateVariables,
        componentClass,
    }) {
        let mappedVarNames = this.findCaseInsensitiveMatches({
            stateVariables,
            componentClass,
        });

        mappedVarNames = this.matchPublicStateVariables({
            stateVariables: mappedVarNames,
            componentClass,
        });

        mappedVarNames = this.substituteAliases({
            stateVariables: mappedVarNames,
            componentClass,
        });

        return mappedVarNames;
    }

    checkIfArrayEntry({ stateVariable, component }) {
        // check if stateVariable begins when an arrayEntry
        for (let arrayEntryPrefix in component.arrayEntryPrefixes) {
            if (
                stateVariable.substring(0, arrayEntryPrefix.length) ===
                arrayEntryPrefix
            ) {
                let arrayVariableName =
                    component.arrayEntryPrefixes[arrayEntryPrefix];
                let arrayStateVarObj = component.state[arrayVariableName];
                let arrayKeys = arrayStateVarObj.getArrayKeysFromVarName({
                    arrayEntryPrefix,
                    varEnding: stateVariable.substring(arrayEntryPrefix.length),
                    numDimensions: arrayStateVarObj.numDimensions,
                });
                if (arrayKeys.length > 0) {
                    return {
                        isArrayEntry: true,
                        arrayVariableName,
                        arrayEntryPrefix,
                    };
                }
            }
        }

        return { isArrayEntry: false };
    }

    async createFromArrayEntry({
        stateVariable,
        component,
        initializeOnly = false,
    }) {
        if (!component.arrayEntryPrefixes) {
            throw Error(
                `Unknown state variable ${stateVariable} of ${component.componentIdx}`,
            );
        }

        let arrayEntryPrefixesLongestToShortest = Object.keys(
            component.arrayEntryPrefixes,
        ).sort((a, b) => b.length - a.length);

        // check if stateVariable begins when an arrayEntry
        for (let arrayEntryPrefix of arrayEntryPrefixesLongestToShortest) {
            if (
                stateVariable.substring(0, arrayEntryPrefix.length) ===
                arrayEntryPrefix
                // && stateVariable.length > arrayEntryPrefix.length
            ) {
                let arrayVariableName =
                    component.arrayEntryPrefixes[arrayEntryPrefix];
                let arrayStateVarObj = component.state[arrayVariableName];
                let arrayKeys = arrayStateVarObj.getArrayKeysFromVarName({
                    arrayEntryPrefix,
                    varEnding: stateVariable.substring(arrayEntryPrefix.length),
                    numDimensions: arrayStateVarObj.numDimensions,
                });

                if (arrayKeys.length > 0) {
                    // found a reference to an arrayEntry that hasn't been created yet
                    // create this arrayEntry

                    let arrayStateVariable =
                        component.arrayEntryPrefixes[arrayEntryPrefix];

                    await this.initializeStateVariable({
                        component,
                        stateVariable,
                        arrayStateVariable,
                        arrayEntryPrefix,
                    });

                    if (initializeOnly) {
                        return;
                    }

                    let allStateVariablesAffected = [stateVariable];
                    // create an additional array entry state variables
                    // specified as additional state variables defined
                    if (
                        component.state[stateVariable]
                            .additionalStateVariablesDefined
                    ) {
                        allStateVariablesAffected.push(
                            ...component.state[stateVariable]
                                .additionalStateVariablesDefined,
                        );
                        for (let additionalVar of component.state[stateVariable]
                            .additionalStateVariablesDefined) {
                            if (!component.state[additionalVar]) {
                                await this.createFromArrayEntry({
                                    stateVariable: additionalVar,
                                    component,
                                    initializeOnly: true,
                                });
                            }
                        }
                    }

                    await this.dependencies.setUpStateVariableDependencies({
                        component,
                        stateVariable,
                        allStateVariablesAffected,
                        core: this,
                    });

                    let newStateVariablesToResolve = [];

                    for (let varName of allStateVariablesAffected) {
                        this.dependencies.checkForCircularDependency({
                            componentIdx: component.componentIdx,
                            varName,
                        });

                        newStateVariablesToResolve.push(varName);
                    }

                    await this.dependencies.resolveStateVariablesIfReady({
                        component,
                        stateVariables: newStateVariablesToResolve,
                    });

                    return;
                }
            }
        }

        throw Error(
            `Unknown state variable ${stateVariable} of ${component.componentIdx}`,
        );
    }

    async markDescendantsToUpdateRenderers(component) {
        if (component.constructor.renderChildren) {
            let indicesToRender =
                await this.returnActiveChildrenIndicesToRender(component);
            for (let ind of indicesToRender) {
                let child = component.activeChildren[ind];
                this.updateInfo.componentsToUpdateRenderers.add(
                    child.componentIdx,
                );
                await this.markDescendantsToUpdateRenderers(child);
            }
        }
    }

    async markStateVariableAndUpstreamDependentsStale({ component, varName }) {
        // console.log(`mark state variable ${varName} of ${component.componentIdx} and updeps stale`)

        if (
            varName in
            this.rendererVariablesByComponentType[component.componentType]
        ) {
            this.updateInfo.componentsToUpdateRenderers.add(
                component.componentIdx,
            );
        }

        let allStateVariablesAffectedObj = {
            [varName]: component.state[varName],
        };
        if (component.state[varName].additionalStateVariablesDefined) {
            component.state[varName].additionalStateVariablesDefined.forEach(
                (x) => (allStateVariablesAffectedObj[x] = component.state[x]),
            );
        }

        let currentFreshnessInfo = await this.lookUpCurrentFreshness({
            component,
            varName,
            allStateVariablesAffectedObj,
        });
        let previouslyFreshVars = [];
        let previouslyEffectivelyFresh = [];
        let sumPreviouslyPartiallyFresh = 0;

        for (let vName in allStateVariablesAffectedObj) {
            let stateVarObj = allStateVariablesAffectedObj[vName];
            // if don't have a getter set, this indicates that, before this markStale function,
            // a state variable was fresh.
            if (
                !(
                    Object.getOwnPropertyDescriptor(stateVarObj, "value").get ||
                    stateVarObj.immutable
                )
            ) {
                previouslyFreshVars.push(vName);
            } else if (currentFreshnessInfo) {
                if (
                    currentFreshnessInfo.fresh &&
                    currentFreshnessInfo.fresh[vName]
                ) {
                    previouslyEffectivelyFresh.push(vName);
                } else if (
                    currentFreshnessInfo.partiallyFresh &&
                    currentFreshnessInfo.partiallyFresh[vName]
                ) {
                    sumPreviouslyPartiallyFresh +=
                        currentFreshnessInfo.partiallyFresh[vName];
                }
            }
        }

        previouslyEffectivelyFresh.push(...previouslyFreshVars);

        let aVarWasFreshOrPartiallyFresh =
            previouslyEffectivelyFresh.length > 0 ||
            sumPreviouslyPartiallyFresh > 0;

        let varsChanged = {};
        for (let vName in allStateVariablesAffectedObj) {
            varsChanged[vName] = true;
        }

        let freshnessDecreased = false;

        if (aVarWasFreshOrPartiallyFresh) {
            let result = await this.processMarkStale({
                component,
                varName,
                allStateVariablesAffectedObj,
            });

            if (result.fresh) {
                for (let vName in result.fresh) {
                    if (result.fresh[vName]) {
                        delete varsChanged[vName];
                    }
                }
            }

            let sumNewPartiallyFresh = 0;
            for (let vName in allStateVariablesAffectedObj) {
                if (
                    previouslyEffectivelyFresh.includes(vName) &&
                    !(result.fresh && result.fresh[vName])
                ) {
                    freshnessDecreased = true;
                    break;
                }
                if (result.partiallyFresh && result.partiallyFresh[vName]) {
                    sumNewPartiallyFresh += result.partiallyFresh[vName];
                }
            }

            if (sumNewPartiallyFresh < sumPreviouslyPartiallyFresh) {
                freshnessDecreased = true;
            }

            if (result.updateReplacements) {
                this.updateInfo.compositesToUpdateReplacements.add(
                    component.componentIdx,
                );
            }

            if (result.updateParentRenderedChildren) {
                // find ancestor that isn't a composite and mark it to update children to render
                for (let ancestorObj of component.ancestors) {
                    if (
                        !this.componentInfoObjects.allComponentClasses._composite.isPrototypeOf(
                            ancestorObj.componentCase,
                        )
                    ) {
                        // found non-composite ancestor
                        if (ancestorObj.componentClass.renderChildren) {
                            this.componentsWithChangedChildrenToRender.add(
                                ancestorObj.componentIdx,
                            );
                        }
                        break;
                    }
                }
            }

            if (result.updateRenderedChildren) {
                this.componentsWithChangedChildrenToRender.add(
                    component.componentIdx,
                );
            }

            if (result.updateDescendantRenderers) {
                await this.markDescendantsToUpdateRenderers(component);
            }

            if (result.updateActionChaining) {
                let chainObj =
                    this.updateInfo.componentsToUpdateActionChaining[
                        component.componentIdx
                    ];
                if (!chainObj) {
                    chainObj = this.updateInfo.componentsToUpdateActionChaining[
                        component.componentIdx
                    ] = [];
                }
                for (let vName in allStateVariablesAffectedObj) {
                    if (!chainObj.includes(vName)) {
                        chainObj.push(vName);
                    }
                }
            }

            if (result.updateDependencies) {
                for (let vName of result.updateDependencies) {
                    component.state[vName].needDependenciesUpdated = true;
                }
            }

            if (
                this.flags.autoSubmit &&
                result.answerCreditPotentiallyChanged
            ) {
                this.recordAnswerToAutoSubmit(component.componentIdx);
            }
        }

        for (let vName in varsChanged) {
            let stateVarObj = allStateVariablesAffectedObj[vName];

            // delete recursive dependency values, if they exist
            delete stateVarObj.recursiveDependencyValues;

            if (previouslyFreshVars.includes(vName)) {
                // save old value
                // mark stale by putting getter back in place to get a new value next time it is requested
                stateVarObj._previousValue = await stateVarObj.value;
                if (Array.isArray(stateVarObj._previousValue)) {
                    stateVarObj._previousValue = [
                        ...stateVarObj._previousValue,
                    ];
                }
                delete stateVarObj.value;
                let getStateVar = this.getStateVariableValue;
                Object.defineProperty(stateVarObj, "value", {
                    get: () => getStateVar({ component, stateVariable: vName }),
                    configurable: true,
                });
            }
        }

        // we recurse on upstream dependents
        if (freshnessDecreased) {
            for (let vName in varsChanged) {
                await this.markUpstreamDependentsStale({
                    component,
                    varName: vName,
                });
            }
        }
    }

    async lookUpCurrentFreshness({
        component,
        varName,
        allStateVariablesAffectedObj,
    }) {
        let stateVarObj = component.state[varName];

        if (!stateVarObj.getCurrentFreshness) {
            return;
        }

        let freshnessInfo = stateVarObj.freshnessInfo;

        let arrayKeys, arraySize;

        if (stateVarObj.isArrayEntry) {
            // have to use last calculated value of arrayKeys
            // because can't evaluate state variable in middle of marking stale

            // arrayKeys = new Proxy(stateVarObj._arrayKeys, readOnlyProxyHandler);
            arrayKeys = stateVarObj._arrayKeys;
        }

        if (stateVarObj.isArrayEntry || stateVarObj.isArray) {
            // have to use old value of arraySize
            // because can't evaluate state variable in middle of marking stale

            let arraySizeStateVar =
                component.state[stateVarObj.arraySizeStateVariable];
            arraySize = arraySizeStateVar._previousValue;
            let varWasFresh = !(
                Object.getOwnPropertyDescriptor(arraySizeStateVar, "value")
                    .get || arraySizeStateVar.immutable
            );
            if (varWasFresh) {
                arraySize = await arraySizeStateVar.value;
            }

            if (Array.isArray(arraySize)) {
                // arraySize = new Proxy(arraySize, readOnlyProxyHandler);
            } else {
                arraySize = [];
            }
        }

        let result = stateVarObj.getCurrentFreshness({
            freshnessInfo,
            arrayKeys,
            arraySize,
        });

        if (result.partiallyFresh) {
            // if have array entry, then intrepret partiallyfresh as indicating
            // freshness of array entry, not whole array
            for (let vName in allStateVariablesAffectedObj) {
                if (allStateVariablesAffectedObj[vName].isArrayEntry) {
                    let arrayName =
                        allStateVariablesAffectedObj[vName].arrayStateVariable;
                    result.partiallyFresh[vName] =
                        result.partiallyFresh[arrayName];
                    delete result.partiallyFresh[arrayName];
                }
            }
        }

        if (result.fresh) {
            // if have array entry, then intrepret fresh as indicating
            // freshness of array entry, not whole array
            for (let vName in allStateVariablesAffectedObj) {
                if (allStateVariablesAffectedObj[vName].isArrayEntry) {
                    let arrayName =
                        allStateVariablesAffectedObj[vName].arrayStateVariable;
                    if (arrayName in result.fresh) {
                        result.fresh[vName] = result.fresh[arrayName];
                        delete result.fresh[arrayName];
                    }
                }
            }
        }

        // console.log(`result of lookUpCurrentFreshness of ${varName} of ${component.componentIdx}`)
        // console.log(JSON.parse(JSON.stringify(result)))

        return result;
    }

    async processMarkStale({
        component,
        varName,
        allStateVariablesAffectedObj,
    }) {
        // if the stateVariable varName (or its array state variable)
        // has a markStale function, then run that function,
        // giving it arguments with information about what changed

        // markStale may change the freshnessInfo for varName (or its array state variable)
        // and will return an object with attributes
        // - fresh: if the variable is to be considered completely fresh,
        //   indicating the mark stale process should not recurse
        // - partiallyFresh: if the variable is partially fresh,
        //   indicating the mark stale process should recurse,
        //   but the variable should be marked to allow later mark stale
        //   processes that involve the variable to process the variable again
        // - other attributes that not processed in this function but returned

        let stateVarObj = component.state[varName];

        if (!stateVarObj.markStale || !stateVarObj.initiallyResolved) {
            let fresh = {};
            Object.keys(allStateVariablesAffectedObj).forEach(
                (x) => (fresh[x] = false),
            );
            return { fresh };
        }

        let changes = {};
        let downDeps =
            this.dependencies.downstreamDependencies[component.componentIdx][
                varName
            ];

        for (let dependencyName in downDeps) {
            let dep = downDeps[dependencyName];
            let depChanges = {};
            let foundDepChange = false;
            if (dep.componentIdentityChanged) {
                depChanges.componentIdentityChanged = true;
                foundDepChange = true;
            }
            if (dep.componentIdentitiesChanged) {
                depChanges.componentIdentitiesChanged = true;
                foundDepChange = true;
            }
            if (dep.valuesChanged) {
                depChanges.valuesChanged = dep.valuesChanged;
                foundDepChange = true;
            }
            if (foundDepChange) {
                changes[dependencyName] = depChanges;
            }
        }

        let freshnessInfo = stateVarObj.freshnessInfo;

        let arrayKeys, arraySize;

        if (stateVarObj.isArrayEntry) {
            // have to use last calculated value of arrayKeys
            // because can't evaluate state variable in middle of marking stale

            // arrayKeys = new Proxy(stateVarObj._arrayKeys, readOnlyProxyHandler);
            arrayKeys = stateVarObj._arrayKeys;
        }

        if (stateVarObj.isArrayEntry || stateVarObj.isArray) {
            // have to use old value of arraySize
            // because can't evaluate state variable in middle of marking stale

            let arraySizeStateVar =
                component.state[stateVarObj.arraySizeStateVariable];
            arraySize = arraySizeStateVar._previousValue;
            let varWasFresh = !(
                Object.getOwnPropertyDescriptor(arraySizeStateVar, "value")
                    .get || arraySizeStateVar.immutable
            );
            if (varWasFresh) {
                arraySize = await arraySizeStateVar.value;
            }

            if (Array.isArray(arraySize)) {
                // arraySize = new Proxy(arraySize, readOnlyProxyHandler);
            } else {
                arraySize = [];
            }
        }

        let result = stateVarObj.markStale({
            freshnessInfo,
            changes,
            arrayKeys,
            arraySize,
        });

        // console.log(`result of mark stale`, deepClone(result))

        if (result.partiallyFresh) {
            // if have array entry, then intrepret partiallyfresh as indicating
            // freshness of array entry, not whole array
            for (let vName in allStateVariablesAffectedObj) {
                if (allStateVariablesAffectedObj[vName].isArrayEntry) {
                    let arrayName =
                        allStateVariablesAffectedObj[vName].arrayStateVariable;
                    result.partiallyFresh[vName] =
                        result.partiallyFresh[arrayName];
                    delete result.partiallyFresh[arrayName];
                }
            }
        }

        if (result.fresh) {
            // if have array entry, then intrepret fresh as indicating
            // freshness of array entry, not whole array
            for (let vName in allStateVariablesAffectedObj) {
                if (allStateVariablesAffectedObj[vName].isArrayEntry) {
                    let arrayName =
                        allStateVariablesAffectedObj[vName].arrayStateVariable;
                    if (arrayName in result.fresh) {
                        result.fresh[vName] = result.fresh[arrayName];
                        delete result.fresh[arrayName];
                    }
                }
            }
        }

        // console.log(`result of process mark stale of ${varName} of ${component.componentIdx}`)
        // console.log(JSON.parse(JSON.stringify(result)))

        return result;
    }

    async markUpstreamDependentsStale({ component, varName }) {
        // Recursively mark every upstream dependency of component/varName as stale
        // If a state variable is already stale (has a getter in place)
        // then don't recurse
        // Before marking a stateVariable as stale, run markStale function, if it exists
        // Record additional information about the staleness from result of markStale,
        // and recurse only if markStale indicates variable is actually stale

        let componentIdx = component.componentIdx;
        let getStateVar = this.getStateVariableValue;

        // console.log(`marking upstream of ${varName} of ${componentIdx} as stale`);

        let upstream =
            this.dependencies.upstreamDependencies[componentIdx][varName];

        let freshnessInfo;

        if (component.state[varName]) {
            freshnessInfo = component.state[varName].freshnessInfo;
        }

        if (upstream) {
            for (let upDep of upstream) {
                // TODO: remove all these error checks to speed up process
                // once we're confident bugs have been removed?

                if (upDep.onlyToSetInInverseDefinition) {
                    continue;
                }

                let foundVarChange = false;

                if (upDep.markStale) {
                    await upDep.markStale();
                }

                if (upDep.downstreamComponentIndices) {
                    // this particular upstream dependency has multiple downstream components
                    // must find which one of those components correspond to current component

                    let componentInd =
                        upDep.downstreamComponentIndices.indexOf(componentIdx);
                    if (componentInd === -1) {
                        // presumably component was deleted
                        continue;
                    }

                    if (upDep.mappedDownstreamVariableNamesByComponent) {
                        // if have multiple components, there must be multiple variables
                        // ensure that varName is one of them
                        let varInd =
                            upDep.mappedDownstreamVariableNamesByComponent[
                                componentInd
                            ].indexOf(varName);
                        if (varInd === -1) {
                            throw Error(
                                `something went wrong as ${varName} not a downstreamVariable of ${upDep.dependencyName}`,
                            );
                        }

                        // records that component (index componentInd) and varName have changed
                        if (!upDep.valuesChanged) {
                            upDep.valuesChanged = [];
                        }
                        if (!upDep.valuesChanged[componentInd]) {
                            upDep.valuesChanged[componentInd] = {};
                        }
                        if (!upDep.valuesChanged[componentInd][varName]) {
                            upDep.valuesChanged[componentInd][varName] = {};
                        }
                        upDep.valuesChanged[componentInd][
                            varName
                        ].potentialChange = true;

                        // add any additional information about the stalename of component/varName
                        if (freshnessInfo) {
                            upDep.valuesChanged[componentInd][
                                varName
                            ].freshnessInfo = freshnessInfo;
                            // = new Proxy(freshnessInfo, readOnlyProxyHandler);
                        }

                        foundVarChange = true;
                    } else if (
                        varName === upDep.downstreamVariableNameIfNoVariables
                    ) {
                        // no original downstream variable names
                        // but matched the placeholder
                        // We just mark upDep as changed

                        if (!upDep.valuesChanged) {
                            upDep.valuesChanged = {
                                [upDep.downstreamVariableNameIfNoVariables]: {},
                            };
                        }

                        upDep.componentIdentityChanged = true;

                        upDep.valuesChanged[
                            upDep.downstreamVariableNameIfNoVariables
                        ].potentialChange = true;

                        foundVarChange = true;
                    }
                }

                if (foundVarChange) {
                    for (let varName of upDep.upstreamVariableNames) {
                        if (
                            varName in
                            this.rendererVariablesByComponentType[
                                this.components[upDep.upstreamComponentIdx]
                                    .componentType
                            ]
                        ) {
                            this.updateInfo.componentsToUpdateRenderers.add(
                                upDep.upstreamComponentIdx,
                            );
                            break;
                        }
                    }

                    let upVarName = upDep.upstreamVariableNames[0];
                    let upDepComponent =
                        this._components[upDep.upstreamComponentIdx];
                    // let upVar = upDepComponent.state[upVarName];

                    let allStateVariablesAffectedObj = {};
                    upDep.upstreamVariableNames.forEach(
                        (x) =>
                            (allStateVariablesAffectedObj[x] =
                                upDepComponent.state[x]),
                    );

                    let currentFreshnessInfo =
                        await this.lookUpCurrentFreshness({
                            component: upDepComponent,
                            varName: upVarName,
                            allStateVariablesAffectedObj,
                        });

                    let previouslyFreshVars = [];
                    let previouslyEffectivelyFresh = [];
                    let sumPreviouslyPartiallyFresh = 0;
                    for (let vName in allStateVariablesAffectedObj) {
                        let stateVarObj = allStateVariablesAffectedObj[vName];
                        // if don't have a getter set, this indicates that, before this markStale function,
                        // a state variable was fresh.
                        if (
                            !(
                                Object.getOwnPropertyDescriptor(
                                    stateVarObj,
                                    "value",
                                ).get || stateVarObj.immutable
                            )
                        ) {
                            previouslyFreshVars.push(vName);
                        } else if (currentFreshnessInfo) {
                            if (
                                currentFreshnessInfo.fresh &&
                                currentFreshnessInfo.fresh[vName]
                            ) {
                                previouslyEffectivelyFresh.push(vName);
                            } else if (
                                currentFreshnessInfo.partiallyFresh &&
                                currentFreshnessInfo.partiallyFresh[vName]
                            ) {
                                sumPreviouslyPartiallyFresh +=
                                    currentFreshnessInfo.partiallyFresh[vName];
                            }
                        }
                    }

                    previouslyEffectivelyFresh.push(...previouslyFreshVars);

                    let aVarWasFreshOrPartiallyFresh =
                        previouslyEffectivelyFresh.length > 0 ||
                        sumPreviouslyPartiallyFresh > 0;

                    let varsChanged = {};
                    for (let vName in allStateVariablesAffectedObj) {
                        varsChanged[vName] = true;
                    }

                    let freshnessDecreased = false;

                    if (aVarWasFreshOrPartiallyFresh) {
                        let result = await this.processMarkStale({
                            component: upDepComponent,
                            varName: upVarName,
                            allStateVariablesAffectedObj,
                        });

                        if (result.fresh) {
                            for (let vName in result.fresh) {
                                if (result.fresh[vName]) {
                                    delete varsChanged[vName];
                                }
                            }
                        }

                        let sumNewPartiallyFresh = 0;
                        for (let vName in allStateVariablesAffectedObj) {
                            if (
                                previouslyEffectivelyFresh.includes(vName) &&
                                !(result.fresh && result.fresh[vName])
                            ) {
                                freshnessDecreased = true;
                                break;
                            }
                            if (
                                result.partiallyFresh &&
                                result.partiallyFresh[vName]
                            ) {
                                sumNewPartiallyFresh +=
                                    result.partiallyFresh[vName];
                            }
                        }

                        if (
                            sumNewPartiallyFresh < sumPreviouslyPartiallyFresh
                        ) {
                            freshnessDecreased = true;
                        }

                        if (result.updateReplacements) {
                            this.updateInfo.compositesToUpdateReplacements.add(
                                upDep.upstreamComponentIdx,
                            );
                        }

                        if (result.updateParentRenderedChildren) {
                            // find ancestor that isn't a composite and mark it to update children to render
                            for (let ancestorObj of upDepComponent.ancestors) {
                                if (
                                    !this.componentInfoObjects.allComponentClasses._composite.isPrototypeOf(
                                        ancestorObj.componentCase,
                                    )
                                ) {
                                    // found non-composite ancestor
                                    if (
                                        ancestorObj.componentClass
                                            .renderChildren
                                    ) {
                                        this.componentsWithChangedChildrenToRender.add(
                                            ancestorObj.componentIdx,
                                        );
                                    }
                                    break;
                                }
                            }
                        }

                        if (result.updateRenderedChildren) {
                            this.componentsWithChangedChildrenToRender.add(
                                upDepComponent.componentIdx,
                            );
                        }

                        if (result.updateDescendantRenderers) {
                            await this.markDescendantsToUpdateRenderers(
                                upDepComponent,
                            );
                        }

                        if (result.updateActionChaining) {
                            let chainObj =
                                this.updateInfo
                                    .componentsToUpdateActionChaining[
                                    upDep.componentIdx
                                ];
                            if (!chainObj) {
                                chainObj =
                                    this.updateInfo.componentsToUpdateActionChaining[
                                        upDep.componentIdx
                                    ] = [];
                            }
                            for (let vName in allStateVariablesAffectedObj) {
                                if (!chainObj.includes(vName)) {
                                    chainObj.push(vName);
                                }
                            }
                        }

                        if (result.updateDependencies) {
                            for (let vName of result.updateDependencies) {
                                upDepComponent.state[
                                    vName
                                ].needDependenciesUpdated = true;
                            }
                        }

                        if (
                            this.flags.autoSubmit &&
                            result.answerCreditPotentiallyChanged
                        ) {
                            this.recordAnswerToAutoSubmit(
                                upDepComponent.componentIdx,
                            );
                        }
                    }

                    for (let vName in varsChanged) {
                        let stateVarObj = allStateVariablesAffectedObj[vName];

                        // delete recursive dependency values, if they exist
                        delete stateVarObj.recursiveDependencyValues;

                        if (previouslyFreshVars.includes(vName)) {
                            // save old value
                            // mark stale by putting getter back in place to get a new value next time it is requested
                            stateVarObj._previousValue =
                                await stateVarObj.value;
                            if (Array.isArray(stateVarObj._previousValue)) {
                                stateVarObj._previousValue = [
                                    ...stateVarObj._previousValue,
                                ];
                            }
                            delete stateVarObj.value;
                            Object.defineProperty(stateVarObj, "value", {
                                get: () =>
                                    getStateVar({
                                        component: upDepComponent,
                                        stateVariable: vName,
                                    }),
                                configurable: true,
                            });
                        }
                    }

                    // we recurse on upstream dependents
                    if (freshnessDecreased) {
                        for (let vName in varsChanged) {
                            await this.markUpstreamDependentsStale({
                                component: upDepComponent,
                                varName: vName,
                            });
                        }
                    }
                }
            }
        }
    }

    // evaluatedDeferredChildStateVariables(component) {
    //   for (let child of component.activeChildren) {
    //     if (child.componentType === "string") {
    //       for (let varName in child.state) {
    //         if (child.state[varName].deferred) {
    //           let evaluateSoNoLongerDeferred = child.state[varName].value;
    //         }
    //       }
    //     }
    //   }
    // }

    registerComponent(component) {
        if (this._components[component.componentIdx] !== undefined) {
            throw Error(`Duplicate component index: ${component.componentIdx}`);
        }
        this._components[component.componentIdx] = component;
    }

    deregisterComponent(component, recursive = true) {
        if (recursive === true) {
            for (let childIdxStr in component.allChildren) {
                this.deregisterComponent(
                    component.allChildren[childIdxStr].component,
                );
            }
        }

        delete this._components[component.componentIdx];
    }

    setAncestors(component, ancestors = []) {
        // set ancestors based on allChildren and attribute components
        // so that all components get ancestors
        // even if not activeChildren or definingChildren

        component.ancestors = ancestors;

        let ancestorsForChildren = [
            {
                componentIdx: component.componentIdx,
                componentClass: component.constructor,
            },
            ...component.ancestors,
        ];

        for (const childIdxStr in component.allChildren) {
            let unproxiedChild = this._components[childIdxStr];
            // Note: when add and deleting replacements of shadowed composites,
            // it is possible that we end up processing the defining children of ancestors of the composite
            // while we were delaying processing the defining children of the composite's parent,
            // which could lead to an attempt to set the ancestors of that composite's parent's children
            // while the booking variable allChildren is in an inconsistent state.
            // To avoid an error, we don't set ancestors in the case
            // (See test "references to internal and external components, inconsistent new namespaces"
            // from conditionalcontent.cy.js for an example that triggered the need for this check.)
            // TODO: can we avoid the need for this check by preventing the algorithm from
            // attempting to set ancestors in this case?
            if (unproxiedChild) {
                this.setAncestors(unproxiedChild, ancestorsForChildren);
            }
        }

        for (let attrName in component.attributes) {
            let comp = component.attributes[attrName].component;
            if (comp) {
                this.setAncestors(comp, ancestorsForChildren);
            }
        }
    }

    async addChildrenAndRecurseToShadows({
        parent,
        indexOfDefiningChildren,
        newChildren,
    }) {
        this.spliceChildren(parent, indexOfDefiningChildren, newChildren);

        let newChildrenResult = await this.processNewDefiningChildren({
            parent,
            expandComposites: true,
        });

        let addedComponents = {};
        let deletedComponents = {};

        if (!newChildrenResult.success) {
            // try again, this time force expanding composites before giving up
            newChildrenResult = await this.processNewDefiningChildren({
                parent,
                expandComposites: true,
                forceExpandComposites: true,
            });

            if (!newChildrenResult.success) {
                return newChildrenResult;
            }
        }

        for (let child of newChildren) {
            if (typeof child === "object") {
                addedComponents[child.componentIdx] = child;
            }
        }

        if (parent.shadowedBy) {
            for (let shadowingParent of parent.shadowedBy) {
                if (
                    shadowingParent.shadows.propVariable ||
                    shadowingParent.constructor.doNotExpandAsShadowed
                ) {
                    continue;
                }

                let composite =
                    this._components[shadowingParent.shadows.compositeIdx];

                let shadowingSerializeChildren = [];
                let nComponents = this._components.length;

                for (let child of newChildren) {
                    if (typeof child === "object") {
                        const serializedComponent = await child.serialize();

                        const res = createNewComponentIndices(
                            [serializedComponent],
                            nComponents,
                        );
                        nComponents = res.nComponents;

                        shadowingSerializeChildren.push(...res.components);
                    } else {
                        shadowingSerializeChildren.push(child);
                    }
                }

                if (nComponents > this.components.length) {
                    this._components[nComponents - 1] = undefined;
                }

                shadowingSerializeChildren = postProcessCopy({
                    serializedComponents: shadowingSerializeChildren,
                    componentIdx: shadowingParent.shadows.compositeIdx,
                });

                let unproxiedShadowingParent =
                    this._components[shadowingParent.componentIdx];
                this.parameterStack.push(
                    unproxiedShadowingParent.sharedParameters,
                    false,
                );

                let createResult = await this.createIsolatedComponents({
                    serializedComponents: shadowingSerializeChildren,
                    ancestors: shadowingParent.ancestors,
                });

                this.parameterStack.pop();

                let shadowResult = await this.addChildrenAndRecurseToShadows({
                    parent: unproxiedShadowingParent,
                    indexOfDefiningChildren,
                    newChildren: createResult.components,
                });

                if (!shadowResult.success) {
                    throw Error(
                        `was able to add components to parent but not shadows!`,
                    );
                }

                Object.assign(addedComponents, shadowResult.addedComponents);
            }
        }

        return {
            success: true,
            deletedComponents,
            addedComponents,
        };
    }

    async processNewDefiningChildren({
        parent,
        expandComposites = true,
        forceExpandComposites = false,
    }) {
        this.parameterStack.push(parent.sharedParameters, false);
        let childResult = await this.deriveChildResultsFromDefiningChildren({
            parent,
            expandComposites,
            forceExpandComposites,
        });
        this.parameterStack.pop();

        let ancestorsForChildren = [
            {
                componentIdx: parent.componentIdx,
                componentClass: parent.constructor,
            },
            ...parent.ancestors,
        ];

        // set ancestors for allChildren of parent
        // since could replace newChildren by adapters or via composites
        for (const childIdxStr in parent.allChildren) {
            let unproxiedChild = this._components[childIdxStr];
            this.setAncestors(unproxiedChild, ancestorsForChildren);
        }

        return childResult;
    }

    spliceChildren(parent, indexOfDefiningChildren, newChildren) {
        // splice newChildren into parent.definingChildren
        // definingChildrenNumber is the index of parent.definingChildren
        // before which to splice the newChildren (set to array length to add at end)

        let numDefiningChildren = parent.definingChildren.length;

        if (
            !Number.isInteger(indexOfDefiningChildren) ||
            indexOfDefiningChildren > numDefiningChildren ||
            indexOfDefiningChildren < 0
        ) {
            throw Error(
                "Can't add children at index " +
                    indexOfDefiningChildren +
                    ". Invalid index.",
            );
        }

        // perform the actual splicing into children
        parent.definingChildren.splice(
            indexOfDefiningChildren,
            0,
            ...newChildren,
        );
    }

    async deleteComponents({
        components,
        deleteUpstreamDependencies = true,
        skipProcessingChildrenOfParents = [],
    }) {
        // to delete a component, one must
        // 1. recursively delete all children and attribute components
        // 3. should we delete or mark components who are upstream dependencies?
        // 4. for all other downstream dependencies,
        //    delete upstream link back to component

        if (!Array.isArray(components)) {
            components = [components];
        }

        // TODO: if delete a shadow directly it should be an error
        // (though it will be OK to delete them through other side effects)

        // step 1. Determine which components to delete
        const componentsToDelete = {};
        this.determineComponentsToDelete({
            components,
            deleteUpstreamDependencies,
            componentsToDelete,
        });

        //Calculate parent set
        const parentsOfPotentiallyDeleted = {};
        for (const componentIdxStr in componentsToDelete) {
            const componentIdx = Number(componentIdxStr);
            let component = componentsToDelete[componentIdx];
            let parent = this.components[component.parentIdx];

            // only add parent if it is not in componentsToDelete itself
            if (
                parent === undefined ||
                parent.componentIdx in componentsToDelete
            ) {
                continue;
            }
            let parentObj = parentsOfPotentiallyDeleted[component.parentIdx];
            if (parentObj === undefined) {
                parentObj = {
                    parent: this._components[component.parentIdx],
                    childNamesToBeDeleted: new Set(),
                };
                parentsOfPotentiallyDeleted[component.parentIdx] = parentObj;
            }
            parentObj.childNamesToBeDeleted.add(componentIdx);
        }

        // if component is a replacement of another component,
        // need to delete component from the replacement
        // so that it isn't added back as a child of its parent
        // Also keep track of which ones deleted so can add back to replacements
        // if the deletion is unsuccessful
        let replacementsDeletedFromComposites = [];

        for (const componentIdxStr in componentsToDelete) {
            const componentIdx = Number(componentIdxStr);
            let component = this._components[componentIdx];
            if (component.replacementOf) {
                let composite = component.replacementOf;

                let replacementNames = composite.replacements.map(
                    (x) => x.componentIdx,
                );

                let replacementInd = replacementNames.indexOf(componentIdx);
                if (replacementInd !== -1) {
                    composite.replacements.splice(replacementInd, 1);
                    if (
                        !replacementsDeletedFromComposites.includes(
                            composite.componentIdx,
                        )
                    ) {
                        replacementsDeletedFromComposites.push(
                            composite.componentIdx,
                        );
                    }
                }
            }
        }

        for (const compositeIdxStr of replacementsDeletedFromComposites) {
            if (!(compositeIdxStr in componentsToDelete)) {
                await this.dependencies.addBlockersFromChangedReplacements(
                    this._components[compositeIdxStr],
                );
            }
        }

        // delete component from parent's defining children
        // and record parents
        const allParents = [];
        for (const parentIdxStr in parentsOfPotentiallyDeleted) {
            const parentObj = parentsOfPotentiallyDeleted[parentIdxStr];
            const parent = parentObj.parent;
            allParents.push(parent);

            // if (parent.activeChildren) {
            //   this.evaluatedDeferredChildStateVariables(parent);
            // }

            for (
                let ind = parent.definingChildren.length - 1;
                ind >= 0;
                ind--
            ) {
                const child = parent.definingChildren[ind];
                if (parentObj.childNamesToBeDeleted.has(child.componentIdx)) {
                    parent.definingChildren.splice(ind, 1); // delete from array
                }
            }

            if (
                !skipProcessingChildrenOfParents.includes(parent.componentIdx)
            ) {
                await this.processNewDefiningChildren({
                    parent,
                    expandComposites: false,
                });
            }
        }

        for (const componentIdxStr in componentsToDelete) {
            const componentIdx = Number(componentIdxStr);
            const component = this._components[componentIdx];

            if (component.shadows) {
                const shadowedComponent =
                    this._components[component.shadows.componentIdx];
                if (shadowedComponent.shadowedBy.length === 1) {
                    delete shadowedComponent.shadowedBy;
                } else {
                    shadowedComponent.shadowedBy.splice(
                        shadowedComponent.shadowedBy.indexOf(component),
                        1,
                    );
                }
            }

            this.dependencies.deleteAllDownstreamDependencies({ component });

            // record any upstream dependencies that depend directly on componentIdx
            // (componentIdentity, componentStateVariable*)

            for (let varName in this.dependencies.upstreamDependencies[
                component.componentIdx
            ]) {
                let upDeps =
                    this.dependencies.upstreamDependencies[
                        component.componentIdx
                    ][varName];
                for (let upDep of upDeps) {
                    if (
                        upDep.specifiedComponentName &&
                        upDep.specifiedComponentName in componentsToDelete
                    ) {
                        let dependenciesMissingComponent =
                            this.dependencies.updateTriggers
                                .dependenciesMissingComponentBySpecifiedName[
                                upDep.specifiedComponentName
                            ];
                        if (!dependenciesMissingComponent) {
                            dependenciesMissingComponent =
                                this.dependencies.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                                    upDep.specifiedComponentName
                                ] = [];
                        }
                        if (!dependenciesMissingComponent.includes(upDep)) {
                            dependenciesMissingComponent.push(upDep);
                        }
                    }
                }
            }

            await this.dependencies.deleteAllUpstreamDependencies({
                component,
            });

            if (
                !this.updateInfo.deletedStateVariables[component.componentIdx]
            ) {
                this.updateInfo.deletedStateVariables[component.componentIdx] =
                    [];
            }
            this.updateInfo.deletedStateVariables[component.componentIdx].push(
                ...Object.keys(component.state),
            );

            this.updateInfo.deletedComponents[component.componentIdx] = true;
            delete this.unmatchedChildren[component.componentIdx];

            delete this.stateVariableChangeTriggers[component.componentIdx];
        }

        const componentsToRemoveFromResolver = [];

        for (const componentIdxStr in componentsToDelete) {
            const componentIdx = Number(componentIdxStr);
            let component = this._components[componentIdx];

            if (component.replacementOf) {
                const compositeSource = component.replacementOf;

                if (
                    compositeSource.attributes.createComponentIdx?.primitive
                        ?.value == component.componentIdx
                ) {
                    // If the component's index is being created from a composite,
                    // check if there is a source of that composite index that is not being deleted.
                    // In that case, we should not remove the component from the resolver.
                    let compositeCreatingComponentIdx = compositeSource;

                    let foundUndeletedSourceOfComponentIdx = false;
                    while (true) {
                        if (
                            !(
                                compositeCreatingComponentIdx.componentIdx in
                                componentsToDelete
                            )
                        ) {
                            foundUndeletedSourceOfComponentIdx = true;
                            break;
                        }

                        if (
                            compositeCreatingComponentIdx.replacementOf
                                ?.attributes.createComponentIdx?.primitive
                                ?.value === component.componentIdx
                        ) {
                            compositeCreatingComponentIdx =
                                compositeCreatingComponentIdx.replacementOf;
                        } else {
                            break;
                        }
                    }

                    if (foundUndeletedSourceOfComponentIdx) {
                        // We determined that the source of the component's component index
                        // is not being deleted, so don't remove the component from the resolver
                        continue;
                    }
                }

                if (
                    !(compositeSource.componentIdx in componentsToDelete) &&
                    compositeSource.constructor.replacementsAlreadyInResolver
                ) {
                    // don't remove from resolver, as non-deleted composite source
                    // already has replacements in the resolver,
                    // so the component was not added to the resolver when it was created
                    continue;
                }
            }

            componentsToRemoveFromResolver.push(component);
        }

        this.removeComponentsFromResolver(componentsToRemoveFromResolver);

        for (const componentIdxStr in componentsToDelete) {
            const componentIdx = Number(componentIdxStr);
            let component = this._components[componentIdx];

            // console.log(`deregistering ${componentIdx}`)

            // don't use recursive form since all children should already be included
            this.deregisterComponent(component, false);

            // remove deleted components from this.updateInfo sets
            this.updateInfo.componentsToUpdateRenderers.delete(componentIdx);
            this.updateInfo.compositesToUpdateReplacements.delete(componentIdx);
            this.updateInfo.inactiveCompositesToUpdateReplacements.delete(
                componentIdx,
            );
        }

        return {
            success: true,
            deletedComponents: componentsToDelete,
            parentsOfDeleted: allParents,
        };
    }

    removeComponentsFromResolver(componentsToRemove) {
        if (componentsToRemove.length === 0) {
            return;
        }

        const flatElements = componentsToRemove.map((comp) => {
            let flatElement = {
                type: "element",
                name: comp.componentType,
                parent: comp.parentIdx,
                children: [],
                attributes: [],
                idx: comp.componentIdx,
            };

            if (comp.attributes.createComponentName && !comp.isExpanded) {
                flatElement.attributes.push({
                    type: "attribute",
                    name: "name",
                    parent: comp.parentIdx,
                    children: [
                        comp.attributes.createComponentName.primitive.value,
                    ],
                });
            } else if (comp.attributes.name) {
                flatElement.attributes.push({
                    type: "attribute",
                    name: "name",
                    parent: comp.parentIdx,
                    children: [comp.attributes.name.primitive.value],
                });
            }
            return flatElement;
        });

        if (this.deleteNodesFromResolver) {
            this.deleteNodesFromResolver({
                nodes: flatElements,
            });

            this.rootNames = this.calculateRootNames?.().names;
        }
    }

    determineComponentsToDelete({
        components,
        deleteUpstreamDependencies,
        componentsToDelete,
    }) {
        for (let component of components) {
            if (typeof component !== "object") {
                continue;
            }

            if (component.componentIdx in componentsToDelete) {
                continue;
            }

            // add unproxied component
            componentsToDelete[component.componentIdx] =
                this._components[component.componentIdx];

            // recurse on allChildren and attributes
            let componentsToRecurse = Object.values(component.allChildren).map(
                (x) => x.component,
            );

            for (let attrName in component.attributes) {
                let comp = component.attributes[attrName].component;
                if (comp) {
                    componentsToRecurse.push(comp);
                } else {
                    let references = component.attributes[attrName].references;
                    if (references) {
                        componentsToRecurse.push(...references);
                    }
                }
            }

            // if delete an adapter, also delete component it is adapting
            if (component.adaptedFrom !== undefined) {
                componentsToRecurse.push(component.adaptedFrom);
            }

            if (deleteUpstreamDependencies === true) {
                // TODO: recurse on copy of the component (other composites?)

                // recurse on components that shadow
                if (component.shadowedBy) {
                    componentsToRecurse.push(...component.shadowedBy);
                }

                // recurse on replacements and adapters
                if (component.adapterUsed) {
                    componentsToRecurse.push(component.adapterUsed);
                }
                if (component.replacements) {
                    componentsToRecurse.push(...component.replacements);
                }
            }

            this.determineComponentsToDelete({
                components: componentsToRecurse,
                deleteUpstreamDependencies,
                componentsToDelete,
            });
        }
    }

    async updateCompositeReplacements({
        component,
        componentChanges,
        sourceOfUpdate,
    }) {
        // console.log("updateCompositeReplacements " + component.componentIdx);

        let deletedComponents = {};
        let addedComponents = {};
        let parentsOfDeleted = new Set();

        if (
            component.shadows &&
            !component.shadows.propVariable &&
            !component.constructor.doNotExpandAsShadowed
        ) {
            // if shadows, don't update replacements
            // instead, replacements will get updated when shadowed component
            // is updated

            let results = {
                success: true,
                deletedComponents,
                addedComponents,
                parentsOfDeleted,
            };

            return results;
        }

        let proxiedComponent = this.components[component.componentIdx];

        if (!component.replacements) {
            component.replacements = [];
        }

        // evaluate readyToExpandWhenResolved
        // to make sure all dependencies needed to calculate
        // replacement changes are resolved
        // TODO: why must we evaluate and not just resolve it?
        await component.stateValues.readyToExpandWhenResolved;

        // Call the static function calculateReplacementChanges from the composite component
        // which returns the an array of replacement instructions that specify
        // changes to the replacements of the composite.
        // Arguments
        // component: the composite component
        // componentChanges: an array of changes made to the replacements of composites during the current update
        //   that was formerly used by composites to inform their replacement changes but is currently
        //   not used by any composites.  It is retained in case we need this information again.
        // components: all components in the document
        // workspace: an a composite can use to store information that can be share between
        //   the initial call to createSerializedReplacements and subsequence calls to calculateReplacementChanges
        // componentInfoObjects
        // flags
        // resolveItem: a function that the composite can use to resolve any state variables
        // publicCaseInsensitiveAliasSubstitutions: a function that can be used to find a case insensitive match
        //   to a public state variable, substituting aliases if necessary
        let initialNComponents;
        let replacementResults;
        do {
            initialNComponents = this.components.length;
            replacementResults =
                await component.constructor.calculateReplacementChanges({
                    component: proxiedComponent,
                    componentChanges,
                    components: this.components,
                    nComponents: this.components.length,
                    workspace: component.replacementsWorkspace,
                    componentInfoObjects: this.componentInfoObjects,
                    flags: this.flags,
                    resolveItem: this.dependencies.resolveItem.bind(
                        this.dependencies,
                    ),
                    publicCaseInsensitiveAliasSubstitutions:
                        this.publicCaseInsensitiveAliasSubstitutions.bind(this),
                });

            // If `this.components` changed in length while `calculateReplacementChanges` was executing,
            // it means that some other action (like calling another `calculateReplacementChanges`)
            // occurred while resolving state variables.
            // Since this would lead to collisions in assigned component indices, we rerun `calculateReplacementChanges`.
            // TODO: are there any scenarios where this will lead to an infinite loop?
        } while (this.components.length !== initialNComponents);

        if (component.constructor.stateVariableToEvaluateAfterReplacements) {
            await component.stateValues[
                component.constructor.stateVariableToEvaluateAfterReplacements
            ];
        }

        // console.log("replacement changes for " + component.componentIdx);
        // console.log(replacementResults);
        // console.log(component.replacements.map(x => x.componentIdx));
        // console.log(component.replacements);
        // console.log(component.unresolvedState);
        // console.log(component.unresolvedDependencies);

        // let changedReplacementIdentitiesOfComposites = [];

        if (replacementResults.nComponents > this.components.length) {
            this._components[replacementResults.nComponents - 1] = undefined;
        }

        // iterate through all replacement changes
        for (let change of replacementResults.replacementChanges) {
            let originalEffectiveLength =
                component.replacements.length -
                (component.replacementsToWithhold ?? 0);

            if (change.changeType === "add") {
                if (change.replacementsToWithhold !== undefined) {
                    await this.adjustReplacementsToWithhold({
                        component,
                        change,
                        componentChanges,
                    });

                    // adjust original effective length, as we may have adjusted index resolutions in resolver
                    originalEffectiveLength =
                        component.replacements.length -
                        (component.replacementsToWithhold ?? 0);
                }

                let unproxiedComponent =
                    this._components[component.componentIdx];
                this.parameterStack.push(
                    unproxiedComponent.sharedParameters,
                    false,
                );

                let newComponents;

                let currentShadowedBy = {
                    [component.componentIdx]:
                        calculateAllComponentsShadowing(component),
                };

                let numberToDelete = change.numberReplacementsToReplace;
                let firstIndex = change.firstReplacementInd;

                const updateOldReplacementsStart = Math.min(
                    originalEffectiveLength,
                    firstIndex,
                );
                const updateOldReplacementsEnd = Math.min(
                    originalEffectiveLength,
                    firstIndex + (numberToDelete ?? 0),
                );

                // determine which replacements are blank strings before deleting replacements
                const blankStringReplacements = component.replacements.map(
                    (repl) => typeof repl === "string" && repl.trim() === "",
                );

                if (numberToDelete > 0 && change.changeTopLevelReplacements) {
                    // delete replacements before creating new replacements so that can reuse componentNames
                    await this.deleteReplacementsFromShadowsThenComposite({
                        change,
                        composite: component,
                        componentChanges,
                        sourceOfUpdate,
                        parentsOfDeleted,
                        deletedComponents,
                        addedComponents,
                        processNewChildren: false,
                    });
                }

                if (!change.serializedReplacements) {
                    throw Error(`Invalid replacement change.`);
                }

                const serializedReplacements = change.serializedReplacements;

                const position =
                    this.components[component.componentIdx].position;
                const sourceDoc =
                    this.components[component.componentIdx].sourceDoc;
                const overwriteDoenetMLRange =
                    component.componentType === "_copy";

                this.gatherErrorsAndAssignDoenetMLRange({
                    components: serializedReplacements,
                    errors: [],
                    warnings: [],
                    position,
                    sourceDoc,
                    overwriteDoenetMLRange,
                });

                const newNComponents = change.nComponents;

                await this.addReplacementsToResolver({
                    serializedReplacements,
                    component,
                    updateOldReplacementsStart,
                    updateOldReplacementsEnd,
                    blankStringReplacements,
                });

                // expand `this._components` to length `newNComponents` so that the component indices will not be reused
                if (newNComponents > this._components.length) {
                    this._components[newNComponents - 1] = undefined;
                }

                try {
                    const createResult = await this.createIsolatedComponents({
                        serializedComponents: serializedReplacements,
                        ancestors: component.ancestors,
                        componentsReplacementOf: component,
                    });

                    newComponents = createResult.components;
                } catch (e) {
                    console.error(e);
                    // throw e;
                    newComponents = await this.setErrorReplacements({
                        composite: component,
                        message: e.message,
                    });
                }

                this.parameterStack.pop();

                const newReplacementsByComposite = {
                    [component.componentIdx]: {
                        newComponents,
                        parent: change.parent,
                    },
                };

                if (
                    unproxiedComponent.shadowedBy &&
                    currentShadowedBy[unproxiedComponent.componentIdx].length >
                        0
                ) {
                    const newReplacementsForShadows =
                        await this.createShadowedReplacements({
                            replacementsToShadow: newComponents,
                            componentToShadow: unproxiedComponent,
                            parentToShadow: change.parent,
                            currentShadowedBy,
                            componentChanges,
                            sourceOfUpdate,
                            parentsOfDeleted,
                            deletedComponents,
                            addedComponents,
                            updateOldReplacementsStart,
                            updateOldReplacementsEnd,
                            blankStringReplacements,
                        });

                    Object.assign(
                        newReplacementsByComposite,
                        newReplacementsForShadows,
                    );
                }

                for (const compositeIdxStr in newReplacementsByComposite) {
                    const compositeIdx = Number(compositeIdxStr);
                    const composite = this._components[compositeIdx];

                    // if composite was just deleted in previous pass of this loop, skip
                    if (!composite) {
                        continue;
                    }

                    const newReplacements =
                        newReplacementsByComposite[compositeIdx].newComponents;

                    if (!composite.isExpanded) {
                        await this.expandCompositeComponent(composite);

                        const newChange = {
                            changeType: "addedReplacements",
                            composite,
                            newReplacements: composite.replacements,
                            topLevel: true,
                            firstIndex: 0,
                            numberDeleted: 0,
                        };

                        componentChanges.push(newChange);

                        continue;
                    }

                    for (const comp of newReplacements) {
                        if (typeof comp === "object") {
                            addedComponents[comp.componentIdx] = comp;
                        }

                        // TODO: used to checkForDownstreamDependencies here
                        // Is this needed for new system?
                    }

                    if (change.changeTopLevelReplacements === true) {
                        const parent = this._components[composite.parentIdx];

                        // splice in new replacements
                        composite.replacements.splice(
                            firstIndex,
                            0,
                            ...newReplacements,
                        );
                        await this.dependencies.addBlockersFromChangedReplacements(
                            composite,
                        );

                        const newChange = {
                            changeType: "addedReplacements",
                            composite,
                            newReplacements,
                            topLevel: true,
                            firstIndex: firstIndex,
                            numberDeleted: numberToDelete,
                        };

                        componentChanges.push(newChange);

                        await this.processNewDefiningChildren({
                            parent,
                            expandComposites: false,
                        });

                        const componentsAffected =
                            await this.componentAndRenderedDescendants(parent);
                        componentsAffected.forEach((cIdx) =>
                            this.updateInfo.componentsToUpdateRenderers.add(
                                cIdx,
                            ),
                        );
                    } else {
                        // if not top level replacements

                        // TODO: check if change.parent is appropriate dependency of composite?

                        const parent =
                            this._components[
                                newReplacementsByComposite[compositeIdx].parent
                                    .componentIdx
                            ];

                        this.spliceChildren(
                            parent,
                            change.indexOfDefiningChildren,
                            newReplacements,
                        );

                        await this.processNewDefiningChildren({ parent });

                        for (const repl of newReplacements) {
                            if (typeof repl === "object") {
                                addedComponents[repl.componentIdx] = repl;
                            }
                        }

                        const componentsAffected =
                            await this.componentAndRenderedDescendants(parent);
                        componentsAffected.forEach((cIdx) =>
                            this.updateInfo.componentsToUpdateRenderers.add(
                                cIdx,
                            ),
                        );

                        const newChange = {
                            changeType: "addedReplacements",
                            composite,
                            newReplacements,
                        };

                        componentChanges.push(newChange);
                    }
                }
            } else if (change.changeType === "delete") {
                if (change.replacementsToWithhold !== undefined) {
                    await this.adjustReplacementsToWithhold({
                        component,
                        change,
                        componentChanges,
                    });
                }

                await this.deleteReplacementsFromShadowsThenComposite({
                    change,
                    composite: component,
                    componentsToDelete: change.components,
                    componentChanges,
                    sourceOfUpdate,
                    parentsOfDeleted,
                    deletedComponents,
                    addedComponents,
                });
            } else if (change.changeType === "updateStateVariables") {
                // TODO: check if component is appropriate dependency of composite

                const workspace = {};
                const newStateVariableValues = {};
                for (const stateVariable in change.stateChanges) {
                    const instruction = {
                        componentIdx: change.component.componentIdx,
                        stateVariable,
                        value: change.stateChanges[stateVariable],
                        overrideFixed: true,
                    };

                    await this.requestComponentChanges({
                        instruction,
                        initialChange: false,
                        workspace,
                        newStateVariableValues,
                    });
                }

                await this.processNewStateVariableValues(
                    newStateVariableValues,
                );
            } else if (change.changeType === "changeReplacementsToWithhold") {
                // don't change actual array of replacements
                // but just change those that will get added to activeChildren

                if (change.replacementsToWithhold !== undefined) {
                    await this.adjustReplacementsToWithhold({
                        component,
                        change,
                        componentChanges,
                        adjustResolver: true,
                    });
                }

                await this.processChildChangesAndRecurseToShadows(component);
            }
        }

        const results = {
            success: true,
            deletedComponents,
            addedComponents,
            parentsOfDeleted,
        };

        return results;
    }

    async setErrorReplacements({ composite, message }) {
        // display error for replacements and set composite to error state

        this.addErrorWarning({
            type: "error",
            message,
            position: composite.position,
            sourceDoc: composite.sourceDoc,
        });
        let errorReplacements = [
            {
                type: "serialized",
                componentType: "_error",
                componentIdx: this._components.length,
                state: { message },
                doenetAttributes: { createUniqueName: true },
                position: composite.position,
                sourceDoc: composite.sourceDoc,
                children: [],
                attributes: {},
            },
        ];

        this._components[this._components.length] = undefined;

        composite.isInErrorState = true;

        let createResult = await this.createIsolatedComponents({
            serializedComponents: errorReplacements,
            ancestors: composite.ancestors,
            componentsReplacementOf: composite,
        });

        return createResult.components;
    }

    async deleteReplacementsFromShadowsThenComposite({
        change,
        composite,
        componentsToDelete,
        componentChanges,
        sourceOfUpdate,
        parentsOfDeleted,
        deletedComponents,
        addedComponents,
        processNewChildren = true,
    }) {
        let compositesDeletedFrom = [];

        if (!composite.isExpanded) {
            return compositesDeletedFrom;
        }

        if (composite.shadowedBy) {
            for (let shadowingComposite of composite.shadowedBy) {
                if (
                    shadowingComposite.shadows.propVariable ||
                    shadowingComposite.constructor.doNotExpandAsShadowed
                ) {
                    continue;
                }

                let shadowingComponentsToDelete;

                if (componentsToDelete) {
                    shadowingComponentsToDelete = [];
                    for (let compToDelete of componentsToDelete) {
                        let shadowingCompToDelete;
                        if (compToDelete.shadowedBy) {
                            for (let cShadow of compToDelete.shadowedBy) {
                                if (
                                    cShadow.shadows.propVariable ||
                                    cShadow.constructor.doNotExpandAsShadowed
                                ) {
                                    continue;
                                }
                                if (
                                    cShadow.shadows.compositeIdx ===
                                    shadowingComposite.shadows.compositeIdx
                                ) {
                                    shadowingCompToDelete = cShadow;
                                    break;
                                }
                            }
                        }
                        if (!shadowingCompToDelete) {
                            console.error(
                                `could not find shadowing component of ${compToDelete.componentIdx}`,
                            );
                        } else {
                            shadowingComponentsToDelete.push(
                                shadowingCompToDelete,
                            );
                        }
                    }
                }

                let additionalCompositesDeletedFrom =
                    await this.deleteReplacementsFromShadowsThenComposite({
                        change,
                        composite: shadowingComposite,
                        componentsToDelete: shadowingComponentsToDelete,
                        componentChanges,
                        sourceOfUpdate,
                        parentsOfDeleted,
                        deletedComponents,
                        addedComponents,
                        processNewChildren,
                    });

                compositesDeletedFrom.push(...additionalCompositesDeletedFrom);
            }
        }

        if (change.changeTopLevelReplacements) {
            let firstIndex = change.firstReplacementInd;
            let numberToDelete = change.numberReplacementsToDelete;
            if (change.changeType === "add") {
                numberToDelete = change.numberReplacementsToReplace;
            }

            // delete from replacements
            let replacementsToDelete = composite.replacements.splice(
                firstIndex,
                numberToDelete,
            );
            await this.dependencies.addBlockersFromChangedReplacements(
                composite,
            );

            // TODO: why does this delete delete upstream components
            // but the non toplevel delete doesn't?
            let deleteResults = await this.deleteComponents({
                components: replacementsToDelete,
                componentChanges,
                sourceOfUpdate,
                skipProcessingChildrenOfParents: [composite.parentIdx],
            });

            if (processNewChildren) {
                // since skipped, process children now but without expanding composites
                await this.processNewDefiningChildren({
                    parent: this._components[composite.parentIdx],
                    expandComposites: false,
                });
            }

            if (deleteResults.success === false) {
                throw Error("Couldn't delete components on composite update");
            }
            for (let parent of deleteResults.parentsOfDeleted) {
                parentsOfDeleted.add(parent.componentIdx);
                let componentsAffected =
                    await this.componentAndRenderedDescendants(parent);
                componentsAffected.forEach((cIdx) =>
                    this.updateInfo.componentsToUpdateRenderers.add(cIdx),
                );
            }
            let deletedNamesByParent = {};
            for (let compName in deleteResults.deletedComponents) {
                let comp = deleteResults.deletedComponents[compName];
                let par = comp.parentIdx;
                if (deletedNamesByParent[par] === undefined) {
                    deletedNamesByParent[par] = [];
                }
                deletedNamesByParent[par].push(compName);
            }
            let newChange = {
                changeType: "deletedReplacements",
                composite,
                topLevel: true,
                firstIndex: firstIndex,
                numberDeleted: numberToDelete,
                deletedNamesByParent: deletedNamesByParent,
                deletedComponents: deleteResults.deletedComponents,
            };
            componentChanges.push(newChange);
            Object.assign(deletedComponents, deleteResults.deletedComponents);
            let parent = this._components[composite.parentIdx];
            let componentsAffected =
                await this.componentAndRenderedDescendants(parent);
            componentsAffected.forEach((cIdx) =>
                this.updateInfo.componentsToUpdateRenderers.add(cIdx),
            );
        } else {
            // if not change top level replacements
            let numberToDelete = componentsToDelete.length;
            // TODO: check if components are appropriate dependency of composite
            let deleteResults = await this.deleteComponents({
                components: componentsToDelete,
                deleteUpstreamDependencies: false,
                componentChanges: componentChanges,
                sourceOfUpdate: sourceOfUpdate,
            });
            if (deleteResults.success === false) {
                throw Error(
                    "Couldn't delete components prescribed by composite",
                );
            }
            for (let parent of deleteResults.parentsOfDeleted) {
                parentsOfDeleted.add(parent.componentIdx);
                let componentsAffected =
                    await this.componentAndRenderedDescendants(parent);
                componentsAffected.forEach((cIdx) =>
                    this.updateInfo.componentsToUpdateRenderers.add(cIdx),
                );
            }
            let deletedNamesByParent = {};
            for (let compName in deleteResults.deletedComponents) {
                let comp = deleteResults.deletedComponents[compName];
                let par = comp.parentIdx;
                if (deletedNamesByParent[par] === undefined) {
                    deletedNamesByParent[par] = [];
                }
                deletedNamesByParent[par].push(compName);
            }
            let newChange = {
                changeType: "deletedReplacements",
                composite,
                numberDeleted: numberToDelete,
                deletedNamesByParent: deletedNamesByParent,
                deletedComponents: deleteResults.deletedComponents,
            };
            componentChanges.push(newChange);
            Object.assign(deletedComponents, deleteResults.deletedComponents);
            Object.assign(addedComponents, deleteResults.addedComponents);
        }

        return compositesDeletedFrom;
    }

    async processChildChangesAndRecurseToShadows(component) {
        let parent = this._components[component.parentIdx];
        await this.processNewDefiningChildren({
            parent,
            expandComposites: false,
        });
        let componentsAffected =
            await this.componentAndRenderedDescendants(parent);
        componentsAffected.forEach((cIdx) =>
            this.updateInfo.componentsToUpdateRenderers.add(cIdx),
        );

        if (component.shadowedBy) {
            for (let shadowingComponent of component.shadowedBy) {
                if (
                    shadowingComponent.shadows.propVariable ||
                    shadowingComponent.constructor.doNotExpandAsShadowed
                ) {
                    continue;
                }
                await this.processChildChangesAndRecurseToShadows(
                    shadowingComponent,
                );
            }
        }
    }

    async createShadowedReplacements({
        replacementsToShadow,
        componentToShadow,
        parentToShadow,
        currentShadowedBy,
        componentChanges,
        sourceOfUpdate,
        parentsOfDeleted,
        deletedComponents,
        addedComponents,
        updateOldReplacementsStart,
        updateOldReplacementsEnd,
        blankStringReplacements,
    }) {
        let newShadowedBy = calculateAllComponentsShadowing(componentToShadow);

        if (
            !currentShadowedBy[componentToShadow.componentIdx] ||
            !newShadowedBy.every((x) =>
                currentShadowedBy[componentToShadow.componentIdx].includes(x),
            )
        ) {
            // If components shadowing componentToShadow increased
            // that means it is shadowed by one of its newly created replacements
            // so we have a circular dependency
            throw Error(
                `Circular dependency involving ${componentToShadow.componentIdx}.`,
            );
        }

        // use compositesBeingExpanded to look for circular dependency
        this.updateInfo.compositesBeingExpanded.push(
            componentToShadow.componentIdx,
        );

        let newComponentsForShadows = {};

        for (let shadowingComponent of componentToShadow.shadowedBy) {
            if (
                shadowingComponent.shadows.propVariable ||
                shadowingComponent.constructor.doNotExpandAsShadowed
            ) {
                continue;
            }

            if (
                this.updateInfo.compositesBeingExpanded.includes(
                    shadowingComponent.componentIdx,
                )
            ) {
                throw Error(
                    `Circular dependency involving ${shadowingComponent.componentIdx}.`,
                );
            }

            if (shadowingComponent.shadowedBy) {
                currentShadowedBy[shadowingComponent.componentIdx] =
                    calculateAllComponentsShadowing(shadowingComponent);
            }

            if (shadowingComponent.isExpanded) {
                let newSerializedReplacements = [];

                let nComponents = this._components.length;
                let newNComponents = nComponents;
                for (let repl of replacementsToShadow) {
                    if (typeof repl === "object") {
                        const serializedComponent = await repl.serialize();

                        const res = createNewComponentIndices(
                            [serializedComponent],
                            newNComponents,
                        );
                        newNComponents = res.nComponents;

                        newSerializedReplacements.push(...res.components);
                    } else {
                        newSerializedReplacements.push(repl);
                    }
                }

                this.adjustForCreateComponentIdxName(
                    newSerializedReplacements,
                    shadowingComponent,
                );

                // In this, we override `replacementsAlreadyInResolver` for groups,
                // because if they get new replacements from a composite they are shadowing,
                // they wouldn't have had them when the group was originally created.
                await this.addReplacementsToResolver({
                    serializedReplacements: newSerializedReplacements,
                    component: shadowingComponent,
                    overrideReplacementsAlreadyInResolver: true,
                    updateOldReplacementsStart,
                    updateOldReplacementsEnd,
                    blankStringReplacements,
                });

                // expand `this._components` to length `newNComponents` so that the component indices will not be reused
                if (newNComponents > this._components.length) {
                    this._components[newNComponents - 1] = undefined;
                }

                newSerializedReplacements = postProcessCopy({
                    serializedComponents: newSerializedReplacements,
                    componentIdx: shadowingComponent.shadows.compositeIdx,
                });

                // TODO: is isResponse the only attribute to convert?
                if (shadowingComponent.attributes.isResponse) {
                    let compositeAttributesObj =
                        shadowingComponent.constructor.createAttributesObject();

                    for (let repl of newSerializedReplacements) {
                        if (typeof repl !== "object") {
                            continue;
                        }

                        // add attributes
                        if (!repl.attributes) {
                            repl.attributes = {};
                        }
                        let nComponents = this._components.length;
                        const res = convertUnresolvedAttributesForComponentType(
                            {
                                attributes: {
                                    isResponse:
                                        shadowingComponent.attributes
                                            .isResponse,
                                },
                                componentType: repl.componentType,
                                componentInfoObjects: this.componentInfoObjects,
                                compositeAttributesObj,
                                nComponents,
                            },
                        );

                        const attributesFromComposite = res.attributes;
                        nComponents = res.nComponents;
                        if (nComponents > this.components.length) {
                            this._components[nComponents - 1] = undefined;
                        }

                        Object.assign(repl.attributes, attributesFromComposite);
                    }
                }

                // console.log(
                //     `newSerializedReplacements for ${shadowingComponent.componentIdx} who shadows ${shadowingComponent.shadows.componentIdx}`,
                // );
                // console.log(deepClone(newSerializedReplacements));

                let newComponents;

                let unproxiedShadowingComponent =
                    this._components[shadowingComponent.componentIdx];
                this.parameterStack.push(
                    unproxiedShadowingComponent.sharedParameters,
                    false,
                );

                try {
                    let createResult = await this.createIsolatedComponents({
                        serializedComponents: newSerializedReplacements,
                        ancestors: shadowingComponent.ancestors,
                        componentsReplacementOf: shadowingComponent,
                    });
                    newComponents = createResult.components;
                } catch (e) {
                    console.error(e);
                    // throw e;
                    newComponents = await this.setErrorReplacements({
                        composite: shadowingComponent,
                        message: e.message,
                    });
                }

                this.parameterStack.pop();

                let shadowingParent;
                if (parentToShadow) {
                    if (parentToShadow.shadowedBy) {
                        for (let pShadow of parentToShadow.shadowedBy) {
                            if (
                                pShadow.shadows.propVariable ||
                                pShadow.constructor.doNotExpandAsShadowed
                            ) {
                                continue;
                            }
                            if (
                                pShadow.shadows.compositeIdx ===
                                shadowingComponent.shadows.compositeIdx
                            ) {
                                shadowingParent = pShadow;
                                break;
                            }
                        }
                    }
                    if (!shadowingParent) {
                        console.error(
                            `could not find shadowing parent of ${parentToShadow.componentIdx}`,
                        );
                    }
                }

                newComponentsForShadows[shadowingComponent.componentIdx] = {
                    newComponents,
                    parent: shadowingParent,
                };

                if (
                    shadowingComponent.shadowedBy &&
                    currentShadowedBy[shadowingComponent.componentIdx].length >
                        0
                ) {
                    let recursionComponents =
                        await this.createShadowedReplacements({
                            replacementsToShadow: newComponents,
                            componentToShadow: shadowingComponent,
                            parentToShadow: shadowingParent,
                            currentShadowedBy,
                            componentChanges,
                            sourceOfUpdate,
                            parentsOfDeleted,
                            deletedComponents,
                            addedComponents,
                            updateOldReplacementsStart,
                            updateOldReplacementsEnd,
                            blankStringReplacements,
                        });
                    Object.assign(newComponentsForShadows, recursionComponents);
                }
            }
        }

        // record that are finished expanding the composite
        let targetInd = this.updateInfo.compositesBeingExpanded.indexOf(
            componentToShadow.componentIdx,
        );
        if (targetInd === -1) {
            throw Error(
                `Something is wrong as we lost track that we were expanding ${componentToShadow.componentIdx}`,
            );
        }
        this.updateInfo.compositesBeingExpanded.splice(targetInd, 1);

        return newComponentsForShadows;
    }

    async adjustReplacementsToWithhold({
        component,
        change,
        componentChanges,
        adjustResolver = false,
    }) {
        let compositesWithAdjustedReplacements = [];

        let replacementsToWithhold = change.replacementsToWithhold;

        let changeInReplacementsToWithhold;
        if (component.replacementsToWithhold !== undefined) {
            changeInReplacementsToWithhold =
                replacementsToWithhold - component.replacementsToWithhold;
        } else {
            changeInReplacementsToWithhold = replacementsToWithhold;
        }
        if (changeInReplacementsToWithhold < 0) {
            compositesWithAdjustedReplacements.push(component.componentIdx);
            // Note: don't subtract one of this last ind, as slice doesn't include last ind
            let lastIndToStopWithholding =
                component.replacements.length - replacementsToWithhold;
            let firstIndToStopWithholding =
                component.replacements.length -
                replacementsToWithhold +
                changeInReplacementsToWithhold;
            let newReplacements = component.replacements.slice(
                firstIndToStopWithholding,
                lastIndToStopWithholding,
            );
            let newChange = {
                changeType: "addedReplacements",
                composite: component,
                topLevel: true,
                newReplacements: newReplacements,
                firstIndex: firstIndToStopWithholding,
                numberDeleted: 0,
            };

            componentChanges.push(newChange);
        } else if (changeInReplacementsToWithhold > 0) {
            compositesWithAdjustedReplacements.push(component.componentIdx);
            let firstIndToStartWithholding =
                component.replacements.length - replacementsToWithhold;
            let lastIndToStartWithholding =
                firstIndToStartWithholding + changeInReplacementsToWithhold;
            let withheldReplacements = component.replacements.slice(
                firstIndToStartWithholding,
                lastIndToStartWithholding,
            );
            let withheldNamesByParent = {};
            for (let comp of withheldReplacements) {
                let par = comp.parentIdx;
                if (withheldNamesByParent[par] === undefined) {
                    withheldNamesByParent[par] = [];
                }
                withheldNamesByParent[par].push(comp.componentIdx);
            }
            let newChange = {
                changeType: "deletedReplacements",
                composite: component,
                topLevel: true,
                firstIndex: firstIndToStartWithholding,
                numberDeleted: changeInReplacementsToWithhold,
                deletedNamesByParent: withheldNamesByParent,
                deletedComponents: withheldReplacements,
            };
            componentChanges.push(newChange);
        }

        if (adjustResolver) {
            const blankStringReplacements = component.replacements.map(
                (repl) => typeof repl === "string" && repl.trim() === "",
            );

            const { indexResolution } =
                await this.determineParentAndIndexResolutionForResolver({
                    component,
                    updateOldReplacementsStart: 0,
                    updateOldReplacementsEnd:
                        component.replacements.length -
                        (component.replacementsToWithhold ?? 0),
                    blankStringReplacements,
                });

            let indexParent =
                indexResolution.ReplaceAll?.parent ??
                indexResolution.ReplaceRange?.parent ??
                null;

            if (
                indexParent !== null &&
                indexParent !== component.componentIdx
            ) {
                const indexParentComposite = this._components[indexParent];

                if (indexParentComposite) {
                    if (this.replaceIndexResolutionsInResolver) {
                        const newContentForIndex = component.replacements
                            .slice(
                                0,
                                component.replacements.length -
                                    change.replacementsToWithhold,
                            )
                            .map((repl) => {
                                if (typeof repl === "string") {
                                    return repl;
                                } else {
                                    return repl.componentIdx;
                                }
                            });

                        this.replaceIndexResolutionsInResolver(
                            { content: newContentForIndex },
                            indexResolution,
                        );

                        this.rootNames = this.calculateRootNames?.();

                        await this.dependencies.addBlockersFromChangedReplacements(
                            indexParentComposite,
                        );
                    }
                }
            }
        }

        component.replacementsToWithhold = replacementsToWithhold;
        await this.dependencies.addBlockersFromChangedReplacements(component);

        if (component.shadowedBy) {
            for (let shadowingComponent of component.shadowedBy) {
                if (
                    shadowingComponent.shadows.propVariable ||
                    shadowingComponent.constructor.doNotExpandAsShadowed
                ) {
                    continue;
                }
                let additionalcompositesWithAdjustedReplacements =
                    await this.adjustReplacementsToWithhold({
                        component: shadowingComponent,
                        change,
                        componentChanges,
                        adjustResolver,
                    });
                compositesWithAdjustedReplacements.push(
                    ...additionalcompositesWithAdjustedReplacements,
                );
            }
        }

        return compositesWithAdjustedReplacements;
    }

    get rendererTypesInDocument() {
        return this.document.allPotentialRendererTypes;
    }

    get components() {
        // return new Proxy(this._components, readOnlyProxyHandler);
        return this._components;
    }

    set components(value) {
        return null;
    }

    async executeProcesses() {
        if (this.stopProcessingRequests) {
            return;
        }

        while (this.processQueue.length > 0) {
            let nextUpdateInfo = this.processQueue.splice(0, 1)[0];
            let result;
            try {
                if (nextUpdateInfo.type === "update") {
                    if (
                        !nextUpdateInfo.skippable ||
                        this.processQueue.length < 2
                    ) {
                        result = await this.performUpdate(nextUpdateInfo);
                    }

                    // TODO: if skip an update, presumably we should call reject???

                    // } else if (nextUpdateInfo.type === "getStateVariableValues") {
                    //   result = await this.performGetStateVariableValues(nextUpdateInfo);
                } else if (nextUpdateInfo.type === "action") {
                    if (
                        !nextUpdateInfo.skippable ||
                        this.processQueue.length < 2
                    ) {
                        result = await this.performAction(nextUpdateInfo);
                    }

                    // TODO: if skip an update, presumably we should call reject???
                } else if (nextUpdateInfo.type === "recordEvent") {
                    result = await this.performRecordEvent(nextUpdateInfo);
                } else {
                    throw Error(
                        `Unrecognized process type: ${nextUpdateInfo.type}`,
                    );
                }

                nextUpdateInfo.resolve(result);
            } catch (e) {
                console.error(e);
                nextUpdateInfo.reject(
                    typeof e === "object" &&
                        e &&
                        "message" in e &&
                        typeof e.message === "string"
                        ? e.message
                        : "Error in core",
                );
            }
        }

        this.processing = false;
    }

    requestAction({ componentIdx, actionName, args }) {
        return new Promise((resolve, reject) => {
            let skippable = args?.skippable;

            this.processQueue.push({
                type: "action",
                componentIdx,
                actionName,
                args,
                skippable,
                resolve,
                reject,
            });

            if (!this.processing) {
                this.processing = true;
                this.executeProcesses();
            }
        });
    }

    async performAction({
        componentIdx,
        actionName,
        args,
        event,
        caseInsensitiveMatch,
    }) {
        if (actionName === "setTheme" && componentIdx === undefined) {
            // For now, co-opting the action mechanism to let the viewer set the theme (dark mode) on document.
            // Don't have an actual action on document as don't want the ability for others to call it.
            // Theme doesn't affect the colors displayed, only the words in the styleDescriptions.
            try {
                await this.performUpdate({
                    updateInstructions: [
                        {
                            updateType: "updateValue",
                            componentIdx: this.documentIdx,
                            stateVariable: "theme",
                            value: args.theme,
                        },
                    ],
                    actionId: args.actionId,
                    doNotSave: true, // this isn't an interaction, so don't save doc state
                });
            } catch (e) {
                console.error(e);
                throw e;
            }

            return { actionId: args.actionId };
        }

        let component = this.components[componentIdx];
        if (component && component.actions) {
            let action = component.actions[actionName];
            if (!action && caseInsensitiveMatch) {
                let actionNameLower = actionName.toLowerCase();
                for (let aName in component.actions) {
                    if (aName.toLowerCase() === actionNameLower) {
                        action = component.actions[aName];
                        actionName = aName;
                        break;
                    }
                }
            }
            if (action) {
                if (event) {
                    this.requestRecordEvent(event);
                }
                if (!args) {
                    args = {};
                }
                try {
                    await action(args);
                } catch (e) {
                    console.error(e);
                    throw e;
                }
                return { actionId: args.actionId };
            }
        }

        if (
            !component &&
            actionName === "recordVisibilityChange" &&
            args?.isVisible === false
        ) {
            // We have an action to record that a component is no longer visible
            // and the component has been deleted.
            // Record a visibility changed event
            // Note: don't know componentType, but componentType isn't preserved when summarize visibility events
            this.requestRecordEvent({
                verb: "visibilityChanged",
                object: {
                    componentIdx,
                },
                result: { isVisible: false },
            });
            return { actionId: args.actionId };
        }

        if (component) {
            this.addErrorWarning({
                type: "warning",
                message: `Cannot run action ${actionName} on component ${componentIdx}`,
                level: 1,
                position: component.position,
                sourceDoc: component.sourceDoc,
            });
        }

        return {};
    }

    async triggerChainedActions({
        componentIdx,
        triggeringAction,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        for (const cIdxStr in this.updateInfo
            .componentsToUpdateActionChaining) {
            await this.checkForActionChaining({
                component: this.components[cIdxStr],
                stateVariables:
                    this.updateInfo.componentsToUpdateActionChaining[cIdxStr],
            });
        }

        this.updateInfo.componentsToUpdateActionChaining = {};

        let actionsToChain = [];

        let cIdx = componentIdx;

        while (true) {
            let comp = this._components[cIdx];
            let id = cIdx;

            if (triggeringAction) {
                id += "|" + triggeringAction;
            }

            if (this.actionsChangedToActions[id]) {
                actionsToChain.push(...this.actionsChangedToActions[id]);
            }

            if (comp?.shadows) {
                let composite = this._components[comp.shadows.compositeIdx];
                if (composite.attributes.createComponentOfType != null) {
                    break;
                }

                // We propagate to shadows if the component was copied with a bare references such as `$P`
                // but not if was copied via extend/copy attribute, such as `<point extend="$P" />
                // Rationale:
                // If we include $P in a graph,
                // then triggerWhenObjectsClicked="$P" and triggerWhenObjectsFocused="$P"
                // will be triggered by that reference, which is what authors would expect.
                // Another use case is defining an <updateValue name="uv">,
                // along with other triggered actions using triggerWith="$uv",
                // inside a <setup> and then including a $uv
                // where we want the button to be.

                cIdx = comp.shadows.componentIdx;
            } else {
                break;
            }
        }

        for (let chainedActionInstructions of actionsToChain) {
            chainedActionInstructions = { ...chainedActionInstructions };
            if (chainedActionInstructions.args) {
                chainedActionInstructions.args = {
                    ...chainedActionInstructions.args,
                };
            } else {
                chainedActionInstructions.args = {};
            }
            chainedActionInstructions.args.skipRendererUpdate = true;
            await this.performAction(chainedActionInstructions);
        }

        if (!skipRendererUpdate) {
            await this.updateAllChangedRenderers(sourceInformation, actionId);
        }
    }

    async updateRenderers({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        if (!skipRendererUpdate) {
            await this.updateAllChangedRenderers(sourceInformation, actionId);
        }
    }

    async requestUpdate({
        updateInstructions,
        transient = false,
        event,
        skippable = false,
        overrideReadOnly = false,
    }) {
        // Note: the transient flag is now ignored
        // as the debounce is preventing too many updates from occurring

        if (this.flags.readOnly && !overrideReadOnly) {
            let sourceInformation = {};

            for (let instruction of updateInstructions) {
                let componentSourceInformation =
                    sourceInformation[instruction.componentIdx];
                if (!componentSourceInformation) {
                    componentSourceInformation = sourceInformation[
                        instruction.componentIdx
                    ] = {};
                }

                if (instruction.sourceDetails) {
                    Object.assign(
                        componentSourceInformation,
                        instruction.sourceDetails,
                    );
                }
            }

            await this.updateRendererInstructions({
                componentNamesToUpdate: updateInstructions.map(
                    (x) => x.componentIdx,
                ),
                sourceOfUpdate: { sourceInformation },
            });

            return;
        }

        return new Promise((resolve, reject) => {
            this.processQueue.push({
                type: "update",
                updateInstructions,
                transient,
                event,
                skippable,
                resolve,
                reject,
            });

            if (!this.processing) {
                this.processing = true;
                this.executeProcesses();
            }

            // if (this.processing) {

            // } else {
            //   this.processing = true;

            //   // Note: execute this process synchronously
            //   // so that UI doesn't update until after finished.
            //   // It is a tradeoff, as the UI has to wait,
            //   // but it allows constraints to be applied before renderering.

            //   this.performUpdate({ updateInstructions, transient, event }).then(() => {
            //     // execute asynchronously any remaining processes
            //     // (that got added while performUpdate was running)

            //     // if (this.processQueue.length > 0) {
            //       setTimeout(this.executeProcesses, 0);
            //     // } else {
            //     //   this.processing = false;
            //     // }
            //     resolve();
            //   });

            // }
        });
    }

    async performUpdate({
        updateInstructions,
        warnings,
        actionId,
        event,
        overrideReadOnly = false,
        doNotSave = false,
        canSkipUpdatingRenderer = false,
        skipRendererUpdate = false,
        sourceInformation = {},
    }) {
        if (warnings) {
            for (let warning of warnings) {
                this.addErrorWarning({
                    type: "warning",
                    ...warning,
                });
            }
        }

        if (this.flags.readOnly && !overrideReadOnly) {
            if (!canSkipUpdatingRenderer) {
                for (let instruction of updateInstructions) {
                    let componentSourceInformation =
                        sourceInformation[instruction.componentIdx];
                    if (!componentSourceInformation) {
                        componentSourceInformation = sourceInformation[
                            instruction.componentIdx
                        ] = {};
                    }

                    if (instruction.sourceDetails) {
                        Object.assign(
                            componentSourceInformation,
                            instruction.sourceDetails,
                        );
                    }
                }

                await this.updateRendererInstructions({
                    componentNamesToUpdate: updateInstructions.map(
                        (x) => x.componentIdx,
                    ),
                    sourceOfUpdate: { sourceInformation },
                    actionId,
                });
            }

            return;
        }

        let newStateVariableValues = {};
        let newStateVariableValuesProcessed = [];
        let workspace = {};
        let recordComponentSubmissions = [];

        for (let instruction of updateInstructions) {
            if (instruction.componentIdx != undefined) {
                let componentSourceInformation =
                    sourceInformation[instruction.componentIdx];
                if (!componentSourceInformation) {
                    componentSourceInformation = sourceInformation[
                        instruction.componentIdx
                    ] = {};
                }

                if (instruction.sourceDetails) {
                    Object.assign(
                        componentSourceInformation,
                        instruction.sourceDetails,
                    );
                }
            }

            if (instruction.updateType === "updateValue") {
                await this.requestComponentChanges({
                    instruction,
                    workspace,
                    newStateVariableValues,
                });
            } else if (instruction.updateType === "addComponents") {
                const res = createNewComponentIndices(
                    instruction.serializedComponents,
                    this._components.length,
                );
                if (res.nComponents > this._components.length) {
                    this._components[res.nComponents - 1] = undefined;
                }
                await this.addComponents({
                    serializedComponents: res.components,
                    parentIdx: instruction.parentIdx,
                });
            } else if (instruction.updateType === "deleteComponents") {
                if (instruction.componentIndices.length > 0) {
                    let componentsToDelete = [];
                    for (let componentIdx of instruction.componentIndices) {
                        let component = this._components[componentIdx];
                        if (component) {
                            componentsToDelete.push(component);
                        } else {
                            this.addErrorWarning({
                                type: "warning",
                                message: `Cannot delete ${componentIdx} as it doesn't exist.`,
                                level: 2,
                            });
                        }
                    }

                    if (componentsToDelete.length > 0) {
                        await this.deleteComponents({
                            components: componentsToDelete,
                        });
                    }
                }
            } else if (instruction.updateType === "executeUpdate") {
                // this should be used only if further updates depend on having all
                // state variables updated,
                // i.e., the subsequent inverse definitions use stateValues
                // in their calculations that need to be updated
                await this.executeUpdateStateVariables(newStateVariableValues);

                newStateVariableValuesProcessed.push(newStateVariableValues);
                newStateVariableValues = {};
            } else if (instruction.updateType === "recordItemSubmission") {
                recordComponentSubmissions.push(instruction);
            } else if (
                instruction.updateType === "setComponentNeedingUpdateValue"
            ) {
                this.cumulativeStateVariableChanges.__componentNeedingUpdateValue =
                    instruction.componentIdx;
            } else if (
                instruction.updateType === "unsetComponentNeedingUpdateValue"
            ) {
                delete this.cumulativeStateVariableChanges
                    .__componentNeedingUpdateValue;
            }
        }

        await this.executeUpdateStateVariables(newStateVariableValues);

        newStateVariableValuesProcessed.push(newStateVariableValues);

        // always update the renderers from the update instructions themselves,
        // as even if changes were prevented, the renderers need to be given that information
        // so they can revert if the showed the changes before hearing back from core
        if (!canSkipUpdatingRenderer) {
            updateInstructions.forEach((comp) => {
                if (comp.componentIdx != undefined) {
                    this.updateInfo.componentsToUpdateRenderers.add(
                        comp.componentIdx,
                    );
                }
            });
        }

        await this.processStateVariableTriggers();

        if (!skipRendererUpdate || recordComponentSubmissions.length > 0) {
            await this.updateAllChangedRenderers(sourceInformation, actionId);
        }

        if (recordComponentSubmissions.length > 0) {
            let componentsSubmitted = [
                ...new Set(
                    recordComponentSubmissions.map((x) => x.componentNumber),
                ),
            ];
            let componentCreditAchieved =
                await this.document.stateValues.componentCreditAchieved;

            if (event) {
                if (!event.context) {
                    event.context = {};
                }
                event.context.componentNumber = componentsSubmitted[0];
                event.context.componentCreditAchieved =
                    componentCreditAchieved[componentsSubmitted[0] - 1];

                // Just in case the code gets changed so that more than one component can be submitted at once,
                // record credit achieved for any additional components.
                if (componentsSubmitted.length > 1) {
                    event.context.additionalComponentCreditAchieved = {};
                    for (let componentNumber of componentsSubmitted) {
                        event.context.additionalComponentCreditAchieved[
                            componentNumber
                        ] = componentCreditAchieved[componentNumber - 1];
                    }
                }
                event.context.docCreditAchieved =
                    await this.document.stateValues.creditAchieved;
            }
        }

        // start with any essential values saved when calculating definitions
        if (Object.keys(this.essentialValuesSavedInDefinition).length > 0) {
            for (const componentIdxStr in this
                .essentialValuesSavedInDefinition) {
                const componentIdx = Number(componentIdxStr);
                let essentialState =
                    this._components[componentIdx]?.essentialState;
                if (essentialState) {
                    if (!this.cumulativeStateVariableChanges[componentIdx]) {
                        this.cumulativeStateVariableChanges[componentIdx] = {};
                    }
                    for (let varName in this.essentialValuesSavedInDefinition[
                        componentIdx
                    ]) {
                        if (essentialState[varName] !== undefined) {
                            let cumValues =
                                this.cumulativeStateVariableChanges[
                                    componentIdx
                                ][varName];
                            // if cumValues is an object with mergeObject = true,
                            // then merge attributes from newStateVariableValues into cumValues
                            if (
                                typeof cumValues === "object" &&
                                cumValues !== null &&
                                cumValues.mergeObject
                            ) {
                                Object.assign(
                                    cumValues,
                                    removeFunctionsMathExpressionClass(
                                        essentialState[varName],
                                    ),
                                );
                            } else {
                                this.cumulativeStateVariableChanges[
                                    componentIdx
                                ][varName] = removeFunctionsMathExpressionClass(
                                    essentialState[varName],
                                );
                            }
                        }
                    }
                }
            }
            this.essentialValuesSavedInDefinition = {};
        }

        // merge in new state variables set in update
        for (let newValuesProcessed of newStateVariableValuesProcessed) {
            for (const componentIdxStr in newValuesProcessed) {
                const componentIdx = Number(componentIdxStr);
                if (!this.cumulativeStateVariableChanges[componentIdx]) {
                    this.cumulativeStateVariableChanges[componentIdx] = {};
                }
                for (let varName in newValuesProcessed[componentIdx]) {
                    let cumValues =
                        this.cumulativeStateVariableChanges[componentIdx][
                            varName
                        ];
                    // if cumValues is an object with mergeObject = true,
                    // then merge attributes from newStateVariableValues into cumValues
                    if (
                        typeof cumValues === "object" &&
                        cumValues !== null &&
                        cumValues.mergeObject
                    ) {
                        Object.assign(
                            cumValues,
                            removeFunctionsMathExpressionClass(
                                newValuesProcessed[componentIdx][varName],
                            ),
                        );
                    } else {
                        this.cumulativeStateVariableChanges[componentIdx][
                            varName
                        ] = removeFunctionsMathExpressionClass(
                            newValuesProcessed[componentIdx][varName],
                        );
                    }
                }
            }
        }

        let alreadySaved = false;
        if (recordComponentSubmissions.length > 0) {
            this.saveState(true, true);
            alreadySaved = true;
        }
        if (!alreadySaved && !doNotSave) {
            clearTimeout(this.saveDocStateTimeoutID);

            //Debounce the save to localstorage and then to DB with a throttle
            this.saveDocStateTimeoutID = setTimeout(() => {
                this.saveState();
            }, 1000);
        }

        // evaluate componentCreditAchieved so that will be fresh
        // and can detect changes when it is marked stale
        await this.document.stateValues.componentCreditAchieved;

        if (event) {
            this.requestRecordEvent(event);
        }
    }

    async updateAllChangedRenderers(sourceInformation = {}, actionId) {
        let componentNamesToUpdate = [
            ...this.updateInfo.componentsToUpdateRenderers,
        ];
        this.updateInfo.componentsToUpdateRenderers.clear();

        await this.updateRendererInstructions({
            componentNamesToUpdate,
            sourceOfUpdate: { sourceInformation, local: true },
            actionId,
        });

        // updating renderer instructions could trigger more composite updates
        // (presumably from deriving child results)
        // if so, make replacement changes and update renderer instructions again
        // TODO: should we check for child results earlier so we don't have to check them
        // when updating renderer instructions?
        if (this.updateInfo.compositesToUpdateReplacements.size > 0) {
            await this.replacementChangesFromCompositesToUpdate();

            let componentNamesToUpdate = [
                ...this.updateInfo.componentsToUpdateRenderers,
            ];
            this.updateInfo.componentsToUpdateRenderers.clear();

            await this.updateRendererInstructions({
                componentNamesToUpdate,
                sourceOfUpdate: { sourceInformation, local: true },
                actionId,
            });
        }
    }

    requestRecordEvent(event) {
        this.resumeVisibilityMeasuring();

        if (event.verb === "visibilityChanged") {
            return this.processVisibilityChangedEvent(event);
        }

        return new Promise((resolve, reject) => {
            this.processQueue.push({
                type: "recordEvent",
                event,
                resolve,
                reject,
            });

            if (!this.processing) {
                this.processing = true;
                this.executeProcesses();
            }
        });
    }

    async performRecordEvent({ event }) {
        if (!this.flags.allowSaveEvents) {
            return;
        }

        if (!event.result) {
            event.result = {};
        }
        if (!event.context) {
            event.context = {};
        }

        const payload = {
            activityId: this.activityId,
            cid: this.cid,
            docId: this.docId,
            attemptNumber: this.attemptNumber,
            variantIndex: this.requestedVariant.index,
            verb: event.verb,
            object: JSON.stringify(event.object, serializedComponentsReplacer),
            result: JSON.stringify(
                removeFunctionsMathExpressionClass(event.result),
                serializedComponentsReplacer,
            ),
            context: JSON.stringify(
                event.context,
                serializedComponentsReplacer,
            ),
            timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
            version: "0.1.1",
        };

        this.sendEvent(payload);
    }

    processVisibilityChangedEvent(event) {
        let componentIdx = event.object.componentIdx;
        let isVisible = event.result.isVisible;

        if (isVisible) {
            if (!this.visibilityInfo.componentsCurrentlyVisible[componentIdx]) {
                this.visibilityInfo.componentsCurrentlyVisible[componentIdx] =
                    new Date();
            }
            if (componentIdx === this.documentIdx) {
                if (!this.visibilityInfo.documentHasBeenVisible) {
                    this.visibilityInfo.documentHasBeenVisible = true;
                    this.onDocumentFirstVisible();
                }
            }
        } else {
            let begin =
                this.visibilityInfo.componentsCurrentlyVisible[componentIdx];
            if (begin) {
                delete this.visibilityInfo.componentsCurrentlyVisible[
                    componentIdx
                ];

                let timeInSeconds =
                    (new Date() -
                        Math.max(begin, this.visibilityInfo.timeLastSent)) /
                    1000;

                if (this.visibilityInfo.infoToSend[componentIdx]) {
                    this.visibilityInfo.infoToSend[componentIdx] +=
                        timeInSeconds;
                } else {
                    this.visibilityInfo.infoToSend[componentIdx] =
                        timeInSeconds;
                }
            }
        }
    }

    sendVisibilityChangedEvents() {
        let infoToSend = { ...this.visibilityInfo.infoToSend };
        this.visibilityInfo.infoToSend = {};
        let timeLastSent = this.visibilityInfo.timeLastSent;
        this.visibilityInfo.timeLastSent = new Date();
        let currentVisible = {
            ...this.visibilityInfo.componentsCurrentlyVisible,
        };

        for (const componentIdxStr in currentVisible) {
            let timeInSeconds =
                (this.visibilityInfo.timeLastSent -
                    Math.max(timeLastSent, currentVisible[componentIdxStr])) /
                1000;
            if (infoToSend[componentIdxStr]) {
                infoToSend[componentIdxStr] += timeInSeconds;
            } else {
                infoToSend[componentIdxStr] = timeInSeconds;
            }
        }

        for (const componentIdxStr in infoToSend) {
            infoToSend[componentIdxStr] = Math.round(
                infoToSend[componentIdxStr],
            );
            if (!infoToSend[componentIdxStr]) {
                // delete if rounded down to zero
                delete infoToSend[componentIdxStr];
            }
        }

        let promise;

        if (Object.keys(infoToSend).length > 0) {
            let event = {
                object: {
                    componentIdx: this.documentIdx,
                    componentType: "document",
                },
                verb: "isVisible",
                result: infoToSend,
            };

            promise = new Promise((resolve, reject) => {
                this.processQueue.push({
                    type: "recordEvent",
                    event,
                    resolve,
                    reject,
                });

                if (!this.processing) {
                    this.processing = true;
                    this.executeProcesses();
                }
            });
        }

        if (!this.visibilityInfo.suspended) {
            clearTimeout(this.visibilityInfo.saveTimerId);
            this.visibilityInfo.saveTimerId = setTimeout(
                this.sendVisibilityChangedEvents.bind(this),
                this.visibilityInfo.saveDelay,
            );
        }

        return promise;
    }

    async suspendVisibilityMeasuring() {
        clearTimeout(this.visibilityInfo.saveTimerId);
        clearTimeout(this.visibilityInfo.suspendTimerId);
        if (!this.visibilityInfo.suspended) {
            this.visibilityInfo.suspended = true;
            await this.sendVisibilityChangedEvents();
        }
    }

    resumeVisibilityMeasuring() {
        if (this.visibilityInfo.suspended) {
            // restart visibility measuring
            this.visibilityInfo.suspended = false;
            this.visibilityInfo.timeLastSent = new Date();
            clearTimeout(this.visibilityInfo.saveTimerId);
            this.visibilityInfo.saveTimerId = setTimeout(
                this.sendVisibilityChangedEvents.bind(this),
                this.visibilityInfo.saveDelay,
            );
        }

        clearTimeout(this.visibilityInfo.suspendTimerId);
        this.visibilityInfo.suspendTimerId = setTimeout(
            this.suspendVisibilityMeasuring.bind(this),
            this.visibilityInfo.suspendDelay,
        );
    }

    async executeUpdateStateVariables(newStateVariableValues) {
        await this.processNewStateVariableValues(newStateVariableValues);

        // calculate any replacement changes on composites touched
        let replacementResult =
            await this.replacementChangesFromCompositesToUpdate();

        if (replacementResult.updatedComposites) {
            // make sure the new composite replacements didn't
            // create other composites that have to be expanded
            await this.expandAllComposites(this.document);
            await this.expandAllComposites(this.document, true);

            if (this.updateInfo.stateVariablesToEvaluate) {
                let stateVariablesToEvaluate =
                    this.updateInfo.stateVariablesToEvaluate;
                this.updateInfo.stateVariablesToEvaluate = [];
                for (let {
                    componentIdx,
                    stateVariable,
                } of stateVariablesToEvaluate) {
                    let comp = this._components[componentIdx];
                    if (comp && comp.state[stateVariable]) {
                        await this.getStateVariableValue({
                            component: comp,
                            stateVariable,
                        });
                    }
                }
            }
        }

        // calculate any replacement changes on composites touched again
        await this.replacementChangesFromCompositesToUpdate();

        // TODO: do we need to check again if update composites to expand again?
        // If so, how would we end the loop?
    }

    async replacementChangesFromCompositesToUpdate() {
        let compositesToUpdateReplacements = [
            ...this.updateInfo.compositesToUpdateReplacements,
        ];
        this.updateInfo.compositesToUpdateReplacements.clear();

        let compositesNotReady = new Set([]);

        let nPasses = 0;

        let updatedComposites = false;

        let componentChanges = []; // TODO: what to do with componentChanges?
        while (compositesToUpdateReplacements.length > 0) {
            for (let cIdx of compositesToUpdateReplacements) {
                let composite = this._components[cIdx];
                if (
                    composite instanceof
                        this.componentInfoObjects.allComponentClasses
                            ._composite &&
                    composite.isExpanded &&
                    !composite.isInErrorState
                ) {
                    if (
                        composite.state.readyToExpandWhenResolved
                            .initiallyResolved
                    ) {
                        if (
                            await composite.stateValues
                                .isInactiveCompositeReplacement
                        ) {
                            this.updateInfo.inactiveCompositesToUpdateReplacements.add(
                                cIdx,
                            );
                        } else {
                            let result = await this.updateCompositeReplacements(
                                {
                                    component: composite,
                                    componentChanges,
                                },
                            );

                            if (
                                Object.keys(result.addedComponents).length > 0
                            ) {
                                updatedComposites = true;
                            }
                            if (
                                Object.keys(result.deletedComponents).length > 0
                            ) {
                                updatedComposites = true;
                            }
                        }
                    } else {
                        compositesNotReady.add(cIdx);
                    }
                }
            }
            // Is it possible that could ever get an infinite loop here?
            // I.e., is there some type of circular dependency among composites
            // that could happen and we aren't detecting?
            // Note: have encountered cases where a composite must be updated twice
            // in this loop
            // Note 2: if we don't update a composite here, the state variable indicating
            // its replacements need processing may remain stale, which will
            // prevent futher changes from being triggered
            compositesToUpdateReplacements = [
                ...this.updateInfo.compositesToUpdateReplacements,
            ];
            this.updateInfo.compositesToUpdateReplacements.clear();

            // just in case have infinite loop, throw error after 100 passes
            nPasses++;
            if (nPasses > 100) {
                throw Error(
                    `Seem to have an infinite loop while calculating replacement changes`,
                );
            }
        }

        this.updateInfo.compositesToUpdateReplacements = compositesNotReady;

        // return { componentChanges };
        return { updatedComposites };
    }

    async processNewStateVariableValues(newStateVariableValues) {
        // console.log('process new state variable values')
        // console.log(JSON.parse(JSON.stringify(newStateVariableValues)));

        let nFailures = 0;

        let foundIgnore = false;

        for (const cIdxStr in newStateVariableValues) {
            const cIdx = Number(cIdxStr);
            let comp = this._components[cIdx];

            if (comp === undefined) {
                // console.warn(`can't update state variables of component ${cIdx}, as it doesn't exist.`);
                // nFailures += 1;

                let updatesForComp =
                    this.updateInfo.stateVariableUpdatesForMissingComponents[
                        cIdx
                    ];
                if (updatesForComp === undefined) {
                    updatesForComp =
                        this.updateInfo.stateVariableUpdatesForMissingComponents[
                            cIdx
                        ] = {};
                }

                Object.assign(updatesForComp, newStateVariableValues[cIdx]);

                continue;
            }

            let newComponentStateVariables = newStateVariableValues[cIdx];

            for (let vName in newComponentStateVariables) {
                let compStateObj = comp.state[vName];
                if (compStateObj === undefined) {
                    let match = vName.match(/^__def_primitive_(\d+)$/);

                    if (match) {
                        let childInd = Number(match[1]);

                        comp.definingChildren[childInd] =
                            newComponentStateVariables[vName];

                        await this.processNewDefiningChildren({
                            parent: comp,
                            expandComposites: false,
                        });

                        continue;
                    } else {
                        match = vName.match(/^__def_primitive_ignore_(\d+)$/);

                        if (match) {
                            let childInd = Number(match[1]);

                            comp.definingChildren[childInd] =
                                newComponentStateVariables[vName];

                            foundIgnore = true;

                            // since marked to ignore, we don't process new defining children

                            continue;
                        }
                    }

                    this.addErrorWarning({
                        type: "warning",
                        message: `can't update state variable ${vName} of component ${cIdx}, as it doesn't exist.`,
                        level: 2,
                        position: this._components[cIdx].position,
                        sourceDoc: this._components[cIdx].sourceDoc,
                    });
                    continue;
                }

                if (!compStateObj.hasEssential) {
                    this.addErrorWarning({
                        type: "warning",
                        message: `can't update state variable ${vName} of component ${cIdx}, as it does not have an essential state variable.`,
                        level: 2,
                        position: this._components[cIdx].position,
                        sourceDoc: this._components[cIdx].sourceDoc,
                    });
                    continue;
                }

                let essentialVarName = vName;
                if (comp.state[vName].essentialVarName) {
                    essentialVarName = comp.state[vName].essentialVarName;
                }

                if (
                    vName in
                    this.rendererVariablesByComponentType[comp.componentType]
                ) {
                    this.updateInfo.componentsToUpdateRenderers.add(
                        comp.componentIdx,
                    );
                }

                if (compStateObj.isArray) {
                    let essentialArray = comp.essentialState[essentialVarName];

                    if (!Array.isArray(essentialArray)) {
                        essentialArray = comp.essentialState[essentialVarName] =
                            [];
                    }

                    let arrayEntryNamesAffected = [];

                    // If array size state variable isn't initially resolved,
                    // arraySize will return an empty array.
                    // Call its value to resolve it
                    if (
                        !comp.state[compStateObj.arraySizeStateVariable]
                            .initiallyResolved
                    ) {
                        await comp.state[compStateObj.arraySizeStateVariable]
                            .value;
                    }

                    let arraySize = await compStateObj.arraySize;

                    // newComponentStateVariables[vName] must be an object keyed on arrayKeys
                    // except that it will have mergeObject=true
                    // to tell external functions new attributes of the object
                    // should be merged into the old object

                    for (let arrayKey in newComponentStateVariables[vName]) {
                        if (arrayKey === "mergeObject") {
                            continue;
                        }

                        let set = (x) => x;
                        if (compStateObj.set) {
                            set = compStateObj.set;
                        }

                        let setResult = compStateObj.setArrayValue({
                            value: set(
                                newComponentStateVariables[vName][arrayKey],
                            ),
                            arrayKey,
                            arraySize,
                            arrayValues: essentialArray,
                        });

                        compStateObj.usedDefaultByArrayKey[arrayKey] = false;

                        nFailures += setResult.nFailures;

                        // mark any array entry state variables containing arrayKey
                        // as affected

                        let varNamesContainingArrayKey =
                            compStateObj.varNamesIncludingArrayKeys[arrayKey];
                        if (varNamesContainingArrayKey) {
                            arrayEntryNamesAffected.push(
                                ...varNamesContainingArrayKey,
                            );
                        }
                    }

                    for (let arrayEntryName of arrayEntryNamesAffected) {
                        await this.recordActualChangeInStateVariable({
                            componentIdx: cIdx,
                            varName: arrayEntryName,
                        });
                    }
                } else {
                    // don't have array

                    if (!compStateObj.hasEssential) {
                        this.addErrorWarning({
                            type: "warning",
                            message: `can't update state variable ${vName} of component ${cIdx}, as it does not have an essential state variable.`,
                            level: 2,
                            position: this._components[cIdx].position,
                            sourceDoc: this._components[cIdx].sourceDoc,
                        });
                        continue;
                    }

                    if (compStateObj.set) {
                        comp.essentialState[essentialVarName] =
                            compStateObj.set(newComponentStateVariables[vName]);
                    } else {
                        comp.essentialState[essentialVarName] =
                            newComponentStateVariables[vName];
                    }

                    delete compStateObj.usedDefault;
                }

                await this.recordActualChangeInStateVariable({
                    componentIdx: cIdx,
                    varName: vName,
                });
            }
        }

        return { nFailures, foundIgnore };
    }

    async requestComponentChanges({
        instruction,
        initialChange = true,
        workspace,
        newStateVariableValues,
    }) {
        // console.log(`request component changes`);
        // console.log(instruction);
        // console.log('overall workspace')
        // console.log(JSON.parse(JSON.stringify(workspace)))

        let component = this._components[instruction.componentIdx];

        let stateVariable = this.substituteAliases({
            stateVariables: [instruction.stateVariable],
            componentClass: component.constructor,
        })[0];

        if (workspace[instruction.componentIdx] === undefined) {
            workspace[instruction.componentIdx] = {};
        }
        let componentWorkspace = workspace[instruction.componentIdx];

        let stateVarObj = component.state[stateVariable];

        let additionalStateVariablesDefined =
            stateVarObj.additionalStateVariablesDefined;

        let allStateVariablesAffected = [stateVariable];
        if (additionalStateVariablesDefined) {
            allStateVariablesAffected.push(...additionalStateVariablesDefined);
        }

        for (let varName of allStateVariablesAffected) {
            if (!component.state[varName].isResolved) {
                let result = await this.dependencies.resolveItem({
                    componentIdx: component.componentIdx,
                    type: "stateVariable",
                    stateVariable: varName,
                    force: true,
                });

                if (!result.success) {
                    throw Error(
                        `Can't get value of ${stateVariable} of ${component.componentIdx} as ${varName} couldn't be resolved.`,
                    );
                }
            }
        }

        let inverseDefinitionArgs =
            await this.getStateVariableDefinitionArguments({
                component,
                stateVariable,
                excludeDependencyValues:
                    stateVarObj.excludeDependencyValuesInInverseDefinition,
            });
        inverseDefinitionArgs.componentInfoObjects = this.componentInfoObjects;
        inverseDefinitionArgs.initialChange = initialChange;
        inverseDefinitionArgs.stateValues = component.stateValues;
        inverseDefinitionArgs.overrideFixed = instruction.overrideFixed;
        inverseDefinitionArgs.shadowedVariable = instruction.shadowedVariable;
        inverseDefinitionArgs.sourceDetails = instruction.sourceDetails;

        if (instruction.overrides) {
            inverseDefinitionArgs.overrides = instruction.overrides;
        }

        let stateVariableForWorkspace = stateVariable;

        if (stateVarObj.isArrayEntry) {
            let arrayStateVariable = stateVarObj.arrayStateVariable;
            stateVariableForWorkspace = arrayStateVariable;

            let desiredValuesForArray = {};
            if (inverseDefinitionArgs.arrayKeys.length === 1) {
                if ("value" in instruction) {
                    desiredValuesForArray[inverseDefinitionArgs.arrayKeys[0]] =
                        instruction.value;
                } else if ("valueOfStateVariable" in instruction) {
                    let otherStateVariable = this.substituteAliases({
                        stateVariables: [instruction.valueOfStateVariable],
                        componentClass: component.constructor,
                    })[0];
                    let sObj = component.state[otherStateVariable];
                    if (sObj) {
                        desiredValuesForArray[
                            inverseDefinitionArgs.arrayKeys[0]
                        ] = await sObj.value;
                    } else {
                        throw Error(
                            `Invalid instruction to change ${instruction.stateVariable} of ${instruction.componentIdx}, value of state variable ${instruction.valueOfStateVariable} not found.`,
                        );
                    }
                }
            } else {
                for (let [
                    ind,
                    arrayKey,
                ] of inverseDefinitionArgs.arrayKeys.entries()) {
                    if (Array.isArray(instruction.value)) {
                        desiredValuesForArray[arrayKey] =
                            instruction.value[ind];
                    } else if (instruction.value instanceof me.class) {
                        try {
                            desiredValuesForArray[arrayKey] =
                                instruction.value.get_component(ind);
                        } catch (e) {}
                    }
                }
            }
            inverseDefinitionArgs.desiredStateVariableValues = {
                [arrayStateVariable]: desiredValuesForArray,
            };
        } else {
            if ("value" in instruction) {
                inverseDefinitionArgs.desiredStateVariableValues = {
                    [stateVariable]: instruction.value,
                };
            } else if ("valueOfStateVariable" in instruction) {
                let otherStateVariable = this.substituteAliases({
                    stateVariables: [instruction.valueOfStateVariable],
                    componentClass: component.constructor,
                })[0];
                let sObj = component.state[otherStateVariable];
                if (sObj) {
                    inverseDefinitionArgs.desiredStateVariableValues = {
                        [stateVariable]: await sObj.value,
                    };
                } else {
                    throw Error(
                        `Invalid instruction to change ${instruction.stateVariable} of ${instruction.componentIdx}, value of state variable ${instruction.valueOfStateVariable} not found.`,
                    );
                }
            }
        }

        let stateVariableWorkspace =
            componentWorkspace[stateVariableForWorkspace];
        if (stateVariableWorkspace === undefined) {
            stateVariableWorkspace = componentWorkspace[
                stateVariableForWorkspace
            ] = {};
        }

        if (stateVarObj.additionalStateVariablesDefined) {
            // combine workspaces of additional state variables into one
            for (let varName2 of stateVarObj.additionalStateVariablesDefined) {
                let stateVariableForWorkspace2 = varName2;
                let stateVarObj2 = component.state[varName2];
                if (stateVarObj2.isArray) {
                    stateVariableForWorkspace2 = stateVarObj.arrayStateVariable;
                }
                let stateVariableWorkspace2 =
                    componentWorkspace[stateVariableForWorkspace2];
                if (stateVariableWorkspace2) {
                    Object.assign(
                        stateVariableWorkspace,
                        stateVariableWorkspace2,
                    );
                    componentWorkspace[stateVariableForWorkspace2] =
                        stateVariableWorkspace;
                }
            }
        }

        inverseDefinitionArgs.workspace = stateVariableWorkspace;

        if (instruction.additionalStateVariableValues) {
            for (let varName2 in instruction.additionalStateVariableValues) {
                if (
                    !stateVarObj.additionalStateVariablesDefined.includes(
                        varName2,
                    )
                ) {
                    this.addErrorWarning({
                        type: "warning",
                        message: `Can't invert ${varName2} at the same time as ${stateVariable}, as not an additional state variable defined`,
                        level: 2,
                        position: component.position,
                        sourceDoc: component.sourceDoc,
                    });
                    continue;
                }
                // Note: don't check if varName2 is an array
                // Haven't implemented changing an array as an additional state variable value
                inverseDefinitionArgs.desiredStateVariableValues[varName2] =
                    instruction.additionalStateVariableValues[varName2];
            }
        }

        if (!stateVarObj.inverseDefinition) {
            this.addErrorWarning({
                type: "warning",
                message: `Cannot change state variable ${stateVariable} of ${component.componentIdx} as it doesn't have an inverse definition`,
                level: 2,
                position: component.position,
                sourceDoc: component.sourceDoc,
            });
            return;
        }

        if (
            !instruction.overrideFixed &&
            !stateVarObj.ignoreFixed &&
            (await component.stateValues.fixed)
        ) {
            this.addErrorWarning({
                type: "warning",
                message: `Changing ${stateVariable} of ${component.componentIdx} did not succeed because fixed is true.`,
                level: 2,
                position: component.position,
                sourceDoc: component.sourceDoc,
            });
            return;
        }

        if (
            !instruction.overrideFixed &&
            stateVarObj.isLocation &&
            (await component.stateValues.fixLocation)
        ) {
            this.addErrorWarning({
                type: "warning",
                message: `Changing ${stateVariable} of ${component.componentIdx} did not succeed because fixLocation is true.`,
                level: 2,
                position: component.position,
                sourceDoc: component.sourceDoc,
            });
            return;
        }

        if (
            !(
                initialChange ||
                (await component.stateValues.modifyIndirectly) !== false
            )
        ) {
            this.addErrorWarning({
                type: "warning",
                message: `Changing ${stateVariable} of ${component.componentIdx} did not succeed because modifyIndirectly is false.`,
                level: 2,
                position: component.position,
                sourceDoc: component.sourceDoc,
            });
            return;
        }

        let inverseResult = await stateVarObj.inverseDefinition(
            inverseDefinitionArgs,
        );

        if (inverseResult.sendWarnings) {
            for (let warning of inverseResult.sendWarnings) {
                this.addErrorWarning({
                    type: "warning",
                    position: component.position,
                    sourceDoc: component.sourceDoc,
                    ...warning,
                });
            }
        }

        if (!inverseResult.success) {
            // console.log(`Changing ${stateVariable} of ${component.componentIdx} did not succeed.`);
            return;
        }

        // console.log("inverseResult");
        // console.log(inverseResult);

        let combinedInstructions = [];

        let arrayInstructionInProgress;

        for (let newInstruction of inverseResult.instructions) {
            let foundArrayInstruction = false;

            if (newInstruction.setDependency) {
                let dependencyName = newInstruction.setDependency;

                let dep =
                    this.dependencies.downstreamDependencies[
                        component.componentIdx
                    ][stateVariable][dependencyName];
                if (
                    ["stateVariable", "parentStateVariable"].includes(
                        dep.dependencyType,
                    ) &&
                    dep.downstreamComponentIndices.length === 1
                ) {
                    let dComponentIdx = dep.downstreamComponentIndices[0];
                    let dVarName =
                        dep.mappedDownstreamVariableNamesByComponent[0][0];

                    let depStateVarObj =
                        this._components[dComponentIdx].state[dVarName];

                    if (
                        (depStateVarObj.isArrayEntry ||
                            depStateVarObj.isArray) &&
                        !depStateVarObj.doNotCombineInverseArrayInstructions
                    ) {
                        let arrayStateVariable = depStateVarObj.isArrayEntry
                            ? depStateVarObj.arrayStateVariable
                            : dVarName;

                        if (
                            arrayInstructionInProgress &&
                            !(
                                arrayInstructionInProgress.componentIdx ===
                                    dComponentIdx &&
                                arrayInstructionInProgress.stateVariable ===
                                    arrayStateVariable &&
                                arrayInstructionInProgress.shadowedVariable ===
                                    newInstruction.shadowedVariable &&
                                arrayInstructionInProgress.treatAsInitialChange ===
                                    newInstruction.treatAsInitialChange
                            )
                        ) {
                            // arrayInstructionInProgress didn't match,
                            // so add it to combined instructions
                            combinedInstructions.push(
                                arrayInstructionInProgress,
                            );
                            arrayInstructionInProgress = undefined;
                        }

                        // haven't implemented combining when have additional dependency values
                        if (
                            !(
                                newInstruction.additionalDependencyValues ||
                                depStateVarObj.basedOnArrayKeyStateVariables
                            )
                        ) {
                            foundArrayInstruction = true;

                            if (!arrayInstructionInProgress) {
                                arrayInstructionInProgress = {
                                    combinedArray: true,
                                    componentIdx: dComponentIdx,
                                    stateVariable: arrayStateVariable,
                                    shadowedVariable:
                                        newInstruction.shadowedVariable,
                                    treatAsInitialChange:
                                        newInstruction.treatAsInitialChange,
                                    desiredValue: {},
                                };
                            }

                            if (depStateVarObj.isArrayEntry) {
                                let arrayKeys = await depStateVarObj.arrayKeys;

                                if (arrayKeys.length === 0) {
                                    // To allow for the possibility of setting array components
                                    // that don't yet exist, we recompute the array keys
                                    // under the scenario that we ignore the array size.
                                    // Unless allowExtraArrayKeysInInverse is set, any extra keys will be
                                    // filtered out, so add them only in this case.
                                    let depArrayStateVarObj =
                                        this._components[dComponentIdx].state[
                                            arrayStateVariable
                                        ];
                                    if (
                                        depArrayStateVarObj.allowExtraArrayKeysInInverse
                                    ) {
                                        arrayKeys =
                                            depArrayStateVarObj.getArrayKeysFromVarName(
                                                {
                                                    arrayEntryPrefix:
                                                        depStateVarObj.entryPrefix,
                                                    varEnding:
                                                        depStateVarObj.varEnding,
                                                    numDimensions:
                                                        depArrayStateVarObj.numDimensions,
                                                },
                                            );
                                    }
                                }

                                if (arrayKeys.length === 1) {
                                    arrayInstructionInProgress.desiredValue[
                                        arrayKeys[0]
                                    ] = newInstruction.desiredValue;
                                } else {
                                    for (let [
                                        ind,
                                        arrayKey,
                                    ] of arrayKeys.entries()) {
                                        arrayInstructionInProgress.desiredValue[
                                            arrayKey
                                        ] = newInstruction.desiredValue[ind];
                                    }
                                }
                            } else {
                                if (
                                    depStateVarObj.numDimensions === 1 ||
                                    !Array.isArray(newInstruction.desiredValue)
                                ) {
                                    if (
                                        typeof newInstruction.desiredValue ===
                                            "object" &&
                                        !(
                                            newInstruction.desiredValue instanceof
                                            me.class
                                        )
                                    ) {
                                        Object.assign(
                                            arrayInstructionInProgress.desiredValue,
                                            newInstruction.desiredValue,
                                        );
                                    } else {
                                        // If the desired value isn't a non math-expression object,
                                        // then it is clearly not in the form {arrayKey:value}.
                                        // Since we don't have an arrayKey, just set the first array key in the array.
                                        let firstArrayKey = Array(
                                            depStateVarObj.numDimensions,
                                        )
                                            .fill("0")
                                            .join(",");
                                        arrayInstructionInProgress.desiredValue[
                                            firstArrayKey
                                        ] = newInstruction.desiredValue;
                                    }
                                } else {
                                    // need to convert multidimensional array (newInstruction.desiredValue)
                                    // to an object with multidimesional arrayKeys
                                    // where each array key is a concatenation of the array indices, joined by commas

                                    let convert_md_array = (array, n_dim) => {
                                        if (n_dim === 1) {
                                            return Object.assign({}, array);
                                        } else {
                                            let new_obj = {};
                                            for (let ind in array) {
                                                let sub_obj = convert_md_array(
                                                    array[ind],
                                                    n_dim - 1,
                                                );
                                                for (let key in sub_obj) {
                                                    new_obj[`${ind},${key}`] =
                                                        sub_obj[key];
                                                }
                                            }
                                            return new_obj;
                                        }
                                    };
                                    Object.assign(
                                        arrayInstructionInProgress.desiredValue,
                                        convert_md_array(
                                            newInstruction.desiredValue,
                                            depStateVarObj.numDimensions,
                                        ),
                                    );
                                }
                            }
                        }
                    }
                }
            }

            if (!foundArrayInstruction) {
                if (arrayInstructionInProgress) {
                    combinedInstructions.push(arrayInstructionInProgress);
                    arrayInstructionInProgress = undefined;
                }
                combinedInstructions.push(newInstruction);
            }
        }

        if (arrayInstructionInProgress) {
            combinedInstructions.push(arrayInstructionInProgress);
            arrayInstructionInProgress = undefined;
        }

        for (let newInstruction of combinedInstructions) {
            if (newInstruction.setEssentialValue) {
                if (
                    !allStateVariablesAffected.includes(
                        newInstruction.setEssentialValue,
                    )
                ) {
                    let foundArrayMatch = false;
                    if (stateVarObj.isArrayEntry) {
                        let arrayStateVariables = [
                            stateVarObj.arrayStateVariable,
                        ];
                        if (stateVarObj.additionalStateVariablesDefined) {
                            for (let vName of stateVarObj.additionalStateVariablesDefined) {
                                let sObj = component.state[vName];
                                if (sObj.isArrayEntry) {
                                    arrayStateVariables.push(
                                        sObj.arrayStateVariable,
                                    );
                                }
                            }
                        }
                        foundArrayMatch = arrayStateVariables.includes(
                            newInstruction.setEssentialValue,
                        );
                    }
                    if (!foundArrayMatch) {
                        throw Error(
                            `Invalid inverse definition of ${stateVariable} of ${component.componentIdx}: specified changing value of ${newInstruction.setEssentialValue}, which is not a state variable defined with ${stateVariable}.`,
                        );
                    }
                }

                if (
                    !component.state[newInstruction.setEssentialValue]
                        .hasEssential
                ) {
                    throw Error(
                        `Invalid inverse definition of ${stateVariable} of ${component.componentIdx}: can't set essential value of ${newInstruction.setEssentialValue} if it is does not have an essential value.`,
                    );
                }

                if (!("value" in newInstruction)) {
                    throw Error(
                        `Invalid inverse definition of ${stateVariable} of ${component.componentIdx}: setEssentialValue must specify a value`,
                    );
                }

                let value = newInstruction.value;

                if (value instanceof me.class) {
                    let result = await preprocessMathInverseDefinition({
                        desiredValue: value,
                        stateValues: component.stateValues,
                        variableName: newInstruction.setEssentialValue,
                        workspace: stateVariableWorkspace,
                    });
                    value = result.desiredValue;
                }

                if (
                    component.state[newInstruction.setEssentialValue]
                        .doNotShadowEssential ||
                    component.state[newInstruction.setEssentialValue]
                        .shadowVariable
                ) {
                    // Note: if shadow state variable, then we don't shadow essential
                    // as the shadowed state variables will not use the essential value

                    this.calculateEssentialVariableChanges({
                        component,
                        varName: newInstruction.setEssentialValue,
                        value,
                        newStateVariableValues,
                        recurseToShadows: false,
                    });
                } else {
                    // For setting essential value, we keep the values for all
                    // shadowed components in sync.
                    // We find the original component and the recurse on all the components
                    // that shadow it.
                    // Don't include shadows due to propVariable
                    // unless it is a plain copy marked as returning the same type
                    let baseComponent = component;
                    while (
                        baseComponent.shadows &&
                        (baseComponent.shadows.propVariable === undefined ||
                            (baseComponent.doenetAttributes.fromImplicitProp &&
                                this._components[
                                    baseComponent.shadows.componentIdx
                                ].constructor.implicitPropReturnsSameType))
                    ) {
                        baseComponent =
                            this._components[
                                baseComponent.shadows.componentIdx
                            ];

                        // if any of the shadow sources are fixed, reject this change
                        if (
                            !instruction.overrideFixed &&
                            !stateVarObj.ignoreFixed &&
                            (await baseComponent.stateValues.fixed)
                        ) {
                            this.addErrorWarning({
                                type: "warning",
                                message: `Changing ${stateVariable} of ${baseComponent.componentIdx} did not succeed because fixed is true.`,
                                level: 2,
                                position: baseComponent.position,
                                sourceDoc: baseComponent.sourceDoc,
                            });
                            return;
                        }

                        // if any of the shadow sources of a locatoin are fixLocation, reject this change
                        if (
                            !instruction.overrideFixed &&
                            !stateVarObj.isLocation &&
                            (await baseComponent.stateValues.fixLocation)
                        ) {
                            this.addErrorWarning({
                                type: "warning",
                                message: `Changing ${stateVariable} of ${baseComponent.componentIdx} did not succeed because fixLocation is true.`,
                                level: 2,
                                position: baseComponent.position,
                                sourceDoc: baseComponent.sourceDoc,
                            });
                            return;
                        }
                    }

                    this.calculateEssentialVariableChanges({
                        component: baseComponent,
                        varName: newInstruction.setEssentialValue,
                        value,
                        newStateVariableValues,
                    });
                }
            } else if (newInstruction.setDependency) {
                let dependencyName = newInstruction.setDependency;

                let dep =
                    this.dependencies.downstreamDependencies[
                        component.componentIdx
                    ][stateVariable][dependencyName];

                if (dep.dependencyType === "child") {
                    if (newInstruction.childIndex === undefined) {
                        newInstruction.childIndex = 0;
                    }
                    if (newInstruction.variableIndex === undefined) {
                        newInstruction.variableIndex = 0;
                    }

                    let childInd = newInstruction.childIndex;

                    if (dep.downstreamPrimitives[childInd] !== null) {
                        // have a primitive child
                        // if desiredValue is same type of primitive, set it as a state variable

                        // TODO: how to address case if string index could change

                        if (
                            typeof newInstruction.desiredValue ===
                            typeof dep.downstreamPrimitives[childInd]
                        ) {
                            let parent = this._components[dep.parentIdx];

                            let activeChildInd =
                                dep.activeChildrenIndices[childInd];

                            // TODO: if child is a replacement of a composite, determine what to do
                            if (parent.compositeReplacementActiveRange) {
                                for (let compositeObj of parent.compositeReplacementActiveRange) {
                                    if (
                                        compositeObj.firstInd <=
                                            activeChildInd &&
                                        compositeObj.lastInd >= activeChildInd
                                    ) {
                                        console.log(
                                            `parent: ${parent.componentIdx}, activeChildInd: ${activeChildInd}`,
                                        );
                                        console.log(
                                            parent.compositeReplacementActiveRange,
                                        );
                                        console.log(newInstruction);
                                        throw Error(
                                            "Need to implement changing primitive replacements from composite",
                                        );
                                    }
                                }
                            }

                            let definingInd = activeChildInd;
                            if (parent.compositeReplacementActiveRange) {
                                for (let compositeObj of parent.compositeReplacementActiveRange) {
                                    if (compositeObj.lastInd < definingInd) {
                                        definingInd -=
                                            compositeObj.lastInd -
                                            compositeObj.firstInd;
                                    }
                                }
                            }

                            // For primitive children, we keep the values for all
                            // shadowed parents in sync.
                            // We find the original parent and the recurse on all the parents
                            // that shadow it
                            let baseParent = parent;
                            while (
                                baseParent.shadows &&
                                baseParent.shadows.propVariable === undefined
                            ) {
                                baseParent =
                                    this._components[
                                        baseParent.shadows.componentIdx
                                    ];
                            }

                            let markToIgnoreForParent;

                            if (newInstruction.ignoreChildChangeForComponent) {
                                markToIgnoreForParent = parent.componentIdx;
                            }

                            this.calculatePrimitiveChildChanges({
                                parent: baseParent,
                                definingInd,
                                newValue: newInstruction.desiredValue,
                                newStateVariableValues,
                                markToIgnoreForParent,
                            });
                        }
                    } else {
                        // find downstream ind of childInd

                        let downstreamInd =
                            dep.downstreamPrimitives
                                .slice(0, childInd + 1)
                                .filter((x) => !x).length - 1;

                        let cIdx =
                            dep.downstreamComponentIndices[downstreamInd];
                        if (cIdx == undefined) {
                            throw Error(
                                `Invalid inverse definition of ${stateVariable} of ${component.componentIdx}: ${dependencyName} child of index ${newInstruction.childIndex} does not exist.`,
                            );
                        }
                        let varName =
                            dep.mappedDownstreamVariableNamesByComponent[
                                newInstruction.childIndex
                            ][newInstruction.variableIndex];
                        if (!varName) {
                            throw Error(
                                `Invalid inverse definition of ${stateVariable} of ${component.componentIdx}: ${dependencyName} variable of index ${newInstruction.variableIndex} does not exist.`,
                            );
                        }
                        let inst = {
                            componentIdx: cIdx,
                            stateVariable: varName,
                            value: newInstruction.desiredValue,
                            overrideFixed: instruction.overrideFixed,
                            arrayKey: newInstruction.arrayKey,
                        };
                        await this.requestComponentChanges({
                            instruction: inst,
                            initialChange:
                                newInstruction.treatAsInitialChange === true,
                            workspace,
                            newStateVariableValues,
                        });
                    }
                } else if (
                    [
                        "attributeComponent",
                        "shadowSource",
                        "adapterSource",
                        "targetComponent",
                    ].includes(dep.dependencyType)
                ) {
                    let cIdx = dep.downstreamComponentIndices[0];
                    let varName =
                        dep.mappedDownstreamVariableNamesByComponent[0][
                            newInstruction.variableIndex
                        ];
                    if (!varName) {
                        throw Error(
                            `Invalid inverse definition of ${stateVariable} of ${component.componentIdx}: ${dependencyName} variable of index ${newInstruction.variableIndex} does not exist.`,
                        );
                    }
                    let inst = {
                        componentIdx: cIdx,
                        stateVariable: varName,
                        value: newInstruction.desiredValue,
                        overrideFixed: instruction.overrideFixed,
                        arrayKey: newInstruction.arrayKey,
                    };
                    await this.requestComponentChanges({
                        instruction: inst,
                        initialChange:
                            newInstruction.treatAsInitialChange === true,
                        workspace,
                        newStateVariableValues,
                    });
                } else if (
                    [
                        "stateVariable",
                        "parentStateVariable",
                        "adapterSourceStateVariable",
                        "sourceCompositeStateVariable",
                    ].includes(dep.dependencyType) &&
                    dep.downstreamComponentIndices.length === 1
                ) {
                    let dComponentIdx = dep.downstreamComponentIndices[0];
                    let dVarName =
                        dep.mappedDownstreamVariableNamesByComponent[0][0];

                    let inst = {
                        componentIdx: dComponentIdx,
                        stateVariable: dVarName,
                        value: newInstruction.desiredValue,
                        overrideFixed: instruction.overrideFixed,
                        shadowedVariable: newInstruction.shadowedVariable,
                    };
                    if (newInstruction.additionalDependencyValues) {
                        // it is possible to simultaneously set the values of multiple
                        // component state variables, if they share a definition
                        // i.e. are in additionalStateVariablesDefined

                        let stateVarObj =
                            this.components[dComponentIdx].state[dVarName];
                        for (let dependencyName2 in newInstruction.additionalDependencyValues) {
                            let dep2 =
                                this.dependencies.downstreamDependencies[
                                    component.componentIdx
                                ][stateVariable][dependencyName2];
                            if (
                                !(
                                    [
                                        "stateVariable",
                                        "parentStateVariable",
                                    ].includes(dep2.dependencyType) &&
                                    dep2.downstreamComponentIndices.length === 1
                                )
                            ) {
                                this.addErrorWarning({
                                    type: "warning",
                                    message: `Can't simultaneously set additional dependency value ${dependencyName2} if it isn't a state variable`,
                                    level: 2,
                                    position:
                                        this.components[dComponentIdx].position,
                                    sourceDoc:
                                        this.components[dComponentIdx]
                                            .sourceDoc,
                                });
                                continue;
                            }

                            let varName2 =
                                dep2
                                    .mappedDownstreamVariableNamesByComponent[0][0];
                            if (
                                dep2.downstreamComponentIndices[0] !==
                                    dComponentIdx ||
                                !stateVarObj.additionalStateVariablesDefined.includes(
                                    varName2,
                                )
                            ) {
                                this.addErrorWarning({
                                    type: "warning",
                                    message: `Can't simultaneously set additional dependency value ${dependencyName2} if it doesn't correspond to additional state variable defined of ${dependencyName}'s state variable`,
                                    level: 2,
                                    position:
                                        this.components[dComponentIdx].position,
                                    sourceDoc:
                                        this.components[dComponentIdx]
                                            .sourceDoc,
                                });
                                continue;
                            }
                            if (!inst.additionalStateVariableValues) {
                                inst.additionalStateVariableValues = {};
                            }
                            inst.additionalStateVariableValues[varName2] =
                                newInstruction.additionalDependencyValues[
                                    dependencyName2
                                ];
                        }
                    }
                    await this.requestComponentChanges({
                        instruction: inst,
                        initialChange:
                            newInstruction.treatAsInitialChange === true,
                        workspace,
                        newStateVariableValues,
                    });
                } else {
                    throw Error(
                        `unimplemented dependency type ${dep.dependencyType} in requestComponentChanges`,
                    );
                }
            } else if (newInstruction.combinedArray) {
                let inst = {
                    componentIdx: newInstruction.componentIdx,
                    stateVariable: newInstruction.stateVariable,
                    value: newInstruction.desiredValue,
                    overrideFixed: instruction.overrideFixed,
                    shadowedVariable: newInstruction.shadowedVariable,
                };

                await this.requestComponentChanges({
                    instruction: inst,
                    initialChange: newInstruction.treatAsInitialChange === true,
                    workspace,
                    newStateVariableValues,
                });
            } else {
                console.log(newInstruction);
                throw Error(
                    `Unrecognized instruction in inverse definition of ${stateVariable} of ${component.componentIdx}`,
                );
            }
        }

        return;
    }

    calculateEssentialVariableChanges({
        component,
        varName,
        value,
        newStateVariableValues,
        recurseToShadows = true,
    }) {
        if (!newStateVariableValues[component.componentIdx]) {
            newStateVariableValues[component.componentIdx] = {};
        }

        if (component.state[varName].isArray) {
            if (!newStateVariableValues[component.componentIdx][varName]) {
                // include key mergeObject to let external functions
                // know that new attributes of the object
                // should be merged into the old object
                newStateVariableValues[component.componentIdx][varName] = {
                    mergeObject: true,
                };
            }

            Object.assign(
                newStateVariableValues[component.componentIdx][varName],
                value,
            );
        } else {
            newStateVariableValues[component.componentIdx][varName] = value;
        }

        if (recurseToShadows && component.shadowedBy) {
            for (let shadow of component.shadowedBy) {
                // Don't include shadows due to propVariable
                // unless it is a plain copy marked as returning the same type
                if (
                    shadow.shadows.propVariable === undefined ||
                    (shadow.doenetAttributes.fromImplicitProp &&
                        component.constructor.implicitPropReturnsSameType)
                ) {
                    this.calculateEssentialVariableChanges({
                        component: shadow,
                        varName,
                        value,
                        newStateVariableValues,
                    });
                }
            }
        }
    }

    calculatePrimitiveChildChanges({
        parent,
        definingInd,
        newValue,
        newStateVariableValues,
        markToIgnoreForParent,
    }) {
        if (!newStateVariableValues[parent.componentIdx]) {
            newStateVariableValues[parent.componentIdx] = {};
        }
        if (parent.componentIdx === markToIgnoreForParent) {
            newStateVariableValues[parent.componentIdx][
                `__def_primitive_ignore_${definingInd}`
            ] = newValue;
        } else {
            newStateVariableValues[parent.componentIdx][
                `__def_primitive_${definingInd}`
            ] = newValue;
        }

        if (parent.shadowedBy) {
            for (let shadow of parent.shadowedBy) {
                if (shadow.shadows.propVariable === undefined) {
                    this.calculatePrimitiveChildChanges({
                        parent: shadow,
                        definingInd,
                        newValue,
                        newStateVariableValues,
                        markToIgnoreForParent,
                    });
                }
            }
        }
    }

    async saveImmediately() {
        if (this.saveDocStateTimeoutID) {
            // if in debounce to save doc to local storage
            // then immediate save to local storage
            // and override timeout to save to database
            clearTimeout(this.saveDocStateTimeoutID);
            await this.saveState(true);
        } else {
            // else override timeout to save any pending changes to database
            await this.saveChangesToDatabase(true);
        }
    }

    async saveState(overrideThrottle = false, onSubmission = false) {
        this.saveDocStateTimeoutID = null;

        if (!this.flags.allowSaveState && !this.flags.allowLocalState) {
            return;
        }

        let coreStateString = JSON.stringify(
            this.cumulativeStateVariableChanges,
            serializedComponentsReplacer,
        );
        let rendererStateString = null;

        if (this.flags.saveRendererState) {
            rendererStateString = JSON.stringify(
                this.rendererState,
                serializedComponentsReplacer,
            );
        }

        if (this.flags.allowLocalState) {
            await idb_set(
                `${this.activityId}|${this.docId}|${this.attemptNumber}|${this.cid}`,
                {
                    data_format_version,
                    coreState: coreStateString,
                    rendererState: rendererStateString,
                    coreInfo: this.coreInfoString,
                },
            );
        }

        if (!this.flags.allowSaveState) {
            return;
        }

        this.docStateToBeSavedToDatabase = {
            cid: this.cid,
            coreInfo: this.coreInfoString,
            coreState: coreStateString,
            rendererState: rendererStateString,
            initializeCounters: this.initializeCounters,
            docId: this.docId,
            attemptNumber: this.attemptNumber,
            activityId: this.activityId,
            onSubmission,
        };

        // mark presence of changes
        // so that next call to saveChangesToDatabase will save changes
        this.changesToBeSaved = true;

        // if not currently in throttle, save changes to database
        await this.saveChangesToDatabase(overrideThrottle);
    }

    async saveChangesToDatabase(overrideThrottle) {
        // throttle save to database at 60 seconds

        if (!this.changesToBeSaved) {
            return;
        }

        if (this.saveStateToDBTimerId !== null) {
            if (overrideThrottle) {
                clearTimeout(this.saveStateToDBTimerId);
            } else {
                return;
            }
        }

        this.changesToBeSaved = false;

        // check for changes again after 60 seconds
        this.saveStateToDBTimerId = setTimeout(() => {
            this.saveStateToDBTimerId = null;
            this.saveChangesToDatabase();
        }, 60000);

        this.reportScoreAndStateCallback({
            state: { ...this.docStateToBeSavedToDatabase },
            score: await this.document.stateValues.creditAchieved,
        });

        return;
    }

    /**
     * Poll `requestSolutionViewCallback` to determine whether or not
     * the user is allowed to view the solution.
     *
     * Note: this will occur only if the `solutionDisplayMode` flag is set to
     * "buttonRequirePermission".
     */
    async requestSolutionView(componentIdx) {
        const requestResult =
            await this.requestSolutionViewCallback(componentIdx);

        return {
            allowView: requestResult.allowView,
        };
    }

    get scoredComponentWeights() {
        return (async () =>
            (await this.document.stateValues.scoredDescendants).map(
                (x) => x.stateValues.weight,
            ))();
    }

    handleVisibilityChange(documentIsVisible) {
        if (documentIsVisible) {
            this.resumeVisibilityMeasuring();
        } else {
            this.suspendVisibilityMeasuring();
        }
    }

    async handleNavigatingToComponent({ componentIdx, hash }) {
        let component = this._components[componentIdx];
        if (component) {
            let componentAndAncestors = [
                componentIdx,
                ...component.ancestors.map((x) => x.componentIdx),
            ];
            let openedParent = false;
            for (let cIdx of componentAndAncestors) {
                let comp = this._components[cIdx];
                if (comp.actions?.revealSection) {
                    let isOpen = await comp.stateValues.open;

                    if (isOpen === false) {
                        await this.performAction({
                            componentIdx: cIdx,
                            actionName: "revealSection",
                        });
                        if (cIdx !== componentIdx) {
                            openedParent = true;
                        }
                    }
                }
            }
            if (openedParent) {
                // If just opened parent, then we couldn't have navigated to target yet
                // as the target didn't exist in the DOM when the parent was closed.
                // Navigate to the specified hash now.
                postMessage({
                    messageType: "navigateToHash",
                    args: { hash },
                });
            }
        }
    }

    async terminate() {
        let pause100 = function () {
            return new Promise((resolve, reject) => {
                setTimeout(resolve, 100);
            });
        };

        // suspend visibility measuring so that remaining times collected are saved
        await this.suspendVisibilityMeasuring();

        if (this.submitAnswersTimeout) {
            clearTimeout(this.submitAnswersTimeout);
            await this.autoSubmitAnswers();
        }

        this.stopProcessingRequests = true;

        if (this.processing) {
            for (let i = 0; i < 10; i++) {
                await pause100();
                if (!this.processing) {
                    break;
                }
            }
        }

        await this.saveImmediately();
    }

    recordAnswerToAutoSubmit(componentIdx) {
        if (!this.answersToSubmit) {
            this.answersToSubmit = [];
        }

        if (!this.answersToSubmit.includes(componentIdx)) {
            this.answersToSubmit.push(componentIdx);
        }

        clearTimeout(this.submitAnswersTimeout);

        //Debounce the submit answers
        this.submitAnswersTimeout = setTimeout(() => {
            this.autoSubmitAnswers();
        }, 1000);
    }

    async autoSubmitAnswers() {
        let toSubmit = this.answersToSubmit;
        this.answersToSubmit = [];
        for (let componentIdx of toSubmit) {
            let component = this._components[componentIdx];

            if (component.actions.submitAnswer) {
                await this.requestAction({
                    componentIdx,
                    actionName: "submitAnswer",
                });
            }
        }
    }

    requestComponentDoenetML(componentIdx, displayOnlyChildren) {
        let component = this.components[componentIdx];

        if (!component) {
            return null;
        }

        let position = component.position;

        if (!position) {
            return null;
        }
        let sourceDoc = component.sourceDoc ?? 0;

        let startInd, endInd;

        if (displayOnlyChildren) {
            if (!component.childrenPosition) {
                return "";
            }
            startInd = component.childrenPosition.start.offset;
            endInd = component.childrenPosition.end.offset;
        } else {
            startInd = position.start.offset;
            endInd = position.end.offset;
        }

        let componentDoenetML = this.allDoenetMLs[sourceDoc].slice(
            startInd,
            endInd,
        );

        if (displayOnlyChildren) {
            // remove any leading linebreak
            // or any trailing linebreak (possibly followed by spaces or tabs)
            // to remove spacing due to just having the children on different lines from the enclosing parent tags
            if (componentDoenetML[0] === "\n") {
                componentDoenetML = componentDoenetML.slice(1);
            }
            componentDoenetML = componentDoenetML.replace(
                /\n[ \t]*$(?!\n)/,
                "",
            );
        }

        let lines = componentDoenetML.split("\n");

        // min number of spaces that begin a line (ignoring first and any lines that are all whitespace)
        let minSpaces = lines
            .slice(1)
            .reduce(
                (a, c) =>
                    Math.min(
                        a,
                        c.trim().length > 1 ? c.search(/\S|$/) : Infinity,
                    ),
                Infinity,
            );

        // check first line if didn't get a number of spaces from remaining lines
        if (minSpaces === Infinity && lines[0].trim().length > 1) {
            minSpaces = lines[0].search(/\S|$/);
        }

        if (Number.isFinite(minSpaces) && minSpaces > 0) {
            lines = lines.map((s) => {
                let nStrip = Math.min(minSpaces, s.search(/\S|$/));
                return s.slice(nStrip);
            });
            componentDoenetML = lines.join("\n");
        }

        return componentDoenetML;
    }

    navigateToTarget(args) {
        postMessage({
            messageType: "navigateToTarget",
            coreId: this.coreId,
            args,
        });
    }
}

function validateAttributeValue({ value, attributeSpecification, attribute }) {
    let warnings = [];

    if (
        attributeSpecification.transformNonFiniteTo !== undefined &&
        !Number.isFinite(value)
    ) {
        value = attributeSpecification.transformNonFiniteTo;
    }

    if (attributeSpecification.toLowerCase) {
        value = value.toLowerCase();
    }

    // `validValues` implies `trim` so that extra spaces don't break the matches
    if (attributeSpecification.trim || attributeSpecification.validValues) {
        value = value.trim();
    }

    if (attributeSpecification.validValues) {
        if (!attributeSpecification.validValues.includes(value)) {
            let defaultValue = attributeSpecification.defaultValue;
            if (defaultValue === undefined) {
                if (attributeSpecification.createPrimitiveOfType) {
                    defaultValue = attributeSpecification.defaultPrimitiveValue;
                }
                if (defaultValue === undefined) {
                    throw Error(
                        "Invalid attribute specification: no default value specified",
                    );
                }
            }
            warnings.push({
                message: `Invalid value ${value} for attribute ${attribute}, using value ${defaultValue}`,
                level: 2,
            });
            value = defaultValue;
        }
    } else if (attributeSpecification.clamp) {
        if (value < attributeSpecification.clamp[0]) {
            value = attributeSpecification.clamp[0];
        } else if (value > attributeSpecification.clamp[1]) {
            value = attributeSpecification.clamp[1];
        } else if (!Number.isFinite(value)) {
            value = attributeSpecification.defaultValue;
        }
    }

    return { value, warnings };
}

function calculateAllComponentsShadowing(component) {
    let allShadowing = [];
    if (component.shadowedBy) {
        for (let comp2 of component.shadowedBy) {
            if (
                !comp2.shadows.propVariable &
                !comp2.constructor.doNotExpandAsShadowed
            ) {
                allShadowing.push(comp2.componentIdx);
                let additionalShadowing =
                    calculateAllComponentsShadowing(comp2);
                allShadowing.push(...additionalShadowing);
            }
        }
    }

    // Idea for this part: if a component is shadowing this component's composite,
    // then it is effectively shadowing the component
    // TODO 1: Why do we need to to this?  Why aren't these components reachable through shadowBy?
    // TODO 2: Does this properly deal with the no-link case?
    if (component.replacementOf) {
        let additionalShadowing = calculateAllComponentsShadowing(
            component.replacementOf,
        );
        allShadowing.push(...additionalShadowing);
    }

    return allShadowing;
}

function numberAnswers(components, componentInfoObjects, numSoFar = 0) {
    let count = numSoFar;

    for (let comp of components) {
        if (
            comp.componentType === "answer" ||
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: comp.componentType,
                baseComponentType: "_blockScoredComponent",
            })
        ) {
            count++;
            comp.answerNumber = count;
        } else if (comp.children) {
            const result = numberAnswers(
                comp.children,
                componentInfoObjects,
                count,
            );
            count = result.count;
        }
    }

    return { count };
}
