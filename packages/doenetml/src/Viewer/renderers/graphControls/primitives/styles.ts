import type React from "react";

export const GRAPH_CONTROL_CARD_STYLE: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px",
    border: "1px solid var(--canvasText)",
    borderRadius: "8px",
};

export const GRAPH_CONTROL_HEADING_STYLE: React.CSSProperties = {
    fontWeight: 600,
    margin: 0,
    fontSize: "1em",
};

export const GRAPH_CONTROL_INPUT_BLOCK_STYLE: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginTop: "8px",
};

export const GRAPH_CONTROL_INLINE_INPUT_STACK_STYLE: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    width: "100%",
};

export const GRAPH_CONTROL_TEXT_INPUT_STYLE: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    minWidth: 0,
};

export const GRAPH_CONTROL_ERROR_TEXT_STYLE: React.CSSProperties = {
    color: "#b00020",
    fontSize: "0.85em",
};

export const GRAPH_CONTROL_SECTION_HEADING_STYLE: React.CSSProperties = {
    fontWeight: 600,
    margin: "8px 0 2px 0",
    fontSize: "0.9em",
};

export const GRAPH_CONTROL_SECTION_HEADING_WITH_DIVIDER_STYLE: React.CSSProperties =
    {
        ...GRAPH_CONTROL_SECTION_HEADING_STYLE,
        marginTop: "12px",
        paddingTop: "8px",
        borderTop: "1px solid var(--canvasText)",
    };
