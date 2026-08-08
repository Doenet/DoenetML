#!/usr/bin/env python3
"""Classify Rust-engine test failures by the *mathematics* that diverged.

Consumes a Vitest JSON report produced while `@doenet/math` was built with
DOENET_MATH_ENGINE=rust, and buckets each failure by what actually differs
between the expected (JavaScript-engine) and received (Rust-engine) values —
ordering, exact-vs-decimal, notation, precision, and so on — rather than by
which spec file it lives in.

The full suite exhausts the heap in one process (a pre-existing DoenetML memory
problem, not an engine difference — the JavaScript engine OOMs identically), so
it is run as `vitest --shard=i/N` and several reports are passed here at once.

Usage: analyze-math-divergences.py <report.json>... [--examples N] [--list BUCKET]
"""

import argparse
import json
import re
import sys
from collections import Counter, defaultdict

# Vitest renders assertion failures with these lines.
EXPECTED_RE = re.compile(r"^Expected:\s*(.*)$", re.M)
RECEIVED_RE = re.compile(r"^Received:\s*(.*)$", re.M)
INLINE_RE = re.compile(r"expected\s+(.+?)\s+to (?:equal|be|deeply equal)\s+(.+?)(?:\n|$)", re.S)

NUM_RE = re.compile(r"-?\d+\.?\d*(?:[eE][-+]?\d+)?")


def extract_pair(msg):
    """(received, expected) as strings, or (None, None)."""
    e, r = EXPECTED_RE.search(msg), RECEIVED_RE.search(msg)
    if e and r:
        return r.group(1).strip(), e.group(1).strip()
    m = INLINE_RE.search(msg)
    if m:
        # Vitest's inline form is "expected <received> to equal <expected>".
        return m.group(1).strip(), m.group(2).strip()
    return None, None


def norm_ws(s):
    return re.sub(r"\s+", "", s)


def sorted_chars(s):
    return "".join(sorted(norm_ws(s)))


def classify(received, expected, msg):
    """Return (bucket, note). Order matters: first match wins."""
    if received is None:
        if "not implemented" in msg:
            return "unimplemented method", ""
        if "unexpected value" in msg:
            return "rejected tree leaf", ""
        if "is not a function" in msg:
            return "missing API", ""
        return "non-assertion error", ""

    rw, ew = norm_ws(received), norm_ws(expected)

    if rw == ew:
        return "whitespace only", f"{expected!r} vs {received!r}"

    # Same characters, different arrangement => operands were reordered.
    if sorted_chars(received) == sorted_chars(expected) and rw != ew:
        return "term/factor ordering", f"{expected} -> {received}"

    rn = NUM_RE.findall(received)
    en = NUM_RE.findall(expected)

    # Fraction vs decimal spelling of the same value.
    def has_frac(s):
        return "frac" in s or re.search(r"\d\s*/\s*\d", s) or '"/"' in s

    if has_frac(expected) and not has_frac(received) and rn:
        return "exact fraction rendered as decimal", f"{expected} -> {received}"
    if has_frac(received) and not has_frac(expected) and en:
        return "decimal rendered as fraction", f"{expected} -> {received}"

    # Scientific notation vs expanded decimal.
    sci = re.compile(r"(10\^|\\cdot10|[eE][-+]?\d)")
    if bool(sci.search(expected)) != bool(sci.search(received)):
        return "scientific notation vs expanded decimal", f"{expected} -> {received}"

    # Numerically equal, textually different => pure formatting.
    if rn and en and len(rn) == len(en):
        try:
            if all(abs(float(a) - float(b)) < 1e-12 for a, b in zip(rn, en)):
                return "same numbers, different formatting", f"{expected} -> {received}"
        except ValueError:
            pass
        try:
            if all(abs(float(a) - float(b)) < 1e-6 for a, b in zip(rn, en)):
                return "numeric precision (<1e-6)", f"{expected} -> {received}"
        except ValueError:
            pass

    # Digit-count differences with the same leading digits => padding/rounding.
    if rn and en and rn[0].rstrip("0").rstrip(".") == en[0].rstrip("0").rstrip("."):
        return "digit padding / display rounding", f"{expected} -> {received}"

    # One side collapsed to a shorter expression => simplification strength.
    if len(rw) < len(ew) * 0.8:
        return "more aggressive simplification", f"{expected} -> {received}"
    if len(ew) < len(rw) * 0.8:
        return "less aggressive simplification", f"{expected} -> {received}"

    return "value disagreement", f"{expected} -> {received}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("reports", nargs="+")
    ap.add_argument("--examples", type=int, default=3)
    ap.add_argument("--list", metavar="BUCKET",
                    help="print every failure in this bucket instead of a summary")
    args = ap.parse_args()

    buckets = Counter()
    examples = defaultdict(list)
    specs = defaultdict(Counter)
    listing = []
    total = passed = 0

    for report in args.reports:
        data = json.load(open(report))
        for suite in data.get("testResults", []):
            name = suite.get("name", "?").split("/src/test/")[-1]
            for a in suite.get("assertionResults", []):
                total += 1
                if a["status"] == "passed":
                    passed += 1
                    continue
                if a["status"] != "failed":
                    continue
                msg = " ".join(a.get("failureMessages", []))
                received, expected = extract_pair(msg)
                bucket, note = classify(received, expected, msg)
                buckets[bucket] += 1
                specs[bucket][name] += 1
                if len(examples[bucket]) < args.examples and note:
                    examples[bucket].append((a["title"], note))
                if args.list and bucket == args.list:
                    listing.append((name, a["title"], note or msg[:400]))

    if args.list:
        for name, title, note in listing:
            print(f"{name}\n  {title}\n  {note}\n")
        print(f"{len(listing)} failures in {args.list!r}")
        return 0

    failed = sum(buckets.values())
    print(f"{total} tests, {passed} passed, {failed} failed "
          f"({100 * passed / total:.1f}% pass)\n")
    print("Divergences by the mathematics that differs:\n")
    for bucket, n in buckets.most_common():
        top = ", ".join(f"{f} ({c})" for f, c in specs[bucket].most_common(3))
        print(f"{n:5d}  {bucket}")
        print(f"        specs: {top}")
        for title, note in examples[bucket]:
            print(f"        · {note[:150]}")
        print()
    return 0


if __name__ == "__main__":
    sys.exit(main())
