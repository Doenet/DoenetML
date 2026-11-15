import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateBooleanInputValue } from "../utils/actions";
import { setListFormsEnabled } from "../../utils/dast/listForms";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A name or a property after a collection reaches into each item (D41
 * decision 1, COLL-1, COLL-2): `$r.P` is the `P` of every iteration, never
 * one iteration's alone (NAME-3), and `$s.P.x` each pick's `P`'s x. A name
 * after a select that picks several is held to the every-option rule
 * (COMP-11). A property an item lacks gives a blank there, with the warning
 * decided at load (#2452), and a property after a repeat whose template
 * holds several names nothing, decided at load from the template (#2548
 * item 3). Each document is loaded with and without list forms (COMP-4),
 * and again after a reload (DIAG-6).
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

describe("A name after a collection applies to each item (D41 decision 1)", () => {
    it("after a repeat whose template holds several, and a select that picks several", async () => {
        const { texts, diagnostics } = await both(
            `<repeat name="rmix" for="1 2" valueName="v"><point name="P">($v,3)</point><text name="t">a</text></repeat>
<select name="s" numToSelect="2"><option><point name="P">(1,2)</point><text>a</text></option><option><point name="P">(3,4)</point></option></select>
<p name="p1">$rmix.P</p><p name="p2">$rmix.P.x</p><p name="p3">$rmix[1].P.x</p><p name="p4">$rmix.t</p>
<p name="p5">$s.P.x</p><p name="p6">$s.P</p><p name="p7">$rmix.P[2]</p>`,
            ["p1", "p2", "p3", "p4", "p5", "p6", "p7"],
        );
        // Before: `$rmix.P` nothing, `$rmix.P.x` `＿`, `$s.P.x` `w0105`.
        expect(texts).eqls({
            p1: "(1, 3), (2, 3)",
            p2: "1, 2",
            p3: "1",
            p4: "a, a",
            p5: "1, 3",
            p6: "(1, 2), (3, 4)",
            p7: "3, 3",
        });
        expect(diagnostics).eqls([]);
    });

    it("reaches each item however many there are, never one item's alone (NAME-3)", async () => {
        const { texts, diagnostics } = await both(
            `<repeat name="r" for="5" valueName="v"><point name="P">($v,3)</point></repeat>
<p name="p1">$r.P.x</p><p name="p2">$r.numItems</p><p name="p3">$P</p>`,
            ["p1", "p2", "p3"],
        );
        expect(texts).eqls({ p1: "5", p2: "1", p3: "＿" });
        expect(diagnostics).eqls(["warning doenet-w0104"]);
    });

    it("through names inside each item, and the items of a repeat in each item", async () => {
        const { texts, diagnostics } = await both(
            `<repeat name="r" for="1 2" valueName="v"><group name="G"><math name="m">$v^2</math></group><repeat name="q" for="a b" valueName="w"><text name="t">$v$w</text></repeat></repeat>
<p name="p1">$r.G.m</p><p name="p2">$r.q.t</p><p name="p3">$r[2].q.t</p>`,
            ["p1", "p2", "p3"],
        );
        expect(texts).eqls({
            p1: "1², 2²",
            p2: "1a, 1b, 2a, 2b",
            p3: "2a, 2b",
        });
        expect(diagnostics).eqls([]);
    });

    it("must be declared in every option, with one type (COMP-11)", async () => {
        const missing = await both(
            `<select name="s" numToSelect="2"><option><point name="P">(1,2)</point><text>a</text></option><option><point name="Q">(3,4)</point></option></select>
<p name="p1">$s.P.x</p><p name="p2">$s.P</p>`,
            ["p1", "p2"],
            { withMessages: true },
        );
        expect(missing.texts).eqls({ p1: "＿", p2: "＿" });
        expect(missing.diagnostics).eqls([
            "warning doenet-w0183: `$s.P.x` names nothing: option 2 of `s` has no `P`. Give it one, or use a name every option has.",
            "warning doenet-w0183: `$s.P` names nothing: option 2 of `s` has no `P`. Give it one, or use a name every option has.",
        ]);

        const types = await both(
            `<select name="s" numToSelect="2"><option><point name="P">(1,2)</point></option><option><text name="P">b</text></option></select>
<p name="p1">$s.P.x</p><point extend="$s.P" name="A"/>`,
            ["p1"],
        );
        expect(types.texts).eqls({ p1: "" });
        expect(types.diagnostics).eqls([
            "error doenet-e0065",
            "error doenet-w0184",
        ]);
    });

    it("after a group holding only a reference to a repeat, as after the repeat (#2548 item 2)", async () => {
        const { texts, diagnostics } = await both(
            `<repeat name="r" for="1 2" valueName="v"><point name="P">($v,3)</point></repeat>
<group name="g">$r</group>
<p name="p1">$g.x</p><p name="p2">$r.x</p><p name="p3">$g.P.x</p><p name="p4">$g</p>`,
            ["p1", "p2", "p3", "p4"],
        );
        // `$g.x` was `12`, with no commas.
        expect(texts).eqls({
            p1: "1, 2",
            p2: "1, 2",
            p3: "1, 2",
            p4: "(1, 3), (2, 3)",
        });
        expect(diagnostics).eqls([]);
    });

    it("in its own template is a cycle, found at load", async () => {
        const { diagnostics } = await both(
            `<repeat name="r" for="1 2" valueName="v"><math name="m">$r.m</math></repeat>
<p name="p1">$r.m</p>`,
            ["p1"],
        );
        expect(diagnostics).eqls(["error doenet-e0005"]);
    });
});

describe("A property after a repeat whose template holds several is decided at load (#2548 item 3)", () => {
    it("with a suggestion naming a child, also with no iterations", async () => {
        for (const length of ["0", "2"]) {
            const { texts, diagnostics } = await both(
                `<repeatForSequence name="r" length="${length}" valueName="v"><point name="A">($v,3)</point><text>a</text></repeatForSequence>
<p name="p1">$r.x</p><p name="p2">$r.A.x</p>`,
                ["p1", "p2"],
                { withMessages: true },
            );
            expect(texts).eqls(
                length === "0"
                    ? { p1: "", p2: "" }
                    : { p1: "＿, ＿", p2: "1, 2" },
            );
            expect(diagnostics).eqls([
                "warning doenet-w0193: `$r.x` names nothing: what is written inside the `<repeatForSequence>` holds 2 components, so each item holds 2, and a property applies to an item only when it is one component. To read the property of a child, write `$r.A.x`.",
            ]);
        }
    });

    it("suggests a reference written alone as a tag with a name", async () => {
        const { diagnostics } = await both(
            `<point name="Q">(1,2)</point><repeat name="r" for="1 2" valueName="v">$Q<text>a</text></repeat>
<p name="p1">$r.x</p>`,
            ["p1"],
            { withMessages: true },
        );
        expect(diagnostics).eqls([
            'warning doenet-w0193: `$r.x` names nothing: what is written inside the `<repeat>` holds 2 components, so each item holds 2, and a property applies to an item only when it is one component. To read the property of a child, write it as a tag with a name, such as `<point extend="$Q" name="P"/>`, and write `$r.P.x`.',
        ]);
    });
});

describe("An item lacking a property gives a blank, with the warning decided at load (#2452)", () => {
    it("a repeat over items of different types", async () => {
        const { texts, diagnostics } = await both(
            `<point name="A">(1,3)</point><text name="t">a</text><point name="B">(2,4)</point>
<repeat name="rmix" for="$A $t $B" valueName="v">$v</repeat>
<p name="p1">$rmix.x</p><math name="m">$rmix.x+1</math>`,
            ["p1", "m"],
            { withMessages: true },
        );
        // Was `1, 2`, with the text dropped silently.
        expect(texts).eqls({ p1: "1, ＿, 2", m: "(1, ＿, 2) + 1" });
        expect(diagnostics).eqls([
            "warning doenet-w0192: `$rmix.x`: a `<text>` in `rmix` has no property `x`, so it gives a blank there. For a value from each, give every item a component that has `x`.",
            "warning doenet-w0192: `$rmix.x`: a `<text>` in `rmix` has no property `x`, so it gives a blank there. For a value from each, give every item a component that has `x`.",
        ]);
    });

    it("a repeat whose template is a conditionalContent with a case lacking it (#2548 item 5)", async () => {
        const { texts, diagnostics } = await both(
            `<repeat name="r" for="1 2 3" valueName="v"><conditionalContent><case condition="$v=2"><text>a</text></case><else><point>($v,1)</point></else></conditionalContent></repeat>
<p name="p1">$r.x</p>`,
            ["p1"],
        );
        // Was `1, 3`, silently.
        expect(texts).eqls({ p1: "1, ＿, 3" });
        expect(diagnostics).eqls(["warning doenet-w0192"]);
    });

    it("follows the case each iteration shows", async () => {
        const doenetML = `<booleanInput name="b"/>
<repeat name="r" for="1 2" valueName="v"><conditionalContent><case condition="$b and $v=2"><text>a</text></case><else><point>($v,1)</point></else></conditionalContent></repeat>
<p name="p1">$r.x</p>`;
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        const text = async () =>
            (await core.returnAllStateVariables(false, true))[
                await resolvePathToNodeIdx("p1")
            ].stateValues.text;
        expect(await text()).eq("1, 2");
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        expect(await text()).eq("1, ＿");
        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        expect(await text()).eq("1, 2");
    });

    it("options holding a reference count as what it names (#2548 item 4)", async () => {
        const { texts, diagnostics } = await both(
            `<point name="Q">(3,4)</point><text name="t">hi</text>
<select name="s" numToSelect="2"><option>$Q</option><option>$t</option></select>
<p name="p1">$s.x</p>`,
            ["p1"],
        );
        // Was `3`, the text dropped silently, and `w0104` when only the
        // text was picked.
        expect(texts).eqls({ p1: "3, ＿" });
        expect(diagnostics).eqls(["warning doenet-w0192"]);
    });
});
