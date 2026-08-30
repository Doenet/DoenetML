# Upper Sorbian (hornjoserbšćina) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber` — are part of the language, not prose,
# and stay in English exactly as written. So does anything quoted back from the
# author's own source, and so do `WCAG AA`, `DoenetML`, `PreFigure` and
# `prefigure`, which are names.
#
# **The dual.** `Intl.PluralRules("hsb")` has Sorbian's own four categories, so
# a `[two]` branch here is selected truthfully; see `chrome.ftl`. Where a
# counted message's English branches differ only in a noun this catalog does
# not inflect for number in that position, the select is dropped rather than
# written out identically.
#
# Every **symbolic** selector — `$type`, `$mode`, `$reason`, `$context`,
# `$suggestion`, `$alternative`, `$fallback`, `$expected`, `$labelKind`,
# `$isList`, `$componentType` — is kept byte for byte from English, keys
# included: a translated variant key is a branch nothing can reach.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } so ignoruje, hdyž staj dwaj kónčnej dypkaj podatej
       *[other] { $attributes } so ignoruja, hdyž staj dwaj kónčnej dypkaj podatej
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } so ignoruje, hdyž staj kónčny dypk a srjedźny dypk podatej
       *[other] { $attributes } so ignoruja, hdyž staj kónčny dypk a srjedźny dypk podatej
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset nima wuskutk bjez srjedźneho dypka

## `<line>`

line-points-undetermined-dimensions = Runica přez dypki z njepostajenej dimensiju.

line-points-too-few-dimensions = Runica dyrbi přez dypki z znajmjeńša dwěmaj dimensijomaj hić.

line-points-depend-on-variables = Runica dźe přez dypki, kotrež wot warjablow zawisaja: { $variables }.

line-equation-invalid-format = Njepłaćiwy format runanja runicy we warjablomaj { $variable1 } a { $variable2 }.

## `<ray>`

ray-overprescribed-through = Połrunica je přez through, endpoint a direction postajena.  Podate through so ignoruje.

ray-dimension-mismatch = numDimensions w połrunicy so njekryje.

## `<vector>`

vector-overprescribed-head = Wektor je přez head, tail a displacement postajeny.  Podate head so ignoruje.

vector-dimension-mismatch = numDimensions we wektorje so njekryje.

## Attracting and constraining

attract-to-without-nearest-point = Njemóžu k `<{ $component }>` ćahnyć, dokelž nima statusowu warjablu nearestPoint.

constrain-to-without-nearest-point = Njemóžu na `<{ $component }>` wobmjezować, dokelž nima statusowu warjablu nearestPoint.

constrain-to-interior-without-nearest-point = Njemóžu na nutřkownosć `<{ $component }>` wobmjezować, dokelž nima statusowu warjablu nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition so pola choiceInput, kotryž inline njeje, ignoruje

## Ordering children by index

choice-input-indices-count-mismatch = Ignoruju indeksy podate za choiceInput, dokelž ličba indeksow ličbje dźěći choice njewotpowěduje.

pretzel-indices-count-mismatch = Ignoruju indeksy podate za problem, dokelž ličba indeksow ličbje dźěći problem njewotpowěduje.

shuffle-indices-count-mismatch = Ignoruju indeksy podate za shuffle, dokelž ličba indeksow ličbje komponentow njewotpowěduje.

indices-ignored-out-of-range = Ignoruju indeksy podate za { $component }, dokelž někotre indeksy zwonka wobłuka leža.

pretzel-indices-repeated = Ignoruju indeksy podate za pretzel, dokelž někotre indeksy so wospjetuja.

pretzel-circuit-first-index = Ignoruju indeksy podate za pretzel w modusu circuit, dokelž prěni indeks dyrbi 1 być.

## `<shuffle>` and `<sort>`

string-children-need-type = Zo by `<{ $component }>` ze znamješkowymi rjećazkami jako dźěćimi fungował, dyrbi atribut `type` podaty być.

invalid-type-defaulting-to-math = Njepłaćiwy typ { $type } za komponentu { $component }. Dyrbi jedyn z math, text, number abo boolean być. Wužiwam math.

string-not-valid-component-to-arrange = Znamješkowy rjećazk "{ $value }" njeje płaćiwa komponenta za { $component }. Ignoruju jón.

## Types and variables

invalid-type-defaulting-to-number = Njepłaćiwy typ { $type }, stajam typ na number.

invalid-variable-value = Njepłaćiwa hódnota warjable: `{ $value }`

## Variants

variant-index-must-be-number = Indeks warianty { $index } dyrbi ličba być

variant-index-must-be-integer = Indeks warianty { $index } dyrbi cyła ličba być

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` njeje za absolutne měry implementowany. Stajam šěrokosće na relatiwne.

side-by-side-absolute-margins = `<{ $component }>` njeje za absolutne měry implementowany. Stajam kromy na relatiwne.

side-by-side-no-block-child = Njepłaćiwy `<{ $component }>`: dyrbi znajmjeńša jedne blokowe dźěćo měć.

## `<label>`

label-for-ignored-on-graphical = Atribut `for` na grafiskim `<label>` so ignoruje.

label-for-must-resolve-to-one = Atribut `for` na `<label>` dyrbi runje na jednu komponentu pokazać.

label-for-unresolved = Atribut `for` na `<label>` njeda so na komponentu rozrisać.

label-for-answer-with-authored-inputs = Atribut `for` na `<label>` pokazuje na `<answer>` z wupisanymi zapiskami; pokazaj radšo direktnje na zapisk.

label-for-answer-without-input = Atribut `for` na `<label>` pokazuje na `<answer>` bjez zapiska, kotryž by so pomjenował.

label-for-must-reference-input-or-answer = Atribut `for` na `<label>` dyrbi na zapisk abo na wotmołwu pokazać.

## Accessibility

accessibility-short-description-or-decorative = Za bjezbarjernosć dyrbi `<{ $component }>` pak krótke wopisanje měć pak jako dekoratiwny woznamjenjeny być.

accessibility-video-short-description = Za bjezbarjernosć dyrbi `<video>` krótke wopisanje měć.

accessibility-input-short-description-or-label = Za bjezbarjernosć dyrbi `<{ $component }>` krótke wopisanje abo pomjenowanje měć.

accessibility-answer-input-short-description-or-label = Za bjezbarjernosć dyrbi `<answer>`, kotryž zapisk wutwori, krótke wopisanje abo pomjenowanje měć.

accessibility-short-description-contains-math = Krótke wopisanja njemaja matematiske komponenty kaž `<{ $component }>` wobsahować. Napisaj matematiku ze słowami.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ma přemały kontrast za tekst nadpisma wotrězka (ćmowy modus) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; trěbne je znajmjeńša { $threshold }:1).
       *[other] { $colorName } ma přemały kontrast za tekst nadpisma wotrězka ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; trěbne je znajmjeńša { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` přez { $count } dypkow njeje za padło implementowany, hdźež dypki numeriske hódnoty nimaja.

circle-too-many-through-points = Njemóžu kruh přez wjace hač 3 dypki wobličić.

circle-overprescribed-radius-center-points = Njemóžu kruh z podatym radiusom, srjedźišćom a dypkami wobličić.

circle-center-with-multiple-points = Njemóžu kruh z podatym srjedźišćom přez wjace hač 1 dypk wobličić.

circle-radius-too-small = Njemóžu kruh wobličić: hdyž je wotstup mjez dypkomaj { $distance }, je podaty radius { $radius } přemały.

circle-radius-with-many-points = Njemóžu kruh přez wjace hač dwaj dypkaj z podatym radiusom wutworić.

circle-invalid-center-or-through-points = Njepłaćiwe srjedźišćo abo njepłaćiwe dypki kruha.

circle-radius-center-with-multiple-points = Njemóžu radius kruha z podatym srjedźišćom přez wjace hač 1 dypk wobličić.

circle-change-radius-non-numerical = Njemóžu radius kruha z njenumeriskimi dypkami změnić

circle-radius-with-points-non-numerical = Njemóžu kruh přez wjace hač jedyn dypk z podatym radiusom wutworić, hdyž numeriske hódnoty njejsu.

circle-change-center-non-numerical = Změna srjedźišća kruha přez dypki bjez numeriskich hódnotow hišće implementowana njeje.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Přemało dimensijow za definiciski wobłuk funkcije. Wobłuk ma { $intervals } interwal, ale funkcija ma { $inputs ->
            [one] { $inputs } zapisk
            [two] { $inputs } zapiskaj
            [few] { $inputs } zapiski
           *[other] { $inputs } zapiskow
        }.
        [two] Přemało dimensijow za definiciski wobłuk funkcije. Wobłuk ma { $intervals } interwalaj, ale funkcija ma { $inputs ->
            [one] { $inputs } zapisk
            [two] { $inputs } zapiskaj
            [few] { $inputs } zapiski
           *[other] { $inputs } zapiskow
        }.
        [few] Přemało dimensijow za definiciski wobłuk funkcije. Wobłuk ma { $intervals } interwale, ale funkcija ma { $inputs ->
            [one] { $inputs } zapisk
            [two] { $inputs } zapiskaj
            [few] { $inputs } zapiski
           *[other] { $inputs } zapiskow
        }.
       *[other] Přemało dimensijow za definiciski wobłuk funkcije. Wobłuk ma { $intervals } interwalow, ale funkcija ma { $inputs ->
            [one] { $inputs } zapisk
            [two] { $inputs } zapiskaj
            [few] { $inputs } zapiski
           *[other] { $inputs } zapiskow
        }.
    }

function-domain-invalid-format = Njepłaćiwy format definiciskeho wobłuka funkcije.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ignoruju njenumeriske maksimum funkcije.
        [minimum] Ignoruju njenumeriske minimum funkcije.
        [extremum] Ignoruju njenumeriski ekstremum funkcije.
        [point] Ignoruju njenumeriski dypk funkcije.
        [slope] Ignoruju njenumerisku nachilenosć funkcije.
       *[other] Ignoruju njenumeriske { $type } funkcije.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ignoruju prózdne maksimum funkcije.
        [minimum] Ignoruju prózdne minimum funkcije.
        [extremum] Ignoruju prózdny ekstremum funkcije.
        [point] Ignoruju prózdny dypk funkcije.
       *[other] Ignoruju prózdne { $type } funkcije.
    }

function-points-too-close = Funkcija wobsahuje dwaj dypkaj, kotrejž stej sej přeblisko. Funkcija njeda so definować.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Iteracije funkcije su jenož móžne, hdyž je ličba zapiskow runa ličbje wudaćow. Tuta funkcija ma { $inputs } zapisk a { $outputs } wudaćow.
        [two] Iteracije funkcije su jenož móžne, hdyž je ličba zapiskow runa ličbje wudaćow. Tuta funkcija ma { $inputs } zapiskaj a { $outputs } wudaćow.
        [few] Iteracije funkcije su jenož móžne, hdyž je ličba zapiskow runa ličbje wudaćow. Tuta funkcija ma { $inputs } zapiski a { $outputs } wudaćow.
       *[other] Iteracije funkcije su jenož móžne, hdyž je ličba zapiskow runa ličbje wudaćow. Tuta funkcija ma { $inputs } zapiskow a { $outputs } wudaćow.
    }

## `<sequence>`

sequence-invalid-length = Njepłaćiwa dołhosć rjadu.  Dyrbi njenegatiwna cyła ličba być.

sequence-invalid-step = Njepłaćiwy krok rjadu.  Dyrbi ličba być za rjad typa { $type }.

sequence-invalid-endpoint-number = Njepłaćiwe "{ $attribute }" ličboweho rjadu.  Dyrbi ličba być.

sequence-invalid-endpoint-letters = Njepłaćiwe "{ $attribute }" pismikoweho rjadu.  Dyrbi kombinacija pismikow być.

sequence-invalid-endpoint = Njepłaćiwe "{ $attribute }" rjadu.

select-from-sequence-coprime-not-numbers = coprime so ignoruje, dokelž so ličby njewuběraja

select-from-sequence-coprime-with-exclude-combinations = coprime so ignoruje, dokelž je excludeCombinations podate

## Resolving a `target`

target-not-found = Njepłaćiwy target za `<{ $source }>`: cil njeda so namakać.

target-state-variable-not-found = Njepłaćiwy target za `<{ $source }>`: statusowa warjabla z mjenom "{ $property }" njeda so na `<{ $component }>` namakać.

## `<odeSystem>`

ode-system-variables-match-independent = Warjable `<odeSystem>` dyrbja druhe hač njewotwisna warjabla być.

ode-system-duplicate-variable-names = Njemóžu prawe strony ODE definować, hdyž mjena wotwisnych warjablow so wospjetuja.

ode-system-rhs-function-error = Njemóžu prawu stronu ODE definować.  Zmylk při wutworjenju funkcije mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Njemóžu kut mjez { $count } runicami definować

angle-invalid-through-point = Njepłaćiwy dypk w through pola `<angle>`

parabola-vertex-too-many-points = Parabola z wjeŕškom přez wjace hač 1 dypk hišće implementowana njeje.

parabola-too-many-points = Parabola přez wjace hač 3 dypki hišće implementowana njeje.

intersection-too-many-items = Přerězk wjace hač dweju objektow hišće implementowany njeje

## Other math components

ionic-compound-not-two-ions = Ionowa zwjazba z něčim druhim hač dwěmaj ionomaj hišće implementowana njeje.

ionic-compound-needs-cation-and-anion = Ionowa zwjazba je jenož za jedyn kation a jedyn anion implementowana.

solve-equations-cannot-evaluate = Njemóžu runanje rozrisać, dokelž njeda so wuličić: { $equation }

math-operators-operand-number-required = Dyrbiš operandNumber podać, hdyž matematiski operand wućahnješ.

eigen-decomposition-failed = Njemóžach eigenowe hódnoty matricy wobličić

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameter { $parameters } w mustrje njewustupuje, tohodla so přeco na prózdninu hodźi.
       *[other] `<matchesPattern>`: parametry { $parameters } w mustrje njewustupuja, tohodla so přeco na prózdninu hodźa.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: njemóžu grid="{ $grid }" interpretować. Dyrbi none, medium, dense abo dwě pozitiwnej ličbje dźělenej z mjezotu być, na přikład grid="1 0.5". Žana lěsyca so njekresli.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` trjeba funkciju z { $expected ->
        [one] jednym wudaćom, nachilenosću y' w kóždym dypku, na přikład `y - x`
       *[other] dwěmaj wudaćomaj, wektorom w kóždym dypku, na přikład `(y, -x)`
    }, ale podata funkcija ma { $found ->
        [one] { $found } wudaće
        [two] { $found } wudaći
        [few] { $found } wudaća
       *[other] { $found } wudaćow
    }. { $alternative ->
        [none] Ničo so njekresli.
       *[other] `<{ $alternative }>` je komponenta za tutu funkciju. Ničo so njekresli.
    }

field-function-attribute-ignored-with-child = Atribut `function` so ignoruje, dokelž je funkcija tež nutřka komponenty podata; ta nutřkowna so wužiwa. Podaj funkciju jenož na jednym z wobeju pućow.

field-variables-ignored =
    `<{ $component }>`: atribut `variables` mjenuje warjable wuraza, kotryž je direktnje nutřka komponenty napisany. { $reason ->
        [function-child] Funkcija je tu jako dźěćo `<function>` podata, kotrež swoje warjable samo mjenuje, tohodla so `variables` ignoruje.
       *[no-expression] Tajki wuraz tu njeje, tohodla so `variables` ignoruje.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" so w zwobraznjenju prefigure njepodpěruje; wužiwam zadźerženje za prawu poziciju.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" so w zwobraznjenju prefigure njepodpěruje; wužiwam zadźerženje za hornju poziciju.

prefigure-invalid-axis-bounds = `<graph>`: njepłaćiwe hranicy wóskow za konwersiju do prefigure; wužiwam standardny bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: njepłaćiwa šěrokosć za konwersiju do prefigure; wužiwam standardnu šěrokosć diagrama 425.

prefigure-invalid-aspect-ratio = `<graph>`: njepłaćiwy aspectRatio za konwersiju do prefigure; wužiwam standardny poměr stron 1.

prefigure-grid-spacing-too-fine = `<graph>`: lěsyca je za hranicy wóskow přehusta; lěsyca so w zwobraznjenju prefigure wuwostaja.

prefigure-annotations-not-rendered = `<graph>`: přispomnjenja so njezwobraznja, hdyž so zwobraznjenje PreFigure njewužiwa.

multiple-annotations-children = Wjacore dźěći `<annotations>` w `<graph>` namakane; wšě nimo poslednjeho so ignoruja.

## Referring to other components

copy-unrecognized-component-type = Njemóžu njeznaty typ komponenty rozšěrić abo kopěrować: { $type }.

copy-prop-not-found = Njemóžach kajkosć { $property } na komponenće typa { $component } namakać

collect-no-source = Za collect njeje so žadyn žórło namakało.

collect-invalid-component-type = Njemóžu komponenty typa `<{ $component }>` zběrać, dokelž to njepłaćiwy typ komponenty je.

reference-index-unavailable = Njemóžu so na indeks `{ $reference }` poćahować

## `<callAction>`

component-action-unavailable = Njemóžu { $action } na komponenće `{ $reference }` zawołać

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Daty maja njepłaćiwu formu.  Linki maja rozdźělne dołhosće. Namakane w componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Daty maja dwójne mjena špaltow.  Namakane w componentIdx :{ $componentIdx }

data-frame-missing-column-name = Datam faluje mjeno špalty.  Namakane w componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Wotmołwjenje za tutu wotmołwu bazuje na wotmołwje, kotruž je tag answer sam pósłał, a to njewočakowane zadźerženje zawinuje.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` na `<answer>` nutřka wobsahowaka z `sectionWideCheckWork` nima wuskutk, dokelž wobsahowak ličbu pospytow rjaduje. Staj `maxNumAttempts` radšo na wobsahowak.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` na wobsahowaku z `sectionWideCheckWork`, kotryž nutřka druheho wobsahowaka z `sectionWideCheckWork` leži, nima wuskutk, dokelž wonkowny wobsahowak ličbu pospytow rjaduje. Staj `maxNumAttempts` radšo na wonkowny wobsahowak.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Atribut { $attributes } nima wuskutk, hdyž symbolicEquality stajene njeje.
       *[other] Atributy { $attributes } nimaja wuskutk, hdyž symbolicEquality stajene njeje.
    }

answer-invalid-type = Njepłaćiwy typ za wotmołwu: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Dokelž komponenta `<{ $component }>` mjeno nima, njeda so jako atribut modula wužiwać

module-attribute-name-already-defined = Komponenta `<{ $component } name="{ $name }">` njeda so jako atribut modula wužiwać, dokelž typ komponenty `<module>` hižo atribut "{ $name }" ma.

conditional-content-condition-ignored = Atribut `condition` so na komponenće `<conditionalContent>` z dźěćimi case abo else ignoruje.

slider-markers-type-mismatch = Typ marki so z typom pušćadła njekryje.

pretzel-problem-needs-statement-and-answer = Njepłaćiwy pretzel: kóždy `<problem>` dyrbi jedyn `<statement>` a jedyn `<answer>` wobsahować.

pretzel-circuit-first-problem-distractor = Njepłaćiwy pretzel: w mode="circuit" njesmě prěni `<problem>` distraktor być.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Njepłaćiwa hódnota { $values } za atribut `{ $attribute }`; ignoruju ju.
       *[other] Njepłaćiwe hódnoty { $values } za atribut `{ $attribute }`; ignoruju je.
    }

attribute-must-be-references = Njepłaćiwa hódnota `{ $value }` za atribut `{ $attribute }`. Atribut dyrbi so z referencow zestajeć, kotrež so z `$` započinaja.

math-input-invalid-function-names = <mathInput>: ignorowach njepłaćiwe mjena funkcijow w { $attribute }: { $names }. Zwobraznjeny dźěl kóždeho mjena dyrbi znajmjeńša 2 znamješce měć (pismiki abo mjezyznamješka); po nim móže wolóžny sufiks `|<mathspeak-alternatiwa>` slědować.

## Building components from the source

component-type-invalid = Njepłaćiwy typ komponenty: `<{ $componentType }>`

attribute-repeated = Njemóžu atribut { $attribute } wospjetować.

attribute-invalid-for-component = Njepłaćiwy atribut "{ $attribute }" za komponentu typa `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Stilowa definicija { $styleNumber } ma přemały kontrast za { $context ->
        [text-on-background] barbu teksta přećiwo barbje pozadka
        [high-contrast] wysokokontrastowu barbu přećiwo płatnu
        [line] barbu linije přećiwo płatnu
        [marker] barbu marki přećiwo płatnu
       *[text-on-canvas] barbu teksta přećiwo płatnu
    }{ $mode ->
        [dark] { " (ćmowy modus)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; trěbne je znajmjeńša { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Hačrunjež ma stilowa definicija { $styleNumber } barby, kotrež za swětły modus dosahacy kontrast skićeja, maja z nich wotwodźene barby za ćmowy modus přemały kontrast mjez barbu teksta a barbu pozadka ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; trěbne je znajmjeńša { $threshold }:1). { $suggestion ->
        [available] Zo by w ćmowym modusu dosahacy kontrast zawěsćił, zwyš pak kontrast we swětłym modusu (na př. staj { $lightAttribute }="{ $lightColor }") pak přepiš barbu za ćmowy modus (na př. staj { $darkAttribute }="{ $darkColor }").
       *[none] Zo by w ćmowym modusu dosahacy kontrast zawěsćił, zwyš kontrast we swětłym modusu abo přepiš wotwodźene barby z textColorDarkMode a/abo backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Hačrunjež ma stilowa definicija { $styleNumber } barbu teksta, kotraž za swětły modus dosahacy kontrast skići, ma z njeje wotwodźena barba teksta za ćmowy modus přemały kontrast přećiwo płatnu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; trěbne je znajmjeńša { $threshold }:1). { $suggestion ->
        [available] Zo by w ćmowym modusu dosahacy kontrast zawěsćił, zwyš pak kontrast we swětłym modusu (na př. staj textColor="{ $lightColor }") pak přepiš barbu za ćmowy modus (na př. staj textColorDarkMode="{ $darkColor }").
       *[none] Zo by w ćmowym modusu dosahacy kontrast zawěsćił, zwyš kontrast we swětłym modusu abo přepiš wotwodźenu barbu z textColorDarkMode.
    }

section-multiple-style-palettes = Wotrězk móže jenož jedyn <stylePalette> wubrać; wužiwam poslednju.

## Unique variants

variant-num-to-select-not-non-negative-integer = njemóžu jónkróćne warianty { $component } postajić, dokelž numToSelect njenegatiwna cyła ličba njeje.

variant-num-to-select-not-constant-number = njemóžu jónkróćne warianty { $component } postajić, dokelž numToSelect konstantna ličba njeje.

variant-with-replacement-not-constant-boolean = njemóžu jónkróćne warianty { $component } postajić, dokelž withReplacement konstantna boolowa hódnota njeje.

variant-select-weight-disables-unique = Jónkróćne warianty za select su wupinjene, hdyž ma někotra opcija selectWeight abo selectForVariants podate

variant-coprime-undetermined = njemóžu jónkróćne warianty { $component } postajić, dokelž njeda so postajić, zo coprime přeco njewěrny je.

variant-attribute-not-constant = njemóžu jónkróćne warianty { $component } postajić, dokelž { $attribute } konstanta njeje.

variant-attribute-not-number = njemóžu jónkróćne warianty { $component } postajić, dokelž { $attribute } ličba njeje.

variant-attribute-wrong-type-for-sequence =
    njemóžu jónkróćne warianty { $component } typa { $type } postajić, dokelž { $attribute } njeje { $expected ->
        [letters-combination] kombinacija pismikow
        [math-expression] płaćiwy matematiski wuraz
        [integer] cyła ličba
       *[number] ličba
    }.

variant-length-not-integer = njemóžu jónkróćne warianty { $component } postajić, dokelž length cyła ličba njeje.

variant-sort-not-implemented = jónkróćne warianty { $component } ze sort hišće implementowane njejsu

variant-exclude-combinations-not-implemented = jónkróćne warianty { $component } z excludeCombinations hišće implementowane njejsu

variant-math-exclude-not-implemented = jónkróćne warianty { $component } typa math z exclude hišće implementowane njejsu

variant-non-constant-exclude-not-implemented = jónkróćne warianty { $component } z njekonstantnym exclude hišće implementowane njejsu

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: w zwobraznjenju prefigure za graf so njepodpěruje; potomnik so přeskoči.

prefigure-descendant-invalid-geometry = { $subject }: geometrija njeje kónčna abo je njedospołna; potomnik so přeskoči.

prefigure-curve-label-omitted = { $subject }: pomjenowanja so na konwertowanych elementach křiwkow njepodpěruja; pomjenowanje so wuwostaja.

prefigure-curve-unsupported-definition-type = { $subject }: njepodpěrany typ definicije křiwki '{ $definitionType }'; potomnik so přeskoči.

prefigure-region-flip-functions-unsupported = { $subject }: njepodpěrany atribut flipFunctions na regionBetweenCurves; potomnik so přeskoči.

prefigure-region-non-formula-child = { $subject }: jenož dźěćace funkcije typa formla so na regionBetweenCurves podpěruja; potomnik so přeskoči.

prefigure-label-position-unsupported =
    { $subject }: njepodpěrany labelPosition '{ $labelPosition }' za { $labelKind ->
        [line-family] pomjenowanje z družiny runicow
       *[point] pomjenowanje dypka
    }; wužiwa so standardne wusměrjenje PreFigure.

prefigure-fill-style-unsupported = { $subject }: pjelnjenski stil '{ $fillStyle }' so wot PreFigure njepodpěruje; wužiwa so połne pjelnjenje.

prefigure-line-style-unknown = { $subject }: njeznaty linijowy stil '{ $lineStyle }' je so z wudaća PreFigure wuwostajił.

prefigure-marker-style-mapped-to-diamond = { $subject }: stil marki '{ $markerStyle }' je so na stil PreFigure 'diamond' přenjesł.

prefigure-marker-style-unsupported = { $subject }: stil marki '{ $markerStyle }' so wot PreFigure njepodpěruje; wužiwa so standardny stil.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: njepłaćiwy `ref`; cil njeda so rozrisać. Přispomnjenje so wuwostaja.

annotation-ref-multiple-targets = `<annotation>`: `ref` je na wjacore cile pokazał; wužiwam prěni cil.

annotation-ref-outside-graph = `<annotation>`: njepłaćiwy `ref`; cil leži zwonka wobdawaceho grafa. Přispomnjenje so wuwostaja.

annotation-ref-unsupported-target = `<annotation>`: njepłaćiwy `ref`; cil njeje podpěrany grafiski objekt w konwersiji prefigure. Přispomnjenje so wuwostaja.

annotation-text-missing = `<annotation>`: `text` faluje abo je prózdny; sćelu prózdny tekst.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Kruhojta zawisnosć spóznata.
       *[other] Kruhojta zawisnosć spóznata, kotraž komponentu `<{ $componentType }>` wobsahuje.
    }

reference-no-referent = Za referencu `{ $reference }` njeje so žadyn referent namakał

reference-multiple-referents = Za referencu `{ $reference }` je so wjacore referenty namakało

## Children that do not match

children-invalid-attribute-format = Njepłaćiwy format atributa { $attribute } wot `<{ $componentType }>`.

children-invalid = Njepłaćiwe dźěći za `<{ $componentType }>`: namakane njepłaćiwe dźěći: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Njepłaćiwa hódnota `{ $value }` za atribut `{ $attribute }`, wužiwam hódnotu `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Wersija DoenetML { $version } njeje so namakała.
       *[other] Wersija DoenetML { $version } njeje so namakała. Wužiwam wersiju { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Njepłaćiwy DoenetML: { $content }

parse-tag-missing-close-tag = Njepłaćiwy DoenetML: Tag `{ $tag }` nima zaključny tag. Wočakowach so sam začinjacy tag abo tag `</{ $tagName }>`.

parse-tag-error = Njepłaćiwy DoenetML: Zmylk w tagu `<{ $tagName }>`

parse-attribute-missing-value = Njepłaćiwy DoenetML: Njepłaćiwemu atributej `{ $attribute }` zda so hódnota falować.

parse-attribute-invalid = Njepłaćiwy DoenetML: Njepłaćiwy atribut `{ $attribute }`

parse-attribute-value-invalid = Njepłaćiwy DoenetML: Njepłaćiwa hódnota atributa `{ $value }`

parse-attribute-value-quote-mismatch = Njepłaćiwy DoenetML: Njepłaćiwa hódnota atributa `{ $value }`. Pazorki so njekryja. Zda so, zo ći `{ $quote }` faluje

parse-open-tag-name-missing = Njepłaćiwy DoenetML: Namakach tag bjez mjena taga, na př. `<`

parse-tag-not-closed = Njepłaćiwy DoenetML: Tag `{ $tag }` njebu začinjeny (zda so, zo `>` faluje).

parse-self-closing-tag-name-missing = Njepłaćiwy DoenetML: Namakach tag bjez mjena taga `<{ $content }>`

parse-self-closing-tag-not-closed = Njepłaćiwy DoenetML: Tag `{ $tag }` njebu začinjeny (zda so, zo `/>` faluje).

parse-tag-invalid-attributes = Njepłaćiwy DoenetML: Tag `{ $tag }` płaćiwy njeje. Móže wopačne atributy měć.

parse-close-tag-name-missing = Njepłaćiwy DoenetML: Namakach zaključny tag bjez mjena taga, na př. `</`

parse-attribute-value-unquoted = Hódnoty atributow dyrbja w pazorkach stać: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Njepłaćiwy DoenetML: Namakach zaključny tag `{ $tag }`, ale žadyn wotpowědny wotewrjeny tag

parse-close-tag-mismatched = Njepłaćiwy DoenetML: Zaključny tag so njekryje. Wočakowach `</{ $expected }>`. Namakach `{ $found }`

parser-node-unconvertible = Njemóžach suk { $node } do suka Dast konwertować.

## Names

name-attribute-invalid =
    Njepłaćiwy atribut name='{ $name }'. { $reason ->
        [characters] Mjena smědźa jenož pismiki, ličby, podsmužki abo mjezyznamješka wobsahować.
       *[start] Mjena dyrbja so z pismikom započeć.
    }

component-name-invalid-start = Njepłaćiwe mjeno komponenty "{ $name }". Mjena dyrbja so z pismikom započeć.

## `<answer>` sugar

answer-video-watched-missing-video = Wotmołwa typa videoWatched dyrbi atribut video měć

answer-video-watched-video-not-reference = Wotmołwa typa videoWatched dyrbi atribut video měć, kotryž je referenca

answer-name-not-single-text = Atribut name wotmołwy dyrbi jednotliwe tekstowe dźěćo měć

## Referencing another document

external-doenetml-recursion-limit = Njemóžu eksterny DoenetML wobstarać, dokelž je přewjele runinow rekursije. Je tam kruhojta referenca?

external-doenetml-unavailable = Njemóžu DoenetML z { $attribute }="{ $uri }" wobstarać

external-doenetml-type-mismatch = Njepłaćiwy DoenetML z { $attribute }="{ $uri }" wobstarany: njekryješe so z typom komponenty "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` je zestarjeny; wužij `{ $to }` město njeho.
       *[other] [deprecation] Atribut `{ $from }` na `<{ $component }>` je zestarjeny; wužij `{ $to }` město njeho.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` je zestarjeny a so ignoruje, dokelž je tež `{ $to }` podate.
       *[other] [deprecation] Atribut `{ $from }` na `<{ $component }>` je zestarjeny a so ignoruje, dokelž je tež `{ $to }` podate.
    }

deprecated-attribute-ignored = [deprecation] Atribut `{ $attribute }` na `<{ $component }>` je zestarjeny a so ignoruje.

deprecated-attribute-to-child = [deprecation] Atribut `{ $attribute }` na `<{ $component }>` je zestarjeny; wužij město njeho dźěćo `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Hódnota `{ $value }` atributa `{ $attribute }` na `<{ $component }>` je zestarjena; wužij `{ $to }` město njeje.


## Language coverage

pluralize-english-only = `<pluralize>` móže jenož jendźelšćinu do plurala stajić, tohodla tekst w dokumenće, kotryž je w { $locale } napisany, njezměnjeny wostawa. Napisaj formu plurala direktnje abo staj ju z atributom `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Element `<{ $tag }>` znaty element Doenet njeje.

schema-element-not-allowed-at-root = Element `<{ $tag }>` na korjenju dokumenta dowoleny njeje.

schema-element-not-allowed-inside = Element `<{ $tag }>` nutřka `<{ $parent }>` dowoleny njeje.

schema-attribute-unrecognized = Element `<{ $tag }>` nima atribut z mjenom `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribut `{ $attribute }` elementa `<{ $tag }>` dyrbi lisćina być, kotrejež zapiski su kóždy jedyn z: { $allowed }
       *[other] Atribut `{ $attribute }` elementa `<{ $tag }>` dyrbi jedyn z tuteju być: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Njepłaćiwe mjeno warianty za select.  Mjeno warianty { $variantName } w { $numOptions } opcijach wustupuje, ale wubrać ma so { $numToSelect }.

select-variant-name-without-options = Za select su warianty podate, ale za móžne mjeno warianty njejsu žane opcije podate: { $variantName }.

select-variant-name-not-possible = Mjeno warianty { $variantName }, kotrež je za select podate, móžne mjeno warianty njeje.

select-too-few-options = Njemóžu { $numToSelect } komponentow z jenož { $numOptions } wubrać.

select-from-sequence-too-few-values = Njemóžu { $numToSelect } hódnotow z rjadu dołhosće { $length } wubrać.

select-from-sequence-indices-count-mismatch = Ličba indeksow podatych za select dyrbi ličbje wuběranych wotpowědować

select-from-sequence-indices-not-integers = Wšě indeksy podate za select dyrbja cyłe ličby być

select-from-sequence-index-excluded = Podaty indeks selectfromsequence bě wuzamknjeny

select-from-sequence-indices-excluded-combination = Podate indeksy selectfromsequence běchu wuzamknjena kombinacija

select-from-sequence-coprime-not-positive-integers = Njemóžu wzajomnje prěnjotne kombinacije wubrać, dokelž so pozitiwne cyłe ličby njewuběraja.

select-from-sequence-coprime-common-factor = Njemóžu wzajomnje prěnjotne ličby wubrać. Wšě móžne hódnoty maja zhromadny faktor. (Podate hódnoty "from" abo "to" dyrbja k "step" wzajomnje prěnjotne być.)

select-from-sequence-coprime-single-number = Njemóžu wzajomnje prěnjotne kombinacije z jednotliweje ličby wubrać, kotraž 1 njeje.

select-from-sequence-excluded-too-many-combinations = Wjace hač 70 % kombinacijow w selectFromSequence je wuzamknjenych

select-from-sequence-coprime-none-found = Njemóžach wzajomnje prěnjotne ličby wubrać. Wšě móžne hódnoty maja zhromadny faktor.

select-from-sequence-too-few-unique-values = Njemóžu { $numToSelect } jónkróćnych hódnotow z rjadu dołhosće { $numPossibleValues } wubrać

select-prime-numbers-too-few-values = Njemóžu { $numToSelect } hódnotow z lisćiny prěnjotnych ličbow dołhosće { $numValues } wubrać

select-prime-numbers-values-count-mismatch = Ličba hódnotow podatych za select dyrbi ličbje wuběranych wotpowědować

select-prime-numbers-values-not-prime = Wšě hódnoty podate za select prěnjotnych ličbow dyrbja w lisćinje prěnjotnych ličbow stać

select-prime-numbers-values-excluded-combination = Podate hódnoty selectPrimeNumbers běchu wuzamknjena kombinacija

select-prime-numbers-excluded-too-many-combinations = Wjace hač 70 % kombinacijow w selectPrimeNumbers je wuzamknjenych

select-random-combination-fluke = Přez nadměru njewěrjepodobny njezbožowy pad njemóžach kombinaciju připadnych hódnotow wubrać

select-random-value-fluke = Přez nadměru njewěrjepodobny njezbožowy pad njemóžach připadnu hódnotu wubrać

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` so nutřka matematiki njekresli; wuraz so saja tak, kaž so sajowaše, prjedy hač so zapiski nutřka njeda zasadźić. { $reason ->
        [not-inline] Jenož wuběranski zapisk z `inline` so do wuraza hodźi; bjez `inline` je to blok tłóčatkow.
        [expanded] Tekstowy zapisk z `expanded` je wjacelinkowy kašćik, kotryž je přewulki, zo by nutřka wuraza stał.
        [on-graph] Na grafu so wuraz jako jenički wobraz kresli, a tón městno za zapisk nima.
       *[relative-width] Jeho `width` je relatiwna (procent abo `em`), a nutřka wuraza nima ničo, wo čož by so měrił. Podaj šěrokosć radšo w absolutnych jednotkach, na př. w `px`.
    }
