# Testing Parent Coordination

Manual tests for DoenetML parent coordinator functionality.

## Running Tests

### Setup

```bash
cd packages/standalone
npm run dev
```

This starts a dev server at http://localhost:5173

### Test 1: DOM Order Strategy

Open http://localhost:5173/iframe-parent.html

**Expected Behavior:**
- Each iframe initializes serially (one at a time)
- Initialization order matches DOM order: Document 1 → 2 → 3 → 4 → 5 → 6
- All 6 iframes complete successfully
- Graphs appear sequentially from top to bottom

**What to Verify:**
1. Watch the page load - graphs should render one at a time in order
2. Check Network tab: only one iframe should be actively loading/rendering at any given moment
3. All graphs render correctly without blanks or errors
4. Total load time should be longer than parallel loading (serialized is slower but more stable)

### Test 2: Viewport-First Strategy

Open http://localhost:5173/iframe-parent-viewport-first.html

**Expected Behavior:**
- Documents 1-2 are visible at top of page and initialize first
- After visible documents complete, remaining documents initialize in DOM order
- All 6 documents eventually initialize

**What to Verify:**
1. Keep page at top - Documents 1-2 should render first (they're in viewport)
2. Watch as Documents 3-4 and then 5-6 render in order
3. Try refreshing and immediately scrolling to bottom (before load starts) - bottom documents should render first
4. All graphs eventually render correctly
5. Note: Visibility detection uses 600px rootMargin, so documents near viewport may also be considered "visible"

### Test 3: Uncoordinated (No Coordinator)

Open http://localhost:5173/index.html

**Expected Behavior:**
- Single page with 3 DoenetML viewers (not in iframes)
- All viewers initialize in parallel (no coordination)
- All graphs appear nearly simultaneously

**What to Verify:**
1. All 3 viewers should render very quickly, appearing together
2. Much faster than coordinated tests (parallel vs serial)
3. All content renders correctly

## Verification Methods

Since the library doesn't emit console logs by default, verify coordination behavior by:

1. **Visual observation**: Watch graphs render sequentially vs simultaneously
2. **Network tab**: Monitor which iframes are actively loading
3. **Performance tab**: Record timeline to see serialized vs parallel initialization
4. **Page interaction**: Try scrolling during load for viewport-first testing

## Test Files

- `iframe-parent.html` - Test parent page with 6 iframes (Documents 1-6) and dom-order strategy
- `iframe-parent-viewport-first.html` - Test parent page with 6 iframes and viewport-first strategy, with spacers to test viewport detection
- `iframe-child.html` - Child iframe template used in both coordination tests
- `index.html` - Single page with 3 viewers directly embedded (no iframes, no coordination)

## Performance Expectations

**Coordinated (Serial):**
- Total time ~15-20s for 6 iframes (each ~2-3s)
- Predictable, sequential rendering visible to the eye
- Prevents browser strain from parallel rendering
- Better for pages with many complex documents

**Uncoordinated (Parallel):**
- Total time ~2-3s for all viewers (parallel)
- All content appears nearly simultaneously
- Higher instantaneous CPU/memory usage
- May cause frame drops on lower-end devices
- Fine for single-page apps with few viewers
