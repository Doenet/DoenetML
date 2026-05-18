"""Snapshot tests for DoenetML to PreTeXt converter."""

import json
from pathlib import Path

import pytest

from doenetml_to_pretext import convert_doenetml_to_pretext


def _load_snapshots() -> dict[str, dict[str, str]]:
    snapshots_file = Path(__file__).parent / "snapshots" / "test_converter.json"
    with snapshots_file.open("r", encoding="utf-8") as f:
        return json.load(f)


SNAPSHOTS = _load_snapshots()


@pytest.mark.parametrize(
    "case_name",
    ["simple_conversion", "conversion_with_math", "conversion_wraps_in_article"],
)
def test_converter_snapshots(case_name: str):
    """Compare conversion output against approved snapshots."""
    case = SNAPSHOTS[case_name]
    result = convert_doenetml_to_pretext(case["input"])
    assert result == case["expected"]
