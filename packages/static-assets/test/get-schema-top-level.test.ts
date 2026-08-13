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
        // `grid` declares `suggestedValues`, so it carries the named spacings
        // in `autocompleteValues` while `values` stays absent — the attribute
        // also takes two numbers, so nothing is enforced. What must not appear
        // either way is a `false` alias: `grid` sets `valueForTrue` and no
        // `valueForFalse`, and only a two-sided pair contributes aliases.
        expect(gridAttribute.values).toBeUndefined();
        expect(
            gridAttribute.autocompleteValues?.map((entry) => entry.value),
        ).toEqual(["none", "medium", "dense", "1 1", "2 2"]);
        // The flag that keeps author-facing surfaces honest: the help panel
        // says "Suggested values" and autocomplete stays free-text.
        expect(gridAttribute.suggestedValuesOnly).toBe(true);
    });

    it("ol and ul offer their own marker values, and only ul enforces them", () => {
        const schema = getSchema();
        const elementsByName = Object.fromEntries(
            schema.elements.map((element) => [element.name, element]),
        );

        const markerOf = (elementName: string) => {
            const attribute = elementsByName[elementName]?.attributes.find(
                (attribute) => attribute.name === "marker",
            );
            if (!attribute) {
                throw new Error(`Expected ${elementName}.marker attribute`);
            }
            return attribute;
        };

        // `<ul>` overrides `<ol>`'s declaration, so the two must not leak into
        // each other: a bullet style does nothing on a numbered list and vice
        // versa.
        const olMarker = markerOf("ol");
        expect(
            olMarker.autocompleteValues?.map((entry) => entry.value),
        ).toEqual(["1", "a", "A", "i", "I"]);
        // Suggestions only: the renderer matches on the first character, so
        // decorated forms like `1.` are legitimate and must not be flagged.
        expect(olMarker.values).toBeUndefined();
        expect(olMarker.suggestedValuesOnly).toBe(true);

        const ulMarker = markerOf("ul");
        expect(ulMarker.values).toEqual(["disc", "circle", "square"]);
        expect(ulMarker.suggestedValuesOnly).toBeUndefined();
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

    describe("list-valued enumerated attributes are marked with isList", () => {
        it("sideBySide.valigns carries values, autocompleteValues, and isList", () => {
            const schema = getSchema();
            const elementsByName = Object.fromEntries(
                schema.elements.map((element) => [element.name, element]),
            );

            const valigns = elementsByName.sideBySide.attributes.find(
                (attribute) => attribute.name === "valigns",
            );
            expect(valigns).toBeDefined();
            if (!valigns) {
                throw new Error("Expected sideBySide.valigns attribute");
            }
            expect(valigns.type).toBe("keyword");
            expect(valigns.isList).toBe(true);
            expect(valigns.values).toEqual(["top", "middle", "bottom"]);
            expect(
                valigns.autocompleteValues?.map((entry) => entry.value),
            ).toEqual(["top", "middle", "bottom"]);
        });

        it("does not mark the scalar valign attribute as a list", () => {
            const schema = getSchema();
            const elementsByName = Object.fromEntries(
                schema.elements.map((element) => [element.name, element]),
            );

            const valign = elementsByName.sideBySide.attributes.find(
                (attribute) => attribute.name === "valign",
            );
            expect(valign).toBeDefined();
            if (!valign) {
                throw new Error("Expected sideBySide.valign attribute");
            }
            expect(valign.type).toBe("keyword");
            expect(valign.isList).toBeUndefined();
            expect(valign.values).toEqual(["top", "middle", "bottom"]);
        });
    });
});
