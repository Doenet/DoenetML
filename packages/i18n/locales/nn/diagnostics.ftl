# Norwegian Nynorsk diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Nynorsk is a written standard of its own**, not a spelling of Bokmål;
# `chrome.ftl` carries the whole note and the list of words that must not be
# "corrected" toward `locales/nb`.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber` — are part of the language, not prose,
# and stay in English exactly as written. So does anything quoted back from the
# author's own source, and so do `WCAG AA`, `DoenetML`, `PreFigure` and
# `prefigure`, which are names.
#
# **Number.** CLDR has plural rules for `nn`, so a `one`/`other` branch is
# selected by Nynorsk's own rules and is written wherever the noun actually
# changes. Where the counted noun is a neuter with no plural ending —
# «forsøk», «svar», «utdata» — the select is dropped rather than written out
# twice identically. Every **symbolic** selector — `$type`, `$mode`,
# `$reason`, `$context`, `$suggestion`, `$alternative`, `$fallback`,
# `$expected`, `$labelKind`, `$isList`, `$componentType` — is kept byte for
# byte from English, keys included: a translated variant key is a branch
# nothing can reach.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } vert ignorert når to endepunkt er oppgjevne
       *[other] { $attributes } vert ignorerte når to endepunkt er oppgjevne
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } vert ignorert når både eit endepunkt og eit midtpunkt er oppgjevne
       *[other] { $attributes } vert ignorerte når både eit endepunkt og eit midtpunkt er oppgjevne
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset har ingen verknad utan eit midtpunkt

## `<line>`

line-points-undetermined-dimensions = Linje gjennom punkt med ubestemt dimensjon.

line-points-too-few-dimensions = Ei linje må gå gjennom punkt med minst to dimensjonar.

line-points-depend-on-variables = Linja går gjennom punkt som er avhengige av variablane: { $variables }.

line-equation-invalid-format = Ugyldig format på likninga til linja i variablane { $variable1 } og { $variable2 }.

## `<ray>`

ray-overprescribed-through = Halvlinja er bestemt av through, endpoint og direction.  Ignorerer through slik han er oppgjeven.

ray-dimension-mismatch = numDimensions stemmer ikkje i halvlinja.

## `<vector>`

vector-overprescribed-head = Vektoren er bestemt av head, tail og displacement.  Ignorerer head slik han er oppgjeven.

vector-dimension-mismatch = numDimensions stemmer ikkje i vektoren.

## Attracting and constraining

attract-to-without-nearest-point = Kan ikkje trekkje mot ein `<{ $component }>`, sidan han ikkje har tilstandsvariabelen nearestPoint.

constrain-to-without-nearest-point = Kan ikkje binde til ein `<{ $component }>`, sidan han ikkje har tilstandsvariabelen nearestPoint.

constrain-to-interior-without-nearest-point = Kan ikkje binde til det indre av ein `<{ $component }>`, sidan han ikkje har tilstandsvariabelen nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition vert ignorert for choiceInput som ikkje er inline

## Ordering children by index

choice-input-indices-count-mismatch = Ignorerer indeksane som er oppgjevne for choiceInput, sidan talet på indeksar ikkje stemmer med talet på choice-barn.

pretzel-indices-count-mismatch = Ignorerer indeksane som er oppgjevne for problem, sidan talet på indeksar ikkje stemmer med talet på problem-barn.

shuffle-indices-count-mismatch = Ignorerer indeksane som er oppgjevne for shuffle, sidan talet på indeksar ikkje stemmer med talet på komponentar.

indices-ignored-out-of-range = Ignorerer indeksane som er oppgjevne for { $component }, sidan nokre indeksar er utanfor området.

pretzel-indices-repeated = Ignorerer indeksane som er oppgjevne for pretzel, sidan nokre indeksar er gjentekne.

pretzel-circuit-first-index = Ignorerer indeksane som er oppgjevne for pretzel i circuit-modus, sidan den første indeksen må vere 1.

## `<shuffle>` and `<sort>`

string-children-need-type = For at `<{ $component }>` skal verke med strengbarn, må attributtet `type` vere oppgjeve.

invalid-type-defaulting-to-math = Ugyldig type { $type } for komponenten { $component }. Må vere ein av math, text, number eller boolean. Brukar math.

string-not-valid-component-to-arrange = Strengen "{ $value }" er ikkje ein gyldig komponent å { $component }. Ignorerer.

## Types and variables

invalid-type-defaulting-to-number = Ugyldig type { $type }, set type til number.

invalid-variable-value = Ugyldig verdi for ein variabel: `{ $value }`

## Variants

variant-index-must-be-number = Variantindeksen { $index } må vere eit tal

variant-index-must-be-integer = Variantindeksen { $index } må vere eit heiltal

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` er ikkje laga for absolutte mål. Set breiddene til relative.

side-by-side-absolute-margins = `<{ $component }>` er ikkje laga for absolutte mål. Set margane til relative.

side-by-side-no-block-child = Ugyldig `<{ $component }>`: han må ha minst eitt blokkbarn.

## `<label>`

label-for-ignored-on-graphical = Attributtet `for` på ein grafisk `<label>` vert ignorert.

label-for-must-resolve-to-one = Attributtet `for` på `<label>` må peike på nøyaktig éin komponent.

label-for-unresolved = Attributtet `for` på `<label>` kunne ikkje løysast opp til ein komponent.

label-for-answer-with-authored-inputs = Attributtet `for` på `<label>` viser til ein `<answer>` med eksplisitt skrivne inndatafelt; vis heller til feltet direkte.

label-for-answer-without-input = Attributtet `for` på `<label>` viser til ein `<answer>` utan eit inndatafelt å setje merkelapp på.

label-for-must-reference-input-or-answer = Attributtet `for` på `<label>` må vise til eit inndatafelt eller eit svar.

## Accessibility

accessibility-short-description-or-decorative = Av omsyn til tilgjenge må `<{ $component }>` anten ha ei kort skildring eller vere merkt som dekorativ.

accessibility-video-short-description = Av omsyn til tilgjenge må `<video>` ha ei kort skildring.

accessibility-input-short-description-or-label = Av omsyn til tilgjenge må `<{ $component }>` ha ei kort skildring eller ein merkelapp.

accessibility-answer-input-short-description-or-label = Av omsyn til tilgjenge må ein `<answer>` som lagar eit inndatafelt ha ei kort skildring eller ein merkelapp.

accessibility-short-description-contains-math = Korte skildringar bør ikkje innehalde matematikkomponentar som `<{ $component }>`. Skriv matematikken ut med ord.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } har for lite kontrast for overskriftsteksten i kapittelet (mørk modus) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; krev minst { $threshold }:1).
       *[other] { $colorName } har for lite kontrast for overskriftsteksten i kapittelet ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; krev minst { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` gjennom { $count } punkt er ikkje laga for tilfellet der punkta ikkje har numeriske verdiar.

circle-too-many-through-points = Kan ikkje rekne ut ein sirkel gjennom meir enn 3 punkt.

circle-overprescribed-radius-center-points = Kan ikkje rekne ut ein sirkel med oppgjeven radius, sentrum og gjennomgangspunkt.

circle-center-with-multiple-points = Kan ikkje rekne ut ein sirkel med oppgjeve sentrum gjennom meir enn 1 punkt.

circle-radius-too-small = Kan ikkje rekne ut sirkelen: når avstanden mellom dei to punkta er { $distance }, er den oppgjevne radien { $radius } for liten.

circle-radius-with-many-points = Kan ikkje lage ein sirkel gjennom meir enn to punkt med oppgjeven radius.

circle-invalid-center-or-through-points = Ugyldig sentrum eller ugyldige gjennomgangspunkt for sirkelen.

circle-radius-center-with-multiple-points = Kan ikkje rekne ut radien til ein sirkel med oppgjeve sentrum gjennom meir enn 1 punkt.

circle-change-radius-non-numerical = Kan ikkje endre radien til ein sirkel med gjennomgangspunkt som ikkje er numeriske

circle-radius-with-points-non-numerical = Kan ikkje lage ein sirkel gjennom meir enn eitt punkt med oppgjeven radius når verdiane ikkje er numeriske.

circle-change-center-non-numerical = Å endre sentrum i ein sirkel gjennom punkt utan numeriske verdiar er ikkje laga enno.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] For få dimensjonar i definisjonsmengda til funksjonen. Definisjonsmengda har { $intervals } intervall, men funksjonen har { $inputs } inndata.
       *[other] For få dimensjonar i definisjonsmengda til funksjonen. Definisjonsmengda har { $intervals } intervall, men funksjonen har { $inputs } inndata.
    }

function-domain-invalid-format = Ugyldig format på definisjonsmengda til funksjonen.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ignorerer eit maksimum til funksjonen som ikkje er numerisk.
        [minimum] Ignorerer eit minimum til funksjonen som ikkje er numerisk.
        [extremum] Ignorerer eit ekstremalpunkt til funksjonen som ikkje er numerisk.
        [point] Ignorerer eit punkt på funksjonen som ikkje er numerisk.
        [slope] Ignorerer ein stigingstal til funksjonen som ikkje er numerisk.
       *[other] Ignorerer { $type } til funksjonen som ikkje er numerisk.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ignorerer eit tomt maksimum til funksjonen.
        [minimum] Ignorerer eit tomt minimum til funksjonen.
        [extremum] Ignorerer eit tomt ekstremalpunkt til funksjonen.
        [point] Ignorerer eit tomt punkt på funksjonen.
       *[other] Ignorerer eit tomt { $type } til funksjonen.
    }

function-points-too-close = Funksjonen inneheld to punkt som ligg for tett saman. Kan ikkje definere funksjonen.

# «inndata» and «utdata» are neuter and unchanged in the plural, so both counts
# read as one string and the two selects English draws are dropped.
function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] Iterasjonar av ein funksjon er berre mogleg når talet på inndata er lik talet på utdata. Denne funksjonen har { $inputs } inndata og { $outputs } utdata.
    }

## `<sequence>`

sequence-invalid-length = Ugyldig lengd på følgja.  Må vere eit ikkje-negativt heiltal.

sequence-invalid-step = Ugyldig steg i følgja.  Må vere eit tal for ei følgje av typen { $type }.

sequence-invalid-endpoint-number = Ugyldig "{ $attribute }" i ei talfølgje.  Må vere eit tal.

sequence-invalid-endpoint-letters = Ugyldig "{ $attribute }" i ei bokstavfølgje.  Må vere ein bokstavkombinasjon.

sequence-invalid-endpoint = Ugyldig "{ $attribute }" i følgja.

select-from-sequence-coprime-not-numbers = coprime vert ignorert, sidan det ikkje er tal som vert valde

select-from-sequence-coprime-with-exclude-combinations = coprime vert ignorert, sidan excludeCombinations er oppgjeven

## Resolving a `target`

target-not-found = Ugyldig target for `<{ $source }>`: finn ikkje målet.

target-state-variable-not-found = Ugyldig target for `<{ $source }>`: finn ingen tilstandsvariabel med namnet "{ $property }" på ein `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Variablane i `<odeSystem>` må vere andre enn den uavhengige variabelen.

ode-system-duplicate-variable-names = Kan ikkje definere høgresidene i differensiallikningane når namna på dei avhengige variablane er like.

ode-system-rhs-function-error = Kan ikkje definere høgresida i differensiallikninga.  Feil ved oppretting av mathjs-funksjon.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Kan ikkje definere ein vinkel mellom { $count } linjer

angle-invalid-through-point = Ugyldig punkt i through på `<angle>`

parabola-vertex-too-many-points = Ein parabel med toppunkt gjennom meir enn 1 punkt er ikkje laga enno.

parabola-too-many-points = Ein parabel gjennom meir enn 3 punkt er ikkje laga enno.

intersection-too-many-items = Skjeringspunkt for meir enn to objekt er ikkje laga enno

## Other math components

ionic-compound-not-two-ions = Ionesamband med anna enn to ion er ikkje laga enno.

ionic-compound-needs-cation-and-anion = Ionesamband er berre laga for eitt kation og eitt anion.

solve-equations-cannot-evaluate = Kan ikkje løyse likninga, sidan ho ikkje kunne reknast ut: { $equation }

math-operators-operand-number-required = Du må oppgje ein operandNumber når du hentar ut ein matematisk operand.

eigen-decomposition-failed = Kunne ikkje rekne ut eigenverdiane til matrisa

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameteren { $parameters } finst ikkje i mønsteret, så han vil alltid treffe eit tomrom.
       *[other] `<matchesPattern>`: parametrane { $parameters } finst ikkje i mønsteret, så dei vil alltid treffe eit tomrom.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: kan ikkje tolke grid="{ $grid }". Verdien må vere none, medium, dense eller to positive tal skilde med eit mellomrom, til dømes grid="1 0.5". Det vert ikkje teikna noko rutenett.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` treng ein funksjon med { $expected ->
        [one] eitt utdata, stigingstalet y' i kvart punkt, til dømes `y - x`
       *[other] to utdata, vektoren i kvart punkt, til dømes `(y, -x)`
    }, men funksjonen han fekk har { $found } utdata. { $alternative ->
        [none] Det vert ikkje teikna noko.
       *[other] `<{ $alternative }>` er komponenten for den funksjonen. Det vert ikkje teikna noko.
    }

field-function-attribute-ignored-with-child = Attributtet `function` vert ignorert fordi funksjonen òg er gjeven inne i komponenten; den inne i vert brukt. Gjev funksjonen berre på éin av dei to måtane.

field-variables-ignored =
    `<{ $component }>`: attributtet `variables` namngjev variablane i eit uttrykk som er skrive direkte inne i komponenten. { $reason ->
        [function-child] Funksjonen her er gjeven som eit `<function>`-barn, som namngjev sine eigne variablar, så `variables` vert ignorert.
       *[no-expression] Det finst ikkje noko slikt uttrykk her, så `variables` vert ignorert.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" er ikkje støtta i prefigure-gjengivaren; brukar åtferda for høgre plassering.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" er ikkje støtta i prefigure-gjengivaren; brukar åtferda for øvre plassering.

prefigure-invalid-axis-bounds = `<graph>`: ugyldige aksegrenser for konvertering til prefigure; brukar standard bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: ugyldig breidd for konvertering til prefigure; brukar standard diagrambreidd 425.

prefigure-invalid-aspect-ratio = `<graph>`: ugyldig aspectRatio for konvertering til prefigure; brukar standard sideforhold 1.

prefigure-grid-spacing-too-fine = `<graph>`: rutenettet er for tett for aksegrensene; rutenettet vert utelate i prefigure-gjengivaren.

prefigure-annotations-not-rendered = `<graph>`: merknader vert ikkje gjevne att når PreFigure-gjengivaren ikkje er i bruk.

multiple-annotations-children = Fann fleire `<annotations>`-barn i `<graph>`; alle utanom det siste vert ignorerte.

## Referring to other components

copy-unrecognized-component-type = Kan ikkje utvide eller kopiere ein ukjend komponenttype: { $type }.

copy-prop-not-found = Fann ikkje eigenskapen { $property } på ein komponent av typen { $component }

collect-no-source = Fann ingen kjelde for collect.

collect-invalid-component-type = Kan ikkje samle komponentar av typen `<{ $component }>`, sidan det er ein ugyldig komponenttype.

reference-index-unavailable = Kan ikkje vise til indeksen `{ $reference }`

## `<callAction>`

component-action-unavailable = Kan ikkje kalle { $action } på komponenten `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Dataa har ugyldig form.  Radene har ulik lengd. Funne i componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Dataa har like kolonnenamn.  Funne i componentIdx :{ $componentIdx }

data-frame-missing-column-name = Dataa manglar eit kolonnenamn.  Funne i componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Ei tildeling for dette svaret byggjer på svaret som answer-taggen sjølv har sendt inn, og det vil føre til uventa åtferd.

answer-max-num-attempts-in-section-wide-check-work = Å setje `maxNumAttempts` på ein `<answer>` inne i ein behaldar med `sectionWideCheckWork` har ingen verknad, sidan talet på forsøk vert styrt av behaldaren. Set `maxNumAttempts` på behaldaren i staden.

nested-section-wide-check-work-max-num-attempts = Å setje `maxNumAttempts` på ein behaldar med `sectionWideCheckWork` som ligg inne i ein annan behaldar med `sectionWideCheckWork` har ingen verknad, sidan talet på forsøk vert styrt av den ytre behaldaren. Set `maxNumAttempts` på den ytre behaldaren i staden.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Attributtet { $attributes } har ingen verknad utan at symbolicEquality er sett.
       *[other] Attributta { $attributes } har ingen verknad utan at symbolicEquality er sett.
    }

answer-invalid-type = Ugyldig type for svaret: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Sidan komponenten `<{ $component }>` ikkje har eit namn, kan han ikkje brukast som modulattributt

module-attribute-name-already-defined = Komponenten `<{ $component } name="{ $name }">` kan ikkje brukast som attributt for ein modul, fordi komponenttypen `<module>` alt har eit attributt som heiter "{ $name }".

conditional-content-condition-ignored = Attributtet `condition` vert ignorert på ein `<conditionalContent>`-komponent med case- eller else-barn.

slider-markers-type-mismatch = Typen på markørane stemmer ikkje med typen på glidebrytaren.

pretzel-problem-needs-statement-and-answer = Ugyldig pretzel: kvart `<problem>` må innehalde eitt `<statement>` og eitt `<answer>`.

pretzel-circuit-first-problem-distractor = Ugyldig pretzel: i mode="circuit" kan ikkje det første `<problem>` vere ein distraktor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Ugyldig verdi { $values } for attributtet `{ $attribute }`; ignorerer.
       *[other] Ugyldige verdiar { $values } for attributtet `{ $attribute }`; ignorerer.
    }

attribute-must-be-references = Ugyldig verdi `{ $value }` for attributtet `{ $attribute }`. Attributtet må vere sett saman av referansar som byrjar med `$`.

math-input-invalid-function-names = <mathInput>: ignorerte ugyldige funksjonsnamn i { $attribute }: { $names }. Visingsdelen av kvart namn må vere minst 2 teikn (bokstavar eller bindestrekar); eit valfritt `|<mathspeak-alternativ>`-suffiks kan følgje etter.

## Building components from the source

component-type-invalid = Ugyldig komponenttype: `<{ $componentType }>`

attribute-repeated = Kan ikkje gjenta attributtet { $attribute }.

attribute-invalid-for-component = Ugyldig attributt "{ $attribute }" for ein komponent av typen `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Stildefinisjonen { $styleNumber } har for lite kontrast for { $context ->
        [text-on-background] tekstfargen mot bakgrunnsfargen
        [high-contrast] den høgkontrastfargen mot lerretet
        [line] linjefargen mot lerretet
        [marker] markørfargen mot lerretet
       *[text-on-canvas] tekstfargen mot lerretet
    }{ $mode ->
        [dark] { " (mørk modus)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; krev minst { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Sjølv om stildefinisjonen { $styleNumber } har fargar som gjev nok kontrast i lys modus, har fargane for mørk modus som er utleidde av desse verdiane for lite kontrast mellom tekstfargen og bakgrunnsfargen ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; krev minst { $threshold }:1). { $suggestion ->
        [available] For å sikre nok kontrast i mørk modus kan du anten auke kontrasten i lys modus (til dømes setje { $lightAttribute }="{ $lightColor }") eller overstyre fargen for mørk modus (til dømes setje { $darkAttribute }="{ $darkColor }").
       *[none] For å sikre nok kontrast i mørk modus må du auke kontrasten i lys modus eller overstyre dei utleidde fargane med textColorDarkMode og/eller backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Sjølv om stildefinisjonen { $styleNumber } har ein tekstfarge som gjev nok kontrast i lys modus, har tekstfargen for mørk modus som er utleidd av denne verdien for lite kontrast mot lerretet ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; krev minst { $threshold }:1). { $suggestion ->
        [available] For å sikre nok kontrast i mørk modus kan du anten auke kontrasten i lys modus (til dømes setje textColor="{ $lightColor }") eller overstyre fargen for mørk modus (til dømes setje textColorDarkMode="{ $darkColor }").
       *[none] For å sikre nok kontrast i mørk modus må du auke kontrasten i lys modus eller overstyre den utleidde fargen med textColorDarkMode.
    }

section-multiple-style-palettes = Eit kapittel kan velje berre éin <stylePalette>; brukar den siste.

## Unique variants

variant-num-to-select-not-non-negative-integer = kan ikkje fastsetje dei unike variantane av { $component }, sidan numToSelect ikkje er eit ikkje-negativt heiltal.

variant-num-to-select-not-constant-number = kan ikkje fastsetje dei unike variantane av { $component }, sidan numToSelect ikkje er eit konstant tal.

variant-with-replacement-not-constant-boolean = kan ikkje fastsetje dei unike variantane av { $component }, sidan withReplacement ikkje er ein konstant boolsk verdi.

variant-select-weight-disables-unique = Unike variantar for select er slått av når eit alternativ har selectWeight eller selectForVariants oppgjeve

variant-coprime-undetermined = kan ikkje fastsetje dei unike variantane av { $component }, sidan det ikkje kan avgjerast at coprime alltid er usann.

variant-attribute-not-constant = kan ikkje fastsetje dei unike variantane av { $component }, sidan { $attribute } ikkje er ein konstant.

variant-attribute-not-number = kan ikkje fastsetje dei unike variantane av { $component }, sidan { $attribute } ikkje er eit tal.

variant-attribute-wrong-type-for-sequence =
    kan ikkje fastsetje dei unike variantane av { $component } av typen { $type }, sidan { $attribute } ikkje er { $expected ->
        [letters-combination] ein bokstavkombinasjon
        [math-expression] eit gyldig matematisk uttrykk
        [integer] eit heiltal
       *[number] eit tal
    }.

variant-length-not-integer = kan ikkje fastsetje dei unike variantane av { $component }, sidan length ikkje er eit heiltal.

variant-sort-not-implemented = unike variantar av ein { $component } med sort er ikkje laga enno

variant-exclude-combinations-not-implemented = unike variantar av ein { $component } med excludeCombinations er ikkje laga enno

variant-math-exclude-not-implemented = unike variantar av ein { $component } av typen math med exclude er ikkje laga enno

variant-non-constant-exclude-not-implemented = unike variantar av ein { $component } med ein exclude som ikkje er konstant er ikkje laga enno

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ikkje støtta i prefigure-gjengivaren for graf; etterkomaren vert hoppa over.

prefigure-descendant-invalid-geometry = { $subject }: geometrien er ikkje endeleg eller er ufullstendig; etterkomaren vert hoppa over.

prefigure-curve-label-omitted = { $subject }: merkelappar er ikkje støtta på konverterte kurveelement; merkelappen vert utelaten.

prefigure-curve-unsupported-definition-type = { $subject }: definisjonstypen '{ $definitionType }' for kurva er ikkje støtta; etterkomaren vert hoppa over.

prefigure-region-flip-functions-unsupported = { $subject }: attributtet flipFunctions på regionBetweenCurves er ikkje støtta; etterkomaren vert hoppa over.

prefigure-region-non-formula-child = { $subject }: berre barnefunksjonar av formeltypen er støtta på regionBetweenCurves; etterkomaren vert hoppa over.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' er ikkje støtta for { $labelKind ->
        [line-family] ein merkelapp i linjefamilien
       *[point] ein punktmerkelapp
    }; standard PreFigure-justering vert brukt.

prefigure-fill-style-unsupported = { $subject }: fyllstilen '{ $fillStyle }' er ikkje støtta av PreFigure; fell tilbake til eit heilt fyll.

prefigure-line-style-unknown = { $subject }: den ukjende linjestilen '{ $lineStyle }' er utelaten frå PreFigure-utdataa.

prefigure-marker-style-mapped-to-diamond = { $subject }: markørstilen '{ $markerStyle }' er lagd om til PreFigure-stilen 'diamond'.

prefigure-marker-style-unsupported = { $subject }: markørstilen '{ $markerStyle }' er ikkje støtta av PreFigure; standardstilen vert brukt.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ugyldig `ref`; kan ikkje løyse opp målet. Merknaden vert utelaten.

annotation-ref-multiple-targets = `<annotation>`: `ref` peika på fleire mål; brukar det første målet.

annotation-ref-outside-graph = `<annotation>`: ugyldig `ref`; målet ligg utanfor grafen omkring. Merknaden vert utelaten.

annotation-ref-unsupported-target = `<annotation>`: ugyldig `ref`; målet er ikkje eit støtta grafisk objekt i prefigure-konverteringa. Merknaden vert utelaten.

annotation-text-missing = `<annotation>`: `text` manglar eller er tom; sender ut tom tekst.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Sirkulær avhengigheit oppdaga.
       *[other] Sirkulær avhengigheit oppdaga som involverer komponenten `<{ $componentType }>`.
    }

reference-no-referent = Fann ingen referent for referansen: `{ $reference }`

reference-multiple-referents = Fann fleire referentar for referansen: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ugyldig format på attributtet { $attribute } til `<{ $componentType }>`.

children-invalid = Ugyldige barn for `<{ $componentType }>`: fann ugyldige barn: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ugyldig verdi `{ $value }` for attributtet `{ $attribute }`, brukar verdien `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Fann ikkje DoenetML-versjonen { $version }.
       *[other] Fann ikkje DoenetML-versjonen { $version }. Fell tilbake til versjon { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Ugyldig DoenetML: { $content }

parse-tag-missing-close-tag = Ugyldig DoenetML: Taggen `{ $tag }` har ingen sluttagg. Venta ein sjølvlukkande tagg eller ein `</{ $tagName }>`-tagg.

parse-tag-error = Ugyldig DoenetML: Feil i taggen `<{ $tagName }>`

parse-attribute-missing-value = Ugyldig DoenetML: Det ugyldige attributtet `{ $attribute }` ser ut til å mangle ein verdi.

parse-attribute-invalid = Ugyldig DoenetML: Ugyldig attributt `{ $attribute }`

parse-attribute-value-invalid = Ugyldig DoenetML: Ugyldig attributtverdi `{ $value }`

parse-attribute-value-quote-mismatch = Ugyldig DoenetML: Ugyldig attributtverdi `{ $value }`. Hermeteikna stemmer ikkje. Du ser ut til å mangle eit `{ $quote }`

parse-open-tag-name-missing = Ugyldig DoenetML: Fann ein tagg utan taggnamn, til dømes `<`

parse-tag-not-closed = Ugyldig DoenetML: Taggen `{ $tag }` vart ikkje lukka (eit `>` ser ut til å mangle).

parse-self-closing-tag-name-missing = Ugyldig DoenetML: Fann ein tagg utan taggnamn `<{ $content }>`

parse-self-closing-tag-not-closed = Ugyldig DoenetML: Taggen `{ $tag }` vart ikkje lukka (`/>` ser ut til å mangle).

parse-tag-invalid-attributes = Ugyldig DoenetML: Taggen `{ $tag }` er ikkje gyldig. Han kan ha feil attributt.

parse-close-tag-name-missing = Ugyldig DoenetML: Fann ein sluttagg utan taggnamn, til dømes `</`

parse-attribute-value-unquoted = Attributtverdiar må stå i hermeteikn: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Ugyldig DoenetML: Fann sluttaggen `{ $tag }`, men ingen tilhøyrande starttagg

parse-close-tag-mismatched = Ugyldig DoenetML: Sluttaggen stemmer ikkje. Venta `</{ $expected }>`. Fann `{ $found }`

parser-node-unconvertible = Kunne ikkje konvertere noden { $node } til ein Dast-node.

## Names

name-attribute-invalid =
    Ugyldig attributt name='{ $name }'. { $reason ->
        [characters] Namn kan berre innehalde bokstavar, tal, understrekar eller bindestrekar.
       *[start] Namn må byrje med ein bokstav.
    }

component-name-invalid-start = Ugyldig komponentnamn "{ $name }". Namn må byrje med ein bokstav.

## `<answer>` sugar

answer-video-watched-missing-video = Eit svar med typen videoWatched må ha eit video-attributt

answer-video-watched-video-not-reference = Eit svar med typen videoWatched må ha eit video-attributt som er ein referanse

answer-name-not-single-text = Attributtet name på eit svar må ha eitt enkelt tekstbarn

## Referencing another document

external-doenetml-recursion-limit = Kan ikkje hente ekstern DoenetML på grunn av for mange nivå med rekursjon. Finst det ein sirkulær referanse?

external-doenetml-unavailable = Kan ikkje hente DoenetML frå { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Ugyldig DoenetML henta frå { $attribute }="{ $uri }": han stemte ikkje med komponenttypen "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Attributtet `{ $from }` er utfasa; bruk `{ $to }` i staden.
       *[other] [deprecation] Attributtet `{ $from }` på `<{ $component }>` er utfasa; bruk `{ $to }` i staden.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Attributtet `{ $from }` er utfasa og vert ignorert fordi `{ $to }` òg er oppgjeve.
       *[other] [deprecation] Attributtet `{ $from }` på `<{ $component }>` er utfasa og vert ignorert fordi `{ $to }` òg er oppgjeve.
    }

deprecated-attribute-ignored = [deprecation] Attributtet `{ $attribute }` på `<{ $component }>` er utfasa og vert ignorert.

deprecated-attribute-to-child = [deprecation] Attributtet `{ $attribute }` på `<{ $component }>` er utfasa; bruk eit `<{ $child }>`-barn i staden.

deprecated-attribute-value-renamed = [deprecation] Verdien `{ $value }` av attributtet `{ $attribute }` på `<{ $component }>` er utfasa; bruk `{ $to }` i staden.


## Language coverage

pluralize-english-only = `<pluralize>` kan berre lage fleirtal på engelsk, så teksten står uendra i eit dokument som er skrive på { $locale }. Skriv fleirtalsforma direkte, eller set henne med attributtet `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elementet `<{ $tag }>` er ikkje eit kjent Doenet-element.

schema-element-not-allowed-at-root = Elementet `<{ $tag }>` er ikkje tillate på rota av dokumentet.

schema-element-not-allowed-inside = Elementet `<{ $tag }>` er ikkje tillate inne i `<{ $parent }>`.

schema-attribute-unrecognized = Elementet `<{ $tag }>` har ikkje eit attributt som heiter `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Attributtet `{ $attribute }` på elementet `<{ $tag }>` må vere ei liste der kvart element er eitt av: { $allowed }
       *[other] Attributtet `{ $attribute }` på elementet `<{ $tag }>` må vere eitt av: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Ugyldig variantnamn for select.  Variantnamnet { $variantName } finst i { $numOptions } alternativ, men talet som skal veljast er { $numToSelect }.

select-variant-name-without-options = Nokre variantar er oppgjevne for select, men ingen alternativ er oppgjevne for det moglege variantnamnet: { $variantName }.

select-variant-name-not-possible = Variantnamnet { $variantName } som er oppgjeve for select er ikkje eit mogleg variantnamn.

select-too-few-options = Kan ikkje velje { $numToSelect } komponentar av berre { $numOptions }.

select-from-sequence-too-few-values = Kan ikkje velje { $numToSelect } verdiar frå ei følgje med lengda { $length }.

select-from-sequence-indices-count-mismatch = Talet på indeksar som er oppgjevne for select må stemme med talet som skal veljast

select-from-sequence-indices-not-integers = Alle indeksar som er oppgjevne for select må vere heiltal

select-from-sequence-index-excluded = Ein oppgjeven indeks for selectfromsequence var utelaten

select-from-sequence-indices-excluded-combination = Dei oppgjevne indeksane for selectfromsequence var ein utelaten kombinasjon

select-from-sequence-coprime-not-positive-integers = Kan ikkje velje innbyrdes primiske kombinasjonar, sidan det ikkje er positive heiltal som vert valde.

select-from-sequence-coprime-common-factor = Kan ikkje velje innbyrdes primiske tal. Alle moglege verdiar har ein felles faktor. (Dei oppgjevne verdiane av "from" eller "to" må vere innbyrdes primiske med "step".)

select-from-sequence-coprime-single-number = Kan ikkje velje innbyrdes primiske kombinasjonar frå eit enkelt tal som ikkje er 1.

select-from-sequence-excluded-too-many-combinations = Over 70 % av kombinasjonane i selectFromSequence er utelatne

select-from-sequence-coprime-none-found = Kunne ikkje velje innbyrdes primiske tal. Alle moglege verdiar har ein felles faktor.

select-from-sequence-too-few-unique-values = Kan ikkje velje { $numToSelect } ulike verdiar frå ei følgje med lengda { $numPossibleValues }

select-prime-numbers-too-few-values = Kan ikkje velje { $numToSelect } verdiar frå ei liste med primtal av lengda { $numValues }

select-prime-numbers-values-count-mismatch = Talet på verdiar som er oppgjevne for select må stemme med talet som skal veljast

select-prime-numbers-values-not-prime = Alle verdiar som er oppgjevne for select av primtal må stå i lista med primtal

select-prime-numbers-values-excluded-combination = Dei oppgjevne verdiane for selectPrimeNumbers var ein utelaten kombinasjon

select-prime-numbers-excluded-too-many-combinations = Over 70 % av kombinasjonane i selectPrimeNumbers er utelatne

select-random-combination-fluke = Ved eit svært usannsynleg samantreff kunne ingen kombinasjon av tilfeldige verdiar veljast

select-random-value-fluke = Ved eit svært usannsynleg samantreff kunne ingen tilfeldig verdi veljast

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` vert ikkje teikna inne i matematikken; uttrykket vert sett slik det vart før inndatafelt kunne leggjast inn i det. { $reason ->
        [not-inline] Berre eit `inline` valfelt får plass inne i eit uttrykk; utan `inline` er det ei blokk med knappar.
        [expanded] Eit `expanded` tekstfelt er ei fleirlinja rute, som er for stor til å stå inne i eit uttrykk.
        [on-graph] På ein graf vert uttrykket teikna som eitt einaste bilete, som ikkje har plass til eit felt.
       *[relative-width] `width` er relativ (ein prosent eller `em`), og har ingenting å måle mot inne i eit uttrykk. Oppgje breidda i absolutte einingar, til dømes `px`, i staden.
    }
