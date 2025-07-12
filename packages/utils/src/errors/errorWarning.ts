import type { Position, Point } from "@doenet/parser";

export type { Position, Point };

export type ErrorRecord = {
    type: "error";
    message: string;
    position?: Position;
    sourceDoc?: number;
};

export type WarningRecord = {
    type: "warning";
    message: string;
    position?: Position;
    sourceDoc?: number;
};

export type InfoRecord = {
    type: "info";
    message: string;
    position?: Position;
    sourceDoc?: number;
};
