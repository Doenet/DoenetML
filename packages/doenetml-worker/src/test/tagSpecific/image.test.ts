import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";
import { widthsBySize } from "@doenet/utils";
import { test_in_graph } from "../utils/in-graph";
import Core from "../../Core";
import { cleanLatex } from "../utils/math";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

export async function moveImage({
    name,
    x,
    y,
    core,
}: {
    name: string;
    x: number;
    y: number;
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "moveImage",
        args: { x, y },
        event: null,
    });
}

describe("Image tag tests", async () => {
    it("image sizes", async () => {
        let core = await createTestCore({
            doenetML: `
    <image name="i" />

    <image name="itiny" size="tiny" />
    <image name="ismall" size="small" />
    <image name="imedium" size="medium" />
    <image name="ilarge" size="large" />
    <image name="ifull" size="full" />
    <image name="iinvalid" size="invalid" />

    <image name="ia10" width="10" />
    <image name="ia100" width="100" />
    <image name="ia200" width="200" />
    <image name="ia300" width="300" />
    <image name="ia400" width="400" />
    <image name="ia500" width="500" />
    <image name="ia600" width="600" />
    <image name="ia700" width="700" />
    <image name="ia800" width="800" />
    <image name="ia900" width="900" />
    <image name="ia10000" width="10000" />

    <image name="ip1" width="1%" />
    <image name="ip10" width="10%" />
    <image name="ip20" width="20%" />
    <image name="ip30" width="30%" />
    <image name="ip40" width="40%" />
    <image name="ip50" width="50%" />
    <image name="ip60" width="60%" />
    <image name="ip70" width="70%" />
    <image name="ip80" width="80%" />
    <image name="ip90" width="90%" />
    <image name="ip100" width="100%" />
    <image name="ip1000" width="1000%" />

    <image name="ibadwidth" width="bad" />

    `,
        });

        let expectedSizes = {
            i: "medium",
            itiny: "tiny",
            ismall: "small",
            imedium: "medium",
            ilarge: "large",
            ifull: "full",
            iinvalid: "medium",
            ia10: "tiny",
            ia100: "tiny",
            ia200: "small",
            ia300: "small",
            ia400: "medium",
            ia500: "medium",
            ia600: "large",
            ia700: "large",
            ia800: "full",
            ia900: "full",
            ia10000: "full",
            ip1: "tiny",
            ip10: "tiny",
            ip20: "small",
            ip30: "small",
            ip40: "small",
            ip50: "medium",
            ip60: "medium",
            ip70: "large",
            ip80: "large",
            ip90: "full",
            ip100: "full",
            ip1000: "full",
            ibadwidth: "medium",
        };

        let stateVariables = await returnAllStateVariables(core);
        for (let name in expectedSizes) {
            expect(stateVariables["/" + name].stateValues.size).eq(
                expectedSizes[name],
            );
            expect(stateVariables["/" + name].stateValues.width.size).eq(
                widthsBySize[expectedSizes[name]],
            );
        }
    });

    it("horizontal align", async () => {
        let core = await createTestCore({
            doenetML: `
    <image name="i" />
    <image name="ileft" horizontalAlign="left" />
    <image name="iright" horizontalAlign="right" />
    <image name="icenter" horizontalAlign="center" />
    <image name="iinvalid" horizontalAlign="invalid" />

    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/i"].stateValues.horizontalAlign).eq("center");
        expect(stateVariables["/ileft"].stateValues.horizontalAlign).eq("left");
        expect(stateVariables["/iright"].stateValues.horizontalAlign).eq(
            "right",
        );
        expect(stateVariables["/icenter"].stateValues.horizontalAlign).eq(
            "center",
        );
        expect(stateVariables["/iinvalid"].stateValues.horizontalAlign).eq(
            "center",
        );

        // TODO: anything to check in the DOM?
    });

    it("displayMode", async () => {
        let core = await createTestCore({
            doenetML: `
    <image name="i" />
    <image name="iinline" displayMode="inline" />
    <image name="iblock" displayMode="block" />
    <image name="iinvalid" displayMode="invalid" />

    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/i"].stateValues.displayMode).eq("block");
        expect(stateVariables["/iinline"].stateValues.displayMode).eq("inline");
        expect(stateVariables["/iblock"].stateValues.displayMode).eq("block");
        expect(stateVariables["/iinvalid"].stateValues.displayMode).eq("block");
    });

    it("image in graph", async () => {
        const doenetMLsnippet = `
    <graph >
        <image anchor="$anchorCoords1" name="item1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1" fixed="$fixed1" fixLocation="$fixLocation1"/>
        <image name="item2" />
    </graph>
        `;

        await test_in_graph(doenetMLsnippet, moveImage);
    });

    it("rotate image in graph", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph >
      <image rotate="$rotate1" name="image1" />
    </graph>
    
    <p>Change rotate 1 <mathInput name="rotate1" prefill="pi/4" /></p>
    <p>Change rotate 1a <mathInput name="rotate1a" bindValueTo="$image1.rotate" /></p>

    <image copySource="image1" name="image1a" />

    `,
        });

        // Is there a way to test the rotation of the image in the graph?

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/image1"].stateValues.rotate).eq(Math.PI / 4);

        await updateMathInputValue({
            latex: "3\\pi/4",
            name: "/rotate1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/image1"].stateValues.rotate).eq(
            (3 * Math.PI) / 4,
        );

        await updateMathInputValue({
            latex: "-\\pi",
            name: "/rotate1a",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/image1"].stateValues.rotate).eq(-Math.PI);
    });

    it("math in graph, handle bad anchor coordinates", async () => {
        let core = await createTestCore({
            doenetML: `
            <graph >
              <image anchor="$anchorCoords1" name="image1" />
            </graph>
            
        
            <p name="pAnchor1">Anchor 1 coordinates:  <point copySource="image1.anchor" name="image1anchor" /></p>
            <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathInput name="anchorCoords1" prefill="x" /></p>
            
        
            `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/image1anchor"].stateValues.latex),
        ).eq("x");

        // give good anchor coords
        await updateMathInputValue({
            latex: "(6,7)",
            name: "/anchorCoords1",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/image1anchor"].stateValues.latex),
        ).eq("(6,7)");

        // give bad anchor coords again
        await updateMathInputValue({
            latex: "q",
            name: "/anchorCoords1",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/image1anchor"].stateValues.latex),
        ).eq("q");
    });
});
