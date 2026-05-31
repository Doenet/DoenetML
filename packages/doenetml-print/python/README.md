# python-wasm

This is a Pyodide/WASM compatible version of code that runs PreTeXt. It is made
for use in the browser.

## Contents

`core` contains a copy of PreTeXt's repository with excess file stripped away. It is the same as
the bundled version of `core` that comes with `pretext-cli`.

## Building

To build and package, run

```
python setup.py sdist bdist_wheel
```

and `dist/` will contain your built package.