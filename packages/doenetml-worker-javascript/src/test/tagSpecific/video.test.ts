import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { widthsBySize } from "@doenet/utils";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Video tag tests @group1", async () => {
    it("video sizes", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <video name="v" />

    <video name="vtiny" size="tiny" />
    <video name="vsmall" size="small" />
    <video name="vmedium" size="medium" />
    <video name="vlarge" size="large" />
    <video name="vfull" size="full" />
    <video name="vinvalid" size="vnvalid" />

    <video name="va10" width="10" />
    <video name="va100" width="100" />
    <video name="va200" width="200" />
    <video name="va300" width="300" />
    <video name="va400" width="400" />
    <video name="va500" width="500" />
    <video name="va600" width="600" />
    <video name="va700" width="700" />
    <video name="va800" width="800" />
    <video name="va900" width="900" />
    <video name="va10000" width="10000" />

    <video name="vp1" width="1%" />
    <video name="vp10" width="10%" />
    <video name="vp20" width="20%" />
    <video name="vp30" width="30%" />
    <video name="vp40" width="40%" />
    <video name="vp50" width="50%" />
    <video name="vp60" width="60%" />
    <video name="vp70" width="70%" />
    <video name="vp80" width="80%" />
    <video name="vp90" width="90%" />
    <video name="vp100" width="100%" />
    <video name="vp1000" width="1000%" />

    <video name="vbadwidth" width="bad" />

    `,
        });

        let expectedSizes: Record<string, string> = {
            v: "full",
            vtiny: "tiny",
            vsmall: "small",
            vmedium: "medium",
            vlarge: "large",
            vfull: "full",
            vinvalid: "full",
            va10: "tiny",
            va100: "tiny",
            va200: "small",
            va300: "small",
            va400: "medium",
            va500: "medium",
            va600: "large",
            va700: "large",
            va800: "full",
            va900: "full",
            va10000: "full",
            vp1: "tiny",
            vp10: "tiny",
            vp20: "small",
            vp30: "small",
            vp40: "small",
            vp50: "medium",
            vp60: "medium",
            vp70: "large",
            vp80: "large",
            vp90: "full",
            vp100: "full",
            vp1000: "full",
            vbadwidth: "full",
        };

        let stateVariables = await core.returnAllStateVariables(false, true);
        for (let name in expectedSizes) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .size,
            ).eq(expectedSizes[name]);
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .width.size,
            ).eq(widthsBySize[expectedSizes[name]]);
        }
    });

    it("horizontal align", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <video name="v" />
    <video name="vleft" horizontalAlign="left" />
    <video name="vright" horizontalAlign="right" />
    <video name="vcenter" horizontalAlign="center" />
    <video name="vinvalid" horizontalAlign="vnvalid" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("v")].stateValues
                .horizontalAlign,
        ).eq("center");
        expect(
            stateVariables[await resolvePathToNodeIdx("vleft")].stateValues
                .horizontalAlign,
        ).eq("left");
        expect(
            stateVariables[await resolvePathToNodeIdx("vright")].stateValues
                .horizontalAlign,
        ).eq("right");
        expect(
            stateVariables[await resolvePathToNodeIdx("vcenter")].stateValues
                .horizontalAlign,
        ).eq("center");
        expect(
            stateVariables[await resolvePathToNodeIdx("vinvalid")].stateValues
                .horizontalAlign,
        ).eq("center");
    });

    it("displayMode", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <video name="v" />
    <video name="vinline" displayMode="inline" />
    <video name="vblock" displayMode="block" />
    <video name="vinvalid" displayMode="vnvalid" />

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("v")].stateValues
                .displayMode,
        ).eq("block");
        expect(
            stateVariables[await resolvePathToNodeIdx("vinline")].stateValues
                .displayMode,
        ).eq("inline");
        expect(
            stateVariables[await resolvePathToNodeIdx("vblock")].stateValues
                .displayMode,
        ).eq("block");
        expect(
            stateVariables[await resolvePathToNodeIdx("vinvalid")].stateValues
                .displayMode,
        ).eq("block");
    });

    // The renderer reports a source change by calling this action (it is the
    // thing that observes `youtube`/`source` changing). This covers what the
    // action itself guarantees; the renderer-side dispatch has no test —
    // `video.cy.js` never mentions it — so deleting that dispatch would still
    // leave the suite green.
    it("recordVideoSourceChanged drops playback state of the previous video", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <video name="v" youtube="tJ4ypc5L6uU"><shortDescription>a video</shortDescription></video>
            `,
        });

        const videoIdx = await resolvePathToNodeIdx("v");
        const stateOf = async () =>
            (await core.returnAllStateVariables(false, true))[videoIdx]
                .stateValues;

        // Watch the first video: 5s in, with 0-5 recorded as watched.
        await core.requestAction({
            componentIdx: videoIdx,
            actionName: "recordVideoReady",
            args: { duration: 300 },
            baseVariantIndex: 0,
        });
        await core.requestAction({
            componentIdx: videoIdx,
            actionName: "setTime",
            args: { time: 5 },
            baseVariantIndex: 0,
        });
        await core.requestAction({
            componentIdx: videoIdx,
            actionName: "recordVideoWatched",
            args: { beginTime: 0, endTime: 5, duration: 300, rates: [] },
            baseVariantIndex: 0,
        });

        expect((await stateOf()).time).eq(5);
        expect((await stateOf()).secondsWatched).eq(5);
        expect((await stateOf()).fractionWatched).closeTo(5 / 300, 1e-12);

        // A position of 0:05 and 5 seconds watched belong to the video that has
        // just been replaced, so neither carries over.
        await core.requestAction({
            componentIdx: videoIdx,
            actionName: "recordVideoSourceChanged",
            args: {},
            baseVariantIndex: 0,
        });

        expect((await stateOf()).time).eq(0);
        expect((await stateOf()).secondsWatched).eq(0);
        expect((await stateOf()).fractionWatched).eq(0);
        // `duration` is intentionally untouched: the new player overwrites it
        // through `recordVideoReady`, and blanking it here would only make
        // `fractionWatched` divide by null in the meantime.
        expect((await stateOf()).duration).eq(300);
    });

    describe("fractionWatched", () => {
        // Record the given watched segments of a 600-second video, in order,
        // and return the video's state and the credit of an answer that awards
        // `fractionWatched` (submitted after each segment, as authors do).
        async function watchSegments({
            segments,
            readyDuration = 600,
            playerDuration = readyDuration,
        }: {
            segments: [number, number][];
            readyDuration?: number | null;
            playerDuration?: number;
        }) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <video name="v" youtube="tJ4ypc5L6uU"><shortDescription>a video</shortDescription></video>
    <answer name="ans" type="videoWatched" video="$v" />
            `,
            });

            const videoIdx = await resolvePathToNodeIdx("v");
            const answerIdx = await resolvePathToNodeIdx("ans");

            if (readyDuration !== null) {
                await core.requestAction({
                    componentIdx: videoIdx,
                    actionName: "recordVideoReady",
                    args: { duration: readyDuration },
                    baseVariantIndex: 0,
                });
            }
            for (const [beginTime, endTime] of segments) {
                await core.requestAction({
                    componentIdx: videoIdx,
                    actionName: "recordVideoWatched",
                    args: {
                        beginTime,
                        endTime,
                        duration: playerDuration,
                        rates: [],
                    },
                    baseVariantIndex: 0,
                });
            }

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return {
                video: stateVariables[videoIdx].stateValues,
                credit: stateVariables[answerIdx].stateValues.creditAchieved,
            };
        }

        it("is 1 after watching the whole video in one go", async () => {
            // The player reports a start just after 0 and an end just before
            // the duration. Both ends must snap, not only the start.
            const { video, credit } = await watchSegments({
                segments: [[0.3, 599.6]],
            });
            expect(video.segmentsWatched).eqls([[0, 600]]);
            expect(video.fractionWatched).eq(1);
            expect(credit).eq(1);
        });

        it("is 1 after watching the whole video with a pause", async () => {
            const { video, credit } = await watchSegments({
                segments: [
                    [0.3, 200],
                    [200.4, 599.6],
                ],
            });
            expect(video.segmentsWatched).eqls([[0, 600]]);
            expect(video.fractionWatched).eq(1);
            expect(credit).eq(1);
        });

        it("is 1 when a small gap is left unwatched", async () => {
            // 1.5 seconds missing in the middle: within 2 seconds and 1% of
            // the duration.
            const { video, credit } = await watchSegments({
                segments: [
                    [0, 200],
                    [201.5, 600],
                ],
            });
            expect(video.secondsWatched).eq(598.5);
            expect(video.fractionWatched).eq(1);
            expect(credit).eq(1);
        });

        it("is below 1 when a larger gap is left unwatched", async () => {
            // 2.5 seconds missing exceeds the 2-second margin.
            const { video, credit } = await watchSegments({
                segments: [
                    [0, 200],
                    [202.5, 600],
                ],
            });
            expect(video.secondsWatched).eq(597.5);
            expect(video.fractionWatched).closeTo(597.5 / 600, 1e-12);
            expect(credit).closeTo(597.5 / 600, 1e-12);
        });

        it("margin is at most 1% of a short video", async () => {
            // For a 60-second video the margin is 0.6 seconds, not 2.
            let { video } = await watchSegments({
                readyDuration: 60,
                segments: [
                    [0, 30],
                    [31.5, 60],
                ],
            });
            expect(video.fractionWatched).closeTo(58.5 / 60, 1e-12);

            // The player's duration at ready time (60.4) is longer than the
            // one it reports while playing (60), so the end snaps to 60 and
            // 0.4 seconds, within 0.604, are left over.
            ({ video } = await watchSegments({
                readyDuration: 60.4,
                playerDuration: 60,
                segments: [[0.2, 59.8]],
            }));
            expect(video.segmentsWatched).eqls([[0, 60]]);
            expect(video.fractionWatched).eq(1);
        });

        it("partial viewing is unchanged", async () => {
            const { video, credit } = await watchSegments({
                segments: [[10, 70]],
            });
            expect(video.segmentsWatched).eqls([[10, 70]]);
            expect(video.fractionWatched).closeTo(0.1, 1e-12);
            expect(credit).closeTo(0.1, 1e-12);
        });

        it("does not exceed 1 when the player reports a longer duration", async () => {
            // The duration at ready time can be rounded, while later reports
            // include the fractional second, so the end snaps past it.
            const { video, credit } = await watchSegments({
                readyDuration: 600,
                playerDuration: 610,
                segments: [
                    [0, 300],
                    [300, 609],
                ],
            });
            expect(video.secondsWatched).eq(610);
            expect(video.fractionWatched).eq(1);
            expect(credit).eq(1);
        });

        it("is 0 until the duration is known", async () => {
            const { video } = await watchSegments({
                readyDuration: null,
                segments: [[0, 5]],
            });
            expect(video.duration).eq(null);
            expect(video.secondsWatched).eq(5);
            expect(video.fractionWatched).eq(0);
        });
    });

    it("accessibility diagnostic if no short description specified", async () => {
        let { core } = await createTestCore({
            doenetML: `
<video name="video1" />
            `,
        });

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(0);
        expect(diagnosticsByType.accessibility.length).eq(1);
        expect(diagnosticsByType.accessibility[0].level).eq(1);

        expect(diagnosticsByType.accessibility[0].message).contain(
            "`<video>` must have a short description",
        );
        // Diagnostic range is narrowed to the opening tag (`<video`) so the
        // editor squiggle and hover only cover the tag name itself.
        expect(diagnosticsByType.accessibility[0].position.start.line).eq(2);
        expect(diagnosticsByType.accessibility[0].position.start.column).eq(1);
        expect(diagnosticsByType.accessibility[0].position.end.line).eq(2);
        expect(diagnosticsByType.accessibility[0].position.end.column).eq(7);
    });
});
