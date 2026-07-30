import React from "react";
import { EditableMathField } from "../../../src/Viewer/renderers/mathquill/EditableMathField";
import type { MathField } from "../../../src/Viewer/renderers/mathquill/types";

// The delimiters MathQuill's LaTeX parser reads as commands rather than through
// `\left` / `\right` -- `\langle`, `\rangle`, `\lVert`, `\rVert` -- used to take
// only the one block an ordinary command takes, so `\langle 2, 3 \rangle` failed
// to parse and `prefillLatex="\langle 2, 3 \rangle"` rendered an empty field
// (Doenet/DoenetML#1336). See `Bracket.prototype.parser` in `mathquill.js`.
//
// A field re-serializes what it parsed, always in `\left…\right` form, so its
// exported LaTeX is the parse result and `""` means the parse failed and the
// field is blank. What the export cannot show is whether a bracket ended up a
// matched pair or a one-sided one, since the two serialize identically; the
// second test reads that off the DOM.

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
    // A matched close ends the bracket and leaves what follows it alone; the
    // `\rVert` used to take the `^2` as its block, rendering ‖v‖‖²‖.
    "\\lVert v \\rVert^2": "\\left\\lVert v\\right\\rVert^{2}",
    // Nested, and nested inside a command's group.
    "\\langle \\langle a \\rangle, b \\rangle":
        "\\left\\langle\\left\\langle a\\right\\rangle,b\\right\\rangle",
    "\\frac{\\langle a, b \\rangle}{2}":
        "\\frac{\\left\\langle a,b\\right\\rangle}{2}",
    // An opening delimiter with no partner keeps all of its contents, rather
    // than closing after the first term. (`\left` alone would fail outright.)
    "\\langle 2, 3": "\\left\\langle2,3\\right\\rangle",
    // On its own it is just the delimiter, which used to render nothing at all:
    // there was no block after it for the old parser to take.
    "\\langle": "\\left\\langle\\right\\rangle",
    // A closing delimiter has nothing to close over, wherever it sits, and a
    // mismatched pair is rejected: unparseable, so the field stays blank.
    // `2 \rangle 3` used to render 2⟨3⟩, wrapping what followed the stray close.
    "\\rangle": "",
    "2, 3 \\rangle": "",
    "2 \\rangle 3": "",
    "\\langle 2, 3 \\rVert": "",
    // `\ranglex` is an unknown command, not `\rangle` followed by `x`.
    "\\langle a \\ranglex": "",
};

/**
 * Mounts a field on `latex` and yields the MathField behind it.
 *
 * `mathquillDidMount` is the only handle on that object, and it fires from a
 * mount effect that runs after `cy.mount` resolves, so wait on the markup
 * MathQuill installs before reading. The local starts null so a mount that never
 * reports back fails loudly instead of reusing the previous case's field.
 */
function mountField(latex: string): Cypress.Chainable<MathField> {
    let field: MathField | null = null;
    cy.mount(
        <EditableMathField
            latex={latex}
            mathquillDidMount={(mf: MathField) => {
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
        return field as unknown as MathField;
    });
}

describe("MathQuill parses bracket delimiters written without \\left and \\right", () => {
    it("renders the delimiter pairs it can match and stays blank otherwise", () => {
        const actual: Record<string, string> = {};

        for (const latex of Object.keys(CASES)) {
            mountField(latex).then((field) => {
                actual[latex] = field.latex();
            });
        }

        cy.then(() => {
            expect(actual).to.deep.equal(CASES);
        });
    });

    it("leaves an unmatched opening delimiter one-sided", () => {
        // A one-sided bracket draws its missing partner as the greyed
        // `mq-ghost` that typing an unmatched bracket produces, where a matched
        // pair draws two real delimiters.
        mountField("\\langle 2, 3 \\rangle");
        cy.get(".mq-ghost").should("not.exist");

        mountField("\\langle 2, 3");
        cy.get(".mq-bracket-r.mq-ghost").should("exist");
        cy.get(".mq-bracket-l.mq-ghost").should("not.exist");
    });
});
