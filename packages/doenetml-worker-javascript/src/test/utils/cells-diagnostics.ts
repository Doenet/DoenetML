/**
 * The cells core's diagnostics (ADR 0013, `Core::diagnostics_json`) read as
 * the current core's `core.core.diagnostics`, for the parity harness
 * (`test-core-cells.ts`).
 *
 * Each entry the cells core reports becomes a record of the current core's
 * shape: its `kind` as `type`, its `code`, `level` and `args`, and the
 * `position` of the DAST node it names. Nothing is added: a finding the
 * cells core does not make is not in the list. Only the English sentence
 * may change, where the cells core's code is the i18n registry's and its
 * sentence carries the registry message's blanks: the record then holds the
 * registry's sentence, as the current core writes it. An attribute the cells
 * core does not support that the current core's type does not have either
 * is that core's invalid-attribute error (`doenet-e0004`), which names the
 * same attribute and component.
 *
 * A finding that says the cells core does not support what the document
 * uses (an unsupported tag, attribute or construct) is a gap of the core,
 * not a diagnostic about the document, so reading the list throws
 * `CellsCoreGap` naming it, as a load error does. So does reading a
 * component the cells core built as an error (an `_error`), or resolving a
 * name inside one: the gap is the error's.
 */
import { formatEnglishDiagnostic } from "@doenet/i18n";
import type { DiagnosticRecord } from "@doenet/utils";
import { allComponentClasses } from "../../ComponentTypes";
import { narrowPositionToOpeningTag } from "../../utils/sourceLocation";

/** One entry of `diagnostics_json` (`cells-core/src/diagnostics.rs`). */
type CellsDiagnostic = {
    kind: "error" | "warning" | "info" | "accessibility";
    level?: 1 | 2;
    code: string;
    message: string;
    node?: number;
    args?: Record<string, string>;
};

/** The cells core's codes for what it does not support, as opposed to a
 * finding about the document. */
const GAP_CODES = new Set([
    "cells-unsupported",
    "cells-unsupported-attribute",
    "cells-polygon-center-unsupported",
    "cells-intersection-unsupported",
    "cells-action-unsupported",
    "cells-best-fit-line-too-many-points",
    "cells-not-indexable",
    "cells-path-too-deep",
    "cells-dynamic-index",
    "cells-uncopyable-type",
    "cells-choice-not-constant",
    "cells-internal",
]);

/** The registry message's blanks, read from the cells core's sentence for
 * a code whose sentence carries them (`cells-core/src/error.rs`). */
const ARGS_FROM_MESSAGE: Record<
    string,
    (message: string) => Record<string, string> | null
> = {
    // reference-no-referent
    "doenet-w0104": (m) => {
        const r = /^unknown reference '(\$.*)'$/.exec(m);
        return r ? { reference: r[1] } : null;
    },
    // reference-multiple-referents
    "doenet-w0105": (m) => {
        const r = /^reference '(\$.*)' is ambiguous: /.exec(m);
        return r ? { reference: r[1] } : null;
    },
    // component-type-invalid
    "doenet-e0002": (m) => {
        const r = /^unsupported tag <(.*)>$/.exec(m);
        return r ? { componentType: r[1] } : null;
    },
};

let jsClasses: Map<string, any> | null = null;
/** The current core's class of component type `tag` (its tags are
 * matched without case). */
function javascriptClass(tag: string): any {
    jsClasses ??= new Map(
        Object.entries(allComponentClasses() as Record<string, any>).map(
            ([t, c]) => [t.toLowerCase(), c],
        ),
    );
    return jsClasses.get(tag.toLowerCase());
}

/** The component type of a DAST element, as the current core reads it: a
 * division's is its `type` (`convertNormalizedDast.ts`). */
function componentTypeOf(element: any): string | undefined {
    if (element?.type !== "element") return undefined;
    if (element.name === "division") {
        const type = element.attributes?.type?.children;
        if (Array.isArray(type) && type.length === 1 && type[0].type === "text")
            return type[0].value;
    }
    return element.name;
}

/** For an attribute the cells core does not support (`d`, about
 * `element`) that the current core's type does not have either: that
 * core's invalid-attribute error's blanks (`doenet-e0004`, from
 * `expandAllUnflattenedAttributes`), the same attribute and component. */
function invalidAttribute(
    d: CellsDiagnostic,
    element: any,
): Record<string, string> | null {
    if (d.code !== "cells-unsupported-attribute") return null;
    const attribute = /^attribute '([^']*)' is not supported on </.exec(
        d.message,
    )?.[1];
    const componentType = componentTypeOf(element);
    if (attribute === undefined || componentType === undefined) return null;
    const cls = javascriptClass(componentType);
    if (!cls || cls.acceptAnyAttribute || attribute.includes(":")) return null;
    const has = Object.keys(cls.createAttributesObject()).some(
        (a) => a.toLowerCase() === attribute.toLowerCase(),
    );
    return has ? null : { attribute, componentType };
}

/** The DAST's nodes, by the id the cells core's loader gives each
 * (`cells-core/src/dast/json.rs`): the root is 0, and every other node is
 * numbered after its contents, in the order the JSON lists them (a macro's
 * index expressions, an element's attributes' children, its children). */
function dastNodes(root: any): any[] {
    const out: any[] = [root];
    const field = (o: any, key: string, f: (v: any) => void) => {
        if (o && typeof o === "object" && o[key] !== undefined) f(o[key]);
    };
    const nodes = (list: any) => {
        if (Array.isArray(list)) for (const n of list) node(n);
    };
    const node = (n: any) => {
        for (const [key, v] of Object.entries(n)) {
            if (v === undefined) continue;
            if (key === "path" && Array.isArray(v)) {
                for (const part of v)
                    field(part, "index", (index) => {
                        if (Array.isArray(index))
                            for (const i of index) field(i, "value", nodes);
                    });
            } else if (key === "attributes" && v && typeof v === "object") {
                for (const attr of Object.values(v))
                    field(attr, "children", nodes);
            } else if (key === "children") {
                nodes(v);
            } else if (key === "input" && n.type === "function") {
                if (Array.isArray(v)) for (const arg of v) nodes(arg);
            }
        }
        // A function macro, `$$f(a, b)`, is read as the `<evaluate>` it
        // stands for: a macro of its path, a comma between two arguments,
        // then the element, each at the function macro's position.
        if (n.type === "function") {
            const args = Array.isArray(n.input) ? n.input.length : 0;
            for (let k = 0; k < Math.max(args, 1); k++) out.push(n);
        }
        out.push(n);
    };
    field(root, "children", nodes);
    return out;
}

/** The parser's error nodes under `n`: the current core reports each. */
function parserErrors(n: any, out: any[] = []): any[] {
    if (!n || typeof n !== "object") return out;
    if (Array.isArray(n)) {
        for (const c of n) parserErrors(c, out);
        return out;
    }
    if (n.type === "error") out.push(n);
    if (n.attributes) parserErrors(Object.values(n.attributes), out);
    if (n.children) parserErrors(n.children, out);
    return out;
}

/** The names the elements under `n` are given, `n`'s own included. */
function namesUnder(n: any, out = new Set<string>()): Set<string> {
    if (!n || typeof n !== "object") return out;
    if (Array.isArray(n)) {
        for (const c of n) namesUnder(c, out);
        return out;
    }
    if (n.type === "element") {
        const name = n.attributes?.name?.children;
        if (Array.isArray(name) && name.length === 1 && name[0].type === "text")
            out.add(name[0].value);
        namesUnder(n.children, out);
    }
    return out;
}

/** The cells core's diagnostics for one load, read as the current core's:
 * see the module comment. `dast` is the normalized DAST the core loaded,
 * with its positions, and `source` its text; `errorNodeOf` gives the DAST
 * node of the component a name resolves to when the core built that one
 * as an error, else null. */
export class CellsDiagnostics {
    _nodes: any[] | null = null;

    constructor(
        readonly core: any,
        readonly dast: any,
        readonly source: string,
        readonly gap: (message: string) => Error,
        readonly errorNodeOf: (name: string) => number | null,
    ) {}

    _list(): CellsDiagnostic[] {
        return JSON.parse(this.core.diagnostics_json());
    }

    _node(id: number | undefined): any {
        if (id === undefined) return undefined;
        this._nodes ??= dastNodes(this.dast);
        return this._nodes[id];
    }

    _gap(d: CellsDiagnostic, what = "diagnostic"): Error {
        return this.gap(`${what} \`${d.code}\`: ${d.message}`);
    }

    /** Whether `d` says the cells core does not support what the document
     * uses. */
    _isGap(d: CellsDiagnostic): boolean {
        if (d.code === "cells-unsupported-attribute")
            return invalidAttribute(d, this._node(d.node)) === null;
        if (GAP_CODES.has(d.code)) return true;
        if (d.code !== "doenet-e0002") return false;
        const tag = ARGS_FROM_MESSAGE[d.code](d.message)?.componentType;
        return tag !== undefined && javascriptClass(tag) !== undefined;
    }

    /** `core.core.diagnostics`. */
    records(): DiagnosticRecord[] {
        const list = this._list();
        for (const d of list) if (this._isGap(d)) throw this._gap(d);
        // The cells core does not report what the parser marked as an error.
        const parsed = parserErrors(this.dast);
        if (parsed.length > 0)
            throw this.gap(
                `diagnostic of the parser's error nodes: ${parsed[0].message}`,
            );
        const records = list.map((d) => {
            const invalid = invalidAttribute(d, this._node(d.node));
            if (invalid) d = { ...d, code: "doenet-e0004", args: invalid };
            const args =
                d.args && Object.keys(d.args).length > 0
                    ? d.args
                    : (ARGS_FROM_MESSAGE[d.code]?.(d.message) ?? undefined);
            const message =
                args && d.code.startsWith("doenet-")
                    ? formatEnglishDiagnostic(d.code as any, args)
                    : d.message;
            const record: any = { type: d.kind, message, code: d.code };
            if (d.level !== undefined) record.level = d.level;
            if (args) record.args = args;
            let position = this._node(d.node)?.position;
            // The current core points an accessibility finding at its
            // element's opening tag only (`Core.addDiagnostic`).
            if (d.kind === "accessibility")
                position = narrowPositionToOpeningTag(position, this.source);
            if (position) record.position = position;
            return record as DiagnosticRecord;
        });
        // In document order, as the current core mostly finds them; the
        // cells core lists them by node, which numbers an element after
        // its contents.
        const at = (r: DiagnosticRecord) =>
            r.position?.start.offset ?? Number.POSITIVE_INFINITY;
        return records
            .map((r, i) => [r, i] as const)
            .sort((a, b) => at(a[0]) - at(b[0]) || a[1] - b[1])
            .map(([r]) => r);
    }

    /** The error the cells core built the element at DAST node `node` as
     * (an `_error` component), as a gap; null if it reports none. */
    errorGap(node: number, seen = new Set<number>()): Error | null {
        const d = this._list().find(
            (d) => d.kind === "error" && d.node === node,
        );
        if (!d) return null;
        seen.add(node);
        // An element whose referent (the `$name` its message gives) the
        // core built as an error: the gap is the referent's.
        if (
            d.code === "cells-boxed-referent" ||
            d.message.includes("<_error>")
        ) {
            const name = /['"]\$([^'"]*)['"]/.exec(d.message)?.[1];
            const referent = name === undefined ? null : this.errorNodeOf(name);
            if (referent !== null && !seen.has(referent)) {
                const gap = this.errorGap(referent, seen);
                if (gap) return gap;
            }
        }
        return this._gap(d, "built as an error, diagnostic");
    }

    /** The first name of each reference at DAST node `node` or among its
     * children, and of each reference inside their indices (`t` of
     * `$t.categories`, `l` and `t` of `$l[$t[1]]`). */
    referenceNames(node: number): string[] {
        const n = this._node(node);
        if (!n) return [];
        const out: string[] = [];
        const macro = (m: any) => {
            if (m?.type !== "macro" || !Array.isArray(m.path)) return;
            if (typeof m.path[0]?.name === "string") out.push(m.path[0].name);
            for (const part of m.path)
                for (const index of part?.index ?? [])
                    for (const v of index?.value ?? []) macro(v);
        };
        for (const m of [n, ...(Array.isArray(n.children) ? n.children : [])])
            macro(m);
        return out;
    }

    /** The gap behind a name that resolves to nothing: the error of an
     * element built as one (`errorNodes`, their DAST nodes) that the name
     * is given inside; null if there is none. */
    unresolvedNameGap(name: string, errorNodes: number[]): Error | null {
        const last = /([\w-]+)(\[[^\]]*\])*$/.exec(name)?.[1];
        if (last === undefined) return null;
        for (const n of errorNodes) {
            const element = this._node(n);
            if (element && namesUnder(element).has(last)) {
                const gap = this.errorGap(n);
                if (gap) return gap;
            }
        }
        return null;
    }
}
