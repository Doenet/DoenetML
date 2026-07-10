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
import type {
    DiagnosticsTabId,
    DoenetEditorHandle,
} from "@doenet/doenetml/doenetml-inline-worker.js";
import "@doenet/doenetml/style.css";
import "./pretext-compat.css";
import { ResizeWatcher } from "./resize-watcher";

// Re-export React and friends in case a user really wants to use them
export { React, ReactDOM, DoenetViewer, DoenetEditor };

export const version: string = STANDALONE_VERSION;

// Cache React roots per container so repeat calls to
// renderDoenet{Viewer,Editor}ToContainer re-render in place instead of
// creating a fresh root each time (which would mount competing trees on the
// same DOM node and destroy editor/viewer state).
const viewerRootsByContainer = new WeakMap<Element, ReactDOM.Root>();
const editorRootsByContainer = new WeakMap<Element, ReactDOM.Root>();

type EditorHandleEntry = {
    mountedHandle: DoenetEditorHandle | null;
    pendingHandleActions: ((h: DoenetEditorHandle) => void)[];
    handle: {
        openDiagnosticsTab: (tabId: DiagnosticsTabId) => void;
        closeDiagnosticsPanel: () => void;
        updateRenderedView: () => void;
    };
};
const editorHandlesByContainer = new WeakMap<Element, EditorHandleEntry>();

/**
 * Render DoenetViewer to a container element. If `doenetMLSource` is not provided,
 * it is assumed that `container` has a `<script type="text/doenetml">` child which
 * stores the source.
 *
 * Repeat calls with the same `container` element re-render in place against a
 * cached React root rather than mounting a competing root. The cache lives in
 * a `WeakMap`, so it releases automatically once the container is GC'd, but it
 * is *not* keyed on `doenetMLSource` or `config` — passing different values
 * across calls is treated as an update of the same logical instance, not as a
 * remount. Callers that need a fresh root should detach and re-create the
 * container element.
 */
export function renderDoenetViewerToContainer(
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
    // We read off all the flags from data attributes on the container element
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
    const { addVirtualKeyboard, sendResizeEvents, ...flags } = attrs;
    const resizeWatcher = new ResizeWatcher();

    if (config && "flags" in config) {
        Object.assign(flags, config.flags);
        delete config.flags;
    }

    // Compose the resize-readiness signal with any caller-supplied
    // `initializedCallback` so we don't clobber it via the `{...config}` spread.
    const {
        initializedCallback: configInitializedCallback,
        ...restConfig
    }: { initializedCallback?: (arg: unknown) => void } = config ?? {};

    let root = viewerRootsByContainer.get(container);
    if (!root) {
        root = ReactDOM.createRoot(container);
        viewerRootsByContainer.set(container, root);
    }
    root.render(
        <DoenetViewer
            doenetML={doenetMLSource}
            addVirtualKeyboard={addVirtualKeyboard}
            flags={flags}
            onInit={(r) => {
                if (sendResizeEvents) {
                    resizeWatcher.watch(r);
                }
            }}
            initializedCallback={(arg: unknown) => {
                // Only start reporting heights to the host once the document has
                // actually rendered — otherwise a not-yet-booted (or failed)
                // container reports a near-zero height and collapses the host
                // iframe. See issue #1434.
                if (sendResizeEvents) {
                    resizeWatcher.markReady();
                }
                configInitializedCallback?.(arg);
            }}
            {...restConfig}
        />,
    );
}

/**
 * Render DoenetEditor to a container element. If `doenetMLSource` is not provided,
 * it is assumed that `container` has a `<script type="text/doenetml">` child which
 * stores the source.
 *
 * Repeat calls with the same `container` element re-render in place against a
 * cached React root, and return the *same* handle object across calls — the
 * handle's methods are stable for the lifetime of the container so callers can
 * cache it. The cache lives in a `WeakMap` keyed by container, so it releases
 * automatically once the container is GC'd. Two consumers rendering different
 * logical editor instances into the same container will therefore share state;
 * detach and re-create the container element if a fresh instance is needed.
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

    // Hold pending control actions until the inner DoenetEditor commits
    // (callback ref fires). React commits asynchronously after `createRoot.render`,
    // so a synchronous caller cannot rely on the ref being populated immediately
    // — queue and replay on mount.
    let entry = editorHandlesByContainer.get(container);
    if (!entry) {
        const newEntry: EditorHandleEntry = {
            mountedHandle: null,
            pendingHandleActions: [],
            // Filled in below — the handle methods need to close over `newEntry`.
            handle: null as unknown as EditorHandleEntry["handle"],
        };
        newEntry.handle = {
            openDiagnosticsTab(tabId: DiagnosticsTabId) {
                if (newEntry.mountedHandle) {
                    newEntry.mountedHandle.openDiagnosticsTab(tabId);
                } else {
                    newEntry.pendingHandleActions.push((h) =>
                        h.openDiagnosticsTab(tabId),
                    );
                }
            },
            closeDiagnosticsPanel() {
                if (newEntry.mountedHandle) {
                    newEntry.mountedHandle.closeDiagnosticsPanel();
                } else {
                    newEntry.pendingHandleActions.push((h) =>
                        h.closeDiagnosticsPanel(),
                    );
                }
            },
            updateRenderedView() {
                if (newEntry.mountedHandle) {
                    newEntry.mountedHandle.updateRenderedView();
                } else {
                    newEntry.pendingHandleActions.push((h) =>
                        h.updateRenderedView(),
                    );
                }
            },
        };
        editorHandlesByContainer.set(container, newEntry);
        entry = newEntry;
    }
    const handleEntry = entry;
    function refCallback(h: DoenetEditorHandle | null) {
        handleEntry.mountedHandle = h;
        if (h) {
            const queued = handleEntry.pendingHandleActions.splice(0);
            for (const action of queued) {
                action(h);
            }
        } else {
            handleEntry.pendingHandleActions.length = 0;
        }
    }

    let root = editorRootsByContainer.get(container);
    if (!root) {
        root = ReactDOM.createRoot(container);
        editorRootsByContainer.set(container, root);
    }
    root.render(
        <DoenetEditor
            ref={refCallback}
            doenetML={doenetMLSource}
            addVirtualKeyboard={addVirtualKeyboard}
            {...config}
        />,
    );

    return handleEntry.handle;
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

// Expose renderDoenetViewerToContainer and renderDoenetEditorToContainer on the global object
// @ts-ignore
window.renderDoenetViewerToContainer = renderDoenetViewerToContainer;
// @ts-ignore
window.renderDoenetEditorToContainer = renderDoenetEditorToContainer;
