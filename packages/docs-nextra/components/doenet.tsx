import React from "react";
import {
    DoenetViewer as DoenetViewerOrig,
    DoenetEditor as DoenetEditorOrig,
} from "@doenet/doenetml-iframe";
import "@doenet/virtual-keyboard/style.css";

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
 * `true` only after the component has mounted on the client.
 *
 * The iframe components generate a random per-instance id that is baked into the
 * iframe's `srcDoc`, so they cannot be server-rendered without a hydration mismatch
 * (server and client pick different ids), which leaves the example blank after a page
 * reload. Gating on this renders nothing during SSR and the initial hydration pass,
 * then mounts the real component client-side.
 */
function useClientOnly() {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    return mounted;
}

/**
 * Render DoenetML in an iframe so that its styling/state is completely isolated from the page.
 */
export function DoenetViewer({
    source,
}: React.PropsWithChildren<{ source: string }>) {
    const mounted = useClientOnly();
    if (!mounted) {
        return null;
    }
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
    const mounted = useClientOnly();
    return (
        <div className="doenet-editor-container">
            {mounted ? (
                <DoenetEditorOrig
                    doenetML={source}
                    showFormatter={showFormatter}
                    viewerLocation={viewerLocation}
                    height={height}
                    {...versionProps}
                />
            ) : null}
        </div>
    );
}
