import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { resolveCssVariables } from "./ContextHelpPanel";

// Vitest's default `node` environment has no DOM, so we stub the two globals
// `resolveCssVariables` reaches for: `document.documentElement` and
// `getComputedStyle`. Test colors live in a per-spec map and are returned by
// the stubbed `getPropertyValue`.
describe("resolveCssVariables", () => {
    const colors: Record<string, string> = {};
    const originalDocument = (globalThis as { document?: unknown }).document;
    const originalGetComputedStyle = (
        globalThis as { getComputedStyle?: unknown }
    ).getComputedStyle;

    beforeEach(() => {
        for (const key of Object.keys(colors)) {
            delete colors[key];
        }
        (globalThis as { document?: unknown }).document = {
            documentElement: {},
        };
        (globalThis as { getComputedStyle?: unknown }).getComputedStyle = () =>
            ({
                getPropertyValue: (name: string) => colors[name] ?? "",
            }) as CSSStyleDeclaration;
    });

    afterEach(() => {
        (globalThis as { document?: unknown }).document = originalDocument;
        (globalThis as { getComputedStyle?: unknown }).getComputedStyle =
            originalGetComputedStyle;
    });

    it("resolves a bare CSS variable to its computed value", () => {
        colors["--lightGreen"] = "#a6f19f";
        expect(resolveCssVariables("var(--lightGreen)")).toBe("#a6f19f");
    });

    it("resolves multiple CSS variables in one string", () => {
        colors["--mainBlue"] = "#1a5a99";
        colors["--mainRed"] = "#c1292e";
        expect(
            resolveCssVariables("1px solid var(--mainBlue) var(--mainRed)"),
        ).toBe("1px solid #1a5a99 #c1292e");
    });

    it("trims whitespace from the computed value", () => {
        colors["--mainGray"] = "  #e3e3e3  ";
        expect(resolveCssVariables("var(--mainGray)")).toBe("#e3e3e3");
    });

    it("tolerates internal whitespace in var(...)", () => {
        colors["--lightGreen"] = "#a6f19f";
        expect(resolveCssVariables("var(  --lightGreen  )")).toBe("#a6f19f");
    });

    it("leaves a var reference unchanged when no value is defined", () => {
        expect(resolveCssVariables("var(--never-defined)")).toBe(
            "var(--never-defined)",
        );
    });

    it("returns plain strings unchanged", () => {
        expect(resolveCssVariables("#123456")).toBe("#123456");
        expect(resolveCssVariables("hello world")).toBe("hello world");
    });

    it("is a no-op when the document is unavailable (SSR)", () => {
        (globalThis as { document?: unknown }).document = undefined;
        expect(resolveCssVariables("var(--lightGreen)")).toBe(
            "var(--lightGreen)",
        );
    });
});
