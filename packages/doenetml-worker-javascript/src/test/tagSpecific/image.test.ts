import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";
import { widthsBySize } from "@doenet/utils";
import { test_in_graph } from "../utils/in-graph";
import { PublicDoenetMLCore } from "../../CoreWorker";
import { cleanLatex } from "../utils/math";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

export async function moveImage({
    componentIdx,
    x,
    y,
    core,
}: {
    componentIdx: number;
    x: number;
    y: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "moveImage",
        args: { x, y },
    });
}

describe("Image tag tests @group3", async () => {
    it("image sizes", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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

        let expectedSizes: Record<string, string> = {
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

        let stateVariables = await core.returnAllStateVariables(false, true);
        for (let name in expectedSizes) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .size,
            ).eq(expectedSizes[name]);
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .width.size,
            ).eq(widthsBySize[expectedSizes[name]]);
        }
    });

    it("horizontal align", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <image name="i" />
    <image name="ileft" horizontalAlign="left" />
    <image name="iright" horizontalAlign="right" />
    <image name="icenter" horizontalAlign="center" />
    <image name="iinvalid" horizontalAlign="invalid" />

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("i")].stateValues
                .horizontalAlign,
        ).eq("center");
        expect(
            stateVariables[await resolvePathToNodeIdx("ileft")].stateValues
                .horizontalAlign,
        ).eq("left");
        expect(
            stateVariables[await resolvePathToNodeIdx("iright")].stateValues
                .horizontalAlign,
        ).eq("right");
        expect(
            stateVariables[await resolvePathToNodeIdx("icenter")].stateValues
                .horizontalAlign,
        ).eq("center");
        expect(
            stateVariables[await resolvePathToNodeIdx("iinvalid")].stateValues
                .horizontalAlign,
        ).eq("center");

        // TODO: anything to check in the DOM?
    });

    it("displayMode", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <image name="i" />
    <image name="iinline" displayMode="inline" />
    <image name="iblock" displayMode="block" />
    <image name="iinvalid" displayMode="invalid" />

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("i")].stateValues
                .displayMode,
        ).eq("block");
        expect(
            stateVariables[await resolvePathToNodeIdx("iinline")].stateValues
                .displayMode,
        ).eq("inline");
        expect(
            stateVariables[await resolvePathToNodeIdx("iblock")].stateValues
                .displayMode,
        ).eq("block");
        expect(
            stateVariables[await resolvePathToNodeIdx("iinvalid")].stateValues
                .displayMode,
        ).eq("block");
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
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph >
      <image rotate="$rotate1" name="image1" />
    </graph>
    
    <p>Change rotate 1 <mathInput name="rotate1" prefill="pi/4" /></p>
    <p>Change rotate 1a <mathInput name="rotate1a" bindValueTo="$image1.rotate" /></p>

    <image extend="$image1" name="image1a" />

    `,
        });

        // Is there a way to test the rotation of the image in the graph?

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("image1")].stateValues
                .rotate,
        ).eq(Math.PI / 4);

        await updateMathInputValue({
            latex: "3\\pi/4",
            componentIdx: await resolvePathToNodeIdx("rotate1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("image1")].stateValues
                .rotate,
        ).eq((3 * Math.PI) / 4);

        await updateMathInputValue({
            latex: "-\\pi",
            componentIdx: await resolvePathToNodeIdx("rotate1a"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("image1")].stateValues
                .rotate,
        ).eq(-Math.PI);
    });

    it("image in graph, handle bad anchor coordinates", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
            <graph >
              <image anchor="$anchorCoords1" name="image1" />
            </graph>
            
        
            <p name="pAnchor1">Anchor 1 coordinates:  <point extend="$image1.anchor" name="image1anchor" /></p>
            <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathInput name="anchorCoords1" prefill="x" /></p>
            
        
            `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("image1anchor")]
                    .stateValues.latex,
            ),
        ).eq("x");

        // give good anchor coords
        await updateMathInputValue({
            latex: "(6,7)",
            componentIdx: await resolvePathToNodeIdx("anchorCoords1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("image1anchor")]
                    .stateValues.latex,
            ),
        ).eq("(6,7)");

        // give bad anchor coords again
        await updateMathInputValue({
            latex: "q",
            componentIdx: await resolvePathToNodeIdx("anchorCoords1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("image1anchor")]
                    .stateValues.latex,
            ),
        ).eq("q");
    });

    it("accessibility diagnostic if no short description specified and decorative is not set", async () => {
        let { core } = await createTestCore({
            doenetML: `
<image name="image1" />
            `,
        });

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(0);
        expect(diagnosticsByType.accessibility.length).eq(1);
        expect(diagnosticsByType.accessibility[0].level).eq(1);

        expect(diagnosticsByType.accessibility[0].message).contain(
            "`<image>` must either have a short description or be specified as decorative",
        );
        // Diagnostic range is narrowed to the opening tag (`<image`) so the
        // editor squiggle and hover only cover the tag name itself.
        expect(diagnosticsByType.accessibility[0].position.start.line).eq(2);
        expect(diagnosticsByType.accessibility[0].position.start.column).eq(1);
        expect(diagnosticsByType.accessibility[0].position.end.line).eq(2);
        expect(diagnosticsByType.accessibility[0].position.end.column).eq(7);
    });

    it("with description", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><image name="image">
        <shortDescription>Hi</shortDescription>
        <description>
            <p>Hello!</p>
        </description>
    </image></p>

     `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("image")].stateValues
                .childIndicesToRender,
        ).eqls([1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("image")].activeChildren
                .length,
        ).eq(2);

        expect(
            stateVariables[await resolvePathToNodeIdx("image")]
                .activeChildren[1].componentType,
        ).eq("description");
    });

    it("license codes derive names and urls", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <image name="single" licenseCodes="CC-BY-SA" />
    <image name="dual" licenseCodes="CC-BY-SA CC0" />
    <image name="lowercase" licenseCodes="cc-by" />
    <image name="version3" licenseCodes="CC-BY-SA" licenseVersion="3.0" />
    <image name="nonCC" licenseCodes="MIT" licenseVersion="3.0" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        // a single Creative Commons code derives its name and versioned URL
        expect(
            stateVariables[await resolvePathToNodeIdx("single")].stateValues
                .licenseNames,
        ).eqls(["Creative Commons Attribution-ShareAlike"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("single")].stateValues
                .licenseUrls,
        ).eqls(["https://creativecommons.org/licenses/by-sa/4.0/"]);

        // two codes mean the image is dual-licensed
        expect(
            stateVariables[await resolvePathToNodeIdx("dual")].stateValues
                .licenseNames,
        ).eqls([
            "Creative Commons Attribution-ShareAlike",
            "CC0 1.0 Public Domain Dedication",
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("dual")].stateValues
                .licenseUrls,
        ).eqls([
            "https://creativecommons.org/licenses/by-sa/4.0/",
            "https://creativecommons.org/publicdomain/zero/1.0/",
        ]);

        // codes are matched case-insensitively
        expect(
            stateVariables[await resolvePathToNodeIdx("lowercase")].stateValues
                .licenseNames,
        ).eqls(["Creative Commons Attribution"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("lowercase")].stateValues
                .licenseUrls,
        ).eqls(["https://creativecommons.org/licenses/by/4.0/"]);

        // licenseVersion affects Creative Commons URLs
        expect(
            stateVariables[await resolvePathToNodeIdx("version3")].stateValues
                .licenseUrls,
        ).eqls(["https://creativecommons.org/licenses/by-sa/3.0/"]);

        // licenseVersion is ignored by non-Creative-Commons licenses
        expect(
            stateVariables[await resolvePathToNodeIdx("nonCC")].stateValues
                .licenseNames,
        ).eqls(["MIT License"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("nonCC")].stateValues
                .licenseUrls,
        ).eqls(["https://opensource.org/license/mit"]);
    });

    it("license names and urls fall back to preliminary attributes only when no codes are given", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <image name="prelim" licenseName="Custom License" licenseUrl="https://example.com/license" />
    <image name="codesWin" licenseCodes="CC-BY" licenseName="Custom License" licenseUrl="https://example.com/license" />
    <image name="none" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        // with no codes, fall back to the preliminary licenseName/licenseUrl
        expect(
            stateVariables[await resolvePathToNodeIdx("prelim")].stateValues
                .licenseNames,
        ).eqls(["Custom License"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("prelim")].stateValues
                .licenseUrls,
        ).eqls(["https://example.com/license"]);

        // codes take precedence over the preliminary attributes
        expect(
            stateVariables[await resolvePathToNodeIdx("codesWin")].stateValues
                .licenseNames,
        ).eqls(["Creative Commons Attribution"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("codesWin")].stateValues
                .licenseUrls,
        ).eqls(["https://creativecommons.org/licenses/by/4.0/"]);

        // nothing specified yields empty lists
        expect(
            stateVariables[await resolvePathToNodeIdx("none")].stateValues
                .licenseNames,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("none")].stateValues
                .licenseUrls,
        ).eqls([]);
    });

    it("unknown license codes are dropped with a diagnostic", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <image name="mixed" licenseCodes="CC-BY notALicense CC0" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        // the unknown code is dropped; known codes still resolve
        expect(
            stateVariables[await resolvePathToNodeIdx("mixed")].stateValues
                .licenseCodes,
        ).eqls(["cc-by", "cc0"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("mixed")].stateValues
                .licenseNames,
        ).eqls([
            "Creative Commons Attribution",
            "CC0 1.0 Public Domain Dedication",
        ]);
    });

    it("when all license codes are unknown, fall back to preliminary attributes or empty lists", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <image name="allBadNoFallback" licenseCodes="notALicense alsoNotALicense" />
    <image name="allBadWithFallback" licenseCodes="notALicense" licenseName="Custom License" licenseUrl="https://example.com/license" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        // all unknown codes are dropped, leaving no codes
        expect(
            stateVariables[await resolvePathToNodeIdx("allBadNoFallback")]
                .stateValues.licenseCodes,
        ).eqls([]);

        // with no valid codes and no fallback attributes, the lists are empty
        expect(
            stateVariables[await resolvePathToNodeIdx("allBadNoFallback")]
                .stateValues.licenseNames,
        ).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("allBadNoFallback")]
                .stateValues.licenseUrls,
        ).eqls([]);

        // with no valid codes, the preliminary licenseName/licenseUrl are used
        expect(
            stateVariables[await resolvePathToNodeIdx("allBadWithFallback")]
                .stateValues.licenseNames,
        ).eqls(["Custom License"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("allBadWithFallback")]
                .stateValues.licenseUrls,
        ).eqls(["https://example.com/license"]);
    });
});
