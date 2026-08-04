# Latvian diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
#
# Latvian counts in three categories — `zero`, `one` and `other` — and which of
# them a message needs depends on what the count does in it. A message that
# prints the number next to a noun agrees that noun with it and so spells out
# `zero` and `one`. A message where the number never appears — the list
# messages, whose count only decides whether a verb is singular or plural — has
# just the two forms Latvian offers there.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } tiek ignorēts, ja norādīti abi galapunkti
       *[other] { $attributes } tiek ignorēti, ja norādīti abi galapunkti
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } tiek ignorēts, ja norādīts gan galapunkts, gan viduspunkts
       *[other] { $attributes } tiek ignorēti, ja norādīts gan galapunkts, gan viduspunkts
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset nedarbojas bez norādīta viduspunkta

## `<line>`

line-points-undetermined-dimensions = Taisne caur nenoteiktas dimensijas punktiem.

line-points-too-few-dimensions = Taisnei jāiet caur vismaz divu dimensiju punktiem.

line-points-depend-on-variables = Taisne iet caur punktiem, kas atkarīgi no mainīgajiem: { $variables }.

line-equation-invalid-format = Nederīgs taisnes vienādojuma formāts mainīgajiem { $variable1 } un { $variable2 }.

## `<ray>`

ray-overprescribed-through = Stars norādīts ar through, endpoint un direction. Norādītais through tiek ignorēts.

ray-dimension-mismatch = numDimensions neatbilstība starā.

## `<vector>`

vector-overprescribed-head = Vektors norādīts ar head, tail un displacement. Norādītais head tiek ignorēts.

vector-dimension-mismatch = numDimensions neatbilstība vektorā.

## Attracting and constraining

attract-to-without-nearest-point = Nevar pievilkt pie `<{ $component }>`, jo tam nav stāvokļa mainīgā nearestPoint.

constrain-to-without-nearest-point = Nevar ierobežot līdz `<{ $component }>`, jo tam nav stāvokļa mainīgā nearestPoint.

constrain-to-interior-without-nearest-point = Nevar ierobežot līdz `<{ $component }>` iekšpusei, jo tam nav stāvokļa mainīgā nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition tiek ignorēts neiegultam choiceInput

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput norādītie indeksi tiek ignorēti: to skaits neatbilst pakārtoto choice skaitam.

pretzel-indices-count-mismatch = problem norādītie indeksi tiek ignorēti: to skaits neatbilst pakārtoto problem skaitam.

shuffle-indices-count-mismatch = shuffle norādītie indeksi tiek ignorēti: to skaits neatbilst komponentu skaitam.

indices-ignored-out-of-range = { $component } norādītie indeksi tiek ignorēti: daži ir ārpus diapazona.

pretzel-indices-repeated = pretzel norādītie indeksi tiek ignorēti: daži atkārtojas.

pretzel-circuit-first-index = pretzel režīmā circuit norādītie indeksi tiek ignorēti: pirmajam indeksam jābūt 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Lai `<{ $component }>` darbotos ar teksta pakārtotajiem elementiem, jānorāda atribūts `type`.

invalid-type-defaulting-to-math = Nederīgs tips { $type } komponentam { $component }. Tam jābūt math, text, number vai boolean. Tiek lietots math.

string-not-valid-component-to-arrange = Virkne „{ $value }“ nav derīgs komponents { $component }. Tā tiek ignorēta.

## Types and variables

invalid-type-defaulting-to-number = Nederīgs tips { $type }; tips tiek iestatīts uz number.

invalid-variable-value = Nederīga mainīgā vērtība: `{ $value }`

## Variants

variant-index-must-be-number = Varianta indeksam { $index } jābūt skaitlim

variant-index-must-be-integer = Varianta indeksam { $index } jābūt veselam skaitlim

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` nav īstenots absolūtiem mērījumiem. Platumi kļūst relatīvi.

side-by-side-absolute-margins = `<{ $component }>` nav īstenots absolūtiem mērījumiem. Atkāpes kļūst relatīvas.

side-by-side-no-block-child = Nederīgs `<{ $component }>`: tam jābūt vismaz vienam bloka pakārtotajam elementam.

## `<label>`

label-for-ignored-on-graphical = Grafiska `<label>` atribūts `for` tiek ignorēts.

label-for-must-resolve-to-one = `<label>` atribūtam `for` jānorāda tieši viens komponents.

label-for-unresolved = `<label>` atribūtu `for` neizdevās sasaistīt ar komponentu.

label-for-answer-with-authored-inputs = `<label>` atribūts `for` norāda uz `<answer>` ar tieši uzrakstītiem ievades laukiem; norādiet uz lauku tieši.

label-for-answer-without-input = `<label>` atribūts `for` norāda uz `<answer>` bez ievades lauka, ko apzīmēt.

label-for-must-reference-input-or-answer = `<label>` atribūtam `for` jānorāda uz ievades lauku vai atbildi.

## Accessibility

accessibility-short-description-or-decorative = Piekļūstamības dēļ `<{ $component }>` jābūt īsam aprakstam vai jābūt atzīmētam kā dekoratīvam.

accessibility-video-short-description = Piekļūstamības dēļ `<video>` jābūt īsam aprakstam.

accessibility-input-short-description-or-label = Piekļūstamības dēļ `<{ $component }>` jābūt īsam aprakstam vai apzīmējumam.

accessibility-answer-input-short-description-or-label = Piekļūstamības dēļ `<answer>`, kas veido ievades lauku, jābūt īsam aprakstam vai apzīmējumam.

accessibility-short-description-contains-math = Īsos aprakstos nevajadzētu būt matemātiskiem komponentiem, piemēram `<{ $component }>`. Matemātiku uzrakstiet vārdiem.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } kontrasts ir nepietiekams sadaļas virsraksta tekstam (tumšais motīvs) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nepieciešams vismaz { $threshold }:1).
       *[other] { $colorName } kontrasts ir nepietiekams sadaļas virsraksta tekstam ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nepieciešams vismaz { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` caur { $count } punktiem nav īstenots, ja punktiem nav skaitlisku vērtību.

circle-too-many-through-points = Nevar aprēķināt riņķa līniju caur vairāk nekā 3 punktiem.

circle-overprescribed-radius-center-points = Nevar aprēķināt riņķa līniju ar norādītu rādiusu, centru un punktiem.

circle-center-with-multiple-points = Nevar aprēķināt riņķa līniju ar norādītu centru caur vairāk nekā 1 punktu.

circle-radius-too-small = Nevar aprēķināt riņķa līniju: tā kā attālums starp abiem punktiem ir { $distance }, norādītais rādiuss { $radius } ir par mazu.

circle-radius-with-many-points = Nevar izveidot riņķa līniju caur vairāk nekā diviem punktiem ar norādītu rādiusu.

circle-invalid-center-or-through-points = Nederīgs riņķa līnijas centrs vai punkti.

circle-radius-center-with-multiple-points = Nevar aprēķināt riņķa līnijas rādiusu ar norādītu centru caur vairāk nekā 1 punktu.

circle-change-radius-non-numerical = Nevar mainīt rādiusu riņķa līnijai ar neskaitliskiem punktiem

circle-radius-with-points-non-numerical = Nevar izveidot riņķa līniju caur vairāk nekā vienu punktu ar norādītu rādiusu, ja nav skaitlisku vērtību.

circle-change-center-non-numerical = Centra maiņa riņķa līnijai caur neskaitliskiem punktiem nav īstenota.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [zero] Nepietiekams funkcijas definīcijas apgabala dimensiju skaits. Apgabalā ir { $intervals } intervālu, bet funkcijai ir { $inputs ->
            [zero] { $inputs } ieeju
            [one] { $inputs } ieeja
           *[other] { $inputs } ieejas
        }.
        [one] Nepietiekams funkcijas definīcijas apgabala dimensiju skaits. Apgabalā ir { $intervals } intervāls, bet funkcijai ir { $inputs ->
            [zero] { $inputs } ieeju
            [one] { $inputs } ieeja
           *[other] { $inputs } ieejas
        }.
       *[other] Nepietiekams funkcijas definīcijas apgabala dimensiju skaits. Apgabalā ir { $intervals } intervāli, bet funkcijai ir { $inputs ->
            [zero] { $inputs } ieeju
            [one] { $inputs } ieeja
           *[other] { $inputs } ieejas
        }.
    }

function-domain-invalid-format = Nederīgs funkcijas definīcijas apgabala formāts.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Funkcijas neskaitliskais maksimums tiek ignorēts.
        [minimum] Funkcijas neskaitliskais minimums tiek ignorēts.
        [extremum] Funkcijas neskaitliskais ekstrēms tiek ignorēts.
        [point] Funkcijas neskaitliskais punkts tiek ignorēts.
        [slope] Funkcijas neskaitliskais slīpums tiek ignorēts.
       *[other] Funkcijas neskaitliskais { $type } tiek ignorēts.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Funkcijas tukšais maksimums tiek ignorēts.
        [minimum] Funkcijas tukšais minimums tiek ignorēts.
        [extremum] Funkcijas tukšais ekstrēms tiek ignorēts.
        [point] Funkcijas tukšais punkts tiek ignorēts.
       *[other] Funkcijas tukšais { $type } tiek ignorēts.
    }

function-points-too-close = Funkcijā ir divi punkti, kas atrodas pārāk tuvu. Funkciju nevar definēt.

function-iterates-input-output-mismatch =
    { $inputs ->
        [zero] Funkcijas iterācijas ir iespējamas tikai tad, ja ieeju skaits ir vienāds ar izeju skaitu. Šai funkcijai ir { $inputs } ieeju un { $outputs ->
            [zero] { $outputs } izeju
            [one] { $outputs } izeja
           *[other] { $outputs } izejas
        }.
        [one] Funkcijas iterācijas ir iespējamas tikai tad, ja ieeju skaits ir vienāds ar izeju skaitu. Šai funkcijai ir { $inputs } ieeja un { $outputs ->
            [zero] { $outputs } izeju
            [one] { $outputs } izeja
           *[other] { $outputs } izejas
        }.
       *[other] Funkcijas iterācijas ir iespējamas tikai tad, ja ieeju skaits ir vienāds ar izeju skaitu. Šai funkcijai ir { $inputs } ieejas un { $outputs ->
            [zero] { $outputs } izeju
            [one] { $outputs } izeja
           *[other] { $outputs } izejas
        }.
    }

## `<sequence>`

sequence-invalid-length = Nederīgs virknes garums. Tam jābūt nenegatīvam veselam skaitlim.

sequence-invalid-step = Nederīgs virknes solis. { $type } tipa virknei tam jābūt skaitlim.

sequence-invalid-endpoint-number = Nederīgs skaitļu virknes „{ $attribute }“. Tam jābūt skaitlim.

sequence-invalid-endpoint-letters = Nederīgs burtu virknes „{ $attribute }“. Tam jābūt burtu kombinācijai.

sequence-invalid-endpoint = Nederīgs virknes „{ $attribute }“.

select-from-sequence-coprime-not-numbers = coprime tiek ignorēts, jo netiek atlasīti skaitļi

select-from-sequence-coprime-with-exclude-combinations = coprime tiek ignorēts, jo norādīts excludeCombinations

## Resolving a `target`

target-not-found = Nederīgs `<{ $source }>` target: mērķis nav atrasts.

target-state-variable-not-found = Nederīgs `<{ $source }>` target: `<{ $component }>` nav stāvokļa mainīgā ar nosaukumu „{ $property }“.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` mainīgajiem jāatšķiras no neatkarīgā mainīgā.

ode-system-duplicate-variable-names = Nevar definēt DV labās puses ar atkārtotiem atkarīgo mainīgo nosaukumiem.

ode-system-rhs-function-error = Nevar definēt DV labo pusi. Kļūda, veidojot mathjs funkciju.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Nevar definēt leņķi starp { $count } taisnēm

angle-invalid-through-point = Nederīgs punkts `<angle>` atribūtā through

parabola-vertex-too-many-points = Parabola ar norādītu virsotni caur vairāk nekā 1 punktu nav īstenota.

parabola-too-many-points = Parabola caur vairāk nekā 3 punktiem nav īstenota.

intersection-too-many-items = Vairāk nekā divu objektu šķēlums nav īstenots

## Other math components

ionic-compound-not-two-ions = Jonu savienojumi, izņemot tos no diviem joniem, nav īstenoti.

ionic-compound-needs-cation-and-anion = Jonu savienojumi īstenoti tikai vienam katjonam un vienam anjonam.

solve-equations-cannot-evaluate = Nevar atrisināt vienādojumu, jo to neizdevās aprēķināt: { $equation }

math-operators-operand-number-required = Lai izgūtu matemātisku operandu, jānorāda operandNumber.

eigen-decomposition-failed = Neizdevās aprēķināt matricas īpašvērtības

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parametrs { $parameters } paraugā neparādās, tāpēc tas vienmēr atbildīs tukšumam.
       *[other] `<matchesPattern>`: parametri { $parameters } paraugā neparādās, tāpēc tie vienmēr atbildīs tukšumam.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: neizdevās saprast grid="{ $grid }". Vērtībai jābūt none, medium, dense vai diviem pozitīviem skaitļiem, atdalītiem ar atstarpi, piemēram grid="1 0.5". Režģis netiek zīmēts.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" prefigure attēlotājā netiek atbalstīts; tiek lietota labās puses uzvedība.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" prefigure attēlotājā netiek atbalstīts; tiek lietota augšas uzvedība.

prefigure-invalid-axis-bounds = `<graph>`: nederīgas asu robežas pārveidei uz prefigure; tiek lietots noklusējuma bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: nederīgs platums pārveidei uz prefigure; tiek lietots noklusējuma diagrammas platums 425.

prefigure-invalid-aspect-ratio = `<graph>`: nederīgs aspectRatio pārveidei uz prefigure; tiek lietota noklusējuma malu attiecība 1.

prefigure-grid-spacing-too-fine = `<graph>`: režģa solis ir pārāk smalks asu robežām; prefigure attēlotājā režģis tiek izlaists.

prefigure-annotations-not-rendered = `<graph>`: ārpus PreFigure attēlotāja anotācijas netiek zīmētas.

multiple-annotations-children = `<graph>` atrasti vairāki pakārtoti `<annotations>`; visi, izņemot pēdējo, tiek ignorēti.

## Referring to other components

copy-unrecognized-component-type = Nevar paplašināt vai kopēt neatpazītu komponenta tipu: { $type }.

copy-prop-not-found = Īpašība { $property } nav atrasta { $component } tipa komponentā

collect-no-source = collect avots nav atrasts.

collect-invalid-component-type = Nevar vākt `<{ $component }>` tipa komponentus, jo tas ir nederīgs komponenta tips.

reference-index-unavailable = Nevar atsaukties uz indeksu `{ $reference }`

## `<callAction>`

component-action-unavailable = Nevar izsaukt { $action } komponentā `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Datiem ir nederīga forma. Rindu garumi atšķiras. Atrasts componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Datos ir atkārtoti kolonnu nosaukumi. Atrasts componentIdx :{ $componentIdx }

data-frame-missing-column-name = Datiem trūkst kolonnas nosaukuma. Atrasts componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Šīs atbildes award balstās uz pašas answer birkas iesniegto atbildi, kas radīs negaidītu uzvedību.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` iestatīšana `<answer>` iekšā konteinerā ar `sectionWideCheckWork` nedarbojas, jo mēģinājumu skaitu nosaka konteiners. Iestatiet `maxNumAttempts` konteineram.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` iestatīšana konteineram ar `sectionWideCheckWork`, kas pats atrodas citā konteinerā ar `sectionWideCheckWork`, nedarbojas, jo mēģinājumu skaitu nosaka ārējais konteiners. Iestatiet `maxNumAttempts` ārējam konteineram.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Atribūts { $attributes } nedarbosies bez iestatīta symbolicEquality.
       *[other] Atribūti { $attributes } nedarbosies bez iestatīta symbolicEquality.
    }

answer-invalid-type = Nederīgs answer tips: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Komponentam `<{ $component }>` nav nosaukuma, tāpēc to nevar izmantot kā moduļa atribūtu

module-attribute-name-already-defined = Komponentu `<{ $component } name="{ $name }">` nevar izmantot kā moduļa atribūtu, jo komponenta tipam `<module>` jau ir definēts atribūts „{ $name }“.

conditional-content-condition-ignored = Atribūts `condition` tiek ignorēts `<conditionalContent>` komponentā ar pakārtotiem case vai else.

slider-markers-type-mismatch = Marķieru tips neatbilst slīdņa tipam.

pretzel-problem-needs-statement-and-answer = Nederīgs pretzel: katrā `<problem>` jābūt vienam `<statement>` un vienam `<answer>`.

pretzel-circuit-first-problem-distractor = Nederīgs pretzel: ar mode="circuit" pirmais `<problem>` nevar būt novērsējs.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Nederīga vērtība { $values } atribūtam `{ $attribute }`; tā tiek ignorēta.
       *[other] Nederīgas vērtības { $values } atribūtam `{ $attribute }`; tās tiek ignorētas.
    }

attribute-must-be-references = Nederīga vērtība `{ $value }` atribūtam `{ $attribute }`. Atribūtam jāsastāv no atsaucēm, kas sākas ar `$`.

math-input-invalid-function-names = <mathInput>: nederīgie funkciju nosaukumi atribūtā { $attribute } tika ignorēti: { $names }. Katra nosaukuma rādāmajai daļai jābūt vismaz 2 zīmes garai (burti vai defises); tai var sekot neobligāta piedēkļa daļa `|<mathspeak alternatīva>`.

## Building components from the source

component-type-invalid = Nederīgs komponenta tips: `<{ $componentType }>`

attribute-repeated = Atribūtu { $attribute } nevar atkārtot.

attribute-invalid-for-component = Nederīgs atribūts „{ $attribute }“ `<{ $componentType }>` tipa komponentam.

## Style definition contrast

style-definition-insufficient-contrast =
    Stila definīcijai { $styleNumber } ir nepietiekams kontrasts { $context ->
        [text-on-background] teksta krāsai pret fona krāsu
        [high-contrast] augsta kontrasta krāsai pret audeklu
        [line] līniju krāsai pret audeklu
        [marker] marķieru krāsai pret audeklu
       *[text-on-canvas] teksta krāsai pret audeklu
    }{ $mode ->
        [dark] { " (tumšais motīvs)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nepieciešams vismaz { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Lai gan stila definīcijā { $styleNumber } norādītajām krāsām gaišajam motīvam ir pietiekams kontrasts, no tām atvasinātās tumšā motīva krāsas dod nepietiekamu teksta kontrastu pret fonu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nepieciešams vismaz { $threshold }:1). { $suggestion ->
        [available] Lai kontrasts tumšajā motīvā būtu pietiekams, vai nu palieliniet kontrastu gaišajā motīvā (piemēram { $lightAttribute }="{ $lightColor }"), vai aizstājiet tumšā motīva krāsu (piemēram { $darkAttribute }="{ $darkColor }").
       *[none] Lai kontrasts tumšajā motīvā būtu pietiekams, palieliniet kontrastu gaišajā motīvā vai aizstājiet atvasinātās krāsas ar textColorDarkMode un/vai backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Lai gan stila definīcijā { $styleNumber } norādītajai teksta krāsai gaišajam motīvam ir pietiekams kontrasts, no tās atvasinātā tumšā motīva teksta krāsa dod nepietiekamu kontrastu pret audeklu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nepieciešams vismaz { $threshold }:1). { $suggestion ->
        [available] Lai kontrasts tumšajā motīvā būtu pietiekams, vai nu palieliniet kontrastu gaišajā motīvā (piemēram textColor="{ $lightColor }"), vai aizstājiet tumšā motīva krāsu (piemēram textColorDarkMode="{ $darkColor }").
       *[none] Lai kontrasts tumšajā motīvā būtu pietiekams, palieliniet kontrastu gaišajā motīvā vai aizstājiet atvasināto krāsu ar textColorDarkMode.
    }

section-multiple-style-palettes = Sadaļa var izvēlēties tikai vienu <stylePalette>; tiek lietota pēdējā.

## Unique variants

variant-num-to-select-not-non-negative-integer = nevar noteikt { $component } unikālos variantus, jo numToSelect nav nenegatīvs vesels skaitlis.

variant-num-to-select-not-constant-number = nevar noteikt { $component } unikālos variantus, jo numToSelect nav nemainīgs skaitlis.

variant-with-replacement-not-constant-boolean = nevar noteikt { $component } unikālos variantus, jo withReplacement nav nemainīga loģiska vērtība.

variant-select-weight-disables-unique = Unikālie select varianti tiek atspējoti, ja kādai iespējai norādīts selectWeight vai selectForVariants

variant-coprime-undetermined = nevar noteikt { $component } unikālos variantus, jo nevar konstatēt, ka coprime vienmēr ir aplams.

variant-attribute-not-constant = nevar noteikt { $component } unikālos variantus, jo { $attribute } nav konstante.

variant-attribute-not-number = nevar noteikt { $component } unikālos variantus, jo { $attribute } nav skaitlis.

variant-attribute-wrong-type-for-sequence =
    nevar noteikt { $type } tipa { $component } unikālos variantus, jo { $attribute } nav { $expected ->
        [letters-combination] burtu kombinācija
        [math-expression] derīga matemātiska izteiksme
        [integer] vesels skaitlis
       *[number] skaitlis
    }.

variant-length-not-integer = nevar noteikt { $component } unikālos variantus, jo length nav vesels skaitlis.

variant-sort-not-implemented = { $component } unikālie varianti ar sort nav īstenoti

variant-exclude-combinations-not-implemented = { $component } unikālie varianti ar excludeCombinations nav īstenoti

variant-math-exclude-not-implemented = math tipa { $component } unikālie varianti ar exclude nav īstenoti

variant-non-constant-exclude-not-implemented = { $component } unikālie varianti ar nemainīgu exclude nav īstenoti

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: netiek atbalstīts grafika prefigure attēlotājā; pēctecis izlaists.

prefigure-descendant-invalid-geometry = { $subject }: bezgalīga vai nepilnīga ģeometrija; pēctecis izlaists.

prefigure-curve-label-omitted = { $subject }: apzīmējumi pārveidotos līkņu elementos netiek atbalstīti; apzīmējums izlaists.

prefigure-curve-unsupported-definition-type = { $subject }: neatbalstīts līknes funkcijas definīcijas tips „{ $definitionType }“; pēctecis izlaists.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves atribūts flipFunctions netiek atbalstīts; pēctecis izlaists.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves tiek atbalstītas tikai ar formulu definētas pakārtotās funkcijas; pēctecis izlaists.

prefigure-label-position-unsupported =
    { $subject }: neatbalstīts labelPosition „{ $labelPosition }“ { $labelKind ->
        [line-family] taišņu saimes apzīmējumam
       *[point] punkta apzīmējumam
    }; tiek lietots PreFigure noklusējuma līdzinājums.

prefigure-fill-style-unsupported = { $subject }: pildījuma stils „{ $fillStyle }“ PreFigure netiek atbalstīts; tiek lietots vienlaidu pildījums.

prefigure-line-style-unknown = { $subject }: nezināms līnijas stils „{ $lineStyle }“ izlaists PreFigure izvadē.

prefigure-marker-style-mapped-to-diamond = { $subject }: marķiera stils „{ $markerStyle }“ sasaistīts ar PreFigure stilu „diamond“.

prefigure-marker-style-unsupported = { $subject }: marķiera stils „{ $markerStyle }“ PreFigure netiek atbalstīts; tiek lietots noklusējuma stils.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: nederīgs `ref`; mērķi nevar sasaistīt. Anotācija izlaista.

annotation-ref-multiple-targets = `<annotation>`: `ref` sasaistījās ar vairākiem mērķiem; tiek lietots pirmais.

annotation-ref-outside-graph = `<annotation>`: nederīgs `ref`; mērķis ir ārpus to ietverošā grafika. Anotācija izlaista.

annotation-ref-unsupported-target = `<annotation>`: nederīgs `ref`; mērķis nav atbalstīts grafisks objekts prefigure pārveidē. Anotācija izlaista.

annotation-text-missing = `<annotation>`: `text` trūkst vai ir tukšs; tiek izvadīts tukšs teksts.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Konstatēta cikliska atkarība.
       *[other] Konstatēta cikliska atkarība, kas ietver `<{ $componentType }>` komponentu.
    }

reference-no-referent = Atsaucei nav atrasts objekts: `{ $reference }`

reference-multiple-referents = Atsaucei atrasti vairāki objekti: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Nederīgs `<{ $componentType }>` atribūta { $attribute } formāts.

children-invalid = Nederīgi `<{ $componentType }>` pakārtotie elementi: atrasti nederīgi pakārtotie elementi: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Nederīga vērtība `{ $value }` atribūtam `{ $attribute }`; tiek lietota vērtība `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML versija { $version } nav atrasta.
       *[other] DoenetML versija { $version } nav atrasta. Tiek lietota versija { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Nederīgs DoenetML: { $content }

parse-tag-missing-close-tag = Nederīgs DoenetML: birkai `{ $tag }` nav aizverošās birkas. Tika gaidīta pašaizverošā birka vai birka `</{ $tagName }>`.

parse-tag-error = Nederīgs DoenetML: kļūda birkā `<{ $tagName }>`

parse-attribute-missing-value = Nederīgs DoenetML: atribūtam `{ $attribute }`, šķiet, trūkst vērtības.

parse-attribute-invalid = Nederīgs DoenetML: nederīgs atribūts `{ $attribute }`

parse-attribute-value-invalid = Nederīgs DoenetML: nederīga atribūta vērtība `{ $value }`

parse-attribute-value-quote-mismatch = Nederīgs DoenetML: nederīga atribūta vērtība `{ $value }`. Pēdiņas nesakrīt. Šķiet, trūkst `{ $quote }`

parse-open-tag-name-missing = Nederīgs DoenetML: atrasta birka bez nosaukuma, piemēram `<`

parse-tag-not-closed = Nederīgs DoenetML: birka `{ $tag }` nav aizvērta (šķiet, trūkst `>`).

parse-self-closing-tag-name-missing = Nederīgs DoenetML: atrasta birka bez nosaukuma `<{ $content }>`

parse-self-closing-tag-not-closed = Nederīgs DoenetML: birka `{ $tag }` nav aizvērta (šķiet, trūkst `/>`).

parse-tag-invalid-attributes = Nederīgs DoenetML: birka `{ $tag }` nav derīga. Iespējams, tai ir nepareizi atribūti.

parse-close-tag-name-missing = Nederīgs DoenetML: atrasta aizverošā birka bez nosaukuma, piemēram `</`

parse-attribute-value-unquoted = Atribūtu vērtībām jābūt pēdiņās: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Nederīgs DoenetML: atrasta aizverošā birka `{ $tag }`, bet nav atbilstošas atverošās

parse-close-tag-mismatched = Nederīgs DoenetML: nesakrītoša aizverošā birka. Tika gaidīta `</{ $expected }>`. Atrasta `{ $found }`

parser-node-unconvertible = Neizdevās pārveidot mezglu { $node } par Dast mezglu.

## Names

name-attribute-invalid =
    Nederīgs atribūts name='{ $name }'. { $reason ->
        [characters] Nosaukumos drīkst būt tikai burti, cipari, pasvītrojumi vai defises.
       *[start] Nosaukumiem jāsākas ar burtu.
    }

component-name-invalid-start = Nederīgs komponenta nosaukums „{ $name }“. Nosaukumiem jāsākas ar burtu.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched tipa answer jābūt atribūtam video

answer-video-watched-video-not-reference = videoWatched tipa answer atribūtam video jābūt atsaucei

answer-name-not-single-text = answer atribūtam name jābūt tieši vienam teksta pakārtotajam elementam

## Referencing another document

external-doenetml-recursion-limit = Neizdevās iegūt ārējo DoenetML pārāk daudzu rekursijas līmeņu dēļ. Vai nav cikliskas atsauces?

external-doenetml-unavailable = Neizdevās iegūt DoenetML no { $attribute }="{ $uri }"

external-doenetml-type-mismatch = No { $attribute }="{ $uri }" iegūts nederīgs DoenetML: tas neatbilda komponenta tipam „{ $componentType }“

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribūts `{ $from }` ir novecojis; lietojiet `{ $to }`.
       *[other] [deprecation] `<{ $component }>` atribūts `{ $from }` ir novecojis; lietojiet `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribūts `{ $from }` ir novecojis un tiek ignorēts, jo norādīts arī `{ $to }`.
       *[other] [deprecation] `<{ $component }>` atribūts `{ $from }` ir novecojis un tiek ignorēts, jo norādīts arī `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` atribūts `{ $attribute }` ir novecojis un tiek ignorēts.


## Language coverage

pluralize-english-only = `<pluralize>` prot veidot daudzskaitli tikai angliski, tāpēc dokumentā { $locale } valodā tā teksts paliek nemainīgs. Uzrakstiet daudzskaitļa formu pats vai norādiet to ar atribūtu `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elements `<{ $tag }>` nav atpazīts Doenet elements.

schema-element-not-allowed-at-root = Elements `<{ $tag }>` nav atļauts dokumenta saknē.

schema-element-not-allowed-inside = Elements `<{ $tag }>` nav atļauts `<{ $parent }>` iekšpusē.

schema-attribute-unrecognized = Elementam `<{ $tag }>` nav atribūta ar nosaukumu `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Elementa `<{ $tag }>` atribūtam `{ $attribute }` jābūt sarakstam, kura katrs loceklis ir viens no: { $allowed }
       *[other] Elementa `<{ $tag }>` atribūtam `{ $attribute }` jābūt vienam no: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nederīgs select varianta nosaukums. Varianta nosaukums { $variantName } parādās { $numOptions } iespējās, bet jāizvēlas { $numToSelect }.

select-variant-name-without-options = select norādīti varianti, bet nav norādīta neviena iespēja iespējamajam varianta nosaukumam: { $variantName }.

select-variant-name-not-possible = select norādītais varianta nosaukums { $variantName } nav iespējams varianta nosaukums.

select-too-few-options = Nevar izvēlēties { $numToSelect } komponentus tikai no { $numOptions }.

select-from-sequence-too-few-values = Nevar izvēlēties { $numToSelect } vērtības no { $length } garas virknes.

select-from-sequence-indices-count-mismatch = select norādīto indeksu skaitam jāatbilst izvēlamo skaitam

select-from-sequence-indices-not-integers = Visiem select norādītajiem indeksiem jābūt veseliem skaitļiem

select-from-sequence-index-excluded = Norādītais selectfromsequence indekss bija izslēgts

select-from-sequence-indices-excluded-combination = Norādītie selectfromsequence indeksi veidoja izslēgtu kombināciju

select-from-sequence-coprime-not-positive-integers = Nevar izvēlēties savstarpēji pirmskaitļu kombinācijas, jo netiek atlasīti pozitīvi veseli skaitļi.

select-from-sequence-coprime-common-factor = Nevar izvēlēties savstarpēji pirmus skaitļus. Visām iespējamajām vērtībām ir kopīgs dalītājs. (Norādītajām "from" vai "to" vērtībām jābūt savstarpēji pirmām ar "step".)

select-from-sequence-coprime-single-number = Nevar izvēlēties savstarpēji pirmskaitļu kombinācijas no viena skaitļa, kas nav 1.

select-from-sequence-excluded-too-many-combinations = selectFromSequence izslēgti vairāk nekā 70 % kombināciju

select-from-sequence-coprime-none-found = Neizdevās izvēlēties savstarpēji pirmus skaitļus. Visām iespējamajām vērtībām ir kopīgs dalītājs.

select-from-sequence-too-few-unique-values = Nevar izvēlēties { $numToSelect } atšķirīgas vērtības no { $numPossibleValues } garas virknes

select-prime-numbers-too-few-values = Nevar izvēlēties { $numToSelect } vērtības no { $numValues } gara pirmskaitļu saraksta

select-prime-numbers-values-count-mismatch = select norādīto vērtību skaitam jāatbilst izvēlamo skaitam

select-prime-numbers-values-not-prime = Visām select prime number norādītajām vērtībām jābūt pirmskaitļu sarakstā

select-prime-numbers-values-excluded-combination = Norādītās selectPrimeNumbers vērtības veidoja izslēgtu kombināciju

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers izslēgti vairāk nekā 70 % kombināciju

select-random-combination-fluke = Ārkārtīgi maz ticamas sagadīšanās dēļ neizdevās izvēlēties nejaušu vērtību kombināciju

select-random-value-fluke = Ārkārtīgi maz ticamas sagadīšanās dēļ neizdevās izvēlēties nejaušu vērtību
