import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { updateBooleanInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A tag made from a collection keeps the collection's kind (COLL-1, D64),
 * a tag that makes its own content is made only from its own kind (D48
 * decision 2), and what an index into a `<conditionalContent>` or an
 * iteration holds is type-checked at load (REF-5, D36). Each is decided when
 * the document loads, so it is the same live and after a reload (DIAG-6,
 * DIAG-7).
 */
async function load(doenetML: string) {
    let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
        doenetML,
    });

    /** Every diagnostic, as `code: message`, errors first. */
    function diagnostics() {
        const all = getDiagnosticsByType(core);
        return [...all.errors, ...all.warnings, ...all.infos].map(
            (d: any) => `${d.code}: ${d.message}`,
        );
    }

    /** The codes of the errors reported. */
    function errorCodes() {
        return getDiagnosticsByType(core).errors.map((d: any) => d.code);
    }

    /** The type of the component `name` names, `_error` for an error. */
    async function typeOf(name: string) {
        return (core as any).core._components[await resolvePathToNodeIdx(name)]
            ?.componentType;
    }

    /** The state value `variable` of the component `name` names. */
    async function stateValue(name: string, variable: string) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        return stateVariables[await resolvePathToNodeIdx(name)].stateValues[
            variable
        ];
    }

    /** The text of the component `name` names. */
    async function text(name: string) {
        return await stateValue(name, "text");
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

    return {
        diagnostics,
        errorCodes,
        typeOf,
        stateValue,
        text,
        setBoolean,
        reload,
    };
}

const repeat = `<repeat name="r" for="1 2" valueName="v"><math>$v</math></repeat>`;

describe("A <group> made from a collection is an error at load (D64, #2649) @group4", () => {
    const collections: [string, string, string][] = [
        ["a repeat", repeat, "repeat"],
        [
            "a repeatForSequence",
            `<repeatForSequence name="r" length="2" valueName="v"><math>$v</math></repeatForSequence>`,
            "repeatForSequence",
        ],
        [
            "a select of several",
            `<select name="r" numToSelect="2"><option><math>1</math></option><option><math>2</math></option></select>`,
            "select",
        ],
        [
            "a select whose numToSelect is a reference",
            `<number name="n">1</number><select name="r" numToSelect="$n"><option><math>1</math></option><option><math>2</math></option></select>`,
            "select",
        ],
        [
            "a selectFromSequence of several",
            `<selectFromSequence name="r" to="5" numToSelect="2"/>`,
            "selectFromSequence",
        ],
        ["a mathList", `<mathList name="r">1 2</mathList>`, "mathList"],
        [
            "a pointList",
            `<pointList name="r">(1,2) (3,4)</pointList>`,
            "pointList",
        ],
        ["a sequence", `<sequence name="r" to="3"/>`, "sequence"],
        [
            "a collect",
            `<p name="p"><math>1</math></p><collect name="r" from="$p" componentType="math"/>`,
            "collect",
        ],
        [
            "a sort",
            `<sort name="r"><math>2</math><math>1</math></sort>`,
            "sort",
        ],
        [
            "a shuffle",
            `<shuffle name="r"><math>2</math><math>1</math></shuffle>`,
            "shuffle",
        ],
        [
            "an extend of a repeat",
            `${repeat.replace('name="r"', 'name="r0"')}<repeat name="r" extend="$r0"/>`,
            "repeat",
        ],
    ];

    for (const [label, source, tag] of collections) {
        for (const how of ["extend", "copy", "copyWithState"]) {
            it(`a group made with ${how} from ${label}`, async () => {
                const d = await load(
                    `${source}<p name="before">before</p><group name="g" ${how}="$r"/><p name="after">after</p>`,
                );
                const expected = [
                    `doenet-e0065: A \`<group>\` can't be made from \`$r\`, a \`<${tag}>\`: a \`<${tag}>\` holds many things, and keeps its kind when a tag is made from it. To put it in a group, write \`<group>$r</group>\`, with anything else the group holds beside it. To show the same \`<${tag}>\` again, write \`<${tag} ${how}="$r"/>\`.`,
                ];
                expect(
                    d.diagnostics().filter((x) => x.startsWith("doenet-e")),
                ).eqls(expected);
                expect(await d.typeOf("g")).eq("_error");
                // the rest of the document renders (DIAG-5)
                expect(await d.text("after")).eq("after");

                await d.reload();
                expect(
                    d.diagnostics().filter((x) => x.startsWith("doenet-e")),
                ).eqls(expected);
                expect(await d.typeOf("g")).eq("_error");
            });
        }
    }

    it("a group made from a collection named inside a section", async () => {
        const d = await load(
            `<section name="sec">${repeat}</section><group name="g" extend="$sec.r"/>`,
        );
        expect(d.errorCodes()).eqls(["doenet-e0065"]);
        expect(await d.typeOf("g")).eq("_error");
    });

    it("a group made from a collection named after an index", async () => {
        // in an iteration of a repeat, and in a pick of a select: before,
        // each showed nothing, with no message
        const inner = `<repeat name="r" for="1 2" valueName="j"><math>$j</math></repeat>`;
        for (const doenetML of [
            `<repeat name="outer" for="1 2" valueName="i">${inner}</repeat><group name="g" extend="$outer[1].r"/>`,
            `<select name="s" numToSelect="2"><option>${inner}</option><option>${inner}</option></select><group name="g" extend="$s[1].r"/>`,
        ]) {
            const d = await load(doenetML);
            expect(d.errorCodes()).eqls(["doenet-e0065"]);
            expect(await d.typeOf("g")).eq("_error");
        }
    });

    it("is reported at load in a case that is not true yet (DIAG-7)", async () => {
        const d = await load(
            `<booleanInput name="b"/>${repeat}<conditionalContent><case condition="$b"><group name="g" extend="$r"/></case></conditionalContent>`,
        );
        expect(d.errorCodes()).eqls(["doenet-e0065"]);
        await d.setBoolean("b", true);
        expect(d.errorCodes()).eqls(["doenet-e0065"]);
        expect(await d.typeOf("g")).eq("_error");
    });

    const allowed: [string, string][] = [
        [
            "a group",
            `<group name="h"><math>1</math><math>2</math></group><group name="g" extend="$h"/>`,
        ],
        [
            "a group holding a collection",
            `${repeat}<group name="h">$r</group><group name="g" extend="$h"/>`,
        ],
        ["an iteration", `${repeat}<group name="g" extend="$r[1]"/>`],
        [
            "a math named in an iteration",
            `<repeat name="outer" for="1 2" valueName="i"><math name="m">$i</math></repeat><group name="g" extend="$outer[1].m"/>`,
        ],
        [
            "a pick",
            `<select name="s" numToSelect="2"><option><math>1</math></option><option><math>2</math></option></select><group name="g" extend="$s[1]"/>`,
        ],
        [
            "a one-pick select",
            `<select name="s"><option><math>1</math></option><option><math>2</math></option></select><group name="g" extend="$s"/>`,
        ],
        [
            "a select whose numToSelect is written as 1",
            `<select name="s" numToSelect="1"><option><math>1</math></option><option><math>2</math></option></select><group name="g" copy="$s"/>`,
        ],
        [
            "a conditionalContent",
            `<booleanInput name="b"/><conditionalContent name="cc"><case condition="$b"><math>1</math></case><else><math>2</math></else></conditionalContent><group name="g" extend="$cc"/>`,
        ],
    ];
    for (const [label, doenetML] of allowed) {
        it(`a group made from ${label} is unchanged`, async () => {
            const d = await load(doenetML);
            expect(d.errorCodes()).eqls([]);
            expect(await d.typeOf("g")).eq("group");
        });
    }

    it("a group holding a list, and its name through it, still work", async () => {
        const d = await load(
            `<pointList name="pl"><point name="P">(1,2)</point><point>(3,4)</point></pointList><group name="g">$pl</group><point name="Q" extend="$g.P"/>`,
        );
        expect(d.errorCodes()).eqls([]);
        expect((await d.stateValue("Q", "xs")).map((x: any) => x.tree)).eqls([
            1, 2,
        ]);
    });
});

describe("A tag that makes its own content is made only from its own kind (D48 decision 2, #2594) @group4", () => {
    const ownContent: [string, string, string, string][] = [
        [
            "a repeat from a number",
            `<number name="n">2</number><repeat name="e" extend="$n"/>`,
            "repeat",
            "$n",
        ],
        [
            "a repeat from an iteration",
            `${repeat}<repeat name="e" extend="$r[1]"/>`,
            "repeat",
            "$r[1]",
        ],
        [
            "a repeat from a group",
            `<group name="h"><math>1</math></group><repeat name="e" extend="$h"/>`,
            "repeat",
            "$h",
        ],
        [
            "a select from a number",
            `<number name="n">2</number><select name="e" extend="$n"/>`,
            "select",
            "$n",
        ],
        [
            "a collect copied from a number",
            `<number name="n">2</number><collect name="e" copy="$n"/>`,
            "collect",
            "$n",
        ],
        [
            "a sort from a repeat",
            `${repeat}<sort name="e" extend="$r"/>`,
            "sort",
            "$r",
        ],
    ];
    for (const [label, doenetML, tag, source] of ownContent) {
        it(label, async () => {
            const d = await load(doenetML);
            const expected = [
                `doenet-e0071: A \`<${tag}>\` makes its content itself, so it can be made only from another \`<${tag}>\`, and \`${source}\` isn't one. To show it as it is, write \`${source}\`.`,
            ];
            expect(d.diagnostics()).eqls(expected);
            expect(await d.typeOf("e")).eq("_error");
            await d.reload();
            expect(d.diagnostics()).eqls(expected);
        });
    }

    it("a property is a value, as before", async () => {
        const d = await load(
            `<number name="n">2</number><repeat name="e" extend="$n.value"/>`,
        );
        expect(d.diagnostics()).eqls([
            "doenet-e0071: A `<repeat>` makes its content itself, so it can be made only from another `<repeat>`, and `$n.value` is a value. To show it as it is, write `$n.value`.",
        ]);
    });

    it("is reported at load in a case that is not true yet (DIAG-7)", async () => {
        const d = await load(
            `<booleanInput name="b"/><number name="n">2</number><conditionalContent><case condition="$b"><repeat name="e" extend="$n"/></case></conditionalContent>`,
        );
        expect(d.errorCodes()).eqls(["doenet-e0071"]);
        await d.setBoolean("b", true);
        expect(d.errorCodes()).eqls(["doenet-e0071"]);
    });

    const values: [string, string, string, string][] = [
        [
            "a sequence from a number",
            `<number name="n">2</number><sequence name="e" extend="$n"/>`,
            "sequence",
            "$n",
        ],
        [
            "a selectFromSequence from a number",
            `<number name="n">2</number><selectFromSequence name="e" extend="$n"/>`,
            "selectFromSequence",
            "$n",
        ],
        [
            "a sequence from a selectFromSequence, a class built on a sequence",
            `<selectFromSequence name="s" to="5" numToSelect="2"/><sequence name="e" extend="$s"/>`,
            "sequence",
            "$s",
        ],
        [
            "a sampleRandomNumbers from a selectRandomNumbers (#1986)",
            `<selectRandomNumbers name="s" type="gaussian" mean="3" standardDeviation="1" numToSelect="5"/><sampleRandomNumbers name="e" extend="$s"/><p name="p">$e</p>`,
            "sampleRandomNumbers",
            "$s",
        ],
        [
            "a sampleRandomNumbers from a one-pick selectRandomNumbers",
            `<selectRandomNumbers name="s"/><sampleRandomNumbers name="e" copy="$s"/>`,
            "sampleRandomNumbers",
            "$s",
        ],
        [
            "a selectRandomNumbers from a sampleRandomNumbers",
            `<sampleRandomNumbers name="s" numSamples="5"/><selectRandomNumbers name="e" extend="$s"/>`,
            "selectRandomNumbers",
            "$s",
        ],
    ];
    for (const [label, doenetML, tag, source] of values) {
        it(label, async () => {
            const d = await load(doenetML);
            const expected = [
                `doenet-e0071: A \`<${tag}>\` makes its values from its own attributes, so it can be made only from another \`<${tag}>\`, and \`${source}\` isn't always one. To show it as it is, write \`${source}\`.`,
            ];
            expect(d.diagnostics()).eqls(expected);
            expect(await d.typeOf("e")).eq("_error");
            await d.reload();
            expect(d.diagnostics()).eqls(expected);
        });
    }

    const sameTag: [string, string][] = [
        ["a repeat from a repeat", `${repeat}<repeat name="e" extend="$r"/>`],
        [
            "a select copied from a select",
            `<select name="s"><option><math>1</math></option></select><select name="e" copy="$s"/>`,
        ],
        [
            "a sampleRandomNumbers from a sampleRandomNumbers",
            `<sampleRandomNumbers name="s" numSamples="3"/><sampleRandomNumbers name="e" extend="$s"/>`,
        ],
        [
            "a selectRandomNumbers from a selectRandomNumbers",
            `<selectRandomNumbers name="s" numToSelect="3"/><selectRandomNumbers name="e" extend="$s"/>`,
        ],
        [
            "a sequence from a sequence",
            `<sequence name="s" to="3"/><sequence name="e" extend="$s"/>`,
        ],
    ];
    for (const [label, doenetML] of sameTag) {
        it(`${label} is allowed`, async () => {
            const d = await load(doenetML);
            expect(d.errorCodes()).eqls([]);
            expect(await d.typeOf("e")).not.eq("_error");
        });
    }
});

describe("An index into a conditionalContent is type-checked at load (REF-5) @group4", () => {
    const cc = (a: string, b: string) =>
        `<booleanInput name="b"/><conditionalContent name="cc"><case condition="$b">${a}</case><else>${b}</else></conditionalContent>`;

    it("a point from a case holding a text", async () => {
        const d = await load(
            `${cc("<text>hi</text>", "<text>bye</text>")}<point name="e" extend="$cc[1]"/>`,
        );
        const expected = [
            "doenet-e0065: A `<point>` can't be made from `$cc[1]`, which gives a `<text>`. To show it as it is, write `$cc[1]`.",
        ];
        expect(d.diagnostics()).eqls(expected);
        expect(await d.typeOf("e")).eq("_error");
        await d.setBoolean("b", true);
        expect(d.diagnostics()).eqls(expected);
        await d.reload();
        expect(d.diagnostics()).eqls(expected);
    });

    it("a boolean from a case holding a math", async () => {
        const d = await load(
            `${cc("<math>1</math>", "<math>2</math>")}<boolean name="e" extend="$cc[1]"/>`,
        );
        expect(d.diagnostics()).eqls([
            "doenet-e0065: A `<boolean>` can't be made from `$cc[1]`, which gives a `<math>`: a number is not true or false. To test it, write a comparison such as `<boolean>$cc[1] != 0</boolean>`.",
        ]);
        expect(await d.typeOf("e")).eq("_error");
    });

    it("a math from cases holding maths is unchanged", async () => {
        const d = await load(
            `${cc("<math>1</math>", "<math>2</math>")}<math name="e" extend="$cc[1]"/>`,
        );
        expect(d.diagnostics()).eqls([]);
        expect(await d.text("e")).eq("2");
        await d.setBoolean("b", true);
        expect(await d.text("e")).eq("1");
    });

    it("an index past the one shown case names nothing, whatever a case holds", async () => {
        // `$cc[2]` never names what a case holds, so it is not said to give
        // a `<text>`; it names nothing, as of cases holding maths.
        const d = await load(
            `${cc("<text>hi</text>", "<text>bye</text>")}<point name="e" extend="$cc[2]"/>`,
        );
        const expected = [
            "doenet-i0054: `$cc[2]` names nothing now, so this `<point>` is missing until it does.",
        ];
        expect(d.diagnostics()).eqls(expected);
        await d.setBoolean("b", true);
        expect(d.diagnostics()).eqls(expected);
        await d.reload();
        expect(d.diagnostics()).eqls(expected);
    });
});

describe("A scalar tag made from an iteration holding a list is decided at load (#2654 item 5) @group4", () => {
    const list = `<mathList name="x">1 2 3</mathList>`;

    it("a math from an iteration holding a reference to a mathList", async () => {
        const d = await load(
            `${list}<repeat name="r" for="1" valueName="v">$x</repeat><math name="e" extend="$r[1]"/>`,
        );
        const expected = [
            "doenet-e0064: A `<math>` can be made from a `<mathList>` only when it holds one component, and `$r[1]` holds 3. To use one of them, write `$r[1][1]`. To read them all as one value, write `<math>$r[1]</math>`.",
        ];
        expect(d.diagnostics()).eqls(expected);
        expect(await d.typeOf("e")).eq("_error");
        await d.reload();
        expect(d.diagnostics()).eqls(expected);
    });

    it("a math from an iteration holding a mathList written in it", async () => {
        const d = await load(
            `<repeat name="r" for="1" valueName="v"><mathList>1 2</mathList></repeat><math name="e" extend="$r[1]"/>`,
        );
        expect(d.errorCodes()).eqls(["doenet-e0064"]);
        expect(await d.typeOf("e")).eq("_error");
    });

    it("a math from an iteration holding $cc.x, a mathList in each case", async () => {
        const d = await load(
            `<booleanInput name="b"/><conditionalContent name="cc"><case condition="$b"><mathList name="x">1 2 3</mathList></case><else><mathList name="x">4 5</mathList></else></conditionalContent><repeat name="r" for="1" valueName="v">$cc.x</repeat><math name="e" extend="$r[1]"/>`,
        );
        expect(d.errorCodes()).eqls(["doenet-e0064"]);
        await d.setBoolean("b", true);
        expect(d.errorCodes()).eqls(["doenet-e0064"]);
    });

    it("a math from a group holding a mathList", async () => {
        const d = await load(
            `${list}<group name="h">$x</group><math name="e" extend="$h"/>`,
        );
        expect(d.errorCodes()).eqls(["doenet-e0064"]);
    });

    it("the message's index names an entry, or says to name the list", async () => {
        // An entry has no name of its own: the message gives an index that
        // names one, and the form it gives works.
        const h = await load(
            `${list}<group name="h">$x</group><math name="e" extend="$h"/><math name="f" extend="$h[1]"/>`,
        );
        expect(h.diagnostics()).eqls([
            "doenet-e0064: A `<math>` can be made from a `<mathList>` only when it holds one component, and `$h` holds 3. To use one of them, write `$h[1]`. To read them all as one value, write `<math>$h</math>`.",
        ]);
        expect(await h.text("f")).eq("1");
        const r = await load(
            `<repeat name="r" for="1"><mathList>1 2</mathList></repeat><math name="e" extend="$r[1]"/><math name="f" extend="$r[1][2]"/>`,
        );
        expect(r.diagnostics()).eqls([
            "doenet-e0064: A `<math>` can be made from a `<mathList>` only when it holds one component, and `$r[1]` holds 2. To use one of them, write `$r[1][1]`. To read them all as one value, write `<math>$r[1]</math>`.",
        ]);
        expect(await r.text("f")).eq("2");
        // `$cc[1]` is the shown case, so `$cc[1]` is not suggested
        const c = await load(
            `<conditionalContent name="cc"><case condition="true"><mathList name="l">1 2</mathList></case></conditionalContent><math name="e" extend="$cc"/><math name="f" extend="$cc.l[1]"/>`,
        );
        expect(c.diagnostics()).eqls([
            "doenet-e0064: A `<math>` can be made from a `<mathList>` only when it holds one component, and `$cc` holds 2. To use one of them, write an index after the name of the `<mathList>`, such as `[1]`, giving it a name if it has none. To read them all as one value, write `<math>$cc</math>`.",
        ]);
        expect(await c.text("f")).eq("1");
    });

    it("a list beside another component counts its entries", async () => {
        // the message counts all the group or iteration holds, not the list
        const g = await load(
            `<group name="g">${list}<math>4</math></group><math name="e" extend="$g"/>`,
        );
        expect(g.diagnostics()).eqls([
            "doenet-e0064: A `<math>` can be made from a `<group>` only when it holds one component, and `$g` holds 4. To use one of them, give it a name and refer to it by that name. To read them all as one value, write `<math>$g</math>`.",
        ]);
        const r = await load(
            `<repeat name="r" for="1" valueName="v"><mathList>1 2</mathList><math>3</math></repeat><math name="e" extend="$r[1]"/>`,
        );
        expect(r.diagnostics()).eqls([
            "doenet-e0064: A `<math>` can be made from `$r[1]` only when it always holds one component, and an iteration of the `<repeat>` holds 3. To read what it holds as one value, write `<math>$r[1]</math>`.",
        ]);
        const one = await load(
            `<group name="g"><mathList>1</mathList><math>2</math></group><math name="e" extend="$g"/>`,
        );
        expect(one.errorCodes()).eqls(["doenet-e0064"]);
    });

    it("is reported at load in a case that is not true yet (DIAG-7)", async () => {
        const d = await load(
            `<booleanInput name="b"/>${list}<conditionalContent><case condition="$b"><repeat name="r" for="1" valueName="v">$x</repeat><math name="e" extend="$r[1]"/></case></conditionalContent>`,
        );
        expect(d.errorCodes()).eqls(["doenet-e0064"]);
        await d.setBoolean("b", true);
        expect(d.errorCodes()).eqls(["doenet-e0064"]);
    });

    it("a mathList from iterations holding a mathList is allowed", async () => {
        const d = await load(
            `${list}<repeat name="r" for="1 2" valueName="v">$x</repeat><mathList name="e" extend="$r"/>`,
        );
        expect(d.errorCodes()).eqls([]);
        expect((await d.stateValue("e", "maths")).map((x: any) => x.tree)).eqls(
            [1, 2, 3, 1, 2, 3],
        );
    });
});
