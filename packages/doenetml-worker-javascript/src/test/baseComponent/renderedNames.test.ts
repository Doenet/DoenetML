import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

import {
    renderedNameSortFunction,
    type PotentialNames,
} from "../../utils/renderedNames";
import { updateBooleanInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Rendered name tests", async () => {
    it("find all potential names", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<p name="p">
    <math name="x">x</math> <text>hi <text name="t">there</text></text>
</p>
<p name="p2">
    <math name="x">x2</math> <text>bye <text name="t2">now</text></text>
</p>
<p><math name="x">x3</math> <text>hi <text name="t">there again</text></text></p>

      
  `,
        });

        // Note: for this one test, we check the implementation details
        // of unique and ambiguous `potentialRenderedNames`
        // that underlie determining rendered names

        const pIdx = await resolvePathToNodeIdx("p");
        const p2Idx = await resolvePathToNodeIdx("p2");
        const pxIdx = await resolvePathToNodeIdx("p.x");
        const ptIdx = await resolvePathToNodeIdx("p.t");
        const p2xIdx = await resolvePathToNodeIdx("p2.x");
        const p2t2Idx = await resolvePathToNodeIdx("p2.t2");

        let stateVariables = await core.returnAllStateVariables(false, true);

        const p3Idx =
            stateVariables[0].activeChildren[
                stateVariables[0].activeChildren.length - 1
            ].componentIdx;
        const p3Children = stateVariables[p3Idx].activeChildren;
        const p3xIdx = p3Children[0].componentIdx;
        const p3tIdx =
            stateVariables[p3Children[2].componentIdx].activeChildren[1]
                .componentIdx;

        const potentialNames = core.core!
            .potentialRenderedNames as PotentialNames;

        expect(potentialNames.byIdx[pIdx]).eqls(["p"]);
        expect(potentialNames.byIdx[p2Idx]).eqls(["p2"]);
        expect(potentialNames.byIdx[p3Idx] == null).eq(true);
        expect(
            potentialNames.byIdx[pxIdx]?.sort(renderedNameSortFunction),
        ).eqls(["x", "p.x"]);
        expect(
            potentialNames.byIdx[ptIdx]?.sort(renderedNameSortFunction),
        ).eqls(["t", "p.t"]);
        expect(
            potentialNames.byIdx[p2xIdx]?.sort(renderedNameSortFunction),
        ).eqls(["x", "p2.x"]);
        expect(
            potentialNames.byIdx[p2t2Idx]?.sort(renderedNameSortFunction),
        ).eqls(["t2", "p2.t2"]);
        expect(potentialNames.byIdx[p3xIdx]?.sort()).eqls(["x"]);
        expect(potentialNames.byIdx[p3tIdx]?.sort()).eqls(["t"]);

        if (potentialNames.byName["p"].type !== "unique") {
            throw Error("p should be unique");
        }
        expect(potentialNames.byName["p"].componentIdx).eq(pIdx);

        if (potentialNames.byName["p2"].type !== "unique") {
            throw Error("p2 should be unique");
        }
        expect(potentialNames.byName["p2"].componentIdx).eq(p2Idx);

        if (potentialNames.byName["x"].type !== "ambiguous") {
            throw Error("x should be ambiguous");
        }
        expect(potentialNames.byName["x"].componentIndices.sort()).eqls(
            [pxIdx, p2xIdx, p3xIdx].sort(),
        );
        if (potentialNames.byName["t"].type !== "ambiguous") {
            throw Error("t should be ambiguous");
        }
        expect(potentialNames.byName["t"].componentIndices.sort()).eqls(
            [ptIdx, p3tIdx].sort(),
        );
        if (potentialNames.byName["t2"].type !== "unique") {
            throw Error("t should be ambiguous");
        }
        expect(potentialNames.byName["t2"].componentIdx).eq(p2t2Idx);

        if (potentialNames.byName["p.x"].type !== "unique") {
            throw Error("p.x should be unique");
        }
        expect(potentialNames.byName["p.x"].componentIdx).eq(pxIdx);

        if (potentialNames.byName["p2.x"].type !== "unique") {
            throw Error("p2.x should be unique");
        }
        expect(potentialNames.byName["p2.x"].componentIdx).eq(p2xIdx);

        if (potentialNames.byName["p.t"].type !== "unique") {
            throw Error("p.t should be unique");
        }
        expect(potentialNames.byName["p.t"].componentIdx).eq(ptIdx);

        if (potentialNames.byName["p2.t2"].type !== "unique") {
            throw Error("p2.t2 should be unique");
        }
        expect(potentialNames.byName["p2.t2"].componentIdx).eq(p2t2Idx);
    });

    it("rendered names are smallest unique accessible name", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<p name="p">
    <math name="x">x</math> <text>hi <text name="t">there</text></text>
</p>
<p name="p2">
    <math name="x">x2</math> <text>bye <text name="t2">now</text></text>
</p>
<p><math name="x">x3</math> <text>hi <text name="t">there again</text></text></p>

      
  `,
        });

        const pIdx = await resolvePathToNodeIdx("p");
        const p2Idx = await resolvePathToNodeIdx("p2");
        const pxIdx = await resolvePathToNodeIdx("p.x");
        const ptIdx = await resolvePathToNodeIdx("p.t");
        const p2xIdx = await resolvePathToNodeIdx("p2.x");
        const p2t2Idx = await resolvePathToNodeIdx("p2.t2");

        let stateVariables = await core.returnAllStateVariables(false, true);

        const p3Idx =
            stateVariables[0].activeChildren[
                stateVariables[0].activeChildren.length - 1
            ].componentIdx;
        const p3Children = stateVariables[p3Idx].activeChildren;
        const p3xIdx = p3Children[0].componentIdx;
        const p3tIdx =
            stateVariables[p3Children[2].componentIdx].activeChildren[1]
                .componentIdx;

        const getRenderedName = core.core!.getRenderedName;

        expect(getRenderedName(pIdx)).eq("p");
        expect(getRenderedName(p2Idx)).eq("p2");
        expect(getRenderedName(p3Idx)).eq(null);
        expect(getRenderedName(pxIdx)).eq("p.x");
        expect(getRenderedName(ptIdx)).eq("p.t");
        expect(getRenderedName(p2xIdx)).eq("p2.x");
        expect(getRenderedName(p2t2Idx)).eq("t2");
        expect(getRenderedName(p3xIdx)).eq(null);
        expect(getRenderedName(p3tIdx)).eq(null);
    });

    it("add groups", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <group name="g">
        <math name="x">x</math> <text>hi <text name="t">there</text></text>
    </group>
    <group name="g2">
        <math name="x">x2</math> <text>bye <text name="t2">now</text></text>
    </group>
    <group><math name="x">x3</math><text>hi <text name="t">there again</text></text></group>`,
        });

        const gIdx = await resolvePathToNodeIdx("g");
        const g2Idx = await resolvePathToNodeIdx("g2");
        const gxIdx = await resolvePathToNodeIdx("g.x");
        const gtIdx = await resolvePathToNodeIdx("g.t");
        const g2xIdx = await resolvePathToNodeIdx("g2.x");
        const g2t2Idx = await resolvePathToNodeIdx("g2.t2");

        let stateVariables = await core.returnAllStateVariables(false, true);

        const g3xIdx =
            stateVariables[0].activeChildren[
                stateVariables[0].activeChildren.length - 2
            ].componentIdx;
        const g3tIdx =
            stateVariables[0].activeChildren[
                stateVariables[0].activeChildren.length - 1
            ].componentIdx;
        const getRenderedName = core.core!.getRenderedName;

        expect(getRenderedName(gIdx)).eq(null);
        expect(getRenderedName(g2Idx)).eq(null);
        expect(getRenderedName(gxIdx)).eq("g.x");
        expect(getRenderedName(gtIdx)).eq("g.t");
        expect(getRenderedName(g2xIdx)).eq("g2.x");
        expect(getRenderedName(g2t2Idx)).eq("t2");
        expect(getRenderedName(g3xIdx)).eq(null);
        expect(getRenderedName(g3tIdx)).eq(null);
    });

    it("single replacements of composites get composite name for rendered name", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
            
    <selectFromSequence name="a" />

    <select name="b">x y</select>

    <select name="c">
        <option>
            <text>hi</text>
        </option>
        <option>
            <text>bye</text>
        </option>
    </select>

            `,
        });

        const aReplacementIdx = await resolvePathToNodeIdx("a[1]");
        const bReplacementIdx = await resolvePathToNodeIdx("b[1][1]");
        const cReplacementIdx = await resolvePathToNodeIdx("c[1][1]");

        const getRenderedName = core.core!.getRenderedName;

        expect(getRenderedName(aReplacementIdx)).eq("a");
        expect(getRenderedName(bReplacementIdx)).eq("b");
        expect(getRenderedName(cReplacementIdx)).eq("c");
    });

    it("composite names for rendered names adjust dynamically", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `

<booleanInput name="bi" />
            
<conditionalContent name="cc" condition="$bi">
    <math>z</math>
</conditionalContent>

<conditionalContent name="cc2">
    <case condition="$bi">
        <math>x</math>
    </case>
    <else>
         <math>y</math>
    </else>
</conditionalContent>

            `,
        });

        const getRenderedName = core.core!.getRenderedName;

        let ccReplacementIdx = await resolvePathToNodeIdx("cc[1][1]");
        expect(ccReplacementIdx).eq(-1);

        let cc2ReplacementIdx = await resolvePathToNodeIdx("cc2[1][1]");
        expect(getRenderedName(cc2ReplacementIdx)).eq("cc2");

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[cc2ReplacementIdx].stateValues.value.tree).eq(
            "y",
        );

        const biIdx = await resolvePathToNodeIdx("bi");
        await updateBooleanInputValue({
            componentIdx: biIdx,
            boolean: true,
            core,
        });

        ccReplacementIdx = await resolvePathToNodeIdx("cc[1][1]");
        expect(getRenderedName(ccReplacementIdx)).eq("cc");

        cc2ReplacementIdx = await resolvePathToNodeIdx("cc2[1][1]");
        expect(getRenderedName(cc2ReplacementIdx)).eq("cc2");

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[ccReplacementIdx].stateValues.value.tree).eq("z");
        expect(stateVariables[cc2ReplacementIdx].stateValues.value.tree).eq(
            "x",
        );
    });

    it("descendant names of single replacements of composite", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
            
    <select name="s">
        <option>
            <text name="t">hi</text><math name="x">x</math>
        </option>
        <option>
            <text name="t">bye</text><math name="x">y</math>
        </option>
    </select>

            `,
        });

        const stIdx = await resolvePathToNodeIdx("s.t");
        const sxIdx = await resolvePathToNodeIdx("s.x");

        const getRenderedName = core.core!.getRenderedName;

        expect(getRenderedName(stIdx)).eq("s.t");
        expect(getRenderedName(sxIdx)).eq("s.x");

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(["hi", "bye"]).toContain(
            stateVariables[stIdx].stateValues.value,
        );
        expect(["x", "y"]).toContain(
            stateVariables[sxIdx].stateValues.value.tree,
        );
    });

    it("descendant names of single replacements of composite adjust dynamically", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `

<booleanInput name="bi" />
            
<conditionalContent name="cc" condition="$bi">
    <math name="x">z</math><text name="t">grape</text>
</conditionalContent>

<conditionalContent name="cc2">
    <case condition="$bi">
        <math name="x">x</math><text name="t">apple</text>
    </case>
    <else>
        <math name="x">y</math><text name="t">banana</text>
    </else>
</conditionalContent>

            `,
        });

        console.log("1", core.core!.potentialRenderedNames);

        const getRenderedName = core.core!.getRenderedName;

        let ccxReplacementIdx = await resolvePathToNodeIdx("cc.x");
        expect(ccxReplacementIdx).eq(-1);
        let cctReplacementIdx = await resolvePathToNodeIdx("cc.t");
        expect(cctReplacementIdx).eq(-1);

        let cc2xReplacementIdx = await resolvePathToNodeIdx("cc2.x");
        expect(getRenderedName(cc2xReplacementIdx)).eq("cc2.x");
        let cc2tReplacementIdx = await resolvePathToNodeIdx("cc2.t");
        expect(getRenderedName(cc2tReplacementIdx)).eq("cc2.t");

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[cc2xReplacementIdx].stateValues.value.tree).eq(
            "y",
        );
        expect(stateVariables[cc2tReplacementIdx].stateValues.value).eq(
            "banana",
        );

        const biIdx = await resolvePathToNodeIdx("bi");
        await updateBooleanInputValue({
            componentIdx: biIdx,
            boolean: true,
            core,
        });

        console.log("2", core.core!.potentialRenderedNames);

        ccxReplacementIdx = await resolvePathToNodeIdx("cc.x");
        expect(getRenderedName(ccxReplacementIdx)).eq("cc.x");
        cctReplacementIdx = await resolvePathToNodeIdx("cc.t");
        expect(getRenderedName(cctReplacementIdx)).eq("cc.t");

        cc2xReplacementIdx = await resolvePathToNodeIdx("cc2.x");
        expect(getRenderedName(cc2xReplacementIdx)).eq("cc2.x");
        cc2tReplacementIdx = await resolvePathToNodeIdx("cc2.t");
        expect(getRenderedName(cc2tReplacementIdx)).eq("cc2.t");

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[ccxReplacementIdx].stateValues.value.tree).eq(
            "z",
        );
        expect(stateVariables[cctReplacementIdx].stateValues.value).eq("grape");
        expect(stateVariables[cc2xReplacementIdx].stateValues.value.tree).eq(
            "x",
        );
        expect(stateVariables[cc2tReplacementIdx].stateValues.value).eq(
            "apple",
        );
    });

    it("adapted component uses rendered name of original component", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
            
    <p name="p"><point name="P">(3,4)</point></p>

            `,
        });

        const PIdx = await resolvePathToNodeIdx("P");
        const pIdx = await resolvePathToNodeIdx("p");

        const stateVariables = await core.returnAllStateVariables(false, true);
        const adapterIdx = stateVariables[pIdx].activeChildren[0].componentIdx;

        const getRenderedName = core.core!.getRenderedName;

        expect(getRenderedName(adapterIdx)).eq("P");
        expect(getRenderedName(PIdx)).eq("P");
        expect(getRenderedName(pIdx)).eq("p");

        expect(stateVariables[adapterIdx].stateValues.value.tree).eqls([
            "vector",
            3,
            4,
        ]);
    });
});
