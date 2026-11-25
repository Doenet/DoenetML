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
 * tag that makes its own content made from a reference that can name a
 * different written tag as what is shown changes (D78.1). Each is decided when the document loads where the
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

describe("A tag that makes its own content is made only from a reference that always names the same written tag (#2676 item 9; D78.1) @group4", () => {
    const cc = (a: string, b: string) =>
        `<booleanInput name="b"/><conditionalContent name="cc"><case condition="$b">${a}</case><else>${b}</else></conditionalContent>`;
    const rA = `<repeat name="r" for="1 2 3" valueName="v"><text>a$v</text></repeat>`;
    const rB = `<repeat name="r" for="4 5" valueName="v"><text>b$v</text></repeat>`;

    /** The message for a reference that names what is shown. */
    function shown(
        tag: string,
        source: string,
        branch: "case shown" | "option picked",
        makes = "makes its content itself",
    ) {
        return `doenet-e0071: A \`<${tag}>\` ${makes}, so it can be made only from a reference that always names the same \`<${tag}>\`, and \`${source}\` names what the ${branch} holds, which would change with what is shown. To show it as it is, write \`${source}\`.`;
    }

    const throughBranches: [string, string, string, string, string?][] = [
        ["$cc", cc(rA, rB), "repeat", "case shown"],
        ["$cc.r", cc(rA, rB), "repeat", "case shown"],
        [
            "$cc2.r, through a copy of the conditionalContent",
            `${cc(rA, rB)}<conditionalContent name="cc2" extend="$cc"/>`,
            "repeat",
            "case shown",
            "$cc2.r",
        ],
        [
            "$s.r of a select that picks one",
            `<select name="s"><option>${rA}</option><option>${rB}</option></select>`,
            "repeat",
            "option picked",
            "$s.r",
        ],
        [
            "$s[2].r of a select that picks several",
            `<select name="s" numToSelect="2"><option>${rA}</option><option>${rB}</option></select>`,
            "repeat",
            "option picked",
            "$s[2].r",
        ],
        [
            "$outer[1].cc.r, through an iteration",
            `<booleanInput name="b"/><repeat name="outer" for="1 2"><conditionalContent name="cc"><case condition="$b">${rA}</case><else>${rB}</else></conditionalContent></repeat>`,
            "repeat",
            "case shown",
            "$outer[1].cc.r",
        ],
        [
            "$sec2.s.r, through a copy of a section",
            `<section name="sec"><select name="s"><option>${rA}</option><option>${rB}</option></select></section><section name="sec2" copy="$sec"/>`,
            "repeat",
            "option picked",
            "$sec2.s.r",
        ],
        [
            "$r of a repeat in each case of a conditionalContent with no name",
            `<conditionalContent><case condition="true">${rA}</case><else>${rB}</else></conditionalContent>`,
            "repeat",
            "case shown",
            "$r",
        ],
    ];
    for (const [label, doenetML, tag, branch, written] of throughBranches) {
        const source = written ?? label;
        for (const how of ["extend", "copy", "copyWithState"]) {
            it(`<repeat ${how}="${source}"/>, ${label}, is e0071 at load`, async () => {
                const d = await load(
                    `${doenetML}<p name="p"><${tag} name="r2" ${how}="${source}"/></p>`,
                );
                const expected = [shown(tag, source, branch as any)];
                expect(d.diagnostics()).eqls(expected);
                expect(await d.typeOf("r2")).eq("_error");
                if (doenetML.includes(`name="b"`)) {
                    await d.setBoolean("b", true);
                    expect(d.diagnostics()).eqls(expected);
                }
                await d.reload();
                expect(d.diagnostics()).eqls(expected);
            });
        }
    }

    it("other tags that make their own content", async () => {
        const forms: [string, string, string, string?][] = [
            [
                "collect",
                cc(
                    `<collect name="c" componentType="text" from="$q1"/>`,
                    `<collect name="c" componentType="text" from="$q2"/>`,
                ) +
                    `<p name="q1"><text>x</text></p><p name="q2"><text>y</text></p>`,
                "$cc.c",
            ],
            [
                "sort",
                cc(`<sort name="c">3 1 2</sort>`, `<sort name="c">9 8</sort>`),
                "$cc.c",
            ],
            [
                "shuffle",
                cc(
                    `<shuffle name="c">3 1 2</shuffle>`,
                    `<shuffle name="c">9 8</shuffle>`,
                ),
                "$cc.c",
            ],
            [
                "conditionalContent",
                cc(
                    `<conditionalContent name="c"><case condition="true"><math>1</math></case></conditionalContent>`,
                    `<conditionalContent name="c"><case condition="true"><math>2</math></case></conditionalContent>`,
                ),
                "$cc.c",
            ],
            [
                "sequence",
                cc(
                    `<sequence name="c" to="3"/>`,
                    `<sequence name="c" to="5"/>`,
                ),
                "$cc.c",
                "makes its values from its own attributes",
            ],
            [
                "selectFromSequence",
                cc(
                    `<selectFromSequence name="c" to="3"/>`,
                    `<selectFromSequence name="c" to="5"/>`,
                ),
                "$cc.c",
                "makes its values from its own attributes",
            ],
            [
                "sequence",
                cc(
                    `<sequence name="c" to="3"/>`,
                    `<sequence name="c" to="5"/>`,
                ),
                "$cc",
                "makes its values from its own attributes",
            ],
        ];
        for (const [tag, doenetML, source, makes] of forms) {
            const d = await load(
                `${doenetML}<${tag} name="e" extend="${source}"/>`,
            );
            expect(d.diagnostics(), `${tag} ${source}`).eqls([
                shown(tag, source, "case shown", makes),
            ]);
            expect(await d.typeOf("e")).eq("_error");
        }
    });

    it("is reported at load in a case not shown (DIAG-7)", async () => {
        const d = await load(
            `${cc(rA, rB)}<booleanInput name="b2"/><conditionalContent><case condition="$b2"><repeat name="r2" extend="$cc.r"/></case></conditionalContent>`,
        );
        expect(d.errorCodes()).eqls(["doenet-e0071"]);
        await d.setBoolean("b2", true);
        expect(d.errorCodes()).eqls(["doenet-e0071"]);
    });

    it("a name some case lacks is e0093, as before", async () => {
        const d = await load(
            `${cc(rA, `<math>1</math>`)}<repeat name="r2" extend="$cc.r"/>`,
        );
        expect(d.errorCodes()).eqls(["doenet-e0093"]);
    });

    const allowed: [string, string, string, string][] = [
        ["$r", rA, "$r", "a1, a2, a3"],
        [
            "$sec.r",
            `<section name="sec">${rA}</section>`,
            "$sec.r",
            "a1, a2, a3",
        ],
        ["$g.r", `<group name="g">${rA}</group>`, "$g.r", "a1, a2, a3"],
        [
            "$r3 of a repeat that extends $r",
            `${rA}<repeat name="r3" extend="$r"/>`,
            "$r3",
            "a1, a2, a3",
        ],
        [
            "$outer[$k].inner, an index a value decides",
            `<mathInput name="k" prefill="2"/><repeat name="outer" for="1 2" valueName="w"><repeat name="inner" for="$w 7" valueName="v"><text>i$v</text></repeat></repeat>`,
            "$outer[$k].inner",
            "i2, i7",
        ],
        [
            "$outer[1].g.r",
            `<repeat name="outer" for="1 2"><group name="g">${rA}</group></repeat>`,
            "$outer[1].g.r",
            "a1, a2, a3",
        ],
        [
            "$sec2.r of a copy of a section",
            `<section name="sec">${rA}</section><section name="sec2" copy="$sec"/>`,
            "$sec2.r",
            "a1, a2, a3",
        ],
        [
            "$r of the one repeat in a case",
            `<conditionalContent><case condition="true">${rA}</case></conditionalContent>`,
            "$r",
            "a1, a2, a3",
        ],
    ];
    for (const [label, doenetML, source, text] of allowed) {
        it(`${label} is allowed`, async () => {
            const d = await load(
                `${doenetML}<p name="p"><repeat name="r2" extend="${source}"/></p>`,
            );
            expect(d.diagnostics()).eqls([]);
            expect(await d.text("p")).eq(text);
        });
    }

    it("a copy of a wrapper as its own tag is allowed, as before", async () => {
        const d = await load(
            `${cc(`<math>1</math>`, `<math>2</math>`)}<conditionalContent name="cc2" extend="$cc"/><p name="p">$cc2</p><select name="s"><option><math>3</math></option></select><select name="s2" extend="$s"/><p name="q">$s2</p>`,
        );
        expect(d.diagnostics()).eqls([]);
        expect(await d.text("p")).eq("2");
        expect(await d.text("q")).eq("3");
    });

    it("showing it, or a new tag holding it, is unchanged", async () => {
        const d = await load(
            `${cc(rA, rB)}<p name="p">$cc.r</p><p name="p2">$cc[2]</p><text name="t" extend="$cc.r[2]"/><shuffle name="sh">$cc.r</shuffle><p name="q">$sh</p><collect name="col" componentType="text" from="$cc"/><p name="c">$col</p>`,
        );
        expect(d.diagnostics()).eqls([]);
        expect(await d.text("p")).eq("b4, b5");
        expect(await d.text("p2")).eq("b5");
        expect(await d.text("t")).eq("b5");
        expect((await d.text("q")).split(", ").sort()).eqls(["b4", "b5"]);
        expect(await d.text("c")).eq("b4, b5");
        await d.setBoolean("b", true);
        expect(await d.text("p")).eq("a1, a2, a3");
        expect(await d.text("c")).eq("a1, a2, a3");
    });

    const stillOwnKind: [string, string, string][] = [
        ["a group holding one repeat", `<group name="h">${rA}</group>`, "$h"],
        [
            "an iteration holding a repeat",
            `<repeat name="outer" for="1"><repeat for="1 2">x</repeat></repeat>`,
            "$outer[1]",
        ],
    ];
    for (const [label, doenetML, source] of stillOwnKind) {
        it(`${label} is e0071, as before`, async () => {
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
