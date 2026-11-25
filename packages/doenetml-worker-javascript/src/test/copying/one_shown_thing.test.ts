import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { updateBooleanInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A `<conditionalContent>` and a chooser that picks one are not collections
 * (D72, COLL-1): each stands for what it shows, so an index after one reaches
 * into what it shows, and neither has a `numItems`. One with nothing to show
 * shows nothing (D73). A reference whose meaning would change with the branch
 * shown is an error, decided when the document loads (D74).
 */
async function load(doenetML: string, requestedVariantIndex?: number) {
    let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
        doenetML,
        requestedVariantIndex,
    });

    /** Every diagnostic, as `code: message`, errors first. */
    function diagnostics() {
        const all = getDiagnosticsByType(core);
        return [...all.errors, ...all.warnings, ...all.infos].map(
            (d: any) => `${d.code}: ${d.message}`,
        );
    }

    /** The codes of every diagnostic, errors first. */
    function codes() {
        const all = getDiagnosticsByType(core);
        return [...all.errors, ...all.warnings, ...all.infos].map(
            (d: any) => d.code,
        );
    }

    /** The type of the component `name` names, `_error` for an error. */
    async function typeOf(name: string) {
        return (core as any).core._components[await resolvePathToNodeIdx(name)]
            ?.componentType;
    }

    /** The text of the component `name` names. */
    async function text(name: string) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        return stateVariables[await resolvePathToNodeIdx(name)].stateValues
            .text;
    }

    async function setBoolean(name: string, boolean: boolean) {
        await updateBooleanInputValue({
            boolean,
            componentIdx: await resolvePathToNodeIdx(name),
            core,
        });
    }

    /** Save the document's state and load it again from what was saved. */
    async function reload() {
        await core.saveImmediately();
        ({ core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));
    }

    return { diagnostics, codes, typeOf, text, setBoolean, reload };
}

const cc = (a: string, b: string) =>
    `<booleanInput name="b"/><conditionalContent name="cc"><case condition="$b">${a}</case><else>${b}</else></conditionalContent>`;

describe("An index after a one-shown-thing reaches into what it shows (D72) @group4", () => {
    it("of a conditionalContent, live and after a reload", async () => {
        const d = await load(
            `${cc("<math>(1,2)</math>", "<math>(3,4)</math>")}<p name="p1">$cc[1]</p><p name="p2">$cc[2]</p><p name="p3">$cc[3]</p><math name="m" extend="$cc[2]"/>`,
        );
        expect(await d.text("p1")).eq("3");
        expect(await d.text("p2")).eq("4");
        expect(await d.text("p3")).eq("＿");
        expect(await d.text("m")).eq("4");
        expect(d.codes()).eqls([]);
        await d.setBoolean("b", true);
        expect(await d.text("p1")).eq("1");
        expect(await d.text("p2")).eq("2");
        expect(await d.text("m")).eq("2");
        await d.reload();
        expect(await d.text("p2")).eq("2");
        expect(await d.text("m")).eq("2");
    });

    it("of a one-pick select, with no warning past the pick", async () => {
        for (const select of [
            `<select name="s"><option><point>(3,4)</point></option></select>`,
            `<select name="s" numToSelect="1"><option><point>(3,4)</point></option></select>`,
        ]) {
            const d = await load(
                `${select}<p name="p0">$s</p><p name="p1">$s[1]</p><p name="p2">$s[2]</p>`,
            );
            expect(await d.text("p0")).eq("(3, 4)");
            expect(await d.text("p1")).eq("3");
            expect(await d.text("p2")).eq("4");
            expect(d.codes()).eqls([]);
        }
    });

    it("of a select picking several still selects a pick", async () => {
        const d = await load(
            `<select name="s" numToSelect="2"><option><math>1</math></option><option><math>2</math></option></select><p name="p">$s[1]$s[2]</p><p name="n">$s.numItems</p>`,
        );
        expect((await d.text("p")).split("").sort().join("")).eq("12");
        expect(await d.text("n")).eq("2");
    });

    it("through a group holding a reference to one", async () => {
        const d = await load(
            `<conditionalContent name="cc"><case condition="true"><math>(1,2)</math></case></conditionalContent><select name="s"><option><math>(3,4)</math></option></select><group name="g">$cc</group><group name="h">$s</group><p name="p1">$g[1]</p><p name="p2">$g[2]</p><p name="p3">$h[1]</p><p name="p4">$h[2]</p>`,
        );
        expect(await d.text("p1")).eq("1");
        expect(await d.text("p2")).eq("2");
        expect(await d.text("p3")).eq("3");
        expect(await d.text("p4")).eq("4");
        expect(d.codes()).eqls([]);
    });

    it("into a case holding a repeat is an iteration", async () => {
        const d = await load(
            `<conditionalContent name="cc"><case condition="true"><repeat for="5 6" valueName="v"><math>$v</math></repeat></case></conditionalContent><p name="p">$cc[2]</p><repeat name="e" extend="$cc[1]"/>`,
        );
        expect(await d.text("p")).eq("6");
        expect(d.diagnostics()).eqls([
            "doenet-e0071: A `<repeat>` makes its content itself, so it can be made only from another `<repeat>`, and `$cc[1]` isn't one. To show it as it is, write `$cc[1]`.",
        ]);
    });

    it("a list in a case is indexed by its entries, as the message says", async () => {
        const d = await load(
            `<conditionalContent name="cc"><case condition="true"><mathList>1 2</mathList></case></conditionalContent><math name="e" extend="$cc"/><math name="f" extend="$cc[2]"/>`,
        );
        expect(d.diagnostics()).eqls([
            "doenet-e0064: A `<math>` can be made from a `<mathList>` only when it holds one component, and `$cc` holds 2. To use one of them, write `$cc[1]`. To read them all as one value, write `<math>$cc</math>`.",
        ]);
        expect(await d.text("f")).eq("2");
    });

    it("a tag made from it is typed at load", async () => {
        const d = await load(
            `${cc("<math>(1,2)</math>", "<math>(3,4)</math>")}<boolean name="e" extend="$cc[1]"/>`,
        );
        const expected = [
            "doenet-e0065: A `<boolean>` can't be made from `$cc[1]`, which gives a `<math>`: a number is not true or false. To test it, write a comparison such as `<boolean>$cc[1] != 0</boolean>`.",
        ];
        expect(d.diagnostics()).eqls(expected);
        expect(await d.typeOf("e")).eq("_error");
        await d.setBoolean("b", true);
        expect(d.diagnostics()).eqls(expected);
        await d.reload();
        expect(d.diagnostics()).eqls(expected);
    });

    it("of a one-pick chooser of values reaches into its one value", async () => {
        const d = await load(
            `<selectFromSequence name="s" from="5" to="5"/><p name="p0">$s</p><p name="p1">$s[1]</p><p name="n">$s.numItems</p>`,
        );
        expect(await d.text("p0")).eq("5");
        expect(await d.text("p1")).eq("＿");
        expect(await d.text("n")).eq("＿");
        expect(d.codes()).eqls(["doenet-w0100", "doenet-w0104"]);
        const several = await load(
            `<selectFromSequence name="s" from="5" to="6" numToSelect="2"/><p name="p1">$s[1]</p><p name="n">$s.numItems</p>`,
        );
        expect(["5", "6"]).includes(await several.text("p1"));
        expect(await several.text("n")).eq("2");
    });
});

describe("A one-shown-thing has no numItems (D72) @group4", () => {
    it("of a conditionalContent or a one-pick select names nothing", async () => {
        const d = await load(
            `<conditionalContent name="cc"><case condition="true"><math>(1,2)</math></case></conditionalContent><select name="s"><option><math>3</math></option></select><p name="p1">$cc.numItems</p><p name="p2">$s.numItems</p>`,
        );
        expect(await d.text("p1")).eq("＿");
        expect(await d.text("p2")).eq("＿");
        expect(d.codes()).eqls(["doenet-w0104", "doenet-w0104"]);
    });

    it("a copy picks one by its own numToSelect, not its source's", async () => {
        // a copy picking several of a one-pick chooser is a collection
        const d = await load(
            `<select name="s"><option><math>1</math></option><option><math>2</math></option></select><select name="s2" copy="$s" numToSelect="2"/><selectFromSequence name="q" from="1" to="5"/><selectFromSequence name="q2" copy="$q" numToSelect="3"/><p name="p1">$s2.numItems</p><p name="p2">$q2.numItems</p><p name="p3">$q2[2]</p>`,
        );
        expect(await d.text("p1")).eq("2");
        expect(await d.text("p2")).eq("3");
        expect(Number(await d.text("p3"))).within(1, 5);
        expect(d.codes()).eqls([]);

        // a copy picking one of a select of several has no numItems
        const e = await load(
            `<select name="s" numToSelect="2"><option><math>1</math></option><option><math>2</math></option></select><select name="s2" copy="$s" numToSelect="1"/><p name="p1">$s2.numItems</p>`,
        );
        expect(await e.text("p1")).eq("＿");
        expect(e.codes()).eqls(["doenet-w0104"]);

        // a copy that doesn't say is left a collection, as the resolver leaves it
        const f = await load(
            `<select name="s"><option><math>1</math></option></select><select name="s2" copy="$s"/><p name="p1">$s2.numItems</p>`,
        );
        expect(await f.text("p1")).eq("1");
        expect(f.codes()).eqls([]);
    });
});

describe("A one-shown-thing with nothing to show shows nothing (D73) @group4", () => {
    it("while no case is shown, and while the case shown is empty", async () => {
        for (const cases of [
            `<case condition="$b"><math>(1,2)</math></case>`,
            `<case condition="$b"><math>(1,2)</math></case><else/>`,
        ]) {
            const d = await load(
                `<booleanInput name="b"/><conditionalContent name="cc">${cases}</conditionalContent><p name="p0">$cc</p><p name="p1">$cc[1]</p><math name="m" extend="$cc"/>`,
            );
            const check = async () => {
                expect(await d.text("p0")).eq("");
                expect(await d.text("p1")).eq("＿");
                expect(await d.text("m")).eq("＿");
                expect(d.codes()).includes("doenet-i0055");
            };
            await check();
            await d.setBoolean("b", true);
            expect(await d.text("p0")).eq("(1, 2)");
            expect(await d.text("p1")).eq("1");
            expect(await d.text("m")).eq("(1, 2)");
            await d.setBoolean("b", false);
            await check();
            await d.reload();
            await check();
        }
    });
});

describe("A reference whose meaning depends on the branch shown is an error (D74) @group4", () => {
    it("a name missing from a branch, bare or on a tag, in place of the reference", async () => {
        const d = await load(
            `${cc('<math name="x">1</math>', "<text>hi</text>")}<p name="p">$cc.x</p><math name="e" extend="$cc.x"/>`,
        );
        const expected =
            "doenet-e0093: `$cc.x` can't be used: the `<else>` of `cc` has no `x`, so what it names would change with what is shown. Give it one, or use a name every case has.";
        expect(d.diagnostics()).eqls([expected, expected]);
        expect(await d.typeOf("e")).eq("_error");
        await d.setBoolean("b", true);
        expect(d.diagnostics()).eqls([expected, expected]);
        expect(await d.typeOf("e")).eq("_error");
        await d.reload();
        expect(d.diagnostics()).eqls([expected, expected]);
    });

    it("a name of different types, bare, in place of the reference", async () => {
        const d = await load(
            `${cc('<math name="x">1</math>', '<text name="x">hi</text>')}<p name="p">$cc.x</p>`,
        );
        expect(d.diagnostics()).eqls([
            "doenet-e0094: `$cc.x` can't be used: `x` is a `<math>` in one case of `cc` and a `<text>` in another, so its type would change with what is shown. Use the same type, or different names.",
        ]);
        expect(await d.text("p")).eq("");
    });

    it("an index after a conditionalContent of a case holding several", async () => {
        const d = await load(
            `${cc("<math>1</math><math>2</math>", "<math>3</math>")}<p name="p">$cc[1]</p><math name="e" extend="$cc[1]"/>`,
        );
        const expected =
            "doenet-e0095: `$cc[1]` can't be used: an index after `cc` reaches into what the case shown holds, which must be one component of one type in every case, and case 1 holds several. To use a component inside, give it a name in each and refer to it by that name.";
        // decided at load, in the case not shown
        expect(d.diagnostics()).eqls([expected, expected]);
        expect(await d.typeOf("e")).eq("_error");
        await d.setBoolean("b", true);
        expect(d.diagnostics()).eqls([expected, expected]);
        await d.reload();
        expect(d.diagnostics()).eqls([expected, expected]);
    });

    it("an index after a conditionalContent of components of different types", async () => {
        const d = await load(
            `${cc("<math>(1,2)</math>", "<text>hi</text>")}<p name="p">$cc[2]</p><math name="e" extend="$cc[2]"/>`,
        );
        const expected =
            "doenet-e0095: `$cc[2]` can't be used: an index after `cc` reaches into what the case shown holds, which must be one component of one type in every case, and one holds a `<math>` and another a `<text>`. Hold one type in each.";
        expect(d.diagnostics()).eqls([expected, expected]);
        expect(await d.typeOf("e")).eq("_error");
    });

    it("an index after a one-pick select, in every variant", async () => {
        const doenetML = `<select name="s"><option><math>(1,2)</math></option><option><math>3</math><math>4</math></option></select><p name="p">$s[1]</p>`;
        for (const variant of [1, 2, 3, 4]) {
            const d = await load(doenetML, variant);
            expect(d.diagnostics()).eqls([
                "doenet-e0095: `$s[1]` can't be used: an index after `s` reaches into what the pick holds, which must be one component of one type in every option, and option 2 holds several. To use a component inside, give it a name in each and refer to it by that name.",
            ]);
        }
    });

    it("an index after one named in each branch or item, decided from all of them", async () => {
        // `cc` is named in each option of `s` (and of `s2`, which picks
        // several), in each case of `outer`, and in the item of `r`: an
        // index after `cc` may reach into any of them
        const inner = (a: string, b: string) =>
            `<conditionalContent name="cc"><case condition="$b">${a}</case><else>${b}</else></conditionalContent>`;
        const several = inner("<math>1</math><math>2</math>", "<math>3</math>");
        const d = await load(
            `<booleanInput name="b"/><select name="s"><option>${several}</option><option>${several}</option></select><select name="s2" numToSelect="2"><option>${several}</option><option>${several}</option></select><conditionalContent name="outer"><case condition="true">${several}</case><else>${several}</else></conditionalContent><repeat name="r" for="1 2">${several}</repeat><select name="t"><option>${inner("<math>1</math>", "<math>2</math>")}</option><option>${inner("<text>a</text>", "<text>b</text>")}</option></select><p name="p1">$s.cc[1]</p><p name="p2">$s2[2].cc[1]</p><p name="p3">$outer.cc[1]</p><p name="p4">$r[1].cc[1]</p><math name="e" extend="$s.cc[1]"/><p name="p5">$t.cc[1]</p>`,
        );
        const severalMessage = (reference: string) =>
            `doenet-e0095: \`${reference}\` can't be used: an index after \`cc\` reaches into what the case shown holds, which must be one component of one type in every case, and case 1 holds several. To use a component inside, give it a name in each and refer to it by that name.`;
        // decided at load, in the case not shown
        expect(d.diagnostics()).eqls([
            severalMessage("$s.cc[1]"),
            severalMessage("$s2[2].cc[1]"),
            severalMessage("$outer.cc[1]"),
            severalMessage("$r[1].cc[1]"),
            "doenet-e0095: `$t.cc[1]` can't be used: an index after `cc` reaches into what the case shown holds, which must be one component of one type in every case, and one holds a `<math>` and another a `<text>`. Hold one type in each.",
            // the tag's, reported as it is made
            severalMessage("$s.cc[1]"),
        ]);
        expect(await d.typeOf("e")).eq("_error");
    });

    it("an index after one named in an option copied into each option", async () => {
        // both options are copies of `o`, which holds `cc` once
        const d = await load(
            `<booleanInput name="b"/><option name="o"><conditionalContent name="cc"><case condition="$b"><math>1</math><math>2</math></case><else><math>(3,4)</math></else></conditionalContent></option><select name="s"><option copy="$o"/><option copy="$o"/></select><p name="p">$s.cc[1]</p>`,
        );
        expect(d.codes()).eqls(["doenet-e0095"]);
    });

    it("an index after one named through another that shows one, decided from each of their branches", async () => {
        // `cc` is named in each option of an `s` named in each case of
        // `outer` (and of `m2`, a copy, and in a repeat's item, and in a
        // select's pick), and in each option of a select with no name in a
        // case of `outer2`: the index may reach into any `cc`
        const inner = (a: string) =>
            `<conditionalContent name="cc"><case condition="$b">${a}</case><else><math>(3,4)</math></else></conditionalContent>`;
        const several = inner("<math>1</math><math>2</math>");
        const one = inner("<math>(1,2)</math>");
        const s = (a: string, b: string) =>
            `<select name="s"><option>${a}</option><option>${b}</option></select>`;
        const d = await load(
            `<booleanInput name="b"/><conditionalContent name="outer"><case condition="$b">${s(several, one)}</case><else>${s(one, one)}</else></conditionalContent><module name="m">${s(several, one)}</module><module name="m2" extend="$m"/><repeat name="r" for="1 2">${s(several, one)}</repeat><select name="t" numToSelect="2"><option>${s(several, one)}</option><option>${s(one, one)}</option></select><conditionalContent name="outer2"><case condition="$b"><select><option>${several}</option><option>${one}</option></select></case><else>${one}</else></conditionalContent><conditionalContent name="ok"><case condition="$b">${s(one, one)}</case><else>${s(one, one)}</else></conditionalContent><p name="p1">$outer.s.cc[1]</p><p name="p2">$m2.s.cc[1]</p><p name="p3">$r[1].s.cc[1]</p><p name="p4">$t[2].s.cc[1]</p><p name="p5">$outer2.cc[1]</p><p name="p6">$ok.s.cc[1]</p><math name="m6" extend="$ok.s.cc[1]"/>`,
        );
        // decided at load, in the case not shown
        expect(d.codes()).eqls([
            "doenet-e0095",
            "doenet-e0095",
            "doenet-e0095",
            "doenet-e0095",
            "doenet-e0095",
        ]);
        expect(await d.text("p6")).eq("3");
        expect(await d.typeOf("m6")).eq("math");
        expect(await d.text("m6")).eq("3");
    });

    it("an index after one with an else written with copy, decided at load", async () => {
        const d = await load(
            `<conditionalContent name="c0"><case condition="false"><math>1</math></case><else name="e"><math>1</math><math>2</math></else></conditionalContent><conditionalContent name="c1"><case condition="false"><math>1</math></case><else name="e2"><math>(5,6)</math></else></conditionalContent><conditionalContent name="cc"><case condition="false"><math>3</math></case><else copy="$e"/></conditionalContent><conditionalContent name="cc2"><case condition="false"><math>3</math></case><else copy="$e2"/></conditionalContent><p name="p">$cc[1]</p><p name="p2">$cc2[1]</p><math name="m2" extend="$cc2[1]"/>`,
        );
        expect(d.diagnostics()).eqls([
            "doenet-e0095: `$cc[1]` can't be used: an index after `cc` reaches into what the case shown holds, which must be one component of one type in every case, and the `<else>` holds several. To use a component inside, give it a name in each and refer to it by that name.",
        ]);
        expect(await d.text("p2")).eq("5");
        expect(await d.typeOf("m2")).eq("math");
    });

    it("a name inside the cases of one type, and an index into one type, are fine", async () => {
        const d = await load(
            `${cc('<math name="x">(1,2)</math>', '<math name="x">(3,4)</math>')}<p name="p">$cc.x $cc[1]</p>`,
        );
        expect(d.codes()).eqls([]);
        expect(await d.text("p")).eq("(3, 4) 3");
    });
});
