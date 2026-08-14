/**
 * Smoke test for the built engine.
 *
 * It exercises the surface DoenetML actually leans on — `fromAst`/`.tree` (the
 * two hottest calls by a wide margin), the reviver round-trip that every state
 * serialization goes through, `.f()`, and a handful of symbolic operations —
 * rather than testing math-expressions itself, which upstream already does.
 *
 * It imports `../dist/`, not `../src/`, so it also covers the build: the WASM
 * really was inlined, the bytes decode, and instantiation succeeds under node.
 * Build first:
 *
 *   npm run build -w packages/math && npm run test -w packages/math
 */
import { describe, expect, it } from "vitest";
import me, { engineName, getComponent, isTree } from "../dist/index.js";

describe(`math engine (${engineName})`, () => {
    it("parses text", () => {
        expect(me.fromText("x+1").tree).toEqual(["+", "x", 1]);
    });

    it("round-trips an AST through fromAst/.tree", () => {
        const tree = ["+", ["*", 2, "x"], 1];
        expect(me.fromAst(tree).tree).toEqual(tree);
    });

    it("recognizes trees", () => {
        expect(isTree(["+", "x", 1])).toBe(true);
        expect(isTree({ notATree: true })).toBe(false);
    });

    it("survives the JSON reviver round-trip DoenetML serializes state with", () => {
        const expr = me.fromText("x^2+1");
        const revived = JSON.parse(JSON.stringify({ expr }), me.reviver);
        expect(revived.expr.tree).toEqual(expr.tree);
    });

    it("tests equality", () => {
        expect(me.fromText("(x+1)^2").equals(me.fromText("x^2+2x+1"))).toBe(
            true,
        );
        expect(me.fromText("x+1").equals(me.fromText("x+2"))).toBe(false);
    });

    it("evaluates to a constant", () => {
        expect(me.fromText("2+3").evaluate_to_constant()).toBe(5);
    });

    it("differentiates", () => {
        expect(
            me.fromText("x^2").derivative("x").evaluate_to_constant,
        ).toBeTypeOf("function");
        expect(
            me
                .fromText("x^2")
                .derivative("x")
                .substitute({ x: 3 })
                .evaluate_to_constant(),
        ).toBe(6);
    });

    it("renders to text and latex", () => {
        expect(me.fromText("x/2").toString()).toContain("x");
        expect(me.fromText("x/2").toLatex()).toContain("frac");
    });

    it("compiles to a numeric function via .f()", () => {
        const f = me.fromText("x^2+1").f();
        expect(f({ x: 3 })).toBe(10);
    });

    it("reports variables", () => {
        expect(me.fromText("x+y").variables().sort()).toEqual(["x", "y"]);
    });

    // `getComponent` is a `try/catch` around `me`'s throwing accessor, and
    // `EssentialValueWriter` uses the `undefined` to decide whether to write an
    // array slot at all. Each case below is one way the throw is reached, so
    // these fail loudly if the engine ever relaxes the contract again — a
    // relaxation that would otherwise show up only as wrong values written into
    // inverse definitions.
    describe("getComponent", () => {
        it("reads a component of a container", () => {
            expect(getComponent(me.fromText("(1,2)"), 0)?.tree).toBe(1);
            expect(getComponent(me.fromText("(1,2)"), 1)?.tree).toBe(2);
        });

        it("answers undefined past the end of a container", () => {
            expect(getComponent(me.fromText("(1,2)"), 5)).toBeUndefined();
        });

        it("answers undefined for a non-container operator", () => {
            // A product has operands, but it is not a container: reading `x`
            // out of `x*y` as though it were `(x, y)` is the mistake this
            // guards.
            expect(getComponent(me.fromText("x*y"), 0)).toBeUndefined();
        });

        it("answers undefined for a scalar receiver", () => {
            expect(getComponent(me.fromText("x"), 0)).toBeUndefined();
            expect(getComponent(me.fromAst(7), 0)).toBeUndefined();
        });

        it("answers undefined for a non-expression, without throwing", () => {
            expect(getComponent(undefined, 0)).toBeUndefined();
            expect(getComponent(null, 0)).toBeUndefined();
            expect(getComponent(7 as never, 0)).toBeUndefined();
            expect(getComponent([1, 2] as never, 0)).toBeUndefined();
        });

        it("answers undefined for an index that is not a whole number", () => {
            // `Uint32Array.from` would turn these into 0 and 1 respectively.
            const tuple = me.fromText("(1,2)");
            expect(getComponent(tuple, NaN)).toBeUndefined();
            expect(getComponent(tuple, 1.5)).toBeUndefined();
            expect(getComponent(tuple, -1)).toBeUndefined();
        });
    });
});
