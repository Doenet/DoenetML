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
});
