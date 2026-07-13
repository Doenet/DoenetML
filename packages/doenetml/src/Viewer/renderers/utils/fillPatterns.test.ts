import { afterEach, describe, expect, it, vi } from "vitest";
import { getOrInjectPattern } from "./fillPatterns";

/**
 * Minimal in-memory stand-in for the SVG `<defs>` element and its owner
 * document, exercising only the DOM surface `getOrInjectPattern` touches
 * (`createElementNS`, `setAttribute`, `appendChild`, `getElementById`). This
 * keeps the test runnable in vitest's default node environment (no DOM).
 */
function makeFakeDefs() {
    const registry = new Map<string, FakeElement>();

    type FakeElement = {
        tag: string;
        attributes: Record<string, string>;
        children: FakeElement[];
        setAttribute(name: string, value: string): void;
        appendChild(child: FakeElement): FakeElement;
    };

    function createElementNS(_ns: string, tag: string): FakeElement {
        return {
            tag,
            attributes: {},
            children: [],
            setAttribute(name, value) {
                this.attributes[name] = value;
                if (name === "id") {
                    registry.set(value, this);
                }
            },
            appendChild(child) {
                this.children.push(child);
                return child;
            },
        };
    }

    const ownerDocument = {
        createElementNS,
        getElementById: (id: string) => registry.get(id) ?? null,
    };

    const defsEl = {
        ownerDocument,
        children: [] as FakeElement[],
        appendChild(child: FakeElement) {
            this.children.push(child);
            return child;
        },
    } as unknown as SVGDefsElement & { children: FakeElement[] };

    return { defsEl };
}

describe("fillPatterns", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("warns once when an unsupported fillStyle falls back to solid", () => {
        const warnSpy = vi
            .spyOn(console, "warn")
            .mockImplementation(() => undefined);

        expect(
            getOrInjectPattern(
                null,
                "board1",
                "zigzag",
                "#abc",
                0.3,
                "white",
                1,
            ),
        ).toBe("#abc");
        expect(
            getOrInjectPattern(
                null,
                "board2",
                "zigzag",
                "#def",
                0.3,
                "white",
                1,
            ),
        ).toBe("#def");

        expect(warnSpy).toHaveBeenCalledTimes(1);
        expect(warnSpy.mock.calls[0][0]).toContain("zigzag");
    });

    it("does not warn for solid fills", () => {
        const warnSpy = vi
            .spyOn(console, "warn")
            .mockImplementation(() => undefined);

        expect(
            getOrInjectPattern(
                null,
                "board1",
                "solid",
                "#abc",
                0.3,
                "white",
                1,
            ),
        ).toBe("#abc");

        expect(warnSpy).not.toHaveBeenCalled();
    });

    it("injects a background layer (canvas color at fillOpacity) plus a foreground pattern (fillColor at fillPatternOpacity)", () => {
        const { defsEl } = makeFakeDefs();

        const url = getOrInjectPattern(
            defsEl,
            "board1",
            "horizontal",
            "#abc",
            0.3,
            "white",
            0.8,
        );

        expect(url).toMatch(/^url\(#doenet-fill-pattern-/);

        const patterns = (defsEl as any).children;
        expect(patterns).toHaveLength(1);
        const [pattern] = patterns;
        expect(pattern.tag).toBe("pattern");

        // Background rect drawn first, then the foreground path on top.
        const [background, foreground] = pattern.children;
        expect(background.tag).toBe("rect");
        expect(background.attributes.fill).toBe("white");
        expect(background.attributes["fill-opacity"]).toBe("0.3");

        expect(foreground.tag).toBe("path");
        expect(foreground.attributes.stroke).toBe("#abc");
        expect(foreground.attributes["stroke-opacity"]).toBe("0.8");
    });

    it("reuses an already-injected pattern instead of injecting it twice", () => {
        const { defsEl } = makeFakeDefs();

        const first = getOrInjectPattern(
            defsEl,
            "board1",
            "horizontal",
            "#abc",
            0.3,
            "white",
            1,
        );
        const second = getOrInjectPattern(
            defsEl,
            "board1",
            "horizontal",
            "#abc",
            0.3,
            "white",
            1,
        );

        expect(first).toBe(second);
        expect((defsEl as any).children).toHaveLength(1);
    });

    it("gives patterns that differ only in background opacity distinct ids", () => {
        const { defsEl } = makeFakeDefs();

        const faint = getOrInjectPattern(
            defsEl,
            "board1",
            "horizontal",
            "#abc",
            0.2,
            "white",
            1,
        );
        const strong = getOrInjectPattern(
            defsEl,
            "board1",
            "horizontal",
            "#abc",
            0.8,
            "white",
            1,
        );

        expect(faint).not.toBe(strong);
        expect((defsEl as any).children).toHaveLength(2);
    });
});
