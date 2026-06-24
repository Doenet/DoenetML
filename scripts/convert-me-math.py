#!/usr/bin/env python3
"""
Convert `const { ... } = me.math;` → `import { ... } from "mathjs";`
and replace inline `me.math.fn(` calls with `fn(`, adding imports.

Functions injected by math-expressions (not real mathjs exports) are kept
as `const { ... } = me.math;`.
"""
import re
import subprocess
from pathlib import Path

NON_MATHJS = {"dopri"}

def find_files(root):
    result = subprocess.run(
        ["grep", "-rln", r"me\.math",
         "--include=*.ts", "--include=*.tsx", "--include=*.js",
         str(root)],
        capture_output=True, text=True,
    )
    return [Path(p.strip()) for p in result.stdout.splitlines() if p.strip()]

def replace_destructure(m):
    indent = m.group(1)
    names_raw = m.group(2)

    mathjs_imports = []
    keep = []

    for part in re.split(r",\s*", names_raw.strip()):
        part = part.strip()
        if not part:
            continue
        alias = re.match(r"(\w+)\s*:\s*(\w+)", part)
        if alias:
            orig, local = alias.group(1), alias.group(2)
            if orig in NON_MATHJS:
                keep.append(part)
            else:
                mathjs_imports.append(f"{orig} as {local}")
        else:
            if part in NON_MATHJS:
                keep.append(part)
            else:
                mathjs_imports.append(part)

    lines = []
    if mathjs_imports:
        lines.append(f'{indent}import {{ {", ".join(mathjs_imports)} }} from "mathjs";')
    if keep:
        lines.append(f'{indent}const {{ {", ".join(keep)} }} = me.math;')
    return "\n".join(lines)

def process(path):
    text = path.read_text()
    original = text

    # Step 1: replace top-level const { ... } = me.math; destructuring
    text = re.sub(
        r"^(\s*)const\s*\{([^}]+)\}\s*=\s*me\.math\s*;",
        replace_destructure,
        text,
        flags=re.MULTILINE,
    )

    # Step 2: replace inline me.math.fn( calls
    inline_fns = set(re.findall(r"me\.math\.(\w+)\(", text))
    mathjs_inline = inline_fns - NON_MATHJS

    if mathjs_inline:
        for fn in mathjs_inline:
            text = text.replace(f"me.math.{fn}(", f"{fn}(")

        import_stmt = f'import {{ {", ".join(sorted(mathjs_inline))} }} from "mathjs";\n'
        lines = text.splitlines(keepends=True)
        last_imp = max(
            (i for i, line in enumerate(lines) if re.match(r"\s*import[\s{*]", line)),
            default=-1,
        )
        lines.insert(last_imp + 1, import_stmt)
        text = "".join(lines)

    if text != original:
        path.write_text(text)
        return True
    return False

root = Path("/workspaces/DoenetML-2026/packages")
files = find_files(root)
print(f"Scanning {len(files)} files...")

changed = []
for f in sorted(files):
    if process(f):
        changed.append(f)
        print(f"  Updated: {f.relative_to(root.parent)}")

print(f"\nDone. {len(changed)} files updated.")
