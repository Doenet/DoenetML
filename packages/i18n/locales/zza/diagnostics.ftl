# Zazaki (Zazakî / Kirmanckî) diagnostics: the errors and warnings the core and
# the language server put in front of whoever is looking at the screen.
# Translated from `locales/en/diagnostics.ftl`, which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Vate written standard, Zazaki Latin alphabet with the dotless `ı`, as in the
# other three files of this locale.
#
# **Element names, attribute names and values are not words.** `through`,
# `endpoint`, `midpointOffset`, `numDimensions`, `math`, `text`, `boolean`,
# `coprime`, `selectFromSequence` and every `<tag>` written into these
# sentences are DoenetML identifiers and stay in English exactly as they are.
# The backticks and angle brackets around them are this catalog's punctuation.
#
# **No message here selects on a count.** English distinguishes "is ignored"
# from "are ignored"; Zazaki does not change the noun after a numeral and the
# verb does not fork here either, so each of those messages is written once as
# `*[other]` and the count argument goes unused. The symbolic selectors —
# `$reason`, `$type`, `$mode`, `$suggestion`, `$isList` and the rest — keep
# every branch English has, because those keys are compared letter for letter
# and a renamed one is a branch nothing can reach.
#
# **Vocabulary chosen once and used throughout**, so a correction is one
# search: «hesab nêbeno» for *is ignored*, «diyarkerde» for *specified*,
# «xelet» for *invalid*, «erj» for *value*, «xusûsîyet» for *attribute*,
# «komponent» for *component*, «ganî» for *must*. `komponent`, `referans`,
# `matrîs`, `tîp`, `fonksîyon`, `vektor`, `parabol`, `îndeks` and `varyant`
# are international loans kept rather than coined.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
       *[other] Dı endpoint diyarkerde bê, { $attributes } hesab nêbeno.
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
       *[other] Yew endpoint û yew midpoint pîya diyarkerde bê, { $attributes } hesab nêbeno.
    }

line-segment-midpoint-offset-without-midpoint = Bê midpoint, midpointOffset tu tesîr nêkeno

## `<line>`

line-points-undetermined-dimensions = Xet noqteyanê ke boyıtê xo diyar nîyê ra vêreno.

line-points-too-few-dimensions = Ganî xet noqteyanê ke kêmî dı boyıtî de yê ra bıvêro.

line-points-depend-on-variables = Xet noqteyanê ke nê varyablan ra girêdayeyê ra vêreno: { $variables }.

line-equation-invalid-format = Varyablanê { $variable1 } û { $variable2 } de formato xelet seba denklemê xetî.

## `<ray>`

ray-overprescribed-through = Nîmxet through, endpoint û direction ra diyar bîyo.  Through o diyarkerde hesab nêbeno.

ray-dimension-mismatch = Nîmxetî de numDimensions ha pêrû nêyeno.

## `<vector>`

vector-overprescribed-head = Vektor head, tail û displacement ra diyar bîyo.  Head o diyarkerde hesab nêbeno.

vector-dimension-mismatch = Vektorî de numDimensions ha pêrû nêyeno.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` ser o antış nêbeno, çıke nearestPoint sey erjêko halî çin o.

constrain-to-without-nearest-point = `<{ $component }>` ser o sînordarkerdış nêbeno, çıke nearestPoint sey erjêko halî çin o.

constrain-to-interior-without-nearest-point = `<{ $component }>` zerre ser o sînordarkerdış nêbeno, çıke nearestPoint sey erjêko halî çin o.

## `<choiceInput>`

choice-input-label-position-ignored = Seba choiceInput ê ke inline nîyo, labelPosition hesab nêbeno

## Ordering children by index

choice-input-indices-count-mismatch = Îndeksê choiceInput î hesab nêbenê, çıke amorê îndeksan û amorê domananê choice pêrû nêyenê.

pretzel-indices-count-mismatch = Îndeksê problem î hesab nêbenê, çıke amorê îndeksan û amorê domananê problemî pêrû nêyenê.

shuffle-indices-count-mismatch = Îndeksê shuffle î hesab nêbenê, çıke amorê îndeksan û amorê komponentan pêrû nêyenê.

indices-ignored-out-of-range = Îndeksê { $component } î hesab nêbenê, çıke tayê îndeksî sînor ra teber ê.

pretzel-indices-repeated = Îndeksê pretzel î hesab nêbenê, çıke tayê îndeksî tekrar bîyê.

pretzel-circuit-first-index = Modê circuit de îndeksê pretzel î hesab nêbenê, çıke ganî îndekso verên 1 bo.

## `<shuffle>` and `<sort>`

string-children-need-type = Seba ke `<{ $component }>` domananê string î reyde bıxebıtîyo, ganî xusûsîyeta type diyar bıbo.

invalid-type-defaulting-to-math = Seba komponentê { $component } tîpo xelet: { $type }. Ganî math, text, number ya zî boolean bo. Standard sey math ronîyeno.

string-not-valid-component-to-arrange = String "{ $value }" seba { $component } komponentêko meqbul nîyo. Hesab nêbeno.

## Types and variables

invalid-type-defaulting-to-number = Tîpo xelet { $type }, tîp sey number ronîyeno.

invalid-variable-value = Erjê varyabli xelet o: `{ $value }`

## Variants

variant-index-must-be-number = Ganî îndeksê varyantî { $index } amor bo

variant-index-must-be-integer = Ganî îndeksê varyantî { $index } amorêka tam bo

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` seba peymitışê absolutî nêvırazîyayo. Herayîyî sey nisbî ronîyenê.

side-by-side-absolute-margins = `<{ $component }>` seba peymitışê absolutî nêvırazîyayo. Kenarî sey nisbî ronîyenê.

side-by-side-no-block-child = `<{ $component }>` xelet o: ganî kêmî yew domano blok bıbo.

## `<label>`

label-for-ignored-on-graphical = `<label>`ê grafîkî ser o xusûsîyeta `for` hesab nêbena.

label-for-must-resolve-to-one = Ganî xusûsîyeta `for` ya `<label>`î tenya yew komponentî bımocno.

label-for-unresolved = Xusûsîyeta `for` ya `<label>`î tu komponentî nêmocnaye.

label-for-answer-with-authored-inputs = Xusûsîyeta `for` ya `<label>`î `<answer>`êk mocnena ke înputê xo nuştox ra ameyê nuştış; direkt înputî bımocne.

label-for-answer-without-input = Xusûsîyeta `for` ya `<label>`î `<answer>`êk mocnena ke înputê ci çin o.

label-for-must-reference-input-or-answer = Ganî xusûsîyeta `for` ya `<label>`î yan yew înput yan zî yew answer bımocno.

## Accessibility

accessibility-short-description-or-decorative = Seba resayîşî, ganî `<{ $component }>` yan şınasnayîşêko kilm bıgêro yan zî sey decorative diyar bıbo.

accessibility-video-short-description = Seba resayîşî, ganî `<video>` şınasnayîşêko kilm bıgêro.

accessibility-input-short-description-or-label = Seba resayîşî, ganî `<{ $component }>` şınasnayîşêko kilm ya zî yew label bıgêro.

accessibility-answer-input-short-description-or-label = Seba resayîşî, ganî `<answer>`ê ke înputêk vıraşeno şınasnayîşêko kilm ya zî yew label bıgêro.

accessibility-short-description-contains-math = Ganî şınasnayîşê kilmî komponentanê matematîkî yê sey `<{ $component }>` nêgêrê. Matematîkî çekuyan reyde binuse.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Seba metnê sernameyê qısımî kontrastê { $colorName } î bes nîyo (modê tarî) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kêmî { $threshold }:1 lazım o).
       *[other] Seba metnê sernameyê qısımî kontrastê { $colorName } î bes nîyo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kêmî { $threshold }:1 lazım o).
    }

## `<circle>`

circle-through-points-non-numerical = Noqteyî erjê amorkî nêgêrê; `<circle>`ê ke { $count } noqteyan ra vêreno hema nêvırazîyayo.

circle-too-many-through-points = 3 noqteyan ra vêşî ra vêrdışê çemberî hesab nêbeno.

circle-overprescribed-radius-center-points = Bi radyus, merkez û noqteyanê diyarkerdeyan pîya çember hesab nêbeno.

circle-center-with-multiple-points = Bi merkezêko diyarkerde 1 noqte ra vêşî ra çember hesab nêbeno.

circle-radius-too-small = Çember hesab nêbeno: mabênê dı noqteyan { $distance } o, no ra ke radyuso diyarkerde { $radius } tay o.

circle-radius-with-many-points = Bi radyusêko diyarkerde dı noqteyan ra vêşî ra çember nêvırazîyeno.

circle-invalid-center-or-through-points = Merkez ya zî noqteyê çemberî xelet ê.

circle-radius-center-with-multiple-points = Bi merkezêko diyarkerde 1 noqte ra vêşî ra radyusê çemberî hesab nêbeno.

circle-change-radius-non-numerical = Noqteyê ke erjê amorkî nêgêrê ser o radyusê çemberî nêvurîyeno

circle-radius-with-points-non-numerical = Erjê amorkî çin ê; bi radyusêko diyarkerde yew noqte ra vêşî ra çember nêvırazîyeno.

circle-change-center-non-numerical = Noqteyê ke erjê amorkî nêgêrê ser o vurnayîşê merkezê çemberî hema nêvırazîyayo.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
       *[other] Seba fonksîyonî boyıtê tarîfçoli bes nîyê. Tarîfçol { $intervals } navberan gêno, la fonksîyon { $inputs ->
           *[other] { $inputs } înputan
        } gêno.
    }

function-domain-invalid-format = Seba tarîfçolê fonksîyonî formato xelet.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Maksîmumê fonksîyonî amorkî nîyo, hesab nêbeno.
        [minimum] Mînîmumê fonksîyonî amorkî nîyo, hesab nêbeno.
        [extremum] Ekstremumê fonksîyonî amorkî nîyo, hesab nêbeno.
        [point] Noqteya fonksîyonî amorkî nîya, hesab nêbena.
        [slope] Meylê fonksîyonî amorkî nîyo, hesab nêbeno.
       *[other] { $type } ê fonksîyonî amorkî nîyo, hesab nêbeno.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Maksîmumê fonksîyonî veng o, hesab nêbeno.
        [minimum] Mînîmumê fonksîyonî veng o, hesab nêbeno.
        [extremum] Ekstremumê fonksîyonî veng o, hesab nêbeno.
        [point] Noqteya fonksîyonî venga, hesab nêbena.
       *[other] { $type } ê fonksîyonî veng o, hesab nêbeno.
    }

function-points-too-close = Fonksîyon dı noqteyan gêno ke cayê inan zaf nezdî yê. Fonksîyon tarîf nêbeno.

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] Îterasyonê fonksîyonî tenya wexto ke amorê înputan û amorê outputan pêrû bêrê beno. Nê fonksîyonî { $inputs } înputî û { $outputs ->
           *[other] { $outputs } outputî
        } estê.
    }

## `<sequence>`

sequence-invalid-length = Derganîya rêzeyî xelet a.  Ganî amorêka tam a ke negatîf nîya bo.

sequence-invalid-step = Gamê rêzeyî xelet o.  Seba rêzeyê tîpê { $type } î ganî amor bo.

sequence-invalid-endpoint-number = Rêzeyê amoran de "{ $attribute }" xelet o.  Ganî amor bo.

sequence-invalid-endpoint-letters = Rêzeyê herfan de "{ $attribute }" xelet o.  Ganî komikêka herfan bo.

sequence-invalid-endpoint = Rêzeyî de "{ $attribute }" xelet o.

select-from-sequence-coprime-not-numbers = Amorî nêweçînîyenê, coprime hesab nêbeno

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations diyarkerde yo, coprime hesab nêbeno

## Resolving a `target`

target-not-found = Seba `<{ $source }>` target o xelet: target nêdîya.

target-state-variable-not-found = Seba `<{ $source }>` target o xelet: `<{ $component }>` ser o erjêko halî yo bi namey "{ $property }" nêdîya.

## `<odeSystem>`

ode-system-variables-match-independent = Ganî varyablê `<odeSystem>`î varyablê serbestî ra bînî bê.

ode-system-duplicate-variable-names = Bi nameyanê varyablanê girêdayeyan ê tekrarîn fonksîyonê ODE RHS tarîf nêbenê.

ode-system-rhs-function-error = Fonksîyonê ODE RHS tarîf nêbeno.  Vıraştışê fonksîyonê mathjs de xeta.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Mabênê { $count } xetan de zawiye tarîf nêbena

angle-invalid-through-point = `<angle>`î de through ra noqteya xelete

parabola-vertex-too-many-points = Bi verteksî 1 noqte ra vêşî ra parabol hema nêvırazîyayo.

parabola-too-many-points = 3 noqteyan ra vêşî ra parabol hema nêvırazîyayo.

intersection-too-many-items = Dı çîyan ra vêşî rê kesîşme hema nêvırazîyaya

## Other math components

ionic-compound-not-two-ions = Dı îyonan ra teber terkîbo îyonîk hema nêvırazîyayo.

ionic-compound-needs-cation-and-anion = Terkîbo îyonîk tenya seba yew katyon û yew anyon vırazîyayo.

solve-equations-cannot-evaluate = Denklem hesab nêbi, coka nêçareser bi: { $equation }

math-operators-operand-number-required = Wexto ke operandêko matematîkî vejîyeno, ganî operandNumber diyar bıbo.

eigen-decomposition-failed = Erjê eigenî yê matrîsî hesab nêbî

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
       *[other] `<matchesPattern>`: parametreyê { $parameters } paterni de çin ê, coka her wext bi vengî yenê pêrû.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" fam nêbeno. Ganî none, medium, dense ya zî dı amorê pozîtîfê ke bi valakerdışêk cıya bîyê bo, sey grid="1 0.5". Tu grid nêancîyeno.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` rê fonksîyonêk lazım o ke { $expected ->
        [one] yew output bido, yanî her noqte de meyla y', sey `y - x`
       *[other] dı outputî bidê, yanî her noqte de vektor, sey `(y, -x)`
    }, la fonksîyonê ke dîya { $found ->
       *[other] { $found } outputî
    } dano. { $alternative ->
        [none] Çîyê nêancîyeno.
       *[other] Seba nê fonksîyonî komponent `<{ $alternative }>` o. Çîyê nêancîyeno.
    }

field-function-attribute-ignored-with-child = Fonksîyon komponentî zerre de zî dîyaya, coka xusûsîyeta `function` hesab nêbena; ya zerre yena xebıtnayış. Fonksîyonî tenya yew rêça de bide.

field-variables-ignored =
    `<{ $component }>`: xusûsîyeta `variables` varyablanê îfadeyêka ke direkt komponentî zerre de nusîyaya name kena. { $reason ->
        [function-child] Fonksîyon tîya de sey domanêko `<function>` dîyayo, o zî varyablanê xo bi xo name keno, coka `variables` hesab nêbena.
       *[no-expression] Tîya de wına îfade çin a, coka `variables` hesab nêbena.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure renderer de xLabelPosition="left" nêeşkeno bêro xebıtnayış; sey rastî tewır beno.

prefigure-y-label-position-unsupported = `<graph>`: prefigure renderer de yLabelPosition="bottom" nêeşkeno bêro xebıtnayış; sey corî tewır beno.

prefigure-invalid-axis-bounds = `<graph>`: seba çarnayîşê prefigure î sînorê eksenî xelet ê; bbox o standard (-10,-10,10,10) xebıtîyeno.

prefigure-invalid-width = `<graph>`: seba çarnayîşê prefigure î herayî xelet a; herayîya standard 425 xebıtîyena.

prefigure-invalid-aspect-ratio = `<graph>`: seba çarnayîşê prefigure î aspectRatio xelet o; nisbeto standard 1 xebıtîyeno.

prefigure-grid-spacing-too-fine = `<graph>`: seba sînoranê eksenî mabênê xetanê gridî zaf teng o; prefigure renderer de grid nêancîyeno.

prefigure-annotations-not-rendered = `<graph>`: wexto ke renderer o PreFigure nêxebıtîyeno, annotationî nêancîyenê.

multiple-annotations-children = `<graph>` de zaf domanê `<annotations>` dîyayî; peyênî ra teber pêro hesab nêbenê.

## Referring to other components

copy-unrecognized-component-type = Tîpê komponentî yo nenas nêeşkeno bêro dergkerdış ya kopyakerdış: { $type }.

copy-prop-not-found = Komponentê tîpê { $component } ser o prop ê { $property } nêdîya

collect-no-source = Seba collect tu çıme nêdîya.

collect-invalid-component-type = Komponentê tîpê `<{ $component }>` nêeşkenê bêrê arêdayîş, çıke no tîpo komponentî xelet o.

reference-index-unavailable = Îndeksê `{ $reference }` nêeşkeno bêro referans dayîş

## `<callAction>`

component-action-unavailable = Komponentê `{ $reference }` ser o { $action } nêgazîyeno

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Şeklê datay xelet o.  Derganîya rêzeyan pêrû nêyena. componentIdx de dîya :{ $componentIdx }

data-frame-duplicate-column-names = Data de nameyê sıtûnan tekrar bîyê.  componentIdx de dîya :{ $componentIdx }

data-frame-missing-column-name = Data de nameyê yew sıtûnî kêmî yo.  componentIdx de dîya :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Award ê nê cewabî cewabê xo yê rusnayeyî ser o ronışto, no zî tewırêko nêpawite ano.

answer-max-num-attempts-in-section-wide-check-work = Zerreyê konteynerêko sectionWideCheckWork de `<answer>` ser o `maxNumAttempts` ronayîş tu tesîr nêkeno, çıke amorê ceribnayışan konteyner ra yeno îdarekerdış. `maxNumAttempts` konteynerî ser o rone.

nested-section-wide-check-work-max-num-attempts = Konteynerêko sectionWideCheckWork ke zerreyê konteynerêko bînî yo sectionWideCheckWork de yo, ci ser o `maxNumAttempts` ronayîş tu tesîr nêkeno, çıke amorê ceribnayışan konteynerê teberênî ra yeno îdarekerdış. `maxNumAttempts` konteynerê teberênî ser o rone.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
       *[other] Bê symbolicEquality xusûsîyetê { $attributes } tu tesîr nêkenê.
    }

answer-invalid-type = Seba cewabî tîpo xelet: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Komponentê `<{ $component }>`î name nêgêno, coka seba xusûsîyeta modulî nêeşkeno bêro xebıtnayış

module-attribute-name-already-defined = Komponentê `<{ $component } name="{ $name }">` seba modulî sey xusûsîyet nêeşkeno bêro xebıtnayış, çıke tîpê komponentî `<module>` de xusûsîyeta "{ $name }" jû ra tarîf bîya.

conditional-content-condition-ignored = `<conditionalContent>`ê ke domanê xo case ya zî else estê ser o xusûsîyeta `condition` hesab nêbena.

slider-markers-type-mismatch = Tîpê markeran û tîpê sliderî pêrû nêyenê.

pretzel-problem-needs-statement-and-answer = Pretzel o xelet: ganî her `<problem>` yew `<statement>` û yew `<answer>` bıgêro.

pretzel-circuit-first-problem-distractor = Pretzel o xelet: mode="circuit" de `<problem>`o verên nêeşkeno distractor bo.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
       *[other] Seba xusûsîyeta `{ $attribute }` erjê xeletî { $values }; hesab nêbenê.
    }

attribute-must-be-references = Seba xusûsîyeta `{ $attribute }` erjo xelet `{ $value }`. Ganî xusûsîyet referansanê ke bi `$` dest pêkenê ra bo.

math-input-invalid-function-names = <mathInput>: { $attribute } de nameyê fonksîyonan ê xeletî hesab nêbî: { $names }. Ganî beşê mocnayîşî yê her namey kêmî 2 karakterî bo (herfî ya zî xetikî); dıma yew `|<mathspeak alternative>` eşkeno bêro.

## Building components from the source

component-type-invalid = Tîpê komponentî xelet o: `<{ $componentType }>`

attribute-repeated = Xusûsîyeta { $attribute } tekrar nêbena.

attribute-invalid-for-component = Seba komponentê tîpê `<{ $componentType }>` xusûsîyeta "{ $attribute }" xelet a.

## Style definition contrast

style-definition-insufficient-contrast =
    Tarîfê stîlî { $styleNumber } de kontrast bes nîyo, { $context ->
        [text-on-background] rengê metnî zemin dı
        [high-contrast] rengo kontrasto berz kanvas dı
        [line] rengê xetî kanvas dı
        [marker] rengê markerî kanvas dı
       *[text-on-canvas] rengê metnî kanvas dı
    }{ $mode ->
        [dark] { " (modê tarî)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kêmî { $threshold }:1 lazım o).

style-definition-dark-mode-text-background-contrast =
    Tarîfê stîlî { $styleNumber } de rengê diyarkerdeyî seba modê roştî kontrasto bes danê, la rengê modê tarî yê ke nînan ra vejîyayê de kontrastê rengê metnî zemin dı bes nîyo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kêmî { $threshold }:1 lazım o). { $suggestion ->
        [available] Seba ke modê tarî de kontrast bes bo, yan kontrastê modê roştî zêde ke (mesela { $lightAttribute }="{ $lightColor }" rone) yan zî rengê modê tarî bıvurne ({ $darkAttribute }="{ $darkColor }" rone).
       *[none] Seba ke modê tarî de kontrast bes bo, kontrastê modê roştî zêde ke ya zî rengan textColorDarkMode û/ya backgroundColorDarkMode reyde bıvurne.
    }

style-definition-dark-mode-text-canvas-contrast =
    Tarîfê stîlî { $styleNumber } de rengê metnî yo diyarkerde seba modê roştî kontrasto bes dano, la rengê metnî yo modê tarî ke ci ra vejîyayo kanvas dı kontrasto bes nêdano ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kêmî { $threshold }:1 lazım o). { $suggestion ->
        [available] Seba ke modê tarî de kontrast bes bo, yan kontrastê modê roştî zêde ke (mesela textColor="{ $lightColor }" rone) yan zî rengê modê tarî bıvurne (textColorDarkMode="{ $darkColor }" rone).
       *[none] Seba ke modê tarî de kontrast bes bo, kontrastê modê roştî zêde ke ya zî rengê vejîyaye textColorDarkMode reyde bıvurne.
    }

section-multiple-style-palettes = Yew qısım tenya yew <stylePalette> eşkeno bıweçîno; peyên xebıtîyeno.

## Unique variants

variant-num-to-select-not-non-negative-integer = varyantê { $component } î yê xasî tesbît nêbenê, çıke numToSelect amorêka tam a ke negatîf nîya nîyo.

variant-num-to-select-not-constant-number = varyantê { $component } î yê xasî tesbît nêbenê, çıke numToSelect amorêka sabîte nîyo.

variant-with-replacement-not-constant-boolean = varyantê { $component } î yê xasî tesbît nêbenê, çıke withReplacement booleano sabît nîyo.

variant-select-weight-disables-unique = Eke yew opsîyon selectWeight ya zî selectForVariants bıgêro, seba select varyantê xasî nêxebıtîyenê

variant-coprime-undetermined = varyantê { $component } î yê xasî tesbît nêbenê, çıke tesbît nêbeno ka coprime her wext şaş o.

variant-attribute-not-constant = varyantê { $component } î yê xasî tesbît nêbenê, çıke { $attribute } sabît nîyo.

variant-attribute-not-number = varyantê { $component } î yê xasî tesbît nêbenê, çıke { $attribute } amor nîyo.

variant-attribute-wrong-type-for-sequence =
    varyantê { $component } ê tîpê { $type } î yê xasî tesbît nêbenê, çıke { $attribute } { $expected ->
        [letters-combination] komikêka herfan
        [math-expression] îfadeyêka matematîkî ya meqbule
        [integer] amorêka tam
       *[number] amor
    } nîyo.

variant-length-not-integer = varyantê { $component } î yê xasî tesbît nêbenê, çıke length amorêka tam nîya.

variant-sort-not-implemented = varyantê { $component } ê ke sort gêno yê xasî hema nêvırazîyayê

variant-exclude-combinations-not-implemented = varyantê { $component } ê ke excludeCombinations gêno yê xasî hema nêvırazîyayê

variant-math-exclude-not-implemented = varyantê { $component } ê tîpê math ê ke exclude gêno yê xasî hema nêvırazîyayê

variant-non-constant-exclude-not-implemented = varyantê { $component } ê ke exclude yo nêsabît gêno yê xasî hema nêvırazîyayê

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: grafîkî de renderer o prefigure ci nêgêno; verarde nêancîya.

prefigure-descendant-invalid-geometry = { $subject }: geometrî tam nîya ya zî fînît nîya; verarde nêancîya.

prefigure-curve-label-omitted = { $subject }: elementê çewtan ê çarnayeyan ser o label nêgêrîyeno; label nêancîya.

prefigure-curve-unsupported-definition-type = { $subject }: tîpê tarîfê fonksîyonê çewtî '{ $definitionType }' nêgêrîyeno; verarde nêancîya.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves ser o xusûsîyeta flipFunctions nêgêrîyena; verarde nêancîya.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves ser o tenya fonksîyonê domanan ê tîpê formula gêrîyenê; verarde nêancîya.

prefigure-label-position-unsupported =
    { $subject }: seba { $labelKind ->
        [line-family] labelê malbatê xetî
       *[point] labelê noqte
    } labelPosition '{ $labelPosition }' nêgêrîyeno; hîzakerdışê standard ê PreFigure xebıtîya.

prefigure-fill-style-unsupported = { $subject }: PreFigure stîlê pırrkerdışî '{ $fillStyle }' nêgêno; pırrkerdışêko sade xebıtîyeno.

prefigure-line-style-unknown = { $subject }: stîlê xetî yo nenas '{ $lineStyle }' outputê PreFigure ra vejîya.

prefigure-marker-style-mapped-to-diamond = { $subject }: stîlê markerî '{ $markerStyle }' PreFigure de sey stîlê 'diamond' ancîya.

prefigure-marker-style-unsupported = { $subject }: PreFigure stîlê markerî '{ $markerStyle }' nêgêno; stîlo standard xebıtîya.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` xelet o; hedef nêdîya. Annotation nêancîya.

annotation-ref-multiple-targets = `<annotation>`: `ref` zaf hedefan mocneno; hedefo verên xebıtîyeno.

annotation-ref-outside-graph = `<annotation>`: `ref` xelet o; hedef grafîkî ra teber o. Annotation nêancîya.

annotation-ref-unsupported-target = `<annotation>`: `ref` xelet o; çarnayîşê prefigure de hedef objeyêko grafîkî yo gêrîyaye nîyo. Annotation nêancîya.

annotation-text-missing = `<annotation>`: `text` kêmî yo ya zî veng o; metno veng vejîyeno.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Girêdayîşêko çerxin dîya.
       *[other] Komponentê `<{ $componentType }>` reyde girêdayîşêko çerxin dîya.
    }

reference-no-referent = Seba referansê `{ $reference }` tu merc nêdîya

reference-multiple-referents = Seba referansê `{ $reference }` zaf mercî dîyayî

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` de seba xusûsîyeta { $attribute } formato xelet.

children-invalid = Seba `<{ $componentType }>` domanê xeletî: domanê xeletî dîyayî: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Seba xusûsîyeta `{ $attribute }` erjo xelet `{ $value }`, erjê `{ $default }` xebıtîyeno

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Versîyonê DoenetML î { $version } nêdîya.
       *[other] Versîyonê DoenetML î { $version } nêdîya. Versîyonê { $fallback } xebıtîyeno
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML o xelet: { $content }

parse-tag-missing-close-tag = DoenetML o xelet: Etîketê `{ $tag }` etîketê xo yê girewtışî nêgêno. Ganî yan etîketêko bi xo girewte bo yan zî yew `</{ $tagName }>` bo.

parse-tag-error = DoenetML o xelet: Etîketê `<{ $tagName }>` de xeta

parse-attribute-missing-value = DoenetML o xelet: Xusûsîyeta xelete `{ $attribute }` beno ke erjê xo nêgêno.

parse-attribute-invalid = DoenetML o xelet: Xusûsîyeta xelete `{ $attribute }`

parse-attribute-value-invalid = DoenetML o xelet: Erjê xusûsîyeti yo xelet `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML o xelet: Erjê xusûsîyeti yo xelet `{ $value }`. Tırnaxî pêrû nêyenê. Beno ke yew `{ $quote }` kêmî yo

parse-open-tag-name-missing = DoenetML o xelet: Etîketêk bê name dîya, mesela `<`

parse-tag-not-closed = DoenetML o xelet: Etîketê `{ $tag }` nêgirewt (beno ke yew `>` kêmî yo).

parse-self-closing-tag-name-missing = DoenetML o xelet: Etîketêk bê name dîya `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML o xelet: Etîketê `{ $tag }` nêgirewt (beno ke `/>` kêmî yo).

parse-tag-invalid-attributes = DoenetML o xelet: Etîketê `{ $tag }` meqbul nîyo. Beno ke xusûsîyetê ci xeletî yê.

parse-close-tag-name-missing = DoenetML o xelet: Etîketêko girewtış bê name dîya, mesela `</`

parse-attribute-value-unquoted = Ganî erjê xusûsîyetan tırnaxan miyan de bo: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML o xelet: Etîketê girewtışî `{ $tag }` dîya, la etîketê akerdışî yo munasib çin o

parse-close-tag-mismatched = DoenetML o xelet: Etîketê girewtışî pêrû nêyeno. `</{ $expected }>` pawîyayêne. `{ $found }` dîya

parser-node-unconvertible = Node ê { $node } î Dast node de nêçarnîya.

## Names

name-attribute-invalid =
    Nameyê xelet name='{ $name }'. { $reason ->
        [characters] Nameyî tenya herfan, amoran, xetikanê bınî û xetikan gênê.
       *[start] Ganî nameyî bi herfêk dest pêkerê.
    }

component-name-invalid-start = Nameyê komponentî yo xelet "{ $name }". Ganî nameyî bi herfêk dest pêkerê.

## `<answer>` sugar

answer-video-watched-missing-video = Ganî cewabê tîpê videoWatched xusûsîyeta video bıgêro

answer-video-watched-video-not-reference = Ganî xusûsîyeta video ya cewabê tîpê videoWatched yew referans bo

answer-name-not-single-text = Ganî xusûsîyeta nameyê cewabî tenya yew domanê text bıgêro

## Referencing another document

external-doenetml-recursion-limit = Zaf astê rekursîyonî ra DoenetML ê teberî nêameyî girewtış. Referansêko çerxin esto?

external-doenetml-unavailable = { $attribute }="{ $uri }" ra DoenetML nêameyî girewtış

external-doenetml-type-mismatch = { $attribute }="{ $uri }" ra DoenetML ê xelet ame: tîpê komponentî "{ $componentType }" reyde pêrû nêame

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Xusûsîyeta `{ $from }` kane bîya; cayê ci de `{ $to }` bıxebıtne.
       *[other] [deprecation] `<{ $component }>` ser o xusûsîyeta `{ $from }` kane bîya; cayê ci de `{ $to }` bıxebıtne.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Xusûsîyeta `{ $from }` kane bîya û hesab nêbena, çıke `{ $to }` zî diyarkerde yo.
       *[other] [deprecation] `<{ $component }>` ser o xusûsîyeta `{ $from }` kane bîya û hesab nêbena, çıke `{ $to }` zî diyarkerde yo.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` ser o xusûsîyeta `{ $attribute }` kane bîya û hesab nêbena.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` ser o xusûsîyeta `{ $attribute }` kane bîya; cayê ci de domanêko `<{ $child }>` bıxebıtne.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` ser o erjê xusûsîyeta `{ $attribute }` yo `{ $value }` kane bîyo; cayê ci de `{ $to }` bıxebıtne.


## Language coverage

pluralize-english-only = `<pluralize>` tenya Îngılızkî eşkena zafhûmar bıkero, coka dokumandê ke bi { $locale } nusîyayê de metno ci nêvurîyeno. Şeklê zafhûmarî direkt binuse, ya zî xusûsîyeta `pluralForm` reyde diyar ke.


## Checking against the schema

schema-element-unrecognized = Elementê `<{ $tag }>` elementêko Doenet o nasbîyaye nîyo.

schema-element-not-allowed-at-root = Elementê `<{ $tag }>` koka dokumandî de nêronîyeno.

schema-element-not-allowed-inside = Elementê `<{ $tag }>` `<{ $parent }>` zerre de nêronîyeno.

schema-attribute-unrecognized = Elementê `<{ $tag }>` xusûsîyeta bi namey `{ $attribute }` nêgêno.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Ganî xusûsîyeta `{ $attribute }` ya elementê `<{ $tag }>` lîsteyêka ke her cayê ci nînan ra yew o bo: { $allowed }
       *[other] Ganî xusûsîyeta `{ $attribute }` ya elementê `<{ $tag }>` nînan ra yew bo: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Seba select nameyê varyantî xelet o.  Nameyê varyantî { $variantName } { $numOptions } opsîyonan de vêreno, la amorê weçînayîşî { $numToSelect } o.

select-variant-name-without-options = Seba select tayê varyantî diyarkerde yê, la seba nameyê varyantî yo mumkin tu opsîyon diyarkerde nîyo: { $variantName }.

select-variant-name-not-possible = Nameyê varyantî { $variantName } ke seba select diyarkerde yo, nameyêko mumkin nîyo.

select-too-few-options = Tenya { $numOptions } ra { $numToSelect } komponentî nêweçînîyenê.

select-from-sequence-too-few-values = Rêzeyêko { $length } derganî ra { $numToSelect } erjî nêweçînîyenê.

select-from-sequence-indices-count-mismatch = Ganî amorê îndeksanê ke seba select diyarkerde yê û amorê weçînayîşî pêrû bêrê

select-from-sequence-indices-not-integers = Ganî îndeksê ke seba select diyarkerde yê pêro amorê tamî bê

select-from-sequence-index-excluded = Îndeksê selectfromsequence ê diyarkerdeyî teber de mendo

select-from-sequence-indices-excluded-combination = Îndeksê selectfromsequence ê diyarkerdeyî komikêka teberdemendiye ya

select-from-sequence-coprime-not-positive-integers = Amorê tamî yê pozîtîfî nêweçînîyenê, coka komikê coprime nêweçînîyenê.

select-from-sequence-coprime-common-factor = Amorê coprime nêweçînîyenê. Erjê mumkinî pêro yew faktorê hewpar gênê. (Ganî erjê "from" ya zî "to" ê diyarkerdeyî "step" reyde coprime bê.)

select-from-sequence-coprime-single-number = Amorêka tenya ke 1 nîya ra komikê coprime nêweçînîyenê.

select-from-sequence-excluded-too-many-combinations = selectFromSequence de komikan ra %70 ra vêşî teber de mendo

select-from-sequence-coprime-none-found = Amorê coprime nêweçînîyayî. Erjê mumkinî pêro yew faktorê hewpar gênê.

select-from-sequence-too-few-unique-values = Rêzeyêko { $numPossibleValues } derganî ra { $numToSelect } erjê xasî nêweçînîyenê

select-prime-numbers-too-few-values = Lîsteyêka amoranê asalan ke { $numValues } derganî ya ra { $numToSelect } erjî nêweçînîyenê

select-prime-numbers-values-count-mismatch = Ganî amorê erjanê ke seba select diyarkerde yê û amorê weçînayîşî pêrû bêrê

select-prime-numbers-values-not-prime = Ganî erjê ke seba weçînayîşê amoranê asalan diyarkerde yê lîsteya amoranê asalan de bê

select-prime-numbers-values-excluded-combination = Erjê selectPrimeNumbers ê diyarkerdeyî komikêka teberdemendiye ya

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers de komikan ra %70 ra vêşî teber de mendo

select-random-combination-fluke = Bi şansêko zaf kêm, komika erjanê tesadufîyan nêweçînîya

select-random-value-fluke = Bi şansêko zaf kêm, erjêko tesadufî nêweçînîya

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` matematîkî zerre de nêancîyeno; îfade sey ke înputî hema nêeşkayêne bêrê zerrekerdış ancîyeno. { $reason ->
        [not-inline] Îfadeyêk zerre de tenya înputê weçînayîşî yo `inline` beno; bê `inline` o blokêko bınikan o.
        [expanded] Înputê metnî yo `expanded` qutîyêka zafrêzeyine ya, no zî îfade zerre rê zaf gırd o.
        [on-graph] Grafîkî ser o îfade sey yew resmî ancîyena, tede zî ca çin o.
       *[relative-width] `width` ê ci nisbî yo (yew ji sedî ya zî `em`), îfade zerre de çîyê ke pê bêro peymitış çin o. Herayî bi wehîdanê absolutan, mesela `px`, bide.
    }
