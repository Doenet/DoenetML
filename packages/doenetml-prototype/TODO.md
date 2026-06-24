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
- [x] `sq`

## Simple inline wrappers (~19–37 lines)

- [x] `q`
- [x] `c` / `attr` — inline code
- [x] `tag` / `tagc`
- [x] `alert`
- [x] `em`
- [x] `asList`
- [x] `blockQuote`
- [x] `p`
- [x] `ol` / `ul` / `li`
- [x] `title`
- [x] `aside`
- [ ] `tage` — closing-tag counterpart to `tag`
- [ ] `term` — inline term definition (semantically like `em`)
- [ ] `div` / `span` — generic containers

## Math display (~30–50 lines)

- [x] `m` — inline math
- [x] `math` / `md` / `mdn` / `men` — display and numbered math

## Math/chemistry expression elements (all render via math component)

- [x] `abs`
- [x] `angle` [t]
- [x] `atom`
- [x] `ceil`
- [x] `clampNumber`
- [x] `convertSetToList`
- [x] `count`
- [x] `electronConfiguration`
- [x] `evaluate`
- [x] `extractMath`
- [x] `floor`
- [x] `function`
- [x] `gcd`
- [x] `interval`
- [x] `ion`
- [x] `ionicCompound`
- [x] `lcm`
- [x] `matrix` — display only (not input)
- [x] `max` / `min`
- [x] `mean` / `median` / `standardDeviation` / `variance`
- [x] `mod`
- [x] `odeSystem`
- [x] `product` / `sum`
- [x] `rightHandSide`
- [x] `round`
- [x] `setSmallToZero`
- [x] `sign`
- [x] `subsetOfReals`
- [x] `wrapNumberPeriodic`

## Value display elements (~30–60 lines)

- [x] `text`
- [x] `boolean`
- [x] `number`
- [x] `point` — text-mode coordinate display
- [x] `orbitalDiagram`
- [x] `xref`
- [ ] `numberList` / `textList` / `booleanList` / `mathList`
- [ ] `pointList`
- [ ] `description` / `shortDescription`
- [ ] `caption`
- [ ] `annotation`
- [ ] `lorem`

## Verbatim / code display (~30–60 lines)

- [ ] `pre` / `displayDoenetML`

## Simple interactive elements (~40–82 lines)

- [x] `answer`
- [x] `booleanInput`
- [x] `choiceInput`
- [x] `button` (`updateValue` / `callAction` / `triggerSet`)
- [ ] `summaryStatistics`
- [ ] `containerInline` / `containerBlock`

## Structural / division elements (~50–120 lines)

- [x] `document`
- [x] `division` — covers `section`, `subsection`, `subsubsection`, `paragraphs`, `example`, `definition`, `theorem`, `note`, `proof`, `exercise`, `question`, `activity`, `objectives`, `part`, `task`, `problems`, `exercises`
- [x] `problem`
- [x] `graph` — graph container
- [ ] `hint`
- [ ] `solution`
- [ ] `feedback`
- [ ] `ref`
- [ ] `footnote`
- [ ] `embed`
- [ ] `prefigure`

## Layout elements (~83–160 lines)

- [ ] `sideBySide` / `sbsGroup` / `stack` / `panel`
- [ ] `table`
- [ ] `tabular`
- [ ] `row` / `cell` / `column`
- [ ] `spreadsheet`
- [ ] `figure`
- [ ] `list`

## Media (~100–200 lines)

- [ ] `image`
- [ ] `video`

## Complex interactive (~200–400 lines)

- [p] `textInput` — text mode but without check work buttons
- [ ] `mathInput`
- [ ] `matrixInput`
- [ ] `slider`
- [ ] `subsetOfRealsInput`
- [ ] `orbitalDiagramInput`
- [ ] `codeEditor`
- [ ] `pegboard`
- [ ] `pretzel`
- [ ] `paginatorControls`
- [ ] `label` — interactive element label

## Graph-only elements (require a `<graph>` container)

- [ ] `attractTo` / `attractToConstraint` / `attractToGrid`
- [ ] `bestFitLine`
- [ ] `bezierControls`
- [ ] `circle`
- [ ] `cobwebPolyline`
- [ ] `constrainTo` / `constrainToGraph` / `constrainToGrid` / `constrainToInterior`
- [ ] `constraintUnion`
- [ ] `controlVectors`
- [ ] `coords`
- [ ] `curve`
- [ ] `endpoint`
- [ ] `equilibriumCurve` / `equilibriumLine` / `equilibriumPoint`
- [ ] `legend`
- [ ] `line`
- [ ] `lineSegment`
- [ ] `parabola`
- [ ] `polygon`
- [ ] `polyline`
- [ ] `ray`
- [ ] `rectangle`
- [ ] `regionBetweenCurveXAxis` / `regionBetweenCurves` / `regionHalfPlane`
- [ ] `regularPolygon`
- [ ] `triangle`
- [ ] `vector`
- [ ] `xLabel` / `yLabel`

## Additional math expression elements (render via math component)

- [ ] `clampFunction`
- [ ] `derivative`
- [ ] `eigenDecomposition`
- [ ] `extractMathOperator`
- [ ] `functionIterates`
- [ ] `intersection`
- [ ] `intervalList`
- [ ] `me`
- [ ] `mrow`
- [ ] `periodicSet`
- [ ] `piecewiseFunction`
- [ ] `sequence`
- [ ] `solveEquations`
- [ ] `substitute`
- [ ] `tupleList`
- [ ] `wrapFunctionPeriodic`

## Additional text display elements

- [ ] `intComma` — number with comma formatting
- [ ] `integer` — integer display
- [ ] `latex` — raw LaTeX passthrough
- [ ] `pluralize` — conditional pluralization
- [ ] `vectorList`

## Logic, conditional, and container elements

- [ ] `animateFromSequence`
- [ ] `annotations`
- [ ] `award`
- [ ] `cascade` / `cascadeMessage`
- [ ] `case`
- [ ] `cellBlock`
- [ ] `choice`
- [ ] `collect`
- [ ] `conclusion` / `introduction`
- [ ] `conditionalContent`
- [ ] `considerAsResponses`
- [ ] `feedbackDefinition`
- [ ] `givenAnswer`
- [ ] `group`
- [ ] `module` / `moduleAttributes`
- [ ] `option`
- [ ] `paginator`
- [ ] `repeat` / `repeatForSequence`
- [ ] `samplePrimeNumbers` / `sampleRandomNumbers`
- [ ] `select` / `selectFromSequence` / `selectPrimeNumbers` / `selectRandomNumbers`
- [ ] `shuffle`
- [ ] `sort`
- [ ] `split`
- [ ] `statement`
- [ ] `stickyGroup`

## Infrastructure (logic only, no visual renderer needed)

- [ ] `and` / `or` / `not` / `xor`
- [ ] `componentIndex` / `componentTypes`
- [ ] `else`
- [ ] `hasSameFactoring`
- [ ] `isBetween` / `isInteger` / `isNumber`
- [ ] `matchesPattern`
- [ ] `setup`
- [ ] `styleDefinition`
- [ ] `variantControl`
- [ ] `when`
