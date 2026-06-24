import { BasicComponent } from "../types";

/**
 * A _Omit component is a special component that cannot be directly authored.
 * It will omit the element and all its children.
 */
export const _Omit: BasicComponent<{}> = () => {
    return null;
};
