// @vitest-environment jsdom
/**
 * `processElementUpdates` applies a core's element updates without immer's
 * drafts (ADR 0020 in `packages/cells-core`): changed props merge, new
 * children replace, a whole new element is put in, and an element no update
 * names keeps its identity, so its renderer does not re-render.
 */
import { describe, expect, it } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import {
    dastReducer,
    _dastReducerActions,
} from "../src/state/redux-slices/dast";

function element(
    id: number,
    props: Record<string, unknown>,
    children: any[] = [],
) {
    return {
        type: "element",
        name: "number",
        attributes: {},
        children,
        data: { id, props },
    };
}

describe("processElementUpdates", () => {
    it("merges props, replaces children, adds elements, keeps the rest", () => {
        const store = configureStore({ reducer: { dast: dastReducer } });
        store.dispatch(
            _dastReducerActions._setFlatDastRoot({
                type: "root",
                children: [{ id: 0, annotation: "original" }],
                elements: [
                    element(0, {}, [{ id: 1, annotation: "original" }]),
                    element(1, { text: "1", other: "kept" }),
                    element(2, { text: "2" }),
                ],
                warnings: [],
            } as any),
        );
        const before = store.getState().dast.flatDastRoot.elements;
        store.dispatch(
            _dastReducerActions.processElementUpdates({
                1: { type: "elementUpdate", changedState: { text: "5" } },
                0: {
                    type: "elementUpdate",
                    newChildren: [{ id: 3, annotation: "original" }],
                },
                3: {
                    type: "elementUpdate",
                    newFlatDastElement: element(3, { text: "new" }),
                },
            } as any),
        );
        const after = store.getState().dast.flatDastRoot.elements as any[];
        expect(after[1].data.props).toEqual({ text: "5", other: "kept" });
        expect(after[0].children).toEqual([{ id: 3, annotation: "original" }]);
        expect(after[3].data.props).toEqual({ text: "new" });
        expect(after[2]).toBe(before[2]);
        // The state before is untouched.
        expect((before[1] as any).data.props.text).toBe("1");
    });
});
