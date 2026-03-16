import { cesc } from "@doenet/utils";
import {
    installPrefigureBuildIntercept,
    postDebounceTestDoenetML,
    waitPastDebounceWindow,
} from "../../support/prefigure";

describe("PreFigure sanitization guards @group4", { tags: ["@group4"] }, () => {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("sanitizes unsafe SVG and annotation markup from build response", () => {
        installPrefigureBuildIntercept(() => ({
            svg: `<svg xmlns="http://www.w3.org/2000/svg" onload="alert('xss')" style="background:url(javascript:alert(1))"><script>alert('bad')</script><foreignObject><div>bad</div></foreignObject><a xlink:href="javascript:alert(2)"><text>unsafe-link</text></a><text id="ok-svg">safe-svg</text></svg>`,
            annotationsXml: `<?xml version="1.0"?><annotations onclick="alert('xss')" style="color:red"><annotation href="javascript:alert(3)" style="color:blue" onclick="alert(4)">safe-cml</annotation></annotations>`,
        }));

        postDebounceTestDoenetML(cesc);
        waitPastDebounceWindow();

        cy.get(cesc("#prefig")).find(".svg").should("contain.text", "safe-svg");
        cy.get(cesc("#prefig"))
            .find(".svg [xlink\\:href^='javascript:']")
            .should("not.exist");
        cy.get(cesc("#prefig"))
            .find(".svg")
            .invoke("html")
            .then((html) => {
                expect(html).not.to.include("<script>alert('bad')</script>");
                expect(html).not.to.include("<foreignObject>");
                expect(html).not.to.include("alert('xss')");
                expect(html).not.to.include("javascript:alert(2)");
            });

        cy.get(cesc("#prefig")).find(".cml [onclick]").should("not.exist");
        cy.get(cesc("#prefig")).find(".cml [style]").should("not.exist");
        cy.get(cesc("#prefig"))
            .find(".cml [href^='javascript:']")
            .should("not.exist");
        cy.get(cesc("#prefig"))
            .find(".cml")
            .invoke("html")
            .then((html) => {
                expect(html).not.to.include("onclick=");
                expect(html).not.to.include("style=");
                expect(html).not.to.include("javascript:alert(3)");
                expect(html).not.to.include("alert(4)");
            });
    });

    it("preserves axis tick labels emitted through local <use> references", () => {
        installPrefigureBuildIntercept(() => ({
            svg: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><g id="tick-label-neg1"><text>-1</text></g><g id="tick-label-zero"><text>0</text></g><g id="tick-label-pos1"><text>1</text></g></defs><g class="axis-ticks"><use xlink:href="#tick-label-neg1"/><use href="#tick-label-zero"/><use xlink:href="#tick-label-pos1"/></g></svg>`,
            annotationsXml: "<annotations></annotations>",
        }));

        postDebounceTestDoenetML(cesc);
        waitPastDebounceWindow();

        cy.get(cesc("#prefig")).find(".svg").should("contain.text", "-1");
        cy.get(cesc("#prefig")).find(".svg").should("contain.text", "0");
        cy.get(cesc("#prefig")).find(".svg").should("contain.text", "1");
    });

    it("preserves math-like point label content emitted through local <use> references", () => {
        installPrefigureBuildIntercept(() => ({
            svg: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><g id="point-label-math"><text>x_1 + y^2</text></g></defs><g class="point-label"><use href="#point-label-math"/></g></svg>`,
            annotationsXml: "<annotations></annotations>",
        }));

        postDebounceTestDoenetML(cesc);
        waitPastDebounceWindow();

        cy.get(cesc("#prefig"))
            .find(".svg")
            .should("contain.text", "x_1 + y^2");
        cy.get(cesc("#prefig"))
            .find(".svg use[href='#point-label-math']")
            .should("exist");
    });

    it("strips external <use> references", () => {
        installPrefigureBuildIntercept(() => ({
            svg: `<svg xmlns="http://www.w3.org/2000/svg"><defs><g id="local-label"><text>local-label</text></g></defs><g><use href="#local-label"/><use href="https://evil.example/external.svg#label"/></g></svg>`,
            annotationsXml: "<annotations></annotations>",
        }));

        postDebounceTestDoenetML(cesc);
        waitPastDebounceWindow();

        // Expected policy: only fragment-local <use> targets should survive sanitization.
        cy.get(cesc("#prefig"))
            .find(".svg")
            .should("contain.text", "local-label");
        cy.get(cesc("#prefig"))
            .find(
                ".svg use[href^='https://'], .svg use[xlink\\:href^='https://']",
            )
            .should("not.exist");
    });
});
