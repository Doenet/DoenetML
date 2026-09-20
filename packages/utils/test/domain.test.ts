import { describe, expect, it } from "vitest";
import me from "math-expressions";
import {
    find_effective_domain,
    find_effective_domains_piecewise_children,
} from "../src/components/domain";

/** The `[a, b]` closed interval a `<function domain>` state variable holds. */
function interval(a: number, b: number) {
    return me.fromAst([
        "interval",
        ["tuple", a, b],
        ["tuple", true, true],
    ]) as any;
}

describe("find_effective_domain", () => {
    it("reads an interval domain", () => {
        expect(find_effective_domain({ domain: [interval(-2, 5)] })).toEqual({
            minx: -2,
            maxx: 5,
            openMin: false,
            openMax: false,
        });
    });

    // The two entry points have to agree about what "no domain" is, because a
    // `<function>` reaches one and the piecewise machinery over the same
    // formula reaches the other. `undefined` and a `null` first entry used to
    // throw here and read as the whole real line there; a crash is the wrong
    // answer to "no domain" whichever way it arrives.
    it.each([
        ["null", null],
        ["undefined", undefined],
        ["an empty array", []],
        ["an array of one hole", [undefined]],
        ["an array of one null", [null]],
    ])("treats %s as the unbounded domain, like its sibling", (_name, dom) => {
        expect(find_effective_domain({ domain: dom as any })).toEqual({
            minx: -Infinity,
            maxx: Infinity,
            // Closed at ±∞ so the caller may evaluate there — the unbounded
            // default, not the "nothing said" one.
            openMin: false,
            openMax: false,
        });

        // The sibling reports the same absence as the whole real line, so a
        // child domain passes through it unrestricted.
        const [child] = find_effective_domains_piecewise_children({
            domain: dom as any,
            numericalDomainsOfChildren: [
                [
                    [0, 1],
                    [true, true],
                ],
            ],
        });
        expect(child.isEmpty()).toBe(false);
    });
});
