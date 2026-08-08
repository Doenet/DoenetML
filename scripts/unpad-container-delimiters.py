#!/usr/bin/env python3
"""Drop the padding legacy math-expressions put inside container delimiters.

The legacy JavaScript engine rendered containers — tuples, vectors, intervals,
arrays, sets — with a space inside each delimiter:

    ( 0, 0 )      [ -1, 6 ]      { 1, 2, 3 }      [ [ 1, 2 ], [ 3, 4 ] ]

The Rust engine does not:

    (0, 0)        [-1, 6]        {1, 2, 3}        [[1, 2], [3, 4]]

Only the *text* renderer differs. `toLatex` is byte-identical on both engines —
both emit `\\left( 1, 2 \\right)`, padding included — so LaTeX expectations must
be left alone. Function application (`f(x)`) was never padded by either engine.

The rewrite therefore applies to string-literal contents only, and skips:

  * template literals — they carry multi-line DoenetML source, where the
    "padding" is indentation;
  * any literal containing a backslash — that is the LaTeX tell (`\\left(`,
    `\\(`, `\\{`), and no text-renderer output contains one;
  * runs of whitespace that include a newline, which are never a rendered
    delimiter pad.

Usage:  unpad-container-delimiters.py <path>... [--dry-run]
"""

import argparse
import re
import sys
from pathlib import Path

# Padding counts as container padding only when it separates the delimiter from
# real content. `( 2, 3 )` qualifies; `(, )` does not — that one is two blank
# references sitting inside literal prose parentheses, and collapsing it to
# `(,)` changes text the engine never rendered. So an open delimiter must be
# followed by something that is not a comma or a closing delimiter, and a
# closing delimiter must be preceded by something that is not a comma or an
# opening one. Nesting (`[ [ 1, 2 ] ]`) still qualifies in both directions.
OPEN_PAD = re.compile(r"([(\[{])[ \t]+(?=[^\s,)\]}])")
CLOSE_PAD = re.compile(r"(?<=[^\s,(\[{])[ \t]+([)\]}])")

# A quoted string literal: opening quote, escaped-or-plain body, closing quote.
# Template literals are deliberately absent (see module docstring).
STRING_LITERAL = re.compile(r"""(['"])((?:\\.|(?!\1)[^\\\n])*)\1""")


def unpad(body: str) -> str:
    """Remove delimiter padding from one string literal's contents."""
    # A backslash means LaTeX, whose spacing is unchanged between engines.
    if "\\" in body:
        return body
    return CLOSE_PAD.sub(r"\1", OPEN_PAD.sub(r"\1", body))


def rewrite(source: str) -> tuple[str, int]:
    """Return (new source, number of literals changed)."""
    changed = 0

    def repl(m: re.Match) -> str:
        nonlocal changed
        quote, body = m.group(1), m.group(2)
        new = unpad(body)
        if new != body:
            changed += 1
        return f"{quote}{new}{quote}"

    return STRING_LITERAL.sub(repl, source), changed


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("paths", nargs="+", type=Path)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    files = [p for root in args.paths for p in (
        sorted(root.rglob("*.ts")) if root.is_dir() else [root]
    )]

    total_files = total_literals = 0
    for path in files:
        source = path.read_text()
        new, changed = rewrite(source)
        if not changed:
            continue
        total_files += 1
        total_literals += changed
        if not args.dry_run:
            path.write_text(new)
        print(f"{changed:5d}  {path}")

    verb = "would rewrite" if args.dry_run else "rewrote"
    print(f"\n{verb} {total_literals} string literals across {total_files} files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
