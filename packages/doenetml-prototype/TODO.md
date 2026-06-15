# Renderers to implement

Components present in `doenetml` that are missing from `doenetml-prototype`,
ordered by complexity. Use `npm run create-renderer-stub` to scaffold each one.

t - textmode implemented 
g - graphmode implemented
b - both

## Trivial — static character output (~18 lines each)

- [x] `br`
- [x] `hr`
- [x] `ellipsis`
- [x] `mdash`
- [x] `nbsp`
- [x] `ndash`
- [x] `lq`
- [x] `rq`
- [x] `lsq`
- [x] `rsq`
- [ ] `sq`

## Minimal wrapper — single HTML element with children (~19–37 lines)

- [x] `q`
- [ ] `c`
- [ ] `asList`
- [ ] `tag`
- [ ] `alert`
- [ ] `blockQuote`
- [ ] `row`

## Simple with minor state/style (~40–82 lines)

- [ ] `feedback`
- [ ] `pre`
- [ ] `tabular`
- [ ] `containerInline`
- [ ] `summaryStatistics`
- [ ] `containerBlock`

## Medium — layout logic or conditional rendering (~83–160 lines)

- [ ] `table`
- [ ] `cell`
- [ ] `spreadsheet`
- [ ] `codeEditor`
- [ ] `footnote`
- [ ] `list`
- [ ] `sideBySide`
- [ ] `hint`
- [ ] `solution`
- [ ] `embed`
- [ ] `ref`
- [ ] `figure`
- [ ] `pretzel`

## Substantial — significant props, DOM manipulation, or interaction (~200–360 lines)

- [ ] `regionBetweenCurveXAxis`
- [ ] `regionBetweenCurves`
- [ ] `orbitalDiagram`
- [ ] `pegboard`
- [t] `angle`
- [ ] `matrixInput`
- [ ] `graph`
- [ ] `line`
- [ ] `ray`
- [ ] `label`
- [ ] `legend`
- [ ] `prefigure`

## Complex — full interactive components with actions/effects (~390–610 lines)

- [ ] `subsetOfRealsInput`
- [ ] `number`
- [ ] `paginatorControls`
- [ ] `cobwebPolyline`
- [ ] `point`
- [ ] `polygon`
- [ ] `polyline`
- [ ] `vector`
- [ ] `lineSegment`
- [ ] `video`
- [ ] `section`
- [ ] `button`
- [ ] `slider`
- [ ] `orbitalDiagramInput`

## Most complex — large interactive UI with deep JSXGraph or MathQuill integration (~650–1138 lines)

- [ ] `booleanInput`
- [p] `textInput` - text mode but without check work buttons
- [ ] `image`
- [ ] `circle`
- [ ] `mathInput`
- [ ] `curve`
