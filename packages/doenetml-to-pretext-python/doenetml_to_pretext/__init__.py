"""DoenetML to PreTeXt converter using Deno."""

from importlib.metadata import PackageNotFoundError, version

from .converter import (
    convert_doenetml_to_pretext,
    convert_multiple_doenetml_to_pretext,
)
from .exceptions import ConversionError, DenoError, DoenetTimeoutError

try:
    __version__ = version("doenetml-to-pretext")
except PackageNotFoundError:
    __version__ = "0.0.0"
__all__ = [
    "convert_doenetml_to_pretext",
    "convert_multiple_doenetml_to_pretext",
    "ConversionError",
    "DenoError",
    "DoenetTimeoutError",
]
