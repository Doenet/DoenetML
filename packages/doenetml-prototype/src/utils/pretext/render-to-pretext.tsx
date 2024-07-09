import React from "react";
import {
    _dastReducerActions,
    dastReducer,
} from "../../state/redux-slices/dast";
import { toXml } from "xast-util-to-xml";
import { renderToStaticMarkup } from "react-dom/server";
import { FlatDastRoot } from "../../../../doenetml-worker-rust/dist/CoreWorker";
import { configureStore } from "@reduxjs/toolkit";
import {
    _globalReducerActions,
    globalReducer,
} from "../../state/redux-slices/global";
import { Provider } from "react-redux";
import { Element } from "../../renderers";
import { ensurePretextTag } from "./ensure-pretext-tag";

/**
 * Use React's rendering pipeline to render the FlatDast to PreTeXt.
 */
export function renderToPretext(flatDast: FlatDastRoot) {
    // Do some pre-processing on the root
    flatDast = structuredClone(flatDast);
    ensurePretextTag(flatDast);

    // Create a new store independent of the existing Redux store.
    // We will configure it separately
    const store = configureStore({
        reducer: {
            dast: dastReducer,
            global: globalReducer,
        },
    });

    store.dispatch(_dastReducerActions._setFlatDastRoot(flatDast));
    store.dispatch(_globalReducerActions._setRenderMode("pretext"));

    return renderToStaticMarkup(
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
}
