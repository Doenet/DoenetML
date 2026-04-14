describe(
    "PreFigure stays unloaded on non-prefigure pages @group4",
    { tags: ["@group4"] },
    () => {
        beforeEach(() => {
            cy.clearIndexedDB();
        });

        it("does not request prefigure module or spawn prefigure workers", () => {
            let prefigureModuleRequestCount = 0;

            cy.intercept("GET", /prefigure\.js(\?.*)?$/i, (req) => {
                if (req.url.includes("@doenet/prefigure")) {
                    prefigureModuleRequestCount += 1;
                }
                req.continue();
            });

            cy.visit("/", {
                onBeforeLoad(win) {
                    const tracker = {
                        workerUrls: [],
                        sharedWorkerUrls: [],
                    };
                    win.__DOENET_WORKER_TRACKER__ = tracker;

                    const OriginalWorker = win.Worker;
                    if (OriginalWorker) {
                        function WorkerProxy(...args) {
                            tracker.workerUrls.push(String(args[0] ?? ""));
                            return new OriginalWorker(...args);
                        }

                        WorkerProxy.prototype = OriginalWorker.prototype;
                        win.Worker = WorkerProxy;
                    }

                    const OriginalSharedWorker = win.SharedWorker;
                    if (OriginalSharedWorker) {
                        function SharedWorkerProxy(...args) {
                            tracker.sharedWorkerUrls.push(
                                String(args[0] ?? ""),
                            );
                            return new OriginalSharedWorker(...args);
                        }

                        SharedWorkerProxy.prototype =
                            OriginalSharedWorker.prototype;
                        win.SharedWorker = SharedWorkerProxy;
                    }
                },
            });

            cy.window().then((win) => {
                win.postMessage(
                    {
                        doenetML: `
<text name="ready">ready</text>
<text name="status">no prefigure renderer</text>
<graph name="g">
  <point>(0,0)</point>
</graph>
`,
                    },
                    "*",
                );
            });

            cy.get("#ready").should("have.text", "ready");
            cy.get("#status").should("have.text", "no prefigure renderer");

            cy.wait(500);

            cy.then(() => {
                expect(prefigureModuleRequestCount).to.eq(0);
            });

            cy.window().then((win) => {
                const tracker = win.__DOENET_WORKER_TRACKER__;
                const urls = [
                    ...tracker.workerUrls,
                    ...tracker.sharedWorkerUrls,
                ];

                const prefigureWorkerUrls = urls.filter((url) =>
                    /prefigure|@doenet\/prefigure|jsdelivr\.net\/npm\/@doenet\/prefigure/i.test(
                        url,
                    ),
                );

                expect(prefigureWorkerUrls).to.have.length(0);
            });
        });
    },
);
