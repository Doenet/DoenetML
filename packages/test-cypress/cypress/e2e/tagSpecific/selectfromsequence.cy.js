import { cesc } from "@doenet/utils";

describe("SelectFromSequence Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("selectfromsequence depending on selectfromsequence handles reload", () => {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        let doenetML = `
    <selectFromSequence name='n'  />
    <selectFromSequence name='m' to='$n' />
  
    <p><booleanInput name="bi" /> <boolean extend="$bi" name="b" /></p>

    `;

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#b")).should("have.text", "false");

        cy.get(cesc("#bi")).click();
        cy.get(cesc("#b")).should("have.text", "true");

        cy.wait(2000); // wait for debounce

        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#b")).should("have.text", "true");

        cy.log("core has not crashed and processes change in bi");
        cy.get(cesc("#bi")).click();
        cy.get(cesc("#b")).should("have.text", "false");
    });

    it("selectfromsequence depending on selectfromsequence handles reload 2", () => {
        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        // doenetML snippet based on course content that was crashing

        let doenetML = `
    <text>a</text>
    <selectFromSequence name='aa' step=' 0.01' from='0.01' to='1' />
    <selectFromSequence name='bb' step=' 0.00001' from='0.00001' to='0.001' />
    
    <number name='a_over_b'>$aa / $bb </number>
    
    <sequence name="excludeForS02" from="round($a_over_b - 10)" to="round($a_over_b + 10)" />
    
    <selectFromSequence name='S02' from='round(($a_over_b )*0.5)' to='round(($a_over_b )*1.5)' exclude="$excludeForS02" />
    <selectFromSequence name='S03' from='round(($a_over_b )*1.1)' to='round(($a_over_b )*4.0)' />
    
    <math name='S_critical' simplify='full'>$a_over_b</math>
    
    <answer name='critNumAns'>
    <mathInput name="mi" />
    <award>$S_critical</award>
    </answer>
    <p><math name="m" extend="$mi" /></p>
    <p><math name="m2" extend="$critNumAns.submittedResponse" /></p>
    `;

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#m")).should("contain.text", "\uff3f");

        cy.get(cesc("#mi") + " textarea").type("x{enter}", { force: true });
        cy.get(cesc("#m")).should("contain.text", "x");
        cy.get(cesc("#m2")).should("contain.text", "x");

        cy.wait(2000); // wait for debounce

        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#m")).should("contain.text", "x");

        cy.log("core has not crashed and processes change in bi");
        cy.get(cesc("#mi") + " textarea")
            .type("{end}{backspace}y", { force: true })
            .blur();

        cy.get(cesc("#m")).should("contain.text", "y");

        cy.get(cesc("#mi") + " textarea").type("{enter}", { force: true });
        cy.get(cesc("#m")).should("contain.text", "y");
        cy.get(cesc("#m2")).should("contain.text", "y");
    });
});
