import type Core from "../Core";
import {
    deriveChildResultsFromDefiningChildren,
    returnActiveChildrenIndicesToRender,
} from "./ChildMatcher";
import { removeFunctionsMathExpressionClass } from "../utils/math";

/**
 * How long a drag must go quiet before the deferred half of its renderer
 * fan-out is sent. Long enough to coalesce one (pointermoves arrive far more
 * often than this), short enough that a paused drag settles without feeling
 * stuck.
 */
const DEFERRED_RENDERER_UPDATE_MS = 150;

/**
 * How long after an update the idle lane starts sending offscreen renderer
 * state. Long enough for an action the viewer has already posted to reach
 * the queue first.
 */
const IDLE_RENDERER_FLUSH_MS = 10;

/**
 * Wall time one idle-lane chunk aims for, so an action that arrives while a
 * chunk runs waits no longer than about this.
 */
const IDLE_RENDERER_CHUNK_TARGET_MS = 8;

/**
 * The longest the idle lane waits for the viewer to report it has drawn a
 * chunk before sending the next anyway, so a viewer that never answers
 * cannot stall it.
 */
const RENDERER_ACK_TIMEOUT_MS = 2000;

/**
 * Builds the dast/instruction stream sent to the renderer. Owns the
 * per-component "what's currently rendered" registry, the cached
 * renderer state used for save/restore, and the queue of components
 * whose child lists have changed since the last flush.
 *
 * Holds a back-reference to Core to read the live component tree,
 * the `updateInfo.componentsToUpdateRenderers` queue, root names,
 * and to invoke `updateRenderersCallback`. Imports and calls ChildMatcher's
 * `deriveChildResultsFromDefiningChildren` and
 * `returnActiveChildrenIndicesToRender` directly, and delegates to
 * Core's `replacementChangesFromCompositesToUpdate` (slated for a later
 * phase).
 */
export class RendererInstructionBuilder {
    core: Core;
    componentsToRender: Record<number, { children: any[] }>;
    componentsWithChangedChildrenToRender: Set<number>;
    rendererState: Record<number, any>;
    /** Pending timer for `scheduleDeferredRendererUpdate`, if any. */
    _deferredRendererTimeout: ReturnType<typeof setTimeout> | null;
    /** `sourceInformation`/`actionId` the deferred flush will send with. */
    _deferredRendererArgs: { sourceInformation: any; actionId?: string };
    /** Pending timer for the next idle-lane chunk, if any. */
    _idleRendererTimeout: ReturnType<typeof setTimeout> | null;
    /**
     * How many components the next idle-lane chunk takes, adapted after each
     * chunk toward `IDLE_RENDERER_CHUNK_TARGET_MS`.
     */
    _idleRendererChunkSize: number;
    /**
     * What the viewer returned for the most recent deferred batch: a promise
     * that resolves once it has drawn the batch, or nothing.
     */
    _lastDeferredRendererAck: unknown;
    /** Whether an idle-lane chunk is waiting for the viewer to draw it. */
    _awaitingRendererAck: boolean;

    constructor({ core }: { core: Core }) {
        this.core = core;
        this.componentsToRender = {};
        this.componentsWithChangedChildrenToRender = new Set();
        this.rendererState = {};
        this._deferredRendererTimeout = null;
        this._deferredRendererArgs = { sourceInformation: {} };
        this._idleRendererTimeout = null;
        this._idleRendererChunkSize = 16;
        this._lastDeferredRendererAck = undefined;
        this._awaitingRendererAck = false;
    }

    /**
     * Clear all per-document renderer state. Called from `Core.generateDast`
     * so that state from any previous run does not leak into a fresh document.
     */
    reset(): void {
        this.cancelDeferredRendererUpdate();
        this.cancelIdleRendererFlush();
        this.componentsToRender = {};
        this.componentsWithChangedChildrenToRender = new Set();
        this.rendererState = {};
    }

    /**
     * Forward an update batch to the renderer, attaching the current
     * diagnostics queue (which both passes the data and clears the
     * pending flag). `init: true` is used only for the very first
     * document render.
     */
    callUpdateRenderers(args: any, init = false): void {
        let diagnostics: any = undefined;
        if (this.core.hasPendingDiagnostics) {
            diagnostics = this.core.getDiagnostics().diagnostics;
        }

        const result = this.core.updateRenderersCallback({
            ...args,
            init,
            diagnostics,
        });
        if (args.deferred) {
            this._lastDeferredRendererAck = result;
        }
    }

    /**
     * Build and send the next renderer-update batch.
     *
     * Two passes:
     *  1. For every parent in `componentsWithChangedChildrenToRender`,
     *     compare the rendered-child identifier list against the previous
     *     one and, if it changed, tear down the old child renderers and
     *     re-create the new ones (which can recurse).
     *  2. For every component in `componentNamesToUpdate`, capture the
     *     current `forRenderer` state values into a `rendererStatesToUpdate`
     *     entry and append cached `childrenInstructions` if pass 1
     *     produced new ones.
     *
     * The combined batch is delivered via `callUpdateRenderers`.
     */
    async updateRendererInstructions({
        componentNamesToUpdate,
        sourceOfUpdate = {},
        actionId,
        deferred = false,
        reconcileChangedChildren = true,
    }: {
        componentNamesToUpdate: number[];
        sourceOfUpdate?: any;
        actionId?: string;
        /**
         * Mark this batch as the deferred remainder of an earlier update, so
         * the viewer does not treat its arrival as the completion of
         * `actionId` (the priority batch already did). See
         * `scheduleDeferredRendererUpdate`.
         */
        deferred?: boolean;
        /**
         * Which components whose rendered children changed to reconcile in
         * this batch. That pass appends each such component to
         * `componentNamesToUpdate` and consumes it from the pending set.
         * `true` takes all of them; a set takes only those in it, so a
         * priority batch reconciles the structure it carries and leaves the
         * rest of the update's structural churn for the batch that follows;
         * `false` takes none.
         */
        reconcileChangedChildren?: boolean | Set<number>;
    }): Promise<void> {
        let deletedRenderers: any[] = [];

        let updateInstructions: any[] = [];
        let rendererStatesToUpdate: any[] = [];

        let newChildrenInstructions: Record<number, any[]> = {};

        // copy components with changed children and reset for next time
        let componentsWithChangedChildrenToRenderInProgress: Set<number>;
        if (reconcileChangedChildren === true) {
            componentsWithChangedChildrenToRenderInProgress =
                this.componentsWithChangedChildrenToRender;
            this.componentsWithChangedChildrenToRender = new Set();
        } else if (reconcileChangedChildren) {
            componentsWithChangedChildrenToRenderInProgress = new Set();
            for (const idx of this.componentsWithChangedChildrenToRender) {
                if (reconcileChangedChildren.has(idx)) {
                    componentsWithChangedChildrenToRenderInProgress.add(idx);
                    this.componentsWithChangedChildrenToRender.delete(idx);
                }
            }
        } else {
            componentsWithChangedChildrenToRenderInProgress = new Set();
        }

        //TODO: Figure out what we need from here
        for (let componentIdx of componentsWithChangedChildrenToRenderInProgress) {
            if (componentIdx in this.componentsToRender) {
                // check to see if current children who render are
                // different from last time rendered

                let currentChildIdentifiers: string[] = [];
                let unproxiedComponent = this.core._components[componentIdx];
                let indicesToRender: number[] = [];

                if (
                    unproxiedComponent &&
                    unproxiedComponent.constructor.renderChildren
                ) {
                    if (!unproxiedComponent.matchedCompositeChildren) {
                        await deriveChildResultsFromDefiningChildren({
                            core: this.core,
                            parent: unproxiedComponent,
                            expandComposites: true,
                            forceExpandComposites: true,
                        });
                    }

                    indicesToRender = await returnActiveChildrenIndicesToRender(
                        {
                            core: this.core,
                            component: unproxiedComponent,
                        },
                    );

                    // Strings and numbers are keyed by their position among the
                    // active children, the same position they hold in the
                    // stored `children` list compared against below.
                    for (let [
                        ind,
                        child,
                    ] of unproxiedComponent.activeChildren.entries() as Iterable<
                        [number, any]
                    >) {
                        if (indicesToRender.includes(ind)) {
                            if (child.rendererType) {
                                currentChildIdentifiers.push(
                                    `nameType:${child.componentIdx};${child.componentType}`,
                                );
                            } else if (typeof child === "string") {
                                currentChildIdentifiers.push(
                                    `string${ind}:${child}`,
                                );
                            } else if (typeof child === "number") {
                                currentChildIdentifiers.push(
                                    `number${ind}:${(
                                        child as number
                                    ).toString()}`,
                                );
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

                let previousChildIdentifiers: string[] = [];
                for (let [
                    ind,
                    child,
                ] of previousChildRenderers.entries() as Iterable<
                    [number, any]
                >) {
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
                            `number${ind}:${(child as number).toString()}`,
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
                    let childrenToRender: any[] = [];
                    if (indicesToRender.length > 0) {
                        for (let [
                            ind,
                            child,
                        ] of unproxiedComponent.activeChildren.entries() as Iterable<
                            [number, any]
                        >) {
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
                                    childrenToRender.push(
                                        (child as number).toString(),
                                    );
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
                let component = this.core._components[componentIdx];
                if (component) {
                    let stateValuesForRenderer: Record<string, any> = {};
                    for (let stateVariable in component.state) {
                        if (component.state[stateVariable].forRenderer) {
                            let value = removeFunctionsMathExpressionClass(
                                await component.state[stateVariable].value,
                            );
                            stateValuesForRenderer[stateVariable] = value;
                        }
                    }

                    if (component.compositeReplacementActiveRange) {
                        stateValuesForRenderer._compositeReplacementActiveRange =
                            component.compositeReplacementActiveRange;
                    }

                    let newRendererState: any = {
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

        // A deferred batch with nothing in it has nothing to draw, and no
        // action waits on it.
        if (
            deferred &&
            updateInstructions.length === 0 &&
            !this.core.hasPendingDiagnostics
        ) {
            return;
        }

        this.callUpdateRenderers({ updateInstructions, actionId, deferred });
    }

    /**
     * Construct the initial renderer instructions for `component` and
     * its rendered descendants: collect `forRenderer` state values, build
     * the children-to-render list (recursing on rendered children), and
     * register the component in `componentsToRender`. Returns
     * `{ componentToRender, rendererStatesToUpdate, rendererStatesToForceUpdate }`
     * — the third bucket holds states marked `alwaysUpdateRenderer`,
     * which are flushed in a second pass without `init: true`.
     *
     * Returns `undefined` if `component.rendererType` is unset (callers
     * only invoke this for components that render).
     */
    async initializeRenderedComponentInstruction(
        component: any,
        componentsWithChangedChildrenToRenderInProgress: Set<number> = new Set(),
    ): Promise<any> {
        if (component.rendererType === undefined) {
            return;
        }

        if (!component.matchedCompositeChildren) {
            await deriveChildResultsFromDefiningChildren({
                core: this.core,
                parent: component,
                expandComposites: true, //forceExpandComposites: true,
            });
        }

        let rendererStatesToUpdate: any[] = [];
        let rendererStatesToForceUpdate: any[] = [];

        let stateValuesForRenderer: Record<string, any> = {};
        let stateValuesForRendererAlwaysUpdate: Record<string, any> = {};
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

        let childrenToRender: any[] = [];
        if (component.constructor.renderChildren) {
            let indicesToRender = await returnActiveChildrenIndicesToRender({
                core: this.core,
                component,
            });
            for (let [
                ind,
                child,
            ] of component.activeChildren.entries() as Iterable<
                [number, any]
            >) {
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
                        childrenToRender.push((child as number).toString());
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

        let requestActions: Record<string, any> = {};
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
            // Source range in the original DoenetML, used by hosts (e.g. the
            // VS Code preview) to sync cursor/click position with the
            // editor. Absent for components with no direct source origin.
            // Note: a copy's replacement gets the copy reference's own range
            // (e.g. `$g`'s), while descendants that already carried a
            // position keep the original definition's range — see
            // `assignDoenetMLRange`'s `init` flag. The viewer compensates
            // when attributing clicks on copied content (`containsRange` in
            // DocViewer).
            position: component.position,
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
    getRendererId(component: any): string {
        return (
            this.core.rootNames?.[component.componentOrAdaptedIdx] ??
            `_id_${component.componentOrAdaptedIdx.toString()}`
        );
    }

    /**
     * Drop `componentIdx` (and, by default, every nested rendered child)
     * from `componentsToRender`, and clear it from the in-progress
     * change set. Returns the flat list of component indices that were
     * removed so the caller can include them in the renderer update.
     */
    deleteFromComponentsToRender({
        componentIdx,
        recurseToChildren = true,
        componentsWithChangedChildrenToRenderInProgress,
    }: {
        componentIdx: number;
        recurseToChildren?: boolean;
        componentsWithChangedChildrenToRenderInProgress: Set<number>;
    }): number[] {
        let deletedComponentNames: number[] = [componentIdx];
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

    /**
     * Drain `updateInfo.componentsToUpdateRenderers` into a renderer
     * update batch. If the first pass produced new composite replacement
     * work (which can happen when child results get derived during the
     * pass), apply those replacement changes and run a second drain so
     * the renderer sees a fully consistent tree.
     */
    async updateAllChangedRenderers(
        sourceInformation: any = {},
        actionId?: string,
    ): Promise<void> {
        // This drains everything, so any deferred remainder is covered here
        // and must not also arrive later on its own.
        this.cancelDeferredRendererUpdate();
        this.cancelIdleRendererFlush();

        let componentNamesToUpdate = [
            ...this.core.updateInfo.componentsToUpdateRenderers,
        ];
        this.core.updateInfo.componentsToUpdateRenderers.clear();

        await this.updateRendererInstructions({
            componentNamesToUpdate,
            sourceOfUpdate: { sourceInformation, local: true },
            actionId,
        });

        // TODO: should we check for child results earlier so we don't have to check them
        // when updating renderer instructions?
        if (this.core.updateInfo.compositesToUpdateReplacements.size > 0) {
            await this.core.replacementChangesFromCompositesToUpdate();

            let componentNamesToUpdate = [
                ...this.core.updateInfo.componentsToUpdateRenderers,
            ];
            this.core.updateInfo.componentsToUpdateRenderers.clear();

            await this.updateRendererInstructions({
                componentNamesToUpdate,
                sourceOfUpdate: { sourceInformation, local: true },
                actionId,
            });
        }
    }

    /**
     * Every component rendered on a graph the reader can see, together with
     * `targets` themselves: the part of a drag step's renderer fan-out that
     * goes out straight away.
     *
     * A graph counts as visible once its renderer reports it in the viewport
     * (`Graph.recordVisibilityChange`, kept in `VisibilityTracker`). The graph
     * holding a target counts regardless: the reader is dragging inside it, and
     * it may not have reported yet. Only the outermost graph matters, since a
     * graph inside a graph is already part of its subtree.
     *
     * The unit is the graph because it is where a drag's consequences are
     * drawn. Other components that draw their own coordinate space, such as a
     * `<subsetOfRealsInput>`, are themselves the target of their drags.
     */
    componentsOnVisibleGraphs(targets: number[]): Set<number> {
        const isGraph = (componentType: string) =>
            this.core.componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: componentType,
                baseComponentType: "graph",
            });

        const graphs = new Set<number>();

        for (const idxStr in this.core.visibilityInfo
            .componentsCurrentlyVisible) {
            const idx = Number(idxStr);
            const component = this.core._components[idx];
            if (
                component &&
                idx in this.componentsToRender &&
                isGraph(component.componentType)
            ) {
                graphs.add(idx);
            }
        }

        for (const idx of targets) {
            let outermostGraph: number | undefined;
            for (const ancestor of this.core._components[idx]?.ancestors ??
                []) {
                if (
                    ancestor.componentIdx in this.componentsToRender &&
                    isGraph(ancestor.componentClass.componentType)
                ) {
                    outermostGraph = ancestor.componentIdx;
                }
            }
            if (outermostGraph !== undefined) {
                graphs.add(outermostGraph);
            }
        }

        const found = new Set<number>(targets);
        const walk = (idx: number) => {
            found.add(idx);
            for (const child of this.componentsToRender[idx]?.children ?? []) {
                if (child?.componentIdx != undefined) {
                    walk(child.componentIdx);
                }
            }
        };
        for (const graphIdx of graphs) {
            walk(graphIdx);
        }

        return found;
    }

    /**
     * Send just `componentIndices`' renderer state, ahead of everything else
     * an update has queued.
     *
     * A drag step invalidates far more than what the reader is watching: on a
     * 50-point dot plot whose points are stacked by `<indexOf>`/`<searchSorted>`
     * and tallied into a `<tabular>`, one `movePoint` queues ~133 rendered
     * components, 80 of them in the table. Because the viewer treats the
     * arrival of a renderer batch as the completion of the action
     * (`DocViewer.resolveAction`), sending the graph first both puts it on
     * screen immediately and releases the next drag, while the table follows
     * once the drag settles.
     *
     * Components are *removed* from the pending set as they are sent, so the
     * later flush does not send them twice; filtering on `delete` keeps a
     * component that is not currently queued out of the batch. A change to
     * which children render under one of `componentIndices` is reconciled
     * here too, and sends that component along with its new children, so a
     * drag that adds or removes components on the graph lands with it.
     */
    async updateRenderersForComponents(
        componentIndices: Iterable<number>,
        sourceInformation: any = {},
        actionId?: string,
        { deferred = false }: { deferred?: boolean } = {},
    ): Promise<void> {
        const candidates = new Set(componentIndices);

        const sendCandidates = async () => {
            const componentNamesToUpdate = [...candidates].filter((idx) =>
                this.core.updateInfo.componentsToUpdateRenderers.delete(idx),
            );
            const hasStructuralChange = [
                ...this.componentsWithChangedChildrenToRender,
            ].some((idx) => candidates.has(idx));

            if (componentNamesToUpdate.length === 0 && !hasStructuralChange) {
                return;
            }

            await this.updateRendererInstructions({
                componentNamesToUpdate,
                sourceOfUpdate: { sourceInformation, local: true },
                actionId,
                deferred,
                reconcileChangedChildren: candidates,
            });
        };

        await sendCandidates();

        // Reconciling children can derive child results and queue composite
        // replacement work, as in `updateAllChangedRenderers`. Apply it and
        // send whatever it changed among the candidates.
        if (this.core.updateInfo.compositesToUpdateReplacements.size > 0) {
            await this.core.replacementChangesFromCompositesToUpdate();
            await sendCandidates();
        }
    }

    /**
     * Whether `componentIdx` is on or near the reader's screen.
     *
     * Decided by the nearest component, itself or an ancestor, whose renderer
     * has reported whether it is near the viewport
     * (`VisibilityTracker.renderVisibility`). Only block-level renderers
     * report, so inline content takes the state of the block around it. A
     * component with no reporting ancestor counts as on screen, which covers
     * a document with no viewer attached and a block too new to have
     * reported.
     *
     * `memo` carries answers across calls for one classification pass.
     */
    isOnScreen(componentIdx: number, memo: Map<number, boolean>): boolean {
        const known = this.core.visibilityTracker.renderVisibility;
        if (known.size === 0) {
            return true;
        }

        const component = this.core._components[componentIdx];
        const chain = [
            componentIdx,
            ...(component?.ancestors ?? []).map(
                (ancestor: any) => ancestor.componentIdx as number,
            ),
        ];

        let result = true;
        const visited: number[] = [];
        for (const idx of chain) {
            const memoized = memo.get(idx);
            if (memoized !== undefined) {
                result = memoized;
                break;
            }
            visited.push(idx);
            const reported = known.get(idx);
            if (reported !== undefined) {
                result = reported;
                break;
            }
        }

        for (const idx of visited) {
            memo.set(idx, result);
        }
        return result;
    }

    /**
     * Split everything waiting to be sent to the renderer, both components
     * with pending state and components whose rendered children changed,
     * by `isOnScreen`.
     */
    classifyPendingRenderers(): {
        onScreen: Set<number>;
        offScreen: Set<number>;
    } {
        const memo = new Map<number, boolean>();
        const onScreen = new Set<number>();
        const offScreen = new Set<number>();

        for (const pending of [
            this.componentsWithChangedChildrenToRender,
            this.core.updateInfo.componentsToUpdateRenderers,
        ]) {
            for (const idx of pending) {
                if (this.isOnScreen(idx, memo)) {
                    onScreen.add(idx);
                } else {
                    offScreen.add(idx);
                }
            }
        }

        return { onScreen, offScreen };
    }

    /**
     * Send the part of an update's renderer fan-out the reader can see, and
     * leave the rest for the idle lane (`scheduleIdleRendererFlush`).
     *
     * `targets`, the components the update was addressed to, always go out
     * now, so a renderer that showed the change ahead of core hears back
     * straight away. When nothing pending is offscreen, which includes every
     * document with no viewer reporting visibility, this is
     * `updateAllChangedRenderers`.
     */
    async updateOnScreenRenderers(
        targets: number[],
        sourceInformation: any = {},
        actionId?: string,
    ): Promise<void> {
        const { onScreen, offScreen } = this.classifyPendingRenderers();

        if (offScreen.size === 0) {
            await this.updateAllChangedRenderers(sourceInformation, actionId);
            return;
        }

        // A drag that was waiting to settle has been superseded by this
        // update, which sends what is on screen now.
        this.cancelDeferredRendererUpdate();

        for (const idx of targets) {
            onScreen.add(idx);
        }

        await this.updateRenderersForComponents(
            onScreen,
            sourceInformation,
            actionId,
        );

        this.scheduleIdleRendererFlush(sourceInformation, actionId);
    }

    /**
     * Hold the rest of an update's renderer fan-out until the interaction goes
     * quiet, coalescing the intermediate states of a drag into one batch.
     * When it fires, it sends what is on screen and hands the rest to the
     * idle lane.
     *
     * The pending components stay in `updateInfo.componentsToUpdateRenderers`,
     * which is already a carry-forward set: each further step adds to it
     * rather than replacing it, so nothing is lost by waiting. Every
     * non-transient update — the drag's commit on pointer-up — cancels the
     * timer and sends what is on screen synchronously, so a drag always ends
     * with the visible part of the screen correct.
     *
     * The delay is a debounce rather than a queue-length test because core
     * never yields to the event loop during an update, so it cannot observe
     * that a newer action has arrived; and because the viewer only sends one
     * action at a time, the worker's own queue is empty between drag steps.
     */
    scheduleDeferredRendererUpdate(
        sourceInformation: any = {},
        actionId?: string,
    ): void {
        this._deferredRendererArgs = { sourceInformation, actionId };

        // The idle lane waits for the drag to settle, so it does not compete
        // with the next drag step; the flush hands off to it.
        this.cancelIdleRendererFlush();

        if (this._deferredRendererTimeout !== null) {
            clearTimeout(this._deferredRendererTimeout);
        }

        this._deferredRendererTimeout = setTimeout(() => {
            this._deferredRendererTimeout = null;
            this.flushDeferredRendererUpdate().catch((e) => console.error(e));
        }, DEFERRED_RENDERER_UPDATE_MS);
    }

    /** Drop any pending deferred flush without sending it. */
    cancelDeferredRendererUpdate(): void {
        if (this._deferredRendererTimeout !== null) {
            clearTimeout(this._deferredRendererTimeout);
            this._deferredRendererTimeout = null;
        }
    }

    /**
     * Send whatever `scheduleDeferredRendererUpdate` left pending.
     *
     * Reschedules rather than running if the queue is mid-update, since this
     * arrives on a timer and must not re-enter core between an update's phases.
     */
    async flushDeferredRendererUpdate(): Promise<void> {
        if (this.core.processQueue.stopProcessingRequests) {
            return;
        }

        if (this.core.processQueue.processing) {
            this.scheduleDeferredRendererUpdate(
                this._deferredRendererArgs.sourceInformation,
                this._deferredRendererArgs.actionId,
            );
            return;
        }

        const { sourceInformation, actionId } = this._deferredRendererArgs;

        await this.updateRenderersForComponents(
            this.classifyPendingRenderers().onScreen,
            sourceInformation,
            actionId,
            { deferred: true },
        );

        this.scheduleIdleRendererFlush(sourceInformation, actionId);
    }

    /**
     * Start the idle lane: send renderer state the reader can't see, a chunk
     * at a time, whenever core has nothing else to do.
     *
     * The pending components stay in the same carry-forward sets the other
     * batches draw from, so an update that lands in between simply adds to
     * them, and anything it scrolls into view goes out with it. Each chunk
     * re-sorts what is left so components that came into view since the last
     * chunk go first.
     *
     * Workers have no `requestIdleCallback`, so "idle" means the queue is
     * empty when a chunk's timer fires and no drag is waiting to settle.
     * Chunks are sized toward `IDLE_RENDERER_CHUNK_TARGET_MS`, which bounds
     * how long an arriving action waits behind one.
     *
     * Drawing a chunk can cost the viewer far more than computing it costs
     * core, so each chunk also waits for the viewer to report it has drawn
     * the last one (the promise `updateRenderersCallback` returns
     * for a deferred batch). Otherwise the offscreen backlog would pile up on
     * the viewer's side, and the next update's visible changes would wait
     * behind it there.
     */
    scheduleIdleRendererFlush(
        sourceInformation?: any,
        actionId?: string,
    ): void {
        if (sourceInformation !== undefined) {
            this._deferredRendererArgs = { sourceInformation, actionId };
        }

        // A chunk waiting for the viewer schedules the next one itself.
        if (
            this._idleRendererTimeout !== null ||
            this._deferredRendererTimeout !== null ||
            this._awaitingRendererAck
        ) {
            return;
        }

        this._idleRendererTimeout = setTimeout(() => {
            this._idleRendererTimeout = null;
            this.runIdleRendererChunk().catch((e) => console.error(e));
        }, IDLE_RENDERER_FLUSH_MS);
    }

    /**
     * Wait until the viewer reports it has drawn the last deferred batch, or
     * `RENDERER_ACK_TIMEOUT_MS`, whichever comes first. Returns at once if
     * the viewer returned nothing to wait on.
     */
    async waitForRendererAck(): Promise<void> {
        const ack = this._lastDeferredRendererAck;
        this._lastDeferredRendererAck = undefined;
        if (
            typeof (ack as PromiseLike<unknown> | undefined)?.then !==
            "function"
        ) {
            return;
        }

        this._awaitingRendererAck = true;
        let timeout: ReturnType<typeof setTimeout> | undefined;
        try {
            await Promise.race([
                Promise.resolve(ack).catch(() => {}),
                new Promise<void>((resolve) => {
                    timeout = setTimeout(resolve, RENDERER_ACK_TIMEOUT_MS);
                }),
            ]);
        } finally {
            clearTimeout(timeout);
            this._awaitingRendererAck = false;
        }
    }

    /** Drop the next idle-lane chunk without sending it. */
    cancelIdleRendererFlush(): void {
        if (this._idleRendererTimeout !== null) {
            clearTimeout(this._idleRendererTimeout);
            this._idleRendererTimeout = null;
        }
    }

    /** Send one idle-lane chunk and schedule the next if anything is left. */
    async runIdleRendererChunk(): Promise<void> {
        const processQueue = this.core.processQueue;
        if (processQueue.stopProcessingRequests) {
            return;
        }
        if (this._deferredRendererTimeout !== null) {
            return;
        }
        if (processQueue.processing || processQueue.queue.length > 0) {
            this.scheduleIdleRendererFlush();
            return;
        }

        const { onScreen, offScreen } = this.classifyPendingRenderers();
        const ordered = [...onScreen, ...offScreen];
        if (ordered.length === 0) {
            return;
        }

        const chunk = ordered.slice(0, this._idleRendererChunkSize);
        const { sourceInformation, actionId } = this._deferredRendererArgs;

        this._lastDeferredRendererAck = undefined;
        const start = performance.now();
        await this.updateRenderersForComponents(
            chunk,
            sourceInformation,
            actionId,
            { deferred: true },
        );
        const elapsed = performance.now() - start;

        const scale = Math.min(
            2,
            IDLE_RENDERER_CHUNK_TARGET_MS / Math.max(elapsed, 0.1),
        );
        this._idleRendererChunkSize = Math.max(
            1,
            Math.min(1000, Math.round(this._idleRendererChunkSize * scale)),
        );

        await this.waitForRendererAck();

        if (
            this.core.updateInfo.componentsToUpdateRenderers.size > 0 ||
            this.componentsWithChangedChildrenToRender.size > 0
        ) {
            this.scheduleIdleRendererFlush();
        }
    }

    /**
     * Send everything still waiting in the drag's deferred batch or the idle
     * lane, now. For callers that need `rendererState` complete, such as a
     * save that includes it. Does nothing mid-update.
     */
    async flushPendingRenderers(): Promise<void> {
        if (
            this.core.processQueue.processing ||
            this.core.processQueue.stopProcessingRequests
        ) {
            return;
        }
        if (
            this.core.updateInfo.componentsToUpdateRenderers.size === 0 &&
            this.componentsWithChangedChildrenToRender.size === 0
        ) {
            return;
        }

        this.cancelDeferredRendererUpdate();
        this.cancelIdleRendererFlush();

        const { sourceInformation, actionId } = this._deferredRendererArgs;
        const pending = this.classifyPendingRenderers();

        await this.updateRenderersForComponents(
            [...pending.onScreen, ...pending.offScreen],
            sourceInformation,
            actionId,
            { deferred: true },
        );
    }
}
