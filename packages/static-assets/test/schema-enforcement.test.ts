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
            new RegExp(`Invalid description for property \`${varName}\``),
        );
    });
});
