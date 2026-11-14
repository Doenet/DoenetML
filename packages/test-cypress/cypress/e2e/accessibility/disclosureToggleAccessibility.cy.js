/**
 * The open/close toggle of a collapsible section, an aside, a hint and a
 * solution is a real disclosure control: a native `<button>` with
 * `aria-expanded`, and `aria-controls` naming the content while it is open.
 *
 * Keys are pressed through the Chrome DevTools protocol, not `cy.type`, so the
 * browser's own button behaviour runs (Enter fires `click` on keydown, Space on
 * keyup). Each key is pressed once, and the test checks the state flips
 * exactly once, so a handler that fired twice would show up as no change.
 */

const KEYS = {
    Enter: {
        key: "Enter",
        code: "Enter",
        windowsVirtualKeyCode: 13,
        nativeVirtualKeyCode: 13,
        text: "\r",
        unmodifiedText: "\r",
    },
    Space: {
        key: " ",
        code: "Space",
        windowsVirtualKeyCode: 32,
        nativeVirtualKeyCode: 32,
        text: " ",
        unmodifiedText: " ",
    },
};

function pressKey(name) {
    const def = KEYS[name];
    return cy
        .wrap(
            Cypress.automation("remote:debugger:protocol", {
                command: "Input.dispatchKeyEvent",
                params: { type: "keyDown", ...def },
            }).then(() =>
                Cypress.automation("remote:debugger:protocol", {
                    command: "Input.dispatchKeyEvent",
                    params: {
                        type: "keyUp",
                        key: def.key,
                        code: def.code,
                        windowsVirtualKeyCode: def.windowsVirtualKeyCode,
                        nativeVirtualKeyCode: def.nativeVirtualKeyCode,
                    },
                }),
            ),
            { log: false },
        )
        .then(() => Cypress.log({ name: "pressKey", message: name }));
}

/**
 * The text a screen reader takes as the button's name: its text with every
 * `aria-hidden` part left out (the button has no aria-label/labelledby).
 */
function accessibleText($el) {
    const clone = $el[0].cloneNode(true);
    clone.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove());
    return clone.textContent.replace(/\s+/g, " ").trim();
}

function expectNoAxeViolations(context) {
    cy.checkA11y(
        context,
        {
            runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag22aa"] },
            includedImpacts: ["critical", "serious", "moderate"],
        },
        (violations) => {
            expect(
                violations,
                violations
                    .map(
                        (v) =>
                            `${v.id}: ${v.nodes.map((n) => n.html).join(", ")}`,
                    )
                    .join("\n"),
            ).to.have.length(0);
        },
    );
}

describe(
    "Disclosure toggle accessibility (collapsible section, aside, hint, solution)",
    { tags: ["@group5"] },
    () => {
        beforeEach(() => {
            cy.clearIndexedDB();
            cy.visit("/");
            cy.injectAxe();
        });

        function load(doenetML, settleSelector) {
            cy.get("#testRunner_toggleControls").should("exist");
            cy.window().then((win) => {
                win.postMessage({ doenetML }, "*");
            });
            cy.get(settleSelector).should("exist");
        }

        /**
         * Shared checks for one toggle: `button` is its selector, `title` the
         * text its name must hold, `contentText` text only the open content
         * shows, `contentSelector` the content region's expected id selector.
         */
        function exerciseToggle({
            button,
            title,
            contentText,
            contentSelector,
            within,
        }) {
            cy.get(button)
                .should("have.prop", "tagName", "BUTTON")
                .and("have.attr", "type", "button")
                .and("have.attr", "aria-expanded", "false")
                .and("not.have.attr", "aria-controls")
                .then(($b) => {
                    const name = accessibleText($b);
                    expect(name).to.contain(title);
                    expect(name).not.to.match(/click to/i);
                });
            cy.get(within).should("not.contain.text", contentText);

            // Enter opens it.
            cy.get(button).focus();
            pressKey("Enter");
            cy.get(button).should("have.attr", "aria-expanded", "true");
            cy.get(button)
                .should("have.attr", "aria-controls")
                .then((controls) => {
                    cy.get(`#${CSS.escape(controls)}`)
                        .should("be.visible")
                        .and("contain.text", contentText);
                    cy.get(contentSelector).should("have.attr", "id", controls);
                });
            cy.focused().then(($f) => {
                cy.get(button).then(($b) => expect($f[0]).to.eq($b[0]));
            });

            // Space closes it.
            pressKey("Space");
            cy.get(button)
                .should("have.attr", "aria-expanded", "false")
                .and("not.have.attr", "aria-controls");
            cy.get(within).should("not.contain.text", contentText);

            // Space opens it again; Enter closes it again.
            pressKey("Space");
            cy.get(button).should("have.attr", "aria-expanded", "true");
            cy.get(within).should("contain.text", contentText);
            pressKey("Enter");
            cy.get(button).should("have.attr", "aria-expanded", "false");
            cy.get(within).should("not.contain.text", contentText);

            // A pointer click still toggles once.
            cy.get(button).click();
            cy.get(button).should("have.attr", "aria-expanded", "true");
            cy.get(within).should("contain.text", contentText);
        }

        it("collapsible section that starts closed", () => {
            load(
                `<section name="s" collapsible startOpen="false">
  <title>Later part</title>
  <p name="inside">Text inside the section.</p>
</section>`,
                "#s",
            );

            // The heading keeps its level and holds the button.
            cy.get("#s_title").should("have.prop", "tagName", "H2");
            cy.get("#s_title > button").should("have.length", 1);
            // The heading box is no longer a tab stop of its own.
            cy.get(`#s .${CSS.escape("section-heading-s")}`).should(
                "not.have.attr",
                "tabindex",
            );

            expectNoAxeViolations("#s");

            exerciseToggle({
                button: "#s_title > button",
                title: "Later part",
                contentText: "Text inside the section.",
                contentSelector: "#s_content",
                within: "#s",
            });

            cy.get("#s_title").should("have.prop", "tagName", "H2");
            expectNoAxeViolations("#s");
        });

        it("clicking the heading box outside the button still toggles", () => {
            load(
                `<section name="s" collapsible startOpen="false">
  <title>Later part</title>
  <p>Text inside the section.</p>
</section>`,
                "#s",
            );
            cy.get(`.${CSS.escape("section-heading-s")}`).click("topLeft");
            cy.get("#s_title > button").should(
                "have.attr",
                "aria-expanded",
                "true",
            );
            cy.get("#s").should("contain.text", "Text inside the section.");
        });

        it("aside (collapsible and closed by default)", () => {
            load(
                `<aside name="a">
  <title>Transcript</title>
  <p>Words of the transcript.</p>
</aside>`,
                "#a",
            );
            cy.get("#a").should("have.prop", "tagName", "ASIDE");
            cy.get("#a_title").should("have.prop", "tagName", "H2");

            expectNoAxeViolations("#a");

            exerciseToggle({
                button: "#a_title > button",
                title: "Transcript",
                contentText: "Words of the transcript.",
                contentSelector: "#a_content",
                within: "#a",
            });

            cy.get("#a_title").should("have.prop", "tagName", "H2");
            expectNoAxeViolations("#a");
        });

        it("untitled collapsible list item keeps a non-empty name", () => {
            // A `<part>` is a list item and, untitled, has no title text.
            load(
                `<problem name="pr"><part name="li" collapsible startOpen="false"><p>Item text.</p></part></problem>`,
                "#li",
            );
            cy.get("#li button[aria-expanded]")
                .should("have.length", 1)
                .and("have.attr", "aria-expanded", "false")
                .then(($b) => {
                    expect(accessibleText($b).length).to.be.greaterThan(0);
                });
            expectNoAxeViolations("#li");
            cy.get("#li button[aria-expanded]").focus();
            pressKey("Space");
            cy.get("#li button[aria-expanded]").should(
                "have.attr",
                "aria-expanded",
                "true",
            );
            cy.get("#li").should("contain.text", "Item text.");
        });

        it("a title with math is one tab stop, named, and passes axe", () => {
            load(
                `<section name="m" collapsible startOpen="false">
  <title>Graph of <m>y=x^2</m></title>
  <p>Text inside the section.</p>
</section>`,
                "#m",
            );
            cy.get("#m_title mjx-container").should("exist");
            cy.get("#m_title > button").should(($b) => {
                expect($b, "one button").to.have.length(1);
                // Nothing inside the control is a tab stop of its own.
                const inner = $b
                    .find('[tabindex]:not([tabindex="-1"])')
                    .toArray()
                    .map((e) => e.tagName);
                expect(inner, "tab stops inside the button").to.deep.equal([]);
                expect(accessibleText($b)).to.contain("Graph of");
            });
            expectNoAxeViolations("#m");
            cy.get("#m_title > button").focus();
            pressKey("Enter");
            cy.get("#m_title > button").should(
                "have.attr",
                "aria-expanded",
                "true",
            );
            cy.get("#m").should("contain.text", "Text inside the section.");
        });

        it("hint", () => {
            load(
                `<hint name="h">
  <title>Try a smaller case</title>
  <p>Words of the hint.</p>
</hint>`,
                "#h",
            );
            expectNoAxeViolations("#h");
            exerciseToggle({
                button: "#h [data-test=hint-heading]",
                title: "Try a smaller case",
                contentText: "Words of the hint.",
                contentSelector: "#h_content",
                within: "#h",
            });
            expectNoAxeViolations("#h");
        });

        it("solution", () => {
            load(
                `<solution name="sol">
  <p>Words of the solution.</p>
</solution>`,
                "#sol",
            );
            expectNoAxeViolations("#sol");
            exerciseToggle({
                button: "#sol_button",
                title: "Solution",
                contentText: "Words of the solution.",
                contentSelector: "#sol_content",
                within: "#sol",
            });
            expectNoAxeViolations("#sol");
        });
    },
);
