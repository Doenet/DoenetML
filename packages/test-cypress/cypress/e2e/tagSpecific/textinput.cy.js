describe("TextInput Tag Tests", { tags: ["@group2"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("expanded textInput", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <textInput name="ti" expanded />

    <p name="p1">$ti</p>
    <p name="p2">$(ti.immediateValue)</p>
    `,
                },
                "*",
            );
        });

        cy.get("#ti_input").type("hello");
        cy.get("#ti_input").should("have.value", "hello");
        cy.get("#p2").should("have.text", "hello");
        cy.get("#p1").should("have.text", "");

        cy.get("#ti_input").blur();
        cy.get("#ti_input").should("have.value", "hello");
        cy.get("#p2").should("have.text", "hello");
        cy.get("#p1").should("have.text", "hello");

        cy.get("#ti_input").type("{enter}bye{enter}");
        cy.get("#ti_input").should("have.value", "hello\nbye\n");
        cy.get("#p2").should("have.text", "hello\nbye\n");
        cy.get("#p1").should("have.text", "hello\nbye");

        cy.get("#ti_input").blur();
        cy.get("#ti_input").should("have.value", "hello\nbye\n");
        cy.get("#p2").should("have.text", "hello\nbye\n");
        cy.get("#p1").should("have.text", "hello\nbye\n");

        cy.get("#ti_input").type("{moveToStart}new{enter}old{enter}");
        cy.get("#ti_input").should("have.value", "new\nold\nhello\nbye\n");
        cy.get("#p2").should("have.text", "new\nold\nhello\nbye\n");
        cy.get("#p1").should("have.text", "new\noldhello\nbye\n");

        cy.get("#ti_input").blur();
        cy.get("#ti_input").should("have.value", "new\nold\nhello\nbye\n");
        cy.get("#p2").should("have.text", "new\nold\nhello\nbye\n");
        cy.get("#p1").should("have.text", "new\nold\nhello\nbye\n");
    });

    it("set value from immediateValue on reload", () => {
        let doenetML = `
    <p><textInput name="ti" /></p>

    <p name="pv">value: $ti</p>
    <p name="piv">immediate value: $ti.immediateValue</p>
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

        cy.get("#ti_input").type("hello");

        cy.get("#piv").should("have.text", "immediate value: hello");
        cy.get("#pv").should("have.text", "value: ");

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

        cy.get("#pv").should("have.text", "value: hello");
        cy.get("#piv").should("have.text", "immediate value: hello");
    });

    it("shadowed textInput's update is not ignored", () => {
        // Check for a bug where the renderer of a shadowed text input did not update correctly
        // as its update was incorrectly being ignored.
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <graph>
        <point name="A" labelIsName />
        </graph>
        <graph>
        <point extend="$A" name="B" />
        </graph>

        <p><textInput name="tiA">$A.label</textInput></p>
        <p><textInput name="tiB">$B.label</textInput></p>
        <label name="labelA" extend="$A.label" />
        <label name="labelB" extend="$B.label" />
    `,
                },
                "*",
            );
        });

        cy.get("#tiA_input").should("have.value", "A");
        cy.get("#tiB_input").should("have.value", "A");
        cy.get("#labelA").should("have.text", "A");
        cy.get("#labelB").should("have.text", "A");

        cy.get("#tiA_input").type("B");
        cy.get("#tiA_input").should("have.value", "AB");
        cy.get("#tiB_input").should("have.value", "A");
        cy.get("#labelA").should("have.text", "A");
        cy.get("#labelB").should("have.text", "A");

        cy.get("#tiA_input").blur();
        cy.get("#tiB_input").should("have.value", "AB");
        cy.get("#tiA_input").should("have.value", "AB");
        cy.get("#labelA").should("have.text", "AB");
        cy.get("#labelB").should("have.text", "AB");

        cy.get("#tiB_input").type("C");
        cy.get("#tiB_input").should("have.value", "ABC");
        cy.get("#tiA_input").should("have.value", "AB");
        cy.get("#labelA").should("have.text", "AB");
        cy.get("#labelB").should("have.text", "AB");

        cy.get("#tiB_input").blur();
        cy.get("#tiA_input").should("have.value", "ABC");
        cy.get("#tiB_input").should("have.value", "ABC");
        cy.get("#labelA").should("have.text", "ABC");
        cy.get("#labelB").should("have.text", "ABC");
    });

    it("with description", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <textInput name="ti">
        <shortDescription>Enter something</shortDescription>
        <description>
            <p>Type what you like.</p>
        </description>
    </textInput>

    `,
                },
                "*",
            );
        });

        cy.get("#ti [data-test='Description Button']").should("be.visible");
        cy.get("#ti [data-test='Description']").should("not.be.visible");

        cy.get("#ti_input").should(
            "have.attr",
            "aria-details",
            `ti-description-content`,
        );
        cy.get(`#ti-description-content`).should(
            "contain.text",
            "Type what you like.",
        );

        cy.get("#ti [data-test='Description Button']").click();

        cy.get("#ti [data-test='Description']").should(
            "contain.text",
            "Type what you like.",
        );

        cy.get("#ti_input").focus();
        cy.get("#ti [data-test='Description']").should("not.be.visible");
    });

    it("without description", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <textInput name="ti">
        <shortDescription>Enter something</shortDescription>
    </textInput>

    `,
                },
                "*",
            );
        });

        cy.get("#ti").should("be.visible");
        cy.get("#ti [data-test='Description Button']").should("not.exist");
        cy.get("#ti [data-test='Description']").should("not.exist");
        cy.get("#ti_input").should("not.have.attr", "aria-details");
    });

    it("labelPosition left and right", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p>Left label:
    <textInput name="tl" labelPosition="left">
      <label>left</label>
    </textInput>
    </p>
    
    <p>Right label:
    <textInput name="tr" labelPosition="right">
      <label>right</label>
    </textInput>
    </p>
                    `,
                },
                "*",
            );
        });

        cy.log("Test left: label before input");
        cy.get("#tl")
            .children()
            .eq(0)
            .should("have.attr", "id", "tl-input-label");

        cy.log("Test right: label after input");
        cy.get("#tr")
            .children()
            .last()
            .should("have.attr", "id", "tr-input-label");
    });
});
