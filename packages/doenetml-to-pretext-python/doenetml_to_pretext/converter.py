"""Main converter implementation using Deno and bundled JS assets."""

import json
import shutil
import subprocess
from pathlib import Path
from typing import Optional

from .exceptions import DenoError, ConversionError, DoenetTimeoutError as DoenetTimeoutError

_PACKAGE_DIR = Path(__file__).resolve().parent
_DIST_INDEX = _PACKAGE_DIR / "js-assets" / "index.js"
_IMPORT_MAP = _PACKAGE_DIR / "import_map.json"


class DoenetConverter:
    """Runs DoenetML-to-PreTeXt conversion by invoking Deno."""

    def __init__(self, deno_executable: Optional[str] = None):
        self.deno_executable = deno_executable or self._find_deno_executable()

    @staticmethod
    def _find_deno_executable() -> str:
        """
        Try to find the Deno executable.
        Returns the path to the Deno executable, or raises FileNotFoundError.
        """
        # 1. Try to import from a Python Deno package (if present)
        try:
            import deno
            return deno.find_deno_bin()
        except ImportError:
            pass

        # 2. Fallback: ask the OS for the deno executable
        deno_path = shutil.which("deno")
        if deno_path:
            return deno_path
        raise FileNotFoundError("Deno executable not found. Install with `pip install deno`.")

    def _resolve_dist_index(self) -> Path:
        """Resolve the path to the bundled JS dist index.js file."""
        if _DIST_INDEX.exists():
            return _DIST_INDEX

        raise OSError(
            "Could not find bundled JS assets at "
            f"{_DIST_INDEX}. Build @doenet/doenetml-to-pretext and ensure the "
            "dist assets are packaged with this Python library."
        )

    def _build_eval_code(self, dist_index_path: Path) -> str:
        dist_url = dist_index_path.resolve().as_uri()
        return (
            f"import {{ doenetMLToPretext }} from {json.dumps(dist_url)};\n"
            "const input = Deno.args[0] ?? '';\n"
            "try {\n"
            "  const output = await doenetMLToPretext(input);\n"
            "  console.log(JSON.stringify({ success: true, result: output }));\n"
            "  Deno.exit(0);\n"
            "} catch (error) {\n"
            "  const message = error instanceof Error ? error.message : String(error);\n"
            "  console.log(JSON.stringify({ success: false, error: message }));\n"
            "  Deno.exit(1);\n"
            "}\n"
        )

    def convert(self, doenetml: str, timeout: int = 30000) -> str:
        """Convert DoenetML to PreTeXt."""
        if shutil.which(self.deno_executable) is None:
            raise OSError(
                f"Deno executable '{self.deno_executable}' was not found on PATH."
            )

        if not _IMPORT_MAP.exists():
            raise DenoError(f"Import map not found at {_IMPORT_MAP}.")

        eval_code = self._build_eval_code(self._resolve_dist_index())

        command = [
            self.deno_executable,
            "eval",
            "--quiet",
            "--ext=ts",
            "--import-map",
            str(_IMPORT_MAP),
            eval_code,
            "--",
            doenetml,
        ]

        try:
            completed = subprocess.run(
                command,
                cwd=str(_PACKAGE_DIR),
                text=True,
                capture_output=True,
                timeout=timeout / 1000,
                check=False,
            )
        except subprocess.TimeoutExpired as exc:
            raise DoenetTimeoutError(f"Conversion timed out after {timeout}ms") from exc

        payload = _extract_last_json_line(completed.stdout)

        if payload is None:
            detail = completed.stderr.strip() or completed.stdout.strip()
            raise ConversionError(
                "Deno conversion returned an unexpected response"
                + (f": {detail}" if detail else ".")
            )

        if not payload.get("success"):
            message = payload.get("error", "Unknown conversion error")
            raise ConversionError(message)

        result = payload.get("result")
        if not isinstance(result, str):
            raise ConversionError("Conversion result was not a string.")

        return result


def _extract_last_json_line(stdout: str) -> Optional[dict]:
    for line in reversed([line.strip() for line in stdout.splitlines() if line.strip()]):
        try:
            value = json.loads(line)
        except json.JSONDecodeError:
            continue

        if isinstance(value, dict):
            return value

    return None


# Global converter instance
_converter: Optional[DoenetConverter] = None


def convert_doenetml_to_pretext(xml_string: str, timeout: int = 30000) -> str:
    """
    Convert DoenetML XML string to PreTeXt XML string using the JS converter via Deno.
    """
    global _converter

    if _converter is None:
        _converter = DoenetConverter()

    return _converter.convert(xml_string, timeout)
