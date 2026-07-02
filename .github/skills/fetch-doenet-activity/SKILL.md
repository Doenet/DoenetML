---
name: fetch-doenet-activity
description: Get the DoenetML source behind a beta.doenet.org / doenet.org activityViewer link. The pages are a client-rendered SPA, so fetching the URL (WebFetch/curl) returns an empty shell — call the content JSON API instead. Use when asked to read, extract, or reference the DoenetML of a Doenet activity link.
---

# Fetching DoenetML from a Doenet activity link

Use this skill when you need the **DoenetML source** behind a Doenet activity URL such as `https://beta.doenet.org/activityViewer/<contentId>`, where `<contentId>` is the trailing path segment (e.g. `5pDL36qo1gJsogpTjQxVnM`).

## Why the obvious approach fails

The activity pages are a client-rendered React single-page app served from S3/CloudFront. Fetching the page HTML (WebFetch, `curl`, etc.) returns only the empty app shell — the title "Doenet" and no activity content. The DoenetML is loaded at runtime from a JSON API, so you must call that API directly.

## Fast path (verified on beta.doenet.org)

Call the content API with the id from the URL and read `.activity.doenetML`:

```bash
id=5pDL36qo1gJsogpTjQxVnM   # the trailing segment of /activityViewer/<id>
curl -s "https://beta.doenet.org/api/activityEditView/getActivityViewerData/$id" \
  | python3 -c "import json,sys; a=json.load(sys.stdin)['activity']; print(a['doenetML'])"
```

The same JSON also carries `.activity.name` (the human title). The endpoint is public — no auth needed. Related routes in the same family, seen in the site bundle: `…/api/activityEditView/getContentSource/<id>` and `…/api/activityEditView/getPublicContent/<viewId>`.

## If the endpoint 404s or the host differs (self-healing)

This API belongs to the Doenet **website** (a separate product from this rendering-engine repo), and beta is a moving target: the route can change, and production `doenet.org` may differ. Re-derive it from the site's JS bundle rather than guessing:

```bash
# 1. find the main bundle the page loads
curl -s https://beta.doenet.org/activityViewer/<id> | grep -oE '/assets/index-[^"]+\.js'
# 2. pull it and list the content/activity API routes it calls
curl -s https://beta.doenet.org/assets/index-XXXXXXXX.js \
  | grep -oE '`?/api/[a-zA-Z0-9/_.${}-]+' | sort -u | grep -iE 'activity|content|view'
```

Find a `get…ViewerData` / `getContentSource` / `getPublicContent` route, call it with the id, and inspect the JSON for the field holding the source (it was `activity.doenetML` on beta).

## Caveats

- This is the **website/beta API**, not part of this repo — treat it as external and subject to change. If the literal URL above fails, trust the self-healing grep over the cached route.
- Fetches **public** content only. Private or unshared activities need authentication this skill doesn't cover.
