import { expectNoColorContrastViolations } from "../../support/colorContrast";

/**
 * Accessibility coverage for the description panel.
 *
 * The panel needs a spec of its own for two reasons the other contrast specs
 * cannot work around:
 *
 *  - Its content is collapsed until the reader opens it, and axe skips hidden
 *    text. Every case here opens the panel before scanning.
 *  - The inline variant is an Ariakit popover, which mounts in a portal outside
 *    `.doenet-viewer`. Scans rooted at the viewer never reach it, so these scans
 *    are rooted at `[data-test="Description"]` instead, which matches the
 *    popover and the `<details>` content alike.
 *
 * Both themes run: dark mode is where link colors and the panel surface fail,
 * light mode is where dark-mode-only palette entries would fail if used.
 */
describe(
    "Description panel accessibility checks",
    { tags: ["@group5"] },
    () => {
        beforeEach(() => {
            cy.clearIndexedDB();
            cy.visit("/");
            cy.injectAxe();
        });

        function load(doenetML, darkMode) {
            cy.get("#testRunner_toggleControls").should("exist");
            cy.window().then((win) => {
                win.postMessage({ doenetML, darkMode }, "*");
            });
            cy.get(`[data-theme="${darkMode}"]`).should("exist");
        }

        /**
         * Open the panel, whichever variant this document produced.
         *
         * The `<details>` element is "visible" whether or not it is open, so
         * that variant waits on its content instead: a scan that ran against a
         * collapsed panel would pass without checking anything.
         */
        function openDescription(variant) {
            if (variant === "inline") {
                cy.get('[data-test="Description Button"]').click();
                cy.get('[data-test="Description"]').should("be.visible");
            } else {
                cy.get('[data-test="Description Summary"]').click();
                cy.get('[data-test="Description"] .details-content').should(
                    "be.visible",
                );
            }
        }

        const cases = [
            {
                name: "generated license link plus an authored ref link",
                doenetML: `
<image name="im" source="http://example.com/a.png" licenseCodes="CC-BY">
  <shortDescription>A picture</shortDescription>
  <description>
    <ref to="http://doenet.org">Doenet</ref>
  </description>
</image>`,
            },
            {
                name: "attribution with author and original-work links",
                doenetML: `
<image name="im" source="http://example.com/a.png" licenseCodes="CC-BY-SA"
    authorName="A. Author" authorUrl="http://example.com/author"
    imageName="Original" originalUrl="http://example.com/work">
  <shortDescription>A picture</shortDescription>
</image>`,
            },
            {
                name: "dual license (two codes joined with 'or')",
                doenetML: `
<image name="im" source="http://example.com/a.png" licenseCodes="CC-BY GFDL">
  <shortDescription>A picture</shortDescription>
</image>`,
            },
            {
                name: "styled description text on the panel surface",
                doenetML: `
<styleDefinition styleNumber="36" textColor="#1a5a99" />
<image name="im" source="http://example.com/a.png" licenseCodes="CC-BY">
  <shortDescription>A picture</shortDescription>
  <description>
    <p styleNumber="36">Styled description text.</p>
    <p>Plain description text.</p>
  </description>
</image>`,
            },
        ];

        for (const testCase of cases) {
            for (const darkMode of ["dark", "light"]) {
                // `displayMode` defaults to block, which renders the `<details>`
                // variant; `inline` renders the popover. Both are exercised so
                // neither surface can regress unnoticed.
                for (const variant of ["block", "inline"]) {
                    it(`${darkMode} mode, ${variant}: ${testCase.name}`, () => {
                        const doenetML = testCase.doenetML.replace(
                            '<image name="im"',
                            `<image name="im" displayMode="${variant}"`,
                        );
                        load(doenetML, darkMode);
                        cy.get("#im").should("exist");
                        openDescription(variant);
                        expectNoColorContrastViolations(
                            '[data-test="Description"]',
                        );
                    });
                }
            }
        }
    },
);
