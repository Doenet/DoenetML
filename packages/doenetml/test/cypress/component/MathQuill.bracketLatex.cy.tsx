import React from "react";
import { EditableMathField } from "../../../src/Viewer/renderers/mathquill/EditableMathField";

// MathQuill's LaTeX parser and the delimiters it writes as control sequences
// (Doenet/DoenetML#1336): `\langle`, `\rangle`, `\lVert` and `\rVert` reach the
// parser as commands rather than through `\left` / `\right`, and it used to read
// the single braced group an ordinary command takes. So `\langle 2, 3 \rangle`
// gave the bracket just the `2` and had nothing left for `\rangle`, failing the
// parse of the whole expression -- and a field whose LaTeX will not parse
// renders empty, which is what `prefillLatex="\langle 2, 3 \rangle"` showed.
//
// A field re-serializes what it parsed, always in `\left…\right` form, so its
// exported LaTeX is the parse result: `""` means the parse failed and the field
// is blank. That is what these cases assert.

/** LaTeX in, the LaTeX the mounted field exports back out. */
const CASES: Record<string, string> = {
    // The issue: both delimiters present, no `\left` / `\right`.
    "\\langle 2, 3 \\rangle": "\\left\\langle2,3\\right\\rangle",
    // Empty, the issue's second case.
    "\\langle  \\rangle": "\\left\\langle\\right\\rangle",
    // Still works when written the long way.
    "\\left\\langle 2, 3 \\right\\rangle": "\\left\\langle2,3\\right\\rangle",
    // The other control-sequence delimiter pair.
    "\\lVert x \\rVert": "\\left\\lVert x\\right\\rVert",
    // Nested, and nested inside a command's group.
    "\\langle \\langle a \\rangle, b \\rangle":
        "\\left\\langle\\left\\langle a\\right\\rangle,b\\right\\rangle",
    "\\frac{\\langle a, b \\rangle}{2}":
        "\\frac{\\left\\langle a,b\\right\\rangle}{2}",
    // An opening delimiter with no partner keeps all of its contents, rather
    // than closing after the first term. (`\left` alone would fail outright.)
    "\\langle 2, 3": "\\left\\langle2,3\\right\\rangle",
    // A closing delimiter has nothing to close over, and a mismatched pair is
    // rejected: unparseable, so the field stays blank as it always did.
    "\\rangle": "",
    "2, 3 \\rangle": "",
    "\\langle 2, 3 \\rVert": "",
    // `\ranglex` is an unknown command, not `\rangle` followed by `x`.
    "\\langle a \\ranglex": "",
};

/**
 * Mounts a field on `latex` and yields the LaTeX it exports back.
 *
 * `mathquillDidMount` is the only handle on the underlying MathField, so the
 * reference is captured through it. It fires from a mount effect, which runs
 * after `cy.mount` resolves, so wait on the markup MathQuill installs before
 * reading; the local starts null so a mount that never reports back fails
 * loudly instead of reusing the previous case's field.
 */
function exportedLatex(latex: string): Cypress.Chainable<string> {
    let field: any = null;
    cy.mount(
        <EditableMathField
            latex={latex}
            mathquillDidMount={(mf: any) => {
                field = mf;
            }}
        />,
    );
    cy.get(".mq-editable-field").should("exist");
    return cy.then(() => {
        expect(
            field,
            `field mounted for ${JSON.stringify(latex)}`,
        ).to.not.equal(null);
        return field.latex();
    });
}

describe("MathQuill parses bracket delimiters written without \\left and \\right", () => {
    it("renders the delimiter pairs it can match and stays blank otherwise", () => {
        const actual: Record<string, string> = {};

        for (const latex of Object.keys(CASES)) {
            exportedLatex(latex).then((exported) => {
                actual[latex] = exported;
            });
        }

        cy.then(() => {
            expect(actual).to.deep.equal(CASES);
        });
    });
});
