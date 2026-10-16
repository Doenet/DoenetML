import { toMathJaxString } from "../../../src/util/mathDisplay";

describe("Sequence and sampler rendering", { tags: ["@group4"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("draws each value as a number, a math or a text, as their number changes", () => {
        let doenetML = `
    <text name="a">a</text>
    <mathInput name="n" prefill="3" />
    <p name="pn">Numbers: <sequence name="sn" length="$n" />.</p>
    <p name="pl">Letters: <sequence name="sl" type="letters" length="$n" />.</p>
    <p name="pm">Maths: <sequence name="sm" type="math" from="x" step="y" length="$n" />.</p>
    <p name="pCopy">Copy: $sl.</p>
    <p name="pNoList"><sequence name="noList" length="3" asList="false" /></p>
    <p name="pPrimes"><selectPrimeNumbers name="primes" numToSelect="2" minValue="2" maxValue="3" sort /></p>
    <p name="pSelect"><selectFromSequence name="sel" type="letters" from="c" to="c" /></p>
    <graph name="g"><sequence name="sg" from="1.25" step="1.25" length="2" /></graph>
    `;

        cy.window().then(async (win) => {
            win.postMessage({ doenetML }, "*");
        });

        cy.get("#a").should("have.text", "a"); //wait for page to load

        const maths = (values) => values.map(toMathJaxString).join(", ");

        cy.get("#pn").should("have.text", "Numbers: 1, 2, 3.");
        cy.get("#pl").should("have.text", "Letters: a, b, c.");
        cy.get("#pm").should(
            "have.text",
            `Maths: ${maths(["x", "x+y", "x+2y"])}.`,
        );
        cy.get("#pCopy").should("have.text", "Copy: a, b, c.");
        cy.get("#noList").should("have.text", "123");
        cy.get("#primes").should("have.text", "2, 3");
        cy.get("#sel").should("have.text", "c");
        cy.get("#g").should("contain.text", "1.25");
        cy.get("#g").should("contain.text", "2.5");

        cy.get("#n textarea").type("{end}{backspace}5{enter}", {
            force: true,
        });
        cy.get("#pn").should("have.text", "Numbers: 1, 2, 3, 4, 5.");
        cy.get("#pl").should("have.text", "Letters: a, b, c, d, e.");
        cy.get("#pCopy").should("have.text", "Copy: a, b, c, d, e.");

        cy.get("#n textarea").type("{end}{backspace}0{enter}", {
            force: true,
        });
        cy.get("#pn").should("have.text", "Numbers: .");
        cy.get("#pCopy").should("have.text", "Copy: .");

        cy.get("#n textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get("#pl").should("have.text", "Letters: a, b.");
    });

    it("a selection that cannot be made shows its error", () => {
        let doenetML = `
    <text name="a">a</text>
    <section><p name="p">Selected: <selectFromSequence from="1" to="3" numToSelect="5" />.</p></section>
    `;

        cy.window().then(async (win) => {
            win.postMessage({ doenetML }, "*");
        });

        cy.get("#a").should("have.text", "a"); //wait for page to load

        // the error is shown after the select, which shows nothing
        cy.get("#p").should(
            "contain.text",
            "Selected: Error: Cannot select 5 values from a sequence of length 3.",
        );
    });
});
