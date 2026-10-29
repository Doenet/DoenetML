// The corpus: the real documents, one manifest each in `fixtures/*.json`,
// the synthetic shapes of `src/generate.mjs` at every size in `SIZES`, and
// the trace layer's `homework-x<n>`. See METHOD.md for all three, and
// README.md for the manifest's fields.
import {
    existsSync,
    mkdirSync,
    readFileSync,
    readdirSync,
    writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { SIZES, generate, shapes } from "./generate.mjs";
export { SIZES, shapes };

const here = dirname(fileURLToPath(import.meta.url));
export const packageRoot = resolve(here, "..");
export const repoRoot = resolve(packageRoot, "../..");
/** The real documents and their manifests, which `browser/serve.mjs`
 * serves under `/fixtures/`. */
export const fixturesDir = resolve(packageRoot, "fixtures");
/** Generated text, ignored by git, served under `/fixtures/generated/`. */
export const generatedDir = resolve(fixturesDir, "generated");

/** The manifest of synthetic fixture `shape-n`. */
function synthetic(shape, n) {
    const name = `${shape}-${n}`;
    const { steps, start, watch, check } = generate(name);
    return {
        name,
        tier: "synthetic",
        shape,
        size: n,
        mechanism: shapes[shape].mechanism,
        source: { generate: name },
        steps,
        start,
        // A point the drag moves besides the dragged one, which the browser
        // layer also times on screen (`follow`).
        ...(watch ? { watch } : {}),
        check,
    };
}

/** Every manifest: the shapes by size, then the real documents by name. */
export function listFixtures() {
    const out = [];
    for (const shape of Object.keys(shapes))
        for (const n of SIZES) out.push(synthetic(shape, n));
    const real = readdirSync(fixturesDir)
        .filter((f) => f.endsWith(".json"))
        .sort()
        .map((f) => {
            const manifest = JSON.parse(
                readFileSync(resolve(fixturesDir, f), "utf8"),
            );
            const name = f.slice(0, -".json".length);
            if (manifest.name !== name) {
                throw new Error(
                    `${f}: manifest name "${manifest.name}" does not match the file name`,
                );
            }
            return manifest;
        });
    return [...out, ...real];
}

/** The manifest named `name`: the floor, a synthetic fixture or a real document. */
export function loadFixture(name) {
    if (name === "floor") {
        const { steps, check } = generate("floor");
        return {
            name,
            tier: "floor",
            source: { generate: "floor" },
            steps,
            check,
        };
    }
    const m = /^([a-z]+)-(\d+)$/.exec(name);
    if (m && m[1] in shapes) return synthetic(m[1], Number(m[2]));
    const path = resolve(fixturesDir, `${name}.json`);
    if (!existsSync(path)) throw new Error(`no fixture named ${name}`);
    return JSON.parse(readFileSync(path, "utf8"));
}

/** The DoenetML text of a fixture, generating it first if the manifest says so. */
export function fixtureText(manifest) {
    const { source } = manifest;
    if (source.file)
        return readFileSync(resolve(fixturesDir, source.file), "utf8");
    if (source.path)
        return readFileSync(resolve(repoRoot, source.path), "utf8");
    if (source.generate)
        return generated(source.generate, generate(source.generate).text);
    throw new Error(
        `${manifest.name}: source must name a file, a path or a generate spec`,
    );
}

/** Keep `text` as `fixtures/generated/<name>.doenet`, written when it
 * differs from what is there, so a server can serve it; returns `text`. */
function generated(name, text) {
    mkdirSync(generatedDir, { recursive: true });
    const out = resolve(generatedDir, `${name}.doenet`);
    if (!existsSync(out) || readFileSync(out, "utf8") !== text)
        writeFileSync(out, text);
    return text;
}

/**
 * The trace layer's document of size `n`: `homework` itself for `n` = 1,
 * else `homework-x<n>`, the homework page with its problems and score
 * repeated in `n` sections, so a load's steps can be read against the size
 * of the document (a step whose time stays put as `n` grows is a fixed
 * cost of the page; one that grows with it is work on the document). Gives
 * its name, its text, and the URL `browser/serve.mjs` serves it at.
 */
export function homeworkFixture(n) {
    const text = readFileSync(resolve(fixturesDir, "homework.doenet"), "utf8");
    if (n === 1)
        return { name: "homework", url: "/fixtures/homework.doenet", text };
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
    const name = `homework-x${n}`;
    return {
        name,
        url: `/fixtures/generated/${name}.doenet`,
        text: generated(name, head + sections.join("\n\n") + "\n"),
    };
}
