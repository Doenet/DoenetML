import { describe, expect, it } from "vitest";

import { getSchema } from "../scripts/get-schema";

describe("generated schema top-level elements", () => {
    it("uses document children to determine top-level elements", () => {
        const schema = getSchema();
        const elementsByName = Object.fromEntries(
            schema.elements.map((element) => [element.name, element]),
        );

        const documentElement = elementsByName.document;
        expect(documentElement).toBeDefined();

        const topElements = new Set(
            schema.elements
                .filter((element) => element.top)
                .map((element) => element.name),
        );
        const expectedTopElements = new Set([
            "document",
            ...documentElement.children,
        ]);

        expect(topElements).toEqual(expectedTopElements);
    });

    it("includes styleDefinition and feedbackDefinition as top-level elements", () => {
        const schema = getSchema();
        const elementsByName = Object.fromEntries(
            schema.elements.map((element) => [element.name, element]),
        );

        expect(elementsByName.document.children).toContain("styleDefinition");
        expect(elementsByName.styleDefinition.top).toBe(true);
        expect(elementsByName.document.children).toContain(
            "feedbackDefinition",
        );
        expect(elementsByName.feedbackDefinition.top).toBe(true);
    });

    it("does not include when as a top-level element", () => {
        const schema = getSchema();
        const elementsByName = Object.fromEntries(
            schema.elements.map((element) => [element.name, element]),
        );

        expect(elementsByName.document.children).not.toContain("when");
        expect(elementsByName.when.top).toBe(false);
    });

    it("includes boolean aliases for two-sided enum aliases", () => {
        const schema = getSchema();
        const elementsByName = Object.fromEntries(
            schema.elements.map((element) => [element.name, element]),
        );

        const sortAttribute = elementsByName.selectFromSequence.attributes.find(
            (attribute) => attribute.name === "sort",
        );

        expect(sortAttribute).toBeDefined();
        if (!sortAttribute) {
            throw new Error("Expected selectFromSequence.sort attribute");
        }
        expect(sortAttribute.values).toEqual(
            expect.arrayContaining([
                "unsorted",
                "increasing",
                "decreasing",
                "true",
                "false",
            ]),
        );
        // Compare value strings only — descriptions on enum entries are
        // free to be added or rewritten without churning this assertion,
        // since the contract being tested is "boolean aliases stay out of
        // autocompleteValues", not exact description text.
        expect(
            sortAttribute.autocompleteValues?.map((entry) => entry.value),
        ).toEqual(["unsorted", "increasing", "decreasing"]);
    });

    it("does not invent a missing false alias for one-sided attributes", () => {
        const schema = getSchema();
        const elementsByName = Object.fromEntries(
            schema.elements.map((element) => [element.name, element]),
        );

        const gridAttribute = elementsByName.graph.attributes.find(
            (attribute) => attribute.name === "grid",
        );

        expect(gridAttribute).toBeDefined();
        if (!gridAttribute) {
            throw new Error("Expected graph.grid attribute");
        }
        expect(gridAttribute.values).toBeUndefined();
        expect(gridAttribute.autocompleteValues).toBeUndefined();
    });

    describe("aliased elements carry children for context-aware LSP validation (#1174)", () => {
        // Before #1174, `AliasedSchemaElement` only carried help text. The
        // LSP fix needs `children` + `acceptsStringChildren` on the alias
        // entries so it can validate `<row>` inside `<matrix>` against the
        // alias target's child set rather than the tabular `<row>`'s.
        it("matrixRow declares the MathList child set, not the tabular row's", () => {
            const { aliasedElements } = getSchema();
            const matrixRow = aliasedElements.matrixRow;
            expect(matrixRow).toBeDefined();
            // MathList accepts `<math>` (and friends inheriting from it).
            expect(matrixRow.children).toContain("math");
            // MathList accepts string-content children (used to wrap math
            // text like `<row>x y z</row>`).
            expect(matrixRow.acceptsStringChildren).toBe(true);
        });

        it("matrixColumn declares the MathList child set", () => {
            const { aliasedElements } = getSchema();
            const matrixColumn = aliasedElements.matrixColumn;
            expect(matrixColumn).toBeDefined();
            expect(matrixColumn.children).toContain("math");
            expect(matrixColumn.acceptsStringChildren).toBe(true);
        });
    });
});
