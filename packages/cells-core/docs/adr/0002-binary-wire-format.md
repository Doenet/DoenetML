# Binary wire format for the DAST

The core receives its document as a flat, columnar binary (`CDST`): a
deduplicated string table plus parallel `u32` arrays for nodes, attributes,
children and reference paths. The existing TypeScript parser still produces
the DAST; `scripts/cdast-encode.mjs` encodes it, and the same encoder runs in
the browser. The core also accepts the DAST JSON that the current DoenetML
worker uses, detected by content, so either path works.

We chose this because deserializing the DAST JSON was the largest startup
cost once compute was shown to be negligible: about 300 ms of a 650 ms core
load at 100k cells, with a 46 MB payload. The binary form is about 40 percent
of the JSON size (most of the remaining bytes are the unique component
names) and loads as a handful of `memcpy`s plus bounds checks. It also
fixes the in-memory shape: the builder walks node indices rather than a
tree of heap-allocated enums, which is what made the components layer
columnar as well (see `ComponentTable` in `document/table.rs`).

## Considered options

- Keep JSON and optimize the deserializer. Done first (hand-written visitor,
  single pass); it halved the time but the remaining cost is inherent to
  parsing text and allocating strings.
- A general serialization format (MessagePack, CBOR, bincode). Rejected: they
  still encode a tree and would need a schema-aware decoder to land in
  columnar arrays; the custom format is under 200 lines on each side.

## Consequences

- The format is versioned by a header `u32`; a change in the DAST subset the
  core consumes requires bumping it on both sides.
- Position information and node kinds the core does not use are dropped at
  encode time, so this format cannot round-trip back to DoenetML text.

## Update (plan 2)

Version 2 adds, per macro path part, the `[index]` expressions as ranges of
ordinary nodes, so `$r[3].p.x` and `$r[$i-2].x` reach the core. Version 1
files still load (with no indices).
