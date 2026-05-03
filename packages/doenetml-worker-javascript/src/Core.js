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
import { preprocessAttributesObject } from "./utils/attributes";
import {
    convertUnresolvedAttributesForComponentType,
    unwrapSource,
} from "./utils/dast/convertNormalizedDast";
import { DependencyHandler } from "./Dependencies";
import { ActionTriggerScheduler } from "./ActionTriggerScheduler";
import { AutoSubmitManager } from "./AutoSubmitManager";
import { ChildMatcher } from "./ChildMatcher";
import { ComponentBuilder } from "./ComponentBuilder";
import { ComponentLifecycle } from "./ComponentLifecycle";
import { CompositeExpander } from "./CompositeExpander";
import { DeletionEngine } from "./DeletionEngine";
import { DiagnosticsManager } from "./DiagnosticsManager";
import { NavigationHandler } from "./NavigationHandler";
import { ProcessQueue } from "./ProcessQueue";
import { RendererInstructionBuilder } from "./RendererInstructionBuilder";
import { ResolverAdapter } from "./ResolverAdapter";
import { StatePersistence } from "./StatePersistence";
import { StateVariableDefinitionFactory } from "./StateVariableDefinitionFactory";
import { StateVariableInitializer } from "./StateVariableInitializer";
import { VisibilityTracker } from "./VisibilityTracker";
import * as nameResolver from "./StateVariableNameResolver";
import {
    returnDefaultArrayVarNameFromPropIndex,
    returnDefaultGetArrayKeysFromVarName,
} from "./utils/stateVariables";
import {
    createComponentIndicesFromSerializedChildren,
    createNewComponentIndices,
    extractCreateComponentIdxMapping,
} from "./utils/componentIndices";
// string to componentClass: this.componentInfoObjects.allComponentClasses["string"]
// componentClass to string: componentClass.componentType

// Several feature areas have been extracted into their own modules
// (DiagnosticsManager, VisibilityTracker, StatePersistence, AutoSubmitManager,
// NavigationHandler, ResolverAdapter, RendererInstructionBuilder,
// ProcessQueue, ComponentLifecycle, ChildMatcher, DeletionEngine,
// ActionTriggerScheduler, StateVariableDefinitionFactory,
// StateVariableInitializer, ComponentBuilder, CompositeExpander, and the
// `nameResolver` namespace). Core retains thin wrapper methods so the public
// surface — used by CoreWorker, `coreFunctions`-bound references, components,
// and tests — keeps working. Each delegating block is grouped near its
// original location and tagged with a `// → managerName` marker; see the
// corresponding module for details.

export default class Core {
    constructor({
        doenetML,
        serializedDocument,
        nComponentsInit,
        componentInfoObjects,
        flags,
        allDoenetMLs,
        preliminaryDiagnostics,
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

        this.diagnosticsManager = new DiagnosticsManager({
            core: this,
            preliminaryDiagnostics,
        });

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

        this.cumulativeStateVariableChanges = JSON.parse(
            JSON.stringify(stateVariableChanges, serializedComponentsReplacer),
            serializedComponentsReviver,
        );

        this.requestedVariantIndex = requestedVariantIndex;
        this.requestedVariant = requestedVariant;

        this.visibilityTracker = new VisibilityTracker({ core: this });
        this.autoSubmitManager = new AutoSubmitManager({ core: this });
        this.navigationHandler = new NavigationHandler({ core: this });
        this.resolverAdapter = new ResolverAdapter({ core: this });
        this.rendererInstructionBuilder = new RendererInstructionBuilder({
            core: this,
        });
        this.processQueueManager = new ProcessQueue({ core: this });
        this.componentLifecycle = new ComponentLifecycle({ core: this });
        this.childMatcher = new ChildMatcher({ core: this });
        this.deletionEngine = new DeletionEngine({ core: this });
        this.actionTriggerScheduler = new ActionTriggerScheduler({
            core: this,
        });
        this.stateVariableDefinitionFactory =
            new StateVariableDefinitionFactory({
                core: this,
            });
        this.stateVariableInitializer = new StateVariableInitializer({
            core: this,
        });
        this.componentBuilder = new ComponentBuilder({ core: this });
        this.compositeExpander = new CompositeExpander({ core: this });

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
        this.componentIdxByStateId = {};
        this._components[this.nComponentsInit - 1] = undefined;
        this.errorComponentsToAdd = [];

        // Reset action-trigger registries managed by `this.actionTriggerScheduler`
        // (see ActionTriggerScheduler.ts) so a previous run does not leak in.
        this.actionTriggerScheduler.reset();

        this.essentialValuesSavedInDefinition = {};

        this.statePersistence = new StatePersistence({ core: this });

        // Reset renderer state managed by `this.rendererInstructionBuilder`
        // (see RendererInstructionBuilder.ts) so a previous run does not leak
        // into this document.
        this.rendererInstructionBuilder.reset();

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

        // Reset the process queue managed by `this.processQueueManager`
        // (see ProcessQueue.ts) so a previous run does not leak into this
        // document.
        this.processQueueManager.reset();

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
                    this.componentIdxByStateId[
                        this.cumulativeStateVariableChanges
                            .__componentNeedingUpdateValue
                    ],
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
                this.addDiagnostic({
                    type: "warning",
                    message: this.unmatchedChildren[componentIdxStr].message,
                    position: parent.position,
                    sourceDoc: parent.sourceDoc,
                });
            }
        }

        let diagnostics = undefined;
        if (this.hasPendingDiagnostics) {
            diagnostics = this.getDiagnostics().diagnostics;
        }

        return { ...returnResult, diagnostics };
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

    // → rendererInstructionBuilder
    get componentsToRender() {
        return this.rendererInstructionBuilder.componentsToRender;
    }

    get componentsWithChangedChildrenToRender() {
        return this.rendererInstructionBuilder
            .componentsWithChangedChildrenToRender;
    }

    get rendererState() {
        return this.rendererInstructionBuilder.rendererState;
    }

    callUpdateRenderers(args, init = false) {
        return this.rendererInstructionBuilder.callUpdateRenderers(args, init);
    }

    // → diagnosticsManager
    get diagnostics() {
        return this.diagnosticsManager.diagnostics;
    }

    get hasPendingDiagnostics() {
        return this.diagnosticsManager.hasPendingDiagnostics;
    }

    getDiagnostics() {
        return this.diagnosticsManager.getDiagnostics();
    }

    assertDiagnosticIsValid(diagnostic) {
        this.diagnosticsManager.assertDiagnosticIsValid(diagnostic);
    }

    addDiagnostic(diagnostic) {
        return this.diagnosticsManager.addDiagnostic(diagnostic);
    }

    getSourceLocationForComponent(component) {
        return this.diagnosticsManager.getSourceLocationForComponent(component);
    }

    // → componentBuilder
    async addComponents(args) {
        return this.componentBuilder.addComponents(args);
    }

    async createIsolatedComponents(args) {
        return this.componentBuilder.createIsolatedComponents(args);
    }

    async createChildrenThenComponent(args) {
        return this.componentBuilder.createChildrenThenComponent(args);
    }

    async checkForStateVariablesUpdatesForNewComponent(componentIdx) {
        return this.componentBuilder.checkForStateVariablesUpdatesForNewComponent(
            componentIdx,
        );
    }

    findShadowedChildInSerializedComponents(args) {
        return this.componentBuilder.findShadowedChildInSerializedComponents(
            args,
        );
    }

    async addQueuedErrorComponentsFromStateVariables() {
        return this.componentBuilder.addQueuedErrorComponentsFromStateVariables();
    }

    async updateRendererInstructions(args) {
        return this.rendererInstructionBuilder.updateRendererInstructions(args);
    }

    async initializeRenderedComponentInstruction(
        component,
        componentsWithChangedChildrenToRenderInProgress,
    ) {
        return this.rendererInstructionBuilder.initializeRenderedComponentInstruction(
            component,
            componentsWithChangedChildrenToRenderInProgress,
        );
    }

    getRendererId(component) {
        return this.rendererInstructionBuilder.getRendererId(component);
    }

    deleteFromComponentsToRender(args) {
        return this.rendererInstructionBuilder.deleteFromComponentsToRender(
            args,
        );
    }

    // → actionTriggerScheduler
    get stateVariableChangeTriggers() {
        return this.actionTriggerScheduler.stateVariableChangeTriggers;
    }

    get actionsChangedToActions() {
        return this.actionTriggerScheduler.actionsChangedToActions;
    }

    get originsOfActionsChangedToActions() {
        return this.actionTriggerScheduler.originsOfActionsChangedToActions;
    }

    async processStateVariableTriggers(updateRenderersIfTriggered = false) {
        return this.actionTriggerScheduler.processStateVariableTriggers(
            updateRenderersIfTriggered,
        );
    }

    recordStateVariablesMustEvaluate(componentIdx) {
        return this.actionTriggerScheduler.recordStateVariablesMustEvaluate(
            componentIdx,
        );
    }

    async checkForActionChaining(args) {
        return this.actionTriggerScheduler.checkForActionChaining(args);
    }

    // → compositeExpander
    async expandAllComposites(component, force = false) {
        return this.compositeExpander.expandAllComposites(component, force);
    }

    async expandCompositesOfDescendants(component, force = false) {
        return this.compositeExpander.expandCompositesOfDescendants(
            component,
            force,
        );
    }

    async componentAndRenderedDescendants(component) {
        return this.compositeExpander.componentAndRenderedDescendants(
            component,
        );
    }

    async expandCompositeOfDefiningChildren(
        parent,
        children,
        expandComposites,
        forceExpandComposites,
    ) {
        return this.compositeExpander.expandCompositeOfDefiningChildren(
            parent,
            children,
            expandComposites,
            forceExpandComposites,
        );
    }

    async expandCompositeComponent(component) {
        return this.compositeExpander.expandCompositeComponent(component);
    }

    async expandShadowingComposite(component) {
        return this.compositeExpander.expandShadowingComposite(component);
    }

    adjustForCreateComponentIdxName(serializedReplacements, composite) {
        return this.compositeExpander.adjustForCreateComponentIdxName(
            serializedReplacements,
            composite,
        );
    }

    async createAndSetReplacements(args) {
        return this.compositeExpander.createAndSetReplacements(args);
    }

    async replaceCompositeChildren(parent) {
        return this.compositeExpander.replaceCompositeChildren(parent);
    }

    async addUndisplayableErrorChildrenToAncestor(
        parent,
        undisplayableErrorChildren,
    ) {
        return this.compositeExpander.addUndisplayableErrorChildrenToAncestor(
            parent,
            undisplayableErrorChildren,
        );
    }

    async markWithheldReplacementsInactive(composite) {
        return this.compositeExpander.markWithheldReplacementsInactive(
            composite,
        );
    }

    async changeInactiveComponentAndDescendants(component, inactive) {
        return this.compositeExpander.changeInactiveComponentAndDescendants(
            component,
            inactive,
        );
    }

    // Child matching, adapter substitution, and rendered-child filtering
    // live in `this.childMatcher` (see ChildMatcher.ts). The methods below
    // preserve the public surface by delegating through.

    async deriveChildResultsFromDefiningChildren(args) {
        return this.childMatcher.deriveChildResultsFromDefiningChildren(args);
    }

    async matchChildrenToChildGroups(parent) {
        return this.childMatcher.matchChildrenToChildGroups(parent);
    }

    findChildGroup(childType, parentClass) {
        return this.childMatcher.findChildGroup(childType, parentClass);
    }

    findChildGroupNoAdapters(
        componentType,
        parentClass,
        afterAdapters = false,
    ) {
        return this.childMatcher.findChildGroupNoAdapters(
            componentType,
            parentClass,
            afterAdapters,
        );
    }

    async returnActiveChildrenIndicesToRender(component) {
        return this.childMatcher.returnActiveChildrenIndicesToRender(component);
    }

    async substituteAdapter(args) {
        return this.childMatcher.substituteAdapter(args);
    }

    // → resolverAdapter
    async addReplacementsToResolver(args) {
        return this.resolverAdapter.addReplacementsToResolver(args);
    }

    async determineParentAndIndexResolutionForResolver(args) {
        return this.resolverAdapter.determineParentAndIndexResolutionForResolver(
            args,
        );
    }

    addComponentsToResolver(components, parentIdx) {
        return this.resolverAdapter.addComponentsToResolver(
            components,
            parentIdx,
        );
    }

    gatherDiagnosticsAndAssignDoenetMLRange(args) {
        return this.resolverAdapter.gatherDiagnosticsAndAssignDoenetMLRange(
            args,
        );
    }

    // → stateVariableDefinitionFactory
    async createStateVariableDefinitions(args) {
        return this.stateVariableDefinitionFactory.createStateVariableDefinitions(
            args,
        );
    }

    createAttributeStateVariableDefinitions(args) {
        return this.stateVariableDefinitionFactory.createAttributeStateVariableDefinitions(
            args,
        );
    }

    createAdapterStateVariableDefinitions(args) {
        return this.stateVariableDefinitionFactory.createAdapterStateVariableDefinitions(
            args,
        );
    }

    async createReferenceShadowStateVariableDefinitions(args) {
        return this.stateVariableDefinitionFactory.createReferenceShadowStateVariableDefinitions(
            args,
        );
    }

    modifyStateDefsToBeShadows(args) {
        return this.stateVariableDefinitionFactory.modifyStateDefsToBeShadows(
            args,
        );
    }

    modifyStateDefToDeleteVariableReferences(args) {
        return this.stateVariableDefinitionFactory.modifyStateDefToDeleteVariableReferences(
            args,
        );
    }

    // → stateVariableInitializer
    async initializeComponentStateVariables(component) {
        return this.stateVariableInitializer.initializeComponentStateVariables(
            component,
        );
    }

    async initializeStateVariable(args) {
        return this.stateVariableInitializer.initializeStateVariable(args);
    }

    async initializeArrayEntryStateVariable(args) {
        return this.stateVariableInitializer.initializeArrayEntryStateVariable(
            args,
        );
    }

    async initializeArrayStateVariable(args) {
        return this.stateVariableInitializer.initializeArrayStateVariable(args);
    }

    async createArraySizeStateVariable(args) {
        return this.stateVariableInitializer.createArraySizeStateVariable(args);
    }

    async arrayEntryNamesFromPropIndex(args) {
        return this.stateVariableInitializer.arrayEntryNamesFromPropIndex(args);
    }

    recursivelyReplaceCompositesWithReplacements(args) {
        return this.stateVariableInitializer.recursivelyReplaceCompositesWithReplacements(
            args,
        );
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
        definitionArgs.initialAddPhase = this.initialAddPhase;

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

            if (!this.essentialValuesSavedInDefinition[component.stateId]) {
                this.essentialValuesSavedInDefinition[component.stateId] = {};
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
                    !this.essentialValuesSavedInDefinition[component.stateId][
                        varName
                    ]
                ) {
                    // include key mergeObject to let external functions
                    // know that new attributes of the object
                    // should be merged into the old object
                    this.essentialValuesSavedInDefinition[component.stateId][
                        varName
                    ] = {
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

                    this.essentialValuesSavedInDefinition[component.stateId][
                        varName
                    ][arrayKey] = result.setEssentialValue[varName][arrayKey];
                }
            } else {
                component.essentialState[essentialVarName] =
                    result.setEssentialValue[varName];

                // Since setting an essential value during a definition,
                // we also add the value to essentialValuesSavedInDefinition
                // so that it will be saved to the database during the next update
                this.essentialValuesSavedInDefinition[component.stateId][
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

        if (result.sendDiagnostics?.length > 0) {
            const { position, sourceDoc } =
                this.getSourceLocationForComponent(component);

            for (const diagnostic of result.sendDiagnostics) {
                const addedDiagnostic = this.addDiagnostic({
                    position,
                    sourceDoc,
                    ...diagnostic,
                });

                if (
                    addedDiagnostic &&
                    diagnostic?.type === "error" &&
                    this.initialAddPhase
                ) {
                    this.errorComponentsToAdd.push({
                        componentIdx: component.componentIdx,
                        position,
                        sourceDoc,
                        ...diagnostic,
                    });
                }
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

    /**
     * Build definition/inverse-definition args for a state variable.
     * When consumeChanges is false, dependency change flags are observed but preserved
     * for a later consuming read.
     */
    async getStateVariableDefinitionArguments({
        component,
        stateVariable,
        excludeDependencyValues,
        consumeChanges = true,
    }) {
        // console.log(`get state variable dependencies of ${component.componentIdx}, ${stateVariable}`)

        let args;
        if (excludeDependencyValues) {
            args = {};
        } else {
            args = await this.dependencies.getStateVariableDependencyValues({
                component,
                stateVariable,
                consumeChanges,
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

    // → nameResolver (state-variable name-resolution wrappers inject
    //   `componentInfoObjects` so external callers don't have to.)

    findCaseInsensitiveMatches({ stateVariables, componentClass }) {
        return nameResolver.findCaseInsensitiveMatches({
            stateVariables,
            componentClass,
            componentInfoObjects: this.componentInfoObjects,
        });
    }

    matchPublicStateVariables({ stateVariables, componentClass }) {
        return nameResolver.matchPublicStateVariables({
            stateVariables,
            componentClass,
            componentInfoObjects: this.componentInfoObjects,
        });
    }

    substituteAliases({ stateVariables, componentClass }) {
        return nameResolver.substituteAliases({
            stateVariables,
            componentClass,
            componentInfoObjects: this.componentInfoObjects,
        });
    }

    publicCaseInsensitiveAliasSubstitutions({
        stateVariables,
        componentClass,
    }) {
        return nameResolver.publicCaseInsensitiveAliasSubstitutions({
            stateVariables,
            componentClass,
            componentInfoObjects: this.componentInfoObjects,
        });
    }

    checkIfArrayEntry({ stateVariable, component }) {
        return nameResolver.checkIfArrayEntry({ stateVariable, component });
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

    // → componentLifecycle
    registerComponent(component) {
        return this.componentLifecycle.registerComponent(component);
    }

    deregisterComponent(component, recursive = true) {
        return this.componentLifecycle.deregisterComponent(
            component,
            recursive,
        );
    }

    setAncestors(component, ancestors = []) {
        return this.componentLifecycle.setAncestors(component, ancestors);
    }

    async addChildrenAndRecurseToShadows(args) {
        return this.componentLifecycle.addChildrenAndRecurseToShadows(args);
    }

    /**
     * Create and insert `_error` siblings requested by state-variable definitions
     * during initial document construction.
     */
    async processNewDefiningChildren(args) {
        return this.componentLifecycle.processNewDefiningChildren(args);
    }

    spliceChildren(parent, indexOfDefiningChildren, newChildren) {
        return this.componentLifecycle.spliceChildren(
            parent,
            indexOfDefiningChildren,
            newChildren,
        );
    }

    // → deletionEngine
    async deleteComponents(args) {
        return this.deletionEngine.deleteComponents(args);
    }

    removeComponentsFromResolver(componentsToRemove) {
        return this.resolverAdapter.removeComponentsFromResolver(
            componentsToRemove,
        );
    }

    determineComponentsToDelete(args) {
        return this.deletionEngine.determineComponentsToDelete(args);
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
        const originalWorkspace = { ...component.replacementsWorkspace };

        do {
            initialNComponents = this.components.length;
            component.replacementsWorkspace = { ...originalWorkspace };
            const rawReplacementResults =
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

            replacementResults = {
                replacementChanges:
                    rawReplacementResults?.replacementChanges ?? [],
                diagnostics: rawReplacementResults?.diagnostics ?? [],
                nComponents:
                    rawReplacementResults?.nComponents ??
                    this.components.length,
            };

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

        if (replacementResults.diagnostics.length > 0) {
            const parent = this.components[component.componentIdx];
            this.gatherDiagnosticsAndAssignDoenetMLRange({
                components: [],
                diagnostics: replacementResults.diagnostics,
                position: parent.position,
                sourceDoc: parent.sourceDoc,
            });
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

                this.gatherDiagnosticsAndAssignDoenetMLRange({
                    components: serializedReplacements,
                    diagnostics: [],
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

        this.addDiagnostic({
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

                // since replacing all replacements, reset replacementsCreated count
                shadowingComponent.replacementsWorkspace.replacementsCreated = 0;

                const stateIdInfo = {
                    prefix: `${shadowingComponent.stateId}|`,
                    num: shadowingComponent.replacementsWorkspace
                        .replacementsCreated,
                };

                let nComponents = this._components.length;
                let newNComponents = nComponents;
                for (let [idx, repl] of replacementsToShadow.entries()) {
                    if (typeof repl === "object") {
                        const serializedComponent = await repl.serialize();

                        if (
                            shadowingComponent.constructor
                                .useSerializedChildrenComponentIndices
                        ) {
                            const res =
                                createComponentIndicesFromSerializedChildren(
                                    [serializedComponent],
                                    [
                                        shadowingComponent.serializedChildren[
                                            idx
                                        ],
                                    ],
                                    newNComponents,
                                    stateIdInfo,
                                );
                            newNComponents = res.nComponents;

                            newSerializedReplacements.push(...res.components);
                        } else {
                            const res = createNewComponentIndices(
                                [serializedComponent],
                                newNComponents,
                                stateIdInfo,
                            );
                            newNComponents = res.nComponents;

                            newSerializedReplacements.push(...res.components);
                        }
                    } else {
                        newSerializedReplacements.push(repl);
                    }
                }

                shadowingComponent.replacementsWorkspace.replacementsCreated =
                    stateIdInfo.num;

                this.adjustForCreateComponentIdxName(
                    newSerializedReplacements,
                    shadowingComponent,
                );

                await this.addReplacementsToResolver({
                    serializedReplacements: newSerializedReplacements,
                    component: shadowingComponent,
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
                    let compositeAttributesObj = preprocessAttributesObject(
                        shadowingComponent.constructor.createAttributesObject(),
                    );

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

    // → processQueueManager
    get processQueue() {
        return this.processQueueManager.queue;
    }

    set processQueue(value) {
        this.processQueueManager.queue = value;
    }

    get processing() {
        return this.processQueueManager.processing;
    }

    set processing(value) {
        this.processQueueManager.processing = value;
    }

    get stopProcessingRequests() {
        return this.processQueueManager.stopProcessingRequests;
    }

    set stopProcessingRequests(value) {
        this.processQueueManager.stopProcessingRequests = value;
    }

    async executeProcesses() {
        return this.processQueueManager.executeProcesses();
    }

    requestAction(args) {
        return this.processQueueManager.requestAction(args);
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
            this.addDiagnostic({
                type: "warning",
                message: `Cannot run action ${actionName} on component ${componentIdx}`,
                position: component.position,
                sourceDoc: component.sourceDoc,
            });
        }

        return {};
    }

    async triggerChainedActions(args) {
        return this.actionTriggerScheduler.triggerChainedActions(args);
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

    async requestUpdate(args) {
        return this.processQueueManager.requestUpdate(args);
    }

    async performUpdate({
        updateInstructions,
        diagnostics,
        actionId,
        event,
        overrideReadOnly = false,
        doNotSave = false,
        canSkipUpdatingRenderer = false,
        skipRendererUpdate = false,
        sourceInformation = {},
    }) {
        if (diagnostics) {
            for (let diagnostic of diagnostics) {
                this.addDiagnostic(diagnostic);
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
                            this.addDiagnostic({
                                type: "info",
                                message: `Cannot delete ${componentIdx} as it doesn't exist.`,
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
                    this._components[instruction.componentIdx].stateId;
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
            for (const stateId in this.essentialValuesSavedInDefinition) {
                const componentIdx = this.componentIdxByStateId[stateId];
                let essentialState =
                    this._components[componentIdx]?.essentialState;
                if (essentialState) {
                    if (!this.cumulativeStateVariableChanges[stateId]) {
                        this.cumulativeStateVariableChanges[stateId] = {};
                    }
                    for (let varName in this.essentialValuesSavedInDefinition[
                        stateId
                    ]) {
                        if (essentialState[varName] !== undefined) {
                            let cumValues =
                                this.cumulativeStateVariableChanges[stateId][
                                    varName
                                ];
                            // if cumValues is an object with mergeObject = true,
                            // then merge attributes from essentialState into cumValues
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
                                this.cumulativeStateVariableChanges[stateId][
                                    varName
                                ] = removeFunctionsMathExpressionClass(
                                    essentialState[varName],
                                );
                            }
                        }
                    }
                }
            }
            this.essentialValuesSavedInDefinition = {};
        }

        if (!doNotSave) {
            // merge in new state variables set in update
            for (let newValuesProcessed of newStateVariableValuesProcessed) {
                for (const componentIdxStr in newValuesProcessed) {
                    const componentIdx = Number(componentIdxStr);
                    const stateId = this._components[componentIdx].stateId;
                    if (!this.cumulativeStateVariableChanges[stateId]) {
                        this.cumulativeStateVariableChanges[stateId] = {};
                    }
                    for (let varName in newValuesProcessed[componentIdx]) {
                        let cumValues =
                            this.cumulativeStateVariableChanges[stateId][
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
                            this.cumulativeStateVariableChanges[stateId][
                                varName
                            ] = removeFunctionsMathExpressionClass(
                                newValuesProcessed[componentIdx][varName],
                            );
                        }
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
            //Debounce the save to localstorage and then to DB with a throttle
            this.statePersistence.scheduleSave(1000);
        }

        // evaluate componentCreditAchieved so that will be fresh
        // and can detect changes when it is marked stale
        await this.document.stateValues.componentCreditAchieved;

        if (event) {
            this.requestRecordEvent(event);
        }
    }

    async updateAllChangedRenderers(sourceInformation = {}, actionId) {
        return this.rendererInstructionBuilder.updateAllChangedRenderers(
            sourceInformation,
            actionId,
        );
    }

    requestRecordEvent(event) {
        return this.processQueueManager.requestRecordEvent(event);
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

    // → visibilityTracker
    get visibilityInfo() {
        return this.visibilityTracker.info;
    }

    processVisibilityChangedEvent(event) {
        return this.visibilityTracker.processVisibilityChangedEvent(event);
    }

    sendVisibilityChangedEvents() {
        return this.visibilityTracker.sendVisibilityChangedEvents();
    }

    async suspendVisibilityMeasuring() {
        return this.visibilityTracker.suspendVisibilityMeasuring();
    }

    resumeVisibilityMeasuring() {
        return this.visibilityTracker.resumeVisibilityMeasuring();
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

    async processNewStateVariableValues(
        newStateVariableValues,
        newComponent = false,
    ) {
        // console.log("process new state variable values");
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

                    if (!match && newComponent) {
                        // if we have a newly created component, then we don't ignore primitive definitions
                        // (they are ignored as an optimization when changing variables dynamically
                        // so that child don't have to be reprocessed)
                        match = vName.match(/^__def_primitive_ignore_(\d+)$/);
                    }

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

                    this.addDiagnostic({
                        type: "info",
                        message: `can't update state variable ${vName} of component ${cIdx}, as it doesn't exist.`,
                        position: this._components[cIdx].position,
                        sourceDoc: this._components[cIdx].sourceDoc,
                    });
                    continue;
                }

                if (!compStateObj.hasEssential) {
                    this.addDiagnostic({
                        type: "info",
                        message: `can't update state variable ${vName} of component ${cIdx}, as it does not have an essential state variable.`,
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
                        this.addDiagnostic({
                            type: "info",
                            message: `can't update state variable ${vName} of component ${cIdx}, as it does not have an essential state variable.`,
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
                consumeChanges: false,
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
                    this.addDiagnostic({
                        type: "info",
                        message: `Can't invert ${varName2} at the same time as ${stateVariable}, as not an additional state variable defined`,
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
            this.addDiagnostic({
                type: "info",
                message: `Cannot change state variable ${stateVariable} of ${component.componentIdx} as it doesn't have an inverse definition`,
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
            this.addDiagnostic({
                type: "info",
                message: `Changing ${stateVariable} of ${component.componentIdx} did not succeed because fixed is true.`,
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
            this.addDiagnostic({
                type: "info",
                message: `Changing ${stateVariable} of ${component.componentIdx} did not succeed because fixLocation is true.`,
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
            this.addDiagnostic({
                type: "info",
                message: `Changing ${stateVariable} of ${component.componentIdx} did not succeed because modifyIndirectly is false.`,
                position: component.position,
                sourceDoc: component.sourceDoc,
            });
            return;
        }

        let inverseResult = await stateVarObj.inverseDefinition(
            inverseDefinitionArgs,
        );

        // Clear any change flags that were set during the inverse definition call
        // This ensures stale flags don't accumulate, even though we didn't consume during the call
        if (!stateVarObj.excludeDependencyValuesInInverseDefinition) {
            await this.dependencies.getStateVariableDependencyValues({
                component,
                stateVariable,
                consumeChanges: true,
            });
        }

        if (inverseResult.sendDiagnostics) {
            for (const diagnostic of inverseResult.sendDiagnostics) {
                this.addDiagnostic({
                    position: component.position,
                    sourceDoc: component.sourceDoc,
                    ...diagnostic,
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
                            this.addDiagnostic({
                                type: "info",
                                message: `Changing ${stateVariable} of ${baseComponent.componentIdx} did not succeed because fixed is true.`,
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
                            this.addDiagnostic({
                                type: "info",
                                message: `Changing ${stateVariable} of ${baseComponent.componentIdx} did not succeed because fixLocation is true.`,
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
                                this.addDiagnostic({
                                    type: "info",
                                    message: `Can't simultaneously set additional dependency value ${dependencyName2} if it isn't a state variable`,
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
                                this.addDiagnostic({
                                    type: "info",
                                    message: `Can't simultaneously set additional dependency value ${dependencyName2} if it doesn't correspond to additional state variable defined of ${dependencyName}'s state variable`,
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

    // → statePersistence
    async saveImmediately() {
        return this.statePersistence.saveImmediately();
    }

    async saveState(overrideThrottle = false, onSubmission = false) {
        return this.statePersistence.saveState(overrideThrottle, onSubmission);
    }

    async saveChangesToDatabase(overrideThrottle) {
        return this.statePersistence.saveChangesToDatabase(overrideThrottle);
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

    // → navigationHandler
    async handleNavigatingToComponent(args) {
        return this.navigationHandler.handleNavigatingToComponent(args);
    }

    async terminate() {
        let pause100 = function () {
            return new Promise((resolve, reject) => {
                setTimeout(resolve, 100);
            });
        };

        // suspend visibility measuring so that remaining times collected are saved
        await this.suspendVisibilityMeasuring();

        await this.autoSubmitManager.flush();

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

    // → autoSubmitManager
    recordAnswerToAutoSubmit(componentIdx) {
        this.autoSubmitManager.recordAnswer(componentIdx);
    }

    async autoSubmitAnswers() {
        return this.autoSubmitManager.submitNow();
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
        return this.navigationHandler.navigateToTarget(args);
    }
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
