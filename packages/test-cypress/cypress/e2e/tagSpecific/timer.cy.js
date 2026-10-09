// The timer reads the clock in the worker, which `cy.clock` cannot reach, so
// these use short real durations.

describe("Timer Tag Tests", { tags: ["@group4"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("counts down, runs out and triggers", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p>Time left: <timer name="t" duration="3" /></p>
    <p>Status: <text name="status">working</text></p>
    <updateValue triggerWith="$t" target="$status" newValue="done" type="text" />
    `,
                },
                "*",
            );
        });

        cy.get("#t [role=timer]").should("have.text", "0:03");
        cy.get("#t_toggle").should("have.text", "Start");
        cy.get("#t_reset").should("be.disabled");

        cy.get("#t_toggle").click();
        cy.get("#t_toggle").should("have.text", "Pause");
        cy.get("#t [role=timer]").should("have.text", "0:02");
        cy.get("#t [role=timer]").should("have.text", "0:01");
        cy.get("#t [role=timer]").should("have.text", "0:00");

        cy.get("#status").should("have.text", "done");
        cy.get("#t_toggle").should("have.text", "Start");
        cy.get("#t .doenet-timer-announcer").should("have.text", "Time's up");

        cy.window().then(async (win) => {
            const stateVariables = await win.returnAllStateVariables1();
            const t = stateVariables[await win.resolvePath1("t")].stateValues;
            expect(t.expired).eq(true);
            expect(t.running).eq(false);
            expect(t.timeRemaining).eq(0);
        });

        // Start after running out begins again from the full duration
        cy.get("#t_toggle").click();
        cy.get("#t [role=timer]").should("have.text", "0:02");
        cy.get("#t .doenet-timer-announcer").should("have.text", "");
    });

    it("pauses, resumes and resets", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `<p>Time left: <timer name="t" duration="30" /></p>`,
                },
                "*",
            );
        });

        cy.get("#t [role=timer]").should("have.text", "0:30");
        cy.get("#t_toggle").click();
        cy.get("#t [role=timer]").should("have.text", "0:29");

        cy.get("#t_toggle").click();
        cy.get("#t_toggle").should("have.text", "Resume");
        cy.get("#t [role=timer]")
            .invoke("text")
            .then((pausedAt) => {
                cy.wait(1500);
                cy.get("#t [role=timer]").should("have.text", pausedAt);
            });

        cy.get("#t_toggle").click();
        cy.get("#t_toggle").should("have.text", "Pause");
        cy.get("#t [role=timer]").should("have.text", "0:27");

        cy.get("#t_reset").click();
        cy.get("#t [role=timer]").should("have.text", "0:30");
        cy.get("#t_toggle").should("have.text", "Start");
        cy.get("#t_reset").should("be.disabled");
    });

    it("controlled by callAction with no controls of its own", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p>
      <timer name="t" duration="20" showControls="false" />
      <callAction name="begin" target="$t" actionName="start"><label>Begin</label></callAction>
    </p>
    <p>Seconds left: <number name="left">$t.timeRemaining</number></p>
    `,
                },
                "*",
            );
        });

        cy.get("#t [role=timer]").should("have.text", "0:20");
        cy.get("#t button").should("not.exist");

        cy.get("#begin_button").click();
        cy.get("#t [role=timer]").should("have.text", "0:19");
        cy.get("#left").should("have.text", "19");
    });
});
