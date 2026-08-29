# Meänkieli (Tornedalen Finnish) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Latin alphabet, in Meänkieli's own orthography — a recognized
# national minority language of Sweden with a norm of its own, not a dialect
# spelling of Finnish. Where this file's spelling parts from `locales/fi`'s:
# the d that Finnish writes is absent (eellinen, kahen, yhistelmä, joien,
# pituuet, löyy, luoa, voia, toeta, nähäksesi, uuelleen, säe, mahollinen),
# Finnish eA is iA (vihriä, ruskia, oikian, korkian), Finnish ts is tt
# (kattelin, esikattelu), the illative carries its h (kohtheesen), and «olla»
# is «oon» in the third person singular where Finnish writes «on».
#
# **That last rule belongs to the prose and not to the keys.** A Fluent
# variant key is matched against the value the core passes, not translated, so
# `style-definition-insufficient-contrast` writing `[text-oon-background]` and
# `[text-oon-canvas]` — the `on` → `oon` rule applied to the selector — made
# both branches unreachable and sent every such warning to the default. They
# are `[text-on-background]` and `[text-on-canvas]` again, with the Meänkieli
# prose beside them untouched, and `chrome.test.ts` now holds every catalog's
# variant keys against English so the class cannot come back.
#
# **One block here is written in a heavier orthography than the rest of the
# file, and the seed could not decide which is the norm.** The field and
# function messages near the end write the h-infix passive and a degeminated
# stem — «ohitethaan», «annethaan», «käytethään», «suohraan», «sijhaan»,
# «lausekheen», «kirjotettu», «annetula funktiola», «sisälä», «yhelä» — where
# the other fifty passives in this file, and the identical phrase «sen sijaan»
# two hundred lines above, write «ohitetaan», «suoraan», «sijaan»,
# «lausekkeen» and the geminate. Both are real Meänkieli; which one this
# catalog should keep is a norm question a speaker has to settle, so the block
# is left as it stands rather than levelled to a guess, and the rules above
# deliberately do not claim an h-infix or a degemination rule.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# After any numeral above one the noun stands in the partitive singular, so a
# `{ $count -> … }` here separates two cases rather than two numbers.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } ohitetaan, kun kaksi päätepistettä oon määritetty

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } ohitetaan, kun sekä päätepiste että keskipiste oon määritetty

line-segment-midpoint-offset-without-midpoint = midpointOffset-attribuutilla ei ole vaikutusta ilman midpoint-arvoa

## `<line>`

line-points-undetermined-dimensions = Suora pisteitten kautta, joien ulottuvuuksien määrä oon tuntematon.

line-points-too-few-dimensions = Suoran oon kuljettava vähintään kaksiulotteisten pisteitten kautta.

line-points-depend-on-variables = Suora kulkee pisteitten kautta, jotka riippuvat muuttujista: { $variables }.

line-equation-invalid-format = Virheellinen muoto suoran yhtälölle muuttujissa { $variable1 } ja { $variable2 }.

## `<ray>`

ray-overprescribed-through = Puolisuora oon määrätty attribuuteilla through, endpoint ja direction.  Määritetty through ohitetaan.

ray-dimension-mismatch = numDimensions-ristiriita puolisuorassa.

## `<vector>`

vector-overprescribed-head = Vektori oon määrätty attribuuteilla head, tail ja displacement.  Määritetty head ohitetaan.

vector-dimension-mismatch = numDimensions-ristiriita vektorissa.

## Attracting and constraining

attract-to-without-nearest-point = Kohtheesen `<{ $component }>` ei voi vetää, koska sillä ei ole nearestPoint-tilamuuttujaa.

constrain-to-without-nearest-point = Kohtheesen `<{ $component }>` ei voi rajoittaa, koska sillä ei ole nearestPoint-tilamuuttujaa.

constrain-to-interior-without-nearest-point = Kohteen `<{ $component }>` sisäosaan ei voi rajoittaa, koska sillä ei ole nearestPoint-tilamuuttujaa.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ohitetaan, kun choiceInput ei ole inline

## Ordering children by index

choice-input-indices-count-mismatch = choiceInputille määritetyt indeksit ohitetaan, koska niien määrä ei vastaa choice-lapsien määrää.

pretzel-indices-count-mismatch = problemille määritetyt indeksit ohitetaan, koska niien määrä ei vastaa problem-lapsien määrää.

shuffle-indices-count-mismatch = shuffle-komponentille määritetyt indeksit ohitetaan, koska niien määrä ei vastaa komponenttien määrää.

indices-ignored-out-of-range = Kohteelle { $component } määritetyt indeksit ohitetaan, koska osa niistä oon alueen ulkopuolella.

pretzel-indices-repeated = pretzelille määritetyt indeksit ohitetaan, koska osa niistä toistuu.

pretzel-circuit-first-index = pretzelille circuit-tilassa määritetyt indeksit ohitetaan, koska ensimmäisen indeksin oon oltava 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Jotta `<{ $component }>` toimisi merkkijonolapsien kanssa, oon määritettävä `type`-attribuutti.

invalid-type-defaulting-to-math = Virheellinen type { $type } komponentille { $component }. Sen oon oltava math, text, number tai boolean. Käytetään arvoa math.

string-not-valid-component-to-arrange = Merkkijono ”{ $value }” ei kelpaa komponentiksi kohteelle { $component }. Ohitetaan.

## Types and variables

invalid-type-defaulting-to-number = Virheellinen type { $type }, typeksi asetetaan number.

invalid-variable-value = Muuttujan virheellinen arvo: `{ $value }`

## Variants

variant-index-must-be-number = Muunnelman indeksin { $index } oon oltava luku

variant-index-must-be-integer = Muunnelman indeksin { $index } oon oltava kokonaisluku

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ei ole toteutettu absoluuttisille mitoille. Leveydet asetetaan suhteellisiksi.

side-by-side-absolute-margins = `<{ $component }>` ei ole toteutettu absoluuttisille mitoille. Marginaalit asetetaan suhteellisiksi.

side-by-side-no-block-child = Virheellinen `<{ $component }>`: sillä oon oltava vähintään yksi lohkotason lapsi.

## `<label>`

label-for-ignored-on-graphical = Graafisen `<label>`-elementin `for`-attribuutti ohitetaan.

label-for-must-resolve-to-one = `<label>`-elementin `for`-attribuutin oon osoitettava täsmälleen yhteen komponenttiin.

label-for-unresolved = `<label>`-elementin `for`-attribuuttia ei voitu yhistää komponenttiin.

label-for-answer-with-authored-inputs = `<label>`-elementin `for`-attribuutti viittaa `<answer>`-elementtiin, jolla oon erikseen kirjoitetut syötteet; viittaa suoraan syötteeseen.

label-for-answer-without-input = `<label>`-elementin `for`-attribuutti viittaa `<answer>`-elementtiin, jolla ei ole nimettävää syötettä.

label-for-must-reference-input-or-answer = `<label>`-elementin `for`-attribuutin oon viitattava syötteeseen tai answer-elementtiin.

## Accessibility

accessibility-short-description-or-decorative = Saavutettavuuden vuoksi `<{ $component }>` tarvitsee joko lyhyen kuvauksen tai merkinnän koristeelliseksi.

accessibility-video-short-description = Saavutettavuuden vuoksi `<video>` tarvitsee lyhyen kuvauksen.

accessibility-input-short-description-or-label = Saavutettavuuden vuoksi `<{ $component }>` tarvitsee lyhyen kuvauksen tai nimikkeen.

accessibility-answer-input-short-description-or-label = Saavutettavuuden vuoksi syötteen luova `<answer>` tarvitsee lyhyen kuvauksen tai nimikkeen.

accessibility-short-description-contains-math = Lyhyet kuvaukset eivät saisi sisältää matemaattisia komponentteja, kuten `<{ $component }>`. Kirjoita matematiikka sanoin.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ei anna riittävää kontrastia luvun otsikkotekstille (tumma tila) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vaaditaan vähintään { $threshold }:1).
       *[other] { $colorName } ei anna riittävää kontrastia luvun otsikkotekstille ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vaaditaan vähintään { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` { $count } pisteen kautta ei ole toteutettu tapauksessa, jossa pisteillä ei ole numeerisia arvoja.

circle-too-many-through-points = Ympyrää ei voi laskea useamman kuin 3 pisteen kautta.

circle-overprescribed-radius-center-points = Ympyrää ei voi laskea, kun säe, keskipiste ja pisteet oon kaikki määritetty.

circle-center-with-multiple-points = Ympyrää, jolla oon määritetty keskipiste, ei voi laskea useamman kuin 1 pisteen kautta.

circle-radius-too-small = Ympyrää ei voi laskea: kun pisteitten välinen etäisyys oon { $distance }, määritetty säe { $radius } oon liian pieni.

circle-radius-with-many-points = Ympyrää ei voi luoa useamman kuin kahen pisteen kautta, kun säe oon määritetty.

circle-invalid-center-or-through-points = Ympyrän keskipiste tai pisteet ovat virheellisiä.

circle-radius-center-with-multiple-points = Määritetyn keskipisteen ympyrän säettä ei voi laskea useamman kuin 1 pisteen kautta.

circle-change-radius-non-numerical = Ympyrän säettä ei voi muuttaa, kun pisteet eivät ole numeerisia

circle-radius-with-points-non-numerical = Ympyrää ei voi luoa useamman kuin yhen pisteen kautta määritetyllä säteellä, kun numeerisia arvoja ei ole.

circle-change-center-non-numerical = Ei-numeeristen pisteitten kautta kulkevan ympyrän keskipisteen muuttamista ei ole toteutettu.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Funktion määrittelyjoukon ulottuvuuksia oon liian vähän. Joukossa oon { $intervals } väli, mutta funktiolla oon { $inputs ->
            [one] { $inputs } syöte
           *[other] { $inputs } syötettä
        }.
       *[other] Funktion määrittelyjoukon ulottuvuuksia oon liian vähän. Joukossa oon { $intervals } väliä, mutta funktiolla oon { $inputs ->
            [one] { $inputs } syöte
           *[other] { $inputs } syötettä
        }.
    }

function-domain-invalid-format = Virheellinen muoto funktion määrittelyjoukolle.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Funktion ei-numeerinen maksimi ohitetaan.
        [minimum] Funktion ei-numeerinen minimi ohitetaan.
        [extremum] Funktion ei-numeerinen ääriarvo ohitetaan.
        [point] Funktion ei-numeerinen piste ohitetaan.
        [slope] Funktion ei-numeerinen kulmakerroin ohitetaan.
       *[other] Funktion ei-numeerinen { $type } ohitetaan.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Funktion tyhjä maksimi ohitetaan.
        [minimum] Funktion tyhjä minimi ohitetaan.
        [extremum] Funktion tyhjä ääriarvo ohitetaan.
        [point] Funktion tyhjä piste ohitetaan.
       *[other] Funktion tyhjä { $type } ohitetaan.
    }

function-points-too-close = Funktiossa oon kaksi pistettä, joien sijainnit ovat liian lähellä toisiaan. Funktiota ei voi määritellä.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Funktion iteraatiot ovat mahollisia vain, jos syötteiden määrä oon sama kuin tulosteiden. Tällä funktiolla oon { $inputs } syöte ja { $outputs ->
            [one] { $outputs } tuloste
           *[other] { $outputs } tulostetta
        }.
       *[other] Funktion iteraatiot ovat mahollisia vain, jos syötteiden määrä oon sama kuin tulosteiden. Tällä funktiolla oon { $inputs } syötettä ja { $outputs ->
            [one] { $outputs } tuloste
           *[other] { $outputs } tulostetta
        }.
    }

## `<sequence>`

sequence-invalid-length = Jonon pituus oon virheellinen.  Sen oon oltava ei-negatiivinen kokonaisluku.

sequence-invalid-step = Jonon askel oon virheellinen.  Tyypin { $type } jonossa sen oon oltava luku.

sequence-invalid-endpoint-number = Lukujonon ”{ $attribute }” oon virheellinen.  Sen oon oltava luku.

sequence-invalid-endpoint-letters = Kirjainjonon ”{ $attribute }” oon virheellinen.  Sen oon oltava kirjainyhistelmä.

sequence-invalid-endpoint = Jonon ”{ $attribute }” oon virheellinen.

select-from-sequence-coprime-not-numbers = coprime ohitetaan, koska valittavat eivät ole lukuja

select-from-sequence-coprime-with-exclude-combinations = coprime ohitetaan, koska excludeCombinations oon määritetty

## Resolving a `target`

target-not-found = Virheellinen target kohteelle `<{ $source }>`: kohdetta ei löyy.

target-state-variable-not-found = Virheellinen target kohteelle `<{ $source }>`: tilamuuttujaa ”{ $property }” ei löyy komponentista `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>`-elementin muuttujien oon oltava eri kuin riippumaton muuttuja.

ode-system-duplicate-variable-names = Differentiaaliyhtälön oikian puolen funktioita ei voi määritellä, jos riippuvien muuttujien nimet toistuvat.

ode-system-rhs-function-error = Differentiaaliyhtälön oikian puolen funktiota ei voi määritellä.  Virhe mathjs-funktion luonnissa.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Kulmaa { $count } suoran välillä ei voi määritellä

angle-invalid-through-point = Virheellinen piste `<angle>`-elementin through-attribuutissa

parabola-vertex-too-many-points = Huipulla määriteltyä paraabelia useamman kuin 1 pisteen kautta ei ole toteutettu.

parabola-too-many-points = Paraabelia useamman kuin 3 pisteen kautta ei ole toteutettu.

intersection-too-many-items = Useamman kuin kahen kohteen leikkausta ei ole toteutettu

## Other math components

ionic-compound-not-two-ions = Ioniyhistettä ei ole toteutettu muulle kuin kahele ionille.

ionic-compound-needs-cation-and-anion = Ioniyhiste oon toteutettu vain yhele kationille ja yhele anionille.

solve-equations-cannot-evaluate = Yhtälöä ei voi ratkaista, koska sitä ei voitu laskea: { $equation }

math-operators-operand-number-required = operandNumber oon määritettävä, kun matemaattinen operandi poimitaan.

eigen-decomposition-failed = Matriisin ominaisarvoja ei voitu laskea

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parametri { $parameters } ei esiinny hahmossa, joten se osuu aina tyhjään.
       *[other] `<matchesPattern>`: parametrit { $parameters } eivät esiinny hahmossa, joten ne osuvat aina tyhjään.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: arvoa grid="{ $grid }" ei voi tulkita. Sen oon oltava none, medium, dense tai kaksi välilyönnillä erotettua positiivista lukua, esimerkiksi grid="1 0.5". Ruudukkoa ei piirretä.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ei ole tuettu prefigure-piirtomoduulissa; käytetään right-arvon toimintaa.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ei ole tuettu prefigure-piirtomoduulissa; käytetään top-arvon toimintaa.

prefigure-invalid-axis-bounds = `<graph>`: virheelliset akselirajat prefigure-muunnokseen; käytetään oletusarvoa bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: virheellinen leveys prefigure-muunnokseen; käytetään oletusleveyttä 425.

prefigure-invalid-aspect-ratio = `<graph>`: virheellinen aspectRatio prefigure-muunnokseen; käytetään oletussuhdetta 1.

prefigure-grid-spacing-too-fine = `<graph>`: ruudukon väli oon liian tiheä akselirajoihin nähen; ruudukko jätetään pois prefigure-piirtomoduulissa.

prefigure-annotations-not-rendered = `<graph>`: merkintöjä ei piirretä, ellei käytetä PreFigure-piirtomoduulia.

multiple-annotations-children = `<graph>`-elementistä löytyi useita `<annotations>`-lapsia; kaikki viimeistä lukuun ottamatta ohitetaan.

## Referring to other components

copy-unrecognized-component-type = Tuntematonta komponenttityyppiä ei voi laajentaa eikä kopioia: { $type }.

copy-prop-not-found = Ominaisuutta { $property } ei löytynyt tyypin { $component } komponentista

collect-no-source = collectille ei löytynyt lähdettä.

collect-invalid-component-type = Tyypin `<{ $component }>` komponentteja ei voi kerätä, koska tyyppi oon virheellinen.

reference-index-unavailable = Indeksiin `{ $reference }` ei voi viitata

## `<callAction>`

component-action-unavailable = Komponentissa `{ $reference }` ei voi kutsua toimintoa { $action }

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Datan muoto oon virheellinen.  Rivien pituuet vaihtelevat. Löytyi kohdasta componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Datassa oon samoja sarakenimiä.  Löytyi kohdasta componentIdx :{ $componentIdx }

data-frame-missing-column-name = Datasta puuttuu sarakenimi.  Löytyi kohdasta componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Tämän vastauksen award perustuu answer-tunnisteen omaan lähetettyyn vastaukseen, mikä johtaa odottamattomaan toimintaan.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts`-arvon asettaminen `<answer>`-elementtiin, joka oon `sectionWideCheckWork`-säiliön sisällä, ei vaikuta mihinkään, koska säiliö ohjaa yritysten määrää. Aseta `maxNumAttempts` säiliöön.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts`-arvon asettaminen `sectionWideCheckWork`-säiliöön, joka oon toisen `sectionWideCheckWork`-säiliön sisällä, ei vaikuta mihinkään, koska ulompi säiliö ohjaa yritysten määrää. Aseta `maxNumAttempts` ulompaan säiliöön.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Attribuutilla { $attributes } ei ole vaikutusta ilman symbolicEquality-asetusta.
       *[other] Attribuuteilla { $attributes } ei ole vaikutusta ilman symbolicEquality-asetusta.
    }

answer-invalid-type = Virheellinen tyyppi answer-elementille: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Koska komponentilla `<{ $component }>` ei ole nimeä, sitä ei voi käyttää moduulin attribuuttina

module-attribute-name-already-defined = Komponenttia `<{ $component } name="{ $name }">` ei voi käyttää moduulin attribuuttina, koska komponenttityypillä `<module>` oon jo attribuutti ”{ $name }”.

conditional-content-condition-ignored = `condition`-attribuutti ohitetaan `<conditionalContent>`-komponentissa, jolla oon case- tai else-lapsia.

slider-markers-type-mismatch = Merkkien tyyppi ei vastaa liukusäätimen tyyppiä.

pretzel-problem-needs-statement-and-answer = Virheellinen pretzel: jokaisessa `<problem>`-elementissä oon oltava yksi `<statement>` ja yksi `<answer>`.

pretzel-circuit-first-problem-distractor = Virheellinen pretzel: tilassa mode="circuit" ensimmäinen `<problem>` ei voi olla harhautin.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Virheellinen arvo { $values } attribuutille `{ $attribute }`; ohitetaan.
       *[other] Virheelliset arvot { $values } attribuutille `{ $attribute }`; ohitetaan.
    }

attribute-must-be-references = Virheellinen arvo `{ $value }` attribuutille `{ $attribute }`. Attribuutin oon koostuttava viittauksista, jotka alkavat merkillä `$`.

math-input-invalid-function-names = <mathInput>: virheelliset funktioitten nimet ohitettiin kohdassa { $attribute }: { $names }. Kunkin nimen näkyvässä osassa oon oltava vähintään 2 merkkiä (kirjaimia tai yhysmerkkejä); sen jälkeen voi tulla valinnainen `|<mathspeak alternative>` -pääte.

## Building components from the source

component-type-invalid = Virheellinen komponenttityyppi: `<{ $componentType }>`

attribute-repeated = Attribuuttia { $attribute } ei voi toistaa.

attribute-invalid-for-component = Virheellinen attribuutti ”{ $attribute }” tyypin `<{ $componentType }>` komponentille.

## Style definition contrast

style-definition-insufficient-contrast =
    Tyylimäärittelyn { $styleNumber } kontrasti oon riittämätön { $context ->
        [text-on-background] tekstin värin ja taustavärin välillä
        [high-contrast] korkian kontrastin värin ja piirtoalustan välillä
        [line] viivan värin ja piirtoalustan välillä
        [marker] merkin värin ja piirtoalustan välillä
       *[text-on-canvas] tekstin värin ja piirtoalustan välillä
    }{ $mode ->
        [dark] { " (tumma tila)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vaaditaan vähintään { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Vaikka tyylimäärittely { $styleNumber } antaa vaaleaan tilaan riittävän kontrastin värit, näistä arvoista johdetuilla tumman tilan väreillä tekstin värin ja taustavärin kontrasti oon riittämätön ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vaaditaan vähintään { $threshold }:1). { $suggestion ->
        [available] Riittävän kontrastin saamiseksi tummassa tilassa joko lisää kontrastia vaaleassa tilassa (esim. { $lightAttribute }="{ $lightColor }") tai korvaa tumman tilan väri (esim. { $darkAttribute }="{ $darkColor }").
       *[none] Riittävän kontrastin saamiseksi tummassa tilassa lisää kontrastia vaaleassa tilassa tai korvaa johdetut värit asetuksilla textColorDarkMode ja/tai backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Vaikka tyylimäärittely { $styleNumber } antaa vaaleaan tilaan riittävän kontrastin tekstivärin, tästä arvosta johdetun tumman tilan tekstivärin kontrasti piirtoalustaan nähen oon riittämätön ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vaaditaan vähintään { $threshold }:1). { $suggestion ->
        [available] Riittävän kontrastin saamiseksi tummassa tilassa joko lisää kontrastia vaaleassa tilassa (esim. textColor="{ $lightColor }") tai korvaa tumman tilan väri (esim. textColorDarkMode="{ $darkColor }").
       *[none] Riittävän kontrastin saamiseksi tummassa tilassa lisää kontrastia vaaleassa tilassa tai korvaa johdettu väri asetuksella textColorDarkMode.
    }

section-multiple-style-palettes = Luku voi valita vain yhen <stylePalette>-elementin; käytetään viimeistä.

## Unique variants

variant-num-to-select-not-non-negative-integer = kohteen { $component } yksilöllisiä muunnelmia ei voi määrittää, koska numToSelect ei ole ei-negatiivinen kokonaisluku.

variant-num-to-select-not-constant-number = kohteen { $component } yksilöllisiä muunnelmia ei voi määrittää, koska numToSelect ei ole vakioluku.

variant-with-replacement-not-constant-boolean = kohteen { $component } yksilöllisiä muunnelmia ei voi määrittää, koska withReplacement ei ole vakiototuusarvo.

variant-select-weight-disables-unique = selectin yksilölliset muunnelmat oon poistettu käytöstä, jos jollakin vaihtoehdolla oon selectWeight tai selectForVariants

variant-coprime-undetermined = kohteen { $component } yksilöllisiä muunnelmia ei voi määrittää, koska ei voia toeta, että coprime oon aina epätosi.

variant-attribute-not-constant = kohteen { $component } yksilöllisiä muunnelmia ei voi määrittää, koska { $attribute } ei ole vakio.

variant-attribute-not-number = kohteen { $component } yksilöllisiä muunnelmia ei voi määrittää, koska { $attribute } ei ole luku.

variant-attribute-wrong-type-for-sequence =
    tyypin { $type } kohteen { $component } yksilöllisiä muunnelmia ei voi määrittää, koska { $attribute } ei ole { $expected ->
        [letters-combination] kirjainyhistelmä
        [math-expression] kelvollinen matemaattinen lauseke
        [integer] kokonaisluku
       *[number] luku
    }.

variant-length-not-integer = kohteen { $component } yksilöllisiä muunnelmia ei voi määrittää, koska length ei ole kokonaisluku.

variant-sort-not-implemented = kohteen { $component } yksilöllisiä muunnelmia sortin kanssa ei ole toteutettu

variant-exclude-combinations-not-implemented = kohteen { $component } yksilöllisiä muunnelmia excludeCombinationsin kanssa ei ole toteutettu

variant-math-exclude-not-implemented = math-tyyppisen kohteen { $component } yksilöllisiä muunnelmia excluden kanssa ei ole toteutettu

variant-non-constant-exclude-not-implemented = kohteen { $component } yksilöllisiä muunnelmia ei-vakion excluden kanssa ei ole toteutettu

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ei tuettu graph prefigure -piirtomoduulissa; jälkeläinen ohitettiin.

prefigure-descendant-invalid-geometry = { $subject }: ääretön tai puutteellinen geometria; jälkeläinen ohitettiin.

prefigure-curve-label-omitted = { $subject }: nimikkeitä ei tueta muunnetuissa käyräelementeissä; nimike jätettiin pois.

prefigure-curve-unsupported-definition-type = { $subject }: käyrän määrittelytyyppiä ”{ $definitionType }” ei tueta; jälkeläinen ohitettiin.

prefigure-region-flip-functions-unsupported = { $subject }: flipFunctions-attribuuttia ei tueta regionBetweenCurves-elementissä; jälkeläinen ohitettiin.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves tukee vain kaavamuotoisia lapsifunktioita; jälkeläinen ohitettiin.

prefigure-label-position-unsupported =
    { $subject }: labelPosition ”{ $labelPosition }” ei ole tuettu kohteelle { $labelKind ->
        [line-family] suoraperheen nimike
       *[point] pisteen nimike
    }; käytettiin PreFiguren oletustasausta.

prefigure-fill-style-unsupported = { $subject }: täyttötyyliä ”{ $fillStyle }” PreFigure ei tue; käytetään yhtenäistä täyttöä.

prefigure-line-style-unknown = { $subject }: tuntematon viivatyyli ”{ $lineStyle }” jätettiin pois PreFiguren tulosteesta.

prefigure-marker-style-mapped-to-diamond = { $subject }: merkkityyli ”{ $markerStyle }” kuvattiin PreFiguren tyyliksi ”diamond”.

prefigure-marker-style-unsupported = { $subject }: merkkityyliä ”{ $markerStyle }” PreFigure ei tue; käytettiin oletustyyliä.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: virheellinen `ref`; kohdetta ei voi selvittää. Merkintä jätettiin pois.

annotation-ref-multiple-targets = `<annotation>`: `ref` osoitti useaan kohtheesen; käytetään ensimmäistä.

annotation-ref-outside-graph = `<annotation>`: virheellinen `ref`; kohde oon sisältävän kuvaajan ulkopuolella. Merkintä jätettiin pois.

annotation-ref-unsupported-target = `<annotation>`: virheellinen `ref`; kohde ei ole tuettu graafinen objekti prefigure-muunnoksessa. Merkintä jätettiin pois.

annotation-text-missing = `<annotation>`: `text` puuttuu tai oon tyhjä; tulostetaan tyhjä teksti.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Havaittiin kehämäinen riippuvuus.
       *[other] Havaittiin kehämäinen riippuvuus, jossa oon mukana `<{ $componentType }>`-komponentti.
    }

reference-no-referent = Viittaukselle ei löytynyt kohdetta: `{ $reference }`

reference-multiple-referents = Viittaukselle löytyi useita kohteita: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Virheellinen muoto komponentin `<{ $componentType }>` attribuutille { $attribute }.

children-invalid = Virheellisiä lapsia elementissä `<{ $componentType }>`: löytyi virheellisiä lapsia: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Virheellinen arvo `{ $value }` attribuutille `{ $attribute }`, käytetään arvoa `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML-versiota { $version } ei löytynyt.
       *[other] DoenetML-versiota { $version } ei löytynyt. Käytetään versiota { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Virheellinen DoenetML: { $content }

parse-tag-missing-close-tag = Virheellinen DoenetML: Tunnisteella `{ $tag }` ei ole sulkevaa tunnistetta. Odotettiin itsesulkeutuvaa tunnistetta tai tunnistetta `</{ $tagName }>`.

parse-tag-error = Virheellinen DoenetML: Virhe tunnisteessa `<{ $tagName }>`

parse-attribute-missing-value = Virheellinen DoenetML: Virheelliseltä attribuutilta `{ $attribute }` näyttää puuttuvan arvo.

parse-attribute-invalid = Virheellinen DoenetML: Virheellinen attribuutti `{ $attribute }`

parse-attribute-value-invalid = Virheellinen DoenetML: Virheellinen attribuutin arvo `{ $value }`

parse-attribute-value-quote-mismatch = Virheellinen DoenetML: Virheellinen attribuutin arvo `{ $value }`. Lainausmerkit eivät vastaa toisiaan. Näyttää puuttuvan `{ $quote }`

parse-open-tag-name-missing = Virheellinen DoenetML: Löytyi tunniste ilman nimeä, esim. `<`

parse-tag-not-closed = Virheellinen DoenetML: Tunnistetta `{ $tag }` ei suljettu (näyttää puuttuvan `>`).

parse-self-closing-tag-name-missing = Virheellinen DoenetML: Löytyi tunniste ilman nimeä `<{ $content }>`

parse-self-closing-tag-not-closed = Virheellinen DoenetML: Tunnistetta `{ $tag }` ei suljettu (näyttää puuttuvan `/>`).

parse-tag-invalid-attributes = Virheellinen DoenetML: Tunniste `{ $tag }` ei kelpaa. Sillä voi olla virheellisiä attribuutteja.

parse-close-tag-name-missing = Virheellinen DoenetML: Löytyi sulkeva tunniste ilman nimeä, esim. `</`

parse-attribute-value-unquoted = Attribuuttien arvot oon kirjoitettava lainausmerkkeihin: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Virheellinen DoenetML: Löytyi sulkeva tunniste `{ $tag }`, mutta ei vastaavaa avaavaa tunnistetta

parse-close-tag-mismatched = Virheellinen DoenetML: Sulkeva tunniste ei vastaa avaavaa. Odotettiin `</{ $expected }>`. Löytyi `{ $found }`

parser-node-unconvertible = Solmua { $node } ei voitu muuntaa Dast-solmuksi.

## Names

name-attribute-invalid =
    Virheellinen attribuutti name='{ $name }'. { $reason ->
        [characters] Nimissä voi olla vain kirjaimia, numeroita, alaviivoja tai yhysmerkkejä.
       *[start] Nimien oon alettava kirjaimella.
    }

component-name-invalid-start = Virheellinen komponentin nimi ”{ $name }”. Nimien oon alettava kirjaimella.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched-tyyppisellä answer-elementillä oon oltava video-attribuutti

answer-video-watched-video-not-reference = videoWatched-tyyppisen answer-elementin video-attribuutin oon oltava viittaus

answer-name-not-single-text = answer-elementin name-attribuutilla oon oltava yksi tekstilapsi

## Referencing another document

external-doenetml-recursion-limit = Ulkoista DoenetML:ää ei voitu hakea liian monen rekursiotason vuoksi. Onko tässä kehäviittaus?

external-doenetml-unavailable = DoenetML:ää ei voitu hakea kohteesta { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Kohteesta { $attribute }="{ $uri }" haettu DoenetML oon virheellinen: se ei vastaa komponenttityyppiä ”{ $componentType }”

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Attribuutti `{ $from }` oon vanhentunut; käytä sen sijaan `{ $to }`.
       *[other] [deprecation] Komponentin `<{ $component }>` attribuutti `{ $from }` oon vanhentunut; käytä sen sijaan `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Attribuutti `{ $from }` oon vanhentunut ja ohitetaan, koska myös `{ $to }` oon määritetty.
       *[other] [deprecation] Komponentin `<{ $component }>` attribuutti `{ $from }` oon vanhentunut ja ohitetaan, koska myös `{ $to }` oon määritetty.
    }

deprecated-attribute-ignored = [deprecation] Komponentin `<{ $component }>` attribuutti `{ $attribute }` oon vanhentunut ja ohitetaan.


## Language coverage

pluralize-english-only = `<pluralize>` osaa taivuttaa monikkoon vain englanniksi, joten kielellä { $locale } kirjoitetussa asiakirjassa sen teksti jää ennalleen. Kirjoita monikkomuoto suoraan tai aseta se `pluralForm`-attribuutilla.


## Checking against the schema

schema-element-unrecognized = Elementti `<{ $tag }>` ei ole tunnettu Doenet-elementti.

schema-element-not-allowed-at-root = Elementti `<{ $tag }>` ei ole sallittu asiakirjan juuressa.

schema-element-not-allowed-inside = Elementti `<{ $tag }>` ei ole sallittu elementin `<{ $parent }>` sisällä.

schema-attribute-unrecognized = Elementillä `<{ $tag }>` ei ole attribuuttia nimeltä `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Elementin `<{ $tag }>` attribuutin `{ $attribute }` oon oltava lista, jonka jokainen alkio oon jokin näistä: { $allowed }
       *[other] Elementin `<{ $tag }>` attribuutin `{ $attribute }` oon oltava jokin näistä: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Virheellinen muunnelman nimi selectille.  Muunnelman nimi { $variantName } esiintyy { $numOptions } vaihtoehdossa, mutta valittavien määrä oon { $numToSelect }.

select-variant-name-without-options = selectille oon määritetty muunnelmia, mutta maholliselle muunnelman nimelle ei ole vaihtoehtoja: { $variantName }.

select-variant-name-not-possible = selectille määritetty muunnelman nimi { $variantName } ei ole mahollinen muunnelman nimi.

select-too-few-options = Ei voi valita { $numToSelect } komponenttia vain { $numOptions } vaihtoehdosta.

select-from-sequence-too-few-values = Ei voi valita { $numToSelect } arvoa jonosta, jonka pituus oon { $length }.

select-from-sequence-indices-count-mismatch = selectille määritettyjen indeksien määrän oon vastattava valittavien määrää

select-from-sequence-indices-not-integers = Kaikkien selectille määritettyjen indeksien oon oltava kokonaislukuja

select-from-sequence-index-excluded = selectfromsequence-komponentille määritetty indeksi oli poissuljettu

select-from-sequence-indices-excluded-combination = selectfromsequence-komponentille määritetyt indeksit muodostivat poissuljetun yhistelmän

select-from-sequence-coprime-not-positive-integers = Keskenään jaottomia yhistelmiä ei voi valita, koska valittavat eivät ole positiivisia kokonaislukuja.

select-from-sequence-coprime-common-factor = Keskenään jaottomia lukuja ei voi valita. Kaikilla mahollisilla arvoilla oon yhteinen tekijä. (Määritettyjen "from"- tai "to"-arvojen oon oltava jaottomia "step"-arvon kanssa.)

select-from-sequence-coprime-single-number = Keskenään jaottomia yhistelmiä ei voi valita yhestä luvusta, joka ei ole 1.

select-from-sequence-excluded-too-many-combinations = selectFromSequence-komponentissa suljettiin pois yli 70 % yhistelmistä

select-from-sequence-coprime-none-found = Keskenään jaottomia lukuja ei voitu valita. Kaikilla mahollisilla arvoilla oon yhteinen tekijä.

select-from-sequence-too-few-unique-values = Ei voi valita { $numToSelect } yksilöllistä arvoa jonosta, jonka pituus oon { $numPossibleValues }

select-prime-numbers-too-few-values = Ei voi valita { $numToSelect } arvoa alkulukulistasta, jonka pituus oon { $numValues }

select-prime-numbers-values-count-mismatch = selectille määritettyjen arvojen määrän oon vastattava valittavien määrää

select-prime-numbers-values-not-prime = Kaikkien alkuluvun valintaan määritettyjen arvojen oon oltava alkulukulistassa

select-prime-numbers-values-excluded-combination = selectPrimeNumbersille määritetyt arvot muodostivat poissuljetun yhistelmän

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers-komponentissa suljettiin pois yli 70 % yhistelmistä

select-random-combination-fluke = Äärimmäisen epätodennäköisen sattuman vuoksi satunnaisarvojen yhistelmää ei voitu valita

select-random-value-fluke = Äärimmäisen epätodennäköisen sattuman vuoksi satunnaisarvoa ei voitu valita

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` tarttee funktion, jossa oon { $expected ->
        [one] yksi tuloste, kulmakerroin y' joka pisteessä, esimerkiksi `y - x`
       *[other] kaksi tulostetta, vektori joka pisteessä, esimerkiksi `(y, -x)`
    }, mutta annetula funktiola oon { $found ->
        [one] { $found } tuloste
       *[other] { $found } tulostetta
    }. { $alternative ->
        [none] Mithään ei piiretä.
       *[other] `<{ $alternative }>` oon se komponentti sille funktiole. Mithään ei piiretä.
    }

field-function-attribute-ignored-with-child = `function`-attribuutti ohitethaan, koska funktio annethaan kans komponentin sisälä; sisälä olevaa käytethään. Anna funktio vain yhelä näistä tavoista.

field-variables-ignored =
    `<{ $component }>`: `variables`-attribuutti nimeää sen lausekheen muuttujat, joka oon kirjotettu suohraan komponentin sisäle. { $reason ->
        [function-child] Funktio annethaan tässä `<function>`-lapsena, joka nimeää omat muuttujansa, joten `variables` ohitethaan.
       *[no-expression] Semmoista lauseketta ei ole tässä annettu, joten `variables` ohitethaan.
    }

## Deprecated syntax, continued

deprecated-attribute-to-child = [deprecation] Komponentin `<{ $component }>` attribuutti `{ $attribute }` oon vanhentunut; käytä sen sijhaan `<{ $child }>`-lasta.

deprecated-attribute-value-renamed = [deprecation] Komponentin `<{ $component }>` attribuutin `{ $attribute }` arvo `{ $value }` oon vanhentunut; käytä sen sijhaan `{ $to }`.
