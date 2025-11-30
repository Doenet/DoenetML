import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    moveMath,
    moveText,
    updateMathInputValue,
    updateValue,
} from "../utils/actions";
import { test_in_graph } from "../utils/in-graph";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Displayed math tag tests", async () => {
    it("inline and display", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <m name="m">\\sin(x)</m>
    <me name="me">\\cos(x)</me>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues
                .renderMode,
        ).eq("inline");
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.latex,
        ).eq("\\sin(x)");
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.text,
        ).eq("sin(x)");
        expect(
            stateVariables[await resolvePathToNodeIdx("me")].stateValues
                .renderMode,
        ).eq("display");
        expect(
            stateVariables[await resolvePathToNodeIdx("me")].stateValues.latex,
        ).eq("\\cos(x)");
        expect(
            stateVariables[await resolvePathToNodeIdx("me")].stateValues.text,
        ).eq("cos(x)");
    });

    it("numbered equations", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <lorem generateParagraphs="2" />
    <men name="e1">\\sin(x)</men>
    <lorem generateParagraphs="2" />
    <men name="e2">\\cos(x)</men>
    <lorem generateParagraphs="2" />
    <men name="e3">\\tan(x)</men>
    <lorem generateParagraphs="2" />

    <p name="p1">We have equation <ref to="$e1" name="re1" />, equation <ref to="$e2" name="re2" />, and equation <ref to="$e3" name="re3" />.</p>
    <p name="p2">From copying properties: <text extend="$e1.equationTag" name="te1" />, <text extend="$e2.equationTag" name="te2" />, and <text extend="$e3.equationTag" name="te3" />.</p>

    <lorem generateParagraphs="8" />

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("e1")].stateValues
                .renderMode,
        ).eq("numbered");
        expect(
            stateVariables[await resolvePathToNodeIdx("e1")].stateValues
                .equationTag,
        ).eq("1");
        expect(
            stateVariables[await resolvePathToNodeIdx("e1")].stateValues.latex,
        ).eq("\\sin(x)");
        expect(
            stateVariables[await resolvePathToNodeIdx("e1")].stateValues.text,
        ).eq("sin(x)");
        expect(
            stateVariables[await resolvePathToNodeIdx("e2")].stateValues
                .renderMode,
        ).eq("numbered");
        expect(
            stateVariables[await resolvePathToNodeIdx("e2")].stateValues
                .equationTag,
        ).eq("2");
        expect(
            stateVariables[await resolvePathToNodeIdx("e2")].stateValues.latex,
        ).eq("\\cos(x)");
        expect(
            stateVariables[await resolvePathToNodeIdx("e2")].stateValues.text,
        ).eq("cos(x)");
        expect(
            stateVariables[await resolvePathToNodeIdx("e3")].stateValues
                .renderMode,
        ).eq("numbered");
        expect(
            stateVariables[await resolvePathToNodeIdx("e3")].stateValues
                .equationTag,
        ).eq("3");
        expect(
            stateVariables[await resolvePathToNodeIdx("e3")].stateValues.latex,
        ).eq("\\tan(x)");
        expect(
            stateVariables[await resolvePathToNodeIdx("e3")].stateValues.text,
        ).eq("tan(x)");

        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("We have equation (1), equation (2), and equation (3).");

        expect(
            stateVariables[await resolvePathToNodeIdx("re1")].stateValues
                .linkText,
        ).eq("(1)");
        expect(
            stateVariables[await resolvePathToNodeIdx("re2")].stateValues
                .linkText,
        ).eq("(2)");
        expect(
            stateVariables[await resolvePathToNodeIdx("re3")].stateValues
                .linkText,
        ).eq("(3)");

        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("From copying properties: 1, 2, and 3.");

        expect(
            stateVariables[await resolvePathToNodeIdx("te1")].stateValues.value,
        ).eq("1");
        expect(
            stateVariables[await resolvePathToNodeIdx("te2")].stateValues.value,
        ).eq("2");
        expect(
            stateVariables[await resolvePathToNodeIdx("te3")].stateValues.value,
        ).eq("3");
    });

    it("dynamic numbered equations", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of equations 1: <mathInput prefill="2" name="m" /></p>
    <p>Number of equations 2: <mathInput prefill="1" name="n" /></p>
    
    <setup>
        <sequence name="s1" length="$m" />
        <sequence name="s2" length="$n" />
    </setup>

    <men name="x">x</men>
    <repeat for="$s1" indexName="i" valueName="v" name="rm">
      <men name='eq'>$i m</men>
    </repeat>
    <men name="y">y</men>
    <repeat for="$s2" indexName="i" valueName="v" name="rn">
      <men name="eq">$i n</men>
    </repeat>
    <men name="z">z</men>
    
    
    <p name="px">x: <text extend="$x.equationTag" name="etx" />, equation <ref to="$x" name="rx" /></p>
    <p name="pm1">m1: <text extend="$rm[1].eq.equationTag" name="etm1" />, equation <ref to="$rm[1].eq" name="rm1" /></p>
    <p name="pm2">m2: <text extend="$rm[2].eq.equationTag" name="etm2" />, equation <ref to="$rm[2].eq" name="rm2" /></p>
    <p name="pm3">m3: <text extend="$rm[3].eq.equationTag" name="etm3" />, equation <ref to="$rm[3].eq" name="rm3" /></p>
    <p name="pm4">m4: <text extend="$rm[4].eq.equationTag" name="etm4" />, equation <ref to="$rm[4].eq" name="rm4" /></p>
    <p name="pm5">m5: <text extend="$rm[5].eq.equationTag" name="etm5" />, equation <ref to="$rm[5].eq" name="rm5" /></p>
    <p name="pm6">m6: <text extend="$rm[6].eq.equationTag" name="etm6" />, equation <ref to="$rm[6].eq" name="rm6" /></p>
    <p name="py">y: <text extend="$y.equationTag" name="ety" />, equation <ref to="$y" name="ry" /></p>
    <p name="pn1">n1: <text extend="$rn[1].eq.equationTag" name="etn1" />, equation <ref to="$rn[1].eq" name="rn1" /></p>
    <p name="pn2">n2: <text extend="$rn[2].eq.equationTag" name="etn2" />, equation <ref to="$rn[2].eq" name="rn2" /></p>
    <p name="pn3">n3: <text extend="$rn[3].eq.equationTag" name="etn3" />, equation <ref to="$rn[3].eq" name="rn3" /></p>
    <p name="pn4">n4: <text extend="$rn[4].eq.equationTag" name="etn4" />, equation <ref to="$rn[4].eq" name="rn4" /></p>
    <p name="pn5">n5: <text extend="$rn[5].eq.equationTag" name="etn5" />, equation <ref to="$rn[5].eq" name="rn5" /></p>
    <p name="pn6">n6: <text extend="$rn[6].eq.equationTag" name="etn6" />, equation <ref to="$rn[6].eq" name="rn6" /></p>
    <p name="pz">z: <text extend="$z.equationTag" name="etz" />, equation <ref to="$z" name="rz" /></p>
    <lorem generateParagraphs="8" />
    `,
        });

        async function checkEquationNumbering(m: number, n: number) {
            let counter = 1;
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ).eq("x");
            expect(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .equationTag,
            ).eq(`${counter}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("px")].stateValues
                    .text,
            ).eq(`x: ${counter}, equation (${counter})`);
            expect(
                stateVariables[await resolvePathToNodeIdx("etx")].stateValues
                    .text,
            ).eq(`${counter}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("rx")].stateValues
                    .linkText,
            ).eq(`(${counter})`);

            for (let i = 1; i <= m; i++) {
                counter++;

                expect(
                    stateVariables[await resolvePathToNodeIdx(`rm[${i}].eq`)]
                        .stateValues.latex,
                ).eq(`${i} m`);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`rm[${i}].eq`)]
                        .stateValues.equationTag,
                ).eq(`${counter}`);

                if (i <= 6) {
                    expect(
                        stateVariables[await resolvePathToNodeIdx(`pm${i}`)]
                            .stateValues.text,
                    ).eq(`m${i}: ${counter}, equation (${counter})`);
                    expect(
                        stateVariables[await resolvePathToNodeIdx(`etm${i}`)]
                            .stateValues.text,
                    ).eq(`${counter}`);
                    expect(
                        stateVariables[await resolvePathToNodeIdx(`rm${i}`)]
                            .stateValues.linkText,
                    ).eq(`(${counter})`);
                }
            }
            for (let i = m + 1; i <= 6; i++) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(`pm${i}`)]
                        .stateValues.text,
                ).eq(`m${i}: , equation ???`);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`etm${i}`)]
                        .stateValues.text,
                ).eq(``);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`rm${i}`)]
                        .stateValues.linkText,
                ).eq(`???`);
            }

            counter++;

            expect(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ).eq("y");
            expect(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .equationTag,
            ).eq(`${counter}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("py")].stateValues
                    .text,
            ).eq(`y: ${counter}, equation (${counter})`);
            expect(
                stateVariables[await resolvePathToNodeIdx("ety")].stateValues
                    .text,
            ).eq(`${counter}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("ry")].stateValues
                    .linkText,
            ).eq(`(${counter})`);

            for (let i = 1; i <= n; i++) {
                counter++;

                expect(
                    stateVariables[await resolvePathToNodeIdx(`rn[${i}].eq`)]
                        .stateValues.latex,
                ).eq(`${i} n`);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`rn[${i}].eq`)]
                        .stateValues.equationTag,
                ).eq(`${counter}`);

                if (i <= 6) {
                    expect(
                        stateVariables[await resolvePathToNodeIdx(`pn${i}`)]
                            .stateValues.text,
                    ).eq(`n${i}: ${counter}, equation (${counter})`);
                    expect(
                        stateVariables[await resolvePathToNodeIdx(`etn${i}`)]
                            .stateValues.text,
                    ).eq(`${counter}`);
                    expect(
                        stateVariables[await resolvePathToNodeIdx(`rn${i}`)]
                            .stateValues.linkText,
                    ).eq(`(${counter})`);
                }
            }

            for (let i = n + 1; i <= 6; i++) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(`pn${i}`)]
                        .stateValues.text,
                ).eq(`n${i}: , equation ???`);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`etn${i}`)]
                        .stateValues.text,
                ).eq(``);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`rn${i}`)]
                        .stateValues.linkText,
                ).eq(`???`);
            }

            counter++;

            expect(
                stateVariables[await resolvePathToNodeIdx("z")].stateValues
                    .latex,
            ).eq("z");
            expect(
                stateVariables[await resolvePathToNodeIdx("z")].stateValues
                    .equationTag,
            ).eq(`${counter}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("pz")].stateValues
                    .text,
            ).eq(`z: ${counter}, equation (${counter})`);
            expect(
                stateVariables[await resolvePathToNodeIdx("etz")].stateValues
                    .text,
            ).eq(`${counter}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("rz")].stateValues
                    .linkText,
            ).eq(`(${counter})`);
        }

        let m = 2,
            n = 1;
        await checkEquationNumbering(m, n);

        m = 4;
        await updateMathInputValue({
            latex: m.toString(),
            componentIdx: await resolvePathToNodeIdx("m"),
            core,
        });
        await checkEquationNumbering(m, n);

        n = 2;
        await updateMathInputValue({
            latex: n.toString(),
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await checkEquationNumbering(m, n);

        m = 0;
        await updateMathInputValue({
            latex: m.toString(),
            componentIdx: await resolvePathToNodeIdx("m"),
            core,
        });
        await checkEquationNumbering(m, n);

        n = 6;
        await updateMathInputValue({
            latex: n.toString(),
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await checkEquationNumbering(m, n);

        m = 3;
        await updateMathInputValue({
            latex: m.toString(),
            componentIdx: await resolvePathToNodeIdx("m"),
            core,
        });
        await checkEquationNumbering(m, n);

        n = 1;
        await updateMathInputValue({
            latex: n.toString(),
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await checkEquationNumbering(m, n);
    });

    it("math inside", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <m name="m"><math simplify>x+x</math></m>
    <me name="me"><math simplify>y+y</math></me>
    <men name="men"><math simplify>z+z</math></men>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.latex,
        ).eq("2 x");
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.text,
        ).eq("2 x");
        expect(
            stateVariables[await resolvePathToNodeIdx("me")].stateValues.latex,
        ).eq("2 y");
        expect(
            stateVariables[await resolvePathToNodeIdx("me")].stateValues.text,
        ).eq("2 y");
        expect(
            stateVariables[await resolvePathToNodeIdx("men")].stateValues.latex,
        ).eq("2 z");
        expect(
            stateVariables[await resolvePathToNodeIdx("men")].stateValues.text,
        ).eq("2 z");
        expect(
            stateVariables[await resolvePathToNodeIdx("men")].stateValues
                .equationTag,
        ).eq("1");
    });

    it("number inside", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <m name="m1"><number>1</number></m>
    <me name="me1"><number>2+0i</number></me>
    <men name="men1"><number>3+4i</number></men>
    <m name="m2"><number>5+1i</number></m>
    <me name="me2"><number>6-1i</number></me>
    <men name="men2"><number>0-i</number></men>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.latex,
        ).eq("1");
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.text,
        ).eq("1");
        expect(
            stateVariables[await resolvePathToNodeIdx("me1")].stateValues.latex,
        ).eq("2");
        expect(
            stateVariables[await resolvePathToNodeIdx("me1")].stateValues.text,
        ).eq("2");
        expect(
            stateVariables[await resolvePathToNodeIdx("men1")].stateValues
                .latex,
        ).eq("3 + 4 i");
        expect(
            stateVariables[await resolvePathToNodeIdx("men1")].stateValues.text,
        ).eq("3 + 4 i");
        expect(
            stateVariables[await resolvePathToNodeIdx("men1")].stateValues
                .equationTag,
        ).eq("1");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.latex,
        ).eq("5 + i");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.text,
        ).eq("5 + i");
        expect(
            stateVariables[await resolvePathToNodeIdx("me2")].stateValues.latex,
        ).eq("6 - i");
        expect(
            stateVariables[await resolvePathToNodeIdx("me2")].stateValues.text,
        ).eq("6 - i");
        expect(
            stateVariables[await resolvePathToNodeIdx("men2")].stateValues
                .latex,
        ).eq("-i");
        expect(
            stateVariables[await resolvePathToNodeIdx("men2")].stateValues.text,
        ).eq("-i");
        expect(
            stateVariables[await resolvePathToNodeIdx("men2")].stateValues
                .equationTag,
        ).eq("2");
    });

    it("align equations", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <md name="md1">
      <mrow>q \\amp = \\sin(x)</mrow>
      <mrow>\\cos(x) \\amp = z</mrow>
    </md>
    <mdn name="mdn1">
      <mrow>q \\amp = \\sin(x)</mrow>
      <mrow>\\cos(x) \\amp = z</mrow>
    </mdn>
    <md name="md2">
      <mrow number="true">q \\amp = \\sin(x)</mrow>
      <mrow number="true">\\cos(x) \\amp = z</mrow>
    </md>
    <mdn name="mdn2">
      <mrow number="false">q \\amp = \\sin(x)</mrow>
      <mrow number="false">\\cos(x) \\amp = z</mrow>
    </mdn>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("md1")].stateValues.latex,
        ).eq("\\notag q \\amp = \\sin(x)\\\\\\notag \\cos(x) \\amp = z");
        expect(
            stateVariables[await resolvePathToNodeIdx("md1")].stateValues.text,
        ).eq("q = sin(x)\\\\\ncos(x) = z");
        expect(
            stateVariables[await resolvePathToNodeIdx("mdn1")].stateValues
                .latex,
        ).eq("\\tag{1}q \\amp = \\sin(x)\\\\\\tag{2}\\cos(x) \\amp = z");
        expect(
            stateVariables[await resolvePathToNodeIdx("mdn1")].stateValues.text,
        ).eq("q = sin(x) (1)\\\\\ncos(x) = z (2)");

        expect(
            stateVariables[await resolvePathToNodeIdx("md2")].stateValues.latex,
        ).eq("\\tag{3}q \\amp = \\sin(x)\\\\\\tag{4}\\cos(x) \\amp = z");
        expect(
            stateVariables[await resolvePathToNodeIdx("md2")].stateValues.text,
        ).eq("q = sin(x) (3)\\\\\ncos(x) = z (4)");
        expect(
            stateVariables[await resolvePathToNodeIdx("mdn2")].stateValues
                .latex,
        ).eq("\\notag q \\amp = \\sin(x)\\\\\\notag \\cos(x) \\amp = z");
        expect(
            stateVariables[await resolvePathToNodeIdx("mdn2")].stateValues.text,
        ).eq("q = sin(x)\\\\\ncos(x) = z");
    });

    it("dynamic numbered aligned equations", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of equations 1: <mathInput prefill="2" name="m" /></p>
    <p>Number of equations 2: <mathInput prefill="1" name="n" /></p>
    
    <setup>
        <sequence name="s1" length="$m" from="11" />
        <sequence name="s2" length="$n" from="11" />
    </setup>

    <men name="x">x</men>
    <mdn name="ms">
      <repeat for="$s1" indexName="i" valueName="v" name="rm">
        <mrow name='eq'>$i m &amp;= $v</mrow>
      </repeat>
    </mdn>
    <men name="y">y</men>
    <mdn name="ns">
      <repeat for="$s2" indexName="i" valueName="v" name="rn">
        <mrow name="eq">$i n &= $v</mrow>
      </repeat>
    </mdn>
    <men name="z">z</men>
    
    <p name="px">x: <text extend="$x.equationTag" name="etx" />, equation <ref to="$x" name="rx" /></p>
    <p name="pm1">m1: <text extend="$rm[1].eq.equationTag" name="etm1" />, equation <ref to="$rm[1].eq" name="rm1" /></p>
    <p name="pm2">m2: <text extend="$rm[2].eq.equationTag" name="etm2" />, equation <ref to="$rm[2].eq" name="rm2" /></p>
    <p name="pm3">m3: <text extend="$rm[3].eq.equationTag" name="etm3" />, equation <ref to="$rm[3].eq" name="rm3" /></p>
    <p name="pm4">m4: <text extend="$rm[4].eq.equationTag" name="etm4" />, equation <ref to="$rm[4].eq" name="rm4" /></p>
    <p name="pm5">m5: <text extend="$rm[5].eq.equationTag" name="etm5" />, equation <ref to="$rm[5].eq" name="rm5" /></p>
    <p name="pm6">m6: <text extend="$rm[6].eq.equationTag" name="etm6" />, equation <ref to="$rm[6].eq" name="rm6" /></p>
    <p name="py">y: <text extend="$y.equationTag" name="ety" />, equation <ref to="$y" name="ry" /></p>
    <p name="pn1">n1: <text extend="$rn[1].eq.equationTag" name="etn1" />, equation <ref to="$rn[1].eq" name="rn1" /></p>
    <p name="pn2">n2: <text extend="$rn[2].eq.equationTag" name="etn2" />, equation <ref to="$rn[2].eq" name="rn2" /></p>
    <p name="pn3">n3: <text extend="$rn[3].eq.equationTag" name="etn3" />, equation <ref to="$rn[3].eq" name="rn3" /></p>
    <p name="pn4">n4: <text extend="$rn[4].eq.equationTag" name="etn4" />, equation <ref to="$rn[4].eq" name="rn4" /></p>
    <p name="pn5">n5: <text extend="$rn[5].eq.equationTag" name="etn5" />, equation <ref to="$rn[5].eq" name="rn5" /></p>
    <p name="pn6">n6: <text extend="$rn[6].eq.equationTag" name="etn6" />, equation <ref to="$rn[6].eq" name="rn6" /></p>
    <p name="pz">z: <text extend="$z.equationTag" name="etz" />, equation <ref to="$z" name="rz" /></p>
    <lorem generateParagraphs="8" />
    `,
        });

        async function checkEquationNumbering(m: number, n: number) {
            let counter = 1;
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ).eq("x");
            expect(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .equationTag,
            ).eq(`${counter}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("px")].stateValues
                    .text,
            ).eq(`x: ${counter}, equation (${counter})`);
            expect(
                stateVariables[await resolvePathToNodeIdx("etx")].stateValues
                    .text,
            ).eq(`${counter}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("rx")].stateValues
                    .linkText,
            ).eq(`(${counter})`);

            for (let i = 1; i <= m; i++) {
                counter++;

                expect(
                    stateVariables[await resolvePathToNodeIdx(`rm[${i}].eq`)]
                        .stateValues.latex,
                ).eq(`${i} m & = ${i + 10}`);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`rm[${i}].eq`)]
                        .stateValues.equationTag,
                ).eq(`${counter}`);

                if (i <= 6) {
                    expect(
                        stateVariables[await resolvePathToNodeIdx(`pm${i}`)]
                            .stateValues.text,
                    ).eq(`m${i}: ${counter}, equation (${counter})`);
                    expect(
                        stateVariables[await resolvePathToNodeIdx(`etm${i}`)]
                            .stateValues.text,
                    ).eq(`${counter}`);
                    expect(
                        stateVariables[await resolvePathToNodeIdx(`rm${i}`)]
                            .stateValues.linkText,
                    ).eq(`(${counter})`);
                }
            }
            for (let i = m + 1; i <= 6; i++) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(`pm${i}`)]
                        .stateValues.text,
                ).eq(`m${i}: , equation ???`);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`etm${i}`)]
                        .stateValues.text,
                ).eq(``);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`rm${i}`)]
                        .stateValues.linkText,
                ).eq(`???`);
            }

            counter++;

            expect(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ).eq("y");
            expect(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .equationTag,
            ).eq(`${counter}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("py")].stateValues
                    .text,
            ).eq(`y: ${counter}, equation (${counter})`);
            expect(
                stateVariables[await resolvePathToNodeIdx("ety")].stateValues
                    .text,
            ).eq(`${counter}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("ry")].stateValues
                    .linkText,
            ).eq(`(${counter})`);

            for (let i = 1; i <= n; i++) {
                counter++;

                expect(
                    stateVariables[await resolvePathToNodeIdx(`rn[${i}].eq`)]
                        .stateValues.latex,
                ).eq(`${i} n & = ${i + 10}`);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`rn[${i}].eq`)]
                        .stateValues.equationTag,
                ).eq(`${counter}`);

                if (i <= 6) {
                    expect(
                        stateVariables[await resolvePathToNodeIdx(`pn${i}`)]
                            .stateValues.text,
                    ).eq(`n${i}: ${counter}, equation (${counter})`);
                    expect(
                        stateVariables[await resolvePathToNodeIdx(`etn${i}`)]
                            .stateValues.text,
                    ).eq(`${counter}`);
                    expect(
                        stateVariables[await resolvePathToNodeIdx(`rn${i}`)]
                            .stateValues.linkText,
                    ).eq(`(${counter})`);
                }
            }

            for (let i = n + 1; i <= 6; i++) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(`pn${i}`)]
                        .stateValues.text,
                ).eq(`n${i}: , equation ???`);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`etn${i}`)]
                        .stateValues.text,
                ).eq(``);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`rn${i}`)]
                        .stateValues.linkText,
                ).eq(`???`);
            }

            counter++;

            expect(
                stateVariables[await resolvePathToNodeIdx("z")].stateValues
                    .latex,
            ).eq("z");
            expect(
                stateVariables[await resolvePathToNodeIdx("z")].stateValues
                    .equationTag,
            ).eq(`${counter}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("pz")].stateValues
                    .text,
            ).eq(`z: ${counter}, equation (${counter})`);
            expect(
                stateVariables[await resolvePathToNodeIdx("etz")].stateValues
                    .text,
            ).eq(`${counter}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("rz")].stateValues
                    .linkText,
            ).eq(`(${counter})`);
        }

        let m = 2,
            n = 1;
        await checkEquationNumbering(m, n);

        m = 4;
        await updateMathInputValue({
            latex: m.toString(),
            componentIdx: await resolvePathToNodeIdx("m"),
            core,
        });
        await checkEquationNumbering(m, n);

        n = 2;
        await updateMathInputValue({
            latex: n.toString(),
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await checkEquationNumbering(m, n);

        m = 0;
        await updateMathInputValue({
            latex: m.toString(),
            componentIdx: await resolvePathToNodeIdx("m"),
            core,
        });
        await checkEquationNumbering(m, n);

        n = 6;
        await updateMathInputValue({
            latex: n.toString(),
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await checkEquationNumbering(m, n);

        m = 3;
        await updateMathInputValue({
            latex: m.toString(),
            componentIdx: await resolvePathToNodeIdx("m"),
            core,
        });
        await checkEquationNumbering(m, n);

        n = 1;
        await updateMathInputValue({
            latex: n.toString(),
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await checkEquationNumbering(m, n);
    });

    it("dynamic numbered aligned equations, numbering swapped", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of equations 1: <mathInput prefill="2" name="m" /></p>
    <p>Number of equations 2: <mathInput prefill="1" name="n" /></p>
    
    <setup>
        <sequence name="s1" length="$m" from="11" />
        <sequence name="s2" length="$n" from="11" />
    </setup>

    <men name="x">x</men>
    <mdn name="ms">
      <repeat for="$s1" indexName="i" valueName="v" name="rm">
        <mrow name='eq' number="mod($i,2)=1">$i m &amp;= $v</mrow>
      </repeat>
    </mdn>
    <men name="y">y</men>
    <mdn name="ns">
      <repeat for="$s2" indexName="i" valueName="v" name="rn">
        <mrow name="eq" number="(-1)^$i = 1">$i n &= $v</mrow>
      </repeat>
    </mdn>
    <men name="z">z</men>
    
    <p name="px">x: <text extend="$x.equationTag" name="etx" />, equation <ref to="$x" name="rx" /></p>
    <p name="pm1">m1: <text extend="$rm[1].eq.equationTag" name="etm1" />, equation <ref to="$rm[1].eq" name="rm1" /></p>
    <p name="pm2">m2: <text extend="$rm[2].eq.equationTag" name="etm2" />, equation <ref to="$rm[2].eq" name="rm2" /></p>
    <p name="pm3">m3: <text extend="$rm[3].eq.equationTag" name="etm3" />, equation <ref to="$rm[3].eq" name="rm3" /></p>
    <p name="pm4">m4: <text extend="$rm[4].eq.equationTag" name="etm4" />, equation <ref to="$rm[4].eq" name="rm4" /></p>
    <p name="pm5">m5: <text extend="$rm[5].eq.equationTag" name="etm5" />, equation <ref to="$rm[5].eq" name="rm5" /></p>
    <p name="pm6">m6: <text extend="$rm[6].eq.equationTag" name="etm6" />, equation <ref to="$rm[6].eq" name="rm6" /></p>
    <p name="py">y: <text extend="$y.equationTag" name="ety" />, equation <ref to="$y" name="ry" /></p>
    <p name="pn1">n1: <text extend="$rn[1].eq.equationTag" name="etn1" />, equation <ref to="$rn[1].eq" name="rn1" /></p>
    <p name="pn2">n2: <text extend="$rn[2].eq.equationTag" name="etn2" />, equation <ref to="$rn[2].eq" name="rn2" /></p>
    <p name="pn3">n3: <text extend="$rn[3].eq.equationTag" name="etn3" />, equation <ref to="$rn[3].eq" name="rn3" /></p>
    <p name="pn4">n4: <text extend="$rn[4].eq.equationTag" name="etn4" />, equation <ref to="$rn[4].eq" name="rn4" /></p>
    <p name="pn5">n5: <text extend="$rn[5].eq.equationTag" name="etn5" />, equation <ref to="$rn[5].eq" name="rn5" /></p>
    <p name="pn6">n6: <text extend="$rn[6].eq.equationTag" name="etn6" />, equation <ref to="$rn[6].eq" name="rn6" /></p>
    <p name="pz">z: <text extend="$z.equationTag" name="etz" />, equation <ref to="$z" name="rz" /></p>
    <lorem generateParagraphs="8" />
    `,
        });

        async function checkEquationNumbering(m: number, n: number) {
            let counter = 1;
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .latex,
            ).eq("x");
            expect(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .equationTag,
            ).eq(`${counter}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("px")].stateValues
                    .text,
            ).eq(`x: ${counter}, equation (${counter})`);
            expect(
                stateVariables[await resolvePathToNodeIdx("etx")].stateValues
                    .text,
            ).eq(`${counter}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("rx")].stateValues
                    .linkText,
            ).eq(`(${counter})`);

            for (let i = 1; i <= m; i++) {
                if (i % 2 === 1) {
                    counter++;

                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`rm[${i}].eq`)
                        ].stateValues.latex,
                    ).eq(`${i} m & = ${i + 10}`);
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`rm[${i}].eq`)
                        ].stateValues.equationTag,
                    ).eq(`${counter}`);

                    if (i <= 6) {
                        expect(
                            stateVariables[await resolvePathToNodeIdx(`pm${i}`)]
                                .stateValues.text,
                        ).eq(`m${i}: ${counter}, equation (${counter})`);
                        expect(
                            stateVariables[
                                await resolvePathToNodeIdx(`etm${i}`)
                            ].stateValues.text,
                        ).eq(`${counter}`);
                        expect(
                            stateVariables[await resolvePathToNodeIdx(`rm${i}`)]
                                .stateValues.linkText,
                        ).eq(`(${counter})`);
                    }
                } else {
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`rm[${i}].eq`)
                        ].stateValues.latex,
                    ).eq(`${i} m & = ${i + 10}`);

                    if (i <= 6) {
                        expect(
                            stateVariables[await resolvePathToNodeIdx(`pm${i}`)]
                                .stateValues.text,
                        ).eq(`m${i}: , equation ???`);
                        expect(
                            stateVariables[
                                await resolvePathToNodeIdx(`etm${i}`)
                            ].stateValues.text,
                        ).eq(``);
                        expect(
                            stateVariables[await resolvePathToNodeIdx(`rm${i}`)]
                                .stateValues.linkText,
                        ).eq(`???`);
                    }
                }
            }
            for (let i = m + 1; i <= 6; i++) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(`pm${i}`)]
                        .stateValues.text,
                ).eq(`m${i}: , equation ???`);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`etm${i}`)]
                        .stateValues.text,
                ).eq(``);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`rm${i}`)]
                        .stateValues.linkText,
                ).eq(`???`);
            }

            counter++;

            expect(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .latex,
            ).eq("y");
            expect(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .equationTag,
            ).eq(`${counter}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("py")].stateValues
                    .text,
            ).eq(`y: ${counter}, equation (${counter})`);
            expect(
                stateVariables[await resolvePathToNodeIdx("ety")].stateValues
                    .text,
            ).eq(`${counter}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("ry")].stateValues
                    .linkText,
            ).eq(`(${counter})`);

            for (let i = 1; i <= n; i++) {
                if (i % 2 === 0) {
                    counter++;

                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`rn[${i}].eq`)
                        ].stateValues.latex,
                    ).eq(`${i} n & = ${i + 10}`);
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`rn[${i}].eq`)
                        ].stateValues.equationTag,
                    ).eq(`${counter}`);

                    if (i <= 6) {
                        expect(
                            stateVariables[await resolvePathToNodeIdx(`pn${i}`)]
                                .stateValues.text,
                        ).eq(`n${i}: ${counter}, equation (${counter})`);
                        expect(
                            stateVariables[
                                await resolvePathToNodeIdx(`etn${i}`)
                            ].stateValues.text,
                        ).eq(`${counter}`);
                        expect(
                            stateVariables[await resolvePathToNodeIdx(`rn${i}`)]
                                .stateValues.linkText,
                        ).eq(`(${counter})`);
                    }
                } else {
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(`rn[${i}].eq`)
                        ].stateValues.latex,
                    ).eq(`${i} n & = ${i + 10}`);

                    if (i <= 6) {
                        expect(
                            stateVariables[await resolvePathToNodeIdx(`pn${i}`)]
                                .stateValues.text,
                        ).eq(`n${i}: , equation ???`);
                        expect(
                            stateVariables[
                                await resolvePathToNodeIdx(`etn${i}`)
                            ].stateValues.text,
                        ).eq(``);
                        expect(
                            stateVariables[await resolvePathToNodeIdx(`rn${i}`)]
                                .stateValues.linkText,
                        ).eq(`???`);
                    }
                }
            }

            for (let i = n + 1; i <= 6; i++) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(`pn${i}`)]
                        .stateValues.text,
                ).eq(`n${i}: , equation ???`);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`etn${i}`)]
                        .stateValues.text,
                ).eq(``);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`rn${i}`)]
                        .stateValues.linkText,
                ).eq(`???`);
            }

            counter++;

            expect(
                stateVariables[await resolvePathToNodeIdx("z")].stateValues
                    .latex,
            ).eq("z");
            expect(
                stateVariables[await resolvePathToNodeIdx("z")].stateValues
                    .equationTag,
            ).eq(`${counter}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("pz")].stateValues
                    .text,
            ).eq(`z: ${counter}, equation (${counter})`);
            expect(
                stateVariables[await resolvePathToNodeIdx("etz")].stateValues
                    .text,
            ).eq(`${counter}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("rz")].stateValues
                    .linkText,
            ).eq(`(${counter})`);
        }

        let m = 2,
            n = 1;
        await checkEquationNumbering(m, n);

        m = 4;
        await updateMathInputValue({
            latex: m.toString(),
            componentIdx: await resolvePathToNodeIdx("m"),
            core,
        });
        await checkEquationNumbering(m, n);

        n = 2;
        await updateMathInputValue({
            latex: n.toString(),
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await checkEquationNumbering(m, n);

        m = 0;
        await updateMathInputValue({
            latex: m.toString(),
            componentIdx: await resolvePathToNodeIdx("m"),
            core,
        });
        await checkEquationNumbering(m, n);

        n = 6;
        await updateMathInputValue({
            latex: n.toString(),
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await checkEquationNumbering(m, n);

        m = 3;
        await updateMathInputValue({
            latex: m.toString(),
            componentIdx: await resolvePathToNodeIdx("m"),
            core,
        });
        await checkEquationNumbering(m, n);

        n = 1;
        await updateMathInputValue({
            latex: n.toString(),
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await checkEquationNumbering(m, n);
    });

    it("separate with spaces when concatenate children", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="b">beta</math>
    <math name="s">s</math>
    <m name="m">$b$s</m>
    <me name="me">$b$s</me>
    <md name="md">
      <mrow>$b$s</mrow>
    </md>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.latex,
        ).eq("\\beta s");
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.text,
        ).eq("β s");
        expect(
            stateVariables[await resolvePathToNodeIdx("me")].stateValues.latex,
        ).eq("\\beta s");
        expect(
            stateVariables[await resolvePathToNodeIdx("me")].stateValues.text,
        ).eq("β s");
        expect(
            stateVariables[await resolvePathToNodeIdx("md")].stateValues.latex,
        ).eq("\\notag \\beta s");
        expect(
            stateVariables[await resolvePathToNodeIdx("md")].stateValues.text,
        ).eq("β s");
    });

    it("add commas to large integers", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><intComma>25236501.35</intComma></p>
    <p name="p2"><intComma><math>25236501.35</math></intComma></p>
    <p name="p3"><m name="m1"><intComma>25236501.35</intComma></m></p>
    <p name="p4"><m name="m2"><intComma><math>25236501.35</math></intComma></m></p>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("25,236,501.35");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("25,236,501.35");
        expect(
            stateVariables[await resolvePathToNodeIdx("p3")].stateValues.text,
        ).eq("25, 236, 501.35");
        expect(
            stateVariables[await resolvePathToNodeIdx("p4")].stateValues.text,
        ).eq("25, 236, 501.35");

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.latex,
        ).eq("25,236,501.35");
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.text,
        ).eq("25, 236, 501.35");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.latex,
        ).eq("25,236,501.35");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.text,
        ).eq("25, 236, 501.35");
    });

    it("lists inside displayed math", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <m name="m1">s = <asList name="al"><number>1</number><number>2</number><number>3</number></asList></m>
    <m name="m2">s = <sequence name="sl" from="1" to="3" /></m>
    <m name="m3">s = <sequence name="snl" asList="false" from="1" to="3" /></m>
    <m name="m4">s = $al</m>
    <me name="me1">s = $al</me>
    <me name="me2">s = $sl</me>
    <me name="me3">s = $snl</me>
    <md name="md1">
      <mrow>s \\amp= $al</mrow>
    </md>
    <md name="md2">
      <mrow>s \\amp= $sl</mrow>
    </md>
    <md name="md3">
      <mrow>s \\amp= $snl</mrow>
    </md>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.latex,
        ).eq("s = 1, 2, 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.text,
        ).eq("s = 1, 2, 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.latex,
        ).eq("s = 1, 2, 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.text,
        ).eq("s = 1, 2, 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.latex,
        ).eq("s = 1 2 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.text,
        ).eq("s = 1 * 2 * 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("m4")].stateValues.latex,
        ).eq("s = 1, 2, 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("m4")].stateValues.text,
        ).eq("s = 1, 2, 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("me1")].stateValues.latex,
        ).eq("s = 1, 2, 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("me1")].stateValues.text,
        ).eq("s = 1, 2, 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("me2")].stateValues.latex,
        ).eq("s = 1, 2, 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("me2")].stateValues.text,
        ).eq("s = 1, 2, 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("me3")].stateValues.latex,
        ).eq("s = 1 2 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("me3")].stateValues.text,
        ).eq("s = 1 * 2 * 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("md1")].stateValues.latex,
        ).eq("\\notag s \\amp= 1, 2, 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("md1")].stateValues.text,
        ).eq("s = 1, 2, 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("md2")].stateValues.latex,
        ).eq("\\notag s \\amp= 1, 2, 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("md2")].stateValues.text,
        ).eq("s = 1, 2, 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("md3")].stateValues.latex,
        ).eq("\\notag s \\amp= 1 2 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("md3")].stateValues.text,
        ).eq("s = 1 * 2 * 3");
    });

    it("change essential latex", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <m name="m" />
    <p><updateValue name="uv" target="$m.latex" type="text" newValue="\\frac{1}{2}" ><label>Change latex</label></updateValue></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.latex,
        ).eq("");

        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.latex,
        ).eq("\\frac{1}{2}");
    });

    it("subscripts and superscripts numbers to unicode text", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p name="p1"><m name="m1">2x_1y_{23}+z_{456}-a_{7+8-90}</m></p>
  <p name="p2"><m name="m2">2x^1y^{23}+z^{456}-a^{7+8-90}</m></p>
  <p name="p3">$m1.text</p>
  <p name="p4">$m2.text</p>



  <p name="p5"><md name="md">
    <mrow>2x_1y_{23}+z_{456}-a_{7+8-90}</mrow>
    <mrow>2x^1y^{23}+z^{456}-a^{7+8-90}</mrow>
    </md></p>
  <p name="p6">$md.text</p>


  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("2 x₁ y₂₃ + z₄₅₆ - a₇₊₈₋₉₀");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("2 x¹ y²³ + z⁴⁵⁶ - a⁷⁺⁸⁻⁹⁰");
        expect(
            stateVariables[await resolvePathToNodeIdx("p3")].stateValues.text,
        ).eq("2 x₁ y₂₃ + z₄₅₆ - a₇₊₈₋₉₀");
        expect(
            stateVariables[await resolvePathToNodeIdx("p4")].stateValues.text,
        ).eq("2 x¹ y²³ + z⁴⁵⁶ - a⁷⁺⁸⁻⁹⁰");
        expect(
            stateVariables[await resolvePathToNodeIdx("p5")].stateValues.text,
        ).eq("2 x₁ y₂₃ + z₄₅₆ - a₇₊₈₋₉₀\\\\\n2 x¹ y²³ + z⁴⁵⁶ - a⁷⁺⁸⁻⁹⁰");
        expect(
            stateVariables[await resolvePathToNodeIdx("p6")].stateValues.text,
        ).eq("2 x₁ y₂₃ + z₄₅₆ - a₇₊₈₋₉₀\\\\\n2 x¹ y²³ + z⁴⁵⁶ - a⁷⁺⁸⁻⁹⁰");
    });

    it("m in graph", async () => {
        const doenetMLsnippet = `
        <graph >
            <m anchor="$anchorCoords1" name="item1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1" fixed="$fixed1" fixLocation="$fixLocation1">\\frac{\\partial f}{\\partial x}</m>
            <m name="item2">\\int_a^b f(x) dx</m>
        </graph>
        `;

        await test_in_graph(doenetMLsnippet, moveMath);
    });

    it("m in graph, handle bad anchor coordinates", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
            <graph >
              <m anchor="$anchorCoords1" name="math1">x^2</m>
            </graph>
            
        
            <p name="pAnchor1">Anchor 1 coordinates:  <point extend="$math1.anchor" name="math1anchor" /></p>
            <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathInput name="anchorCoords1" prefill="x" /></p>
            
        
            `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("math1anchor")]
                    .stateValues.latex,
            ),
        ).eq("x");

        // give good anchor coords
        await updateMathInputValue({
            latex: "(6,7)",
            componentIdx: await resolvePathToNodeIdx("anchorCoords1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("math1anchor")]
                    .stateValues.latex,
            ),
        ).eq("(6,7)");

        // give bad anchor coords again
        await updateMathInputValue({
            latex: "q",
            componentIdx: await resolvePathToNodeIdx("anchorCoords1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("math1anchor")]
                    .stateValues.latex,
            ),
        ).eq("q");
    });

    it("me in graph", async () => {
        const doenetMLsnippet = `
        <graph >
            <me anchor="$anchorCoords1" name="item1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1" fixed="$fixed1" fixLocation="$fixLocation1">\\frac{\\partial f}{\\partial x}</me>
            <me name="item2">\\int_a^b f(x) dx</me>
        </graph>
        `;

        await test_in_graph(doenetMLsnippet, moveMath);
    });

    it("md in graph", async () => {
        const doenetMLsnippet = `
        <graph >
            <md anchor="$anchorCoords1" name="item1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1" fixed="$fixed1" fixLocation="$fixLocation1">
                <mrow>Q \\amp= \\frac{\\partial f}{\\partial x}</mrow>
                <mrow>R \\amp= \\frac{\\partial g}{\\partial y}</mrow>
            </md>
            <md name="item2">
                <mrow>F \\amp=\\int_a^b f(x) dx</mrow>
                <mrow>G \\amp=\\int_c^d g(y) dy</mrow>
            </md>
        </graph>
        `;

        await test_in_graph(doenetMLsnippet, moveMath);
    });

    async function test_color_via_style(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_no_style")]
                .stateValues.text,
        ).eq("black");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_no_style")]
                .stateValues.text,
        ).eq("black");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_no_style")]
                .stateValues.text,
        ).eq("none");

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_fixed_style")]
                .stateValues.text,
        ).eq("green");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_fixed_style")]
                .stateValues.text,
        ).eq("green");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_fixed_style")]
                .stateValues.text,
        ).eq("none");

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_variable_style")]
                .stateValues.text,
        ).eq("black");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_variable_style")]
                .stateValues.text,
        ).eq("black");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_variable_style")]
                .stateValues.text,
        ).eq("none");

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("sn"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_variable_style")]
                .stateValues.text,
        ).eq("green");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_variable_style")]
                .stateValues.text,
        ).eq("green");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_variable_style")]
                .stateValues.text,
        ).eq("none");

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_no_style")]
                .stateValues.text,
        ).eq("black");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_no_style")]
                .stateValues.text,
        ).eq("black");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_no_style")]
                .stateValues.text,
        ).eq("none");

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_fixed_style")]
                .stateValues.text,
        ).eq("green");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_fixed_style")]
                .stateValues.text,
        ).eq("green");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_fixed_style")]
                .stateValues.text,
        ).eq("none");

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("sn"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_variable_style")]
                .stateValues.text,
        ).eq("red with a blue background");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_variable_style")]
                .stateValues.text,
        ).eq("red");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_variable_style")]
                .stateValues.text,
        ).eq("blue");

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_no_style")]
                .stateValues.text,
        ).eq("black");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_no_style")]
                .stateValues.text,
        ).eq("black");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_no_style")]
                .stateValues.text,
        ).eq("none");

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_fixed_style")]
                .stateValues.text,
        ).eq("green");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_fixed_style")]
                .stateValues.text,
        ).eq("green");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_fixed_style")]
                .stateValues.text,
        ).eq("none");
    }
    it("color m via style", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
            <setup>
                <styleDefinition styleNumber="2" textColor="green" />
                <styleDefinition styleNumber="3" textColor="red" backgroundColor="blue" />
            </setup>
        
            <p>Style number: <mathInput prefill="1" name="sn" /></p>
        
            <p><m name="no_style">x^2</m> is <text name="tsd_no_style">$no_style.textStyleDescription</text>, i.e., the text color is <text name="tc_no_style">$no_style.textColor</text> and the background color is <text name="bc_no_style">$no_style.backgroundColor</text>.</p>
            <p><m name="fixed_style" styleNumber="2">x^3</m> is <text name="tsd_fixed_style">$fixed_style.textStyleDescription</text>, i.e., the text color is <text name="tc_fixed_style">$fixed_style.textColor</text> and the background color is <text name="bc_fixed_style">$fixed_style.backgroundColor</text>.</p>
            <p><m name="variable_style" styleNumber="$sn">x^4</m> is <text name="tsd_variable_style">$variable_style.textStyleDescription</text>, i.e., the text color is <text name="tc_variable_style">$variable_style.textColor</text> and the background color is <text name="bc_variable_style">$variable_style.backgroundColor</text>.</p>
        
            <graph>
              <m extend="$no_style" anchor="(1,2)" />
              <m extend="$fixed_style" anchor="(3,4)" />
              $variable_style
            </graph>
        
            `,
        });

        await test_color_via_style(core, resolvePathToNodeIdx);
    });

    it("color me via style", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
            <setup>
                <styleDefinition styleNumber="2" textColor="green" />
                <styleDefinition styleNumber="3" textColor="red" backgroundColor="blue" />
            </setup>
        
            <p>Style number: <mathInput prefill="1" name="sn" /></p>
        
            <p><me name="no_style">x^2</me> is <text name="tsd_no_style">$no_style.textStyleDescription</text>, i.e., the text color is <text name="tc_no_style">$no_style.textColor</text> and the background color is <text name="bc_no_style">$no_style.backgroundColor</text>.</p>
            <p><me name="fixed_style" styleNumber="2">x^3</me> is <text name="tsd_fixed_style">$fixed_style.textStyleDescription</text>, i.e., the text color is <text name="tc_fixed_style">$fixed_style.textColor</text> and the background color is <text name="bc_fixed_style">$fixed_style.backgroundColor</text>.</p>
            <p><me name="variable_style" styleNumber="$sn">x^4</me> is <text name="tsd_variable_style">$variable_style.textStyleDescription</text>, i.e., the text color is <text name="tc_variable_style">$variable_style.textColor</text> and the background color is <text name="bc_variable_style">$variable_style.backgroundColor</text>.</p>
        
            <graph>
              <me extend="$no_style" anchor="(1,2)" />
              <me extend="$fixed_style" anchor="(3,4)" />
              $variable_style
            </graph>
        
            `,
        });

        await test_color_via_style(core, resolvePathToNodeIdx);
    });

    it("color md via style", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
            <setup>
                <styleDefinition styleNumber="2" textColor="green" />
                <styleDefinition styleNumber="3" textColor="red" backgroundColor="blue" />
            </setup>
        
            <p>Style number: <mathInput prefill="1" name="sn" /></p>
        
            <p><md name="no_style"><mrow>x^2</mrow><mrow>y^2</mrow></md> is <text name="tsd_no_style">$no_style.textStyleDescription</text>, i.e., the text color is <text name="tc_no_style">$no_style.textColor</text> and the background color is <text name="bc_no_style">$no_style.backgroundColor</text>.</p>
            <p><md name="fixed_style" styleNumber="2"><mrow>x^3</mrow><mrow>y^3</mrow></md> is <text name="tsd_fixed_style">$fixed_style.textStyleDescription</text>, i.e., the text color is <text name="tc_fixed_style">$fixed_style.textColor</text> and the background color is <text name="bc_fixed_style">$fixed_style.backgroundColor</text>.</p>
            <p><md name="variable_style" styleNumber="$sn"><mrow>x^4</mrow><mrow>y^4</mrow></md> is <text name="tsd_variable_style">$variable_style.textStyleDescription</text>, i.e., the text color is <text name="tc_variable_style">$variable_style.textColor</text> and the background color is <text name="bc_variable_style">$variable_style.backgroundColor</text>.</p>
        
            <graph>
              <md extend="$no_style" anchor="(1,2)" />
              <md extend="$fixed_style" anchor="(3,4)" />
              $variable_style
            </graph>
        
            `,
        });

        await test_color_via_style(core, resolvePathToNodeIdx);
    });

    it("math copied by plain macro, but not value, reflects style and anchor position", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
            <setup>
                <styleDefinition styleNumber="2" textColor="green" />
                <styleDefinition styleNumber="3" textColor="red" />
            </setup>
        
            <graph name="g1">
              <m styleNumber="2" name="m1">x^2</m>
              <m styleNumber="3" anchor="(3,4)" name="m2" >x^3</m>
            </graph>
        
            <coords extend="$m1.anchor" name="m1coords" />
            <coords extend="$m2.anchor" name="m2coords" />
        
            <graph name="g2">
              <m extend="$m1" name="m1a" />
              <m extend="$m2" name="m2a" />
            </graph>
        

            <collect componentType="m" from="$g2" name="collect1" />
            <pointList extend="$collect1.anchor" name="macoords" />
        
            <graph name="g3">
              <text extend="$m1.latex" name="m1b" />
              <text extend="$m2.latex" name="m2b" />
            </graph>
        
            <collect componentType="text" from="$g3" name="collect2" />
            <pointList extend="$collect2.anchor" name="mbcoords" />
        
            <p name="p1"><m extend="$m1" name="m1c" /> <m extend="$m2" name="m2c" /></p>
        
            <p name="p2"><text extend="$m1.latex" name="m1d" /> <text extend="$m2.latex" name="m2d" /></p>
        
            `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.latex,
        ).eqls("x^2");
        expect(
            stateVariables[await resolvePathToNodeIdx("m1a")].stateValues.latex,
        ).eqls("x^2");
        expect(
            stateVariables[await resolvePathToNodeIdx("m1b")].stateValues.value,
        ).eqls("x^2");
        expect(
            stateVariables[await resolvePathToNodeIdx("m1c")].stateValues.latex,
        ).eqls("x^2");
        expect(
            stateVariables[await resolvePathToNodeIdx("m1d")].stateValues.value,
        ).eqls("x^2");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.latex,
        ).eqls("x^3");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2a")].stateValues.latex,
        ).eqls("x^3");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2b")].stateValues.value,
        ).eqls("x^3");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2c")].stateValues.latex,
        ).eqls("x^3");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2d")].stateValues.value,
        ).eqls("x^3");

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                .styleNumber,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1a")].stateValues
                .styleNumber,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1b")].stateValues
                .styleNumber,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1c")].stateValues
                .styleNumber,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1d")].stateValues
                .styleNumber,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                .styleNumber,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2a")].stateValues
                .styleNumber,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2b")].stateValues
                .styleNumber,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2c")].stateValues
                .styleNumber,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2d")].stateValues
                .styleNumber,
        ).eq(1);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1coords")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2coords")]
                    .stateValues.latex,
            ),
        ).eq("(3,4)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("macoords[1]")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("macoords[2]")]
                    .stateValues.latex,
            ),
        ).eq("(3,4)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mbcoords[1]")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mbcoords[2]")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");

        // move first ms
        await moveMath({
            componentIdx: await resolvePathToNodeIdx("m1"),
            x: -2,
            y: 3,
            core,
        });
        await moveMath({
            componentIdx: await resolvePathToNodeIdx("m2"),
            x: 4,
            y: -5,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1coords")]
                    .stateValues.latex,
            ),
        ).eq("(-2,3)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2coords")]
                    .stateValues.latex,
            ),
        ).eq("(4,-5)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("macoords[1]")]
                    .stateValues.latex,
            ),
        ).eq("(-2,3)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("macoords[2]")]
                    .stateValues.latex,
            ),
        ).eq("(4,-5)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mbcoords[1]")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mbcoords[2]")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");

        // move second ms
        await moveMath({
            componentIdx: await resolvePathToNodeIdx("m1a"),
            x: 7,
            y: 1,
            core,
        });
        await moveMath({
            componentIdx: await resolvePathToNodeIdx("m2a"),
            x: -8,
            y: 2,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1coords")]
                    .stateValues.latex,
            ),
        ).eq("(7,1)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2coords")]
                    .stateValues.latex,
            ),
        ).eq("(-8,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("macoords[1]")]
                    .stateValues.latex,
            ),
        ).eq("(7,1)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("macoords[2]")]
                    .stateValues.latex,
            ),
        ).eq("(-8,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mbcoords[1]")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mbcoords[2]")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");

        // move third ms
        await moveText({
            componentIdx: await resolvePathToNodeIdx("m1b"),
            x: -6,
            y: 3,
            core,
        });
        await moveText({
            componentIdx: await resolvePathToNodeIdx("m2b"),
            x: -5,
            y: -4,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1coords")]
                    .stateValues.latex,
            ),
        ).eq("(7,1)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2coords")]
                    .stateValues.latex,
            ),
        ).eq("(-8,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("macoords[1]")]
                    .stateValues.latex,
            ),
        ).eq("(7,1)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("macoords[2]")]
                    .stateValues.latex,
            ),
        ).eq("(-8,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mbcoords[1]")]
                    .stateValues.latex,
            ),
        ).eq("(-6,3)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("mbcoords[2]")]
                    .stateValues.latex,
            ),
        ).eq("(-5,-4)");
    });

    it("m adapts into math, text", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <m name="m">x^2+y</m>
        <math name="math">$m</math>
        <text name="text">$m</text>
            `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        const ast = ["+", ["^", "x", 2], "y"];
        const text = "x² + y";

        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.math
                .tree,
        ).eqls(ast);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.text,
        ).eqls(text);
        expect(
            stateVariables[await resolvePathToNodeIdx("math")].stateValues.value
                .tree,
        ).eqls(ast);
        expect(
            stateVariables[await resolvePathToNodeIdx("text")].stateValues
                .value,
        ).eqls(text);
    });

    it("can invert adapted math", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <m name="m">x^2+y</m>
        <mathInput name="mi">$m</mathInput>
            `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["+", ["^", "x", 2], "y"]);

        await updateMathInputValue({
            latex: "x^2y",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.value
                .tree,
        ).eqls(["*", ["^", "x", 2], "y"]);
    });
});
