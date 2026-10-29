/**
 * One document on the cells core, as a worker serves it (ADR 0020): the DAST
 * kept from `setSource` until the load, the bridge to the loaded core, and the
 * moves a newer one has superseded. Both the worker that hosts every core
 * (`CoreWorker`) and the cells core's own (`./worker.ts`) serve the renderer
 * through one.
 */
import type { DastRoot } from "@doenet/parser";
import type {
    ActionResponse,
    FlatPathPart,
    RefResolution,
} from "@doenet/doenetml-worker-rust";
import type { CellsBridge, RendererAction } from "./bridge";
import { loadCellsDocument } from "./loadCellsCore";

/** Renderer actions that say where something is, not how far it moved: a
 * later one makes an earlier one that has not run yet pointless. */
const ABSOLUTE_ACTIONS = new Set([
    "move",
    "moveLine",
    "moveLineSegment",
    "moveCircle",
    "movePolygon",
    "changeBoundingBox",
    "changeValue",
]);

/** What a superseding move must match: the element, the action and which
 * parts it sets (one endpoint of a segment does not supersede the other). */
function supersedingKey(action: RendererAction): string | null {
    if (!ABSOLUTE_ACTIONS.has(action.actionName)) return null;
    const args = action.args ?? {};
    const parts = Object.keys(args)
        .sort()
        .map((key) =>
            key === "pointCoords"
                ? `pointCoords:${Object.keys(args[key]).sort().join(",")}`
                : key,
        );
    return `${action.componentIdx}:${action.actionName}:${parts.join(";")}`;
}

export class CellsSession {
    _dast: DastRoot | undefined = undefined;
    bridge: CellsBridge | undefined = undefined;
    /** The latest ticket handed to each kind of move (`supersedingKey`). */
    _latest = new Map<string, number>();
    _tickets = 0;

    setSource(dast: DastRoot) {
        this.free();
        this._dast = dast;
    }

    /** Load the document and return its flat DAST. */
    async load() {
        if (!this._dast) {
            throw Error("Cannot return dast before setting source and flags");
        }
        this.free();
        this.bridge = await loadCellsDocument(this._dast);
        return this.bridge.flatDast();
    }

    /**
     * Take a ticket for `action` as it arrives, before it waits behind the
     * actions ahead of it; the returned function says, once its turn comes,
     * whether it is still the latest of its kind. A drag sends a move per
     * pointer event, and the worker carries them out one at a time, so moves
     * that arrive faster than ticks would otherwise queue without bound.
     */
    claim(action: RendererAction): () => boolean {
        const key = supersedingKey(action);
        if (key === null) return () => true;
        const ticket = ++this._tickets;
        this._latest.set(key, ticket);
        return () => this._latest.get(key) === ticket;
    }

    /** Carry out a renderer action, unless a newer one superseded it while
     * it waited: then it changes nothing and is answered with no updates. */
    dispatch(action: RendererAction, current: () => boolean): ActionResponse {
        if (!this.bridge) {
            throw Error("Cannot handle action before returning dast");
        }
        if (!current()) return { payload: {} };
        return this.bridge.dispatch(action);
    }

    /** The element a name path names, from the document, whatever the
     * origin. */
    resolvePath(path: FlatPathPart[]): RefResolution {
        if (!this.bridge) {
            throw Error("Cannot resolve a path before returning dast");
        }
        const name = path
            .map(
                (part) =>
                    part.name +
                    part.index.map((i) => `[${i.value.join("")}]`).join(""),
            )
            .join(".");
        const nodeIdx = this.bridge.resolveName(name);
        return {
            nodeIdx,
            nodesInResolvedPath: [],
            unresolvedPath: nodeIdx === -1 ? path : null,
            originalPath: path,
        };
    }

    submitAllAnswers(): ActionResponse | undefined {
        return this.bridge?.submitAllAnswers();
    }

    /** For the benchmark: where the load and the ticks since the last call
     * spent their time. */
    timings() {
        return this.bridge?.takeTimings() ?? null;
    }

    /** Free the loaded core, if any. */
    free() {
        this.bridge?.core.free();
        this.bridge = undefined;
        this._latest.clear();
    }
}
