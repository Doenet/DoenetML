# Romani (Romani čhib) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **`rom` is a macrolanguage tag** covering Vlax, Balkan, Carpathian, Sinte,
# Kalo and more, and those varieties differ in lexicon and in inflection.
# **The written norm here is closest to Vlax Romani**, the variety the
# international standardisation work was built around. Do not use `rmy` for a
# Vlax deployment: it canonicalises to `rom` and would collide with this
# catalog.
#
# **Script and orthography.** Latin script, in the **standardised international
# Romani orthography in the Hancock line** — the practical alphabet of the
# Romani Union's 1990 resolution as Ian Hancock writes it: `č š ž`, the
# aspirates `čh ph th kh`, `x` for the velar fricative, `ř` for the uvular
# rhotic. **Courthiade's morpho-graphs (`θ ç q ǰ`) are deliberately not used**,
# because they encode a morphophonemic alternation rather than a sound and are
# unfamiliar to most Romani readers. See `chrome.ftl` for the full note.
#
# **What is the language's own**: «si» / «naj» for the copula, «na» for the
# negator, «našti» for *cannot*, «trubul» for *must*, «šaj» for *may*, «thaj»
# for *and*, «vaj» for *or*, «te» for *if*, «kaj» for *because/that*,
# «khanči» for *nothing*, «nisavo» for *no/none*, «doš» for *error*, «anav»
# for *name*, «gin» for *count*, «kotor** for *part*, «pučipe» for *question*,
# «bi-» as the privative prefix that carries English's *in-* / *un-*.
#
# **What is borrowed, and from where**: every mathematical and computing noun
# — «komponento», «atributo», «variabla», «intervalo», «matrica», «funkcia»,
# «sekvencia», «koordinata» — is international Latin-Romance stock, which is
# the register the Romani Union's standard and Romani-language teaching
# material use for technical vocabulary. Romani has no mathematical register
# of its own and this seed does not pretend otherwise. That is the weakest part
# of the catalog and where a reviewer should start; after that, the passive
# constructions in the long sentences, which Romani forms with «-il-» /
# «-inel» and which are easy to get subtly wrong in writing.
#
# **Counts.** CLDR has **no plural data for `rom` at all**, so no plural
# category can be selected here. This file writes **no** `[zero]`, `[two]`,
# `[few]` or `[many]` branch anywhere, and the English singular/plural splits
# are collapsed into one form — `line-segment-attributes-ignored-*`,
# `matches-pattern-parameter-not-in-pattern`, `attribute-invalid-values`,
# `answer-attributes-need-symbolic-equality`, the two `function-*` counts.
# Romani would really distinguish these (it marks number and gender richly),
# so the loss is CLDR's silence rather than the language's. The **one**
# `[one]` branch that is kept is in `field-function-wrong-num-outputs`, on
# `$expected`: that selector is not a plural at all but a two-way choice
# between two different components — a slope field wants one output, a vector
# field two — and the branches say different things rather than the same thing
# in two numbers. Dropping it would lose the message.
#
# **Digits.** Every number renders in Latin digits, so the digits written into
# prose here are Latin digits too.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `styleNumber`,
# `selectFromSequence`, `<answer>`, `maxNumAttempts`, `sectionWideCheckWork` —
# are part of the language, not prose, and stay in English exactly as written.
# So does anything quoted back from the author's own source, and so do
# `WCAG AA`, `DoenetML`, `PreFigure`, `prefigure`, `XML`, `mathjs` and `Dast`,
# which are names. Every **symbolic** selector — `$type`, `$mode`, `$reason`,
# `$context`, `$suggestion`, `$alternative`, `$fallback`, `$expected`,
# `$labelKind`, `$isList`, `$componentType` — is kept byte for byte from
# English, keys included.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } či lel pes ande gindo kana duj agorutne punktura si dine

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } či lel pes ande gindo kana jekh agorutno punkto thaj jekh maškarutno punkto si dine solduj

line-segment-midpoint-offset-without-midpoint = midpointOffset naj les nisavo efekto bi maškarutne punktosko

## `<line>`

line-points-undetermined-dimensions = Linia maškar punktura bi dinade dimensiengo.

line-points-too-few-dimensions = E linia trubul te žal maškar punktura kaj si le maj xancines duj dimensie.

line-points-depend-on-variables = E linia žal maškar punktura kaj inkren pes pe variable: { $variables }.

line-equation-invalid-format = Bičačo formato vaš e ekvacia la liniaki ande le variable { $variable1 } thaj { $variable2 }.

## `<ray>`

ray-overprescribed-through = E raza si dinadi le through, endpoint thaj direction.  O dino through či lel pes ande gindo.

ray-dimension-mismatch = numDimensions či malavel pes ande raza.

## `<vector>`

vector-overprescribed-head = O vektoro si dinado le head, tail thaj displacement.  O dino head či lel pes ande gindo.

vector-dimension-mismatch = numDimensions či malavel pes ando vektoro.

## Attracting and constraining

attract-to-without-nearest-point = Našti cirdel pes karing jekh `<{ $component }>`, kaj les naj nearestPoint-variabla.

constrain-to-without-nearest-point = Našti phandel pes pe jekh `<{ $component }>`, kaj les naj nearestPoint-variabla.

constrain-to-interior-without-nearest-point = Našti phandel pes pe o andrunipe le `<{ $component }>`-esko, kaj les naj nearestPoint-variabla.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition či lel pes ande gindo pe jekh choiceInput kaj naj inline

## Ordering children by index

choice-input-indices-count-mismatch = Le indeksura vaš choiceInput či len pes ande gindo, kaj o gin le indeksengo či malavel pes le ginesa le alosarimaske čhavengo.

pretzel-indices-count-mismatch = Le indeksura vaš problem či len pes ande gindo, kaj o gin le indeksengo či malavel pes le ginesa le problem-čhavengo.

shuffle-indices-count-mismatch = Le indeksura vaš shuffle či len pes ande gindo, kaj o gin le indeksengo či malavel pes le ginesa le komponenturengo.

indices-ignored-out-of-range = Le indeksura vaš { $component } či len pes ande gindo, kaj varesave indeksura si avri anda o regiono.

pretzel-indices-repeated = Le indeksura vaš pretzel či len pes ande gindo, kaj varesave indeksura si duvar.

pretzel-circuit-first-index = Le indeksura vaš pretzel ando circuit-modo či len pes ande gindo, kaj o angluno indekso trubul te avel 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Te kerel `<{ $component }>` buti le stringoske čhavenca, trubul te avel dino jekh `type`-atributo.

invalid-type-defaulting-to-math = Bičačo type { $type } vaš o komponento { $component }. Trubul te avel jekh anda math, text, number vaj boolean. Lel pes math.

string-not-valid-component-to-arrange = O stringo "{ $value }" naj čačo komponento vaš { $component }. Či lel pes ande gindo.

## Types and variables

invalid-type-defaulting-to-number = Bičačo type { $type }, o tipo thol pes pe number.

invalid-variable-value = Bičačo valoro jekha variablako: `{ $value }`

## Variants

variant-index-must-be-number = O variantako indekso { $index } trubul te avel jekh numero

variant-index-must-be-integer = O variantako indekso { $index } trubul te avel jekh interi numero

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` naj kerdo vaš absoluto mesuripe. E buxlipe thol pes pe relativo.

side-by-side-absolute-margins = `<{ $component }>` naj kerdo vaš absoluto mesuripe. Le margine thon pes pe relativo.

side-by-side-no-block-child = Bičačo `<{ $component }>`: trubul te avel les maj xancines jekh bloko-čhavo.

## `<label>`

label-for-ignored-on-graphical = O `for`-atributo pe jekh grafiko `<label>` či lel pes ande gindo.

label-for-must-resolve-to-one = O `for`-atributo pe jekh `<label>` trubul te del čačes jekh komponento.

label-for-unresolved = O `for`-atributo pe jekh `<label>` našti sas dinado pe jekh komponento.

label-for-answer-with-authored-inputs = O `for`-atributo pe jekh `<label>` sikavel pe jekh `<answer>` kaj si les intradura ramome anda o autoro; sikav direkt pe o intrado.

label-for-answer-without-input = O `for`-atributo pe jekh `<label>` sikavel pe jekh `<answer>` bi intradosko te etiketil.

label-for-must-reference-input-or-answer = O `for`-atributo pe jekh `<label>` trubul te sikavel pe jekh intrado vaj pe jekh answer.

## Accessibility

accessibility-short-description-or-decorative = Vaš o resipe, `<{ $component }>` trubul vaj te avel les jekh skurto opisipe vaj te avel dino sar dekorativno.

accessibility-video-short-description = Vaš o resipe, `<video>` trubul te avel les jekh skurto opisipe.

accessibility-input-short-description-or-label = Vaš o resipe, `<{ $component }>` trubul te avel les jekh skurto opisipe vaj jekh etiketa.

accessibility-answer-input-short-description-or-label = Vaš o resipe, jekh `<answer>` kaj kerel jekh intrado trubul te avel les jekh skurto opisipe vaj jekh etiketa.

accessibility-short-description-contains-math = Skurte opisimata či trubun te aven len matematikake komponentura sar `<{ $component }>`. Ramosar e matematika lavenca.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } si les xancino kontrasto vaš o teksto le sekciake anavesko (kalo modo) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; trubul maj xancines { $threshold }:1).
       *[other] { $colorName } si les xancino kontrasto vaš o teksto le sekciake anavesko ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; trubul maj xancines { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Jekh `<circle>` maškar { $count } punktura naj kerdo vaš o kazo kana le punkturen naj len numerikane valorura.

circle-too-many-through-points = Jekh krugo maškar maj but sar 3 punktura našti gindil pes.

circle-overprescribed-radius-center-points = Jekh krugo dine radiusosa, maškarutne punktosa thaj nakhavne punkturenca našti gindil pes.

circle-center-with-multiple-points = Jekh krugo dine maškarutne punktosa maškar maj but sar 1 punkto našti gindil pes.

circle-radius-too-small = O krugo našti gindil pes: kaj o dur maškar le duj punktura si { $distance }, o dino radiuso { $radius } si prea cikno.

circle-radius-with-many-points = Jekh krugo maškar maj but sar duj punktura dine radiusosa našti kerel pes.

circle-invalid-center-or-through-points = Bičačo maškarutno punkto vaj bičače nakhavne punktura le krugoske.

circle-radius-center-with-multiple-points = O radiuso jekhe krugosko dine maškarutne punktosa maškar maj but sar 1 punkto našti gindil pes.

circle-change-radius-non-numerical = O radiuso jekhe krugosko binumerikane nakhavne punkturenca našti paruvel pes

circle-radius-with-points-non-numerical = Jekh krugo maškar maj but sar jekh punkto dine radiusosa našti kerel pes, kana naj numerikane valorura.

circle-change-center-non-numerical = O paruvipe le maškarutne punktosko jekhe krugosko maškar punktura bi numerikane valorengo naj kerdo.

## `<function>`

# CLDR has no plural rules for `rom`, so the two counts read with one form.
function-domain-insufficient-dimensions = Xancine dimensie vaš o domeno la funkciako. O domeno si les { $intervals } intervalura, numa la funkcia si la { $inputs } intradura.

function-domain-invalid-format = Bičačo formato vaš o domeno la funkciako.

function-ignoring-non-numerical =
    { $type ->
        [maximum] O binumerikano maksimumo la funkciako či lel pes ande gindo.
        [minimum] O binumerikano minimumo la funkciako či lel pes ande gindo.
        [extremum] O binumerikano ekstremumo la funkciako či lel pes ande gindo.
        [point] O binumerikano punkto la funkciako či lel pes ande gindo.
        [slope] E binumerikani panta la funkciaki či lel pes ande gindo.
       *[other] O binumerikano { $type } la funkciako či lel pes ande gindo.
    }

function-ignoring-empty =
    { $type ->
        [maximum] O šušo maksimumo la funkciako či lel pes ande gindo.
        [minimum] O šušo minimumo la funkciako či lel pes ande gindo.
        [extremum] O šušo ekstremumo la funkciako či lel pes ande gindo.
        [point] O šušo punkto la funkciako či lel pes ande gindo.
       *[other] O šušo { $type } la funkciako či lel pes ande gindo.
    }

function-points-too-close = La funkcia si la duj punktura kaj si prea paše jekh avresko. E funkcia našti dinadel pes.

# One form for both counts: CLDR has no plural rules for `rom`.
function-iterates-input-output-mismatch = Iteracie jekha funkciake si šaj numa kana o gin le intradurengo si sar o gin le ikalimatango. Kadala funkcia si la { $inputs } intradura thaj { $outputs } ikalimata.

## `<sequence>`

sequence-invalid-length = Bičači lungimos la sekvenciaki.  Trubul te avel jekh binegativo interi numero.

sequence-invalid-step = Bičačo stepo la sekvenciako.  Trubul te avel jekh numero vaš jekh sekvencia le tiposki { $type }.

sequence-invalid-endpoint-number = Bičačo "{ $attribute }" jekha numerikane sekvenciako.  Trubul te avel jekh numero.

sequence-invalid-endpoint-letters = Bičačo "{ $attribute }" jekha lilvarne sekvenciako.  Trubul te avel jekh kombinacia lilvarengi.

sequence-invalid-endpoint = Bičačo "{ $attribute }" la sekvenciako.

select-from-sequence-coprime-not-numbers = coprime či lel pes ande gindo, kaj či alosaren pes numerura

select-from-sequence-coprime-with-exclude-combinations = coprime či lel pes ande gindo, kaj excludeCombinations si dino

## Resolving a `target`

target-not-found = Bičačo target vaš `<{ $source }>`: o mišto našti arakhel pes.

target-state-variable-not-found = Bičačo target vaš `<{ $source }>`: naj nisavi variabla le anavesa "{ $property }" pe jekh `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Le variable jekhe `<odeSystem>`-esko trubun te aven aver sar e bikorkorutni variabla.

ode-system-duplicate-variable-names = ODE-RHS-funkcie duvarutne anavenca le inkerde variablengo našti dinaden pes.

ode-system-rhs-function-error = E ODE-RHS-funkcia našti dinadel pes.  Doš kana kerdilo o mathjs-funkcia.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Jekh unghi maškar { $count } linie našti dinadel pes

angle-invalid-through-point = Bičačo punkto ando through jekhe `<angle>`-esko

parabola-vertex-too-many-points = Jekh parabola vertexosa maškar maj but sar 1 punkto naj kerdi.

parabola-too-many-points = Jekh parabola maškar maj but sar 3 punktura naj kerdi.

intersection-too-many-items = O maškarnakhipe maj but sar duje elementengo naj kerdo

## Other math components

ionic-compound-not-two-ions = Ioniko kombinacie aver sar duje ionenca naj kerde.

ionic-compound-needs-cation-and-anion = E ioniko kombinacia si kerdi numa vaš jekh kationo thaj jekh aniono.

solve-equations-cannot-evaluate = E ekvacia našti rezolvil pes, kaj naštisas te dinadel pes: { $equation }

math-operators-operand-number-required = Trubul te avel dino jekh operandNumber kana ikalel pes jekh matematikano operando.

eigen-decomposition-failed = Le eigenvalorura la matricake naštisas te gindin pes

## `<matchesPattern>`

# One form for the count: CLDR has no plural rules for `rom`.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: { $parameters } či avel ando modelo, anda kodo malavela pes sagda jekhe šuše thanesa.

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" našti haljarel pes. Trubul te avel none, medium, dense vaj duj pozitivne numerura ulavde jekhe šuše thanesa, sar grid="1 0.5". Nisavo grilo či cirdel pes.

## `<slopeField>` and `<vectorField>`

# The `$expected` branch is kept even though CLDR has no plural rules for
# `rom`: it is not a plural but a two-way choice between two components — a
# slope field wants one output, a vector field two — and the two branches say
# different things. The `$found` count, which is a real plural, reads with one
# form.
field-function-wrong-num-outputs =
    `<{ $component }>` trubul jekha funkcia { $expected ->
        [one] jekhe ikalimasa, e panta y' pe svako punkto, sar `y - x`
       *[other] duje ikalimatanca, o vektoro pe svako punkto, sar `(y, -x)`
    }, numa e dini funkcia si la { $found } ikalimata. { $alternative ->
        [none] Khanči či cirdel pes.
       *[other] `<{ $alternative }>` si o komponento vaš kadala funkcia. Khanči či cirdel pes.
    }

field-function-attribute-ignored-with-child = O `function`-atributo či lel pes ande gindo, kaj e funkcia si dini vi ando komponento; lel pes kodoja anda leste. De e funkcia numa jekhe dromesa anda le duj.

field-variables-ignored =
    `<{ $component }>`: o `variables`-atributo akharel le variable jekha ekspresiake kaj si ramome direkt ando komponento. { $reason ->
        [function-child] E funkcia si kathe dini sar `<function>`-čhavo, kaj akharel pehke variable, anda kodo `variables` či lel pes ande gindo.
       *[no-expression] Naj kathe nisavi kadaja ekspresia, anda kodo `variables` či lel pes ande gindo.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" naj inkerdo ando prefigure-renderer; lel pes o kerdipe la čačune pozicako.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" naj inkerdo ando prefigure-renderer; lel pes o kerdipe la opruna pozicako.

prefigure-invalid-axis-bounds = `<graph>`: bičače agora le axengo vaš o prefigure-paruvipe; lel pes o standardno bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: bičači buxlipe vaš o prefigure-paruvipe; lel pes e standardno buxlipe le diagramoski 425.

prefigure-invalid-aspect-ratio = `<graph>`: bičačo aspectRatio vaš o prefigure-paruvipe; lel pes o standardno proporciono 1.

prefigure-grid-spacing-too-fine = `<graph>`: o than maškar le griloske linie si prea sano vaš le agora le axengo; o grilo mukhel pes avri ando prefigure-renderer.

prefigure-annotations-not-rendered = `<graph>`: le notice či sikaven pes kana či lel pes o PreFigure-renderer.

multiple-annotations-children = But `<annotations>`-čhave arakhadile ando `<graph>`; sa avri katar o palutno či len pes ande gindo.

## Referring to other components

copy-unrecognized-component-type = Jekh biprindžardo tipo komponentosko našti buxlarel pes vaj kopiril pes: { $type }.

copy-prop-not-found = O prop { $property } či arakhadilo pe jekh komponento le tiposko { $component }

collect-no-source = Nisavo xaning či arakhadilo vaš collect.

collect-invalid-component-type = Komponentura le tiposko `<{ $component }>` našti kiden pes, kaj kadava naj čačo tipo komponentosko.

reference-index-unavailable = O indekso `{ $reference }` našti referil pes

## `<callAction>`

component-action-unavailable = { $action } našti akharel pes pe o komponento `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Le data si len bičači forma.  Le randura si len bijekhutne lungimata. Arakhado ando componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Le data si len duvarutne anava le kolonengo.  Arakhado ando componentIdx :{ $componentIdx }

data-frame-missing-column-name = Le datenge falil jekh anav kolonako.  Arakhado ando componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Jekh award kadale phendimasko inkrel pes pe o korkorutno bičhaldo phendipe le answer-tagosko, so ledžala ka biažukardo kerdipe.

answer-max-num-attempts-in-section-wide-check-work = Te thoves `maxNumAttempts` pe jekh `<answer>` ande jekh inkeripe le `sectionWideCheckWork`-osa naj les nisavo efekto, kaj o gin le zumavimatango inkerel pes anda o inkeripe. Thov `maxNumAttempts` pe o inkeripe.

nested-section-wide-check-work-max-num-attempts = Te thoves `maxNumAttempts` pe jekh inkeripe le `sectionWideCheckWork`-osa kaj si ande aver inkeripe le `sectionWideCheckWork`-osa naj les nisavo efekto, kaj o gin le zumavimatango inkerel pes anda o avrutno inkeripe. Thov `maxNumAttempts` pe o avrutno inkeripe.

# One form for the count: CLDR has no plural rules for `rom`.
answer-attributes-need-symbolic-equality = { $attributes } naj les nisavo efekto bi symbolicEquality thodino.

answer-invalid-type = Bičačo tipo vaš o phendipe: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Kaj o komponento `<{ $component }>` naj les anav, našti lel pes vaš jekh atributo modulosko

module-attribute-name-already-defined = O komponento `<{ $component } name="{ $name }">` našti lel pes sar atributo vaš jekh modulo, kaj o tipo komponentosko `<module>` si les već jekh atributo "{ $name }".

conditional-content-condition-ignored = O atributo `condition` či lel pes ande gindo pe jekh `<conditionalContent>` le case- vaj else-čhavenca.

slider-markers-type-mismatch = O tipo le markerengo či malavel pes le tiposa le slideresko.

pretzel-problem-needs-statement-and-answer = Bičačo pretzel: svako `<problem>` trubul te avel les jekh `<statement>` thaj jekh `<answer>`.

pretzel-circuit-first-problem-distractor = Bičačo pretzel: ande mode="circuit" o angluno `<problem>` našti avel distraktoro.

## Attribute values

# One form for the count: CLDR has no plural rules for `rom`.
attribute-invalid-values = Bičačo valoro { $values } vaš o atributo `{ $attribute }`; či lel pes ande gindo.

attribute-must-be-references = Bičačo valoro `{ $value }` vaš o atributo `{ $attribute }`. O atributo trubul te avel kerdo anda referense kaj počinen jekhe `$`-esa.

math-input-invalid-function-names = <mathInput>: bičače anava le funkciengo ande { $attribute } či line pes ande gindo: { $names }. Svako anav trubul te avel les ando sikado kotor maj xancines 2 semnura (lilvara vaj linie); šaj avel palal jekh `|<mathspeak alternative>`-kotor.

## Building components from the source

component-type-invalid = Bičačo tipo komponentosko: `<{ $componentType }>`

attribute-repeated = O atributo { $attribute } našti phenel pes duvar.

attribute-invalid-for-component = Bičačo atributo "{ $attribute }" vaš jekh komponento le tiposko `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    E stiloski definicia { $styleNumber } si la xancino kontrasto vaš { $context ->
        [text-on-background] e farba le tekstoski karing e farba le fundoski
        [high-contrast] e farba baro kontrastosa karing o than le cirdimasko
        [line] e farba la liniaki karing o than le cirdimasko
        [marker] e farba le markeroski karing o than le cirdimasko
       *[text-on-canvas] e farba le tekstoski karing o than le cirdimasko
    }{ $mode ->
        [dark] { " (kalo modo)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; trubul maj xancines { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Vi te si la stiloska definiciake { $styleNumber } farbe kaj den dosta kontrasto ando parno modo, le farbe vaš o kalo modo kaj aven anda lende si len xancino kontrasto la farbake le tekstoski karing e farba le fundoski ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; trubul maj xancines { $threshold }:1). { $suggestion ->
        [available] Vaš dosta kontrasto ando kalo modo, vaj bararel o kontrasto ando parno modo (sar { $lightAttribute }="{ $lightColor }") vaj ramosar opral e farba vaš o kalo modo (sar { $darkAttribute }="{ $darkColor }").
       *[none] Vaš dosta kontrasto ando kalo modo, bararel o kontrasto ando parno modo vaj ramosar opral le farbe le textColorDarkMode thaj/vaj backgroundColorDarkMode-osa.
    }

style-definition-dark-mode-text-canvas-contrast =
    Vi te si la stiloska definiciake { $styleNumber } jekh farba le tekstoski kaj del dosta kontrasto ando parno modo, e farba le tekstoski vaš o kalo modo kaj avel anda late si la xancino kontrasto karing o than le cirdimasko ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; trubul maj xancines { $threshold }:1). { $suggestion ->
        [available] Vaš dosta kontrasto ando kalo modo, vaj bararel o kontrasto ando parno modo (sar textColor="{ $lightColor }") vaj ramosar opral e farba vaš o kalo modo (sar textColorDarkMode="{ $darkColor }").
       *[none] Vaš dosta kontrasto ando kalo modo, bararel o kontrasto ando parno modo vaj ramosar opral e farba le textColorDarkMode-osa.
    }

section-multiple-style-palettes = Jekh sekcia šaj alosarel numa jekh <stylePalette>; lel pes o palutno.

## Unique variants

variant-num-to-select-not-non-negative-integer = le korkorutne variante le { $component }-eske našti dinaden pes, kaj numToSelect naj binegativo interi numero.

variant-num-to-select-not-constant-number = le korkorutne variante le { $component }-eske našti dinaden pes, kaj numToSelect naj konstanto numero.

variant-with-replacement-not-constant-boolean = le korkorutne variante le { $component }-eske našti dinaden pes, kaj withReplacement naj konstanto boolean.

variant-select-weight-disables-unique = Le korkorutne variante vaš select si mukhle avri kana si jekh opcia le selectWeight vaj selectForVariants dinado

variant-coprime-undetermined = le korkorutne variante le { $component }-eske našti dinaden pes, kaj našti dinadel pes te si coprime sagda xoxavno.

variant-attribute-not-constant = le korkorutne variante le { $component }-eske našti dinaden pes, kaj { $attribute } naj konstanto.

variant-attribute-not-number = le korkorutne variante le { $component }-eske našti dinaden pes, kaj { $attribute } naj numero.

variant-attribute-wrong-type-for-sequence =
    le korkorutne variante le { $component }-eske le tiposko { $type } našti dinaden pes, kaj { $attribute } naj { $expected ->
        [letters-combination] jekh kombinacia lilvarengi
        [math-expression] jekh čači matematikani ekspresia
        [integer] jekh interi numero
       *[number] jekh numero
    }.

variant-length-not-integer = le korkorutne variante le { $component }-eske našti dinaden pes, kaj length naj interi numero.

variant-sort-not-implemented = korkorutne variante jekhe { $component }-eske le sort-osa naj kerde

variant-exclude-combinations-not-implemented = korkorutne variante jekhe { $component }-eske le excludeCombinations-osa naj kerde

variant-math-exclude-not-implemented = korkorutne variante jekhe { $component }-eske le tiposko math le exclude-osa naj kerde

variant-non-constant-exclude-not-implemented = korkorutne variante jekhe { $component }-eske bikonstante exclude-osa naj kerde

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: naj inkerdo ando prefigure-renderer le graph-osko; o čhavo nakhel pes.

prefigure-descendant-invalid-geometry = { $subject }: binaagorutni vaj bipherdi geometria; o čhavo nakhel pes.

prefigure-curve-label-omitted = { $subject }: le etikete naj inkerde pe paruvde kurbake elementura; e etiketa mukhel pes avri.

prefigure-curve-unsupported-definition-type = { $subject }: o tipo la definiciako '{ $definitionType }' la kurbake funkciako naj inkerdo; o čhavo nakhel pes.

prefigure-region-flip-functions-unsupported = { $subject }: o flipFunctions-atributo pe regionBetweenCurves naj inkerdo; o čhavo nakhel pes.

prefigure-region-non-formula-child = { $subject }: pe regionBetweenCurves si inkerde numa čhavutne funkcie le tiposko formula; o čhavo nakhel pes.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' naj inkerdo vaš jekh { $labelKind ->
        [line-family] etiketa anda e familia le liniengi
       *[point] etiketa le punktoski
    }; lel pes o standardno ravnipe le PreFigure-osko.

prefigure-fill-style-unsupported = { $subject }: o stilo le pheripnasko '{ $fillStyle }' naj inkerdo katar PreFigure; lel pes jekh pherdo pheripe.

prefigure-line-style-unknown = { $subject }: o biprindžardo stilo la liniako '{ $lineStyle }' mukhel pes avri anda o PreFigure-ikalipe.

prefigure-marker-style-mapped-to-diamond = { $subject }: o stilo le markerosko '{ $markerStyle }' si dinado pe o PreFigure-stilo 'diamond'.

prefigure-marker-style-unsupported = { $subject }: o stilo le markerosko '{ $markerStyle }' naj inkerdo katar PreFigure; lel pes o standardno stilo.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: bičačo `ref`; o mišto našti dinadel pes. E notica mukhel pes avri.

annotation-ref-multiple-targets = `<annotation>`: `ref` dine but mištura; lel pes o angluno.

annotation-ref-outside-graph = `<annotation>`: bičačo `ref`; o mišto si avri anda o graph. E notica mukhel pes avri.

annotation-ref-unsupported-target = `<annotation>`: bičačo `ref`; o mišto naj inkerdo grafiko objekto ando prefigure-paruvipe. E notica mukhel pes avri.

annotation-text-missing = `<annotation>`: `text` falil vaj si šušo; del pes šušo teksto.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Arakhadilo jekh krugutno inkeripe.
       *[other] Arakhadilo jekh krugutno inkeripe jekhe `<{ $componentType }>`-komponentosa.
    }

reference-no-referent = Nisavo referento či arakhadilo vaš e referensa: `{ $reference }`

reference-multiple-referents = But referentura arakhadile vaš e referensa: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Bičačo formato vaš o atributo { $attribute } jekhe `<{ $componentType }>`-esko.

children-invalid = Bičače čhave vaš `<{ $componentType }>`: arakhadile bičače čhave: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Bičačo valoro `{ $value }` vaš o atributo `{ $attribute }`, lel pes o valoro `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] E DoenetML-versia { $version } či arakhadili.
       *[other] E DoenetML-versia { $version } či arakhadili. Lel pes e versia { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Bičačo DoenetML: { $content }

parse-tag-missing-close-tag = Bičačo DoenetML: O tago `{ $tag }` naj les phandavno tago. Ažukardo si jekh korkoro-phandavno tago vaj jekh `</{ $tagName }>`-tago.

parse-tag-error = Bičačo DoenetML: Doš ando tago `<{ $tagName }>`

parse-attribute-missing-value = Bičačo DoenetML: Le bičače atributoske `{ $attribute }` falil, sar dičhol, jekh valoro.

parse-attribute-invalid = Bičačo DoenetML: Bičačo atributo `{ $attribute }`

parse-attribute-value-invalid = Bičačo DoenetML: Bičačo valoro le atributosko `{ $value }`

parse-attribute-value-quote-mismatch = Bičačo DoenetML: Bičačo valoro le atributosko `{ $value }`. Le semnura le citatoske či malaven pes. Falil, sar dičhol, jekh `{ $quote }`

parse-open-tag-name-missing = Bičačo DoenetML: Arakhadilo jekh tago bi anavesko, sar `<`

parse-tag-not-closed = Bičačo DoenetML: O tago `{ $tag }` naj phandado (falil, sar dičhol, jekh `>`).

parse-self-closing-tag-name-missing = Bičačo DoenetML: Arakhadilo jekh tago bi anavesko `<{ $content }>`

parse-self-closing-tag-not-closed = Bičačo DoenetML: O tago `{ $tag }` naj phandado (falil, sar dičhol, `/>`).

parse-tag-invalid-attributes = Bičačo DoenetML: O tago `{ $tag }` naj čačo. Šaj si les bičače atributura.

parse-close-tag-name-missing = Bičačo DoenetML: Arakhadilo jekh phandavno tago bi anavesko, sar `</`

parse-attribute-value-unquoted = Le valorura le atributenge trubun te aven ande semnura le citatoske: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Bičačo DoenetML: Arakhadilo o phandavno tago `{ $tag }`, numa naj lesko putrimasko tago

parse-close-tag-mismatched = Bičačo DoenetML: O phandavno tago či malavel pes. Ažukardo si `</{ $expected }>`. Arakhadilo `{ $found }`

parser-node-unconvertible = O nodo { $node } našti sas paruvdo ande jekh Dast-nodo.

## Names

name-attribute-invalid =
    Bičačo anav le atributosko name='{ $name }'. { $reason ->
        [characters] Anava šaj si len numa lilvara, numerura, telutne linie vaj linie.
       *[start] Anava trubun te počinen jekhe lilvaresa.
    }

component-name-invalid-start = Bičačo anav komponentosko "{ $name }". Anava trubun te počinen jekhe lilvaresa.

## `<answer>` sugar

answer-video-watched-missing-video = Jekh phendipe le tiposko videoWatched trubul te avel les jekh video-atributo

answer-video-watched-video-not-reference = Jekh phendipe le tiposko videoWatched trubul te avel les jekh video-atributo kaj si jekh referensa

answer-name-not-single-text = O name-atributo jekhe phendimasko trubul te avel les čačes jekh teksto-čhavo

## Referencing another document

external-doenetml-recursion-limit = O avrutno DoenetML našti sas lino anda but nivelura rekursiake. Si kathe jekh krugutni referensa?

external-doenetml-unavailable = O DoenetML katar { $attribute }="{ $uri }" našti sas lino

external-doenetml-type-mismatch = Bičačo DoenetML lino katar { $attribute }="{ $uri }": či malavel pes le tiposa komponentosko "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] O atributo `{ $from }` si purano; le `{ $to }` ande lesko than.
       *[other] [deprecation] O atributo `{ $from }` pe `<{ $component }>` si purano; le `{ $to }` ande lesko than.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] O atributo `{ $from }` si purano thaj či lel pes ande gindo, kaj vi `{ $to }` si dino.
       *[other] [deprecation] O atributo `{ $from }` pe `<{ $component }>` si purano thaj či lel pes ande gindo, kaj vi `{ $to }` si dino.
    }

deprecated-attribute-ignored = [deprecation] O atributo `{ $attribute }` pe `<{ $component }>` si purano thaj či lel pes ande gindo.

deprecated-attribute-to-child = [deprecation] O atributo `{ $attribute }` pe `<{ $component }>` si purano; le jekhe `<{ $child }>`-čhaves ande lesko than.

deprecated-attribute-value-renamed = [deprecation] O valoro `{ $value }` le atributosko `{ $attribute }` pe `<{ $component }>` si purano; le `{ $to }` ande lesko than.


## Language coverage

pluralize-english-only = `<pluralize>` šaj kerel numa e angleziko čhib buteder, anda kodo o teksto ande jekh dokumento pe { $locale } ačhel sar o autoro ramosardas les. Ramosar e butederutni forma direkt, vaj thov la le `pluralForm`-atributosa.


## Checking against the schema

schema-element-unrecognized = O elemento `<{ $tag }>` naj prindžardo Doenet-elemento.

schema-element-not-allowed-at-root = O elemento `<{ $tag }>` naj mukhlo ka o angluno than le dokumentosko.

schema-element-not-allowed-inside = O elemento `<{ $tag }>` naj mukhlo ande `<{ $parent }>`.

schema-attribute-unrecognized = Le elementos `<{ $tag }>` naj les atributo le anavesa `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] O atributo `{ $attribute }` le elementosko `<{ $tag }>` trubul te avel jekh lista kaj svako kotor si jekh anda kadala: { $allowed }
       *[other] O atributo `{ $attribute }` le elementosko `<{ $tag }>` trubul te avel jekh anda kadala: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Bičačo anav variantako vaš select.  O anav variantako { $variantName } avel ande { $numOptions } opcie, numa o gin te alosarel pes si { $numToSelect }.

select-variant-name-without-options = Vaš select si dine variante, numa naj opcie vaš o šaj anav variantako: { $variantName }.

select-variant-name-not-possible = O anav variantako { $variantName } kaj si dino vaš select naj šaj anav variantako.

select-too-few-options = { $numToSelect } komponentura našti alosaren pes numa anda { $numOptions }.

select-from-sequence-too-few-values = { $numToSelect } valorura našti alosaren pes anda jekh sekvencia le lungimasa { $length }.

select-from-sequence-indices-count-mismatch = O gin le indeksengo dine vaš select trubul te malavel pes le ginesa te alosarel pes

select-from-sequence-indices-not-integers = Sa le indeksura dine vaš select trubun te aven interi numerura

select-from-sequence-index-excluded = Dino sas jekh indekso le selectfromsequence-osko kaj sas mukhlo avri

select-from-sequence-indices-excluded-combination = Dine sas indeksura le selectfromsequence-oske kaj sas jekh mukhli avri kombinacia

select-from-sequence-coprime-not-positive-integers = Kombinacie bi jekhutne dilitoresko našti alosaren pes, kaj či alosaren pes pozitivne interi numerura.

select-from-sequence-coprime-common-factor = Numerura bi jekhutne dilitoresko našti alosaren pes. Sa le šaj valorura si len jekh jekhutno faktoro. (Le dine valorura le "from" vaj "to" trubun te aven bi jekhutne dilitoresko le "step"-osa.)

select-from-sequence-coprime-single-number = Kombinacie bi jekhutne dilitoresko našti alosaren pes anda jekh korkoro numero kaj naj 1.

select-from-sequence-excluded-too-many-combinations = Maj but sar 70 % le kombinaciengo ando selectFromSequence si mukhle avri

select-from-sequence-coprime-none-found = Numerura bi jekhutne dilitoresko naštisas te alosaren pes. Sa le šaj valorura si len jekh jekhutno faktoro.

select-from-sequence-too-few-unique-values = { $numToSelect } korkorutne valorura našti alosaren pes anda jekh sekvencia le lungimasa { $numPossibleValues }

select-prime-numbers-too-few-values = { $numToSelect } valorura našti alosaren pes anda jekh lista primne numerurengi le lungimasa { $numValues }

select-prime-numbers-values-count-mismatch = O gin le valorurengo dine vaš select trubul te malavel pes le ginesa te alosarel pes

select-prime-numbers-values-not-prime = Sa le valorura dine vaš select prime number trubun te aven ande lista le primne numerurengi

select-prime-numbers-values-excluded-combination = Le dine valorura le selectPrimeNumbers-oske si jekh mukhli avri kombinacia

select-prime-numbers-excluded-too-many-combinations = Maj but sar 70 % le kombinaciengo ando selectPrimeNumbers si mukhle avri

select-random-combination-fluke = Anda jekh but bipatjavno baxtalipe, naštisas te alosarel pes jekh kombinacia bijandine valorurengi

select-random-value-fluke = Anda jekh but bipatjavno baxtalipe, naštisas te alosarel pes jekh bijandino valoro

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] Kadava `<{ $component }>` či sikavel pes, kaj si ande matematika thaj naj `inline`. Thov `inline` te kerdol jekh tele-mukhli lista, kaj šaj bešel ande jekh ekspresia.
        [expanded] Kadava `<{ $component }>` či sikavel pes, kaj si ande matematika thaj si `expanded`. Ikal avri `expanded`; jekh butlinienge kutia našti bešel ande jekh ekspresia.
        [on-graph] Kadava `<{ $component }>` či sikavel pes, kaj si ande matematika cirdini pe jekh graph, kaj naj than vaš jekh intrado.
       *[relative-width] Kadava `<{ $component }>` či sikavel pes, kaj si ande matematika thaj si les relativo buxlipe. De e buxlipe ande absoluto mesuripe, sar `px`.
    }
