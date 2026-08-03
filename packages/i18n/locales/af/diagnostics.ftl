# Afrikaans diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Afrikaans negates with a closing «nie», which is why several of these
# sentences end in a word the English has no counterpart for.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } word geïgnoreer wanneer twee eindpunte gespesifiseer is

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } word geïgnoreer wanneer 'n eindpunt en 'n middelpunt albei gespesifiseer is

line-segment-midpoint-offset-without-midpoint = midpointOffset het geen uitwerking sonder 'n middelpunt nie

## `<line>`

line-points-undetermined-dimensions = Lyn deur punte met onbepaalde dimensies.

line-points-too-few-dimensions = 'n Lyn moet deur punte van ten minste twee dimensies loop.

line-points-depend-on-variables = Lyn loop deur punte wat van veranderlikes afhang: { $variables }.

line-equation-invalid-format = Ongeldige formaat vir die vergelyking van 'n lyn in die veranderlikes { $variable1 } en { $variable2 }.

## `<ray>`

ray-overprescribed-through = Straal word deur through, endpoint en direction voorgeskryf. Die gespesifiseerde through word geïgnoreer.

ray-dimension-mismatch = numDimensions stem nie ooreen in die straal nie.

## `<vector>`

vector-overprescribed-head = Vektor word deur head, tail en displacement voorgeskryf. Die gespesifiseerde head word geïgnoreer.

vector-dimension-mismatch = numDimensions stem nie ooreen in die vektor nie.

## Attracting and constraining

attract-to-without-nearest-point = Kan nie na 'n `<{ $component }>` aantrek nie, want dit het geen nearestPoint-toestandsveranderlike nie.

constrain-to-without-nearest-point = Kan nie tot 'n `<{ $component }>` beperk nie, want dit het geen nearestPoint-toestandsveranderlike nie.

constrain-to-interior-without-nearest-point = Kan nie tot die binnekant van 'n `<{ $component }>` beperk nie, want dit het geen nearestPoint-toestandsveranderlike nie.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition word geïgnoreer vir 'n choiceInput wat nie inlyn is nie

## Ordering children by index

choice-input-indices-count-mismatch = Die indekse wat vir choiceInput gespesifiseer is, word geïgnoreer omdat die aantal indekse nie by die aantal choice-kinders pas nie.

pretzel-indices-count-mismatch = Die indekse wat vir problem gespesifiseer is, word geïgnoreer omdat die aantal indekse nie by die aantal problem-kinders pas nie.

shuffle-indices-count-mismatch = Die indekse wat vir shuffle gespesifiseer is, word geïgnoreer omdat die aantal indekse nie by die aantal komponente pas nie.

indices-ignored-out-of-range = Die indekse wat vir { $component } gespesifiseer is, word geïgnoreer omdat sommige indekse buite bereik is.

pretzel-indices-repeated = Die indekse wat vir pretzel gespesifiseer is, word geïgnoreer omdat sommige indekse herhaal word.

pretzel-circuit-first-index = Die indekse wat vir pretzel in die circuit-modus gespesifiseer is, word geïgnoreer omdat die eerste indeks 1 moet wees.

## `<shuffle>` and `<sort>`

string-children-need-type = Sodat `<{ $component }>` met stringkinders kan werk, moet 'n `type`-attribuut gespesifiseer word.

invalid-type-defaulting-to-math = Ongeldige type { $type } vir die komponent { $component }. Dit moet een van math, text, number of boolean wees. Word na math verstel.

string-not-valid-component-to-arrange = Die string "{ $value }" is nie 'n geldige komponent om te { $component } nie. Word geïgnoreer.

## Types and variables

invalid-type-defaulting-to-number = Ongeldige type { $type }; type word na number verstel.

invalid-variable-value = Ongeldige waarde van 'n veranderlike: `{ $value }`

## Variants

variant-index-must-be-number = Variantindeks { $index } moet 'n getal wees

variant-index-must-be-integer = Variantindeks { $index } moet 'n heelgetal wees

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` is nie vir absolute mates geïmplementeer nie. Wydtes word na relatief verstel.

side-by-side-absolute-margins = `<{ $component }>` is nie vir absolute mates geïmplementeer nie. Kantlyne word na relatief verstel.

side-by-side-no-block-child = Ongeldige `<{ $component }>`: dit moet ten minste een blokkind hê.

## `<label>`

label-for-ignored-on-graphical = Die `for`-attribuut op 'n grafiese `<label>` word geïgnoreer.

label-for-must-resolve-to-one = Die `for`-attribuut op `<label>` moet na presies een komponent oplos.

label-for-unresolved = Die `for`-attribuut op `<label>` kon nie na 'n komponent opgelos word nie.

label-for-answer-with-authored-inputs = Die `for`-attribuut op `<label>` verwys na 'n `<answer>` met uitdruklik geskrewe invoere; verwys direk na die invoer.

label-for-answer-without-input = Die `for`-attribuut op `<label>` verwys na 'n `<answer>` sonder 'n invoer om te etiketteer.

label-for-must-reference-input-or-answer = Die `for`-attribuut op `<label>` moet na 'n invoer of 'n antwoord verwys.

## Accessibility

accessibility-short-description-or-decorative = Ter wille van toeganklikheid moet `<{ $component }>` óf 'n kort beskrywing hê óf as dekoratief gespesifiseer wees.

accessibility-video-short-description = Ter wille van toeganklikheid moet `<video>` 'n kort beskrywing hê.

accessibility-input-short-description-or-label = Ter wille van toeganklikheid moet `<{ $component }>` 'n kort beskrywing of 'n etiket hê.

accessibility-answer-input-short-description-or-label = Ter wille van toeganklikheid moet 'n `<answer>` wat 'n invoer skep, 'n kort beskrywing of 'n etiket hê.

accessibility-short-description-contains-math = Kort beskrywings behoort nie wiskundekomponente soos `<{ $component }>` te bevat nie. Skryf enige wiskunde in woorde uit.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } het onvoldoende kontras vir die afdelingsopskrifteks (donker modus) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vereis ten minste { $threshold }:1).
       *[other] { $colorName } het onvoldoende kontras vir die afdelingsopskrifteks ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vereis ten minste { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = 'n `<circle>` deur { $count } punte is nog nie geïmplementeer vir die geval waar die punte nie numeriese waardes het nie.

circle-too-many-through-points = Kan nie 'n sirkel deur meer as 3 punte bereken nie.

circle-overprescribed-radius-center-points = Kan nie 'n sirkel met 'n gespesifiseerde radius, middelpunt én deurpunte bereken nie.

circle-center-with-multiple-points = Kan nie 'n sirkel met 'n gespesifiseerde middelpunt deur meer as 1 punt bereken nie.

circle-radius-too-small = Kan nie die sirkel bereken nie: aangesien die afstand tussen die twee punte { $distance } is, is die gespesifiseerde radius { $radius } te klein.

circle-radius-with-many-points = Kan nie 'n sirkel deur meer as twee punte met 'n gespesifiseerde radius skep nie.

circle-invalid-center-or-through-points = Ongeldige middelpunt of deurpunte van die sirkel.

circle-radius-center-with-multiple-points = Kan nie die radius bereken van 'n sirkel met 'n gespesifiseerde middelpunt deur meer as 1 punt nie.

circle-change-radius-non-numerical = Kan nie die radius verander van 'n sirkel deur punte sonder numeriese waardes nie

circle-radius-with-points-non-numerical = Kan nie 'n sirkel deur meer as een punt met 'n gespesifiseerde radius skep wanneer daar nie numeriese waardes is nie.

circle-change-center-non-numerical = Die verandering van die middelpunt van 'n sirkel deur punte sonder numeriese waardes is nog nie geïmplementeer nie.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Onvoldoende dimensies vir die definisieversameling van die funksie. Die definisieversameling het { $intervals } interval, maar die funksie het { $inputs ->
            [one] { $inputs } invoer
           *[other] { $inputs } invoere
        }.
       *[other] Onvoldoende dimensies vir die definisieversameling van die funksie. Die definisieversameling het { $intervals } intervalle, maar die funksie het { $inputs ->
            [one] { $inputs } invoer
           *[other] { $inputs } invoere
        }.
    }

function-domain-invalid-format = Ongeldige formaat vir die definisieversameling van die funksie.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Die nie-numeriese maksimum van die funksie word geïgnoreer.
        [minimum] Die nie-numeriese minimum van die funksie word geïgnoreer.
        [extremum] Die nie-numeriese ekstremum van die funksie word geïgnoreer.
        [point] Die nie-numeriese punt van die funksie word geïgnoreer.
        [slope] Die nie-numeriese helling van die funksie word geïgnoreer.
       *[other] Die nie-numeriese { $type } van die funksie word geïgnoreer.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Die leë maksimum van die funksie word geïgnoreer.
        [minimum] Die leë minimum van die funksie word geïgnoreer.
        [extremum] Die leë ekstremum van die funksie word geïgnoreer.
        [point] Die leë punt van die funksie word geïgnoreer.
       *[other] Die leë { $type } van die funksie word geïgnoreer.
    }

function-points-too-close = Die funksie bevat twee punte wat te na aan mekaar lê. Die funksie kan nie gedefinieer word nie.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Funksie-iterasies is slegs moontlik as die aantal invoere van die funksie gelyk is aan die aantal uitvoere. Hierdie funksie het { $inputs } invoer en { $outputs ->
            [one] { $outputs } uitvoer
           *[other] { $outputs } uitvoere
        }.
       *[other] Funksie-iterasies is slegs moontlik as die aantal invoere van die funksie gelyk is aan die aantal uitvoere. Hierdie funksie het { $inputs } invoere en { $outputs ->
            [one] { $outputs } uitvoer
           *[other] { $outputs } uitvoere
        }.
    }

## `<sequence>`

sequence-invalid-length = Ongeldige lengte van die ry. Dit moet 'n nie-negatiewe heelgetal wees.

sequence-invalid-step = Ongeldige stap van die ry. Dit moet 'n getal wees vir 'n ry van die tipe { $type }.

sequence-invalid-endpoint-number = Ongeldige "{ $attribute }" van 'n getalry. Dit moet 'n getal wees.

sequence-invalid-endpoint-letters = Ongeldige "{ $attribute }" van 'n letterry. Dit moet 'n letterkombinasie wees.

sequence-invalid-endpoint = Ongeldige "{ $attribute }" van die ry.

select-from-sequence-coprime-not-numbers = coprime word geïgnoreer omdat daar nie getalle gekies word nie

select-from-sequence-coprime-with-exclude-combinations = coprime word geïgnoreer omdat excludeCombinations gespesifiseer is

## Resolving a `target`

target-not-found = Ongeldige target vir `<{ $source }>`: die teiken kan nie gevind word nie.

target-state-variable-not-found = Ongeldige target vir `<{ $source }>`: 'n toestandsveranderlike met die naam "{ $property }" kan nie op 'n `<{ $component }>` gevind word nie.

## `<odeSystem>`

ode-system-variables-match-independent = Die veranderlikes van `<odeSystem>` moet van die onafhanklike veranderlike verskil.

ode-system-duplicate-variable-names = Kan nie ODE-RHS-funksies met herhaalde afhanklike veranderlike name definieer nie.

ode-system-rhs-function-error = Kan nie die ODE-RHS-funksie definieer nie. Fout met die skep van die mathjs-funksie.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Kan nie 'n hoek tussen { $count } lyne definieer nie

angle-invalid-through-point = Ongeldige punt in through van `<angle>`

parabola-vertex-too-many-points = 'n Parabool met 'n draaipunt deur meer as 1 punt is nog nie geïmplementeer nie.

parabola-too-many-points = 'n Parabool deur meer as 3 punte is nog nie geïmplementeer nie.

intersection-too-many-items = Die snyding van meer as twee items is nog nie geïmplementeer nie

## Other math components

ionic-compound-not-two-ions = 'n Ioniese verbinding van iets anders as twee ione is nog nie geïmplementeer nie.

ionic-compound-needs-cation-and-anion = 'n Ioniese verbinding is slegs vir een katioon en een anioon geïmplementeer.

solve-equations-cannot-evaluate = Kan nie die vergelyking oplos nie omdat dit nie geëvalueer kon word nie: { $equation }

math-operators-operand-number-required = 'n operandNumber moet gespesifiseer word wanneer 'n wiskundige operand onttrek word.

eigen-decomposition-failed = Kon nie die eiewaardes van die matriks bereken nie

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: die parameter { $parameters } kom nie in die patroon voor nie, so dit sal altyd by 'n leë plek pas.
       *[other] `<matchesPattern>`: die parameters { $parameters } kom nie in die patroon voor nie, so hulle sal altyd by 'n leë plek pas.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: kan grid="{ $grid }" nie interpreteer nie. Dit moet none, medium, dense, of twee positiewe getalle geskei deur 'n spasie wees, soos grid="1 0.5". Geen rooster word geteken nie.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" word nie in die prefigure-weergeër ondersteun nie; die regsposisie-gedrag word gebruik.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" word nie in die prefigure-weergeër ondersteun nie; die bo-posisie-gedrag word gebruik.

prefigure-invalid-axis-bounds = `<graph>`: ongeldige asgrense vir die prefigure-omskakeling; die verstek-bbox (-10,-10,10,10) word gebruik.

prefigure-invalid-width = `<graph>`: ongeldige wydte vir die prefigure-omskakeling; die verstekdiagramwydte 425 word gebruik.

prefigure-invalid-aspect-ratio = `<graph>`: ongeldige aspectRatio vir die prefigure-omskakeling; die verstekverhouding 1 word gebruik.

prefigure-grid-spacing-too-fine = `<graph>`: die roosterspasiëring is te fyn vir die asgrense; die rooster word in die prefigure-weergeër weggelaat.

prefigure-annotations-not-rendered = `<graph>`: aantekeninge word nie weergegee wanneer die PreFigure-weergeër nie gebruik word nie.

multiple-annotations-children = Meer as een `<annotations>`-kind is in `<graph>` gevind; almal behalwe die laaste word geïgnoreer.

## Referring to other components

copy-unrecognized-component-type = Kan nie 'n onherkende komponenttipe uitbrei of kopieer nie: { $type }.

copy-prop-not-found = Kon nie die eienskap { $property } op 'n komponent van die tipe { $component } vind nie

collect-no-source = Geen bron vir collect gevind nie.

collect-invalid-component-type = Kan nie komponente van die tipe `<{ $component }>` versamel nie, want dit is 'n ongeldige komponenttipe.

reference-index-unavailable = Kan nie na die indeks `{ $reference }` verwys nie

## `<callAction>`

component-action-unavailable = Kan nie { $action } op die komponent `{ $reference }` aanroep nie

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Die data het 'n ongeldige vorm. Rye het onbestendige lengtes. Gevind in componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Die data het herhaalde kolomname. Gevind in componentIdx :{ $componentIdx }

data-frame-missing-column-name = Die data kort 'n kolomnaam. Gevind in componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = 'n award vir hierdie antwoord is op die answer-etiket se eie ingediende antwoord gebaseer, wat tot onverwagte gedrag sal lei.

answer-max-num-attempts-in-section-wide-check-work = Om `maxNumAttempts` op 'n `<answer>` binne 'n houer met `sectionWideCheckWork` te stel, het geen uitwerking nie, want die aantal pogings word deur die houer beheer. Stel `maxNumAttempts` eerder op die houer.

nested-section-wide-check-work-max-num-attempts = Om `maxNumAttempts` te stel op 'n houer met `sectionWideCheckWork` wat binne 'n ander houer met `sectionWideCheckWork` is, het geen uitwerking nie, want die aantal pogings word deur die buitenste houer beheer. Stel `maxNumAttempts` eerder op die buitenste houer.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Die { $attributes }-attribuut sal geen uitwerking hê sonder dat symbolicEquality gestel is nie.
       *[other] Die { $attributes }-attribute sal geen uitwerking hê sonder dat symbolicEquality gestel is nie.
    }

answer-invalid-type = Ongeldige tipe vir die antwoord: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Aangesien die komponent `<{ $component }>` geen naam het nie, kan dit nie vir 'n module-attribuut gebruik word nie

module-attribute-name-already-defined = Die komponent `<{ $component } name="{ $name }">` kan nie as 'n attribuut vir 'n module gebruik word nie, omdat die komponenttipe `<module>` reeds 'n "{ $name }"-attribuut gedefinieer het.

conditional-content-condition-ignored = Die attribuut `condition` word geïgnoreer op 'n `<conditionalContent>`-komponent met case- of else-kinders.

slider-markers-type-mismatch = Die merkertipe pas nie by die slider-tipe nie.

pretzel-problem-needs-statement-and-answer = Ongeldige pretzel: elke `<problem>` moet een `<statement>` en een `<answer>` bevat.

pretzel-circuit-first-problem-distractor = Ongeldige pretzel: in mode="circuit" kan die eerste `<problem>` nie 'n afleier wees nie.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Ongeldige waarde { $values } vir die attribuut `{ $attribute }`; word geïgnoreer.
       *[other] Ongeldige waardes { $values } vir die attribuut `{ $attribute }`; word geïgnoreer.
    }

attribute-must-be-references = Ongeldige waarde `{ $value }` vir die attribuut `{ $attribute }`. Die attribuut moet uit verwysings bestaan wat met 'n `$` begin.

math-input-invalid-function-names = <mathInput>: ongeldige funksiename in { $attribute } word geïgnoreer: { $names }. Elke naam se vertoondeel moet ten minste 2 karakters lank wees (letters of koppeltekens); 'n opsionele `|<mathspeak alternative>`-agtervoegsel mag volg.

## Building components from the source

component-type-invalid = Ongeldige komponenttipe: `<{ $componentType }>`

attribute-repeated = Die attribuut { $attribute } kan nie herhaal word nie.

attribute-invalid-for-component = Ongeldige attribuut "{ $attribute }" vir 'n komponent van die tipe `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Styldefinisie { $styleNumber } het onvoldoende kontras vir { $context ->
        [text-on-background] die tekskleur teen die agtergrondkleur
        [high-contrast] die hoëkontraskleur teen die doek
        [line] die lynkleur teen die doek
        [marker] die merkerkleur teen die doek
       *[text-on-canvas] die tekskleur teen die doek
    }{ $mode ->
        [dark] { " (donker modus)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vereis ten minste { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Hoewel styldefinisie { $styleNumber } kleure spesifiseer wat voldoende kontras vir die ligte modus gee, het die donkermoduskleure wat daaruit afgelei is onvoldoende kontras vir die tekskleur teen die agtergrondkleur ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vereis ten minste { $threshold }:1). { $suggestion ->
        [available] Verhoog óf die ligtemoduskontras (stel byvoorbeeld { $lightAttribute }="{ $lightColor }") óf oorheers die donkermoduskleur (stel byvoorbeeld { $darkAttribute }="{ $darkColor }") om voldoende kontras in die donker modus te verseker.
       *[none] Verhoog die ligtemoduskontras of oorheers die afgeleide kleure met textColorDarkMode en/of backgroundColorDarkMode om voldoende kontras in die donker modus te verseker.
    }

style-definition-dark-mode-text-canvas-contrast =
    Hoewel styldefinisie { $styleNumber } 'n tekskleur spesifiseer wat voldoende kontras vir die ligte modus gee, het die donkermodus-tekskleur wat daaruit afgelei is onvoldoende kontras teen die doek ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vereis ten minste { $threshold }:1). { $suggestion ->
        [available] Verhoog óf die ligtemoduskontras (stel byvoorbeeld textColor="{ $lightColor }") óf oorheers die donkermoduskleur (stel byvoorbeeld textColorDarkMode="{ $darkColor }") om voldoende kontras in die donker modus te verseker.
       *[none] Verhoog die ligtemoduskontras of oorheers die afgeleide kleur met textColorDarkMode om voldoende kontras in die donker modus te verseker.
    }

section-multiple-style-palettes = 'n Afdeling kan slegs een <stylePalette> kies; die laaste een word gebruik.

## Unique variants

variant-num-to-select-not-non-negative-integer = kan nie die unieke variante van { $component } bepaal nie omdat numToSelect nie 'n nie-negatiewe heelgetal is nie.

variant-num-to-select-not-constant-number = kan nie die unieke variante van { $component } bepaal nie omdat numToSelect nie 'n konstante getal is nie.

variant-with-replacement-not-constant-boolean = kan nie die unieke variante van { $component } bepaal nie omdat withReplacement nie 'n konstante boolean is nie.

variant-select-weight-disables-unique = Unieke variante vir select word gedeaktiveer as 'n opsie selectWeight of selectForVariants gespesifiseer het

variant-coprime-undetermined = kan nie die unieke variante van { $component } bepaal nie omdat daar nie bepaal kan word dat coprime altyd vals is nie.

variant-attribute-not-constant = kan nie die unieke variante van { $component } bepaal nie omdat { $attribute } nie 'n konstante is nie.

variant-attribute-not-number = kan nie die unieke variante van { $component } bepaal nie omdat { $attribute } nie 'n getal is nie.

variant-attribute-wrong-type-for-sequence =
    kan nie die unieke variante van { $component } van die tipe { $type } bepaal nie omdat { $attribute } nie { $expected ->
        [letters-combination] 'n letterkombinasie
        [math-expression] 'n geldige wiskundige uitdrukking
        [integer] 'n heelgetal
       *[number] 'n getal
    } is nie.

variant-length-not-integer = kan nie die unieke variante van { $component } bepaal nie omdat length nie 'n heelgetal is nie.

variant-sort-not-implemented = unieke variante van 'n { $component } met sort is nog nie geïmplementeer nie

variant-exclude-combinations-not-implemented = unieke variante van 'n { $component } met excludeCombinations is nog nie geïmplementeer nie

variant-math-exclude-not-implemented = unieke variante van 'n { $component } van die tipe math met exclude is nog nie geïmplementeer nie

variant-non-constant-exclude-not-implemented = unieke variante van 'n { $component } met 'n nie-konstante exclude is nog nie geïmplementeer nie

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: word nie in die graph-prefigure-weergeër ondersteun nie; die afstammeling word oorgeslaan.

prefigure-descendant-invalid-geometry = { $subject }: nie-eindige of onvolledige meetkunde; die afstammeling word oorgeslaan.

prefigure-curve-label-omitted = { $subject }: etikette word nie op omgeskakelde krommelemente ondersteun nie; die etiket word weggelaat.

prefigure-curve-unsupported-definition-type = { $subject }: die krommedefinisietipe '{ $definitionType }' word nie ondersteun nie; die afstammeling word oorgeslaan.

prefigure-region-flip-functions-unsupported = { $subject }: die flipFunctions-attribuut op regionBetweenCurves word nie ondersteun nie; die afstammeling word oorgeslaan.

prefigure-region-non-formula-child = { $subject }: slegs kindfunksies van die tipe formula word op regionBetweenCurves ondersteun; die afstammeling word oorgeslaan.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' word nie ondersteun vir { $labelKind ->
        [line-family] 'n lynfamilie-etiket
       *[point] 'n puntetiket
    } nie; die verstek-PreFigure-belyning word gebruik.

prefigure-fill-style-unsupported = { $subject }: die vulstyl '{ $fillStyle }' word nie deur PreFigure ondersteun nie; daar word na 'n soliede vulling teruggeval.

prefigure-line-style-unknown = { $subject }: die onbekende lynstyl '{ $lineStyle }' word uit die PreFigure-uitvoer weggelaat.

prefigure-marker-style-mapped-to-diamond = { $subject }: die merkerstyl '{ $markerStyle }' word na die PreFigure-styl 'diamond' afgebeeld.

prefigure-marker-style-unsupported = { $subject }: die merkerstyl '{ $markerStyle }' word nie deur PreFigure ondersteun nie; die verstekstyl word gebruik.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ongeldige `ref`; die teiken kan nie opgelos word nie. Die aantekening word weggelaat.

annotation-ref-multiple-targets = `<annotation>`: `ref` het na meer as een teiken opgelos; die eerste teiken word gebruik.

annotation-ref-outside-graph = `<annotation>`: ongeldige `ref`; die teiken is buite die omliggende grafiek. Die aantekening word weggelaat.

annotation-ref-unsupported-target = `<annotation>`: ongeldige `ref`; die teiken is nie 'n ondersteunde grafiese objek in die prefigure-omskakeling nie. Die aantekening word weggelaat.

annotation-text-missing = `<annotation>`: `text` ontbreek of is leeg; leë teks word uitgestuur.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Sirkulêre afhanklikheid opgespoor.
       *[other] Sirkulêre afhanklikheid opgespoor wat 'n `<{ $componentType }>`-komponent behels.
    }

reference-no-referent = Geen verwysde gevind vir verwysing: `{ $reference }`

reference-multiple-referents = Meer as een verwysde gevind vir verwysing: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ongeldige formaat vir die attribuut { $attribute } van `<{ $componentType }>`.

children-invalid = Ongeldige kinders vir `<{ $componentType }>`: ongeldige kinders gevind: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ongeldige waarde `{ $value }` vir die attribuut `{ $attribute }`; die waarde `{ $default }` word gebruik

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML-weergawe { $version } is nie gevind nie.
       *[other] DoenetML-weergawe { $version } is nie gevind nie. Daar word na weergawe { $fallback } teruggeval
    }

## Reading the DoenetML

parse-invalid-doenetml = Ongeldige DoenetML: { $content }

parse-tag-missing-close-tag = Ongeldige DoenetML: Die etiket `{ $tag }` het geen sluitetiket nie. 'n Selfsluitende etiket of 'n `</{ $tagName }>`-etiket is verwag.

parse-tag-error = Ongeldige DoenetML: Fout in die etiket `<{ $tagName }>`

parse-attribute-missing-value = Ongeldige DoenetML: Die ongeldige attribuut `{ $attribute }` kort blykbaar 'n waarde.

parse-attribute-invalid = Ongeldige DoenetML: Ongeldige attribuut `{ $attribute }`

parse-attribute-value-invalid = Ongeldige DoenetML: Ongeldige attribuutwaarde `{ $value }`

parse-attribute-value-quote-mismatch = Ongeldige DoenetML: Ongeldige attribuutwaarde `{ $value }`. Die aanhalingstekens pas nie bymekaar nie. Dit lyk of 'n `{ $quote }` kort

parse-open-tag-name-missing = Ongeldige DoenetML: 'n Etiket sonder etiketnaam gevind, bv. `<`

parse-tag-not-closed = Ongeldige DoenetML: Die etiket `{ $tag }` is nie gesluit nie ('n `>` kort blykbaar).

parse-self-closing-tag-name-missing = Ongeldige DoenetML: 'n Etiket sonder etiketnaam gevind `<{ $content }>`

parse-self-closing-tag-not-closed = Ongeldige DoenetML: Die etiket `{ $tag }` is nie gesluit nie (`/>` kort blykbaar).

parse-tag-invalid-attributes = Ongeldige DoenetML: Die etiket `{ $tag }` is nie geldig nie. Dit het moontlik verkeerde attribute.

parse-close-tag-name-missing = Ongeldige DoenetML: 'n Sluitetiket sonder etiketnaam gevind, bv. `</`

parse-attribute-value-unquoted = Attribuutwaardes moet tussen aanhalingstekens staan: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Ongeldige DoenetML: Die sluitetiket `{ $tag }` is gevind, maar geen ooreenstemmende openingsetiket nie

parse-close-tag-mismatched = Ongeldige DoenetML: Die sluitetiket pas nie. `</{ $expected }>` is verwag. `{ $found }` is gevind

parser-node-unconvertible = Kon nie die nodus { $node } na 'n Dast-nodus omskakel nie.

## Names

name-attribute-invalid =
    Ongeldige attribuut name='{ $name }'. { $reason ->
        [characters] Name mag slegs letters, syfers, onderstrepe of koppeltekens bevat.
       *[start] Name moet met 'n letter begin.
    }

component-name-invalid-start = Ongeldige komponentnaam "{ $name }". Name moet met 'n letter begin.

## `<answer>` sugar

answer-video-watched-missing-video = 'n Antwoord van die tipe videoWatched moet 'n video-attribuut hê

answer-video-watched-video-not-reference = 'n Antwoord van die tipe videoWatched moet 'n video-attribuut hê wat 'n verwysing is

answer-name-not-single-text = Die name-attribuut van 'n antwoord moet 'n enkele text-kind hê

## Referencing another document

external-doenetml-recursion-limit = Kan nie eksterne DoenetML ophaal nie weens te veel vlakke van rekursie. Is daar 'n sirkulêre verwysing?

external-doenetml-unavailable = Kan nie DoenetML vanaf { $attribute }="{ $uri }" ophaal nie

external-doenetml-type-mismatch = Ongeldige DoenetML vanaf { $attribute }="{ $uri }" opgehaal: dit pas nie by die komponenttipe "{ $componentType }" nie

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Die attribuut `{ $from }` is verouderd; gebruik eerder `{ $to }`.
       *[other] [deprecation] Die attribuut `{ $from }` op `<{ $component }>` is verouderd; gebruik eerder `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Die attribuut `{ $from }` is verouderd en word geïgnoreer omdat `{ $to }` ook gespesifiseer is.
       *[other] [deprecation] Die attribuut `{ $from }` op `<{ $component }>` is verouderd en word geïgnoreer omdat `{ $to }` ook gespesifiseer is.
    }

deprecated-attribute-ignored = [deprecation] Die attribuut `{ $attribute }` op `<{ $component }>` is verouderd en word geïgnoreer.


## Language coverage

pluralize-english-only = `<pluralize>` kan slegs Engels in die meervoud stel, so die teks daarvan bly onveranderd in 'n dokument wat in { $locale } geskryf is. Skryf die meervoudsvorm direk, of stel dit met die `pluralForm`-attribuut.


## Checking against the schema

schema-element-unrecognized = Die element `<{ $tag }>` is nie 'n herkende Doenet-element nie.

schema-element-not-allowed-at-root = Die element `<{ $tag }>` word nie by die wortel van die dokument toegelaat nie.

schema-element-not-allowed-inside = Die element `<{ $tag }>` word nie binne `<{ $parent }>` toegelaat nie.

schema-attribute-unrecognized = Die element `<{ $tag }>` het geen attribuut met die naam `{ $attribute }` nie.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Die attribuut `{ $attribute }` van die element `<{ $tag }>` moet 'n lys wees waarvan elke item een van die volgende is: { $allowed }
       *[other] Die attribuut `{ $attribute }` van die element `<{ $tag }>` moet een van die volgende wees: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Ongeldige variantnaam vir select. Die variantnaam { $variantName } kom in { $numOptions } opsies voor, maar die getal om te kies is { $numToSelect }.

select-variant-name-without-options = Sommige variante is vir select gespesifiseer, maar geen opsies is vir die moontlike variantnaam { $variantName } gespesifiseer nie.

select-variant-name-not-possible = Die variantnaam { $variantName } wat vir select gespesifiseer is, is nie 'n moontlike variantnaam nie.

select-too-few-options = Kan nie { $numToSelect } komponente uit slegs { $numOptions } kies nie.

select-from-sequence-too-few-values = Kan nie { $numToSelect } waardes uit 'n ry van lengte { $length } kies nie.

select-from-sequence-indices-count-mismatch = Die aantal indekse wat vir select gespesifiseer is, moet by die getal om te kies pas

select-from-sequence-indices-not-integers = Alle indekse wat vir select gespesifiseer is, moet heelgetalle wees

select-from-sequence-index-excluded = 'n Indeks van selectfromsequence is gespesifiseer wat uitgesluit is

select-from-sequence-indices-excluded-combination = Indekse van selectfromsequence is gespesifiseer wat 'n uitgeslote kombinasie was

select-from-sequence-coprime-not-positive-integers = Kan nie ko-priemkombinasies kies nie omdat daar nie positiewe heelgetalle gekies word nie.

select-from-sequence-coprime-common-factor = Kan nie ko-priemgetalle kies nie. Al die moontlike waardes deel 'n gemene faktor. (Die gespesifiseerde waardes van "from" of "to" moet ko-priem met "step" wees.)

select-from-sequence-coprime-single-number = Kan nie ko-priemkombinasies uit 'n enkele getal kies wat nie 1 is nie.

select-from-sequence-excluded-too-many-combinations = Meer as 70% van die kombinasies is in selectFromSequence uitgesluit

select-from-sequence-coprime-none-found = Kon nie ko-priemgetalle kies nie. Al die moontlike waardes deel 'n gemene faktor.

select-from-sequence-too-few-unique-values = Kan nie { $numToSelect } unieke waardes uit 'n ry van lengte { $numPossibleValues } kies nie

select-prime-numbers-too-few-values = Kan nie { $numToSelect } waardes uit 'n lys priemgetalle van lengte { $numValues } kies nie

select-prime-numbers-values-count-mismatch = Die aantal waardes wat vir select gespesifiseer is, moet by die getal om te kies pas

select-prime-numbers-values-not-prime = Alle waardes wat vir select prime number gespesifiseer is, moet in die lys priemgetalle wees

select-prime-numbers-values-excluded-combination = Die gespesifiseerde waardes van selectPrimeNumbers was 'n uitgeslote kombinasie

select-prime-numbers-excluded-too-many-combinations = Meer as 70% van die kombinasies is in selectPrimeNumbers uitgesluit

select-random-combination-fluke = Deur 'n uiters onwaarskynlike toeval kon geen kombinasie van ewekansige waardes gekies word nie

select-random-value-fluke = Deur 'n uiters onwaarskynlike toeval kon geen ewekansige waarde gekies word nie
