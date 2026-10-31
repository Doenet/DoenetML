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
 * - An index below 1 names nothing whatever the length, so it is always one
 *   warning, `doenet-w0104`, quoting the whole reference: the same for a
 *   literal index as for a dynamic one of the same value.
 * - An index past the end is silent, literal or dynamic, since the length of a
 *   list can change (#1499).
 * - An index that cannot be applied at all (`$n.value[1]`) is `doenet-w0100`,
 *   and shows nothing rather than the value it was written on.
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
    it("shows nothing, and an index below 1 gets one coded warning quoting the whole reference", async () => {
        const cases: { body: string; reference: string }[] = [
            { body: `[$l[0]]`, reference: "$l[0]" },
            { body: `[$l[-1]]`, reference: "$l[-1]" },
            { body: `[$l[0].x]`, reference: "$l[0].x" },
            // The parentheses are not part of the reference.
            { body: `[$(l[0])]`, reference: "$l[0]" },
            {
                body: `<number name="i">0</number>[$l[$i]]`,
                reference: "$l[$i]",
            },
            {
                body: `<number name="i">-1</number>[$l[$i]]`,
                reference: "$l[$i]",
            },
            { body: `[$P.xs[0]]`, reference: "$P.xs[0]" },
            {
                body: `<number name="i">0</number>[$P.xs[$i]]`,
                reference: "$P.xs[$i]",
            },
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
            expect(text, body).eq("[]");
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

    it("marks the reference the author wrote", async () => {
        const { warnings, doenetML } = await shownAndReported(
            `<p name="p">[$l[0]]</p>`,
        );
        const { start, end } = warnings[0].position!;
        expect(doenetML.substring(start.offset!, end.offset!)).eq("$l[0]");
    });

    it("is reported the same in an extend attribute", async () => {
        const { warnings, errors } = await shownAndReported(
            `<p name="p"><math extend="$l[0]" /></p>`,
        );
        expect(errors).eqls([]);
        expect(warnings.length).eq(1);
        expect(warnings[0].code).eq("doenet-w0104");
        expect(warnings[0].args).eqls({ reference: "$l[0]" });
    });

    it("is silent past the end, literal or dynamic", async () => {
        for (const body of [
            `[$l[10]]`,
            `<number name="i">10</number>[$l[$i]]`,
            `[$P.xs[3]]`,
        ]) {
            const { text, warnings, errors, infos } = await shownAndReported(
                inParagraph(body),
            );
            expect(text, body).eq("[]");
            expect([...warnings, ...errors, ...infos], body).eqls([]);
        }
    });

    it("warns when a dynamic index becomes 0, as the literal index does", async () => {
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
        expect(await text()).eq("[]");
        const { warnings } = getDiagnosticsByType(core);
        expect(warnings.length).eq(1);
        expect(warnings[0].code).eq("doenet-w0104");
        expect(warnings[0].args).eqls({ reference: "$l[$i]" });

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        expect(await text()).eq("[3]");
    });

    it("shows nothing for an index on a property that is not an array", async () => {
        // It used to show `5` while warning that the index cannot be used.
        const { text, warnings, errors, infos } = await shownAndReported(
            `<p name="p">[$n.value[1]]</p>`,
        );
        expect(text).eq("[]");
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
            expect(text, reference).eq("[]");
            expect(warnings.length, reference).eq(1);
            expect(warnings[0].code, reference).eq("doenet-w0104");
            expect(warnings[0].args, reference).eqls({ reference });
        }
    });

    it("codes a name that names more than one thing", async () => {
        const { warnings } = await shownAndReported(
            `<group><text name="t">a</text><text name="t">b</text></group><p name="p">[$t]</p>`,
        );
        expect(warnings.length).eq(1);
        expect(warnings[0].code).eq("doenet-w0105");
        expect(warnings[0].args).eqls({ reference: "$t" });
    });
});
