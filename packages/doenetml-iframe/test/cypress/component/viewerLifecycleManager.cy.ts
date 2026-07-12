import {
    registerWindowedViewer,
    setViewerVisibility,
    notifyViewerState,
    getViewerLifecycleStats,
    requestBootSlot,
    cancelBootRequest,
    releaseBootSlot,
    __resetViewerLifecycleManagerForTests,
} from "../../../src/viewer-lifecycle-manager";

// Pure-logic tests for the windowed-mounting policy. `cy.clock` controls
// both `Date.now` and `setTimeout`, so debounce windows advance
// deterministically via `cy.tick`.

type FakeViewer = {
    id: string;
    parkRequests: number;
    unregister: () => void;
};

/** Register a fake viewer that parks instantly when asked. */
function addViewer(
    id: string,
    {
        maxLiveViewers = 2,
        maxConcurrentBoots = 99,
        parkDelayMs = 100,
        canPark = true,
        parkImmediately = true,
    } = {},
): FakeViewer {
    const viewer: FakeViewer = { id, parkRequests: 0, unregister: () => {} };
    viewer.unregister = registerWindowedViewer({
        id,
        maxLiveViewers,
        maxConcurrentBoots,
        parkDelayMs,
        canPark: () => canPark,
        requestPark: () => {
            viewer.parkRequests++;
            if (parkImmediately) {
                notifyViewerState(id, "parked");
            }
        },
    });
    return viewer;
}

describe("viewer-lifecycle-manager — windowed mounting policy", () => {
    beforeEach(() => {
        __resetViewerLifecycleManagerForTests();
        cy.clock();
    });

    afterEach(() => {
        __resetViewerLifecycleManagerForTests();
    });

    it("parks the least-recently-visible off-screen viewer when over budget", () => {
        const a = addViewer("a");
        const b = addViewer("b");
        const c = addViewer("c");

        // Visibility history: a seen first, then b, then c (c stays visible).
        setViewerVisibility("a", true);
        setViewerVisibility("a", false);
        setViewerVisibility("b", true);
        setViewerVisibility("b", false);
        setViewerVisibility("c", true);

        // 3 live, budget 2, both a and b past their debounce → the LRU (a)
        // parks; one park brings the page back to budget, so b stays live.
        cy.tick(200).then(() => {
            expect(a.parkRequests, "a (LRU) parked").to.eq(1);
            expect(b.parkRequests, "b stays live").to.eq(0);
            expect(c.parkRequests, "c stays live").to.eq(0);
            expect(getViewerLifecycleStats()).to.deep.include({
                live: 2,
                parked: 1,
            });
        });
    });

    it("never parks a visible viewer, even over budget", () => {
        const a = addViewer("a", { maxLiveViewers: 1 });
        const b = addViewer("b", { maxLiveViewers: 1 });
        setViewerVisibility("a", true);
        setViewerVisibility("b", true);

        cy.tick(500).then(() => {
            expect(a.parkRequests).to.eq(0);
            expect(b.parkRequests).to.eq(0);
            expect(getViewerLifecycleStats().live, "soft budget").to.eq(2);
        });
    });

    it("waits out the park-delay debounce before parking", () => {
        const a = addViewer("a", { maxLiveViewers: 1, parkDelayMs: 100 });
        addViewer("b", { maxLiveViewers: 1, parkDelayMs: 100 });
        setViewerVisibility("b", true);

        // a has been invisible since registration; not yet past debounce.
        cy.tick(50).then(() => {
            expect(a.parkRequests, "debounce not yet elapsed").to.eq(0);
        });
        cy.tick(100).then(() => {
            expect(a.parkRequests, "debounce elapsed").to.eq(1);
        });
    });

    it("skips viewers that cannot park losslessly", () => {
        const a = addViewer("a", { maxLiveViewers: 1, canPark: false });
        addViewer("b", { maxLiveViewers: 1 });
        setViewerVisibility("b", true);

        cy.tick(500).then(() => {
            expect(a.parkRequests, "no persistence path → never parked").to.eq(
                0,
            );
            expect(getViewerLifecycleStats().live).to.eq(2);
        });
    });

    it("uses the smallest budget when viewers disagree", () => {
        const a = addViewer("a", { maxLiveViewers: 3 });
        addViewer("b", { maxLiveViewers: 1 });
        setViewerVisibility("b", true);

        cy.tick(500).then(() => {
            expect(a.parkRequests, "budget min(3, 1) = 1 applies").to.eq(1);
        });
    });

    it("an aborted park (viewer reports live) is retried on the next evaluation", () => {
        // Viewer that refuses the first park request (e.g. flush raced a
        // scroll-back) and reports itself live again.
        const a: FakeViewer = {
            id: "a",
            parkRequests: 0,
            unregister: () => {},
        };
        a.unregister = registerWindowedViewer({
            id: "a",
            maxLiveViewers: 1,
            maxConcurrentBoots: 99,
            parkDelayMs: 100,
            canPark: () => true,
            requestPark: () => {
                a.parkRequests++;
                if (a.parkRequests === 1) {
                    notifyViewerState("a", "live");
                } else {
                    notifyViewerState("a", "parked");
                }
            },
        });
        addViewer("b", { maxLiveViewers: 1 });
        setViewerVisibility("b", true);

        // The "live" notification re-schedules evaluation; the viewer is
        // still over budget, so it is asked again (the retry fires in the
        // same timer batch, so only the final state is observable).
        cy.tick(500).then(() => {
            expect(a.parkRequests, "asked again after abort").to.eq(2);
            expect(getViewerLifecycleStats().parked).to.eq(1);
        });
    });

    it("does not over-park while a park is still in flight", () => {
        // Budget 2, one visible (a) plus three off-screen viewers whose LRU
        // order is b < c < d. b and c are asked to park but complete lazily
        // (parkImmediately: false), so they sit in the "parking" state.
        const a = addViewer("a", {
            maxLiveViewers: 2,
            parkImmediately: false,
        });
        const b = addViewer("b", {
            maxLiveViewers: 2,
            parkImmediately: false,
        });
        const c = addViewer("c", {
            maxLiveViewers: 2,
            parkImmediately: false,
        });
        const d = addViewer("d", {
            maxLiveViewers: 2,
            parkImmediately: false,
        });

        // Establish least-recently-visible order b < c < d; a stays visible.
        setViewerVisibility("b", true);
        setViewerVisibility("b", false);
        setViewerVisibility("c", true);
        setViewerVisibility("c", false);
        setViewerVisibility("d", true);
        setViewerVisibility("d", false);
        setViewerVisibility("a", true);

        // Over budget by 2 → the two LRU off-screen viewers (b, c) are asked
        // to park; d stays live (budget 2 = a visible + d).
        cy.tick(200).then(() => {
            expect(b.parkRequests, "b (LRU) asked to park").to.eq(1);
            expect(c.parkRequests, "c asked to park").to.eq(1);
            expect(d.parkRequests, "d fills the budget, not parked").to.eq(0);
        });

        // b finishes parking while c is still in flight. The re-evaluation
        // this triggers must NOT ask d to park: only one live viewer (a) is
        // visible and d fills the budget of 2, while the in-flight c is
        // committed to freeing its own slot.
        cy.then(() => {
            notifyViewerState("b", "parked");
        });
        cy.tick(200).then(() => {
            expect(d.parkRequests, "d must not be over-parked").to.eq(0);
            expect(getViewerLifecycleStats()).to.deep.include({
                live: 2, // a, d
                parking: 1, // c
                parked: 1, // b
            });
        });
    });

    describe("boot-slot semaphore (#1439)", () => {
        function addQueued(id: string, granted: string[], opts = {}) {
            addViewer(id, { maxConcurrentBoots: 1, ...opts });
            requestBootSlot(id, () => granted.push(id));
        }

        it("caps concurrent boots and serves the queue on release", () => {
            const granted: string[] = [];
            addQueued("a", granted);
            addQueued("b", granted);
            addQueued("c", granted);
            expect(granted, "only one slot").to.deep.eq(["a"]);
            expect(getViewerLifecycleStats()).to.deep.include({
                booting: 1,
                bootQueue: 2,
            });
            releaseBootSlot("a");
            expect(granted, "release grants the next").to.deep.eq(["a", "b"]);
            releaseBootSlot("b");
            releaseBootSlot("c");
            expect(granted).to.deep.eq(["a", "b", "c"]);
            expect(getViewerLifecycleStats()).to.deep.include({
                booting: 0,
                bootQueue: 0,
            });
        });

        it("serves visible viewers before earlier-queued off-screen ones", () => {
            const granted: string[] = [];
            addQueued("a", granted);
            addQueued("b", granted);
            addQueued("c", granted);
            setViewerVisibility("c", true);
            releaseBootSlot("a");
            expect(granted, "visible c jumps the queue").to.deep.eq(["a", "c"]);
        });

        it("cancelling a queued request removes it; duplicates are ignored", () => {
            const granted: string[] = [];
            addQueued("a", granted);
            addQueued("b", granted);
            requestBootSlot("b", () => granted.push("b-duplicate"));
            cancelBootRequest("b");
            releaseBootSlot("a");
            expect(granted, "cancelled b never granted").to.deep.eq(["a"]);
        });

        it("unregistering releases a held slot and withdraws a queued request", () => {
            const granted: string[] = [];
            const a = addViewer("a", { maxConcurrentBoots: 1 });
            requestBootSlot("a", () => granted.push("a"));
            addQueued("b", granted);
            a.unregister();
            expect(granted, "a's slot passed to b").to.deep.eq(["a", "b"]);
        });
    });

    it("unregistering frees the budget", () => {
        const a = addViewer("a", { maxLiveViewers: 1, parkDelayMs: 100 });
        const b = addViewer("b", { maxLiveViewers: 1 });
        setViewerVisibility("b", true);

        // Unregister b (unmounted) before a's debounce elapses: only one
        // viewer remains, so nothing parks.
        b.unregister();
        cy.tick(500).then(() => {
            expect(a.parkRequests).to.eq(0);
            expect(getViewerLifecycleStats().registered).to.eq(1);
        });
    });
});
