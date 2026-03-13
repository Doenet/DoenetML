import { describe, expect, it } from "vitest";
import {
    RUN_LIVE_PREFIGURE_VALIDATION,
    getPrefigureXML,
    validatePrefigureXMLAgainstBuildService,
} from "./graph-prefigure.helpers";
import { prefigureGraph } from "./graph-prefigure.fixtures";

describe("Graph prefigure renderer live validation @group4", () => {
    it.skipIf(!RUN_LIVE_PREFIGURE_VALIDATION)(
        "optional: build service accepts generated XML for line/ray/vector/circle/polygon",
        async () => {
            const cases = [
                {
                    doenetML: prefigureGraph('<line through="(1,2) (3,4)" />'),
                    expectText: "line",
                },
                {
                    doenetML: prefigureGraph(
                        '<ray endpoint="(0,0)" through="(1,1)" />',
                        { attrs: 'xMin="-10" yMin="-10" xMax="10" yMax="10"' },
                    ),
                    expectText: "ray",
                },
                {
                    doenetML: prefigureGraph(
                        '<vector tail="(3,5)" head="(-4,2)" />',
                    ),
                    expectText: "vector",
                },
                {
                    doenetML: prefigureGraph(
                        '<circle center="(1,2)" radius="3" />',
                    ),
                    expectText: "circle",
                },
                {
                    doenetML: prefigureGraph(
                        '<polygon vertices="(0,0) (2,0) (1,1)" />',
                    ),
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
            const prefigureXML = await getPrefigureXML(prefigureGraph(""));

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
