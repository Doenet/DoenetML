import { cesc } from "@doenet/utils";
import { toMathJaxString } from "../../../src/util/mathDisplay";

describe("Render commas tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("");
        cy.injectAxe();
    });

    it("Virtual keyboard passes accessibility tests", () => {
        // Makes sure keyboard passes basic tests, like color contrast
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
<p name="p">Hello!</p>
  `,
                },
                "*",
            );
        });

        cy.get("#p").should("contain.text", "Hello!");

        cy.checkAccessibility(null, {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("Sections", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
                    <title name="title">This document</title>
                    <section>
                        <title>My first section</title>

                        <p>A paragraph</p>

                        <section>

                            <p>No title in this sub-section.</p>
                        </section>

                        <section>
                            <title>Another sub-section</title>

                            <section>
                                <title>Next further</title>

                                Hello from here, no paragraph.

                            </section>

                            <section>
                                <p>This sub-sub-section has no title</p>
                            </section>

                            <p>Extra text in sub-section</p>
                        </section>

                        End for first section
                    </section>

                    <section>
                        <span>One more thing</span>
                    </section>

                    <div>Bye</div>
  `,
                },
                "*",
            );
        });

        cy.get("#title").should("contain.text", "This document");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("Lists", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
                    <ol>
                        <li>apple</li>
                        <li><p>banana</p></li>
                        <li><ul>
                            <li>alpha</li>
                            <li>beta</li>
                            <li><ol>
                                <li><p>one</p></li>
                                <li><p>two</p></li>
                            </ol></li>
                            <li>gamma</li>
                        </ul></li>
                        <li>cherry</li>
                    </ol>

                    <ul>
                        <li>cat</li>
                        <li><p>dog</p>
                            <ol>
                                <li>walk</li>
                                <li>run</li>
                            </ol>
                        </li>
                    </ul>
  `,
                },
                "*",
            );
        });

        cy.get(".doenet-viewer").should("contain.text", "apple");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("Images", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
                    <image name="image1" source="http://mathinsight.org/media/image/image/giant_anteater.jpg" description="A giant anteater" />
                    <image name="image2" source="http://mathinsight.org/media/image/image/giant_anteater.jpg" decorative />
  `,
                },
                "*",
            );
        });

        cy.get("#image1").should("be.visible");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });
});
