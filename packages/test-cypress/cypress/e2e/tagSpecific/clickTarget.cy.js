describe("Click target tests", { tags: ["@group4"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("click a text in a paragraph with the mouse and the keyboard", () => {
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
            .should("match", '.doenet-click-target[role="button"]')
            .and("have.attr", "tabindex", "0");
        cy.get("#t2").parent().should("not.match", '[role="button"]');

        cy.get("#t").click();
        cy.get("#n").should("have.text", "1");

        cy.log("Tab from the button before it lands on the text");
        cy.get("#before_button").focus().tab();
        cy.focused()
            .should("match", '.doenet-click-target[role="button"]')
            .find("#t")
            .should("exist");

        cy.focused().type("{enter}");
        cy.get("#n").should("have.text", "2");

        cy.log("Space activates the text and does not scroll the page");
        cy.window().then((win) => {
            win.addEventListener("keydown", (e) => {
                if (e.key === " ") {
                    win.spaceDefaultPrevented = e.defaultPrevented;
                }
            });
        });
        cy.focused().type(" ");
        cy.get("#n").should("have.text", "3");
        cy.window().its("spaceDefaultPrevented").should("eq", true);

        cy.log("Clicking the other text does nothing");
        cy.get("#t2").click();
        cy.get("#n").should("have.text", "3");
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
        cy.get("#fixedT").parent().should("not.match", '[role="button"]');
        cy.get("#plain").parent().should("not.match", '[role="button"]');
        cy.get("#other").parent().should("not.match", '[role="button"]');
        cy.get(".doenet-click-target").should("not.exist");
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
        cy.get(".doenet-click-target").should("not.exist");

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
    <p><number name="num">5</number> <label name="lab">a <m>x^2</m> label</label> <span name="s">$t</span></p>
    <image name="img" source="./Doenet_Logo_Frontpage.png" width="100px"><shortDescription>The Doenet logo</shortDescription></image>
    <p>Count: <number name="n">0</number></p>
    <updateValue target="$n" newValue="$n+1" triggerWhenObjectsClicked="$num $lab $img $t" hide />
    `,
                },
                "*",
            );
        });

        cy.get("#num")
            .parent()
            .should("match", '.doenet-click-target[role="button"]');
        cy.get("#num").click();
        cy.get("#n").should("have.text", "1");

        cy.get("#lab")
            .parent()
            .should("match", '.doenet-click-target[role="button"]');
        cy.log("Math in the label is underlined too");
        cy.get("#lab mjx-container").should(
            "have.css",
            "border-bottom-style",
            "dotted",
        );
        cy.get("#lab").click();
        cy.get("#n").should("have.text", "2");

        cy.get("#img")
            .parent()
            .should("match", '.doenet-click-target[role="button"]')
            .and("have.class", "doenet-click-target--block");
        cy.get("#img").click();
        cy.get("#n").should("have.text", "3");

        cy.get("#s .doenet-click-target").should("have.text", "copied");
        cy.get("#s .doenet-click-target").click();
        cy.get("#n").should("have.text", "4");
    });

    it("a long clickable phrase wraps with the text around it", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p name="p">Start <text name="t">a long clickable phrase that has to wrap across more than one line</text> end.</p>
    <number name="n">0</number>
    <updateValue target="$n" newValue="$n+1" triggerWhenObjectsClicked="$t" hide />
    `,
                },
                "*",
            );
        });

        cy.get("#p").invoke("css", "width", "150px");
        cy.get("#t")
            .parent()
            .should("match", '.doenet-click-target[role="button"]')
            .then(($button) => {
                const rects = $button[0].getClientRects();
                expect(rects.length).greaterThan(1);
                // The phrase starts on the same line as "Start".
                const pRect = $button[0].parentElement.getBoundingClientRect();
                expect(rects[0].left).greaterThan(pRect.left + 10);
            });
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

        cy.get("#t")
            .parent()
            .should("match", '.doenet-click-target[role="button"]');
        cy.get("#img").should("be.visible");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });
});
