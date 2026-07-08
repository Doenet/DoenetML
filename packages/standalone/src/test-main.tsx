/*
 * This file is for running a dev test of the standalone doenet viewer and editor.
 * It does not show up in the bundled package.
 */
import {
    renderDoenetViewerToContainer,
    renderDoenetEditorToContainer,
} from "./index";

const SOURCE_STORAGE_KEY_PREFIX = "doenetml-standalone-dev-source-";
const SAVE_DEBOUNCE_MS = 500;

const saveTimers = new Map<string, ReturnType<typeof setTimeout>>();

// Wired to the editor's immediate (per-keystroke) change callback, so debounce
// the writes: calling localStorage.setItem synchronously on every keystroke can
// noticeably block the UI for larger documents.
function saveSource(key: string, source: string) {
    const pending = saveTimers.get(key);
    if (pending !== undefined) {
        window.clearTimeout(pending);
    }
    saveTimers.set(
        key,
        window.setTimeout(() => {
            saveTimers.delete(key);
            try {
                localStorage.setItem(key, source);
            } catch {
                // Ignore localStorage failures in constrained environments.
            }
        }, SAVE_DEBOUNCE_MS),
    );
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".doenetml-viewer").forEach((container) => {
        console.log("Rendering doenet viewer to container", container);
        renderDoenetViewerToContainer(container);
    });
    document
        .querySelectorAll(".doenetml-editor")
        .forEach((container, index) => {
            console.log("Rendering doenet editor to container", container);
            const storageKey = `${SOURCE_STORAGE_KEY_PREFIX}${index}`;
            let storedSource: string | null = null;
            try {
                storedSource = localStorage.getItem(storageKey);
            } catch {
                // Ignore localStorage failures in constrained environments.
            }
            renderDoenetEditorToContainer(
                container,
                storedSource ?? undefined,
                {
                    immediateDoenetmlChangeCallback: (source: string) =>
                        saveSource(storageKey, source),
                },
            );
        });
});
