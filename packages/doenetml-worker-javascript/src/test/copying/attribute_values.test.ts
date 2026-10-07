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
 * today: a literal `displayDigits="5"` is an `integer` component, and a
 * reference to a prop that is not a bare reference (`<math extend="$P.x"
 * simplify/>`) carries "shadow" attribute components for the display
 * settings of its source. Stream B replaces those components with values
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
    <mathInput name="k" prefill="4" />
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
            expect(await texts()).eqls(["1.235", "1.2346", "1.235", "1.2"]);

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
    <point name="P" displayDigits="4">(1.23456,2)</point>
    <math extend="$P.x" name="c" />
    <math extend="$P.x" name="a" displayDigits="5" />
    <math extend="$P.x" name="b" displayDecimals="1" />
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
            expect((await sv("c")).text).eq("1.235");
            expect((await sv("c")).displayDigits).eq(4);
            // an attribute on the prop reference itself beats the one it
            // takes from P, and displayDecimals displaces displayDigits
            expect((await sv("a")).text).eq("1.2346");
            expect((await sv("a")).displayDigits).eq(5);
            expect((await sv("b")).text).eq("1.2");
            expect((await sv("b")).displayDecimals).eq(1);
            // an attribute on a later link beats what `c` took from P
            expect((await sv("d")).text).eq("1.2346");
            expect((await sv("d")).displayDigits).eq(5);
            expect((await sv("e")).text).eq("1.2");
            expect((await sv("e")).displayDecimals).eq(1);
            // and a link without one passes on what it has
            expect((await sv("f")).text).eq("1.235");
            expect((await sv("g")).text).eq("1.2");
            expect((await sv("g")).displayDecimals).eq(1);
        });

        it("a prop reference's fixed: its own attribute, else fixed when its source or where it sits is", async () => {
            // The rule for every linked reference (Doenet/DoenetML#2230),
            // which stream B must keep for prop references: a `fixed` written
            // on the reference decides; otherwise it is fixed when its source
            // is or where it sits is (a fixed parent, or a fixed `<group>`
            // around it). A `fixed="false"` on the source does not undo a
            // fixed parent of the reference.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <point name="P">(1,2)</point>
    <point name="Q" fixed>(3,4)</point>
    <point name="R" fixed="false">(5,6)</point>
    <math name="m">y</math>
    <math name="mf" fixed>y</math>
    <math name="mu" fixed="false">y</math>
    <p fixed>
        <math extend="$P.x" name="a" />
        <math extend="$R.x" name="c" />
        <math extend="$m.value" name="d" />
        <math extend="$mf.value" name="e" />
        <math extend="$mu.value" name="f" />
        <math extend="$m.value" name="o" fixed="false" />
        <math extend="$P.x" name="op" fixed="false" />
        <math name="z">x</math>
    </p>
    <group fixed>
        <math extend="$P.x" name="ga" />
        <math extend="$Q.x" name="gb" />
        <math extend="$R.x" name="gc" />
        <math extend="$m.value" name="gd" />
        <math extend="$mf.value" name="ge" />
        <math extend="$P.x" name="go" fixed="false" />
    </group>
    <math extend="$P.x" name="na" />
    <math extend="$Q.x" name="nb" />
    <math extend="$m.value" name="nd" />
    <math extend="$mf.value" name="ne" />
    <math extend="$mu.value" name="nf" />
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const fixed = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .fixed;

            // under a fixed `<p>`, whatever the source's `fixed`
            expect(await fixed("z")).eq(true);
            expect(await fixed("a")).eq(true);
            expect(await fixed("c")).eq(true);
            expect(await fixed("d")).eq(true);
            expect(await fixed("e")).eq(true);
            expect(await fixed("f")).eq(true);
            // unless the reference writes its own
            expect(await fixed("o")).eq(false);
            expect(await fixed("op")).eq(false);

            // under a fixed `<group>`, the same
            expect(await fixed("ga")).eq(true);
            expect(await fixed("gb")).eq(true);
            expect(await fixed("gc")).eq(true);
            expect(await fixed("gd")).eq(true);
            expect(await fixed("ge")).eq(true);
            expect(await fixed("go")).eq(false);

            // under no fixed parent, the source decides
            expect(await fixed("na")).eq(false);
            expect(await fixed("nb")).eq(true);
            expect(await fixed("nd")).eq(false);
            expect(await fixed("ne")).eq(true);
            expect(await fixed("nf")).eq(false);
        });

        it("an unlinked copy of a prop reference keeps the display settings it showed", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="k" prefill="4" />
    <point name="P" displayDigits="$k">(1.23456,2)</point>
    <math extend="$P.x" name="c" />
    <math copy="$c" name="u" />
    <math copy="$c" name="v" displayDigits="5" />
    `,
            });
            async function sv(name: string) {
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                return stateVariables[await resolvePathToNodeIdx(name)]
                    .stateValues;
            }

            expect((await sv("u")).text).eq("1.235");
            expect((await sv("u")).displayDigits).eq(4);
            expect((await sv("v")).text).eq("1.2346");

            // `u` keeps the digits `c` showed when it was copied: when P's
            // digits change, `c` follows and `u` does not. A copy of a
            // reference pastes what the reference is linked to, here P's `x`,
            // a value with no DoenetML of its own, so the copy holds how it
            // was shown, as it holds the value. (A copy of P itself pastes
            // P's `displayDigits="$k"` and follows `k`.)
            await updateMathInputValue({
                latex: "2",
                componentIdx: await resolvePathToNodeIdx("k"),
                core,
            });
            expect((await sv("c")).text).eq("1.2");
            expect((await sv("u")).text).eq("1.235");
            expect((await sv("u")).displayDigits).eq(4);
            expect((await sv("v")).text).eq("1.2346");
        });

        it("an unlinked copy of a prop reference keeps display settings its source has by default", async () => {
            // `mi`'s ten digits are its default, so `miv`'s `displayDigits`
            // used a default and its value is not copied as essential state:
            // `u` keeps the ten digits only through the attribute it takes
            // from `miv`, not a math's default three
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="mi" prefill="1.23456789" />
    <math extend="$mi.value" name="miv" />
    <math copy="$miv" name="u" />
    `,
            });
            async function texts() {
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                return Promise.all(
                    ["miv", "u"].map(
                        async (name) =>
                            stateVariables[await resolvePathToNodeIdx(name)]
                                .stateValues.text,
                    ),
                );
            }

            expect(await texts()).eqls(["1.23456789", "1.23456789"]);

            await updateMathInputValue({
                latex: "9.87654321",
                componentIdx: await resolvePathToNodeIdx("mi"),
                core,
            });
            expect(await texts()).eqls(["9.87654321", "1.23456789"]);
        });

        it("other references with shadow attributes follow their source's display settings", async () => {
            // Three more of the places that make shadow attribute components
            // (B3 replaces them). `$P.xs` in a paragraph is a list whose
            // display settings shadow P's. `$pg.vertex1` is an entry of an
            // array wrapped in a point, whose display settings go on the
            // point. `$n.value` in the group is a value reference, and
            // `$g[1]` names it, so `a` and `b` are made from the reference
            // itself (`ValueRef.serialize`).
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="k" prefill="4" />
    <point name="P" displayDigits="$k">(1.23456,2.34567)</point>
    <p name="xs">$P.xs</p>
    <polygon name="pg" vertices="(1.23456,2.34567) (3,4) (5,6)" displayDigits="$k" />
    <p name="v">$pg.vertex1</p>
    <number name="n" displayDigits="$k">1.23456</number>
    <p><group name="g">$n.value</group></p>
    <number extend="$g[1]" name="a" />
    <number copy="$g[1]" name="b" />
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
                    await text("xs"),
                    await text("v"),
                    await text("a"),
                    await text("b"),
                ];
            }

            // four digits, not a number's default three, so that `b` keeping
            // them is told apart from `b` having no display settings
            expect(await texts()).eqls([
                "1.235, 2.346",
                "(1.235, 2.346)",
                "1.235",
                "1.235",
            ]);

            // the list, the vertex and the extend follow the digits; the
            // unlinked copy keeps the ones it showed
            await updateMathInputValue({
                latex: "2",
                componentIdx: await resolvePathToNodeIdx("k"),
                core,
            });
            expect(await texts()).eqls([
                "1.2, 2.3",
                "(1.2, 2.3)",
                "1.2",
                "1.235",
            ]);
        });

        it("a literal attribute is read as its type", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <number name="a" displayDigits="2+2">1.23456</number>
    <number name="b" displayDigits="bad">1.23456</number>
    <number name="c" displayDigits=" 4 ">1.23456</number>
    <number name="d" displayDigits="4.6">1.23456</number>
    <math name="s" simplify>x+x</math>
    <math name="t" simplify="nonsense">x+x</math>
    <text name="h" hide="TRUE">hidden</text>
    <math name="ma" splitSymbols="false" assumptions="xy > 0">xy</math>
    <math name="mb" assumptions="xy > 0">xy</math>
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const sv = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;

            // (values other than 3, a number's default displayDigits, so that
            // an attribute that is ignored is told apart)
            // a number-valued attribute evaluates its text as math
            expect((await sv("a")).displayDigits).eq(4);
            expect((await sv("a")).text).eq("1.235");
            // text that is not a number gives NaN, and no rounding
            expect((await sv("b")).displayDigits).toBeNaN();
            expect((await sv("b")).text).eq("1.23456");
            expect((await sv("c")).displayDigits).eq(4);
            // an integer attribute rounds
            expect((await sv("d")).displayDigits).eq(5);
            // an attribute with no value takes the attribute's value for true
            expect((await sv("s")).simplify).eq("full");
            expect((await sv("s")).text).eq("2 x");
            // a value outside the valid ones falls back to the default
            expect((await sv("t")).simplify).eq("none");
            expect((await sv("t")).text).eq("x + x");
            expect((await sv("h")).hidden).eq(true);
            // a math attribute is parsed with its owner's splitSymbols
            expect((await sv("ma")).assumptions.tree).eqls([">", "xy", 0]);
            expect((await sv("mb")).assumptions.tree).eqls([
                ">",
                ["*", "x", "y"],
                0,
            ]);
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

        it("a copy of a group holding a prop reference shows the settings its own source has", async () => {
            // The prop reference's display settings come from its source. A
            // linked copy of the group shows the original's; an unlinked copy
            // has a source of its own (its own `Q`, with its own `k`), whose
            // settings it follows.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <group name="g">
        <mathInput name="k" prefill="3" />
        <point name="Q" displayDigits="$k">(1.23456,2)</point>
        <math extend="$Q.x" name="c" />
    </group>
    <group extend="$g" name="g2" />
    <group copy="$g" name="g3" />
    `,
            });
            async function texts() {
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                return Promise.all(
                    ["g.c", "g2.c", "g3.c"].map(
                        async (name) =>
                            stateVariables[await resolvePathToNodeIdx(name)]
                                .stateValues.text,
                    ),
                );
            }
            expect(await texts()).eqls(["1.23", "1.23", "1.23"]);

            await updateMathInputValue({
                latex: "5",
                componentIdx: await resolvePathToNodeIdx("g.k"),
                core,
            });
            expect(await texts()).eqls(["1.2346", "1.2346", "1.23"]);

            await updateMathInputValue({
                latex: "2",
                componentIdx: await resolvePathToNodeIdx("g3.k"),
                core,
            });
            expect(await texts()).eqls(["1.2346", "1.2346", "1.2"]);
        });

        it("an unlinked copy's attributes made from a prop reference's values have no source", async () => {
            // `u` gets an attribute component holding each value `c` reads
            // from P; made from a value, it is an unlinked copy of nothing
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <point name="P" displayDigits="4">(1.23456,2)</point>
    <math extend="$P.x" name="c" simplify />
    <math copy="$c" name="u" />
    `,
            });
            const u = (core as any).core._components[
                await resolvePathToNodeIdx("u")
            ];
            const displayDigits = u.attributes.displayDigits.component;
            expect(await displayDigits.stateValues.value).eq(4);
            expect(displayDigits.unlinkedCopySource).eq(undefined);
            expect(await u.stateValues.text).eq("1.235");
        });

        it("a write to a literal attribute reaches the copies that read it, not one with its own", async () => {
            const doenetML = `
    <text name="t" hide="false">a</text>
    <text extend="$t" name="c" />
    <text extend="$t" name="d" hide="false" />
    <booleanInput name="b" bindValueTo="$t.hide" />
    <graph name="g" xMin="-4" xMax="6" />
    <updateValue name="uv" target="$g.xScale" newValue="20" type="number" />
    `;
            const first = await createTestCore({ doenetML });
            const r = first.resolvePathToNodeIdx;
            async function values(core: any, resolve: typeof r) {
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                const sv = async (name: string) =>
                    stateVariables[await resolve(name)].stateValues;
                return [
                    (await sv("t")).hidden,
                    (await sv("c")).hidden,
                    (await sv("d")).hidden,
                    (await sv("g")).xMin,
                    (await sv("g")).xMax,
                ];
            }
            expect(await values(first.core, r)).eqls([
                false,
                false,
                false,
                -4,
                6,
            ]);

            await updateBooleanInputValue({
                boolean: true,
                componentIdx: await r("b"),
                core: first.core,
            });
            // two literal attributes written in one update both change
            await first.core.requestAction({
                componentIdx: await r("uv"),
                actionName: "updateValue",
                args: {},
            });
            expect(await values(first.core, r)).eqls([
                true,
                true,
                false,
                -9,
                11,
            ]);

            await first.core.saveImmediately();
            const second = await createTestCore({
                doenetML,
                initialState: first.scoreState.state as string,
            });
            expect(await values(second.core, second.resolvePathToNodeIdx)).eqls(
                [true, true, false, -9, 11],
            );
        });

        it("an unlinked copy of a repeat takes a write to a boolean literal in an iterate", async () => {
            // The iterates of an unlinked copy take the essential state of
            // the source's iterates: a write to a boolean, but not one to a
            // number written as text, which the attribute component kept in
            // its text child.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <repeat name="r" for="1 2" valueName="v"><text name="t" hide="false">$v</text><graph name="g" xMin="-3" /></repeat>
    <booleanInput name="b" bindValueTo="$r[1].t.hide" />
    <updateValue name="u" target="$r[1].g.xMin" newValue="-9" type="number" />
    <booleanInput name="show" />
    <conditionalContent condition="$show" name="cc">
        <repeat copy="$r" name="rc" />
    </conditionalContent>
    `,
            });
            await updateBooleanInputValue({
                boolean: true,
                componentIdx: await resolvePathToNodeIdx("b"),
                core,
            });
            await core.requestAction({
                componentIdx: await resolvePathToNodeIdx("u"),
                actionName: "updateValue",
                args: {},
            });
            await updateBooleanInputValue({
                boolean: true,
                componentIdx: await resolvePathToNodeIdx("show"),
                core,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const sv = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;
            expect([
                (await sv("r[1].g")).xMin,
                (await sv("cc.rc[1].t")).hidden,
                (await sv("cc.rc[2].t")).hidden,
                (await sv("cc.rc[1].g")).xMin,
            ]).eqls([-9, true, false, -3]);
        });

        it("a write to a literal attribute is not refused by its owner's modifyIndirectly", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <point name="P" draggable="true" modifyIndirectly="false">(1,2)</point>
    <updateValue name="u" target="$P.draggable" newValue="false" type="boolean" />
    `,
            });
            await core.requestAction({
                componentIdx: await resolvePathToNodeIdx("u"),
                actionName: "updateValue",
                args: {},
            });
            expect(
                (await core.returnAllStateVariables(false, true))[
                    await resolvePathToNodeIdx("P")
                ].stateValues.draggable,
            ).eq(false);
        });

        it("a write to a text literal that is not text is ignored", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <textInput name="ti" prefill="abc" />
    <updateValue name="u1" target="$ti.prefill" newValue="5" type="number" />
    <updateValue name="u2" target="$ti.prefill" newValue="zz" type="text" />
    `,
            });
            const prefill = async () =>
                (await core.returnAllStateVariables(false, true))[
                    await resolvePathToNodeIdx("ti")
                ].stateValues.prefill;
            const update = async (name: string) =>
                core.requestAction({
                    componentIdx: await resolvePathToNodeIdx(name),
                    actionName: "updateValue",
                    args: {},
                });
            await update("u1");
            expect(await prefill()).eq("abc");
            await update("u2");
            expect(await prefill()).eq("zz");
            await update("u1");
            expect(await prefill()).eq("zz");
        });

        it("an unlinked copy of a variable takes the literal attributes it shadows, with a write", async () => {
            // `<math copy="$m.value"/>` takes `simplify` and `expand` from
            // the math (`attributesToShadow`); with no link to it, it has
            // its own copy of each, which a later write to the math's does
            // not reach.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <math name="m" simplify="full" expand="false">(x+1)^2+x</math>
    <updateValue name="u1" target="$m.expand" newValue="true" type="boolean" />
    <updateValue name="u2" target="$m.simplify" newValue="none" type="text" />
    <booleanInput name="show" />
    <conditionalContent condition="$show" name="cc">
        <math copy="$m.value" name="mc" />
    </conditionalContent>
    `,
            });
            const update = async (name: string) =>
                core.requestAction({
                    componentIdx: await resolvePathToNodeIdx(name),
                    actionName: "updateValue",
                    args: {},
                });
            await update("u1");
            await updateBooleanInputValue({
                boolean: true,
                componentIdx: await resolvePathToNodeIdx("show"),
                core,
            });
            await update("u2");
            const mc = (await core.returnAllStateVariables(false, true))[
                await resolvePathToNodeIdx("cc.mc")
            ].stateValues;
            expect([mc.simplify, mc.expand]).eqls(["full", true]);
        });

        it("a write to a literal attribute is refused by its owner's fixed, also through a copy that is not fixed", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <text name="t" fixed hide="false">a</text>
    <text extend="$t" name="c" fixed="false" />
    <updateValue name="u1" target="$c.hide" newValue="true" type="boolean" />
    <graph name="g" fixed xMin="-4" />
    <graph extend="$g" name="h" fixed="false" />
    <updateValue name="u2" target="$h.xMin" newValue="-8" type="number" />
    `,
            });
            for (const name of ["u1", "u2"]) {
                await core.requestAction({
                    componentIdx: await resolvePathToNodeIdx(name),
                    actionName: "updateValue",
                    args: {},
                });
            }
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const sv = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;
            expect([
                (await sv("t")).hidden,
                (await sv("c")).hidden,
                (await sv("g")).xMin,
                (await sv("h")).xMin,
            ]).eqls([false, false, -4, -4]);
        });

        it("a copy of a repeat whose iterations reference a prop or a list entry shows what the source's iterations show", async () => {
            // Each iteration's `a` and `b` take their display settings, and
            // `b` its `hide`, from what they reference. The copies of the
            // repeat, made at the start and later in a conditionalContent,
            // show what the source's iterations show, as the settings and
            // `hide` change. (Their `fixed` is not pinned: a reference to a
            // list entry does not take the entry source's, #2239.)
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="k" prefill="4" />
    <booleanInput name="h" />
    <point name="P" displayDigits="$k">(1.23456,2)</point>
    <p name="src"><math displayDigits="$k" hide="$h">2.34567</math><math>3.45678</math></p>
    <collect name="col" componentType="math" from="$src" />
    <repeatForSequence name="r" from="1" to="2" indexName="i">
      <math extend="$P.x" simplify name="a" />
      <math extend="$col[$i]" simplify name="b" />
      <graph><point>($i, 1)</point></graph>
    </repeatForSequence>
    <repeatForSequence copy="$r" name="cr" />
    <booleanInput name="show" />
    <conditionalContent name="cc" condition="$show"><repeatForSequence copy="$r" name="cr2" /></conditionalContent>
    `,
            });
            async function shown(repeat: string) {
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                const result: any[] = [];
                for (const name of ["[1].a", "[1].b", "[2].b"]) {
                    const sv =
                        stateVariables[
                            await resolvePathToNodeIdx(repeat + name)
                        ].stateValues;
                    result.push([sv.text, sv.displayDigits, sv.hidden]);
                }
                return result;
            }

            const initial = [
                ["1.235", 4, false],
                ["2.346", 4, false],
                ["3.46", 3, false],
            ];
            expect(await shown("r")).eqls(initial);
            expect(await shown("cr")).eqls(initial);

            await updateMathInputValue({
                latex: "2",
                componentIdx: await resolvePathToNodeIdx("k"),
                core,
            });
            await updateBooleanInputValue({
                boolean: true,
                componentIdx: await resolvePathToNodeIdx("h"),
                core,
            });
            await updateBooleanInputValue({
                boolean: true,
                componentIdx: await resolvePathToNodeIdx("show"),
                core,
            });
            const changed = [
                ["1.2", 2, false],
                ["2.3", 2, true],
                ["3.46", 3, false],
            ];
            expect(await shown("r")).eqls(changed);
            expect(await shown("cr")).eqls(changed);
            expect(await shown("cc.cr2")).eqls(changed);
        });

        it("what each attribute construct creates", async () => {
            // Stream B's targets, by step: a literal `anchor` loses its point,
            // mathList and two maths (B1b). A literal `displayDigits` has lost
            // its `integer` (B1a), and a prop reference its five shadow
            // attribute components (B3).
            async function census(doenetML: string) {
                const { core } = await createTestCore({ doenetML });
                return censusOfCore(core);
            }

            const literal = await census(
                `<number name="n">5</number><math displayDigits="5">3.123456x</math>`,
            );
            // the literal `displayDigits` is a value, not an `integer` (B1a)
            expect(literal.byType).eqls({
                document: 1,
                number: 1,
                math: 1,
            });
            expect(literal.attributeComponents).eq(0);

            // so are the literals a copy writes on itself, converted when
            // the copy is (`convertUnresolvedAttributesForComponentType`);
            // `fixed` keeps its component (`ignoreParentFixed`)
            const copyOwn = await census(
                `<text name="t">a</text><text extend="$t" hide /><number copy="$t.value" displayDigits="2" />`,
            );
            expect(copyOwn.attributeComponents).eq(0);
            expect(
                (await census(`<text fixed>a</text>`)).attributeComponents,
            ).eq(1);

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

            // an extend with nothing else on it is a bare reference (`_ref`),
            // which makes no attribute components; one with an attribute of
            // its own makes a copy with shadow attribute components
            const bareReference = await census(
                `<point name="P" displayDigits="3">(1.23456,2)</point><math extend="$P.x"/>`,
            );
            expect(bareReference.byType).eqls({
                document: 1,
                point: 1,
                math: 2,
                mathList: 1,
                _ref: 1,
            });
            // the mathList of the point's coordinates; the point's literal
            // displayDigits is a value (B1a)
            expect(bareReference.attributeComponents).eq(1);

            const propReference = await census(
                `<point name="P" displayDigits="3">(1.23456,2)</point><math extend="$P.x" simplify/>`,
            );
            expect(propReference.byType).eqls({
                document: 1,
                point: 1,
                math: 3,
                mathList: 1,
                _copy: 1,
            });
            // the mathList of the point's coordinates; the point's literal
            // displayDigits and the reference's literal simplify are values
            // (B1a), and the five attributes the reference takes from P are
            // references to P's variables (B3)
            expect(propReference.attributeComponents).eq(1);
        });
    },
);
