import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "./test-core";
import {
    moveText,
    submitAnswer,
    updateMathInputValue,
    updateSelectedIndices,
    updateTextInputValue,
} from "./actions";

// A component that copies another wholesale -- `<mathInput extend="$mi" />`, or
// a composite's replacement of what it copies -- shadows it. Most of what such
// a component records is not its own: a variable it shadows redirects its
// inverse to the target, and the essential-value writer then mirrors the
// target's write back down over `shadowedBy`, so the entry under the shadow's
// id is a duplicate of the entry under its source's.
//
// Saving the duplicate is worse than wasteful. The two entries are restored
// independently, and nothing makes the order they land in agree with the order
// a composite hands its replacements out. A composite that recreates its
// replacements on every change hides that, because `DeletionEngine` drops the
// shadow's entry along with the component; a composite that *keeps* them --
// which is what Doenet/DoenetML#1947 is for, and what Doenet/DoenetML#1949 does
// for `<sort>` -- keeps the stale duplicate too, and it lands on top of the
// value restored to the source. The reader's answer comes back on the wrong
// element of a sorted list.
//
// "Most" and not "all": the writer deliberately does not mirror a
// `doNotShadowEssential` or `shadowVariable` value, and for those the shadow
// holds the only copy. A `<choice>` inside a `<shuffle>` is the case that
// matters -- the shuffle's replacement is the choice's primary shadow and is
// where `submitted` lives -- and a revealed copy of a `<hint>` is the simplest
// one. The last two tests in this file are those; they are why the rule reads
// every variable in an entry rather than stopping at the component.

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

function savedKeys(saved: string) {
    return Object.keys(JSON.parse(saved))
        .filter((key) => !key.startsWith("__"))
        .sort();
}

/**
 * Drive a document, save, and load the saved state back into a fresh build of
 * the same document. Returns the payload and a reader of each core, so a test
 * can assert the live value as well as the restored one -- a change that
 * corrupts both alike must not pass.
 */
async function roundTrip(
    doenetML: string,
    drive: (
        core: any,
        resolve: (name: string) => Promise<number>,
    ) => Promise<void>,
) {
    const first = await createTestCore({ doenetML });
    await drive(first.core, first.resolvePathToNodeIdx);
    await first.core.saveImmediately();
    const saved = first.scoreState.state as string;

    const second = await createTestCore({ doenetML, initialState: saved });

    async function valueOf(
        core: any,
        resolve: any,
        name: string,
        varName: string,
    ) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        return stateVariables[await resolve(name)].stateValues[varName];
    }

    return {
        saved,
        keys: savedKeys(saved),
        live: (name: string, varName: string) =>
            valueOf(first.core, first.resolvePathToNodeIdx, name, varName),
        restored: (name: string, varName: string) =>
            valueOf(second.core, second.resolvePathToNodeIdx, name, varName),
    };
}

describe("a shadow's state is its source's, and is not persisted twice @group4", () => {
    const COPIED_INPUT = `<mathInput name="mi" /><mathInput extend="$mi" name="mi2" />`;

    it("writes one entry for a copied input, whichever half the reader typed into", async () => {
        // Both halves of the same claim in one test, because the point is that
        // they agree: a write into the copy is redirected to the source before
        // it is recorded, so the payload cannot tell the two apart.
        async function keysAfterTypingInto(name: string) {
            const { core, resolvePathToNodeIdx, scoreState } =
                await createTestCore({ doenetML: COPIED_INPUT });
            await updateMathInputValue({
                latex: "5",
                componentIdx: await resolvePathToNodeIdx(name),
                core,
            });
            await core.saveImmediately();
            return savedKeys(scoreState.state as string);
        }

        expect(await keysAfterTypingInto("mi")).eqls(["/~mi"]);
        expect(await keysAfterTypingInto("mi2")).eqls(["/~mi"]);
    });

    it("restores the copy from the source's entry alone", async () => {
        // What the entry above has to be worth: the copy comes back with the
        // value, and with the bookkeeping that says the reader changed it.
        // Those last two are the copy's *own* essential variables rather than
        // shadowed ones, so they are the ones a filter keyed on the component
        // rather than on the variable could plausibly lose.
        const trip = await roundTrip(COPIED_INPUT, async (core, resolve) => {
            await updateMathInputValue({
                latex: "5",
                componentIdx: await resolve("mi2"),
                core,
            });
        });

        expect(trip.keys).eqls(["/~mi"]);
        for (const name of ["mi", "mi2"]) {
            expect((await trip.live(name, "value")).tree).eq(5);
            expect((await trip.restored(name, "value")).tree).eq(5);
            expect(await trip.live(name, "valueChanged")).eq(true);
            expect(await trip.restored(name, "valueChanged")).eq(true);
            expect(await trip.live(name, "rawRendererValue")).eq("5");
            expect(await trip.restored(name, "rawRendererValue")).eq("5");
        }
    });

    it("restores a copied text input from the source's entry alone", async () => {
        // The same shape in a component whose essential values are not maths,
        // so a regression that turns on the math round trip cannot mask one.
        const doc = `<textInput name="ti" /><textInput extend="$ti" name="ti2" />`;
        const trip = await roundTrip(doc, async (core, resolve) => {
            await updateTextInputValue({
                text: "hello",
                componentIdx: await resolve("ti2"),
                core,
            });
        });

        expect(trip.keys).eqls(["/~ti"]);
        for (const name of ["ti", "ti2"]) {
            expect(await trip.live(name, "value")).eq("hello");
            expect(await trip.restored(name, "value")).eq("hello");
            expect(await trip.restored(name, "valueChanged")).eq(true);
        }
    });

    it("keeps an unlinked copy's own state", async () => {
        // `<point copy="$A" />` is not a shadow -- it carries
        // `unlinkedCopySource` and no `shadows`, and nothing propagates in
        // either direction -- so its state is its own and dropping it would
        // lose the reader's drag outright. It falls outside the rule by
        // construction rather than by a clause, which is exactly why it is
        // worth a test.
        const doc = `<graph><point name="A" x="1" y="2" /><point copy="$A" name="A2" /></graph>`;
        const trip = await roundTrip(doc, async (core, resolve) => {
            const { movePoint } = await import("./actions");
            await movePoint({
                componentIdx: await resolve("A2"),
                x: 3,
                y: -5,
                core,
            });
        });

        expect(trip.keys.length).eq(2);
        expect(
            (await trip.live("A2", "xs")).map((x: any) =>
                x.evaluate_to_constant(),
            ),
        ).eqls([3, -5]);
        expect(
            (await trip.restored("A2", "xs")).map((x: any) =>
                x.evaluate_to_constant(),
            ),
        ).eqls([3, -5]);
        // the source did not move
        expect(
            (await trip.restored("A", "xs")).map((x: any) =>
                x.evaluate_to_constant(),
            ),
        ).eqls([1, 2]);
    });

    it("keeps an adapter's own state", async () => {
        // An adapter is linked to what it adapts by an `adapter` dependency,
        // not by `shadows`, and its essential values are its own: a
        // `<boolean>` shown in a `<graph>` through a `<text>` is dragged by an
        // `anchor` that belongs to the adapter and to nothing else. The
        // filter must not reach it.
        const doc = `<graph><boolean name="b">true</boolean></graph>`;
        const first = await createTestCore({ doenetML: doc });
        const adapter =
            first.core.core._components[await first.resolvePathToNodeIdx("b")]
                .adapterUsed;
        expect(adapter, "the boolean was not adapted").not.toBe(undefined);

        await moveText({
            componentIdx: adapter.componentIdx,
            x: 7,
            y: -7,
            core: first.core,
        });
        await first.core.saveImmediately();
        const saved = first.scoreState.state as string;

        expect(savedKeys(saved)).eqls(["/~b@@adapt0"]);

        const second = await createTestCore({
            doenetML: doc,
            initialState: saved,
        });
        const stateVariables = await second.core.returnAllStateVariables(
            false,
            true,
        );
        const restoredAdapter =
            second.core.core._components[await second.resolvePathToNodeIdx("b")]
                .adapterUsed;
        const anchor =
            stateVariables[restoredAdapter.componentIdx].stateValues.anchor;
        expect(anchor.tree ?? anchor).eqls(["vector", 7, -7]);
    });

    it("keeps a copied hint's own open state", async () => {
        // `open` is `doNotShadowEssential`, so revealing a copy of a `<hint>`
        // does not reveal the original and the record of it exists only under
        // the copy's id. Keyed on the component alone the rule dropped it, and
        // the reader's hint closed itself on reload.
        const doc = `<hint name="h"><title>Hint</title><p>secret</p></hint><hint extend="$h" name="h2" />`;
        const trip = await roundTrip(doc, async (core, resolve) => {
            await core.requestAction({
                componentIdx: await resolve("h2"),
                actionName: "revealHint",
                args: {},
            });
        });

        expect(trip.keys.length).eq(1);
        // The copy is open and the original is not -- on screen, and after a
        // reload. The second half is what says the entry was saved; the first
        // says it was not mirrored onto the original by some other route.
        expect(await trip.live("h2", "open")).eq(true);
        expect(await trip.live("h", "open")).eq(false);
        expect(await trip.restored("h2", "open")).eq(true);
        expect(await trip.restored("h", "open")).eq(false);
    });

    it("keeps the submitted marking on a shuffled choice", async () => {
        // A `<choice>` inside a `<shuffle>` is defined *from* the shuffle's
        // replacement rather than the other way round: the replacement is the
        // choice's primary shadow, `submitted` and `hasBeenSubmitted` are
        // `doNotShadowEssential` on it, and `Choice`'s own inverse definition
        // refuses to run when a primary shadow exists. So the replacement
        // holds the only record that the reader submitted this choice, and
        // dropping it lost the answer's marking on reload -- in the very
        // composite this change is meant to make safe.
        const doc = `
<answer name="ans">
  <choiceInput name="ci">
    <shuffle>
      <choice name="c1" credit="1">correct</choice>
      <choice name="c2">wrong one</choice>
      <choice name="c3">wrong two</choice>
    </shuffle>
  </choiceInput>
</answer>`;
        const trip = await roundTrip(doc, async (core, resolve) => {
            await updateSelectedIndices({
                componentIdx: await resolve("ci"),
                selectedIndices: [1],
                core,
            });
            await submitAnswer({
                componentIdx: await resolve("ans"),
                core,
            });
        });

        async function marks(read: (n: string, v: string) => Promise<any>) {
            return Promise.all(
                ["c1", "c2", "c3"].map(async (name) => [
                    await read(name, "submitted"),
                    await read(name, "hasBeenSubmitted"),
                ]),
            );
        }

        const live = await marks(trip.live);
        // Exactly one choice was submitted, whichever the shuffle put first.
        expect(live.filter(([submitted]) => submitted).length).eq(1);
        expect(await marks(trip.restored)).eqls(live);
    });
});
