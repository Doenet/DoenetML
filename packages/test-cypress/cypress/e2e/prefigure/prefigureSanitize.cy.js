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
            xml: `<?xml version="1.0"?><annotations onclick="alert('xss')" style="color:red"><annotation href="javascript:alert(3)" style="color:blue" onclick="alert(4)">safe-cml</annotation></annotations>`,
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
});
