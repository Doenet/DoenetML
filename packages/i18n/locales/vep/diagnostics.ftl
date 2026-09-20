# Veps diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the **Latin** alphabet, with ä ö ü, č š ž and the palatalization
# apostrophe. Veps is a language of the Russian Federation that is not written
# in Cyrillic: its modern orthography has been Latin since 1989, and that is
# what its schoolbooks, «Kodima» and CLDR all use.
#
# Veps is Finnic but it is not Karelian: a separate ISO 639-3 language with no
# macrolanguage over it, so neither `locales/krl` nor `locales/olo` can stand
# in for it, and neither could be respelled into it.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# The technical nouns are the Russian-mediated ones the Veps press uses:
# «komponent», «atribut», «funkcii», «indeks», «dokument», «tablic». They are
# the part of this seed a reviewer should expect to change first.
#
# After any numeral above one a Veps noun stands in the partitive singular, so
# a `{ $count -> … }` here separates two cases rather than two numbers. Both
# branches are still needed.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } jätetas homaičemata, konz kaks' loppupunktad om märitud
       *[other] { $attributes } jätetas homaičemata, konz kaks' loppupunktad om märitud
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } jätetas homaičemata, konz i loppupunkt i keskpunkt om märitud
       *[other] { $attributes } jätetas homaičemata, konz i loppupunkt i keskpunkt om märitud
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ei toimi ilma midpoint-arvota

## `<line>`

line-points-undetermined-dimensions = Suor mäneb punktoiden kal't, kudambiden mitmuz ei ole tetpas.

line-points-too-few-dimensions = Suoren pidab mända vähemba kaks'mitmaižiden punktoiden kal't.

line-points-depend-on-variables = Suor mäneb punktoiden kal't, kudambad rippuba vajehtuzespäi: { $variables }.

line-equation-invalid-format = Vär form suoren tazoiduseks vajehtuzil { $variable1 } da { $variable2 }.

## `<ray>`

ray-overprescribed-through = Pol'suor om märitud atributoil through, endpoint da direction.  Märitud through jätetas homaičemata.

ray-dimension-mismatch = numDimensions ei sätu pol'suores.

## `<vector>`

vector-overprescribed-head = Vektor om märitud atributoil head, tail da displacement.  Märitud head jätetas homaičemata.

vector-dimension-mismatch = numDimensions ei sätu vektoras.

## Attracting and constraining

attract-to-without-nearest-point = Kohtale `<{ $component }>` ei sa vedäda, sikš ku sil ei ole nearestPoint-tilvajehtust.

constrain-to-without-nearest-point = Kohtale `<{ $component }>` ei sa rajata, sikš ku sil ei ole nearestPoint-tilvajehtust.

constrain-to-interior-without-nearest-point = Kohtan `<{ $component }>` südäimehe ei sa rajata, sikš ku sil ei ole nearestPoint-tilvajehtust.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition jätetas homaičemata, konz choiceInput ei ole inline

## Ordering children by index

choice-input-indices-count-mismatch = choiceInputale märitud indeksad jätetas homaičemata, sikš ku niiden lugumär ei sätu choice-lapsiden lugumärhä.

pretzel-indices-count-mismatch = problemale märitud indeksad jätetas homaičemata, sikš ku niiden lugumär ei sätu problem-lapsiden lugumärhä.

shuffle-indices-count-mismatch = shuffle-komponentale märitud indeksad jätetas homaičemata, sikš ku niiden lugumär ei sätu komponentoiden lugumärhä.

indices-ignored-out-of-range = Kohtale { $component } märitud indeksad jätetas homaičemata, sikš ku oza niišpäi om alovusen irdpolel.

pretzel-indices-repeated = pretzelale märitud indeksad jätetas homaičemata, sikš ku oza niišpäi toštase.

pretzel-circuit-first-index = pretzelale circuit-tilas märitud indeksad jätetas homaičemata, sikš ku ezmäižen indeksan pidab olda 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Miše `<{ $component }>` radaiži znamjono-lapsiden ke, pidab märita `type`-atribut.

invalid-type-defaulting-to-math = Vär type { $type } komponentale { $component }. Sen pidab olda math, text, number vai boolean. Kävutadas arvod math.

string-not-valid-component-to-arrange = Znamjono ”{ $value }” ei sätu komponentaks kohtale { $component }. Jätetas homaičemata.

## Types and variables

invalid-type-defaulting-to-number = Vär type { $type }, typeks pandas number.

invalid-variable-value = Vajehtusen vär arv: `{ $value }`

## Variants

variant-index-must-be-number = Variantan indeksan { $index } pidab olda lugu

variant-index-must-be-integer = Variantan indeksan { $index } pidab olda kogonaine lugu

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ei ole tehtud absolutižiden mitoiden täht. Levuded pandas suhtusižikš.

side-by-side-absolute-margins = `<{ $component }>` ei ole tehtud absolutižiden mitoiden täht. Marginalad pandas suhtusižikš.

side-by-side-no-block-child = Vär `<{ $component }>`: sil pidab olda vähemba üks' blok-tazon laps'.

## `<label>`

label-for-ignored-on-graphical = Grafižen `<label>`-elementan `for`-atribut jätetas homaičemata.

label-for-must-resolve-to-one = `<label>`-elementan `for`-atributan pidab ozutada tarkas ühthe komponentaha.

label-for-unresolved = `<label>`-elementan `for`-atributad ei voitud ühtenzoitta komponentaha.

label-for-answer-with-authored-inputs = `<label>`-elementan `for`-atribut viitab `<answer>`-elementaha, kudambal oma eriži kirjutadud sirud; viita kohtha siruhu.

label-for-answer-without-input = `<label>`-elementan `for`-atribut viitab `<answer>`-elementaha, kudambal ei ole nimitadavad sirud.

label-for-must-reference-input-or-answer = `<label>`-elementan `for`-atributan pidab viitta siruhu vai answer-elementaha.

## Accessibility

accessibility-short-description-or-decorative = Sadatoiden täht `<{ $component }>` tarbiž vai lühüd kuvaduz vai znam ukrasindaks.

accessibility-video-short-description = Sadatoiden täht `<video>` tarbiž lühüd kuvaduz.

accessibility-input-short-description-or-label = Sadatoiden täht `<{ $component }>` tarbiž lühüd kuvaduz vai nimikahan.

accessibility-answer-input-short-description-or-label = Sadatoiden täht sirun tegii `<answer>` tarbiž lühüd kuvaduz vai nimikahan.

accessibility-short-description-contains-math = Lühüdes kuvaduses ei pidäiži olda matematižid komponentoid, mugoižid kut `<{ $component }>`. Kirjuta matematik sanoil.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ei anda täuz' kontrastad palan pälkirjutusen tekstale (pimed tila) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; pidab olda vähemba { $threshold }:1).
       *[other] { $colorName } ei anda täuz' kontrastad palan pälkirjutusen tekstale ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; pidab olda vähemba { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` { $count } punktan kal't ei ole tehtud sil tilal, konz punktoil ei ole lugumärižid arvoid.

circle-too-many-through-points = Kruugad ei sa lasketa enamba ku 3 punktan kal't.

circle-overprescribed-radius-center-points = Kruugad ei sa lasketa, konz radius, keskpunkt da punktad oma kaik märitud.

circle-center-with-multiple-points = Kruugad, kudambal om märitud keskpunkt, ei sa lasketa enamba ku 1 punktan kal't.

circle-radius-too-small = Kruugad ei sa lasketa: konz punktoiden keskeine loitthuz om { $distance }, märitud radius { $radius } om lijaks penikaine.

circle-radius-with-many-points = Kruugad ei sa tehta enamba ku kahten punktan kal't, konz radius om märitud.

circle-invalid-center-or-through-points = Kruugan keskpunkt vai punktad oma väred.

circle-radius-center-with-multiple-points = Märitud keskpunktan kruugan radiusad ei sa lasketa enamba ku 1 punktan kal't.

circle-change-radius-non-numerical = Kruugan radiusad ei sa vajehtada, konz punktad ei ole lugumärižed

circle-radius-with-points-non-numerical = Kruugad ei sa tehta enamba ku ühten punktan kal't märitud radiusal, konz lugumärižid arvoid ei ole.

circle-change-center-non-numerical = Ei-lugumärižiden punktoiden kal't mänijan kruugan keskpunktan vajehtandad ei ole tehtud.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Funkcijan märituzjoukon mitmuzid om lijaks vähän. Joukos om { $intervals } väl', no funkcijal om { $inputs ->
            [one] { $inputs } sir
           *[other] { $inputs } sirud
        }.
       *[other] Funkcijan märituzjoukon mitmuzid om lijaks vähän. Joukos om { $intervals } välid, no funkcijal om { $inputs ->
            [one] { $inputs } sir
           *[other] { $inputs } sirud
        }.
    }

function-domain-invalid-format = Vär form funkcijan märituzjoukole.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Funkcijan ei-lugumärine maksimum jätetas homaičemata.
        [minimum] Funkcijan ei-lugumärine minimum jätetas homaičemata.
        [extremum] Funkcijan ei-lugumärine ekstremum jätetas homaičemata.
        [point] Funkcijan ei-lugumärine punkt jätetas homaičemata.
        [slope] Funkcijan ei-lugumärine kalduz jätetas homaičemata.
       *[other] Funkcijan ei-lugumärine { $type } jätetas homaičemata.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Funkcijan tühj maksimum jätetas homaičemata.
        [minimum] Funkcijan tühj minimum jätetas homaičemata.
        [extremum] Funkcijan tühj ekstremum jätetas homaičemata.
        [point] Funkcijan tühj punkt jätetas homaičemata.
       *[other] Funkcijan tühj { $type } jätetas homaičemata.
    }

function-points-too-close = Funkcijas oma kaks' punktad, kudambiden sijad oma lijaks lähen toine tošt. Funkcijad ei sa märita.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Funkcijan iteracijad oma vozmoižed vaiše siloi, konz siruiden lugumär om se-žo kut tuluziden. Nenil funkcijal om { $inputs } sir da { $outputs ->
            [one] { $outputs } tuluz
           *[other] { $outputs } tulust
        }.
       *[other] Funkcijan iteracijad oma vozmoižed vaiše siloi, konz siruiden lugumär om se-žo kut tuluziden. Nenil funkcijal om { $inputs } sirud da { $outputs ->
            [one] { $outputs } tuluz
           *[other] { $outputs } tulust
        }.
    }

## `<sequence>`

sequence-invalid-length = Jonon pituz om vär.  Sen pidab olda ei-negativine kogonaine lugu.

sequence-invalid-step = Jonon aškel om vär.  Tipan { $type } jonos sen pidab olda lugu.

sequence-invalid-endpoint-number = Lugujonon ”{ $attribute }” om vär.  Sen pidab olda lugu.

sequence-invalid-endpoint-letters = Kirjaimjonon ”{ $attribute }” om vär.  Sen pidab olda kirjaimiden ühthenzoituz.

sequence-invalid-endpoint = Jonon ”{ $attribute }” om vär.

select-from-sequence-coprime-not-numbers = coprime jätetas homaičemata, sikš ku valitadavad ei ole lugud

select-from-sequence-coprime-with-exclude-combinations = coprime jätetas homaičemata, sikš ku excludeCombinations om märitud

## Resolving a `target`

target-not-found = Vär target kohtale `<{ $source }>`: kohtad ei löugoi.

target-state-variable-not-found = Vär target kohtale `<{ $source }>`: tilvajehtust ”{ $property }” ei löugoi komponentas `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>`-elementan vajehtusiden pidab olda toižed ku iččenaine vajehtuz.

ode-system-duplicate-variable-names = Differencialtazoiduzen oiktan polen funkcijoid ei sa märita, ku rippujiden vajehtusiden nimed toštase.

ode-system-rhs-function-error = Differencialtazoiduzen oiktan polen funkcijad ei sa märita.  Vig mathjs-funkcijan tegendas.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Kulmad { $count } suoren keskes ei sa märita

angle-invalid-through-point = Vär punkt `<angle>`-elementan through-atributas

parabola-vertex-too-many-points = Pälages märitud parabolad enamba ku 1 punktan kal't ei ole tehtud.

parabola-too-many-points = Parabolad enamba ku 3 punktan kal't ei ole tehtud.

intersection-too-many-items = Enamba ku kahten kohtan ristnägud ei ole tehtud

## Other math components

ionic-compound-not-two-ions = Ionoiden ühthenzoitust ei ole tehtud toižele ku kahtele ionale.

ionic-compound-needs-cation-and-anion = Ionoiden ühthenzoituz om tehtud vaiše ühtele kationale da ühtele anionale.

solve-equations-cannot-evaluate = Tazoidust ei sa ratkaita, sikš ku sidä ei voitud lasketa: { $equation }

math-operators-operand-number-required = operandNumber pidab märita, konz matematine operand otetas.

eigen-decomposition-failed = Matrican ičearvoid ei voitud lasketa

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parametr { $parameters } ei ole malis, sikš se ozaidab kaiken tühjaha.
       *[other] `<matchesPattern>`: parametrad { $parameters } ei ole malis, sikš ned ozaidaba kaiken tühjaha.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: arvod grid="{ $grid }" ei sa el'geta. Sen pidab olda none, medium, dense vai kaks' probelal erotadud pozitivišt lugud, ozutesikš grid="1 0.5". Setkad ei piirdeta.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` tarbiž funkcijan, kudambal om { $expected ->
        [one] üks' tuluz, kalduz y' kaikuččes punktas, mugoine kut `y - x`
       *[other] kaks' tulust, vektor kaikuččes punktas, mugoine kut `(y, -x)`
    }, no anttud funkcijal om { $found ->
        [one] { $found } tuluz
       *[other] { $found } tulust
    }. { $alternative ->
        [none] Nimidä ei piirdeta.
       *[other] `<{ $alternative }>` om se komponent, kudamb sätub nenile funkcijale. Nimidä ei piirdeta.
    }

field-function-attribute-ignored-with-child = `function`-atribut jätetas homaičemata, sikš ku funkcii om anttud mugažo komponentan südäimes; kävutadas sidä, kudamb om südäimes. Anda funkcii vaiše ühtel tabal.

field-variables-ignored =
    `<{ $component }>`: `variables`-atribut nimitab komponentan südäimehe kohtha kirjutadud vertusen vajehtused. { $reason ->
        [function-child] Funkcii om tässä anttud `<function>`-lapsen, kudamb nimitab ičeze vajehtused, sikš `variables` jätetas homaičemata.
       *[no-expression] Mugošt vertust ei ole tässä anttud, sikš `variables` jätetas homaičemata.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ei ole tugetud prefigure-piirdmoduulis; kävutadas right-arvon toimindad.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ei ole tugetud prefigure-piirdmoduulis; kävutadas top-arvon toimindad.

prefigure-invalid-axis-bounds = `<graph>`: väred aksiden rajad prefigure-kändandaha; kävutadas oletusarvod bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: vär levuz prefigure-kändandaha; kävutadas oletuslevut 425.

prefigure-invalid-aspect-ratio = `<graph>`: vär aspectRatio prefigure-kändandaha; kävutadas oletussuhtust 1.

prefigure-grid-spacing-too-fine = `<graph>`: setkan väl' om lijaks tihed aksiden rajoihe naht; setk jätetas irdale prefigure-piirdmoduulis.

prefigure-annotations-not-rendered = `<graph>`: znamoičendoid ei piirdeta, konz ei kävutada PreFigure-piirdmoduld.

multiple-annotations-children = `<graph>`-elementas löutihe äi `<annotations>`-last; kaik paiči jäl'gmäšt jätetas homaičemata.

## Referring to other components

copy-unrecognized-component-type = Tundmatont komponenttipad ei sa leveta i kopiruida: { $type }.

copy-prop-not-found = Ominazust { $property } ei löutud tipan { $component } komponentaspäi

collect-no-source = collectale ei löutud ištmed.

collect-invalid-component-type = Tipan `<{ $component }>` komponentoid ei sa kerata, sikš ku tip om vär.

reference-index-unavailable = Indeksaha `{ $reference }` ei sa viitta

## `<callAction>`

component-action-unavailable = Komponentas `{ $reference }` ei sa kucta toimindad { $action }

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Andmusiden form om vär.  Ridoiden pitiden oma erazvuiččed. Löutihe kohtas componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Andmusiš oma se-žo pacaznimed.  Löutihe kohtas componentIdx :{ $componentIdx }

data-frame-missing-column-name = Andmusišpäi pakičese pacaznimi.  Löutihe kohtas componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Nenen vastusen award rippub answer-tundusen ičeze oigetud vastusespäi, mi vedab vartomatomha toimindaha.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts`-arvon panend `<answer>`-elementaha, kudamb om `sectionWideCheckWork`-astijan südäimes, ei toimi nikut, sikš ku astii ohjandab kokendoiden lugumärt. Pane `maxNumAttempts` astijaha.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts`-arvon panend `sectionWideCheckWork`-astijaha, kudamb om toižen `sectionWideCheckWork`-astijan südäimes, ei toimi nikut, sikš ku irdemb astii ohjandab kokendoiden lugumärt. Pane `maxNumAttempts` irdembaha astijaha.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Atributal { $attributes } ei ole toimindad ilma symbolicEquality-azetusta.
       *[other] Atributoil { $attributes } ei ole toimindad ilma symbolicEquality-azetusta.
    }

answer-invalid-type = Vär tip answer-elementale: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Sikš ku komponental `<{ $component }>` ei ole nimed, sidä ei sa kävutada modulin atributan

module-attribute-name-already-defined = Komponentad `<{ $component } name="{ $name }">` ei sa kävutada modulin atributan, sikš ku komponenttipal `<module>` om jo atribut ”{ $name }”.

conditional-content-condition-ignored = `condition`-atribut jätetas homaičemata `<conditionalContent>`-komponentas, kudambal oma case- vai else-lapsed.

slider-markers-type-mismatch = Znamoiden tip ei sätu liuguzsätimen tiphä.

pretzel-problem-needs-statement-and-answer = Vär pretzel: kaikuččes `<problem>`-elementas pidab olda üks' `<statement>` da üks' `<answer>`.

pretzel-circuit-first-problem-distractor = Vär pretzel: tilas mode="circuit" ezmäine `<problem>` ei voi olda segoitai.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Vär arv { $values } atributale `{ $attribute }`; jätetas homaičemata.
       *[other] Väred arvod { $values } atributale `{ $attribute }`; jätetas homaičemata.
    }

attribute-must-be-references = Vär arv `{ $value }` atributale `{ $attribute }`. Atributan pidab olla kogonaz viitusišpäi, kudambad zavodiba znamal `$`.

math-input-invalid-function-names = <mathInput>: väred funkcijoiden nimed jätihe homaičemata kohtas { $attribute }: { $names }. Kaikuččen nimen nägujas ozas pidab olda vähemba 2 znamad (kirjaimid vai ühtenzoituzznamoid); sen jäl'ghe voib tulda valitadav `|<mathspeak alternative>` -lopend.

## Building components from the source

component-type-invalid = Vär komponenttip: `<{ $componentType }>`

attribute-repeated = Atributad { $attribute } ei sa toštta.

attribute-invalid-for-component = Vär atribut ”{ $attribute }” tipan `<{ $componentType }>` komponentale.

## Style definition contrast

style-definition-insufficient-contrast =
    Stil'märitusen { $styleNumber } kontrast om vähäine { $context ->
        [text-on-background] tekstan mujun da fonan mujun keskes
        [high-contrast] korktan kontrastan mujun da piirdaluzen keskes
        [line] viivan mujun da piirdaluzen keskes
        [marker] znaman mujun da piirdaluzen keskes
       *[text-on-canvas] tekstan mujun da piirdaluzen keskes
    }{ $mode ->
        [dark] { " (pimed tila)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; pidab olda vähemba { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Hot' stil'märituz { $styleNumber } andab vauktale tilale täuden kontrastan mujud, niišpäi arvoišpäi sadud pimedan tilan mujuil tekstan mujun da fonan mujun kontrast om vähäine ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; pidab olda vähemba { $threshold }:1). { $suggestion ->
        [available] Täuden kontrastan sabutamižeks pimedas tilas vai ližada kontrastad vauktas tilas (ozutesikš { $lightAttribute }="{ $lightColor }") vai vajehta pimedan tilan muju (ozutesikš { $darkAttribute }="{ $darkColor }").
       *[none] Täuden kontrastan sabutamižeks pimedas tilas ližada kontrastad vauktas tilas vai vajehta sadud mujud azetusil textColorDarkMode da/vai backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Hot' stil'märituz { $styleNumber } andab vauktale tilale täuden kontrastan tekstmujun, neciš arvospäi sadud pimedan tilan tekstmujun kontrast piirdaluzhe naht om vähäine ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; pidab olda vähemba { $threshold }:1). { $suggestion ->
        [available] Täuden kontrastan sabutamižeks pimedas tilas vai ližada kontrastad vauktas tilas (ozutesikš textColor="{ $lightColor }") vai vajehta pimedan tilan muju (ozutesikš textColorDarkMode="{ $darkColor }").
       *[none] Täuden kontrastan sabutamižeks pimedas tilas ližada kontrastad vauktas tilas vai vajehta sadud muju azetusel textColorDarkMode.
    }

section-multiple-style-palettes = Pala voib valita vaiše ühten <stylePalette>-elementan; kävutadas jäl'gmäšt.

## Unique variants

variant-num-to-select-not-non-negative-integer = kohtan { $component } ainaižid variantoid ei sa märita, sikš ku numToSelect ei ole ei-negativine kogonaine lugu.

variant-num-to-select-not-constant-number = kohtan { $component } ainaižid variantoid ei sa märita, sikš ku numToSelect ei ole vaknaz lugu.

variant-with-replacement-not-constant-boolean = kohtan { $component } ainaižid variantoid ei sa märita, sikš ku withReplacement ei ole vaknaz todenarv.

variant-select-weight-disables-unique = selectan ainaižed variantad oma heittud kävutamižespäi, ku kudambal-ni valičendal om selectWeight vai selectForVariants

variant-coprime-undetermined = kohtan { $component } ainaižid variantoid ei sa märita, sikš ku ei sa todeta, miše coprime om kaiken ei-tozi.

variant-attribute-not-constant = kohtan { $component } ainaižid variantoid ei sa märita, sikš ku { $attribute } ei ole vaknaz.

variant-attribute-not-number = kohtan { $component } ainaižid variantoid ei sa märita, sikš ku { $attribute } ei ole lugu.

variant-attribute-wrong-type-for-sequence =
    tipan { $type } kohtan { $component } ainaižid variantoid ei sa märita, sikš ku { $attribute } ei ole { $expected ->
        [letters-combination] kirjaimiden ühthenzoituz
        [math-expression] sätujad matematine vertuz
        [integer] kogonaine lugu
       *[number] lugu
    }.

variant-length-not-integer = kohtan { $component } ainaižid variantoid ei sa märita, sikš ku length ei ole kogonaine lugu.

variant-sort-not-implemented = kohtan { $component } ainaižid variantoid sortan ke ei ole tehtud

variant-exclude-combinations-not-implemented = kohtan { $component } ainaižid variantoid excludeCombinationsan ke ei ole tehtud

variant-math-exclude-not-implemented = math-tipan kohtan { $component } ainaižid variantoid excluden ke ei ole tehtud

variant-non-constant-exclude-not-implemented = kohtan { $component } ainaižid variantoid ei-vaknahan excluden ke ei ole tehtud

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ei ole tugetud graph prefigure -piirdmoduulis; jäl'geläine jätihe homaičemata.

prefigure-descendant-invalid-geometry = { $subject }: lopmatoi vai vajag geometrii; jäl'geläine jätihe homaičemata.

prefigure-curve-label-omitted = { $subject }: nimikahid ei tugeta kändetud kaarelementoiš; nimikaz jätihe irdale.

prefigure-curve-unsupported-definition-type = { $subject }: kaaren märituztipad ”{ $definitionType }” ei tugeta; jäl'geläine jätihe homaičemata.

prefigure-region-flip-functions-unsupported = { $subject }: flipFunctions-atributad ei tugeta regionBetweenCurves-elementas; jäl'geläine jätihe homaičemata.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves tugeb vaiše formulmuptoižid lapsfunkcijoid; jäl'geläine jätihe homaičemata.

prefigure-label-position-unsupported =
    { $subject }: labelPosition ”{ $labelPosition }” ei ole tugetud kohtale { $labelKind ->
        [line-family] suorperehen nimikaz
       *[point] punktan nimikaz
    }; kävutadihe PreFiguran oletustazoitust.

prefigure-fill-style-unsupported = { $subject }: täuthuzstil'd ”{ $fillStyle }” PreFigure ei tugeda; kävutadas ühtnäšt täuthust.

prefigure-line-style-unknown = { $subject }: tundmatoi viivstil' ”{ $lineStyle }” jätihe irdale PreFiguran tuluzespäi.

prefigure-marker-style-mapped-to-diamond = { $subject }: znamstil' ”{ $markerStyle }” kändetihe PreFiguran stil'ks ”diamond”.

prefigure-marker-style-unsupported = { $subject }: znamstil'd ”{ $markerStyle }” PreFigure ei tugeda; kävutadihe oletusstil'd.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: vär `ref`; kohtad ei sa sel'genzoitta. Znamoičend jätihe irdale.

annotation-ref-multiple-targets = `<annotation>`: `ref` ozuti äile kohtale; kävutadas ezmäšt.

annotation-ref-outside-graph = `<annotation>`: vär `ref`; koht om südäimehe otajan kuvaijan irdpolel. Znamoičend jätihe irdale.

annotation-ref-unsupported-target = `<annotation>`: vär `ref`; koht ei ole tugetud grafine objekt prefigure-kändandas. Znamoičend jätihe irdale.

annotation-text-missing = `<annotation>`: `text` pakičese vai om tühj; andas tühj tekst.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Löutihe kehäline rippund.
       *[other] Löutihe kehäline rippund, kudambas om mugana `<{ $componentType }>`-komponent.
    }

reference-no-referent = Viitusele ei löutud kohtad: `{ $reference }`

reference-multiple-referents = Viitusele löutihe äi kohtad: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Vär form komponentan `<{ $componentType }>` atributale { $attribute }.

children-invalid = Värid lapsid elementas `<{ $componentType }>`: löutihe värid lapsid: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Vär arv `{ $value }` atributale `{ $attribute }`, kävutadas arvod `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML-versijad { $version } ei löutud.
       *[other] DoenetML-versijad { $version } ei löutud. Kävutadas versijad { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Vär DoenetML: { $content }

parse-tag-missing-close-tag = Vär DoenetML: Tundusel `{ $tag }` ei ole saupajad tundust. Varastadihe ičeze saupajad tundust vai tundust `</{ $tagName }>`.

parse-tag-error = Vär DoenetML: Vig tundusiš `<{ $tagName }>`

parse-attribute-missing-value = Vär DoenetML: Värašpäi atributaspäi `{ $attribute }` nägub pakičeše arv.

parse-attribute-invalid = Vär DoenetML: Vär atribut `{ $attribute }`

parse-attribute-value-invalid = Vär DoenetML: Vär atributan arv `{ $value }`

parse-attribute-value-quote-mismatch = Vär DoenetML: Vär atributan arv `{ $value }`. Kavyčkad ei sätu toine toižehe. Nägub pakičeše `{ $quote }`

parse-open-tag-name-missing = Vär DoenetML: Löutihe tunduz ilma nimeta, ozutesikš `<`

parse-tag-not-closed = Vär DoenetML: Tundust `{ $tag }` ei saubatud (nägub pakičeše `>`).

parse-self-closing-tag-name-missing = Vär DoenetML: Löutihe tunduz ilma nimeta `<{ $content }>`

parse-self-closing-tag-not-closed = Vär DoenetML: Tundust `{ $tag }` ei saubatud (nägub pakičeše `/>`).

parse-tag-invalid-attributes = Vär DoenetML: Tunduz `{ $tag }` ei sätu. Sil voib olda värid atributoid.

parse-close-tag-name-missing = Vär DoenetML: Löutihe saupai tunduz ilma nimeta, ozutesikš `</`

parse-attribute-value-unquoted = Atributoiden arvod pidab kirjutada kavyčkoihe: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Vär DoenetML: Löutihe saupai tunduz `{ $tag }`, no ei ole sätujad avaidajad tundust

parse-close-tag-mismatched = Vär DoenetML: Saupai tunduz ei sätu avaidajaha. Varastadihe `</{ $expected }>`. Löutihe `{ $found }`

parser-node-unconvertible = Solmud { $node } ei voitud kändta Dast-solmuks.

## Names

name-attribute-invalid =
    Vär atribut name='{ $name }'. { $reason ->
        [characters] Nimiš voib olda vaiše kirjaimid, lugumärid, alviivoid vai ühtenzoituzznamoid.
       *[start] Nimiden pidab zavodidas kirjaimespäi.
    }

component-name-invalid-start = Vär komponentan nimi ”{ $name }”. Nimiden pidab zavodidas kirjaimespäi.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched-tipan answer-elemental pidab olda video-atribut

answer-video-watched-video-not-reference = videoWatched-tipan answer-elementan video-atributan pidab olda viituz

answer-name-not-single-text = answer-elementan name-atributal pidab olda üks' tekstlaps'

## Referencing another document

external-doenetml-recursion-limit = Irdališt DoenetML:ad ei voitud sada lijaks äiden rekursijtazoiden tagut. Ongo tässä kehäviituz?

external-doenetml-unavailable = DoenetML:ad ei voitud sada kohtaspäi { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Kohtaspäi { $attribute }="{ $uri }" sadud DoenetML om vär: se ei sätunu komponenttiphä ”{ $componentType }”

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` om vanhtunu; kävuta sen sijas `{ $to }`.
       *[other] [deprecation] Komponentan `<{ $component }>` atribut `{ $from }` om vanhtunu; kävuta sen sijas `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` om vanhtunu da jätetas homaičemata, sikš ku mugažo `{ $to }` om märitud.
       *[other] [deprecation] Komponentan `<{ $component }>` atribut `{ $from }` om vanhtunu da jätetas homaičemata, sikš ku mugažo `{ $to }` om märitud.
    }

deprecated-attribute-ignored = [deprecation] Komponentan `<{ $component }>` atribut `{ $attribute }` om vanhtunu da jätetas homaičemata.

deprecated-attribute-to-child = [deprecation] Komponentan `<{ $component }>` atribut `{ $attribute }` om vanhtunu; kävuta sen sijas `<{ $child }>`-last.

deprecated-attribute-value-renamed = [deprecation] Komponentan `<{ $component }>` atributan `{ $attribute }` arv `{ $value }` om vanhtunu; kävuta sen sijas `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` mahtab panda äilugumärhä vaiše anglian kelel, sikš kelel { $locale } kirjutadud dokumentas sen tekst jäb endaziše. Kirjuta äilugumärine form kohtha vai pane se `pluralForm`-atributal.


## Checking against the schema

schema-element-unrecognized = Element `<{ $tag }>` ei ole tetpas Doenet-element.

schema-element-not-allowed-at-root = Element `<{ $tag }>` ei ole sallitud dokumentan jures.

schema-element-not-allowed-inside = Element `<{ $tag }>` ei ole sallitud elementan `<{ $parent }>` südäimes.

schema-attribute-unrecognized = Elemental `<{ $tag }>` ei ole atributad nimel `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Elementan `<{ $tag }>` atributan `{ $attribute }` pidab olda list, kudamban kaikutte element om kudamb-ni näišpäi: { $allowed }
       *[other] Elementan `<{ $tag }>` atributan `{ $attribute }` pidab olda kudamb-ni näišpäi: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Vär variantan nimi selectale.  Variantan nimi { $variantName } om { $numOptions } valičendas, no valitadaviden lugumär om { $numToSelect }.

select-variant-name-without-options = selectale om märitud variantoid, no vozmoižele variantan nimele ei ole valičendoid: { $variantName }.

select-variant-name-not-possible = selectale märitud variantan nimi { $variantName } ei ole vozmoine variantan nimi.

select-too-few-options = Ei sa valita { $numToSelect } komponentad vaiše { $numOptions } valičendaspäi.

select-from-sequence-too-few-values = Ei sa valita { $numToSelect } arvod jonospäi, kudamban pituz om { $length }.

select-from-sequence-indices-count-mismatch = selectale märitud indeksoiden lugumären pidab sätuda valitadaviden lugumärhä

select-from-sequence-indices-not-integers = Kaikiden selectale märitud indeksoiden pidab olda kogonaižed lugud

select-from-sequence-index-excluded = selectfromsequence-komponentale märitud indeks oli heittud irdale

select-from-sequence-indices-excluded-combination = selectfromsequence-komponentale märitud indeksad tegiba irdale heittud ühthenzoitusen

select-from-sequence-coprime-not-positive-integers = Keskenaze jagamatomid ühthenzoitusid ei sa valita, sikš ku valitadavad ei ole pozitiviižed kogonaižed lugud.

select-from-sequence-coprime-common-factor = Keskenaze jagamatomid lugid ei sa valita. Kaikil vozmoižil arvoil om ühthine tegii. (Märitud "from"- vai "to"-arvoiden pidab olda jagamatomad "step"-arvon ke.)

select-from-sequence-coprime-single-number = Keskenaze jagamatomid ühthenzoitusid ei sa valita ühtes lugus, kudamb ei ole 1.

select-from-sequence-excluded-too-many-combinations = selectFromSequence-komponentas heittihe irdale enamba 70 % ühthenzoitusišpäi

select-from-sequence-coprime-none-found = Keskenaze jagamatomid lugid ei voitud valita. Kaikil vozmoižil arvoil om ühthine tegii.

select-from-sequence-too-few-unique-values = Ei sa valita { $numToSelect } ainašt arvod jonospäi, kudamban pituz om { $numPossibleValues }

select-prime-numbers-too-few-values = Ei sa valita { $numToSelect } arvod praimlugoiden listaspäi, kudamban pituz om { $numValues }

select-prime-numbers-values-count-mismatch = selectale märitud arvoiden lugumären pidab sätuda valitadaviden lugumärhä

select-prime-numbers-values-not-prime = Kaikiden praimlugun valičendaha märitud arvoiden pidab olda praimlugoiden listas

select-prime-numbers-values-excluded-combination = selectPrimeNumbersale märitud arvod tegiba irdale heittud ühthenzoitusen

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers-komponentas heittihe irdale enamba 70 % ühthenzoitusišpäi

select-random-combination-fluke = Ani vähän vozmoižen slučin tagut sattumaližiden arvoiden ühthenzoitust ei voitud valita

select-random-value-fluke = Ani vähän vozmoižen slučin tagut sattumališt arvod ei voitud valita
