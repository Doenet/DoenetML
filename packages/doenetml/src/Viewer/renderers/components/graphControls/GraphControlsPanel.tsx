import React from "react";

type GraphControlsPanelProps = {
    id: string;
    ariaLabel?: string;
    children: React.ReactNode;
};

export default function GraphControlsPanel({
    id,
    ariaLabel = "Graph controls",
    children,
}: GraphControlsPanelProps) {
    return (
        <div id={id} style={{ marginTop: "12px", marginBottom: "12px" }}>
            <div
                role="group"
                aria-label={ariaLabel}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    width: "100%",
                    minWidth: 0,
                    overflowX: "hidden",
                }}
            >
                {children}
            </div>
        </div>
    );
}
