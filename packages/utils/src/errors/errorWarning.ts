import { DoenetMLRange } from "../ast/logging";

export type ErrorDescription = {
    position: DoenetMLRange;
    message: string;
    displayInActivity?: boolean;
};
export type WarningDescription = {
    position: DoenetMLRange;
    level: number;
    message: string;
};
