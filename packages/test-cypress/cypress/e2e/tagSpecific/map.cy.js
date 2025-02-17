import { cesc2 } from "@doenet/utils";

describe("Map Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("map will not display as list if has block components", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
      <text>a</text>
      <map asList>
        <template>
          <p>Hello $v</p>
        </template>
        <sources alias="v"><sequence to="3" /></sources>
      </map>

    `,
                },
                "*",
            );
        });

        cy.get(cesc2("#/_document1")).should("contain.text", "Hello 1");
        cy.get(cesc2("#/_document1")).should("contain.text", "Hello 2");
        cy.get(cesc2("#/_document1")).should("contain.text", "Hello 3");
        cy.get(cesc2("#/_document1")).should("not.contain.text", ",");
    });
});
