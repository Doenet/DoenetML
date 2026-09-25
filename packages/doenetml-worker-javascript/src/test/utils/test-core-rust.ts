/**
 * A stand-in for `createTestCore` that runs the document on the Rust core
 * alone, so the existing worker tests can measure how far the Rust core is
 * from parity with the JavaScript one.
 *
 * Enabled by `DOENET_TEST_CORE=rust`, which makes `createTestCore` delegate
 * here. It returns the subset of `createTestCore`'s interface that most tests
 * use:
 *
 * - `core.returnAllStateVariables()` returns a lazy proxy rather than a dump
 *   of every state variable. Almost every test reads one or two values from
 *   it, so each `stateVariables[idx].stateValues.<name>` is fetched from the
 *   Rust core when it is read. Reading from a snapshot taken before a later
 *   action throws `StaleSnapshotRead`: the JavaScript core's snapshot would
 *   still hold the old value, and a lazy read cannot reproduce it.
 * - `core.requestAction()` forwards to `dispatch_action`. The Rust action
 *   format matches the JavaScript one (`{ componentIdx, actionName, args }`)
 *   plus a `component` field naming the component type.
 * - `resolvePathToNodeIdx()` resolves through the Rust resolver only. There is
 *   no lazy expansion of composites, so a path through an unexpanded
 *   composite does not resolve.
 *
 * Whatever the Rust core cannot answer throws a `RustCoreGap` error that
 * names the component type and the state variable, action or feature, so a
 * list of failures reads as a list of what is left to port.
 *
 * State variable names are passed to the Rust core as written. Where the Rust
 * core names something differently, that is a gap to fix in the Rust core or
 * in the test, not something to translate here.
 */
import me from "math-expressions";
import init, {
    PublicDoenetMLCore as PublicDoenetMLCoreRust,
} from "lib-doenetml-worker";
// For its side effect: installs the `math-expressions` callbacks
// (`globalThis.__forDoenetWorker`) that the Rust core calls for any math.
import "../../../../doenetml-worker-rust/lib-js-wasm-binding/src/index";
import {
    expandExternalReferences,
    lezerToDast,
    normalizeDocumentDast,
} from "@doenet/parser";
import { defaultFlags } from "../../../../doenetml/src/flags";
import type { DoenetMLFlags } from "../../../../doenetml/src/flags";
import { PublicDoenetMLCore as PublicDoenetMLCoreJavascript } from "../../CoreWorker";
import fs from "node:fs";
import path from "path";

export class RustCoreGap extends Error {
    constructor(message: string) {
        super(`[Rust core gap] ${message}`);
        this.name = "RustCoreGap";
    }
}

/**
 * A test read a value from a `returnAllStateVariables()` snapshot taken before
 * a later action. Fetch a new snapshot after the action instead.
 */
export class StaleSnapshotRead extends Error {
    constructor(message: string) {
        super(`[stale snapshot read] ${message}`);
        this.name = "StaleSnapshotRead";
    }
}

/**
 * Options of `createTestCore` that the Rust core has no counterpart for.
 * Passing one is a gap, not something to silently ignore.
 */
const UNSUPPORTED_OPTIONS = [
    "theme",
    "documentLocale",
    "localeResources",
    "styleOverrides",
    "initialState",
] as const;

export async function createTestCoreRust({
    doenetML,
    requestedVariantIndex = 1,
    flags: specifiedFlags = {},
    externalDoenetMLs = {},
    initializeCounters = {},
    ...rest
}: {
    doenetML: string;
    requestedVariantIndex?: number;
    flags?: Partial<DoenetMLFlags>;
    externalDoenetMLs?: Record<string, string>;
    initializeCounters?: Record<string, number>;
    [key: string]: unknown;
}) {
    for (const option of UNSUPPORTED_OPTIONS) {
        if (rest[option] !== undefined) {
            throw new RustCoreGap(`createTestCore option \`${option}\``);
        }
    }
    if (requestedVariantIndex !== 1) {
        throw new RustCoreGap("variants (`requestedVariantIndex`)");
    }
    if (Object.keys(initializeCounters).length > 0) {
        throw new RustCoreGap("`initializeCounters`");
    }

    const wasmBuffer = fs.readFileSync(
        path.resolve(
            import.meta.dirname,
            "../../../../doenetml-worker-rust/lib-js-wasm-binding/pkg/lib_doenetml_worker_bg.wasm",
        ),
    );
    await init({ module_or_path: wasmBuffer });

    const rustCore = PublicDoenetMLCoreRust.new();

    const dast = normalizeDocumentDast(
        await expandExternalReferences(lezerToDast(doenetML), async (uri) => {
            const match = uri.match(/^doenet:(\w+)/);
            const source = match && externalDoenetMLs[match[1]];
            if (!source) {
                throw `DoenetML for "${uri}" not found.`;
            }
            return source;
        }),
        true,
    );

    const flags: DoenetMLFlags = { ...defaultFlags, ...specifiedFlags };
    rustCore.set_source(dast as any, doenetML);
    rustCore.set_flags(JSON.stringify(flags));
    // Creates the components; everything below reads from them.
    rustCore.return_dast();

    /** Incremented by every action, so a snapshot can tell it is stale. */
    let actionCount = 0;

    function assertCurrent(takenAt: number, what: string) {
        if (takenAt !== actionCount) {
            throw new StaleSnapshotRead(
                `${what}, from a snapshot taken before the last ${actionCount - takenAt} action(s)`,
            );
        }
    }

    function getPropValue(
        componentIdx: number,
        componentType: string,
        name: string,
    ) {
        const value = rustCore.get_prop_value(componentIdx, name);
        if (value === undefined) {
            throw new RustCoreGap(
                `state variable \`${componentType}.${name}\``,
            );
        }
        return fromRustValue(value);
    }

    function componentEntry(
        componentIdx: number,
        componentType: string,
        takenAt: number,
    ) {
        const stateValues = new Proxy(
            {},
            {
                get(_target, name) {
                    if (typeof name !== "string") {
                        return undefined;
                    }
                    assertCurrent(takenAt, `\`${componentType}.${name}\``);
                    return getPropValue(componentIdx, componentType, name);
                },
                has(_target, name) {
                    if (typeof name !== "string") {
                        return false;
                    }
                    assertCurrent(takenAt, `\`${componentType}.${name}\``);
                    return (
                        rustCore.get_prop_value(componentIdx, name) !==
                        undefined
                    );
                },
                ownKeys() {
                    throw new RustCoreGap(
                        `enumerating every state variable of \`${componentType}\``,
                    );
                },
            },
        );
        const unsupported = (field: string) => () => {
            throw new RustCoreGap(`\`${field}\` of \`${componentType}\``);
        };
        return Object.defineProperties(
            { componentIdx, componentType, stateValues },
            Object.fromEntries(
                [
                    "activeChildren",
                    "replacements",
                    "replacementsToWithhold",
                    "replacementOf",
                    "sharedParameters",
                ].map((field) => [field, { get: unsupported(field) }]),
            ),
        );
    }

    const core = {
        /**
         * Same call shape as the JavaScript core's; the arguments only control
         * logging and serialization there, so they are ignored.
         */
        async returnAllStateVariables(
            _consoleLog?: boolean,
            _dontRemoveFunctionsMath?: boolean,
        ) {
            const takenAt = actionCount;
            return new Proxy({} as Record<number, any>, {
                get(_target, key) {
                    if (typeof key !== "string" || !/^-?\d+$/.test(key)) {
                        return undefined;
                    }
                    assertCurrent(takenAt, `component ${key}`);
                    const componentIdx = Number(key);
                    const componentType =
                        componentIdx >= 0
                            ? rustCore.get_component_type(componentIdx)
                            : undefined;
                    return componentType === undefined
                        ? undefined
                        : componentEntry(componentIdx, componentType, takenAt);
                },
                ownKeys() {
                    throw new RustCoreGap("enumerating every component");
                },
            });
        },

        async requestAction({
            componentIdx,
            actionName,
            args = {},
        }: {
            componentIdx: number | undefined;
            actionName: string;
            args?: Record<string, unknown>;
        }) {
            if (componentIdx === undefined || componentIdx < 0) {
                throw new RustCoreGap(
                    `action \`${actionName}\` on an unresolved component`,
                );
            }
            const componentType =
                rustCore.get_component_type(componentIdx) ?? "(none)";
            // Counted even if the action fails: the core may have changed
            // part way through.
            actionCount++;
            try {
                // Unlike the JavaScript core, the Rust core also routes an
                // action by the type of the component it is sent to.
                rustCore.dispatch_action({
                    componentIdx,
                    component: componentType,
                    actionName,
                    args,
                } as any);
            } catch (e) {
                throw new RustCoreGap(
                    `action \`${componentType}.${actionName}\`: ${String(e)}`,
                );
            }
        },
    };

    /**
     * Resolve `name` (such as `"p.m"` or `"n[2]"`) to a component index through
     * the Rust resolver, or -1 if it does not resolve to a component.
     */
    async function resolvePathToNodeIdx(name: string, origin = 0) {
        const parts = name.split(".").map((part) => {
            const match = part.match(/^([\w-]+)((\[\d+\])*)$/);
            if (!match) {
                throw Error(`Invalid name to resolve: ${name}`);
            }
            const index = [...match[2].matchAll(/\[(\d+)\]/g)].map(([, n]) => ({
                value: [n],
            }));
            return { type: "flatPathPart" as const, name: match[1], index };
        });
        try {
            const resolution = rustCore.resolve_path(
                { path: parts } as any,
                origin,
                false,
            );
            return resolution.unresolvedPath === null ? resolution.nodeIdx : -1;
        } catch {
            return -1;
        }
    }

    return {
        core: withJavascriptOnlyGaps(core),
        rustCore,
        resolvePathToNodeIdx,
    };
}

/**
 * Make the rest of the JavaScript core's test-facing API throw a `RustCoreGap`
 * naming what the test used, rather than fail later with a bare `TypeError`.
 *
 * Only names the JavaScript `PublicDoenetMLCore` actually has are turned into
 * gaps, so anything else (such as Vitest inspecting the object to print it)
 * still sees an ordinary object. `core.core`, the JavaScript core's internals,
 * throws on any property a test reads from it.
 */
function withJavascriptOnlyGaps<T extends object>(core: T): T {
    const internals = new Proxy(
        {},
        {
            get(_target, key) {
                if (typeof key !== "string" || key === "then") {
                    return undefined;
                }
                throw new RustCoreGap(
                    `JavaScript core internals \`core.core.${key}\``,
                );
            },
        },
    );
    return new Proxy(core, {
        get(target, key, receiver) {
            if (key in target) {
                return Reflect.get(target, key, receiver);
            }
            if (key === "core") {
                return internals;
            }
            if (
                typeof key === "string" &&
                key in PublicDoenetMLCoreJavascript.prototype
            ) {
                throw new RustCoreGap(`core API \`core.${key}\``);
            }
            return undefined;
        },
    });
}

/**
 * Convert a serialized Rust `PropValue` to the shape the JavaScript core's
 * `stateValues` holds, so assertions written against the JavaScript core apply
 * unchanged. A math value becomes a `math-expressions` object, since the tests
 * read `.tree` off it.
 */
function fromRustValue(value: any): unknown {
    if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        Object.keys(value).length === 1 &&
        typeof value.math_object === "string"
    ) {
        let tree: any;
        try {
            tree = JSON.parse(value.math_object);
        } catch {
            // The blank math is stored as the bare string "＿", not as JSON.
            tree = value.math_object;
        }
        return me.fromAst(tree);
    }
    return value;
}
