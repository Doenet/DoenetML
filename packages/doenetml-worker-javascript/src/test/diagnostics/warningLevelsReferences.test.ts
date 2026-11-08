import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A reference is decided by what it names (D35, DIAG-2): a reference to a
 * component that cannot change is decided by the DoenetML, so a condition
 * it causes is a warning; one to a component that can change (an input, a
 * random choice, the active case, or something a reader can write to) makes
 * it an info.
 *
 * A reader writes to what an input's `bindValueTo` names, to the target of
 * an `<updateValue>` or `<callAction>`, and to what is in a graph and not
 * fixed, as they drag it, including content not shown yet.
 */

/** The levels of the diagnostics with `code` once `doenetML` loads. */
async function levels(doenetML: string, code: string) {
    const { core } = await createTestCore({ doenetML });
    await core.returnAllStateVariables(false, true);
    return (core as any).core.diagnostics
        .filter((d: any) => d.code === code)
        .map((d: any) => d.type);
}

type Case = [name: string, code: string, level: string, doenetML: string];

function check(cases: Case[]) {
    for (const [name, code, level, doenetML] of cases) {
        it(`${name}: ${level}`, async () => {
            expect(await levels(doenetML, code)).eqls([level]);
        });
    }
}

describe("A reference to a component, by whether it can change", () => {
    check([
        [
            "a function written as a literal",
            "doenet-w0056",
            "warning",
            `<function name="f">(x, x^2)</function>
<functionIterates function="$f" initialValue="1" numIterates="2"/>`,
        ],
        [
            "a function from an input",
            "doenet-w0056",
            "info",
            `<mathInput name="mi" prefill="(x,x^2)"/><function name="f">$mi</function>
<functionIterates function="$f" initialValue="1" numIterates="2"/>`,
        ],
        [
            "a function through a chain of literals",
            "doenet-w0056",
            "warning",
            `<math name="a">(x,x^2)</math><function name="f">$a</function>
<functionIterates function="$f" initialValue="1" numIterates="2"/>`,
        ],
        [
            "cut points written as literals",
            "doenet-w0141",
            "warning",
            `<numberList name="edges">0 5 2</numberList>
<binCounts bins="$edges">1</binCounts>`,
        ],
        [
            "cut points through a reference to a literal number",
            "doenet-w0141",
            "warning",
            `<number name="a">5</number>
<binCounts bins="0 $a 2">1</binCounts>`,
        ],
        [
            "values from a list of literals",
            "doenet-w0140",
            "warning",
            `<textList name="w">apple fig</textList>
<binCounts bins="0 1 2">$w</binCounts>`,
        ],
        [
            "values from an input",
            "doenet-w0140",
            "info",
            `<textInput name="t" prefill="apple"/>
<binCounts bins="0 1 2">$t 1</binCounts>`,
        ],
        [
            "a sort of literals",
            "doenet-w0164",
            "warning",
            `<numberList name="scores">30 87 75 147</numberList>
<sort name="sorted">$scores</sort>
<searchSorted target="80">$sorted 1</searchSorted>`,
        ],
        [
            "an answer's credit",
            "doenet-w0141",
            "info",
            `<answer name="a">x</answer>
<binCounts bins="1 $a.creditAchieved">1</binCounts>`,
        ],
        [
            "the cells of a spreadsheet",
            "doenet-w0141",
            "info",
            `<spreadsheet name="s"><cell>0</cell><cell>5</cell><cell>2</cell></spreadsheet>
<binCounts bins="$s.cellA1 $s.cellB1 $s.cellC1">1</binCounts>`,
        ],
    ]);
});

describe("What a reader writes to can change", () => {
    check([
        [
            "fixed, though an input is bound to it",
            "doenet-w0056",
            "warning",
            `<function name="f" fixed>(x, x^2)</function>
<mathInput bindValueTo="$f"/>
<functionIterates function="$f" initialValue="1" numIterates="2"/>`,
        ],
        [
            "a literal an input is bound to, reached through a chain",
            "doenet-w0056",
            "info",
            `<math name="a">(x,x^2)</math><function name="f">$a</function>
<mathInput bindValueTo="$a"/>
<functionIterates function="$f" initialValue="1" numIterates="2"/>`,
        ],
        [
            "a component an input writes to, and the literal it references",
            "doenet-w0056",
            "info",
            `<math name="a">(x,x^2)</math><function name="f">$a</function>
<mathInput bindValueTo="$f"/>
<functionIterates function="$f" initialValue="1" numIterates="2"/>`,
        ],
        [
            "the target of an updateValue",
            "doenet-w0141",
            "info",
            `<numberList name="edges">0 5 2</numberList>
<updateValue target="$edges" newValue="0 1 2"/>
<binCounts bins="$edges">1</binCounts>`,
        ],
        [
            "bound by an input in a case not shown yet",
            "doenet-w0141",
            "info",
            `<numberList name="edges">0 5 2</numberList>
<booleanInput name="b"/>
<conditionalContent><case condition="$b"><mathInput bindValueTo="$edges[3]"/></case></conditionalContent>
<binCounts bins="$edges">1</binCounts>`,
        ],
        [
            "the target of a callAction",
            "doenet-w0144",
            "info",
            `<point name="P">(x,2)</point>
<callAction target="$P" actionName="movePoint"/>
<chart type="bar">4 $P.x</chart>`,
        ],
        [
            "a point a reader drags in a graph",
            "doenet-w0144",
            "info",
            `<graph><point name="P">(x,2)</point></graph>
<chart type="bar">4 $P.x</chart>`,
        ],
        [
            "a point whose copy a reader drags in a graph",
            "doenet-w0144",
            "info",
            `<point name="P">(x,2)</point>
<graph>$P</graph>
<chart type="bar">4 $P.x</chart>`,
        ],
        [
            "a point in a group a reader drags in a graph",
            "doenet-w0141",
            "info",
            `<group name="g"><point name="P">(2,1)</point></group>
<graph>$g</graph>
<binCounts bins="$P.x 0">1</binCounts>`,
        ],
        [
            "a point that a circle in a graph goes through",
            "doenet-w0027",
            "info",
            `<point name="A">(x,1)</point>
<graph><circle through="$A (2,3) (4,1)"/></graph>`,
        ],
        [
            "a math in a point that is not fixed, in a fixed graph",
            "doenet-w0100",
            "info",
            `<math name="m">5</math>
<graph fixed><point fixed="false">($m, 1)</point></graph>
<p>$m[2]</p>`,
        ],
        [
            "bound by an input in the same iteration of a repeat",
            "doenet-w0141",
            "info",
            `<repeat for="1" valueName="v"><numberList name="e">0 5 2</numberList><mathInput bindValueTo="$e[3]"/><binCounts bins="$e">1</binCounts></repeat>`,
        ],
        [
            "bound by an input in an iteration of a repeat, read from outside",
            "doenet-w0141",
            "info",
            `<repeat name="r" for="1" valueName="v"><numberList name="e">0 5 2</numberList><mathInput bindValueTo="$e[3]"/></repeat>
<binCounts bins="$r[1].e">1</binCounts>`,
        ],
        [
            "bound by an input in an iteration of a repeat in a repeat",
            "doenet-w0141",
            "info",
            `<repeat for="1" valueName="u"><repeat for="1" valueName="v"><numberList name="e">0 5 2</numberList><mathInput bindValueTo="$e[3]"/><binCounts bins="$e">1</binCounts></repeat></repeat>`,
        ],
        [
            "dragged in a graph in an iteration of a repeat",
            "doenet-w0100",
            "info",
            `<repeat for="1" valueName="v"><math name="m">5</math><graph><point>($m,1)</point></graph><p>$m[2]</p></repeat>`,
        ],
        [
            "in an iteration of a repeat that nothing writes to",
            "doenet-w0141",
            "warning",
            `<repeat for="1" valueName="u"><repeat for="1" valueName="v"><numberList name="e">0 5 2</numberList><binCounts bins="$e">1</binCounts></repeat></repeat>`,
        ],
        [
            "a point with a fixed location, though an input is bound to it",
            "doenet-w0144",
            "warning",
            `<point name="P" fixLocation>(x,2)</point>
<mathInput bindValueTo="$P.x"/>
<chart type="bar">4 $P.x</chart>`,
        ],
        [
            "a point with a fixed location, though an updateValue targets it",
            "doenet-w0144",
            "warning",
            `<point name="P" fixLocation>(x,2)</point>
<updateValue target="$P" newValue="(y,3)" type="point"/>
<chart type="bar">4 $P.x</chart>`,
        ],
        [
            "a list with fixLocation an input is bound to (it has no location)",
            "doenet-w0141",
            "info",
            `<numberList name="edges" fixLocation>0 5 2</numberList>
<mathInput bindValueTo="$edges[3]"/>
<binCounts bins="$edges">1</binCounts>`,
        ],
        [
            "a math in a point with a fixed location, that an input is bound to",
            "doenet-w0100",
            "info",
            `<point fixLocation>(<math name="m">5</math>, 1)</point>
<mathInput bindValueTo="$m"/>
<p>$m[2]</p>`,
        ],
        [
            "a math with fixLocation in a point a reader drags in a graph",
            "doenet-w0100",
            "info",
            `<math name="m" fixLocation>5</math>
<graph><point>($m, 1)</point></graph>
<p>$m[2]</p>`,
        ],
        [
            "a math in a point in a graph with a fixed location",
            "doenet-w0100",
            "warning",
            `<math name="m">5</math>
<graph fixLocation><point>($m, 1)</point></graph>
<p>$m[2]</p>`,
        ],
        [
            "a point that a fixed circle in a graph goes through",
            "doenet-w0027",
            "warning",
            `<point name="A">(x,1)</point>
<graph><circle fixed through="$A (2,3) (4,1)"/></graph>`,
        ],
    ]);
});

describe("The active case, and a random choice, can change", () => {
    check([
        [
            "in a case whose condition is a literal",
            "doenet-w0141",
            "warning",
            `<conditionalContent><case condition="true"><numberList name="e">0 5 2</numberList></case></conditionalContent>
<binCounts bins="$e">1</binCounts>`,
        ],
        [
            "in a case whose condition is an input",
            "doenet-w0141",
            "info",
            `<booleanInput name="b" prefill="true"/>
<conditionalContent><case condition="$b"><numberList name="e">0 5 2</numberList></case></conditionalContent>
<binCounts bins="$e">1</binCounts>`,
        ],
        [
            "in a case whose condition is whether a hint is open",
            "doenet-w0141",
            "info",
            `<hint name="h"><p>x</p></hint>
<conditionalContent><case condition="$h.open"><p>open</p></case><else><numberList name="e">0 5 2</numberList><binCounts bins="$e">1</binCounts></else></conditionalContent>`,
        ],
        [
            "in a repeat over literals",
            "doenet-w0141",
            "warning",
            `<repeat name="r" for="1" valueName="v"><numberList name="e">0 5 2</numberList></repeat>
<binCounts bins="$r[1].e">1</binCounts>`,
        ],
        [
            "in an option of a select",
            "doenet-w0141",
            "info",
            `<select name="s"><option><numberList name="edges">0 5 2</numberList></option></select>
<binCounts bins="$s.edges">1</binCounts>`,
        ],
        [
            "a random number",
            "doenet-w0141",
            "info",
            `<selectRandomNumbers name="r" from="0" to="1"/>
<binCounts bins="5 $r">1</binCounts>`,
        ],
    ]);
});

describe("An index into a value, by whether the value can change", () => {
    check([
        [
            "a literal math",
            "doenet-w0100",
            "warning",
            `<math name="m">5</math>
<p>$m[2]</p>`,
        ],
        [
            "a math an input is bound to",
            "doenet-w0100",
            "info",
            `<math name="m">5</math>
<mathInput bindValueTo="$m"/>
<p>$m[2]</p>`,
        ],
        [
            "a math in a point a reader drags",
            "doenet-w0100",
            "info",
            `<math name="m">5</math>
<graph><point>($m, 1)</point></graph>
<p>$m[2]</p>`,
        ],
        [
            "a math in a fixed point",
            "doenet-w0100",
            "warning",
            `<math name="m">5</math>
<graph><point fixed>($m, 1)</point></graph>
<p>$m[2]</p>`,
        ],
        [
            "an index from a literal number",
            "doenet-w0144",
            "warning",
            `<mathList name="l">x y</mathList><number name="i">1</number>
<chart type="bar">4 $l[$i]</chart>`,
        ],
        [
            "an index from an input",
            "doenet-w0144",
            "info",
            `<mathList name="l">x y</mathList><mathInput name="i" prefill="1"/>
<chart type="bar">4 $l[$i]</chart>`,
        ],
    ]);
});

describe("The children a check reads (childGroups)", () => {
    check([
        [
            "data through a reference to literals",
            "doenet-w0144",
            "warning",
            `<numberList name="d">4 7</numberList>
<math name="x">x</math>
<chart type="bar">$d $x</chart>`,
        ],
        [
            "data from an input",
            "doenet-w0144",
            "info",
            `<mathInput name="m" prefill="x"/>
<chart type="bar">4 $m</chart>`,
        ],
        [
            "data from a text input, read through an adapter",
            "doenet-w0144",
            "info",
            `<textInput name="t" prefill="a"/>
<chart type="bar">4 $t</chart>`,
        ],
        [
            "data from a text written as a literal, read through an adapter",
            "doenet-w0144",
            "warning",
            `<text name="t">a</text>
<chart type="bar">4 $t</chart>`,
        ],
        [
            "a title from a reference",
            "doenet-w0144",
            "warning",
            `<text name="t">T</text>
<chart type="bar"><title>$t</title>4 x</chart>`,
        ],
        [
            "a series' label from an input",
            "doenet-w0144",
            "warning",
            `<textInput name="t"/>
<chart type="bar"><series><label>$t</label>4 x</series></chart>`,
        ],
        [
            "a series' style from a reference to a literal",
            "doenet-w0144",
            "warning",
            `<number name="n">2</number>
<chart type="bar"><series styleNumber="$n">4 x</series></chart>`,
        ],
        // A known gap: a style attribute of a value child counts as part of
        // the value
        [
            "a series' style from an input",
            "doenet-w0144",
            "info",
            `<mathInput name="n" prefill="2"/>
<chart type="bar"><series styleNumber="$n">4 x</series></chart>`,
        ],
    ]);
});

describe("A copy is decided as its source is", () => {
    const cases: [string, string, string[], string][] = [
        [
            "a copy of a check whose attribute is from an input",
            "doenet-w0141",
            ["info", "info"],
            `<mathInput name="n" prefill="-1"/><binCounts name="b" bins="0 $n 2">1</binCounts>$b`,
        ],
        [
            "an extend of an extend of such a check",
            "doenet-w0141",
            ["info", "info", "info"],
            `<mathInput name="n" prefill="-1"/><binCounts name="b" bins="0 $n 2">1</binCounts>
<binCounts name="b2" extend="$b"/>$b2`,
        ],
        [
            "a copy of a group, read through the copy's own reference",
            "doenet-w0141",
            ["info", "info"],
            `<group name="g"><numberList name="e">0 5 2</numberList><mathInput bindValueTo="$e[3]"/><binCounts bins="$e">1</binCounts></group>$g`,
        ],
        [
            "a copy of a check whose attribute is a literal",
            "doenet-w0141",
            ["warning", "warning"],
            `<binCounts name="b" bins="0 -1 2">1</binCounts>$b`,
        ],
    ];
    for (const [name, code, expected, doenetML] of cases) {
        it(`${name}: ${expected.join(", ")}`, async () => {
            expect(await levels(doenetML, code)).eqls(expected);
        });
    }
});
