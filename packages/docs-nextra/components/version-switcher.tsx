"use client";

import React from "react";
import { usePathname } from "next/navigation";

export type DocsVersionOption = {
    label: string;
    /** `/0.7`, `/0.8`, … (or `""` for the root). */
    path: string;
    prerelease?: boolean;
};

/**
 * The URL of the page at `pathname` on the site at `targetBase`, without a
 * trailing slash (except a home page's). `pathname` is relative to this site's
 * base path, as Next's `usePathname()` returns it, and has no query or hash;
 * the switcher appends those itself.
 */
export function pageUrlOn(targetBase: string, pathname: string): string {
    const page = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
    const url = `${targetBase}${page}`;
    return url === "" ? "/" : url;
}

/**
 * Go to the page at `url`, or to the home page at `homeUrl` if the other
 * version has no such page (a component added or removed between versions).
 *
 * Without the check, a switch to a page the other version lacks lands on a
 * 404 page: on GitHub Pages most likely the site's root `404.html` (GitHub
 * documents a custom 404 page only at the site's root), which the deploy
 * writes with `scripts/write-redirects.mjs`. A check that fails (offline,
 * say) goes to `url` anyway.
 */
async function navigateOrHome(url: string, homeUrl: string) {
    try {
        const response = await fetch(url, { method: "HEAD" });
        window.location.href = response.ok ? url : homeUrl;
    } catch {
        window.location.href = url;
    }
}

/**
 * A select in the navbar that switches to the same page in another deployed
 * version of the docs. Rendered only when the deploy configured more than one
 * version (see `docs-versions.mjs`).
 */
export function VersionSwitcher({
    versions,
    current,
}: {
    versions: DocsVersionOption[];
    current: string;
}) {
    const pathname = usePathname() ?? "/";
    if (versions.length < 2) {
        return null;
    }
    return (
        <label className="docs-version-switcher">
            <span className="docs-version-switcher-label">Version</span>
            <select
                value={current}
                aria-label="Documentation version"
                onChange={(event) => {
                    const target = event.target.value;
                    if (target === current) {
                        return;
                    }
                    const suffix =
                        window.location.search + window.location.hash;
                    void navigateOrHome(
                        pageUrlOn(target, pathname) + suffix,
                        pageUrlOn(target, "/"),
                    );
                }}
            >
                {versions.map((v) => (
                    <option key={v.path} value={v.path}>
                        {v.label}
                    </option>
                ))}
            </select>
        </label>
    );
}

/**
 * The banner on an unreleased version's pages: what it is, and a link to the
 * same page in the current release.
 */
export function PrereleaseBannerContent({
    release,
}: {
    release: DocsVersionOption;
}) {
    const pathname = usePathname() ?? "/";
    const releaseUrl = pageUrlOn(release.path, pathname);
    return (
        <>
            These docs are for an unreleased version of DoenetML. Some of what
            they describe does not work in {release.label}, the current release.{" "}
            <a
                href={releaseUrl}
                onClick={(event) => {
                    // Leave a modified click (open in a new tab or window)
                    // to the browser, which follows the `href` unchecked.
                    if (
                        event.button !== 0 ||
                        event.metaKey ||
                        event.ctrlKey ||
                        event.shiftKey ||
                        event.altKey
                    ) {
                        return;
                    }
                    event.preventDefault();
                    void navigateOrHome(
                        releaseUrl,
                        pageUrlOn(release.path, "/"),
                    );
                }}
                style={{ textDecoration: "underline" }}
            >
                View the {release.label} docs →
            </a>
        </>
    );
}
