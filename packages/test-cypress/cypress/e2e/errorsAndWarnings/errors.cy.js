import { getDiagnosticsByType } from "../../support/diagnostics";

describe("Error Tests", { tags: ["@group2"] }, function () {
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

        cy.get("#text1").should("contain.text", "hello!");

        cy.get("#a1").should("contain.text", "Invalid component type: `<a>`");
        cy.get("#a1").should("contain.text", "lines 5–6");

        cy.get("#a1").should(
            "contain.text",
            'The tag `<a name="a1">` has no closing tag.',
        );
        cy.get("#a1").should("contain.text", "line 5");

        cy.get("#point1").should("contain.text", "was not closed");
        cy.get("#point1").should("contain.text", "a `>` appears to be missing");
        cy.get("#point1").should("contain.text", "lines 10–11");

        cy.get("#point2").should("have.text", "(1,2)");
        cy.get("#text2").should("have.text", "afterwards");

        cy.get(".doenet-viewer").should(
            "contain.text",
            "document contains errors",
        );

        cy.window().then(async (win) => {
            let diagnosticsByType = getDiagnosticsByType(
                win.returnDiagnostics1(),
            );

            expect(diagnosticsByType.errors.length).eq(3);
            expect(diagnosticsByType.warnings.length).eq(0);

            expect(diagnosticsByType.errors[0].message).contain(
                'The tag `<a name="a1">` has no closing tag.',
            );
            expect(diagnosticsByType.errors[0].position.start.line).eq(5);
            expect(diagnosticsByType.errors[0].position.start.column).eq(5);
            expect(diagnosticsByType.errors[0].position.end.line).eq(5);
            expect(diagnosticsByType.errors[0].position.end.column).eq(18);

            expect(diagnosticsByType.errors[1].message).contain(
                "Invalid component type: `<a>`",
            );
            expect(diagnosticsByType.errors[1].position.start.line).eq(5);
            expect(diagnosticsByType.errors[1].position.start.column).eq(5);
            expect(diagnosticsByType.errors[1].position.end.line).eq(6);
            expect(diagnosticsByType.errors[1].position.end.column).eq(3);

            expect(diagnosticsByType.errors[2].message).contain(
                "was not closed",
            );
            expect(diagnosticsByType.errors[2].position.start.line).eq(10);
            expect(diagnosticsByType.errors[2].position.start.column).eq(3);
            expect(diagnosticsByType.errors[2].position.end.line).eq(10);
            expect(diagnosticsByType.errors[2].position.end.column).eq(9);
        });
    });
});
