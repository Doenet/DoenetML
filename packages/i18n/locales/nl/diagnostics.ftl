# Dutch diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
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

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } wordt genegeerd wanneer twee eindpunten zijn opgegeven
       *[other] { $attributes } worden genegeerd wanneer twee eindpunten zijn opgegeven
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } wordt genegeerd wanneer zowel een eindpunt als een middelpunt zijn opgegeven
       *[other] { $attributes } worden genegeerd wanneer zowel een eindpunt als een middelpunt zijn opgegeven
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset heeft geen effect zonder een middelpunt

## `<line>`

line-points-undetermined-dimensions = Lijn door punten met onbepaalde dimensies.

line-points-too-few-dimensions = Een lijn moet door punten van ten minste twee dimensies gaan.

line-points-depend-on-variables = De lijn gaat door punten die van variabelen afhangen: { $variables }.

line-equation-invalid-format = Ongeldig formaat voor de vergelijking van een lijn in de variabelen { $variable1 } en { $variable2 }.

## `<ray>`

ray-overprescribed-through = De halfrechte wordt bepaald door through, endpoint en direction. De opgegeven through wordt genegeerd.

ray-dimension-mismatch = numDimensions komt niet overeen in de halfrechte.

## `<vector>`

vector-overprescribed-head = De vector wordt bepaald door head, tail en displacement. De opgegeven head wordt genegeerd.

vector-dimension-mismatch = numDimensions komt niet overeen in de vector.

## Attracting and constraining

attract-to-without-nearest-point = Aantrekken naar een `<{ $component }>` kan niet, omdat het geen toestandsvariabele nearestPoint heeft.

constrain-to-without-nearest-point = Beperken tot een `<{ $component }>` kan niet, omdat het geen toestandsvariabele nearestPoint heeft.

constrain-to-interior-without-nearest-point = Beperken tot het inwendige van een `<{ $component }>` kan niet, omdat het geen toestandsvariabele nearestPoint heeft.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition wordt genegeerd bij een niet-inline choiceInput

## Ordering children by index

choice-input-indices-count-mismatch = De voor choiceInput opgegeven indices worden genegeerd, omdat hun aantal niet overeenkomt met het aantal choice-kinderen.

pretzel-indices-count-mismatch = De voor problem opgegeven indices worden genegeerd, omdat hun aantal niet overeenkomt met het aantal problem-kinderen.

shuffle-indices-count-mismatch = De voor shuffle opgegeven indices worden genegeerd, omdat hun aantal niet overeenkomt met het aantal componenten.

indices-ignored-out-of-range = De voor { $component } opgegeven indices worden genegeerd, omdat sommige buiten het bereik vallen.

pretzel-indices-repeated = De voor pretzel opgegeven indices worden genegeerd, omdat sommige herhaald zijn.

pretzel-circuit-first-index = De voor pretzel in circuit-modus opgegeven indices worden genegeerd, omdat de eerste index 1 moet zijn.

## `<shuffle>` and `<sort>`

string-children-need-type = Om `<{ $component }>` met tekstkinderen te laten werken, moet een `type`-attribuut worden opgegeven.

invalid-type-defaulting-to-math = Ongeldig type { $type } voor de component { $component }. Het moet math, text, number of boolean zijn. math wordt gebruikt.

string-not-valid-component-to-arrange = De tekst "{ $value }" is geen geldige component voor { $component }. Deze wordt genegeerd.

## Types and variables

invalid-type-defaulting-to-number = Ongeldig type { $type }; het type wordt op number gezet.

invalid-variable-value = Ongeldige waarde van een variabele: `{ $value }`

## Variants

variant-index-must-be-number = De variantindex { $index } moet een getal zijn

variant-index-must-be-integer = De variantindex { $index } moet een geheel getal zijn

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` is niet geïmplementeerd voor absolute maten. De breedtes worden relatief gemaakt.

side-by-side-absolute-margins = `<{ $component }>` is niet geïmplementeerd voor absolute maten. De marges worden relatief gemaakt.

side-by-side-no-block-child = Ongeldige `<{ $component }>`: er moet minstens één blokkind zijn.

## `<label>`

label-for-ignored-on-graphical = Het attribuut `for` op een grafisch `<label>` wordt genegeerd.

label-for-must-resolve-to-one = Het attribuut `for` op `<label>` moet naar precies één component verwijzen.

label-for-unresolved = Het attribuut `for` op `<label>` kon niet naar een component worden herleid.

label-for-answer-with-authored-inputs = Het attribuut `for` op `<label>` verwijst naar een `<answer>` met expliciet geschreven invoervelden; verwijs rechtstreeks naar het invoerveld.

label-for-answer-without-input = Het attribuut `for` op `<label>` verwijst naar een `<answer>` zonder invoerveld om te labelen.

label-for-must-reference-input-or-answer = Het attribuut `for` op `<label>` moet naar een invoerveld of een antwoord verwijzen.

## Accessibility

accessibility-short-description-or-decorative = Voor toegankelijkheid moet `<{ $component }>` een korte beschrijving hebben of als decoratief zijn aangeduid.

accessibility-video-short-description = Voor toegankelijkheid moet `<video>` een korte beschrijving hebben.

accessibility-input-short-description-or-label = Voor toegankelijkheid moet `<{ $component }>` een korte beschrijving of een label hebben.

accessibility-answer-input-short-description-or-label = Voor toegankelijkheid moet een `<answer>` dat een invoerveld maakt een korte beschrijving of een label hebben.

accessibility-short-description-contains-math = Korte beschrijvingen horen geen wiskundecomponenten zoals `<{ $component }>` te bevatten. Schrijf wiskunde voluit in woorden.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } heeft onvoldoende contrast voor de tekst van de sectiekop (donkere modus) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; minstens { $threshold }:1 vereist).
       *[other] { $colorName } heeft onvoldoende contrast voor de tekst van de sectiekop ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; minstens { $threshold }:1 vereist).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` door { $count } punten is niet geïmplementeerd wanneer de punten geen numerieke waarden hebben.

circle-too-many-through-points = Een cirkel door meer dan 3 punten kan niet worden berekend.

circle-overprescribed-radius-center-points = Een cirkel met opgegeven straal, middelpunt en doorgangspunten kan niet worden berekend.

circle-center-with-multiple-points = Een cirkel met opgegeven middelpunt door meer dan 1 punt kan niet worden berekend.

circle-radius-too-small = De cirkel kan niet worden berekend: aangezien de afstand tussen de twee punten { $distance } is, is de opgegeven straal { $radius } te klein.

circle-radius-with-many-points = Een cirkel door meer dan twee punten met een opgegeven straal kan niet worden gemaakt.

circle-invalid-center-or-through-points = Ongeldig middelpunt of ongeldige doorgangspunten van de cirkel.

circle-radius-center-with-multiple-points = De straal van een cirkel met opgegeven middelpunt door meer dan 1 punt kan niet worden berekend.

circle-change-radius-non-numerical = De straal van een cirkel met niet-numerieke doorgangspunten kan niet worden gewijzigd

circle-radius-with-points-non-numerical = Een cirkel door meer dan één punt met opgegeven straal kan zonder numerieke waarden niet worden gemaakt.

circle-change-center-non-numerical = Het wijzigen van het middelpunt van een cirkel door niet-numerieke punten is niet geïmplementeerd.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Onvoldoende dimensies voor het domein van de functie. Het domein heeft { $intervals } interval maar de functie heeft { $inputs ->
            [one] { $inputs } invoer
           *[other] { $inputs } invoeren
        }.
       *[other] Onvoldoende dimensies voor het domein van de functie. Het domein heeft { $intervals } intervallen maar de functie heeft { $inputs ->
            [one] { $inputs } invoer
           *[other] { $inputs } invoeren
        }.
    }

function-domain-invalid-format = Ongeldig formaat voor het domein van de functie.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Het niet-numerieke maximum van de functie wordt genegeerd.
        [minimum] Het niet-numerieke minimum van de functie wordt genegeerd.
        [extremum] Het niet-numerieke extremum van de functie wordt genegeerd.
        [point] Het niet-numerieke punt van de functie wordt genegeerd.
        [slope] De niet-numerieke helling van de functie wordt genegeerd.
       *[other] Niet-numerieke { $type } van de functie wordt genegeerd.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Het lege maximum van de functie wordt genegeerd.
        [minimum] Het lege minimum van de functie wordt genegeerd.
        [extremum] Het lege extremum van de functie wordt genegeerd.
        [point] Het lege punt van de functie wordt genegeerd.
       *[other] Lege { $type } van de functie wordt genegeerd.
    }

function-points-too-close = De functie bevat twee punten die te dicht bij elkaar liggen. De functie kan niet worden gedefinieerd.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Functie-iteraties zijn alleen mogelijk als het aantal invoeren gelijk is aan het aantal uitvoeren. Deze functie heeft { $inputs } invoer en { $outputs ->
            [one] { $outputs } uitvoer
           *[other] { $outputs } uitvoeren
        }.
       *[other] Functie-iteraties zijn alleen mogelijk als het aantal invoeren gelijk is aan het aantal uitvoeren. Deze functie heeft { $inputs } invoeren en { $outputs ->
            [one] { $outputs } uitvoer
           *[other] { $outputs } uitvoeren
        }.
    }

## `<sequence>`

sequence-invalid-length = Ongeldige lengte van de rij. Deze moet een niet-negatief geheel getal zijn.

sequence-invalid-step = Ongeldige stap van de rij. Deze moet een getal zijn voor een rij van type { $type }.

sequence-invalid-endpoint-number = Ongeldige "{ $attribute }" van een getallenrij. Deze moet een getal zijn.

sequence-invalid-endpoint-letters = Ongeldige "{ $attribute }" van een letterrij. Deze moet een lettercombinatie zijn.

sequence-invalid-endpoint = Ongeldige "{ $attribute }" van de rij.

select-from-sequence-coprime-not-numbers = coprime wordt genegeerd, omdat er geen getallen worden geselecteerd

select-from-sequence-coprime-with-exclude-combinations = coprime wordt genegeerd, omdat excludeCombinations is opgegeven

## Resolving a `target`

target-not-found = Ongeldige target voor `<{ $source }>`: doel niet gevonden.

target-state-variable-not-found = Ongeldige target voor `<{ $source }>`: geen toestandsvariabele met de naam "{ $property }" op een `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = De variabelen van een `<odeSystem>` moeten verschillen van de onafhankelijke variabele.

ode-system-duplicate-variable-names = De rechterleden van de ODE kunnen niet worden gedefinieerd met dubbele namen van afhankelijke variabelen.

ode-system-rhs-function-error = Het rechterlid van de ODE kan niet worden gedefinieerd. Fout bij het maken van de mathjs-functie.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Een hoek tussen { $count } lijnen kan niet worden gedefinieerd

angle-invalid-through-point = Ongeldig punt in de through van een `<angle>`

parabola-vertex-too-many-points = Een parabool met gegeven top door meer dan 1 punt is niet geïmplementeerd.

parabola-too-many-points = Een parabool door meer dan 3 punten is niet geïmplementeerd.

intersection-too-many-items = De doorsnede van meer dan twee objecten is niet geïmplementeerd

## Other math components

ionic-compound-not-two-ions = Ionverbindingen met iets anders dan twee ionen zijn niet geïmplementeerd.

ionic-compound-needs-cation-and-anion = Ionverbindingen zijn alleen geïmplementeerd voor één kation en één anion.

solve-equations-cannot-evaluate = De vergelijking kan niet worden opgelost, omdat zij niet kon worden geëvalueerd: { $equation }

math-operators-operand-number-required = Om een wiskundige operand te extraheren moet een operandNumber worden opgegeven.

eigen-decomposition-failed = De eigenwaarden van de matrix konden niet worden berekend

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: de parameter { $parameters } komt niet in het patroon voor en zal dus altijd op een lege plek passen.
       *[other] `<matchesPattern>`: de parameters { $parameters } komen niet in het patroon voor en zullen dus altijd op een lege plek passen.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" kan niet worden geïnterpreteerd. De waarde moet none, medium, dense of twee positieve getallen gescheiden door een spatie zijn, zoals grid="1 0.5". Er wordt geen raster getekend.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" wordt niet ondersteund door de prefigure-renderer; het gedrag van de rechterpositie wordt gebruikt.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" wordt niet ondersteund door de prefigure-renderer; het gedrag van de bovenpositie wordt gebruikt.

prefigure-invalid-axis-bounds = `<graph>`: ongeldige asgrenzen voor de prefigure-conversie; de standaard-bbox (-10,-10,10,10) wordt gebruikt.

prefigure-invalid-width = `<graph>`: ongeldige breedte voor de prefigure-conversie; de standaardbreedte 425 wordt gebruikt.

prefigure-invalid-aspect-ratio = `<graph>`: ongeldige aspectRatio voor de prefigure-conversie; de standaardverhouding 1 wordt gebruikt.

prefigure-grid-spacing-too-fine = `<graph>`: de rasterafstand is te fijn voor de asgrenzen; het raster wordt in de prefigure-renderer weggelaten.

prefigure-annotations-not-rendered = `<graph>`: annotaties worden buiten de PreFigure-renderer niet weergegeven.

multiple-annotations-children = Meerdere `<annotations>`-kinderen gevonden in `<graph>`; alle op de laatste na worden genegeerd.

## Referring to other components

copy-unrecognized-component-type = Een onbekend componenttype kan niet worden uitgebreid of gekopieerd: { $type }.

copy-prop-not-found = Eigenschap { $property } niet gevonden op een component van type { $component }

collect-no-source = Geen bron gevonden voor collect.

collect-invalid-component-type = Componenten van type `<{ $component }>` kunnen niet worden verzameld, omdat dit geen geldig componenttype is.

reference-index-unavailable = Naar de index `{ $reference }` kan niet worden verwezen

## `<callAction>`

component-action-unavailable = { $action } kan niet worden aangeroepen op de component `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = De gegevens hebben een ongeldige vorm. De rijen hebben ongelijke lengtes. Gevonden in componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = De gegevens hebben dubbele kolomnamen. Gevonden in componentIdx :{ $componentIdx }

data-frame-missing-column-name = De gegevens missen een kolomnaam. Gevonden in componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Een award van dit antwoord baseert zich op het ingediende antwoord van de answer-tag zelf, wat tot onverwacht gedrag leidt.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` instellen op een `<answer>` binnen een container met `sectionWideCheckWork` heeft geen effect: het aantal pogingen wordt door de container bepaald. Stel `maxNumAttempts` in op de container.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` instellen op een container met `sectionWideCheckWork` die zelf in een andere container met `sectionWideCheckWork` zit heeft geen effect: het aantal pogingen wordt door de buitenste container bepaald. Stel `maxNumAttempts` in op de buitenste container.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Het attribuut { $attributes } heeft geen effect zonder symbolicEquality.
       *[other] De attributen { $attributes } hebben geen effect zonder symbolicEquality.
    }

answer-invalid-type = Ongeldig type voor answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Omdat de component `<{ $component }>` geen naam heeft, kan zij niet als moduleattribuut worden gebruikt

module-attribute-name-already-defined = De component `<{ $component } name="{ $name }">` kan niet als attribuut van een module worden gebruikt, omdat het componenttype `<module>` al een attribuut "{ $name }" definieert.

conditional-content-condition-ignored = Het attribuut `condition` wordt genegeerd op een `<conditionalContent>`-component met case- of else-kinderen.

slider-markers-type-mismatch = Het type van de markeringen komt niet overeen met het type van de schuifregelaar.

pretzel-problem-needs-statement-and-answer = Ongeldige pretzel: elke `<problem>` moet één `<statement>` en één `<answer>` bevatten.

pretzel-circuit-first-problem-distractor = Ongeldige pretzel: in mode="circuit" mag de eerste `<problem>` geen afleider zijn.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Ongeldige waarde { $values } voor het attribuut `{ $attribute }`; deze wordt genegeerd.
       *[other] Ongeldige waarden { $values } voor het attribuut `{ $attribute }`; deze worden genegeerd.
    }

attribute-must-be-references = Ongeldige waarde `{ $value }` voor het attribuut `{ $attribute }`. Het attribuut moet bestaan uit verwijzingen die met `$` beginnen.

math-input-invalid-function-names = <mathInput>: ongeldige functienaam/-namen genegeerd in { $attribute }: { $names }. Het weergegeven deel van elke naam moet minstens 2 tekens lang zijn (letters of streepjes); een optioneel achtervoegsel `|<mathspeak-alternatief>` mag volgen.

## Building components from the source

component-type-invalid = Ongeldig componenttype: `<{ $componentType }>`

attribute-repeated = Het attribuut { $attribute } mag niet worden herhaald.

attribute-invalid-for-component = Ongeldig attribuut "{ $attribute }" voor een component van type `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Stijldefinitie { $styleNumber } heeft onvoldoende contrast voor { $context ->
        [text-on-background] de tekstkleur tegen de achtergrondkleur
        [high-contrast] de hoogcontrastkleur tegen het canvas
        [line] de lijnkleur tegen het canvas
        [marker] de markeringskleur tegen het canvas
       *[text-on-canvas] de tekstkleur tegen het canvas
    }{ $mode ->
        [dark] { " (donkere modus)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; minstens { $threshold }:1 vereist).

style-definition-dark-mode-text-background-contrast =
    Hoewel stijldefinitie { $styleNumber } kleuren opgeeft met voldoende contrast in de lichte modus, hebben de daaruit afgeleide kleuren voor de donkere modus onvoldoende contrast tussen tekst en achtergrond ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; minstens { $threshold }:1 vereist). { $suggestion ->
        [available] Verhoog voor voldoende contrast in de donkere modus ofwel het contrast in de lichte modus (bijvoorbeeld { $lightAttribute }="{ $lightColor }"), ofwel overschrijf de kleur voor de donkere modus (bijvoorbeeld { $darkAttribute }="{ $darkColor }").
       *[none] Verhoog voor voldoende contrast in de donkere modus het contrast in de lichte modus, of overschrijf de afgeleide kleuren met textColorDarkMode en/of backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Hoewel stijldefinitie { $styleNumber } een tekstkleur opgeeft met voldoende contrast in de lichte modus, heeft de daaruit afgeleide tekstkleur voor de donkere modus onvoldoende contrast tegen het canvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; minstens { $threshold }:1 vereist). { $suggestion ->
        [available] Verhoog voor voldoende contrast in de donkere modus ofwel het contrast in de lichte modus (bijvoorbeeld textColor="{ $lightColor }"), ofwel overschrijf de kleur voor de donkere modus (bijvoorbeeld textColorDarkMode="{ $darkColor }").
       *[none] Verhoog voor voldoende contrast in de donkere modus het contrast in de lichte modus, of overschrijf de afgeleide kleur met textColorDarkMode.
    }

section-multiple-style-palettes = Een sectie kan slechts één <stylePalette> kiezen; de laatste wordt gebruikt.

## Unique variants

variant-num-to-select-not-non-negative-integer = de unieke varianten van { $component } kunnen niet worden bepaald, omdat numToSelect geen niet-negatief geheel getal is.

variant-num-to-select-not-constant-number = de unieke varianten van { $component } kunnen niet worden bepaald, omdat numToSelect geen constant getal is.

variant-with-replacement-not-constant-boolean = de unieke varianten van { $component } kunnen niet worden bepaald, omdat withReplacement geen constante booleaanse waarde is.

variant-select-weight-disables-unique = Unieke varianten voor select zijn uitgeschakeld als een optie selectWeight of selectForVariants opgeeft

variant-coprime-undetermined = de unieke varianten van { $component } kunnen niet worden bepaald, omdat niet is vast te stellen dat coprime altijd onwaar is.

variant-attribute-not-constant = de unieke varianten van { $component } kunnen niet worden bepaald, omdat { $attribute } geen constante is.

variant-attribute-not-number = de unieke varianten van { $component } kunnen niet worden bepaald, omdat { $attribute } geen getal is.

variant-attribute-wrong-type-for-sequence =
    de unieke varianten van { $component } van type { $type } kunnen niet worden bepaald, omdat { $attribute } geen { $expected ->
        [letters-combination] lettercombinatie
        [math-expression] geldige wiskundige uitdrukking
        [integer] geheel getal
       *[number] getal
    } is.

variant-length-not-integer = de unieke varianten van { $component } kunnen niet worden bepaald, omdat length geen geheel getal is.

variant-sort-not-implemented = unieke varianten van een { $component } met sort zijn niet geïmplementeerd

variant-exclude-combinations-not-implemented = unieke varianten van een { $component } met excludeCombinations zijn niet geïmplementeerd

variant-math-exclude-not-implemented = unieke varianten van een { $component } van type math met exclude zijn niet geïmplementeerd

variant-non-constant-exclude-not-implemented = unieke varianten van een { $component } met een niet-constante exclude zijn niet geïmplementeerd

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: niet ondersteund in de prefigure-renderer van de grafiek; nakomeling overgeslagen.

prefigure-descendant-invalid-geometry = { $subject }: niet-eindige of onvolledige geometrie; nakomeling overgeslagen.

prefigure-curve-label-omitted = { $subject }: labels worden niet ondersteund op omgezette krommelementen; label weggelaten.

prefigure-curve-unsupported-definition-type = { $subject }: niet-ondersteund definitietype '{ $definitionType }' voor de kromme; nakomeling overgeslagen.

prefigure-region-flip-functions-unsupported = { $subject }: het attribuut flipFunctions op regionBetweenCurves wordt niet ondersteund; nakomeling overgeslagen.

prefigure-region-non-formula-child = { $subject }: op regionBetweenCurves worden alleen kindfuncties van het type formule ondersteund; nakomeling overgeslagen.

prefigure-label-position-unsupported =
    { $subject }: niet-ondersteunde labelPosition '{ $labelPosition }' voor { $labelKind ->
        [line-family] een label uit de lijnfamilie
       *[point] een puntlabel
    }; de standaarduitlijning van PreFigure wordt gebruikt.

prefigure-fill-style-unsupported = { $subject }: de vulstijl '{ $fillStyle }' wordt niet ondersteund door PreFigure; er wordt teruggevallen op een effen vulling.

prefigure-line-style-unknown = { $subject }: onbekende lijnstijl '{ $lineStyle }' weggelaten uit de PreFigure-uitvoer.

prefigure-marker-style-mapped-to-diamond = { $subject }: de markeringsstijl '{ $markerStyle }' wordt omgezet naar de PreFigure-stijl 'diamond'.

prefigure-marker-style-unsupported = { $subject }: de markeringsstijl '{ $markerStyle }' wordt niet ondersteund door PreFigure; de standaardstijl wordt gebruikt.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ongeldige `ref`; doel kan niet worden herleid. Annotatie weggelaten.

annotation-ref-multiple-targets = `<annotation>`: `ref` verwees naar meerdere doelen; het eerste wordt gebruikt.

annotation-ref-outside-graph = `<annotation>`: ongeldige `ref`; het doel ligt buiten de omvattende grafiek. Annotatie weggelaten.

annotation-ref-unsupported-target = `<annotation>`: ongeldige `ref`; het doel is geen ondersteund grafisch object in de prefigure-conversie. Annotatie weggelaten.

annotation-text-missing = `<annotation>`: `text` ontbreekt of is leeg; er wordt lege tekst uitgevoerd.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Circulaire afhankelijkheid gedetecteerd.
       *[other] Circulaire afhankelijkheid gedetecteerd waarbij een `<{ $componentType }>`-component betrokken is.
    }

reference-no-referent = Geen doel gevonden voor de verwijzing: `{ $reference }`

reference-multiple-referents = Meerdere doelen gevonden voor de verwijzing: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ongeldig formaat voor het attribuut { $attribute } van `<{ $componentType }>`.

children-invalid = Ongeldige kinderen voor `<{ $componentType }>`: ongeldige kinderen gevonden: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ongeldige waarde `{ $value }` voor het attribuut `{ $attribute }`; de waarde `{ $default }` wordt gebruikt

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML-versie { $version } niet gevonden.
       *[other] DoenetML-versie { $version } niet gevonden. Er wordt teruggevallen op versie { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Ongeldige DoenetML: { $content }

parse-tag-missing-close-tag = Ongeldige DoenetML: de tag `{ $tag }` heeft geen sluittag. Er werd een zelfsluitende tag of een `</{ $tagName }>`-tag verwacht.

parse-tag-error = Ongeldige DoenetML: fout in de tag `<{ $tagName }>`

parse-attribute-missing-value = Ongeldige DoenetML: aan het attribuut `{ $attribute }` lijkt een waarde te ontbreken.

parse-attribute-invalid = Ongeldige DoenetML: ongeldig attribuut `{ $attribute }`

parse-attribute-value-invalid = Ongeldige DoenetML: ongeldige attribuutwaarde `{ $value }`

parse-attribute-value-quote-mismatch = Ongeldige DoenetML: ongeldige attribuutwaarde `{ $value }`. De aanhalingstekens komen niet overeen. Er lijkt een `{ $quote }` te ontbreken

parse-open-tag-name-missing = Ongeldige DoenetML: tag zonder tagnaam gevonden, bijvoorbeeld `<`

parse-tag-not-closed = Ongeldige DoenetML: de tag `{ $tag }` is niet gesloten (er lijkt een `>` te ontbreken).

parse-self-closing-tag-name-missing = Ongeldige DoenetML: tag zonder tagnaam gevonden `<{ $content }>`

parse-self-closing-tag-not-closed = Ongeldige DoenetML: de tag `{ $tag }` is niet gesloten (`/>` lijkt te ontbreken).

parse-tag-invalid-attributes = Ongeldige DoenetML: de tag `{ $tag }` is niet geldig. Mogelijk heeft hij onjuiste attributen.

parse-close-tag-name-missing = Ongeldige DoenetML: sluittag zonder tagnaam gevonden, bijvoorbeeld `</`

parse-attribute-value-unquoted = Attribuutwaarden moeten tussen aanhalingstekens staan: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Ongeldige DoenetML: sluittag `{ $tag }` gevonden, maar geen bijbehorende openingstag

parse-close-tag-mismatched = Ongeldige DoenetML: niet-overeenkomende sluittag. Verwacht `</{ $expected }>`. Gevonden `{ $found }`

parser-node-unconvertible = Knooppunt { $node } kon niet naar een Dast-knooppunt worden omgezet.

## Names

name-attribute-invalid =
    Ongeldig attribuut name='{ $name }'. { $reason ->
        [characters] Namen mogen alleen letters, cijfers, lage streepjes of koppeltekens bevatten.
       *[start] Namen moeten met een letter beginnen.
    }

component-name-invalid-start = Ongeldige componentnaam "{ $name }". Namen moeten met een letter beginnen.

## `<answer>` sugar

answer-video-watched-missing-video = Een answer van type videoWatched moet een video-attribuut hebben

answer-video-watched-video-not-reference = Een answer van type videoWatched moet een video-attribuut hebben dat een verwijzing is

answer-name-not-single-text = Het name-attribuut van een answer moet precies één tekstkind hebben

## Referencing another document

external-doenetml-recursion-limit = Externe DoenetML kon niet worden opgehaald wegens te veel niveaus van recursie. Is er een circulaire verwijzing?

external-doenetml-unavailable = DoenetML kon niet worden opgehaald van { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Ongeldige DoenetML opgehaald van { $attribute }="{ $uri }": deze kwam niet overeen met het componenttype "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Het attribuut `{ $from }` is verouderd; gebruik in plaats daarvan `{ $to }`.
       *[other] [deprecation] Het attribuut `{ $from }` op `<{ $component }>` is verouderd; gebruik in plaats daarvan `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Het attribuut `{ $from }` is verouderd en wordt genegeerd, omdat `{ $to }` ook is opgegeven.
       *[other] [deprecation] Het attribuut `{ $from }` op `<{ $component }>` is verouderd en wordt genegeerd, omdat `{ $to }` ook is opgegeven.
    }

deprecated-attribute-ignored = [deprecation] Het attribuut `{ $attribute }` op `<{ $component }>` is verouderd en wordt genegeerd.


## Language coverage

pluralize-english-only = `<pluralize>` kan alleen Engels in het meervoud zetten, dus in een document in het { $locale } blijft de tekst ongewijzigd. Schrijf de meervoudsvorm rechtstreeks, of geef die op met het attribuut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Het element `<{ $tag }>` is geen bekend Doenet-element.

schema-element-not-allowed-at-root = Het element `<{ $tag }>` is niet toegestaan in de wortel van het document.

schema-element-not-allowed-inside = Het element `<{ $tag }>` is niet toegestaan binnen `<{ $parent }>`.

schema-attribute-unrecognized = Het element `<{ $tag }>` heeft geen attribuut met de naam `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Het attribuut `{ $attribute }` van het element `<{ $tag }>` moet een lijst zijn waarvan elk item een van de volgende is: { $allowed }
       *[other] Het attribuut `{ $attribute }` van het element `<{ $tag }>` moet een van de volgende zijn: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Ongeldige variantnaam voor select. De variantnaam { $variantName } komt voor in { $numOptions } opties, maar het aantal te selecteren is { $numToSelect }.

select-variant-name-without-options = Er zijn varianten opgegeven voor select, maar geen opties voor de mogelijke variantnaam: { $variantName }.

select-variant-name-not-possible = De voor select opgegeven variantnaam { $variantName } is geen mogelijke variantnaam.

select-too-few-options = { $numToSelect } componenten kunnen niet uit slechts { $numOptions } worden geselecteerd.

select-from-sequence-too-few-values = { $numToSelect } waarden kunnen niet uit een rij van lengte { $length } worden geselecteerd.

select-from-sequence-indices-count-mismatch = Het aantal voor select opgegeven indices moet overeenkomen met het aantal te selecteren

select-from-sequence-indices-not-integers = Alle voor select opgegeven indices moeten gehele getallen zijn

select-from-sequence-index-excluded = Een opgegeven index van selectfromsequence was uitgesloten

select-from-sequence-indices-excluded-combination = De opgegeven indices van selectfromsequence vormden een uitgesloten combinatie

select-from-sequence-coprime-not-positive-integers = Onderling ondeelbare combinaties kunnen niet worden geselecteerd, omdat er geen positieve gehele getallen worden geselecteerd.

select-from-sequence-coprime-common-factor = Onderling ondeelbare getallen kunnen niet worden geselecteerd. Alle mogelijke waarden hebben een gemeenschappelijke factor. (De opgegeven waarden van "from" of "to" moeten onderling ondeelbaar zijn met "step".)

select-from-sequence-coprime-single-number = Onderling ondeelbare combinaties kunnen niet worden geselecteerd uit één enkel getal dat niet 1 is.

select-from-sequence-excluded-too-many-combinations = Meer dan 70% van de combinaties is uitgesloten in selectFromSequence

select-from-sequence-coprime-none-found = Onderling ondeelbare getallen konden niet worden geselecteerd. Alle mogelijke waarden hebben een gemeenschappelijke factor.

select-from-sequence-too-few-unique-values = { $numToSelect } unieke waarden kunnen niet uit een rij van lengte { $numPossibleValues } worden geselecteerd

select-prime-numbers-too-few-values = { $numToSelect } waarden kunnen niet uit een lijst van { $numValues } priemgetallen worden geselecteerd

select-prime-numbers-values-count-mismatch = Het aantal voor select opgegeven waarden moet overeenkomen met het aantal te selecteren

select-prime-numbers-values-not-prime = Alle voor select prime number opgegeven waarden moeten in de lijst met priemgetallen staan

select-prime-numbers-values-excluded-combination = De opgegeven waarden van selectPrimeNumbers vormden een uitgesloten combinatie

select-prime-numbers-excluded-too-many-combinations = Meer dan 70% van de combinaties is uitgesloten in selectPrimeNumbers

select-random-combination-fluke = Door een uiterst onwaarschijnlijk toeval kon geen combinatie van willekeurige waarden worden geselecteerd

select-random-value-fluke = Door een uiterst onwaarschijnlijk toeval kon geen willekeurige waarde worden geselecteerd
