import { cesc2 } from "@doenet/utils";

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
<text>
  <text>
    hello!
    <a>
  </text>
</text>

<graph>
  <point coords="(4,5)"
</graph>

<point>(1,2)</point>
<text>afterwards</text>
    `,
                },
                "*",
            );
        });

        cy.get(cesc2("#/_text1")).should("contain.text", "hello!");
        cy.get(cesc2("#/__error1")).should(
            "contain.text",
            "Missing closing tag",
        );
        cy.get(cesc2("#/__error1")).should("contain.text", "Expected </a>");
        cy.get(cesc2("#/__error1")).should("contain.text", "lines 5–6");
        cy.get(cesc2("#/_a1")).should(
            "contain.text",
            "Invalid component type: <a>",
        );
        cy.get(cesc2("#/_a1")).should("contain.text", "lines 5–6");

        cy.get(cesc2("#/__error2")).should(
            "contain.text",
            "Missing closing tag",
        );
        cy.get(cesc2("#/__error2")).should("contain.text", "Expected </point>");
        cy.get(cesc2("#/__error2")).should("contain.text", "line 10");

        cy.get(cesc2("#/_point1")).should(
            "contain.text",
            "Error in opening <point> tag",
        );
        cy.get(cesc2("#/_point1")).should(
            "contain.text",
            `Found <point coords="(4,5)"`,
        );
        cy.get(cesc2("#/_point1")).should("contain.text", "line 10");

        cy.get(cesc2("#/_point2")).should("have.text", "(1,2)");
        cy.get(cesc2("#/_text3")).should("have.text", "afterwards");

        cy.window().then(async (win) => {
            let errorWarnings = win.returnErrorWarnings1();

            expect(errorWarnings.errors.length).eq(4);
            expect(errorWarnings.warnings.length).eq(0);

            expect(errorWarnings.errors[0].message).contain(
                "Missing closing tag",
            );
            expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(6);
            expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(2);
            expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(6);
            expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(2);

            expect(errorWarnings.errors[1].message).contain(
                "Error in opening <point> tag",
            );
            expect(errorWarnings.errors[1].doenetMLrange.lineBegin).eq(10);
            expect(errorWarnings.errors[1].doenetMLrange.charBegin).eq(3);
            expect(errorWarnings.errors[1].doenetMLrange.lineEnd).eq(10);
            expect(errorWarnings.errors[1].doenetMLrange.charEnd).eq(23);

            expect(errorWarnings.errors[2].message).contain(
                "Missing closing tag",
            );
            expect(errorWarnings.errors[2].doenetMLrange.lineBegin).eq(10);
            expect(errorWarnings.errors[2].doenetMLrange.charBegin).eq(24);
            expect(errorWarnings.errors[2].doenetMLrange.lineEnd).eq(10);
            expect(errorWarnings.errors[2].doenetMLrange.charEnd).eq(24);

            expect(errorWarnings.errors[3].message).contain(
                "Invalid component type: <a>",
            );
            expect(errorWarnings.errors[3].doenetMLrange.lineBegin).eq(5);
            expect(errorWarnings.errors[3].doenetMLrange.charBegin).eq(5);
            expect(errorWarnings.errors[3].doenetMLrange.lineEnd).eq(6);
            expect(errorWarnings.errors[3].doenetMLrange.charEnd).eq(2);
        });
    });
});
