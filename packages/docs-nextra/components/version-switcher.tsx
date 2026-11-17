import React from "react";
import { useRouter } from "next/router";
import { currentVersion, docsVersions } from "../docs-versions.mjs";

/**
 * The URL of the page at `pathname` on the site at `targetBase`. `pathname`
 * is relative to this site's base path, as the router's `asPath` gives it.
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
export function VersionSwitcher() {
    const router = useRouter();
    if (currentVersion === undefined || docsVersions.length < 2) {
        return null;
    }
    const current = currentVersion.path;
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
                    // `asPath` is relative to the base path and carries the
                    // query and hash.
                    const [pathAndQuery, hash] = router.asPath.split("#");
                    const [pathname, query] = pathAndQuery.split("?");
                    const suffix =
                        (query ? `?${query}` : "") + (hash ? `#${hash}` : "");
                    void navigateOrHome(
                        pageUrlOn(target, pathname) + suffix,
                        pageUrlOn(target, "/"),
                    );
                }}
            >
                {docsVersions.map((v) => (
                    <option key={v.path} value={v.path}>
                        {v.label}
                    </option>
                ))}
            </select>
        </label>
    );
}
