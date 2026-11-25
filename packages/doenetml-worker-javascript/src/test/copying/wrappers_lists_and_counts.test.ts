import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";
import { setListFormsEnabled } from "../../utils/dast/listForms";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * The leftovers of #2670 (Doenet/DoenetML#2676): a list reached through an
 * iteration, a `<group>` made from a one-pick chooser or from a name after
 * an index inside a case, `e0064`'s count of what a group may hold, and a
 * tag that makes its own content made through a wrapper showing one of it
 * (D78.1, revised). Each is decided when the document loads where the
 * DoenetML decides it (DIAG-7), so it is the same live and after a reload
 * (DIAG-6).
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

    /** The codes of the warnings reported. */
    function warningCodes() {
        return getDiagnosticsByType(core).warnings.map((d: any) => d.code);
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

    /**
     * The text of the component `name` names, reading only that: `text`
     * evaluates every state variable, so it would also decide again an
     * extend that no longer watches what decides it.
     */
    async function textAlone(name: string) {
        const component = (core as any).core._components[
            await resolvePathToNodeIdx(name)
        ];
        return await component.stateValues.text;
    }

    async function setBoolean(name: string, boolean: boolean) {
        await updateBooleanInputValue({
            boolean,
            componentIdx: await resolvePathToNodeIdx(name),
            core,
        });
    }

    async function setMath(name: string, latex: string) {
        await updateMathInputValue({
            latex,
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
        warningCodes,
        typeOf,
        text,
        textAlone,
        setBoolean,
        setMath,
        reload,
    };
}

describe("A list reached through an iteration (#2676 items 1 and 2; REF-5, VAL-5) @group4", () => {
    it("a list of one entry is that entry, as made directly", async () => {
        for (const template of [
            "$x",
            "<mathList>$x</mathList>",
            `<mathList extend="$x"/>`,
        ]) {
            const d = await load(
                `<mathList name="x">7</mathList><repeat name="r" for="1">${template}</repeat><math name="e" extend="$r[1]"/><math name="direct" extend="$x"/>`,
            );
            expect(d.diagnostics(), template).eqls([]);
            expect(await d.text("e"), template).eq("7");
            expect(await d.text("direct")).eq("7");
            await d.reload();
            expect(await d.text("e"), template).eq("7");
        }
    });

    it("a count the DoenetML decides is an error at load, as made directly", async () => {
        const cases: [string, number][] = [
            [`<mathList>$ml2</mathList>`, 2],
            [`<mathList>$ml2 $ml2</mathList>`, 4],
            [`<mathList extend="$x"/>`, 3],
        ];
        for (const [template, count] of cases) {
            const d = await load(
                `<mathList name="ml2">1 2</mathList><mathList name="x">1 2 3</mathList><booleanInput name="b"/><conditionalContent><case condition="$b"><repeat name="r" for="1">${template}</repeat><math name="e" extend="$r[1]"/></case></conditionalContent>`,
            );
            // reported at load, in a case not shown yet (DIAG-7)
            expect(d.errorCodes(), template).eqls(["doenet-e0064"]);
            expect(d.diagnostics()[0], template).contains(
                `\`$r[1]\` holds ${count}.`,
            );
        }
        // the `maxNumber` of the list named, or of the list holding it
        const capped: [string, string, number | undefined][] = [
            [`maxNumber="2"`, `<mathList>$ml3</mathList>`, 2],
            [`maxNumber="1"`, `<mathList>$ml3</mathList>`, undefined],
            [``, `<mathList maxNumber="1">$ml3</mathList>`, undefined],
            [`maxNumber="2"`, `<mathList extend="$ml3"/>`, 2],
        ];
        for (const [attribute, template, count] of capped) {
            const d = await load(
                `<mathList name="ml3" ${attribute}>1 2 3</mathList><repeat name="r" for="1">${template}</repeat><math name="e" extend="$r[1]"/>`,
            );
            if (count === undefined) {
                expect(d.diagnostics(), template).eqls([]);
                expect(await d.text("e"), template).eq("1");
            } else {
                expect(d.errorCodes(), template).eqls(["doenet-e0064"]);
                expect(d.diagnostics()[0], template).contains(
                    `\`$r[1]\` holds ${count}.`,
                );
            }
        }
        // the same list made directly
        const direct = await load(
            `<mathList name="ml2">1 2</mathList><mathList name="l">$ml2</mathList><math name="e" extend="$l"/>`,
        );
        expect(direct.errorCodes()).eqls(["doenet-e0064"]);
    });

    it("a count a value decides is a blank with a warning while it isn't one", async () => {
        const d = await load(
            `<mathInput name="n" prefill="3"/><repeat name="r" for="1"><mathList><sequence length="$n"/></mathList></repeat><math name="e" extend="$r[1]"/>`,
        );
        expect(d.diagnostics()).eqls([
            "doenet-e0064: A `<math>` can be made from a `<mathList>` only when it holds one component, and `$r[1]` holds 3. To use one of them, write `$r[1][1]`. To read them all as one value, write `<math>$r[1]</math>`.",
        ]);
        expect(d.errorCodes()).eqls([]);
        expect(await d.text("e")).eq("＿");
        await d.setMath("n", "1");
        expect(await d.text("e")).eq("1");
        await d.reload();
        expect(await d.text("e")).eq("1");
    });

    it("the count is watched: the tag is decided again when it changes, with nothing else read", async () => {
        for (const [doenetML, start, values] of [
            [
                `<mathInput name="n" prefill="3"/><repeat name="r" for="1"><mathList><sequence length="$n"/></mathList></repeat><math name="e" extend="$r[1]"/>`,
                "＿",
                [
                    ["1", "1"],
                    ["2", "＿"],
                    ["1", "1"],
                    ["0", "＿"],
                    ["1", "1"],
                ],
            ],
            [
                `<mathInput name="n" prefill="2"/><conditionalContent name="cc"><case condition="true"><mathList><sequence length="$n"/></mathList></case></conditionalContent><math name="e" extend="$cc"/>`,
                "＿",
                [
                    ["1", "1"],
                    ["2", "＿"],
                ],
            ],
            [
                `<mathInput name="n" prefill="2"/><mathList name="l0">4 5 6</mathList><group name="g"><mathList maxNumber="$n">$l0</mathList></group><math name="e" extend="$g"/>`,
                "＿",
                [
                    ["1", "4"],
                    ["3", "＿"],
                    ["1", "4"],
                ],
            ],
        ] as [string, string, [string, string][]][]) {
            const d = await load(doenetML);
            expect(await d.textAlone("e"), doenetML).eq(start);
            for (const [n, shown] of values) {
                await d.setMath("n", n);
                expect(await d.textAlone("e"), `${doenetML} n=${n}`).eq(shown);
            }
        }
    });

    it("a list holding nothing says so, with no entry to use", async () => {
        const d = await load(
            `<mathInput name="n" prefill="0"/><repeat name="r" for="1"><mathList><sequence length="$n"/></mathList></repeat><math name="e" extend="$r[1]"/>`,
        );
        expect(d.diagnostics()).eqls([
            "doenet-e0064: A `<math>` can't be made from `$r[1]`, a `<mathList>` that holds nothing.",
        ]);
        expect(d.errorCodes()).eqls([]);
        expect(await d.text("e")).eq("＿");
        await d.setMath("n", "1");
        expect(await d.text("e")).eq("1");
    });

    it("a reference beside an entry is a blank with a warning, not the list in a math", async () => {
        const d = await load(
            `<math name="a">1</math><repeat name="r" for="1"><mathList>$a 2</mathList></repeat><math name="e" extend="$r[1]"/>`,
        );
        expect(d.errorCodes()).eqls([]);
        expect(d.warningCodes()).eqls(["doenet-e0064"]);
        expect(await d.text("e")).eq("＿");
    });
});

describe("A <group> made from a one-pick chooser or a name after an index in a case (#2676 items 4 and 5; D72, D77) @group4", () => {
    const errors: [string, string, string][] = [
        [
            "a one-pick selectFromSequence",
            `<selectFromSequence name="sfs" from="1" to="5"/><group name="g" extend="$sfs"/>`,
            'doenet-e0065: A `<group>` can\'t be made from `$sfs`, a `<selectFromSequence>` that picks one `<number>`: it stands for that one component, which is not a group. To put it in a group, write `<group>$sfs</group>`, with anything else the group holds beside it. To show the same `<number>` again, write `<number extend="$sfs"/>`.',
        ],
        [
            "one picking letters, copied",
            `<selectFromSequence name="sfs" type="letters" from="a" to="e" numToSelect="1"/><group name="g" copy="$sfs"/>`,
            'doenet-e0065: A `<group>` can\'t be made from `$sfs`, a `<selectFromSequence>` that picks one `<text>`: it stands for that one component, which is not a group. To put it in a group, write `<group>$sfs</group>`, with anything else the group holds beside it. To show the same `<text>` again, write `<text copy="$sfs"/>`.',
        ],
        [
            "a selectRandomNumbers",
            `<selectRandomNumbers name="s"/><group name="g" extend="$s"/>`,
            'doenet-e0065: A `<group>` can\'t be made from `$s`, a `<selectRandomNumbers>` that picks one `<number>`: it stands for that one component, which is not a group. To put it in a group, write `<group>$s</group>`, with anything else the group holds beside it. To show the same `<number>` again, write `<number extend="$s"/>`.',
        ],
        [
            "a copy of a one-pick chooser",
            `<selectFromSequence name="sfs" from="1" to="5"/><selectFromSequence name="t" copy="$sfs"/><group name="g" extend="$t"/>`,
            'doenet-e0065: A `<group>` can\'t be made from `$t`, a `<selectFromSequence>` that picks one `<number>`: it stands for that one component, which is not a group. To put it in a group, write `<group>$t</group>`, with anything else the group holds beside it. To show the same `<number>` again, write `<number extend="$t"/>`.',
        ],
        [
            "a name after an index into a repeat in an unnamed case",
            `<conditionalContent><case condition="true"><repeat name="r" for="1 2"><math name="m">x</math></repeat></case></conditionalContent><group name="g" extend="$r[1].m"/>`,
            'doenet-e0065: A `<group>` can\'t be made from `$r[1].m`, a `<math>`: a `<math>` is one component, not a group, and keeps its kind when a tag is made from it. To put it in a group, write `<group>$r[1].m</group>`, with anything else the group holds beside it. To show the same `<math>` again, write `<math extend="$r[1].m"/>`.',
        ],
        [
            "a name after an index into a repeat in a named case",
            `<conditionalContent name="cc"><case condition="true"><repeat name="r" for="1 2"><mathList name="m">x y</mathList></repeat></case></conditionalContent><group name="g" extend="$cc.r[1].m"/>`,
            'doenet-e0065: A `<group>` can\'t be made from `$cc.r[1].m`, a `<mathList>`: a `<mathList>` holds many things, and keeps its kind when a tag is made from it. To put it in a group, write `<group>$cc.r[1].m</group>`, with anything else the group holds beside it. To show the same `<mathList>` again, write `<mathList extend="$cc.r[1].m"/>`.',
        ],
        [
            "a name after an index in a section",
            `<section name="sec"><repeat name="r" for="1 2"><math name="m">x</math></repeat></section><group name="g" extend="$sec.r[1].m"/>`,
            'doenet-e0065: A `<group>` can\'t be made from `$sec.r[1].m`, a `<math>`: a `<math>` is one component, not a group, and keeps its kind when a tag is made from it. To put it in a group, write `<group>$sec.r[1].m</group>`, with anything else the group holds beside it. To show the same `<math>` again, write `<math extend="$sec.r[1].m"/>`.',
        ],
    ];
    for (const [label, doenetML, expected] of errors) {
        it(`${label} is an error at load`, async () => {
            const d = await load(doenetML);
            expect(d.diagnostics()).eqls([expected]);
            expect(await d.typeOf("g")).eq("_error");
            await d.reload();
            expect(d.diagnostics()).eqls([expected]);
        });
    }

    it("in a case not shown, it is reported at load (DIAG-7)", async () => {
        const d = await load(
            `<booleanInput name="b"/><conditionalContent><case condition="$b"><repeat name="r" for="1 2"><math name="m">x</math></repeat></case></conditionalContent><selectFromSequence name="sfs" from="1" to="5"/><conditionalContent><case condition="$b"><group name="g" extend="$sfs"/></case></conditionalContent><group name="h" extend="$r[1].m"/>`,
        );
        expect(d.errorCodes()).eqls(["doenet-e0065", "doenet-e0065"]);
        await d.setBoolean("b", true);
        expect(d.errorCodes()).eqls(["doenet-e0065", "doenet-e0065"]);
    });

    const allowed: [string, string][] = [
        [
            "a pick of a chooser that picks several",
            `<selectFromSequence name="sfs" from="1" to="5" numToSelect="2"/><group name="g" extend="$sfs[2]"/>`,
        ],
        [
            "a one-pick select",
            `<select name="s"><option><math>1</math></option><option><math>2</math></option></select><group name="g" extend="$s"/>`,
        ],
        [
            "a group holding a one-pick chooser",
            `<selectFromSequence name="sfs" from="1" to="5"/><group name="h">$sfs</group><group name="g" extend="$h"/>`,
        ],
        [
            "a group named after an index in a case",
            `<conditionalContent><case condition="true"><repeat name="r" for="1 2"><group name="m"><math>x</math></group></repeat></case></conditionalContent><group name="g" extend="$r[1].m"/>`,
        ],
    ];
    for (const [label, doenetML] of allowed) {
        it(`${label} is allowed, as before`, async () => {
            const d = await load(doenetML);
            expect(d.errorCodes()).eqls([]);
            expect(await d.typeOf("g")).eq("group");
        });
    }
});

describe("A <group> made from a collect, sort or shuffle in either build (#2676 item 6; COMP-4) @group4", () => {
    const sources: [string, string][] = [
        [
            "collect",
            `<p name="q"><math>1</math><math>2</math></p><collect name="c" componentType="math" from="$q"/>`,
        ],
        ["sort", `<sort name="c">3 1 2</sort>`],
        ["shuffle", `<shuffle name="c"><math>1</math><math>2</math></shuffle>`],
    ];
    for (const asLists of [true, false]) {
        for (const [tag, source] of sources) {
            it(`a group made from a ${tag} ${asLists ? "made a list" : "kept a composite"}`, async () => {
                setListFormsEnabled(asLists);
                try {
                    const d = await load(
                        `${source}<group name="g" extend="$c"/>`,
                    );
                    expect(d.diagnostics()).eqls([
                        `doenet-e0065: A \`<group>\` can't be made from \`$c\`, a \`<${tag}>\`: a \`<${tag}>\` holds many things, and keeps its kind when a tag is made from it. To put it in a group, write \`<group>$c</group>\`, with anything else the group holds beside it. To show the same \`<${tag}>\` again, write \`<${tag} extend="$c"/>\`.`,
                    ]);
                    expect(await d.typeOf("g")).eq("_error");
                } finally {
                    setListFormsEnabled(true);
                }
            });
        }
    }
});

describe("e0064 says what a group may hold (#2676 item 7; DIAG-2) @group4", () => {
    const counts: [string, string, string][] = [
        [
            "a case with no else, beside two",
            `<conditionalContent><case condition="false"><math>1</math></case></conditionalContent><math>2</math><math>3</math>`,
            "may hold up to 3",
        ],
        [
            "a case with no else, beside one",
            `<conditionalContent><case condition="false"><math>1</math></case></conditionalContent><math>2</math>`,
            "may hold up to 2",
        ],
        [
            "a case beside an empty else, beside two",
            `<conditionalContent><case condition="false"><math>1</math></case><else/></conditionalContent><math>2</math><math>3</math>`,
            "may hold up to 3",
        ],
        [
            "a case beside an empty else, beside one",
            `<conditionalContent><case condition="false"><math>1</math></case><else/></conditionalContent><math>2</math>`,
            "may hold up to 2",
        ],
        [
            "a case and an else each holding one, beside one",
            `<conditionalContent><case condition="false"><math>1</math></case><else><math>4</math></else></conditionalContent><math>2</math>`,
            "holds 2",
        ],
    ];
    for (const [label, content, holds] of counts) {
        it(label, async () => {
            const d = await load(
                `<group name="g">${content}</group><math name="e" extend="$g"/>`,
            );
            expect(d.diagnostics()).eqls([
                `doenet-e0064: A \`<math>\` can be made from a \`<group>\` only when it holds one component, and \`$g\` ${holds}. To use one of them, give it a name and refer to it by that name. To read them all as one value, write \`<math>$g</math>\`.`,
            ]);
            expect(await d.typeOf("e")).eq("_error");
        });
    }

    it("a case holding several says what that case holds", async () => {
        const d = await load(
            `<conditionalContent name="cc"><case condition="false"><math>1</math><math>2</math></case></conditionalContent><math name="e" extend="$cc"/>`,
        );
        expect(d.diagnostics()).eqls([
            "doenet-e0064: A `<math>` can be made from `$cc` only when it always holds one component, and a case of the `<conditionalContent>` holds 2. To read what it holds as one value, write `<math>$cc</math>`.",
        ]);
    });

    it("a case beside an empty else, alone, is one or none, as before", async () => {
        const d = await load(
            `<booleanInput name="b"/><conditionalContent name="cc"><case condition="$b"><math>1</math></case><else/></conditionalContent><math name="e" extend="$cc"/>`,
        );
        expect(d.errorCodes()).eqls([]);
        expect(await d.text("e")).eq("＿");
        await d.setBoolean("b", true);
        expect(await d.text("e")).eq("1");
    });
});

describe("A tag that makes its own content, made through a wrapper showing one of it (#2676 item 9; D78.1 revised, D72, D74) @group4", () => {
    const cc = (a: string, b: string) =>
        `<booleanInput name="b"/><conditionalContent name="cc"><case condition="$b">${a}</case><else>${b}</else></conditionalContent>`;
    const rA = `<repeat name="r" for="1 2 3" valueName="v"><text>a$v</text></repeat>`;
    const rB = `<repeat name="r" for="4 5" valueName="v"><text>b$v</text></repeat>`;

    for (const source of ["$cc", "$cc.r"]) {
        it(`<repeat extend="${source}"/> follows the case shown, live and after a reload`, async () => {
            const d = await load(
                `${cc(rA, rB)}<p name="p"><repeat name="r2" extend="${source}"/></p><p name="n">$r2.numItems</p><text name="t" extend="$r2[2]"/>`,
            );
            expect(d.diagnostics()).eqls([]);
            expect(await d.text("p")).eq("b4, b5");
            expect(await d.text("n")).eq("2");
            expect(await d.text("t")).eq("b5");
            await d.setBoolean("b", true);
            expect(await d.text("p")).eq("a1, a2, a3");
            expect(await d.text("n")).eq("3");
            expect(await d.text("t")).eq("a2");
            await d.reload();
            expect(d.diagnostics()).eqls([]);
            expect(await d.text("p")).eq("a1, a2, a3");
            expect(await d.text("n")).eq("3");
            expect(await d.text("t")).eq("a2");
            await d.setBoolean("b", false);
            expect(await d.text("p")).eq("b4, b5");
            expect(await d.text("n")).eq("2");
            expect(await d.text("t")).eq("b5");
        });
    }

    it("a name after an index into it reaches into the iteration shown, as after `$cc.r`", async () => {
        const named = (v: string) =>
            `<repeat name="r" for="${v}" valueName="v"><text name="t">$v</text></repeat>`;
        for (const source of ["$cc", "$cc.r"]) {
            const d = await load(
                `${cc(named("1 2 3"), named("4 5"))}<repeat name="r2" extend="${source}"/><p name="p">$r2[2].t</p><p name="q"><text extend="$r2[1].t"/></p>`,
            );
            expect(d.diagnostics(), source).eqls([]);
            expect(await d.text("p"), source).eq("5");
            expect(await d.text("q"), source).eq("4");
            await d.setBoolean("b", true);
            expect(await d.text("p"), source).eq("2");
            expect(await d.text("q"), source).eq("1");
        }
    });

    it("shows nothing while no case is shown, or the case shown is empty", async () => {
        for (const doenetML of [
            `<booleanInput name="b"/><conditionalContent name="cc"><case condition="$b">${rA}</case></conditionalContent>`,
            cc(rA, ""),
        ]) {
            const d = await load(
                `${doenetML}<p name="p"><repeat name="r2" extend="$cc"/></p>`,
            );
            expect(d.diagnostics()).eqls([]);
            expect(await d.text("p")).eq("");
            await d.setBoolean("b", true);
            expect(await d.text("p")).eq("a1, a2, a3");
            await d.reload();
            expect(await d.text("p")).eq("a1, a2, a3");
        }
    });

    for (const how of ["copy", "copyWithState"]) {
        it(`a ${how} is made from the repeat shown, and keeps it after a reload`, async () => {
            // `$cc.r` too: a save made after the case changed loads, though
            // the repeat it was made from is not made then
            for (const source of ["$cc", "$cc.r"]) {
                const d = await load(
                    `${cc(rA, rB)}<p name="p"><repeat name="r2" ${how}="${source}"/></p>`,
                );
                expect(d.diagnostics(), source).eqls([]);
                expect(await d.text("p"), source).eq("b4, b5");
                // unlinked: it keeps what it was made from (D33)
                await d.setBoolean("b", true);
                expect(await d.text("p"), source).eq("b4, b5");
                await d.reload();
                expect(await d.text("p"), source).eq("b4, b5");
            }
        });
    }

    it("through a one-pick select, a group of one, and a group in a case", async () => {
        for (const [doenetML, shown] of [
            [`<select name="s"><option>${rA}</option></select>`, "$s"],
            [`<group name="h">${rA}</group>`, "$h"],
            [
                `<group name="h" extend="$k"/><group name="k">${rA}</group>`,
                "$h",
            ],
            [
                `<conditionalContent name="cc"><case condition="true"><group>${rA}</group></case><else>${rB}</else></conditionalContent>`,
                "$cc",
            ],
        ]) {
            const d = await load(
                `${doenetML}<p name="p"><repeat name="r2" extend="${shown}"/></p><p name="n">$r2.numItems</p>`,
            );
            expect(d.diagnostics(), doenetML).eqls([]);
            expect(await d.text("p"), doenetML).eq("a1, a2, a3");
            expect(await d.text("n"), doenetML).eq("3");
        }
    });

    it("other tags that make their own content", async () => {
        const collect = await load(
            `${cc(`<collect name="c" componentType="text" from="$q1"/>`, `<collect name="c" componentType="text" from="$q2"/>`)}<p name="q1"><text>x</text></p><p name="q2"><text>y</text><text>z</text></p><p name="p"><collect name="c2" extend="$cc"/></p>`,
        );
        expect(collect.diagnostics()).eqls([]);
        expect(await collect.text("p")).eq("y, z");
        await collect.setBoolean("b", true);
        expect(await collect.text("p")).eq("x");

        for (const asLists of [true, false]) {
            setListFormsEnabled(asLists);
            try {
                const sort = await load(
                    `${cc(`<sort>3 1 2</sort>`, `<sort>9 8</sort>`)}<p name="p"><sort name="c2" extend="$cc"/></p>`,
                );
                expect(sort.diagnostics()).eqls([]);
                expect(await sort.text("p")).eq("8, 9");
                await sort.setBoolean("b", true);
                expect(await sort.text("p")).eq("1, 2, 3");
            } finally {
                setListFormsEnabled(true);
            }
        }
    });

    it("cases holding a repeat and another type, or several, are e0095", async () => {
        const types = await load(
            `${cc(rA, `<math>1</math>`)}<repeat name="r2" extend="$cc"/>`,
        );
        expect(types.diagnostics()).eqls([
            "doenet-e0095: A `<repeat>` can't be made from `$cc`: it is made from the `<repeat>` the case shown holds, which must be one `<repeat>`, or nothing, in every case of `cc`, and one holds a `<repeat>` and another a `<math>`. To show what it holds as it is, write `$cc`.",
        ]);
        expect(await types.typeOf("r2")).eq("_error");

        const several = await load(
            `${cc(rA, rB + rB)}<repeat name="r2" extend="$cc"/>`,
        );
        expect(several.diagnostics()).eqls([
            "doenet-e0095: A `<repeat>` can't be made from `$cc`: it is made from the `<repeat>` the case shown holds, which must be one `<repeat>`, or nothing, in every case of `cc`, and the `<else>` holds several components. To show what it holds as it is, write `$cc`.",
        ]);

        const options = await load(
            `<select name="s"><option>${rA}</option><option>${rA}${rB}</option></select><repeat name="r2" extend="$s"/>`,
        );
        expect(options.errorCodes()).eqls(["doenet-e0095"]);
        expect(options.diagnostics()[0]).contains("option 2 holds several");
    });

    it("a bare reference to a repeat in a case is its iterations, not a repeat, decided at load", async () => {
        const rx = `<repeat name="rx" for="7 8" valueName="v"><text>x$v</text></repeat>`;
        const beside = await load(
            `${rx}${cc("$rx", rB)}<repeat name="r2" extend="$cc"/>`,
        );
        // before the case holding it is shown (DIAG-7)
        expect(beside.diagnostics()).eqls([
            "doenet-e0095: A `<repeat>` can't be made from `$cc`: it is made from the `<repeat>` the case shown holds, which must be one `<repeat>`, or nothing, in every case of `cc`, and case 1 holds several components. To show what it holds as it is, write `$cc`.",
        ]);
        expect(await beside.typeOf("r2")).eq("_error");

        for (const doenetML of [
            `<booleanInput name="b"/><conditionalContent name="cc"><case condition="$b">$rx</case></conditionalContent>`,
            `<group name="cc">$rx</group>`,
        ]) {
            const d = await load(
                `${rx}${doenetML}<repeat name="r2" extend="$cc"/>`,
            );
            expect(d.errorCodes(), doenetML).eqls(["doenet-e0071"]);
        }

        // a bare reference to a wrapper is read through, as written there
        for (const held of [
            `<group name="g">${rA}</group>`,
            `<select name="g"><option>${rA}</option></select>`,
        ]) {
            const d = await load(
                `${held}${cc("$g", rB)}<p name="p"><repeat name="r2" extend="$cc"/></p>`,
            );
            expect(d.diagnostics(), held).eqls([]);
            expect(await d.text("p")).eq("b4, b5");
            await d.setBoolean("b", true);
            expect(await d.text("p")).eq("a1, a2, a3");
        }
    });

    const stillOwnKind: [string, string, string][] = [
        [
            "cases that hold no repeat",
            `<conditionalContent name="cc"><case condition="true"><math>1</math></case><else><math>2</math></else></conditionalContent>`,
            "$cc",
        ],
        [
            "a group holding a repeat beside a math",
            `<group name="cc">${rA}<math>1</math></group>`,
            "$cc",
        ],
        [
            "a select that picks two",
            `<select name="cc" numToSelect="2"><option>${rA}</option><option>${rB}</option></select>`,
            "$cc",
        ],
        [
            "an iteration holding a repeat",
            `<repeat name="outer" for="1"><repeat for="1 2">x</repeat></repeat>`,
            "$outer[1]",
        ],
    ];
    for (const [label, doenetML, source] of stillOwnKind) {
        it(`${label} is still e0071`, async () => {
            const d = await load(
                `${doenetML}<repeat name="r2" extend="${source}"/>`,
            );
            expect(d.diagnostics()).eqls([
                `doenet-e0071: A \`<repeat>\` makes its content itself, so it can be made only from another \`<repeat>\`, and \`${source}\` isn't one. To show it as it is, write \`${source}\`.`,
            ]);
            expect(await d.typeOf("r2")).eq("_error");
        });
    }
});
