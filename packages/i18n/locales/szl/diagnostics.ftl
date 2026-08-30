# Silesian (ślōnskŏ gŏdka) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The ślabikŏrzowy szrajbōnek; see `chrome.ftl`, which also
# carries the note on why this file is not `locales/pl` and what to look at to
# tell the two apart.
#
# **The quickest check** is the negation and the modal: «niy», «niy idzie»,
# «niy ma», «musi», «bo», «coby». A sentence here with «nie», «nie można» or
# «żeby» in it has slipped into Polish.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber` — are part of the language, not prose,
# and stay in English exactly as written. So does anything quoted back from the
# author's own source, and so do `WCAG AA`, `DoenetML`, `PreFigure` and
# `prefigure`, which are names.
#
# **Number.** CLDR has no plural rules for `szl`, so no `zero`, `two`, `few` or
# `many` branch appears anywhere. Every **symbolic** selector — `$type`,
# `$mode`, `$reason`, `$context`, `$suggestion`, `$alternative`, `$fallback`,
# `$expected`, `$labelKind`, `$isList`, `$componentType` — is kept byte for
# byte from English, keys included.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } je pōminiynty, jak sōm podane dwa kōńce
       *[other] { $attributes } sōm pōminiynte, jak sōm podane dwa kōńce
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } je pōminiynty, jak sōm podane kōniec a strzodek
       *[other] { $attributes } sōm pōminiynte, jak sōm podane kōniec a strzodek
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset nic niy robi bez strzodka

## `<line>`

line-points-undetermined-dimensions = Prostŏ bez pōnkty ô niyustalōnym wymiarze.

line-points-too-few-dimensions = Prostŏ musi iść bez pōnkty ô nojmyni dwōch wymiarach.

line-points-depend-on-variables = Prostŏ idzie bez pōnkty, co zŏleżōm ôd zmiynnych: { $variables }.

line-equation-invalid-format = Format rōwnaniŏ prostyj we zmiynnych { $variable1 } a { $variable2 } niy je dobry.

## `<ray>`

ray-overprescribed-through = Pōłprostŏ je ôkryślōnŏ bez through, endpoint a direction.  Podane through je pōminiynte.

ray-dimension-mismatch = numDimensions sie niy zgŏdzŏ we pōłprostyj.

## `<vector>`

vector-overprescribed-head = Wektōr je ôkryślōny bez head, tail a displacement.  Podane head je pōminiynte.

vector-dimension-mismatch = numDimensions sie niy zgŏdzŏ we wektorze.

## Attracting and constraining

attract-to-without-nearest-point = Niy idzie ciōngnōnć do `<{ $component }>`, bo niy mŏ zmiynnyj stanu nearestPoint.

constrain-to-without-nearest-point = Niy idzie przipiōnć do `<{ $component }>`, bo niy mŏ zmiynnyj stanu nearestPoint.

constrain-to-interior-without-nearest-point = Niy idzie przipiōnć do postrzodka `<{ $component }>`, bo niy mŏ zmiynnyj stanu nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition je pōminiynty do choiceInput, co niy je inline

## Ordering children by index

choice-input-indices-count-mismatch = Pōmijōm indeksy podane do choiceInput, bo liczba indeksōw sie niy zgŏdzŏ z liczbōm dzieci choice.

pretzel-indices-count-mismatch = Pōmijōm indeksy podane do problem, bo liczba indeksōw sie niy zgŏdzŏ z liczbōm dzieci problem.

shuffle-indices-count-mismatch = Pōmijōm indeksy podane do shuffle, bo liczba indeksōw sie niy zgŏdzŏ z liczbōm kōmpōnyntōw.

indices-ignored-out-of-range = Pōmijōm indeksy podane do { $component }, bo niykere indeksy sōm poza zakresym.

pretzel-indices-repeated = Pōmijōm indeksy podane do pretzel, bo niykere indeksy sie powtŏrzajōm.

pretzel-circuit-first-index = Pōmijōm indeksy podane do pretzel we trybie circuit, bo piyrszy indeks musi być 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Coby `<{ $component }>` szoł ze dziećmi tekstowymi, musi być podany atrybut `type`.

invalid-type-defaulting-to-math = Zorta { $type } niy je dobrŏ do kōmpōnyntu { $component }. Musi być jedna z math, text, number abo boolean. Bierã math.

string-not-valid-component-to-arrange = Tekst "{ $value }" niy je dobrym kōmpōnyntym do { $component }. Pōmijōm go.

## Types and variables

invalid-type-defaulting-to-number = Zorta { $type } niy je dobrŏ, sztelujã zorta na number.

invalid-variable-value = Werta zmiynnyj niy je dobrŏ: `{ $value }`

## Variants

variant-index-must-be-number = Indeks wariantu { $index } musi być liczbōm

variant-index-must-be-integer = Indeks wariantu { $index } musi być cołkōm liczbōm

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` niy je zrobiōny do absolutnych miar. Sztelujã szyrokŏści na wzglyndne.

side-by-side-absolute-margins = `<{ $component }>` niy je zrobiōny do absolutnych miar. Sztelujã marginesy na wzglyndne.

side-by-side-no-block-child = `<{ $component }>` niy je dobry: musi mieć nojmyni jedne blokowe dziecko.

## `<label>`

label-for-ignored-on-graphical = Atrybut `for` na graficznyj `<label>` je pōminiynty.

label-for-must-resolve-to-one = Atrybut `for` na `<label>` musi wskazować akurat na jedyn kōmpōnynt.

label-for-unresolved = Atrybutu `for` na `<label>` niy szło rozwiōnzać do kōmpōnyntu.

label-for-answer-with-authored-inputs = Atrybut `for` na `<label>` wskazuje na `<answer>` z wypisanymi wpisami; wskŏż lepij prosto na wpis.

label-for-answer-without-input = Atrybut `for` na `<label>` wskazuje na `<answer>` bez wpisu do ôznaczyniŏ.

label-for-must-reference-input-or-answer = Atrybut `for` na `<label>` musi wskazować na wpis abo na ôdpowiydź.

## Accessibility

accessibility-short-description-or-decorative = Do przistympnŏści `<{ $component }>` musi mieć krōtki ôpis abo być ôznaczōny jak ôzdobny.

accessibility-video-short-description = Do przistympnŏści `<video>` musi mieć krōtki ôpis.

accessibility-input-short-description-or-label = Do przistympnŏści `<{ $component }>` musi mieć krōtki ôpis abo etyketa.

accessibility-answer-input-short-description-or-label = Do przistympnŏści `<answer>`, co robi wpis, musi mieć krōtki ôpis abo etyketa.

accessibility-short-description-contains-math = Krōtkie ôpisy niy majōm mieć w siebie matymatycznych kōmpōnyntōw choby `<{ $component }>`. Napisz matymatyka słowami.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } mŏ za mały kōntrast do tekstu nadpisu ôddziołu (ciymny tryb) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; trza nojmyni { $threshold }:1).
       *[other] { $colorName } mŏ za mały kōntrast do tekstu nadpisu ôddziołu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; trza nojmyni { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` bez { $count } pōnktōw niy je zrobiōny do przipadku, kaj pōnkty niy majōm liczbowych wertōw.

circle-too-many-through-points = Niy idzie porachować kōłka bez wiyncyj jak 3 pōnkty.

circle-overprescribed-radius-center-points = Niy idzie porachować kōłka z podanym prōmiyniym, strzodkym a pōnktami.

circle-center-with-multiple-points = Niy idzie porachować kōłka z podanym strzodkym bez wiyncyj jak 1 pōnkt.

circle-radius-too-small = Niy idzie porachować kōłka: skoro ôdstymp miyndzy dwōma pōnktami je { $distance }, podany prōmiyń { $radius } je za mały.

circle-radius-with-many-points = Niy idzie zrobić kōłka bez wiyncyj jak dwa pōnkty z podanym prōmiyniym.

circle-invalid-center-or-through-points = Strzodek abo pōnkty kōłka niy sōm dobre.

circle-radius-center-with-multiple-points = Niy idzie porachować prōmiyniŏ kōłka z podanym strzodkym bez wiyncyj jak 1 pōnkt.

circle-change-radius-non-numerical = Niy idzie zmiynić prōmiyniŏ kōłka z pōnktami, co niy sōm liczbowe

circle-radius-with-points-non-numerical = Niy idzie zrobić kōłka bez wiyncyj jak jedyn pōnkt z podanym prōmiyniym, jak niy ma liczbowych wertōw.

circle-change-center-non-numerical = Zmiana strzodka kōłka bez pōnkty bez liczbowych wertōw jeszcze niy je zrobiōnŏ.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Za mało wymiarōw do dziedziny funkcyje. Dziedzina mŏ { $intervals } przedział, ale funkcyjŏ mŏ { $inputs } wejść.
       *[other] Za mało wymiarōw do dziedziny funkcyje. Dziedzina mŏ { $intervals } przedziałōw, ale funkcyjŏ mŏ { $inputs } wejść.
    }

function-domain-invalid-format = Format dziedziny funkcyje niy je dobry.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Pōmijōm maksimum funkcyje, co niy je liczbowe.
        [minimum] Pōmijōm minimum funkcyje, co niy je liczbowe.
        [extremum] Pōmijōm ekstremum funkcyje, co niy je liczbowe.
        [point] Pōmijōm pōnkt funkcyje, co niy je liczbowy.
        [slope] Pōmijōm nachylynie funkcyje, co niy je liczbowe.
       *[other] Pōmijōm { $type } funkcyje, co niy je liczbowe.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Pōmijōm prōzne maksimum funkcyje.
        [minimum] Pōmijōm prōzne minimum funkcyje.
        [extremum] Pōmijōm prōzne ekstremum funkcyje.
        [point] Pōmijōm prōzny pōnkt funkcyje.
       *[other] Pōmijōm prōzne { $type } funkcyje.
    }

function-points-too-close = Funkcyjŏ mŏ dwa pōnkty za blisko siebie. Niy idzie ôkryślić funkcyje.

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] Iteracyje funkcyje sōm możebne ino, jak liczba wejść je rōwnŏ liczbie wyjść. Ta funkcyjŏ mŏ { $inputs } wejść a { $outputs } wyjść.
    }

## `<sequence>`

sequence-invalid-length = Dugŏść ciōngu niy je dobrŏ.  Musi być niyujymnŏ cołkŏ liczba.

sequence-invalid-step = Krok ciōngu niy je dobry.  Musi być liczbōm do ciōngu zorty { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" ciōngu liczb niy je dobre.  Musi być liczbōm.

sequence-invalid-endpoint-letters = "{ $attribute }" ciōngu buchsztabōw niy je dobre.  Musi być kōmbinacyjōm buchsztabōw.

sequence-invalid-endpoint = "{ $attribute }" ciōngu niy je dobre.

select-from-sequence-coprime-not-numbers = coprime je pōminiynte, bo niy wybiyrŏ sie liczb

select-from-sequence-coprime-with-exclude-combinations = coprime je pōminiynte, bo je podane excludeCombinations

## Resolving a `target`

target-not-found = target do `<{ $source }>` niy je dobry: niy idzie znojść cylu.

target-state-variable-not-found = target do `<{ $source }>` niy je dobry: niy idzie znojść zmiynnyj stanu ô mianie "{ $property }" na `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Zmiynne `<odeSystem>` muszōm być inksze jak zmiynnŏ niyzŏwisłŏ.

ode-system-duplicate-variable-names = Niy idzie ôkryślić prawych strōn ODE z powtōrzōnymi mianami zŏwisłych zmiynnych.

ode-system-rhs-function-error = Niy idzie ôkryślić prawyj strōny ODE.  Feler przi robiyniu funkcyje mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Niy idzie ôkryślić kōnta miyndzy { $count } prostymi

angle-invalid-through-point = Pōnkt we through ôd `<angle>` niy je dobry

parabola-vertex-too-many-points = Parabola z wiyrzchołkym bez wiyncyj jak 1 pōnkt jeszcze niy je zrobiōnŏ.

parabola-too-many-points = Parabola bez wiyncyj jak 3 pōnkty jeszcze niy je zrobiōnŏ.

intersection-too-many-items = Przeciyńcie wiyncyj jak dwōch elymyntōw jeszcze niy je zrobiōne

## Other math components

ionic-compound-not-two-ions = Jōnowy zwiōnzek z czymś inkszym jak dwa jōny jeszcze niy je zrobiōny.

ionic-compound-needs-cation-and-anion = Jōnowy zwiōnzek je zrobiōny ino do jednego katiōnu a jednego aniōnu.

solve-equations-cannot-evaluate = Niy idzie rozwiōnzać rōwnaniŏ, bo sie go niy dało porachować: { $equation }

math-operators-operand-number-required = Musisz podać operandNumber, jak wyciōngŏsz matymatyczny ôperand.

eigen-decomposition-failed = Niy szło porachować wertōw włŏsnych macierzy

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameter { $parameters } niy wystympuje we wzorze, tōż zawdy bydzie pasowoł do luki.
       *[other] `<matchesPattern>`: parametry { $parameters } niy wystympujōm we wzorze, tōż zawdy bydōm pasować do luki.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: niy idzie zrozumieć grid="{ $grid }". Musi być none, medium, dense abo dwie dodatnie liczby ôddzielōne spacyjōm, choby grid="1 0.5". Żŏdnŏ krata sie niy rysuje.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` potrzebuje funkcyje z { $expected ->
        [one] jednym wyjściym, nachylyniym y' we kożdym pōnkcie, choby `y - x`
       *[other] dwōma wyjściami, wektorym we kożdym pōnkcie, choby `(y, -x)`
    }, ale podanŏ funkcyjŏ mŏ { $found } wyjść. { $alternative ->
        [none] Nic sie niy rysuje.
       *[other] `<{ $alternative }>` je kōmpōnyntym do tyj funkcyje. Nic sie niy rysuje.
    }

field-function-attribute-ignored-with-child = Atrybut `function` je pōminiynty, bo funkcyjŏ je podanŏ tyż we postrzodku kōmpōnyntu; bierã ta ze postrzodka. Podej funkcyjŏ ino na jedyn ze dwōch sposobōw.

field-variables-ignored =
    `<{ $component }>`: atrybut `variables` miynuje zmiynne wyrażyniŏ napisanego prosto we postrzodku kōmpōnyntu. { $reason ->
        [function-child] Funkcyjŏ je tu podanŏ jak dziecko `<function>`, co samo miynuje swoje zmiynne, tōż `variables` je pōminiynte.
       *[no-expression] Tukej niy ma takigo wyrażyniŏ, tōż `variables` je pōminiynte.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" niy je ôbsugowane we rynderze prefigure; bierã zachowanie prawyj pozycyje.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" niy je ôbsugowane we rynderze prefigure; bierã zachowanie gōrnyj pozycyje.

prefigure-invalid-axis-bounds = `<graph>`: granice ôsi do kōnwersyje prefigure niy sōm dobre; bierã wychodny bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: szyrokŏść do kōnwersyje prefigure niy je dobrŏ; bierã wychodnŏ szyrokŏść diagramu 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio do kōnwersyje prefigure niy je dobre; bierã wychodny stosunek bokōw 1.

prefigure-grid-spacing-too-fine = `<graph>`: krata je za gynstŏ do granic ôsi; krata je pōminiyntŏ we rynderze prefigure.

prefigure-annotations-not-rendered = `<graph>`: adnotacyje sie niy rysujōm, jak sie niy używŏ ryndera PreFigure.

multiple-annotations-children = Znodziōno wiyncyj dzieci `<annotations>` we `<graph>`; wszyskie krōm ôstatnigo sōm pōminiynte.

## Referring to other components

copy-unrecognized-component-type = Niy idzie rozszyrzić ani skopiować niyznanyj zorty kōmpōnyntu: { $type }.

copy-prop-not-found = Niy szło znojść włŏsnŏści { $property } na kōmpōnyncie zorty { $component }

collect-no-source = Do collect niy znodziōno żŏdnego zdrzōdła.

collect-invalid-component-type = Niy idzie zbiyrać kōmpōnyntōw zorty `<{ $component }>`, bo to niy je dobrŏ zorta kōmpōnyntu.

reference-index-unavailable = Niy idzie sie ôdwołać do indeksu `{ $reference }`

## `<callAction>`

component-action-unavailable = Niy idzie zawołać { $action } na kōmpōnyncie `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Dane majōm niydobry kształt.  Wiersze majōm rōżne dugŏści. Znodziōne we componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Dane majōm powtōrzōne miana kolumn.  Znodziōne we componentIdx :{ $componentIdx }

data-frame-missing-column-name = Danym brakuje miana kolumny.  Znodziōne we componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Nagroda do tyj ôdpowiedzi ôpiyrŏ sie na ôdpowiedzi posłanyj bez sōm tag answer, a to przewiedzie do niyspodziywanego zachowaniŏ.

answer-max-num-attempts-in-section-wide-check-work = Sztelowanie `maxNumAttempts` na `<answer>` we postrzodku pojymnika z `sectionWideCheckWork` nic niy robi, bo liczba prōb je sterowanŏ bez pojymnik. Nasztaluj `maxNumAttempts` na pojymniku.

nested-section-wide-check-work-max-num-attempts = Sztelowanie `maxNumAttempts` na pojymniku z `sectionWideCheckWork`, co siedzi we postrzodku inkszego pojymnika z `sectionWideCheckWork`, nic niy robi, bo liczba prōb je sterowanŏ bez zewnyntrzny pojymnik. Nasztaluj `maxNumAttempts` na zewnyntrznym pojymniku.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Atrybut { $attributes } nic niy zrobi bez nasztalowanego symbolicEquality.
       *[other] Atrybuty { $attributes } nic niy zrobiōm bez nasztalowanego symbolicEquality.
    }

answer-invalid-type = Zorta ôdpowiedzi niy je dobrŏ: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Skoro kōmpōnynt `<{ $component }>` niy mŏ miana, niy idzie go użyć jak atrybutu moduła

module-attribute-name-already-defined = Kōmpōnyntu `<{ $component } name="{ $name }">` niy idzie użyć jak atrybutu moduła, bo zorta kōmpōnyntu `<module>` już mŏ ôkryślōny atrybut "{ $name }".

conditional-content-condition-ignored = Atrybut `condition` je pōminiynty na kōmpōnyncie `<conditionalContent>` ze dziećmi case abo else.

slider-markers-type-mismatch = Zorta markerōw sie niy zgŏdzŏ ze zortōm suwaka.

pretzel-problem-needs-statement-and-answer = pretzel niy je dobry: kożde `<problem>` musi mieć w siebie jedne `<statement>` a jedne `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel niy je dobry: we mode="circuit" piyrsze `<problem>` niy może być dystraktorym.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Werta { $values } do atrybutu `{ $attribute }` niy je dobrŏ; pōmijōm jōm.
       *[other] Werty { $values } do atrybutu `{ $attribute }` niy sōm dobre; pōmijōm je.
    }

attribute-must-be-references = Werta `{ $value }` do atrybutu `{ $attribute }` niy je dobrŏ. Atrybut musi być złożōny z ôdwołań, co sie zaczynajōm ôd `$`.

math-input-invalid-function-names = <mathInput>: pōminiynte niydobre miana funkcyji we { $attribute }: { $names }. Pokazowanŏ tajla kożdego miana musi mieć nojmyni 2 znaki (buchsztaby abo myślniki); po nij może przijść ôpcyjōnalny przirostek `|<mathspeak alternatywa>`.

## Building components from the source

component-type-invalid = Zorta kōmpōnyntu niy je dobrŏ: `<{ $componentType }>`

attribute-repeated = Niy idzie powtōrzyć atrybutu { $attribute }.

attribute-invalid-for-component = Atrybut "{ $attribute }" niy je dobry do kōmpōnyntu zorty `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Definicyjŏ sztilu { $styleNumber } mŏ za mały kōntrast do { $context ->
        [text-on-background] farby tekstu na farbie zadku
        [high-contrast] farby ô wysokim kōntraście na płōtnie
        [line] farby linije na płōtnie
        [marker] farby markera na płōtnie
       *[text-on-canvas] farby tekstu na płōtnie
    }{ $mode ->
        [dark] { " (ciymny tryb)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; trza nojmyni { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Chocioż definicyjŏ sztilu { $styleNumber } mŏ farby, co dŏwajōm dosyć kōntrastu do jasnego trybu, to farby do ciymnego trybu wyprowadzōne z tych wertōw majōm za mały kōntrast miyndzy farbōm tekstu a farbōm zadku ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; trza nojmyni { $threshold }:1). { $suggestion ->
        [available] Coby mieć dosyć kōntrastu we ciymnym trybie, abo podnieś kōntrast jasnego trybu (np. nasztaluj { $lightAttribute }="{ $lightColor }"), abo przekryj farba ciymnego trybu (np. nasztaluj { $darkAttribute }="{ $darkColor }").
       *[none] Coby mieć dosyć kōntrastu we ciymnym trybie, podnieś kōntrast jasnego trybu abo przekryj wyprowadzōne farby bez textColorDarkMode a/abo backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Chocioż definicyjŏ sztilu { $styleNumber } mŏ farba tekstu, co dŏwŏ dosyć kōntrastu do jasnego trybu, to farba tekstu do ciymnego trybu wyprowadzōnŏ z tyj werty mŏ za mały kōntrast na płōtnie ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; trza nojmyni { $threshold }:1). { $suggestion ->
        [available] Coby mieć dosyć kōntrastu we ciymnym trybie, abo podnieś kōntrast jasnego trybu (np. nasztaluj textColor="{ $lightColor }"), abo przekryj farba ciymnego trybu (np. nasztaluj textColorDarkMode="{ $darkColor }").
       *[none] Coby mieć dosyć kōntrastu we ciymnym trybie, podnieś kōntrast jasnego trybu abo przekryj wyprowadzōnŏ farba bez textColorDarkMode.
    }

section-multiple-style-palettes = Ôddzioł może wybrać ino jedyn <stylePalette>; bierã ôstatni.

## Unique variants

variant-num-to-select-not-non-negative-integer = niy idzie ustalić unikalnych wariantōw { $component }, bo numToSelect niy je niyujymnōm cołkōm liczbōm.

variant-num-to-select-not-constant-number = niy idzie ustalić unikalnych wariantōw { $component }, bo numToSelect niy je stałōm liczbōm.

variant-with-replacement-not-constant-boolean = niy idzie ustalić unikalnych wariantōw { $component }, bo withReplacement niy je stałōm werta logicznōm.

variant-select-weight-disables-unique = Unikalne warianty do select sōm zastawiōne, jak jakŏś ôpcyjŏ mŏ podane selectWeight abo selectForVariants

variant-coprime-undetermined = niy idzie ustalić unikalnych wariantōw { $component }, bo niy idzie ustalić, iże coprime je zawdy fałszywe.

variant-attribute-not-constant = niy idzie ustalić unikalnych wariantōw { $component }, bo { $attribute } niy je stałōm.

variant-attribute-not-number = niy idzie ustalić unikalnych wariantōw { $component }, bo { $attribute } niy je liczbōm.

variant-attribute-wrong-type-for-sequence =
    niy idzie ustalić unikalnych wariantōw { $component } zorty { $type }, bo { $attribute } niy je { $expected ->
        [letters-combination] kōmbinacyjōm buchsztabōw
        [math-expression] dobrym matymatycznym wyrażyniym
        [integer] cołkōm liczbōm
       *[number] liczbōm
    }.

variant-length-not-integer = niy idzie ustalić unikalnych wariantōw { $component }, bo length niy je cołkōm liczbōm.

variant-sort-not-implemented = unikalne warianty { $component } ze sort jeszcze niy sōm zrobiōne

variant-exclude-combinations-not-implemented = unikalne warianty { $component } ze excludeCombinations jeszcze niy sōm zrobiōne

variant-math-exclude-not-implemented = unikalne warianty { $component } zorty math ze exclude jeszcze niy sōm zrobiōne

variant-non-constant-exclude-not-implemented = unikalne warianty { $component } ze niystałym exclude jeszcze niy sōm zrobiōne

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: niy je ôbsugowane we rynderze prefigure do grafu; potōmek je przeskoczōny.

prefigure-descendant-invalid-geometry = { $subject }: geometryjŏ niy je skōńczōnŏ abo je niycołkŏ; potōmek je przeskoczōny.

prefigure-curve-label-omitted = { $subject }: etykety niy sōm ôbsugowane na przerobiōnych elymyntach krziwyj; etyketa je pōminiyntŏ.

prefigure-curve-unsupported-definition-type = { $subject }: zorta definicyje krziwyj '{ $definitionType }' niy je ôbsugowanŏ; potōmek je przeskoczōny.

prefigure-region-flip-functions-unsupported = { $subject }: atrybut flipFunctions na regionBetweenCurves niy je ôbsugowany; potōmek je przeskoczōny.

prefigure-region-non-formula-child = { $subject }: ino funkcyje-dzieci zorty wzōr sōm ôbsugowane na regionBetweenCurves; potōmek je przeskoczōny.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' niy je ôbsugowane do { $labelKind ->
        [line-family] etykety z familije prostych
       *[point] etykety pōnktu
    }; bierã wychodne wyrōwnanie PreFigure.

prefigure-fill-style-unsupported = { $subject }: sztil wypołniyniŏ '{ $fillStyle }' niy je ôbsugowany bez PreFigure; wracōm do pełnego wypołniyniŏ.

prefigure-line-style-unknown = { $subject }: niyznany sztil linije '{ $lineStyle }' je pōminiynty we wyjściu PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: sztil markera '{ $markerStyle }' je przełożōny na sztil PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: sztil markera '{ $markerStyle }' niy je ôbsugowany bez PreFigure; bierã wychodny sztil.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` niy je dobry; niy idzie rozwiōnzać cylu. Adnotacyjŏ je pōminiyntŏ.

annotation-ref-multiple-targets = `<annotation>`: `ref` wskŏzoł na wiyncyj cylōw; bierã piyrszy.

annotation-ref-outside-graph = `<annotation>`: `ref` niy je dobry; cyl je poza grafym naôkoło. Adnotacyjŏ je pōminiyntŏ.

annotation-ref-unsupported-target = `<annotation>`: `ref` niy je dobry; cyl niy je ôbsugowanym graficznym ôbiektym we kōnwersyji prefigure. Adnotacyjŏ je pōminiyntŏ.

annotation-text-missing = `<annotation>`: `text` brakuje abo je prōzny; posyłōm prōzny tekst.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Znodziōnŏ je cyrkularnŏ zŏwisłŏść.
       *[other] Znodziōnŏ je cyrkularnŏ zŏwisłŏść, co bierze w siebie kōmpōnynt `<{ $componentType }>`.
    }

reference-no-referent = Do ôdwołaniŏ `{ $reference }` niy znodziōno żŏdnego referyntu

reference-multiple-referents = Do ôdwołaniŏ `{ $reference }` znodziōno wiyncyj referyntōw

## Children that do not match

children-invalid-attribute-format = Format atrybutu { $attribute } ôd `<{ $componentType }>` niy je dobry.

children-invalid = Niydobre dzieci do `<{ $componentType }>`: znodziōne niydobre dzieci: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Werta `{ $value }` do atrybutu `{ $attribute }` niy je dobrŏ, bierã werta `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Wersyje DoenetML { $version } niy znodziōno.
       *[other] Wersyje DoenetML { $version } niy znodziōno. Wracōm do wersyje { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Niydobry DoenetML: { $content }

parse-tag-missing-close-tag = Niydobry DoenetML: Tag `{ $tag }` niy mŏ tagu zawiyrajōncego. Spodziywano sie tagu, co sie zawiyrŏ sōm, abo tagu `</{ $tagName }>`.

parse-tag-error = Niydobry DoenetML: Feler we tagu `<{ $tagName }>`

parse-attribute-missing-value = Niydobry DoenetML: Zdŏ sie, iże niydobrymu atrybutowi `{ $attribute }` brakuje werty.

parse-attribute-invalid = Niydobry DoenetML: Niydobry atrybut `{ $attribute }`

parse-attribute-value-invalid = Niydobry DoenetML: Niydobrŏ werta atrybutu `{ $value }`

parse-attribute-value-quote-mismatch = Niydobry DoenetML: Niydobrŏ werta atrybutu `{ $value }`. Cudzysłowy sie niy zgŏdzajōm. Zdŏ sie, iże ci brakuje `{ $quote }`

parse-open-tag-name-missing = Niydobry DoenetML: Znodziōny tag bez miana tagu, np. `<`

parse-tag-not-closed = Niydobry DoenetML: Tag `{ $tag }` niy bōł zawarty (zdŏ sie, iże brakuje `>`).

parse-self-closing-tag-name-missing = Niydobry DoenetML: Znodziōny tag bez miana tagu `<{ $content }>`

parse-self-closing-tag-not-closed = Niydobry DoenetML: Tag `{ $tag }` niy bōł zawarty (zdŏ sie, iże brakuje `/>`).

parse-tag-invalid-attributes = Niydobry DoenetML: Tag `{ $tag }` niy je dobry. Może mieć złe atrybuty.

parse-close-tag-name-missing = Niydobry DoenetML: Znodziōny tag zawiyrajōncy bez miana tagu, np. `</`

parse-attribute-value-unquoted = Werty atrybutōw muszōm stoć we cudzysłowach: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Niydobry DoenetML: Znodziōny tag zawiyrajōncy `{ $tag }`, ale bez ôdpowiadajōncego tagu ôtwiyrajōncego

parse-close-tag-mismatched = Niydobry DoenetML: Tag zawiyrajōncy sie niy zgŏdzŏ. Spodziywano sie `</{ $expected }>`. Znodziōno `{ $found }`

parser-node-unconvertible = Niy szło przerobić wynzła { $node } na wynzeł Dast.

## Names

name-attribute-invalid =
    Niydobry atrybut name='{ $name }'. { $reason ->
        [characters] Miana mogōm mieć ino buchsztaby, liczby, podkryślniki abo myślniki.
       *[start] Miana muszōm sie zaczynać ôd buchsztaby.
    }

component-name-invalid-start = Niydobre miano kōmpōnyntu "{ $name }". Miana muszōm sie zaczynać ôd buchsztaby.

## `<answer>` sugar

answer-video-watched-missing-video = Ôdpowiydź zorty videoWatched musi mieć atrybut video

answer-video-watched-video-not-reference = Ôdpowiydź zorty videoWatched musi mieć atrybut video, co je ôdwołaniym

answer-name-not-single-text = Atrybut name ôdpowiedzi musi mieć jedne tekstowe dziecko

## Referencing another document

external-doenetml-recursion-limit = Niy idzie pobrać zewnyntrznego DoenetML bez za dużo poziōmōw rekursyje. Je tam cyrkularne ôdwołanie?

external-doenetml-unavailable = Niy idzie pobrać DoenetML z { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Niydobry DoenetML pobrany z { $attribute }="{ $uri }": niy zgŏdzoł sie ze zortōm kōmpōnyntu "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atrybut `{ $from }` je przestarzały; użyj `{ $to }`.
       *[other] [deprecation] Atrybut `{ $from }` na `<{ $component }>` je przestarzały; użyj `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atrybut `{ $from }` je przestarzały a je pōminiynty, bo je tyż podane `{ $to }`.
       *[other] [deprecation] Atrybut `{ $from }` na `<{ $component }>` je przestarzały a je pōminiynty, bo je tyż podane `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Atrybut `{ $attribute }` na `<{ $component }>` je przestarzały a je pōminiynty.

deprecated-attribute-to-child = [deprecation] Atrybut `{ $attribute }` na `<{ $component }>` je przestarzały; użyj lepij dziecka `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Werta `{ $value }` atrybutu `{ $attribute }` na `<{ $component }>` je przestarzałŏ; użyj `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` umiy robić mnogŏść ino po angielsku, tōż jego tekst ôstŏwŏ niyzmiyniōny we dokumyncie napisanym we { $locale }. Napisz forma mnogŏ prosto, abo jōm nasztaluj atrybutym `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elymynt `<{ $tag }>` niy je znanym elymyntym Doenet.

schema-element-not-allowed-at-root = Elymynt `<{ $tag }>` niy je dozwolōny we korzyniu dokumyntu.

schema-element-not-allowed-inside = Elymynt `<{ $tag }>` niy je dozwolōny we postrzodku `<{ $parent }>`.

schema-attribute-unrecognized = Elymynt `<{ $tag }>` niy mŏ atrybutu ô mianie `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atrybut `{ $attribute }` elymyntu `<{ $tag }>` musi być listōm, co kożdy jeji elymynt je jednym z: { $allowed }
       *[other] Atrybut `{ $attribute }` elymyntu `<{ $tag }>` musi być jednym z: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Niydobre miano wariantu do select.  Miano wariantu { $variantName } wystympuje we { $numOptions } ôpcyjach, ale liczba do wybraniŏ je { $numToSelect }.

select-variant-name-without-options = Do select sōm podane jakieś warianty, ale niy ma żŏdnych ôpcyji do możebnego miana wariantu: { $variantName }.

select-variant-name-not-possible = Miano wariantu { $variantName } podane do select niy je możebnym mianym wariantu.

select-too-few-options = Niy idzie wybrać { $numToSelect } kōmpōnyntōw ino z { $numOptions }.

select-from-sequence-too-few-values = Niy idzie wybrać { $numToSelect } wertōw z ciōngu ô dugŏści { $length }.

select-from-sequence-indices-count-mismatch = Liczba indeksōw podanych do select musi sie zgŏdzać z liczbōm do wybraniŏ

select-from-sequence-indices-not-integers = Wszyskie indeksy podane do select muszōm być cołkimi liczbami

select-from-sequence-index-excluded = Podany indeks selectfromsequence bōł wykluczōny

select-from-sequence-indices-excluded-combination = Podane indeksy selectfromsequence były wykluczōnōm kōmbinacyjōm

select-from-sequence-coprime-not-positive-integers = Niy idzie wybrać kōmbinacyji wzglyndnie piyrszych, bo niy wybiyrŏ sie dodatnich cołkich liczb.

select-from-sequence-coprime-common-factor = Niy idzie wybrać liczb wzglyndnie piyrszych. Wszyskie możebne werty majōm spōlny dzielnik. (Podane werty "from" abo "to" muszōm być wzglyndnie piyrsze ze "step".)

select-from-sequence-coprime-single-number = Niy idzie wybrać kōmbinacyji wzglyndnie piyrszych z jednyj liczby, co niy je 1.

select-from-sequence-excluded-too-many-combinations = Wykluczōno wiyncyj jak 70% kōmbinacyji we selectFromSequence

select-from-sequence-coprime-none-found = Niy szło wybrać liczb wzglyndnie piyrszych. Wszyskie możebne werty majōm spōlny dzielnik.

select-from-sequence-too-few-unique-values = Niy idzie wybrać { $numToSelect } unikalnych wertōw z ciōngu ô dugŏści { $numPossibleValues }

select-prime-numbers-too-few-values = Niy idzie wybrać { $numToSelect } wertōw z listy liczb piyrszych ô dugŏści { $numValues }

select-prime-numbers-values-count-mismatch = Liczba wertōw podanych do select musi sie zgŏdzać z liczbōm do wybraniŏ

select-prime-numbers-values-not-prime = Wszyskie werty podane do select liczb piyrszych muszōm być na liście liczb piyrszych

select-prime-numbers-values-excluded-combination = Podane werty selectPrimeNumbers były wykluczōnōm kōmbinacyjōm

select-prime-numbers-excluded-too-many-combinations = Wykluczōno wiyncyj jak 70% kōmbinacyji we selectPrimeNumbers

select-random-combination-fluke = Bez fest niyprawdopodobny trefunek niy szło wybrać kōmbinacyje przipadkowych wertōw

select-random-value-fluke = Bez fest niyprawdopodobny trefunek niy szło wybrać przipadkowyj werty

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` sie niy rysuje we postrzodku matymatyki; wyrażynie je składane tak, jak przōdzij, niż szło wkłŏdać wpisy do postrzodka. { $reason ->
        [not-inline] Ino wpis wyboru `inline` sie miyści we wyrażyniu; bez `inline` to je blok knefli.
        [expanded] Wpis tekstowy `expanded` to je wielolinijowe pole, za srogie, coby stoć we wyrażyniu.
        [on-graph] Na grafie wyrażynie sie rysuje jak jedyn ôbrŏzek, co niy mŏ placu na kōntrolka.
       *[relative-width] Jego `width` je wzglyndnŏ (procynt abo `em`), a we wyrażyniu niy mŏ do czego sie miyrzić. Podej szyrokŏść we absolutnych jednostkach, choby `px`.
    }
