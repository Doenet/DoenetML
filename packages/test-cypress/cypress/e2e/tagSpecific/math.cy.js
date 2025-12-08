import { cesc } from "@doenet/utils";
import { toMathJaxString } from "../../../src/util/mathDisplay";

describe("Math Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    // show hidden math doesn't appear in DOM?

    it("changes are reloaded correctly.", () => {
        let doenetML = `
    <p><math name="m1">w</math></p>
    <p><math name="m2">x + <math name="m3">y</math></math></p>
    <p><math name="m4">z</math></p>
    <p><math name="m5">a+$m4</math></p>
    <p><mathInput name="mi1" bindValueTo="$m1" /></p>
    <p><mathInput name="mi2" bindValueTo="$m2" /></p>
    <p><mathInput name="mi3" bindValueTo="$m3" /></p>
    <p><mathInput name="mi4" bindValueTo="$m4" /></p>
    <p><mathInput name="mi5" bindValueTo="$m5" /></p>
    `;

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#m1")).should("have.text", toMathJaxString("w"));
        cy.get(cesc("#m2")).should("have.text", toMathJaxString("x+y"));
        cy.get(cesc("#m4")).should("have.text", toMathJaxString("z"));
        cy.get(cesc("#m5")).should("have.text", toMathJaxString("a+z"));

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("m1")].stateValues.value,
            ).eqls("w");
            expect(
                stateVariables[await win.resolvePath1("m2")].stateValues.value,
            ).eqls(["+", "x", "y"]);
            expect(
                stateVariables[await win.resolvePath1("m3")].stateValues.value,
            ).eqls("y");
            expect(
                stateVariables[await win.resolvePath1("m4")].stateValues.value,
            ).eqls("z");
            expect(
                stateVariables[await win.resolvePath1("m5")].stateValues.value,
            ).eqls(["+", "a", "z"]);
        });

        cy.get(cesc("#mi1") + " textarea").type("{end}{backspace}1{enter}", {
            force: true,
        });
        cy.get(cesc("#mi2") + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get(cesc("#mi4") + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });

        cy.get(cesc("#m4")).should("contain.text", "3");

        cy.get(cesc("#m1")).should("have.text", toMathJaxString("1"));
        cy.get(cesc("#m2")).should("have.text", toMathJaxString("x+2"));
        cy.get(cesc("#m4")).should("have.text", toMathJaxString("3"));
        cy.get(cesc("#m5")).should("have.text", toMathJaxString("a+3"));

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("m1")].stateValues.value,
            ).eqls(1);
            expect(
                stateVariables[await win.resolvePath1("m2")].stateValues.value,
            ).eqls(["+", "x", 2]);
            expect(
                stateVariables[await win.resolvePath1("m3")].stateValues.value,
            ).eqls(2);
            expect(
                stateVariables[await win.resolvePath1("m4")].stateValues.value,
            ).eqls(3);
            expect(
                stateVariables[await win.resolvePath1("m5")].stateValues.value,
            ).eqls(["+", "a", 3]);
        });

        cy.wait(1500); // wait for debounce

        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#m1")).should("have.text", "1");

        // wait until core is loaded
        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return stateVariables[await win.resolvePath1("1")];
            }),
        );

        cy.get(cesc("#m1")).should("have.text", toMathJaxString("1"));
        cy.get(cesc("#m2")).should("have.text", toMathJaxString("x+2"));
        cy.get(cesc("#m4")).should("have.text", toMathJaxString("3"));
        cy.get(cesc("#m5")).should("have.text", toMathJaxString("a+3"));

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("m1")].stateValues.value,
            ).eqls(1);
            expect(
                stateVariables[await win.resolvePath1("m2")].stateValues.value,
            ).eqls(["+", "x", 2]);
            expect(
                stateVariables[await win.resolvePath1("m3")].stateValues.value,
            ).eqls(2);
            expect(
                stateVariables[await win.resolvePath1("m4")].stateValues.value,
            ).eqls(3);
            expect(
                stateVariables[await win.resolvePath1("m5")].stateValues.value,
            ).eqls(["+", "a", 3]);
        });

        cy.get(cesc("#mi1") + " textarea").type("{end}{backspace}4+5{enter}", {
            force: true,
        });
        cy.get(cesc("#mi3") + " textarea").type("{end}{backspace}6+7{enter}", {
            force: true,
        });
        cy.get(cesc("#mi5") + " textarea").type("{end}{backspace}8+9{enter}", {
            force: true,
        });

        cy.get(cesc("#m5")).should("contain.text", "17");

        cy.get(cesc("#m1")).should("have.text", toMathJaxString("4+5"));
        cy.get(cesc("#m2")).should("have.text", toMathJaxString("x+6+7"));
        cy.get(cesc("#m4")).should("have.text", toMathJaxString("17"));
        cy.get(cesc("#m5")).should("have.text", toMathJaxString("a+17"));

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("m1")].stateValues.value,
            ).eqls(["+", 4, 5]);
            expect(
                stateVariables[await win.resolvePath1("m2")].stateValues.value,
            ).eqls(["+", "x", 6, 7]);
            expect(
                stateVariables[await win.resolvePath1("m3")].stateValues.value,
            ).eqls(["+", 6, 7]);
            expect(
                stateVariables[await win.resolvePath1("m4")].stateValues.value,
            ).eqls(17);
            expect(
                stateVariables[await win.resolvePath1("m5")].stateValues.value,
            ).eqls(["+", "a", 17]);
        });

        cy.wait(1500); // wait for debounce

        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#m1")).should("have.text", toMathJaxString("4+5"));

        // wait until core is loaded
        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return stateVariables[await win.resolvePath1("1")];
            }),
        );

        cy.get(cesc("#m1")).should("have.text", toMathJaxString("4+5"));
        cy.get(cesc("#m2")).should("have.text", toMathJaxString("x+6+7"));
        cy.get(cesc("#m4")).should("have.text", toMathJaxString("17"));
        cy.get(cesc("#m5")).should("have.text", toMathJaxString("a+17"));

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("m1")].stateValues.value,
            ).eqls(["+", 4, 5]);
            expect(
                stateVariables[await win.resolvePath1("m2")].stateValues.value,
            ).eqls(["+", "x", 6, 7]);
            expect(
                stateVariables[await win.resolvePath1("m3")].stateValues.value,
            ).eqls(["+", 6, 7]);
            expect(
                stateVariables[await win.resolvePath1("m4")].stateValues.value,
            ).eqls(17);
            expect(
                stateVariables[await win.resolvePath1("m5")].stateValues.value,
            ).eqls(["+", "a", 17]);
        });
    });

    it("color math via style", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <setup>
        <styleDefinition styleNumber="2" textColor="green" />
        <styleDefinition styleNumber="3" textColor="red" backgroundColor="blue" />
    </setup>

    <p>Style number: <mathInput prefill="1" name="sn" /></p>

    <p><math name="no_style">x^2</math> is <text name="tsd_no_style">$no_style.textStyleDescription</text>, i.e., the text color is <text name="tc_no_style">$no_style.textColor</text> and the background color is <text name="bc_no_style">$no_style.backgroundColor</text>.</p>
    <p><math name="fixed_style" stylenumber="2">x^3</math> is <text name="tsd_fixed_style">$fixed_style.textStyleDescription</text>, i.e., the text color is <text name="tc_fixed_style">$fixed_style.textColor</text> and the background color is <text name="bc_fixed_style">$fixed_style.backgroundColor</text>.</p>
    <p><math name="variable_style" stylenumber="$sn">x^4</math> is <text name="tsd_variable_style">$variable_style.textStyleDescription</text>, i.e., the text color is <text name="tc_variable_style">$variable_style.textColor</text> and the background color is <text name="bc_variable_style">$variable_style.backgroundColor</text>.</p>

    <graph>
      <math extend="$no_style" anchor="(1,2)"/>
      <math extend="$fixed_style" anchor="(3,4)"/>
      $variable_style
    </graph>

    `,
                },
                "*",
            );
        });

        cy.get(cesc("#tsd_no_style")).should("have.text", "black");
        cy.get(cesc("#tc_no_style")).should("have.text", "black");
        cy.get(cesc("#bc_no_style")).should("have.text", "none");

        cy.get(cesc("#tsd_fixed_style")).should("have.text", "green");
        cy.get(cesc("#tc_fixed_style")).should("have.text", "green");
        cy.get(cesc("#bc_fixed_style")).should("have.text", "none");

        cy.get(cesc("#tsd_variable_style")).should("have.text", "black");
        cy.get(cesc("#tc_variable_style")).should("have.text", "black");
        cy.get(cesc("#bc_variable_style")).should("have.text", "none");

        cy.get(cesc("#no_style")).should("have.css", "color", "rgb(0, 0, 0)");
        cy.get(cesc("#no_style")).should(
            "have.css",
            "background-color",
            "rgba(0, 0, 0, 0)",
        );

        cy.get(cesc("#fixed_style")).should(
            "have.css",
            "color",
            "rgb(0, 128, 0)",
        );
        cy.get(cesc("#fixed_style")).should(
            "have.css",
            "background-color",
            "rgba(0, 0, 0, 0)",
        );

        cy.get(cesc("#variable_style")).should(
            "have.css",
            "color",
            "rgb(0, 0, 0)",
        );
        cy.get(cesc("#variable_style")).should(
            "have.css",
            "background-color",
            "rgba(0, 0, 0, 0)",
        );

        // TODO: how to test color in graph

        cy.get(cesc("#sn") + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });

        cy.get(cesc("#tsd_variable_style")).should("have.text", "green");
        cy.get(cesc("#tc_variable_style")).should("have.text", "green");
        cy.get(cesc("#bc_variable_style")).should("have.text", "none");

        cy.get(cesc("#tsd_no_style")).should("have.text", "black");
        cy.get(cesc("#tc_no_style")).should("have.text", "black");
        cy.get(cesc("#bc_no_style")).should("have.text", "none");

        cy.get(cesc("#tsd_fixed_style")).should("have.text", "green");
        cy.get(cesc("#tc_fixed_style")).should("have.text", "green");
        cy.get(cesc("#bc_fixed_style")).should("have.text", "none");

        cy.get(cesc("#no_style")).should("have.css", "color", "rgb(0, 0, 0)");
        cy.get(cesc("#no_style")).should(
            "have.css",
            "background-color",
            "rgba(0, 0, 0, 0)",
        );

        cy.get(cesc("#fixed_style")).should(
            "have.css",
            "color",
            "rgb(0, 128, 0)",
        );
        cy.get(cesc("#fixed_style")).should(
            "have.css",
            "background-color",
            "rgba(0, 0, 0, 0)",
        );

        cy.get(cesc("#variable_style")).should(
            "have.css",
            "color",
            "rgb(0, 128, 0)",
        );
        cy.get(cesc("#variable_style")).should(
            "have.css",
            "background-color",
            "rgba(0, 0, 0, 0)",
        );

        cy.get(cesc("#sn") + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });

        cy.get(cesc("#tsd_variable_style")).should(
            "have.text",
            "red with a blue background",
        );
        cy.get(cesc("#tc_variable_style")).should("have.text", "red");
        cy.get(cesc("#bc_variable_style")).should("have.text", "blue");

        cy.get(cesc("#tsd_no_style")).should("have.text", "black");
        cy.get(cesc("#tc_no_style")).should("have.text", "black");
        cy.get(cesc("#bc_no_style")).should("have.text", "none");

        cy.get(cesc("#tsd_fixed_style")).should("have.text", "green");
        cy.get(cesc("#tc_fixed_style")).should("have.text", "green");
        cy.get(cesc("#bc_fixed_style")).should("have.text", "none");

        cy.get(cesc("#no_style")).should("have.css", "color", "rgb(0, 0, 0)");
        cy.get(cesc("#no_style")).should(
            "have.css",
            "background-color",
            "rgba(0, 0, 0, 0)",
        );

        cy.get(cesc("#fixed_style")).should(
            "have.css",
            "color",
            "rgb(0, 128, 0)",
        );
        cy.get(cesc("#fixed_style")).should(
            "have.css",
            "background-color",
            "rgba(0, 0, 0, 0)",
        );

        cy.get(cesc("#variable_style")).should(
            "have.css",
            "color",
            "rgb(255, 0, 0)",
        );
        cy.get(cesc("#variable_style")).should(
            "have.css",
            "background-color",
            "rgb(0, 0, 255)",
        );
    });

    it("math copied by plain macro, but not value, reflects style and anchor position", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <setup>
        <styleDefinition styleNumber="2" textColor="green" />
        <styleDefinition styleNumber="3" textColor="red" />
    </setup>

    <text name="a">a</text>

    <graph name="g1">
      <math styleNumber="2" name="m1">x^2</math>
      <math styleNumber="3" anchor="(3,4)" name="m2" >x^3</math>
    </graph>

    <coords extend="$m1.anchor" name="m1coords" />
    <coords extend="$m2.anchor" name="m2coords" />

    <graph name="g2">
      $m1
      $m2
    </graph>

    <collect componentType="math" from="$g2" name="col1" />
    <math extend="$col1[1].anchor" name="m1acoords" />
    <math extend="$col1[2].anchor" name="m2acoords" />

    <graph name="g3">
      $m1.value
      $m2.value
    </graph>

    <collect componentType="math" from="$g3" name="col2" />
    <math extend="$col2[1].anchor" name="m1bcoords" />
    <math extend="$col2[2].anchor" name="m2bcoords" />

    <p name="p1">$m1 $m2</p>

    <p name="p2">$m1.value $m2.value</p>

    `,
                },
                "*",
            );
        });

        cy.get(cesc("#a")).should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let m1aName =
                stateVariables[await win.resolvePath1("g2")].activeChildren[0]
                    .componentIdx;
            let m2aName =
                stateVariables[await win.resolvePath1("g2")].activeChildren[1]
                    .componentIdx;
            let m1bName =
                stateVariables[await win.resolvePath1("g3")].activeChildren[0]
                    .componentIdx;
            let m2bName =
                stateVariables[await win.resolvePath1("g3")].activeChildren[1]
                    .componentIdx;
            let m1cName =
                stateVariables[await win.resolvePath1("p1")].activeChildren[0]
                    .componentIdx;
            let m2cName =
                stateVariables[await win.resolvePath1("p1")].activeChildren[2]
                    .componentIdx;
            let m1dName =
                stateVariables[await win.resolvePath1("p2")].activeChildren[0]
                    .componentIdx;
            let m2dName =
                stateVariables[await win.resolvePath1("p2")].activeChildren[2]
                    .componentIdx;

            let m1cAnchor = "#" + m1cName;
            let m2cAnchor = "#" + m2cName;
            let m1dAnchor = "#" + m1dName;
            let m2dAnchor = "#" + m2dName;

            cy.get(m1cAnchor).eq(0).should("have.text", toMathJaxString("x2"));
            cy.get(m1dAnchor).eq(0).should("have.text", toMathJaxString("x2"));
            cy.get(m2cAnchor).eq(0).should("have.text", toMathJaxString("x3"));
            cy.get(m2dAnchor).eq(0).should("have.text", toMathJaxString("x3"));

            cy.get(m1cAnchor).should("have.css", "color", "rgb(0, 128, 0)");
            cy.get(m1dAnchor).should("have.css", "color", "rgb(0, 0, 0)");
            cy.get(m2cAnchor).should("have.css", "color", "rgb(255, 0, 0)");
            cy.get(m2dAnchor).should("have.css", "color", "rgb(0, 0, 0)");

            cy.get(cesc("#m1coords")).eq(0).should("have.text", "(0,0)");
            cy.get(cesc("#m2coords")).eq(0).should("have.text", "(3,4)");
            cy.get(cesc("#m1acoords")).eq(0).should("have.text", "(0,0)");
            cy.get(cesc("#m2acoords")).eq(0).should("have.text", "(3,4)");
            cy.get(cesc("#m1bcoords")).eq(0).should("have.text", "(0,0)");
            cy.get(cesc("#m2bcoords")).eq(0).should("have.text", "(0,0)");

            cy.log("move first maths");
            cy.window().then(async (win) => {
                win.callAction1({
                    actionName: "moveMath",
                    componentIdx: await win.resolvePath1("m1"),
                    args: { x: -2, y: 3 },
                });
                win.callAction1({
                    actionName: "moveMath",
                    componentIdx: await win.resolvePath1("m2"),
                    args: { x: 4, y: -5 },
                });
            });

            cy.get(cesc("#m2coords")).should("contain.text", "(4,−5)");

            cy.get(cesc("#m1coords")).eq(0).should("have.text", "(−2,3)");
            cy.get(cesc("#m2coords")).eq(0).should("have.text", "(4,−5)");
            cy.get(cesc("#m1acoords")).eq(0).should("have.text", "(−2,3)");
            cy.get(cesc("#m2acoords")).eq(0).should("have.text", "(4,−5)");
            cy.get(cesc("#m1bcoords")).eq(0).should("have.text", "(0,0)");
            cy.get(cesc("#m2bcoords")).eq(0).should("have.text", "(0,0)");

            cy.log("move second maths");
            cy.window().then(async (win) => {
                win.callAction1({
                    actionName: "moveMath",
                    componentIdx: m1aName,
                    args: { x: 7, y: 1 },
                });
                win.callAction1({
                    actionName: "moveMath",
                    componentIdx: m2aName,
                    args: { x: -8, y: 2 },
                });
            });

            cy.get(cesc("#m2coords")).should("contain.text", "(−8,2)");

            cy.get(cesc("#m1coords")).eq(0).should("have.text", "(7,1)");
            cy.get(cesc("#m2coords")).eq(0).should("have.text", "(−8,2)");
            cy.get(cesc("#m1acoords")).eq(0).should("have.text", "(7,1)");
            cy.get(cesc("#m2acoords")).eq(0).should("have.text", "(−8,2)");
            cy.get(cesc("#m1bcoords")).eq(0).should("have.text", "(0,0)");
            cy.get(cesc("#m2bcoords")).eq(0).should("have.text", "(0,0)");

            cy.log("move third maths");
            cy.window().then(async (win) => {
                win.callAction1({
                    actionName: "moveMath",
                    componentIdx: m1bName,
                    args: { x: -6, y: 3 },
                });
                win.callAction1({
                    actionName: "moveMath",
                    componentIdx: m2bName,
                    args: { x: -5, y: -4 },
                });
            });

            cy.get(cesc("#m2bcoords")).should("contain.text", "(−5,−4)");

            cy.get(cesc("#m1coords")).eq(0).should("have.text", "(7,1)");
            cy.get(cesc("#m2coords")).eq(0).should("have.text", "(−8,2)");
            cy.get(cesc("#m1acoords")).eq(0).should("have.text", "(7,1)");
            cy.get(cesc("#m2acoords")).eq(0).should("have.text", "(−8,2)");
            cy.get(cesc("#m1bcoords")).eq(0).should("have.text", "(−6,3)");
            cy.get(cesc("#m2bcoords")).eq(0).should("have.text", "(−5,−4)");
        });
    });
});
