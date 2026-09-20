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

    it("expanded textInput is sized by width and height", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><textInput name="ti" expanded width="600" height="600" /></p>
    <p><textInput name="tiDefault" expanded /></p>
    <p><textInput name="plainDefault" /></p>
    `,
                },
                "*",
            );
        });

        cy.get("#ti_input").should("have.css", "width", "600px");
        cy.get("#ti_input").should("have.css", "height", "600px");

        // An expanded input with no width of its own fills the column it sits
        // in, so it stays in proportion when the reader's window is narrow.
        cy.get("#tiDefault_input").should("have.css", "height", "120px");
        cy.get("#tiDefault_input").then(($el) => {
            const el = $el[0];
            const win = el.ownerDocument.defaultView;
            // Measure the paragraph, not the input row: the row is only as
            // wide as the column because this default works. Measuring it
            // would let a regression to the old absolute 600px default pass,
            // since the row would shrink-wrap to the input either way.
            const columnWidth = parseFloat(
                win.getComputedStyle(el.closest("div.para")).width,
            );
            const inputWidth = parseFloat(win.getComputedStyle(el).width);
            expect(columnWidth).to.be.greaterThan(700);
            // Fills the column but for its own margins — well past the fixed
            // 600px this used to default to.
            expect(inputWidth).to.be.at.most(columnWidth);
            expect(inputWidth).to.be.greaterThan(columnWidth - 25);
        });

        // A word-sized input keeps its own absolute width, unchanged.
        cy.get("#plainDefault_input").should("have.css", "width", "100px");
    });

    it("expanded textInput takes a relative width", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><textInput name="half" expanded width="50%" /></p>
    <p><textInput name="plain" width="50%" /></p>
    `,
                },
                "*",
            );
        });

        // A percentage is a share of the text column the input sits in, not of
        // the input row, which shrink-wraps whatever it holds.
        cy.get("#half_input").should("exist");
        cy.get("#half_input").then(($el) => {
            const el = $el[0];
            const win = el.ownerDocument.defaultView;
            // The paragraph is the containing block a percentage resolves
            // against. The input row is not: it shrink-wraps its contents,
            // which is the circular reference this fix exists to avoid.
            const columnWidth = parseFloat(
                win.getComputedStyle(el.closest("div.para")).width,
            );
            const inputWidth = parseFloat(win.getComputedStyle(el).width);
            expect(columnWidth).to.be.greaterThan(700);
            expect(inputWidth).to.be.closeTo(columnWidth / 2, 1);
        });

        // Only an expanded input stretches its row to the column. A word-sized
        // input keeps the shrink-to-fit row that lets it flow inline.
        cy.get("#plain_input").then(($el) => {
            const el = $el[0];
            const win = el.ownerDocument.defaultView;
            const rowWidth = parseFloat(
                win.getComputedStyle(el.parentElement).width,
            );
            const columnWidth = parseFloat(
                win.getComputedStyle(el.closest("div.para")).width,
            );
            expect(rowWidth).to.be.lessThan(columnWidth);
        });
    });

    it("expanded textInput never overflows a narrow column", () => {
        cy.viewport(500, 800);
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><textInput name="huge" expanded width="4000px" /></p>
    <p><textInput name="wide" expanded /></p>
    <p><textInput name="labelled" expanded><label>A label of its own</label></textInput></p>
    `,
                },
                "*",
            );
        });

        // Measured on the rendered edges, not the computed width: the margins
        // and the border sit outside the width, so a box capped at the column
        // width would still hang past its right edge.
        function expectWithinColumn(el) {
            const paragraph = el.closest("div.para");
            const inputBox = el.getBoundingClientRect();
            const columnBox = paragraph.getBoundingClientRect();
            expect(columnBox.width).to.be.greaterThan(100);
            expect(inputBox.right).to.be.at.most(columnBox.right + 0.5);
            expect(inputBox.left).to.be.at.least(columnBox.left - 0.5);
        }

        // An absolute width the window cannot hold shrinks to fit.
        cy.get("#huge_input").should("exist");
        cy.get("#huge_input").then(($el) => {
            expect($el[0].getBoundingClientRect().width).to.be.lessThan(4000);
            expectWithinColumn($el[0]);
        });

        // So does the 100% default, whose margins would otherwise push it out.
        cy.get("#wide_input").then(($el) => expectWithinColumn($el[0]));

        // A label shares the line the input row starts on, so a row stretched
        // to the full column has to wrap below the label rather than hang off
        // the right of it.
        cy.get("#labelled_input").then(($el) => expectWithinColumn($el[0]));
    });

    // The check-work button carries its label three times over: once in the
    // icon's `<title>`, once in a visually-hidden span for screen readers, and
    // — only on the full-size button — as visible text beside the icon. So
    // `textContent` cannot tell the two sizes apart; the visible text node can.
    function visibleButtonLabel(btn) {
        const iconSpan = btn.querySelector('span[aria-hidden="true"]');
        return Array.from(iconSpan.childNodes)
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent)
            .join("")
            .trim();
    }

    it("puts an expanded input's check-work button below it, at full size", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><answer name="big" handGraded><textInput name="bigTi" expanded /></answer></p>
    <p><answer name="small" handGraded><textInput name="smallTi" /></answer></p>
    `,
                },
                "*",
            );
        });

        cy.get("#bigTi_input").should("exist");

        // An expanded input fills its column, so a button beside it would be
        // squeezed to nothing: it goes underneath instead.
        cy.get("#bigTi_button").then(($btn) => {
            const btn = $btn[0];
            const win = btn.ownerDocument.defaultView;
            const input = win.document.getElementById("bigTi_input");
            const btnBox = btn.getBoundingClientRect();
            const inputBox = input.getBoundingClientRect();
            expect(btnBox.top).to.be.at.least(inputBox.bottom - 1);
            // Full-size button: the label rides along with the icon, and it is
            // the default for an expanded input, with no `forceFullCheckWorkButton`.
            expect(visibleButtonLabel(btn)).to.contain("Submit Response");
            // Nothing is clipped — a wrapped label grows the button instead.
            expect(btn.scrollHeight).to.be.at.most(btn.clientHeight);
        });

        // A word-sized input keeps the small button beside it, on the same line.
        cy.get("#smallTi_button").then(($btn) => {
            const btn = $btn[0];
            const win = btn.ownerDocument.defaultView;
            const input = win.document.getElementById("smallTi_input");
            const btnBox = btn.getBoundingClientRect();
            const inputBox = input.getBoundingClientRect();
            expect(btnBox.left).to.be.greaterThan(inputBox.left);
            expect(btnBox.top).to.be.lessThan(inputBox.bottom);
            expect(visibleButtonLabel(btn)).to.equal("");
        });
    });

    it("lets forceSmallCheckWorkButton shrink an expanded input's button", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><answer name="a" handGraded forceSmallCheckWorkButton><textInput name="ti" expanded /></answer></p>
    `,
                },
                "*",
            );
        });

        cy.get("#ti_input").should("exist");
        cy.get("#ti_button").then(($btn) => {
            expect(visibleButtonLabel($btn[0])).to.equal("");
        });
    });

    it("grows the check-work button to hold a label that wraps", () => {
        cy.viewport(700, 800);
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <sideBySide widths="14% 86%">
      <p><answer name="a" handGraded><textInput name="ti" expanded /></answer></p>
      <p>filler</p>
    </sideBySide>
    `,
                },
                "*",
            );
        });

        cy.get("#ti_input").should("exist");
        cy.get("#ti_button").then(($btn) => {
            const btn = $btn[0];
            // A narrow column squeezes the button until "Submit Response" no
            // longer fits on one line, so its content is taller than the 24px
            // a one-line button stands. Asserted first so the check below is
            // testing what it says it is.
            expect(btn.scrollHeight).to.be.greaterThan(24);
            // Having wrapped, the button grows to hold the second line rather
            // than clipping it — which a fixed height did.
            expect(btn.clientHeight).to.be.at.least(btn.scrollHeight);
        });
    });

    it("sizes an expanded input on a graph like a word-sized one", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph name="gPlain"><textInput name="plain" /></graph>
    <graph name="gExpanded"><textInput name="big" expanded /></graph>
    <graph name="gRelative"><textInput name="half" width="50%" /></graph>
    <graph name="gAbsolute"><textInput name="wide" width="240px" /></graph>
    `,
                },
                "*",
            );
        });

        // JSXGraph draws every text input as a one-line field, so `expanded`
        // means nothing on a graph — and neither does the 100% width it brings
        // with it: the field floats in a shrink-to-fit box above the graph,
        // which gives a percentage no column to be a share of.
        cy.get("#gPlain").find("input").should("have.css", "width", "100px");
        cy.get("#gExpanded").find("input").should("have.css", "width", "100px");
        // An authored percentage falls back the same way, whether or not it
        // came from the `expanded` default.
        cy.get("#gRelative").find("input").should("have.css", "width", "100px");
        // An absolute width is still honored on a graph.
        cy.get("#gAbsolute").find("input").should("have.css", "width", "240px");
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

    it("styles disabled graph textInput like other disabled text inputs", () => {
        function expectMatchingStyles() {
            for (let property of [
                "background-color",
                "border-top-color",
                "cursor",
            ]) {
                cy.get("@plainInput")
                    .invoke("css", property)
                    .then((plainValue) => {
                        cy.get("@graphInput").should(
                            "have.css",
                            property,
                            plainValue,
                        );
                    });
            }
        }

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <booleanInput name="toggleDisabled" prefill="true">
      <label>Disable graph input</label>
    </booleanInput>
    <textInput name="plain" disabled="$toggleDisabled" />
    <graph name="g">
      <textInput name="ti" disabled="$toggleDisabled" />
    </graph>
    `,
                },
                "*",
            );
        });

        cy.get("#plain_input").as("plainInput");
        cy.get("#g").find("input").should("have.length", 1).as("graphInput");

        cy.get("@plainInput").should("be.disabled");
        cy.get("@graphInput").should("be.disabled");
        expectMatchingStyles();

        cy.get("#toggleDisabled_input").click({ force: true });

        cy.get("@plainInput").should("not.be.disabled");
        cy.get("@graphInput").should("not.be.disabled");
        expectMatchingStyles();

        cy.get("#toggleDisabled_input").click({ force: true });

        cy.get("@plainInput").should("be.disabled");
        cy.get("@graphInput").should("be.disabled");
        expectMatchingStyles();
    });

    it("focused state variable is not saved to database (doNotSave)", () => {
        let doenetML = `
    <p><textInput name="ti">
      <label>hello</label>
    </textInput></p>
    <p name="fv">focused: <boolean extend="$ti.focused" /></p>
    <p name="piv">immediate value: <text extend="$ti.immediateValue" /></p>
    `;

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage({ doenetML }, "*");
        });

        cy.get("#fv").should("have.text", "focused: false");
        cy.get("#piv").should("have.text", "immediate value: ");

        cy.get("#ti_input").focus();
        cy.get("#fv").should("have.text", "focused: true");

        cy.get("#ti_input").type("hello");
        cy.get("#fv").should("have.text", "focused: true");
        cy.get("#piv").should("have.text", "immediate value: hello");

        cy.wait(1500); // wait for debounce

        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage({ doenetML }, "*");
        });

        // immediateValue should be restored, but focused should not be saved
        cy.get("#piv").should("have.text", "immediate value: hello");
        cy.get("#fv").should("have.text", "focused: false");
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

    it("labelPosition start and end", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p>Start label:
    <textInput name="tl" labelPosition="start">
      <label>start</label>
    </textInput>
    </p>
    
    <p>End label:
    <textInput name="tr" labelPosition="end">
      <label>end</label>
    </textInput>
    </p>
                    `,
                },
                "*",
            );
        });

        cy.log("Test start: label before input");
        cy.get("#tl")
            .children()
            .eq(0)
            .should("have.attr", "id", "tl-input-label");

        cy.log("Test end: label after input");
        cy.get("#tr")
            .children()
            .last()
            .should("have.attr", "id", "tr-input-label");
    });

    it("focused state variable updates on focus and blur", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><textInput name="ti">
      <label>hello</label>
    </textInput></p>
    <p name="fv">focused: <boolean extend="$ti.focused" /></p>
    `,
                },
                "*",
            );
        });

        cy.get("#fv").should("have.text", "focused: false");

        cy.log("Focus the input: focused becomes true");
        cy.get("#ti_input").focus();
        cy.get("#fv").should("have.text", "focused: true");

        cy.log("Blur the input: focused becomes false");
        cy.get("#ti_input").blur();
        cy.get("#fv").should("have.text", "focused: false");
    });
});
