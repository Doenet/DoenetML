import { describe, expect, it } from "vitest";
import {
    applyCompositeListWrapping,
    type ChildContent,
    type CompositeReplacementRange,
} from "./compositeListWrapping";

/** A FlatDast element-ref child, as produced for a component child. */
function ref(id: number) {
    return { id, annotation: "original" as const };
}

describe("applyCompositeListWrapping", () => {
    it("passes children through (dropping nulls) when there are no ranges", () => {
        const contents: ChildContent[] = ["a ", ref(5), null, ref(6)];
        const { children, wrapperElements } = applyCompositeListWrapping(
            contents,
            undefined,
        );
        expect(children).toEqual(["a ", ref(5), ref(6)]);
        expect(wrapperElements).toEqual([]);
    });

    it("wraps a multi-item asList composite in an <asList> parent (booleanList case)", () => {
        // <p>Values: <booleanList>true false true</booleanList></p>
        const contents: ChildContent[] = ["Values: ", ref(6), ref(7), ref(8)];
        const crar: CompositeReplacementRange[] = [
            {
                compositeIdx: 2,
                compositeName: "bl",
                firstInd: 1,
                lastInd: 3,
                asList: true,
                potentialListComponents: [true, true, true],
            },
        ];

        const { children, wrapperElements } = applyCompositeListWrapping(
            contents,
            crar,
        );

        // The three booleans are replaced by a single ref to the wrapper.
        expect(children).toEqual(["Values: ", ref(2)]);

        expect(wrapperElements).toHaveLength(1);
        const wrapper = wrapperElements[0];
        expect(wrapper.name).toBe("asList");
        expect(wrapper.data.id).toBe(2);
        expect(wrapper.children).toEqual([ref(6), ref(7), ref(8)]);
    });

    it("matches addCommasForCompositeRanges when potentialListComponents is omitted", () => {
        const contents: ChildContent[] = [ref(6), ref(7)];
        const crar: CompositeReplacementRange[] = [
            {
                compositeIdx: 2,
                firstInd: 0,
                lastInd: 1,
                asList: true,
            },
        ];

        const { children, wrapperElements } = applyCompositeListWrapping(
            contents,
            crar,
        );

        expect(children).toEqual([ref(2)]);
        expect(wrapperElements).toHaveLength(1);
        expect(wrapperElements[0].name).toBe("asList");
        expect(wrapperElements[0].children).toEqual([ref(6), ref(7)]);
    });

    it("does not wrap a single-item asList composite (no comma would be added)", () => {
        const contents: ChildContent[] = ["x: ", ref(9)];
        const crar: CompositeReplacementRange[] = [
            {
                compositeIdx: 3,
                firstInd: 1,
                lastInd: 1,
                asList: true,
                potentialListComponents: [true],
            },
        ];

        const { children, wrapperElements } = applyCompositeListWrapping(
            contents,
            crar,
        );

        expect(children).toEqual(["x: ", ref(9)]);
        expect(wrapperElements).toEqual([]);
    });

    it("does not wrap when not all components are list-eligible", () => {
        const contents: ChildContent[] = [ref(4), ref(5)];
        const crar: CompositeReplacementRange[] = [
            {
                compositeIdx: 3,
                firstInd: 0,
                lastInd: 1,
                asList: true,
                // A non-inline (block) replacement is not list-eligible.
                potentialListComponents: [true, false],
            },
        ];

        const { children, wrapperElements } = applyCompositeListWrapping(
            contents,
            crar,
        );

        // Falls back to inlining the replacements, matching the renderer which
        // would not add commas.
        expect(children).toEqual([ref(4), ref(5)]);
        expect(wrapperElements).toEqual([]);
    });

    it("does not wrap a non-asList composite (e.g. <group>)", () => {
        const contents: ChildContent[] = [ref(4), ref(5), ref(6)];
        const crar: CompositeReplacementRange[] = [
            {
                compositeIdx: 3,
                firstInd: 0,
                lastInd: 2,
                asList: false,
                potentialListComponents: [true, true, true],
            },
        ];

        const { children, wrapperElements } = applyCompositeListWrapping(
            contents,
            crar,
        );

        expect(children).toEqual([ref(4), ref(5), ref(6)]);
        expect(wrapperElements).toEqual([]);
    });

    it("keeps range indices aligned across null child placeholders", () => {
        // A null placeholder before the range shifts nothing because indices are
        // in the child-instruction space; the null is dropped on output.
        const contents: ChildContent[] = [null, "Values: ", ref(6), ref(7)];
        const crar: CompositeReplacementRange[] = [
            {
                compositeIdx: 2,
                firstInd: 2,
                lastInd: 3,
                asList: true,
                potentialListComponents: [true, true],
            },
        ];

        const { children, wrapperElements } = applyCompositeListWrapping(
            contents,
            crar,
        );

        expect(children).toEqual(["Values: ", ref(2)]);
        expect(wrapperElements).toHaveLength(1);
        expect(wrapperElements[0].children).toEqual([ref(6), ref(7)]);
    });

    it("groups nested non-list composites inside an enclosing asList so the list delimits them as single items", () => {
        // An outer asList composite (idx 10) whose two replacements are
        // themselves non-list composites (idx 11 and 12), each producing two
        // list-eligible children. The renderer would put a single comma between
        // the two inner groups — not between all four children.
        const contents: ChildContent[] = [ref(1), ref(2), ref(3), ref(4)];
        const crar: CompositeReplacementRange[] = [
            {
                compositeIdx: 10,
                firstInd: 0,
                lastInd: 3,
                asList: true,
                potentialListComponents: [true, true, true, true],
            },
            {
                compositeIdx: 11,
                firstInd: 0,
                lastInd: 1,
                asList: false,
                potentialListComponents: [true, true],
            },
            {
                compositeIdx: 12,
                firstInd: 2,
                lastInd: 3,
                asList: false,
                potentialListComponents: [true, true],
            },
        ];

        const { children, wrapperElements } = applyCompositeListWrapping(
            contents,
            crar,
        );

        // Top level: a single ref to the outer asList wrapper.
        expect(children).toEqual([ref(10)]);

        const byId = Object.fromEntries(
            wrapperElements.map((w) => [w.data.id, w]),
        );
        expect(byId[10].name).toBe("asList");
        expect(byId[10].children).toEqual([ref(11), ref(12)]);
        expect(byId[11].name).toBe("_fragment");
        expect(byId[11].children).toEqual([ref(1), ref(2)]);
        expect(byId[12].name).toBe("_fragment");
        expect(byId[12].children).toEqual([ref(3), ref(4)]);
    });

    it("leaves trailing blank strings inside nested composite wrappers, matching production", () => {
        // Production stores a grouped nested composite as an array containing a
        // React fragment. `removeEndingBlankString` does not recurse into that
        // array before the enclosing asList comma, so the FlatDast bridge must
        // not pre-trim nested synthetic wrappers either.
        const contents: ChildContent[] = [ref(1), " ", ref(2)];
        const crar: CompositeReplacementRange[] = [
            {
                compositeIdx: 10,
                firstInd: 0,
                lastInd: 2,
                asList: true,
                potentialListComponents: [true, true, true],
            },
            {
                compositeIdx: 11,
                firstInd: 0,
                lastInd: 1,
                asList: false,
                potentialListComponents: [true, true],
            },
        ];

        const { children, wrapperElements } = applyCompositeListWrapping(
            contents,
            crar,
        );

        expect(children).toEqual([ref(10)]);
        const byId = Object.fromEntries(
            wrapperElements.map((w) => [w.data.id, w]),
        );
        expect(byId[10].children).toEqual([ref(11), ref(2)]);
        expect(byId[11].name).toBe("_fragment");
        expect(byId[11].children).toEqual([ref(1), " "]);
    });

    it("nests an inner asList composite inside an outer asList composite", () => {
        // Outer asList (idx 10) with two replacements: a plain ref and an inner
        // asList composite (idx 11) with two items.
        const contents: ChildContent[] = [ref(1), ref(2), ref(3)];
        const crar: CompositeReplacementRange[] = [
            {
                compositeIdx: 10,
                firstInd: 0,
                lastInd: 2,
                asList: true,
                potentialListComponents: [true, true, true],
            },
            {
                compositeIdx: 11,
                firstInd: 1,
                lastInd: 2,
                asList: true,
                potentialListComponents: [true, true],
            },
        ];

        const { children, wrapperElements } = applyCompositeListWrapping(
            contents,
            crar,
        );

        expect(children).toEqual([ref(10)]);
        const byId = Object.fromEntries(
            wrapperElements.map((w) => [w.data.id, w]),
        );
        expect(byId[10].name).toBe("asList");
        expect(byId[10].children).toEqual([ref(1), ref(11)]);
        expect(byId[11].name).toBe("asList");
        expect(byId[11].children).toEqual([ref(2), ref(3)]);
    });
});
