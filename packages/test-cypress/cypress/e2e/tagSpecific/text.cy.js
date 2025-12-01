import { cesc } from "@doenet/utils";

describe("Text Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("color text via style", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <setup>
        <styleDefinition styleNumber="2" textColor="green" />
        <styleDefinition styleNumber="3" textColor="red" backgroundColor="blue" />
    </setup>

    <p>Style number: <mathInput prefill="1" name="sn" /></p>

    <p><text name="no_style">One</text> is <text name="tsd_no_style">$no_style.textStyleDescription</text>, i.e., the text color is <text name="tc_no_style">$no_style.textColor</text> and the background color is <text name="bc_no_style">$no_style.backgroundColor</text>.</p>
    <p><text name="fixed_style" stylenumber="2">Two</text> is <text name="tsd_fixed_style">$fixed_style.textStyleDescription</text>, i.e., the text color is <text name="tc_fixed_style">$fixed_style.textColor</text> and the background color is <text name="bc_fixed_style">$fixed_style.backgroundColor</text>.</p>
    <p><text name="variable_style" stylenumber="$sn">Three</text> is <text name="tsd_variable_style">$variable_style.textStyleDescription</text>, i.e., the text color is <text name="tc_variable_style">$variable_style.textColor</text> and the background color is <text name="bc_variable_style">$variable_style.backgroundColor</text>.</p>

    <graph>
      <text extend="$no_style" anchor="(1,2)" />
      <text extend="$fixed_style" anchor="(3,4)" />
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

    it("text copied by plain macro, but not value, reflects style and anchor position", () => {
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
      <text styleNumber="2" name="t1">One</text>
      <text styleNumber="3" anchor="(3,4)" name="t2" >Two</text>
    </graph>

    <coords extend="$t1.anchor" name="t1coords" />
    <coords extend="$t2.anchor" name="t2coords" />

    <graph name="g2">
      $t1
      $t2
    </graph>

    <collect componentType="text" from="$g2" name="col1" />
    <math extend="$col1[1].anchor" name="t1acoords" />
    <math extend="$col1[2].anchor" name="t2acoords" />

    <graph name="g3">
      $t1.value
      $t2.value
    </graph>

    <collect componentType="text" from="$g3" name="col2" />
    <math extend="$col2[1].anchor" name="t1bcoords" />
    <math extend="$col2[2].anchor" name="t2bcoords" />

    <p name="p1">$t1 $t2</p>

    <p name="p2">$t1.value $t2.value</p>

    `,
                },
                "*",
            );
        });

        cy.get(cesc("#a")).should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let t1aName =
                stateVariables[await win.resolvePath1("g2")].activeChildren[0]
                    .componentIdx;
            let t2aName =
                stateVariables[await win.resolvePath1("g2")].activeChildren[1]
                    .componentIdx;
            let t1bName =
                stateVariables[await win.resolvePath1("g3")].activeChildren[0]
                    .componentIdx;
            let t2bName =
                stateVariables[await win.resolvePath1("g3")].activeChildren[1]
                    .componentIdx;
            let t1cName =
                stateVariables[await win.resolvePath1("p1")].activeChildren[0]
                    .componentIdx;
            let t2cName =
                stateVariables[await win.resolvePath1("p1")].activeChildren[2]
                    .componentIdx;
            let t1dName =
                stateVariables[await win.resolvePath1("p2")].activeChildren[0]
                    .componentIdx;
            let t2dName =
                stateVariables[await win.resolvePath1("p2")].activeChildren[2]
                    .componentIdx;

            let t1cAnchor = "#" + t1cName;
            let t2cAnchor = "#" + t2cName;
            let t1dAnchor = "#" + t1dName;
            let t2dAnchor = "#" + t2dName;

            cy.get(t1cAnchor).should("have.text", "One");
            cy.get(t1dAnchor).should("have.text", "One");
            cy.get(t2cAnchor).should("have.text", "Two");
            cy.get(t2dAnchor).should("have.text", "Two");

            cy.get(t1cAnchor).should("have.css", "color", "rgb(0, 128, 0)");
            cy.get(t1dAnchor).should("have.css", "color", "rgb(0, 0, 0)");
            cy.get(t2cAnchor).should("have.css", "color", "rgb(255, 0, 0)");
            cy.get(t2dAnchor).should("have.css", "color", "rgb(0, 0, 0)");

            cy.get(cesc("#t1coords")).should("have.text", "(0,0)");
            cy.get(cesc("#t2coords")).should("have.text", "(3,4)");
            cy.get(cesc("#t1acoords")).should("have.text", "(0,0)");
            cy.get(cesc("#t2acoords")).should("have.text", "(3,4)");
            cy.get(cesc("#t1bcoords")).should("have.text", "(0,0)");
            cy.get(cesc("#t2bcoords")).should("have.text", "(0,0)");

            cy.log("move first texts");
            cy.window().then(async (win) => {
                win.callAction1({
                    actionName: "moveText",
                    componentIdx: await win.resolvePath1("t1"),
                    args: { x: -2, y: 3 },
                });
                win.callAction1({
                    actionName: "moveText",
                    componentIdx: await win.resolvePath1("t2"),
                    args: { x: 4, y: -5 },
                });
            });

            cy.get(cesc("#t2coords")).should("contain.text", "(4,−5)");

            cy.get(cesc("#t1coords")).should("have.text", "(−2,3)");
            cy.get(cesc("#t2coords")).should("have.text", "(4,−5)");
            cy.get(cesc("#t1acoords")).should("have.text", "(−2,3)");
            cy.get(cesc("#t2acoords")).should("have.text", "(4,−5)");
            cy.get(cesc("#t1bcoords")).should("have.text", "(0,0)");
            cy.get(cesc("#t2bcoords")).should("have.text", "(0,0)");

            cy.log("move second texts");
            cy.window().then(async (win) => {
                win.callAction1({
                    actionName: "moveText",
                    componentIdx: t1aName,
                    args: { x: 7, y: 1 },
                });
                win.callAction1({
                    actionName: "moveText",
                    componentIdx: t2aName,
                    args: { x: -8, y: 2 },
                });
            });

            cy.get(cesc("#t2coords")).should("contain.text", "(−8,2)");

            cy.get(cesc("#t1coords")).should("have.text", "(7,1)");
            cy.get(cesc("#t2coords")).should("have.text", "(−8,2)");
            cy.get(cesc("#t1acoords")).should("have.text", "(7,1)");
            cy.get(cesc("#t2acoords")).should("have.text", "(−8,2)");
            cy.get(cesc("#t1bcoords")).should("have.text", "(0,0)");
            cy.get(cesc("#t2bcoords")).should("have.text", "(0,0)");

            cy.log("move third texts");
            cy.window().then(async (win) => {
                win.callAction1({
                    actionName: "moveText",
                    componentIdx: t1bName,
                    args: { x: -6, y: 3 },
                });
                win.callAction1({
                    actionName: "moveText",
                    componentIdx: t2bName,
                    args: { x: -5, y: -4 },
                });
            });

            cy.get(cesc("#t2bcoords")).should("contain.text", "(−5,−4)");

            cy.get(cesc("#t1coords")).should("have.text", "(7,1)");
            cy.get(cesc("#t2coords")).should("have.text", "(−8,2)");
            cy.get(cesc("#t1acoords")).should("have.text", "(7,1)");
            cy.get(cesc("#t2acoords")).should("have.text", "(−8,2)");
            cy.get(cesc("#t1bcoords")).should("have.text", "(−6,3)");
            cy.get(cesc("#t2bcoords")).should("have.text", "(−5,−4)");
        });
    });
});
