import { describe, expect, it } from "vitest";
import {
    groupCompositeRanges,
    joinListText,
    listCommaPositions,
    type CompositeGroup,
    type CompositeRange,
} from "./compositeLists";

/**
 * The grouping every consumer of `compositeReplacementActiveRange` shares. The
 * consumers are tested against real documents elsewhere; what is checked here
 * is the shape of the tree they are handed, since that is what decides where a
 * comma may go.
 */

function range(
    over: Partial<CompositeRange> &
        Pick<CompositeRange, "firstInd" | "lastInd">,
): CompositeRange {
    return { compositeIdx: 1, asList: true, ...over };
}

/** A compact rendering of the tree, so a case reads as what it asserts. */
function sketch(groups: CompositeGroup<string>[]): string {
    return groups
        .map((group) => {
            if (group.kind === "child") {
                return JSON.stringify(group.value);
            }
            const label = group.asList ? "list" : "group";
            return `${label}${group.range.compositeIdx}(${sketch(group.items)})`;
        })
        .join(" ");
}

function isBlank(value: string) {
    return value.trim() === "";
}

describe("groupCompositeRanges", () => {
    it("hands back the children when no composite contributed any", () => {
        expect(
            sketch(
                groupCompositeRanges<string>({
                    children: ["a", "b"],
                    ranges: undefined,
                }),
            ),
        ).eq(`"a" "b"`);
    });

    it("groups the children of one composite", () => {
        expect(
            sketch(
                groupCompositeRanges<string>({
                    children: ["before", "1", "2", "after"],
                    ranges: [
                        range({
                            compositeIdx: 7,
                            firstInd: 1,
                            lastInd: 2,
                            potentialListComponents: [true, true],
                        }),
                    ],
                }),
            ),
        ).eq(`"before" list7("1" "2") "after"`);
    });

    it("is not a list with one item, or with asList off", () => {
        const one = groupCompositeRanges<string>({
            children: ["1"],
            ranges: [
                range({
                    firstInd: 0,
                    lastInd: 0,
                    potentialListComponents: [true],
                }),
            ],
        });
        expect(sketch(one)).eq(`group1("1")`);

        const off = groupCompositeRanges<string>({
            children: ["1", "2"],
            ranges: [
                range({
                    firstInd: 0,
                    lastInd: 1,
                    asList: false,
                    potentialListComponents: [true, true],
                }),
            ],
        });
        expect(sketch(off)).eq(`group1("1" "2")`);
    });

    it("is not a list when a replacement cannot be an item", () => {
        expect(
            sketch(
                groupCompositeRanges<string>({
                    children: ["1", "2", "x"],
                    ranges: [
                        range({
                            firstInd: 0,
                            lastInd: 2,
                            potentialListComponents: [true, true, false],
                        }),
                    ],
                }),
            ),
        ).eq(`group1("1" "2" "x")`);
    });

    it("nests the composites a composite produced", () => {
        // The outer composite comes first, and the ranges after it that lie
        // inside its own are its replacements'.
        expect(
            sketch(
                groupCompositeRanges<string>({
                    children: ["1", "2", "3"],
                    ranges: [
                        range({
                            compositeIdx: 10,
                            firstInd: 0,
                            lastInd: 2,
                            potentialListComponents: [true, true, true],
                        }),
                        range({
                            compositeIdx: 11,
                            firstInd: 0,
                            lastInd: 1,
                            asList: false,
                            potentialListComponents: [true, true],
                        }),
                    ],
                }),
            ),
        ).eq(`list10(group11("1" "2") "3")`);
    });

    it("finds a composite's replacements wherever their ranges were recorded", () => {
        // The core records a range when a composite expands, so the ranges of
        // one composite's replacements can come after its sibling's.
        expect(
            sketch(
                groupCompositeRanges<string>({
                    children: ["1", "2", "3", "4"],
                    ranges: [
                        range({
                            compositeIdx: 10,
                            firstInd: 0,
                            lastInd: 3,
                            potentialListComponents: [true, true, true, true],
                        }),
                        range({
                            compositeIdx: 11,
                            firstInd: 0,
                            lastInd: 1,
                            asList: false,
                            potentialListComponents: [true, true],
                        }),
                        range({
                            compositeIdx: 12,
                            firstInd: 2,
                            lastInd: 3,
                            asList: false,
                            potentialListComponents: [true, true],
                        }),
                        range({
                            compositeIdx: 13,
                            firstInd: 0,
                            lastInd: 1,
                            potentialListComponents: [true, true],
                        }),
                    ],
                }),
            ),
        ).eq(`list10(group11(list13("1" "2")) group12("3" "4"))`);
    });

    it("counts an inner composite as one item, so two of them are two", () => {
        expect(
            sketch(
                groupCompositeRanges<string>({
                    children: ["1", "2"],
                    ranges: [
                        range({
                            compositeIdx: 10,
                            firstInd: 0,
                            lastInd: 1,
                            potentialListComponents: [true, true],
                        }),
                        range({
                            compositeIdx: 11,
                            firstInd: 0,
                            lastInd: 0,
                            potentialListComponents: [true],
                        }),
                        range({
                            compositeIdx: 12,
                            firstInd: 1,
                            lastInd: 1,
                            potentialListComponents: [true],
                        }),
                    ],
                }),
            ),
        ).eq(`list10(group11("1") group12("2"))`);
    });

    it("leaves out a composite that produced nothing", () => {
        // An empty composite is recorded as `lastInd === firstInd - 1`; the
        // children around it still form one list.
        expect(
            sketch(
                groupCompositeRanges<string>({
                    children: ["1", "2"],
                    ranges: [
                        range({
                            compositeIdx: 10,
                            firstInd: 0,
                            lastInd: 1,
                            potentialListComponents: [true, true],
                        }),
                        range({
                            compositeIdx: 11,
                            firstInd: 1,
                            lastInd: 0,
                            potentialListComponents: [],
                        }),
                    ],
                }),
            ),
        ).eq(`list10("1" "2")`);
    });

    it("leaves out an absent child, and does not count it as an item", () => {
        expect(
            sketch(
                groupCompositeRanges<string | null>({
                    children: ["1", null],
                    ranges: [
                        range({
                            firstInd: 0,
                            lastInd: 1,
                            potentialListComponents: [true, true],
                        }),
                    ],
                    isAbsent: (value) => value === null,
                }) as CompositeGroup<string>[],
            ),
        ).eq(`group1("1")`);
    });

    it("keeps the whitespace at the ends of a list, and drops what a comma replaces", () => {
        // Two replacements separated by authored whitespace are a two-item
        // list, not a three-item one. The comma takes the place of the
        // whitespace between them; the whitespace around the list stays.
        expect(
            sketch(
                groupCompositeRanges<string>({
                    children: ["\n", "1", " ", "2", "\n"],
                    ranges: [
                        range({
                            firstInd: 0,
                            lastInd: 4,
                            potentialListComponents: [
                                true,
                                true,
                                true,
                                true,
                                true,
                            ],
                        }),
                    ],
                    isBlank,
                }),
            ),
        ).eq(`list1("\\n" "1" "2" "\\n")`);
    });

    it("keeps a composite that produced only whitespace in its place, emptied", () => {
        // The renderers anchor the composite's name there; the whitespace
        // itself goes, since the comma takes its place.
        expect(
            sketch(
                groupCompositeRanges<string>({
                    children: ["1", " ", "2"],
                    ranges: [
                        range({
                            compositeIdx: 10,
                            firstInd: 0,
                            lastInd: 2,
                            potentialListComponents: [true, true, true],
                        }),
                        range({
                            compositeIdx: 11,
                            firstInd: 1,
                            lastInd: 1,
                            asList: false,
                            potentialListComponents: [true],
                        }),
                    ],
                    isBlank,
                }),
            ),
        ).eq(`list10("1" group11() "2")`);
    });

    it("takes the whitespace off the end of an item a comma will follow", () => {
        // The last item keeps its own: no comma follows it, and it separates
        // the list from whatever comes next.
        expect(
            sketch(
                groupCompositeRanges<string>({
                    children: ["1", " ", "2", " "],
                    ranges: [
                        range({
                            compositeIdx: 10,
                            firstInd: 0,
                            lastInd: 3,
                            potentialListComponents: [true, true, true, true],
                        }),
                        range({
                            compositeIdx: 11,
                            firstInd: 0,
                            lastInd: 1,
                            asList: false,
                            potentialListComponents: [true, true],
                        }),
                        range({
                            compositeIdx: 12,
                            firstInd: 2,
                            lastInd: 3,
                            asList: false,
                            potentialListComponents: [true, true],
                        }),
                    ],
                    isBlank,
                }),
            ),
        ).eq(`list10(group11("1") group12("2" " "))`);
    });

    it("keeps a whitespace-only composite at the end of an item, emptied", () => {
        // Its anchor stays with the item it ended; its whitespace goes with
        // the rest of the item's trailing whitespace.
        expect(
            sketch(
                groupCompositeRanges<string>({
                    children: ["1", " ", "2"],
                    ranges: [
                        range({
                            compositeIdx: 10,
                            firstInd: 0,
                            lastInd: 2,
                            potentialListComponents: [true, true, true],
                        }),
                        range({
                            compositeIdx: 11,
                            firstInd: 0,
                            lastInd: 1,
                            asList: false,
                            potentialListComponents: [true, true],
                        }),
                        range({
                            compositeIdx: 13,
                            firstInd: 1,
                            lastInd: 1,
                            asList: false,
                            potentialListComponents: [true],
                        }),
                        range({
                            compositeIdx: 12,
                            firstInd: 2,
                            lastInd: 2,
                            asList: false,
                            potentialListComponents: [true],
                        }),
                    ],
                    isBlank,
                }),
            ),
        ).eq(`list10(group11("1" group13()) group12("2"))`);
    });

    it("takes the trailing whitespace off a child that ends an item", () => {
        expect(
            sketch(
                groupCompositeRanges<string>({
                    children: ["-6 ", "1", "-8"],
                    ranges: [
                        range({
                            compositeIdx: 10,
                            firstInd: 0,
                            lastInd: 2,
                            potentialListComponents: [true, true, true],
                        }),
                    ],
                    isBlank,
                    trimEnd: (value) => value.trimEnd(),
                }),
            ),
        ).eq(`list10("-6" "1" "-8")`);
    });

    it("drops a composite the caller asked to skip, along with its children", () => {
        expect(
            sketch(
                groupCompositeRanges<string>({
                    children: ["before", "1", "2", "after"],
                    ranges: [
                        range({
                            compositeIdx: 7,
                            firstInd: 1,
                            lastInd: 2,
                            hidden: true,
                            potentialListComponents: [true, true],
                        }),
                    ],
                    skipRange: (candidate) => Boolean(candidate.hidden),
                }),
            ),
        ).eq(`"before" "after"`);
    });

    it("moves the ranges past a child the caller removed", () => {
        // `section.tsx` takes the `<title>` out of the children it renders.
        expect(
            sketch(
                groupCompositeRanges<string>({
                    children: ["1", "2"],
                    ranges: [
                        range({
                            compositeIdx: 7,
                            firstInd: 1,
                            lastInd: 2,
                            potentialListComponents: [true, true],
                        }),
                    ],
                    removedInd: 0,
                }),
            ),
        ).eq(`list7("1" "2")`);
    });

    it("drops a range that ended on the removed child", () => {
        expect(
            sketch(
                groupCompositeRanges<string>({
                    children: ["1", "3"],
                    ranges: [
                        range({
                            firstInd: 0,
                            lastInd: 1,
                            potentialListComponents: [true, true],
                        }),
                    ],
                    removedInd: 1,
                }),
            ),
        ).eq(`"1" "3"`);
    });

    it("keeps each child's own index, for callers that need its neighbors", () => {
        const groups = groupCompositeRanges<string>({
            children: ["a", "1", "2"],
            ranges: [
                range({
                    firstInd: 1,
                    lastInd: 2,
                    potentialListComponents: [true, true],
                }),
            ],
        });
        const indices: number[] = [];
        const collect = (items: CompositeGroup<string>[]) => {
            for (const item of items) {
                if (item.kind === "child") {
                    indices.push(item.index);
                } else {
                    collect(item.items);
                }
            }
        };
        collect(groups);
        expect(indices).toEqual([0, 1, 2]);
    });
});

describe("listCommaPositions", () => {
    it("puts a comma in front of every item that has one before it", () => {
        expect(listCommaPositions([false, false, false])).toEqual([
            false,
            true,
            true,
        ]);
    });

    it("puts none next to the whitespace at either end", () => {
        expect(listCommaPositions([true, false, false, true])).toEqual([
            false,
            false,
            true,
            false,
        ]);
    });

    it("puts one comma, not two, around a blank in the middle", () => {
        expect(listCommaPositions([false, true, false])).toEqual([
            false,
            true,
            false,
        ]);
    });
});

describe("joinListText", () => {
    it("puts a comma and a space between the items", () => {
        expect(joinListText(["1", "2", "3"], [false, false, false])).eq(
            "1, 2, 3",
        );
    });

    it("takes the whitespace off the end of an item a comma will follow", () => {
        // The last item keeps its own, and the whitespace at either end of the
        // list stays where it is.
        expect(
            joinListText(["\n", "1 ", "2 ", "\n"], [true, false, false, true]),
        ).eq("\n1, 2 \n");
    });

    it("puts one comma, not two, around an item that came out empty", () => {
        expect(joinListText(["1", "", "2"], [false, true, false])).eq("1, 2");
    });
});
