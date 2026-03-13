/*
 * This file is for running a dev test of the codemirror component.
 * It does not show up in the bundled package.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import {
    DoenetViewer,
    DoenetEditor,
} from "@doenet/doenetml/doenetml-inline-worker.js";
import "@doenet/doenetml/style.css";
import "./pretext-compat.css";
import { ResizeWatcher } from "./resize-watcher";

// Re-export React and friends in case a user really wants to use them
export { React, ReactDOM, DoenetViewer, DoenetEditor };

export const version: string = STANDALONE_VERSION;

const viewerRoots = new WeakMap<Element, ReactDOM.Root>();

type ViewerConfig = Record<string, any>;

type CoordinatorOptions = {
    strategy?: "dom-order" | "viewport-first";
    timeoutMs?: number;
    initialWaitMs?: number;
};

/**
 * Render a DoenetML viewer to a container element with optional parent coordination.
 *
 * @param container - DOM element to render the viewer into
 * @param doenetMLSource - Optional DoenetML source code. If not provided, looks for a
 *                         `<script type="text/doenetml">` child element in the container.
 * @param config - Optional configuration including:
 *                 - enableParentCoordination: Enable serialized initialization with parent coordinator
 *                 - registrationDelayMs: Delay before registering with parent coordinator (default: 100ms)
 *                   Must be substantially smaller than parent's initialWaitMs to ensure registration
 *                   completes before parent begins granting.
 *                 - visibilityRootMargin: IntersectionObserver rootMargin for visibility detection
 *                   (default: "600px"). Larger values treat near-viewport iframes as visible sooner.
 *                 - Other DoenetViewer configuration options
 *
 * When enableParentCoordination is true, the viewer will wait for initialization permission
 * from a parent coordinator rather than initializing immediately. This enables serialized
 * initialization when multiple DoenetML documents are loaded in iframes.
 */
export function renderDoenetViewerToContainer(
    container: Element,
    doenetMLSource?: string,
    config?: ViewerConfig,
) {
    if (!(container instanceof Element)) {
        throw new Error("Container must be an DOM element");
    }
    if (!doenetMLSource) {
        const doenetMLScript = container.querySelector(
            'script[type="text/doenetml"]',
        );
        if (!doenetMLScript) {
            throw new Error(
                'If doenetMlSource is not provided, a <script type="text/doenetml"> child containing the DoenetML source code must be present',
            );
        }
        doenetMLSource = doenetMLScript.innerHTML;
    }

    // Read data attributes from the container element
    const attrs: Record<string, any> = {};
    for (const attr of container.attributes) {
        if (!attr.name.startsWith("data-doenet")) {
            continue;
        }
        const name = kebobCaseToCamelCase(
            attr.name.replace(/^data-doenet-/, ""),
        );
        const value = normalizeBooleanAttr(attr.value);
        attrs[name] = value;
    }

    const {
        addVirtualKeyboard,
        sendResizeEvents,
        enableParentCoordination,
        registrationDelayMs: registrationDelayMsFromAttrs,
        visibilityRootMargin: visibilityRootMarginFromAttrs,
        prefixForIds: prefixForIdsFromAttrs,
        ...flags
    } = attrs;

    const localConfig = { ...(config ?? {}) };
    const configFlags = localConfig.flags ?? {};
    const userInitializedCallback = localConfig.initializedCallback;
    const userOnInit = localConfig.onInit;
    delete localConfig.flags;
    delete localConfig.initializedCallback;
    delete localConfig.onInit;

    let prefixForIds = localConfig.prefixForIds ?? prefixForIdsFromAttrs;
    delete localConfig.prefixForIds;

    const visibilityRootMargin =
        localConfig.visibilityRootMargin ??
        visibilityRootMarginFromAttrs ??
        "600px";
    delete localConfig.visibilityRootMargin;

    const shouldCoordinate =
        localConfig.enableParentCoordination ??
        enableParentCoordination ??
        false;

    const registrationDelayMs =
        localConfig.registrationDelayMs ?? registrationDelayMsFromAttrs ?? 100;

    // Auto-generate unique prefix if not explicitly provided and not coordinating.
    // Coordination enforces single document per iframe, so no collision risk.
    // Uncoordinated documents might be multiple per page, so auto-generate to be safe.
    // This handles: multiple viewers on same page, embedded pages, and future scenarios.
    if (!prefixForIds && !shouldCoordinate) {
        prefixForIds = `doenet_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    }

    // Helper function to render the viewer
    const renderViewer = (
        initializedCallback:
            | ((args: { activityId: string; docId: string }) => void)
            | undefined = userInitializedCallback,
    ) => {
        let root = viewerRoots.get(container);
        if (!root) {
            root = ReactDOM.createRoot(container);
            viewerRoots.set(container, root);
        } else {
            console.warn(
                "renderDoenetViewerToContainer called multiple times for the same container; reusing existing React root.",
            );
        }

        const resizeWatcher = new ResizeWatcher();
        root.render(
            <DoenetViewer
                {...localConfig}
                prefixForIds={prefixForIds}
                doenetML={doenetMLSource}
                addVirtualKeyboard={addVirtualKeyboard}
                flags={{ ...flags, ...configFlags }}
                onInit={(r) => {
                    if (sendResizeEvents) {
                        resizeWatcher.watch(r);
                    }
                    userOnInit?.(r);
                }}
                initializedCallback={(args: {
                    activityId: string;
                    docId: string;
                }) => {
                    initializedCallback?.(args);
                }}
            />,
        );
    };

    // Simple path: no coordination - render immediately
    if (!shouldCoordinate) {
        renderViewer();
        return;
    }

    // Coordination path: register with parent, wait for grant, then render
    // Use frameElement to detect iframe, as window.self === window.top may be false
    // in nested iframe scenarios (e.g., Cypress wraps test in iframe)
    const isInIframe = window.frameElement !== null;
    if (!isInIframe) {
        // Not in iframe, just render immediately
        renderViewer();
        return;
    }

    // Check if we can access parent (same origin)
    try {
        void window.parent.location.origin;
    } catch {
        // Cross-origin - can't coordinate
        renderViewer();
        return;
    }

    // Set up coordination with parent
    const iframeId = `iframe_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const childOrigin = window.location.origin;
    let observer: IntersectionObserver | null = null;
    let latestVisibility = false; // Track latest visibility state
    let isRegistered = false;

    const messageHandler = (event: MessageEvent) => {
        if (event.origin !== childOrigin) {
            return;
        }
        if (!event.data || typeof event.data !== "object") {
            return;
        }
        const { type, iframeId: messageIframeId } = event.data;
        if (type === "DOENET_GRANT" && messageIframeId === iframeId) {
            window.removeEventListener("message", messageHandler);
            if (observer) {
                observer.disconnect();
            }

            // Wrap the initialized callback to send completion message
            const wrappedInitializedCallback = (args: {
                activityId: string;
                docId: string;
            }) => {
                window.parent.postMessage(
                    { type: "DOENET_COMPLETE", iframeId },
                    childOrigin,
                );
                userInitializedCallback?.(args);
            };

            // Render the viewer
            renderViewer(wrappedInitializedCallback);
        }
    };

    window.addEventListener("message", messageHandler);

    // Set up IntersectionObserver to report visibility changes
    // Updates latestVisibility in background, which is included in registration message
    if (typeof IntersectionObserver !== "undefined") {
        observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    const visible =
                        entry.isIntersecting || entry.intersectionRatio > 0;

                    // Always update latest visibility state
                    latestVisibility = visible;

                    // Only send visibility updates after registration to ensure proper order
                    if (isRegistered) {
                        window.parent.postMessage(
                            {
                                type: "DOENET_VISIBILITY_CHANGED",
                                iframeId,
                                visible,
                            },
                            childOrigin,
                        );
                    }
                }
            },
            {
                root: null,
                // Treat iframes as visible slightly before they enter the viewport
                // to favor near-viewport content when using viewport-first.
                // Defaults to "600px"; configurable via visibilityRootMargin.
                rootMargin: visibilityRootMargin,
                threshold: 0,
            },
        );
        observer.observe(container);
    }

    // Register with parent after a delay to ensure parent listener is ready
    // IntersectionObserver updates latestVisibility in the background
    // This handles the race condition where iframes load before coordinator is initialized
    // registrationDelayMs should be substantially smaller than parent's initialWaitMs
    window.setTimeout(() => {
        isRegistered = true;
        window.parent.postMessage(
            {
                type: "DOENET_REGISTER",
                iframeId,
                visible: latestVisibility,
            },
            childOrigin,
        );
    }, registrationDelayMs);
}

/**
 * Render DoenetEditor to a container element. If `doenetMLSource` is not provided,
 * it is assumed that `container` has a `<script type="text/doenetml">` child which
 * stores the source.
 */
export function renderDoenetEditorToContainer(
    container: Element,
    doenetMLSource?: string,
    config?: object,
) {
    if (!(container instanceof Element)) {
        throw new Error("Container must be an DOM element");
    }
    if (!doenetMLSource) {
        const doenetMLScript = container.querySelector(
            'script[type="text/doenetml"]',
        );
        if (!doenetMLScript) {
            throw new Error(
                'If doenetMlSource is not provided, a <script type="text/doenetml"> child containing the DoenetML source code must be present',
            );
        }
        doenetMLSource = doenetMLScript.innerHTML;
    }

    // We read off data attributes on the container element
    const attrs: Record<string, any> = {};
    for (const attr of container.attributes) {
        if (!attr.name.startsWith("data-doenet")) {
            continue;
        }
        const name = kebobCaseToCamelCase(
            attr.name.replace(/^data-doenet-/, ""),
        );

        const value = normalizeBooleanAttr(attr.value);
        attrs[name] = value;
    }

    // DoenetEditor doesn't accept flags, so only attribute using is addVirtualKeyboard
    const { addVirtualKeyboard } = attrs;

    ReactDOM.createRoot(container).render(
        <DoenetEditor
            doenetML={doenetMLSource}
            addVirtualKeyboard={addVirtualKeyboard}
            {...config}
        />,
    );
}

function normalizeBooleanAttr(attr: string | undefined | null) {
    if (attr === "true") {
        return true;
    }
    if (attr === "false") {
        return false;
    }
    return attr;
}

function kebobCaseToCamelCase(str: string) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Initialize parent-window coordinator for serialized iframe initialization.
 *
 * Call this function in the parent window to manage initialization of DoenetML documents
 * in child iframes. Child documents with enableParentCoordination enabled will wait for
 * permission from this coordinator before rendering, enabling serialized initialization.
 *
 * @param options - Coordinator configuration:
 *   - strategy: "dom-order" (default) to initialize iframes in DOM order,
 *               "viewport-first" to prioritize visible iframes (then dom-order for rest)
 *   - timeoutMs: Maximum wait time for an iframe to complete initialization (default: 30000ms)
 *   - initialWaitMs: Time to wait for all iframes to register before granting (default: 300ms)
 *     Should be substantially larger (2-3x) than child registrationDelayMs to ensure all
 *     children have registered before granting begins.
 *
 * @example
 * ```html
 * <!-- Parent page with iframes -->
 * <script src="doenet-standalone.js"></script>
 * <script>
 *   initializeDoenetParentCoordinator({
 *     strategy: "viewport-first"
 *   });
 * </script>
 * <iframe src="doc1.html"></iframe>
 * <iframe src="doc2.html"></iframe>
 * <iframe src="doc3.html"></iframe>
 * ```
 */
export function initializeDoenetParentCoordinator(
    options?: CoordinatorOptions,
) {
    const strategy = options?.strategy ?? "dom-order";
    const timeoutMs = options?.timeoutMs ?? 30000;
    const initialWaitMs = options?.initialWaitMs ?? 300;

    type ChildInfo = {
        window: Window;
        domOrder: number;
    };

    const registeredChildren = new Map<string, ChildInfo>();
    const registrationQueue: string[] = [];
    const visibleSet = new Set<string>();
    let activeChild: string | null = null;
    let activeTimeoutId: number | null = null;

    // Block granting temporarily to gather initial registrations
    let awaitingInitialData = true;
    let initialWaitScheduled = false;

    // Helper function to find DOM order of an iframe by its window
    const findDomOrder = (iframeWindow: Window): number => {
        const iframes = document.querySelectorAll("iframe");
        for (let i = 0; i < iframes.length; i++) {
            if (iframes[i].contentWindow === iframeWindow) {
                return i;
            }
        }
        return -1;
    };

    // Helper to sort iframes by DOM order
    const sortByDomOrder = (ids: string[]): string[] => {
        return ids.slice().sort((idA, idB) => {
            const orderA = registeredChildren.get(idA)?.domOrder ?? Infinity;
            const orderB = registeredChildren.get(idB)?.domOrder ?? Infinity;
            return orderA - orderB;
        });
    };

    /**
     * Attempts to grant initialization permission to the next iframe in queue.
     * Applies initial wait delays to ensure all iframes register their DOM position,
     * then selects next iframe based on strategy (viewport-first or dom-order).
     */
    const tryGrantNext = () => {
        // Delay all grants until initial registrations are collected
        if (awaitingInitialData) {
            if (!initialWaitScheduled) {
                initialWaitScheduled = true;
                window.setTimeout(() => {
                    awaitingInitialData = false;
                    tryGrantNext();
                }, initialWaitMs);
            }
            return;
        }

        // Don't grant if someone is already active or queue is empty
        if (activeChild !== null || registrationQueue.length === 0) {
            return;
        }

        let nextChildId: string | null = null;

        if (strategy === "viewport-first") {
            // For viewport-first: prioritize visible iframes, sorted by DOM order
            const visibleIds = registrationQueue.filter((id) => {
                return visibleSet.has(id);
            });

            if (visibleIds.length > 0) {
                const sortedVisible = sortByDomOrder(visibleIds);
                nextChildId = sortedVisible[0];
            }
        }

        // Fallback: select next by DOM order
        if (!nextChildId) {
            const sorted = sortByDomOrder(registrationQueue);
            nextChildId = sorted[0] ?? null;
        }

        if (!nextChildId) {
            return;
        }

        // Remove from queue
        const queueIndex = registrationQueue.indexOf(nextChildId);
        if (queueIndex !== -1) {
            registrationQueue.splice(queueIndex, 1);
        }

        const childInfo = registeredChildren.get(nextChildId);
        if (!childInfo) {
            // Child info not found, try next
            tryGrantNext();
            return;
        }

        activeChild = nextChildId;
        // Notify child that it has been granted

        // Set timeout to handle stuck iframes
        activeTimeoutId = window.setTimeout(() => {
            if (activeChild === nextChildId) {
                activeChild = null;
                activeTimeoutId = null;
                tryGrantNext();
            }
        }, timeoutMs);

        childInfo.window.postMessage(
            { type: "DOENET_GRANT", iframeId: nextChildId },
            window.location.origin,
        );
    };

    const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) {
            return;
        }
        if (!event.data || typeof event.data !== "object") {
            return;
        }

        const { type, iframeId, visible } = event.data;
        const hasVisibleFlag = typeof visible === "boolean";
        if (!iframeId) {
            return;
        }

        if (type === "DOENET_REGISTER") {
            // Store child info with document number and DOM order
            if (!registeredChildren.has(iframeId)) {
                const iframeWindow = event.source as Window;
                const domOrder = findDomOrder(iframeWindow);
                registeredChildren.set(iframeId, {
                    window: iframeWindow,
                    domOrder: domOrder,
                });
                // Child registered
            }

            // Store initial visibility state from registration message
            if (hasVisibleFlag) {
                if (visible) {
                    visibleSet.add(iframeId);
                } else {
                    visibleSet.delete(iframeId);
                }
            }

            // Add to registration queue if not already there
            if (
                !registrationQueue.includes(iframeId) &&
                iframeId !== activeChild
            ) {
                registrationQueue.push(iframeId);
                // Child queued
            }

            tryGrantNext();
        } else if (type === "DOENET_VISIBILITY_CHANGED") {
            if (!hasVisibleFlag) {
                return;
            }
            if (visible) {
                visibleSet.add(iframeId);
            } else {
                visibleSet.delete(iframeId);
            }
            // Visibility updated

            // If strategy is viewport-first, re-evaluate queue
            if (strategy === "viewport-first") {
                tryGrantNext();
            }
        } else if (type === "DOENET_COMPLETE") {
            // Clear timeout if this is the active child
            if (activeChild === iframeId) {
                if (activeTimeoutId !== null) {
                    window.clearTimeout(activeTimeoutId);
                    activeTimeoutId = null;
                }
                activeChild = null;
                // Active child completed
            }

            // Remove from queue if somehow still there
            const index = registrationQueue.indexOf(iframeId);
            if (index !== -1) {
                registrationQueue.splice(index, 1);
            }

            // Completion processed

            tryGrantNext();
        }
    };

    const globalAny = window as any;
    if (typeof globalAny.__doenetParentCoordinatorCleanup === "function") {
        globalAny.__doenetParentCoordinatorCleanup();
    }

    const cleanup = () => {
        window.removeEventListener("message", handleMessage);
        if (activeTimeoutId !== null) {
            window.clearTimeout(activeTimeoutId);
            activeTimeoutId = null;
        }
        if (globalAny.__doenetParentCoordinatorCleanup === cleanup) {
            globalAny.__doenetParentCoordinatorCleanup = null;
        }
    };

    globalAny.__doenetParentCoordinatorCleanup = cleanup;
    // Listen for coordination messages from child iframes
    window.addEventListener("message", handleMessage);

    return cleanup;
}

// Expose all public functions on the global object for CDN usage
// @ts-ignore
window.renderDoenetViewerToContainer = renderDoenetViewerToContainer;
// @ts-ignore
window.renderDoenetEditorToContainer = renderDoenetEditorToContainer;
// @ts-ignore
window.initializeDoenetParentCoordinator = initializeDoenetParentCoordinator;
