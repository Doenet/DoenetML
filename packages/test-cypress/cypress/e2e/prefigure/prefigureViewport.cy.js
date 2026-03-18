import { cesc } from "@doenet/utils";
import {
    installPrefigureBuildIntercept,
    postDebounceTestDoenetML,
    waitPastDebounceWindow,
} from "../../support/prefigure";

describe(
    "PreFigure responsive SVG viewport normalization @group4",
    { tags: ["@group4"] },
    () => {
        beforeEach(() => {
            cy.clearIndexedDB();
            cy.visit("/");
        });

        it("derives a viewBox and scales fixed-size SVG output to a narrow container", () => {
            installPrefigureBuildIntercept(() => ({
                svg: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect id="outer-frame" x="0" y="0" width="400" height="200" fill="none" stroke="black" stroke-width="4"/><rect id="content-box" x="120" y="50" width="160" height="100" fill="tomato"/></svg>`,
                annotationsXml: "<annotations></annotations>",
            }));

            postDebounceTestDoenetML(cesc);
            waitPastDebounceWindow();

            cy.get(cesc("#prefig"))
                .find(".svg")
                .as("svgWrapper")
                .invoke("css", "width", "120px")
                .invoke("css", "height", "60px")
                .invoke("css", "overflow", "hidden");

            cy.get("@svgWrapper").find("svg").as("svgRoot");

            cy.get("@svgRoot")
                .should("have.attr", "viewBox", "0 0 400 200")
                .and("have.attr", "width", "100%")
                .and("have.attr", "height", "100%")
                .and("have.attr", "preserveAspectRatio", "xMidYMid meet");

            cy.get("@svgWrapper").then(($wrapper) => {
                const wrapperRect = $wrapper[0].getBoundingClientRect();

                cy.get("@svgRoot").then(($svg) => {
                    const svgRect = $svg[0].getBoundingClientRect();

                    expect(svgRect.width).to.be.closeTo(wrapperRect.width, 1);
                    expect(svgRect.height).to.be.closeTo(wrapperRect.height, 1);

                    cy.get("@svgRoot")
                        .find("#outer-frame")
                        .then(($frame) => {
                            const frameRect = $frame[0].getBoundingClientRect();

                            expect(frameRect.left).to.be.gte(svgRect.left - 1);
                            expect(frameRect.top).to.be.gte(svgRect.top - 1);
                            expect(frameRect.right).to.be.lte(
                                svgRect.right + 1,
                            );
                            expect(frameRect.bottom).to.be.lte(
                                svgRect.bottom + 1,
                            );
                        });
                });
            });
        });
    },
);
