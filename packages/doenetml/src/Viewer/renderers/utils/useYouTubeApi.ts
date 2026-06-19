import { useEffect, useState } from "react";

// Globals provided by the YouTube IFrame Player API
// (https://developers.google.com/youtube/iframe_api_reference). The API
// script is loaded lazily by this hook (see `loadScript` below); once it
// finishes parsing it populates `window.YT` and invokes
// `window.onYouTubeIframeAPIReady` exactly once.
declare global {
    interface Window {
        YT?: { Player: new (...args: any[]) => any; PlayerState: any };
        onYouTubeIframeAPIReady?: () => void;
    }
}

const YT_API_SRC = "https://www.youtube.com/iframe_api";

// `window.onYouTubeIframeAPIReady` is a single-slot global, but multiple
// components may need to know when YT is ready. These module-level
// singletons multiplex that one callback to N subscribers.
const listeners = new Set<() => void>();
let installed = false;

// Wrap (not replace) `window.onYouTubeIframeAPIReady` exactly once so any
// callback set by other code still fires alongside our subscriber fan-out.
function install() {
    if (installed) return;
    installed = true;
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
        previous?.();
        for (const listener of listeners) {
            listener();
        }
    };
}

function isReady() {
    return Boolean(window.YT?.Player);
}

// Inject the YouTube IFrame API <script> tag into <head> if it hasn't been
// added already. The DOM check makes this safe to call from multiple
// components (and across HMR reloads in dev).
function loadScript() {
    if (document.querySelector(`script[src="${YT_API_SRC}"]`)) {
        return;
    }
    const script = document.createElement("script");
    script.src = YT_API_SRC;
    document.head.appendChild(script);
}

/**
 * React hook that returns `true` once the YouTube IFrame Player API is
 * loaded (`window.YT.Player` is available), and `false` until then. Use it
 * to gate `new window.YT.Player(...)` construction in an effect: the hook
 * re-renders consumers when the API becomes ready, which is asynchronous
 * and may not happen by the first render.
 *
 * When `shouldLoad` is `true` the hook injects the API `<script>` tag (if
 * not already present) so the load can begin. When `false` (the default)
 * it does not trigger any network request to youtube.com; it still
 * reports `true` if the API was loaded by a previous consumer. This lets
 * callers defer the script load until a YouTube video is actually about
 * to render.
 */
export function useYouTubeApi(shouldLoad: boolean = false) {
    const [ready, setReady] = useState(isReady);

    useEffect(() => {
        if (!shouldLoad) {
            return;
        }
        if (isReady()) {
            setReady(true);
            return;
        }
        install();
        const listener = () => setReady(true);
        // Subscribe before loadScript() so we cannot miss
        // `onYouTubeIframeAPIReady` if the script is already in flight from a
        // prior mount and finishes between these two statements.
        listeners.add(listener);
        loadScript();
        // Defense-in-depth: if the API became ready between the top-of-effect
        // `isReady()` check and now, fall through synchronously instead of
        // waiting for a callback that has already fired.
        if (isReady()) {
            setReady(true);
        }
        return () => {
            listeners.delete(listener);
        };
    }, [shouldLoad]);

    return ready;
}
