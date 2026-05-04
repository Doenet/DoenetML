/**
 * Reduced shape of a runtime component instance — the objects stored in
 * `Core._components`. The full shape comes from the dynamic component-class
 * system in `ComponentTypes.js`; this interface lists only the surface that
 * extracted managers and Core itself read in TypeScript code.
 *
 * Tightening to a fully-typed `Component` waits until the component-class
 * refactor lands. For now this catches typos on the well-known fields and
 * lets the rest stay loose.
 */

import type { ComponentIdx } from "@doenet/utils";
import type { Position } from "@doenet/utils";

/**
 * The state-variable bag stored on each component. Keys are state-variable
 * names; values are loosely typed because the shape varies per state-var
 * definition. Each `state[varName]` typically carries `value`, `isResolved`,
 * `_previousValue`, and machinery for definition / inverse-definition.
 */
export type ComponentStateBag = Record<string, any>;

/**
 * The eagerly-evaluated mirror of `state`, exposed to consumers as the
 * already-resolved state-variable values.
 */
export type ComponentStateValues = Record<string, any>;

export interface ComponentInstance {
    componentIdx: ComponentIdx;
    componentType: string;
    /** Same as `componentIdx`, except for adapted components which expose
     * the adapted index instead. */
    componentOrAdaptedIdx?: ComponentIdx;
    rendererType?: string;
    /** Set to `serializedComponent.stateId ?? componentIdx.toString()` in
     * `ComponentBuilder.createComponentClass`. Always present once the
     * component is in `Core._components`. */
    stateId: string;

    // ─── Tree pointers ────────────────────────────────────────────────────
    parent: ComponentInstance | null;
    /** Numeric parent identifier, present even when `parent` is detached. */
    parentIdx?: ComponentIdx | null;
    ancestors?: any[];
    activeChildren?: any[];
    allChildren?: Record<ComponentIdx, any>;
    definingChildren?: any[];
    serializedChildren?: any[];
    matchedCompositeChildren?: any[];

    // ─── Composite / shadow links ─────────────────────────────────────────
    replacements?: ComponentInstance[];
    replacementOf?: ComponentInstance;
    replacementsToWithhold?: number;
    replacementsWorkspace?: Record<string, any>;
    isExpanded?: boolean;
    shadows?: { compositeIdx?: ComponentIdx; [k: string]: any };
    shadowedBy?: ComponentInstance[];
    compositeReplacementActiveRange?: any[];
    unexpandedCompositesNotReady?: ComponentIdx[];

    // ─── Adapter ──────────────────────────────────────────────────────────
    adaptedFrom?: ComponentInstance;
    adapterUsed?: ComponentInstance;

    // ─── State ────────────────────────────────────────────────────────────
    state: ComponentStateBag;
    stateValues: ComponentStateValues;
    /** Initialized to `{}` in `BaseComponent` and populated as essential
     * values are set; always present on a constructed component. */
    essentialState: Record<string, any>;
    unresolvedState?: Record<string, any>;
    unresolvedDependencies?: Record<string, any>;
    stateVarAliases?: Record<string, string>;
    arrayEntryPrefixes?: Record<string, any>;
    reprocessAfterEvaluate?: any[] | null;

    // ─── Attributes / shared parameters ───────────────────────────────────
    attributes: Record<string, any>;
    doenetAttributes: Record<string, any>;
    sharedParameters?: Record<string, any>;

    // ─── Source ───────────────────────────────────────────────────────────
    position?: Position;
    sourceDoc?: number;

    // ─── Actions ──────────────────────────────────────────────────────────
    actions?: Record<string, any>;
    externalActions?: Record<string, any>;

    /** Set on the prototype by the component class; component classes attach
     * arbitrary static metadata (`canDisplayChildErrors`,
     * `useSerializedChildrenComponentIndices`, etc.) used by Core. Looser
     * than the built-in `Function` type so those reads typecheck. */
    constructor: any;

    /** Component classes attach arbitrary fields; allow them through. */
    [k: string]: any;
}
