import me from "math-expressions";
import { cesc, cesc2 } from "@doenet/utils";

describe("Point Tag Tests 2", function () {
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
    <map name="mp">
      <template>
        <point fixed>$A
          <conditionalContent>
            <case condition="$i=1">$P0</case>
            <else>$mp[$i-1]</else>
          </conditionalContent>
        </point>
      </template>
      <sources indexAlias="i"><sequence length="20" /></sources>
    </map>
  </graph>
  <point copySource="P0" name="P0a" />
    `,
                },
                "*",
            );
        });

        cy.get(cesc2("#/P0a")).should("have.text", "(3,4)");

        cy.log("move point using skippable actions to upper right");
        let promises = [];
        for (let i = 0; i < 100; i++) {
            cy.window().then(async (win) => {
                let x = i * 0.1;
                let y = i * 0.1;

                promises.push(
                    win.callAction1({
                        actionName: "movePoint",
                        componentName: "/P0",
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

        cy.get(cesc2("#/P0a")).should("have.text", "(9.9,9.9)");

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
                        componentName: "/P0",
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

        cy.get(cesc2("#/P0a")).should("have.text", "(−9.9,9.9)");
    });
});
