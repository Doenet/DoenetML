import React from "react";
import { UNRELEASED } from "../scripts/schema-history-keys";

/**
 * Inline marker for the release a component, attribute, property, or one of
 * the values an enumerated attribute accepts, arrived in.
 *
 * Two kinds, and only one of them is visible by default:
 *
 *   - **In development** — in the working-tree schema but in no release. The
 *     docs site deploys from every push to `main`, so an author reading it is
 *     usually on an older release than the page describes; this is the marker
 *     that stops them writing a feature that silently does nothing.
 *   - **Added in X** — released, and so true for most readers. It ships in the
 *     DOM but `app/style.css` hides it, because badging 1,900 items on a quiet
 *     page would say nothing to anyone. Carrying the version in `data-since`
 *     is what lets a version selector reveal the ones newer than the reader's
 *     by CSS alone, with no re-render.
 */
export function SinceBadge({ since }: { since?: string }) {
    if (since === undefined) {
        return null;
    }
    const inDevelopment = since === UNRELEASED;
    return (
        <span
            className={
                inDevelopment
                    ? "since-badge since-badge-development"
                    : "since-badge since-badge-released"
            }
            data-since={since}
            title={
                inDevelopment
                    ? "In development: not in any released version yet"
                    : undefined
            }
            // Faceting for Pagefind, which indexes the built HTML. Filter
            // values are collected per page, so a search can be narrowed to
            // the pages carrying an item from a given release, or one still
            // in development. `data-pagefind-ignore` keeps the badge's own
            // words out of the index and out of result excerpts — with the
            // default value, `index`, filters inside it are still collected.
            data-pagefind-filter={`version:${
                inDevelopment ? "In development" : since
            }`}
            data-pagefind-ignore=""
        >
            {inDevelopment ? "In development" : `Added in ${since}`}
        </span>
    );
}
