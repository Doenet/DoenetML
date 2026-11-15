/**
 * The math key strip drawn by a page that embeds activities in iframes
 * (`@doenet/standalone`'s `math-key-strip.js`, `DoenetMathKeyStrip.attach`).
 *
 * `public/math-key-strip-host-page.html` holds two activity iframes, each
 * with a strip attached, and a text field of its own. The activities are
 * rendered as the README asks: no Doenet keyboard, an external one provided,
 * and `mathKeyStrip` on. Touch is emulated as in `mathKeyStrip.cy.js`.
 *
 * What is checked is the channel between the two pages: a key pressed on the
 * host types into the activity whose input has focus, and the strip is shown
 * only while focus is in a math input of its own iframe (or in the strip).
 */

const BOOT_TIMEOUT = 60_000;
const STRIP = ".doenet-math-key-strip";

function emulateTouchDevice(enabled) {
    return cy.then({ log: false }, () =>
        Cypress.automation("remote:debugger:protocol", {
            command: "Emulation.setTouchEmulationEnabled",
            params: { enabled, maxTouchPoints: 5 },
        }),
    );
}

/** The math input's textarea in an activity iframe. */
function mathTextarea(frame) {
    return cy
        .get(frame)
        .its("0.contentDocument.body", { timeout: BOOT_TIMEOUT })
        .find(".mq-editable-field textarea", { timeout: BOOT_TIMEOUT })
        .then(cy.wrap);
}

/** The activity's text, without its DoenetML source. */
function textOf(body) {
    const clone = body.cloneNode(true);
    clone.querySelectorAll("script").forEach((s) => s.remove());
    return clone.textContent ?? "";
}

/** Waits until the activity's text does (or does not) contain `text`. */
function expectActivityText(frame, text, present = true) {
    cy.get(frame)
        .its("0.contentDocument.body")
        .should((body) => {
            if (present) {
                expect(textOf(body)).to.contain(text);
            } else {
                expect(textOf(body)).not.to.contain(text);
            }
        });
}

function expectCredit(frame, credit) {
    expectActivityText(frame, `Credit: ${credit}`);
}

function visibleStrips() {
    return cy.get("body").then(($body) => $body.find(`${STRIP}:visible`));
}

function expectStripsShown(count) {
    cy.get("body").should(($body) => {
        expect($body.find(`${STRIP}:visible`).length, "strips shown").to.equal(
            count,
        );
    });
}

describe("Math key strip on a host page", { tags: ["@group5"] }, () => {
    beforeEach(() => {
        cy.viewport(390, 700);
        emulateTouchDevice(true);
        cy.visit("/math-key-strip-host-page.html");
        cy.window().should((win) => {
            expect(win.matchMedia("(pointer: coarse)").matches).to.equal(true);
        });
        mathTextarea("#act1");
        mathTextarea("#act2");
        expectCredit("#act1", 0);
        expectCredit("#act2", 0);
        expectStripsShown(0);
    });

    afterEach(() => {
        emulateTouchDevice(false);
    });

    it("types into the activity whose input has focus", () => {
        mathTextarea("#act1").focus();
        expectStripsShown(1);
        mathTextarea("#act1").type("x", { force: true, delay: 0 });
        cy.get(`${STRIP}:visible button[aria-label="union"]`).click();
        // The press left focus in the activity's input.
        cy.document().should((doc) => {
            expect(doc.activeElement?.id).to.equal("act1");
        });
        // The key reaches the activity by postMessage, a task later; wait for
        // it before typing on, as a reader's next tap would.
        expectActivityText("#act1", "∪");
        mathTextarea("#act1").type("y{enter}", { force: true, delay: 0 });
        expectCredit("#act1", 1);
        expectCredit("#act2", 0);
    });

    it("hides when focus moves to a field of the host page", () => {
        mathTextarea("#act1").focus();
        expectStripsShown(1);
        cy.get("#host-field").focus();
        expectStripsShown(0);
    });

    it("follows focus from one activity to the other", () => {
        mathTextarea("#act1").focus();
        expectStripsShown(1);
        mathTextarea("#act2").focus();
        expectStripsShown(1);
        mathTextarea("#act2").type("x", { force: true, delay: 0 });
        visibleStrips().then(($strips) => {
            $strips.find('button[aria-label="union"]')[0].click();
        });
        expectActivityText("#act2", "∪");
        mathTextarea("#act2").type("y{enter}", { force: true, delay: 0 });
        expectCredit("#act2", 1);
        expectCredit("#act1", 0);
        expectActivityText("#act1", "∪", false);
    });

    it("hides when the activity's iframe navigates away", () => {
        mathTextarea("#act1").focus();
        expectStripsShown(1);
        cy.get("#act1").then(($iframe) => {
            $iframe[0].src = "about:blank";
        });
        expectStripsShown(0);
    });

    it("stays shown when the iframe finishes loading after its input took focus", () => {
        // A document whose images arrive late fires its `load` after the
        // reader is already typing. The host cannot tell that from a new
        // document, so it asks again, and the viewer answers.
        mathTextarea("#act1").focus();
        expectStripsShown(1);
        cy.get("#act1").then(($iframe) => {
            $iframe[0].dispatchEvent(new Event("load"));
        });
        expectStripsShown(1);
        mathTextarea("#act1").type("x", { force: true, delay: 0 });
        cy.get(`${STRIP}:visible button[aria-label="union"]`).click();
        expectActivityText("#act1", "∪");
    });

    it("hides when the activity's iframe is removed", () => {
        mathTextarea("#act1").focus();
        expectStripsShown(1);
        cy.get("#act1").then(($iframe) => {
            $iframe[0].remove();
        });
        expectStripsShown(0);
    });
});

describe(
    "Math key strip on a host page, detached",
    { tags: ["@group5"] },
    () => {
        // `detach()` must leave nothing running, even with the strip's re-check
        // after a focusout still pending. That re-check could otherwise show the
        // destroyed strip's watcher again: it observes the whole host document.
        // To reach that state the touch test is a stand-in the test can flip
        // (Chrome's emulation sends no `change`), and observers are counted.
        it("leaves no watcher behind when detached with a re-check pending", () => {
            const coarse = {
                matches: true,
                listeners: [],
                addEventListener(type, fn) {
                    this.listeners.push(fn);
                },
                removeEventListener(type, fn) {
                    this.listeners = this.listeners.filter((f) => f !== fn);
                },
            };
            let watching = 0;
            cy.viewport(390, 700);
            cy.visit("/math-key-strip-host-page.html", {
                onBeforeLoad(win) {
                    const matchMedia = win.matchMedia.bind(win);
                    win.matchMedia = (query) =>
                        query === "(pointer: coarse)"
                            ? coarse
                            : matchMedia(query);
                    const Observer = win.MutationObserver;
                    win.MutationObserver = class extends Observer {
                        observe(...args) {
                            if (!this.watching) {
                                this.watching = true;
                                watching += 1;
                            }
                            return super.observe(...args);
                        }
                        disconnect() {
                            if (this.watching) {
                                this.watching = false;
                                watching -= 1;
                            }
                            return super.disconnect();
                        }
                    };
                },
            });
            mathTextarea("#act1").focus();
            expectStripsShown(1);
            cy.wrap(null).should(() => expect(watching).to.equal(1));
            cy.window().then((win) => {
                // The pointer stops being coarse: the strip hides while the
                // activity still reports its input focused.
                coarse.matches = false;
                coarse.listeners.forEach((fn) => fn());
                expect(watching).to.equal(0);
                const strip = win.document.querySelector(STRIP);
                // A focusout schedules the re-check; detach before it runs, and
                // let the pointer turn coarse again in between.
                strip.dispatchEvent(new win.FocusEvent("focusout"));
                win.detachStrips[0]();
                coarse.matches = true;
            });
            cy.wait(100);
            cy.get(STRIP).should("have.length", 1);
            cy.wrap(null).should(() => expect(watching).to.equal(0));
        });
    },
);
