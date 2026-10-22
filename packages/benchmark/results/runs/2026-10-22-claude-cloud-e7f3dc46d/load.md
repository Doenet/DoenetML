# Load on devices: 2026-10-22-claude-cloud-e7f3dc46d

Machine **claude-cloud** (Intel(R) Xeon(R) Processor, 4 cores, 16091 MB, Linux 6.18.44-fc-v140 x64, Node v22.22.0); commit `e7f3dc46d`; 2026-10-22.

Builds: cells: wasm-pack --release (npm run build -w packages/cells-core).

How long a student waits for `homework` on each device: from navigation until the document can be read, and until it can be used. Each scenario loads a page of the cells viewer's build, served as a deployed host serves it, compressed, on a device: a CPU class calibrated on this machine, a network, and a phone's or desktop's screen. Times are medians of 5 runs, with the fastest and slowest under each. What every column means is under [Measurements](#measurements). How the layer works: [METHOD.md](../../../METHOD.md#the-load-layer).

## Devices

The calibration workload took **76 ms** on this machine, unthrottled (the median of 9 rounds' fastest repetitions, which ranged 71 ms–81 ms). A CPU class is the workload's time on that class. Its factor is the throttling at which the workload takes that time, found by timing it throttled and fitting the timings; Achieved is the workload's time at that factor, timed again, a check that carries the noise of one throttled timing.

| Device | CPU class | Workload | Factor | Achieved | Network | Screen |
|---|---|---|---|---|---|---|
| desktop | host | 76 ms | ×1.00 | 76 ms | none (not slowed) | 1000×800 at 1× |
| mid-phone | mid-phone | 320 ms | ×2.55 | 328 ms | 4g (60 ms, 9 Mbps down, 1.5 Mbps up) | 412×915 at 2.625×, mobile, touch |
| slow-phone | slow-phone | 480 ms | ×4.02 | 508 ms | slow-4g (150 ms, 1.6 Mbps down, 0.75 Mbps up) | 360×800 at 2×, mobile, touch |

After the run the workload took 76 ms on this machine, -1.2% against the calibration, within the run's tolerance.

The phones' workload times are provisional until measured on real phones (`src/devices.mjs`).

## Budget

The document readable within 300 ms of navigation on the slow-phone, on its own network, on a first visit.

| Page | Readable | Usable |
|---|---|---|
| viewer | ✗ **5.18 s** <sub>5.15 s–5.24 s</sub> | **5.18 s** <sub>5.15 s–5.24 s</sub> |
| prerendered | ✓ **251 ms** <sub>240 ms–272 ms</sub> | **5.13 s** <sub>5.11 s–5.17 s</sub> |

## Every scenario, cold

A first visit: a new browser profile, nothing cached.

| Page, device, network | First paint | Readable | Usable | Largest paint | Blocking | Layout shift | Transferred |
|---|---|---|---|---|---|---|---|
| viewer, desktop, none <sub>CPU ×1.00</sub> | **104 ms** <sub>101 ms–149 ms</sub> | **214 ms** <sub>196 ms–236 ms</sub> | **214 ms** <sub>196 ms–236 ms</sub> | **227 ms** <sub>149 ms–245 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **881 KB** <sub>881 KB–881 KB</sub> |
| viewer, desktop, 4g <sub>CPU ×1.00</sub> | **621 ms** <sub>612 ms–626 ms</sub> | **1.03 s** <sub>1.02 s–1.09 s</sub> | **1.03 s** <sub>1.02 s–1.09 s</sub> | **1.04 s** <sub>1.03 s–1.10 s</sub> | — | **0.000** <sub>0.000–0.000</sub> | **881 KB** <sub>881 KB–881 KB</sub> |
| viewer, desktop, slow-4g <sub>CPU ×1.00</sub> | **2.87 s** <sub>2.87 s–2.88 s</sub> | **4.85 s** <sub>4.85 s–4.86 s</sub> | **4.85 s** <sub>4.85 s–4.86 s</sub> | **4.86 s** <sub>4.86 s–4.87 s</sub> | — | **0.000** <sub>0.000–0.000</sub> | **881 KB** <sub>881 KB–881 KB</sub> |
| viewer, mid-phone, none <sub>CPU ×2.55</sub> | **216 ms** <sub>199 ms–220 ms</sub> | **496 ms** <sub>473 ms–521 ms</sub> | **496 ms** <sub>473 ms–521 ms</sub> | **511 ms** <sub>487 ms–537 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **881 KB** <sub>881 KB–881 KB</sub> |
| viewer, mid-phone, 4g <sub>CPU ×2.55</sub> | **696 ms** <sub>690 ms–709 ms</sub> | **1.18 s** <sub>1.18 s–1.19 s</sub> | **1.18 s** <sub>1.18 s–1.19 s</sub> | **1.20 s** <sub>1.19 s–1.20 s</sub> | — | **0.000** <sub>0.000–0.000</sub> | **881 KB** <sub>881 KB–881 KB</sub> |
| viewer, mid-phone, slow-4g <sub>CPU ×2.55</sub> | **2.95 s** <sub>2.92 s–2.96 s</sub> | **5.01 s** <sub>4.99 s–5.02 s</sub> | **5.01 s** <sub>4.99 s–5.02 s</sub> | **5.02 s** <sub>5.00 s–5.04 s</sub> | — | **0.000** <sub>0.000–0.000</sub> | **881 KB** <sub>881 KB–881 KB</sub> |
| viewer, slow-phone, none <sub>CPU ×4.02</sub> | **297 ms** <sub>261 ms–341 ms</sub> | **738 ms** <sub>694 ms–797 ms</sub> | **738 ms** <sub>694 ms–797 ms</sub> | **756 ms** <sub>709 ms–812 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **881 KB** <sub>881 KB–881 KB</sub> |
| viewer, slow-phone, 4g <sub>CPU ×4.02</sub> | **786 ms** <sub>780 ms–832 ms</sub> | **1.36 s** <sub>1.35 s–1.38 s</sub> | **1.36 s** <sub>1.35 s–1.38 s</sub> | **1.38 s** <sub>1.37 s–1.40 s</sub> | — | **0.000** <sub>0.000–0.000</sub> | **881 KB** <sub>881 KB–881 KB</sub> |
| viewer, slow-phone, slow-4g <sub>CPU ×4.02</sub> | **3.01 s** <sub>3.01 s–3.05 s</sub> | **5.18 s** <sub>5.15 s–5.24 s</sub> | **5.18 s** <sub>5.15 s–5.24 s</sub> | **5.20 s** <sub>5.17 s–5.26 s</sub> | — | **0.000** <sub>0.000–0.000</sub> | **881 KB** <sub>881 KB–881 KB</sub> |
| prerendered, desktop, none <sub>CPU ×1.00</sub> | **56 ms** <sub>50 ms–64 ms</sub> | **56 ms** <sub>50 ms–64 ms</sub> | **201 ms** <sub>188 ms–209 ms</sub> | **56 ms** <sub>50 ms–64 ms</sub> | **8.0 ms** <sub>2.0 ms–14 ms</sub> | **0.000** <sub>0.000–0.000</sub> | **875 KB** <sub>875 KB–875 KB</sub> |
| prerendered, desktop, 4g <sub>CPU ×1.00</sub> | **100 ms** <sub>93 ms–111 ms</sub> | **100 ms** <sub>93 ms–111 ms</sub> | **1.02 s** <sub>1.01 s–1.03 s</sub> | **100 ms** <sub>93 ms–111 ms</sub> | **2.0 ms** <sub>0.0 ms–4.0 ms</sub> | **0.000** <sub>0.000–0.000</sub> | **875 KB** <sub>875 KB–875 KB</sub> |
| prerendered, desktop, slow-4g <sub>CPU ×1.00</sub> | **188 ms** <sub>188 ms–206 ms</sub> | **188 ms** <sub>188 ms–206 ms</sub> | **4.81 s** <sub>4.81 s–4.83 s</sub> | **188 ms** <sub>188 ms–206 ms</sub> | **4.0 ms** <sub>0.0 ms–21 ms</sub> | **0.000** <sub>0.000–0.000</sub> | **875 KB** <sub>875 KB–875 KB</sub> |
| prerendered, mid-phone, none <sub>CPU ×2.55</sub> | **84 ms** <sub>75 ms–104 ms</sub> | **84 ms** <sub>75 ms–104 ms</sub> | **468 ms** <sub>431 ms–486 ms</sub> | **84 ms** <sub>75 ms–104 ms</sub> | **174 ms** <sub>162 ms–196 ms</sub> | **0.000** <sub>0.000–0.000</sub> | **875 KB** <sub>875 KB–875 KB</sub> |
| prerendered, mid-phone, 4g <sub>CPU ×2.55</sub> | **128 ms** <sub>120 ms–132 ms</sub> | **128 ms** <sub>120 ms–132 ms</sub> | **1.19 s** <sub>1.18 s–1.21 s</sub> | **128 ms** <sub>120 ms–132 ms</sub> | **158 ms** <sub>142 ms–176 ms</sub> | **0.000** <sub>0.000–0.000</sub> | **875 KB** <sub>875 KB–875 KB</sub> |
| prerendered, mid-phone, slow-4g <sub>CPU ×2.55</sub> | **220 ms** <sub>217 ms–223 ms</sub> | **220 ms** <sub>217 ms–223 ms</sub> | **4.98 s** <sub>4.97 s–5.00 s</sub> | **220 ms** <sub>217 ms–223 ms</sub> | **169 ms** <sub>151 ms–180 ms</sub> | **0.000** <sub>0.000–0.000</sub> | **875 KB** <sub>875 KB–875 KB</sub> |
| prerendered, slow-phone, none <sub>CPU ×4.02</sub> | **122 ms** <sub>82 ms–160 ms</sub> | **122 ms** <sub>82 ms–160 ms</sub> | **700 ms** <sub>688 ms–718 ms</sub> | **122 ms** <sub>82 ms–160 ms</sub> | **360 ms** <sub>348 ms–393 ms</sub> | **0.000** <sub>0.000–0.000</sub> | **875 KB** <sub>875 KB–875 KB</sub> |
| prerendered, slow-phone, 4g <sub>CPU ×4.02</sub> | **150 ms** <sub>132 ms–196 ms</sub> | **150 ms** <sub>132 ms–196 ms</sub> | **1.32 s** <sub>1.31 s–1.35 s</sub> | **150 ms** <sub>132 ms–196 ms</sub> | **333 ms** <sub>329 ms–357 ms</sub> | **0.000** <sub>0.000–0.000</sub> | **875 KB** <sub>875 KB–875 KB</sub> |
| prerendered, slow-phone, slow-4g <sub>CPU ×4.02</sub> | **251 ms** <sub>240 ms–272 ms</sub> | **251 ms** <sub>240 ms–272 ms</sub> | **5.13 s** <sub>5.11 s–5.17 s</sub> | **251 ms** <sub>240 ms–272 ms</sub> | **365 ms** <sub>342 ms–396 ms</sub> | **0.000** <sub>0.000–0.000</sub> | **875 KB** <sub>875 KB–875 KB</sub> |

## Every scenario, warm

A second visit: the same profile, the files in the HTTP cache.

| Page, device, network | First paint | Readable | Usable | Largest paint | Blocking | Layout shift | Transferred |
|---|---|---|---|---|---|---|---|
| viewer, desktop, none <sub>CPU ×1.00</sub> | **143 ms** <sub>79 ms–198 ms</sub> | **191 ms** <sub>186 ms–219 ms</sub> | **191 ms** <sub>186 ms–219 ms</sub> | **167 ms** <sub>139 ms–207 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |
| viewer, desktop, 4g <sub>CPU ×1.00</sub> | **162 ms** <sub>155 ms–170 ms</sub> | **257 ms** <sub>254 ms–273 ms</sub> | **257 ms** <sub>254 ms–273 ms</sub> | **267 ms** <sub>262 ms–282 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |
| viewer, desktop, slow-4g <sub>CPU ×1.00</sub> | **266 ms** <sub>261 ms–272 ms</sub> | **465 ms** <sub>446 ms–477 ms</sub> | **465 ms** <sub>446 ms–477 ms</sub> | **473 ms** <sub>454 ms–488 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |
| viewer, mid-phone, none <sub>CPU ×2.55</sub> | **194 ms** <sub>185 ms–202 ms</sub> | **480 ms** <sub>457 ms–498 ms</sub> | **480 ms** <sub>457 ms–498 ms</sub> | **492 ms** <sub>469 ms–510 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |
| viewer, mid-phone, 4g <sub>CPU ×2.55</sub> | **272 ms** <sub>264 ms–290 ms</sub> | **560 ms** <sub>525 ms–568 ms</sub> | **560 ms** <sub>525 ms–568 ms</sub> | **573 ms** <sub>537 ms–581 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |
| viewer, mid-phone, slow-4g <sub>CPU ×2.55</sub> | **360 ms** <sub>352 ms–391 ms</sub> | **624 ms** <sub>601 ms–687 ms</sub> | **624 ms** <sub>601 ms–687 ms</sub> | **639 ms** <sub>616 ms–703 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |
| viewer, slow-phone, none <sub>CPU ×4.02</sub> | **298 ms** <sub>276 ms–335 ms</sub> | **771 ms** <sub>699 ms–786 ms</sub> | **771 ms** <sub>699 ms–786 ms</sub> | **790 ms** <sub>715 ms–806 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |
| viewer, slow-phone, 4g <sub>CPU ×4.02</sub> | **373 ms** <sub>372 ms–392 ms</sub> | **838 ms** <sub>821 ms–869 ms</sub> | **838 ms** <sub>821 ms–869 ms</sub> | **856 ms** <sub>842 ms–885 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |
| viewer, slow-phone, slow-4g <sub>CPU ×4.02</sub> | **473 ms** <sub>454 ms–509 ms</sub> | **924 ms** <sub>891 ms–952 ms</sub> | **924 ms** <sub>891 ms–952 ms</sub> | **943 ms** <sub>908 ms–969 ms</sub> | — | **0.000** <sub>0.000–0.000</sub> | **2 KB** <sub>2 KB–2 KB</sub> |
| prerendered, desktop, none <sub>CPU ×1.00</sub> | **59 ms** <sub>45 ms–61 ms</sub> | **59 ms** <sub>45 ms–61 ms</sub> | **198 ms** <sub>184 ms–216 ms</sub> | **59 ms** <sub>45 ms–61 ms</sub> | **6.0 ms** <sub>1.0 ms–18 ms</sub> | **0.000** <sub>0.000–0.000</sub> | **3 KB** <sub>3 KB–3 KB</sub> |
| prerendered, desktop, 4g <sub>CPU ×1.00</sub> | **119 ms** <sub>114 ms–174 ms</sub> | **119 ms** <sub>114 ms–174 ms</sub> | **269 ms** <sub>256 ms–308 ms</sub> | **119 ms** <sub>114 ms–174 ms</sub> | **7.0 ms** <sub>2.0 ms–18 ms</sub> | **0.000** <sub>0.000–0.000</sub> | **3 KB** <sub>3 KB–3 KB</sub> |
| prerendered, desktop, slow-4g <sub>CPU ×1.00</sub> | **209 ms** <sub>204 ms–211 ms</sub> | **209 ms** <sub>204 ms–211 ms</sub> | **368 ms** <sub>340 ms–368 ms</sub> | **209 ms** <sub>204 ms–211 ms</sub> | **12 ms** <sub>0.0 ms–19 ms</sub> | **0.000** <sub>0.000–0.000</sub> | **3 KB** <sub>3 KB–3 KB</sub> |
| prerendered, mid-phone, none <sub>CPU ×2.55</sub> | **78 ms** <sub>71 ms–92 ms</sub> | **78 ms** <sub>71 ms–92 ms</sub> | **453 ms** <sub>442 ms–492 ms</sub> | **78 ms** <sub>71 ms–92 ms</sub> | **177 ms** <sub>169 ms–197 ms</sub> | **0.000** <sub>0.000–0.000</sub> | **3 KB** <sub>3 KB–3 KB</sub> |
| prerendered, mid-phone, 4g <sub>CPU ×2.55</sub> | **144 ms** <sub>130 ms–150 ms</sub> | **144 ms** <sub>130 ms–150 ms</sub> | **535 ms** <sub>518 ms–548 ms</sub> | **144 ms** <sub>130 ms–150 ms</sub> | **170 ms** <sub>162 ms–202 ms</sub> | **0.000** <sub>0.000–0.000</sub> | **3 KB** <sub>3 KB–3 KB</sub> |
| prerendered, mid-phone, slow-4g <sub>CPU ×2.55</sub> | **232 ms** <sub>228 ms–256 ms</sub> | **232 ms** <sub>228 ms–256 ms</sub> | **630 ms** <sub>611 ms–681 ms</sub> | **232 ms** <sub>228 ms–256 ms</sub> | **178 ms** <sub>167 ms–209 ms</sub> | **0.000** <sub>0.000–0.000</sub> | **3 KB** <sub>3 KB–3 KB</sub> |
| prerendered, slow-phone, none <sub>CPU ×4.02</sub> | **110 ms** <sub>89 ms–120 ms</sub> | **110 ms** <sub>89 ms–120 ms</sub> | **710 ms** <sub>673 ms–718 ms</sub> | **110 ms** <sub>89 ms–120 ms</sub> | **380 ms** <sub>346 ms–387 ms</sub> | **0.000** <sub>0.000–0.000</sub> | **3 KB** <sub>3 KB–3 KB</sub> |
| prerendered, slow-phone, 4g <sub>CPU ×4.02</sub> | **164 ms** <sub>150 ms–179 ms</sub> | **164 ms** <sub>150 ms–179 ms</sub> | **767 ms** <sub>745 ms–809 ms</sub> | **164 ms** <sub>150 ms–179 ms</sub> | **358 ms** <sub>336 ms–394 ms</sub> | **0.000** <sub>0.000–0.000</sub> | **3 KB** <sub>3 KB–3 KB</sub> |
| prerendered, slow-phone, slow-4g <sub>CPU ×4.02</sub> | **275 ms** <sub>246 ms–316 ms</sub> | **275 ms** <sub>246 ms–316 ms</sub> | **869 ms** <sub>858 ms–890 ms</sub> | **275 ms** <sub>246 ms–316 ms</sub> | **370 ms** <sub>360 ms–389 ms</sub> | **0.000** <sub>0.000–0.000</sub> | **3 KB** <sub>3 KB–3 KB</sub> |

## Where the time went, cold

The page's top-level steps (`cells:` measures), each the median of its runs: when it ended, from navigation, and in brackets how long it took. The trace layer breaks each one down.

| Step | viewer, desktop, none | viewer, desktop, 4g | viewer, desktop, slow-4g | viewer, mid-phone, none | viewer, mid-phone, 4g | viewer, mid-phone, slow-4g | viewer, slow-phone, none | viewer, slow-phone, 4g | viewer, slow-phone, slow-4g | prerendered, desktop, none | prerendered, desktop, 4g | prerendered, desktop, slow-4g | prerendered, mid-phone, none | prerendered, mid-phone, 4g | prerendered, mid-phone, slow-4g | prerendered, slow-phone, none | prerendered, slow-phone, 4g | prerendered, slow-phone, slow-4g |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `boot` | 78 ms <sub>(78 ms)</sub> | 589 ms <sub>(589 ms)</sub> | 2.85 s <sub>(2.85 s)</sub> | 148 ms <sub>(148 ms)</sub> | 643 ms <sub>(643 ms)</sub> | 2.89 s <sub>(2.89 s)</sub> | 207 ms <sub>(207 ms)</sub> | 690 ms <sub>(690 ms)</sub> | 2.93 s <sub>(2.93 s)</sub> | 81 ms <sub>(81 ms)</sub> | 607 ms <sub>(607 ms)</sub> | 2.87 s <sub>(2.87 s)</sub> | 152 ms <sub>(152 ms)</sub> | 654 ms <sub>(654 ms)</sub> | 2.92 s <sub>(2.92 s)</sub> | 221 ms <sub>(221 ms)</sub> | 681 ms <sub>(681 ms)</sub> | 2.97 s <sub>(2.97 s)</sub> |
| `fetch` | 101 ms <sub>(83 ms)</sub> | 610 ms <sub>(521 ms)</sub> | 2.86 s <sub>(2.68 s)</sub> | 224 ms <sub>(180 ms)</sub> | 698 ms <sub>(604 ms)</sub> | 2.95 s <sub>(2.76 s)</sub> | 300 ms <sub>(246 ms)</sub> | 795 ms <sub>(690 ms)</sub> | 3.01 s <sub>(2.81 s)</sub> | — | — | — | — | — | — | — | — | — |
| `wasm compile` | 62 ms <sub>(43 ms)</sub> | 935 ms <sub>(855 ms)</sub> | 4.77 s <sub>(4.59 s)</sub> | 103 ms <sub>(55 ms)</sub> | 969 ms <sub>(866 ms)</sub> | 4.80 s <sub>(4.61 s)</sub> | 132 ms <sub>(66 ms)</sub> | 993 ms <sub>(886 ms)</sub> | 4.82 s <sub>(4.62 s)</sub> | 64 ms <sub>(41 ms)</sub> | 932 ms <sub>(850 ms)</sub> | 4.73 s <sub>(4.55 s)</sub> | 105 ms <sub>(64 ms)</sub> | 963 ms <sub>(862 ms)</sub> | 4.75 s <sub>(4.56 s)</sub> | 128 ms <sub>(86 ms)</sub> | 987 ms <sub>(876 ms)</sub> | 4.77 s <sub>(4.57 s)</sub> |
| `wasm init` | 82 ms <sub>(3.9 ms)</sub> | 937 ms <sub>(345 ms)</sub> | 4.77 s <sub>(1.93 s)</sub> | 167 ms <sub>(12 ms)</sub> | 971 ms <sub>(328 ms)</sub> | 4.80 s <sub>(1.91 s)</sub> | 224 ms <sub>(17 ms)</sub> | 997 ms <sub>(310 ms)</sub> | 4.83 s <sub>(1.90 s)</sub> | 83 ms <sub>(1.9 ms)</sub> | 933 ms <sub>(324 ms)</sub> | 4.73 s <sub>(1.85 s)</sub> | 157 ms <sub>(4.8 ms)</sub> | 966 ms <sub>(310 ms)</sub> | 4.76 s <sub>(1.84 s)</sub> | 229 ms <sub>(7.9 ms)</sub> | 990 ms <sub>(304 ms)</sub> | 4.78 s <sub>(1.81 s)</sub> |
| `parser import` | 99 ms <sub>(21 ms)</sub> | 673 ms <sub>(85 ms)</sub> | 3.10 s <sub>(261 ms)</sub> | 223 ms <sub>(65 ms)</sub> | 737 ms <sub>(91 ms)</sub> | 3.16 s <sub>(266 ms)</sub> | 283 ms <sub>(97 ms)</sub> | 813 ms <sub>(122 ms)</sub> | 3.20 s <sub>(268 ms)</sub> | 87 ms <sub>(7.5 ms)</sub> | 613 ms <sub>(7.1 ms)</sub> | 2.88 s <sub>(6.7 ms)</sub> | 174 ms <sub>(18 ms)</sub> | 674 ms <sub>(21 ms)</sub> | 2.94 s <sub>(20 ms)</sub> | 271 ms <sub>(35 ms)</sub> | 753 ms <sub>(72 ms)</sub> | 3.00 s <sub>(29 ms)</sub> |
| `app` | 96 ms <sub>(8.8 ms)</sub> | 601 ms <sub>(3.6 ms)</sub> | 2.86 s <sub>(4.0 ms)</sub> | 215 ms <sub>(38 ms)</sub> | 695 ms <sub>(37 ms)</sub> | 2.95 s <sub>(38 ms)</sub> | 273 ms <sub>(52 ms)</sub> | 786 ms <sub>(65 ms)</sub> | 3.01 s <sub>(56 ms)</sub> | — | — | — | — | — | — | — | — | — |
| `parse` | 125 ms <sub>(20 ms)</sub> | 697 ms <sub>(93 ms)</sub> | 3.12 s <sub>(267 ms)</sub> | 272 ms <sub>(48 ms)</sub> | 785 ms <sub>(77 ms)</sub> | 3.21 s <sub>(258 ms)</sub> | 386 ms <sub>(83 ms)</sub> | 897 ms <sub>(98 ms)</sub> | 3.28 s <sub>(256 ms)</sub> | 108 ms <sub>(29 ms)</sub> | 635 ms <sub>(30 ms)</sub> | 2.91 s <sub>(31 ms)</sub> | 223 ms <sub>(68 ms)</sub> | 726 ms <sub>(70 ms)</sub> | 2.99 s <sub>(69 ms)</sub> | 344 ms <sub>(112 ms)</sub> | 831 ms <sub>(148 ms)</sub> | 3.08 s <sub>(105 ms)</sub> |
| `core` | 153 ms <sub>(29 ms)</sub> | 977 ms <sub>(285 ms)</sub> | 4.80 s <sub>(1.67 s)</sub> | 353 ms <sub>(78 ms)</sub> | 1.05 s <sub>(267 ms)</sub> | 4.87 s <sub>(1.66 s)</sub> | 510 ms <sub>(132 ms)</sub> | 1.14 s <sub>(228 ms)</sub> | 4.96 s <sub>(1.69 s)</sub> | 137 ms <sub>(30 ms)</sub> | 962 ms <sub>(322 ms)</sub> | 4.76 s <sub>(1.85 s)</sub> | 291 ms <sub>(77 ms)</sub> | 1.05 s <sub>(323 ms)</sub> | 4.84 s <sub>(1.84 s)</sub> | 465 ms <sub>(121 ms)</sub> | 1.11 s <sub>(284 ms)</sub> | 4.90 s <sub>(1.82 s)</sub> |
| `render` | 214 ms <sub>(55 ms)</sub> | 1.03 s <sub>(53 ms)</sub> | 4.85 s <sub>(53 ms)</sub> | 496 ms <sub>(143 ms)</sub> | 1.18 s <sub>(132 ms)</sub> | 5.01 s <sub>(131 ms)</sub> | 738 ms <sub>(221 ms)</sub> | 1.36 s <sub>(229 ms)</sub> | 5.18 s <sub>(231 ms)</sub> | 201 ms <sub>(61 ms)</sub> | 1.02 s <sub>(55 ms)</sub> | 4.81 s <sub>(56 ms)</sub> | 467 ms <sub>(166 ms)</sub> | 1.19 s <sub>(141 ms)</sub> | 4.98 s <sub>(152 ms)</sub> | 699 ms <sub>(238 ms)</sub> | 1.32 s <sub>(214 ms)</sub> | 5.13 s <sub>(228 ms)</sub> |
| `interactive` | — | — | — | — | — | — | — | — | — | 201 ms <sub>(62 ms)</sub> | 1.02 s <sub>(55 ms)</sub> | 4.81 s <sub>(57 ms)</sub> | 468 ms <sub>(166 ms)</sub> | 1.19 s <sub>(142 ms)</sub> | 4.98 s <sub>(153 ms)</sub> | 700 ms <sub>(239 ms)</sub> | 1.32 s <sub>(215 ms)</sub> | 5.13 s <sub>(230 ms)</sub> |

## Files, cold

Every file fetched, by the scenario it was fetched in: bytes on the wire (compressed) and when its last byte arrived, from navigation, each the median of its runs.

### viewer, desktop, none

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 2.6 ms |
| `/assets/document-[hash].css` | 1 KB | 21 ms |
| `/assets/index-[hash].css` | 1 KB | 23 ms |
| `/assets/react-[hash].js` | 4 KB | 23 ms |
| `/assets/index-[hash].js` | 22 KB | 26 ms |
| `/assets/document-[hash].js` | 65 KB | 30 ms |
| `/assets/jsxgraph-[hash].js` | 196 KB | 38 ms |
| `/fixtures/homework.doenet` | 1 KB | 38 ms |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 52 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 81 ms |

### viewer, desktop, 4g

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 64 ms |
| `/assets/document-[hash].css` | 1 KB | 139 ms |
| `/assets/index-[hash].css` | 1 KB | 142 ms |
| `/assets/react-[hash].js` | 4 KB | 154 ms |
| `/fixtures/homework.doenet` | 1 KB | 209 ms |
| `/assets/index-[hash].js` | 22 KB | 248 ms |
| `/assets/document-[hash].js` | 65 KB | 332 ms |
| `/assets/jsxgraph-[hash].js` | 196 KB | 564 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 669 ms |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 927 ms |

### viewer, desktop, slow-4g

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 157 ms |
| `/assets/document-[hash].css` | 1 KB | 337 ms |
| `/assets/index-[hash].css` | 1 KB | 345 ms |
| `/assets/react-[hash].js` | 4 KB | 411 ms |
| `/fixtures/homework.doenet` | 1 KB | 525 ms |
| `/assets/index-[hash].js` | 22 KB | 847 ms |
| `/assets/document-[hash].js` | 65 KB | 1.51 s |
| `/assets/jsxgraph-[hash].js` | 196 KB | 2.82 s |
| `/assets/entity-map-[hash].js` | 10 KB | 3.10 s |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 4.76 s |

### viewer, mid-phone, none

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 2.2 ms |
| `/assets/react-[hash].js` | 4 KB | 37 ms |
| `/assets/document-[hash].css` | 1 KB | 37 ms |
| `/assets/index-[hash].js` | 22 KB | 40 ms |
| `/assets/index-[hash].css` | 1 KB | 42 ms |
| `/assets/document-[hash].js` | 65 KB | 43 ms |
| `/assets/jsxgraph-[hash].js` | 196 KB | 47 ms |
| `/fixtures/homework.doenet` | 1 KB | 53 ms |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 68 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 153 ms |

### viewer, mid-phone, 4g

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 64 ms |
| `/assets/document-[hash].css` | 1 KB | 160 ms |
| `/assets/index-[hash].css` | 1 KB | 161 ms |
| `/assets/react-[hash].js` | 4 KB | 171 ms |
| `/fixtures/homework.doenet` | 1 KB | 227 ms |
| `/assets/index-[hash].js` | 22 KB | 267 ms |
| `/assets/document-[hash].js` | 65 KB | 348 ms |
| `/assets/jsxgraph-[hash].js` | 196 KB | 583 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 723 ms |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 944 ms |

### viewer, mid-phone, slow-4g

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 158 ms |
| `/assets/document-[hash].css` | 1 KB | 352 ms |
| `/assets/index-[hash].css` | 1 KB | 360 ms |
| `/assets/react-[hash].js` | 4 KB | 427 ms |
| `/fixtures/homework.doenet` | 1 KB | 539 ms |
| `/assets/index-[hash].js` | 22 KB | 864 ms |
| `/assets/document-[hash].js` | 65 KB | 1.53 s |
| `/assets/jsxgraph-[hash].js` | 196 KB | 2.83 s |
| `/assets/entity-map-[hash].js` | 10 KB | 3.15 s |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 4.78 s |

### viewer, slow-phone, none

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 4.0 ms |
| `/assets/index-[hash].js` | 22 KB | 51 ms |
| `/assets/react-[hash].js` | 4 KB | 51 ms |
| `/assets/document-[hash].css` | 1 KB | 51 ms |
| `/assets/index-[hash].css` | 1 KB | 52 ms |
| `/assets/document-[hash].js` | 65 KB | 54 ms |
| `/assets/jsxgraph-[hash].js` | 196 KB | 58 ms |
| `/fixtures/homework.doenet` | 1 KB | 64 ms |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 76 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 213 ms |

### viewer, slow-phone, 4g

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 65 ms |
| `/assets/document-[hash].css` | 1 KB | 167 ms |
| `/assets/index-[hash].css` | 1 KB | 167 ms |
| `/assets/react-[hash].js` | 4 KB | 179 ms |
| `/fixtures/homework.doenet` | 1 KB | 233 ms |
| `/assets/index-[hash].js` | 22 KB | 278 ms |
| `/assets/document-[hash].js` | 65 KB | 357 ms |
| `/assets/jsxgraph-[hash].js` | 196 KB | 591 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 774 ms |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 956 ms |

### viewer, slow-phone, slow-4g

| File | Transferred | Arrived |
|---|---|---|
| `/` | 1 KB | 156 ms |
| `/assets/document-[hash].css` | 1 KB | 360 ms |
| `/assets/index-[hash].css` | 1 KB | 367 ms |
| `/assets/react-[hash].js` | 4 KB | 434 ms |
| `/fixtures/homework.doenet` | 1 KB | 547 ms |
| `/assets/index-[hash].js` | 22 KB | 875 ms |
| `/assets/document-[hash].js` | 65 KB | 1.54 s |
| `/assets/jsxgraph-[hash].js` | 196 KB | 2.84 s |
| `/assets/entity-map-[hash].js` | 10 KB | 3.19 s |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 4.78 s |

### prerendered, desktop, none

| File | Transferred | Arrived |
|---|---|---|
| `/fixtures/generated/prerendered/homework.html` | 3 KB | 2.5 ms |
| `/assets/snapshot-[hash].js` | 2 KB | 16 ms |
| `/assets/react-[hash].js` | 4 KB | 24 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 28 ms |
| `/assets/index-[hash].js` | 38 KB | 31 ms |
| `/assets/document-[hash].js` | 65 KB | 31 ms |
| `/assets/jsxgraph-[hash].js` | 196 KB | 35 ms |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 46 ms |

### prerendered, desktop, 4g

| File | Transferred | Arrived |
|---|---|---|
| `/fixtures/generated/prerendered/homework.html` | 3 KB | 68 ms |
| `/assets/snapshot-[hash].js` | 2 KB | 148 ms |
| `/assets/react-[hash].js` | 4 KB | 162 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 187 ms |
| `/assets/index-[hash].js` | 38 KB | 279 ms |
| `/assets/document-[hash].js` | 65 KB | 348 ms |
| `/assets/jsxgraph-[hash].js` | 196 KB | 583 ms |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 924 ms |

### prerendered, desktop, slow-4g

| File | Transferred | Arrived |
|---|---|---|
| `/fixtures/generated/prerendered/homework.html` | 3 KB | 173 ms |
| `/assets/snapshot-[hash].js` | 2 KB | 375 ms |
| `/assets/react-[hash].js` | 4 KB | 427 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 577 ms |
| `/assets/index-[hash].js` | 38 KB | 1.15 s |
| `/assets/document-[hash].js` | 65 KB | 1.54 s |
| `/assets/jsxgraph-[hash].js` | 196 KB | 2.85 s |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 4.72 s |

### prerendered, mid-phone, none

| File | Transferred | Arrived |
|---|---|---|
| `/fixtures/generated/prerendered/homework.html` | 3 KB | 2.5 ms |
| `/assets/snapshot-[hash].js` | 2 KB | 34 ms |
| `/assets/react-[hash].js` | 4 KB | 38 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 39 ms |
| `/assets/document-[hash].js` | 65 KB | 40 ms |
| `/assets/index-[hash].js` | 38 KB | 41 ms |
| `/assets/jsxgraph-[hash].js` | 196 KB | 44 ms |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 57 ms |

### prerendered, mid-phone, 4g

| File | Transferred | Arrived |
|---|---|---|
| `/fixtures/generated/prerendered/homework.html` | 3 KB | 68 ms |
| `/assets/snapshot-[hash].js` | 2 KB | 160 ms |
| `/assets/react-[hash].js` | 4 KB | 172 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 199 ms |
| `/assets/index-[hash].js` | 38 KB | 290 ms |
| `/assets/document-[hash].js` | 65 KB | 360 ms |
| `/assets/jsxgraph-[hash].js` | 196 KB | 595 ms |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 941 ms |

### prerendered, mid-phone, slow-4g

| File | Transferred | Arrived |
|---|---|---|
| `/fixtures/generated/prerendered/homework.html` | 3 KB | 172 ms |
| `/assets/snapshot-[hash].js` | 2 KB | 390 ms |
| `/assets/react-[hash].js` | 4 KB | 441 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 592 ms |
| `/assets/index-[hash].js` | 38 KB | 1.16 s |
| `/assets/document-[hash].js` | 65 KB | 1.55 s |
| `/assets/jsxgraph-[hash].js` | 196 KB | 2.86 s |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 4.73 s |

### prerendered, slow-phone, none

| File | Transferred | Arrived |
|---|---|---|
| `/fixtures/generated/prerendered/homework.html` | 3 KB | 2.9 ms |
| `/assets/snapshot-[hash].js` | 2 KB | 44 ms |
| `/assets/react-[hash].js` | 4 KB | 47 ms |
| `/assets/document-[hash].js` | 65 KB | 48 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 50 ms |
| `/assets/index-[hash].js` | 38 KB | 51 ms |
| `/assets/jsxgraph-[hash].js` | 196 KB | 56 ms |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 69 ms |

### prerendered, slow-phone, 4g

| File | Transferred | Arrived |
|---|---|---|
| `/fixtures/generated/prerendered/homework.html` | 3 KB | 67 ms |
| `/assets/snapshot-[hash].js` | 2 KB | 165 ms |
| `/assets/react-[hash].js` | 4 KB | 176 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 202 ms |
| `/assets/index-[hash].js` | 38 KB | 292 ms |
| `/assets/document-[hash].js` | 65 KB | 362 ms |
| `/assets/jsxgraph-[hash].js` | 196 KB | 597 ms |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 940 ms |

### prerendered, slow-phone, slow-4g

| File | Transferred | Arrived |
|---|---|---|
| `/fixtures/generated/prerendered/homework.html` | 3 KB | 171 ms |
| `/assets/snapshot-[hash].js` | 2 KB | 396 ms |
| `/assets/react-[hash].js` | 4 KB | 449 ms |
| `/assets/entity-map-[hash].js` | 10 KB | 599 ms |
| `/assets/index-[hash].js` | 38 KB | 1.17 s |
| `/assets/document-[hash].js` | 65 KB | 1.56 s |
| `/assets/jsxgraph-[hash].js` | 196 KB | 2.87 s |
| `/assets/cells_wasm_bg-[hash].wasm` | 558 KB | 4.74 s |

## Measurements

| Column | What it is |
|---|---|
| First paint | The browser's first contentful paint. On the client-rendered pages this is the page's toolbar, not the document; on the `prerendered` page it is the document. |
| Readable | When the document can be read. For the client-rendered pages (`viewer`, `editor`), the end of the `render` step: React has committed the document and the boards have drawn. For the `prerendered` page, its first paint, which is the document. |
| Usable | When the document responds to input: the end of the `interactive` step where a page records one, else of the `render` step. |
| Largest paint | The browser's largest contentful paint: when the largest text block or image so far was painted. |
| Blocking | Total blocking time from readable to usable: each long task's time beyond 50 ms, the time the page could not respond to input. A dash where the page is usable the moment it is readable. |
| Layout shift | The sum of the layout shifts not caused by input, until usable. |
| Transferred | Bytes on the wire of every file fetched until usable, compressed as served; 0 for a file from the cache. |
