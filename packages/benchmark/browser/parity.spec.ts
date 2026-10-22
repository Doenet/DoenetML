// The parity check of prerendered pages: what the server rendered is what
// the browser's live viewer renders in its place, so the swap changes
// nothing a student can see. Each prerendered document
// (`scripts/prerender-fixtures.mjs`) is opened with its script held back,
// and every component's text and box is read from the snapshot; then the
// script is let through, and they are read again from the live viewer.
// The text must be the same, every component must keep its size (a graph
// its board's), and the swap must not shift the page's layout. This
// guards the one thing a page whose browser replaces its HTML, rather
// than adopting it, still has to keep: the server and the browser loading
// the same document the same way (source, seed, state, viewer build).
//
//   npm run parity
import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import {
    prerenderedDocuments,
    prerenderedUrl,
} from "../scripts/prerender-fixtures.mjs";

// The compressed, deployed server (browser/serve.mjs); any of the cells
// ports serves the same files.
const ORIGIN = "http://localhost:4177";
/** Layout shift the swap may cause: none a student would see. */
const MAX_LAYOUT_SHIFT = 0.01;
/** Boxes are compared to this many pixels: text measured in fractions of
 * a pixel can round either way. */
const BOX_SLACK = 1;

type Seen = Record<string, { text: string; width: number; height: number }>;

/** Every rendered component's text and box, by its `data-comp`. Inside a
 * graph only the board's own box counts: JSXGraph draws its contents in
 * the browser alone, so they are hidden while the text is read (after the
 * boxes, so nothing moves under them). Elements not laid out (a hidden
 * branch) are left out, as a student does not see them. */
async function readComponents(page: Page): Promise<Seen> {
    return page.evaluate(() => {
        const seen: Record<
            string,
            { text: string; width: number; height: number }
        > = {};
        const els: [string, HTMLElement][] = [];
        for (const el of document.querySelectorAll<HTMLElement>(
            "#root [data-comp]",
        )) {
            const board = el.closest(".jxgbox");
            if (board && board !== el) continue;
            const box = el.getBoundingClientRect();
            if (box.width === 0 && box.height === 0) continue;
            const id = el.getAttribute("data-comp")!;
            if (id in seen) continue;
            seen[id] = {
                text: "",
                width: Math.round(box.width * 10) / 10,
                height: Math.round(box.height * 10) / 10,
            };
            els.push([id, el]);
        }
        const drawn = [
            ...document.querySelectorAll<HTMLElement>(".jxgbox > *"),
        ];
        const display = drawn.map((el) => el.style.display);
        for (const el of drawn) el.style.display = "none";
        for (const [id, el] of els) seen[id].text = el.innerText;
        drawn.forEach((el, i) => (el.style.display = display[i]));
        return seen;
    });
}

test.describe.configure({ mode: "parallel" });

for (const { name, path } of prerenderedDocuments()) {
    test(name, async ({ page }) => {
        const errors: string[] = [];
        page.on("pageerror", (e) => errors.push(String(e)));
        page.on("console", (m) => {
            if (m.type() === "error") errors.push(m.text());
        });
        await page.addInitScript(() => {
            const w = window as any;
            w.__shift = 0;
            new PerformanceObserver((list) => {
                for (const e of list.getEntries() as any[])
                    if (!e.hadRecentInput) w.__shift += e.value;
            }).observe({ type: "layout-shift", buffered: true });
        });
        // Hold the page's script back until the snapshot has been read.
        let release!: () => void;
        const held = new Promise<void>((r) => (release = r));
        await page.route("**/assets/snapshot-*.js", async (route) => {
            await held;
            await route.continue();
        });
        await page.goto(`${ORIGIN}${prerenderedUrl(name)}`, {
            waitUntil: "commit",
        });
        await page.locator("#root[data-prerendered] .doc").waitFor();
        const before = await readComponents(page);
        const shiftBefore = await page.evaluate(() => (window as any).__shift);
        release();
        await page.waitForFunction(
            () => (window as any).__cells?.ready === true,
            null,
            { timeout: 60_000 },
        );
        // Boards draw a commit after the first, then the frame paints.
        await page.evaluate(
            () =>
                new Promise((ok) =>
                    requestAnimationFrame(() => setTimeout(ok, 100)),
                ),
        );
        const after = await readComponents(page);
        const shift =
            (await page.evaluate(() => (window as any).__shift)) - shiftBefore;

        expect(errors, "errors on the page").toEqual([]);
        expect(
            Object.keys(before).length,
            `${name}: components in the snapshot`,
        ).toBeGreaterThan(0);
        expect(Object.keys(after).sort(), "the same components").toEqual(
            Object.keys(before).sort(),
        );
        for (const [id, b] of Object.entries(before)) {
            const a = after[id];
            expect(a.text, `component ${id}'s text`).toBe(b.text);
            expect(
                Math.abs(a.width - b.width),
                `component ${id}'s width (${b.width} → ${a.width})`,
            ).toBeLessThanOrEqual(BOX_SLACK);
            expect(
                Math.abs(a.height - b.height),
                `component ${id}'s height (${b.height} → ${a.height})`,
            ).toBeLessThanOrEqual(BOX_SLACK);
        }
        expect(shift, "layout shift at the swap").toBeLessThan(
            MAX_LAYOUT_SHIFT,
        );
        // The page carried the source it was written from.
        expect(
            await page.evaluate(() =>
                JSON.parse(
                    document.getElementById("doenet-source")!.textContent!,
                ),
            ),
        ).toBe(readFileSync(path, "utf8"));
    });
}
