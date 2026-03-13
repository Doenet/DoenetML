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

/**
 * Render DoenetViewer to a container element. If `doenetMLSource` is not provided,
 * it is assumed that `container` has a `<script type="text/doenetml">` child which
 * stores the source.
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

    ReactDOM.createRoot(container).render(
        <DoenetViewer
            doenetML={doenetMLSource}
            addVirtualKeyboard={addVirtualKeyboard}
            flags={flags}
            onInit={(r) => {
                if (sendResizeEvents) {
                    resizeWatcher.watch(r);
                }
            }}
            {...config}
        />,
    );
}

/**
 * Render DoenetViewer to a container element. If `doenetMLSource` is not provided,
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

// Expose renderDoenetViewerToContainer and renderDoenetEditorToContainer on the global object
// @ts-ignore
window.renderDoenetViewerToContainer = renderDoenetViewerToContainer;
// @ts-ignore
window.renderDoenetEditorToContainer = renderDoenetEditorToContainer;
