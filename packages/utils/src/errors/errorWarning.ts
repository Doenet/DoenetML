import { position } from "../ast/logging";

export type ErrorDescription = {
    position: position;
    message: string;
    displayInActivity?: boolean;
};
export type WarningDescription = {
    position: position;
    level: number;
    message: string;
};
