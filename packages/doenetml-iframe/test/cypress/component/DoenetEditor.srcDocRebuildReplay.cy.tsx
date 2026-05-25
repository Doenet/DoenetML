import React, { useState } from "react";
import { DoenetEditor } from "../../../src/index";
import {
    STANDALONE_BLOB_URL,
    STANDALONE_CSS_BLOB_URL,
    IFRAME_READY_TIMEOUT,
    RELOAD_MARKER_KEY,
} from "./helpers";

// In normal use, srcDoc only rebuilds via the autodetect-version fallback
// path — hard to simulate cleanly in a component test. Here we trigger a
// rebuild by handing the wrapper a *different* cssUrl reference (with the
// same content), which invalidates the srcDoc useMemo (deps include
// `cssUrl`) and forces a real iframe reload. Whatever the rebuild trigger,
// the wrapper must:
//  1. Re-anchor `lastSentPropsSnapshotRef` to the mount-time baseline (in
//     useLayoutEffect on srcDoc), and
//  2. Re-fire the live-update effect on `srcDoc` change so any prop drift
//     since mount is replayed against the freshly-booted iframe.
// This spec verifies that drift (here: readOnly toggled true between mount
// and rebuild) survives the rebuild.
//
// Why cssUrl and not standaloneUrl: this spec is the only one that boots
// the iframe twice in a single test. Driving the rebuild off `standaloneUrl`
// — as an earlier revision did — meant the *second* boot loaded the ~32 MB
// JS bundle from a fresh Blob URL, defeating the in-memory script cache and
// forcing a full re-parse/execute. Slow CI runners blew past 60 s on that
// second boot ~1 in 13 runs. Routing the rebuild through `cssUrl` keeps the
// JS bundle URL stable across both boots (Chrome reuses the parsed script
// from the first boot), and the CSS round-trip we *do* do is on a far
// smaller file. The wrapper sees the same "srcDoc changed" signal either
// way, so the contract under test is unchanged.
//
// FLAKE INVESTIGATION & FIX
// ─────────────────────────────
// PR #1151's de-flake (60 s budget + retries + cssUrl-stable trick) cut
// but didn't eliminate the flake. The first diagnostic revision of this
// spec added an iframe-state polling timeline that ran in CI on PR
// #1184 and captured the actual failure mode:
//
//   1. Every poll after t≈3 s on a failing run showed `rebuilt=true,
//      hasCmContent=false, scriptTagCount=3` — the rebuilt iframe's
//      srcDoc was committed and its 3 inline `<script>` tags were in
//      the DOM, but the standalone bundle's executions (which on a
//      good run dynamically injects a 4th/5th script and renders
//      CodeMirror) never happened.
//   2. Re-triggering the rebuild from inside the failing test (fresh
//      cssUrl ⇒ fresh iframe ⇒ fresh chance) routinely recovered
//      within 1-3 s on a subsequent attempt. The flake is bimodal:
//      a rebuilt iframe either runs the bundle fast or it hangs
//      forever inside Chrome's module loader for that iframe document.
//
// Two complementary changes on this branch:
//
//   a) `iframe-{editor,viewer}-index.ts` now defers `iframeReady`
//      until `window.renderDoenetEditorToContainer` (or Viewer) has
//      actually been defined by the standalone bundle. Previously
//      `iframeReady` fired at module top-level, before the bundle had
//      a chance to load. The parent's iframeReady listener immediately
//      Comlink-calls `renderEditorWithFunctionProps`, which calls
//      `window.renderDoenetEditorToContainer(...)`; on a slow boot
//      that threw because the bundle wasn't loaded, and the wrapper
//      catches Comlink rejections silently
//      (`.catch(logComlinkError(...))`). The deferral closes that
//      race for any "slow but loading" boot.
//
//   b) This spec now retries the rebuild trigger from inside a single
//      cypress attempt up to REBUILD_INNER_RETRIES times. The src fix
//      in (a) doesn't help the "bundle never executes at all" case —
//      that's a Chrome/iframe pathology our wrapper can't recover from
//      after the fact. But a fresh rebuild gives a fresh iframe with
//      a fresh chance to run the bundle, and the bimodal pattern means
//      a couple of retries cumulatively reach near-certain success.
//
// `CYPRESS_REPRO_REBUILDS=N` (default 1) lets a maintainer crank up the
// outer iteration count locally to multiply rebuild attempts per cypress
// run when chasing a regression.

function freshCssBlobUrl(): string {
    // Resolve the original CSS blob to its bytes synchronously (sync XHR is
    // fine here — runs once during test harness setup, never on the main
    // user thread) and wrap them in a fresh Blob to get a URL distinct from
    // STANDALONE_CSS_BLOB_URL but pointing at the same working stylesheet.
    // Sync XHR cannot set responseType, so rely on the default and read
    // responseText; for a `text/css` source that round-trip is straight
    // UTF-8 text and avoids the encoding pitfalls of doing the same on the
    // multi-MB binary-ish JS bundle.
    const xhr = new XMLHttpRequest();
    xhr.open("GET", STANDALONE_CSS_BLOB_URL, false);
    xhr.send();
    return URL.createObjectURL(
        new Blob([xhr.responseText], { type: "text/css" }),
    );
}

// Each rebuild iteration picks a fresh cssUrl from this pool, so srcDoc's
// `cssUrl` dep changes identity and the useMemo re-fires. Generated once at
// module load — sync XHR is cheap on the CSS bundle but we still don't want
// to repeat it N times.
//
// Pool size covers REPRO_REBUILDS top-level iterations plus
// REBUILD_INNER_RETRIES in-test retries each. Default REPRO_REBUILDS=1
// keeps this spec at the same outer CI cost as before. Bump via
// `CYPRESS_REPRO_REBUILDS=N npx cypress run …` to drive multiple
// rebuilds per cypress attempt when chasing a regression locally.
const REPRO_REBUILDS = Math.max(1, Number(Cypress.env("REPRO_REBUILDS") ?? 1));
// How many extra rebuild attempts the test will make from inside a single
// cypress attempt before giving up. The flake is bimodal: a rebuilt iframe
// either renders within ~3s or hangs forever (Chrome leaves the standalone
// bundle script tag in the DOM but its module never executes). Each new
// rebuild trigger creates a fresh iframe with a fresh attempt at running the
// bundle. Empirically 4 retries (5 rebuild triggers total per iteration) is
// well past the cumulative-failure threshold even when the per-rebuild "fast"
// rate is only ~50% — and cypress's runMode retries (2 retries, see
// cypress.config.ts) sit on top as a safety net.
const REBUILD_INNER_RETRIES = 4;
const CSS_URL_POOL: string[] = (() => {
    const total = REPRO_REBUILDS * (1 + REBUILD_INNER_RETRIES);
    const pool: string[] = [];
    for (let i = 0; i < total; i++) {
        pool.push(freshCssBlobUrl());
    }
    return pool;
})();

// Per-rebuild-attempt budget. Short enough that a hung boot is detected and
// retried quickly; long enough that a slow-but-healthy boot has room to
// finish. The old single-attempt budget was 60_000; the in-test retry loop
// effectively distributes that budget across multiple fresh-iframe attempts.
const REBUILD_INNER_TIMEOUT_MS = 15_000;
const POLL_INTERVAL_MS = 1_500;

// Result of a single rebuild attempt: either we saw the rebuilt iframe
// produce `.cm-content` (`ok: true`), or we hit the inner timeout (`ok:
// false`). The wrapping retry loop uses this to decide whether to give up
// or trigger another rebuild. On timeout, `rebuilt` and `hasCmContent`
// indicate which precondition was missing — useful in the error message
// when the outer retry budget is also exhausted.
type RebuildAttemptResult =
    | { ok: true; elapsedMs: number }
    | {
          ok: false;
          elapsedMs: number;
          rebuilt: boolean;
          hasCmContent: boolean;
      };

// Poll the iframe for up to `timeoutMs` waiting for the rebuilt iframe to
// produce `.cm-content`. Requiring `rebuilt` (the document no longer
// carries the pre-rebuild stamp) avoids a race the original spec was
// exposed to: on fast machines, React hadn't yet propagated the cssUrl
// change to the iframe attribute by the time we started polling, so the
// OLD iframe still had `.cm-content` and a naive "first cm-content seen
// wins" check would prematurely succeed.
function waitForRebuildAttempt(
    preRebuildStamp: string,
    timeoutMs: number,
): Cypress.Chainable<RebuildAttemptResult> {
    const start = Date.now();
    function poll(): Cypress.Chainable<RebuildAttemptResult> {
        return cy.get("iframe", { log: false }).then(($iframe) => {
            const iframe = $iframe[0] as HTMLIFrameElement | undefined;
            const doc = iframe?.contentDocument ?? null;
            const stamp =
                doc &&
                (doc as unknown as Record<string, string>)[RELOAD_MARKER_KEY];
            const rebuilt = !!doc && stamp !== preRebuildStamp;
            const hasCmContent = !!doc?.body?.querySelector(".cm-content");
            const elapsed = Date.now() - start;
            if (rebuilt && hasCmContent) {
                return cy.wrap<RebuildAttemptResult>(
                    { ok: true, elapsedMs: elapsed },
                    { log: false },
                );
            }
            if (elapsed >= timeoutMs) {
                return cy.wrap<RebuildAttemptResult>(
                    { ok: false, elapsedMs: elapsed, rebuilt, hasCmContent },
                    { log: false },
                );
            }
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            return cy.wait(POLL_INTERVAL_MS, { log: false }).then(() => poll());
        });
    }
    return poll();
}

// Retry the rebuild trigger up to REBUILD_INNER_RETRIES times inside a
// single cypress test attempt. The underlying flake is bimodal — a rebuilt
// iframe either renders fast (~3s) or hangs forever — so re-triggering
// (which creates a fresh iframe with a fresh chance at running the
// standalone bundle) recovers the test more cheaply than waiting longer on
// a hung one. Each retry needs a distinct cssUrl (so the wrapper's srcDoc
// useMemo re-fires) and a fresh stamp (so the poll knows which iframe is
// "old"). The CSS_URL_POOL pre-allocates enough URLs for every retry; we
// index into it via the test's iter + attempt position.
function waitForRebuiltCmContentWithRetry(
    iter: number,
    initialPreRebuildStamp: string,
    iterPoolBase: number,
    triggerRebuild: (cssUrl: string, newStamp: string) => Cypress.Chainable,
): Cypress.Chainable {
    let attemptIdx = 0;
    let preRebuildStamp = initialPreRebuildStamp;
    function runOneAttempt(): Cypress.Chainable {
        return waitForRebuildAttempt(
            preRebuildStamp,
            REBUILD_INNER_TIMEOUT_MS,
        ).then((result) => {
            if (result.ok) {
                return cy
                    .get("iframe", { log: false })
                    .its("0.contentDocument.body", { log: false })
                    .find(".cm-content", { log: false });
            }
            if (attemptIdx >= REBUILD_INNER_RETRIES) {
                throw new Error(
                    `Rebuilt iframe (iter ${iter}) never produced .cm-content ` +
                        `after ${attemptIdx + 1} attempts × ${REBUILD_INNER_TIMEOUT_MS}ms ` +
                        `(final state: rebuilt=${result.rebuilt}, ` +
                        `hasCmContent=${result.hasCmContent}).`,
                );
            }
            // Trigger another rebuild with a fresh cssUrl and stamp.
            attemptIdx += 1;
            const retryCssUrl = CSS_URL_POOL[iterPoolBase + attemptIdx];
            const retryStamp = `PRE_REBUILD_${iter}_RETRY_${attemptIdx}`;
            return triggerRebuild(retryCssUrl, retryStamp).then(() => {
                preRebuildStamp = retryStamp;
                return runOneAttempt();
            });
        });
    }
    return runOneAttempt();
}

function Harness({ cssUrl, readOnly }: { cssUrl: string; readOnly: boolean }) {
    return (
        <div style={{ height: "600px", width: "900px" }}>
            <span data-test="read-only-state">{String(readOnly)}</span>
            <DoenetEditor
                doenetML="<p>hello</p>"
                standaloneUrl={STANDALONE_BLOB_URL}
                cssUrl={cssUrl}
                addVirtualKeyboard={false}
                readOnly={readOnly}
            />
        </div>
    );
}

// Outer driver — owns the state for cssUrl/readOnly so we can flip them
// from the test via React's update path. The state setters are stashed on
// `window.__doenetSrcDocReplayHandles` so the test (which runs outside
// React's tree) can call them. cy.window() reaches the harness's window —
// the same one Cypress mounts React into.
declare global {
    interface Window {
        __doenetSrcDocReplayHandles?: {
            setReadOnly: (v: boolean) => void;
            setCssUrl: (v: string) => void;
        };
    }
}

function DriverRoot() {
    const [readOnly, setReadOnly] = useState(false);
    const [cssUrl, setCssUrl] = useState(STANDALONE_CSS_BLOB_URL);
    // Mutate window inside an effect so the latest setters are exposed.
    React.useEffect(() => {
        window.__doenetSrcDocReplayHandles = { setReadOnly, setCssUrl };
        return () => {
            delete window.__doenetSrcDocReplayHandles;
        };
    }, []);
    return <Harness cssUrl={cssUrl} readOnly={readOnly} />;
}

describe("DoenetEditor (iframe wrapper) — srcDoc rebuild replays drifted props", () => {
    const titleSuffix =
        REPRO_REBUILDS > 1 ? ` (×${REPRO_REBUILDS} for flake repro)` : "";
    it(`after a forced iframe reload, prop changes that happened pre-reload are reapplied to the new iframe${titleSuffix}`, () => {
        cy.mount(<DriverRoot />);

        // Initial boot — uses the wrapper's default IFRAME_READY_TIMEOUT
        // because it's the same first-boot we've always done.
        cy.get("iframe", { timeout: IFRAME_READY_TIMEOUT })
            .its("0.contentDocument.body", { timeout: IFRAME_READY_TIMEOUT })
            .find(".cm-content", { timeout: IFRAME_READY_TIMEOUT })
            .should("exist");

        for (let iter = 1; iter <= REPRO_REBUILDS; iter++) {
            const initialStamp = `PRE_REBUILD_${iter}`;
            // CSS_URL_POOL slot 0 is for iter 1's first attempt; slots 1..N
            // are its in-test retries; the next iteration starts at the
            // next contiguous block. Keeps every rebuild's cssUrl distinct
            // so the wrapper's srcDoc useMemo always re-fires.
            const iterPoolBase = (iter - 1) * (1 + REBUILD_INNER_RETRIES);
            const initialCssUrl = CSS_URL_POOL[iterPoolBase];

            // Stamp the current iframe document so we can verify the
            // upcoming rebuild really replaced it.
            cy.get("iframe").then(($iframe) => {
                const doc = ($iframe[0] as HTMLIFrameElement).contentDocument!;
                (doc as unknown as Record<string, string>)[RELOAD_MARKER_KEY] =
                    initialStamp;
            });

            // Drift a prop between mount and rebuild. We alternate the
            // readOnly value so each iteration tests a meaningful diff
            // against the freshly-baked baseline.
            const targetReadOnly = iter % 2 === 1;
            cy.window().then((win) => {
                win.__doenetSrcDocReplayHandles!.setReadOnly(targetReadOnly);
            });
            cy.get("[data-test=read-only-state]").should(
                "have.text",
                String(targetReadOnly),
            );

            // Confirm the drift was applied to the still-current iframe
            // *without* causing a reload (stamp must persist) — same
            // invariant the original spec checked, kept intact.
            cy.get("iframe").then(($iframe) => {
                const doc = ($iframe[0] as HTMLIFrameElement).contentDocument!;
                expect(
                    (doc as unknown as Record<string, string>)[
                        RELOAD_MARKER_KEY
                    ],
                    `stamp persists pre-rebuild on iter ${iter}`,
                ).to.equal(initialStamp);
            });

            // Force the rebuild by swapping cssUrl to a fresh blob URL.
            cy.window().then((win) => {
                win.__doenetSrcDocReplayHandles!.setCssUrl(initialCssUrl);
            });

            // Wait for the rebuilt iframe with full diagnostics. The
            // stamp value identifies the PRE-rebuild document, so the
            // poll can recognise when the contentDocument has actually
            // been replaced (and not just trip on cm-content from the
            // pre-rebuild iframe). If the rebuilt iframe hangs (the
            // bimodal flake — see header comment), the helper re-triggers
            // a fresh rebuild up to REBUILD_INNER_RETRIES times from
            // inside this single cypress attempt before giving up.
            waitForRebuiltCmContentWithRetry(
                iter,
                initialStamp,
                iterPoolBase,
                (retryCssUrl, retryStamp) => {
                    // Restamp the *current* iframe so the next poll knows
                    // which contentDocument counts as "old", then swap
                    // cssUrl to fire the rebuild.
                    return cy
                        .get("iframe", { log: false })
                        .then(($iframe) => {
                            const doc = ($iframe[0] as HTMLIFrameElement)
                                .contentDocument!;
                            (doc as unknown as Record<string, string>)[
                                RELOAD_MARKER_KEY
                            ] = retryStamp;
                        })
                        .then(() => cy.window({ log: false }))
                        .then((win) => {
                            win.__doenetSrcDocReplayHandles!.setCssUrl(
                                retryCssUrl,
                            );
                        });
                },
            );

            // New document — stamp must be gone.
            cy.get("iframe").then(($iframe) => {
                const doc = ($iframe[0] as HTMLIFrameElement).contentDocument!;
                expect(
                    (doc as unknown as Record<string, string>)[
                        RELOAD_MARKER_KEY
                    ],
                    `iframe was reloaded on iter ${iter}`,
                ).to.be.undefined;
            });

            // The whole point: the readOnly value that drifted in
            // *before* the rebuild must have been replayed against the
            // new iframe. Verify by typing — if readOnly was reapplied,
            // text shouldn't change; if it wasn't, text will.
            cy.get("iframe")
                .its("0.contentDocument.body")
                .find(".cm-content")
                .then(($el) => {
                    const before = $el.text();
                    if (targetReadOnly) {
                        cy.wrap($el)
                            .click()
                            .type(` SHOULD_NOT_APPEAR_${iter}`, {
                                force: true,
                            });
                        cy.wrap($el).invoke("text").should("eq", before);
                    } else {
                        // Editor IS writable on this iteration —
                        // dispense with the typing assertion; we only
                        // care that the editor exists and was set up
                        // correctly. (We don't want to dirty the
                        // editor here because the next iteration will
                        // assume the initial doenetML content.)
                        cy.wrap($el).invoke("text").should("eq", before);
                    }
                });
        }
    });
});
