import init, {
    PublicDoenetMLCore as PublicDoenetMLCoreRust,
    type DastRoot as DastRootInCore,
    type ContentVector,
    type FlatFragment,
    type IndexResolution,
    type NodeList,
    type PathToCheck,
} from "lib-doenetml-worker";
import {
    expandExternalReferences,
    lezerToDast,
    normalizeDocumentDast,
} from "@doenet/parser";
import {
    cidFromText,
    data_format_version,
    type DiagnosticRecord,
    type HeadlessAnswer,
    type HeadlessComponent,
    type HeadlessCore,
    type HeadlessCoreFactory,
    type HeadlessCoreOptions,
    type HeadlessDocumentCredit,
    type HeadlessSavedState,
    serializedComponentsReviver,
} from "@doenet/utils";
import { PublicDoenetMLCore } from "../CoreWorker";
import { removeFunctionsMathExpressionClass } from "../utils/math";
import { resolvePathFromRoot, rootNameToPath } from "./resolvePath";

/**
 * The flags a headless core runs with unless the caller overrides them.
 *
 * The viewer's defaults (`defaultFlags` in `packages/doenetml/src/flags.ts`,
 * which this package cannot import), except that it sends no events
 * (`allowSaveEvents`), since no host is listening. The viewer's defaults
 * already keep no local state (`allowLocalState`), post no messages to a
 * parent frame and do not auto-submit. `allowSaveState` stays on, because
 * `serializeState` reads the state through the same report a host receives.
 * A test keeps these equal to the viewer's but for `allowSaveEvents`, so a
 * change to the viewer's defaults is decided here too.
 */
export const HEADLESS_DEFAULT_FLAGS: Record<string, unknown> = {
    showCorrectness: true,
    readOnly: false,
    solutionDisplayMode: "button",
    showFeedback: true,
    showHints: true,
    allowLoadState: true,
    allowSaveState: true,
    saveRendererState: false,
    allowLocalState: false,
    allowSaveEvents: false,
    messageParent: false,
    autoSubmit: false,
    maxNumAttempts: null,
};

/**
 * What the resolver WASM can be initialized from: its bytes, a compiled
 * module, or a `file:`/`http:` URL that `init` fetches.
 */
export type ResolverWasmSource = BufferSource | WebAssembly.Module | URL;

export type JavascriptHeadlessCoreOptions = HeadlessCoreOptions & {
    /**
     * The resolver WASM (`lib_doenetml_worker_bg.wasm`). The JavaScript core
     * resolves references through it. Initialized once per process; later
     * calls reuse the first initialization and ignore this.
     */
    wasm: ResolverWasmSource | (() => Promise<ResolverWasmSource>);
};

let wasmInitPromise: Promise<unknown> | null = null;

/**
 * Initialize the resolver WASM once per process. wasm-bindgen's `init` guards
 * only a *completed* initialization, so concurrent cores would otherwise
 * instantiate it twice; a failed attempt is forgotten so a later call can
 * retry. The same guard as `ensureWasmInitialized` in `@doenet/doenetml-worker`.
 */
function ensureWasmInitialized(
    wasm: JavascriptHeadlessCoreOptions["wasm"],
): Promise<unknown> {
    if (!wasmInitPromise) {
        wasmInitPromise = (async () => {
            const source = typeof wasm === "function" ? await wasm() : wasm;
            return await init({ module_or_path: source });
        })().catch((e) => {
            wasmInitPromise = null;
            throw e;
        });
    }
    return wasmInitPromise;
}

/**
 * Create a headless JavaScript core: the JavaScript core over the Rust
 * resolver, with no renderer and no host, implementing `HeadlessCore`.
 *
 * A saved state is applied the way `DocViewer` applies one: its `coreState`
 * as the state-variable changes, the variant recorded in its `coreInfo`, and
 * its `initializeCounters`. The attempt number is the one the state records
 * (a viewer has it from its host); it goes back into the state this core
 * writes and changes nothing it computes. The JavaScript core applies saved state only when
 * it is created, so this core has no `loadState`. Nothing here checks that the
 * saved state belongs to this document or variant; that is the caller's job
 * (`gradeState` in `@doenet/doenetml-headless` does it).
 *
 * Throws if the document cannot be built at all. A document that builds with
 * errors in it is not a failure: the errors are among its diagnostics.
 */
export async function createJavascriptHeadlessCore({
    doenetML,
    variantIndex = 1,
    flags = {},
    savedState,
    wasm,
}: JavascriptHeadlessCoreOptions): Promise<HeadlessCore> {
    await ensureWasmInitialized(wasm);

    const rustCore = PublicDoenetMLCoreRust.new();
    const jsCore = new PublicDoenetMLCore();

    // Everything below can throw on a document that cannot be built, and the
    // caller may go on to the next one, so nothing escapes without giving back
    // what the Rust core allocated in the shared WASM memory.
    async function release() {
        try {
            await jsCore.terminate();
        } catch (e) {
            // Best effort: the Rust core is still freed below.
        }
        try {
            rustCore.free();
        } catch (e) {
            // Already freed.
        }
    }

    let lastStateReport: HeadlessSavedState | null = null;
    let allPossibleVariants: unknown[];

    try {
        const dast = normalizeDocumentDast(
            await expandExternalReferences(
                lezerToDast(doenetML),
                fetchNoExternalDoenetML,
            ),
            true,
        );
        rustCore.set_source(dast as DastRootInCore, doenetML);
        const normalizedRoot = rustCore.return_normalized_dast_root();

        jsCore.setSource(doenetML);
        jsCore.setFlags({ ...HEADLESS_DEFAULT_FLAGS, ...flags });

        const initialized = await jsCore.initializeWorker({
            activityId: "",
            docId: "1",
            requestedVariantIndex: variantIndex,
            attemptNumber:
                typeof savedState?.attemptNumber === "number"
                    ? savedState.attemptNumber
                    : 1,
            normalizedRoot,
            addNodesToResolver(
                flatFragment: FlatFragment,
                indexResolution: IndexResolution,
            ) {
                rustCore.add_nodes_to_resolver(flatFragment, indexResolution);
            },
            replaceIndexResolutionsInResolver(
                components: ContentVector,
                indexResolution: IndexResolution,
            ) {
                rustCore.replace_index_resolutions_in_resolver(
                    components,
                    indexResolution,
                );
            },
            deleteNodesFromResolver(nodeList: NodeList) {
                rustCore.delete_nodes_from_resolver(nodeList);
            },
            resolvePath(
                path: PathToCheck,
                origin: number,
                skipParentSearch: boolean,
            ) {
                return rustCore.resolve_path(path, origin, skipParentSearch);
            },
            updateRootNames(reportAll: boolean) {
                return rustCore.update_root_names(reportAll);
            },
        });
        allPossibleVariants = initialized.allPossibleVariants;

        const { requestedVariant, stateVariableChanges, initializeCounters } =
            savedStateForCore(savedState);

        const result = await jsCore.createCoreGenerateDast(
            {
                coreId: "",
                // The id the viewer gives the document, so a state this core
                // writes carries the `cid` a viewer's would.
                cid: await cidFromText(doenetML),
                initializeCounters,
                requestedVariant,
                stateVariableChanges,
                // What production does with an error reported after load:
                // keep it as a diagnostic rather than fail.
                errorsAfterLoad: "warn",
            },
            () => {},
            (report) => {
                // A `pending` report mirrors a payload the save throttle is
                // holding back; the core reports it again, not pending, when
                // the throttle lets it go. `serializeState` lets it go
                // (`saveImmediately`), so only those reports are kept.
                if (
                    !report.pending &&
                    typeof report.state === "object" &&
                    report.state !== null
                ) {
                    lastStateReport = report.state as HeadlessSavedState;
                }
            },
            () => {},
            () => {},
            () => {},
            () => {},
            async () => ({ allowView: true }),
        );
        if (!result.success) {
            throw Error(result.errMsg);
        }
    } catch (e) {
        await release();
        throw e;
    }

    const core = jsCore.core!;
    const generatedVariant = JSON.parse(
        core.canonicalGeneratedVariantString ?? "{}",
    );
    let terminated = false;

    function component(componentIdx: number) {
        if (terminated) {
            throw Error("This headless core has been terminated.");
        }
        const found = core._components[componentIdx];
        if (!found) {
            throw Error(`No component with index ${componentIdx}.`);
        }
        return found;
    }

    function stableKeyOf(componentIdx: number): string | null {
        const rootName = core.rootNames[componentIdx];
        return rootName === undefined ? null : rootNameToPath(rootName);
    }

    /**
     * Each component's place in a depth-first walk of the document's active
     * children: the order a reader meets them.
     */
    function documentOrder(): Map<number, number> {
        const order = new Map<number, number>();
        const stack = [core._components[core.documentIdx]];
        while (stack.length > 0) {
            const next = stack.pop();
            if (!next || order.has(next.componentIdx)) {
                continue;
            }
            order.set(next.componentIdx, order.size);
            const children = (next.activeChildren ?? []).filter(
                (child: any) => typeof child === "object" && child,
            );
            for (let i = children.length - 1; i >= 0; i--) {
                stack.push(children[i]);
            }
        }
        return order;
    }

    function toComponent(child: any): HeadlessComponent {
        return {
            componentIdx: child.componentIdx,
            componentType: child.componentType,
        };
    }

    return {
        capabilities: { loadState: false },
        variantIndex:
            typeof generatedVariant.index === "number"
                ? generatedVariant.index
                : variantIndex,
        numVariants: allPossibleVariants.length,

        async dispatchAction({ componentIdx, actionName, args = {} }) {
            component(componentIdx);
            const result: any = await jsCore.requestAction({
                componentIdx,
                actionName,
                args,
            });
            if (result?.actionUnavailable) {
                throw Error(
                    `A <${component(componentIdx).componentType}> has no action "${actionName}".`,
                );
            }
            if (result && result.success === false) {
                throw Error(
                    `The core refused the action "${actionName}"` +
                        (result.errMsg ? `: ${result.errMsg}` : "."),
                );
            }
        },

        async resolvePath(path) {
            if (terminated) {
                throw Error("This headless core has been terminated.");
            }
            return resolvePathFromRoot({ path, rustCore, core });
        },

        async getChildren(componentIdx) {
            return component(componentIdx)
                .activeChildren.filter(
                    (child: any) => typeof child === "object" && child,
                )
                .map(toComponent);
        },

        async readProperties(componentIdx, propertyNames) {
            const target = component(componentIdx);
            const values: Record<string, unknown> = {};
            for (const name of propertyNames) {
                if (name in target.state) {
                    values[name] = removeFunctionsMathExpressionClass(
                        await target.stateValues[name],
                    );
                }
            }
            return values;
        },

        async getAnswers() {
            if (terminated) {
                throw Error("This headless core has been terminated.");
            }
            const answers: HeadlessAnswer[] = [];
            for (const answer of core._components) {
                // A copy of an answer shadows it and shares its state; the
                // answer itself is the one to report.
                if (answer?.componentType !== "answer" || answer.shadows) {
                    continue;
                }
                const values = answer.stateValues;
                answers.push({
                    componentIdx: answer.componentIdx,
                    componentType: answer.componentType,
                    stableKey: stableKeyOf(answer.componentIdx),
                    ...(answer.position ? { position: answer.position } : {}),
                    creditAchievedIfSubmit: await values.creditAchievedIfSubmit,
                    stored: {
                        creditAchieved: await values.creditAchieved,
                        numSubmissions: await values.numSubmissions,
                    },
                    inputs: (await values.inputChildren).map(toComponent),
                });
            }
            // In document order: where each sits in the document as it now
            // stands, which is not where it is written once a repeat or a
            // select has made copies (a repeat's second answer in its first
            // iteration comes before its first answer in the second; a
            // select's options come in the order selected). An answer outside
            // the document's tree goes last, by where it is written.
            const order = documentOrder();
            const rank = (answer: HeadlessAnswer) =>
                order.get(answer.componentIdx) ?? Infinity;
            const offset = (answer: HeadlessAnswer) =>
                answer.position?.start.offset ?? Infinity;
            return answers.sort(
                (a, b) =>
                    compare(rank(a), rank(b)) ||
                    compare(offset(a), offset(b)) ||
                    a.componentIdx - b.componentIdx,
            );
        },

        async getDocumentCredit(): Promise<HeadlessDocumentCredit> {
            const document = component(core.documentIdx);
            return {
                creditAchievedIfSubmit:
                    await document.stateValues.creditAchievedIfSubmit,
                stored: {
                    creditAchieved: await document.stateValues.creditAchieved,
                },
            };
        },

        async getDiagnostics(): Promise<DiagnosticRecord[]> {
            if (terminated) {
                throw Error("This headless core has been terminated.");
            }
            return [...core.diagnostics];
        },

        async serializeState() {
            if (terminated) {
                throw Error("This headless core has been terminated.");
            }
            await core.saveImmediately();
            if (lastStateReport) {
                return lastStateReport;
            }
            // Nothing has been reported: the core was created from a saved
            // state that nothing has changed since, so a save had nothing to
            // report (or the caller turned `allowSaveState` off). Build the
            // payload a report would carry.
            return core.statePersistence.buildDocStatePayload(false)
                .payload as HeadlessSavedState;
        },

        async terminate() {
            if (terminated) {
                return;
            }
            terminated = true;
            await release();
        },
    };
}

/**
 * The JavaScript core's `HeadlessCoreFactory`: what `@doenet/doenetml-headless`
 * uses as its default core. `wasm` is the resolver WASM, as
 * `createJavascriptHeadlessCore` takes it.
 */
export function createJavascriptHeadlessCoreFactory({
    wasm,
}: Pick<JavascriptHeadlessCoreOptions, "wasm">): HeadlessCoreFactory {
    return {
        dataFormatVersion: data_format_version,
        create(options) {
            return createJavascriptHeadlessCore({ ...options, wasm });
        },
    };
}

/**
 * External documents (`copy="doenet:..."`) are fetched by a host; a headless
 * core has none, so a reference to one is reported as the document's error,
 * as it is in a viewer whose host cannot supply it.
 */
async function fetchNoExternalDoenetML(sourceUri: string): Promise<string> {
    throw Error(
        `A headless core cannot fetch external DoenetML ("${sourceUri}").`,
    );
}

/**
 * The parts of a saved state the core is created from, read as `DocViewer`'s
 * `processLoadedDocState` reads them.
 */
function savedStateForCore(savedState: HeadlessSavedState | null | undefined) {
    if (!savedState) {
        return {
            requestedVariant: undefined,
            stateVariableChanges: undefined,
            initializeCounters: {},
        };
    }
    if (typeof savedState.coreState !== "string") {
        throw Error("The saved state has no `coreState` string.");
    }
    if (typeof savedState.coreInfo !== "string") {
        throw Error("The saved state has no `coreInfo` string.");
    }
    const coreInfo = JSON.parse(
        savedState.coreInfo,
        serializedComponentsReviver,
    );
    const requestedVariant =
        typeof coreInfo?.generatedVariantString === "string"
            ? JSON.parse(
                  coreInfo.generatedVariantString,
                  serializedComponentsReviver,
              )
            : undefined;
    const initializeCounters =
        typeof savedState.initializeCounters === "object" &&
        savedState.initializeCounters !== null
            ? (savedState.initializeCounters as Record<string, number>)
            : {};
    return {
        requestedVariant,
        stateVariableChanges: savedState.coreState,
        initializeCounters,
    };
}

/** Compare two numbers, either of which may be `Infinity`, for a sort. */
function compare(a: number, b: number): number {
    return a === b ? 0 : a < b ? -1 : 1;
}
