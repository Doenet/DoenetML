# PreFigure Endpoint Testing

This file is a quick checklist for validating the deployed endpoint at:

- `https://prefigure.doenet.org/build`
- `https://prefigure.doenet.org/version`

## Prerequisites

- `curl` installed
- Optional: `jq` for easier JSON inspection

## 0) Version check

```bash
curl -sS https://prefigure.doenet.org/version
```

Expected response:

```json
{"version": "0.5.15"}
```


## 1) Success path: empty graph, no annotations

Create a minimal input file:

```bash
cat > /tmp/prefigure-empty.xml <<'XML'
<diagram dimensions="(0,0,1,1)">
  <graph></graph>
</diagram>
XML
```

Send request:

```bash
curl -sS -X POST "https://prefigure.doenet.org/build" \
  -H "Content-Type: application/xml" \
  --data-binary @/tmp/prefigure-empty.xml
```

Expected response:

- HTTP status: `200`
- JSON fields include:
  - `svg` (non-empty string)
  - `annotationsXml` is `null`
  - `annotationsGenerated` is `false`
  - `cached` is `true` or `false`

Optional quick assert with `jq`:

```bash
curl -sS -X POST "https://prefigure.doenet.org/build" \
  -H "Content-Type: application/xml" \
  --data-binary @/tmp/prefigure-empty.xml \
| jq '{hasSvg:(.svg|type=="string" and (.svg|length>0)), annotationsXmlIsNull:(.annotationsXml==null), annotationsGenerated, cached}'
```

## 2) Error path: malformed XML + debug diagnostics

Send malformed XML and keep status/body:

```bash
curl -sS -o /tmp/prefigure-bad.body -w "%{http_code}\n" \
  -X POST "https://prefigure.doenet.org/build?debug=1" \
  -H "Content-Type: application/xml" \
  --data-binary '<diagram dimensions="(0,0,1,1)"><graph></diagram>'
cat /tmp/prefigure-bad.body
```

Expected response:

- HTTP status: `422`
- `errorCode` is `build_failed`
- Includes diagnostics:
  - `prefigReturnCode`
  - `command`
  - `cwd`
  - `stderr`
  - `stdout`
  - `work_dir_contents` (when `debug=1`)
  - `output_dir_contents` (when `debug=1`)

Optional quick assert with `jq`:

```bash
cat /tmp/prefigure-bad.body | jq '{errorCode, hasDebugLists:(has("work_dir_contents") and has("output_dir_contents"))}'
```

## 3) Cache sanity check

Run the same success request twice and compare `cached`:

```bash
for i in 1 2; do
  curl -sS -X POST "https://prefigure.doenet.org/build" \
    -H "Content-Type: application/xml" \
    --data-binary @/tmp/prefigure-empty.xml \
  | jq '{run:'"$i"', cached, hash}'
done
```

Typically first run is `cached: false` and second run becomes `cached: true` for the same input/hash.

## Notes

- Use `?debug=1` only for troubleshooting error responses.
- Endpoint contract details are documented in:
  - `PreFigure on AWS Lambda: Complete Setup.md`
