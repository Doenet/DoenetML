// What the browser itself did on the page's main thread during a load,
// from a Chrome performance trace (Playwright's `browser.startTracing`):
// each millisecond is given to the innermost trace event covering it, and
// that event to a kind of work (`KINDS`), so the kinds add up to the time
// the thread was busy. An event of no kind takes its parent's, so a call
// into the page's code that triggers a layout is split between the two.
//
// The trace's clock is not the page's. A `cells:` measure the page also
// reports (the anchor: its name and its page start time) is in the trace
// too, so its trace timestamp gives the offset between the two.

/** Trace categories that cover every kind below. */
export const CATEGORIES = [
    "devtools.timeline",
    "disabled-by-default-devtools.timeline",
    "toplevel",
    "v8",
    "v8.execute",
    "disabled-by-default-v8.compile",
    "v8.wasm",
    "disabled-by-default-v8.gc",
    "blink",
    "blink.user_timing",
    "loading",
];

/** The kinds of main-thread work, in the order the pages list them. */
export const KINDS = [
    "html",
    "script compile",
    "script run",
    "wasm compile",
    "gc",
    "style & layout",
    "paint",
    "other",
];

/** The kind of one event, or null to take its parent's. */
function kindOf(e) {
    const { name, cat = "" } = e;
    if (cat.includes("v8.gc") || /^(MinorGC|MajorGC|V8\.GC)/.test(name))
        return "gc";
    if (cat.includes("wasm") || /^(wasm\.|v8\.wasm)/.test(name))
        return "wasm compile";
    if (
        cat.includes("v8.compile") ||
        /^(V8\.(Compile|Parse|PreParse|CollectSourcePositions|Maglev|Turbofan|Finalize)|v8\.compile)/.test(
            name,
        )
    )
        return "script compile";
    if (
        /^(FunctionCall|EvaluateScript|v8\.callFunction|v8\.evaluateModule|v8\.run|RunMicrotasks|TimerFire|FireAnimationFrame|EventDispatch|V8\.Execute)/.test(
            name,
        )
    )
        return "script run";
    if (
        /^(UpdateLayoutTree|Layout|Document::UpdateStyleAndLayout|Document::updateStyle|Document::recalcStyle|LocalFrameView::(layout|UpdateStyleAndLayout|performLayout)|ScheduleStyleRecalculation|InvalidateLayout)/.test(
            name,
        )
    )
        return "style & layout";
    if (
        /^(Paint|PrePaint|Layerize|Commit|UpdateLayer|CompositeLayers|LocalFrameView::RunPaintLifecyclePhase|RasterTask|Decode)/.test(
            name,
        )
    )
        return "paint";
    if (/^(ParseHTML|HTMLDocumentParser)/.test(name)) return "html";
    if (name === "RunTask" || name === "ThreadControllerImpl::RunTask")
        return "other";
    return null;
}

/** The renderer main thread of the page: the one carrying `cells:` measures. */
function mainThread(events) {
    const names = new Map();
    for (const e of events)
        if (e.ph === "M" && e.name === "thread_name")
            names.set(`${e.pid}:${e.tid}`, e.args?.name);
    const withMarks = new Set(
        events
            .filter((e) => e.name?.startsWith?.("cells:"))
            .map((e) => `${e.pid}:${e.tid}`),
    );
    for (const key of withMarks)
        if (names.get(key) === "CrRendererMain") return key;
    // Async user timing events may be on another thread id of the same
    // process; fall back to that process's renderer main thread.
    const pids = new Set([...withMarks].map((k) => k.split(":")[0]));
    for (const [key, name] of names)
        if (name === "CrRendererMain" && pids.has(key.split(":")[0]))
            return key;
    return null;
}

/**
 * The main thread's work from page time `from` to `to` (milliseconds):
 * the total per kind, and the lane, `[start, end, kind]` intervals in page
 * time at `binMs` resolution (`binned`), each stretch of the walk merged
 * into the one before when of one kind and under `minGap` apart. `anchor`
 * (`{ name, start }`) is a step the page measured, which aligns the
 * clocks. Null when the trace lacks the anchor's measure.
 */
export function mainThreadWork(
    trace,
    from,
    to,
    anchor,
    binMs = 1,
    minGap = 0.25,
) {
    const events = Array.isArray(trace) ? trace : trace.traceEvents;
    const mark = events.find(
        (e) =>
            e.name === `cells:${anchor.name}` &&
            (e.ph === "b" || e.ph === "R" || e.ph === "X"),
    );
    const main = mainThread(events);
    if (!mark || !main) return null;
    const origin = mark.ts - anchor.start * 1000;
    function toPage(ts) {
        return (ts - origin) / 1000;
    }
    const xs = events
        .filter(
            (e) =>
                e.ph === "X" &&
                `${e.pid}:${e.tid}` === main &&
                e.dur > 0 &&
                toPage(e.ts + e.dur) > from &&
                toPage(e.ts) < to,
        )
        .sort((a, b) => a.ts - b.ts || b.dur - a.dur);
    // Walk the nested events, giving each stretch of time to the innermost
    // open event's kind.
    const totals = Object.fromEntries(KINDS.map((k) => [k, 0]));
    const lane = [];
    const stack = [];
    let cursor = null;
    function emit(until) {
        if (cursor === null || !stack.length) return;
        const top = stack[stack.length - 1];
        const s = Math.max(toPage(cursor), from);
        const e = Math.min(toPage(until), to);
        if (e > s) {
            totals[top.kind] += e - s;
            const last = lane[lane.length - 1];
            if (last && last[2] === top.kind && s - last[1] < minGap)
                last[1] = e;
            else lane.push([s, e, top.kind]);
        }
    }
    function popUntil(ts) {
        while (stack.length && stack[stack.length - 1].end <= ts) {
            const top = stack.pop();
            emit(top.end);
            cursor = top.end;
        }
    }
    for (const e of xs) {
        popUntil(e.ts);
        emit(e.ts);
        cursor = e.ts;
        const parent = stack[stack.length - 1];
        const kind = kindOf(e) ?? parent?.kind ?? "other";
        stack.push({ end: e.ts + e.dur, kind });
    }
    popUntil(Infinity);
    const busy = Object.values(totals).reduce((a, b) => a + b, 0);
    for (const k of KINDS) totals[k] = round(totals[k]);
    return {
        totals,
        busy_ms: round(busy),
        idle_ms: round(to - from - busy),
        lane: binned(lane, from, to, binMs),
    };
}

/**
 * The lane at `binMs` resolution, small enough to keep: each bin goes to
 * the kind that had most of it (or to `idle`), and runs of one kind are
 * merged into `[start, end, kind]`.
 */
function binned(lane, from, to, binMs) {
    const n = Math.ceil((to - from) / binMs);
    const share = Array.from({ length: n }, () => new Map());
    for (const [s, e, k] of lane) {
        for (
            let i = Math.floor((s - from) / binMs);
            i < n && from + i * binMs < e;
            i++
        ) {
            const lo = Math.max(s, from + i * binMs);
            const hi = Math.min(e, from + (i + 1) * binMs);
            if (hi > lo) share[i].set(k, (share[i].get(k) ?? 0) + hi - lo);
        }
    }
    const out = [];
    for (let i = 0; i < n; i++) {
        let kind = "idle",
            most = binMs / 2;
        for (const [k, v] of share[i]) if (v > most) [kind, most] = [k, v];
        const s = round(from + i * binMs);
        const last = out[out.length - 1];
        if (last && last[2] === kind) last[1] = round(s + binMs);
        else out.push([s, round(s + binMs), kind]);
    }
    return out.filter(([, , k]) => k !== "idle");
}

function round(x) {
    return Math.round(x * 100) / 100;
}
