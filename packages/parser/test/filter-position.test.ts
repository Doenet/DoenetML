import { describe, expect, it } from "vitest";
import util from "util";
import { filterPositionInfo } from "../src/dast-to-xml/utils";
import { DastRoot } from "../src/types";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

describe("DAST", async () => {
    it("Can filter position information", () => {
        const withPos: DastRoot = {
            type: "root",
            children: [
                {
                    type: "element",
                    name: "p",
                    attributes: {
                        fpp: {
                            type: "attribute",
                            name: "fpp",
                            children: [
                                {
                                    type: "text",
                                    value: "123",
                                    position: {
                                        start: {
                                            line: 1,
                                            column: 8,
                                            offset: 7,
                                        },
                                        end: {
                                            line: 1,
                                            column: 13,
                                            offset: 12,
                                        },
                                    },
                                },
                            ],
                            position: {
                                start: {
                                    line: 1,
                                    column: 4,
                                    offset: 3,
                                },
                                end: {
                                    line: 1,
                                    column: 13,
                                    offset: 12,
                                },
                            },
                        },
                    },
                    children: [],
                    position: {
                        start: {
                            line: 1,
                            column: 1,
                            offset: 0,
                        },
                        end: {
                            line: 1,
                            column: 15,
                            offset: 14,
                        },
                    },
                },
            ],
            position: {
                start: {
                    line: 1,
                    column: 1,
                    offset: 0,
                },
                end: {
                    line: 1,
                    column: 15,
                    offset: 14,
                },
            },
        };
        const withoutPos = {
            type: "root",
            children: [
                {
                    type: "element",
                    name: "p",
                    attributes: {
                        fpp: {
                            type: "attribute",
                            name: "fpp",
                            children: [
                                {
                                    type: "text",
                                    value: "123",
                                },
                            ],
                        },
                    },
                    children: [],
                },
            ],
        };

        filterPositionInfo(withPos);

        expect(withPos).toEqual(withoutPos);
    });
});
