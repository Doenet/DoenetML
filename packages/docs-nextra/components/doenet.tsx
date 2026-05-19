import React from "react";
import dynamic from "next/dynamic";
import "@doenet/virtual-keyboard/style.css";

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
 * Render DoenetML in an iframe so that its styling/state is completely isolated from the page.
 */
export function DoenetViewer({
    source,
}: React.PropsWithChildren<{ source: string }>) {
    return <DoenetViewerOrig doenetML={source} {...versionProps} />;
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
    return (
        <div className="doenet-editor-container">
            <DoenetEditorOrig
                doenetML={source}
                showFormatter={showFormatter}
                viewerLocation={viewerLocation}
                height={height}
                {...versionProps}
            />
        </div>
    );
}
