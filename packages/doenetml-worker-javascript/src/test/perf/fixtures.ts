/**
 * Documents the performance harness measures (Doenet/DoenetML#2126).
 *
 * - `MICRO_DOCUMENTS`: one construct each, small enough to read the whole
 *   component graph. Their census is snapshotted in CI (`census.test.ts`), so
 *   a change to what a reference or an attribute creates shows up as a
 *   deliberate snapshot update.
 * - `benchFixtures()`: the documents whose load time matters. The dot plot
 *   is the Doenet/DoenetML#2023 document at a chosen number of plots; the
 *   drag dot plot is the 50-point document `drag-bench.test.ts` drags, and is
 *   the one fixture that is also dragged; the repeat document is the
 *   shadow-heavy one from `memory-bench.test.ts`; the slow examples are the
 *   author-reported documents from Doenet/DoenetML#2101, checked in under
 *   `fixtures/`.
 */
import fs from "node:fs";

export type Fixture = {
    name: string;
    doenetML: string;
    kind: "micro" | "bench";
    /**
     * Also measure the median cost of one drag of the named point. The name
     * is a path for `resolvePathToNodeIdx`; the first `point` by index would
     * be wrong here, since a hidden line segment's `endpoints` attribute
     * creates points too.
     */
    drag?: { target: string };
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
        "boolean $P=(1,2)",
        `<graph><point name="P">(1,2)</point></graph><boolean>$P = (1,2)</boolean>`,
    ),
    micro(
        "repeatForSequence $i^2 x4",
        `<repeatForSequence from="1" to="4" valueName="i"><number>$i^2</number></repeatForSequence>`,
    ),
    micro(
        "repeatForSequence literal x4",
        `<repeatForSequence from="1" to="4" valueName="i"><number>7</number></repeatForSequence>`,
    ),
    micro(
        "answer when $mi=x",
        `<mathInput name="mi" /><answer><award><when>$mi = x</when></award></answer>`,
    ),
    micro(
        "collect numbers x4",
        `<section name="s"><number>1</number><number>2</number><number>3</number><number>4</number></section><p><collect componentType="number" from="$s"/></p>`,
    ),
    micro(
        "sort $l of 4",
        `<numberList name="l">3 1 4 2</numberList><p><sort>$l</sort></p>`,
    ),
    micro("shuffle literal x4", `<p><shuffle>3 1 4 2</shuffle></p>`),
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
 * copied `numPlots` times with 50 random values each. Its points cannot be
 * dragged (the module copies are `fixed`, and so are the random values), so
 * it is a load fixture only; `dragDotPlotDocument` is the one that drags. One plot is about
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
 * The 50-point dot plot that `drag-bench.test.ts` drags: no module, the
 * sampled values carry `fixed="false"`, and each point's x is one of them, so
 * a `movePoint` on a point writes through to the sample. It is the document
 * the drag-cost issues measured (Doenet/DoenetML#1946, #1951, #1978, #1983),
 * with one attribute added: `variantDeterminesSeed`, so the sample, and with
 * it the tally's replacement count and the census, reproduce from run to run
 * (without it the sample is date-seeded and the component count drifts by a
 * few).
 */
export function dragDotPlotDocument(numPoints = 50): string {
    return `
<setup>
  <sampleRandomNumbers name="ns" type="gaussian" mean="20"
      standardDeviation="10" numSamples="${numPoints}" fixed="false"
      variantDeterminesSeed />
</setup>

<graph displayYAxis="false" fixAxes aspectRatio="4" xMin="-2" xMax="102"
    yMin="-3" size="full" showBorder="false">
  <lineSegment name="axis" hide endpoints="(0,0) (100,0)" />
  <repeatForSequence from="1" to="${numPoints}" indexName="i" name="Ps">
    <point name="P" labelPosition="top">
      ($ns[$i], <number fixed>0.5 ($sortedPos[$i] - $first[$i])</number>)
      <constrainToGraph />
      <constrainToGrid dx="2" dy="0.5" />
    </point>
  </repeatForSequence>
</graph>

<setup>
  <numberList name="values">$Ps.x</numberList>
  <sequence name="indices" from="1" to="${numPoints}" />
  <sortIndices name="perm">$values</sortIndices>
  <indexOf name="sortedPos" target="$indices">$perm</indexOf>
  <searchSorted name="first" allowUnsorted target="$values">$values</searchSorted>
  <tally name="tally">$values</tally>
</setup>

<p>Mean: <mean name="mean">$values</mean></p>
<p>Median: <median name="median">$values</median></p>
`;
}

/**
 * The shadow-heavy repeat document from `memory-bench.test.ts`. The
 * references in each iteration (`$i`, `$P.x`, `$n`, `$m`) make 35 of its 56
 * components shadows; the template's own `p`, `point`, `math`, `boolean`
 * and `coords` are not.
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
        {
            name: "dot-plot-drag-50",
            doenetML: dragDotPlotDocument(50),
            kind: "bench",
            drag: { target: "Ps[1].P" },
        },
        { name: "repeat-150", doenetML: repeatDocument(150), kind: "bench" },
        ...SLOW_EXAMPLE_NAMES.map((name) => ({
            name,
            doenetML: slowExampleDocument(name),
            kind: "bench" as const,
        })),
    ];
}
