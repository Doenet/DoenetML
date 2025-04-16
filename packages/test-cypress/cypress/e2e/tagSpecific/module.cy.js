import { cesc, cesc2 } from "@doenet/utils";

describe("Module Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("module from uri", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>

    <section><title>First one</title>
    <copy uri='doenet:cid=bafkreigvxxq2khrtoltaqfecscknot5jttw6mtfp5j4bmfwsyufxh6aav4' name="m1" />

    <p>Submitted response for problem 1: <math name="sr1">$(m1/ans.submittedResponse)</math></p>
    <p>Credit for problem 1: $(m1/prob.creditAchieved{assignNames="ca1"})</p>
    </section>

    <section><title>Second one</title>

    <p>Now, let's use initial point <m name="coordsa">(<math name="xa">-3</math>, <math name="ya">3</math>)</m> and the goal point <m name="coordsb">(<math name="xb">7</math>, <math name="yb">-5</math>)</m> </p>

    
    <copy uri='doenet:cid=bafkreigvxxq2khrtoltaqfecscknot5jttw6mtfp5j4bmfwsyufxh6aav4' title="Find point again" goalX="$xb" GoaLy="$yb" initialX="$xa" initialy="$ya" size="medium" aspectRatio="1" name="m2" />
    <p>Submitted response for problem 2: <math name="sr2">$(m2/ans.submittedResponse)</math></p>
    <p>Credit for problem 2: $(m2/prob.creditAchieved{assignNames="ca2"})</p>
    </section>

    `,
                },
                "*",
            );
        });
        cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

        cy.get(cesc2(`#/m1/_m1`)).should("have.text", "(3,4)");
        cy.get(cesc(`#\\/coordsa`)).should("have.text", "(−3,3)");
        cy.get(cesc(`#\\/coordsb`)).should("have.text", "(7,−5)");
        cy.get(cesc2(`#/m2/_m1`)).should("have.text", "(7,−5)");
        cy.get(cesc("#\\/sr1")).should("contain.text", "＿");
        cy.get(cesc("#\\/ca1")).should("have.text", "0");
        cy.get(cesc("#\\/sr2")).should("contain.text", "＿");
        cy.get(cesc("#\\/ca2")).should("have.text", "0");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/m1/P"].stateValues.xs).eqls([0, 0]);
            expect(stateVariables["/m2/P"].stateValues.xs).eqls([-3, 3]);
        });

        cy.log("submit answers");

        cy.get(cesc2("#/m1/ans_submit")).click();
        cy.get(cesc2("#/m2/ans_submit")).click();
        cy.get(cesc("#\\/sr2")).should("contain.text", "(−3,3)");
        cy.get(cesc("#\\/sr1")).should("have.text", "(0,0)");
        cy.get(cesc("#\\/ca1")).should("have.text", "0");
        cy.get(cesc("#\\/sr2")).should("have.text", "(−3,3)");
        cy.get(cesc("#\\/ca2")).should("have.text", "0");

        cy.log("move near correct answers");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentIdx: "/m1/P",
                args: { x: 3.2, y: 3.9 },
            });
            await win.callAction1({
                actionName: "movePoint",
                componentIdx: "/m2/P",
                args: { x: 7.2, y: -4.9 },
            });
        });

        cy.get(cesc2(`#/m1/_m1`)).should("have.text", "(3,4)");
        cy.get(cesc(`#\\/coordsa`)).should("have.text", "(−3,3)");
        cy.get(cesc(`#\\/coordsb`)).should("have.text", "(7,−5)");
        cy.get(cesc2(`#/m2/_m1`)).should("have.text", "(7,−5)");

        cy.log("submit answers");

        cy.get(cesc2("#/m1/ans_submit")).click();
        cy.get(cesc2("#/m2/ans_submit")).click();
        cy.get(cesc("#\\/sr2")).should("contain.text", "(7,−5)");
        cy.get(cesc("#\\/sr1")).should("have.text", "(3,4)");
        cy.get(cesc("#\\/ca1")).should("have.text", "1");
        cy.get(cesc("#\\/sr2")).should("have.text", "(7,−5)");
        cy.get(cesc("#\\/ca2")).should("have.text", "1");
    });

    it("module from uri inside a module", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>

    <module name="g" newNamespace>
      <setup>
        <customAttribute componentType="math" attribute="a" defaultValue="1" assignNames="a" />
        <customAttribute componentType="math" attribute="b" defaultValue="2" assignNames="b" />
        <customAttribute componentType="math" attribute="c" defaultValue="3" assignNames="c" />
        <customAttribute componentType="text" attribute="size" defaultValue="medium" assignNames="size" />
        <customAttribute componentType="number" attribute="aspectRatio" defaultValue="1" assignNames="aspectRatio" />
      </setup>
    
      <p>Make the goal be <m>($a,$b)</m>.</p>
      <p>Make the <m>x</m> value of the initial point be <m>$c</m>.</p>
      <copy size="$size" aspectRatio="$aspectRatio" goalx="$a" goaly="$b" iniTialX="$c" title="Embedded find point" uri="doenet:cid=bafkreigvxxq2khrtoltaqfecscknot5jttw6mtfp5j4bmfwsyufxh6aav4" name="extMod" />
    
      <p>Submitted response for problem: <math name="sr">$(extMod/ans.submittedResponse)</math></p>
      <p>Credit for problem: $(extMod/prob.creditAchieved{assignNames="ca"})</p>

    </module>
    
    $g{b="-5" c="9" size="small" aspectRatio="4/5" name="g2"}
    $g{a="7" c="-3" size="large" aspectRatio="1.2" name="g3"}

    `,
                },
                "*",
            );
        });
        cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

        let smallWidth = 255;
        let mediumWidth = 425;
        let largeWidth = 595;

        cy.get(cesc2("#/g/_m1")).should("have.text", "(1,2)");
        cy.get(cesc2("#/g/_m3")).should("have.text", "3");
        cy.get(cesc2("#/g/extMod/_m1")).should("have.text", "(1,2)");
        cy.get(cesc2("#/g/sr")).should("contain.text", "＿");
        cy.get(cesc2("#/g/ca")).should("have.text", "0");

        cy.get(cesc2("#/g2/_m1")).should("have.text", "(1,−5)");
        cy.get(cesc2("#/g2/_m3")).should("have.text", "9");
        cy.get(cesc2("#/g2/extMod/_m1")).should("have.text", "(1,−5)");
        cy.get(cesc2("#/g2/sr")).should("contain.text", "＿");
        cy.get(cesc2("#/g2/ca")).should("have.text", "0");

        cy.get(cesc2("#/g3/_m1")).should("have.text", "(7,2)");
        cy.get(cesc2("#/g3/_m3")).should("have.text", "−3");
        cy.get(cesc2("#/g3/extMod/_m1")).should("have.text", "(7,2)");
        cy.get(cesc2("#/g3/sr")).should("contain.text", "＿");
        cy.get(cesc2("#/g3/ca")).should("have.text", "0");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/g/extMod/P"].stateValues.xs).eqls([3, 0]);
            expect(stateVariables["/g2/extMod/P"].stateValues.xs).eqls([9, 0]);
            expect(stateVariables["/g3/extMod/P"].stateValues.xs).eqls([-3, 0]);
            expect(stateVariables["/g/extMod/_graph1"].stateValues.size).eq(
                "medium",
            );
            expect(
                stateVariables["/g/extMod/_graph1"].stateValues.width.size,
            ).eq(mediumWidth);
            expect(
                stateVariables["/g/extMod/_graph1"].stateValues.aspectRatio,
            ).eq(1);
            expect(stateVariables["/g2/extMod/_graph1"].stateValues.size).eq(
                "small",
            );
            expect(
                stateVariables["/g2/extMod/_graph1"].stateValues.width.size,
            ).eq(smallWidth);
            expect(
                stateVariables["/g2/extMod/_graph1"].stateValues.aspectRatio,
            ).eq(0.8);
            expect(stateVariables["/g3/extMod/_graph1"].stateValues.size).eq(
                "large",
            );
            expect(
                stateVariables["/g3/extMod/_graph1"].stateValues.width.size,
            ).eq(largeWidth);
            expect(
                stateVariables["/g3/extMod/_graph1"].stateValues.aspectRatio,
            ).eq(1.2);
        });

        cy.log("submit answers");

        cy.get(cesc2("#/g/extMod/ans_submit")).click();
        cy.get(cesc2("#/g2/extMod/ans_submit")).click();
        cy.get(cesc2("#/g3/extMod/ans_submit")).click();

        cy.get(cesc2("#/g3/sr")).should("contain.text", "(−3,0)");

        cy.get(cesc2("#/g/sr")).should("have.text", "(3,0)");
        cy.get(cesc2("#/g/ca")).should("have.text", "0");
        cy.get(cesc2("#/g2/sr")).should("have.text", "(9,0)");
        cy.get(cesc2("#/g2/ca")).should("have.text", "0");
        cy.get(cesc2("#/g3/sr")).should("have.text", "(−3,0)");
        cy.get(cesc2("#/g3/ca")).should("have.text", "0");

        cy.log("move near correct answers");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentIdx: "/g/extMod/P",
                args: { x: 1.2, y: 1.9 },
            });
            await win.callAction1({
                actionName: "movePoint",
                componentIdx: "/g2/extMod/P",
                args: { x: 1.2, y: -4.9 },
            });
            await win.callAction1({
                actionName: "movePoint",
                componentIdx: "/g3/extMod/P",
                args: { x: 7.2, y: 1.9 },
            });
        });

        cy.get(cesc2("#/g/_m1")).should("have.text", "(1,2)");
        cy.get(cesc2("#/g/_m3")).should("have.text", "3");
        cy.get(cesc2("#/g/extMod/_m1")).should("have.text", "(1,2)");
        cy.get(cesc2("#/g/sr")).should("have.text", "(3,0)");
        cy.get(cesc2("#/g/ca")).should("have.text", "0");

        cy.get(cesc2("#/g2/_m1")).should("have.text", "(1,−5)");
        cy.get(cesc2("#/g2/_m3")).should("have.text", "9");
        cy.get(cesc2("#/g2/extMod/_m1")).should("have.text", "(1,−5)");
        cy.get(cesc2("#/g2/sr")).should("have.text", "(9,0)");
        cy.get(cesc2("#/g2/ca")).should("have.text", "0");

        cy.get(cesc2("#/g3/_m1")).should("have.text", "(7,2)");
        cy.get(cesc2("#/g3/_m3")).should("have.text", "−3");
        cy.get(cesc2("#/g3/extMod/_m1")).should("have.text", "(7,2)");
        cy.get(cesc2("#/g3/sr")).should("have.text", "(−3,0)");
        cy.get(cesc2("#/g3/ca")).should("have.text", "0");

        cy.log("submit answers");

        cy.get(cesc2("#/g/extMod/ans_submit")).click();
        cy.get(cesc2("#/g2/extMod/ans_submit")).click();
        cy.get(cesc2("#/g3/extMod/ans_submit")).click();

        cy.get(cesc2("#/g3/sr")).should("contain.text", "(7,2)");

        cy.get(cesc2("#/g/sr")).should("have.text", "(1,2)");
        cy.get(cesc2("#/g/ca")).should("have.text", "1");
        cy.get(cesc2("#/g2/sr")).should("have.text", "(1,−5)");
        cy.get(cesc2("#/g2/ca")).should("have.text", "1");
        cy.get(cesc2("#/g3/sr")).should("have.text", "(7,2)");
        cy.get(cesc2("#/g3/ca")).should("have.text", "1");
    });

    // with no new namespace, links to inside the external module currently don't work
    // but we can set parameters
    it("module from uri inside a module, partial functionality with no new namespace", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>

    <module name="g">
      <setup>
        <customAttribute componentType="math" attribute="a" defaultValue="1" assignNames="a" />
        <customAttribute componentType="math" attribute="b" defaultValue="2" assignNames="b" />
        <customAttribute componentType="math" attribute="c" defaultValue="3" assignNames="c" />
        <customAttribute componentType="text" attribute="size" defaultValue="medium" assignNames="size" />
        <customAttribute componentType="number" attribute="aspectRatio" defaultValue="1" assignNames="aspectRatio" />
      </setup>
    
      <p>Make the goal be <m>($a,$b)</m>.</p>
      <p>Make the <m>x</m> value of the initial point be <m>$c</m>.</p>
      <copy size="$size" aspectRatio="$aspectRatio" goalx="$a" goaly="$b" iniTialX="$c" title="Embedded find point" uri="doenet:cid=bafkreigvxxq2khrtoltaqfecscknot5jttw6mtfp5j4bmfwsyufxh6aav4" name="extMod" />

    </module>
    
    $g{b="-5" c="9" size="small" aspectRatio="4/5" name="g2"}
    $g{a="7" c="-3" size="large" aspectRatio="1.2" name="g3"}

    `,
                },
                "*",
            );
        });
        cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

        let smallWidth = 255;
        let mediumWidth = 425;
        let largeWidth = 595;

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let g2m1Anchor = cesc2(
                "#" +
                    stateVariables[
                        stateVariables["/g2"].replacements[3].componentIdx
                    ].activeChildren[1].componentIdx,
            );
            let g2m3Anchor = cesc2(
                "#" +
                    stateVariables[
                        stateVariables["/g2"].replacements[5].componentIdx
                    ].activeChildren[3].componentIdx,
            );
            let g2extProblem =
                stateVariables[
                    stateVariables[
                        stateVariables[
                            stateVariables["/g2"].replacements[7].componentIdx
                        ].replacements[0].componentIdx
                    ].replacements[3].componentIdx
                ];
            let g2extm1Anchor = cesc2(
                "#" +
                    stateVariables[g2extProblem.activeChildren[2].componentIdx]
                        .activeChildren[1].componentIdx,
            );
            let g2extGraph =
                stateVariables[g2extProblem.activeChildren[4].componentIdx];
            let g2extPName = g2extGraph.activeChildren[0].componentIdx;
            let g2extAnswerSubmitAnchor = cesc2(
                "#" + g2extProblem.activeChildren[6].componentIdx + "_submit",
            );
            let g2extAnswerCorrectAnchor = cesc2(
                "#" + g2extProblem.activeChildren[6].componentIdx + "_correct",
            );
            let g2extAnswerIncorrectAnchor = cesc2(
                "#" +
                    g2extProblem.activeChildren[6].componentIdx +
                    "_incorrect",
            );
            let g3m1Anchor = cesc2(
                "#" +
                    stateVariables[
                        stateVariables["/g3"].replacements[3].componentIdx
                    ].activeChildren[1].componentIdx,
            );
            let g3m3Anchor = cesc2(
                "#" +
                    stateVariables[
                        stateVariables["/g3"].replacements[5].componentIdx
                    ].activeChildren[3].componentIdx,
            );
            let g3extProblem =
                stateVariables[
                    stateVariables[
                        stateVariables[
                            stateVariables["/g3"].replacements[7].componentIdx
                        ].replacements[0].componentIdx
                    ].replacements[3].componentIdx
                ];
            let g3extm1Anchor = cesc2(
                "#" +
                    stateVariables[g3extProblem.activeChildren[2].componentIdx]
                        .activeChildren[1].componentIdx,
            );
            let g3extGraph =
                stateVariables[g3extProblem.activeChildren[4].componentIdx];
            let g3extPName = g3extGraph.activeChildren[0].componentIdx;
            let g3extAnswerSubmitAnchor = cesc2(
                "#" + g3extProblem.activeChildren[6].componentIdx + "_submit",
            );
            let g3extAnswerCorrectAnchor = cesc2(
                "#" + g3extProblem.activeChildren[6].componentIdx + "_correct",
            );
            let g3extAnswerIncorrectAnchor = cesc2(
                "#" +
                    g3extProblem.activeChildren[6].componentIdx +
                    "_incorrect",
            );

            cy.get(cesc2("#/_m1")).should("have.text", "(1,2)");
            cy.get(cesc2("#/_m3")).should("have.text", "3");
            cy.get(cesc2("#/extMod/_m1")).should("have.text", "(1,2)");
            cy.get(g2m1Anchor).should("have.text", "(1,−5)");
            cy.get(g2m3Anchor).should("have.text", "9");
            cy.get(g2extm1Anchor).should("have.text", "(1,−5)");
            cy.get(g3m1Anchor).should("have.text", "(7,2)");
            cy.get(g3m3Anchor).should("have.text", "−3");
            cy.get(g3extm1Anchor).should("have.text", "(7,2)");

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(stateVariables["/extMod/P"].stateValues.xs).eqls([3, 0]);
                expect(stateVariables[g2extPName].stateValues.xs).eqls([9, 0]);
                expect(stateVariables[g3extPName].stateValues.xs).eqls([-3, 0]);
                expect(stateVariables["/extMod/_graph1"].stateValues.size).eq(
                    "medium",
                );
                expect(
                    stateVariables["/extMod/_graph1"].stateValues.width.size,
                ).eq(mediumWidth);
                expect(
                    stateVariables["/extMod/_graph1"].stateValues.aspectRatio,
                ).eq(1);
                expect(
                    stateVariables[g2extGraph.componentIdx].stateValues.size,
                ).eq("small");
                expect(
                    stateVariables[g2extGraph.componentIdx].stateValues.width
                        .size,
                ).eq(smallWidth);
                expect(
                    stateVariables[g2extGraph.componentIdx].stateValues
                        .aspectRatio,
                ).eq(0.8);
                expect(
                    stateVariables[g3extGraph.componentIdx].stateValues.size,
                ).eq("large");
                expect(
                    stateVariables[g3extGraph.componentIdx].stateValues.width
                        .size,
                ).eq(largeWidth);
                expect(
                    stateVariables[g3extGraph.componentIdx].stateValues
                        .aspectRatio,
                ).eq(1.2);
            });

            cy.log("submit answers");

            cy.get(cesc2("#/extMod/ans_submit")).click();
            cy.get(g2extAnswerSubmitAnchor).click();
            cy.get(g3extAnswerSubmitAnchor).click();
            cy.get(g2extAnswerIncorrectAnchor).should("be.visible");
            cy.get(g3extAnswerIncorrectAnchor).should("be.visible");

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables["/extMod/prob"].stateValues.creditAchieved,
                ).eq(0);
                expect(
                    stateVariables[g2extProblem.componentIdx].stateValues
                        .creditAchieved,
                ).eq(0);
                expect(
                    stateVariables[g3extProblem.componentIdx].stateValues
                        .creditAchieved,
                ).eq(0);
            });

            cy.log("move near correct answers");
            cy.window().then(async (win) => {
                await win.callAction1({
                    actionName: "movePoint",
                    componentIdx: "/extMod/P",
                    args: { x: 1.2, y: 1.9 },
                });
                await win.callAction1({
                    actionName: "movePoint",
                    componentIdx: g2extPName,
                    args: { x: 1.2, y: -4.9 },
                });
                await win.callAction1({
                    actionName: "movePoint",
                    componentIdx: g3extPName,
                    args: { x: 7.2, y: 1.9 },
                });
            });

            cy.get(cesc2("#/_m1")).should("have.text", "(1,2)");
            cy.get(cesc2("#/_m3")).should("have.text", "3");
            cy.get(cesc2("#/extMod/_m1")).should("have.text", "(1,2)");
            cy.get(g2m1Anchor).should("have.text", "(1,−5)");
            cy.get(g2m3Anchor).should("have.text", "9");
            cy.get(g2extm1Anchor).should("have.text", "(1,−5)");
            cy.get(g3m1Anchor).should("have.text", "(7,2)");
            cy.get(g3m3Anchor).should("have.text", "−3");
            cy.get(g3extm1Anchor).should("have.text", "(7,2)");

            cy.log("submit answers");

            cy.get(cesc2("#/extMod/ans_submit")).click();
            cy.get(g2extAnswerSubmitAnchor).click();
            cy.get(g3extAnswerSubmitAnchor).click();
            cy.get(g2extAnswerCorrectAnchor).should("be.visible");
            cy.get(g3extAnswerCorrectAnchor).should("be.visible");

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables["/extMod/prob"].stateValues.creditAchieved,
                ).eq(1);
                expect(
                    stateVariables[g2extProblem.componentIdx].stateValues
                        .creditAchieved,
                ).eq(1);
                expect(
                    stateVariables[g3extProblem.componentIdx].stateValues
                        .creditAchieved,
                ).eq(1);
            });
        });
    });
});
