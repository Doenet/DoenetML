// Helpers for driving the SPLICE host protocol from a component test.
//
// Component tests share the viewer's window, so the spec itself can play the
// host on the same `postMessage` channel a real one uses.

/**
 * Post `SPLICE.flushState` and resolve with the matching acknowledgement.
 *
 * The request is re-posted every 500 ms until a response arrives, modelling
 * the recommended host behavior: the viewer's message listener registers in a
 * mount effect, so a request posted in the first moments after mount can land
 * before anyone is listening (and a robust host needs a retry/timeout around
 * the round-trip regardless — flushing is idempotent, so re-posting is safe).
 */
export function flushState(messageId: string): Cypress.Chainable<any> {
    return cy.window().then(
        (win) =>
            new Cypress.Promise((resolve) => {
                const post = () =>
                    win.postMessage(
                        { subject: "SPLICE.flushState", message_id: messageId },
                        "*",
                    );
                const retryTimer = setInterval(post, 500);
                const listener = (e: MessageEvent) => {
                    if (
                        e.data?.subject === "SPLICE.flushState.response" &&
                        e.data?.message_id === messageId
                    ) {
                        clearInterval(retryTimer);
                        win.removeEventListener("message", listener);
                        resolve(e.data);
                    }
                };
                win.addEventListener("message", listener);
                post();
            }),
    );
}

/** Collect every `SPLICE.reportScoreAndState` posted by the viewer. */
export function captureReports(): Cypress.Chainable<any[]> {
    return cy.window().then((win) => {
        const reports: any[] = [];
        win.addEventListener("message", (e: MessageEvent) => {
            if (e.data?.subject === "SPLICE.reportScoreAndState") {
                reports.push(e.data);
            }
        });
        return reports;
    });
}
