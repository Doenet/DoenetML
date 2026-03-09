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
