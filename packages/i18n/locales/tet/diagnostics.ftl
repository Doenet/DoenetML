# Tetum diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# Written in Tetun Dili; see `chrome.ftl`'s header. Tetum marks no number on the
# noun, so a counted message whose only English difference is the noun's number
# renders one string here and the select is dropped.


## `<lineSegment>`

# No select: «la konsidera» does not agree with what is ignored, and the list
# carries no number of its own.
line-segment-attributes-ignored-with-endpoints = la konsidera { $attributes } bainhira rohan rua determina ona

line-segment-attributes-ignored-with-endpoint-and-midpoint = la konsidera { $attributes } bainhira rohan ida ho pontu klaran determina hotu ona

line-segment-midpoint-offset-without-midpoint = midpointOffset laiha efeitu se laiha pontu klaran

## `<line>`

line-points-undetermined-dimensions = Liña ne'ebé liu pontu sira ne'ebé dimensaun la determinadu.

line-points-too-few-dimensions = Liña tenke liu pontu sira ne'ebé iha dimensaun rua ka liu.

line-points-depend-on-variables = Liña liu pontu sira ne'ebé depende ba variavel: { $variables }.

line-equation-invalid-format = Formatu ekuasaun liña la válidu iha variavel { $variable1 } no { $variable2 }.

## `<ray>`

ray-overprescribed-through = Raiu determina husi through, endpoint no direction.  La konsidera through ne'ebé determina ona.

ray-dimension-mismatch = numDimensions la hanesan iha raiu.

## `<vector>`

vector-overprescribed-head = Vetór determina husi head, tail no displacement.  La konsidera head ne'ebé determina ona.

vector-dimension-mismatch = numDimensions la hanesan iha vetór.

## Attracting and constraining

attract-to-without-nearest-point = La bele dada ba `<{ $component }>` tanba nia laiha variavel estadu nearestPoint.

constrain-to-without-nearest-point = La bele limita ba `<{ $component }>` tanba nia laiha variavel estadu nearestPoint.

constrain-to-interior-without-nearest-point = La bele limita ba laran husi `<{ $component }>` tanba nia laiha variavel estadu nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = la konsidera labelPosition ba choiceInput ne'ebé la inline

## Ordering children by index

choice-input-indices-count-mismatch = La konsidera índise sira ne'ebé determina ba choiceInput tanba númeru índise la hanesan ho númeru oan hili nian.

pretzel-indices-count-mismatch = La konsidera índise sira ne'ebé determina ba problem tanba númeru índise la hanesan ho númeru oan problem nian.

shuffle-indices-count-mismatch = La konsidera índise sira ne'ebé determina ba shuffle tanba númeru índise la hanesan ho númeru komponente.

indices-ignored-out-of-range = La konsidera índise sira ne'ebé determina ba { $component } tanba iha índise ida sai husi limite.

pretzel-indices-repeated = La konsidera índise sira ne'ebé determina ba pretzel tanba iha índise ida repete.

pretzel-circuit-first-index = La konsidera índise sira ne'ebé determina ba pretzel iha mode circuit tanba índise dahuluk tenke 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Atu `<{ $component }>` bele serbisu ho oan string, atributu `type` tenke determina.

invalid-type-defaulting-to-math = type { $type } la válidu ba komponente { $component }. Tenke ida husi math, text, number, ka boolean. Uza math.

string-not-valid-component-to-arrange = String "{ $value }" la'ós komponente válidu ba { $component }. La konsidera.

## Types and variables

invalid-type-defaulting-to-number = type { $type } la válidu, tau type ba number.

invalid-variable-value = Valór variavel la válidu: `{ $value }`

## Variants

variant-index-must-be-number = Índise variante { $index } tenke númeru

variant-index-must-be-integer = Índise variante { $index } tenke númeru inteiru

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` seidauk implementa ba medida absolutu. Tau luan sira ba relativu.

side-by-side-absolute-margins = `<{ $component }>` seidauk implementa ba medida absolutu. Tau marjen sira ba relativu.

side-by-side-no-block-child = `<{ $component }>` la válidu: nia tenke iha oan block ida.

## `<label>`

label-for-ignored-on-graphical = La konsidera atributu `for` iha `<label>` gráfiku.

label-for-must-resolve-to-one = Atributu `for` iha `<label>` tenke hatudu ba komponente ida de'it.

label-for-unresolved = Atributu `for` iha `<label>` la bele hatudu ba komponente ida.

label-for-answer-with-authored-inputs = Atributu `for` iha `<label>` hatudu ba `<answer>` ne'ebé iha input ne'ebé autór hakerek; hatudu input rasik.

label-for-answer-without-input = Atributu `for` iha `<label>` hatudu ba `<answer>` ne'ebé laiha input atu fó etiketa.

label-for-must-reference-input-or-answer = Atributu `for` iha `<label>` tenke hatudu ba input ida ka answer ida.

## Accessibility

accessibility-short-description-or-decorative = Ba asesibilidade, `<{ $component }>` tenke iha deskrisaun badak ka determina nu'udar dekorativu.

accessibility-video-short-description = Ba asesibilidade, `<video>` tenke iha deskrisaun badak.

accessibility-input-short-description-or-label = Ba asesibilidade, `<{ $component }>` tenke iha deskrisaun badak ka etiketa.

accessibility-answer-input-short-description-or-label = Ba asesibilidade, `<answer>` ne'ebé kria input tenke iha deskrisaun badak ka etiketa.

accessibility-short-description-contains-math = Deskrisaun badak la bele iha komponente matemátika hanesan `<{ $component }>`. Hakerek matemátika ho liafuan.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Kontraste husi { $colorName } la to'o ba testu títulu seksaun (mode nakukun) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; presiza uitoan liu { $threshold }:1).
       *[other] Kontraste husi { $colorName } la to'o ba testu títulu seksaun ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; presiza uitoan liu { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` ne'ebé liu pontu { $count } seidauk implementa se pontu sira laiha valór numériku.

circle-too-many-through-points = La bele kalkula sírkulu ne'ebé liu pontu liu 3.

circle-overprescribed-radius-center-points = La bele kalkula sírkulu ho raiu, sentru no pontu sira ne'ebé determina ona.

circle-center-with-multiple-points = La bele kalkula sírkulu ho sentru determinadu ne'ebé liu pontu liu 1.

circle-radius-too-small = La bele kalkula sírkulu: tanba distánsia entre pontu rua mak { $distance }, raiu { $radius } ne'ebé determina ki'ik liu.

circle-radius-with-many-points = La bele kria sírkulu ne'ebé liu pontu liu rua ho raiu ne'ebé determina.

circle-invalid-center-or-through-points = Sentru ka pontu sira ne'ebé sírkulu liu la válidu.

circle-radius-center-with-multiple-points = La bele kalkula raiu sírkulu ho sentru determinadu ne'ebé liu pontu liu 1.

circle-change-radius-non-numerical = La bele troka raiu sírkulu ne'ebé liu pontu sira ne'ebé la numériku

circle-radius-with-points-non-numerical = La bele kria sírkulu ne'ebé liu pontu liu ida ho raiu ne'ebé determina se laiha valór numériku.

circle-change-center-non-numerical = Troka sentru sírkulu ne'ebé liu pontu sira ne'ebé laiha valór numériku seidauk implementa.

## `<function>`

# English's two counts multiply out to four sentences; Tetum has one, because
# «intervalu» and «input» do not change for number. Both selects are dropped
# and both counts still arrive.
function-domain-insufficient-dimensions = Dimensaun domíniu ba funsaun la to'o. Domíniu iha intervalu { $intervals } maibé funsaun iha input { $inputs }.

function-domain-invalid-format = Formatu domíniu ba funsaun la válidu.

function-ignoring-non-numerical =
    { $type ->
        [maximum] La konsidera máximu funsaun nian ne'ebé la numériku.
        [minimum] La konsidera mínimu funsaun nian ne'ebé la numériku.
        [extremum] La konsidera estremu funsaun nian ne'ebé la numériku.
        [point] La konsidera pontu funsaun nian ne'ebé la numériku.
        [slope] La konsidera inklinasaun funsaun nian ne'ebé la numériku.
       *[other] La konsidera { $type } funsaun nian ne'ebé la numériku.
    }

function-ignoring-empty =
    { $type ->
        [maximum] La konsidera máximu funsaun nian ne'ebé mamuk.
        [minimum] La konsidera mínimu funsaun nian ne'ebé mamuk.
        [extremum] La konsidera estremu funsaun nian ne'ebé mamuk.
        [point] La konsidera pontu funsaun nian ne'ebé mamuk.
       *[other] La konsidera { $type } funsaun nian ne'ebé mamuk.
    }

function-points-too-close = Funsaun iha pontu rua ne'ebé fatin besik liu. La bele define funsaun.

# Both selects dropped, for the reason above.
function-iterates-input-output-mismatch = Iterasaun funsaun bele de'it se númeru input hanesan ho númeru output. Funsaun ne'e iha input { $inputs } no output { $outputs }.

## `<sequence>`

sequence-invalid-length = Naruk sequence la válidu.  Tenke númeru inteiru ne'ebé la negativu.

sequence-invalid-step = step sequence la válidu.  Tenke númeru ba sequence type { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" sequence númeru la válidu.  Tenke númeru.

sequence-invalid-endpoint-letters = "{ $attribute }" sequence letra la válidu.  Tenke kombinasaun letra.

sequence-invalid-endpoint = "{ $attribute }" sequence la válidu.

select-from-sequence-coprime-not-numbers = la konsidera coprime tanba buat ne'ebé hili la'ós númeru

select-from-sequence-coprime-with-exclude-combinations = la konsidera coprime tanba excludeCombinations determina ona

## Resolving a `target`

target-not-found = target la válidu ba `<{ $source }>`: la hetan target.

target-state-variable-not-found = target la válidu ba `<{ $source }>`: la hetan variavel estadu ho naran "{ $property }" iha `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Variavel `<odeSystem>` tenke la hanesan ho variavel independente.

ode-system-duplicate-variable-names = La bele define funsaun RHS ODE ho naran variavel dependente hanesan.

ode-system-rhs-function-error = La bele define funsaun RHS ODE.  Iha sala kuandu kria funsaun mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = La bele define ángulu entre liña { $count }

angle-invalid-through-point = Pontu la válidu iha through husi `<angle>`

parabola-vertex-too-many-points = Parábola ho vértise ne'ebé liu pontu liu 1 seidauk implementa.

parabola-too-many-points = Parábola ne'ebé liu pontu liu 3 seidauk implementa.

intersection-too-many-items = Interseksaun ba buat liu rua seidauk implementa

## Other math components

ionic-compound-not-two-ions = Kompostu ióniku ba buat seluk fó-liu ion rua seidauk implementa.

ionic-compound-needs-cation-and-anion = Kompostu ióniku implementa ba katiaun ida no aniaun ida de'it.

solve-equations-cannot-evaluate = La bele rezolve ekuasaun tanba la bele avalia ekuasaun: { $equation }

math-operators-operand-number-required = operandNumber tenke determina bainhira foti operandu matemátiku.

eigen-decomposition-failed = La bele kalkula eigenvalue matriz nian

## `<matchesPattern>`

# No select: the parameter list carries no number that the noun would show.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: parametru { $parameters } la mosu iha pattern, entaun nia sempre kombina ho mamuk.

## `<graph>`

graph-grid-invalid = `<graph>`: la komprende grid="{ $grid }". Tenke none, medium, dense, ka númeru pozitivu rua ne'ebé espasu ida fahe, hanesan grid="1 0.5". Laiha grid ne'ebé dezeña.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" la suporta iha renderer prefigure; uza hahalok pozisaun loos.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" la suporta iha renderer prefigure; uza hahalok pozisaun leten.

prefigure-invalid-axis-bounds = `<graph>`: limite eixu la válidu ba konversaun prefigure; uza bbox padraun (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: luan la válidu ba konversaun prefigure; uza luan diagrama padraun 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio la válidu ba konversaun prefigure; uza aspect ratio padraun 1.

prefigure-grid-spacing-too-fine = `<graph>`: espasu grid ki'ik liu ba limite eixu; la dezeña grid iha renderer prefigure.

prefigure-annotations-not-rendered = `<graph>`: la dezeña annotation se la uza renderer PreFigure.

multiple-annotations-children = Hetan oan `<annotations>` barak iha `<graph>`; la konsidera hotu-hotu la'ós ikus liu.

## Referring to other components

copy-unrecognized-component-type = La bele estende ka kopia tipu komponente ne'ebé la rekoñese: { $type }.

copy-prop-not-found = La hetan prop { $property } iha komponente tipu { $component }

collect-no-source = La hetan source ba collect.

collect-invalid-component-type = La bele halibur komponente tipu `<{ $component }>` tanba tipu komponente la válidu.

reference-index-unavailable = La bele refere índise `{ $reference }`

## `<callAction>`

component-action-unavailable = La bele bolu { $action } iha komponente `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Forma dadus la válidu.  Naruk liña la hanesan. Hetan iha componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Dadus iha naran koluna hanesan.  Hetan iha componentIdx :{ $componentIdx }

data-frame-missing-column-name = Dadus la iha naran koluna ida.  Hetan iha componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Award resposta ne'e bazeia ba resposta ne'ebé answer tag rasik haruka, no ne'e sei lori hahalok ne'ebé la hein.

answer-max-num-attempts-in-section-wide-check-work = Tau `maxNumAttempts` iha `<answer>` ida iha laran husi kontenedór ho `sectionWideCheckWork` laiha efeitu, tanba kontenedór mak kontrola númeru koko. Tau `maxNumAttempts` iha kontenedór.

nested-section-wide-check-work-max-num-attempts = Tau `maxNumAttempts` iha kontenedór ho `sectionWideCheckWork` ne'ebé iha laran husi kontenedór seluk ho `sectionWideCheckWork` laiha efeitu, tanba kontenedór liur mak kontrola númeru koko. Tau `maxNumAttempts` iha kontenedór liur.

# No select: «atributu» is the same word for one and for many.
answer-attributes-need-symbolic-equality = Atributu { $attributes } sei laiha efeitu se symbolicEquality la tau.

answer-invalid-type = Tipu la válidu ba resposta: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Tanba komponente `<{ $component }>` laiha naran, nia la bele uza ba atributu module

module-attribute-name-already-defined = Komponente `<{ $component } name="{ $name }">` la bele uza nu'udar atributu module tanba tipu komponente `<module>` iha ona atributu "{ $name }".

conditional-content-condition-ignored = La konsidera atributu `condition` iha komponente `<conditionalContent>` ho oan case ka else.

slider-markers-type-mismatch = Tipu marker la hanesan ho tipu slider.

pretzel-problem-needs-statement-and-answer = Pretzel la válidu: kada `<problem>` tenke iha `<statement>` ida no `<answer>` ida.

pretzel-circuit-first-problem-distractor = Pretzel la válidu: iha mode="circuit", `<problem>` dahuluk la bele distractor.

## Attribute values

# No select: «valór» is the same word for one and for many.
attribute-invalid-values = Valór { $values } la válidu ba atributu `{ $attribute }`; la konsidera.

attribute-must-be-references = Valór `{ $value }` la válidu ba atributu `{ $attribute }`. Atributu tenke kompostu husi referénsia sira ne'ebé hahú ho `$`.

math-input-invalid-function-names = <mathInput>: la konsidera naran funsaun la válidu iha { $attribute }: { $names }. Kada naran tenke iha karakter rua ka liu (letra ka traku); bele tuir sufiksu `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Tipu komponente la válidu: `<{ $componentType }>`

attribute-repeated = La bele repete atributu { $attribute }.

attribute-invalid-for-component = Atributu "{ $attribute }" la válidu ba komponente tipu `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Kontraste husi definisaun estilu { $styleNumber } la to'o ba { $context ->
        [text-on-background] kór testu hasoru kór fundu
        [high-contrast] kór kontraste aas hasoru kanvas
        [line] kór liña hasoru kanvas
        [marker] kór marker hasoru kanvas
       *[text-on-canvas] kór testu hasoru kanvas
    }{ $mode ->
        [dark] { " (mode nakukun)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; presiza uitoan liu { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Maski definisaun estilu { $styleNumber } iha kór sira ne'ebé determina ho kontraste to'o ba mode naroman, kontraste kór testu hasoru kór fundu la to'o iha kór sira ne'ebé foti ba mode nakukun ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; presiza uitoan liu { $threshold }:1). { $suggestion ->
        [available] Atu kontraste to'o iha mode nakukun, aumenta kontraste mode naroman (ezemplu, tau { $lightAttribute }="{ $lightColor }") ka troka kór mode nakukun (ezemplu, tau { $darkAttribute }="{ $darkColor }").
       *[none] Atu kontraste to'o iha mode nakukun, aumenta kontraste mode naroman ka troka kór sira ne'ebé foti ho textColorDarkMode no/ka backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Maski definisaun estilu { $styleNumber } iha kór testu ne'ebé determina ho kontraste to'o ba mode naroman, kontraste kór testu ne'ebé foti ba mode nakukun la to'o hasoru kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; presiza uitoan liu { $threshold }:1). { $suggestion ->
        [available] Atu kontraste to'o iha mode nakukun, aumenta kontraste mode naroman (ezemplu, tau textColor="{ $lightColor }") ka troka kór mode nakukun (ezemplu, tau textColorDarkMode="{ $darkColor }").
       *[none] Atu kontraste to'o iha mode nakukun, aumenta kontraste mode naroman ka troka kór ne'ebé foti ho textColorDarkMode.
    }

section-multiple-style-palettes = Seksaun ida bele hili <stylePalette> ida de'it; uza ida ikus.

## Unique variants

variant-num-to-select-not-non-negative-integer = la bele determina variante úniku husi { $component } tanba numToSelect la'ós númeru inteiru ne'ebé la negativu.

variant-num-to-select-not-constant-number = la bele determina variante úniku husi { $component } tanba numToSelect la'ós númeru konstante.

variant-with-replacement-not-constant-boolean = la bele determina variante úniku husi { $component } tanba withReplacement la'ós boolean konstante.

variant-select-weight-disables-unique = Variante úniku ba select desativa se iha opsaun ho selectWeight ka selectForVariants determinadu

variant-coprime-undetermined = la bele determina variante úniku husi { $component } tanba la bele determina katak coprime sempre false.

variant-attribute-not-constant = la bele determina variante úniku husi { $component } tanba { $attribute } la konstante.

variant-attribute-not-number = la bele determina variante úniku husi { $component } tanba { $attribute } la'ós númeru.

variant-attribute-wrong-type-for-sequence =
    la bele determina variante úniku husi { $component } tipu { $type } tanba { $attribute } la'ós { $expected ->
        [letters-combination] kombinasaun letra
        [math-expression] espresaun matemátika válidu
        [integer] númeru inteiru
       *[number] númeru
    }.

variant-length-not-integer = la bele determina variante úniku husi { $component } tanba length la'ós númeru inteiru.

variant-sort-not-implemented = variante úniku husi { $component } ho sort seidauk implementa

variant-exclude-combinations-not-implemented = variante úniku husi { $component } ho excludeCombinations seidauk implementa

variant-math-exclude-not-implemented = variante úniku husi { $component } tipu math ho exclude seidauk implementa

variant-non-constant-exclude-not-implemented = variante úniku husi { $component } ho exclude la konstante seidauk implementa

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: la suporta iha renderer prefigure husi graph; soe tiha desendente.

prefigure-descendant-invalid-geometry = { $subject }: jeometria la finitu ka la kompletu; soe tiha desendente.

prefigure-curve-label-omitted = { $subject }: la suporta etiketa iha elementu kurva ne'ebé konverte; la konsidera etiketa.

prefigure-curve-unsupported-definition-type = { $subject }: tipu definisaun funsaun kurva '{ $definitionType }' la suporta; soe tiha desendente.

prefigure-region-flip-functions-unsupported = { $subject }: atributu flipFunctions iha regionBetweenCurves la suporta; soe tiha desendente.

prefigure-region-non-formula-child = { $subject }: oan funsaun tipu formula de'it mak suporta iha regionBetweenCurves; soe tiha desendente.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' la suporta ba { $labelKind ->
        [line-family] etiketa família liña
       *[point] etiketa pontu
    }; uza aliñamentu padraun PreFigure.

prefigure-fill-style-unsupported = { $subject }: estilu prenxe '{ $fillStyle }' la suporta husi PreFigure; fila ba prenxe sólidu.

prefigure-line-style-unknown = { $subject }: estilu liña '{ $lineStyle }' la rekoñese, la konsidera iha output PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: estilu marker '{ $markerStyle }' mapea ba estilu 'diamond' husi PreFigure.

prefigure-marker-style-unsupported = { $subject }: estilu marker '{ $markerStyle }' la suporta husi PreFigure; uza estilu padraun.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` la válidu; la bele hatudu target. La konsidera annotation.

annotation-ref-multiple-targets = `<annotation>`: `ref` hatudu ba target barak; uza target dahuluk.

annotation-ref-outside-graph = `<annotation>`: `ref` la válidu; target iha liur husi graph ne'ebé kaer nia. La konsidera annotation.

annotation-ref-unsupported-target = `<annotation>`: `ref` la válidu; target la'ós objetu gráfiku ne'ebé suporta iha konversaun prefigure. La konsidera annotation.

annotation-text-missing = `<annotation>`: `text` la iha ka mamuk; sai testu mamuk.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Hetan dependénsia sirkulár.
       *[other] Hetan dependénsia sirkulár ne'ebé envolve komponente `<{ $componentType }>`.
    }

reference-no-referent = La hetan buat ne'ebé referénsia hatudu: `{ $reference }`

reference-multiple-referents = Hetan buat barak ne'ebé referénsia hatudu: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Formatu atributu { $attribute } husi `<{ $componentType }>` la válidu.

children-invalid = Oan husi `<{ $componentType }>` la válidu: hetan oan la válidu: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valór `{ $value }` la válidu ba atributu `{ $attribute }`, uza valór `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] La hetan versaun DoenetML { $version }.
       *[other] La hetan versaun DoenetML { $version }. Fila ba versaun { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML la válidu: { $content }

parse-tag-missing-close-tag = DoenetML la válidu: Tag `{ $tag }` laiha tag taka. Hein tag ne'ebé taka an rasik ka tag `</{ $tagName }>`.

parse-tag-error = DoenetML la válidu: Iha sala iha tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML la válidu: Atributu `{ $attribute }` la válidu hanesan laiha valór.

parse-attribute-invalid = DoenetML la válidu: Atributu `{ $attribute }` la válidu

parse-attribute-value-invalid = DoenetML la válidu: Valór atributu `{ $value }` la válidu

parse-attribute-value-quote-mismatch = DoenetML la válidu: Valór atributu `{ $value }` la válidu. Marka aspas la hanesan. Hanesan laiha `{ $quote }` ida

parse-open-tag-name-missing = DoenetML la válidu: Hetan tag ida laiha naran, ezemplu `<`

parse-tag-not-closed = DoenetML la válidu: Tag `{ $tag }` la taka (hanesan laiha `>`).

parse-self-closing-tag-name-missing = DoenetML la válidu: Hetan tag ida laiha naran `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML la válidu: Tag `{ $tag }` la taka (hanesan laiha `/>`).

parse-tag-invalid-attributes = DoenetML la válidu: Tag `{ $tag }` la válidu. Karik atributu sira la loos.

parse-close-tag-name-missing = DoenetML la válidu: Hetan tag taka ida laiha naran, ezemplu `</`

parse-attribute-value-unquoted = Valór atributu tenke tau iha aspas laran: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML la válidu: Hetan tag taka `{ $tag }`, maibé laiha tag loke ne'ebé hanesan

parse-close-tag-mismatched = DoenetML la válidu: Tag taka la hanesan. Hein `</{ $expected }>`. Hetan `{ $found }`

parser-node-unconvertible = La bele konverte node { $node } ba node Dast.

## Names

name-attribute-invalid =
    Atributu name='{ $name }' la válidu. { $reason ->
        [characters] Naran bele iha letra, númeru, traku okos ka traku de'it.
       *[start] Naran tenke hahú ho letra.
    }

component-name-invalid-start = Naran komponente "{ $name }" la válidu. Naran tenke hahú ho letra.

## `<answer>` sugar

answer-video-watched-missing-video = Answer ho type videoWatched tenke iha atributu video

answer-video-watched-video-not-reference = Answer ho type videoWatched tenke iha atributu video ne'ebé referénsia

answer-name-not-single-text = Atributu name husi answer tenke iha oan text ida de'it

## Referencing another document

external-doenetml-recursion-limit = La bele foti DoenetML husi liur tanba nivel repetisaun barak liu. Iha referénsia sirkulár ka lae?

external-doenetml-unavailable = La bele foti DoenetML husi { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML ne'ebé foti husi { $attribute }="{ $uri }" la válidu: nia la hanesan ho tipu komponente "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atributu `{ $from }` la uza ona; uza `{ $to }`.
       *[other] [deprecation] Atributu `{ $from }` iha `<{ $component }>` la uza ona; uza `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atributu `{ $from }` la uza ona no la konsidera tanba `{ $to }` mós determina ona.
       *[other] [deprecation] Atributu `{ $from }` iha `<{ $component }>` la uza ona no la konsidera tanba `{ $to }` mós determina ona.
    }

deprecated-attribute-ignored = [deprecation] Atributu `{ $attribute }` iha `<{ $component }>` la uza ona no la konsidera.

deprecated-attribute-to-child = [deprecation] Atributu `{ $attribute }` iha `<{ $component }>` la uza ona; uza oan `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Valór `{ $value }` husi atributu `{ $attribute }` iha `<{ $component }>` la uza ona; uza `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` bele halo plurál ba lian Inglés de'it, entaun nia testu la muda iha dokumentu ne'ebé hakerek ho { $locale }. Hakerek rasik forma plurál, ka tau ho atributu `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elementu `<{ $tag }>` la'ós elementu Doenet ne'ebé rekoñese.

schema-element-not-allowed-at-root = Elementu `<{ $tag }>` la permite iha abut dokumentu nian.

schema-element-not-allowed-inside = Elementu `<{ $tag }>` la permite iha laran husi `<{ $parent }>`.

schema-attribute-unrecognized = Elementu `<{ $tag }>` laiha atributu ho naran `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atributu `{ $attribute }` husi elementu `<{ $tag }>` tenke lista ida ne'ebé kada item mak ida husi: { $allowed }
       *[other] Atributu `{ $attribute }` husi elementu `<{ $tag }>` tenke ida husi: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Naran variante la válidu ba select.  Naran variante { $variantName } mosu iha opsaun { $numOptions } maibé númeru atu hili mak { $numToSelect }.

select-variant-name-without-options = Iha variante determinadu ba select maibé laiha opsaun determinadu ba naran variante posivel: { $variantName }.

select-variant-name-not-possible = Naran variante { $variantName } ne'ebé determina ba select la'ós naran variante posivel.

select-too-few-options = La bele hili komponente { $numToSelect } husi { $numOptions } de'it.

select-from-sequence-too-few-values = La bele hili valór { $numToSelect } husi sequence ho naruk { $length }.

select-from-sequence-indices-count-mismatch = Númeru índise ne'ebé determina ba select tenke hanesan ho númeru atu hili

select-from-sequence-indices-not-integers = Índise hotu ne'ebé determina ba select tenke númeru inteiru

select-from-sequence-index-excluded = Índise selectfromsequence ne'ebé determina ne'e hasai ona

select-from-sequence-indices-excluded-combination = Índise selectfromsequence ne'ebé determina ne'e kombinasaun ne'ebé hasai ona

select-from-sequence-coprime-not-positive-integers = La bele hili kombinasaun coprime tanba buat ne'ebé hili la'ós númeru inteiru pozitivu.

select-from-sequence-coprime-common-factor = La bele hili númeru coprime. Valór posivel hotu iha fatór hanesan. (Valór "from" ka "to" ne'ebé determina tenke coprime ho "step".)

select-from-sequence-coprime-single-number = La bele hili kombinasaun coprime husi númeru ida de'it ne'ebé la'ós 1.

select-from-sequence-excluded-too-many-combinations = Hasai liu 70% husi kombinasaun sira iha selectFromSequence

select-from-sequence-coprime-none-found = La bele hili númeru coprime. Valór posivel hotu iha fatór hanesan.

select-from-sequence-too-few-unique-values = La bele hili valór úniku { $numToSelect } husi sequence ho naruk { $numPossibleValues }

select-prime-numbers-too-few-values = La bele hili valór { $numToSelect } husi lista prima ho naruk { $numValues }

select-prime-numbers-values-count-mismatch = Númeru valór ne'ebé determina ba select tenke hanesan ho númeru atu hili

select-prime-numbers-values-not-prime = Valór hotu ne'ebé determina ba select prime number tenke iha lista prima

select-prime-numbers-values-excluded-combination = Valór selectPrimeNumbers ne'ebé determina ne'e kombinasaun ne'ebé hasai ona

select-prime-numbers-excluded-too-many-combinations = Hasai liu 70% husi kombinasaun sira iha selectPrimeNumbers

select-random-combination-fluke = Tanba sorte raru tebes, la bele hili kombinasaun valór randómiku

select-random-value-fluke = Tanba sorte raru tebes, la bele hili valór randómiku
