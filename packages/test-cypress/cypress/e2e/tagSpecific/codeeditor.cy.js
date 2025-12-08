import { cesc } from "@doenet/utils";
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
    <codeEditor name="editor" />

    <p name="p1">$editor.immediateValue</p>
    <p name="p2">$editor.value</p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#p1")).should("have.text", "");
        cy.get(cesc("#p2")).should("have.text", "");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("editor")].stateValues
                    .immediateValue,
            ).eq("");
            expect(
                stateVariables[await win.resolvePath1("editor")].stateValues
                    .value,
            ).eq("");
        });

        cy.log("type text in editor");
        cy.get(cesc("#editor") + " .cm-activeLine").invoke("text", "Hello!");

        cy.get(cesc("#p1")).should("have.text", "Hello!");
        cy.get(cesc("#p2")).should("have.text", "");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("editor")].stateValues
                    .immediateValue,
            ).eq("Hello!");
            expect(
                stateVariables[await win.resolvePath1("editor")].stateValues
                    .value,
            ).eq("");
        });

        cy.log("wait for debounce to update value");
        cy.wait(1500);
        cy.get(cesc("#p1")).should("have.text", "Hello!");
        cy.get(cesc("#p2")).should("have.text", "Hello!");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("editor")].stateValues
                    .immediateValue,
            ).eq("Hello!");
            expect(
                stateVariables[await win.resolvePath1("editor")].stateValues
                    .value,
            ).eq("Hello!");
        });

        cy.log("type more in editor");
        cy.get(cesc("#editor") + " .cm-activeLine").type("{enter}");
        cy.get(cesc("#editor") + " .cm-activeLine").invoke(
            "text",
            "More here.",
        );

        cy.get(cesc("#p1")).should("have.text", "Hello!\nMore here.");
        cy.get(cesc("#p2")).should("have.text", "Hello!");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("editor")].stateValues
                    .immediateValue,
            ).eq("Hello!\nMore here.");
            expect(
                stateVariables[await win.resolvePath1("editor")].stateValues
                    .value,
            ).eq("Hello!");
        });

        cy.log("blur to update value");
        cy.get(cesc("#editor") + " .cm-content").blur();

        cy.get(cesc("#p1")).should("have.text", "Hello!\nMore here.");
        cy.get(cesc("#p2")).should("have.text", "Hello!\nMore here.");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("editor")].stateValues
                    .immediateValue,
            ).eq("Hello!\nMore here.");
            expect(
                stateVariables[await win.resolvePath1("editor")].stateValues
                    .value,
            ).eq("Hello!\nMore here.");
        });
    });

    it("code editor with show results", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <codeEditor showResults name="editor" />

    <p name="p1">$editor.immediateValue</p>
    <p name="p2">$editor.value</p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc(`#editor::_id_0`)).should("exist");

        cy.get(cesc("#p1")).should("have.text", "");
        cy.get(cesc("#p2")).should("have.text", "");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("editor")].stateValues
                    .immediateValue,
            ).eq("");
            expect(
                stateVariables[await win.resolvePath1("editor")].stateValues
                    .value,
            ).eq("");

            let stateVariablesEditor =
                await win.returnAllStateVariableseditor();
            expect(Object.keys(stateVariablesEditor).length).eq(1);
        });

        cy.log("type text in editor");
        cy.get(cesc("#editor") + " .cm-content").focus();
        cy.get(cesc("#editor") + " .cm-activeLine").invoke(
            "text",
            '<p name="p1">Hello!</p>',
        );

        cy.get(cesc("#p1")).should("have.text", '<p name="p1">Hello!</p>');
        cy.get(cesc("#p2")).should("have.text", "");
        cy.get(cesc(`#editor::_id_0`)).should("exist");
        cy.get(cesc(`#editor::p1`)).should("not.exist");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("editor")].stateValues
                    .immediateValue,
            ).eq('<p name="p1">Hello!</p>');
            expect(
                stateVariables[await win.resolvePath1("editor")].stateValues
                    .value,
            ).eq("");

            let stateVariablesEditor =
                await win.returnAllStateVariableseditor();
            expect(Object.keys(stateVariablesEditor).length).eq(1);
        });

        cy.log("blur updates value but not content");
        cy.get(cesc("#editor") + " .cm-content").blur();

        cy.get(cesc("#p1")).should("have.text", '<p name="p1">Hello!</p>');
        cy.get(cesc("#p2")).should("have.text", '<p name="p1">Hello!</p>');
        cy.get(cesc(`#editor::_id_0`)).should("exist");
        cy.get(cesc(`#editor::p1`)).should("not.exist");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("editor")].stateValues
                    .immediateValue,
            ).eq('<p name="p1">Hello!</p>');
            expect(
                stateVariables[await win.resolvePath1("editor")].stateValues
                    .value,
            ).eq('<p name="p1">Hello!</p>');

            let stateVariablesEditor =
                await win.returnAllStateVariableseditor();
            expect(Object.keys(stateVariablesEditor).length).eq(1);
        });

        cy.log("click to update content");
        cy.get(`[data-test="Viewer Update Button"]`).click();

        cy.get(cesc(`#editor::p1`)).should("have.text", "Hello!");
        cy.get(cesc("#p1")).should("have.text", '<p name="p1">Hello!</p>');
        cy.get(cesc("#p2")).should("have.text", '<p name="p1">Hello!</p>');

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("editor")].stateValues
                    .immediateValue,
            ).eq('<p name="p1">Hello!</p>');
            expect(
                stateVariables[await win.resolvePath1("editor")].stateValues
                    .value,
            ).eq('<p name="p1">Hello!</p>');

            let stateVariablesEditor =
                await win.returnAllStateVariableseditor();
            expect(
                stateVariablesEditor[await win.resolvePatheditor("p1")]
                    .activeChildren[0],
            ).eq("Hello!");
        });

        cy.log("type more content");

        cy.get(cesc("#editor") + " .cm-activeLine").type("{ctrl+end}{enter}");
        cy.get(cesc("#editor") + " .cm-activeLine").invoke(
            "text",
            '<p name="p2"><math simplify>1+1</math></p>',
        );

        cy.get(cesc("#p1")).should(
            "have.text",
            '<p name="p1">Hello!</p>\n<p name="p2"><math simplify>1+1</math></p>',
        );
        cy.get(cesc("#p2")).should("have.text", '<p name="p1">Hello!</p>');

        cy.get(cesc(`#editor::p1`)).should("have.text", "Hello!");
        cy.get(cesc(`#editor::p2`)).should("not.exist");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("editor")].stateValues
                    .immediateValue,
            ).eq(
                '<p name="p1">Hello!</p>\n<p name="p2"><math simplify>1+1</math></p>',
            );
            expect(
                stateVariables[await win.resolvePath1("editor")].stateValues
                    .value,
            ).eq('<p name="p1">Hello!</p>');

            let stateVariablesEditor =
                await win.returnAllStateVariableseditor();
            expect(
                stateVariablesEditor[await win.resolvePatheditor("p1")]
                    .activeChildren[0],
            ).eq("Hello!");
            expect(stateVariablesEditor[await win.resolvePatheditor("p2")]).be
                .undefined;
        });

        cy.log("Wait for value to be updated");
        cy.get(cesc("#p2")).should(
            "have.text",
            '<p name="p1">Hello!</p>\n<p name="p2"><math simplify>1+1</math></p>',
        );
        cy.get(cesc("#p1")).should(
            "have.text",
            '<p name="p1">Hello!</p>\n<p name="p2"><math simplify>1+1</math></p>',
        );

        cy.get(cesc(`#editor::p1`)).should("have.text", "Hello!");
        cy.get(cesc(`#editor::p2`)).should("not.exist");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("editor")].stateValues
                    .immediateValue,
            ).eq(
                '<p name="p1">Hello!</p>\n<p name="p2"><math simplify>1+1</math></p>',
            );
            expect(
                stateVariables[await win.resolvePath1("editor")].stateValues
                    .value,
            ).eq(
                '<p name="p1">Hello!</p>\n<p name="p2"><math simplify>1+1</math></p>',
            );

            let stateVariablesEditor =
                await win.returnAllStateVariableseditor();
            expect(
                stateVariablesEditor[await win.resolvePatheditor("p1")]
                    .activeChildren[0],
            ).eq("Hello!");
            expect(stateVariablesEditor[await win.resolvePatheditor("p2")]).be
                .undefined;
        });

        cy.log("click to update content");
        cy.get(`[data-test="Viewer Update Button"]`).click();

        cy.get(cesc(`#editor::p2`)).should("contain.text", "2");

        cy.get(cesc("#p1")).should(
            "have.text",
            '<p name="p1">Hello!</p>\n<p name="p2"><math simplify>1+1</math></p>',
        );
        cy.get(cesc("#p2")).should(
            "have.text",
            '<p name="p1">Hello!</p>\n<p name="p2"><math simplify>1+1</math></p>',
        );

        cy.get(cesc(`#editor::p1`)).should("have.text", "Hello!");
        cy.get(cesc(`#editor::p2`)).should("have.text", "2");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("editor")].stateValues
                    .immediateValue,
            ).eq(
                '<p name="p1">Hello!</p>\n<p name="p2"><math simplify>1+1</math></p>',
            );
            expect(
                stateVariables[await win.resolvePath1("editor")].stateValues
                    .value,
            ).eq(
                '<p name="p1">Hello!</p>\n<p name="p2"><math simplify>1+1</math></p>',
            );

            let stateVariablesEditor =
                await win.returnAllStateVariableseditor();
            expect(
                stateVariablesEditor[await win.resolvePatheditor("p1")]
                    .activeChildren[0],
            ).eq("Hello!");
            // We could add a name to the DoenetML to resolve this
            // expect(stateVariablesEditor["/_math1"].stateValues.value).eq(2);
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

        cy.get(cesc("#text1")).should("contain.text", "a");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let viewerIdx =
                stateVariables[await win.resolvePath1("editor")]
                    .activeChildren[0].componentIdx;
            let contentAnchor = "#_id_" + cesc(viewerIdx) + "_content";

            cy.get(cesc("#p1")).should("have.text", "");
            cy.get(cesc("#p2")).should("have.text", "");
            cy.get(cesc("#p3")).should(
                "have.text",
                "The value of the entered math is ",
            );
            cy.get(contentAnchor).should("have.text", "");
            cy.get(cesc("#m1")).should("not.exist");

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("editor")].stateValues
                        .immediateValue,
                ).eq("");
                expect(
                    stateVariables[await win.resolvePath1("editor")].stateValues
                        .value,
                ).eq("");
                expect(stateVariables[viewerIdx].activeChildren.length).eq(0);
                expect(stateVariables[await win.resolvePath1("1")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("2")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("1")]).eq(
                    undefined,
                );
            });

            cy.log("type text in editor");
            cy.get(cesc("#editor") + " .cm-content").type(
                '<p name="p1">Hello!</p>',
                {
                    delay: 10,
                },
            );

            cy.get(cesc("#p1")).should("have.text", '<p name="p1">Hello!</p>');
            cy.get(cesc("#p2")).should("have.text", "");
            cy.get(cesc("#p3")).should(
                "have.text",
                "The value of the entered math is ",
            );
            cy.get(contentAnchor).should("have.text", "");
            cy.get(cesc("#m1")).should("not.exist");

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("editor")].stateValues
                        .immediateValue,
                ).eq('<p name="p1">Hello!</p>');
                expect(
                    stateVariables[await win.resolvePath1("editor")].stateValues
                        .value,
                ).eq("");
                expect(stateVariables[viewerIdx].activeChildren.length).eq(0);
                expect(stateVariables[await win.resolvePath1("1")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("2")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("1")]).eq(
                    undefined,
                );
            });

            cy.log("blur updates value but not content");
            cy.get(cesc("#editor") + " .cm-content").blur();

            cy.get(cesc("#p1")).should("have.text", '<p name="p1">Hello!</p>');
            cy.get(cesc("#p2")).should("have.text", '<p name="p1">Hello!</p>');
            cy.get(cesc("#p3")).should(
                "have.text",
                "The value of the entered math is ",
            );
            cy.get(contentAnchor).should("have.text", "");
            cy.get(cesc("#m1")).should("not.exist");

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("editor")].stateValues
                        .immediateValue,
                ).eq('<p name="p1">Hello!</p>');
                expect(
                    stateVariables[await win.resolvePath1("editor")].stateValues
                        .value,
                ).eq('<p name="p1">Hello!</p>');
                expect(stateVariables[viewerIdx].activeChildren.length).eq(0);
                expect(stateVariables[await win.resolvePath1("1")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("2")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("1")]).eq(
                    undefined,
                );
            });

            cy.log("click to update content");
            cy.get(`[data-test="Viewer Update Button"]`).click();

            cy.get(cesc("#p1")).should("have.text", '<p name="p1">Hello!</p>');
            cy.get(cesc("#p2")).should("have.text", '<p name="p1">Hello!</p>');
            cy.get(cesc("#p3")).should(
                "have.text",
                "The value of the entered math is ",
            );
            cy.get(contentAnchor).should("have.text", "Hello!");
            cy.get(cesc("#m1")).should("not.exist");

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("editor")].stateValues
                        .immediateValue,
                ).eq('<p name="p1">Hello!</p>');
                expect(
                    stateVariables[await win.resolvePath1("editor")].stateValues
                        .value,
                ).eq('<p name="p1">Hello!</p>');
                expect(stateVariables[viewerIdx].activeChildren.length).eq(1);
                expect(
                    stateVariables[viewerIdx].activeChildren[0].componentIdx,
                ).eq("/result/p1");
                expect(
                    stateVariables[await win.resolvePath1("1")].stateValues
                        .text,
                ).eq("Hello!");
                expect(stateVariables[await win.resolvePath1("2")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("1")]).eq(
                    undefined,
                );
            });

            cy.log("type more content");
            cy.get(cesc("#editor") + " .cm-content").type(
                '{ctrl+end}{enter}<p name="p2"><math simplify>1+1</math></p>',
                { delay: 10 },
            );

            cy.get(cesc("#p1")).should(
                "have.text",
                '<p name="p1">Hello!</p>\n<p name="p2"><math simplify>1+1</math></p>',
            );
            cy.get(cesc("#p2")).should("have.text", '<p name="p1">Hello!</p>');
            cy.get(cesc("#p3")).should(
                "have.text",
                "The value of the entered math is ",
            );
            cy.get(contentAnchor).should("have.text", "Hello!");
            cy.get(cesc("#m1")).should("not.exist");

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("editor")].stateValues
                        .immediateValue,
                ).eq(
                    '<p name="p1">Hello!</p>\n<p name="p2"><math simplify>1+1</math></p>',
                );
                expect(
                    stateVariables[await win.resolvePath1("editor")].stateValues
                        .value,
                ).eq('<p name="p1">Hello!</p>');
                expect(stateVariables[viewerIdx].activeChildren.length).eq(1);
                expect(
                    stateVariables[viewerIdx].activeChildren[0].componentIdx,
                ).eq("/result/p1");
                expect(
                    stateVariables[await win.resolvePath1("1")].stateValues
                        .text,
                ).eq("Hello!");
                expect(stateVariables[await win.resolvePath1("2")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("1")]).eq(
                    undefined,
                );
            });

            cy.log("Wait for value to be updated");
            cy.get(cesc("#p2")).should(
                "have.text",
                '<p name="p1">Hello!</p>\n<p name="p2"><math simplify>1+1</math></p>',
            );
            cy.get(cesc("#p1")).should(
                "have.text",
                '<p name="p1">Hello!</p>\n<p name="p2"><math simplify>1+1</math></p>',
            );
            cy.get(cesc("#p3")).should(
                "have.text",
                "The value of the entered math is ",
            );
            cy.get(contentAnchor).should("have.text", "Hello!");
            cy.get(cesc("#m1")).should("not.exist");

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("editor")].stateValues
                        .immediateValue,
                ).eq(
                    '<p name="p1">Hello!</p>\n<p name="p2"><math simplify>1+1</math></p>',
                );
                expect(
                    stateVariables[await win.resolvePath1("editor")].stateValues
                        .value,
                ).eq(
                    '<p name="p1">Hello!</p>\n<p name="p2"><math simplify>1+1</math></p>',
                );
                expect(stateVariables[viewerIdx].activeChildren.length).eq(1);
                expect(
                    stateVariables[viewerIdx].activeChildren[0].componentIdx,
                ).eq("/result/p1");
                expect(
                    stateVariables[await win.resolvePath1("1")].stateValues
                        .text,
                ).eq("Hello!");
                expect(stateVariables[await win.resolvePath1("2")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("1")]).eq(
                    undefined,
                );
            });

            cy.log("click to update content");
            cy.get(`[data-test="Viewer Update Button"]`).click();

            cy.get(cesc("#p1")).should(
                "have.text",
                '<p name="p1">Hello!</p>\n<p name="p2"><math simplify>1+1</math></p>',
            );
            cy.get(cesc("#p2")).should(
                "have.text",
                '<p name="p1">Hello!</p>\n<p name="p2"><math simplify>1+1</math></p>',
            );
            cy.get(cesc("#p3")).should(
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
            cy.get(cesc("#m1") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("2");
                });

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("editor")].stateValues
                        .immediateValue,
                ).eq(
                    '<p name="p1">Hello!</p>\n<p name="p2"><math simplify>1+1</math></p>',
                );
                expect(
                    stateVariables[await win.resolvePath1("editor")].stateValues
                        .value,
                ).eq(
                    '<p name="p1">Hello!</p>\n<p name="p2"><math simplify>1+1</math></p>',
                );
                expect(stateVariables[viewerIdx].activeChildren.length).eq(3);
                expect(
                    stateVariables[viewerIdx].activeChildren[0].componentIdx,
                ).eq("/result/p1");
                expect(
                    stateVariables[await win.resolvePath1("1")].stateValues
                        .text,
                ).eq("Hello!");
                expect(stateVariables[viewerIdx].activeChildren[1]).eq("\n");
                expect(
                    stateVariables[viewerIdx].activeChildren[2].componentIdx,
                ).eq("/result/_p2");
                expect(
                    stateVariables[await win.resolvePath1("2")].stateValues
                        .text,
                ).eq("2");
                expect(
                    stateVariables[await win.resolvePath1("2")].activeChildren
                        .length,
                ).eq(1);
                expect(
                    stateVariables[await win.resolvePath1("2")]
                        .activeChildren[0].componentIdx,
                ).eq("/result/_math1");
                expect(
                    stateVariables[await win.resolvePath1("1")].stateValues
                        .value,
                ).eq(2);
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

        cy.get(cesc("#text1")).should("contain.text", "a");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let viewerName =
                stateVariables[await win.resolvePath1("editor")]
                    .activeChildren[0].componentIdx;

            cy.get(cesc("#px")).should(
                "have.text",
                "The value of the dynamic math is ",
            );
            cy.get(cesc("#psx")).should(
                "have.text",
                "The value of the static math is ",
            );
            cy.get(cesc("#pP")).should(
                "have.text",
                "The coords of the dynamic point are ",
            );
            cy.get(cesc("#psP")).should(
                "have.text",
                "The coords of the static point are ",
            );

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("editor")].stateValues
                        .immediateValue,
                ).eq("");
                expect(
                    stateVariables[await win.resolvePath1("editor")].stateValues
                        .value,
                ).eq("");
                expect(stateVariables[viewerName].activeChildren.length).eq(0);
                expect(stateVariables[await win.resolvePath1("x")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("x")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("P")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("P")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("x")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("x")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("P")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("P")]).eq(
                    undefined,
                );
                expect(
                    stateVariables[await win.resolvePath1("t")].replacements
                        .length,
                ).eq(0);
                expect(
                    stateVariables[await win.resolvePath1("c")].replacements
                        .length,
                ).eq(0);
            });

            cy.log("type text in editor");
            cy.get(cesc("#editor") + " .cm-content").type(
                "<p>Enter value <mathInput name='mi' prefill='y' /></p>{enter}",
            );
            cy.get(cesc("#editor") + " .cm-content").type(
                "<p>The value is <copy prop='value' target='$mi' assignNames='x' /></p>{enter}",
            );

            cy.get(cesc("#px")).should(
                "have.text",
                "The value of the dynamic math is ",
            );
            cy.get(cesc("#psx")).should(
                "have.text",
                "The value of the static math is ",
            );
            cy.get(cesc("#pP")).should(
                "have.text",
                "The coords of the dynamic point are ",
            );
            cy.get(cesc("#psP")).should(
                "have.text",
                "The coords of the static point are ",
            );

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("editor")].stateValues
                        .immediateValue,
                ).eq(
                    "<p>Enter value <mathInput name='mi' prefill='y' /></p>\n<p>The value is <copy prop='value' target='$mi' assignNames='x' /></p>\n",
                );
                expect(
                    stateVariables[await win.resolvePath1("editor")].stateValues
                        .value,
                ).eq("");
                expect(stateVariables[viewerName].activeChildren.length).eq(0);
                expect(stateVariables[await win.resolvePath1("x")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("x")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("P")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("P")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("x")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("x")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("P")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("P")]).eq(
                    undefined,
                );
                expect(
                    stateVariables[await win.resolvePath1("t")].replacements
                        .length,
                ).eq(0);
                expect(
                    stateVariables[await win.resolvePath1("c")].replacements
                        .length,
                ).eq(0);
            });

            cy.log("blur updates static but not dynamic");
            cy.get(cesc("#editor") + " .cm-content").blur();

            cy.get(cesc("#psx")).should(
                "contain.text",
                "The value of the static math is y",
            );
            cy.get(cesc("#px")).should(
                "have.text",
                "The value of the dynamic math is ",
            );
            cy.get(cesc("#pP")).should(
                "have.text",
                "The coords of the dynamic point are ",
            );
            cy.get(cesc("#psP")).should(
                "have.text",
                "The coords of the static point are ",
            );

            cy.get(cesc("#sx") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("y");
                });

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("editor")].stateValues
                        .immediateValue,
                ).eq(
                    "<p>Enter value <mathInput name='mi' prefill='y' /></p>\n<p>The value is <copy prop='value' target='$mi' assignNames='x' /></p>\n",
                );
                expect(
                    stateVariables[await win.resolvePath1("editor")].stateValues
                        .value,
                ).eq(
                    "<p>Enter value <mathInput name='mi' prefill='y' /></p>\n<p>The value is <copy prop='value' target='$mi' assignNames='x' /></p>\n",
                );
                expect(stateVariables[await win.resolvePath1("x")]).eq(
                    undefined,
                );
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");
                expect(stateVariables[await win.resolvePath1("P")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("P")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("x")]).eq(
                    undefined,
                );
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");
                expect(stateVariables[await win.resolvePath1("P")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("P")]).eq(
                    undefined,
                );

                expect(stateVariables[viewerName].activeChildren.length).eq(0);
                expect(
                    stateVariables[await win.resolvePath1("t")].replacements
                        .length,
                ).eq(0);

                expect(
                    stateVariables[await win.resolvePath1("c")].replacements
                        .length,
                ).eq(3);
                expect(
                    stateVariables[await win.resolvePath1("c")].replacements[0]
                        .componentIdx,
                ).eq("/static/p1");
                expect(
                    stateVariables[await win.resolvePath1("1")].stateValues
                        .text,
                ).eq("Enter value y");
                expect(
                    stateVariables[await win.resolvePath1("c")].replacements[1],
                ).eq("\n");
                expect(
                    stateVariables[await win.resolvePath1("c")].replacements[2]
                        .componentIdx,
                ).eq("/static/_p2");
                expect(
                    stateVariables[await win.resolvePath1("2")].stateValues
                        .text,
                ).eq("The value is y");
                expect(
                    stateVariables[await win.resolvePath1("i")].stateValues
                        .value,
                ).eq("y");
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");
            });

            cy.log("click to update dynamic content");
            cy.get(`[data-test="Viewer Update Button"]`).click();

            cy.get(cesc("#px")).should(
                "contain.text",
                "The value of the dynamic math is y",
            );
            cy.get(cesc("#psx")).should(
                "contain.text",
                "The value of the static math is y",
            );
            cy.get(cesc("#pP")).should(
                "have.text",
                "The coords of the dynamic point are ",
            );
            cy.get(cesc("#psP")).should(
                "have.text",
                "The coords of the static point are ",
            );

            cy.get(cesc("#x") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("y");
                });
            cy.get(cesc("#sx") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("y");
                });

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("editor")].stateValues
                        .value,
                ).eq(
                    "<p>Enter value <mathInput name='mi' prefill='y' /></p>\n<p>The value is <copy prop='value' target='$mi' assignNames='x' /></p>\n",
                );
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");
                expect(stateVariables[await win.resolvePath1("P")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("P")]).eq(
                    undefined,
                );
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");
                expect(stateVariables[await win.resolvePath1("P")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("P")]).eq(
                    undefined,
                );

                expect(stateVariables[viewerName].activeChildren.length).eq(3);
                expect(
                    stateVariables[await win.resolvePath1("t")].replacements
                        .length,
                ).eq(3);
                expect(
                    stateVariables[viewerName].activeChildren[0].componentIdx,
                ).eq("/result/p1");
                expect(
                    stateVariables[await win.resolvePath1("1")].stateValues
                        .text,
                ).eq("Enter value y");
                expect(stateVariables[viewerName].activeChildren[1]).eq("\n");
                expect(
                    stateVariables[viewerName].activeChildren[2].componentIdx,
                ).eq("/result/_p2");
                expect(
                    stateVariables[await win.resolvePath1("2")].stateValues
                        .text,
                ).eq("The value is y");
                expect(
                    stateVariables[await win.resolvePath1("i")].stateValues
                        .value,
                ).eq("y");
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");

                expect(
                    stateVariables[await win.resolvePath1("c")].replacements
                        .length,
                ).eq(3);
                expect(
                    stateVariables[await win.resolvePath1("c")].replacements[0]
                        .componentIdx,
                ).eq("/static/p1");
                expect(
                    stateVariables[await win.resolvePath1("1")].stateValues
                        .text,
                ).eq("Enter value y");
                expect(
                    stateVariables[await win.resolvePath1("c")].replacements[1],
                ).eq("\n");
                expect(
                    stateVariables[await win.resolvePath1("c")].replacements[2]
                        .componentIdx,
                ).eq("/static/_p2");
                expect(
                    stateVariables[await win.resolvePath1("2")].stateValues
                        .text,
                ).eq("The value is y");
                expect(
                    stateVariables[await win.resolvePath1("i")].stateValues
                        .value,
                ).eq("y");
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");
            });

            cy.log("Enter new value in dynamic results");
            cy.get(cesc("#result\\/mi") + " textarea").type(
                "{end}{backspace}x{enter}",
                { force: true },
            );

            cy.get(cesc("#px")).should(
                "contain.text",
                "The value of the dynamic math is x",
            );
            cy.get(cesc("#psx")).should(
                "contain.text",
                "The value of the static math is y",
            );
            cy.get(cesc("#pP")).should(
                "have.text",
                "The coords of the dynamic point are ",
            );
            cy.get(cesc("#psP")).should(
                "have.text",
                "The coords of the static point are ",
            );

            cy.get(cesc("#x") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("x");
                });
            cy.get(cesc("#sx") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("y");
                });

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("editor")].stateValues
                        .value,
                ).eq(
                    "<p>Enter value <mathInput name='mi' prefill='y' /></p>\n<p>The value is <copy prop='value' target='$mi' assignNames='x' /></p>\n",
                );
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("x");
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");
                expect(stateVariables[await win.resolvePath1("P")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("P")]).eq(
                    undefined,
                );
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("x");
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");
                expect(stateVariables[await win.resolvePath1("P")]).eq(
                    undefined,
                );
                expect(stateVariables[await win.resolvePath1("P")]).eq(
                    undefined,
                );

                expect(stateVariables[viewerName].activeChildren.length).eq(3);
                expect(
                    stateVariables[await win.resolvePath1("t")].replacements
                        .length,
                ).eq(3);
                expect(
                    stateVariables[viewerName].activeChildren[0].componentIdx,
                ).eq("/result/p1");
                expect(
                    stateVariables[await win.resolvePath1("1")].stateValues
                        .text,
                ).eq("Enter value x");
                expect(stateVariables[viewerName].activeChildren[1]).eq("\n");
                expect(
                    stateVariables[viewerName].activeChildren[2].componentIdx,
                ).eq("/result/_p2");
                expect(
                    stateVariables[await win.resolvePath1("2")].stateValues
                        .text,
                ).eq("The value is x");
                expect(
                    stateVariables[await win.resolvePath1("i")].stateValues
                        .value,
                ).eq("x");
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("x");

                expect(
                    stateVariables[await win.resolvePath1("c")].replacements
                        .length,
                ).eq(3);
                expect(
                    stateVariables[await win.resolvePath1("c")].replacements[0]
                        .componentIdx,
                ).eq("/static/p1");
                expect(
                    stateVariables[await win.resolvePath1("1")].stateValues
                        .text,
                ).eq("Enter value y");
                expect(
                    stateVariables[await win.resolvePath1("c")].replacements[1],
                ).eq("\n");
                expect(
                    stateVariables[await win.resolvePath1("c")].replacements[2]
                        .componentIdx,
                ).eq("/static/_p2");
                expect(
                    stateVariables[await win.resolvePath1("2")].stateValues
                        .text,
                ).eq("The value is y");
                expect(
                    stateVariables[await win.resolvePath1("i")].stateValues
                        .value,
                ).eq("y");
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");
            });

            cy.log("type text in editor");
            cy.get(cesc("#editor") + " .cm-content")
                .type(
                    "{ctrl+end}<graph><point name='P'>(3,4)</point></graph>{enter}",
                )
                .blur();

            cy.get(cesc("#psP")).should(
                "contain.text",
                "The coords of the static point are (3,4)",
            );
            cy.get(cesc("#px")).should(
                "contain.text",
                "The value of the dynamic math is x",
            );
            cy.get(cesc("#psx")).should(
                "contain.text",
                "The value of the static math is y",
            );
            cy.get(cesc("#pP")).should(
                "have.text",
                "The coords of the dynamic point are ",
            );

            cy.get(cesc("#x") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("x");
                });
            cy.get(cesc("#sx") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("y");
                });
            cy.get(cesc("#sP") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("(3,4)");
                });

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("x");
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");
                expect(stateVariables[await win.resolvePath1("P")]).eq(
                    undefined,
                );
                expect(
                    stateVariables[await win.resolvePath1("P")].stateValues
                        .vector,
                ).eqls([3, 4]);
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("x");
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");
                expect(stateVariables[await win.resolvePath1("P")]).eq(
                    undefined,
                );
                expect(
                    stateVariables[await win.resolvePath1("P")].stateValues.xs,
                ).eqls([3, 4]);

                expect(stateVariables[viewerName].activeChildren.length).eq(3);
                expect(
                    stateVariables[await win.resolvePath1("t")].replacements
                        .length,
                ).eq(3);
                expect(
                    stateVariables[viewerName].activeChildren[0].componentIdx,
                ).eq("/result/p1");
                expect(
                    stateVariables[await win.resolvePath1("1")].stateValues
                        .text,
                ).eq("Enter value x");
                expect(stateVariables[viewerName].activeChildren[1]).eq("\n");
                expect(
                    stateVariables[viewerName].activeChildren[2].componentIdx,
                ).eq("/result/_p2");
                expect(
                    stateVariables[await win.resolvePath1("2")].stateValues
                        .text,
                ).eq("The value is x");
                expect(
                    stateVariables[await win.resolvePath1("i")].stateValues
                        .value,
                ).eq("x");
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("x");

                expect(
                    stateVariables[await win.resolvePath1("c")].replacements
                        .length,
                ).eq(5);
                expect(
                    stateVariables[await win.resolvePath1("c")].replacements[0]
                        .componentIdx,
                ).eq("/static/p1");
                expect(
                    stateVariables[await win.resolvePath1("1")].stateValues
                        .text,
                ).eq("Enter value y");
                expect(
                    stateVariables[await win.resolvePath1("c")].replacements[1],
                ).eq("\n");
                expect(
                    stateVariables[await win.resolvePath1("c")].replacements[2]
                        .componentIdx,
                ).eq("/static/_p2");
                expect(
                    stateVariables[await win.resolvePath1("2")].stateValues
                        .text,
                ).eq("The value is y");
                expect(
                    stateVariables[await win.resolvePath1("c")].replacements[3],
                ).eq("\n");
                expect(
                    stateVariables[await win.resolvePath1("c")].replacements[4]
                        .componentIdx,
                ).eq("/static/_graph1");

                expect(
                    stateVariables[await win.resolvePath1("i")].stateValues
                        .value,
                ).eq("y");
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");
                expect(
                    stateVariables[await win.resolvePath1("P")].stateValues.xs,
                ).eqls([3, 4]);
            });

            cy.log("click to update dynamic content");
            cy.get(`[data-test="Viewer Update Button"]`).click();

            cy.get(cesc("#pP")).should(
                "contain.text",
                "The coords of the dynamic point are (3,4)",
            );
            cy.get(cesc("#px")).should(
                "contain.text",
                "The value of the dynamic math is y",
            );
            cy.get(cesc("#psx")).should(
                "contain.text",
                "The value of the static math is y",
            );
            cy.get(cesc("#psP")).should(
                "contain.text",
                "The coords of the static point are (3,4)",
            );

            cy.get(cesc("#x") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("y");
                });
            cy.get(cesc("#sx") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("y");
                });
            cy.get(cesc("#P") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("(3,4)");
                });
            cy.get(cesc("#sP") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("(3,4)");
                });

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");
                expect(
                    stateVariables[await win.resolvePath1("P")].stateValues
                        .vector,
                ).eqls([3, 4]);
                expect(
                    stateVariables[await win.resolvePath1("P")].stateValues
                        .vector,
                ).eqls([3, 4]);
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");
                expect(
                    stateVariables[await win.resolvePath1("P")].stateValues.xs,
                ).eqls([3, 4]);
                expect(
                    stateVariables[await win.resolvePath1("P")].stateValues.xs,
                ).eqls([3, 4]);

                expect(stateVariables[viewerName].activeChildren.length).eq(5);
                expect(
                    stateVariables[await win.resolvePath1("t")].replacements
                        .length,
                ).eq(5);
                expect(
                    stateVariables[viewerName].activeChildren[0].componentIdx,
                ).eq("/result/p1");
                expect(
                    stateVariables[await win.resolvePath1("1")].stateValues
                        .text,
                ).eq("Enter value y");
                expect(stateVariables[viewerName].activeChildren[1]).eq("\n");
                expect(
                    stateVariables[viewerName].activeChildren[2].componentIdx,
                ).eq("/result/_p2");
                expect(
                    stateVariables[await win.resolvePath1("2")].stateValues
                        .text,
                ).eq("The value is y");
                expect(stateVariables[viewerName].activeChildren[3]).eq("\n");
                expect(
                    stateVariables[viewerName].activeChildren[4].componentIdx,
                ).eq("/result/_graph1");
                expect(
                    stateVariables[await win.resolvePath1("i")].stateValues
                        .value,
                ).eq("y");
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");
                expect(
                    stateVariables[await win.resolvePath1("P")].stateValues.xs,
                ).eqls([3, 4]);

                expect(
                    stateVariables[await win.resolvePath1("c")].replacements
                        .length,
                ).eq(5);
                expect(
                    stateVariables[await win.resolvePath1("c")].replacements[0]
                        .componentIdx,
                ).eq("/static/p1");
                expect(
                    stateVariables[await win.resolvePath1("1")].stateValues
                        .text,
                ).eq("Enter value y");
                expect(
                    stateVariables[await win.resolvePath1("c")].replacements[1],
                ).eq("\n");
                expect(
                    stateVariables[await win.resolvePath1("c")].replacements[2]
                        .componentIdx,
                ).eq("/static/_p2");
                expect(
                    stateVariables[await win.resolvePath1("2")].stateValues
                        .text,
                ).eq("The value is y");
                expect(
                    stateVariables[await win.resolvePath1("c")].replacements[3],
                ).eq("\n");
                expect(
                    stateVariables[await win.resolvePath1("c")].replacements[4]
                        .componentIdx,
                ).eq("/static/_graph1");

                expect(
                    stateVariables[await win.resolvePath1("i")].stateValues
                        .value,
                ).eq("y");
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");
                expect(
                    stateVariables[await win.resolvePath1("P")].stateValues.xs,
                ).eqls([3, 4]);
            });

            cy.log("Change values in dynamic results");

            cy.window().then(async (win) => {
                await win.callAction1({
                    actionName: "movePoint",
                    componentIdx: "/result/P",
                    args: { x: 5, y: 7 },
                });
            });

            cy.get(cesc("#pP")).should(
                "contain.text",
                "The coords of the dynamic point are (5,7)",
            );
            cy.get(cesc("#px")).should(
                "contain.text",
                "The value of the dynamic math is y",
            );
            cy.get(cesc("#psx")).should(
                "contain.text",
                "The value of the static math is y",
            );
            cy.get(cesc("#psP")).should(
                "contain.text",
                "The coords of the static point are (3,4)",
            );

            cy.get(cesc("#x") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("y");
                });
            cy.get(cesc("#sx") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("y");
                });
            cy.get(cesc("#P") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("(5,7)");
                });
            cy.get(cesc("#sP") + " .mjx-mrow")
                .eq(0)
                .invoke("text")
                .then((text) => {
                    expect(text).eq("(3,4)");
                });

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");
                expect(
                    stateVariables[await win.resolvePath1("P")].stateValues
                        .vector,
                ).eqls([5, 7]);
                expect(
                    stateVariables[await win.resolvePath1("P")].stateValues
                        .vector,
                ).eqls([3, 4]);
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");
                expect(
                    stateVariables[await win.resolvePath1("P")].stateValues.xs,
                ).eqls([5, 7]);
                expect(
                    stateVariables[await win.resolvePath1("P")].stateValues.xs,
                ).eqls([3, 4]);

                expect(stateVariables[viewerName].activeChildren.length).eq(5);
                expect(
                    stateVariables[await win.resolvePath1("t")].replacements
                        .length,
                ).eq(5);
                expect(
                    stateVariables[viewerName].activeChildren[0].componentIdx,
                ).eq("/result/p1");
                expect(
                    stateVariables[await win.resolvePath1("1")].stateValues
                        .text,
                ).eq("Enter value y");
                expect(stateVariables[viewerName].activeChildren[1]).eq("\n");
                expect(
                    stateVariables[viewerName].activeChildren[2].componentIdx,
                ).eq("/result/_p2");
                expect(
                    stateVariables[await win.resolvePath1("2")].stateValues
                        .text,
                ).eq("The value is y");
                expect(stateVariables[viewerName].activeChildren[3]).eq("\n");
                expect(
                    stateVariables[viewerName].activeChildren[4].componentIdx,
                ).eq("/result/_graph1");
                expect(
                    stateVariables[await win.resolvePath1("i")].stateValues
                        .value,
                ).eq("y");
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");
                expect(
                    stateVariables[await win.resolvePath1("P")].stateValues.xs,
                ).eqls([5, 7]);

                expect(
                    stateVariables[await win.resolvePath1("c")].replacements
                        .length,
                ).eq(5);
                expect(
                    stateVariables[await win.resolvePath1("c")].replacements[0]
                        .componentIdx,
                ).eq("/static/p1");
                expect(
                    stateVariables[await win.resolvePath1("1")].stateValues
                        .text,
                ).eq("Enter value y");
                expect(
                    stateVariables[await win.resolvePath1("c")].replacements[1],
                ).eq("\n");
                expect(
                    stateVariables[await win.resolvePath1("c")].replacements[2]
                        .componentIdx,
                ).eq("/static/_p2");
                expect(
                    stateVariables[await win.resolvePath1("2")].stateValues
                        .text,
                ).eq("The value is y");
                expect(
                    stateVariables[await win.resolvePath1("c")].replacements[3],
                ).eq("\n");
                expect(
                    stateVariables[await win.resolvePath1("c")].replacements[4]
                        .componentIdx,
                ).eq("/static/_graph1");

                expect(
                    stateVariables[await win.resolvePath1("i")].stateValues
                        .value,
                ).eq("y");
                expect(
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value,
                ).eq("y");
                expect(
                    stateVariables[await win.resolvePath1("P")].stateValues.xs,
                ).eqls([3, 4]);
            });
        });
    });

    it("include blank string children", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <codeEditor showResults prefill="<text>hello</text> <text>there</text>" name="editor" />

    `,
                },
                "*",
            );
        });

        cy.get(cesc(`#editor::_id_0`)).should("contain.text", "hello there");
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

        cy.get(cesc("#ce") + " .cm-activeLine").invoke("text", "hello");

        cy.get(cesc("#piv")).should("have.text", "immediate value: hello");
        cy.get(cesc("#pv")).should("have.text", "value: ");

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

        cy.get(cesc("#pv")).should("have.text", "value: hello");
        cy.get(cesc("#piv")).should("have.text", "immediate value: hello");
    });

    it("undo prompts save", () => {
        let doenetML = `
    <codeEditor showResults name="editor" />

    <p name="p1">$editor.value</p>
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

        cy.get(cesc("#p1")).should("have.text", "");

        cy.log("type text in editor");
        cy.get(cesc("#editor") + " .cm-activeLine").invoke(
            "text",
            '<p name="p1">Hello!</p>',
        );

        cy.wait(500);

        cy.get(`[data-test="Viewer Update Button"]`).click();

        cy.get(cesc("#p1")).should("have.text", '<p name="p1">Hello!</p>');
        cy.get(cesc("#editor::p1")).should("have.text", "Hello!");

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

        cy.get(cesc("#p1")).should("have.text", '<p name="p1">Hello!</p>');
        cy.get(cesc("#editor::p1")).should("have.text", "Hello!");

        cy.log("Overwrite text");

        cy.get(cesc("#editor") + " .cm-activeLine").invoke(
            "text",
            '<alert name="alert">Overwritten!</alert>',
        );

        cy.get(`[data-test="Viewer Update Button"]`).click();

        cy.get(cesc("#p1")).should(
            "have.text",
            '<alert name="alert">Overwritten!</alert>',
        );
        cy.get(cesc("#editor::p1")).should("not.exist");
        cy.get(cesc("#editor::alert")).should("have.text", "Overwritten!");

        cy.wait(1500); // wait for 1 second debounce

        if (Cypress.platform === "darwin") {
            cy.get(".cm-content").type("{command}{z}");
        } else {
            cy.get(".cm-content").type("{control}{z}");
        }
        cy.get(`[data-test="Viewer Update Button"]`).click();

        cy.get(cesc("#p1")).should("have.text", '<p name="p1">Hello!</p>');
        cy.get(cesc("#editor::p1")).should("have.text", "Hello!");
        cy.get(cesc("#editor::alert")).should("not.exist");

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

        cy.get(cesc("#p1")).should("have.text", '<p name="p1">Hello!</p>');
        cy.get(cesc("#editor::p1")).should("have.text", "Hello!");
        cy.get(cesc("#editor::alert")).should("not.exist");
    });

    it("recover from invalid doenetML", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <codeEditor showResults name="editor" />
    
        <p name="p1">$editor.value</p>
        `,
                },
                "*",
            );
        });

        cy.get(cesc("#p1")).should("have.text", "");

        cy.log("type text in editor");
        cy.get(cesc("#editor") + " .cm-activeLine").invoke(
            "text",
            '<p name="p1">Hello!</p>',
        );

        cy.get(cesc("#editor") + " .cm-content").type("{end}{enter}");

        cy.wait(500);

        cy.get(`[data-test="Viewer Update Button"]`).click();

        cy.get(cesc("#p1")).should("have.text", '<p name="p1">Hello!</p>\n');
        cy.get(cesc("#editor::p1")).should("have.text", "Hello!");

        cy.get(cesc("#editor") + " .cm-activeLine").type("{ctrl+end}");

        cy.get(cesc("#editor") + " .cm-activeLine").invoke(
            "text",
            "<text name='ti'>$ti</text>",
        );

        cy.get(`[data-test="Viewer Update Button"]`).click();

        cy.get(cesc("#p1")).should(
            "have.text",
            "<p name=\"p1\">Hello!</p>\n<text name='ti'>$ti</text>",
        );

        cy.get(cesc("#editor-viewer")).should(
            "contain.text",
            "Circular dependency",
        );

        cy.get(cesc("#editor") + " .cm-activeLine").invoke(
            "text",
            "<text name='ti'>Bye</text>",
        );

        cy.get(`[data-test="Viewer Update Button"]`).click();

        cy.get(cesc("#p1")).should(
            "have.text",
            "<p name=\"p1\">Hello!</p>\n<text name='ti'>Bye</text>",
        );
        cy.get(cesc("#editor::p1")).should("have.text", "Hello!");
        cy.get(cesc("#editor::ti")).should("have.text", "Bye");
    });

    it("Multiple code editors", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <text name="a">a</text>
        <codeEditor showResults name="editor1" />

        <p name="p1">$editor1.value</p>

        <codeEditor showResults name="editor2" />

        <p name="p2">$editor2.value</p>

        <codeEditor showResults name="editor3" />

        <p name="p3">$editor3.value</p>
        `,
                },
                "*",
            );
        });

        cy.get(cesc("#a")).should("contain.text", "a");

        cy.log("type text in editor 1");
        cy.get(cesc("#editor1") + " .cm-activeLine").invoke(
            "text",
            "<p name='p1'>Apple</p>",
        );
        cy.get(cesc("#editor1") + " .cm-content").type("{end}{enter}");

        cy.wait(500);

        cy.get(
            cesc("#editor1-viewer-controls") +
                ` [data-test="Viewer Update Button"]`,
        ).click();

        cy.get(cesc("#p1")).should("have.text", "<p name='p1'>Apple</p>\n");
        cy.get(cesc("#editor1::p1")).should("contain.text", "Apple");

        cy.log("type text in editor 2");
        cy.get(cesc("#editor2") + " .cm-activeLine").invoke(
            "text",
            "<p name='p1'>Banana</p>",
        );
        cy.get(cesc("#editor2") + " .cm-content").type("{end}{enter}");
        cy.get(
            cesc("#editor2-viewer-controls") +
                ` [data-test="Viewer Update Button"]`,
        ).click();

        cy.get(cesc("#p2")).should("have.text", "<p name='p1'>Banana</p>\n");
        cy.get(cesc("#editor2::p1")).should("contain.text", "Banana");

        cy.log("type text in editor 3");
        cy.get(cesc("#editor3") + " .cm-activeLine").invoke(
            "text",
            "<p name='p1'>Cherry</p>",
        );
        cy.get(cesc("#editor3") + " .cm-content").type("{end}{enter}");
        cy.get(
            cesc("#editor3-viewer-controls") +
                ` [data-test="Viewer Update Button"]`,
        ).click();

        cy.get(cesc("#p3")).should("have.text", "<p name='p1'>Cherry</p>\n");
        cy.get(cesc("#editor3::p1")).should("contain.text", "Cherry");
    });
});
