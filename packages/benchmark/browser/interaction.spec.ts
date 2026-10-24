// The interaction layer: checks that the cells viewer does what a student
// does to it, through real pointer and keyboard events on its build
// (`browser/serve.mjs`, uncached port). Nothing is timed or recorded; a
// failure is a bug in the viewer.
//
//   npm run build -w packages/cells-viewer
//   npm run interaction
import { expect, test, type Page } from "@playwright/test";

const PAGE = "http://localhost:4173/?editor=0&src=/fixtures/homework.doenet";

async function load(page: Page) {
    await page.goto(PAGE);
    await page.waitForFunction(() => (window as any).__cells?.ready === true);
}

/** The core's coordinates of the named point. */
function position(page: Page, name: string) {
    return page.evaluate((name) => {
        const store = (window as any).__cells.store;
        const c = store.comps.byName(name);
        const v = store.cells();
        return [v[store.comps.cell(c, "x")], v[store.comps.cell(c, "y")]] as [
            number,
            number,
        ];
    }, name);
}

/** Press on the named point, move 60 px left and 20 px down, release. */
async function drag(page: Page, name: string) {
    const at = await page.evaluate(
        (name) => (window as any).__cells.locate(name),
        name,
    );
    expect(at, `${name} is on a graph`).not.toBeNull();
    const [x, y] = at as [number, number];
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x - 60, y + 20, { steps: 8 });
    await page.mouse.up();
}

// Problem 9's P starts at (2, 0) on the parabola y = x^2 - 2x = (x - 1)^2 - 1, so a
// drag left and down moves it toward the vertex (1, -1).
for (const focused of [false, true]) {
    test(`drag a point with ${focused ? "a mathInput" : "nothing"} focused`, async ({
        page,
    }) => {
        await load(page);
        // An input far above the graph: JSXGraph's board updates hand focus
        // back to it, which used to scroll the graph away mid-drag.
        if (focused) await page.locator("input.mathInput").nth(1).focus();
        expect(await position(page, "P")).toEqual([2, 0]);
        await drag(page, "P");
        await expect.poll(() => position(page, "P")).not.toEqual([2, 0]);
        const [px, py] = await position(page, "P");
        expect(px).toBeLessThan(1.5);
        expect(py).toBeCloseTo((px - 1) ** 2 - 1, 6);
    });
}
