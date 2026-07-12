/**
 * Windowed-mounting scenario page (#1441 stream B): N REAL
 * `@doenet/doenetml-iframe` `<DoenetViewer>`s with
 * `mountPolicy={{mode:"windowed", maxLiveViewers:K}}`, viewport pinned at
 * the top of the page. Off-screen viewers beyond the budget park (state
 * flushed, iframe replaced by a placeholder), so the page should settle at
 * ~K live realms regardless of N — the headline is that a parked instance
 * costs ~0 MB.
 *
 * Unlike the other scenario pages (hand-rolled iframes that mimic the
 * wrapper), this one must bundle the actual React component, because the
 * parking logic lives in the wrapper itself; measure.mjs builds this file
 * with esbuild at startup and serves it as /windowed.js.
 *
 * Query params: ?n=<total viewers> &keep=<maxLiveViewers>
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { DoenetViewer, getViewerLifecycleStats } from "@doenet/doenetml-iframe";

const params = new URLSearchParams(location.search);
const n = parseInt(params.get("n") ?? "8", 10);
const keep = parseInt(params.get("keep") ?? "3", 10);

window.__done = false;
window.__initializedCount = 0;
window.__lifecycleStats = () => getViewerLifecycleStats();

const MOUNT_POLICY = {
    mode: "windowed",
    maxLiveViewers: keep,
    parkDelayMs: 500,
    // Small margin so the number of live (near-viewport) viewers is
    // deterministic (~2 at the default placeholder height) and independent
    // of N.
    visibleMargin: "200px",
    flushTimeoutMs: 60_000,
};

const doenetML = await fetch("/doenetml-source?doc=default").then((res) =>
    res.text(),
);

const standaloneUrl = `${location.origin}/standalone/doenet-standalone.js`;
const cssUrl = `${location.origin}/standalone/style.css`;

function App() {
    const viewers = [];
    for (let i = 0; i < n; i++) {
        viewers.push(
            <div key={i} style={{ margin: "20px 0" }}>
                <DoenetViewer
                    doenetML={doenetML}
                    activityId={`bench-activity-${i}`}
                    docId={`bench-doc-${i}`}
                    flags={{ allowSaveState: true }}
                    mountPolicy={MOUNT_POLICY}
                    standaloneUrl={standaloneUrl}
                    cssUrl={cssUrl}
                    addVirtualKeyboard={false}
                    initializedCallback={() => {
                        window.__initializedCount++;
                    }}
                />
            </div>,
        );
    }
    return <div>{viewers}</div>;
}

createRoot(document.getElementById("root")).render(<App />);

// Done once the page settles: nothing mid-park or mid-boot, every viewer
// accounted for as live or parked, and every live viewer fully booted.
// (Off-screen viewers start parked and never boot; only the ~2 viewers
// within the margin boot, staggered by the boot-slot cap.)
const settleTimer = setInterval(() => {
    const stats = getViewerLifecycleStats();
    window.__parkedCount = stats.parked;
    if (
        stats.parking === 0 &&
        stats.booting === 0 &&
        stats.bootQueue === 0 &&
        stats.live + stats.parked === n &&
        stats.live >= 1 &&
        window.__initializedCount >= stats.live
    ) {
        clearInterval(settleTimer);
        window.__done = true;
    }
}, 500);
