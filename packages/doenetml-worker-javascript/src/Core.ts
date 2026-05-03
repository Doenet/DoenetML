import ParameterStack from "./ParameterStack";
// `Numerics.js` is still JavaScript; cast at the import site once.
// eslint-disable-next-line @typescript-eslint/no-var-requires
import Numerics from "./Numerics";
import seedrandom from "seedrandom";
import {
    serializedComponentsReplacer,
    serializedComponentsReviver,
    deepClone,
    findAllNewlines,
    type ComponentIdx,
} from "@doenet/utils";
import { getNumVariants } from "./utils/variants";
import { removeFunctionsMathExpressionClass } from "./utils/math";
import { reportTimerError, TimerLabels } from "./utils/timerErrors";
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
import { numberAnswers } from "./utils/answer";

// String → componentClass: `this.componentInfoObjects.allComponentClasses["string"]`.
// componentClass → string: `componentClass.componentType`.
//
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

/**
 * Constructor arguments passed in from `CoreWorker`. The resolver callbacks
 * are optional because `CoreWorker` types them as optional fields and spreads
 * them into the constructor bag — they may be `undefined` until
 * `initializeWorker` has run. Extra fields (e.g. `userId`) are forwarded
 * untouched by the spread and accepted via the index signature.
 */
export interface CoreOptions {
    doenetML: string;
    serializedDocument: any;
    nComponentsInit: number;
    componentInfoObjects: any;
    flags: Record<string, any>;
    allDoenetMLs: string[];
    preliminaryDiagnostics?: any;
    activityId: string;
    cid: string | null;
    docId: string;
    attemptNumber?: number;
    requestedVariant?: Record<string, any>;
    requestedVariantIndex?: number;
    initializeCounters?: Record<string, number>;
    theme?: "dark" | "light";
    prerender?: boolean;
    stateVariableChanges?: string;
    coreId: string;
    addNodesToResolver?: (...args: any[]) => any;
    replaceIndexResolutionsInResolver?: (...args: any[]) => any;
    deleteNodesFromResolver?: (...args: any[]) => any;
    resolvePath?: (...args: any[]) => any;
    calculateRootNames?: () => { names: any };
    updateRenderersCallback: (...args: any[]) => any;
    reportScoreAndStateCallback: (...args: any[]) => any;
    requestAnimationFrame: (...args: any[]) => any;
    cancelAnimationFrame: (...args: any[]) => any;
    copyToClipboard: (...args: any[]) => any;
    sendEvent: (payload: any) => any;
    requestSolutionView: (componentIdx: ComponentIdx) => Promise<any>;
    [k: string]: any;
}

export interface UpdateInfo {
    componentsToUpdateRenderers: Set<ComponentIdx>;
    compositesToExpand: Set<ComponentIdx>;
    compositesToUpdateReplacements: Set<ComponentIdx>;
    inactiveCompositesToUpdateReplacements: Set<ComponentIdx>;
    componentsToUpdateActionChaining: Record<string, any>;
    unresolvedDependencies: Record<string, any>;
    unresolvedByDependent: Record<string, any>;
    deletedStateVariables: Record<string, any>;
    deletedComponents: Record<ComponentIdx, any>;
    compositesBeingExpanded: ComponentIdx[];
    stateVariableUpdatesForMissingComponents: Record<string, any>;
    stateVariablesToEvaluate: any[];
}

export interface CoreInfo {
    generatedVariantString: string;
    allPossibleVariants: any;
    rendererTypesInDocument: any;
    documentToRender: any;
}

export default class Core {
    // ─── Identity / configuration ─────────────────────────────────────────
    coreId: string;
    activityId: string;
    docId: string;
    attemptNumber: number;
    doenetML: string;
    allDoenetMLs: string[];
    serializedDocument: any;
    nComponentsInit: number;
    cid: string | null;
    flags: Record<string, any>;
    theme?: "dark" | "light";
    initializeCounters: Record<string, number>;

    // ─── Resolver callbacks (from CoreWorker) ─────────────────────────────
    addNodesToResolver?: (...args: any[]) => any;
    replaceIndexResolutionsInResolver?: (...args: any[]) => any;
    deleteNodesFromResolver?: (...args: any[]) => any;
    resolvePath?: (...args: any[]) => any;
    calculateRootNames?: () => { names: any };
    rootNames: any;

    // ─── Host callbacks ───────────────────────────────────────────────────
    updateRenderersCallback: (...args: any[]) => any;
    reportScoreAndStateCallback: (...args: any[]) => any;
    requestAnimationFrame: (...args: any[]) => any;
    cancelAnimationFrame: (...args: any[]) => any;
    copyToClipboard: (...args: any[]) => any;
    sendEvent: (payload: any) => any;
    requestSolutionViewCallback: (componentIdx: ComponentIdx) => Promise<any>;

    // ─── Bound entry points ───────────────────────────────────────────────
    getDast: (...args: any[]) => Promise<any>;
    coreFunctions: Record<string, (...args: any[]) => any>;

    // ─── Variant / state ──────────────────────────────────────────────────
    requestedVariantIndex?: number;
    requestedVariant?: Record<string, any>;
    receivedStateVariableChanges: boolean;
    cumulativeStateVariableChanges: any;
    canonicalGeneratedVariantString?: string;
    canonicalDocVariantStrings?: string[];
    coreInfo?: CoreInfo;
    coreInfoString?: string;
    doenetMLNewlines?: any;

    // ─── Component graph ──────────────────────────────────────────────────
    componentInfoObjects: any;
    _components!: any[];
    document!: any;
    documentIdx!: ComponentIdx;
    componentIdxByStateId!: Record<string, ComponentIdx>;
    createComponentIdxMapping: Record<number, number>;
    errorComponentsToAdd!: any[];
    essentialValuesSavedInDefinition!: Record<string, any>;
    rendererVariablesByComponentType!: Record<string, any>;
    unmatchedChildren!: Record<number, any>;
    updateInfo: UpdateInfo;
    /** Set by `ComponentBuilder` once the document renderer tree exists. */
    documentRendererInstructions?: any;
    /** Counter mutated by `ComponentBuilder.addComponents`. */
    nTimesAddedComponents?: number;
    /** Set by `ComponentBuilder.addComponents`; read by state-variable
     * evaluation to gate definition arguments during initial document
     * construction. */
    initialAddPhase?: boolean;

    // ─── Manager instances ────────────────────────────────────────────────
    diagnosticsManager: DiagnosticsManager;
    visibilityTracker: VisibilityTracker;
    autoSubmitManager: AutoSubmitManager;
    navigationHandler: NavigationHandler;
    resolverAdapter: ResolverAdapter;
    rendererInstructionBuilder: RendererInstructionBuilder;
    processQueueManager: ProcessQueue;
    componentLifecycle: ComponentLifecycle;
    childMatcher: ChildMatcher;
    deletionEngine: DeletionEngine;
    actionTriggerScheduler: ActionTriggerScheduler;
    stateVariableDefinitionFactory: StateVariableDefinitionFactory;
    stateVariableInitializer: StateVariableInitializer;
    stateVariableEvaluator: StateVariableEvaluator;
    stalenessPropagator: StalenessPropagator;
    essentialValueWriter: EssentialValueWriter;
    componentBuilder: ComponentBuilder;
    compositeExpander: CompositeExpander;
    compositeReplacementUpdater: CompositeReplacementUpdater;
    updateExecutor: UpdateExecutor;
    statePersistence: StatePersistence;

    // ─── Utility services (still untyped JS) ──────────────────────────────
    numerics: any;
    parameterStack: ParameterStack;

    // ─── Dependencies (typed via Dependencies.d.ts shim) ──────────────────
    dependencies!: DependencyHandler;

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
    }: CoreOptions) {
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

        this.numerics = new (Numerics as any)();
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
            componentsToUpdateRenderers: new Set<ComponentIdx>(),
            compositesToExpand: new Set<ComponentIdx>(),
            compositesToUpdateReplacements: new Set<ComponentIdx>(),
            inactiveCompositesToUpdateReplacements: new Set<ComponentIdx>(),
            componentsToUpdateActionChaining: {},

            unresolvedDependencies: {},
            unresolvedByDependent: {},
            deletedStateVariables: {},
            deletedComponents: {},
            compositesBeingExpanded: [],
            // `stateVariableUpdatesForMissingComponents` is the set of
            // updates whose target component does not yet exist (e.g. it
            // hasn't been created by a composite). The original
            // `JSON.stringify`/`JSON.parse` round-trip with the
            // replacer/reviver pair is preserved verbatim — `deepClone`
            // would not invoke the replacer.
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
        // `StatePersistence` is grouped with the other lifecycle managers
        // here (deferred §"`statePersistence` instantiation position");
        // its `terminate()` awaits `saveImmediately()`, so it must be
        // present before the first `terminate()` call.
        this.statePersistence = new StatePersistence({ core: this });

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
    async generateDast(): Promise<{ coreInfo: CoreInfo; diagnostics?: any }> {
        this.doenetMLNewlines = findAllNewlines(this.allDoenetMLs[0]);

        let serializedComponents = [deepClone(this.serializedDocument)];

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

        // Cancel any pending saves and clear the buffered payload managed
        // by `this.statePersistence` (see StatePersistence.ts) so a
        // previous run does not leak into this document.
        this.statePersistence.reset();

        // Reset renderer state managed by `this.rendererInstructionBuilder`
        // (see RendererInstructionBuilder.ts) so a previous run does not leak
        // into this document.
        this.rendererInstructionBuilder.reset();

        // `rendererVariablesByComponentType` is a description of the variables
        // sent to the renderers, keyed by componentType.
        this.rendererVariablesByComponentType = {};
        for (let componentType in this.componentInfoObjects
            .allComponentClasses) {
            Object.defineProperty(
                this.rendererVariablesByComponentType,
                componentType,
                {
                    get: function (this: Core) {
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

        let numVariants = getNumVariants({
            serializedComponent: serializedComponents[0],
            componentInfoObjects: this.componentInfoObjects,
        }).numVariants;

        if (!this.requestedVariant) {
            // Don't have full variant, just requested variant index.
            this.requestedVariantIndex =
                ((((this.requestedVariantIndex! - 1) % numVariants) +
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

            // Either didn't have unique variants or getting unique variant
            // failed, so just set variant index — the rest of the variant
            // is generated from that index.
            if (!this.requestedVariant) {
                this.requestedVariant = { index: this.requestedVariantIndex };
            }
        }

        this.parameterStack.parameters.variant = this.requestedVariant;
        serializedComponents[0].variants.desiredVariant =
            this.parameterStack.parameters.variant;

        await this.addComponents({
            serializedComponents,
            initialAdd: true,
        });

        this.updateInfo.componentsToUpdateRenderers.clear();

        // Evaluate `componentCreditAchieved` so it's fresh and changes
        // can be detected when it's marked stale.
        await this.document.stateValues.componentCreditAchieved;

        this.canonicalGeneratedVariantString = JSON.stringify(
            await this.document.stateValues.generatedVariantInfo,
            serializedComponentsReplacer,
        );
        this.canonicalDocVariantStrings = (
            await this.document.stateValues.docVariantInfo
        ).map((x: any) => JSON.stringify(x, serializedComponentsReplacer));

        // Note: `coreInfo` is fixed even though `this.rendererTypesInDocument`
        // could change. Both the canonical variant strings and the original
        // `rendererTypesInDocument` could differ depending on the initial state.
        this.coreInfo = {
            generatedVariantString: this.canonicalGeneratedVariantString!,
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
            // TODO: find a way to delay this until after sending the result.
            // Fire-and-forget by design; surface rejections instead of
            // letting them slip past `unhandledRejection`.
            this.saveState().catch(
                reportTimerError(TimerLabels.generateDastSaveState),
            );
        }

        const returnResult = {
            coreInfo: this.coreInfo,
        };

        // Warn about any unmatched children.
        if (Object.keys(this.unmatchedChildren).length > 0) {
            for (const componentIdxStr in this.unmatchedChildren) {
                let parent = this._components[Number(componentIdxStr)];
                this.addDiagnostic({
                    type: "warning",
                    message:
                        this.unmatchedChildren[Number(componentIdxStr)].message,
                    position: parent.position,
                    sourceDoc: parent.sourceDoc,
                });
            }
        }

        let diagnostics: any = undefined;
        if (this.hasPendingDiagnostics) {
            diagnostics = this.getDiagnostics().diagnostics;
        }

        return { ...returnResult, diagnostics };
    }

    async onDocumentFirstVisible(): Promise<void> {
        this.requestRecordEvent({
            verb: "experienced",
            object: {
                componentIdx: this.document.componentIdx,
                componentType: "document",
            },
        });

        await this.document.stateValues.scoredDescendants; // evaluate scoredDescendants

        // `sendVisibilityChangedEvents()` returns a Promise; the bare
        // `setTimeout` call would discard rejections. Wrap so unhandled
        // errors surface (deferred §"Pre-existing fire-and-forget calls").
        setTimeout(() => {
            this.sendVisibilityChangedEvents()?.catch(
                reportTimerError(TimerLabels.firstVisibleSend),
            );
        }, this.visibilityInfo.saveDelay);
    }

    // → rendererInstructionBuilder
    get componentsToRender(): any {
        return this.rendererInstructionBuilder.componentsToRender;
    }

    get componentsWithChangedChildrenToRender(): any {
        return this.rendererInstructionBuilder
            .componentsWithChangedChildrenToRender;
    }

    get rendererState(): any {
        return this.rendererInstructionBuilder.rendererState;
    }

    callUpdateRenderers(args: any, init: boolean = false): any {
        return this.rendererInstructionBuilder.callUpdateRenderers(args, init);
    }

    // → diagnosticsManager
    get diagnostics(): any {
        return this.diagnosticsManager.diagnostics;
    }

    get hasPendingDiagnostics(): boolean {
        return this.diagnosticsManager.hasPendingDiagnostics;
    }

    getDiagnostics(): any {
        return this.diagnosticsManager.getDiagnostics();
    }

    addDiagnostic(diagnostic: any): any {
        return this.diagnosticsManager.addDiagnostic(diagnostic);
    }

    getSourceLocationForComponent(component: any): any {
        return this.diagnosticsManager.getSourceLocationForComponent(component);
    }

    // → componentBuilder
    async addComponents(args: any): Promise<any> {
        return this.componentBuilder.addComponents(args);
    }

    async createIsolatedComponents(args: any): Promise<any> {
        return this.componentBuilder.createIsolatedComponents(args);
    }

    async createChildrenThenComponent(args: any): Promise<any> {
        return this.componentBuilder.createChildrenThenComponent(args);
    }

    async checkForStateVariablesUpdatesForNewComponent(
        componentIdx: ComponentIdx,
    ): Promise<any> {
        return this.componentBuilder.checkForStateVariablesUpdatesForNewComponent(
            componentIdx,
        );
    }

    async addQueuedErrorComponentsFromStateVariables(): Promise<any> {
        return this.componentBuilder.addQueuedErrorComponentsFromStateVariables();
    }

    async updateRendererInstructions(args: any): Promise<any> {
        return this.rendererInstructionBuilder.updateRendererInstructions(args);
    }

    async initializeRenderedComponentInstruction(
        component: any,
        componentsWithChangedChildrenToRenderInProgress: any,
    ): Promise<any> {
        return this.rendererInstructionBuilder.initializeRenderedComponentInstruction(
            component,
            componentsWithChangedChildrenToRenderInProgress,
        );
    }

    getRendererId(component: any): any {
        return this.rendererInstructionBuilder.getRendererId(component);
    }

    deleteFromComponentsToRender(args: any): any {
        return this.rendererInstructionBuilder.deleteFromComponentsToRender(
            args,
        );
    }

    // → actionTriggerScheduler
    get stateVariableChangeTriggers(): any {
        return this.actionTriggerScheduler.stateVariableChangeTriggers;
    }

    get actionsChangedToActions(): any {
        return this.actionTriggerScheduler.actionsChangedToActions;
    }

    get originsOfActionsChangedToActions(): any {
        return this.actionTriggerScheduler.originsOfActionsChangedToActions;
    }

    async processStateVariableTriggers(
        updateRenderersIfTriggered: boolean = false,
    ): Promise<any> {
        return this.actionTriggerScheduler.processStateVariableTriggers(
            updateRenderersIfTriggered,
        );
    }

    recordStateVariablesMustEvaluate(componentIdx: ComponentIdx): any {
        return this.actionTriggerScheduler.recordStateVariablesMustEvaluate(
            componentIdx,
        );
    }

    async checkForActionChaining(args: any): Promise<any> {
        return this.actionTriggerScheduler.checkForActionChaining(args);
    }

    // → compositeExpander
    async expandAllComposites(
        component: any,
        force: boolean = false,
    ): Promise<any> {
        return this.compositeExpander.expandAllComposites(component, force);
    }

    async expandCompositesOfDescendants(
        component: any,
        force: boolean = false,
    ): Promise<any> {
        return this.compositeExpander.expandCompositesOfDescendants(
            component,
            force,
        );
    }

    async componentAndRenderedDescendants(component: any): Promise<any> {
        return this.compositeExpander.componentAndRenderedDescendants(
            component,
        );
    }

    async expandCompositeOfDefiningChildren(
        parent: any,
        children: any,
        expandComposites: any,
        forceExpandComposites: any,
    ): Promise<any> {
        return this.compositeExpander.expandCompositeOfDefiningChildren(
            parent,
            children,
            expandComposites,
            forceExpandComposites,
        );
    }

    async expandCompositeComponent(component: any): Promise<any> {
        return this.compositeExpander.expandCompositeComponent(component);
    }

    adjustForCreateComponentIdxName(
        serializedReplacements: any,
        composite: any,
    ): any {
        return this.compositeExpander.adjustForCreateComponentIdxName(
            serializedReplacements,
            composite,
        );
    }

    async createAndSetReplacements(args: any): Promise<any> {
        return this.compositeExpander.createAndSetReplacements(args);
    }

    async replaceCompositeChildren(parent: any): Promise<any> {
        return this.compositeExpander.replaceCompositeChildren(parent);
    }

    async changeInactiveComponentAndDescendants(
        component: any,
        inactive: any,
    ): Promise<any> {
        return this.compositeExpander.changeInactiveComponentAndDescendants(
            component,
            inactive,
        );
    }

    // → childMatcher
    async deriveChildResultsFromDefiningChildren(args: any): Promise<any> {
        return this.childMatcher.deriveChildResultsFromDefiningChildren(args);
    }

    async matchChildrenToChildGroups(parent: any): Promise<any> {
        return this.childMatcher.matchChildrenToChildGroups(parent);
    }

    findChildGroup(childType: any, parentClass: any): any {
        return this.childMatcher.findChildGroup(childType, parentClass);
    }

    async returnActiveChildrenIndicesToRender(component: any): Promise<any> {
        return this.childMatcher.returnActiveChildrenIndicesToRender(component);
    }

    async substituteAdapter(args: any): Promise<any> {
        return this.childMatcher.substituteAdapter(args);
    }

    // → resolverAdapter
    async addReplacementsToResolver(args: any): Promise<any> {
        return this.resolverAdapter.addReplacementsToResolver(args);
    }

    async determineParentAndIndexResolutionForResolver(
        args: any,
    ): Promise<any> {
        return this.resolverAdapter.determineParentAndIndexResolutionForResolver(
            args,
        );
    }

    addComponentsToResolver(components: any, parentIdx: any): any {
        return this.resolverAdapter.addComponentsToResolver(
            components,
            parentIdx,
        );
    }

    gatherDiagnosticsAndAssignDoenetMLRange(args: any): any {
        return this.resolverAdapter.gatherDiagnosticsAndAssignDoenetMLRange(
            args,
        );
    }

    async createStateVariableDefinitions(args: any): Promise<any> {
        return this.stateVariableDefinitionFactory.createStateVariableDefinitions(
            args,
        );
    }

    createAttributeStateVariableDefinitions(args: any): any {
        return this.stateVariableDefinitionFactory.createAttributeStateVariableDefinitions(
            args,
        );
    }

    createAdapterStateVariableDefinitions(args: any): any {
        return this.stateVariableDefinitionFactory.createAdapterStateVariableDefinitions(
            args,
        );
    }

    async createReferenceShadowStateVariableDefinitions(
        args: any,
    ): Promise<any> {
        return this.stateVariableDefinitionFactory.createReferenceShadowStateVariableDefinitions(
            args,
        );
    }

    // → stateVariableInitializer
    async initializeComponentStateVariables(component: any): Promise<any> {
        return this.stateVariableInitializer.initializeComponentStateVariables(
            component,
        );
    }

    async initializeStateVariable(args: any): Promise<any> {
        return this.stateVariableInitializer.initializeStateVariable(args);
    }

    async initializeArrayEntryStateVariable(args: any): Promise<any> {
        return this.stateVariableInitializer.initializeArrayEntryStateVariable(
            args,
        );
    }

    async initializeArrayStateVariable(args: any): Promise<any> {
        return this.stateVariableInitializer.initializeArrayStateVariable(args);
    }

    async createArraySizeStateVariable(args: any): Promise<any> {
        return this.stateVariableInitializer.createArraySizeStateVariable(args);
    }

    async arrayEntryNamesFromPropIndex(args: any): Promise<any> {
        return this.stateVariableInitializer.arrayEntryNamesFromPropIndex(args);
    }

    recursivelyReplaceCompositesWithReplacements(args: any): any {
        return this.stateVariableInitializer.recursivelyReplaceCompositesWithReplacements(
            args,
        );
    }

    // → stateVariableEvaluator
    async getStateVariableValue(args: any): Promise<any> {
        return this.stateVariableEvaluator.getStateVariableValue(args);
    }

    async getStateVariableDefinitionArguments(args: any): Promise<any> {
        return this.stateVariableEvaluator.getStateVariableDefinitionArguments(
            args,
        );
    }

    async recordActualChangeInStateVariable(args: any): Promise<any> {
        return this.stateVariableEvaluator.recordActualChangeInStateVariable(
            args,
        );
    }

    findCaseInsensitiveMatches({
        stateVariables,
        componentClass,
    }: {
        stateVariables: any;
        componentClass: any;
    }): any {
        return nameResolver.findCaseInsensitiveMatches({
            stateVariables,
            componentClass,
            componentInfoObjects: this.componentInfoObjects,
        });
    }

    matchPublicStateVariables({
        stateVariables,
        componentClass,
    }: {
        stateVariables: any;
        componentClass: any;
    }): any {
        return nameResolver.matchPublicStateVariables({
            stateVariables,
            componentClass,
            componentInfoObjects: this.componentInfoObjects,
        });
    }

    substituteAliases({
        stateVariables,
        componentClass,
    }: {
        stateVariables: any;
        componentClass: any;
    }): any {
        return nameResolver.substituteAliases({
            stateVariables,
            componentClass,
            componentInfoObjects: this.componentInfoObjects,
        });
    }

    publicCaseInsensitiveAliasSubstitutions({
        stateVariables,
        componentClass,
    }: {
        stateVariables: any;
        componentClass: any;
    }): any {
        return nameResolver.publicCaseInsensitiveAliasSubstitutions({
            stateVariables,
            componentClass,
            componentInfoObjects: this.componentInfoObjects,
        });
    }

    checkIfArrayEntry({
        stateVariable,
        component,
    }: {
        stateVariable: any;
        component: any;
    }): any {
        return nameResolver.checkIfArrayEntry({ stateVariable, component });
    }

    // → stalenessPropagator
    async createFromArrayEntry(args: any): Promise<any> {
        return this.stalenessPropagator.createFromArrayEntry(args);
    }

    async markDescendantsToUpdateRenderers(component: any): Promise<any> {
        return this.stalenessPropagator.markDescendantsToUpdateRenderers(
            component,
        );
    }

    async markStateVariableAndUpstreamDependentsStale(args: any): Promise<any> {
        return this.stalenessPropagator.markStateVariableAndUpstreamDependentsStale(
            args,
        );
    }

    async lookUpCurrentFreshness(args: any): Promise<any> {
        return this.stalenessPropagator.lookUpCurrentFreshness(args);
    }

    async processMarkStale(args: any): Promise<any> {
        return this.stalenessPropagator.processMarkStale(args);
    }

    async markUpstreamDependentsStale(args: any): Promise<any> {
        return this.stalenessPropagator.markUpstreamDependentsStale(args);
    }

    // → componentLifecycle
    registerComponent(component: any): any {
        return this.componentLifecycle.registerComponent(component);
    }

    deregisterComponent(component: any, recursive: boolean = true): any {
        return this.componentLifecycle.deregisterComponent(
            component,
            recursive,
        );
    }

    setAncestors(component: any, ancestors: any[] = []): any {
        return this.componentLifecycle.setAncestors(component, ancestors);
    }

    async addChildrenAndRecurseToShadows(args: any): Promise<any> {
        return this.componentLifecycle.addChildrenAndRecurseToShadows(args);
    }

    /**
     * Create and insert `_error` siblings requested by state-variable definitions
     * during initial document construction.
     */
    async processNewDefiningChildren(args: any): Promise<any> {
        return this.componentLifecycle.processNewDefiningChildren(args);
    }

    spliceChildren(
        parent: any,
        indexOfDefiningChildren: any,
        newChildren: any,
    ): any {
        return this.componentLifecycle.spliceChildren(
            parent,
            indexOfDefiningChildren,
            newChildren,
        );
    }

    // → deletionEngine
    async deleteComponents(args: any): Promise<any> {
        return this.deletionEngine.deleteComponents(args);
    }

    removeComponentsFromResolver(componentsToRemove: any): any {
        return this.resolverAdapter.removeComponentsFromResolver(
            componentsToRemove,
        );
    }

    determineComponentsToDelete(args: any): any {
        return this.deletionEngine.determineComponentsToDelete(args);
    }

    // → compositeReplacementUpdater

    async updateCompositeReplacements(args: any): Promise<any> {
        return this.compositeReplacementUpdater.updateCompositeReplacements(
            args,
        );
    }

    async setErrorReplacements(args: any): Promise<any> {
        return this.compositeReplacementUpdater.setErrorReplacements(args);
    }

    async deleteReplacementsFromShadowsThenComposite(args: any): Promise<any> {
        return this.compositeReplacementUpdater.deleteReplacementsFromShadowsThenComposite(
            args,
        );
    }

    async createShadowedReplacements(args: any): Promise<any> {
        return this.compositeReplacementUpdater.createShadowedReplacements(
            args,
        );
    }

    async adjustReplacementsToWithhold(args: any): Promise<any> {
        return this.compositeReplacementUpdater.adjustReplacementsToWithhold(
            args,
        );
    }

    get rendererTypesInDocument(): any {
        return this.document.allPotentialRendererTypes;
    }

    get components(): any[] {
        return this._components;
    }

    set components(_value: any[]) {
        // Read-only — `_components` is the canonical owner.
    }

    // → processQueueManager
    //
    // The accessor pair below is preserved because `VisibilityTracker.ts`
    // pushes onto `core.processQueue` directly (the underlying array). A
    // future refactor could replace that push with a method on
    // `ProcessQueue`, drop these accessors, and rename
    // `processQueueManager` → `processQueue` (deferred §"`processQueue`
    // field naming").

    get processQueue(): any[] {
        return this.processQueueManager.queue;
    }

    set processQueue(value: any[]) {
        this.processQueueManager.queue = value;
    }

    get processing(): boolean {
        return this.processQueueManager.processing;
    }

    set processing(value: boolean) {
        this.processQueueManager.processing = value;
    }

    get stopProcessingRequests(): boolean {
        return this.processQueueManager.stopProcessingRequests;
    }

    set stopProcessingRequests(value: boolean) {
        this.processQueueManager.stopProcessingRequests = value;
    }

    async executeProcesses(): Promise<any> {
        return this.processQueueManager.executeProcesses();
    }

    requestAction(args: any): any {
        return this.processQueueManager.requestAction(args);
    }

    // → updateExecutor

    async performAction(args: any): Promise<any> {
        return this.updateExecutor.performAction(args);
    }

    async performUpdate(args: any): Promise<any> {
        return this.updateExecutor.performUpdate(args);
    }

    // → actionTriggerScheduler (cont.)

    async triggerChainedActions(args: any): Promise<any> {
        return this.actionTriggerScheduler.triggerChainedActions(args);
    }

    // → processQueueManager (cont.)

    async requestUpdate(args: any): Promise<any> {
        return this.processQueueManager.requestUpdate(args);
    }

    requestRecordEvent(event: any): any {
        return this.processQueueManager.requestRecordEvent(event);
    }

    // → rendererInstructionBuilder (cont.) — `updateRenderers` is the
    // public entry point that wraps `updateAllChangedRenderers`.

    async updateRenderers({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }: {
        actionId?: string;
        sourceInformation?: any;
        skipRendererUpdate?: boolean;
    }): Promise<void> {
        if (!skipRendererUpdate) {
            await this.updateAllChangedRenderers(sourceInformation, actionId);
        }
    }

    async updateAllChangedRenderers(
        sourceInformation: any = {},
        actionId?: string,
    ): Promise<any> {
        return this.rendererInstructionBuilder.updateAllChangedRenderers(
            sourceInformation,
            actionId,
        );
    }

    // Event emission — assembles the event payload and dispatches it
    // through the host-provided `sendEvent`.

    async performRecordEvent({ event }: { event: any }): Promise<void> {
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
            variantIndex: this.requestedVariant!.index,
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

    get visibilityInfo(): any {
        return this.visibilityTracker.info;
    }

    processVisibilityChangedEvent(event: any): any {
        return this.visibilityTracker.processVisibilityChangedEvent(event);
    }

    sendVisibilityChangedEvents(): any {
        return this.visibilityTracker.sendVisibilityChangedEvents();
    }

    async suspendVisibilityMeasuring(): Promise<any> {
        return this.visibilityTracker.suspendVisibilityMeasuring();
    }

    resumeVisibilityMeasuring(): any {
        return this.visibilityTracker.resumeVisibilityMeasuring();
    }

    async saveImmediately(): Promise<any> {
        return this.statePersistence.saveImmediately();
    }

    async saveState(
        overrideThrottle: boolean = false,
        onSubmission: boolean = false,
    ): Promise<any> {
        return this.statePersistence.saveState(overrideThrottle, onSubmission);
    }

    async saveChangesToDatabase(overrideThrottle: boolean): Promise<any> {
        return this.statePersistence.saveChangesToDatabase(overrideThrottle);
    }

    // → essentialValueWriter

    async executeUpdateStateVariables(
        newStateVariableValues: any,
    ): Promise<any> {
        return this.essentialValueWriter.executeUpdateStateVariables(
            newStateVariableValues,
        );
    }

    async replacementChangesFromCompositesToUpdate(): Promise<any> {
        return this.essentialValueWriter.replacementChangesFromCompositesToUpdate();
    }

    async processNewStateVariableValues(
        newStateVariableValues: any,
        newComponent: boolean = false,
    ): Promise<any> {
        return this.essentialValueWriter.processNewStateVariableValues(
            newStateVariableValues,
            newComponent,
        );
    }

    async requestComponentChanges(args: any): Promise<any> {
        return this.essentialValueWriter.requestComponentChanges(args);
    }

    /**
     * Poll `requestSolutionViewCallback` to determine whether the user is
     * allowed to view the solution. Only fires when `solutionDisplayMode`
     * is set to "buttonRequirePermission".
     */
    async requestSolutionView(
        componentIdx: ComponentIdx,
    ): Promise<{ allowView: boolean }> {
        const requestResult =
            await this.requestSolutionViewCallback(componentIdx);

        return {
            allowView: requestResult.allowView,
        };
    }

    get scoredComponentWeights(): Promise<any[]> {
        return (async () =>
            (await this.document.stateValues.scoredDescendants).map(
                (x: any) => x.stateValues.weight,
            ))();
    }

    handleVisibilityChange(documentIsVisible: boolean): void {
        if (documentIsVisible) {
            this.resumeVisibilityMeasuring();
        } else {
            this.suspendVisibilityMeasuring();
        }
    }

    // → navigationHandler
    async handleNavigatingToComponent(args: any): Promise<any> {
        return this.navigationHandler.handleNavigatingToComponent(args);
    }

    async terminate(): Promise<void> {
        let pause100 = function () {
            return new Promise<void>((resolve) => {
                setTimeout(resolve, 100);
            });
        };

        // Suspend visibility measuring so remaining times collected are saved.
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
    recordAnswerToAutoSubmit(componentIdx: ComponentIdx): void {
        this.autoSubmitManager.recordAnswer(componentIdx);
    }

    async autoSubmitAnswers(): Promise<any> {
        return this.autoSubmitManager.submitNow();
    }

    requestComponentDoenetML(
        componentIdx: ComponentIdx,
        displayOnlyChildren: boolean,
    ): string | null {
        let component = this.components[componentIdx];

        if (!component) {
            return null;
        }

        let position = component.position;

        if (!position) {
            return null;
        }
        let sourceDoc = component.sourceDoc ?? 0;

        let startInd: number, endInd: number;

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
            // Remove any leading linebreak or trailing linebreak
            // (possibly followed by spaces or tabs) to drop the
            // gutter spacing introduced by the enclosing parent tags.
            if (componentDoenetML[0] === "\n") {
                componentDoenetML = componentDoenetML.slice(1);
            }
            componentDoenetML = componentDoenetML.replace(
                /\n[ \t]*$(?!\n)/,
                "",
            );
        }

        let lines = componentDoenetML.split("\n");

        // Min number of leading spaces (ignore the first line and
        // any all-whitespace lines).
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

        // Check the first line if no number of spaces was found in the rest.
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

    navigateToTarget(args: any): any {
        return this.navigationHandler.navigateToTarget(args);
    }
}
