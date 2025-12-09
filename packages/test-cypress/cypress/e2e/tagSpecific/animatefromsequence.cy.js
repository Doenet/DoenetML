import { cesc } from "@doenet/utils";

describe("AnimateFromSequence Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("increase from 1 to 10", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
            <p>value: <number name="a">1</number></p>

            <animateFromSequence name="x" animationMode='increase' animationOn='$b' target='$a' animationInterval='100' />

            <booleanInput name="b" />
            
            <p>copy: <number extend="$a" name="a2" /></p>

            `,
                },
                "*",
            );
        });

        cy.get("#a").should("have.text", "1");
        cy.get("#a2").should("have.text", "1");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            const xIdx = await win.resolvePath1("x");
            const aIdx = await win.resolvePath1("a");
            const a2Idx = await win.resolvePath1("a2");
            const bIdx = await win.resolvePath1("b");

            expect(stateVariables[xIdx].stateValues.value).eq(1);
            expect(stateVariables[aIdx].stateValues.value).eq(1);
            expect(stateVariables[a2Idx].stateValues.value).eq(1);
            expect(stateVariables[xIdx].stateValues.selectedIndex).eq(1);
            expect(stateVariables[xIdx].stateValues.animationOn).eq(false);

            cy.get(`#b`).click();
            cy.get(`#a`).should("have.text", "2");
            cy.get(`#a2`).should("have.text", "2");
            cy.get(`#a`).should("have.text", "3");
            cy.get(`#a2`).should("have.text", "3");
            cy.get(`#a`).should("have.text", "4");
            cy.get(`#a2`).should("have.text", "4");
            cy.get(`#a`).should("have.text", "5");
            cy.get(`#a2`).should("have.text", "5");
            cy.get(`#a`).should("have.text", "6");
            cy.get(`#a2`).should("have.text", "6");
            cy.get(`#a`).should("have.text", "7");
            cy.get(`#a2`).should("have.text", "7");
            cy.get(`#a`).should("have.text", "8");
            cy.get(`#a2`).should("have.text", "8");
            cy.get(`#a`).should("have.text", "9");
            cy.get(`#a2`).should("have.text", "9");
            cy.get(`#a`).should("have.text", "10");
            cy.get(`#a2`).should("have.text", "10");
            cy.get(`#a`).should("have.text", "1");
            cy.get(`#a2`).should("have.text", "1");
            cy.get(`#a`).should("have.text", "2");
            cy.get(`#a2`).should("have.text", "2");

            cy.get(`#b`).click();

            cy.waitUntil(() =>
                cy.window().then(async (win) => {
                    let stateVariables = await win.returnAllStateVariables1();
                    return (
                        stateVariables[xIdx].stateValues.animationOn === false
                    );
                }),
            );

            // should stop at 2 or 3
            cy.get(`#a`).contains(/2|3/);

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                let lastValue = stateVariables[xIdx].stateValues.value;
                expect(lastValue === 2 || lastValue === 3).be.true;
                expect(stateVariables[aIdx].stateValues.value).eq(lastValue);
                expect(stateVariables[a2Idx].stateValues.value).eq(lastValue);
                expect(stateVariables[xIdx].stateValues.selectedIndex).eq(
                    lastValue,
                );
                expect(stateVariables[xIdx].stateValues.animationOn).eq(false);

                cy.get(`#a`).should("have.text", `${lastValue}`);
                cy.get(`#a2`).should("have.text", `${lastValue}`);
            });
        });
    });

    it("increase once from 1 to 10", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
            <p>value: <number name="a">1</number></p>

            <animateFromSequence name="x" animationMode='increase once' animationOn='$b' target='$a' animationInterval='100' />

            <booleanInput name="b" />
            
            <p>copy: <number extend="$a" name="a2" /></p>

            `,
                },
                "*",
            );
        });

        cy.get("#a").should("have.text", "1");
        cy.get("#a2").should("have.text", "1");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues.value,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("a")].stateValues.value,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("a2")].stateValues.value,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);
        });

        cy.get("#b").click();
        cy.get("#a").should("have.text", "2");
        cy.get("#a2").should("have.text", "2");
        cy.get("#a").should("have.text", "3");
        cy.get("#a2").should("have.text", "3");
        cy.get("#a").should("have.text", "4");
        cy.get("#a2").should("have.text", "4");
        cy.get("#a").should("have.text", "5");
        cy.get("#a2").should("have.text", "5");
        cy.get("#a").should("have.text", "6");
        cy.get("#a2").should("have.text", "6");
        cy.get("#a").should("have.text", "7");
        cy.get("#a2").should("have.text", "7");
        cy.get("#a").should("have.text", "8");
        cy.get("#a2").should("have.text", "8");
        cy.get("#a").should("have.text", "9");
        cy.get("#a2").should("have.text", "9");
        cy.get("#a").should("have.text", "10");
        cy.get("#a2").should("have.text", "10");

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return (
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        cy.get("#a").should("have.text", "10");
        cy.get("#a2").should("have.text", "10");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues.value,
            ).eq(10);
            expect(
                stateVariables[await win.resolvePath1("a")].stateValues.value,
            ).eq(10);
            expect(
                stateVariables[await win.resolvePath1("a2")].stateValues.value,
            ).eq(10);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(10);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);
        });
    });

    it("decrease from z to e by 3", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
                <p>value: <text name="a">z</text></p>

                <animateFromSequence type="letters" name="x" animationMode='decrease' animationOn='$b' target='$a' animationInterval='100' from="e" to="z" step="3" />
                <booleanInput name="b" />
                
                <p>copy: <text extend="$a" name="a2" /></p>

                `,
                },
                "*",
            );
        });

        cy.get("#a").should("have.text", "z");
        cy.get("#a2").should("have.text", "z");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues.value,
            ).eq("e");
            expect(
                stateVariables[await win.resolvePath1("a")].stateValues.value,
            ).eq("z");
            expect(
                stateVariables[await win.resolvePath1("a2")].stateValues.value,
            ).eq("z");
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);
        });

        cy.log("advance at most one when click twice");
        cy.get("#b").click();
        cy.get("#b").click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                let lastValue =
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value;
                return (
                    (lastValue === "z" || lastValue === "w") &&
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        cy.get("#a").contains(/w|z/);

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let lastValue =
                stateVariables[await win.resolvePath1("x")].stateValues.value;
            console.log(`lastValue: `, lastValue);
            expect(lastValue === "z" || lastValue === "w").be.true;
            expect(
                stateVariables[await win.resolvePath1("a")].stateValues.value,
            ).eq(lastValue);
            expect(
                stateVariables[await win.resolvePath1("a2")].stateValues.value,
            ).eq(lastValue);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(lastValue === "z" ? 8 : 7);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);
            cy.get("#a").should("have.text", lastValue);
            cy.get("#a2").should("have.text", lastValue);
        });

        cy.get("#b").click();
        cy.get("#a").should("have.text", "t");
        cy.get("#a2").should("have.text", "t");
        cy.get("#a").should("have.text", "q");
        cy.get("#a2").should("have.text", "q");
        cy.get("#a").should("have.text", "n");
        cy.get("#a2").should("have.text", "n");
        cy.get("#a").should("have.text", "k");
        cy.get("#a2").should("have.text", "k");
        cy.get("#a").should("have.text", "h");
        cy.get("#a2").should("have.text", "h");
        cy.get("#a").should("have.text", "e");
        cy.get("#a2").should("have.text", "e");
        cy.get("#a").should("have.text", "z");
        cy.get("#a2").should("have.text", "z");
        cy.get("#a").should("have.text", "w");
        cy.get("#a2").should("have.text", "w");
        cy.get("#a").should("have.text", "t");
        cy.get("#a2").should("have.text", "t");
        cy.get("#a").should("have.text", "q");
        cy.get("#a2").should("have.text", "q");

        cy.get("#b").click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return (
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        cy.get("#a").contains(/q|n/);

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let lastValue =
                stateVariables[await win.resolvePath1("x")].stateValues.value;
            expect(lastValue === "q" || lastValue === "n").be.true;
            expect(
                stateVariables[await win.resolvePath1("a")].stateValues.value,
            ).eq(lastValue);
            expect(
                stateVariables[await win.resolvePath1("a2")].stateValues.value,
            ).eq(lastValue);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(lastValue === "q" ? 5 : 4);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);

            cy.get("#a").should("have.text", lastValue);
            cy.get("#a2").should("have.text", lastValue);
        });
    });

    it("decrease once from z to e by 3", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
                <text>a</text>

                <p>value: <text name="a">z</text></p>

                <animateFromSequence type="letters" name="x" animationMode='decrease once' animationOn='$b' target='$a' animationInterval='100' from="e" to="z" step="3" />
                <booleanInput name="b" />
                
                <p>copy: <text extend="$a" name="a2" /></p>

                `,
                },
                "*",
            );
        });

        cy.get("#a").should("have.text", "z");
        cy.get("#a2").should("have.text", "z");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues.value,
            ).eq("e");
            expect(
                stateVariables[await win.resolvePath1("a")].stateValues.value,
            ).eq("z");
            expect(
                stateVariables[await win.resolvePath1("a2")].stateValues.value,
            ).eq("z");
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);
        });

        cy.get("#b").click();
        cy.get("#a").should("have.text", "w");
        cy.get("#a2").should("have.text", "w");
        cy.get("#a").should("have.text", "t");
        cy.get("#a2").should("have.text", "t");
        cy.get("#a").should("have.text", "q");
        cy.get("#a2").should("have.text", "q");
        cy.get("#a").should("have.text", "n");
        cy.get("#a2").should("have.text", "n");
        cy.get("#a").should("have.text", "k");
        cy.get("#a2").should("have.text", "k");
        cy.get("#a").should("have.text", "h");
        cy.get("#a2").should("have.text", "h");
        cy.get("#a").should("have.text", "e");
        cy.get("#a2").should("have.text", "e");

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return (
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        cy.get("#a").should("have.text", "e");
        cy.get("#a2").should("have.text", "e");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues.value,
            ).eq("e");
            expect(
                stateVariables[await win.resolvePath1("a")].stateValues.value,
            ).eq("e");
            expect(
                stateVariables[await win.resolvePath1("a2")].stateValues.value,
            ).eq("e");
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);
        });
    });

    it("oscillate between -1000 and 1000 by 100s, skipping 0, +-200, +-300 +-400, +-700, +-800", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

                    <p>value: <number name="a">-600</number></p>

                    <animateFromSequence name="x" animationMode='oscillate' animationOn='$b' target='$a' animationInterval='100' from="-1000" to="1000" step="100" exclude="0 200 -200 300 -300 400 -400 700 -700 800 -800" />
                    <booleanInput name="b" />
                    
                    <p>copy: <number extend="$a" name="a2" /></p>

                    `,
                },
                "*",
            );
        });

        cy.get("#a").should("have.text", "-600");
        cy.get("#a2").should("have.text", "-600");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues.value,
            ).eq(-1000);
            expect(
                stateVariables[await win.resolvePath1("a")].stateValues.value,
            ).eq(-600);
            expect(
                stateVariables[await win.resolvePath1("a2")].stateValues.value,
            ).eq(-600);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);
        });

        cy.get("#b").click();
        cy.get("#b").click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                let lastValue =
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value;
                return (
                    (lastValue === -600 || lastValue === -500) &&
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        cy.get("#a").contains(/-600|-500/);

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let lastValue =
                stateVariables[await win.resolvePath1("x")].stateValues.value;
            expect(lastValue === -600 || lastValue === -500).be.true;
            expect(
                stateVariables[await win.resolvePath1("a")].stateValues.value,
            ).eq(lastValue);
            expect(
                stateVariables[await win.resolvePath1("a2")].stateValues.value,
            ).eq(lastValue);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(lastValue === -600 ? 3 : 4);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);
            cy.get("#a").should("have.text", `${lastValue}`);
            cy.get("#a2").should("have.text", `${lastValue}`);
        });

        cy.get("#b").click();
        cy.get("#a").should("have.text", "-100");
        cy.get("#a2").should("have.text", "-100");
        cy.get("#a").should("have.text", "100");
        cy.get("#a2").should("have.text", "100");
        cy.get("#a").should("have.text", "500");
        cy.get("#a2").should("have.text", "500");
        cy.get("#a").should("have.text", "600");
        cy.get("#a2").should("have.text", "600");
        cy.get("#a").should("have.text", "900");
        cy.get("#a2").should("have.text", "900");
        cy.get("#a").should("have.text", "1000");
        cy.get("#a2").should("have.text", "1000");
        cy.get("#a").should("have.text", "900");
        cy.get("#a2").should("have.text", "900");
        cy.get("#a").should("have.text", "600");
        cy.get("#a2").should("have.text", "600");
        cy.get("#a").should("have.text", "500");
        cy.get("#a2").should("have.text", "500");
        cy.get("#a").should("have.text", "100");
        cy.get("#a2").should("have.text", "100");
        cy.get("#a").should("have.text", "-100");
        cy.get("#a2").should("have.text", "-100");
        cy.get("#a").should("have.text", "-500");
        cy.get("#a2").should("have.text", "-500");
        cy.get("#a").should("have.text", "-600");
        cy.get("#a2").should("have.text", "-600");
        cy.get("#a").should("have.text", "-900");
        cy.get("#a2").should("have.text", "-900");
        cy.get("#a").should("have.text", "-1000");
        cy.get("#a2").should("have.text", "-1000");
        cy.get("#a").should("have.text", "-900");
        cy.get("#a2").should("have.text", "-900");
        cy.get("#a").should("have.text", "-600");
        cy.get("#a2").should("have.text", "-600");
        cy.get("#a").should("have.text", "-500");
        cy.get("#a2").should("have.text", "-500");
        cy.get("#a").should("have.text", "-100");
        cy.get("#a2").should("have.text", "-100");

        cy.get("#b").click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return (
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        cy.get("#a").contains(/-100|100/);

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let lastValue =
                stateVariables[await win.resolvePath1("x")].stateValues.value;
            expect(lastValue === -100 || lastValue === 100).be.true;
            expect(
                stateVariables[await win.resolvePath1("a")].stateValues.value,
            ).eq(lastValue);
            expect(
                stateVariables[await win.resolvePath1("a2")].stateValues.value,
            ).eq(lastValue);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(lastValue === -100 ? 5 : 6);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);

            cy.get("#a").should("have.text", `${lastValue}`);
            cy.get("#a2").should("have.text", `${lastValue}`);
        });
    });

    it("animation adjusts if value changed when paused", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
                <p name="pa">value: $a</p> 
                <slider name="a" initialValue="89.8" from="1" to="100" step="0.1" />

                <animateFromSequence name="x" animationMode='increase' animationOn='$b' target='$a' animationInterval='400' from="1" to="100" step="0.1" />

                <booleanInput name="b" />
                
                <p name="pa2">value: $a2</p>
                <slider extend="$a" name="a2" />

                `,
                },
                "*",
            );
        });

        cy.get("#pa").should("have.text", "value: 89.8");
        cy.get("#pa2").should("have.text", "value: 89.8");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues.value,
            ).closeTo(1, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("a")].stateValues.value,
            ).closeTo(89.8, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("a2")].stateValues.value,
            ).closeTo(89.8, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);
        });

        cy.get("#b").click();
        cy.get("#b").click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                let lastValue =
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .value;
                return (
                    Math.abs(lastValue - 89.8) < 1e-12 &&
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        cy.get("#pa").should("have.text", "value: 89.8");
        cy.get("#pa2").should("have.text", "value: 89.8");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues.value,
            ).closeTo(89.8, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("a")].stateValues.value,
            ).closeTo(89.8, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("a2")].stateValues.value,
            ).closeTo(89.8, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(889);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);
        });

        cy.get("#b").click();
        cy.get("#pa").should("have.text", "value: 89.8");
        cy.get("#pa2").should("have.text", "value: 89.8");
        cy.get("#pa").should("have.text", "value: 89.9");
        cy.get("#pa2").should("have.text", "value: 89.9");
        cy.get("#pa").should("have.text", "value: 90");
        cy.get("#pa2").should("have.text", "value: 90");
        cy.get("#pa").should("have.text", "value: 90.1");
        cy.get("#pa2").should("have.text", "value: 90.1");

        cy.get("#b").click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return (
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        cy.get("#pa").should("have.text", "value: 90.1");
        cy.get("#pa2").should("have.text", "value: 90.1");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues.value,
            ).closeTo(90.1, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("a")].stateValues.value,
            ).closeTo(90.1, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("a2")].stateValues.value,
            ).closeTo(90.1, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(892);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);
        });

        cy.get("#b").click();
        cy.get("#pa").should("have.text", "value: 90.1");
        cy.get("#pa2").should("have.text", "value: 90.1");
        cy.get("#pa").should("have.text", "value: 90.2");
        cy.get("#pa2").should("have.text", "value: 90.2");
        cy.get("#b").click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return (
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues.value,
            ).closeTo(90.2, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("a")].stateValues.value,
            ).closeTo(90.2, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("a2")].stateValues.value,
            ).closeTo(90.2, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(893);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);
        });

        cy.log(`change value on with first slider`);
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "changeValue",
                componentIdx: await win.resolvePath1("a"),
                args: { value: 33.4 },
            });
        });

        cy.get("#pa").should("have.text", "value: 33.4");
        cy.get("#pa2").should("have.text", "value: 33.4");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues.value,
            ).closeTo(90.2, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("a")].stateValues.value,
            ).closeTo(33.4, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("a2")].stateValues.value,
            ).closeTo(33.4, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(893);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);
        });

        cy.get("#b").click();
        cy.get("#pa").should("have.text", "value: 33.4");
        cy.get("#pa2").should("have.text", "value: 33.4");
        cy.get("#pa").should("have.text", "value: 33.5");
        cy.get("#pa2").should("have.text", "value: 33.5");
        cy.get("#pa").should("have.text", "value: 33.6");
        cy.get("#pa2").should("have.text", "value: 33.6");
        cy.get("#b").click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return (
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues.value,
            ).closeTo(33.6, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("a")].stateValues.value,
            ).closeTo(33.6, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("a2")].stateValues.value,
            ).closeTo(33.6, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(327);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);
        });

        cy.log(`change value on with second slider`);
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "changeValue",
                componentIdx: await win.resolvePath1("a2"),
                args: { value: 64.5 },
            });
        });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues.value,
            ).closeTo(33.6, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("a")].stateValues.value,
            ).closeTo(64.5, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("a2")].stateValues.value,
            ).closeTo(64.5, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(327);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);
        });

        cy.get("#b").click();
        cy.get("#pa").should("have.text", "value: 64.5");
        cy.get("#pa2").should("have.text", "value: 64.5");
        cy.get("#pa").should("have.text", "value: 64.6");
        cy.get("#pa2").should("have.text", "value: 64.6");
        cy.get("#pa").should("have.text", "value: 64.7");
        cy.get("#pa2").should("have.text", "value: 64.7");
        cy.get("#b").click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return (
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        cy.get("#pa").should("have.text", "value: 64.7");
        cy.get("#pa2").should("have.text", "value: 64.7");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues.value,
            ).closeTo(64.7, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("a")].stateValues.value,
            ).closeTo(64.7, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("a2")].stateValues.value,
            ).closeTo(64.7, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(638);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);
        });
    });

    it("animation adjusts if value changed when running if allowAdjustmentsWhileRunning", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
                    <p name="pa">value: $a</p> 
                    <slider name="a" initialValue="89.8" from="1" to="100" step="0.1" />

                    <animateFromSequence name="x" animationMode='increase once' animationOn='$aon' target='$a' animationInterval='400' from="1" to="100" step="0.1" allowAdjustmentsWhileRunning="$aawr" />

                    <p>Animation on: <booleanInput name="aon" /></p>
                    <p>Allow adjustments while running: <booleanInput name="aawr" /> <boolean name="aawr2" extend="$aawr" /></p>
                    
                    <p name="pa2">value: $a2</p>
                    <slider extend="$a" name="a2" />

                    `,
                },
                "*",
            );
        });

        cy.get("#pa").should("have.text", "value: 89.8");
        cy.get("#pa2").should("have.text", "value: 89.8");

        cy.get("#aon").click();
        cy.get("#pa").should("have.text", "value: 89.8");
        cy.get("#pa2").should("have.text", "value: 89.8");
        cy.get("#pa").should("have.text", "value: 89.9");
        cy.get("#pa2").should("have.text", "value: 89.9");
        cy.get("#pa").should("have.text", "value: 90");
        cy.get("#pa2").should("have.text", "value: 90");

        cy.log(`can't change value on with first slider`);
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "changeValue",
                componentIdx: await win.resolvePath1("a"),
                args: { value: 33.4 },
            });
        });

        cy.get("#pa").should("have.text", "value: 90.1");
        cy.get("#pa2").should("have.text", "value: 90.1");
        cy.get("#pa").should("have.text", "value: 90.2");
        cy.get("#pa2").should("have.text", "value: 90.2");
        cy.get("#pa").should("have.text", "value: 90.3");
        cy.get("#pa2").should("have.text", "value: 90.3");

        cy.log(`can't change value on with second slider`);
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "changeValue",
                componentIdx: await win.resolvePath1("a2"),
                args: { value: 4.5 },
            });
        });

        cy.get("#pa").should("have.text", "value: 90.4");
        cy.get("#pa2").should("have.text", "value: 90.4");
        cy.get("#pa").should("have.text", "value: 90.5");
        cy.get("#pa2").should("have.text", "value: 90.5");
        cy.get("#pa").should("have.text", "value: 90.6");
        cy.get("#pa2").should("have.text", "value: 90.6");

        cy.log("allow adjustments");
        cy.get("#aawr").click();
        cy.get("#aawr2").should("have.text", "true");

        cy.log(`can now change value on with first slider`);
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "changeValue",
                componentIdx: await win.resolvePath1("a"),
                args: { value: 33.4 },
            });
        });

        cy.get("#pa").should("have.text", "value: 33.4");
        cy.get("#pa2").should("have.text", "value: 33.4");
        cy.get("#pa").should("have.text", "value: 33.5");
        cy.get("#pa2").should("have.text", "value: 33.5");
        cy.get("#pa").should("have.text", "value: 33.6");
        cy.get("#pa2").should("have.text", "value: 33.6");

        cy.log(`can now change value on with second slider`);
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "changeValue",
                componentIdx: await win.resolvePath1("a2"),
                args: { value: 4.5 },
            });
        });

        cy.get("#pa").should("have.text", "value: 4.5");
        cy.get("#pa2").should("have.text", "value: 4.5");
        cy.get("#pa").should("have.text", "value: 4.6");
        cy.get("#pa2").should("have.text", "value: 4.6");
        cy.get("#pa").should("have.text", "value: 4.7");
        cy.get("#pa2").should("have.text", "value: 4.7");
        cy.get("#aon").click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return (
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        cy.get("#pa").should("have.text", "value: 4.7");
        cy.get("#pa2").should("have.text", "value: 4.7");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues.value,
            ).closeTo(4.7, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("a")].stateValues.value,
            ).closeTo(4.7, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("a2")].stateValues.value,
            ).closeTo(4.7, 1e-12);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(38);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);
        });
    });

    it("check that calculated default value does not change on reload", () => {
        let doenetML = `
            <p>Animation mode: <textInput name="anmode" prefill="increase" /></p>
            <animateFromSequence name="an" animationmode="$anmode" />
            <p>Animation direction: <text extend="$an.currentAnimationDirection" name="cad" /></p>
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

        cy.get("#cad").should("have.text", "increase");
        cy.get("#anmode_input").should("have.value", "increase");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("anmode")].stateValues
                    .value,
            ).eq("increase");
            expect(
                stateVariables[await win.resolvePath1("an")].stateValues
                    .animationMode,
            ).eq("increase");
        });

        cy.get("#anmode_input").clear().type("decrease{enter}");

        cy.get("#cad").should("have.text", "decrease");
        cy.get("#anmode_input").should("have.value", "decrease");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("anmode")].stateValues
                    .value,
            ).eq("decrease");
            expect(
                stateVariables[await win.resolvePath1("an")].stateValues
                    .animationMode,
            ).eq("decrease");
        });

        cy.wait(2000); // wait for 1 second debounce

        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        // wait until core is loaded
        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                if (typeof win.returnAllStateVariables1 !== "function") {
                    return false;
                }
                let stateVariables = await win.returnAllStateVariables1();
                return stateVariables[0];
            }),
        );

        cy.get("#cad").should("have.text", "decrease");
        cy.get("#anmode_input").should("have.value", "decrease");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("anmode")].stateValues
                    .value,
            ).eq("decrease");
            expect(
                stateVariables[await win.resolvePath1("an")].stateValues
                    .animationMode,
            ).eq("decrease");
        });
    });

    it("call animation actions", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
                <p>value: <number name="a">1</number></p>

                <animateFromSequence name="x" animationMode='increase' target='$a' animationInterval='100' />

                <callAction target="$x" actionName="startAnimation" name="start" >
                    <label>start</label>
                </callAction>
                <callAction target="$x" actionName="stopAnimation" name="stop" >
                    <label>stop</label>
                </callAction>
                <callAction target="$x" actionName="toggleAnimation" name="toggle" >
                    <label>toggle</label>
                </callAction>

                <p>copy: <number extend="$a" name="a2" /></p>

                `,
                },
                "*",
            );
        });

        cy.get("#a").should("have.text", "1");
        cy.get("#a2").should("have.text", "1");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues.value,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("a")].stateValues.value,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("a2")].stateValues.value,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);
        });

        cy.get("#start_button").click();
        cy.get("#a").should("have.text", "2");
        cy.get("#a2").should("have.text", "2");
        cy.get("#a").should("have.text", "3");
        cy.get("#a2").should("have.text", "3");
        cy.get("#a").should("have.text", "4");
        cy.get("#a2").should("have.text", "4");
        cy.get("#a").should("have.text", "5");
        cy.get("#a2").should("have.text", "5");

        cy.get("#start_button").click();
        cy.get("#a").should("have.text", "6");
        cy.get("#a2").should("have.text", "6");
        cy.get("#a").should("have.text", "7");
        cy.get("#a2").should("have.text", "7");
        cy.get("#a").should("have.text", "8");
        cy.get("#a2").should("have.text", "8");
        cy.get("#a").should("have.text", "9");
        cy.get("#a2").should("have.text", "9");
        cy.get("#a").should("have.text", "10");
        cy.get("#a2").should("have.text", "10");
        cy.get("#a").should("have.text", "1");
        cy.get("#a2").should("have.text", "1");
        cy.get("#a").should("have.text", "2");
        cy.get("#a2").should("have.text", "2");

        cy.get("#stop_button").click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return (
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        // should stop at 2 or 3
        cy.get("#a").contains(/2|3/);

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let lastValue =
                stateVariables[await win.resolvePath1("x")].stateValues.value;
            expect(lastValue === 2 || lastValue === 3).be.true;
            expect(
                stateVariables[await win.resolvePath1("a")].stateValues.value,
            ).eq(lastValue);
            expect(
                stateVariables[await win.resolvePath1("a2")].stateValues.value,
            ).eq(lastValue);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(lastValue);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);

            cy.get("#a").should("have.text", `${lastValue}`);
            cy.get("#a2").should("have.text", `${lastValue}`);

            cy.get("#stop_button").click();

            cy.waitUntil(() =>
                cy.window().then(async (win) => {
                    let stateVariables = await win.returnAllStateVariables1();
                    return (
                        stateVariables[await win.resolvePath1("x")].stateValues
                            .animationOn === false
                    );
                }),
            );

            cy.get("#a").should("have.text", `${lastValue}`);
            cy.get("#a2").should("have.text", `${lastValue}`);
        });

        cy.get("#toggle_button").click();
        cy.get("#a").should("have.text", "4");
        cy.get("#a2").should("have.text", "4");
        cy.get("#a").should("have.text", "5");
        cy.get("#a2").should("have.text", "5");
        cy.get("#a").should("have.text", "6");
        cy.get("#a2").should("have.text", "6");
        cy.get("#a").should("have.text", "7");
        cy.get("#a2").should("have.text", "7");

        cy.get("#toggle_button").click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return (
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        // should stop at 7 or 8
        cy.get("#a").contains(/7|8/);

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let lastValue =
                stateVariables[await win.resolvePath1("x")].stateValues.value;
            expect(lastValue === 7 || lastValue === 8).be.true;
            expect(
                stateVariables[await win.resolvePath1("a")].stateValues.value,
            ).eq(lastValue);
            expect(
                stateVariables[await win.resolvePath1("a2")].stateValues.value,
            ).eq(lastValue);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(lastValue);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);

            cy.get("#a").should("have.text", `${lastValue}`);
            cy.get("#a2").should("have.text", `${lastValue}`);
        });
    });

    it("call animation actions immediate update display of animationOn", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
                    <p>value: <number name="a">1</number></p>

                    <p name="pAnOn">Animation on: $x.animationOn</p>

                    <animateFromSequence name="x" animationMode='increase' target='$a' animationInterval='1000000' />

                    <callAction target="$x" actionName="startAnimation" name="start" >
                        <label>start</label>
                    </callAction>
                    <callAction target="$x" actionName="stopAnimation" name="stop" >
                        <label>stop</label>
                    </callAction>
                    <callAction target="$x" actionName="toggleAnimation" name="toggle" >
                        <label>toggle</label>
                    </callAction>


                    `,
                },
                "*",
            );
        });

        cy.get("#a").should("have.text", "1");
        cy.get("#pAnOn").should("have.text", "Animation on: false");

        cy.get("#start_button").click();
        cy.get("#pAnOn").should("have.text", "Animation on: true");

        cy.get("#stop_button").click();
        cy.get("#pAnOn").should("have.text", "Animation on: false");

        cy.get("#toggle_button").click();
        cy.get("#pAnOn").should("have.text", "Animation on: true");

        cy.get("#toggle_button").click();
        cy.get("#pAnOn").should("have.text", "Animation on: false");
    });

    it("animate sourceIndex, array notation", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
                <p name="p1">values: <group name="grp">
                    <number name="n1">1</number>
                    <number name="n2">2</number>
                    <number name="n3">3</number>
                </group>
                </p>

                <p name="plist"><collect componentType="number" from="$grp" name="col" /></p>
                <p name="p2">
                    <number name="n1" extend="$col[1]" />
                    <number name="n2" extend="$col[2]" />
                    <number name="n3" extend="$col[3]" />
                </p>
                    
                <p>Index to animate: <mathInput prefill="1" name="ind" /></p>

                <animateFromSequence name="x" animationMode='increase' animationOn='$b' target='$col[$ind]' animationInterval='100' />

                <booleanInput name="b" />

                <p>copy: <group extend="$grp" name="c2" /></p>

                `,
                },
                "*",
            );
        });

        cy.get(cesc("#grp.n1")).should("have.text", "1");
        cy.get(cesc("#grp.n2")).should("have.text", "2");
        cy.get(cesc("#grp.n3")).should("have.text", "3");
        cy.get(cesc("#p2.n1")).should("have.text", "1");
        cy.get(cesc("#p2.n2")).should("have.text", "2");
        cy.get(cesc("#p2.n3")).should("have.text", "3");
        cy.get(cesc("#c2.n1")).should("have.text", "1");
        cy.get(cesc("#c2.n2")).should("have.text", "2");
        cy.get(cesc("#c2.n3")).should("have.text", "3");
        cy.get("#plist").should("have.text", "1, 2, 3");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues.value,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("grp.n1")].stateValues
                    .value,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("grp.n2")].stateValues
                    .value,
            ).eq(2);
            expect(
                stateVariables[await win.resolvePath1("grp.n3")].stateValues
                    .value,
            ).eq(3);
            expect(
                stateVariables[await win.resolvePath1("p2.n1")].stateValues
                    .value,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("p2.n2")].stateValues
                    .value,
            ).eq(2);
            expect(
                stateVariables[await win.resolvePath1("p2.n3")].stateValues
                    .value,
            ).eq(3);
            expect(
                stateVariables[await win.resolvePath1("c2.n1")].stateValues
                    .value,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("c2.n2")].stateValues
                    .value,
            ).eq(2);
            expect(
                stateVariables[await win.resolvePath1("c2.n3")].stateValues
                    .value,
            ).eq(3);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);
        });

        cy.get("#b").click();
        cy.get(cesc("#grp.n1")).should("have.text", "2");
        cy.get(cesc("#p2.n1")).should("have.text", "2");
        cy.get(cesc("#c2.n1")).should("have.text", "2");
        cy.get(cesc("#grp.n1")).should("have.text", "3");
        cy.get(cesc("#p2.n1")).should("have.text", "3");
        cy.get(cesc("#c2.n1")).should("have.text", "3");
        cy.get(cesc("#grp.n1")).should("have.text", "4");
        cy.get(cesc("#p2.n1")).should("have.text", "4");
        cy.get(cesc("#c2.n1")).should("have.text", "4");
        cy.get(cesc("#grp.n1")).should("have.text", "5");
        cy.get(cesc("#p2.n1")).should("have.text", "5");
        cy.get(cesc("#c2.n1")).should("have.text", "5");
        cy.get(cesc("#grp.n1")).should("have.text", "6");
        cy.get(cesc("#p2.n1")).should("have.text", "6");
        cy.get(cesc("#c2.n1")).should("have.text", "6");
        cy.get(cesc("#grp.n1")).should("have.text", "7");
        cy.get(cesc("#p2.n1")).should("have.text", "7");
        cy.get(cesc("#c2.n1")).should("have.text", "7");
        cy.get(cesc("#grp.n1")).should("have.text", "8");
        cy.get(cesc("#p2.n1")).should("have.text", "8");
        cy.get(cesc("#c2.n1")).should("have.text", "8");
        cy.get(cesc("#grp.n1")).should("have.text", "9");
        cy.get(cesc("#p2.n1")).should("have.text", "9");
        cy.get(cesc("#c2.n1")).should("have.text", "9");
        cy.get(cesc("#grp.n1")).should("have.text", "10");
        cy.get(cesc("#p2.n1")).should("have.text", "10");
        cy.get(cesc("#c2.n1")).should("have.text", "10");
        cy.get(cesc("#grp.n1")).should("have.text", "1");
        cy.get(cesc("#p2.n1")).should("have.text", "1");
        cy.get(cesc("#c2.n1")).should("have.text", "1");
        cy.get(cesc("#grp.n1")).should("have.text", "2");
        cy.get(cesc("#p2.n1")).should("have.text", "2");
        cy.get(cesc("#c2.n1")).should("have.text", "2");

        cy.get("#b").click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return (
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        // should stop at 2 or 3
        cy.get(cesc("#grp.n1")).contains(/2|3/);

        let lastValue1;

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            lastValue1 =
                stateVariables[await win.resolvePath1("x")].stateValues.value;
            expect(lastValue1 === 2 || lastValue1 === 3).be.true;

            expect(
                stateVariables[await win.resolvePath1("grp.n1")].stateValues
                    .value,
            ).eq(lastValue1);
            expect(
                stateVariables[await win.resolvePath1("grp.n2")].stateValues
                    .value,
            ).eq(2);
            expect(
                stateVariables[await win.resolvePath1("grp.n3")].stateValues
                    .value,
            ).eq(3);
            expect(
                stateVariables[await win.resolvePath1("p2.n1")].stateValues
                    .value,
            ).eq(lastValue1);
            expect(
                stateVariables[await win.resolvePath1("p2.n2")].stateValues
                    .value,
            ).eq(2);
            expect(
                stateVariables[await win.resolvePath1("p2.n3")].stateValues
                    .value,
            ).eq(3);
            expect(
                stateVariables[await win.resolvePath1("c2.n1")].stateValues
                    .value,
            ).eq(lastValue1);
            expect(
                stateVariables[await win.resolvePath1("c2.n2")].stateValues
                    .value,
            ).eq(2);
            expect(
                stateVariables[await win.resolvePath1("c2.n3")].stateValues
                    .value,
            ).eq(3);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(lastValue1);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);

            cy.get(cesc("#grp.n1")).should("have.text", `${lastValue1}`);
            cy.get(cesc("#grp.n2")).should("have.text", "2");
            cy.get(cesc("#grp.n3")).should("have.text", "3");
            cy.get(cesc("#p2.n1")).should("have.text", `${lastValue1}`);
            cy.get(cesc("#p2.n2")).should("have.text", "2");
            cy.get(cesc("#p2.n3")).should("have.text", "3");
            cy.get(cesc("#c2.n1")).should("have.text", `${lastValue1}`);
            cy.get(cesc("#c2.n2")).should("have.text", "2");
            cy.get(cesc("#c2.n3")).should("have.text", "3");
            cy.get("#plist").should("have.text", `${lastValue1}, 2, 3`);
        });

        cy.log("Animate index 2");

        cy.get("#ind" + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });

        cy.get("#b").click();
        cy.get(cesc("#grp.n2")).should("have.text", "3");
        cy.get(cesc("#p2.n2")).should("have.text", "3");
        cy.get(cesc("#c2.n2")).should("have.text", "3");
        cy.get(cesc("#grp.n2")).should("have.text", "4");
        cy.get(cesc("#p2.n2")).should("have.text", "4");
        cy.get(cesc("#c2.n2")).should("have.text", "4");
        cy.get(cesc("#grp.n2")).should("have.text", "5");
        cy.get(cesc("#p2.n2")).should("have.text", "5");
        cy.get(cesc("#c2.n2")).should("have.text", "5");
        cy.get(cesc("#grp.n2")).should("have.text", "6");
        cy.get(cesc("#p2.n2")).should("have.text", "6");
        cy.get(cesc("#c2.n2")).should("have.text", "6");
        cy.get(cesc("#grp.n2")).should("have.text", "7");
        cy.get(cesc("#p2.n2")).should("have.text", "7");
        cy.get(cesc("#c2.n2")).should("have.text", "7");
        cy.get(cesc("#grp.n2")).should("have.text", "8");
        cy.get(cesc("#p2.n2")).should("have.text", "8");
        cy.get(cesc("#c2.n2")).should("have.text", "8");

        cy.get("#b").click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return (
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        // should stop at 9 or 0
        cy.get(cesc("#grp.n2")).contains(/8|9/);

        let lastValue2;

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            lastValue2 =
                stateVariables[await win.resolvePath1("x")].stateValues.value;
            expect(lastValue2 === 8 || lastValue2 === 9).be.true;

            expect(
                stateVariables[await win.resolvePath1("grp.n1")].stateValues
                    .value,
            ).eq(lastValue1);
            expect(
                stateVariables[await win.resolvePath1("grp.n2")].stateValues
                    .value,
            ).eq(lastValue2);
            expect(
                stateVariables[await win.resolvePath1("grp.n3")].stateValues
                    .value,
            ).eq(3);
            expect(
                stateVariables[await win.resolvePath1("p2.n1")].stateValues
                    .value,
            ).eq(lastValue1);
            expect(
                stateVariables[await win.resolvePath1("p2.n2")].stateValues
                    .value,
            ).eq(lastValue2);
            expect(
                stateVariables[await win.resolvePath1("p2.n3")].stateValues
                    .value,
            ).eq(3);
            expect(
                stateVariables[await win.resolvePath1("c2.n1")].stateValues
                    .value,
            ).eq(lastValue1);
            expect(
                stateVariables[await win.resolvePath1("c2.n2")].stateValues
                    .value,
            ).eq(lastValue2);
            expect(
                stateVariables[await win.resolvePath1("c2.n3")].stateValues
                    .value,
            ).eq(3);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(lastValue2);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);

            cy.get(cesc("#grp.n1")).should("have.text", `${lastValue1}`);
            cy.get(cesc("#grp.n2")).should("have.text", `${lastValue2}`);
            cy.get(cesc("#grp.n3")).should("have.text", "3");
            cy.get(cesc("#p2.n1")).should("have.text", `${lastValue1}`);
            cy.get(cesc("#p2.n2")).should("have.text", `${lastValue2}`);
            cy.get(cesc("#p2.n3")).should("have.text", "3");
            cy.get(cesc("#c2.n1")).should("have.text", `${lastValue1}`);
            cy.get(cesc("#c2.n2")).should("have.text", `${lastValue2}`);
            cy.get(cesc("#c2.n3")).should("have.text", "3");
            cy.get("#plist").should(
                "have.text",
                `${lastValue1}, ${lastValue2}, 3`,
            );
        });

        cy.log("Switch to animate index 3 while animating");

        cy.get("#b").click();
        cy.get(cesc("#grp.n2")).should("have.text", "10");
        cy.get(cesc("#p2.n2")).should("have.text", "10");
        cy.get(cesc("#c2.n2")).should("have.text", "10");
        cy.get(cesc("#grp.n2")).should("have.text", "1");
        cy.get(cesc("#p2.n2")).should("have.text", "1");
        cy.get(cesc("#c2.n2")).should("have.text", "1");

        cy.get("#ind" + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });

        cy.get(cesc("#grp.n3")).should("have.text", "4");
        cy.get(cesc("#p2.n3")).should("have.text", "4");
        cy.get(cesc("#c2.n3")).should("have.text", "4");
        cy.get(cesc("#grp.n3")).should("have.text", "5");
        cy.get(cesc("#p2.n3")).should("have.text", "5");
        cy.get(cesc("#c2.n3")).should("have.text", "5");
        cy.get(cesc("#grp.n3")).should("have.text", "6");
        cy.get(cesc("#p2.n3")).should("have.text", "6");
        cy.get(cesc("#c2.n3")).should("have.text", "6");
        cy.get(cesc("#grp.n3")).should("have.text", "7");
        cy.get(cesc("#p2.n3")).should("have.text", "7");
        cy.get(cesc("#c2.n3")).should("have.text", "7");

        cy.get("#b").click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return (
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        // should stop at 7 or 8
        cy.get(cesc("#grp.n3")).contains(/7|8/);

        // previous should have stopped at 1 or 2
        cy.get(cesc("#grp.n2")).contains(/1|2/);

        let lastValue3;

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            lastValue3 =
                stateVariables[await win.resolvePath1("x")].stateValues.value;
            expect(lastValue3 === 7 || lastValue3 === 8).be.true;
            lastValue2 =
                stateVariables[await win.resolvePath1("grp.n2")].stateValues
                    .value;
            expect(lastValue2 === 1 || lastValue2 === 2).be.true;

            expect(
                stateVariables[await win.resolvePath1("grp.n1")].stateValues
                    .value,
            ).eq(lastValue1);
            expect(
                stateVariables[await win.resolvePath1("grp.n3")].stateValues
                    .value,
            ).eq(lastValue3);
            expect(
                stateVariables[await win.resolvePath1("p2.n1")].stateValues
                    .value,
            ).eq(lastValue1);
            expect(
                stateVariables[await win.resolvePath1("p2.n2")].stateValues
                    .value,
            ).eq(lastValue2);
            expect(
                stateVariables[await win.resolvePath1("p2.n3")].stateValues
                    .value,
            ).eq(lastValue3);
            expect(
                stateVariables[await win.resolvePath1("c2.n1")].stateValues
                    .value,
            ).eq(lastValue1);
            expect(
                stateVariables[await win.resolvePath1("c2.n2")].stateValues
                    .value,
            ).eq(lastValue2);
            expect(
                stateVariables[await win.resolvePath1("c2.n3")].stateValues
                    .value,
            ).eq(lastValue3);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(lastValue3);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);

            cy.get(cesc("#grp.n1")).should("have.text", `${lastValue1}`);
            cy.get(cesc("#grp.n2")).should("have.text", `${lastValue2}`);
            cy.get(cesc("#grp.n3")).should("have.text", `${lastValue3}`);
            cy.get(cesc("#p2.n1")).should("have.text", `${lastValue1}`);
            cy.get(cesc("#p2.n2")).should("have.text", `${lastValue2}`);
            cy.get(cesc("#p2.n3")).should("have.text", `${lastValue3}`);
            cy.get(cesc("#c2.n1")).should("have.text", `${lastValue1}`);
            cy.get(cesc("#c2.n2")).should("have.text", `${lastValue2}`);
            cy.get(cesc("#c2.n3")).should("have.text", `${lastValue3}`);
            cy.get("#plist").should(
                "have.text",
                `${lastValue1}, ${lastValue2}, ${lastValue3}`,
            );
        });
    });

    it("animate sourceIndex of group", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
                <p>values: <group name="grp">
                    <number name="n1">1</number>
                    <number name="n2">2</number>
                    <number name="n3">3</number>
                </group>
                </p>

                <p>Index to animate: <mathInput prefill="1" name="ind" /></p>

                <animateFromSequence name="x" animationMode='increase' animationOn='$b' target='$grp[$ind]' animationInterval='100' />

                <booleanInput name="b" />

                <p>copy: <group extend="$grp" name="c2" /></p>

            `,
                },
                "*",
            );
        });

        cy.get(cesc("#n1")).should("have.text", "1");
        cy.get(cesc("#n2")).should("have.text", "2");
        cy.get(cesc("#n3")).should("have.text", "3");
        cy.get(cesc("#c2.n1")).should("have.text", "1");
        cy.get(cesc("#c2.n2")).should("have.text", "2");
        cy.get(cesc("#c2.n3")).should("have.text", "3");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues.value,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("n1")].stateValues.value,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("n2")].stateValues.value,
            ).eq(2);
            expect(
                stateVariables[await win.resolvePath1("n3")].stateValues.value,
            ).eq(3);
            expect(
                stateVariables[await win.resolvePath1("c2.n1")].stateValues
                    .value,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("c2.n2")].stateValues
                    .value,
            ).eq(2);
            expect(
                stateVariables[await win.resolvePath1("c2.n3")].stateValues
                    .value,
            ).eq(3);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);
        });

        cy.get("#b").click();
        cy.get(cesc("#n1")).should("have.text", "2");
        cy.get(cesc("#c2.n1")).should("have.text", "2");
        cy.get(cesc("#n1")).should("have.text", "3");
        cy.get(cesc("#c2.n1")).should("have.text", "3");
        cy.get(cesc("#n1")).should("have.text", "4");
        cy.get(cesc("#c2.n1")).should("have.text", "4");
        cy.get(cesc("#n1")).should("have.text", "5");
        cy.get(cesc("#c2.n1")).should("have.text", "5");
        cy.get(cesc("#n1")).should("have.text", "6");
        cy.get(cesc("#c2.n1")).should("have.text", "6");
        cy.get(cesc("#n1")).should("have.text", "7");
        cy.get(cesc("#c2.n1")).should("have.text", "7");
        cy.get(cesc("#n1")).should("have.text", "8");
        cy.get(cesc("#c2.n1")).should("have.text", "8");
        cy.get(cesc("#n1")).should("have.text", "9");
        cy.get(cesc("#c2.n1")).should("have.text", "9");
        cy.get(cesc("#n1")).should("have.text", "10");
        cy.get(cesc("#c2.n1")).should("have.text", "10");
        cy.get(cesc("#n1")).should("have.text", "1");
        cy.get(cesc("#c2.n1")).should("have.text", "1");
        cy.get(cesc("#n1")).should("have.text", "2");
        cy.get(cesc("#c2.n1")).should("have.text", "2");

        cy.get("#b").click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return (
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        // should stop at 2 or 3
        cy.get(cesc("#n1")).contains(/2|3/);

        let lastValue1;

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            lastValue1 =
                stateVariables[await win.resolvePath1("x")].stateValues.value;
            expect(lastValue1 === 2 || lastValue1 === 3).be.true;

            expect(
                stateVariables[await win.resolvePath1("n1")].stateValues.value,
            ).eq(lastValue1);
            expect(
                stateVariables[await win.resolvePath1("n2")].stateValues.value,
            ).eq(2);
            expect(
                stateVariables[await win.resolvePath1("n3")].stateValues.value,
            ).eq(3);
            expect(
                stateVariables[await win.resolvePath1("c2.n1")].stateValues
                    .value,
            ).eq(lastValue1);
            expect(
                stateVariables[await win.resolvePath1("c2.n2")].stateValues
                    .value,
            ).eq(2);
            expect(
                stateVariables[await win.resolvePath1("c2.n3")].stateValues
                    .value,
            ).eq(3);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(lastValue1);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);

            cy.get(cesc("#n1")).should("have.text", `${lastValue1}`);
            cy.get(cesc("#n2")).should("have.text", "2");
            cy.get(cesc("#n3")).should("have.text", "3");
            cy.get(cesc("#c2.n1")).should("have.text", `${lastValue1}`);
            cy.get(cesc("#c2.n2")).should("have.text", "2");
            cy.get(cesc("#c2.n3")).should("have.text", "3");
        });

        cy.log("Animate index 2");

        cy.get("#ind" + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });

        cy.get("#b").click();
        cy.get(cesc("#n2")).should("have.text", "3");
        cy.get(cesc("#c2.n2")).should("have.text", "3");
        cy.get(cesc("#n2")).should("have.text", "4");
        cy.get(cesc("#c2.n2")).should("have.text", "4");
        cy.get(cesc("#n2")).should("have.text", "5");
        cy.get(cesc("#c2.n2")).should("have.text", "5");
        cy.get(cesc("#n2")).should("have.text", "6");
        cy.get(cesc("#c2.n2")).should("have.text", "6");
        cy.get(cesc("#n2")).should("have.text", "7");
        cy.get(cesc("#c2.n2")).should("have.text", "7");
        cy.get(cesc("#n2")).should("have.text", "8");
        cy.get(cesc("#c2.n2")).should("have.text", "8");

        cy.get("#b").click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return (
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        // should stop at 9 or 0
        cy.get(cesc("#n2")).contains(/8|9/);

        let lastValue2;

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            lastValue2 =
                stateVariables[await win.resolvePath1("x")].stateValues.value;
            expect(lastValue2 === 8 || lastValue2 === 9).be.true;

            expect(
                stateVariables[await win.resolvePath1("n1")].stateValues.value,
            ).eq(lastValue1);
            expect(
                stateVariables[await win.resolvePath1("n2")].stateValues.value,
            ).eq(lastValue2);
            expect(
                stateVariables[await win.resolvePath1("n3")].stateValues.value,
            ).eq(3);
            expect(
                stateVariables[await win.resolvePath1("c2.n1")].stateValues
                    .value,
            ).eq(lastValue1);
            expect(
                stateVariables[await win.resolvePath1("c2.n2")].stateValues
                    .value,
            ).eq(lastValue2);
            expect(
                stateVariables[await win.resolvePath1("c2.n3")].stateValues
                    .value,
            ).eq(3);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(lastValue2);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);

            cy.get(cesc("#n1")).should("have.text", `${lastValue1}`);
            cy.get(cesc("#n2")).should("have.text", `${lastValue2}`);
            cy.get(cesc("#n3")).should("have.text", "3");
            cy.get(cesc("#c2.n1")).should("have.text", `${lastValue1}`);
            cy.get(cesc("#c2.n2")).should("have.text", `${lastValue2}`);
            cy.get(cesc("#c2.n3")).should("have.text", "3");
        });

        cy.log("Switch to animate index 3 while animating");

        cy.get("#b").click();
        cy.get(cesc("#n2")).should("have.text", "10");
        cy.get(cesc("#c2.n2")).should("have.text", "10");
        cy.get(cesc("#n2")).should("have.text", "1");
        cy.get(cesc("#c2.n2")).should("have.text", "1");

        cy.get("#ind" + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });

        cy.get(cesc("#n3")).should("have.text", "4");
        cy.get(cesc("#c2.n3")).should("have.text", "4");
        cy.get(cesc("#n3")).should("have.text", "5");
        cy.get(cesc("#c2.n3")).should("have.text", "5");
        cy.get(cesc("#n3")).should("have.text", "6");
        cy.get(cesc("#c2.n3")).should("have.text", "6");
        cy.get(cesc("#n3")).should("have.text", "7");
        cy.get(cesc("#c2.n3")).should("have.text", "7");

        cy.get("#b").click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return (
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        // should stop at 7 or 8
        cy.get(cesc("#n3")).contains(/7|8/);

        // previous should have stopped at 1 or 2
        cy.get(cesc("#n2")).contains(/1|2/);

        let lastValue3;

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            lastValue3 =
                stateVariables[await win.resolvePath1("x")].stateValues.value;
            expect(lastValue3 === 7 || lastValue3 === 8).be.true;
            lastValue2 =
                stateVariables[await win.resolvePath1("n2")].stateValues.value;
            expect(lastValue2 === 1 || lastValue2 === 2).be.true;

            expect(
                stateVariables[await win.resolvePath1("n1")].stateValues.value,
            ).eq(lastValue1);
            expect(
                stateVariables[await win.resolvePath1("n3")].stateValues.value,
            ).eq(lastValue3);
            expect(
                stateVariables[await win.resolvePath1("c2.n1")].stateValues
                    .value,
            ).eq(lastValue1);
            expect(
                stateVariables[await win.resolvePath1("c2.n2")].stateValues
                    .value,
            ).eq(lastValue2);
            expect(
                stateVariables[await win.resolvePath1("c2.n3")].stateValues
                    .value,
            ).eq(lastValue3);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(lastValue3);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);

            cy.get(cesc("#n1")).should("have.text", `${lastValue1}`);
            cy.get(cesc("#n2")).should("have.text", `${lastValue2}`);
            cy.get(cesc("#n3")).should("have.text", `${lastValue3}`);
            cy.get(cesc("#c2.n1")).should("have.text", `${lastValue1}`);
            cy.get(cesc("#c2.n2")).should("have.text", `${lastValue2}`);
            cy.get(cesc("#c2.n3")).should("have.text", `${lastValue3}`);
        });
    });

    it("animate sourceIndex of group with target subnames", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

  <group name="grp">
    <p name="p1">Number <number name="n1">1</number> and number <number name="n2">2</number>.</p>
    <p name="p2">Just number <number name="n1">3</number>.</p>
  </group>

  <p>Index to animate: <mathInput prefill="1" name="ind" /></p>

  <animateFromSequence name="x" animationMode='increase' animationOn='$b' target='$grp[$ind].n1' animationInterval='100' />
  <animateFromSequence name="x2" animationMode='increase' animationOn='$b2' target='$grp[$ind].n2' animationInterval='100' />

  <booleanInput name="b" />
  <booleanInput name="b2" />

  <p>copy: <group extend="$grp" name="c2" /></p>

  `,
                },
                "*",
            );
        });

        cy.get(cesc("#p1.n1")).should("have.text", "1");
        cy.get(cesc("#n2")).should("have.text", "2");
        cy.get(cesc("#p2.n1")).should("have.text", "3");
        cy.get(cesc("#c2.p1.n1")).should("have.text", "1");
        cy.get(cesc("#c2.n2")).should("have.text", "2");
        cy.get(cesc("#c2.p2.n1")).should("have.text", "3");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues.value,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("p1.n1")].stateValues
                    .value,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("p1.n2")].stateValues
                    .value,
            ).eq(2);
            expect(
                stateVariables[await win.resolvePath1("p2.n1")].stateValues
                    .value,
            ).eq(3);
            expect(
                stateVariables[await win.resolvePath1("c2.p1.n1")].stateValues
                    .value,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("c2.p1.n2")].stateValues
                    .value,
            ).eq(2);
            expect(
                stateVariables[await win.resolvePath1("c2.p2.n1")].stateValues
                    .value,
            ).eq(3);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);
        });

        cy.get(cesc(`#b`)).click();
        cy.get(cesc("#p1.n1")).should("have.text", "2");
        cy.get(cesc("#c2.p1.n1")).should("have.text", "2");
        cy.get(cesc("#p1.n1")).should("have.text", "3");
        cy.get(cesc("#c2.p1.n1")).should("have.text", "3");
        cy.get(cesc("#p1.n1")).should("have.text", "4");
        cy.get(cesc("#c2.p1.n1")).should("have.text", "4");
        cy.get(cesc("#p1.n1")).should("have.text", "5");
        cy.get(cesc("#c2.p1.n1")).should("have.text", "5");
        cy.get(cesc("#p1.n1")).should("have.text", "6");
        cy.get(cesc("#c2.p1.n1")).should("have.text", "6");
        cy.get(cesc("#p1.n1")).should("have.text", "7");
        cy.get(cesc("#c2.p1.n1")).should("have.text", "7");
        cy.get(cesc("#p1.n1")).should("have.text", "8");
        cy.get(cesc("#c2.p1.n1")).should("have.text", "8");
        cy.get(cesc("#p1.n1")).should("have.text", "9");
        cy.get(cesc("#c2.p1.n1")).should("have.text", "9");
        cy.get(cesc("#p1.n1")).should("have.text", "10");
        cy.get(cesc("#c2.p1.n1")).should("have.text", "10");
        cy.get(cesc("#p1.n1")).should("have.text", "1");
        cy.get(cesc("#c2.p1.n1")).should("have.text", "1");
        cy.get(cesc("#p1.n1")).should("have.text", "2");
        cy.get(cesc("#c2.p1.n1")).should("have.text", "2");

        cy.get(cesc(`#b`)).click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return (
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        // should stop at 2 or 3
        cy.get(cesc("#p1.n1")).contains(/2|3/);

        let lastValue1;

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            lastValue1 =
                stateVariables[await win.resolvePath1("x")].stateValues.value;
            expect(lastValue1 === 2 || lastValue1 === 3).be.true;

            expect(
                stateVariables[await win.resolvePath1("p1.n1")].stateValues
                    .value,
            ).eq(lastValue1);
            expect(
                stateVariables[await win.resolvePath1("p1.n2")].stateValues
                    .value,
            ).eq(2);
            expect(
                stateVariables[await win.resolvePath1("p2.n1")].stateValues
                    .value,
            ).eq(3);
            expect(
                stateVariables[await win.resolvePath1("c2.p1.n1")].stateValues
                    .value,
            ).eq(lastValue1);
            expect(
                stateVariables[await win.resolvePath1("c2.p1.n2")].stateValues
                    .value,
            ).eq(2);
            expect(
                stateVariables[await win.resolvePath1("c2.p2.n1")].stateValues
                    .value,
            ).eq(3);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(lastValue1);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);

            cy.get(cesc("#p1.n1")).should("have.text", `${lastValue1}`);
            cy.get(cesc("#n2")).should("have.text", "2");
            cy.get(cesc("#p2.n1")).should("have.text", "3");
            cy.get(cesc("#c2.p1.n1")).should("have.text", `${lastValue1}`);
            cy.get(cesc("#c2.n2")).should("have.text", "2");
            cy.get(cesc("#c2.p2.n1")).should("have.text", "3");
        });

        cy.log("Animate second number");

        cy.get(cesc(`#b2`)).click();
        cy.get(cesc("#n2")).should("have.text", "3");
        cy.get(cesc("#c2.n2")).should("have.text", "3");
        cy.get(cesc("#n2")).should("have.text", "4");
        cy.get(cesc("#c2.n2")).should("have.text", "4");
        cy.get(cesc("#n2")).should("have.text", "5");
        cy.get(cesc("#c2.n2")).should("have.text", "5");
        cy.get(cesc("#n2")).should("have.text", "6");
        cy.get(cesc("#c2.n2")).should("have.text", "6");
        cy.get(cesc("#n2")).should("have.text", "7");
        cy.get(cesc("#c2.n2")).should("have.text", "7");
        cy.get(cesc("#n2")).should("have.text", "8");
        cy.get(cesc("#c2.n2")).should("have.text", "8");

        cy.get(cesc(`#b2`)).click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return (
                    stateVariables[await win.resolvePath1("x2")].stateValues
                        .animationOn === false
                );
            }),
        );

        // should stop at 9 or 0
        cy.get(cesc("#n2")).contains(/8|9/);

        let lastValue2;

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            lastValue2 =
                stateVariables[await win.resolvePath1("x2")].stateValues.value;
            expect(lastValue2 === 8 || lastValue2 === 9).be.true;

            expect(
                stateVariables[await win.resolvePath1("p1.n1")].stateValues
                    .value,
            ).eq(lastValue1);
            expect(
                stateVariables[await win.resolvePath1("n2")].stateValues.value,
            ).eq(lastValue2);
            expect(
                stateVariables[await win.resolvePath1("p2.n1")].stateValues
                    .value,
            ).eq(3);
            expect(
                stateVariables[await win.resolvePath1("c2.p1.n1")].stateValues
                    .value,
            ).eq(lastValue1);
            expect(
                stateVariables[await win.resolvePath1("c2.n2")].stateValues
                    .value,
            ).eq(lastValue2);
            expect(
                stateVariables[await win.resolvePath1("c2.p2.n1")].stateValues
                    .value,
            ).eq(3);
            expect(
                stateVariables[await win.resolvePath1("x2")].stateValues
                    .selectedIndex,
            ).eq(lastValue2);
            expect(
                stateVariables[await win.resolvePath1("x2")].stateValues
                    .animationOn,
            ).eq(false);

            cy.get(cesc("#p1.n1")).should("have.text", `${lastValue1}`);
            cy.get(cesc("#n2")).should("have.text", `${lastValue2}`);
            cy.get(cesc("#p2.n1")).should("have.text", "3");
            cy.get(cesc("#c2.p1.n1")).should("have.text", `${lastValue1}`);
            cy.get(cesc("#c2.n2")).should("have.text", `${lastValue2}`);
            cy.get(cesc("#c2.p2.n1")).should("have.text", "3");
        });

        cy.log("Animate index 2");

        cy.get("#ind" + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });

        cy.get(cesc(`#b`)).click();
        cy.get(cesc("#p2.n1")).should("have.text", "4");
        cy.get(cesc("#c2.p2.n1")).should("have.text", "4");
        cy.get(cesc("#p2.n1")).should("have.text", "5");
        cy.get(cesc("#c2.p2.n1")).should("have.text", "5");
        cy.get(cesc("#p2.n1")).should("have.text", "6");
        cy.get(cesc("#c2.p2.n1")).should("have.text", "6");
        cy.get(cesc("#p2.n1")).should("have.text", "7");
        cy.get(cesc("#c2.p2.n1")).should("have.text", "7");

        cy.get(cesc(`#b`)).click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return (
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        // should stop at 7 or 8
        cy.get(cesc("#p2.n1")).contains(/7|8/);

        let lastValue3;

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            lastValue3 =
                stateVariables[await win.resolvePath1("x")].stateValues.value;
            expect(lastValue3 === 7 || lastValue3 === 8).be.true;

            expect(
                stateVariables[await win.resolvePath1("p1.n1")].stateValues
                    .value,
            ).eq(lastValue1);
            expect(
                stateVariables[await win.resolvePath1("n2")].stateValues.value,
            ).eq(lastValue2);
            expect(
                stateVariables[await win.resolvePath1("p2.n1")].stateValues
                    .value,
            ).eq(lastValue3);
            expect(
                stateVariables[await win.resolvePath1("c2.p1.n1")].stateValues
                    .value,
            ).eq(lastValue1);
            expect(
                stateVariables[await win.resolvePath1("c2.n2")].stateValues
                    .value,
            ).eq(lastValue2);
            expect(
                stateVariables[await win.resolvePath1("c2.p2.n1")].stateValues
                    .value,
            ).eq(lastValue3);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(lastValue3);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);

            cy.get(cesc("#p1.n1")).should("have.text", `${lastValue1}`);
            cy.get(cesc("#n2")).should("have.text", `${lastValue2}`);
            cy.get(cesc("#p2.n1")).should("have.text", `${lastValue3}`);
            cy.get(cesc("#c2.p1.n1")).should("have.text", `${lastValue1}`);
            cy.get(cesc("#c2.n2")).should("have.text", `${lastValue2}`);
            cy.get(cesc("#c2.p2.n1")).should("have.text", `${lastValue3}`);
        });
    });

    it("animate propIndex, array notation", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

  <p name="p1"><point name="A">(1, 2, 3)</point></p>
    
  <p>Component to animate: <mathInput prefill="1" name="ind" /></p>

  <animateFromSequence name="x" animationMode='increase' animationOn='$b' target='$A.xs[$ind]' animationInterval='100' />

  <booleanInput name="b" />

  <p name="p2"><point extend="$A" name="A2" /></p>

  <p><math extend="$A.x3" name="x3" /></p>

  `,
                },
                "*",
            );
        });

        cy.get("#p1").should("have.text", "(1,2,3)");
        cy.get("#p2").should("have.text", "(1,2,3)");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues.value,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("A")].stateValues.xs,
            ).eqls([1, 2, 3]);
            expect(
                stateVariables[await win.resolvePath1("A2")].stateValues.xs,
            ).eqls([1, 2, 3]);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);
        });

        cy.get("#b").click();
        cy.get("#p1").should("have.text", "(2,2,3)");
        cy.get("#p2").should("have.text", "(2,2,3)");
        cy.get("#p1").should("have.text", "(3,2,3)");
        cy.get("#p2").should("have.text", "(3,2,3)");
        cy.get("#p1").should("have.text", "(4,2,3)");
        cy.get("#p2").should("have.text", "(4,2,3)");
        cy.get("#p1").should("have.text", "(5,2,3)");
        cy.get("#p2").should("have.text", "(5,2,3)");

        cy.get("#b").click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return (
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        let lastValue1;

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            lastValue1 =
                stateVariables[await win.resolvePath1("x")].stateValues.value;
            expect(lastValue1 === 5 || lastValue1 === 6).be.true;

            expect(
                stateVariables[await win.resolvePath1("A")].stateValues.xs,
            ).eqls([lastValue1, 2, 3]);
            expect(
                stateVariables[await win.resolvePath1("A2")].stateValues.xs,
            ).eqls([lastValue1, 2, 3]);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(lastValue1);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);

            cy.get("#p1").should("have.text", `(${lastValue1},2,3)`);
            cy.get("#p2").should("have.text", `(${lastValue1},2,3)`);
        });

        cy.log("Animate index 2");

        cy.get("#ind" + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });

        cy.get("#b")
            .click()
            .then(() => {
                cy.get("#p1").should("have.text", `(${lastValue1},3,3)`);
                cy.get("#p2").should("have.text", `(${lastValue1},3,3)`);
                cy.get("#p1").should("have.text", `(${lastValue1},4,3)`);
                cy.get("#p2").should("have.text", `(${lastValue1},4,3)`);
                cy.get("#p1").should("have.text", `(${lastValue1},5,3)`);
                cy.get("#p2").should("have.text", `(${lastValue1},5,3)`);
                cy.get("#p1").should("have.text", `(${lastValue1},6,3)`);
                cy.get("#p2").should("have.text", `(${lastValue1},6,3)`);
                cy.get("#p1").should("have.text", `(${lastValue1},7,3)`);
                cy.get("#p2").should("have.text", `(${lastValue1},7,3)`);
            });

        cy.get("#b").click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return (
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        let lastValue2;

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            lastValue2 =
                stateVariables[await win.resolvePath1("x")].stateValues.value;
            expect(lastValue2 === 7 || lastValue2 === 8).be.true;

            expect(
                stateVariables[await win.resolvePath1("A")].stateValues.xs,
            ).eqls([lastValue1, lastValue2, 3]);
            expect(
                stateVariables[await win.resolvePath1("A2")].stateValues.xs,
            ).eqls([lastValue1, lastValue2, 3]);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(lastValue2);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);

            cy.get("#p1").should(
                "have.text",
                `(${lastValue1},${lastValue2},3)`,
            );
            cy.get("#p2").should(
                "have.text",
                `(${lastValue1},${lastValue2},3)`,
            );
        });

        cy.log("Switch to animate index 3 while animating");

        cy.get("#b")
            .click()
            .then(() => {
                cy.get("#p1").should("have.text", `(${lastValue1},9,3)`);
                cy.get("#p2").should("have.text", `(${lastValue1},9,3)`);
                cy.get("#p1").should("have.text", `(${lastValue1},10,3)`);
                cy.get("#p2").should("have.text", `(${lastValue1},10,3)`);
                cy.get("#p1").should("have.text", `(${lastValue1},1,3)`);
                cy.get("#p2").should("have.text", `(${lastValue1},1,3)`);
            });

        cy.get("#ind" + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });

        cy.get("#x3").should("have.text", "4");
        cy.get("#x3").should("have.text", "5");
        cy.get("#x3").should("have.text", "6");
        cy.get("#x3").should("have.text", "7");

        cy.get("#b").click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return (
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        let lastValue3;

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            lastValue3 =
                stateVariables[await win.resolvePath1("x")].stateValues.value;
            expect(lastValue3 === 7 || lastValue3 === 8).be.true;
            lastValue2 =
                stateVariables[await win.resolvePath1("A")].stateValues.xs[1];
            expect(lastValue2 === 1 || lastValue2 === 2).be.true;

            expect(
                stateVariables[await win.resolvePath1("A")].stateValues.xs,
            ).eqls([lastValue1, lastValue2, lastValue3]);
            expect(
                stateVariables[await win.resolvePath1("A2")].stateValues.xs,
            ).eqls([lastValue1, lastValue2, lastValue3]);

            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(lastValue3);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);

            cy.get("#p1").should(
                "have.text",
                `(${lastValue1},${lastValue2},${lastValue3})`,
            );
            cy.get("#p2").should(
                "have.text",
                `(${lastValue1},${lastValue2},${lastValue3})`,
            );
        });
    });

    it("animate property of property", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

  <graph>
    <polygon vertices="(1,7) (2,5) (3,9)" name="pg" />
  </graph>

  <p name="p1"><numberList name="nl">$pg.vertices[1].x $pg.vertices[2].x $pg.vertices[3].x</numberList></p>
    
  <p>Component to animate: <mathInput prefill="1" name="ind" /></p>

  <animateFromSequence name="x" animationMode='increase' animationOn='$b' target='$pg.vertices[$ind].x' animationInterval='100' />

  <booleanInput name="b" />

  <p name="p2"><numberList extend="$nl" name="nl2" /></p>

  <p><number extend="$nl[3]" name="n3" /></p>

  `,
                },
                "*",
            );
        });

        cy.get("#p1").should("have.text", "1, 2, 3");
        cy.get("#p2").should("have.text", "1, 2, 3");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues.value,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("nl")].stateValues
                    .numbers,
            ).eqls([1, 2, 3]);
            expect(
                stateVariables[await win.resolvePath1("nl2")].stateValues
                    .numbers,
            ).eqls([1, 2, 3]);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(1);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);
        });

        cy.get("#b").click();
        cy.get("#p1").should("have.text", "2, 2, 3");
        cy.get("#p2").should("have.text", "2, 2, 3");
        cy.get("#p1").should("have.text", "3, 2, 3");
        cy.get("#p2").should("have.text", "3, 2, 3");
        cy.get("#p1").should("have.text", "4, 2, 3");
        cy.get("#p2").should("have.text", "4, 2, 3");
        cy.get("#p1").should("have.text", "5, 2, 3");
        cy.get("#p2").should("have.text", "5, 2, 3");

        cy.get("#b").click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return (
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        let lastValue1;

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            lastValue1 =
                stateVariables[await win.resolvePath1("x")].stateValues.value;
            expect(lastValue1 === 5 || lastValue1 === 6).be.true;

            expect(
                stateVariables[await win.resolvePath1("nl")].stateValues
                    .numbers,
            ).eqls([lastValue1, 2, 3]);
            expect(
                stateVariables[await win.resolvePath1("nl2")].stateValues
                    .numbers,
            ).eqls([lastValue1, 2, 3]);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(lastValue1);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);

            cy.get("#p1").should("have.text", `${lastValue1}, 2, 3`);
            cy.get("#p2").should("have.text", `${lastValue1}, 2, 3`);
        });

        cy.log("Animate index 2");

        cy.get("#ind" + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });

        cy.get("#b")
            .click()
            .then(() => {
                cy.get("#p1").should("have.text", `${lastValue1}, 3, 3`);
                cy.get("#p2").should("have.text", `${lastValue1}, 3, 3`);
                cy.get("#p1").should("have.text", `${lastValue1}, 4, 3`);
                cy.get("#p2").should("have.text", `${lastValue1}, 4, 3`);
                cy.get("#p1").should("have.text", `${lastValue1}, 5, 3`);
                cy.get("#p2").should("have.text", `${lastValue1}, 5, 3`);
                cy.get("#p1").should("have.text", `${lastValue1}, 6, 3`);
                cy.get("#p2").should("have.text", `${lastValue1}, 6, 3`);
                cy.get("#p1").should("have.text", `${lastValue1}, 7, 3`);
                cy.get("#p2").should("have.text", `${lastValue1}, 7, 3`);
            });

        cy.get("#b").click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return (
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        let lastValue2;

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            lastValue2 =
                stateVariables[await win.resolvePath1("x")].stateValues.value;
            expect(lastValue2 === 7 || lastValue2 === 8).be.true;

            expect(
                stateVariables[await win.resolvePath1("nl")].stateValues
                    .numbers,
            ).eqls([lastValue1, lastValue2, 3]);
            expect(
                stateVariables[await win.resolvePath1("nl2")].stateValues
                    .numbers,
            ).eqls([lastValue1, lastValue2, 3]);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(lastValue2);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);

            cy.get("#p1").should(
                "have.text",
                `${lastValue1}, ${lastValue2}, 3`,
            );
            cy.get("#p2").should(
                "have.text",
                `${lastValue1}, ${lastValue2}, 3`,
            );
        });

        cy.log("Switch to animate index 3 while animating");

        cy.get("#b")
            .click()
            .then(() => {
                cy.get("#p1").should("have.text", `${lastValue1}, 9, 3`);
                cy.get("#p2").should("have.text", `${lastValue1}, 9, 3`);
                cy.get("#p1").should("have.text", `${lastValue1}, 10, 3`);
                cy.get("#p2").should("have.text", `${lastValue1}, 10, 3`);
                cy.get("#p1").should("have.text", `${lastValue1}, 1, 3`);
                cy.get("#p2").should("have.text", `${lastValue1}, 1, 3`);
            });

        cy.get("#ind" + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });

        cy.get(cesc("#nl2:3")).should("have.text", "4");
        cy.get(cesc("#nl2:3")).should("have.text", "5");
        cy.get(cesc("#nl2:3")).should("have.text", "6");
        cy.get(cesc("#nl2:3")).should("have.text", "7");

        cy.get("#b").click();

        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return (
                    stateVariables[await win.resolvePath1("x")].stateValues
                        .animationOn === false
                );
            }),
        );

        let lastValue3;

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            lastValue3 =
                stateVariables[await win.resolvePath1("x")].stateValues.value;
            expect(lastValue3 === 7 || lastValue3 === 8).be.true;
            lastValue2 =
                stateVariables[await win.resolvePath1("nl")].stateValues
                    .numbers[1];
            expect(lastValue2 === 1 || lastValue2 === 2).be.true;

            expect(
                stateVariables[await win.resolvePath1("nl")].stateValues
                    .numbers,
            ).eqls([lastValue1, lastValue2, lastValue3]);
            expect(
                stateVariables[await win.resolvePath1("nl2")].stateValues
                    .numbers,
            ).eqls([lastValue1, lastValue2, lastValue3]);

            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .selectedIndex,
            ).eq(lastValue3);
            expect(
                stateVariables[await win.resolvePath1("x")].stateValues
                    .animationOn,
            ).eq(false);

            cy.get("#p1").should(
                "have.text",
                `${lastValue1}, ${lastValue2}, ${lastValue3}`,
            );
            cy.get("#p2").should(
                "have.text",
                `${lastValue1}, ${lastValue2}, ${lastValue3}`,
            );
        });
    });

    it("animate warnings with invalid targets", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <number name="n">1</number>
  <p name="p">1</p>
  <line name="l" through="(1,2) (3,4)" />
  <animateFromSequence target='$n.invalid' animationOn="true" />
  <animateFromSequence target='$p' animationOn="true" />
  <animateFromSequence target='$l.points[1].bad' animationOn="true" />
  <booleanInput name="bi" description="check core" /><boolean extend="$bi" name="b" />
  `,
                },
                "*",
            );
        });

        cy.log("make sure core has responded");
        cy.get("#b").should("have.text", "false");
        cy.get("#bi").click();
        cy.get("#b").should("have.text", "true");

        cy.window().then(async (win) => {
            let errorWarnings = win.returnErrorWarnings1();

            expect(errorWarnings.errors.length).eq(0);
            expect(errorWarnings.warnings.length).eq(3);

            expect(errorWarnings.warnings[0].message).contain(
                'Invalid target for <animateFromSequence>: cannot find a state variable named "invalid" on a <number>',
            );
            expect(errorWarnings.warnings[0].position.start.line).eq(5);
            expect(errorWarnings.warnings[0].position.start.column).eq(3);
            expect(errorWarnings.warnings[0].position.end.line).eq(5);
            expect(errorWarnings.warnings[0].position.end.column).eq(65);

            expect(errorWarnings.warnings[1].message).contain(
                'Invalid target for <animateFromSequence>: cannot find a state variable named "value" on a <p>',
            );
            expect(errorWarnings.warnings[1].position.start.line).eq(6);
            expect(errorWarnings.warnings[1].position.start.column).eq(3);
            expect(errorWarnings.warnings[1].position.end.line).eq(6);
            expect(errorWarnings.warnings[1].position.end.column).eq(57);

            expect(errorWarnings.warnings[2].message).contain(
                "Invalid target for <animateFromSequence>: cannot find target",
            );
            expect(errorWarnings.warnings[2].position.start.line).eq(7);
            expect(errorWarnings.warnings[2].position.start.column).eq(3);
            expect(errorWarnings.warnings[2].position.end.line).eq(7);
            expect(errorWarnings.warnings[2].position.end.column).eq(71);
        });
    });

    it("animation stops when triggered by its own variable", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <number name="t">1</number>
  <animateFromSequence name="timeAnimation" target="$t" from="1" to="100" 
  animationMode="increase once" animationInterval='100'/>

  <updateValue name="start" target="$timeAnimation.animationOn"
   newValue="true" type="boolean" ><label>Start</label></updateValue>

  <updateValue triggerWhen="$t > 2" target="$timeAnimation.animationOn"
   newValue="false" type="boolean" />

  <boolean name="isOn" extend="$timeAnimation.animationOn" />


  `,
                },
                "*",
            );
        });

        cy.get("#isOn").should("have.text", "false");
        cy.get("#start").click();

        cy.get("#isOn").should("have.text", "true");
        cy.get("#t").should("have.text", "1");
        cy.get("#t").should("have.text", "2");
        cy.get("#t").should("have.text", "3");
        cy.get("#isOn").should("have.text", "false");

        cy.wait(500);

        cy.get("#t").should("have.text", "3");
        cy.get("#isOn").should("have.text", "false");
    });

    it("animate number adapted to math", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `

  <p>value: <math name="a"><number>1</number></math></p>

  <animateFromSequence name="x" animationMode='increase once' animationOn='$b' target='$a' from="1" to="3" animationInterval='100' />

  <booleanInput name="b" />
  
  <p>copy: <number extend="$a" name="a2" /></p>

  `,
                },
                "*",
            );
        });

        cy.get("#a").should("have.text", "1");
        cy.get("#a2").should("have.text", "1");

        cy.get("#b").click();
        cy.get("#a").should("have.text", "2");
        cy.get("#a2").should("have.text", "2");
        cy.get("#a").should("have.text", "3");
        cy.get("#a2").should("have.text", "3");
    });
});
