# Handoff: fix `<video>` Play action lost when clicked before YouTube player is ready

**Tracking issue:** [#1074](https://github.com/Doenet/DoenetML/issues/1074)

## Context

Surfaced while working on PR #1071 (`fix/video-youtube-effect`), which fixed the "switching YouTube source breaks the player" bug. While extending the Cypress test for that PR to also exercise post-switch play/pause via `<callAction>`, we hit a pre-existing race that was deemed out of scope for that PR.

PR #1071 worked around it in the test by waiting for `recordVideoReady` to fire (detected via duration change) before clicking Play. This handoff is to fix the underlying issue so users don't have to click Play twice.

## The bug

If the user clicks the `playVideo` action **before the YT IFrame Player has finished its handshake with the iframe**, the click is silently lost. Two real scenarios:

1. **First load**: user clicks Play as soon as the iframe appears, before `window.YT` has fully initialized the player.
2. **After a source change**: user switches `youtube` to a new id (e.g., via a `choiceInput` bound to `youtube=$videoCode`) and clicks Play immediately on the new video.

Symptoms: Play button click does nothing visible. User clicks again, then it works.

The behavior is documented (and asserted) by the existing test at `packages/test-cypress/cypress/e2e/tagSpecific/video.cy.js:159`:

```js
cy.log("clicking play action too early does not do anything (no error)");
cy.get("#playAction").click();
cy.get("#state").contains("stopped");
```

## Trace of the race

1. User clicks `playVideo` action → worker `playVideo` action sets `state="playing"`.
2. Renderer re-renders. The block at `packages/doenetml/src/Viewer/renderers/video.tsx:404`:
   ```js
   if (player.current?.getPlayerState) {
       let playerState = player.current.getPlayerState();
       if (SVs.state !== lastSVsState.current) {
           if (SVs.state === "playing") {
               if (playerState === PlayerState.UNSTARTED || ...) {
                   player.current.playVideo();
               }
           }
           ...
           lastSVsState.current = SVs.state;
       }
   }
   ```
   `player.current.getPlayerState()` returns `-1` (UNSTARTED) before the iframe has handshaked, the `UNSTARTED` branch matches, and `playVideo()` is called. **But this `playVideo()` is sent via postMessage to an iframe whose YT embed page hasn't loaded yet — the message is dropped.** `lastSVsState.current` is set to `"playing"` regardless.
3. Time passes. The iframe loads, the player handshakes, `onPlayerReady` fires.
4. `onPlayerReady` calls `recordVideoReady` (worker action at `packages/doenetml-worker-javascript/src/components/Video.js:671`), which **unconditionally sets `state="stopped"`** (intended to transition out of the initial `"initializing"` state, but it overwrites the user's `"playing"` intent).
5. Renderer re-renders. `SVs.state="stopped"`, `lastSVsState.current="playing"` → block runs `pauseVideo()` (no-op since the player wasn't playing). `lastSVsState.current="stopped"`. Net effect: user's click vanished.

## Suggested fix

Two coordinated changes:

### 1. Worker: `recordVideoReady` should preserve user-set state

`packages/doenetml-worker-javascript/src/components/Video.js:671-698`

Only transition `state` from `"initializing"` → `"stopped"`. If the user has already set state to `"playing"` (clicked Play before the player was ready), or `"stopped"` (re-init for a source change after a previous pause), leave it alone. Always update `duration` regardless.

```js
async recordVideoReady({ duration, actionId, sourceInformation = {}, skipRendererUpdate = false }) {
    const updateInstructions = [
        {
            updateType: "updateValue",
            componentIdx: this.componentIdx,
            stateVariable: "duration",
            value: duration,
        },
    ];
    const currentState = await this.stateValues.state;
    if (currentState === "initializing") {
        updateInstructions.push({
            updateType: "updateValue",
            componentIdx: this.componentIdx,
            stateVariable: "state",
            value: "stopped",
        });
    }
    await this.coreFunctions.performUpdate({
        updateInstructions,
        actionId,
        sourceInformation,
        skipRendererUpdate,
        overrideReadOnly: true,
        doNotSave: true,
    });
}
```

### 2. Renderer: re-issue `playVideo` when the player becomes ready

`packages/doenetml/src/Viewer/renderers/video.tsx`

Track current `SVs.state` in a ref so `onPlayerReady` (captured in a stale closure when constructed inside `useEffect`) can read the latest intent. In `onPlayerReady`, after recording readiness, re-issue `playVideo` if intent is `"playing"`:

```tsx
const stateRef = useRef(SVs.state);
stateRef.current = SVs.state; // update on every render

function onPlayerReady(event: any) {
    callAction({
        action: actions.recordVideoReady,
        args: { duration: player.current.getDuration() },
    });
    // If the user already requested playback before the player handshaked,
    // start playing now.
    if (stateRef.current === "playing") {
        player.current.playVideo();
    }
}
```

Both changes are needed together: without the worker fix, `recordVideoReady` would still wipe `state` back to `"stopped"` after the renderer re-issued playVideo, and the renderer would then call `pauseVideo` and stop the video.

### Edge-case trace (verify these all behave)

| Scenario | Pre-fix | Post-fix |
|---|---|---|
| First load, no click | `state: initializing → stopped` | same |
| First load, immediate Play click | `playing → stopped` (click lost) | `playing → playing` (plays once ready) |
| Click Play, then Pause, both before ready | `stopped` (both lost) | `stopped` (no auto-play, since intent at ready time is `stopped`) |
| Source change while paused, then click Play | `playing → stopped` (click lost; this is what triggered the discovery) | `playing → playing` |
| Source change while paused, no click | `stopped → stopped` | same |

## Test updates required

### Existing test must change

`packages/test-cypress/cypress/e2e/tagSpecific/video.cy.js:159-189` documents and asserts the *current* (broken) behavior. After the fix, several assertions in the "actions on youtube video" test will no longer hold. Specifically:

- Line 163: `cy.get("#state").contains("stopped");` — after the fix, the early click would result in `state="playing"` once the player is ready.
- Lines 164-173: `time`, `secondsWatched`, `fractionWatched` assertions assume the early click did nothing. After the fix, the video would actually start playing, so these will need to be reworked.
- Line 175 onward (the explicit `cy.get("#playAction").click()` after a 2-second wait that "actually plays") becomes redundant.

Decide whether to:
- Restructure the test to assert the new "click works even if too early" behavior, or
- Keep a simplified version that just verifies repeated play/pause works.

### New test for the fixed behavior

Add a test that clicks `playAction` *immediately* after the iframe appears (without waiting for `state="stopped"`) and asserts the video eventually plays:

```js
it("youtube play action queued before player ready still plays", () => {
    // ... post a doenetML with <video youtube="..."> + state/time/playAction ...
    cy.get('iframe[src*="youtube.com"]').should("be.visible");
    // Click before recordVideoReady has had a chance to fire.
    cy.get("#playAction").click();
    cy.get("#state").should("have.text", "playing");
    cy.get("#time").contains("1");
    cy.get("#time").contains("2");
});
```

This would fail today and pass with the fix.

### PR #1071 test can be simplified

After this fix lands, `packages/test-cypress/cypress/e2e/tagSpecific/video.cy.js:65` ("youtube video reloads when youtube source changes") no longer needs the duration-change wait it currently uses to dodge this race. The captured `preSwitchDuration` block and the `should((el) => expect(el.text()).not.to.eq(preSwitchDuration))` assertion can be removed; clicking Play right after the switch will just work.

## How to verify

Follow `TEST_RUN_INSTRUCTIONS_FOR_AGENTS.md`:

```bash
npm run build -w @doenet/test-cypress
npm run preview -w @doenet/test-cypress -- --host 127.0.0.1 --port 4173 --strictPort   # background
npm exec -w @doenet/test-cypress -- cypress run -b chrome --headless \
    --config-file cypress.config.js \
    --config 'video=false,retries=0,defaultCommandTimeout=15000,specPattern=cypress/e2e/tagSpecific/video.cy.js'
```

All ten tests in `video.cy.js` should pass after the fix and test updates.

## Changeset

User-facing fix → patch bump for the fixed group (omit `@doenet/v06-to-v07` per existing convention):

```
---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix `<video>` so the YouTube `playVideo` action takes effect even when the user clicks Play before the YT IFrame Player has finished initializing (on first load or after a source change). Previously the early click was silently dropped and the user had to click again.
```
