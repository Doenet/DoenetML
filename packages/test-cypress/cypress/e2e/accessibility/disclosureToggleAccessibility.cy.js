/**
 * The open/close toggle of a collapsible section, an aside, a hint and a
 * solution is a real disclosure control: a native `<button>` with
 * `aria-expanded`, and `aria-controls` naming the content while it is open.
 *
 * Space is pressed with `cy.press`, which sends a real key through the
 * DevTools protocol, so it is the browser's own button behavior that opens
 * and closes the panel (Space fires `click` on keyup). Each press is checked to
 * flip the state exactly once, so a key handler firing alongside the native
 * activation would show up as no change.
 *
 * Enter is not pressed here. In this Cypress (15.18) neither route reaches
 * the browser's activation behavior for Enter: `cy.press(ENTER)` sends
 * keydown and keyup with no keypress, so Chrome never activates the button,
 * and `cy.type("{enter}")` dispatches a simulated `click` that React does not
 * receive (both seen in a probe spec, on this branch). A native `<button>`
 * activates on Enter in every browser; that is checked with real keys in
 * Chromium and WebKit through Playwright in the PR's notes.
 */

function pressSpace() {
    return cy.press(Cypress.Keyboard.Keys.SPACE);
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
            cy.get(button).should(($b) => {
                expect($b, "one control").to.have.length(1);
                expect($b.prop("tagName")).to.eq("BUTTON");
                expect($b.attr("type")).to.eq("button");
                expect($b.attr("aria-expanded")).to.eq("false");
                expect($b.attr("aria-controls")).to.be.undefined;
                const name = accessibleText($b);
                expect(name).to.contain(title);
                expect(name).not.to.match(/click to/i);
            });
            cy.get(within).should("not.contain.text", contentText);

            // Space opens it.
            cy.get(button).focus();
            pressSpace();
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
            pressSpace();
            cy.get(button)
                .should("have.attr", "aria-expanded", "false")
                .and("not.have.attr", "aria-controls");
            cy.get(within).should("not.contain.text", contentText);

            // Space opens it again; a pointer click closes it.
            pressSpace();
            cy.get(button).should("have.attr", "aria-expanded", "true");
            cy.get(within).should("contain.text", contentText);
            cy.get(button).click();
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
            // Inside the box's 6px padding, left of the button.
            cy.get("#s_title > button").should("exist");
            cy.get(`.${CSS.escape("section-heading-s")}`).click(3, 20);
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
            cy.get("#a_title")
                .invoke("prop", "tagName")
                .should("match", /^H[1-6]$/)
                .as("asideLevel");

            expectNoAxeViolations("#a");

            exerciseToggle({
                button: "#a_title > button",
                title: "Transcript",
                contentText: "Words of the transcript.",
                contentSelector: "#a_content",
                within: "#a",
            });

            cy.get("@asideLevel").then((level) => {
                cy.get("#a_title").should("have.prop", "tagName", level);
            });
            cy.get("#a_title > button").should("have.length", 1);
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
                .then(($b) => {
                    expect(accessibleText($b).length).to.be.greaterThan(0);
                    const before = $b.attr("aria-expanded");
                    expectNoAxeViolations("#li");
                    cy.get("#li button[aria-expanded]").focus();
                    pressSpace();
                    cy.get("#li button[aria-expanded]").should(
                        "have.attr",
                        "aria-expanded",
                        before === "true" ? "false" : "true",
                    );
                });
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
            pressSpace();
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

        it("a host page's button styles do not restyle the toggles", () => {
            // An embedded viewer (`@doenet/standalone`) shares the host page's
            // stylesheet. The toggles were spans, which a host's rules for
            // `button` never reached; as buttons they must still look the same.
            load(
                `<section name="s" collapsible startOpen="false"><title>Later part</title><p>Text.</p></section>
<hint name="h"><title>Try a smaller case</title><p>Words of the hint.</p></hint>
<solution name="sol"><p>Words of the solution.</p></solution>`,
                "#sol",
            );
            const toggles = [
                "#s_title > button",
                "#h [data-test=hint-heading]",
                "#sol_button",
            ];
            const props = [
                "text-transform",
                "box-shadow",
                "font-family",
                "font-size",
                "min-height",
            ];
            const measure = (win) =>
                toggles.map((sel) => {
                    const el = win.document.querySelector(sel);
                    const cs = win.getComputedStyle(el);
                    return {
                        sel,
                        height: el.getBoundingClientRect().height,
                        ...Object.fromEntries(
                            props.map((p) => [p, cs.getPropertyValue(p)]),
                        ),
                    };
                });
            cy.window().then((win) => {
                const before = measure(win);
                const style = win.document.createElement("style");
                style.textContent = `button { text-transform: uppercase; box-shadow: 0 1px 2px black;
                    min-height: 44px; font-family: serif; font-size: 10px; padding: 8px 16px;
                    background: blue; border: 1px solid navy; border-radius: 6px; }`;
                win.document.head.appendChild(style);
                expect(measure(win)).to.deep.equal(before);
            });
        });
    },
);
