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

/** The text input of the stateful documents these helpers type into. */
export const TEXT_INPUT = "input.doenet-textinput, input:not([type=checkbox])";

/**
 * Type `text` into the mounted document and resolve with the state a
 * persistence host would have saved for it.
 *
 * Routine state reports are throttled to one a minute
 * (`StatePersistence.saveChangesToDatabase`), so the flush is what makes the
 * capture deterministic: it pushes what the document is holding through the
 * ordinary `SPLICE.reportScoreAndState` channel a host saves from. `reports`
 * is the list `captureReports` was collecting into before the mount, and the
 * document must echo what is typed as `You typed: <text>`.
 */
export function saveStateAfterTyping(
    reports: any[],
    text: string,
    flushId: string,
    timeout = 30_000,
): Cypress.Chainable<any> {
    cy.get(TEXT_INPUT).type(`{selectall}{backspace}${text}{enter}`);
    cy.contains(`You typed: ${text}`, { timeout }).should("exist");
    flushState(flushId);
    return cy
        .wrap(null, { timeout })
        .should(() => {
            expect(
                reports.some((r) => String(r.state?.coreState).includes(text)),
                `a report carried "${text}"`,
            ).to.eq(true);
        })
        .then(
            () =>
                [...reports]
                    .reverse()
                    .find((r) => String(r.state?.coreState).includes(text))
                    .state,
        );
}
