import { toMathJaxString } from "../../../src/util/mathDisplay";

describe("List operator rendering", { tags: ["@group4"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("draws each result as a math or a number, separated by commas and in a graph", () => {
        let doenetML = `
    <text name="a">a</text>
    <mathInput name="n" prefill="3" />
    <numberList name="nl">
      <repeatForSequence from="1" to="$n" valueName="v"><number>$v</number></repeatForSequence>
    </numberList>
    <p name="pCum">Sums: <cumulativeSum name="cum">$nl</cumulativeSum>.</p>
    <p name="pCopy">Copy: $cum.</p>
    <p name="pNoList"><cumulativeSum name="noList" asList="false">1 2 3</cumulativeSum></p>
    <p name="pIndices"><sortIndices name="indices">30 10 20</sortIndices></p>
    <p name="pDigits"><cumulativeSum name="digits" displayDigits="2">1.234 2.345</cumulativeSum></p>
    <p name="pHidden">Hidden: <cumulativeSum hide>1 2</cumulativeSum>.</p>
    <graph name="g"><cumulativeSum name="cumG">1.25 2.5</cumulativeSum></graph>
    `;

        cy.window().then(async (win) => {
            win.postMessage({ doenetML }, "*");
        });

        cy.get("#a").should("have.text", "a"); //wait for page to load

        const maths = (values) => values.map(toMathJaxString).join(", ");

        cy.get("#cum").should("have.text", maths(["1", "3", "6"]));
        cy.get("#pCum").should("have.text", `Sums: ${maths(["1", "3", "6"])}.`);
        cy.get("#pCopy").should(
            "have.text",
            `Copy: ${maths(["1", "3", "6"])}.`,
        );
        cy.get("#noList").should(
            "have.text",
            ["1", "3", "6"].map(toMathJaxString).join(""),
        );
        // the indices are numbers, which render as text
        cy.get("#indices").should("have.text", "2, 3, 1");
        cy.get("#digits").should("have.text", maths(["1.2", "3.6"]));
        cy.get("#pHidden").should("have.text", "Hidden: .");
        // drawn in the graph as a math is, apart from the axes' integers
        cy.get("#g").should("contain.text", "1.25");
        cy.get("#g").should("contain.text", "3.75");

        cy.get("#n textarea").type("{end}{backspace}5{enter}", {
            force: true,
        });
        cy.get("#cum").should("have.text", maths(["1", "3", "6", "10", "15"]));
        cy.get("#pCopy").should(
            "have.text",
            `Copy: ${maths(["1", "3", "6", "10", "15"])}.`,
        );

        cy.get("#n textarea").type("{end}{backspace}0{enter}", {
            force: true,
        });
        cy.get("#pCum").should("have.text", "Sums: .");
        cy.get("#pCopy").should("have.text", "Copy: .");

        cy.get("#n textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get("#cum").should("have.text", maths(["1", "3"]));
    });
});
