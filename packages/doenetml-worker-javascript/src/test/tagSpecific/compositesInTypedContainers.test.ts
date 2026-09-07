import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * The composites exercised here expand to copies of whatever the author put
 * inside them (or, for `<setup>`, to nothing at all), so they are legal
 * wherever their content is legal — including inside a container that accepts
 * one concrete component type, such as `<math>` or `<numberList>`.
 *
 * The schema encodes that with `allowInSchemaAnywhere`. These tests pin the
 * runtime behavior that mark asserts: if core stops expanding one of these
 * inside a typed container, the schema mark becomes a lie and the LSP goes
 * quiet about real authoring errors.
 */
describe("Content-transparent composites inside typed containers @group2", () => {
    /** The `<math>` expression the named component evaluates to, as a string. */
    async function mathValueOf(doenetML: string, name: string) {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        return stateVariables[
            await resolvePathToNodeIdx(name)
        ].stateValues.value.toString();
    }

    /** The numbers a `<numberList>` expands to. */
    async function numbersOf(doenetML: string, name: string) {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        return stateVariables[await resolvePathToNodeIdx(name)].stateValues
            .numbers;
    }

    it("<group> inside <math>", async () => {
        expect(
            await mathValueOf(
                `<math name="m">1 + <group>2 3</group></math>`,
                "m",
            ),
        ).eq("1 + 2 * 3");
    });

    it("<group> inside <numberList>", async () => {
        expect(
            await numbersOf(
                `<numberList name="nl"><group><number>1</number><number>2</number></group> 5</numberList>`,
                "nl",
            ),
        ).eqls([1, 2, 5]);
    });

    it("<repeat> inside <math>", async () => {
        expect(
            await mathValueOf(
                `<math name="m"><repeat for="1 2 3" valueName="v">$v</repeat></math>`,
                "m",
            ),
        ).eq("1, 2, 3");
    });

    it("<repeatForSequence> inside <math>", async () => {
        expect(
            await mathValueOf(
                `<math name="m"><repeatForSequence to="2" valueName="v">$v</repeatForSequence></math>`,
                "m",
            ),
        ).eq("1, 2");
    });

    it("<select> inside <math>", async () => {
        expect(
            await mathValueOf(
                `<math name="m"><select><option><math>1</math></option></select></math>`,
                "m",
            ),
        ).eq("1");
    });

    it("<module> inside <math>", async () => {
        expect(
            await mathValueOf(
                `<math name="m"><module><math>1</math></module></math>`,
                "m",
            ),
        ).eq("1");
    });

    it("<shuffle> inside <numberList>", async () => {
        // Order is by definition unpredictable; what the schema mark asserts is
        // that all three numbers reach the `<numberList>`.
        expect(
            [
                ...(await numbersOf(
                    `<numberList name="nl"><shuffle>1 2 3</shuffle></numberList>`,
                    "nl",
                )),
            ].sort(),
        ).eqls([1, 2, 3]);
    });

    it("<sort> inside <numberList>", async () => {
        expect(
            await numbersOf(
                `<numberList name="nl"><sort>3 1 2</sort></numberList>`,
                "nl",
            ),
        ).eqls([1, 2, 3]);
    });

    it("<collect> inside <math>", async () => {
        expect(
            await mathValueOf(
                `<graph name="g"><point name="P">(1,2)</point><point name="Q">(3,4)</point></graph>
                 <math name="m"><collect from="$g" componentType="point" /></math>`,
                "m",
            ),
        ).eq("( 1, 2 ), ( 3, 4 )");
    });

    it("<setup> contributes nothing inside <math>", async () => {
        expect(
            await mathValueOf(
                `<math name="m">1+<setup><number name="n">5</number></setup>2</math>`,
                "m",
            ),
        ).eq("1 + 2");
    });

    it("<setup> contributes nothing inside <numberList>", async () => {
        expect(
            await numbersOf(
                `<numberList name="nl"><setup><number name="q">3</number></setup>1 2</numberList>`,
                "nl",
            ),
        ).eqls([1, 2]);
    });
});

/**
 * The mirror image of the tests above. `<split>` and `<intersection>` are not
 * content-transparent: whatever they are given, they expand to `text` and to
 * `point` respectively. The schema says so with
 * `allowInSchemaAsComponent = ["text"]` / `["point"]`, which is what keeps
 * `<split>` out of a graphical-only container such as `<constrainTo>`. If the
 * replacement type ever changes, that mark has to change with it.
 */
describe("Composites with a fixed replacement type @group2", () => {
    /** The component types of the named component's non-string children. */
    async function childComponentTypes(doenetML: string, name: string) {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        return stateVariables[await resolvePathToNodeIdx(name)].activeChildren
            .filter((child: any) => child.componentIdx !== undefined)
            .map(
                (child: any) =>
                    stateVariables[child.componentIdx].componentType,
            );
    }

    it("<split> expands to text", async () => {
        expect(
            await childComponentTypes(
                `<p name="p"><split>a b</split></p>`,
                "p",
            ),
        ).eqls(["text", "text", "text"]);
    });

    it("<intersection> expands to point", async () => {
        expect(
            await childComponentTypes(
                `<graph name="g"><line name="l1">y=x</line><line name="l2">y=-x</line><intersection>$l1 $l2</intersection></graph>`,
                "g",
            ),
        ).eqls(["line", "line", "point"]);
    });
});
