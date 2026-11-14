import { describe, expect, it } from "vitest";
import {
    fitMathKeyWidth,
    MATH_KEY_STRIP_COLORS,
    MATH_KEY_STRIP_KEYS,
    MATH_KEY_STRIP_SIZES,
    MATH_KEY_STRIP_MOVE_RIGHT_KEY,
    mathKeyStripLabels,
    nextMathKeyIndex,
    placeMathKeyStrip,
    scrollToClearMathKeyStrip,
} from "./math-key-strip";
import {
    iframeRectToHost,
    readKeyboardFocusMessage,
} from "./host-math-key-strip";

describe("the keys", () => {
    it("are in the order settled on, with move right pinned apart", () => {
        expect(MATH_KEY_STRIP_KEYS.map((k) => k.name)).toEqual([
            "union",
            "infinity",
            "nthRoot",
            "fraction",
            "power",
            "pi",
            "intersection",
            "leq",
            "geq",
            "lt",
            "gt",
            "neq",
            "abs",
            "plusMinus",
        ]);
        expect(MATH_KEY_STRIP_KEYS).not.toContain(
            MATH_KEY_STRIP_MOVE_RIGHT_KEY,
        );
    });

    it("type what the key says", () => {
        const commands = Object.fromEntries(
            [...MATH_KEY_STRIP_KEYS, MATH_KEY_STRIP_MOVE_RIGHT_KEY].map((k) => [
                k.name,
                k.commands,
            ]),
        );
        expect(commands.union).toEqual([{ type: "write", command: "\\cup" }]);
        expect(commands.intersection).toEqual([
            { type: "write", command: "\\cap" },
        ]);
        expect(commands.infinity).toEqual([
            { type: "write", command: "\\infty" },
        ]);
        expect(commands.pi).toEqual([{ type: "write", command: "\\pi" }]);
        expect(commands.fraction).toEqual([{ type: "cmd", command: "/" }]);
        expect(commands.power).toEqual([{ type: "cmd", command: "^" }]);
        expect(commands.nthRoot).toEqual([
            { type: "write", command: "\\sqrt[]{}" },
            { type: "keystroke", command: "Left" },
            { type: "keystroke", command: "Left" },
        ]);
        expect(commands.plusMinus).toEqual([
            { type: "write", command: "\\pm" },
        ]);
        // The right arrow, as the hardware key and the full keyboard's
        // arrow: what readers already use to leave an exponent.
        expect(commands.moveRight).toEqual([
            { type: "keystroke", command: "Right" },
        ]);
    });

    it("have unique names and a glyph each", () => {
        const all = [...MATH_KEY_STRIP_KEYS, MATH_KEY_STRIP_MOVE_RIGHT_KEY];
        expect(new Set(all.map((k) => k.name)).size).toBe(all.length);
        for (const key of all) {
            expect(key.glyph.length).toBeGreaterThan(0);
            expect(key.commands.length).toBeGreaterThan(0);
        }
    });

    it("are named in words, the strip too", () => {
        const labels = mathKeyStripLabels();
        expect(labels.toolbar).toBe("Math keys");
        expect(labels.union).toBe("union");
        expect(labels.nthRoot).toBe("nth root");
        expect(labels.moveRight).toBe("move right");
        for (const key of [
            ...MATH_KEY_STRIP_KEYS,
            MATH_KEY_STRIP_MOVE_RIGHT_KEY,
        ]) {
            // A word, not the glyph: a screen reader would otherwise read
            // "n square root" or nothing at all.
            expect(labels[key.name]).toMatch(/^[a-z ]+$/);
        }
    });

    it("take their names from the translator", () => {
        const labels = mathKeyStripLabels((key) => `<${key}>`);
        expect(labels.union).toBe("<math-key-union>");
        expect(labels.toolbar).toBe("<math-key-strip>");
    });
});

describe("fitMathKeyWidth", () => {
    const { gap, minKeyWidth, maxKeyWidth, baseKeyWidth } =
        MATH_KEY_STRIP_SIZES;
    const count = MATH_KEY_STRIP_KEYS.length;

    /** How many keys, counting a part key as a fraction, fit in `available`. */
    function keysInView(available: number, width: number) {
        return (available + gap) / (width + gap);
    }

    it.each([150, 200, 256, 300, 326, 400, 500])(
        "cuts the last key in view about in half at %ipx",
        (available) => {
            const width = fitMathKeyWidth(available, count);
            expect(width).toBeGreaterThanOrEqual(minKeyWidth);
            expect(width).toBeLessThanOrEqual(maxKeyWidth);
            const fraction = keysInView(available, width) % 1;
            // Half a key is showing, give or take the gap.
            expect(fraction).toBeGreaterThan(0.3);
            expect(fraction).toBeLessThan(0.7);
        },
    );

    it("keeps the base width when every key fits", () => {
        expect(fitMathKeyWidth(2000, count)).toBe(baseKeyWidth);
    });

    it("keeps the base width when there is no room to measure", () => {
        expect(fitMathKeyWidth(0, count)).toBe(baseKeyWidth);
        expect(fitMathKeyWidth(40, count)).toBe(baseKeyWidth);
    });

    it("never goes below the WCAG 2.2 AA target size", () => {
        for (let available = 50; available < 800; available += 7) {
            expect(fitMathKeyWidth(available, count)).toBeGreaterThanOrEqual(
                24,
            );
        }
    });
});

describe("placeMathKeyStrip", () => {
    it("sits on the bottom edge of the visual viewport", () => {
        // A 390x844 phone, keyboard up (visual viewport 390x500), page
        // scrolled so the visual viewport starts 120px into the layout one.
        expect(
            placeMathKeyStrip(
                { offsetTop: 120, offsetLeft: 0, width: 390, height: 500 },
                54,
            ),
        ).toEqual({ top: 566, left: 0, width: 390 });
    });

    it("follows a pinch zoom", () => {
        expect(
            placeMathKeyStrip(
                { offsetTop: 10, offsetLeft: 80, width: 195, height: 300 },
                54,
            ),
        ).toEqual({ top: 256, left: 80, width: 195 });
    });
});

describe("scrollToClearMathKeyStrip", () => {
    it("does nothing when the input is clear of the strip", () => {
        expect(
            scrollToClearMathKeyStrip({ top: 100, bottom: 140 }, 400, 0),
        ).toBe(0);
    });

    it("scrolls by the overlap plus the margin", () => {
        expect(
            scrollToClearMathKeyStrip({ top: 380, bottom: 420 }, 400, 0),
        ).toBe(28);
    });

    it("never scrolls the top of the input out of view", () => {
        // 300px tall box with 260px room above the strip.
        expect(
            scrollToClearMathKeyStrip({ top: 150, bottom: 450 }, 400, 140),
        ).toBe(2);
        expect(
            scrollToClearMathKeyStrip({ top: 140, bottom: 450 }, 400, 140),
        ).toBe(0);
    });
});

describe("nextMathKeyIndex", () => {
    it("moves by arrow keys and wraps", () => {
        expect(nextMathKeyIndex(0, "ArrowRight", 15)).toBe(1);
        expect(nextMathKeyIndex(14, "ArrowRight", 15)).toBe(0);
        expect(nextMathKeyIndex(0, "ArrowLeft", 15)).toBe(14);
    });

    it("jumps with Home and End", () => {
        expect(nextMathKeyIndex(7, "Home", 15)).toBe(0);
        expect(nextMathKeyIndex(7, "End", 15)).toBe(14);
    });

    it("leaves other keys alone", () => {
        expect(nextMathKeyIndex(3, "Enter", 15)).toBeNull();
        expect(nextMathKeyIndex(3, " ", 15)).toBeNull();
        expect(nextMathKeyIndex(3, "Tab", 15)).toBeNull();
    });
});

describe("colors", () => {
    function luminance(hex: string) {
        const [r, g, b] = [1, 3, 5].map((i) => {
            const c = parseInt(hex.slice(i, i + 2), 16) / 255;
            return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    function contrast(a: string, b: string) {
        const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
        return (hi + 0.05) / (lo + 0.05);
    }

    it.each(["light", "dark"] as const)(
        "meet WCAG 2.2 AA contrast in %s",
        (theme) => {
            const c = MATH_KEY_STRIP_COLORS[theme];
            // 1.4.3: key text, at rest and pressed.
            expect(contrast(c.keyText, c.keyBackground)).toBeGreaterThanOrEqual(
                4.5,
            );
            expect(
                contrast(c.keyText, c.keyPressedBackground),
            ).toBeGreaterThanOrEqual(4.5);
            // 1.4.11: the key's outline against the key and the strip.
            expect(
                contrast(c.keyBorder, c.keyBackground),
            ).toBeGreaterThanOrEqual(3);
            expect(
                contrast(c.keyBorder, c.stripBackground),
            ).toBeGreaterThanOrEqual(3);
            // 1.4.11 / 2.4.7: the focus ring against both.
            expect(
                contrast(c.focusRing, c.keyBackground),
            ).toBeGreaterThanOrEqual(3);
            expect(
                contrast(c.focusRing, c.stripBackground),
            ).toBeGreaterThanOrEqual(3);
        },
    );
});

describe("host page messages", () => {
    it("reads a focus report with the input's position", () => {
        expect(
            readKeyboardFocusMessage({
                subject: "keyboard-focus",
                mathInputFocused: true,
                inputRect: { top: 10, bottom: 50 },
            }),
        ).toEqual({ focused: true, inputRect: { top: 10, bottom: 50 } });
    });

    it("reads a focus report from a viewer that sends no position", () => {
        expect(
            readKeyboardFocusMessage({
                subject: "keyboard-focus",
                mathInputFocused: false,
            }),
        ).toEqual({ focused: false, inputRect: null });
    });

    it("ignores a malformed position", () => {
        expect(
            readKeyboardFocusMessage({
                subject: "keyboard-focus",
                mathInputFocused: true,
                inputRect: { top: "10", bottom: null },
            })?.inputRect,
        ).toBeNull();
    });

    it("ignores other messages", () => {
        expect(readKeyboardFocusMessage(null)).toBeNull();
        expect(readKeyboardFocusMessage("keyboard-focus")).toBeNull();
        expect(
            readKeyboardFocusMessage({ subject: "keyboard", keyCommands: [] }),
        ).toBeNull();
        expect(
            readKeyboardFocusMessage({ subject: "SPLICE.reportScoreAndState" }),
        ).toBeNull();
    });

    it("moves the iframe's box onto the host page", () => {
        expect(iframeRectToHost({ top: 10, bottom: 50 }, 300)).toEqual({
            top: 310,
            bottom: 350,
        });
    });
});
