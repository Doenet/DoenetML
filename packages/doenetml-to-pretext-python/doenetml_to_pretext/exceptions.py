"""Exceptions for doenet-to-pretext converter."""


class DoenetConversionError(Exception):
    """Base exception for DoenetML to PreTeXt conversion errors."""

    pass


class ConversionError(DoenetConversionError):
    """Raised when DoenetML to PreTeXt conversion fails."""

    pass


class BrowserError(DoenetConversionError):
    """Raised when browser initialization or execution fails."""

    pass


class TimeoutError(ConversionError):
    """Raised when conversion times out."""

    pass
