import { PublicDoenetMLCore } from "../../CoreWorker";
import type { ReaderStyleOverrides } from "@doenet/utils";
import fs from "node:fs";
import path from "path";

import init, {
    PublicDoenetMLCore as PublicDoenetMLCoreRust,
    DastRoot as DastRootInCore,
    FlatPathPart,
    FlatIndex,
    RefResolution,
    PathToCheck,
    FlatFragment,
    IndexResolution,
    ContentVector,
    NodeList,
} from "lib-doenetml-worker";
import {
    declaredLangsInSource,
    expandExternalReferences,
    lezerToDast,
    normalizeDocumentDast,
} from "@doenet/parser";
import { negotiateLocales } from "@doenet/i18n";
import { resolvePathImmediatelyToNodeIdx } from "@doenet/debug-hooks";
import { defaultFlags } from "../../../../doenetml/src/flags";
import type { DoenetMLFlags } from "../../../../doenetml/src/flags";

import util from "util";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

type DoenetMLFlagsSubset = Partial<DoenetMLFlags>;

export type ResolvePathToNodeIdx = Awaited<
    ReturnType<typeof createTestCore>
>["resolvePathToNodeIdx"];

export async function createTestCore({
    doenetML,
    requestedVariantIndex = 1,
    flags: specifiedFlags = {},
    theme,
    documentLocale,
    localeResources,
    styleOverrides,
    initializeCounters = {},
    requestSolutionView = async () => ({ allowView: true }),
    externalDoenetMLs = {},
    initialState,
}: {
    doenetML: string;
    requestedVariantIndex?: number;
    flags?: DoenetMLFlagsSubset;
    theme?: "dark" | "light";
    /** BCP-47 tag the hosting page asks for; `<document lang>` overrides it. */
    documentLocale?: string;
    /** FTL catalogs keyed by locale, as `setLocaleData` would deliver them. */
    localeResources?: Record<string, string>;
    styleOverrides?: ReaderStyleOverrides | null;
    initializeCounters?: Record<string, number>;
    requestSolutionView?: (componentIdx: number) => Promise<{
        allowView: boolean;
    }>;
    externalDoenetMLs?: Record<string, string>;
    initialState?: string;
}) {
    const wasmBuffer = fs.readFileSync(
        path.resolve(
            import.meta.dirname,
            "../../../../doenetml-worker-rust/lib-js-wasm-binding/pkg/lib_doenetml_worker_bg.wasm",
        ),
    );

    await init({ module_or_path: wasmBuffer });

    const rustCore = PublicDoenetMLCoreRust.new();

    /**
     * A mock function for retrieving DoenetML source from a URI,
     * using the URI `doenet:[code]`.
     */
    function fetchExternalDoenetML(sourceUri: string) {
        return new Promise<string>((resolve, reject) => {
            setTimeout(() => {
                const match = sourceUri.match(/^doenet:(\w+)/);

                if (match) {
                    const doenetML = externalDoenetMLs[match[1]];

                    if (doenetML) {
                        return resolve(doenetML);
                    }
                }
                reject(`DoenetML for "${sourceUri}" not found.`);
            });
        });
    }

    const dast = normalizeDocumentDast(
        await expandExternalReferences(
            lezerToDast(doenetML),
            fetchExternalDoenetML,
        ),
        true,
    );
    rustCore.set_source(dast as DastRootInCore, doenetML);

    const normalizedRoot = rustCore.return_normalized_dast_root();

    function calculateRootNames() {
        return rustCore.calculate_root_names();
    }

    function resolvePath(
        path: PathToCheck,
        origin: number,
        skip_parent_search: boolean,
    ): RefResolution {
        return rustCore.resolve_path(path, origin, skip_parent_search);
    }
    function addNodesToResolver(
        flat_fragment: FlatFragment,
        index_resolution: IndexResolution,
    ) {
        rustCore.add_nodes_to_resolver(flat_fragment, index_resolution);
    }
    function replaceIndexResolutionsInResolver(
        components: ContentVector,
        index_resolution: IndexResolution,
    ) {
        rustCore.replace_index_resolutions_in_resolver(
            components,
            index_resolution,
        );
    }
    function deleteNodesFromResolver(node_list: NodeList) {
        rustCore.delete_nodes_from_resolver(node_list);
    }

    const flags: DoenetMLFlags = { ...defaultFlags, ...specifiedFlags };

    const core = new PublicDoenetMLCore();

    core.setSource(doenetML);
    core.setFlags(flags);
    const sourceCatalogs =
        localeResources ?? catalogsFor(documentLocale, doenetML);
    if (
        documentLocale !== undefined ||
        localeResources !== undefined ||
        Object.keys(sourceCatalogs).length > 0
    ) {
        core.setLocaleData({
            locale: documentLocale ?? "en",
            resources: sourceCatalogs,
        });
    }

    await core.initializeWorker({
        activityId: "",
        docId: "1",
        requestedVariantIndex,
        attemptNumber: 1,
        normalizedRoot,
        addNodesToResolver,
        replaceIndexResolutionsInResolver,
        deleteNodesFromResolver,
        resolvePath,
        calculateRootNames,
    });

    const scoreState = {
        score: 0,
        state: "",
    };

    function reportScoreAndStateCallback(data: {
        score: number;
        state: unknown;
        pending?: boolean;
    }) {
        if (data.pending) {
            // A mirror of what the 60-second throttle is holding back
            // (Doenet/DoenetML#1726), not a report for a host to save. Real
            // hosts never see these — `DocViewer` buffers them for the
            // page-hide flush — so this stand-in host ignores them too.
            return;
        }
        scoreState.score = data.score;

        if (
            typeof data.state === "object" &&
            data.state !== null &&
            "coreState" in data.state
        ) {
            scoreState.state = data.state.coreState as string;
        }
    }

    const dastResult = await core.createCoreGenerateDast(
        {
            coreId: "",
            cid: "",
            initializeCounters,
            theme,
            styleOverrides,
            stateVariableChanges: initialState,
        },
        () => null,
        reportScoreAndStateCallback,
        () => null,
        () => null,
        () => null,
        () => null,
        requestSolutionView,
    );

    if (!dastResult.success) {
        throw Error(dastResult.errMsg);
    }

    /**
     * Attempts to resolve the component name `name` to a componentIdx,
     * starting the search algorithm at node `origin`.
     *
     * Throws an error if the name is not resolved.
     */
    function resolvePathToNodeIdx(name: string, origin = 0) {
        return resolvePathImmediatelyToNodeIdx(name, rustCore, core, origin);
    }

    return { core, rustCore, resolvePathToNodeIdx, scoreState };
}

const LOCALES_DIR = path.resolve(__dirname, "../../../../i18n/locales");

/**
 * The locales this repository ships, read once: `createTestCore` asks for a
 * catalog on every call, and the set of directories cannot change under a run.
 */
const AVAILABLE_LOCALES = fs
    .readdirSync(LOCALES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

/**
 * The repository's own catalogs for a locale, as the main thread would deliver
 * them.
 *
 * Only English is bundled into the worker; every other language reaches it as
 * `LocaleData.resources`, loaded on the main thread and sent through
 * `setLocaleData`. A test that asks for a locale without supplying catalogs
 * wants the translation this repository ships, so read it off disk rather than
 * making every locale test carry the plumbing.
 *
 * Only `content` is read, which is `WORKER_NAMESPACES`: the worker computes
 * prose and never draws chrome. The viewer hands over all four namespaces
 * because the one map it builds also feeds its own chrome; the three the core
 * never opens make no difference to what it computes.
 *
 * Negotiated through `negotiateLocales`, the helper `loadLocaleResources`
 * uses, so a tag reaches the catalog the viewer would reach: `es-MX` is served
 * by `es`, and `zh-TW` by `zh-Hant`, which only likely-subtags can work out. A
 * tag nothing answers gets nothing and falls back to English, which is what an
 * untranslated locale does anyway.
 */
function catalogsFor(
    locale: string | undefined,
    doenetML: string,
): Record<string, string> {
    const resources: Record<string, string> = {};
    // The host's locale and every language the source declares — the same set
    // the viewer loads, through the same helper, since a `<document lang>`
    // names a language no prop did. Source that does not parse contributes
    // nothing rather than throwing, which matters here: a great many of these
    // tests feed the core DoenetML that is deliberately malformed.
    for (const tag of [locale, ...declaredLangsInSource(doenetML)]) {
        if (tag === undefined || tag === "en") {
            continue;
        }
        for (const candidate of negotiateLocales([tag], AVAILABLE_LOCALES)) {
            if (candidate === "en" || candidate in resources) {
                break;
            }
            const catalog = path.join(LOCALES_DIR, candidate, "content.ftl");
            if (fs.existsSync(catalog)) {
                resources[candidate] = fs.readFileSync(catalog, "utf-8");
                break;
            }
        }
    }
    return resources;
}
