import type Core from "../Core";
import {
    deriveChildResultsFromDefiningChildren,
    returnActiveChildrenIndicesToRender,
} from "./ChildMatcher";
import { removeFunctionsMathExpressionClass } from "../utils/math";

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

    constructor({ core }: { core: Core }) {
        this.core = core;
        this.componentsToRender = {};
        this.componentsWithChangedChildrenToRender = new Set();
        this.rendererState = {};
    }

    /**
     * Clear all per-document renderer state. Called from `Core.generateDast`
     * so that state from any previous run does not leak into a fresh document.
     */
    reset(): void {
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

        this.core.updateRenderersCallback({ ...args, init, diagnostics });
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
    }: {
        componentNamesToUpdate: number[];
        sourceOfUpdate?: any;
        actionId?: string;
    }): Promise<void> {
        let deletedRenderers: any[] = [];

        let updateInstructions: any[] = [];
        let rendererStatesToUpdate: any[] = [];

        let newChildrenInstructions: Record<number, any[]> = {};

        // copy components with changed children and reset for next time
        let componentsWithChangedChildrenToRenderInProgress =
            this.componentsWithChangedChildrenToRender;
        this.componentsWithChangedChildrenToRender = new Set();

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

                    let renderedInd = 0;
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
                                renderedInd++;
                            } else if (typeof child === "string") {
                                currentChildIdentifiers.push(
                                    `string${renderedInd}:${child}`,
                                );
                                renderedInd++;
                            } else if (typeof child === "number") {
                                currentChildIdentifiers.push(
                                    `number${renderedInd}:${(
                                        child as number
                                    ).toString()}`,
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

        this.callUpdateRenderers({ updateInstructions, actionId });
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
}
