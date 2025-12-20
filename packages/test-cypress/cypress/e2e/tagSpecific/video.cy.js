import { cesc, widthsBySize } from "@doenet/utils";

describe("Video Tag Tests", function () {
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
        cy.get(cesc("#video1"))
            .invoke("css", "width")
            .then((width) => parseInt(width))
            .should("be.gte", widthsBySize["large"] - 4)
            .and("be.lte", widthsBySize["large"] + 1);

        // cy.get(cesc('#video1')).invoke('attr', 'height').then((height) => expect(height).eq('315px'))
        cy.get(cesc("#video1"))
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
        cy.get(cesc("#video1"))
            .invoke("css", "width")
            .then((width) => parseInt(width))
            .should("be.gte", widthsBySize["large"] - 4)
            .and("be.lte", widthsBySize["large"] + 1);
        // cy.get(cesc('#video1')).invoke('attr', 'height').then((height) => expect(height).eq('315px'))
        cy.get(cesc("#video1") + " source")
            .invoke("attr", "src")
            .then((src) =>
                expect(src).eq(
                    "https://jsoncompare.org/LearningContainer/SampleFiles/Video/MP4/Sample-MP4-Video-File-for-Testing.mp4",
                ),
            );
        cy.get(cesc("#video1") + " source")
            .invoke("attr", "type")
            .then((type) => expect(type).eq("video/mp4"));
    });

    if (!Cypress.env("SKIP_YOUTUBE_TESTS")) {
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

            cy.get(cesc("#v"))
                .invoke("css", "width")
                .then((width) => parseInt(width))
                .should("be.gte", widthsBySize["full"] - 4)
                .and("be.lte", widthsBySize["full"] + 1);

            cy.get(cesc("#v"))
                .invoke("attr", "src")
                .then((src) => expect(src.includes("tJ4ypc5L6uU")).eq(true));

            cy.get(cesc("#state")).contains("initializing");

            cy.log(
                "clicking play action too early does not do anything (no error)",
            );
            cy.get(cesc("#playAction")).click();
            cy.get(cesc("#state")).contains("stopped");
            cy.get(cesc("#time")).contains("0");
            cy.get(cesc("#duration")).should("have.text", "300");
            cy.get(cesc("#secondsWatched")).should("have.text", "0");
            cy.get(cesc("#fractionWatched")).should("have.text", "0");

            cy.wait(2000);
            cy.get(cesc("#state")).contains("stopped");
            cy.get(cesc("#time")).contains("0");
            cy.get(cesc("#secondsWatched")).should("have.text", "0");
            cy.get(cesc("#fractionWatched")).should("have.text", "0");

            cy.log("play via action");
            cy.get(cesc("#playAction")).click();

            cy.get(cesc("#state")).contains("playing");
            cy.get(cesc("#time")).contains("1");
            cy.get(cesc("#time")).contains("2");
            cy.get(cesc("#time")).contains("3");

            cy.log("pause via action");
            cy.get(cesc("#pauseAction")).click();

            cy.get(cesc("#state")).contains("stopped");
            cy.get(cesc("#time")).contains("3");
            cy.get(cesc("#secondsWatched")).should("have.text", "3");
            cy.get(cesc("#fractionWatched")).should("have.text", "0.01");

            cy.log("cue to first minute");
            cy.get(cesc("#mi") + " textarea").type(
                "{end}{backspace}60{enter}",
                {
                    force: true,
                },
            );

            cy.get(cesc("#state")).contains("stopped");
            cy.get(cesc("#time")).contains("60");
            cy.get(cesc("#secondsWatched")).should("have.text", "3");
            cy.get(cesc("#fractionWatched")).should("have.text", "0.01");

            cy.log("play via update");
            cy.get(cesc("#playUpdate")).click();

            cy.get(cesc("#state")).contains("playing");
            cy.get(cesc("#time")).contains("61");
            cy.get(cesc("#time")).contains("62");

            cy.log("pause via update");
            cy.get(cesc("#pauseUpdate")).click();

            cy.get(cesc("#state")).contains("stopped");
            cy.get(cesc("#time")).contains("62");
            cy.get(cesc("#secondsWatched")).contains(/5|6/);

            cy.get(cesc("#fractionWatched")).should("have.text", "0.02");
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

            cy.get(cesc("#v"))
                .invoke("css", "width")
                .then((width) => parseInt(width))
                .should("be.gte", widthsBySize["full"] - 4)
                .and("be.lte", widthsBySize["full"] + 1);

            cy.get(cesc("#v"))
                .invoke("attr", "src")
                .then((src) => expect(src.includes("tJ4ypc5L6uU")).eq(true));

            cy.get(cesc("#state")).should("have.text", "stopped");
            cy.get(cesc("#time")).should("have.text", "0");
            cy.get(cesc("#secondsWatched")).should("have.text", "0");

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("v")].stateValues
                        .segmentsWatched,
                ).eq(null);
            });

            cy.log("play");
            cy.get(cesc("#playAction")).click();

            cy.get(cesc("#state")).should("have.text", "playing");
            cy.get(cesc("#time")).should("have.text", "1");

            cy.log("pause");
            cy.get(cesc("#pauseAction")).click();

            cy.get(cesc("#state")).should("have.text", "stopped");
            cy.get(cesc("#time")).should("have.text", "1");
            cy.get(cesc("#secondsWatched")).should("have.text", "1");

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
            cy.get(cesc("#playAction")).click();

            cy.get(cesc("#state")).should("have.text", "playing");
            cy.get(cesc("#time")).should("have.text", "3");

            cy.log("pause");
            cy.get(cesc("#pauseAction")).click();

            cy.get(cesc("#state")).should("have.text", "stopped");
            cy.get(cesc("#time")).should("have.text", "3");
            cy.get(cesc("#secondsWatched")).should("have.text", "3");

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
            cy.get(cesc("#playAction")).click();

            cy.get(cesc("#state")).should("have.text", "playing");
            cy.get(cesc("#time")).should("have.text", "4");

            cy.log("pause");
            cy.get(cesc("#pauseAction")).click();

            cy.get(cesc("#state")).should("have.text", "stopped");
            cy.get(cesc("#time")).should("have.text", "4");
            cy.get(cesc("#secondsWatched")).should("have.text", "4");

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
            cy.get(cesc("#mi") + " textarea").type(
                "{end}{backspace}60{enter}",
                {
                    force: true,
                },
            );
            cy.get(cesc("#time")).should("have.text", "60");

            cy.log("play");
            cy.get(cesc("#playAction")).click();

            cy.get(cesc("#state")).should("have.text", "playing");
            cy.get(cesc("#time")).should("have.text", "62");

            cy.log("pause");
            cy.get(cesc("#pauseAction")).click();

            cy.get(cesc("#state")).should("have.text", "stopped");
            cy.get(cesc("#time")).should("have.text", "62");
            cy.get(cesc("#secondsWatched")).contains(/6|7/);

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
            cy.get(cesc("#playAction")).click();

            cy.get(cesc("#state")).should("have.text", "playing");
            cy.get(cesc("#time")).should("have.text", "63");

            cy.log("pause");
            cy.get(cesc("#pauseAction")).click();

            cy.get(cesc("#state")).should("have.text", "stopped");
            cy.get(cesc("#time")).should("have.text", "63");
            cy.get(cesc("#secondsWatched")).contains(/7|8/);

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

            cy.get(cesc("#mi") + " textarea").type(
                "{end}{backspace}{backspace}1{enter}",
                { force: true },
            );
            cy.get(cesc("#time")).should("have.text", "1");

            cy.log("play");
            cy.get(cesc("#playAction")).click();

            cy.get(cesc("#state")).should("have.text", "playing");
            cy.get(cesc("#time")).should("have.text", "3");

            cy.log("pause");
            cy.get(cesc("#pauseAction")).click();

            cy.get(cesc("#state")).should("have.text", "stopped");
            cy.get(cesc("#time")).should("have.text", "3");
            cy.get(cesc("#secondsWatched")).contains(/7|8/);

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
            cy.get(cesc("#playAction")).click();

            cy.get(cesc("#state")).should("have.text", "playing");
            cy.get(cesc("#time")).should("have.text", "5");

            cy.log("pause");
            cy.get(cesc("#pauseAction")).click();

            cy.get(cesc("#state")).should("have.text", "stopped");
            cy.get(cesc("#time")).should("have.text", "5");
            cy.get(cesc("#secondsWatched")).contains(/8|9/);

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
    });
});
