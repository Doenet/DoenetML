/*
 * This file is for running a dev test of the codemirror component.
 * It does not show up in the bundled package.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { DoenetML } from "@doenet/doenetml/doenetml-inline-worker.js";
import "@doenet/doenetml/style.css";

// Re-export React and friends in case a user really wants to use them
export { React, ReactDOM, DoenetML };

/**
 * Render DoenetML to a container element. If `doenetMLSource` is not provided,
 * it is assumed that `container` has a `<script type="text/doenetml">` child which
 * stores the source.
 */
export function renderDoenetToContainer(
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
    const attrs: Record<string, boolean> = {};
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
    let { addVirtualKeyboard, ...rest } = attrs;

    ReactDOM.createRoot(container).render(
        <DoenetML
            doenetML={doenetMLSource}
            addVirtualKeyboard={addVirtualKeyboard}
            flags={rest}
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
    return Boolean(attr);
}

function kebobCaseToCamelCase(str: string) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

// Expose renderDoenetToContainer on the global object
// @ts-ignore
window.renderDoenetToContainer = renderDoenetToContainer;
