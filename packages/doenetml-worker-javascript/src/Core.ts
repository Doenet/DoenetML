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
import {
    getSourceLocationForComponent,
    narrowPositionToOpeningTag,
} from "./utils/sourceLocation";
import type { ComponentInstance } from "./types/componentInstance";
import { DependencyHandler } from "./core/dependencies";
import { ActionTriggerScheduler } from "./core/ActionTriggerScheduler";
import { AutoSubmitManager } from "./core/AutoSubmitManager";
import { addComponents } from "./core/ComponentBuilder";
import { CompositeReplacementUpdater } from "./core/CompositeReplacementUpdater";
import { DiagnosticsManager } from "./core/DiagnosticsManager";
import { EssentialValueWriter } from "./core/EssentialValueWriter";
import { navigateToTarget } from "./core/NavigationHandler";
import { ProcessQueue } from "./core/ProcessQueue";
import { RendererInstructionBuilder } from "./core/RendererInstructionBuilder";
import { StalenessPropagator } from "./core/StalenessPropagator";
import { StatePersistence } from "./core/StatePersistence";
import { StateVariableEvaluator } from "./core/StateVariableEvaluator";
import { UpdateExecutor } from "./core/UpdateExecutor";
import { VisibilityTracker } from "./core/VisibilityTracker";
import * as nameResolver from "./StateVariableNameResolver";
import { numberAnswers } from "./utils/answer";

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
    calculateRootNames?: () => { names: Record<ComponentIdx, any> };
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

/**
 * Component lookup conventions:
 * - String → componentClass: `this.componentInfoObjects.allComponentClasses["string"]`.
 * - componentClass → string: `componentClass.componentType`.
 *
 * Nearly all of Core's prior responsibilities have been extracted into their
 * own modules. Some are class instances held on Core (DiagnosticsManager,
 * VisibilityTracker, StatePersistence, AutoSubmitManager,
 * RendererInstructionBuilder, ProcessQueue, ActionTriggerScheduler,
 * StateVariableEvaluator, StalenessPropagator, EssentialValueWriter,
 * CompositeReplacementUpdater, UpdateExecutor, and the `nameResolver`
 * namespace); others (NavigationHandler, ResolverAdapter, ComponentLifecycle,
 * ChildMatcher, DeletionEngine, CompositeExpander, ComponentBuilder,
 * StateVariableInitializer, StateVariableDefinitionFactory) are plain
 * module-level functions imported directly by callers. Each delegating
 * block still held on Core is grouped near its original location and tagged
 * with a `// → managerName` marker; see the corresponding module for details.
 */
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
    calculateRootNames?: () => { names: Record<ComponentIdx, any> };
    rootNames: Record<ComponentIdx, any> | undefined;

    // ─── Host callbacks ───────────────────────────────────────────────────
    updateRenderersCallback: (...args: any[]) => any;
    reportScoreAndStateCallback: (...args: any[]) => any;
    requestAnimationFrame: (...args: any[]) => any;
    cancelAnimationFrame: (...args: any[]) => any;
    copyToClipboard: (...args: any[]) => any;
    sendEvent: (payload: any) => any;
    requestSolutionViewCallback: (componentIdx: ComponentIdx) => Promise<any>;

    // ─── Bound entry points ───────────────────────────────────────────────
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
    /** Sparse array of components keyed by `componentIdx`. May contain
     * undefined slots from sparse-array bookkeeping (`_components[i] =
     * undefined` is used to extend the array; reads on those slots return
     * undefined). Typed as `any[]` because the strict
     * `(ComponentInstance | undefined)[]` shape would force null-checking
     * at hundreds of read sites — that wider tightening waits until the
     * component-class refactor lands. */
    _components!: any[];
    document!: ComponentInstance;
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
    rendererInstructionBuilder: RendererInstructionBuilder;
    processQueue: ProcessQueue;
    actionTriggerScheduler: ActionTriggerScheduler;
    stateVariableEvaluator: StateVariableEvaluator;
    stalenessPropagator: StalenessPropagator;
    essentialValueWriter: EssentialValueWriter;
    compositeReplacementUpdater: CompositeReplacementUpdater;
    updateExecutor: UpdateExecutor;
    statePersistence: StatePersistence;

    // ─── Utility services (still untyped JS) ──────────────────────────────
    numerics: any;
    parameterStack: ParameterStack;

    // ─── Dependencies ────────────────────────────────────────────────────
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
            preliminaryDiagnostics,
        });

        this.numerics = new (Numerics as any)();
        this.flags = flags;
        this.theme = theme;

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
            navigateToTarget: (args: any) =>
                navigateToTarget({ core: this, args }),
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
        this.rendererInstructionBuilder = new RendererInstructionBuilder({
            core: this,
        });
        this.processQueue = new ProcessQueue({ core: this });
        this.actionTriggerScheduler = new ActionTriggerScheduler({
            core: this,
        });
        this.stateVariableEvaluator = new StateVariableEvaluator({
            core: this,
        });
        this.stalenessPropagator = new StalenessPropagator({ core: this });
        this.essentialValueWriter = new EssentialValueWriter({ core: this });
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

        // Reset the process queue (see ProcessQueue.ts) so a previous
        // run does not leak into this document.
        this.processQueue.reset();

        this.dependencies = new DependencyHandler({
            _components: this._components,
            componentInfoObjects: this.componentInfoObjects,
            core: this,
        });

        this.unmatchedChildren = {};

        // No `infoDiagnostics` buffer: info diagnostics were already emitted
        // and pushed into `preliminaryDiagnostics` during the earlier
        // `returnAllPossibleVariants` call in `CoreWorker.initializeWorker`.
        // Passing one here would duplicate those records.
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

        await addComponents({
            core: this,
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
                await this.document.sharedParameters!.allPossibleVariants,
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
        if (diagnostic?.type === "accessibility" && diagnostic.position) {
            const sourceDoc = diagnostic.sourceDoc ?? 0;
            const source = this.allDoenetMLs?.[sourceDoc];
            const narrowed = narrowPositionToOpeningTag(
                diagnostic.position,
                source,
            );
            if (narrowed !== diagnostic.position) {
                diagnostic = { ...diagnostic, position: narrowed };
            }
        }
        return this.diagnosticsManager.addDiagnostic(diagnostic);
    }

    getSourceLocationForComponent(component: ComponentInstance): {
        position: any;
        sourceDoc: number | undefined;
    } {
        return getSourceLocationForComponent(component, this._components);
    }

    async updateRendererInstructions(args: any): Promise<any> {
        return this.rendererInstructionBuilder.updateRendererInstructions(args);
    }

    async initializeRenderedComponentInstruction(
        component: any,
        componentsWithChangedChildrenToRenderInProgress?: Set<number>,
    ): Promise<any> {
        return this.rendererInstructionBuilder.initializeRenderedComponentInstruction(
            component,
            componentsWithChangedChildrenToRenderInProgress,
        );
    }

    getRendererId(component: ComponentInstance): any {
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

    async markDescendantsToUpdateRenderers(
        component: ComponentInstance,
    ): Promise<any> {
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

    // → processQueue

    requestAction(args: any): any {
        return this.processQueue.requestAction(args);
    }

    async requestUpdate(args: any): Promise<any> {
        return this.processQueue.requestUpdate(args);
    }

    requestRecordEvent(event: any): any {
        return this.processQueue.requestRecordEvent(event);
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

    async terminate(): Promise<void> {
        let pause100 = function () {
            return new Promise<void>((resolve) => {
                setTimeout(resolve, 100);
            });
        };

        // Suspend visibility measuring so remaining times collected are saved.
        await this.suspendVisibilityMeasuring();

        await this.autoSubmitManager.flush();

        this.processQueue.stopProcessingRequests = true;

        if (this.processQueue.processing) {
            for (let i = 0; i < 10; i++) {
                await pause100();
                if (!this.processQueue.processing) {
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
}
