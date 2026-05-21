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
    const ref = elementsByName.ref;
    const collect = elementsByName.collect;
    const math = elementsByName.math;
    const num = elementsByName.number;
    const mathInput = elementsByName.mathInput;
    const round = elementsByName.round;

    it("has the piloted components present in the generated schema", () => {
        // Asserted up front so later tests don't fail with confusing
        // TypeErrors if a piloted component is renamed or removed.
        expect(sequence).toBeDefined();
        expect(selectFromSequence).toBeDefined();
        expect(when).toBeDefined();
        expect(point).toBeDefined();
        expect(fn).toBeDefined();
        expect(ref).toBeDefined();
        expect(collect).toBeDefined();
    });

    it("types a plain reference-creating attribute as `reference`", () => {
        const from = collect.attributes.find(
            (attribute) => attribute.name === "from",
        );
        expect(from?.type).toBe("reference");
    });

    it("types a reference attribute that allows strings as `referenceOrText`", () => {
        // `<ref to>` sets `createReferences` and `allowStrings`, so it accepts
        // a URL string in addition to a component reference.
        const to = ref.attributes.find((attribute) => attribute.name === "to");
        expect(to?.type).toBe("referenceOrText");
    });

    it("populates element summary from static componentDocs", () => {
        expect(typeof sequence.summary).toBe("string");
        expect(sequence.summary.length).toBeGreaterThan(0);
        expect(typeof selectFromSequence.summary).toBe("string");
        expect(selectFromSequence.summary.length).toBeGreaterThan(0);
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

    it("falls back to a state variable's defaultValue when an attribute declares none", () => {
        // `padZeros`, `displayDigits`, and `displayDecimals` on `<number>`
        // are declared by `returnNumberDisplayAttributes()` without their
        // own `defaultValue` — the resting value lives on the state
        // variable so it can also be inherited from children/parents. The
        // schema generator should still surface that resting value as the
        // attribute's effective default.
        const padZeros = num.attributes.find((a) => a.name === "padZeros");
        const displayDigits = num.attributes.find(
            (a) => a.name === "displayDigits",
        );
        const displayDecimals = num.attributes.find(
            (a) => a.name === "displayDecimals",
        );
        expect(padZeros?.defaultValue).toBe(false);
        expect(displayDigits?.defaultValue).toBe(3);
        expect(displayDecimals?.defaultValue).toBe(2);
    });

    it("honors a component's `displayDigitsDefault` override on the state-variable fallback", () => {
        // Most components default `displayDigits` to 3 via the state
        // variable. `<mathInput>` (and `<matrixInput>`) override the state
        // def's `defaultValue` to 10, and `<round>` overrides it to 14, so
        // those overrides must flow through the state-variable fallback in
        // `get-schema.ts`. If the fallback were ever flattened back to the
        // attribute declaration, every component would silently revert to
        // 3 — pin all three so that regression is caught.
        const mathInputDD = mathInput.attributes.find(
            (a) => a.name === "displayDigits",
        );
        const roundDD = round.attributes.find(
            (a) => a.name === "displayDigits",
        );
        expect(mathInputDD?.defaultValue).toBe(10);
        expect(roundDD?.defaultValue).toBe(14);
    });

    it('encodes a math-expression default as { type: "math", latex } so the docs can render MathJax', () => {
        // `<math>`'s `assumptions` attribute defaults to
        // `me.fromAst("＿")`. Left alone it serializes opaquely as
        // `{ objectType: "math-expression", tree: "＿" }`; the schema
        // generator should replace it with a small `{ type: "math",
        // latex }` sentinel so docs-nextra can route it through MathJax.
        const assumptions = math.attributes.find(
            (a) => a.name === "assumptions",
        );
        expect(assumptions?.defaultValue).toEqual({
            type: "math",
            latex: "＿",
        });
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
