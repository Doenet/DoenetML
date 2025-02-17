import { cesc, cesc2 } from "@doenet/utils";

describe("SamplePrimeNumbers Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it(`different numbers when reload page if don't save state`, () => {
        let doenetML = `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><samplePrimeNumbers /></template>
      <sources><sequence length="100" /></sources>
    </map>
    </aslist></p>

    `;

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

        let samples = [];

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            samples = stateVariables[
                stateVariables["/p1"].activeChildren[0].componentName
            ].activeChildren.map(
                (x) => stateVariables[x.componentName].stateValues.value,
            );

            expect(samples.length).eq(100);

            for (let sample of samples) {
                expect(
                    [
                        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47,
                        53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
                    ].includes(sample),
                ).eq(true);
            }
        });

        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let samples2 = stateVariables[
                stateVariables["/p1"].activeChildren[0].componentName
            ].activeChildren.map(
                (x) => stateVariables[x.componentName].stateValues.value,
            );

            expect(samples2.length).eq(100);

            for (let sample of samples2) {
                expect(
                    [
                        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47,
                        53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
                    ].includes(sample),
                ).eq(true);
            }
            expect(samples2).not.eqls(samples);
        });
    });

    it("same numbers when reload if save state", () => {
        let doenetML = `
    <text>a</text>
    <p name="p1"><aslist>
    <map>
      <template><samplePrimeNumbers  /></template>
      <sources><sequence length="100" /></sources>
    </map>
    </aslist></p>

    <booleaninput name="bi" /><boolean name="b2" copySource="bi" />

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

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

        let samples = [];

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            samples = stateVariables[
                stateVariables["/p1"].activeChildren[0].componentName
            ].activeChildren.map(
                (x) => stateVariables[x.componentName].stateValues.value,
            );

            expect(samples.length).eq(100);

            for (let sample of samples) {
                expect(
                    [
                        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47,
                        53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
                    ].includes(sample),
                ).eq(true);
            }
        });

        cy.log("interact so changes will be saved to database");
        cy.get(cesc("#\\/bi")).click();
        cy.get(cesc("#\\/b2")).should("have.text", "true");

        cy.log("wait for debounce");
        cy.wait(1500);

        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.log("make sure core is up and running");
        cy.get(cesc("#\\/bi")).click();
        cy.get(cesc("#\\/b2")).should("have.text", "false");

        cy.log("check that values are unchanged");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let samples2 = stateVariables[
                stateVariables["/p1"].activeChildren[0].componentName
            ].activeChildren.map(
                (x) => stateVariables[x.componentName].stateValues.value,
            );

            expect(samples2).eqls(samples);
        });
    });
});
