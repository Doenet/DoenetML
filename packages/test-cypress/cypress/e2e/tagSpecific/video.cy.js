import { widthsBySize } from "@doenet/utils";
import { assertCenteredWhenDescriptionOpens } from "./utils/mediaAlignment";

describe("Video Tag Tests", { tags: ["@group2"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("youtube video", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <p>An introduction to Doenet.</p>
  <video name="video1" width="560 px" youtube="tJ4ypc5L6uU" />

  `,
                },
                "*",
            );
        });
        cy.get("#video1")
            .invoke("css", "width")
            .then((width) => parseInt(width))
            .should("be.gte", widthsBySize["large"] - 4)
            .and("be.lte", widthsBySize["large"] + 1);

        // cy.get('#video1').invoke('attr', 'height').then((height) => expect(height).eq('315px'))
        cy.get("#video1")
            .invoke("attr", "src")
            .then((src) => expect(src.includes("tJ4ypc5L6uU")).eq(true));
    });

    it("video from external source", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <video name="video1" width="560 px" source="https://jsoncompare.org/LearningContainer/SampleFiles/Video/MP4/Sample-MP4-Video-File-for-Testing.mp4" />
  `,
                },
                "*",
            );
        });
        cy.get("#video1")
            .invoke("css", "width")
            .then((width) => parseInt(width))
            .should("be.gte", widthsBySize["large"] - 4)
            .and("be.lte", widthsBySize["large"] + 1);
        // cy.get('#video1').invoke('attr', 'height').then((height) => expect(height).eq('315px'))
        cy.get("#video1" + " source")
            .invoke("attr", "src")
            .then((src) =>
                expect(src).eq(
                    "https://jsoncompare.org/LearningContainer/SampleFiles/Video/MP4/Sample-MP4-Video-File-for-Testing.mp4",
                ),
            );
        cy.get("#video1" + " source")
            .invoke("attr", "type")
            .then((type) => expect(type).eq("video/mp4"));
    });

    if (!Cypress.env("SKIP_YOUTUBE_TESTS")) {
        // Shared assertions for the two source-change tests below. Assumes the
        // doenetML has rendered:
        //   - <video name="v" youtube="$videoCode" />
        //   - text/number extends for $v.state, $v.time, $v.duration
        //   - <callAction>s named playAction/pauseAction
        //   - a <choiceInput name="videoCode"> whose `firstId` choice is
        //     already selected (iframe showing the first video) and whose
        //     `switchChoiceSelector` is the choice input for `secondId`.
        // Verifies: first video plays/pauses → switch → second video
        // plays/pauses through the freshly recreated player.
        function verifyYouTubePlayPauseAndSwitch({
            firstId,
            secondId,
            switchChoiceSelector,
        }) {
            // First video is showing.
            cy.get('iframe[src*="youtube.com"]').should("be.visible");
            cy.get("#v")
                .invoke("attr", "src")
                .then((src) => expect(src.includes(firstId)).eq(true));

            // Wait for the YT player to finish initializing
            // (recordVideoReady fires onPlayerReady -> state="stopped",
            // duration set to the video's length).
            cy.get("#state").should("have.text", "stopped");
            let preSwitchDuration;
            cy.get("#duration")
                .invoke("text")
                .then((d) => {
                    expect(d).not.to.eq("");
                    preSwitchDuration = d;
                });

            // Verify the first video plays (state -> playing, time advances)
            // and pauses.
            cy.log(`play first video (${firstId})`);
            cy.get("#playAction").click();
            cy.get("#state").should("have.text", "playing");
            cy.get("#time").contains("1");
            cy.get("#time").contains("2");

            cy.log(`pause first video (${firstId})`);
            cy.get("#pauseAction").click();
            cy.get("#state").should("have.text", "stopped");

            // Switch the choice input to the second YouTube id.
            cy.log(`switch to second video (${secondId})`);
            cy.get(switchChoiceSelector).click();

            // After the source change the iframe must still be in the DOM
            // with the new src. Bug fixed by `key={SVs.youtube}` on the
            // iframe so React unmounts/remounts cleanly when the player's
            // useEffect cleanup destroys the old player.
            cy.get("#v").should("be.visible");
            cy.get("#v")
                .invoke("attr", "src")
                .then((src) => expect(src.includes(secondId)).eq(true));

            // Wait for the new player to finish initializing. recordVideoReady
            // updates duration to the new video's length, so a duration that
            // differs from the pre-switch value is a clean signal that the
            // new player has handshaked with the iframe and is ready to
            // accept play/pause commands. Without this wait, playAction can
            // race with onPlayerReady (which forces state back to "stopped").
            cy.get("#duration").should((el) => {
                expect(el.text()).not.to.eq(preSwitchDuration);
            });

            // Verify the second video also plays and pauses through the
            // freshly created player.
            cy.log(`play second video (${secondId})`);
            cy.get("#playAction").click();
            cy.get("#state").should("have.text", "playing");
            cy.get("#time").contains("1");
            cy.get("#time").contains("2");

            cy.log(`pause second video (${secondId})`);
            cy.get("#pauseAction").click();
            cy.get("#state").should("have.text", "stopped");
        }

        it("youtube video reloads when youtube source changes", () => {
            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML: `
  <choiceInput name="videoCode">
    <label>Video code:</label>
    <choice preSelect>tJ4ypc5L6uU</choice>
    <choice>49qilPR8Qpc</choice>
  </choiceInput>

  <video name="v" youtube="$videoCode" />

  <p>State: <text extend="$v.state" name="state" /></p>
  <p>Time: <number extend="$v.time" name="time" /></p>
  <p>Duration: <number extend="$v.duration" name="duration" /></p>

  <callAction target="$v" actionName="playVideo" name="playAction"><label>Play</label></callAction>
  <callAction target="$v" actionName="pauseVideo" name="pauseAction"><label>Pause</label></callAction>
  `,
                    },
                    "*",
                );
            });

            // First choice is preselected, so the first video iframe is
            // already showing on initial render.
            verifyYouTubePlayPauseAndSwitch({
                firstId: "tJ4ypc5L6uU",
                secondId: "49qilPR8Qpc",
                switchChoiceSelector: "#videoCode_choice2_input",
            });
        });

        it("youtube video initializes when youtube id is set after start", () => {
            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML: `
  <choiceInput name="videoCode">
    <label>Video code:</label>
    <choice>tJ4ypc5L6uU</choice>
    <choice>49qilPR8Qpc</choice>
  </choiceInput>

  <video name="v" youtube="$videoCode" />

  <p>State: <text extend="$v.state" name="state" /></p>
  <p>Time: <number extend="$v.time" name="time" /></p>
  <p>Duration: <number extend="$v.duration" name="duration" /></p>

  <callAction target="$v" actionName="playVideo" name="playAction"><label>Play</label></callAction>
  <callAction target="$v" actionName="pauseVideo" name="pauseAction"><label>Pause</label></callAction>
  `,
                    },
                    "*",
                );
            });

            // No choice is preselected, so SVs.youtube is empty and the
            // <video> renders a <span id="v"> placeholder rather than an
            // iframe. Wait for the placeholder span to exist so we know the
            // viewer has rendered, then assert no YouTube iframe is present.
            cy.get("#v").should("exist");
            cy.get('iframe[src*="youtube.com"]').should("not.exist");

            // Select the first video. This is the first time SVs.youtube
            // gets a real value, so React mounts an iframe in place of the
            // span and the player effect creates a YT.Player on it.
            cy.get("#videoCode_choice1_input").click();

            // From here on, behavior should match the source-change test.
            verifyYouTubePlayPauseAndSwitch({
                firstId: "tJ4ypc5L6uU",
                secondId: "49qilPR8Qpc",
                switchChoiceSelector: "#videoCode_choice2_input",
            });
        });

        it("actions on youtube video", () => {
            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML: `
  <p>An introduction to Doenet.</p>
  <video youtube="tJ4ypc5L6uU" name="v" />

  <p>State: <text extend="$v.state" name="state" /></p>
  <p>Time: <number extend="$v.time" name="time" /></p>
  <p>Duration: <number extend="$v.duration" name="duration" /></p>
  <p>Seconds watched:  <number extend="$v.secondsWatched" name="secondsWatched" displayDecimals="0" /></p>
  <p>Fraction watched:  <number extend="$v.fractionWatched" name="fractionWatched" displayDecimals="2" /></p>

  <p>Change time: <mathInput bindValueTo="$(v.time)" name="mi" /></p>


  <p>Control via setting state variables directly:
  <updateValue type="text" target="$v.state" newValue="playing" name="playUpdate">
    <label>play</label>
  </updateValue>
  <updateValue type="text" target="$v.state" newValue="stopped" name="pauseUpdate">
    <label>stop</label>
  </updateValue>
  </p>

  <p>Control with actions:
  <callAction target="$v" actionName="playVideo" name="playAction"><label>Play action</label></callAction>
  <callAction target="$v" actionName="pauseVideo" name="pauseAction"><label>Pause action</label></callAction>
  </p>
  `,
                    },
                    "*",
                );
            });

            // Wait for the YouTube iframe to exist and be visible
            cy.get('iframe[src*="youtube.com"]').should("be.visible");

            cy.get("#v")
                .invoke("css", "width")
                .then((width) => parseInt(width))
                .should("be.gte", widthsBySize["full"] - 4)
                .and("be.lte", widthsBySize["full"] + 1);

            cy.get("#v")
                .invoke("attr", "src")
                .then((src) => expect(src.includes("tJ4ypc5L6uU")).eq(true));

            cy.get("#state").contains("initializing");

            cy.log(
                "clicking play action too early does not do anything (no error)",
            );
            cy.get("#playAction").click();
            cy.get("#state").contains("stopped");
            cy.get("#time").contains("0");
            cy.get("#duration").should("have.text", "300");
            cy.get("#secondsWatched").should("have.text", "0");
            cy.get("#fractionWatched").should("have.text", "0");

            cy.wait(2000);
            cy.get("#state").contains("stopped");
            cy.get("#time").contains("0");
            cy.get("#secondsWatched").should("have.text", "0");
            cy.get("#fractionWatched").should("have.text", "0");

            cy.log("play via action");
            cy.get("#playAction").click();

            cy.get("#state").contains("playing");
            cy.get("#time").contains("1");
            cy.get("#time").contains("2");
            cy.get("#time").contains("3");

            cy.log("pause via action");
            cy.get("#pauseAction").click();

            cy.get("#state").contains("stopped");
            cy.get("#time").contains("3");
            cy.get("#secondsWatched").should("have.text", "3");
            cy.get("#fractionWatched").should("have.text", "0.01");

            cy.log("cue to first minute");
            cy.get("#mi" + " textarea").type("{end}{backspace}60{enter}", {
                force: true,
            });

            cy.get("#state").contains("stopped");
            cy.get("#time").contains("60");
            cy.get("#secondsWatched").should("have.text", "3");
            cy.get("#fractionWatched").should("have.text", "0.01");

            cy.log("play via update");
            cy.get("#playUpdate").click();

            cy.get("#state").contains("playing");
            cy.get("#time").contains("61");
            cy.get("#time").contains("62");

            cy.log("pause via update");
            cy.get("#pauseUpdate").click();

            cy.get("#state").contains("stopped");
            cy.get("#time").contains("62");
            cy.get("#secondsWatched").contains(/5|6/);

            cy.get("#fractionWatched").should("have.text", "0.02");
        });

        it("video segmentsWatched watched merged, youtube video", () => {
            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML: `
  <p>An introduction to Doenet.</p>
  <video youtube="tJ4ypc5L6uU" name="v" />

  <p>State: <text extend="$v.state" name="state" /></p>
  <p>Time: <number extend="$v.time" name="time" /></p>
  <p>Duration: <number extend="$v.duration" name="duration" /></p>
  <p>Seconds watched:  <number extend="$v.secondsWatched" name="secondsWatched" displayDecimals="0" /></p>

  <p>Change time: <mathInput bindValueTo="$(v.time)" name="mi" /></p>

  <p>Control with actions:
  <callAction target="$v" actionName="playVideo" name="playAction"><label>Play action</label></callAction>
  <callAction target="$v" actionName="pauseVideo" name="pauseAction"><label>Pause action</label></callAction>
  </p>
  `,
                    },
                    "*",
                );
            });

            // Wait for the YouTube iframe to exist and be visible
            cy.get('iframe[src*="youtube.com"]').should("be.visible");

            cy.get("#v")
                .invoke("css", "width")
                .then((width) => parseInt(width))
                .should("be.gte", widthsBySize["full"] - 4)
                .and("be.lte", widthsBySize["full"] + 1);

            cy.get("#v")
                .invoke("attr", "src")
                .then((src) => expect(src.includes("tJ4ypc5L6uU")).eq(true));

            cy.get("#state").should("have.text", "stopped");
            cy.get("#time").should("have.text", "0");
            cy.get("#secondsWatched").should("have.text", "0");

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("v")].stateValues
                        .segmentsWatched,
                ).eq(null);
            });

            cy.log("play");
            cy.get("#playAction").click();

            cy.get("#state").should("have.text", "playing");
            cy.get("#time").should("have.text", "1");

            cy.log("pause");
            cy.get("#pauseAction").click();

            cy.get("#state").should("have.text", "stopped");
            cy.get("#time").should("have.text", "1");
            cy.get("#secondsWatched").should("have.text", "1");

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("v")].stateValues
                        .segmentsWatched.length,
                ).eq(1);
                let theSegment =
                    stateVariables[await win.resolvePath1("v")].stateValues
                        .segmentsWatched[0];
                expect(theSegment[0]).lt(0.6);
                expect(theSegment[1]).gt(0.4).lt(1.6);
            });

            cy.log("play");
            cy.get("#playAction").click();

            cy.get("#state").should("have.text", "playing");
            cy.get("#time").should("have.text", "3");

            cy.log("pause");
            cy.get("#pauseAction").click();

            cy.get("#state").should("have.text", "stopped");
            cy.get("#time").should("have.text", "3");
            cy.get("#secondsWatched").should("have.text", "3");

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("v")].stateValues
                        .segmentsWatched.length,
                ).eq(1);
                let theSegment =
                    stateVariables[await win.resolvePath1("v")].stateValues
                        .segmentsWatched[0];
                expect(theSegment[0]).lt(0.6);
                expect(theSegment[1]).gt(2.4).lt(3.6);
            });

            cy.log("play");
            cy.get("#playAction").click();

            cy.get("#state").should("have.text", "playing");
            cy.get("#time").should("have.text", "4");

            cy.log("pause");
            cy.get("#pauseAction").click();

            cy.get("#state").should("have.text", "stopped");
            cy.get("#time").should("have.text", "4");
            cy.get("#secondsWatched").should("have.text", "4");

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("v")].stateValues
                        .segmentsWatched.length,
                ).eq(1);
                let theSegment =
                    stateVariables[await win.resolvePath1("v")].stateValues
                        .segmentsWatched[0];
                expect(theSegment[0]).lt(0.6);
                expect(theSegment[1]).gt(3.4).lt(4.6);
            });

            cy.log("cue to first minute");
            cy.get("#mi" + " textarea").type("{end}{backspace}60{enter}", {
                force: true,
            });
            cy.get("#time").should("have.text", "60");

            cy.log("play");
            cy.get("#playAction").click();

            cy.get("#state").should("have.text", "playing");
            cy.get("#time").should("have.text", "62");

            cy.log("pause");
            cy.get("#pauseAction").click();

            cy.get("#state").should("have.text", "stopped");
            cy.get("#time").should("have.text", "62");
            cy.get("#secondsWatched").contains(/6|7/);

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("v")].stateValues
                        .segmentsWatched.length,
                ).eq(2);
                let theSegment =
                    stateVariables[await win.resolvePath1("v")].stateValues
                        .segmentsWatched[0];
                expect(theSegment[0]).lt(0.6);
                expect(theSegment[1]).gt(3.4).lt(4.6);
                theSegment =
                    stateVariables[await win.resolvePath1("v")].stateValues
                        .segmentsWatched[1];
                expect(theSegment[0]).gt(59.4).lt(60.6);
                expect(theSegment[1]).gt(61.4).lt(62.6);
            });

            cy.log("play");
            cy.get("#playAction").click();

            cy.get("#state").should("have.text", "playing");
            cy.get("#time").should("have.text", "63");

            cy.log("pause");
            cy.get("#pauseAction").click();

            cy.get("#state").should("have.text", "stopped");
            cy.get("#time").should("have.text", "63");
            cy.get("#secondsWatched").contains(/7|8/);

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("v")].stateValues
                        .segmentsWatched.length,
                ).eq(2);
                let theSegment =
                    stateVariables[await win.resolvePath1("v")].stateValues
                        .segmentsWatched[0];
                expect(theSegment[0]).lt(0.6);
                expect(theSegment[1]).gt(3.4).lt(4.6);
                theSegment =
                    stateVariables[await win.resolvePath1("v")].stateValues
                        .segmentsWatched[1];
                expect(theSegment[0]).gt(59.4).lt(60.6);
                expect(theSegment[1]).gt(62).lt(63.6);
            });

            cy.log("replay part of beginning");

            cy.get("#mi" + " textarea").type(
                "{end}{backspace}{backspace}1{enter}",
                { force: true },
            );
            cy.get("#time").should("have.text", "1");

            cy.log("play");
            cy.get("#playAction").click();

            cy.get("#state").should("have.text", "playing");
            cy.get("#time").should("have.text", "3");

            cy.log("pause");
            cy.get("#pauseAction").click();

            cy.get("#state").should("have.text", "stopped");
            cy.get("#time").should("have.text", "3");
            cy.get("#secondsWatched").contains(/7|8/);

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("v")].stateValues
                        .segmentsWatched.length,
                ).eq(2);
                let theSegment =
                    stateVariables[await win.resolvePath1("v")].stateValues
                        .segmentsWatched[0];
                expect(theSegment[0]).lt(0.6);
                expect(theSegment[1]).gt(3.4).lt(4.6);
                theSegment =
                    stateVariables[await win.resolvePath1("v")].stateValues
                        .segmentsWatched[1];
                expect(theSegment[0]).gt(59.4).lt(60.6);
                expect(theSegment[1]).gt(62.4).lt(63.6);
            });

            cy.log("play");
            cy.wait(100); // for some reason, need this delay when headless for play button to be activated
            cy.get("#playAction").click();

            cy.get("#state").should("have.text", "playing");
            cy.get("#time").should("have.text", "5");

            cy.log("pause");
            cy.get("#pauseAction").click();

            cy.get("#state").should("have.text", "stopped");
            cy.get("#time").should("have.text", "5");
            cy.get("#secondsWatched").contains(/8|9/);

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("v")].stateValues
                        .segmentsWatched.length,
                ).eq(2);
                let theSegment =
                    stateVariables[await win.resolvePath1("v")].stateValues
                        .segmentsWatched[0];
                expect(theSegment[0]).lt(0.6);
                expect(theSegment[1]).gt(4).lt(5.6);
                theSegment =
                    stateVariables[await win.resolvePath1("v")].stateValues
                        .segmentsWatched[1];
                expect(theSegment[0]).gt(59.4).lt(60.6);
                expect(theSegment[1]).gt(62.4).lt(63.6);
            });
        });
    }

    it("with description", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <video name="video" source="https://jsoncompare.org/LearningContainer/SampleFiles/Video/MP4/Sample-MP4-Video-File-for-Testing.mp4">
        <shortDescription>A video</shortDescription>
        <description>
            <p>An earth video.</p>
        </description>
    </video>

    `,
                },
                "*",
            );
        });

        cy.get("#video-container [data-test='Description']").should(
            "not.have.attr",
            "open",
        );

        cy.get("#video").should(
            "have.attr",
            "aria-details",
            `video-description-content`,
        );
        cy.get(`#video-description-content`).should(
            "contain.text",
            "An earth video.",
        );

        cy.get("#video-container [data-test='Description Summary']").click();

        cy.get("#video-container [data-test='Description']").should(
            "have.attr",
            "open",
        );

        cy.get("#video-container [data-test='Description']").should(
            "contain.text",
            "An earth video.",
        );

        cy.get("#video").click();
        cy.get("#video-container [data-test='Description']").should(
            "have.attr",
            "open",
        );

        cy.get("#video-container [data-test='Description Summary']").click();

        cy.get("#video-container [data-test='Description']").should(
            "not.have.attr",
            "open",
        );
    });

    it("keeps non-inline video centered when description opens", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <video name="video" source="https://jsoncompare.org/LearningContainer/SampleFiles/Video/MP4/Sample-MP4-Video-File-for-Testing.mp4" width="300px" horizontalAlign="center">
        <shortDescription>A video</shortDescription>
        <description>
            <p>An earth video.</p>
        </description>
    </video>
    `,
                },
                "*",
            );
        });

        assertCenteredWhenDescriptionOpens({
            containerSelector: "#video-container",
            mediaSelector: "#video",
            detailsSelector: "#video-container [data-test='Description']",
            summarySelector:
                "#video-container [data-test='Description Summary']",
        });
    });

    it("with description, inline", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <video name="video" displayMode="inline" source="https://jsoncompare.org/LearningContainer/SampleFiles/Video/MP4/Sample-MP4-Video-File-for-Testing.mp4">
        <shortDescription>A video</shortDescription>
        <description>
            <p>An earth video.</p>
        </description>
    </video>

    `,
                },
                "*",
            );
        });

        cy.get("#video-container [data-test='Description Button']").should(
            "be.visible",
        );
        cy.get("#video-container [data-test='Description']").should(
            "not.be.visible",
        );

        cy.get("#video").should(
            "have.attr",
            "aria-details",
            `video-description-content`,
        );
        cy.get(`#video-description-content`).should(
            "contain.text",
            "An earth video.",
        );

        cy.get("#video-container [data-test='Description Button']").click();

        cy.get("#video-container [data-test='Description']").should(
            "contain.text",
            "An earth video.",
        );

        cy.get("#video").click();

        cy.get("#video-container [data-test='Description']").should(
            "not.be.visible",
        );
    });

    it("without description", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <video name="video" source="https://jsoncompare.org/LearningContainer/SampleFiles/Video/MP4/Sample-MP4-Video-File-for-Testing.mp4">
        <shortDescription>A video</shortDescription>
    </video>

    `,
                },
                "*",
            );
        });

        cy.get("#video").should("be.visible");

        cy.get("#video-container [data-test='Description Button']").should(
            "not.exist",
        );
        cy.get("#video-container [data-test='Description']").should(
            "not.exist",
        );

        cy.get("#video").should("not.have.attr", "aria-details");
    });

    it("without description, inline", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <video name="video" displayMode="inline" source="https://jsoncompare.org/LearningContainer/SampleFiles/Video/MP4/Sample-MP4-Video-File-for-Testing.mp4">
        <shortDescription>A video</shortDescription>
    </video>

    `,
                },
                "*",
            );
        });

        cy.get("#video").should("be.visible");
        cy.get("#video-container [data-test='Description Button']").should(
            "not.exist",
        );
        cy.get("#video-container [data-test='Description']").should(
            "not.exist",
        );

        cy.get("#video").should("not.have.attr", "aria-details");
    });
});
