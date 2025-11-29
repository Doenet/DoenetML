import { cesc } from "@doenet/utils";
import { toMathJaxString } from "../../../src/util/mathDisplay";

describe("Math Display Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("numbered equations", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
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
                },
                "*",
            );
        });

        cy.log("Test value displayed in browser");
        cy.get(cesc("#e1")).should("have.text", "sin⁡(𝑥)(1)");
        cy.get(cesc("#e2")).should("have.text", "cos⁡(𝑥)(2)");
        cy.get(cesc("#e3")).should("have.text", "tan⁡(𝑥)(3)");
        cy.get(cesc("#p1")).should(
            "have.text",
            "We have equation (1), equation (2), and equation (3).",
        );
        cy.get(cesc("#re1")).should("have.text", "(1)");
        cy.get(cesc("#re2")).should("have.text", "(2)");
        cy.get(cesc("#re3")).should("have.text", "(3)");

        cy.get(cesc("#p2")).should(
            "have.text",
            "From copying properties: 1, 2, and 3.",
        );
        cy.get(cesc("#te1")).should("have.text", "1");
        cy.get(cesc("#te2")).should("have.text", "2");
        cy.get(cesc("#te3")).should("have.text", "3");

        cy.get(cesc("#re1")).click();

        cy.get(cesc("#e1")).then((el) => {
            let rect = el[0].getBoundingClientRect();
            expect(rect.top).gt(-1).lt(5);
        });

        cy.get(cesc("#re2")).click();

        cy.get(cesc("#e2")).then((el) => {
            let rect = el[0].getBoundingClientRect();
            expect(rect.top).gt(-1).lt(5);
        });

        cy.get(cesc("#re3")).click();

        cy.get(cesc("#e3")).then((el) => {
            let rect = el[0].getBoundingClientRect();
            expect(rect.top).gt(-1).lt(5);
        });
    });

    it("dynamic numbered equations", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p>Number of equations 1: <mathInput prefill="2" name="m" /></p>
    <p>Number of equations 2: <mathInput prefill="1" name="n" /></p>
    
    <men name="x">x</men>
    <repeatForSequence name="rm" length="$m" indexName="i">
      <men name='eq'>$i m</men>
    </repeatForSequence>
    <men name="y">y</men>
    <repeatForSequence name="rn" length="$n" indexName="i">
      <men name="eq">$i n</men>
    </repeatForSequence>
    <men name="z">z</men>
    
    <p name="px">x: <text name="etx" extend="$x.equationTag" />, equation <ref to="$x" name="rx" /></p>
    <p name="pm1">m1: <text name="etm1" extend="$rm[1].eq.equationTag" />, equation <ref to="$rm[1].eq" name="rm1" /></p>
    <p name="pm2">m2: <text name="etm2" extend="$rm[2].eq.equationTag" />, equation <ref to="$rm[2].eq" name="rm2" /></p>
    <p name="pm3">m3: <text name="etm3" extend="$rm[3].eq.equationTag" />, equation <ref to="$rm[3].eq" name="rm3" /></p>
    <p name="pm4">m4: <text name="etm4" extend="$rm[4].eq.equationTag" />, equation <ref to="$rm[4].eq" name="rm4" /></p>
    <p name="pm5">m5: <text name="etm5" extend="$rm[5].eq.equationTag" />, equation <ref to="$rm[5].eq" name="rm5" /></p>
    <p name="pm6">m6: <text name="etm6" extend="$rm[6].eq.equationTag" />, equation <ref to="$rm[6].eq" name="rm6" /></p>
    <p name="py">y: <text name="ety" extend="$y.equationTag" />, equation <ref to="$y" name="ry" /></p>
    <p name="pn1">n1: <text name="etn1" extend="$rn[1].eq.equationTag" />, equation <ref to="$rn[1].eq" name="rn1" /></p>
    <p name="pn2">n2: <text name="etn2" extend="$rn[2].eq.equationTag" />, equation <ref to="$rn[2].eq" name="rn2" /></p>
    <p name="pn3">n3: <text name="etn3" extend="$rn[3].eq.equationTag" />, equation <ref to="$rn[3].eq" name="rn3" /></p>
    <p name="pn4">n4: <text name="etn4" extend="$rn[4].eq.equationTag" />, equation <ref to="$rn[4].eq" name="rn4" /></p>
    <p name="pn5">n5: <text name="etn5" extend="$rn[5].eq.equationTag" />, equation <ref to="$rn[5].eq" name="rn5" /></p>
    <p name="pn6">n6: <text name="etn6" extend="$rn[6].eq.equationTag" />, equation <ref to="$rn[6].eq" name="rn6" /></p>
    <p name="pz">z: <text name="etz" extend="$z.equationTag" />, equation <ref to="$z" name="rz" /></p>
    <p>
      <math extend="$m" name="ma" />
      <math extend="$n" name="na" />
    </p>
    <lorem generateParagraphs="8" />
    `,
                },
                "*",
            );
        });

        cy.log("Test value displayed in browser");

        function checkEquationNumbering(m, n) {
            let counter = 1;

            cy.get(cesc("#x")).should(
                "have.text",
                toMathJaxString(`x(${counter})`),
            );
            cy.get(cesc("#px")).should(
                "have.text",
                `x: ${counter}, equation (${counter})`,
            );
            cy.get(cesc("#etx")).should("have.text", `${counter}`);
            cy.get(cesc("#rx")).should("have.text", `(${counter})`);
            cy.get(cesc("#rx")).click();
            cy.get(cesc("#x")).then((el) => {
                let rect = el[0].getBoundingClientRect();
                expect(rect.top).gt(-1).lt(5);
            });

            for (let i = 1; i <= m; i++) {
                cy.window().then(async (win) => {
                    counter++;
                    cy.get(cesc(`#rm:${i}.eq`)).should(
                        "have.text",
                        toMathJaxString(`${i}m(${counter})`),
                    );
                    if (i <= 6) {
                        cy.get(cesc(`#pm${i}`)).should(
                            "have.text",
                            `m${i}: ${counter}, equation (${counter})`,
                        );
                        cy.get(cesc(`#etm${i}`)).should(
                            "have.text",
                            `${counter}`,
                        );
                        cy.get(cesc(`#rm${i}`)).should(
                            "have.text",
                            `(${counter})`,
                        );
                        cy.get(cesc(`#rm${i}`)).click();
                        cy.get(cesc(`#rm:${i}.eq`)).then((el) => {
                            let rect = el[0].getBoundingClientRect();
                            expect(rect.top).gt(-1).lt(5);
                        });
                    }
                });
            }
            for (let i = m + 1; i <= 6; i++) {
                cy.window().then(async (win) => {
                    cy.get(cesc(`#pm${i}`)).should(
                        "have.text",
                        `m${i}: , equation ???`,
                    );
                    cy.get(cesc(`#etm${i}`)).should("have.text", "");
                    cy.get(cesc(`#rm${i}`)).should("have.text", `???`);
                    // cy.get(cesc(`#rm${i}`)).click();
                    // cy.window().then(async (win) => {
                    //   expect(win.scrollY).eq(0);
                    // });
                });
            }

            cy.window().then(async (win) => {
                counter++;
                cy.get(cesc("#y")).should(
                    "have.text",
                    toMathJaxString(`y(${counter})`),
                );
                cy.get(cesc("#py")).should(
                    "have.text",
                    `y: ${counter}, equation (${counter})`,
                );
                cy.get(cesc("#ety")).should("have.text", `${counter}`);
                cy.get(cesc("#ry")).should("have.text", `(${counter})`);
                cy.get(cesc("#ry")).click();
                cy.get(cesc("#y")).then((el) => {
                    let rect = el[0].getBoundingClientRect();
                    expect(rect.top).gt(-1).lt(5);
                });
            });

            for (let i = 1; i <= n; i++) {
                cy.window().then(async (win) => {
                    counter++;
                    cy.get(cesc(`#rn:${i}.eq`)).should(
                        "have.text",
                        toMathJaxString(`${i}n(${counter})`),
                    );
                    if (i <= 6) {
                        cy.get(cesc(`#pn${i}`)).should(
                            "have.text",
                            `n${i}: ${counter}, equation (${counter})`,
                        );
                        cy.get(cesc(`#etn${i}`)).should(
                            "have.text",
                            `${counter}`,
                        );
                        cy.get(cesc(`#rn${i}`)).should(
                            "have.text",
                            `(${counter})`,
                        );
                        cy.get(cesc(`#rn${i}`)).click();
                        cy.get(cesc(`#rn:${i}.eq`)).then((el) => {
                            let rect = el[0].getBoundingClientRect();
                            expect(rect.top).gt(-1).lt(5);
                        });
                    }
                });
            }

            for (let i = n + 1; i <= 6; i++) {
                cy.window().then(async (win) => {
                    cy.get(cesc(`#pn${i}`)).should(
                        "have.text",
                        `n${i}: , equation ???`,
                    );
                    cy.get(cesc(`#etn${i}`)).should("have.text", "");
                    cy.get(cesc(`#rn${i}`)).should("have.text", `???`);
                    // cy.get(cesc(`#rn${i}`)).click();
                    // cy.window().then(async (win) => {
                    //   expect(win.scrollY).eq(0);
                    // });
                });
            }

            cy.window().then(async (win) => {
                counter++;
                cy.get(cesc("#z")).should(
                    "have.text",
                    toMathJaxString(`z(${counter})`),
                );
                cy.get(cesc("#pz")).should(
                    "have.text",
                    `z: ${counter}, equation (${counter})`,
                );
                cy.get(cesc("#etz")).should("have.text", `${counter}`);
                cy.get(cesc("#rz")).should("have.text", `(${counter})`);
                cy.get(cesc("#rz")).click();
                cy.get(cesc("#z")).then((el) => {
                    let rect = el[0].getBoundingClientRect();
                    expect(rect.top).gt(-1).lt(5);
                });
            });
        }

        checkEquationNumbering(2, 1);

        cy.get(cesc("#m") + " textarea").type(`{end}{backspace}4{enter}`, {
            force: true,
        });
        cy.get(cesc("#ma")).should("contain.text", "4");
        checkEquationNumbering(4, 1);

        cy.get(cesc("#n") + " textarea").type(`{end}{backspace}2{enter}`, {
            force: true,
        });
        cy.get(cesc("#na")).should("contain.text", "2");
        checkEquationNumbering(4, 2);

        cy.get(cesc("#m") + " textarea").type(`{end}{backspace}0{enter}`, {
            force: true,
        });
        cy.get(cesc("#ma")).should("contain.text", "0");
        checkEquationNumbering(0, 2);

        cy.get(cesc("#n") + " textarea").type(`{end}{backspace}6{enter}`, {
            force: true,
        });
        cy.get(cesc("#na")).should("contain.text", "6");
        checkEquationNumbering(0, 6);

        cy.get(cesc("#m") + " textarea").type(`{end}{backspace}3{enter}`, {
            force: true,
        });
        cy.get(cesc("#ma")).should("contain.text", "3");
        checkEquationNumbering(3, 6);

        cy.get(cesc("#n") + " textarea").type(`{end}{backspace}1{enter}`, {
            force: true,
        });
        cy.get(cesc("#na")).should("contain.text", "1");
        checkEquationNumbering(3, 1);
    });

    it("dynamic numbered aligned equations", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p>Number of equations 1: <mathInput prefill="2" name="m" /></p>
    <p>Number of equations 2: <mathInput prefill="1" name="n" /></p>
    
    <men name="x">x</men>
    <mdn name="ms">
      <repeatForSequence name="rm" length="$m" from="11" indexName="i" valueName="v">
        <mrow name='eq'>$i m &amp;= $v</mrow>
      </repeatForSequence>
    </mdn>
    <men name="y">y</men>
    <mdn name="ns">
      <repeatForSequence name="rn" length="$n" from="11" indexName="i" valueName="v">
        <mrow name="eq">$i n &= $v</mrow>
      </repeatForSequence>
    </mdn>
    <men name="z">z</men>
    
    <p name="px">x: <text name="etx" extend="$x.equationTag" />, equation <ref to="$x" name="rx" /></p>
    <p name="pm1">m1: <text name="etm1" extend="$rm[1].eq.equationTag" />, equation <ref to="$rm[1].eq" name="rm1" /></p>
    <p name="pm2">m2: <text name="etm2" extend="$rm[2].eq.equationTag" />, equation <ref to="$rm[2].eq" name="rm2" /></p>
    <p name="pm3">m3: <text name="etm3" extend="$rm[3].eq.equationTag" />, equation <ref to="$rm[3].eq" name="rm3" /></p>
    <p name="pm4">m4: <text name="etm4" extend="$rm[4].eq.equationTag" />, equation <ref to="$rm[4].eq" name="rm4" /></p>
    <p name="pm5">m5: <text name="etm5" extend="$rm[5].eq.equationTag" />, equation <ref to="$rm[5].eq" name="rm5" /></p>
    <p name="pm6">m6: <text name="etm6" extend="$rm[6].eq.equationTag" />, equation <ref to="$rm[6].eq" name="rm6" /></p>
    <p name="py">y: <text name="ety" extend="$y.equationTag" />, equation <ref to="$y" name="ry" /></p>
    <p name="pn1">n1: <text name="etn1" extend="$rn[1].eq.equationTag" />, equation <ref to="$rn[1].eq" name="rn1" /></p>
    <p name="pn2">n2: <text name="etn2" extend="$rn[2].eq.equationTag" />, equation <ref to="$rn[2].eq" name="rn2" /></p>
    <p name="pn3">n3: <text name="etn3" extend="$rn[3].eq.equationTag" />, equation <ref to="$rn[3].eq" name="rn3" /></p>
    <p name="pn4">n4: <text name="etn4" extend="$rn[4].eq.equationTag" />, equation <ref to="$rn[4].eq" name="rn4" /></p>
    <p name="pn5">n5: <text name="etn5" extend="$rn[5].eq.equationTag" />, equation <ref to="$rn[5].eq" name="rn5" /></p>
    <p name="pn6">n6: <text name="etn6" extend="$rn[6].eq.equationTag" />, equation <ref to="$rn[6].eq" name="rn6" /></p>
    <p name="pz">z: <text name="etz" extend="$z.equationTag" />, equation <ref to="$z" name="rz" /></p>
    <p>
      <math extend="$m" name="ma" />
      <math extend="$n" name="na" />
    </p>
    <lorem generateParagraphs="8" />
    `,
                },
                "*",
            );
        });

        cy.log("Test value displayed in browser");

        function checkEquationNumbering(m, n) {
            let counter = 1;

            cy.get(cesc("#x")).should(
                "have.text",
                toMathJaxString(`x(${counter})`),
            );
            cy.get(cesc("#px")).should(
                "have.text",
                `x: ${counter}, equation (${counter})`,
            );
            cy.get(cesc("#etx")).should("have.text", `${counter}`);
            cy.get(cesc("#rx")).should("have.text", `(${counter})`);
            cy.get(cesc("#rx")).click();
            cy.get(cesc("#x")).then((el) => {
                let rect = el[0].getBoundingClientRect();
                expect(rect.top).gt(-1).lt(5);
            });

            cy.window().then(async (win) => {
                cy.get(cesc("#ms")).should(
                    "have.text",
                    [
                        ...[...Array(m).keys()]
                            .map((v) => v + 1)
                            .map((i) => toMathJaxString(`${i}m=${i + 10}`)),
                        ...[...Array(m).keys()]
                            .map((v) => v + 1)
                            .map((i) => `(${counter + i})`),
                    ].join(""),
                );
            });
            for (let i = 1; i <= m; i++) {
                cy.window().then(async (win) => {
                    counter++;
                    if (i <= 6) {
                        cy.get(cesc(`#pm${i}`)).should(
                            "have.text",
                            `m${i}: ${counter}, equation (${counter})`,
                        );
                        cy.get(cesc(`#etm${i}`)).should(
                            "have.text",
                            `${counter}`,
                        );
                        cy.get(cesc(`#rm${i}`)).should(
                            "have.text",
                            `(${counter})`,
                        );
                        cy.get(cesc(`#rm${i}`)).click();
                        cy.get(cesc(`#rm:${i}.eq`)).then((el) => {
                            let rect = el[0].getBoundingClientRect();
                            expect(rect.top).gt(-1).lt(5);
                        });
                    }
                });
            }
            for (let i = m + 1; i <= 6; i++) {
                cy.window().then(async (win) => {
                    cy.get(cesc(`#pm${i}`)).should(
                        "have.text",
                        `m${i}: , equation ???`,
                    );
                    cy.get(cesc(`#etm${i}`)).should("have.text", "");
                    cy.get(cesc(`#rm${i}`)).should("have.text", `???`);
                    // cy.get(cesc(`#rm${i}`)).click();
                    // cy.window().then(async (win) => {
                    //   expect(win.scrollY).eq(0);
                    // });
                });
            }

            cy.window().then(async (win) => {
                counter++;
                cy.get(cesc("#y")).should(
                    "have.text",
                    toMathJaxString(`y(${counter})`),
                );
                cy.get(cesc("#py")).should(
                    "have.text",
                    `y: ${counter}, equation (${counter})`,
                );
                cy.get(cesc("#ety")).should("have.text", `${counter}`);
                cy.get(cesc("#ry")).should("have.text", `(${counter})`);
                cy.get(cesc("#ry")).click();
                cy.get(cesc("#y")).then((el) => {
                    let rect = el[0].getBoundingClientRect();
                    expect(rect.top).gt(-1).lt(5);
                });
            });

            cy.window().then(async (win) => {
                cy.get(cesc("#ns")).should(
                    "have.text",
                    [
                        ...[...Array(n).keys()]
                            .map((v) => v + 1)
                            .map((i) => toMathJaxString(`${i}n=${i + 10}`)),
                        ...[...Array(n).keys()]
                            .map((v) => v + 1)
                            .map((i) => `(${counter + i})`),
                    ].join(""),
                );
            });

            for (let i = 1; i <= n; i++) {
                cy.window().then(async (win) => {
                    counter++;
                    if (i <= 6) {
                        cy.get(cesc(`#pn${i}`)).should(
                            "have.text",
                            `n${i}: ${counter}, equation (${counter})`,
                        );
                        cy.get(cesc(`#etn${i}`)).should(
                            "have.text",
                            `${counter}`,
                        );
                        cy.get(cesc(`#rn${i}`)).should(
                            "have.text",
                            `(${counter})`,
                        );
                        cy.get(cesc(`#rn${i}`)).click();
                        cy.get(cesc(`#rn:${i}.eq`)).then((el) => {
                            let rect = el[0].getBoundingClientRect();
                            expect(rect.top).gt(-1).lt(5);
                        });
                    }
                });
            }

            for (let i = n + 1; i <= 6; i++) {
                cy.window().then(async (win) => {
                    cy.get(cesc(`#pn${i}`)).should(
                        "have.text",
                        `n${i}: , equation ???`,
                    );
                    cy.get(cesc(`#etn${i}`)).should("have.text", "");
                    cy.get(cesc(`#rn${i}`)).should("have.text", `???`);
                    // cy.get(cesc(`#rn${i}`)).click();
                    // cy.window().then(async (win) => {
                    //   expect(win.scrollY).eq(0);
                    // });
                });
            }

            cy.window().then(async (win) => {
                counter++;
                cy.get(cesc("#z")).should(
                    "have.text",
                    toMathJaxString(`z(${counter})`),
                );
                cy.get(cesc("#pz")).should(
                    "have.text",
                    `z: ${counter}, equation (${counter})`,
                );
                cy.get(cesc("#etz")).should("have.text", `${counter}`);
                cy.get(cesc("#rz")).should("have.text", `(${counter})`);
                cy.get(cesc("#rz")).click();
                cy.get(cesc("#z")).then((el) => {
                    let rect = el[0].getBoundingClientRect();
                    expect(rect.top).gt(-1).lt(5);
                });
            });
        }

        checkEquationNumbering(2, 1);

        cy.get(cesc("#m") + " textarea").type(`{end}{backspace}4{enter}`, {
            force: true,
        });
        cy.get(cesc("#ma")).should("contain.text", "4");
        checkEquationNumbering(4, 1);

        cy.get(cesc("#n") + " textarea").type(`{end}{backspace}2{enter}`, {
            force: true,
        });
        cy.get(cesc("#na")).should("contain.text", "2");
        checkEquationNumbering(4, 2);

        cy.get(cesc("#m") + " textarea").type(`{end}{backspace}0{enter}`, {
            force: true,
        });
        cy.get(cesc("#ma")).should("contain.text", "0");
        checkEquationNumbering(0, 2);

        cy.get(cesc("#n") + " textarea").type(`{end}{backspace}6{enter}`, {
            force: true,
        });
        cy.get(cesc("#na")).should("contain.text", "6");
        checkEquationNumbering(0, 6);

        cy.get(cesc("#m") + " textarea").type(`{end}{backspace}3{enter}`, {
            force: true,
        });
        cy.get(cesc("#ma")).should("contain.text", "3");
        checkEquationNumbering(3, 6);

        cy.get(cesc("#n") + " textarea").type(`{end}{backspace}1{enter}`, {
            force: true,
        });
        cy.get(cesc("#na")).should("contain.text", "1");
        checkEquationNumbering(3, 1);
    });

    it("dynamic numbered aligned equations, numbering swapped", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p>Number of equations 1: <mathInput prefill="2" name="m" /></p>
    <p>Number of equations 2: <mathInput prefill="1" name="n" /></p>
    
    <men name="x">x</men>
    <mdn name="ms">
      <repeatForSequence name="rm" length="$m" from="11" indexName="i" valueName="v">
        <mrow name='eq' number="mod($i,2)=1">$i m &amp;= $v</mrow>
      </repeatForSequence>
    </mdn>
    <men name="y">y</men>
    <mdn name="ns">
      <repeatForSequence name="rn" length="$n" from="11" indexName="i" valueName="v">
        <mrow name="eq" number="(-1)^$i = 1">$i n &= $v</mrow>
      </repeatForSequence>
    </mdn>
    <men name="z">z</men>
    
    <p name="px">x: <text name="etx" extend="$x.equationTag" />, equation <ref to="$x" name="rx" /></p>
    <p name="pm1">m1: <text name="etm1" extend="$rm[1].eq.equationTag" />, equation <ref to="$rm[1].eq" name="rm1" /></p>
    <p name="pm2">m2: <text name="etm2" extend="$rm[2].eq.equationTag" />, equation <ref to="$rm[2].eq" name="rm2" /></p>
    <p name="pm3">m3: <text name="etm3" extend="$rm[3].eq.equationTag" />, equation <ref to="$rm[3].eq" name="rm3" /></p>
    <p name="pm4">m4: <text name="etm4" extend="$rm[4].eq.equationTag" />, equation <ref to="$rm[4].eq" name="rm4" /></p>
    <p name="pm5">m5: <text name="etm5" extend="$rm[5].eq.equationTag" />, equation <ref to="$rm[5].eq" name="rm5" /></p>
    <p name="pm6">m6: <text name="etm6" extend="$rm[6].eq.equationTag" />, equation <ref to="$rm[6].eq" name="rm6" /></p>
    <p name="py">y: <text name="ety" extend="$y.equationTag" />, equation <ref to="$y" name="ry" /></p>
    <p name="pn1">n1: <text name="etn1" extend="$rn[1].eq.equationTag" />, equation <ref to="$rn[1].eq" name="rn1" /></p>
    <p name="pn2">n2: <text name="etn2" extend="$rn[2].eq.equationTag" />, equation <ref to="$rn[2].eq" name="rn2" /></p>
    <p name="pn3">n3: <text name="etn3" extend="$rn[3].eq.equationTag" />, equation <ref to="$rn[3].eq" name="rn3" /></p>
    <p name="pn4">n4: <text name="etn4" extend="$rn[4].eq.equationTag" />, equation <ref to="$rn[4].eq" name="rn4" /></p>
    <p name="pn5">n5: <text name="etn5" extend="$rn[5].eq.equationTag" />, equation <ref to="$rn[5].eq" name="rn5" /></p>
    <p name="pn6">n6: <text name="etn6" extend="$rn[6].eq.equationTag" />, equation <ref to="$rn[6].eq" name="rn6" /></p>
    <p name="pz">z: <text name="etz" extend="$z.equationTag" />, equation <ref to="$z" name="rz" /></p>
    <p>
      <math extend="$m" name="ma" />
      <math extend="$n" name="na" />
    </p>
    <lorem generateParagraphs="8" />
    `,
                },
                "*",
            );
        });

        cy.log("Test value displayed in browser");

        function checkEquationNumbering(m, n) {
            let counter = 1;

            cy.get(cesc("#x")).should(
                "have.text",
                toMathJaxString(`x(${counter})`),
            );
            cy.get(cesc("#px")).should(
                "have.text",
                `x: ${counter}, equation (${counter})`,
            );
            cy.get(cesc("#etx")).should("have.text", `${counter}`);
            cy.get(cesc("#rx")).should("have.text", `(${counter})`);
            cy.get(cesc("#rx")).click();
            cy.url().should("match", RegExp(cesc(`#x`) + "$"));
            cy.get(cesc("#x")).then((el) => {
                let rect = el[0].getBoundingClientRect();
                expect(rect.top).gt(-1).lt(5);
            });

            let labeledMs = 0;
            let unlabeledMs = 0;
            let mPieces = [];
            let mCounterPieces = [];
            for (let i = 1; i <= m; i++) {
                cy.window().then(async (win) => {
                    if (i % 2 === 1) {
                        labeledMs++;
                        counter++;
                        mPieces.push(toMathJaxString(`${i}m=${i + 10}`));
                        mCounterPieces.push(`(${counter})`);

                        if (i <= 6) {
                            cy.get(cesc(`#pm${i}`)).should(
                                "have.text",
                                `m${i}: ${counter}, equation (${counter})`,
                            );
                            cy.get(cesc(`#etm${i}`)).should(
                                "have.text",
                                `${counter}`,
                            );
                            cy.get(cesc(`#rm${i}`)).should(
                                "have.text",
                                `(${counter})`,
                            );
                            cy.get(cesc(`#rm${i}`)).click();
                            cy.url().should(
                                "match",
                                RegExp(cesc(`#rm:${i}.eq`) + "$"),
                            );
                            cy.get(cesc(`#rm:${i}.eq`)).then((el) => {
                                let rect = el[0].getBoundingClientRect();
                                expect(rect.top).gt(-1).lt(5);
                            });
                        }
                    } else {
                        unlabeledMs++;
                        mPieces.push(toMathJaxString(`${i}m=${i + 10}`));

                        if (i <= 6) {
                            cy.get(cesc(`#pm${i}`)).should(
                                "have.text",
                                `m${i}: , equation ???`,
                            );
                            cy.get(cesc(`#etm${i}`)).should("have.text", "");
                            cy.get(cesc(`#rm${i}`)).should("have.text", `???`);
                            cy.get(cesc(`#rm${i}`)).click();
                            cy.url().should(
                                "match",
                                RegExp(cesc(`#rm:${i}.eq`) + "$"),
                            );
                        }
                    }
                });
            }
            cy.window().then(async (win) => {
                cy.get(cesc("#ms")).should(
                    "have.text",
                    [...mPieces, ...mCounterPieces].join(""),
                );
            });

            for (let i = m + 1; i <= 6; i++) {
                cy.window().then(async (win) => {
                    cy.get(cesc(`#pm${i}`)).should(
                        "have.text",
                        `m${i}: , equation ???`,
                    );
                    cy.get(cesc(`#etm${i}`)).should("have.text", "");
                    cy.get(cesc(`#rm${i}`)).should("have.text", `???`);
                    cy.get(cesc(`#rm${i}`)).click();
                    cy.url().should("match", RegExp(`#$`));
                    // cy.window().then(async (win) => {
                    //   expect(win.scrollY).eq(0);
                    // });
                });
            }

            cy.window().then(async (win) => {
                counter++;
                cy.get(cesc("#y")).should(
                    "have.text",
                    toMathJaxString(`y(${counter})`),
                );
                cy.get(cesc("#py")).should(
                    "have.text",
                    `y: ${counter}, equation (${counter})`,
                );
                cy.get(cesc("#ety")).should("have.text", `${counter}`);
                cy.get(cesc("#ry")).should("have.text", `(${counter})`);
                cy.get(cesc("#ry")).click();
                cy.url().should("match", RegExp(cesc(`#y`) + "$"));
                cy.get(cesc("#y")).then((el) => {
                    let rect = el[0].getBoundingClientRect();
                    expect(rect.top).gt(-1).lt(5);
                });
            });

            let labeledNs = 0;
            let unlabeledNs = 0;
            let nPieces = [];
            let nCounterPieces = [];
            for (let i = 1; i <= n; i++) {
                cy.window().then(async (win) => {
                    if (i % 2 === 0) {
                        labeledNs++;
                        counter++;
                        nPieces.push(toMathJaxString(`${i}n=${i + 10}`));
                        nCounterPieces.push(`(${counter})`);
                        if (i <= 6) {
                            cy.get(cesc(`#pn${i}`)).should(
                                "have.text",
                                `n${i}: ${counter}, equation (${counter})`,
                            );
                            cy.get(cesc(`#etn${i}`)).should(
                                "have.text",
                                `${counter}`,
                            );
                            cy.get(cesc(`#rn${i}`)).should(
                                "have.text",
                                `(${counter})`,
                            );
                            cy.get(cesc(`#rn${i}`)).click();
                            cy.url().should(
                                "match",
                                RegExp(cesc(`#rn:${i}.eq`) + "$"),
                            );
                            cy.get(cesc(`#rn:${i}.eq`)).then((el) => {
                                let rect = el[0].getBoundingClientRect();
                                expect(rect.top).gt(-1).lt(5);
                            });
                        }
                    } else {
                        unlabeledNs++;
                        nPieces.push(toMathJaxString(`${i}n=${i + 10}`));
                        if (i <= 6) {
                            cy.get(cesc(`#pn${i}`)).should(
                                "have.text",
                                `n${i}: , equation ???`,
                            );
                            cy.get(cesc(`#etn${i}`)).should("have.text", ``);
                            cy.get(cesc(`#rn${i}`)).should("have.text", `???`);
                            cy.get(cesc(`#rn${i}`)).click();
                            cy.url().should(
                                "match",
                                RegExp(cesc(`#rn:${i}.eq`) + "$"),
                            );
                        }
                    }
                });
            }

            cy.window().then(async (win) => {
                cy.get(cesc("#ns")).should(
                    "have.text",
                    [...nPieces, ...nCounterPieces].join(""),
                );
            });

            for (let i = n + 1; i <= 6; i++) {
                cy.window().then(async (win) => {
                    cy.get(cesc(`#pn${i}`)).should(
                        "have.text",
                        `n${i}: , equation ???`,
                    );
                    cy.get(cesc(`#etn${i}`)).should("have.text", "");
                    cy.get(cesc(`#rn${i}`)).should("have.text", `???`);
                    cy.get(cesc(`#rn${i}`)).click();
                    cy.url().should("match", RegExp(`#$`));
                    // cy.window().then(async (win) => {
                    //   expect(win.scrollY).eq(0);
                    // });
                });
            }

            cy.window().then(async (win) => {
                counter++;
                cy.get(cesc("#z")).should(
                    "have.text",
                    toMathJaxString(`z(${counter})`),
                );
                cy.get(cesc("#pz")).should(
                    "have.text",
                    `z: ${counter}, equation (${counter})`,
                );
                cy.get(cesc("#etz")).should("have.text", `${counter}`);
                cy.get(cesc("#rz")).should("have.text", `(${counter})`);
                cy.get(cesc("#rz")).click();
                cy.url().should("match", RegExp(cesc(`#z`) + "$"));
                cy.get(cesc("#z")).then((el) => {
                    let rect = el[0].getBoundingClientRect();
                    expect(rect.top).gt(-1).lt(5);
                });
            });
        }

        checkEquationNumbering(2, 1);

        cy.get(cesc("#m") + " textarea").type(`{end}{backspace}4{enter}`, {
            force: true,
        });
        cy.get(cesc("#ma")).should("contain.text", "4");
        checkEquationNumbering(4, 1);

        cy.get(cesc("#n") + " textarea").type(`{end}{backspace}2{enter}`, {
            force: true,
        });
        cy.get(cesc("#na")).should("contain.text", "2");
        checkEquationNumbering(4, 2);

        cy.get(cesc("#m") + " textarea").type(`{end}{backspace}0{enter}`, {
            force: true,
        });
        cy.get(cesc("#ma")).should("contain.text", "0");
        checkEquationNumbering(0, 2);

        cy.get(cesc("#n") + " textarea").type(`{end}{backspace}6{enter}`, {
            force: true,
        });
        cy.get(cesc("#na")).should("contain.text", "6");
        checkEquationNumbering(0, 6);

        cy.get(cesc("#m") + " textarea").type(`{end}{backspace}3{enter}`, {
            force: true,
        });
        cy.get(cesc("#ma")).should("contain.text", "3");
        checkEquationNumbering(3, 6);

        cy.get(cesc("#n") + " textarea").type(`{end}{backspace}1{enter}`, {
            force: true,
        });
        cy.get(cesc("#na")).should("contain.text", "1");
        checkEquationNumbering(3, 1);
    });

    it("mathjax has extension packages", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

    <m name="bbox">\\bbox{R}</m>
    <m name="cancel">\\cancel{x}</m>
    <m name="bcancel">\\bcancel{y}</m>
    <m name="circle">\\enclose{circle}{\\kern .1em 1 \\kern .1em}</m>  
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#cancel")).should("have.text", toMathJaxString("x"));
        cy.get(cesc("#bcancel")).should("have.text", toMathJaxString("y"));
        cy.get(cesc("#bbox")).should("have.text", toMathJaxString("R"));
        cy.get(cesc("#circle")).should("have.text", toMathJaxString("1"));
    });
});
