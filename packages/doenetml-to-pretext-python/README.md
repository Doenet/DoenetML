# doenetml-to-pretext

Python package for converting DoenetML to PreTeXt using Deno.

## Installation

```bash
pip install doenetml-to-pretext
```

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

## License

AGPL-3.0-or-later
