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
// added already. Deferred until a YouTube video is actually about to render
// so that documents without YouTube videos make no network request to
// youtube.com (see issue #1202).
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
 * loaded (`window.YT.Player` is available), and `false` until then.
 *
 * Pass `shouldLoad=true` to trigger lazy injection of the API <script>;
 * when `false` (the default) the hook is inert and no network request is
 * made. Use this to gate `new window.YT.Player(...)` construction in an
 * effect: the hook re-renders consumers when the API becomes ready, even
 * though it loads asynchronously and may not be present at the first
 * render.
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
        loadScript();
        const listener = () => setReady(true);
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    }, [shouldLoad]);

    return ready;
}
