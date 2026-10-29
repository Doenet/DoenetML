// The corpus: the real documents, one manifest each in `fixtures/*.json`,
// and the synthetic shapes of `src/generate.mjs` at every size in `SIZES`.
// See METHOD.md for both.
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
const fixturesDir = resolve(packageRoot, "fixtures");
const generatedDir = resolve(fixturesDir, "generated");

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
        structural: null,
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

export function loadFixture(name) {
    if (name === "floor") {
        const { steps, check } = generate("floor");
        return {
            name,
            tier: "floor",
            source: { generate: "floor" },
            steps,
            check,
            structural: null,
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
    if (source.generate) return generated(source.generate);
    throw new Error(
        `${manifest.name}: source must name a file, a path or a generate spec`,
    );
}

/** Generated text is cached in `fixtures/generated/` (ignored by git). */
function generated(spec) {
    mkdirSync(generatedDir, { recursive: true });
    const out = resolve(generatedDir, `${spec}.doenet`);
    const text = generate(spec).text;
    if (!existsSync(out) || readFileSync(out, "utf8") !== text)
        writeFileSync(out, text);
    return text;
}
