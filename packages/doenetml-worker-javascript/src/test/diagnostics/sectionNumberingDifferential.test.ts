/**
 * A generated differential test of the cycles through a section's number
 * (D57, #2623 item 1, #2618's approach (a)).
 *
 * The load-time check (`breakReferenceCycles`, with the edges from a
 * reference to a section's number to what its numbering waits for) predicts
 * what the run time waits for. Each generated document is loaded twice:
 *
 * - **the oracle:** with those edges off and the run-time backstop off
 *   (`setSectionNumberEdges(false)`, `setLoadCycleBackstop(false)`), so the
 *   run time alone decides. It has a cycle if it throws, reports an
 *   `e0005` (the run-time loop check), or its section's number runs away;
 * - **as shipped:** with both on.
 *
 * As shipped, a document never stops on a cycle. Where the oracle has no
 * cycle, it loads with no `e0005` (none is false) and the same number for
 * `s`. Where the oracle has one, it reports an `e0005`.
 *
 * The documents come from a small grammar, made only of cycles through the
 * number of the section `s`: composites that may make sections or read the
 * number (`writer`), what they hold (`content`), and references to them
 * (`reference`), placed before or after `s`, or in a `<div>`. CI runs a
 * fixed sample (`SAMPLE_SIZE`); `DOENET_SECTION_DIFFERENTIAL=all` runs
 * `FULL_SIZE` documents and prints a summary.
 */
import { afterAll, describe, expect, it, vi } from "vitest";
import * as fs from "node:fs";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { setSectionNumberEdges } from "../../utils/dast/referenceCycles";
import { setLoadCycleBackstop } from "../../utils/loadCycleBlame";

vi.stubGlobal("postMessage", vi.fn());
vi.mock("hyperformula");

const SAMPLE_SIZE = Number(process.env.DOENET_SECTION_DIFFERENTIAL_SIZE ?? 150);
const FULL_SIZE = 1000;
const SEED = 2623;
/** A section number past this has run away. */
const RUNAWAY = 30;

/** A small deterministic generator (mulberry32). */
function randomGenerator(seed: number) {
    let state = seed >>> 0;
    function next() {
        state = (state + 0x6d2b79f5) >>> 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    function pick<T>(items: readonly T[]): T {
        return items[Math.floor(next() * items.length)];
    }
    /**
     * How many more productions may repeat as many times as the section's
     * number. In the run with no prediction, such a production that makes
     * sections runs away, and two of them, or one in a repeat, run away
     * many times over: the run takes minutes, too slow for a test.
     */
    let counting = 1;
    /**
     * `pick`, but one that counts by the number only while allowed, and
     * never in a repeat (`repeating`).
     */
    function pickProduction(items: readonly string[], repeating: boolean) {
        const allowed =
            counting > 0 && !repeating
                ? items
                : items.filter((item) => !item.includes('to="$s.'));
        const picked = pick(allowed);
        if (picked.includes('to="$s.')) {
            counting--;
        }
        return picked;
    }
    function startDocument() {
        counting = 1;
    }
    return { next, pick, pickProduction, startDocument };
}

/**
 * What a composite holds: a section, something reading `s`, or both.
 * `repeating`: in a repeat, which may make it more than once.
 */
function content(
    rand: ReturnType<typeof randomGenerator>,
    depth: number,
    repeating: boolean,
) {
    const leaves = [
        `<section/>`,
        `<p name="q">$s.sectionNumber</p>`,
        `<p name="q">$s.title</p>`,
        `<p name="q">a</p>`,
        `<point name="q">($s.sectionNumber, 1)</point>`,
        `<conditionalContent condition="$s.sectionNumber = 1"><p>a</p></conditionalContent>`,
        `<conditionalContent condition="$s.sectionNumber = 1"><section/></conditionalContent>`,
        `<repeatForSequence to="$s.sectionNumber"><section/></repeatForSequence>`,
    ];
    const pieces: string[] = [];
    const count = 1 + Math.floor(rand.next() * 2);
    for (let i = 0; i < count; i++) {
        if (depth < 2 && rand.next() < 0.3) {
            pieces.push(writer(rand, depth + 1, repeating));
        } else {
            pieces.push(rand.pickProduction(leaves, repeating));
        }
    }
    return pieces.join("");
}

/** A composite, or a container, holding `content`. */
function writer(
    rand: ReturnType<typeof randomGenerator>,
    depth: number,
    repeating: boolean,
    name?: string,
) {
    const named = name ? ` name="${name}"` : "";
    // which composite is picked before what it holds, so that the number
    // counts in one of them only, and not in a repeat
    const make = rand.pickProduction(
        [
            `<group${named}>@INNER@</group>`,
            `<div${named}>@INNER@</div>`,
            `<p${named}>@INNER@</p>`,
            `<conditionalContent${named}><case condition="true">@INNER@</case></conditionalContent>`,
            `<conditionalContent${named} condition="$s.sectionNumber = 1">@INNER@</conditionalContent>`,
            `<conditionalContent${named} hide="$s.sectionNumber = 1"><case condition="true">@INNER@</case></conditionalContent>`,
            `<repeatForSequence${named} to="2">@INNER@</repeatForSequence>`,
            `<repeatForSequence${named} to="$s.sectionNumber">@INNER@</repeatForSequence>`,
            `<repeat${named} for="1 2" valueName="v">@INNER@</repeat>`,
            `<select${named}><option>@INNER@</option><option>@OTHER@</option></select>`,
        ],
        repeating,
    );
    const inner = () =>
        content(rand, depth, repeating || make.startsWith("<repeat"));
    return make
        .replace("@INNER@", () => inner())
        .replace("@OTHER@", () => inner());
}

/** A reference to the composite named `w`. */
function reference(rand: ReturnType<typeof randomGenerator>, w: string) {
    return rand.pick([
        `$${w}`,
        `$${w}[1]`,
        `$${w}[1].q`,
        `$${w}.q`,
        `$${w}.q.x`,
        `$${w}[1].q.x`,
        `$${w}.numIterations`,
        `$${w}.hidden`,
        `<collect from="$${w}" componentType="section"/>`,
        `<collect from="$${w}" componentType="p"/>`,
        `<p>$${w}</p>`,
    ]);
}

/** A document: `s`, one or two composites, and references to them. */
function generateDocument(rand: ReturnType<typeof randomGenerator>) {
    rand.startDocument();
    const before: string[] = [];
    const after: string[] = [];
    const inDiv: string[] = [];
    const place = (piece: string) =>
        rand.pick([before, before, after, inDiv]).push(piece);
    const numWriters = 1 + Math.floor(rand.next() * 2);
    for (let i = 1; i <= numWriters; i++) {
        const made = writer(rand, 0, false, `w${i}`);
        place(made);
        // A composite that makes sections as many times as the number runs
        // away in the run with no prediction, and a copy of it runs away
        // again: the run takes minutes. It gets no reference.
        const runsAway = made.includes('to="$s.') && made.includes("<section");
        const numReferences = runsAway ? 0 : Math.floor(rand.next() * 3);
        for (let j = 0; j < numReferences; j++) {
            place(reference(rand, `w${i}`));
        }
    }
    const div = inDiv.length > 0 ? `<div>${inDiv.join("\n")}</div>\n` : "";
    return `${before.join("\n")}
${div}<section name="s"><p name="inS">x</p></section>
${after.join("\n")}
<p name="sentinel">ok</p>`;
}

type Outcome = {
    threw?: string;
    e0005: number;
    sectionNumber?: string;
    sentinel?: string;
};

async function load(doenetML: string, variant: number): Promise<Outcome> {
    try {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            requestedVariantIndex: variant,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const { errors } = getDiagnosticsByType(core);
        return {
            e0005: errors.filter((error) => error.code === "doenet-e0005")
                .length,
            sectionNumber:
                stateVariables[await resolvePathToNodeIdx("s")].stateValues
                    .sectionNumber,
            sentinel:
                stateVariables[await resolvePathToNodeIdx("sentinel")]
                    .stateValues.text,
        };
    } catch (e: any) {
        return { threw: String(e?.message ?? e), e0005: 0 };
    }
}

/**
 * Load `doenetML` in `variant` with the section number edges and the
 * backstop each on or off.
 */
async function loadWith(
    doenetML: string,
    variant: number,
    { edges, backstop }: { edges: boolean; backstop: boolean },
) {
    const edgesWere = setSectionNumberEdges(edges);
    const backstopWas = setLoadCycleBackstop(backstop);
    try {
        return await load(doenetML, variant);
    } finally {
        setSectionNumberEdges(edgesWere);
        setLoadCycleBackstop(backstopWas);
    }
}

function hasCycle(outcome: Outcome) {
    return (
        outcome.threw !== undefined ||
        outcome.e0005 > 0 ||
        Number(outcome.sectionNumber) > RUNAWAY
    );
}

const runAll = process.env.DOENET_SECTION_DIFFERENTIAL === "all";

/** A line of `DOENET_SECTION_DIFFERENTIAL_LOG`, if set: each run, as JSON. */
function log(entry: Record<string, unknown>) {
    if (process.env.DOENET_SECTION_DIFFERENTIAL_LOG) {
        fs.appendFileSync(
            process.env.DOENET_SECTION_DIFFERENTIAL_LOG,
            JSON.stringify(entry) + "\n",
        );
    }
}
const documents: string[] = [];
{
    const rand = randomGenerator(SEED);
    const seen = new Set<string>();
    const size = runAll ? FULL_SIZE : SAMPLE_SIZE;
    // distinct documents, in the order generated, so the sample is the
    // first part of the full set
    for (let i = 0; documents.length < size && i < 20 * size; i++) {
        const doenetML = generateDocument(rand);
        if (!seen.has(doenetML)) {
            seen.add(doenetML);
            documents.push(doenetML);
        }
    }
}

describe("Cycles through a section's number, against the run time @group4", () => {
    const tally = {
        loads: 0,
        cycles: 0,
        foundAtLoad: 0,
        foundByBackstop: 0,
    };

    afterAll(() => {
        if (runAll) {
            console.info(
                `section numbering differential: ${documents.length} documents`,
                tally,
            );
        }
    });

    it.each(documents.map((doenetML, i) => [i, doenetML] as const))(
        "generated document %i",
        async (i, doenetML) => {
            // The load check is the same in every variant (#2471): a cycle in
            // the option a `<select>` doesn't pick is reported too. So the
            // oracle is every variant's: both options' (a select's options
            // are picked in turn, as variants are unique).
            const variants = doenetML.includes("<select") ? [1, 2] : [1];
            const oracles: Outcome[] = [];
            const shipped: Outcome[] = [];
            for (const variant of variants) {
                log({ start: i, variant, doenetML });
                const started = Date.now();
                oracles.push(
                    await loadWith(doenetML, variant, {
                        edges: false,
                        backstop: false,
                    }),
                );
                const oracleTime = Date.now() - started;
                shipped.push(
                    await loadWith(doenetML, variant, {
                        edges: true,
                        backstop: true,
                    }),
                );
                log({
                    i,
                    variant,
                    oracleTime,
                    shippedTime: Date.now() - started - oracleTime,
                    oracle: oracles.at(-1),
                    shipped: shipped.at(-1),
                    doenetML,
                });
            }

            for (const [v, outcome] of shipped.entries()) {
                // never stops the document
                expect(outcome.threw, doenetML).toBeUndefined();
                expect(outcome.sentinel, doenetML).eq("ok");
                expect(Number(outcome.sectionNumber), doenetML).toBeLessThan(
                    RUNAWAY,
                );
                if (hasCycle(oracles[v])) {
                    // a cycle the run time has is reported
                    expect(outcome.e0005, doenetML).toBeGreaterThan(0);
                }
            }

            if (oracles.some(hasCycle)) {
                tally.cycles++;
                const atLoad = await loadWith(doenetML, 1, {
                    edges: true,
                    backstop: false,
                });
                if (atLoad.threw === undefined) {
                    tally.foundAtLoad++;
                } else {
                    tally.foundByBackstop++;
                }
            } else {
                tally.loads++;
                for (const [v, outcome] of shipped.entries()) {
                    // no false `e0005` (D61 decision 1: a `<conditionalContent>`
                    // whose condition reads the number and whose case may make
                    // a section was one, before the edges went only to what
                    // a composite counts), and the same number
                    expect(outcome.e0005, doenetML).eq(0);
                    expect(outcome.sectionNumber, doenetML).eq(
                        oracles[v].sectionNumber,
                    );
                }
            }
        },
        60000,
    );
});
