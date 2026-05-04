/**
 * Hand-written declaration of the public surface of `Dependencies.js` that
 * `Core` and the extracted managers consume. The implementation is still
 * JavaScript and 10k+ lines; converting it is a separate multi-PR effort
 * (see `CORE_REFACTOR_DEFERRED.md`). This shim captures the shape used at
 * the boundary so callers can type-check without that conversion.
 *
 * Update this file when callers begin reading a new property/method on
 * `core.dependencies`.
 */

import type { ComponentIdx } from "@doenet/utils";

/**
 * The 9 trigger tables that `Dependencies` exposes for cross-component
 * change propagation. Each is an index over component identifiers or names
 * pointing at the dependent dependency records; the records themselves are
 * still loosely typed.
 */
export interface DependencyUpdateTriggers {
    descendantDependenciesByAncestor: Record<ComponentIdx, any>;
    ancestorDependenciesByPotentialAncestor: Record<ComponentIdx, any>;
    replacementDependenciesByComposite: Record<ComponentIdx, any>;
    childDependenciesByParent: Record<ComponentIdx, any>;
    parentDependenciesByParent: Record<ComponentIdx, any>;
    dependenciesMissingComponentBySpecifiedName: Record<string, any>;
    dependenciesBasedOnDependenciesOfStateVariables: Record<ComponentIdx, any>;
    primaryShadowDependencies: Record<ComponentIdx, any>;
    componentsReferencingAttributeByReferenced: Record<ComponentIdx, any>;
}

/**
 * Constructor argument for `DependencyHandler`. Mirrors the destructure in
 * `Dependencies.js:19`.
 */
export interface DependencyHandlerOptions {
    _components: any[];
    componentInfoObjects: any;
    core: any;
}

export declare class DependencyHandler {
    constructor(options: DependencyHandlerOptions);

    /** `upstreamDependencies[componentIdx][stateVariable]` → upstream entries. */
    upstreamDependencies: Record<ComponentIdx, Record<string, any>>;
    /** `downstreamDependencies[componentIdx][stateVariable]` → downstream entries. */
    downstreamDependencies: Record<ComponentIdx, Record<string, any>>;
    switchDependencies: Record<string, any>;

    circularCheckPassed: Record<string, boolean>;
    circularResolveBlockedCheckPassed: Record<string, boolean>;

    dependencyTypes: Record<string, any>;
    updateTriggers: DependencyUpdateTriggers;
    resolveBlockers: {
        neededToResolve: Record<string, any>;
        resolveBlockedBy: Record<string, any>;
    };
    attributeRefResolutionDependenciesByReferenced: Record<ComponentIdx, any>;

    setUpComponentDependencies(component: any): Promise<void>;

    setUpStateVariableDependencies(args: {
        component: any;
        stateVariable: string;
        allStateVariablesAffected: string[];
    }): Promise<void>;

    deleteAllDownstreamDependencies(args: {
        component: any;
        stateVariables?: string | string[];
    }): void;

    deleteAllUpstreamDependencies(args: {
        component: any;
        stateVariables?: string | string[];
        completelyDelete?: boolean;
    }): Promise<void>;

    addBlockersFromChangedActiveChildren(args: { parent: any }): Promise<void>;

    resolveBlockersFromChangedActiveChildren(
        parent: any,
        force?: boolean,
    ): Promise<void>;

    addBlockersFromChangedReplacements(composite: any): Promise<void>;

    checkForCircularDependency(args: {
        componentIdx: ComponentIdx;
        varName: string;
        previouslyVisited?: any[];
    }): void;

    checkForDependenciesOnNewComponent(
        componentIdx: ComponentIdx,
    ): Promise<{ varsChanged: Record<string, Record<string, boolean>> }>;

    getStateVariableDependencyValues(args: {
        component: any;
        stateVariable: string;
        consumeChanges?: boolean;
    }): Promise<any>;

    recordActualChangeInUpstreamDependencies(args: {
        component: any;
        varName: string;
        changes?: any;
    }): Promise<void>;

    resolveStateVariablesIfReady(args: {
        component: any;
        stateVariables?: string[];
    }): Promise<{ varsUnresolved: Record<string, any> }>;

    resolveItem(args: {
        componentIdx: ComponentIdx;
        type: string;
        stateVariable?: string;
        dependency?: string;
        force?: boolean;
        recurseUpstream?: boolean;
        expandComposites?: boolean;
        numPreviouslyNeeded?: number;
    }): Promise<{ success: boolean; [k: string]: any }>;

    getCircularDependencyMessage(componentsInvolved: any[]): string;
}
