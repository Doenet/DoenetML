import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";
import { setListFormsEnabled } from "../../utils/dast/listForms";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A name or a property after a collection is the collection's own, never
 * each item's (D59, COLL-1, COLL-2; reverting D41 decision 1 for
 * collections): `numItems`, `hide`, `fixed`, `disabled` and the properties
 * the tag declares. Anything else names nothing, with `doenet-w0199` at load
 * suggesting an index (`$r.P` → `$r[1].P`), decided by the tag as written,
 * never by how many items it holds. A `<conditionalContent>` and a select
 * that picks one stand for what they show (COMP-11), and a `<group>` holding
 * one collection stands for it (COLL-3). Each document is loaded with and
 * without list forms (COMP-4), and again after a reload (DIAG-6).
 */

type Result = { texts: Record<string, string>; diagnostics: string[] };

async function load(
    doenetML: string,
    names: string[],
    { asLists = true, withMessages = false } = {},
): Promise<Result & { reloaded: () => Promise<Result> }> {
    setListFormsEnabled(asLists);
    try {
        const { core, resolvePathToNodeIdx, scoreState } = await createTestCore(
            { doenetML },
        );
        const read = async (core: any, resolvePathToNodeIdx: any) => {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const texts: Record<string, string> = {};
            for (const name of names) {
                const stateValues =
                    stateVariables[await resolvePathToNodeIdx(name)]
                        .stateValues;
                texts[name] = String(stateValues.text ?? stateValues.value);
            }
            const diagnostics = core.core.diagnostics
                .filter((d: any) => !d.code?.startsWith("doenet-a"))
                .map(
                    (d: any) =>
                        `${d.type} ${d.code}${withMessages ? `: ${d.message}` : ""}`,
                )
                .sort();
            return { texts, diagnostics };
        };
        const result = await read(core, resolvePathToNodeIdx);
        return {
            ...result,
            async reloaded() {
                setListFormsEnabled(asLists);
                try {
                    await core.saveImmediately();
                    const again = await createTestCore({
                        doenetML,
                        initialState: scoreState.state,
                    });
                    return await read(again.core, again.resolvePathToNodeIdx);
                } finally {
                    setListFormsEnabled(true);
                }
            },
        };
    } finally {
        setListFormsEnabled(true);
    }
}

/**
 * The texts of `names` and the diagnostics, the same with and without list
 * forms, and after a reload.
 */
async function both(
    doenetML: string,
    names: string[],
    options: { withMessages?: boolean } = {},
): Promise<Result> {
    const withLists = await load(doenetML, names, {
        ...options,
        asLists: true,
    });
    const composites = await load(doenetML, names, {
        ...options,
        asLists: false,
    });
    const expected = {
        texts: withLists.texts,
        diagnostics: withLists.diagnostics,
    };
    expect({
        texts: composites.texts,
        diagnostics: composites.diagnostics,
    }).eqls(expected);
    expect(await withLists.reloaded(), "after a reload").eqls(expected);
    return expected;
}

describe("A name or a property after a collection names nothing (D59)", () => {
    it("after a repeat, a select that picks several, a collect and a list, with a suggestion", async () => {
        const { texts, diagnostics } = await both(
            `<repeat name="rmix" for="1 2" valueName="v"><point name="P">($v,3)</point><text name="t">a</text></repeat>
<select name="s" numToSelect="2"><option><point name="P">(1,2)</point></option><option><point name="P">(3,4)</point></option></select>
<section name="sec"><group><point name="Q">(5,6)</point></group><group><point name="Q">(7,8)</point></group></section>
<collect name="c" from="$sec" componentType="group"/>
<pointList name="pl">(1,2) (3,4)</pointList>
<p name="p1">$rmix.P</p><p name="p2">$rmix.P.x</p><p name="p3">$rmix.t</p><p name="p4">$s.P.x</p>
<p name="p5">$c.Q</p><p name="p6">$pl.x</p><p name="p7">$rmix.x</p>`,
            ["p1", "p2", "p3", "p4", "p5", "p6", "p7"],
            { withMessages: true },
        );
        // Before (D41 decision 1): `(1, 3), (2, 3)`, `1, 2`, `a, a`, `1, 3`,
        // `(5, 6), (7, 8)`, `1, 3`, and `$rmix.x` `w0193`.
        expect(texts).eqls({
            p1: "＿",
            p2: "＿",
            p3: "＿",
            p4: "＿",
            p5: "＿",
            p6: "＿",
            p7: "＿",
        });
        expect(diagnostics).eqls([
            "warning doenet-w0199: `$c.Q` names nothing: a name after a `<collect>` does not reach into its items. To read it from one item, give its index, such as `$c[1].Q`.",
            "warning doenet-w0199: `$pl.x` names nothing: a `<pointList>` has no property `x` of its own, and a property after it does not reach into its items. To read it from one item, give its index, such as `$pl[1].x`.",
            "warning doenet-w0199: `$rmix.P.x` names nothing: a name after a `<repeat>` does not reach into its items. To read it from one item, give its index, such as `$rmix[1].P.x`.",
            "warning doenet-w0199: `$rmix.P` names nothing: a name after a `<repeat>` does not reach into its items. To read it from one item, give its index, such as `$rmix[1].P`.",
            "warning doenet-w0199: `$rmix.t` names nothing: a name after a `<repeat>` does not reach into its items. To read it from one item, give its index, such as `$rmix[1].t`.",
            "warning doenet-w0199: `$rmix.x` names nothing: a `<repeat>` has no property `x` of its own, and a property after it does not reach into its items. To read it from one item, give its index, such as `$rmix[1].x`.",
            "warning doenet-w0199: `$s.P.x` names nothing: a name after a `<select>` does not reach into its items. To read it from one item, give its index, such as `$s[1].P.x`.",
        ]);
    });

    it("written as an index, reaches the item", async () => {
        const { texts, diagnostics } = await both(
            `<repeat name="rmix" for="1 2" valueName="v"><point name="P">($v,3)</point><text name="t">a</text></repeat>
<select name="s" numToSelect="2" type="math"><option><point name="P">(1,2)</point></option><option><point name="P">(1,4)</point></option></select>
<repeat name="r" for="1 2" valueName="v"><group name="G"><math name="m">$v^2</math></group><repeat name="q" for="a b" valueName="w"><text name="t">$v$w</text></repeat></repeat>
<pointList name="pl">(1,2) (3,4)</pointList>
<p name="p1">$rmix[2].P</p><p name="p2">$rmix[1].P.x</p><p name="p3">$s[2].P.x</p>
<p name="p4">$r[2].G.m</p><p name="p5">$r[2].q[1].t</p><p name="p6">$pl[2].x</p>`,
            ["p1", "p2", "p3", "p4", "p5", "p6"],
        );
        expect(texts).eqls({
            p1: "(2, 3)",
            p2: "1",
            p3: "1",
            p4: "2²",
            p5: "2a",
            p6: "3",
        });
        expect(diagnostics).eqls([]);
    });

    it("after a collect, even for a name it holds once", async () => {
        // Before: the collected `A` built as a composite, and a blank as a
        // list form (COMP-4), with no diagnostic either way.
        const { texts, diagnostics } = await both(
            `<p name="src"><point name="A">(1,2)</point><point>(3,4)</point></p>
<collect name="c" from="$src" componentType="point"/>
<p name="p1">$c.A</p><p name="p2">$c[1].x</p>`,
            ["p1", "p2"],
            { withMessages: true },
        );
        expect(texts).eqls({ p1: "＿", p2: "1" });
        expect(diagnostics).eqls([
            "warning doenet-w0199: `$c.A` names nothing: a name after a `<collect>` does not reach into its items. To read it from one item, give its index, such as `$c[1].A`.",
        ]);
    });

    it("is decided by the tag as written, not by how many items it holds", async () => {
        const { texts, diagnostics } = await both(
            `<number name="n">1</number>
<repeat name="r" for="5" valueName="v"><point name="P">($v,3)</point></repeat>
<mathList name="ml">x</mathList>
<select name="s" numToSelect="$n"><option><point name="P">(1,2)</point></option><option><point name="P">(3,4)</point></option></select>
<p name="p1">$r.P.x</p><p name="p2">$r.numItems</p><p name="p3">$ml.x</p><p name="p4">$s.P</p><p name="p5">$P</p>`,
            ["p1", "p2", "p3", "p4", "p5"],
        );
        expect(texts).eqls({ p1: "＿", p2: "1", p3: "＿", p4: "＿", p5: "＿" });
        expect(diagnostics).eqls([
            // `numToSelect` that isn't a constant (the variants)
            "info doenet-i0023",
            "warning doenet-w0104",
            "warning doenet-w0199",
            "warning doenet-w0199",
            "warning doenet-w0199",
        ]);
    });

    it("keeps the collection's own properties", async () => {
        const { texts, diagnostics } = await both(
            `<repeat name="r" for="1 2" valueName="v" hide><point>($v,3)</point></repeat>
<select name="s" numToSelect="2" fixed><option><point>(1,2)</point></option><option><point>(3,4)</point></option></select>
<pointList name="pl">(1,2) (3,4)</pointList>
<p name="p1">$r.numItems $r.hide $r.fixed</p><p name="p2">$s.numItems $s.fixed $s.disabled</p><p name="p3">$pl.numItems $pl.numPoints</p>`,
            ["p1", "p2", "p3"],
        );
        expect(texts).eqls({
            p1: "2 true false",
            p2: "2 true false",
            p3: "2 2",
        });
        expect(diagnostics).eqls([]);
    });

    it("but a name written inside a list, a sort or a shuffle, or the one it copies, is that component", async () => {
        const { texts, diagnostics } = await both(
            `<pointList name="pl"><point name="P">(1,2)</point><point>(3,4)</point></pointList>
<pointList name="pl2" extend="$pl"/>
<sort name="so"><number name="n">3</number><number>1</number></sort>
<math name="m">x</math>
<mathList name="l"><math name="h" extend="$m"/><math name="k" copy="$m"/> 2</mathList>
<mathList name="e" extend="$l"/>
<group name="g2"><group name="r"><repeatForSequence name="r" from="1" to="2" valueName="v"><math>$v</math></repeatForSequence></group></group>
<group name="q" extend="$g2"/>
<p name="p1">$pl.P</p><p name="p2">$pl2.P.x</p><p name="p3">$so.n</p><p name="p4">$e.h $e.k</p><p name="p5">$q.r[1]</p>`,
            ["p1", "p2", "p3", "p4", "p5"],
        );
        // A name on a tag written with `extend` or `copy` in the list, and a
        // group named on the way to a collection (`$q.r`, the group `r`).
        expect(texts).eqls({
            p1: "(1, 2)",
            p2: "1",
            p3: "3",
            p4: "x x",
            p5: "1",
        });
        expect(diagnostics).eqls([]);
    });

    it("suggests the item's spelling of a name or property written in another case (#2627 item 14)", async () => {
        const { texts, diagnostics } = await both(
            `<repeat name="r" for="1 2" valueName="v"><point name="P">($v,3)</point></repeat>
<section name="sec"><point>(1,2)</point><point>(3,4)</point></section>
<collect name="c" from="$sec" componentType="point"/>
<pointList name="pl">(1,2) (3,4)</pointList>
<sequence name="s" to="3"/>
<p name="p1">$r.X</p><p name="p2">$c.X</p><p name="p3">$pl.X1</p><p name="p4">$r.p</p><p name="p5">$s.Value</p>`,
            ["p1", "p2", "p3", "p4", "p5"],
            { withMessages: true },
        );
        expect(texts).eqls({
            p1: "＿",
            p2: "＿",
            p3: "＿",
            p4: "＿",
            p5: "＿",
        });
        expect(diagnostics).eqls([
            "warning doenet-w0199: `$c.X` names nothing: a `<collect>` has no property `X` of its own, and a property after it does not reach into its items. To read it from one item, give its index, such as `$c[1].x`.",
            "warning doenet-w0199: `$pl.X1` names nothing: a `<pointList>` has no property `X1` of its own, and a property after it does not reach into its items. To read it from one item, give its index, such as `$pl[1].xs[1]`.",
            "warning doenet-w0199: `$r.X` names nothing: a `<repeat>` has no property `X` of its own, and a property after it does not reach into its items. To read it from one item, give its index, such as `$r[1].x`.",
            "warning doenet-w0199: `$r.p` names nothing: a `<repeat>` has no property `p` of its own, and a property after it does not reach into its items. To read it from one item, give its index, such as `$r[1].P`.",
            "warning doenet-w0199: `$s.Value` names nothing: a `<sequence>` has no property `Value` of its own, and a property after it does not reach into its items. To read it from one item, give its index, such as `$s[1].value`.",
        ]);
    });

    it("but an own property in another case is left for its spelling (D51)", async () => {
        const { diagnostics } = await both(
            `<repeat name="r" for="1 2" valueName="v"><point>($v,3)</point></repeat><p name="p1">$r.numitems</p>`,
            ["p1"],
        );
        expect(diagnostics).eqls(["warning doenet-w0104"]);
    });

    it("calls a property a property, though a component elsewhere has that name", async () => {
        const { texts, diagnostics } = await both(
            `<math name="x">1</math>
<pointList name="pl">(1,2) (3,4)</pointList>
<repeat name="r" for="1 2" valueName="v"><point>($v,3)</point></repeat>
<p name="p1">$pl.x</p><p name="p2">$r.x</p>`,
            ["p1", "p2"],
            { withMessages: true },
        );
        expect(texts).eqls({ p1: "＿", p2: "＿" });
        expect(diagnostics).eqls([
            "warning doenet-w0199: `$pl.x` names nothing: a `<pointList>` has no property `x` of its own, and a property after it does not reach into its items. To read it from one item, give its index, such as `$pl[1].x`.",
            "warning doenet-w0199: `$r.x` names nothing: a `<repeat>` has no property `x` of its own, and a property after it does not reach into its items. To read it from one item, give its index, such as `$r[1].x`.",
        ]);
    });

    it("after the value and index names of a repeat", async () => {
        const { texts, diagnostics } = await both(
            `<repeat name="r" for="3 5" valueName="v" indexName="i"><math name="m">$v+1</math></repeat>
<repeatForSequence name="rs" from="4" length="2" valueName="v"><math>$v</math></repeatForSequence>
<p name="p1">$r.v</p><p name="p2">$r.i</p><p name="p3">$r[2].v</p><p name="p4">$r[1].i</p><p name="p5">$rs[2].v</p>`,
            ["p1", "p2", "p3", "p4", "p5"],
        );
        // `$r.v` was `3, 5` (D41 decision 1).
        expect(texts).eqls({ p1: "＿", p2: "＿", p3: "5", p4: "1", p5: "5" });
        expect(diagnostics).eqls([
            "warning doenet-w0199",
            "warning doenet-w0199",
        ]);
    });

    it("in its own template names nothing, rather than being a cycle", async () => {
        const { texts, diagnostics } = await both(
            `<repeat name="r" for="1 2" valueName="v"><math name="m">$r.m</math></repeat>
<p name="p1">$r[1].m</p>`,
            ["p1"],
        );
        expect(texts).eqls({ p1: "＿" });
        expect(diagnostics).eqls(["warning doenet-w0199"]);
    });

    it("after a group holding only a collection, at any depth, as after the collection (COLL-3)", async () => {
        const { texts, diagnostics } = await both(
            `<repeat name="r" for="1 2 3" valueName="v"><point name="P">($v,3)</point></repeat>
<group name="g">$r</group>
<group name="h"><group><group><repeat for="4 5" valueName="v"><point name="P">($v,3)</point></repeat></group></group></group>
<group name="a">$r</group><group name="k">$a</group>
<p name="p1">$g.x</p><p name="p2">$g.P.x</p><p name="p3">$g.numItems</p><p name="p4">$h.x</p><p name="p5">$h.numItems</p>
<p name="p6">$k.x</p><p name="p7">$k.numItems</p><p name="p8">$g[2].P.x</p><p name="p9">$g</p>`,
            ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9"],
        );
        // `$g.x`, `$g.P.x`, `$h.x` and `$k.x` were each item's (D41).
        expect(texts).eqls({
            p1: "＿",
            p2: "＿",
            p3: "3",
            p4: "＿",
            p5: "2",
            p6: "＿",
            p7: "3",
            p8: "2",
            p9: "(1, 3), (2, 3), (3, 3)",
        });
        expect(diagnostics).eqls([
            "warning doenet-w0199",
            "warning doenet-w0199",
            "warning doenet-w0199",
            "warning doenet-w0199",
        ]);
    });
});

describe("A tag made from a name or a property after a collection (D59)", () => {
    it("is missing, with the warning", async () => {
        for (const source of [
            `<select name="s" numToSelect="2"><option><point>(1,2)</point></option><option><point>(3,4)</point></option></select>`,
            `<repeatForSequence name="s" length="$n" valueName="v"><point>($v,1)</point></repeatForSequence>`,
            `<pointList name="s">(1,2) (3,4)</pointList>`,
        ]) {
            for (const n of ["0", "1", "2"]) {
                const { texts, diagnostics } = await both(
                    `<number name="n">${n}</number>${source}
<point extend="$s" name="A0"/><point extend="$s.x" name="A"/><math extend="$s.x" name="B"/>
<p name="p">$A0|$A|$B</p><p name="q">$s.x</p>`,
                    ["p", "q"],
                );
                // `$s.x` on a tag was `e0064` (#2548 item 1); the tag of the
                // collection itself still is.
                expect(texts.p, source).eq("＿|＿|＿");
                expect(diagnostics, source).eqls([
                    "error doenet-e0064",
                    "warning doenet-w0199",
                    "warning doenet-w0199",
                    "warning doenet-w0199",
                ]);
            }
        }
    });
});

describe("A list's text, LaTeX and value are its entries', not its own (D59)", () => {
    it("name nothing after a list, as any entry property does", async () => {
        const { texts, diagnostics } = await both(
            `<mathList name="ml">x 2y</mathList><sequence name="s" to="3"/>
<p name="p1">$ml.value</p><p name="p2">$ml.text</p><p name="p3">$ml.latex</p><p name="p4">$s.value</p>
<math name="a" extend="$ml.value"/><p name="p5">$a</p>
<p name="p6"><text>$ml</text></p><p name="p7">$ml[2].text</p>`,
            ["p1", "p2", "p3", "p4", "p5", "p6", "p7"],
        );
        // were each entry's, read together (D41)
        expect(texts).eqls({
            p1: "＿",
            p2: "＿",
            p3: "＿",
            p4: "＿",
            p5: "＿",
            p6: "x, 2 y",
            p7: "2 y",
        });
        expect(diagnostics).eqls(Array(5).fill("warning doenet-w0199"));
    });
});

describe("A one-shown-thing tag stands for what it shows (D59 rule 2, COMP-11)", () => {
    it("a conditionalContent and a select that picks one", async () => {
        const { texts, diagnostics } = await both(
            `<select name="s"><option><point name="P">(1,2)</point></option><option><point name="P">(1,4)</point></option></select>
<select name="s1" numToSelect="1"><option><point name="P">(1,2)</point></option></select>
<conditionalContent name="cc"><case condition="true"><point name="P">(5,6)</point></case></conditionalContent>
<math extend="$s.x" name="A"/><math extend="$cc.x" name="B"/>
<p name="p">$A $B</p><p name="q">$s.P.x $s1.P.x $cc.P.x $cc.x $s.numItems</p>`,
            ["p", "q"],
        );
        expect(texts).eqls({ p: "1 5", q: "1 1 5 5 1" });
        expect(diagnostics).eqls([]);
    });

    it("follows the case each item shows, read through an index", async () => {
        // Both builds, live and after a reload.
        const doenetML = `<booleanInput name="b" prefill="true"/>
<repeat name="r" for="1 2" valueName="v"><conditionalContent><case condition="$b"><point name="P">($v,1)</point></case><else><point name="P">($v,5)</point></else></conditionalContent></repeat>
<p name="p1">$r[1].P.y</p><p name="p2">$r[2].P</p>`;
        for (const asLists of [true, false]) {
            setListFormsEnabled(asLists);
            try {
                const { core, resolvePathToNodeIdx, scoreState } =
                    await createTestCore({ doenetML });
                const read = async (core: any, resolve: any) => {
                    const stateVariables = await core.returnAllStateVariables(
                        false,
                        true,
                    );
                    return Promise.all(
                        ["p1", "p2"].map(
                            async (name) =>
                                stateVariables[await resolve(name)].stateValues
                                    .text,
                        ),
                    );
                };
                expect(await read(core, resolvePathToNodeIdx)).eqls([
                    "1",
                    "(2, 1)",
                ]);
                await updateBooleanInputValue({
                    boolean: false,
                    componentIdx: await resolvePathToNodeIdx("b"),
                    core,
                });
                expect(await read(core, resolvePathToNodeIdx)).eqls([
                    "5",
                    "(2, 5)",
                ]);
                await core.saveImmediately();
                const reloaded = await createTestCore({
                    doenetML,
                    initialState: scoreState.state,
                });
                expect(
                    await read(reloaded.core, reloaded.resolvePathToNodeIdx),
                ).eqls(await read(core, resolvePathToNodeIdx));
                expect(
                    core.core!.diagnostics.filter(
                        (d: any) => !d.code?.startsWith("doenet-a"),
                    ),
                ).eqls([]);
            } finally {
                setListFormsEnabled(true);
            }
        }
    });
});

describe("An index then a property past the items whose count follows an input (#2548 item 7)", () => {
    it("gives the same information live as after a reload", async () => {
        const doenetML = `<mathInput name="n" prefill="2"/>
<repeatForSequence name="r" length="$n" valueName="v"><point>($v,1)</point></repeatForSequence>
<p name="p">$r[1].x</p>`;
        const { core, resolvePathToNodeIdx, scoreState } = await createTestCore(
            { doenetML },
        );
        const codes = () =>
            core
                .core!.diagnostics.filter(
                    (d: any) => !d.code?.startsWith("doenet-a"),
                )
                .map((d: any) => `${d.type} ${d.code}`);
        expect(codes()).eqls([]);
        const set = async (latex: string) =>
            updateMathInputValue({
                latex,
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });
        await set("0");
        // There was none live, and an info after a reload.
        expect(codes()).eqls(["info doenet-w0181"]);
        await core.saveImmediately();
        const reloaded = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        });
        expect(
            reloaded.core
                .core!.diagnostics.filter(
                    (d: any) => !d.code?.startsWith("doenet-a"),
                )
                .map((d: any) => `${d.type} ${d.code}`),
        ).eqls(["info doenet-w0181"]);
        await set("2");
        expect(codes()).eqls([]);
    });
});
