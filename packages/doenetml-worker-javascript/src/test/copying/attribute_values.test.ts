import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    moveMath,
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";
import { censusOfCore } from "../perf/census";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * Attributes as values (Doenet/DoenetML#2129). An attribute is a component
 * today: a literal `displayDigits="5"` is an `integer` component, and a copy
 * of a prop carries "shadow" attribute components for the display settings
 * and `fixed` of its source. Stream B replaces those components with values
 * held in the attribute slot.
 *
 * These tests pin what authors see before that change: which attribute wins
 * along a chain of references, what `fixed` a prop reference has, what an
 * unlinked copy keeps, how a literal is parsed, and that a reader's write to
 * an attribute (a toggled `hide`, a dragged `anchor`) is kept and restored.
 * The census reads the JavaScript core's internals, so the suite does not run
 * on the Rust core.
 */
describe.skipIf(process.env.DOENET_TEST_CORE === "rust")(
    "Attribute values @group1",
    () => {
        it("an attribute written on an extend beats the one it would take from the referent", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="k" prefill="3" />
    <number name="n" displayDigits="$k">1.234567</number>
    <number extend="$n" name="c" displayDigits="5" />
    <number extend="$n" name="d" />
    <number extend="$n" name="e" displayDecimals="1" />
    `,
            });
            async function texts() {
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                const text = async (name: string) =>
                    stateVariables[await resolvePathToNodeIdx(name)].stateValues
                        .text;
                return [
                    await text("n"),
                    await text("c"),
                    await text("d"),
                    await text("e"),
                ];
            }

            // `c` keeps its own digits; `e`'s own displayDecimals displaces
            // the displayDigits it would inherit
            expect(await texts()).eqls(["1.23", "1.2346", "1.23", "1.2"]);

            // only the copy that takes its digits from `n` follows `k`
            await updateMathInputValue({
                latex: "2",
                componentIdx: await resolvePathToNodeIdx("k"),
                core,
            });
            expect(await texts()).eqls(["1.2", "1.2346", "1.2", "1.2"]);
        });

        it("along a chain of extends of a prop reference, each link's own attribute wins", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <point name="P" displayDigits="3">(1.23456,2)</point>
    <math extend="$P.x" name="c" />
    <math extend="$c" name="d" displayDigits="5" />
    <math extend="$c" name="e" displayDecimals="1" />
    <math extend="$c" name="f" />
    <math extend="$e" name="g" />
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const sv = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;

            // `c` takes P's digits through the prop reference
            expect((await sv("c")).text).eq("1.23");
            expect((await sv("c")).displayDigits).eq(3);
            // an attribute on a later link beats what `c` took from P
            expect((await sv("d")).text).eq("1.2346");
            expect((await sv("d")).displayDigits).eq(5);
            expect((await sv("e")).text).eq("1.2");
            expect((await sv("e")).displayDecimals).eq(1);
            // and a link without one passes on what it has
            expect((await sv("f")).text).eq("1.23");
            expect((await sv("g")).text).eq("1.2");
            expect((await sv("g")).displayDecimals).eq(1);
        });

        it("a prop reference takes its source's fixed, inside a fixed group as well", async () => {
            // Today's behavior, which stream B must keep: the shadow `fixed`
            // a prop reference carries from its source decides, so `a` is not
            // fixed although its group is.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <point name="P">(1,2)</point>
    <point name="Q" fixed>(3,4)</point>
    <point name="R" fixed="false">(5,6)</point>
    <group fixed>
        <math extend="$P.x" name="a" />
        <math extend="$Q.x" name="b" />
        <math extend="$R.x" name="c" />
    </group>
    <math extend="$P.x" name="d" />
    <math extend="$Q.x" name="e" />
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const fixed = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .fixed;

            expect(await fixed("a")).eq(false);
            expect(await fixed("b")).eq(true);
            expect(await fixed("c")).eq(false);
            expect(await fixed("d")).eq(false);
            expect(await fixed("e")).eq(true);
        });

        it("an unlinked copy of a prop reference keeps the display settings it showed", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <point name="P" displayDigits="3">(1.23456,2)</point>
    <math extend="$P.x" name="c" />
    <math copy="$c" name="u" />
    <math copy="$c" name="v" displayDigits="5" />
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const sv = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;

            expect((await sv("u")).text).eq("1.23");
            expect((await sv("u")).displayDigits).eq(3);
            expect((await sv("v")).text).eq("1.2346");
        });

        it("a literal attribute is read as its type", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <number name="a" displayDigits="2+1">1.23456</number>
    <number name="b" displayDigits="bad">1.23456</number>
    <number name="c" displayDigits=" 4 ">1.23456</number>
    <number name="d" displayDigits="2.6">1.23456</number>
    <math name="s" simplify>x+x</math>
    <math name="t" simplify="nonsense">x+x</math>
    <text name="h" hide="TRUE">hidden</text>
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const sv = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;

            // a number-valued attribute evaluates its text as math
            expect((await sv("a")).displayDigits).eq(3);
            expect((await sv("a")).text).eq("1.23");
            // text that is not a number gives NaN, and no rounding
            expect((await sv("b")).displayDigits).toBeNaN();
            expect((await sv("b")).text).eq("1.23456");
            expect((await sv("c")).displayDigits).eq(4);
            // an integer attribute rounds
            expect((await sv("d")).displayDigits).eq(3);
            // an attribute with no value takes the attribute's value for true
            expect((await sv("s")).simplify).eq("full");
            expect((await sv("s")).text).eq("2 x");
            // a value outside the valid ones falls back to the default
            expect((await sv("t")).simplify).eq("none");
            expect((await sv("t")).text).eq("x + x");
            expect((await sv("h")).hidden).eq(true);
        });

        it("a reader's write to a literal attribute is kept and restored", async () => {
            const doenetML = `
    <text name="t1" hide="false">a</text>
    <text name="t2">b</text>
    <text name="t3" hide>c</text>
    <booleanInput name="b1" bindValueTo="$t1.hide" />
    <booleanInput name="b2" bindValueTo="$t2.hide" />
    <booleanInput name="b3" bindValueTo="$t3.hide" />
    `;
            const first = await createTestCore({ doenetML });
            async function hiddens(
                core: any,
                resolvePathToNodeIdx: (name: string) => Promise<number>,
            ) {
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                return [
                    stateVariables[await resolvePathToNodeIdx("t1")].stateValues
                        .hidden,
                    stateVariables[await resolvePathToNodeIdx("t2")].stateValues
                        .hidden,
                    stateVariables[await resolvePathToNodeIdx("t3")].stateValues
                        .hidden,
                ];
            }
            expect(await hiddens(first.core, first.resolvePathToNodeIdx)).eqls([
                false,
                false,
                true,
            ]);

            // a literal `hide`, an absent one, and one with no value
            for (const [input, boolean] of [
                ["b1", true],
                ["b2", true],
                ["b3", false],
            ] as const) {
                await updateBooleanInputValue({
                    boolean,
                    componentIdx: await first.resolvePathToNodeIdx(input),
                    core: first.core,
                });
            }
            expect(await hiddens(first.core, first.resolvePathToNodeIdx)).eqls([
                true,
                true,
                false,
            ]);

            await first.core.saveImmediately();
            const saved = first.scoreState.state as string;
            const second = await createTestCore({
                doenetML,
                initialState: saved,
            });
            expect(
                await hiddens(second.core, second.resolvePathToNodeIdx),
            ).eqls([true, true, false]);
        });

        it("a dragged literal anchor is kept and restored", async () => {
            const doenetML = `<graph><math name="m" anchor="(1,2)" draggable>x</math></graph>`;
            const first = await createTestCore({ doenetML });
            const mIdx = await first.resolvePathToNodeIdx("m");
            let stateVariables = await first.core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables[mIdx].stateValues.anchor.toString()).eq(
                "(1, 2)",
            );

            await moveMath({
                componentIdx: mIdx,
                x: 3,
                y: -5,
                core: first.core,
            });
            stateVariables = await first.core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables[mIdx].stateValues.anchor.toString()).eq(
                "(3, -5)",
            );

            await first.core.saveImmediately();
            const second = await createTestCore({
                doenetML,
                initialState: first.scoreState.state as string,
            });
            stateVariables = await second.core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await second.resolvePathToNodeIdx("m")
                ].stateValues.anchor.toString(),
            ).eq("(3, -5)");
        });

        it("what each attribute construct creates", async () => {
            // Stream B's targets, by step: a literal `displayDigits` loses its
            // `integer` (B1a), a literal `anchor` its point, mathList and two
            // maths (B1b), and a prop reference its five shadow attribute
            // components (B3).
            async function census(doenetML: string) {
                const { core } = await createTestCore({ doenetML });
                return censusOfCore(core);
            }

            const literal = await census(
                `<number name="n">5</number><math displayDigits="5">3.123456x</math>`,
            );
            expect(literal.byType).eqls({
                document: 1,
                number: 1,
                math: 1,
                integer: 1,
            });
            expect(literal.attributeComponents).eq(1);

            const anchored = await census(
                `<graph><math anchor="(1,2)">x</math></graph>`,
            );
            expect(anchored.byType).eqls({
                document: 1,
                graph: 1,
                _dynamicChildren: 1,
                math: 3,
                mathList: 1,
                point: 1,
            });
            // the anchor's point, and the mathList of its coordinates
            expect(anchored.attributeComponents).eq(2);

            const propReference = await census(
                `<point name="P" displayDigits="3">(1.23456,2)</point><math extend="$P.x"/>`,
            );
            expect(propReference.byType).eqls({
                document: 1,
                point: 1,
                math: 3,
                mathList: 1,
                _copy: 1,
                integer: 3,
                number: 1,
                boolean: 2,
            });
            // the point's literal displayDigits, its coordinates' mathList,
            // and the reference's five shadow attribute components
            expect(propReference.attributeComponents).eq(7);
        });
    },
);
