// What every rendered page shares: the run's header, the cores' names,
// Markdown tables and the memory unit. Each page formats its own times,
// since each shows them at a different precision.

const CORE_NAME = { javascript: "JS", rust: "Rust", cells: "cells" };

/** A core's name on a page; a core not named here is shown as its id. */
export function coreName(c) {
    return CORE_NAME[c] ?? c;
}

export function mb(b) {
    return `${(b / 2 ** 20).toFixed(b >= 10 * 2 ** 20 ? 0 : 1)} MB`;
}

/** A cell's text, with what would break a Markdown table escaped. */
function cellText(s) {
    return String(s).replace(/\|/g, "\\|").replace(/\n/g, " ");
}

/** A Markdown table of `rows` under `head`. */
export function table(head, rows) {
    return [
        `| ${head.join(" | ")} |`,
        `|${head.map(() => "---").join("|")}|`,
        ...rows.map((r) => `| ${r.map(cellText).join(" | ")} |`),
    ].join("\n");
}

/** The lines under a page's title: the machine, the commit and the builds. */
export function header(m) {
    const h = m.hardware;
    const builds = Object.entries(m.builds)
        .map(([c, b]) => `${coreName(c)}: ${b}`)
        .join("; ");
    return [
        `Machine **${m.machine}** (${h.cpu}, ${h.cores} cores, ${mb(h.memory_bytes)}, ${h.os}, Node ${h.node}); commit \`${m.commit}\`${m.dirty ? " with uncommitted changes" : ""}; ${m.date}.`,
        "",
        `Builds: ${builds || "none recorded"}.`,
    ].join("\n");
}
