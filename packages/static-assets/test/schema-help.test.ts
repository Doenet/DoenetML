import { describe, expect, it } from "vitest";

import { getSchema } from "../scripts/get-schema";

describe("generated schema help fields", () => {
    const schema = getSchema();
    const elementsByName = Object.fromEntries(
        schema.elements.map((element) => [element.name, element]),
    );

    const sequence = elementsByName.sequence;
    const selectFromSequence = elementsByName.selectFromSequence;
    const when = elementsByName.when;
    const point = elementsByName.point;
    const fn = elementsByName.function;

    it("has the piloted components present in the generated schema", () => {
        // Asserted up front so later tests don't fail with confusing
        // TypeErrors if a piloted component is renamed or removed.
        expect(sequence).toBeDefined();
        expect(selectFromSequence).toBeDefined();
        expect(when).toBeDefined();
        expect(point).toBeDefined();
        expect(fn).toBeDefined();
    });

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

    it("flags properties auto-created from a same-named attribute with fromAttribute: true", () => {
        const numToSelectProperty = selectFromSequence.properties.find(
            (property) => property.name === "numToSelect",
        );
        expect(numToSelectProperty?.fromAttribute).toBe(true);
    });

    it("does not flag explicitly defined state-variable properties with fromAttribute", () => {
        // `doenetML` is an explicit state variable defined in
        // returnStateVariableDefinitions(), not auto-derived from an attribute.
        const doenetML = selectFromSequence.properties.find(
            (property) => property.name === "doenetML",
        );
        expect(doenetML).toBeDefined();
        expect(doenetML?.fromAttribute).not.toBe(true);
    });

    it("propagates description from an additionalStateVariablesDefined sibling to the schema property", () => {
        // <when> defines `value` with two siblings via additionalStateVariablesDefined;
        // a description authored on the sibling object literal must reach the schema.
        const fractionSatisfied = when.properties.find(
            (property) => property.name === "fractionSatisfied",
        );
        expect(fractionSatisfied).toBeDefined();
        expect(fractionSatisfied?.description).toBe(
            "Fraction of the boolean condition that is satisfied (0 to 1).",
        );
    });

    it("uses an alias state variable's own description when set (alias to a regular state variable)", () => {
        // `value` on <point> is `{ isAlias: true, targetVariableName: "coords",
        // description: "..." }`. The alias's own description must surface
        // rather than `coords`'s description.
        const valueProp = point.properties.find(
            (property) => property.name === "value",
        );
        const coordsProp = point.properties.find(
            (property) => property.name === "coords",
        );
        expect(valueProp?.description).toBe(
            "The point's coordinates as a single math expression.",
        );
        expect(coordsProp?.description).toBe(
            "The point's coordinates as a math expression.",
        );
        expect(valueProp?.description).not.toBe(coordsProp?.description);
    });

    it("uses an alias state variable's own description when set (alias to an array entry)", () => {
        // `x` on <point> is `{ isAlias: true, targetVariableName: "x1", description: "..." }`,
        // pointing at the first entry of the `xs` array. The alias's own
        // description must surface rather than `xs`'s description.
        const xProp = point.properties.find(
            (property) => property.name === "x",
        );
        const xsProp = point.properties.find(
            (property) => property.name === "xs",
        );
        expect(xProp?.description).toBe(
            "The first coordinate (x) of the point.",
        );
        expect(xsProp?.description).toBe("The point's coordinates as a list.");
        expect(xProp?.description).not.toBe(xsProp?.description);
    });

    it("uses a schema subarray's own description when set", () => {
        // `<function>`'s `maxima` array exposes a schema subarray
        // `maximumLocations` with its own description; the subarray's
        // description must surface rather than the parent array's.
        const maximumLocations = fn.properties.find(
            (property) => property.name === "maximumLocations",
        );
        const maxima = fn.properties.find(
            (property) => property.name === "maxima",
        );
        expect(maximumLocations?.description).toBe(
            "The x-coordinates of the function's local maxima.",
        );
        expect(maxima?.description).toBe("Local maxima of the function.");
        expect(maximumLocations?.description).not.toBe(maxima?.description);
    });
});
