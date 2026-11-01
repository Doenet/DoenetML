import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { updateMathInputValue, updateMatrixInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * An index selects the entries of a value (D27, "Values with entries";
 * #2421): the same way for every component whose value has entries, decided
 * by the value, not the tag.
 *
 * - A point, vector, coords, or a math whose value is a tuple or vector:
 *   `[i]` is entry i.
 * - A math whose value is a matrix, and a `<matrix>`: `[i]` is row i as a
 *   1×n matrix, and `[i][j]` the entry.
 * - Inputs follow their value: `<mathInput>` as `<math>`, `<matrixInput>` as
 *   `<matrix>`.
 * - `$x.value[i]` is `$x[i]`.
 * - A scalar has no entries: `$m[1]` of `<math>5</math>` names nothing and is
 *   reported (`doenet-w0100`), as `$n[1]` and `$t[1]` are.
 * - An index below 1 is `doenet-w0104`; past the end is silent (#1499).
 * - Indices pass through the entries of a list (`$pl[2][1]`).
 * - A `<spreadsheet>` is selected through `cells` (`doenet-w0182`).
 */
const setup = `<setup>
<point name="P">(3,4)</point>
<vector name="v">(5,6)</vector>
<coords name="c">(1,2)</coords>
<math name="mt">(8,9)</math>
<math name="mv" format="latex">\\langle 8,9 \\rangle</math>
<math name="ms">5</math>
<matrix name="M"><row>1 2</row><row>3 4</row></matrix>
<math name="mm" format="latex">\\begin{bmatrix}1 & 2\\\\3 & 4\\end{bmatrix}</math>
<mathInput name="x" prefill="(1,2)"><label>x</label></mathInput>
<mathInput name="xm" format="latex" prefill="\\begin{bmatrix}1 & 2\\\\3 & 4\\end{bmatrix}"><label>xm</label></mathInput>
<matrixInput name="mi" format="latex" prefill="\\begin{matrix}1 & 2\\\\3 & 4\\end{matrix}"><label>mi</label></matrixInput>
<number name="n">5</number>
<text name="t">hi</text>
<spreadsheet name="ss"><cell>a</cell><cell>b</cell></spreadsheet>
</setup>`;

async function shownAndReported(reference: string, before = setup) {
    const doenetML = `${before}<p name="p">[${reference}]</p>`;
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML,
    });
    const stateVariables = await core.returnAllStateVariables(false, true);
    const text =
        stateVariables[await resolvePathToNodeIdx("p")].stateValues.text;
    const { warnings, errors, infos } = getDiagnosticsByType(core);
    return { text, warnings, errors, infos };
}

/** Check each `[reference, shown]` shows `shown` with no diagnostics. */
async function expectShownSilently(cases: [string, string][], before?: string) {
    for (const [reference, shown] of cases) {
        const { text, warnings, errors, infos } = await shownAndReported(
            reference,
            before,
        );
        expect(text, reference).eq(`[${shown}]`);
        expect([...warnings, ...errors, ...infos], reference).eqls([]);
    }
}

describe("An index into a value with entries @group4", async () => {
    it("selects an entry of a point, vector, coords or a math holding a tuple or vector", async () => {
        await expectShownSilently([
            ["$P[1]", "3"],
            ["$v[1]", "5"],
            ["$c[1]", "1"],
            ["$mt[1]", "8"],
            ["$mt[2]", "9"],
            ["$x[1]", "1"],
            ["$mv[1]", "8"],
        ]);
    });

    it("selects a row of a matrix as a 1×n matrix, and a second index an entry", async () => {
        await expectShownSilently([
            ["$M[1]", "[[1, 2]]"],
            ["$M[1][2]", "2"],
            ["$M[2][1]", "3"],
            ["$mm[1]", "[[1, 2]]"],
            ["$mm[2][1]", "3"],
            ["$xm[2]", "[[3, 4]]"],
            ["$xm[2][1]", "3"],
            ["$mi[1]", "[[1, 2]]"],
            ["$mi[2][1]", "3"],
        ]);
    });

    it("is the same with `.value` before the index", async () => {
        await expectShownSilently([
            ["$mt.value[1]", "8"],
            ["$x.value[1]", "1"],
            ["$xm.value[2][1]", "3"],
            ["$M.value[1][2]", "2"],
            ["$mi.value[1]", "[[1, 2]]"],
            ["$mi.value[2][1]", "3"],
            // `value` is an alias of a point's `coords` and a vector's
            // `displacementCoords`, which take no index of their own
            ["$P.value[2]", "4"],
            ["$v.value[2]", "6"],
        ]);
    });

    it("keeps the forms that already selected entries", async () => {
        await expectShownSilently([
            ["$M.matrix[2][1]", "3"],
            ["$M.matrix[1]", "[[1, 2]]"],
            ["$mi.matrix[2][1]", "3"],
            ["$ss.cells[1][2]", "b"],
            ["$P.xs[1]", "3"],
            ["$v.displacement[1]", "5"],
        ]);
    });

    it("names nothing past the end, silently", async () => {
        await expectShownSilently([
            ["$P[3]", ""],
            ["$mt[3]", ""],
            ["$M[3]", ""],
            ["$M[1][3]", ""],
            ["$mi[3]", ""],
            ["$x[3]", ""],
        ]);
    });

    it("names nothing in a scalar, reported the same way for every type", async () => {
        for (const reference of [
            "$ms[1]",
            "$ms.value[1]",
            "$n[1]",
            "$n.value[1]",
            // an index into a point's coordinates, which are not an array
            "$P.coords[2]",
            "$t[1]",
            "$mt[1][1]",
        ]) {
            const { text, warnings, errors, infos } =
                await shownAndReported(reference);
            expect(text, reference).eq("[]");
            expect([...errors, ...infos], reference).eqls([]);
            expect(
                warnings.map((w) => w.code),
                reference,
            ).eqls(["doenet-w0100"]);
            expect(warnings[0].args, reference).eqls({ reference });
        }
    });

    it("reports an index past a composite's items once, not again as an index into a scalar", async () => {
        // `$g[2]` is past the one item of the group; it is tried on the
        // `<math>5</math>` the group holds, which is not reported again as
        // an index into a scalar.
        const { text, warnings, errors, infos } = await shownAndReported(
            "$g[2]",
            `<group name="g"><math>5</math></group>`,
        );
        expect(text).eq("[]");
        expect([...errors, ...infos]).eqls([]);
        expect(warnings.map((w) => w.code)).eqls(["doenet-w0104"]);
    });

    it("does not read the entries by a name of their own", async () => {
        // The entries are reached only by an index, as for any property
        // that is not public.
        await expectShownSilently([
            ["$mt.__valueEntries", ""],
            ["$mt.__valueEntry1", ""],
            ["$mm.__valueEntry2_1", ""],
        ]);
    });

    it("names nothing below 1, quoting the whole reference", async () => {
        for (const reference of [
            "$mt[0]",
            "$n[0]",
            "$t[0]",
            "$M[0]",
            "$M[1][0]",
        ]) {
            const { text, warnings, errors, infos } =
                await shownAndReported(reference);
            expect(text, reference).eq("[]");
            expect([...errors, ...infos], reference).eqls([]);
            expect(
                warnings.map((w) => w.code),
                reference,
            ).eqls(["doenet-w0104"]);
            expect(warnings[0].args, reference).eqls({ reference });
        }
    });

    it("points an index on a spreadsheet to its cells", async () => {
        for (const [reference, suggestion] of [
            ["$ss[1]", "$ss.cells[1]"],
            ["$ss[1][2]", "$ss.cells[1][2]"],
            ["$$ss[1]", "$$ss.cells[1]"],
        ]) {
            const { text, warnings, errors, infos } =
                await shownAndReported(reference);
            expect(text, reference).eq("[]");
            expect([...errors, ...infos], reference).eqls([]);
            expect(
                warnings.map((w) => w.code),
                reference,
            ).eqls(["doenet-w0182"]);
            expect(warnings[0].args, reference).eqls({
                reference,
                component: "spreadsheet",
                suggestion,
                property: "cells",
            });
            expect(warnings[0].message, reference).eq(
                `\`${reference}\`: an index does not select anything in a \`<spreadsheet>\` itself. Write \`${suggestion}\` to select among its \`cells\`.`,
            );
        }
    });

    it("follows the value of an input as it changes shape", async () => {
        const doenetML = `<mathInput name="a" prefill="(1,2)"><label>a</label></mathInput>
<math name="m">$a</math>
<p name="p1">[$m[2]]</p><p name="p2">[$a[2]]</p><p name="p3">[$m[2][1]]</p>`;
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        const a = await resolvePathToNodeIdx("a");

        async function shown() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return Promise.all(
                ["p1", "p2", "p3"].map(
                    async (name) =>
                        stateVariables[await resolvePathToNodeIdx(name)]
                            .stateValues.text,
                ),
            );
        }

        expect(await shown()).eqls(["[2]", "[2]", "[]"]);

        // a scalar: the index names nothing
        await updateMathInputValue({ latex: "5", componentIdx: a, core });
        expect(await shown()).eqls(["[]", "[]", "[]"]);

        // a longer tuple
        await updateMathInputValue({
            latex: "(3,4,5)",
            componentIdx: a,
            core,
        });
        expect(await shown()).eqls(["[4]", "[4]", "[]"]);

        // a matrix: rows
        await updateMathInputValue({
            latex: "\\begin{bmatrix}1 & 2\\\\3 & 4\\end{bmatrix}",
            componentIdx: a,
            core,
        });
        expect(await shown()).eqls(["[[[3, 4]]]", "[[[3, 4]]]", "[3]"]);

        // Only what the value was when the references were resolved is
        // reported: `$m[2][1]` into the scalar entry 2 of `(1,2)`. That the
        // value changed shape later is not, as an index past the end is not.
        const { warnings, errors, infos } = getDiagnosticsByType(core);
        expect([...errors, ...infos]).eqls([]);
        expect(warnings.map((w) => [w.code, w.args])).eqls([
            ["doenet-w0100", { reference: "$m[2][1]" }],
        ]);
    });

    it("does not report an index into an input with nothing entered", async () => {
        await expectShownSilently(
            [["$e[1]", ""]],
            `<mathInput name="e"><label>e</label></mathInput>`,
        );
    });

    it("writes through an index to the entry", async () => {
        const doenetML = `${setup}
<mathInput name="wM" bindValueTo="$M[1][2]"><label>wM</label></mathInput>
<mathInput name="wmt" bindValueTo="$mt[1]"><label>wmt</label></mathInput>
<mathInput name="wmi" bindValueTo="$mi[2][1]"><label>wmi</label></mathInput>
<mathInput name="wmm" bindValueTo="$mm[2][2]"><label>wmm</label></mathInput>
<p name="pM">$M</p><p name="pmt">$mt</p><p name="pmi">$mi</p><p name="pmm">$mm</p>`;
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        async function textOf(name: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return stateVariables[await resolvePathToNodeIdx(name)].stateValues
                .text;
        }

        expect(await textOf("pM")).eq("[[1, 2], [3, 4]]");
        expect(await textOf("pmt")).eq("(8, 9)");
        expect(await textOf("pmi")).eq("[[1, 2], [3, 4]]");
        expect(await textOf("pmm")).eq("[[1, 2], [3, 4]]");

        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolvePathToNodeIdx("wM"),
            core,
        });
        expect(await textOf("pM")).eq("[[1, 7], [3, 4]]");

        await updateMathInputValue({
            latex: "6",
            componentIdx: await resolvePathToNodeIdx("wmt"),
            core,
        });
        expect(await textOf("pmt")).eq("(6, 9)");

        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("wmi"),
            core,
        });
        expect(await textOf("pmi")).eq("[[1, 2], [5, 4]]");

        await updateMathInputValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("wmm"),
            core,
        });
        expect(await textOf("pmm")).eq("[[1, 2], [3, x]]");

        // and back from the entry to the input
        await updateMatrixInputValue({
            latex: "9",
            componentIdx: await resolvePathToNodeIdx("mi"),
            rowInd: 1,
            colInd: 0,
            core,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("wmi")].stateValues.value
                .tree,
        ).eq(9);
    });

    it("writes a whole row of a matrix through an index, keeping its length", async () => {
        const doenetML = `${setup}
<mathInput name="wmm" bindValueTo="$mm[1]"><label>wmm</label></mathInput>
<mathInput name="wxm" bindValueTo="$xm[2]"><label>wxm</label></mathInput>
<p name="pmm">$mm</p><p name="pxm">$xm</p>`;
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        async function textOf(name: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return stateVariables[await resolvePathToNodeIdx(name)].stateValues
                .text;
        }

        // A tuple is accepted for a row of a `<math>` or `<mathInput>`
        await updateMathInputValue({
            latex: "(7,8)",
            componentIdx: await resolvePathToNodeIdx("wmm"),
            core,
        });
        expect(await textOf("pmm")).eq("[[7, 8], [3, 4]]");
        expect(await textOf("wmm")).eq("[[7, 8]]");

        await updateMathInputValue({
            latex: "(5,6)",
            componentIdx: await resolvePathToNodeIdx("wxm"),
            core,
        });
        expect(await textOf("pxm")).eq("[[1, 2], [5, 6]]");

        // A row of another length is rejected
        await updateMathInputValue({
            latex: "(1,2,3)",
            componentIdx: await resolvePathToNodeIdx("wmm"),
            core,
        });
        expect(await textOf("pmm")).eq("[[7, 8], [3, 4]]");
        expect(await textOf("wmm")).eq("[[7, 8]]");
    });
});

describe("An index into an entry of a list @group4", async () => {
    const lists = `<setup>
<pointList name="pl">(3,4) (1,2)</pointList>
<mathList name="l">1 2</mathList>
<numberList name="nl">5 6</numberList>
<mathList name="tl">(1,2) (3,4)</mathList>
<mathList name="ml">$M.value 5</mathList>
<matrix name="M"><row>1 2</row><row>3 4</row></matrix>
<repeatForSequence name="r" length="3" valueName="v"><point>($v, 10$v)</point></repeatForSequence>
</setup>`;

    it("passes through to the entry's value", async () => {
        await expectShownSilently(
            [
                ["$pl[2][1]", "1"],
                ["$pl[2][2]", "2"],
                ["$pl[2].value[2]", "2"],
                ["$tl[2][1]", "3"],
                // an index into an entry's value is an index into the entry
                ["$tl[2].value[1]", "3"],
                ["$ml[1][2]", "[[3, 4]]"],
                // a repeat that became a list of points (#2163)
                ["$r[2]", "(2, 20)"],
                ["$r[2][1]", "2"],
                ["$r[2][2]", "20"],
                // Past the end of an entry, or into a scalar entry, is a
                // blank, as a coordinate past an entry's dimensions was: an
                // entry's property has a value for every entry.
                ["$tl[2][3]", "＿"],
                ["$ml[2][1]", "＿"],
            ],
            lists,
        );
    });

    it("writes through an index into an entry as through its coordinate", async () => {
        const doenetML = `${lists}
<mathInput name="wtl" bindValueTo="$tl[1][2]"><label>wtl</label></mathInput>
<mathInput name="wscalar" bindValueTo="$ml[2][1]"><label>wscalar</label></mathInput>
<mathList name="lm"><math format="latex">\\begin{bmatrix}1 & 2\\\\3 & 4\\end{bmatrix}</math> 5</mathList>
<mathInput name="wrow" bindValueTo="$lm[1][2]"><label>wrow</label></mathInput>
<mathInput name="wrow1" bindValueTo="$lm[1][1]"><label>wrow1</label></mathInput>
<p name="ptl">$tl</p><p name="pml">$ml</p><p name="plm">$lm</p>`;
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        async function textOf(name: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return stateVariables[await resolvePathToNodeIdx(name)].stateValues
                .text;
        }

        await updateMathInputValue({
            latex: "9",
            componentIdx: await resolvePathToNodeIdx("wtl"),
            core,
        });
        expect(await textOf("ptl")).eq("(1, 9), (3, 4)");

        // A scalar entry reads a blank, but is written as coordinate 1, as a
        // coordinate past an entry's dimensions is (repeatPointLists).
        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolvePathToNodeIdx("wscalar"),
            core,
        });
        expect(await textOf("pml")).eq("[[1, 2], [3, 4]], 7");

        // A row of a matrix entry is not written through an index, whether
        // given as a tuple, a 1×n matrix or a scalar: it would otherwise be
        // written as a coordinate, replacing the matrix or making it a tuple.
        for (const [input, latex] of [
            ["wrow", "(7,8)"],
            ["wrow", "\\begin{bmatrix}7 & 8\\end{bmatrix}"],
            ["wrow1", "9"],
        ]) {
            await updateMathInputValue({
                latex,
                componentIdx: await resolvePathToNodeIdx(input),
                core,
            });
            expect(await textOf("plm"), latex).eq("[[1, 2], [3, 4]], 5");
        }
        expect(await textOf("wrow")).eq("[[3, 4]]");
        expect(await textOf("wrow1")).eq("[[1, 2]]");
    });

    it("reports an index into an entry as on a component (#2413)", async () => {
        for (const [reference, code] of [
            ["$pl[2].coords[1]", "doenet-w0100"],
            // the value of an entry with no entries, as `$n.value[1]`
            ["$nl[1].value[1]", "doenet-w0100"],
            ["$pl[1].xs[0]", "doenet-w0104"],
            ["$l[1][0]", "doenet-w0104"],
        ]) {
            const { text, warnings, errors, infos } = await shownAndReported(
                reference,
                lists,
            );
            expect(text, reference).eq("[]");
            expect([...errors, ...infos], reference).eqls([]);
            expect(
                warnings.map((w) => w.code),
                reference,
            ).eqls([code]);
            expect(warnings[0].args, reference).eqls({ reference });
        }
    });
});
