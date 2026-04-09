# @doenet/doenetml

## 0.7.13

### Patch Changes

- 75725e5: Improve DoenetML editor autocomplete for references.

    The editor now suggests in-scope names after `$`, offers descendant names and
    properties after `.` on references, and handles completion reopening more
    reliably while typing, deleting, and accepting completions.

- 66d0ddb: Add isAccessibleCallback feature to EditorViewer
- e604d76: expose schemaSubarrays-derived properties in generated Doenet schema to improve documentation
- 544c619: Add graph attributes to control axis tick visibility.

    Graphs now support `displayXAxisTicks` and `displayYAxisTicks`. Tick labels inherit from the corresponding tick visibility setting unless `displayXAxisTickLabels` or `displayYAxisTickLabels` is explicitly specified.

- b380ebc: Improve reference autocomplete behavior by wiring Rust-backed resolver logic and fixing completion visibility/index handling.

    This includes better scope filtering for names, indexed reference completions for takesIndex components, and repeat synthetic name support in autocomplete flows.

- 9ad3a40: Change `<selectPrimeNumbers>` and `<samplePrimeNumbers>` attributes from `minValue`/`maxValue` to `from`/`to`, and add deprecation shims for the old attributes.
- ec9b81f: connect external labels to inputs and answers with `for` attributes

## 0.7.12

### Patch Changes

- 3834b7f: Add DoenetML graph annotation support for PreFigure-rendered graphs.

    This adds conversion of nested graph annotations to PreFigure XML and improves related diagnostics and annotation handling.
