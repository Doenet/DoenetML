import { widthsBySize } from "@doenet/utils";
import { assertCenteredWhenDescriptionOpens } from "./utils/mediaAlignment";

describe("Image Tag Tests", { tags: ["@group1"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("image from external source", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <image name="image1" source="./Doenet_Logo_Frontpage.png" width="300px">
    <shortDescription>The Doenet logo</shortDescription>
  </image>
  `,
                },
                "*",
            );
        });
        cy.get("#image1")
            .invoke("css", "width")
            .then((width) => parseInt(width))
            .should("be.gte", widthsBySize["small"] - 4)
            .and("be.lte", widthsBySize["small"] + 1);
        // cy.get('#image1').invoke('css', 'height').then((height) => expect(height).eq(undefined))
        cy.get("#image1")
            .invoke("attr", "alt")
            .then((alt) => expect(alt).eq("The Doenet logo"));
    });

    it("image in graph", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph >
      <image source="./Doenet_Logo_Frontpage.png" width="$width1%" aspectRatio="$aspectRatio1" anchor="$anchorCoords1" name="image1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1"/>
      <image source="./Doenet_Logo_Frontpage.png" name="image2" />
    </graph>
    
    <p name="pWidth1">Width 1: $image1.width</p>
    <p name="pWidth2">Width 2: $image2.width</p>
    <p>Change width 1 <mathInput name="width1" prefill="40" /></p>
    <p>Change width 1a <mathInput name="width1a" bindValueTo="$image1.width" /></p>
    <p>Change width 2 <mathInput name="width2" bindValueTo="$image2.width" /></p>
    <p name="pAspectRatio1">Aspect Ratio 1: $image1.aspectRatio</p>
    <p name="pAspectRatio2">Aspect Ratio 2: $image2.AspectRatio</p>
    <p>Change aspect ratio 1 <mathInput name="aspectRatio1" prefill="1" /></p>
    <p>Change aspect ratio 1a <mathInput name="aspectRatio1a" bindValueTo="$image1.aspectRatio" /></p>
    <p>Change aspect ratio 2 <mathInput name="aspectRatio2" bindValueTo="$image2.aspectRatio" /></p>
    
    <image extend="$image1" name="image1a" />
    <image extend="$image2" name="image2a" />


    `,
                },
                "*",
            );
        });

        cy.get("#pWidth1").should("have.text", "Width 1: 40%");
        cy.get("#pWidth2").should("have.text", "Width 2: 50%");
        cy.get("#pAspectRatio1").should("have.text", "Aspect Ratio 1: 1");
        cy.get("#pAspectRatio2").should("have.text", "Aspect Ratio 2: NaN");
        cy.get("#image1a")
            .invoke("css", "width")
            .then((str) => parseInt(str))
            .should("be.closeTo", 255, 2);
        cy.get("#image2a")
            .invoke("css", "width")
            .then((str) => parseInt(str))
            .should("be.closeTo", 425, 2);
        cy.get("#image1a")
            .invoke("css", "aspectRatio")
            .then((str) => parseInt(str))
            .should("equal", 1);
        cy.get("#image2a").invoke("css", "aspectRatio").should("equal", "auto");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("image1")].stateValues
                    .widthForGraph,
            ).eqls({
                isAbsolute: true,
                size: 0.4 * 20,
            });
            expect(
                stateVariables[await win.resolvePath1("image2")].stateValues
                    .widthForGraph,
            ).eqls({
                isAbsolute: true,
                size: 0.5 * 20,
            });
        });

        cy.log("change widths");

        cy.get("#width1" + " textarea").type(
            "{end}{backspace}{backspace}100{enter}",
            { force: true },
        );
        cy.get("#width2" + " textarea").type(
            "{end}{backspace}{backspace}80{enter}",
            { force: true },
        );

        cy.get("#pWidth1").should("have.text", "Width 1: 100%");
        cy.get("#pWidth2").should("have.text", "Width 2: 80%");

        cy.get("#image1a")
            .invoke("css", "width")
            .then((str) => parseInt(str))
            .should("be.closeTo", 850, 2);
        cy.get("#image2a")
            .invoke("css", "width")
            .then((str) => parseInt(str))
            .should("be.closeTo", 595, 2);

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("image1")].stateValues
                    .widthForGraph,
            ).eqls({
                isAbsolute: true,
                size: 20,
            });
            expect(
                stateVariables[await win.resolvePath1("image2")].stateValues
                    .widthForGraph,
            ).eqls({
                isAbsolute: true,
                size: 0.8 * 20,
            });
        });

        cy.get("#width1a" + " textarea").type("{end}{backspace}{enter}", {
            force: true,
        });
        cy.get("#pWidth1").should("have.text", "Width 1: 10%");
        cy.get("#image1a")
            .invoke("css", "width")
            .then((str) => parseInt(str))
            .should("be.closeTo", 70.8, 2);

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("image1")].stateValues
                    .widthForGraph,
            ).eqls({
                isAbsolute: true,
                size: 2,
            });
        });

        cy.log("change aspect ratio");

        cy.get("#aspectRatio1" + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get("#aspectRatio2" + " textarea").type("1/2{enter}", {
            force: true,
        });

        cy.get("#pAspectRatio1").should("have.text", "Aspect Ratio 1: 2");
        cy.get("#pAspectRatio2").should("have.text", "Aspect Ratio 2: 0.5");
        cy.get("#image1a")
            .invoke("css", "aspectRatio")
            .then((str) => parseFloat(str))
            .should("equal", 2);
        cy.get("#image2a")
            .invoke("css", "aspectRatio")
            .then((str) => parseFloat(str))
            .should("equal", 0.5);

        cy.get("#aspectRatio1a" + " textarea").type("{end}{backspace}{enter}", {
            force: true,
        });
        cy.get("#aspectRatio2" + " textarea").type(
            "{end}{backspace}{backspace}{backspace}{enter}",
            { force: true },
        );

        cy.get("#pAspectRatio1").should("have.text", "Aspect Ratio 1: NaN");
        cy.get("#pAspectRatio2").should("have.text", "Aspect Ratio 2: NaN");
        cy.get("#image1a").invoke("css", "aspectRatio").should("equal", "auto");
        cy.get("#image2a").invoke("css", "aspectRatio").should("equal", "auto");
    });

    it("image in graph, absolute size", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph >
      <image source="./Doenet_Logo_Frontpage.png" width="$width1" aspectRatio="$aspectRatio1" name="image1" />
    </graph>
    
    <p name="pWidth1">Width 1: $image1.width</p>
    <p>Change width 1 <mathInput name="width1" prefill="5" /></p>
    <p>Change width 1a <mathInput name="width1a" bindValueTo="$image1.width" /></p>
    <p name="pAspectRatio1">Aspect Ratio 1: $image1.aspectRatio</p>
    <p>Change aspect ratio 1 <mathInput name="aspectRatio1" prefill="1" /></p>
    <p>Change aspect ratio 1a <mathInput name="aspectRatio1a" bindValueTo="$image1.aspectRatio" /></p>
    
    <image extend="$image1" name="image1a" />

    `,
                },
                "*",
            );
        });

        cy.get("#pWidth1").should("have.text", "Width 1: 5px");
        cy.get("#pAspectRatio1").should("have.text", "Aspect Ratio 1: 1");

        cy.get("#image1a")
            .invoke("css", "width")
            .then((str) => parseInt(str))
            .should("be.closeTo", 70.8, 2);
        cy.get("#image1a")
            .invoke("css", "aspectRatio")
            .then((str) => parseInt(str))
            .should("equal", 1);

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("image1")].stateValues
                    .widthForGraph,
            ).eqls({
                isAbsolute: true,
                size: 5,
            });
        });

        cy.log("change width");

        cy.get("#width1" + " textarea").type(
            "{end}{backspace}{backspace}10{enter}",
            { force: true },
        );

        cy.get("#pWidth1").should("have.text", "Width 1: 10px");

        cy.get("#image1a")
            .invoke("css", "width")
            .then((str) => parseInt(str))
            .should("be.closeTo", 70.8, 2);

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("image1")].stateValues
                    .widthForGraph,
            ).eqls({
                isAbsolute: true,
                size: 10,
            });
        });

        cy.get("#width1a" + " textarea").type(
            "{end}{backspace}{backspace}15{enter}",
            { force: true },
        );

        cy.get("#pWidth1").should("have.text", "Width 1: 15px");
        cy.get("#image1a")
            .invoke("css", "width")
            .then((str) => parseInt(str))
            .should("be.closeTo", 70.8, 2);

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("image1")].stateValues
                    .widthForGraph,
            ).eqls({
                isAbsolute: true,
                size: 15,
            });
        });

        cy.log("change aspect ratio");

        cy.get("#aspectRatio1" + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });

        cy.get("#pAspectRatio1").should("have.text", "Aspect Ratio 1: 2");
        cy.get("#image1a")
            .invoke("css", "aspectRatio")
            .then((str) => parseFloat(str))
            .should("equal", 2);

        cy.get("#aspectRatio1a" + " textarea").type("{end}{backspace}{enter}", {
            force: true,
        });

        cy.get("#pAspectRatio1").should("have.text", "Aspect Ratio 1: NaN");
        cy.get("#image1a").invoke("css", "aspectRatio").should("equal", "auto");
    });

    it("with description", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <image name="image"  source="./Doenet_Logo_Frontpage.png">
        <shortDescription>An image</shortDescription>
        <description>
            <p>The Doenet logo.</p>
        </description>
    </image>

    `,
                },
                "*",
            );
        });

        cy.get("#image-container [data-test='Description']").should(
            "not.have.attr",
            "open",
        );

        cy.get("#image").should(
            "have.attr",
            "aria-details",
            `image-description-content`,
        );
        cy.get(`#image-description-content`).should(
            "contain.text",
            "The Doenet logo.",
        );

        cy.get("#image-container [data-test='Description Summary']").click();

        cy.get("#image-container [data-test='Description']").should(
            "have.attr",
            "open",
        );

        cy.get("#image-container [data-test='Description']").should(
            "contain.text",
            "The Doenet logo.",
        );

        cy.get("#image").click();
        cy.get("#image-container [data-test='Description']").should(
            "have.attr",
            "open",
        );

        cy.get("#image-container [data-test='Description Summary']").click();

        cy.get("#image-container [data-test='Description']").should(
            "not.have.attr",
            "open",
        );
    });

    it("keeps non-inline image centered when description opens", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <image name="image" source="./Doenet_Logo_Frontpage.png" width="300px" horizontalAlign="center">
        <shortDescription>An image</shortDescription>
        <description>
            <p>The Doenet logo.</p>
        </description>
    </image>
    `,
                },
                "*",
            );
        });

        assertCenteredWhenDescriptionOpens({
            containerSelector: "#image-container",
            mediaSelector: "#image",
            detailsSelector: "#image-container [data-test='Description']",
            summarySelector:
                "#image-container [data-test='Description Summary']",
        });
    });

    it("with description, inline", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <image name="image" displayMode="inline" source="./Doenet_Logo_Frontpage.png">
        <shortDescription>An image</shortDescription>
        <description>
            <p>The Doenet logo.</p>
        </description>
    </image>

    `,
                },
                "*",
            );
        });

        cy.get("#image-container [data-test='Description Button']").should(
            "be.visible",
        );
        cy.get("#image-container [data-test='Description']").should(
            "not.be.visible",
        );
        cy.get("#image").should(
            "have.attr",
            "aria-details",
            `image-description-content`,
        );
        cy.get(`#image-description-content`).should(
            "contain.text",
            "The Doenet logo.",
        );

        cy.get("#image-container [data-test='Description Button']").click();

        cy.get("#image-container [data-test='Description']").should(
            "contain.text",
            "The Doenet logo.",
        );

        cy.get("#image").click();

        cy.get("#image-container [data-test='Description']").should(
            "not.be.visible",
        );
    });

    it("without description", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <image name="image"  source="./Doenet_Logo_Frontpage.png">
        <shortDescription>An image</shortDescription>
    </image>

    `,
                },
                "*",
            );
        });

        cy.get("#image").should("be.visible");

        cy.get("#image-container [data-test='Description Button']").should(
            "not.exist",
        );
        cy.get("#image-container [data-test='Description']").should(
            "not.exist",
        );
        cy.get("#image").should("not.have.attr", "aria-details");
    });

    it("without description, inline", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <image name="image" displayMode="inline" source="./Doenet_Logo_Frontpage.png">
        <shortDescription>An image</shortDescription>
    </image>

    `,
                },
                "*",
            );
        });

        cy.get("#image").should("be.visible");
        cy.get("#image-container [data-test='Description Button']").should(
            "not.exist",
        );
        cy.get("#image-container [data-test='Description']").should(
            "not.exist",
        );
        cy.get("#image").should("not.have.attr", "aria-details");
    });

    it("license codes render attribution at the bottom of the description", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <image name="image" source="./Doenet_Logo_Frontpage.png"
        imageName="A Squirrel" authorName="Jane Doe"
        originalUrl="https://example.com/original"
        authorUrl="https://example.com/jane"
        licenseCodes="CC-BY-SA GFDL">
        <shortDescription>An image</shortDescription>
        <description><p>A longer description.</p></description>
    </image>
    `,
                },
                "*",
            );
        });

        cy.get("#image").should("be.visible");

        // The attribution lives inside the description content, beneath the
        // authored description paragraph; open the description to reveal it.
        cy.get("#image-container [data-test='Description Summary']").click();

        // authored description paragraph comes first
        cy.get("#image-description-content").should(
            "contain.text",
            "A longer description.",
        );

        // attribution reads as a single TASL-style credit sentence: the quoted
        // imageName is the subject, the Creative Commons license uses the
        // "a <name> <version> license" form, the GNU license uses the "the
        // <name>" form, and the two are joined with "or" for dual licensing
        cy.get("#image-attribution")
            .invoke("text")
            .should(
                "match",
                /^\u201CA Squirrel\u201D by Jane Doe is licensed under a Creative Commons Attribution-ShareAlike 4\.0 license or the GNU Free Documentation License\.$/,
            );

        // the imageName (TASL title) links to the source URL
        cy.get("#image-attribution")
            .contains("a", "A Squirrel")
            .should("have.attr", "href", "https://example.com/original");

        // the author name links to the author URL (independent of the source)
        cy.get("#image-attribution")
            .contains("a", "Jane Doe")
            .should("have.attr", "href", "https://example.com/jane");

        // each license links to its deed, with the CC version in the label
        cy.get("#image-attribution")
            .contains("a", "Creative Commons Attribution-ShareAlike 4.0")
            .should(
                "have.attr",
                "href",
                "https://creativecommons.org/licenses/by-sa/4.0/",
            );
        cy.get("#image-attribution")
            .contains("a", "GNU Free Documentation License")
            .should(
                "have.attr",
                "href",
                "https://www.gnu.org/licenses/fdl-1.3.html",
            );
    });

    it("uses the generic word \u201CImage\u201D as the subject when no imageName is given", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <image name="image" source="./Doenet_Logo_Frontpage.png"
        authorName="Jane Doe" originalUrl="https://example.com/original"
        licenseCodes="CC-BY">
        <shortDescription>An image</shortDescription>
    </image>
    `,
                },
                "*",
            );
        });

        cy.get("#image").should("be.visible");
        cy.get("#image-container [data-test='Description Summary']").click();

        cy.get("#image-attribution")
            .invoke("text")
            .should(
                "match",
                /^Image by Jane Doe is licensed under a Creative Commons Attribution 4\.0 license\.$/,
            );
        // with no imageName, the generic "Image" subject carries the source link
        cy.get("#image-attribution")
            .contains("a", "Image")
            .should("have.attr", "href", "https://example.com/original");
    });

    it("phrases public-domain dedications as \u201Cin the public domain\u201D", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <image name="image" source="./Doenet_Logo_Frontpage.png"
        authorName="Jane Doe" licenseCodes="CC0">
        <shortDescription>An image</shortDescription>
    </image>
    `,
                },
                "*",
            );
        });

        cy.get("#image").should("be.visible");
        cy.get("#image-container [data-test='Description Summary']").click();

        cy.get("#image-attribution")
            .invoke("text")
            .should(
                "match",
                /^Image by Jane Doe is in the public domain \(CC0 1\.0 Public Domain Dedication\)\.$/,
            );
        cy.get("#image-attribution")
            .contains("a", "CC0 1.0 Public Domain Dedication")
            .should(
                "have.attr",
                "href",
                "https://creativecommons.org/publicdomain/zero/1.0/",
            );
    });

    it("attribution alone produces a description UI when no description is authored", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <image name="image" source="./Doenet_Logo_Frontpage.png"
        authorName="Jane Doe" licenseCodes="CC-BY">
        <shortDescription>An image</shortDescription>
    </image>
    `,
                },
                "*",
            );
        });

        cy.get("#image").should("be.visible");

        // even without an authored <description>, the attribution produces the
        // same description disclosure UI
        cy.get("#image-container [data-test='Description Summary']").click();
        cy.get("#image-attribution")
            .contains("a", "Creative Commons Attribution")
            .should(
                "have.attr",
                "href",
                "https://creativecommons.org/licenses/by/4.0/",
            );
    });
});
