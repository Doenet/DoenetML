"""Setup configuration for doenet-to-pretext Python package."""

from pathlib import Path
import shutil

from setuptools import setup, find_packages
from setuptools.command.build_py import build_py as _build_py


class build_py(_build_py):
    """Copy JavaScript runtime assets into wheel build output."""

    def run(self):
        super().run()
        self._copy_runtime_assets()

    def _copy_runtime_assets(self):
        package_root = Path(__file__).resolve().parent / "doenetml_to_pretext"
        source_dist = package_root / "js-assets"
        if source_dist.is_symlink():
            source_dist = source_dist.resolve()

        if not source_dist.exists():
            raise RuntimeError(
                "Could not find JS dist assets. Build ../doenetml-to-pretext first."
            )

        build_package_root = Path(self.build_lib) / "doenetml_to_pretext"
        build_package_root.mkdir(parents=True, exist_ok=True)

        target_dist = build_package_root / "js-assets"
        shutil.copytree(source_dist, target_dist, dirs_exist_ok=True)

        for filename in ("import_map.json", "py.typed"):
            source_file = package_root / filename
            if source_file.exists():
                shutil.copy2(source_file, build_package_root / filename)

setup(
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    cmdclass={"build_py": build_py},
)
