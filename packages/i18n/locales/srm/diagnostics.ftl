# Saramaccan (Saamáka tongo) diagnostics: the errors and warnings the worker,
# the parser and the language server put in front of whoever is looking at the
# screen. Translated from `locales/en/diagnostics.ftl`, which is the source of
# truth; the ids are reached by diagnostic code and are never translated.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The standard Saramaccan orthography of the Rountree /
# Glock dictionary and of the Saramaccan scriptures: seven vowel letters
# `a e ë i o ö u` (`ë` U+00EB and `ö` U+00F6 are letters of the alphabet); a
# doubled vowel writes length; **nasality is written with an `n` after the
# vowel**, that `n` belonging to the vowel; prenasalized `mb`, `nd`, `ng`;
# `tj` and `dj` for the palatal affricates; initial `h` («hopo», «hakisi»,
# «hii»). `chrome.ftl`'s header sets the system out point by point.
#
# **Tone is NOT written in this catalog, and that is a real loss.** Saramaccan
# is a tone language; the dictionary and the scriptures mark tone with
# accents, and tone distinguishes words otherwise spelled alike. All four
# files leave it unmarked. The only accented letter outside `ë` and `ö` is
# **«á», the preverbal negator**, spelled with its accent because that is the
# negator's spelling and not a tone mark.
#
# **Grammar.** The preverbal markers are «ta» (imperfective), «bi» (past),
# «o» (future), «sa» (able), «musu» (must); «á» negates and precedes them;
# «ku» is *and* and *with*; «u» / «fu» is the purposive; «dee» is the plural.
# Ndyuka, in `locales/djk`, is a different language with a different marker
# set, and these are not two spellings of one text.
#
# **DoenetML identifiers stay in English.** Tag names, attribute names and
# attribute values — `through`, `endpoint`, `midpointOffset`, `numDimensions`,
# `maxNumAttempts`, `symbolicEquality`, `math`, `text`, `number`, `boolean`,
# `none`, `medium`, `dense`, `from`, `to`, `step` — are the language, not
# prose, and are written here exactly as English writes them, as is the
# `[deprecation]` marker.
#
# **Number.** `Intl.PluralRules("srm")` has no CLDR data for `srm` and falls
# back to English. A Saramaccan noun after a numeral does not inflect, so
# every message English selects on a count —
# `line-segment-attributes-ignored-*`,
# `function-domain-insufficient-dimensions`,
# `function-iterates-input-output-mismatch`,
# `matches-pattern-parameter-not-in-pattern`,
# `answer-attributes-need-symbolic-equality`, `attribute-invalid-values` — is
# written here as **one unselected form**. The one remaining `[one]` branch,
# in `field-function-wrong-num-outputs`, is not a plural: it picks between two
# different sentences about what a slope field and a vector field each need,
# and dropping it would drop the advice.
#
# **Loans.** Dutch and English reshaped to Saramaccan phonology:
# «komponenti», «atibut», «waalde», «dokumenti», «vesi», «vaaliant»,
# «indeksi», «palamita», «ekispesi», «funsi», «matiiksi», «sekwensi»,
# «dimensi», «kontaasi», «anotasi», «sikema», «lefeensi», «fowtu». The
# Portuguese stratum carries what it carries: «kaba», «kuma», «ku», «sikifi»,
# «pooba», «manda», «ezempu». Saramaccan's own words carry the sentences:
# «á sa» (*cannot*), «musu» (*must*), «feni» (*find*), «tei», «buta», «puu»,
# «lei» (*show*), «tëli» (*count*), «bunu» / «á bunu».
#
# **Confidence.** Saramaccan has no written technical prose of this kind, so
# every loan above is a shape derived by rule rather than one found in use.
# What a reviewer should read for is the grammar: «ta» / «bi» / «o» / «sa» /
# «musu», the negator «á» in front of them, and «ku» for *and*. Nothing here
# was left in English.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } á ta tëli te tu endpoint buta

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } á ta tëli te wan endpoint ku wan midpoint buta hii tu

line-segment-midpoint-offset-without-midpoint = midpointOffset á ta du soni ee na wan midpoint á dë

## `<line>`

line-points-undetermined-dimensions = Di lin ta pasa punti di u á sabi ömëni dimensi de abi.

line-points-too-few-dimensions = Di lin musu pasa punti di abi tu dimensi ofu möön.

line-points-depend-on-variables = Di lin ta pasa punti di ta hanga dee vaaliabel aki: { $variables }.

line-equation-invalid-format = Di foomati u di ekwasi u di lin a dendu dee vaaliabel { $variable1 } ku { $variable2 } á bunu.

## `<ray>`

ray-overprescribed-through = Di sitaali buta ku through, endpoint ku direction.  U á ta tëli di through di buta.

ray-dimension-mismatch = Di numDimensions á ta fiti a dendu di sitaali.

## `<vector>`

vector-overprescribed-head = Di vekitoo buta ku head, tail ku displacement.  U á ta tëli di head di buta.

vector-dimension-mismatch = Di numDimensions á ta fiti a dendu di vekitoo.

## Attracting and constraining

attract-to-without-nearest-point = U á sa hali go a wan `<{ $component }>` biga a á abi wan nearestPoint stati-vaaliabel.

constrain-to-without-nearest-point = U á sa tai go a wan `<{ $component }>` biga a á abi wan nearestPoint stati-vaaliabel.

constrain-to-interior-without-nearest-point = U á sa tai go a dendu wan `<{ $component }>` biga a á abi wan nearestPoint stati-vaaliabel.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition á ta tëli a wan choiceInput di á da inline

## Ordering children by index

choice-input-indices-count-mismatch = U á ta tëli dee indices di buta da di choiceInput biga di nömbo u dee indices á ta fiti di nömbo u dee choice mii.

pretzel-indices-count-mismatch = U á ta tëli dee indices di buta da di problem biga di nömbo u dee indices á ta fiti di nömbo u dee problem mii.

shuffle-indices-count-mismatch = U á ta tëli dee indices di buta da di shuffle biga di nömbo u dee indices á ta fiti di nömbo u dee komponenti.

indices-ignored-out-of-range = U á ta tëli dee indices di buta da { $component } biga so u de dë a doo u di peesi.

pretzel-indices-repeated = U á ta tëli dee indices di buta da di pretzel biga so u de dë tu kaba.

pretzel-circuit-first-index = U á ta tëli dee indices di buta da di pretzel a dendu circuit fasi biga di fosu indeksi musu da 1.

## `<shuffle>` and `<sort>`

string-children-need-type = U `<{ $component }>` sa wooko ku sitingi mii, i musu buta wan `type` atibut.

invalid-type-defaulting-to-math = Di type { $type } á bunu da wan { $component } komponenti. A musu da math, text, number ofu boolean. U o tei math.

string-not-valid-component-to-arrange = Di sitingi "{ $value }" á da wan bunu komponenti u { $component }. U á ta tëli ën.

## Types and variables

invalid-type-defaulting-to-number = Di type { $type } á bunu, nöö u ta seti di type a number.

invalid-variable-value = Di waalde u wan vaaliabel á bunu: `{ $value }`

## Variants

variant-index-must-be-number = Di vaaliant-indeksi { $index } musu da wan nömbo

variant-index-must-be-integer = Di vaaliant-indeksi { $index } musu da wan hii nömbo

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` á mbei da abesoluut maiki. U ta seti dee bëëdë a relatif.

side-by-side-absolute-margins = `<{ $component }>` á mbei da abesoluut maiki. U ta seti dee kanti a relatif.

side-by-side-no-block-child = Di `<{ $component }>` aki á bunu: a musu abi wan blaka mii ofu möön.

## `<label>`

label-for-ignored-on-graphical = Di `for` atibut á ta tëli a wan gaafiki `<label>`.

label-for-must-resolve-to-one = Di `for` atibut a wan `<label>` musu lei wan komponenti nöö.

label-for-unresolved = Di `for` atibut a wan `<label>` á sa feni na wan komponenti.

label-for-answer-with-authored-inputs = Di `for` atibut a wan `<label>` ta lei wan `<answer>` di abi ën eigi inputu sikifi; lei di inputu seei.

label-for-answer-without-input = Di `for` atibut a wan `<label>` ta lei wan `<answer>` di á abi na wan inputu u dëën nen.

label-for-must-reference-input-or-answer = Di `for` atibut a wan `<label>` musu lei wan inputu ofu wan answer.

## Accessibility

accessibility-short-description-or-decorative = U di aksesibiliteiti, wan `<{ $component }>` musu abi wan sooti deskiipsi ofu a musu buta kuma decorative.

accessibility-video-short-description = U di aksesibiliteiti, wan `<video>` musu abi wan sooti deskiipsi.

accessibility-input-short-description-or-label = U di aksesibiliteiti, wan `<{ $component }>` musu abi wan sooti deskiipsi ofu wan nen.

accessibility-answer-input-short-description-or-label = U di aksesibiliteiti, wan `<answer>` di ta mbei wan inputu musu abi wan sooti deskiipsi ofu wan nen.

accessibility-short-description-contains-math = Sooti deskiipsi á musu abi matematika-komponenti kuma `<{ $component }>` a dendu. Sikifi di matematika ku buka.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } á abi nöfu kontaasi da di seksi-hedi tëkisi (dark fasi) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a abi fanöudu { $threshold }:1 ofu möön).
       *[other] { $colorName } á abi nöfu kontaasi da di seksi-hedi tëkisi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a abi fanöudu { $threshold }:1 ofu möön).
    }

## `<circle>`

circle-through-points-non-numerical = U á mbei wan `<circle>` di ta pasa { $count } punti ete da di situwasi ka dee punti á abi nömbo-waalde.

circle-too-many-through-points = U á sa wooko wan lontu di ta pasa möön kuma 3 punti.

circle-overprescribed-radius-center-points = U á sa wooko wan lontu te radius, center ku through-punti buta hii dii.

circle-center-with-multiple-points = U á sa wooko wan lontu ku wan center di buta di ta pasa möön kuma 1 punti.

circle-radius-too-small = U á sa wooko di lontu: di pasi mindi dee tu punti da { $distance }, nöö di radius { $radius } di buta piki tuutuu.

circle-radius-with-many-points = U á sa mbei wan lontu di ta pasa möön kuma tu punti ku wan radius di buta.

circle-invalid-center-or-through-points = Di center ofu dee through-punti u di lontu á bunu.

circle-radius-center-with-multiple-points = U á sa wooko di radius u wan lontu ku wan center di buta di ta pasa möön kuma 1 punti.

circle-change-radius-non-numerical = U á sa kambia di radius u wan lontu di abi through-punti di á abi nömbo-waalde

circle-radius-with-points-non-numerical = U á sa mbei wan lontu di ta pasa möön kuma wan punti ku wan radius di buta te dee punti á abi nömbo-waalde.

circle-change-center-non-numerical = U á mbei wan fasi ete u kambia di center u wan lontu di ta pasa punti di á abi nömbo-waalde.

## `<function>`

function-domain-insufficient-dimensions = Di domein á abi nöfu dimensi da di funsi. Di domein abi { $intervals } intavalu ma di funsi abi { $inputs } inputu.

function-domain-invalid-format = Di foomati u di domein u di funsi á bunu.

function-ignoring-non-numerical =
    { $type ->
        [maximum] U á ta tëli di möön hei punti u di funsi biga a á da wan nömbo.
        [minimum] U á ta tëli di möön basu punti u di funsi biga a á da wan nömbo.
        [extremum] U á ta tëli di ekisteemu u di funsi biga a á da wan nömbo.
        [point] U á ta tëli di punti u di funsi biga a á da wan nömbo.
        [slope] U á ta tëli di helin u di funsi biga a á da wan nömbo.
       *[other] U á ta tëli di { $type } u di funsi biga a á da wan nömbo.
    }

function-ignoring-empty =
    { $type ->
        [maximum] U á ta tëli di möön hei punti u di funsi biga a lëigi.
        [minimum] U á ta tëli di möön basu punti u di funsi biga a lëigi.
        [extremum] U á ta tëli di ekisteemu u di funsi biga a lëigi.
        [point] U á ta tëli di punti u di funsi biga a lëigi.
       *[other] U á ta tëli di { $type } u di funsi biga a lëigi.
    }

function-points-too-close = Di funsi abi tu punti di dë tuutuu kandi u makandi. U á sa mbei di funsi.

function-iterates-input-output-mismatch = Funsi-itelasi sa wooko nöö ee di nömbo u dee inputu da di seei kuma di nömbo u dee outputu. Di funsi aki abi { $inputs } inputu ku { $outputs } outputu.

## `<sequence>`

sequence-invalid-length = Di longi u di sekwensi á bunu.  A musu da wan hii nömbo di á negatif.

sequence-invalid-step = Di step u di sekwensi á bunu.  A musu da wan nömbo da wan sekwensi u type { $type }.

sequence-invalid-endpoint-number = Di "{ $attribute }" u di nömbo-sekwensi á bunu.  A musu da wan nömbo.

sequence-invalid-endpoint-letters = Di "{ $attribute }" u di letu-sekwensi á bunu.  A musu da wan mokisi u letu.

sequence-invalid-endpoint = Di "{ $attribute }" u di sekwensi á bunu.

select-from-sequence-coprime-not-numbers = u á ta tëli coprime biga u á ta tei nömbo

select-from-sequence-coprime-with-exclude-combinations = u á ta tëli coprime biga excludeCombinations buta

## Resolving a `target`

target-not-found = Di target da `<{ $source }>` á bunu: u á sa feni di target.

target-state-variable-not-found = Di target da `<{ $source }>` á bunu: u á sa feni na wan stati-vaaliabel di nen "{ $property }" a wan `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Dee vaaliabel u wan `<odeSystem>` musu da woto fasi kuma di onafanki vaaliabel.

ode-system-duplicate-variable-names = U á sa mbei ODE RHS funsi ku di seei dependenti vaaliabel-nen tu kaba.

ode-system-rhs-function-error = U á sa mbei di ODE RHS funsi.  Fowtu di u bi ta mbei di mathjs funsi.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = U á sa mbei wan uku mindi { $count } lin

angle-invalid-through-point = Di punti a dendu di through u di `<angle>` á bunu

parabola-vertex-too-many-points = U á mbei wan palabola ku wan vertex di ta pasa möön kuma 1 punti ete.

parabola-too-many-points = U á mbei wan palabola di ta pasa möön kuma 3 punti ete.

intersection-too-many-items = U á mbei intaseksi da möön kuma tu soni ete

## Other math components

ionic-compound-not-two-ions = U á mbei na wan ioniki mokisisoni da wan woto soni boiti tu ion ete.

ionic-compound-needs-cation-and-anion = U ta mbei ioniki mokisisoni nöö da wan kation ku wan anion.

solve-equations-cannot-evaluate = U á sa lusu di ekwasi biga u á sa wooko ën: { $equation }

math-operators-operand-number-required = I musu buta wan operandNumber te i ta puu wan matematika-operanti.

eigen-decomposition-failed = U á sa wooko dee eigenwaalde u di matiiksi

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: di palamita { $parameters } á dë a dendu di patoon, nöö a o fiti wan lëigi peesi hii yuu.

## `<graph>`

graph-grid-invalid = `<graph>`: u á sa fusutan grid="{ $grid }". A musu da none, medium, dense, ofu tu positif nömbo ku wan peesi mindi de, kuma grid="1 0.5". U á ta tei na wan grid.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` abi fanöudu wan funsi ku { $expected ->
        [one] wan outputu, di helin y' a hiniwan punti, kuma `y - x`
       *[other] tu outputu, di vekitoo a hiniwan punti, kuma `(y, -x)`
    }, ma di funsi di a kisi abi { $found } outputu. { $alternative ->
        [none] U á ta tei na wan soni.
       *[other] `<{ $alternative }>` da di komponenti da di funsi dati. U á ta tei na wan soni.
    }

field-function-attribute-ignored-with-child = U á ta tëli di `function` atibut biga di funsi dë a dendu di komponenti tu; u ta tei di wan di dë a dendu. Da di funsi wan u dee tu fasi nöö.

field-variables-ignored =
    `<{ $component }>`: di `variables` atibut ta nen dee vaaliabel u wan ekispesi di sikifi a dendu di komponenti seei. { $reason ->
        [function-child] Di funsi aki da kuma wan `<function>` mii, di ta nen ën eigi vaaliabel, nöö u á ta tëli `variables`.
       *[no-expression] Na wan söwan ekispesi á dë aki, nöö u á ta tëli `variables`.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: di prefigure renderer á ta tei xLabelPosition="left"; u o wooko kuma right.

prefigure-y-label-position-unsupported = `<graph>`: di prefigure renderer á ta tei yLabelPosition="bottom"; u o wooko kuma top.

prefigure-invalid-axis-bounds = `<graph>`: dee asi-maiki á bunu da di prefigure kambia; u o tei di difoolti bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: di bëëdë á bunu da di prefigure kambia; u o tei di difoolti diagram-bëëdë 425.

prefigure-invalid-aspect-ratio = `<graph>`: di aspectRatio á bunu da di prefigure kambia; u o tei di difoolti aspek-ratio 1.

prefigure-grid-spacing-too-fine = `<graph>`: di grid-peesi fini tuutuu da dee asi-maiki; u ta disa di grid a doo a dendu di prefigure renderer.

prefigure-annotations-not-rendered = `<graph>`: u á o tei na wan anotasi ee u á ta wooko ku di PreFigure renderer.

multiple-annotations-children = U feni möön kuma wan `<annotations>` mii a dendu di `<graph>`: u á ta tëli de hii boiti di laasi wan.

## Referring to other components

copy-unrecognized-component-type = U á sa langa ofu kopi wan komponenti-sootu di u á sabi: { $type }.

copy-prop-not-found = U á sa feni di prop { $property } a wan komponenti u sootu { $component }

collect-no-source = U á feni na wan source da di collect.

collect-invalid-component-type = U á sa kolekiti komponenti u sootu `<{ $component }>` biga dati á da wan bunu komponenti-sootu.

reference-index-unavailable = U á sa lei di indeksi `{ $reference }`

## `<callAction>`

component-action-unavailable = U á sa kai { $action } a di komponenti `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Di fomu u di data á bunu.  Dee lo á abi di seei longi. Feni a dendu componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Di data abi di seei kolon-nen tu kaba.  Feni a dendu componentIdx :{ $componentIdx }

data-frame-missing-column-name = Wan kolon-nen mankei a dendu di data.  Feni a dendu componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Wan award da di piki aki ta hanga di answer tag ën eigi piki di manda, nöö soni o pasa di i á o fusutan.

answer-max-num-attempts-in-section-wide-check-work = Ee i seti `maxNumAttempts` a wan `<answer>` a dendu wan bokisi di abi `sectionWideCheckWork`, a á ta du soni, biga di bokisi ta tii di nömbo u dee pooba. Seti `maxNumAttempts` a di bokisi.

nested-section-wide-check-work-max-num-attempts = Ee i seti `maxNumAttempts` a wan bokisi di abi `sectionWideCheckWork` di dë a dendu wan woto bokisi di abi `sectionWideCheckWork`, a á ta du soni, biga di bokisi a doose ta tii di nömbo u dee pooba. Seti `maxNumAttempts` a di bokisi a doose.

answer-attributes-need-symbolic-equality = Di { $attributes } atibut á o du soni ee symbolicEquality á seti.

answer-invalid-type = Di sootu da di piki á bunu: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Biga di komponenti `<{ $component }>` á abi na wan nen, u á sa wooko ën da wan module atibut

module-attribute-name-already-defined = U á sa wooko di komponenti `<{ $component } name="{ $name }">` kuma wan atibut da wan module biga di `<module>` komponenti-sootu abi wan "{ $name }" atibut kaba.

conditional-content-condition-ignored = Di atibut `condition` á ta tëli a wan `<conditionalContent>` komponenti di abi case ofu else mii.

slider-markers-type-mismatch = Di maiki-sootu á ta fiti di slider-sootu.

pretzel-problem-needs-statement-and-answer = Di pretzel aki á bunu: hiniwan `<problem>` musu abi wan `<statement>` ku wan `<answer>`.

pretzel-circuit-first-problem-distractor = Di pretzel aki á bunu: a dendu mode="circuit", di fosu `<problem>` á sa da wan distractor.

## Attribute values

attribute-invalid-values = Di waalde { $values } da di atibut `{ $attribute }` á bunu; u á ta tëli ën.

attribute-must-be-references = Di waalde `{ $value }` da di atibut `{ $attribute }` á bunu. Di atibut musu mbei u lefeensi di ta bigi ku wan `$`.

math-input-invalid-function-names = <mathInput>: u á ta tëli funsi-nen di á bunu a dendu { $attribute }: { $names }. Hiniwan nen ën lei-pisi musu abi tu tëkin ofu möön (letu ofu sitëëpi); wan `|<mathspeak alternative>` sa ko a ën baka ee i kë.

## Building components from the source

component-type-invalid = Di komponenti-sootu aki á bunu: `<{ $componentType }>`

attribute-repeated = I á sa buta di atibut { $attribute } tu kaba.

attribute-invalid-for-component = Di atibut "{ $attribute }" á bunu da wan komponenti u sootu `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Sitali-definisi { $styleNumber } á abi nöfu kontaasi da { $context ->
        [text-on-background] di tëkisi-kulo agensi di bakagoon-kulo
        [high-contrast] di hei-kontaasi kulo agensi di kanvasi
        [line] di lin-kulo agensi di kanvasi
        [marker] di maiki-kulo agensi di kanvasi
       *[text-on-canvas] di tëkisi-kulo agensi di kanvasi
    }{ $mode ->
        [dark] { " (dark fasi)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a abi fanöudu { $threshold }:1 ofu möön).

style-definition-dark-mode-text-background-contrast =
    Aladi sitali-definisi { $styleNumber } buta kulo di abi nöfu kontaasi da light fasi, dee dark-fasi kulo di ko u de á abi nöfu kontaasi da di tëkisi-kulo agensi di bakagoon-kulo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a abi fanöudu { $threshold }:1 ofu möön). { $suggestion ->
        [available] U abi nöfu kontaasi a dendu dark fasi, mbei di light-fasi kontaasi möön gaan (kuma ezempu, seti { $lightAttribute }="{ $lightColor }") ofu kambia di dark-fasi kulo (kuma ezempu, seti { $darkAttribute }="{ $darkColor }").
       *[none] U abi nöfu kontaasi a dendu dark fasi, mbei di light-fasi kontaasi möön gaan ofu kambia dee kulo di ko u de ku textColorDarkMode ku/ofu backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Aladi sitali-definisi { $styleNumber } buta wan tëkisi-kulo di abi nöfu kontaasi da light fasi, di dark-fasi tëkisi-kulo di ko u ën á abi nöfu kontaasi agensi di kanvasi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a abi fanöudu { $threshold }:1 ofu möön). { $suggestion ->
        [available] U abi nöfu kontaasi a dendu dark fasi, mbei di light-fasi kontaasi möön gaan (kuma ezempu, seti textColor="{ $lightColor }") ofu kambia di dark-fasi kulo (kuma ezempu, seti textColorDarkMode="{ $darkColor }").
       *[none] U abi nöfu kontaasi a dendu dark fasi, mbei di light-fasi kontaasi möön gaan ofu kambia di kulo di ko u ën ku textColorDarkMode.
    }

section-multiple-style-palettes = Wan seksi sa tei wan <stylePalette> nöö; u ta tei di laasi wan.

## Unique variants

variant-num-to-select-not-non-negative-integer = u á sa wooko dee apaiti vaaliant u { $component } biga numToSelect á da wan hii nömbo di á negatif.

variant-num-to-select-not-constant-number = u á sa wooko dee apaiti vaaliant u { $component } biga numToSelect á da wan konstanti nömbo.

variant-with-replacement-not-constant-boolean = u á sa wooko dee apaiti vaaliant u { $component } biga withReplacement á da wan konstanti boolean.

variant-select-weight-disables-unique = Dee apaiti vaaliant da select ta tapa ee wan opsi abi selectWeight ofu selectForVariants buta

variant-coprime-undetermined = u á sa wooko dee apaiti vaaliant u { $component } biga u á sa sabi ee coprime da falisi hii yuu.

variant-attribute-not-constant = u á sa wooko dee apaiti vaaliant u { $component } biga { $attribute } á da konstanti.

variant-attribute-not-number = u á sa wooko dee apaiti vaaliant u { $component } biga { $attribute } á da wan nömbo.

variant-attribute-wrong-type-for-sequence =
    u á sa wooko dee apaiti vaaliant u { $component } u { $type } sootu biga { $attribute } á da { $expected ->
        [letters-combination] wan mokisi u letu
        [math-expression] wan bunu matematika-ekispesi
        [integer] wan hii nömbo
       *[number] wan nömbo
    }.

variant-length-not-integer = u á sa wooko dee apaiti vaaliant u { $component } biga di length á da wan hii nömbo.

variant-sort-not-implemented = u á mbei apaiti vaaliant da wan { $component } ku sort ete

variant-exclude-combinations-not-implemented = u á mbei apaiti vaaliant da wan { $component } ku excludeCombinations ete

variant-math-exclude-not-implemented = u á mbei apaiti vaaliant da wan { $component } u sootu math ku exclude ete

variant-non-constant-exclude-not-implemented = u á mbei apaiti vaaliant da wan { $component } ku wan exclude di á konstanti ete

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: di graph prefigure renderer á ta tei disi; u ta pasa di bakamii.

prefigure-descendant-invalid-geometry = { $subject }: di jometi á finiti ofu a á kaba; u ta pasa di bakamii.

prefigure-curve-label-omitted = { $subject }: nen á ta wooko a kookotu lin di kambia; u ta disa di nen a doo.

prefigure-curve-unsupported-definition-type = { $subject }: u á ta tei di kookotu-lin funsi-definisi sootu '{ $definitionType }'; u ta pasa di bakamii.

prefigure-region-flip-functions-unsupported = { $subject }: u á ta tei di flipFunctions atibut a regionBetweenCurves; u ta pasa di bakamii.

prefigure-region-non-formula-child = { $subject }: fomula-sootu mii funsi nöö ta wooko a regionBetweenCurves; u ta pasa di bakamii.

prefigure-label-position-unsupported =
    { $subject }: u á ta tei labelPosition '{ $labelPosition }' da wan { $labelKind ->
        [line-family] lin-famii nen
       *[point] punti-nen
    }; u ta tei di difoolti PreFigure fasi.

prefigure-fill-style-unsupported = { $subject }: PreFigure á ta tei di fuu-sitali '{ $fillStyle }'; u o tei wan sölufu fuu.

prefigure-line-style-unknown = { $subject }: u ta disa di lin-sitali '{ $lineStyle }' di u á sabi a doo u di PreFigure outputu.

prefigure-marker-style-mapped-to-diamond = { $subject }: u kambia di maiki-sitali '{ $markerStyle }' go a dendu di PreFigure sitali 'diamond'.

prefigure-marker-style-unsupported = { $subject }: PreFigure á ta tei di maiki-sitali '{ $markerStyle }'; u ta tei di difoolti sitali.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: di `ref` á bunu; u á sa feni di target. U ta disa di anotasi a doo.

annotation-ref-multiple-targets = `<annotation>`: di `ref` ta lei möön kuma wan target; u ta tei di fosu wan.

annotation-ref-outside-graph = `<annotation>`: di `ref` á bunu; di target dë a doose u di graph. U ta disa di anotasi a doo.

annotation-ref-unsupported-target = `<annotation>`: di `ref` á bunu; di target á da wan gaafiki soni di di prefigure kambia ta tei. U ta disa di anotasi a doo.

annotation-text-missing = `<annotation>`: di `text` mankei ofu a lëigi; u o puu lëigi tëkisi.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] U feni wan lontu dependensi.
       *[other] U feni wan lontu dependensi di ta hanga wan `<{ $componentType }>` komponenti.
    }

reference-no-referent = U á feni na wan soni di di lefeensi aki ta lei: `{ $reference }`

reference-multiple-referents = U feni möön kuma wan soni di di lefeensi aki ta lei: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Di foomati u di atibut { $attribute } u `<{ $componentType }>` á bunu.

children-invalid = Dee mii da `<{ $componentType }>` á bunu: u feni mii di á bunu: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Di waalde `{ $value }` da di atibut `{ $attribute }` á bunu, nöö u ta tei di waalde `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] U á feni DoenetML vesi { $version }.
       *[other] U á feni DoenetML vesi { $version }. U o tei vesi { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Di DoenetML aki á bunu: { $content }

parse-tag-missing-close-tag = Di DoenetML aki á bunu: Di tag `{ $tag }` á abi na wan tapa-tag. U bi ta fuuwakiti wan tag di ta tapa ënseei ofu wan `</{ $tagName }>` tag.

parse-tag-error = Di DoenetML aki á bunu: Fowtu a dendu di tag `<{ $tagName }>`

parse-attribute-missing-value = Di DoenetML aki á bunu: Di atibut `{ $attribute }` á bunu — a gei taa wan waalde mankei.

parse-attribute-invalid = Di DoenetML aki á bunu: Di atibut `{ $attribute }` á bunu

parse-attribute-value-invalid = Di DoenetML aki á bunu: Di atibut-waalde `{ $value }` á bunu

parse-attribute-value-quote-mismatch = Di DoenetML aki á bunu: Di atibut-waalde `{ $value }` á bunu. Dee koti-maiki á ta fiti makandi. A gei taa wan `{ $quote }` mankei.

parse-open-tag-name-missing = Di DoenetML aki á bunu: U feni wan tag sondee tag-nen, kuma `<`

parse-tag-not-closed = Di DoenetML aki á bunu: Di tag `{ $tag }` á tapa (a gei taa wan `>` mankei).

parse-self-closing-tag-name-missing = Di DoenetML aki á bunu: U feni wan tag sondee tag-nen `<{ $content }>`

parse-self-closing-tag-not-closed = Di DoenetML aki á bunu: Di tag `{ $tag }` á tapa (a gei taa `/>` mankei).

parse-tag-invalid-attributes = Di DoenetML aki á bunu: Di tag `{ $tag }` á bunu. A sa abi fowtu atibut.

parse-close-tag-name-missing = Di DoenetML aki á bunu: U feni wan tapa-tag sondee tag-nen, kuma `</`

parse-attribute-value-unquoted = Atibut-waalde musu dë a dendu koti-maiki: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Di DoenetML aki á bunu: U feni di tapa-tag `{ $tag }`, ma na wan hopo-tag á dë da ën

parse-close-tag-mismatched = Di DoenetML aki á bunu: Di tapa-tag á ta fiti. U bi ta fuuwakiti `</{ $expected }>`. U feni `{ $found }`

parser-node-unconvertible = U á sa kambia di nodu { $node } go a wan Dast nodu.

## Names

name-attribute-invalid =
    Di atibut name='{ $name }' á bunu. { $reason ->
        [characters] Nen sa abi letu, nömbo, ondooteki ofu sitëëpi nöö.
       *[start] Nen musu bigi ku wan letu.
    }

component-name-invalid-start = Di komponenti-nen "{ $name }" á bunu. Nen musu bigi ku wan letu.

## `<answer>` sugar

answer-video-watched-missing-video = Wan answer u sootu videoWatched musu abi wan video atibut

answer-video-watched-video-not-reference = Wan answer u sootu videoWatched musu abi wan video atibut di da wan lefeensi

answer-name-not-single-text = Di answer name atibut musu abi wan tëkisi-mii nöö

## Referencing another document

external-doenetml-recursion-limit = U á sa kisi di doose DoenetML biga tuutuu sömëni lo u lekursi. Wan lontu lefeensi dë?

external-doenetml-unavailable = U á sa kisi na wan DoenetML u { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Di DoenetML di u kisi u { $attribute }="{ $uri }" á bunu: a á ta fiti di komponenti-sootu "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Di atibut `{ $from }` á ta wooko möön; wooko `{ $to }` a ën peesi.
       *[other] [deprecation] Di atibut `{ $from }` a `<{ $component }>` á ta wooko möön; wooko `{ $to }` a ën peesi.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Di atibut `{ $from }` á ta wooko möön, nöö u á ta tëli ën, biga `{ $to }` buta tu.
       *[other] [deprecation] Di atibut `{ $from }` a `<{ $component }>` á ta wooko möön, nöö u á ta tëli ën, biga `{ $to }` buta tu.
    }

deprecated-attribute-ignored = [deprecation] Di atibut `{ $attribute }` a `<{ $component }>` á ta wooko möön, nöö u á ta tëli ën.

deprecated-attribute-to-child = [deprecation] Di atibut `{ $attribute }` a `<{ $component }>` á ta wooko möön; wooko wan `<{ $child }>` mii a ën peesi.

deprecated-attribute-value-renamed = [deprecation] Di waalde `{ $value }` u di atibut `{ $attribute }` a `<{ $component }>` á ta wooko möön; wooko `{ $to }` a ën peesi.


## Language coverage

pluralize-english-only = `<pluralize>` sa mbei Ingiisi buka ko sömëni nöö, nöö di tëkisi u ën ta tan di seei a dendu wan dokumenti di sikifi a dendu { $locale }. Sikifi di sömëni-fasi seei, ofu buta ën ku di `pluralForm` atibut.


## Checking against the schema

schema-element-unrecognized = Di elementi `<{ $tag }>` á da wan Doenet elementi di u sabi.

schema-element-not-allowed-at-root = Di elementi `<{ $tag }>` á sa dë a di lutu u di dokumenti.

schema-element-not-allowed-inside = Di elementi `<{ $tag }>` á sa dë a dendu `<{ $parent }>`.

schema-attribute-unrecognized = Di elementi `<{ $tag }>` á abi na wan atibut di nen `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Di atibut `{ $attribute }` u di elementi `<{ $tag }>` musu da wan lisi ka hiniwan soni da wan u dee aki: { $allowed }
       *[other] Di atibut `{ $attribute }` u di elementi `<{ $tag }>` musu da wan u dee aki: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Di vaaliant-nen da di select á bunu.  Di vaaliant-nen { $variantName } dë a dendu { $numOptions } opsi ma di nömbo u tei da { $numToSelect }.

select-variant-name-without-options = So vaaliant buta da di select ma na wan opsi á buta da di vaaliant-nen: { $variantName }.

select-variant-name-not-possible = Di vaaliant-nen { $variantName } di buta da di select á da wan vaaliant-nen di sa dë.

select-too-few-options = U á sa tei { $numToSelect } komponenti u { $numOptions } nöö.

select-from-sequence-too-few-values = U á sa tei { $numToSelect } waalde u wan sekwensi di longi { $length }.

select-from-sequence-indices-count-mismatch = Di nömbo u dee indices di buta da di select musu fiti di nömbo u tei

select-from-sequence-indices-not-integers = Hii dee indices di buta da di select musu da hii nömbo

select-from-sequence-index-excluded = Wan indeksi u selectfromsequence buta di bi puu a doo

select-from-sequence-indices-excluded-combination = Dee indices u selectfromsequence di buta bi da wan mokisi di puu a doo

select-from-sequence-coprime-not-positive-integers = U á sa tei koopime mokisi biga u á ta tei positif hii nömbo.

select-from-sequence-coprime-common-factor = U á sa tei koopime nömbo. Hii dee waalde abi di seei fakitoo. (Dee waalde di buta da "from" ofu "to" musu da koopime ku "step".)

select-from-sequence-coprime-single-number = U á sa tei koopime mokisi u wan nömbo nöö di á da 1.

select-from-sequence-excluded-too-many-combinations = Möön kuma 70% u dee mokisi a dendu selectFromSequence bi puu a doo

select-from-sequence-coprime-none-found = U á sa tei koopime nömbo. Hii dee waalde abi di seei fakitoo.

select-from-sequence-too-few-unique-values = U á sa tei { $numToSelect } apaiti waalde u wan sekwensi di longi { $numPossibleValues }

select-prime-numbers-too-few-values = U á sa tei { $numToSelect } waalde u wan lisi u paim nömbo di longi { $numValues }

select-prime-numbers-values-count-mismatch = Di nömbo u dee waalde di buta da di select musu fiti di nömbo u tei

select-prime-numbers-values-not-prime = Hii dee waalde di buta da select paim nömbo musu dë a dendu di lisi u paim nömbo

select-prime-numbers-values-excluded-combination = Dee waalde u selectPrimeNumbers di buta bi da wan mokisi di puu a doo

select-prime-numbers-excluded-too-many-combinations = Möön kuma 70% u dee mokisi a dendu selectPrimeNumbers bi puu a doo

select-random-combination-fluke = Ku wan kansi di haa haa ta pasa, u á sa tei wan mokisi u lukuluku waalde

select-random-value-fluke = Ku wan kansi di haa haa ta pasa, u á sa tei wan lukuluku waalde

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    U á ta tei di `<{ $component }>` a dendu di matematika; u ta seti di ekispesi kuma fa a bi dë fosu inputu bi sa go a dendu. { $reason ->
        [not-inline] Wan `inline` choice inputu nöö ta fiti a dendu wan ekispesi; sondee `inline` a da wan blaka u kanapu.
        [expanded] Wan `expanded` tëkisi inputu da wan bokisi ku möön kuma wan lin, nöö a gaan tuutuu u sindo a dendu wan ekispesi.
        [on-graph] A wan graph, u ta tei di ekispesi kuma wan pentje nöö, nöö na wan peesi á dë da wan kanapu.
       *[relative-width] Ën `width` da relatif (wan pesenti ofu `em`), nöö na soni á dë u maiki ën agensi a dendu wan ekispesi. Da di bëëdë a dendu abesoluut maiki, kuma `px`.
    }
