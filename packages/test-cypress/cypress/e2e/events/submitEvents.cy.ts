import { cesc } from "@doenet/utils";

describe("Submit Event Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("answer response counts from events are correctly displayed", () => {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowSaveEvents").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        const answerResponseCounts: Record<string, number> = {};

        const doenetML = `
    x: <answer>x</answer>
    y: <answer name="y">y</answer>
    
    <section name="s1">
       z: <answer name="z">z</answer>
    </section>

    <section name="s2">
       z: <answer name="z">z</answer>
    </section>

    <repeatForSequence length="2" name="r" valueName="v">
       v$v: <answer name="a">v$v</answer>
    </repeatForSequence>

    <answer name="none">n</answer>

    `;

        cy.window().then(async (win) => {
            win.addEventListener("message", (e) => {
                if (
                    e.data.subject === "SPLICE.sendEvent" &&
                    e.data.data.verb === "submitted"
                ) {
                    const object = JSON.parse(e.data.data.object);

                    const answerId = object.rootName;

                    if (!(answerId in answerResponseCounts)) {
                        answerResponseCounts[answerId] = 0;
                    }
                    answerResponseCounts[answerId]++;
                }
            });

            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.log("three responses to y");
        cy.get("#y button").click();
        cy.get("#y textarea").type("y{enter}", { force: true });
        cy.get("#y textarea").type("y{enter}", { force: true });

        cy.log("one response to x");
        cy.get(".doenet-viewer textarea").eq(0).type("x{enter}", {
            force: true,
        });

        cy.log("four responses to s1.z");
        cy.get(`#${cesc("s1.z")} button`).click();
        cy.get(`#${cesc("s1.z")} textarea`).type("y{enter}", { force: true });
        cy.get(`#${cesc("s1.z")} textarea`).type("y{enter}", { force: true });
        cy.get(`#${cesc("s1.z")} textarea`).type(
            "{backspace}{backspace}z{enter}",
            { force: true },
        );

        cy.log("two responses to s2.z");
        cy.get(`#${cesc("s2.z")} textarea`).type("z{enter}", { force: true });
        cy.get(`#${cesc("s2.z")} textarea`).type("y{enter}", { force: true });

        cy.log("two responses to r[1].a");
        cy.get(`${cesc("#r:1.a")} textarea`).type("r{enter}", { force: true });
        cy.get(`${cesc("#r:1.a")} textarea`).type("1{enter}", { force: true });

        cy.log("one response to r[2].a");
        cy.get(`${cesc("#r:2.a")} textarea`).type("abc{enter}", {
            force: true,
        });

        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                    answerResponseCounts,
                },
                "*",
            );
        });

        cy.get(".doenet-viewer .answer-response-button")
            .eq(0)
            .should("have.text", "1");

        cy.get("#y .answer-response-button").should("have.text", "3");
        cy.get(`#${cesc("s1.z")} .answer-response-button`).should(
            "have.text",
            "4",
        );
        cy.get(`#${cesc("s2.z")} .answer-response-button`).should(
            "have.text",
            "2",
        );

        cy.get(`${cesc("#r:1.a")} .answer-response-button`).should(
            "have.text",
            "2",
        );

        cy.get(`${cesc("#r:2.a")} .answer-response-button`).should(
            "have.text",
            "1",
        );

        cy.get("#none .answer-response-button").should("have.text", "0");
    });
});
