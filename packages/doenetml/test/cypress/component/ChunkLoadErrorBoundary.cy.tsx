import React from "react";
import { ChunkLoadErrorBoundary } from "../../../src/Viewer/renderersLoadComponent";

// The boundary behind the editor's lazy seam (`EditorViewerLazy`). A chunk
// fetch that still fails after `importRendererWithRetry`'s retries is
// re-thrown by React during render; the boundary must swap in the
// renderer-load-failed placeholder for exactly that error shape, and pass
// every other error through to the boundary above it.

/** Renders nothing — it throws `error` instead, like a failed lazy chunk. */
function Thrower({ error }: { error: Error }): React.ReactNode {
    throw error;
}

/** Test stand-in for whatever boundary surrounds the editor in a real host. */
class OuterBoundary extends React.Component<
    { children: React.ReactNode },
    { message: string | null }
> {
    state: { message: string | null } = { message: null };
    static getDerivedStateFromError(error: Error) {
        return { message: error.message };
    }
    render() {
        if (this.state.message !== null) {
            return <div data-test="outer-caught">{this.state.message}</div>;
        }
        return this.props.children;
    }
}

describe("ChunkLoadErrorBoundary", () => {
    it("replaces a failed chunk fetch with the renderer-load-failed placeholder", () => {
        // The error stays inside React's boundary handling, but guard anyway:
        // dev builds of React have re-dispatched even caught errors globally.
        cy.on("uncaught:exception", () => false);
        cy.mount(
            <OuterBoundary>
                <ChunkLoadErrorBoundary>
                    <Thrower
                        error={
                            new Error(
                                "Failed to fetch dynamically imported module: " +
                                    "https://example.com/chunks/EditorViewer-abc.js",
                            )
                        }
                    />
                </ChunkLoadErrorBoundary>
            </OuterBoundary>,
        );
        cy.get('[role="alert"]').should("contain.text", "failed to load");
        cy.get('[data-test="outer-caught"]').should("not.exist");
    });

    it("re-throws anything that is not a chunk-load failure", () => {
        cy.on("uncaught:exception", () => false);
        cy.mount(
            <OuterBoundary>
                <ChunkLoadErrorBoundary>
                    <Thrower error={new Error("a bug inside the editor")} />
                </ChunkLoadErrorBoundary>
            </OuterBoundary>,
        );
        cy.get('[data-test="outer-caught"]').should(
            "have.text",
            "a bug inside the editor",
        );
        cy.get('[role="alert"]').should("not.exist");
    });

    it("renders its children when nothing throws", () => {
        cy.mount(
            <ChunkLoadErrorBoundary>
                <div data-test="child">all good</div>
            </ChunkLoadErrorBoundary>,
        );
        cy.get('[data-test="child"]').should("have.text", "all good");
    });
});
