/*
 * Builds the Rust core parity report: how much of the JavaScript core's
 * surface the Rust core implements, and how the JavaScript worker's test suite
 * fares when run on the Rust core.
 *
 * Inputs:
 * - The JavaScript core's surface: `@doenet/static-assets`' generated schema
 *   (`doenet-schema.json`), which lists every component with its attributes and
 *   public properties.
 * - The Rust core's surface: `cargo run --example component_inventory`.
 * - Test results: a Vitest JSON report of the worker suite run with
 *   `DOENET_TEST_CORE=rust` (see `test-core-rust.ts`). Optional; without it the
 *   report has no test section.
 * - Usage: the DoenetML in the worker's test files, to rank components and
 *   attributes by how often tests use them.
 *
 * Outputs, in `out/`: `parity-report.json` and `parity-dashboard.html` (the
 * template in this package with the report embedded).
 *
 * Run through `npm run parity -w @doenet/rust-parity`, which runs the tests
 * first when their inputs have changed; `npm run parity:report` regenerates
 * from the last results.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { ELEMENT_EXPANSIONS } from "../parser/src/dast-normalize/element-expansions";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PACKAGES_DIR = path.resolve(HERE, "..");
const RUST_DIR = path.join(PACKAGES_DIR, "doenetml-worker-rust");
const OUT_DIR = path.join(HERE, "out");
const SCHEMA_PATH = path.join(
    PACKAGES_DIR,
    "static-assets/src/generated/doenet-schema.json",
);
const TEST_DIR = path.join(PACKAGES_DIR, "doenetml-worker-javascript/src/test");
const RESULTS_PATH = path.join(OUT_DIR, "test-results.json");

/**
 * Attributes that the Rust core handles for every component while building the
 * document, rather than through a component's own attribute list: `name` in
 * the resolver, `extend` and `copy` in reference expansion.
 */
const STRUCTURAL_ATTRIBUTES = new Set(["name", "extend", "copy"]);

// ---------------------------------------------------------------------------
// Inputs

type SchemaElement = {
    name: string;
    attributes: { name: string; description?: string }[];
    properties: { name: string; type?: string; description?: string }[];
    top?: boolean;
    docsSlug?: string;
    summary?: string;
};

type RustComponent = {
    name: string;
    internal: boolean;
    attributes: string[];
    props: { name: string; public: boolean; valueType: string }[];
    actions: string[];
};

type VitestReport = {
    startTime: number;
    testResults: {
        name: string;
        startTime: number;
        endTime: number;
        assertionResults: {
            title: string;
            ancestorTitles: string[];
            status: "passed" | "failed" | "skipped" | "pending" | "todo";
            failureMessages: string[];
        }[];
    }[];
};

function readSchema(): SchemaElement[] {
    return JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf8")).elements;
}

function readRustInventory(): RustComponent[] {
    const stdout = execFileSync(
        "cargo",
        [
            "run",
            "-q",
            "-p",
            "doenetml-core",
            "--example",
            "component_inventory",
        ],
        {
            cwd: RUST_DIR,
            encoding: "utf8",
            // Compiler warnings would drown the summary; execFileSync still
            // includes stderr in the error it throws if cargo fails.
            stdio: ["ignore", "pipe", "pipe"],
        },
    );
    return (JSON.parse(stdout) as RustComponent[]).filter((c) => !c.internal);
}

function readTestResults(): VitestReport | null {
    if (!fs.existsSync(RESULTS_PATH)) {
        console.warn(
            `No test results at ${path.relative(process.cwd(), RESULTS_PATH)}; the report will have no test section. Run \`npm run parity\` to produce them.`,
        );
        return null;
    }
    return JSON.parse(fs.readFileSync(RESULTS_PATH, "utf8"));
}

function listTestFiles(dir: string): string[] {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return listTestFiles(full);
        return entry.name.endsWith(".test.ts") ? [full] : [];
    });
}

/**
 * Count how often the DoenetML in the test files uses each tag, and each
 * attribute on each tag. The DoenetML is taken from template literals, so this
 * is approximate: it is only used to rank what to port first.
 */
function scanTestUsage(knownTags: Set<string>) {
    const tags = new Map<string, number>();
    const attributes = new Map<string, number>(); // "tag attribute" (lowercase attribute)
    for (const file of listTestFiles(TEST_DIR)) {
        const source = fs.readFileSync(file, "utf8");
        for (const [, literal] of source.matchAll(/`([^`]*<[^`]*)`/g)) {
            for (const [, tag, attrs] of literal.matchAll(
                /<([a-zA-Z][\w]*)((?:\s+[\w:-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'))?)*)\s*\/?>/g,
            )) {
                if (!knownTags.has(tag)) continue;
                tags.set(tag, (tags.get(tag) ?? 0) + 1);
                for (const [, attr] of attrs.matchAll(
                    /\s([\w:-]+)(?=\s*=|\s|$)/g,
                )) {
                    const key = `${tag} ${attr.toLowerCase()}`;
                    attributes.set(key, (attributes.get(key) ?? 0) + 1);
                }
            }
        }
    }
    return { tags, attributes };
}

// ---------------------------------------------------------------------------
// Test results

type FailureKind =
    | "missing-state-variable"
    | "missing-component-field"
    | "missing-action"
    | "missing-core-api"
    | "component-not-found"
    | "unsupported-option"
    | "enumerates-everything"
    | "stale-snapshot"
    | "wrong-value"
    | "timeout"
    | "error";

const FAILURE_KIND_LABELS: Record<FailureKind, string> = {
    "missing-state-variable": "State variable missing in Rust",
    "missing-component-field": "Reads children or replacements",
    "missing-action": "Action missing in Rust",
    "missing-core-api": "Uses core API or internals Rust lacks",
    "component-not-found": "Component not found by name",
    "unsupported-option": "Uses a test option Rust lacks",
    "enumerates-everything": "Enumerates every component",
    "stale-snapshot": "Stale snapshot read (test pattern)",
    "wrong-value": "Wrong value",
    timeout: "Timed out",
    error: "Other error",
};

function classifyFailure(message: string): {
    kind: FailureKind;
    component?: string;
    detail?: string;
} {
    const firstLine = message.split("\n")[0];
    let m = firstLine.match(/state variable `([^.`]*)\.([^`]+)`/);
    if (m)
        return {
            kind: "missing-state-variable",
            component: m[1],
            detail: m[2],
        };
    m = firstLine.match(/\[Rust core gap\] `(\w+)` of `([^`]*)`/);
    if (m)
        return {
            kind: "missing-component-field",
            component: m[2],
            detail: m[1],
        };
    m = firstLine.match(/action `([^.`]*)\.([^`]+)`/);
    if (m) return { kind: "missing-action", component: m[1], detail: m[2] };
    m = firstLine.match(/action `([^`]+)` on an unresolved component/);
    if (m)
        return {
            kind: "missing-action",
            detail: `${m[1]} (unresolved component)`,
        };
    m = firstLine.match(
        /JavaScript core internals `([^`]+)`|core API `([^`]+)`/,
    );
    if (m) return { kind: "missing-core-api", detail: m[1] ?? m[2] };
    // `stateVariables[idx]` was undefined: the name did not resolve to a
    // component in the Rust document (or resolved to one it never created).
    // The fields are those of a `returnAllStateVariables()` entry.
    if (
        /of undefined \(reading '(stateValues|componentType|componentIdx|activeChildren|replacements|replacementsToWithhold|replacementOf|sharedParameters)'\)/.test(
            firstLine,
        )
    ) {
        return { kind: "component-not-found" };
    }
    m = firstLine.match(
        /createTestCore option `(\w+)`|\[Rust core gap\] (variants|`initializeCounters`)/,
    );
    if (m)
        return {
            kind: "unsupported-option",
            detail: (m[1] ?? m[2]).replace(/`/g, ""),
        };
    if (/\[Rust core gap\] enumerating/.test(firstLine)) {
        return { kind: "enumerates-everything" };
    }
    if (firstLine.includes("[stale snapshot read]"))
        return { kind: "stale-snapshot" };
    // Includes a test that expected an error the Rust core didn't raise.
    if (/^AssertionError|instead of rejecting/.test(firstLine)) {
        return { kind: "wrong-value" };
    }
    if (/timed out/i.test(firstLine)) return { kind: "timeout" };
    return { kind: "error", detail: firstLine.slice(0, 160) };
}

function summarizeTests(report: VitestReport) {
    const files: {
        file: string;
        group: string;
        passed: number;
        failed: number;
        skipped: number;
        passing: string[];
    }[] = [];
    const kinds = new Map<FailureKind, number>();
    const stateVariableGaps = new Map<string, number>(); // "component.variable"
    const componentFieldGaps = new Map<string, number>();
    const actionGaps = new Map<string, number>();
    const optionGaps = new Map<string, number>();
    const coreApiGaps = new Map<string, number>();
    const otherErrors = new Map<string, number>();
    const gapsByComponent = new Map<string, number>();

    for (const file of report.testResults) {
        const rel = path.relative(TEST_DIR, file.name);
        const entry = {
            file: rel,
            group: rel.includes(path.sep)
                ? rel.split(path.sep)[0]
                : "(top level)",
            passed: 0,
            failed: 0,
            skipped: 0,
            passing: [] as string[],
        };
        for (const test of file.assertionResults) {
            if (test.status === "passed") {
                entry.passed++;
                entry.passing.push(
                    [...test.ancestorTitles.slice(1), test.title].join(" › "),
                );
            } else if (test.status === "failed") {
                entry.failed++;
                const failure = classifyFailure(test.failureMessages[0] ?? "");
                bump(kinds, failure.kind);
                const key = failure.component
                    ? `${failure.component}.${failure.detail}`
                    : (failure.detail ?? "");
                if (failure.kind === "missing-state-variable")
                    bump(stateVariableGaps, key);
                if (failure.kind === "missing-component-field")
                    bump(componentFieldGaps, key);
                if (failure.kind === "missing-action") bump(actionGaps, key);
                if (failure.kind === "unsupported-option")
                    bump(optionGaps, key);
                if (failure.kind === "missing-core-api") bump(coreApiGaps, key);
                if (failure.kind === "error") bump(otherErrors, key);
                if (failure.component) bump(gapsByComponent, failure.component);
            } else {
                entry.skipped++;
            }
        }
        // A file that fails to load reports no tests; count it as one failure.
        if (file.assertionResults.length === 0) {
            entry.failed = 1;
            bump(kinds, "error");
            bump(otherErrors, "Test file failed to load");
        }
        files.push(entry);
    }
    files.sort((a, b) => a.file.localeCompare(b.file));

    const totals = files.reduce(
        (t, f) => ({
            passed: t.passed + f.passed,
            failed: t.failed + f.failed,
            skipped: t.skipped + f.skipped,
        }),
        { passed: 0, failed: 0, skipped: 0 },
    );

    return {
        ranAt: new Date(report.startTime).toISOString(),
        totals,
        failureKinds: [...kinds]
            .map(([kind, count]) => ({
                kind,
                label: FAILURE_KIND_LABELS[kind],
                count,
            }))
            .sort((a, b) => b.count - a.count),
        stateVariableGaps: ranked(stateVariableGaps),
        componentFieldGaps: ranked(componentFieldGaps),
        actionGaps: ranked(actionGaps),
        optionGaps: ranked(optionGaps),
        coreApiGaps: ranked(coreApiGaps),
        otherErrors: ranked(otherErrors),
        gapsByComponent: Object.fromEntries(gapsByComponent),
        files,
    };
}

function bump<K>(map: Map<K, number>, key: K) {
    map.set(key, (map.get(key) ?? 0) + 1);
}

function ranked(map: Map<string, number>) {
    return [...map]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

// ---------------------------------------------------------------------------
// Report

function camelCase(snake: string) {
    return snake.replace(/_(\w)/g, (_, c: string) => c.toUpperCase());
}

function buildReport() {
    const schema = readSchema();
    const rust = readRustInventory();
    const rustByName = new Map(rust.map((c) => [c.name.toLowerCase(), c]));
    const usage = scanTestUsage(new Set(schema.map((e) => e.name)));
    const results = readTestResults();
    const tests = results ? summarizeTests(results) : null;

    const components = schema.map((element) => {
        const expansion = ELEMENT_EXPANSIONS[element.name];
        const rustComponent = rustByName.get(
            (expansion?.to ?? element.name).toLowerCase(),
        );
        const rustAttributes = new Set(
            (rustComponent?.attributes ?? []).map((a) => a.toLowerCase()),
        );
        const rustProps = new Map(
            (rustComponent?.props ?? []).map((p) => [p.name.toLowerCase(), p]),
        );

        const attributes = element.attributes.map((attr) => {
            const lower = attr.name.toLowerCase();
            const supported =
                rustComponent !== undefined &&
                (rustAttributes.has(lower) || STRUCTURAL_ATTRIBUTES.has(lower));
            return {
                name: attr.name,
                supported,
                testUses: usage.attributes.get(`${element.name} ${lower}`) ?? 0,
            };
        });

        const properties = element.properties.map((prop) => {
            const rustProp = rustProps.get(prop.name.toLowerCase());
            return {
                name: prop.name,
                // `public` means DoenetML can reference it (`$c.prop`); a
                // private prop with the same name still answers tests.
                status: !rustProp
                    ? "missing"
                    : rustProp.public
                      ? "public"
                      : "private",
            };
        });

        const jsAttributeNames = new Set(
            element.attributes.map((a) => a.name.toLowerCase()),
        );
        const jsPropertyNames = new Set(
            element.properties.map((p) => p.name.toLowerCase()),
        );

        const supportedAttributes = attributes.filter(
            (a) => a.supported,
        ).length;
        const supportedProperties = properties.filter(
            (p) => p.status !== "missing",
        ).length;
        const total = attributes.length + properties.length;
        const coverage =
            total === 0
                ? 1
                : (supportedAttributes + supportedProperties) / total;

        return {
            name: element.name,
            summary: element.summary ?? "",
            docsSlug: element.docsSlug ?? null,
            topLevel: element.top ?? false,
            rustComponent: rustComponent?.name ?? null,
            viaExpansion: expansion
                ? `<${expansion.to} ${Object.entries(expansion.attributes ?? {})
                      .map(([k, v]) => `${k}="${v}"`)
                      .join(" ")}>`
                : null,
            status: !rustComponent
                ? "missing"
                : supportedAttributes === attributes.length &&
                    supportedProperties === properties.length
                  ? "complete"
                  : "partial",
            coverage,
            testUses: usage.tags.get(element.name) ?? 0,
            testFailuresNamingIt: tests?.gapsByComponent[element.name] ?? 0,
            attributes,
            properties,
            actions: rustComponent?.actions.map(camelCase) ?? [],
            // Names Rust defines that the JavaScript core does not, often the
            // same thing under another name (such as `hidden` for `hide`).
            rustOnlyAttributes: (rustComponent?.attributes ?? []).filter(
                (a) => !jsAttributeNames.has(a.toLowerCase()),
            ),
            rustOnlyProps: (rustComponent?.props ?? [])
                .filter((p) => !jsPropertyNames.has(p.name.toLowerCase()))
                .map((p) => ({ name: p.name, public: p.public })),
        };
    });

    const jsNames = new Set(
        schema.flatMap((e) =>
            [e.name, ELEMENT_EXPANSIONS[e.name]?.to].filter(Boolean),
        ),
    );
    const rustOnlyComponents = rust
        .filter((c) => !jsNames.has(c.name))
        .map((c) => ({
            name: c.name,
            attributes: c.attributes,
            props: c.props.map((p) => p.name),
        }));

    const present = components.filter((c) => c.status !== "missing");
    const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
    const totalTagUses = sum(components.map((c) => c.testUses));

    return {
        generatedAt: new Date().toISOString(),
        summary: {
            components: {
                total: components.length,
                complete: components.filter((c) => c.status === "complete")
                    .length,
                partial: components.filter((c) => c.status === "partial")
                    .length,
                missing: components.filter((c) => c.status === "missing")
                    .length,
            },
            attributes: {
                total: sum(components.map((c) => c.attributes.length)),
                supported: sum(
                    components.map(
                        (c) => c.attributes.filter((a) => a.supported).length,
                    ),
                ),
                // Only counting components Rust has: how far along the ported ones are.
                totalOnPresent: sum(present.map((c) => c.attributes.length)),
                supportedOnPresent: sum(
                    present.map(
                        (c) => c.attributes.filter((a) => a.supported).length,
                    ),
                ),
            },
            properties: {
                total: sum(components.map((c) => c.properties.length)),
                supported: sum(
                    components.map(
                        (c) =>
                            c.properties.filter((p) => p.status !== "missing")
                                .length,
                    ),
                ),
                public: sum(
                    components.map(
                        (c) =>
                            c.properties.filter((p) => p.status === "public")
                                .length,
                    ),
                ),
                totalOnPresent: sum(present.map((c) => c.properties.length)),
                supportedOnPresent: sum(
                    present.map(
                        (c) =>
                            c.properties.filter((p) => p.status !== "missing")
                                .length,
                    ),
                ),
            },
            // Share of tag occurrences in the tests' DoenetML whose component
            // exists in Rust.
            testTagUsesCovered:
                totalTagUses === 0
                    ? 0
                    : sum(present.map((c) => c.testUses)) / totalTagUses,
        },
        components,
        rustOnlyComponents,
        tests,
    };
}

const report = buildReport();
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(
    path.join(OUT_DIR, "parity-report.json"),
    JSON.stringify(report, null, 2),
);
const template = fs.readFileSync(path.join(HERE, "dashboard.html"), "utf8");
const marker = "/*__PARITY_REPORT__*/null";
if (!template.includes(marker)) {
    throw Error(`dashboard.html is missing the data marker ${marker}`);
}
fs.writeFileSync(
    path.join(OUT_DIR, "parity-dashboard.html"),
    // `</` would end the <script> element early.
    template.replace(marker, () =>
        JSON.stringify(report).replace(/<\//g, "<\\/"),
    ),
);

const { summary } = report;
console.log(
    `Components: ${summary.components.complete} complete, ${summary.components.partial} partial, ${summary.components.missing} missing of ${summary.components.total}`,
);
if (report.tests) {
    const t = report.tests.totals;
    console.log(
        `Tests on the Rust core: ${t.passed} passed, ${t.failed} failed, ${t.skipped} skipped`,
    );
}
console.log(
    `Wrote ${path.relative(process.cwd(), path.join(OUT_DIR, "parity-dashboard.html"))}`,
);
