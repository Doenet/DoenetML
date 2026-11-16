/**
 * Which parts of a video a viewer watched, worked out from what the player
 * reports: when playback starts and stops, its position, sampled while it
 * plays, and changes of playback rate. It knows nothing of a particular
 * player; the `<video>` renderer (`video.tsx`) feeds it the YouTube player's
 * events and samples, and records what it returns with the `<video>`'s
 * `recordVideoWatched` and `recordVideoSkipped` actions.
 *
 * A sample whose position moved further from the last one than the video
 * can have played in the time between them, at the playback rate, is a
 * seek: the segment watched so far ends at the last position, and a new one
 * starts where the seek landed. The time between samples is measured on the
 * clock, not assumed from the polling interval, so samples that arrive late
 * (a browser throttles the timers of a background tab, down to one a minute)
 * and fast playback (2×) are counted as watched, while a seek is recorded
 * when the player reports no event for it (#2539).
 */

/** A stretch of a watched segment played at one rate, as the event records it. */
export type VideoPlaybackRate = {
    startingPoint: number;
    endingPoint?: number;
    rate: number;
};

/** What the tracker found, for the renderer to record. */
export type VideoWatchRecord =
    | {
          kind: "watched";
          beginTime: number;
          endTime: number;
          rates: VideoPlaybackRate[];
      }
    | { kind: "skipped"; beginTime: number; endTime: number };

/** A position of the player, at a time on the clock in milliseconds. */
export type VideoSample = {
    position: number;
    wallTime: number;
    rate?: number;
};

/** Why playback stopped. */
export type VideoStopReason = "paused" | "buffering" | "ended";

/**
 * Seconds a position may move beyond what the video can have played since
 * the last sample and still be playback rather than a seek: what the player
 * reports varies by a fraction of a second, as the 1-second threshold of the
 * 200 ms poll this replaces allowed for.
 */
export const SEEK_SLACK_SECONDS = 1;

/**
 * Seconds a position may move back and still be playback: the player can
 * report a position slightly before the last one.
 */
export const BACKWARD_JITTER_SECONDS = 0.5;

/**
 * Seconds a video may move between a pause and the next start without that
 * being a seek: a player paused and started again moves forward a little.
 */
export const RESUME_SLACK_SECONDS = 0.5;

type Segment = {
    begin: number;
    rates: VideoPlaybackRate[];
    lastPosition: number;
    lastWallTime: number;
    rate: number;
};

export class VideoWatchTracker {
    /** The segment being played, or `null` while the video is stopped. */
    _segment: Segment | null = null;

    /**
     * Where the video was paused, while it stays paused, so that starting it
     * elsewhere records a skip. `null` once it plays again, or after it
     * stopped for another reason.
     */
    _pausedAt: number | null = null;

    /** Whether a segment is being played. */
    get playing() {
        return this._segment !== null;
    }

    /**
     * Playback started at `sample`. If the video was paused somewhere else,
     * the jump is a skip. A start while already playing is a sample.
     */
    play(sample: VideoSample): VideoWatchRecord[] {
        if (this._segment) {
            return this.sample(sample);
        }
        const records: VideoWatchRecord[] = [];
        if (this._pausedAt !== null) {
            const moved = sample.position - this._pausedAt;
            if (moved < 0 || moved > RESUME_SLACK_SECONDS) {
                records.push({
                    kind: "skipped",
                    beginTime: this._pausedAt,
                    endTime: sample.position,
                });
            }
        }
        this._pausedAt = null;
        this._startSegment(sample);
        return records;
    }

    /**
     * The player is at `sample` while playing. Returns the segment watched
     * up to a seek and the skip, if the position moved further than playback
     * can explain.
     */
    sample(sample: VideoSample): VideoWatchRecord[] {
        const segment = this._segment;
        if (!segment) {
            return [];
        }
        const elapsed = Math.max(
            0,
            (sample.wallTime - segment.lastWallTime) / 1000,
        );
        const rate = Math.max(segment.rate, sample.rate ?? segment.rate);
        const moved = sample.position - segment.lastPosition;
        if (
            moved >= -BACKWARD_JITTER_SECONDS &&
            moved <= elapsed * rate + SEEK_SLACK_SECONDS
        ) {
            if (moved > 0) {
                segment.lastPosition = sample.position;
            }
            segment.lastWallTime = sample.wallTime;
            if (sample.rate !== undefined) {
                segment.rate = sample.rate;
            }
            return [];
        }

        // A seek: what was played ends where the video was last seen
        // playing, and playing resumes where the seek landed.
        const records = this._endSegment(segment.lastPosition);
        records.push({
            kind: "skipped",
            beginTime: segment.lastPosition,
            endTime: sample.position,
        });
        this._startSegment({
            ...sample,
            rate: sample.rate ?? segment.rate,
        });
        return records;
    }

    /** The playback rate changed to `sample.rate` at `sample`. */
    rateChanged(sample: VideoSample & { rate: number }): VideoWatchRecord[] {
        const records = this.sample(sample);
        const segment = this._segment;
        if (segment) {
            segment.rates[segment.rates.length - 1].endingPoint =
                segment.lastPosition;
            segment.rates.push({
                startingPoint: segment.lastPosition,
                rate: sample.rate,
            });
            segment.rate = sample.rate;
        }
        return records;
    }

    /**
     * Playback stopped at `sample`: the segment played ends there, at
     * `endPosition` if given (the duration, when the video ended, since the
     * player reports a position a little short of it). A seek just before
     * the stop (a `BUFFERING` after one) is recorded as a seek.
     */
    stop(
        sample: VideoSample,
        reason: VideoStopReason,
        endPosition?: number,
    ): VideoWatchRecord[] {
        if (!this._segment) {
            return [];
        }
        const records = this.sample(sample);
        const end = Math.max(
            this._segment.lastPosition,
            endPosition ?? sample.position,
        );
        records.push(...this._endSegment(end));
        this._pausedAt = reason === "paused" ? end : null;
        return records;
    }

    _startSegment(sample: VideoSample) {
        const rate = sample.rate ?? 1;
        this._segment = {
            begin: sample.position,
            rates: [{ startingPoint: sample.position, rate }],
            lastPosition: sample.position,
            lastWallTime: sample.wallTime,
            rate,
        };
    }

    /** End the segment at `end`, and return it if anything was watched. */
    _endSegment(end: number): VideoWatchRecord[] {
        const segment = this._segment;
        this._segment = null;
        if (!segment || !(end > segment.begin)) {
            return [];
        }
        const rates = segment.rates.filter((rate) => rate.startingPoint < end);
        rates[rates.length - 1].endingPoint = end;
        return [
            {
                kind: "watched",
                beginTime: segment.begin,
                endTime: end,
                rates,
            },
        ];
    }
}
