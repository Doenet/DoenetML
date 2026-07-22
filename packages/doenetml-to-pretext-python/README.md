# doenetml-to-pretext

Python package for converting DoenetML to PreTeXt using Deno.

> **Requires [Deno](https://deno.com/) at runtime.** Conversions shell out to
> Deno, so it must be available on your `PATH` (or install the [`deno`](https://pypi.org/project/deno/)
> pip package). `pip install doenetml-to-pretext` alone does **not** install Deno.

## Installation

```bash
pip install doenetml-to-pretext
```

The wheel bundles the compiled JavaScript converter, but you must supply Deno
yourself — either a system install on `PATH` or `pip install deno`.

## Usage

```python
from doenetml_to_pretext import convert_doenetml_to_pretext

doenetml = '<p>Hello <m>\\frac{1}{2}</m></p>'
pretext_xml = convert_doenetml_to_pretext(doenetml)
print(pretext_xml)
```

## Requirements

- Python 3.8+
- Deno

## API

### `convert_doenetml_to_pretext(doenetml: str, timeout: int = 30000) -> str`

Converts a DoenetML XML string to PreTeXt XML.

**Parameters:**
- `doenetml` (str): DoenetML XML source code
- `timeout` (int): Timeout in milliseconds for conversion (default: 30000)

**Returns:**
- str: PreTeXt XML output

**Raises:**
- `ConversionError`: If conversion fails
- `BrowserError`: If browser initialization fails
- `TimeoutError`: If conversion times out

## Examples

### Simple conversion
```python
from doenetml_to_pretext import convert_doenetml_to_pretext

xml = '<p>Test</p>'
result = convert_doenetml_to_pretext(xml)
```

### With error handling
```python
from doenetml_to_pretext import convert_doenetml_to_pretext, ConversionError

try:
    result = convert_doenetml_to_pretext('<p>Test</p>')
except ConversionError as e:
    print(f"Conversion failed: {e}")
```

## Development

Install dev dependencies:
```bash
pip install -e ".[dev]"
```

Build a wheel (`.whl`) (might need `pip install build` first):
```bash
python -m build --wheel
```

The built wheel will be placed in `dist/`.

Run tests:
```bash
pytest
```

## Publishing

Releases are published to [PyPI](https://pypi.org/project/doenetml-to-pretext/)
automatically by the
[`publish-doenetml-to-pretext-python.yml`](../../.github/workflows/publish-doenetml-to-pretext-python.yml)
GitHub Actions workflow, using [Trusted Publishing](https://docs.pypi.org/trusted-publishers/)
(OIDC) — no API token is stored.

- **Version:** derived from `packages/doenetml/package.json`, so it stays in
  lockstep with `@doenet/doenetml`. There is no separate version to bump here.
- **Trigger:** GitHub `release` events only (the same trigger as the npm
  production release), never pushes to `main`. Cutting a release whose tag
  matches the `doenetml` version publishes the matching wheel.
- **Dry run:** the workflow can be run manually (`workflow_dispatch`) targeting
  [TestPyPI](https://test.pypi.org/) to validate packaging before a real release.

The wheel bundles the built JS assets from `../doenetml-to-pretext`, so that
package must be built first; the workflow (and the `npm run build` wireit graph)
handles this automatically.

## License

AGPL-3.0-or-later
