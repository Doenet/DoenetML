import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    movePoint,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";
import { censusOfCore } from "../perf/census";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * Value references (Doenet/DoenetML#2128): a bare `$n` that stands where only
 * a value is read becomes a `_ref` component shadowing one state variable of
 * its referent, in place of a full component of the referent's type carrying
 * shadow attribute components.
 *
 * These tests pin what a reference shows, where a write through it lands,
 * and what it creates. The census reads the JavaScript core's internals, so
 * the suite does not run on the Rust core.
 */
describe.skipIf(process.env.DOENET_TEST_CORE === "rust")(
    "Value references @group2",
    () => {
        /** The live `_ref` components, in index order. */
        function valueRefs(core: any) {
            return (Object.values(core.core._components) as any[])
                .filter((c) => c?.state && c.componentType === "_ref")
                .sort((a, b) => a.componentIdx - b.componentIdx);
        }

        it("a reference inside a leaf type is one small component", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <number name="n">5</number>
    <number name="m">$n+1</number>
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const nIdx = await resolvePathToNodeIdx("n");
            const mIdx = await resolvePathToNodeIdx("m");
            expect(stateVariables[mIdx].stateValues.value).eq(6);

            // the reference, its referent, the `_copy` that made it, the
            // sugar `<math>` around `$n+1`, and nothing else
            const census = censusOfCore(core);
            expect(census.byType).eqls({
                document: 1,
                number: 2,
                math: 1,
                _copy: 1,
                _ref: 1,
            });
            expect(census.attributeComponents).eq(0);

            // it stands in for a `math` inside the `<math>`, reading `n.math`
            const [ref] = valueRefs(core);
            expect(ref.shadows.componentIdx).eq(nIdx);
            expect(ref.shadows.propVariable).eq("math");
            expect(ref.presentedComponentType).eq("math");
            expect(ref.doenetAttributes.referencedVariable).eq("value");
        });

        it("follows the referent, and a write through it lands on the referent", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="mi">5</mathInput>
    <number name="n">$mi</number>
    <math name="m" simplify>$n+1</math>
    <mathInput name="bound" bindValueTo="$n" />
    `,
            });
            const nIdx = await resolvePathToNodeIdx("n");
            const mIdx = await resolvePathToNodeIdx("m");
            const miIdx = await resolvePathToNodeIdx("mi");

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables[nIdx].stateValues.value).eq(5);
            expect(stateVariables[mIdx].stateValues.value.tree).eq(6);

            await updateMathInputValue({
                latex: "7",
                componentIdx: miIdx,
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(stateVariables[nIdx].stateValues.value).eq(7);
            expect(stateVariables[mIdx].stateValues.value.tree).eq(8);

            // typed into the bound input, the value travels through the
            // reference in `bindValueTo`, then through the one in `n`, to `mi`
            await updateMathInputValue({
                latex: "10",
                componentIdx: await resolvePathToNodeIdx("bound"),
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(stateVariables[miIdx].stateValues.value.tree).eq(10);
            expect(stateVariables[nIdx].stateValues.value).eq(10);
            expect(stateVariables[mIdx].stateValues.value.tree).eq(11);

            expect(valueRefs(core)).toHaveLength(3);
        });

        it("display settings follow a direct reference, not an operand, and yield to the parent's own", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <number name="n" displayDigits="5">5.123456</number>
    <number name="m1">$n</number>
    <number name="m2">$n+1</number>
    <math name="m3">$n</math>
    <math name="m4">$n+1</math>
    <number name="m5">2$n</number>
    <number name="m6" displayDigits="2">$n</number>
    <number name="m7" displayDecimals="1">$n</number>
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const text = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .text;
            expect(await text("n")).eq("5.1235");
            expect(await text("m1")).eq("5.1235");
            expect(await text("m2")).eq("6.12");
            expect(await text("m3")).eq("5.1235");
            expect(await text("m4")).eq("5.12 + 1");
            expect(await text("m5")).eq("10.25");
            expect(await text("m6")).eq("5.1");
            expect(await text("m7")).eq("5.1");
        });

        it("stands in as the type its parent accepts", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <number name="n">5</number>
    <math name="q">q</math>
    <text name="t">$n</text>
    <boolean name="b">$n > 3</boolean>
    <math name="m">$n</math>
    <number name="k">$q</number>
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const value = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .value;
            expect(await value("t")).eq("5");
            expect(await value("b")).eq(true);
            expect((await value("m")).tree).eq(5);
            expect(await value("k")).eqls(NaN);

            const refs = valueRefs(core).map((ref) => [
                ref.presentedComponentType,
                ref.shadows.propVariable,
            ]);
            expect(refs).eqls([
                ["text", "text"],
                ["number", "value"],
                ["math", "math"],
                ["math", "value"],
            ]);
        });

        it("a reference to an input is written through and shows the input's settings", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="mi">5</mathInput>
    <math name="m">$mi+1</math>
    <mathInput name="mi2" bindValueTo="$m" />
    <mathInput name="mi3" displayDigits="2">3.14159</mathInput>
    <math name="m3">$mi3</math>
    <text name="t">hello</text>
    <textInput name="ti" bindValueTo="$t" />
    `,
            });
            const miIdx = await resolvePathToNodeIdx("mi");
            const tIdx = await resolvePathToNodeIdx("t");

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("m3")].stateValues
                    .text,
            ).eq("3.1");

            await updateMathInputValue({
                latex: "10",
                componentIdx: await resolvePathToNodeIdx("mi2"),
                core,
            });
            await updateTextInputValue({
                text: "bye",
                componentIdx: await resolvePathToNodeIdx("ti"),
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(stateVariables[miIdx].stateValues.value.tree).eq(9);
            expect(stateVariables[tIdx].stateValues.value).eq("bye");
        });

        it("has no fixed of its own: a fixed referent refuses the write, a fixed parent does not fix the referent", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <number name="a">1</number>
    <number name="b" fixed>2</number>
    <mathInput name="mi" bindValueTo="$a+$b" />
    <math name="fm" fixed>$a</math>
    <mathInput name="mi2" bindValueTo="$a" />
    `,
            });
            const aIdx = await resolvePathToNodeIdx("a");
            const bIdx = await resolvePathToNodeIdx("b");

            for (const ref of valueRefs(core)) {
                expect(await ref.stateValues.fixed).eq(undefined);
            }

            await updateMathInputValue({
                latex: "10",
                componentIdx: await resolvePathToNodeIdx("mi"),
                core,
            });
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables[aIdx].stateValues.value).eq(8);
            expect(stateVariables[bIdx].stateValues.value).eq(2);

            await updateMathInputValue({
                latex: "5",
                componentIdx: await resolvePathToNodeIdx("mi2"),
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(stateVariables[aIdx].stateValues.value).eq(5);
            expect(
                stateVariables[await resolvePathToNodeIdx("fm")].stateValues
                    .value.tree,
            ).eq(5);
        });

        it("a hidden referent does not hide the reference", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <number name="n" hide>5</number>
    <math name="m" simplify>$n+1</math>
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const m = stateVariables[await resolvePathToNodeIdx("m")];
            expect(m.stateValues.value.tree).eq(6);
            expect(m.stateValues.hidden).eq(false);
            const [ref] = valueRefs(core);
            expect(await ref.stateValues.hidden).eq(false);
        });

        it("an index reference is remade when the index changes", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="l">1 2 3 4</numberList>
    <mathInput name="i">2</mathInput>
    <number name="x">$l[$i]</number>
    `,
            });
            const xIdx = await resolvePathToNodeIdx("x");
            const iIdx = await resolvePathToNodeIdx("i");

            const xValue = async () =>
                (await core.returnAllStateVariables(false, true))[xIdx]
                    .stateValues.value;

            expect(await xValue()).eq(2);
            expect(valueRefs(core)).toHaveLength(1);

            await updateMathInputValue({
                latex: "3",
                componentIdx: iIdx,
                core,
            });
            expect(await xValue()).eq(3);
            expect(valueRefs(core)).toHaveLength(1);

            await updateMathInputValue({
                latex: "7",
                componentIdx: iIdx,
                core,
            });
            expect(await xValue()).eqls(NaN);
            expect(valueRefs(core)).toHaveLength(0);

            await updateMathInputValue({
                latex: "1",
                componentIdx: iIdx,
                core,
            });
            expect(await xValue()).eq(1);
            expect(valueRefs(core)).toHaveLength(1);
        });

        it("a reference as the content of an attribute", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="mi">4</mathInput>
    <number name="n">$mi</number>
    <math name="m" displayDigits="$n">3.123456x</math>
    `,
            });
            const mIdx = await resolvePathToNodeIdx("m");
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables[mIdx].stateValues.text).eq("3.123 x");

            await updateMathInputValue({
                latex: "2",
                componentIdx: await resolvePathToNodeIdx("mi"),
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(stateVariables[mIdx].stateValues.text).eq("3.1 x");

            // one for `$mi` inside `n`, one for `$n` inside the attribute
            expect(valueRefs(core)).toHaveLength(2);
            expect(censusOfCore(core).byType.boolean).toBeUndefined();
        });

        it("extending or copying a component that holds a reference", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <number name="n">5</number>
    <math name="m" simplify>$n+1</math>
    <math extend="$m" name="m2" />
    <math copy="$m" name="m3" />
    <mathInput name="mi" bindValueTo="$n" />
    `,
            });
            const value = async (name: string) =>
                (await core.returnAllStateVariables(false, true))[
                    await resolvePathToNodeIdx(name)
                ].stateValues.value.tree;

            expect(await value("m")).eq(6);
            expect(await value("m2")).eq(6);
            expect(await value("m3")).eq(6);

            await updateMathInputValue({
                latex: "7",
                componentIdx: await resolvePathToNodeIdx("mi"),
                core,
            });
            expect(await value("m")).eq(8);
            expect(await value("m2")).eq(8);
            // the unlinked copy of `m` copied its definition, `$n+1`, whose
            // reference to `n` is outside what was copied and stays linked
            expect(await value("m3")).eq(8);
        });

        it("repeat iterations", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <repeatForSequence from="1" to="4" valueName="i" name="r">
      <number name="sq">$i^2</number>
    </repeatForSequence>
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            for (let i = 1; i <= 4; i++) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(`r[${i}].sq`)]
                        .stateValues.value,
                ).eq(i ** 2);
            }
            expect(valueRefs(core)).toHaveLength(4);
            const census = censusOfCore(core);
            expect(census.byType.boolean).toBeUndefined();
            expect(census.byType.integer).toBeUndefined();
        });

        it("in a function, and to a coordinate of a point with its display settings", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <number name="a">2</number>
    <function name="f">$a x^2</function>
    <evaluate function="$f" input="3" name="e" />
    <graph>
      <point name="P">(1,2)</point>
      <point name="Q" displayDigits="2">(1.23456,2)</point>
    </graph>
    <number name="px">$P.x</number>
    <math name="qx">$Q.x</math>
    `,
            });
            const pxIdx = await resolvePathToNodeIdx("px");
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("e")].stateValues
                    .value.tree,
            ).eq(18);
            expect(stateVariables[pxIdx].stateValues.value).eq(1);
            expect(
                stateVariables[await resolvePathToNodeIdx("qx")].stateValues
                    .text,
            ).eq("1.2");

            await movePoint({
                componentIdx: await resolvePathToNodeIdx("P"),
                x: 4,
                y: 5,
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(stateVariables[pxIdx].stateValues.value).eq(4);
        });

        it("operators that ask whether a child is a number", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <number name="a">2</number>
    <number name="b">3</number>
    <math name="x">x</math>
    <sum name="s">$a $b</sum>
    <sum name="s2">$a $x</sum>
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const s = stateVariables[await resolvePathToNodeIdx("s")];
            const s2 = stateVariables[await resolvePathToNodeIdx("s2")];
            expect(s.stateValues.value.tree).eq(5);
            expect(s.stateValues.isNumber).eq(true);
            expect(s2.stateValues.value.tree).eqls(["+", 2, "x"]);
            expect(s2.stateValues.isNumber).eq(false);
        });

        it("a text reference to a boolean is written through its text", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <boolean name="b">true</boolean>
    <text name="bt">$b</text>
    <textInput name="ti" bindValueTo="$b" />
    `,
            });
            const bIdx = await resolvePathToNodeIdx("b");
            const btIdx = await resolvePathToNodeIdx("bt");
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables[btIdx].stateValues.value).eq("true");

            await updateTextInputValue({
                text: "false",
                componentIdx: await resolvePathToNodeIdx("ti"),
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(stateVariables[bIdx].stateValues.value).eq(false);
            expect(stateVariables[btIdx].stateValues.value).eq("false");
        });

        it("a collect gathers the referent where it stands, not the reference", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <section name="s">
      <number name="n">5</number>
      <math name="q">$n+1</math>
      <text name="t">$n</text>
      <boolean name="b">$n > 3</boolean>
    </section>
    <collect componentType="number" from="$s" name="cn" />
    <collect componentType="math" from="$s" name="cm" />
    <p name="pn">$cn</p>
    <p name="pm">$cm</p>
    `,
            });
            // the three references are `_ref`s, which a collect of numbers
            // does not gather; the full copies of `n` they replace inside
            // `q`, `t` and `b` were gathered, listing `n` four times. (The
            // collect's copy of `q`, and the paragraph's copy of that, carry
            // whole shadows of the reference in `q`, with no `propVariable`.)
            expect(
                valueRefs(core).filter((ref) => ref.shadows.propVariable),
            ).toHaveLength(3);
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("pn")].stateValues
                    .text,
            ).eq("5");
            expect(
                stateVariables[await resolvePathToNodeIdx("pm")].stateValues
                    .text,
            ).eq("5 + 1");
        });

        it("a position that renders, or a list, still gets a full copy", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <number name="n">5</number>
    <p name="p">$n</p>
    <mathList name="ml">$n</mathList>
    `,
            });
            expect(valueRefs(core)).toHaveLength(0);
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .text,
            ).eq("5");
            expect(
                stateVariables[await resolvePathToNodeIdx("ml")].stateValues
                    .maths[0].tree,
            ).eq(5);
        });
    },
);
