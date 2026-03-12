import "./graph-prefigure.setup";

import { describe, expect, it } from "vitest";
import {
    RUN_LIVE_PREFIGURE_VALIDATION,
    getPrefigureXML,
    validatePrefigureXMLAgainstBuildService,
} from "./graph-prefigure.helpers";

describe("Graph prefigure renderer live validation @group4", () => {
    it.skipIf(!RUN_LIVE_PREFIGURE_VALIDATION)(
        "optional: build service accepts generated XML for line/ray/vector/circle/polygon",
        async () => {
            const cases = [
                {
                    doenetML: `<graph name="g" renderer="prefigure"><line through="(1,2) (3,4)" /></graph>`,
                    expectText: "line",
                },
                {
                    doenetML: `<graph name="g" renderer="prefigure" xMin="-10" yMin="-10" xMax="10" yMax="10"><ray endpoint="(0,0)" through="(1,1)" /></graph>`,
                    expectText: "ray",
                },
                {
                    doenetML: `<graph name="g" renderer="prefigure"><vector tail="(3,5)" head="(-4,2)" /></graph>`,
                    expectText: "vector",
                },
                {
                    doenetML: `<graph name="g" renderer="prefigure"><circle center="(1,2)" radius="3" /></graph>`,
                    expectText: "circle",
                },
                {
                    doenetML: `<graph name="g" renderer="prefigure"><polygon vertices="(0,0) (2,0) (1,1)" /></graph>`,
                    expectText: "polygon",
                },
            ];

            for (const c of cases) {
                const prefigureXML = await getPrefigureXML(c.doenetML);

                expect(typeof prefigureXML).eq("string");

                const result =
                    await validatePrefigureXMLAgainstBuildService(prefigureXML);

                expect(
                    result.ok,
                    `${c.expectText}: Prefigure build failed: status=${result.status}, body=${JSON.stringify(
                        result.body,
                    )}`,
                ).toBe(true);
                expect(
                    result.body?.svg,
                    `${c.expectText}: missing svg`,
                ).toBeTruthy();
            }
        },
    );

    it.skipIf(!RUN_LIVE_PREFIGURE_VALIDATION)(
        "optional: build service accepts generated empty-graph XML",
        async () => {
            const prefigureXML = await getPrefigureXML(
                `<graph name="g" renderer="prefigure" />`,
            );

            expect(typeof prefigureXML).eq("string");

            const result =
                await validatePrefigureXMLAgainstBuildService(prefigureXML);

            expect(
                result.ok,
                `Prefigure build failed: status=${result.status}, body=${JSON.stringify(
                    result.body,
                )}`,
            ).toBe(true);
            expect(result.body?.svg).toBeTruthy();
        },
    );
});
