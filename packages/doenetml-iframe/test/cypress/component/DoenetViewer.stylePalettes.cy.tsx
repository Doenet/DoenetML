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

    it("reports palettes to a callback absent at the first render", () => {
        // `onStylePalettes` is `undefined` on the first render — the render
        // whose value the viewer captures in a ref, and whose closure its
        // (deps-empty) message listener keeps for good. The palettes are
        // therefore reported only if that listener reads the callback back
        // out of the ref instead of using the `undefined` it closed over,
        // which is the regression this spec exists to catch.
        function Harness() {
            const [palettes, setPalettes] = React.useState<
                StylePaletteInfo[] | null | undefined
            >(undefined);
            const [ready, setReady] = React.useState(false);

            // Install the real callback from a *layout* effect, never a
            // timer: React flushes the re-render it schedules synchronously,
            // so the callback is in place within the same task as the mount,
            // before the iframe can post `iframeReady`. That matters because
            // palettes are reported exactly once, on that message (#1626), so
            // a callback arriving even a millisecond late misses them
            // forever — with `setTimeout(..., 10)` the timer and the boot both
            // landed near 250ms (evaluating the ~32 MB bundle starves the
            // parent's timers) and the spec failed whenever the message won.
            //
            // The flip side is that this spec covers only a callback missing
            // at the first render, not one attached after the boot has already
            // finished; see #1626 for that gap.
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
