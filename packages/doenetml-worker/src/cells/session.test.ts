/**
 * A move that a newer one of the same kind superseded while it waited is
 * answered with no updates; any other action runs (ADR 0020).
 */
import { beforeAll, describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { lezerToDast, normalizeDocumentDast } from "@doenet/parser";
import { initCellsCore } from "./loadCellsCore";
import { CellsSession } from "./session";

beforeAll(async () => {
    await initCellsCore(
        fs.readFileSync(
            path.resolve(
                __dirname,
                "../../../cells-core/pkg/cells_wasm_bg.wasm",
            ),
        ),
    );
});

async function open(source: string) {
    const session = new CellsSession();
    session.setSource(normalizeDocumentDast(lezerToDast(source)));
    const root = await session.load();
    const id = (name: string, i = 0) =>
        (root.elements as any[]).filter((e) => e?.name === name)[i].data.id;
    return { session, id };
}

describe("superseded moves", () => {
    it("answers a move a newer move of the same point superseded", async () => {
        const { session, id } = await open(
            `<graph><point>(0,0)</point><point>(5,5)</point></graph>`,
        );
        const move = (i: number, x: number) => ({
            component: "point",
            actionName: "move",
            componentIdx: id("point", i),
            args: { x, y: 0 },
        });
        // Three moves arrive before any runs: two of the first point, one
        // of the second.
        const a = move(0, 1);
        const b = move(1, 2);
        const c = move(0, 3);
        const [ca, cb, cc] = [a, b, c].map((m) => session.claim(m));
        expect(session.dispatch(a, ca)).toEqual({ payload: {} });
        expect(
            Object.keys(session.dispatch(b, cb).payload).length,
        ).toBeGreaterThan(0);
        expect(session.dispatch(c, cc).payload[id("point", 0)]).toEqual({
            type: "elementUpdate",
            changedState: { x: { math_object: "3" } },
        });
    });

    it("runs every other action, however many wait", async () => {
        const { session, id } = await open(`<booleanInput/>`);
        const check = {
            component: "booleanInput",
            actionName: "updateBoolean",
            componentIdx: id("booleanInput"),
            args: { boolean: true },
        };
        const once = session.claim(check);
        session.claim(check);
        expect(once()).toBe(true);
    });
});
