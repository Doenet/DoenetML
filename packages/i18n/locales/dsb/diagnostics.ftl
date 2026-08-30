# Lower Sorbian (dolnoserbšćina) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the seurce of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **`locales/hsb` was open beside this file while it was written, and that is
# the largest risk in it.** The two Sorbian standards are close, and a seed
# that reads one while writing the other will reproduce the first's choices
# wherever it has nothing better — so the two catalogs are *expected* to look
# alike, and **their agreement is not evidence that either is right**. One
# process produced both. This is the trap `locales/tkl` and `locales/tvl`
# record for Tokelauan and Tuvaluan, and it is sharper here because the
# correspondences between Upper and Lower Sorbian are regular enough to apply
# mechanically: «hdyž»→«gaž», «dokulaž»→«dokulaž», «musy»→«musy»,
# «njemóžu»→«njamóžom», «zo by»→«aby». Those are real, but a file built out of
# them is a transposition rather than a translation, and a reviewer should read
# it as one.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber` — are part of the language, not prose,
# and stay in English exactly as written. So does anything quoted back from the
# author's own seurce, and se do `WCAG AA`, `DoenetML`, `PreFigure` and
# `prefigure`, which are names.
#
# **The dual.** `Intl.PluralRules("dsb")` has Lower Sorbian's own four
# categories, se a `[two]` branch here is selected truthfully; see
# `chrome.ftl`.
#
# Every **symbolic** selector — `$type`, `$mode`, `$reason`, `$context`,
# `$suggestion`, `$alternative`, `$fallback`, `$expected`, `$labelKind`,
# `$isList`, `$componentType` — is kept byte for byte from English, keys
# included: a translated variant key is a branch nothing can reach.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } se ignorěrujo, gaž staj dwaj kónčnej dypkaj podatej
       *[other] { $attributes } se ignorěruju, gaž staj dwaj kónčnej dypkaj podatej
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } se ignorěrujo, gaž staj kónčny dypk a srjejźny dypk podatej
       *[other] { $attributes } se ignorěruju, gaž staj kónčny dypk a srjejźny dypk podatej
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset nima wustatk bjez srjejźneho dypka

## `<line>`

line-points-undetermined-dimensions = Rownica pśez dypki z njepostajenej dimensiju.

line-points-too-few-dimensions = Rownica musy pśez dypki z nanejmjenjej dwěmaj dimensijomaj hyś.

line-points-depend-on-variables = Rownica źo pśez dypki, kótarež wót wariablow zawisaja: { $variables }.

line-equation-invalid-format = Njepłaśiwy format rownanja rownice we wariablomaj { $variable1 } a { $variable2 }.

## `<ray>`

ray-overprescribed-through = Połrownica jo pśez through, endpoint a direction postajena.  Podate through se ignorěrujo.

ray-dimension-mismatch = numDimensions w połrownicy se njekšywa.

## `<vector>`

vector-overprescribed-head = Wektor jo pśez head, tail a displacement postajeny.  Podate head se ignorěrujo.

vector-dimension-mismatch = numDimensions we wektorje se njekšywa.

## Attracting and constraining

attract-to-without-nearest-point = Njamóžom k `<{ $component }>` śěgnuś, dokulaž nima statusowu wariablu nearestPoint.

constrain-to-without-nearest-point = Njamóžom na `<{ $component }>` wobgranicowaś, dokulaž nima statusowu wariablu nearestPoint.

constrain-to-interior-without-nearest-point = Njamóžom na nutśikownosć `<{ $component }>` wobgranicowaś, dokulaž nima statusowu wariablu nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition se pola choiceInput, kótaryž inline njejo, ignoruje

## Ordering children by index

choice-input-indices-count-mismatch = Ignorěrujom indeksy podate za choiceInput, dokulaž licba indeksow licbje źiśi choice njewótpowědujo.

pretzel-indices-count-mismatch = Ignorěrujom indeksy podate za problem, dokulaž licba indeksow licbje źiśi problem njewótpowědujo.

shuffle-indices-count-mismatch = Ignorěrujom indeksy podate za shuffle, dokulaž licba indeksow licbje komponentow njewótpowědujo.

indices-ignored-out-of-range = Ignorěrujom indeksy podate za { $component }, dokulaž někotre indeksy zwonka wobcerka leža.

pretzel-indices-repeated = Ignorěrujom indeksy podate za pretzel, dokulaž někotre indeksy se wospjetuja.

pretzel-circuit-first-index = Ignorěrujom indeksy podate za pretzel w modusu circuit, dokulaž prěni indeks musy 1 byś.

## `<shuffle>` and `<sort>`

string-children-need-type = Aby `<{ $component }>` ze znamješkowymi rjećazkami jako źiśimi fungował, musy atribut `type` podaty byś.

invalid-type-defaulting-to-math = Njepłaśiwy typ { $type } za komponentu { $component }. Musy jedyn z math, text, number abo boolean byś. Wužiwam math.

string-not-valid-component-to-arrange = Znamješkowy rjećazk "{ $value }" njejo płaśiwa komponenta za { $component }. Ignorěrujom jón.

## Types and variables

invalid-type-defaulting-to-number = Njepłaśiwy typ { $type }, stajam typ na number.

invalid-variable-value = Njepłaśiwa gódnota wariable: `{ $value }`

## Variants

variant-index-must-be-number = Indeks warianty { $index } musy licba byś

variant-index-must-be-integer = Indeks warianty { $index } musy cyła licba byś

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` njejo za absolutne měry implementowany. Stajam šěrokosće na relatiwne.

side-by-side-absolute-margins = `<{ $component }>` njejo za absolutne měry implementowany. Stajam kromy na relatiwne.

side-by-side-no-block-child = Njepłaśiwy `<{ $component }>`: musy nanejmjenjej jedne blokowe źiśe měś.

## `<label>`

label-for-ignored-on-graphical = Atribut `for` na grafiskim `<label>` se ignorěrujo.

label-for-must-resolve-to-one = Atribut `for` na `<label>` musy runje na jednu komponentu pokazaś.

label-for-unresolved = Atribut `for` na `<label>` njeda se na komponentu rozwězaś.

label-for-answer-with-authored-inputs = Atribut `for` na `<label>` pokazuje na `<answer>` z wupisanymi zapiskami; pokazaj radnjej direktnje na zapisk.

label-for-answer-without-input = Atribut `for` na `<label>` pokazuje na `<answer>` bjez zapiska, kótaryž by se poměwał.

label-for-must-reference-input-or-answer = Atribut `for` na `<label>` musy na zapisk abo na wótegronu pokazaś.

## Accessibility

accessibility-short-description-or-decorative = Za bźezbariernosć musy `<{ $component }>` pak krótke wopisanje měś pak jako dekoratiwny woznamjenjeny byś.

accessibility-video-short-description = Za bźezbariernosć musy `<video>` krótke wopisanje měś.

accessibility-input-short-description-or-label = Za bźezbariernosć musy `<{ $component }>` krótke wopisanje abo pomjenjenje měś.

accessibility-answer-input-short-description-or-label = Za bźezbariernosć musy `<answer>`, kótaryž zapisk wutwóri, krótke wopisanje abo pomjenjenje měś.

accessibility-short-description-contains-math = Krótke wopisanja njemaja matematiske komponenty kaž `<{ $component }>` wopśimowaś. Napiš matematiku ze słowami.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ma pśemały kontrast za tekst nadpisma wótrězka (ćmowy modus) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; trěbne jo nanejmjenjej { $threshold }:1).
       *[other] { $colorName } ma pśemały kontrast za tekst nadpisma wótrězka ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; trěbne jo nanejmjenjej { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` pśez { $count } dypkow njejo za padło implementowany, hdźež dypki numeriske gódnoty nimaja.

circle-too-many-through-points = Njamóžom krejz pśez wěcej ako 3 dypki wulicyś.

circle-overprescribed-radius-center-points = Njamóžom krejz z podatym radiusom, srjejźišćom a dypkami wulicyś.

circle-center-with-multiple-points = Njamóžom krejz z podatym srjejźišćom pśez wěcej ako 1 dypk wulicyś.

circle-radius-too-small = Njamóžom krejz wulicyś: gaž jo wótstup mjazy dypkomaj { $distance }, jo podaty radius { $radius } pśemały.

circle-radius-with-many-points = Njamóžom krejz pśez wěcej ako dwaj dypkaj z podatym radiusom napóraś.

circle-invalid-center-or-through-points = Njepłaśiwe srjejźišćo abo njepłaśiwe dypki krejza.

circle-radius-center-with-multiple-points = Njamóžom radius krejza z podatym srjejźišćom pśez wěcej ako 1 dypk wulicyś.

circle-change-radius-non-numerical = Njamóžom radius krejza z njenumeriskimi dypkami změniś

circle-radius-with-points-non-numerical = Njamóžom krejz pśez wěcej ako jedyn dypk z podatym radiusom napóraś, gaž numeriske gódnoty njejsu.

circle-change-center-non-numerical = Změna srjejźišća krejza pśez dypki bjez numeriskich gódnotow hyšći implementowana njejo.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Pśemało dimensijow za definiciski wobcerk funkcije. Wobcerk ma { $intervals } interwal, ale funkcija ma { $inputs ->
            [one] { $inputs } zapisk
            [two] { $inputs } zapiskaj
            [few] { $inputs } zapiski
           *[other] { $inputs } zapiskow
        }.
        [two] Pśemało dimensijow za definiciski wobcerk funkcije. Wobcerk ma { $intervals } interwalaj, ale funkcija ma { $inputs ->
            [one] { $inputs } zapisk
            [two] { $inputs } zapiskaj
            [few] { $inputs } zapiski
           *[other] { $inputs } zapiskow
        }.
        [few] Pśemało dimensijow za definiciski wobcerk funkcije. Wobcerk ma { $intervals } interwale, ale funkcija ma { $inputs ->
            [one] { $inputs } zapisk
            [two] { $inputs } zapiskaj
            [few] { $inputs } zapiski
           *[other] { $inputs } zapiskow
        }.
       *[other] Pśemało dimensijow za definiciski wobcerk funkcije. Wobcerk ma { $intervals } interwalow, ale funkcija ma { $inputs ->
            [one] { $inputs } zapisk
            [two] { $inputs } zapiskaj
            [few] { $inputs } zapiski
           *[other] { $inputs } zapiskow
        }.
    }

function-domain-invalid-format = Njepłaśiwy format definiciskeho wobcerka funkcije.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ignorěrujom njenumeriske maksimum funkcije.
        [minimum] Ignorěrujom njenumeriske minimum funkcije.
        [extremum] Ignorěrujom njenumeriski ekstremum funkcije.
        [point] Ignorěrujom njenumeriski dypk funkcije.
        [slope] Ignorěrujom njenumerisku nachylenosć funkcije.
       *[other] Ignorěrujom njenumeriske { $type } funkcije.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ignorěrujom prózdne maksimum funkcije.
        [minimum] Ignorěrujom prózdne minimum funkcije.
        [extremum] Ignorěrujom prózdny ekstremum funkcije.
        [point] Ignorěrujom prózdny dypk funkcije.
       *[other] Ignorěrujom prózdne { $type } funkcije.
    }

function-points-too-close = Funkcija wopśimujo dwaj dypkaj, kótarejž stej sej pśeblisko. Funkcija njeda se definěrowaś.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Iteracije funkcije su jano móžne, gaž jo licba zapiskow runa licbje wudaćow. Tuta funkcija ma { $inputs } zapisk a { $outputs } wudaćow.
        [two] Iteracije funkcije su jano móžne, gaž jo licba zapiskow runa licbje wudaćow. Tuta funkcija ma { $inputs } zapiskaj a { $outputs } wudaćow.
        [few] Iteracije funkcije su jano móžne, gaž jo licba zapiskow runa licbje wudaćow. Tuta funkcija ma { $inputs } zapiski a { $outputs } wudaćow.
       *[other] Iteracije funkcije su jano móžne, gaž jo licba zapiskow runa licbje wudaćow. Tuta funkcija ma { $inputs } zapiskow a { $outputs } wudaćow.
    }

## `<sequence>`

sequence-invalid-length = Njepłaśiwa dłujkosć rjadu.  Musy njenegatiwna cyła licba byś.

sequence-invalid-step = Njepłaśiwy krok rjadu.  Musy licba byś za rjad typa { $type }.

sequence-invalid-endpoint-number = Njepłaśiwe "{ $attribute }" licboweho rjadu.  Musy licba byś.

sequence-invalid-endpoint-letters = Njepłaśiwe "{ $attribute }" pismikoweho rjadu.  Musy kombinacija pismikow byś.

sequence-invalid-endpoint = Njepłaśiwe "{ $attribute }" rjadu.

select-from-sequence-coprime-not-numbers = coprime se ignorěrujo, dokulaž se licby njewuběraja

select-from-sequence-coprime-with-exclude-combinations = coprime se ignorěrujo, dokulaž jo excludeCombinations podate

## Resolving a `target`

target-not-found = Njepłaśiwy target za `<{ $source }>`: cil njeda se namakaś.

target-state-variable-not-found = Njepłaśiwy target za `<{ $source }>`: statusowa wariabla z měm "{ $property }" njeda se na `<{ $component }>` namakaś.

## `<odeSystem>`

ode-system-variables-match-independent = Wariable `<odeSystem>` muse druhe ako njewótwisna wariabla byś.

ode-system-duplicate-variable-names = Njamóžom pšawe boky ODE definěrowaś, gaž mjenja wótwisnych wariablow se wospjetuja.

ode-system-rhs-function-error = Njamóžom pšawu boku ODE definěrowaś.  Zmylk pśi wutwórjenju funkcije mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Njamóžom kut mjazy { $count } rownicami definěrowaś

angle-invalid-through-point = Njepłaśiwy dypk w through pola `<angle>`

parabola-vertex-too-many-points = Parabola z wjerchom pśez wěcej ako 1 dypk hyšći implementowana njejo.

parabola-too-many-points = Parabola pśez wěcej ako 3 dypki hyšći implementowana njejo.

intersection-too-many-items = Přerězk wěcej ako dweju objektow hyšći implementowany njejo

## Other math components

ionic-compound-not-two-ions = Ionowa zwjazba z něčim druhim ako dwěmaj ionomaj hyšći implementowana njejo.

ionic-compound-needs-cation-and-anion = Ionowa zwjazba jo jano za jedyn kation a jedyn anion implementowana.

solve-equations-cannot-evaluate = Njamóžom rownanje rozwězaś, dokulaž njeda se wulicyś: { $equation }

math-operators-operand-number-required = Musyš operandNumber pódaś, gaž matematiski operand wuśěgujoš.

eigen-decomposition-failed = Njamóžach eigenowe gódnoty matricy wulicyś

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameter { $parameters } w mustrje njewustupuje, togodla se přeco na prózdninu góźi.
       *[other] `<matchesPattern>`: parametry { $parameters } w mustrje njewustupuja, togodla se přeco na prózdninu góźe.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: njamóžom grid="{ $grid }" interpretěrowaś. Musy none, medium, dense abo dwě pozitiwnej licbje źělenej z mjazotu byś, na pśikład grid="1 0.5". Žana lěsyca se njekresli.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` trjeba funkciju z { $expected ->
        [one] jednym wudaćom, nachylenosću y' w kuždym dypku, na pśikład `y - x`
       *[other] dwěmaj wudaćomaj, wektorom w kuždym dypku, na pśikład `(y, -x)`
    }, ale podata funkcija ma { $found ->
        [one] { $found } wudaće
        [two] { $found } wudaći
        [few] { $found } wudaća
       *[other] { $found } wudaćow
    }. { $alternative ->
        [none] Ničo se njekresli.
       *[other] `<{ $alternative }>` jo komponenta za tutu funkciju. Ničo se njekresli.
    }

field-function-attribute-ignored-with-child = Atribut `function` se ignorěrujo, dokulaž jo funkcija tež nutśika komponenty podata; ta nutśikowna se wužywa. Podaj funkciju jano na jednym z wobeju pućow.

field-variables-ignored =
    `<{ $component }>`: atribut `variables` mjenuje wariable wuraza, kótaryž jo direktnje nutśika komponenty napisany. { $reason ->
        [function-child] Funkcija jo tu jako źiśe `<function>` podata, kótarež swoje wariable samo mjenuje, togodla se `variables` ignoruje.
       *[no-expression] Tajki wuraz tu njejo, togodla se `variables` ignoruje.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" se w zwobraznjenju prefigure njepodpěruje; wužywam zadźerženje za pšawu poziciju.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" se w zwobraznjenju prefigure njepodpěruje; wužywam zadźerženje za hornju poziciju.

prefigure-invalid-axis-bounds = `<graph>`: njepłaśiwe hranicy wóskow za konwersiju do prefigure; wužywam standardny bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: njepłaśiwa šěrokosć za konwersiju do prefigure; wužywam standardnu šěrokosć diagrama 425.

prefigure-invalid-aspect-ratio = `<graph>`: njepłaśiwy aspectRatio za konwersiju do prefigure; wužywam standardny poměr bok 1.

prefigure-grid-spacing-too-fine = `<graph>`: lěsyca jo za hranicy wóskow přehusta; lěsyca se w zwobraznjenju prefigure wuwostaja.

prefigure-annotations-not-rendered = `<graph>`: pśispomnjeńa se njezwobraznja, gaž se zwobraznjenje PreFigure njewužywa.

multiple-annotations-children = Wjacore źiśi `<annotations>` w `<graph>` namakane; wše nimo poslednjeho se ignorěruju.

## Referring to other components

copy-unrecognized-component-type = Njamóžom njeznaty typ komponenty rozšyriś abo kopěrowaś: { $type }.

copy-prop-not-found = Njamóžach kajkosć { $property } na komponenće typa { $component } namakaś

collect-no-source = Za collect njejo se žeden žórło namakało.

collect-invalid-component-type = Njamóžom komponenty typa `<{ $component }>` zběraś, dokulaž to njepłaśiwy typ komponenty jo.

reference-index-unavailable = Njamóžom se na indeks `{ $reference }` póśěgowaś

## `<callAction>`

component-action-unavailable = Njamóžom { $action } na komponenće `{ $reference }` zawołaś

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Daty maja njepłaśiwu formu.  Linki maja rozźělne dłujkosće. Namakane w componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Daty maja dwójne mjenja špaltow.  Namakane w componentIdx :{ $componentIdx }

data-frame-missing-column-name = Datam faluje mě špalty.  Namakane w componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Wótegronjenje za tutu wótegronu bazuje na wótegronje, kótaruž jo tag answer sam pósłał, a to njewočakowane zadźerženje zawinuje.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` na `<answer>` nutśika wobsahowaka z `sectionWideCheckWork` nima wustatk, dokulaž wobsahowak licbu pospytow rjaduje. Staj `maxNumAttempts` radnjej na wobsahowak.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` na wobsahowaku z `sectionWideCheckWork`, kótaryž nutśika druheho wobsahowaka z `sectionWideCheckWork` leži, nima wustatk, dokulaž wonkowny wobsahowak licbu pospytow rjaduje. Staj `maxNumAttempts` radnjej na wonkowny wobsahowak.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Atribut { $attributes } nima wustatk, gaž symbolicEquality stajene njejo.
       *[other] Atributy { $attributes } nimaja wustatk, gaž symbolicEquality stajene njejo.
    }

answer-invalid-type = Njepłaśiwy typ za wótegronu: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Dokulaž komponenta `<{ $component }>` mě nima, njeda se jako atribut modula wužywaś

module-attribute-name-already-defined = Komponenta `<{ $component } name="{ $name }">` njeda se jako atribut modula wužywaś, dokulaž typ komponenty `<module>` južo atribut "{ $name }" ma.

conditional-content-condition-ignored = Atribut `condition` se na komponenće `<conditionalContent>` z źiśimi case abo else ignoruje.

slider-markers-type-mismatch = Typ marki se z typom pušćadła njekšywa.

pretzel-problem-needs-statement-and-answer = Njepłaśiwy pretzel: kuždy `<problem>` musy jedyn `<statement>` a jedyn `<answer>` wopśimowaś.

pretzel-circuit-first-problem-distractor = Njepłaśiwy pretzel: w mode="circuit" njesmě prěni `<problem>` distraktor byś.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Njepłaśiwa gódnota { $values } za atribut `{ $attribute }`; ignorěrujom ju.
       *[other] Njepłaśiwe gódnoty { $values } za atribut `{ $attribute }`; ignorěrujom jo.
    }

attribute-must-be-references = Njepłaśiwa gódnota `{ $value }` za atribut `{ $attribute }`. Atribut musy se z referencow zestajaś, kótarež se z `$` započinaja.

math-input-invalid-function-names = <mathInput>: ignorowach njepłaśiwe mjenja funkcijow w { $attribute }: { $names }. Zwobraznjeny źěl kuždego mjenja musy nanejmjenjej 2 znamjenja měś (pismiki abo mjazyznamješka); po nim móže opcionalny sufiks `|<mathspeak-alternatiwa>` slědować.

## Building components from the seurce

component-type-invalid = Njepłaśiwy typ komponenty: `<{ $componentType }>`

attribute-repeated = Njamóžom atribut { $attribute } wóspjetowaś.

attribute-invalid-for-component = Njepłaśiwy atribut "{ $attribute }" za komponentu typa `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Stilowa definicija { $styleNumber } ma pśemały kontrast za { $context ->
        [text-on-background] barbu teksta pśeśiwo barbje pozadka
        [high-contrast] wysokokontrastowu barbu pśeśiwo płatnje
        [line] barbu linije pśeśiwo płatnje
        [marker] barbu marki pśeśiwo płatnje
       *[text-on-canvas] barbu teksta pśeśiwo płatnje
    }{ $mode ->
        [dark] { " (ćmowy modus)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; trěbne jo nanejmjenjej { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Hačrunjež ma stilowa definicija { $styleNumber } barby, kótarež za swětły modus dosahacy kontrast skituju, maja z nich wótwodźene barby za ćmowy modus pśemały kontrast mjazy barbu teksta a barbu pozadka ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; trěbne jo nanejmjenjej { $threshold }:1). { $suggestion ->
        [available] Aby w ćmowym modusu dosahacy kontrast zawěsćił, zwyš pak kontrast we swětłym modusu (na př. staj { $lightAttribute }="{ $lightColor }") pak pśegiš barbu za ćmowy modus (na př. staj { $darkAttribute }="{ $darkColor }").
       *[none] Aby w ćmowym modusu dosahacy kontrast zawěsćił, zwyš kontrast we swětłym modusu abo pśegiš wótwodźene barby z textColorDarkMode a/abo backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Hačrunjež ma stilowa definicija { $styleNumber } barbu teksta, kótaraž za swětły modus dosahacy kontrast skitujo, ma z njejo wótwodźena barba teksta za ćmowy modus pśemały kontrast pśeśiwo płatnje ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; trěbne jo nanejmjenjej { $threshold }:1). { $suggestion ->
        [available] Aby w ćmowym modusu dosahacy kontrast zawěsćił, zwyš pak kontrast we swětłym modusu (na př. staj textColor="{ $lightColor }") pak pśegiš barbu za ćmowy modus (na př. staj textColorDarkMode="{ $darkColor }").
       *[none] Aby w ćmowym modusu dosahacy kontrast zawěsćił, zwyš kontrast we swětłym modusu abo pśegiš wótwodźenu barbu z textColorDarkMode.
    }

section-multiple-style-palettes = Wótrězk móže jano jedyn <stylePalette> wubraś; wužywam poslednju.

## Unique variants

variant-num-to-select-not-non-negative-integer = njamóžom jónkróćne warianty { $component } postajiś, dokulaž numToSelect njenegatiwna cyła licba njejo.

variant-num-to-select-not-constant-number = njamóžom jónkróćne warianty { $component } postajiś, dokulaž numToSelect konstantna licba njejo.

variant-with-replacement-not-constant-boolean = njamóžom jónkróćne warianty { $component } postajiś, dokulaž withReplacement konstantna boolowa gódnota njejo.

variant-select-weight-disables-unique = Jónkróćne warianty za select su wupinjene, gaž ma někotra opcija selectWeight abo selectForVariants podate

variant-coprime-undetermined = njamóžom jónkróćne warianty { $component } postajiś, dokulaž njeda se postajiś, až coprime přeco njewěrny jo.

variant-attribute-not-constant = njamóžom jónkróćne warianty { $component } postajiś, dokulaž { $attribute } konstanta njejo.

variant-attribute-not-number = njamóžom jónkróćne warianty { $component } postajiś, dokulaž { $attribute } licba njejo.

variant-attribute-wrong-type-for-sequence =
    njamóžom jónkróćne warianty { $component } typa { $type } postajiś, dokulaž { $attribute } njejo { $expected ->
        [letters-combination] kombinacija pismikow
        [math-expression] płaśiwy matematiski wuraz
        [integer] cyła licba
       *[number] licba
    }.

variant-length-not-integer = njamóžom jónkróćne warianty { $component } postajiś, dokulaž length cyła licba njejo.

variant-sort-not-implemented = jónkróćne warianty { $component } ze sert hyšći implementowane njejsu

variant-exclude-combinations-not-implemented = jónkróćne warianty { $component } z excludeCombinations hyšći implementowane njejsu

variant-math-exclude-not-implemented = jónkróćne warianty { $component } typa math z exclude hyšći implementowane njejsu

variant-non-constant-exclude-not-implemented = jónkróćne warianty { $component } z njekonstantnym exclude hyšći implementowane njejsu

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: w zwobraznjenju prefigure za graf se njepodpěruje; potomnik se pśeskoči.

prefigure-descendant-invalid-geometry = { $subject }: geometrija njejo kónčna abo jo njedospołna; potomnik se pśeskoči.

prefigure-curve-label-omitted = { $subject }: poměwanja se na konwertowanych elementach křiwkow njepodpěruja; poměwanjo se wuwostaja.

prefigure-curve-unsupported-definition-type = { $subject }: njepodpěrany typ definicije křiwki '{ $definitionType }'; potomnik se pśeskoči.

prefigure-region-flip-functions-unsupported = { $subject }: njepodpěrany atribut flipFunctions na regionBetweenCurves; potomnik se pśeskoči.

prefigure-region-non-formula-child = { $subject }: jano źiśeace funkcije typa formla se na regionBetweenCurves podpěruja; potomnik se pśeskoči.

prefigure-label-position-unsupported =
    { $subject }: njepodpěrany labelPosition '{ $labelPosition }' za { $labelKind ->
        [line-family] pomjenjenje z družiny rownicow
       *[point] pomjenjenje dypka
    }; wužywa se standardne wusměrjenje PreFigure.

prefigure-fill-style-unsupported = { $subject }: połnjenski stil '{ $fillStyle }' se wót PreFigure njepodpěruje; wužywa se połne połnjenje.

prefigure-line-style-unknown = { $subject }: njeznaty linijowy stil '{ $lineStyle }' jo se z wudaća PreFigure wuwostajił.

prefigure-marker-style-mapped-to-diamond = { $subject }: stil marki '{ $markerStyle }' jo se na stil PreFigure 'diamond' pśenjasł.

prefigure-marker-style-unsupported = { $subject }: stil marki '{ $markerStyle }' se wót PreFigure njepodpěruje; wužywa se standardny stil.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: njepłaśiwy `ref`; cil njeda se rozwězaś. Pśispomnjeńo se wuwostaja.

annotation-ref-multiple-targets = `<annotation>`: `ref` jo na wjacore cile pokazał; wužywam prěni cil.

annotation-ref-outside-graph = `<annotation>`: njepłaśiwy `ref`; cil leži zwonka wobdawaceho grafa. Pśispomnjeńo se wuwostaja.

annotation-ref-unsupported-target = `<annotation>`: njepłaśiwy `ref`; cil njejo podpěrany grafiski objekt w konwersiji prefigure. Pśispomnjeńo se wuwostaja.

annotation-text-missing = `<annotation>`: `text` faluje abo jo prózdny; sćelu prózdny tekst.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Krejzojta zawisnosć spóznata.
       *[other] Krejzojta zawisnosć spóznata, kótaraž komponentu `<{ $componentType }>` wopśimujo.
    }

reference-no-referent = Za referencu `{ $reference }` njejo se žeden referent namakał

reference-multiple-referents = Za referencu `{ $reference }` jo se wjacore referenty namakało

## Children that do not match

children-invalid-attribute-format = Njepłaśiwy format atributa { $attribute } wót `<{ $componentType }>`.

children-invalid = Njepłaśiwe źiśi za `<{ $componentType }>`: namakane njepłaśiwe źiśi: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Njepłaśiwa gódnota `{ $value }` za atribut `{ $attribute }`, wužywam gódnotu `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Wersija DoenetML { $version } njejo se namakała.
       *[other] Wersija DoenetML { $version } njejo se namakała. Wužiwam wersiju { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Njepłaśiwy DoenetML: { $content }

parse-tag-missing-close-tag = Njepłaśiwy DoenetML: Tag `{ $tag }` nima zaključny tag. Wočakowach se sam začinjacy tag abo tag `</{ $tagName }>`.

parse-tag-error = Njepłaśiwy DoenetML: Zmylk w tagu `<{ $tagName }>`

parse-attribute-missing-value = Njepłaśiwy DoenetML: Njepłaśiwemu atributej `{ $attribute }` zda se gódnota falować.

parse-attribute-invalid = Njepłaśiwy DoenetML: Njepłaśiwy atribut `{ $attribute }`

parse-attribute-value-invalid = Njepłaśiwy DoenetML: Njepłaśiwa gódnota atributa `{ $value }`

parse-attribute-value-quote-mismatch = Njepłaśiwy DoenetML: Njepłaśiwa gódnota atributa `{ $value }`. Pazorki se njekšywaju. Zda se, až ći `{ $quote }` faluje

parse-open-tag-name-missing = Njepłaśiwy DoenetML: Namakach tag bjez mjenja taga, na př. `<`

parse-tag-not-closed = Njepłaśiwy DoenetML: Tag `{ $tag }` njebu začinjeny (zda se, až `>` faluje).

parse-self-closing-tag-name-missing = Njepłaśiwy DoenetML: Namakach tag bjez mjenja taga `<{ $content }>`

parse-self-closing-tag-not-closed = Njepłaśiwy DoenetML: Tag `{ $tag }` njebu začinjeny (zda se, až `/>` faluje).

parse-tag-invalid-attributes = Njepłaśiwy DoenetML: Tag `{ $tag }` płaśiwy njejo. Móže wopačne atributy měś.

parse-close-tag-name-missing = Njepłaśiwy DoenetML: Namakach zaključny tag bjez mjenja taga, na př. `</`

parse-attribute-value-unquoted = Gódnoty atributow muse w pazorkach stojaś: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Njepłaśiwy DoenetML: Namakach zaključny tag `{ $tag }`, ale žeden wotpowědny wotewrjeny tag

parse-close-tag-mismatched = Njepłaśiwy DoenetML: Zaključny tag se njekšywa. Wočakowach `</{ $expected }>`. Namakach `{ $found }`

parser-node-unconvertible = Njamóžach suk { $node } do suka Dast konwertěrowaś.

## Names

name-attribute-invalid =
    Njepłaśiwy atribut name='{ $name }'. { $reason ->
        [characters] Mjena smědźa jano pismiki, licby, podsmužki abo mjazyznamješka wopśimowaś.
       *[start] Mjena muse se z pismikom zachopiś.
    }

component-name-invalid-start = Njepłaśiwe mě komponenty "{ $name }". Mjena muse se z pismikom zachopiś.

## `<answer>` sugar

answer-video-watched-missing-video = Wótegrona typa videoWatched musy atribut video měś

answer-video-watched-video-not-reference = Wótegrona typa videoWatched musy atribut video měś, kótaryž jo referenca

answer-name-not-single-text = Atribut name wótegrony musy jednotliwe tekstowe źiśe měś

## Referencing another document

external-doenetml-recursion-limit = Njamóžom eksterny DoenetML wobstaraś, dokulaž jo pśewjele runinow rekursije. Je tam krejzojta referenca?

external-doenetml-unavailable = Njamóžom DoenetML z { $attribute }="{ $uri }" wobstaraś

external-doenetml-type-mismatch = Njepłaśiwy DoenetML z { $attribute }="{ $uri }" wobstarany: njekšywaše se z typom komponenty "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` jo zestarjeny; wužyj `{ $to }` město njeho.
       *[other] [deprecation] Atribut `{ $from }` na `<{ $component }>` jo zestarjeny; wužyj `{ $to }` město njeho.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` jo zestarjeny a se ignorěrujo, dokulaž jo tež `{ $to }` podate.
       *[other] [deprecation] Atribut `{ $from }` na `<{ $component }>` jo zestarjeny a se ignorěrujo, dokulaž jo tež `{ $to }` podate.
    }

deprecated-attribute-ignored = [deprecation] Atribut `{ $attribute }` na `<{ $component }>` jo zestarjeny a se ignorěrujo.

deprecated-attribute-to-child = [deprecation] Atribut `{ $attribute }` na `<{ $component }>` jo zestarjeny; wužyj město njeho źiśe `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Gódnota `{ $value }` atributa `{ $attribute }` na `<{ $component }>` jo zestarjena; wužyj `{ $to }` město njejo.


## Language coverage

pluralize-english-only = `<pluralize>` móže jano jendźelšćinu do plurala stajiś, togodla tekst w dokumenće, kótaryž jo w { $locale } napisany, njezměnjeny wostawa. Napiš formu plurala direktnje abo staj ju z atributom `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Element `<{ $tag }>` znaty element Doenet njejo.

schema-element-not-allowed-at-root = Element `<{ $tag }>` na korjenju dokumenta dowoleny njejo.

schema-element-not-allowed-inside = Element `<{ $tag }>` nutśika `<{ $parent }>` dowoleny njejo.

schema-attribute-unrecognized = Element `<{ $tag }>` nima atribut z měm `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribut `{ $attribute }` elementa `<{ $tag }>` musy lisćina byś, kotrejež zapiski su kuždy jedyn z: { $allowed }
       *[other] Atribut `{ $attribute }` elementa `<{ $tag }>` musy jedyn z tuteju byś: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Njepłaśiwe mě warianty za select.  Mjeno warianty { $variantName } w { $numOptions } opcijach wustupuje, ale wubraś ma se { $numToSelect }.

select-variant-name-without-options = Za select su warianty podate, ale za móžne mě warianty njejsu žedne opcije podate: { $variantName }.

select-variant-name-not-possible = Mjeno warianty { $variantName }, kótarež jo za select podate, móžne mě warianty njejo.

select-too-few-options = Njamóžom { $numToSelect } komponentow z jano { $numOptions } wubraś.

select-from-sequence-too-few-values = Njamóžom { $numToSelect } gódnotow z rjadu dłujkosće { $length } wubraś.

select-from-sequence-indices-count-mismatch = Licba indeksow podatych za select musy licbje wuběranych wótpowědowaś

select-from-sequence-indices-not-integers = Wše indeksy podate za select muse cyłe licby byś

select-from-sequence-index-excluded = Podaty indeks selectfromsequence bě wuzamknjeny

select-from-sequence-indices-excluded-combination = Podate indeksy selectfromsequence běchu wuzamknjena kombinacija

select-from-sequence-coprime-not-positive-integers = Njamóžom wzajomnje prěnjotne kombinacije wubraś, dokulaž se pozitiwne cyłe licby njewuběraja.

select-from-sequence-coprime-common-factor = Njamóžom wzajomnje prěnjotne licby wubraś. Wše móžne gódnoty maja zhromadny faktor. (Podate gódnoty "from" abo "to" muse k "step" wzajomnje prěnjotne byś.)

select-from-sequence-coprime-single-number = Njamóžom wzajomnje prěnjotne kombinacije z jednotliweje licby wubraś, kótaraž 1 njejo.

select-from-sequence-excluded-too-many-combinations = Wěcej ako 70 % kombinacijow w selectFromSequence jo wuzamknjenych

select-from-sequence-coprime-none-found = Njamóžach wzajomnje prěnjotne licby wubraś. Wše móžne gódnoty maja zhromadny faktor.

select-from-sequence-too-few-unique-values = Njamóžom { $numToSelect } jónkróćnych gódnotow z rjadu dłujkosće { $numPossibleValues } wubraś

select-prime-numbers-too-few-values = Njamóžom { $numToSelect } gódnotow z lisćiny prěnjotnych licbow dłujkosće { $numValues } wubraś

select-prime-numbers-values-count-mismatch = Licba gódnotow podatych za select musy licbje wuběranych wótpowědowaś

select-prime-numbers-values-not-prime = Wše gódnoty podate za select prěnjotnych licbow muse w lisćinje prěnjotnych licbow stojaś

select-prime-numbers-values-excluded-combination = Podate gódnoty selectPrimeNumbers běchu wuzamknjena kombinacija

select-prime-numbers-excluded-too-many-combinations = Wěcej ako 70 % kombinacijow w selectPrimeNumbers jo wuzamknjenych

select-random-combination-fluke = Pśez nadměru cele njewěrjepódobny njezbóžowy pad njamóžach kombinaciju pśipadnych gódnotow wubraś

select-random-value-fluke = Pśez nadměru cele njewěrjepódobny njezbóžowy pad njamóžach pśipadnu gódnotu wubraś

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` se nutśika matematiki njekresli; wuraz se saja tak, kaž se sajowaše, pjerwjej ako se zapiski nutśika njeda zasadźić. { $reason ->
        [not-inline] Jano wuběranski zapisk z `inline` se do wuraza góźi; bjez `inline` jo to blok tłóčatkow.
        [expanded] Tekstowy zapisk z `expanded` jo wěcejlinkowy kašćik, kótaryž jo přewulki, aby nutśika wuraza stał.
        [on-graph] Na grafu se wuraz jako jenički wobraz kresli, a tón městno za zapisk nima.
       *[relative-width] Jeho `width` jo relatiwna (procent abo `em`), a nutśika wuraza nima ničo, wo čož by se měrił. Podaj šěrokosć radnjej w absolutnych jednotkach, na př. w `px`.
    }
