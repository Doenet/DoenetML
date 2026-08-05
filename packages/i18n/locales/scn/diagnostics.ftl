# Sicilian diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
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


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } veni ignoratu quannu tutti dui l'estremi sunnu spicificati
       *[other] { $attributes } vènunu ignorati quannu tutti dui l'estremi sunnu spicificati
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } veni ignoratu quannu un estremu e un puntu di menzu sunnu spicificati nzèmmula
       *[other] { $attributes } vènunu ignorati quannu un estremu e un puntu di menzu sunnu spicificati nzèmmula
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset nun havi effettu senza un puntu di menzu

## `<line>`

line-points-undetermined-dimensions = Retta ca passa pi punti di dimensioni nun determinati.

line-points-too-few-dimensions = A retta havi a passari pi punti d'armenu dui dimensioni.

line-points-depend-on-variables = A retta passa pi punti ca dipènnunu di variàbbili: { $variables }.

line-equation-invalid-format = Furmatu non vàlidu pi l'equazzioni di na retta ntê variàbbili { $variable1 } e { $variable2 }.

## `<ray>`

ray-overprescribed-through = A simiretta è determinata di through, endpoint e direction. U through spicificatu veni ignoratu.

ray-dimension-mismatch = numDimensions nun currispunni ntô ray.

## `<vector>`

vector-overprescribed-head = U vitturi è determinatu di head, tail e displacement. U head spicificatu veni ignoratu.

vector-dimension-mismatch = numDimensions nun currispunni ntô vector.

## Attracting and constraining

attract-to-without-nearest-point = Nun si pò attirari a un `<{ $component }>` pirchì nun havi a variàbbili di statu nearestPoint.

constrain-to-without-nearest-point = Nun si pò limitari a un `<{ $component }>` pirchì nun havi a variàbbili di statu nearestPoint.

constrain-to-interior-without-nearest-point = Nun si pò limitari ô nternu di un `<{ $component }>` pirchì nun havi a variàbbili di statu nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition veni ignoratu ntôn choiceInput ca nun è inline

## Ordering children by index

choice-input-indices-count-mismatch = L'ìnnici spicificati pi choiceInput vènunu ignorati pirchì u nùmmiru so nun currispunni ô nùmmiru di figghi choice.

pretzel-indices-count-mismatch = L'ìnnici spicificati pi problem vènunu ignorati pirchì u nùmmiru so nun currispunni ô nùmmiru di figghi problem.

shuffle-indices-count-mismatch = L'ìnnici spicificati pi shuffle vènunu ignorati pirchì u nùmmiru so nun currispunni ô nùmmiru di cumpunenti.

indices-ignored-out-of-range = L'ìnnici spicificati pi { $component } vènunu ignorati pirchì quarchidunu è fora di l'ntervallu.

pretzel-indices-repeated = L'ìnnici spicificati pi pretzel vènunu ignorati pirchì quarchidunu si ripeti.

pretzel-circuit-first-index = L'ìnnici spicificati pi pretzel ntô mode="circuit" vènunu ignorati pirchì u primu ìnnici havi a èssiri 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Pi fari funzionari `<{ $component }>` cu figghi di testu, havi a èssiri spicificatu un attribbutu `type`.

invalid-type-defaulting-to-math = type { $type } non vàlidu pû cumpunenti { $component }. Havi a èssiri math, text, number o boolean. Si mitti a math.

string-not-valid-component-to-arrange = U testu "{ $value }" nun è un cumpunenti vàlidu pi { $component }. Veni ignoratu.

## Types and variables

invalid-type-defaulting-to-number = type { $type } non vàlidu, type si mitti a number.

invalid-variable-value = Valuri non vàlidu di na variàbbili: `{ $value }`

## Variants

variant-index-must-be-number = L'ìnnici di varianti { $index } havi a èssiri un nùmmiru

variant-index-must-be-integer = L'ìnnici di varianti { $index } havi a èssiri un nùmmiru nteru

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` nun è mplimintatu pi misuri assuluti. I larghizzi si mèttunu a rilativi.

side-by-side-absolute-margins = `<{ $component }>` nun è mplimintatu pi misuri assuluti. I màrgini si mèttunu a rilativi.

side-by-side-no-block-child = `<{ $component }>` non vàlidu: havi a aviri armenu un figghiu di bloccu.

## `<label>`

label-for-ignored-on-graphical = L'attribbutu `for` supra un `<label>` gràficu veni ignoratu.

label-for-must-resolve-to-one = L'attribbutu `for` supra `<label>` havi a risòrviri a un sulu cumpunenti.

label-for-unresolved = L'attribbutu `for` supra `<label>` nun si potti risòrviri a un cumpunenti.

label-for-answer-with-authored-inputs = L'attribbutu `for` supra `<label>` si rifirisci a un `<answer>` cu campi d'ntrata scritti apposta; rifirìsciti ô campu direttamenti.

label-for-answer-without-input = L'attribbutu `for` supra `<label>` si rifirisci a un `<answer>` senza campu d'ntrata di etichittari.

label-for-must-reference-input-or-answer = L'attribbutu `for` supra `<label>` s'havi a rifiriri a un campu d'ntrata o a un answer.

## Accessibility

accessibility-short-description-or-decorative = Pi l'accissibbilità, `<{ $component }>` havi a aviri na discrizzioni curta o èssiri spicificatu comu dicurativu.

accessibility-video-short-description = Pi l'accissibbilità, `<video>` havi a aviri na discrizzioni curta.

accessibility-input-short-description-or-label = Pi l'accissibbilità, `<{ $component }>` havi a aviri na discrizzioni curta o na etichetta.

accessibility-answer-input-short-description-or-label = Pi l'accissibbilità, un `<answer>` ca crea un campu d'ntrata havi a aviri na discrizzioni curta o na etichetta.

accessibility-short-description-contains-math = I discrizzioni curti nun hannu a cuntèniri cumpunenti matimàtici comu `<{ $component }>`. Scrivi a matimàtica cu palori.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } nun havi cuntrastu abbastanza pû testu dû tìtulu di sizzioni (mudalità scura) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ci voli armenu { $threshold }:1).
       *[other] { $colorName } nun havi cuntrastu abbastanza pû testu dû tìtulu di sizzioni ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ci voli armenu { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` ca passa pi { $count } punti nun è mplimintatu quannu i punti nun hannu valuri numèrici.

circle-too-many-through-points = Nun si pò carculari un circu ca passa pi chiù di 3 punti.

circle-overprescribed-radius-center-points = Nun si pò carculari un circu cu ràggiu, centru e punti spicificati.

circle-center-with-multiple-points = Nun si pò carculari un circu cu centru spicificatu ca passa pi chiù di 1 puntu.

circle-radius-too-small = Nun si pò carculari u circu: siccomu a distanza tra i dui punti è { $distance }, u ràggiu spicificatu { $radius } è troppu nicu.

circle-radius-with-many-points = Nun si pò criari un circu ca passa pi chiù di dui punti cu un ràggiu spicificatu.

circle-invalid-center-or-through-points = Centru o punti di passaggiu dû circu non vàlidi.

circle-radius-center-with-multiple-points = Nun si pò carculari u ràggiu di un circu cu centru spicificatu ca passa pi chiù di 1 puntu.

circle-change-radius-non-numerical = Nun si pò canciari u ràggiu di un circu cu punti non numèrici

circle-radius-with-points-non-numerical = Nun si pò criari un circu ca passa pi chiù di un puntu cu un ràggiu spicificatu quannu i valuri nun sunnu numèrici.

circle-change-center-non-numerical = U canciamentu dû centru di un circu ca passa pi punti cu valuri non numèrici nun è mplimintatu.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Dimensioni nun abbastanza pû dumìniu dâ funzioni. U dumìniu havi { $intervals } ntervallu ma a funzioni havi { $inputs ->
            [one] { $inputs } ntrata
           *[other] { $inputs } ntrati
        }.
       *[other] Dimensioni nun abbastanza pû dumìniu dâ funzioni. U dumìniu havi { $intervals } ntervalli ma a funzioni havi { $inputs ->
            [one] { $inputs } ntrata
           *[other] { $inputs } ntrati
        }.
    }

function-domain-invalid-format = Furmatu non vàlidu pû dumìniu dâ funzioni.

function-ignoring-non-numerical =
    { $type ->
        [maximum] U màssimu non numèricu dâ funzioni veni ignoratu.
        [minimum] U mìnimu non numèricu dâ funzioni veni ignoratu.
        [extremum] L'estremu non numèricu dâ funzioni veni ignoratu.
        [point] U puntu non numèricu dâ funzioni veni ignoratu.
        [slope] A pinnenza non numèrica dâ funzioni veni ignorata.
       *[other] U { $type } non numèricu dâ funzioni veni ignoratu.
    }

function-ignoring-empty =
    { $type ->
        [maximum] U màssimu vacanti dâ funzioni veni ignoratu.
        [minimum] U mìnimu vacanti dâ funzioni veni ignoratu.
        [extremum] L'estremu vacanti dâ funzioni veni ignoratu.
        [point] U puntu vacanti dâ funzioni veni ignoratu.
       *[other] U { $type } vacanti dâ funzioni veni ignoratu.
    }

function-points-too-close = A funzioni cunteni dui punti troppu vicini tra d'iddi. Nun si pò definiri a funzioni.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] I itirazzioni di na funzioni sunnu pussìbbili sulu si u nùmmiru d'ntrati è uguali a chiddu d'nisciuti. Sta funzioni havi { $inputs } ntrata e { $outputs ->
            [one] { $outputs } nisciuta
           *[other] { $outputs } nisciuti
        }.
       *[other] I itirazzioni di na funzioni sunnu pussìbbili sulu si u nùmmiru d'ntrati è uguali a chiddu d'nisciuti. Sta funzioni havi { $inputs } ntrati e { $outputs ->
            [one] { $outputs } nisciuta
           *[other] { $outputs } nisciuti
        }.
    }

## `<sequence>`

sequence-invalid-length = Longhizza non vàlida dâ sequenza. Havi a èssiri un nùmmiru nteru non nigativu.

sequence-invalid-step = Passu non vàlidu dâ sequenza. Havi a èssiri un nùmmiru pi na sequenza di tipu { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" non vàlidu di na sequenza di nùmmiri. Havi a èssiri un nùmmiru.

sequence-invalid-endpoint-letters = "{ $attribute }" non vàlidu di na sequenza di lèttiri. Havi a èssiri na cumminazzioni di lèttiri.

sequence-invalid-endpoint = "{ $attribute }" non vàlidu dâ sequenza.

select-from-sequence-coprime-not-numbers = coprime veni ignoratu pirchì nun si stannu scigghiennu nùmmiri

select-from-sequence-coprime-with-exclude-combinations = coprime veni ignoratu pirchì excludeCombinations è spicificatu

## Resolving a `target`

target-not-found = target non vàlidu pi `<{ $source }>`: nun si trova l'obbiettivu.

target-state-variable-not-found = target non vàlidu pi `<{ $source }>`: nun si trova nudda variàbbili di statu chiamata "{ $property }" supra un `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = I variàbbili di `<odeSystem>` hannu a èssiri diversi dâ variàbbili nnipinnenti.

ode-system-duplicate-variable-names = Nun si pònnu definiri i funzioni dû membru drittu di l'EDO cu nomi di variàbbili dipinnenti ripituti.

ode-system-rhs-function-error = Nun si pò definiri a funzioni dû membru drittu di l'EDO. Erruri criannu a funzioni mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Nun si pò definiri un àngulu tra { $count } retti

angle-invalid-through-point = Puntu non vàlidu ntô through di `<angle>`

parabola-vertex-too-many-points = Na paràbula cu vèrtici ca passa pi chiù di 1 puntu nun è mplimintata.

parabola-too-many-points = Na paràbula ca passa pi chiù di 3 punti nun è mplimintata.

intersection-too-many-items = L'ntirsizzioni di chiù di dui oggetti nun è mplimintata

## Other math components

ionic-compound-not-two-ions = Un cumpostu iònicu nun è mplimintatu p'àutru ca pi dui ioni.

ionic-compound-needs-cation-and-anion = Un cumpostu iònicu è mplimintatu sulu pi un cationi e un anioni.

solve-equations-cannot-evaluate = Nun si pò risòrviri l'equazzioni pirchì nun si potti valutari: { $equation }

math-operators-operand-number-required = Havi a èssiri spicificatu un operandNumber quannu si stratta un opirannu matimàticu.

eigen-decomposition-failed = Nun si pòttiru carculari l'autovaluri dâ matrici

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: u paràmitru { $parameters } nun cumpari ntô mudellu, e accussì currispunni sempri a un vacanti.
       *[other] `<matchesPattern>`: i paràmitri { $parameters } nun cumpàrunu ntô mudellu, e accussì currispùnnunu sempri a un vacanti.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: nun si pò ntirpritari grid="{ $grid }". Havi a èssiri none, medium, dense o dui nùmmiri pusitivi spartuti di un spazziu, pi esempiu grid="1 0.5". Nun si disigna nudda griglia.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" nun è suppurtatu ntô muturi prefigure; s'usa u cumpurtamentu dâ pusizzioni destra.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" nun è suppurtatu ntô muturi prefigure; s'usa u cumpurtamentu dâ pusizzioni supraniana.

prefigure-invalid-axis-bounds = `<graph>`: lìmiti d'assi non vàlidi pâ cunvirsioni n prefigure; s'usa a bbox pridifinuta (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: larghizza non vàlida pâ cunvirsioni n prefigure; s'usa a larghizza pridifinuta 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio non vàlidu pâ cunvirsioni n prefigure; s'usa a pruporzioni pridifinuta 1.

prefigure-grid-spacing-too-fine = `<graph>`: u spazziu dâ griglia è troppu strittu pi lìmiti di l'assi; a griglia veni lassata ntô muturi prefigure.

prefigure-annotations-not-rendered = `<graph>`: l'annutazzioni nun vènunu ammustrati quannu nun s'usa u muturi PreFigure.

multiple-annotations-children = Foru truvati chiù figghi `<annotations>` ntô `<graph>`; tutti tranni l'ùrtimu vènunu ignorati.

## Referring to other components

copy-unrecognized-component-type = Nun si pò stènniri o cupiari un tipu di cumpunenti scanusciutu: { $type }.

copy-prop-not-found = Nun fu truvata a prupietà { $property } supra un cumpunenti di tipu { $component }

collect-no-source = Nun fu truvata nudda surgenti pi collect.

collect-invalid-component-type = Nun si pònnu arricògghiri cumpunenti di tipu `<{ $component }>` pirchì è un tipu di cumpunenti non vàlidu.

reference-index-unavailable = Nun si pò fari rifirimentu a l'ìnnici `{ $reference }`

## `<callAction>`

component-action-unavailable = Nun si pò chiamari { $action } supra u cumpunenti `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = I dati hannu na forma non vàlida. I righi hannu longhizzi diversi. Truvatu ntô componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = I dati hannu nomi di culonna ripituti. Truvatu ntô componentIdx :{ $componentIdx }

data-frame-missing-column-name = Ê dati ci manca un nomu di culonna. Truvatu ntô componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Un award di sta risposta si basa supra a risposta mannata di l'etichetta answer stissa, ca porta a un cumpurtamentu nun aspittatu.

answer-max-num-attempts-in-section-wide-check-work = Mèttiri `maxNumAttempts` supra un `<answer>` dintra un cuntinituri cu `sectionWideCheckWork` nun havi effettu, pirchì u nùmmiru di prova è cuntrullatu dû cuntinituri. Metti `maxNumAttempts` supra u cuntinituri.

nested-section-wide-check-work-max-num-attempts = Mèttiri `maxNumAttempts` supra un cuntinituri cu `sectionWideCheckWork` ca è dintra n àutru cuntinituri cu `sectionWideCheckWork` nun havi effettu, pirchì u nùmmiru di prova è cuntrullatu dû cuntinituri di fora. Metti `maxNumAttempts` supra u cuntinituri di fora.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] L'attribbutu { $attributes } nun havi effettu senza symbolicEquality.
       *[other] L'attribbuti { $attributes } nun hannu effettu senza symbolicEquality.
    }

answer-invalid-type = Tipu non vàlidu pâ risposta: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Siccomu u cumpunenti `<{ $component }>` nun havi nomu, nun si pò usari comu attribbutu di un mòdulu

module-attribute-name-already-defined = U cumpunenti `<{ $component } name="{ $name }">` nun si pò usari comu attribbutu di un mòdulu pirchì u tipu di cumpunenti `<module>` havi già un attribbutu "{ $name }".

conditional-content-condition-ignored = L'attribbutu `condition` veni ignoratu supra un cumpunenti `<conditionalContent>` cu figghi case o else.

slider-markers-type-mismatch = U tipu dî marcaturi nun currispunni ô tipu dû cursuri.

pretzel-problem-needs-statement-and-answer = pretzel non vàlidu: ogni `<problem>` havi a cuntèniri un `<statement>` e un `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel non vàlidu: ntô mode="circuit", u primu `<problem>` nun pò èssiri un distratturi.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Valuri non vàlidu { $values } pi l'attribbutu `{ $attribute }`; veni ignoratu.
       *[other] Valuri non vàlidi { $values } pi l'attribbutu `{ $attribute }`; vènunu ignorati.
    }

attribute-must-be-references = Valuri non vàlidu `{ $value }` pi l'attribbutu `{ $attribute }`. L'attribbutu havi a èssiri fattu di rifirimenti ca accumènzanu cu un `$`.

math-input-invalid-function-names = <mathInput>: nomi di funzioni non vàlidi ignorati ntô { $attribute }: { $names }. A parti ammustrata di ogni nomu havi a èssiri d'armenu 2 caràttiri (lèttiri o tratti); ci pò sicutari un suffissu facultativu `|<mathspeak alternativa>`.

## Building components from the source

component-type-invalid = Tipu di cumpunenti non vàlidu: `<{ $componentType }>`

attribute-repeated = Nun si pò ripètiri l'attribbutu { $attribute }.

attribute-invalid-for-component = Attribbutu "{ $attribute }" non vàlidu pi un cumpunenti di tipu `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    A definizzioni di stili { $styleNumber } nun havi cuntrastu abbastanza pi { $context ->
        [text-on-background] u culuri dû testu cuntra u culuri di sfunnu
        [high-contrast] u culuri d'autu cuntrastu cuntra a tila
        [line] u culuri dâ linia cuntra a tila
        [marker] u culuri dû marcaturi cuntra a tila
       *[text-on-canvas] u culuri dû testu cuntra a tila
    }{ $mode ->
        [dark] { " (mudalità scura)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ci voli armenu { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Macari si a definizzioni di stili { $styleNumber } spicìfica culura cu cuntrastu abbastanza pâ mudalità chiara, i culura dâ mudalità scura ricavati di sti valuri nun hannu cuntrastu abbastanza tra u culuri dû testu e u culuri di sfunnu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ci voli armenu { $threshold }:1). { $suggestion ->
        [available] Pi assicurari cuntrastu abbastanza ntâ mudalità scura, auménta u cuntrastu dâ mudalità chiara (pi esempiu { $lightAttribute }="{ $lightColor }") o cància u culuri dâ mudalità scura (pi esempiu { $darkAttribute }="{ $darkColor }").
       *[none] Pi assicurari cuntrastu abbastanza ntâ mudalità scura, auménta u cuntrastu dâ mudalità chiara o cància i culura ricavati cu textColorDarkMode e/o backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Macari si a definizzioni di stili { $styleNumber } spicìfica un culuri di testu cu cuntrastu abbastanza pâ mudalità chiara, u culuri di testu dâ mudalità scura ricavatu di stu valuri nun havi cuntrastu abbastanza cuntra a tila ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ci voli armenu { $threshold }:1). { $suggestion ->
        [available] Pi assicurari cuntrastu abbastanza ntâ mudalità scura, auménta u cuntrastu dâ mudalità chiara (pi esempiu textColor="{ $lightColor }") o cància u culuri dâ mudalità scura (pi esempiu textColorDarkMode="{ $darkColor }").
       *[none] Pi assicurari cuntrastu abbastanza ntâ mudalità scura, auménta u cuntrastu dâ mudalità chiara o cància u culuri ricavatu cu textColorDarkMode.
    }

section-multiple-style-palettes = Na sizzioni pò scègghiri na sula <stylePalette>; s'usa l'ùrtima.

## Unique variants

variant-num-to-select-not-non-negative-integer = nun si pònnu determinari i varianti ùnichi di { $component } pirchì numToSelect nun è un nùmmiru nteru non nigativu.

variant-num-to-select-not-constant-number = nun si pònnu determinari i varianti ùnichi di { $component } pirchì numToSelect nun è un nùmmiru custanti.

variant-with-replacement-not-constant-boolean = nun si pònnu determinari i varianti ùnichi di { $component } pirchì withReplacement nun è un boolean custanti.

variant-select-weight-disables-unique = I varianti ùnichi pi select sunnu disattivati si na opzioni havi selectWeight o selectForVariants spicificatu

variant-coprime-undetermined = nun si pònnu determinari i varianti ùnichi di { $component } pirchì nun si pò determinari ca coprime è sempri fausu.

variant-attribute-not-constant = nun si pònnu determinari i varianti ùnichi di { $component } pirchì { $attribute } nun è na custanti.

variant-attribute-not-number = nun si pònnu determinari i varianti ùnichi di { $component } pirchì { $attribute } nun è un nùmmiru.

variant-attribute-wrong-type-for-sequence =
    nun si pònnu determinari i varianti ùnichi di { $component } di tipu { $type } pirchì { $attribute } nun è { $expected ->
        [letters-combination] na cumminazzioni di lèttiri
        [math-expression] na sprissioni matimàtica vàlida
        [integer] un nùmmiru nteru
       *[number] un nùmmiru
    }.

variant-length-not-integer = nun si pònnu determinari i varianti ùnichi di { $component } pirchì length nun è un nùmmiru nteru.

variant-sort-not-implemented = i varianti ùnichi di un { $component } cu sort nun sunnu mplimintati

variant-exclude-combinations-not-implemented = i varianti ùnichi di un { $component } cu excludeCombinations nun sunnu mplimintati

variant-math-exclude-not-implemented = i varianti ùnichi di un { $component } di tipu math cu exclude nun sunnu mplimintati

variant-non-constant-exclude-not-implemented = i varianti ùnichi di un { $component } cu un exclude non custanti nun sunnu mplimintati

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: nun è suppurtatu ntô muturi prefigure dû gràficu; u dischinnenti veni satatu.

prefigure-descendant-invalid-geometry = { $subject }: giumitrìa non finita o nun cumpleta; u dischinnenti veni satatu.

prefigure-curve-label-omitted = { $subject }: l'etichetti nun sunnu suppurtati supra l'elementi di curva cunvirtuti; l'etichetta veni lassata.

prefigure-curve-unsupported-definition-type = { $subject }: tipu di definizzioni di funzioni di curva nun suppurtatu '{ $definitionType }'; u dischinnenti veni satatu.

prefigure-region-flip-functions-unsupported = { $subject }: attribbutu flipFunctions nun suppurtatu supra regionBetweenCurves; u dischinnenti veni satatu.

prefigure-region-non-formula-child = { $subject }: supra regionBetweenCurves sunnu suppurtati sulu i funzioni figghi definuti di na fòrmula; u dischinnenti veni satatu.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' nun suppurtatu pi { $labelKind ->
        [line-family] na etichetta dâ famigghia dî linii
       *[point] na etichetta di puntu
    }; s'usa l'allineamentu PreFigure pridifinutu.

prefigure-fill-style-unsupported = { $subject }: u stili di jinchimentu '{ $fillStyle }' nun è suppurtatu di PreFigure; si torna a un jinchimentu chinu.

prefigure-line-style-unknown = { $subject }: stili di linia scanusciutu '{ $lineStyle }' lassatu fora dâ nisciuta PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: u stili di marcaturi '{ $markerStyle }' fu cunvirtutu ntô stili PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: u stili di marcaturi '{ $markerStyle }' nun è suppurtatu di PreFigure; s'usa u stili pridifinutu.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` non vàlidu; nun si pò risòrviri l'obbiettivu. L'annutazzioni veni lassata.

annotation-ref-multiple-targets = `<annotation>`: `ref` si risurviu a chiù obbiettivi; s'usa u primu.

annotation-ref-outside-graph = `<annotation>`: `ref` non vàlidu; l'obbiettivu è fora dû gràficu ca u cunteni. L'annutazzioni veni lassata.

annotation-ref-unsupported-target = `<annotation>`: `ref` non vàlidu; l'obbiettivu nun è un oggettu gràficu suppurtatu ntâ cunvirsioni prefigure. L'annutazzioni veni lassata.

annotation-text-missing = `<annotation>`: `text` manca o è vacanti; si produci un testu vacanti.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Fu truvata na dipinnenza circulari.
       *[other] Fu truvata na dipinnenza circulari ca cunteni un cumpunenti `<{ $componentType }>`.
    }

reference-no-referent = Nun fu truvatu nuddu rifirenti pû rifirimentu: `{ $reference }`

reference-multiple-referents = Foru truvati chiù rifirenti pû rifirimentu: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Furmatu non vàlidu pi l'attribbutu { $attribute } di `<{ $componentType }>`.

children-invalid = Figghi non vàlidi pi `<{ $componentType }>`: foru truvati figghi non vàlidi: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valuri non vàlidu `{ $value }` pi l'attribbutu `{ $attribute }`, s'usa u valuri `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] A virsioni { $version } di DoenetML nun fu truvata.
       *[other] A virsioni { $version } di DoenetML nun fu truvata. Si torna â virsioni { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML non vàlidu: { $content }

parse-tag-missing-close-tag = DoenetML non vàlidu: l'etichetta `{ $tag }` nun havi etichetta di chiusura. S'aspittava na etichetta ca si chiui d'idda o na etichetta `</{ $tagName }>`.

parse-tag-error = DoenetML non vàlidu: erruri nta l'etichetta `<{ $tagName }>`

parse-attribute-missing-value = DoenetML non vàlidu: pari ca a l'attribbutu non vàlidu `{ $attribute }` ci manca un valuri.

parse-attribute-invalid = DoenetML non vàlidu: attribbutu non vàlidu `{ $attribute }`

parse-attribute-value-invalid = DoenetML non vàlidu: valuri d'attribbutu non vàlidu `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML non vàlidu: valuri d'attribbutu non vàlidu `{ $value }`. I virguletti nun currispùnnunu. Pari ca manca na `{ $quote }`

parse-open-tag-name-missing = DoenetML non vàlidu: fu truvata na etichetta senza nomu, pi esempiu `<`

parse-tag-not-closed = DoenetML non vàlidu: l'etichetta `{ $tag }` nun fu chiusa (pari ca manca un `>`).

parse-self-closing-tag-name-missing = DoenetML non vàlidu: fu truvata na etichetta senza nomu `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML non vàlidu: l'etichetta `{ $tag }` nun fu chiusa (pari ca manca `/>`).

parse-tag-invalid-attributes = DoenetML non vàlidu: l'etichetta `{ $tag }` nun è vàlida. Pò aviri attribbuti sbagghiati.

parse-close-tag-name-missing = DoenetML non vàlidu: fu truvata na etichetta di chiusura senza nomu, pi esempiu `</`

parse-attribute-value-unquoted = I valuri d'attribbutu hannu a stari tra virguletti: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML non vàlidu: fu truvata l'etichetta di chiusura `{ $tag }`, ma nudda etichetta d'apirtura currispunnenti

parse-close-tag-mismatched = DoenetML non vàlidu: etichetta di chiusura ca nun currispunni. S'aspittava `</{ $expected }>`. Fu truvata `{ $found }`

parser-node-unconvertible = Nun si potti cunvirtiri u nodu { $node } ntôn nodu Dast.

## Names

name-attribute-invalid =
    Attribbutu name='{ $name }' non vàlidu. { $reason ->
        [characters] I nomi pònnu cuntèniri sulu lèttiri, nùmmiri, tratti bassi o tratti.
       *[start] I nomi hannu a accuminzari cu na lèttira.
    }

component-name-invalid-start = Nomu di cumpunenti "{ $name }" non vàlidu. I nomi hannu a accuminzari cu na lèttira.

## `<answer>` sugar

answer-video-watched-missing-video = Un answer di tipu videoWatched havi a aviri un attribbutu video

answer-video-watched-video-not-reference = Un answer di tipu videoWatched havi a aviri un attribbutu video ca sia un rifirimentu

answer-name-not-single-text = L'attribbutu name di un answer havi a aviri un sulu figghiu di testu

## Referencing another document

external-doenetml-recursion-limit = Nun si pò arricupirari u DoenetML esternu pirchì ci sunnu troppu livelli di ricursioni. Ci fussi un rifirimentu circulari?

external-doenetml-unavailable = Nun si pò arricupirari DoenetML di { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML non vàlidu arricupiratu di { $attribute }="{ $uri }": nun currispunniva ô tipu di cumpunenti "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] L'attribbutu `{ $from }` è vecchiu; usa `{ $to }` mparu.
       *[other] [deprecation] L'attribbutu `{ $from }` supra `<{ $component }>` è vecchiu; usa `{ $to }` mparu.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] L'attribbutu `{ $from }` è vecchiu e veni ignoratu pirchì è spicificatu macari `{ $to }`.
       *[other] [deprecation] L'attribbutu `{ $from }` supra `<{ $component }>` è vecchiu e veni ignoratu pirchì è spicificatu macari `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] L'attribbutu `{ $attribute }` supra `<{ $component }>` è vecchiu e veni ignoratu.

deprecated-attribute-to-child = [deprecation] L'attribbutu `{ $attribute }` supra `<{ $component }>` è vecchiu; usa un figghiu `<{ $child }>` mparu.

deprecated-attribute-value-renamed = [deprecation] U valuri `{ $value }` di l'attribbutu `{ $attribute }` supra `<{ $component }>` è vecchiu; usa `{ $to }` mparu.


## Language coverage

pluralize-english-only = `<pluralize>` pò mèttiri ô plurali sulu l'ngrisi, e accussì u so testu resta tali e quali ntôn ducumentu scrittu n { $locale }. Scrivi a forma plurali direttamenti, o spicifìcala cu l'attribbutu `pluralForm`.


## Checking against the schema

schema-element-unrecognized = L'elementu `<{ $tag }>` nun è un elementu Doenet ricanusciutu.

schema-element-not-allowed-at-root = L'elementu `<{ $tag }>` nun è pirmisu ntâ radici dû ducumentu.

schema-element-not-allowed-inside = L'elementu `<{ $tag }>` nun è pirmisu dintra `<{ $parent }>`.

schema-attribute-unrecognized = L'elementu `<{ $tag }>` nun havi nuddu attribbutu chiamatu `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] L'attribbutu `{ $attribute }` di l'elementu `<{ $tag }>` havi a èssiri na lista unni ogni elementu è unu di chisti: { $allowed }
       *[other] L'attribbutu `{ $attribute }` di l'elementu `<{ $tag }>` havi a èssiri unu di chisti: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nomu di varianti non vàlidu pi select. U nomu di varianti { $variantName } cumpari n { $numOptions } opzioni ma u nùmmiru di scègghiri è { $numToSelect }.

select-variant-name-without-options = Sunnu spicificati quarchi varianti pi select ma nudda opzioni pû nomu di varianti pussìbbili: { $variantName }.

select-variant-name-not-possible = U nomu di varianti { $variantName } spicificatu pi select nun è un nomu di varianti pussìbbili.

select-too-few-options = Nun si pònnu scègghiri { $numToSelect } cumpunenti di sulu { $numOptions }.

select-from-sequence-too-few-values = Nun si pònnu scègghiri { $numToSelect } valuri di na sequenza di longhizza { $length }.

select-from-sequence-indices-count-mismatch = U nùmmiru d'ìnnici spicificati pi select havi a currispùnniri ô nùmmiru di scègghiri

select-from-sequence-indices-not-integers = Tutti l'ìnnici spicificati pi select hannu a èssiri nùmmiri nteri

select-from-sequence-index-excluded = Un ìnnici spicificatu di selectfromsequence era esclusu

select-from-sequence-indices-excluded-combination = L'ìnnici spicificati di selectfromsequence eranu na cumminazzioni esclusa

select-from-sequence-coprime-not-positive-integers = Nun si pònnu scègghiri cumminazzioni coprimi pirchì nun si stannu scigghiennu nùmmiri nteri pusitivi.

select-from-sequence-coprime-common-factor = Nun si pònnu scègghiri nùmmiri coprimi. Tutti i valuri pussìbbili hannu un fatturi cumuni. (I valuri spicificati di "from" o "to" hannu a èssiri coprimi cu "step".)

select-from-sequence-coprime-single-number = Nun si pònnu scègghiri cumminazzioni coprimi di un sulu nùmmiru ca nun è 1.

select-from-sequence-excluded-too-many-combinations = Chiù dû 70% dî cumminazzioni fu esclusu n selectFromSequence

select-from-sequence-coprime-none-found = Nun si pòttiru scègghiri nùmmiri coprimi. Tutti i valuri pussìbbili hannu un fatturi cumuni.

select-from-sequence-too-few-unique-values = Nun si pònnu scègghiri { $numToSelect } valuri ùnichi di na sequenza di longhizza { $numPossibleValues }

select-prime-numbers-too-few-values = Nun si pònnu scègghiri { $numToSelect } valuri di na lista di nùmmiri primi di longhizza { $numValues }

select-prime-numbers-values-count-mismatch = U nùmmiru di valuri spicificati pi select havi a currispùnniri ô nùmmiru di scègghiri

select-prime-numbers-values-not-prime = Tutti i valuri spicificati pi scègghiri nùmmiri primi hannu a stari ntâ lista dî nùmmiri primi

select-prime-numbers-values-excluded-combination = I valuri spicificati di selectPrimeNumbers eranu na cumminazzioni esclusa

select-prime-numbers-excluded-too-many-combinations = Chiù dû 70% dî cumminazzioni fu esclusu n selectPrimeNumbers

select-random-combination-fluke = Pi na cumminazzioni assai mprubbàbbili, nun si potti scègghiri nudda cumminazzioni di valuri a casu

select-random-value-fluke = Pi na cumminazzioni assai mprubbàbbili, nun si potti scègghiri nuddu valuri a casu
