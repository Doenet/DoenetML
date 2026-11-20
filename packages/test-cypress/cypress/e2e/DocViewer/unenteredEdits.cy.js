/**
 * An input that isn't focused never shows an edit that wasn't entered (D50,
 * #2598 item 5), whatever a drag in a graph does to its focus. The renderer
 * enters an edit when the input loses focus; where a drag doesn't take focus
 * from it (JSXGraph calls `preventDefault()` on `pointerdown`), the core
 * enters the edit of an input when it is made, or shown again, unless it is
 * the input being edited (pinned in `unenteredEdits.test.ts`). These check
 * the outcome a reader sees, either way.
 *
 * The drags here are real mouse input through the browser (the devtools
 * protocol), not a synthesized `pointerdown`, which wouldn't move focus
 * either way, so focus behaves as it does for a reader.
 */
describe("Unentered edits and graph drags", { tags: ["@group4"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    /**
     * Maps a point in the application's viewport to the coordinates the
     * devtools protocol works in, which are the browser page's. The
     * application under test runs in an iframe of the Cypress runner, and
     * Cypress may scale that iframe to fit the window.
     */
    function toBrowserCoords(win, x, y) {
        const iframe = Array.from(
            window.top.document.querySelectorAll("iframe"),
        ).find((frame) => frame.contentWindow === win);
        const rect = iframe.getBoundingClientRect();
        const scale = rect.width / win.innerWidth;
        return { x: rect.left + x * scale, y: rect.top + y * scale };
    }

    function mouse(type, { x, y }) {
        return cy.wrap(
            Cypress.automation("remote:debugger:protocol", {
                command: "Input.dispatchMouseEvent",
                params: {
                    type,
                    x: Math.round(x),
                    y: Math.round(y),
                    button: "left",
                    buttons: type === "mouseReleased" ? 0 : 1,
                    clickCount: 1,
                },
            }),
            { log: false },
        );
    }

    /**
     * Drag with the mouse, in the graph `#g` (from -10 to 10 on each axis),
     * from graph coordinates `from` to `to`.
     */
    function dragInGraph(from, to) {
        cy.get("#g").find("ellipse").should("exist");
        cy.get("#g").scrollIntoView();
        cy.window().then((win) => {
            cy.get("#g").then(($g) => {
                const rect = $g[0].getBoundingClientRect();
                const at = ([x, y]) =>
                    toBrowserCoords(
                        win,
                        rect.left + ((x + 10) / 20) * rect.width,
                        rect.top + ((10 - y) / 20) * rect.height,
                    );
                const steps = 8;
                let chain = mouse("mouseMoved", at(from)).then(() =>
                    mouse("mousePressed", at(from)),
                );
                for (let step = 1; step <= steps; step++) {
                    const point = [
                        from[0] + ((to[0] - from[0]) * step) / steps,
                        from[1] + ((to[1] - from[1]) * step) / steps,
                    ];
                    chain = chain
                        .then(() => mouse("mouseMoved", at(point)))
                        .wait(16, { log: false });
                }
                chain.then(() => mouse("mouseReleased", at(to)));
            });
        });
    }

    it("a copyWithState a drag makes enters the edit it carries", () => {
        cy.window().then((win) => {
            win.postMessage(
                {
                    doenetML: `
    <p><mathInput name="mi" prefill="1"/></p>
    <p name="pv">value: $mi</p>
    <graph name="g"><point name="P">(0,0)</point></graph>
    <p name="px">x: $P.x</p>
    <conditionalContent name="cc">
      <case condition="$P.x > 1">
        <p><mathInput name="c" copyWithState="$mi"/></p>
        <p name="pc">copy's value: $c</p>
      </case>
    </conditionalContent>
    `,
                },
                "*",
            );
        });

        cy.get("#pv").should("have.text", "value: 1");
        cy.get("#mi textarea").type("{end}{backspace}4", { force: true });
        cy.get("#pv").should("have.text", "value: 1");

        dragInGraph([0, 0], [5, 0]);
        cy.get("#px").should("not.have.text", "x: 0");

        // the copy it made has the edit entered
        cy.get('[id="cc.pc"]').should("have.text", "copy's value: 4");
    });

    it("an input in a case a drag hides enters its edit when shown again", () => {
        cy.window().then((win) => {
            win.postMessage(
                {
                    doenetML: `
    <mathInput name="x" prefill="1"/>
    <p name="pv">x: $x</p>
    <graph name="g"><point name="P">(0,0)</point></graph>
    <conditionalContent name="cc">
      <case condition="$P.x < 1"><p name="pw"><mathInput name="w" bindValueTo="$x"/></p></case>
    </conditionalContent>
    `,
                },
                "*",
            );
        });

        cy.get("#pv").should("have.text", "x: 1");
        cy.get('[id="cc.w"] textarea').type("{end}{backspace}4", {
            force: true,
        });
        cy.get("#pv").should("have.text", "x: 1");

        dragInGraph([0, 0], [5, 0]);
        cy.get('[id="cc.pw"]').should("not.exist");

        // shown again: how the point comes back doesn't matter
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("P"),
                args: { x: 0, y: 0 },
            });
        });
        cy.get('[id="cc.pw"]').should("exist");
        cy.get("#pv").should("have.text", "x: 4");
        cy.get('[id="cc.w"] .mq-editable-field').should("contain.text", "4");
    });
});
