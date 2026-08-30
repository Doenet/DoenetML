# Guadeloupean Creole French (kréyòl gwadloupéyen) diagnostics. Translated
# from `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The GEREC standard, as `chrome.ftl` sets it out letter by
# letter. The French-etymological spelling is not mixed in.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# **Number.** No `[one]`/`[other]` select appears anywhere in this file.
# Guadeloupean nouns do not inflect for number — «pwen», «entèval», «atribi»,
# «valè» are one word for one and for many — so a counted message whose only
# difference in English is the noun's number renders one string here and the
# select is dropped. The count still arrives and is still formatted.
# `Intl.PluralRules` has no CLDR data for `gcf` in any case. Where English's
# two counts multiplied out to four sentences
# (`function-domain-insufficient-dimensions`,
# `function-iterates-input-output-mismatch`), Guadeloupean has one.
#
# The one place a numeric variable still selects is
# `field-function-wrong-num-outputs`, and it is not a plural: its `[one]` and
# `[other]` branches are two different sentences about two different
# components — a slope at each point against a vector at each point — and
# collapsing them would lose the advice, not just a suffix.
#
# **Loans.** French, respelled by GEREC: «konpozan», «atribi», «varyab»,
# «varyant», «endis», «valè», «sekans», «fonksyon», «entèval», «matris»,
# «ekwasyon», «parabòl», «entèseksyon», «depandans», «sikilè», «référans»,
# «kontras», «definisyon», «anotasyon», «konvèsyon», «koprim», «katyon»,
# «anyon», «distraktè», «rekisyon», «aksésibilité», «pliryèl». English, through
# the markup itself: «tag», «prop», «blòk», «randè», «kanva». The frame around
# them is creole throughout: «ka» for the progressive, «ké» for the future,
# «té» for the anterior, «pa» for negation, «pé pa» for *cannot*, «pòkò» for
# *not yet*, «yo» as the impersonal subject that carries every passive, and
# the postposed hyphenated determiner («liy-la», «sèk-la», «kontenè-la»).
#
# **Confidence.** The error frames — «pa valab», «pé pa kalkilé», «yo pòkò
# enplimanté», «yo ka inyoré» — are ordinary Guadeloupean and are the surest
# thing here. The mathematical vocabulary is the French one respelled, which
# is what a Guadeloupean teacher says in the classroom; the computing
# vocabulary («randè», «kanva», «tibout kòd» in `editor.ftl`) is a proposal.
#
# Creole punctuates as English does: no space before `:`, `;`, `?` or `!`.


## `<lineSegment>`

# No select: «atribi» is one word for one and for many, and «yo ka inyoré» is
# the impersonal, which agrees with nothing. One string covers both English
# categories. The count still arrives.
line-segment-attributes-ignored-with-endpoints = yo ka inyoré { $attributes } lè dé bout espesifyé

line-segment-attributes-ignored-with-endpoint-and-midpoint = yo ka inyoré { $attributes } lè on bout é on mitan espesifyé toulédé

line-segment-midpoint-offset-without-midpoint = midpointOffset pa ka fè ayen san on mitan

## `<line>`

line-points-undetermined-dimensions = Liy ki ka pasé an pwen ki ni dimansyon yo pa détèrminé.

line-points-too-few-dimensions = Liy-la dwèt pasé an pwen ki ni omwen dé dimansyon.

line-points-depend-on-variables = Liy-la ka pasé an pwen ki ka dépann di varyab: { $variables }.

line-equation-invalid-format = Fòma pa valab pou ekwasyon liy-la an varyab { $variable1 } é { $variable2 }.

## `<ray>`

ray-overprescribed-through = Dimi-dwat-la preskri pa through, endpoint é direction.  Yo ka inyoré through ki espesifyé-la.

ray-dimension-mismatch = numDimensions pa ka koresponn adan dimi-dwat-la.

## `<vector>`

vector-overprescribed-head = Vektè-la preskri pa head, tail é displacement.  Yo ka inyoré head ki espesifyé-la.

vector-dimension-mismatch = numDimensions pa ka koresponn adan vektè-la.

## Attracting and constraining

attract-to-without-nearest-point = Pé pa atiré asi on `<{ $component }>` paske i pa ni on varyab déta nearestPoint.

constrain-to-without-nearest-point = Pé pa kontrenn asi on `<{ $component }>` paske i pa ni on varyab déta nearestPoint.

constrain-to-interior-without-nearest-point = Pé pa kontrenn adan enteryè on `<{ $component }>` paske i pa ni on varyab déta nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = yo ka inyoré labelPosition pou on choiceInput ki pa inline

## Ordering children by index

choice-input-indices-count-mismatch = Yo ka inyoré indices ki espesifyé pou choiceInput paske kantité endis pa ka koresponn épi kantité pitit choice.

pretzel-indices-count-mismatch = Yo ka inyoré indices ki espesifyé pou problem paske kantité endis pa ka koresponn épi kantité pitit problem.

shuffle-indices-count-mismatch = Yo ka inyoré indices ki espesifyé pou shuffle paske kantité endis pa ka koresponn épi kantité konpozan.

indices-ignored-out-of-range = Yo ka inyoré indices ki espesifyé pou { $component } paske kèk endis déwò limit-la.

pretzel-indices-repeated = Yo ka inyoré indices ki espesifyé pou pretzel paske kèk endis répété.

pretzel-circuit-first-index = Yo ka inyoré indices ki espesifyé pou pretzel an mòd circuit paske prèmyé endis-la dwèt sé 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Pou `<{ $component }>` maché épi pitit ki sé chenn karaktè, ou dwèt espesifyé on atribi `type`.

invalid-type-defaulting-to-math = Tip { $type } pa valab pou konpozan { $component }. I dwèt sé yonn adan math, text, number oben boolean. Yo ka pran math.

string-not-valid-component-to-arrange = Chenn "{ $value }" pa on konpozan valab pou { $component }. Yo ka inyoré sa.

## Types and variables

invalid-type-defaulting-to-number = Tip { $type } pa valab, yo ka mèt tip-la asi number.

invalid-variable-value = Valè on varyab ki pa valab: `{ $value }`

## Variants

variant-index-must-be-number = Endis varyant { $index } dwèt sé on nonm

variant-index-must-be-integer = Endis varyant { $index } dwèt sé on antyé

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` pa enplimanté pou mizi absoli. Yo ka mèt lajè-la relatif.

side-by-side-absolute-margins = `<{ $component }>` pa enplimanté pou mizi absoli. Yo ka mèt maj-la relatif.

side-by-side-no-block-child = `<{ $component }>` pa valab: i dwèt ni omwen on pitit blòk.

## `<label>`

label-for-ignored-on-graphical = Yo ka inyoré atribi `for` asi on `<label>` grafik.

label-for-must-resolve-to-one = Atribi `for` asi `<label>` dwèt rézoud asi yon sèl konpozan.

label-for-unresolved = Atribi `for` asi `<label>` pa pé rézoud asi on konpozan.

label-for-answer-with-authored-inputs = Atribi `for` asi `<label>` ka référé a on `<answer>` ki ni antré otè-la ekri limenm; référé a antré-la dirèkteman.

label-for-answer-without-input = Atribi `for` asi `<label>` ka référé a on `<answer>` ki pa ni antré pou etikté.

label-for-must-reference-input-or-answer = Atribi `for` asi `<label>` dwèt référé a on antré oben a on répons.

## Accessibility

accessibility-short-description-or-decorative = Pou aksésibilité, `<{ $component }>` dwèt ni on deskripsyon kout oben dwèt espesifyé kon dekoratif.

accessibility-video-short-description = Pou aksésibilité, `<video>` dwèt ni on deskripsyon kout.

accessibility-input-short-description-or-label = Pou aksésibilité, `<{ $component }>` dwèt ni on deskripsyon kout oben on etikèt.

accessibility-answer-input-short-description-or-label = Pou aksésibilité, on `<answer>` ki ka kréyé on antré dwèt ni on deskripsyon kout oben on etikèt.

accessibility-short-description-contains-math = Deskripsyon kout pa ta dwèt ni konpozan matématik kon `<{ $component }>` adan yo. Eplé tout matématik épi mo.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } pa ni asé kontras pou tèks tit seksyon-la (mòd fè nwè) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i ka mandé omwen { $threshold }:1).
       *[other] { $colorName } pa ni asé kontras pou tèks tit seksyon-la ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i ka mandé omwen { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Yo pòkò enplimanté `<circle>` ki ka pasé an { $count } pwen adan ka-la éti pwen-la pa ni valè nimerik.

circle-too-many-through-points = Pé pa kalkilé on sèk ki ka pasé an plis ki 3 pwen.

circle-overprescribed-radius-center-points = Pé pa kalkilé on sèk ki ni reyon, sant é pwen espesifyé ansanm.

circle-center-with-multiple-points = Pé pa kalkilé on sèk ki ni on sant espesifyé é ki ka pasé an plis ki 1 pwen.

circle-radius-too-small = Pé pa kalkilé sèk-la: piski distans ant dé pwen-la sé { $distance }, reyon { $radius } ki espesifyé-la twòp piti.

circle-radius-with-many-points = Pé pa kréyé on sèk ki ka pasé an plis ki dé pwen épi on reyon espesifyé.

circle-invalid-center-or-through-points = Sant oben pwen sèk-la pa valab.

circle-radius-center-with-multiple-points = Pé pa kalkilé reyon on sèk ki ni on sant espesifyé é ki ka pasé an plis ki 1 pwen.

circle-change-radius-non-numerical = Pé pa chanjé reyon on sèk ki ka pasé an pwen ki pa nimerik

circle-radius-with-points-non-numerical = Pé pa kréyé on sèk ki ka pasé an plis ki on pwen épi on reyon espesifyé lè valè nimerik-la pa la.

circle-change-center-non-numerical = Yo pòkò enplimanté chanjman sant on sèk ki ka pasé an pwen ki pa ni valè nimerik.

## `<function>`

# English's two counts multiply out to four sentences; Guadeloupean has one,
# because «entèval» and «antré» are invariant. Both selects are dropped and
# both counts still arrive and are still formatted.
function-domain-insufficient-dimensions = Dimansyon domèn fonksyon-la pa asé. Domèn-la ni { $intervals } entèval mé fonksyon-la ni { $inputs } antré.

function-domain-invalid-format = Fòma domèn fonksyon-la pa valab.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Yo ka inyoré maksimòm fonksyon-la ki pa nimerik.
        [minimum] Yo ka inyoré minimòm fonksyon-la ki pa nimerik.
        [extremum] Yo ka inyoré ekstremòm fonksyon-la ki pa nimerik.
        [point] Yo ka inyoré pwen fonksyon-la ki pa nimerik.
        [slope] Yo ka inyoré pant fonksyon-la ki pa nimerik.
       *[other] Yo ka inyoré { $type } fonksyon-la ki pa nimerik.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Yo ka inyoré maksimòm fonksyon-la ki vid.
        [minimum] Yo ka inyoré minimòm fonksyon-la ki vid.
        [extremum] Yo ka inyoré ekstremòm fonksyon-la ki vid.
        [point] Yo ka inyoré pwen fonksyon-la ki vid.
       *[other] Yo ka inyoré { $type } fonksyon-la ki vid.
    }

function-points-too-close = Fonksyon-la ni dé pwen ki twòp pré yonn a lòt. Pé pa défini fonksyon-la.

# Both selects dropped, for the reason above.
function-iterates-input-output-mismatch = Iterasyon fonksyon posib sèlman si kantité antré a fonksyon-la égal kantité sòti a-y. Fonksyon-lasa ni { $inputs } antré é { $outputs } sòti.

## `<sequence>`

sequence-invalid-length = Longè sekans-la pa valab.  I dwèt sé on antyé ki pa negatif.

sequence-invalid-step = Pa sekans-la pa valab.  I dwèt sé on nonm pou on sekans tip { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" pa valab pou on sekans nonm.  I dwèt sé on nonm.

sequence-invalid-endpoint-letters = "{ $attribute }" pa valab pou on sekans lèt.  I dwèt sé on konbinezon lèt.

sequence-invalid-endpoint = "{ $attribute }" pa valab pou sekans-la.

select-from-sequence-coprime-not-numbers = yo ka inyoré coprime paske sé pa nonm yo ka chwazi

select-from-sequence-coprime-with-exclude-combinations = yo ka inyoré coprime paske excludeCombinations espesifyé

## Resolving a `target`

target-not-found = target pa valab pou `<{ $source }>`: pé pa trouvé target-la.

target-state-variable-not-found = target pa valab pou `<{ $source }>`: pé pa trouvé on varyab déta ki kryé "{ $property }" asi on `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Varyab `<odeSystem>` dwèt diféran di varyab endepandan-la.

ode-system-duplicate-variable-names = Pé pa défini fonksyon RHS ODE épi non varyab dépandan ki répété.

ode-system-rhs-function-error = Pé pa défini fonksyon RHS ODE.  Erè adan kréyasyon fonksyon mathjs-la.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Pé pa défini on ang ant { $count } liy

angle-invalid-through-point = Pwen ki pa valab adan through on `<angle>`

parabola-vertex-too-many-points = Yo pòkò enplimanté on parabòl ki ni on somè é ki ka pasé an plis ki 1 pwen.

parabola-too-many-points = Yo pòkò enplimanté on parabòl ki ka pasé an plis ki 3 pwen.

intersection-too-many-items = Yo pòkò enplimanté entèseksyon pou plis ki dé eleman

## Other math components

ionic-compound-not-two-ions = Yo pòkò enplimanté konpozé yonik pou dòt bagay ki dé yon.

ionic-compound-needs-cation-and-anion = Konpozé yonik enplimanté sèlman pou on katyon é on anyon.

solve-equations-cannot-evaluate = Pé pa rézoud ekwasyon-la paske yo pa pé evalyé-y: { $equation }

math-operators-operand-number-required = Ou dwèt espesifyé on operandNumber lè ou ka ekstrè on operand matématik.

eigen-decomposition-failed = Yo pa pé kalkilé valè pwòp a matris-la

## `<matchesPattern>`

# No select: the English branches differ only in the number of «paramèt», and
# the sentence is turned impersonal so that neither a singular nor a plural
# pronoun has to be chosen. The count still arrives.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: paramèt { $parameters } pa ka paret adan modèl-la, kidonk sa ké toujou koresponn épi on blan.

## `<graph>`

graph-grid-invalid = `<graph>`: pé pa entèprété grid="{ $grid }". I dwèt sé none, medium, dense, oben dé nonm pozitif separé pa on espas, kon grid="1 0.5". Yo pa ka trasé pon kadriyaj.

## `<slopeField>` and `<vectorField>`

# The `$expected` select is not a plural: the two branches are two different
# sentences about two different components. `$found` is turned impersonal so
# that no plural branch is needed for it.
field-function-wrong-num-outputs =
    `<{ $component }>` bizwen on fonksyon ki ni { $expected ->
        [one] on sèl sòti, pant y' an chak pwen, kon `y - x`
       *[other] dé sòti, vektè-la an chak pwen, kon `(y, -x)`
    }, mé fonksyon yo bay la ni { $found } sòti. { $alternative ->
        [none] Yo pa ka trasé ayen.
       *[other] `<{ $alternative }>` sé konpozan-la pou fonksyon-lasa. Yo pa ka trasé ayen.
    }

field-function-attribute-ignored-with-child = Yo ka inyoré atribi `function` paske fonksyon-la bay adan konpozan-la tou; sé sila ki adan-la yo ka pran. Bay fonksyon-la yon sèl fason.

field-variables-ignored =
    `<{ $component }>`: atribi `variables` ka kryé varyab a on ekspresyon ki ekri dirèkteman adan konpozan-la. { $reason ->
        [function-child] Fonksyon-la la bay kon on pitit `<function>`, ki ka kryé varyab a-y limenm, kidonk yo ka inyoré `variables`.
       *[no-expression] Pa ni on ekspresyon kon sa la, kidonk yo ka inyoré `variables`.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" pa sipòté adan randè prefigure-la; yo ka sèvi épi konpòtman pozisyon dwat-la.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" pa sipòté adan randè prefigure-la; yo ka sèvi épi konpòtman pozisyon anlè-la.

prefigure-invalid-axis-bounds = `<graph>`: limit aks-la pa valab pou konvèsyon prefigure; yo ka sèvi épi bbox pa défo (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: lajè-la pa valab pou konvèsyon prefigure; yo ka sèvi épi lajè dyagram pa défo 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio pa valab pou konvèsyon prefigure; yo ka sèvi épi rapò aspè pa défo 1.

prefigure-grid-spacing-too-fine = `<graph>`: espasman kadriyaj-la twòp fen pou limit aks-la; yo ka kité kadriyaj-la déwò adan randè prefigure-la.

prefigure-annotations-not-rendered = `<graph>`: yo pa ké rann anotasyon lè yo pa ka sèvi épi randè PreFigure-la.

multiple-annotations-children = Yo trouvé plizyè pitit `<annotations>` adan `<graph>`; yo ka inyoré tout sof dènyé-la.

## Referring to other components

copy-unrecognized-component-type = Pé pa pwolonjé oben kopyé on tip konpozan yo pa ka rekonèt: { $type }.

copy-prop-not-found = Yo pa pé trouvé prop { $property } asi on konpozan tip { $component }

collect-no-source = Yo pa trouvé pon sous pou collect.

collect-invalid-component-type = Pé pa kolekté konpozan tip `<{ $component }>` paske sé on tip konpozan ki pa valab.

reference-index-unavailable = Pé pa référé a endis `{ $reference }`

## `<callAction>`

component-action-unavailable = Pé pa kryé { $action } asi konpozan `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Doné-la ni on fòm ki pa valab.  Ranjé-la ni longè ki pa konsistan. Trouvé adan componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Doné-la ni non kolòn ki répété.  Trouvé adan componentIdx :{ $componentIdx }

data-frame-missing-column-name = Doné-la ka manké on non kolòn.  Trouvé adan componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = On award pou répons-lasa basé asi répons a tag répons-la limenm voyé, é sa ké mennen adan on konpòtman ou pa té ka atann.

answer-max-num-attempts-in-section-wide-check-work = Mèt `maxNumAttempts` asi on `<answer>` adan on kontenè ki ni `sectionWideCheckWork` pa ka fè ayen, paske sé kontenè-la ki ka kontrolé kantité ésè. Mèt `maxNumAttempts` asi kontenè-la pito.

nested-section-wide-check-work-max-num-attempts = Mèt `maxNumAttempts` asi on kontenè ki ni `sectionWideCheckWork` é ki adan on dòt kontenè ki ni `sectionWideCheckWork` pa ka fè ayen, paske sé kontenè déwò-la ki ka kontrolé kantité ésè. Mèt `maxNumAttempts` asi kontenè déwò-la pito.

# No select: «atribi» is invariant and «pa ké fè ayen» agrees with nothing.
answer-attributes-need-symbolic-equality = Atribi { $attributes } pa ké fè ayen san symbolicEquality mété.

answer-invalid-type = Tip pa valab pou répons-la: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Piski konpozan `<{ $component }>` pa ni on non, yo pé pa sèvi épi-y pou on atribi module

module-attribute-name-already-defined = Yo pé pa sèvi épi konpozan `<{ $component } name="{ $name }">` kon on atribi pou on module paske tip konpozan `<module>` ni on atribi "{ $name }" ki ja défini.

conditional-content-condition-ignored = Yo ka inyoré atribi `condition` asi on konpozan `<conditionalContent>` ki ni pitit case oben else.

slider-markers-type-mismatch = Tip makè-la pa ka koresponn épi tip slider-la.

pretzel-problem-needs-statement-and-answer = pretzel pa valab: chak `<problem>` dwèt ni on `<statement>` é on `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel pa valab: an mode="circuit", prèmyé `<problem>`-la pé pa sé on distraktè.

## Attribute values

# No select: «valè» is invariant, and «yo ka inyoré sa» is impersonal, so one
# string covers both English categories. The count still arrives.
attribute-invalid-values = Valè { $values } pa valab pou atribi `{ $attribute }`; yo ka inyoré sa.

attribute-must-be-references = Valè `{ $value }` pa valab pou atribi `{ $attribute }`. Atribi-la dwèt fòmé épi référans ki ka koumansé épi on `$`.

math-input-invalid-function-names = <mathInput>: yo ka inyoré non fonksyon ki pa valab adan { $attribute }: { $names }. Segman afichaj a chak non dwèt ni omwen 2 karaktè (lèt oben tirè); on sifiks `|<mathspeak alternative>` opsyonèl pé swiv.

## Building components from the source

component-type-invalid = Tip konpozan ki pa valab: `<{ $componentType }>`

attribute-repeated = Pé pa répété atribi { $attribute }.

attribute-invalid-for-component = Atribi "{ $attribute }" pa valab pou on konpozan tip `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Définisyon stil { $styleNumber } pa ni asé kontras pou { $context ->
        [text-on-background] koulè tèks kont koulè fon
        [high-contrast] koulè gwo kontras kont kanva-la
        [line] koulè liy kont kanva-la
        [marker] koulè makè kont kanva-la
       *[text-on-canvas] koulè tèks kont kanva-la
    }{ $mode ->
        [dark] { " (mòd fè nwè)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i ka mandé omwen { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Kwak définisyon stil { $styleNumber } espesifyé koulè ki ka bay asé kontras pou mòd klè, koulè mòd fè nwè-la ki sòti adan valè-lasa pa ni asé kontras pou koulè tèks kont koulè fon ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i ka mandé omwen { $threshold }:1). { $suggestion ->
        [available] Pou asiré asé kontras an mòd fè nwè, ou pé ogmanté kontras mòd klè-la (pa egzanp, mèt { $lightAttribute }="{ $lightColor }") oben ranplasé koulè mòd fè nwè-la (pa egzanp, mèt { $darkAttribute }="{ $darkColor }").
       *[none] Pou asiré asé kontras an mòd fè nwè, ogmanté kontras mòd klè-la oben ranplasé koulè ki sòti-la épi textColorDarkMode é/oben backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Kwak définisyon stil { $styleNumber } espesifyé on koulè tèks ki ka bay asé kontras pou mòd klè, koulè tèks mòd fè nwè-la ki sòti adan valè-lasa pa ni asé kontras kont kanva-la ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i ka mandé omwen { $threshold }:1). { $suggestion ->
        [available] Pou asiré asé kontras an mòd fè nwè, ou pé ogmanté kontras mòd klè-la (pa egzanp, mèt textColor="{ $lightColor }") oben ranplasé koulè mòd fè nwè-la (pa egzanp, mèt textColorDarkMode="{ $darkColor }").
       *[none] Pou asiré asé kontras an mòd fè nwè, ogmanté kontras mòd klè-la oben ranplasé koulè ki sòti-la épi textColorDarkMode.
    }

section-multiple-style-palettes = On seksyon pé chwazi yon sèl <stylePalette>; yo ka sèvi épi dènyé-la.

## Unique variants

variant-num-to-select-not-non-negative-integer = pé pa détèrminé varyant inik a { $component } paske numToSelect pa on antyé ki pa negatif.

variant-num-to-select-not-constant-number = pé pa détèrminé varyant inik a { $component } paske numToSelect pa on nonm konstan.

variant-with-replacement-not-constant-boolean = pé pa détèrminé varyant inik a { $component } paske withReplacement pa on boulean konstan.

variant-select-weight-disables-unique = Varyant inik pou select dezaktivé si ni on opsyon ki ni selectWeight oben selectForVariants espesifyé

variant-coprime-undetermined = pé pa détèrminé varyant inik a { $component } paske yo pé pa détèrminé si coprime toujou fo.

variant-attribute-not-constant = pé pa détèrminé varyant inik a { $component } paske { $attribute } pa on konstan.

variant-attribute-not-number = pé pa détèrminé varyant inik a { $component } paske { $attribute } pa on nonm.

variant-attribute-wrong-type-for-sequence =
    pé pa détèrminé varyant inik a { $component } tip { $type } paske { $attribute } pa { $expected ->
        [letters-combination] on konbinezon lèt
        [math-expression] on ekspresyon matématik valab
        [integer] on antyé
       *[number] on nonm
    }.

variant-length-not-integer = pé pa détèrminé varyant inik a { $component } paske length pa on antyé.

variant-sort-not-implemented = yo pòkò enplimanté varyant inik a on { $component } épi sort

variant-exclude-combinations-not-implemented = yo pòkò enplimanté varyant inik a on { $component } épi excludeCombinations

variant-math-exclude-not-implemented = yo pòkò enplimanté varyant inik a on { $component } tip math épi exclude

variant-non-constant-exclude-not-implemented = yo pòkò enplimanté varyant inik a on { $component } épi on exclude ki pa konstan

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: pa sipòté adan randè prefigure a graph-la; yo ka soté désandan-la.

prefigure-descendant-invalid-geometry = { $subject }: jeyometri ki pa fini oben ki pa konplèt; yo ka soté désandan-la.

prefigure-curve-label-omitted = { $subject }: yo pa ka sipòté etikèt asi eleman koub ki konvèti; yo ka kité etikèt-la déwò.

prefigure-curve-unsupported-definition-type = { $subject }: tip definisyon fonksyon koub '{ $definitionType }' pa sipòté; yo ka soté désandan-la.

prefigure-region-flip-functions-unsupported = { $subject }: atribi flipFunctions pa sipòté asi regionBetweenCurves; yo ka soté désandan-la.

prefigure-region-non-formula-child = { $subject }: sé sèlman pitit fonksyon tip fòmil yo ka sipòté asi regionBetweenCurves; yo ka soté désandan-la.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' pa sipòté pou { $labelKind ->
        [line-family] on etikèt fanmi liy
       *[point] on etikèt pwen
    }; yo ka sèvi épi aliyman PreFigure pa défo.

prefigure-fill-style-unsupported = { $subject }: PreFigure pa ka sipòté stil ranpli '{ $fillStyle }'; yo ka tonbé asi on ranpli plen.

prefigure-line-style-unknown = { $subject }: stil liy '{ $lineStyle }' yo pa konnèt kité déwò adan sòti PreFigure-la.

prefigure-marker-style-mapped-to-diamond = { $subject }: stil makè '{ $markerStyle }' ka koresponn épi stil PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: PreFigure pa ka sipòté stil makè '{ $markerStyle }'; yo ka sèvi épi stil pa défo.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` pa valab; pé pa rézoud sib-la. Yo ka kité anotasyon-la déwò.

annotation-ref-multiple-targets = `<annotation>`: `ref` rézoud asi plizyè sib; yo ka sèvi épi prèmyé sib-la.

annotation-ref-outside-graph = `<annotation>`: `ref` pa valab; sib-la déwò graph ki ka kontni-y la. Yo ka kité anotasyon-la déwò.

annotation-ref-unsupported-target = `<annotation>`: `ref` pa valab; sib-la pa on objè grafik ki sipòté adan konvèsyon prefigure. Yo ka kité anotasyon-la déwò.

annotation-text-missing = `<annotation>`: `text` ka manké oben vid; yo ka bay on tèks vid.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Yo détekté on dépandans sikilè.
       *[other] Yo détekté on dépandans sikilè ki ka enplitjé on konpozan `<{ $componentType }>`.
    }

reference-no-referent = Yo pa trouvé pon référan pou référans-la: `{ $reference }`

reference-multiple-referents = Yo trouvé plizyè référan pou référans-la: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Fòma pa valab pou atribi { $attribute } a on `<{ $componentType }>`.

children-invalid = Pitit ki pa valab pou `<{ $componentType }>`: Yo trouvé pitit ki pa valab: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valè `{ $value }` pa valab pou atribi `{ $attribute }`, yo ka sèvi épi valè `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Yo pa trouvé vèsyon DoenetML { $version }.
       *[other] Yo pa trouvé vèsyon DoenetML { $version }. Yo ka tonbé asi vèsyon { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ki pa valab: { $content }

parse-tag-missing-close-tag = DoenetML ki pa valab: Tag `{ $tag }` pa ni tag fèmti. Yo té ka atann on tag ki ka fèmé tèt a-y oben on tag `</{ $tagName }>`.

parse-tag-error = DoenetML ki pa valab: Erè adan tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML ki pa valab: Atribi `{ $attribute }` ki pa valab ka sanb ka manké on valè.

parse-attribute-invalid = DoenetML ki pa valab: Atribi `{ $attribute }` pa valab

parse-attribute-value-invalid = DoenetML ki pa valab: Valè atribi `{ $value }` pa valab

parse-attribute-value-quote-mismatch = DoenetML ki pa valab: Valè atribi `{ $value }` pa valab. Gimè-la pa ka koresponn. I ka sanb ou ka manké on `{ $quote }`

parse-open-tag-name-missing = DoenetML ki pa valab: Yo trouvé on tag san non tag, pa egzanp `<`

parse-tag-not-closed = DoenetML ki pa valab: Tag `{ $tag }` pa té fèmé (i ka sanb on `>` ka manké).

parse-self-closing-tag-name-missing = DoenetML ki pa valab: Yo trouvé on tag san non tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ki pa valab: Tag `{ $tag }` pa té fèmé (i ka sanb `/>` ka manké).

parse-tag-invalid-attributes = DoenetML ki pa valab: Tag `{ $tag }` pa valab. I pé ni atribi ki pa kòrèk.

parse-close-tag-name-missing = DoenetML ki pa valab: Yo trouvé on tag fèmti san non tag, pa egzanp `</`

parse-attribute-value-unquoted = Valè atribi dwèt adan gimè: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ki pa valab: Yo trouvé tag fèmti `{ $tag }`, mé pa ni tag ouvèti ki ka koresponn

parse-close-tag-mismatched = DoenetML ki pa valab: Tag fèmti pa ka koresponn. Yo té ka atann `</{ $expected }>`. Yo trouvé `{ $found }`

parser-node-unconvertible = Yo pa pé konvèti nœud { $node } an nœud Dast.

## Names

name-attribute-invalid =
    Atribi name='{ $name }' pa valab. { $reason ->
        [characters] Non pé ni sèlman lèt, chif, tirè anba oben tirè.
       *[start] Non dwèt koumansé épi on lèt.
    }

component-name-invalid-start = Non konpozan "{ $name }" pa valab. Non dwèt koumansé épi on lèt.

## `<answer>` sugar

answer-video-watched-missing-video = On répons tip videoWatched dwèt ni on atribi video

answer-video-watched-video-not-reference = On répons tip videoWatched dwèt ni on atribi video ki sé on référans

answer-name-not-single-text = Atribi name a on répons dwèt ni yon sèl pitit tèks

## Referencing another document

external-doenetml-recursion-limit = Yo pa pé jwenn DoenetML déwò-la paske ni twòp nivo rekisyon. Es ni on référans sikilè?

external-doenetml-unavailable = Yo pa pé jwenn DoenetML adan { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML ki pa valab jwenn adan { $attribute }="{ $uri }": i pa té ka koresponn épi tip konpozan "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribi `{ $from }` démodé; sèvi épi `{ $to }` pito.
       *[other] [deprecation] Atribi `{ $from }` asi `<{ $component }>` démodé; sèvi épi `{ $to }` pito.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribi `{ $from }` démodé é yo ka inyoré-y paske `{ $to }` espesifyé tou.
       *[other] [deprecation] Atribi `{ $from }` asi `<{ $component }>` démodé é yo ka inyoré-y paske `{ $to }` espesifyé tou.
    }

deprecated-attribute-ignored = [deprecation] Atribi `{ $attribute }` asi `<{ $component }>` démodé é yo ka inyoré-y.

deprecated-attribute-to-child = [deprecation] Atribi `{ $attribute }` asi `<{ $component }>` démodé; sèvi épi on pitit `<{ $child }>` pito.

deprecated-attribute-value-renamed = [deprecation] Valè `{ $value }` a atribi `{ $attribute }` asi `<{ $component }>` démodé; sèvi épi `{ $to }` pito.


## Language coverage

pluralize-english-only = `<pluralize>` pé mèt sèlman anglé an pliryèl, kidonk tèks a-y ka rété kon i yé adan on dokiman ki ekri an { $locale }. Ekri fòm pliryèl-la dirèkteman, oben mèt li épi atribi `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Eleman `<{ $tag }>` pa on eleman Doenet yo ka rekonèt.

schema-element-not-allowed-at-root = Eleman `<{ $tag }>` pa pèmèt an rasin dokiman-la.

schema-element-not-allowed-inside = Eleman `<{ $tag }>` pa pèmèt adan `<{ $parent }>`.

schema-attribute-unrecognized = Eleman `<{ $tag }>` pa ni on atribi ki kryé `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribi `{ $attribute }` a eleman `<{ $tag }>` dwèt sé on lis éti chak atik sé yonn adan: { $allowed }
       *[other] Atribi `{ $attribute }` a eleman `<{ $tag }>` dwèt sé yonn adan: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Non varyant pa valab pou select.  Non varyant { $variantName } ka paret adan { $numOptions } opsyon mé kantité pou chwazi sé { $numToSelect }.

select-variant-name-without-options = Kèk varyant espesifyé pou select mé pa ni pon opsyon espesifyé pou non varyant posib: { $variantName }.

select-variant-name-not-possible = Non varyant { $variantName } ki espesifyé pou select pa on non varyant posib.

select-too-few-options = Pé pa chwazi { $numToSelect } konpozan adan sèlman { $numOptions }.

select-from-sequence-too-few-values = Pé pa chwazi { $numToSelect } valè adan on sekans longè { $length }.

select-from-sequence-indices-count-mismatch = Kantité endis espesifyé pou select dwèt koresponn épi kantité pou chwazi

select-from-sequence-indices-not-integers = Tout endis espesifyé pou select dwèt sé antyé

select-from-sequence-index-excluded = Endis selectfromsequence ki espesifyé-la té eskli

select-from-sequence-indices-excluded-combination = Endis selectfromsequence ki espesifyé-la té on konbinezon eskli

select-from-sequence-coprime-not-positive-integers = Pé pa chwazi konbinezon koprim paske sé pa antyé pozitif yo ka chwazi.

select-from-sequence-coprime-common-factor = Pé pa chwazi nonm koprim. Tout valè posib-la ka pataj on faktè komen. (Valè "from" oben "to" ki espesifyé dwèt koprim épi "step".)

select-from-sequence-coprime-single-number = Pé pa chwazi konbinezon koprim adan yon sèl nonm ki pa 1.

select-from-sequence-excluded-too-many-combinations = Plis ki 70% a konbinezon-la eskli adan selectFromSequence

select-from-sequence-coprime-none-found = Yo pa pé chwazi nonm koprim. Tout valè posib-la ka pataj on faktè komen.

select-from-sequence-too-few-unique-values = Pé pa chwazi { $numToSelect } valè inik adan on sekans longè { $numPossibleValues }

select-prime-numbers-too-few-values = Pé pa chwazi { $numToSelect } valè adan on lis nonm prèmyé longè { $numValues }

select-prime-numbers-values-count-mismatch = Kantité valè espesifyé pou select dwèt koresponn épi kantité pou chwazi

select-prime-numbers-values-not-prime = Tout valè espesifyé pou select nonm prèmyé dwèt adan lis nonm prèmyé-la

select-prime-numbers-values-excluded-combination = Valè selectPrimeNumbers ki espesifyé-la té on konbinezon eskli

select-prime-numbers-excluded-too-many-combinations = Plis ki 70% a konbinezon-la eskli adan selectPrimeNumbers

select-random-combination-fluke = Pa on chans estrèmman ra, yo pa pé chwazi on konbinezon valè o aza

select-random-value-fluke = Pa on chans estrèmman ra, yo pa pé chwazi on valè o aza

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` pa trasé adan matématik-la; ekspresyon-la konpozé kon i té ye avan yo té pé mèt antré adan-y. { $reason ->
        [not-inline] Sé sèlman on choice input `inline` ki ka rantré adan on ekspresyon; san `inline` i sé on blòk bouton.
        [expanded] On text input `expanded` sé on bwèt plizyè liy, ki twòp gwo pou chita adan on ekspresyon.
        [on-graph] Asi on graph ekspresyon-la trasé kon yon sèl imaj, ki pa ni plas pou on kontwòl.
       *[relative-width] `width` a-y relatif (on pousantaj oben `em`), ki pa ni ayen pou mizuré kont adan on ekspresyon. Bay lajè-la an inité absoli, kon `px`, pito.
    }
