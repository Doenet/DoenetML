// The trace layer's documents: `homework` at several sizes. `homework-x<n>`
// is the homework page with its twelve problems and score repeated in `n`
// sections, so its steps can be read against the size of the document:
// a step whose time stays put as `n` grows is a fixed cost of the page, one
// that grows with it is work on the document. Written to
// `fixtures/generated/` (ignored by git), which `browser/serve.mjs` serves.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { packageRoot } from "./fixtures.mjs";

const fixturesDir = resolve(packageRoot, "fixtures");
const generatedDir = resolve(fixturesDir, "generated");

/** The DoenetML of `homework` repeated `n` times (`n` = 1 is the file itself). */
export function homeworkText(n) {
    const text = readFileSync(resolve(fixturesDir, "homework.doenet"), "utf8");
    if (n === 1) return text;
    // The title and the instructions once; the problems and the score in
    // each section, where their names are scoped to the section.
    const firstProblem = text.indexOf("<problem");
    const head = text.slice(0, firstProblem);
    const body = text.slice(firstProblem).trim();
    const sections = Array.from(
        { length: n },
        (_, i) =>
            `<section name="set${i + 1}"><title>Set ${i + 1}</title>\n\n${body}\n</section>`,
    );
    return head + sections.join("\n\n") + "\n";
}

/**
 * The document of size `n`: its name, the URL the cells viewer's server
 * gives it (`browser/serve.mjs`), and its text, written where that URL
 * points.
 */
export function homeworkFixture(n) {
    const text = homeworkText(n);
    if (n === 1)
        return { name: "homework", url: "/fixtures/homework.doenet", text };
    const name = `homework-x${n}`;
    mkdirSync(generatedDir, { recursive: true });
    writeFileSync(resolve(generatedDir, `${name}.doenet`), text);
    return { name, url: `/fixtures/generated/${name}.doenet`, text };
}
