import { cesc } from "@doenet/utils";
import {
    installPrefigureBuildIntercept,
    waitPastDebounceWindow,
} from "../../support/prefigure";

describe(
    "PreFigure diagcess singleton loader @group4",
    { tags: ["@group4"] },
    () => {
        const diagcessScriptSelector = 'script[src*="diagcess"]';

        beforeEach(() => {
            cy.clearIndexedDB();
            cy.visit("/");
        });

        it("keeps one shared diagcess script across mount/unmount cycles", () => {
            installPrefigureBuildIntercept();

            cy.window().then((win) => {
                win.postMessage(
                    {
                        doenetML: `
<text name="ready">ready</text>
<graph name="g1" renderer="prefigure">
  <point>(0,0)</point>
</graph>
<graph name="g2" renderer="prefigure">
  <point>(1,1)</point>
</graph>
`,
                    },
                    "*",
                );
            });

            cy.get(cesc("#ready")).should("have.text", "ready");
            waitPastDebounceWindow();

            cy.get(diagcessScriptSelector).should("have.length", 1);

            cy.window().then((win) => {
                win.postMessage(
                    {
                        doenetML: `
<text name="ready">ready</text>
<graph name="g1" renderer="prefigure">
  <point>(0,0)</point>
</graph>
`,
                    },
                    "*",
                );
            });

            cy.get(cesc("#ready")).should("have.text", "ready");
            waitPastDebounceWindow();

            cy.get(diagcessScriptSelector).should("have.length", 1);

            cy.window().then((win) => {
                win.postMessage(
                    {
                        doenetML: `
<text name="ready">ready</text>
<graph name="g" >
  <point>(0,0)</point>
</graph>
`,
                    },
                    "*",
                );
            });

            cy.get(cesc("#ready")).should("have.text", "ready");
            cy.wait(300);

            // Script remains in place after all PreFigure instances unmount.
            cy.get(diagcessScriptSelector).should("have.length", 1);
        });
    },
);
