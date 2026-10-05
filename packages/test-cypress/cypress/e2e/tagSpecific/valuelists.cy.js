import { toMathJaxString } from "../../../src/util/mathDisplay";

describe("Value list rendering", { tags: ["@group4"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("draws each value by the renderer of its type, and follows changes", () => {
        let doenetML = `
    <text name="a">a</text>
    <mathInput name="mi" prefill="y" />
    <p name="pn">Numbers: <numberList name="nl">1 2.5 <number displayDigits="5">3.14159265</number></numberList>.</p>
    <p name="pm">Maths: <mathList name="ml">x $mi <math>z^2</math></mathList>.</p>
    <p name="pt">Texts: <textList name="tl">a b c</textList>.</p>
    <p name="pb">Booleans: <booleanList name="bl">true false</booleanList>.</p>
    <p name="pi">Intervals: <intervalList name="il">(1,2) [3,4]</intervalList>.</p>
    <p name="pRef">Reference: $tl.</p>
    <p name="pNoList"><numberList name="noList" asList="false">1 2 3</numberList></p>
    <point name="P" displayDigits="2">(1.23456, 2.34567)</point>
    <p name="pxs">Coordinates: $P.xs.</p>
    <mathInput name="mi2" bindValueTo="$nl[2]" />
    `;

        cy.window().then(async (win) => {
            win.postMessage({ doenetML }, "*");
        });

        cy.get("#a").should("have.text", "a"); //wait for page to load

        const maths = (values) => values.map(toMathJaxString).join(", ");

        cy.get("#pn").should("have.text", "Numbers: 1, 2.5, 3.1416.");
        cy.get("#pm").should("have.text", `Maths: ${maths(["x", "y", "z2"])}.`);
        cy.get("#pt").should("have.text", "Texts: a, b, c.");
        cy.get("#pb").should("have.text", "Booleans: true, false.");
        cy.get("#pi").should(
            "have.text",
            `Intervals: ${maths(["(1,2)", "[3,4]"])}.`,
        );
        cy.get("#pRef").should("have.text", "Reference: a, b, c.");
        cy.get("#noList").should("have.text", "123");
        cy.get("#pxs").should(
            "have.text",
            `Coordinates: ${maths(["1.2", "2.3"])}.`,
        );

        cy.get("#mi textarea").type("{end}{backspace}w{enter}", {
            force: true,
        });
        cy.get("#pm").should("have.text", `Maths: ${maths(["x", "w", "z2"])}.`);

        cy.get("#mi2 textarea").type(
            "{end}{backspace}{backspace}{backspace}7{enter}",
            {
                force: true,
            },
        );
        cy.get("#pn").should("have.text", "Numbers: 1, 7, 3.1416.");
    });
});
