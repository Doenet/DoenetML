#!/usr/bin/env node
/**
 * `doenet-headless`: check a DoenetML document, or grade a saved state of one,
 * from the command line.
 *
 *     doenet-headless check <file> [--variant <n>] [--json]
 *     doenet-headless grade <file> --variant <n> --state <state.json> [--attempt <n>] [--json]
 *
 * Exit codes: 0 when the document has no errors; 1 when it has an error among
 * its diagnostics (the report is still printed); 2 for a usage or file
 * problem, or any other failure; 3 when `grade` refuses the saved state.
 */
import { realpathSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import type { DiagnosticRecord } from "@doenet/utils";
import { check, type CheckResult } from "./check";
import { HeadlessError } from "./errors";
import { gradeState, type GradeStateResult } from "./gradeState";

export const EXIT = {
    ok: 0,
    documentErrors: 1,
    usage: 2,
    refused: 3,
} as const;

const USAGE = `Usage:
  doenet-headless check <file> [--variant <n>] [--json]
  doenet-headless grade <file> --variant <n> --state <state.json> [--attempt <n>] [--json]

check  reports every diagnostic, the answers with their stable keys (and
       which have none), and the number of variants.
grade  loads a saved state (the viewer's reportScoreAndState payload, as
       stored) and reports the credit the document assigns to it.

Exit codes: 0 no errors; 1 the document has errors; 2 usage, file or other
failure; 3 the saved state was refused.`;

type Output = { out: (text: string) => void; err: (text: string) => void };

/**
 * Run the CLI on `argv` (without the node and script paths) and return the
 * exit code. Writes through `output`, so a test can run it in-process.
 */
export async function runCli(
    argv: string[],
    output: Output = {
        out: (text) => process.stdout.write(text + "\n"),
        err: (text) => process.stderr.write(text + "\n"),
    },
): Promise<number> {
    let parsed;
    try {
        parsed = parseArgs({
            args: argv,
            allowPositionals: true,
            options: {
                variant: { type: "string" },
                state: { type: "string" },
                attempt: { type: "string" },
                json: { type: "boolean", default: false },
                help: { type: "boolean", short: "h", default: false },
            },
        });
    } catch (e) {
        output.err(`${e instanceof Error ? e.message : String(e)}\n\n${USAGE}`);
        return EXIT.usage;
    }
    const { values, positionals } = parsed;
    if (values.help) {
        output.out(USAGE);
        return EXIT.ok;
    }
    const [command, file, ...extra] = positionals;
    if (
        (command !== "check" && command !== "grade") ||
        file === undefined ||
        extra.length > 0
    ) {
        output.err(USAGE);
        return EXIT.usage;
    }

    const variant = parsePositiveInteger(values.variant, "--variant", output);
    const attempt = parsePositiveInteger(values.attempt, "--attempt", output);
    if (variant === null || attempt === null) {
        return EXIT.usage;
    }

    const doenetML = await readText(file, output);
    if (doenetML === null) {
        return EXIT.usage;
    }

    if (command === "check") {
        const result = await check(doenetML, { variantIndex: variant });
        output.out(
            values.json
                ? JSON.stringify(result, null, 2)
                : formatCheck(file, result),
        );
        return hasErrors(result.diagnostics) ? EXIT.documentErrors : EXIT.ok;
    }

    if (variant === undefined || values.state === undefined) {
        output.err(`grade needs --variant and --state.\n\n${USAGE}`);
        return EXIT.usage;
    }
    const stateText = await readText(values.state, output);
    if (stateText === null) {
        return EXIT.usage;
    }
    let result: GradeStateResult;
    try {
        result = await gradeState(doenetML, variant, stateText, {
            attemptNumber: attempt,
        });
    } catch (e) {
        if (e instanceof HeadlessError) {
            output.err(
                values.json
                    ? JSON.stringify({ refused: e.code, message: e.message })
                    : `Refused (${e.code}): ${e.message}`,
            );
            return EXIT.refused;
        }
        throw e;
    }
    output.out(
        values.json
            ? JSON.stringify(result, null, 2)
            : formatGrade(file, result),
    );
    return hasErrors(result.diagnostics) ? EXIT.documentErrors : EXIT.ok;
}

function parsePositiveInteger(
    text: string | undefined,
    flag: string,
    output: Output,
): number | undefined | null {
    if (text === undefined) {
        return undefined;
    }
    const value = Number(text);
    if (!/^\d+$/.test(text) || value < 1) {
        output.err(`${flag} takes a whole number from 1, not "${text}".`);
        return null;
    }
    return value;
}

async function readText(file: string, output: Output): Promise<string | null> {
    try {
        return await readFile(file, "utf8");
    } catch (e) {
        output.err(
            `Cannot read ${file}: ${e instanceof Error ? e.message : String(e)}`,
        );
        return null;
    }
}

function hasErrors(diagnostics: DiagnosticRecord[]) {
    return diagnostics.some((d) => d.type === "error");
}

function plural(n: number, word: string) {
    return `${n} ${word}${n === 1 ? "" : "s"}`;
}

function at(position: { start: { line: number; column: number } } | undefined) {
    return position
        ? `line ${position.start.line}, column ${position.start.column}`
        : "position unknown";
}

function formatDiagnostics(diagnostics: DiagnosticRecord[]): string[] {
    const counts = { error: 0, warning: 0, info: 0, accessibility: 0 };
    for (const d of diagnostics) {
        counts[d.type]++;
    }
    return [
        `Diagnostics: ${plural(counts.error, "error")}, ${plural(counts.warning, "warning")}, ${plural(counts.info, "info")}, ${counts.accessibility} accessibility`,
        ...diagnostics.map(
            (d) =>
                `  ${d.type}${d.type === "accessibility" ? ` (level ${d.level})` : ""}, ${at(d.position)}: ${d.message}`,
        ),
    ];
}

function formatCheck(file: string, result: CheckResult): string {
    return [
        `${file}: variant ${result.variantIndex} of ${result.numVariants}, ${plural(result.answers.length, "answer")}, ${result.answersWithoutStableKey.length} without a stable key`,
        ...(result.answers.length > 0 ? ["Answers:"] : []),
        ...result.answers.map(
            (a) =>
                `  ${a.stableKey ?? `(no stable key, ${at(a.position)})`}: ${a.inputs.map((i) => i.componentType).join(", ") || "no inputs of its own"}`,
        ),
        ...formatDiagnostics(result.diagnostics),
    ].join("\n");
}

function formatGrade(file: string, result: GradeStateResult): string {
    return [
        `${file}: variant ${result.variantIndex} of ${result.numVariants}, state ${result.savedState.onSubmission ? "saved at a submission" : "not saved at a submission"}`,
        `Document credit: ${result.document.credit} (stored: ${result.document.stored.creditAchieved})`,
        ...(result.answers.length > 0
            ? [
                  "Answers (credit recomputed; stored values are the browser's claim):",
              ]
            : []),
        ...result.answers.map(
            (a) =>
                `  ${a.stableKey ?? `(no stable key, ${at(a.position)})`}: credit ${a.credit} (stored: ${a.stored.creditAchieved}, ${plural(a.stored.numSubmissions, "submission")})`,
        ),
        ...formatDiagnostics(result.diagnostics),
    ].join("\n");
}

// Run when this module is the program, not when a test imports it.
if (
    process.argv[1] &&
    import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href
) {
    runCli(process.argv.slice(2)).then(
        (code) => {
            process.exitCode = code;
        },
        (e) => {
            process.stderr.write(
                `${e instanceof Error ? (e.stack ?? e.message) : String(e)}\n`,
            );
            process.exitCode = EXIT.usage;
        },
    );
}
