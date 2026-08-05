# Corsican diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
        [one] { $attributes } hè ignoratu quandu i dui estremi sò specificati
       *[other] { $attributes } sò ignorati quandu i dui estremi sò specificati
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } hè ignoratu quandu un estremu è un puntu mediu sò specificati inseme
       *[other] { $attributes } sò ignorati quandu un estremu è un puntu mediu sò specificati inseme

    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ùn hà effettu senza un puntu mediu

## `<line>`

line-points-undetermined-dimensions = Retta chì passa per punti di dimensioni indeterminate.

line-points-too-few-dimensions = A retta deve passà per punti d'almenu duie dimensioni.

line-points-depend-on-variables = A retta passa per punti chì dipendenu da variabili: { $variables }.

line-equation-invalid-format = Furmatu invalidu per l'equazione d'una retta in e variabili { $variable1 } è { $variable2 }.

## `<ray>`

ray-overprescribed-through = A semiretta hè determinata da through, endpoint è direction. U through specificatu hè ignoratu.

ray-dimension-mismatch = numDimensions ùn currisponde in ray.

## `<vector>`

vector-overprescribed-head = U vettore hè determinatu da head, tail è displacement. U head specificatu hè ignoratu.

vector-dimension-mismatch = numDimensions ùn currisponde in vector.

## Attracting and constraining

attract-to-without-nearest-point = Ùn si pò attirà versu un `<{ $component }>` perchè ùn hà a variabile di statu nearestPoint.

constrain-to-without-nearest-point = Ùn si pò limità à un `<{ $component }>` perchè ùn hà a variabile di statu nearestPoint.

constrain-to-interior-without-nearest-point = Ùn si pò limità à l'internu d'un `<{ $component }>` perchè ùn hà a variabile di statu nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition hè ignoratu in un choiceInput chì ùn hè inline

## Ordering children by index

choice-input-indices-count-mismatch = L'indici specificati per choiceInput sò ignorati perchè u so numeru ùn currisponde à u numeru di figlioli choice.

pretzel-indices-count-mismatch = L'indici specificati per problem sò ignorati perchè u so numeru ùn currisponde à u numeru di figlioli problem.

shuffle-indices-count-mismatch = L'indici specificati per shuffle sò ignorati perchè u so numeru ùn currisponde à u numeru di cumpunenti.

indices-ignored-out-of-range = L'indici specificati per { $component } sò ignorati perchè alcuni sò fora di l'intervallu.

pretzel-indices-repeated = L'indici specificati per pretzel sò ignorati perchè alcuni si ripetenu.

pretzel-circuit-first-index = L'indici specificati per pretzel in mode="circuit" sò ignorati perchè u primu indice deve esse 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Perchè `<{ $component }>` funzioni cù figlioli di testu, deve esse specificatu un attributu `type`.

invalid-type-defaulting-to-math = type { $type } invalidu per u cumpunente { $component }. Deve esse math, text, number o boolean. Si mette à math.

string-not-valid-component-to-arrange = U testu "{ $value }" ùn hè un cumpunente validu per { $component }. Hè ignoratu.

## Types and variables

invalid-type-defaulting-to-number = type { $type } invalidu, type si mette à number.

invalid-variable-value = Valore invalidu d'una variabile: `{ $value }`

## Variants

variant-index-must-be-number = L'indice di variante { $index } deve esse un numeru

variant-index-must-be-integer = L'indice di variante { $index } deve esse un interu

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ùn hè implementatu per misure assolute. E larghezze si mettenu in relativu.

side-by-side-absolute-margins = `<{ $component }>` ùn hè implementatu per misure assolute. I margini si mettenu in relativu.

side-by-side-no-block-child = `<{ $component }>` invalidu: deve avè almenu un figliolu di bloccu.

## `<label>`

label-for-ignored-on-graphical = L'attributu `for` nantu à un `<label>` graficu hè ignoratu.

label-for-must-resolve-to-one = L'attributu `for` nantu à `<label>` deve risolve à un solu cumpunente.

label-for-unresolved = L'attributu `for` nantu à `<label>` ùn s'hè pussutu risolve à un cumpunente.

label-for-answer-with-authored-inputs = L'attributu `for` nantu à `<label>` si riferisce à un `<answer>` cù campi d'entrata scritti apposta; riferisciti à u campu direttamente.

label-for-answer-without-input = L'attributu `for` nantu à `<label>` si riferisce à un `<answer>` senza campu d'entrata da etichettà.

label-for-must-reference-input-or-answer = L'attributu `for` nantu à `<label>` si deve riferì à un campu d'entrata o à un answer.

## Accessibility

accessibility-short-description-or-decorative = Per l'accessibilità, `<{ $component }>` deve avè una descrizione corta o esse specificatu cum'è decorativu.

accessibility-video-short-description = Per l'accessibilità, `<video>` deve avè una descrizione corta.

accessibility-input-short-description-or-label = Per l'accessibilità, `<{ $component }>` deve avè una descrizione corta o una etichetta.

accessibility-answer-input-short-description-or-label = Per l'accessibilità, un `<answer>` chì crea un campu d'entrata deve avè una descrizione corta o una etichetta.

accessibility-short-description-contains-math = E descrizioni corte ùn devenu cuntene cumpunenti matematichi cum'è `<{ $component }>`. Scrivi a matematica cù parolle.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ùn hà cuntrastu bastante per u testu di u titulu di sezione (modu scuru) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ci vole almenu { $threshold }:1).
       *[other] { $colorName } ùn hà cuntrastu bastante per u testu di u titulu di sezione ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ci vole almenu { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` chì passa per { $count } punti ùn hè implementatu quandu i punti ùn anu valori numerichi.

circle-too-many-through-points = Ùn si pò calculà un cerchju chì passi per più di 3 punti.

circle-overprescribed-radius-center-points = Ùn si pò calculà un cerchju cù raghju, centru è punti specificati.

circle-center-with-multiple-points = Ùn si pò calculà un cerchju cù centru specificatu chì passi per più d'1 puntu.

circle-radius-too-small = Ùn si pò calculà u cerchju: postu chì a distanza trà i dui punti hè { $distance }, u raghju specificatu { $radius } hè troppu chjucu.

circle-radius-with-many-points = Ùn si pò creà un cerchju chì passi per più di dui punti cù un raghju specificatu.

circle-invalid-center-or-through-points = Centru o punti di passaghju di u cerchju invalidi.

circle-radius-center-with-multiple-points = Ùn si pò calculà u raghju d'un cerchju cù centru specificatu chì passi per più d'1 puntu.

circle-change-radius-non-numerical = Ùn si pò cambià u raghju d'un cerchju cù punti micca numerichi

circle-radius-with-points-non-numerical = Ùn si pò creà un cerchju chì passi per più d'un puntu cù un raghju specificatu quandu i valori ùn sò numerichi.

circle-change-center-non-numerical = U cambiamentu di u centru d'un cerchju chì passa per punti cù valori micca numerichi ùn hè implementatu.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Dimensioni insufficienti per u duminiu di a funzione. U duminiu hà { $intervals } intervallu ma a funzione hà { $inputs ->
            [one] { $inputs } entrata
           *[other] { $inputs } entrate
        }.
       *[other] Dimensioni insufficienti per u duminiu di a funzione. U duminiu hà { $intervals } intervalli ma a funzione hà { $inputs ->
            [one] { $inputs } entrata
           *[other] { $inputs } entrate
        }.
    }

function-domain-invalid-format = Furmatu invalidu per u duminiu di a funzione.

function-ignoring-non-numerical =
    { $type ->
        [maximum] U massimu micca numericu di a funzione hè ignoratu.
        [minimum] U minimu micca numericu di a funzione hè ignoratu.
        [extremum] L'estremu micca numericu di a funzione hè ignoratu.
        [point] U puntu micca numericu di a funzione hè ignoratu.
        [slope] A pendenza micca numerica di a funzione hè ignorata.
       *[other] U { $type } micca numericu di a funzione hè ignoratu.
    }

function-ignoring-empty =
    { $type ->
        [maximum] U massimu viotu di a funzione hè ignoratu.
        [minimum] U minimu viotu di a funzione hè ignoratu.
        [extremum] L'estremu viotu di a funzione hè ignoratu.
        [point] U puntu viotu di a funzione hè ignoratu.
       *[other] U { $type } viotu di a funzione hè ignoratu.
    }

function-points-too-close = A funzione cuntene dui punti troppu vicini l'unu à l'altru. Ùn si pò definisce a funzione.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] L'iterazioni d'una funzione sò pussibule solu se u numeru d'entrate hè uguale à quellu d'uscite. Sta funzione hà { $inputs } entrata è { $outputs ->
            [one] { $outputs } uscita
           *[other] { $outputs } uscite
        }.
       *[other] L'iterazioni d'una funzione sò pussibule solu se u numeru d'entrate hè uguale à quellu d'uscite. Sta funzione hà { $inputs } entrate è { $outputs ->
            [one] { $outputs } uscita
           *[other] { $outputs } uscite
        }.
    }

## `<sequence>`

sequence-invalid-length = Lunghezza invalida di a sequenza. Deve esse un interu micca negativu.

sequence-invalid-step = Passu invalidu di a sequenza. Deve esse un numeru per una sequenza di tipu { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" invalidu d'una sequenza di numeri. Deve esse un numeru.

sequence-invalid-endpoint-letters = "{ $attribute }" invalidu d'una sequenza di lettere. Deve esse una cumbinazione di lettere.

sequence-invalid-endpoint = "{ $attribute }" invalidu di a sequenza.

select-from-sequence-coprime-not-numbers = coprime hè ignoratu perchè ùn si sceglienu numeri

select-from-sequence-coprime-with-exclude-combinations = coprime hè ignoratu perchè excludeCombinations hè specificatu

## Resolving a `target`

target-not-found = target invalidu per `<{ $source }>`: ùn si trova l'ubbiettivu.

target-state-variable-not-found = target invalidu per `<{ $source }>`: ùn si trova nisuna variabile di statu chjamata "{ $property }" nantu à un `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = E variabili di `<odeSystem>` devenu esse diverse da a variabile indipendente.

ode-system-duplicate-variable-names = Ùn si ponu definisce e funzioni di u membru drittu di l'EDO cù nomi di variabili dipendenti ripetuti.

ode-system-rhs-function-error = Ùn si pò definisce a funzione di u membru drittu di l'EDO. Errore creendu a funzione mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ùn si pò definisce un angulu trà { $count } rette

angle-invalid-through-point = Puntu invalidu in u through di `<angle>`

parabola-vertex-too-many-points = Una parabula cù verticu chì passi per più d'1 puntu ùn hè implementata.

parabola-too-many-points = Una parabula chì passi per più di 3 punti ùn hè implementata.

intersection-too-many-items = L'intersezione di più di dui oggetti ùn hè implementata

## Other math components

ionic-compound-not-two-ions = Un cumpostu ionicu ùn hè implementatu per altru chè per dui ioni.

ionic-compound-needs-cation-and-anion = Un cumpostu ionicu hè implementatu solu per un cationu è un anionu.

solve-equations-cannot-evaluate = Ùn si pò risolve l'equazione perchè ùn s'hè pussuta valutà: { $equation }

math-operators-operand-number-required = Deve esse specificatu un operandNumber quandu si estrae un operandu maticu.

eigen-decomposition-failed = Ùn s'hè pussutu calculà l'autovalori di a matrice

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: u parametru { $parameters } ùn compare in u mudellu, cusì currisponderà sempre à un viotu.
       *[other] `<matchesPattern>`: i parametri { $parameters } ùn comparenu in u mudellu, cusì currisponderanu sempre à un viotu.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ùn si pò interpretà grid="{ $grid }". Deve esse none, medium, dense o dui numeri pusitivi separati da un spaziu, per esempiu grid="1 0.5". Ùn si disegna nisuna griglia.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ùn hè supportatu in u mutore prefigure; s'adopra u cumpurtamentu di a pusizione dritta.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ùn hè supportatu in u mutore prefigure; s'adopra u cumpurtamentu di a pusizione alta.

prefigure-invalid-axis-bounds = `<graph>`: limiti d'assi invalidi per a cunversione in prefigure; s'adopra a bbox predefinita (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: larghezza invalida per a cunversione in prefigure; s'adopra a larghezza predefinita 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio invalidu per a cunversione in prefigure; s'adopra a pruporzione predefinita 1.

prefigure-grid-spacing-too-fine = `<graph>`: u spaziu di a griglia hè troppu strettu per i limiti di l'assi; a griglia hè omessa in u mutore prefigure.

prefigure-annotations-not-rendered = `<graph>`: l'annotazioni ùn saranu mustrate quandu ùn s'adopra u mutore PreFigure.

multiple-annotations-children = Sò stati trovi parechji figlioli `<annotations>` in `<graph>`; tutti fora di l'ultimu sò ignorati.

## Referring to other components

copy-unrecognized-component-type = Ùn si pò estende o cupià un tipu di cumpunente scunnisciutu: { $type }.

copy-prop-not-found = Ùn s'hè trova a pruprietà { $property } nantu à un cumpunente di tipu { $component }

collect-no-source = Ùn s'hè trova nisuna surgente per collect.

collect-invalid-component-type = Ùn si ponu racoglie cumpunenti di tipu `<{ $component }>` perchè hè un tipu di cumpunente invalidu.

reference-index-unavailable = Ùn si pò fà riferenza à l'indice `{ $reference }`

## `<callAction>`

component-action-unavailable = Ùn si pò chjamà { $action } nantu à u cumpunente `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = I dati anu una forma invalida. E file anu lunghezze diverse. Trovu in componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = I dati anu nomi di culonna ripetuti. Trovu in componentIdx :{ $componentIdx }

data-frame-missing-column-name = À i dati manca un nome di culonna. Trovu in componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Un award di sta risposta si basa nantu à a risposta mandata da l'etichetta answer stessa, chì porterà à un cumpurtamentu inaspettatu.

answer-max-num-attempts-in-section-wide-check-work = Mette `maxNumAttempts` nantu à un `<answer>` dentru un cuntenitore cù `sectionWideCheckWork` ùn hà effettu, perchè u numeru di prove hè cuntrullatu da u cuntenitore. Metti `maxNumAttempts` nantu à u cuntenitore.

nested-section-wide-check-work-max-num-attempts = Mette `maxNumAttempts` nantu à un cuntenitore cù `sectionWideCheckWork` chì hè dentru un altru cuntenitore cù `sectionWideCheckWork` ùn hà effettu, perchè u numeru di prove hè cuntrullatu da u cuntenitore esternu. Metti `maxNumAttempts` nantu à u cuntenitore esternu.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] L'attributu { $attributes } ùn averà effettu senza symbolicEquality.
       *[other] L'attributi { $attributes } ùn averanu effettu senza symbolicEquality.
    }

answer-invalid-type = Tipu invalidu per a risposta: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Postu chì u cumpunente `<{ $component }>` ùn hà nome, ùn si pò aduprà cum'è attributu d'un modulu

module-attribute-name-already-defined = U cumpunente `<{ $component } name="{ $name }">` ùn si pò aduprà cum'è attributu d'un modulu perchè u tipu di cumpunente `<module>` hà digià un attributu "{ $name }".

conditional-content-condition-ignored = L'attributu `condition` hè ignoratu nantu à un cumpunente `<conditionalContent>` cù figlioli case o else.

slider-markers-type-mismatch = U tipu di i marcatori ùn currisponde à u tipu di u cursore.

pretzel-problem-needs-statement-and-answer = pretzel invalidu: ogni `<problem>` deve cuntene un `<statement>` è un `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel invalidu: in mode="circuit", u primu `<problem>` ùn pò esse un distrattore.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Valore invalidu { $values } per l'attributu `{ $attribute }`; hè ignoratu.
       *[other] Valori invalidi { $values } per l'attributu `{ $attribute }`; sò ignorati.
    }

attribute-must-be-references = Valore invalidu `{ $value }` per l'attributu `{ $attribute }`. L'attributu deve esse fattu di riferenze chì cumincianu cù un `$`.

math-input-invalid-function-names = <mathInput>: nomi di funzione invalidi ignorati in { $attribute }: { $names }. A parte mustrata d'ogni nome deve esse d'almenu 2 caratteri (lettere o trattini); pò seguità un suffissu upzionale `|<mathspeak alternativa>`.

## Building components from the source

component-type-invalid = Tipu di cumpunente invalidu: `<{ $componentType }>`

attribute-repeated = Ùn si pò ripete l'attributu { $attribute }.

attribute-invalid-for-component = Attributu "{ $attribute }" invalidu per un cumpunente di tipu `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    A definizione di stile { $styleNumber } ùn hà cuntrastu bastante per { $context ->
        [text-on-background] u culore di u testu contru u culore di fondu
        [high-contrast] u culore d'altu cuntrastu contru a tela
        [line] u culore di a linea contru a tela
        [marker] u culore di u marcatore contru a tela
       *[text-on-canvas] u culore di u testu contru a tela
    }{ $mode ->
        [dark] { " (modu scuru)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ci vole almenu { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Ancu se a definizione di stile { $styleNumber } specifica culori cù cuntrastu bastante per u modu chjaru, i culori di u modu scuru derivati da sti valori ùn anu cuntrastu bastante trà u culore di u testu è u culore di fondu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ci vole almenu { $threshold }:1). { $suggestion ->
        [available] Per assicurà cuntrastu bastante in u modu scuru, aumenta u cuntrastu di u modu chjaru (per esempiu { $lightAttribute }="{ $lightColor }") o rimpiazza u culore di u modu scuru (per esempiu { $darkAttribute }="{ $darkColor }").
       *[none] Per assicurà cuntrastu bastante in u modu scuru, aumenta u cuntrastu di u modu chjaru o rimpiazza i culori derivati cù textColorDarkMode è/o backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ancu se a definizione di stile { $styleNumber } specifica un culore di testu cù cuntrastu bastante per u modu chjaru, u culore di testu di u modu scuru derivatu da stu valore ùn hà cuntrastu bastante contru a tela ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ci vole almenu { $threshold }:1). { $suggestion ->
        [available] Per assicurà cuntrastu bastante in u modu scuru, aumenta u cuntrastu di u modu chjaru (per esempiu textColor="{ $lightColor }") o rimpiazza u culore di u modu scuru (per esempiu textColorDarkMode="{ $darkColor }").
       *[none] Per assicurà cuntrastu bastante in u modu scuru, aumenta u cuntrastu di u modu chjaru o rimpiazza u culore derivatu cù textColorDarkMode.
    }

section-multiple-style-palettes = Una sezione pò sceglie una sola <stylePalette>; s'adopra l'ultima.

## Unique variants

variant-num-to-select-not-non-negative-integer = ùn si ponu determinà e varianti uniche di { $component } perchè numToSelect ùn hè un interu micca negativu.

variant-num-to-select-not-constant-number = ùn si ponu determinà e varianti uniche di { $component } perchè numToSelect ùn hè un numeru custante.

variant-with-replacement-not-constant-boolean = ùn si ponu determinà e varianti uniche di { $component } perchè withReplacement ùn hè un boolean custante.

variant-select-weight-disables-unique = E varianti uniche per select sò disattivate se una opzione hà selectWeight o selectForVariants specificatu

variant-coprime-undetermined = ùn si ponu determinà e varianti uniche di { $component } perchè ùn si pò determinà chì coprime sia sempre falsu.

variant-attribute-not-constant = ùn si ponu determinà e varianti uniche di { $component } perchè { $attribute } ùn hè una custante.

variant-attribute-not-number = ùn si ponu determinà e varianti uniche di { $component } perchè { $attribute } ùn hè un numeru.

variant-attribute-wrong-type-for-sequence =
    ùn si ponu determinà e varianti uniche di { $component } di tipu { $type } perchè { $attribute } ùn hè { $expected ->
        [letters-combination] una cumbinazione di lettere
        [math-expression] una espressione matematica valida
        [integer] un interu
       *[number] un numeru
    }.

variant-length-not-integer = ùn si ponu determinà e varianti uniche di { $component } perchè length ùn hè un interu.

variant-sort-not-implemented = e varianti uniche d'un { $component } cù sort ùn sò implementate

variant-exclude-combinations-not-implemented = e varianti uniche d'un { $component } cù excludeCombinations ùn sò implementate

variant-math-exclude-not-implemented = e varianti uniche d'un { $component } di tipu math cù exclude ùn sò implementate

variant-non-constant-exclude-not-implemented = e varianti uniche d'un { $component } cù un exclude micca custante ùn sò implementate

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ùn hè supportatu in u mutore prefigure di u graficu; u discendente hè saltatu.

prefigure-descendant-invalid-geometry = { $subject }: giumitria micca finita o incumpleta; u discendente hè saltatu.

prefigure-curve-label-omitted = { $subject }: l'etichette ùn sò supportate nantu à l'elementi di curva cunvertiti; l'etichetta hè omessa.

prefigure-curve-unsupported-definition-type = { $subject }: tipu di definizione di funzione di curva micca supportatu '{ $definitionType }'; u discendente hè saltatu.

prefigure-region-flip-functions-unsupported = { $subject }: attributu flipFunctions micca supportatu nantu à regionBetweenCurves; u discendente hè saltatu.

prefigure-region-non-formula-child = { $subject }: nantu à regionBetweenCurves sò supportate solu e funzioni figliole definite da una formula; u discendente hè saltatu.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' micca supportatu per { $labelKind ->
        [line-family] una etichetta di a famiglia di e linee
       *[point] una etichetta di puntu
    }; s'adopra l'allineamentu PreFigure predefinitu.

prefigure-fill-style-unsupported = { $subject }: u stile di riempimentu '{ $fillStyle }' ùn hè supportatu da PreFigure; si torna à un riempimentu pienu.

prefigure-line-style-unknown = { $subject }: stile di linea scunnisciutu '{ $lineStyle }' omessu da l'uscita PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: u stile di marcatore '{ $markerStyle }' hè statu cunvertitu in u stile PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: u stile di marcatore '{ $markerStyle }' ùn hè supportatu da PreFigure; s'adopra u stile predefinitu.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` invalidu; ùn si pò risolve l'ubbiettivu. L'annotazione hè omessa.

annotation-ref-multiple-targets = `<annotation>`: `ref` s'hè risoltu à parechji ubbiettivi; s'adopra u primu.

annotation-ref-outside-graph = `<annotation>`: `ref` invalidu; l'ubbiettivu hè fora di u graficu chì u cuntene. L'annotazione hè omessa.

annotation-ref-unsupported-target = `<annotation>`: `ref` invalidu; l'ubbiettivu ùn hè un oggettu graficu supportatu in a cunversione prefigure. L'annotazione hè omessa.

annotation-text-missing = `<annotation>`: `text` manca o hè viotu; si produce un testu viotu.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Hè stata trova una dipendenza circulare.
       *[other] Hè stata trova una dipendenza circulare chì implica un cumpunente `<{ $componentType }>`.
    }

reference-no-referent = Ùn hè statu trovu nisunu riferente per a riferenza: `{ $reference }`

reference-multiple-referents = Sò stati trovi parechji riferenti per a riferenza: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Furmatu invalidu per l'attributu { $attribute } di `<{ $componentType }>`.

children-invalid = Figlioli invalidi per `<{ $componentType }>`: sò stati trovi figlioli invalidi: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valore invalidu `{ $value }` per l'attributu `{ $attribute }`, s'adopra u valore `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] A versione { $version } di DoenetML ùn hè stata trova.
       *[other] A versione { $version } di DoenetML ùn hè stata trova. Si torna à a versione { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML invalidu: { $content }

parse-tag-missing-close-tag = DoenetML invalidu: l'etichetta `{ $tag }` ùn hà etichetta di chjusura. S'aspettava una etichetta chì si chjude da per ella o una etichetta `</{ $tagName }>`.

parse-tag-error = DoenetML invalidu: errore in l'etichetta `<{ $tagName }>`

parse-attribute-missing-value = DoenetML invalidu: pare chì à l'attributu invalidu `{ $attribute }` li manchi un valore.

parse-attribute-invalid = DoenetML invalidu: attributu invalidu `{ $attribute }`

parse-attribute-value-invalid = DoenetML invalidu: valore d'attributu invalidu `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML invalidu: valore d'attributu invalidu `{ $value }`. E virgulette ùn currispondenu. Pare chì manchi una `{ $quote }`

parse-open-tag-name-missing = DoenetML invalidu: hè stata trova una etichetta senza nome, per esempiu `<`

parse-tag-not-closed = DoenetML invalidu: l'etichetta `{ $tag }` ùn hè stata chjusa (pare chì manchi un `>`).

parse-self-closing-tag-name-missing = DoenetML invalidu: hè stata trova una etichetta senza nome `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML invalidu: l'etichetta `{ $tag }` ùn hè stata chjusa (pare chì manchi `/>`).

parse-tag-invalid-attributes = DoenetML invalidu: l'etichetta `{ $tag }` ùn hè valida. Pò avè attributi sbagliati.

parse-close-tag-name-missing = DoenetML invalidu: hè stata trova una etichetta di chjusura senza nome, per esempiu `</`

parse-attribute-value-unquoted = I valori d'attributu devenu esse trà virgulette: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML invalidu: hè stata trova l'etichetta di chjusura `{ $tag }`, ma nisuna etichetta d'apertura currispundente

parse-close-tag-mismatched = DoenetML invalidu: etichetta di chjusura chì ùn currisponde. S'aspettava `</{ $expected }>`. Hè stata trova `{ $found }`

parser-node-unconvertible = Ùn s'hè pussutu cunvertisce u node { $node } in un node Dast.

## Names

name-attribute-invalid =
    Attributu name='{ $name }' invalidu. { $reason ->
        [characters] I nomi ponu cuntene solu lettere, numeri, trattini bassi o trattini.
       *[start] I nomi devenu cumincià cù una lettera.
    }

component-name-invalid-start = Nome di cumpunente "{ $name }" invalidu. I nomi devenu cumincià cù una lettera.

## `<answer>` sugar

answer-video-watched-missing-video = Un answer di tipu videoWatched deve avè un attributu video

answer-video-watched-video-not-reference = Un answer di tipu videoWatched deve avè un attributu video chì sia una riferenza

answer-name-not-single-text = L'attributu name d'un answer deve avè un solu figliolu di testu

## Referencing another document

external-doenetml-recursion-limit = Ùn si pò ricuperà u DoenetML esternu perchè ci sò troppu livelli di ricursione. Ci sarebbe una riferenza circulare?

external-doenetml-unavailable = Ùn si pò ricuperà DoenetML da { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML invalidu ricuperatu da { $attribute }="{ $uri }": ùn currispundia à u tipu di cumpunente "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] L'attributu `{ $from }` hè ubsulettu; adopra `{ $to }` invece.
       *[other] [deprecation] L'attributu `{ $from }` nantu à `<{ $component }>` hè ubsulettu; adopra `{ $to }` invece.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] L'attributu `{ $from }` hè ubsulettu è hè ignoratu perchè hè specificatu ancu `{ $to }`.
       *[other] [deprecation] L'attributu `{ $from }` nantu à `<{ $component }>` hè ubsulettu è hè ignoratu perchè hè specificatu ancu `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] L'attributu `{ $attribute }` nantu à `<{ $component }>` hè ubsulettu è hè ignoratu.

deprecated-attribute-to-child = [deprecation] L'attributu `{ $attribute }` nantu à `<{ $component }>` hè ubsulettu; adopra un figliolu `<{ $child }>` invece.

deprecated-attribute-value-renamed = [deprecation] U valore `{ $value }` di l'attributu `{ $attribute }` nantu à `<{ $component }>` hè ubsulettu; adopra `{ $to }` invece.


## Language coverage

pluralize-english-only = `<pluralize>` pò mette à u plurale solu l'inglese, cusì u so testu resta tale è quale in un documentu scrittu in { $locale }. Scrivi a forma plurale direttamente, o specificala cù l'attributu `pluralForm`.


## Checking against the schema

schema-element-unrecognized = L'elementu `<{ $tag }>` ùn hè un elementu Doenet ricunnisciutu.

schema-element-not-allowed-at-root = L'elementu `<{ $tag }>` ùn hè permessu à a radica di u documentu.

schema-element-not-allowed-inside = L'elementu `<{ $tag }>` ùn hè permessu dentru `<{ $parent }>`.

schema-attribute-unrecognized = L'elementu `<{ $tag }>` ùn hà nisunu attributu chjamatu `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] L'attributu `{ $attribute }` di l'elementu `<{ $tag }>` deve esse una lista induve ogni elementu hè unu di questi: { $allowed }
       *[other] L'attributu `{ $attribute }` di l'elementu `<{ $tag }>` deve esse unu di questi: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nome di variante invalidu per select. U nome di variante { $variantName } compare in { $numOptions } opzioni ma u numeru da sceglie hè { $numToSelect }.

select-variant-name-without-options = Sò specificate alcune varianti per select ma nisuna opzione per u nome di variante pussibule: { $variantName }.

select-variant-name-not-possible = U nome di variante { $variantName } specificatu per select ùn hè un nome di variante pussibule.

select-too-few-options = Ùn si ponu sceglie { $numToSelect } cumpunenti da solu { $numOptions }.

select-from-sequence-too-few-values = Ùn si ponu sceglie { $numToSelect } valori da una sequenza di lunghezza { $length }.

select-from-sequence-indices-count-mismatch = U numeru d'indici specificati per select deve currisponde à u numeru da sceglie

select-from-sequence-indices-not-integers = Tutti l'indici specificati per select devenu esse interi

select-from-sequence-index-excluded = Un indice specificatu di selectfromsequence era esclusu

select-from-sequence-indices-excluded-combination = L'indici specificati di selectfromsequence eranu una cumbinazione esclusa

select-from-sequence-coprime-not-positive-integers = Ùn si ponu sceglie cumbinazioni coprime perchè ùn si sceglienu interi pusitivi.

select-from-sequence-coprime-common-factor = Ùn si ponu sceglie numeri coprimi. Tutti i valori pussibuli anu un fattore cumunu. (I valori specificati di "from" o "to" devenu esse coprimi cù "step".)

select-from-sequence-coprime-single-number = Ùn si ponu sceglie cumbinazioni coprime da un solu numeru chì ùn hè 1.

select-from-sequence-excluded-too-many-combinations = Più di u 70% di e cumbinazioni hè statu esclusu in selectFromSequence

select-from-sequence-coprime-none-found = Ùn s'hè pussutu sceglie numeri coprimi. Tutti i valori pussibuli anu un fattore cumunu.

select-from-sequence-too-few-unique-values = Ùn si ponu sceglie { $numToSelect } valori unichi da una sequenza di lunghezza { $numPossibleValues }

select-prime-numbers-too-few-values = Ùn si ponu sceglie { $numToSelect } valori da una lista di numeri primi di lunghezza { $numValues }

select-prime-numbers-values-count-mismatch = U numeru di valori specificati per select deve currisponde à u numeru da sceglie

select-prime-numbers-values-not-prime = Tutti i valori specificati per sceglie numeri primi devenu esse in a lista di i numeri primi

select-prime-numbers-values-excluded-combination = I valori specificati di selectPrimeNumbers eranu una cumbinazione esclusa

select-prime-numbers-excluded-too-many-combinations = Più di u 70% di e cumbinazioni hè statu esclusu in selectPrimeNumbers

select-random-combination-fluke = Per un casu estremamente improbabile, ùn s'hè pussutu sceglie nisuna cumbinazione di valori casuali

select-random-value-fluke = Per un casu estremamente improbabile, ùn s'hè pussutu sceglie nisunu valore casuale
