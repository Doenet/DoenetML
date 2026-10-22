// Which components of a new load are the ones already on screen, so an edit
// of the source updates the rendered document in place instead of
// remounting it, and keeps what the reader did to the parts it did not
// touch. The core numbers DAST nodes afresh on every load, and an edit near
// the top renumbers everything below it, so a node's id says nothing across
// loads. Its place in the source does: text before the edit keeps its
// offsets and text after it moves by the edit's length. A node of the new
// load that starts where a node of the same tag started before, once the
// edit is undone, is that node, and keeps its identity.

/** Where each DAST node of one load came from, by node id. */
export type NodeOrigins = {
    /** The source text the load was parsed from. */
    source: string;
    /** Start and end offset of each node in `source`, or -1 for a node the
     * parser made up (the document element, a normalization's additions). */
    start: Int32Array;
    end: Int32Array;
    /** The node whose child (or attribute's child) each node is, or -1. */
    parent: Int32Array;
    /** Each node's tag (an element's name, or another node's type). */
    tag: string[];
};

/** Collects a load's origins as `encodeDast` numbers its nodes, which it
 * does children first. */
export function originsCollector(source: string) {
    const start: number[] = [];
    const end: number[] = [];
    const tag: string[] = [];
    const parent: number[] = [];
    const ids = new Map<object, number>();
    return {
        onNode(id: number, n: any) {
            start[id] = n.position?.start?.offset ?? -1;
            end[id] = n.position?.end?.offset ?? -1;
            tag[id] = n.type === "element" ? n.name : n.type;
            ids.set(n, id);
            const kids: any[] = [...(n.children ?? [])];
            for (const a of Object.values(n.attributes ?? {}))
                kids.push(...((a as any).children ?? []));
            for (const k of kids) {
                const c = ids.get(k);
                if (c !== undefined) parent[c] = id;
            }
        },
        finish(nNodes: number): NodeOrigins {
            const column = (xs: number[]) => {
                const out = new Int32Array(nNodes).fill(-1);
                xs.forEach((x, i) => (out[i] = x));
                return out;
            };
            const t: string[] = new Array(nNodes).fill("");
            tag.forEach((x, i) => (t[i] = x));
            return {
                source,
                start: column(start),
                end: column(end),
                parent: column(parent),
                tag: t,
            };
        },
    };
}

let nextId = 0;
const tagIds = new Map<string, number>();
/** A node's place as one number: its start offset and its tag. */
function place(start: number, tag: string): number {
    let t = tagIds.get(tag);
    if (t === undefined) tagIds.set(tag, (t = tagIds.size));
    return start * 4096 + (t % 4096);
}

/** A stable id for every DAST node of one load. */
export class NodeIdentity {
    private constructor(
        readonly origins: NodeOrigins,
        /** Node id to stable id. */
        readonly ids: Uint32Array,
        /** Place (`place`) to stable id; made-up nodes by `~tag:k`. */
        private readonly byPlace: Map<number | string, number>,
        /** Each node of the previous load to the node of this one that it
         * is, or -1. */
        private readonly fromPrev: Int32Array,
        /** Whether a node of this load lies wholly outside the edit from
         * the previous one: the same text, or the same made-up node of it. */
        private readonly untouched: Uint8Array,
    ) {}

    /** The identities of a new load: a node keeps the id of the node of
     * `prev` it stands where, every other node gets a new one. Without
     * `prev`, every node is new. */
    static of(origins: NodeOrigins, prev: NodeIdentity | null): NodeIdentity {
        const { source, start, end, parent, tag } = origins;
        const n = start.length;
        // The edit, as the text both loads share at each end.
        const old = prev?.origins.source ?? "";
        const max = Math.min(old.length, source.length);
        let prefix = 0;
        while (
            prefix < max &&
            old.charCodeAt(prefix) === source.charCodeAt(prefix)
        )
            prefix++;
        let suffix = 0;
        while (
            suffix < max - prefix &&
            old.charCodeAt(old.length - 1 - suffix) ===
                source.charCodeAt(source.length - 1 - suffix)
        )
            suffix++;
        const shift = old.length - source.length;
        const tailStart = source.length - suffix;

        const ids = new Uint32Array(n);
        const byPlace = new Map<number | string, number>();
        const used = new Set<number>();
        const madeUp = new Map<string, number>();
        const byId = new Map<number, number>();
        const untouched = new Uint8Array(n);
        const reused = new Uint8Array(n);
        for (let i = 0; i < n; i++) {
            const s = start[i];
            let here: number | string;
            let before: number | string | null;
            if (s < 0) {
                // No place in the source: the k-th made-up node of its tag.
                const k = madeUp.get(tag[i]) ?? 0;
                madeUp.set(tag[i], k + 1);
                here = before = `~${tag[i]}:${k}`;
            } else {
                here = place(s, tag[i]);
                before =
                    s < prefix
                        ? here
                        : s >= tailStart
                          ? place(s + shift, tag[i])
                          : null;
                untouched[i] = Number(
                    (end[i] >= 0 && end[i] <= prefix) || s >= tailStart,
                );
            }
            let id = before !== null ? prev?.byPlace.get(before) : undefined;
            if (id === undefined || used.has(id)) id = nextId++;
            else reused[i] = 1;
            untouched[i] &= reused[i];
            used.add(id);
            ids[i] = id;
            byId.set(id, i);
            byPlace.set(here, id);
        }
        // A made-up node is as touched as the node it was made in. Parents
        // come after their children.
        for (let i = n - 1; i >= 0; i--)
            if (start[i] < 0 && reused[i])
                untouched[i] = parent[i] >= 0 ? untouched[parent[i]] : 1;
        const fromPrev = new Int32Array(prev?.ids.length ?? 0).fill(-1);
        if (prev)
            for (let o = 0; o < prev.ids.length; o++)
                fromPrev[o] = byId.get(prev.ids[o]) ?? -1;
        return new NodeIdentity(origins, ids, byPlace, fromPrev, untouched);
    }

    /**
     * The previous load's saved state (`Core.save_state`) for this load:
     * each entry renamed to this load's nodes, and dropped when its element
     * is new or the edit touched it, so what the reader did to an element
     * stays until its own source changes. Null when nothing carries.
     */
    carryState(saved: string): string | null {
        const { v, state } = JSON.parse(saved) as {
            v: number;
            state: [[number, number][], [number, number], ...unknown[]][];
        };
        if (v !== 2) return null;
        const node = (o: number) =>
            o >= 0 && o < this.fromPrev.length ? this.fromPrev[o] : -1;
        const out = [];
        for (const [path, [elem, k], ...rest] of state) {
            const e = node(elem);
            if (e < 0 || !this.untouched[e]) continue;
            const scopes = path.map(([s, p]) => [node(s), p]);
            if (scopes.some(([s]) => s < 0)) continue;
            out.push([scopes, [e, k], ...rest]);
        }
        return out.length > 0 ? JSON.stringify({ v, state: out }) : null;
    }
}
