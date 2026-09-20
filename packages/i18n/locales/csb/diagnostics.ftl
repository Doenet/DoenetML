# Kashubian (kaszëbsczi) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The standard Kashubian alphabet — «ã», «ë», «é», «ò», «ó»,
# «ô» and «ù» are letters of it, not decorated Polish ones: «ë» is the szwa
# («lëchi», «wëbrac») and «ò»/«ù» mark the diphthongal onset («òdpòwiésc»,
# «ùkòsny»). See `chrome.ftl`, which also carries the note on why this file is
# not `locales/pl` and what to look at to tell the two apart.
#
# **The quickest check** is the negation, the modal and the everyday verbs:
# «nie dô sã», «ni ma», «mùszi», «bò», «żebë», «nalezc», «felowac». A sentence
# here with «nie można», «musi być» spelled Polish-style, or «brakuje» in place
# of «felëje» has slipped into Polish; so has any «dobry»/«zły» that should be
# «bëlny»/«lëchi», any «inaczej» for «jinaczi», any «rodzaj» for «ôrt», any
# «wartość» for «wôrtnota», any «nazwa» for «miono» and any «wiersz» for
# «réżka». «nié» is the bare no.
#
# **German is the second contact language** — «fela» (Fehler), «felowac»,
# «ôrt» (Art) and «bùchsztôw» (Buchstabe) are the ones this file leans on.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber`, `maxNumAttempts`, `sectionWideCheckWork`
# — are part of the language, not prose, and stay in English exactly as
# written. So does anything quoted back from the author's own source, and so do
# `WCAG AA`, `DoenetML`, `PreFigure`, `prefigure`, `XML`, `mathjs` and `Dast`,
# which are names.
#
# **Number.** CLDR has no plural rules for `csb`, so no `zero`, `two`, `few` or
# `many` branch appears anywhere. Every **symbolic** selector — `$type`,
# `$mode`, `$reason`, `$context`, `$suggestion`, `$alternative`, `$fallback`,
# `$expected`, `$labelKind`, `$isList`, `$componentType` — is kept byte for
# byte from English, keys included.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } je pòminiãti, jak są pòdóné dwa kùńce
       *[other] { $attributes } są pòminiãté, jak są pòdóné dwa kùńce
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } je pòminiãti, jak są pòdóné kùniec a strzódk
       *[other] { $attributes } są pòminiãté, jak są pòdóné kùniec a strzódk
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset nick nie robi bez strzódka

## `<line>`

line-points-undetermined-dimensions = Prostô przez pùnktë ò nieùstalonym wëmiarze.

line-points-too-few-dimensions = Prostô mùszi jic przez pùnktë ò nômni dwùch wëmiarach.

line-points-depend-on-variables = Prostô jidze przez pùnktë, co zanôlégają òd zmiennëch: { $variables }.

line-equation-invalid-format = Fòrmat równaniô prosti w zmiennëch { $variable1 } a { $variable2 } nie je bëlny.

## `<ray>`

ray-overprescribed-through = Półprostô je òkreslonô przez through, endpoint a direction.  Pòdóné through je pòminiãté.

ray-dimension-mismatch = numDimensions sã nie zgòdzywô w półprosti.

## `<vector>`

vector-overprescribed-head = Wektor je òkreslony przez head, tail a displacement.  Pòdóné head je pòminiãté.

vector-dimension-mismatch = numDimensions sã nie zgòdzywô w wektorze.

## Attracting and constraining

attract-to-without-nearest-point = Nie dô sã cygnąc do `<{ $component }>`, bò ni mô zmienny stanu nearestPoint.

constrain-to-without-nearest-point = Nie dô sã przëpiąc do `<{ $component }>`, bò ni mô zmienny stanu nearestPoint.

constrain-to-interior-without-nearest-point = Nie dô sã przëpiąc do westrzódka `<{ $component }>`, bò ni mô zmienny stanu nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition je pòminiãti do choiceInput, co nie je inline

## Ordering children by index

choice-input-indices-count-mismatch = Pòmijóm indeksë pòdóné do choiceInput, bò lëczba indeksów sã nie zgòdzywô z lëczbą dzecy choice.

pretzel-indices-count-mismatch = Pòmijóm indeksë pòdóné do problem, bò lëczba indeksów sã nie zgòdzywô z lëczbą dzecy problem.

shuffle-indices-count-mismatch = Pòmijóm indeksë pòdóné do shuffle, bò lëczba indeksów sã nie zgòdzywô z lëczbą kòmpònentów.

indices-ignored-out-of-range = Pòmijóm indeksë pòdóné do { $component }, bò niechtërné indeksë są bùten zakresu.

pretzel-indices-repeated = Pòmijóm indeksë pòdóné do pretzel, bò niechtërné indeksë sã pòwtôrzają.

pretzel-circuit-first-index = Pòmijóm indeksë pòdóné do pretzel w tribie circuit, bò pierwszi indeks mùszi bëc 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Żebë `<{ $component }>` szedł z dzecama tekstowima, mùszi bëc pòdóny atribut `type`.

invalid-type-defaulting-to-math = Ôrt { $type } nie je bëlny do kòmpònentu { $component }. Mùszi bëc jeden z math, text, number abò boolean. Bierzã math.

string-not-valid-component-to-arrange = Tekst "{ $value }" nie je bëlnym kòmpònentã do { $component }. Pòmijóm gò.

## Types and variables

invalid-type-defaulting-to-number = Ôrt { $type } nie je bëlny, nastôwióm ôrt na number.

invalid-variable-value = Wôrtnota zmienny nie je bëlnô: `{ $value }`

## Variants

variant-index-must-be-number = Indeks wariantu { $index } mùszi bëc lëczbą

variant-index-must-be-integer = Indeks wariantu { $index } mùszi bëc całowitą lëczbą

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` nie je zrobiony do absolutnëch miar. Nastôwióm szérzawë na relatiwné.

side-by-side-absolute-margins = `<{ $component }>` nie je zrobiony do absolutnëch miar. Nastôwióm marginesë na relatiwné.

side-by-side-no-block-child = `<{ $component }>` nie je bëlny: mùszi miec nômni jedno blokòwé dzeckò.

## `<label>`

label-for-ignored-on-graphical = Atribut `for` na graficzny `<label>` je pòminiãti.

label-for-must-resolve-to-one = Atribut `for` na `<label>` mùszi wskazëwac akurat na jeden kòmpònent.

label-for-unresolved = Atributu `for` na `<label>` nie dało sã rozwiązac do kòmpònentu.

label-for-answer-with-authored-inputs = Atribut `for` na `<label>` wskazëje na `<answer>` z wëpisónyma wpisama; wskażë lepi prosto na wpis.

label-for-answer-without-input = Atribut `for` na `<label>` wskazëje na `<answer>` bez wpisu do òznaczeniô.

label-for-must-reference-input-or-answer = Atribut `for` na `<label>` mùszi wskazëwac na wpis abò na òdpòwiésc.

## Accessibility

accessibility-short-description-or-decorative = Do przëstãpnoscë `<{ $component }>` mùszi miec krótczi òpis abò bëc òznaczony jakò òzdobny.

accessibility-video-short-description = Do przëstãpnoscë `<video>` mùszi miec krótczi òpis.

accessibility-input-short-description-or-label = Do przëstãpnoscë `<{ $component }>` mùszi miec krótczi òpis abò etikétã.

accessibility-answer-input-short-description-or-label = Do przëstãpnoscë `<answer>`, co robi wpis, mùszi miec krótczi òpis abò etikétã.

accessibility-short-description-contains-math = Krótczé òpisë ni mają miec w se matematicznëch kòmpònentów jak `<{ $component }>`. Napiszë matematikã słowama.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } mô za môłi kòntrast do tekstu nadpisu rozdzélu (cemny trib) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; trzeba nômni { $threshold }:1).
       *[other] { $colorName } mô za môłi kòntrast do tekstu nadpisu rozdzélu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; trzeba nômni { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` przez { $count } pùnktów nie je zrobiony do przëpôdkù, dze pùnktë ni mają lëczbòwëch wôrtnotów.

circle-too-many-through-points = Nie dô sã wërachòwac kòła przez wicy jak 3 pùnktë.

circle-overprescribed-radius-center-points = Nie dô sã wërachòwac kòła z pòdónym parmieniã, strzódkã a pùnktama.

circle-center-with-multiple-points = Nie dô sã wërachòwac kòła z pòdónym strzódkã przez wicy jak 1 pùnkt.

circle-radius-too-small = Nie dô sã wërachòwac kòła: skòrno òdstãp midzë dwùma pùnktama je { $distance }, pòdóny parmiéń { $radius } je za môłi.

circle-radius-with-many-points = Nie dô sã zrobic kòła przez wicy jak dwa pùnktë z pòdónym parmieniã.

circle-invalid-center-or-through-points = Strzódk abò pùnktë kòła nie są bëlné.

circle-radius-center-with-multiple-points = Nie dô sã wërachòwac parmieniô kòła z pòdónym strzódkã przez wicy jak 1 pùnkt.

circle-change-radius-non-numerical = Nie dô sã zmienic parmieniô kòła z pùnktama, co nie są lëczbòwé

circle-radius-with-points-non-numerical = Nie dô sã zrobic kòła przez wicy jak jeden pùnkt z pòdónym parmieniã, jak ni ma lëczbòwëch wôrtnotów.

circle-change-center-non-numerical = Zmiana strzódka kòła przez pùnktë bez lëczbòwëch wôrtnotów jesz nie je zrobionô.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Za mało wëmiarów do dzedzënë fùnkcje. Dzedzëna mô { $intervals } przedzél, ale fùnkcjô mô { $inputs } wéńdzeniów.
       *[other] Za mało wëmiarów do dzedzënë fùnkcje. Dzedzëna mô { $intervals } przedzélów, ale fùnkcjô mô { $inputs } wéńdzeniów.
    }

function-domain-invalid-format = Fòrmat dzedzënë fùnkcje nie je bëlny.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Pòmijóm maksimum fùnkcje, co nie je lëczbòwé.
        [minimum] Pòmijóm minimum fùnkcje, co nie je lëczbòwé.
        [extremum] Pòmijóm ekstremum fùnkcje, co nie je lëczbòwé.
        [point] Pòmijóm pùnkt fùnkcje, co nie je lëczbòwi.
        [slope] Pòmijóm nachilenié fùnkcje, co nie je lëczbòwé.
       *[other] Pòmijóm { $type } fùnkcje, co nie je lëczbòwé.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Pòmijóm pùsté maksimum fùnkcje.
        [minimum] Pòmijóm pùsté minimum fùnkcje.
        [extremum] Pòmijóm pùsté ekstremum fùnkcje.
        [point] Pòmijóm pùsti pùnkt fùnkcje.
       *[other] Pòmijóm pùsté { $type } fùnkcje.
    }

function-points-too-close = Fùnkcjô mô dwa pùnktë za blisko se. Nie dô sã òkreslëc fùnkcje.

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] Iteracje fùnkcje są mòżlëwé blós tedë, jak lëczba wéńdzeniów je równô lëczbie wińdzeniów. Ta fùnkcjô mô { $inputs } wéńdzeniów a { $outputs } wińdzeniów.
    }

## `<sequence>`

sequence-invalid-length = Dłëgòsc cygù nie je bëlnô.  Mùszi bëc nieùjimnô całowitô lëczba.

sequence-invalid-step = Krok cygù nie je bëlny.  Mùszi bëc lëczbą do cygù ôrtu { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" cygù lëczbów nie je bëlné.  Mùszi bëc lëczbą.

sequence-invalid-endpoint-letters = "{ $attribute }" cygù bùchsztawów nie je bëlné.  Mùszi bëc kòmbinacją bùchsztawów.

sequence-invalid-endpoint = "{ $attribute }" cygù nie je bëlné.

select-from-sequence-coprime-not-numbers = coprime je pòminiãté, bò sã nie wëbiérô lëczbów

select-from-sequence-coprime-with-exclude-combinations = coprime je pòminiãté, bò je pòdóné excludeCombinations

## Resolving a `target`

target-not-found = target do `<{ $source }>` nie je bëlny: nie dô sã nalezc célu.

target-state-variable-not-found = target do `<{ $source }>` nie je bëlny: nie dô sã nalezc zmienny stanu ò mionie "{ $property }" na `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Zmienné `<odeSystem>` mùszą bëc jinszé jak zmiennô niezanôleżnô.

ode-system-duplicate-variable-names = Nie dô sã òkreslëc prawëch strón ODE z pòwtórzonyma mionama zanôleżnëch zmiennëch.

ode-system-rhs-function-error = Nie dô sã òkreslëc prawi stronë ODE.  Fela przë robieniu fùnkcje mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Nie dô sã òkreslëc kąta midzë { $count } prostima

angle-invalid-through-point = Pùnkt w through òd `<angle>` nie je bëlny

parabola-vertex-too-many-points = Parabòla z wiérzchòłkã przez wicy jak 1 pùnkt jesz nie je zrobionô.

parabola-too-many-points = Parabòla przez wicy jak 3 pùnktë jesz nie je zrobionô.

intersection-too-many-items = Przecãcé wicy jak dwùch elementów jesz nie je zrobioné

## Other math components

ionic-compound-not-two-ions = Jonowi związk z czims jinszim jak dwa jonë jesz nie je zrobiony.

ionic-compound-needs-cation-and-anion = Jonowi związk je zrobiony blós do jednégò kationa a jednégò aniona.

solve-equations-cannot-evaluate = Nie dô sã rozwiązac równaniô, bò sã gò nie dało wërachòwac: { $equation }

math-operators-operand-number-required = Mùszisz pòdac operandNumber, jak wëcygôsz matematiczny òperand.

eigen-decomposition-failed = Nie dało sã wërachòwac wôrtnotów włôsnëch macérzë

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameter { $parameters } nie wëstãpiwô we wzorze, tak że wiedno mdze pasowôł do lëczi.
       *[other] `<matchesPattern>`: parametrë { $parameters } nie wëstãpiwają we wzorze, tak że wiedno mdą pasowac do lëczi.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: nie dô sã zrozmiec grid="{ $grid }". Mùszi bëc none, medium, dense abò dwie dodatné lëczbë òddzeloné spacją, jak grid="1 0.5". Żódnô krata sã nie céchùje.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` pòtrzebùje fùnkcje z { $expected ->
        [one] jednym wińdzenim, nachilenim y' w kòżdim pùnkce, jak `y - x`
       *[other] dwùma wińdzeniama, wektorã w kòżdim pùnkce, jak `(y, -x)`
    }, ale pòdónô fùnkcjô mô { $found } wińdzeniów. { $alternative ->
        [none] Nick sã nie céchùje.
       *[other] `<{ $alternative }>` je kòmpònentã do ti fùnkcje. Nick sã nie céchùje.
    }

field-function-attribute-ignored-with-child = Atribut `function` je pòminiãti, bò fùnkcjô je pòdónô téż westrzódk kòmpònentu; bierzã tã ze westrzódka. Pòdôj fùnkcjã blós na jeden ze dwùch spòsobów.

field-variables-ignored =
    `<{ $component }>`: atribut `variables` mionëje zmienné wërażeniô napisónégò prosto westrzódk kòmpònentu. { $reason ->
        [function-child] Fùnkcjô je tuwò pòdónô jakò dzeckò `<function>`, co samò mionëje swòje zmienné, tak że `variables` je pòminiãté.
       *[no-expression] Tuwò ni ma taczégò wërażeniô, tak że `variables` je pòminiãté.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" nie je wspieróné w renderze prefigure; bierzã zachòwanié prawi pòzycje.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" nie je wspieróné w renderze prefigure; bierzã zachòwanié górny pòzycje.

prefigure-invalid-axis-bounds = `<graph>`: grańce òsë do kònwersje prefigure nie są bëlné; bierzã domëslny bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: szérzawa do kònwersje prefigure nie je bëlnô; bierzã domëslną szérzawã diagramù 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio do kònwersje prefigure nie je bëlné; bierzã domëslny stosënk bòków 1.

prefigure-grid-spacing-too-fine = `<graph>`: krata je za gãstô do grańców òsë; krata je pòminiãtô w renderze prefigure.

prefigure-annotations-not-rendered = `<graph>`: adnotacje sã nie céchùją, jak sã nie ùżiwô rendera PreFigure.

multiple-annotations-children = Nalazłé wicy dzecy `<annotations>` w `<graph>`; wszëtczé króm òstatnégò są pòminiãté.

## Referring to other components

copy-unrecognized-component-type = Nie dô sã rozszérzëc ani skòpiowac nieznónégò ôrtu kòmpònentu: { $type }.

copy-prop-not-found = Nie dało sã nalezc włôsnoscë { $property } na kòmpònence ôrtu { $component }

collect-no-source = Do collect nie nalazłé żódnégò zdrzódła.

collect-invalid-component-type = Nie dô sã zbierac kòmpònentów ôrtu `<{ $component }>`, bò to nie je bëlny ôrt kòmpònentu.

reference-index-unavailable = Nie dô sã òdwòłac do indeksu `{ $reference }`

## `<callAction>`

component-action-unavailable = Nie dô sã zawòłac { $action } na kòmpònence `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Pòdôwczi mają lëchi sztôłt.  Réżczi mają różné dłëgòscë. Nalazłé w componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Pòdôwczi mają pòwtórzoné miona kòlumnów.  Nalazłé w componentIdx :{ $componentIdx }

data-frame-missing-column-name = Pòdôwkóm felëje miono kòlumnë.  Nalazłé w componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Nôdgroda do ti òdpòwiescë òpiérô sã na òdpòwiescë wësłóny przez sóm tag answer, a to przëwiedze do niespòdzajnégò zachòwaniô.

answer-max-num-attempts-in-section-wide-check-work = Nastôwianié `maxNumAttempts` na `<answer>` westrzódk pòjimnika z `sectionWideCheckWork` nick nie robi, bò lëczba prób je sterowónô przez pòjimnik. Nastôwi `maxNumAttempts` na pòjimnikù.

nested-section-wide-check-work-max-num-attempts = Nastôwianié `maxNumAttempts` na pòjimnikù z `sectionWideCheckWork`, co sedzy westrzódk jinszégò pòjimnika z `sectionWideCheckWork`, nick nie robi, bò lëczba prób je sterowónô przez bùtnowi pòjimnik. Nastôwi `maxNumAttempts` na bùtnowim pòjimnikù.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Atribut { $attributes } nick nie zrobi bez nastôwionégò symbolicEquality.
       *[other] Atributë { $attributes } nick nie zrobią bez nastôwionégò symbolicEquality.
    }

answer-invalid-type = Ôrt òdpòwiescë nie je bëlny: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Skòrno kòmpònent `<{ $component }>` ni mô miona, nie dô sã gò ùżëc jakò atributu mòdułu

module-attribute-name-already-defined = Kòmpònentu `<{ $component } name="{ $name }">` nie dô sã ùżëc jakò atributu mòdułu, bò ôrt kòmpònentu `<module>` ju mô òkreslony atribut "{ $name }".

conditional-content-condition-ignored = Atribut `condition` je pòminiãti na kòmpònence `<conditionalContent>` z dzecama case abò else.

slider-markers-type-mismatch = Ôrt markerów sã nie zgòdzywô z ôrtã sëwôcza.

pretzel-problem-needs-statement-and-answer = pretzel nie je bëlny: kòżdé `<problem>` mùszi miec w se jedno `<statement>` a jedno `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel nie je bëlny: w mode="circuit" pierwszé `<problem>` nie mòże bëc distraktorã.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Wôrtnota { $values } do atributu `{ $attribute }` nie je bëlnô; pòmijóm jã.
       *[other] Wôrtnotë { $values } do atributu `{ $attribute }` nie są bëlné; pòmijóm je.
    }

attribute-must-be-references = Wôrtnota `{ $value }` do atributu `{ $attribute }` nie je bëlnô. Atribut mùszi bëc złożony z òdwòłaniów, co sã zaczinają òd `$`.

math-input-invalid-function-names = <mathInput>: pòminiãté lëché miona fùnkcjów w { $attribute }: { $names }. Pòkazywónô part kòżdégò miona mùszi miec nômni 2 znaczi (bùchsztawë abò mëslniczi); pò ni mòże przińc òpcjonalny przërostk `|<mathspeak alternatiwa>`.

## Building components from the source

component-type-invalid = Ôrt kòmpònentu nie je bëlny: `<{ $componentType }>`

attribute-repeated = Nie dô sã pòwtórzëc atributu { $attribute }.

attribute-invalid-for-component = Atribut "{ $attribute }" nie je bëlny do kòmpònentu ôrtu `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Definicjô sztélu { $styleNumber } mô za môłi kòntrast do { $context ->
        [text-on-background] farwë tekstu na farwie tła
        [high-contrast] farwë ò wësoczim kòntrasce na płótnie
        [line] farwë linie na płótnie
        [marker] farwë markera na płótnie
       *[text-on-canvas] farwë tekstu na płótnie
    }{ $mode ->
        [dark] { " (cemny trib)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; trzeba nômni { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Chòc definicjô sztélu { $styleNumber } mô farwë, co dôwają dosc kòntrastu do jasnégò tribù, to farwë do cemnégò tribù wëprowadzoné z tëch wôrtnotów mają za môłi kòntrast midzë farwą tekstu a farwą tła ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; trzeba nômni { $threshold }:1). { $suggestion ->
        [available] Żebë miec dosc kòntrastu w cemnym tribie, abò pòdniesë kòntrast jasnégò tribù (np. nastôwi { $lightAttribute }="{ $lightColor }"), abò przekrëj farwã cemnégò tribù (np. nastôwi { $darkAttribute }="{ $darkColor }").
       *[none] Żebë miec dosc kòntrastu w cemnym tribie, pòdniesë kòntrast jasnégò tribù abò przekrëj wëprowadzoné farwë przez textColorDarkMode a/abò backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Chòc definicjô sztélu { $styleNumber } mô farwã tekstu, co dôwô dosc kòntrastu do jasnégò tribù, to farwa tekstu do cemnégò tribù wëprowadzonô z ti wôrtnotë mô za môłi kòntrast na płótnie ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; trzeba nômni { $threshold }:1). { $suggestion ->
        [available] Żebë miec dosc kòntrastu w cemnym tribie, abò pòdniesë kòntrast jasnégò tribù (np. nastôwi textColor="{ $lightColor }"), abò przekrëj farwã cemnégò tribù (np. nastôwi textColorDarkMode="{ $darkColor }").
       *[none] Żebë miec dosc kòntrastu w cemnym tribie, pòdniesë kòntrast jasnégò tribù abò przekrëj wëprowadzoną farwã przez textColorDarkMode.
    }

section-multiple-style-palettes = Rozdzél mòże wëbrac blós jeden <stylePalette>; bierzã òstatny.

## Unique variants

variant-num-to-select-not-non-negative-integer = nie dô sã ùstalëc unikalnëch wariantów { $component }, bò numToSelect nie je nieùjimną całowitą lëczbą.

variant-num-to-select-not-constant-number = nie dô sã ùstalëc unikalnëch wariantów { $component }, bò numToSelect nie je stałą lëczbą.

variant-with-replacement-not-constant-boolean = nie dô sã ùstalëc unikalnëch wariantów { $component }, bò withReplacement nie je stałą logiczną wôrtnotą.

variant-select-weight-disables-unique = Unikalné wariantë do select są zastawioné, jak jakôs òpcjô mô pòdóné selectWeight abò selectForVariants

variant-coprime-undetermined = nie dô sã ùstalëc unikalnëch wariantów { $component }, bò nie dô sã ùstalëc, że coprime je wiedno fałszëwé.

variant-attribute-not-constant = nie dô sã ùstalëc unikalnëch wariantów { $component }, bò { $attribute } nie je stałą.

variant-attribute-not-number = nie dô sã ùstalëc unikalnëch wariantów { $component }, bò { $attribute } nie je lëczbą.

variant-attribute-wrong-type-for-sequence =
    nie dô sã ùstalëc unikalnëch wariantów { $component } ôrtu { $type }, bò { $attribute } nie je { $expected ->
        [letters-combination] kòmbinacją bùchsztawów
        [math-expression] bëlnym matematicznym wërażenim
        [integer] całowitą lëczbą
       *[number] lëczbą
    }.

variant-length-not-integer = nie dô sã ùstalëc unikalnëch wariantów { $component }, bò length nie je całowitą lëczbą.

variant-sort-not-implemented = unikalné wariantë { $component } ze sort jesz nie są zrobioné

variant-exclude-combinations-not-implemented = unikalné wariantë { $component } ze excludeCombinations jesz nie są zrobioné

variant-math-exclude-not-implemented = unikalné wariantë { $component } ôrtu math ze exclude jesz nie są zrobioné

variant-non-constant-exclude-not-implemented = unikalné wariantë { $component } z niestałim exclude jesz nie są zrobioné

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: nie je wspieróné w renderze prefigure do grafù; pòtomk je przeskòczony.

prefigure-descendant-invalid-geometry = { $subject }: geòmetriô nie je skùńczonô abò je niecałô; pòtomk je przeskòczony.

prefigure-curve-label-omitted = { $subject }: etikétë nie są wspieróné na przerobionëch elementach krzëwi; etikéta je pòminiãtô.

prefigure-curve-unsupported-definition-type = { $subject }: ôrt definicje krzëwi '{ $definitionType }' nie je wspieróny; pòtomk je przeskòczony.

prefigure-region-flip-functions-unsupported = { $subject }: atribut flipFunctions na regionBetweenCurves nie je wspieróny; pòtomk je przeskòczony.

prefigure-region-non-formula-child = { $subject }: blós fùnkcje-dzecë ôrtu wzór są wspieróné na regionBetweenCurves; pòtomk je przeskòczony.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' nie je wspieróné do { $labelKind ->
        [line-family] etikétë z familie prostëch
       *[point] etikétë pùnktu
    }; bierzã domëslné wërównanié PreFigure.

prefigure-fill-style-unsupported = { $subject }: sztél wëpełnieniô '{ $fillStyle }' nie je wspieróny przez PreFigure; wrôcóm do fùl wëpełnieniô.

prefigure-line-style-unknown = { $subject }: nieznóny sztél linie '{ $lineStyle }' je pòminiãti w wińdzenim PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: sztél markera '{ $markerStyle }' je przełożony na sztél PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: sztél markera '{ $markerStyle }' nie je wspieróny przez PreFigure; bierzã domëslny sztél.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` nie je bëlny; nie dô sã rozwiązac célu. Adnotacjô je pòminiãtô.

annotation-ref-multiple-targets = `<annotation>`: `ref` wskôzôł na wicy célów; bierzã pierwszi.

annotation-ref-outside-graph = `<annotation>`: `ref` nie je bëlny; cél je bùten grafù naòkòło. Adnotacjô je pòminiãtô.

annotation-ref-unsupported-target = `<annotation>`: `ref` nie je bëlny; cél nie je wspierónym graficznym òbiektã w kònwersji prefigure. Adnotacjô je pòminiãtô.

annotation-text-missing = `<annotation>`: `text` felëje abò je pùsti; wësélóm pùsti tekst.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Nalazłô je cyrkularnô zanôleżnosc.
       *[other] Nalazłô je cyrkularnô zanôleżnosc, co bierze w se kòmpònent `<{ $componentType }>`.
    }

reference-no-referent = Do òdwòłaniô `{ $reference }` nie nalazłé żódnégò referentu

reference-multiple-referents = Do òdwòłaniô `{ $reference }` nalazłé wicy referentów

## Children that do not match

children-invalid-attribute-format = Fòrmat atributu { $attribute } òd `<{ $componentType }>` nie je bëlny.

children-invalid = Lëché dzecë do `<{ $componentType }>`: nalazłé lëché dzecë: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Wôrtnota `{ $value }` do atributu `{ $attribute }` nie je bëlnô, bierzã wôrtnotã `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Wersje DoenetML { $version } nie nalazłé.
       *[other] Wersje DoenetML { $version } nie nalazłé. Wrôcóm do wersje { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Lëchi DoenetML: { $content }

parse-tag-missing-close-tag = Lëchi DoenetML: Tag `{ $tag }` ni mô zamikającégò tagù. Spòdzéwóné bëło tagù, co sã zamikô sóm, abò tagù `</{ $tagName }>`.

parse-tag-error = Lëchi DoenetML: Fela w tagù `<{ $tagName }>`

parse-attribute-missing-value = Lëchi DoenetML: Wëzdrzi na to, że lëchémù atributowi `{ $attribute }` felëje wôrtnota.

parse-attribute-invalid = Lëchi DoenetML: Lëchi atribut `{ $attribute }`

parse-attribute-value-invalid = Lëchi DoenetML: Lëchô wôrtnota atributu `{ $value }`

parse-attribute-value-quote-mismatch = Lëchi DoenetML: Lëchô wôrtnota atributu `{ $value }`. Cëdzësłowë sã nie zgòdzywają. Wëzdrzi na to, że cë felëje `{ $quote }`

parse-open-tag-name-missing = Lëchi DoenetML: Nalazłi tag bez miona tagù, np. `<`

parse-tag-not-closed = Lëchi DoenetML: Tag `{ $tag }` nie béł zamkłi (wëzdrzi na to, że felëje `>`).

parse-self-closing-tag-name-missing = Lëchi DoenetML: Nalazłi tag bez miona tagù `<{ $content }>`

parse-self-closing-tag-not-closed = Lëchi DoenetML: Tag `{ $tag }` nie béł zamkłi (wëzdrzi na to, że felëje `/>`).

parse-tag-invalid-attributes = Lëchi DoenetML: Tag `{ $tag }` nie je bëlny. Mòże miec lëché atributë.

parse-close-tag-name-missing = Lëchi DoenetML: Nalazłi zamikający tag bez miona tagù, np. `</`

parse-attribute-value-unquoted = Wôrtnotë atributów mùszą stojec w cëdzësłowach: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Lëchi DoenetML: Nalazłi zamikający tag `{ $tag }`, ale bez òdpòwiôdającégò òtmikającégò tagù

parse-close-tag-mismatched = Lëchi DoenetML: Zamikający tag sã nie zgòdzywô. Spòdzéwóné bëło `</{ $expected }>`. Nalazłé `{ $found }`

parser-node-unconvertible = Nie dało sã przerobic wãzła { $node } na wãzeł Dast.

## Names

name-attribute-invalid =
    Lëchi atribut name='{ $name }'. { $reason ->
        [characters] Miona mògą miec blós bùchsztawë, lëczbë, pòdkreslniczi abò mëslniczi.
       *[start] Miona mùszą sã zaczinac òd bùchsztawù.
    }

component-name-invalid-start = Lëché miono kòmpònentu "{ $name }". Miona mùszą sã zaczinac òd bùchsztawù.

## `<answer>` sugar

answer-video-watched-missing-video = Òdpòwiésc ôrtu videoWatched mùszi miec atribut video

answer-video-watched-video-not-reference = Òdpòwiésc ôrtu videoWatched mùszi miec atribut video, co je òdwòłanim

answer-name-not-single-text = Atribut name òdpòwiescë mùszi miec jedno tekstowé dzeckò

## Referencing another document

external-doenetml-recursion-limit = Nie dô sã pòbrac bùtnowégò DoenetML bez za wiele równiów rekùrsje. Je tam cyrkularné òdwòłanié?

external-doenetml-unavailable = Nie dô sã pòbrac DoenetML z { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Lëchi DoenetML pòbróny z { $attribute }="{ $uri }": nie zgòdzywôł sã z ôrtã kòmpònentu "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` je przestarzałi; ùżëj `{ $to }`.
       *[other] [deprecation] Atribut `{ $from }` na `<{ $component }>` je przestarzałi; ùżëj `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` je przestarzałi a je pòminiãti, bò je téż pòdóné `{ $to }`.
       *[other] [deprecation] Atribut `{ $from }` na `<{ $component }>` je przestarzałi a je pòminiãti, bò je téż pòdóné `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Atribut `{ $attribute }` na `<{ $component }>` je przestarzałi a je pòminiãti.

deprecated-attribute-to-child = [deprecation] Atribut `{ $attribute }` na `<{ $component }>` je przestarzałi; ùżëj lepi dzecka `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Wôrtnota `{ $value }` atributu `{ $attribute }` na `<{ $component }>` je przestarzałô; ùżëj `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` ùmie robic wielnosc blós pò angelskù, tak że jegò tekst òstôwô niezmieniony w dokùmence napisónym w { $locale }. Napiszë wielną fòrmã prosto, abò jã nastôwi atributã `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Element `<{ $tag }>` nie je znónym elementã Doenet.

schema-element-not-allowed-at-root = Element `<{ $tag }>` nie je dozwòlony w kòrzeniu dokùmentu.

schema-element-not-allowed-inside = Element `<{ $tag }>` nie je dozwòlony westrzódk `<{ $parent }>`.

schema-attribute-unrecognized = Element `<{ $tag }>` ni mô atributu ò mionie `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribut `{ $attribute }` elementu `<{ $tag }>` mùszi bëc lëstą, co kòżdi ji element je jednym z: { $allowed }
       *[other] Atribut `{ $attribute }` elementu `<{ $tag }>` mùszi bëc jednym z: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Lëché miono wariantu do select.  Miono wariantu { $variantName } wëstãpiwô w { $numOptions } òpcjach, ale lëczba do wëbraniô je { $numToSelect }.

select-variant-name-without-options = Do select są pòdóné jaczés wariantë, ale ni ma żódnëch òpcjów do mòżlëwégò miona wariantu: { $variantName }.

select-variant-name-not-possible = Miono wariantu { $variantName } pòdóné do select nie je mòżlëwim mionã wariantu.

select-too-few-options = Nie dô sã wëbrac { $numToSelect } kòmpònentów blós z { $numOptions }.

select-from-sequence-too-few-values = Nie dô sã wëbrac { $numToSelect } wôrtnotów z cygù ò dłëgòscë { $length }.

select-from-sequence-indices-count-mismatch = Lëczba indeksów pòdónëch do select mùszi sã zgòdzywac z lëczbą do wëbraniô

select-from-sequence-indices-not-integers = Wszëtczé indeksë pòdóné do select mùszą bëc całowitima lëczbama

select-from-sequence-index-excluded = Pòdóny indeks selectfromsequence béł wëkluczony

select-from-sequence-indices-excluded-combination = Pòdóné indeksë selectfromsequence bëłë wëkluczoną kòmbinacją

select-from-sequence-coprime-not-positive-integers = Nie dô sã wëbrac kòmbinacjów wzglãdno pierwszëch, bò sã nie wëbiérô dodatnëch całowitëch lëczbów.

select-from-sequence-coprime-common-factor = Nie dô sã wëbrac lëczbów wzglãdno pierwszëch. Wszëtczé mòżlëwé wôrtnotë mają wspólny dzelnik. (Pòdóné wôrtnotë "from" abò "to" mùszą bëc wzglãdno pierwszé ze "step".)

select-from-sequence-coprime-single-number = Nie dô sã wëbrac kòmbinacjów wzglãdno pierwszëch z jedny lëczbë, co nie je 1.

select-from-sequence-excluded-too-many-combinations = Wëkluczoné wicy jak 70% kòmbinacjów w selectFromSequence

select-from-sequence-coprime-none-found = Nie dało sã wëbrac lëczbów wzglãdno pierwszëch. Wszëtczé mòżlëwé wôrtnotë mają wspólny dzelnik.

select-from-sequence-too-few-unique-values = Nie dô sã wëbrac { $numToSelect } unikalnëch wôrtnotów z cygù ò dłëgòscë { $numPossibleValues }

select-prime-numbers-too-few-values = Nie dô sã wëbrac { $numToSelect } wôrtnotów z lëstë pierwszëch lëczbów ò dłëgòscë { $numValues }

select-prime-numbers-values-count-mismatch = Lëczba wôrtnotów pòdónëch do select mùszi sã zgòdzywac z lëczbą do wëbraniô

select-prime-numbers-values-not-prime = Wszëtczé wôrtnotë pòdóné do select pierwszëch lëczbów mùszą bëc na lësce pierwszëch lëczbów

select-prime-numbers-values-excluded-combination = Pòdóné wôrtnotë selectPrimeNumbers bëłë wëkluczoną kòmbinacją

select-prime-numbers-excluded-too-many-combinations = Wëkluczoné wicy jak 70% kòmbinacjów w selectPrimeNumbers

select-random-combination-fluke = Przez baro nieprawdopòdobny trafùnk nie dało sã wëbrac kòmbinacje przëpôdkòwëch wôrtnotów

select-random-value-fluke = Przez baro nieprawdopòdobny trafùnk nie dało sã wëbrac przëpôdkòwi wôrtnotë

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` sã nie céchùje westrzódk matematiczi; wërażenié je składóné tak, jak przódë, nigle dało sã wkłôdac wpisë do westrzódka. { $reason ->
        [not-inline] Blós wpis wëbiérkù `inline` sã miescy w wërażeniu; bez `inline` to je blok knąpów.
        [expanded] Tekstowi wpis `expanded` to je wielorëżkòwé pòle, za wiôldżé, żebë stojec w wërażeniu.
        [on-graph] Na grafie wërażenié sã céchùje jakò jeden òbrôzk, co ni mô molu na kòntrolkã.
       *[relative-width] Jegò `width` je relatiwnô (procent abò `em`), a w wërażeniu ni mô do czegò sã miérzëc. Pòdôj szérzawã w absolutnëch jednostkach, jak `px`.
    }
