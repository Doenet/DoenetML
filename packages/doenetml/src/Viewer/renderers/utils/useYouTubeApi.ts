import { useEffect, useState } from "react";

declare global {
    interface Window {
        YT?: { Player: new (...args: any[]) => any; PlayerState: any };
        onYouTubeIframeAPIReady?: () => void;
    }
}

const listeners = new Set<() => void>();
let installed = false;

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
