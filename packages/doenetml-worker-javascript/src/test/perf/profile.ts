/**
 * CPU profiling of an async operation under node, for the performance work
 * (Doenet/DoenetML#2126).
 *
 * Reports *self* time by file and by function. Inclusive time is not
 * reported: the core's work crosses many `await`s, and the sampled stacks
 * do not connect across them, so inclusive figures come out small and
 * misleading. Self time is what to read.
 */
import { Session } from "node:inspector/promises";

export type ProfileSummary = {
    /** Total sampled time in milliseconds. */
    sampledMs: number;
    /** `[file, selfMs]`, largest first. */
    selfByFile: [string, number][];
    /** `[function file:line, selfMs]`, largest first. */
    selfByFunction: [string, number][];
};

function shortUrl(url: string) {
    if (!url) {
        return "(native)";
    }
    return url.replace(/.*\/packages\//, "").replace(/^file:\/\//, "");
}

/** Run `fn` under the V8 sampling profiler and summarize self time. */
export async function profileAsync<T>(
    fn: () => Promise<T>,
    { samplingIntervalUs = 200 }: { samplingIntervalUs?: number } = {},
): Promise<{ result: T; profile: ProfileSummary }> {
    const session = new Session();
    session.connect();
    try {
        await session.post("Profiler.enable");
        await session.post("Profiler.setSamplingInterval", {
            interval: samplingIntervalUs,
        });
        await session.post("Profiler.start");
        const result = await fn();
        const { profile } = await session.post("Profiler.stop");
        await session.post("Profiler.disable");

        // Both are optional in the protocol types; an empty profile has neither.
        const samples = profile.samples ?? [];
        const timeDeltas = profile.timeDeltas ?? [];
        const selfByNode = new Map<number, number>();
        for (let i = 0; i < samples.length; i++) {
            const id = samples[i];
            selfByNode.set(
                id,
                (selfByNode.get(id) ?? 0) + (timeDeltas[i] ?? 0),
            );
        }
        const nodeById = new Map<number, any>();
        for (const node of profile.nodes) {
            nodeById.set(node.id, node);
        }

        const byFile = new Map<string, number>();
        const byFunction = new Map<string, number>();
        let total = 0;
        for (const [id, us] of selfByNode) {
            const node = nodeById.get(id);
            if (!node) {
                continue;
            }
            total += us;
            const file = shortUrl(node.callFrame.url);
            const fn =
                `${node.callFrame.functionName || "(anonymous)"} ` +
                `${file}:${node.callFrame.lineNumber + 1}`;
            byFile.set(file, (byFile.get(file) ?? 0) + us);
            byFunction.set(fn, (byFunction.get(fn) ?? 0) + us);
        }
        const sorted = (m: Map<string, number>): [string, number][] =>
            [...m.entries()]
                .sort((a, b) => b[1] - a[1])
                .map(([k, us]) => [k, us / 1000]);

        return {
            result,
            profile: {
                sampledMs: total / 1000,
                selfByFile: sorted(byFile),
                selfByFunction: sorted(byFunction),
            },
        };
    } finally {
        session.disconnect();
    }
}

/** The two self-time tables as text, largest first. */
export function formatProfile(
    profile: ProfileSummary,
    { files = 25, functions = 60 }: { files?: number; functions?: number } = {},
): string {
    const line = ([name, ms]: [string, number]) =>
        `  ${ms.toFixed(0).padStart(6)} ms ${((100 * ms) / profile.sampledMs)
            .toFixed(1)
            .padStart(5)}%  ${name}`;
    return [
        `sampled ${profile.sampledMs.toFixed(0)} ms`,
        "",
        `self time by file (top ${files})`,
        ...profile.selfByFile.slice(0, files).map(line),
        "",
        `self time by function (top ${functions})`,
        ...profile.selfByFunction.slice(0, functions).map(line),
    ].join("\n");
}
