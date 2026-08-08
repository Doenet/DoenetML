# Estonian diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Estonian counts in the same two categories English does, so every selection
# below keeps both branches — but a noun after a number stands in the partitive
# singular, so the two branches often differ only in the verb.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } eiratakse, kui on antud mõlemad otspunktid
       *[other] { $attributes } eiratakse, kui on antud mõlemad otspunktid
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } eiratakse, kui on antud nii otspunkt kui ka keskpunkt
       *[other] { $attributes } eiratakse, kui on antud nii otspunkt kui ka keskpunkt
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ei mõju ilma antud keskpunktita

## `<line>`

line-points-undetermined-dimensions = Sirge läbi määramata mõõtmega punktide.

line-points-too-few-dimensions = Sirge peab läbima vähemalt kahemõõtmelisi punkte.

line-points-depend-on-variables = Sirge läbib punkte, mis sõltuvad muutujatest: { $variables }.

line-equation-invalid-format = Vigane sirge võrrandi vorming muutujates { $variable1 } ja { $variable2 }.

## `<ray>`

ray-overprescribed-through = Kiir on antud through, endpoint ja direction abil. Antud through'd eiratakse.

ray-dimension-mismatch = numDimensions ei klapi kiires.

## `<vector>`

vector-overprescribed-head = Vektor on antud head, tail ja displacement abil. Antud head'i eiratakse.

vector-dimension-mismatch = numDimensions ei klapi vektoris.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` külge ei saa tõmmata, sest sellel pole olekumuutujat nearestPoint.

constrain-to-without-nearest-point = `<{ $component }>` külge ei saa piirata, sest sellel pole olekumuutujat nearestPoint.

constrain-to-interior-without-nearest-point = `<{ $component }>` sisemuse külge ei saa piirata, sest sellel pole olekumuutujat nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition't eiratakse mitte-reasisese choiceInput'i puhul

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput'ile antud indekseid eiratakse: nende arv ei vasta alluvate choice'ide arvule.

pretzel-indices-count-mismatch = problem'ile antud indekseid eiratakse: nende arv ei vasta alluvate problem'ite arvule.

shuffle-indices-count-mismatch = shuffle'ile antud indekseid eiratakse: nende arv ei vasta komponentide arvule.

indices-ignored-out-of-range = { $component }'ile antud indekseid eiratakse: mõned jäävad vahemikust välja.

pretzel-indices-repeated = pretzel'ile antud indekseid eiratakse: mõned korduvad.

pretzel-circuit-first-index = pretzel'ile režiimis circuit antud indekseid eiratakse: esimene indeks peab olema 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Et `<{ $component }>` töötaks tekstiliste alluvatega, tuleb määrata atribuut `type`.

invalid-type-defaulting-to-math = Vigane tüüp { $type } komponendile { $component }. See peab olema math, text, number või boolean. Kasutatakse math'i.

string-not-valid-component-to-arrange = Sõne „{ $value }“ ei ole { $component } jaoks sobiv komponent. Seda eiratakse.

## Types and variables

invalid-type-defaulting-to-number = Vigane tüüp { $type }; tüübiks seatakse number.

invalid-variable-value = Vigane muutuja väärtus: `{ $value }`

## Variants

variant-index-must-be-number = Variandi indeks { $index } peab olema arv

variant-index-must-be-integer = Variandi indeks { $index } peab olema täisarv

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ei ole absoluutsete mõõtude jaoks teostatud. Laiused muutuvad suhtelisteks.

side-by-side-absolute-margins = `<{ $component }>` ei ole absoluutsete mõõtude jaoks teostatud. Veerised muutuvad suhtelisteks.

side-by-side-no-block-child = Vigane `<{ $component }>`: sellel peab olema vähemalt üks plokk-alluv.

## `<label>`

label-for-ignored-on-graphical = Graafilise `<label>` atribuuti `for` eiratakse.

label-for-must-resolve-to-one = `<label>` atribuut `for` peab osutama täpselt ühele komponendile.

label-for-unresolved = `<label>` atribuuti `for` ei õnnestunud komponendiga siduda.

label-for-answer-with-authored-inputs = `<label>` atribuut `for` osutab `<answer>`'ile, millel on selgelt kirjutatud sisestusväljad; osutage otse väljale.

label-for-answer-without-input = `<label>` atribuut `for` osutab `<answer>`'ile, millel pole sisestusvälja, mida sildistada.

label-for-must-reference-input-or-answer = `<label>` atribuut `for` peab osutama sisestusväljale või vastusele.

## Accessibility

accessibility-short-description-or-decorative = Ligipääsetavuse huvides peab `<{ $component }>` omama lühikirjeldust või olema märgitud kaunistuslikuks.

accessibility-video-short-description = Ligipääsetavuse huvides peab `<video>` omama lühikirjeldust.

accessibility-input-short-description-or-label = Ligipääsetavuse huvides peab `<{ $component }>` omama lühikirjeldust või silti.

accessibility-answer-input-short-description-or-label = Ligipääsetavuse huvides peab sisestusvälja loov `<answer>` omama lühikirjeldust või silti.

accessibility-short-description-contains-math = Lühikirjeldused ei tohiks sisaldada matemaatilisi komponente nagu `<{ $component }>`. Kirjutage matemaatika sõnadega välja.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } kontrast on jaotise pealkirja teksti jaoks liiga väike (tume teema) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vaja on vähemalt { $threshold }:1).
       *[other] { $colorName } kontrast on jaotise pealkirja teksti jaoks liiga väike ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vaja on vähemalt { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` läbi { $count } punkti ei ole teostatud, kui punktidel pole arvväärtusi.

circle-too-many-through-points = Ringjoont läbi rohkema kui 3 punkti ei saa arvutada.

circle-overprescribed-radius-center-points = Ringjoont antud raadiuse, keskpunkti ja punktidega ei saa arvutada.

circle-center-with-multiple-points = Ringjoont antud keskpunktiga läbi rohkema kui 1 punkti ei saa arvutada.

circle-radius-too-small = Ringjoont ei saa arvutada: kuna kahe punkti vaheline kaugus on { $distance }, on antud raadius { $radius } liiga väike.

circle-radius-with-many-points = Ringjoont läbi rohkema kui kahe punkti antud raadiusega ei saa koostada.

circle-invalid-center-or-through-points = Vigane ringjoone keskpunkt või punktid.

circle-radius-center-with-multiple-points = Antud keskpunktiga ringjoone raadiust läbi rohkema kui 1 punkti ei saa arvutada.

circle-change-radius-non-numerical = Mittearvuliste punktidega ringjoone raadiust ei saa muuta

circle-radius-with-points-non-numerical = Ringjoont läbi rohkema kui ühe punkti antud raadiusega ei saa koostada, kui arvväärtusi pole.

circle-change-center-non-numerical = Mittearvuliste punktide kaudu määratud ringjoone keskpunkti muutmine ei ole teostatud.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Funktsiooni määramispiirkonna mõõtmeid on liiga vähe. Piirkonnas on { $intervals } vahemik, funktsioonil aga { $inputs ->
            [one] { $inputs } sisend
           *[other] { $inputs } sisendit
        }.
       *[other] Funktsiooni määramispiirkonna mõõtmeid on liiga vähe. Piirkonnas on { $intervals } vahemikku, funktsioonil aga { $inputs ->
            [one] { $inputs } sisend
           *[other] { $inputs } sisendit
        }.
    }

function-domain-invalid-format = Vigane funktsiooni määramispiirkonna vorming.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Funktsiooni mittearvulist maksimumi eiratakse.
        [minimum] Funktsiooni mittearvulist miinimumi eiratakse.
        [extremum] Funktsiooni mittearvulist ekstreemumit eiratakse.
        [point] Funktsiooni mittearvulist punkti eiratakse.
        [slope] Funktsiooni mittearvulist tõusu eiratakse.
       *[other] Funktsiooni mittearvulist { $type } eiratakse.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Funktsiooni tühja maksimumi eiratakse.
        [minimum] Funktsiooni tühja miinimumi eiratakse.
        [extremum] Funktsiooni tühja ekstreemumit eiratakse.
        [point] Funktsiooni tühja punkti eiratakse.
       *[other] Funktsiooni tühja { $type } eiratakse.
    }

function-points-too-close = Funktsioon sisaldab kahte punkti, mis on teineteisele liiga lähedal. Funktsiooni ei saa määrata.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Funktsiooni iteratsioonid on võimalikud ainult siis, kui sisendite arv võrdub väljundite arvuga. Sellel funktsioonil on { $inputs } sisend ja { $outputs ->
            [one] { $outputs } väljund
           *[other] { $outputs } väljundit
        }.
       *[other] Funktsiooni iteratsioonid on võimalikud ainult siis, kui sisendite arv võrdub väljundite arvuga. Sellel funktsioonil on { $inputs } sisendit ja { $outputs ->
            [one] { $outputs } väljund
           *[other] { $outputs } väljundit
        }.
    }

## `<sequence>`

sequence-invalid-length = Vigane jada pikkus. See peab olema mittenegatiivne täisarv.

sequence-invalid-step = Vigane jada samm. { $type } tüüpi jada puhul peab see olema arv.

sequence-invalid-endpoint-number = Vigane arvjada „{ $attribute }“. See peab olema arv.

sequence-invalid-endpoint-letters = Vigane tähejada „{ $attribute }“. See peab olema tähtede kombinatsioon.

sequence-invalid-endpoint = Vigane jada „{ $attribute }“.

select-from-sequence-coprime-not-numbers = coprime't eiratakse, sest ei valita arve

select-from-sequence-coprime-with-exclude-combinations = coprime't eiratakse, sest on määratud excludeCombinations

## Resolving a `target`

target-not-found = Vigane `<{ $source }>` target: sihti ei leitud.

target-state-variable-not-found = Vigane `<{ $source }>` target: `<{ $component }>` ei oma olekumuutujat nimega „{ $property }“.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` muutujad peavad erinema sõltumatust muutujast.

ode-system-duplicate-variable-names = Diferentsiaalvõrrandite paremaid pooli ei saa määrata korduvate sõltuvate muutujate nimedega.

ode-system-rhs-function-error = Diferentsiaalvõrrandi paremat poolt ei saa määrata. Viga mathjs-funktsiooni loomisel.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Nurka { $count } sirge vahel ei saa määrata

angle-invalid-through-point = Vigane punkt `<angle>` atribuudis through

parabola-vertex-too-many-points = Antud tipuga parabool läbi rohkema kui 1 punkti ei ole teostatud.

parabola-too-many-points = Parabool läbi rohkema kui 3 punkti ei ole teostatud.

intersection-too-many-items = Rohkema kui kahe objekti lõige ei ole teostatud

## Other math components

ionic-compound-not-two-ions = Ioonseid ühendeid peale kahest ioonist koosnevate ei ole teostatud.

ionic-compound-needs-cation-and-anion = Ioonsed ühendid on teostatud ainult ühe katiooni ja ühe aniooni jaoks.

solve-equations-cannot-evaluate = Võrrandit ei saa lahendada, sest seda ei õnnestunud arvutada: { $equation }

math-operators-operand-number-required = Matemaatilise operandi eraldamiseks tuleb määrata operandNumber.

eigen-decomposition-failed = Maatriksi omaväärtusi ei õnnestunud arvutada

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameeter { $parameters } mustris ei esine, seega sobib see alati tühjaga.
       *[other] `<matchesPattern>`: parameetrid { $parameters } mustris ei esine, seega sobivad need alati tühjaga.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" ei ole tõlgendatav. Väärtus peab olema none, medium, dense või kaks tühikuga eraldatud positiivset arvu, näiteks grid="1 0.5". Ruudustikku ei joonistata.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ei ole prefigure kuvajas toetatud; kasutatakse parempoolse asendi käitumist.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ei ole prefigure kuvajas toetatud; kasutatakse ülemise asendi käitumist.

prefigure-invalid-axis-bounds = `<graph>`: vigased telgede piirid prefigure'iks teisendamisel; kasutatakse vaikimisi bbox'i (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: vigane laius prefigure'iks teisendamisel; kasutatakse vaikimisi diagrammi laiust 425.

prefigure-invalid-aspect-ratio = `<graph>`: vigane aspectRatio prefigure'iks teisendamisel; kasutatakse vaikimisi külgede suhet 1.

prefigure-grid-spacing-too-fine = `<graph>`: ruudustiku samm on telgede piiride jaoks liiga peen; prefigure kuvajas jäetakse ruudustik ära.

prefigure-annotations-not-rendered = `<graph>`: väljaspool PreFigure kuvajat märkusi ei joonistata.

multiple-annotations-children = `<graph>`'is leiti mitu alluvat `<annotations>`; kõiki peale viimase eiratakse.

## Referring to other components

copy-unrecognized-component-type = Tundmatut komponenditüüpi ei saa laiendada ega kopeerida: { $type }.

copy-prop-not-found = Omadust { $property } ei leitud { $component } tüüpi komponendist

collect-no-source = collect'ile ei leitud allikat.

collect-invalid-component-type = `<{ $component }>` tüüpi komponente ei saa koguda, sest see on vigane komponenditüüp.

reference-index-unavailable = Indeksile `{ $reference }` ei saa viidata

## `<callAction>`

component-action-unavailable = Komponendis `{ $reference }` ei saa kutsuda { $action }

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Andmete kuju on vigane. Ridade pikkused erinevad. Leitud componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Andmetes on korduvaid veerunimesid. Leitud componentIdx :{ $componentIdx }

data-frame-missing-column-name = Andmetel puudub veerunimi. Leitud componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Selle vastuse award tugineb answer-sildi enda saadetud vastusele, mis viib ootamatu käitumiseni.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` määramine `<answer>`'ile `sectionWideCheckWork`'iga konteineri sees ei mõju, sest katsete arvu määrab konteiner. Määrake `maxNumAttempts` konteinerile.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` määramine `sectionWideCheckWork`'iga konteinerile, mis ise on teise `sectionWideCheckWork`'iga konteineri sees, ei mõju, sest katsete arvu määrab välimine konteiner. Määrake `maxNumAttempts` välimisele konteinerile.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Atribuut { $attributes } ei mõju ilma määratud symbolicEquality'ta.
       *[other] Atribuudid { $attributes } ei mõju ilma määratud symbolicEquality'ta.
    }

answer-invalid-type = Vigane answer'i tüüp: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Komponendil `<{ $component }>` pole nime, seega ei saa seda mooduli atribuudina kasutada

module-attribute-name-already-defined = Komponenti `<{ $component } name="{ $name }">` ei saa mooduli atribuudina kasutada, sest komponenditüübil `<module>` on juba määratud atribuut „{ $name }“.

conditional-content-condition-ignored = Atribuuti `condition` eiratakse `<conditionalContent>` komponendil, millel on alluvad case või else.

slider-markers-type-mismatch = Markerite tüüp ei vasta liuguri tüübile.

pretzel-problem-needs-statement-and-answer = Vigane pretzel: iga `<problem>` peab sisaldama ühte `<statement>`'i ja ühte `<answer>`'it.

pretzel-circuit-first-problem-distractor = Vigane pretzel: režiimis mode="circuit" ei saa esimene `<problem>` olla eksitaja.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Vigane väärtus { $values } atribuudile `{ $attribute }`; seda eiratakse.
       *[other] Vigased väärtused { $values } atribuudile `{ $attribute }`; neid eiratakse.
    }

attribute-must-be-references = Vigane väärtus `{ $value }` atribuudile `{ $attribute }`. Atribuut peab koosnema viidetest, mis algavad märgiga `$`.

math-input-invalid-function-names = <mathInput>: vigaseid funktsiooninimesid atribuudis { $attribute } eirati: { $names }. Iga nime kuvatav osa peab olema vähemalt 2 märki (tähed või sidekriipsud); sellele võib järgneda valikuline järelliide `|<mathspeak alternatiiv>`.

## Building components from the source

component-type-invalid = Vigane komponenditüüp: `<{ $componentType }>`

attribute-repeated = Atribuuti { $attribute } ei saa korrata.

attribute-invalid-for-component = Vigane atribuut „{ $attribute }“ `<{ $componentType }>` tüüpi komponendile.

## Style definition contrast

style-definition-insufficient-contrast =
    Stiilimääratlusel { $styleNumber } on liiga väike kontrast { $context ->
        [text-on-background] teksti värvil tausta värvi suhtes
        [high-contrast] kõrge kontrastiga värvil lõuendi suhtes
        [line] joonte värvil lõuendi suhtes
        [marker] markerite värvil lõuendi suhtes
       *[text-on-canvas] teksti värvil lõuendi suhtes
    }{ $mode ->
        [dark] { " (tume teema)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vaja on vähemalt { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Kuigi stiilimääratluses { $styleNumber } antud värvidel on heleda teema jaoks piisav kontrast, annavad neist tuletatud tumeda teema värvid teksti ja tausta vahel liiga väikese kontrasti ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vaja on vähemalt { $threshold }:1). { $suggestion ->
        [available] Piisava kontrasti saavutamiseks tumedas teemas kas suurendage kontrasti heledas teemas (näiteks { $lightAttribute }="{ $lightColor }") või asendage tumeda teema värv (näiteks { $darkAttribute }="{ $darkColor }").
       *[none] Piisava kontrasti saavutamiseks tumedas teemas suurendage kontrasti heledas teemas või asendage tuletatud värvid textColorDarkMode'i ja/või backgroundColorDarkMode'iga.
    }

style-definition-dark-mode-text-canvas-contrast =
    Kuigi stiilimääratluses { $styleNumber } antud teksti värvil on heleda teema jaoks piisav kontrast, annab sellest tuletatud tumeda teema teksti värv lõuendi suhtes liiga väikese kontrasti ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vaja on vähemalt { $threshold }:1). { $suggestion ->
        [available] Piisava kontrasti saavutamiseks tumedas teemas kas suurendage kontrasti heledas teemas (näiteks textColor="{ $lightColor }") või asendage tumeda teema värv (näiteks textColorDarkMode="{ $darkColor }").
       *[none] Piisava kontrasti saavutamiseks tumedas teemas suurendage kontrasti heledas teemas või asendage tuletatud värv textColorDarkMode'iga.
    }

section-multiple-style-palettes = Jaotis saab valida ainult ühe <stylePalette>; kasutatakse viimast.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } unikaalseid variante ei saa määrata, sest numToSelect ei ole mittenegatiivne täisarv.

variant-num-to-select-not-constant-number = { $component } unikaalseid variante ei saa määrata, sest numToSelect ei ole püsiv arv.

variant-with-replacement-not-constant-boolean = { $component } unikaalseid variante ei saa määrata, sest withReplacement ei ole püsiv tõeväärtus.

variant-select-weight-disables-unique = select'i unikaalsed variandid on välja lülitatud, kui mõnel valikul on määratud selectWeight või selectForVariants

variant-coprime-undetermined = { $component } unikaalseid variante ei saa määrata, sest ei saa tuvastada, et coprime on alati väär.

variant-attribute-not-constant = { $component } unikaalseid variante ei saa määrata, sest { $attribute } ei ole konstant.

variant-attribute-not-number = { $component } unikaalseid variante ei saa määrata, sest { $attribute } ei ole arv.

variant-attribute-wrong-type-for-sequence =
    { $type } tüüpi { $component } unikaalseid variante ei saa määrata, sest { $attribute } ei ole { $expected ->
        [letters-combination] tähtede kombinatsioon
        [math-expression] sobiv matemaatiline avaldis
        [integer] täisarv
       *[number] arv
    }.

variant-length-not-integer = { $component } unikaalseid variante ei saa määrata, sest length ei ole täisarv.

variant-sort-not-implemented = { $component } unikaalsed variandid sort'iga ei ole teostatud

variant-exclude-combinations-not-implemented = { $component } unikaalsed variandid excludeCombinations'iga ei ole teostatud

variant-math-exclude-not-implemented = math tüüpi { $component } unikaalsed variandid exclude'iga ei ole teostatud

variant-non-constant-exclude-not-implemented = { $component } unikaalsed variandid mittepüsiva exclude'iga ei ole teostatud

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ei ole graafiku prefigure kuvajas toetatud; järglane jäeti vahele.

prefigure-descendant-invalid-geometry = { $subject }: lõpmatu või puudulik geomeetria; järglane jäeti vahele.

prefigure-curve-label-omitted = { $subject }: sildid ei ole teisendatud kõveraelementidel toetatud; silt jäeti ära.

prefigure-curve-unsupported-definition-type = { $subject }: toetamata kõverfunktsiooni määratluse tüüp „{ $definitionType }“; järglane jäeti vahele.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves atribuut flipFunctions ei ole toetatud; järglane jäeti vahele.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves toetab ainult valemiga määratud alluvaid funktsioone; järglane jäeti vahele.

prefigure-label-position-unsupported =
    { $subject }: toetamata labelPosition „{ $labelPosition }“ { $labelKind ->
        [line-family] sirgete pere sildi jaoks
       *[point] punkti sildi jaoks
    }; kasutatakse PreFigure vaikimisi joondust.

prefigure-fill-style-unsupported = { $subject }: täitestiil „{ $fillStyle }“ ei ole PreFigure's toetatud; kasutatakse ühtlast täidet.

prefigure-line-style-unknown = { $subject }: tundmatu joonestiil „{ $lineStyle }“ jäeti PreFigure väljundist välja.

prefigure-marker-style-mapped-to-diamond = { $subject }: markeristiil „{ $markerStyle }“ seoti PreFigure stiiliga „diamond“.

prefigure-marker-style-unsupported = { $subject }: markeristiil „{ $markerStyle }“ ei ole PreFigure's toetatud; kasutatakse vaikimisi stiili.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: vigane `ref`; sihti ei saa siduda. Märkus jäeti ära.

annotation-ref-multiple-targets = `<annotation>`: `ref` sidus mitu sihti; kasutatakse esimest.

annotation-ref-outside-graph = `<annotation>`: vigane `ref`; siht on seda sisaldavast graafikust väljas. Märkus jäeti ära.

annotation-ref-unsupported-target = `<annotation>`: vigane `ref`; siht ei ole prefigure'iks teisendamisel toetatud graafiline objekt. Märkus jäeti ära.

annotation-text-missing = `<annotation>`: `text` puudub või on tühi; väljastatakse tühi tekst.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Tuvastati ringsõltuvus.
       *[other] Tuvastati ringsõltuvus, mis hõlmab komponenti `<{ $componentType }>`.
    }

reference-no-referent = Viitele ei leitud objekti: `{ $reference }`

reference-multiple-referents = Viitele leiti mitu objekti: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Vigane `<{ $componentType }>` atribuudi { $attribute } vorming.

children-invalid = Vigased alluvad `<{ $componentType }>`'i jaoks: leiti vigaseid alluvaid: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Vigane väärtus `{ $value }` atribuudile `{ $attribute }`; kasutatakse väärtust `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML versiooni { $version } ei leitud.
       *[other] DoenetML versiooni { $version } ei leitud. Kasutatakse versiooni { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Vigane DoenetML: { $content }

parse-tag-missing-close-tag = Vigane DoenetML: sildil `{ $tag }` puudub sulgev silt. Oodati isesulguvat silti või silti `</{ $tagName }>`.

parse-tag-error = Vigane DoenetML: viga sildis `<{ $tagName }>`

parse-attribute-missing-value = Vigane DoenetML: atribuudil `{ $attribute }` näib puuduvat väärtus.

parse-attribute-invalid = Vigane DoenetML: vigane atribuut `{ $attribute }`

parse-attribute-value-invalid = Vigane DoenetML: vigane atribuudi väärtus `{ $value }`

parse-attribute-value-quote-mismatch = Vigane DoenetML: vigane atribuudi väärtus `{ $value }`. Jutumärgid ei klapi. Näib puuduvat `{ $quote }`

parse-open-tag-name-missing = Vigane DoenetML: leiti nimeta silt, näiteks `<`

parse-tag-not-closed = Vigane DoenetML: silt `{ $tag }` ei ole suletud (näib puuduvat `>`).

parse-self-closing-tag-name-missing = Vigane DoenetML: leiti nimeta silt `<{ $content }>`

parse-self-closing-tag-not-closed = Vigane DoenetML: silt `{ $tag }` ei ole suletud (näib puuduvat `/>`).

parse-tag-invalid-attributes = Vigane DoenetML: silt `{ $tag }` ei ole sobiv. Sellel võivad olla valed atribuudid.

parse-close-tag-name-missing = Vigane DoenetML: leiti nimeta sulgev silt, näiteks `</`

parse-attribute-value-unquoted = Atribuutide väärtused peavad olema jutumärkides: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Vigane DoenetML: leiti sulgev silt `{ $tag }`, kuid vastavat avavat silti pole

parse-close-tag-mismatched = Vigane DoenetML: mittevastav sulgev silt. Oodati `</{ $expected }>`. Leiti `{ $found }`

parser-node-unconvertible = Sõlme { $node } ei õnnestunud teisendada Dast-sõlmeks.

## Names

name-attribute-invalid =
    Vigane atribuut name='{ $name }'. { $reason ->
        [characters] Nimed võivad sisaldada ainult tähti, numbreid, alakriipse või sidekriipse.
       *[start] Nimed peavad algama tähega.
    }

component-name-invalid-start = Vigane komponendi nimi „{ $name }“. Nimed peavad algama tähega.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched tüüpi answer'il peab olema atribuut video

answer-video-watched-video-not-reference = videoWatched tüüpi answer'i atribuut video peab olema viide

answer-name-not-single-text = answer'i atribuudil name peab olema täpselt üks tekstiline alluv

## Referencing another document

external-doenetml-recursion-limit = Välist DoenetML'i ei õnnestunud hankida liiga paljude rekursioonitasemete tõttu. Ega pole ringviidet?

external-doenetml-unavailable = DoenetML'i ei õnnestunud hankida aadressilt { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Aadressilt { $attribute }="{ $uri }" saadi vigane DoenetML: see ei vastanud komponenditüübile „{ $componentType }“

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribuut `{ $from }` on aegunud; kasutage `{ $to }`.
       *[other] [deprecation] `<{ $component }>` atribuut `{ $from }` on aegunud; kasutage `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribuut `{ $from }` on aegunud ja seda eiratakse, sest määratud on ka `{ $to }`.
       *[other] [deprecation] `<{ $component }>` atribuut `{ $from }` on aegunud ja seda eiratakse, sest määratud on ka `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` atribuut `{ $attribute }` on aegunud ja seda eiratakse.


## Language coverage

pluralize-english-only = `<pluralize>` oskab mitmust moodustada ainult inglise keeles, seega { $locale } keeles dokumendis jääb selle tekst muutmata. Kirjutage mitmusevorm ise või määrake see atribuudiga `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Element `<{ $tag }>` ei ole tuntud Doeneti element.

schema-element-not-allowed-at-root = Element `<{ $tag }>` ei ole dokumendi juurtasemel lubatud.

schema-element-not-allowed-inside = Element `<{ $tag }>` ei ole `<{ $parent }>` sees lubatud.

schema-attribute-unrecognized = Elemendil `<{ $tag }>` pole atribuuti nimega `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Elemendi `<{ $tag }>` atribuut `{ $attribute }` peab olema loend, mille iga liige on üks järgmistest: { $allowed }
       *[other] Elemendi `<{ $tag }>` atribuut `{ $attribute }` peab olema üks järgmistest: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Vigane select'i variandi nimi. Variandi nimi { $variantName } esineb { $numOptions } valikus, valida tuleb aga { $numToSelect }.

select-variant-name-without-options = select'ile on määratud variandid, kuid ühtki valikut võimaliku variandi nime jaoks pole: { $variantName }.

select-variant-name-not-possible = select'ile määratud variandi nimi { $variantName } ei ole võimalik variandi nimi.

select-too-few-options = Ei saa valida { $numToSelect } komponenti ainult { $numOptions } hulgast.

select-from-sequence-too-few-values = Ei saa valida { $numToSelect } väärtust { $length } pikkusest jadast.

select-from-sequence-indices-count-mismatch = select'ile määratud indeksite arv peab vastama valitavate arvule

select-from-sequence-indices-not-integers = Kõik select'ile määratud indeksid peavad olema täisarvud

select-from-sequence-index-excluded = Määratud selectfromsequence'i indeks oli välja jäetud

select-from-sequence-indices-excluded-combination = Määratud selectfromsequence'i indeksid moodustasid väljajäetud kombinatsiooni

select-from-sequence-coprime-not-positive-integers = Ühistegurita kombinatsioone ei saa valida, sest ei valita positiivseid täisarve.

select-from-sequence-coprime-common-factor = Ühistegurita arve ei saa valida. Kõigil võimalikel väärtustel on ühine tegur. (Määratud "from" või "to" väärtused peavad olema "step"'iga ühistegurita.)

select-from-sequence-coprime-single-number = Ühistegurita kombinatsioone ei saa valida ühest arvust, mis pole 1.

select-from-sequence-excluded-too-many-combinations = selectFromSequence'is jäeti välja üle 70 % kombinatsioonidest

select-from-sequence-coprime-none-found = Ühistegurita arve ei õnnestunud valida. Kõigil võimalikel väärtustel on ühine tegur.

select-from-sequence-too-few-unique-values = Ei saa valida { $numToSelect } erinevat väärtust { $numPossibleValues } pikkusest jadast

select-prime-numbers-too-few-values = Ei saa valida { $numToSelect } väärtust { $numValues } pikkusest algarvude loendist

select-prime-numbers-values-count-mismatch = select'ile määratud väärtuste arv peab vastama valitavate arvule

select-prime-numbers-values-not-prime = Kõik select prime number'ile määratud väärtused peavad olema algarvude loendis

select-prime-numbers-values-excluded-combination = Määratud selectPrimeNumbers'i väärtused moodustasid väljajäetud kombinatsiooni

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers'is jäeti välja üle 70 % kombinatsioonidest

select-random-combination-fluke = Äärmiselt ebatõenäolise juhuse tõttu ei õnnestunud valida juhuslike väärtuste kombinatsiooni

select-random-value-fluke = Äärmiselt ebatõenäolise juhuse tõttu ei õnnestunud valida juhuslikku väärtust
