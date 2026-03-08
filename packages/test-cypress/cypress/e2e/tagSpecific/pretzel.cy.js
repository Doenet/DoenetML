import { cesc } from "@doenet/utils";

describe("Pretzel Tag Tests", { tags: ["@group5"] }, function () {
    const pretzelSelector = cesc("#pretzel1");
    const pretzelButtonSelector = cesc("#pretzel1_button");
    const creditSelector = cesc("#ca");
    const pretzelRowsSelector = `${pretzelSelector} [data-test="pretzel-problem-row"]`;
    const pretzelRowInputSelector = '[data-test="pretzel-row-input"] input';

    /**
     * Build a small pretzel activity, optionally in a specific mode.
     */
    function createPretzelDoenetML(mode) {
        const modeAttribute = mode ? ` mode="${mode}"` : "";
        return `
<pretzel name="pretzel1"${modeAttribute}>

    <problem>
        <statement>1</statement>
        <answer>1</answer>
    </problem>

    <problem>
        <statement>2</statement>
        <answer>2</answer>
    </problem>

    <problem>
        <statement>3</statement>
        <answer>3</answer>
    </problem>

    <problem>
        <statement>4</statement>
        <answer>4</answer>
    </problem>

</pretzel>

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
     * Return the state variable object for `pretzel1`.
     */
    function getPretzelState() {
        return cy.window().then(async (win) => {
            const stateVariables = await win.returnAllStateVariables1();
            return stateVariables[await win.resolvePath1("pretzel1")];
        });
    }

    /**
     * Wait until the pretzel component exists and state variables are available.
     */
    function waitForPretzelLoaded() {
        cy.get(pretzelSelector).should("exist");
        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                const stateVariables = await win.returnAllStateVariables1();
                return stateVariables[await win.resolvePath1("pretzel1")];
            }),
        );
    }

    /**
     * Get rendered statement text from a single pretzel row element.
     */
    function statementTextFromRow(row) {
        return Cypress.$(row)
            .find('[data-test="pretzel-row-statement"]')
            .text()
            .trim();
    }

    function captureStatementOrder() {
        return cy
            .get(pretzelRowsSelector)
            .then(($rows) =>
                [...$rows].map((row) => statementTextFromRow(row)),
            );
    }

    function fillInputsFromStatements({ skipFirstRow = false } = {}) {
        cy.get(pretzelRowsSelector).each(($row, index) => {
            if (skipFirstRow && index === 0) {
                return;
            }

            const valueToEnter = statementTextFromRow($row);
            cy.wrap($row)
                .find(pretzelRowInputSelector)
                .clear()
                .type(valueToEnter);
        });
    }

    function assertInputsMatchStatements() {
        cy.get(pretzelRowsSelector).each(($row) => {
            const expectedValue = statementTextFromRow($row);
            cy.wrap($row)
                .find(pretzelRowInputSelector)
                .should("have.value", expectedValue);
        });
    }

    function submitAndAssert({ credit, buttonText }) {
        cy.get(pretzelButtonSelector).click();
        cy.get(creditSelector).should("have.text", `${credit}`);
        cy.get(pretzelButtonSelector).should("contain.text", buttonText);
    }

    function reloadAndRestore(doenetML) {
        cy.wait(2000); // wait for debounce before reloading
        cy.reload();
        postDoenetML(doenetML);
        waitForPretzelLoaded();
    }

    function assertFirstInputFixedToOne() {
        cy.get(pretzelRowsSelector)
            .first()
            .find(pretzelRowInputSelector)
            .should("be.disabled")
            .and("have.value", "1");
    }

    function assertEditableRowIncorrectThenCorrect({
        rowIndex,
        fallbackValue,
    }) {
        cy.get(pretzelRowsSelector)
            .eq(rowIndex)
            .then(($row) => {
                const currentValue = statementTextFromRow($row);
                const incorrectValue =
                    currentValue === fallbackValue ? "99" : fallbackValue;

                cy.wrap($row)
                    .find(pretzelRowInputSelector)
                    .clear()
                    .type(incorrectValue);
                submitAndAssert({ credit: 0, buttonText: "Incorrect" });

                cy.wrap($row)
                    .find(pretzelRowInputSelector)
                    .clear()
                    .type(currentValue);
                submitAndAssert({ credit: 1, buttonText: "Correct" });
            });
    }

    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("maintain state while reloading pretzel", () => {
        const doenetML = createPretzelDoenetML();

        let originalProblemOrder;
        let originalStatementOrder;

        enableLocalState();
        postDoenetML(doenetML, 1);
        waitForPretzelLoaded();

        getPretzelState().then((pretzel) => {
            originalProblemOrder = [...pretzel.stateValues.problemOrder];
        });

        captureStatementOrder().then((statementOrder) => {
            originalStatementOrder = statementOrder;
        });

        fillInputsFromStatements();
        submitAndAssert({ credit: 1, buttonText: "Correct" });

        reloadAndRestore(doenetML);

        getPretzelState().then((pretzel) => {
            expect(pretzel.stateValues.problemOrder).eqls(originalProblemOrder);
        });

        captureStatementOrder().then((reloadedStatementOrder) => {
            expect(reloadedStatementOrder).eqls(originalStatementOrder);
        });

        assertInputsMatchStatements();
        submitAndAssert({ credit: 1, buttonText: "Correct" });
        assertEditableRowIncorrectThenCorrect({
            rowIndex: 0,
            fallbackValue: "1",
        });
    });

    it("maintain state while reloading pretzel in circuit mode", () => {
        const doenetML = createPretzelDoenetML("circuit");

        let originalProblemOrder;
        let originalStatementOrder;

        enableLocalState();
        postDoenetML(doenetML, 1);
        waitForPretzelLoaded();

        getPretzelState().then((pretzel) => {
            originalProblemOrder = [...pretzel.stateValues.problemOrder];
            expect(originalProblemOrder[0]).eq(1);
        });

        captureStatementOrder().then((statementOrder) => {
            originalStatementOrder = statementOrder;
        });

        assertFirstInputFixedToOne();
        fillInputsFromStatements({ skipFirstRow: true });
        submitAndAssert({ credit: 1, buttonText: "Correct" });

        reloadAndRestore(doenetML);

        getPretzelState().then((pretzel) => {
            expect(pretzel.stateValues.problemOrder).eqls(originalProblemOrder);
            expect(pretzel.stateValues.problemOrder[0]).eq(1);
        });

        captureStatementOrder().then((reloadedStatementOrder) => {
            expect(reloadedStatementOrder).eqls(originalStatementOrder);
        });

        assertFirstInputFixedToOne();
        assertInputsMatchStatements();
        submitAndAssert({ credit: 1, buttonText: "Correct" });
        assertEditableRowIncorrectThenCorrect({
            rowIndex: 1,
            fallbackValue: "2",
        });
    });
});
