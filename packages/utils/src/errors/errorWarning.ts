import { DoenetMLRange } from "../ast/logging";

export type ErrorDescription = {
    doenetMLrange: DoenetMLRange;
    message: string;
    displayInActivity?: boolean;
};
export type WarningDescription = {
    doenetMLrange: DoenetMLRange;
    level: number;
    message: string;
};
