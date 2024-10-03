import { cesc, cesc2 } from "@doenet/utils";

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
      <styleDefinitions>
        <styleDefinition styleNumber="2" textColor="green" />
        <styleDefinition styleNumber="3" textColor="red" backgroundColor="blue" />
      </styleDefinitions>
    </setup>

    <p>Style number: <mathinput prefill="1" name="sn" /></p>

    <p><text name="no_style">One</text> is <text name="tsd_no_style">$no_style.textStyleDescription</text>, i.e., the text color is <text name="tc_no_style">$no_style.textColor</text> and the background color is <text name="bc_no_style">$no_style.backgroundColor</text>.</p>
    <p><text name="fixed_style" stylenumber="2">Two</text> is <text name="tsd_fixed_style">$fixed_style.textStyleDescription</text>, i.e., the text color is <text name="tc_fixed_style">$fixed_style.textColor</text> and the background color is <text name="bc_fixed_style">$fixed_style.backgroundColor</text>.</p>
    <p><text name="variable_style" stylenumber="$sn">Three</text> is <text name="tsd_variable_style">$variable_style.textStyleDescription</text>, i.e., the text color is <text name="tc_variable_style">$variable_style.textColor</text> and the background color is <text name="bc_variable_style">$variable_style.backgroundColor</text>.</p>

    <graph>
      $no_style{anchor="(1,2)"}
      $fixed_style{anchor="(3,4)"}
      $variable_style
    </graph>

    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/tsd_no_style")).should("have.text", "black");
        cy.get(cesc("#\\/tc_no_style")).should("have.text", "black");
        cy.get(cesc("#\\/bc_no_style")).should("have.text", "none");

        cy.get(cesc("#\\/tsd_fixed_style")).should("have.text", "green");
        cy.get(cesc("#\\/tc_fixed_style")).should("have.text", "green");
        cy.get(cesc("#\\/bc_fixed_style")).should("have.text", "none");

        cy.get(cesc("#\\/tsd_variable_style")).should("have.text", "black");
        cy.get(cesc("#\\/tc_variable_style")).should("have.text", "black");
        cy.get(cesc("#\\/bc_variable_style")).should("have.text", "none");

        cy.get(cesc("#\\/no_style")).should(
            "have.css",
            "color",
            "rgb(0, 0, 0)",
        );
        cy.get(cesc("#\\/no_style")).should(
            "have.css",
            "background-color",
            "rgba(0, 0, 0, 0)",
        );

        cy.get(cesc("#\\/fixed_style")).should(
            "have.css",
            "color",
            "rgb(0, 128, 0)",
        );
        cy.get(cesc("#\\/fixed_style")).should(
            "have.css",
            "background-color",
            "rgba(0, 0, 0, 0)",
        );

        cy.get(cesc("#\\/variable_style")).should(
            "have.css",
            "color",
            "rgb(0, 0, 0)",
        );
        cy.get(cesc("#\\/variable_style")).should(
            "have.css",
            "background-color",
            "rgba(0, 0, 0, 0)",
        );

        // TODO: how to test color in graph

        cy.get(cesc("#\\/sn") + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });

        cy.get(cesc("#\\/tsd_variable_style")).should("have.text", "green");
        cy.get(cesc("#\\/tc_variable_style")).should("have.text", "green");
        cy.get(cesc("#\\/bc_variable_style")).should("have.text", "none");

        cy.get(cesc("#\\/tsd_no_style")).should("have.text", "black");
        cy.get(cesc("#\\/tc_no_style")).should("have.text", "black");
        cy.get(cesc("#\\/bc_no_style")).should("have.text", "none");

        cy.get(cesc("#\\/tsd_fixed_style")).should("have.text", "green");
        cy.get(cesc("#\\/tc_fixed_style")).should("have.text", "green");
        cy.get(cesc("#\\/bc_fixed_style")).should("have.text", "none");

        cy.get(cesc("#\\/no_style")).should(
            "have.css",
            "color",
            "rgb(0, 0, 0)",
        );
        cy.get(cesc("#\\/no_style")).should(
            "have.css",
            "background-color",
            "rgba(0, 0, 0, 0)",
        );

        cy.get(cesc("#\\/fixed_style")).should(
            "have.css",
            "color",
            "rgb(0, 128, 0)",
        );
        cy.get(cesc("#\\/fixed_style")).should(
            "have.css",
            "background-color",
            "rgba(0, 0, 0, 0)",
        );

        cy.get(cesc("#\\/variable_style")).should(
            "have.css",
            "color",
            "rgb(0, 128, 0)",
        );
        cy.get(cesc("#\\/variable_style")).should(
            "have.css",
            "background-color",
            "rgba(0, 0, 0, 0)",
        );

        cy.get(cesc("#\\/sn") + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });

        cy.get(cesc("#\\/tsd_variable_style")).should(
            "have.text",
            "red with a blue background",
        );
        cy.get(cesc("#\\/tc_variable_style")).should("have.text", "red");
        cy.get(cesc("#\\/bc_variable_style")).should("have.text", "blue");

        cy.get(cesc("#\\/tsd_no_style")).should("have.text", "black");
        cy.get(cesc("#\\/tc_no_style")).should("have.text", "black");
        cy.get(cesc("#\\/bc_no_style")).should("have.text", "none");

        cy.get(cesc("#\\/tsd_fixed_style")).should("have.text", "green");
        cy.get(cesc("#\\/tc_fixed_style")).should("have.text", "green");
        cy.get(cesc("#\\/bc_fixed_style")).should("have.text", "none");

        cy.get(cesc("#\\/no_style")).should(
            "have.css",
            "color",
            "rgb(0, 0, 0)",
        );
        cy.get(cesc("#\\/no_style")).should(
            "have.css",
            "background-color",
            "rgba(0, 0, 0, 0)",
        );

        cy.get(cesc("#\\/fixed_style")).should(
            "have.css",
            "color",
            "rgb(0, 128, 0)",
        );
        cy.get(cesc("#\\/fixed_style")).should(
            "have.css",
            "background-color",
            "rgba(0, 0, 0, 0)",
        );

        cy.get(cesc("#\\/variable_style")).should(
            "have.css",
            "color",
            "rgb(255, 0, 0)",
        );
        cy.get(cesc("#\\/variable_style")).should(
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
      <styleDefinitions>
        <styleDefinition styleNumber="2" textColor="green" />
        <styleDefinition styleNumber="3" textColor="red" />
      </styleDefinitions>
    </setup>

    <text>a</text>

    <graph name="g1">
      <text styleNumber="2" name="t1">One</text>
      <text styleNumber="3" anchor="(3,4)" name="t2" >Two</text>
    </graph>

    <coords copySource="t1.anchor" name="t1coords" />
    <coords copySource="t2.anchor" name="t2coords" />

    <graph name="g2">
      $t1
      $t2
    </graph>

    <collect componentTypes="text" source="g2" prop="anchor" assignNames="t1acoords t2acoords" />

    <graph name="g3">
      $t1.value
      $t2.value
    </graph>

    <collect componentTypes="text" source="g3" prop="anchor" assignNames="t1bcoords t2bcoords" />

    <p name="p1">$t1 $t2</p>

    <p name="p2">$t1.value $t2.value</p>

    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait until loaded

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let t1aName = stateVariables["/g2"].activeChildren[0].componentName;
            let t2aName = stateVariables["/g2"].activeChildren[1].componentName;
            let t1bName = stateVariables["/g3"].activeChildren[0].componentName;
            let t2bName = stateVariables["/g3"].activeChildren[1].componentName;
            let t1cName = stateVariables["/p1"].activeChildren[0].componentName;
            let t2cName = stateVariables["/p1"].activeChildren[2].componentName;
            let t1dName = stateVariables["/p2"].activeChildren[0].componentName;
            let t2dName = stateVariables["/p2"].activeChildren[2].componentName;

            let t1cAnchor = "#" + cesc2(t1cName);
            let t2cAnchor = "#" + cesc2(t2cName);
            let t1dAnchor = "#" + cesc2(t1dName);
            let t2dAnchor = "#" + cesc2(t2dName);

            cy.get(t1cAnchor).should("have.text", "One");
            cy.get(t1dAnchor).should("have.text", "One");
            cy.get(t2cAnchor).should("have.text", "Two");
            cy.get(t2dAnchor).should("have.text", "Two");

            cy.get(t1cAnchor).should("have.css", "color", "rgb(0, 128, 0)");
            cy.get(t1dAnchor).should("have.css", "color", "rgb(0, 0, 0)");
            cy.get(t2cAnchor).should("have.css", "color", "rgb(255, 0, 0)");
            cy.get(t2dAnchor).should("have.css", "color", "rgb(0, 0, 0)");

            cy.get(cesc("#\\/t1coords") + " .mjx-mrow")
                .eq(0)
                .should("have.text", "(0,0)");
            cy.get(cesc("#\\/t2coords") + " .mjx-mrow")
                .eq(0)
                .should("have.text", "(3,4)");
            cy.get(cesc("#\\/t1acoords") + " .mjx-mrow")
                .eq(0)
                .should("have.text", "(0,0)");
            cy.get(cesc("#\\/t2acoords") + " .mjx-mrow")
                .eq(0)
                .should("have.text", "(3,4)");
            cy.get(cesc("#\\/t1bcoords") + " .mjx-mrow")
                .eq(0)
                .should("have.text", "(0,0)");
            cy.get(cesc("#\\/t2bcoords") + " .mjx-mrow")
                .eq(0)
                .should("have.text", "(0,0)");

            cy.log("move first texts");
            cy.window().then(async (win) => {
                win.callAction1({
                    actionName: "moveText",
                    componentName: "/t1",
                    args: { x: -2, y: 3 },
                });
                win.callAction1({
                    actionName: "moveText",
                    componentName: "/t2",
                    args: { x: 4, y: -5 },
                });
            });

            cy.get(cesc("#\\/t2coords") + " .mjx-mrow").should(
                "contain.text",
                "(4,−5)",
            );

            cy.get(cesc("#\\/t1coords") + " .mjx-mrow")
                .eq(0)
                .should("have.text", "(−2,3)");
            cy.get(cesc("#\\/t2coords") + " .mjx-mrow")
                .eq(0)
                .should("have.text", "(4,−5)");
            cy.get(cesc("#\\/t1acoords") + " .mjx-mrow")
                .eq(0)
                .should("have.text", "(−2,3)");
            cy.get(cesc("#\\/t2acoords") + " .mjx-mrow")
                .eq(0)
                .should("have.text", "(4,−5)");
            cy.get(cesc("#\\/t1bcoords") + " .mjx-mrow")
                .eq(0)
                .should("have.text", "(0,0)");
            cy.get(cesc("#\\/t2bcoords") + " .mjx-mrow")
                .eq(0)
                .should("have.text", "(0,0)");

            cy.log("move second texts");
            cy.window().then(async (win) => {
                win.callAction1({
                    actionName: "moveText",
                    componentName: t1aName,
                    args: { x: 7, y: 1 },
                });
                win.callAction1({
                    actionName: "moveText",
                    componentName: t2aName,
                    args: { x: -8, y: 2 },
                });
            });

            cy.get(cesc("#\\/t2coords") + " .mjx-mrow").should(
                "contain.text",
                "(−8,2)",
            );

            cy.get(cesc("#\\/t1coords") + " .mjx-mrow")
                .eq(0)
                .should("have.text", "(7,1)");
            cy.get(cesc("#\\/t2coords") + " .mjx-mrow")
                .eq(0)
                .should("have.text", "(−8,2)");
            cy.get(cesc("#\\/t1acoords") + " .mjx-mrow")
                .eq(0)
                .should("have.text", "(7,1)");
            cy.get(cesc("#\\/t2acoords") + " .mjx-mrow")
                .eq(0)
                .should("have.text", "(−8,2)");
            cy.get(cesc("#\\/t1bcoords") + " .mjx-mrow")
                .eq(0)
                .should("have.text", "(0,0)");
            cy.get(cesc("#\\/t2bcoords") + " .mjx-mrow")
                .eq(0)
                .should("have.text", "(0,0)");

            cy.log("move third texts");
            cy.window().then(async (win) => {
                win.callAction1({
                    actionName: "moveText",
                    componentName: t1bName,
                    args: { x: -6, y: 3 },
                });
                win.callAction1({
                    actionName: "moveText",
                    componentName: t2bName,
                    args: { x: -5, y: -4 },
                });
            });

            cy.get(cesc("#\\/t2bcoords") + " .mjx-mrow").should(
                "contain.text",
                "(−5,−4)",
            );

            cy.get(cesc("#\\/t1coords") + " .mjx-mrow")
                .eq(0)
                .should("have.text", "(7,1)");
            cy.get(cesc("#\\/t2coords") + " .mjx-mrow")
                .eq(0)
                .should("have.text", "(−8,2)");
            cy.get(cesc("#\\/t1acoords") + " .mjx-mrow")
                .eq(0)
                .should("have.text", "(7,1)");
            cy.get(cesc("#\\/t2acoords") + " .mjx-mrow")
                .eq(0)
                .should("have.text", "(−8,2)");
            cy.get(cesc("#\\/t1bcoords") + " .mjx-mrow")
                .eq(0)
                .should("have.text", "(−6,3)");
            cy.get(cesc("#\\/t2bcoords") + " .mjx-mrow")
                .eq(0)
                .should("have.text", "(−5,−4)");
        });
    });
});
