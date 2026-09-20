# Saint Lucian Creole French (Kwéyòl) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The Saint Lucian and Dominican standard, as `chrome.ftl`
# sets it out letter by letter. It is very close to the Martinican and
# Guadeloupean spelling; the two conventions that differ are the «w» for every
# etymological French /r/ («wéponn», «éwè», «atwibi», «wéféwans», «twouvé»,
# «kowesponn») and the determiner written as a separate word with the full
# allomorph set («fonksyon an», «sèk la», «pwen an», «kanva a») where GEREC
# hyphenates a generalized «-la». The French-etymological spelling is not
# mixed in.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# **Number.** No `[one]`/`[other]` select appears anywhere in this file. Saint
# Lucian nouns do not inflect for number — «pwen», «entèval», «atwibi»,
# «valè» are one word for one and for many — so a counted message whose only
# difference in English is the noun's number renders one string here and the
# select is dropped. The count still arrives and is still formatted.
# `Intl.PluralRules` has no CLDR data for `acf` in any case. Where English's
# two counts multiplied out to four sentences
# (`function-domain-insufficient-dimensions`,
# `function-iterates-input-output-mismatch`), Kwéyòl has one.
#
# The one place a numeric variable still selects is
# `field-function-wrong-num-outputs`, and it is not a plural: its `[one]` and
# `[other]` branches are two different sentences about two different
# components — a slope at each point against a vector at each point — and
# collapsing them would lose the advice, not just a suffix.
#
# **Loans.** French, respelled by the Saint Lucian rules: «konpozan»,
# «atwibi», «varyab», «varyant», «endis», «valè», «sekans», «fonksyon»,
# «entèval», «matwis», «ekwasyon», «pawabòl», «entèseksyon», «dépandans»,
# «sikilè», «wéféwans», «kontwas», «definisyon», «anotasyon», «konvèsyon»,
# «kopwim», «katyon», «anyon», «distwaktè», «wekisyon», «aksésibilité»,
# «pliwyèl». English, which in Saint Lucia is the school language and so a
# shorter road than it is in Guadeloupe: «tag», «prop», «blòk», «wandè»,
# «kanva». The frame around them is creole throughout: «ka» for the
# progressive, «ké» for the future, «té» for the anterior, «pa» for negation,
# «pé pa» for *cannot*, «pòkò» for *not yet*, «yo» as the impersonal subject
# that carries every passive, «sé» for the copula, and the postposed
# determiner.
#
# **Confidence.** The error frames — «pa valab», «pé pa kalkilé», «yo pòkò
# enplimanté», «yo ka inyowé» — are ordinary Kwéyòl and are the surest thing
# here. The mathematical vocabulary is the French one respelled, which is what
# a Kwéyòl-speaking teacher says around an English lesson; the computing
# vocabulary («wandè», «kanva», «tibout kòd» in `editor.ftl`) is a proposal.
#
# Kwéyòl punctuates as English does: no space before `:`, `;`, `?` or `!`.


## `<lineSegment>`

# No select: «atwibi» is one word for one and for many, and «yo ka inyowé» is
# the impersonal, which agrees with nothing. One string covers both English
# categories. The count still arrives.
line-segment-attributes-ignored-with-endpoints = yo ka inyowé { $attributes } lè dé bout espesifyé

line-segment-attributes-ignored-with-endpoint-and-midpoint = yo ka inyowé { $attributes } lè on bout é on mitan espesifyé toulédé

line-segment-midpoint-offset-without-midpoint = midpointOffset pa ka fè anyen san on mitan

## `<line>`

line-points-undetermined-dimensions = Liy ki ka pasé an pwen ki ni dimansyon yo pa détèwminé.

line-points-too-few-dimensions = Liy la dwèt pasé an pwen ki ni omwen dé dimansyon.

line-points-depend-on-variables = Liy la ka pasé an pwen ki ka dépann di varyab: { $variables }.

line-equation-invalid-format = Fòma pa valab pou ekwasyon liy la an varyab { $variable1 } é { $variable2 }.

## `<ray>`

ray-overprescribed-through = Dimi-dwat la pweskwi pa through, endpoint é direction.  Yo ka inyowé through ki espesifyé a.

ray-dimension-mismatch = numDimensions pa ka kowesponn adan dimi-dwat la.

## `<vector>`

vector-overprescribed-head = Vektè a pweskwi pa head, tail é displacement.  Yo ka inyowé head ki espesifyé a.

vector-dimension-mismatch = numDimensions pa ka kowesponn adan vektè a.

## Attracting and constraining

attract-to-without-nearest-point = Pé pa atiwé asi on `<{ $component }>` paske i pa ni on varyab déta nearestPoint.

constrain-to-without-nearest-point = Pé pa kontwenn asi on `<{ $component }>` paske i pa ni on varyab déta nearestPoint.

constrain-to-interior-without-nearest-point = Pé pa kontwenn adan entewyè on `<{ $component }>` paske i pa ni on varyab déta nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = yo ka inyowé labelPosition pou on choiceInput ki pa inline

## Ordering children by index

choice-input-indices-count-mismatch = Yo ka inyowé indices ki espesifyé pou choiceInput paske kantité endis pa ka kowesponn épi kantité pitit choice.

pretzel-indices-count-mismatch = Yo ka inyowé indices ki espesifyé pou problem paske kantité endis pa ka kowesponn épi kantité pitit problem.

shuffle-indices-count-mismatch = Yo ka inyowé indices ki espesifyé pou shuffle paske kantité endis pa ka kowesponn épi kantité konpozan.

indices-ignored-out-of-range = Yo ka inyowé indices ki espesifyé pou { $component } paske kèk endis déwò limit la.

pretzel-indices-repeated = Yo ka inyowé indices ki espesifyé pou pretzel paske kèk endis wépété.

pretzel-circuit-first-index = Yo ka inyowé indices ki espesifyé pou pretzel an mòd circuit paske pwèmyé endis la dwèt sé 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Pou `<{ $component }>` maché épi pitit ki sé chenn kawaktè, ou dwèt espesifyé on atwibi `type`.

invalid-type-defaulting-to-math = Tip { $type } pa valab pou konpozan { $component }. I dwèt sé yonn adan math, text, number oben boolean. Yo ka pwan math.

string-not-valid-component-to-arrange = Chenn "{ $value }" pa on konpozan valab pou { $component }. Yo ka inyowé sa.

## Types and variables

invalid-type-defaulting-to-number = Tip { $type } pa valab, yo ka mèt tip la asi number.

invalid-variable-value = Valè on varyab ki pa valab: `{ $value }`

## Variants

variant-index-must-be-number = Endis varyant { $index } dwèt sé on nonm

variant-index-must-be-integer = Endis varyant { $index } dwèt sé on antyé

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` pa enplimanté pou mizi absoli. Yo ka mèt lajè a wélatif.

side-by-side-absolute-margins = `<{ $component }>` pa enplimanté pou mizi absoli. Yo ka mèt maj la wélatif.

side-by-side-no-block-child = `<{ $component }>` pa valab: i dwèt ni omwen on pitit blòk.

## `<label>`

label-for-ignored-on-graphical = Yo ka inyowé atwibi `for` asi on `<label>` gwafik.

label-for-must-resolve-to-one = Atwibi `for` asi `<label>` dwèt wézoud asi yon sèl konpozan.

label-for-unresolved = Atwibi `for` asi `<label>` pa pé wézoud asi on konpozan.

label-for-answer-with-authored-inputs = Atwibi `for` asi `<label>` ka wéféwé a on `<answer>` ki ni antwé otè a ekwi limenm; wéféwé a antwé a diwèkteman.

label-for-answer-without-input = Atwibi `for` asi `<label>` ka wéféwé a on `<answer>` ki pa ni antwé pou etikté.

label-for-must-reference-input-or-answer = Atwibi `for` asi `<label>` dwèt wéféwé a on antwé oben a on wéponn.

## Accessibility

accessibility-short-description-or-decorative = Pou aksésibilité, `<{ $component }>` dwèt ni on deskwipsyon kout oben dwèt espesifyé kon dekowatif.

accessibility-video-short-description = Pou aksésibilité, `<video>` dwèt ni on deskwipsyon kout.

accessibility-input-short-description-or-label = Pou aksésibilité, `<{ $component }>` dwèt ni on deskwipsyon kout oben on etikèt.

accessibility-answer-input-short-description-or-label = Pou aksésibilité, on `<answer>` ki ka kwéyé on antwé dwèt ni on deskwipsyon kout oben on etikèt.

accessibility-short-description-contains-math = Deskwipsyon kout pa ta dwèt ni konpozan matématik kon `<{ $component }>` adan yo. Eplé tout matématik épi mo.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } pa ni asé kontwas pou tèks tit seksyon an (mòd fè nwè) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i ka mandé omwen { $threshold }:1).
       *[other] { $colorName } pa ni asé kontwas pou tèks tit seksyon an ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i ka mandé omwen { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Yo pòkò enplimanté `<circle>` ki ka pasé an { $count } pwen adan ka a koté pwen an pa ni valè nimewik.

circle-too-many-through-points = Pé pa kalkilé on sèk ki ka pasé an plis ki 3 pwen.

circle-overprescribed-radius-center-points = Pé pa kalkilé on sèk ki ni weyon, sant é pwen espesifyé ansanm.

circle-center-with-multiple-points = Pé pa kalkilé on sèk ki ni on sant espesifyé é ki ka pasé an plis ki 1 pwen.

circle-radius-too-small = Pé pa kalkilé sèk la: piski distans ant dé pwen an sé { $distance }, weyon { $radius } ki espesifyé a twòp piti.

circle-radius-with-many-points = Pé pa kwéyé on sèk ki ka pasé an plis ki dé pwen épi on weyon espesifyé.

circle-invalid-center-or-through-points = Sant oben pwen sèk la pa valab.

circle-radius-center-with-multiple-points = Pé pa kalkilé weyon on sèk ki ni on sant espesifyé é ki ka pasé an plis ki 1 pwen.

circle-change-radius-non-numerical = Pé pa chanjé weyon on sèk ki ka pasé an pwen ki pa nimewik

circle-radius-with-points-non-numerical = Pé pa kwéyé on sèk ki ka pasé an plis ki on pwen épi on weyon espesifyé lè valè nimewik la pa la.

circle-change-center-non-numerical = Yo pòkò enplimanté chanjman sant on sèk ki ka pasé an pwen ki pa ni valè nimewik.

## `<function>`

# English's two counts multiply out to four sentences; Guadeloupean has one,
# because «entèval» and «antwé» are invariant. Both selects are dropped and
# both counts still arrive and are still formatted.
function-domain-insufficient-dimensions = Dimansyon domèn fonksyon an pa asé. Domèn an ni { $intervals } entèval mé fonksyon an ni { $inputs } antwé.

function-domain-invalid-format = Fòma domèn fonksyon an pa valab.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Yo ka inyowé maksimòm fonksyon an ki pa nimewik.
        [minimum] Yo ka inyowé minimòm fonksyon an ki pa nimewik.
        [extremum] Yo ka inyowé ekstwemòm fonksyon an ki pa nimewik.
        [point] Yo ka inyowé pwen fonksyon an ki pa nimewik.
        [slope] Yo ka inyowé pant fonksyon an ki pa nimewik.
       *[other] Yo ka inyowé { $type } fonksyon an ki pa nimewik.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Yo ka inyowé maksimòm fonksyon an ki vid.
        [minimum] Yo ka inyowé minimòm fonksyon an ki vid.
        [extremum] Yo ka inyowé ekstwemòm fonksyon an ki vid.
        [point] Yo ka inyowé pwen fonksyon an ki vid.
       *[other] Yo ka inyowé { $type } fonksyon an ki vid.
    }

function-points-too-close = Fonksyon an ni dé pwen ki twòp pwé yonn a lòt. Pé pa défini fonksyon an.

# Both selects dropped, for the reason above.
function-iterates-input-output-mismatch = Itewasyon fonksyon posib sèlman si kantité antwé a fonksyon an égal kantité sòti a-y. Fonksyon sala ni { $inputs } antwé é { $outputs } sòti.

## `<sequence>`

sequence-invalid-length = Longè sekans la pa valab.  I dwèt sé on antyé ki pa negatif.

sequence-invalid-step = Pa sekans la pa valab.  I dwèt sé on nonm pou on sekans tip { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" pa valab pou on sekans nonm.  I dwèt sé on nonm.

sequence-invalid-endpoint-letters = "{ $attribute }" pa valab pou on sekans lèt.  I dwèt sé on konbinezon lèt.

sequence-invalid-endpoint = "{ $attribute }" pa valab pou sekans la.

select-from-sequence-coprime-not-numbers = yo ka inyowé coprime paske sé pa nonm yo ka chwazi

select-from-sequence-coprime-with-exclude-combinations = yo ka inyowé coprime paske excludeCombinations espesifyé

## Resolving a `target`

target-not-found = target pa valab pou `<{ $source }>`: pé pa twouvé target la.

target-state-variable-not-found = target pa valab pou `<{ $source }>`: pé pa twouvé on varyab déta ki kwiyé "{ $property }" asi on `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Varyab `<odeSystem>` dwèt diféwan di varyab endepandan an.

ode-system-duplicate-variable-names = Pé pa défini fonksyon RHS ODE épi non varyab dépandan ki wépété.

ode-system-rhs-function-error = Pé pa défini fonksyon RHS ODE.  Éwè adan kwéyasyon fonksyon mathjs la.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Pé pa défini on ang ant { $count } liy

angle-invalid-through-point = Pwen ki pa valab adan through on `<angle>`

parabola-vertex-too-many-points = Yo pòkò enplimanté on pawabòl ki ni on somè é ki ka pasé an plis ki 1 pwen.

parabola-too-many-points = Yo pòkò enplimanté on pawabòl ki ka pasé an plis ki 3 pwen.

intersection-too-many-items = Yo pòkò enplimanté entèseksyon pou plis ki dé eleman

## Other math components

ionic-compound-not-two-ions = Yo pòkò enplimanté konpozé yonik pou dòt bagay ki dé yon.

ionic-compound-needs-cation-and-anion = Konpozé yonik enplimanté sèlman pou on katyon é on anyon.

solve-equations-cannot-evaluate = Pé pa wézoud ekwasyon an paske yo pa pé evalyé-y: { $equation }

math-operators-operand-number-required = Ou dwèt espesifyé on operandNumber lè ou ka ekstwè on operand matématik.

eigen-decomposition-failed = Yo pa pé kalkilé valè pwòp a matwis la

## `<matchesPattern>`

# No select: the English branches differ only in the number of «pawamèt», and
# the sentence is turned impersonal so that neither a singular nor a plural
# pronoun has to be chosen. The count still arrives.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: pawamèt { $parameters } pa ka pawet adan modèl la, kidonk sa ké toujou kowesponn épi on blan.

## `<graph>`

graph-grid-invalid = `<graph>`: pé pa entèpwété grid="{ $grid }". I dwèt sé none, medium, dense, oben dé nonm pozitif sepawé pa on espas, kon grid="1 0.5". Yo pa ka twasé pyès kadwiyaj.

## `<slopeField>` and `<vectorField>`

# The `$expected` select is not a plural: the two branches are two different
# sentences about two different components. `$found` is turned impersonal so
# that no plural branch is needed for it.
field-function-wrong-num-outputs =
    `<{ $component }>` bizwen on fonksyon ki ni { $expected ->
        [one] on sèl sòti, pant y' an chak pwen, kon `y - x`
       *[other] dé sòti, vektè a an chak pwen, kon `(y, -x)`
    }, mé fonksyon yo bay la ni { $found } sòti. { $alternative ->
        [none] Yo pa ka twasé anyen.
       *[other] `<{ $alternative }>` sé konpozan an pou fonksyon sala. Yo pa ka twasé anyen.
    }

field-function-attribute-ignored-with-child = Yo ka inyowé atwibi `function` paske fonksyon an bay adan konpozan an tou; sé sila ki adan an yo ka pwan. Bay fonksyon an yon sèl fason.

field-variables-ignored =
    `<{ $component }>`: atwibi `variables` ka kwiyé varyab a on ekspwesyon ki ekwi diwèkteman adan konpozan an. { $reason ->
        [function-child] Fonksyon an la bay kon on pitit `<function>`, ki ka kwiyé varyab a-y limenm, kidonk yo ka inyowé `variables`.
       *[no-expression] Pa ni on ekspwesyon kon sa la, kidonk yo ka inyowé `variables`.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" pa sipòté adan wandè prefigure la; yo ka sèvi épi konpòtman pozisyon dwat la.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" pa sipòté adan wandè prefigure la; yo ka sèvi épi konpòtman pozisyon anlè a.

prefigure-invalid-axis-bounds = `<graph>`: limit aks la pa valab pou konvèsyon prefigure; yo ka sèvi épi bbox pa défo (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: lajè a pa valab pou konvèsyon prefigure; yo ka sèvi épi lajè dyagwam pa défo 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio pa valab pou konvèsyon prefigure; yo ka sèvi épi wapò aspè pa défo 1.

prefigure-grid-spacing-too-fine = `<graph>`: espasman kadwiyaj la twòp fen pou limit aks la; yo ka kité kadwiyaj la déwò adan wandè prefigure la.

prefigure-annotations-not-rendered = `<graph>`: yo pa ké wann anotasyon lè yo pa ka sèvi épi wandè PreFigure a.

multiple-annotations-children = Yo twouvé plizyè pitit `<annotations>` adan `<graph>`; yo ka inyowé tout sof dènyé la.

## Referring to other components

copy-unrecognized-component-type = Pé pa pwolonjé oben kopyé on tip konpozan yo pa ka wekonèt: { $type }.

copy-prop-not-found = Yo pa pé twouvé prop { $property } asi on konpozan tip { $component }

collect-no-source = Yo pa twouvé pyès sous pou collect.

collect-invalid-component-type = Pé pa kolekté konpozan tip `<{ $component }>` paske sé on tip konpozan ki pa valab.

reference-index-unavailable = Pé pa wéféwé a endis `{ $reference }`

## `<callAction>`

component-action-unavailable = Pé pa kwiyé { $action } asi konpozan `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Doné a ni on fòm ki pa valab.  Wanjé a ni longè ki pa konsistan. Twouvé adan componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Doné a ni non kolòn ki wépété.  Twouvé adan componentIdx :{ $componentIdx }

data-frame-missing-column-name = Doné a ka manké on non kolòn.  Twouvé adan componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = On award pou wéponn sala basé asi wéponn a tag wéponn lan limenm voyé, é sa ké mennen adan on konpòtman ou pa té ka atann.

answer-max-num-attempts-in-section-wide-check-work = Mèt `maxNumAttempts` asi on `<answer>` adan on kontenè ki ni `sectionWideCheckWork` pa ka fè anyen, paske sé kontenè a ki ka kontwolé kantité ésè. Mèt `maxNumAttempts` asi kontenè a pito.

nested-section-wide-check-work-max-num-attempts = Mèt `maxNumAttempts` asi on kontenè ki ni `sectionWideCheckWork` é ki adan on dòt kontenè ki ni `sectionWideCheckWork` pa ka fè anyen, paske sé kontenè déwò a ki ka kontwolé kantité ésè. Mèt `maxNumAttempts` asi kontenè déwò a pito.

# No select: «atwibi» is invariant and «pa ké fè anyen» agrees with nothing.
answer-attributes-need-symbolic-equality = Atwibi { $attributes } pa ké fè anyen san symbolicEquality mété.

answer-invalid-type = Tip pa valab pou wéponn lan: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Piski konpozan `<{ $component }>` pa ni on non, yo pé pa sèvi épi-y pou on atwibi module

module-attribute-name-already-defined = Yo pé pa sèvi épi konpozan `<{ $component } name="{ $name }">` kon on atwibi pou on module paske tip konpozan `<module>` ni on atwibi "{ $name }" ki ja défini.

conditional-content-condition-ignored = Yo ka inyowé atwibi `condition` asi on konpozan `<conditionalContent>` ki ni pitit case oben else.

slider-markers-type-mismatch = Tip makè a pa ka kowesponn épi tip slider la.

pretzel-problem-needs-statement-and-answer = pretzel pa valab: chak `<problem>` dwèt ni on `<statement>` é on `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel pa valab: an mode="circuit", pwèmyé `<problem>`-la pé pa sé on distwaktè.

## Attribute values

# No select: «valè» is invariant, and «yo ka inyowé sa» is impersonal, so one
# string covers both English categories. The count still arrives.
attribute-invalid-values = Valè { $values } pa valab pou atwibi `{ $attribute }`; yo ka inyowé sa.

attribute-must-be-references = Valè `{ $value }` pa valab pou atwibi `{ $attribute }`. Atwibi a dwèt fòmé épi wéféwans ki ka koumansé épi on `$`.

math-input-invalid-function-names = <mathInput>: yo ka inyowé non fonksyon ki pa valab adan { $attribute }: { $names }. Segman afichaj a chak non dwèt ni omwen 2 kawaktè (lèt oben tiwè); on sifiks `|<mathspeak alternative>` opsyonèl pé swiv.

## Building components from the source

component-type-invalid = Tip konpozan ki pa valab: `<{ $componentType }>`

attribute-repeated = Pé pa wépété atwibi { $attribute }.

attribute-invalid-for-component = Atwibi "{ $attribute }" pa valab pou on konpozan tip `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Définisyon stil { $styleNumber } pa ni asé kontwas pou { $context ->
        [text-on-background] koulè tèks kont koulè fon
        [high-contrast] koulè gwo kontwas kont kanva a
        [line] koulè liy kont kanva a
        [marker] koulè makè kont kanva a
       *[text-on-canvas] koulè tèks kont kanva a
    }{ $mode ->
        [dark] { " (mòd fè nwè)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i ka mandé omwen { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Kwak définisyon stil { $styleNumber } espesifyé koulè ki ka bay asé kontwas pou mòd klè, koulè mòd fè nwè a ki sòti adan valè sala pa ni asé kontwas pou koulè tèks kont koulè fon ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i ka mandé omwen { $threshold }:1). { $suggestion ->
        [available] Pou asiwé asé kontwas an mòd fè nwè, ou pé ogmanté kontwas mòd klè a (pa egzanp, mèt { $lightAttribute }="{ $lightColor }") oben wanplasé koulè mòd fè nwè a (pa egzanp, mèt { $darkAttribute }="{ $darkColor }").
       *[none] Pou asiwé asé kontwas an mòd fè nwè, ogmanté kontwas mòd klè a oben wanplasé koulè ki sòti a épi textColorDarkMode é/oben backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Kwak définisyon stil { $styleNumber } espesifyé on koulè tèks ki ka bay asé kontwas pou mòd klè, koulè tèks mòd fè nwè a ki sòti adan valè sala pa ni asé kontwas kont kanva a ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i ka mandé omwen { $threshold }:1). { $suggestion ->
        [available] Pou asiwé asé kontwas an mòd fè nwè, ou pé ogmanté kontwas mòd klè a (pa egzanp, mèt textColor="{ $lightColor }") oben wanplasé koulè mòd fè nwè a (pa egzanp, mèt textColorDarkMode="{ $darkColor }").
       *[none] Pou asiwé asé kontwas an mòd fè nwè, ogmanté kontwas mòd klè a oben wanplasé koulè ki sòti a épi textColorDarkMode.
    }

section-multiple-style-palettes = On seksyon pé chwazi yon sèl <stylePalette>; yo ka sèvi épi dènyé la.

## Unique variants

variant-num-to-select-not-non-negative-integer = pé pa détèwminé varyant inik a { $component } paske numToSelect pa on antyé ki pa negatif.

variant-num-to-select-not-constant-number = pé pa détèwminé varyant inik a { $component } paske numToSelect pa on nonm konstan.

variant-with-replacement-not-constant-boolean = pé pa détèwminé varyant inik a { $component } paske withReplacement pa on boulean konstan.

variant-select-weight-disables-unique = Varyant inik pou select dezaktivé si ni on opsyon ki ni selectWeight oben selectForVariants espesifyé

variant-coprime-undetermined = pé pa détèwminé varyant inik a { $component } paske yo pé pa détèwminé si coprime toujou fo.

variant-attribute-not-constant = pé pa détèwminé varyant inik a { $component } paske { $attribute } pa on konstan.

variant-attribute-not-number = pé pa détèwminé varyant inik a { $component } paske { $attribute } pa on nonm.

variant-attribute-wrong-type-for-sequence =
    pé pa détèwminé varyant inik a { $component } tip { $type } paske { $attribute } pa { $expected ->
        [letters-combination] on konbinezon lèt
        [math-expression] on ekspwesyon matématik valab
        [integer] on antyé
       *[number] on nonm
    }.

variant-length-not-integer = pé pa détèwminé varyant inik a { $component } paske length pa on antyé.

variant-sort-not-implemented = yo pòkò enplimanté varyant inik a on { $component } épi sort

variant-exclude-combinations-not-implemented = yo pòkò enplimanté varyant inik a on { $component } épi excludeCombinations

variant-math-exclude-not-implemented = yo pòkò enplimanté varyant inik a on { $component } tip math épi exclude

variant-non-constant-exclude-not-implemented = yo pòkò enplimanté varyant inik a on { $component } épi on exclude ki pa konstan

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: pa sipòté adan wandè prefigure a graph la; yo ka soté désandan an.

prefigure-descendant-invalid-geometry = { $subject }: jeyometwi ki pa fini oben ki pa konplèt; yo ka soté désandan an.

prefigure-curve-label-omitted = { $subject }: yo pa ka sipòté etikèt asi eleman koub ki konvèti; yo ka kité etikèt la déwò.

prefigure-curve-unsupported-definition-type = { $subject }: tip definisyon fonksyon koub '{ $definitionType }' pa sipòté; yo ka soté désandan an.

prefigure-region-flip-functions-unsupported = { $subject }: atwibi flipFunctions pa sipòté asi regionBetweenCurves; yo ka soté désandan an.

prefigure-region-non-formula-child = { $subject }: sé sèlman pitit fonksyon tip fòmil yo ka sipòté asi regionBetweenCurves; yo ka soté désandan an.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' pa sipòté pou { $labelKind ->
        [line-family] on etikèt fanmi liy
       *[point] on etikèt pwen
    }; yo ka sèvi épi aliyman PreFigure pa défo.

prefigure-fill-style-unsupported = { $subject }: PreFigure pa ka sipòté stil wanpli '{ $fillStyle }'; yo ka tonbé asi on wanpli plen.

prefigure-line-style-unknown = { $subject }: stil liy '{ $lineStyle }' yo pa konnèt kité déwò adan sòti PreFigure a.

prefigure-marker-style-mapped-to-diamond = { $subject }: stil makè '{ $markerStyle }' ka kowesponn épi stil PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: PreFigure pa ka sipòté stil makè '{ $markerStyle }'; yo ka sèvi épi stil pa défo.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` pa valab; pé pa wézoud sib la. Yo ka kité anotasyon an déwò.

annotation-ref-multiple-targets = `<annotation>`: `ref` wézoud asi plizyè sib; yo ka sèvi épi pwèmyé sib la.

annotation-ref-outside-graph = `<annotation>`: `ref` pa valab; sib la déwò graph ki ka kontni-y la. Yo ka kité anotasyon an déwò.

annotation-ref-unsupported-target = `<annotation>`: `ref` pa valab; sib la pa on objè gwafik ki sipòté adan konvèsyon prefigure. Yo ka kité anotasyon an déwò.

annotation-text-missing = `<annotation>`: `text` ka manké oben vid; yo ka bay on tèks vid.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Yo détekté on dépandans sikilè.
       *[other] Yo détekté on dépandans sikilè ki ka enplitjé on konpozan `<{ $componentType }>`.
    }

reference-no-referent = Yo pa twouvé pyès wéféwan pou wéféwans la: `{ $reference }`

reference-multiple-referents = Yo twouvé plizyè wéféwan pou wéféwans la: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Fòma pa valab pou atwibi { $attribute } a on `<{ $componentType }>`.

children-invalid = Pitit ki pa valab pou `<{ $componentType }>`: Yo twouvé pitit ki pa valab: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valè `{ $value }` pa valab pou atwibi `{ $attribute }`, yo ka sèvi épi valè `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Yo pa twouvé vèsyon DoenetML { $version }.
       *[other] Yo pa twouvé vèsyon DoenetML { $version }. Yo ka tonbé asi vèsyon { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ki pa valab: { $content }

parse-tag-missing-close-tag = DoenetML ki pa valab: Tag `{ $tag }` pa ni tag fèmti. Yo té ka atann on tag ki ka fèmé tèt a-y oben on tag `</{ $tagName }>`.

parse-tag-error = DoenetML ki pa valab: Éwè adan tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML ki pa valab: Atwibi `{ $attribute }` ki pa valab ka sanb ka manké on valè.

parse-attribute-invalid = DoenetML ki pa valab: Atwibi `{ $attribute }` pa valab

parse-attribute-value-invalid = DoenetML ki pa valab: Valè atwibi `{ $value }` pa valab

parse-attribute-value-quote-mismatch = DoenetML ki pa valab: Valè atwibi `{ $value }` pa valab. Gimè a pa ka kowesponn. I ka sanb ou ka manké on `{ $quote }`

parse-open-tag-name-missing = DoenetML ki pa valab: Yo twouvé on tag san non tag, pa egzanp `<`

parse-tag-not-closed = DoenetML ki pa valab: Tag `{ $tag }` pa té fèmé (i ka sanb on `>` ka manké).

parse-self-closing-tag-name-missing = DoenetML ki pa valab: Yo twouvé on tag san non tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ki pa valab: Tag `{ $tag }` pa té fèmé (i ka sanb `/>` ka manké).

parse-tag-invalid-attributes = DoenetML ki pa valab: Tag `{ $tag }` pa valab. I pé ni atwibi ki pa kòwèk.

parse-close-tag-name-missing = DoenetML ki pa valab: Yo twouvé on tag fèmti san non tag, pa egzanp `</`

parse-attribute-value-unquoted = Valè atwibi dwèt adan gimè: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ki pa valab: Yo twouvé tag fèmti `{ $tag }`, mé pa ni tag ouvèti ki ka kowesponn

parse-close-tag-mismatched = DoenetML ki pa valab: Tag fèmti pa ka kowesponn. Yo té ka atann `</{ $expected }>`. Yo twouvé `{ $found }`

parser-node-unconvertible = Yo pa pé konvèti nœud { $node } an nœud Dast.

## Names

name-attribute-invalid =
    Atwibi name='{ $name }' pa valab. { $reason ->
        [characters] Non pé ni sèlman lèt, chif, tiwè anba oben tiwè.
       *[start] Non dwèt koumansé épi on lèt.
    }

component-name-invalid-start = Non konpozan "{ $name }" pa valab. Non dwèt koumansé épi on lèt.

## `<answer>` sugar

answer-video-watched-missing-video = On wéponn tip videoWatched dwèt ni on atwibi video

answer-video-watched-video-not-reference = On wéponn tip videoWatched dwèt ni on atwibi video ki sé on wéféwans

answer-name-not-single-text = Atwibi name a on wéponn dwèt ni yon sèl pitit tèks

## Referencing another document

external-doenetml-recursion-limit = Yo pa pé jwenn DoenetML déwò a paske ni twòp nivo wekisyon. Es ni on wéféwans sikilè?

external-doenetml-unavailable = Yo pa pé jwenn DoenetML adan { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML ki pa valab jwenn adan { $attribute }="{ $uri }": i pa té ka kowesponn épi tip konpozan "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atwibi `{ $from }` démodé; sèvi épi `{ $to }` pito.
       *[other] [deprecation] Atwibi `{ $from }` asi `<{ $component }>` démodé; sèvi épi `{ $to }` pito.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atwibi `{ $from }` démodé é yo ka inyowé-y paske `{ $to }` espesifyé tou.
       *[other] [deprecation] Atwibi `{ $from }` asi `<{ $component }>` démodé é yo ka inyowé-y paske `{ $to }` espesifyé tou.
    }

deprecated-attribute-ignored = [deprecation] Atwibi `{ $attribute }` asi `<{ $component }>` démodé é yo ka inyowé-y.

deprecated-attribute-to-child = [deprecation] Atwibi `{ $attribute }` asi `<{ $component }>` démodé; sèvi épi on pitit `<{ $child }>` pito.

deprecated-attribute-value-renamed = [deprecation] Valè `{ $value }` a atwibi `{ $attribute }` asi `<{ $component }>` démodé; sèvi épi `{ $to }` pito.


## Language coverage

pluralize-english-only = `<pluralize>` pé mèt sèlman anglé an pliwyèl, kidonk tèks a-y ka wété kon i yé adan on dokiman ki ekwi an { $locale }. Ekwi fòm pliwyèl la diwèkteman, oben mèt li épi atwibi `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Eleman `<{ $tag }>` pa on eleman Doenet yo ka wekonèt.

schema-element-not-allowed-at-root = Eleman `<{ $tag }>` pa pèmèt an wasin dokiman an.

schema-element-not-allowed-inside = Eleman `<{ $tag }>` pa pèmèt adan `<{ $parent }>`.

schema-attribute-unrecognized = Eleman `<{ $tag }>` pa ni on atwibi ki kwiyé `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atwibi `{ $attribute }` a eleman `<{ $tag }>` dwèt sé on lis koté chak atik sé yonn adan: { $allowed }
       *[other] Atwibi `{ $attribute }` a eleman `<{ $tag }>` dwèt sé yonn adan: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Non varyant pa valab pou select.  Non varyant { $variantName } ka pawet adan { $numOptions } opsyon mé kantité pou chwazi sé { $numToSelect }.

select-variant-name-without-options = Kèk varyant espesifyé pou select mé pa ni pyès opsyon espesifyé pou non varyant posib: { $variantName }.

select-variant-name-not-possible = Non varyant { $variantName } ki espesifyé pou select pa on non varyant posib.

select-too-few-options = Pé pa chwazi { $numToSelect } konpozan adan sèlman { $numOptions }.

select-from-sequence-too-few-values = Pé pa chwazi { $numToSelect } valè adan on sekans longè { $length }.

select-from-sequence-indices-count-mismatch = Kantité endis espesifyé pou select dwèt kowesponn épi kantité pou chwazi

select-from-sequence-indices-not-integers = Tout endis espesifyé pou select dwèt sé antyé

select-from-sequence-index-excluded = Endis selectfromsequence ki espesifyé a té eskli

select-from-sequence-indices-excluded-combination = Endis selectfromsequence ki espesifyé a té on konbinezon eskli

select-from-sequence-coprime-not-positive-integers = Pé pa chwazi konbinezon kopwim paske sé pa antyé pozitif yo ka chwazi.

select-from-sequence-coprime-common-factor = Pé pa chwazi nonm kopwim. Tout valè posib la ka pataj on faktè komen. (Valè "from" oben "to" ki espesifyé dwèt kopwim épi "step".)

select-from-sequence-coprime-single-number = Pé pa chwazi konbinezon kopwim adan yon sèl nonm ki pa 1.

select-from-sequence-excluded-too-many-combinations = Plis ki 70% a konbinezon an eskli adan selectFromSequence

select-from-sequence-coprime-none-found = Yo pa pé chwazi nonm kopwim. Tout valè posib la ka pataj on faktè komen.

select-from-sequence-too-few-unique-values = Pé pa chwazi { $numToSelect } valè inik adan on sekans longè { $numPossibleValues }

select-prime-numbers-too-few-values = Pé pa chwazi { $numToSelect } valè adan on lis nonm pwèmyé longè { $numValues }

select-prime-numbers-values-count-mismatch = Kantité valè espesifyé pou select dwèt kowesponn épi kantité pou chwazi

select-prime-numbers-values-not-prime = Tout valè espesifyé pou select nonm pwèmyé dwèt adan lis nonm pwèmyé a

select-prime-numbers-values-excluded-combination = Valè selectPrimeNumbers ki espesifyé a té on konbinezon eskli

select-prime-numbers-excluded-too-many-combinations = Plis ki 70% a konbinezon an eskli adan selectPrimeNumbers

select-random-combination-fluke = Pa on chans estwèmman wa, yo pa pé chwazi on konbinezon valè o aza

select-random-value-fluke = Pa on chans estwèmman wa, yo pa pé chwazi on valè o aza

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` pa twasé adan matématik la; ekspwesyon an konpozé kon i té ye avan yo té pé mèt antwé adan-y. { $reason ->
        [not-inline] Sé sèlman on choice input `inline` ki ka wantwé adan on ekspwesyon; san `inline` i sé on blòk bouton.
        [expanded] On text input `expanded` sé on bwèt plizyè liy, ki twòp gwo pou chita adan on ekspwesyon.
        [on-graph] Asi on graph ekspwesyon an twasé kon yon sèl imaj, ki pa ni plas pou on kontwòl.
       *[relative-width] `width` a-y wélatif (on pousantaj oben `em`), ki pa ni anyen pou mizuwé kont adan on ekspwesyon. Bay lajè a an inité absoli, kon `px`, pito.
    }
