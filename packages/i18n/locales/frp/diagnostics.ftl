# Arpitan / Franco-Provençal (arpetan) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** Latin script, in **ORB** (*Orthographe de
# Référence B*, Stich 2003), the supradialectal spelling, as `chrome.ftl`
# sets it out: «ê é è â ô», the «cll» / «gll» digraphs, silent etymological
# finals, the feminine in `-a`.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# **What is Arpitan's own.** The frame around every message is: «On pôt pas
# …» for *cannot*, «dêt» / «dêvont» for *must*, «at pas encor étâ fêt» for
# *has not been implemented*, «pas valablo» / «pas valabla» for *invalid*,
# «perce que» for *because*, «donc» for *so*, «a la place» for *instead*,
# «u muens» for *at least*, «tojorn» for *always*, «vouedo» for *empty*,
# «per dèfôt» for *by default*, «dèsuèt» for *deprecated*. The negator is
# the postverbal **«pas»**. Native nouns doing real work here: «legne» (a
# source line, a row), «nom» (name), «lètra» (letter), «fôrma» (shape),
# «racena» (root), «grelye» (grid), «cibla» (target), «têla» (canvas),
# «entrâ» / «sortia» (input / output), «guilyèmèts» (quote marks).
#
# **What is borrowed.** The mathematical and computing nouns are French,
# respelled by ORB's rules: «composant», «atribut», «valor», «variâbla»,
# «endèxo», «sèquence», «èquacion», «matrice», «fonccion», «entèrvalo»,
# «domêno», «parabola», «entèrsèccion», «dèpendença», «rèference»,
# «contrasto», «dèfinicion», «anotacion», «convèrsion», «cation», «anion»,
# «accèssibilitât», «plurièl», «schèma», «vèrsion», «balisa», «module».
# `tag`, `prop` and `bloc` are taken from the markup as written. `WCAG AA`,
# `PreFigure`, `DoenetML` and `mathjs` are names. «ignorâ» is a French loan
# used throughout for *ignored*: Arpitan has no settled term and this is the
# word a speaker would reach for.
#
# **The word for a line.** Here «drêta» is the geometric line the `<line>`
# component means, while «legne» is a row or a line of source text.
# `content.ftl` uses «legne» for the drawn stroke it describes. The split is
# deliberate and is stated in both headers.
#
# **Counts.** `Intl.PluralRules` has **no CLDR data for `frp`** — the tag
# resolves against the runtime's default locale — so no `[zero]`, `[two]`,
# `[few]` or `[many]` branch appears anywhere in this catalog. `[one]` *is*
# kept in the eight counted messages, and it is doing real work: Arpitan
# marks its plural in ORB writing, on the noun («un atribut» / «des
# atributs») and on the verb («est ignorâ» / «sont ignorâs»), so the two
# branches are two different sentences rather than one form written twice.
#
# Arpitan is written with French typography, with a space before `:`, `;`,
# `?` and `!`. That spacing belongs to this catalog and is written out here.
#
# **Weakest first.** A reviewer should attack the parser and schema sections
# (`parse-*`, `schema-*`): they are the messages a beginner meets first, and
# they carry the densest French loan vocabulary in the file. «nuod» for a
# syntax node is the single least certain word here.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } est ignorâ quand los doux bots sont donâs
       *[other] { $attributes } sont ignorâs quand los doux bots sont donâs
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } est ignorâ quand un bot et un mêten sont donâs tôs los doux
       *[other] { $attributes } sont ignorâs quand un bot et un mêten sont donâs tôs los doux
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset at gins d'èfèt sen mêten

## `<line>`

line-points-undetermined-dimensions = Drêta que passe per des pouents de dimensions pas dètèrminâs.

line-points-too-few-dimensions = La drêta dêt passar per des pouents d'u muens doves dimensions.

line-points-depend-on-variables = La drêta passe per des pouents que dèpendont de variâbles : { $variables }.

line-equation-invalid-format = Format pas valablo por l'èquacion d'una drêta dens les variâbles { $variable1 } et { $variable2 }.

## `<ray>`

ray-overprescribed-through = La dèmi-drêta est donâ per through, endpoint et direction. Lo through donâ est ignorâ.

ray-dimension-mismatch = numDimensions corrèspond pas dens ray.

## `<vector>`

vector-overprescribed-head = Lo vèctor est donâ per head, tail et displacement. Lo head donâ est ignorâ.

vector-dimension-mismatch = numDimensions corrèspond pas dens vector.

## Attracting and constraining

attract-to-without-nearest-point = On pôt pas atirar vers un `<{ $component }>` perce qu'at gins de variâbla d'ètat nearestPoint.

constrain-to-without-nearest-point = On pôt pas rèstrendre a un `<{ $component }>` perce qu'at gins de variâbla d'ètat nearestPoint.

constrain-to-interior-without-nearest-point = On pôt pas rèstrendre a l'entèrior d'un `<{ $component }>` perce qu'at gins de variâbla d'ètat nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition est ignorâ por un choiceInput qu'est pas inline

## Ordering children by index

choice-input-indices-count-mismatch = Los endèxos donâs por choiceInput sont ignorâs perce que lor nombro corrèspond pas u nombro d'enfants choice.

pretzel-indices-count-mismatch = Los endèxos donâs por problem sont ignorâs perce que lor nombro corrèspond pas u nombro d'enfants problem.

shuffle-indices-count-mismatch = Los endèxos donâs por shuffle sont ignorâs perce que lor nombro corrèspond pas u nombro de composants.

indices-ignored-out-of-range = Los endèxos donâs por { $component } sont ignorâs perce que quârques-uns sont fôra de portâ.

pretzel-indices-repeated = Los endèxos donâs por pretzel sont ignorâs perce que quârques-uns se rèpètont.

pretzel-circuit-first-index = Los endèxos donâs por pretzel en môdo circuit sont ignorâs perce que lo premiér endèxo dêt étre 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Por que `<{ $component }>` fonccione avouéc des enfants tèxto, un atribut `type` dêt étre donâ.

invalid-type-defaulting-to-math = Lo type { $type } est pas valablo por lo composant { $component }. Dêt étre math, text, number ou boolean. On prend math.

string-not-valid-component-to-arrange = Lo tèxto "{ $value }" est pas un composant valablo por { $component }. Il est ignorâ.

## Types and variables

invalid-type-defaulting-to-number = Lo type { $type } est pas valablo, on bete lo type sur number.

invalid-variable-value = Valor pas valabla d'una variâbla : `{ $value }`

## Variants

variant-index-must-be-number = L'endèxo de variante { $index } dêt étre un nombro

variant-index-must-be-integer = L'endèxo de variante { $index } dêt étre un entiér

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` at pas encor étâ fêt por des mesures absolues. Les lârjors sont betâs en relatif.

side-by-side-absolute-margins = `<{ $component }>` at pas encor étâ fêt por des mesures absolues. Les mârges sont betâs en relatif.

side-by-side-no-block-child = `<{ $component }>` pas valablo : dêt avêr u muens un enfant de bloc.

## `<label>`

label-for-ignored-on-graphical = L'atribut `for` sur un `<label>` grafico est ignorâ.

label-for-must-resolve-to-one = L'atribut `for` sur `<label>` se dêt rèsôdre en justo un composant.

label-for-unresolved = L'atribut `for` sur `<label>` at pas pouessu étre rèsolu en un composant.

label-for-answer-with-authored-inputs = L'atribut `for` sur `<label>` fât rèference a un `<answer>` avouéc des champs d'entrâ ècrits exprès ; fédes rèference u champ dirèctament.

label-for-answer-without-input = L'atribut `for` sur `<label>` fât rèference a un `<answer>` sen champ d'entrâ a ètiquetar.

label-for-must-reference-input-or-answer = L'atribut `for` sur `<label>` dêt fâre rèference a un champ d'entrâ ou ben a un answer.

## Accessibility

accessibility-short-description-or-decorative = Por l'accèssibilitât, `<{ $component }>` dêt avêr una curta dèscripcion ou ben étre donâ come dècoratif.

accessibility-video-short-description = Por l'accèssibilitât, `<video>` dêt avêr una curta dèscripcion.

accessibility-input-short-description-or-label = Por l'accèssibilitât, `<{ $component }>` dêt avêr una curta dèscripcion ou ben una ètiquèta.

accessibility-answer-input-short-description-or-label = Por l'accèssibilitât, un `<answer>` que fât un champ d'entrâ dêt avêr una curta dèscripcion ou ben una ètiquèta.

accessibility-short-description-contains-math = Les curtes dèscripcions dêvont pas contegnir de composants matèmaticos come `<{ $component }>`. Ècrisiéd les matèmatiques avouéc des mots.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } at pas prod de contrasto por lo tèxto du titro de sèccion (môdo sombro) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1 ; fôt u muens { $threshold }:1).
       *[other] { $colorName } at pas prod de contrasto por lo tèxto du titro de sèccion ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1 ; fôt u muens { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Un `<circle>` que passe per { $count } pouents at pas encor étâ fêt quand los pouents ant gins de valors numèriques.

circle-too-many-through-points = On pôt pas calcular un cèrcllo que passe per més de 3 pouents.

circle-overprescribed-radius-center-points = On pôt pas calcular un cèrcllo avouéc lo rayon, lo centro et los pouents donâs ensemblo.

circle-center-with-multiple-points = On pôt pas calcular un cèrcllo avouéc un centro donâ que passe per més d'1 pouent.

circle-radius-too-small = On pôt pas calcular lo cèrcllo : la distance entre los doux pouents étent { $distance }, lo rayon donâ { $radius } est trop petiôt.

circle-radius-with-many-points = On pôt pas fâre un cèrcllo que passe per més de doux pouents avouéc un rayon donâ.

circle-invalid-center-or-through-points = Lo centro ou los pouents de passâjo du cèrcllo sont pas valablos.

circle-radius-center-with-multiple-points = On pôt pas calcular lo rayon d'un cèrcllo avouéc un centro donâ que passe per més d'1 pouent.

circle-change-radius-non-numerical = On pôt pas changiér lo rayon d'un cèrcllo avouéc des pouents pas numèricos

circle-radius-with-points-non-numerical = On pôt pas fâre un cèrcllo que passe per més d'un pouent avouéc un rayon donâ quand les valors sont pas numèriques.

circle-change-center-non-numerical = Changiér lo centro d'un cèrcllo que passe per des pouents avouéc des valors pas numèriques at pas encor étâ fêt.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Y at pas prod de dimensions por lo domêno de la fonccion. Lo domêno at { $intervals } entèrvalo mas la fonccion at { $inputs ->
            [one] { $inputs } entrâ
           *[other] { $inputs } entrâs
        }.
       *[other] Y at pas prod de dimensions por lo domêno de la fonccion. Lo domêno at { $intervals } entèrvalos mas la fonccion at { $inputs ->
            [one] { $inputs } entrâ
           *[other] { $inputs } entrâs
        }.
    }

function-domain-invalid-format = Format pas valablo por lo domêno de la fonccion.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Lo mâximo pas numèrico de la fonccion est ignorâ.
        [minimum] Lo minimo pas numèrico de la fonccion est ignorâ.
        [extremum] L'èxtrèmo pas numèrico de la fonccion est ignorâ.
        [point] Lo pouent pas numèrico de la fonccion est ignorâ.
        [slope] La pende pas numèrica de la fonccion est ignorâ.
       *[other] Lo { $type } pas numèrico de la fonccion est ignorâ.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Lo mâximo vouedo de la fonccion est ignorâ.
        [minimum] Lo minimo vouedo de la fonccion est ignorâ.
        [extremum] L'èxtrèmo vouedo de la fonccion est ignorâ.
        [point] Lo pouent vouedo de la fonccion est ignorâ.
       *[other] Lo { $type } vouedo de la fonccion est ignorâ.
    }

function-points-too-close = La fonccion at doux pouents trop prôches l'un de l'ôtro. On pôt pas dèfenir la fonccion.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Les itèracions d'una fonccion sont possibles solament se lo nombro d'entrâs est ègal u nombro de sorties. Cela fonccion at { $inputs } entrâ et { $outputs ->
            [one] { $outputs } sortia
           *[other] { $outputs } sorties
        }.
       *[other] Les itèracions d'una fonccion sont possibles solament se lo nombro d'entrâs est ègal u nombro de sorties. Cela fonccion at { $inputs } entrâs et { $outputs ->
            [one] { $outputs } sortia
           *[other] { $outputs } sorties
        }.
    }

## `<sequence>`

sequence-invalid-length = Longior pas valabla de la sèquence. Dêt étre un entiér pas nègatif.

sequence-invalid-step = Pâs pas valablo de la sèquence. Dêt étre un nombro por una sèquence du type { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" pas valablo d'una sèquence de nombros. Dêt étre un nombro.

sequence-invalid-endpoint-letters = "{ $attribute }" pas valablo d'una sèquence de lètres. Dêt étre una combinèson de lètres.

sequence-invalid-endpoint = "{ $attribute }" pas valablo de la sèquence.

select-from-sequence-coprime-not-numbers = coprime est ignorâ perce qu'on chouèsét pas des nombros

select-from-sequence-coprime-with-exclude-combinations = coprime est ignorâ perce que excludeCombinations est donâ

## Resolving a `target`

target-not-found = target pas valablo por `<{ $source }>` : on pôt pas trovar la cibla.

target-state-variable-not-found = target pas valablo por `<{ $source }>` : on pôt pas trovar una variâbla d'ètat apelâ "{ $property }" sur un `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Les variâbles de `<odeSystem>` dêvont étre difèrentes de la variâbla endèpendenta.

ode-system-duplicate-variable-names = On pôt pas dèfenir les fonccions du coutiér drêt de l'ÈDO avouéc des noms de variâbles dèpendentes que se rèpètont.

ode-system-rhs-function-error = On pôt pas dèfenir la fonccion du coutiér drêt de l'ÈDO. Èrror a la crèacion de la fonccion mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = On pôt pas dèfenir un angllo entre { $count } drêtes

angle-invalid-through-point = Pouent pas valablo dens lo through de `<angle>`

parabola-vertex-too-many-points = Una parabola avouéc un somèt que passe per més d'1 pouent at pas encor étâ fêta.

parabola-too-many-points = Una parabola que passe per més de 3 pouents at pas encor étâ fêta.

intersection-too-many-items = L'entèrsèccion de més de doux objèts at pas encor étâ fêta

## Other math components

ionic-compound-not-two-ions = Un composâ ionico por ôtra chousa que doux ions at pas encor étâ fêt.

ionic-compound-needs-cation-and-anion = Un composâ ionico at étâ fêt solament por un cation et un anion.

solve-equations-cannot-evaluate = On pôt pas rèsôdre l'èquacion perce qu'ele at pas pouessu étre èvaluâ : { $equation }

math-operators-operand-number-required = Fôt donar un operandNumber quand on trét un opèrando matèmatico.

eigen-decomposition-failed = On pôt pas calcular les valors prôpres de la matrice

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>` : lo paramètro { $parameters } sè trôve pas dens lo modèlo, donc corrèspondrat tojorn a un vouedo.
       *[other] `<matchesPattern>` : los paramètros { $parameters } sè trôvont pas dens lo modèlo, donc corrèspondront tojorn a un vouedo.
    }

## `<graph>`

graph-grid-invalid = `<graph>` : on pôt pas comprendre grid="{ $grid }". Dêt étre none, medium, dense, ou doux nombros positifs sèparâs per un èspâço, come grid="1 0.5". Gins de grelye est trafitâ.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` at fôta d'una fonccion avouéc { $expected ->
        [one] una sola sortia, la pende y' a châque pouent, come `y - x`
       *[other] doves sorties, lo vèctor a châque pouent, come `(y, -x)`
    }, mas la fonccion qu'on l'y at donâ at { $found ->
        [one] { $found } sortia
       *[other] { $found } sorties
    }. { $alternative ->
        [none] Y at ren a trafitar.
       *[other] `<{ $alternative }>` est lo composant por cela fonccion. Y at ren a trafitar.
    }

field-function-attribute-ignored-with-child = L'atribut `function` est ignorâ perce que la fonccion est asse-ben donâ a l'entèrior du composant ; on prend cela de dedens. Donâd la fonccion mâques d'una des doves fôrmes.

field-variables-ignored =
    `<{ $component }>` : l'atribut `variables` apèle les variâbles d'una expression ècrita dirèctament a l'entèrior du composant. { $reason ->
        [function-child] La fonccion est ique donâ come un enfant `<function>`, que apèle ses prôpres variâbles, donc `variables` est ignorâ.
       *[no-expression] Y at gins de tèla expression ique, donc `variables` est ignorâ.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>` : xLabelPosition="left" est pas prês en charge per lo module prefigure ; on prend lo comportament de la posicion drêta.

prefigure-y-label-position-unsupported = `<graph>` : yLabelPosition="bottom" est pas prês en charge per lo module prefigure ; on prend lo comportament de la posicion hôta.

prefigure-invalid-axis-bounds = `<graph>` : limites d'âxos pas valables por la convèrsion en prefigure ; on prend la bbox per dèfôt (-10,-10,10,10).

prefigure-invalid-width = `<graph>` : lârjor pas valabla por la convèrsion en prefigure ; on prend la lârjor per dèfôt 425.

prefigure-invalid-aspect-ratio = `<graph>` : aspectRatio pas valablo por la convèrsion en prefigure ; on prend lo rapôrt per dèfôt 1.

prefigure-grid-spacing-too-fine = `<graph>` : l'èspâçament de la grelye est trop fin por les limites des âxos ; la grelye est omêsa dens lo module prefigure.

prefigure-annotations-not-rendered = `<graph>` : les anotacions seront pas afichiês quand on empllèye pas lo module PreFigure.

multiple-annotations-children = Més d'un enfant `<annotations>` trovâ dens `<graph>` ; tôs fôr lo dèrriér sont ignorâs.

## Referring to other components

copy-unrecognized-component-type = On pôt pas ètendre ou copiar un type de composant pas cognu : { $type }.

copy-prop-not-found = On pôt pas trovar lo prop { $property } sur un composant du type { $component }

collect-no-source = Gins de sôrsa trovâ por collect.

collect-invalid-component-type = On pôt pas ramassar des composants du type `<{ $component }>` perce que 'l est un type de composant pas valablo.

reference-index-unavailable = On pôt pas fâre rèference a l'endèxo `{ $reference }`

## `<callAction>`

component-action-unavailable = On pôt pas apelar { $action } sur lo composant `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Les donâs ant una fôrma pas valabla. Les legnes ant pas la méma longior. Trovâ dens componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Les donâs ant des noms de colones que se rèpètont. Trovâ dens componentIdx :{ $componentIdx }

data-frame-missing-column-name = Un nom de colona manque a les donâs. Trovâ dens componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Un award de cela rèponsa sè bâse sur la rèponsa mandâ per la balisa answer lyé-méma, cen que balyerat un comportament pas atendu.

answer-max-num-attempts-in-section-wide-check-work = Betar `maxNumAttempts` sur un `<answer>` a l'entèrior d'un contegnior avouéc `sectionWideCheckWork` at gins d'èfèt, perce que 'l est lo contegnior que mène lo nombro d'assays. Betâd `maxNumAttempts` sur lo contegnior a la place.

nested-section-wide-check-work-max-num-attempts = Betar `maxNumAttempts` sur un contegnior avouéc `sectionWideCheckWork` que sè trôve a l'entèrior d'un ôtro contegnior avouéc `sectionWideCheckWork` at gins d'èfèt, perce que 'l est lo contegnior de fôra que mène lo nombro d'assays. Betâd `maxNumAttempts` sur lo contegnior de fôra a la place.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] L'atribut { $attributes } arat gins d'èfèt sen symbolicEquality.
       *[other] Los atributs { $attributes } aront gins d'èfèt sen symbolicEquality.
    }

answer-invalid-type = Type pas valablo por la rèponsa : { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Come lo composant `<{ $component }>` at gins de nom, pôt pas sèrvir come atribut d'un module

module-attribute-name-already-defined = Lo composant `<{ $component } name="{ $name }">` pôt pas sèrvir come atribut d'un module perce que lo type de composant `<module>` at ja un atribut "{ $name }".

conditional-content-condition-ignored = L'atribut `condition` est ignorâ sur un composant `<conditionalContent>` avouéc des enfants case ou else.

slider-markers-type-mismatch = Lo type des marques corrèspond pas u type du curror.

pretzel-problem-needs-statement-and-answer = pretzel pas valablo : châque `<problem>` dêt contegnir un `<statement>` et un `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel pas valablo : en mode="circuit", lo premiér `<problem>` pôt pas étre un distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Valor pas valabla { $values } por l'atribut `{ $attribute }` ; ignorâ.
       *[other] Valors pas valables { $values } por l'atribut `{ $attribute }` ; ignorâs.
    }

attribute-must-be-references = Valor pas valabla `{ $value }` por l'atribut `{ $attribute }`. L'atribut dêt étre fêt de rèferences que comencont per un `$`.

math-input-invalid-function-names = <mathInput> : los noms de fonccions pas valables dens { $attribute } sont ignorâs : { $names }. La partia afichiê de châque nom dêt fâre u muens 2 caractèros (des lètres ou des trèts d'union) ; un sufixo `|<mathspeak alternativa>` pôt siuvre, mas 'l est pas oblegiê.

## Building components from the source

component-type-invalid = Type de composant pas valablo : `<{ $componentType }>`

attribute-repeated = On pôt pas rèpètar l'atribut { $attribute }.

attribute-invalid-for-component = Atribut "{ $attribute }" pas valablo por un composant du type `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    La dèfinicion de stilo { $styleNumber } at pas prod de contrasto por { $context ->
        [text-on-background] la color du tèxto contre la color du fond
        [high-contrast] la color de hôt contrasto contre la têla
        [line] la color de la legne contre la têla
        [marker] la color de la marque contre la têla
       *[text-on-canvas] la color du tèxto contre la têla
    }{ $mode ->
        [dark] { " (môdo sombro)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1 ; fôt u muens { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Ben que la dèfinicion de stilo { $styleNumber } done des colors avouéc prod de contrasto por lo môdo cllâr, les colors du môdo sombro fêtes de cetes valors ant pas prod de contrasto por la color du tèxto contre la color du fond ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1 ; fôt u muens { $threshold }:1). { $suggestion ->
        [available] Por avêr prod de contrasto en môdo sombro, ou ben ôgmentâd lo contrasto du môdo cllâr (per ègzemplo { $lightAttribute }="{ $lightColor }"), ou ben changiéd la color du môdo sombro (per ègzemplo { $darkAttribute }="{ $darkColor }").
       *[none] Por avêr prod de contrasto en môdo sombro, ôgmentâd lo contrasto du môdo cllâr ou changiéd les colors fêtes avouéc textColorDarkMode et/ou backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ben que la dèfinicion de stilo { $styleNumber } done una color de tèxto avouéc prod de contrasto por lo môdo cllâr, la color de tèxto du môdo sombro fêta de cela valor at pas prod de contrasto contre la têla ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1 ; fôt u muens { $threshold }:1). { $suggestion ->
        [available] Por avêr prod de contrasto en môdo sombro, ou ben ôgmentâd lo contrasto du môdo cllâr (per ègzemplo textColor="{ $lightColor }"), ou ben changiéd la color du môdo sombro (per ègzemplo textColorDarkMode="{ $darkColor }").
       *[none] Por avêr prod de contrasto en môdo sombro, ôgmentâd lo contrasto du môdo cllâr ou changiéd la color fêta avouéc textColorDarkMode.
    }

section-multiple-style-palettes = Una sèccion pôt chouèsir mâques una <stylePalette> ; on prend la dèrriére.

## Unique variants

variant-num-to-select-not-non-negative-integer = on pôt pas dètèrminar les variantes uniques de { $component } perce que numToSelect est pas un entiér pas nègatif.

variant-num-to-select-not-constant-number = on pôt pas dètèrminar les variantes uniques de { $component } perce que numToSelect est pas un nombro constant.

variant-with-replacement-not-constant-boolean = on pôt pas dètèrminar les variantes uniques de { $component } perce que withReplacement est pas un boolean constant.

variant-select-weight-disables-unique = Les variantes uniques por select sont dèsactivâs s'y at una opcion avouéc un selectWeight ou un selectForVariants donâ

variant-coprime-undetermined = on pôt pas dètèrminar les variantes uniques de { $component } perce qu'on pôt pas dètèrminar que coprime est tojorn fôx.

variant-attribute-not-constant = on pôt pas dètèrminar les variantes uniques de { $component } perce que { $attribute } est pas una constanta.

variant-attribute-not-number = on pôt pas dètèrminar les variantes uniques de { $component } perce que { $attribute } est pas un nombro.

variant-attribute-wrong-type-for-sequence =
    on pôt pas dètèrminar les variantes uniques de { $component } du type { $type } perce que { $attribute } est pas { $expected ->
        [letters-combination] una combinèson de lètres
        [math-expression] una expression matèmatica valabla
        [integer] un entiér
       *[number] un nombro
    }.

variant-length-not-integer = on pôt pas dètèrminar les variantes uniques de { $component } perce que length est pas un entiér.

variant-sort-not-implemented = les variantes uniques d'un { $component } avouéc sort ant pas encor étâ fêtes

variant-exclude-combinations-not-implemented = les variantes uniques d'un { $component } avouéc excludeCombinations ant pas encor étâ fêtes

variant-math-exclude-not-implemented = les variantes uniques d'un { $component } du type math avouéc exclude ant pas encor étâ fêtes

variant-non-constant-exclude-not-implemented = les variantes uniques d'un { $component } avouéc un exclude pas constant ant pas encor étâ fêtes

## PreFigure conversion

prefigure-descendant-unsupported = { $subject } : pas prês en charge per lo module prefigure du grafico ; lo dèscendent est passâ.

prefigure-descendant-invalid-geometry = { $subject } : geomètrie pas finia ou pas complèta ; lo dèscendent est passâ.

prefigure-curve-label-omitted = { $subject } : les ètiquètes sont pas prêses en charge sur los èlèments de corba convèrtis ; l'ètiquèta est omêsa.

prefigure-curve-unsupported-definition-type = { $subject } : type de dèfinicion de fonccion de corba pas prês en charge '{ $definitionType }' ; lo dèscendent est passâ.

prefigure-region-flip-functions-unsupported = { $subject } : atribut flipFunctions pas prês en charge sur regionBetweenCurves ; lo dèscendent est passâ.

prefigure-region-non-formula-child = { $subject } : sur regionBetweenCurves, y at mâques les fonccions enfants donâs per una formula que sont prêses en charge ; lo dèscendent est passâ.

prefigure-label-position-unsupported =
    { $subject } : labelPosition '{ $labelPosition }' pas prês en charge por { $labelKind ->
        [line-family] una ètiquèta de la famelye des legnes
       *[point] una ètiquèta de pouent
    } ; on prend l'alignement PreFigure per dèfôt.

prefigure-fill-style-unsupported = { $subject } : lo stilo de remplissâjo '{ $fillStyle }' est pas prês en charge per PreFigure ; on retorne a un remplissâjo plen.

prefigure-line-style-unknown = { $subject } : stilo de legne pas cognu '{ $lineStyle }' omês de la sortia PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject } : lo stilo de marque '{ $markerStyle }' at étâ convèrti en stilo PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject } : lo stilo de marque '{ $markerStyle }' est pas prês en charge per PreFigure ; on prend lo stilo per dèfôt.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>` : `ref` pas valablo ; on pôt pas rèsôdre la cibla. L'anotacion est omêsa.

annotation-ref-multiple-targets = `<annotation>` : `ref` s'est rèsolu en plusiors cibles ; on prend la premiére.

annotation-ref-outside-graph = `<annotation>` : `ref` pas valablo ; la cibla est fôra du grafico que la contint. L'anotacion est omêsa.

annotation-ref-unsupported-target = `<annotation>` : `ref` pas valablo ; la cibla est pas un objèt grafico prês en charge dens la convèrsion prefigure. L'anotacion est omêsa.

annotation-text-missing = `<annotation>` : `text` que manque ou vouedo ; on mande un tèxto vouedo.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] On at trovâ una dèpendença circulèra.
       *[other] On at trovâ una dèpendença circulèra avouéc un composant `<{ $componentType }>`.
    }

reference-no-referent = Gins de rèferent trovâ por la rèference : `{ $reference }`

reference-multiple-referents = Plusiors rèferents trovâs por la rèference : `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format pas valablo por l'atribut { $attribute } de `<{ $componentType }>`.

children-invalid = Enfants pas valables por `<{ $componentType }>` : enfants pas valables trovâs : { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valor pas valabla `{ $value }` por l'atribut `{ $attribute }`, on prend la valor `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Vèrsion DoenetML { $version } pas trovâ.
       *[other] Vèrsion DoenetML { $version } pas trovâ. On retorne a la vèrsion { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML pas valablo : { $content }

parse-tag-missing-close-tag = DoenetML pas valablo : la balisa `{ $tag }` at gins de balisa de cllôtura. On atendêt una balisa que sè cllôt lyé-méma ou una balisa `</{ $tagName }>`.

parse-tag-error = DoenetML pas valablo : èrror dens la balisa `<{ $tagName }>`

parse-attribute-missing-value = DoenetML pas valablo : semble que l'atribut pas valablo `{ $attribute }` at gins de valor.

parse-attribute-invalid = DoenetML pas valablo : atribut pas valablo `{ $attribute }`

parse-attribute-value-invalid = DoenetML pas valablo : valor d'atribut pas valabla `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML pas valablo : valor d'atribut pas valabla `{ $value }`. Los guilyèmèts vant pas ensemblo. Semble que vos manque un `{ $quote }`

parse-open-tag-name-missing = DoenetML pas valablo : una balisa sen nom trovâ, per ègzemplo `<`

parse-tag-not-closed = DoenetML pas valablo : la balisa `{ $tag }` at pas étâ cllôta (semble que manque un `>`).

parse-self-closing-tag-name-missing = DoenetML pas valablo : una balisa sen nom trovâ `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML pas valablo : la balisa `{ $tag }` at pas étâ cllôta (semble que manque `/>`).

parse-tag-invalid-attributes = DoenetML pas valablo : la balisa `{ $tag }` est pas valabla. Pôt-étre qu'at des atributs pas corrècts.

parse-close-tag-name-missing = DoenetML pas valablo : una balisa de cllôtura sen nom trovâ, per ègzemplo `</`

parse-attribute-value-unquoted = Les valors des atributs dêvont étre entre guilyèmèts : `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML pas valablo : balisa de cllôtura `{ $tag }` trovâ, mas gins de balisa d'uvèrtura que l'y corrèspond

parse-close-tag-mismatched = DoenetML pas valablo : balisa de cllôtura que corrèspond pas. On atendêt `</{ $expected }>`. On at trovâ `{ $found }`

parser-node-unconvertible = On pôt pas convèrtir lo nuod { $node } en nuod Dast.

## Names

name-attribute-invalid =
    Atribut name='{ $name }' pas valablo. { $reason ->
        [characters] Los noms pôvont contegnir mâques des lètres, des chifros, des tirèts bâs ou des trèts d'union.
       *[start] Los noms dêvont començar per una lètra.
    }

component-name-invalid-start = Nom de composant "{ $name }" pas valablo. Los noms dêvont començar per una lètra.

## `<answer>` sugar

answer-video-watched-missing-video = Un answer du type videoWatched dêt avêr un atribut video

answer-video-watched-video-not-reference = Un answer du type videoWatched dêt avêr un atribut video qu'est una rèference

answer-name-not-single-text = L'atribut name d'un answer dêt avêr un solèt enfant tèxto

## Referencing another document

external-doenetml-recursion-limit = On pôt pas rècupèrar lo DoenetML de fôra a côsa de trop de nivelos de rècursion. Y arêt-o pas una rèference circulèra ?

external-doenetml-unavailable = On pôt pas rècupèrar de DoenetML dês { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML pas valablo rècupèrâ dês { $attribute }="{ $uri }" : corrèspond pas u type de composant "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] L'atribut `{ $from }` est dèsuèt ; empllèyéd `{ $to }` a la place.
       *[other] [deprecation] L'atribut `{ $from }` sur `<{ $component }>` est dèsuèt ; empllèyéd `{ $to }` a la place.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] L'atribut `{ $from }` est dèsuèt et ignorâ perce que `{ $to }` est asse-ben donâ.
       *[other] [deprecation] L'atribut `{ $from }` sur `<{ $component }>` est dèsuèt et ignorâ perce que `{ $to }` est asse-ben donâ.
    }

deprecated-attribute-ignored = [deprecation] L'atribut `{ $attribute }` sur `<{ $component }>` est dèsuèt et ignorâ.

deprecated-attribute-to-child = [deprecation] L'atribut `{ $attribute }` sur `<{ $component }>` est dèsuèt ; empllèyéd un enfant `<{ $child }>` a la place.

deprecated-attribute-value-renamed = [deprecation] La valor `{ $value }` de l'atribut `{ $attribute }` sur `<{ $component }>` est dèsuèta ; empllèyéd `{ $to }` a la place.


## Language coverage

pluralize-english-only = `<pluralize>` pôt betar u plurièl mâques l'anglès, donc son tèxto rèste come 'l est dens un document ècrit en { $locale }. Ècrisiéd la fôrma du plurièl vos-mémos, ou donâd-la avouéc l'atribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = L'èlèment `<{ $tag }>` est pas un èlèment Doenet cognu.

schema-element-not-allowed-at-root = L'èlèment `<{ $tag }>` est pas pèrmês a la racena du document.

schema-element-not-allowed-inside = L'èlèment `<{ $tag }>` est pas pèrmês a l'entèrior d'un `<{ $parent }>`.

schema-attribute-unrecognized = L'èlèment `<{ $tag }>` at gins d'atribut apelâ `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] L'atribut `{ $attribute }` de l'èlèment `<{ $tag }>` dêt étre una lista yô châque èlèment est yon de cetos-ce : { $allowed }
       *[other] L'atribut `{ $attribute }` de l'èlèment `<{ $tag }>` dêt étre yon de cetos-ce : { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nom de variante pas valablo por select. Lo nom de variante { $variantName } sè trôve dens { $numOptions } opcions mas lo nombro a chouèsir est { $numToSelect }.

select-variant-name-without-options = Des variantes sont donâs por select mas gins d'opcion est donâ por lo nom de variante possiblo : { $variantName }.

select-variant-name-not-possible = Lo nom de variante { $variantName } donâ por select est pas un nom de variante possiblo.

select-too-few-options = On pôt pas chouèsir { $numToSelect } composants fôr de solament { $numOptions }.

select-from-sequence-too-few-values = On pôt pas chouèsir { $numToSelect } valors dens una sèquence de longior { $length }.

select-from-sequence-indices-count-mismatch = Lo nombro d'endèxos donâs por select dêt corrèspondre u nombro a chouèsir

select-from-sequence-indices-not-integers = Tôs los endèxos donâs por select dêvont étre des entiérs

select-from-sequence-index-excluded = Un endèxo donâ de selectfromsequence ére exclus

select-from-sequence-indices-excluded-combination = Los endèxos donâs de selectfromsequence éront una combinèson exclusa

select-from-sequence-coprime-not-positive-integers = On pôt pas chouèsir des combinèsons de nombros premiérs entre lor perce qu'on chouèsét pas des entiérs positifs.

select-from-sequence-coprime-common-factor = On pôt pas chouèsir des nombros premiérs entre lor. Totes les valors possibles ant un factor comon. (Les valors donâs de "from" ou "to" dêvont étre premiéres entre lor avouéc "step".)

select-from-sequence-coprime-single-number = On pôt pas chouèsir des combinèsons de nombros premiérs entre lor fôr d'un solèt nombro qu'est pas 1.

select-from-sequence-excluded-too-many-combinations = Més de 70% de les combinèsons sont excluses dens selectFromSequence

select-from-sequence-coprime-none-found = On at pas pouessu chouèsir des nombros premiérs entre lor. Totes les valors possibles ant un factor comon.

select-from-sequence-too-few-unique-values = On pôt pas chouèsir { $numToSelect } valors uniques dens una sèquence de longior { $numPossibleValues }

select-prime-numbers-too-few-values = On pôt pas chouèsir { $numToSelect } valors dens una lista de nombros premiérs de longior { $numValues }

select-prime-numbers-values-count-mismatch = Lo nombro de valors donâs por select dêt corrèspondre u nombro a chouèsir

select-prime-numbers-values-not-prime = Totes les valors donâs por la chouèx de nombros premiérs dêvont étre dens la lista des nombros premiérs

select-prime-numbers-values-excluded-combination = Les valors donâs de selectPrimeNumbers éront una combinèson exclusa

select-prime-numbers-excluded-too-many-combinations = Més de 70% de les combinèsons sont excluses dens selectPrimeNumbers

select-random-combination-fluke = Per un hasârd extrèmament pou probâblo, gins de combinèson de valors a l'hasârd at pouessu étre chouèsia

select-random-value-fluke = Per un hasârd extrèmament pou probâblo, gins de valor a l'hasârd at pouessu étre chouèsia

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] Cél `<{ $component }>` est pas afichiê perce qu'est a l'entèrior des matèmatiques et est pas `inline`. Apondéd `inline` por qu'il devegne una lista dèroulanta, que tint dens una expression.
        [expanded] Cél `<{ $component }>` est pas afichiê perce qu'est a l'entèrior des matèmatiques et est `expanded`. Enlevâd `expanded` ; una bouèta de plusiors legnes tint pas dens una expression.
        [on-graph] Cél `<{ $component }>` est pas afichiê perce qu'est a l'entèrior des matèmatiques trafitâs sur un grafico, yô y at gins de place por un champ d'entrâ.
       *[relative-width] Cél `<{ $component }>` est pas afichiê perce qu'est a l'entèrior des matèmatiques et at una lârjor relativa. Donâd la lârjor en unitâts absolues, come `px`, a la place.
    }
