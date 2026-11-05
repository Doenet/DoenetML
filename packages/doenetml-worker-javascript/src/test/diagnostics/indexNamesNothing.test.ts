import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { updateMathInputValue, updateValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * An index that names nothing (#2407). NAME-2: "An index of 0, a negative
 * index, or one past the end names nothing", and VAL-5: a reference with
 * nothing to read is missing, never a value. The rule for reporting it:
 *
 * - A literal index below 1 never names anything, so it is one warning,
 *   `doenet-w0104`, quoting the whole reference.
 * - An index that names nothing now, past the end (literal or dynamic, as the
 *   length of a list can change, #1499) or below 1 while written as a
 *   reference, is the info `doenet-i0054` while it does, and none once it
 *   names something again: the same, bare or as a tag (D37).
 * - An index that cannot be applied at all (`$n.value[1]`) is `doenet-w0100`,
 *   and shows a blank rather than the value it was written on. A warning
 *   that says why the reference names nothing comes without the info.
 */
const preamble = `<mathList name="l">1 2 3</mathList><number name="n">5</number><point name="P">(1,2)</point>`;

async function shownAndReported(body: string) {
    const doenetML = `${preamble}${body}`;
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML,
    });
    const stateVariables = await core.returnAllStateVariables(false, true);
    const text =
        stateVariables[await resolvePathToNodeIdx("p")].stateValues.text;
    const { warnings, errors, infos } = getDiagnosticsByType(core);
    return { text, warnings, errors, infos, doenetML };
}

/**
 * `body` in a paragraph `p`, with any `<number>` or `<repeatForSequence>` the
 * index needs written before it, so that only the reference is in `p`.
 */
function inParagraph(body: string) {
    const at = body.lastIndexOf(">[");
    return at === -1
        ? `<p name="p">${body}</p>`
        : `${body.slice(0, at + 1)}<p name="p">${body.slice(at + 1)}</p>`;
}

describe("An index that names nothing @group4", async () => {
    it("shows a blank, and a literal index below 1 gets one coded warning quoting the whole reference", async () => {
        const cases: { body: string; reference: string }[] = [
            { body: `[$l[0]]`, reference: "$l[0]" },
            { body: `[$l[-1]]`, reference: "$l[-1]" },
            { body: `[$l[0].x]`, reference: "$l[0].x" },
            // The parentheses are not part of the reference.
            { body: `[$(l[0])]`, reference: "$l[0]" },
            { body: `[$P.xs[0]]`, reference: "$P.xs[0]" },
            { body: `[$n.value[0]]`, reference: "$n.value[0]" },
            {
                body: `<repeatForSequence name="r" length="3" valueName="v"><text>$v</text></repeatForSequence>[$r[0]]`,
                reference: "$r[0]",
            },
        ];

        for (const { body, reference } of cases) {
            const { text, warnings, errors, infos } = await shownAndReported(
                inParagraph(body),
            );
            expect(text, body).eq("[＿]");
            expect(errors, body).eqls([]);
            expect(infos, body).eqls([]);
            expect(warnings.length, body).eq(1);
            expect(warnings[0].code, body).eq("doenet-w0104");
            expect(warnings[0].args, body).eqls({ reference });
            expect(warnings[0].message, body).eq(
                `No referent found for reference: \`${reference}\``,
            );
        }
    });

    it("gives a dynamic index below 1 the info that it names nothing now", async () => {
        for (const { body, reference } of [
            {
                body: `<number name="i">0</number>[$l[$i]]`,
                reference: "$l[$i]",
            },
            {
                body: `<number name="i">-1</number>[$l[$i]]`,
                reference: "$l[$i]",
            },
            {
                body: `<number name="i">0</number>[$P.xs[$i]]`,
                reference: "$P.xs[$i]",
            },
        ]) {
            const { text, warnings, errors, infos } = await shownAndReported(
                inParagraph(body),
            );
            expect(text, body).eq("[＿]");
            expect([...warnings, ...errors], body).eqls([]);
            expect(
                infos.map((i) => i.code),
                body,
            ).eqls(["doenet-i0054"]);
            expect(infos[0].message, body).eq(
                `\`${reference}\` names nothing now, so it is a blank until it does.`,
            );
        }
    });

    it("marks the reference the author wrote", async () => {
        const { warnings, doenetML } = await shownAndReported(
            `<p name="p">[$l[0]]</p>`,
        );
        const { start, end } = warnings[0].position!;
        expect(doenetML.substring(start.offset!, end.offset!)).eq("$l[0]");
    });

    it("is a warning in an extend or copy attribute, marked at the reference", async () => {
        // The same reference on a tag is the same warning, and the tag is a
        // missing `<math>`, shown as a blank (D37).
        for (const attribute of ["extend", "copy"]) {
            const { text, warnings, errors, doenetML } = await shownAndReported(
                `<p name="p"><math ${attribute}="$l[0]" /></p>`,
            );
            expect(text, attribute).eq("＿");
            expect(errors, attribute).eqls([]);
            expect(warnings.length, attribute).eq(1);
            expect(warnings[0].code, attribute).eq("doenet-w0104");
            expect(warnings[0].args, attribute).eqls({ reference: "$l[0]" });
            const { start, end } = warnings[0].position!;
            expect(
                doenetML.substring(start.offset!, end.offset!),
                attribute,
            ).eq("$l[0]");
        }
    });

    it("is an info past the end, literal or dynamic, bare or a tag", async () => {
        for (const body of [
            `[$l[10]]`,
            `<number name="i">10</number>[$l[$i]]`,
            `[$P.xs[3]]`,
            `[<math extend="$l[10]"/>]`,
        ]) {
            const { text, warnings, errors, infos } = await shownAndReported(
                inParagraph(body),
            );
            expect(text, body).eq("[＿]");
            expect([...warnings, ...errors], body).eqls([]);
            expect(
                infos.map((i) => i.code),
                body,
            ).eqls(["doenet-i0054"]);
        }
    });

    it("warns once for a property that does not exist, with an index as without", async () => {
        // A property the referent's type does not have is a mistake in what
        // the author wrote (DIAG-2, #2434 item 1, #2450), so it is one
        // `doenet-w0104` quoting the reference, whatever index follows it:
        // the index is applied only to a property that exists.
        for (const { body, reference } of [
            { body: `[$n.nonexistent]`, reference: "$n.nonexistent" },
            { body: `[$n.nonexistent[1]]`, reference: "$n.nonexistent[1]" },
            { body: `[$n.nonexistent[0]]`, reference: "$n.nonexistent[0]" },
            { body: `[$P.nonexistent[0]]`, reference: "$P.nonexistent[0]" },
        ]) {
            const { text, warnings, errors, infos } = await shownAndReported(
                inParagraph(body),
            );
            expect(text, body).eq("[＿]");
            expect([...errors, ...infos], body).eqls([]);
            expect(warnings.length, body).eq(1);
            expect(warnings[0].code, body).eq("doenet-w0104");
            expect(warnings[0].message, body).contain(reference);
        }
    });

    it("warns for a property that does not exist after an index into picks or iterations", async () => {
        // The index is resolved at run time, and what follows it is a
        // property of what it picks, not a name of the document.
        for (const { body, reference } of [
            {
                body: `<select name="s"><option><math name="x">1</math></option></select>[$s[1].nonexistent]`,
                reference: "$s[1].nonexistent",
            },
            {
                body: `<select name="s" numToSelect="2"><option><math name="x">1</math></option><option><math name="x">2</math></option></select>[$s[2].nonexistent]`,
                reference: "$s[2].nonexistent",
            },
            {
                body: `<repeatForSequence name="r" length="2" valueName="v"><math>$v</math></repeatForSequence>[$r[1].nonexistent]`,
                reference: "$r[1].nonexistent",
            },
        ]) {
            const { text, warnings, errors, infos } = await shownAndReported(
                inParagraph(body),
            );
            expect(text, body).eq("[＿]");
            expect([...errors, ...infos], body).eqls([]);
            expect(
                warnings.map((w) => w.code),
                body,
            ).eqls(["doenet-w0104"]);
            expect(warnings[0].message, body).contain(reference);
        }

        // On a tag, as for `<math extend="$n.nonexistent"/>`, it is the same
        // warning and the tag is missing, and a property the iteration's math
        // has is made.
        const onTag = await shownAndReported(
            `<repeatForSequence name="r" length="2" valueName="v"><math>$v</math></repeatForSequence><p name="p">[<math extend="$r[1].nonexistent"/>][<math extend="$r[2].value"/>]</p>`,
        );
        expect(onTag.text).eq("[＿][2]");
        expect([...onTag.errors, ...onTag.infos]).eqls([]);
        expect(onTag.warnings.map((e) => e.code)).eqls(["doenet-w0104"]);
        expect(onTag.warnings[0].message).contain("$r[1].nonexistent");

        // A property the picked component has, or a name, stays silent.
        const { text, warnings, errors, infos } = await shownAndReported(
            inParagraph(
                `<select name="s"><option><math name="x">1</math></option></select>[$s[1].value][$s[1].x]`,
            ),
        );
        expect(text).eq("[1][1]");
        expect([...warnings, ...errors, ...infos]).eqls([]);
    });

    it("leaves a property the type has, with no value now, silent", async () => {
        // VAL-5: the referent's type has the property, which is missing now.
        for (const body of [`[$P.z]`]) {
            const { text, warnings, errors, infos } = await shownAndReported(
                inParagraph(body),
            );
            expect(text, body).eq("[＿]");
            expect([...warnings, ...errors, ...infos], body).eqls([]);
        }

        // A collect with no limit has the property `maxNumber`.
        const { warnings, errors, infos } = await shownAndReported(
            `<collect name="c" componentType="math" from="$l"/><p name="p">[$c.maxNumber]</p>`,
        );
        expect([...warnings, ...errors, ...infos]).eqls([]);
    });

    it("warns for a property a function does not have, in an evaluation", async () => {
        // `x` is not a name in the document and `<function>` has no
        // property `x`, so `$$f.x(2)` names a property that does not exist.
        const { warnings, errors, infos } = await shownAndReported(
            `<function name="f">t^2</function><p name="p">[$$f.x(2)]</p>`,
        );
        expect([...errors, ...infos]).eqls([]);
        expect(warnings.map((w) => w.code)).eqls(["doenet-w0104"]);
        expect(warnings[0].message).contain("$$f.x");
    });

    it("gives the info while a dynamic index is 0, and none once it names something", async () => {
        const doenetML = `${preamble}<mathInput name="i" prefill="2" /><p name="p">[$l[$i]]</p>`;
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

        expect(await text()).eq("[2]");
        expect(getDiagnosticsByType(core).warnings).eqls([]);

        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        expect(await text()).eq("[＿]");
        const { warnings, infos } = getDiagnosticsByType(core);
        expect(warnings).eqls([]);
        expect(infos.map((i) => i.code)).eqls(["doenet-i0054"]);
        expect(infos[0].args?.source).eq("$l[$i]");

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        expect(await text()).eq("[3]");
        expect(getDiagnosticsByType(core).infos).eqls([]);
        expect(getDiagnosticsByType(core).warnings).eqls([]);

        // past the end, and back: one info while it lasts, never piling up
        for (const latex of ["7", "0", "9"]) {
            await updateMathInputValue({
                latex,
                componentIdx: await resolvePathToNodeIdx("i"),
                core,
            });
            expect(await text(), latex).eq("[＿]");
            expect(
                getDiagnosticsByType(core).infos.map((i) => i.code),
                latex,
            ).eqls(["doenet-i0054"]);
        }
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        expect(await text()).eq("[1]");
        expect(getDiagnosticsByType(core).infos).eqls([]);
    });

    it("shows a blank for an index on a property that is not an array", async () => {
        // It used to show `5` while warning that the index cannot be used.
        const { text, warnings, errors, infos } = await shownAndReported(
            `<p name="p">[$n.value[1]]</p>`,
        );
        expect(text).eq("[＿]");
        expect(errors).eqls([]);
        expect(infos).eqls([]);
        expect(warnings.length).eq(1);
        expect(warnings[0].code).eq("doenet-w0100");
        expect(warnings[0].args).eqls({ reference: "$n.value[1]" });
    });

    it("binds an input to nothing through an index on a property that is not an array", async () => {
        // It used to bind to the whole value, so typing changed `n`.
        const doenetML = `${preamble}<mathInput name="mi" bindValueTo="$n.value[1]" /><p name="p">$mi, $n</p>`;
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

        expect(await text()).eq("＿, 5");
        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        expect(await text()).eq("7, 5");
        expect(getDiagnosticsByType(core).warnings.map((w) => w.code)).eqls([
            "doenet-w0100",
        ]);
    });

    it("gives an action a target with an index below 1 nothing to change", async () => {
        const doenetML = `${preamble}<updateValue name="u" target="$P.xs[0]" newValue="9" /><p name="p">$P</p>`;
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("u"),
            core,
        });

        // Read before anything else is evaluated: asking for every state
        // variable resolves the target again, which repeats the index
        // warning, as it repeats `doenet-w0100` for an index that cannot be
        // applied.
        const { warnings } = getDiagnosticsByType(core);
        expect(warnings.map((w) => w.code)).eqls([
            "doenet-w0104",
            "doenet-w0044",
        ]);
        expect(warnings[0].args).eqls({ reference: "$P.xs[0]" });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("(1, 2)");
    });

    it("codes a name that names nothing, quoting the whole reference", async () => {
        // The resolver's warning used to quote the path only up to its first
        // index, with no code.
        for (const reference of ["$nothing", "$nothing.x[2]"]) {
            const { text, warnings } = await shownAndReported(
                `<p name="p">[${reference}]</p>`,
            );
            expect(text, reference).eq("[＿]");
            expect(warnings.length, reference).eq(1);
            expect(warnings[0].code, reference).eq("doenet-w0104");
            expect(warnings[0].args, reference).eqls({ reference });
        }
    });

    it("keeps the info of a tag whose child has a warning of its own", async () => {
        // A warning in what is written in the tag says nothing about its
        // index; one in its reference (`$l[$nothing]`) does, as bare.
        const { warnings, errors, infos } = await shownAndReported(
            `<mathInput name="i" prefill="5"/><group name="pg"><text>a</text><text>b</text></group><p name="p"><text extend="$pg[$i]">$nothing</text><math extend="$l[$nothing]"/></p>`,
        );
        expect(errors).eqls([]);
        expect(warnings.map((w) => w.args)).eqls([
            { reference: "$nothing" },
            { reference: "$nothing" },
        ]);
        expect(infos.map((i) => [i.code, i.args?.source])).eqls([
            ["doenet-i0054", "$pg[$i]"],
        ]);
    });

    it("watches only an index the author wrote, not a repeat's value or index", async () => {
        // `$v` and `$i` read their iteration's entry of the repeat's values
        // and indices, an index the iteration adds, which always names it:
        // watching each would be decided again after every update, in every
        // iteration, for nothing. `$l[$v]` is watched.
        const { core } = await createTestCore({
            doenetML: `<mathList name="l">1 2</mathList><repeatForSequence length="3" valueName="v" indexName="i"><p>$v $i</p><p>$l[$v]</p></repeatForSequence>`,
        });
        const watched = [
            ...(core.core as any).diagnosticsManager._watchedConditions.keys(),
        ].map((idx: number) => {
            const { start, end } = (core.core as any)._components[idx].position;
            return [start.offset, end.offset];
        });
        expect(watched.length).eq(3);
        expect(new Set(watched.map((w) => w.join("-"))).size).eq(1);
        const infos = getDiagnosticsByType(core).infos;
        expect(infos.map((i) => [i.code, i.args?.source])).eqls([
            ["doenet-i0054", "$l[$v]"],
        ]);
    });

    it("codes a name that names more than one thing", async () => {
        const { warnings } = await shownAndReported(
            `<group><text name="t">a</text><text name="t">b</text></group><p name="p">[$t]</p>`,
        );
        expect(warnings.length).eq(1);
        expect(warnings[0].code).eq("doenet-w0105");
        expect(warnings[0].args).eqls({ reference: "$t" });
    });

    it("codes a name in an extend attribute that names more than one thing, as a warning", async () => {
        // The resolver gives no path for more than one referent, so the
        // reference is quoted from where it is marked, inside the attribute.
        // On a tag it is the same warning, and the tag is missing (D37).
        const { text, errors, warnings, doenetML } = await shownAndReported(
            `<group><text name="t">a</text><text name="t">b</text></group><p name="p"><text extend="$t" /></p>`,
        );
        expect(text).eq("＿");
        expect(errors).eqls([]);
        expect(warnings.length).eq(1);
        expect(warnings[0].code).eq("doenet-w0105");
        expect(warnings[0].args).eqls({ reference: "$t" });
        const { start, end } = warnings[0].position!;
        expect(doenetML.substring(start.offset!, end.offset!)).eq("$t");
    });
});
