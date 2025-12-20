import { cesc, widthsBySize } from "@doenet/utils";

describe("Image Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("image from external source", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <image name="image1" source="http://mathinsight.org/media/image/image/giant_anteater.jpg" width="300px">
    <shortDescription>A giant anteater</shortDescription>
  </image>
  `,
                },
                "*",
            );
        });
        cy.get(cesc("#image1"))
            .invoke("css", "width")
            .then((width) => parseInt(width))
            .should("be.gte", widthsBySize["small"] - 4)
            .and("be.lte", widthsBySize["small"] + 1);
        // cy.get(cesc('#image1')).invoke('css', 'height').then((height) => expect(height).eq(undefined))
        cy.get(cesc("#image1"))
            .invoke("attr", "alt")
            .then((alt) => expect(alt).eq("A giant anteater"));
    });

    it("image in graph", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph >
      <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" width="$width1%" aspectRatio="$aspectRatio1" anchor="$anchorCoords1" name="image1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1"/>
      <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" name="image2" />
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

        cy.get(cesc("#pWidth1")).should("have.text", "Width 1: 40%");
        cy.get(cesc("#pWidth2")).should("have.text", "Width 2: 50%");
        cy.get(cesc("#pAspectRatio1")).should("have.text", "Aspect Ratio 1: 1");
        cy.get(cesc("#pAspectRatio2")).should(
            "have.text",
            "Aspect Ratio 2: NaN",
        );
        cy.get(cesc("#image1a"))
            .invoke("css", "width")
            .then((str) => parseInt(str))
            .should("be.closeTo", 255, 2);
        cy.get(cesc("#image2a"))
            .invoke("css", "width")
            .then((str) => parseInt(str))
            .should("be.closeTo", 425, 2);
        cy.get(cesc("#image1a"))
            .invoke("css", "aspectRatio")
            .then((str) => parseInt(str))
            .should("equal", 1);
        cy.get(cesc("#image2a"))
            .invoke("css", "aspectRatio")
            .should("equal", "auto");

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

        cy.get(cesc("#width1") + " textarea").type(
            "{end}{backspace}{backspace}100{enter}",
            { force: true },
        );
        cy.get(cesc("#width2") + " textarea").type(
            "{end}{backspace}{backspace}80{enter}",
            { force: true },
        );

        cy.get(cesc("#pWidth1")).should("have.text", "Width 1: 100%");
        cy.get(cesc("#pWidth2")).should("have.text", "Width 2: 80%");

        cy.get(cesc("#image1a"))
            .invoke("css", "width")
            .then((str) => parseInt(str))
            .should("be.closeTo", 850, 2);
        cy.get(cesc("#image2a"))
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

        cy.get(cesc("#width1a") + " textarea").type("{end}{backspace}{enter}", {
            force: true,
        });
        cy.get(cesc("#pWidth1")).should("have.text", "Width 1: 10%");
        cy.get(cesc("#image1a"))
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

        cy.get(cesc("#aspectRatio1") + " textarea").type(
            "{end}{backspace}2{enter}",
            { force: true },
        );
        cy.get(cesc("#aspectRatio2") + " textarea").type("1/2{enter}", {
            force: true,
        });

        cy.get(cesc("#pAspectRatio1")).should("have.text", "Aspect Ratio 1: 2");
        cy.get(cesc("#pAspectRatio2")).should(
            "have.text",
            "Aspect Ratio 2: 0.5",
        );
        cy.get(cesc("#image1a"))
            .invoke("css", "aspectRatio")
            .then((str) => parseFloat(str))
            .should("equal", 2);
        cy.get(cesc("#image2a"))
            .invoke("css", "aspectRatio")
            .then((str) => parseFloat(str))
            .should("equal", 0.5);

        cy.get(cesc("#aspectRatio1a") + " textarea").type(
            "{end}{backspace}{enter}",
            { force: true },
        );
        cy.get(cesc("#aspectRatio2") + " textarea").type(
            "{end}{backspace}{backspace}{backspace}{enter}",
            { force: true },
        );

        cy.get(cesc("#pAspectRatio1")).should(
            "have.text",
            "Aspect Ratio 1: NaN",
        );
        cy.get(cesc("#pAspectRatio2")).should(
            "have.text",
            "Aspect Ratio 2: NaN",
        );
        cy.get(cesc("#image1a"))
            .invoke("css", "aspectRatio")
            .should("equal", "auto");
        cy.get(cesc("#image2a"))
            .invoke("css", "aspectRatio")
            .should("equal", "auto");
    });

    it("image in graph, absolute size", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph >
      <image source="http://mathinsight.org/media/image/image/giant_anteater.jpg" width="$width1" aspectRatio="$aspectRatio1" name="image1" />
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

        cy.get(cesc("#pWidth1")).should("have.text", "Width 1: 5px");
        cy.get(cesc("#pAspectRatio1")).should("have.text", "Aspect Ratio 1: 1");

        cy.get(cesc("#image1a"))
            .invoke("css", "width")
            .then((str) => parseInt(str))
            .should("be.closeTo", 70.8, 2);
        cy.get(cesc("#image1a"))
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

        cy.get(cesc("#width1") + " textarea").type(
            "{end}{backspace}{backspace}10{enter}",
            { force: true },
        );

        cy.get(cesc("#pWidth1")).should("have.text", "Width 1: 10px");

        cy.get(cesc("#image1a"))
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

        cy.get(cesc("#width1a") + " textarea").type(
            "{end}{backspace}{backspace}15{enter}",
            { force: true },
        );

        cy.get(cesc("#pWidth1")).should("have.text", "Width 1: 15px");
        cy.get(cesc("#image1a"))
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

        cy.get(cesc("#aspectRatio1") + " textarea").type(
            "{end}{backspace}2{enter}",
            { force: true },
        );

        cy.get(cesc("#pAspectRatio1")).should("have.text", "Aspect Ratio 1: 2");
        cy.get(cesc("#image1a"))
            .invoke("css", "aspectRatio")
            .then((str) => parseFloat(str))
            .should("equal", 2);

        cy.get(cesc("#aspectRatio1a") + " textarea").type(
            "{end}{backspace}{enter}",
            { force: true },
        );

        cy.get(cesc("#pAspectRatio1")).should(
            "have.text",
            "Aspect Ratio 1: NaN",
        );
        cy.get(cesc("#image1a"))
            .invoke("css", "aspectRatio")
            .should("equal", "auto");
    });

    it("with description", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <image name="image"  source="http://mathinsight.org/media/image/image/giant_anteater.jpg">
        <shortDescription>An image</shortDescription>
        <description>
            <p>An anteater image.</p>
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
        cy.get("#image-container [data-test='Description Summary']").click();

        cy.get("#image-container [data-test='Description']").should(
            "have.attr",
            "open",
        );

        cy.get("#image-container [data-test='Description']").should(
            "contain.text",
            "An anteater image.",
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

    it("with description, inline", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <image name="image" displayMode="inline" source="http://mathinsight.org/media/image/image/giant_anteater.jpg">
        <shortDescription>An image</shortDescription>
        <description>
            <p>An anteater image.</p>
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
        cy.get("#image-container [data-test='Description Button']").click();

        cy.get("#image-container [data-test='Description']").should(
            "contain.text",
            "An anteater image.",
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
    <image name="image"  source="http://mathinsight.org/media/image/image/giant_anteater.jpg">
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
    });

    it("without description, inline", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <image name="image" displayMode="inline" source="http://mathinsight.org/media/image/image/giant_anteater.jpg">
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
    });
});
