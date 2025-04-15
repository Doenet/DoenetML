import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { widthsBySize } from "@doenet/utils";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Video tag tests", async () => {
    it("video sizes", async () => {
        let core = await createTestCore({
            doenetML: `
    <video name="v" />

    <video name="vtiny" size="tiny" />
    <video name="vsmall" size="small" />
    <video name="vmedium" size="medium" />
    <video name="vlarge" size="large" />
    <video name="vfull" size="full" />
    <video name="vinvalid" size="vnvalid" />

    <video name="va10" width="10" />
    <video name="va100" width="100" />
    <video name="va200" width="200" />
    <video name="va300" width="300" />
    <video name="va400" width="400" />
    <video name="va500" width="500" />
    <video name="va600" width="600" />
    <video name="va700" width="700" />
    <video name="va800" width="800" />
    <video name="va900" width="900" />
    <video name="va10000" width="10000" />

    <video name="vp1" width="1%" />
    <video name="vp10" width="10%" />
    <video name="vp20" width="20%" />
    <video name="vp30" width="30%" />
    <video name="vp40" width="40%" />
    <video name="vp50" width="50%" />
    <video name="vp60" width="60%" />
    <video name="vp70" width="70%" />
    <video name="vp80" width="80%" />
    <video name="vp90" width="90%" />
    <video name="vp100" width="100%" />
    <video name="vp1000" width="1000%" />

    <video name="vbadwidth" width="bad" />

    `,
        });

        let expectedSizes = {
            v: "full",
            vtiny: "tiny",
            vsmall: "small",
            vmedium: "medium",
            vlarge: "large",
            vfull: "full",
            vinvalid: "full",
            va10: "tiny",
            va100: "tiny",
            va200: "small",
            va300: "small",
            va400: "medium",
            va500: "medium",
            va600: "large",
            va700: "large",
            va800: "full",
            va900: "full",
            va10000: "full",
            vp1: "tiny",
            vp10: "tiny",
            vp20: "small",
            vp30: "small",
            vp40: "small",
            vp50: "medium",
            vp60: "medium",
            vp70: "large",
            vp80: "large",
            vp90: "full",
            vp100: "full",
            vp1000: "full",
            vbadwidth: "full",
        };

        let stateVariables = await core.returnAllStateVariables(false, true);
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
    <video name="v" />
    <video name="vleft" horizontalAlign="left" />
    <video name="vright" horizontalAlign="right" />
    <video name="vcenter" horizontalAlign="center" />
    <video name="vinvalid" horizontalAlign="vnvalid" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/v"].stateValues.horizontalAlign).eq("center");
        expect(stateVariables["/vleft"].stateValues.horizontalAlign).eq("left");
        expect(stateVariables["/vright"].stateValues.horizontalAlign).eq(
            "right",
        );
        expect(stateVariables["/vcenter"].stateValues.horizontalAlign).eq(
            "center",
        );
        expect(stateVariables["/vinvalid"].stateValues.horizontalAlign).eq(
            "center",
        );
    });

    it("displayMode", async () => {
        let core = await createTestCore({
            doenetML: `
    <video name="v" />
    <video name="vinline" displayMode="inline" />
    <video name="vblock" displayMode="block" />
    <video name="vinvalid" displayMode="vnvalid" />

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/v"].stateValues.displayMode).eq("block");
        expect(stateVariables["/vinline"].stateValues.displayMode).eq("inline");
        expect(stateVariables["/vblock"].stateValues.displayMode).eq("block");
        expect(stateVariables["/vinvalid"].stateValues.displayMode).eq("block");
    });
});
