import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";
import Core from "../../Core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Boolean Operator tag tests", async () => {
    it("not", async () => {
        let core = await createTestCore({
            doenetML: `
    <booleanInput name="bi" />
    <not name="op1">$bi{name="bv"}</not>
    <not name="op2">true</not>
    <not name="op3">false</not>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi"].stateValues.value).eq(false);
        expect(stateVariables["/bv"].stateValues.value).eq(false);
        expect(stateVariables["/op1"].stateValues.value).eq(true);
        expect(stateVariables["/op2"].stateValues.value).eq(false);
        expect(stateVariables["/op3"].stateValues.value).eq(true);

        await updateBooleanInputValue({
            boolean: true,
            name: "/bi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi"].stateValues.value).eq(true);
        expect(stateVariables["/bv"].stateValues.value).eq(true);
        expect(stateVariables["/op1"].stateValues.value).eq(false);
    });

    it("not when", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="mi" />
    <not name="op"><when>$mi{name="mv"} > 1</when></not>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/mi"].stateValues.value.tree).eq("\uff3f");
        expect(stateVariables["/mv"].stateValues.value.tree).eq("\uff3f");
        expect(stateVariables["/op"].stateValues.value).eq(true);

        await updateMathInputValue({ latex: "2", name: "/mi", core });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/mi"].stateValues.value.tree).eq(2);
        expect(stateVariables["/mv"].stateValues.value.tree).eq(2);
        expect(stateVariables["/op"].stateValues.value).eq(false);

        await updateMathInputValue({ latex: "1", name: "/mi", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/mi"].stateValues.value.tree).eq(1);
        expect(stateVariables["/mv"].stateValues.value.tree).eq(1);
        expect(stateVariables["/op"].stateValues.value).eq(true);
    });

    async function test_three_operators(
        core: Core,
        operator: (args: boolean[]) => boolean,
    ) {
        async function check_items(booleans: boolean[]) {
            const stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/bi1"].stateValues.value).eq(booleans[0]);
            expect(stateVariables["/bi2"].stateValues.value).eq(booleans[1]);
            expect(stateVariables["/bi3"].stateValues.value).eq(booleans[2]);
            expect(stateVariables["/bv1"].stateValues.value).eq(booleans[0]);
            expect(stateVariables["/bv2"].stateValues.value).eq(booleans[1]);
            expect(stateVariables["/bv3"].stateValues.value).eq(booleans[2]);
            expect(stateVariables["/op1"].stateValues.value).eq(
                operator(booleans),
            );
            expect(stateVariables["/op2"].stateValues.value).eq(
                operator([...booleans, true]),
            );
            expect(stateVariables["/op3"].stateValues.value).eq(
                operator([...booleans, false]),
            );
        }

        let booleans = [false, false, false];

        await check_items(booleans);

        booleans[0] = true;
        await updateBooleanInputValue({
            boolean: booleans[0],
            name: "/bi1",
            core,
        });
        await check_items(booleans);

        booleans[1] = true;
        await updateBooleanInputValue({
            boolean: booleans[1],
            name: "/bi2",
            core,
        });
        await check_items(booleans);

        booleans[2] = true;
        await updateBooleanInputValue({
            boolean: booleans[2],
            name: "/bi3",
            core,
        });
        await check_items(booleans);
    }

    it("and", async () => {
        let core = await createTestCore({
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
      $bi1{name="bv1"}
      $bi2{name="bv2"}
      $bi3{name="bv3"}
    </p>
    `,
        });

        let andOperator = function (booleans: boolean[]) {
            return booleans.reduce((a, c) => a && c, true);
        };

        await test_three_operators(core, andOperator);
    });

    it("or", async () => {
        let core = await createTestCore({
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
      $bi1{name="bv1"}
      $bi2{name="bv2"}
      $bi3{name="bv3"}
    </p>
    `,
        });

        let orOperator = function (booleans: boolean[]) {
            return booleans.reduce((a, c) => a || c, false);
        };

        await test_three_operators(core, orOperator);
    });

    it("xor", async () => {
        let core = await createTestCore({
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
      $bi1{name="bv1"}
      $bi2{name="bv2"}
      $bi3{name="bv3"}
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

        await test_three_operators(core, xorOperator);
    });

    it("show point based on logic", async () => {
        let core = await createTestCore({
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

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi"].stateValues.value).eq(false);
        expect(stateVariables["/P"].stateValues.hide).eq(true);

        await updateBooleanInputValue({
            boolean: true,
            name: "/bi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi"].stateValues.value).eq(true);
        expect(stateVariables["/P"].stateValues.hide).eq(false);
    });
});
