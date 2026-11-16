// youtube player code based on Ximera youtube player
// https://github.com/XimeraProject/server
// https://github.com/XimeraProject/server/blob/master/public/javascripts/youtube.js

import React, { useRef, useEffect } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { sizeToCSS } from "./utils/css";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import { DescriptionAsDetails, DescriptionPopover } from "./utils/Description";
import { getNonInlineMediaLayoutStyles } from "./utils/nonInlineMediaLayout";
import { NonInlineMediaWrapper } from "./utils/NonInlineMediaWrapper";
import { useYouTubeApi } from "./utils/useYouTubeApi";
import {
    VideoWatchTracker,
    type VideoWatchRecord,
} from "./utils/videoWatchTracker";
import "./video.css";

interface VideoSVs {
    [key: string]: any;
    hidden: boolean;
    width?: { size: string; isAbsolute: boolean };
    aspectRatio?: number;
    displayMode: string;
    horizontalAlign?: string;
    renderInlineForListItem?: boolean;
    shortDescription?: string;
    source?: string;
    state?: string;
    time?: number;
    youtube?: string;
}

export default React.memo(function Video(props: UseDoenetRendererProps) {
    let { id, SVs, children, actions, callAction } =
        useDoenetRenderer<VideoSVs>(props);

    let player = useRef<any>(null);
    // The segments watched and the seeks, worked out from the player's
    // events and the position polled while it plays.
    let tracker = useRef(new VideoWatchTracker());
    let lastPlayerState = useRef<any>(null);
    let pauseTimeoutId = useRef<any>(null);
    let pollIntervalId = useRef<any>(null);
    let lastSetTimeAction = useRef<number | null>(null);

    let lastSVsState = useRef<any>(null);

    const ref = useRef<HTMLDivElement | null>(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    // Only request the YouTube IFrame API when this component is actually
    // rendering a YouTube video; non-YouTube sources must not trigger a
    // network request to youtube.com.
    const ytReady = useYouTubeApi(Boolean(SVs.youtube));

    // Tell the core when the video itself is replaced, so it can drop the
    // playback state belonging to the old one (see `recordVideoSourceChanged`).
    // Declared before the player effect below so the reset is dispatched before
    // a player for the new source can exist to be seeked.
    const lastVideoSource = useRef<string | null | undefined>(undefined);
    useEffect(() => {
        const videoSource = SVs.youtube ?? SVs.source ?? null;
        const previous = lastVideoSource.current;
        lastVideoSource.current = videoSource;
        // `undefined` is the first render for this component: whatever is in
        // `time`/`segmentsWatched` came from saved state and describes the
        // video about to be shown, so a reload still resumes where the viewer
        // left off.
        if (previous !== undefined && previous !== videoSource) {
            callAction({ action: actions.recordVideoSourceChanged });
        }
    }, [SVs.youtube, SVs.source]);

    useEffect(() => {
        if (!SVs.youtube || !ytReady || !window.YT) {
            return;
        }
        player.current = new window.YT.Player(id, {
            playerVars: {
                autoplay: 0,
                controls: 1,
                modestbranding: 1,
                rel: 0,
            },
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange,
                onPlaybackRateChange: onPlaybackRateChange,
            },
        });
        return () => {
            // Stop pending timers before tearing down the player so that the
            // 200ms poll loop and the 250ms pause-finalize timeout don't fire
            // against a destroyed/null player.current.
            clearInterval(pollIntervalId.current);
            clearTimeout(pauseTimeoutId.current);
            player.current?.destroy();
            player.current = null;
            // Reset state tracked across the previous player's lifetime so it
            // doesn't leak into the next one (e.g. SVs.state="playing" before
            // a source switch must still trigger playVideo() on the new
            // player).
            lastSVsState.current = null;
            lastPlayerState.current = null;
            lastSetTimeAction.current = null;
            tracker.current = new VideoWatchTracker();
        };
    }, [SVs.youtube, ytReady, id]);

    /** The player's position now, on the clock, at its playback rate. */
    function currentSample() {
        return {
            position: player.current.getCurrentTime(),
            wallTime: performance.now(),
            rate: player.current.getPlaybackRate(),
        };
    }

    /** Record what the tracker found as watched segments and skips. */
    function recordWatching(records: VideoWatchRecord[], duration: number) {
        for (const record of records) {
            if (record.kind === "watched") {
                callAction({
                    action: actions.recordVideoWatched,
                    args: {
                        beginTime: record.beginTime,
                        endTime: record.endTime,
                        duration,
                        rates: record.rates,
                    },
                });
            } else {
                callAction({
                    action: actions.recordVideoSkipped,
                    args: {
                        beginTime: record.beginTime,
                        endTime: record.endTime,
                        duration,
                    },
                });
            }
        }
    }

    // Polled every 200 ms while playing. The YouTube player reports no
    // event for a seek, and one that lands in what is already loaded may
    // not even pass through `BUFFERING`, so the tracker finds seeks from the
    // position: one that moved further than playback explains in the time
    // since the last poll.
    function pollCurrentTime() {
        const sample = currentSample();
        recordWatching(
            tracker.current.sample(sample),
            player.current.getDuration(),
        );

        let roundTime = Math.floor(sample.position);
        if (roundTime !== lastSetTimeAction.current) {
            lastSetTimeAction.current = roundTime;
            callAction({
                action: actions.setTime,
                args: {
                    time: roundTime,
                },
            });
        }
    }

    function onPlayerReady(event: any) {
        //setPlaybackQuality doesn't seem to work
        // event.target.setPlaybackQuality("hd720");
        // player.current.setPlaybackQuality("hd720");

        callAction({
            action: actions.recordVideoReady,
            args: {
                duration: player.current.getDuration(),
            },
        });
    }

    function onPlayerStateChange(event: any) {
        //setPlaybackQuality doesn't seem to work
        // if (event.data == YT.PlayerState.BUFFERING) {
        // event.target.setPlaybackQuality('hd720');
        //     event.target.setPlaybackQuality('hd1080');
        // }

        // Safe: this callback only fires for an initialized YT player, which
        // requires `window.YT` to be loaded.
        const PlayerState = window.YT!.PlayerState;

        let duration = player.current.getDuration();

        switch (event.data) {
            case PlayerState.PLAYING:
                if (pauseTimeoutId.current !== null) {
                    // A pause followed this quickly by playing is the player
                    // seeking (it reports PAUSED, then PLAYING), not the
                    // viewer pausing: playback goes on, and the tracker
                    // records the seek from the new position.
                    clearTimeout(pauseTimeoutId.current);
                    pauseTimeoutId.current = null;
                    recordWatching(
                        tracker.current.sample(currentSample()),
                        duration,
                    );
                }
                if (lastPlayerState.current !== event.data) {
                    const sample = currentSample();

                    // The player reports no event for a seek, so poll its
                    // position every 200 ms while it plays (`pollCurrentTime`).
                    clearInterval(pollIntervalId.current);
                    pollIntervalId.current = window.setInterval(
                        pollCurrentTime,
                        200,
                    );

                    // Starting somewhere other than where it was paused is a
                    // skip.
                    recordWatching(tracker.current.play(sample), duration);

                    callAction({
                        action: actions.recordVideoStarted,
                        args: {
                            beginTime: sample.position,
                            duration,
                            rate: sample.rate,
                        },
                    });

                    lastPlayerState.current = event.data;
                }

                break;

            case PlayerState.PAUSED: {
                // When a user pauses a video, we record the segment watched
                // and the pause. However, when a user skips to a new point
                // without pausing, the player emits PAUSED, BUFFERING,
                // PLAYING, or just PAUSED, PLAYING. So wait 250 ms: a
                // BUFFERING or PLAYING in that time means a seek, recorded
                // there, and no pause.
                const pausedSample = currentSample();

                clearTimeout(pauseTimeoutId.current);
                pauseTimeoutId.current = setTimeout(function () {
                    pauseTimeoutId.current = null;
                    clearInterval(pollIntervalId.current);

                    // Also when paused while buffering, with no segment
                    // played: the tracker then records where it was paused.
                    recordWatching(
                        tracker.current.stop(pausedSample, "paused"),
                        duration,
                    );
                    callAction({
                        action: actions.recordVideoPaused,
                        args: {
                            endTime: pausedSample.position,
                            duration,
                        },
                    });

                    lastPlayerState.current = event.data;
                }, 250);

                break;
            }

            case PlayerState.BUFFERING:
                clearTimeout(pauseTimeoutId.current);
                pauseTimeoutId.current = null;

                if (tracker.current.playing) {
                    // What was played ends here, or where the video was last
                    // seen playing if this follows a seek, which the tracker
                    // records as a skip.
                    recordWatching(
                        tracker.current.stop(currentSample(), "buffering"),
                        duration,
                    );
                    lastPlayerState.current = event.data;
                }

                break;

            case PlayerState.ENDED: {
                // BADBAD: We're treating ENDED as though it meant the user
                // completed the video, even thought it
                // doesn't necessarily mean the learner watched ALL the video

                clearInterval(pollIntervalId.current);
                clearTimeout(pauseTimeoutId.current);
                pauseTimeoutId.current = null;

                // The player reached the end, so the watched segment runs to
                // the full duration, even though the current time it reports
                // at this point is often a fraction of a second short of it.
                const sample = currentSample();
                recordWatching(
                    tracker.current.stop(
                        sample,
                        "ended",
                        Math.max(sample.position, duration),
                    ),
                    duration,
                );

                callAction({
                    action: actions.recordVideoCompleted,
                    args: {
                        duration,
                    },
                });

                lastPlayerState.current = event.data;

                break;
            }

            case PlayerState.UNSTARTED:
                lastPlayerState.current = event.data;

                break;
        }
    }

    function onPlaybackRateChange(event: any) {
        recordWatching(
            tracker.current.rateChanged({
                position: player.current.getCurrentTime(),
                wallTime: performance.now(),
                rate: event.data,
            }),
            player.current.getDuration(),
        );
    }

    if (player.current?.getPlayerState) {
        // Safe: player exists, so `window.YT` is loaded.
        const PlayerState = window.YT!.PlayerState;
        let playerState = player.current.getPlayerState();
        if (SVs.state !== lastSVsState.current) {
            if (SVs.state === "playing") {
                if (
                    playerState === PlayerState.UNSTARTED ||
                    playerState === PlayerState.PAUSED ||
                    playerState === PlayerState.CUED ||
                    playerState === PlayerState.ENDED
                ) {
                    player.current.playVideo();
                }
            } else if (SVs.state === "stopped") {
                if (playerState === PlayerState.PLAYING) {
                    player.current.pauseVideo();
                }
            }
            lastSVsState.current = SVs.state;
        }

        if (SVs.time !== Number(lastSetTimeAction.current)) {
            let time = SVs.time ?? 0;
            let duration = player.current.getDuration();

            // Until the video's metadata loads, the player reports a duration
            // of 0; clamping to it would overwrite the viewer's saved position
            // with 0.
            if (duration > 0 && time > duration) {
                time = Math.floor(duration);
                callAction({
                    action: actions.setTime,
                    args: {
                        time,
                    },
                });
            }
            if (time !== Number(lastSetTimeAction.current)) {
                if (
                    player.current.getPlayerState() === PlayerState.CUED &&
                    SVs.state !== "playing"
                ) {
                    // Seeking a cued player starts playing it (YouTube
                    // documents this). Viewers restoring a saved position
                    // this way were left with a black frame with no poster
                    // and no controls. A browser blocking that autoplay is
                    // the likely cause, but it has not been reproduced. Cue
                    // the video at the offset instead, which keeps the
                    // player CUED and usable. (Not when it has been told to
                    // play: re-cueing would cancel that play, and a seek into
                    // a starting video is what was asked for.)
                    player.current.cueVideoById({
                        videoId: SVs.youtube,
                        startSeconds: time,
                    });
                } else {
                    player.current.seekTo(time, true);
                }

                lastSetTimeAction.current = time;
            }
        }
    }

    if (SVs.hidden) return null;

    let outerStyle: React.CSSProperties = {};
    let innerStyle: React.CSSProperties = {};
    let mediaContainerStyle: React.CSSProperties = {};
    let mediaColumnStyle: React.CSSProperties = {};

    if (SVs.displayMode === "inline") {
        outerStyle = {
            display: "inline-block",
            verticalAlign: "middle",
            margin: "12px 0",
        };
        innerStyle = {
            display: "inline-flex",
            alignItems: "start",
        };
    } else {
        ({ outerStyle, innerStyle, mediaContainerStyle, mediaColumnStyle } =
            getNonInlineMediaLayoutStyles({
                horizontalAlign: SVs.horizontalAlign,
                mediaWidth: sizeToCSS(SVs.width),
            }));
    }

    let videoStyle = {
        maxWidth: "100%",
        width: sizeToCSS(SVs.width),
        aspectRatio: String(SVs.aspectRatio),
    };

    let videoTag;

    const shortDescription = SVs.shortDescription || undefined;

    // description will be the one non-null child
    const descriptionChild = children.find((child) => child);

    let descriptionId: string | undefined = undefined;
    let description: React.ReactNode | null = null;

    if (descriptionChild) {
        descriptionId = `${id}-description-content`;
        description =
            SVs.displayMode === "inline" ? (
                <DescriptionPopover>
                    <div id={descriptionId}>{descriptionChild}</div>
                </DescriptionPopover>
            ) : (
                <DescriptionAsDetails>
                    <div id={descriptionId}>{descriptionChild}</div>
                </DescriptionAsDetails>
            );
    }

    if (SVs.youtube) {
        videoTag = (
            <iframe
                // Force React to unmount/remount the iframe when the YouTube
                // id changes. React handles the iframe swap during commit;
                // the effect's cleanup then destroys the old YT.Player to
                // release its internal listeners/timers, and the new effect
                // binds a fresh player to the freshly mounted iframe.
                key={SVs.youtube}
                id={id}
                style={videoStyle}
                src={
                    "https://www.youtube.com/embed/" +
                    SVs.youtube +
                    "?enablejsapi=1&rel=0"
                }
                allow="autoplay; fullscreen"
                title={shortDescription}
                aria-details={descriptionId}
            />
        );
    } else if (SVs.source) {
        videoTag = (
            <video
                className="video"
                id={id}
                controls
                style={videoStyle}
                title={shortDescription}
                aria-details={descriptionId}
            >
                <source
                    src={SVs.source}
                    type={`video/${SVs.source!.split("/")
                        .pop()!
                        .split(".")
                        .pop()}`}
                />
                Your browser does not support the &lt;video&gt; tag.
            </video>
        );
    } else {
        videoTag = <span id={id}></span>;
    }

    return (
        <NonInlineMediaWrapper
            id={id}
            displayMode={SVs.displayMode}
            suppressTopMargin={Boolean(SVs.renderInlineForListItem)}
            layoutStyles={{
                outerStyle,
                innerStyle,
                mediaContainerStyle,
                mediaColumnStyle,
            }}
            media={videoTag}
            description={description}
            containerRef={ref}
            containerAttrs={{ tabIndex: 0, className: "video" }}
        />
    );
});
