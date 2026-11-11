import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * D27 (#2420): an index selects among the instances a component produces --
 * the entries of a list, the iterations of a repeat, the picks of a select --
 * and never among the children of a container.
 *
 * - A `<group>`, an iteration, a pick or what a `<conditionalContent>` shows
 *   whose whole content is one component stands for it (NAME-2), and passes
 *   the next index to it, which decides what the index means: nested repeats
 *   take one index per level, a list or a math tuple gives its entry, and a
 *   number (`doenet-w0100`) or a `<p>` (`doenet-w0180`) names nothing. A
 *   reference as that one component passes the index to what it names.
 * - An index after one that holds several components, or none, names nothing
 *   (D27 revised, #2517): a blank (D37), with a warning that says how many it
 *   holds and how to name the child (`doenet-w0188`).
 * - The diagnostics name what the author wrote.
 * - An extend of an iteration or a pick indexes as it does (REF-7, #2438).
 * - An index never reaches the `<setup>` a repeat adds to an iteration for
 *   its `valueName` (NAME-3, #2438).
 */

async function shownAndReported(doenetML: string) {
    const { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });
    const stateVariables = await core.returnAllStateVariables(false, true);
    const text =
        stateVariables[await resolvePathToNodeIdx("p")].stateValues.text;
    const { warnings, errors, infos } = getDiagnosticsByType(core);
    return { text, warnings, errors, infos };
}

describe("An index selects instances, not children @group4", async () => {
    it("takes one index per level of nested repeats, as the counts change", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="m" prefill="2" />
    <mathInput name="n" prefill="3" />
    <repeatForSequence name="r" length="$m" valueName="i">
      <repeatForSequence length="$n" valueName="j">
        <number>10$i+$j</number>
      </repeatForSequence>
    </repeatForSequence>
    <p name="p">[$r[1][1]] [$r[1][3]] [$r[2][2]] [$r[3][1]]</p>
    `,
        });

        async function text() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .text;
        }

        expect(await text()).eq("[11] [13] [22] [＿]");

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("m"),
            core,
        });
        expect(await text()).eq("[11] [13] [22] [31]");

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        expect(await text()).eq("[11] [＿] [22] [31]");

        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        expect(await text()).eq("[11] [13] [22] [31]");

        // No index selected a child of anything
        expect(
            getDiagnosticsByType(core).warnings.filter(
                (w) => w.code === "doenet-w0188",
            ),
        ).eqls([]);
    });

    it("takes one index per level of three nested repeats", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n" prefill="2" />
    <repeatForSequence name="r" length="2" valueName="i">
      <repeat for="a b" valueName="j">
        <repeatForSequence length="$n" valueName="k">
          <text>$i$j$k</text>
        </repeatForSequence>
      </repeat>
    </repeatForSequence>
    <p name="p">[$r[1][1][1]] [$r[2][1][2]] [$r[2][2][1]] [$r[1][2][3]]</p>
    <p name="p2">[$r[2][2]]</p>
    `,
        });

        async function texts() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return [
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .text,
                stateVariables[await resolvePathToNodeIdx("p2")].stateValues
                    .text,
            ];
        }

        expect(await texts()).eqls(["[1a1] [2a2] [2b1] [＿]", "[2b1, 2b2]"]);

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        expect(await texts()).eqls([
            "[1a1] [2a2] [2b1] [1b3]",
            "[2b1, 2b2, 2b3]",
        ]);

        expect(
            getDiagnosticsByType(core).warnings.filter(
                (w) => w.code === "doenet-w0188",
            ),
        ).eqls([]);
    });

    it("reads the old form of an index into nested repeats with the new meaning", async () => {
        // `$a[2][1][3]` used to be iteration 3 of the repeat that is the first
        // child of iteration 2. It is now iteration 1 of that repeat, then
        // index 3 after that iteration, which holds only one `<number>`, so
        // the index passes to the number, which takes none.
        const { text, warnings } = await shownAndReported(`
    <repeatForSequence from="1" to="3" valueName="i" name="a">
      <repeatForSequence from="1" to="3" valueName="j" name="b">
        <number name="c">$i + 3$j</number>
      </repeatForSequence>
    </repeatForSequence>
    <p name="p">[$a[2][3]] [$a[2][3].c] [$a[2][1][3]]</p>
    `);
        expect(text).eq("[11] [11] [＿]");
        expect(warnings.map((w) => [w.code, w.args.reference])).eqls([
            ["doenet-w0100", "$a[2][1][3]"],
        ]);
    });

    it("passes an index through a pick holding one list", async () => {
        const { text, warnings } = await shownAndReported(`
    <select name="s" numToSelect="2">
      <option><mathList>a b c</mathList></option>
      <option><mathList>a b c</mathList></option>
    </select>
    <p name="p">[$s[1][2]] [$s[2][3]] [$s[1]]</p>
    `);
        expect(text).eq("[b] [c] [a, b, c]");
        expect(warnings).eqls([]);
    });

    it("passes an index through a pick holding one repeat", async () => {
        const { text, warnings } = await shownAndReported(`
    <select name="s">
      <option><repeatForSequence length="3" valueName="v"><number>2$v</number></repeatForSequence></option>
    </select>
    <p name="p">[$s[1][2]] [$s[1][3]]</p>
    `);
        expect(text).eq("[4] [6]");
        expect(warnings).eqls([]);
    });

    it("passes an index through a pick or iteration holding only a reference to a list (#2428)", async () => {
        const setup = `<setup><mathList name="nl">a b c</mathList><repeat name="rp" for="1 2" valueName="w"><math>$w</math></repeat></setup>`;
        for (const [body, name] of [
            [
                `<select name="s"><option><mathList extend="$nl"/></option></select>`,
                "s",
            ],
            [`<select name="s"><option>$nl</option></select>`, "s"],
            [
                `<repeatForSequence name="s" length="2">$nl</repeatForSequence>`,
                "s",
            ],
            [`<repeat name="s" for="1 2" valueName="v">$nl</repeat>`, "s"],
        ]) {
            const { text, warnings, errors, infos } = await shownAndReported(
                `${setup}${body}<p name="p">[$${name}[1][1]] [$${name}[1][2]]</p>`,
            );
            expect(text, body).eq("[a] [b]");
            expect([...warnings, ...errors, ...infos], body).eqls([]);
        }

        // a reference to a repeat, whose iterations an index selects
        const { text, warnings } = await shownAndReported(
            `${setup}<select name="s"><option>$rp</option></select><p name="p">[$s[1][1]] [$s[1][2]]</p>`,
        );
        expect(text).eq("[1] [2]");
        expect(warnings).eqls([]);

        // Past the end, as with the list or repeat written in place: silent
        // past a list's entries (#1499), and saying how many iterations a
        // repeat made.
        const pastList = await shownAndReported(
            `${setup}<select name="s"><option>$nl</option></select><p name="p">[$s[1][4]]</p>`,
        );
        expect(pastList.text).eq("[＿]");
        expect(pastList.warnings).eqls([]);

        const pastRepeat = await shownAndReported(
            `${setup}<select name="s"><option>$rp</option></select><p name="p">[$s[1][3]]</p>`,
        );
        expect(pastRepeat.text).eq("[＿]");
        expect(pastRepeat.warnings.map((w) => [w.code, w.args])).eqls([
            [
                "doenet-w0181",
                {
                    reference: "$s[1][3]",
                    component: "repeat",
                    kind: "iteration",
                    count: 2,
                },
            ],
        ]);
    });

    it("passes an index through a pick holding a setup and a reference to a list", async () => {
        // A setup is not content, before the reference or after it: the
        // pick holds one component, the reference, whose entries an index
        // selects
        const before = await shownAndReported(
            `<setup><mathList name="nl">a b c</mathList></setup><select name="s"><option><setup><number name="n">5</number></setup>$nl</option></select><p name="p">[$s[1][1]] [$s[1][2]] [$s[1][4]]</p>`,
        );
        expect(before.text).eq("[a] [b] [＿]");
        expect(before.warnings).eqls([]);

        // A setup after the reference shifts nothing, and is not reached by
        // an index past the entries.
        const after = await shownAndReported(
            `<setup><mathList name="nl">a b c</mathList></setup><select name="s"><option>$nl<setup><number name="n">5</number></setup></option></select><p name="p">[$s[1][2]] [$s[1][4]] [$s[1][4].n]</p>`,
        );
        expect(after.text).eq("[b] [＿] [＿]");
        expect(after.warnings).eqls([]);
    });

    it("passes an index after a pick holding only a reference to one component to what it made", async () => {
        // `$m` and the one math of `g` are scalars, which take no index (as
        // an info for what `g` made, whose value a reference copies and could
        // change)
        for (const [setup, option] of [
            [`<math name="m">x</math>`, `$m`],
            [`<group name="g"><math>y</math></group>`, `$g`],
        ]) {
            const { text, warnings, infos } = await shownAndReported(
                `<setup>${setup}</setup><select name="s"><option>${option}</option></select><p name="p">[$s[1][1]]</p>`,
            );
            expect(text, option).eq("[＿]");
            expect(
                [...warnings, ...infos].map((w) => [w.code, w.args.reference]),
                option,
            ).eqls([["doenet-w0100", "$s[1][1]"]]);
        }

        // and a reference to a group holding two names nothing after it,
        // whose children have the names of what it copies, not of a child of
        // the pick
        const two = await shownAndReported(
            `<setup><group name="g"><math>y</math><math>z</math></group></setup><select name="s"><option>$g</option></select><p name="p">[$s[1][1]]</p>`,
        );
        expect(two.text).eq("[＿]");
        expect(
            two.warnings.map((w) => [
                w.code,
                w.args.container,
                w.args.child,
                w.args.count,
            ]),
        ).eqls([["doenet-w0188", "pick", "unnamed", 2]]);
    });

    it("passes an index through a group or a case holding only a reference to a list or a repeat", async () => {
        // As through a pick: past the end of a list is silent, and past the
        // iterations of a repeat says how many it made
        const setup = `<setup><mathList name="nl">a b c</mathList><repeat name="rp" for="1 2" valueName="w"><math>$w</math></repeat></setup>`;
        for (const [body, name, past, shown, codes] of [
            [`<group name="g">$nl</group>`, "g", "$g[5]", "[b] [＿]", []],
            [
                `<group name="g">$rp</group>`,
                "g",
                "$g[5]",
                "[2] [＿]",
                ["doenet-w0181"],
            ],
            [
                `<conditionalContent name="g"><case condition="true">$nl</case></conditionalContent>`,
                "g[1]",
                "$g[1][5]",
                "[b] [＿]",
                [],
            ],
        ] as const) {
            const { text, warnings } = await shownAndReported(
                `${setup}${body}<p name="p">[$${name}[2]] [${past}]</p>`,
            );
            expect(text, body).eq(shown);
            expect(
                warnings.map((w) => w.code),
                body,
            ).eqls(codes);
        }
    });

    it("passes an index through a pick holding a reference to a list whose length changes", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="k" prefill="2" />
    <sequence name="seq" length="$k" />
    <select name="s"><option>$seq</option></select>
    <p name="p">[$s[1][2]] [$s[1][3]]</p>
    `,
        });

        async function text() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .text;
        }

        expect(await text()).eq("[2] [＿]");

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("k"),
            core,
        });
        expect(await text()).eq("[2] [3]");

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("k"),
            core,
        });
        expect(await text()).eq("[＿] [＿]");

        const { warnings, errors } = getDiagnosticsByType(core);
        expect([...warnings, ...errors].map((d) => [d.code, d.message])).eqls(
            [],
        );
    });

    it("passes an index through a pick or iteration holding only a reference to a list named through a composite", async () => {
        // What `$cc.x` and `$ls[2].m` name is found once the composite is
        // expanded, not when the reference is made
        const named = await shownAndReported(
            `<repeatForSequence name="ls" length="2" valueName="v"><mathList name="m">$v 7</mathList></repeatForSequence><select name="s"><option>$ls[2].m</option></select><p name="p">[$s[1][1]] [$s[1][2]]</p>`,
        );
        expect(named.text).eq("[2] [7]");
        expect(named.warnings).eqls([]);

        for (const [body, prefill] of [
            [`<select name="s"><option>$cc.x</option></select>`, "1"],
            [
                `<repeatForSequence name="s" length="1">$cc.x</repeatForSequence>`,
                "2",
            ],
        ]) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="k" prefill="${prefill}" />
    <conditionalContent name="cc">
      <case condition="$k=1"><mathList name="x">a b</mathList></case>
      <case condition="$k=3"><mathList name="x">c d e</mathList></case>
    </conditionalContent>
    ${body}
    <p name="p">[$s[1][2]] [$s[1][3]]</p>
    `,
            });
            async function text() {
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                return stateVariables[await resolvePathToNodeIdx("p")]
                    .stateValues.text;
            }
            const shown: string[] = [await text()];
            for (const k of ["1", "2", "3", "1"]) {
                await updateMathInputValue({
                    latex: k,
                    componentIdx: await resolvePathToNodeIdx("k"),
                    core,
                });
                shown.push(await text());
            }
            const atLoad = prefill === "1" ? "[b] [＿]" : "[＿] [＿]";
            expect(shown, body).eqls([
                atLoad,
                "[b] [＿]",
                "[＿] [＿]",
                "[d] [e]",
                "[b] [＿]",
            ]);
        }
    });

    it("names nothing after an index into a group, an iteration, a pick or a case, and says how to name the child", async () => {
        const cases: {
            body: string;
            text: string;
            reference: string;
            suggestion: string;
            child: string;
            container: string;
            component: string;
            count: number;
        }[] = [
            {
                body: `<group name="g"><math>a</math><math>b</math></group><p name="p">[$g[2]]</p>`,
                text: "[＿]",
                reference: "$g[2]",
                suggestion: "$g.x",
                child: "unnamed",
                container: "group",
                component: "group",
                count: 2,
            },
            {
                body: `<group name="g"><math>a</math><math name="m">b</math></group><p name="p">[$g[2]]</p>`,
                text: "[＿]",
                reference: "$g[2]",
                suggestion: "$g.m",
                child: "named",
                container: "group",
                component: "group",
                count: 2,
            },
            {
                body: `<select name="s"><option><math>a</math><math>b</math></option></select><p name="p">[$s[1][2]]</p>`,
                text: "[＿]",
                reference: "$s[1][2]",
                suggestion: "$s[1].x",
                child: "unnamed",
                container: "pick",
                component: "select",
                count: 2,
            },
            {
                body: `<repeatForSequence name="r" length="2" valueName="v"><math>$v</math><math>2$v</math></repeatForSequence><p name="p">[$r[2][2]]</p>`,
                text: "[＿]",
                reference: "$r[2][2]",
                suggestion: "$r[2].x",
                child: "unnamed",
                container: "iteration",
                component: "repeatForSequence",
                count: 2,
            },
            {
                body: `<repeat name="r" for="1 2" valueName="v"><math>$v</math><math name="w">2$v</math></repeat><p name="p">[$r[1][2]]</p>`,
                text: "[＿]",
                reference: "$r[1][2]",
                suggestion: "$r[1].w",
                child: "named",
                container: "iteration",
                component: "repeat",
                count: 2,
            },
            {
                body: `<conditionalContent name="cc"><case condition="true"><math>a</math><math>b</math></case></conditionalContent><p name="p">[$cc[1][2]]</p>`,
                text: "[＿]",
                reference: "$cc[1][2]",
                suggestion: "$cc[1].x",
                child: "unnamed",
                container: "case",
                component: "conditionalContent",
                count: 2,
            },
        ];

        for (const { body, text: expectedText, ...args } of cases) {
            const { text, warnings, errors } = await shownAndReported(body);
            expect(text, body).eq(expectedText);
            expect(errors, body).eqls([]);
            expect(
                warnings.map((w) => w.code),
                body,
            ).eqls(["doenet-w0188"]);
            expect(warnings[0].args, body).eqls(args);
        }
    });

    it("names nothing past an iteration's content, without reaching the setup the repeat adds", async () => {
        // An index after the content of an iteration used to reach the
        // `<setup>` that holds `valueName`, which showed nothing, and `.v`
        // after it reached the value. That setup is not the author's content
        // (NAME-3), so it is not named as the child the index would select,
        // and the index names nothing, as one after any `<group>` holding two
        // components does.
        const { text, warnings, errors, infos } = await shownAndReported(`
    <repeat name="r" for="a b" valueName="v"><text>$v</text><text>!</text></repeat>
    <repeat name="r2" extend="$r" />
    <group name="g" extend="$r[1]" />
    <p name="p">[$r[1][3]] [$r2[1][3]] [$g[3]] [$r[1][3].v] [$g[3].v]</p>
    `);
        expect(text).eq("[＿] [＿] [＿] [＿] [＿]");
        // There is no child there, and the setup is not named as one
        expect(
            warnings.map((w) => [
                w.code,
                w.args.reference,
                w.args.child,
                w.args.count,
            ]),
        ).eqls([
            ["doenet-w0188", "$r[1][3]", "none", 2],
            ["doenet-w0188", "$r2[1][3]", "none", 2],
            ["doenet-w0188", "$g[3]", "none", 2],
            ["doenet-w0188", "$r[1][3]", "none", 2],
            ["doenet-w0188", "$g[3]", "none", 2],
        ]);
        expect(errors).eqls([]);
        expect(infos).eqls([]);
    });

    it("names nothing past a list in an iteration, rather than reaching the setup the repeat adds (#2438)", async () => {
        const doenetML = `
    <mathInput name="n" prefill="3" />
    <sequence name="l" length="$n" />
    <repeat name="r" for="1 2" valueName="v">$l</repeat>
    <p name="p">[$r[1][3]] [$r[1][4]] [$r[1][4].v] [$r[2][4]]</p>
    `;
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        async function check(text: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .text,
            ).eq(text);
        }

        // silent, past the end of a list (#1499)
        await check("[3] [＿] [＿] [＿]");
        const { warnings, errors, infos } = getDiagnosticsByType(core);
        expect([...warnings, ...errors, ...infos]).eqls([]);

        // once the list has a fourth entry, the index names it, and `.v` is
        // a property of that entry, not the repeat's value
        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check("[3] [4] [＿] [4]");
    });

    it("indexes an extend of an iteration or a pick as the iteration or pick (#2438)", async () => {
        const { text, warnings, errors, infos } = await shownAndReported(`
    <repeat name="r" for="1 2" valueName="v"><repeat for="7 8 9" valueName="w"><math>$v $w</math></repeat></repeat>
    <group name="g2" extend="$r[2]" />
    <group name="g3" copy="$r[1]" />
    <select name="s"><option><mathList>1 2 3</mathList></option></select>
    <group name="gs" extend="$s[1]" />
    <p name="p">[$r[2][2]] [$g2[2]] [$g2[1]] [$g3[3]] [$gs[2]] [$g2[4]] [$gs[4]]</p>
    `);
        expect(text).eq("[2 * 8] [2 * 8] [2 * 7] [1 * 9] [2] [＿] [＿]");
        expect(errors).eqls([]);
        expect(infos).eqls([]);
        // past the instances, as for the iteration itself: the inner
        // repeat says how many it made, and past a list is silent
        expect(warnings.map((w) => [w.code, w.args.reference])).eqls([
            ["doenet-w0181", "$g2[4]"],
        ]);
    });

    it("follows an iteration missing at load into an extend of it, as after a reload (#2478)", async () => {
        // `g` is made an empty group while `r` has no iteration 1. When the
        // iteration appears, an index passes through `g` to the one repeat
        // or list that is its content, as it does through `$r[1]`, the same
        // as after a reload (SAVE-1).
        for (const content of [
            `<repeatForSequence length="3" valueName="w"><math>$v $w</math></repeatForSequence>`,
            `<mathList>$v 2$v 3$v</mathList>`,
        ]) {
            const doenetML = `<mathInput name="n" prefill="0" />
    <repeatForSequence name="r" length="$n" valueName="v">${content}</repeatForSequence>
    <group name="g" extend="$r[1]" />
    <p name="p">[$r[1][2]] [$g[2]]</p>`;
            let { core, resolvePathToNodeIdx, scoreState } =
                await createTestCore({ doenetML });
            async function text() {
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                return stateVariables[await resolvePathToNodeIdx("p")]
                    .stateValues.text;
            }
            function reportedSinceLoad(before: number) {
                return getDiagnosticsByType(core)
                    .warnings.slice(before)
                    .map((w) => [w.code, w.args.reference]);
            }
            expect(await text(), content).eq("[＿] [＿]");
            const numWarningsAtLoad =
                getDiagnosticsByType(core).warnings.length;

            const shown = content.startsWith("<mathList")
                ? "[2 * 1] [2 * 1]"
                : "[1 * 2] [1 * 2]";
            for (const n of ["1", "2"]) {
                await updateMathInputValue({
                    latex: n,
                    componentIdx: await resolvePathToNodeIdx("n"),
                    core,
                });
                expect(await text(), content).eq(shown);
                // nothing new is reported: it no longer names nothing
                // past the group's index resolutions (`doenet-w0104`)
                expect(reportedSinceLoad(numWarningsAtLoad), content).eqls([]);
            }

            await core.saveImmediately();
            ({ core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                initialState: scoreState.state,
            }));
            expect(await text(), content).eq(shown);
            expect(getDiagnosticsByType(core).warnings, content).eqls([]);
        }
    });

    it("names nothing again after an index when an extend of an iteration is made again from an ordinary group", async () => {
        // `x` is an extend of an iteration in one case and an ordinary
        // group in the other, so `g` passes an index through and then
        // names nothing after one
        const doenetML = `<booleanInput name="b"/>
    <repeat name="r" for="1 2" valueName="v"><repeat for="7 8 9" valueName="w"><math>$w</math></repeat></repeat>
    <conditionalContent name="cc">
      <case condition="$b"><group name="x"><math>a</math><math>b</math></group></case>
      <else><group name="x" extend="$r[1]"/></else>
    </conditionalContent>
    <group name="g" extend="$cc.x"/>
    <p name="p">[$g[2]]</p>`;
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        async function text() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .text;
        }
        expect(await text()).eq("[8]");
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        expect(await text()).eq("[＿]");
        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        expect(await text()).eq("[8]");
    });

    it("names nothing after an index into an extend of an iteration that the author added to", async () => {
        // Its content is not one indexable component, so an index does not
        // pass through, and names nothing after it, as after any group.
        const { text, warnings } = await shownAndReported(`
    <repeat name="r" for="1 2" valueName="v"><repeat for="7 8" valueName="w"><math>$w</math></repeat></repeat>
    <group name="g" extend="$r[1]"><text>more</text></group>
    <p name="p">[$g[3]]</p>
    `);
        expect(text).eq("[＿]");
        expect(warnings.map((w) => [w.code, w.args.reference])).eqls([
            ["doenet-w0188", "$g[3]"],
        ]);
    });

    it("does not reach the setup in an iteration made later, in an unlinked copy, or after a reload", async () => {
        // The setup is recognized by a mark the repeat gives it, which an
        // iteration added when the repeat updates, an unlinked copy of the
        // repeat or of an iteration, and a document restored from a save
        // also carry. Were it reached, `.v` after it would be the value.
        const doenetML = `
    <mathInput name="n" prefill="1" />
    <sequence name="seq" length="$n" />
    <repeat name="r" for="$seq" valueName="v"><text>$v</text></repeat>
    <repeat name="r2" copy="$r" />
    <group name="g" copy="$r[1]" />
    <p name="p">[$r[2]] [$r[2][2].v] [$r2[1][2].v] [$g[2].v]</p>
    `;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });
        async function check(text: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .text,
            ).eq(text);
            // The setup is not reported as a child the index would select
            expect(
                getDiagnosticsByType(core)
                    .warnings.filter((w) => w.code === "doenet-w0188")
                    .map((w) => w.args.child),
            ).not.toContain("unnamed");
        }

        // `r` has no iteration 2 yet
        await check("[＿] [＿] [＿] [＿]");

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check("[2] [＿] [＿] [＿]");

        await core.saveImmediately();
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));
        await check("[2] [＿] [＿] [＿]");
    });

    it("does not count a setup the author wrote as content", async () => {
        // A `<setup>` is not content, the author's as the one a repeat adds:
        // each of these holds one component, a scalar, to which the index
        // passes, even with the setup last in a repeat with no `valueName`,
        // or in a copy of the repeat. The scalar takes no index.
        const cases: { body: string; reference: string }[] = [
            {
                body: `<select name="s"><option><setup><number name="n">5</number></setup><math name="m">$n</math></option></select><p name="p">[$s[1][1].n]</p>`,
                reference: "$s[1][1].n",
            },
            {
                body: `<repeat name="r" for="a b"><text>x</text><setup><number name="n">5</number></setup></repeat><p name="p">[$r[1][2].n]</p>`,
                reference: "$r[1][2].n",
            },
            {
                body: `<repeat name="r" for="a b" valueName="v"><setup><number name="n">5</number></setup><text>$v</text></repeat><repeat name="r2" extend="$r" /><p name="p">[$r2[1][1].n]</p>`,
                reference: "$r2[1][1].n",
            },
        ];

        for (const { body, reference } of cases) {
            const { text, warnings } = await shownAndReported(body);
            expect(text, body).eq("[＿]");
            expect(
                warnings.map((w) => [w.code, w.args.reference]),
                body,
            ).eqls([["doenet-w0100", reference]]);
        }
    });

    it("words the warning with what the author wrote", async () => {
        const { warnings } = await shownAndReported(
            `<select name="s"><option><math>a</math><math name="m">b</math></option></select><p name="p">$s[1][1] $s[1][2] $s[1][3]</p>`,
        );
        expect(warnings.map((w) => w.message).sort()).eqls([
            '`$s[1][1]` names nothing: what the `<select>` picked holds 2 components, and an index passes into a pick only when it holds one. An index never selects a child. To refer to the child, give it a name, such as `name="x"`, and write `$s[1].x`.',
            "`$s[1][2]` names nothing: what the `<select>` picked holds 2 components, and an index passes into a pick only when it holds one. An index never selects a child. To refer to the child, write `$s[1].m`.",
            "`$s[1][3]` names nothing: what the `<select>` picked holds 2 components, and an index passes into a pick only when it holds one. An index never selects a child. To refer to a child, give it a name and write that name after a `.`.",
        ]);
    });

    it("says an index cannot select anything in a component that makes nothing to select", async () => {
        const cases: { body: string; reference: string; component: string }[] =
            [
                {
                    body: `<section name="sec"><math>a</math><math>b</math></section><p name="p">[$sec[2]]</p>`,
                    reference: "$sec[2]",
                    component: "section",
                },
                {
                    body: `<p name="q"><math>a</math></p><p name="p">[$q[1]]</p>`,
                    reference: "$q[1]",
                    component: "p",
                },
                {
                    body: `<select name="s"><option name="o"><math>a</math></option></select><p name="p">[$o[1]]</p>`,
                    reference: "$o[1]",
                    component: "option",
                },
            ];

        for (const { body, ...args } of cases) {
            const { text, warnings, errors, infos } =
                await shownAndReported(body);
            expect(text, body).eq("[＿]");
            expect(errors, body).eqls([]);
            expect(infos, body).eqls([]);
            expect(
                warnings.map((w) => w.code),
                body,
            ).eqls(["doenet-w0180"]);
            expect(warnings[0].args, body).eqls(args);
        }

        const { warnings } = await shownAndReported(
            `<section name="sec"><math>a</math></section><p name="p">[$sec[1]]</p>`,
        );
        expect(warnings[0].message).eq(
            "`$sec[1]`: an index cannot select anything in this `<section>`. An index selects among what a component makes, such as the entries of a list or the iterations of a repeat, not among the children of a component. To refer to a child, give it a name and write that name after a `.`.",
        );
    });

    it("says how many instances a repeat or a select made when the index is past them", async () => {
        const cases: {
            body: string;
            reference: string;
            component: string;
            kind: string;
            count: number;
            message: string;
        }[] = [
            {
                body: `<select name="s"><option><math>a</math></option><option><math>b</math></option></select><p name="p">[$s[2]]</p>`,
                reference: "$s[2]",
                component: "select",
                kind: "pick",
                count: 1,
                message: "`$s[2]`: the `<select>` made only 1 pick.",
            },
            {
                body: `<repeatForSequence name="r" length="2" valueName="v"><math>$v</math><math>x</math></repeatForSequence><p name="p">[$r[3]]</p>`,
                reference: "$r[3]",
                component: "repeatForSequence",
                kind: "iteration",
                count: 2,
                message:
                    "`$r[3]`: the `<repeatForSequence>` made only 2 iterations.",
            },
            {
                // The index passes to the inner repeat, whose iterations are counted
                body: `<repeatForSequence name="r" length="2" valueName="i"><repeatForSequence length="3" valueName="j"><math>$i+$j</math><math>x</math></repeatForSequence></repeatForSequence><p name="p">[$r[1][4]]</p>`,
                reference: "$r[1][4]",
                component: "repeatForSequence",
                kind: "iteration",
                count: 3,
                message:
                    "`$r[1][4]`: the `<repeatForSequence>` made only 3 iterations.",
            },
            {
                body: `<repeatForSequence name="r" length="0"><math>x</math><math>y</math></repeatForSequence><p name="p">[$r[1]]</p>`,
                reference: "$r[1]",
                component: "repeatForSequence",
                kind: "iteration",
                count: 0,
                message:
                    "`$r[1]`: the `<repeatForSequence>` made no iterations.",
            },
            {
                // A collect gathers rather than picks
                body: `<section name="sec"><p>a</p><p>b</p></section><collect name="c" from="$sec" componentType="p" /><p name="p">[$c[3]]</p>`,
                reference: "$c[3]",
                component: "collect",
                kind: "item",
                count: 2,
                message: "`$c[3]`: the `<collect>` has only 2 items.",
            },
        ];

        for (const { body, message, ...args } of cases) {
            const { text, warnings, errors, infos } =
                await shownAndReported(body);
            expect(text, body).eq("[＿]");
            expect(errors, body).eqls([]);
            expect(infos, body).eqls([]);
            expect(
                warnings.map((w) => w.code),
                body,
            ).eqls(["doenet-w0181"]);
            expect(warnings[0].args, body).eqls(args);
            expect(warnings[0].message, body).eq(message);
        }
    });
});

describe("An index after a group names nothing (#2517) @group4", async () => {
    it("names nothing after every form of a group", async () => {
        // The forms in #2517, other than those above
        const cases: { body: string; references: string[] }[] = [
            {
                // an extend and a `copy` of a group the author wrote
                body: `<group name="g"><math>a</math><math>b</math></group><group name="g2" extend="$g"/><group name="g3" copy="$g"/><p name="p">[$g2[2]] [$g3[1]]</p>`,
                references: ["$g2[2]", "$g3[1]"],
            },
            {
                // a select with several picks
                body: `<select name="s" numToSelect="2"><option><math>a</math><math>b</math></option><option><math>c</math><math>d</math></option></select><p name="p">[$s[1][2]] [$s[2][1]]</p>`,
                references: ["$s[1][2]", "$s[2][1]"],
            },
            {
                // the `<else>` of a `<conditionalContent>`, and its form
                // with a single condition
                body: `<conditionalContent name="cc"><case condition="false"><math>a</math></case><else><math>b</math><math>c</math></else></conditionalContent><conditionalContent name="cc2" condition="true"><math>d</math><math>e</math></conditionalContent><p name="p">[$cc[1][2]] [$cc2[1][1]]</p>`,
                references: ["$cc[1][2]", "$cc2[1][1]"],
            },
            {
                // an extend of an iteration holding more than one component
                body: `<repeat name="r" for="1 2" valueName="v"><math>$v</math><math>2$v</math></repeat><group name="gi" extend="$r[1]"/><p name="p">[$gi[2]]</p>`,
                references: ["$gi[2]"],
            },
            {
                // a group reached through `<collect>`
                body: `<section name="sec"><group><math>a</math><math>b</math></group></section><collect name="c" componentType="group" from="$sec"/><p name="p">[$c[1][2]]</p>`,
                references: ["$c[1][2]"],
            },
            {
                // a group inside an iteration, which the iteration holding
                // only it passes the index after it to, so that index is
                // the one after the group, which the warning quotes, and a
                // group reached by name
                body: `<repeat name="r" for="1 2" valueName="v"><group><math>$v</math><math>2$v</math></group></repeat><section name="a"><group name="g"><math>x</math><math>y</math></group></section><p name="p">[$r[1][1][2]] [$a.g[1]]</p>`,
                references: ["$r[1][1]", "$a.g[1]"],
            },
            {
                // an index that is not a literal names nothing whatever its
                // value
                body: `<number name="i">2</number><group name="g"><math>a</math><math>b</math></group><p name="p">[$g[$i]]</p>`,
                references: ["$g[$i]"],
            },
        ];

        for (const { body, references } of cases) {
            const { text, warnings, errors, infos } =
                await shownAndReported(body);
            expect(text, body).eq(references.map(() => "[＿]").join(" "));
            expect([...errors, ...infos], body).eqls([]);
            expect(
                warnings.map((w) => [w.code, w.args.reference]),
                body,
            ).eqls(references.map((r) => ["doenet-w0188", r]));
        }
    });

    it("does not read an index after a group holding two components into its items (#2166)", async () => {
        // The index used to be passed to each item as a property: `$g[2]`
        // was `5`, the second entry of the math. A group holding one
        // component passes the index to it (below).
        for (const holds of [
            `<math>(4,5,6)</math><number>9</number>`,
            `<number>9</number><math>(4,5,6)</math>`,
            `<math>(4,5,6)</math><math>(7,8)</math>`,
            `<point>(4,5)</point><point>(7,8)</point>`,
        ]) {
            const { text, warnings } = await shownAndReported(
                `<group name="g">${holds}</group><number name="i">3</number><p name="p">[$g[1]] [$g[2]] [$g[3]] [$g[$i]]</p>`,
            );
            expect(text, holds).eq("[＿] [＿] [＿] [＿]");
            expect(
                warnings.map((w) => w.code),
                holds,
            ).eqls(Array(4).fill("doenet-w0188"));
        }
    });

    it("loads a document indexing into a group whose child is a reference not yet expanded (#1942)", async () => {
        // These trapped in the Rust core, which blanked the document. The
        // index passes to the reference, the group's one component, and so
        // to what it names: a `<p>`, which takes no index; nothing; or the
        // reference itself, through a chain of groups, which names nothing.
        for (const [doenetML, code] of [
            [
                `$g[1]<group name="g">$x</group><p name="x">hello</p><p name="p">[$g[1]] [$x]</p>`,
                "doenet-w0180",
            ],
            [
                `$g[1]<group name="g">$nothere</group><p name="p">[$g[1]]</p>`,
                "doenet-w0104",
            ],
            [
                `$g[1]<group name="g">$$f(1)</group><p name="p">[$g[1]]</p>`,
                "doenet-w0104",
            ],
            [
                `$g[1].y<group name="g">$x</group><p name="x">hello</p><p name="p">[$g[1].y]</p>`,
                "doenet-w0180",
            ],
            [
                `<group name="g">$g[1]$g[2]</group><p name="p">[$g[1]]</p>`,
                "doenet-w0188",
            ],
            [
                `<group name="a">$b[1]</group><group name="b">$a[1]</group><p name="p">[$a[1]]</p>`,
                "doenet-w0104",
            ],
            [
                `<group name="g">$g[1]</group><p name="p">[$g[1]]</p>`,
                "doenet-w0104",
            ],
        ]) {
            const { text, warnings } = await shownAndReported(doenetML);
            expect(text.startsWith("[＿]"), doenetML).eq(true);
            expect(
                warnings.some((w) => w.code === code),
                doenetML,
            ).eq(true);
        }
    });

    it("keeps the root names an unnamed component gets from its place", async () => {
        // An index edge into a group still names the components in it,
        // though a reference with that index names nothing: these become
        // renderer ids, and events record them
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <repeat name="r" for="1 2" valueName="v"><math>$v</math><math>2$v</math></repeat>
    <group name="g"><text>a</text><text>b</text></group>
    `,
        });
        const rootNames = Object.values((core as any).core.rootNames);
        expect(rootNames).toEqual(
            expect.arrayContaining(["r:1:1", "r:1:2", "r:2:2", "g:1", "g:2"]),
        );
        expect(await resolvePathToNodeIdx("r[1][2]")).eq(-1);
        expect(await resolvePathToNodeIdx("g[2]")).eq(-1);
    });

    it("shows a blank for an index after a setup", async () => {
        // A `<setup>` shows nothing, but an index after it names nothing,
        // which is a blank (D37)
        const { text, warnings } = await shownAndReported(
            `<setup name="st"><number>1</number><number>2</number></setup><p name="p">[$st[2]] [$st]</p>`,
        );
        expect(text).eq("[＿] []");
        expect(warnings.map((w) => w.code)).eqls(["doenet-w0104"]);
    });

    it("still selects the items of a shuffle or a sort", async () => {
        // A shuffle or a sort of groups arranges what the groups hold, so
        // its items are the components in them, and an index after one is
        // an index into that component (`doenet-w0100` for a math)
        const { text, warnings } = await shownAndReported(
            `<sort name="sh"><group><math>a</math><math>b</math></group><group><math>c</math></group></sort><p name="p">[$sh[2]] [$sh[3]] [$sh[1][2]]</p>`,
        );
        expect(text).eq("[b] [c] [＿]");
        expect(warnings.map((w) => w.code)).eqls(["doenet-w0100"]);
    });

    it("shows only the entry once an index past the end, then after a group, names one", async () => {
        // `$g[3]` is past the end of an iteration at load, then after an
        // ordinary group, then past the end again, and then names an entry
        // as the iteration grows. Each blank is replaced, not left beside
        // what the reference names.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <booleanInput name="b" />
    <mathInput name="n" prefill="2" />
    <repeat name="r" for="1 2" valueName="v"><repeatForSequence length="$n" valueName="w"><math>$w</math></repeatForSequence></repeat>
    <conditionalContent name="cc">
      <case condition="$b"><group name="x"><math>a</math><math>b</math><math>c</math></group></case>
      <else><group name="x" extend="$r[1]"/></else>
    </conditionalContent>
    <group name="g" extend="$cc.x"/>
    <p name="p">[$g[3]]</p>
    `,
        });
        async function text() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .text;
        }
        expect(await text()).eq("[＿]");
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        expect(await text()).eq("[＿]");
        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        expect(await text()).eq("[＿]");
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        expect(await text()).eq("[3]");
    });
});

describe("One component stands for its holder (NAME-2, D27 revised again) @group4", async () => {
    /** The text of `p`, and the code and reference of each warning. */
    async function textAndWarnings(doenetML: string) {
        const { text, warnings, errors, infos } =
            await shownAndReported(doenetML);
        expect([...errors, ...infos], doenetML).eqls([]);
        return {
            text,
            warnings: warnings.map((w) => [w.code, w.args.reference]),
        };
    }

    it("passes an index after a group to its one component, which decides what it means", async () => {
        const cases: {
            holds: string;
            references: string;
            text: string;
            warnings?: string[][];
        }[] = [
            // a list: its entries
            {
                holds: `<numberList>4 5 6</numberList>`,
                references: `[$g[1]] [$g[3]]`,
                text: `[4] [6]`,
            },
            // a math tuple: the entries of its value
            {
                holds: `<math>(4,5,6)</math>`,
                references: `[$g[1]] [$g[2]] [$g[3]]`,
                text: `[4] [5] [6]`,
            },
            // a point: its coordinates
            {
                holds: `<point>(4,5)</point>`,
                references: `[$g[1]] [$g[2]]`,
                text: `[4] [5]`,
            },
            // a vector, a matrix and a math input
            {
                holds: `<vector>(1,2)</vector>`,
                references: `[$g[2]]`,
                text: `[2]`,
            },
            {
                holds: `<matrix><row>1 2</row><row>3 4</row></matrix>`,
                references: `[$g[2][1]]`,
                text: `[3]`,
            },
            {
                holds: `<mathInput prefill="(1,2)"/>`,
                references: `[$g[2]]`,
                text: `[2]`,
            },
            // a repeat: its iterations
            {
                holds: `<repeat for="1 2" valueName="v"><math>$v</math></repeat>`,
                references: `[$g[2]]`,
                text: `[2]`,
            },
            // a scalar number takes no index
            {
                holds: `<number>4</number>`,
                references: `[$g[1]]`,
                text: `[＿]`,
                warnings: [["doenet-w0100", "$g[1]"]],
            },
            // nor does a `<p>`
            {
                holds: `<p>hi</p>`,
                references: `[$g[1]]`,
                text: `[＿]`,
                warnings: [["doenet-w0180", "$g[1]"]],
            },
            // blank text and a `<setup>` are not content
            {
                holds: `
                <setup><number name="k">3</number></setup>
                <math>(4,5)</math>
            `,
                references: `[$g[2]]`,
                text: `[5]`,
            },
            // a group holding one group holding one math
            {
                holds: `<group><math>(4,5)</math></group>`,
                references: `[$g[2]]`,
                text: `[5]`,
            },
        ];
        for (const { holds, references, text, warnings = [] } of cases) {
            const result = await textAndWarnings(
                `<group name="g">${holds}</group><p name="p">${references}</p>`,
            );
            expect(result.text, holds).eq(text);
            expect(result.warnings, holds).eqls(warnings);
        }
    });

    it("passes an index after a group holding only a reference to what it names", async () => {
        const cases: {
            before: string;
            holds: string;
            references: string;
            text: string;
            warnings?: string[][];
        }[] = [
            // a list: its entries
            {
                before: `<numberList name="nl">4 5 6</numberList>`,
                holds: `$nl`,
                references: `[$g[1]] [$g[2]]`,
                text: `[4] [5]`,
            },
            // a math and a point: the entries of their values
            {
                before: `<math name="m">(4,5,6)</math>`,
                holds: `$m`,
                references: `[$g[1]] [$g[3]]`,
                text: `[4] [6]`,
            },
            {
                before: `<point name="P">(4,5)</point>`,
                holds: `$P`,
                references: `[$g[2]]`,
                text: `[5]`,
            },
            // a repeat: its iterations
            {
                before: `<repeatForSequence name="r" length="3" valueName="v"><number>$v</number></repeatForSequence>`,
                holds: `$r`,
                references: `[$g[2]]`,
                text: `[2]`,
            },
            // a `<conditionalContent>`: the case it shows, and then into it
            {
                before: `<conditionalContent name="cc"><case condition="false"><math>(1,2)</math></case><else><math>(3,4)</math></else></conditionalContent>`,
                holds: `$cc`,
                references: `[$g[1]] [$g[1][2]]`,
                text: `[(3, 4)] [4]`,
            },
            // a group holding one component: that component
            {
                before: `<group name="g2"><math>(7,8)</math></group>`,
                holds: `$g2`,
                references: `[$g[2]]`,
                text: `[8]`,
            },
            // a scalar number takes no index
            {
                before: `<number name="n">4</number>`,
                holds: `$n`,
                references: `[$g[1]]`,
                text: `[＿]`,
                warnings: [["doenet-w0100", "$g[1]"]],
            },
            // nor does a `<p>`
            {
                before: `<p name="q">hi</p>`,
                holds: `$q`,
                references: `[$g[1]]`,
                text: `[＿]`,
                warnings: [["doenet-w0180", "$g[1]"]],
            },
            // a group holding two components: they name nothing after an index
            {
                before: `<group name="g2"><math>1</math><math>2</math></group>`,
                holds: `$g2`,
                references: `[$g[2]]`,
                text: `[＿]`,
                warnings: [["doenet-w0188", "$g[2]"]],
            },
        ];
        for (const {
            before,
            holds,
            references,
            text,
            warnings = [],
        } of cases) {
            const result = await textAndWarnings(
                `${before}<group name="g">${holds}</group><p name="p">${references}</p>`,
            );
            expect(result.text, holds).eq(text);
            expect(result.warnings, holds).eqls(warnings);
        }
    });

    it("passes an index after a pick, a case or an iteration holding one value", async () => {
        const { text, warnings } = await textAndWarnings(`
    <select name="s" numToSelect="2">
      <option><math>(1,2,3)</math></option>
      <option><point>(7,8)</point></option>
    </select>
    <math name="m">(4,5)</math>
    <select name="t"><option>$m</option></select>
    <repeat name="r" for="1 2" valueName="v"><point>($v,9)</point></repeat>
    <repeat name="r2" for="1 2" valueName="v"><math>($v,9)</math></repeat>
    <conditionalContent name="cc"><case condition="false"><math>(1,2)</math></case><else><math>(3,4)</math></else></conditionalContent>
    <conditionalContent name="cc2" condition="true"><math>(5,6)</math></conditionalContent>
    <p name="p">[$s[1][1]] [$s[2][1]] [$t[1][2]] [$r[1][1]] [$r[2][2]] [$r2[2][1]] [$cc[1][2]] [$cc2[1][1]]</p>
    `);
        // the picks are in an order chosen at random
        const [s1, s2, ...rest] = text.split(" ");
        expect([s1, s2].sort()).eqls(["[1]", "[7]"]);
        expect(rest.join(" ")).eq("[5] [1] [9] [2] [4] [5]");
        expect(warnings).eqls([]);
    });

    it("passes an index to an iteration's one text, and names nothing past a group of several", async () => {
        // The examples in the docs (`reference/select.mdx`) and the
        // changesets: a text takes no index (`doenet-w0100`), and an index
        // past the end of a group holding several names nothing, as one
        // within it does
        const { text, warnings } = await textAndWarnings(`
    <select name="s"><option><math>(1,2,3)</math></option></select>
    <repeat name="r" for="a b" valueName="v"><text>$v</text></repeat>
    <group name="g"><math>a</math><math>b</math></group>
    <p name="p">[$s[1][2]] [$r[1][2]] [$g[5]]</p>
    `);
        expect(text).eq("[2] [＿] [＿]");
        expect(warnings).eqls([
            ["doenet-w0100", "$r[1][2]"],
            ["doenet-w0188", "$g[5]"],
        ]);
    });

    it("names the iterations of a repeat that is a group's whole content from an extend of the group", async () => {
        // `$e[1]` names the first iteration, and its name is the shortest
        // path to it (`e:1`, not `e.r:1`). The renderer ids are these names.
        const { core } = await createTestCore({
            doenetML: `
    <group name="g"><repeat name="r" for="1 2" valueName="v"><math name="m">$v</math></repeat></group>
    <group name="e" extend="$g"/>
    `,
        });
        const rootNames = Object.values((core as any).core.rootNames);
        expect(rootNames).toEqual(
            expect.arrayContaining(["e:1", "e:1.m", "e:2", "e:2.m"]),
        );
        expect(rootNames).not.toContain("e.r:1");
    });

    it("names nothing after a group holding text beside its component, and says how many it holds", async () => {
        const { text, warnings, errors, infos } = await shownAndReported(
            `<numberList name="nl">4 5 6</numberList><group name="g">Value: $nl</group><group name="h"><math>1</math><math>2</math><math>3</math></group><p name="p">[$g[1]] [$h[1]]</p>`,
        );
        expect(text).eq("[＿] [＿]");
        expect([...errors, ...infos]).eqls([]);
        expect(
            warnings.map((w) => [w.code, w.args.reference, w.args.count]),
        ).eqls([
            ["doenet-w0188", "$g[1]", 2],
            ["doenet-w0188", "$h[1]", 3],
        ]);
        expect(warnings[0].message).contains("holds 2 components");
    });

    it("passes an index after an extend, a copy or a collected group holding one component", async () => {
        const { text, warnings } = await textAndWarnings(`
    <group name="g"><math>(1,2)</math></group>
    <group name="g2" extend="$g"/>
    <group name="g3" copy="$g"/>
    <section name="a"><group><math>(3,4)</math></group><group><point>(5,6)</point></group></section>
    <collect name="c" from="$a" componentType="group"/>
    <p name="p">[$g2[2]] [$g3[1]] [$c[1][2]] [$c[2][1]]</p>
    `);
        expect(text).eq("[2] [1] [4] [5]");
        expect(warnings).eqls([]);
    });

    it("gives #2166's rows by the rule: one component takes the index, two name nothing", async () => {
        for (const { holds, text } of [
            { holds: `<math>(4,5,6)</math>`, text: `[4] [5] [6] [6]` },
            {
                holds: `<numberList>4 5 6</numberList>`,
                text: `[4] [5] [6] [6]`,
            },
            { holds: `<point>(4,5)</point>`, text: `[4] [5] [＿] [＿]` },
        ]) {
            const result = await textAndWarnings(
                `<group name="g">${holds}</group><number name="i">3</number><p name="p">[$g[1]] [$g[2]] [$g[3]] [$g[$i]]</p>`,
            );
            expect(result.text, holds).eq(text);
            expect(result.warnings, holds).eqls([]);
        }
        for (const holds of [
            `<math>(4,5,6)</math><number>9</number>`,
            `<number>9</number><math>(4,5,6)</math>`,
            `<math>(4,5,6)</math><math>(7,8)</math>`,
            `<point>(4,5)</point><point>(7,8)</point>`,
        ]) {
            const { text, warnings } = await shownAndReported(
                `<group name="g">${holds}</group><number name="i">3</number><p name="p">[$g[1]] [$g[2]] [$g[3]] [$g[$i]]</p>`,
            );
            expect(text, holds).eq("[＿] [＿] [＿] [＿]");
            expect(
                warnings.map((w) => w.code),
                holds,
            ).eqls(Array(4).fill("doenet-w0188"));
        }
    });

    it("passes an index after a group holding a reference to a group holding a reference to a composite", async () => {
        // `$x` stands for `x`, which stands for what `$cc` or `$r` names, so
        // `$g` indexes as `$cc` or `$r` does, and counts as one component
        // when beside others
        const { text, warnings } = await textAndWarnings(`
    <conditionalContent name="cc"><case condition="true"><math>(4,5)</math></case></conditionalContent>
    <group name="x">$cc</group>
    <group name="g">$x</group>
    <select name="s"><option>$x</option></select>
    <repeat name="r" for="1 2" valueName="v"><math>($v,9)</math></repeat>
    <group name="y">$r</group>
    <group name="h">$y</group>
    <p name="p">[$g[1]] [$g[1][2]] [$s[1][1][2]] [$h[2]] [$h[2][1]]</p>
    `);
        expect(text).eq("[(4, 5)] [5] [5] [(2, 9)] [2]");
        expect(warnings).eqls([]);

        const several = await shownAndReported(`
    <select name="s" numToSelect="3"><option><math>7</math></option><option><math>8</math></option><option><math>9</math></option></select>
    <group name="g"><math>1</math><math>2</math><math>3</math>$s</group>
    <group name="h">$g</group>
    <p name="p">[$g[1]] [$h[1]]</p>
    `);
        expect(several.text).eq("[＿] [＿]");
        expect(
            several.warnings.map((w) => [
                w.code,
                w.args.reference,
                w.args.count,
            ]),
        ).eqls([
            ["doenet-w0188", "$g[1]", 4],
            ["doenet-w0188", "$h[1]", 4],
        ]);
    });

    it("passes a second index into a list entry reached through a group holding a reference to the list", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathList name="ml">(1,2) (3,4)</mathList>
    <group name="x">$ml</group>
    <select name="s"><option>$ml</option></select>
    <repeatForSequence name="r" length="2" valueName="v"><math>($v,9)</math></repeatForSequence>
    <group name="y">$r</group>
    <mathInput name="mi" bindValueTo="$x[2][1]" />
    <p name="p">[$x[2][1]] [$s[1][2][2]] [$y[2][1]]</p>
    <p name="q">$ml</p>
    `,
        });
        async function texts() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return [
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .text,
                stateVariables[await resolvePathToNodeIdx("q")].stateValues
                    .text,
            ];
        }
        expect(await texts()).eqls(["[3] [4] [2]", "(1, 2), (3, 4)"]);
        expect(getDiagnosticsByType(core).warnings).eqls([]);

        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        expect(await texts()).eqls(["[7] [4] [2]", "(1, 2), (7, 4)"]);
    });

    it("says an index cannot apply to a group whose one component is text", async () => {
        const { text, warnings } = await textAndWarnings(`
    <group name="g">hello</group>
    <select name="s"><option>hello</option></select>
    <group name="h">$g</group>
    <text name="t">hello</text>
    <p name="p">[$g[1]] [$s[1][1]] [$h[1]] [$t[1]]</p>
    `);
        expect(text).eq("[＿] [＿] [＿] [＿]");
        expect(warnings).eqls([
            ["doenet-w0100", "$g[1]"],
            ["doenet-w0100", "$s[1][1]"],
            ["doenet-w0100", "$h[1]"],
            ["doenet-w0100", "$t[1]"],
        ]);
    });

    it("writes through an index passed to a group's one math", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <group name="g"><math name="m">(1,2,3)</math></group>
    <mathInput name="mi" bindValueTo="$g[2]" />
    <p name="p">$m</p>
    `,
        });
        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("(1, 7, 3)");
    });
});
