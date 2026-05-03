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
import { CompositeReplacementUpdater } from "./CompositeReplacementUpdater";
import { DeletionEngine } from "./DeletionEngine";
import { DiagnosticsManager } from "./DiagnosticsManager";
import { EssentialValueWriter } from "./EssentialValueWriter";
import { NavigationHandler } from "./NavigationHandler";
import { ProcessQueue } from "./ProcessQueue";
import { RendererInstructionBuilder } from "./RendererInstructionBuilder";
import { ResolverAdapter } from "./ResolverAdapter";
import { StalenessPropagator } from "./StalenessPropagator";
import { StatePersistence } from "./StatePersistence";
import { StateVariableDefinitionFactory } from "./StateVariableDefinitionFactory";
import { StateVariableEvaluator } from "./StateVariableEvaluator";
import { StateVariableInitializer } from "./StateVariableInitializer";
import { UpdateExecutor } from "./UpdateExecutor";
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

// Nearly all of Core's prior responsibilities have been extracted into their
// own modules (DiagnosticsManager, VisibilityTracker, StatePersistence,
// AutoSubmitManager, NavigationHandler, ResolverAdapter,
// RendererInstructionBuilder, ProcessQueue, ComponentLifecycle, ChildMatcher,
// DeletionEngine, ActionTriggerScheduler, StateVariableDefinitionFactory,
// StateVariableInitializer, ComponentBuilder, CompositeExpander,
// StateVariableEvaluator, StalenessPropagator, EssentialValueWriter,
// CompositeReplacementUpdater, UpdateExecutor, and the `nameResolver`
// namespace). Core retains thin wrapper methods so the public surface — used
// by CoreWorker, `coreFunctions`-bound references, components, and tests —
// keeps working. Each delegating block is grouped near its original location
// and tagged with a `// → managerName` marker; see the corresponding module
// for details.

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
        this.stateVariableEvaluator = new StateVariableEvaluator({
            core: this,
        });
        this.stalenessPropagator = new StalenessPropagator({ core: this });
        this.essentialValueWriter = new EssentialValueWriter({ core: this });
        this.componentBuilder = new ComponentBuilder({ core: this });
        this.compositeExpander = new CompositeExpander({ core: this });
        this.compositeReplacementUpdater = new CompositeReplacementUpdater({
            core: this,
        });
        this.updateExecutor = new UpdateExecutor({ core: this });

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

    // → childMatcher
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

    // → stateVariableEvaluator
    async getStateVariableValue(args) {
        return this.stateVariableEvaluator.getStateVariableValue(args);
    }

    async getStateVariableDefinitionArguments(args) {
        return this.stateVariableEvaluator.getStateVariableDefinitionArguments(
            args,
        );
    }

    async recordActualChangeInStateVariable(args) {
        return this.stateVariableEvaluator.recordActualChangeInStateVariable(
            args,
        );
    }

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

    // → stalenessPropagator
    async createFromArrayEntry(args) {
        return this.stalenessPropagator.createFromArrayEntry(args);
    }

    async markDescendantsToUpdateRenderers(component) {
        return this.stalenessPropagator.markDescendantsToUpdateRenderers(
            component,
        );
    }

    async markStateVariableAndUpstreamDependentsStale(args) {
        return this.stalenessPropagator.markStateVariableAndUpstreamDependentsStale(
            args,
        );
    }

    async lookUpCurrentFreshness(args) {
        return this.stalenessPropagator.lookUpCurrentFreshness(args);
    }

    async processMarkStale(args) {
        return this.stalenessPropagator.processMarkStale(args);
    }

    async markUpstreamDependentsStale(args) {
        return this.stalenessPropagator.markUpstreamDependentsStale(args);
    }

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

    // → compositeReplacementUpdater

    async updateCompositeReplacements(args) {
        return this.compositeReplacementUpdater.updateCompositeReplacements(
            args,
        );
    }

    async setErrorReplacements(args) {
        return this.compositeReplacementUpdater.setErrorReplacements(args);
    }

    async deleteReplacementsFromShadowsThenComposite(args) {
        return this.compositeReplacementUpdater.deleteReplacementsFromShadowsThenComposite(
            args,
        );
    }

    async processChildChangesAndRecurseToShadows(component) {
        return this.compositeReplacementUpdater.processChildChangesAndRecurseToShadows(
            component,
        );
    }

    async createShadowedReplacements(args) {
        return this.compositeReplacementUpdater.createShadowedReplacements(
            args,
        );
    }

    async adjustReplacementsToWithhold(args) {
        return this.compositeReplacementUpdater.adjustReplacementsToWithhold(
            args,
        );
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

    // → updateExecutor

    async performAction(args) {
        return this.updateExecutor.performAction(args);
    }

    async performUpdate(args) {
        return this.updateExecutor.performUpdate(args);
    }

    // → actionTriggerScheduler (cont.)

    async triggerChainedActions(args) {
        return this.actionTriggerScheduler.triggerChainedActions(args);
    }

    // → processQueueManager (cont.)

    async requestUpdate(args) {
        return this.processQueueManager.requestUpdate(args);
    }

    requestRecordEvent(event) {
        return this.processQueueManager.requestRecordEvent(event);
    }

    // → rendererInstructionBuilder (cont.) — `updateRenderers` is the
    // public entry point that wraps `updateAllChangedRenderers`.

    async updateRenderers({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        if (!skipRendererUpdate) {
            await this.updateAllChangedRenderers(sourceInformation, actionId);
        }
    }

    async updateAllChangedRenderers(sourceInformation = {}, actionId) {
        return this.rendererInstructionBuilder.updateAllChangedRenderers(
            sourceInformation,
            actionId,
        );
    }

    // event emission — assembles the event payload and dispatches it
    // through the host-provided `sendEvent`.

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

    async saveImmediately() {
        return this.statePersistence.saveImmediately();
    }

    async saveState(overrideThrottle = false, onSubmission = false) {
        return this.statePersistence.saveState(overrideThrottle, onSubmission);
    }

    async saveChangesToDatabase(overrideThrottle) {
        return this.statePersistence.saveChangesToDatabase(overrideThrottle);
    }

    // → essentialValueWriter

    async executeUpdateStateVariables(newStateVariableValues) {
        return this.essentialValueWriter.executeUpdateStateVariables(
            newStateVariableValues,
        );
    }

    async replacementChangesFromCompositesToUpdate() {
        return this.essentialValueWriter.replacementChangesFromCompositesToUpdate();
    }

    async processNewStateVariableValues(...args) {
        return this.essentialValueWriter.processNewStateVariableValues(...args);
    }

    async requestComponentChanges(args) {
        return this.essentialValueWriter.requestComponentChanges(args);
    }

    calculateEssentialVariableChanges(args) {
        return this.essentialValueWriter.calculateEssentialVariableChanges(
            args,
        );
    }

    calculatePrimitiveChildChanges(args) {
        return this.essentialValueWriter.calculatePrimitiveChildChanges(args);
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
