import { getGraphRendererState } from "./graph-prefigure.helpers";

/**
 * Helpers shared by the four `<chart>` suites.
 *
 * The suites are split by what they are about — the component itself, and then
 * one per family of marks — the same seam `utils/prefigure/chart/` is split
 * along. These two are what every one of them needs.
 */

/** The PreFigure XML `<chart name="c">` produces. */
export async function chartXML(
    doenetML: string,
    options: { theme?: "dark" | "light" } = {},
) {
    return (await getGraphRendererState(doenetML, "c", options)).prefigureXML;
}

/** A four-bar chart with its categories named, the shape most tests start from. */
export const FOUR_BARS = `
    <chart type="bar" name="c" categories="North South East West">
      <shortDescription>Counts by region</shortDescription>
      <number>41</number><number>63</number><number>18</number><number>78</number>
    </chart>
    `;
