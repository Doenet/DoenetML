export function getNonInlineMediaLayoutStyles({
    horizontalAlign,
    mediaWidth,
}: {
    horizontalAlign: string;
    mediaWidth: string;
}) {
    return {
        outerStyle: {
            display: "flex",
            justifyContent: horizontalAlign,
            margin: "12px 0",
        },
        innerStyle: {
            width: "100%",
        },
        mediaContainerStyle: {
            display: "flex",
            justifyContent: horizontalAlign,
            width: "100%",
        },
        mediaColumnStyle: {
            display: "flex",
            flexDirection: "column",
            width: mediaWidth,
            maxWidth: "100%",
        },
    };
}

export function getBlockMarginWithOptionalTopSuppression({
    suppressTopMargin,
    top = 12,
    bottom = 12,
}: {
    suppressTopMargin: boolean;
    top?: number;
    bottom?: number;
}) {
    return suppressTopMargin ? `0 0 ${bottom}px 0` : `${top}px 0 ${bottom}px 0`;
}
