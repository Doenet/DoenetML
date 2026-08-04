# Lithuanian diagnostics. Translated from `locales/en/diagnostics.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
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
# Lithuanian counts in three categories a whole number can reach, and which of
# them a message needs depends on what the count does in it. A message that
# prints the number next to a noun agrees that noun with it, so it spells out
# `one` and `few` and lets `*[other]` carry the genitive plural. A message
# where the number never appears — the list messages, whose count only decides
# whether a verb is singular or plural — has just the two forms Lithuanian
# offers there.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } nepaisoma, kai nurodyti abu galai
       *[other] { $attributes } nepaisoma, kai nurodyti abu galai
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } nepaisoma, kai nurodyti ir galas, ir vidurio taškas
       *[other] { $attributes } nepaisoma, kai nurodyti ir galas, ir vidurio taškas
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset neveikia be nurodyto vidurio taško

## `<line>`

line-points-undetermined-dimensions = Tiesė per neapibrėžto matmens taškus.

line-points-too-few-dimensions = Tiesė turi eiti per bent dviejų matmenų taškus.

line-points-depend-on-variables = Tiesė eina per taškus, priklausančius nuo kintamųjų: { $variables }.

line-equation-invalid-format = Netinkamas tiesės lygties formatas kintamiesiems { $variable1 } ir { $variable2 }.

## `<ray>`

ray-overprescribed-through = Spindulys nurodytas per through, endpoint ir direction. Nurodyto through nepaisoma.

ray-dimension-mismatch = numDimensions neatitikimas spindulyje.

## `<vector>`

vector-overprescribed-head = Vektorius nurodytas per head, tail ir displacement. Nurodyto head nepaisoma.

vector-dimension-mismatch = numDimensions neatitikimas vektoriuje.

## Attracting and constraining

attract-to-without-nearest-point = Negalima traukti prie `<{ $component }>`, nes jis neturi būsenos kintamojo nearestPoint.

constrain-to-without-nearest-point = Negalima apriboti iki `<{ $component }>`, nes jis neturi būsenos kintamojo nearestPoint.

constrain-to-interior-without-nearest-point = Negalima apriboti iki `<{ $component }>` vidaus, nes jis neturi būsenos kintamojo nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition nepaisoma neįterptiniam choiceInput

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput nurodytų indeksų nepaisoma: jų skaičius neatitinka dukterinių choice skaičiaus.

pretzel-indices-count-mismatch = problem nurodytų indeksų nepaisoma: jų skaičius neatitinka dukterinių problem skaičiaus.

shuffle-indices-count-mismatch = shuffle nurodytų indeksų nepaisoma: jų skaičius neatitinka komponentų skaičiaus.

indices-ignored-out-of-range = { $component } nurodytų indeksų nepaisoma: kai kurie yra už ribų.

pretzel-indices-repeated = pretzel nurodytų indeksų nepaisoma: kai kurie kartojasi.

pretzel-circuit-first-index = pretzel režimu circuit nurodytų indeksų nepaisoma: pirmasis indeksas turi būti 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Kad `<{ $component }>` veiktų su tekstiniais dukteriniais elementais, turi būti nurodytas atributas `type`.

invalid-type-defaulting-to-math = Netinkamas tipas { $type } komponentui { $component }. Turi būti math, text, number arba boolean. Naudojama math.

string-not-valid-component-to-arrange = Eilutė „{ $value }“ nėra tinkamas komponentas { $component }. Jos nepaisoma.

## Types and variables

invalid-type-defaulting-to-number = Netinkamas tipas { $type }; tipas nustatomas į number.

invalid-variable-value = Netinkama kintamojo reikšmė: `{ $value }`

## Variants

variant-index-must-be-number = Varianto indeksas { $index } turi būti skaičius

variant-index-must-be-integer = Varianto indeksas { $index } turi būti sveikasis skaičius

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` nėra įgyvendintas absoliutiems matmenims. Pločiai tampa santykiniai.

side-by-side-absolute-margins = `<{ $component }>` nėra įgyvendintas absoliutiems matmenims. Paraštės tampa santykinės.

side-by-side-no-block-child = Netinkamas `<{ $component }>`: jis turi turėti bent vieną blokinį dukterinį elementą.

## `<label>`

label-for-ignored-on-graphical = Grafinio `<label>` atributo `for` nepaisoma.

label-for-must-resolve-to-one = `<label>` atributas `for` turi nurodyti lygiai vieną komponentą.

label-for-unresolved = `<label>` atributo `for` nepavyko susieti su komponentu.

label-for-answer-with-authored-inputs = `<label>` atributas `for` nurodo `<answer>` su aiškiai užrašytais įvesties laukais; nurodykite lauką tiesiogiai.

label-for-answer-without-input = `<label>` atributas `for` nurodo `<answer>` be įvesties lauko, kurį būtų galima pažymėti.

label-for-must-reference-input-or-answer = `<label>` atributas `for` turi nurodyti įvesties lauką arba atsakymą.

## Accessibility

accessibility-short-description-or-decorative = Dėl prieinamumo `<{ $component }>` turi turėti trumpą aprašą arba būti pažymėtas kaip dekoratyvus.

accessibility-video-short-description = Dėl prieinamumo `<video>` turi turėti trumpą aprašą.

accessibility-input-short-description-or-label = Dėl prieinamumo `<{ $component }>` turi turėti trumpą aprašą arba žymę.

accessibility-answer-input-short-description-or-label = Dėl prieinamumo `<answer>`, kuriantis įvesties lauką, turi turėti trumpą aprašą arba žymę.

accessibility-short-description-contains-math = Trumpuose aprašuose neturėtų būti matematinių komponentų, tokių kaip `<{ $component }>`. Matematiką užrašykite žodžiais.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } kontrastas nepakankamas skyriaus antraštės tekstui (tamsi tema) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; reikia bent { $threshold }:1).
       *[other] { $colorName } kontrastas nepakankamas skyriaus antraštės tekstui ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; reikia bent { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` per { $count } taškų nėra įgyvendintas, kai taškai neturi skaitinių reikšmių.

circle-too-many-through-points = Negalima apskaičiuoti apskritimo per daugiau nei 3 taškus.

circle-overprescribed-radius-center-points = Negalima apskaičiuoti apskritimo su nurodytu spinduliu, centru ir taškais.

circle-center-with-multiple-points = Negalima apskaičiuoti apskritimo su nurodytu centru per daugiau nei 1 tašką.

circle-radius-too-small = Negalima apskaičiuoti apskritimo: kadangi atstumas tarp dviejų taškų yra { $distance }, nurodytas spindulys { $radius } per mažas.

circle-radius-with-many-points = Negalima sudaryti apskritimo per daugiau nei du taškus su nurodytu spinduliu.

circle-invalid-center-or-through-points = Netinkamas apskritimo centras arba taškai.

circle-radius-center-with-multiple-points = Negalima apskaičiuoti apskritimo spindulio su nurodytu centru per daugiau nei 1 tašką.

circle-change-radius-non-numerical = Negalima pakeisti apskritimo su neskaitiniais taškais spindulio

circle-radius-with-points-non-numerical = Negalima sudaryti apskritimo per daugiau nei vieną tašką su nurodytu spinduliu, kai nėra skaitinių reikšmių.

circle-change-center-non-numerical = Apskritimo per neskaitinius taškus centro keitimas nėra įgyvendintas.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Nepakanka funkcijos apibrėžimo srities matmenų. Sritis turi { $intervals } intervalą, o funkcija turi { $inputs ->
            [one] { $inputs } įvestį
            [few] { $inputs } įvestis
           *[other] { $inputs } įvesčių
        }.
        [few] Nepakanka funkcijos apibrėžimo srities matmenų. Sritis turi { $intervals } intervalus, o funkcija turi { $inputs ->
            [one] { $inputs } įvestį
            [few] { $inputs } įvestis
           *[other] { $inputs } įvesčių
        }.
       *[other] Nepakanka funkcijos apibrėžimo srities matmenų. Sritis turi { $intervals } intervalų, o funkcija turi { $inputs ->
            [one] { $inputs } įvestį
            [few] { $inputs } įvestis
           *[other] { $inputs } įvesčių
        }.
    }

function-domain-invalid-format = Netinkamas funkcijos apibrėžimo srities formatas.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Neskaitinio funkcijos maksimumo nepaisoma.
        [minimum] Neskaitinio funkcijos minimumo nepaisoma.
        [extremum] Neskaitinio funkcijos ekstremumo nepaisoma.
        [point] Neskaitinio funkcijos taško nepaisoma.
        [slope] Neskaitinio funkcijos polinkio nepaisoma.
       *[other] Neskaitinio funkcijos { $type } nepaisoma.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Tuščio funkcijos maksimumo nepaisoma.
        [minimum] Tuščio funkcijos minimumo nepaisoma.
        [extremum] Tuščio funkcijos ekstremumo nepaisoma.
        [point] Tuščio funkcijos taško nepaisoma.
       *[other] Tuščio funkcijos { $type } nepaisoma.
    }

function-points-too-close = Funkcijoje yra du per arti esantys taškai. Funkcijos apibrėžti negalima.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Funkcijos iteracijos galimos tik tada, kai įvesčių skaičius lygus išvesčių skaičiui. Ši funkcija turi { $inputs } įvestį ir { $outputs ->
            [one] { $outputs } išvestį
            [few] { $outputs } išvestis
           *[other] { $outputs } išvesčių
        }.
        [few] Funkcijos iteracijos galimos tik tada, kai įvesčių skaičius lygus išvesčių skaičiui. Ši funkcija turi { $inputs } įvestis ir { $outputs ->
            [one] { $outputs } išvestį
            [few] { $outputs } išvestis
           *[other] { $outputs } išvesčių
        }.
       *[other] Funkcijos iteracijos galimos tik tada, kai įvesčių skaičius lygus išvesčių skaičiui. Ši funkcija turi { $inputs } įvesčių ir { $outputs ->
            [one] { $outputs } išvestį
            [few] { $outputs } išvestis
           *[other] { $outputs } išvesčių
        }.
    }

## `<sequence>`

sequence-invalid-length = Netinkamas sekos ilgis. Turi būti neneigiamas sveikasis skaičius.

sequence-invalid-step = Netinkamas sekos žingsnis. { $type } tipo sekai jis turi būti skaičius.

sequence-invalid-endpoint-number = Netinkamas skaitinės sekos „{ $attribute }“. Turi būti skaičius.

sequence-invalid-endpoint-letters = Netinkamas raidinės sekos „{ $attribute }“. Turi būti raidžių derinys.

sequence-invalid-endpoint = Netinkamas sekos „{ $attribute }“.

select-from-sequence-coprime-not-numbers = coprime nepaisoma, nes renkami ne skaičiai

select-from-sequence-coprime-with-exclude-combinations = coprime nepaisoma, nes nurodytas excludeCombinations

## Resolving a `target`

target-not-found = Netinkamas `<{ $source }>` target: taikinys nerastas.

target-state-variable-not-found = Netinkamas `<{ $source }>` target: `<{ $component }>` neturi būsenos kintamojo pavadinimu „{ $property }“.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` kintamieji turi skirtis nuo nepriklausomo kintamojo.

ode-system-duplicate-variable-names = Negalima apibrėžti DL dešiniųjų pusių su pasikartojančiais priklausomų kintamųjų vardais.

ode-system-rhs-function-error = Negalima apibrėžti DL dešiniosios pusės. Klaida kuriant mathjs funkciją.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Negalima apibrėžti kampo tarp { $count } tiesių

angle-invalid-through-point = Netinkamas taškas `<angle>` atribute through

parabola-vertex-too-many-points = Parabolė su nurodyta viršūne per daugiau nei 1 tašką nėra įgyvendinta.

parabola-too-many-points = Parabolė per daugiau nei 3 taškus nėra įgyvendinta.

intersection-too-many-items = Daugiau nei dviejų objektų sankirta nėra įgyvendinta

## Other math components

ionic-compound-not-two-ions = Joniniai junginiai, išskyrus sudarytus iš dviejų jonų, nėra įgyvendinti.

ionic-compound-needs-cation-and-anion = Joniniai junginiai įgyvendinti tik vienam katijonui ir vienam anijonui.

solve-equations-cannot-evaluate = Negalima išspręsti lygties, nes jos nepavyko apskaičiuoti: { $equation }

math-operators-operand-number-required = Norint išgauti matematinį operandą, reikia nurodyti operandNumber.

eigen-decomposition-failed = Nepavyko apskaičiuoti matricos tikrinių reikšmių

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parametras { $parameters } šablone nepasitaiko, todėl visada atitiks tuščią vietą.
       *[other] `<matchesPattern>`: parametrai { $parameters } šablone nepasitaiko, todėl visada atitiks tuščią vietą.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: nepavyko suprasti grid="{ $grid }". Reikšmė turi būti none, medium, dense arba du teigiami skaičiai, atskirti tarpu, pavyzdžiui grid="1 0.5". Tinklelis nebraižomas.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" prefigure atvaizdiklyje nepalaikoma; naudojama dešiniosios padėties elgsena.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" prefigure atvaizdiklyje nepalaikoma; naudojama viršutinės padėties elgsena.

prefigure-invalid-axis-bounds = `<graph>`: netinkamos ašių ribos konvertuojant į prefigure; naudojamas numatytasis bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: netinkamas plotis konvertuojant į prefigure; naudojamas numatytasis diagramos plotis 425.

prefigure-invalid-aspect-ratio = `<graph>`: netinkamas aspectRatio konvertuojant į prefigure; naudojamas numatytasis kraštinių santykis 1.

prefigure-grid-spacing-too-fine = `<graph>`: tinklelio žingsnis per smulkus ašių riboms; prefigure atvaizdiklyje tinklelis praleidžiamas.

prefigure-annotations-not-rendered = `<graph>`: ne PreFigure atvaizdiklyje anotacijos nebraižomos.

multiple-annotations-children = `<graph>` rasta keletas dukterinių `<annotations>`; visų, išskyrus paskutinį, nepaisoma.

## Referring to other components

copy-unrecognized-component-type = Negalima išplėsti ar kopijuoti neatpažinto komponento tipo: { $type }.

copy-prop-not-found = Savybė { $property } nerasta { $component } tipo komponente

collect-no-source = collect šaltinis nerastas.

collect-invalid-component-type = Negalima rinkti `<{ $component }>` tipo komponentų, nes tai netinkamas komponento tipas.

reference-index-unavailable = Negalima nurodyti indekso `{ $reference }`

## `<callAction>`

component-action-unavailable = Negalima iškviesti { $action } komponente `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Duomenų forma netinkama. Eilučių ilgiai nevienodi. Rasta componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Duomenyse yra pasikartojančių stulpelių vardų. Rasta componentIdx :{ $componentIdx }

data-frame-missing-column-name = Duomenims trūksta stulpelio vardo. Rasta componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Šio atsakymo award remiasi paties answer žymos pateiktu atsakymu, o tai lems netikėtą elgseną.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` nustatymas `<answer>` viduje konteinerio su `sectionWideCheckWork` neveikia, nes bandymų skaičių lemia konteineris. Nustatykite `maxNumAttempts` konteineriui.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` nustatymas konteineriui su `sectionWideCheckWork`, kuris pats yra kitame konteineryje su `sectionWideCheckWork`, neveikia, nes bandymų skaičių lemia išorinis konteineris. Nustatykite `maxNumAttempts` išoriniam konteineriui.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Atributas { $attributes } neveiks be nustatyto symbolicEquality.
       *[other] Atributai { $attributes } neveiks be nustatyto symbolicEquality.
    }

answer-invalid-type = Netinkamas answer tipas: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Komponentas `<{ $component }>` neturi vardo, todėl jo negalima naudoti kaip modulio atributo

module-attribute-name-already-defined = Komponento `<{ $component } name="{ $name }">` negalima naudoti kaip modulio atributo, nes komponento tipas `<module>` jau turi apibrėžtą atributą „{ $name }“.

conditional-content-condition-ignored = Atributo `condition` nepaisoma `<conditionalContent>` komponente su dukteriniais case arba else.

slider-markers-type-mismatch = Žymeklių tipas neatitinka slankiklio tipo.

pretzel-problem-needs-statement-and-answer = Netinkamas pretzel: kiekvienas `<problem>` turi turėti vieną `<statement>` ir vieną `<answer>`.

pretzel-circuit-first-problem-distractor = Netinkamas pretzel: esant mode="circuit", pirmasis `<problem>` negali būti klaidinantis.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Netinkama reikšmė { $values } atributui `{ $attribute }`; jos nepaisoma.
       *[other] Netinkamos reikšmės { $values } atributui `{ $attribute }`; jų nepaisoma.
    }

attribute-must-be-references = Netinkama reikšmė `{ $value }` atributui `{ $attribute }`. Atributą turi sudaryti nuorodos, prasidedančios `$`.

math-input-invalid-function-names = <mathInput>: netinkamų funkcijų vardų atribute { $attribute } nepaisyta: { $names }. Rodoma kiekvieno vardo dalis turi būti bent 2 ženklų (raidės arba brūkšneliai); po jos gali eiti nebūtina priesaga `|<mathspeak alternatyva>`.

## Building components from the source

component-type-invalid = Netinkamas komponento tipas: `<{ $componentType }>`

attribute-repeated = Atributo { $attribute } negalima kartoti.

attribute-invalid-for-component = Netinkamas atributas „{ $attribute }“ `<{ $componentType }>` tipo komponentui.

## Style definition contrast

style-definition-insufficient-contrast =
    Stiliaus apibrėžimo { $styleNumber } kontrastas nepakankamas { $context ->
        [text-on-background] teksto spalvai fono spalvos atžvilgiu
        [high-contrast] didelio kontrasto spalvai drobės atžvilgiu
        [line] linijų spalvai drobės atžvilgiu
        [marker] žymeklių spalvai drobės atžvilgiu
       *[text-on-canvas] teksto spalvai drobės atžvilgiu
    }{ $mode ->
        [dark] { " (tamsi tema)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; reikia bent { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Nors stiliaus apibrėžime { $styleNumber } nurodytos spalvos šviesiai temai turi pakankamą kontrastą, iš jų išvestos tamsios temos spalvos duoda nepakankamą teksto kontrastą fono atžvilgiu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; reikia bent { $threshold }:1). { $suggestion ->
        [available] Kad kontrastas tamsioje temoje pakaktų, arba padidinkite kontrastą šviesioje temoje (pavyzdžiui { $lightAttribute }="{ $lightColor }"), arba pakeiskite tamsios temos spalvą (pavyzdžiui { $darkAttribute }="{ $darkColor }").
       *[none] Kad kontrastas tamsioje temoje pakaktų, padidinkite kontrastą šviesioje temoje arba pakeiskite išvestas spalvas per textColorDarkMode ir (arba) backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Nors stiliaus apibrėžime { $styleNumber } nurodyta teksto spalva šviesiai temai turi pakankamą kontrastą, iš jos išvesta tamsios temos teksto spalva duoda nepakankamą kontrastą drobės atžvilgiu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; reikia bent { $threshold }:1). { $suggestion ->
        [available] Kad kontrastas tamsioje temoje pakaktų, arba padidinkite kontrastą šviesioje temoje (pavyzdžiui textColor="{ $lightColor }"), arba pakeiskite tamsios temos spalvą (pavyzdžiui textColorDarkMode="{ $darkColor }").
       *[none] Kad kontrastas tamsioje temoje pakaktų, padidinkite kontrastą šviesioje temoje arba pakeiskite išvestą spalvą per textColorDarkMode.
    }

section-multiple-style-palettes = Skyrius gali pasirinkti tik vieną <stylePalette>; naudojama paskutinė.

## Unique variants

variant-num-to-select-not-non-negative-integer = negalima nustatyti { $component } unikalių variantų, nes numToSelect nėra neneigiamas sveikasis skaičius.

variant-num-to-select-not-constant-number = negalima nustatyti { $component } unikalių variantų, nes numToSelect nėra pastovus skaičius.

variant-with-replacement-not-constant-boolean = negalima nustatyti { $component } unikalių variantų, nes withReplacement nėra pastovi loginė reikšmė.

variant-select-weight-disables-unique = Unikalūs select variantai išjungiami, jei kuri nors galimybė turi nurodytą selectWeight arba selectForVariants

variant-coprime-undetermined = negalima nustatyti { $component } unikalių variantų, nes neįmanoma nustatyti, kad coprime visada yra netiesa.

variant-attribute-not-constant = negalima nustatyti { $component } unikalių variantų, nes { $attribute } nėra konstanta.

variant-attribute-not-number = negalima nustatyti { $component } unikalių variantų, nes { $attribute } nėra skaičius.

variant-attribute-wrong-type-for-sequence =
    negalima nustatyti { $type } tipo { $component } unikalių variantų, nes { $attribute } nėra { $expected ->
        [letters-combination] raidžių derinys
        [math-expression] tinkama matematinė išraiška
        [integer] sveikasis skaičius
       *[number] skaičius
    }.

variant-length-not-integer = negalima nustatyti { $component } unikalių variantų, nes length nėra sveikasis skaičius.

variant-sort-not-implemented = { $component } unikalūs variantai su sort nėra įgyvendinti

variant-exclude-combinations-not-implemented = { $component } unikalūs variantai su excludeCombinations nėra įgyvendinti

variant-math-exclude-not-implemented = math tipo { $component } unikalūs variantai su exclude nėra įgyvendinti

variant-non-constant-exclude-not-implemented = { $component } unikalūs variantai su nepastoviu exclude nėra įgyvendinti

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: nepalaikoma grafiko prefigure atvaizdiklyje; palikuonis praleistas.

prefigure-descendant-invalid-geometry = { $subject }: begalinė arba nepilna geometrija; palikuonis praleistas.

prefigure-curve-label-omitted = { $subject }: žymės konvertuotuose kreivių elementuose nepalaikomos; žymė praleista.

prefigure-curve-unsupported-definition-type = { $subject }: nepalaikomas kreivės funkcijos apibrėžimo tipas „{ $definitionType }“; palikuonis praleistas.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves atributas flipFunctions nepalaikomas; palikuonis praleistas.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves palaikomos tik formule apibrėžtos dukterinės funkcijos; palikuonis praleistas.

prefigure-label-position-unsupported =
    { $subject }: nepalaikomas labelPosition „{ $labelPosition }“ { $labelKind ->
        [line-family] tiesių šeimos žymei
       *[point] taško žymei
    }; naudojamas numatytasis PreFigure lygiavimas.

prefigure-fill-style-unsupported = { $subject }: užpildo stilius „{ $fillStyle }“ PreFigure nepalaikomas; naudojamas vientisas užpildas.

prefigure-line-style-unknown = { $subject }: nežinomas linijos stilius „{ $lineStyle }“ praleistas PreFigure išvestyje.

prefigure-marker-style-mapped-to-diamond = { $subject }: žymeklio stilius „{ $markerStyle }“ susietas su PreFigure stiliumi „diamond“.

prefigure-marker-style-unsupported = { $subject }: žymeklio stilius „{ $markerStyle }“ PreFigure nepalaikomas; naudojamas numatytasis stilius.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: netinkamas `ref`; taikinio nepavyksta susieti. Anotacija praleista.

annotation-ref-multiple-targets = `<annotation>`: `ref` susietas su keliais taikiniais; naudojamas pirmasis.

annotation-ref-outside-graph = `<annotation>`: netinkamas `ref`; taikinys yra už jį apimančio grafiko ribų. Anotacija praleista.

annotation-ref-unsupported-target = `<annotation>`: netinkamas `ref`; taikinys nėra palaikomas grafinis objektas konvertuojant į prefigure. Anotacija praleista.

annotation-text-missing = `<annotation>`: `text` trūksta arba jis tuščias; išvedamas tuščias tekstas.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Aptikta ciklinė priklausomybė.
       *[other] Aptikta ciklinė priklausomybė, apimanti `<{ $componentType }>` komponentą.
    }

reference-no-referent = Nuorodai objektas nerastas: `{ $reference }`

reference-multiple-referents = Nuorodai rasti keli objektai: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Netinkamas `<{ $componentType }>` atributo { $attribute } formatas.

children-invalid = Netinkami `<{ $componentType }>` dukteriniai elementai: rasta netinkamų dukterinių elementų: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Netinkama reikšmė `{ $value }` atributui `{ $attribute }`; naudojama reikšmė `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML versija { $version } nerasta.
       *[other] DoenetML versija { $version } nerasta. Naudojama versija { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Netinkamas DoenetML: { $content }

parse-tag-missing-close-tag = Netinkamas DoenetML: žyma `{ $tag }` neturi uždarančiosios žymos. Tikėtasi savaime užsidarančios žymos arba žymos `</{ $tagName }>`.

parse-tag-error = Netinkamas DoenetML: klaida žymoje `<{ $tagName }>`

parse-attribute-missing-value = Netinkamas DoenetML: atributui `{ $attribute }`, atrodo, trūksta reikšmės.

parse-attribute-invalid = Netinkamas DoenetML: netinkamas atributas `{ $attribute }`

parse-attribute-value-invalid = Netinkamas DoenetML: netinkama atributo reikšmė `{ $value }`

parse-attribute-value-quote-mismatch = Netinkamas DoenetML: netinkama atributo reikšmė `{ $value }`. Kabutės nesutampa. Atrodo, trūksta `{ $quote }`

parse-open-tag-name-missing = Netinkamas DoenetML: rasta žyma be vardo, pavyzdžiui `<`

parse-tag-not-closed = Netinkamas DoenetML: žyma `{ $tag }` neuždaryta (atrodo, trūksta `>`).

parse-self-closing-tag-name-missing = Netinkamas DoenetML: rasta žyma be vardo `<{ $content }>`

parse-self-closing-tag-not-closed = Netinkamas DoenetML: žyma `{ $tag }` neuždaryta (atrodo, trūksta `/>`).

parse-tag-invalid-attributes = Netinkamas DoenetML: žyma `{ $tag }` netinkama. Galbūt joje klaidingi atributai.

parse-close-tag-name-missing = Netinkamas DoenetML: rasta uždaranti žyma be vardo, pavyzdžiui `</`

parse-attribute-value-unquoted = Atributų reikšmės turi būti kabutėse: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Netinkamas DoenetML: rasta uždaranti žyma `{ $tag }`, bet nėra atitinkamos atidarančios

parse-close-tag-mismatched = Netinkamas DoenetML: nesutampanti uždaranti žyma. Tikėtasi `</{ $expected }>`. Rasta `{ $found }`

parser-node-unconvertible = Nepavyko konvertuoti mazgo { $node } į Dast mazgą.

## Names

name-attribute-invalid =
    Netinkamas atributas name='{ $name }'. { $reason ->
        [characters] Varduose gali būti tik raidės, skaitmenys, pabraukimai arba brūkšneliai.
       *[start] Vardai turi prasidėti raide.
    }

component-name-invalid-start = Netinkamas komponento vardas „{ $name }“. Vardai turi prasidėti raide.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched tipo answer turi turėti atributą video

answer-video-watched-video-not-reference = videoWatched tipo answer atributas video turi būti nuoroda

answer-name-not-single-text = answer atributas name turi turėti lygiai vieną tekstinį dukterinį elementą

## Referencing another document

external-doenetml-recursion-limit = Nepavyko gauti išorinio DoenetML dėl per daug rekursijos lygių. Ar nėra ciklinės nuorodos?

external-doenetml-unavailable = Nepavyko gauti DoenetML iš { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Iš { $attribute }="{ $uri }" gautas netinkamas DoenetML: jis neatitiko komponento tipo „{ $componentType }“

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atributas `{ $from }` nebenaudotinas; naudokite `{ $to }`.
       *[other] [deprecation] `<{ $component }>` atributas `{ $from }` nebenaudotinas; naudokite `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atributas `{ $from }` nebenaudotinas ir jo nepaisoma, nes nurodytas ir `{ $to }`.
       *[other] [deprecation] `<{ $component }>` atributas `{ $from }` nebenaudotinas ir jo nepaisoma, nes nurodytas ir `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` atributas `{ $attribute }` nebenaudotinas ir jo nepaisoma.


## Language coverage

pluralize-english-only = `<pluralize>` moka daryti daugiskaitą tik angliškai, todėl { $locale } kalba parašytame dokumente jo tekstas lieka nepakeistas. Daugiskaitos formą užrašykite patys arba nurodykite ją atributu `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elementas `<{ $tag }>` nėra atpažįstamas Doenet elementas.

schema-element-not-allowed-at-root = Elementas `<{ $tag }>` neleidžiamas dokumento šaknyje.

schema-element-not-allowed-inside = Elementas `<{ $tag }>` neleidžiamas `<{ $parent }>` viduje.

schema-attribute-unrecognized = Elementas `<{ $tag }>` neturi atributo, vadinamo `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Elemento `<{ $tag }>` atributas `{ $attribute }` turi būti sąrašas, kurio kiekvienas narys yra vienas iš: { $allowed }
       *[other] Elemento `<{ $tag }>` atributas `{ $attribute }` turi būti vienas iš: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Netinkamas select varianto vardas. Varianto vardas { $variantName } pasitaiko { $numOptions } galimybėse, o pasirinkti reikia { $numToSelect }.

select-variant-name-without-options = select nurodyti variantai, bet nenurodyta nė viena galimybė galimam varianto vardui: { $variantName }.

select-variant-name-not-possible = select nurodytas varianto vardas { $variantName } nėra galimas varianto vardas.

select-too-few-options = Negalima pasirinkti { $numToSelect } komponentų vien iš { $numOptions }.

select-from-sequence-too-few-values = Negalima pasirinkti { $numToSelect } reikšmių iš { $length } ilgio sekos.

select-from-sequence-indices-count-mismatch = select nurodytų indeksų skaičius turi atitikti renkamų skaičių

select-from-sequence-indices-not-integers = Visi select nurodyti indeksai turi būti sveikieji skaičiai

select-from-sequence-index-excluded = Nurodytas selectfromsequence indeksas buvo pašalintas

select-from-sequence-indices-excluded-combination = Nurodyti selectfromsequence indeksai sudarė pašalintą derinį

select-from-sequence-coprime-not-positive-integers = Negalima rinkti tarpusavyje pirminių derinių, nes renkami ne teigiami sveikieji skaičiai.

select-from-sequence-coprime-common-factor = Negalima pasirinkti tarpusavyje pirminių skaičių. Visos galimos reikšmės turi bendrą daliklį. (Nurodytos "from" arba "to" reikšmės turi būti tarpusavyje pirminės su "step".)

select-from-sequence-coprime-single-number = Negalima rinkti tarpusavyje pirminių derinių iš vieno skaičiaus, nelygaus 1.

select-from-sequence-excluded-too-many-combinations = selectFromSequence pašalinta daugiau nei 70 % derinių

select-from-sequence-coprime-none-found = Nepavyko pasirinkti tarpusavyje pirminių skaičių. Visos galimos reikšmės turi bendrą daliklį.

select-from-sequence-too-few-unique-values = Negalima pasirinkti { $numToSelect } skirtingų reikšmių iš { $numPossibleValues } ilgio sekos

select-prime-numbers-too-few-values = Negalima pasirinkti { $numToSelect } reikšmių iš { $numValues } ilgio pirminių skaičių sąrašo

select-prime-numbers-values-count-mismatch = select nurodytų reikšmių skaičius turi atitikti renkamų skaičių

select-prime-numbers-values-not-prime = Visos select prime number nurodytos reikšmės turi būti pirminių skaičių sąraše

select-prime-numbers-values-excluded-combination = Nurodytos selectPrimeNumbers reikšmės sudarė pašalintą derinį

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers pašalinta daugiau nei 70 % derinių

select-random-combination-fluke = Dėl nepaprastai mažai tikėtino atsitiktinumo nepavyko pasirinkti atsitiktinių reikšmių derinio

select-random-value-fluke = Dėl nepaprastai mažai tikėtino atsitiktinumo nepavyko pasirinkti atsitiktinės reikšmės
