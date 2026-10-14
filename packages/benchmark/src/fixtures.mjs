// The corpus: one manifest per fixture in `fixtures/*.json`, and the
// DoenetML text each one names. See README.md for the manifest format.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
export const packageRoot = resolve(here, "..");
export const repoRoot = resolve(packageRoot, "../..");
const fixturesDir = resolve(packageRoot, "fixtures");
const generatedDir = resolve(fixturesDir, "generated");
const cellsCore = resolve(repoRoot, "packages/cells-core");

/** Every manifest, sorted by shape then numeric size so chain-100 precedes chain-1000. */
export function listFixtures() {
    return readdirSync(fixturesDir)
        .filter((f) => f.endsWith(".json"))
        .map((f) => {
            const manifest = JSON.parse(readFileSync(resolve(fixturesDir, f), "utf8"));
            const name = f.slice(0, -".json".length);
            if (manifest.name !== name) {
                throw new Error(`${f}: manifest name "${manifest.name}" does not match the file name`);
            }
            return manifest;
        })
        .sort((a, b) => cmpSpec(a.name, b.name));
}

export function loadFixture(name) {
    const path = resolve(fixturesDir, `${name}.json`);
    if (!existsSync(path)) throw new Error(`no fixture named ${name}`);
    return JSON.parse(readFileSync(path, "utf8"));
}

/** The DoenetML text of a fixture, generating it first if the manifest says so. */
export function fixtureText(manifest) {
    const { source } = manifest;
    if (source.file) return readFileSync(resolve(fixturesDir, source.file), "utf8");
    if (source.path) return readFileSync(resolve(repoRoot, source.path), "utf8");
    if (source.generate) return forEveryCore(generated(source.generate));
    throw new Error(`${manifest.name}: source must name a file, a path or a generate spec`);
}

/**
 * cells-docgen writes `<numberInput name="n" value="1"/>`, a tag the JS core
 * does not have. Every core has `<mathInput>`, so the generated text is
 * rewritten to it; `value` becomes `prefill`, which is what a mathInput calls
 * its initial content.
 */
export function forEveryCore(text) {
    return (
        text
            // `<mathInput name="mi"/><answer response="$mi">E</answer>`: the JS
            // core has no `response` attribute; the input goes inside the answer.
            .replace(
                /<mathInput name="(\w+)"\s*\/><answer name="(\w+)" response="\$\1">([^<]*)<\/answer>/g,
                '<answer name="$2"><mathInput name="$1"/><award>$3</award></answer>',
            )
            // `maxNumber` is the cells core's guard on a repeat's length; the JS
            // core has no such attribute.
            .replace(/ maxNumber="\d+"/g, "")
            .replace(/<numberInput\b([^>]*)\bvalue="([^"]*)"([^>]*)\/>/g, '<mathInput$1prefill="$2"$3/>')
            .replace(/<numberInput\b/g, "<mathInput")
    );
}

let docgen;
function generated(spec) {
    mkdirSync(generatedDir, { recursive: true });
    const out = resolve(generatedDir, `${spec}.doenet`);
    if (existsSync(out)) return readFileSync(out, "utf8");
    if (!docgen) {
        execFileSync("cargo", ["build", "-q", "--release", "-p", "cells-docgen"], {
            cwd: cellsCore,
            stdio: "inherit",
        });
        docgen = resolve(cellsCore, "target/release/cells-docgen");
    }
    const text = execFileSync(docgen, [spec], { encoding: "utf8", maxBuffer: 1 << 28 });
    writeFileSync(out, text);
    return text;
}

function cmpSpec(a, b) {
    const ka = specKey(a), kb = specKey(b);
    return ka[0] < kb[0] ? -1 : ka[0] > kb[0] ? 1 : ka[1] - kb[1];
}
function specKey(name) {
    const m = /^(.*?)-(\d+)$/.exec(name);
    return m ? [m[1], Number(m[2])] : [name, 0];
}
