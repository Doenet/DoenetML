describe("Component Size Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    // Note: skipping all since we moved from widths to sizes
    // TODO: create other tests for componentSize
    // Could also check if the widths become the nearest size

    it.skip("width of image from string", () => {
        let widthStrings = [
            "350",
            "350 px",
            "350px",
            "350 pixel",
            "  350  pixels ",
            "65%",
            "65 %",
            "  65   %",
            "8in",
            "8 inches",
            "8 inch",
            "100mm",
            "100millimeters",
            "100 millimeter",
            "10cm",
            "10centimeters",
            "10 centimeter",
            "100pt",
        ];
        let isAbsolutes = [
            true,
            true,
            true,
            true,
            true,
            false,
            false,
            false,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
        ];
        let sizes = [
            350, 350, 350, 350, 350, 65, 65, 65, 768, 768, 768, 377.95296,
            377.95296, 377.95296, 377.95296, 377.95296, 377.95296,
            133.3333333333,
        ];

        for (let [ind, widthString] of widthStrings.entries()) {
            cy.reload();

            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML: `
    <document name="doc">
    <p><text>${ind}</text></p>
    <image name="ae" width="${widthString}" source="https://mathinsight.org/media/image/image/giant_anteater.jpg" />
    <p>width: $ae.width{assignNames="w"}</p>
    <p>width as adapted number: <number name="wNum">$ae.width</number></p>
    <p>width as adapted math: <math name="wMath">$ae.width</math></p>
    <p>width as extracted number: <extract prop="number" assignNames="wExtract">$ae.width</extract></p>
    <p>extracted isAbsolute: <extract prop="isAbsolute" assignNames="absExtract">$ae.width</extract></p>
    </document>
    `,
                    },
                    "*",
                );
            });

            cy.get(cesc("#text1")).should("have.text", `${ind}`);

            cy.get(cesc("#doc"))
                .invoke("width")
                .then((docWidth) => {
                    let expectedWidthPixels = sizes[ind];
                    if (!isAbsolutes[ind]) {
                        expectedWidthPixels *= docWidth / 100;
                    }

                    cy.get(cesc("#ae"))
                        .invoke("width")
                        .then((width) => {
                            expect(Number(width)).closeTo(
                                expectedWidthPixels,
                                0.1,
                            );
                        });
                });

            let thisWidth = sizes[ind];
            let thisUnit;
            if (isAbsolutes[ind]) {
                thisUnit = "px";
            } else {
                thisUnit = "%";
            }

            cy.get(cesc("#w"))
                .invoke("text")
                .then((text) => {
                    expect(parseFloat(text)).closeTo(thisWidth, 1e-6);
                    expect(text.slice(text.length - thisUnit.length)).eq(
                        thisUnit,
                    );
                });
            cy.get(cesc("#wNum"))
                .invoke("text")
                .then((text) => {
                    expect(Number(text)).closeTo(thisWidth, 1e-6);
                });
            cy.get(cesc("#wMath"))
                .find(".mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(Number(text)).closeTo(thisWidth, 1e-6);
                });
            cy.get(cesc("#wExtract"))
                .invoke("text")
                .then((text) => {
                    expect(Number(text)).closeTo(thisWidth, 1e-6);
                });

            cy.get(cesc("#absExtract")).should(
                "have.text",
                isAbsolutes[ind].toString(),
            );

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("ae")].stateValues
                        .width.size,
                ).closeTo(sizes[ind], 1e-6);
                expect(
                    stateVariables[await win.resolvePath1("ae")].stateValues
                        .width.isAbsolute,
                ).eq(isAbsolutes[ind]);
            });
        }
    });

    it.skip("changing absolute width of image", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

<p><mathInput name="wPrescribed" prefill="500" /></p>
<image name="ae" width="$wPrescribed px" source="https://mathinsight.org/media/image/image/giant_anteater.jpg" />

<p>width: $ae.width{assignNames="w"}</p>
<p>width as adapted number: <number name="wNum">$ae.width</number></p>
<p>width as adapted math: <math name="wMath">$ae.width</math></p>
<p>width as extracted number: <extract prop="number" assignNames="wExtract">$ae.width</extract></p>
<p>extracted isAbsolute: <extract prop="isAbsolute" assignNames="absExtract">$ae.width</extract></p>
<p>Change width 2: <mathInput name="w2" bindValueTo="$ae.width" /></p>
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#ae"))
            .invoke("css", "width")
            .then((text) => {
                expect(parseFloat(text)).closeTo(500, 1);
            });

        cy.get(cesc("#w")).should("have.text", "500px");
        cy.get(cesc("#wNum")).should("have.text", "500");
        cy.get(cesc("#wMath"))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text).eq("500");
            });
        cy.get(cesc("#wExtract")).should("have.text", "500");
        cy.get(cesc("#absExtract")).should("have.text", "true");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.width
                    .size,
            ).closeTo(500, 1e-6);
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.width
                    .isAbsolute,
            ).eq(true);
        });

        cy.log(`changed prescribed width`);
        cy.get(cesc("#wPrescribed") + " textarea").type(
            "{ctrl+home}{shift+end}{backspace}312{enter}",
            { force: true },
        );

        cy.get(cesc("#w")).should("have.text", "312px");
        cy.get(cesc("#wNum")).should("have.text", "312");

        cy.get(cesc("#ae"))
            .invoke("css", "width")
            .then((text) => {
                expect(parseFloat(text)).closeTo(312, 1);
            });

        cy.get(cesc("#wMath"))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text).eq("312");
            });
        cy.get(cesc("#wExtract")).should("have.text", "312");
        cy.get(cesc("#absExtract")).should("have.text", "true");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.width
                    .size,
            ).closeTo(312, 1e-6);
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.width
                    .isAbsolute,
            ).eq(true);
        });

        cy.log(`changed width from inverse direction`);
        cy.get(cesc("#w2") + " textarea").type(
            "{ctrl+home}{shift+end}{backspace}476{enter}",
            { force: true },
        );

        cy.get(cesc("#w")).should("have.text", "476px");
        cy.get(cesc("#wNum")).should("have.text", "476");

        cy.get(cesc("#ae"))
            .invoke("css", "width")
            .then((text) => {
                expect(parseFloat(text)).closeTo(476, 1);
            });

        cy.get(cesc("#wMath"))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text).eq("476");
            });
        cy.get(cesc("#wExtract")).should("have.text", "476");
        cy.get(cesc("#absExtract")).should("have.text", "true");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.width
                    .size,
            ).closeTo(476, 1e-6);
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.width
                    .isAbsolute,
            ).eq(true);
        });
    });

    it.skip("changing relative width of image", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
<document name="doc">
<p><mathInput name="wPrescribed" prefill="50" /></p>
<image name="ae" width="$wPrescribed %" source="https://mathinsight.org/media/image/image/giant_anteater.jpg" />

<p>width: $ae.width{assignNames="w"}</p>
<p>width as adapted number: <number name="wNum">$ae.width</number></p>
<p>width as adapted math: <math name="wMath">$ae.width</math></p>
<p>width as extracted number: <extract prop="number" assignNames="wExtract">$ae.width</extract></p>
<p>extracted isAbsolute: <extract prop="isAbsolute" assignNames="absExtract">$ae.width</extract></p>
<p>Change width 2: <mathInput name="w2" bindValueTo="$(ae.width)" /></p>
</document>
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#doc"))
            .invoke("width")
            .then((docWidth) => {
                let expectedWidthPixels = (50 * docWidth) / 100;
                cy.get(cesc("#ae"))
                    .invoke("width")
                    .then((width) => {
                        expect(Number(width)).closeTo(expectedWidthPixels, 0.1);
                    });
            });

        cy.get(cesc("#w")).should("have.text", "50%");
        cy.get(cesc("#wNum")).should("have.text", "50");
        cy.get(cesc("#wMath"))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text).eq("50");
            });
        cy.get(cesc("#wExtract")).should("have.text", "50");
        cy.get(cesc("#absExtract")).should("have.text", "false");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.width
                    .size,
            ).closeTo(50, 1e-6);
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.width
                    .isAbsolute,
            ).eq(false);
        });

        cy.log(`changed prescribed width`);
        cy.get(cesc("#wPrescribed") + " textarea").type(
            "{ctrl+home}{shift+end}{backspace}31{enter}",
            { force: true },
        );

        cy.get(cesc("#w")).should("have.text", "31%");
        cy.get(cesc("#wNum")).should("have.text", "31");

        cy.get(cesc("#doc"))
            .invoke("width")
            .then((docWidth) => {
                let expectedWidthPixels = (31 * docWidth) / 100;
                cy.get(cesc("#ae"))
                    .invoke("width")
                    .then((width) => {
                        expect(Number(width)).closeTo(expectedWidthPixels, 0.1);
                    });
            });

        cy.get(cesc("#wMath"))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text).eq("31");
            });
        cy.get(cesc("#wExtract")).should("have.text", "31");
        cy.get(cesc("#absExtract")).should("have.text", "false");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.width
                    .size,
            ).closeTo(31, 1e-6);
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.width
                    .isAbsolute,
            ).eq(false);
        });

        cy.log(`changed width from inverse direction`);
        cy.get(cesc("#w2") + " textarea").type(
            "{end}{backspace}{backspace}76{enter}",
            { force: true },
        );

        cy.get(cesc("#w")).should("have.text", "76%");
        cy.get(cesc("#wNum")).should("have.text", "76");

        cy.get(cesc("#doc"))
            .invoke("width")
            .then((docWidth) => {
                let expectedWidthPixels = (76 * docWidth) / 100;
                cy.get(cesc("#ae"))
                    .invoke("width")
                    .then((width) => {
                        expect(Number(width)).closeTo(expectedWidthPixels, 0.1);
                    });
            });

        cy.get(cesc("#wMath"))
            .find(".mjx-mrow")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text).eq("76");
            });
        cy.get(cesc("#wExtract")).should("have.text", "76");
        cy.get(cesc("#absExtract")).should("have.text", "false");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.width
                    .size,
            ).closeTo(76, 1e-6);
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.width
                    .isAbsolute,
            ).eq(false);
        });
    });

    it.skip("height of image depends on width", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
<p><mathInput name="wPrescribed" prefill="500" /></p>
<image name="ae" width="$wPrescribed px" height="$(ae.width)/2" source="https://mathinsight.org/media/image/image/giant_anteater.jpg" />

<p>width: $ae.width{assignNames="w"}</p>
<p>height: $ae.height{assignNames="h"}</p>
<p>Change width 2: <mathInput name="w2" bindValueTo="$(ae.width)" /></p>
<p>Change height 2: <mathInput name="h2" bindValueTo="$(ae.height)" /></p>
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#ae"))
            .invoke("css", "width")
            .then((text) => {
                expect(parseFloat(text)).closeTo(500, 1);
            });
        cy.get(cesc("#ae"))
            .invoke("css", "height")
            .then((text) => {
                expect(parseFloat(text)).closeTo(250, 1);
            });

        cy.get(cesc("#w")).should("have.text", "500px");
        cy.get(cesc("#h")).should("have.text", "250px");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.width
                    .size,
            ).closeTo(500, 1e-6);
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.width
                    .isAbsolute,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.height
                    .size,
            ).closeTo(250, 1e-6);
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.height
                    .isAbsolute,
            ).eq(true);
        });

        cy.log(`changed prescribed width`);
        cy.get(cesc("#wPrescribed") + " textarea").type(
            "{ctrl+home}{shift+end}{backspace}312{enter}",
            { force: true },
        );

        cy.get(cesc("#w")).should("have.text", "312px");
        cy.get(cesc("#h")).should("have.text", "156px");

        cy.get(cesc("#ae"))
            .invoke("css", "width")
            .then((text) => {
                expect(parseFloat(text)).closeTo(312, 1);
            });
        cy.get(cesc("#ae"))
            .invoke("css", "height")
            .then((text) => {
                expect(parseFloat(text)).closeTo(156, 1);
            });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.width
                    .size,
            ).closeTo(312, 1e-6);
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.width
                    .isAbsolute,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.height
                    .size,
            ).closeTo(156, 1e-6);
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.height
                    .isAbsolute,
            ).eq(true);
        });

        cy.log(`changed width from inverse direction`);
        cy.get(cesc("#w2") + " textarea").type(
            "{ctrl+home}{shift+end}{backspace}476{enter}",
            { force: true },
        );

        cy.get(cesc("#w")).should("have.text", "476px");
        cy.get(cesc("#h")).should("have.text", "238px");

        cy.get(cesc("#ae"))
            .invoke("css", "width")
            .then((text) => {
                expect(parseFloat(text)).closeTo(476, 1);
            });
        cy.get(cesc("#ae"))
            .invoke("css", "height")
            .then((text) => {
                expect(parseFloat(text)).closeTo(238, 1);
            });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.width
                    .size,
            ).closeTo(476, 1e-6);
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.width
                    .isAbsolute,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.height
                    .size,
            ).closeTo(238, 1e-6);
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.height
                    .isAbsolute,
            ).eq(true);
        });

        cy.log(`changed height from inverse direction`);
        cy.get(cesc("#h2") + " textarea").type(
            "{ctrl+home}{shift+end}{backspace}321{enter}",
            { force: true },
        );

        cy.get(cesc("#w")).should("have.text", "642px");
        cy.get(cesc("#h")).should("have.text", "321px");

        cy.get(cesc("#ae"))
            .invoke("css", "width")
            .then((text) => {
                expect(parseFloat(text)).closeTo(642, 1);
            });
        cy.get(cesc("#ae"))
            .invoke("css", "height")
            .then((text) => {
                expect(parseFloat(text)).closeTo(321, 1);
            });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.width
                    .size,
            ).closeTo(642, 1e-6);
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.width
                    .isAbsolute,
            ).eq(true);
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.height
                    .size,
            ).closeTo(321, 1e-6);
            expect(
                stateVariables[await win.resolvePath1("ae")].stateValues.height
                    .isAbsolute,
            ).eq(true);
        });
    });
});
