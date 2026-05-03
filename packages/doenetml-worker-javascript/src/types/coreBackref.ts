/**
 * The slice of `Core` that the extracted manager classes read through their
 * `core` back-reference. Replaces `core: any` on each manager so typos and
 * accidental property reads through `core` get caught by the type checker.
 *
 * The union is the result of `grep -oE "this\\.core\\.[A-Za-z_][A-Za-z0-9_]*"`
 * across every `*.ts` manager file. Update this file when a manager begins
 * reading a new property on `core`.
 *
 * Many fields are still `any` because their types come from `.js` modules
 * (`Dependencies.js`, `Numerics.js`, `ParameterStack.js`, `ComponentTypes.js`)
 * or from the dynamic component-class system. Those tighten as the underlying
 * modules are converted to TypeScript.
 */

import type { DiagnosticRecord } from "@doenet/utils";
import type { DependencyHandler } from "../Dependencies";
import type { DiagnosticsManager } from "../DiagnosticsManager";
import type { StatePersistence } from "../StatePersistence";

/** Reduced shape of the resolver root-name lookup result. */
export interface RootNamesEntry {
    [k: string]: any;
}

/**
 * The full back-reference surface. Managers should depend on the narrowest
 * `Pick<CoreBackref, ...>` they actually need, but a plain `core: CoreBackref`
 * is the cheapest cleanup over `core: any` and is fine for managers whose
 * surface is wide.
 */
export interface CoreBackref {
    // ─── Identity / configuration ─────────────────────────────────────────
    coreId: string;
    documentIdx: number;
    allDoenetMLs: string[];
    flags: Record<string, any>;

    // ─── Component graph (still loosely typed; tightens with ComponentInstance) ─
    // Many of these are populated lazily inside `generateDast` and so are
    // optional in `Core` itself. They appear here as required because every
    // manager that reads them runs after `generateDast` has populated them
    // — but the optional spelling is what `Core` exposes, so mirror it.
    _components: any[];
    /** Read-only accessor returning the same array as `_components`. */
    components: any[];
    document: any;
    componentInfoObjects: any;
    parameterStack: any;
    numerics: any;
    rootNames: any;

    // ─── Sub-managers exposed for cross-manager reach-through ─────────────
    dependencies: DependencyHandler;
    diagnosticsManager: DiagnosticsManager;
    statePersistence: StatePersistence;

    // ─── Tracking state owned by Core ─────────────────────────────────────
    updateInfo: any;
    cumulativeStateVariableChanges: any;
    componentIdxByStateId: Record<string, number>;
    createComponentIdxMapping: Record<number, number>;
    essentialValuesSavedInDefinition: Record<string, any>;
    errorComponentsToAdd: any[];
    rendererVariablesByComponentType: Record<string, any>;
    componentsWithChangedChildrenToRender: Set<number>;
    /** Set by `ComponentBuilder` once the document renderer tree exists. */
    documentRendererInstructions?: any;
    /** Counter mutated by `ComponentBuilder.addComponents`. */
    nTimesAddedComponents?: number;
    /** Set by `ComponentBuilder.addComponents`. */
    initialAddPhase?: boolean;
    publicCaseInsensitiveAliasSubstitutions: (...args: any[]) => any;
    stateVariableChangeTriggers: any;
    unmatchedChildren: Record<number, any>;
    replacementChangesFromCompositesToUpdate: (...args: any[]) => Promise<any>;

    // ─── Lifecycle flags / state proxied off ProcessQueue ────────────────
    processQueue: any[];
    processing: boolean;

    // ─── Host callbacks (passed in by CoreWorker) ─────────────────────────
    // Resolver callbacks may be `undefined` until `CoreWorker.initializeWorker`
    // has been called; mirror `Core`'s spelling so `this`-passing
    // typechecks.
    coreFunctions: Record<string, any>;
    reportScoreAndStateCallback: (...args: any[]) => any;
    updateRenderersCallback: (...args: any[]) => any;
    addNodesToResolver?: (...args: any[]) => any;
    addReplacementsToResolver: (...args: any[]) => any;
    addComponentsToResolver: (...args: any[]) => any;
    deleteNodesFromResolver?: (...args: any[]) => any;
    removeComponentsFromResolver: (...args: any[]) => any;
    replaceIndexResolutionsInResolver?: (...args: any[]) => any;
    calculateRootNames?: () => { names: any };

    // ─── Diagnostics ──────────────────────────────────────────────────────
    addDiagnostic: (record: DiagnosticRecord) => void;
    getDiagnostics: () => { diagnostics: DiagnosticRecord[] };
    hasPendingDiagnostics: boolean;
    getSourceLocationForComponent: (componentIdx: number) => any;
    gatherDiagnosticsAndAssignDoenetMLRange: (...args: any[]) => any;

    // ─── Action / update entry points ─────────────────────────────────────
    requestAction: (...args: any[]) => any;
    performAction: (...args: any[]) => Promise<any>;
    performUpdate: (...args: any[]) => Promise<any>;
    performRecordEvent: (...args: any[]) => Promise<any>;
    requestRecordEvent: (...args: any[]) => any;
    requestComponentChanges: (...args: any[]) => Promise<any>;
    executeProcesses: (...args: any[]) => Promise<any>;
    executeUpdateStateVariables: (...args: any[]) => Promise<any>;
    checkForActionChaining: (...args: any[]) => any;
    recordAnswerToAutoSubmit: (...args: any[]) => any;
    processStateVariableTriggers: (...args: any[]) => Promise<any>;

    // ─── State-variable evaluation / staleness ────────────────────────────
    getStateVariableValue: (...args: any[]) => Promise<any>;
    getStateVariableDefinitionArguments: (...args: any[]) => any;
    markStateVariableAndUpstreamDependentsStale: (
        ...args: any[]
    ) => Promise<any>;
    markUpstreamDependentsStale: (...args: any[]) => Promise<any>;
    recordActualChangeInStateVariable: (...args: any[]) => Promise<any>;
    recordStateVariablesMustEvaluate: (...args: any[]) => any;
    processNewStateVariableValues: (...args: any[]) => Promise<any>;
    initializeStateVariable: (...args: any[]) => any;
    initializeComponentStateVariables: (...args: any[]) => any;
    createStateVariableDefinitions: (...args: any[]) => any;
    createFromArrayEntry: (...args: any[]) => any;
    checkIfArrayEntry: (...args: any[]) => any;
    matchPublicStateVariables: (...args: any[]) => any;
    substituteAliases: (...args: any[]) => any;

    // ─── Component lifecycle / structure ──────────────────────────────────
    addComponents: (...args: any[]) => Promise<any>;
    deleteComponents: (...args: any[]) => Promise<any>;
    createIsolatedComponents: (...args: any[]) => Promise<any>;
    registerComponent: (...args: any[]) => any;
    deregisterComponent: (...args: any[]) => any;
    componentAndRenderedDescendants: (...args: any[]) => any;
    deriveChildResultsFromDefiningChildren: (...args: any[]) => Promise<any>;
    processNewDefiningChildren: (...args: any[]) => Promise<any>;
    spliceChildren: (...args: any[]) => any;
    findChildGroup: (...args: any[]) => any;
    addChildrenAndRecurseToShadows: (...args: any[]) => Promise<any>;
    replaceCompositeChildren: (...args: any[]) => Promise<any>;
    setErrorReplacements: (...args: any[]) => any;
    adjustForCreateComponentIdxName: (...args: any[]) => any;

    // ─── Composite expansion / replacement ────────────────────────────────
    expandAllComposites: (...args: any[]) => Promise<any>;
    expandCompositeComponent: (...args: any[]) => Promise<any>;
    expandCompositeOfDefiningChildren: (...args: any[]) => Promise<any>;
    updateCompositeReplacements: (...args: any[]) => Promise<any>;
    determineParentAndIndexResolutionForResolver: (...args: any[]) => any;

    // ─── Renderer machinery ───────────────────────────────────────────────
    updateRendererInstructions: (...args: any[]) => Promise<any>;
    updateAllChangedRenderers: (...args: any[]) => any;
    callUpdateRenderers: (...args: any[]) => Promise<any>;
    initializeRenderedComponentInstruction: (...args: any[]) => any;
    returnActiveChildrenIndicesToRender: (...args: any[]) => any;

    // ─── Visibility ───────────────────────────────────────────────────────
    onDocumentFirstVisible: (...args: any[]) => any;
    processVisibilityChangedEvent: (...args: any[]) => Promise<any>;
    resumeVisibilityMeasuring: (...args: any[]) => Promise<any>;

    // ─── Lifecycle ────────────────────────────────────────────────────────
    generateDast: (...args: any[]) => Promise<any>;
    terminate: () => Promise<void>;
}
