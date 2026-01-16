import { toMathJaxString } from "../../../src/util/mathDisplay";

describe("Variant Selector Tests", function () {
    let savedState = null;

    function setUpStateListeners() {
        cy.window().then(async (win) => {
            win.addEventListener("message", (e) => {
                if (e.data.subject === "SPLICE.getState") {
                    if (savedState !== null) {
                        win.postMessage(
                            {
                                subject: "SPLICE.getState.response",
                                message_id: e.data.message_id,
                                state: savedState,
                            },
                            "*",
                        );
                    }
                } else if (e.data.subject === "SPLICE.reportScoreAndState") {
                    savedState = e.data.state;
                }
            });
        });
    }

    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");

        savedState = null;
    });

    it("successfully reload state", () => {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLoadState").click();
        cy.get("#testRunner_allowSaveState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        const doenetML = `
    <graph>
        <point name="A" />
    </graph>
    <point name="A2" extend="$A" />
    <answer name="ans">x</answer>
    <math name="sr" extend="$ans.submittedResponse" />
    <number name="credit" extend="$ans.creditAchieved" />
  `;

        cy.window().then(async (win) => {
            setUpStateListeners();
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get("#A2").should("contain.text", "(0,0)");
        cy.get("#sr").should("have.text", "\uff3f");
        cy.get("#credit").should("have.text", "0");

        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("A"),
                args: { x: 3, y: 9 },
            });
        });

        cy.get("#A2").should("contain.text", "(3,9)");

        cy.get("#ans textarea").type("x{enter}", { force: true });

        cy.reload();

        cy.window().then(async (win) => {
            setUpStateListeners();
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get("#A2").should("contain.text", "(3,9)");

        cy.get("#sr").should("have.text", toMathJaxString("x"));
        cy.get("#credit").should("have.text", "1");
    });

    it("do not reload state if DoenetML changed", () => {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLoadState").click();
        cy.get("#testRunner_allowSaveState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        const doenetML = `
    <graph>
        <point name="A" />
    </graph>
    <point name="A2" extend="$A" />
    <answer name="ans">x</answer>
    <math name="sr" extend="$ans.submittedResponse" />
    <number name="credit" extend="$ans.creditAchieved" />
  `;

        cy.window().then(async (win) => {
            setUpStateListeners();
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get("#A2").should("contain.text", "(0,0)");
        cy.get("#sr").should("have.text", "\uff3f");
        cy.get("#credit").should("have.text", "0");

        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("A"),
                args: { x: 3, y: 9 },
            });
        });

        cy.get("#A2").should("contain.text", "(3,9)");

        cy.get("#ans textarea").type("x{enter}", { force: true });

        cy.reload();

        cy.window().then(async (win) => {
            setUpStateListeners();
            win.postMessage(
                {
                    doenetML: doenetML + "hello",
                },
                "*",
            );
        });

        cy.get("#A2").should("contain.text", "(0,0)");
        cy.get("#sr").should("have.text", "\uff3f");
        cy.get("#credit").should("have.text", "0");
    });
});
