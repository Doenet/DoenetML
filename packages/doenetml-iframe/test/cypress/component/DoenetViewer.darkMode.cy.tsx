import React, { useState } from "react";
import { DoenetViewer } from "../../../src/index";
import {
    STANDALONE_BLOB_URL,
    STANDALONE_CSS_BLOB_URL,
    IFRAME_READY_TIMEOUT,
} from "./helpers";

const DOENET_ML = "<p>Hello dark mode</p>";

const DARK_BG = "rgb(18, 18, 18)"; // #121212
const LIGHT_BG = "rgb(255, 255, 255)"; // white

/** Wait for the iframe body to exist, then assert its background-color. */
function assertBodyBg(expected: string) {
    cy.get("iframe")
        .its("0.contentDocument.body", { timeout: IFRAME_READY_TIMEOUT })
        .should("have.css", "background-color", expected);
}

describe("DoenetViewer (iframe wrapper) — dark mode body background", () => {
    it('darkMode="dark" sets iframe body background to #121212', () => {
        cy.mount(
            <DoenetViewer
                doenetML={DOENET_ML}
                darkMode="dark"
                standaloneUrl={STANDALONE_BLOB_URL}
                cssUrl={STANDALONE_CSS_BLOB_URL}
                addVirtualKeyboard={false}
            />,
        );

        assertBodyBg(DARK_BG);
    });

    it('darkMode="light" sets iframe body background to white', () => {
        cy.mount(
            <DoenetViewer
                doenetML={DOENET_ML}
                darkMode="light"
                standaloneUrl={STANDALONE_BLOB_URL}
                cssUrl={STANDALONE_CSS_BLOB_URL}
                addVirtualKeyboard={false}
            />,
        );

        assertBodyBg(LIGHT_BG);
    });

    it("darkMode prop change after mount updates iframe body background", () => {
        function Harness() {
            const [darkMode, setDarkMode] = useState<"light" | "dark">("light");
            return (
                <div>
                    <button
                        data-test="toggle"
                        onClick={() =>
                            setDarkMode((m) =>
                                m === "light" ? "dark" : "light",
                            )
                        }
                    >
                        Toggle
                    </button>
                    <DoenetViewer
                        doenetML={DOENET_ML}
                        darkMode={darkMode}
                        standaloneUrl={STANDALONE_BLOB_URL}
                        cssUrl={STANDALONE_CSS_BLOB_URL}
                        addVirtualKeyboard={false}
                    />
                </div>
            );
        }

        cy.mount(<Harness />);

        // Starts light
        assertBodyBg(LIGHT_BG);

        // Switch to dark
        cy.get("[data-test=toggle]").click();
        assertBodyBg(DARK_BG);

        // Switch back to light
        cy.get("[data-test=toggle]").click();
        assertBodyBg(LIGHT_BG);
    });
});
