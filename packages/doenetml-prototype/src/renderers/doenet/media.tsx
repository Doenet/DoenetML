import React from "react";
import { BasicComponent } from "../types";
import "./media.css";

/** What an image and a video are laid out by in the flow (ADR 0078). */
type MediaLayout = {
    /** Its width: pixels when `isAbsolute`, else a percent of the line. */
    width: { size: number; isAbsolute: boolean };
    /** `left`, `center` or `right`, when it is a block. */
    horizontalAlign: string;
    /** `block`, or `inline` in the line of text. */
    displayMode: string;
    shortDescription: string;
    hidden: boolean;
};

type ImageData = {
    props: MediaLayout & {
        /** A URL, or a `doenet:` media reference, which this renderer
         * cannot resolve. */
        source: string;
        decorative: boolean;
        aspectRatio: number | null;
    };
};

type VideoData = {
    props: MediaLayout & {
        /** A YouTube video's id. */
        youtube: string | null;
        /** A video file's URL. */
        source: string | null;
        aspectRatio: number;
    };
};

/** CSS for a width the core settled. */
function widthCss({ size, isAbsolute }: MediaLayout["width"]) {
    if (!Number.isFinite(size)) return undefined;
    return isAbsolute ? `${size}px` : `${size}%`;
}

/** A medium in the flow: in the line of text, or a block aligned left,
 * center or right, as the current core lays one out. */
function MediaBox({
    layout,
    children,
}: React.PropsWithChildren<{ layout: MediaLayout }>) {
    if (layout.displayMode === "inline") {
        return <span className="media media-inline">{children}</span>;
    }
    const align = ["left", "center", "right"].includes(layout.horizontalAlign)
        ? layout.horizontalAlign
        : "center";
    return <div className={`media media-block media-${align}`}>{children}</div>;
}

/**
 * Image: the picture its source names, as wide as the core settled, with
 * its short description as its alternative text (none when decorative). A
 * `doenet:` source, which only a Doenet host resolves, is drawn as an
 * empty bordered box.
 */
export const Image: BasicComponent<ImageData> = ({ node, htmlId }) => {
    const props = node.data.props;
    if (props.hidden) return null;
    const url = /^\s*doenet:/i.test(props.source ?? "") ? "" : props.source;
    const style: React.CSSProperties = {
        maxWidth: "100%",
        width: widthCss(props.width),
    };
    if ((props.aspectRatio ?? 0) > 0) {
        style.aspectRatio = String(props.aspectRatio);
    }
    const alt = props.decorative ? "" : props.shortDescription || undefined;
    return (
        <MediaBox layout={props}>
            {url ? (
                <img id={htmlId} src={url} style={style} alt={alt} />
            ) : (
                <span
                    id={htmlId}
                    className="media-placeholder"
                    style={style}
                    role={alt ? "img" : undefined}
                    aria-label={alt || undefined}
                />
            )}
        </MediaBox>
    );
};

/**
 * Video: a YouTube video's player, or a video file with its controls, as
 * wide as the core settled, at its aspect ratio.
 */
export const Video: BasicComponent<VideoData> = ({ node, htmlId }) => {
    const props = node.data.props;
    if (props.hidden) return null;
    const style: React.CSSProperties = {
        maxWidth: "100%",
        width: widthCss(props.width),
        aspectRatio: String(props.aspectRatio || 16 / 9),
    };
    const label = props.shortDescription || undefined;
    let player: React.ReactNode;
    if (props.youtube) {
        player = (
            <iframe
                id={htmlId}
                style={style}
                src={`https://www.youtube.com/embed/${encodeURIComponent(props.youtube)}`}
                title={label ?? "Video"}
                allow="fullscreen; picture-in-picture"
            />
        );
    } else if (props.source) {
        player = (
            <video
                id={htmlId}
                style={style}
                src={props.source}
                controls
                aria-label={label}
            />
        );
    } else {
        player = (
            <span id={htmlId} className="media-placeholder" style={style} />
        );
    }
    return <MediaBox layout={props}>{player}</MediaBox>;
};
