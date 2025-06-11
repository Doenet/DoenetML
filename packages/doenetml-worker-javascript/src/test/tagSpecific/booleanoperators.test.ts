import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Boolean Operator tag tests", async () => {
    it("not", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <booleanInput name="bi" />
    <not name="op1"><boolean extend="$bi" name="bv" /></not>
    <not name="op2">true</not>
    <not name="op3">false</not>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[resolveComponentName("bi")].stateValues.value).eq(
            false,
        );
        expect(stateVariables[resolveComponentName("bv")].stateValues.value).eq(
            false,
        );
        expect(
            stateVariables[resolveComponentName("op1")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[resolveComponentName("op2")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[resolveComponentName("op3")].stateValues.value,
        ).eq(true);

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: resolveComponentName("bi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[resolveComponentName("bi")].stateValues.value).eq(
            true,
        );
        expect(stateVariables[resolveComponentName("bv")].stateValues.value).eq(
            true,
        );
        expect(
            stateVariables[resolveComponentName("op1")].stateValues.value,
        ).eq(false);
    });

    it("not when", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <mathInput name="mi" />
    <not name="op"><when><math extend="$mi" name="mv"/> > 1</when></not>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("mi")].stateValues.value.tree,
        ).eq("\uff3f");
        expect(
            stateVariables[resolveComponentName("mv")].stateValues.value.tree,
        ).eq("\uff3f");
        expect(stateVariables[resolveComponentName("op")].stateValues.value).eq(
            true,
        );

        await updateMathInputValue({
            latex: "2",
            componentIdx: resolveComponentName("mi"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("mi")].stateValues.value.tree,
        ).eq(2);
        expect(
            stateVariables[resolveComponentName("mv")].stateValues.value.tree,
        ).eq(2);
        expect(stateVariables[resolveComponentName("op")].stateValues.value).eq(
            false,
        );

        await updateMathInputValue({
            latex: "1",
            componentIdx: resolveComponentName("mi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("mi")].stateValues.value.tree,
        ).eq(1);
        expect(
            stateVariables[resolveComponentName("mv")].stateValues.value.tree,
        ).eq(1);
        expect(stateVariables[resolveComponentName("op")].stateValues.value).eq(
            true,
        );
    });

    async function test_three_operators(
        core: PublicDoenetMLCore,
        resolveComponentName: (name: string, origin?: number) => number,
        operator: (args: boolean[]) => boolean,
    ) {
        async function check_items(booleans: boolean[]) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[resolveComponentName("bi1")].stateValues.value,
            ).eq(booleans[0]);
            expect(
                stateVariables[resolveComponentName("bi2")].stateValues.value,
            ).eq(booleans[1]);
            expect(
                stateVariables[resolveComponentName("bi3")].stateValues.value,
            ).eq(booleans[2]);
            expect(
                stateVariables[resolveComponentName("bv1")].stateValues.value,
            ).eq(booleans[0]);
            expect(
                stateVariables[resolveComponentName("bv2")].stateValues.value,
            ).eq(booleans[1]);
            expect(
                stateVariables[resolveComponentName("bv3")].stateValues.value,
            ).eq(booleans[2]);
            expect(
                stateVariables[resolveComponentName("op1")].stateValues.value,
            ).eq(operator(booleans));
            expect(
                stateVariables[resolveComponentName("op2")].stateValues.value,
            ).eq(operator([...booleans, true]));
            expect(
                stateVariables[resolveComponentName("op3")].stateValues.value,
            ).eq(operator([...booleans, false]));
        }

        let booleans = [false, false, false];

        await check_items(booleans);

        booleans[0] = true;
        await updateBooleanInputValue({
            boolean: booleans[0],
            componentIdx: resolveComponentName("bi1"),
            core,
        });
        await check_items(booleans);

        booleans[1] = true;
        await updateBooleanInputValue({
            boolean: booleans[1],
            componentIdx: resolveComponentName("bi2"),
            core,
        });
        await check_items(booleans);

        booleans[2] = true;
        await updateBooleanInputValue({
            boolean: booleans[2],
            componentIdx: resolveComponentName("bi3"),
            core,
        });
        await check_items(booleans);
    }

    it("and", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <booleanInput name="bi1" />
    <booleanInput name="bi2" />
    <booleanInput name="bi3" />
    <and name="op1">
      $bi1
      $bi2
      $bi3
    </and>
    <and name="op2">
      $bi1
      $bi2
      $bi3
      true
    </and>
    <and name="op3">
      $bi1
      $bi2
      $bi3
      false
    </and>
    <p>
      <boolean extend="$bi1" name="bv1" />
      <boolean extend="$bi2" name="bv2" />
      <boolean extend="$bi3" name="bv3" />
    </p>
    `,
        });

        let andOperator = function (booleans: boolean[]) {
            return booleans.reduce((a, c) => a && c, true);
        };

        await test_three_operators(core, resolveComponentName, andOperator);
    });

    it("or", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <booleanInput name="bi1" />
    <booleanInput name="bi2" />
    <booleanInput name="bi3" />
    <or name="op1">
      $bi1
      $bi2
      $bi3
    </or>
    <or name="op2">
      $bi1
      $bi2
      $bi3
      true
    </or>
    <or name="op3">
      $bi1
      $bi2
      $bi3
      false
    </or>
    <p>
      <boolean extend="$bi1" name="bv1" />
      <boolean extend="$bi2" name="bv2" />
      <boolean extend="$bi3" name="bv3" />
    </p>
    `,
        });

        let orOperator = function (booleans: boolean[]) {
            return booleans.reduce((a, c) => a || c, false);
        };

        await test_three_operators(core, resolveComponentName, orOperator);
    });

    it("xor", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <booleanInput name="bi1" />
    <booleanInput name="bi2" />
    <booleanInput name="bi3" />
    <xor name="op1">
      $bi1
      $bi2
      $bi3
    </xor>
    <xor name="op2">
      $bi1
      $bi2
      $bi3
      true
    </xor>
    <xor name="op3">
      $bi1
      $bi2
      $bi3
      false
    </xor>
    <p>
      <boolean extend="$bi1" name="bv1" />
      <boolean extend="$bi2" name="bv2" />
      <boolean extend="$bi3" name="bv3" />
    </p>
    `,
        });

        let xorOperator = function (booleans: boolean[]) {
            let numberTrues = booleans.reduce(
                (acc, curr) => acc + (curr ? 1 : 0),
                0,
            );
            return numberTrues === 1;
        };

        await test_three_operators(core, resolveComponentName, xorOperator);
    });

    it("show point based on logic", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <booleanInput name="bi">
      <label>show point</label>
    </booleanInput>
    <graph>
      <point hide="not $bi" name="P">
       (1,2)
      </point>
    </graph>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[resolveComponentName("bi")].stateValues.value).eq(
            false,
        );
        expect(stateVariables[resolveComponentName("P")].stateValues.hide).eq(
            true,
        );

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: resolveComponentName("bi"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[resolveComponentName("bi")].stateValues.value).eq(
            true,
        );
        expect(stateVariables[resolveComponentName("P")].stateValues.hide).eq(
            false,
        );
    });
});
