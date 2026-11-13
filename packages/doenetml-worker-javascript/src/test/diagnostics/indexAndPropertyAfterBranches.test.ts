import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * What a property or an index after a `<select>` or `<conditionalContent>`
 * reaches in its options or cases (#2452, D40 decision 5 as narrowed by D41;
 * #2520 items 1–6). The warnings decided at load are decided from every
 * option or case, so they are the same whatever is picked or shown, and
 * after a reload (DIAG-6, DIAG-7).
 */

async function setup(doenetML: string) {
    let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
        doenetML,
    });

    /** The diagnostics other than accessibility ones, as code, type, line and message. */
    function diagnostics() {
        return (core as any).core.diagnostics
            .filter((d: any) => !d.code?.startsWith("doenet-a"))
            .map((d: any) => ({
                code: d.code,
                type: d.type,
                line: d.position?.start.line,
                message: d.message,
            }))
            .sort(
                (a: any, b: any) =>
                    a.line - b.line || a.message.localeCompare(b.message),
            );
    }

    function codes() {
        return diagnostics().map((d: any) => `${d.type} ${d.code}`);
    }

    async function reload() {
        await core.saveImmediately();
        ({ core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));
    }

    async function text(name = "p") {
        const stateVariables = await core.returnAllStateVariables(false, true);
        return stateVariables[await resolvePathToNodeIdx(name)].stateValues
            .text;
    }

    return {
        diagnostics,
        codes,
        reload,
        text,
        async setBoolean(name: string, boolean: boolean) {
            await updateBooleanInputValue({
                boolean,
                componentIdx: await resolvePathToNodeIdx(name),
                core,
            });
        },
        async setMath(name: string, latex: string) {
            await updateMathInputValue({
                latex,
                componentIdx: await resolvePathToNodeIdx(name),
                core,
            });
        },
    };
}

describe("A property some of a collection's items lack (#2452, D40)", () => {
    it("a case and an else holding a math and a text: a warning at load, a blank where it is lacking", async () => {
        const d = await setup(`<booleanInput name="b"/>
<conditionalContent name="cc"><case condition="$b"><math name="m">x</math></case><else><text>hi</text></else></conditionalContent>
<p name="p">[$cc.x] [$cc.value] [$cc.latex]</p>`);
        const expected = [
            {
                code: "doenet-w0192",
                type: "warning",
                line: 3,
                message:
                    "`$cc.latex`: a `<text>` in `cc` has no property `latex`, so it gives a blank there. Read the property from the component you mean, such as `$m.latex`.",
            },
            {
                code: "doenet-w0192",
                type: "warning",
                line: 3,
                message:
                    "`$cc.x`: a `<text>` in `cc` has no property `x`, so it gives a blank there. Read the property from the component you mean, such as `$m.x`.",
            },
        ];
        // `value`, which both have, is silent
        expect(d.diagnostics()).eqls(expected);
        expect(await d.text()).eq("[＿] [hi] [＿]");

        await d.setBoolean("b", true);
        expect(await d.text()).eq("[x] [x] [x]");
        // decided at load, so it does not come and go with the case shown
        expect(d.diagnostics()).eqls(expected);

        await d.setBoolean("b", false);
        expect(await d.text()).eq("[＿] [hi] [＿]");
        expect(d.diagnostics()).eqls(expected);

        await d.reload();
        expect(d.diagnostics()).eqls(expected);
    });

    it("the picks of a select: each pick lacking it gives a blank", async () => {
        const d =
            await setup(`<select name="s" numToSelect="2"><option><math>x</math></option><option><text>hi</text></option></select>
<p name="p">[$s.x] [$s.value]</p>`);
        expect(d.codes()).eqls(["warning doenet-w0192"]);
        expect(d.diagnostics()[0].message).eq(
            "`$s.x`: a `<text>` in `s` has no property `x`, so it gives a blank there. Read the property from the component you mean, by its name.",
        );
        // was `[x]`, the text skipped
        expect(await d.text()).eq("[x, ＿] [x, hi]");
        await d.reload();
        expect(d.codes()).eqls(["warning doenet-w0192"]);
    });

    it("a one-pick select, and a property after an index into the picks", async () => {
        const d =
            await setup(`<select name="s"><option><math>x</math></option><option><text>hi</text></option></select>
<p name="p">[$s.x] [$s[1].x]</p>`);
        // the same in every variant, whichever option is picked
        expect(d.codes()).eqls([
            "warning doenet-w0192",
            "warning doenet-w0192",
        ]);
    });

    it("on a tag: the same warning, and the tag follows the case shown", async () => {
        const d = await setup(`<booleanInput name="b"/>
<conditionalContent name="cc"><case condition="$b"><math>x</math></case><else><text>hi</text></else></conditionalContent>
<p name="p">[<math extend="$cc.x"/>]</p>`);
        expect(d.codes()).eqls(["warning doenet-w0192"]);
        expect(await d.text()).eq("[＿]");
        // before, the tag stayed missing, with `w0104`, after the case was shown
        await d.setBoolean("b", true);
        expect(await d.text()).eq("[x]");
        await d.setBoolean("b", false);
        expect(await d.text()).eq("[＿]");
        expect(d.codes()).eqls(["warning doenet-w0192"]);
    });

    it("stays silent when every item has it, and a property none has stays w0104", async () => {
        const d = await setup(`<booleanInput name="b"/>
<conditionalContent name="cc"><case condition="$b"><math>x</math></case><else><math>(1,2)</math></else></conditionalContent>
<select name="s" numToSelect="2"><option><point>(1,2)</point></option><option><vector>(3,4)</vector></option></select>
<p name="p">[$cc.value] [$cc.x] [$s.x] [$cc.nothing]</p>`);
        expect(d.codes()).eqls(["warning doenet-w0104"]);
        expect(await d.text()).eq("[(1, 2)] [1] [1, 3] [＿]");
    });

    it("is not decided inside a wrapper of several, nor for a reference as the item", async () => {
        const d = await setup(`<booleanInput name="b"/>
<conditionalContent name="cc1"><case condition="$b"><math>x</math> <text>hi</text></case><else><math>y</math> <boolean>true</boolean></else></conditionalContent>
<math name="m">z</math><text name="t">a</text>
<select name="s" numToSelect="2"><option>$m</option><option>$t</option></select>
<p name="p">[$cc1.x]</p>`);
        // each case a wrapper of several (D41, #2523), and the options'
        // types are not read from what their references name
        expect(d.codes()).eqls([]);
    });
});

describe("Options or cases that hold one component and several (#2520 item 1)", () => {
    it("a property and an index after a conditionalContent", async () => {
        const d = await setup(`<booleanInput name="b"/>
<conditionalContent name="cc"><case condition="$b"><point>(1,2)</point></case><else><point>(3,4)</point><point>(5,6)</point></else></conditionalContent>
<p name="p">[$cc.x] [$cc[1][2]] [$cc[1].x]</p>`);
        const atLoad = d
            .diagnostics()
            .filter((x: any) => x.code === "doenet-w0191");
        expect(atLoad.map((x: any) => x.message)).eqls([
            '`$cc.x`: a property after `cc` passes into what the case shown holds only when it holds one component, and the `<else>` holds several. Give the component you mean a name in each, such as `name="P"`, and write `$cc.P.x`.',
            '`$cc[1].x`: a property after `cc` passes into what the case shown holds only when it holds one component, and the `<else>` holds several. Give the component you mean a name in each, such as `name="P"`, and write `$cc[1].P.x`.',
            '`$cc[1][2]`: an index after `cc` passes into what the case shown holds only when it holds one component, and the `<else>` holds several. Give the component you mean a name in each, such as `name="P"`, and write `$cc[1].P[2]`.',
        ]);
        expect(atLoad.every((x: any) => x.type === "warning")).eq(true);

        await d.setBoolean("b", true);
        expect(await d.text()).eq("[1] [2] [1]");
        expect(
            d.diagnostics().filter((x: any) => x.code === "doenet-w0191"),
        ).eqls(atLoad);
        await d.reload();
        expect(
            d.diagnostics().filter((x: any) => x.code === "doenet-w0191"),
        ).eqls(atLoad);
    });

    it("an index and a property after a select names the options holding several", async () => {
        const d =
            await setup(`<select name="s" numToSelect="2"><option><point>(1,2)</point></option><option><point>(3,4)</point><point>(5,6)</point></option><option>hi <math>4</math></option></select>
<p name="p">[$s[1][2]] [$s.x]</p>`);
        const messages = d
            .diagnostics()
            .filter((x: any) => x.code === "doenet-w0191")
            .map((x: any) => x.message);
        expect(messages).eqls([
            '`$s.x`: a property after `s` passes into what each pick holds only when it holds one component, and options 2 and 3 hold several. Give the component you mean a name in each, such as `name="P"`, and write `$s.P.x`.',
            '`$s[1][2]`: an index after `s` passes into what each pick holds only when it holds one component, and options 2 and 3 hold several. Give the component you mean a name in each, such as `name="P"`, and write `$s[1].P[2]`.',
        ]);
    });

    it("nothing when every option holds several, or every one holds one", async () => {
        const d =
            await setup(`<select name="s" numToSelect="2"><option><point>(3,4)</point><point>(5,6)</point></option><option><point>(3,4)</point><point>(5,6)</point></option></select>
<select name="t" numToSelect="2"><option><point>(3,4)</point></option><option><point>(5,6)</point></option></select>
<p name="p">[$s.x] [$t[1][2]] [$t.x]</p>`);
        expect(d.codes()).eqls([]);
        expect(await d.text()).eq("[3, 5, 3, 5] [4] [3, 5]");
    });
});

describe("An index past what a conditionalContent shows names nothing (#2520 item 2)", () => {
    it("is not applied to what the shown case holds", async () => {
        const d = await setup(`<booleanInput name="b"/>
<conditionalContent name="cc"><case condition="$b"><math>(6,7)</math><math>(8,9)</math></case><else><math>(1,2)</math></else></conditionalContent>
<group name="e"><conditionalContent><case condition="$b"><math>(6,7)</math><math>(8,9)</math></case><else><math>(1,2)</math></else></conditionalContent></group>
<p name="p">[$cc[2]] [$e[2]] [$cc[1]]</p>`);
        // was `2` (and `7, 9` with the case shown)
        expect(await d.text()).eq("[＿] [＿] [(1, 2)]");
        await d.setBoolean("b", true);
        expect(await d.text()).eq("[＿] [＿] [(6, 7)(8, 9)]");
        await d.setBoolean("b", false);
        expect(await d.text()).eq("[＿] [＿] [(1, 2)]");
        await d.reload();
        expect(await d.text()).eq("[＿] [＿] [(1, 2)]");
        expect(d.codes()).eqls([
            "warning doenet-w0104",
            "warning doenet-w0104",
        ]);
    });

    it("`$cc[1]` with no case shown is an info that follows the case", async () => {
        const d = await setup(`<booleanInput name="b"/>
<conditionalContent name="cc"><case condition="$b"><math>(6,7)</math></case></conditionalContent>
<p name="p">[$cc[1]] [$cc[2]]</p>`);
        expect(d.codes()).eqls(["info doenet-w0104", "warning doenet-w0104"]);
        await d.setBoolean("b", true);
        expect(await d.text()).eq("[(6, 7)] [＿]");
        expect(d.codes()).eqls(["warning doenet-w0104"]);
        await d.reload();
        expect(d.codes()).eqls(["warning doenet-w0104"]);
        await d.setBoolean("b", false);
        expect(await d.text()).eq("[＿] [＿]");
        expect(d.codes()).eqls(["info doenet-w0104", "warning doenet-w0104"]);
        await d.reload();
        expect(d.codes()).eqls(["info doenet-w0104", "warning doenet-w0104"]);
    });
});

describe("An index past a repeat through a group holding a reference to it (#2520 item 3)", () => {
    it("says how many it made, as on the repeat itself", async () => {
        const d =
            await setup(`<group name="g2"><repeat name="r" for="1 2" valueName="v"><text>$v</text><text>x</text></repeat></group><group name="g">$g2</group>
<p name="p">[$g[3]] [$r[3]]</p>`);
        // `$g[3]` was `w0104`
        expect(d.diagnostics().map((x: any) => x.message)).eqls([
            "`$g[3]`: the `<repeat>` made only 2 iterations.",
            "`$r[3]`: the `<repeat>` made only 2 iterations.",
        ]);
    });

    it("an info that follows the number of iterations when it can change", async () => {
        const d = await setup(`<mathInput name="n" prefill="2"/>
<group name="g2"><repeatForSequence name="r" length="$n" valueName="v"><text>$v</text><text>x</text></repeatForSequence></group><group name="g">$g2</group>
<p name="p">[$g[3]] [$r[3]]</p>`);
        expect(d.codes()).eqls(["info doenet-w0181", "info doenet-w0181"]);
        await d.setMath("n", "3");
        expect(await d.text()).eq("[3x] [3x]");
        expect(d.codes()).eqls([]);
        await d.setMath("n", "0");
        expect(await d.text()).eq("[＿] [＿]");
        expect(d.diagnostics().map((x: any) => x.message)).eqls([
            "`$g[3]`: the `<repeatForSequence>` made no iterations.",
            "`$r[3]`: the `<repeatForSequence>` made no iterations.",
        ]);
        await d.reload();
        expect(d.codes()).eqls(["info doenet-w0181", "info doenet-w0181"]);
    });
});

describe("An index into a scalar through a pick (#2520 item 4)", () => {
    it("`<option>$g</option>` gives the same level as `<option>$m</option>`", async () => {
        for (const doenetML of [
            `<group name="g"><math>5</math></group><select name="s"><option>$g</option></select>
<p name="p">[$s[1][1]]</p>`,
            `<math name="m">5</math><select name="s"><option>$m</option></select>
<p name="p">[$s[1][1]]</p>`,
        ]) {
            const d = await setup(doenetML);
            expect(d.codes()).eqls(["warning doenet-w0100"]);
        }
    });

    it("through a case whose condition is from an input it is an info", async () => {
        const d =
            await setup(`<booleanInput name="b"/><group name="g"><math>5</math></group>
<conditionalContent name="cc"><case condition="$b">$g</case><else><math>(1,2)</math></else></conditionalContent>
<p name="p">[$cc[1][1]]</p>`);
        await d.setBoolean("b", true);
        expect(d.codes()).eqls(["info doenet-w0100"]);
    });
});

describe("An extend of an iteration holding `$cc.x` follows the case (#2520 item 5)", () => {
    it("indexes the list of the case shown", async () => {
        const d = await setup(`<booleanInput name="b"/>
<conditionalContent name="cc"><case condition="$b"><mathList name="x">1 2 3</mathList></case><else><mathList name="x">4 5</mathList></else></conditionalContent>
<repeat name="r" for="1" valueName="v">$cc.x</repeat><group name="e" extend="$r[1]"/>
<p name="p">[$e[2]] [$e[3]] [$r[1][3]]</p>`);
        expect(await d.text()).eq("[5] [＿] [＿]");
        // which list is shown follows `b`: an info while it names nothing
        expect(d.codes()).eqls(["info doenet-w0104", "info doenet-w0104"]);
        // `$e[2]` and `$e[3]` stayed `＿` before
        await d.setBoolean("b", true);
        expect(await d.text()).eq("[2] [3] [3]");
        expect(d.codes()).eqls([]);
        await d.setBoolean("b", false);
        expect(await d.text()).eq("[5] [＿] [＿]");
        expect(d.codes()).eqls(["info doenet-w0104", "info doenet-w0104"]);
        await d.setBoolean("b", true);
        expect(await d.text()).eq("[2] [3] [3]");
        await d.reload();
        expect(await d.text()).eq("[2] [3] [3]");
        expect(d.codes()).eqls([]);
    });
});

describe("w0188 suggests a child counted as the components are (#2520 item 6)", () => {
    it("skips a setup", async () => {
        const d =
            await setup(`<group name="g"><setup><math name="s1">1</math></setup><math name="a">a</math><math>b</math></group>
<p name="p">[$g[1]]</p>`);
        const [message] = d.diagnostics().map((x: any) => x.message);
        // suggested naming the setup before
        expect(message).eq(
            "`$g[1]` names nothing: the `<group>` holds 2 components, and an index passes into a group only when it holds one. An index never selects a child. To refer to the child, write `$g.a`.",
        );
    });
});
