# Plan: Consolidate Line-Family Drag Handlers

## TL;DR

The 8 draggable JSXGraph renderers (line, lineSegment, ray, vector, polyline, polygon, point, circle) each register `down`/`drag`/`up`/`keydown`/`keyfocusout` event handlers with near-identical structure but renderer-specific action payloads. Extract the common state-machine into a single helper that takes a typed config; ~1,000 LOC of handler boilerplate collapses to ~250 LOC of declarative wiring per renderer.

This is a **separate PR from steps 1–4** in the dedup plan because it has higher behavioral risk and needs spec-by-spec verification.

---

## What's duplicated

Every line-family renderer follows this state machine on its primary JXG object (and, for multi-point renderers, on each draggable sub-point):

```
on "down":
  - blur active element
  - reset dragged = false, pointerMovedSinceDown = false
  - capture pointerAtDown.current = [e.x, e.y]
  - capture coordinates-at-down (line: pointsAtDown; circle: centerAtDown + radiusAtDown + throughAnglesAtDown; etc.)
  - if !fixed: fire actions.lineFocused / pointFocused / circleFocused (componentIdx)

on "drag":
  - if exceededDragThreshold(e, pointerAtDown.current): dragged = true
  - if !dragged: return
  - compute new coords from JXG element
  - fire actions.moveLine / movePoint / moveCircle (transient: true, payload is renderer-specific)
  - reset JXG element coords back to lastPositionFromCore (so the action is the source of truth)

on "up":
  - if dragged: fire commit move action (transient: false)
  - else if !pointerMovedSinceDown && !fixed: fire actions.lineClicked / pointClicked / circleClicked
  - fire actions.lineFocusedOff (etc.)
  - reset dragged = false, pointerIsDown = false

on "keydown" (Enter):
  - if dragged: fire commit move action; dragged = false
  - fire actions.lineClicked / pointClicked / etc.

on "keyfocusout":
  - if dragged: fire commit move action; dragged = false
```

**Locations** (after the recent sync-helper PR):

| Renderer | Handler block | LOC |
|----------|---------------|-----|
| line.tsx | 138–292 | ~155 |
| lineSegment.tsx | 160–520 (split across segment + 2 endpoints) | ~360 |
| ray.tsx | 129–264 | ~135 |
| vector.tsx | 200–390 (split across vector + tail + head) | ~190 |
| polyline.tsx | 160–540 (split across polyline + N vertices) | ~380 |
| polygon.tsx | similar — segment + N vertices | ~370 |
| point.tsx | 200–430 (split across point + shadow point) | ~230 |
| circle.tsx | 250–490 (split across circle + indicator point) | ~240 |
| **Total** | | **~2,000** |

(The polyline/polygon/lineSegment counts include per-vertex handlers, which are themselves duplicates of the same state machine.)

---

## Per-renderer divergence (what the abstraction must accommodate)

Spot the differences before designing the API; missing one will force a leaky abstraction.

1. **Action-name family**: each renderer has its own `actions.move*`, `actions.*Focused`, `actions.*Clicked`. These are passed through `useDoenetRenderer` and named per component (`moveLine`, `movePoint`, `moveCircle`, `movePolyline`, etc.).

2. **Move-action payload shape**:
   - **line / ray**: `{ point1coords, point2coords, transient }`
   - **lineSegment**: `{ point1coords, point2coords, transient }` — but per-endpoint handlers move only one endpoint
   - **vector**: `{ tailcoords, headcoords, transient }` — head and tail can move independently
   - **point**: `{ x, y, transient }`
   - **circle**: `{ center, radius, throughAngles, transient }` — radius and angles are passed-through-unchanged when only the center drags
   - **polyline / polygon**: `{ pointCoords: { [vertexIndex]: [x, y] }, sourceVertexIndex?, transient }` — drag of whole shape moves all vertices; drag of single vertex moves one

3. **Coordinate capture at `down`**: each renderer snapshots different state:
   - line: `[point1.X(), point1.Y()]`, `[point2.X(), point2.Y()]`
   - circle: `centerAtDown`, `radiusAtDown`, `throughAnglesAtDown`
   - polyline: snapshot of all vertex coords as a map

4. **Coordinate read at `drag`**: each renderer reads coords differently from the JXG object (`element.point1.X()` vs `element.center.X()` vs `vertices[i].X()`).

5. **Multi-object dispatch**: lineSegment, vector, polyline, polygon, point (shadow), circle (indicator) bind handlers to **multiple** JXG objects. The handler logic is the same, but the `down` snapshot and `drag` payload depend on **which** object received the event.

6. **`switchable` (line only)**: line.tsx has a special "switch endpoints" gesture that swaps point1/point2 on a click without drag. This is a click-handler decoration, not a separate event.

7. **point.tsx shadow-point**: a zero-opacity sibling absorbs pointer events for off-graph indicators; primary handlers attach to the **shadow**, not the visible point.

8. **circle.tsx indicator**: similar — drag the indicator point to drag the off-graph indicator coordinates, with separate `dispatchMoveCircle` logic.

9. **`pointerIsDown` cross-board tracking**: a few renderers (e.g., line, polyline) call `useBoardPointerTracking(board, dragState)` so a pointer-up *outside* the JXG object still finalizes the drag. This is independent of the per-handler logic but interacts with the same `dragState`.

---

## Proposed shape

A pure function (not a hook) that registers handlers given a config. Renderers call it once per JXG object that should be draggable.

### Sketch

```ts
// utils/lineFamilyDragHandlers.ts

export type DragHandlerConfig<TSnapshot, TMoveArgs, TClickArgs> = {
    jxg: JXGElement;                        // the object to bind to
    actions: {
        move:        DoenetAction<TMoveArgs>;
        focus?:      DoenetAction<TClickArgs>;
        focusOff?:   DoenetAction<TClickArgs>;
        click?:      DoenetAction<TClickArgs>;
    };
    dragState: PointerDragState;            // shared dragged / pointerAtDown / etc.
    fixedRef:        MutableRefObject<boolean>;
    fixLocationRef:  MutableRefObject<boolean>;
    snapshot:    () => TSnapshot;           // capture state on `down`
    snapshotRef: MutableRefObject<TSnapshot | null>;
    buildMoveArgs: (
        e: PointerEvent,
        snapshot: TSnapshot,
        opts: { transient: boolean },
    ) => TMoveArgs | null;                  // null skips the dispatch
    buildClickArgs?: () => TClickArgs;      // defaults to { componentIdx }
    componentIdx: number;
    onDragApplied?: (snapshot: TSnapshot) => void;  // e.g. reset JXG to lastPositionFromCore
    extraEvents?: {                         // escape hatch for switchable, etc.
        click?:   (e: PointerEvent) => void;
        keydown?: (e: KeyboardEvent) => void;
    };
};

export function attachLineFamilyDragHandlers<S, M, C>(
    config: DragHandlerConfig<S, M, C>,
): () => void;  // returns deregister function (pairs with #4 from the dedup plan)
```

### How a renderer uses it

```ts
// line.tsx createLineJXG()
const detachHandlers = attachLineFamilyDragHandlers({
    jxg: newLineJXG,
    actions: {
        move:      actions.moveLine,
        focus:     actions.lineFocused,
        focusOff:  actions.lineFocusedOff,
        click:     actions.lineClicked,
    },
    dragState,
    fixedRef: fixed,
    fixLocationRef: fixLocation,
    componentIdx,
    snapshot: () => [
        [newLineJXG.point1.X(), newLineJXG.point1.Y()],
        [newLineJXG.point2.X(), newLineJXG.point2.Y()],
    ] as [number[], number[]],
    snapshotRef: pointsAtDown,
    buildMoveArgs: (_, snapshot, { transient }) => {
        // compute current coords from JXG, return action payload
        return { point1coords: ..., point2coords: ..., transient };
    },
    onDragApplied: () => {
        // reset JXG to lastPositionsFromCore so worker is the source of truth
        newLineJXG.point1.coords.setCoordinates(JXG.COORDS_BY_USER, lastPositionsFromCore.current[0]);
        newLineJXG.point2.coords.setCoordinates(JXG.COORDS_BY_USER, lastPositionsFromCore.current[1]);
    },
});
detachHandlersRef.current = detachHandlers;
```

For **multi-object** renderers (lineSegment, polyline, polygon, vector, point, circle), call `attachLineFamilyDragHandlers` once per object, with a different `snapshot` / `buildMoveArgs` / `onDragApplied` closure. The whole-shape-drag and per-vertex-drag are different configs sharing the helper.

### What the helper *doesn't* try to do

- **Doesn't manage `useBoardPointerTracking`** — keep that at the renderer top level.
- **Doesn't know about labels** — label sync stays in the existing `applyLineFamilyLabelPlacement` flow.
- **Doesn't unify the move-action payload type** — each renderer's `TMoveArgs` is the existing payload shape. Don't try to invent a unified action signature; that's worker-side work.
- **Doesn't replace `usePointerDragState`** — the helper consumes it.

---

## Migration order

Land one renderer at a time, validate with Cypress, then move on. Order by simplicity / risk:

1. **ray.tsx** — single-object, single-action shape, no special cases. Smallest payoff but lowest risk; tests the helper API.
2. **line.tsx** — single object but has the `switchable` click decoration. Validates the `extraEvents.click` escape hatch.
3. **lineSegment.tsx** — first multi-object case. Validates that calling the helper 3× with different configs produces correct per-endpoint behavior.
4. **vector.tsx** — multi-object with tail/head independence.
5. **polyline.tsx** — N-vertex case. Tests dynamic vertex count.
6. **polygon.tsx** — same shape as polyline; should be a near-copy of step 5.
7. **point.tsx** — shadow-point case. Validates that the helper works when bound to a non-visible object.
8. **circle.tsx** — indicator-point case + transient-only-when-center-moves.

After each renderer:
- Run `npm run test:e2e-group{N}` for the relevant group.
- Manually exercise drag, click, keyboard-Enter, keyboard-focusout on the migrated renderer.
- Diff the worker action payloads against `main` (record SVs change patterns in dev tools, compare).

---

## Verification checklist

- [ ] Cypress `graph` and `tagSpecific/{line,linesegment,ray,vector,polyline,polygon,point,circle}.cy.js` pass on each migration.
- [ ] Drag-then-release commits via `transient:false` (worker writes through to source).
- [ ] Drag below threshold + release dispatches `*Clicked`, not a bogus zero-delta `move*`.
- [ ] Keyboard Enter on focused element fires click; Tab-out commits a pending drag.
- [ ] Pointer-up *outside* the JXG board still finalizes the drag (cross-board tracking still wired).
- [ ] No memory leaks: mount-unmount-mount loops don't accumulate handlers (DevTools memory snapshot).
- [ ] `switchable` line behavior preserved (click swaps endpoints).
- [ ] point.tsx off-graph indicator drag still works through the shadow point.
- [ ] circle.tsx indicator drag changes only `center`, not `radius`/`throughAngles`.

---

## Risks / open questions

1. **Closure capture of stale refs**. The current handlers all close over module-scope `useRef`s. The helper config must take refs (not values) for anything that changes between renders (`fixed`, `fixLocation`, `lastPositionFromCore`). The `buildMoveArgs` closure already runs at event-time, so it sees fresh refs — but a careless `.bind()` or memoization could break this.

2. **Action dispatch ordering**. Renderers sometimes dispatch focus *before* mutating any JXG state (e.g., line.tsx down handler), and sometimes the order is interleaved with state captures. Audit each renderer's exact `down` ordering before moving its logic into a generic `down` handler — if order matters anywhere, document it as a constraint of the helper.

3. **Per-vertex vs whole-shape drag for polyline/polygon**. The helper handles "drag this object". For polyline/polygon, "drag the polyline" means "move all vertices"; "drag vertex i" means "move only vertex i". Both go through the same `move*` action with different payloads. Make sure the helper API can express both without forking into two helpers.

4. **`useBoardPointerTracking` interaction**. The cross-board pointer-up tracking writes to `dragState.pointerIsDown`. The helper reads the same state. If the helper is called for multiple objects on the same board, both will read/write the shared state — verify this doesn't cause one object's `up` to short-circuit another's.

5. **Should this be a hook instead?** A hook would auto-deregister via `useEffect` cleanup. But renderers create their JXG objects lazily (inside `createXJXG()`, not at mount), so a hook can't get the `jxg` reference at the right time. Keep it as a plain function; pair the returned `detach` callback with the existing `delete*JXG` flow.

6. **Don't try to also unify the JSX wrapper / `<span id={id}/>` return**. That's a separate, smaller cleanup that doesn't depend on this work.

---

## Out of scope

- The lifecycle skeleton (`if (board) { create() / delete() / sync() }`). That is *too* divergent across renderers to deduplicate without a leaky abstraction; leave it alone.
- Worker-side action signature unification. Each component still owns its `move*` action shape.
- cobwebPolyline.tsx, angle.tsx — neither follows the line-family drag pattern; leave unchanged.
- Curve.tsx control-points dragging — different enough (control-point manipulation, not whole-curve drag) that it deserves its own analysis pass before being included.
