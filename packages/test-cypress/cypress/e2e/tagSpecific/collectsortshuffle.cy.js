import { toMathJaxString } from "../../../src/util/mathDisplay";

describe(
    "Collect, sort and shuffle rendering",
    { tags: ["@group4"] },
    function () {
        beforeEach(() => {
            cy.clearIndexedDB();
            cy.visit("/");
        });

        it("draws the values, leaving out hidden ones, and follows changes", () => {
            let doenetML = `
    <text name="a">a</text>
    <mathInput name="mi" prefill="4" />
    <booleanInput name="h" />
    <section name="s">
      <math>y</math>
      <math hide="$h">z</math>
      <math displayDigits="2">3.14159</math>
    </section>
    <p name="pc">Collected: <collect componentType="math" from="$s" name="c" />.</p>
    <p name="pcRef">Again: $c.</p>
    <p name="ps">Sorted: <sort name="srt">5 $mi 1</sort>.</p>
    <p name="pt">Texts: <sort>kiwi apple fig</sort>.</p>
    <p name="psh">Shuffled: <shuffle name="sh">x y z</shuffle>.</p>
    <mathInput name="mi2" bindValueTo="$srt[3]" />
    `;

            cy.window().then(async (win) => {
                win.postMessage({ doenetML }, "*");
            });

            cy.get("#a").should("have.text", "a"); //wait for page to load

            const maths = (values) => values.map(toMathJaxString).join(", ");

            cy.get("#pc").should(
                "have.text",
                `Collected: ${maths(["y", "z", "3.1"])}.`,
            );
            cy.get("#pcRef").should(
                "have.text",
                `Again: ${maths(["y", "z", "3.1"])}.`,
            );
            cy.get("#ps").should("have.text", "Sorted: 1, 4, 5.");
            cy.get("#pt").should("have.text", "Texts: apple, fig, kiwi.");
            cy.get("#psh")
                .invoke("text")
                .then((text) => {
                    expect(text.startsWith("Shuffled: ")).eq(true);
                    const values = text.slice(10, -1).split(", ");
                    expect(values.length).eq(3);
                });

            // a hidden value is left out, with its comma
            cy.get("#h").click();
            cy.get("#pc").should(
                "have.text",
                `Collected: ${maths(["y", "3.1"])}.`,
            );
            cy.get("#pcRef").should(
                "have.text",
                `Again: ${maths(["y", "3.1"])}.`,
            );

            // a changed value is sorted into its place
            cy.get("#mi textarea").type("{end}{backspace}7{enter}", {
                force: true,
            });
            cy.get("#ps").should("have.text", "Sorted: 1, 5, 7.");

            // a value written to a sorted entry goes to its source, `$mi`, and
            // is sorted again
            cy.get("#mi2 textarea").type("{end}{backspace}0{enter}", {
                force: true,
            });
            cy.get("#ps").should("have.text", "Sorted: 0, 1, 5.");
        });
    },
);
