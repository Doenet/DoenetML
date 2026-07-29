import { afterEach, describe, expect, it } from "vitest";

import { createComponentInfoObjects } from "../../doenetml-worker-javascript/src/utils/componentInfoObjects";
import { getSchema } from "../scripts/get-schema";

/**
 * These tests use the real component registry and mutate one field per
 * assertion to verify the schema-build hard-fails on missing summary/
 * description. Each test restores its mutation in `afterEach` so the
 * registry doesn't drift across tests.
 */
describe("schema build enforcement", () => {
    const infoObjects = createComponentInfoObjects();
    let restore: () => void = () => {};

    afterEach(() => {
        restore();
        restore = () => {};
    });

    it("throws when a component's summary is missing", () => {
        const cls = infoObjects.allComponentClasses.point as any;
        const original = cls.componentDocs;
        cls.componentDocs = { ...original, summary: undefined };
        restore = () => {
            cls.componentDocs = original;
        };
        expect(() => getSchema(infoObjects)).toThrow(
            /Invalid componentDocs.summary for `point`/,
        );
    });

    it("throws when a component's summary is an empty string", () => {
        const cls = infoObjects.allComponentClasses.point as any;
        const original = cls.componentDocs;
        cls.componentDocs = { ...original, summary: "   " };
        restore = () => {
            cls.componentDocs = original;
        };
        expect(() => getSchema(infoObjects)).toThrow(
            /Invalid componentDocs.summary for `point`/,
        );
    });

    it("throws when an attribute's description is missing", () => {
        const cls = infoObjects.allComponentClasses.point as any;
        const originalCreate = cls.createAttributesObject;
        cls.createAttributesObject = function () {
            const attrs = originalCreate.call(this);
            delete attrs.draggable.description;
            return attrs;
        };
        restore = () => {
            cls.createAttributesObject = originalCreate;
        };
        expect(() => getSchema(infoObjects)).toThrow(
            /Invalid description for attribute `\w+\.draggable`/,
        );
    });

    it("throws when an attribute's description is whitespace-only", () => {
        const cls = infoObjects.allComponentClasses.point as any;
        const originalCreate = cls.createAttributesObject;
        cls.createAttributesObject = function () {
            const attrs = originalCreate.call(this);
            attrs.draggable = { ...attrs.draggable, description: "   " };
            return attrs;
        };
        restore = () => {
            cls.createAttributesObject = originalCreate;
        };
        expect(() => getSchema(infoObjects)).toThrow(
            /Invalid description for attribute `\w+\.draggable`/,
        );
    });

    it("does not throw when an attribute with no description is excludeFromSchema", () => {
        const cls = infoObjects.allComponentClasses.point as any;
        const originalCreate = cls.createAttributesObject;
        cls.createAttributesObject = function () {
            const attrs = originalCreate.call(this);
            attrs.draggable = {
                ...attrs.draggable,
                description: undefined,
                excludeFromSchema: true,
            };
            return attrs;
        };
        restore = () => {
            cls.createAttributesObject = originalCreate;
        };
        expect(() => getSchema(infoObjects)).not.toThrow();
    });

    it("throws when a public state variable's description is missing", () => {
        // Access the cached publicStateVariableInfo for `point` and remove
        // the description on one state variable.
        const info = infoObjects.publicStateVariableInfo.point as any;
        const varName = Object.keys(info.stateVariableDescriptions).find(
            (n) => info.stateVariableDescriptions[n].description,
        )!;
        const originalDescription =
            info.stateVariableDescriptions[varName].description;
        info.stateVariableDescriptions[varName].description = undefined;
        restore = () => {
            info.stateVariableDescriptions[varName].description =
                originalDescription;
        };
        expect(() => getSchema(infoObjects)).toThrow(
            new RegExp(
                `Invalid description for property \`point\\.${varName}\``,
            ),
        );
    });

    it("throws when an attribute declares both validValues and suggestedValues", () => {
        // They are the enforcing and non-enforcing forms of the same list, so
        // declaring both says nothing coherent about whether an unlisted value
        // is an error.
        const cls = infoObjects.allComponentClasses.point as any;
        const originalCreate = cls.createAttributesObject;
        cls.createAttributesObject = function () {
            const attrs = originalCreate.call(this);
            attrs.draggable = {
                ...attrs.draggable,
                validValues: [{ value: "a", description: "A." }],
                suggestedValues: [{ value: "b", description: "B." }],
            };
            return attrs;
        };
        restore = () => {
            cls.createAttributesObject = originalCreate;
        };
        expect(() => getSchema(infoObjects)).toThrow(
            /declares both `validValues` and `suggestedValues`/,
        );
    });

    it("throws when a suggestedValues entry has no description", () => {
        // Suggestions reach the same autocomplete and help surfaces as
        // enumerated values, so they are held to the same bar — an entry with
        // no help text renders as a blank row.
        const cls = infoObjects.allComponentClasses.point as any;
        const originalCreate = cls.createAttributesObject;
        cls.createAttributesObject = function () {
            const attrs = originalCreate.call(this);
            attrs.draggable = {
                ...attrs.draggable,
                suggestedValues: [{ value: "a", description: "  " }],
            };
            return attrs;
        };
        restore = () => {
            cls.createAttributesObject = originalCreate;
        };
        expect(() => getSchema(infoObjects)).toThrow(
            /Invalid suggestedValues entry for `\w+\.draggable`/,
        );
    });

    it("emits suggestedValues as suggestions only, never as a constraint", () => {
        // The shape the whole non-enforcing path depends on:
        // `autocompleteValues` populated, `values` absent (so the language
        // server's "must be one of" check has nothing to fire on), and the
        // attribute's own type preserved rather than being recast as the
        // closed-set `keyword`.
        const cls = infoObjects.allComponentClasses.point as any;
        const originalCreate = cls.createAttributesObject;
        cls.createAttributesObject = function () {
            const attrs = originalCreate.call(this);
            attrs.labelPosition = {
                ...attrs.labelPosition,
                validValues: undefined,
                suggestedValues: [{ value: "a", description: "A." }],
            };
            return attrs;
        };
        restore = () => {
            cls.createAttributesObject = originalCreate;
        };
        const schema = getSchema(infoObjects);
        const point = schema.elements.find((e) => e.name === "point")!;
        const attr = point.attributes.find((a) => a.name === "labelPosition")!;
        expect(attr.autocompleteValues).toEqual([
            { value: "a", description: "A." },
        ]);
        expect(attr.values).toBeUndefined();
        expect(attr.suggestedValuesOnly).toBe(true);
        expect(attr.type).not.toBe("keyword");
    });
});
