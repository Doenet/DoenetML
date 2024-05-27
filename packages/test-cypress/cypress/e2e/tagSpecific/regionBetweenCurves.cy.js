import { cesc2 } from "@doenet/utils";

describe("RegionBetweenCurves Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("region between two curves", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
    <function name="f1">sin(x)</function>
    <function name="f2">cos(x)</function>
    <regionBetweenCurves name="r" boundaryValues="-3 5">$f1 $f2</regionBetweenCurves>
  </graph>

  <graph name="g2" newNamespace>
    $(../g1/r{name="r"})
  </graph>

  $g2{name="g3"}


  `,
                },
                "*",
            );
        });

        cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait for page to load

        // Not sure what to test until can test jsxgraph output
    });

    it("region between two curves, flipped", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <text>a</text>
  <graph name="g1" newNamespace>
    <curve flipFunction><function name="f1">sin(x)</function></curve>
    <curve flipFunction><function name="f2">cos(x)</function></curve>
    <regionBetweenCurves name="r" boundaryValues="-3 5" flipFunctions>$f1 $f2</regionBetweenCurves>
  </graph>

  <graph name="g2" newNamespace>
    $(../g1/r{name="r"})
  </graph>

  $g2{name="g3"}


  `,
                },
                "*",
            );
        });

        cy.get(cesc2("#/_text1")).should("have.text", "a"); // to wait for page to load

        // Not sure what to test until can test jsxgraph output
    });
});
