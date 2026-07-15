import React from "react";
import dynamic from "next/dynamic";
import "@doenet/virtual-keyboard/style.css";
import type { MountPolicy } from "@doenet/doenetml-iframe";
import {
    VIEWER_MAX_CONCURRENT_BOOTS,
    VIEWER_MAX_LIVE,
    VIEWER_PARK_DELAY_MS,
    VIEWER_VISIBLE_MARGIN,
    WINDOWING_ENABLED,
} from "./windowing-config";
import { WindowedEditor } from "./windowed-editor";

/**
 * The iframe components generate a random per-instance id that is baked into the
 * iframe's `srcDoc`, so they cannot be server-rendered without a hydration mismatch
 * (server and client pick different ids), which leaves the example blank after a page
 * reload. `next/dynamic` with `ssr: false` skips SSR entirely and mounts these
 * client-side only. The root cause in `@doenet/doenetml-iframe` is tracked in #1139.
 */
const DoenetViewerOrig = dynamic(
    () => import("./doenet-iframe").then((m) => m.DoenetViewer),
    { ssr: false },
);
const DoenetEditorOrig = dynamic(
    () => import("./doenet-iframe").then((m) => m.DoenetEditor),
    { ssr: false },
);

/**
 * Which standalone DoenetML build the embedded examples load.
 *
 * In development (`next dev`), load the locally-built standalone bundle that the
 * `build:pre-copy` task copies into `public/bundle/`. This lets doc examples exercise
 * features that are new in the current PR, instead of the version published off `main`.
 *
 * In a production build (`next build`, used for the published docs), keep using the
 * `dev` version from the CDN.
 */
const versionProps =
    process.env.NODE_ENV === "development"
        ? {
              standaloneUrl: "/bundle/doenet-standalone.js",
              cssUrl: "/bundle/style.css",
          }
        : { doenetmlVersion: "dev" };

/**
 * Windowed mounting for viewer examples (#1441 stream B, docs host): reuse the
 * built-in `mountPolicy` from `@doenet/doenetml-iframe`, so a page keeps at most
 * `VIEWER_MAX_LIVE` viewers live and parks off-screen ones. `allowSaveState`
 * makes parking lossless (the wrapper snapshots the flushed report in memory and
 * reseeds it on restore); it is otherwise inert here — no docs host consumes
 * `SPLICE.reportScoreAndState` and nothing hits the network.
 */
const viewerMountPolicy: MountPolicy = {
    mode: "windowed",
    maxLiveViewers: VIEWER_MAX_LIVE,
    maxConcurrentBoots: VIEWER_MAX_CONCURRENT_BOOTS,
    visibleMargin: VIEWER_VISIBLE_MARGIN,
    parkDelayMs: VIEWER_PARK_DELAY_MS,
};

const windowedViewerProps = WINDOWING_ENABLED
    ? { flags: { allowSaveState: true }, mountPolicy: viewerMountPolicy }
    : {};

/**
 * Render DoenetML in an iframe so that its styling/state is completely isolated from the page.
 */
export function DoenetViewer({
    source,
}: React.PropsWithChildren<{ source: string }>) {
    return (
        <DoenetViewerOrig
            doenetML={source}
            {...windowedViewerProps}
            {...versionProps}
        />
    );
}

export function DoenetEditor({
    source,
    showFormatter = false,
    viewerLocation = "right",
    height = "500px",
}: React.PropsWithChildren<{
    source: string;
    showFormatter?: boolean;
    viewerLocation?: "left" | "right" | "top" | "bottom";
    height?: string;
}>) {
    // Editors have no built-in `mountPolicy`, so the docs-layer `WindowedEditor`
    // adds lazy mounting + a live-count budget for them (#1441 stream B).
    return (
        <WindowedEditor
            source={source}
            showFormatter={showFormatter}
            viewerLocation={viewerLocation}
            height={height}
            versionProps={versionProps}
            DoenetEditorOrig={DoenetEditorOrig}
        />
    );
}
