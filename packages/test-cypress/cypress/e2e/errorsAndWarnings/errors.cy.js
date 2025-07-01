import { cesc } from "@doenet/utils";

describe("Error Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("Errors bubble up to where can be displayed", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
<text name="text1">
  <text>
    hello!
    <a name="a1">
  </text>
</text>

<graph>
  <point name="point1" coords="(4,5)"
</graph>

<point name="point2">(1,2)</point>
<text name="text2">afterwards</text>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#text1")).should("contain.text", "hello!");

        cy.get("#a1").should("contain.text", "Invalid component type: <a>");
        cy.get("#a1").should("contain.text", "lines 5–6");

        cy.get("#a1").should(
            "contain.text",
            'The tag `<a name="a1">` has no closing tag.',
        );
        cy.get("#a1").should("contain.text", "line 5");

        cy.get(cesc("#point1")).should("contain.text", "was not closed");
        cy.get(cesc("#point1")).should(
            "contain.text",
            "a `>` appears to be missing",
        );
        cy.get(cesc("#point1")).should("contain.text", "lines 10–11");

        cy.get(cesc("#point2")).should("have.text", "(1,2)");
        cy.get(cesc("#text2")).should("have.text", "afterwards");

        cy.window().then(async (win) => {
            let errorWarnings = win.returnErrorWarnings1();

            expect(errorWarnings.errors.length).eq(3);
            expect(errorWarnings.warnings.length).eq(0);

            expect(errorWarnings.errors[0].message).contain(
                'The tag `<a name="a1">` has no closing tag.',
            );
            expect(errorWarnings.errors[0].position.start.line).eq(5);
            expect(errorWarnings.errors[0].position.start.column).eq(5);
            expect(errorWarnings.errors[0].position.end.line).eq(5);
            expect(errorWarnings.errors[0].position.end.column).eq(18);

            expect(errorWarnings.errors[1].message).contain(
                "Invalid component type: <a>",
            );
            expect(errorWarnings.errors[1].position.start.line).eq(5);
            expect(errorWarnings.errors[1].position.start.column).eq(5);
            expect(errorWarnings.errors[1].position.end.line).eq(6);
            expect(errorWarnings.errors[1].position.end.column).eq(3);

            expect(errorWarnings.errors[2].message).contain("was not closed");
            expect(errorWarnings.errors[2].position.start.line).eq(10);
            expect(errorWarnings.errors[2].position.start.column).eq(3);
            expect(errorWarnings.errors[2].position.end.line).eq(10);
            expect(errorWarnings.errors[2].position.end.column).eq(9);
        });
    });
});
