import { describe, expect, it, vi } from "vitest";
import { createXAxis, createYAxis, type AxisJXG } from "./jsxgraph";

function createMockBoard() {
    let lastCreated: { type: string; points: number[][]; options: any } | null =
        null;
    const mockBoard: any = {
        suspendUpdate: vi.fn(),
        unsuspendUpdate: vi.fn(),
        create: vi.fn((type: string, points: number[][], options: any) => {
            lastCreated = { type, points, options };
            const mockAxis: any = {
                defaultTicks: {
                    getDistanceMajorTicks: () => 2,
                    visProp: { scale: 1 },
                    setAttribute: vi.fn(),
                    fullUpdate: vi.fn(),
                },
            };
            return mockAxis;
        }),
    };
    return {
        mockBoard,
        getLastCreated: () => lastCreated,
    };
}

describe("createYAxis label positioning", () => {
    it("places default (top) label at 'rt' near [0, 1] for full and positiveOnly axes", () => {
        const { mockBoard, getLastCreated } = createMockBoard();
        const yaxisRef = { current: null };
        const previousYaxisWithLabelRef = { current: false };

        createYAxis({
            theBoard: mockBoard,
            SVs: {
                yLabel: "y",
                displayYAxis: "full",
                displayXAxis: "full",
                yTickScaleFactor: null,
                grid: null,
                displayYAxisTicks: true,
                displayYAxisTickLabels: true,
            },
            yaxisRef,
            previousYaxisWithLabelRef,
        });

        const created = getLastCreated()!;
        expect(created.points).toEqual([
            [0, 0],
            [0, 1],
        ]);
        expect(created.options.label.position).toBe("rt");
        expect(created.options.label.offset).toEqual([-10, -5]);
    });

    it("places bottom label at 'lft' for full and positiveOnly axes", () => {
        const { mockBoard, getLastCreated } = createMockBoard();
        const yaxisRef = { current: null };
        const previousYaxisWithLabelRef = { current: false };

        createYAxis({
            theBoard: mockBoard,
            SVs: {
                yLabel: "y",
                yLabelPosition: "bottom",
                displayYAxis: "positiveonly",
                displayXAxis: "full",
                yTickScaleFactor: null,
                grid: null,
                displayYAxisTicks: true,
                displayYAxisTickLabels: true,
            },
            yaxisRef,
            previousYaxisWithLabelRef,
        });

        const created = getLastCreated()!;
        expect(created.points).toEqual([
            [0, 0],
            [0, 1],
        ]);
        expect(created.options.label.position).toBe("lft");
        expect(created.options.label.offset).toEqual([-10, 5]);
    });

    it("inverts position for negativeOnly axis: bottom label maps to 'rt' (towards [0, -1])", () => {
        const { mockBoard, getLastCreated } = createMockBoard();
        const yaxisRef = { current: null };
        const previousYaxisWithLabelRef = { current: false };

        createYAxis({
            theBoard: mockBoard,
            SVs: {
                yLabel: "y",
                yLabelPosition: "bottom",
                displayYAxis: "negativeonly",
                displayXAxis: "negativeonly",
                yTickScaleFactor: null,
                grid: null,
                displayYAxisTicks: true,
                displayYAxisTickLabels: true,
            },
            yaxisRef,
            previousYaxisWithLabelRef,
        });

        const created = getLastCreated()!;
        expect(created.points).toEqual([
            [0, 0],
            [0, -1],
        ]);
        // On negative-only axis, [0, -1] is the bottom arrow head, so "rt" lands at the bottom
        expect(created.options.label.position).toBe("rt");
        expect(created.options.label.offset).toEqual([-10, 5]);
    });

    it("inverts position for negativeOnly axis: default (top) label maps to 'lft' (towards [0, 0])", () => {
        const { mockBoard, getLastCreated } = createMockBoard();
        const yaxisRef = { current: null };
        const previousYaxisWithLabelRef = { current: false };

        createYAxis({
            theBoard: mockBoard,
            SVs: {
                yLabel: "y",
                displayYAxis: "negativeonly",
                displayXAxis: "full",
                yTickScaleFactor: null,
                grid: null,
                displayYAxisTicks: true,
                displayYAxisTickLabels: true,
            },
            yaxisRef,
            previousYaxisWithLabelRef,
        });

        const created = getLastCreated()!;
        expect(created.points).toEqual([
            [0, 0],
            [0, -1],
        ]);
        // On negative-only axis, [0, 0] is the top (origin), so "lft" lands at the top
        expect(created.options.label.position).toBe("lft");
        expect(created.options.label.offset).toEqual([-10, -5]);
    });
});

describe("createXAxis label positioning", () => {
    it("places default (right) label at 'rt' near [1, 0] for full and positiveOnly axes", () => {
        const { mockBoard, getLastCreated } = createMockBoard();
        const xaxisRef = { current: null };
        const previousXaxisWithLabelRef = { current: false };

        createXAxis({
            theBoard: mockBoard,
            SVs: {
                xLabel: "x",
                displayXAxis: "full",
                displayYAxis: "full",
                xTickScaleFactor: null,
                grid: null,
                displayXAxisTicks: true,
                displayXAxisTickLabels: true,
            },
            xaxisRef,
            previousXaxisWithLabelRef,
        });

        const created = getLastCreated()!;
        expect(created.points).toEqual([
            [0, 0],
            [1, 0],
        ]);
        expect(created.options.label.position).toBe("rt");
        expect(created.options.label.offset).toEqual([5, 10]);
        expect(created.options.label.anchorx).toBe("right");
    });

    it("places left label at 'lft' for full and positiveOnly axes", () => {
        const { mockBoard, getLastCreated } = createMockBoard();
        const xaxisRef = { current: null };
        const previousXaxisWithLabelRef = { current: false };

        createXAxis({
            theBoard: mockBoard,
            SVs: {
                xLabel: "x",
                xLabelPosition: "left",
                displayXAxis: "positiveonly",
                displayYAxis: "full",
                xTickScaleFactor: null,
                grid: null,
                displayXAxisTicks: true,
                displayXAxisTickLabels: true,
            },
            xaxisRef,
            previousXaxisWithLabelRef,
        });

        const created = getLastCreated()!;
        expect(created.points).toEqual([
            [0, 0],
            [1, 0],
        ]);
        expect(created.options.label.position).toBe("lft");
        expect(created.options.label.offset).toEqual([-5, 10]);
        expect(created.options.label.anchorx).toBe("left");
    });

    it("inverts position for negativeOnly axis: left label maps to 'rt' (towards [-1, 0])", () => {
        const { mockBoard, getLastCreated } = createMockBoard();
        const xaxisRef = { current: null };
        const previousXaxisWithLabelRef = { current: false };

        createXAxis({
            theBoard: mockBoard,
            SVs: {
                xLabel: "x",
                xLabelPosition: "left",
                displayXAxis: "negativeonly",
                displayYAxis: "full",
                xTickScaleFactor: null,
                grid: null,
                displayXAxisTicks: true,
                displayXAxisTickLabels: true,
            },
            xaxisRef,
            previousXaxisWithLabelRef,
        });

        const created = getLastCreated()!;
        expect(created.points).toEqual([
            [0, 0],
            [-1, 0],
        ]);
        // On negative-only axis, [-1, 0] is the left arrow head, so "rt" lands on the left
        expect(created.options.label.position).toBe("rt");
        expect(created.options.label.offset).toEqual([-5, 10]);
        expect(created.options.label.anchorx).toBe("left");
    });

    it("inverts position for negativeOnly axis: default (right) label maps to 'lft' (towards [0, 0])", () => {
        const { mockBoard, getLastCreated } = createMockBoard();
        const xaxisRef = { current: null };
        const previousXaxisWithLabelRef = { current: false };

        createXAxis({
            theBoard: mockBoard,
            SVs: {
                xLabel: "x",
                displayXAxis: "negativeonly",
                displayYAxis: "full",
                xTickScaleFactor: null,
                grid: null,
                displayXAxisTicks: true,
                displayXAxisTickLabels: true,
            },
            xaxisRef,
            previousXaxisWithLabelRef,
        });

        const created = getLastCreated()!;
        expect(created.points).toEqual([
            [0, 0],
            [-1, 0],
        ]);
        // On negative-only axis, [0, 0] is the right end (origin), so "lft" lands on the right
        expect(created.options.label.position).toBe("lft");
        expect(created.options.label.offset).toEqual([5, 10]);
        expect(created.options.label.anchorx).toBe("right");
    });
});
