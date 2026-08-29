# Karelian diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the **Latin** alphabet, the official orthography of Karelian in
# the Republic of Karelia. Karelian is a language of the Russian Federation
# that is not written in Cyrillic.
#
# This catalog is the **Karelian Proper (Viena / Northern)** literary norm.
# `locales/olo` is Livvi, a separate ISO 639-3 language with no macrolanguage
# code over the pair; a reader of either norm can largely read the other, which
# is precisely why the two files are written separately rather than copied.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# The technical nouns are taken in their Finnic shape — «komponentti»,
# «attribuutti», «funktijo», «indeksi» — which is what the Viena norm prefers.
# `locales/olo` and `locales/vep` take the Russian-mediated shapes instead.
#
# After any numeral above one a Karelian noun stands in the partitive
# singular, so a `{ $count -> … }` here separates two cases rather than two
# numbers. Both branches are still needed.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } ohitetah, kun kakši piätepistehtä on miäritelty
       *[other] { $attributes } ohitetah, kun kakši piätepistehtä on miäritelty
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } ohitetah, kun šekä piätepisteh jotta keškipisteh on miäritelty
       *[other] { $attributes } ohitetah, kun šekä piätepisteh jotta keškipisteh on miäritelty
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ei vaikuta mitänä ilman midpoint-arvuo

## `<line>`

line-points-undetermined-dimensions = Suora kulkou pisteijen kautti, kumpasien ulottuvuukšien miärä ei ole tietty.

line-points-too-few-dimensions = Suoran pitäy kulkie vähintänä kakšiulotteisien pisteijen kautti.

line-points-depend-on-variables = Suora kulkou pisteijen kautti, kumpaset ripušetah muuttujista: { $variables }.

line-equation-invalid-format = Viärä muoto suoran yhtälöllä muuttujissa { $variable1 } ta { $variable2 }.

## `<ray>`

ray-overprescribed-through = Puolisuora on miärätty attribuutiloilla through, endpoint ta direction.  Miäritelty through ohitetah.

ray-dimension-mismatch = numDimensions-ristiriita puolisuorašša.

## `<vector>`

vector-overprescribed-head = Vektori on miärätty attribuutiloilla head, tail ta displacement.  Miäritelty head ohitetah.

vector-dimension-mismatch = numDimensions-ristiriita vektorissa.

## Attracting and constraining

attract-to-without-nearest-point = Kohtieh `<{ $component }>` ei voi vetyä, šentäh kun šillä ei ole nearestPoint-tilamuuttujua.

constrain-to-without-nearest-point = Kohtieh `<{ $component }>` ei voi rajottua, šentäh kun šillä ei ole nearestPoint-tilamuuttujua.

constrain-to-interior-without-nearest-point = Kohtehen `<{ $component }>` šišäozah ei voi rajottua, šentäh kun šillä ei ole nearestPoint-tilamuuttujua.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ohitetah, kun choiceInput ei ole inline

## Ordering children by index

choice-input-indices-count-mismatch = choiceInputilla miäritellyt indeksit ohitetah, šentäh kun niijen miärä ei vaššua choice-lapšien miäryä.

pretzel-indices-count-mismatch = problemilla miäritellyt indeksit ohitetah, šentäh kun niijen miärä ei vaššua problem-lapšien miäryä.

shuffle-indices-count-mismatch = shuffle-komponentilla miäritellyt indeksit ohitetah, šentäh kun niijen miärä ei vaššua komponenttiloin miäryä.

indices-ignored-out-of-range = Kohtehella { $component } miäritellyt indeksit ohitetah, šentäh kun oza niistä on alovvehen ulkopuolella.

pretzel-indices-repeated = pretzelillä miäritellyt indeksit ohitetah, šentäh kun oza niistä toistuu.

pretzel-circuit-first-index = pretzelillä circuit-tilašša miäritellyt indeksit ohitetah, šentäh kun enšimmäisen indeksin pitäy olla 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Jotta `<{ $component }>` toimis merkkijonolapšien kera, pitäy miäritellä `type`-attribuutti.

invalid-type-defaulting-to-math = Viärä type { $type } komponentilla { $component }. Šen pitäy olla math, text, number tahi boolean. Käytetäh arvuo math.

string-not-valid-component-to-arrange = Merkkijono ”{ $value }” ei kelpua komponentiksi kohtehella { $component }. Ohitetah.

## Types and variables

invalid-type-defaulting-to-number = Viärä type { $type }, typeksi azetetah number.

invalid-variable-value = Muuttujan viärä arvo: `{ $value }`

## Variants

variant-index-must-be-number = Muuntehen indeksin { $index } pitäy olla luku

variant-index-must-be-integer = Muuntehen indeksin { $index } pitäy olla kokonaisluku

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ei ole toteutettu absoluuttisilla mitoilla. Levevvet azetetah šuhtehellisiksi.

side-by-side-absolute-margins = `<{ $component }>` ei ole toteutettu absoluuttisilla mitoilla. Marginaalit azetetah šuhtehellisiksi.

side-by-side-no-block-child = Viärä `<{ $component }>`: šillä pitäy olla vähintänä yksi lohkotazon lapši.

## `<label>`

label-for-ignored-on-graphical = Graafisen `<label>`-elementin `for`-attribuutti ohitetah.

label-for-must-resolve-to-one = `<label>`-elementin `for`-attribuutin pitäy ozuttua tarkalleh yhteh komponenttih.

label-for-unresolved = `<label>`-elementin `for`-attribuuttie ei šuatu yhistyä komponenttih.

label-for-answer-with-authored-inputs = `<label>`-elementin `for`-attribuutti viittuau `<answer>`-elementtih, kumpasella on erikseh kirjutetut šyöttehet; viittua šuorah šyöttehie.

label-for-answer-without-input = `<label>`-elementin `for`-attribuutti viittuau `<answer>`-elementtih, kumpasella ei ole nimitettävyä šyöttehtä.

label-for-must-reference-input-or-answer = `<label>`-elementin `for`-attribuutin pitäy viitata šyöttehe tahi answer-elementtih.

## Accessibility

accessibility-short-description-or-decorative = Šuavutettavuuvven täh `<{ $component }>` tarviččou joko lyhyön kuvaukšen tahi merkinnän koristehellisekši.

accessibility-video-short-description = Šuavutettavuuvven täh `<video>` tarviččou lyhyön kuvaukšen.

accessibility-input-short-description-or-label = Šuavutettavuuvven täh `<{ $component }>` tarviččou lyhyön kuvaukšen tahi nimikkehen.

accessibility-answer-input-short-description-or-label = Šuavutettavuuvven täh šyöttehen luoja `<answer>` tarviččou lyhyön kuvaukšen tahi nimikkehen.

accessibility-short-description-contains-math = Lyhyöt kuvaukšet ei šuattas šisältyä matemaattisie komponenttiloja, moisie kuin `<{ $component }>`. Kirjuta matematiikka šanoilla.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ei anna kyllin kontrastie luvun otsikkotekstillä (tumma tila) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vuajitah vähintänä { $threshold }:1).
       *[other] { $colorName } ei anna kyllin kontrastie luvun otsikkotekstillä ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vuajitah vähintänä { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` { $count } pistehen kautti ei ole toteutettu šiinä tapaukšešša, kun pistehillä ei ole numeerisie arvoja.

circle-too-many-through-points = Ympyryä ei voi laškie enemmän kuin 3 pistehen kautti.

circle-overprescribed-radius-center-points = Ympyryä ei voi laškie, kun šäveh, keškipisteh ta pistehet on kaikki miäritelty.

circle-center-with-multiple-points = Ympyryä, kumpasella on miäritelty keškipisteh, ei voi laškie enemmän kuin 1 pistehen kautti.

circle-radius-too-small = Ympyryä ei voi laškie: kun pisteijen välini etähisys on { $distance }, miäritelty šäveh { $radius } on liijan pieni.

circle-radius-with-many-points = Ympyryä ei voi luuvva enemmän kuin kahen pistehen kautti, kun šäveh on miäritelty.

circle-invalid-center-or-through-points = Ympyrän keškipisteh tahi pistehet ollah viärät.

circle-radius-center-with-multiple-points = Miäritellyn keškipistehen ympyrän šävehtä ei voi laškie enemmän kuin 1 pistehen kautti.

circle-change-radius-non-numerical = Ympyrän šävehtä ei voi muuttua, kun pistehet ei olla numeerisie

circle-radius-with-points-non-numerical = Ympyryä ei voi luuvva enemmän kuin yhen pistehen kautti miäritellyllä šävehellä, kun numeerisie arvoja ei ole.

circle-change-center-non-numerical = Ei-numeerisien pisteijen kautti kulkovan ympyrän keškipistehen muuttamista ei ole toteutettu.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Funktijon miärittelyjoukon ulottuvuukšie on liijan vähän. Joukošša on { $intervals } väli, ka funktijolla on { $inputs ->
            [one] { $inputs } šyöteh
           *[other] { $inputs } šyöteštä
        }.
       *[other] Funktijon miärittelyjoukon ulottuvuukšie on liijan vähän. Joukošša on { $intervals } välie, ka funktijolla on { $inputs ->
            [one] { $inputs } šyöteh
           *[other] { $inputs } šyöteštä
        }.
    }

function-domain-invalid-format = Viärä muoto funktijon miärittelyjoukolla.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Funktijon ei-numeerini makšimi ohitetah.
        [minimum] Funktijon ei-numeerini minimi ohitetah.
        [extremum] Funktijon ei-numeerini iäriarvo ohitetah.
        [point] Funktijon ei-numeerini pisteh ohitetah.
        [slope] Funktijon ei-numeerini kulmakerroin ohitetah.
       *[other] Funktijon ei-numeerini { $type } ohitetah.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Funktijon tyhjä makšimi ohitetah.
        [minimum] Funktijon tyhjä minimi ohitetah.
        [extremum] Funktijon tyhjä iäriarvo ohitetah.
        [point] Funktijon tyhjä pisteh ohitetah.
       *[other] Funktijon tyhjä { $type } ohitetah.
    }

function-points-too-close = Funktijošša on kakši pistehtä, kumpasien šijainnit ollah liijan lähellä toini toistah. Funktijuo ei voi miäritellä.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Funktijon iteraatijot ollah mahollisie vain šilloin, kun šyöttehien miärä on šama kuin tuloštehien. Tällä funktijolla on { $inputs } šyöteh ta { $outputs ->
            [one] { $outputs } tulošteh
           *[other] { $outputs } tulošteštä
        }.
       *[other] Funktijon iteraatijot ollah mahollisie vain šilloin, kun šyöttehien miärä on šama kuin tuloštehien. Tällä funktijolla on { $inputs } šyöteštä ta { $outputs ->
            [one] { $outputs } tulošteh
           *[other] { $outputs } tulošteštä
        }.
    }

## `<sequence>`

sequence-invalid-length = Jonon pituus on viärä.  Šen pitäy olla ei-negatiivini kokonaisluku.

sequence-invalid-step = Jonon aškel on viärä.  Tyypin { $type } jonošša šen pitäy olla luku.

sequence-invalid-endpoint-number = Lukujonon ”{ $attribute }” on viärä.  Šen pitäy olla luku.

sequence-invalid-endpoint-letters = Kirjainjonon ”{ $attribute }” on viärä.  Šen pitäy olla kirjainyhistelmä.

sequence-invalid-endpoint = Jonon ”{ $attribute }” on viärä.

select-from-sequence-coprime-not-numbers = coprime ohitetah, šentäh kun vallittavat ei olla lukuja

select-from-sequence-coprime-with-exclude-combinations = coprime ohitetah, šentäh kun excludeCombinations on miäritelty

## Resolving a `target`

target-not-found = Viärä target kohtehella `<{ $source }>`: kohtehta ei löyvy.

target-state-variable-not-found = Viärä target kohtehella `<{ $source }>`: tilamuuttujua ”{ $property }” ei löyvy komponentista `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>`-elementin muuttujien pitäy olla erilaisie kuin riippumatoin muuttuja.

ode-system-duplicate-variable-names = Differentiaaliyhtälön oikien puolen funktijoloja ei voi miäritellä, kun riippuvien muuttujien nimet toistutah.

ode-system-rhs-function-error = Differentiaaliyhtälön oikien puolen funktijuo ei voi miäritellä.  Virheh mathjs-funktijon luonnissa.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Kulmua { $count } suoran välillä ei voi miäritellä

angle-invalid-through-point = Viärä pisteh `<angle>`-elementin through-attribuutissa

parabola-vertex-too-many-points = Huipulla miäriteltyö parabolie enemmän kuin 1 pistehen kautti ei ole toteutettu.

parabola-too-many-points = Parabolie enemmän kuin 3 pistehen kautti ei ole toteutettu.

intersection-too-many-items = Enemmän kuin kahen kohtehen leikkaušta ei ole toteutettu

## Other math components

ionic-compound-not-two-ions = Ioniyhistelmyä ei ole toteutettu muulla kuin kahella ionilla.

ionic-compound-needs-cation-and-anion = Ioniyhistelmä on toteutettu vain yhellä kationilla ta yhellä anionilla.

solve-equations-cannot-evaluate = Yhtälyö ei voi ratkaissa, šentäh kun šitä ei šuatu laškie: { $equation }

math-operators-operand-number-required = operandNumber pitäy miäritellä, kun matemaattini operandi poimitah.

eigen-decomposition-failed = Matriisin ominaisarvoja ei šuatu laškie

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parametri { $parameters } ei ezenny hahmošša, šentäh še ozuu aina tyhjäh.
       *[other] `<matchesPattern>`: parametrit { $parameters } ei ezetä hahmošša, šentäh ne ozutah aina tyhjäh.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: arvuo grid="{ $grid }" ei voi tulkita. Šen pitäy olla none, medium, dense tahi kakši välilyönnillä erotettuo pozitiivista lukuo, ezimerkiksi grid="1 0.5". Ruuvvukkuo ei piirretä.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` tarviččou funktijon, kumpasella on { $expected ->
        [one] yksi tulošteh, kulmakerroin y' jokahisešša pistehešša, moini kuin `y - x`
       *[other] kakši tulošteštä, vektori jokahisešša pistehešša, moini kuin `(y, -x)`
    }, ka annetulla funktijolla on { $found ->
        [one] { $found } tulošteh
       *[other] { $found } tulošteštä
    }. { $alternative ->
        [none] Mitänä ei piirretä.
       *[other] `<{ $alternative }>` on še komponentti, kumpani šopiu tällä funktijolla. Mitänä ei piirretä.
    }

field-function-attribute-ignored-with-child = `function`-attribuutti ohitetah, šentäh kun funktijo on annettu i komponentin šisällä; käytetäh šitä, kumpani on šisällä. Anna funktijo vain yhellä tavalla.

field-variables-ignored =
    `<{ $component }>`: `variables`-attribuutti nimittäy komponentin šisällä šuorah kirjutetun lausekkehen muuttujat. { $reason ->
        [function-child] Funktijo on tiälä annettu `<function>`-lapšena, kumpani nimittäy omat muuttujah, šentäh `variables` ohitetah.
       *[no-expression] Moista lausekehta ei ole tiälä annettu, šentäh `variables` ohitetah.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ei ole tuettu prefigure-piirtomoduulissa; käytetäh right-arvon toimintua.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ei ole tuettu prefigure-piirtomoduulissa; käytetäh top-arvon toimintua.

prefigure-invalid-axis-bounds = `<graph>`: viärät akselirajat prefigure-muunnokšeh; käytetäh oletusarvuo bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: viärä levevvys prefigure-muunnokšeh; käytetäh oletuslevevvyttä 425.

prefigure-invalid-aspect-ratio = `<graph>`: viärä aspectRatio prefigure-muunnokšeh; käytetäh oletusšuhetta 1.

prefigure-grid-spacing-too-fine = `<graph>`: ruuvvukon väli on liijan tiheä akselirajoih nähen; ruuvvukko jätetäh pois prefigure-piirtomoduulissa.

prefigure-annotations-not-rendered = `<graph>`: merkintöjä ei piirretä, kun ei käytetä PreFigure-piirtomoduulie.

multiple-annotations-children = `<graph>`-elementistä löyty monta `<annotations>`-lašta; kaikki paičči viimeini ohitetah.

## Referring to other components

copy-unrecognized-component-type = Tuntematointa komponenttityyppie ei voi laajentua eikä kopijoija: { $type }.

copy-prop-not-found = Ominaisuutta { $property } ei löytyn tyypin { $component } komponentista

collect-no-source = collectilla ei löytyn lähtehtä.

collect-invalid-component-type = Tyypin `<{ $component }>` komponenttiloja ei voi kerätä, šentäh kun tyyppi on viärä.

reference-index-unavailable = Indeksih `{ $reference }` ei voi viitata

## `<callAction>`

component-action-unavailable = Komponentissa `{ $reference }` ei voi kuččuo toimintuo { $action }

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Datan muoto on viärä.  Rivien pituvvet vaihellah. Löyty kohašta componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Datašša on šamoja paččahannimie.  Löyty kohašta componentIdx :{ $componentIdx }

data-frame-missing-column-name = Datašta puuttuu paččahannimi.  Löyty kohašta componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Tämän vastaukšen award perustuu answer-tunnukšen omah työnnettyh vaštaukšeh, mi vetäy vuottamattomah toimintah.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts`-arvon azettamini `<answer>`-elementtih, kumpani on `sectionWideCheckWork`-šäilijön šisällä, ei vaikuta mitänä, šentäh kun šäilijö ohjuau yritykšien miäryä. Azeta `maxNumAttempts` šäilijöh.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts`-arvon azettamini `sectionWideCheckWork`-šäilijöh, kumpani on toisen `sectionWideCheckWork`-šäilijön šisällä, ei vaikuta mitänä, šentäh kun ulompi šäilijö ohjuau yritykšien miäryä. Azeta `maxNumAttempts` ulompah šäilijöh.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Attribuutilla { $attributes } ei ole vaikutušta ilman symbolicEquality-azetušta.
       *[other] Attribuutiloilla { $attributes } ei ole vaikutušta ilman symbolicEquality-azetušta.
    }

answer-invalid-type = Viärä tyyppi answer-elementillä: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Šentäh kun komponentilla `<{ $component }>` ei ole nimie, šitä ei voi käyttyä moduulin attribuuttina

module-attribute-name-already-defined = Komponenttie `<{ $component } name="{ $name }">` ei voi käyttyä moduulin attribuuttina, šentäh kun komponenttityypillä `<module>` on jo attribuutti ”{ $name }”.

conditional-content-condition-ignored = `condition`-attribuutti ohitetah `<conditionalContent>`-komponentissa, kumpasella on case- tahi else-lapšie.

slider-markers-type-mismatch = Merkkien tyyppi ei vaššua liukušiätimen tyyppie.

pretzel-problem-needs-statement-and-answer = Viärä pretzel: jokahisešša `<problem>`-elementissä pitäy olla yksi `<statement>` ta yksi `<answer>`.

pretzel-circuit-first-problem-distractor = Viärä pretzel: tilašša mode="circuit" enšimmäini `<problem>` ei voi olla harhauttaja.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Viärä arvo { $values } attribuutilla `{ $attribute }`; ohitetah.
       *[other] Viärät arvot { $values } attribuutilla `{ $attribute }`; ohitetah.
    }

attribute-must-be-references = Viärä arvo `{ $value }` attribuutilla `{ $attribute }`. Attribuutin pitäy koostuo viittaukšista, kumpaset alletah merkillä `$`.

math-input-invalid-function-names = <mathInput>: viärät funktijoloin nimet ohitettih kohašša { $attribute }: { $names }. Jokahisen nimen näkyväššä ozašša pitäy olla vähintänä 2 merkkie (kirjaimie tahi yhysmerkkie); šen jälkeh voipi tulla valinnaini `|<mathspeak alternative>` -piäteh.

## Building components from the source

component-type-invalid = Viärä komponenttityyppi: `<{ $componentType }>`

attribute-repeated = Attribuuttie { $attribute } ei voi toistua.

attribute-invalid-for-component = Viärä attribuutti ”{ $attribute }” tyypin `<{ $componentType }>` komponentilla.

## Style definition contrast

style-definition-insufficient-contrast =
    Tyylimiärittelyn { $styleNumber } kontrasti on riittämätöin { $context ->
        [text-on-background] tekstin värin ta taustavärin välillä
        [high-contrast] korkien kontrastin värin ta piirtoalustan välillä
        [line] viivan värin ta piirtoalustan välillä
        [marker] merkin värin ta piirtoalustan välillä
       *[text-on-canvas] tekstin värin ta piirtoalustan välillä
    }{ $mode ->
        [dark] { " (tumma tila)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vuajitah vähintänä { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Vaikka tyylimiärittely { $styleNumber } antau valkiel tilalla kyllin kontrastie antavat värit, näistä arvoista johetuilla tumman tilan väreillä tekstin värin ta taustavärin kontrasti on riittämätöin ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vuajitah vähintänä { $threshold }:1). { $suggestion ->
        [available] Kyllin kontrastin šuamiseksi tummašša tilašša joko lisyä kontrastie valkiešša tilašša (ezim. { $lightAttribute }="{ $lightColor }") tahi korvua tumman tilan väri (ezim. { $darkAttribute }="{ $darkColor }").
       *[none] Kyllin kontrastin šuamiseksi tummašša tilašša lisyä kontrastie valkiešša tilašša tahi korvua johetut värit azetukšilla textColorDarkMode ta/tahi backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Vaikka tyylimiärittely { $styleNumber } antau valkiel tilalla kyllin kontrastie antavan tekstivärin, täštä arvošta johetun tumman tilan tekstivärin kontrasti piirtoalustah nähen on riittämätöin ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vuajitah vähintänä { $threshold }:1). { $suggestion ->
        [available] Kyllin kontrastin šuamiseksi tummašša tilašša joko lisyä kontrastie valkiešša tilašša (ezim. textColor="{ $lightColor }") tahi korvua tumman tilan väri (ezim. textColorDarkMode="{ $darkColor }").
       *[none] Kyllin kontrastin šuamiseksi tummašša tilašša lisyä kontrastie valkiešša tilašša tahi korvua johettu väri azetukšella textColorDarkMode.
    }

section-multiple-style-palettes = Luku voipi vallita vain yhen <stylePalette>-elementin; käytetäh viimeistä.

## Unique variants

variant-num-to-select-not-non-negative-integer = kohtehen { $component } ainutluatusie muuntehie ei voi miärittyä, šentäh kun numToSelect ei ole ei-negatiivini kokonaisluku.

variant-num-to-select-not-constant-number = kohtehen { $component } ainutluatusie muuntehie ei voi miärittyä, šentäh kun numToSelect ei ole vakioluku.

variant-with-replacement-not-constant-boolean = kohtehen { $component } ainutluatusie muuntehie ei voi miärittyä, šentäh kun withReplacement ei ole vakiototuusarvo.

variant-select-weight-disables-unique = selectin ainutluatuset muuntehet on otettu pois käytöštä, kun jollakih vaihtoeholla on selectWeight tahi selectForVariants

variant-coprime-undetermined = kohtehen { $component } ainutluatusie muuntehie ei voi miärittyä, šentäh kun ei voi toteta, jotta coprime on aina epätozi.

variant-attribute-not-constant = kohtehen { $component } ainutluatusie muuntehie ei voi miärittyä, šentäh kun { $attribute } ei ole vakijo.

variant-attribute-not-number = kohtehen { $component } ainutluatusie muuntehie ei voi miärittyä, šentäh kun { $attribute } ei ole luku.

variant-attribute-wrong-type-for-sequence =
    tyypin { $type } kohtehen { $component } ainutluatusie muuntehie ei voi miärittyä, šentäh kun { $attribute } ei ole { $expected ->
        [letters-combination] kirjainyhistelmä
        [math-expression] kelvollini matemaattini lauseke
        [integer] kokonaisluku
       *[number] luku
    }.

variant-length-not-integer = kohtehen { $component } ainutluatusie muuntehie ei voi miärittyä, šentäh kun length ei ole kokonaisluku.

variant-sort-not-implemented = kohtehen { $component } ainutluatusie muuntehie sortin kera ei ole toteutettu

variant-exclude-combinations-not-implemented = kohtehen { $component } ainutluatusie muuntehie excludeCombinationsin kera ei ole toteutettu

variant-math-exclude-not-implemented = math-tyyppisen kohtehen { $component } ainutluatusie muuntehie excluden kera ei ole toteutettu

variant-non-constant-exclude-not-implemented = kohtehen { $component } ainutluatusie muuntehie ei-vakijon excluden kera ei ole toteutettu

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ei tuettu graph prefigure -piirtomoduulissa; jälkeläini ohitettih.

prefigure-descendant-invalid-geometry = { $subject }: iäretöin tahi puuttehellini geometrija; jälkeläini ohitettih.

prefigure-curve-label-omitted = { $subject }: nimikkehie ei tuveta muunnetuissa kuarielementeissä; nimikeh jätettih pois.

prefigure-curve-unsupported-definition-type = { $subject }: kuaren miärittelytyyppie ”{ $definitionType }” ei tuveta; jälkeläini ohitettih.

prefigure-region-flip-functions-unsupported = { $subject }: flipFunctions-attribuuttie ei tuveta regionBetweenCurves-elementissä; jälkeläini ohitettih.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves tukou vain kuavamuotosie lapšifunktijoloja; jälkeläini ohitettih.

prefigure-label-position-unsupported =
    { $subject }: labelPosition ”{ $labelPosition }” ei ole tuettu kohtehella { $labelKind ->
        [line-family] suoraperehen nimikeh
       *[point] pistehen nimikeh
    }; käytettih PreFiguren oletustazaušta.

prefigure-fill-style-unsupported = { $subject }: täyttötyylie ”{ $fillStyle }” PreFigure ei tue; käytetäh yhtenäistä täyttyö.

prefigure-line-style-unknown = { $subject }: tuntematoin viivatyyli ”{ $lineStyle }” jätettih pois PreFiguren tuloštehešta.

prefigure-marker-style-mapped-to-diamond = { $subject }: merkkityyli ”{ $markerStyle }” kuvattih PreFiguren tyyliksi ”diamond”.

prefigure-marker-style-unsupported = { $subject }: merkkityylie ”{ $markerStyle }” PreFigure ei tue; käytettih oletustyylie.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: viärä `ref`; kohtehta ei voi šelvittyä. Merkintä jätettih pois.

annotation-ref-multiple-targets = `<annotation>`: `ref` ozutti moneh kohtieh; käytetäh enšimmäistä.

annotation-ref-outside-graph = `<annotation>`: viärä `ref`; kohteh on šisältäjän kuvuajan ulkopuolella. Merkintä jätettih pois.

annotation-ref-unsupported-target = `<annotation>`: viärä `ref`; kohteh ei ole tuettu graafini objekti prefigure-muunnokšešša. Merkintä jätettih pois.

annotation-text-missing = `<annotation>`: `text` puuttuu tahi on tyhjä; tuloštetah tyhjä teksti.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Havaittih kehämäini riippuvus.
       *[other] Havaittih kehämäini riippuvus, kumpasešša on mukana `<{ $componentType }>`-komponentti.
    }

reference-no-referent = Viittaukšella ei löytyn kohtehta: `{ $reference }`

reference-multiple-referents = Viittaukšella löyty monta kohtehta: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Viärä muoto komponentin `<{ $componentType }>` attribuutilla { $attribute }.

children-invalid = Viärie lapšie elementissä `<{ $componentType }>`: löyty viärie lapšie: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Viärä arvo `{ $value }` attribuutilla `{ $attribute }`, käytetäh arvuo `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML-versijuo { $version } ei löytyn.
       *[other] DoenetML-versijuo { $version } ei löytyn. Käytetäh versijuo { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Viärä DoenetML: { $content }

parse-tag-missing-close-tag = Viärä DoenetML: Tunnukšella `{ $tag }` ei ole šalpuajua tunnušta. Vuotettih ičeššäh šalpuajua tunnušta tahi tunnušta `</{ $tagName }>`.

parse-tag-error = Viärä DoenetML: Virheh tunnukšešša `<{ $tagName }>`

parse-attribute-missing-value = Viärä DoenetML: Viäräštä attribuutista `{ $attribute }` näyttäy puuttuvan arvo.

parse-attribute-invalid = Viärä DoenetML: Viärä attribuutti `{ $attribute }`

parse-attribute-value-invalid = Viärä DoenetML: Viärä attribuutin arvo `{ $value }`

parse-attribute-value-quote-mismatch = Viärä DoenetML: Viärä attribuutin arvo `{ $value }`. Lainaušmerkit ei vaššata toini toistah. Näyttäy puuttuvan `{ $quote }`

parse-open-tag-name-missing = Viärä DoenetML: Löyty tunnus ilman nimie, ezim. `<`

parse-tag-not-closed = Viärä DoenetML: Tunnušta `{ $tag }` ei šalvattu (näyttäy puuttuvan `>`).

parse-self-closing-tag-name-missing = Viärä DoenetML: Löyty tunnus ilman nimie `<{ $content }>`

parse-self-closing-tag-not-closed = Viärä DoenetML: Tunnušta `{ $tag }` ei šalvattu (näyttäy puuttuvan `/>`).

parse-tag-invalid-attributes = Viärä DoenetML: Tunnus `{ $tag }` ei kelpua. Šillä voipi olla viärie attribuuttiloja.

parse-close-tag-name-missing = Viärä DoenetML: Löyty šalpuaja tunnus ilman nimie, ezim. `</`

parse-attribute-value-unquoted = Attribuutiloin arvot pitäy kirjuttua lainaušmerkkilöih: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Viärä DoenetML: Löyty šalpuaja tunnus `{ $tag }`, ka ei vaššuavua avuajua tunnušta

parse-close-tag-mismatched = Viärä DoenetML: Šalpuaja tunnus ei vaššua avuajua. Vuotettih `</{ $expected }>`. Löyty `{ $found }`

parser-node-unconvertible = Šolmuo { $node } ei šuatu muuntua Dast-šolmukši.

## Names

name-attribute-invalid =
    Viärä attribuutti name='{ $name }'. { $reason ->
        [characters] Nimissä voipi olla vain kirjaimie, numeroja, alaviivoja tahi yhysmerkkie.
       *[start] Nimien pitäy alkua kirjaimella.
    }

component-name-invalid-start = Viärä komponentin nimi ”{ $name }”. Nimien pitäy alkua kirjaimella.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched-tyyppisellä answer-elementillä pitäy olla video-attribuutti

answer-video-watched-video-not-reference = videoWatched-tyyppisen answer-elementin video-attribuutin pitäy olla viittaus

answer-name-not-single-text = answer-elementin name-attribuutilla pitäy olla yksi tekstilapši

## Referencing another document

external-doenetml-recursion-limit = Ulkoista DoenetML:yä ei šuatu hakie liijan monen rekursijotazon täh. Onko täššä kehäviittaus?

external-doenetml-unavailable = DoenetML:yä ei šuatu hakie kohtehešta { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Kohtehešta { $attribute }="{ $uri }" haettu DoenetML on viärä: še ei vaššannun komponenttityyppie ”{ $componentType }”

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Attribuutti `{ $from }` on vanhentun; käytä šen šijah `{ $to }`.
       *[other] [deprecation] Komponentin `<{ $component }>` attribuutti `{ $from }` on vanhentun; käytä šen šijah `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Attribuutti `{ $from }` on vanhentun ta ohitetah, šentäh kun myöš `{ $to }` on miäritelty.
       *[other] [deprecation] Komponentin `<{ $component }>` attribuutti `{ $from }` on vanhentun ta ohitetah, šentäh kun myöš `{ $to }` on miäritelty.
    }

deprecated-attribute-ignored = [deprecation] Komponentin `<{ $component }>` attribuutti `{ $attribute }` on vanhentun ta ohitetah.

deprecated-attribute-to-child = [deprecation] Komponentin `<{ $component }>` attribuutti `{ $attribute }` on vanhentun; käytä šen šijah `<{ $child }>`-lašta.

deprecated-attribute-value-renamed = [deprecation] Komponentin `<{ $component }>` attribuutin `{ $attribute }` arvo `{ $value }` on vanhentun; käytä šen šijah `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` malttau taivuttua monikkoh vain englanniksi, šentäh kielellä { $locale } kirjutetušša asiakirjašša šen teksti jiäy ennallah. Kirjuta monikkomuoto šuorah tahi azeta še `pluralForm`-attribuutilla.


## Checking against the schema

schema-element-unrecognized = Elementti `<{ $tag }>` ei ole tuttu Doenet-elementti.

schema-element-not-allowed-at-root = Elementti `<{ $tag }>` ei ole šallittu asiakirjan juurešša.

schema-element-not-allowed-inside = Elementti `<{ $tag }>` ei ole šallittu elementin `<{ $parent }>` šisällä.

schema-attribute-unrecognized = Elementillä `<{ $tag }>` ei ole attribuuttie nimeltäh `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Elementin `<{ $tag }>` attribuutin `{ $attribute }` pitäy olla lista, kumpasen jokahini alkijo on jokin näistä: { $allowed }
       *[other] Elementin `<{ $tag }>` attribuutin `{ $attribute }` pitäy olla jokin näistä: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Viärä muuntehen nimi selectillä.  Muuntehen nimi { $variantName } ezenty { $numOptions } vaihtoehošša, ka vallittavien miärä on { $numToSelect }.

select-variant-name-without-options = selectillä on miäritelty muuntehie, ka mahollisella muuntehen nimellä ei ole vaihtoehtoja: { $variantName }.

select-variant-name-not-possible = selectillä miäritelty muuntehen nimi { $variantName } ei ole mahollini muuntehen nimi.

select-too-few-options = Ei voi vallita { $numToSelect } komponenttie vain { $numOptions } vaihtoehošta.

select-from-sequence-too-few-values = Ei voi vallita { $numToSelect } arvuo jonošta, kumpasen pituus on { $length }.

select-from-sequence-indices-count-mismatch = selectillä miäriteltyjen indeksien miärän pitäy vaššata vallittavien miäryä

select-from-sequence-indices-not-integers = Kaikkien selectillä miäriteltyjen indeksien pitäy olla kokonaislukuja

select-from-sequence-index-excluded = selectfromsequence-komponentilla miäritelty indeksi oli poisšuljettu

select-from-sequence-indices-excluded-combination = selectfromsequence-komponentilla miäritellyt indeksit muovvoššettih poisšuljetun yhistelmän

select-from-sequence-coprime-not-positive-integers = Keškenäh jaottomie yhistelmie ei voi vallita, šentäh kun vallittavat ei olla pozitiivisie kokonaislukuja.

select-from-sequence-coprime-common-factor = Keškenäh jaottomie lukuja ei voi vallita. Kaikilla mahollisilla arvoilla on yhtehini tekijä. (Miäriteltyjen "from"- tahi "to"-arvoloin pitäy olla jaottomie "step"-arvon kera.)

select-from-sequence-coprime-single-number = Keškenäh jaottomie yhistelmie ei voi vallita yhestä luvušta, kumpani ei ole 1.

select-from-sequence-excluded-too-many-combinations = selectFromSequence-komponentissa šuljettih pois yli 70 % yhistelmistä

select-from-sequence-coprime-none-found = Keškenäh jaottomie lukuja ei šuatu vallita. Kaikilla mahollisilla arvoilla on yhtehini tekijä.

select-from-sequence-too-few-unique-values = Ei voi vallita { $numToSelect } ainutluatuista arvuo jonošta, kumpasen pituus on { $numPossibleValues }

select-prime-numbers-too-few-values = Ei voi vallita { $numToSelect } arvuo alkulukulistašta, kumpasen pituus on { $numValues }

select-prime-numbers-values-count-mismatch = selectillä miäriteltyjen arvoloin miärän pitäy vaššata vallittavien miäryä

select-prime-numbers-values-not-prime = Kaikkien alkuluvun valintah miäriteltyjen arvoloin pitäy olla alkulukulistašša

select-prime-numbers-values-excluded-combination = selectPrimeNumbersilla miäritellyt arvot muovvoššettih poisšuljetun yhistelmän

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers-komponentissa šuljettih pois yli 70 % yhistelmistä

select-random-combination-fluke = Äärimmäisen epätoventuntusen šattuman täh šatunnaisarvoloin yhistelmyä ei šuatu vallita

select-random-value-fluke = Äärimmäisen epätoventuntusen šattuman täh šatunnaisarvuo ei šuatu vallita
