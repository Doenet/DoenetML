import { describe, expect, it } from "vitest";
import { VideoWatchTracker, type VideoWatchRecord } from "./videoWatchTracker";

/**
 * Play a video from `from` and poll it every `pollMs` milliseconds of the
 * clock, the video advancing `rate` seconds per second, until `to` seconds.
 * Returns what the tracker recorded and the clock at the end.
 */
function playThrough({
    tracker,
    from,
    to,
    pollMs,
    rate = 1,
    wallTime = 0,
}: {
    tracker: VideoWatchTracker;
    from: number;
    to: number;
    pollMs: number;
    rate?: number;
    wallTime?: number;
}) {
    const records: VideoWatchRecord[] = [];
    records.push(...tracker.play({ position: from, wallTime, rate }));
    let position = from;
    while (position < to) {
        wallTime += pollMs;
        position = Math.min(to, position + (pollMs / 1000) * rate);
        records.push(...tracker.sample({ position, wallTime, rate }));
    }
    return { records, wallTime };
}

function watched(beginTime: number, endTime: number, rate = 1) {
    return {
        kind: "watched",
        beginTime,
        endTime,
        rates: [{ startingPoint: beginTime, endingPoint: endTime, rate }],
    };
}

describe("VideoWatchTracker", () => {
    it("records one segment for playback polled every 200 ms", () => {
        const tracker = new VideoWatchTracker();
        const { records, wallTime } = playThrough({
            tracker,
            from: 0,
            to: 60,
            pollMs: 200,
        });
        expect(records).eqls([]);
        expect(tracker.stop({ position: 60, wallTime }, "paused")).eqls([
            watched(0, 60),
        ]);
    });

    it("counts playback polled late, as in a background tab, as watched", () => {
        // A browser runs the timers of a background tab once a second, or
        // once a minute after a while: a jump of a second or more between
        // polls is still playback, and nothing is dropped at a later
        // buffering.
        for (const pollMs of [1000, 60_000]) {
            const tracker = new VideoWatchTracker();
            const { records, wallTime } = playThrough({
                tracker,
                from: 0,
                to: 300,
                pollMs,
            });
            expect(records, String(pollMs)).eqls([]);
            expect(
                tracker.stop({ position: 300, wallTime }, "buffering"),
                String(pollMs),
            ).eqls([watched(0, 300)]);
        }
    });

    it("counts playback at twice the speed as watched", () => {
        const tracker = new VideoWatchTracker();
        // Each poll, 600 ms late, sees the video 1.2 seconds further on.
        const { records, wallTime } = playThrough({
            tracker,
            from: 10,
            to: 130,
            pollMs: 600,
            rate: 2,
        });
        expect(records).eqls([]);
        expect(tracker.stop({ position: 130, wallTime }, "paused")).eqls([
            watched(10, 130, 2),
        ]);
    });

    it("records a seek forward or back that the player reports no event for", () => {
        for (const target of [200, 5]) {
            const tracker = new VideoWatchTracker();
            const { wallTime } = playThrough({
                tracker,
                from: 0,
                to: 30,
                pollMs: 200,
            });
            // The next poll finds the video at the target.
            expect(
                tracker.sample({ position: target, wallTime: wallTime + 200 }),
                String(target),
            ).eqls([
                watched(0, 30),
                { kind: "skipped", beginTime: 30, endTime: target },
            ]);
            // Playing on from the target is a new segment.
            const { wallTime: end } = playThrough({
                tracker,
                from: target,
                to: target + 10,
                pollMs: 200,
                wallTime: wallTime + 200,
            });
            expect(
                tracker.stop(
                    { position: target + 10, wallTime: end },
                    "paused",
                ),
                String(target),
            ).eqls([watched(target, target + 10)]);
        }
    });

    it("records a seek that the player reports by buffering", () => {
        const tracker = new VideoWatchTracker();
        const { wallTime } = playThrough({
            tracker,
            from: 0,
            to: 30,
            pollMs: 200,
        });
        // The player reports BUFFERING at the target before the next poll.
        expect(
            tracker.stop(
                { position: 400, wallTime: wallTime + 50 },
                "buffering",
            ),
        ).eqls([
            watched(0, 30),
            { kind: "skipped", beginTime: 30, endTime: 400 },
        ]);
        // Then PLAYING there: no skip is recorded again.
        expect(
            tracker.play({
                position: 400.1,
                wallTime: wallTime + 400,
                rate: 1,
            }),
        ).eqls([]);
    });

    it("does not count a seek forward, seen by a late poll, as watched beyond the time elapsed", () => {
        // Two seconds pass on the clock, but the video is 100 seconds on.
        const tracker = new VideoWatchTracker();
        tracker.play({ position: 0, wallTime: 0, rate: 1 });
        expect(tracker.sample({ position: 100, wallTime: 2000 })).eqls([
            { kind: "skipped", beginTime: 0, endTime: 100 },
        ]);
    });

    it("records a skip when started somewhere other than where it was paused", () => {
        const tracker = new VideoWatchTracker();
        const { wallTime } = playThrough({
            tracker,
            from: 0,
            to: 20,
            pollMs: 200,
        });
        expect(tracker.stop({ position: 20, wallTime }, "paused")).eqls([
            watched(0, 20),
        ]);
        // Resumed where it was paused (a player moves on a little): no skip.
        expect(
            tracker.play({
                position: 20.3,
                wallTime: wallTime + 5000,
                rate: 1,
            }),
        ).eqls([]);
        expect(
            tracker.stop(
                { position: 25, wallTime: wallTime + 10_000 },
                "paused",
            ),
        ).eqls([watched(20.3, 25)]);
        // Moved while paused: a skip.
        expect(
            tracker.play({ position: 3, wallTime: wallTime + 20_000, rate: 1 }),
        ).eqls([{ kind: "skipped", beginTime: 25, endTime: 3 }]);
    });

    it("records each rate of a segment", () => {
        const tracker = new VideoWatchTracker();
        tracker.play({ position: 0, wallTime: 0, rate: 1 });
        tracker.sample({ position: 10, wallTime: 10_000, rate: 1 });
        expect(
            tracker.rateChanged({ position: 10, wallTime: 10_000, rate: 2 }),
        ).eqls([]);
        // At 2×, 20 seconds of video in 10 seconds of polls.
        for (let i = 1; i <= 50; i++) {
            expect(
                tracker.sample({
                    position: 10 + 0.4 * i,
                    wallTime: 10_000 + 200 * i,
                    rate: 2,
                }),
            ).eqls([]);
        }
        expect(tracker.stop({ position: 30, wallTime: 20_000 }, "paused")).eqls(
            [
                {
                    kind: "watched",
                    beginTime: 0,
                    endTime: 30,
                    rates: [
                        { startingPoint: 0, endingPoint: 10, rate: 1 },
                        { startingPoint: 10, endingPoint: 30, rate: 2 },
                    ],
                },
            ],
        );
    });

    it("ends a segment played to the end at the duration", () => {
        const tracker = new VideoWatchTracker();
        const { wallTime } = playThrough({
            tracker,
            from: 590,
            to: 599.6,
            pollMs: 200,
        });
        expect(tracker.stop({ position: 599.6, wallTime }, "ended", 600)).eqls([
            watched(590, 600),
        ]);
    });

    it("ignores a position reported slightly before the last one", () => {
        const tracker = new VideoWatchTracker();
        tracker.play({ position: 10, wallTime: 0, rate: 1 });
        expect(tracker.sample({ position: 12, wallTime: 2000 })).eqls([]);
        expect(tracker.sample({ position: 11.8, wallTime: 2200 })).eqls([]);
        expect(tracker.stop({ position: 13, wallTime: 3000 }, "paused")).eqls([
            watched(10, 13),
        ]);
    });

    it("records nothing for events while not playing", () => {
        const tracker = new VideoWatchTracker();
        expect(tracker.sample({ position: 10, wallTime: 0 })).eqls([]);
        expect(tracker.stop({ position: 10, wallTime: 0 }, "buffering")).eqls(
            [],
        );
        expect(
            tracker.rateChanged({ position: 10, wallTime: 0, rate: 2 }),
        ).eqls([]);
        // A pause right after a start records no segment.
        tracker.play({ position: 10, wallTime: 0, rate: 1 });
        expect(tracker.stop({ position: 10, wallTime: 100 }, "paused")).eqls(
            [],
        );
    });
});
