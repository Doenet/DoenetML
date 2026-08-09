/**
 * Mounting and selection-driving helpers shared by the specs that measure what
 * the editor paints around text.
 */

import React from "react";
import type { EditorView } from "@uiw/react-codemirror";
import { CodeMirror } from "../../../src/CodeMirror";
import { THEME_VARS, type ThemeMode } from "./color-contrast";

export type ViewRef = { current: EditorView | null };

/**
 * Mount the editor on the canvas of `mode`, focused and ready to type into.
 *
 * The wrapper re-declares the CSS custom properties the editor theme reads:
 * they are defined in `@doenet/doenetml`'s `DoenetML.css`, not in this package,
 * so without them the component would render with none of the real app colors.
 *
 * It also carries a focusable element outside the editor, so a spec can blur
 * the editor without leaving the mounted tree.
 *
 * Returns a ref to the `EditorView`, which lets a spec place the selection at a
 * document offset rather than click at a pixel coordinate that would depend on
 * the rendered font metrics.
 */
export function mountEditor(mode: ThemeMode, value: string): ViewRef {
    const viewRef: ViewRef = { current: null };
    const style = {
        height: "500px",
        width: "700px",
        background: THEME_VARS[mode]["--canvas"],
        ...THEME_VARS[mode],
    } as React.CSSProperties;

    cy.mount(
        <div style={style}>
            <button id="outside-editor" type="button">
                outside
            </button>
            <CodeMirror
                value={value}
                darkMode={mode}
                editorViewRef={viewRef as React.RefObject<EditorView | null>}
            />
        </div>,
    );
    cy.get(".cm-content").click();
    return viewRef;
}

/**
 * Set the selection by document offset. Omitting `head` leaves a bare cursor at
 * `anchor`.
 */
export function setSelection(viewRef: ViewRef, anchor: number, head = anchor) {
    cy.then(() => {
        viewRef.current!.dispatch({ selection: { anchor, head } });
    });
}
