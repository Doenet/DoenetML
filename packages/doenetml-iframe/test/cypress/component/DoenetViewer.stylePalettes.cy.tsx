import React from "react";
import { DoenetViewer } from "../../../src/index";
import type { StylePaletteInfo } from "../../../src/index";
import {
    STANDALONE_BLOB_URL,
    STANDALONE_CSS_BLOB_URL,
    IFRAME_READY_TIMEOUT,
} from "./helpers";

const DOENET_ML = "<p>Hello palettes</p>";

/**
 * The wrapper reports the style palettes of the standalone bundle it booted
 * (not of this package), so a host can build a palette picker that matches
 * the DoenetML version actually running. These specs boot the locally-built
 * bundle, which ships palette discovery, so the callback receives real data.
 */
describe("DoenetViewer (iframe wrapper) — style palette discovery", () => {
    it("reports the booted bundle's palettes with swatch data", () => {
        const received: (StylePaletteInfo[] | null)[] = [];

        cy.mount(
            <DoenetViewer
                doenetML={DOENET_ML}
                standaloneUrl={STANDALONE_BLOB_URL}
                cssUrl={STANDALONE_CSS_BLOB_URL}
                addVirtualKeyboard={false}
                onStylePalettes={(palettes) => {
                    received.push(palettes);
                }}
            />,
        );

        cy.wrap(received, { timeout: IFRAME_READY_TIMEOUT })
            .should("have.length.at.least", 1)
            .then(() => {
                const palettes = received[0];
                expect(palettes, "palettes reported").to.be.an("array");

                const names = palettes!.map((p) => p.name);
                // The registry the bundle ships; `default` is always present.
                expect(names).to.include("default");
                expect(names).to.include("grayscale");

                for (const palette of palettes!) {
                    expect(palette.description, palette.name).to.be.a("string")
                        .and.not.be.empty;
                    const styleNumbers = Object.keys(palette.styles);
                    // Every palette guarantees at least four styles.
                    expect(styleNumbers.length, palette.name).to.be.at.least(4);

                    // Swatch-ready values for both themes.
                    const first = palette.styles["1"];
                    expect(first.lineColor, palette.name).to.be.a("string").and
                        .not.be.empty;
                    expect(first.lineColorDarkMode, palette.name).to.be.a(
                        "string",
                    ).and.not.be.empty;
                    expect(first.markerStyle, palette.name).to.be.a("string")
                        .and.not.be.empty;
                }

                // The data survived structured cloning across the iframe
                // boundary as plain JSON.
                expect(() => JSON.stringify(palettes)).to.not.throw();
            });
    });

    it("reports palettes to a callback passed after mount", () => {
        // The message listener has empty deps, so it must read the callback
        // through a ref rather than closing over the mount-time value.
        function Harness() {
            const [palettes, setPalettes] = React.useState<
                StylePaletteInfo[] | null | undefined
            >(undefined);
            const [ready, setReady] = React.useState(false);

            // `ready` is false for the first render, so the callback the
            // viewer sees then — the value its `useRef` captures — is
            // `undefined`; a listener that closed over that mount-time value
            // would never report, which is what this spec exists to catch.
            //
            // Flipping `ready` from a *layout* effect rather than a timer is
            // what keeps that deterministic. React flushes a state update made
            // here synchronously, so the real callback is installed within the
            // same task as the mount — before the iframe can possibly post
            // `iframeReady`. Palettes are reported exactly once, on that
            // message, so a callback that arrives even a millisecond late
            // misses it forever: with a `setTimeout`, the timer and the boot
            // both landed around 250ms (the boot starves the timer, and a warm
            // second boot is fast) and the test failed whenever the message won
            // by a millisecond or two.
            React.useLayoutEffect(() => {
                setReady(true);
            }, []);

            return (
                <div>
                    <div data-testid="count">
                        {palettes === undefined
                            ? "pending"
                            : String(palettes?.length ?? "null")}
                    </div>
                    <DoenetViewer
                        doenetML={DOENET_ML}
                        standaloneUrl={STANDALONE_BLOB_URL}
                        cssUrl={STANDALONE_CSS_BLOB_URL}
                        addVirtualKeyboard={false}
                        onStylePalettes={
                            ready ? (p) => setPalettes(p) : undefined
                        }
                    />
                </div>
            );
        }

        cy.mount(<Harness />);

        cy.get('[data-testid="count"]', { timeout: IFRAME_READY_TIMEOUT })
            .should("not.have.text", "pending")
            .should("not.have.text", "null");
    });
});
