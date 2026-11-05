# Guianese Creole French (kriyòl gwiyanè) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The orthography of French Guiana, as `chrome.ftl` sets it
# out letter by letter. It is written on the same principles as GEREC's
# Guadeloupean spelling and as the Saint Lucian one; what parts them is the
# language — the pronoun «yé» that carries every impersonal passive below, the
# indefinite «roun», the single postposed definite «-a» / «-an», «lò» for
# *when* and «pa pouvé» for *cannot*. The French-etymological spelling is not
# mixed in.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# **Number.** No `[one]`/`[other]` select appears anywhere in this file.
# Guianese nouns do not inflect for number — «pwen», «entèval», «atribi»,
# «valè» are one word for one and for many — so a counted message whose only
# difference in English is the noun's number renders one string here and the
# select is dropped. The count still arrives and is still formatted.
# `Intl.PluralRules` has no CLDR data for `gcr` in any case. Where English's
# two counts multiplied out to four sentences
# (`function-domain-insufficient-dimensions`,
# `function-iterates-input-output-mismatch`), Guianese has one.
#
# The one place a numeric variable still selects is
# `field-function-wrong-num-outputs`, and it is not a plural: its `[one]` and
# `[other]` branches are two different sentences about two different
# components — a slope at each point against a vector at each point — and
# collapsing them would lose the advice, not just a suffix.
#
# **Loans.** French, respelled: «konpozan», «atribi», «varyab», «varyant»,
# «endis», «valè», «sekans», «fonksyon», «entèval», «matris», «ekwasyon»,
# «parabòl», «entèseksyon», «dépandans», «sikilè», «référans», «kontras»,
# «definisyon», «anotasyon», «konvèsyon», «koprim», «katyon», «anyon»,
# «distraktè», «rekisyon», «aksésibilité», «pliryèl». English, through the
# markup itself: «tag», «prop», «blòk», «randè», «kanva». The frame around
# them is creole throughout: «ka» for the progressive, «ké» for the future,
# «té» for the anterior, «pa» for negation, «pa pouvé» for *cannot*, «pòkò»
# for *not yet*, «yé» as the impersonal subject, «roun» as the indefinite
# article, and the postposed hyphenated determiner («liy-a», «sèk-a»,
# «fonksyon-an»).
#
# **Confidence.** The error frames — «pa valab», «pa pouvé kalkilé», «yé pòkò
# enplimanté», «yé ka inyoré» — are ordinary Guianese and are the surest thing
# here. The mathematical vocabulary is the French one respelled, which is what
# a Guianese teacher says in the classroom; the computing vocabulary
# («randè», «kanva», «tibout kòd» in `editor.ftl`) is a proposal. The equative
# copula is written «sé» throughout; a speaker may prefer «sa».
#
# Kriyòl punctuates as English does: no space before `:`, `;`, `?` or `!`.


## `<lineSegment>`

# No select: «atribi» is one word for one and for many, and «yé ka inyoré» is
# the impersonal, which agrees with nothing. One string covers both English
# categories. The count still arrives.
line-segment-attributes-ignored-with-endpoints = yé ka inyoré { $attributes } lò dé bout espesifyé

line-segment-attributes-ignored-with-endpoint-and-midpoint = yé ka inyoré { $attributes } lò roun bout é roun mitan espesifyé toulédé

line-segment-midpoint-offset-without-midpoint = midpointOffset pa ka fè arien san roun mitan

## `<line>`

line-points-undetermined-dimensions = Liy ki ka pasé an pwen ki ni dimansyon yé pa détèrminé.

line-points-too-few-dimensions = Liy-a divèt pasé an pwen ki ni omwen dé dimansyon.

line-points-depend-on-variables = Liy-a ka pasé an pwen ki ka dépann di varyab: { $variables }.

line-equation-invalid-format = Fòma pa valab pou ekwasyon liy-a an varyab { $variable1 } é { $variable2 }.

## `<ray>`

ray-overprescribed-through = Dimi-dwat-a preskri pa through, endpoint é direction.  Yo ka inyoré through ki espesifyé-a.

ray-dimension-mismatch = numDimensions pa ka koresponn annan dimi-dwat-a.

## `<vector>`

vector-overprescribed-head = Vektè-a preskri pa head, tail é displacement.  Yo ka inyoré head ki espesifyé-a.

vector-dimension-mismatch = numDimensions pa ka koresponn annan vektè-a.

## Attracting and constraining

attract-to-without-nearest-point = Pa pouvé atiré asou roun `<{ $component }>` paske li pa ni roun varyab déta nearestPoint.

constrain-to-without-nearest-point = Pa pouvé kontrenn asou roun `<{ $component }>` paske li pa ni roun varyab déta nearestPoint.

constrain-to-interior-without-nearest-point = Pa pouvé kontrenn annan enteryè roun `<{ $component }>` paske li pa ni roun varyab déta nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = yé ka inyoré labelPosition pou roun choiceInput ki pa inline

## Ordering children by index

choice-input-indices-count-mismatch = Yo ka inyoré indices ki espesifyé pou choiceInput paske kantité endis pa ka koresponn épi kantité pitit choice.

pretzel-indices-count-mismatch = Yo ka inyoré indices ki espesifyé pou problem paske kantité endis pa ka koresponn épi kantité pitit problem.

shuffle-indices-count-mismatch = Yo ka inyoré indices ki espesifyé pou shuffle paske kantité endis pa ka koresponn épi kantité konpozan.

indices-ignored-out-of-range = Yo ka inyoré indices ki espesifyé pou { $component } paske kèk endis déwò limit-a.

pretzel-indices-repeated = Yo ka inyoré indices ki espesifyé pou pretzel paske kèk endis répété.

pretzel-circuit-first-index = Yo ka inyoré indices ki espesifyé pou pretzel an mòd circuit paske prèmyé endis-a divèt sé 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Pou `<{ $component }>` maché épi pitit ki sé chenn karaktè, to divèt espesifyé roun atribi `type`.

invalid-type-defaulting-to-math = Tip { $type } pa valab pou konpozan { $component }. I divèt sé roun annan math, text, number oben boolean. Yo ka pran math.

string-not-valid-component-to-arrange = Chenn "{ $value }" pa roun konpozan valab pou { $component }. Yo ka inyoré sa.

## Types and variables

invalid-type-defaulting-to-number = Tip { $type } pa valab, yé ka mèt tip-a asou number.

invalid-variable-value = Valè roun varyab ki pa valab: `{ $value }`

## Variants

variant-index-must-be-number = Endis varyant { $index } divèt sé roun nonm

variant-index-must-be-integer = Endis varyant { $index } divèt sé roun antyé

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` pa enplimanté pou mizi absoli. Yo ka mèt lajè-a relatif.

side-by-side-absolute-margins = `<{ $component }>` pa enplimanté pou mizi absoli. Yo ka mèt maj-a relatif.

side-by-side-no-block-child = `<{ $component }>` pa valab: li divèt ni omwen roun pitit blòk.

## `<label>`

label-for-ignored-on-graphical = Yo ka inyoré atribi `for` asou roun `<label>` grafik.

label-for-must-resolve-to-one = Atribi `for` asou `<label>` divèt rézoud asou yon sèl konpozan.

label-for-unresolved = Atribi `for` asou `<label>` pa pouvé rézoud asou roun konpozan.

label-for-answer-with-authored-inputs = Atribi `for` asou `<label>` ka référé a roun `<answer>` ki ni antré otè-a ekri limenm; référé a antré-a dirèkteman.

label-for-answer-without-input = Atribi `for` asou `<label>` ka référé a roun `<answer>` ki pa ni antré pou etikté.

label-for-must-reference-input-or-answer = Atribi `for` asou `<label>` divèt référé a roun antré oben a roun répons.

## Accessibility

accessibility-short-description-or-decorative = Pou aksésibilité, `<{ $component }>` divèt ni roun deskripsyon kout oben divèt espesifyé kon dekoratif.

accessibility-video-short-description = Pou aksésibilité, `<video>` divèt ni roun deskripsyon kout.

accessibility-input-short-description-or-label = Pou aksésibilité, `<{ $component }>` divèt ni roun deskripsyon kout oben roun etikèt.

accessibility-answer-input-short-description-or-label = Pou aksésibilité, roun `<answer>` ki ka kréyé roun antré divèt ni roun deskripsyon kout oben roun etikèt.

accessibility-short-description-contains-math = Deskripsyon kout pa ta divèt ni konpozan matématik kon `<{ $component }>` annan yé. Eplé tout matématik épi mo.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } pa ni asé kontras pou tèks tit seksyon-an (mòd fè nwè) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; li ka mandé omwen { $threshold }:1).
       *[other] { $colorName } pa ni asé kontras pou tèks tit seksyon-an ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; li ka mandé omwen { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Yo pòkò enplimanté `<circle>` ki ka pasé an { $count } pwen annan ka-a koté pwen-an pa ni valè nimerik.

circle-too-many-through-points = Pa pouvé kalkilé roun sèk ki ka pasé an plis ki 3 pwen.

circle-overprescribed-radius-center-points = Pa pouvé kalkilé roun sèk ki ni reyon, sant é pwen espesifyé ansanm.

circle-center-with-multiple-points = Pa pouvé kalkilé roun sèk ki ni roun sant espesifyé é ki ka pasé an plis ki 1 pwen.

circle-radius-too-small = Pa pouvé kalkilé sèk-a: paske distans ant dé pwen-an sé { $distance }, reyon { $radius } ki espesifyé-a twòp piti.

circle-radius-with-many-points = Pa pouvé kréyé roun sèk ki ka pasé an plis ki dé pwen épi roun reyon espesifyé.

circle-invalid-center-or-through-points = Sant oben pwen sèk-a pa valab.

circle-radius-center-with-multiple-points = Pa pouvé kalkilé reyon roun sèk ki ni roun sant espesifyé é ki ka pasé an plis ki 1 pwen.

circle-change-radius-non-numerical = Pa pouvé chanjé reyon roun sèk ki ka pasé an pwen ki pa nimerik

circle-radius-with-points-non-numerical = Pa pouvé kréyé roun sèk ki ka pasé an plis ki roun pwen épi roun reyon espesifyé lò valè nimerik-a pa la.

circle-change-center-non-numerical = Yo pòkò enplimanté chanjman sant roun sèk ki ka pasé an pwen ki pa ni valè nimerik.

## `<function>`

# English's two counts multiply out to four sentences; Guadeloupean has one,
# because «entèval» and «antré» are invariant. Both selects are dropped and
# both counts still arrive and are still formatted.
function-domain-insufficient-dimensions = Dimansyon domèn fonksyon-an pa asé. Domèn-an ni { $intervals } entèval mé fonksyon-an ni { $inputs } antré.

function-domain-invalid-format = Fòma domèn fonksyon-an pa valab.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Yo ka inyoré maksimòm fonksyon-an ki pa nimerik.
        [minimum] Yo ka inyoré minimòm fonksyon-an ki pa nimerik.
        [extremum] Yo ka inyoré ekstremòm fonksyon-an ki pa nimerik.
        [point] Yo ka inyoré pwen fonksyon-an ki pa nimerik.
        [slope] Yo ka inyoré pant fonksyon-an ki pa nimerik.
       *[other] Yo ka inyoré { $type } fonksyon-an ki pa nimerik.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Yo ka inyoré maksimòm fonksyon-an ki vid.
        [minimum] Yo ka inyoré minimòm fonksyon-an ki vid.
        [extremum] Yo ka inyoré ekstremòm fonksyon-an ki vid.
        [point] Yo ka inyoré pwen fonksyon-an ki vid.
       *[other] Yo ka inyoré { $type } fonksyon-an ki vid.
    }

function-points-too-close = Fonksyon-an ni dé pwen ki twòp pré roun a lòt. Pa pouvé défini fonksyon-an.

# Both selects dropped, for the reason above.
function-iterates-input-output-mismatch = Iterasyon fonksyon posib sèlman si kantité antré a fonksyon-an égal kantité sòti a-y. Fonksyon-an ni { $inputs } antré é { $outputs } sòti.

## `<sequence>`

sequence-invalid-length = Longè sekans-a pa valab.  I divèt sé roun antyé ki pa negatif.

sequence-invalid-step = Pa sekans-a pa valab.  I divèt sé roun nonm pou roun sekans tip { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" pa valab pou roun sekans nonm.  I divèt sé roun nonm.

sequence-invalid-endpoint-letters = "{ $attribute }" pa valab pou roun sekans lèt.  I divèt sé roun konbinezon lèt.

sequence-invalid-endpoint = "{ $attribute }" pa valab pou sekans-a.

select-from-sequence-coprime-not-numbers = yé ka inyoré coprime paske sé pa nonm yé ka chwazi

select-from-sequence-coprime-with-exclude-combinations = yé ka inyoré coprime paske excludeCombinations espesifyé

## Resolving a `target`

target-not-found = target pa valab pou `<{ $source }>`: pa pouvé trouvé target-a.

target-state-variable-not-found = target pa valab pou `<{ $source }>`: pa pouvé trouvé roun varyab déta ki rélé "{ $property }" asou roun `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Varyab `<odeSystem>` divèt diféran di varyab endepandan-an.

ode-system-duplicate-variable-names = Pa pouvé défini fonksyon RHS ODE épi non varyab dépandan ki répété.

ode-system-rhs-function-error = Pa pouvé défini fonksyon RHS ODE.  Erè annan kréyasyon fonksyon mathjs-a.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Pa pouvé défini roun ang ant { $count } liy

angle-invalid-through-point = Pwen ki pa valab annan through roun `<angle>`

parabola-vertex-too-many-points = Yo pòkò enplimanté roun parabòl ki ni roun somè é ki ka pasé an plis ki 1 pwen.

parabola-too-many-points = Yo pòkò enplimanté roun parabòl ki ka pasé an plis ki 3 pwen.

intersection-too-many-items = Yo pòkò enplimanté entèseksyon pou plis ki dé eleman

## Other math components

ionic-compound-not-two-ions = Yo pòkò enplimanté konpozé yonik pou dòt bagay ki dé yon.

ionic-compound-needs-cation-and-anion = Konpozé yonik enplimanté sèlman pou roun katyon é roun anyon.

solve-equations-cannot-evaluate = Pa pouvé rézoud ekwasyon-an paske yé pa pouvé evalyé-y: { $equation }

math-operators-operand-number-required = Ou divèt espesifyé roun operandNumber lò to ka ekstrè roun operand matématik.

eigen-decomposition-failed = Yo pa pouvé kalkilé valè pwòp a matris-a

## `<matchesPattern>`

# No select: the English branches differ only in the number of «paramèt», and
# the sentence is turned impersonal so that neither a singular nor a plural
# pronoun has to be chosen. The count still arrives.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: paramèt { $parameters } pa ka paret annan modèl-a, kidonk sa ké toujou koresponn épi roun blan.

## `<graph>`

graph-grid-invalid = `<graph>`: pa pouvé entèprété grid="{ $grid }". I divèt sé none, medium, dense, oben dé nonm pozitif separé pa roun espas, kon grid="1 0.5". Yo pa ka trasé pyès kadriyaj.

## `<slopeField>` and `<vectorField>`

# The `$expected` select is not a plural: the two branches are two different
# sentences about two different components. `$found` is turned impersonal so
# that no plural branch is needed for it.
field-function-wrong-num-outputs =
    `<{ $component }>` bizwen roun fonksyon ki ni { $expected ->
        [one] roun sèl sòti, pant y' an chak pwen, kon `y - x`
       *[other] dé sòti, vektè-a an chak pwen, kon `(y, -x)`
    }, mé fonksyon yé bay la ni { $found } sòti. { $alternative ->
        [none] Yo pa ka trasé arien.
       *[other] `<{ $alternative }>` sé konpozan-an pou fonksyon-an. Yo pa ka trasé arien.
    }

field-function-attribute-ignored-with-child = Yo ka inyoré atribi `function` paske fonksyon-an bay annan konpozan-an tou; sé sila ki annan-an yé ka pran. Bay fonksyon-an yon sèl fason.

field-variables-ignored =
    `<{ $component }>`: atribi `variables` ka rélé varyab a roun ekspresyon ki ekri dirèkteman annan konpozan-an. { $reason ->
        [function-child] Fonksyon-an la bay kon roun pitit `<function>`, ki ka rélé varyab a-y limenm, kidonk yé ka inyoré `variables`.
       *[no-expression] Pa ni roun ekspresyon kon sa la, kidonk yé ka inyoré `variables`.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" pa sipòté annan randè prefigure-a; yé ka sèvi épi konpòtman pozisyon dwat-a.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" pa sipòté annan randè prefigure-a; yé ka sèvi épi konpòtman pozisyon anlè-a.

prefigure-invalid-axis-bounds = `<graph>`: limit aks-a pa valab pou konvèsyon prefigure; yé ka sèvi épi bbox pa défo (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: lajè-a pa valab pou konvèsyon prefigure; yé ka sèvi épi lajè dyagram pa défo 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio pa valab pou konvèsyon prefigure; yé ka sèvi épi rapò aspè pa défo 1.

prefigure-grid-spacing-too-fine = `<graph>`: espasman kadriyaj-a twòp fen pou limit aks-a; yé ka kité kadriyaj-a déwò annan randè prefigure-a.

prefigure-annotations-not-rendered = `<graph>`: yé pa ké rann anotasyon lò yé pa ka sèvi épi randè PreFigure-a.

multiple-annotations-children = Yo trouvé plizyè pitit `<annotations>` annan `<graph>`; yé ka inyoré tout sof dènyé-a.

## Referring to other components

copy-unrecognized-component-type = Pa pouvé pwolonjé oben kopyé roun tip konpozan yé pa ka rekonèt: { $type }.

copy-prop-not-found = Yo pa pouvé trouvé prop { $property } asou roun konpozan tip { $component }

collect-no-source = Yo pa trouvé pyès sous pou collect.

collect-invalid-component-type = Pa pouvé kolekté konpozan tip `<{ $component }>` paske sé roun tip konpozan ki pa valab.

reference-index-unavailable = Pa pouvé référé a endis `{ $reference }`

## `<callAction>`

component-action-unavailable = Pa pouvé rélé { $action } asou konpozan `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Doné-a ni roun fòm ki pa valab.  Ranjé-a ni longè ki pa konsistan. Trouvé annan componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Doné-a ni non kolòn ki répété.  Trouvé annan componentIdx :{ $componentIdx }

data-frame-missing-column-name = Doné-a ka manké roun non kolòn.  Trouvé annan componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Roun award pou répons-a basé asou répons a tag répons-a limenm voyé, é sa ké mennen annan roun konpòtman to pa té ka atann.

answer-max-num-attempts-in-section-wide-check-work = Mèt `maxNumAttempts` asou roun `<answer>` annan roun kontenè ki ni `sectionWideCheckWork` pa ka fè arien, paske sé kontenè-a ki ka kontrolé kantité ésè. Mèt `maxNumAttempts` asou kontenè-a pito.

nested-section-wide-check-work-max-num-attempts = Mèt `maxNumAttempts` asou roun kontenè ki ni `sectionWideCheckWork` é ki annan roun dòt kontenè ki ni `sectionWideCheckWork` pa ka fè arien, paske sé kontenè déwò-a ki ka kontrolé kantité ésè. Mèt `maxNumAttempts` asou kontenè déwò-a pito.

# No select: «atribi» is invariant and «pa ké fè arien» agrees with nothing.
answer-attributes-need-symbolic-equality = Atribi { $attributes } pa ké fè arien san symbolicEquality mété.

answer-invalid-type = Tip pa valab pou répons-a: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Paske konpozan `<{ $component }>` pa ni roun non, yé pa pouvé sèvi épi-y pou roun atribi module

module-attribute-name-already-defined = Yo pa pouvé sèvi épi konpozan `<{ $component } name="{ $name }">` kon roun atribi pou roun module paske tip konpozan `<module>` ni roun atribi "{ $name }" ki ja défini.

conditional-content-condition-ignored = Yo ka inyoré atribi `condition` asou roun konpozan `<conditionalContent>` ki ni pitit case oben else.

slider-markers-type-mismatch = Tip makè-a pa ka koresponn épi tip slider-a.

pretzel-problem-needs-statement-and-answer = pretzel pa valab: chak `<problem>` divèt ni roun `<statement>` é roun `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel pa valab: an mode="circuit", prèmyé `<problem>`-la pa pouvé sé roun distraktè.

## Attribute values

# No select: «valè» is invariant, and «yé ka inyoré sa» is impersonal, so one
# string covers both English categories. The count still arrives.
attribute-invalid-values = Valè { $values } pa valab pou atribi `{ $attribute }`; yé ka inyoré sa.

attribute-must-be-references = Valè `{ $value }` pa valab pou atribi `{ $attribute }`. Atribi-a divèt fòmé épi référans ki ka koumansé épi roun `$`.

math-input-invalid-function-names = <mathInput>: yé ka inyoré non fonksyon ki pa valab annan { $attribute }: { $names }. Segman afichaj a chak non divèt ni omwen 2 karaktè (lèt oben tirè); roun sifiks `|<mathspeak alternative>` opsyonèl pouvé swiv.

## Building components from the source

component-type-invalid = Tip konpozan ki pa valab: `<{ $componentType }>`

attribute-repeated = Pa pouvé répété atribi { $attribute }.

attribute-invalid-for-component = Atribi "{ $attribute }" pa valab pou roun konpozan tip `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Définisyon stil { $styleNumber } pa ni asé kontras pou { $context ->
        [text-on-background] koulè tèks kont koulè fon
        [high-contrast] koulè gwo kontras kont kanva-a
        [line] koulè liy kont kanva-a
        [marker] koulè makè kont kanva-a
       *[text-on-canvas] koulè tèks kont kanva-a
    }{ $mode ->
        [dark] { " (mòd fè nwè)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; li ka mandé omwen { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Kwak définisyon stil { $styleNumber } espesifyé koulè ki ka bay asé kontras pou mòd klè, koulè mòd fè nwè-a ki sòti annan valè-a pa ni asé kontras pou koulè tèks kont koulè fon ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; li ka mandé omwen { $threshold }:1). { $suggestion ->
        [available] Pou asiré asé kontras an mòd fè nwè, to pouvé ogmanté kontras mòd klè-a (pa egzanp, mèt { $lightAttribute }="{ $lightColor }") oben ranplasé koulè mòd fè nwè-a (pa egzanp, mèt { $darkAttribute }="{ $darkColor }").
       *[none] Pou asiré asé kontras an mòd fè nwè, ogmanté kontras mòd klè-a oben ranplasé koulè ki sòti-a épi textColorDarkMode é/oben backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Kwak définisyon stil { $styleNumber } espesifyé roun koulè tèks ki ka bay asé kontras pou mòd klè, koulè tèks mòd fè nwè-a ki sòti annan valè-a pa ni asé kontras kont kanva-a ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; li ka mandé omwen { $threshold }:1). { $suggestion ->
        [available] Pou asiré asé kontras an mòd fè nwè, to pouvé ogmanté kontras mòd klè-a (pa egzanp, mèt textColor="{ $lightColor }") oben ranplasé koulè mòd fè nwè-a (pa egzanp, mèt textColorDarkMode="{ $darkColor }").
       *[none] Pou asiré asé kontras an mòd fè nwè, ogmanté kontras mòd klè-a oben ranplasé koulè ki sòti-a épi textColorDarkMode.
    }

section-multiple-style-palettes = Roun seksyon pouvé chwazi yon sèl <stylePalette>; yé ka sèvi épi dènyé-a.

## Unique variants

variant-num-to-select-not-non-negative-integer = pa pouvé détèrminé varyant inik a { $component } paske numToSelect pa roun antyé ki pa negatif.

variant-num-to-select-not-constant-number = pa pouvé détèrminé varyant inik a { $component } paske numToSelect pa roun nonm konstan.

variant-with-replacement-not-constant-boolean = pa pouvé détèrminé varyant inik a { $component } paske withReplacement pa roun boulean konstan.

variant-select-weight-disables-unique = Varyant inik pou select dezaktivé si ni roun opsyon ki ni selectWeight oben selectForVariants espesifyé

variant-coprime-undetermined = pa pouvé détèrminé varyant inik a { $component } paske yé pa pouvé détèrminé si coprime toujou fo.

variant-attribute-not-constant = pa pouvé détèrminé varyant inik a { $component } paske { $attribute } pa roun konstan.

variant-attribute-not-number = pa pouvé détèrminé varyant inik a { $component } paske { $attribute } pa roun nonm.

variant-attribute-wrong-type-for-sequence =
    pa pouvé détèrminé varyant inik a { $component } tip { $type } paske { $attribute } pa { $expected ->
        [letters-combination] roun konbinezon lèt
        [math-expression] roun ekspresyon matématik valab
        [integer] roun antyé
       *[number] roun nonm
    }.

variant-length-not-integer = pa pouvé détèrminé varyant inik a { $component } paske length pa roun antyé.

variant-sort-not-implemented = yé pòkò enplimanté varyant inik a roun { $component } épi sort

variant-exclude-combinations-not-implemented = yé pòkò enplimanté varyant inik a roun { $component } épi excludeCombinations

variant-math-exclude-not-implemented = yé pòkò enplimanté varyant inik a roun { $component } tip math épi exclude

variant-non-constant-exclude-not-implemented = yé pòkò enplimanté varyant inik a roun { $component } épi roun exclude ki pa konstan

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: pa sipòté annan randè prefigure a graph-a; yé ka soté désandan-an.

prefigure-descendant-invalid-geometry = { $subject }: jeyometri ki pa fini oben ki pa konplèt; yé ka soté désandan-an.

prefigure-curve-label-omitted = { $subject }: yé pa ka sipòté etikèt asou eleman koub ki konvèti; yé ka kité etikèt-a déwò.

prefigure-curve-unsupported-definition-type = { $subject }: tip definisyon fonksyon koub '{ $definitionType }' pa sipòté; yé ka soté désandan-an.

prefigure-region-flip-functions-unsupported = { $subject }: atribi flipFunctions pa sipòté asou regionBetweenCurves; yé ka soté désandan-an.

prefigure-region-non-formula-child = { $subject }: sé sèlman pitit fonksyon tip fòmil yé ka sipòté asou regionBetweenCurves; yé ka soté désandan-an.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' pa sipòté pou { $labelKind ->
        [line-family] roun etikèt fanmi liy
       *[point] roun etikèt pwen
    }; yé ka sèvi épi aliyman PreFigure pa défo.

prefigure-fill-style-unsupported = { $subject }: PreFigure pa ka sipòté stil ranpli '{ $fillStyle }'; yé ka tonbé asou roun ranpli plen.

prefigure-line-style-unknown = { $subject }: stil liy '{ $lineStyle }' yé pa konnèt kité déwò annan sòti PreFigure-a.

prefigure-marker-style-mapped-to-diamond = { $subject }: stil makè '{ $markerStyle }' ka koresponn épi stil PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: PreFigure pa ka sipòté stil makè '{ $markerStyle }'; yé ka sèvi épi stil pa défo.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` pa valab; pa pouvé rézoud sib-a. Yo ka kité anotasyon-an déwò.

annotation-ref-multiple-targets = `<annotation>`: `ref` rézoud asou plizyè sib; yé ka sèvi épi prèmyé sib-a.

annotation-ref-outside-graph = `<annotation>`: `ref` pa valab; sib-a déwò graph ki ka kontni-y la. Yo ka kité anotasyon-an déwò.

annotation-ref-unsupported-target = `<annotation>`: `ref` pa valab; sib-a pa roun objè grafik ki sipòté annan konvèsyon prefigure. Yo ka kité anotasyon-an déwò.

annotation-text-missing = `<annotation>`: `text` ka manké oben vid; yé ka bay roun tèks vid.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Yo détekté roun dépandans sikilè.
       *[other] Yo détekté roun dépandans sikilè ki ka enplitjé roun konpozan `<{ $componentType }>`.
    }

reference-no-referent = Yo pa trouvé pyès référan pou référans-a: `{ $reference }`

reference-multiple-referents = Yo trouvé plizyè référan pou référans-a: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Fòma pa valab pou atribi { $attribute } a roun `<{ $componentType }>`.

children-invalid = Pitit ki pa valab pou `<{ $componentType }>`: Yo trouvé pitit ki pa valab: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valè `{ $value }` pa valab pou atribi `{ $attribute }`, yé ka sèvi épi valè `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Yo pa trouvé vèsyon DoenetML { $version }.
       *[other] Yo pa trouvé vèsyon DoenetML { $version }. Yo ka tonbé asou vèsyon { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ki pa valab: { $content }

parse-tag-missing-close-tag = DoenetML ki pa valab: Tag `{ $tag }` pa ni tag fèmti. Yo té ka atann roun tag ki ka fèmé tèt a-y oben roun tag `</{ $tagName }>`.

parse-tag-error = DoenetML ki pa valab: Erè annan tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML ki pa valab: Atribi `{ $attribute }` ki pa valab ka sanb ka manké roun valè.

parse-attribute-invalid = DoenetML ki pa valab: Atribi `{ $attribute }` pa valab

parse-attribute-value-invalid = DoenetML ki pa valab: Valè atribi `{ $value }` pa valab

parse-attribute-value-quote-mismatch = DoenetML ki pa valab: Valè atribi `{ $value }` pa valab. Gimè-a pa ka koresponn. I ka sanb to ka manké roun `{ $quote }`

parse-open-tag-name-missing = DoenetML ki pa valab: Yo trouvé roun tag san non tag, pa egzanp `<`

parse-tag-not-closed = DoenetML ki pa valab: Tag `{ $tag }` pa té fèmé (li ka sanb roun `>` ka manké).

parse-self-closing-tag-name-missing = DoenetML ki pa valab: Yo trouvé roun tag san non tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ki pa valab: Tag `{ $tag }` pa té fèmé (li ka sanb `/>` ka manké).

parse-tag-invalid-attributes = DoenetML ki pa valab: Tag `{ $tag }` pa valab. I pouvé ni atribi ki pa kòrèk.

parse-close-tag-name-missing = DoenetML ki pa valab: Yo trouvé roun tag fèmti san non tag, pa egzanp `</`

parse-attribute-value-unquoted = Valè atribi divèt annan gimè: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ki pa valab: Yo trouvé tag fèmti `{ $tag }`, mé pa ni tag ouvèti ki ka koresponn

parse-close-tag-mismatched = DoenetML ki pa valab: Tag fèmti pa ka koresponn. Yo té ka atann `</{ $expected }>`. Yo trouvé `{ $found }`

parser-node-unconvertible = Yo pa pouvé konvèti nœud { $node } an nœud Dast.

## Names

name-attribute-invalid =
    Atribi name='{ $name }' pa valab. { $reason ->
        [characters] Non pouvé ni sèlman lèt, chif, tirè anba oben tirè.
       *[start] Non divèt koumansé épi roun lèt.
    }

component-name-invalid-start = Non konpozan "{ $name }" pa valab. Non divèt koumansé épi roun lèt.

## `<answer>` sugar

answer-video-watched-missing-video = Roun répons tip videoWatched divèt ni roun atribi video

answer-video-watched-video-not-reference = Roun répons tip videoWatched divèt ni roun atribi video ki sé roun référans

answer-name-not-single-text = Atribi name a roun répons divèt ni yon sèl pitit tèks

## Referencing another document

external-doenetml-recursion-limit = Yo pa pouvé jwenn DoenetML déwò-a paske ni twòp nivo rekisyon. Es ni roun référans sikilè?

external-doenetml-unavailable = Yo pa pouvé jwenn DoenetML annan { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML ki pa valab jwenn annan { $attribute }="{ $uri }": li pa té ka koresponn épi tip konpozan "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribi `{ $from }` démodé; sèvi épi `{ $to }` pito.
       *[other] [deprecation] Atribi `{ $from }` asou `<{ $component }>` démodé; sèvi épi `{ $to }` pito.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribi `{ $from }` démodé é yé ka inyoré-y paske `{ $to }` espesifyé tou.
       *[other] [deprecation] Atribi `{ $from }` asou `<{ $component }>` démodé é yé ka inyoré-y paske `{ $to }` espesifyé tou.
    }

deprecated-attribute-ignored = [deprecation] Atribi `{ $attribute }` asou `<{ $component }>` démodé é yé ka inyoré-y.

deprecated-attribute-to-child = [deprecation] Atribi `{ $attribute }` asou `<{ $component }>` démodé; sèvi épi roun pitit `<{ $child }>` pito.

deprecated-attribute-value-renamed = [deprecation] Valè `{ $value }` a atribi `{ $attribute }` asou `<{ $component }>` démodé; sèvi épi `{ $to }` pito.


## Language coverage

pluralize-english-only = `<pluralize>` pouvé mèt sèlman anglé an pliryèl, kidonk tèks a-y ka rété kon li yé annan roun dokiman ki ekri an { $locale }. Ekri fòm pliryèl-a dirèkteman, oben mèt li épi atribi `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Eleman `<{ $tag }>` pa roun eleman Doenet yé ka rekonèt.

schema-element-not-allowed-at-root = Eleman `<{ $tag }>` pa pèmèt an rasin dokiman-an.

schema-element-not-allowed-inside = Eleman `<{ $tag }>` pa pèmèt annan `<{ $parent }>`.

schema-attribute-unrecognized = Eleman `<{ $tag }>` pa ni roun atribi ki rélé `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribi `{ $attribute }` a eleman `<{ $tag }>` divèt sé roun lis koté chak atik sé roun annan: { $allowed }
       *[other] Atribi `{ $attribute }` a eleman `<{ $tag }>` divèt sé roun annan: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Non varyant pa valab pou select.  Non varyant { $variantName } ka paret annan { $numOptions } opsyon mé kantité pou chwazi sé { $numToSelect }.

select-variant-name-without-options = Kèk varyant espesifyé pou select mé pa ni pyès opsyon espesifyé pou non varyant posib: { $variantName }.

select-variant-name-not-possible = Non varyant { $variantName } ki espesifyé pou select pa roun non varyant posib.

select-too-few-options = Pa pouvé chwazi { $numToSelect } konpozan annan sèlman { $numOptions }.

select-from-sequence-too-few-values = Pa pouvé chwazi { $numToSelect } valè annan roun sekans longè { $length }.

select-from-sequence-indices-count-mismatch = Kantité endis espesifyé pou select divèt koresponn épi kantité pou chwazi

select-from-sequence-indices-not-integers = Tout endis espesifyé pou select divèt sé antyé

select-from-sequence-index-excluded = Endis selectfromsequence ki espesifyé-a té eskli

select-from-sequence-indices-excluded-combination = Endis selectfromsequence ki espesifyé-a té roun konbinezon eskli

select-from-sequence-coprime-not-positive-integers = Pa pouvé chwazi konbinezon koprim paske sé pa antyé pozitif yé ka chwazi.

select-from-sequence-coprime-common-factor = Pa pouvé chwazi nonm koprim. Tout valè posib-a ka pataj roun faktè komen. (Valè "from" oben "to" ki espesifyé divèt koprim épi "step".)

select-from-sequence-coprime-single-number = Pa pouvé chwazi konbinezon koprim annan yon sèl nonm ki pa 1.

select-from-sequence-excluded-too-many-combinations = Plis ki 70% a konbinezon-an eskli annan selectFromSequence

select-from-sequence-coprime-none-found = Yo pa pouvé chwazi nonm koprim. Tout valè posib-a ka pataj roun faktè komen.

select-from-sequence-too-few-unique-values = Pa pouvé chwazi { $numToSelect } valè inik annan roun sekans longè { $numPossibleValues }

select-prime-numbers-too-few-values = Pa pouvé chwazi { $numToSelect } valè annan roun lis nonm prèmyé longè { $numValues }

select-prime-numbers-values-count-mismatch = Kantité valè espesifyé pou select divèt koresponn épi kantité pou chwazi

select-prime-numbers-values-not-prime = Tout valè espesifyé pou select nonm prèmyé divèt annan lis nonm prèmyé-a

select-prime-numbers-values-excluded-combination = Valè selectPrimeNumbers ki espesifyé-a té roun konbinezon eskli

select-prime-numbers-excluded-too-many-combinations = Plis ki 70% a konbinezon-an eskli annan selectPrimeNumbers

select-random-combination-fluke = Pa roun chans estrèmman ra, yé pa pouvé chwazi roun konbinezon valè o aza

select-random-value-fluke = Pa roun chans estrèmman ra, yé pa pouvé chwazi roun valè o aza

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` pa trasé annan matématik-a; ekspresyon-an konpozé kon li té ye avan yé té pouvé mèt antré annan-y. { $reason ->
        [not-inline] Sé sèlman roun choice input `inline` ki ka rantré annan roun ekspresyon; san `inline` li sé roun blòk bouton.
        [expanded] Roun text input `expanded` sé roun bwèt plizyè liy, ki twòp gwo pou chita annan roun ekspresyon.
        [on-graph] Asou roun graph ekspresyon-an trasé kon yon sèl imaj, ki pa ni plas pou roun kontwòl.
       *[relative-width] `width` a-y relatif (roun pousantaj oben `em`), ki pa ni arien pou mizuré kont annan roun ekspresyon. Bay lajè-a an inité absoli, kon `px`, pito.
    }
