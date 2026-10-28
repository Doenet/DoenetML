# Load on devices: 2026-10-22-claude-cloud-aa1490af7

Machine **claude-cloud** (Intel(R) Xeon(R) Processor, 4 cores, 16091 MB, Linux 6.18.44-fc-v140 x64, Node v22.22.0); commit `aa1490af7`; 2026-10-22.

Builds: cells: wasm-pack --release (npm run build -w packages/cells-core).

How long a student waits for `homework` on each device: from navigation until the document can be read, and until it can be used. Each scenario loads a page of the cells viewer's build, served as a deployed host serves it, compressed, on a device: a CPU class calibrated on this machine, a network, and a phone's or desktop's screen. Times are medians of 5 runs, with the fastest and slowest under each. What every column means is under [Measurements](#measurements). How the layer works: [METHOD.md](../../../METHOD.md#the-load-layer).

## Devices

The calibration workload took **77 ms** on this machine, unthrottled (the median of 9 rounds' fastest repetitions, which ranged 68 ms–100 ms). A CPU class is the workload's time on that class. Its factor is the throttling at which the workload takes that time, found by timing it throttled and fitting the timings; Achieved is the workload's time at that factor, timed again, a check that carries the noise of one throttled timing.

| Device | CPU class | Workload | Factor | Achieved | Network | Screen |
|---|---|---|---|---|---|---|
| desktop | host | 77 ms | ×1.00 | 77 ms | none (not slowed) | 1000×800 at 1× |
| mid-phone | mid-phone | 320 ms | ×2.83 | 317 ms | 4g (60 ms, 9 Mbps down, 1.5 Mbps up) | 412×915 at 2.625×, mobile, touch |
| slow-phone | slow-phone | 480 ms | ×4.11 | 467 ms | slow-4g (150 ms, 1.6 Mbps down, 0.75 Mbps up) | 360×800 at 2×, mobile, touch |

After the run the workload took 75 ms on this machine, -2.5% against the calibration, within the run's tolerance.

The phones' workload times are provisional until measured on real phones (`src/devices.mjs`).

## Budget

The document readable within 300 ms of navigation on the slow-phone, on its own network, on a first visit.

| Page | Readable | Usable |
|---|---|---|
| viewer | ✗ **5.15 s** <sub>5.14 s–5.18 s</sub> | **5.15 s** <sub>5.14 s–5.18 s</sub> |

## Every scenario, cold

A first visit: a new browser profile, nothing cached.

| Page, device, network | First paint | Readable | Usable | Largest paint | Blocking | Layout shift | Transferred |
|---|---|---|---|---|---|---|---|
| viewer, desktop, none <sub>CPU ×1.00</sub> | **148 ms** <sub>89 ms–159 ms</sub> | **203 ms** <sub>187 ms–213 ms</sub> | **203 ms** <sub>187 ms–213 ms</sub> | **159 ms** <sub>148 ms–227 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **879 KB** <sub>879 KB–879 KB</sub> |
| viewer, desktop, 4g <sub>CPU ×1.00</sub> | **617 ms** <sub>615 ms–621 ms</sub> | **1.02 s** <sub>1.01 s–1.05 s</sub> | **1.02 s** <sub>1.01 s–1.05 s</sub> | **1.03 s** <sub>1.02 s–1.06 s</sub> | — | **0.000** <sub>0.000–0.000</sub> | **879 KB** <sub>879 KB–879 KB</sub> |
| viewer, desktop, slow-4g <sub>CPU ×1.00</sub> | **2.86 s** <sub>2.86 s–2.88 s</sub> | **4.83 s** <sub>4.82 s–4.86 s</sub> | **4.83 s** <sub>4.82 s–4.86 s</sub> | **4.84 s** <sub>4.83 s–4.87 s</sub> | — | **0.000** <sub>0.000–0.000</sub> | **879 KB** <sub>879 KB–879 KB</sub> |
| viewer, mid-phone, none <sub>CPU ×2.83</sub> | **229 ms** <sub>195 ms–271 ms</sub> | **549 ms** <sub>494 ms–580 ms</sub> | **549 ms** <sub>494 ms–580 ms</sub> | **561 ms** <sub>506 ms–599 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **879 KB** <sub>879 KB–879 KB</sub> |
| viewer, mid-phone, 4g <sub>CPU ×2.83</sub> | **722 ms** <sub>714 ms–724 ms</sub> | **1.22 s** <sub>1.20 s–1.24 s</sub> | **1.22 s** <sub>1.20 s–1.24 s</sub> | **1.23 s** <sub>1.21 s–1.25 s</sub> | — | **0.000** <sub>0.000–0.000</sub> | **879 KB** <sub>879 KB–879 KB</sub> |
| viewer, mid-phone, slow-4g <sub>CPU ×2.83</sub> | **2.95 s** <sub>2.95 s–2.97 s</sub> | **5.00 s** <sub>5.00 s–5.02 s</sub> | **5.00 s** <sub>5.00 s–5.02 s</sub> | **5.02 s** <sub>5.01 s–5.04 s</sub> | — | **0.000** <sub>0.000–0.000</sub> | **879 KB** <sub>879 KB–879 KB</sub> |
| viewer, slow-phone, none <sub>CPU ×4.11</sub> | **291 ms** <sub>258 ms–317 ms</sub> | **755 ms** <sub>702 ms–770 ms</sub> | **755 ms** <sub>702 ms–770 ms</sub> | **776 ms** <sub>716 ms–787 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **879 KB** <sub>879 KB–879 KB</sub> |
| viewer, slow-phone, 4g <sub>CPU ×4.11</sub> | **795 ms** <sub>781 ms–823 ms</sub> | **1.40 s** <sub>1.31 s–1.44 s</sub> | **1.40 s** <sub>1.31 s–1.44 s</sub> | **1.42 s** <sub>1.33 s–1.46 s</sub> | — | **0.000** <sub>0.000–0.000</sub> | **879 KB** <sub>879 KB–879 KB</sub> |
| viewer, slow-phone, slow-4g <sub>CPU ×4.11</sub> | **3.02 s** <sub>3.01 s–3.09 s</sub> | **5.15 s** <sub>5.14 s–5.18 s</sub> | **5.15 s** <sub>5.14 s–5.18 s</sub> | **5.17 s** <sub>5.15 s–5.19 s</sub> | — | **0.000** <sub>0.000–0.000</sub> | **879 KB** <sub>879 KB–879 KB</sub> |

## Every scenario, warm

A second visit: the same profile, the files in the HTTP cache.

| Page, device, network | First paint | Readable | Usable | Largest paint | Blocking | Layout shift | Transferred |
|---|---|---|---|---|---|---|---|
| viewer, desktop, none <sub>CPU ×1.00</sub> | **140 ms** <sub>87 ms–161 ms</sub> | **196 ms** <sub>187 ms–203 ms</sub> | **196 ms** <sub>187 ms–203 ms</sub> | **161 ms** <sub>140 ms–206 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |
| viewer, desktop, 4g <sub>CPU ×1.00</sub> | **166 ms** <sub>150 ms–171 ms</sub> | **262 ms** <sub>257 ms–291 ms</sub> | **262 ms** <sub>257 ms–291 ms</sub> | **285 ms** <sub>269 ms–300 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |
| viewer, desktop, slow-4g <sub>CPU ×1.00</sub> | **252 ms** <sub>244 ms–265 ms</sub> | **448 ms** <sub>441 ms–457 ms</sub> | **448 ms** <sub>441 ms–457 ms</sub> | **460 ms** <sub>453 ms–467 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |
| viewer, mid-phone, none <sub>CPU ×2.83</sub> | **217 ms** <sub>183 ms–225 ms</sub> | **508 ms** <sub>476 ms–561 ms</sub> | **508 ms** <sub>476 ms–561 ms</sub> | **521 ms** <sub>490 ms–576 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |
| viewer, mid-phone, 4g <sub>CPU ×2.83</sub> | **286 ms** <sub>282 ms–308 ms</sub> | **610 ms** <sub>574 ms–639 ms</sub> | **610 ms** <sub>574 ms–639 ms</sub> | **623 ms** <sub>587 ms–655 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |
| viewer, mid-phone, slow-4g <sub>CPU ×2.83</sub> | **361 ms** <sub>353 ms–370 ms</sub> | **665 ms** <sub>640 ms–686 ms</sub> | **665 ms** <sub>640 ms–686 ms</sub> | **682 ms** <sub>653 ms–700 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |
| viewer, slow-phone, none <sub>CPU ×4.11</sub> | **276 ms** <sub>269 ms–312 ms</sub> | **728 ms** <sub>675 ms–760 ms</sub> | **728 ms** <sub>675 ms–760 ms</sub> | **743 ms** <sub>691 ms–778 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |
| viewer, slow-phone, 4g <sub>CPU ×4.11</sub> | **385 ms** <sub>368 ms–391 ms</sub> | **829 ms** <sub>810 ms–869 ms</sub> | **829 ms** <sub>810 ms–869 ms</sub> | **845 ms** <sub>827 ms–888 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |
| viewer, slow-phone, slow-4g <sub>CPU ×4.11</sub> | **440 ms** <sub>434 ms–454 ms</sub> | **892 ms** <sub>857 ms–959 ms</sub> | **892 ms** <sub>857 ms–959 ms</sub> | **907 ms** <sub>872 ms–976 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |

## Where the time went, cold

The page's top-level steps (`cells:` measures), each the median of its runs: when it ended, from navigation, and in brackets how long it took. The trace layer breaks each one down.

| Step | viewer, desktop, none | viewer, desktop, 4g | viewer, desktop, slow-4g | viewer, mid-phone, none | viewer, mid-phone, 4g | viewer, mid-phone, slow-4g | viewer, slow-phone, none | viewer, slow-phone, 4g | viewer, slow-phone, slow-4g |
|---|---|---|---|---|---|---|---|---|---|
| `boot` | 74 ms <sub>(74 ms)</sub> | 592 ms <sub>(592 ms)</sub> | 2.84 s <sub>(2.84 s)</sub> | 155 ms <sub>(155 ms)</sub> | 655 ms <sub>(655 ms)</sub> | 2.89 s <sub>(2.89 s)</sub> | 194 ms <sub>(194 ms)</sub> | 694 ms <sub>(694 ms)</sub> | 2.93 s <sub>(2.93 s)</sub> |
| `fetch` | 96 ms <sub>(71 ms)</sub> | 608 ms <sub>(525 ms)</sub> | 2.85 s <sub>(2.67 s)</sub> | 239 ms <sub>(182 ms)</sub> | 721 ms <sub>(620 ms)</sub> | 2.96 s <sub>(2.77 s)</sub> | 294 ms <sub>(251 ms)</sub> | 799 ms <sub>(692 ms)</sub> | 3.03 s <sub>(2.83 s)</sub> |
| `wasm compile` | 56 ms <sub>(30 ms)</sub> | 935 ms <sub>(851 ms)</sub> | 4.75 s <sub>(4.57 s)</sub> | 104 ms <sub>(50 ms)</sub> | 971 ms <sub>(869 ms)</sub> | 4.78 s <sub>(4.59 s)</sub> | 117 ms <sub>(66 ms)</sub> | 992 ms <sub>(880 ms)</sub> | 4.80 s <sub>(4.60 s)</sub> |
| `wasm init` | 78 ms <sub>(3.7 ms)</sub> | 937 ms <sub>(341 ms)</sub> | 4.75 s <sub>(1.91 s)</sub> | 166 ms <sub>(11 ms)</sub> | 973 ms <sub>(318 ms)</sub> | 4.78 s <sub>(1.89 s)</sub> | 213 ms <sub>(16 ms)</sub> | 995 ms <sub>(306 ms)</sub> | 4.81 s <sub>(1.87 s)</sub> |
| `parser import` | 91 ms <sub>(17 ms)</sub> | 675 ms <sub>(84 ms)</sub> | 3.10 s <sub>(259 ms)</sub> | 236 ms <sub>(73 ms)</sub> | 750 ms <sub>(93 ms)</sub> | 3.16 s <sub>(263 ms)</sub> | 292 ms <sub>(99 ms)</sub> | 812 ms <sub>(121 ms)</sub> | 3.20 s <sub>(270 ms)</sub> |
| `app` | 88 ms <sub>(5.5 ms)</sub> | 606 ms <sub>(3.8 ms)</sub> | 2.85 s <sub>(4.3 ms)</sub> | 228 ms <sub>(44 ms)</sub> | 716 ms <sub>(40 ms)</sub> | 2.95 s <sub>(42 ms)</sub> | 280 ms <sub>(59 ms)</sub> | 779 ms <sub>(56 ms)</sub> | 3.02 s <sub>(61 ms)</sub> |
| `parse` | 117 ms <sub>(21 ms)</sub> | 695 ms <sub>(93 ms)</sub> | 3.12 s <sub>(262 ms)</sub> | 291 ms <sub>(52 ms)</sub> | 809 ms <sub>(87 ms)</sub> | 3.21 s <sub>(257 ms)</sub> | 381 ms <sub>(81 ms)</sub> | 889 ms <sub>(93 ms)</sub> | 3.29 s <sub>(252 ms)</sub> |
| `core` | 149 ms <sub>(29 ms)</sub> | 965 ms <sub>(268 ms)</sub> | 4.78 s <sub>(1.66 s)</sub> | 391 ms <sub>(88 ms)</sub> | 1.07 s <sub>(246 ms)</sub> | 4.87 s <sub>(1.65 s)</sub> | 526 ms <sub>(139 ms)</sub> | 1.14 s <sub>(255 ms)</sub> | 4.94 s <sub>(1.65 s)</sub> |
| `render` | 203 ms <sub>(55 ms)</sub> | 1.02 s <sub>(57 ms)</sub> | 4.83 s <sub>(49 ms)</sub> | 549 ms <sub>(149 ms)</sub> | 1.22 s <sub>(152 ms)</sub> | 5.00 s <sub>(139 ms)</sub> | 755 ms <sub>(229 ms)</sub> | 1.40 s <sub>(244 ms)</sub> | 5.15 s <sub>(217 ms)</sub> |

## Files, cold

Every file fetched, by the scenario it was fetched in: bytes on the wire (compressed) and when its last byte arrived, from navigation, each the median of its runs.

### viewer, desktop, none

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 3.0 ms |
| `/assets/index-[hash].css` | 2 KB | 23 ms |
| `/assets/react-[hash].js` | 4 KB | 25 ms |
| `/assets/index-[hash].js` | 54 KB | 28 ms |
| `/fixtures/homework.doenet` | 1 KB | 33 ms |
| `/assets/jsxgraph-[hash].js` | 196 KB | 37 ms |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 50 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 76 ms |

### viewer, desktop, 4g

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 64 ms |
| `/assets/index-[hash].css` | 2 KB | 148 ms |
| `/fixtures/homework.doenet` | 1 KB | 151 ms |
| `/assets/react-[hash].js` | 4 KB | 154 ms |
| `/assets/index-[hash].js` | 54 KB | 304 ms |
| `/assets/jsxgraph-[hash].js` | 196 KB | 570 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 671 ms |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 926 ms |

### viewer, desktop, slow-4g

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 157 ms |
| `/fixtures/homework.doenet` | 1 KB | 367 ms |
| `/assets/index-[hash].css` | 2 KB | 382 ms |
| `/assets/react-[hash].js` | 4 KB | 419 ms |
| `/assets/index-[hash].js` | 54 KB | 1.31 s |
| `/assets/jsxgraph-[hash].js` | 196 KB | 2.81 s |
| `/assets/entity-map-[hash].js` | 10 KB | 3.09 s |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 4.74 s |

### viewer, mid-phone, none

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 2.5 ms |
| `/assets/index-[hash].css` | 2 KB | 43 ms |
| `/assets/react-[hash].js` | 4 KB | 43 ms |
| `/assets/index-[hash].js` | 54 KB | 47 ms |
| `/assets/jsxgraph-[hash].js` | 196 KB | 50 ms |
| `/fixtures/homework.doenet` | 1 KB | 61 ms |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 71 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 159 ms |

### viewer, mid-phone, 4g

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 65 ms |
| `/assets/index-[hash].css` | 2 KB | 166 ms |
| `/fixtures/homework.doenet` | 1 KB | 171 ms |
| `/assets/react-[hash].js` | 4 KB | 174 ms |
| `/assets/index-[hash].js` | 54 KB | 321 ms |
| `/assets/jsxgraph-[hash].js` | 196 KB | 591 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 738 ms |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 946 ms |

### viewer, mid-phone, slow-4g

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 156 ms |
| `/fixtures/homework.doenet` | 1 KB | 382 ms |
| `/assets/index-[hash].css` | 2 KB | 396 ms |
| `/assets/react-[hash].js` | 4 KB | 433 ms |
| `/assets/index-[hash].js` | 54 KB | 1.33 s |
| `/assets/jsxgraph-[hash].js` | 196 KB | 2.83 s |
| `/assets/entity-map-[hash].js` | 10 KB | 3.15 s |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 4.75 s |

### viewer, slow-phone, none

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 3.0 ms |
| `/assets/index-[hash].css` | 2 KB | 49 ms |
| `/assets/react-[hash].js` | 4 KB | 49 ms |
| `/assets/index-[hash].js` | 54 KB | 52 ms |
| `/assets/jsxgraph-[hash].js` | 196 KB | 57 ms |
| `/fixtures/homework.doenet` | 1 KB | 58 ms |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 75 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 199 ms |

### viewer, slow-phone, 4g

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 66 ms |
| `/assets/index-[hash].css` | 2 KB | 178 ms |
| `/fixtures/homework.doenet` | 1 KB | 181 ms |
| `/assets/react-[hash].js` | 4 KB | 183 ms |
| `/assets/index-[hash].js` | 54 KB | 335 ms |
| `/assets/jsxgraph-[hash].js` | 196 KB | 596 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 777 ms |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 959 ms |

### viewer, slow-phone, slow-4g

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 157 ms |
| `/fixtures/homework.doenet` | 1 KB | 390 ms |
| `/assets/index-[hash].css` | 2 KB | 409 ms |
| `/assets/react-[hash].js` | 4 KB | 434 ms |
| `/assets/index-[hash].js` | 54 KB | 1.34 s |
| `/assets/jsxgraph-[hash].js` | 196 KB | 2.83 s |
| `/assets/entity-map-[hash].js` | 10 KB | 3.19 s |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 4.76 s |

## Measurements

| Column | What it is |
|---|---|
| First paint | The browser's first contentful paint. On the client-rendered pages this is the page's toolbar, not the document. |
| Readable | When the document can be read. For the client-rendered pages (`viewer`, `editor`), the end of the `render` step: React has committed the document and the boards have drawn. |
| Usable | When the document responds to input: the end of the `interactive` step where a page records one, else of the `render` step. |
| Largest paint | The browser's largest contentful paint: when the largest text block or image so far was painted. |
| Blocking | Total blocking time from readable to usable: each long task's time beyond 50 ms, the time the page could not respond to input. A dash where the page is usable the moment it is readable. |
| Layout shift | The sum of the layout shifts not caused by input, until usable. |
| Transferred | Bytes on the wire of every file fetched until usable, compressed as served; 0 for a file from the cache. |
