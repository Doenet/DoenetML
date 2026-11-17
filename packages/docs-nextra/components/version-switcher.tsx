import React from "react";
import { useRouter } from "next/router";
import { currentVersion, docsVersions } from "../docs-versions.mjs";

/**
 * The URL of the page at `pathname` on the site at `targetBase`, without a
 * trailing slash (except a home page's). `pathname` is relative to this site's
 * base path and has no query or hash.
 */
export function pageUrlOn(targetBase: string, pathname: string): string {
    const page = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
    const url = `${targetBase}${page}`;
    return url === "" ? "/" : url;
}

/**
 * Where switching to the site at `targetBase` goes from the page at `asPath`:
 * the same page (`url`), or that site's home page (`homeUrl`) if it has no
 * such page. `asPath` is the router's: relative to the base path, with the
 * query and hash. The path ends at the first `?` or `#`; the rest is kept
 * verbatim (a query may contain `?`).
 */
export function switchTargets(
    targetBase: string,
    asPath: string,
): { url: string; homeUrl: string } {
    const end = asPath.search(/[?#]/);
    const pathname = end === -1 ? asPath : asPath.slice(0, end);
    const suffix = end === -1 ? "" : asPath.slice(end);
    return {
        url: pageUrlOn(targetBase, pathname) + suffix,
        homeUrl: pageUrlOn(targetBase, "/"),
    };
}

/**
 * Go to the page at `url`, or to the home page at `homeUrl` if the other
 * version has no such page (a component added or removed between versions).
 *
 * Without the check, a switch to a page the other version lacks lands on a
 * 404 page: on GitHub Pages most likely the site's root `404.html` (GitHub
 * documents a custom 404 page only at the site's root), which the deploy
 * writes with `main`'s `scripts/write-redirects.mjs`. A check that fails
 * (offline, say) goes to `url` anyway.
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
                    const { url, homeUrl } = switchTargets(
                        target,
                        router.asPath,
                    );
                    void navigateOrHome(url, homeUrl);
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
