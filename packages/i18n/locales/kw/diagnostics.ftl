# Cornish (Kernewek) diagnostics. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Latin, Standard Written Form (FSS/SWF)**, following Akademi
# Kernewek's «Gerlyver Kernewek»; **Kernewek Kemmyn** is the alternative
# orthography that was not used. Digits are Latin, as `src/intl.ts` pins for
# every locale, and every number inside this prose is written in Latin digits.
#
# **DoenetML identifiers are not translated.** `through`, `endpoint`,
# `midpointOffset`, `numDimensions`, `labelPosition`, `selectFromSequence` and
# every tag name are part of the language, not prose, and stay in English
# exactly as written, as do the `[deprecation]` marker and `WCAG AA`.
#
# **Cornish and borrowed.** The frame is the language's own: «ny» / «nyns»
# negating, «ny yllir» for the impersonal *cannot*, «res yw» for *must*, «rag»
# for *for*, «heb» for *without*, «mes» for *but*, «ha» / «hag» for *and*, «po»
# for *or*, «pan» for *when*, «drefen» for *because*, «y'n le na» for
# *instead*. «gwall», «gwarnyans», «kevys», «anwiw», «skonys», «menegys»,
# «hanow», «niver», «linen», «poynt» and «gwerth» are Cornish. The technical
# nouns are English in SWF spelling, which is the register a Cornish speaker
# meets them in: «komponent», «parameter», «matriks», «sekwens», «variant»,
# «diagram», «renderer», «format», «indeks», «diagnostig». «gnas» is used for
# *attribute* and «elven» for *element* throughout — in this file and in
# `editor.ftl`, which are the only two where English says either word.
#
# **Counts.** Cornish has CLDR rules of its own with all six categories —
# `zero` (0), `one` (1), `two` (n mod 100 = 2, 22, 42, 62, 82), `few` (3, 23,
# 43, 63, 83), `many` (21, 41, 61, 81, 101 — n mod 100 = 1 but not 1 itself)
# and `other`. `chrome.ftl`'s header sets that out in full.
#
# Most of English's count selects here do **not** fork in Cornish, and it is
# worth saying why rather than leaving it to look like laziness. Where the
# message prints the numeral («{ $intervals } interval»), a Cornish noun after
# a numeral stays **singular** and only its initial consonant moves — and
# «interval», «entrans» and «askorrans» all begin with a vowel, which has no
# lenited or spirantized form. Where the message prints no numeral at all, the
# only distinction left is singular against plural, and that is a two-way
# split: `one` against everything else. So `matches-pattern-parameter-not-in-pattern`,
# `answer-attributes-need-symbolic-equality` and `attribute-invalid-values`
# fork `[one]` / `*[other]`, and the rest are written once.
#
# `field-function-wrong-num-outputs`'s `$expected` is not a plural at all but a
# two-way choice between one output and two; 2 selects `two` in Cornish, which
# falls through to `*[other]`, so the branch pair still lands correctly.
#
# **Where that rule is not yet carried through, and a speaker should decide.**
# Four messages print a numeral in front of a noun whose initial *does* move —
# `circle-through-points-non-numerical` («poynt»), `select-too-few-options`
# («komponent»), `select-from-sequence-too-few-values` and
# `select-from-sequence-too-few-unique-values` («gwerth») — and are written
# once all the same, where `chrome.ftl`'s `attempts-remaining` forks «prov» →
# «brov» → «frov» on exactly the same mechanism. `content.ftl`'s
# `noun-regular-polygon` tail («tenewen») is the fifth. Either those five want
# the fork or `attempts-remaining` does not, and which way round is a question
# about Cornish rather than about Fluent.
#
# **Weakest first.** «diskommendys» for *deprecated*, «domayn» for *domain*,
# «amkan» for *target*, «kevarwodh» for *reference* and «fleghes» for XML
# *children* are the words to check first; then the schema and parser
# sections, which carry the longest sentences and the least dictionary
# support.

## `<lineSegment>`

# The list is a placeable and no numeral is printed; Cornish «yw» serves a
# plural subject as well as a singular one, so the two English branches
# collapse into one form.
line-segment-attributes-ignored-with-endpoints = { $attributes } yw skonys pan vo dew benn menegys
line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } yw skonys pan vo penn ha kresspoynt aga dew menegys
line-segment-midpoint-offset-without-midpoint = nyns eus effeyth vyth dhe midpointOffset heb kresspoynt

## `<line>`

line-points-undetermined-dimensions = Linen dre boyntys a vusurow anervirys.
line-points-too-few-dimensions = Res yw dhe'n linen mos dre boyntys a dhew vusur dhe'n lyha.
line-points-depend-on-variables = Yma an linen ow mos dre boyntys a dhepend war chanjadowyow: { $variables }.
line-equation-invalid-format = Format anwiw rag equasyon linen y'n chanjadowyow { $variable1 } ha { $variable2 }.

## `<ray>`

ray-overprescribed-through = Yma an dewynn ervirys gans through, endpoint ha direction. Ow skonya an through menegys.
ray-dimension-mismatch = Nyns yw numDimensions ow tesedha y'n dewynn.

## `<vector>`

vector-overprescribed-head = Yma an vektor ervirys gans head, tail ha displacement. Ow skonya an head menegys.
vector-dimension-mismatch = Nyns yw numDimensions ow tesedha y'n vektor.

## Attracting and constraining

attract-to-without-nearest-point = Ny yllir tenna dhe `<{ $component }>` drefen nag eus dhodho chanjadow stat nearestPoint.
constrain-to-without-nearest-point = Ny yllir strotha dhe `<{ $component }>` drefen nag eus dhodho chanjadow stat nearestPoint.
constrain-to-interior-without-nearest-point = Ny yllir strotha dhe berveth `<{ $component }>` drefen nag eus dhodho chanjadow stat nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = skonys yw labelPosition rag choiceInput nag yw inline

## Ordering children by index

choice-input-indices-count-mismatch = Ow skonya an indeksow menegys rag choiceInput drefen nag usi niver an indeksow ow tesedha orth niver an fleghes dewis.
pretzel-indices-count-mismatch = Ow skonya an indeksow menegys rag problem drefen nag usi niver an indeksow ow tesedha orth niver an fleghes problem.
shuffle-indices-count-mismatch = Ow skonya an indeksow menegys rag shuffle drefen nag usi niver an indeksow ow tesedha orth niver an komponentys.
indices-ignored-out-of-range = Ow skonya an indeksow menegys rag { $component } drefen bos indeksow yn mes a'n rann.
pretzel-indices-repeated = Ow skonya an indeksow menegys rag pretzel drefen bos indeksow dasleverys.
pretzel-circuit-first-index = Ow skonya an indeksow menegys rag pretzel yn mod circuit drefen bos res dhe'n kynsa indeks bos 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Rag may hwrello `<{ $component }>` oberi gans fleghes lyngherenn, res yw menegi gnas `type`.
invalid-type-defaulting-to-math = Eghen anwiw { $type } rag an komponent { $component }. Res yw dhodho bos onan a math, text, number po boolean. Ow tewis math avel defowt.
string-not-valid-component-to-arrange = Nyns yw an lyngherenn "{ $value }" komponent gwiw dhe { $component }. Ow skonya.

## Types and variables

invalid-type-defaulting-to-number = Eghen anwiw { $type }, ow settya an eghen dhe number.
invalid-variable-value = Gwerth anwiw a janjadow: `{ $value }`

## Variants

variant-index-must-be-number = Res yw dhe'n indeks variant { $index } bos niver
variant-index-must-be-integer = Res yw dhe'n indeks variant { $index } bos niver kowal

## `<sideBySide>`

side-by-side-absolute-widths = Nyns yw `<{ $component }>` gwrys rag musurow absolyt. Ow settya an lesyow dhe vos relatif.
side-by-side-absolute-margins = Nyns yw `<{ $component }>` gwrys rag musurow absolyt. Ow settya an emlow dhe vos relatif.
side-by-side-no-block-child = `<{ $component }>` anwiw: res yw dhodho kavoes unn flogh blok dhe'n lyha.

## `<label>`

label-for-ignored-on-graphical = Skonys yw an wnas `for` war `<label>` grafek.
label-for-must-resolve-to-one = Res yw dhe'n wnas `for` war `<label>` diskudha yn poran unn komponent.
label-for-unresolved = Ny allas an wnas `for` war `<label>` bos diskudhys yn komponent.
label-for-answer-with-authored-inputs = Yma an wnas `for` war `<label>` ow kevarwodha `<answer>` gans entransow skrifys gans an awtour; kevarwodh an entrans y honan.
label-for-answer-without-input = Yma an wnas `for` war `<label>` ow kevarwodha `<answer>` heb entrans dhe labla.
label-for-must-reference-input-or-answer = Res yw dhe'n wnas `for` war `<label>` kevarwodha entrans po gorthyp.

## Accessibility

accessibility-short-description-or-decorative = Rag hedhadewder, res yw dhe `<{ $component }>` kavoes deskrifans berr po bos menegys avel afinans.
accessibility-video-short-description = Rag hedhadewder, res yw dhe `<video>` kavoes deskrifans berr.
accessibility-input-short-description-or-label = Rag hedhadewder, res yw dhe `<{ $component }>` kavoes deskrifans berr po label.
accessibility-answer-input-short-description-or-label = Rag hedhadewder, res yw dhe `<answer>` a wra entrans kavoes deskrifans berr po label.
accessibility-short-description-contains-math = Ny wra deskrifansow berr synsi komponentys matematek kepar ha `<{ $component }>`. Skrif oll an vatematek gans geryow.
accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Nyns eus kontrast lowr dhe { $colorName } rag tekst penn an trogh (mod tewl) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; res yw { $threshold }:1 dhe'n lyha).
       *[other] Nyns eus kontrast lowr dhe { $colorName } rag tekst penn an trogh ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; res yw { $threshold }:1 dhe'n lyha).
    }

## `<circle>`

circle-through-points-non-numerical = Ny veu gwrys `<circle>` dre { $count } poynt y'n kas na's teves an poyntys gwerthow niverek.
circle-too-many-through-points = Ny yllir amontya kylgh dre voy es 3 poynt.
circle-overprescribed-radius-center-points = Ny yllir amontya kylgh gans radius, kres ha poyntys menegys.
circle-center-with-multiple-points = Ny yllir amontya kylgh gans kres menegys dre voy es 1 poynt.
circle-radius-too-small = Ny yllir amontya kylgh: a-ban yw an pellder ynter an dhew boynt { $distance }, re vyghan yw an radius menegys { $radius }.
circle-radius-with-many-points = Ny yllir gul kylgh dre voy es dew boynt gans radius menegys.
circle-invalid-center-or-through-points = Kres po poyntys through anwiw a'n kylgh.
circle-radius-center-with-multiple-points = Ny yllir amontya radius kylgh gans kres menegys dre voy es 1 poynt.
circle-change-radius-non-numerical = Ny yllir chanjya radius kylgh gans poyntys through nag yns niverek
circle-radius-with-points-non-numerical = Ny yllir gul kylgh dre voy es unn poynt gans radius menegys pan nag eus gwerthow niverek.
circle-change-center-non-numerical = Ny veu gwrys chanjya kres kylgh dre boyntys gans gwerthow nag yns niverek.

## `<function>`

# «interval», «entrans» and «askorrans» all begin with a vowel and a Cornish
# noun after a numeral stays singular, so neither count forks.
function-domain-insufficient-dimensions = Nyns eus musurow lowr rag domayn an fonksyon. Yma { $intervals } interval y'n domayn mes yma { $inputs } entrans dhe'n fonksyon.
function-domain-invalid-format = Format anwiw rag domayn an fonksyon.
function-ignoring-non-numerical =
    { $type ->
        [maximum] Ow skonya an moyha nag yw niverek a'n fonksyon.
        [minimum] Ow skonya an lyha nag yw niverek a'n fonksyon.
        [extremum] Ow skonya an pennpoynt nag yw niverek a'n fonksyon.
        [point] Ow skonya an poynt nag yw niverek a'n fonksyon.
        [slope] Ow skonya an leder nag yw niverek a'n fonksyon.
       *[other] Ow skonya an { $type } nag yw niverek a'n fonksyon.
    }
function-ignoring-empty =
    { $type ->
        [maximum] Ow skonya an moyha gwag a'n fonksyon.
        [minimum] Ow skonya an lyha gwag a'n fonksyon.
        [extremum] Ow skonya an pennpoynt gwag a'n fonksyon.
        [point] Ow skonya an poynt gwag a'n fonksyon.
       *[other] Ow skonya an { $type } gwag a'n fonksyon.
    }
function-points-too-close = Yma y'n fonksyon dhew boynt re ogas an eyl dh'y gila. Ny yllir styrya an fonksyon.
function-iterates-input-output-mismatch = Ny yll iteransow fonksyon bos marnas mars yw niver an entransow kepar ha niver an askorransow. Yma { $inputs } entrans ha { $outputs } askorrans dhe'n fonksyon ma.

## `<sequence>`

sequence-invalid-length = Hys anwiw a'n sekwens. Res yw dhodho bos niver kowal nag yw negedhek.
sequence-invalid-step = Kamm anwiw a'n sekwens. Res yw dhodho bos niver rag sekwens a'n eghen { $type }.
sequence-invalid-endpoint-number = "{ $attribute }" anwiw a sekwens niverow. Res yw dhodho bos niver.
sequence-invalid-endpoint-letters = "{ $attribute }" anwiw a sekwens lytherennow. Res yw dhodho bos kesunyans lytherennow.
sequence-invalid-endpoint = "{ $attribute }" anwiw a'n sekwens.
select-from-sequence-coprime-not-numbers = skonys yw coprime drefen nag usi niverow ow pos dewisys
select-from-sequence-coprime-with-exclude-combinations = skonys yw coprime drefen bos excludeCombinations menegys

## Resolving a `target`

target-not-found = Amkan anwiw rag `<{ $source }>`: ny yllir kavoes an amkan.
target-state-variable-not-found = Amkan anwiw rag `<{ $source }>`: ny yllir kavoes chanjadow stat henwys "{ $property }" war `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Res yw dhe janjadowyow `<odeSystem>` bos dihaval dhe'n chanjadow anserghek.
ode-system-duplicate-variable-names = Ny yllir styrya fonksyonow RHS ODE gans henwyn chanjadow dasleverys.
ode-system-rhs-function-error = Ny yllir styrya fonksyon RHS ODE. Gwall ow kul an fonksyon mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ny yllir styrya elin ynter { $count } linen
angle-invalid-through-point = Poynt anwiw yn through a `<angle>`
parabola-vertex-too-many-points = Ny veu gwrys parabola gans pennpoynt dre voy es 1 poynt.
parabola-too-many-points = Ny veu gwrys parabola dre voy es 3 poynt.
intersection-too-many-items = Ny veu gwrys kroesva rag moy es dew dra

## Other math components

ionic-compound-not-two-ions = Ny veu gwrys kemyskyans ionek rag travyth marnas dew ion.
ionic-compound-needs-cation-and-anion = Ny veu gwrys kemyskyans ionek marnas rag unn kation hag unn anion.
solve-equations-cannot-evaluate = Ny yllir digelmi an equasyon drefen na allas an equasyon bos amontys: { $equation }
math-operators-operand-number-required = Res yw menegi operandNumber pan vo operand matematek tennys yn-mes.
eigen-decomposition-failed = Ny allas eigenwerthow an matriks bos amontys

## `<matchesPattern>`

# No numeral is printed, so the only distinction is singular against plural —
# a two-way split, `one` against everything else.
matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: nyns usi an parameter { $parameters } y'n patron, ytho ev a wra desedha orth gwag pup-prys.
       *[other] `<matchesPattern>`: nyns usi an parametrow { $parameters } y'n patron, ytho i a wra desedha orth gwag pup-prys.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ny yllir styrya grid="{ $grid }". Res yw dhodho bos none, medium, dense, po dew niver posedhek dibarthys gans spas, kepar ha grid="1 0.5". Nyns yw grid vyth tennys.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    Yma edhom dhe `<{ $component }>` a fonksyon gans { $expected ->
        [one] unn askorrans, an leder y' orth pub poynt, kepar ha `y - x`
       *[other] dew askorrans, an vektor orth pub poynt, kepar ha `(y, -x)`
    }, mes yma { $found } askorrans dhe'n fonksyon res dhodho. { $alternative ->
        [none] Nyns yw travyth tennys.
       *[other] `<{ $alternative }>` yw an komponent rag an fonksyon na. Nyns yw travyth tennys.
    }
field-function-attribute-ignored-with-child = Skonys yw an wnas `function` drefen bos an fonksyon res a-berth y'n komponent ynwedh; an huni a-berth yw devnydhys. Ro an fonksyon yn unn fordh yn unnsel.
field-variables-ignored =
    `<{ $component }>`: yma an wnas `variables` ow henwel chanjadowyow lavarow skrifys yn ewn a-berth y'n komponent. { $reason ->
        [function-child] Res yw an fonksyon omma avel flogh `<function>`, hag ev a henow y janjadowyow y honan, ytho skonys yw `variables`.
       *[no-expression] Nyns yw lavarow a'n par na res omma, ytho skonys yw `variables`.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: nyns yw xLabelPosition="left" skoodhys y'n renderer prefigure; ow tevnydhya fatel a'n tu dyghow.
prefigure-y-label-position-unsupported = `<graph>`: nyns yw yLabelPosition="bottom" skoodhys y'n renderer prefigure; ow tevnydhya fatel an gwartha.
prefigure-invalid-axis-bounds = `<graph>`: emlow ahel anwiw rag an treylyans prefigure; ow tevnydhya an bbox defowt (-10,-10,10,10).
prefigure-invalid-width = `<graph>`: les anwiw rag an treylyans prefigure; ow tevnydhya les diagram defowt 425.
prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio anwiw rag an treylyans prefigure; ow tevnydhya an rannans golok defowt 1.
prefigure-grid-spacing-too-fine = `<graph>`: re fin yw spasyans an rastel rag emlow an ahel; gesys yw an rastel yn-mes y'n renderer prefigure.
prefigure-annotations-not-rendered = `<graph>`: ny vydh notennow tennys pan na vo an renderer PreFigure devnydhys.
multiple-annotations-children = Kevys lies flogh `<annotations>` yn `<graph>`; skonys yw pubonan marnas an diwettha.

## Referring to other components

copy-unrecognized-component-type = Ny yllir ystynna po dasskrifa eghen komponent anaswonys: { $type }.
copy-prop-not-found = Ny allas an prop { $property } bos kevys war komponent a'n eghen { $component }
collect-no-source = Ny veu kevys pennfenten vyth rag collect.
collect-invalid-component-type = Ny yllir kuntell komponentys a'n eghen `<{ $component }>` drefen bos eghen komponent anwiw.
reference-index-unavailable = Ny yllir kevarwodha an indeks `{ $reference }`

## `<callAction>`

component-action-unavailable = Ny yllir gelwel { $action } war an komponent `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Yma furv anwiw dhe'n data. Nyns yw hysyow an resow kesson. Kevys yn componentIdx :{ $componentIdx }
data-frame-duplicate-column-names = Yma henwyn koloven dasleverys y'n data. Kevys yn componentIdx :{ $componentIdx }
data-frame-missing-column-name = Yma hanow koloven ow fyllel y'n data. Kevys yn componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Yma award rag an gorthyp ma selys war worthyp danvenys an tag gorthyp y honan, hag y fydh fatel anwaytys yn sywyans.
answer-max-num-attempts-in-section-wide-check-work = Nyns eus effeyth vyth dhe settya `maxNumAttempts` war `<answer>` a-berth yn kuntellyans gans `sectionWideCheckWork`, drefen bos niver an provow rewlys gans an kuntellyans. Setya `maxNumAttempts` war an kuntellyans y'n le na.
nested-section-wide-check-work-max-num-attempts = Nyns eus effeyth vyth dhe settya `maxNumAttempts` war guntellyans gans `sectionWideCheckWork` usi a-berth yn kuntellyans arall gans `sectionWideCheckWork`, drefen bos niver an provow rewlys gans an kuntellyans a-ves. Setya `maxNumAttempts` war an kuntellyans a-ves y'n le na.
# No numeral is printed, so this is the singular/plural split: `one` against
# everything else. «gnas» is feminine and lenites after «an».
answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Ny'n jevydh an wnas { $attributes } effeyth vyth heb symbolicEquality settys.
       *[other] Ny's tevydh an gnasow { $attributes } effeyth vyth heb symbolicEquality settys.
    }
answer-invalid-type = Eghen anwiw rag an gorthyp: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = A-ban nag eus hanow dhe'n komponent `<{ $component }>`, ny yll bos devnydhys rag gnas module
module-attribute-name-already-defined = Ny yll an komponent `<{ $component } name="{ $name }">` bos devnydhys avel gnas rag module drefen bos gnas "{ $name }" styrys seulabrys gans an eghen komponent `<module>`.
conditional-content-condition-ignored = Skonys yw an wnas `condition` war komponent `<conditionalContent>` gans fleghes case po else.
slider-markers-type-mismatch = Nyns usi eghen an merkyow ow tesedha orth eghen an slider.
pretzel-problem-needs-statement-and-answer = Pretzel anwiw: res yw dhe bub `<problem>` synsi unn `<statement>` hag unn `<answer>`.
pretzel-circuit-first-problem-distractor = Pretzel anwiw: yn mode="circuit", ny yll an kynsa `<problem>` bos distractor.

## Attribute values

# The same singular/plural split, on «gwerth».
attribute-invalid-values =
    { $valuesCount ->
        [one] Gwerth anwiw { $values } rag an wnas `{ $attribute }`; ow skonya.
       *[other] Gwerthow anwiw { $values } rag an wnas `{ $attribute }`; ow skonya.
    }
attribute-must-be-references = Gwerth anwiw `{ $value }` rag an wnas `{ $attribute }`. Res yw dhe'n wnas bos gwrys a gevarwodhow ow talleth gans `$`.
math-input-invalid-function-names = <mathInput>: skonys veu henwyn fonksyon anwiw yn { $attribute }: { $names }. Res yw dhe rann diskwedhes pub hanow bos 2 lytheren dhe'n lyha (lytherennow po tresow); y hyll suffiks `|<mathspeak alternative>` sywya.

## Building components from the source

component-type-invalid = Eghen komponent anwiw: `<{ $componentType }>`
attribute-repeated = Ny yllir daslavarel an wnas { $attribute }.
attribute-invalid-for-component = Gnas anwiw "{ $attribute }" rag komponent a'n eghen `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Nyns eus kontrast lowr dhe styryans gis { $styleNumber } rag { $context ->
        [text-on-background] liw an tekst erbynn liw an keyndir
        [high-contrast] an liw ughel-kontrast erbynn an kanvas
        [line] liw an linen erbynn an kanvas
        [marker] liw an merkyer erbynn an kanvas
       *[text-on-canvas] liw an tekst erbynn an kanvas
    }{ $mode ->
        [dark] { " (mod tewl)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; res yw { $threshold }:1 dhe'n lyha).
style-definition-dark-mode-text-background-contrast =
    Kyn hwrug styryans gis { $styleNumber } menegi liwyow gans kontrast lowr rag an mod golow, nyns eus kontrast lowr dhe liwyow an mod tewl devedhys anedha rag liw an tekst erbynn liw an keyndir ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; res yw { $threshold }:1 dhe'n lyha). { $suggestion ->
        [available] Rag surhe kontrast lowr y'n mod tewl, po kressya kontrast an mod golow (rag ensampel, settya { $lightAttribute }="{ $lightColor }") po treusi liw an mod tewl (rag ensampel, settya { $darkAttribute }="{ $darkColor }").
       *[none] Rag surhe kontrast lowr y'n mod tewl, kressya kontrast an mod golow po treusi an liwyow devedhys gans textColorDarkMode ha/po backgroundColorDarkMode.
    }
style-definition-dark-mode-text-canvas-contrast =
    Kyn hwrug styryans gis { $styleNumber } menegi liw tekst gans kontrast lowr rag an mod golow, nyns eus kontrast lowr dhe liw tekst an mod tewl devedhys anodho erbynn an kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; res yw { $threshold }:1 dhe'n lyha). { $suggestion ->
        [available] Rag surhe kontrast lowr y'n mod tewl, po kressya kontrast an mod golow (rag ensampel, settya textColor="{ $lightColor }") po treusi liw an mod tewl (rag ensampel, settya textColorDarkMode="{ $darkColor }").
       *[none] Rag surhe kontrast lowr y'n mod tewl, kressya kontrast an mod golow po treusi an liw devedhys gans textColorDarkMode.
    }
section-multiple-style-palettes = Ny yll trogh dewis marnas unn <stylePalette>; ow tevnydhya an diwettha.

## Unique variants

variant-num-to-select-not-non-negative-integer = ny yllir ervira variantys unnik a { $component } drefen nag yw numToSelect niver kowal nag yw negedhek.
variant-num-to-select-not-constant-number = ny yllir ervira variantys unnik a { $component } drefen nag yw numToSelect niver fast.
variant-with-replacement-not-constant-boolean = ny yllir ervira variantys unnik a { $component } drefen nag yw withReplacement boolean fast.
variant-select-weight-disables-unique = Difudhys yw variantys unnik rag select mars eus dewis gans selectWeight po selectForVariants menegys
variant-coprime-undetermined = ny yllir ervira variantys unnik a { $component } drefen na yllir ervira bos coprime fals pup-prys.
variant-attribute-not-constant = ny yllir ervira variantys unnik a { $component } drefen nag yw { $attribute } fast.
variant-attribute-not-number = ny yllir ervira variantys unnik a { $component } drefen nag yw { $attribute } niver.
variant-attribute-wrong-type-for-sequence =
    ny yllir ervira variantys unnik a { $component } a'n eghen { $type } drefen nag yw { $attribute } { $expected ->
        [letters-combination] kesunyans lytherennow
        [math-expression] lavarow matematek gwiw
        [integer] niver kowal
       *[number] niver
    }.
variant-length-not-integer = ny yllir ervira variantys unnik a { $component } drefen nag yw length niver kowal.
variant-sort-not-implemented = ny veu gwrys variantys unnik a { $component } gans sort
variant-exclude-combinations-not-implemented = ny veu gwrys variantys unnik a { $component } gans excludeCombinations
variant-math-exclude-not-implemented = ny veu gwrys variantys unnik a { $component } a'n eghen math gans exclude
variant-non-constant-exclude-not-implemented = ny veu gwrys variantys unnik a { $component } gans exclude nag yw fast

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: nyns yw skoodhys y'n renderer prefigure graf; gesys yw an diyskynnyas.
prefigure-descendant-invalid-geometry = { $subject }: mesuryans anorfen po anklowal; gesys yw an diyskynnyas.
prefigure-curve-label-omitted = { $subject }: nyns yw lablow skoodhys war elvennow krommen treylys; gesys yw an label.
prefigure-curve-unsupported-definition-type = { $subject }: eghen styryans krommen anskoodhys '{ $definitionType }'; gesys yw an diyskynnyas.
prefigure-region-flip-functions-unsupported = { $subject }: gnas flipFunctions anskoodhys war regionBetweenCurves; gesys yw an diyskynnyas.
prefigure-region-non-formula-child = { $subject }: nyns yw skoodhys marnas fleghes fonksyon a'n eghen formula war regionBetweenCurves; gesys yw an diyskynnyas.
prefigure-label-position-unsupported =
    { $subject }: labelPosition anskoodhys '{ $labelPosition }' rag { $labelKind ->
        [line-family] label a'n teylu linen
       *[point] label poynt
    }; devnydhys yw alinyans defowt PreFigure.
prefigure-fill-style-unsupported = { $subject }: nyns yw gis lenwel '{ $fillStyle }' skoodhys gans PreFigure; ow kildenna dhe lenwel kompes.
prefigure-line-style-unknown = { $subject }: gis linen anaswonys '{ $lineStyle }' gesys yn-mes a'n askorrans PreFigure.
prefigure-marker-style-mapped-to-diamond = { $subject }: gis merkyer '{ $markerStyle }' treylys dhe'n gis PreFigure 'diamond'.
prefigure-marker-style-unsupported = { $subject }: nyns yw gis merkyer '{ $markerStyle }' skoodhys gans PreFigure; devnydhys yw an gis defowt.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` anwiw; ny yllir diskudha an amkan. Gesys yw an noten.
annotation-ref-multiple-targets = `<annotation>`: diskudhys veu `ref` yn lies amkan; ow tevnydhya an kynsa amkan.
annotation-ref-outside-graph = `<annotation>`: `ref` anwiw; yma an amkan yn-mes a'n graf a'n syns. Gesys yw an noten.
annotation-ref-unsupported-target = `<annotation>`: `ref` anwiw; nyns yw an amkan tra grafek skoodhys y'n treylyans prefigure. Gesys yw an noten.
annotation-text-missing = `<annotation>`: `text` ow fyllel po gwag; ow tanvon tekst gwag.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Kevys kylghyek yn kesserghogeth.
       *[other] Kevys kylghyek yn kesserghogeth ow perthi dhe'n komponent `<{ $componentType }>`.
    }
reference-no-referent = Ny veu kevys kevarwodhyas vyth rag an kevarwodh: `{ $reference }`
reference-multiple-referents = Kevys lies kevarwodhyas rag an kevarwodh: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format anwiw rag an wnas { $attribute } a `<{ $componentType }>`.
children-invalid = Fleghes anwiw rag `<{ $componentType }>`: kevys fleghes anwiw: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Gwerth anwiw `{ $value }` rag an wnas `{ $attribute }`, ow tevnydhya an gwerth `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Ny veu kevys an versyon DoenetML { $version }.
       *[other] Ny veu kevys an versyon DoenetML { $version }. Ow kildenna dhe'n versyon { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML anwiw: { $content }
parse-tag-missing-close-tag = DoenetML anwiw: Nyns eus tag degea dhe'n tag `{ $tag }`. Gwaytys veu tag omdhegeans po tag `</{ $tagName }>`.
parse-tag-error = DoenetML anwiw: Gwall y'n tag `<{ $tagName }>`
parse-attribute-missing-value = DoenetML anwiw: Yma an wnas anwiw `{ $attribute }`, dell hevel, ow fyllel a werth.
parse-attribute-invalid = DoenetML anwiw: Gnas anwiw `{ $attribute }`
parse-attribute-value-invalid = DoenetML anwiw: Gwerth gnas anwiw `{ $value }`
parse-attribute-value-quote-mismatch = DoenetML anwiw: Gwerth gnas anwiw `{ $value }`. Nyns usi an merkyow devynn ow tesedha. Dell hevel yma `{ $quote }` ow fyllel dhis
parse-open-tag-name-missing = DoenetML anwiw: Kevys tag heb hanow tag, rag ensampel `<`
parse-tag-not-closed = DoenetML anwiw: Ny veu an tag `{ $tag }` degeys (dell hevel yma `>` ow fyllel).
parse-self-closing-tag-name-missing = DoenetML anwiw: Kevys tag heb hanow tag `<{ $content }>`
parse-self-closing-tag-not-closed = DoenetML anwiw: Ny veu an tag `{ $tag }` degeys (dell hevel yma `/>` ow fyllel).
parse-tag-invalid-attributes = DoenetML anwiw: Nyns yw an tag `{ $tag }` gwiw. Martesen yma gnasow kamm dhodho.
parse-close-tag-name-missing = DoenetML anwiw: Kevys tag degea heb hanow tag, rag ensampel `</`
parse-attribute-value-unquoted = Res yw dhe werthow gnas bos maylys yn merkyow devynn: `{ $attribute }="{ $value }"`
parse-close-tag-without-open-tag = DoenetML anwiw: Kevys an tag degea `{ $tag }`, mes nyns eus tag igeri a dhesedh
parse-close-tag-mismatched = DoenetML anwiw: Tag degea nag usi ow tesedha. Gwaytys veu `</{ $expected }>`. Kevys `{ $found }`
parser-node-unconvertible = Ny allas an nod { $node } bos treylys dhe nod Dast.

## Names

name-attribute-invalid =
    Gnas anwiw name='{ $name }'. { $reason ->
        [characters] Ny yll henwyn synsi marnas lytherennow, niverow, iselinennow po tresow.
       *[start] Res yw dhe henwyn dalleth gans lytheren.
    }
component-name-invalid-start = Hanow komponent anwiw "{ $name }". Res yw dhe henwyn dalleth gans lytheren.

## `<answer>` sugar

answer-video-watched-missing-video = Res yw dhe worthyp a'n eghen videoWatched kavoes gnas video
answer-video-watched-video-not-reference = Res yw dhe worthyp a'n eghen videoWatched kavoes gnas video usi ow pos kevarwodh
answer-name-not-single-text = Res yw dhe wnas hanow an gorthyp kavoes unn flogh tekst

## Referencing another document

external-doenetml-recursion-limit = Ny yllir kavoes DoenetML a-ves drefen bos re a nivelow dasdroans. Eus kevarwodh kylghyek?
external-doenetml-unavailable = Ny yllir kavoes DoenetML dhiworth { $attribute }="{ $uri }"
external-doenetml-type-mismatch = DoenetML anwiw kevys dhiworth { $attribute }="{ $uri }": ny wrug desedha orth an eghen komponent "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Diskommendys yw an wnas `{ $from }`; devnydh `{ $to }` y'n le na.
       *[other] [deprecation] Diskommendys yw an wnas `{ $from }` war `<{ $component }>`; devnydh `{ $to }` y'n le na.
    }
deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Diskommendys ha skonys yw an wnas `{ $from }` drefen bos `{ $to }` menegys ynwedh.
       *[other] [deprecation] Diskommendys ha skonys yw an wnas `{ $from }` war `<{ $component }>` drefen bos `{ $to }` menegys ynwedh.
    }
deprecated-attribute-ignored = [deprecation] Diskommendys ha skonys yw an wnas `{ $attribute }` war `<{ $component }>`.
deprecated-attribute-to-child = [deprecation] Diskommendys yw an wnas `{ $attribute }` war `<{ $component }>`; devnydh flogh `<{ $child }>` y'n le na.
deprecated-attribute-value-renamed = [deprecation] Diskommendys yw an gwerth `{ $value }` a'n wnas `{ $attribute }` war `<{ $component }>`; devnydh `{ $to }` y'n le na.


## Language coverage

pluralize-english-only = Ny yll `<pluralize>` gul liesplek marnas yn Sowsnek, ytho gesys yw y dekst heb chanj yn dokument skrifys yn { $locale }. Skrif an furv liesplek yn ewn, po settya hi gans an wnas `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Nyns yw an elven `<{ $tag }>` elven Doenet aswonys.
schema-element-not-allowed-at-root = Nyns yw an elven `<{ $tag }>` gesys orth gwreydhen an dokument.
schema-element-not-allowed-inside = Nyns yw an elven `<{ $tag }>` gesys a-berth yn `<{ $parent }>`.
schema-attribute-unrecognized = Nyns eus gnas henwys `{ $attribute }` dhe'n elven `<{ $tag }>`.
schema-attribute-value-not-allowed =
    { $isList ->
        [true] Res yw dhe'n wnas `{ $attribute }` a'n elven `<{ $tag }>` bos rol may fo pub tra ynni onan a: { $allowed }
       *[other] Res yw dhe'n wnas `{ $attribute }` a'n elven `<{ $tag }>` bos onan a: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Hanow variant anwiw rag select. Yma an hanow variant { $variantName } ow tos yn { $numOptions } dewis mes an niver dhe dhewis yw { $numToSelect }.
select-variant-name-without-options = Yma variantys menegys rag select mes nyns eus dewisyow menegys rag an hanow variant possybyl: { $variantName }.
select-variant-name-not-possible = Nyns yw an hanow variant { $variantName } menegys rag select hanow variant possybyl.
select-too-few-options = Ny yllir dewis { $numToSelect } komponent yn-mes a { $numOptions } yn unnsel.
select-from-sequence-too-few-values = Ny yllir dewis { $numToSelect } gwerth yn-mes a sekwens a'n hys { $length }.
select-from-sequence-indices-count-mismatch = Res yw dhe niver an indeksow menegys rag select desedha orth an niver dhe dhewis
select-from-sequence-indices-not-integers = Res yw dhe bub indeks menegys rag select bos niver kowal
select-from-sequence-index-excluded = Indeks menegys a selectfromsequence a veu keslesys yn-mes
select-from-sequence-indices-excluded-combination = Indeksow menegys a selectfromsequence a veu kesunyans keslesys yn-mes
select-from-sequence-coprime-not-positive-integers = Ny yllir dewis kesunyansow coprime drefen nag yw niverow posedhek kowal ow pos dewisys.
select-from-sequence-coprime-common-factor = Ny yllir dewis niverow coprime. Yma faktor kemmyn dhe bub gwerth possybyl. (Res yw dhe'n gwerthow menegys a "from" po "to" bos coprime gans "step".)
select-from-sequence-coprime-single-number = Ny yllir dewis kesunyansow coprime yn-mes a unn niver nag yw 1.
select-from-sequence-excluded-too-many-combinations = Keslesys veu moy es 70% a'n kesunyansow yn selectFromSequence
select-from-sequence-coprime-none-found = Ny allas niverow coprime bos dewisys. Yma faktor kemmyn dhe bub gwerth possybyl.
select-from-sequence-too-few-unique-values = Ny yllir dewis { $numToSelect } gwerth unnik yn-mes a sekwens a'n hys { $numPossibleValues }
select-prime-numbers-too-few-values = Ny yllir dewis { $numToSelect } gwerth yn-mes a rol niverow kynsa a'n hys { $numValues }
select-prime-numbers-values-count-mismatch = Res yw dhe niver an gwerthow menegys rag select desedha orth an niver dhe dhewis
select-prime-numbers-values-not-prime = Res yw dhe bub gwerth menegys rag select niver kynsa bos y'n rol niverow kynsa
select-prime-numbers-values-excluded-combination = Gwerthow menegys a selectPrimeNumbers a veu kesunyans keslesys yn-mes
select-prime-numbers-excluded-too-many-combinations = Keslesys veu moy es 70% a'n kesunyansow yn selectPrimeNumbers
select-random-combination-fluke = Dre chons pur anwaytys, ny allas kesunyans a werthow tesek bos dewisys
select-random-value-fluke = Dre chons pur anwaytys, ny allas gwerth tesek bos dewisys

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] Nyns yw an `<{ $component }>` ma diskwedhys drefen y vos a-berth yn matematek ha nag yw `inline`. Keworr `inline` may fo rol droplann, hag a dhesedh a-berth yn lavarow.
        [expanded] Nyns yw an `<{ $component }>` ma diskwedhys drefen y vos a-berth yn matematek hag yw `expanded`. Dilea `expanded`; ny wra boks lieslinen desedha a-berth yn lavarow.
        [on-graph] Nyns yw an `<{ $component }>` ma diskwedhys drefen y vos a-berth yn matematek tennys war graf, ha nyns eus spas ynno rag entrans.
       *[relative-width] Nyns yw an `<{ $component }>` ma diskwedhys drefen y vos a-berth yn matematek ha bos les relatif dhodho. Ro an les yn unnsow absolyt, kepar ha `px`, y'n le na.
    }
