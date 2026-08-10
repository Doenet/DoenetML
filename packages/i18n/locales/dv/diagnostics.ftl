# Dhivehi diagnostics: errors and warnings surfaced to the reader or author.
# Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# Thaana, right to left, written in logical order. DoenetML element, attribute
# and value names stay in English exactly as written, and so does the
# `[deprecation]` marker. Dhivehi leaves a noun unmarked after a numeral, so
# where English separates singular from plural only in the verb the two
# branches read alike here.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] ދެ ކޮޅު ނުކުތާ ދީފައިވާނަމަ { $attributes } އަޅައެއް ނުލެވޭ
       *[other] ދެ ކޮޅު ނުކުތާ ދީފައިވާނަމަ { $attributes } އަޅައެއް ނުލެވޭ
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] ކޮޅު ނުކުތާއާއި މެދު ނުކުތާ ދެބައި ދީފައިވާނަމަ { $attributes } އަޅައެއް ނުލެވޭ
       *[other] ކޮޅު ނުކުތާއާއި މެދު ނުކުތާ ދެބައި ދީފައިވާނަމަ { $attributes } އަޅައެއް ނުލެވޭ
    }

line-segment-midpoint-offset-without-midpoint = މެދު ނުކުތާއެއް ނެތި midpointOffset އަކުން އެއްވެސް އަސަރެއް ނުކުރޭ

## `<line>`

line-points-undetermined-dimensions = ކަނޑައެޅިފައިނުވާ ޑައިމެންޝަންގެ ނުކުތާތަކުން ދާ ރޮނގު.

line-points-too-few-dimensions = ރޮނގު ދާންވާނީ މަދުވެގެން ދެ ޑައިމެންޝަންގެ ނުކުތާތަކުން.

line-points-depend-on-variables = ރޮނގު ދަނީ ވެރިއަބަލްތަކަށް ބަރޯސާވާ ނުކުތާތަކުން: { $variables }.

line-equation-invalid-format = ވެރިއަބަލް { $variable1 } އާއި { $variable2 } ގައި ރޮނގުގެ މުއާދަލާގެ ސައްހަނޫން ފޯމެޓެއް.

## `<ray>`

ray-overprescribed-through = ދޯދި ކަނޑައަޅާފައިވަނީ through، endpoint އަދި direction — މި ތިނެއިން. ދީފައިވާ through އަޅައެއް ނުލެވޭ.

ray-dimension-mismatch = ދޯދީގައި numDimensions ދިމަލެއް ނުވޭ.

## `<vector>`

vector-overprescribed-head = ވެކްޓަރު ކަނޑައަޅާފައިވަނީ head، tail އަދި displacement — މި ތިނެއިން. ދީފައިވާ head އަޅައެއް ނުލެވޭ.

vector-dimension-mismatch = ވެކްޓަރުގައި numDimensions ދިމަލެއް ނުވޭ.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` ގައި nearestPoint ކިޔާ ސްޓޭޓް ވެރިއަބަލެއް ނެތުމުން، އެއަށް ދަމައެއް ނުގަނެވޭ.

constrain-to-without-nearest-point = `<{ $component }>` ގައި nearestPoint ކިޔާ ސްޓޭޓް ވެރިއަބަލެއް ނެތުމުން، އެއަށް ހިފެހެއްޓުމެއް ނުލެވޭ.

constrain-to-interior-without-nearest-point = `<{ $component }>` ގައި nearestPoint ކިޔާ ސްޓޭޓް ވެރިއަބަލެއް ނެތުމުން، އޭގެ އެތެރެއަށް ހިފެހެއްޓުމެއް ނުލެވޭ.

## `<choiceInput>`

choice-input-label-position-ignored = އިންލައިން ނޫން choiceInput އަށް labelPosition އަޅައެއް ނުލެވޭ

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput އަށް ދީފައިވާ އިންޑެކްސްތަކަށް އަޅައެއް ނުލެވޭ، ސަބަބަކީ އިންޑެކްސްގެ އަދަދު ޗޮއިސް ދަރިންގެ އަދަދާ ދިމާނުވާތީ.

pretzel-indices-count-mismatch = problem އަށް ދީފައިވާ އިންޑެކްސްތަކަށް އަޅައެއް ނުލެވޭ، ސަބަބަކީ އިންޑެކްސްގެ އަދަދު problem ދަރިންގެ އަދަދާ ދިމާނުވާތީ.

shuffle-indices-count-mismatch = shuffle އަށް ދީފައިވާ އިންޑެކްސްތަކަށް އަޅައެއް ނުލެވޭ، ސަބަބަކީ އިންޑެކްސްގެ އަދަދު ބައިތަކުގެ އަދަދާ ދިމާނުވާތީ.

indices-ignored-out-of-range = { $component } އަށް ދީފައިވާ އިންޑެކްސްތަކަށް އަޅައެއް ނުލެވޭ، ސަބަބަކީ ބައެއް އިންޑެކްސް ހުދޫދުން ބޭރުވާތީ.

pretzel-indices-repeated = pretzel އަށް ދީފައިވާ އިންޑެކްސްތަކަށް އަޅައެއް ނުލެވޭ، ސަބަބަކީ ބައެއް އިންޑެކްސް ތަކުރާރުވެފައިވާތީ.

pretzel-circuit-first-index = circuit މޯޑުގައި pretzel އަށް ދީފައިވާ އިންޑެކްސްތަކަށް އަޅައެއް ނުލެވޭ، ސަބަބަކީ ފުރަތަމަ އިންޑެކްސް 1 ވާންޖެހޭތީ.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` ސްޓްރިންގ ދަރިންނާއެކު މަސައްކަތްކުރުމަށް `type` ސިފަ ދޭންޖެހޭ.

invalid-type-defaulting-to-math = { $component } ބަޔަށް { $type } ވައްތަރު ސައްހައެއް ނޫން. math، text، number ނުވަތަ boolean ން އެއް ވާންޖެހޭ. އަސާސީ ގޮތުން math ނެގޭ.

string-not-valid-component-to-arrange = ސްޓްރިންގ "{ $value }" އަކީ { $component } އަށް ސައްހަ ބައެއް ނޫން. އަޅައެއް ނުލެވޭ.

## Types and variables

invalid-type-defaulting-to-number = { $type } ވައްތަރު ސައްހައެއް ނޫން، ވައްތަރު number އަށް ބަދަލުކުރެވޭ.

invalid-variable-value = ވެރިއަބަލްގެ ސައްހަނޫން އަގެއް: `{ $value }`

## Variants

variant-index-must-be-number = ވައްތަރު އިންޑެކްސް { $index } އަދަދަކަށް ވާންޖެހޭ

variant-index-must-be-integer = ވައްތަރު އިންޑެކްސް { $index } އިންޓިޖަރަކަށް ވާންޖެހޭ

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ފުރިހަމަ މިންތަކަށް ހަދާފައެއް ނުވޭ. ފުޅާމިން ނިސްބަތީ ގޮތަށް ބަދަލުކުރެވޭ.

side-by-side-absolute-margins = `<{ $component }>` ފުރިހަމަ މިންތަކަށް ހަދާފައެއް ނުވޭ. މާޖިން ނިސްބަތީ ގޮތަށް ބަދަލުކުރެވޭ.

side-by-side-no-block-child = ސައްހަނޫން `<{ $component }>`: މީގައި މަދުވެގެން އެއް ބްލޮކް ދަރިއެއް އޮންނަންޖެހޭ.

## `<label>`

label-for-ignored-on-graphical = ގްރެފިކަލް `<label>` ގައި `for` ސިފައަށް އަޅައެއް ނުލެވޭ.

label-for-must-resolve-to-one = `<label>` ގައި `for` ސިފަ ދައްކަންވާނީ ސީދާ އެއް ބައި.

label-for-unresolved = `<label>` ގައި `for` ސިފައަށް އެއްވެސް ބައެއް ނުދެއްކުނު.

label-for-answer-with-authored-inputs = `<label>` ގައި `for` ސިފަ ދައްކަނީ ލިޔުންތެރިޔާ އަމިއްލައަށް އިންޕުޓް ލިޔެފައިވާ `<answer>` އެއް؛ އިންޕުޓް ސީދާ ދައްކަވާ.

label-for-answer-without-input = `<label>` ގައި `for` ސިފަ ދައްކަނީ ލޭބަލްކުރެވޭ އިންޕުޓެއް ނެތް `<answer>` އެއް.

label-for-must-reference-input-or-answer = `<label>` ގައި `for` ސިފަ ދައްކަންވާނީ އިންޕުޓެއް ނުވަތަ ޖަވާބެއް.

## Accessibility

accessibility-short-description-or-decorative = ވާސިލުވުމަށްޓަކައި `<{ $component }>` ގައި ކުރު ތަފްސީލެއް އޮންނަންވާނެ ނުވަތަ އެއީ decorative ކަމަށް ބުނަންވާނެ.

accessibility-video-short-description = ވާސިލުވުމަށްޓަކައި `<video>` ގައި ކުރު ތަފްސީލެއް އޮންނަންވާނެ.

accessibility-input-short-description-or-label = ވާސިލުވުމަށްޓަކައި `<{ $component }>` ގައި ކުރު ތަފްސީލެއް ނުވަތަ ލޭބަލެއް އޮންނަންވާނެ.

accessibility-answer-input-short-description-or-label = ވާސިލުވުމަށްޓަކައި އިންޕުޓް އުފައްދާ `<answer>` ގައި ކުރު ތަފްސީލެއް ނުވަތަ ލޭބަލެއް އޮންނަންވާނެ.

accessibility-short-description-contains-math = ކުރު ތަފްސީލުގައި `<{ $component }>` ފަދަ ހިސާބުގެ ބައިތައް ހުރެގެން ނުވާނެ. ހިސާބު ބަހުން ލިޔުއްވާ.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] ބައިގެ ސުރުޚީ ލިޔުމަށް { $colorName } ގެ ތަފާތު ކުޑަ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ މަދުވެގެން { $threshold }:1 ބޭނުންވޭ) (ކަޅު މޯޑު).
       *[other] ބައިގެ ސުރުޚީ ލިޔުމަށް { $colorName } ގެ ތަފާތު ކުޑަ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ މަދުވެގެން { $threshold }:1 ބޭނުންވޭ).
    }

## `<circle>`

circle-through-points-non-numerical = ނުކުތާތަކުގެ އަދަދީ އަގު ނެތް ހާލަތުގައި { $count } ނުކުތާއިން ދާ `<circle>` އަދި ހަދާފައެއް ނުވޭ.

circle-too-many-through-points = ތިނަކަށްވުރެ ގިނަ ނުކުތާއިން ދާ ބުރެއް ނުހިސާބުކުރެވޭ.

circle-overprescribed-radius-center-points = ދީފައިވާ ރޭޑިއަސް، މެދު އަދި ނުކުތާތަކާއެކު ބުރެއް ނުހިސާބުކުރެވޭ.

circle-center-with-multiple-points = ދީފައިވާ މެދާއެކު އެކަކަށްވުރެ ގިނަ ނުކުތާއިން ދާ ބުރެއް ނުހިސާބުކުރެވޭ.

circle-radius-too-small = ބުރެއް ނުހިސާބުކުރެވޭ: ދެ ނުކުތާގެ ދެމެދު ދުރުމިން { $distance } ކަމަށްވާތީ، ދީފައިވާ ރޭޑިއަސް { $radius } މާ ކުޑަ.

circle-radius-with-many-points = ދީފައިވާ ރޭޑިއަސްއާއެކު ދޭކަށްވުރެ ގިނަ ނުކުތާއިން ދާ ބުރެއް ނުއުފެއްދޭ.

circle-invalid-center-or-through-points = ބުރުގެ ސައްހަނޫން މެދު ނުވަތަ ނުކުތާ.

circle-radius-center-with-multiple-points = ދީފައިވާ މެދާއެކު އެކަކަށްވުރެ ގިނަ ނުކުތާއިން ދާ ބުރުގެ ރޭޑިއަސް ނުހިސާބުކުރެވޭ.

circle-change-radius-non-numerical = އަދަދީ ނޫން ނުކުތާތަކުން ދާ ބުރުގެ ރޭޑިއަސް ބަދަލެއް ނުކުރެވޭ

circle-radius-with-points-non-numerical = އަދަދީ އަގު ނެތި، ދީފައިވާ ރޭޑިއަސްއާއެކު އެކަކަށްވުރެ ގިނަ ނުކުތާއިން ދާ ބުރެއް ނުއުފެއްދޭ.

circle-change-center-non-numerical = އަދަދީ ނޫން އަގުތަކުގެ ނުކުތާތަކުން ދާ ބުރުގެ މެދު ބަދަލުކުރުން އަދި ހަދާފައެއް ނުވޭ.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] ފަންކްޝަނުގެ ޑޮމެއިނަށް ޑައިމެންޝަން މަދު. ޑޮމެއިނުގައި { $intervals } ފަށަލަ ހުރި ނަމަވެސް ފަންކްޝަނުގައި { $inputs ->
            [one] { $inputs } އިންޕުޓް
           *[other] { $inputs } އިންޕުޓް
        } ހުރި.
       *[other] ފަންކްޝަނުގެ ޑޮމެއިނަށް ޑައިމެންޝަން މަދު. ޑޮމެއިނުގައި { $intervals } ފަށަލަ ހުރި ނަމަވެސް ފަންކްޝަނުގައި { $inputs ->
            [one] { $inputs } އިންޕުޓް
           *[other] { $inputs } އިންޕުޓް
        } ހުރި.
    }

function-domain-invalid-format = ފަންކްޝަނުގެ ޑޮމެއިންގެ ސައްހަނޫން ފޯމެޓެއް.

function-ignoring-non-numerical =
    { $type ->
        [maximum] ފަންކްޝަނުގެ އަދަދީ ނޫން އެންމެ މަތީ އަގަށް އަޅައެއް ނުލެވޭ.
        [minimum] ފަންކްޝަނުގެ އަދަދީ ނޫން އެންމެ ދަށް އަގަށް އަޅައެއް ނުލެވޭ.
        [extremum] ފަންކްޝަނުގެ އަދަދީ ނޫން އެންމެ ފަހު އަގަށް އަޅައެއް ނުލެވޭ.
        [point] ފަންކްޝަނުގެ އަދަދީ ނޫން ނުކުތާއަށް އަޅައެއް ނުލެވޭ.
        [slope] ފަންކްޝަނުގެ އަދަދީ ނޫން ސްލޯޕަށް އަޅައެއް ނުލެވޭ.
       *[other] ފަންކްޝަނުގެ އަދަދީ ނޫން { $type } އަށް އަޅައެއް ނުލެވޭ.
    }

function-ignoring-empty =
    { $type ->
        [maximum] ފަންކްޝަނުގެ ހުސް އެންމެ މަތީ އަގަށް އަޅައެއް ނުލެވޭ.
        [minimum] ފަންކްޝަނުގެ ހުސް އެންމެ ދަށް އަގަށް އަޅައެއް ނުލެވޭ.
        [extremum] ފަންކްޝަނުގެ ހުސް އެންމެ ފަހު އަގަށް އަޅައެއް ނުލެވޭ.
        [point] ފަންކްޝަނުގެ ހުސް ނުކުތާއަށް އަޅައެއް ނުލެވޭ.
       *[other] ފަންކްޝަނުގެ ހުސް { $type } އަށް އަޅައެއް ނުލެވޭ.
    }

function-points-too-close = ފަންކްޝަނުގައި ދެ ނުކުތާ މާ ކައިރީގައި. ފަންކްޝަން ކަނޑައެއް ނޭޅޭ.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] ފަންކްޝަން އިޓަރޭޓް ކުރެވޭނީ އިންޕުޓްގެ އަދަދާއި އައުޓްޕުޓްގެ އަދަދު އެއްވަރުވުމުން އެކަނި. މި ފަންކްޝަނުގައި { $inputs } އިންޕުޓް އަދި { $outputs ->
            [one] { $outputs } އައުޓްޕުޓް
           *[other] { $outputs } އައުޓްޕުޓް
        } ހުރި.
       *[other] ފަންކްޝަން އިޓަރޭޓް ކުރެވޭނީ އިންޕުޓްގެ އަދަދާއި އައުޓްޕުޓްގެ އަދަދު އެއްވަރުވުމުން އެކަނި. މި ފަންކްޝަނުގައި { $inputs } އިންޕުޓް އަދި { $outputs ->
            [one] { $outputs } އައުޓްޕުޓް
           *[other] { $outputs } އައުޓްޕުޓް
        } ހުރި.
    }

## `<sequence>`

sequence-invalid-length = ސީކުއެންސްގެ ސައްހަނޫން ދިގުމިނެއް. ނެގެޓިވް ނޫން އިންޓިޖަރަކަށް ވާންޖެހޭ.

sequence-invalid-step = ސީކުއެންސްގެ ސައްހަނޫން ފިޔަވަޅެއް. { $type } ވައްތަރުގެ ސީކުއެންސަށް އަދަދަކަށް ވާންޖެހޭ.

sequence-invalid-endpoint-number = އަދަދީ ސީކުއެންސްގެ ސައްހަނޫން "{ $attribute }". އަދަދަކަށް ވާންޖެހޭ.

sequence-invalid-endpoint-letters = އަކުރު ސީކުއެންސްގެ ސައްހަނޫން "{ $attribute }". އަކުރުތަކުގެ އެއްކުރުމަކަށް ވާންޖެހޭ.

sequence-invalid-endpoint = ސީކުއެންސްގެ ސައްހަނޫން "{ $attribute }".

select-from-sequence-coprime-not-numbers = އަދަދު ނުހޮވާތީ coprime އަށް އަޅައެއް ނުލެވޭ

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations ދީފައިވާތީ coprime އަށް އަޅައެއް ނުލެވޭ

## Resolving a `target`

target-not-found = `<{ $source }>` އަށް ސައްހަނޫން އަމާޒެއް: އަމާޒު ނުފެނުނު.

target-state-variable-not-found = `<{ $source }>` އަށް ސައްހަނޫން އަމާޒެއް: `<{ $component }>` ގައި "{ $property }" ކިޔާ ސްޓޭޓް ވެރިއަބަލެއް ނުފެނުނު.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` ގެ ވެރިއަބަލްތައް މިނިވަން ވެރިއަބަލާ ތަފާތުވާންޖެހޭ.

ode-system-duplicate-variable-names = ތަކުރާރުވެފައިވާ ބަރޯސާ ވެރިއަބަލް ނަންތަކާއެކު ODE RHS ފަންކްޝަން ކަނޑައެއް ނޭޅޭ.

ode-system-rhs-function-error = ODE RHS ފަންކްޝަން ކަނޑައެއް ނޭޅޭ. mathjs ފަންކްޝަން އުފެއްދުމުގައި ކުށެއް.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } ރޮނގުގެ ދެމެދު އެންގަލެއް ކަނޑައެއް ނޭޅޭ

angle-invalid-through-point = `<angle>` ގެ through ގައި ސައްހަނޫން ނުކުތާއެއް

parabola-vertex-too-many-points = ވާޓެކްސްއާއެކު އެކަކަށްވުރެ ގިނަ ނުކުތާއިން ދާ ޕެރެބޮލާ އަދި ހަދާފައެއް ނުވޭ.

parabola-too-many-points = ތިނަކަށްވުރެ ގިނަ ނުކުތާއިން ދާ ޕެރެބޮލާ އަދި ހަދާފައެއް ނުވޭ.

intersection-too-many-items = ދޭކަށްވުރެ ގިނަ އެއްޗެހީގެ ބައްދަލުވުން އަދި ހަދާފައެއް ނުވޭ

## Other math components

ionic-compound-not-two-ions = ދެ އަޔަން ފިޔަވައި އެހެން އެއްޗަކަށް އަޔޮނިކް މުރައްކަބު އަދި ހަދާފައެއް ނުވޭ.

ionic-compound-needs-cation-and-anion = އަޔޮނިކް މުރައްކަބު ހަދާފައިވަނީ އެއް ކެޓަޔަނާއި އެއް އެނަޔަނަށް އެކަނި.

solve-equations-cannot-evaluate = މުއާދަލާގެ އަގު ނުނެގުމުން އެ ހައްލެއް ނުކުރެވޭ: { $equation }

math-operators-operand-number-required = ހިސާބުގެ އޮޕަރެންޑް ނެގުމަށް operandNumber ދޭންޖެހޭ.

eigen-decomposition-failed = މެޓްރިކްސްގެ އައިގަން އަގުތައް ނުހިސާބުކުރެވުނު

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: ޕެރެމީޓަރު { $parameters } ޕެޓަރނުގައި ނެތުމުން، އެއީ އަބަދުވެސް ހުހަކާ ދިމާވާނެ.
       *[other] `<matchesPattern>`: ޕެރެމީޓަރު { $parameters } ޕެޓަރނުގައި ނެތުމުން، އެއީ އަބަދުވެސް ހުހަކާ ދިމާވާނެ.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" ދޭހައެއް ނުވި. އެއީ none، medium، dense، ނުވަތަ ހުސް ޖާގައަކުން ވަކިކޮށްފައިވާ ދެ ޕޮޒިޓިވް އަދަދަށް ވާންޖެހޭ، މިސާލަކަށް grid="1 0.5". އެއްވެސް ގްރިޑެއް ނުކުރެހޭ.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure ރެންޑަރަރުގައި xLabelPosition="left" ސަޕޯޓެއް ނުކުރޭ؛ right ގެ އުސޫލު ނެގޭ.

prefigure-y-label-position-unsupported = `<graph>`: prefigure ރެންޑަރަރުގައި yLabelPosition="bottom" ސަޕޯޓެއް ނުކުރޭ؛ top ގެ އުސޫލު ނެގޭ.

prefigure-invalid-axis-bounds = `<graph>`: prefigure ބަދަލުކުރުމަށް ސައްހަނޫން އެކްސިސް ހުދޫދު؛ އަސާސީ bbox (-10,-10,10,10) ނެގޭ.

prefigure-invalid-width = `<graph>`: prefigure ބަދަލުކުރުމަށް ސައްހަނޫން ފުޅާމިނެއް؛ އަސާސީ ޑައިގްރާމް ފުޅާމިން 425 ނެގޭ.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure ބަދަލުކުރުމަށް ސައްހަނޫން aspectRatio؛ އަސާސީ ނިސްބަތް 1 ނެގޭ.

prefigure-grid-spacing-too-fine = `<graph>`: އެކްސިސް ހުދޫދަށް ގްރިޑްގެ ދުރުމިން މާ ހިމަ؛ prefigure ރެންޑަރަރުގައި ގްރިޑް ދޫކޮށްލެވޭ.

prefigure-annotations-not-rendered = `<graph>`: PreFigure ރެންޑަރަރު ބޭނުންނުކުރާނަމަ އެނޮޓޭޝަން ނުކުރެހޭނެ.

multiple-annotations-children = `<graph>` ގައި ގިނަ `<annotations>` ދަރިން ފެނުނު؛ ފަހު އެއް ފިޔަވައި ހުރިހާ އެއްޗަކަށް އަޅައެއް ނުލެވޭ.

## Referring to other components

copy-unrecognized-component-type = ނޭނގޭ ބައިގެ ވައްތަރެއް ފުޅާކުރުމެއް ނުވަތަ ކޮޕީކުރުމެއް ނުކުރެވޭ: { $type }.

copy-prop-not-found = { $component } ވައްތަރުގެ ބައެއްގައި { $property } ސިފައެއް ނުފެނުނު

collect-no-source = collect އަށް އެއްވެސް ސޯސެއް ނުފެނުނު.

collect-invalid-component-type = `<{ $component }>` ވައްތަރުގެ ބައިތައް ނުއެއްކުރެވޭ، ސަބަބަކީ އެއީ ސައްހަނޫން ބައިގެ ވައްތަރެއް.

reference-index-unavailable = އިންޑެކްސް `{ $reference }` އަށް ރިފަރެންސެއް ނުދެވޭ

## `<callAction>`

component-action-unavailable = ބައި `{ $reference }` ގައި { $action } ނުހިންގޭ

## `<dataFrame>`

data-frame-inconsistent-row-lengths = ޑޭޓާގެ ބައްޓަން ސައްހައެއް ނޫން. ރޯތަކުގެ ދިގުމިން ދިމައެއް ނުވޭ. componentIdx :{ $componentIdx } ން ފެނުނު

data-frame-duplicate-column-names = ޑޭޓާގައި ތަކުރާރުވެފައިވާ ކޮލަމް ނަން ހުރި. componentIdx :{ $componentIdx } ން ފެނުނު

data-frame-missing-column-name = ޑޭޓާގައި އެއް ކޮލަމް ނަން ނެތް. componentIdx :{ $componentIdx } ން ފެނުނު

## `<answer>` and scoring

answer-award-depends-on-own-response = މި ޖަވާބުގެ އެއް award ބިނާވެފައިވަނީ މި answer ޓެގުގެ އަމިއްލަ ފޮނުވި ޖަވާބުގެ މައްޗަށް، އެއިން ބޭނުންނުވާ ނަތީޖާ ނުކުންނާނެ.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` ހުރި ކޮންޓޭނަރެއްގެ ތެރޭގައި އޮތް `<answer>` ގައި `maxNumAttempts` ދިނުމުން އަސަރެއް ނުކުރޭ، ސަބަބަކީ ފުރުސަތުގެ އަދަދު ކޮންޓޭނަރުން ކޮންޓްރޯލްކުރާތީ. `maxNumAttempts` ކޮންޓޭނަރުގައި ދެއްވާ.

nested-section-wide-check-work-max-num-attempts = އެހެން `sectionWideCheckWork` ކޮންޓޭނަރެއްގެ ތެރޭގައި އޮތް `sectionWideCheckWork` ކޮންޓޭނަރުގައި `maxNumAttempts` ދިނުމުން އަސަރެއް ނުކުރޭ، ސަބަބަކީ ފުރުސަތުގެ އަދަދު ބޭރު ކޮންޓޭނަރުން ކޮންޓްރޯލްކުރާތީ. `maxNumAttempts` ބޭރު ކޮންޓޭނަރުގައި ދެއްވާ.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality ނެތި { $attributes } ސިފައިން އަސަރެއް ނުކުރާނެ.
       *[other] symbolicEquality ނެތި { $attributes } ސިފަތަކުން އަސަރެއް ނުކުރާނެ.
    }

answer-invalid-type = ޖަވާބަށް ސައްހަނޫން ވައްތަރެއް: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` ބަޔަށް ނަމެއް ނެތުމުން، އެއީ module ސިފައެއްގެ ގޮތުގައި ބޭނުމެއް ނުކުރެވޭ

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` ބައި module ގެ ސިފައެއްގެ ގޮތުގައި ބޭނުމެއް ނުކުރެވޭ، ސަބަބަކީ `<module>` ބައިގެ ވައްތަރުގައި "{ $name }" ސިފަ ކުރިންވެސް ކަނޑައަޅާފައިވާތީ.

conditional-content-condition-ignored = case ނުވަތަ else ދަރިން ހުރި `<conditionalContent>` ބައިގައި `condition` ސިފައަށް އަޅައެއް ނުލެވޭ.

slider-markers-type-mismatch = މާކަރުތަކުގެ ވައްތަރު slider ގެ ވައްތަރާ ދިމައެއް ނުވޭ.

pretzel-problem-needs-statement-and-answer = ސައްހަނޫން pretzel: ކޮންމެ `<problem>` އެއްގައި އެއް `<statement>` އަދި އެއް `<answer>` އޮންނަންޖެހޭ.

pretzel-circuit-first-problem-distractor = ސައްހަނޫން pretzel: mode="circuit" ގައި ފުރަތަމަ `<problem>` އަކީ ޑިސްޓްރެކްޓަރަކަށް ނުވެވޭނެ.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` ސިފައަށް ސައްހަނޫން އަގު { $values }؛ އަޅައެއް ނުލެވޭ.
       *[other] `{ $attribute }` ސިފައަށް ސައްހަނޫން އަގުތައް { $values }؛ އަޅައެއް ނުލެވޭ.
    }

attribute-must-be-references = `{ $attribute }` ސިފައަށް `{ $value }` އަކީ ސައްހަނޫން އަގެއް. ސިފަ ބިނާވާންވާނީ `$` ން ފެށޭ ރިފަރެންސްތަކުން.

math-input-invalid-function-names = <mathInput>: { $attribute } ގައި ސައްހަނޫން ފަންކްޝަން ނަންތަކަށް އަޅައެއް ނުލެވުނު: { $names }. ކޮންމެ ނަމެއްގެ ދައްކާ ބައިގައި މަދުވެގެން ދެ އަކުރު (އަކުރު ނުވަތަ ޑޭޝް) ހުންނަންޖެހޭ؛ އޭގެ ފަހަތުގައި `|<mathspeak alternative>` ލެވިދާނެ.

## Building components from the source

component-type-invalid = ސައްހަނޫން ބައިގެ ވައްތަރެއް: `<{ $componentType }>`

attribute-repeated = { $attribute } ސިފަ ތަކުރާރެއް ނުކުރެވޭ.

attribute-invalid-for-component = `<{ $componentType }>` ވައްތަރުގެ ބަޔަކަށް "{ $attribute }" ސިފަ ސައްހައެއް ނޫން.

## Style definition contrast

style-definition-insufficient-contrast =
    ސްޓައިލް ތައާރަފު { $styleNumber } ގައި { $context ->
        [text-on-background] ބެކްގްރައުންޑް ކުލައާ ދެކޮޅަށް ލިޔުމުގެ ކުލައިގެ
        [high-contrast] ކެންވަހާ ދެކޮޅަށް ބޮޑު ތަފާތު ކުލައިގެ
        [line] ކެންވަހާ ދެކޮޅަށް ރޮނގުގެ ކުލައިގެ
        [marker] ކެންވަހާ ދެކޮޅަށް މާކަރުގެ ކުލައިގެ
       *[text-on-canvas] ކެންވަހާ ދެކޮޅަށް ލިޔުމުގެ ކުލައިގެ
    } ތަފާތު ކުޑަ{ $mode ->
        [dark] { " (ކަޅު މޯޑު)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ މަދުވެގެން { $threshold }:1 ބޭނުންވޭ).

style-definition-dark-mode-text-background-contrast =
    ސްޓައިލް ތައާރަފު { $styleNumber } ގައި ދީފައިވާ ކުލަތަކުން އަލި މޯޑަށް ފުދޭ ތަފާތެއް ދިން ނަމަވެސް، އެއިން އުފެދޭ ކަޅު މޯޑުގެ ކުލަތަކުގައި ބެކްގްރައުންޑް ކުލައާ ދެކޮޅަށް ލިޔުމުގެ ކުލައިގެ ތަފާތު ކުޑަ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ މަދުވެގެން { $threshold }:1 ބޭނުންވޭ). { $suggestion ->
        [available] ކަޅު މޯޑުގައި ފުދޭ ތަފާތަކަށް ނުވަތަ އަލި މޯޑުގެ ތަފާތު ބޮޑުކުރައްވާ (މިސާލަކަށް { $lightAttribute }="{ $lightColor }")، ނުވަތަ ކަޅު މޯޑުގެ ކުލަ އަމިއްލައަށް ދެއްވާ (މިސާލަކަށް { $darkAttribute }="{ $darkColor }").
       *[none] ކަޅު މޯޑުގައި ފުދޭ ތަފާތަކަށް އަލި މޯޑުގެ ތަފާތު ބޮޑުކުރައްވާ، ނުވަތަ އުފެދޭ ކުލަތައް textColorDarkMode އަދި/ނުވަތަ backgroundColorDarkMode ން އަމިއްލައަށް ދެއްވާ.
    }

style-definition-dark-mode-text-canvas-contrast =
    ސްޓައިލް ތައާރަފު { $styleNumber } ގައި ދީފައިވާ ލިޔުމުގެ ކުލައިން އަލި މޯޑަށް ފުދޭ ތަފާތެއް ދިން ނަމަވެސް، އެއިން އުފެދޭ ކަޅު މޯޑުގެ ލިޔުމުގެ ކުލައިގެ ކެންވަހާ ދެކޮޅަށް ތަފާތު ކުޑަ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1؛ މަދުވެގެން { $threshold }:1 ބޭނުންވޭ). { $suggestion ->
        [available] ކަޅު މޯޑުގައި ފުދޭ ތަފާތަކަށް ނުވަތަ އަލި މޯޑުގެ ތަފާތު ބޮޑުކުރައްވާ (މިސާލަކަށް textColor="{ $lightColor }")، ނުވަތަ ކަޅު މޯޑުގެ ކުލަ އަމިއްލައަށް ދެއްވާ (މިސާލަކަށް textColorDarkMode="{ $darkColor }").
       *[none] ކަޅު މޯޑުގައި ފުދޭ ތަފާތަކަށް އަލި މޯޑުގެ ތަފާތު ބޮޑުކުރައްވާ، ނުވަތަ އުފެދޭ ކުލަ textColorDarkMode ން އަމިއްލައަށް ދެއްވާ.
    }

section-multiple-style-palettes = އެއް ބަޔަކަށް ހޮވޭނީ އެއް <stylePalette> އެކަނި؛ ފަހު އެތި ނެގޭ.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } ގެ ތަފާތު ވައްތަރުތައް ކަނޑައެއް ނޭޅޭ، ސަބަބަކީ numToSelect އަކީ ނެގެޓިވް ނޫން އިންޓިޖަރެއް ނޫން.

variant-num-to-select-not-constant-number = { $component } ގެ ތަފާތު ވައްތަރުތައް ކަނޑައެއް ނޭޅޭ، ސަބަބަކީ numToSelect އަކީ ސާބިތު އަދަދެއް ނޫން.

variant-with-replacement-not-constant-boolean = { $component } ގެ ތަފާތު ވައްތަރުތައް ކަނޑައެއް ނޭޅޭ، ސަބަބަކީ withReplacement އަކީ ސާބިތު ބޫލިއަނެއް ނޫން.

variant-select-weight-disables-unique = އޮޕްޝަނެއްގައި selectWeight ނުވަތަ selectForVariants ދީފައިވާނަމަ select ގެ ތަފާތު ވައްތަރުތައް ނުހިނގާނެ

variant-coprime-undetermined = { $component } ގެ ތަފާތު ވައްތަރުތައް ކަނޑައެއް ނޭޅޭ، ސަބަބަކީ coprime އަބަދުވެސް ދޮގުކަން ކަނޑައެޅިފައިނުވާތީ.

variant-attribute-not-constant = { $component } ގެ ތަފާތު ވައްތަރުތައް ކަނޑައެއް ނޭޅޭ، ސަބަބަކީ { $attribute } ސާބިތެއް ނޫން.

variant-attribute-not-number = { $component } ގެ ތަފާތު ވައްތަރުތައް ކަނޑައެއް ނޭޅޭ، ސަބަބަކީ { $attribute } އަދަދެއް ނޫން.

variant-attribute-wrong-type-for-sequence =
    { $type } ވައްތަރުގެ { $component } ގެ ތަފާތު ވައްތަރުތައް ކަނޑައެއް ނޭޅޭ، ސަބަބަކީ { $attribute } އަކީ { $expected ->
        [letters-combination] އަކުރުތަކުގެ އެއްކުރުމެއް
        [math-expression] ސައްހަ ހިސާބުގެ އިބާރާތެއް
        [integer] އިންޓިޖަރެއް
       *[number] އަދަދެއް
    } ނޫން.

variant-length-not-integer = { $component } ގެ ތަފާތު ވައްތަރުތައް ކަނޑައެއް ނޭޅޭ، ސަބަބަކީ length އިންޓިޖަރެއް ނޫން.

variant-sort-not-implemented = sort ހުރި { $component } ގެ ތަފާތު ވައްތަރުތައް އަދި ހަދާފައެއް ނުވޭ

variant-exclude-combinations-not-implemented = excludeCombinations ހުރި { $component } ގެ ތަފާތު ވައްތަރުތައް އަދި ހަދާފައެއް ނުވޭ

variant-math-exclude-not-implemented = exclude ހުރި math ވައްތަރުގެ { $component } ގެ ތަފާތު ވައްތަރުތައް އަދި ހަދާފައެއް ނުވޭ

variant-non-constant-exclude-not-implemented = ސާބިތުނޫން exclude ހުރި { $component } ގެ ތަފާތު ވައްތަރުތައް އަދި ހަދާފައެއް ނުވޭ

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure ރެންޑަރަރުގައި ސަޕޯޓެއް ނުކުރޭ؛ ދަރި ދޫކޮށްލެވުނު.

prefigure-descendant-invalid-geometry = { $subject }: ނިމުމެއް ނެތް ނުވަތަ ފުރިހަމަނުވާ ޖިއޮމެޓްރީ؛ ދަރި ދޫކޮށްލެވުނު.

prefigure-curve-label-omitted = { $subject }: ބަދަލުކުރެވުނު ގުދު ރޮނގުގެ ބައިތަކުގައި ލޭބަލް ސަޕޯޓެއް ނުކުރޭ؛ ލޭބަލް ދޫކޮށްލެވުނު.

prefigure-curve-unsupported-definition-type = { $subject }: ގުދު ރޮނގުގެ ފަންކްޝަން ތައާރަފުގެ ވައްތަރު '{ $definitionType }' ސަޕޯޓެއް ނުކުރޭ؛ ދަރި ދޫކޮށްލެވުނު.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves ގައި flipFunctions ސިފަ ސަޕޯޓެއް ނުކުރޭ؛ ދަރި ދޫކޮށްލެވުނު.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves ގައި ސަޕޯޓުކުރަނީ formula ވައްތަރުގެ ދަރި ފަންކްޝަން އެކަނި؛ ދަރި ދޫކޮށްލެވުނު.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] ރޮނގު އާއިލާގެ ލޭބަލަށް
       *[point] ނުކުތާ ލޭބަލަށް
    } labelPosition '{ $labelPosition }' ސަޕޯޓެއް ނުކުރޭ؛ އަސާސީ PreFigure ތަރުތީބު ނެގުނު.

prefigure-fill-style-unsupported = { $subject }: ފުރުމުގެ ސްޓައިލް '{ $fillStyle }' PreFigure ގައި ސަޕޯޓެއް ނުކުރޭ؛ ސާދާ ފުރުމެއް ނެގުނު.

prefigure-line-style-unknown = { $subject }: ނޭނގޭ ރޮނގު ސްޓައިލް '{ $lineStyle }' PreFigure ނަތީޖާއިން ދޫކޮށްލެވުނު.

prefigure-marker-style-mapped-to-diamond = { $subject }: މާކަރު ސްޓައިލް '{ $markerStyle }' PreFigure ގެ 'diamond' ސްޓައިލަށް ބަދަލުކުރެވުނު.

prefigure-marker-style-unsupported = { $subject }: މާކަރު ސްޓައިލް '{ $markerStyle }' PreFigure ގައި ސަޕޯޓެއް ނުކުރޭ؛ އަސާސީ ސްޓައިލް ނެގުނު.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ސައްހަނޫން `ref`؛ އަމާޒު ނުފެނުނު. އެނޮޓޭޝަން ދޫކޮށްލެވުނު.

annotation-ref-multiple-targets = `<annotation>`: `ref` ން ގިނަ އަމާޒު ފެނުނު؛ ފުރަތަމަ އަމާޒު ނެގުނު.

annotation-ref-outside-graph = `<annotation>`: ސައްހަނޫން `ref`؛ އަމާޒު އޮތީ އެ graph ން ބޭރުގައި. އެނޮޓޭޝަން ދޫކޮށްލެވުނު.

annotation-ref-unsupported-target = `<annotation>`: ސައްހަނޫން `ref`؛ prefigure ބަދަލުކުރުމުގައި އަމާޒަކީ ސަޕޯޓުކުރާ ގްރެފިކަލް އެއްޗެއް ނޫން. އެނޮޓޭޝަން ދޫކޮށްލެވުނު.

annotation-text-missing = `<annotation>`: `text` ނެތް ނުވަތަ ހުސް؛ ހުސް ލިޔުމެއް ދެވުނު.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] ބުރު ޖެހޭ ބަރޯސާވުމެއް ފެނުނު.
       *[other] `<{ $componentType }>` ބަޔާ ގުޅިގެން ބުރު ޖެހޭ ބަރޯސާވުމެއް ފެނުނު.
    }

reference-no-referent = ރިފަރެންސްގެ އަމާޒެއް ނުފެނުނު: `{ $reference }`

reference-multiple-referents = ރިފަރެންސްގެ ގިނަ އަމާޒު ފެނުނު: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` ގެ { $attribute } ސިފައިގެ ސައްހަނޫން ފޯމެޓެއް.

children-invalid = `<{ $componentType }>` އަށް ސައްހަނޫން ދަރިން: ސައްހަނޫން ދަރިން ފެނުނު: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` ސިފައަށް `{ $value }` އަކީ ސައްހަނޫން އަގެއް، `{ $default }` އަގު ނެގޭ

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML ވަރޝަން { $version } ނުފެނުނު.
       *[other] DoenetML ވަރޝަން { $version } ނުފެނުނު. ވަރޝަން { $fallback } ނެގޭ
    }

## Reading the DoenetML

parse-invalid-doenetml = ސައްހަނޫން DoenetML: { $content }

parse-tag-missing-close-tag = ސައްހަނޫން DoenetML: ޓެގު `{ $tag }` އަށް ބަންދުކުރާ ޓެގެއް ނެތް. އަމިއްލައަށް ބަންދުވާ ޓެގެއް ނުވަތަ `</{ $tagName }>` ޓެގެއް ބޭނުންވޭ.

parse-tag-error = ސައްހަނޫން DoenetML: ޓެގު `<{ $tagName }>` ގައި ކުށެއް

parse-attribute-missing-value = ސައްހަނޫން DoenetML: ސައްހަނޫން ސިފަ `{ $attribute }` ގައި އަގެއް ނެތްހެން ހީވޭ.

parse-attribute-invalid = ސައްހަނޫން DoenetML: ސައްހަނޫން ސިފަ `{ $attribute }`

parse-attribute-value-invalid = ސައްހަނޫން DoenetML: ސައްހަނޫން ސިފައިގެ އަގު `{ $value }`

parse-attribute-value-quote-mismatch = ސައްހަނޫން DoenetML: ސައްހަނޫން ސިފައިގެ އަގު `{ $value }`. ކޯޓޭޝަން ނިޝާން ދިމައެއް ނުވޭ. `{ $quote }` މަދުހެން ހީވޭ

parse-open-tag-name-missing = ސައްހަނޫން DoenetML: ޓެގު ނަމެއް ނެތި ޓެގެއް ފެނުނު، މިސާލަކަށް `<`

parse-tag-not-closed = ސައްހަނޫން DoenetML: ޓެގު `{ $tag }` ބަންދެއް ނުވި (`>` މަދުހެން ހީވޭ).

parse-self-closing-tag-name-missing = ސައްހަނޫން DoenetML: ޓެގު ނަމެއް ނެތި ޓެގެއް ފެނުނު `<{ $content }>`

parse-self-closing-tag-not-closed = ސައްހަނޫން DoenetML: ޓެގު `{ $tag }` ބަންދެއް ނުވި (`/>` މަދުހެން ހީވޭ).

parse-tag-invalid-attributes = ސައްހަނޫން DoenetML: ޓެގު `{ $tag }` ސައްހައެއް ނޫން. އޭގެ ސިފަތައް ގޯސްވެދާނެ.

parse-close-tag-name-missing = ސައްހަނޫން DoenetML: ޓެގު ނަމެއް ނެތި ބަންދުކުރާ ޓެގެއް ފެނުނު، މިސާލަކަށް `</`

parse-attribute-value-unquoted = ސިފައިގެ އަގުތައް ކޯޓޭޝަން ނިޝާނުގެ ތެރޭގައި ބަހައްޓަންޖެހޭ: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = ސައްހަނޫން DoenetML: ބަންދުކުރާ ޓެގު `{ $tag }` ފެނުނު، ނަމަވެސް އެއާ ގުޅޭ ހުޅުވާ ޓެގެއް ނެތް

parse-close-tag-mismatched = ސައްހަނޫން DoenetML: ބަންދުކުރާ ޓެގު ދިމައެއް ނުވޭ. `</{ $expected }>` ބޭނުންވި. `{ $found }` ފެނުނު

parser-node-unconvertible = ނޯޑް { $node } Dast ނޯޑަކަށް ބަދަލެއް ނުކުރެވުނު.

## Names

name-attribute-invalid =
    ސައްހަނޫން ސިފަ name='{ $name }'. { $reason ->
        [characters] ނަންތަކުގައި ހުންނަންވާނީ އަކުރު، އަދަދު، އަންޑަސްކޯ ނުވަތަ ޑޭޝް އެކަނި.
       *[start] ނަން ފަށަންވާނީ އަކުރަކުން.
    }

component-name-invalid-start = ސައްހަނޫން ބައިގެ ނަން "{ $name }". ނަން ފަށަންވާނީ އަކުރަކުން.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched ވައްތަރުގެ ޖަވާބުގައި video ސިފަ އޮންނަންޖެހޭ

answer-video-watched-video-not-reference = videoWatched ވައްތަރުގެ ޖަވާބުގެ video ސިފަ ރިފަރެންސަކަށް ވާންޖެހޭ

answer-name-not-single-text = ޖަވާބުގެ name ސިފައިގައި އޮންނަންވާނީ އެއް ލިޔުމުގެ ދަރިއެއް

## Referencing another document

external-doenetml-recursion-limit = މާ ގިނަ ފަންތީގެ ތަކުރާރުވުމުގެ ސަބަބުން ބޭރު DoenetML ނުގެނެވުނު. ބުރު ޖެހޭ ރިފަރެންސެއް އެބައޮތްތޯ؟

external-doenetml-unavailable = { $attribute }="{ $uri }" ން DoenetML ނުގެނެވުނު

external-doenetml-type-mismatch = { $attribute }="{ $uri }" ން ގެނެވުނު DoenetML ސައްހައެއް ނޫން: އެއީ "{ $componentType }" ބައިގެ ވައްތަރާ ދިމައެއް ނުވި

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] ސިފަ `{ $from }` ދޫކޮށްލެވިއްޖެ؛ އޭގެ ބަދަލުގައި `{ $to }` ބޭނުންކުރައްވާ.
       *[other] [deprecation] `<{ $component }>` ގައި ސިފަ `{ $from }` ދޫކޮށްލެވިއްޖެ؛ އޭގެ ބަދަލުގައި `{ $to }` ބޭނުންކުރައްވާ.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] ސިފަ `{ $from }` ދޫކޮށްލެވި އަޅައެއް ނުލެވޭ، ސަބަބަކީ `{ $to }` ވެސް ދީފައިވާތީ.
       *[other] [deprecation] `<{ $component }>` ގައި ސިފަ `{ $from }` ދޫކޮށްލެވި އަޅައެއް ނުލެވޭ، ސަބަބަކީ `{ $to }` ވެސް ދީފައިވާތީ.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` ގައި ސިފަ `{ $attribute }` ދޫކޮށްލެވި އަޅައެއް ނުލެވޭ.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` ގައި ސިފަ `{ $attribute }` ދޫކޮށްލެވިއްޖެ؛ އޭގެ ބަދަލުގައި `<{ $child }>` ދަރިއެއް ބޭނުންކުރައްވާ.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` ގައި ސިފަ `{ $attribute }` ގެ އަގު `{ $value }` ދޫކޮށްލެވިއްޖެ؛ އޭގެ ބަދަލުގައި `{ $to }` ބޭނުންކުރައްވާ.


## Language coverage

pluralize-english-only = `<pluralize>` އަށް ގިނަ ގޮތް ހެދޭނީ އިނގިރޭސިއަށް އެކަނި، އެހެންކަމުން { $locale } ން ލިޔެފައިވާ ލިޔުމެއްގައި އޭގެ ލިޔުން ބަދަލުނުވެ ހުންނާނެ. ގިނަ ގޮތް ސީދާ ލިޔުއްވާ، ނުވަތަ `pluralForm` ސިފައިން ދެއްވާ.


## Checking against the schema

schema-element-unrecognized = އެލެމެންޓް `<{ $tag }>` އަކީ ދަންނަ Doenet އެލެމެންޓެއް ނޫން.

schema-element-not-allowed-at-root = އެލެމެންޓް `<{ $tag }>` ލިޔުމުގެ އަސްލުގައި ހުއްދައެއް ނޫން.

schema-element-not-allowed-inside = އެލެމެންޓް `<{ $tag }>` `<{ $parent }>` ގެ ތެރޭގައި ހުއްދައެއް ނޫން.

schema-attribute-unrecognized = އެލެމެންޓް `<{ $tag }>` ގައި `{ $attribute }` ކިޔާ ސިފައެއް ނެތް.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] އެލެމެންޓް `<{ $tag }>` ގެ `{ $attribute }` ސިފަ ވާންޖެހޭނީ ކޮންމެ އެއްޗެއް މީގެ ތެރެއިން އެއް ކަމުގައިވާ ލިސްޓަކަށް: { $allowed }
       *[other] އެލެމެންޓް `<{ $tag }>` ގެ `{ $attribute }` ސިފަ ވާންޖެހޭނީ މީގެ ތެރެއިން އެއް: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select އަށް ސައްހަނޫން ވައްތަރު ނަމެއް. ވައްތަރު ނަން { $variantName } { $numOptions } އޮޕްޝަނުގައި އަޔަސް ހޮވަންޖެހޭ އަދަދަކީ { $numToSelect }.

select-variant-name-without-options = select އަށް ބައެއް ވައްތަރު ދީފައިވީ ނަމަވެސް ވެދާނެ ވައްތަރު ނަން { $variantName } އަށް އެއްވެސް އޮޕްޝަނެއް ދީފައެއް ނުވޭ.

select-variant-name-not-possible = select އަށް ދީފައިވާ ވައްތަރު ނަން { $variantName } އަކީ ވެދާނެ ވައްތަރު ނަމެއް ނޫން.

select-too-few-options = ހަމައެކަނި { $numOptions } ން { $numToSelect } ބައި ނުހޮވޭ.

select-from-sequence-too-few-values = ދިގުމިން { $length } ގެ ސީކުއެންސަކުން { $numToSelect } އަގު ނުހޮވޭ.

select-from-sequence-indices-count-mismatch = select އަށް ދީފައިވާ އިންޑެކްސްގެ އަދަދު ހޮވަންޖެހޭ އަދަދާ ދިމާވާންޖެހޭ

select-from-sequence-indices-not-integers = select އަށް ދީފައިވާ ހުރިހާ އިންޑެކްސް އިންޓިޖަރަށް ވާންޖެހޭ

select-from-sequence-index-excluded = selectfromsequence ގެ ދީފައިވާ އިންޑެކްސް އޮތީ ބާކީކޮށްފައި

select-from-sequence-indices-excluded-combination = selectfromsequence ގެ ދީފައިވާ އިންޑެކްސްތަކަކީ ބާކީކުރި އެއްކުރުމެއް

select-from-sequence-coprime-not-positive-integers = ޕޮޒިޓިވް އިންޓިޖަރު ނުހޮވާތީ ކޯޕްރައިމް އެއްކުރުން ނުހޮވޭ.

select-from-sequence-coprime-common-factor = ކޯޕްރައިމް އަދަދު ނުހޮވޭ. ހުރިހާ ވެދާނެ އަގެއްގައި އެއް ފެކްޓަރެއް ހިއްސާވޭ. ("from" ނުވަތަ "to" ގެ ދީފައިވާ އަގުތައް "step" އާ ކޯޕްރައިމް ވާންޖެހޭ.)

select-from-sequence-coprime-single-number = 1 ނޫން އެއް އަދަދަކުން ކޯޕްރައިމް އެއްކުރުން ނުހޮވޭ.

select-from-sequence-excluded-too-many-combinations = selectFromSequence ގައި އެއްކުރުމުގެ 70% އަށްވުރެ ގިނަ ބާކީކުރެވުނު

select-from-sequence-coprime-none-found = ކޯޕްރައިމް އަދަދު ނުހޮވުނު. ހުރިހާ ވެދާނެ އަގެއްގައި އެއް ފެކްޓަރެއް ހިއްސާވޭ.

select-from-sequence-too-few-unique-values = ދިގުމިން { $numPossibleValues } ގެ ސީކުއެންސަކުން { $numToSelect } ތަފާތު އަގު ނުހޮވޭ

select-prime-numbers-too-few-values = ދިގުމިން { $numValues } ގެ ޕްރައިމް އަދަދު ލިސްޓަކުން { $numToSelect } އަގު ނުހޮވޭ

select-prime-numbers-values-count-mismatch = select އަށް ދީފައިވާ އަގުތަކުގެ އަދަދު ހޮވަންޖެހޭ އަދަދާ ދިމާވާންޖެހޭ

select-prime-numbers-values-not-prime = select prime number އަށް ދީފައިވާ ހުރިހާ އަގެއް ޕްރައިމް އަދަދު ލިސްޓުގައި ހުންނަންޖެހޭ

select-prime-numbers-values-excluded-combination = selectPrimeNumbers ގެ ދީފައިވާ އަގުތަކަކީ ބާކީކުރި އެއްކުރުމެއް

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers ގައި އެއްކުރުމުގެ 70% އަށްވުރެ ގިނަ ބާކީކުރެވުނު

select-random-combination-fluke = ވަރަށް ނާދިރު އިއްތިފާގަކުން ރެންޑަމް އަގުތަކުގެ އެއްކުރުމެއް ނުހޮވުނު

select-random-value-fluke = ވަރަށް ނާދިރު އިއްތިފާގަކުން ރެންޑަމް އަގެއް ނުހޮވުނު
