import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "./test-core";
import { movePoint, moveText, updateMathInputValue } from "./actions";

/**
 * The component index of the adapter Doenet inserted for `componentIdx`.
 *
 * An adapter has no name of its own — it is not in the document — so a test
 * that drives one has to find it through the component it adapts.
 */
function adapterOf(core: any, componentIdx: number) {
    const adapter = core.core._components[componentIdx].adapterUsed;
    expect(adapter, `component ${componentIdx} was not adapted`).not.toBe(
        undefined,
    );
    return adapter.componentIdx as number;
}

// Saved reader state is keyed by `stateId`, and for everything written in the
// document that id is just the component's index. The index is minted while
// walking an element's attributes, and those arrived in the iteration order of
// a Rust `HashMap` -- which Rust deliberately randomizes. So the same document
// handed `x` and `y` different indices from one build to the next, and a point
// the reader had dragged came back with its coordinates swapped roughly a third
// of the time (Doenet/DoenetML#1944). Silent corruption, not an error.
//
// Because it was a race, a single observation says almost nothing: three
// separate investigations each drew a confident mechanism from one run and all
// three were wrong. Every test here therefore repeats.

const REPEATS = 20;

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("saved state is keyed by an identifier a rebuild reproduces @group4", () => {
    const DOC = `<graph><point name="P" x="0" y="1" /></graph>`;

    async function pointCoordsFrom(initialState?: string) {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: DOC,
            initialState,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        return stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs
            .map((x: any) => x.evaluate_to_constant())
            .join(",");
    }

    it("restores one saved payload to one document, every time", async () => {
        // The sharpest form of the bug: saving happens once, and the same bytes
        // are then loaded over and over. Before the fix this produced (3,-5)
        // about fourteen times in twenty and (-5,3) the rest.
        const first = await createTestCore({ doenetML: DOC });
        await movePoint({
            componentIdx: await first.resolvePathToNodeIdx("P"),
            x: 3,
            y: -5,
            core: first.core,
        });
        await first.core.saveImmediately();
        const saved = first.scoreState.state as string;
        expect(
            saved,
            "nothing was saved, so the replay proves nothing",
        ).toContain("expressionWithCodes");

        const outcomes = new Set<string>();
        for (let i = 0; i < REPEATS; i++) {
            outcomes.add(await pointCoordsFrom(saved));
        }

        expect(
            [...outcomes],
            "the same saved bytes restored to more than one document",
        ).eqls(["3,-5"]);
    });

    it("keys the reader's work by where it sits in the document", async () => {
        // The shape of the key is the fix, so it is worth pinning rather than
        // left implied: `x` and `y` are told apart by their attribute names,
        // which is what makes the swap in #1944 unrepresentable — as opposed to
        // merely unlikely, which is what ordering the attributes alone buys.
        const first = await createTestCore({ doenetML: DOC });
        await movePoint({
            componentIdx: await first.resolvePathToNodeIdx("P"),
            x: 3,
            y: -5,
            core: first.core,
        });
        await first.core.saveImmediately();

        const keys = Object.keys(
            JSON.parse(first.scoreState.state as string),
        ).filter((key) => !key.startsWith("__"));

        expect(keys.sort()).eqls(["/~P@x", "/~P@y"]);
    });

    it("survives an edit elsewhere in the document", async () => {
        // The point of keying on the document rather than on the build. A
        // component index is a position in the build, so inserting anything
        // ahead of a component shifted it and the reader's saved values landed
        // somewhere else entirely. An author-given name does not shift.
        const before = `<p>first</p><graph><point name="P" x="0" y="1" /></graph>`;
        const after = `<p>first</p><p>inserted</p><graph><point name="P" x="0" y="1" /></graph>`;

        const first = await createTestCore({ doenetML: before });
        await movePoint({
            componentIdx: await first.resolvePathToNodeIdx("P"),
            x: 3,
            y: -5,
            core: first.core,
        });
        await first.core.saveImmediately();
        const saved = first.scoreState.state as string;

        const second = await createTestCore({
            doenetML: after,
            initialState: saved,
        });
        const stateVariables = await second.core.returnAllStateVariables(
            false,
            true,
        );
        const coords = stateVariables[
            await second.resolvePathToNodeIdx("P")
        ].stateValues.xs.map((x: any) => x.evaluate_to_constant());

        expect(coords).eqls([3, -5]);
    });

    // Everything the document builds, plus the components it inserts at run
    // time to adapt one to where it was written: a `<point>` in a paragraph is
    // shown through a `coords`, a `<boolean>` in a graph through a `<text>`.
    // Those are built by `ChildMatcher`, long after the pass that assigns
    // document-derived ids, so they are keyed at the point they are built
    // instead — off the component they adapt.
    const MIXED_DOC = `
    <p name="intro">text <m>x^2</m></p>
    <graph><point name="P" x="0" y="1" /><point name="Q">(1,2)</point></graph>
    <repeat name="r" for="1 2 3" valueName="v"><p>$v</p></repeat>
    <sort name="s">5 3 1</sort>
    <mathInput name="mi" bindValueTo="$P.x" />
    <answer name="ans">$P.x</answer>
    <p name="inline"><point name="A">(1,2)</point></p>
    <mathInput name="miA" bindValueTo="$A.x" />
    <graph><boolean name="b">true</boolean></graph>
  `;

    it("leaves nothing on a bare component index, adapters included", async () => {
        // `ComponentBuilder` still falls back to `componentIdx.toString()` for a
        // component that arrives without a `stateId`. Nothing should reach it:
        // this is the evidence for that, and the guard that would notice if
        // some new way of building a component started skipping the path.
        const { core } = await createTestCore({ doenetML: MIXED_DOC });

        const live = core.core!._components!.filter(
            (component: any) => component,
        );

        // Adapters are the ones that used to land here, so the assertion below
        // would pass vacuously on a document that builds none.
        expect(
            live
                .filter((component: any) => component.adaptedFrom !== undefined)
                .map((component: any) => component.componentType)
                .sort(),
            "this document no longer builds an adapter, so the case is untested",
        ).eqls(["coords", "text"]);

        expect(
            live
                .filter((component: any) => /^\d+$/.test(component.stateId))
                .map(
                    (component: any) =>
                        `${component.componentType}#${component.componentIdx}`,
                ),
        ).eqls([]);
    });

    it("saves nothing under a bare component index", async () => {
        // The other half: no key a rebuild cannot reproduce ever leaves the
        // worker. Interacting through `$A.x` and dragging the adapted
        // `<boolean>` are what would put one there if that were wrong.
        const { core, resolvePathToNodeIdx, scoreState } = await createTestCore(
            { doenetML: MIXED_DOC },
        );

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: 3,
            y: -5,
            core,
        });
        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("miA"),
            core,
        });
        await moveText({
            componentIdx: adapterOf(core, await resolvePathToNodeIdx("b")),
            x: 7,
            y: -7,
            core,
        });
        await core.saveImmediately();

        const keys = Object.keys(JSON.parse(scoreState.state as string));
        expect(
            keys.filter((key) => !key.startsWith("__")).length,
            "nothing was saved, so this proves nothing",
        ).toBeGreaterThan(0);
        expect(keys.filter((key) => /^\d+$/.test(key))).eqls([]);
    });

    it("keeps a reader's drag of an adapted component through an edit above it", async () => {
        // An adapter is not a passive view of what it adapts. A `<boolean>` in
        // a `<graph>` is shown through a `<text>`, and a `<text>` in a graph is
        // draggable: the `anchor` the reader puts it at is the reader's own
        // work, saved under the adapter's own key. Keyed by build index — which
        // is what an adapter fell back to, being built long after the document
        // walk — that key moved with anything inserted above it, and the drag
        // came back on nothing (Doenet/DoenetML#1944).
        const DOC_WITH_ADAPTER = `<graph><boolean name="b">true</boolean></graph>`;

        const first = await createTestCore({ doenetML: DOC_WITH_ADAPTER });
        await moveText({
            componentIdx: adapterOf(
                first.core,
                await first.resolvePathToNodeIdx("b"),
            ),
            x: 7,
            y: -7,
            core: first.core,
        });
        await first.core.saveImmediately();
        const saved = first.scoreState.state as string;
        expect(
            Object.keys(JSON.parse(saved)),
            "the drag was not saved, so the reload proves nothing",
        ).eqls(["/~b@@adapt0"]);

        const second = await createTestCore({
            doenetML: `<p>inserted</p>` + DOC_WITH_ADAPTER,
            initialState: saved,
        });
        const stateVariables = await second.core.returnAllStateVariables(
            false,
            true,
        );
        const adapterIdx = adapterOf(
            second.core,
            await second.resolvePathToNodeIdx("b"),
        );

        // A restored value comes back as the bare tree rather than as a
        // math-expression around it, which is pre-existing and not what this
        // is about, so compare the tree either way.
        const anchor = stateVariables[adapterIdx].stateValues.anchor;
        expect(anchor.tree ?? anchor).eqls(["vector", 7, -7]);
    });

    it("hands the same document the same keys on every build", async () => {
        // The step underneath the one above: which component each `stateId`
        // denotes. A payload can only be read back by the build that wrote it
        // if this map is the same both times.
        // Recorded against the authored text each component was built from,
        // not against its component type: the two components that swap here
        // are both `math`, so a map keyed on type cannot see the defect at all.
        async function stateIdsToAuthoredText() {
            const { core } = await createTestCore({ doenetML: DOC });
            const map: Record<string, string> = {};
            for (const component of core.core!._components!) {
                if (!component) {
                    continue;
                }
                const authored = component.definingChildren
                    .filter((child: any) => typeof child === "string")
                    .join("");
                if (authored) {
                    map[component.stateId] = authored;
                }
            }
            return JSON.stringify(map);
        }

        const first = await stateIdsToAuthoredText();
        expect(
            first,
            "nothing in this document is keyed by authored text, so the repeat below proves nothing",
        ).toContain("0");

        for (let i = 1; i < REPEATS; i++) {
            expect(
                await stateIdsToAuthoredText(),
                "a rebuild of the same document produced different keys",
            ).eq(first);
        }
    });
});
