import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A `copy` is its source's DoenetML pasted where it sits, with the
 * attributes and children written on it applied (CPY-1, REF-4). These are
 * copies of composites, and of components whose content a written attribute
 * or child decides.
 */
describe("Copies of composites @group3", () => {
    /** The text of each named component, and the load's warnings and errors. */
    async function load(doenetML: string, names: string[]) {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        async function texts() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const result: Record<string, string> = {};
            for (const name of names) {
                result[name] =
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.text;
            }
            return result;
        }
        const { errors, warnings } = getDiagnosticsByType(core);
        return { core, resolvePathToNodeIdx, texts, errors, warnings };
    }

    it("`condition` written on a copy of a one-case conditionalContent is its condition", async () => {
        // #2217: it was ignored, and the copy showed nothing.
        const { core, resolvePathToNodeIdx, texts, errors, warnings } =
            await load(
                `<booleanInput name="b"><label>b</label></booleanInput>
<conditionalContent name="c" condition="$b"><text>yes</text></conditionalContent>
<p name="p1"><conditionalContent copy="$c" condition="true"/></p>
<p name="p2"><conditionalContent copy="$c" condition="not $b"/></p>
<p name="p3"><conditionalContent copy="$c"/></p>
<p name="p4"><conditionalContent copyWithState="$c" condition="true"/></p>
<p name="p5"><conditionalContent copy="$c" condition="true"><text>more</text></conditionalContent></p>`,
                ["p1", "p2", "p3", "p4", "p5"],
            );
        expect([...errors, ...warnings]).eqls([]);
        // `p5` adds a case of its own, holding `more`, after the source's
        // (REF-4).
        expect(await texts()).eqls({
            p1: "yes",
            p2: "yes",
            p3: "",
            p4: "yes",
            p5: "more",
        });

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        expect(await texts()).eqls({
            p1: "yes",
            p2: "",
            p3: "yes",
            p4: "yes",
            p5: "yes",
        });
    });

    it("`condition` on a copy of a conditionalContent with several cases is ignored, with a warning", async () => {
        const { texts, errors, warnings } = await load(
            `<conditionalContent name="c"><case condition="false"><text>yes</text></case><else><text>no</text></else></conditionalContent>
<p name="p1"><conditionalContent copy="$c" condition="true"/></p>`,
            ["p1"],
        );
        expect(errors).eqls([]);
        expect(warnings.map((w) => w.code)).eqls(["doenet-w0079"]);
        expect(await texts()).eqls({ p1: "no" });
    });

    it("a `condition` its source ignores is not given to the case of a copy", async () => {
        // Written beside a `<case>`, the source's `condition` is ignored
        // (`doenet-w0079`), so its case shows. A copy that writes no
        // `condition` shows it too.
        const { texts, errors, warnings } = await load(
            `<p name="p0"><conditionalContent name="c" condition="false"><case><text>yes</text></case></conditionalContent></p>
<p name="p1"><conditionalContent copy="$c"/></p>`,
            ["p0", "p1"],
        );
        expect(errors).eqls([]);
        expect(warnings.map((w) => [w.code, w.position?.start.line])).eqls([
            ["doenet-w0079", 1],
        ]);
        expect(await texts()).eqls({ p0: "yes", p1: "yes" });
    });

    it("`valueName` and `indexName` on a copy of a repeat name its own values, in what it copies and in its children", async () => {
        // #2211: the copy's names read the wrong placeholder, `NaN`, or
        // nothing at all.
        const { texts, errors, warnings } = await load(
            `<repeatForSequence from="1" to="2" valueName="v" name="r"><number>$v</number></repeatForSequence>
<p name="p1"><repeatForSequence copy="$r" valueName="v" /></p>
<p name="p2"><repeatForSequence copy="$r" valueName="u"><text>x</text><number>2$u</number></repeatForSequence></p>
<p name="p3"><repeatForSequence copy="$r" valueName="v"><text>x</text><number>2$v</number></repeatForSequence></p>
<repeat for="1 2" valueName="v" name="r2"><number>$v</number></repeat>
<p name="p4"><repeat copy="$r2" valueName="u"><text>x</text><number>2$u</number></repeat></p>
<repeatForSequence from="1" to="2" valueName="v" indexName="j" name="r3"><number>$v</number></repeatForSequence>
<p name="p5"><repeatForSequence copy="$r3" indexName="i"><number>10$i</number></repeatForSequence></p>
<repeatForSequence from="1" to="2" name="r4"><number>7</number></repeatForSequence>
<p name="p6"><repeatForSequence copy="$r4" valueName="u"><number>2$u</number></repeatForSequence></p>
<p name="p7"><repeat copy="$r2" valueName="u" indexName="i"><number>$u$i</number></repeat></p>`,
            ["p1", "p2", "p3", "p4", "p5", "p6", "p7"],
        );
        expect([...errors, ...warnings]).eqls([]);
        expect(await texts()).eqls({
            p1: "1, 2",
            p2: "1x2, 2x4",
            p3: "1x2, 2x4",
            p4: "1x2, 2x4",
            p5: "110, 220",
            p6: "72, 74",
            p7: "11, 24",
        });
    });

    it("a copy of a repeatForSequence follows its sequence, in what it copies and in its children", async () => {
        // Each name's component of an iteration is given the iteration's
        // value again when it changes.
        const { core, resolvePathToNodeIdx, texts } = await load(
            `<mathInput name="n" prefill="1"><label>n</label></mathInput>
<repeatForSequence from="$n" to="3" valueName="v" name="r"><number>$v</number></repeatForSequence>
<p name="p1"><repeatForSequence copy="$r" valueName="u"><number>2$u</number></repeatForSequence></p>
<p name="p2"><repeatForSequence copy="$r" valueName="v"><number>2$v</number></repeatForSequence></p>`,
            ["p1", "p2"],
        );
        expect(await texts()).eqls({ p1: "12, 24, 36", p2: "12, 24, 36" });
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        expect(await texts()).eqls({ p1: "24, 36", p2: "24, 36" });
    });

    it("`replacement` written on a copy of a substitute is of its type", async () => {
        // #2216: it was made a number, so the math copy did not load and
        // the text copy showed `NaN+1`.
        const { texts, errors, warnings } = await load(
            `<substitute name="s" type="math" match="x" replacement="y">x+1</substitute>
<p name="p1"><substitute copy="$s" replacement="z"/></p>
<substitute name="t" type="text" match="x" replacement="y">x+1</substitute>
<p name="p2"><substitute copy="$t" replacement="z"/></p>`,
            ["p1", "p2"],
        );
        expect([...errors, ...warnings]).eqls([]);
        expect(await texts()).eqls({ p1: "z + 1", p2: "z+1" });
    });

    it("`replacement` written on an extend of a substitute is an error in its place", async () => {
        const { texts, errors } = await load(
            `<substitute name="s" type="math" match="x" replacement="y">x+1</substitute>
<p name="p1"><substitute extend="$s" replacement="z"/></p>
<p name="after">after</p>`,
            ["p1", "after"],
        );
        expect(errors.map((e) => e.code)).eqls(["doenet-e0056"]);
        expect(await texts()).eqls({ p1: "", after: "after" });
    });
});

/**
 * A child written on a copy or extend that the component would not use
 * (#2486). Of a child a component reads only one of, the last written wins
 * on a copy (REF-4a); an extend shares its source's content, so there it is
 * ignored, as is any child a component has no use for beside its source's,
 * each with a warning (DIAG-1).
 */
describe("Children a copy or extend does not use @group3", () => {
    async function load(doenetML: string) {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        async function sv(name: string) {
            return stateVariables[await resolvePathToNodeIdx(name)].stateValues;
        }
        const { errors, warnings } = getDiagnosticsByType(core);
        return { sv, errors, warnings };
    }

    it("a function's or a pattern's formula written on a copy applies, and on an extend is ignored", async () => {
        const { sv, errors, warnings } = await load(
            `<function name="f">x^2</function>
<function name="fc" copy="$f">x^3</function>
<function name="fe" extend="$f">x^3</function>
<matchesPattern name="m" pattern="()^2">x^2</matchesPattern>
<matchesPattern name="mc" copy="$m">y</matchesPattern>
<piecewiseFunction name="pf"><function domain="(-10,0)">-x</function></piecewiseFunction>
<piecewiseFunction name="pfc" copy="$pf"><function domain="[0,10)">x</function></piecewiseFunction>`,
        );
        expect(errors).eqls([]);
        expect(warnings.map((w) => [w.code, w.position?.start.line])).eqls([
            ["doenet-w0169", 3],
        ]);
        expect((await sv("fc")).formula.tree).eqls(["^", "x", 3]);
        expect((await sv("fe")).formula.tree).eqls(["^", "x", 2]);
        expect((await sv("m")).value).eq(true);
        expect((await sv("mc")).value).eq(false);
        // A piece written on a copy of a piecewise function is added.
        expect((await sv("pf")).numericalfs[0](2)).eqls(NaN);
        expect((await sv("pfc")).numericalfs[0](-2)).eq(2);
        expect((await sv("pfc")).numericalfs[0](2)).eq(2);
    });

    it("a child of an extend of an input is ignored, and a label is not", async () => {
        const { sv, errors, warnings } = await load(
            `<mathInput name="mi" prefill="q"><label>a</label></mathInput>
<mathInput name="mie" extend="$mi">x</mathInput>
<booleanInput name="bi"><label>b</label></booleanInput>
<booleanInput name="bie" extend="$bi">true</booleanInput>
<mathInput name="mil" extend="$mi"><label>c</label></mathInput>`,
        );
        expect(errors).eqls([]);
        expect(warnings.map((w) => [w.code, w.position?.start.line])).eqls([
            ["doenet-w0169", 2],
            ["doenet-w0169", 4],
        ]);
        expect((await sv("mie")).value.tree).eq("q");
        expect((await sv("bie")).value).eq(false);
        expect((await sv("mil")).label).eq("c");
    });

    it("a matrix copy appends rows, and ignores a math beside them", async () => {
        // `[[5,6],[7,8]]` is how a matrix's text is shown, not how one is
        // written: on a matrix written on its own it is one entry.
        const { sv, errors, warnings } = await load(
            `<matrix name="M"><row>1 2</row><row>3 4</row></matrix>
<matrix name="Mc" copy="$M">[[5,6],[7,8]]</matrix>
<matrix name="Me" extend="$M">[[5,6],[7,8]]</matrix>
<matrix name="Mr" copy="$M"><row>5 6</row></matrix>`,
        );
        expect(errors).eqls([]);
        expect(warnings.map((w) => [w.code, w.position?.start.line])).eqls([
            ["doenet-w0190", 2],
            ["doenet-w0169", 3],
        ]);
        expect((await sv("Mc")).matrixSize).eqls([2, 2]);
        expect((await sv("Me")).matrixSize).eqls([2, 2]);
        expect((await sv("Mr")).matrixSize).eqls([3, 2]);
    });

    it("a curve copy ignores functions beside its through points", async () => {
        const { sv, errors, warnings } = await load(
            `<graph><curve name="c" through="(1,2) (3,4)"/>
<curve name="cc" copy="$c">(1,2)</curve></graph>`,
        );
        expect(errors).eqls([]);
        expect(warnings.map((w) => [w.code, w.position?.start.line])).eqls([
            ["doenet-w0190", 2],
        ]);
        expect((await sv("cc")).curveType).eq("bezier");
    });

    it("an orbital diagram copy's diagram applies", async () => {
        const { sv, errors, warnings } = await load(
            `<orbitalDiagram name="o"><orbitalDiagram>(1s, U)</orbitalDiagram></orbitalDiagram>
<orbitalDiagram name="oc" copy="$o"><orbitalDiagram>(2s, D)</orbitalDiagram></orbitalDiagram>
<orbitalDiagram name="written"><orbitalDiagram>(2s, D)</orbitalDiagram></orbitalDiagram>`,
        );
        expect([...errors, ...warnings]).eqls([]);
        expect((await sv("oc")).value).eqls((await sv("written")).value);
        expect((await sv("oc")).value).not.eqls((await sv("o")).value);
    });

    it("a point copy of a list entry is at the coordinates written in it", async () => {
        const { sv, errors, warnings } = await load(
            `<pointList name="pl">(1,2) (3,4)</pointList>
<point name="P" copy="$pl[1]">(7,8)</point>`,
        );
        expect([...errors, ...warnings]).eqls([]);
        expect((await sv("P")).xs.map((x: any) => x.tree)).eqls([7, 8]);
    });
});
