import { afterEach, describe, expect, it, vi } from "vitest";
import { getOrInjectPattern, getPatternFillAttributes } from "./fillPatterns";

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

describe("getOrInjectPattern", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("warns once when an unsupported fillStyle falls back to solid", () => {
        const warnSpy = vi
            .spyOn(console, "warn")
            .mockImplementation(() => undefined);

        expect(
            getOrInjectPattern({
                defsEl: null,
                boardId: "board1",
                fillStyle: "zigzag",
                fillColor: "#abc",
                fillOpacity: 0.3,
                canvasColor: "white",
                fillPatternOpacity: 1,
            }),
        ).toBe("#abc");
        expect(
            getOrInjectPattern({
                defsEl: null,
                boardId: "board2",
                fillStyle: "zigzag",
                fillColor: "#def",
                fillOpacity: 0.3,
                canvasColor: "white",
                fillPatternOpacity: 1,
            }),
        ).toBe("#def");

        expect(warnSpy).toHaveBeenCalledTimes(1);
        expect(warnSpy.mock.calls[0][0]).toContain("zigzag");
    });

    it("does not warn for solid fills", () => {
        const warnSpy = vi
            .spyOn(console, "warn")
            .mockImplementation(() => undefined);

        expect(
            getOrInjectPattern({
                defsEl: null,
                boardId: "board1",
                fillStyle: "solid",
                fillColor: "#abc",
                fillOpacity: 0.3,
                canvasColor: "white",
                fillPatternOpacity: 1,
            }),
        ).toBe("#abc");

        expect(warnSpy).not.toHaveBeenCalled();
    });

    it("injects a background layer (canvas color at fillOpacity) plus a stroked foreground pattern (fillColor at fillPatternOpacity)", () => {
        const { defsEl } = makeFakeDefs();

        const url = getOrInjectPattern({
            defsEl,
            boardId: "board1",
            fillStyle: "horizontal",
            fillColor: "#abc",
            fillOpacity: 0.3,
            canvasColor: "white",
            fillPatternOpacity: 0.8,
        });

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

    it("bakes fillPatternOpacity into fill-opacity for filled foreground patterns (diamonds)", () => {
        const { defsEl } = makeFakeDefs();

        getOrInjectPattern({
            defsEl,
            boardId: "board1",
            fillStyle: "diamonds",
            fillColor: "#abc",
            fillOpacity: 0.3,
            canvasColor: "white",
            fillPatternOpacity: 0.8,
        });

        const [pattern] = (defsEl as any).children;
        const [background, foreground] = pattern.children;
        expect(background.tag).toBe("rect");
        expect(background.attributes["fill-opacity"]).toBe("0.3");

        // Filled patterns paint the mark with `fill` (not `stroke`).
        expect(foreground.tag).toBe("path");
        expect(foreground.attributes.fill).toBe("#abc");
        expect(foreground.attributes["fill-opacity"]).toBe("0.8");
        expect(foreground.attributes.stroke).toBe("none");
    });

    it("reuses an already-injected pattern instead of injecting it twice", () => {
        const { defsEl } = makeFakeDefs();

        const first = getOrInjectPattern({
            defsEl,
            boardId: "board1",
            fillStyle: "horizontal",
            fillColor: "#abc",
            fillOpacity: 0.3,
            canvasColor: "white",
            fillPatternOpacity: 1,
        });
        const second = getOrInjectPattern({
            defsEl,
            boardId: "board1",
            fillStyle: "horizontal",
            fillColor: "#abc",
            fillOpacity: 0.3,
            canvasColor: "white",
            fillPatternOpacity: 1,
        });

        expect(first).toBe(second);
        expect((defsEl as any).children).toHaveLength(1);
    });

    it("gives patterns that differ only in background opacity distinct ids", () => {
        const { defsEl } = makeFakeDefs();

        const faint = getOrInjectPattern({
            defsEl,
            boardId: "board1",
            fillStyle: "horizontal",
            fillColor: "#abc",
            fillOpacity: 0.2,
            canvasColor: "white",
            fillPatternOpacity: 1,
        });
        const strong = getOrInjectPattern({
            defsEl,
            boardId: "board1",
            fillStyle: "horizontal",
            fillColor: "#abc",
            fillOpacity: 0.8,
            canvasColor: "white",
            fillPatternOpacity: 1,
        });

        expect(faint).not.toBe(strong);
        expect((defsEl as any).children).toHaveLength(2);
    });
});

describe("getPatternFillAttributes", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("returns fillOpacity 1 (and highlight 0.5) for a pattern fill, since both opacities are baked into the tile", () => {
        const { defsEl } = makeFakeDefs();

        const attrs = getPatternFillAttributes({
            defsEl,
            boardId: "board1",
            fillStyle: "horizontal",
            fillColor: "#abc",
            fillOpacity: 0.3,
            canvasColor: "white",
            fillPatternOpacity: 0.8,
        });

        expect(attrs.fillColor).toMatch(/^url\(#doenet-fill-pattern-/);
        expect(attrs.highlightFillColor).toBe(attrs.fillColor);
        expect(attrs.fillOpacity).toBe(1);
        expect(attrs.highlightFillOpacity).toBe(0.5);
    });

    it("passes a solid fill through unchanged (plain color, authored opacities)", () => {
        const { defsEl } = makeFakeDefs();

        const attrs = getPatternFillAttributes({
            defsEl,
            boardId: "board1",
            fillStyle: "solid",
            fillColor: "#abc",
            fillOpacity: 0.3,
            canvasColor: "white",
            fillPatternOpacity: 0.8,
            highlightFillOpacity: 0.15,
        });

        expect(attrs.fillColor).toBe("#abc");
        expect(attrs.highlightFillColor).toBe("#abc");
        expect(attrs.fillOpacity).toBe(0.3);
        expect(attrs.highlightFillOpacity).toBe(0.15);
    });
});
