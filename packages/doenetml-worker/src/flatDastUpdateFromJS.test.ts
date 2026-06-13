import { describe, expect, it } from "vitest";
import { flatDastFromJS } from "./flatDastFromJS";
import type { ComponentInstruction, UpdateInstruction } from "./flatDastFromJS";
import {
    collectInstructionMaps,
    flatDastUpdateFromJS,
} from "./flatDastUpdateFromJS";

/** Build a minimal `ComponentInstruction` (the JS core's child/document form). */
function componentInstruction(
    overrides: Partial<ComponentInstruction> &
        Pick<ComponentInstruction, "componentIdx" | "componentType" | "id">,
): ComponentInstruction {
    return {
        actions: {},
        effectiveIdx: overrides.componentIdx,
        rendererType: overrides.componentType,
        ...overrides,
    };
}

describe("flatDastUpdateFromJS", () => {
    it("turns stateValues into changedState, applying per-type JS->Rust fixups", () => {
        const updateInstructions: UpdateInstruction[] = [
            {
                instructionType: "updateRendererStates",
                rendererStatesToUpdate: [
                    {
                        componentIdx: 2,
                        stateValues: { text: "hello", hidden: false },
                    },
                ],
            },
        ];

        const updates = flatDastUpdateFromJS(updateInstructions, {
            2: "text",
        });

        // `textJsToRust` copies `text` into `value`.
        expect(updates).toEqual({
            2: {
                changedState: { text: "hello", hidden: false, value: "hello" },
            },
        });
        // No child instructions, so children are left untouched.
        expect(updates[2].newChildren).toBeUndefined();
    });

    it("converts childrenInstructions into newChildren", () => {
        const updateInstructions: UpdateInstruction[] = [
            {
                instructionType: "updateRendererStates",
                rendererStatesToUpdate: [
                    {
                        componentIdx: 1,
                        stateValues: {},
                        childrenInstructions: [
                            "some text",
                            componentInstruction({
                                componentIdx: 3,
                                componentType: "text",
                                id: "/_text1",
                            }),
                        ],
                    },
                ],
            },
        ];

        const updates = flatDastUpdateFromJS(updateInstructions, { 1: "p" });

        expect(updates[1].newChildren).toEqual([
            "some text",
            { id: 3, annotation: "original" },
        ]);
        expect(updates[1].changedState).toEqual({});
    });

    it("applies the point fixup, deriving math objects from numericalXs", () => {
        const updateInstructions: UpdateInstruction[] = [
            {
                instructionType: "updateRendererStates",
                rendererStatesToUpdate: [
                    {
                        componentIdx: 5,
                        stateValues: {
                            numericalXs: [3, 4],
                            latex: "(3,4)",
                        },
                    },
                ],
            },
        ];

        const updates = flatDastUpdateFromJS(updateInstructions, {
            5: "point",
        });

        expect(updates[5].changedState).toMatchObject({
            x: { math_object: "3" },
            y: { math_object: "4" },
            coordsLatex: "(3,4)",
        });
    });

    it("merges multiple batches for the same component, later batches winning", () => {
        const updateInstructions: UpdateInstruction[] = [
            {
                instructionType: "updateRendererStates",
                rendererStatesToUpdate: [
                    { componentIdx: 2, stateValues: { text: "first" } },
                ],
            },
            {
                instructionType: "updateRendererStates",
                rendererStatesToUpdate: [
                    { componentIdx: 2, stateValues: { text: "second" } },
                ],
            },
        ];

        const updates = flatDastUpdateFromJS(updateInstructions, { 2: "text" });

        expect(updates[2].changedState).toEqual({
            text: "second",
            value: "second",
        });
    });

    it("replaces newChildren across batches, but preserves them when a later batch omits childrenInstructions", () => {
        const replacedIdx = 1;
        const preservedIdx = 4;
        const updateInstructions: UpdateInstruction[] = [
            {
                instructionType: "updateRendererStates",
                rendererStatesToUpdate: [
                    {
                        componentIdx: replacedIdx,
                        stateValues: {},
                        childrenInstructions: ["first"],
                    },
                    {
                        componentIdx: preservedIdx,
                        stateValues: {},
                        childrenInstructions: ["only"],
                    },
                ],
            },
            {
                instructionType: "updateRendererStates",
                rendererStatesToUpdate: [
                    {
                        componentIdx: replacedIdx,
                        stateValues: {},
                        childrenInstructions: ["second"],
                    },
                    // No `childrenInstructions`, so `preservedIdx`'s children
                    // from the first batch must survive.
                    { componentIdx: preservedIdx, stateValues: {} },
                ],
            },
        ];

        const updates = flatDastUpdateFromJS(updateInstructions, {});

        expect(updates[replacedIdx].newChildren).toEqual(["second"]);
        expect(updates[preservedIdx].newChildren).toEqual(["only"]);
    });

    it("falls back to an empty name (no fixup) for unknown components", () => {
        const updateInstructions: UpdateInstruction[] = [
            {
                instructionType: "updateRendererStates",
                rendererStatesToUpdate: [
                    { componentIdx: 9, stateValues: { foo: "bar" } },
                ],
            },
        ];

        const updates = flatDastUpdateFromJS(updateInstructions, {});

        expect(updates).toEqual({ 9: { changedState: { foo: "bar" } } });
    });
});

describe("collectInstructionMaps", () => {
    it("records componentType and string id for every component child", () => {
        const updateInstructions: UpdateInstruction[] = [
            {
                instructionType: "updateRendererStates",
                rendererStatesToUpdate: [
                    {
                        componentIdx: 1,
                        stateValues: {},
                        childrenInstructions: [
                            "raw text",
                            componentInstruction({
                                componentIdx: 2,
                                componentType: "text",
                                id: "/_text1",
                            }),
                        ],
                    },
                ],
            },
        ];

        const { componentIdxToName, doenetIdToComponentIdx } =
            collectInstructionMaps(updateInstructions);

        expect(componentIdxToName).toEqual({ 2: "text" });
        expect(doenetIdToComponentIdx).toEqual({ "/_text1": 2 });
    });
});

describe("flatDastFromJS (shared-helper refactor)", () => {
    const documentToRender = componentInstruction({
        componentIdx: 0,
        componentType: "document",
        id: "/_document1",
    });

    it("builds a flat root, registers children, and applies fixups", () => {
        const updateInstructions: UpdateInstruction[] = [
            {
                instructionType: "updateRendererStates",
                rendererStatesToUpdate: [
                    {
                        componentIdx: 0,
                        stateValues: {},
                        childrenInstructions: [
                            componentInstruction({
                                componentIdx: 1,
                                componentType: "text",
                                id: "/_text1",
                            }),
                        ],
                    },
                    {
                        componentIdx: 1,
                        stateValues: { text: "hello" },
                    },
                ],
            },
        ];

        const flatRoot = flatDastFromJS(documentToRender, updateInstructions);

        expect(flatRoot.type).toBe("root");
        expect(flatRoot.children).toEqual([{ id: 0, annotation: "original" }]);

        const documentElement = flatRoot.elements[0];
        expect(documentElement).toMatchObject({
            type: "element",
            name: "document",
            children: [{ id: 1, annotation: "original" }],
        });

        const textElement = flatRoot.elements[1];
        expect(textElement).toMatchObject({
            type: "element",
            name: "text",
            // `textJsToRust` adds `value` alongside `text`.
            data: { props: { text: "hello", value: "hello" } },
        });
    });
});
