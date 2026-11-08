import { describe, expect, it } from "vitest";
import {
    bracketsBalance,
    listSplittingOf,
    splitListItems,
    splitListText,
} from "../src/list-separation";

function entries(text: string) {
    return splitListText(text).entries;
}

describe("The rule for separating the entries of a list", () => {
    it("separates by spaces when there is no comma outside brackets", () => {
        expect(entries("x y z")).eqls(["x", "y", "z"]);
        expect(entries("  x   y\n z  ")).eqls(["x", "y", "z"]);
        expect(entries("x+1 y")).eqls(["x+1", "y"]);
        expect(entries("x + 1 y")).eqls(["x", "+", "1", "y"]);
        expect(entries("f(x, y) z")).eqls(["f(x, y)", "z"]);
        expect(splitListText("f(x, y) z").splitting).eqls({
            separator: "space",
            bracketsGroup: true,
        });
    });

    it("separates by commas when there is one outside brackets", () => {
        expect(entries("a, b")).eqls(["a", "b"]);
        expect(entries("a,b")).eqls(["a", "b"]);
        expect(entries("a , b")).eqls(["a", "b"]);
        expect(entries("x + 1, y")).eqls(["x + 1", "y"]);
        expect(entries("x y, z")).eqls(["x y", "z"]);
        expect(entries("f(x, y), z")).eqls(["f(x, y)", "z"]);
        expect(entries("hello world, goodbye")).eqls([
            "hello world",
            "goodbye",
        ]);
    });

    it("keeps empty entries made by commas", () => {
        expect(entries("a,")).eqls(["a", ""]);
        expect(entries(",a")).eqls(["", "a"]);
        expect(entries("a,,b")).eqls(["a", "", "b"]);
        expect(entries("a, ,b")).eqls(["a", "", "b"]);
        expect(entries(",")).eqls(["", ""]);
    });

    it("has no entries for no text", () => {
        expect(entries("")).eqls([]);
        expect(entries("   ")).eqls([]);
    });

    it("treats brackets, braces and parentheses alike", () => {
        expect(entries("(1, 2] [3, 4)")).eqls(["(1, 2]", "[3, 4)"]);
        expect(entries("(1, 2], [3, 4)")).eqls(["(1, 2]", "[3, 4)"]);
        expect(entries("{1, 2} {3}")).eqls(["{1, 2}", "{3}"]);
        expect(entries("[(1, 2), 3] x")).eqls(["[(1, 2), 3]", "x"]);
        expect(entries("(1 + 2) 4")).eqls(["(1 + 2)", "4"]);
    });

    it("ignores brackets that don't balance", () => {
        const result = splitListText("a) apple, b) banana");
        expect(result.entries).eqls(["a) apple", "b) banana"]);
        expect(result.unmatchedBrackets).eq(true);
        expect(result.splitting).eqls({
            separator: "comma",
            bracketsGroup: false,
        });

        expect(entries("f(a, b")).eqls(["f(a", "b"]);
        expect(entries("(sad :( face)")).eqls(["(sad", ":(", "face)"]);

        expect(splitListText("f(a, b) g").unmatchedBrackets).eq(false);
    });

    it("can't tell balanced brackets from intended ones", () => {
        expect(entries(":( sad, :) happy")).eqls([":( sad, :)", "happy"]);
    });

    it("does not count angle brackets or bars as brackets", () => {
        expect(entries("x < 2, y > 3")).eqls(["x < 2", "y > 3"]);
        expect(entries("|x - 1|, 2")).eqls(["|x - 1|", "2"]);
        expect(entries("|x - 1| 2")).eqls(["|x", "-", "1|", "2"]);
    });

    it("splits by a splitting given to it", () => {
        expect(
            splitListText("hello world", {
                separator: "comma",
                bracketsGroup: true,
            }).entries,
        ).eqls(["hello world"]);
        expect(
            splitListText("f(a, b)", {
                separator: "comma",
                bracketsGroup: false,
            }).entries,
        ).eqls(["f(a", "b)"]);
    });

    it("decides the splitting from the written text only", () => {
        expect(listSplittingOf(["a ", " b"]).splitting.separator).eq("space");
        expect(listSplittingOf(["a, ", " b"]).splitting.separator).eq("comma");
        expect(bracketsBalance(["(a ", " b)"])).eq(true);
        expect(bracketsBalance([")a("])).eq(false);
    });

    it("keeps references in the entry they are written in", () => {
        const ref = { ref: "a" };
        const items = ["2", ref, " + 1, ", ref, " y"];
        const result = splitListItems(items);
        expect(result.splitting.separator).eq("comma");
        expect(
            result.entries.map((parts) =>
                parts.map((part) =>
                    part.start === undefined
                        ? items[part.item]
                        : (items[part.item] as string).slice(
                              part.start,
                              part.end,
                          ),
                ),
            ),
        ).eqls([
            ["2", ref, " + 1"],
            [ref, " y"],
        ]);

        // a comma that is not written text doesn't choose commas
        expect(
            splitListItems([{ value: "1, 2" }, " ", { value: "3" }]).entries
                .length,
        ).eq(2);
    });

    it("makes a boundary item an entry of its own", () => {
        const child = { child: true };
        const isBoundary = () => true;
        function texts(items: (string | object)[]) {
            return splitListItems(items, { isBoundary }).entries.map((parts) =>
                parts.map((part) =>
                    part.start === undefined
                        ? items[part.item]
                        : (items[part.item] as string).slice(
                              part.start,
                              part.end,
                          ),
                ),
            );
        }
        expect(texts([child, ", b"])).eqls([[child], ["b"]]);
        expect(texts(["a, ", child])).eqls([["a"], [child]]);
        expect(texts([child, " ", child])).eqls([[child], [child]]);
        expect(texts(["a ", child, " b, c"])).eqls([
            ["a"],
            [child],
            ["b"],
            ["c"],
        ]);
        // a trailing comma still leaves an empty entry
        expect(texts([child, ","])).eqls([[child], []]);
        expect(texts([child, ",,", child])).eqls([[child], [], [child]]);
    });
});
