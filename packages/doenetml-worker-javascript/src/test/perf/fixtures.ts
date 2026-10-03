/**
 * Documents the performance harness measures (Doenet/DoenetML#2126).
 *
 * - `MICRO_DOCUMENTS`: one construct each, small enough to read the whole
 *   component graph. Their census is snapshotted in CI (`census.test.ts`), so
 *   a change to what a reference or an attribute creates shows up as a
 *   deliberate snapshot update.
 * - `benchFixtures()`: the documents whose load time matters. The dot plot
 *   is the Doenet/DoenetML#2023 document at a chosen number of plots; the
 *   repeat document is the shadow-heavy one from `memory-bench.test.ts`; the
 *   slow examples are the author-reported documents from
 *   Doenet/DoenetML#2101, checked in under `fixtures/`.
 */
import fs from "node:fs";

export type Fixture = {
    name: string;
    doenetML: string;
    kind: "micro" | "bench";
};

function micro(name: string, doenetML: string): Fixture {
    return { name, doenetML, kind: "micro" };
}

export const MICRO_DOCUMENTS: Fixture[] = [
    micro("number alone", `<number name="n">5</number>`),
    micro(
        "math displayDigits=$n",
        `<number name="n">5</number><math displayDigits="$n">3.123456x</math>`,
    ),
    micro(
        "math displayDigits=5",
        `<number name="n">5</number><math displayDigits="5">3.123456x</math>`,
    ),
    micro("inline $n", `<number name="n">5</number>$n`),
    micro("number $n+1", `<number name="n">5</number><number>$n+1</number>`),
    micro(
        "number 2$mi",
        `<mathInput name="mi">5</mathInput><number name="n">2$mi</number>`,
    ),
    micro(
        "number extend=$n",
        `<number name="n">5</number><number extend="$n" name="m"/>`,
    ),
    micro(
        "numberList $l[1]",
        `<numberList name="l">1 2 3 4</numberList><number>$l[1]</number>`,
    ),
    micro(
        "point $P",
        `<graph><point name="P">(1,2)</point></graph><graph>$P</graph>`,
    ),
    micro(
        "point $P.x",
        `<graph><point name="P">(1,2)</point></graph><p>$P.x</p>`,
    ),
    micro(
        "repeatForSequence $i^2 x4",
        `<repeatForSequence from="1" to="4" valueName="i"><number>$i^2</number></repeatForSequence>`,
    ),
    micro(
        "repeatForSequence literal x4",
        `<repeatForSequence from="1" to="4" valueName="i"><number>7</number></repeatForSequence>`,
    ),
];

/** The four sample distributions of the Doenet/DoenetML#2023 document, cycled. */
const DOT_PLOT_SAMPLES = [
    `type="gaussian" mean="10" standardDeviation="2"`,
    `type="gaussian" mean="30" standardDeviation="6"`,
    `type="logNormal" logMean="1" logStandardDeviation="1.25"`,
    `type="normalMixture" means="5 50" standardDeviations="3 2" weights="1 1"`,
];

/**
 * The dot-plot document from Doenet/DoenetML#2023: a `<module>` holding a
 * `<repeatForSequence>` of constrained points with a computed stack height,
 * copied `numPlots` times with 50 random values each. One plot is about
 * 4,000 components on `main` at 00a3551fc; the count grows linearly.
 */
export function dotPlotDocument(numPlots: number): string {
    const plots: string[] = [];
    for (let i = 1; i <= numPlots; i++) {
        const sample = DOT_PLOT_SAMPLES[(i - 1) % DOT_PLOT_SAMPLES.length];
        plots.push(`  <stack><setup><selectRandomNumbers ${sample} numToSelect="50" name="values${i}" /></setup>${i}.
    <module fixed copy="$dotPlot" name="dp${i}" values="$values${i}" /></stack>`);
    }
    const rows: string[] = [];
    for (let i = 0; i < plots.length; i += 2) {
        rows.push(
            `<sideBySide margins="1%">\n${plots.slice(i, i + 2).join("\n")}\n</sideBySide>`,
        );
    }
    return `
<variantControl numVariants="1" seeds="2" />
<setup>
  <module name="dotPlot">
    <moduleAttributes>
      <numberList name="values" />
      <label name="label" />
      <number name="dx">1</number>
      <number name="xMin">-3</number>
      <number name="xMax">54</number>
    </moduleAttributes>
    <setup>
      <count name="n">$values</count>
      <numberList name="valuesBinned">$Ps.x</numberList>
      <sequence name="indices" from="1" to="$n" />
      <sortIndices name="perm">$valuesBinned</sortIndices>
      <indexOf name="sortedPos" target="$indices">$perm</indexOf>
      <searchSorted name="first" allowUnsorted target="$valuesBinned">$valuesBinned</searchSorted>
    </setup>
    <graph size="medium" aspectRatio="2" displayYAxis="false" fixAxes xMin="$xMin" xmax="$xMax"
        showBorder="false" yMin="-3" yMax="8" xLabelPosition="left">
      <shortDescription>A dot plot of the values: $values</shortDescription>
      <xLabel>$label</xLabel>
      <repeatForSequence from="1" to="$n" indexName="i" name="Ps">
        <point name="P" labelPosition="top">
          ($values[$i], <number fixed>0.5 ($sortedPos[$i] - $first[$i])</number>)
          <constrainToGraph /> <constrainToGrid dx="$dx" dy="0.5" />
        </point>
      </repeatForSequence>
    </graph>
  </module>
</setup>
${rows.join("\n")}
`;
}

/**
 * The shadow-heavy repeat document from `memory-bench.test.ts`: every
 * iteration's components are reference shadows.
 */
export function repeatDocument(iterations = 150): string {
    return `
<repeatForSequence from="1" to="${iterations}" valueName="i" name="rep">
  <p>Point <number extend="$i" name="n" />:
    <point name="P">($i, 2$i)</point>
    <math name="m" simplify>$P.x + $n</math>
    <boolean name="b">$m > 3</boolean>
  </p>
</repeatForSequence>
`;
}

/** The author-reported slow documents of Doenet/DoenetML#2101. */
export const SLOW_EXAMPLE_NAMES = [
    "measures-of-spread",
    "hardware-assignment-2",
    "unit-circle-labeling",
] as const;

export type SlowExampleName = (typeof SLOW_EXAMPLE_NAMES)[number];

export function slowExampleDocument(name: SlowExampleName): string {
    return fs.readFileSync(
        new URL(`./fixtures/${name}.doenet`, import.meta.url),
        "utf8",
    );
}

export function benchFixtures(): Fixture[] {
    return [
        { name: "dot-plot-1", doenetML: dotPlotDocument(1), kind: "bench" },
        { name: "dot-plot-2", doenetML: dotPlotDocument(2), kind: "bench" },
        { name: "dot-plot-4", doenetML: dotPlotDocument(4), kind: "bench" },
        { name: "repeat-150", doenetML: repeatDocument(150), kind: "bench" },
        ...SLOW_EXAMPLE_NAMES.map((name) => ({
            name,
            doenetML: slowExampleDocument(name),
            kind: "bench" as const,
        })),
    ];
}
