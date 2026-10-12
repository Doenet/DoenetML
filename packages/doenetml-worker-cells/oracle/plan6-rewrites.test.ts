/**
 * Plan 6 (ADR 0009): the oracle tests in `conditionalcontent.test.ts` and
 * `select.test.ts` that the language now bans, each rewritten in the form
 * the language allows, with the original's checks kept wherever the
 * rewrite still means the same thing. A comment on each test says what
 * the ban was and what changed.
 *
 * Run from `packages/doenetml-worker-javascript` of the DoenetML fork after
 * copying this file to `src/test/tagSpecific/`:
 *
 *     DOENET_TEST_CORE=cells npx vitest run src/test/tagSpecific/plan6-rewrites.test.ts
 *
 * Each test also passes on the JavaScript core (without
 * `DOENET_TEST_CORE`), which checks that a rewrite says what the original
 * said.
 */
import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";
import me from "math-expressions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Plan 6 rewrites of banned tests", async () => {
    // Banned: `$cc.a` into a conditional content with no else, and
    // `extend="$cc"`. Rewrite: an else that declares `a` and `b` empty
    // (so they are in the branch interface), and the copy written out.
    it("reference names of children, including an extended conditional content", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n" />
    <p name="p1"><conditionalContent name="cc">
      <case condition="$n > 0"><text name="a">dog</text> mouse <text name="b">cat</text></case>
      <else><text name="a"></text><text name="b"></text></else>
    </conditionalContent></p>

    <p name="pa">$cc.a</p>
    <p name="pb">$cc.b</p>

    <p name="p2"><conditionalContent name="cc2">
      <case condition="$n > 0"><text name="a">dog</text> mouse <text name="b">cat</text></case>
      <else><text name="a"></text><text name="b"></text></else>
    </conditionalContent></p>

    <p name="pa2">$cc2.a</p>
    <p name="pb2">$cc2.b</p>
    `,
        });

        async function check_text(names: string[]) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("p1")].stateValues
                    .text,
            ).contain(names.join(" "));
            expect(
                stateVariables[await resolvePathToNodeIdx("pa")].stateValues
                    .text,
            ).eq(names[0] || "");
            expect(
                stateVariables[await resolvePathToNodeIdx("pb")].stateValues
                    .text,
            ).eq(names[2] || "");
            expect(
                stateVariables[await resolvePathToNodeIdx("p2")].stateValues
                    .text,
            ).contain(names.join(" "));
            expect(
                stateVariables[await resolvePathToNodeIdx("pa2")].stateValues
                    .text,
            ).eq(names[0] || "");
            expect(
                stateVariables[await resolvePathToNodeIdx("pb2")].stateValues
                    .text,
            ).eq(names[2] || "");
        }

        await check_text([]);
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_text(["dog", "mouse", "cat"]);
        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_text([]);
    });

    // Banned: `<text extend="$cc">` (a choice coerced to a text) and
    // `extend="$cc"`. Rewrite: extend the interface name `$cc.t`, and the
    // copy written out.
    it("case/else with single text, copies", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n" />
    <p name="pa">a: <conditionalContent name="cc">
      <case condition="$n < 0"><text name="t">dog</text></case>
      <case condition="$n <=1"><text name="t">cat</text></case>
      <else><text name="t">mouse</text></else>
    </conditionalContent></p>

    <p name="pa1">a1: <text extend="$cc.t" name="a1" /></p>

    <p name="pa2">value of a1: $a1.value</p>

    <p name="pb">b: <conditionalContent name="cc2">
      <case condition="$n < 0"><text name="t">dog</text></case>
      <case condition="$n <=1"><text name="t">cat</text></case>
      <else><text name="t">mouse</text></else>
    </conditionalContent></p>

    <p name="pb1">b1: <text extend="$cc2.t" name="b1" /></p>

    <p name="pb2">value of b1: $b1.value</p>
    `,
        });

        async function check_text(name: string) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            for (const [p, label] of [
                ["pa", "a"],
                ["pa1", "a1"],
                ["pa2", "value of a1"],
                ["pb", "b"],
                ["pb1", "b1"],
                ["pb2", "value of b1"],
            ]) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(p)].stateValues
                        .text,
                ).eq(`${label}: ${name}`);
            }
            expect(
                stateVariables[await resolvePathToNodeIdx("b1")].stateValues
                    .text,
            ).eq(`${name}`);
        }

        await check_text("mouse");
        for (const [latex, name] of [
            ["1", "cat"],
            ["10", "mouse"],
            ["-1", "dog"],
            ["x", "mouse"],
        ]) {
            await updateMathInputValue({
                componentIdx: await resolvePathToNodeIdx("n"),
                latex,
                core,
            });
            await check_text(name);
        }
    });

    // Banned: `$cc.c`, present in one case only; `$cc.d`, present in
    // none; `extend="$cc"` twice. Rewrite: the other cases declare `c`
    // empty, `d` is gone, the copies are written out. A missing `c` now
    // reads as the empty text instead of no component. `<math extend>`
    // becomes `<math>$cc.b</math>`, the same value.
    it("case/else with text, math, and optional", async () => {
        const cc = (name: string) => `<conditionalContent name="${name}">
      <case condition="$n<0" ><text name="a">dog</text>  <math name="b">x</math>
        <text name="c">optional text!</text>
      </case>
      <case condition="$n <= 1" ><text name="a">cat</text>  <math name="b">y</math><text name="c"></text>
      </case>
      <else><text name="a">mouse</text>  <math name="b">z</math><text name="c"></text>
      </else>
    </conditionalContent>`;
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n" />
    <p>original: ${cc("cc")}</p>

    <p>a1: <text extend="$cc.a" name="a1" /></p>
    <p>b1: <math name="b1">$cc.b</math></p>
    <p>c1: <text extend="$cc.c" name="c1" /></p>

    <p>copy: ${cc("cc2")}</p>

    <p name="pa2">$cc2.a</p>
    <p name="pb2">$cc2.b</p>
    <p name="pc2">$cc2.c</p>
    `,
        });

        async function check_items(text: string, math: any, optional = "") {
            const sv = await core.returnAllStateVariables(false, true);
            const t = async (p: string) =>
                sv[await resolvePathToNodeIdx(p)].stateValues.text;
            expect(await t("cc.a")).eq(text);
            expect(await t("a1")).eq(text);
            expect(await t("cc2.a")).eq(text);
            expect(await t("pa2")).eq(text);
            expect(
                sv[await resolvePathToNodeIdx("cc.b")].stateValues.value.tree,
            ).eqls(math);
            expect(
                sv[await resolvePathToNodeIdx("b1")].stateValues.value.tree,
            ).eqls(math);
            expect(await t("pb2")).eqls(math);
            expect(await t("cc.c")).eq(optional);
            expect(await t("c1")).eq(optional);
            expect(await t("pc2")).eq(optional);
        }

        await check_items("mouse", "z");
        for (const [latex, text, math, optional] of [
            ["1", "cat", "y", ""],
            ["10", "mouse", "z", ""],
            ["-1", "dog", "x", "optional text!"],
            ["x", "mouse", "z", ""],
        ]) {
            await updateMathInputValue({
                latex,
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });
            await check_items(text, math, optional);
        }
    });

    // Banned: `extend="$cc"` and `<text extend="$x1">` of a text (fine)
    // inside the cases next to maths nested in maths (a prototype gap,
    // not a ban). Rewrite: the copy written out; references go through
    // interface names.
    it("references to internal and external components", async () => {
        const cc = (name: string) => `<conditionalContent name="${name}">
      <case condition="$n<0" >
        <text name="animal" extend="$x1" />
        <text name="plant" extend="$y1" />
        <math name="p" simplify>3<math name="a1">x</math><math name="b1">a</math> + $a1$b1</math>
      </case>
      <case condition="$n <= 1" >
        <text name="animal" extend="$x2" />
        <text name="plant" extend="$y2" />
        <math simplify name="p">4<math name="a2">y</math><math name="b2">b</math> + $a2$b2</math>
      </case>
      <else>
        <text name="animal" extend="$x3" />
        <text name="plant" extend="$y3" />
        <math simplify name="p">5<math name="a3">z</math><math name="b3">c</math> + $a3$b3</math>
      </else>
    </conditionalContent>`;
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <text name="x1">dog</text>
    <text name="x2">cat</text>
    <text name="x3">mouse</text>
    <mathInput name="n" />
    <p>original: ${cc("cc")}</p>
    <text name="y1">tree</text>
    <text name="y2">shrub</text>
    <text name="y3">bush</text>
    <text extend="$cc.animal" name="animal" />
    <text extend="$cc.plant" name="plant" />
    <math name="p">$cc.p</math>
    ${cc("cc2")}
    <text extend="$cc2.animal" name="animalCopy" />
    `,
        });

        const sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[await resolvePathToNodeIdx("animal")].stateValues.value,
        ).eq("mouse");
        expect(sv[await resolvePathToNodeIdx("plant")].stateValues.value).eq(
            "bush",
        );
        expect(
            sv[await resolvePathToNodeIdx("animalCopy")].stateValues.value,
        ).eq("mouse");
    });

    // Banned: `<case extend="$positiveCase">` and `$cc1` (a copy of a whole
    // choice). Rewrite: the case written out; each case's text is named
    // `t`, and the copies are `$cc1.t`.
    it("copy case", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n" />
    <p name="p1"><conditionalContent name="cc1">
      <case condition="$n>0" ><text name="t">positive</text></case>
      <else><text name="t">non-positive</text></else>
    </conditionalContent></p>
    <p name="p2"><conditionalContent name="cc2">
      <case condition="$n>0" ><text name="t">positive</text></case>
      <case condition="$n<0" ><text name="t">negative</text></case>
      <else><text name="t">neither</text></else>
    </conditionalContent></p>
    <p name="p3">$cc1.t</p>
    <p name="p4">$cc2.t</p>
    `,
        });

        async function check_items(item1: string, item2: string) {
            const sv = await core.returnAllStateVariables(false, true);
            const t = async (p: string) =>
                sv[await resolvePathToNodeIdx(p)].stateValues.text;
            expect(await t("p1")).eq(item1);
            expect(await t("p3")).eq(item1);
            expect(await t("p2")).eq(item2);
            expect(await t("p4")).eq(item2);
        }

        await check_items("non-positive", "neither");
        for (const [latex, a, b] of [
            ["10", "positive", "positive"],
            ["-3", "non-positive", "negative"],
            ["0", "non-positive", "neither"],
        ]) {
            await updateMathInputValue({
                latex,
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });
            await check_items(a, b);
        }
    });

    // Banned: `<else extend="$bye">` and `$cc1`. Rewrite as "copy case".
    it("copy else", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n" />
    <p name="p1"><conditionalContent name="cc1">
      <case condition="$n>0" ><text name="t">hello</text></case>
      <else><text name="t">bye</text></else>
    </conditionalContent></p>
    <p name="p2"><conditionalContent name="cc2">
      <case condition="$n<0" ><text name="t">hello</text></case>
      <case condition="$n>0" ><text name="t">oops</text></case>
      <else><text name="t">bye</text></else>
    </conditionalContent></p>
    <p name="p3">$cc1.t</p>
    <p name="p4">$cc2.t</p>
    `,
        });

        async function check_items(item1: string, item2: string) {
            const sv = await core.returnAllStateVariables(false, true);
            const t = async (p: string) =>
                sv[await resolvePathToNodeIdx(p)].stateValues.text;
            expect(await t("p1")).eq(item1);
            expect(await t("p3")).eq(item1);
            expect(await t("p2")).eq(item2);
            expect(await t("p4")).eq(item2);
        }

        await check_items("bye", "bye");
        for (const [latex, a, b] of [
            ["10", "hello", "oops"],
            ["-3", "bye", "hello"],
            ["0", "bye", "bye"],
        ]) {
            await updateMathInputValue({
                latex,
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });
            await check_items(a, b);
        }
    });

    // Banned: `<text extend="$cc1">` (a choice coerced to a text).
    // Rewrite: `$cc1.t`. `hide` on a choice is a prototype gap.
    it("conditional contents hide dynamically", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <booleanInput name='h1' prefill="false" />
    <mathInput name="n" />
    <p name="pa">a: <conditionalContent hide="$h1" name="cc1">
      <case condition="$n<0"><text name="t">dog</text></case>
      <case condition="$n<=1"><text name="t">cat</text></case>
      <else><text name="t">mouse</text></else>
    </conditionalContent></p>
    <p name="pa1">a1: <text extend="$cc1.t" /></p>
    `,
        });

        async function check_items(item: string, hidden: boolean) {
            const sv = await core.returnAllStateVariables(false, true);
            expect(sv[await resolvePathToNodeIdx("pa")].stateValues.text).eq(
                hidden ? "a: " : `a: ${item}`,
            );
            expect(sv[await resolvePathToNodeIdx("pa1")].stateValues.text).eq(
                `a1: ${item}`,
            );
        }

        await check_items("mouse", false);
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("h1"),
            core,
        });
        await check_items("mouse", true);
        await updateMathInputValue({
            latex: "-1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items("dog", true);
    });

    // Banned: `$cc` (a whole choice), `extend="$cc"`, and `$cc[1][k]`
    // (content by position). Rewrite: the pieces are named texts, reached
    // as `$cc.animal` and `$cc.verb`; the copy is written out.
    it("string and blank strings in case and else", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <setup>
    <text name="animal1">fox</text><text name="verb1">jumps</text>
    <text name="animal2">elephant</text><text name="verb2">trumpets</text>
  </setup>
  <mathInput name="n" />
  <p name="pa">a: <conditionalContent name="cc" >
    <case condition="$n > 0">The <text name="animal" extend="$animal1" /> <text name="verb" extend="$verb1" />.</case>
    <else>The <text name="animal" extend="$animal2" /> <text name="verb" extend="$verb2" />.</else>
  </conditionalContent></p>
  <p name="pa1">a1: The $cc.animal $cc.verb.</p>
  <p name="pc1">c1: <text extend="$cc.animal" name="c1" /></p>
  <p name="pe1">e1: <text extend="$cc.verb" name="e1" /></p>
  `,
        });

        async function check_items(animal: string, verb: string) {
            const sv = await core.returnAllStateVariables(false, true);
            const t = async (p: string) =>
                sv[await resolvePathToNodeIdx(p)].stateValues.text;
            expect(await t("pa")).eq(`a: The ${animal} ${verb}.`);
            expect(await t("pa1")).eq(`a1: The ${animal} ${verb}.`);
            expect(await t("pc1")).eq(`c1: ${animal}`);
            expect(await t("pe1")).eq(`e1: ${verb}`);
        }

        await check_items("elephant", "trumpets");
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items("fox", "jumps");
    });

    // Banned: `numToSelect="$n"`, a reference resolved through a chain of
    // other components. Rewrite: the literal it resolves to.
    it("select multiple maths, initially unresolved", async () => {
        const valid = ["u", "v", "w", "x", "y", "z"].map((v) =>
            me.fromText(v),
        );
        for (let i = 0; i < 10; i++) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <select name="sel" numToSelect="3">
      <option><math>u</math></option>
      <option><math>v</math></option>
      <option><math>w</math></option>
      <option><math>x</math></option>
      <option><math>y</math></option>
      <option><math>z</math></option>
    </select>`,
                requestedVariantIndex: i,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const values = [];
            for (let k = 1; k <= 3; k++) {
                const v =
                    sv[await resolvePathToNodeIdx(`sel[${k}][1]`)].stateValues
                        .value;
                expect(valid.some((x) => x.equals(v))).eq(true);
                values.push(v);
            }
            expect(values[0].equals(values[1])).eq(false);
            expect(values[0].equals(values[2])).eq(false);
            expect(values[1].equals(values[2])).eq(false);
        }
    });

    // Banned: `extend="$s"` on a select. Rewrite: the picks referenced
    // through the interface (the sugar's options are single numbers, so
    // `$s[k]` names each).
    it("asList", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><select name="s" numToSelect="5" type="number">175 176 177 178 179 180 181</select></p>
    <p name="p2">$s[1]$s[2]$s[3]$s[4]$s[5]</p>
    `,
        });
        const sv = await core.returnAllStateVariables(false, true);
        const results: number[] = [];
        for (let k = 1; k <= 5; k++) {
            results.push(
                sv[await resolvePathToNodeIdx(`s[${k}][1]`)].stateValues.value,
            );
        }
        for (const num of results) {
            expect([175, 176, 177, 178, 179, 180, 181].includes(num)).eq(
                true,
            );
        }
        expect(new Set(results).size).eq(5);
        expect(sv[await resolvePathToNodeIdx("p2")].stateValues.text).eq(
            results.join(""),
        );
    });

    // Banned: `extend="$sample1"` on a select. Rewrite: copies of the
    // picks (`$sample1`), which show the same values.
    it("copies don't resample", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1">
    <select name="sample1" type="number">1 2 3 4 5 6 7</select>
    <select name="sample2" type="number">1 2 3 4 5 6 7</select>
    </p>
    <p name="p2"><number name="noresample1">$sample1</number> <number name="noresample2">$sample2</number></p>
    <p name="p3"><number name="noreresample1">$noresample1</number> <number name="noreresample2">$noresample2</number></p>
    `,
        });
        const sv = await core.returnAllStateVariables(false, true);
        const v = async (p: string) =>
            sv[await resolvePathToNodeIdx(p)].stateValues.value;
        const num1 = await v("sample1[1][1]");
        const num2 = await v("sample2[1][1]");
        expect(Number.isInteger(num1) && num1 >= 1 && num1 <= 7).eq(true);
        expect(Number.isInteger(num2) && num2 >= 1 && num2 <= 7).eq(true);
        expect(await v("noresample1")).eq(num1);
        expect(await v("noresample2")).eq(num2);
        expect(await v("noreresample1")).eq(num1);
        expect(await v("noreresample2")).eq(num2);
    });

    // Banned: `numToSelect="$numToSelect"` from an input (read once and
    // frozen in the current core). Rewrite: the literal. The options'
    // contents still follow the inputs they copy.
    it("select doesn't change dynamically", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput prefill="a" name="x"/>
    <mathInput prefill="b" name="y"/>
    <mathInput prefill="c" name="z"/>
    <p>
    <select name="sample1" withReplacement numToSelect="5">
        <option><math name="v">$x</math></option>
        <option><math name="v">$y</math></option>
        <option><math name="v">$z</math></option>
    </select>
    </p>
    `,
        });

        const picks = async () => {
            const sv = await core.returnAllStateVariables(false, true);
            const out = [];
            for (let k = 1; k <= 5; k++) {
                out.push(
                    sv[await resolvePathToNodeIdx(`sample1[${k}].v`)]
                        .stateValues.value.tree,
                );
            }
            return out;
        };
        const sampleMaths = await picks();
        for (const val of sampleMaths) {
            expect(["a", "b", "c"].includes(val)).eq(true);
        }
        const newValues: Record<string, string> = { a: "q", b: "r", c: "s" };
        for (const [name, latex] of [
            ["x", "q"],
            ["y", "r"],
            ["z", "s"],
        ]) {
            await updateMathInputValue({
                latex,
                componentIdx: await resolvePathToNodeIdx(name),
                core,
            });
        }
        expect(await picks()).eqls(sampleMaths.map((x) => newValues[x]));
    });

    // Banned: `$s[1][1]` and `$s[1][2]`, an option's content by position.
    // Rewrite: the two texts are named.
    it("correctly reference select inside another select", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <select name="select1">
      <option>
        <p name="pqr">q,r = <select name="s">
          <option><text name="q">a</text><text name="r">b</text></option>
        </select></p>
        <p name="pq2">q2 = $s[1].q</p>
        <p name="pr2">r2 = $s[1].r</p>
      </option>
    </select>
    `,
        });
        const sv = await core.returnAllStateVariables(false, true);
        const t = async (p: string) =>
            sv[await resolvePathToNodeIdx(p)].stateValues.text;
        expect(await t("select1[1].pqr")).eq(`q,r = ab`);
        expect(await t("select1[1].pq2")).eq(`q2 = a`);
        expect(await t("select1[1].pr2")).eq(`r2 = b`);
    });
});
