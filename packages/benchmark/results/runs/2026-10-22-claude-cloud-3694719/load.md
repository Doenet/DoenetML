# Load on devices: 2026-10-22-claude-cloud-3694719

Machine **claude-cloud** (Intel(R) Xeon(R) Processor, 4 cores, 16091 MB, Linux 6.18.44-fc-v140 x64, Node v22.22.0); commit `3694719`; 2026-10-22.

Builds: cells: wasm-pack --release (npm run build -w packages/cells-core).

How long a student waits for `homework` on each device: from navigation until the document can be read, and until it can be used. Each scenario loads a page of the cells viewer's build, served as a deployed host serves it, compressed, on a device: a CPU class calibrated on this machine, a network, and a phone's or desktop's screen. Times are medians of 5 runs, with the fastest and slowest under each. What every column means is under [Measurements](#measurements). How the layer works: [METHOD.md](../../../METHOD.md#the-load-layer).

## Devices

The calibration workload took **80 ms** on this machine, unthrottled (the fastest of its repetitions). A CPU class is the workload's time on that class; its throttling factor is that time over this machine's.

| Device | CPU class | Workload | Factor | Network | Screen |
|---|---|---|---|---|---|
| desktop | host | 80 ms | ×1.00 | none (not slowed) | 1000×800 at 1× |
| mid-phone | mid-phone | 320 ms | ×3.98 | 4g (60 ms, 9 Mbps down, 1.5 Mbps up) | 412×915 at 2.625×, mobile, touch |
| slow-phone | slow-phone | 480 ms | ×5.97 | slow-4g (150 ms, 1.6 Mbps down, 0.75 Mbps up) | 360×800 at 2×, mobile, touch |

The phones' workload times are provisional until measured on real phones (`src/devices.mjs`).

## Budget

The document readable within 300 ms of navigation on the slow-phone, on its own network, on a first visit.

| Page | Readable | Usable |
|---|---|---|
| viewer | ✗ **5.40 s** <sub>5.39 s–5.41 s</sub> | **5.40 s** <sub>5.39 s–5.41 s</sub> |

## Every scenario, cold

A first visit: a new browser profile, nothing cached.

| Page, device, network | First paint | Readable | Usable | Largest paint | Blocking | Layout shift | Transferred |
|---|---|---|---|---|---|---|---|
| viewer, desktop, none <sub>CPU ×1.00</sub> | **107 ms** <sub>99 ms–112 ms</sub> | **219 ms** <sub>210 ms–241 ms</sub> | **219 ms** <sub>210 ms–241 ms</sub> | **232 ms** <sub>220 ms–250 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **879 KB** <sub>879 KB–879 KB</sub> |
| viewer, desktop, 4g <sub>CPU ×1.00</sub> | **629 ms** <sub>624 ms–637 ms</sub> | **1.03 s** <sub>1.03 s–1.04 s</sub> | **1.03 s** <sub>1.03 s–1.04 s</sub> | **1.04 s** <sub>1.04 s–1.06 s</sub> | — | **0.000** <sub>0.000–0.000</sub> | **879 KB** <sub>879 KB–879 KB</sub> |
| viewer, desktop, slow-4g <sub>CPU ×1.00</sub> | **2.88 s** <sub>2.87 s–2.88 s</sub> | **4.84 s** <sub>4.84 s–4.86 s</sub> | **4.84 s** <sub>4.84 s–4.86 s</sub> | **4.85 s** <sub>4.85 s–4.87 s</sub> | — | **0.000** <sub>0.000–0.000</sub> | **879 KB** <sub>879 KB–879 KB</sub> |
| viewer, mid-phone, none <sub>CPU ×3.98</sub> | **308 ms** <sub>273 ms–334 ms</sub> | **774 ms** <sub>696 ms–823 ms</sub> | **774 ms** <sub>696 ms–823 ms</sub> | **791 ms** <sub>715 ms–843 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **879 KB** <sub>879 KB–879 KB</sub> |
| viewer, mid-phone, 4g <sub>CPU ×3.98</sub> | **812 ms** <sub>807 ms–829 ms</sub> | **1.39 s** <sub>1.35 s–1.42 s</sub> | **1.39 s** <sub>1.35 s–1.42 s</sub> | **1.41 s** <sub>1.36 s–1.44 s</sub> | — | **0.000** <sub>0.000–0.000</sub> | **879 KB** <sub>879 KB–879 KB</sub> |
| viewer, mid-phone, slow-4g <sub>CPU ×3.98</sub> | **3.05 s** <sub>3.04 s–3.07 s</sub> | **5.19 s** <sub>5.17 s–5.21 s</sub> | **5.19 s** <sub>5.17 s–5.21 s</sub> | **5.20 s** <sub>5.19 s–5.23 s</sub> | — | **0.000** <sub>0.000–0.000</sub> | **879 KB** <sub>879 KB–879 KB</sub> |
| viewer, slow-phone, none <sub>CPU ×5.97</sub> | **473 ms** <sub>405 ms–505 ms</sub> | **1.16 s** <sub>1.10 s–1.24 s</sub> | **1.16 s** <sub>1.10 s–1.24 s</sub> | **1.18 s** <sub>1.12 s–1.26 s</sub> | — | **0.000** <sub>0.000–0.000</sub> | **879 KB** <sub>879 KB–879 KB</sub> |
| viewer, slow-phone, 4g <sub>CPU ×5.97</sub> | **916 ms** <sub>885 ms–934 ms</sub> | **1.76 s** <sub>1.62 s–1.80 s</sub> | **1.76 s** <sub>1.62 s–1.80 s</sub> | **1.78 s** <sub>1.64 s–1.83 s</sub> | — | **0.000** <sub>0.000–0.000</sub> | **879 KB** <sub>879 KB–879 KB</sub> |
| viewer, slow-phone, slow-4g <sub>CPU ×5.97</sub> | **3.14 s** <sub>3.11 s–3.16 s</sub> | **5.40 s** <sub>5.39 s–5.41 s</sub> | **5.40 s** <sub>5.39 s–5.41 s</sub> | **5.43 s** <sub>5.41 s–5.45 s</sub> | — | **0.000** <sub>0.000–0.000</sub> | **879 KB** <sub>879 KB–879 KB</sub> |

## Every scenario, warm

A second visit: the same profile, the files in the HTTP cache.

| Page, device, network | First paint | Readable | Usable | Largest paint | Blocking | Layout shift | Transferred |
|---|---|---|---|---|---|---|---|
| viewer, desktop, none <sub>CPU ×1.00</sub> | **103 ms** <sub>89 ms–162 ms</sub> | **208 ms** <sub>199 ms–216 ms</sub> | **208 ms** <sub>199 ms–216 ms</sub> | **214 ms** <sub>161 ms–229 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |
| viewer, desktop, 4g <sub>CPU ×1.00</sub> | **162 ms** <sub>156 ms–244 ms</sub> | **273 ms** <sub>271 ms–281 ms</sub> | **273 ms** <sub>271 ms–281 ms</sub> | **282 ms** <sub>244 ms–292 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |
| viewer, desktop, slow-4g <sub>CPU ×1.00</sub> | **265 ms** <sub>249 ms–276 ms</sub> | **454 ms** <sub>435 ms–465 ms</sub> | **454 ms** <sub>435 ms–465 ms</sub> | **466 ms** <sub>444 ms–480 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |
| viewer, mid-phone, none <sub>CPU ×3.98</sub> | **299 ms** <sub>290 ms–329 ms</sub> | **768 ms** <sub>749 ms–804 ms</sub> | **768 ms** <sub>749 ms–804 ms</sub> | **786 ms** <sub>768 ms–822 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |
| viewer, mid-phone, 4g <sub>CPU ×3.98</sub> | **413 ms** <sub>368 ms–452 ms</sub> | **851 ms** <sub>796 ms–958 ms</sub> | **851 ms** <sub>796 ms–958 ms</sub> | **869 ms** <sub>814 ms–982 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |
| viewer, mid-phone, slow-4g <sub>CPU ×3.98</sub> | **489 ms** <sub>454 ms–498 ms</sub> | **946 ms** <sub>888 ms–971 ms</sub> | **946 ms** <sub>888 ms–971 ms</sub> | **964 ms** <sub>905 ms–990 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |
| viewer, slow-phone, none <sub>CPU ×5.97</sub> | **488 ms** <sub>450 ms–522 ms</sub> | **1.19 s** <sub>1.14 s–1.23 s</sub> | **1.19 s** <sub>1.14 s–1.23 s</sub> | **1.21 s** <sub>1.16 s–1.26 s</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |
| viewer, slow-phone, 4g <sub>CPU ×5.97</sub> | **597 ms** <sub>574 ms–607 ms</sub> | **1.30 s** <sub>1.24 s–1.34 s</sub> | **1.30 s** <sub>1.24 s–1.34 s</sub> | **1.33 s** <sub>1.26 s–1.35 s</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |
| viewer, slow-phone, slow-4g <sub>CPU ×5.97</sub> | **640 ms** <sub>616 ms–700 ms</sub> | **1.35 s** <sub>1.29 s–1.43 s</sub> | **1.35 s** <sub>1.29 s–1.43 s</sub> | **1.37 s** <sub>1.31 s–1.46 s</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |

## Where the time went, cold

The page's top-level steps (`cells:` measures), each the median of its runs: when it ended, from navigation, and in brackets how long it took. The trace layer breaks each one down.

| Step | viewer, desktop, none | viewer, desktop, 4g | viewer, desktop, slow-4g | viewer, mid-phone, none | viewer, mid-phone, 4g | viewer, mid-phone, slow-4g | viewer, slow-phone, none | viewer, slow-phone, 4g | viewer, slow-phone, slow-4g |
|---|---|---|---|---|---|---|---|---|---|
| `boot` | 79 ms <sub>(79 ms)</sub> | 602 ms <sub>(602 ms)</sub> | 2.85 s <sub>(2.85 s)</sub> | 200 ms <sub>(200 ms)</sub> | 699 ms <sub>(699 ms)</sub> | 2.94 s <sub>(2.94 s)</sub> | 305 ms <sub>(305 ms)</sub> | 758 ms <sub>(758 ms)</sub> | 2.98 s <sub>(2.98 s)</sub> |
| `fetch` | 107 ms <sub>(80 ms)</sub> | 623 ms <sub>(538 ms)</sub> | 2.86 s <sub>(2.69 s)</sub> | 322 ms <sub>(275 ms)</sub> | 818 ms <sub>(695 ms)</sub> | 3.05 s <sub>(2.84 s)</sub> | 498 ms <sub>(394 ms)</sub> | 947 ms <sub>(805 ms)</sub> | 3.14 s <sub>(2.93 s)</sub> |
| `wasm compile` | 60 ms <sub>(30 ms)</sub> | 946 ms <sub>(856 ms)</sub> | 4.76 s <sub>(4.58 s)</sub> | 119 ms <sub>(77 ms)</sub> | 995 ms <sub>(880 ms)</sub> | 4.82 s <sub>(4.60 s)</sub> | 194 ms <sub>(99 ms)</sub> | 1.16 s <sub>(1.02 s)</sub> | 4.84 s <sub>(4.61 s)</sub> |
| `wasm init` | 83 ms <sub>(4.0 ms)</sub> | 947 ms <sub>(342 ms)</sub> | 4.76 s <sub>(1.91 s)</sub> | 220 ms <sub>(16 ms)</sub> | 999 ms <sub>(301 ms)</sub> | 4.82 s <sub>(1.88 s)</sub> | 338 ms <sub>(25 ms)</sub> | 1.17 s <sub>(406 ms)</sub> | 4.85 s <sub>(1.86 s)</sub> |
| `parser import` | 106 ms <sub>(25 ms)</sub> | 688 ms <sub>(84 ms)</sub> | 3.10 s <sub>(259 ms)</sub> | 318 ms <sub>(103 ms)</sub> | 837 ms <sub>(126 ms)</sub> | 3.22 s <sub>(272 ms)</sub> | 480 ms <sub>(166 ms)</sub> | 974 ms <sub>(214 ms)</sub> | 3.26 s <sub>(279 ms)</sub> |
| `app` | 104 ms <sub>(13 ms)</sub> | 616 ms <sub>(8.1 ms)</sub> | 2.86 s <sub>(4.2 ms)</sub> | 306 ms <sub>(64 ms)</sub> | 796 ms <sub>(53 ms)</sub> | 3.05 s <sub>(62 ms)</sub> | 462 ms <sub>(94 ms)</sub> | 930 ms <sub>(117 ms)</sub> | 3.11 s <sub>(80 ms)</sub> |
| `parse` | 128 ms <sub>(20 ms)</sub> | 714 ms <sub>(84 ms)</sub> | 3.12 s <sub>(265 ms)</sub> | 404 ms <sub>(80 ms)</sub> | 917 ms <sub>(96 ms)</sub> | 3.30 s <sub>(243 ms)</sub> | 614 ms <sub>(123 ms)</sub> | 1.10 s <sub>(131 ms)</sub> | 3.40 s <sub>(259 ms)</sub> |
| `core` | 157 ms <sub>(30 ms)</sub> | 978 ms <sub>(267 ms)</sub> | 4.79 s <sub>(1.66 s)</sub> | 539 ms <sub>(143 ms)</sub> | 1.15 s <sub>(233 ms)</sub> | 4.96 s <sub>(1.65 s)</sub> | 804 ms <sub>(194 ms)</sub> | 1.37 s <sub>(276 ms)</sub> | 5.05 s <sub>(1.65 s)</sub> |
| `render` | 219 ms <sub>(56 ms)</sub> | 1.03 s <sub>(54 ms)</sub> | 4.84 s <sub>(53 ms)</sub> | 774 ms <sub>(240 ms)</sub> | 1.39 s <sub>(238 ms)</sub> | 5.19 s <sub>(228 ms)</sub> | 1.16 s <sub>(369 ms)</sub> | 1.76 s <sub>(359 ms)</sub> | 5.40 s <sub>(359 ms)</sub> |

## Files, cold

Every file fetched, by the scenario it was fetched in: bytes on the wire (compressed) and when its last byte arrived, from navigation, each the median of its runs.

### viewer, desktop, none

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 3.2 ms |
| `/assets/index-[hash].css` | 2 KB | 31 ms |
| `/assets/react-[hash].js` | 4 KB | 32 ms |
| `/assets/index-[hash].js` | 54 KB | 36 ms |
| `/fixtures/homework.doenet` | 1 KB | 36 ms |
| `/assets/jsxgraph-[hash].js` | 196 KB | 43 ms |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 52 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 82 ms |

### viewer, desktop, 4g

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 64 ms |
| `/assets/index-[hash].css` | 2 KB | 153 ms |
| `/fixtures/homework.doenet` | 1 KB | 158 ms |
| `/assets/react-[hash].js` | 4 KB | 163 ms |
| `/assets/index-[hash].js` | 54 KB | 315 ms |
| `/assets/jsxgraph-[hash].js` | 196 KB | 577 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 682 ms |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 938 ms |

### viewer, desktop, slow-4g

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 156 ms |
| `/fixtures/homework.doenet` | 1 KB | 367 ms |
| `/assets/index-[hash].css` | 2 KB | 381 ms |
| `/assets/react-[hash].js` | 4 KB | 419 ms |
| `/assets/index-[hash].js` | 54 KB | 1.32 s |
| `/assets/jsxgraph-[hash].js` | 196 KB | 2.82 s |
| `/assets/entity-map-[hash].js` | 10 KB | 3.10 s |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 4.75 s |

### viewer, mid-phone, none

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 2.3 ms |
| `/assets/react-[hash].js` | 4 KB | 47 ms |
| `/assets/index-[hash].css` | 2 KB | 48 ms |
| `/assets/index-[hash].js` | 54 KB | 52 ms |
| `/fixtures/homework.doenet` | 1 KB | 60 ms |
| `/assets/jsxgraph-[hash].js` | 196 KB | 64 ms |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 75 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 207 ms |

### viewer, mid-phone, 4g

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 65 ms |
| `/assets/index-[hash].css` | 2 KB | 180 ms |
| `/fixtures/homework.doenet` | 1 KB | 188 ms |
| `/assets/react-[hash].js` | 4 KB | 188 ms |
| `/assets/index-[hash].js` | 54 KB | 340 ms |
| `/assets/jsxgraph-[hash].js` | 196 KB | 600 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 781 ms |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 959 ms |

### viewer, mid-phone, slow-4g

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 157 ms |
| `/assets/index-[hash].css` | 2 KB | 412 ms |
| `/fixtures/homework.doenet` | 1 KB | 412 ms |
| `/assets/react-[hash].js` | 4 KB | 454 ms |
| `/assets/index-[hash].js` | 54 KB | 1.36 s |
| `/assets/jsxgraph-[hash].js` | 196 KB | 2.85 s |
| `/assets/entity-map-[hash].js` | 10 KB | 3.20 s |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 4.78 s |

### viewer, slow-phone, none

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 3.7 ms |
| `/assets/react-[hash].js` | 4 KB | 68 ms |
| `/assets/jsxgraph-[hash].js` | 196 KB | 71 ms |
| `/assets/index-[hash].js` | 54 KB | 73 ms |
| `/assets/index-[hash].css` | 2 KB | 76 ms |
| `/fixtures/homework.doenet` | 1 KB | 98 ms |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 107 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 313 ms |

### viewer, slow-phone, 4g

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 65 ms |
| `/assets/index-[hash].css` | 2 KB | 196 ms |
| `/assets/react-[hash].js` | 4 KB | 200 ms |
| `/fixtures/homework.doenet` | 1 KB | 208 ms |
| `/assets/index-[hash].js` | 54 KB | 349 ms |
| `/assets/jsxgraph-[hash].js` | 196 KB | 617 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 843 ms |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 977 ms |

### viewer, slow-phone, slow-4g

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 157 ms |
| `/fixtures/homework.doenet` | 1 KB | 415 ms |
| `/assets/index-[hash].css` | 2 KB | 419 ms |
| `/assets/react-[hash].js` | 4 KB | 456 ms |
| `/assets/index-[hash].js` | 54 KB | 1.36 s |
| `/assets/jsxgraph-[hash].js` | 196 KB | 2.86 s |
| `/assets/entity-map-[hash].js` | 10 KB | 3.24 s |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 4.78 s |

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
