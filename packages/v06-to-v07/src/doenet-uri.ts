import { DastAttribute } from "@doenet/parser";

/**
 * The same contract as the `fetchExternalDoenetML` a host gives the viewer: given the
 * `doenet:<id>` URI of a `copy` or `extend` attribute, resolve to that document's
 * DoenetML — its v0.7 DoenetML, since that is what the converted document will be
 * served — or reject.
 *
 * Like the viewer, the converter passes it any `copy`/`extend` value starting with
 * `doenet:`, so it is also given the v0.6 URIs the converter could not rewrite, such as
 * `doenet:cid=...`, as `toXml` prints them (`&` as `&amp;`). Rejecting is the answer
 * for any it cannot resolve.
 */
export type FetchExternalDoenetML = (uri: string) => Promise<string>;

/**
 * v0.6 named another document as `doenet:activityId=<id>` or `doenet:doenetId=<id>`,
 * often with a `cid` (pinning a version) or a `pageId` alongside. v0.7 names it
 * `doenet:<id>`, both in a `<ref to>` and in a `copy`/`extend` attribute, which the
 * host's `fetchExternalDoenetML` resolves.
 *
 * Returns the v0.7 URI and the parameters it dropped, or `undefined` when there is
 * nothing to rewrite or no faithful rewrite:
 * - the URI is not a `doenet:` one, or is already `doenet:<id>`;
 * - it names no activity (`doenet:cid=...` alone says nothing v0.7 can look up);
 * - the id is not a plain alphanumeric one, as legacy ids starting with `_` are not;
 * - it has a `pageId`, which picks out one page of a multi-page activity — dropping it
 *   would point at the whole activity instead.
 *
 * The id itself is kept as written. Content copied from legacy.doenet.org already had its
 * ids rewritten to the new ones; anything else has to be checked by the author.
 */
export function upgradeDoenetUri(
    uri: string,
): { uri: string; dropped: string[] } | undefined {
    const match = uri.trim().match(/^doenet:([^#]*)(#.*)?$/i);
    if (!match) {
        return undefined;
    }
    const [, body, fragment = ""] = match;
    if (/^[A-Za-z0-9]+(\?.*)?$/.test(body)) {
        return undefined;
    }
    const params = new Map<string, { key: string; value: string }>();
    for (const part of body.split("&")) {
        const eq = part.indexOf("=");
        if (eq === -1) {
            return undefined;
        }
        const key = part.slice(0, eq);
        params.set(key.toLowerCase(), { key, value: part.slice(eq + 1) });
    }
    const idKey = params.has("activityid") ? "activityid" : "doenetid";
    const id = params.get(idKey)?.value;
    if (!id || !/^[A-Za-z0-9]+$/.test(id) || params.has("pageid")) {
        return undefined;
    }
    params.delete(idKey);
    return {
        uri: `doenet:${id}${fragment}`,
        dropped: [...params.values()].map(({ key }) => key),
    };
}

/**
 * The value of `attr` when it is plain text, read without re-escaping it the way
 * `toXml` would; otherwise `undefined`.
 */
export function plainAttributeText(attr: DastAttribute): string | undefined {
    if (!attr.children.every((child) => child.type === "text")) {
        return undefined;
    }
    return attr.children
        .map((child) => (child.type === "text" ? child.value : ""))
        .join("");
}
