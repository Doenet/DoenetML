# Livvi-Karelian diagnostics. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the **Latin** alphabet, the official orthography of Livvi in the
# Republic of Karelia. Livvi is a language of the Russian Federation that is
# not written in Cyrillic.
#
# This catalog is the **Livvi (Olonets Karelian)** norm — the one the Karelian
# Republic publishes in. `locales/krl` is Karelian Proper (Viena / Northern), a
# separate ISO 639-3 language with no macrolanguage code over the pair; a
# reader of either norm can largely read the other, which is precisely why the
# two files are written separately rather than copied.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# The technical nouns are the Russian-mediated ones that written Livvi uses:
# «komponentu», «atribuuttu», «funktsii», «indeksu», «dokumentu», «tabličču».
# `locales/krl` takes the Finnic shapes instead.
#
# After any numeral above one a Livvi noun stands in the partitive singular, so
# a `{ $count -> … }` here separates two cases rather than two numbers. Both
# branches are still needed.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } jätetäh huomavotta, konzu kaksi loppupistuo on miäritetty
       *[other] { $attributes } jätetäh huomavotta, konzu kaksi loppupistuo on miäritetty
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } jätetäh huomavotta, konzu sego loppupisto sego keskipisto on miäritetty
       *[other] { $attributes } jätetäh huomavotta, konzu sego loppupisto sego keskipisto on miäritetty
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ei vaikuta nimidä ilmai midpoint-arvuo

## `<line>`

line-points-undetermined-dimensions = Suoru menöy pistoloin kauti, kudamien ulottuvuksien miäry ei ole tietty.

line-points-too-few-dimensions = Suoran pidäy mennä vähimyölleh kaksiulottehizien pistoloin kauti.

line-points-depend-on-variables = Suoru menöy pistoloin kauti, kudamat ollah kiini muuttujis: { $variables }.

line-equation-invalid-format = Viäry formu suoran yhtälölle muuttujis { $variable1 } da { $variable2 }.

## `<ray>`

ray-overprescribed-through = Puolisuoru on miärätty atribuuttoil through, endpoint da direction.  Miäritetty through jätetäh huomavotta.

ray-dimension-mismatch = numDimensions-ristiriidu puolisuoras.

## `<vector>`

vector-overprescribed-head = Vektoru on miärätty atribuuttoil head, tail da displacement.  Miäritetty head jätetäh huomavotta.

vector-dimension-mismatch = numDimensions-ristiriidu vektoras.

## Attracting and constraining

attract-to-without-nearest-point = Kohtehele `<{ $component }>` ei sua vediä, sendäh gu sil ei ole nearestPoint-tilamuuttujua.

constrain-to-without-nearest-point = Kohtehele `<{ $component }>` ei sua rajoittua, sendäh gu sil ei ole nearestPoint-tilamuuttujua.

constrain-to-interior-without-nearest-point = Kohtehen `<{ $component }>` sydämeh ei sua rajoittua, sendäh gu sil ei ole nearestPoint-tilamuuttujua.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition jätetäh huomavotta, konzu choiceInput ei ole inline

## Ordering children by index

choice-input-indices-count-mismatch = choiceInputale miäritetyt indeksat jätetäh huomavotta, sendäh gu niilöin miäry ei vastua choice-lapsien miäriä.

pretzel-indices-count-mismatch = problemale miäritetyt indeksat jätetäh huomavotta, sendäh gu niilöin miäry ei vastua problem-lapsien miäriä.

shuffle-indices-count-mismatch = shuffle-komponentale miäritetyt indeksat jätetäh huomavotta, sendäh gu niilöin miäry ei vastua komponentoin miäriä.

indices-ignored-out-of-range = Kohtehele { $component } miäritetyt indeksat jätetäh huomavotta, sendäh gu oza niilöis on alovehen ulgopuolel.

pretzel-indices-repeated = pretzelale miäritetyt indeksat jätetäh huomavotta, sendäh gu oza niilöis toistuu.

pretzel-circuit-first-index = pretzelale circuit-tilas miäritetyt indeksat jätetäh huomavotta, sendäh gu enzimäzen indeksan pidäy olla 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Ku `<{ $component }>` ruadas merkkijonolapsien kel, pidäy miärittiä `type`-atribuuttu.

invalid-type-defaulting-to-math = Viäry type { $type } komponentale { $component }. Sen pidäy olla math, text, number libo boolean. Käytetäh arvuo math.

string-not-valid-component-to-arrange = Merkkijono ”{ $value }” ei päi komponentakse kohtehele { $component }. Jätetäh huomavotta.

## Types and variables

invalid-type-defaulting-to-number = Viäry type { $type }, typekse pannah number.

invalid-variable-value = Muuttujan viäry arvo: `{ $value }`

## Variants

variant-index-must-be-number = Variantan indeksan { $index } pidäy olla lugu

variant-index-must-be-integer = Variantan indeksan { $index } pidäy olla kogonaine lugu

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ei ole toteutettu absoluuttizile mitoile. Levevykset pannah suhtehellizikse.

side-by-side-absolute-margins = `<{ $component }>` ei ole toteutettu absoluuttizile mitoile. Marginualat pannah suhtehellizikse.

side-by-side-no-block-child = Viäry `<{ $component }>`: sil pidäy olla vähimyölleh yksi blokutazon lapsi.

## `<label>`

label-for-ignored-on-graphical = Grafiekallizen `<label>`-elementan `for`-atribuuttu jätetäh huomavotta.

label-for-must-resolve-to-one = `<label>`-elementan `for`-atribuutan pidäy ozuttua tarkah yhteh komponentah.

label-for-unresolved = `<label>`-elementan `for`-atribuuttua ei suadu yhtistiä komponentah.

label-for-answer-with-authored-inputs = `<label>`-elementan `for`-atribuuttu viittuau `<answer>`-elementah, kudamal on eriže kirjutetut syötöt; viittua kohtinäh syöttöh.

label-for-answer-without-input = `<label>`-elementan `for`-atribuuttu viittuau `<answer>`-elementah, kudamal ei ole nimitettäviä syöttyö.

label-for-must-reference-input-or-answer = `<label>`-elementan `for`-atribuutan pidäy viitata syöttöh libo answer-elementah.

## Accessibility

accessibility-short-description-or-decorative = Suavutettavuon täh `<{ $component }>` tarviččou libo lyhyön kuvavuksen libo merkinnän koristelevakse.

accessibility-video-short-description = Suavutettavuon täh `<video>` tarviččou lyhyön kuvavuksen.

accessibility-input-short-description-or-label = Suavutettavuon täh `<{ $component }>` tarviččou lyhyön kuvavuksen libo nimikkehen.

accessibility-answer-input-short-description-or-label = Suavutettavuon täh syötön luadii `<answer>` tarviččou lyhyön kuvavuksen libo nimikkehen.

accessibility-short-description-contains-math = Lyhyzis kuvavuksis ei pidäs olla matemaatiekallizii komponentoi, moizii kui `<{ $component }>`. Kirjuta matemuatiekku sanoil.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ei anna kylläl kontrastua luvun pandutekstale (tummu tila) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; pidäy olla vähimyölleh { $threshold }:1).
       *[other] { $colorName } ei anna kylläl kontrastua luvun pandutekstale ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; pidäy olla vähimyölleh { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` { $count } piston kauti ei ole toteutettu sit tapahtukses, konzu pistoloil ei ole numeerizii arvoloi.

circle-too-many-through-points = Ymbyrüy ei sua laskie enämbän gu 3 piston kauti.

circle-overprescribed-radius-center-points = Ymbyrüy ei sua laskie, konzu radiusu, keskipisto da pistot on kai miäritetty.

circle-center-with-multiple-points = Ymbyrüy, kudamal on miäritetty keskipisto, ei sua laskie enämbän gu 1 piston kauti.

circle-radius-too-small = Ymbyrüy ei sua laskie: konzu pistoloin keskine loitottus on { $distance }, miäritetty radiusu { $radius } on liijan pieni.

circle-radius-with-many-points = Ymbyrüy ei sua luadie enämbän gu kahten piston kauti, konzu radiusu on miäritetty.

circle-invalid-center-or-through-points = Ymbyrän keskipisto libo pistot ollah viärät.

circle-radius-center-with-multiple-points = Miäritetyn keskipiston ymbyrän radiusua ei sua laskie enämbän gu 1 piston kauti.

circle-change-radius-non-numerical = Ymbyrän radiusua ei sua muuttua, konzu pistot ei olla numeerizet

circle-radius-with-points-non-numerical = Ymbyrüy ei sua luadie enämbän gu yhten piston kauti miäritetyl radiusal, konzu numeerizii arvoloi ei ole.

circle-change-center-non-numerical = Ei-numeerizien pistoloin kauti menijän ymbyrän keskipiston muuttamistu ei ole toteutettu.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Funktsien miäritysjoukon ulottuvuksii on liijan vähä. Joukos on { $intervals } väli, ga funktsiel on { $inputs ->
            [one] { $inputs } syöttö
           *[other] { $inputs } syöttyö
        }.
       *[other] Funktsien miäritysjoukon ulottuvuksii on liijan vähä. Joukos on { $intervals } väliä, ga funktsiel on { $inputs ->
            [one] { $inputs } syöttö
           *[other] { $inputs } syöttyö
        }.
    }

function-domain-invalid-format = Viäry formu funktsien miäritysjoukole.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Funktsien ei-numeerine maksimu jätetäh huomavotta.
        [minimum] Funktsien ei-numeerine minimu jätetäh huomavotta.
        [extremum] Funktsien ei-numeerine iäriarvo jätetäh huomavotta.
        [point] Funktsien ei-numeerine pisto jätetäh huomavotta.
        [slope] Funktsien ei-numeerine kaltevus jätetäh huomavotta.
       *[other] Funktsien ei-numeerine { $type } jätetäh huomavotta.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Funktsien tyhjy maksimu jätetäh huomavotta.
        [minimum] Funktsien tyhjy minimu jätetäh huomavotta.
        [extremum] Funktsien tyhjy iäriarvo jätetäh huomavotta.
        [point] Funktsien tyhjy pisto jätetäh huomavotta.
       *[other] Funktsien tyhjy { $type } jätetäh huomavotta.
    }

function-points-too-close = Funktsies on kaksi pistuo, kudamien sijoitukset ollah liijan lähäl toine tostu. Funktsiedu ei sua miärittiä.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Funktsien iteratsiet ollah mahtollizet vai sit, konzu syöttölöin miäry on sama kui tuloksien. Täl funktsiel on { $inputs } syöttö da { $outputs ->
            [one] { $outputs } tulos
           *[other] { $outputs } tulostu
        }.
       *[other] Funktsien iteratsiet ollah mahtollizet vai sit, konzu syöttölöin miäry on sama kui tuloksien. Täl funktsiel on { $inputs } syöttyö da { $outputs ->
            [one] { $outputs } tulos
           *[other] { $outputs } tulostu
        }.
    }

## `<sequence>`

sequence-invalid-length = Jonon pituus on viäry.  Sen pidäy olla ei-negatiivine kogonaine lugu.

sequence-invalid-step = Jonon askel on viäry.  Tyypin { $type } jonos sen pidäy olla lugu.

sequence-invalid-endpoint-number = Lugujonon ”{ $attribute }” on viäry.  Sen pidäy olla lugu.

sequence-invalid-endpoint-letters = Kirjaimujonon ”{ $attribute }” on viäry.  Sen pidäy olla kirjaimuyhtevys.

sequence-invalid-endpoint = Jonon ”{ $attribute }” on viäry.

select-from-sequence-coprime-not-numbers = coprime jätetäh huomavotta, sendäh gu vallittavat ei olla luguloi

select-from-sequence-coprime-with-exclude-combinations = coprime jätetäh huomavotta, sendäh gu excludeCombinations on miäritetty

## Resolving a `target`

target-not-found = Viäry target kohtehele `<{ $source }>`: kohtehtu ei löydy.

target-state-variable-not-found = Viäry target kohtehele `<{ $source }>`: tilamuuttujua ”{ $property }” ei löydy komponentas `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>`-elementan muuttujien pidäy olla toizet gu iččenäine muuttui.

ode-system-duplicate-variable-names = Differentsiualuyhtälön oigien puolen funktsieloi ei sua miärittiä, ku kiinolizien muuttujien nimet toistutah.

ode-system-rhs-function-error = Differentsiualuyhtälön oigien puolen funktsiedu ei sua miärittiä.  Vigu mathjs-funktsien luajindas.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Kulmua { $count } suoran keskes ei sua miärittiä

angle-invalid-through-point = Viäry pisto `<angle>`-elementan through-atribuutas

parabola-vertex-too-many-points = Huipul miäritettyy parabolua enämbän gu 1 piston kauti ei ole toteutettu.

parabola-too-many-points = Parabolua enämbän gu 3 piston kauti ei ole toteutettu.

intersection-too-many-items = Enämbän gu kahten kohtehen leikkavustu ei ole toteutettu

## Other math components

ionic-compound-not-two-ions = Ionoin yhtevytty ei ole toteutettu muule gu kahtele ionale.

ionic-compound-needs-cation-and-anion = Ionoin yhtevys on toteutettu vai yhtele kationale da yhtele anionale.

solve-equations-cannot-evaluate = Yhtälyö ei sua ratkaista, sendäh gu sidä ei suadu laskie: { $equation }

math-operators-operand-number-required = operandNumber pidäy miärittiä, konzu matemaatiekalline operandu otetah.

eigen-decomposition-failed = Matritsan ominazarvoloi ei suadu laskie

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parametru { $parameters } ei ole mallis, sendäh se ozuau ainos tyhjäh.
       *[other] `<matchesPattern>`: parametrat { $parameters } ei olla mallis, sendäh net ozutah ainos tyhjäh.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: arvuo grid="{ $grid }" ei sua ellendiä. Sen pidäy olla none, medium, dense libo kaksi väliluajal eroitettuu pozitiivistu lugua, ezimerkikse grid="1 0.5". Setkü ei piirretä.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` tarviččou funktsien, kudamal on { $expected ->
        [one] yksi tulos, kaltevus y' jogahizes pistos, moine kui `y - x`
       *[other] kaksi tulostu, vektoru jogahizes pistos, moine kui `(y, -x)`
    }, ga annetul funktsiel on { $found ->
        [one] { $found } tulos
       *[other] { $found } tulostu
    }. { $alternative ->
        [none] Nimidä ei piirretä.
       *[other] `<{ $alternative }>` on se komponentu, kudai päi täle funktsiele. Nimidä ei piirretä.
    }

field-function-attribute-ignored-with-child = `function`-atribuuttu jätetäh huomavotta, sendäh gu funktsii on annettu sežo komponentan sydämes; käytetäh sidä, kudai on sydämes. Anna funktsii vai yhtel tabual.

field-variables-ignored =
    `<{ $component }>`: `variables`-atribuuttu nimittäy komponentan sydämeh kohtinäh kirjutetun ilmavunnon muuttujat. { $reason ->
        [function-child] Funktsii on täs annettu `<function>`-lapsennu, kudai nimittäy omat muuttujat, sendäh `variables` jätetäh huomavotta.
       *[no-expression] Moistu ilmavunduo ei ole täs annettu, sendäh `variables` jätetäh huomavotta.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ei ole tuettu prefigure-piirdomoduulis; käytetäh right-arvon toimindua.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ei ole tuettu prefigure-piirdomoduulis; käytetäh top-arvon toimindua.

prefigure-invalid-axis-bounds = `<graph>`: viärät akseloin rajat prefigure-muunnokseh; käytetäh oletusarvuo bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: viäry levevys prefigure-muunnokseh; käytetäh oletuslevevytty 425.

prefigure-invalid-aspect-ratio = `<graph>`: viäry aspectRatio prefigure-muunnokseh; käytetäh oletussuhtehtu 1.

prefigure-grid-spacing-too-fine = `<graph>`: setkän väli on liijan tiheä akseloin rajoih nähte; setkü jätetäh iäre prefigure-piirdomoduulis.

prefigure-annotations-not-rendered = `<graph>`: merkindöi ei piirretä, konzu ei käytetä PreFigure-piirdomoduulua.

multiple-annotations-children = `<graph>`-elementas löydyi monii `<annotations>`-lastu; kai paiči jälgimästy jätetäh huomavotta.

## Referring to other components

copy-unrecognized-component-type = Tundemattomua komponentutyyppii ei sua levendiä eigo kopiiruija: { $type }.

copy-prop-not-found = Ominazuttu { $property } ei löydynyh tyypin { $component } komponentas

collect-no-source = collectale ei löydynyh lähtehtu.

collect-invalid-component-type = Tyypin `<{ $component }>` komponentoi ei sua kerätä, sendäh gu tyyppi on viäry.

reference-index-unavailable = Indeksah `{ $reference }` ei sua viitata

## `<callAction>`

component-action-unavailable = Komponentas `{ $reference }` ei sua kuččuo toimindua { $action }

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Annettuloin formu on viäry.  Riävylöin pituvvet ollah erilazet. Löydyi kohtas componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Annettulois on samoi paččahannimii.  Löydyi kohtas componentIdx :{ $componentIdx }

data-frame-missing-column-name = Annettulois puuttuu paččahannimi.  Löydyi kohtas componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Tämän vastavuksen award on kiini answer-tunnuksen omas työtys vastavukses, mi vedäy vuottamattomah toimindah.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts`-arvon panendu `<answer>`-elementah, kudai on `sectionWideCheckWork`-astien sydämes, ei vaikuta nimidä, sendäh gu astii ohjuau yrityksien miäriä. Pane `maxNumAttempts` astieh.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts`-arvon panendu `sectionWideCheckWork`-astieh, kudai on toizen `sectionWideCheckWork`-astien sydämes, ei vaikuta nimidä, sendäh gu ulgoine astii ohjuau yrityksien miäriä. Pane `maxNumAttempts` ulgozeh astieh.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Atribuutal { $attributes } ei ole vaikutustu ilmai symbolicEquality-azetustu.
       *[other] Atribuuttoil { $attributes } ei ole vaikutustu ilmai symbolicEquality-azetustu.
    }

answer-invalid-type = Viäry tyyppi answer-elementale: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Sendäh gu komponental `<{ $component }>` ei ole nimie, sidä ei sua käyttiä moduulan atribuuttannu

module-attribute-name-already-defined = Komponentua `<{ $component } name="{ $name }">` ei sua käyttiä moduulan atribuuttannu, sendäh gu komponentutyypil `<module>` on jo atribuuttu ”{ $name }”.

conditional-content-condition-ignored = `condition`-atribuuttu jätetäh huomavotta `<conditionalContent>`-komponentas, kudamal on case- libo else-lapsii.

slider-markers-type-mismatch = Merkilöin tyyppi ei vastua liugusiätimen tyyppii.

pretzel-problem-needs-statement-and-answer = Viäry pretzel: jogahizes `<problem>`-elementas pidäy olla yksi `<statement>` da yksi `<answer>`.

pretzel-circuit-first-problem-distractor = Viäry pretzel: tilas mode="circuit" enzimäine `<problem>` ei sua olla harhauttai.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Viäry arvo { $values } atribuutale `{ $attribute }`; jätetäh huomavotta.
       *[other] Viärät arvot { $values } atribuutale `{ $attribute }`; jätetäh huomavotta.
    }

attribute-must-be-references = Viäry arvo `{ $value }` atribuutale `{ $attribute }`. Atribuutan pidäy olla kogo viittavuksis, kudamat alletah merkil `$`.

math-input-invalid-function-names = <mathInput>: viärät funktsieloin nimet jätettih huomavotta kohtas { $attribute }: { $names }. Jogahizen nimen nägyväs ozas pidäy olla vähimyölleh 2 merkii (kirjaimii libo yhtysmerkkii); sen jälles voi tulla vallittavu `|<mathspeak alternative>` -piäte.

## Building components from the source

component-type-invalid = Viäry komponentutyyppi: `<{ $componentType }>`

attribute-repeated = Atribuuttua { $attribute } ei sua toistua.

attribute-invalid-for-component = Viäry atribuuttu ”{ $attribute }” tyypin `<{ $componentType }>` komponentale.

## Style definition contrast

style-definition-insufficient-contrast =
    Stiilimiärityksen { $styleNumber } kontrastu on vähäine { $context ->
        [text-on-background] tekstan karvan da taustukarvan keskes
        [high-contrast] korgien kontrastan karvan da piirdoalustan keskes
        [line] viivan karvan da piirdoalustan keskes
        [marker] merkin karvan da piirdoalustan keskes
       *[text-on-canvas] tekstan karvan da piirdoalustan keskes
    }{ $mode ->
        [dark] { " (tummu tila)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; pidäy olla vähimyölleh { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Hos stiilimiäritys { $styleNumber } andau valgiele tilale kylläl kontrastua andajat karvat, niilöis arvolois johtetuil tumman tilan karvoil tekstan karvan da taustukarvan kontrastu on vähäine ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; pidäy olla vähimyölleh { $threshold }:1). { $suggestion ->
        [available] Kylläl kontrastan suamizekse tummas tilas libo liziä kontrastua valgies tilas (ezim. { $lightAttribute }="{ $lightColor }") libo korvua tumman tilan karvu (ezim. { $darkAttribute }="{ $darkColor }").
       *[none] Kylläl kontrastan suamizekse tummas tilas liziä kontrastua valgies tilas libo korvua johtetut karvat azetuksil textColorDarkMode da/libo backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Hos stiilimiäritys { $styleNumber } andau valgiele tilale kylläl kontrastua andajan tekstukarvan, täs arvos johtetun tumman tilan tekstukarvan kontrastu piirdoalustah nähte on vähäine ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; pidäy olla vähimyölleh { $threshold }:1). { $suggestion ->
        [available] Kylläl kontrastan suamizekse tummas tilas libo liziä kontrastua valgies tilas (ezim. textColor="{ $lightColor }") libo korvua tumman tilan karvu (ezim. textColorDarkMode="{ $darkColor }").
       *[none] Kylläl kontrastan suamizekse tummas tilas liziä kontrastua valgies tilas libo korvua johtettu karvu azetuksel textColorDarkMode.
    }

section-multiple-style-palettes = Luku voibi vallita vai yhten <stylePalette>-elementan; käytetäh jälgimästy.

## Unique variants

variant-num-to-select-not-non-negative-integer = kohtehen { $component } ainavolaadutoi variantoi ei sua miärittiä, sendäh gu numToSelect ei ole ei-negatiivine kogonaine lugu.

variant-num-to-select-not-constant-number = kohtehen { $component } ainavolaadutoi variantoi ei sua miärittiä, sendäh gu numToSelect ei ole vakioluvu.

variant-with-replacement-not-constant-boolean = kohtehen { $component } ainavolaadutoi variantoi ei sua miärittiä, sendäh gu withReplacement ei ole vakiototevusarvo.

variant-select-weight-disables-unique = selectan ainavolaadutoit variantat on otettu iäre käytös, ku kudamalgi vaihtoehtol on selectWeight libo selectForVariants

variant-coprime-undetermined = kohtehen { $component } ainavolaadutoi variantoi ei sua miärittiä, sendäh gu ei sua todeta, ku coprime on ainos epätozi.

variant-attribute-not-constant = kohtehen { $component } ainavolaadutoi variantoi ei sua miärittiä, sendäh gu { $attribute } ei ole vakivo.

variant-attribute-not-number = kohtehen { $component } ainavolaadutoi variantoi ei sua miärittiä, sendäh gu { $attribute } ei ole luvun.

variant-attribute-wrong-type-for-sequence =
    tyypin { $type } kohtehen { $component } ainavolaadutoi variantoi ei sua miärittiä, sendäh gu { $attribute } ei ole { $expected ->
        [letters-combination] kirjaimuyhtevys
        [math-expression] päijy matemaatiekalline ilmavundu
        [integer] kogonaine luvun
       *[number] luvun
    }.

variant-length-not-integer = kohtehen { $component } ainavolaadutoi variantoi ei sua miärittiä, sendäh gu length ei ole kogonaine luvun.

variant-sort-not-implemented = kohtehen { $component } ainavolaadutoi variantoi sortan kel ei ole toteutettu

variant-exclude-combinations-not-implemented = kohtehen { $component } ainavolaadutoi variantoi excludeCombinationsan kel ei ole toteutettu

variant-math-exclude-not-implemented = math-tyyppizen kohtehen { $component } ainavolaadutoi variantoi excluden kel ei ole toteutettu

variant-non-constant-exclude-not-implemented = kohtehen { $component } ainavolaadutoi variantoi ei-vakivon excluden kel ei ole toteutettu

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ei tuettu graph prefigure -piirdomoduulis; jälgeläine jätettih huomavotta.

prefigure-descendant-invalid-geometry = { $subject }: iäretöi libo vajai geometrii; jälgeläine jätettih huomavotta.

prefigure-curve-label-omitted = { $subject }: nimikkehii ei tuveta muunnetuis kaarielementois; nimikeh jätettih iäre.

prefigure-curve-unsupported-definition-type = { $subject }: kaaren miäritystyyppii ”{ $definitionType }” ei tuveta; jälgeläine jätettih huomavotta.

prefigure-region-flip-functions-unsupported = { $subject }: flipFunctions-atribuuttua ei tuveta regionBetweenCurves-elementas; jälgeläine jätettih huomavotta.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves tugou vai formulumuodozii lapsifunktsieloi; jälgeläine jätettih huomavotta.

prefigure-label-position-unsupported =
    { $subject }: labelPosition ”{ $labelPosition }” ei ole tuettu kohtehele { $labelKind ->
        [line-family] suoruperehen nimikeh
       *[point] piston nimikeh
    }; käytettih PreFiguran oletustazavustu.

prefigure-fill-style-unsupported = { $subject }: täyttöstiilii ”{ $fillStyle }” PreFigure ei tue; käytetäh yhtenästy täyttyö.

prefigure-line-style-unknown = { $subject }: tundematoi viivustiili ”{ $lineStyle }” jätettih iäre PreFiguran tuloksis.

prefigure-marker-style-mapped-to-diamond = { $subject }: merkkistiili ”{ $markerStyle }” kuvattih PreFiguran stiilikse ”diamond”.

prefigure-marker-style-unsupported = { $subject }: merkkistiilii ”{ $markerStyle }” PreFigure ei tue; käytettih oletusstiilii.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: viäry `ref`; kohtehtu ei sua selvittiä. Merkindy jätettih iäre.

annotation-ref-multiple-targets = `<annotation>`: `ref` ozutti moneh kohtehele; käytetäh enzimästy.

annotation-ref-outside-graph = `<annotation>`: viäry `ref`; kohteh on sydämeh ottajan kuvaajan ulgopuolel. Merkindy jätettih iäre.

annotation-ref-unsupported-target = `<annotation>`: viäry `ref`; kohteh ei ole tuettu grafiekalline objektu prefigure-muunnokses. Merkindy jätettih iäre.

annotation-text-missing = `<annotation>`: `text` puuttuu libo on tyhjy; annetah tyhjy tekstu.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Löydyi kehämäine kiinolližus.
       *[other] Löydyi kehämäine kiinolližus, kudamas on mugana `<{ $componentType }>`-komponentu.
    }

reference-no-referent = Viittavuksele ei löydynyh kohtehtu: `{ $reference }`

reference-multiple-referents = Viittavuksele löydyi monii kohtehtu: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Viäry formu komponentan `<{ $componentType }>` atribuutale { $attribute }.

children-invalid = Viärii lapsii elementas `<{ $componentType }>`: löydyi viärii lapsii: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Viäry arvo `{ $value }` atribuutale `{ $attribute }`, käytetäh arvuo `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML-versiedu { $version } ei löydynyh.
       *[other] DoenetML-versiedu { $version } ei löydynyh. Käytetäh versiedu { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Viäry DoenetML: { $content }

parse-tag-missing-close-tag = Viäry DoenetML: Tunnuksel `{ $tag }` ei ole salbuajua tunnustu. Vuotettih iččeh salbuajua tunnustu libo tunnustu `</{ $tagName }>`.

parse-tag-error = Viäry DoenetML: Vigu tunnukses `<{ $tagName }>`

parse-attribute-missing-value = Viäry DoenetML: Viäräs atribuutas `{ $attribute }` nägyy puuttujan arvo.

parse-attribute-invalid = Viäry DoenetML: Viäry atribuuttu `{ $attribute }`

parse-attribute-value-invalid = Viäry DoenetML: Viäry atribuutan arvo `{ $value }`

parse-attribute-value-quote-mismatch = Viäry DoenetML: Viäry atribuutan arvo `{ $value }`. Lainavusmerkit ei vastata toine tostu. Nägyy puuttujan `{ $quote }`

parse-open-tag-name-missing = Viäry DoenetML: Löydyi tunnus ilmai nimie, ezim. `<`

parse-tag-not-closed = Viäry DoenetML: Tunnustu `{ $tag }` ei salvattu (nägyy puuttujan `>`).

parse-self-closing-tag-name-missing = Viäry DoenetML: Löydyi tunnus ilmai nimie `<{ $content }>`

parse-self-closing-tag-not-closed = Viäry DoenetML: Tunnustu `{ $tag }` ei salvattu (nägyy puuttujan `/>`).

parse-tag-invalid-attributes = Viäry DoenetML: Tunnus `{ $tag }` ei päi. Sil voibi olla viärii atribuuttoi.

parse-close-tag-name-missing = Viäry DoenetML: Löydyi salbuai tunnus ilmai nimie, ezim. `</`

parse-attribute-value-unquoted = Atribuuttoin arvot pidäy kirjuttua lainavusmerkkilöih: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Viäry DoenetML: Löydyi salbuai tunnus `{ $tag }`, ga ei vastuajua avuajua tunnustu

parse-close-tag-mismatched = Viäry DoenetML: Salbuai tunnus ei vastua avuajua. Vuotettih `</{ $expected }>`. Löydyi `{ $found }`

parser-node-unconvertible = Solmuu { $node } ei suadu muuttua Dast-solmukse.

## Names

name-attribute-invalid =
    Viäry atribuuttu name='{ $name }'. { $reason ->
        [characters] Nimis voibi olla vai kirjaimii, numeroi, alaviivoi libo yhtysmerkkii.
       *[start] Nimien pidäy allata kirjaimel.
    }

component-name-invalid-start = Viäry komponentan nimi ”{ $name }”. Nimien pidäy allata kirjaimel.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched-tyyppizel answer-elemental pidäy olla video-atribuuttu

answer-video-watched-video-not-reference = videoWatched-tyyppizen answer-elementan video-atribuutan pidäy olla viittavus

answer-name-not-single-text = answer-elementan name-atribuutal pidäy olla yksi tekstulapsi

## Referencing another document

external-doenetml-recursion-limit = Ulgostu DoenetML:ua ei suadu suaha liijan monen rekursietazon täh. Ongo täs kehäviittavus?

external-doenetml-unavailable = DoenetML:ua ei suadu suaha kohtes { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Kohtes { $attribute }="{ $uri }" suadu DoenetML on viäry: se ei vastannuh komponentutyyppii ”{ $componentType }”

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribuuttu `{ $from }` on vanhennuh; käytä sen sijah `{ $to }`.
       *[other] [deprecation] Komponentan `<{ $component }>` atribuuttu `{ $from }` on vanhennuh; käytä sen sijah `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribuuttu `{ $from }` on vanhennuh da jätetäh huomavotta, sendäh gu sežo `{ $to }` on miäritetty.
       *[other] [deprecation] Komponentan `<{ $component }>` atribuuttu `{ $from }` on vanhennuh da jätetäh huomavotta, sendäh gu sežo `{ $to }` on miäritetty.
    }

deprecated-attribute-ignored = [deprecation] Komponentan `<{ $component }>` atribuuttu `{ $attribute }` on vanhennuh da jätetäh huomavotta.

deprecated-attribute-to-child = [deprecation] Komponentan `<{ $component }>` atribuuttu `{ $attribute }` on vanhennuh; käytä sen sijah `<{ $child }>`-lastu.

deprecated-attribute-value-renamed = [deprecation] Komponentan `<{ $component }>` atribuutan `{ $attribute }` arvo `{ $value }` on vanhennuh; käytä sen sijah `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` maltau panna monikkoh vai anglien kielel, sendäh kielel { $locale } kirjutetus dokumentas sen tekstu jiäy endizekse. Kirjuta monikkomuodo kohtinäh libo pane se `pluralForm`-atribuutal.


## Checking against the schema

schema-element-unrecognized = Elementu `<{ $tag }>` ei ole tuttavu Doenet-elementu.

schema-element-not-allowed-at-root = Elementu `<{ $tag }>` ei ole luvalline dokumentan juures.

schema-element-not-allowed-inside = Elementu `<{ $tag }>` ei ole luvalline elementan `<{ $parent }>` sydämes.

schema-attribute-unrecognized = Elemental `<{ $tag }>` ei ole atribuuttua nimel `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Elementan `<{ $tag }>` atribuutan `{ $attribute }` pidäy olla lista, kudaman jogahine elementu on kudaitahto näis: { $allowed }
       *[other] Elementan `<{ $tag }>` atribuutan `{ $attribute }` pidäy olla kudaitahto näis: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Viäry variantan nimi selectale.  Variantan nimi { $variantName } on { $numOptions } vaihtoehtos, ga vallittavien miäry on { $numToSelect }.

select-variant-name-without-options = selectale on miäritetty variantoi, ga mahtollizele variantan nimele ei ole vaihtoehtoloi: { $variantName }.

select-variant-name-not-possible = selectale miäritetty variantan nimi { $variantName } ei ole mahtolline variantan nimi.

select-too-few-options = Ei sua vallita { $numToSelect } komponentua vai { $numOptions } vaihtoehtos.

select-from-sequence-too-few-values = Ei sua vallita { $numToSelect } arvuo jonos, kudaman pituus on { $length }.

select-from-sequence-indices-count-mismatch = selectale miäritettylöin indeksoin miäryn pidäy vastata vallittavien miäriä

select-from-sequence-indices-not-integers = Kaikkien selectale miäritettylöin indeksoin pidäy olla kogonazii luguloi

select-from-sequence-index-excluded = selectfromsequence-komponentale miäritetty indeksu oli iäre suljettu

select-from-sequence-indices-excluded-combination = selectfromsequence-komponentale miäritetyt indeksat luajittih iäre sullettu yhtevys

select-from-sequence-coprime-not-positive-integers = Keskenäh jagamattomii yhtevyksii ei sua vallita, sendäh gu vallittavat ei olla pozitiivizet kogonazet luvut.

select-from-sequence-coprime-common-factor = Keskenäh jagamattomii luguloi ei sua vallita. Kaikil mahtollizil arvoloil on yhtehine tegii. (Miäritettylöin "from"- libo "to"-arvoloin pidäy olla jagamattomat "step"-arvon kel.)

select-from-sequence-coprime-single-number = Keskenäh jagamattomii yhtevyksii ei sua vallita yhtes luvus, kudai ei ole 1.

select-from-sequence-excluded-too-many-combinations = selectFromSequence-komponentas suljettih iäre yli 70 % yhtevyksis

select-from-sequence-coprime-none-found = Keskenäh jagamattomii luguloi ei suadu vallita. Kaikil mahtollizil arvoloil on yhtehine tegii.

select-from-sequence-too-few-unique-values = Ei sua vallita { $numToSelect } ainavolaadustu arvuo jonos, kudaman pituus on { $numPossibleValues }

select-prime-numbers-too-few-values = Ei sua vallita { $numToSelect } arvuo alguluguloin listas, kudaman pituus on { $numValues }

select-prime-numbers-values-count-mismatch = selectale miäritettylöin arvoloin miäryn pidäy vastata vallittavien miäriä

select-prime-numbers-values-not-prime = Kaikkien alguluvun vallindah miäritettylöin arvoloin pidäy olla alguluguloin listas

select-prime-numbers-values-excluded-combination = selectPrimeNumbersale miäritetyt arvot luajittih iäre sullettu yhtevys

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers-komponentas suljettih iäre yli 70 % yhtevyksis

select-random-combination-fluke = Ylen epätoduperäzen sattumuksen täh sattumanvarazien arvoloin yhtevytty ei suadu vallita

select-random-value-fluke = Ylen epätoduperäzen sattumuksen täh sattumanvarastu arvuo ei suadu vallita
