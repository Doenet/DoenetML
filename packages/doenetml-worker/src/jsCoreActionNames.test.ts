import { describe, expect, it } from "vitest";
import { translateJsCoreActionName } from "./jsCoreActionNames";

describe("translateJsCoreActionName", () => {
    it("translates the graph components' mismatched action names", () => {
        // The prototype dispatches the rust action names; the JS core registers
        // different names for the graph components.
        expect(translateJsCoreActionName("point", "move")).toBe("movePoint");
        expect(translateJsCoreActionName("graph", "changeBoundingBox")).toBe(
            "changeAxisLimits",
        );
    });

    it("passes through action names that already match the JS core", () => {
        expect(translateJsCoreActionName("textInput", "updateValue")).toBe(
            "updateValue",
        );
        expect(
            translateJsCoreActionName("textInput", "updateImmediateValue"),
        ).toBe("updateImmediateValue");
    });

    it("passes through unknown component types and unmapped actions", () => {
        expect(translateJsCoreActionName("number", "someAction")).toBe(
            "someAction",
        );
        expect(translateJsCoreActionName("point", "switchPoint")).toBe(
            "switchPoint",
        );
        expect(translateJsCoreActionName(undefined, "move")).toBe("move");
    });
});
