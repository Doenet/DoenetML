# Qʼeqchiʼ diagnostics: the errors and warnings the core, the parser and the
# schema checker report about a document. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Element names, attribute names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber` — are part of the language rather than
# prose and stay in English exactly as written, as does anything quoted back
# from the author's own source.
#
# **Orthography.** The ALMG alphabet; see `chrome.ftl`'s header for the
# inventory. Every apostrophe in a message value is U+02BC MODIFIER LETTER
# APOSTROPHE `ʼ`, not U+2019 `’` and not U+0027 `'`; the three are homoglyphs
# in most fonts, so a reviewer should check the codepoint rather than the
# shape. `q` and `k` are two different sounds, uvular and velar, each written
# with its own letter, and long vowels are doubled. No colonial-era spelling is
# mixed in: no `qu` for `k`, no `hu` for `w`, no `k` standing for uvular `q`,
# no `4` or `ɜ` for an ejective. The language is named «Qʼeqchiʼ», spelled
# exactly that way.
#
# **Number.** `Intl.PluralRules` has no CLDR data for `kek`; it falls back to
# the default locale and reports `one` and `other`, categories Qʼeqchiʼ does not
# select. A noun after a numeral is not marked for plural, so every place
# English writes a `[one]`/`[other]` pair is written here as **one unselected
# form** and the count select is dropped. The selects that remain —
# `$component`, `$reason`, `$type`, `$mode`, `$context`, `$suggestion`,
# `$expected`, `$labelKind`, `$isList`, `$alternative`, `$fallback`,
# `$componentType` — are not plural selects and keep exactly English's
# branches.
#
# **Loans.** This is a loan register in a native frame, as `locales/sgh`
# records for Shughni. Qʼeqchiʼ has no written vocabulary for compiler
# diagnostics; the register a Qʼeqchiʼ speaker actually reads this material in
# is Spanish. So the technical nouns are Spanish loans written to ALMG spelling
# — «atributo», «komponente», «balor», «numero», «bektor», «sirkulo», «matris»,
# «funsion», «referensia», «bariante», «sekwensia», «interbalo», «dominio»,
# «indise», «kolor», «estilo», «kontraste», «parametro», «koordenada» — and the
# sentence around them is Qʼeqchiʼ: native verbs, the negator «inkʼaʼ», the
# existential negation «maakʼaʼ», «tento» for obligation, «rikʼin» and «chirix»
# for the relations, and Qʼeqchiʼ word order. Nothing is coined.
#
# **Confidence.** Every key is answered. The frame is usable and the identifiers
# are safe; the prose is not yet idiomatic Qʼeqchiʼ writing, and a speaker
# should overwrite it freely. The long contrast-ratio sentences and the
# PreFigure warnings are the least natural, because they describe machinery
# with no Qʼeqchiʼ name at all.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = Inkʼaʼ nakʼanjelak { $attributes } naq wiibʼ li endpoint kʼeebʼil

line-segment-attributes-ignored-with-endpoint-and-midpoint = Inkʼaʼ nakʼanjelak { $attributes } naq kʼeebʼil jun endpoint ut jun midpoint

line-segment-midpoint-offset-without-midpoint = Maakʼaʼ naxbʼaanu midpointOffset chi maakʼaʼ jun midpoint

## `<line>`

line-points-undetermined-dimensions = Raqal chi ru punto li inkʼaʼ nawbʼil xdimension.

line-points-too-few-dimensions = Tento naq li raqal taanumeʼq chi ru punto wibʼ chi dimension chi ubʼej.

line-points-depend-on-variables = Li raqal naxik chi ru punto li wan saʼ xbʼeen eb li bariable: { $variables }.

line-equation-invalid-format = Inkʼaʼ us li formato re li ekwasion re li raqal saʼ eb li bariable { $variable1 } ut { $variable2 }.

## `<ray>`

ray-overprescribed-through = Li raqal junpakʼal kʼeebʼil rikʼin through, endpoint ut direction.  Nakanabʼaak li through kʼeebʼil.

ray-dimension-mismatch = Inkʼaʼ nakʼuulun li numDimensions saʼ li raqal junpakʼal.

## `<vector>`

vector-overprescribed-head = Li bektor kʼeebʼil rikʼin head, tail ut displacement.  Nakanabʼaak li head kʼeebʼil.

vector-dimension-mismatch = Inkʼaʼ nakʼuulun li numDimensions saʼ li bektor.

## Attracting and constraining

attract-to-without-nearest-point = Inkʼaʼ naru xjilbʼal chi ru jun `<{ $component }>` xbʼaan naq maakʼaʼ xbariable re estado nearestPoint.

constrain-to-without-nearest-point = Inkʼaʼ naru xtaqlankil chi ru jun `<{ $component }>` xbʼaan naq maakʼaʼ xbariable re estado nearestPoint.

constrain-to-interior-without-nearest-point = Inkʼaʼ naru xtaqlankil saʼ xsaʼ jun `<{ $component }>` xbʼaan naq maakʼaʼ xbariable re estado nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = Inkʼaʼ nakʼanjelak labelPosition saʼ jun choiceInput inkʼaʼ inline

## Ordering children by index

choice-input-indices-count-mismatch = Nakanabʼaak li indise kʼeebʼil re li choiceInput xbʼaan naq inkʼaʼ juntaqʼeet li rajlankil li indise rikʼin li rajlankil li choice.

pretzel-indices-count-mismatch = Nakanabʼaak li indise kʼeebʼil re li problem xbʼaan naq inkʼaʼ juntaqʼeet li rajlankil li indise rikʼin li rajlankil li problem.

shuffle-indices-count-mismatch = Nakanabʼaak li indise kʼeebʼil re li shuffle xbʼaan naq inkʼaʼ juntaqʼeet li rajlankil li indise rikʼin li rajlankil li komponente.

indices-ignored-out-of-range = Nakanabʼaak li indise kʼeebʼil re { $component } xbʼaan naq wan indise chi ru li naʼajej.

pretzel-indices-repeated = Nakanabʼaak li indise kʼeebʼil re li pretzel xbʼaan naq wan indise kʼeebʼil wiʼ chik.

pretzel-circuit-first-index = Nakanabʼaak li indise kʼeebʼil re li pretzel saʼ li mode circuit xbʼaan naq tento naq li xbʼeen indise aʼan 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Re naq taakʼanjelaq `<{ $component }>` rikʼin tzʼiibʼ, tento xkʼeebʼal li atributo `type`.

invalid-type-defaulting-to-math = Inkʼaʼ us li tipo { $type } re li komponente { $component }. Tento naq aʼan math, text, number malaj boolean. Nakʼeemank math.

string-not-valid-component-to-arrange = Li tzʼiibʼ "{ $value }" moko komponente ta us re { $component }. Nakanabʼaak.

## Types and variables

invalid-type-defaulting-to-number = Inkʼaʼ us li tipo { $type }, nakʼeemank number.

invalid-variable-value = Inkʼaʼ us xbʼalor jun bariable: `{ $value }`

## Variants

variant-index-must-be-number = Tento naq li indise re li bariante { $index } aʼan jun numero

variant-index-must-be-integer = Tento naq li indise re li bariante { $index } aʼan jun numero entero

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` inkʼaʼ yiibʼanbʼil re li bisok absoluto. Nakʼeemank li ruuchil chi relatibo.

side-by-side-absolute-margins = `<{ $component }>` inkʼaʼ yiibʼanbʼil re li bisok absoluto. Nakʼeemank li margen chi relatibo.

side-by-side-no-block-child = Inkʼaʼ us `<{ $component }>`: tento naq wan junaq xkʼulaʼal chi bloke.

## `<label>`

label-for-ignored-on-graphical = Inkʼaʼ nakʼanjelak li atributo `for` saʼ jun `<label>` grafiko.

label-for-must-resolve-to-one = Tento naq li atributo `for` saʼ `<label>` taakʼamoq chi ru junaj ajwiʼ komponente.

label-for-unresolved = Inkʼaʼ xtawmank chanru naxkʼam chi ru jun komponente li atributo `for` saʼ `<label>`.

label-for-answer-with-authored-inputs = Li atributo `for` saʼ `<label>` naxye jun `<answer>` li wan tzʼiibʼanbʼil rokebʼaal; kʼe li referensia chi ru li okebʼaal.

label-for-answer-without-input = Li atributo `for` saʼ `<label>` naxye jun `<answer>` li maakʼaʼ rokebʼaal re xkʼabʼaʼinkil.

label-for-must-reference-input-or-answer = Tento naq li atributo `for` saʼ `<label>` taaxye junaq okebʼaal malaj junaq sumenk.

## Accessibility

accessibility-short-description-or-decorative = Re li okenk, tento naq `<{ $component }>` wan xkaʼchʼinal esil malaj naq taayeemanq naq aʼan yal re rilbʼal.

accessibility-video-short-description = Re li okenk, tento naq wan xkaʼchʼinal esil li `<video>`.

accessibility-input-short-description-or-label = Re li okenk, tento naq wan xkaʼchʼinal esil malaj xkʼabaʼ li `<{ $component }>`.

accessibility-answer-input-short-description-or-label = Re li okenk, tento naq wan xkaʼchʼinal esil malaj xkʼabaʼ jun `<answer>` li naxyoʼobʼtesi jun okebʼaal.

accessibility-short-description-contains-math = Inkʼaʼ us naq li kaʼchʼinal esil taakʼuulanq komponente re matematika joʼ `<{ $component }>`. Tzʼiibʼa li matematika rikʼin aatin.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Maakʼaʼ xkontraste { $colorName } re li tzʼiibʼ saʼ xjolomil li seksion (saʼ li qʼeq) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; tento { $threshold }:1 chi ubʼej).
       *[other] Maakʼaʼ xkontraste { $colorName } re li tzʼiibʼ saʼ xjolomil li seksion ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; tento { $threshold }:1 chi ubʼej).
    }

## `<circle>`

circle-through-points-non-numerical = Toj maajiʼ yiibʼanbʼil li `<circle>` chi ru { $count } punto naq maakʼaʼ xbʼalor chi numero eb li punto.

circle-too-many-through-points = Inkʼaʼ naru xyiibʼankil li sirkulo chi ru numenaq oxibʼ punto.

circle-overprescribed-radius-center-points = Inkʼaʼ naru xyiibʼankil li sirkulo rikʼin radio, sentro ut punto kʼeebʼil chixjunil.

circle-center-with-multiple-points = Inkʼaʼ naru xyiibʼankil li sirkulo rikʼin sentro kʼeebʼil chi ru numenaq jun punto.

circle-radius-too-small = Inkʼaʼ naru xyiibʼankil li sirkulo: xbʼaan naq { $distance } li najtil saʼ xyanq li wiibʼ punto, kaʼchʼin chi ru li radio kʼeebʼil { $radius }.

circle-radius-with-many-points = Inkʼaʼ naru xyoʼobʼtesinkil li sirkulo chi ru numenaq wiibʼ punto rikʼin jun radio kʼeebʼil.

circle-invalid-center-or-through-points = Inkʼaʼ us xsentro malaj li punto naxnumsi li sirkulo.

circle-radius-center-with-multiple-points = Inkʼaʼ naru xbʼisbʼal xradio li sirkulo rikʼin sentro kʼeebʼil chi ru numenaq jun punto.

circle-radius-with-points-non-numerical = Inkʼaʼ naru xyoʼobʼtesinkil li sirkulo chi ru numenaq jun punto rikʼin jun radio kʼeebʼil naq maakʼaʼ xbʼalor chi numero.

circle-change-radius-non-numerical = Inkʼaʼ naru xjalbʼal xradio li sirkulo naq maakʼaʼ xbʼalor chi numero eb li punto

circle-change-center-non-numerical = Toj maajiʼ yiibʼanbʼil xjalbʼal xsentro li sirkulo chi ru punto li maakʼaʼ xbʼalor chi numero.

## `<function>`

function-domain-insufficient-dimensions = Maakʼaʼ xdimension li dominio re li funsion. Li dominio wan { $intervals } interbalo chi ru, abʼan li funsion wan { $inputs } okebʼaal chi ru.

function-domain-invalid-format = Inkʼaʼ us li formato re li dominio re li funsion.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Nakanabʼaak li maximum re li funsion xbʼaan naq moko numero ta.
        [minimum] Nakanabʼaak li minimum re li funsion xbʼaan naq moko numero ta.
        [extremum] Nakanabʼaak li extremum re li funsion xbʼaan naq moko numero ta.
        [point] Nakanabʼaak li punto re li funsion xbʼaan naq moko numero ta.
        [slope] Nakanabʼaak li pendiente re li funsion xbʼaan naq moko numero ta.
       *[other] Nakanabʼaak li { $type } re li funsion xbʼaan naq moko numero ta.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Nakanabʼaak li maximum re li funsion xbʼaan naq maakʼaʼ chi saʼ.
        [minimum] Nakanabʼaak li minimum re li funsion xbʼaan naq maakʼaʼ chi saʼ.
        [extremum] Nakanabʼaak li extremum re li funsion xbʼaan naq maakʼaʼ chi saʼ.
        [point] Nakanabʼaak li punto re li funsion xbʼaan naq maakʼaʼ chi saʼ.
       *[other] Nakanabʼaak li { $type } re li funsion xbʼaan naq maakʼaʼ chi saʼ.
    }

function-points-too-close = Wan wiibʼ punto jiljo chi ribʼil ribʼ saʼ li funsion. Inkʼaʼ naru xkʼeebʼal xnaʼlebʼ li funsion.

function-iterates-input-output-mismatch = Naru ajwiʼ xyoʼobʼtesinkil li iterate re li funsion naq juntaqʼeet li rajlankil li okebʼaal rikʼin li rajlankil li elebʼaal. Li funsion aʼin wan { $inputs } okebʼaal ut { $outputs } elebʼaal chi ru.

## `<sequence>`

sequence-invalid-length = Inkʼaʼ us xnimal li sekwensia.  Tento naq aʼan jun numero entero moko kubʼenaq ta chi ru maakʼaʼ.

sequence-invalid-step = Inkʼaʼ us li step re li sekwensia.  Tento naq aʼan jun numero re jun sekwensia re li tipo { $type }.

sequence-invalid-endpoint-number = Inkʼaʼ us li "{ $attribute }" re jun sekwensia re numero.  Tento naq aʼan jun numero.

sequence-invalid-endpoint-letters = Inkʼaʼ us li "{ $attribute }" re jun sekwensia re letra.  Tento naq aʼan jun chʼutubʼ letra.

sequence-invalid-endpoint = Inkʼaʼ us li "{ $attribute }" re li sekwensia.

select-from-sequence-coprime-not-numbers = Nakanabʼaak li coprime xbʼaan naq moko numero ta li nasikʼmank

select-from-sequence-coprime-with-exclude-combinations = Nakanabʼaak li coprime xbʼaan naq kʼeebʼil li excludeCombinations

## Resolving a `target`

target-not-found = Inkʼaʼ us li target re `<{ $source }>`: inkʼaʼ xtawmank li target.

target-state-variable-not-found = Inkʼaʼ us li target re `<{ $source }>`: inkʼaʼ xtawmank junaq bariable re estado xkʼabaʼ "{ $property }" saʼ jun `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Tento naq jalan eb xbariable li `<odeSystem>` chi ru li bariable independiente.

ode-system-duplicate-variable-names = Inkʼaʼ naru xkʼeebʼal xnaʼlebʼ li funsion RHS re li ODE rikʼin xkʼabaʼ bariable kʼeebʼil wiʼ chik.

ode-system-rhs-function-error = Inkʼaʼ naru xkʼeebʼal xnaʼlebʼ li funsion RHS re li ODE.  Wan paltil chi xyoʼobʼtesinkil li funsion mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Inkʼaʼ naru xkʼeebʼal xnaʼlebʼ jun xukut saʼ xyanq { $count } raqal

angle-invalid-through-point = Inkʼaʼ us li punto saʼ li through re `<angle>`

parabola-vertex-too-many-points = Toj maajiʼ yiibʼanbʼil li parabola rikʼin bertise chi ru numenaq jun punto.

parabola-too-many-points = Toj maajiʼ yiibʼanbʼil li parabola chi ru numenaq oxibʼ punto.

intersection-too-many-items = Toj maajiʼ yiibʼanbʼil li xnumsinkil ribʼ chi ru numenaq wiibʼ

## Other math components

ionic-compound-not-two-ions = Toj maajiʼ yiibʼanbʼil li kʼuubʼanbʼil ioniko rikʼin jalan chi ru wiibʼ ion.

ionic-compound-needs-cation-and-anion = Yal rikʼin jun kation ut jun anion yiibʼanbʼil li kʼuubʼanbʼil ioniko.

solve-equations-cannot-evaluate = Inkʼaʼ naru xsumenkil li ekwasion xbʼaan naq inkʼaʼ xbʼisbʼal: { $equation }

math-operators-operand-number-required = Tento xkʼeebʼal jun operandNumber naq nakʼamek jun operando re matematika.

eigen-decomposition-failed = Inkʼaʼ xbʼisbʼal li eigenvalue re li matris

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: li parametro { $parameters } inkʼaʼ nakʼulunk saʼ li patron, joʼkan naq junelik taaxkʼul jun blanko.

## `<graph>`

graph-grid-invalid = `<graph>`: inkʼaʼ naru xtawbʼal ru grid="{ $grid }". Tento naq aʼan none, medium, dense, malaj wiibʼ numero moko kubʼenaq ta jachbʼil rikʼin jun naʼajej, joʼ grid="1 0.5". Maakʼaʼ grid natzʼiibʼamank.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` naxkʼe jun funsion rikʼin { $expected } elebʼaal — jun ajwiʼ, li pendiente y' saʼ li junjunq punto joʼ `y - x`, malaj wiibʼ, li bektor saʼ li junjunq punto joʼ `(y, -x)` — abʼan li funsion kʼeebʼil re wan { $found } elebʼaal chi ru. { $alternative ->
        [none] Maakʼaʼ natzʼiibʼamank.
       *[other] `<{ $alternative }>` aʼan li komponente re li funsion aʼan. Maakʼaʼ natzʼiibʼamank.
    }

field-function-attribute-ignored-with-child = Nakanabʼaak li atributo `function` xbʼaan naq kʼeebʼil ajwiʼ li funsion saʼ xsaʼ li komponente; aʼan li wan saʼ xsaʼ nakʼanjelak. Kʼe li funsion junpakʼal ajwiʼ.

field-variables-ignored =
    `<{ $component }>`: li atributo `variables` naxkʼabʼaʼi eb li okebʼaal re jun tzʼiibʼ matematika kʼeebʼil saʼ xsaʼ li komponente. { $reason ->
        [function-child] Li funsion arin kʼeebʼil joʼ jun `<function>` xkʼulaʼal, ut aʼan naxkʼabʼaʼi xjunes eb xbariable, joʼkan naq nakanabʼaak li `variables`.
       *[no-expression] Maakʼaʼ jun tzʼiibʼ joʼkan arin, joʼkan naq nakanabʼaak li `variables`.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: inkʼaʼ nakʼanjelak li xLabelPosition="left" saʼ li prefigure renderer; nakʼeemank joʼ right.

prefigure-y-label-position-unsupported = `<graph>`: inkʼaʼ nakʼanjelak li yLabelPosition="bottom" saʼ li prefigure renderer; nakʼeemank joʼ top.

prefigure-invalid-axis-bounds = `<graph>`: inkʼaʼ us xraqbʼal li ehe re li jalok chi prefigure; nakʼeemank li bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: inkʼaʼ us li ruuchil re li jalok chi prefigure; nakʼeemank li ruuchil 425.

prefigure-invalid-aspect-ratio = `<graph>`: inkʼaʼ us li aspectRatio re li jalok chi prefigure; nakʼeemank li aspect ratio 1.

prefigure-grid-spacing-too-fine = `<graph>`: jiljo chi ribʼil ribʼ li raqal re li grid chi ru xraqbʼal li ehe; nakanabʼaak li grid saʼ li prefigure renderer.

prefigure-annotations-not-rendered = `<graph>`: inkʼaʼ natzʼiibʼamank li annotation naq inkʼaʼ nakʼanjelak li PreFigure renderer.

multiple-annotations-children = Kʼiila `<annotations>` xkʼulaʼal xtawmank saʼ li `<graph>`; nakanabʼaak chixjunil kaʼajwiʼ li rosoʼjik.

## Referring to other components

copy-unrecognized-component-type = Inkʼaʼ naru xnimobʼresinkil malaj xkʼulubʼankil jun tipo komponente inkʼaʼ nawbʼil ru: { $type }.

copy-prop-not-found = Inkʼaʼ xtawmank li prop { $property } saʼ jun komponente re li tipo { $component }

collect-no-source = Inkʼaʼ xtawmank bʼar naru xchʼutubʼankil.

collect-invalid-component-type = Inkʼaʼ naru xchʼutubʼankil komponente re li tipo `<{ $component }>` xbʼaan naq moko tipo ta us.

reference-index-unavailable = Inkʼaʼ naru xyeebʼal li indise `{ $reference }`

## `<callAction>`

component-action-unavailable = Inkʼaʼ naru xbʼoqbʼal { $action } saʼ li komponente `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Inkʼaʼ us li ruuchil li datos.  Inkʼaʼ juntaqʼeet xnimal eb li tasal. Xtawmank saʼ li componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Wan xkʼabaʼ kolumna kʼeebʼil wiʼ chik saʼ li datos.  Xtawmank saʼ li componentIdx :{ $componentIdx }

data-frame-missing-column-name = Maakʼaʼ xkʼabaʼ jun kolumna saʼ li datos.  Xtawmank saʼ li componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Jun li award re li sumenk aʼin wan saʼ xbʼeen xsumenkil ajwiʼ li answer, ut aʼan naxkʼam chaq li inkʼaʼ yeebʼil.

answer-max-num-attempts-in-section-wide-check-work = Maakʼaʼ naxbʼaanu xkʼeebʼal li `maxNumAttempts` saʼ jun `<answer>` li wan saʼ jun kʼuubʼaal rikʼin `sectionWideCheckWork`, xbʼaan naq li kʼuubʼaal naxkʼe li rajlankil li yalok. Kʼe li `maxNumAttempts` saʼ li kʼuubʼaal.

nested-section-wide-check-work-max-num-attempts = Maakʼaʼ naxbʼaanu xkʼeebʼal li `maxNumAttempts` saʼ jun kʼuubʼaal rikʼin `sectionWideCheckWork` li wan saʼ jun chik kʼuubʼaal rikʼin `sectionWideCheckWork`, xbʼaan naq li kʼuubʼaal chi rix naxkʼe li rajlankil li yalok. Kʼe li `maxNumAttempts` saʼ li kʼuubʼaal chi rix.

answer-attributes-need-symbolic-equality = Maakʼaʼ naxbʼaanu li atributo { $attributes } chi maakʼaʼ kʼeebʼil li symbolicEquality.

answer-invalid-type = Inkʼaʼ us li tipo re li sumenk: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Xbʼaan naq maakʼaʼ xkʼabaʼ li komponente `<{ $component }>`, inkʼaʼ naru nakʼanjelak joʼ atributo re jun module

module-attribute-name-already-defined = Inkʼaʼ naru nakʼanjelak li komponente `<{ $component } name="{ $name }">` joʼ atributo re jun module xbʼaan naq li tipo komponente `<module>` ak wan xatributo "{ $name }".

conditional-content-condition-ignored = Nakanabʼaak li atributo `condition` saʼ jun komponente `<conditionalContent>` li wan xkʼulaʼal case malaj else.

slider-markers-type-mismatch = Inkʼaʼ nakʼuulun xtipo li marker rikʼin xtipo li slider.

pretzel-problem-needs-statement-and-answer = Inkʼaʼ us li pretzel: tento naq li junjunq `<problem>` wan jun `<statement>` ut jun `<answer>` chi saʼ.

pretzel-circuit-first-problem-distractor = Inkʼaʼ us li pretzel: saʼ li mode="circuit", inkʼaʼ naru naʼok chi distractor li xbʼeen `<problem>`.

## Attribute values

attribute-invalid-values = Inkʼaʼ us li balor { $values } re li atributo `{ $attribute }`; nakanabʼaak.

attribute-must-be-references = Inkʼaʼ us li balor `{ $value }` re li atributo `{ $attribute }`. Tento naq li atributo taakʼuubʼamanq rikʼin referensia li nakeʼtikla rikʼin jun `$`.

math-input-invalid-function-names = <mathInput>: nakanabʼaak xkʼabaʼ funsion inkʼaʼ us saʼ { $attribute }: { $names }. Tento naq wan wiibʼ karakter chi ubʼej (letra malaj raqal) saʼ xkʼutbʼal li junjunq kʼabʼaʼej; naru ajwiʼ naxik jun `|<mathspeak alternative>` chi rix.

## Building components from the source

component-type-invalid = Inkʼaʼ us li tipo komponente: `<{ $componentType }>`

attribute-repeated = Inkʼaʼ naru xkʼeebʼal wiʼ chik li atributo { $attribute }.

attribute-invalid-for-component = Inkʼaʼ us li atributo "{ $attribute }" re jun komponente re li tipo `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Maakʼaʼ xkontraste li estilo { $styleNumber } re { $context ->
        [text-on-background] xkolor li tzʼiibʼ chi ru xkolor li rix
        [high-contrast] li kolor kaw chi ru li ruuchil
        [line] xkolor li raqal chi ru li ruuchil
        [marker] xkolor li marker chi ru li ruuchil
       *[text-on-canvas] xkolor li tzʼiibʼ chi ru li ruuchil
    }{ $mode ->
        [dark] { " (saʼ li qʼeq)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; tento { $threshold }:1 chi ubʼej).

style-definition-dark-mode-text-background-contrast =
    Us xkontraste li kolor kʼeebʼil re li estilo { $styleNumber } saʼ li saq, abʼan maakʼaʼ xkontraste xkolor li tzʼiibʼ chi ru xkolor li rix saʼ li qʼeq li nachal chaq saʼ li balor aʼan ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; tento { $threshold }:1 chi ubʼej). { $suggestion ->
        [available] Re naq taawanq xkontraste saʼ li qʼeq, nimobʼresi li kontraste saʼ li saq (joʼ eetalil, kʼe { $lightAttribute }="{ $lightColor }") malaj jala li kolor saʼ li qʼeq (joʼ eetalil, kʼe { $darkAttribute }="{ $darkColor }").
       *[none] Re naq taawanq xkontraste saʼ li qʼeq, nimobʼresi li kontraste saʼ li saq malaj jala li kolor rikʼin textColorDarkMode ut/malaj backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Us xkontraste xkolor li tzʼiibʼ kʼeebʼil re li estilo { $styleNumber } saʼ li saq, abʼan maakʼaʼ xkontraste chi ru li ruuchil li kolor saʼ li qʼeq li nachal chaq saʼ li balor aʼan ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; tento { $threshold }:1 chi ubʼej). { $suggestion ->
        [available] Re naq taawanq xkontraste saʼ li qʼeq, nimobʼresi li kontraste saʼ li saq (joʼ eetalil, kʼe textColor="{ $lightColor }") malaj jala li kolor saʼ li qʼeq (joʼ eetalil, kʼe textColorDarkMode="{ $darkColor }").
       *[none] Re naq taawanq xkontraste saʼ li qʼeq, nimobʼresi li kontraste saʼ li saq malaj jala li kolor rikʼin textColorDarkMode.
    }

section-multiple-style-palettes = Junaj ajwiʼ <stylePalette> naru naxsikʼ jun seksion; nakʼanjelak li rosoʼjik.

## Unique variants

variant-num-to-select-not-non-negative-integer = inkʼaʼ naru xnawbʼal xjunes bariante re { $component } xbʼaan naq li numToSelect moko numero entero ta moko kubʼenaq ta chi ru maakʼaʼ.

variant-num-to-select-not-constant-number = inkʼaʼ naru xnawbʼal xjunes bariante re { $component } xbʼaan naq li numToSelect moko numero ta xaqxo.

variant-with-replacement-not-constant-boolean = inkʼaʼ naru xnawbʼal xjunes bariante re { $component } xbʼaan naq li withReplacement moko boolean ta xaqxo.

variant-select-weight-disables-unique = Inkʼaʼ nakʼanjelak xjunes bariante re li select naq wan jun option rikʼin selectWeight malaj selectForVariants kʼeebʼil

variant-coprime-undetermined = inkʼaʼ naru xnawbʼal xjunes bariante re { $component } xbʼaan naq inkʼaʼ naru xnawbʼal naq junelik false li coprime.

variant-attribute-not-constant = inkʼaʼ naru xnawbʼal xjunes bariante re { $component } xbʼaan naq li { $attribute } moko xaqxo ta.

variant-attribute-not-number = inkʼaʼ naru xnawbʼal xjunes bariante re { $component } xbʼaan naq li { $attribute } moko numero ta.

variant-attribute-wrong-type-for-sequence =
    inkʼaʼ naru xnawbʼal xjunes bariante re { $component } re li tipo { $type } xbʼaan naq li { $attribute } moko { $expected ->
        [letters-combination] jun chʼutubʼ letra
        [math-expression] jun tzʼiibʼ matematika us
        [integer] jun numero entero
       *[number] jun numero
    } ta.

variant-length-not-integer = inkʼaʼ naru xnawbʼal xjunes bariante re { $component } xbʼaan naq li length moko numero entero ta.

variant-sort-not-implemented = toj maajiʼ yiibʼanbʼil xjunes bariante re jun { $component } rikʼin sort

variant-exclude-combinations-not-implemented = toj maajiʼ yiibʼanbʼil xjunes bariante re jun { $component } rikʼin excludeCombinations

variant-math-exclude-not-implemented = toj maajiʼ yiibʼanbʼil xjunes bariante re jun { $component } re li tipo math rikʼin exclude

variant-non-constant-exclude-not-implemented = toj maajiʼ yiibʼanbʼil xjunes bariante re jun { $component } rikʼin jun exclude moko xaqxo ta

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: inkʼaʼ nakʼanjelak saʼ li graph prefigure renderer; nakanabʼaak li xkʼulaʼal.

prefigure-descendant-invalid-geometry = { $subject }: inkʼaʼ tzʼaqal malaj maakʼaʼ xraqbʼal li geometria; nakanabʼaak li xkʼulaʼal.

prefigure-curve-label-omitted = { $subject }: inkʼaʼ nakʼanjelak li kʼabʼaʼej saʼ li kotkʼo raqal jalanbʼil; nakanabʼaak li kʼabʼaʼej.

prefigure-curve-unsupported-definition-type = { $subject }: inkʼaʼ nakʼanjelak li tipo naʼlebʼ '{ $definitionType }' re li kotkʼo raqal; nakanabʼaak li xkʼulaʼal.

prefigure-region-flip-functions-unsupported = { $subject }: inkʼaʼ nakʼanjelak li atributo flipFunctions saʼ li regionBetweenCurves; nakanabʼaak li xkʼulaʼal.

prefigure-region-non-formula-child = { $subject }: kaʼajwiʼ funsion re li tipo formula nakʼanjelak joʼ xkʼulaʼal li regionBetweenCurves; nakanabʼaak li xkʼulaʼal.

prefigure-label-position-unsupported =
    { $subject }: inkʼaʼ nakʼanjelak li labelPosition '{ $labelPosition }' re { $labelKind ->
        [line-family] jun kʼabʼaʼej re raqal
       *[point] jun kʼabʼaʼej re punto
    }; nakʼeemank li kʼuubʼanbʼil re PreFigure.

prefigure-fill-style-unsupported = { $subject }: inkʼaʼ nakʼanjelak li estilo re nujenaq '{ $fillStyle }' saʼ li PreFigure; nakʼeemank jun nujenaq junaj.

prefigure-line-style-unknown = { $subject }: inkʼaʼ nawbʼil ru li estilo raqal '{ $lineStyle }' ut nakanabʼaak saʼ li PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: li estilo marker '{ $markerStyle }' xjalmank chi ru li estilo PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: inkʼaʼ nakʼanjelak li estilo marker '{ $markerStyle }' saʼ li PreFigure; nakʼeemank li estilo kʼeebʼil chi junelik.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: inkʼaʼ us li `ref`; inkʼaʼ xtawmank li target. Nakanabʼaak li annotation.

annotation-ref-multiple-targets = `<annotation>`: kʼiila target xtaw li `ref`; nakʼanjelak li xbʼeen.

annotation-ref-outside-graph = `<annotation>`: inkʼaʼ us li `ref`; li target wan chi rix li graph. Nakanabʼaak li annotation.

annotation-ref-unsupported-target = `<annotation>`: inkʼaʼ us li `ref`; li target moko komponente ta grafiko li nakʼanjelak saʼ li jalok chi prefigure. Nakanabʼaak li annotation.

annotation-text-missing = `<annotation>`: maakʼaʼ malaj maakʼaʼ chi saʼ li `text`; natzʼiibʼamank jun tzʼiibʼ maakʼaʼ chi saʼ.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Xtawmank jun kʼuubʼaal nasutin chi ribʼil ribʼ.
       *[other] Xtawmank jun kʼuubʼaal nasutin chi ribʼil ribʼ rikʼin li komponente `<{ $componentType }>`.
    }

reference-no-referent = Inkʼaʼ xtawmank kʼaʼru naxye li referensia: `{ $reference }`

reference-multiple-referents = Kʼiila li naxye li referensia: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Inkʼaʼ us li formato re li atributo { $attribute } re `<{ $componentType }>`.

children-invalid = Inkʼaʼ us eb li xkʼulaʼal re `<{ $componentType }>`: xtawmank xkʼulaʼal inkʼaʼ us: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Inkʼaʼ us li balor `{ $value }` re li atributo `{ $attribute }`, nakʼanjelak li balor `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Inkʼaʼ xtawmank li bersion { $version } re DoenetML.
       *[other] Inkʼaʼ xtawmank li bersion { $version } re DoenetML. Nakʼeemank li bersion { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Inkʼaʼ us li DoenetML: { $content }

parse-tag-missing-close-tag = Inkʼaʼ us li DoenetML: Maakʼaʼ xtzʼapbʼal li etiketa `{ $tag }`. Tento jun etiketa naxtzʼap ribʼ malaj jun etiketa `</{ $tagName }>`.

parse-tag-error = Inkʼaʼ us li DoenetML: Wan paltil saʼ li etiketa `<{ $tagName }>`

parse-attribute-missing-value = Inkʼaʼ us li DoenetML: Chanchan naq maakʼaʼ xbʼalor li atributo `{ $attribute }`.

parse-attribute-invalid = Inkʼaʼ us li DoenetML: Inkʼaʼ us li atributo `{ $attribute }`

parse-attribute-value-invalid = Inkʼaʼ us li DoenetML: Inkʼaʼ us xbʼalor li atributo `{ $value }`

parse-attribute-value-quote-mismatch = Inkʼaʼ us li DoenetML: Inkʼaʼ us xbʼalor li atributo `{ $value }`. Inkʼaʼ nakeʼxkʼul ribʼ li reetalil. Chanchan naq maakʼaʼ jun `{ $quote }`

parse-open-tag-name-missing = Inkʼaʼ us li DoenetML: Xtawmank jun etiketa chi maakʼaʼ xkʼabaʼ, joʼ `<`

parse-tag-not-closed = Inkʼaʼ us li DoenetML: Inkʼaʼ xtzʼapmank li etiketa `{ $tag }` (chanchan naq maakʼaʼ jun `>`).

parse-self-closing-tag-name-missing = Inkʼaʼ us li DoenetML: Xtawmank jun etiketa chi maakʼaʼ xkʼabaʼ `<{ $content }>`

parse-self-closing-tag-not-closed = Inkʼaʼ us li DoenetML: Inkʼaʼ xtzʼapmank li etiketa `{ $tag }` (chanchan naq maakʼaʼ jun `/>`).

parse-tag-invalid-attributes = Inkʼaʼ us li DoenetML: Inkʼaʼ us li etiketa `{ $tag }`. Maare inkʼaʼ us eb li ratributo.

parse-close-tag-name-missing = Inkʼaʼ us li DoenetML: Xtawmank jun etiketa re tzʼapok chi maakʼaʼ xkʼabaʼ, joʼ `</`

parse-attribute-value-unquoted = Tento naq eb xbʼalor li atributo teʼwanq saʼ reetalil: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Inkʼaʼ us li DoenetML: Xtawmank li etiketa re tzʼapok `{ $tag }`, abʼan maakʼaʼ li etiketa re teebʼal

parse-close-tag-mismatched = Inkʼaʼ us li DoenetML: Inkʼaʼ nakʼuulun li etiketa re tzʼapok. Tento `</{ $expected }>`. Xtawmank `{ $found }`

parser-node-unconvertible = Inkʼaʼ naru xjalbʼal li nodo { $node } chi Dast nodo.

## Names

name-attribute-invalid =
    Inkʼaʼ us li atributo name='{ $name }'. { $reason ->
        [characters] Yal letra, numero, raqal saʼ ubʼej malaj raqal naru wan saʼ jun kʼabʼaʼej.
       *[start] Tento naq nateʼtikla rikʼin jun letra eb li kʼabʼaʼej.
    }

component-name-invalid-start = Inkʼaʼ us xkʼabaʼ li komponente "{ $name }". Tento naq nateʼtikla rikʼin jun letra eb li kʼabʼaʼej.

## `<answer>` sugar

answer-video-watched-missing-video = Tento naq wan jun atributo video li sumenk re li tipo videoWatched

answer-video-watched-video-not-reference = Tento naq li atributo video re li sumenk re li tipo videoWatched aʼan jun referensia

answer-name-not-single-text = Tento naq junaj ajwiʼ xkʼulaʼal chi tzʼiibʼ li atributo name re li sumenk

## Referencing another document

external-doenetml-recursion-limit = Inkʼaʼ naru xkʼambʼal chaq li DoenetML chi rix xbʼaan naq kʼiihal xsutinkil ribʼ. Ma wan jun referensia nasutin chi ribʼil ribʼ?

external-doenetml-unavailable = Inkʼaʼ naru xkʼambʼal chaq li DoenetML saʼ { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Inkʼaʼ us li DoenetML kʼamom chaq saʼ { $attribute }="{ $uri }": inkʼaʼ xkʼul ribʼ rikʼin li tipo komponente "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Aakʼ chik li atributo `{ $from }`; kʼe `{ $to }` chi ru.
       *[other] [deprecation] Aakʼ chik li atributo `{ $from }` saʼ `<{ $component }>`; kʼe `{ $to }` chi ru.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Aakʼ chik li atributo `{ $from }` ut nakanabʼaak xbʼaan naq kʼeebʼil ajwiʼ li `{ $to }`.
       *[other] [deprecation] Aakʼ chik li atributo `{ $from }` saʼ `<{ $component }>` ut nakanabʼaak xbʼaan naq kʼeebʼil ajwiʼ li `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Aakʼ chik li atributo `{ $attribute }` saʼ `<{ $component }>` ut nakanabʼaak.

deprecated-attribute-to-child = [deprecation] Aakʼ chik li atributo `{ $attribute }` saʼ `<{ $component }>`; kʼe jun `<{ $child }>` xkʼulaʼal chi ru.

deprecated-attribute-value-renamed = [deprecation] Aakʼ chik li balor `{ $value }` re li atributo `{ $attribute }` saʼ `<{ $component }>`; kʼe `{ $to }` chi ru.


## Language coverage

pluralize-english-only = Yal saʼ Inglees naru naxkʼe chi kʼiihal li `<pluralize>`, joʼkan naq inkʼaʼ najalmank li tzʼiibʼ saʼ jun hu tzʼiibʼanbʼil saʼ { $locale }. Tzʼiibʼa aajwal li kʼiihal, malaj kʼe rikʼin li atributo `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Li elemento `<{ $tag }>` moko elemento ta nawbʼil ru xbʼaan Doenet.

schema-element-not-allowed-at-root = Inkʼaʼ naru naxik li elemento `<{ $tag }>` saʼ xtiklajik li hu.

schema-element-not-allowed-inside = Inkʼaʼ naru naxik li elemento `<{ $tag }>` saʼ xsaʼ `<{ $parent }>`.

schema-attribute-unrecognized = Maakʼaʼ jun ratributo xkʼabaʼ `{ $attribute }` li elemento `<{ $tag }>`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Tento naq li atributo `{ $attribute }` re li elemento `<{ $tag }>` aʼan jun lista ut naq li junjunq re aʼan jun re aʼin: { $allowed }
       *[other] Tento naq li atributo `{ $attribute }` re li elemento `<{ $tag }>` aʼan jun re aʼin: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Inkʼaʼ us xkʼabaʼ li bariante re li select.  Li kʼabʼaʼej { $variantName } nakʼulunk saʼ { $numOptions } option abʼan { $numToSelect } li tento xsikʼbʼal.

select-variant-name-without-options = Wan bariante kʼeebʼil re li select abʼan maakʼaʼ option kʼeebʼil re li kʼabʼaʼej bariante: { $variantName }.

select-variant-name-not-possible = Li kʼabʼaʼej bariante { $variantName } kʼeebʼil re li select inkʼaʼ naru naʼok chi bariante.

select-too-few-options = Inkʼaʼ naru xsikʼbʼal { $numToSelect } komponente saʼ xyanq { $numOptions } ajwiʼ.

select-from-sequence-too-few-values = Inkʼaʼ naru xsikʼbʼal { $numToSelect } balor saʼ jun sekwensia re { $length } xnimal.

select-from-sequence-indices-count-mismatch = Tento naq juntaqʼeet li rajlankil li indise kʼeebʼil re li select rikʼin li rajlankil li tento xsikʼbʼal

select-from-sequence-indices-not-integers = Tento naq numero entero chixjunil li indise kʼeebʼil re li select

select-from-sequence-index-excluded = Kʼeebʼil jun indise re li selectfromsequence li isinbʼil

select-from-sequence-indices-excluded-combination = Kʼeebʼil eb li indise re li selectfromsequence li isinbʼil chi chʼutchʼu

select-from-sequence-coprime-not-positive-integers = Inkʼaʼ naru xsikʼbʼal chʼutubʼ coprime xbʼaan naq moko numero entero ta taqenaq chi ru maakʼaʼ li nasikʼmank.

select-from-sequence-coprime-common-factor = Inkʼaʼ naru xsikʼbʼal numero coprime. Chixjunil li balor wan junaj xfaktor. (Tento naq eb li balor kʼeebʼil re "from" malaj "to" teʼwanq chi coprime rikʼin li "step".)

select-from-sequence-coprime-single-number = Inkʼaʼ naru xsikʼbʼal chʼutubʼ coprime saʼ junaj ajwiʼ numero li moko 1 ta.

select-from-sequence-excluded-too-many-combinations = Isinbʼil numenaq 70% re li chʼutubʼ saʼ li selectFromSequence

select-from-sequence-coprime-none-found = Inkʼaʼ xtawmank numero coprime. Chixjunil li balor wan junaj xfaktor.

select-from-sequence-too-few-unique-values = Inkʼaʼ naru xsikʼbʼal { $numToSelect } balor jalan jalanq saʼ jun sekwensia re { $numPossibleValues } xnimal

select-prime-numbers-too-few-values = Inkʼaʼ naru xsikʼbʼal { $numToSelect } balor saʼ jun lista numero primo re { $numValues } xnimal

select-prime-numbers-values-count-mismatch = Tento naq juntaqʼeet li rajlankil li balor kʼeebʼil re li select rikʼin li rajlankil li tento xsikʼbʼal

select-prime-numbers-values-not-prime = Tento naq chixjunil li balor kʼeebʼil re li select numero primo taawanq saʼ li lista numero primo

select-prime-numbers-values-excluded-combination = Eb li balor kʼeebʼil re li selectPrimeNumbers aʼan jun chʼutubʼ isinbʼil

select-prime-numbers-excluded-too-many-combinations = Isinbʼil numenaq 70% re li chʼutubʼ saʼ li selectPrimeNumbers

select-random-combination-fluke = Xbʼaan jun kʼaʼuxl inkʼaʼ nakʼulman, inkʼaʼ xsikʼmank jun chʼutubʼ balor sikʼbʼil chi maakʼaʼ xnaʼlebʼ

select-random-value-fluke = Xbʼaan jun kʼaʼuxl inkʼaʼ nakʼulman, inkʼaʼ xsikʼmank jun balor sikʼbʼil chi maakʼaʼ xnaʼlebʼ

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    Inkʼaʼ natzʼiibʼamank `<{ $component }>` saʼ xsaʼ li matematika; natzʼiibʼamank li tzʼiibʼ matematika joʼ chanru chaq junxil. { $reason ->
        [not-inline] Kaʼajwiʼ jun choice input `inline` naru naʼok saʼ jun tzʼiibʼ matematika; chi maakʼaʼ li `inline` aʼan jun bloke boton.
        [expanded] Jun text input `expanded` aʼan jun kaxa kʼiila raqal, ut nim chi ru li naru naʼok saʼ jun tzʼiibʼ matematika.
        [on-graph] Saʼ jun graph natzʼiibʼamank li tzʼiibʼ matematika joʼ junaj eetalil, ut maakʼaʼ naʼajej re jun okebʼaal.
       *[relative-width] Relatibo li `width` (jun porsiento malaj `em`), ut maakʼaʼ chi ru naru nabʼisman saʼ jun tzʼiibʼ matematika. Kʼe li ruuchil chi absoluto, joʼ `px`.
    }
