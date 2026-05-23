from setuptools import setup, find_packages

setup(
    name="pretext_wasm",
    version="0.1.0",
    author="Jason Siefken",
    description="Run PreTeXt in a WASM environment",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/siefkenj/pretext-book",
    packages=[*find_packages(), "pretext_wasm.core.pretext"],
    include_package_data=True,
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.8",
)
