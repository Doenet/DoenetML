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
 *
 * `readOnly` picks the other of the two theme factories, which is a separate
 * set of rules that has to stay in step with the editable one.
 */
export function mountEditor(
    mode: ThemeMode,
    value: string,
    { readOnly = false }: { readOnly?: boolean } = {},
): ViewRef {
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
                readOnly={readOnly}
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
