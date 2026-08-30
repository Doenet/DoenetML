# Yucatec Maya (Maayaʼ tʼàan) diagnostics: the errors and warnings the core,
# the parser and the schema checker report about a document, shown to whoever
# is looking at the screen. Translated from `locales/en/diagnostics.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Element names, attribute names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `WCAG AA` — are part of the language rather than prose
# and stay in English exactly as written, as does anything quoted back from the
# author's own source.
#
# **Orthography.** The ALMY/INALI unified orthography; see `chrome.ftl`'s
# header for the alphabet and the doubled long vowels. Every apostrophe inside
# a Maya word is **U+02BC MODIFIER LETTER APOSTROPHE `ʼ`**, never U+2019 `’`.
# The two are homoglyphs in most fonts, so a reviewer who retypes a word
# should check the codepoint rather than the shape. Straight ASCII `'` is
# English's own punctuation carried through where a message quotes a value
# back to the author, and is not a Maya letter. The
# language is named «Maayaʼ tʼàan»; the grave marks the falling tone and is not
# part of ordinary ALMY spelling («maayaʼ tʼaan»).
#
# **Number.** `Intl.PluralRules` has no CLDR data for `yua`, so it falls back
# to the default locale and reports `one` and `other` — categories Yucatec does
# not select. A Yucatec noun after a numeral takes no plural suffix, so every
# place English writes a `[one]`/`[other]` pair this file writes **one
# unselected form**. The selects that remain are on non-numeric variables —
# `$mode`, `$type`, `$reason`, `$expected`, `$component`, `$suggestion`,
# `$isList`, `$fallback`, `$labelKind`, `$componentType`, `$context` — and keep
# every branch English has.
#
# **Loans, and the frame around them.** Yucatec has an established written
# register in school, church and everyday use and no native software or
# mathematical register at all; the register a speaker actually uses for this
# material is Spanish. This file therefore writes the technical nouns as
# **Spanish loans adapted to the ALMY orthography**, inside an ordinary
# **Yucatec sentence frame**: native verbs, native word order, and the native
# negation «maʼ … -iʼ». The loans it carries are «atributo», «komponente»,
# «balor» (value), «referensia», «bariante», «punto», «línea», «bektor»,
# «sírkulo», «ángulo», «matrís», «funsión», «dominio», «intervalo»,
# «sekuensia», «índise», «parámetro», «dimensión», «ekuasión», «koordenada»,
# «kolor», «kontraste», «formato», «tipo», «entero» (integer), «número»,
# «elemento», «etiketa», «anotasión», «renglón» (row/line), «kolumna»,
# «bersión», «aksesibilidad». No affix is ever welded onto a `{ $variable }`:
# where a sentence needs one it falls on a word this catalog wrote, and the
# author's own word stands untouched inside its quotes.
#
# The frame is the honest part; the vocabulary is a loan register recorded as
# such. This is a usable seed, not yet Yucatec technical prose, and a speaker
# should overwrite it freely — starting, ideally, from an agreed term list
# rather than from these sentences.
#
# **Confidence.** Every message in the English catalog is translated here.
# «Síiʼpil» (fault, mistake) carries *error* throughout; «Maʼ beetaʼak» (it has
# not been made) carries English's "Haven't implemented"; «Maʼ táan u
# chʼaʼabal» (it is not taken) carries "ignoring". The `[deprecation]` marker
# is a literal and is left as it stands, as is `Invalid DoenetML: `'s structure
# — the words in front of the colon are translated, the colon and what follows
# are not.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = maʼ táan u chʼaʼabal { $attributes } le ken tsʼaʼabak kaʼapʼéel u xuulil puntoʼob

line-segment-attributes-ignored-with-endpoint-and-midpoint = maʼ táan u chʼaʼabal { $attributes } le ken tsʼaʼabak junpʼéel u xuulil punto yéetel junpʼéel u chúumukil punto

line-segment-midpoint-offset-without-midpoint = mix baʼal ku beetik midpointOffset wa minaʼan junpʼéel u chúumukil punto

## `<line>`

line-points-undetermined-dimensions = Línea ku máan tiʼ puntoʼob maʼ ojéelaʼan u dimensiónoʼobiʼ.

line-points-too-few-dimensions = Le líneaoʼ yaan u máan tiʼ puntoʼob yéetel kaʼapʼéel dimensión wa maas.

line-points-depend-on-variables = Le líneaoʼ ku máan tiʼ puntoʼob ku bin tu paach bariableʼob: { $variables }.

line-equation-invalid-format = Maʼ maʼalob u formatoil u ekuasiónil le línea tiʼ le bariableʼob { $variable1 } yéetel { $variable2 }.

## `<ray>`

ray-overprescribed-through = Le rayooʼ tsʼaʼabaltiʼ yéetel through, endpoint yéetel direction.  Maʼ táan u chʼaʼabal le through tsʼaʼabtiʼoʼ.

ray-dimension-mismatch = Maʼ tu núupul numDimensions ichil le rayooʼ.

## `<vector>`

vector-overprescribed-head = Le bektoroʼ tsʼaʼabaltiʼ yéetel head, tail yéetel displacement.  Maʼ táan u chʼaʼabal le head tsʼaʼabtiʼoʼ.

vector-dimension-mismatch = Maʼ tu núupul numDimensions ichil le bektoroʼ.

## Attracting and constraining

attract-to-without-nearest-point = Maʼ tu páajtal u yúuchul atraksión tiʼ junpʼéel `<{ $component }>` tumen minaʼantiʼ u bariable de estado nearestPoint.

constrain-to-without-nearest-point = Maʼ tu páajtal u kʼaʼalal tiʼ junpʼéel `<{ $component }>` tumen minaʼantiʼ u bariable de estado nearestPoint.

constrain-to-interior-without-nearest-point = Maʼ tu páajtal u kʼaʼalal tu taʼakʼanil junpʼéel `<{ $component }>` tumen minaʼantiʼ u bariable de estado nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = maʼ táan u chʼaʼabal labelPosition tiʼ junpʼéel choiceInput maʼ inline

## Ordering children by index

choice-input-indices-count-mismatch = Maʼ táan u chʼaʼabal le índiseʼob tsʼaʼaboʼob tiʼ choiceInput tumen maʼ tu núupul u yaʼabil índiseʼob yéetel u yaʼabil paalal choice.

pretzel-indices-count-mismatch = Maʼ táan u chʼaʼabal le índiseʼob tsʼaʼaboʼob tiʼ problem tumen maʼ tu núupul u yaʼabil índiseʼob yéetel u yaʼabil paalal problem.

shuffle-indices-count-mismatch = Maʼ táan u chʼaʼabal le índiseʼob tsʼaʼaboʼob tiʼ shuffle tumen maʼ tu núupul u yaʼabil índiseʼob yéetel u yaʼabil komponenteʼob.

indices-ignored-out-of-range = Maʼ táan u chʼaʼabal le índiseʼob tsʼaʼaboʼob tiʼ { $component } tumen yaan índiseʼob táanxel tiʼ le xúulaʼoʼ.

pretzel-indices-repeated = Maʼ táan u chʼaʼabal le índiseʼob tsʼaʼaboʼob tiʼ pretzel tumen yaan índiseʼob kaʼatéen tsʼíibtaʼan.

pretzel-circuit-first-index = Maʼ táan u chʼaʼabal le índiseʼob tsʼaʼaboʼob tiʼ pretzel tiʼ mode circuit tumen yáax índise yaan u yantal 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Utiaʼal u meyaj `<{ $component }>` yéetel paalal tʼaan, kʼaʼabéet u tsʼaʼabal junpʼéel atributo `type`.

invalid-type-defaulting-to-math = Maʼ maʼalob le tipo { $type } tiʼ le komponente { $component }. Yaan u yantal juntúul tiʼ math, text, number wa boolean. Ku pʼaʼatal bey math.

string-not-valid-component-to-arrange = Le tʼaan "{ $value }" maʼ junpʼéel komponente maʼalob utiaʼal { $component }. Maʼ táan u chʼaʼabaliʼ.

## Types and variables

invalid-type-defaulting-to-number = Maʼ maʼalob le tipo { $type }, ku pʼaʼatal bey number.

invalid-variable-value = Maʼ maʼalob u balor junpʼéel bariable: `{ $value }`

## Variants

variant-index-must-be-number = U índise le bariante { $index } yaan u yantal junpʼéel número

variant-index-must-be-integer = U índise le bariante { $index } yaan u yantal junpʼéel entero

## `<sideBySide>`

side-by-side-absolute-widths = Maʼ beetaʼak `<{ $component }>` yéetel pʼisibaʼal absoluto. Ku tsʼaʼabal le kóochil bey relatibo.

side-by-side-absolute-margins = Maʼ beetaʼak `<{ $component }>` yéetel pʼisibaʼal absoluto. Ku tsʼaʼabal le márgenoʼob bey relatibo.

side-by-side-no-block-child = Maʼ maʼalob le `<{ $component }>`: yaan u yantaltiʼ maanal junpʼéel paal bloke.

## `<label>`

label-for-ignored-on-graphical = Maʼ táan u chʼaʼabal le atributo `for` tiʼ junpʼéel `<label>` gráfiko.

label-for-must-resolve-to-one = Le atributo `for` tiʼ `<label>` yaan u kʼuchul chéen tiʼ junpʼéel komponente.

label-for-unresolved = Maʼ tu páajtal u kʼuchul le atributo `for` tiʼ `<label>` tiʼ junpʼéel komponente.

label-for-answer-with-authored-inputs = Le atributo `for` tiʼ `<label>` ku yaʼalik junpʼéel `<answer>` yaan u entradaʼob tsʼíibtaʼanoʼob tumen le máax tsʼíibtoʼ; aʼal le entrada toj beyoʼ.

label-for-answer-without-input = Le atributo `for` tiʼ `<label>` ku yaʼalik junpʼéel `<answer>` minaʼan u entrada utiaʼal u yetiketaʼal.

label-for-must-reference-input-or-answer = Le atributo `for` tiʼ `<label>` yaan u yaʼalik junpʼéel entrada wa junpʼéel answer.

## Accessibility

accessibility-short-description-or-decorative = Yóoʼolal aksesibilidad, `<{ $component }>` yaan u yantaltiʼ junpʼéel chan tsolil wa yaan u tsʼaʼabal bey chéen jatsʼutsil.

accessibility-video-short-description = Yóoʼolal aksesibilidad, `<video>` yaan u yantaltiʼ junpʼéel chan tsolil.

accessibility-input-short-description-or-label = Yóoʼolal aksesibilidad, `<{ $component }>` yaan u yantaltiʼ junpʼéel chan tsolil wa junpʼéel etiketa.

accessibility-answer-input-short-description-or-label = Yóoʼolal aksesibilidad, junpʼéel `<answer>` ku beetik junpʼéel entrada yaan u yantaltiʼ junpʼéel chan tsolil wa junpʼéel etiketa.

accessibility-short-description-contains-math = Le chan tsoliloʼob maʼ maʼalob ka yanak tiʼob komponenteʼob matemátiko jeʼex `<{ $component }>`. Tsʼíibt le matemátika yéetel tʼaanoʼob.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Maʼ chuka u kontraste { $colorName } utiaʼal u tʼaanil u pʼóolil le sekción (modo éekʼjochʼeʼen) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kʼaʼabéet maanal { $threshold }:1).
       *[other] Maʼ chuka u kontraste { $colorName } utiaʼal u tʼaanil u pʼóolil le sekción ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kʼaʼabéet maanal { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Maʼ beetaʼak `<circle>` ku máan tiʼ { $count } punto ken minaʼan u baloroʼob númeroil le puntoʼoboʼ.

circle-too-many-through-points = Maʼ tu páajtal u chʼaʼabal junpʼéel sírkulo ku máan tiʼ maanal 3 punto.

circle-overprescribed-radius-center-points = Maʼ tu páajtal u chʼaʼabal junpʼéel sírkulo yéetel radio, sentro yéetel puntoʼob ku máan tiʼob.

circle-center-with-multiple-points = Maʼ tu páajtal u chʼaʼabal junpʼéel sírkulo yéetel sentro ku máan tiʼ maanal 1 punto.

circle-radius-too-small = Maʼ tu páajtal u chʼaʼabal le sírkulo: le náachil ichil le kaʼapʼéel punto leti { $distance }, le beetikoʼ jach chichan le radio tsʼaʼab { $radius }.

circle-radius-with-many-points = Maʼ tu páajtal u beetaʼal junpʼéel sírkulo ku máan tiʼ maanal kaʼapʼéel punto yéetel junpʼéel radio tsʼaʼaban.

circle-invalid-center-or-through-points = Maʼ maʼalob u sentro wa u puntoʼob ku máan tiʼob le sírkulooʼ.

circle-radius-center-with-multiple-points = Maʼ tu páajtal u chʼaʼabal u radio junpʼéel sírkulo yéetel sentro ku máan tiʼ maanal 1 punto.

circle-change-radius-non-numerical = Maʼ tu páajtal u kʼeʼexel u radio junpʼéel sírkulo ku máan tiʼ puntoʼob minaʼan u baloroʼob númeroil

circle-radius-with-points-non-numerical = Maʼ tu páajtal u beetaʼal junpʼéel sírkulo ku máan tiʼ maanal junpʼéel punto yéetel junpʼéel radio tsʼaʼaban ken minaʼan u baloroʼob númeroil.

circle-change-center-non-numerical = Maʼ beetaʼak u kʼeʼexel u sentro junpʼéel sírkulo ku máan tiʼ puntoʼob minaʼan u baloroʼob númeroil.

## `<function>`

function-domain-insufficient-dimensions = Maʼ chuka u dimensiónoʼob u dominio le funsiónoʼ. Le dominiooʼ yaantiʼ { $intervals } intervalo baʼaleʼ le funsiónoʼ yaantiʼ { $inputs } entrada.

function-domain-invalid-format = Maʼ maʼalob u formatoil u dominio le funsiónoʼ.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Maʼ táan u chʼaʼabal u nojochil le funsión maʼ númeroiliʼ.
        [minimum] Maʼ táan u chʼaʼabal u chichanil le funsión maʼ númeroiliʼ.
        [extremum] Maʼ táan u chʼaʼabal u xuulil le funsión maʼ númeroiliʼ.
        [point] Maʼ táan u chʼaʼabal u punto le funsión maʼ númeroiliʼ.
        [slope] Maʼ táan u chʼaʼabal u pendiente le funsión maʼ númeroiliʼ.
       *[other] Maʼ táan u chʼaʼabal { $type } le funsión maʼ númeroiliʼ.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Maʼ táan u chʼaʼabal u nojochil le funsión tumen jóoyaʼaniʼ.
        [minimum] Maʼ táan u chʼaʼabal u chichanil le funsión tumen jóoyaʼaniʼ.
        [extremum] Maʼ táan u chʼaʼabal u xuulil le funsión tumen jóoyaʼaniʼ.
        [point] Maʼ táan u chʼaʼabal u punto le funsión tumen jóoyaʼaniʼ.
       *[other] Maʼ táan u chʼaʼabal { $type } le funsión tumen jóoyaʼaniʼ.
    }

function-points-too-close = Yaan kaʼapʼéel punto jach naatsʼ ichil le funsiónoʼ. Maʼ tu páajtal u tsʼaʼabal le funsiónoʼ.

function-iterates-input-output-mismatch = Chéen jeʼel u páajtal u yiterartaʼal junpʼéel funsión wa keet u yaʼabil u entradaʼob yéetel u yaʼabil u jóokʼsajiloʼob. Le funsión lelaʼ yaantiʼ { $inputs } entrada yéetel { $outputs } jóokʼsajil.

## `<sequence>`

sequence-invalid-length = Maʼ maʼalob u chowakil le sekuensiaoʼ.  Yaan u yantal junpʼéel entero maʼ chan tiʼ nadaiʼ.

sequence-invalid-step = Maʼ maʼalob u xáak le sekuensiaoʼ.  Yaan u yantal junpʼéel número tiʼ junpʼéel sekuensia tipo { $type }.

sequence-invalid-endpoint-number = Maʼ maʼalob "{ $attribute }" tiʼ junpʼéel sekuensia number.  Yaan u yantal junpʼéel número.

sequence-invalid-endpoint-letters = Maʼ maʼalob "{ $attribute }" tiʼ junpʼéel sekuensia letters.  Yaan u yantal junpʼéel múuchʼ tsʼíiboʼob.

sequence-invalid-endpoint = Maʼ maʼalob "{ $attribute }" tiʼ le sekuensiaoʼ.

select-from-sequence-coprime-not-numbers = maʼ táan u chʼaʼabal coprime tumen maʼ táan u yéeyaʼal númeroʼob

select-from-sequence-coprime-with-exclude-combinations = maʼ táan u chʼaʼabal coprime tumen tsʼaʼab excludeCombinations

## Resolving a `target`

target-not-found = Maʼ maʼalob u target `<{ $source }>`: maʼ tu páajtal u kaxtaʼal le target.

target-state-variable-not-found = Maʼ maʼalob u target `<{ $source }>`: maʼ tu páajtal u kaxtaʼal junpʼéel bariable de estado u kʼaabaʼ "{ $property }" tiʼ junpʼéel `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = U bariableʼob `<odeSystem>` yaan u jelaʼantaloʼob tiʼ le bariable independiente.

ode-system-duplicate-variable-names = Maʼ tu páajtal u tsʼaʼabal funsiónoʼob RHS tiʼ ODE yéetel kʼaabaʼob bariable dependiente kaʼatéen tsʼíibtaʼan.

ode-system-rhs-function-error = Maʼ tu páajtal u tsʼaʼabal le funsión RHS tiʼ ODE.  Yaan síiʼpil ku beetaʼal le funsión mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Maʼ tu páajtal u tsʼaʼabal junpʼéel ángulo ichil { $count } línea

angle-invalid-through-point = Maʼ maʼalob le punto tiʼ u through le `<angle>`

parabola-vertex-too-many-points = Maʼ beetaʼak junpʼéel parábola yéetel bértise ku máan tiʼ maanal 1 punto.

parabola-too-many-points = Maʼ beetaʼak junpʼéel parábola ku máan tiʼ maanal 3 punto.

intersection-too-many-items = Maʼ beetaʼak u yúuchul interseksión yéetel maanal kaʼapʼéel baʼal

## Other math components

ionic-compound-not-two-ions = Maʼ beetaʼak junpʼéel kompuesto iónico yéetel uláakʼ baʼal chéen kaʼapʼéel ion.

ionic-compound-needs-cation-and-anion = Chéen beetaʼab le kompuesto iónico yéetel junpʼéel katión yéetel junpʼéel anión.

solve-equations-cannot-evaluate = Maʼ tu páajtal u chʼaʼabal le ekuasión tumen maʼ tu páajtal u yeʼebeʼeltaʼal: { $equation }

math-operators-operand-number-required = Kʼaʼabéet u tsʼaʼabal junpʼéel operandNumber ken jóoʼsaʼak junpʼéel operando matemátiko.

eigen-decomposition-failed = Maʼ tu páajtal u chʼaʼabal u eigenvaloroʼob le matríseʼ

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: le parámetro { $parameters } maʼ ku yúuchul tiʼ le patrón, le beetikoʼ mantatsʼ yaan u núupul yéetel junpʼéel jóoyaʼan.

## `<graph>`

graph-grid-invalid = `<graph>`: maʼ tu páajtal u naʼataʼal grid="{ $grid }". Yaan u yantal none, medium, dense, wa kaʼapʼéel número maas tiʼ nada tsʼíibtaʼan yéetel junpʼéel jóoyaʼan ichiloʼob, jeʼex grid="1 0.5". Maʼ táan u tsʼíibtaʼal mix junpʼéel rejilla.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` kʼaʼabéettiʼ junpʼéel funsión yéetel { $expected ->
        [one] junpʼéel jóokʼsajil, u pendiente y' tiʼ jujunpʼéel punto, jeʼex `y - x`
       *[other] kaʼapʼéel jóokʼsajil, u bektor tiʼ jujunpʼéel punto, jeʼex `(y, -x)`
    }, baʼaleʼ le funsión tsʼaʼabtiʼoʼ yaantiʼ { $found } jóokʼsajil. { $alternative ->
        [none] Maʼ táan u tsʼíibtaʼal mix baʼal.
       *[other] `<{ $alternative }>` leti le komponente utiaʼal le funsión lelaʼ. Maʼ táan u tsʼíibtaʼal mix baʼal.
    }

field-function-attribute-ignored-with-child = Maʼ táan u chʼaʼabal le atributo `function` tumen tsʼaʼab xan le funsión ichil le komponente; leti le yaan ichiloʼ ku meyaj. Tsʼáa le funsión chéen tiʼ junpʼéel tiʼ le kaʼapʼéel bejoʼ.

field-variables-ignored =
    `<{ $component }>`: le atributo `variables` ku kʼaabaʼtik u bariableʼob junpʼéel ekspresión tsʼíibtaʼan toj ichil le komponente. { $reason ->
        [function-child] Way tuʼuxaʼ tsʼaʼab le funsión bey junpʼéel paal `<function>`, ku kʼaabaʼtik u bariableʼob tu juunal, le beetikoʼ maʼ táan u chʼaʼabal `variables`.
       *[no-expression] Minaʼan junpʼéel ekspresión beyoʼ way tuʼuxaʼ, le beetikoʼ maʼ táan u chʼaʼabal `variables`.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: maʼ ku chʼaʼabal xLabelPosition="left" tiʼ le renderisador prefigure; ku meyaj bey right.

prefigure-y-label-position-unsupported = `<graph>`: maʼ ku chʼaʼabal yLabelPosition="bottom" tiʼ le renderisador prefigure; ku meyaj bey top.

prefigure-invalid-axis-bounds = `<graph>`: maʼ maʼalob u xuuloʼob le ejeʼob utiaʼal u kʼeʼexel tiʼ prefigure; ku chʼaʼabal le bbox chéen beyoʼ (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: maʼ maʼalob u kóochil utiaʼal u kʼeʼexel tiʼ prefigure; ku chʼaʼabal u kóochil diagrama chéen beyoʼ 425.

prefigure-invalid-aspect-ratio = `<graph>`: maʼ maʼalob aspectRatio utiaʼal u kʼeʼexel tiʼ prefigure; ku chʼaʼabal u aspect ratio chéen beyoʼ 1.

prefigure-grid-spacing-too-fine = `<graph>`: jach chichan u náachil le rejilla utiaʼal u xuuloʼob le ejeʼob; maʼ táan u tsʼíibtaʼal le rejilla tiʼ le renderisador prefigure.

prefigure-annotations-not-rendered = `<graph>`: maʼ táan u tsʼíibtaʼal le anotasiónoʼob wa maʼ táan u meyaj le renderisador PreFigure.

multiple-annotations-children = Kaxtaʼab yaʼabkach paalal `<annotations>` ichil `<graph>`; chéen le tsʼook ku chʼaʼabaloʼ.

## Referring to other components

copy-unrecognized-component-type = Maʼ tu páajtal u yaʼalaʼal wa u kopiartaʼal junpʼéel tipo komponente maʼ kʼaj óolaʼaniʼ: { $type }.

copy-prop-not-found = Maʼ tu páajtal u kaxtaʼal le prop { $property } tiʼ junpʼéel komponente tipo { $component }

collect-no-source = Maʼ kaxtaʼab tuʼux u taal collect.

collect-invalid-component-type = Maʼ tu páajtal u muchʼkíinsaʼal komponenteʼob tipo `<{ $component }>` tumen maʼ maʼalob le tipo komponenteoʼ.

reference-index-unavailable = Maʼ tu páajtal u yaʼalaʼal le índise `{ $reference }`

## `<callAction>`

component-action-unavailable = Maʼ tu páajtal u tʼaʼanal { $action } tiʼ le komponente `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Maʼ maʼalob u boonil le datoʼoboʼ.  Maʼ keet u chowakil le renglónoʼob. Kaxtaʼab tiʼ componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Yaan kʼaabaʼob kolumna kaʼatéen tsʼíibtaʼan.  Kaxtaʼab tiʼ componentIdx :{ $componentIdx }

data-frame-missing-column-name = Minaʼan u kʼaabaʼ junpʼéel kolumna.  Kaxtaʼab tiʼ componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Junpʼéel award tiʼ le answer lelaʼ ku bin tu paach u núuk tuʼuxaʼ le answer tu juunal, yéetel lelaʼ jeʼel u beetik baʼax maʼ paʼatbil.

answer-max-num-attempts-in-section-wide-check-work = Mix baʼal ku beetik u tsʼaʼabal `maxNumAttempts` tiʼ junpʼéel `<answer>` ichil junpʼéel kontenedor yéetel `sectionWideCheckWork`, tumen le kontenedoroʼ ku kanáantik u yaʼabil téenel. Tsʼáa `maxNumAttempts` tiʼ le kontenedoroʼ.

nested-section-wide-check-work-max-num-attempts = Mix baʼal ku beetik u tsʼaʼabal `maxNumAttempts` tiʼ junpʼéel kontenedor yéetel `sectionWideCheckWork` yaan ichil uláakʼ kontenedor yéetel `sectionWideCheckWork`, tumen le kontenedor yaan tu paachoʼ ku kanáantik u yaʼabil téenel. Tsʼáa `maxNumAttempts` tiʼ le kontenedor yaan tu paachoʼ.

answer-attributes-need-symbolic-equality = Mix baʼal ku beetik le atributo { $attributes } wa maʼ tsʼaʼaban symbolicEquality.

answer-invalid-type = Maʼ maʼalob u tipo le answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Tumen minaʼan u kʼaabaʼ le komponente `<{ $component }>`, maʼ tu páajtal u meyaj bey junpʼéel atributo tiʼ junpʼéel module

module-attribute-name-already-defined = Maʼ tu páajtal u meyaj le komponente `<{ $component } name="{ $name }">` bey junpʼéel atributo tiʼ junpʼéel module tumen le tipo komponente `<module>` yaan tsʼoʼok u yantaltiʼ junpʼéel atributo "{ $name }".

conditional-content-condition-ignored = Maʼ táan u chʼaʼabal le atributo `condition` tiʼ junpʼéel komponente `<conditionalContent>` yaan paalal case wa else.

slider-markers-type-mismatch = Maʼ tu núupul u tipo le markers yéetel u tipo le slider.

pretzel-problem-needs-statement-and-answer = Maʼ maʼalob le pretzel: jujunpʼéel `<problem>` yaan u yantaltiʼ junpʼéel `<statement>` yéetel junpʼéel `<answer>`.

pretzel-circuit-first-problem-distractor = Maʼ maʼalob le pretzel: tiʼ mode="circuit", le yáax `<problem>` maʼ tu páajtal u yantal bey distraktoriʼ.

## Attribute values

attribute-invalid-values = Maʼ maʼalob u balor { $values } tiʼ le atributo `{ $attribute }`; maʼ táan u chʼaʼabaliʼ.

attribute-must-be-references = Maʼ maʼalob u balor `{ $value }` tiʼ le atributo `{ $attribute }`. Le atributooʼ yaan u beetaʼal yéetel referensiaʼob ku káajal yéetel junpʼéel `$`.

math-input-invalid-function-names = <mathInput>: maʼ táan u chʼaʼabal u kʼaabaʼob funsión maʼ maʼalob tiʼ { $attribute }: { $names }. U jaatsil eʼesajil jujunpʼéel kʼaabaʼ yaan u yantaltiʼ maanal 2 tsʼíib (letraʼob wa guiónoʼob); jeʼel u páajtal u taal junpʼéel `|<mathspeak alternative>` tu paach.

## Building components from the source

component-type-invalid = Maʼ maʼalob u tipo le komponente: `<{ $componentType }>`

attribute-repeated = Maʼ tu páajtal u kaʼa tsʼíibtaʼal le atributo { $attribute }.

attribute-invalid-for-component = Maʼ maʼalob le atributo "{ $attribute }" tiʼ junpʼéel komponente tipo `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Maʼ chuka u kontraste u definisión estilo { $styleNumber } tiʼ { $context ->
        [text-on-background] u kolor le tʼaan yéetel u kolor le fondo
        [high-contrast] u kolor kontraste kaʼanal yéetel le kanchaoʼ
        [line] u kolor le línea yéetel le kanchaoʼ
        [marker] u kolor le markador yéetel le kanchaoʼ
       *[text-on-canvas] u kolor le tʼaan yéetel le kanchaoʼ
    }{ $mode ->
        [dark] { " (modo éekʼjochʼeʼen)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kʼaʼabéet maanal { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Kex tsʼaʼaban tiʼ u definisión estilo { $styleNumber } koloroʼob yaan u chuka kontraste tiʼ modo sáasil, le koloroʼob tiʼ modo éekʼjochʼeʼen ku jóokʼloʼob tiʼ le baloroʼob lelaʼ maʼ chuka u kontraste ichil u kolor le tʼaan yéetel u kolor le fondo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kʼaʼabéet maanal { $threshold }:1). { $suggestion ->
        [available] Utiaʼal u yantal chuka kontraste tiʼ modo éekʼjochʼeʼen, nuʼukbes u kontraste modo sáasil (jeʼex, tsʼáa { $lightAttribute }="{ $lightColor }") wa kʼex u kolor modo éekʼjochʼeʼen (jeʼex, tsʼáa { $darkAttribute }="{ $darkColor }").
       *[none] Utiaʼal u yantal chuka kontraste tiʼ modo éekʼjochʼeʼen, nuʼukbes u kontraste modo sáasil wa kʼex le koloroʼob jóokʼoʼob yéetel textColorDarkMode wa backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Kex tsʼaʼaban tiʼ u definisión estilo { $styleNumber } junpʼéel kolor tʼaan yaan u chuka kontraste tiʼ modo sáasil, le kolor tʼaan tiʼ modo éekʼjochʼeʼen ku jóokʼol tiʼ le balor lelaʼ maʼ chuka u kontraste yéetel le kanchaoʼ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kʼaʼabéet maanal { $threshold }:1). { $suggestion ->
        [available] Utiaʼal u yantal chuka kontraste tiʼ modo éekʼjochʼeʼen, nuʼukbes u kontraste modo sáasil (jeʼex, tsʼáa textColor="{ $lightColor }") wa kʼex u kolor modo éekʼjochʼeʼen (jeʼex, tsʼáa textColorDarkMode="{ $darkColor }").
       *[none] Utiaʼal u yantal chuka kontraste tiʼ modo éekʼjochʼeʼen, nuʼukbes u kontraste modo sáasil wa kʼex le kolor jóokʼoʼ yéetel textColorDarkMode.
    }

section-multiple-style-palettes = Junpʼéel sekción chéen jeʼel u yéeyik junpʼéel <stylePalette>; ku chʼaʼabal le tsʼookoʼ.

## Unique variants

variant-num-to-select-not-non-negative-integer = maʼ tu páajtal u yojéeltaʼal u bariante juntúulili tiʼ { $component } tumen numToSelect maʼ junpʼéel entero maʼ chan tiʼ nadaiʼ.

variant-num-to-select-not-constant-number = maʼ tu páajtal u yojéeltaʼal u bariante juntúulili tiʼ { $component } tumen numToSelect maʼ junpʼéel número maʼ tu kʼeʼexeliʼ.

variant-with-replacement-not-constant-boolean = maʼ tu páajtal u yojéeltaʼal u bariante juntúulili tiʼ { $component } tumen withReplacement maʼ junpʼéel boolean maʼ tu kʼeʼexeliʼ.

variant-select-weight-disables-unique = Maʼ tu páajtal u bariante juntúulili tiʼ select wa yaan junpʼéel opsión yéetel selectWeight wa selectForVariants tsʼaʼaban

variant-coprime-undetermined = maʼ tu páajtal u yojéeltaʼal u bariante juntúulili tiʼ { $component } tumen maʼ tu páajtal u yojéeltaʼal wa mantatsʼ maʼ jaaj coprime.

variant-attribute-not-constant = maʼ tu páajtal u yojéeltaʼal u bariante juntúulili tiʼ { $component } tumen { $attribute } ku kʼeʼexel.

variant-attribute-not-number = maʼ tu páajtal u yojéeltaʼal u bariante juntúulili tiʼ { $component } tumen maʼ junpʼéel número { $attribute }.

variant-attribute-wrong-type-for-sequence =
    maʼ tu páajtal u yojéeltaʼal u bariante juntúulili tiʼ { $component } tipo { $type } tumen { $attribute } maʼ { $expected ->
        [letters-combination] junpʼéel múuchʼ letraʼobiʼ
        [math-expression] junpʼéel ekspresión matemátika maʼalobiʼ
        [integer] junpʼéel enteroiʼ
       *[number] junpʼéel númeroiʼ
    }.

variant-length-not-integer = maʼ tu páajtal u yojéeltaʼal u bariante juntúulili tiʼ { $component } tumen maʼ junpʼéel entero le chowakiloʼ.

variant-sort-not-implemented = maʼ beetaʼak u bariante juntúulili junpʼéel { $component } yéetel sort

variant-exclude-combinations-not-implemented = maʼ beetaʼak u bariante juntúulili junpʼéel { $component } yéetel excludeCombinations

variant-math-exclude-not-implemented = maʼ beetaʼak u bariante juntúulili junpʼéel { $component } tipo math yéetel exclude

variant-non-constant-exclude-not-implemented = maʼ beetaʼak u bariante juntúulili junpʼéel { $component } yéetel junpʼéel exclude ku kʼeʼexel

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: maʼ ku chʼaʼabal tiʼ le renderisador prefigure tiʼ graph; ku pʼaʼatal tu paach le paaloʼ.

prefigure-descendant-invalid-geometry = { $subject }: u jeometría maʼ chuka wa maʼ xuulaʼaniʼ; ku pʼaʼatal tu paach le paaloʼ.

prefigure-curve-label-omitted = { $subject }: maʼ ku chʼaʼabal etiketaʼob tiʼ elementoʼob kurba kʼeʼexoʼob; maʼ táan u tsʼíibtaʼal le etiketaoʼ.

prefigure-curve-unsupported-definition-type = { $subject }: maʼ ku chʼaʼabal le tipo definisión funsión kurba '{ $definitionType }'; ku pʼaʼatal tu paach le paaloʼ.

prefigure-region-flip-functions-unsupported = { $subject }: maʼ ku chʼaʼabal le atributo flipFunctions tiʼ regionBetweenCurves; ku pʼaʼatal tu paach le paaloʼ.

prefigure-region-non-formula-child = { $subject }: chéen ku chʼaʼabal paalal funsión tipo formula tiʼ regionBetweenCurves; ku pʼaʼatal tu paach le paaloʼ.

prefigure-label-position-unsupported =
    { $subject }: maʼ ku chʼaʼabal labelPosition '{ $labelPosition }' tiʼ { $labelKind ->
        [line-family] junpʼéel etiketa tiʼ u chʼiʼibal línea
       *[point] junpʼéel etiketa punto
    }; ku chʼaʼabal u nuʼukbesajil PreFigure chéen beyoʼ.

prefigure-fill-style-unsupported = { $subject }: maʼ ku chʼaʼabal u estilo chup '{ $fillStyle }' tumen PreFigure; ku pʼaʼatal yéetel junpʼéel chup chuka.

prefigure-line-style-unknown = { $subject }: maʼ kʼaj óolaʼan u estilo línea '{ $lineStyle }'; maʼ táan u bin tiʼ u jóokʼsajil PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: u estilo markador '{ $markerStyle }' ku kʼeʼexel tiʼ u estilo PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: maʼ ku chʼaʼabal u estilo markador '{ $markerStyle }' tumen PreFigure; ku chʼaʼabal le estilo chéen beyoʼ.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: maʼ maʼalob `ref`; maʼ tu páajtal u kaxtaʼal le target. Maʼ táan u tsʼíibtaʼal le anotasiónoʼ.

annotation-ref-multiple-targets = `<annotation>`: yaʼabach target ku kʼuchul tiʼob `ref`; ku chʼaʼabal le yáax targetoʼ.

annotation-ref-outside-graph = `<annotation>`: maʼ maʼalob `ref`; táanxel tiʼ le graph yaan le targetoʼ. Maʼ táan u tsʼíibtaʼal le anotasiónoʼ.

annotation-ref-unsupported-target = `<annotation>`: maʼ maʼalob `ref`; le targetoʼ maʼ junpʼéel baʼal gráfiko ku chʼaʼabal tiʼ u kʼeʼexel prefigure. Maʼ táan u tsʼíibtaʼal le anotasiónoʼ.

annotation-text-missing = `<annotation>`: minaʼan wa jóoyaʼan `text`; ku jóokʼol jóoyaʼan le tʼaanoʼ.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Kaxtaʼab junpʼéel dependensia sirkular.
       *[other] Kaxtaʼab junpʼéel dependensia sirkular yéetel junpʼéel komponente `<{ $componentType }>`.
    }

reference-no-referent = Maʼ kaxtaʼab baʼax ku yaʼalik le referensiaaʼ: `{ $reference }`

reference-multiple-referents = Yaʼabach baʼax ku yaʼalik le referensiaaʼ: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Maʼ maʼalob u formatoil le atributo { $attribute } tiʼ `<{ $componentType }>`.

children-invalid = Maʼ maʼalob u paalal `<{ $componentType }>`: Kaxtaʼab paalal maʼ maʼalobiʼ: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Maʼ maʼalob u balor `{ $value }` tiʼ le atributo `{ $attribute }`, ku chʼaʼabal u balor `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Maʼ kaxtaʼab u bersión DoenetML { $version }.
       *[other] Maʼ kaxtaʼab u bersión DoenetML { $version }. Ku pʼaʼatal yéetel u bersión { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Maʼ maʼalob le DoenetML: { $content }

parse-tag-missing-close-tag = Maʼ maʼalob le DoenetML: Minaʼan u etiketa kʼaal le etiketa `{ $tag }`. Kʼaʼabéet junpʼéel etiketa ku kʼaʼalal tu juunal wa junpʼéel etiketa `</{ $tagName }>`.

parse-tag-error = Maʼ maʼalob le DoenetML: Yaan síiʼpil tiʼ le etiketa `<{ $tagName }>`

parse-attribute-missing-value = Maʼ maʼalob le DoenetML: Bey minaʼan u balor le atributo `{ $attribute }`.

parse-attribute-invalid = Maʼ maʼalob le DoenetML: Maʼ maʼalob le atributo `{ $attribute }`

parse-attribute-value-invalid = Maʼ maʼalob le DoenetML: Maʼ maʼalob u balor atributo `{ $value }`

parse-attribute-value-quote-mismatch = Maʼ maʼalob le DoenetML: Maʼ maʼalob u balor atributo `{ $value }`. Maʼ tu núupul le kʼóomoʼob tsʼíib. Bey minaʼan tech junpʼéel `{ $quote }`

parse-open-tag-name-missing = Maʼ maʼalob le DoenetML: Kaxtaʼab junpʼéel etiketa minaʼan u kʼaabaʼ, jeʼex `<`

parse-tag-not-closed = Maʼ maʼalob le DoenetML: Maʼ kʼaʼalab le etiketa `{ $tag }` (bey minaʼan junpʼéel `>`).

parse-self-closing-tag-name-missing = Maʼ maʼalob le DoenetML: Kaxtaʼab junpʼéel etiketa minaʼan u kʼaabaʼ `<{ $content }>`

parse-self-closing-tag-not-closed = Maʼ maʼalob le DoenetML: Maʼ kʼaʼalab le etiketa `{ $tag }` (bey minaʼan `/>`).

parse-tag-invalid-attributes = Maʼ maʼalob le DoenetML: Maʼ maʼalob le etiketa `{ $tag }`. Jeʼel u yantaltiʼ atributoʼob maʼ maʼalobiʼ.

parse-close-tag-name-missing = Maʼ maʼalob le DoenetML: Kaxtaʼab junpʼéel etiketa kʼaal minaʼan u kʼaabaʼ, jeʼex `</`

parse-attribute-value-unquoted = U baloroʼob le atributoʼob yaan u yantaloʼob ichil kʼóomoʼob tsʼíib: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Maʼ maʼalob le DoenetML: Kaxtaʼab le etiketa kʼaal `{ $tag }`, baʼaleʼ minaʼan u etiketa jeʼeb

parse-close-tag-mismatched = Maʼ maʼalob le DoenetML: Maʼ tu núupul le etiketa kʼaaloʼ. Kʼaʼabéet `</{ $expected }>`. Kaxtaʼab `{ $found }`

parser-node-unconvertible = Maʼ tu páajtal u kʼeʼexel le nodo { $node } tiʼ junpʼéel nodo Dast.

## Names

name-attribute-invalid =
    Maʼ maʼalob le atributo name='{ $name }'. { $reason ->
        [characters] Le kʼaabaʼoboʼ chéen jeʼel u yantaltiʼob letraʼob, númeroʼob, guión bajo wa guión.
       *[start] Le kʼaabaʼoboʼ yaan u káajaloʼob yéetel junpʼéel letra.
    }

component-name-invalid-start = Maʼ maʼalob u kʼaabaʼ le komponente "{ $name }". Le kʼaabaʼoboʼ yaan u káajaloʼob yéetel junpʼéel letra.

## `<answer>` sugar

answer-video-watched-missing-video = Junpʼéel answer tipo videoWatched yaan u yantaltiʼ junpʼéel atributo video

answer-video-watched-video-not-reference = Junpʼéel answer tipo videoWatched yaan u yantaltiʼ junpʼéel atributo video ku yantal bey junpʼéel referensia

answer-name-not-single-text = U atributo name le answer yaan u yantaltiʼ chéen junpʼéel paal text

## Referencing another document

external-doenetml-recursion-limit = Maʼ tu páajtal u chʼaʼabal le DoenetML táanxeloʼ tumen jach yaʼab u jaatsil rekursión. ¿Yaan wáaj junpʼéel referensia sirkular?

external-doenetml-unavailable = Maʼ tu páajtal u chʼaʼabal le DoenetML tiʼ { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Maʼ maʼalob le DoenetML chʼaʼab tiʼ { $attribute }="{ $uri }": maʼ tu núupul yéetel u tipo komponente "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Tsʼoʼok u xuʼulul u meyaj le atributo `{ $from }`; meyajnaj yéetel `{ $to }`.
       *[other] [deprecation] Tsʼoʼok u xuʼulul u meyaj le atributo `{ $from }` tiʼ `<{ $component }>`; meyajnaj yéetel `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Tsʼoʼok u xuʼulul u meyaj le atributo `{ $from }` yéetel maʼ táan u chʼaʼabal tumen tsʼaʼab xan `{ $to }`.
       *[other] [deprecation] Tsʼoʼok u xuʼulul u meyaj le atributo `{ $from }` tiʼ `<{ $component }>` yéetel maʼ táan u chʼaʼabal tumen tsʼaʼab xan `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Tsʼoʼok u xuʼulul u meyaj le atributo `{ $attribute }` tiʼ `<{ $component }>` yéetel maʼ táan u chʼaʼabaliʼ.

deprecated-attribute-to-child = [deprecation] Tsʼoʼok u xuʼulul u meyaj le atributo `{ $attribute }` tiʼ `<{ $component }>`; meyajnaj yéetel junpʼéel paal `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Tsʼoʼok u xuʼulul u meyaj u balor `{ $value }` tiʼ le atributo `{ $attribute }` tiʼ `<{ $component }>`; meyajnaj yéetel `{ $to }`.


## Language coverage

pluralize-english-only = Chéen jeʼel u páajtal u beetik pluralʼob tiʼ inglés `<pluralize>`, le beetikoʼ maʼ táan u kʼeʼexel u tʼaanil tiʼ junpʼéel dokumento tsʼíibtaʼan tiʼ { $locale }. Tsʼíibt le forma plural toj beyoʼ, wa tsʼáa yéetel le atributo `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Le elemento `<{ $tag }>` maʼ junpʼéel elemento kʼaj óolaʼan tumen Doenetiʼ.

schema-element-not-allowed-at-root = Maʼ tu chaʼabal le elemento `<{ $tag }>` tu motsil le dokumentoiʼ.

schema-element-not-allowed-inside = Maʼ tu chaʼabal le elemento `<{ $tag }>` ichil `<{ $parent }>`.

schema-attribute-unrecognized = Minaʼantiʼ le elemento `<{ $tag }>` junpʼéel atributo u kʼaabaʼ `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Le atributo `{ $attribute }` tiʼ le elemento `<{ $tag }>` yaan u yantal junpʼéel lista tuʼux jujunpʼéel u jaatsil yaan u yantal juntúul tiʼ lelaʼ: { $allowed }
       *[other] Le atributo `{ $attribute }` tiʼ le elemento `<{ $tag }>` yaan u yantal juntúul tiʼ lelaʼ: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Maʼ maʼalob u kʼaabaʼ bariante tiʼ select.  Le kʼaabaʼ bariante { $variantName } ku yúuchul tiʼ { $numOptions } opsión baʼaleʼ u yaʼabil ken yéeyaʼak leti { $numToSelect }.

select-variant-name-without-options = Tsʼaʼab jujuntúul bariante tiʼ select baʼaleʼ maʼ tsʼaʼab opsiónoʼob tiʼ le kʼaabaʼ bariante: { $variantName }.

select-variant-name-not-possible = Le kʼaabaʼ bariante { $variantName } tsʼaʼab tiʼ select maʼ jeʼel u páajtal u yantaliʼ.

select-too-few-options = Maʼ tu páajtal u yéeyaʼal { $numToSelect } komponente tiʼ chéen { $numOptions }.

select-from-sequence-too-few-values = Maʼ tu páajtal u yéeyaʼal { $numToSelect } balor tiʼ junpʼéel sekuensia u chowakil { $length }.

select-from-sequence-indices-count-mismatch = U yaʼabil índiseʼob tsʼaʼaboʼob tiʼ select yaan u núupul yéetel u yaʼabil ken yéeyaʼak

select-from-sequence-indices-not-integers = Tuláakal le índiseʼob tsʼaʼaboʼob tiʼ select yaan u yantaloʼob bey enteroʼob

select-from-sequence-index-excluded = Tsʼaʼab junpʼéel índise tiʼ selectfromsequence jóoʼsaʼanili

select-from-sequence-indices-excluded-combination = Tsʼaʼab índiseʼob tiʼ selectfromsequence junpʼéel múuchʼ jóoʼsaʼanili

select-from-sequence-coprime-not-positive-integers = Maʼ tu páajtal u yéeyaʼal múuchʼoʼob coprime tumen maʼ táan u yéeyaʼal enteroʼob maas tiʼ nada.

select-from-sequence-coprime-common-factor = Maʼ tu páajtal u yéeyaʼal númeroʼob coprime. Tuláakal le baloroʼob jeʼel u páajtaloʼ yaantiʼob junpʼéel faktor keet. (U baloroʼob "from" wa "to" tsʼaʼaboʼob yaan u yantaloʼob coprime yéetel "step".)

select-from-sequence-coprime-single-number = Maʼ tu páajtal u yéeyaʼal múuchʼoʼob coprime tiʼ junpʼéel número tu juunal maʼ 1.

select-from-sequence-excluded-too-many-combinations = Jóoʼsaʼab maanal 70% tiʼ le múuchʼoʼob tiʼ selectFromSequence

select-from-sequence-coprime-none-found = Maʼ tu páajtal u yéeyaʼal númeroʼob coprime. Tuláakal le baloroʼob jeʼel u páajtaloʼ yaantiʼob junpʼéel faktor keet.

select-from-sequence-too-few-unique-values = Maʼ tu páajtal u yéeyaʼal { $numToSelect } balor juntúulili tiʼ junpʼéel sekuensia u chowakil { $numPossibleValues }

select-prime-numbers-too-few-values = Maʼ tu páajtal u yéeyaʼal { $numToSelect } balor tiʼ junpʼéel lista númeroʼob primo u chowakil { $numValues }

select-prime-numbers-values-count-mismatch = U yaʼabil baloroʼob tsʼaʼaboʼob tiʼ select yaan u núupul yéetel u yaʼabil ken yéeyaʼak

select-prime-numbers-values-not-prime = Tuláakal le baloroʼob tsʼaʼaboʼob tiʼ select prime number yaan u yantaloʼob ichil le lista númeroʼob primo

select-prime-numbers-values-excluded-combination = Le baloroʼob tsʼaʼaboʼob tiʼ selectPrimeNumbers junpʼéel múuchʼ jóoʼsaʼanili

select-prime-numbers-excluded-too-many-combinations = Jóoʼsaʼab maanal 70% tiʼ le múuchʼoʼob tiʼ selectPrimeNumbers

select-random-combination-fluke = Tumen junpʼéel baʼal jach maʼ suuk u yúuchul, maʼ tu páajtal u yéeyaʼal junpʼéel múuchʼ baloroʼob chʼaʼabil

select-random-value-fluke = Tumen junpʼéel baʼal jach maʼ suuk u yúuchul, maʼ tu páajtal u yéeyaʼal junpʼéel balor chʼaʼabil

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    Maʼ táan u tsʼíibtaʼal `<{ $component }>` ichil le matemátikaoʼ; ku tsʼíibtaʼal le ekspresión jeʼex úuchik ka maʼ tu páajtal u tsʼaʼabal entradaʼob ichiloʼ. { $reason ->
        [not-inline] Chéen junpʼéel choice input `inline` ku kʼuchul ichil junpʼéel ekspresión; wa minaʼan `inline` junpʼéel bloke botónoʼob leti.
        [expanded] Junpʼéel text input `expanded` junpʼéel kaja yaʼab u renglónoʼob, jach nojoch utiaʼal u kutal ichil junpʼéel ekspresión.
        [on-graph] Tiʼ junpʼéel graph ku tsʼíibtaʼal le ekspresión bey chéen junpʼéel oochel, minaʼan tuʼux u kutal junpʼéel kontrol.
       *[relative-width] U `width` relatibo (junpʼéel porsentaje wa `em`), minaʼan baʼax u pʼis ichil junpʼéel ekspresión. Tsʼáa u kóochil yéetel pʼisibaʼal absoluto, jeʼex `px`.
    }
