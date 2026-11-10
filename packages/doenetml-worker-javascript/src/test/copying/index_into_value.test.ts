import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import {
    movePoint,
    updateMathInputValue,
    updateMatrixInputValue,
    updateTextInputValue,
} from "../utils/actions";

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
 * - An index after an entry indexes the entry the same way, while it has
 *   entries: `$m[1][2]` of `<math>((1,2),(3,4))</math>` is `2` (#2438).
 * - A scalar has no entries: `$m[1]` of `<math>5</math>` names nothing and is
 *   reported (`doenet-w0100`), as `$n[1]` and `$t[1]` are. So does an index
 *   past the dimensions of any value: `$P[1][1]`, `$M[1][2][3]` (#2438).
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
            ["$P[3]", "＿"],
            ["$mt[3]", "＿"],
            ["$M[3]", "＿"],
            ["$M[1][3]", "＿"],
            ["$mi[3]", "＿"],
            ["$x[3]", "＿"],
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
            expect(text, reference).eq("[＿]");
            expect([...errors, ...infos], reference).eqls([]);
            expect(
                warnings.map((w) => w.code),
                reference,
            ).eqls(["doenet-w0100"]);
            expect(warnings[0].args, reference).eqls({ reference });
        }
    });

    it("names nothing past a value's dimensions, reported the same way for every type (#2438)", async () => {
        // An extra index used to be dropped by a point, vector, matrix and
        // `<matrixInput>`, which index through an array of their own
        for (const reference of [
            "$P[1][1]",
            "$P.xs[1][1]",
            "$v[1][1]",
            "$v.displacement[1][1]",
            "$M[1][2][3]",
            "$M.matrix[1][2][3]",
            "$mi[1][2][3]",
            "$c[2][1]",
            "$mm[1][2][1]",
            "$mm[1][2][3]",
        ]) {
            const { text, warnings, errors, infos } =
                await shownAndReported(reference);
            expect(text, reference).eq("[＿]");
            expect([...errors, ...infos], reference).eqls([]);
            expect(
                warnings.map((w) => w.code),
                reference,
            ).eqls(["doenet-w0100"]);
            expect(warnings[0].args, reference).eqls({ reference });
        }

        // and so does an index past the dimensions of an array property of
        // another component, which also dropped it
        const arrays = `<setup>
<polygon name="poly" vertices="(1,2) (3,4) (5,1)"/>
<line name="line" through="(1,2) (3,4)"/>
<function name="f">x^3-x</function>
<spreadsheet name="ss"><cell>a</cell><cell>b</cell></spreadsheet>
</setup>`;
        for (const reference of [
            "$poly.vertices[1][2][1]",
            "$line.points[1][2][1]",
            "$f.maxima[1][2][1]",
            "$ss.cells[1][1][1]",
            // past the dimensions of an entry of an array, which are those
            // left after its name (#2478)
            "$poly.vertex1[2][1]",
            "$line.point1[2][1]",
            "$f.maximumLocations[1][1]",
            "$f.maximum1[2][1]",
            "$ss.row1[1][1]",
            "$line.pointX1_2[1]",
        ]) {
            const { text, warnings, errors, infos } = await shownAndReported(
                reference,
                arrays,
            );
            expect(text, reference).eq("[＿]");
            expect([...errors, ...infos], reference).eqls([]);
            expect(
                warnings.map((w) => w.code),
                reference,
            ).eqls(["doenet-w0100"]);
        }
        // while an index within them still selects
        await expectShownSilently(
            [
                ["$poly.vertex1[2]", "2"],
                ["$line.point1[2]", "2"],
                ["$f.maximum1[2]", "0.385"],
                ["$ss.row1[2]", "b"],
            ],
            arrays,
        );
    });

    it("writes nothing through an index past the dimensions of an entry of an array (#2478)", async () => {
        const doenetML = `<line name="line" through="(1,2) (3,4)"/>
<mathInput name="w" bindValueTo="$line.point1[2][1]"><label>w</label></mathInput>
<p name="pline">$line.point1</p>`;
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
        expect(await textOf("w")).eq("＿");
        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolvePathToNodeIdx("w"),
            core,
        });
        expect(await textOf("pline")).eq("(1, 2)");
    });

    it("indexes a value at every level that has entries (#2438)", async () => {
        const values = `<setup>
<math name="tt">((1,2),(3,4))</math>
<math name="ttt">(((1,2),(3,4)),5)</math>
<math name="tm" format="latex">(\\begin{bmatrix}1 & 2\\\\3 & 4\\end{bmatrix}, 5)</math>
</setup>`;
        await expectShownSilently(
            [
                ["$tt[1]", "(1, 2)"],
                ["$tt[1][2]", "2"],
                ["$tt[2][1]", "3"],
                ["$tt.value[2][1]", "3"],
                ["$ttt[1][2]", "(3, 4)"],
                ["$ttt[1][2][1]", "3"],
                // a matrix in a tuple: a row, then an entry of it
                ["$tm[1][2]", "[[3, 4]]"],
                ["$tm[1][2][1]", "3"],
                // past the end at any level is silent
                ["$tt[1][3]", "＿"],
                ["$ttt[1][3]", "＿"],
                ["$tm[1][3]", "＿"],
            ],
            values,
        );
        // an entry that is a scalar has no entries, at any level
        for (const reference of ["$tt[1][2][1]", "$ttt[2][1]", "$tm[2][1]"]) {
            const { text, warnings, errors, infos } = await shownAndReported(
                reference,
                values,
            );
            expect(text, reference).eq("[＿]");
            expect([...errors, ...infos], reference).eqls([]);
            expect(
                warnings.map((w) => w.code),
                reference,
            ).eqls(["doenet-w0100"]);
        }
    });

    it("indexes as deep as the value has entries, and a ragged value only along the paths named (#2438)", async () => {
        // Five levels, past any fixed number of dimensions
        await expectShownSilently(
            [
                ["$m5[1][1][1][1][2]", "2"],
                ["$m5[1][1][1][2]", "3"],
                ["$m5[1][1][1][1][3]", "＿"],
            ],
            `<math name="m5">(((((1,2),3),4),5),6)</math>`,
        );

        // One branch nested four deep in 100-entry tuples, scalars
        // elsewhere: only the paths a reference names are made, not one
        // for every combination of the widest entry at each level, which
        // ran the worker out of memory
        function nest(depth: number): string {
            const rest = Array.from({ length: 99 }, (_, i) => String(i + 2));
            return `(${[depth === 1 ? "1" : nest(depth - 1), ...rest].join(",")})`;
        }
        await expectShownSilently(
            [
                ["$r[1][1][1][1]", "1"],
                ["$r[1][1][1][100]", "100"],
                ["$r[100]", "100"],
            ],
            `<math name="r">${nest(4)}</math>`,
        );
    });

    it("writes through an index three levels deep, merging the writes of one update (#2438)", async () => {
        // The point's coordinates are two entries three levels deep, so one
        // move writes both: they are merged into one value of `t`
        const doenetML = `<math name="t">(((1,2),3),4)</math>
<graph><point name="P">($t[1][1][1], $t[1][1][2])</point></graph>
<mathInput name="w" bindValueTo="$t[1][1][2]"><label>w</label></mathInput>
<p name="pt">$t</p>`;
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

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 5,
            y: 6,
            core,
        });
        expect(await textOf("pt")).eq("(((5, 6), 3), 4)");

        await updateMathInputValue({
            latex: "8",
            componentIdx: await resolvePathToNodeIdx("w"),
            core,
        });
        expect(await textOf("pt")).eq("(((5, 8), 3), 4)");
    });

    it("writes through an index at a second level, and not through one that names nothing (#2438)", async () => {
        const doenetML = `<math name="tt">((1,2),(3,4))</math>
<point name="P">(3,4)</point>
<mathInput name="w12" bindValueTo="$tt[1][2]"><label>w12</label></mathInput>
<mathInput name="w13" bindValueTo="$tt[1][3]"><label>w13</label></mathInput>
<mathInput name="wP" bindValueTo="$P[1][1]"><label>wP</label></mathInput>
<p name="ptt">$tt</p><p name="pP">$P</p>`;
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
            componentIdx: await resolvePathToNodeIdx("w12"),
            core,
        });
        expect(await textOf("ptt")).eq("((1, 9), (3, 4))");

        // past the end, and past the dimensions of a point
        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolvePathToNodeIdx("w13"),
            core,
        });
        expect(await textOf("ptt")).eq("((1, 9), (3, 4))");
        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolvePathToNodeIdx("wP"),
            core,
        });
        expect(await textOf("pP")).eq("(3, 4)");
    });

    it("reports an index past a composite's items once, not again as an index into a scalar", async () => {
        // `$g[2]` is an index after a group, which names nothing (D27); it is
        // not tried on the `<math>5</math>` the group holds (#2166), so it is
        // not reported again as an index into a scalar.
        const { text, warnings, errors, infos } = await shownAndReported(
            "$g[2]",
            `<group name="g"><math>5</math></group>`,
        );
        expect(text).eq("[＿]");
        expect([...errors, ...infos]).eqls([]);
        expect(warnings.map((w) => w.code)).eqls(["doenet-w0188"]);
    });

    it("does not read the entries by a name of their own", async () => {
        // The entries are reached only by an index, as for any property
        // that is not public: a property the component does not have, which
        // is a warning (#2450).
        for (const reference of [
            "$mt.__valueEntries",
            "$mt.__valueEntry1",
            "$mm.__valueEntry2_1",
            "$mm.__valuePath_2_1_1",
        ]) {
            const { text, warnings, errors, infos } =
                await shownAndReported(reference);
            expect(text, reference).eq("[＿]");
            expect([...errors, ...infos], reference).eqls([]);
            expect(
                warnings.map((w) => w.code),
                reference,
            ).eqls(["doenet-w0104"]);
        }
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
            expect(text, reference).eq("[＿]");
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
            expect(text, reference).eq("[＿]");
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

        /**
         * The references reported now as indexing into a scalar. What is
         * reported follows the value, as a reload would decide it (B33).
         * Each is an info, as the value comes from an input (DIAG-2).
         */
        function reported() {
            const { warnings, errors, infos } = getDiagnosticsByType(core);
            expect([...errors, ...warnings]).eqls([]);
            return infos
                .filter((d) => d.code === "doenet-w0100")
                .map((d) => [d.code, d.args?.reference]);
        }

        expect(await shown()).eqls(["[2]", "[2]", "[＿]"]);
        // `$m[2][1]` into the scalar entry 2 of `(1,2)`
        expect(reported()).eqls([["doenet-w0100", "$m[2][1]"]]);

        // a scalar: the index names nothing
        await updateMathInputValue({ latex: "5", componentIdx: a, core });
        expect(await shown()).eqls(["[＿]", "[＿]", "[＿]"]);
        expect(reported().sort()).eqls(
            [
                ["doenet-w0100", "$m[2][1]"],
                ["doenet-w0100", "$m[2]"],
                ["doenet-w0100", "$a[2]"],
            ].sort(),
        );

        // a longer tuple
        await updateMathInputValue({
            latex: "(3,4,5)",
            componentIdx: a,
            core,
        });
        expect(await shown()).eqls(["[4]", "[4]", "[＿]"]);
        expect(reported()).eqls([["doenet-w0100", "$m[2][1]"]]);

        // a matrix: rows
        await updateMathInputValue({
            latex: "\\begin{bmatrix}1 & 2\\\\3 & 4\\end{bmatrix}",
            componentIdx: a,
            core,
        });
        expect(await shown()).eqls(["[[[3, 4]]]", "[[[3, 4]]]", "[3]"]);
        expect(reported()).eqls([]);
    });

    it("does not report an index into an input with nothing entered", async () => {
        await expectShownSilently(
            [["$e[1]", "＿"]],
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
<vectorList name="vl1">(1) (2)</vectorList>
<pointList name="pl1">(1) (2)</pointList>
<mathList name="tl">(1,2) (3,4)</mathList>
<mathList name="tl2">((1,2),(3,4)) 5</mathList>
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
                // a coordinate of a point or vector entry, also in one
                // dimension, where its value is a single number
                ["$vl1[2][1]", "2"],
                ["$vl1[2].value[1]", "2"],
                ["$pl1[1][1]", "1"],
                ["$tl[2][1]", "3"],
                // an index into an entry's value is an index into the entry
                ["$tl[2].value[1]", "3"],
                ["$ml[1][2]", "[[3, 4]]"],
                // a repeat that became a list of points (#2163)
                ["$r[2]", "(2, 20)"],
                ["$r[2][1]", "2"],
                ["$r[2][2]", "20"],
                // a property of every entry with an index into it
                ["$pl.xs[1]", "3, 1"],
                // an index into the list's value is an index into the list,
                // as `$m.value[2]` is `$m[2]`, also with more after it
                ["$l.value[2]", "2"],
                ["$pl.value[2]", "(1, 2)"],
                ["$tl.value[2][1]", "3"],
                ["$pl.value[2].x", "1"],
                ["$tl.value[2].value[1]", "3"],
                // past the end, as `$l[4]` is
                ["$l.value[4]", "＿"],
                ["$pl.value[3].x", "＿"],
                // further indices index on in the entry's value, as in a
                // `<math>` (#2438), also after `.value`
                ["$tl2[1].value[2][1]", "3"],
                ["$ml[1][1][2]", "2"],
                ["$ml[1][2][1]", "3"],
                ["$tl2[1][2]", "(3, 4)"],
                ["$tl2[1][2][1]", "3"],
                // Past the end of an entry names nothing, silently, as
                // `$P[3]` does
                ["$tl[2][3]", "＿"],
                ["$ml[1][3]", "＿"],
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
<mathInput name="wentry" bindValueTo="$lm[1][1][2]"><label>wentry</label></mathInput>
<mathInput name="wpast" bindValueTo="$tl[1][3]"><label>wpast</label></mathInput>
<mathInput name="wvalue" bindValueTo="$tl.value[2][1]"><label>wvalue</label></mathInput>
<mathInput name="wvalue2" bindValueTo="$tl2[1].value[2][1]"><label>wvalue2</label></mathInput>
<p name="ptl">$tl</p><p name="pml">$ml</p><p name="plm">$lm</p><p name="ptl2">$tl2</p>`;
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

        // An index into a scalar entry, or past the end of an entry, names
        // nothing, and takes no write (#2438): it no longer replaces the
        // entry or lengthens it.
        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolvePathToNodeIdx("wscalar"),
            core,
        });
        expect(await textOf("pml")).eq("[[1, 2], [3, 4]], 5");
        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolvePathToNodeIdx("wpast"),
            core,
        });
        expect(await textOf("ptl")).eq("(1, 9), (3, 4)");

        // A row of a matrix entry is written through an index as a row of a
        // `<matrix>` is, keeping its length: given as a tuple or as a 1×n
        // matrix, not as a scalar or a row of another length.
        for (const [input, latex, shown] of [
            ["wrow", "(7,8)", "[[1, 2], [7, 8]], 5"],
            [
                "wrow",
                "\\begin{bmatrix}5 & 6\\end{bmatrix}",
                "[[1, 2], [5, 6]], 5",
            ],
            ["wrow1", "9", "[[1, 2], [5, 6]], 5"],
            ["wrow1", "(1,2,3)", "[[1, 2], [5, 6]], 5"],
        ]) {
            await updateMathInputValue({
                latex,
                componentIdx: await resolvePathToNodeIdx(input),
                core,
            });
            expect(await textOf("plm"), latex).eq(shown);
        }
        expect(await textOf("wrow")).eq("[[5, 6]]");
        expect(await textOf("wrow1")).eq("[[1, 2]]");

        // and an entry of a row of a matrix entry is written
        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("wentry"),
            core,
        });
        expect(await textOf("plm")).eq("[[1, 0], [5, 6]], 5");

        // and through an index into the list's value, as through `$tl[2][1]`
        await updateMathInputValue({
            latex: "8",
            componentIdx: await resolvePathToNodeIdx("wvalue"),
            core,
        });
        expect(await textOf("ptl")).eq("(1, 9), (8, 4)");

        // and through an index into an entry's value, at a second level
        await updateMathInputValue({
            latex: "6",
            componentIdx: await resolvePathToNodeIdx("wvalue2"),
            core,
        });
        expect(await textOf("ptl2")).eq("((1, 2), (6, 4)), 5");
    });

    it("takes writes to one entry through a coordinate and through an index together", async () => {
        // A point whose coordinates are an entry's coordinate and an index
        // into the entry: moving it writes both to the entry in one update.
        for (const coordinates of [
            "$ml[1].x1, $ml[1][2]",
            "$ml[1][1], $ml[1].x2",
            "$ml[1][1], $ml[1][2]",
        ]) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `<mathList name="ml">(1,2) 3</mathList>
<graph><point name="Q">(${coordinates})</point></graph>
<p name="p">$ml</p>`,
            });
            await movePoint({
                componentIdx: await resolvePathToNodeIdx("Q"),
                x: 5,
                y: 6,
                core,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .text,
                coordinates,
            ).eq("(5, 6), 3");
        }
    });

    it("reports an index into an entry as on a component (#2413)", async () => {
        for (const [reference, code] of [
            ["$pl[2].coords[1]", "doenet-w0100"],
            // the value of an entry with no entries, as `$n.value[1]`
            ["$nl[1].value[1]", "doenet-w0100"],
            ["$pl[1].xs[0]", "doenet-w0104"],
            ["$l[1][0]", "doenet-w0104"],
            // an index into a scalar entry, as `$m[1]` of `<math>5</math>`
            // (#2438)
            ["$l[2][1]", "doenet-w0100"],
            ["$ml[2][1]", "doenet-w0100"],
            ["$tl[1][2][1]", "doenet-w0100"],
            // past the dimensions of a coordinate, as `$P[1][1]`
            ["$pl[1][1][1]", "doenet-w0100"],
            // an index into a property of every entry that is not an array,
            // as `$P.coords[1]`, rather than the property with the index
            // dropped
            ["$pl.coords[1]", "doenet-w0100"],
            // the same after `.value`, as with the bare index
            ["$pl[2].value[1][1]", "doenet-w0100"],
            ["$pl.value[2][1][1]", "doenet-w0100"],
            ["$tl2[1].value[2][0]", "doenet-w0104"],
            ["$pl.value[0].x", "doenet-w0104"],
        ]) {
            const { text, warnings, errors, infos } = await shownAndReported(
                reference,
                lists,
            );
            // `ml` holds a reference (`$M.value`) to a matrix written as
            // literals, which can't change, so it is a warning too (DIAG-2)
            expect(text, reference).eq("[＿]");
            expect([...errors, ...infos], reference).eqls([]);
            expect(
                warnings.map((w) => w.code),
                reference,
            ).eqls([code]);
            expect(warnings[0].args, reference).eqls({ reference });
        }
    });

    it("reports an index into a scalar entry of any list, and past the dimensions of an entry's property (#2478)", async () => {
        const scalarLists = `<setup>
<numberList name="nl">4 5 6</numberList>
<textList name="tl">a b c</textList>
<booleanList name="bl">true false</booleanList>
<pointList name="pl">(1,2) (3,4)</pointList>
</setup>`;
        // An entry of a `<numberList>` or `<textList>` is a scalar, as one
        // of a `<mathList>` holding `5` is (`$ml[2][1]` above), and `xs[1]`
        // of a point entry is a coordinate, with no entries, as `$P.xs[1][1]`
        for (const reference of [
            "$nl[2][1]",
            "$tl[2][1]",
            "$bl[1][1]",
            "$pl[2].xs[1][1]",
            "$pl[2].coords[1][1]",
        ]) {
            const { text, warnings, errors, infos } = await shownAndReported(
                reference,
                scalarLists,
            );
            expect(text, reference).eq("[＿]");
            expect([...errors, ...infos], reference).eqls([]);
            expect(
                warnings.map((w) => w.code),
                reference,
            ).eqls(["doenet-w0100"]);
            expect(warnings[0].args, reference).eqls({ reference });
        }
        await expectShownSilently(
            [
                ["$nl[2]", "5"],
                ["$tl[2]", "b"],
                ["$pl[2].xs[1]", "3"],
                // past the end of the list or of the entry is silent
                ["$nl[4]", "＿"],
                ["$pl[2].xs[3]", "＿"],
            ],
            scalarLists,
        );
    });

    it("reads an index into an entry's value given by a reference as one written out (#2478)", async () => {
        const before = `<setup>
<pointList name="pl">(1,2) (3,4)</pointList>
<mathList name="ml">(1,2) (3,4)</mathList>
<number name="one">1</number>
<number name="two">2</number>
</setup>`;
        await expectShownSilently(
            [
                ["$pl[2].value[$one]", "3"],
                ["$pl[2].value[1]", "3"],
                ["$pl[$two].value[$two]", "4"],
                ["$ml[2].value[$one]", "3"],
            ],
            before,
        );
    });

    it("writes nothing through an index into a scalar entry or past an entry property's dimensions (#2478)", async () => {
        const doenetML = `<numberList name="nl">4 5 6</numberList>
<textList name="tl">a b c</textList>
<pointList name="pl">(1,2) (3,4)</pointList>
<number name="one">1</number>
<mathInput name="wnl" bindValueTo="$nl[2][1]"><label>wnl</label></mathInput>
<textInput name="wtl" bindValueTo="$tl[2][1]"><label>wtl</label></textInput>
<mathInput name="wxs" bindValueTo="$pl[2].xs[1][1]"><label>wxs</label></mathInput>
<mathInput name="wvalue" bindValueTo="$pl[2].value[$one]"><label>wvalue</label></mathInput>
<p name="pnl">$nl</p><p name="ptl">$tl</p><p name="ppl">$pl</p>`;
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
            componentIdx: await resolvePathToNodeIdx("wnl"),
            core,
        });
        expect(await textOf("pnl")).eq("4, 5, 6");
        await updateTextInputValue({
            text: "z",
            componentIdx: await resolvePathToNodeIdx("wtl"),
            core,
        });
        expect(await textOf("ptl")).eq("a, b, c");
        await updateMathInputValue({
            latex: "9",
            componentIdx: await resolvePathToNodeIdx("wxs"),
            core,
        });
        expect(await textOf("ppl")).eq("(1, 2), (3, 4)");

        // and an index given by a reference writes what it names, as
        // `$pl[2].value[1]` does
        await updateMathInputValue({
            latex: "8",
            componentIdx: await resolvePathToNodeIdx("wvalue"),
            core,
        });
        expect(await textOf("ppl")).eq("(1, 2), (8, 4)");
    });
});

describe("An index into a pick that is a number or a text (#2478) @group4", async () => {
    it("names nothing, reported as an index into a scalar, for every selector and sampler", async () => {
        for (const selector of [
            `<selectFromSequence name="s" from="1" to="10"/>`,
            `<selectFromSequence name="s" type="letters" from="a" to="j"/>`,
            `<selectPrimeNumbers name="s" from="2" to="20"/>`,
            `<selectRandomNumbers name="s"/>`,
            `<sampleRandomNumbers name="s"/>`,
            `<samplePrimeNumbers name="s" from="2" to="20"/>`,
        ]) {
            const { text, warnings, errors, infos } = await shownAndReported(
                "$s[1][1]",
                selector,
            );
            expect(text, selector).eq("[＿]");
            expect([...errors, ...infos], selector).eqls([]);
            expect(
                warnings.map((w) => [w.code, w.args]),
                selector,
            ).eqls([["doenet-w0100", { reference: "$s[1][1]" }]]);

            // while the pick itself is shown
            const { text: pick } = await shownAndReported("$s[1]", selector);
            expect(pick, selector).not.eq("[＿]");
        }
    });

    it("writes nothing through an index into a pick", async () => {
        const doenetML = `<selectFromSequence name="s" from="1" to="10"/>
<mathInput name="w" bindValueTo="$s[1][1]"><label>w</label></mathInput>
<p name="ps">$s[1]</p>`;
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
        const picked = await textOf("ps");
        expect(await textOf("w")).eq("＿");
        await updateMathInputValue({
            latex: "17",
            componentIdx: await resolvePathToNodeIdx("w"),
            core,
        });
        expect(await textOf("ps")).eq(picked);
        expect(await textOf("w")).eq("＿");
    });
});
