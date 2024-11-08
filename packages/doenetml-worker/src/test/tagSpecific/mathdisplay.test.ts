import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    moveMath,
    movePoint,
    moveText,
    moveVector,
    updateBooleanInputValue,
    updateMathInputValue,
    updateMatrixInputValue,
    updateTextInputValue,
    updateValue,
} from "../utils/actions";
import { test_in_graph } from "../utils/in-graph";
import Core from "../../Core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

describe("Displayed math tag tests", async () => {
    it("inline and display", async () => {
        let core = await createTestCore({
            doenetML: `
    <m name="m">\\sin(x)</m>
    <me name="me">\\cos(x)</me>
    `,
        });

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m"].stateValues.renderMode).eq("inline");
        expect(stateVariables["/m"].stateValues.latex).eq("\\sin(x)");
        expect(stateVariables["/m"].stateValues.text).eq("sin(x)");
        expect(stateVariables["/me"].stateValues.renderMode).eq("display");
        expect(stateVariables["/me"].stateValues.latex).eq("\\cos(x)");
        expect(stateVariables["/me"].stateValues.text).eq("cos(x)");
    });

    it("numbered equations", async () => {
        let core = await createTestCore({
            doenetML: `
    <lorem generateParagraphs="2" />
    <men name="e1">\\sin(x)</men>
    <lorem generateParagraphs="2" />
    <men name="e2">\\cos(x)</men>
    <lorem generateParagraphs="2" />
    <men name="e3">\\tan(x)</men>
    <lorem generateParagraphs="2" />

    <p name="p1">We have equation <ref target="e1" name="re1" />, equation <ref target="e2" name="re2" />, and equation <ref target="e3" name="re3" />.</p>
    <p name="p2">From copying properties: $e1.equationTag{assignNames="te1"}, $e2.equationTag{assignNames="te2"}, and $e3.equationTag{assignNames="te3"}.</p>

    <lorem generateParagraphs="8" />

    `,
        });

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/e1"].stateValues.renderMode).eq("numbered");
        expect(stateVariables["/e1"].stateValues.equationTag).eq("1");
        expect(stateVariables["/e1"].stateValues.latex).eq("\\sin(x)");
        expect(stateVariables["/e1"].stateValues.text).eq("sin(x)");
        expect(stateVariables["/e2"].stateValues.renderMode).eq("numbered");
        expect(stateVariables["/e2"].stateValues.equationTag).eq("2");
        expect(stateVariables["/e2"].stateValues.latex).eq("\\cos(x)");
        expect(stateVariables["/e2"].stateValues.text).eq("cos(x)");
        expect(stateVariables["/e3"].stateValues.renderMode).eq("numbered");
        expect(stateVariables["/e3"].stateValues.equationTag).eq("3");
        expect(stateVariables["/e3"].stateValues.latex).eq("\\tan(x)");
        expect(stateVariables["/e3"].stateValues.text).eq("tan(x)");

        expect(stateVariables["/p1"].stateValues.text).eq(
            "We have equation (1), equation (2), and equation (3).",
        );

        expect(stateVariables["/re1"].stateValues.linkText).eq("(1)");
        expect(stateVariables["/re2"].stateValues.linkText).eq("(2)");
        expect(stateVariables["/re3"].stateValues.linkText).eq("(3)");

        expect(stateVariables["/p2"].stateValues.text).eq(
            "From copying properties: 1, 2, and 3.",
        );

        expect(stateVariables["/te1"].stateValues.value).eq("1");
        expect(stateVariables["/te2"].stateValues.value).eq("2");
        expect(stateVariables["/te3"].stateValues.value).eq("3");
    });

    it("dynamic numbered equations", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Number of equations 1: <mathInput prefill="2" name="m" /></p>
    <p>Number of equations 2: <mathInput prefill="1" name="n" /></p>
    
    <men name="x">x</men>
    <map assignNames="m1 m2 m3 m4 m5 m6">
      <template newNamespace><men name='eq'>$i m</men></template>
      <sources indexAlias="i"><sequence length="$m" /></sources>
    </map>
    <men name="y">y</men>
    <map assignNames="n1 n2 n3 n4 n5 n6">
      <template newNamespace><men name="eq">$i n</men></template>
      <sources indexAlias="i"><sequence length="$n" /></sources>
    </map>
    <men name="z">z</men>
    
    
    <p name="px">x: <text copySource="x.equationTag" name="etx" />, equation <ref target="x" name="rx" /></p>
    <p name="pm1">m1: <text copySource="m1/eq.equationTag" name="etm1" />, equation <ref target="m1/eq" name="rm1" /></p>
    <p name="pm2">m2: <text copySource="m2/eq.equationTag" name="etm2" />, equation <ref target="m2/eq" name="rm2" /></p>
    <p name="pm3">m3: <text copySource="m3/eq.equationTag" name="etm3" />, equation <ref target="m3/eq" name="rm3" /></p>
    <p name="pm4">m4: <text copySource="m4/eq.equationTag" name="etm4" />, equation <ref target="m4/eq" name="rm4" /></p>
    <p name="pm5">m5: <text copySource="m5/eq.equationTag" name="etm5" />, equation <ref target="m5/eq" name="rm5" /></p>
    <p name="pm6">m6: <text copySource="m6/eq.equationTag" name="etm6" />, equation <ref target="m6/eq" name="rm6" /></p>
    <p name="py">y: <text copySource="y.equationTag" name="ety" />, equation <ref target="y" name="ry" /></p>
    <p name="pn1">n1: <text copySource="n1/eq.equationTag" name="etn1" />, equation <ref target="n1/eq" name="rn1" /></p>
    <p name="pn2">n2: <text copySource="n2/eq.equationTag" name="etn2" />, equation <ref target="n2/eq" name="rn2" /></p>
    <p name="pn3">n3: <text copySource="n3/eq.equationTag" name="etn3" />, equation <ref target="n3/eq" name="rn3" /></p>
    <p name="pn4">n4: <text copySource="n4/eq.equationTag" name="etn4" />, equation <ref target="n4/eq" name="rn4" /></p>
    <p name="pn5">n5: <text copySource="n5/eq.equationTag" name="etn5" />, equation <ref target="n5/eq" name="rn5" /></p>
    <p name="pn6">n6: <text copySource="n6/eq.equationTag" name="etn6" />, equation <ref target="n6/eq" name="rn6" /></p>
    <p name="pz">z: <text copySource="z.equationTag" name="etz" />, equation <ref target="z" name="rz" /></p>
    <lorem generateParagraphs="8" />
    `,
        });

        async function checkEquationNumbering(m: number, n: number) {
            let counter = 1;
            const stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/x"].stateValues.latex).eq("x");
            expect(stateVariables["/x"].stateValues.equationTag).eq(
                `${counter}`,
            );
            expect(stateVariables["/px"].stateValues.text).eq(
                `x: ${counter}, equation (${counter})`,
            );
            expect(stateVariables["/etx"].stateValues.text).eq(`${counter}`);
            expect(stateVariables["/rx"].stateValues.linkText).eq(
                `(${counter})`,
            );

            for (let i = 1; i <= m; i++) {
                counter++;

                expect(stateVariables[`/m${i}/eq`].stateValues.latex).eq(
                    `${i} m`,
                );
                expect(stateVariables[`/m${i}/eq`].stateValues.equationTag).eq(
                    `${counter}`,
                );

                if (i <= 6) {
                    expect(stateVariables[`/pm${i}`].stateValues.text).eq(
                        `m${i}: ${counter}, equation (${counter})`,
                    );
                    expect(stateVariables[`/etm${i}`].stateValues.text).eq(
                        `${counter}`,
                    );
                    expect(stateVariables[`/rm${i}`].stateValues.linkText).eq(
                        `(${counter})`,
                    );
                }
            }
            for (let i = m + 1; i <= 6; i++) {
                expect(stateVariables[`/pm${i}`].stateValues.text).eq(
                    `m${i}: , equation ???`,
                );
                expect(stateVariables[`/etm${i}`].stateValues.text).eq(``);
                expect(stateVariables[`/rm${i}`].stateValues.linkText).eq(
                    `???`,
                );
            }

            counter++;

            expect(stateVariables["/y"].stateValues.latex).eq("y");
            expect(stateVariables["/y"].stateValues.equationTag).eq(
                `${counter}`,
            );
            expect(stateVariables["/py"].stateValues.text).eq(
                `y: ${counter}, equation (${counter})`,
            );
            expect(stateVariables["/ety"].stateValues.text).eq(`${counter}`);
            expect(stateVariables["/ry"].stateValues.linkText).eq(
                `(${counter})`,
            );

            for (let i = 1; i <= n; i++) {
                counter++;

                expect(stateVariables[`/n${i}/eq`].stateValues.latex).eq(
                    `${i} n`,
                );
                expect(stateVariables[`/n${i}/eq`].stateValues.equationTag).eq(
                    `${counter}`,
                );

                if (i <= 6) {
                    expect(stateVariables[`/pn${i}`].stateValues.text).eq(
                        `n${i}: ${counter}, equation (${counter})`,
                    );
                    expect(stateVariables[`/etn${i}`].stateValues.text).eq(
                        `${counter}`,
                    );
                    expect(stateVariables[`/rn${i}`].stateValues.linkText).eq(
                        `(${counter})`,
                    );
                }
            }

            for (let i = n + 1; i <= 6; i++) {
                expect(stateVariables[`/pn${i}`].stateValues.text).eq(
                    `n${i}: , equation ???`,
                );
                expect(stateVariables[`/etn${i}`].stateValues.text).eq(``);
                expect(stateVariables[`/rn${i}`].stateValues.linkText).eq(
                    `???`,
                );
            }

            counter++;

            expect(stateVariables["/z"].stateValues.latex).eq("z");
            expect(stateVariables["/z"].stateValues.equationTag).eq(
                `${counter}`,
            );
            expect(stateVariables["/pz"].stateValues.text).eq(
                `z: ${counter}, equation (${counter})`,
            );
            expect(stateVariables["/etz"].stateValues.text).eq(`${counter}`);
            expect(stateVariables["/rz"].stateValues.linkText).eq(
                `(${counter})`,
            );
        }

        let m = 2,
            n = 1;
        await checkEquationNumbering(m, n);

        m = 4;
        await updateMathInputValue({ latex: m.toString(), name: "/m", core });
        await checkEquationNumbering(m, n);

        n = 2;
        await updateMathInputValue({ latex: n.toString(), name: "/n", core });
        await checkEquationNumbering(m, n);

        m = 0;
        await updateMathInputValue({ latex: m.toString(), name: "/m", core });
        await checkEquationNumbering(m, n);

        n = 6;
        await updateMathInputValue({ latex: n.toString(), name: "/n", core });
        await checkEquationNumbering(m, n);

        m = 3;
        await updateMathInputValue({ latex: m.toString(), name: "/m", core });
        await checkEquationNumbering(m, n);

        n = 1;
        await updateMathInputValue({ latex: n.toString(), name: "/n", core });
        await checkEquationNumbering(m, n);
    });

    it("math inside", async () => {
        let core = await createTestCore({
            doenetML: `
    <m name="m"><math simplify>x+x</math></m>
    <me name="me"><math simplify>y+y</math></me>
    <men name="men"><math simplify>z+z</math></men>
    `,
        });

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m"].stateValues.latex).eq("2 x");
        expect(stateVariables["/m"].stateValues.text).eq("2 x");
        expect(stateVariables["/me"].stateValues.latex).eq("2 y");
        expect(stateVariables["/me"].stateValues.text).eq("2 y");
        expect(stateVariables["/men"].stateValues.latex).eq("2 z");
        expect(stateVariables["/men"].stateValues.text).eq("2 z");
        expect(stateVariables["/men"].stateValues.equationTag).eq("1");
    });

    it("number inside", async () => {
        let core = await createTestCore({
            doenetML: `
    <m name="m1"><number>1</number></m>
    <me name="me1"><number>2+0i</number></me>
    <men name="men1"><number>3+4i</number></men>
    <m name="m2"><number>5+1i</number></m>
    <me name="me2"><number>6-1i</number></me>
    <men name="men2"><number>0-i</number></men>
    `,
        });

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m1"].stateValues.latex).eq("1");
        expect(stateVariables["/m1"].stateValues.text).eq("1");
        expect(stateVariables["/me1"].stateValues.latex).eq("2");
        expect(stateVariables["/me1"].stateValues.text).eq("2");
        expect(stateVariables["/men1"].stateValues.latex).eq("3 + 4 i");
        expect(stateVariables["/men1"].stateValues.text).eq("3 + 4 i");
        expect(stateVariables["/men1"].stateValues.equationTag).eq("1");
        expect(stateVariables["/m2"].stateValues.latex).eq("5 + i");
        expect(stateVariables["/m2"].stateValues.text).eq("5 + i");
        expect(stateVariables["/me2"].stateValues.latex).eq("6 - i");
        expect(stateVariables["/me2"].stateValues.text).eq("6 - i");
        expect(stateVariables["/men2"].stateValues.latex).eq("-i");
        expect(stateVariables["/men2"].stateValues.text).eq("-i");
        expect(stateVariables["/men2"].stateValues.equationTag).eq("2");
    });

    it("align equations", async () => {
        let core = await createTestCore({
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

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/md1"].stateValues.latex).eq(
            "\\notag q \\amp = \\sin(x)\\\\\\notag \\cos(x) \\amp = z",
        );
        expect(stateVariables["/md1"].stateValues.text).eq(
            "q = sin(x)\\\\\ncos(x) = z",
        );
        expect(stateVariables["/mdn1"].stateValues.latex).eq(
            "\\tag{1}q \\amp = \\sin(x)\\\\\\tag{2}\\cos(x) \\amp = z",
        );
        expect(stateVariables["/mdn1"].stateValues.text).eq(
            "q = sin(x) (1)\\\\\ncos(x) = z (2)",
        );

        expect(stateVariables["/md2"].stateValues.latex).eq(
            "\\tag{3}q \\amp = \\sin(x)\\\\\\tag{4}\\cos(x) \\amp = z",
        );
        expect(stateVariables["/md2"].stateValues.text).eq(
            "q = sin(x) (3)\\\\\ncos(x) = z (4)",
        );
        expect(stateVariables["/mdn2"].stateValues.latex).eq(
            "\\notag q \\amp = \\sin(x)\\\\\\notag \\cos(x) \\amp = z",
        );
        expect(stateVariables["/mdn2"].stateValues.text).eq(
            "q = sin(x)\\\\\ncos(x) = z",
        );
    });

    it("dynamic numbered aligned equations", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Number of equations 1: <mathInput prefill="2" name="m" /></p>
    <p>Number of equations 2: <mathInput prefill="1" name="n" /></p>
    
    <men name="x">x</men>
    <mdn name="ms">
      <map assignNames="m1 m2 m3 m4 m5 m6">
        <template newNamespace><mrow name='eq'>$i m &amp;= $v</mrow></template>
        <sources indexAlias="i" alias="v"><sequence length="$m" from="11" /></sources>
      </map>
    </mdn>
    <men name="y">y</men>
    <mdn name="ns">
      <map assignNames="n1 n2 n3 n4 n5 n6">
        <template newNamespace><mrow name="eq">$i n &= $v</mrow></template>
        <sources indexAlias="i" alias="v"><sequence length="$n" from="11" /></sources>
      </map>
    </mdn>
    <men name="z">z</men>
    
    <p name="px">x: <text copySource="x.equationTag" name="etx" />, equation <ref target="x" name="rx" /></p>
    <p name="pm1">m1: <text copySource="m1/eq.equationTag" name="etm1" />, equation <ref target="m1/eq" name="rm1" /></p>
    <p name="pm2">m2: <text copySource="m2/eq.equationTag" name="etm2" />, equation <ref target="m2/eq" name="rm2" /></p>
    <p name="pm3">m3: <text copySource="m3/eq.equationTag" name="etm3" />, equation <ref target="m3/eq" name="rm3" /></p>
    <p name="pm4">m4: <text copySource="m4/eq.equationTag" name="etm4" />, equation <ref target="m4/eq" name="rm4" /></p>
    <p name="pm5">m5: <text copySource="m5/eq.equationTag" name="etm5" />, equation <ref target="m5/eq" name="rm5" /></p>
    <p name="pm6">m6: <text copySource="m6/eq.equationTag" name="etm6" />, equation <ref target="m6/eq" name="rm6" /></p>
    <p name="py">y: <text copySource="y.equationTag" name="ety" />, equation <ref target="y" name="ry" /></p>
    <p name="pn1">n1: <text copySource="n1/eq.equationTag" name="etn1" />, equation <ref target="n1/eq" name="rn1" /></p>
    <p name="pn2">n2: <text copySource="n2/eq.equationTag" name="etn2" />, equation <ref target="n2/eq" name="rn2" /></p>
    <p name="pn3">n3: <text copySource="n3/eq.equationTag" name="etn3" />, equation <ref target="n3/eq" name="rn3" /></p>
    <p name="pn4">n4: <text copySource="n4/eq.equationTag" name="etn4" />, equation <ref target="n4/eq" name="rn4" /></p>
    <p name="pn5">n5: <text copySource="n5/eq.equationTag" name="etn5" />, equation <ref target="n5/eq" name="rn5" /></p>
    <p name="pn6">n6: <text copySource="n6/eq.equationTag" name="etn6" />, equation <ref target="n6/eq" name="rn6" /></p>
    <p name="pz">z: <text copySource="z.equationTag" name="etz" />, equation <ref target="z" name="rz" /></p>
    <lorem generateParagraphs="8" />
    `,
        });

        async function checkEquationNumbering(m: number, n: number) {
            let counter = 1;
            const stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/x"].stateValues.latex).eq("x");
            expect(stateVariables["/x"].stateValues.equationTag).eq(
                `${counter}`,
            );
            expect(stateVariables["/px"].stateValues.text).eq(
                `x: ${counter}, equation (${counter})`,
            );
            expect(stateVariables["/etx"].stateValues.text).eq(`${counter}`);
            expect(stateVariables["/rx"].stateValues.linkText).eq(
                `(${counter})`,
            );

            for (let i = 1; i <= m; i++) {
                counter++;

                expect(stateVariables[`/m${i}/eq`].stateValues.latex).eq(
                    `${i} m &= ${i + 10}`,
                );
                expect(stateVariables[`/m${i}/eq`].stateValues.equationTag).eq(
                    `${counter}`,
                );

                if (i <= 6) {
                    expect(stateVariables[`/pm${i}`].stateValues.text).eq(
                        `m${i}: ${counter}, equation (${counter})`,
                    );
                    expect(stateVariables[`/etm${i}`].stateValues.text).eq(
                        `${counter}`,
                    );
                    expect(stateVariables[`/rm${i}`].stateValues.linkText).eq(
                        `(${counter})`,
                    );
                }
            }
            for (let i = m + 1; i <= 6; i++) {
                expect(stateVariables[`/pm${i}`].stateValues.text).eq(
                    `m${i}: , equation ???`,
                );
                expect(stateVariables[`/etm${i}`].stateValues.text).eq(``);
                expect(stateVariables[`/rm${i}`].stateValues.linkText).eq(
                    `???`,
                );
            }

            counter++;

            expect(stateVariables["/y"].stateValues.latex).eq("y");
            expect(stateVariables["/y"].stateValues.equationTag).eq(
                `${counter}`,
            );
            expect(stateVariables["/py"].stateValues.text).eq(
                `y: ${counter}, equation (${counter})`,
            );
            expect(stateVariables["/ety"].stateValues.text).eq(`${counter}`);
            expect(stateVariables["/ry"].stateValues.linkText).eq(
                `(${counter})`,
            );

            for (let i = 1; i <= n; i++) {
                counter++;

                expect(stateVariables[`/n${i}/eq`].stateValues.latex).eq(
                    `${i} n &= ${i + 10}`,
                );
                expect(stateVariables[`/n${i}/eq`].stateValues.equationTag).eq(
                    `${counter}`,
                );

                if (i <= 6) {
                    expect(stateVariables[`/pn${i}`].stateValues.text).eq(
                        `n${i}: ${counter}, equation (${counter})`,
                    );
                    expect(stateVariables[`/etn${i}`].stateValues.text).eq(
                        `${counter}`,
                    );
                    expect(stateVariables[`/rn${i}`].stateValues.linkText).eq(
                        `(${counter})`,
                    );
                }
            }

            for (let i = n + 1; i <= 6; i++) {
                expect(stateVariables[`/pn${i}`].stateValues.text).eq(
                    `n${i}: , equation ???`,
                );
                expect(stateVariables[`/etn${i}`].stateValues.text).eq(``);
                expect(stateVariables[`/rn${i}`].stateValues.linkText).eq(
                    `???`,
                );
            }

            counter++;

            expect(stateVariables["/z"].stateValues.latex).eq("z");
            expect(stateVariables["/z"].stateValues.equationTag).eq(
                `${counter}`,
            );
            expect(stateVariables["/pz"].stateValues.text).eq(
                `z: ${counter}, equation (${counter})`,
            );
            expect(stateVariables["/etz"].stateValues.text).eq(`${counter}`);
            expect(stateVariables["/rz"].stateValues.linkText).eq(
                `(${counter})`,
            );
        }

        let m = 2,
            n = 1;
        await checkEquationNumbering(m, n);

        m = 4;
        await updateMathInputValue({ latex: m.toString(), name: "/m", core });
        await checkEquationNumbering(m, n);

        n = 2;
        await updateMathInputValue({ latex: n.toString(), name: "/n", core });
        await checkEquationNumbering(m, n);

        m = 0;
        await updateMathInputValue({ latex: m.toString(), name: "/m", core });
        await checkEquationNumbering(m, n);

        n = 6;
        await updateMathInputValue({ latex: n.toString(), name: "/n", core });
        await checkEquationNumbering(m, n);

        m = 3;
        await updateMathInputValue({ latex: m.toString(), name: "/m", core });
        await checkEquationNumbering(m, n);

        n = 1;
        await updateMathInputValue({ latex: n.toString(), name: "/n", core });
        await checkEquationNumbering(m, n);
    });

    it("dynamic numbered aligned equations, numbering swapped", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Number of equations 1: <mathInput prefill="2" name="m" /></p>
    <p>Number of equations 2: <mathInput prefill="1" name="n" /></p>
    
    <men name="x">x</men>
    <mdn name="ms">
      <map assignNames="m1 m2 m3 m4 m5 m6">
        <template newNamespace><mrow name='eq' number="mod($i,2)=1">$i m &amp;= $v</mrow></template>
        <sources indexAlias="i" alias="v"><sequence length="$m" from="11" /></sources>
      </map>
    </mdn>
    <men name="y">y</men>
    <mdn name="ns">
      <map assignNames="n1 n2 n3 n4 n5 n6">
        <template newNamespace><mrow name="eq" number="(-1)^$i = 1">$i n &= $v</mrow></template>
        <sources indexAlias="i" alias="v"><sequence length="$n" from="11" /></sources>
      </map>
    </mdn>
    <men name="z">z</men>
    
    <p name="px">x: <text copySource="x.equationTag" name="etx" />, equation <ref target="x" name="rx" /></p>
    <p name="pm1">m1: <text copySource="m1/eq.equationTag" name="etm1" />, equation <ref target="m1/eq" name="rm1" /></p>
    <p name="pm2">m2: <text copySource="m2/eq.equationTag" name="etm2" />, equation <ref target="m2/eq" name="rm2" /></p>
    <p name="pm3">m3: <text copySource="m3/eq.equationTag" name="etm3" />, equation <ref target="m3/eq" name="rm3" /></p>
    <p name="pm4">m4: <text copySource="m4/eq.equationTag" name="etm4" />, equation <ref target="m4/eq" name="rm4" /></p>
    <p name="pm5">m5: <text copySource="m5/eq.equationTag" name="etm5" />, equation <ref target="m5/eq" name="rm5" /></p>
    <p name="pm6">m6: <text copySource="m6/eq.equationTag" name="etm6" />, equation <ref target="m6/eq" name="rm6" /></p>
    <p name="py">y: <text copySource="y.equationTag" name="ety" />, equation <ref target="y" name="ry" /></p>
    <p name="pn1">n1: <text copySource="n1/eq.equationTag" name="etn1" />, equation <ref target="n1/eq" name="rn1" /></p>
    <p name="pn2">n2: <text copySource="n2/eq.equationTag" name="etn2" />, equation <ref target="n2/eq" name="rn2" /></p>
    <p name="pn3">n3: <text copySource="n3/eq.equationTag" name="etn3" />, equation <ref target="n3/eq" name="rn3" /></p>
    <p name="pn4">n4: <text copySource="n4/eq.equationTag" name="etn4" />, equation <ref target="n4/eq" name="rn4" /></p>
    <p name="pn5">n5: <text copySource="n5/eq.equationTag" name="etn5" />, equation <ref target="n5/eq" name="rn5" /></p>
    <p name="pn6">n6: <text copySource="n6/eq.equationTag" name="etn6" />, equation <ref target="n6/eq" name="rn6" /></p>
    <p name="pz">z: <text copySource="z.equationTag" name="etz" />, equation <ref target="z" name="rz" /></p>
    <lorem generateParagraphs="8" />
    `,
        });

        async function checkEquationNumbering(m: number, n: number) {
            let counter = 1;
            const stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/x"].stateValues.latex).eq("x");
            expect(stateVariables["/x"].stateValues.equationTag).eq(
                `${counter}`,
            );
            expect(stateVariables["/px"].stateValues.text).eq(
                `x: ${counter}, equation (${counter})`,
            );
            expect(stateVariables["/etx"].stateValues.text).eq(`${counter}`);
            expect(stateVariables["/rx"].stateValues.linkText).eq(
                `(${counter})`,
            );

            for (let i = 1; i <= m; i++) {
                if (i % 2 === 1) {
                    counter++;

                    expect(stateVariables[`/m${i}/eq`].stateValues.latex).eq(
                        `${i} m &= ${i + 10}`,
                    );
                    expect(
                        stateVariables[`/m${i}/eq`].stateValues.equationTag,
                    ).eq(`${counter}`);

                    if (i <= 6) {
                        expect(stateVariables[`/pm${i}`].stateValues.text).eq(
                            `m${i}: ${counter}, equation (${counter})`,
                        );
                        expect(stateVariables[`/etm${i}`].stateValues.text).eq(
                            `${counter}`,
                        );
                        expect(
                            stateVariables[`/rm${i}`].stateValues.linkText,
                        ).eq(`(${counter})`);
                    }
                } else {
                    expect(stateVariables[`/m${i}/eq`].stateValues.latex).eq(
                        `${i} m &= ${i + 10}`,
                    );

                    if (i <= 6) {
                        expect(stateVariables[`/pm${i}`].stateValues.text).eq(
                            `m${i}: , equation ???`,
                        );
                        expect(stateVariables[`/etm${i}`].stateValues.text).eq(
                            ``,
                        );
                        expect(
                            stateVariables[`/rm${i}`].stateValues.linkText,
                        ).eq(`???`);
                    }
                }
            }
            for (let i = m + 1; i <= 6; i++) {
                expect(stateVariables[`/pm${i}`].stateValues.text).eq(
                    `m${i}: , equation ???`,
                );
                expect(stateVariables[`/etm${i}`].stateValues.text).eq(``);
                expect(stateVariables[`/rm${i}`].stateValues.linkText).eq(
                    `???`,
                );
            }

            counter++;

            expect(stateVariables["/y"].stateValues.latex).eq("y");
            expect(stateVariables["/y"].stateValues.equationTag).eq(
                `${counter}`,
            );
            expect(stateVariables["/py"].stateValues.text).eq(
                `y: ${counter}, equation (${counter})`,
            );
            expect(stateVariables["/ety"].stateValues.text).eq(`${counter}`);
            expect(stateVariables["/ry"].stateValues.linkText).eq(
                `(${counter})`,
            );

            for (let i = 1; i <= n; i++) {
                if (i % 2 === 0) {
                    counter++;

                    expect(stateVariables[`/n${i}/eq`].stateValues.latex).eq(
                        `${i} n &= ${i + 10}`,
                    );
                    expect(
                        stateVariables[`/n${i}/eq`].stateValues.equationTag,
                    ).eq(`${counter}`);

                    if (i <= 6) {
                        expect(stateVariables[`/pn${i}`].stateValues.text).eq(
                            `n${i}: ${counter}, equation (${counter})`,
                        );
                        expect(stateVariables[`/etn${i}`].stateValues.text).eq(
                            `${counter}`,
                        );
                        expect(
                            stateVariables[`/rn${i}`].stateValues.linkText,
                        ).eq(`(${counter})`);
                    }
                } else {
                    expect(stateVariables[`/n${i}/eq`].stateValues.latex).eq(
                        `${i} n &= ${i + 10}`,
                    );

                    if (i <= 6) {
                        expect(stateVariables[`/pn${i}`].stateValues.text).eq(
                            `n${i}: , equation ???`,
                        );
                        expect(stateVariables[`/etn${i}`].stateValues.text).eq(
                            ``,
                        );
                        expect(
                            stateVariables[`/rn${i}`].stateValues.linkText,
                        ).eq(`???`);
                    }
                }
            }

            for (let i = n + 1; i <= 6; i++) {
                expect(stateVariables[`/pn${i}`].stateValues.text).eq(
                    `n${i}: , equation ???`,
                );
                expect(stateVariables[`/etn${i}`].stateValues.text).eq(``);
                expect(stateVariables[`/rn${i}`].stateValues.linkText).eq(
                    `???`,
                );
            }

            counter++;

            expect(stateVariables["/z"].stateValues.latex).eq("z");
            expect(stateVariables["/z"].stateValues.equationTag).eq(
                `${counter}`,
            );
            expect(stateVariables["/pz"].stateValues.text).eq(
                `z: ${counter}, equation (${counter})`,
            );
            expect(stateVariables["/etz"].stateValues.text).eq(`${counter}`);
            expect(stateVariables["/rz"].stateValues.linkText).eq(
                `(${counter})`,
            );
        }

        let m = 2,
            n = 1;
        await checkEquationNumbering(m, n);

        m = 4;
        await updateMathInputValue({ latex: m.toString(), name: "/m", core });
        await checkEquationNumbering(m, n);

        n = 2;
        await updateMathInputValue({ latex: n.toString(), name: "/n", core });
        await checkEquationNumbering(m, n);

        m = 0;
        await updateMathInputValue({ latex: m.toString(), name: "/m", core });
        await checkEquationNumbering(m, n);

        n = 6;
        await updateMathInputValue({ latex: n.toString(), name: "/n", core });
        await checkEquationNumbering(m, n);

        m = 3;
        await updateMathInputValue({ latex: m.toString(), name: "/m", core });
        await checkEquationNumbering(m, n);

        n = 1;
        await updateMathInputValue({ latex: n.toString(), name: "/n", core });
        await checkEquationNumbering(m, n);
    });

    it("separate with spaces when concatenate children", async () => {
        let core = await createTestCore({
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

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m"].stateValues.latex).eq("\\beta s");
        expect(stateVariables["/m"].stateValues.text).eq("β s");
        expect(stateVariables["/me"].stateValues.latex).eq("\\beta s");
        expect(stateVariables["/me"].stateValues.text).eq("β s");
        expect(stateVariables["/md"].stateValues.latex).eq("\\notag \\beta s");
        expect(stateVariables["/md"].stateValues.text).eq("β s");
    });

    it("add commas to large integers", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><intcomma>25236501.35</intcomma></p>
    <p name="p2"><intcomma><math>25236501.35</math></intcomma></p>
    <p name="p3"><m name="m1"><intcomma>25236501.35</intcomma></m></p>
    <p name="p4"><m name="m2"><intcomma><math>25236501.35</math></intcomma></m></p>
  `,
        });

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p1"].stateValues.text).eq("25,236,501.35");
        expect(stateVariables["/p2"].stateValues.text).eq("25,236,501.35");
        expect(stateVariables["/p3"].stateValues.text).eq("25, 236, 501.35");
        expect(stateVariables["/p4"].stateValues.text).eq("25, 236, 501.35");

        expect(stateVariables["/m1"].stateValues.latex).eq("25,236,501.35");
        expect(stateVariables["/m1"].stateValues.text).eq("25, 236, 501.35");
        expect(stateVariables["/m2"].stateValues.latex).eq("25,236,501.35");
        expect(stateVariables["/m2"].stateValues.text).eq("25, 236, 501.35");
    });

    it("lists inside displayed math", async () => {
        let core = await createTestCore({
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

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m1"].stateValues.latex).eq("s = 1, 2, 3");
        expect(stateVariables["/m1"].stateValues.text).eq("s = 1, 2, 3");
        expect(stateVariables["/m2"].stateValues.latex).eq("s = 1, 2, 3");
        expect(stateVariables["/m2"].stateValues.text).eq("s = 1, 2, 3");
        expect(stateVariables["/m3"].stateValues.latex).eq("s = 1 2 3");
        expect(stateVariables["/m3"].stateValues.text).eq("s = 1 * 2 * 3");
        expect(stateVariables["/m4"].stateValues.latex).eq("s = 1, 2, 3");
        expect(stateVariables["/m4"].stateValues.text).eq("s = 1, 2, 3");
        expect(stateVariables["/me1"].stateValues.latex).eq("s = 1, 2, 3");
        expect(stateVariables["/me1"].stateValues.text).eq("s = 1, 2, 3");
        expect(stateVariables["/me2"].stateValues.latex).eq("s = 1, 2, 3");
        expect(stateVariables["/me2"].stateValues.text).eq("s = 1, 2, 3");
        expect(stateVariables["/me3"].stateValues.latex).eq("s = 1 2 3");
        expect(stateVariables["/me3"].stateValues.text).eq("s = 1 * 2 * 3");
        expect(stateVariables["/md1"].stateValues.latex).eq(
            "\\notag s \\amp= 1, 2, 3",
        );
        expect(stateVariables["/md1"].stateValues.text).eq("s = 1, 2, 3");
        expect(stateVariables["/md2"].stateValues.latex).eq(
            "\\notag s \\amp= 1, 2, 3",
        );
        expect(stateVariables["/md2"].stateValues.text).eq("s = 1, 2, 3");
        expect(stateVariables["/md3"].stateValues.latex).eq(
            "\\notag s \\amp= 1 2 3",
        );
        expect(stateVariables["/md3"].stateValues.text).eq("s = 1 * 2 * 3");
    });

    it("change essential latex", async () => {
        let core = await createTestCore({
            doenetML: `
    <m name="m" />
    <p><updateValue name="uv" target="m.latex" type="text" newValue="\\frac{1}{2}" ><label>Change latex</label></updateValue></p>
  `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m"].stateValues.latex).eq("");

        await updateValue({ name: "/uv", core });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m"].stateValues.latex).eq("\\frac{1}{2}");
    });

    it("subscripts and superscripts numbers to unicode text", async () => {
        let core = await createTestCore({
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

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p1"].stateValues.text).eq(
            "2 x₁ y₂₃ + z₄₅₆ - a₇₊₈₋₉₀",
        );
        expect(stateVariables["/p2"].stateValues.text).eq(
            "2 x¹ y²³ + z⁴⁵⁶ - a⁷⁺⁸⁻⁹⁰",
        );
        expect(stateVariables["/p3"].stateValues.text).eq(
            "2 x₁ y₂₃ + z₄₅₆ - a₇₊₈₋₉₀",
        );
        expect(stateVariables["/p4"].stateValues.text).eq(
            "2 x¹ y²³ + z⁴⁵⁶ - a⁷⁺⁸⁻⁹⁰",
        );
        expect(stateVariables["/p5"].stateValues.text).eq(
            "2 x₁ y₂₃ + z₄₅₆ - a₇₊₈₋₉₀\\\\\n2 x¹ y²³ + z⁴⁵⁶ - a⁷⁺⁸⁻⁹⁰",
        );
        expect(stateVariables["/p6"].stateValues.text).eq(
            "2 x₁ y₂₃ + z₄₅₆ - a₇₊₈₋₉₀\\\\\n2 x¹ y²³ + z⁴⁵⁶ - a⁷⁺⁸⁻⁹⁰",
        );
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
        let core = await createTestCore({
            doenetML: `
            <graph >
              <m anchor="$anchorCoords1" name="math1">x^2</m>
            </graph>
            
        
            <p name="pAnchor1">Anchor 1 coordinates:  <point copySource="math1.anchor" name="math1anchor" /></p>
            <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathInput name="anchorCoords1" prefill="x" /></p>
            
        
            `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/math1anchor"].stateValues.latex)).eq(
            "x",
        );

        // give good anchor coords
        await updateMathInputValue({
            latex: "(6,7)",
            name: "/anchorCoords1",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/math1anchor"].stateValues.latex)).eq(
            "(6,7)",
        );

        // give bad anchor coords again
        await updateMathInputValue({
            latex: "q",
            name: "/anchorCoords1",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/math1anchor"].stateValues.latex)).eq(
            "q",
        );
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

    async function test_color_via_style(core: Core) {
        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/tsd_no_style"].stateValues.text).eq("black");
        expect(stateVariables["/tc_no_style"].stateValues.text).eq("black");
        expect(stateVariables["/bc_no_style"].stateValues.text).eq("none");

        expect(stateVariables["/tsd_fixed_style"].stateValues.text).eq("green");
        expect(stateVariables["/tc_fixed_style"].stateValues.text).eq("green");
        expect(stateVariables["/bc_fixed_style"].stateValues.text).eq("none");

        expect(stateVariables["/tsd_variable_style"].stateValues.text).eq(
            "black",
        );
        expect(stateVariables["/tc_variable_style"].stateValues.text).eq(
            "black",
        );
        expect(stateVariables["/bc_variable_style"].stateValues.text).eq(
            "none",
        );

        await updateMathInputValue({ latex: "2", name: "/sn", core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/tsd_variable_style"].stateValues.text).eq(
            "green",
        );
        expect(stateVariables["/tc_variable_style"].stateValues.text).eq(
            "green",
        );
        expect(stateVariables["/bc_variable_style"].stateValues.text).eq(
            "none",
        );

        expect(stateVariables["/tsd_no_style"].stateValues.text).eq("black");
        expect(stateVariables["/tc_no_style"].stateValues.text).eq("black");
        expect(stateVariables["/bc_no_style"].stateValues.text).eq("none");

        expect(stateVariables["/tsd_fixed_style"].stateValues.text).eq("green");
        expect(stateVariables["/tc_fixed_style"].stateValues.text).eq("green");
        expect(stateVariables["/bc_fixed_style"].stateValues.text).eq("none");

        await updateMathInputValue({ latex: "3", name: "/sn", core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/tsd_variable_style"].stateValues.text).eq(
            "red with a blue background",
        );
        expect(stateVariables["/tc_variable_style"].stateValues.text).eq("red");
        expect(stateVariables["/bc_variable_style"].stateValues.text).eq(
            "blue",
        );

        expect(stateVariables["/tsd_no_style"].stateValues.text).eq("black");
        expect(stateVariables["/tc_no_style"].stateValues.text).eq("black");
        expect(stateVariables["/bc_no_style"].stateValues.text).eq("none");

        expect(stateVariables["/tsd_fixed_style"].stateValues.text).eq("green");
        expect(stateVariables["/tc_fixed_style"].stateValues.text).eq("green");
        expect(stateVariables["/bc_fixed_style"].stateValues.text).eq("none");
    }
    it("color m via style", async () => {
        let core = await createTestCore({
            doenetML: `
            <setup>
              <styleDefinitions>
                <styleDefinition styleNumber="2" textColor="green" />
                <styleDefinition styleNumber="3" textColor="red" backgroundColor="blue" />
              </styleDefinitions>
            </setup>
        
            <p>Style number: <mathInput prefill="1" name="sn" /></p>
        
            <p><m name="no_style">x^2</m> is <text name="tsd_no_style">$no_style.textStyleDescription</text>, i.e., the text color is <text name="tc_no_style">$no_style.textColor</text> and the background color is <text name="bc_no_style">$no_style.backgroundColor</text>.</p>
            <p><m name="fixed_style" styleNumber="2">x^3</m> is <text name="tsd_fixed_style">$fixed_style.textStyleDescription</text>, i.e., the text color is <text name="tc_fixed_style">$fixed_style.textColor</text> and the background color is <text name="bc_fixed_style">$fixed_style.backgroundColor</text>.</p>
            <p><m name="variable_style" styleNumber="$sn">x^4</m> is <text name="tsd_variable_style">$variable_style.textStyleDescription</text>, i.e., the text color is <text name="tc_variable_style">$variable_style.textColor</text> and the background color is <text name="bc_variable_style">$variable_style.backgroundColor</text>.</p>
        
            <graph>
              $no_style{anchor="(1,2)"}
              $fixed_style{anchor="(3,4)"}
              $variable_style
            </graph>
        
            `,
        });

        await test_color_via_style(core);
    });

    it("color me via style", async () => {
        let core = await createTestCore({
            doenetML: `
            <setup>
              <styleDefinitions>
                <styleDefinition styleNumber="2" textColor="green" />
                <styleDefinition styleNumber="3" textColor="red" backgroundColor="blue" />
              </styleDefinitions>
            </setup>
        
            <p>Style number: <mathInput prefill="1" name="sn" /></p>
        
            <p><me name="no_style">x^2</me> is <text name="tsd_no_style">$no_style.textStyleDescription</text>, i.e., the text color is <text name="tc_no_style">$no_style.textColor</text> and the background color is <text name="bc_no_style">$no_style.backgroundColor</text>.</p>
            <p><me name="fixed_style" styleNumber="2">x^3</me> is <text name="tsd_fixed_style">$fixed_style.textStyleDescription</text>, i.e., the text color is <text name="tc_fixed_style">$fixed_style.textColor</text> and the background color is <text name="bc_fixed_style">$fixed_style.backgroundColor</text>.</p>
            <p><me name="variable_style" styleNumber="$sn">x^4</me> is <text name="tsd_variable_style">$variable_style.textStyleDescription</text>, i.e., the text color is <text name="tc_variable_style">$variable_style.textColor</text> and the background color is <text name="bc_variable_style">$variable_style.backgroundColor</text>.</p>
        
            <graph>
              $no_style{anchor="(1,2)"}
              $fixed_style{anchor="(3,4)"}
              $variable_style
            </graph>
        
            `,
        });

        await test_color_via_style(core);
    });

    it("color md via style", async () => {
        let core = await createTestCore({
            doenetML: `
            <setup>
              <styleDefinitions>
                <styleDefinition styleNumber="2" textColor="green" />
                <styleDefinition styleNumber="3" textColor="red" backgroundColor="blue" />
              </styleDefinitions>
            </setup>
        
            <p>Style number: <mathInput prefill="1" name="sn" /></p>
        
            <p><md name="no_style"><mrow>x^2</mrow><mrow>y^2</mrow></md> is <text name="tsd_no_style">$no_style.textStyleDescription</text>, i.e., the text color is <text name="tc_no_style">$no_style.textColor</text> and the background color is <text name="bc_no_style">$no_style.backgroundColor</text>.</p>
            <p><md name="fixed_style" styleNumber="2"><mrow>x^3</mrow><mrow>y^3</mrow></md> is <text name="tsd_fixed_style">$fixed_style.textStyleDescription</text>, i.e., the text color is <text name="tc_fixed_style">$fixed_style.textColor</text> and the background color is <text name="bc_fixed_style">$fixed_style.backgroundColor</text>.</p>
            <p><md name="variable_style" styleNumber="$sn"><mrow>x^4</mrow><mrow>y^4</mrow></md> is <text name="tsd_variable_style">$variable_style.textStyleDescription</text>, i.e., the text color is <text name="tc_variable_style">$variable_style.textColor</text> and the background color is <text name="bc_variable_style">$variable_style.backgroundColor</text>.</p>
        
            <graph>
              $no_style{anchor="(1,2)"}
              $fixed_style{anchor="(3,4)"}
              $variable_style
            </graph>
        
            `,
        });

        await test_color_via_style(core);
    });

    it.only("math copied by plain macro, but not value, reflects style and anchor position", async () => {
        let core = await createTestCore({
            doenetML: `
            <setup>
              <styleDefinitions>
                <styleDefinition styleNumber="2" textColor="green" />
                <styleDefinition styleNumber="3" textColor="red" />
              </styleDefinitions>
            </setup>
        
            <graph name="g1">
              <m styleNumber="2" name="m1">x^2</m>
              <m styleNumber="3" anchor="(3,4)" name="m2" >x^3</m>
            </graph>
        
            <coords copySource="m1.anchor" name="m1coords" />
            <coords copySource="m2.anchor" name="m2coords" />
        
            <graph name="g2">
              $m1{name="m1a"}
              $m2{name="m2a"}
            </graph>
        
            <collect componentTypes="m" source="g2" prop="anchor" assignNames="m1acoords m2acoords" />
        
            <graph name="g3">
              $m1.latex{assignNames="m1b"}
              $m2.latex{assignNames="m2b"}
            </graph>
        
            <collect componentTypes="text" source="g3" prop="anchor" assignNames="m1bcoords m2bcoords" />
        
            <p name="p1">$m1{name="m1c"} $m2{name="m2c"}</p>
        
            <p name="p2">$m1.latex{assignNames="m1d"} $m2.latex{assignNames="m2d"}</p>
        
            `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/m1"].stateValues.latex).eqls("x^2");
        expect(stateVariables["/m1a"].stateValues.latex).eqls("x^2");
        expect(stateVariables["/m1b"].stateValues.value).eqls("x^2");
        expect(stateVariables["/m1c"].stateValues.latex).eqls("x^2");
        expect(stateVariables["/m1d"].stateValues.value).eqls("x^2");
        expect(stateVariables["/m2"].stateValues.latex).eqls("x^3");
        expect(stateVariables["/m2a"].stateValues.latex).eqls("x^3");
        expect(stateVariables["/m2b"].stateValues.value).eqls("x^3");
        expect(stateVariables["/m2c"].stateValues.latex).eqls("x^3");
        expect(stateVariables["/m2d"].stateValues.value).eqls("x^3");

        expect(stateVariables["/m1"].stateValues.styleNumber).eq(2);
        expect(stateVariables["/m1a"].stateValues.styleNumber).eq(2);
        expect(stateVariables["/m1b"].stateValues.styleNumber).eq(1);
        expect(stateVariables["/m1c"].stateValues.styleNumber).eq(2);
        expect(stateVariables["/m1d"].stateValues.styleNumber).eq(1);
        expect(stateVariables["/m2"].stateValues.styleNumber).eq(3);
        expect(stateVariables["/m2a"].stateValues.styleNumber).eq(3);
        expect(stateVariables["/m2b"].stateValues.styleNumber).eq(1);
        expect(stateVariables["/m2c"].stateValues.styleNumber).eq(3);
        expect(stateVariables["/m2d"].stateValues.styleNumber).eq(1);

        expect(cleanLatex(stateVariables["/m1coords"].stateValues.latex)).eq(
            "(0,0)",
        );
        expect(cleanLatex(stateVariables["/m2coords"].stateValues.latex)).eq(
            "(3,4)",
        );
        expect(cleanLatex(stateVariables["/m1acoords"].stateValues.latex)).eq(
            "(0,0)",
        );
        expect(cleanLatex(stateVariables["/m2acoords"].stateValues.latex)).eq(
            "(3,4)",
        );
        expect(cleanLatex(stateVariables["/m1bcoords"].stateValues.latex)).eq(
            "(0,0)",
        );
        expect(cleanLatex(stateVariables["/m2bcoords"].stateValues.latex)).eq(
            "(0,0)",
        );

        // move first ms
        await moveMath({ name: "/m1", x: -2, y: 3, core });
        await moveMath({ name: "/m2", x: 4, y: -5, core });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/m1coords"].stateValues.latex)).eq(
            "(-2,3)",
        );
        expect(cleanLatex(stateVariables["/m2coords"].stateValues.latex)).eq(
            "(4,-5)",
        );
        expect(cleanLatex(stateVariables["/m1acoords"].stateValues.latex)).eq(
            "(-2,3)",
        );
        expect(cleanLatex(stateVariables["/m2acoords"].stateValues.latex)).eq(
            "(4,-5)",
        );
        expect(cleanLatex(stateVariables["/m1bcoords"].stateValues.latex)).eq(
            "(0,0)",
        );
        expect(cleanLatex(stateVariables["/m2bcoords"].stateValues.latex)).eq(
            "(0,0)",
        );

        // move second ms
        await moveMath({ name: "/m1a", x: 7, y: 1, core });
        await moveMath({ name: "/m2a", x: -8, y: 2, core });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/m1coords"].stateValues.latex)).eq(
            "(7,1)",
        );
        expect(cleanLatex(stateVariables["/m2coords"].stateValues.latex)).eq(
            "(-8,2)",
        );
        expect(cleanLatex(stateVariables["/m1acoords"].stateValues.latex)).eq(
            "(7,1)",
        );
        expect(cleanLatex(stateVariables["/m2acoords"].stateValues.latex)).eq(
            "(-8,2)",
        );
        expect(cleanLatex(stateVariables["/m1bcoords"].stateValues.latex)).eq(
            "(0,0)",
        );
        expect(cleanLatex(stateVariables["/m2bcoords"].stateValues.latex)).eq(
            "(0,0)",
        );

        // move third ms
        await moveText({ name: "/m1b", x: -6, y: 3, core });
        await moveText({ name: "/m2b", x: -5, y: -4, core });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/m1coords"].stateValues.latex)).eq(
            "(7,1)",
        );
        expect(cleanLatex(stateVariables["/m2coords"].stateValues.latex)).eq(
            "(-8,2)",
        );
        expect(cleanLatex(stateVariables["/m1acoords"].stateValues.latex)).eq(
            "(7,1)",
        );
        expect(cleanLatex(stateVariables["/m2acoords"].stateValues.latex)).eq(
            "(-8,2)",
        );
        expect(cleanLatex(stateVariables["/m1bcoords"].stateValues.latex)).eq(
            "(-6,3)",
        );
        expect(cleanLatex(stateVariables["/m2bcoords"].stateValues.latex)).eq(
            "(-5,-4)",
        );
    });
});
