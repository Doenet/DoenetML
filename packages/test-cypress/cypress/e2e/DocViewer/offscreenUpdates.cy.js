describe("Offscreen updates", { tags: ["@group5"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    // Core sends renderer updates for content far below the viewport only
    // once it is idle. Whatever the reader types, that content must be current
    // by the time it is scrolled into view.
    const doenetML = `
<section name="top">
  <textInput name="ti" />
  <p name="near">Near: <text name="nearEcho">$ti.immediateValue</text></p>
</section>
<section name="spacer">
  <repeatForSequence from="1" to="80">
    <p>Filler paragraph to push the next section well below the fold.</p>
  </repeatForSequence>
</section>
<section name="bottom">
  <p name="far">Far: <text name="farEcho">$ti.immediateValue</text></p>
</section>
`;

    it("content typed into from far above is current when scrolled to", () => {
        cy.window().then((win) => {
            win.postMessage({ doenetML }, "*");
        });

        cy.get("#nearEcho").should("have.text", "");

        cy.get("#ti_input").type("hello");
        cy.get("#nearEcho").should("have.text", "hello");

        cy.get("#far").scrollIntoView();
        cy.get("#farEcho").should("have.text", "hello");

        cy.get("#top").scrollIntoView();
        cy.get("#ti_input").type(" world");
        cy.get("#nearEcho").should("have.text", "hello world");

        cy.get("#far").scrollIntoView();
        cy.get("#farEcho").should("have.text", "hello world");
    });
});

describe(
    "Offscreen updates wait for what is on screen",
    { tags: ["@group5"] },
    function () {
        beforeEach(() => {
            cy.clearIndexedDB();
            cy.visit("/");
        });

        // The far section is above the reader, who has scrolled to the input at
        // the bottom. Its hundreds of dependents take long enough to send that
        // `farEchoLast` is still behind when what is on screen has caught up.
        const doenetML = `
<section name="far">
  <p><text name="farEcho">$ti.immediateValue</text></p>
  <repeatForSequence from="1" to="400" valueName="v">
    <p><text>$v $ti.immediateValue</text></p>
  </repeatForSequence>
  <p><text name="farEchoLast">$ti.immediateValue</text></p>
</section>
<section name="spacer">
  <repeatForSequence from="1" to="80">
    <p>Filler paragraph to push the next section well below the fold.</p>
  </repeatForSequence>
</section>
<section name="controls">
  <booleanInput name="hideSol" />
  <textInput name="ti" />
</section>
<solution name="sol" hide="$hideSol">
  Echo: <text name="echo">$ti.immediateValue</text>
</solution>
`;

        function load() {
            cy.window().then((win) => {
                win.postMessage({ doenetML }, "*");
            });
            cy.get("#sol_button", { timeout: 15000 }).click();
            cy.get("#echo").should("have.text", "");
            cy.get("#sol").scrollIntoView();
        }

        // Checks both texts in the same retry, so it passes only at a moment
        // when the echo on screen is current and the far one is not yet.
        function echoCurrentBeforeFar(current, previous) {
            cy.document({ timeout: 4000 }).should((doc) => {
                expect(doc.getElementById("echo").textContent).eq(current);
                expect(doc.getElementById("farEchoLast").textContent).eq(
                    previous,
                );
            });
            cy.get("#farEchoLast").should("have.text", current);
        }

        it("a keystroke updates what is on screen before what is far away", () => {
            load();

            cy.get("#ti_input").type("a");
            echoCurrentBeforeFar("a", "");

            cy.get("#ti_input").type("b");
            echoCurrentBeforeFar("ab", "a");
        });

        it("a solution hidden and shown again still counts as on screen", () => {
            load();

            cy.get("#ti_input").type("a");
            echoCurrentBeforeFar("a", "");

            cy.get("#hideSol").click();
            cy.get("#echo").should("not.exist");
            cy.get("#hideSol").click();
            cy.get("#echo").should("have.text", "a");

            cy.get("#ti_input").type("b");
            echoCurrentBeforeFar("ab", "a");
        });
    },
);

describe("Math far from the screen", { tags: ["@group5"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    // A hundred maths above the reader, who has scrolled down to the input.
    // They are typeset once the page is idle, nearest first, so `farMath`, at
    // the top, is the last.
    const doenetML = `
<section name="far">
  <p>Far: <math name="farMath">$mi.immediateValue</math></p>
  <repeatForSequence from="1" to="100" valueName="v">
    <p><math>$v + $mi.immediateValue</math></p>
  </repeatForSequence>
</section>
<section name="spacer">
  <repeatForSequence from="1" to="80">
    <p>Filler paragraph to push the input well below the fold.</p>
  </repeatForSequence>
</section>
<p>Input: <mathInput name="mi" /></p>
<p name="echoP">Echo: <math name="echo">$mi.immediateValue</math></p>
`;

    // The italic a that MathJax draws for "a".
    const typesetA = "\u{1D44E}";

    it("updates after the math on screen, and without being scrolled to", () => {
        cy.window().then((win) => {
            win.postMessage({ doenetML }, "*");
        });
        cy.get("#farMath", { timeout: 15000 }).should("exist");
        cy.get("#echoP").scrollIntoView();
        cy.get("#mi textarea").type("a", { force: true });

        // Both in the same retry: it passes only at a moment when the echo on
        // screen is current and the far math is not yet.
        cy.document().should((doc) => {
            expect(doc.getElementById("echo").textContent).contain(typesetA);
            expect(doc.getElementById("farMath").textContent).not.contain(
                typesetA,
            );
        });

        // About a hundred typesets of idle time later.
        cy.get("#farMath", { timeout: 15000 }).should("contain.text", typesetA);
    });
});
