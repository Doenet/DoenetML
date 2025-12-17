import me from "math-expressions";
import { cesc } from "@doenet/utils";

describe("Point Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("skip actions when drag slow point", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <number name="theta">pi/10</number>
  <matrix name="A">
    <row><number>0.9cos($theta)</number> <number>-0.9sin($theta)</number></row>
    <row><number>0.9sin($theta)</number> <number>0.9cos($theta)</number></row>
  </matrix>
  
  <graph>
    <point name="P0" styleNumber="2">(3,4)</point>
    <repeatForSequence name="mp" length="20" indexName="i">
        <point fixed>$A
            <conditionalContent>
            <case condition="$i=1">$P0</case>
            <else>$mp[$i-1]</else>
            </conditionalContent>
        </point>
    </repeatForSequence>
  </graph>
  <point extend="$P0" name="P0a" />
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#P0a")).should("have.text", "(3,4)");

        cy.log("move point using skippable actions to upper right");
        let promises = [];

        let p0Idx;
        cy.window().then(async (win) => {
            p0Idx = await win.resolvePath1("P0");
        });

        for (let i = 0; i < 100; i++) {
            cy.window().then(async (win) => {
                let x = i * 0.1;
                let y = i * 0.1;

                promises.push(
                    win.callAction1({
                        actionName: "movePoint",
                        componentIdx: p0Idx,
                        args: { x, y, skippable: true },
                    }),
                );
            });
            cy.wait(10);
        }

        cy.log("most of the actions, except first and last, were skipped");
        cy.window().then(async (win) => {
            Promise.all(promises).then((values) => {
                expect(values.length).eq(100);
                expect(values[0]).eq(true);
                expect(values[99]).eq(true);
                expect(values.slice(1, 99).filter((x) => x).length)
                    .greaterThan(1)
                    .lessThan(50);
            });
        });

        cy.get(cesc("#P0a")).should("have.text", "(9.9,9.9)");

        cy.log(
            "move point using skippable and non-skippable actions to upper left",
        );
        let promises2 = [];
        for (let i = 0; i < 100; i++) {
            cy.window().then(async (win) => {
                let x = -i * 0.1;
                let y = i * 0.1;

                promises2.push(
                    win.callAction1({
                        actionName: "movePoint",
                        componentIdx: p0Idx,
                        args: { x, y, skippable: i % 10 !== 5 },
                    }),
                );
            });
            cy.wait(10);
        }

        cy.log(
            "most of the skippable but none of the non-skippable actions were skipped",
        );
        cy.window().then(async (win) => {
            Promise.all(promises2).then((values) => {
                expect(values.length).eq(100);
                expect(values[0]).eq(true);
                expect(values[99]).eq(true);

                // None of the non-skippable actions were skipped
                expect(values.filter((x, i) => i % 10 == 5).every((x) => x)).eq(
                    true,
                );

                expect(values.slice(1, 99).filter((x) => x).length)
                    .greaterThan(9)
                    .lessThan(50);
            });
        });

        cy.get(cesc("#P0a")).should("have.text", "(−9.9,9.9)");
    });

    it("restore state with point coords depending on function", () => {
        // Note: this test makes sure that the essential state and string children
        // are restored for a case where the coords attribute depends on a function
        let doenetML = `
    <function name="five">5</function>
    <graph> 
        <point name="P" coords="(0,$$five(0))" />
    </graph>
    <p name="p">$P</p>
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

        cy.get("#p").should("contain.text", "(0,5)");

        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("P"),
                args: { x: 3, y: 9 },
            });
        });

        cy.get("#p").should("contain.text", "(3,5)");

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

        cy.get("#p").should("contain.text", "(3,5)");
    });
});
