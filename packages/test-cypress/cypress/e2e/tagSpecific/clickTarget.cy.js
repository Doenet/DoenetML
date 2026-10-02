describe("Click target tests", { tags: ["@group4"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("click a text in a paragraph, and tab to it", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><updateValue name="before" target="$m" newValue="$m+1"><label>Before</label></updateValue> <number name="m">0</number></p>
    <p>Click <text name="t">here</text> or <text name="t2">there</text>.</p>
    <p>Count: <number name="n">0</number></p>
    <updateValue target="$n" newValue="$n+1" triggerWhenObjectsClicked="$t" hide />
    `,
                },
                "*",
            );
        });

        cy.get("#t")
            .parent()
            .should("match", "button.doenet-click-target")
            .and("have.attr", "type", "button");
        cy.get("#t2").parent().should("not.match", "button");

        cy.get("#t").click();
        cy.get("#n").should("have.text", "1");

        cy.log(
            "Tab from the button before it lands on the text's native button, which the browser activates with Enter and Space",
        );
        cy.get("#before_button").focus().tab();
        cy.focused()
            .should("match", 'button.doenet-click-target[type="button"]')
            .find("#t")
            .should("exist");

        cy.log("Clicking the other text does nothing");
        cy.get("#t2").click();
        cy.get("#n").should("have.text", "1");
    });

    it("no button for a fixed target or a text without a listener", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><text name="fixedT" fixed>fixed</text> <text name="plain">plain</text> <text name="other">other</text></p>
    <p>Count: <number name="n">0</number></p>
    <updateValue target="$n" newValue="$n+1" triggerWhenObjectsClicked="$fixedT" triggerWith="$plain" hide />
    `,
                },
                "*",
            );
        });

        cy.get("#n").should("have.text", "0");
        cy.get("#fixedT").parent().should("not.match", "button");
        cy.get("#plain").parent().should("not.match", "button");
        cy.get("#other").parent().should("not.match", "button");
        cy.get("button.doenet-click-target").should("not.exist");
    });

    it("a click target inside another control stays plain", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><updateValue name="uv" target="$m" newValue="$m+10"><label><text name="inButton">ten</text></label></updateValue></p>
    <p><ref name="r" to="https://www.doenet.org"><text name="inRef">link</text></ref></p>
    <choiceInput name="ci">
      <choice><text name="inChoice">cat</text></choice>
      <choice>dog</choice>
    </choiceInput>
    <p>Count: <number name="n">0</number>, <number name="m">0</number></p>
    <updateValue target="$n" newValue="$n+1" triggerWhenObjectsClicked="$inButton $inRef $inChoice" hide />
    `,
                },
                "*",
            );
        });

        cy.get("#inButton").should("have.text", "ten");
        cy.get("#inRef").should("have.text", "link");
        cy.get("#inChoice").should("have.text", "cat");
        cy.get("button.doenet-click-target").should("not.exist");

        cy.log("The button and the choice keep working");
        cy.get("#uv_button").click();
        cy.get("#m").should("have.text", "10");

        cy.get("#inChoice").click();
        cy.get("#ci_choice1_input").should("be.checked");
        cy.get("#n").should("have.text", "0");
    });

    it("number, label, image, and a reference to a text", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <setup><text name="t">copied</text></setup>
    <p><number name="num">5</number> <label name="lab">a label</label> <span name="s">$t</span></p>
    <image name="img" source="./Doenet_Logo_Frontpage.png" width="100px"><shortDescription>The Doenet logo</shortDescription></image>
    <p>Count: <number name="n">0</number></p>
    <updateValue target="$n" newValue="$n+1" triggerWhenObjectsClicked="$num $lab $img $t" hide />
    `,
                },
                "*",
            );
        });

        cy.get("#num").parent().should("match", "button.doenet-click-target");
        cy.get("#num").click();
        cy.get("#n").should("have.text", "1");

        cy.get("#lab").parent().should("match", "button.doenet-click-target");
        cy.get("#lab").click();
        cy.get("#n").should("have.text", "2");

        cy.get("#img")
            .parent()
            .should("match", "button.doenet-click-target")
            .and("have.class", "doenet-click-target--block");
        cy.get("#img").click();
        cy.get("#n").should("have.text", "3");

        cy.get("#s button.doenet-click-target").should("have.text", "copied");
        cy.get("#s button.doenet-click-target").click();
        cy.get("#n").should("have.text", "4");
    });

    it("click targets pass accessibility checks", () => {
        cy.injectAxe();
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p>Click <text name="t">here</text>, <number name="num">5</number>, or the image.</p>
    <image name="img" source="./Doenet_Logo_Frontpage.png" width="100px"><shortDescription>The Doenet logo</shortDescription></image>
    <p>Count: <number name="n">0</number></p>
    <updateValue target="$n" newValue="$n+1" triggerWhenObjectsClicked="$t $num $img" hide />
    `,
                },
                "*",
            );
        });

        cy.get("#t").parent().should("match", "button.doenet-click-target");
        cy.get("#img").should("be.visible");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });
});
