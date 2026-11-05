# Tausug diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Latin orthography of the other three files of this locale;
# see `locales/tsg/chrome.ftl` for the argument against Sulat Sūg, for the
# spelling rules, and for the verb-formation assumption every verb here rests
# on.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source, and so do `PreFigure`, `DoenetML` and `Dast`.
#
# FOUR PHRASES CARRY MOST OF THIS FILE, and naming them here means a
# corrector can change all of them at once:
#
#   - "is ignored" is **«di' iyaagad»** — "is not heeded";
#   - "cannot" is **«di' mahinang»**;
#   - "must" is **«subay»**;
#   - "have not implemented" is **«wala' pa nahinang»**.
#
# The particles are Tausug and are the quick check: **«in»** (topic),
# **«sin»** (genitive), **«ha»** (oblique), **«dayn ha»** (from), **«nga»**
# (linker), **«manga»** (plural), **«awn»** / **«way»** (there is / there is
# none), **«iban»** (and), **«atawa»** (or), **«sagawa'»** (but), **«bang»**
# (if), **«sabab»** (because). The three negators stay apart: **«di'»** before
# a verb, **«bukun»** before a noun, **«way»** for "there is none".
#
# DECLARED LOANS. The technical nouns are the Filipino and English school
# words — `komponin`, `atribut`, `indeks`, `matriks`, `parameter`, `format`,
# `bersyon`, `rekursyon`, `dimensyon`, `function`, `vector`, `grid`, `label`,
# `input`, `output` — because those are what a Tausug reader has met them as.
# Where a shape or a quantity has a Spanish-derived Filipino form in ordinary
# use, that form is written instead.
#
# Every count selection is a single `*[other]`: Tausug does not mark number on
# a noun after a numeral, and `Intl.PluralRules` has no data for `tsg` to
# select a `[one]` branch with. The one `[1]` below is a numeric literal
# matched against the number itself, which stays legal.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
       *[other] in { $attributes } di' iyaagad bang duwa in tungud siyabbut
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
       *[other] in { $attributes } di' iyaagad bang in hangka-tungud iban in titik ha tunga' siyabbut magsama
    }

line-segment-midpoint-offset-without-midpoint = way kapūsan sin midpointOffset bang way titik ha tunga'

## `<line>`

line-points-undetermined-dimensions = Linya nga dumaralan ha manga titik nga di' matantu in dimensyon.

line-points-too-few-dimensions = In linya subay dumaralan ha manga titik nga duwa in kaputusan dimensyon.

line-points-depend-on-variables = In linya dumaralan ha manga titik nga masandal ha manga variable: { $variables }.

line-equation-invalid-format = Sala' in format sin ekwasyon sin linya ha manga variable { $variable1 } iban { $variable2 }.

## `<ray>`

ray-overprescribed-through = In sinag siyabbut dayn ha through, endpoint iban direction.  In through siyabbut di' iyaagad.

ray-dimension-mismatch = Di' magsibu' in numDimensions ha sinag.

## `<vector>`

vector-overprescribed-head = In vector siyabbut dayn ha head, tail iban displacement.  In head siyabbut di' iyaagad.

vector-dimension-mismatch = Di' magsibu' in numDimensions ha vector.

## Attracting and constraining

attract-to-without-nearest-point = Di' mahinang in pagbutang pa `<{ $component }>` sabab way nearestPoint niya nga state variable.

constrain-to-without-nearest-point = Di' mahinang in paglimbang pa `<{ $component }>` sabab way nearestPoint niya nga state variable.

constrain-to-interior-without-nearest-point = Di' mahinang in paglimbang pa lawm sin `<{ $component }>` sabab way nearestPoint niya nga state variable.

## `<choiceInput>`

choice-input-label-position-ignored = In labelPosition di' iyaagad ha choiceInput nga bukun inline

## Ordering children by index

choice-input-indices-count-mismatch = In manga indeks siyabbut ha choiceInput di' iyaagad sabab di' magsibu' in taud sin indeks iban in taud sin manga anak choice.

pretzel-indices-count-mismatch = In manga indeks siyabbut ha problem di' iyaagad sabab di' magsibu' in taud sin indeks iban in taud sin manga anak problem.

shuffle-indices-count-mismatch = In manga indeks siyabbut ha shuffle di' iyaagad sabab di' magsibu' in taud sin indeks iban in taud sin manga komponin.

indices-ignored-out-of-range = In manga indeks siyabbut ha { $component } di' iyaagad sabab awn indeks ha guwa' sin lugal.

pretzel-indices-repeated = In manga indeks siyabbut ha pretzel di' iyaagad sabab awn indeks naulit.

pretzel-circuit-first-index = In manga indeks siyabbut ha pretzel ha mode circuit di' iyaagad sabab in nakauna nga indeks subay 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Ha supaya makahinang in `<{ $component }>` iban manga anak string, subay siyabbut in atribut `type`.

invalid-type-defaulting-to-math = Sala' in type { $type } ha komponin { $component }. Subay hambuuk dayn ha math, text, number atawa boolean. Biyalik pa math.

string-not-valid-component-to-arrange = In string "{ $value }" bukun komponin nga mahinang { $component }. Di' iyaagad.

## Types and variables

invalid-type-defaulting-to-number = Sala' in type { $type }, in type biyalik pa number.

invalid-variable-value = Sala' in timbang sin variable: `{ $value }`

## Variants

variant-index-must-be-number = In indeks sin varyant { $index } subay number

variant-index-must-be-integer = In indeks sin varyant { $index } subay integer

## `<sideBySide>`

side-by-side-absolute-widths = In `<{ $component }>` wala' pa nahinang ha sukud nga absolute. In luag biyalik pa relative.

side-by-side-absolute-margins = In `<{ $component }>` wala' pa nahinang ha sukud nga absolute. In kilid biyalik pa relative.

side-by-side-no-block-child = Sala' in `<{ $component }>`: subay awn hangka-anak nga block.

## `<label>`

label-for-ignored-on-graphical = In atribut `for` ha `<label>` nga ladawan di' iyaagad.

label-for-must-resolve-to-one = In atribut `for` ha `<label>` subay tumuyu' pa hambuuk-buuk nga komponin.

label-for-unresolved = In atribut `for` ha `<label>` di' matantu bang unu komponin in tinuyu' niya.

label-for-answer-with-authored-inputs = In atribut `for` ha `<label>` tumuyu' pa `<answer>` nga awn input siyulat sin nagsulat; tuyu'a in input ha di' na maglabay.

label-for-answer-without-input = In atribut `for` ha `<label>` tumuyu' pa `<answer>` nga way input hilabelan.

label-for-must-reference-input-or-answer = In atribut `for` ha `<label>` subay tumuyu' pa input atawa pa answer.

## Accessibility

accessibility-short-description-or-decorative = Pasal akses, in `<{ $component }>` subay awn maikut nga paglaral atawa siyabbut nga hiyas.

accessibility-video-short-description = Pasal akses, in `<video>` subay awn maikut nga paglaral.

accessibility-input-short-description-or-label = Pasal akses, in `<{ $component }>` subay awn maikut nga paglaral atawa label.

accessibility-answer-input-short-description-or-label = Pasal akses, in `<answer>` nga naghihinang input subay awn maikut nga paglaral atawa label.

accessibility-short-description-contains-math = In maikut nga paglaral subay way komponin matematika biya' sin `<{ $component }>`. Sulata in matematika ha manga kabtangan.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] In { $colorName } way kaganap nga kontrast ha tiksti sin ū sin seksyon (mode maitum) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kagunahan in kabawgbugan { $threshold }:1).
       *[other] In { $colorName } way kaganap nga kontrast ha tiksti sin ū sin seksyon ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kagunahan in kabawgbugan { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = In `<circle>` nga dumaralan ha { $count } titik wala' pa nahinang bang in manga titik way timbang nga number.

circle-too-many-through-points = Di' mahinang in pag-itung sin sirkulo nga dumaralan ha labi dayn ha 3 titik.

circle-overprescribed-radius-center-points = Di' mahinang in pag-itung sin sirkulo bang siyabbut in radius, in tunga' iban in manga titik magsama.

circle-center-with-multiple-points = Di' mahinang in pag-itung sin sirkulo nga siyabbut in tunga' iban dumaralan ha labi dayn ha 1 titik.

circle-radius-too-small = Di' mahinang in pag-itung sin sirkulo: sabab in lawak sin duwa titik { $distance }, landu' asibi' in radius { $radius } siyabbut.

circle-radius-with-many-points = Di' mahinang in paghinang sin sirkulo nga dumaralan ha labi dayn ha duwa titik iban siyabbut in radius.

circle-invalid-center-or-through-points = Sala' in tunga' atawa in manga titik daralanan sin sirkulo.

circle-radius-center-with-multiple-points = Di' mahinang in pag-itung sin radius sin sirkulo nga siyabbut in tunga' iban dumaralan ha labi dayn ha 1 titik.

circle-change-radius-non-numerical = Di' mahinang in pagsalli' sin radius sin sirkulo nga dumaralan ha manga titik nga way timbang nga number

circle-radius-with-points-non-numerical = Di' mahinang in paghinang sin sirkulo nga dumaralan ha labi dayn ha hambuuk titik iban siyabbut in radius bang way timbang nga number.

circle-change-center-non-numerical = In pagsalli' sin tunga' sin sirkulo nga dumaralan ha manga titik nga way timbang nga number wala' pa nahinang.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
       *[other] Way kaganap nga dimensyon sin domain sin function. In domain awn { $intervals } interval sagawa' in function awn { $inputs ->
           *[other] { $inputs } input
        }.
    }

function-domain-invalid-format = Sala' in format sin domain sin function.

function-ignoring-non-numerical =
    { $type ->
        [maximum] In maximum sin function nga bukun number di' iyaagad.
        [minimum] In minimum sin function nga bukun number di' iyaagad.
        [extremum] In extremum sin function nga bukun number di' iyaagad.
        [point] In titik sin function nga bukun number di' iyaagad.
        [slope] In slope sin function nga bukun number di' iyaagad.
       *[other] In { $type } sin function nga bukun number di' iyaagad.
    }

function-ignoring-empty =
    { $type ->
        [maximum] In maximum sin function nga way laman di' iyaagad.
        [minimum] In minimum sin function nga way laman di' iyaagad.
        [extremum] In extremum sin function nga way laman di' iyaagad.
        [point] In titik sin function nga way laman di' iyaagad.
       *[other] In { $type } sin function nga way laman di' iyaagad.
    }

function-points-too-close = In function awn duwa titik nga landu' masuuk. Di' mahinang in paglaral sin function.

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] In manga iterate sin function mahinang sadja bang magsibu' in taud sin input iban in taud sin output. In function ini awn { $inputs } input iban { $outputs ->
           *[other] { $outputs } output
        }.
    }

## `<sequence>`

sequence-invalid-length = Sala' in haba' sin sequence.  Subay integer nga bukun negative.

sequence-invalid-step = Sala' in step sin sequence.  Subay number ha sequence nga ginis { $type }.

sequence-invalid-endpoint-number = Sala' in "{ $attribute }" sin sequence sin number.  Subay number.

sequence-invalid-endpoint-letters = Sala' in "{ $attribute }" sin sequence sin sulat.  Subay pagtipun sin manga sulat.

sequence-invalid-endpoint = Sala' in "{ $attribute }" sin sequence.

select-from-sequence-coprime-not-numbers = In coprime di' iyaagad sabab bukun manga number in pinī'

select-from-sequence-coprime-with-exclude-combinations = In coprime di' iyaagad sabab siyabbut in excludeCombinations

## Resolving a `target`

target-not-found = Sala' in target sin `<{ $source }>`: way kiyabaakan nga target.

target-state-variable-not-found = Sala' in target sin `<{ $source }>`: way kiyabaakan nga state variable nga in ngan "{ $property }" ha `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = In manga variable sin `<odeSystem>` subay ma'in dayn ha independent variable.

ode-system-duplicate-variable-names = Di' mahinang in paglaral sin manga function RHS sin ODE bang magsibu' in manga ngan sin dependent variable.

ode-system-rhs-function-error = Di' mahinang in paglaral sin function RHS sin ODE.  Awn kasala'an ha paghinang sin function mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Di' mahinang in paglaral sin anggulu ha pagtunga' sin { $count } linya

angle-invalid-through-point = Sala' in titik ha through sin `<angle>`

parabola-vertex-too-many-points = In parabola nga awn vertex iban dumaralan ha labi dayn ha 1 titik wala' pa nahinang.

parabola-too-many-points = In parabola nga dumaralan ha labi dayn ha 3 titik wala' pa nahinang.

intersection-too-many-items = In intersection ha labi dayn ha duwa nga hinang wala' pa nahinang

## Other math components

ionic-compound-not-two-ions = In ionic compound ha bukun duwa nga ion wala' pa nahinang.

ionic-compound-needs-cation-and-anion = In ionic compound nahinang sadja ha hambuuk cation iban hambuuk anion.

solve-equations-cannot-evaluate = Di' mahinang in pagsulbat sin ekwasyon sabab di' maitung in ekwasyon: { $equation }

math-operators-operand-number-required = Subay siyabbut in operandNumber bang kawaun in operand matematika.

eigen-decomposition-failed = Di' mahinang in pag-itung sin manga eigenvalue sin matriks

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
       *[other] `<matchesPattern>`: in parameter { $parameters } way ha lawm sin pattern, hangkan magsibu' sadja pa lu'ang.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: di' kahatihan in grid="{ $grid }". Subay none, medium, dense atawa duwa number nga positive nga tiyagilid sin hangka-lu'ang, biya' sin grid="1 0.5". Way grid hiyuwad.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    In `<{ $component }>` kagunahan hambuuk function nga awn { $expected ->
        [1] hambuuk output, amuna in slope y' ha katān titik, biya' sin `y - x`
       *[other] duwa output, amuna in vector ha katān titik, biya' sin `(y, -x)`
    }, sagawa' in function dīhil awn { $found ->
       *[other] { $found } output
    }. { $alternative ->
        [none] Way hiyuwad.
       *[other] In `<{ $alternative }>` amuna in komponin ha function yan. Way hiyuwad.
    }

field-function-attribute-ignored-with-child = In atribut `function` di' iyaagad sabab in function dīhil da isab ha lawm sin komponin; in ha lawm in ginamit. Dīhili in function ha hambuuk dalan sadja.

field-variables-ignored =
    `<{ $component }>`: in atribut `variables` amuna in nagngangan ha manga variable sin ekspresyon siyulat ha lawm sin komponin. { $reason ->
        [function-child] In function dī dīhil biya' anak `<function>`, amu in nagngangan sin manga variable niya, hangkan in `variables` di' iyaagad.
       *[no-expression] Way ekspresyon biya' hādtu dī, hangkan in `variables` di' iyaagad.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: in xLabelPosition="left" di' kasuppurtahan ha renderer prefigure; in dalan sin dapit-tuu in ginamit.

prefigure-y-label-position-unsupported = `<graph>`: in yLabelPosition="bottom" di' kasuppurtahan ha renderer prefigure; in dalan sin dapit-taas in ginamit.

prefigure-invalid-axis-bounds = `<graph>`: sala' in manga hangganan sin axis ha pagsalli' pa prefigure; in bbox hantang (-10,-10,10,10) in ginamit.

prefigure-invalid-width = `<graph>`: sala' in luag ha pagsalli' pa prefigure; in luag hantang sin diagram 425 in ginamit.

prefigure-invalid-aspect-ratio = `<graph>`: sala' in aspectRatio ha pagsalli' pa prefigure; in aspect ratio hantang 1 in ginamit.

prefigure-grid-spacing-too-fine = `<graph>`: landu' kikit in lawak sin grid ha manga hangganan sin axis; in grid di' hiyuwad ha renderer prefigure.

prefigure-annotations-not-rendered = `<graph>`: in manga annotation di' hiyuwad bang bukun renderer PreFigure in ginamit.

multiple-annotations-children = Mataud anak `<annotations>` in kiyabaakan ha `<graph>`; katān luwal sin kahuli-hulihan di' iyaagad.

## Referring to other components

copy-unrecognized-component-type = Di' mahinang in pag-extend atawa pagsalin sin ginis komponin nga di' kaingatan: { $type }.

copy-prop-not-found = Way kiyabaakan nga prop { $property } ha komponin nga ginis { $component }

collect-no-source = Way kiyabaakan nga source ha collect.

collect-invalid-component-type = Di' mahinang in pagtipun sin manga komponin nga ginis `<{ $component }>` sabab sala' in ginis komponin yan.

reference-index-unavailable = Di' mahinang in pagtuyu' pa indeks `{ $reference }`

## `<callAction>`

component-action-unavailable = Di' mahinang in pagtawag sin { $action } ha komponin `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Sala' in rupa sin data.  Di' magsibu' in haba' sin manga baris. Kiyabaakan ha componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = In data awn manga ngan sin kolum nga magsibu'.  Kiyabaakan ha componentIdx :{ $componentIdx }

data-frame-missing-column-name = In data kulang sin hangka-ngan sin kolum.  Kiyabaakan ha componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = In hambuuk award ha sambag ini masandal ha sambag naipasampay sin answer ini da isab, iban makarā ini pa hinang nga di' hiyuhulat.

answer-max-num-attempts-in-section-wide-check-work = In pagbutang sin `maxNumAttempts` ha `<answer>` nga ha lawm sin lulanan nga awn `sectionWideCheckWork` way kapūsan, sabab in taud sin pagsulay iyaayad sin lulanan. Butanga in `maxNumAttempts` ha lulanan.

nested-section-wide-check-work-max-num-attempts = In pagbutang sin `maxNumAttempts` ha lulanan nga awn `sectionWideCheckWork` iban ha lawm sin dugaing lulanan nga awn da isab `sectionWideCheckWork` way kapūsan, sabab in taud sin pagsulay iyaayad sin lulanan ha guwa'. Butanga in `maxNumAttempts` ha lulanan ha guwa'.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
       *[other] In atribut { $attributes } way kapūsan bang di' hibutang in symbolicEquality.
    }

answer-invalid-type = Sala' in ginis sin answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Sabab way ngan sin komponin `<{ $component }>`, di' mahinang in paggamit niya biya' atribut sin module

module-attribute-name-already-defined = In komponin `<{ $component } name="{ $name }">` di' mahinang gamitun biya' atribut sin module sabab in ginis komponin `<module>` awn na atribut nga "{ $name }".

conditional-content-condition-ignored = In atribut `condition` di' iyaagad ha komponin `<conditionalContent>` nga awn anak case atawa else.

slider-markers-type-mismatch = Di' magsibu' in ginis sin markers iban in ginis sin slider.

pretzel-problem-needs-statement-and-answer = Sala' in pretzel: in katān `<problem>` subay awn hambuuk `<statement>` iban hambuuk `<answer>`.

pretzel-circuit-first-problem-distractor = Sala' in pretzel: ha mode="circuit", in nakauna nga `<problem>` di' mahinang distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
       *[other] Sala' in timbang { $values } ha atribut `{ $attribute }`; di' iyaagad.
    }

attribute-must-be-references = Sala' in timbang `{ $value }` ha atribut `{ $attribute }`. In atribut subay hinangun dayn ha manga rupa nga magtagna' ha `$`.

math-input-invalid-function-names = <mathInput>: in manga ngan sin function nga sala' ha { $attribute } di' iyaagad: { $names }. In katān ngan subay awn duwa in kaputusan aksara ha bahagi' hikita' (manga sulat atawa gitik); makasunud in `|<mathspeak alternative>` bang kabayaan.

## Building components from the source

component-type-invalid = Sala' in ginis komponin: `<{ $componentType }>`

attribute-repeated = Di' mahinang in pag-ulit sin atribut { $attribute }.

attribute-invalid-for-component = Sala' in atribut "{ $attribute }" ha komponin nga ginis `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    In style definition { $styleNumber } way kaganap nga kontrast ha { $context ->
        [text-on-background] kulay sin tiksti kuntra ha kulay sin likuran
        [high-contrast] kulay nga mataas in kontrast kuntra ha kanvas
        [line] kulay sin linya kuntra ha kanvas
        [marker] kulay sin marker kuntra ha kanvas
       *[text-on-canvas] kulay sin tiksti kuntra ha kanvas
    }{ $mode ->
        [dark] { " (mode maitum)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kagunahan in kabawgbugan { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Minsan siyabbut sin style definition { $styleNumber } in manga kulay nga kaganap in kontrast ha mode masawa, in manga kulay sin mode maitum nga naguwa' dayn ha manga timbang yan way kaganap nga kontrast ha kulay sin tiksti kuntra ha kulay sin likuran ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kagunahan in kabawgbugan { $threshold }:1). { $suggestion ->
        [available] Ha supaya kaganap in kontrast ha mode maitum, dugangi in kontrast sin mode masawa (misalan, butanga in { $lightAttribute }="{ $lightColor }") atawa salli'a in kulay sin mode maitum (misalan, butanga in { $darkAttribute }="{ $darkColor }").
       *[none] Ha supaya kaganap in kontrast ha mode maitum, dugangi in kontrast sin mode masawa atawa salli'a in manga kulay naguwa' iban textColorDarkMode atawa backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Minsan siyabbut sin style definition { $styleNumber } in kulay sin tiksti nga kaganap in kontrast ha mode masawa, in kulay sin tiksti ha mode maitum nga naguwa' dayn ha timbang yan way kaganap nga kontrast kuntra ha kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kagunahan in kabawgbugan { $threshold }:1). { $suggestion ->
        [available] Ha supaya kaganap in kontrast ha mode maitum, dugangi in kontrast sin mode masawa (misalan, butanga in textColor="{ $lightColor }") atawa salli'a in kulay sin mode maitum (misalan, butanga in textColorDarkMode="{ $darkColor }").
       *[none] Ha supaya kaganap in kontrast ha mode maitum, dugangi in kontrast sin mode masawa atawa salli'a in kulay naguwa' iban textColorDarkMode.
    }

section-multiple-style-palettes = In hangka-seksyon makapī' hambuuk <stylePalette> sadja; in kahuli-hulihan in ginamit.

## Unique variants

variant-num-to-select-not-non-negative-integer = di' matantu in manga unique variant sin { $component } sabab in numToSelect bukun integer nga bukun negative.

variant-num-to-select-not-constant-number = di' matantu in manga unique variant sin { $component } sabab in numToSelect bukun number nga di' magsalli'.

variant-with-replacement-not-constant-boolean = di' matantu in manga unique variant sin { $component } sabab in withReplacement bukun boolean nga di' magsalli'.

variant-select-weight-disables-unique = In manga unique variant sin select napatay bang awn option nga siyabbut in selectWeight atawa selectForVariants

variant-coprime-undetermined = di' matantu in manga unique variant sin { $component } sabab di' matantu bang in coprime false sadja.

variant-attribute-not-constant = di' matantu in manga unique variant sin { $component } sabab in { $attribute } magsalli'.

variant-attribute-not-number = di' matantu in manga unique variant sin { $component } sabab in { $attribute } bukun number.

variant-attribute-wrong-type-for-sequence =
    di' matantu in manga unique variant sin { $component } nga ginis { $type } sabab in { $attribute } bukun { $expected ->
        [letters-combination] pagtipun sin manga sulat
        [math-expression] ekspresyon matematika nga tama'
        [integer] integer
       *[number] number
    }.

variant-length-not-integer = di' matantu in manga unique variant sin { $component } sabab in length bukun integer.

variant-sort-not-implemented = in manga unique variant sin { $component } nga awn sort wala' pa nahinang

variant-exclude-combinations-not-implemented = in manga unique variant sin { $component } nga awn excludeCombinations wala' pa nahinang

variant-math-exclude-not-implemented = in manga unique variant sin { $component } nga ginis math iban awn exclude wala' pa nahinang

variant-non-constant-exclude-not-implemented = in manga unique variant sin { $component } nga awn exclude nga magsalli' wala' pa nahinang

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: di' kasuppurtahan ha renderer prefigure sin graph; in panubu' liyabayan.

prefigure-descendant-invalid-geometry = { $subject }: in geometry way hangganan atawa kulang; in panubu' liyabayan.

prefigure-curve-label-omitted = { $subject }: in manga label di' kasuppurtahan ha manga elemento sin kurba nga siyalli'; in label wala' hiyuwad.

prefigure-curve-unsupported-definition-type = { $subject }: in ginis sin paglaral sin function sin kurba '{ $definitionType }' di' kasuppurtahan; in panubu' liyabayan.

prefigure-region-flip-functions-unsupported = { $subject }: in atribut flipFunctions ha regionBetweenCurves di' kasuppurtahan; in panubu' liyabayan.

prefigure-region-non-formula-child = { $subject }: in manga anak function nga ginis formula sadja in kasuppurtahan ha regionBetweenCurves; in panubu' liyabayan.

prefigure-label-position-unsupported =
    { $subject }: in labelPosition '{ $labelPosition }' di' kasuppurtahan ha { $labelKind ->
        [line-family] label sin manga linya
       *[point] label sin titik
    }; in pagtangkud hantang sin PreFigure in ginamit.

prefigure-fill-style-unsupported = { $subject }: in fill style '{ $fillStyle }' di' kasuppurtahan sin PreFigure; in fill nga buun in ginamit.

prefigure-line-style-unknown = { $subject }: in line style '{ $lineStyle }' di' kaingatan iban wala' liyaman ha output sin PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: in marker style '{ $markerStyle }' siyalli' pa style sin PreFigure nga 'diamond'.

prefigure-marker-style-unsupported = { $subject }: in marker style '{ $markerStyle }' di' kasuppurtahan sin PreFigure; in style hantang in ginamit.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: sala' in `ref`; di' matantu in target. In annotation wala' hiyuwad.

annotation-ref-multiple-targets = `<annotation>`: in `ref` tumuyu' pa mataud target; in nakauna nga target in ginamit.

annotation-ref-outside-graph = `<annotation>`: sala' in `ref`; in target ha guwa' sin graph nga naglulukup kaniya. In annotation wala' hiyuwad.

annotation-ref-unsupported-target = `<annotation>`: sala' in `ref`; in target bukun ladawan nga kasuppurtahan ha pagsalli' pa prefigure. In annotation wala' hiyuwad.

annotation-text-missing = `<annotation>`: kulang atawa way laman in `text`; tiksti nga way laman in giyuwa'.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Awn kiyabaakan nga pagsandal nga malibut.
       *[other] Awn kiyabaakan nga pagsandal nga malibut ha komponin `<{ $componentType }>`.
    }

reference-no-referent = Way kiyabaakan nga tinuyu' sin rupa: `{ $reference }`

reference-multiple-referents = Mataud tinuyu' in kiyabaakan sin rupa: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Sala' in format sin atribut { $attribute } sin `<{ $componentType }>`.

children-invalid = Sala' in manga anak sin `<{ $componentType }>`: awn kiyabaakan nga manga anak nga sala': { $children }

## Falling back to a default

attribute-value-invalid-using-default = Sala' in timbang `{ $value }` ha atribut `{ $attribute }`, in timbang `{ $default }` in ginamit

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Way kiyabaakan nga bersyon sin DoenetML { $version }.
       *[other] Way kiyabaakan nga bersyon sin DoenetML { $version }. In bersyon { $fallback } in ginamit
    }

## Reading the DoenetML

parse-invalid-doenetml = Sala' in DoenetML: { $content }

parse-tag-missing-close-tag = Sala' in DoenetML: In tag `{ $tag }` way tag hikatambul niya. Hiyuhulat in tag nga magtambul ha baran atawa in tag `</{ $tagName }>`.

parse-tag-error = Sala' in DoenetML: Awn kasala'an ha tag `<{ $tagName }>`

parse-attribute-missing-value = Sala' in DoenetML: In atribut `{ $attribute }` nga sala' biya' way timbang niya.

parse-attribute-invalid = Sala' in DoenetML: Sala' in atribut `{ $attribute }`

parse-attribute-value-invalid = Sala' in DoenetML: Sala' in timbang sin atribut `{ $value }`

parse-attribute-value-quote-mismatch = Sala' in DoenetML: Sala' in timbang sin atribut `{ $value }`. Di' magsibu' in manga tanda' quote. Biya' kulang kaw sin hangka `{ $quote }`

parse-open-tag-name-missing = Sala' in DoenetML: Awn kiyabaakan nga tag nga way ngan, biya' sin `<`

parse-tag-not-closed = Sala' in DoenetML: In tag `{ $tag }` wala' natambul (biya' kulang in hangka `>`).

parse-self-closing-tag-name-missing = Sala' in DoenetML: Awn kiyabaakan nga tag nga way ngan `<{ $content }>`

parse-self-closing-tag-not-closed = Sala' in DoenetML: In tag `{ $tag }` wala' natambul (biya' kulang in `/>`).

parse-tag-invalid-attributes = Sala' in DoenetML: Sala' in tag `{ $tag }`. Kaymu' sala' in manga atribut niya.

parse-close-tag-name-missing = Sala' in DoenetML: Awn kiyabaakan nga tag panambul nga way ngan, biya' sin `</`

parse-attribute-value-unquoted = In manga timbang sin atribut subay lukupan sin manga tanda' quote: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Sala' in DoenetML: Awn kiyabaakan nga tag panambul `{ $tag }`, sagawa' way tag pang-ukab nga magsibu' kaniya

parse-close-tag-mismatched = Sala' in DoenetML: Di' magsibu' in tag panambul. Hiyuhulat in `</{ $expected }>`. Kiyabaakan in `{ $found }`

parser-node-unconvertible = Di' mahinang in pagsalli' sin node { $node } pa node Dast.

## Names

name-attribute-invalid =
    Sala' in ngan sin atribut name='{ $name }'. { $reason ->
        [characters] In manga ngan makalaman sadja sin manga sulat, number, underscore atawa gitik.
       *[start] In manga ngan subay magtagna' ha sulat.
    }

component-name-invalid-start = Sala' in ngan sin komponin "{ $name }". In manga ngan subay magtagna' ha sulat.

## `<answer>` sugar

answer-video-watched-missing-video = In answer nga ginis videoWatched subay awn atribut video

answer-video-watched-video-not-reference = In answer nga ginis videoWatched subay awn atribut video nga rupa

answer-name-not-single-text = In atribut name sin answer subay awn hambuuk-buuk nga anak text

## Referencing another document

external-doenetml-recursion-limit = Di' makawa' in DoenetML dayn ha guwa' sabab landu' mataud in lapis sin rekursyon. Awn ka rupa nga malibut?

external-doenetml-unavailable = Di' makawa' in DoenetML dayn ha { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Sala' in DoenetML kiyawa' dayn ha { $attribute }="{ $uri }": di' magsibu' ha ginis komponin nga "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] In atribut `{ $from }` luma' na; gamita in `{ $to }` ganti.
       *[other] [deprecation] In atribut `{ $from }` ha `<{ $component }>` luma' na; gamita in `{ $to }` ganti.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] In atribut `{ $from }` luma' na iban di' iyaagad sabab siyabbut da isab in `{ $to }`.
       *[other] [deprecation] In atribut `{ $from }` ha `<{ $component }>` luma' na iban di' iyaagad sabab siyabbut da isab in `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] In atribut `{ $attribute }` ha `<{ $component }>` luma' na iban di' iyaagad.

deprecated-attribute-to-child = [deprecation] In atribut `{ $attribute }` ha `<{ $component }>` luma' na; gamita in anak `<{ $child }>` ganti.

deprecated-attribute-value-renamed = [deprecation] In timbang `{ $value }` sin atribut `{ $attribute }` ha `<{ $component }>` luma' na; gamita in `{ $to }` ganti.


## Language coverage

pluralize-english-only = In `<pluralize>` makapagmataud sadja sin Inglis, hangkan in tiksti niya di' siyalli' ha dukumintu nga siyulat ha { $locale }. Sulata da in rupa nga mataud, atawa butanga iban sin atribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = In elemento `<{ $tag }>` bukun elemento sin Doenet nga kaingatan.

schema-element-not-allowed-at-root = In elemento `<{ $tag }>` di' makajari ha jambatan sin dukumintu.

schema-element-not-allowed-inside = In elemento `<{ $tag }>` di' makajari ha lawm sin `<{ $parent }>`.

schema-attribute-unrecognized = In elemento `<{ $tag }>` way atribut nga in ngan `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] In atribut `{ $attribute }` sin elemento `<{ $tag }>` subay listahan nga in katān laman niya hambuuk dayn ha: { $allowed }
       *[other] In atribut `{ $attribute }` sin elemento `<{ $tag }>` subay hambuuk dayn ha: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Sala' in ngan sin varyant ha select.  In ngan sin varyant { $variantName } kiyabaakan ha { $numOptions } option sagawa' in taud hipī' { $numToSelect }.

select-variant-name-without-options = Awn manga varyant siyabbut ha select sagawa' way option siyabbut ha ngan sin varyant: { $variantName }.

select-variant-name-not-possible = In ngan sin varyant { $variantName } nga siyabbut ha select bukun ngan sin varyant nga mahinang.

select-too-few-options = Di' mahinang in pagpī' sin { $numToSelect } komponin dayn ha { $numOptions } sadja.

select-from-sequence-too-few-values = Di' mahinang in pagpī' sin { $numToSelect } timbang dayn ha sequence nga in haba' { $length }.

select-from-sequence-indices-count-mismatch = In taud sin manga indeks siyabbut ha select subay magsibu' ha taud hipī'

select-from-sequence-indices-not-integers = In katān indeks siyabbut ha select subay integer

select-from-sequence-index-excluded = In indeks sin selectfromsequence siyabbut kiyaluwa' na

select-from-sequence-indices-excluded-combination = In manga indeks sin selectfromsequence siyabbut amuna in pagtipun kiyaluwa'

select-from-sequence-coprime-not-positive-integers = Di' mahinang in pagpī' sin manga pagtipun coprime sabab bukun manga integer nga positive in pinī'.

select-from-sequence-coprime-common-factor = Di' mahinang in pagpī' sin manga number coprime. In katān timbang awn factor magsibu'. (In manga timbang sin "from" atawa "to" siyabbut subay coprime ha "step".)

select-from-sequence-coprime-single-number = Di' mahinang in pagpī' sin manga pagtipun coprime dayn ha hambuuk number nga bukun 1.

select-from-sequence-excluded-too-many-combinations = Labi 70% sin manga pagtipun in kiyaluwa' ha selectFromSequence

select-from-sequence-coprime-none-found = Way nakapī' sin manga number coprime. In katān timbang awn factor magsibu'.

select-from-sequence-too-few-unique-values = Di' mahinang in pagpī' sin { $numToSelect } timbang nga unique dayn ha sequence nga in haba' { $numPossibleValues }

select-prime-numbers-too-few-values = Di' mahinang in pagpī' sin { $numToSelect } timbang dayn ha listahan sin manga prime nga in haba' { $numValues }

select-prime-numbers-values-count-mismatch = In taud sin manga timbang siyabbut ha select subay magsibu' ha taud hipī'

select-prime-numbers-values-not-prime = In katān timbang siyabbut ha select sin prime number subay awn ha listahan sin manga prime

select-prime-numbers-values-excluded-combination = In manga timbang sin selectPrimeNumbers siyabbut amuna in pagtipun kiyaluwa'

select-prime-numbers-excluded-too-many-combinations = Labi 70% sin manga pagtipun in kiyaluwa' ha selectPrimeNumbers

select-random-combination-fluke = Sabab sin sukud nga landu' malayu' mahinang, way nakapī' sin pagtipun sin manga timbang random

select-random-value-fluke = Sabab sin sukud nga landu' malayu' mahinang, way nakapī' sin timbang random

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] In `<{ $component }>` ini di' hikita' sabab ha lawm ini sin matematika iban bukun `inline`. Dugangi in `inline` ha supaya mahinang drop-down list, amu in makasūd ha lawm sin ekspresyon.
        [expanded] In `<{ $component }>` ini di' hikita' sabab ha lawm ini sin matematika iban `expanded`. Tanggala in `expanded`; in kahun nga mataud baris di' makasūd ha lawm sin ekspresyon.
        [on-graph] In `<{ $component }>` ini di' hikita' sabab ha lawm ini sin matematika nga hiyuwad ha graph, amu in way lugal niya ha input.
       *[relative-width] In `<{ $component }>` ini di' hikita' sabab ha lawm ini sin matematika iban awn luag nga relative. Dīhili in luag ha manga unit nga absolute, biya' sin `px`.
    }
