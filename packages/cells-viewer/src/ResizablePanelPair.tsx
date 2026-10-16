import React from "react";

/** Two panels side by side with a draggable gutter between them; stacked
 * on a narrow screen (see `EditorViewer.css`). */
export function ResizablePanelPair({
    panelA,
    panelB,
    initialFraction = 0.5,
}: {
    panelA: React.ReactNode;
    panelB: React.ReactNode;
    initialFraction?: number;
}) {
    const [fraction, setFraction] = React.useState(initialFraction);
    const ref = React.useRef<HTMLDivElement>(null);
    const dragging = React.useRef(false);

    function track(event: React.PointerEvent<HTMLDivElement>) {
        const box = ref.current?.getBoundingClientRect();
        if (!box || !dragging.current) return;
        const f = (event.clientX - box.left) / box.width;
        setFraction(Math.min(0.85, Math.max(0.15, f)));
    }

    return (
        <div
            className="resizable-panel-pair"
            ref={ref}
            style={{
                gridTemplateColumns: `minmax(0, ${fraction}fr) auto minmax(0, ${1 - fraction}fr)`,
            }}
        >
            <div className="resizable-panel">{panelA}</div>
            <div
                className="resizable-gutter"
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize the editor and the viewer"
                onPointerDown={(e) => {
                    dragging.current = true;
                    e.currentTarget.setPointerCapture(e.pointerId);
                }}
                onPointerMove={track}
                onPointerUp={() => {
                    dragging.current = false;
                }}
            />
            <div className="resizable-panel">{panelB}</div>
        </div>
    );
}
