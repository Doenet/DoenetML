import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { data_format_version } from "@doenet/utils";
import {
    createJavascriptHeadlessCore,
    createJavascriptHeadlessCoreFactory,
    HEADLESS_DEFAULT_FLAGS,
} from "../../headless";
import { defaultFlags } from "../../../../doenetml/src/flags";

const wasm = fs.readFileSync(
    path.resolve(
        import.meta.dirname,
        "../../../../doenetml-worker-rust/lib-js-wasm-binding/pkg/lib_doenetml_worker_bg.wasm",
    ),
);

function create(doenetML: string, options: Record<string, any> = {}) {
    return createJavascriptHeadlessCore({ doenetML, wasm, ...options });
}

async function typeMath(
    core: Awaited<ReturnType<typeof create>>,
    componentIdx: number,
    latex: string,
) {
    await core.dispatchAction({
        componentIdx,
        actionName: "updateRawValue",
        args: { rawRendererValue: latex },
    });
    await core.dispatchAction({ componentIdx, actionName: "updateValue" });
}

describe("JavaScript headless core @group4", () => {
    it("has a flag for every flag the viewer has", () => {
        expect(Object.keys(HEADLESS_DEFAULT_FLAGS).sort()).toEqual(
            Object.keys(defaultFlags).sort(),
        );
    });

    it("runs with the viewer's default flags but for the events it sends", () => {
        // A flag whose default differs is a document that behaves differently
        // when graded than when viewed, so a change to the viewer's defaults
        // fails here until it is decided for the headless core too.
        expect(HEADLESS_DEFAULT_FLAGS).toEqual({
            ...defaultFlags,
            allowSaveEvents: false,
        });
    });

    it("reports what it is and that it loads state only at creation", async () => {
        const core = await create(
            `<selectFromSequence name="s" from="1" to="4" />`,
            { variantIndex: 3 },
        );
        expect(core.capabilities.loadState).toBe(false);
        expect(core.loadState).toBeUndefined();
        expect(
            createJavascriptHeadlessCoreFactory({ wasm }).dataFormatVersion,
        ).toBe(data_format_version);
        expect(core.numVariants).toBe(4);
        expect(core.variantIndex).toBe(3);
        await core.terminate();
    });

    it("reads answers with their stable keys, inputs, and stored and recomputed credit", async () => {
        const core = await create(`
    <answer name="ans">x</answer>
    <section><answer>y</answer></section>
    <p name="d"><answer name="dup">1</answer></p>
    <p name="e"><answer name="dup">2</answer></p>
    <group name="h"><answer name="inGroup">z</answer></group>
    `);
        const answers = await core.getAnswers();
        expect(answers.map((a) => a.stableKey)).toEqual([
            "ans",
            null,
            "d.dup",
            "e.dup",
            "inGroup",
        ]);
        expect(answers[0].position?.start.line).toBe(2);
        for (const answer of answers) {
            expect(answer.componentType).toBe("answer");
            expect(answer.inputs.map((i) => i.componentType)).toEqual([
                "mathInput",
            ]);
            expect(answer.creditAchievedIfSubmit).toBe(0);
            expect(answer.stored).toEqual({
                creditAchieved: 0,
                numSubmissions: 0,
            });
        }

        // Typing changes the recomputed credit and leaves the stored one
        await typeMath(core, answers[0].inputs[0].componentIdx, "x");
        const [typed] = await core.getAnswers();
        expect(typed.creditAchievedIfSubmit).toBe(1);
        expect(typed.stored).toEqual({ creditAchieved: 0, numSubmissions: 0 });

        await core.dispatchAction({
            componentIdx: typed.componentIdx,
            actionName: "submitAnswer",
        });
        const [submitted] = await core.getAnswers();
        expect(submitted.stored).toEqual({
            creditAchieved: 1,
            numSubmissions: 1,
        });
        expect(await core.getDocumentCredit()).toEqual({
            creditAchievedIfSubmit: 0.2,
            stored: { creditAchieved: 0.2 },
        });
        await core.terminate();
    });

    it("reports answers in document order, not source order, and not a copy that shadows one", async () => {
        const core = await create(`
    <repeat name="r" for="1 2" valueName="v">
        <answer name="a">$v</answer><answer name="b">$v</answer>
    </repeat>
    <answer name="c">x</answer>
    $c
    <answer name="d" copy="$c" />
    `);
        expect((await core.getAnswers()).map((a) => a.stableKey)).toEqual([
            "r[1].a",
            "r[1].b",
            "r[2].a",
            "r[2].b",
            "c",
            "d",
        ]);
        await core.terminate();

        // A select's options come in the order selected. Variant 1 selects
        // the second option and then the first.
        const select = await create(`
    <select name="s" numToSelect="2">
        <option><answer name="a">x</answer></option>
        <option><answer name="a">y</answer></option>
        <option><answer name="a">z</answer></option>
    </select>
    `);
        const answers = await select.getAnswers();
        expect(answers.map((a) => a.stableKey)).toEqual(["s[1].a", "s[2].a"]);
        expect(answers[0].position!.start.offset).toBeGreaterThan(
            answers[1].position!.start.offset,
        );
        await select.terminate();
    });

    it("resolves paths from the root, telling missing from not unique", async () => {
        const core = await create(`
    <text name="t" /><text name="t" />
    <repeatForSequence name="r" length="3" valueName="v">
      <group name="g"><p name="p">$v <mathInput name="mi" /></p></group>
    </repeatForSequence>
    `);
        expect(await core.resolvePath("t")).toEqual({ status: "notUnique" });
        expect(await core.resolvePath("nothing")).toEqual({
            status: "notFound",
        });
        expect(await core.resolvePath("r[5].g.p")).toEqual({
            status: "notFound",
        });
        const resolved = await core.resolvePath("$r[2].g.mi");
        expect(resolved.status).toBe("resolved");
        if (resolved.status === "resolved") {
            expect(resolved.component.componentType).toBe("mathInput");
        }
        await expect(core.resolvePath("r[2]..g")).rejects.toThrow(
            "is not a path",
        );
        await core.terminate();
    });

    it("reads children and properties", async () => {
        const core = await create(
            `<matrixInput name="m" numRows="2" numColumns="3" />`,
        );
        const resolved = await core.resolvePath("m");
        if (resolved.status !== "resolved") {
            throw Error("not resolved");
        }
        const idx = resolved.component.componentIdx;
        expect(await core.readProperties(idx, ["numRows", "noSuch"])).toEqual({
            numRows: 2,
        });
        const children = await core.getChildren(idx);
        expect(children.length).toBe(6);
        await core.terminate();
    });

    it("restores a saved state, stored values as stored and credit recomputed", async () => {
        const doenetML = `<answer name="ans">x</answer>`;
        const first = await create(doenetML);
        const [answer] = await first.getAnswers();
        await typeMath(first, answer.inputs[0].componentIdx, "x");
        await first.dispatchAction({
            componentIdx: answer.componentIdx,
            actionName: "submitAnswer",
        });
        // Edited after submitting
        await typeMath(first, answer.inputs[0].componentIdx, "y");
        const state = await first.serializeState();
        await first.terminate();

        expect(state.data_format_version).toBe(data_format_version);
        expect(typeof state.cid).toBe("string");

        const second = await create(doenetML, { savedState: state });
        const [restored] = await second.getAnswers();
        expect(restored.stored).toEqual({
            creditAchieved: 1,
            numSubmissions: 1,
        });
        expect(restored.creditAchievedIfSubmit).toBe(0);

        // Nothing changed since the load, so nothing was reported; the state
        // is still there to serialize, and it is the one loaded
        const again = await second.serializeState();
        expect(again.coreState).toBe(state.coreState);
        expect(again.data_format_version).toBe(data_format_version);
        await second.terminate();
    });

    it("reports diagnostics of every type it has", async () => {
        const core = await create(
            `<answer>x</answer><mathInput name="a" /><p>$nothing</p><bogus/>`,
        );
        const types = new Set((await core.getDiagnostics()).map((d) => d.type));
        expect(types.has("accessibility")).toBe(true);
        expect(types.has("error")).toBe(true);
        expect(types.has("warning")).toBe(true);
        await core.terminate();
    });

    it("refuses an action on a component that does not exist, and use after terminate", async () => {
        const core = await create(`<p name="p">hi</p>`);
        await expect(
            core.dispatchAction({ componentIdx: 9999, actionName: "x" }),
        ).rejects.toThrow("No component with index 9999");
        const p = await core.resolvePath("p");
        if (p.status !== "resolved") throw Error("p");
        await expect(
            core.dispatchAction({
                componentIdx: p.component.componentIdx,
                actionName: "submitAnswer",
            }),
        ).rejects.toThrow('A <p> has no action "submitAnswer"');
        await core.terminate();
        await expect(core.getAnswers()).rejects.toThrow("terminated");
        // A second terminate does nothing
        await core.terminate();
    });
});
