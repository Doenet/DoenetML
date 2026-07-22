import React from "react";
import {
    EDITOR_BOOT_WATCHDOG_MS,
    EDITOR_MAX_CONCURRENT_BOOTS,
    EDITOR_MAX_LIVE,
    EDITOR_PARK_DELAY_MS,
    EDITOR_VISIBLE_MARGIN,
    WINDOWING_ENABLED,
} from "./windowing-config";
import {
    cancelMountRequest,
    notifyEditorState,
    registerEditor,
    releaseMountSlot,
    reportEditorVisibility,
    requestMountSlot,
} from "./editor-mount-manager";

type WindowedEditorProps = {
    source: string;
    showFormatter: boolean;
    viewerLocation: "left" | "right" | "top" | "bottom";
    height: string;
    /** `standaloneUrl`/`cssUrl` (dev) or `doenetmlVersion` (prod). */
    versionProps: Record<string, unknown>;
    /**
     * The real (iframe) editor, passed in so the single
     * `next/dynamic(..., {ssr:false})` definition stays in `doenet.tsx`.
     */
    DoenetEditorOrig: React.ComponentType<any>;
};

/**
 * Lazy-mount / windowing wrapper for a docs editor example (#1441 stream B,
 * docs host). The iframe `<DoenetEditor>` has no built-in `mountPolicy`, so
 * this wrapper adds one at the docs layer: it renders a fixed-height
 * placeholder (editors have a known height, so mount/unmount never shifts the
 * layout) until the example nears the viewport, then mounts the real editor —
 * subject to a page-wide boot-concurrency cap and live-count budget enforced
 * by `editor-mount-manager`. Off-screen editors beyond the budget are unloaded
 * (least-recently-visible first) and reboot from their documented source when
 * scrolled back.
 */
export function WindowedEditor({
    source,
    showFormatter,
    viewerLocation,
    height,
    versionProps,
    DoenetEditorOrig,
}: WindowedEditorProps) {
    const id = React.useId();
    const [mounted, setMounted] = React.useState(false);

    const containerRef = React.useRef<HTMLDivElement>(null);
    const intersectingRef = React.useRef(false);
    const mountedRef = React.useRef(false);
    const watchdogRef = React.useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );
    const bootCompleteRef = React.useRef(false);

    React.useEffect(() => {
        mountedRef.current = mounted;
    }, [mounted]);

    const clearWatchdog = React.useCallback(() => {
        if (watchdogRef.current !== null) {
            clearTimeout(watchdogRef.current);
            watchdogRef.current = null;
        }
    }, []);

    // Fires once the editor's document renders — the boot is done, so free the
    // slot for the next queued editor. Stable identity (only depends on the
    // stable `id`/`clearWatchdog`) so it is not re-proxied across the iframe
    // Comlink boundary on every render (which would leak a MessagePort).
    const onDocumentStructure = React.useCallback(() => {
        if (bootCompleteRef.current) {
            return;
        }
        bootCompleteRef.current = true;
        clearWatchdog();
        releaseMountSlot(id);
    }, [id, clearWatchdog]);

    React.useEffect(() => {
        if (!WINDOWING_ENABLED) {
            return;
        }
        const el = containerRef.current;
        if (!el) {
            return;
        }

        // The manager asks us to unload when this editor is over budget and
        // off-screen.
        const requestEvict = () => {
            clearWatchdog();
            bootCompleteRef.current = false;
            releaseMountSlot(id); // no-op if the boot already completed
            mountedRef.current = false;
            setMounted(false);
            notifyEditorState(id, "unmounted");
        };

        const unregister = registerEditor({
            id,
            maxLive: EDITOR_MAX_LIVE,
            maxConcurrentBoots: EDITOR_MAX_CONCURRENT_BOOTS,
            parkDelayMs: EDITOR_PARK_DELAY_MS,
            requestEvict,
        });

        const tryMount = () => {
            if (mountedRef.current) {
                return;
            }
            requestMountSlot(id, () => {
                // Granted (possibly asynchronously). If we scrolled back out
                // of the margin meanwhile, give the slot up for someone else.
                if (!intersectingRef.current) {
                    releaseMountSlot(id);
                    return;
                }
                bootCompleteRef.current = false;
                mountedRef.current = true;
                setMounted(true);
                notifyEditorState(id, "mounted");
                clearWatchdog();
                watchdogRef.current = setTimeout(() => {
                    releaseMountSlot(id);
                }, EDITOR_BOOT_WATCHDOG_MS);
            });
        };

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[entries.length - 1];
                const intersecting = entry.isIntersecting;
                intersectingRef.current = intersecting;
                reportEditorVisibility(id, intersecting);
                if (intersecting) {
                    tryMount();
                } else {
                    cancelMountRequest(id);
                }
            },
            { rootMargin: EDITOR_VISIBLE_MARGIN },
        );
        observer.observe(el);

        return () => {
            observer.disconnect();
            clearWatchdog();
            cancelMountRequest(id);
            releaseMountSlot(id);
            unregister();
        };
    }, [id, clearWatchdog]);

    // Windowing off: render the editor the historical (immediate) way.
    if (!WINDOWING_ENABLED) {
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

    return (
        <div
            ref={containerRef}
            className="doenet-editor-container"
            style={{ width: "100%" }}
        >
            {mounted ? (
                <DoenetEditorOrig
                    doenetML={source}
                    showFormatter={showFormatter}
                    viewerLocation={viewerLocation}
                    height={height}
                    documentStructureCallback={onDocumentStructure}
                    {...versionProps}
                />
            ) : (
                <div
                    data-doenet-editor-placeholder="true"
                    style={{
                        width: "100%",
                        height,
                        boxSizing: "border-box",
                    }}
                />
            )}
        </div>
    );
}
