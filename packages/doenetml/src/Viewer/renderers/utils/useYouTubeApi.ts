import { useEffect, useState } from "react";

// Globals provided by the YouTube IFrame Player API
// (https://developers.google.com/youtube/iframe_api_reference). The API
// script is loaded elsewhere on the page; once it finishes parsing it
// populates `window.YT` and invokes `window.onYouTubeIframeAPIReady` exactly
// once.
declare global {
    interface Window {
        YT?: { Player: new (...args: any[]) => any; PlayerState: any };
        onYouTubeIframeAPIReady?: () => void;
    }
}

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

/**
 * React hook that returns `true` once the YouTube IFrame Player API is
 * loaded (`window.YT.Player` is available), and `false` until then.
 *
 * Use this to gate `new window.YT.Player(...)` construction in an effect:
 * the hook re-renders consumers when the API becomes ready, even though it
 * loads asynchronously and may not be present at the first render.
 */
export function useYouTubeApi() {
    const [ready, setReady] = useState(isReady);

    useEffect(() => {
        if (isReady()) {
            setReady(true);
            return;
        }
        install();
        const listener = () => setReady(true);
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    }, []);

    return ready;
}
