import { cesc, cesc2 } from "@doenet/utils";

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
    <text>a</text>
    <lorem generateParagraphs="2" />
    <men name="e1">\\sin(x)</men>
    <lorem generateParagraphs="2" />
    <men name="e2">\\cos(x)</men>
    <lorem generateParagraphs="2" />
    <men name="e3">\\tan(x)</men>
    <lorem generateParagraphs="2" />

    <p>We have equation <ref target="e1" name="re1" />, equation <ref target="e2" name="re2" />, and equation <ref target="e3" name="re3" />.</p>
    <p>From copying properties: $e1.equationTag{assignNames="te1"}, $e2.equationTag{assignNames="te2"}, and $e3.equationTag{assignNames="te3"}.</p>

    <lorem generateParagraphs="8" />

    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        cy.log("Test value displayed in browser");
        cy.get(cesc("#\\/e1")).should("have.text", "(1)sin⁡(x)");
        cy.get(cesc("#\\/e2")).should("have.text", "(2)cos⁡(x)");
        cy.get(cesc("#\\/e3")).should("have.text", "(3)tan⁡(x)");
        cy.get(cesc("#\\/_p1")).should(
            "have.text",
            "We have equation (1), equation (2), and equation (3).",
        );
        cy.get(cesc("#\\/re1")).should("have.text", "(1)");
        cy.get(cesc("#\\/re2")).should("have.text", "(2)");
        cy.get(cesc("#\\/re3")).should("have.text", "(3)");

        cy.get(cesc("#\\/_p2")).should(
            "have.text",
            "From copying properties: 1, 2, and 3.",
        );
        cy.get(cesc("#\\/te1")).should("have.text", "1");
        cy.get(cesc("#\\/te2")).should("have.text", "2");
        cy.get(cesc("#\\/te3")).should("have.text", "3");

        cy.get(cesc("#\\/re1")).click();

        cy.get(cesc("#\\/e1")).then((el) => {
            let rect = el[0].getBoundingClientRect();
            expect(rect.top).gt(-1).lt(5);
        });

        cy.get(cesc("#\\/re2")).click();

        cy.get(cesc("#\\/e2")).then((el) => {
            let rect = el[0].getBoundingClientRect();
            expect(rect.top).gt(-1).lt(5);
        });

        cy.get(cesc("#\\/re3")).click();

        cy.get(cesc("#\\/e3")).then((el) => {
            let rect = el[0].getBoundingClientRect();
            expect(rect.top).gt(-1).lt(5);
        });
    });

    it("dynamic numbered equations", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <p>Number of equations 1: <mathinput prefill="2" name="m" /></p>
    <p>Number of equations 2: <mathinput prefill="1" name="n" /></p>
    
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
    
    <p name="px">x: <copy prop="equationTag" assignNames="etx" target="x" />, equation <ref target="x" name="rx" /></p>
    <p name="pm1">m1: <copy prop="equationTag" assignNames="etm1" target="m1/eq" />, equation <ref target="m1/eq" name="rm1" /></p>
    <p name="pm2">m2: <copy prop="equationTag" assignNames="etm2" target="m2/eq" />, equation <ref target="m2/eq" name="rm2" /></p>
    <p name="pm3">m3: <copy prop="equationTag" assignNames="etm3" target="m3/eq" />, equation <ref target="m3/eq" name="rm3" /></p>
    <p name="pm4">m4: <copy prop="equationTag" assignNames="etm4" target="m4/eq" />, equation <ref target="m4/eq" name="rm4" /></p>
    <p name="pm5">m5: <copy prop="equationTag" assignNames="etm5" target="m5/eq" />, equation <ref target="m5/eq" name="rm5" /></p>
    <p name="pm6">m6: <copy prop="equationTag" assignNames="etm6" target="m6/eq" />, equation <ref target="m6/eq" name="rm6" /></p>
    <p name="py">y: <copy prop="equationTag" assignNames="ety" target="y" />, equation <ref target="y" name="ry" /></p>
    <p name="pn1">n1: <copy prop="equationTag" assignNames="etn1" target="n1/eq" />, equation <ref target="n1/eq" name="rn1" /></p>
    <p name="pn2">n2: <copy prop="equationTag" assignNames="etn2" target="n2/eq" />, equation <ref target="n2/eq" name="rn2" /></p>
    <p name="pn3">n3: <copy prop="equationTag" assignNames="etn3" target="n3/eq" />, equation <ref target="n3/eq" name="rn3" /></p>
    <p name="pn4">n4: <copy prop="equationTag" assignNames="etn4" target="n4/eq" />, equation <ref target="n4/eq" name="rn4" /></p>
    <p name="pn5">n5: <copy prop="equationTag" assignNames="etn5" target="n5/eq" />, equation <ref target="n5/eq" name="rn5" /></p>
    <p name="pn6">n6: <copy prop="equationTag" assignNames="etn6" target="n6/eq" />, equation <ref target="n6/eq" name="rn6" /></p>
    <p name="pz">z: <copy prop="equationTag" assignNames="etz" target="z" />, equation <ref target="z" name="rz" /></p>
    <p>
      $m.value{assignNames="ma"}
      $n.value{assignNames="na"}
    </p>
    <lorem generateParagraphs="8" />
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        cy.log("Test value displayed in browser");

        function checkEquationNumbering(m, n) {
            let counter = 1;

            cy.get(cesc("#\\/x")).should("have.text", `(${counter})x`);
            cy.get(cesc("#\\/px")).should(
                "have.text",
                `x: ${counter}, equation (${counter})`,
            );
            cy.get(cesc("#\\/etx")).should("have.text", `${counter}`);
            cy.get(cesc("#\\/rx")).should("have.text", `(${counter})`);
            cy.get(cesc("#\\/rx")).click();
            cy.get(cesc("#\\/x")).then((el) => {
                let rect = el[0].getBoundingClientRect();
                expect(rect.top).gt(-1).lt(5);
            });

            for (let i = 1; i <= m; i++) {
                cy.window().then(async (win) => {
                    counter++;
                    cy.get(cesc(`#\\/m${i}\\/eq`)).should(
                        "have.text",
                        `(${counter})${i}m`,
                    );
                    if (i <= 6) {
                        cy.get(cesc(`#\\/pm${i}`)).should(
                            "have.text",
                            `m${i}: ${counter}, equation (${counter})`,
                        );
                        cy.get(cesc(`#\\/etm${i}`)).should(
                            "have.text",
                            `${counter}`,
                        );
                        cy.get(cesc(`#\\/rm${i}`)).should(
                            "have.text",
                            `(${counter})`,
                        );
                        cy.get(cesc(`#\\/rm${i}`)).click();
                        cy.get(cesc(`#\\/m${i}\\/eq`)).then((el) => {
                            let rect = el[0].getBoundingClientRect();
                            expect(rect.top).gt(-1).lt(5);
                        });
                    }
                });
            }
            for (let i = m + 1; i <= 6; i++) {
                cy.window().then(async (win) => {
                    cy.get(cesc(`#\\/pm${i}`)).should(
                        "have.text",
                        `m${i}: , equation ???`,
                    );
                    cy.get(cesc(`#\\/etm${i}`)).should("not.exist");
                    cy.get(cesc(`#\\/rm${i}`)).should("have.text", `???`);
                    // cy.get(cesc(`#\\/rm${i}`)).click();
                    // cy.window().then(async (win) => {
                    //   expect(win.scrollY).eq(0);
                    // });
                });
            }

            cy.window().then(async (win) => {
                counter++;
                cy.get(cesc("#\\/y")).should("have.text", `(${counter})y`);
                cy.get(cesc("#\\/py")).should(
                    "have.text",
                    `y: ${counter}, equation (${counter})`,
                );
                cy.get(cesc("#\\/ety")).should("have.text", `${counter}`);
                cy.get(cesc("#\\/ry")).should("have.text", `(${counter})`);
                cy.get(cesc("#\\/ry")).click();
                cy.get(cesc("#\\/y")).then((el) => {
                    let rect = el[0].getBoundingClientRect();
                    expect(rect.top).gt(-1).lt(5);
                });
            });

            for (let i = 1; i <= n; i++) {
                cy.window().then(async (win) => {
                    counter++;
                    cy.get(cesc(`#\\/n${i}\\/eq`)).should(
                        "have.text",
                        `(${counter})${i}n`,
                    );
                    if (i <= 6) {
                        cy.get(cesc(`#\\/pn${i}`)).should(
                            "have.text",
                            `n${i}: ${counter}, equation (${counter})`,
                        );
                        cy.get(cesc(`#\\/etn${i}`)).should(
                            "have.text",
                            `${counter}`,
                        );
                        cy.get(cesc(`#\\/rn${i}`)).should(
                            "have.text",
                            `(${counter})`,
                        );
                        cy.get(cesc(`#\\/rn${i}`)).click();
                        cy.get(cesc(`#\\/n${i}\\/eq`)).then((el) => {
                            let rect = el[0].getBoundingClientRect();
                            expect(rect.top).gt(-1).lt(5);
                        });
                    }
                });
            }

            for (let i = n + 1; i <= 6; i++) {
                cy.window().then(async (win) => {
                    cy.get(cesc(`#\\/pn${i}`)).should(
                        "have.text",
                        `n${i}: , equation ???`,
                    );
                    cy.get(cesc(`#\\/etn${i}`)).should("not.exist");
                    cy.get(cesc(`#\\/rn${i}`)).should("have.text", `???`);
                    // cy.get(cesc(`#\\/rn${i}`)).click();
                    // cy.window().then(async (win) => {
                    //   expect(win.scrollY).eq(0);
                    // });
                });
            }

            cy.window().then(async (win) => {
                counter++;
                cy.get(cesc("#\\/z")).should("have.text", `(${counter})z`);
                cy.get(cesc("#\\/pz")).should(
                    "have.text",
                    `z: ${counter}, equation (${counter})`,
                );
                cy.get(cesc("#\\/etz")).should("have.text", `${counter}`);
                cy.get(cesc("#\\/rz")).should("have.text", `(${counter})`);
                cy.get(cesc("#\\/rz")).click();
                cy.get(cesc("#\\/z")).then((el) => {
                    let rect = el[0].getBoundingClientRect();
                    expect(rect.top).gt(-1).lt(5);
                });
            });
        }

        checkEquationNumbering(2, 1);

        cy.get(cesc("#\\/m") + " textarea").type(`{end}{backspace}4{enter}`, {
            force: true,
        });
        cy.get(cesc("#\\/ma")).should("contain.text", "4");
        checkEquationNumbering(4, 1);

        cy.get(cesc("#\\/n") + " textarea").type(`{end}{backspace}2{enter}`, {
            force: true,
        });
        cy.get(cesc("#\\/na")).should("contain.text", "2");
        checkEquationNumbering(4, 2);

        cy.get(cesc("#\\/m") + " textarea").type(`{end}{backspace}0{enter}`, {
            force: true,
        });
        cy.get(cesc("#\\/ma")).should("contain.text", "0");
        checkEquationNumbering(0, 2);

        cy.get(cesc("#\\/n") + " textarea").type(`{end}{backspace}6{enter}`, {
            force: true,
        });
        cy.get(cesc("#\\/na")).should("contain.text", "6");
        checkEquationNumbering(0, 6);

        cy.get(cesc("#\\/m") + " textarea").type(`{end}{backspace}3{enter}`, {
            force: true,
        });
        cy.get(cesc("#\\/ma")).should("contain.text", "3");
        checkEquationNumbering(3, 6);

        cy.get(cesc("#\\/n") + " textarea").type(`{end}{backspace}1{enter}`, {
            force: true,
        });
        cy.get(cesc("#\\/na")).should("contain.text", "1");
        checkEquationNumbering(3, 1);
    });

    it("dynamic numbered aligned equations", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <p>Number of equations 1: <mathinput prefill="2" name="m" /></p>
    <p>Number of equations 2: <mathinput prefill="1" name="n" /></p>
    
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
    
    <p name="px">x: <copy prop="equationTag" assignNames="etx" target="x" />, equation <ref target="x" name="rx" /></p>
    <p name="pm1">m1: <copy prop="equationTag" assignNames="etm1" target="m1/eq" />, equation <ref target="m1/eq" name="rm1" /></p>
    <p name="pm2">m2: <copy prop="equationTag" assignNames="etm2" target="m2/eq" />, equation <ref target="m2/eq" name="rm2" /></p>
    <p name="pm3">m3: <copy prop="equationTag" assignNames="etm3" target="m3/eq" />, equation <ref target="m3/eq" name="rm3" /></p>
    <p name="pm4">m4: <copy prop="equationTag" assignNames="etm4" target="m4/eq" />, equation <ref target="m4/eq" name="rm4" /></p>
    <p name="pm5">m5: <copy prop="equationTag" assignNames="etm5" target="m5/eq" />, equation <ref target="m5/eq" name="rm5" /></p>
    <p name="pm6">m6: <copy prop="equationTag" assignNames="etm6" target="m6/eq" />, equation <ref target="m6/eq" name="rm6" /></p>
    <p name="py">y: <copy prop="equationTag" assignNames="ety" target="y" />, equation <ref target="y" name="ry" /></p>
    <p name="pn1">n1: <copy prop="equationTag" assignNames="etn1" target="n1/eq" />, equation <ref target="n1/eq" name="rn1" /></p>
    <p name="pn2">n2: <copy prop="equationTag" assignNames="etn2" target="n2/eq" />, equation <ref target="n2/eq" name="rn2" /></p>
    <p name="pn3">n3: <copy prop="equationTag" assignNames="etn3" target="n3/eq" />, equation <ref target="n3/eq" name="rn3" /></p>
    <p name="pn4">n4: <copy prop="equationTag" assignNames="etn4" target="n4/eq" />, equation <ref target="n4/eq" name="rn4" /></p>
    <p name="pn5">n5: <copy prop="equationTag" assignNames="etn5" target="n5/eq" />, equation <ref target="n5/eq" name="rn5" /></p>
    <p name="pn6">n6: <copy prop="equationTag" assignNames="etn6" target="n6/eq" />, equation <ref target="n6/eq" name="rn6" /></p>
    <p name="pz">z: <copy prop="equationTag" assignNames="etz" target="z" />, equation <ref target="z" name="rz" /></p>
    <p>
      $m.value{assignNames="ma"}
      $n.value{assignNames="na"}
    </p>
    <lorem generateParagraphs="8" />
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        cy.log("Test value displayed in browser");

        function checkEquationNumbering(m, n) {
            let counter = 1;

            cy.get(cesc("#\\/x")).should("have.text", `(${counter})x`);
            cy.get(cesc("#\\/px")).should(
                "have.text",
                `x: ${counter}, equation (${counter})`,
            );
            cy.get(cesc("#\\/etx")).should("have.text", `${counter}`);
            cy.get(cesc("#\\/rx")).should("have.text", `(${counter})`);
            cy.get(cesc("#\\/rx")).click();
            cy.get(cesc("#\\/x")).then((el) => {
                let rect = el[0].getBoundingClientRect();
                expect(rect.top).gt(-1).lt(5);
            });

            cy.window().then(async (win) => {
                cy.get(cesc("#\\/ms")).should(
                    "have.text",
                    [...Array(m).keys()]
                        .map((v) => v + 1)
                        .map((i) => `(${counter + i})${i}m=${i + 10}`)
                        .join(""),
                );
            });
            for (let i = 1; i <= m; i++) {
                cy.window().then(async (win) => {
                    counter++;
                    if (i <= 6) {
                        cy.get(cesc(`#\\/pm${i}`)).should(
                            "have.text",
                            `m${i}: ${counter}, equation (${counter})`,
                        );
                        cy.get(cesc(`#\\/etm${i}`)).should(
                            "have.text",
                            `${counter}`,
                        );
                        cy.get(cesc(`#\\/rm${i}`)).should(
                            "have.text",
                            `(${counter})`,
                        );
                        cy.get(cesc(`#\\/rm${i}`)).click();
                        cy.get(cesc(`#\\/m${i}\\/eq`)).then((el) => {
                            let rect = el[0].getBoundingClientRect();
                            expect(rect.top).gt(-1).lt(5);
                        });
                    }
                });
            }
            for (let i = m + 1; i <= 6; i++) {
                cy.window().then(async (win) => {
                    cy.get(cesc(`#\\/pm${i}`)).should(
                        "have.text",
                        `m${i}: , equation ???`,
                    );
                    cy.get(cesc(`#\\/etm${i}`)).should("not.exist");
                    cy.get(cesc(`#\\/rm${i}`)).should("have.text", `???`);
                    // cy.get(cesc(`#\\/rm${i}`)).click();
                    // cy.window().then(async (win) => {
                    //   expect(win.scrollY).eq(0);
                    // });
                });
            }

            cy.window().then(async (win) => {
                counter++;
                cy.get(cesc("#\\/y")).should("have.text", `(${counter})y`);
                cy.get(cesc("#\\/py")).should(
                    "have.text",
                    `y: ${counter}, equation (${counter})`,
                );
                cy.get(cesc("#\\/ety")).should("have.text", `${counter}`);
                cy.get(cesc("#\\/ry")).should("have.text", `(${counter})`);
                cy.get(cesc("#\\/ry")).click();
                cy.get(cesc("#\\/y")).then((el) => {
                    let rect = el[0].getBoundingClientRect();
                    expect(rect.top).gt(-1).lt(5);
                });
            });

            cy.window().then(async (win) => {
                cy.get(cesc("#\\/ns")).should(
                    "have.text",
                    [...Array(n).keys()]
                        .map((v) => v + 1)
                        .map((i) => `(${counter + i})${i}n=${i + 10}`)
                        .join(""),
                );
            });

            for (let i = 1; i <= n; i++) {
                cy.window().then(async (win) => {
                    counter++;
                    if (i <= 6) {
                        cy.get(cesc(`#\\/pn${i}`)).should(
                            "have.text",
                            `n${i}: ${counter}, equation (${counter})`,
                        );
                        cy.get(cesc(`#\\/etn${i}`)).should(
                            "have.text",
                            `${counter}`,
                        );
                        cy.get(cesc(`#\\/rn${i}`)).should(
                            "have.text",
                            `(${counter})`,
                        );
                        cy.get(cesc(`#\\/rn${i}`)).click();
                        cy.get(cesc(`#\\/n${i}\\/eq`)).then((el) => {
                            let rect = el[0].getBoundingClientRect();
                            expect(rect.top).gt(-1).lt(5);
                        });
                    }
                });
            }

            for (let i = n + 1; i <= 6; i++) {
                cy.window().then(async (win) => {
                    cy.get(cesc(`#\\/pn${i}`)).should(
                        "have.text",
                        `n${i}: , equation ???`,
                    );
                    cy.get(cesc(`#\\/etn${i}`)).should("not.exist");
                    cy.get(cesc(`#\\/rn${i}`)).should("have.text", `???`);
                    // cy.get(cesc(`#\\/rn${i}`)).click();
                    // cy.window().then(async (win) => {
                    //   expect(win.scrollY).eq(0);
                    // });
                });
            }

            cy.window().then(async (win) => {
                counter++;
                cy.get(cesc("#\\/z")).should("have.text", `(${counter})z`);
                cy.get(cesc("#\\/pz")).should(
                    "have.text",
                    `z: ${counter}, equation (${counter})`,
                );
                cy.get(cesc("#\\/etz")).should("have.text", `${counter}`);
                cy.get(cesc("#\\/rz")).should("have.text", `(${counter})`);
                cy.get(cesc("#\\/rz")).click();
                cy.get(cesc("#\\/z")).then((el) => {
                    let rect = el[0].getBoundingClientRect();
                    expect(rect.top).gt(-1).lt(5);
                });
            });
        }

        checkEquationNumbering(2, 1);

        cy.get(cesc("#\\/m") + " textarea").type(`{end}{backspace}4{enter}`, {
            force: true,
        });
        cy.get(cesc("#\\/ma")).should("contain.text", "4");
        checkEquationNumbering(4, 1);

        cy.get(cesc("#\\/n") + " textarea").type(`{end}{backspace}2{enter}`, {
            force: true,
        });
        cy.get(cesc("#\\/na")).should("contain.text", "2");
        checkEquationNumbering(4, 2);

        cy.get(cesc("#\\/m") + " textarea").type(`{end}{backspace}0{enter}`, {
            force: true,
        });
        cy.get(cesc("#\\/ma")).should("contain.text", "0");
        checkEquationNumbering(0, 2);

        cy.get(cesc("#\\/n") + " textarea").type(`{end}{backspace}6{enter}`, {
            force: true,
        });
        cy.get(cesc("#\\/na")).should("contain.text", "6");
        checkEquationNumbering(0, 6);

        cy.get(cesc("#\\/m") + " textarea").type(`{end}{backspace}3{enter}`, {
            force: true,
        });
        cy.get(cesc("#\\/ma")).should("contain.text", "3");
        checkEquationNumbering(3, 6);

        cy.get(cesc("#\\/n") + " textarea").type(`{end}{backspace}1{enter}`, {
            force: true,
        });
        cy.get(cesc("#\\/na")).should("contain.text", "1");
        checkEquationNumbering(3, 1);
    });

    it("dynamic numbered aligned equations, numbering swapped", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <p>Number of equations 1: <mathinput prefill="2" name="m" /></p>
    <p>Number of equations 2: <mathinput prefill="1" name="n" /></p>
    
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
    
    <p name="px">x: <copy prop="equationTag" assignNames="etx" target="x" />, equation <ref target="x" name="rx" /></p>
    <p name="pm1">m1: <copy prop="equationTag" assignNames="etm1" target="m1/eq" />, equation <ref target="m1/eq" name="rm1" /></p>
    <p name="pm2">m2: <copy prop="equationTag" assignNames="etm2" target="m2/eq" />, equation <ref target="m2/eq" name="rm2" /></p>
    <p name="pm3">m3: <copy prop="equationTag" assignNames="etm3" target="m3/eq" />, equation <ref target="m3/eq" name="rm3" /></p>
    <p name="pm4">m4: <copy prop="equationTag" assignNames="etm4" target="m4/eq" />, equation <ref target="m4/eq" name="rm4" /></p>
    <p name="pm5">m5: <copy prop="equationTag" assignNames="etm5" target="m5/eq" />, equation <ref target="m5/eq" name="rm5" /></p>
    <p name="pm6">m6: <copy prop="equationTag" assignNames="etm6" target="m6/eq" />, equation <ref target="m6/eq" name="rm6" /></p>
    <p name="py">y: <copy prop="equationTag" assignNames="ety" target="y" />, equation <ref target="y" name="ry" /></p>
    <p name="pn1">n1: <copy prop="equationTag" assignNames="etn1" target="n1/eq" />, equation <ref target="n1/eq" name="rn1" /></p>
    <p name="pn2">n2: <copy prop="equationTag" assignNames="etn2" target="n2/eq" />, equation <ref target="n2/eq" name="rn2" /></p>
    <p name="pn3">n3: <copy prop="equationTag" assignNames="etn3" target="n3/eq" />, equation <ref target="n3/eq" name="rn3" /></p>
    <p name="pn4">n4: <copy prop="equationTag" assignNames="etn4" target="n4/eq" />, equation <ref target="n4/eq" name="rn4" /></p>
    <p name="pn5">n5: <copy prop="equationTag" assignNames="etn5" target="n5/eq" />, equation <ref target="n5/eq" name="rn5" /></p>
    <p name="pn6">n6: <copy prop="equationTag" assignNames="etn6" target="n6/eq" />, equation <ref target="n6/eq" name="rn6" /></p>
    <p name="pz">z: <copy prop="equationTag" assignNames="etz" target="z" />, equation <ref target="z" name="rz" /></p>
    <p>
      $m.value{assignNames="ma"}
      $n.value{assignNames="na"}
    </p>
    <lorem generateParagraphs="8" />
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        cy.log("Test value displayed in browser");

        function checkEquationNumbering(m, n) {
            let counter = 1;

            cy.get(cesc("#\\/x")).should("have.text", `(${counter})x`);
            cy.get(cesc("#\\/px")).should(
                "have.text",
                `x: ${counter}, equation (${counter})`,
            );
            cy.get(cesc("#\\/etx")).should("have.text", `${counter}`);
            cy.get(cesc("#\\/rx")).should("have.text", `(${counter})`);
            cy.get(cesc("#\\/rx")).click();
            cy.url().should("match", RegExp(cesc(`#\\/x`) + "$"));
            cy.get(cesc("#\\/x")).then((el) => {
                let rect = el[0].getBoundingClientRect();
                expect(rect.top).gt(-1).lt(5);
            });

            let labeledMs = 0;
            let unlabeledMs = 0;
            let mPieces = [];
            for (let i = 1; i <= m; i++) {
                cy.window().then(async (win) => {
                    if (i % 2 === 1) {
                        labeledMs++;
                        counter++;
                        mPieces.push(`(${counter})${i}m=${i + 10}`);

                        if (i <= 6) {
                            cy.get(cesc(`#\\/pm${i}`)).should(
                                "have.text",
                                `m${i}: ${counter}, equation (${counter})`,
                            );
                            cy.get(cesc(`#\\/etm${i}`)).should(
                                "have.text",
                                `${counter}`,
                            );
                            cy.get(cesc(`#\\/rm${i}`)).should(
                                "have.text",
                                `(${counter})`,
                            );
                            cy.get(cesc(`#\\/rm${i}`)).click();
                            cy.url().should(
                                "match",
                                RegExp(cesc(`#\\/m${i}\\/eq`) + "$"),
                            );
                            cy.get(cesc(`#\\/m${i}\\/eq`)).then((el) => {
                                let rect = el[0].getBoundingClientRect();
                                expect(rect.top).gt(-1).lt(5);
                            });
                        }
                    } else {
                        unlabeledMs++;
                        mPieces.push(`${i}m=${i + 10}`);

                        if (i <= 6) {
                            cy.get(cesc(`#\\/pm${i}`)).should(
                                "have.text",
                                `m${i}: , equation ???`,
                            );
                            cy.get(cesc(`#\\/etm${i}`)).should("have.text", "");
                            cy.get(cesc(`#\\/rm${i}`)).should(
                                "have.text",
                                `???`,
                            );
                            cy.get(cesc(`#\\/rm${i}`)).click();
                            cy.url().should(
                                "match",
                                RegExp(cesc(`#\\/m${i}\\/eq`) + "$"),
                            );
                        }
                    }
                });
            }
            cy.window().then(async (win) => {
                cy.get(cesc("#\\/ms")).should("have.text", mPieces.join(""));
            });

            for (let i = m + 1; i <= 6; i++) {
                cy.window().then(async (win) => {
                    cy.get(cesc(`#\\/pm${i}`)).should(
                        "have.text",
                        `m${i}: , equation ???`,
                    );
                    cy.get(cesc(`#\\/etm${i}`)).should("not.exist");
                    cy.get(cesc(`#\\/rm${i}`)).should("have.text", `???`);
                    cy.get(cesc(`#\\/rm${i}`)).click();
                    cy.url().should("match", RegExp(`#$`));
                    // cy.window().then(async (win) => {
                    //   expect(win.scrollY).eq(0);
                    // });
                });
            }

            cy.window().then(async (win) => {
                counter++;
                cy.get(cesc("#\\/y")).should("have.text", `(${counter})y`);
                cy.get(cesc("#\\/py")).should(
                    "have.text",
                    `y: ${counter}, equation (${counter})`,
                );
                cy.get(cesc("#\\/ety")).should("have.text", `${counter}`);
                cy.get(cesc("#\\/ry")).should("have.text", `(${counter})`);
                cy.get(cesc("#\\/ry")).click();
                cy.url().should("match", RegExp(cesc(`#\\/y`) + "$"));
                cy.get(cesc("#\\/y")).then((el) => {
                    let rect = el[0].getBoundingClientRect();
                    expect(rect.top).gt(-1).lt(5);
                });
            });

            let labeledNs = 0;
            let unlabeledNs = 0;
            let nPieces = [];
            for (let i = 1; i <= n; i++) {
                cy.window().then(async (win) => {
                    if (i % 2 === 0) {
                        labeledNs++;
                        counter++;
                        nPieces.push(`(${counter})${i}n=${i + 10}`);
                        if (i <= 6) {
                            cy.get(cesc(`#\\/pn${i}`)).should(
                                "have.text",
                                `n${i}: ${counter}, equation (${counter})`,
                            );
                            cy.get(cesc(`#\\/etn${i}`)).should(
                                "have.text",
                                `${counter}`,
                            );
                            cy.get(cesc(`#\\/rn${i}`)).should(
                                "have.text",
                                `(${counter})`,
                            );
                            cy.get(cesc(`#\\/rn${i}`)).click();
                            cy.url().should(
                                "match",
                                RegExp(cesc(`#\\/n${i}\\/eq`) + "$"),
                            );
                            cy.get(cesc(`#\\/n${i}\\/eq`)).then((el) => {
                                let rect = el[0].getBoundingClientRect();
                                expect(rect.top).gt(-1).lt(5);
                            });
                        }
                    } else {
                        unlabeledNs++;
                        nPieces.push(`${i}n=${i + 10}`);
                        if (i <= 6) {
                            cy.get(cesc(`#\\/pn${i}`)).should(
                                "have.text",
                                `n${i}: , equation ???`,
                            );
                            cy.get(cesc(`#\\/etn${i}`)).should("have.text", ``);
                            cy.get(cesc(`#\\/rn${i}`)).should(
                                "have.text",
                                `???`,
                            );
                            cy.get(cesc(`#\\/rn${i}`)).click();
                            cy.url().should(
                                "match",
                                RegExp(cesc(`#\\/n${i}\\/eq`) + "$"),
                            );
                        }
                    }
                });
            }

            cy.window().then(async (win) => {
                cy.get(cesc("#\\/ns")).should("have.text", nPieces.join(""));
            });

            for (let i = n + 1; i <= 6; i++) {
                cy.window().then(async (win) => {
                    cy.get(cesc(`#\\/pn${i}`)).should(
                        "have.text",
                        `n${i}: , equation ???`,
                    );
                    cy.get(cesc(`#\\/etn${i}`)).should("not.exist");
                    cy.get(cesc(`#\\/rn${i}`)).should("have.text", `???`);
                    cy.get(cesc(`#\\/rn${i}`)).click();
                    cy.url().should("match", RegExp(`#$`));
                    // cy.window().then(async (win) => {
                    //   expect(win.scrollY).eq(0);
                    // });
                });
            }

            cy.window().then(async (win) => {
                counter++;
                cy.get(cesc("#\\/z")).should("have.text", `(${counter})z`);
                cy.get(cesc("#\\/pz")).should(
                    "have.text",
                    `z: ${counter}, equation (${counter})`,
                );
                cy.get(cesc("#\\/etz")).should("have.text", `${counter}`);
                cy.get(cesc("#\\/rz")).should("have.text", `(${counter})`);
                cy.get(cesc("#\\/rz")).click();
                cy.url().should("match", RegExp(cesc(`#\\/z`) + "$"));
                cy.get(cesc("#\\/z")).then((el) => {
                    let rect = el[0].getBoundingClientRect();
                    expect(rect.top).gt(-1).lt(5);
                });
            });
        }

        checkEquationNumbering(2, 1);

        cy.get(cesc("#\\/m") + " textarea").type(`{end}{backspace}4{enter}`, {
            force: true,
        });
        cy.get(cesc("#\\/ma")).should("contain.text", "4");
        checkEquationNumbering(4, 1);

        cy.get(cesc("#\\/n") + " textarea").type(`{end}{backspace}2{enter}`, {
            force: true,
        });
        cy.get(cesc("#\\/na")).should("contain.text", "2");
        checkEquationNumbering(4, 2);

        cy.get(cesc("#\\/m") + " textarea").type(`{end}{backspace}0{enter}`, {
            force: true,
        });
        cy.get(cesc("#\\/ma")).should("contain.text", "0");
        checkEquationNumbering(0, 2);

        cy.get(cesc("#\\/n") + " textarea").type(`{end}{backspace}6{enter}`, {
            force: true,
        });
        cy.get(cesc("#\\/na")).should("contain.text", "6");
        checkEquationNumbering(0, 6);

        cy.get(cesc("#\\/m") + " textarea").type(`{end}{backspace}3{enter}`, {
            force: true,
        });
        cy.get(cesc("#\\/ma")).should("contain.text", "3");
        checkEquationNumbering(3, 6);

        cy.get(cesc("#\\/n") + " textarea").type(`{end}{backspace}1{enter}`, {
            force: true,
        });
        cy.get(cesc("#\\/na")).should("contain.text", "1");
        checkEquationNumbering(3, 1);
    });
});
