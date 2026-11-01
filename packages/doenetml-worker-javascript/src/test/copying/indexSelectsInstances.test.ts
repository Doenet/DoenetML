import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * D27 (#2420): an index selects among the instances a component produces --
 * the entries of a list, the iterations of a repeat, the picks of a select --
 * and never among the children of a container.
 *
 * - An iteration or a pick whose whole content is one indexable component
 *   passes the next index to it, so nested repeats take one index per level.
 * - An index that selects a child of a `<group>`, of an iteration or pick with
 *   several components, or of what a `<conditionalContent>` shows, still
 *   selects it, with a deprecation warning (`doenet-w0179`).
 * - The diagnostics name what the author wrote.
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

        expect(await text()).eq("[11] [13] [22] []");

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
        expect(await text()).eq("[11] [] [22] [31]");

        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        expect(await text()).eq("[11] [13] [22] [31]");

        // No index selected a child of anything
        expect(
            getDiagnosticsByType(core).warnings.filter(
                (w) => w.code === "doenet-w0179",
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

        expect(await texts()).eqls(["[1a1] [2a2] [2b1] []", "[2b1, 2b2]"]);

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
                (w) => w.code === "doenet-w0179",
            ),
        ).eqls([]);
    });

    it("reads the old form of an index into nested repeats with the new meaning", async () => {
        // `$a[2][1][3]` used to be iteration 3 of the repeat that is the first
        // child of iteration 2. It is now iteration 1 of that repeat, then
        // index 3 into that iteration, which holds only one `<number>`, so it
        // names nothing, with the usual warning.
        const { text, warnings } = await shownAndReported(`
    <repeatForSequence from="1" to="3" valueName="i" name="a">
      <repeatForSequence from="1" to="3" valueName="j" name="b">
        <number name="c">$i + 3$j</number>
      </repeatForSequence>
    </repeatForSequence>
    <p name="p">[$a[2][3]] [$a[2][3].c] [$a[2][1][3]]</p>
    `);
        expect(text).eq("[11] [11] []");
        expect(warnings.map((w) => w.code)).eqls(["doenet-w0104"]);
        expect(warnings[0].args).eqls({ reference: "$a[2][1][3]" });
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
        expect(pastList.text).eq("[]");
        expect(pastList.warnings).eqls([]);

        const pastRepeat = await shownAndReported(
            `${setup}<select name="s"><option>$rp</option></select><p name="p">[$s[1][3]]</p>`,
        );
        expect(pastRepeat.text).eq("[]");
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

    it("still warns of an index into a pick holding only a reference to one component", async () => {
        const { text, warnings } = await shownAndReported(
            `<setup><math name="m">x</math></setup><select name="s"><option>$m</option></select><p name="p">[$s[1][1]]</p>`,
        );
        expect(text).eq("[x]");
        expect(warnings.map((w) => w.code)).eqls(["doenet-w0179"]);
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

        expect(await text()).eq("[2] []");

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
        expect(await text()).eq("[] []");

        const { warnings, errors } = getDiagnosticsByType(core);
        expect([...warnings, ...errors].map((d) => [d.code, d.message])).eqls(
            [],
        );
    });

    it("keeps selecting a child by index, with a deprecation warning", async () => {
        const cases: {
            body: string;
            text: string;
            reference: string;
            suggestion: string;
            named: string;
            container: string;
            component: string;
        }[] = [
            {
                body: `<group name="g"><math>a</math><math>b</math></group><p name="p">[$g[2]]</p>`,
                text: "[b]",
                reference: "$g[2]",
                suggestion: "$g.x",
                named: "no",
                container: "group",
                component: "group",
            },
            {
                body: `<group name="g"><math>a</math><math name="m">b</math></group><p name="p">[$g[2]]</p>`,
                text: "[b]",
                reference: "$g[2]",
                suggestion: "$g.m",
                named: "yes",
                container: "group",
                component: "group",
            },
            {
                body: `<select name="s"><option><math>a</math><math>b</math></option></select><p name="p">[$s[1][2]]</p>`,
                text: "[b]",
                reference: "$s[1][2]",
                suggestion: "$s[1].x",
                named: "no",
                container: "pick",
                component: "select",
            },
            {
                // A pick holding one component that is not indexable
                body: `<select name="s"><option><math name="m">a</math></option></select><p name="p">[$s[1][1]]</p>`,
                text: "[a]",
                reference: "$s[1][1]",
                suggestion: "$s[1].m",
                named: "yes",
                container: "pick",
                component: "select",
            },
            {
                body: `<repeatForSequence name="r" length="2" valueName="v"><math>$v</math><math>2$v</math></repeatForSequence><p name="p">[$r[2][2]]</p>`,
                text: "[2 * 2]",
                reference: "$r[2][2]",
                suggestion: "$r[2].x",
                named: "no",
                container: "iteration",
                component: "repeatForSequence",
            },
            {
                body: `<repeat name="r" for="1 2" valueName="v"><math>$v</math><math name="w">2$v</math></repeat><p name="p">[$r[1][2]]</p>`,
                text: "[2 * 1]",
                reference: "$r[1][2]",
                suggestion: "$r[1].w",
                named: "yes",
                container: "iteration",
                component: "repeat",
            },
            {
                body: `<conditionalContent name="cc"><case condition="true"><math>a</math><math>b</math></case></conditionalContent><p name="p">[$cc[1][2]]</p>`,
                text: "[b]",
                reference: "$cc[1][2]",
                suggestion: "$cc[1].x",
                named: "no",
                container: "case",
                component: "conditionalContent",
            },
        ];

        for (const { body, text: expectedText, ...args } of cases) {
            const { text, warnings, errors } = await shownAndReported(body);
            expect(text, body).eq(expectedText);
            expect(errors, body).eqls([]);
            expect(
                warnings.map((w) => w.code),
                body,
            ).eqls(["doenet-w0179"]);
            expect(warnings[0].args, body).eqls(args);
        }
    });

    it("does not warn of the setup a repeat adds after an iteration's content", async () => {
        // An index after the content of an iteration reaches the `<setup>` that
        // holds `valueName`, which shows nothing, as before. There is no child
        // the author wrote to name, so there is no deprecation warning.
        const { text, warnings, errors, infos } = await shownAndReported(`
    <repeat name="r" for="a b" valueName="v"><text>$v</text></repeat>
    <repeat name="r2" extend="$r" />
    <group name="g" extend="$r[1]" />
    <p name="p">[$r[1][2]] [$r2[1][2]] [$g[2]]</p>
    `);
        expect(text).eq("[] [] []");
        expect(warnings).eqls([]);
        expect(errors).eqls([]);
        expect(infos).eqls([]);
    });

    it("does not warn of the setup in an iteration made later, in an unlinked copy, or after a reload", async () => {
        // The setup is recognized by a mark the repeat gives it, which an
        // iteration added when the repeat updates, an unlinked copy of the
        // repeat or of an iteration, and a document restored from a save
        // also carry
        const doenetML = `
    <mathInput name="n" prefill="1" />
    <sequence name="seq" length="$n" />
    <repeat name="r" for="$seq" valueName="v"><text>$v</text></repeat>
    <repeat name="r2" copy="$r" />
    <group name="g" copy="$r[1]" />
    <p name="p">[$r[2]] [$r[2][2]] [$r2[1][2]] [$g[2]]</p>
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
            // The index reached the setup, which names nothing to warn of
            expect(
                getDiagnosticsByType(core).warnings.filter((w) =>
                    ["doenet-w0179", "doenet-w0104"].includes(w.code),
                ),
            ).eqls([]);
        }

        // `r` has no iteration 2 yet
        await check("[] [] [] []");

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check("[2] [] [] []");

        await core.saveImmediately();
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));
        await check("[2] [] [] []");
    });

    it("warns of a setup the author wrote, as of any other child", async () => {
        // Only the `<setup>` a repeat adds is skipped: one the author wrote is
        // a child the index selects, even last in a repeat with no
        // `valueName`, or in a copy of the repeat
        const cases: { body: string; references: string[] }[] = [
            {
                body: `<select name="s"><option><setup><number name="n">5</number></setup><math name="m">$n</math></option></select><p name="p">[$s[1][1].n]</p>`,
                references: ["$s[1][1]"],
            },
            {
                body: `<repeat name="r" for="a b"><text>x</text><setup><number name="n">5</number></setup></repeat><p name="p">[$r[1][2].n]</p>`,
                references: ["$r[1][2]"],
            },
            {
                body: `<repeat name="r" for="a b" valueName="v"><setup><number name="n">5</number></setup><text>$v</text></repeat><repeat name="r2" extend="$r" /><p name="p">[$r2[1][1].n] [$r2[1][3]]</p>`,
                references: ["$r2[1][1]"],
            },
        ];

        for (const { body, references } of cases) {
            const { warnings } = await shownAndReported(body);
            expect(
                warnings.map((w) => [w.code, w.args.reference]),
                body,
            ).eqls(references.map((r) => ["doenet-w0179", r]));
        }
    });

    it("words the deprecation warning with what the author wrote", async () => {
        const { warnings } = await shownAndReported(
            `<select name="s"><option><math>a</math><math name="m">b</math></option></select><p name="p">$s[1][1] $s[1][2]</p>`,
        );
        expect(warnings.map((w) => w.message).sort()).eqls([
            '[deprecation] `$s[1][1]` selects a child of what a `<select>` picked by its position, which is deprecated: an index selects among what a component makes, not among the children of one. Give the child a name, such as `name="x"`, and write `$s[1].x` instead.',
            "[deprecation] `$s[1][2]` selects a child of what a `<select>` picked by its position, which is deprecated: an index selects among what a component makes, not among the children of one. Write `$s[1].m` instead.",
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
            expect(text, body).eq("[]");
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
            expect(text, body).eq("[]");
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
