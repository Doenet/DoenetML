import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateBooleanInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * An `extend` or `copy` of a list is a list holding a copy of the entries
 * of the list it names, so that it can add entries of its own or be a list
 * of another type. It takes that list's attributes as an `extend` of any
 * other component takes its source's: those it does not set itself, with
 * `fixed` and `fixLocation` taken alongside where it sits.
 */
describe("Attributes of an extend or copy of a list @group4", () => {
    it("takes the attributes of the list it extends", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathList name="ml" displayDigits="5" hide fixed>1.23456789 2</mathList>
    <p name="p1"><mathList extend="$ml" name="e1" /></p>
    <p name="p2"><mathList extend="$ml" name="e2" hide="false" displayDigits="2" fixed="false" /></p>
    <p name="p3"><mathList extend="$ml" name="e3" hide="false"><math>7.123456</math></mathList></p>
    <p name="p4"><textList extend="$ml" name="e4" hide="false" /></p>
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const sv = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues;

        expect((await sv("e1")).hidden).eq(true);
        expect((await sv("e1")).displayDigits).eq(5);
        expect((await sv("e1")).fixed).eq(true);
        expect((await sv("p1")).text).eq("");

        // its own attributes decide
        expect((await sv("e2")).hidden).eq(false);
        expect((await sv("e2")).displayDigits).eq(2);
        expect((await sv("e2")).fixed).eq(false);
        expect((await sv("p2")).text).eq("1.2, 2");

        // an entry it adds is shown with the digits it takes
        expect((await sv("p3")).text).eq("1.2346, 2, 7.1235");
        expect((await sv("e3")).fixed).eq(true);

        // as a list of another type
        expect((await sv("p4")).text).eq("1.2346, 2");
        expect((await sv("e4")).fixed).eq(true);
    });

    it("is fixed when the list it extends is or where it sits is", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <booleanInput name="bi" />
    <numberList name="nl" fixed="$bi" fixLocation="$bi">1 2</numberList>
    <numberList name="nf" fixed="false">1 2</numberList>
    <numberList extend="$nl" name="e" />
    <p fixed><numberList extend="$nf" name="ep" /></p>
    <group fixLocation><numberList extend="$nf" name="eg" /></group>
    <numberList copy="$nl" name="c" />
    <p fixed><numberList copy="$nl" name="cp" /></p>
    `,
        });
        async function check(expected: Record<string, [boolean, boolean]>) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            for (const name in expected) {
                const stateValues =
                    stateVariables[await resolvePathToNodeIdx(name)]
                        .stateValues;
                expect([stateValues.fixed, stateValues.fixLocation], name).eqls(
                    expected[name],
                );
            }
        }

        await check({
            e: [false, false],
            ep: [true, false],
            eg: [false, true],
            c: [false, false],
            cp: [true, false],
        });

        // the extend follows its list; the copy keeps what it had
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("bi"),
            core,
        });
        await check({
            e: [true, true],
            c: [false, false],
            cp: [true, false],
        });
    });

    it("a copy of a list fixed when it is made is fixed, and shows its entries as they were", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathList name="ml" fixed displayDigits="5">1.23456789 2</mathList>
    <p name="p"><mathList copy="$ml" name="c" /></p>
    <p fixed="false"><mathList copy="$ml" name="c2" /></p>
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const sv = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues;
        expect((await sv("c")).fixed).eq(true);
        expect((await sv("c2")).fixed).eq(true);
        expect((await sv("p")).text).eq("1.2346, 2");
    });
});
