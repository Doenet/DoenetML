import { DastElement } from "../../../types";

/**
 * Whether `node` is written with `extend`.
 *
 * An extend is the same component as its source again, so it takes no
 * content of its own: what is written inside it, and the attributes that
 * decide its content, are reported as errors where it is expanded (#2404).
 * A sugar that would turn those attributes into children, or wrap nothing in
 * a generated child, is skipped for it, so that only what the author wrote
 * is reported, and a bare extend has nothing to report.
 */
export function isWrittenWithExtend(node: DastElement) {
    return Object.keys(node.attributes).some(
        (attrName) => attrName.toLowerCase() === "extend",
    );
}
