#!/usr/bin/env python3
"""Diff two Vitest runs test-by-test.

The interesting number after a change is never the total — it is which
individual tests moved, and in which direction. A change that fixes 70 tests
and breaks 3 looks like "+67" in a summary and like a bug in this output.

Runs are identified by `<file> :: <test title>`, so a test that was renamed
shows up as one gone and one new rather than as a silent pass.

Usage: compare-test-runs.py --before a*.json --after b*.json [--show N]
"""

import argparse
import json
import sys
from collections import defaultdict


def load(paths):
    """{(spec, title): status} across every report in `paths`."""
    out = {}
    for path in paths:
        data = json.load(open(path))
        for suite in data.get("testResults", []):
            spec = suite.get("name", "?").split("/src/test/")[-1]
            for a in suite.get("assertionResults", []):
                out[(spec, a["title"])] = a["status"]
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--before", nargs="+", required=True)
    ap.add_argument("--after", nargs="+", required=True)
    ap.add_argument("--show", type=int, default=25)
    args = ap.parse_args()

    before, after = load(args.before), load(args.after)

    fixed, broken, gone, new = [], [], [], []
    for key, was in before.items():
        now = after.get(key)
        if now is None:
            gone.append(key)
        elif was == "failed" and now == "passed":
            fixed.append(key)
        elif was == "passed" and now == "failed":
            broken.append(key)
    for key in after:
        if key not in before:
            new.append(key)

    def count(d, status):
        return sum(1 for v in d.values() if v == status)

    print(f"before: {len(before):5d} tests, {count(before,'passed'):5d} passed, "
          f"{count(before,'failed'):5d} failed")
    print(f"after:  {len(after):5d} tests, {count(after,'passed'):5d} passed, "
          f"{count(after,'failed'):5d} failed")
    print(f"\nfixed:  {len(fixed)}\nbroken: {len(broken)}"
          f"\ngone:   {len(gone)}\nnew:    {len(new)}\n")

    # Regressions are the whole point of running this, so they print in full.
    if broken:
        print("=== BROKEN (passed before, fails now) ===")
        by_spec = defaultdict(list)
        for spec, title in broken:
            by_spec[spec].append(title)
        for spec, titles in sorted(by_spec.items()):
            print(f"  {spec}  ({len(titles)})")
            for t in titles[: args.show]:
                print(f"      {t}")
        print()

    if fixed:
        by_spec = defaultdict(int)
        for spec, _ in fixed:
            by_spec[spec] += 1
        print("=== FIXED, by spec ===")
        for spec, n in sorted(by_spec.items(), key=lambda kv: -kv[1])[: args.show]:
            print(f"  {n:5d}  {spec}")
    return 1 if broken else 0


if __name__ == "__main__":
    sys.exit(main())
