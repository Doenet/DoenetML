import { describe, expect, it } from "vitest";
import type { HeadlessCore } from "@doenet/utils";
import {
    createHeadlessCore,
    gradeState,
    HeadlessError,
    setInput,
    submit,
} from "../src";

async function withCore(
    doenetML: string,
    work: (core: HeadlessCore) => Promise<void>,
) {
    const core = await createHeadlessCore({ doenetML });
    try {
        await work(core);
    } finally {
        await core.terminate();
    }
}

async function credits(core: HeadlessCore) {
    return Object.fromEntries(
        (await core.getAnswers()).map((a) => [
            a.stableKey,
            {
                ifSubmit: a.creditAchievedIfSubmit,
                stored: a.stored.creditAchieved,
            },
        ]),
    );
}

async function refusal(promise: Promise<unknown>) {
    try {
        await promise;
    } catch (e) {
        expect(e).toBeInstanceOf(HeadlessError);
        return e as HeadlessError;
    }
    throw Error("expected a refusal");
}

describe("setInput and submit", () => {
    it("drives every supported input type, and the answers grade it", async () => {
        const doenetML = `
    <answer name="m"><mathInput name="mi" /><award><when>$mi = 2x</when></award></answer>
    <answer name="t"><textInput name="ti" /><award><when>$ti = hello</when></award></answer>
    <answer name="b"><booleanInput name="bi" /><award><when>$bi</when></award></answer>
    <answer name="c"><choiceInput name="ci">
        <choice>red</choice><choice credit="1">green</choice><choice>blue</choice>
    </choiceInput></answer>
    <answer name="f"><fractionInput name="fi" /><award><when>$fi = 3/4</when></award></answer>
    <answer name="mx"><matrixInput name="mxi" numRows="2" numColumns="2" />
        <award><when>$mxi = <matrix><row>1 2</row><row>3 4</row></matrix></when></award></answer>
    <graph><point name="P">(0,0)</point></graph>
    <answer name="pt"><award><when>$P = (3,4)</when></award></answer>
    `;
        await withCore(doenetML, async (core) => {
            await setInput(core, "mi", "2x");
            await setInput(core, "ti", "hello");
            await setInput(core, "bi", true);
            await setInput(core, "ci", [2]);
            await setInput(core, "fi", { numerator: "3", denominator: "4" });
            await setInput(core, "mxi", [
                ["1", "2"],
                ["3", "4"],
            ]);
            await setInput(core, "P", [3, 4]);

            const before = await credits(core);
            for (const key of ["m", "t", "b", "c", "f", "mx", "pt"]) {
                expect(before[key], key).toEqual({ ifSubmit: 1, stored: 0 });
            }

            for (const key of ["m", "t", "b", "c", "f", "mx", "pt"]) {
                await submit(core, key);
            }
            const after = await credits(core);
            for (const key of ["m", "t", "b", "c", "f", "mx", "pt"]) {
                expect(after[key], key).toEqual({ ifSubmit: 1, stored: 1 });
            }

            // and the state the core then reports grades the same way
            const graded = await gradeState(
                doenetML,
                1,
                await core.serializeState(),
            );
            expect(graded.answers.map((a) => a.credit)).toEqual([
                1, 1, 1, 1, 1, 1, 1,
            ]);
        });
    });

    it("selects choices by their position as the reader sees them, when shuffled", async () => {
        const positions = new Set<number>();
        for (const variantIndex of [1, 2, 3, 4, 5]) {
            const core = await createHeadlessCore({
                doenetML: `<answer name="c"><choiceInput name="ci" shuffleOrder>
                    <choice>red</choice><choice credit="1">green</choice><choice>blue</choice>
                </choiceInput></answer>`,
                variantIndex,
            });
            try {
                const resolved = await core.resolvePath("ci");
                if (resolved.status !== "resolved") throw Error("ci");
                const { choiceTexts } = (await core.readProperties(
                    resolved.component.componentIdx,
                    ["choiceTexts"],
                )) as { choiceTexts: string[] };
                positions.add(choiceTexts.indexOf("green") + 1);
                await setInput(core, "ci", choiceTexts.indexOf("green") + 1);
                expect((await credits(core)).c.ifSubmit).toBe(1);
            } finally {
                await core.terminate();
            }
        }
        // The shuffle moved it, so the positions were not the written order
        expect(positions.size).toBeGreaterThan(1);
    });

    it("drives an answer with several inputs, by name and by position", async () => {
        await withCore(
            `<answer name="ans"><mathInput name="x" /><mathInput name="y" />
                <award><when>$x + $y = 5</when></award>
            </answer>`,
            async (core) => {
                await setInput(core, "x", "2");
                await setInput(core, { answer: "ans", position: 2 }, "3");
                await submit(core, "ans");
                expect((await credits(core)).ans).toEqual({
                    ifSubmit: 1,
                    stored: 1,
                });
            },
        );
    });

    it("reaches the input an answer makes from sugar, and an unnamed input in a named answer, by position", async () => {
        await withCore(
            `<answer name="sugar">x</answer>
            <answer name="unnamed"><mathInput /><award>y</award></answer>`,
            async (core) => {
                await setInput(core, { answer: "sugar", position: 1 }, "x");
                await setInput(core, { answer: "unnamed", position: 1 }, "y");
                const result = await credits(core);
                expect(result.sugar.ifSubmit).toBe(1);
                expect(result.unnamed.ifSubmit).toBe(1);

                const error = await refusal(
                    setInput(core, { answer: "sugar", position: 2 }, "x"),
                );
                expect(error.code).toBe("notFound");
                expect(error.message).toContain("has 1 input of its own");
            },
        );
    });

    it("reaches a component inside a repeat by its path", async () => {
        await withCore(
            `<repeatForSequence name="r" length="3" valueName="v">
                <group name="g"><answer name="a"><mathInput name="mi" /><award><when>$mi = $v</when></award></answer></group>
            </repeatForSequence>`,
            async (core) => {
                await setInput(core, "$r[3].g.mi", "3");
                await submit(core, "r[3].g.a");
                const answers = await core.getAnswers();
                expect(
                    answers.map((a) => [a.stableKey, a.stored.creditAchieved]),
                ).toEqual([
                    ["r[1].a", 0],
                    ["r[2].a", 0],
                    ["r[3].a", 1],
                ]);
            },
        );
    });

    it("refuses a named component with no stable key, and the inputs of an answer with none", async () => {
        await withCore(
            `<p><mathInput name="dup" /></p><p><mathInput name="dup" /></p>
            <p name="p1"><answer name="same">x</answer></p>
            <p name="p2"><answer name="same">x</answer></p>`,
            async (core) => {
                let error = await refusal(setInput(core, "dup", "1"));
                expect(error.code).toBe("noStableKey");
                expect(error.message).toContain("not a stable key");

                error = await refusal(
                    setInput(core, { answer: "same", position: 1 }, "x"),
                );
                expect(error.code).toBe("noStableKey");

                // A unique path reaches them
                await setInput(core, { answer: "p2.same", position: 1 }, "x");
                expect((await credits(core))["p2.same"].ifSubmit).toBe(1);
            },
        );
    });

    it("refuses what it does not know or cannot set", async () => {
        await withCore(
            `<subsetOfRealsInput name="s" />
            <mathInput name="m" disabled />
            <graph><point name="P" fixed>(1,2)</point></graph>
            <choiceInput name="c"><choice>a</choice><choice>b</choice></choiceInput>
            <text name="t">x</text>`,
            async (core) => {
                let error = await refusal(setInput(core, "s", "x"));
                expect(error.code).toBe("unsupportedInput");
                expect(error.message).toContain("<subsetOfRealsInput>");

                error = await refusal(setInput(core, "t", "x"));
                expect(error.code).toBe("unsupportedInput");

                error = await refusal(setInput(core, "m", "1"));
                expect(error.code).toBe("inputDisabled");

                error = await refusal(setInput(core, "P", [3, 4]));
                expect(error.code).toBe("inputDisabled");

                for (const bad of [[3], [0], [1.5], "a"]) {
                    error = await refusal(setInput(core, "c", bad as any));
                    expect(error.code).toBe("invalidValue");
                }

                error = await refusal(setInput(core, "nothing", "x"));
                expect(error.code).toBe("notFound");

                // Nothing to submit on a text: the core says so
                await expect(submit(core, "t")).rejects.toThrow(
                    'A <text> has no action "submitAllAnswers"',
                );
            },
        );
    });

    it("refuses a matrix value of the wrong shape and a point of the wrong size", async () => {
        await withCore(
            `<matrixInput name="m" numRows="1" numColumns="2" /><graph><point name="P" /></graph>`,
            async (core) => {
                let error = await refusal(setInput(core, "m", [["1"]]));
                expect(error.code).toBe("invalidValue");
                expect(error.message).toContain("1 rows of 2 strings");
                error = await refusal(setInput(core, "P", [1, NaN]));
                expect(error.code).toBe("invalidValue");
            },
        );
    });

    it("submits everything under a section-wide check work", async () => {
        await withCore(
            `<section name="sec" sectionWideCheckWork>
                <answer name="a">x</answer><answer name="b">y</answer>
            </section>`,
            async (core) => {
                await setInput(core, { answer: "a", position: 1 }, "x");
                await submit(core, "sec");
                const answers = await core.getAnswers();
                expect(answers.map((a) => a.stored.numSubmissions)).toEqual([
                    1, 1,
                ]);
                expect((await core.getDocumentCredit()).stored).toEqual({
                    creditAchieved: 0.5,
                });
            },
        );
    });
});
