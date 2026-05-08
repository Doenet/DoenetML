import { describe, expect, it } from "vitest";

import { getSchema } from "../scripts/get-schema";

describe("generated schema help fields", () => {
    const schema = getSchema();
    const elementsByName = Object.fromEntries(
        schema.elements.map((element) => [element.name, element]),
    );

    const sequence = elementsByName.sequence;
    const selectFromSequence = elementsByName.selectFromSequence;

    it("populates element summary from static componentDocs", () => {
        expect(sequence.summary).toBeTruthy();
        expect(selectFromSequence.summary).toBeTruthy();
    });

    it("populates description on a component's own attribute", () => {
        const numToSelect = selectFromSequence.attributes.find(
            (attribute) => attribute.name === "numToSelect",
        );
        expect(numToSelect?.description).toBeTruthy();
    });

    it("flows attribute descriptions to subclasses through inheritance", () => {
        const fromOnSubclass = selectFromSequence.attributes.find(
            (attribute) => attribute.name === "from",
        );
        const fromOnParent = sequence.attributes.find(
            (attribute) => attribute.name === "from",
        );
        expect(fromOnSubclass?.description).toBeTruthy();
        expect(fromOnSubclass?.description).toBe(fromOnParent?.description);
    });

    it("reuses an attribute's description on its auto-created public property", () => {
        const numToSelectAttribute = selectFromSequence.attributes.find(
            (attribute) => attribute.name === "numToSelect",
        );
        const numToSelectProperty = selectFromSequence.properties.find(
            (property) => property.name === "numToSelect",
        );
        expect(numToSelectProperty?.description).toBeTruthy();
        expect(numToSelectProperty?.description).toBe(
            numToSelectAttribute?.description,
        );
    });
});
