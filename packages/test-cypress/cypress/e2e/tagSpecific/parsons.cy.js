describe("Parsons Tag Tests", { tags: ["@group3"] }, function () {
    const parsonsSelector = "#p";
    const buttonSelector = "#p_button";
    const creditSelector = "#ca";
    const solutionSelector = `${parsonsSelector} [data-test="parsons-solution"]`;
    const unusedSelector = `${parsonsSelector} [data-test="parsons-unused"]`;
    const liveSelector = `${parsonsSelector} [data-test="parsons-live"]`;

    /**
     * Three correct steps in document order and one distractor.
     */
    function createParsonsDoenetML(attributes = "") {
        return `
<parsons name="p"${attributes ? " " + attributes : ""}>
    <label>Order the steps</label>
    <statement><p>Start here</p></statement>
    <block><p>first</p></block>
    <block><p>second</p></block>
    <block><p>third</p></block>
    <block isDistractor><p>wrong</p></block>
</parsons>

<p>Credit achieved: <number extend="$_document1.creditAchieved" name="ca" /></p>
     `;
    }

    /**
     * Enable local state persistence in the test runner controls.
     */
    function enableLocalState() {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();
    }

    /**
     * Load DoenetML into the iframe runner, with optional requested variant.
     */
    function postDoenetML(doenetML, requestedVariantIndex) {
        cy.window().then(async (win) => {
            const message = { doenetML };
            if (requestedVariantIndex !== undefined) {
                message.requestedVariantIndex = requestedVariantIndex;
            }
            win.postMessage(message, "*");
        });
    }

    /**
     * Return the state variable object for `p`.
     */
    function getParsonsState() {
        return cy.window().then(async (win) => {
            const stateVariables = await win.returnAllStateVariables1();
            return stateVariables[await win.resolvePath1("p")];
        });
    }

    /**
     * Wait until the parsons component exists and state variables are available.
     */
    function waitForParsonsLoaded() {
        cy.get(parsonsSelector).should("exist");
        cy.waitUntil(() => getParsonsState());
    }

    /**
     * The block indices shown in an area, top to bottom.
     */
    function blockOrderIn(areaSelector) {
        return cy
            .get(areaSelector)
            .then(($area) =>
                [...$area[0].querySelectorAll("li[data-block-index]")].map(
                    (li) => Number(li.dataset.blockIndex),
                ),
            );
    }

    /**
     * Assert the block order in an area, retrying until the worker's reply
     * has rendered (a reorder changes no length, only the order).
     */
    function assertAreaOrder(areaSelector, expected) {
        cy.get(areaSelector).should(($area) => {
            const order = [
                ...$area[0].querySelectorAll("li[data-block-index]"),
            ].map((li) => Number(li.dataset.blockIndex));
            expect(order).eqls(expected);
        });
    }

    function assertSolutionOrder(expected) {
        assertAreaOrder(solutionSelector, expected);
    }

    function assertUnusedOrder(expected) {
        assertAreaOrder(unusedSelector, expected);
    }

    function blockButton(areaSelector, blockIndex, testId) {
        return cy.get(
            `${areaSelector} [data-block-index="${blockIndex}"] [data-test="${testId}"]`,
        );
    }

    function submitAndAssert({ credit, buttonText }) {
        cy.get(buttonSelector).click();
        cy.get(creditSelector).should("have.text", `${credit}`);
        cy.get(buttonSelector).should("contain.text", buttonText);
    }

    /**
     * Drag a block by pointer from its center to a point inside the target
     * area, near its bottom so it lands last.
     */
    function dragBlockToArea(blockIndex, targetSelector) {
        cy.get(`${parsonsSelector} [data-block-index="${blockIndex}"]`).then(
            ($li) => {
                const from = $li[0].getBoundingClientRect();
                cy.get(targetSelector).then(($area) => {
                    const to = $area[0].getBoundingClientRect();
                    const startX = from.left + from.width / 2;
                    const startY = from.top + from.height / 2;
                    const endX = to.left + to.width / 2;
                    const endY = to.bottom - 8;
                    const pointer = {
                        pointerId: 1,
                        pointerType: "mouse",
                        isPrimary: true,
                        button: 0,
                    };
                    cy.wrap($li)
                        .trigger("pointerdown", {
                            ...pointer,
                            clientX: startX,
                            clientY: startY,
                        })
                        .trigger("pointermove", {
                            ...pointer,
                            clientX: startX + 6,
                            clientY: startY + 6,
                        })
                        .trigger("pointermove", {
                            ...pointer,
                            clientX: endX,
                            clientY: endY,
                        })
                        .trigger("pointerup", {
                            ...pointer,
                            clientX: endX,
                            clientY: endY,
                        });
                });
            },
        );
    }

    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("renders the statement in the solution and the shuffled blocks unused", () => {
        postDoenetML(createParsonsDoenetML(), 1);
        waitForParsonsLoaded();

        cy.get(`${solutionSelector} [data-test="parsons-statement"]`).should(
            "contain.text",
            "Start here",
        );
        cy.get(`${solutionSelector} li[data-block-index]`).should(
            "have.length",
            0,
        );
        cy.get(`${unusedSelector} li[data-block-index]`).should(
            "have.length",
            4,
        );

        getParsonsState().then((parsons) => {
            const blockOrder = parsons.stateValues.blockOrder;
            expect([...blockOrder].sort()).eqls([1, 2, 3, 4]);
            assertUnusedOrder(blockOrder);
        });

        // the group is named by its label
        cy.get(parsonsSelector).should("have.attr", "role", "group");
        cy.get(parsonsSelector).should(
            "have.attr",
            "aria-labelledby",
            "p-label",
        );
    });

    it("buttons build, order, and check the solution", () => {
        postDoenetML(createParsonsDoenetML(), 1);
        waitForParsonsLoaded();

        // move the correct blocks in, deliberately out of order
        for (const blockIndex of [2, 1, 3]) {
            blockButton(
                unusedSelector,
                blockIndex,
                "parsons-move-to-solution",
            ).click();
            cy.get(
                `${solutionSelector} [data-block-index="${blockIndex}"]`,
            ).should("exist");
        }
        assertSolutionOrder([2, 1, 3]);
        cy.get(liveSelector).should(
            "contain.text",
            "Moved to the solution, position 3 of 3.",
        );

        // focus lands on the block just moved
        cy.focused().should("have.attr", "data-block-index", "3");

        // out of order earns nothing
        submitAndAssert({ credit: 0, buttonText: "Incorrect" });

        // fix the order
        blockButton(solutionSelector, 1, "parsons-move-up").click();
        assertSolutionOrder([1, 2, 3]);
        cy.get(liveSelector).should(
            "contain.text",
            "Moved to position 1 of 3.",
        );

        // the top block cannot move up, the bottom one cannot move down
        blockButton(solutionSelector, 1, "parsons-move-up").should(
            "be.disabled",
        );
        blockButton(solutionSelector, 3, "parsons-move-down").should(
            "be.disabled",
        );

        submitAndAssert({ credit: 1, buttonText: "Correct" });

        getParsonsState().then((parsons) => {
            expect(parsons.stateValues.currentResponses).eqls([1, 2, 3]);
            expect(parsons.stateValues.submittedResponses).eqls([1, 2, 3]);
        });

        // removing a block clears the verdict
        blockButton(solutionSelector, 2, "parsons-move-to-unused").click();
        assertSolutionOrder([1, 3]);
        cy.get(liveSelector).should(
            "contain.text",
            "Moved to the unused blocks.",
        );
        cy.get(buttonSelector).should("contain.text", "Check Work");
    });

    it("keyboard shortcuts on a focused block", () => {
        postDoenetML(createParsonsDoenetML(`shuffleOrder="false"`), 1);
        waitForParsonsLoaded();

        // Space and Enter move a block between the areas
        cy.get(`${unusedSelector} [data-block-index="3"]`).focus().type(" ");
        assertSolutionOrder([3]);
        cy.get(`${unusedSelector} [data-block-index="1"]`)
            .focus()
            .type("{enter}");
        assertSolutionOrder([3, 1]);

        // Alt with an arrow reorders within the solution
        cy.get(`${solutionSelector} [data-block-index="1"]`)
            .focus()
            .type("{alt}{upArrow}");
        assertSolutionOrder([1, 3]);
        cy.get(`${solutionSelector} [data-block-index="1"]`)
            .focus()
            .type("{alt}{downArrow}");
        assertSolutionOrder([3, 1]);

        // Enter on a solution block sends it back
        cy.get(`${solutionSelector} [data-block-index="3"]`)
            .focus()
            .type("{enter}");
        assertSolutionOrder([1]);
        assertUnusedOrder([2, 3, 4]);
    });

    it("arrow keys move focus and Escape abandons a drag", () => {
        postDoenetML(createParsonsDoenetML(`shuffleOrder="false"`), 1);
        waitForParsonsLoaded();

        // the arrows alone walk the list and stop at its ends
        cy.get(`${unusedSelector} [data-block-index="2"]`)
            .focus()
            .type("{downArrow}");
        cy.focused().should("have.attr", "data-block-index", "3");
        cy.focused().type("{upArrow}{upArrow}");
        cy.focused().should("have.attr", "data-block-index", "1");
        cy.focused().type("{upArrow}");
        cy.focused().should("have.attr", "data-block-index", "1");

        // a drag in progress shows the drop indicator; Escape abandons it
        cy.get(`${unusedSelector} [data-block-index="1"]`).then(($li) => {
            const from = $li[0].getBoundingClientRect();
            cy.get(solutionSelector).then(($area) => {
                const to = $area[0].getBoundingClientRect();
                const pointer = {
                    pointerId: 1,
                    pointerType: "mouse",
                    isPrimary: true,
                    button: 0,
                };
                cy.wrap($li)
                    .trigger("pointerdown", {
                        ...pointer,
                        clientX: from.left + from.width / 2,
                        clientY: from.top + from.height / 2,
                    })
                    .trigger("pointermove", {
                        ...pointer,
                        clientX: to.left + to.width / 2,
                        clientY: to.bottom - 8,
                    });
            });
        });
        cy.get(
            `${parsonsSelector} [data-test="parsons-drop-indicator"]`,
        ).should("exist");
        cy.get("body").type("{esc}");
        cy.get(
            `${parsonsSelector} [data-test="parsons-drop-indicator"]`,
        ).should("not.exist");
        cy.get(`${unusedSelector} [data-block-index="1"]`).trigger(
            "pointerup",
            {
                pointerId: 1,
                pointerType: "mouse",
                isPrimary: true,
                button: 0,
            },
        );
        assertSolutionOrder([]);
        assertUnusedOrder([1, 2, 3, 4]);
    });

    it("pointer drag moves blocks between the areas", () => {
        postDoenetML(createParsonsDoenetML(`shuffleOrder="false"`), 1);
        waitForParsonsLoaded();

        dragBlockToArea(2, solutionSelector);
        assertSolutionOrder([2]);
        dragBlockToArea(1, solutionSelector);
        assertSolutionOrder([2, 1]);

        getParsonsState().then((parsons) => {
            expect(parsons.stateValues.currentResponses).eqls([2, 1]);
        });

        // reorder within the solution: drag the bottom block above the top one
        cy.get(`${solutionSelector} [data-block-index="1"]`).then(($li) => {
            const from = $li[0].getBoundingClientRect();
            cy.get(`${solutionSelector} [data-block-index="2"]`).then(
                ($top) => {
                    const to = $top[0].getBoundingClientRect();
                    const pointer = {
                        pointerId: 1,
                        pointerType: "mouse",
                        isPrimary: true,
                        button: 0,
                    };
                    cy.wrap($li)
                        .trigger("pointerdown", {
                            ...pointer,
                            clientX: from.left + from.width / 2,
                            clientY: from.top + from.height / 2,
                        })
                        .trigger("pointermove", {
                            ...pointer,
                            clientX: from.left + from.width / 2,
                            clientY: from.top + from.height / 2 - 6,
                        })
                        .trigger("pointermove", {
                            ...pointer,
                            clientX: to.left + to.width / 2,
                            clientY: to.top + 2,
                        });
                    cy.get(
                        `${parsonsSelector} [data-test="parsons-drop-indicator"]`,
                    ).should("exist");
                    cy.wrap($li).trigger("pointerup", {
                        ...pointer,
                        clientX: to.left + to.width / 2,
                        clientY: to.top + 2,
                    });
                },
            );
        });
        assertSolutionOrder([1, 2]);

        dragBlockToArea(2, unusedSelector);
        assertSolutionOrder([1]);
        assertUnusedOrder([2, 3, 4]);
    });

    it("different variants shuffle differently", () => {
        const doenetML = createParsonsDoenetML();
        const ordersSeen = [];

        for (const requestedVariantIndex of [1, 2, 3]) {
            postDoenetML(doenetML, requestedVariantIndex);
            waitForParsonsLoaded();
            blockOrderIn(unusedSelector).then((order) => {
                ordersSeen.push(order.join(","));
            });
            cy.reload();
        }

        cy.then(() => {
            expect(new Set(ordersSeen).size).to.be.greaterThan(1);
        });
    });

    it("maintains the arrangement while reloading with local state", () => {
        const doenetML = createParsonsDoenetML();
        let originalOrder;

        enableLocalState();
        postDoenetML(doenetML, 1);
        waitForParsonsLoaded();

        blockOrderIn(unusedSelector).then((order) => {
            originalOrder = order;
        });

        for (const blockIndex of [1, 2]) {
            blockButton(
                unusedSelector,
                blockIndex,
                "parsons-move-to-solution",
            ).click();
        }
        assertSolutionOrder([1, 2]);
        submitAndAssert({ credit: 0, buttonText: "Incorrect" });

        cy.wait(2000); // wait for debounce before reloading
        cy.reload();
        postDoenetML(doenetML);
        waitForParsonsLoaded();

        assertSolutionOrder([1, 2]);
        cy.then(() => {
            assertUnusedOrder(originalOrder.filter((i) => i !== 1 && i !== 2));
        });
        cy.get(buttonSelector).should("contain.text", "Incorrect");

        blockButton(unusedSelector, 3, "parsons-move-to-solution").click();
        submitAndAssert({ credit: 1, buttonText: "Correct" });
    });

    it("disableAfterCorrect freezes the blocks", () => {
        postDoenetML(createParsonsDoenetML(`disableAfterCorrect`), 1);
        waitForParsonsLoaded();

        for (const blockIndex of [1, 2, 3]) {
            blockButton(
                unusedSelector,
                blockIndex,
                "parsons-move-to-solution",
            ).click();
        }
        submitAndAssert({ credit: 1, buttonText: "Correct" });

        cy.get(`${parsonsSelector} [data-test="parsons-move-to-unused"]`).each(
            ($button) => {
                cy.wrap($button).should("be.disabled");
            },
        );
        blockButton(unusedSelector, 4, "parsons-move-to-solution").should(
            "be.disabled",
        );

        dragBlockToArea(4, solutionSelector);
        assertSolutionOrder([1, 2, 3]);
        cy.get(buttonSelector).should("contain.text", "Correct");
    });
});
