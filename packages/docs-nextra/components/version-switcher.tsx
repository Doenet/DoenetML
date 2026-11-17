"use client";

import React from "react";
import { usePathname } from "next/navigation";

export type DocsVersionOption = {
    label: string;
    /** `""` for the root, otherwise `/dev`, `/0.7`, …. */
    path: string;
    prerelease?: boolean;
};

/**
 * The URL of the page at `pathname` on the site at `targetBase`, keeping the
 * query and hash. `pathname` is relative to this site's base path, as Next's
 * `usePathname()` returns it.
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
 * GitHub Pages answers a missing page with the root site's 404 page for every
 * version, so checking first is what keeps a switch from landing on a 404 of
 * some other version.
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
