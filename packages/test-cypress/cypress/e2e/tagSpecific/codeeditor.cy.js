import { cesc, cesc2 } from "@doenet/utils";
describe("Code Editor Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("code editor with no arguments", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <codeEditor name="editor" />

    <p>$editor.immediateValue</p>
    <p>$editor.value</p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("contain.text", "a");

        cy.get(cesc("#\\/_p1")).should("have.text", "");
        cy.get(cesc("#\\/_p2")).should("have.text", "");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/editor"].stateValues.immediateValue).eq("");
            expect(stateVariables["/editor"].stateValues.value).eq("");
        });

        cy.log("type text in editor");
        cy.get(cesc("#\\/editor") + " .cm-activeLine").invoke("text", "Hello!");

        cy.get(cesc("#\\/_p1")).should("have.text", "Hello!");
        cy.get(cesc("#\\/_p2")).should("have.text", "");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/editor"].stateValues.immediateValue).eq(
                "Hello!",
            );
            expect(stateVariables["/editor"].stateValues.value).eq("");
        });

        cy.log("wait for debounce to update value");
        cy.wait(1500);
        cy.get(cesc("#\\/_p1")).should("have.text", "Hello!");
        cy.get(cesc("#\\/_p2")).should("have.text", "Hello!");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/editor"].stateValues.immediateValue).eq(
                "Hello!",
            );
            expect(stateVariables["/editor"].stateValues.value).eq("Hello!");
        });

        cy.log("type more in editor");
        cy.get(cesc("#\\/editor") + " .cm-activeLine").type("{enter}");
        cy.get(cesc("#\\/editor") + " .cm-activeLine").invoke(
            "text",
            "More here.",
        );

        cy.get(cesc("#\\/_p1")).should("have.text", "Hello!\nMore here.");
        cy.get(cesc("#\\/_p2")).should("have.text", "Hello!");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/editor"].stateValues.immediateValue).eq(
                "Hello!\nMore here.",
            );
            expect(stateVariables["/editor"].stateValues.value).eq("Hello!");
        });

        cy.log("blur to update value");
        cy.get(cesc("#\\/editor") + " .cm-content").blur();

        cy.get(cesc("#\\/_p1")).should("have.text", "Hello!\nMore here.");
        cy.get(cesc("#\\/_p2")).should("have.text", "Hello!\nMore here.");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/editor"].stateValues.immediateValue).eq(
                "Hello!\nMore here.",
            );
            expect(stateVariables["/editor"].stateValues.value).eq(
                "Hello!\nMore here.",
            );
        });
    });

    it("code editor with show results", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <codeEditor showResults name="editor" />

    <p>$editor.immediateValue</p>
    <p>$editor.value</p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("contain.text", "a");

        cy.get(cesc2(`#/editor/_document1`)).should("exist");

        cy.get(cesc("#\\/_p1")).should("have.text", "");
        cy.get(cesc("#\\/_p2")).should("have.text", "");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/editor"].stateValues.immediateValue).eq("");
            expect(stateVariables["/editor"].stateValues.value).eq("");

            let stateVariablesEditor =
                await win.returnAllStateVariableseditor();
            expect(Object.keys(stateVariablesEditor).length).eq(1);
        });

        cy.log("type text in editor");
        cy.get(cesc("#\\/editor") + " .cm-content").focus();
        cy.get(cesc("#\\/editor") + " .cm-activeLine").invoke(
            "text",
            "<p>Hello!</p>",
        );

        cy.get(cesc("#\\/_p1")).should("have.text", "<p>Hello!</p>");
        cy.get(cesc("#\\/_p2")).should("have.text", "");
        cy.get(cesc2(`#/editor/_document1`)).should("exist");
        cy.get(cesc2(`#/editor/_p1`)).should("not.exist");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/editor"].stateValues.immediateValue).eq(
                "<p>Hello!</p>",
            );
            expect(stateVariables["/editor"].stateValues.value).eq("");

            let stateVariablesEditor =
                await win.returnAllStateVariableseditor();
            expect(Object.keys(stateVariablesEditor).length).eq(1);
        });

        cy.log("blur updates value but not content");
        cy.get(cesc("#\\/editor") + " .cm-content").blur();

        cy.get(cesc("#\\/_p1")).should("have.text", "<p>Hello!</p>");
        cy.get(cesc("#\\/_p2")).should("have.text", "<p>Hello!</p>");
        cy.get(cesc2(`#/editor/_document1`)).should("exist");
        cy.get(cesc2(`#/editor/_p1`)).should("not.exist");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/editor"].stateValues.immediateValue).eq(
                "<p>Hello!</p>",
            );
            expect(stateVariables["/editor"].stateValues.value).eq(
                "<p>Hello!</p>",
            );

            let stateVariablesEditor =
                await win.returnAllStateVariableseditor();
            expect(Object.keys(stateVariablesEditor).length).eq(1);
        });

        cy.log("click to update content");
        cy.get(`[data-test="Viewer Update Button"]`).click();

        cy.get(cesc2(`#/editor/_p1`)).should("have.text", "Hello!");
        cy.get(cesc("#\\/_p1")).should("have.text", "<p>Hello!</p>");
        cy.get(cesc("#\\/_p2")).should("have.text", "<p>Hello!</p>");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/editor"].stateValues.immediateValue).eq(
                "<p>Hello!</p>",
            );
            expect(stateVariables["/editor"].stateValues.value).eq(
                "<p>Hello!</p>",
            );

            let stateVariablesEditor =
                await win.returnAllStateVariableseditor();
            expect(stateVariablesEditor["/_p1"].activeChildren[0]).eq("Hello!");
        });

        cy.log("type more content");

        cy.get(cesc("#\\/editor") + " .cm-activeLine").type(
            "{ctrl+end}{enter}",
        );
        cy.get(cesc("#\\/editor") + " .cm-activeLine").invoke(
            "text",
            "<p><math simplify>1+1</math></p>",
        );

        cy.get(cesc("#\\/_p1")).should(
            "have.text",
            "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
        );
        cy.get(cesc("#\\/_p2")).should("have.text", "<p>Hello!</p>");

        cy.get(cesc2(`#/editor/_p1`)).should("have.text", "Hello!");
        cy.get(cesc2(`#/editor/_p2`)).should("not.exist");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/editor"].stateValues.immediateValue).eq(
                "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
            );
            expect(stateVariables["/editor"].stateValues.value).eq(
                "<p>Hello!</p>",
            );

            let stateVariablesEditor =
                await win.returnAllStateVariableseditor();
            expect(stateVariablesEditor["/_p1"].activeChildren[0]).eq("Hello!");
            expect(stateVariablesEditor["/_p2"]).be.undefined;
        });

        cy.log("Wait for value to be updated");
        cy.get(cesc("#\\/_p2")).should(
            "have.text",
            "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
        );
        cy.get(cesc("#\\/_p1")).should(
            "have.text",
            "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
        );

        cy.get(cesc2(`#/editor/_p1`)).should("have.text", "Hello!");
        cy.get(cesc2(`#/editor/_p2`)).should("not.exist");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/editor"].stateValues.immediateValue).eq(
                "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
            );
            expect(stateVariables["/editor"].stateValues.value).eq(
                "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
            );

            let stateVariablesEditor =
                await win.returnAllStateVariableseditor();
            expect(stateVariablesEditor["/_p1"].activeChildren[0]).eq("Hello!");
            expect(stateVariablesEditor["/_p2"]).be.undefined;
        });

        cy.log("click to update content");
        cy.get(`[data-test="Viewer Update Button"]`).click();

        cy.get(cesc2(`#/editor/_p2`)).should("contain.text", "2");

        cy.get(cesc("#\\/_p1")).should(
            "have.text",
            "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
        );
        cy.get(cesc("#\\/_p2")).should(
            "have.text",
            "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
        );

        cy.get(cesc2(`#/editor/_p1`)).should("have.text", "Hello!");
        cy.get(cesc2(`#/editor/_p2`) + " math")
            .eq(0)
            .should("have.text", "2");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/editor"].stateValues.immediateValue).eq(
                "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
            );
            expect(stateVariables["/editor"].stateValues.value).eq(
                "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
            );

            let stateVariablesEditor =
                await win.returnAllStateVariableseditor();
            expect(stateVariablesEditor["/_p1"].activeChildren[0]).eq("Hello!");
            expect(stateVariablesEditor["/_math1"].stateValues.value).eq(2);
        });
    });

    // TODO: if we can find a way to communicate with the rendered DoenetML again,
    // we should revive these next two tests
    it.skip("code editor with renderedName", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <codeEditor showResults renderedName="result" />

    <p>$editor.immediateValue</p>
    <p>$editor.value</p>

    <p>The value of the entered math is $(/result/_math1.value{assignNames="m1"})</p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("contain.text", "a");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let viewerName =
                stateVariables["/editor"].activeChildren[0].componentIdx;
            let contentAnchor = "#" + cesc2(viewerName) + "_content";

            cy.get(cesc("#\\/_p1")).should("have.text", "");
            cy.get(cesc("#\\/_p2")).should("have.text", "");
            cy.get(cesc("#\\/_p3")).should(
                "have.text",
                "The value of the entered math is ",
            );
            cy.get(contentAnchor).should("have.text", "");
            cy.get(cesc("#\\/m1")).should("not.exist");

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(stateVariables["/editor"].stateValues.immediateValue).eq(
                    "",
                );
                expect(stateVariables["/editor"].stateValues.value).eq("");
                expect(stateVariables[viewerName].activeChildren.length).eq(0);
                expect(stateVariables["/result/_p1"]).eq(undefined);
                expect(stateVariables["/result/_p2"]).eq(undefined);
                expect(stateVariables["/result/_math1"]).eq(undefined);
            });

            cy.log("type text in editor");
            cy.get(cesc("#\\/editor") + " .cm-content").type("<p>Hello!</p>", {
                delay: 10,
            });

            cy.get(cesc("#\\/_p1")).should("have.text", "<p>Hello!</p>");
            cy.get(cesc("#\\/_p2")).should("have.text", "");
            cy.get(cesc("#\\/_p3")).should(
                "have.text",
                "The value of the entered math is ",
            );
            cy.get(contentAnchor).should("have.text", "");
            cy.get(cesc("#\\/m1")).should("not.exist");

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(stateVariables["/editor"].stateValues.immediateValue).eq(
                    "<p>Hello!</p>",
                );
                expect(stateVariables["/editor"].stateValues.value).eq("");
                expect(stateVariables[viewerName].activeChildren.length).eq(0);
                expect(stateVariables["/result/_p1"]).eq(undefined);
                expect(stateVariables["/result/_p2"]).eq(undefined);
                expect(stateVariables["/result/_math1"]).eq(undefined);
            });

            cy.log("blur updates value but not content");
            cy.get(cesc("#\\/editor") + " .cm-content").blur();

            cy.get(cesc("#\\/_p1")).should("have.text", "<p>Hello!</p>");
            cy.get(cesc("#\\/_p2")).should("have.text", "<p>Hello!</p>");
            cy.get(cesc("#\\/_p3")).should(
                "have.text",
                "The value of the entered math is ",
            );
            cy.get(contentAnchor).should("have.text", "");
            cy.get(cesc("#\\/m1")).should("not.exist");

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(stateVariables["/editor"].stateValues.immediateValue).eq(
                    "<p>Hello!</p>",
                );
                expect(stateVariables["/editor"].stateValues.value).eq(
                    "<p>Hello!</p>",
                );
                expect(stateVariables[viewerName].activeChildren.length).eq(0);
                expect(stateVariables["/result/_p1"]).eq(undefined);
                expect(stateVariables["/result/_p2"]).eq(undefined);
                expect(stateVariables["/result/_math1"]).eq(undefined);
            });

            cy.log("click to update content");
            cy.get(`[data-test="Viewer Update Button"]`).click();

            cy.get(cesc("#\\/_p1")).should("have.text", "<p>Hello!</p>");
            cy.get(cesc("#\\/_p2")).should("have.text", "<p>Hello!</p>");
            cy.get(cesc("#\\/_p3")).should(
                "have.text",
                "The value of the entered math is ",
            );
            cy.get(contentAnchor).should("have.text", "Hello!");
            cy.get(cesc("#\\/m1")).should("not.exist");

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(stateVariables["/editor"].stateValues.immediateValue).eq(
                    "<p>Hello!</p>",
                );
                expect(stateVariables["/editor"].stateValues.value).eq(
                    "<p>Hello!</p>",
                );
                expect(stateVariables[viewerName].activeChildren.length).eq(1);
                expect(
                    stateVariables[viewerName].activeChildren[0].componentIdx,
                ).eq("/result/_p1");
                expect(stateVariables["/result/_p1"].stateValues.text).eq(
                    "Hello!",
                );
                expect(stateVariables["/result/_p2"]).eq(undefined);
                expect(stateVariables["/result/_math1"]).eq(undefined);
            });

            cy.log("type more content");
            cy.get(cesc("#\\/editor") + " .cm-content").type(
                "{ctrl+end}{enter}<p><math simplify>1+1</math></p>",
                { delay: 10 },
            );

            cy.get(cesc("#\\/_p1")).should(
                "have.text",
                "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
            );
            cy.get(cesc("#\\/_p2")).should("have.text", "<p>Hello!</p>");
            cy.get(cesc("#\\/_p3")).should(
                "have.text",
                "The value of the entered math is ",
            );
            cy.get(contentAnchor).should("have.text", "Hello!");
            cy.get(cesc("#\\/m1")).should("not.exist");

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(stateVariables["/editor"].stateValues.immediateValue).eq(
                    "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
                );
                expect(stateVariables["/editor"].stateValues.value).eq(
                    "<p>Hello!</p>",
                );
                expect(stateVariables[viewerName].activeChildren.length).eq(1);
                expect(
                    stateVariables[viewerName].activeChildren[0].componentIdx,
                ).eq("/result/_p1");
                expect(stateVariables["/result/_p1"].stateValues.text).eq(
                    "Hello!",
                );
                expect(stateVariables["/result/_p2"]).eq(undefined);
                expect(stateVariables["/result/_math1"]).eq(undefined);
            });

            cy.log("Wait for value to be updated");
            cy.get(cesc("#\\/_p2")).should(
                "have.text",
                "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
            );
            cy.get(cesc("#\\/_p1")).should(
                "have.text",
                "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
            );
            cy.get(cesc("#\\/_p3")).should(
                "have.text",
                "The value of the entered math is ",
            );
            cy.get(contentAnchor).should("have.text", "Hello!");
            cy.get(cesc("#\\/m1")).should("not.exist");

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(stateVariables["/editor"].stateValues.immediateValue).eq(
                    "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
                );
                expect(stateVariables["/editor"].stateValues.value).eq(
                    "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
                );
                expect(stateVariables[viewerName].activeChildren.length).eq(1);
                expect(
                    stateVariables[viewerName].activeChildren[0].componentIdx,
                ).eq("/result/_p1");
                expect(stateVariables["/result/_p1"].stateValues.text).eq(
                    "Hello!",
                );
                expect(stateVariables["/result/_p2"]).eq(undefined);
                expect(stateVariables["/result/_math1"]).eq(undefined);
            });

            cy.log("click to update content");
            cy.get(`[data-test="Viewer Update Button"]`).click();

            cy.get(cesc("#\\/_p1")).should(
                "have.text",
                "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
            );
            cy.get(cesc("#\\/_p2")).should(
                "have.text",
                "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
            );
            cy.get(cesc("#\\/_p3")).should(
                "contain.text",
                "The value of the entered math is 2",
            );
            cy.get(contentAnchor).should("contain.text", "Hello!\n2");
            cy.get(contentAnchor + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("2");
                });
            cy.get(cesc("#\\/m1") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("2");
                });

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(stateVariables["/editor"].stateValues.immediateValue).eq(
                    "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
                );
                expect(stateVariables["/editor"].stateValues.value).eq(
                    "<p>Hello!</p>\n<p><math simplify>1+1</math></p>",
                );
                expect(stateVariables[viewerName].activeChildren.length).eq(3);
                expect(
                    stateVariables[viewerName].activeChildren[0].componentIdx,
                ).eq("/result/_p1");
                expect(stateVariables["/result/_p1"].stateValues.text).eq(
                    "Hello!",
                );
                expect(stateVariables[viewerName].activeChildren[1]).eq("\n");
                expect(
                    stateVariables[viewerName].activeChildren[2].componentIdx,
                ).eq("/result/_p2");
                expect(stateVariables["/result/_p2"].stateValues.text).eq("2");
                expect(stateVariables["/result/_p2"].activeChildren.length).eq(
                    1,
                );
                expect(
                    stateVariables["/result/_p2"].activeChildren[0]
                        .componentIdx,
                ).eq("/result/_math1");
                expect(stateVariables["/result/_math1"].stateValues.value).eq(
                    2,
                );
            });
        });
    });

    it.skip("code editor with renderedName and staticName", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <codeEditor showResults renderedName="result" staticName="static" />

    <p name="px">The value of the dynamic math is $(/result/x.value{assignNames="x"})</p>
    <p name="psx">The value of the static math is $(/static/x.value{assignNames="sx"})</p>
    <p name="pP">The coords of the dynamic point are $(/result/P.coords{assignNames="P"})</p>
    <p name="psP">The coords of the static point are $(/static/P.coords{assignNames="sP"})</p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("contain.text", "a");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let viewerName =
                stateVariables["/editor"].activeChildren[0].componentIdx;

            cy.get(cesc("#\\/px")).should(
                "have.text",
                "The value of the dynamic math is ",
            );
            cy.get(cesc("#\\/psx")).should(
                "have.text",
                "The value of the static math is ",
            );
            cy.get(cesc("#\\/pP")).should(
                "have.text",
                "The coords of the dynamic point are ",
            );
            cy.get(cesc("#\\/psP")).should(
                "have.text",
                "The coords of the static point are ",
            );

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(stateVariables["/editor"].stateValues.immediateValue).eq(
                    "",
                );
                expect(stateVariables["/editor"].stateValues.value).eq("");
                expect(stateVariables[viewerName].activeChildren.length).eq(0);
                expect(stateVariables["/x"]).eq(undefined);
                expect(stateVariables["/sx"]).eq(undefined);
                expect(stateVariables["/P"]).eq(undefined);
                expect(stateVariables["/sP"]).eq(undefined);
                expect(stateVariables["/result/x"]).eq(undefined);
                expect(stateVariables["/static/x"]).eq(undefined);
                expect(stateVariables["/result/P"]).eq(undefined);
                expect(stateVariables["/static/P"]).eq(undefined);
                expect(stateVariables["/result"].replacements.length).eq(0);
                expect(stateVariables["/static"].replacements.length).eq(0);
            });

            cy.log("type text in editor");
            cy.get(cesc("#\\/editor") + " .cm-content").type(
                "<p>Enter value <mathinput name='mi' prefill='y' /></p>{enter}",
            );
            cy.get(cesc("#\\/editor") + " .cm-content").type(
                "<p>The value is <copy prop='value' target='mi' assignNames='x' /></p>{enter}",
            );

            cy.get(cesc("#\\/px")).should(
                "have.text",
                "The value of the dynamic math is ",
            );
            cy.get(cesc("#\\/psx")).should(
                "have.text",
                "The value of the static math is ",
            );
            cy.get(cesc("#\\/pP")).should(
                "have.text",
                "The coords of the dynamic point are ",
            );
            cy.get(cesc("#\\/psP")).should(
                "have.text",
                "The coords of the static point are ",
            );

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(stateVariables["/editor"].stateValues.immediateValue).eq(
                    "<p>Enter value <mathinput name='mi' prefill='y' /></p>\n<p>The value is <copy prop='value' target='mi' assignNames='x' /></p>\n",
                );
                expect(stateVariables["/editor"].stateValues.value).eq("");
                expect(stateVariables[viewerName].activeChildren.length).eq(0);
                expect(stateVariables["/x"]).eq(undefined);
                expect(stateVariables["/sx"]).eq(undefined);
                expect(stateVariables["/P"]).eq(undefined);
                expect(stateVariables["/sP"]).eq(undefined);
                expect(stateVariables["/result/x"]).eq(undefined);
                expect(stateVariables["/static/x"]).eq(undefined);
                expect(stateVariables["/result/P"]).eq(undefined);
                expect(stateVariables["/static/P"]).eq(undefined);
                expect(stateVariables["/result"].replacements.length).eq(0);
                expect(stateVariables["/static"].replacements.length).eq(0);
            });

            cy.log("blur updates static but not dynamic");
            cy.get(cesc("#\\/editor") + " .cm-content").blur();

            cy.get(cesc("#\\/psx")).should(
                "contain.text",
                "The value of the static math is y",
            );
            cy.get(cesc("#\\/px")).should(
                "have.text",
                "The value of the dynamic math is ",
            );
            cy.get(cesc("#\\/pP")).should(
                "have.text",
                "The coords of the dynamic point are ",
            );
            cy.get(cesc("#\\/psP")).should(
                "have.text",
                "The coords of the static point are ",
            );

            cy.get(cesc("#\\/sx") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("y");
                });

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(stateVariables["/editor"].stateValues.immediateValue).eq(
                    "<p>Enter value <mathinput name='mi' prefill='y' /></p>\n<p>The value is <copy prop='value' target='mi' assignNames='x' /></p>\n",
                );
                expect(stateVariables["/editor"].stateValues.value).eq(
                    "<p>Enter value <mathinput name='mi' prefill='y' /></p>\n<p>The value is <copy prop='value' target='mi' assignNames='x' /></p>\n",
                );
                expect(stateVariables["/x"]).eq(undefined);
                expect(stateVariables["/sx"].stateValues.value).eq("y");
                expect(stateVariables["/P"]).eq(undefined);
                expect(stateVariables["/sP"]).eq(undefined);
                expect(stateVariables["/result/x"]).eq(undefined);
                expect(stateVariables["/static/x"].stateValues.value).eq("y");
                expect(stateVariables["/result/P"]).eq(undefined);
                expect(stateVariables["/static/P"]).eq(undefined);

                expect(stateVariables[viewerName].activeChildren.length).eq(0);
                expect(stateVariables["/result"].replacements.length).eq(0);

                expect(stateVariables["/static"].replacements.length).eq(3);
                expect(
                    stateVariables["/static"].replacements[0].componentIdx,
                ).eq("/static/_p1");
                expect(stateVariables["/static/_p1"].stateValues.text).eq(
                    "Enter value y",
                );
                expect(stateVariables["/static"].replacements[1]).eq("\n");
                expect(
                    stateVariables["/static"].replacements[2].componentIdx,
                ).eq("/static/_p2");
                expect(stateVariables["/static/_p2"].stateValues.text).eq(
                    "The value is y",
                );
                expect(stateVariables["/static/mi"].stateValues.value).eq("y");
                expect(stateVariables["/static/x"].stateValues.value).eq("y");
            });

            cy.log("click to update dynamic content");
            cy.get(`[data-test="Viewer Update Button"]`).click();

            cy.get(cesc("#\\/px")).should(
                "contain.text",
                "The value of the dynamic math is y",
            );
            cy.get(cesc("#\\/psx")).should(
                "contain.text",
                "The value of the static math is y",
            );
            cy.get(cesc("#\\/pP")).should(
                "have.text",
                "The coords of the dynamic point are ",
            );
            cy.get(cesc("#\\/psP")).should(
                "have.text",
                "The coords of the static point are ",
            );

            cy.get(cesc("#\\/x") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("y");
                });
            cy.get(cesc("#\\/sx") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("y");
                });

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(stateVariables["/editor"].stateValues.value).eq(
                    "<p>Enter value <mathinput name='mi' prefill='y' /></p>\n<p>The value is <copy prop='value' target='mi' assignNames='x' /></p>\n",
                );
                expect(stateVariables["/x"].stateValues.value).eq("y");
                expect(stateVariables["/sx"].stateValues.value).eq("y");
                expect(stateVariables["/P"]).eq(undefined);
                expect(stateVariables["/sP"]).eq(undefined);
                expect(stateVariables["/result/x"].stateValues.value).eq("y");
                expect(stateVariables["/static/x"].stateValues.value).eq("y");
                expect(stateVariables["/result/P"]).eq(undefined);
                expect(stateVariables["/static/P"]).eq(undefined);

                expect(stateVariables[viewerName].activeChildren.length).eq(3);
                expect(stateVariables["/result"].replacements.length).eq(3);
                expect(
                    stateVariables[viewerName].activeChildren[0].componentIdx,
                ).eq("/result/_p1");
                expect(stateVariables["/result/_p1"].stateValues.text).eq(
                    "Enter value y",
                );
                expect(stateVariables[viewerName].activeChildren[1]).eq("\n");
                expect(
                    stateVariables[viewerName].activeChildren[2].componentIdx,
                ).eq("/result/_p2");
                expect(stateVariables["/result/_p2"].stateValues.text).eq(
                    "The value is y",
                );
                expect(stateVariables["/result/mi"].stateValues.value).eq("y");
                expect(stateVariables["/result/x"].stateValues.value).eq("y");

                expect(stateVariables["/static"].replacements.length).eq(3);
                expect(
                    stateVariables["/static"].replacements[0].componentIdx,
                ).eq("/static/_p1");
                expect(stateVariables["/static/_p1"].stateValues.text).eq(
                    "Enter value y",
                );
                expect(stateVariables["/static"].replacements[1]).eq("\n");
                expect(
                    stateVariables["/static"].replacements[2].componentIdx,
                ).eq("/static/_p2");
                expect(stateVariables["/static/_p2"].stateValues.text).eq(
                    "The value is y",
                );
                expect(stateVariables["/static/mi"].stateValues.value).eq("y");
                expect(stateVariables["/static/x"].stateValues.value).eq("y");
            });

            cy.log("Enter new value in dynamic results");
            cy.get(cesc("#\\/result\\/mi") + " textarea").type(
                "{end}{backspace}x{enter}",
                { force: true },
            );

            cy.get(cesc("#\\/px")).should(
                "contain.text",
                "The value of the dynamic math is x",
            );
            cy.get(cesc("#\\/psx")).should(
                "contain.text",
                "The value of the static math is y",
            );
            cy.get(cesc("#\\/pP")).should(
                "have.text",
                "The coords of the dynamic point are ",
            );
            cy.get(cesc("#\\/psP")).should(
                "have.text",
                "The coords of the static point are ",
            );

            cy.get(cesc("#\\/x") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("x");
                });
            cy.get(cesc("#\\/sx") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("y");
                });

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(stateVariables["/editor"].stateValues.value).eq(
                    "<p>Enter value <mathinput name='mi' prefill='y' /></p>\n<p>The value is <copy prop='value' target='mi' assignNames='x' /></p>\n",
                );
                expect(stateVariables["/x"].stateValues.value).eq("x");
                expect(stateVariables["/sx"].stateValues.value).eq("y");
                expect(stateVariables["/P"]).eq(undefined);
                expect(stateVariables["/sP"]).eq(undefined);
                expect(stateVariables["/result/x"].stateValues.value).eq("x");
                expect(stateVariables["/static/x"].stateValues.value).eq("y");
                expect(stateVariables["/result/P"]).eq(undefined);
                expect(stateVariables["/static/P"]).eq(undefined);

                expect(stateVariables[viewerName].activeChildren.length).eq(3);
                expect(stateVariables["/result"].replacements.length).eq(3);
                expect(
                    stateVariables[viewerName].activeChildren[0].componentIdx,
                ).eq("/result/_p1");
                expect(stateVariables["/result/_p1"].stateValues.text).eq(
                    "Enter value x",
                );
                expect(stateVariables[viewerName].activeChildren[1]).eq("\n");
                expect(
                    stateVariables[viewerName].activeChildren[2].componentIdx,
                ).eq("/result/_p2");
                expect(stateVariables["/result/_p2"].stateValues.text).eq(
                    "The value is x",
                );
                expect(stateVariables["/result/mi"].stateValues.value).eq("x");
                expect(stateVariables["/result/x"].stateValues.value).eq("x");

                expect(stateVariables["/static"].replacements.length).eq(3);
                expect(
                    stateVariables["/static"].replacements[0].componentIdx,
                ).eq("/static/_p1");
                expect(stateVariables["/static/_p1"].stateValues.text).eq(
                    "Enter value y",
                );
                expect(stateVariables["/static"].replacements[1]).eq("\n");
                expect(
                    stateVariables["/static"].replacements[2].componentIdx,
                ).eq("/static/_p2");
                expect(stateVariables["/static/_p2"].stateValues.text).eq(
                    "The value is y",
                );
                expect(stateVariables["/static/mi"].stateValues.value).eq("y");
                expect(stateVariables["/static/x"].stateValues.value).eq("y");
            });

            cy.log("type text in editor");
            cy.get(cesc("#\\/editor") + " .cm-content")
                .type(
                    "{ctrl+end}<graph><point name='P'>(3,4)</point></graph>{enter}",
                )
                .blur();

            cy.get(cesc("#\\/psP")).should(
                "contain.text",
                "The coords of the static point are (3,4)",
            );
            cy.get(cesc("#\\/px")).should(
                "contain.text",
                "The value of the dynamic math is x",
            );
            cy.get(cesc("#\\/psx")).should(
                "contain.text",
                "The value of the static math is y",
            );
            cy.get(cesc("#\\/pP")).should(
                "have.text",
                "The coords of the dynamic point are ",
            );

            cy.get(cesc("#\\/x") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("x");
                });
            cy.get(cesc("#\\/sx") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("y");
                });
            cy.get(cesc("#\\/sP") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("(3,4)");
                });

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(stateVariables["/x"].stateValues.value).eq("x");
                expect(stateVariables["/sx"].stateValues.value).eq("y");
                expect(stateVariables["/P"]).eq(undefined);
                expect(stateVariables["/sP"].stateValues.vector).eqls([3, 4]);
                expect(stateVariables["/result/x"].stateValues.value).eq("x");
                expect(stateVariables["/static/x"].stateValues.value).eq("y");
                expect(stateVariables["/result/P"]).eq(undefined);
                expect(stateVariables["/static/P"].stateValues.xs).eqls([3, 4]);

                expect(stateVariables[viewerName].activeChildren.length).eq(3);
                expect(stateVariables["/result"].replacements.length).eq(3);
                expect(
                    stateVariables[viewerName].activeChildren[0].componentIdx,
                ).eq("/result/_p1");
                expect(stateVariables["/result/_p1"].stateValues.text).eq(
                    "Enter value x",
                );
                expect(stateVariables[viewerName].activeChildren[1]).eq("\n");
                expect(
                    stateVariables[viewerName].activeChildren[2].componentIdx,
                ).eq("/result/_p2");
                expect(stateVariables["/result/_p2"].stateValues.text).eq(
                    "The value is x",
                );
                expect(stateVariables["/result/mi"].stateValues.value).eq("x");
                expect(stateVariables["/result/x"].stateValues.value).eq("x");

                expect(stateVariables["/static"].replacements.length).eq(5);
                expect(
                    stateVariables["/static"].replacements[0].componentIdx,
                ).eq("/static/_p1");
                expect(stateVariables["/static/_p1"].stateValues.text).eq(
                    "Enter value y",
                );
                expect(stateVariables["/static"].replacements[1]).eq("\n");
                expect(
                    stateVariables["/static"].replacements[2].componentIdx,
                ).eq("/static/_p2");
                expect(stateVariables["/static/_p2"].stateValues.text).eq(
                    "The value is y",
                );
                expect(stateVariables["/static"].replacements[3]).eq("\n");
                expect(
                    stateVariables["/static"].replacements[4].componentIdx,
                ).eq("/static/_graph1");

                expect(stateVariables["/static/mi"].stateValues.value).eq("y");
                expect(stateVariables["/static/x"].stateValues.value).eq("y");
                expect(stateVariables["/static/P"].stateValues.xs).eqls([3, 4]);
            });

            cy.log("click to update dynamic content");
            cy.get(`[data-test="Viewer Update Button"]`).click();

            cy.get(cesc("#\\/pP")).should(
                "contain.text",
                "The coords of the dynamic point are (3,4)",
            );
            cy.get(cesc("#\\/px")).should(
                "contain.text",
                "The value of the dynamic math is y",
            );
            cy.get(cesc("#\\/psx")).should(
                "contain.text",
                "The value of the static math is y",
            );
            cy.get(cesc("#\\/psP")).should(
                "contain.text",
                "The coords of the static point are (3,4)",
            );

            cy.get(cesc("#\\/x") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("y");
                });
            cy.get(cesc("#\\/sx") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("y");
                });
            cy.get(cesc("#\\/P") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("(3,4)");
                });
            cy.get(cesc("#\\/sP") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("(3,4)");
                });

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(stateVariables["/x"].stateValues.value).eq("y");
                expect(stateVariables["/sx"].stateValues.value).eq("y");
                expect(stateVariables["/P"].stateValues.vector).eqls([3, 4]);
                expect(stateVariables["/sP"].stateValues.vector).eqls([3, 4]);
                expect(stateVariables["/result/x"].stateValues.value).eq("y");
                expect(stateVariables["/static/x"].stateValues.value).eq("y");
                expect(stateVariables["/result/P"].stateValues.xs).eqls([3, 4]);
                expect(stateVariables["/static/P"].stateValues.xs).eqls([3, 4]);

                expect(stateVariables[viewerName].activeChildren.length).eq(5);
                expect(stateVariables["/result"].replacements.length).eq(5);
                expect(
                    stateVariables[viewerName].activeChildren[0].componentIdx,
                ).eq("/result/_p1");
                expect(stateVariables["/result/_p1"].stateValues.text).eq(
                    "Enter value y",
                );
                expect(stateVariables[viewerName].activeChildren[1]).eq("\n");
                expect(
                    stateVariables[viewerName].activeChildren[2].componentIdx,
                ).eq("/result/_p2");
                expect(stateVariables["/result/_p2"].stateValues.text).eq(
                    "The value is y",
                );
                expect(stateVariables[viewerName].activeChildren[3]).eq("\n");
                expect(
                    stateVariables[viewerName].activeChildren[4].componentIdx,
                ).eq("/result/_graph1");
                expect(stateVariables["/result/mi"].stateValues.value).eq("y");
                expect(stateVariables["/result/x"].stateValues.value).eq("y");
                expect(stateVariables["/result/P"].stateValues.xs).eqls([3, 4]);

                expect(stateVariables["/static"].replacements.length).eq(5);
                expect(
                    stateVariables["/static"].replacements[0].componentIdx,
                ).eq("/static/_p1");
                expect(stateVariables["/static/_p1"].stateValues.text).eq(
                    "Enter value y",
                );
                expect(stateVariables["/static"].replacements[1]).eq("\n");
                expect(
                    stateVariables["/static"].replacements[2].componentIdx,
                ).eq("/static/_p2");
                expect(stateVariables["/static/_p2"].stateValues.text).eq(
                    "The value is y",
                );
                expect(stateVariables["/static"].replacements[3]).eq("\n");
                expect(
                    stateVariables["/static"].replacements[4].componentIdx,
                ).eq("/static/_graph1");

                expect(stateVariables["/static/mi"].stateValues.value).eq("y");
                expect(stateVariables["/static/x"].stateValues.value).eq("y");
                expect(stateVariables["/static/P"].stateValues.xs).eqls([3, 4]);
            });

            cy.log("Change values in dynamic results");

            cy.window().then(async (win) => {
                await win.callAction1({
                    actionName: "movePoint",
                    componentIdx: "/result/P",
                    args: { x: 5, y: 7 },
                });
            });

            cy.get(cesc("#\\/pP")).should(
                "contain.text",
                "The coords of the dynamic point are (5,7)",
            );
            cy.get(cesc("#\\/px")).should(
                "contain.text",
                "The value of the dynamic math is y",
            );
            cy.get(cesc("#\\/psx")).should(
                "contain.text",
                "The value of the static math is y",
            );
            cy.get(cesc("#\\/psP")).should(
                "contain.text",
                "The coords of the static point are (3,4)",
            );

            cy.get(cesc("#\\/x") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("y");
                });
            cy.get(cesc("#\\/sx") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("y");
                });
            cy.get(cesc("#\\/P") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("(5,7)");
                });
            cy.get(cesc("#\\/sP") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("(3,4)");
                });

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(stateVariables["/x"].stateValues.value).eq("y");
                expect(stateVariables["/sx"].stateValues.value).eq("y");
                expect(stateVariables["/P"].stateValues.vector).eqls([5, 7]);
                expect(stateVariables["/sP"].stateValues.vector).eqls([3, 4]);
                expect(stateVariables["/result/x"].stateValues.value).eq("y");
                expect(stateVariables["/static/x"].stateValues.value).eq("y");
                expect(stateVariables["/result/P"].stateValues.xs).eqls([5, 7]);
                expect(stateVariables["/static/P"].stateValues.xs).eqls([3, 4]);

                expect(stateVariables[viewerName].activeChildren.length).eq(5);
                expect(stateVariables["/result"].replacements.length).eq(5);
                expect(
                    stateVariables[viewerName].activeChildren[0].componentIdx,
                ).eq("/result/_p1");
                expect(stateVariables["/result/_p1"].stateValues.text).eq(
                    "Enter value y",
                );
                expect(stateVariables[viewerName].activeChildren[1]).eq("\n");
                expect(
                    stateVariables[viewerName].activeChildren[2].componentIdx,
                ).eq("/result/_p2");
                expect(stateVariables["/result/_p2"].stateValues.text).eq(
                    "The value is y",
                );
                expect(stateVariables[viewerName].activeChildren[3]).eq("\n");
                expect(
                    stateVariables[viewerName].activeChildren[4].componentIdx,
                ).eq("/result/_graph1");
                expect(stateVariables["/result/mi"].stateValues.value).eq("y");
                expect(stateVariables["/result/x"].stateValues.value).eq("y");
                expect(stateVariables["/result/P"].stateValues.xs).eqls([5, 7]);

                expect(stateVariables["/static"].replacements.length).eq(5);
                expect(
                    stateVariables["/static"].replacements[0].componentIdx,
                ).eq("/static/_p1");
                expect(stateVariables["/static/_p1"].stateValues.text).eq(
                    "Enter value y",
                );
                expect(stateVariables["/static"].replacements[1]).eq("\n");
                expect(
                    stateVariables["/static"].replacements[2].componentIdx,
                ).eq("/static/_p2");
                expect(stateVariables["/static/_p2"].stateValues.text).eq(
                    "The value is y",
                );
                expect(stateVariables["/static"].replacements[3]).eq("\n");
                expect(
                    stateVariables["/static"].replacements[4].componentIdx,
                ).eq("/static/_graph1");

                expect(stateVariables["/static/mi"].stateValues.value).eq("y");
                expect(stateVariables["/static/x"].stateValues.value).eq("y");
                expect(stateVariables["/static/P"].stateValues.xs).eqls([3, 4]);
            });
        });
    });

    it("include blank string children", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <codeEditor showResults prefill="<text>hello</text> <text>there</text>" name="editor" />

    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("contain.text", "a");
        cy.get(cesc2(`#/editor/_document1`)).should(
            "contain.text",
            "hello there",
        );
    });

    it("set value from immediateValue on reload", () => {
        let doenetML = `
    <p><codeEditor name="ce" /></p>

    <p name="pv">value: $ce</p>
    <p name="piv">immediate value: $ce.immediateValue</p>
    `;

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/ce") + " .cm-activeLine").invoke("text", "hello");

        cy.get(cesc("#\\/piv")).should("have.text", "immediate value: hello");
        cy.get(cesc("#\\/pv")).should("have.text", "value: ");

        cy.wait(1500); // wait for debounce

        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/pv")).should("have.text", "value: hello");
        cy.get(cesc("#\\/piv")).should("have.text", "immediate value: hello");
    });

    it("undo prompts save", () => {
        let doenetML = `
    <text>a</text>
    <codeEditor showResults name="editor" />

    <p>$editor.value</p>
    `;

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("contain.text", "a");

        cy.get(cesc2("#/_p1")).should("have.text", "");

        cy.log("type text in editor");
        cy.get(cesc("#\\/editor") + " .cm-activeLine").invoke(
            "text",
            "<p>Hello!</p>",
        );

        cy.wait(500);

        cy.get(`[data-test="Viewer Update Button"]`).click();

        cy.get(cesc2("#/_p1")).should("have.text", "<p>Hello!</p>");
        cy.get(cesc2("#/editor/_p1")).should("have.text", "Hello!");

        cy.wait(1500); // wait for 1 second debounce

        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc2("#/_p1")).should("have.text", "<p>Hello!</p>");
        cy.get(cesc2("#/editor/_p1")).should("have.text", "Hello!");

        cy.log("Overwrite text");

        cy.get(cesc("#\\/editor") + " .cm-activeLine").invoke(
            "text",
            "<alert>Overwritten!</alert>",
        );

        cy.get(`[data-test="Viewer Update Button"]`).click();

        cy.get(cesc2("#/_p1")).should(
            "have.text",
            "<alert>Overwritten!</alert>",
        );
        cy.get(cesc2("#/editor/_p1")).should("not.exist");
        cy.get(cesc2("#/editor/_alert1")).should("have.text", "Overwritten!");

        cy.wait(1500); // wait for 1 second debounce

        if (Cypress.platform === "darwin") {
            cy.get(".cm-content").type("{command}{z}");
        } else {
            cy.get(".cm-content").type("{control}{z}");
        }
        cy.get(`[data-test="Viewer Update Button"]`).click();

        cy.get(cesc2("#/_p1")).should("have.text", "<p>Hello!</p>");
        cy.get(cesc2("#/editor/_p1")).should("have.text", "Hello!");
        cy.get(cesc2("#/editor/_alert1")).should("not.exist");

        cy.wait(1500); // wait for 1 second debounce

        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc2("#/_p1")).should("have.text", "<p>Hello!</p>");
        cy.get(cesc2("#/editor/_p1")).should("have.text", "Hello!");
        cy.get(cesc2("#/editor/_alert1")).should("not.exist");
    });

    it("recover from invalid doenetML", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <text>a</text>
        <codeEditor showResults name="editor" />
    
        <p>$editor.value</p>
        `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("contain.text", "a");

        cy.get(cesc2("#/_p1")).should("have.text", "");

        cy.log("type text in editor");
        cy.get(cesc("#\\/editor") + " .cm-activeLine").invoke(
            "text",
            "<p>Hello!</p>",
        );

        cy.get(cesc("#\\/editor") + " .cm-content").type("{end}{enter}");

        cy.wait(500);

        cy.get(`[data-test="Viewer Update Button"]`).click();

        cy.get(cesc2("#/_p1")).should("have.text", "<p>Hello!</p>\n");
        cy.get(cesc2("#/editor/_p1")).should("have.text", "Hello!");

        cy.get(cesc("#\\/editor") + " .cm-activeLine").type("{ctrl+end}");

        cy.get(cesc("#\\/editor") + " .cm-activeLine").invoke(
            "text",
            "<text name='ti'>$ti</text>",
        );

        cy.get(`[data-test="Viewer Update Button"]`).click();

        cy.get(cesc2("#/_p1")).should(
            "have.text",
            "<p>Hello!</p>\n<text name='ti'>$ti</text>",
        );

        cy.get(cesc2("#/editor-viewer")).should(
            "contain.text",
            "Circular dependency",
        );

        cy.get(cesc("#\\/editor") + " .cm-activeLine").invoke(
            "text",
            "<text name='ti'>Bye</text>",
        );

        cy.get(`[data-test="Viewer Update Button"]`).click();

        cy.get(cesc2("#/_p1")).should(
            "have.text",
            "<p>Hello!</p>\n<text name='ti'>Bye</text>",
        );
        cy.get(cesc2("#/editor/_p1")).should("have.text", "Hello!");
        cy.get(cesc2("#/editor/ti")).should("have.text", "Bye");
    });

    it("Multiple code editors", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <text>a</text>
        <codeEditor showResults name="editor1" />

        <p>$editor1.value</p>

        <codeEditor showResults name="editor2" />

        <p>$editor2.value</p>

        <codeEditor showResults name="editor3" />

        <p>$editor3.value</p>
        `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("contain.text", "a");

        cy.log("type text in editor 1");
        cy.get(cesc("#\\/editor1") + " .cm-activeLine").invoke(
            "text",
            "<p>Apple</p>",
        );
        cy.get(cesc("#\\/editor1") + " .cm-content").type("{end}{enter}");

        cy.wait(500);

        cy.get(
            cesc2("#/editor1-viewer-controls") +
                ` [data-test="Viewer Update Button"]`,
        ).click();

        cy.get(cesc2("#/_p1")).should("have.text", "<p>Apple</p>\n");
        cy.get(cesc2("#/editor1/_p1")).should("contain.text", "Apple");

        cy.log("type text in editor 2");
        cy.get(cesc("#\\/editor2") + " .cm-activeLine").invoke(
            "text",
            "<p>Banana</p>",
        );
        cy.get(cesc("#\\/editor2") + " .cm-content").type("{end}{enter}");
        cy.get(
            cesc2("#/editor2-viewer-controls") +
                ` [data-test="Viewer Update Button"]`,
        ).click();

        cy.get(cesc2("#/_p2")).should("have.text", "<p>Banana</p>\n");
        cy.get(cesc2("#/editor2/_p1")).should("contain.text", "Banana");

        cy.log("type text in editor 3");
        cy.get(cesc("#\\/editor3") + " .cm-activeLine").invoke(
            "text",
            "<p>Cherry</p>",
        );
        cy.get(cesc("#\\/editor3") + " .cm-content").type("{end}{enter}");
        cy.get(
            cesc2("#/editor3-viewer-controls") +
                ` [data-test="Viewer Update Button"]`,
        ).click();

        cy.get(cesc2("#/_p3")).should("have.text", "<p>Cherry</p>\n");
        cy.get(cesc2("#/editor3/_p1")).should("contain.text", "Cherry");
    });
});
