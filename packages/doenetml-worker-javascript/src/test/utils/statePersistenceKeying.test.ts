import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "./test-core";
import { movePoint } from "./actions";

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

    it("gives every component an id of its own, with nothing left on the index", async () => {
        // `ComponentBuilder` still falls back to `componentIdx.toString()` for a
        // component that arrives without a `stateId`. Nothing should reach it:
        // this is the evidence for that, and the guard that would notice if some
        // new way of creating a component started skipping the path.
        const { core } = await createTestCore({
            doenetML: `
    <p name="intro">text <m>x^2</m></p>
    <graph><point name="P" x="0" y="1" /><point name="Q">(1,2)</point></graph>
    <repeat name="r" for="1 2 3" valueName="v"><p>$v</p></repeat>
    <sort name="s">5 3 1</sort>
    <mathInput name="mi" bindValueTo="$P.x" />
    <answer name="ans">$P.x</answer>
  `,
        });

        const onBareIndex = core
            .core!._components!.filter((component: any) => component)
            .filter((component: any) => /^\d+$/.test(component.stateId))
            .map(
                (component: any) =>
                    `${component.componentType}#${component.componentIdx}`,
            );

        expect(onBareIndex).eqls([]);
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
