import React from "react";
import {
    _dastReducerActions,
    dastReducer,
} from "../../state/redux-slices/dast";
import * as Xast from "xast";
import { FlatDastRoot, FlatDastRootWithErrors } from "@doenet/doenetml-worker";
import { configureStore } from "@reduxjs/toolkit";
import {
    _globalReducerActions,
    globalReducer,
} from "../../state/redux-slices/global";
import { Provider } from "react-redux";
import { Element } from "../../renderers";
import { ensurePretextTag } from "./ensure-pretext-tag";
import { renderReactToXast } from "./xast-reconciler";
import { normalizeAttrs } from "./normalize-attrs";

/**
 * Use React's rendering pipeline to render the FlatDast to PreTeXt in the form of a XAST
 * XML Abstract Syntax Tree. This can be turned into a string using `xast-util-to-xml`.
 */
export function renderFlatDastToPretext(
    flatDast: FlatDastRoot | FlatDastRootWithErrors,
): Xast.Root {
    if (typeof flatDast !== "object" || !Array.isArray(flatDast.elements)) {
        // Something went terribly wrong.
        throw new Error("Error during renderToPretext" + flatDast);
    }
    // Do some pre-processing on the root
    flatDast = structuredClone(flatDast);
    const errors = flatDast.elements.filter((e) => e.type === "error");
    if (errors.length > 0) {
        console.warn("Found errors in FlatDast", errors);
        throw new Error(
            errors.map((e) => e.type === "error" && e.message).join("; "),
        );
    }
    // We have no errors, so we can safely cast to FlatDastRoot
    const _flatDast: FlatDastRoot = flatDast as FlatDastRoot;

    ensurePretextTag(_flatDast);

    // Make sure none of the attribute names clash with special React names (e.g. `ref` and `key`).
    for (const element of _flatDast.elements) {
        if (!element) {
            // It is possible that some elements have been removed/pruned;
            // skip over these without an error.
            continue;
        }
        if (element.attributes == null) {
            console.warn("Found element without attributes", element);
        }
        element.attributes = normalizeAttrs(element.attributes) ?? {};
    }

    // Create a new store independent of the existing Redux store.
    // We will configure it separately
    const store = configureStore({
        reducer: {
            dast: dastReducer,
            global: globalReducer,
        },
    });

    // Strip off any `name` attribute left over from the DAST
    for (const element of _flatDast.elements) {
        if (!element) {
            // It is possible that some elements have been removed/pruned;
            // skip over these without an error.
            continue;
        }
        delete element.attributes?.name;
    }

    store.dispatch(_dastReducerActions._setFlatDastRoot(_flatDast));
    store.dispatch(_globalReducerActions._setRenderMode("pretext"));

    const xast = renderReactToXast(
        <Provider store={store}>
            {_flatDast.children.map((child) => {
                if (typeof child === "string") {
                    return child;
                }
                return (
                    <Element
                        key={child.id}
                        id={child.id}
                        ancestors=""
                        annotation="original"
                    />
                );
            })}
        </Provider>,
    );

    // Make sure we include an `<?xml version="1.0" encoding="UTF-8"?>` instruction on the first line
    xast.children.unshift({ type: "text", value: "\n" });
    xast.children.unshift({
        type: "instruction",
        name: "xml",
        value: 'version="1.0" encoding="UTF-8"',
    });

    return xast;
}
