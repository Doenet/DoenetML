import React from "react";
import {
    _dastReducerActions,
    dastReducer,
} from "../../state/redux-slices/dast";
import { toXml } from "xast-util-to-xml";
import { FlatDastRoot } from "../../../../doenetml-worker-rust/dist/CoreWorker";
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
 * Use React's rendering pipeline to render the FlatDast to PreTeXt.
 */
export function renderToPretext(flatDast: FlatDastRoot) {
    // Do some pre-processing on the root
    flatDast = structuredClone(flatDast);
    ensurePretextTag(flatDast);

    // Make sure none of the attribute names clash with special React names (e.g. `ref` and `key`).
    for (const element of flatDast.elements) {
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
    for (const element of flatDast.elements) {
        delete element.attributes?.name;
    }

    store.dispatch(_dastReducerActions._setFlatDastRoot(flatDast));
    store.dispatch(_globalReducerActions._setRenderMode("pretext"));

    const xast = renderReactToXast(
        <Provider store={store}>
            {flatDast.children.map((child) => {
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

    return toXml(xast, { closeEmptyElements: true });
}
