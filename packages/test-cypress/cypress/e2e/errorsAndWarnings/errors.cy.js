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

            // Each error once, in whatever order they were reported: the
            // errors of converting the document are reported when it loads,
            // and those of the `_error` components as they are made.
            const errorWith = (text) =>
                diagnosticsByType.errors.find((error) =>
                    error.message.includes(text),
                );

            const noClosingTag = errorWith(
                'The tag `<a name="a1">` has no closing tag.',
            );
            expect(noClosingTag.position.start.line).eq(5);
            expect(noClosingTag.position.start.column).eq(5);
            expect(noClosingTag.position.end.line).eq(5);
            expect(noClosingTag.position.end.column).eq(18);

            const invalidType = errorWith("Invalid component type: `<a>`");
            expect(invalidType.position.start.line).eq(5);
            expect(invalidType.position.start.column).eq(5);
            expect(invalidType.position.end.line).eq(6);
            expect(invalidType.position.end.column).eq(3);

            const notClosed = errorWith("was not closed");
            expect(notClosed.position.start.line).eq(10);
            expect(notClosed.position.start.column).eq(3);
            expect(notClosed.position.end.line).eq(10);
            expect(notClosed.position.end.column).eq(9);
        });
    });
});
