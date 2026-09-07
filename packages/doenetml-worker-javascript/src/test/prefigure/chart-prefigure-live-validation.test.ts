import { describe, expect, it } from "vitest";
import {
    RUN_LIVE_PREFIGURE_VALIDATION,
    getPrefigureXML,
    validatePrefigureXMLAgainstBuildService,
} from "./graph-prefigure.helpers";

/**
 * What a Vitest assertion on the generated XML cannot tell us: whether PreFigure
 * accepts it. `<legend>` and a scaled `<label>` are emitted by `<chart>` and by
 * nothing else in the worker, and no other live case compiles the `<group>` a
 * chart nests its series in. A legend in particular is assembled in Python out
 * of the elements its items point at — so an item referring to a handle that
 * does not exist, or to one whose element carries no `fill`, is a drawing with a
 * piece missing rather than a compile error the tests below would catch.
 *
 * Opt-in, like the graph's: it posts to a live build service, so it is off by
 * default and run with `RUN_LIVE_PREFIGURE_VALIDATION=1`.
 */
describe("Chart prefigure renderer live validation @group4", () => {
    it.skipIf(!RUN_LIVE_PREFIGURE_VALIDATION)(
        "optional: build service accepts generated XML for the chart types",
        async () => {
            const cases = [
                {
                    doenetML: `
    <chart type="bar" name="c" categories="North South East West" displayValues>
      <shortDescription>Population by region</shortDescription>
      <yLabel>people</yLabel>
      41 63 18 78
    </chart>`,
                    expectText: "bar (one implicit series)",
                },
                {
                    doenetML: `
    <chart type="bar" name="c" categories="North South East West" displayValues>
      <title>Population by region</title>
      <shortDescription>Population by region, 2024 against 2025</shortDescription>
      <yLabel>people</yLabel>
      <series><label>2024</label>41 63 18 78</series>
      <series><label>2025</label>45 60 22 80</series>
    </chart>`,
                    expectText: "bar (grouped, titled, with a legend)",
                },
                {
                    doenetML: `
    <chart type="bar" name="c" layout="stacked" categories="A B" legendPosition="lowerLeft">
      <series><label>up</label>4 9</series>
      <series><label>down</label>-3 2</series>
    </chart>`,
                    expectText: "bar (stacked, mixed signs)",
                },
            ];

            for (const c of cases) {
                const prefigureXML = await getPrefigureXML(c.doenetML, "c");

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
});
