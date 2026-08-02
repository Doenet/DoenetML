# Norwegian Bokmål diagnostics. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
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
# Norwegian does not change the verb with the number of its subject, so where
# English separates «is ignored» from «are ignored» there is one form and the
# select is dropped.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } ignoreres når to endepunkter er angitt

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } ignoreres når både et endepunkt og et midtpunkt er angitt

line-segment-midpoint-offset-without-midpoint = midpointOffset har ingen virkning uten midpoint

## `<line>`

line-points-undetermined-dimensions = Linje gjennom punkter med ubestemt antall dimensjoner.

line-points-too-few-dimensions = Linjen må gå gjennom punkter med minst to dimensjoner.

line-points-depend-on-variables = Linjen går gjennom punkter som avhenger av variabler: { $variables }.

line-equation-invalid-format = Ugyldig format for linjens likning i variablene { $variable1 } og { $variable2 }.

## `<ray>`

ray-overprescribed-through = Halvlinjen er bestemt av through, endpoint og direction.  Angitt through ignoreres.

ray-dimension-mismatch = numDimensions stemmer ikke i halvlinjen.

## `<vector>`

vector-overprescribed-head = Vektoren er bestemt av head, tail og displacement.  Angitt head ignoreres.

vector-dimension-mismatch = numDimensions stemmer ikke i vektoren.

## Attracting and constraining

attract-to-without-nearest-point = Kan ikke trekkes mot `<{ $component }>` fordi den mangler tilstandsvariabelen nearestPoint.

constrain-to-without-nearest-point = Kan ikke begrenses til `<{ $component }>` fordi den mangler tilstandsvariabelen nearestPoint.

constrain-to-interior-without-nearest-point = Kan ikke begrenses til det indre av `<{ $component }>` fordi den mangler tilstandsvariabelen nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ignoreres for choiceInput som ikke er inline

## Ordering children by index

choice-input-indices-count-mismatch = Indeksene som er angitt for choiceInput ignoreres fordi antallet ikke stemmer med antallet choice-barn.

pretzel-indices-count-mismatch = Indeksene som er angitt for problem ignoreres fordi antallet ikke stemmer med antallet problem-barn.

shuffle-indices-count-mismatch = Indeksene som er angitt for shuffle ignoreres fordi antallet ikke stemmer med antallet komponenter.

indices-ignored-out-of-range = Indeksene som er angitt for { $component } ignoreres fordi noen ligger utenfor området.

pretzel-indices-repeated = Indeksene som er angitt for pretzel ignoreres fordi noen gjentas.

pretzel-circuit-first-index = Indeksene som er angitt for pretzel i modusen circuit ignoreres fordi den første indeksen må være 1.

## `<shuffle>` and `<sort>`

string-children-need-type = For at `<{ $component }>` skal virke med strengbarn må attributtet `type` angis.

invalid-type-defaulting-to-math = Ugyldig type { $type } for komponenten { $component }. Må være en av math, text, number eller boolean. Bruker math.

string-not-valid-component-to-arrange = Strengen «{ $value }» er ikke en gyldig komponent for { $component }. Ignoreres.

## Types and variables

invalid-type-defaulting-to-number = Ugyldig type { $type }, type settes til number.

invalid-variable-value = Ugyldig verdi for en variabel: `{ $value }`

## Variants

variant-index-must-be-number = Variantindeksen { $index } må være et tall

variant-index-must-be-integer = Variantindeksen { $index } må være et heltall

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` er ikke implementert for absolutte mål. Breddene settes til relative.

side-by-side-absolute-margins = `<{ $component }>` er ikke implementert for absolutte mål. Margene settes til relative.

side-by-side-no-block-child = Ugyldig `<{ $component }>`: den må ha minst ett blokkbarn.

## `<label>`

label-for-ignored-on-graphical = Attributtet `for` på en grafisk `<label>` ignoreres.

label-for-must-resolve-to-one = Attributtet `for` på `<label>` må peke ut nøyaktig én komponent.

label-for-unresolved = Attributtet `for` på `<label>` kunne ikke knyttes til en komponent.

label-for-answer-with-authored-inputs = Attributtet `for` på `<label>` viser til et `<answer>` med uttrykkelig skrevne inndatafelt; vis direkte til feltet.

label-for-answer-without-input = Attributtet `for` på `<label>` viser til et `<answer>` uten et inndatafelt å merke.

label-for-must-reference-input-or-answer = Attributtet `for` på `<label>` må vise til et inndatafelt eller til et answer.

## Accessibility

accessibility-short-description-or-decorative = Av hensyn til tilgjengelighet må `<{ $component }>` enten ha en kort beskrivelse eller være angitt som dekorativ.

accessibility-video-short-description = Av hensyn til tilgjengelighet må `<video>` ha en kort beskrivelse.

accessibility-input-short-description-or-label = Av hensyn til tilgjengelighet må `<{ $component }>` ha en kort beskrivelse eller en etikett.

accessibility-answer-input-short-description-or-label = Av hensyn til tilgjengelighet må et `<answer>` som oppretter et inndatafelt ha en kort beskrivelse eller en etikett.

accessibility-short-description-contains-math = Korte beskrivelser bør ikke inneholde matematiske komponenter som `<{ $component }>`. Skriv matematikken med ord.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } har utilstrekkelig kontrast for teksten i avsnittsoverskriften (mørk modus) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; krever minst { $threshold }:1).
       *[other] { $colorName } har utilstrekkelig kontrast for teksten i avsnittsoverskriften ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; krever minst { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` gjennom { $count } punkter er ikke implementert for tilfellet der punktene ikke har numeriske verdier.

circle-too-many-through-points = Kan ikke beregne en sirkel gjennom mer enn 3 punkter.

circle-overprescribed-radius-center-points = Kan ikke beregne en sirkel med angitt radius, sentrum og punkter.

circle-center-with-multiple-points = Kan ikke beregne en sirkel med angitt sentrum gjennom mer enn 1 punkt.

circle-radius-too-small = Kan ikke beregne sirkelen: siden avstanden mellom de to punktene er { $distance }, er den angitte radiusen { $radius } for liten.

circle-radius-with-many-points = Kan ikke lage en sirkel gjennom mer enn to punkter med angitt radius.

circle-invalid-center-or-through-points = Ugyldig sentrum eller ugyldige punkter for sirkelen.

circle-radius-center-with-multiple-points = Kan ikke beregne radiusen til en sirkel med angitt sentrum gjennom mer enn 1 punkt.

circle-change-radius-non-numerical = Kan ikke endre radiusen til en sirkel med ikke-numeriske punkter

circle-radius-with-points-non-numerical = Kan ikke lage en sirkel gjennom mer enn ett punkt med angitt radius når det ikke finnes numeriske verdier.

circle-change-center-non-numerical = Å endre sentrum for en sirkel gjennom punkter med ikke-numeriske verdier er ikke implementert.

## `<function>`

function-domain-insufficient-dimensions = Utilstrekkelig antall dimensjoner for funksjonens definisjonsmengde. Mengden har { $intervals } intervaller, men funksjonen har { $inputs } inndata.

function-domain-invalid-format = Ugyldig format for funksjonens definisjonsmengde.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ikke-numerisk maksimum for funksjonen ignoreres.
        [minimum] Ikke-numerisk minimum for funksjonen ignoreres.
        [extremum] Ikke-numerisk ekstremalpunkt for funksjonen ignoreres.
        [point] Ikke-numerisk punkt for funksjonen ignoreres.
        [slope] Ikke-numerisk stigningstall for funksjonen ignoreres.
       *[other] Ikke-numerisk { $type } for funksjonen ignoreres.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Tomt maksimum for funksjonen ignoreres.
        [minimum] Tomt minimum for funksjonen ignoreres.
        [extremum] Tomt ekstremalpunkt for funksjonen ignoreres.
        [point] Tomt punkt for funksjonen ignoreres.
       *[other] Tomt { $type } for funksjonen ignoreres.
    }

function-points-too-close = Funksjonen inneholder to punkter som ligger for nær hverandre. Funksjonen kan ikke defineres.

function-iterates-input-output-mismatch = Funksjonsiterasjoner er bare mulige hvis antallet inndata er lik antallet utdata. Denne funksjonen har { $inputs } inndata og { $outputs } utdata.

## `<sequence>`

sequence-invalid-length = Ugyldig lengde på følgen.  Må være et ikke-negativt heltall.

sequence-invalid-step = Ugyldig steg i følgen.  Må være et tall for en følge av typen { $type }.

sequence-invalid-endpoint-number = Ugyldig «{ $attribute }» i en tallfølge.  Må være et tall.

sequence-invalid-endpoint-letters = Ugyldig «{ $attribute }» i en bokstavfølge.  Må være en bokstavkombinasjon.

sequence-invalid-endpoint = Ugyldig «{ $attribute }» i følgen.

select-from-sequence-coprime-not-numbers = coprime ignoreres siden det ikke er tall som velges

select-from-sequence-coprime-with-exclude-combinations = coprime ignoreres siden excludeCombinations er angitt

## Resolving a `target`

target-not-found = Ugyldig target for `<{ $source }>`: finner ikke målet.

target-state-variable-not-found = Ugyldig target for `<{ $source }>`: finner ingen tilstandsvariabel med navnet «{ $property }» på et `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Variablene i `<odeSystem>` må være forskjellige fra den uavhengige variabelen.

ode-system-duplicate-variable-names = Kan ikke definere høyresidefunksjoner for differensiallikningen med gjentatte navn på avhengige variabler.

ode-system-rhs-function-error = Kan ikke definere høyresidefunksjonen for differensiallikningen.  Feil ved oppretting av mathjs-funksjonen.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Kan ikke definere en vinkel mellom { $count } linjer

angle-invalid-through-point = Ugyldig punkt i through på `<angle>`

parabola-vertex-too-many-points = Parabel med toppunkt gjennom mer enn 1 punkt er ikke implementert.

parabola-too-many-points = Parabel gjennom mer enn 3 punkter er ikke implementert.

intersection-too-many-items = Snitt mellom mer enn to objekter er ikke implementert

## Other math components

ionic-compound-not-two-ions = Ioneforbindelse er ikke implementert for annet enn to ioner.

ionic-compound-needs-cation-and-anion = Ioneforbindelse er bare implementert for ett kation og ett anion.

solve-equations-cannot-evaluate = Kan ikke løse likningen siden den ikke kunne beregnes: { $equation }

math-operators-operand-number-required = operandNumber må angis når en matematisk operand hentes ut.

eigen-decomposition-failed = Kunne ikke beregne egenverdiene til matrisen

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameteren { $parameters } forekommer ikke i mønsteret, så den treffer alltid et tomrom.
       *[other] `<matchesPattern>`: parameterne { $parameters } forekommer ikke i mønsteret, så de treffer alltid et tomrom.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: kan ikke tolke grid="{ $grid }". Det må være none, medium, dense eller to positive tall skilt med et mellomrom, for eksempel grid="1 0.5". Ingen rutenett tegnes.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" støttes ikke i prefigure-gjengiveren; oppførselen til right brukes.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" støttes ikke i prefigure-gjengiveren; oppførselen til top brukes.

prefigure-invalid-axis-bounds = `<graph>`: ugyldige aksegrenser for prefigure-konverteringen; standardverdien bbox (-10,-10,10,10) brukes.

prefigure-invalid-width = `<graph>`: ugyldig bredde for prefigure-konverteringen; standardbredden 425 brukes.

prefigure-invalid-aspect-ratio = `<graph>`: ugyldig aspectRatio for prefigure-konverteringen; standardforholdet 1 brukes.

prefigure-grid-spacing-too-fine = `<graph>`: rutenettavstanden er for fin for aksegrensene; rutenettet utelates i prefigure-gjengiveren.

prefigure-annotations-not-rendered = `<graph>`: merknader gjengis ikke når PreFigure-gjengiveren ikke brukes.

multiple-annotations-children = Det ble funnet flere `<annotations>`-barn i `<graph>`; alle unntatt det siste ignoreres.

## Referring to other components

copy-unrecognized-component-type = Kan ikke utvide eller kopiere en ukjent komponenttype: { $type }.

copy-prop-not-found = Fant ikke egenskapen { $property } på en komponent av typen { $component }

collect-no-source = Fant ingen kilde for collect.

collect-invalid-component-type = Kan ikke samle komponenter av typen `<{ $component }>` siden det er en ugyldig komponenttype.

reference-index-unavailable = Kan ikke vise til indeksen `{ $reference }`

## `<callAction>`

component-action-unavailable = Kan ikke kalle { $action } på komponenten `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Dataene har ugyldig form.  Radene har ulik lengde. Funnet i componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Dataene har gjentatte kolonnenavn.  Funnet i componentIdx :{ $componentIdx }

data-frame-missing-column-name = Dataene mangler et kolonnenavn.  Funnet i componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = En award for dette svaret bygger på answer-taggens eget innsendte svar, noe som fører til uventet oppførsel.

answer-max-num-attempts-in-section-wide-check-work = Å sette `maxNumAttempts` på et `<answer>` inne i en beholder med `sectionWideCheckWork` har ingen virkning, siden antallet forsøk styres av beholderen. Sett `maxNumAttempts` på beholderen i stedet.

nested-section-wide-check-work-max-num-attempts = Å sette `maxNumAttempts` på en beholder med `sectionWideCheckWork` som ligger i en annen beholder med `sectionWideCheckWork` har ingen virkning, siden antallet forsøk styres av den ytre beholderen. Sett `maxNumAttempts` på den ytre beholderen i stedet.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Attributtet { $attributes } har ingen virkning uten symbolicEquality satt.
       *[other] Attributtene { $attributes } har ingen virkning uten symbolicEquality satt.
    }

answer-invalid-type = Ugyldig type for answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Siden komponenten `<{ $component }>` ikke har et navn, kan den ikke brukes som modulattributt

module-attribute-name-already-defined = Komponenten `<{ $component } name="{ $name }">` kan ikke brukes som attributt for en modul fordi komponenttypen `<module>` allerede har et attributt «{ $name }».

conditional-content-condition-ignored = Attributtet `condition` ignoreres på en `<conditionalContent>`-komponent med case- eller else-barn.

slider-markers-type-mismatch = Typen til markørene stemmer ikke med typen til glidebryteren.

pretzel-problem-needs-statement-and-answer = Ugyldig pretzel: hvert `<problem>` må inneholde ett `<statement>` og ett `<answer>`.

pretzel-circuit-first-problem-distractor = Ugyldig pretzel: i mode="circuit" kan ikke det første `<problem>` være en distraktor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Ugyldig verdi { $values } for attributtet `{ $attribute }`; ignoreres.
       *[other] Ugyldige verdier { $values } for attributtet `{ $attribute }`; ignoreres.
    }

attribute-must-be-references = Ugyldig verdi `{ $value }` for attributtet `{ $attribute }`. Attributtet må bestå av referanser som begynner med `$`.

math-input-invalid-function-names = <mathInput>: ugyldige funksjonsnavn ble ignorert i { $attribute }: { $names }. Visningsdelen av hvert navn må være minst 2 tegn (bokstaver eller bindestreker); et valgfritt suffiks `|<mathspeak alternative>` kan følge.

## Building components from the source

component-type-invalid = Ugyldig komponenttype: `<{ $componentType }>`

attribute-repeated = Attributtet { $attribute } kan ikke gjentas.

attribute-invalid-for-component = Ugyldig attributt «{ $attribute }» for en komponent av typen `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Stildefinisjonen { $styleNumber } har utilstrekkelig kontrast { $context ->
        [text-on-background] mellom tekstfargen og bakgrunnsfargen
        [high-contrast] mellom høykontrastfargen og lerretet
        [line] mellom linjefargen og lerretet
        [marker] mellom markørfargen og lerretet
       *[text-on-canvas] mellom tekstfargen og lerretet
    }{ $mode ->
        [dark] { " (mørk modus)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; krever minst { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Selv om stildefinisjonen { $styleNumber } angir farger med tilstrekkelig kontrast i lys modus, har fargene for mørk modus som utledes av disse verdiene utilstrekkelig kontrast mellom tekstfargen og bakgrunnsfargen ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; krever minst { $threshold }:1). { $suggestion ->
        [available] For tilstrekkelig kontrast i mørk modus kan du enten øke kontrasten i lys modus (f.eks. sette { $lightAttribute }="{ $lightColor }") eller overstyre fargen for mørk modus (f.eks. sette { $darkAttribute }="{ $darkColor }").
       *[none] For tilstrekkelig kontrast i mørk modus må du øke kontrasten i lys modus eller overstyre de utledede fargene med textColorDarkMode og/eller backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Selv om stildefinisjonen { $styleNumber } angir en tekstfarge med tilstrekkelig kontrast i lys modus, har tekstfargen for mørk modus som utledes av denne verdien utilstrekkelig kontrast mot lerretet ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; krever minst { $threshold }:1). { $suggestion ->
        [available] For tilstrekkelig kontrast i mørk modus kan du enten øke kontrasten i lys modus (f.eks. sette textColor="{ $lightColor }") eller overstyre fargen for mørk modus (f.eks. sette textColorDarkMode="{ $darkColor }").
       *[none] For tilstrekkelig kontrast i mørk modus må du øke kontrasten i lys modus eller overstyre den utledede fargen med textColorDarkMode.
    }

section-multiple-style-palettes = Et avsnitt kan bare velge én <stylePalette>; den siste brukes.

## Unique variants

variant-num-to-select-not-non-negative-integer = kan ikke bestemme unike varianter av { $component } siden numToSelect ikke er et ikke-negativt heltall.

variant-num-to-select-not-constant-number = kan ikke bestemme unike varianter av { $component } siden numToSelect ikke er et konstant tall.

variant-with-replacement-not-constant-boolean = kan ikke bestemme unike varianter av { $component } siden withReplacement ikke er en konstant boolsk verdi.

variant-select-weight-disables-unique = Unike varianter for select slås av hvis et alternativ har selectWeight eller selectForVariants angitt

variant-coprime-undetermined = kan ikke bestemme unike varianter av { $component } siden det ikke kan avgjøres at coprime alltid er usann.

variant-attribute-not-constant = kan ikke bestemme unike varianter av { $component } siden { $attribute } ikke er en konstant.

variant-attribute-not-number = kan ikke bestemme unike varianter av { $component } siden { $attribute } ikke er et tall.

variant-attribute-wrong-type-for-sequence =
    kan ikke bestemme unike varianter av { $component } av typen { $type } siden { $attribute } ikke er { $expected ->
        [letters-combination] en bokstavkombinasjon
        [math-expression] et gyldig matematisk uttrykk
        [integer] et heltall
       *[number] et tall
    }.

variant-length-not-integer = kan ikke bestemme unike varianter av { $component } siden length ikke er et heltall.

variant-sort-not-implemented = unike varianter av en { $component } med sort er ikke implementert

variant-exclude-combinations-not-implemented = unike varianter av en { $component } med excludeCombinations er ikke implementert

variant-math-exclude-not-implemented = unike varianter av en { $component } av typen math med exclude er ikke implementert

variant-non-constant-exclude-not-implemented = unike varianter av en { $component } med ikke-konstant exclude er ikke implementert

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: støttes ikke i graph prefigure-gjengiveren; etterkommeren ble hoppet over.

prefigure-descendant-invalid-geometry = { $subject }: ikke-endelig eller ufullstendig geometri; etterkommeren ble hoppet over.

prefigure-curve-label-omitted = { $subject }: etiketter støttes ikke på konverterte kurveelementer; etiketten ble utelatt.

prefigure-curve-unsupported-definition-type = { $subject }: definisjonstypen «{ $definitionType }» for kurven støttes ikke; etterkommeren ble hoppet over.

prefigure-region-flip-functions-unsupported = { $subject }: attributtet flipFunctions på regionBetweenCurves støttes ikke; etterkommeren ble hoppet over.

prefigure-region-non-formula-child = { $subject }: bare barnefunksjoner av formeltype støttes på regionBetweenCurves; etterkommeren ble hoppet over.

prefigure-label-position-unsupported =
    { $subject }: labelPosition «{ $labelPosition }» støttes ikke for { $labelKind ->
        [line-family] etikett på et objekt i linjefamilien
       *[point] punktetikett
    }; PreFigures standardjustering ble brukt.

prefigure-fill-style-unsupported = { $subject }: fyllstilen «{ $fillStyle }» støttes ikke av PreFigure; et heldekkende fyll brukes i stedet.

prefigure-line-style-unknown = { $subject }: den ukjente linjestilen «{ $lineStyle }» ble utelatt fra PreFigures utdata.

prefigure-marker-style-mapped-to-diamond = { $subject }: markørstilen «{ $markerStyle }» ble avbildet på PreFigure-stilen «diamond».

prefigure-marker-style-unsupported = { $subject }: markørstilen «{ $markerStyle }» støttes ikke av PreFigure; standardstilen ble brukt.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ugyldig `ref`; målet kan ikke bestemmes. Merknaden ble utelatt.

annotation-ref-multiple-targets = `<annotation>`: `ref` pekte ut flere mål; det første brukes.

annotation-ref-outside-graph = `<annotation>`: ugyldig `ref`; målet ligger utenfor den omsluttende grafen. Merknaden ble utelatt.

annotation-ref-unsupported-target = `<annotation>`: ugyldig `ref`; målet er ikke et støttet grafisk objekt i prefigure-konverteringen. Merknaden ble utelatt.

annotation-text-missing = `<annotation>`: `text` mangler eller er tom; det skrives ut tom tekst.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Det ble oppdaget en sirkulær avhengighet.
       *[other] Det ble oppdaget en sirkulær avhengighet som involverer en `<{ $componentType }>`-komponent.
    }

reference-no-referent = Fant ingen referent for referansen: `{ $reference }`

reference-multiple-referents = Fant flere referenter for referansen: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ugyldig format for attributtet { $attribute } på `<{ $componentType }>`.

children-invalid = Ugyldige barn for `<{ $componentType }>`: fant ugyldige barn: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ugyldig verdi `{ $value }` for attributtet `{ $attribute }`, bruker verdien `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Fant ikke DoenetML-versjonen { $version }.
       *[other] Fant ikke DoenetML-versjonen { $version }. Bruker versjon { $fallback } i stedet
    }

## Reading the DoenetML

parse-invalid-doenetml = Ugyldig DoenetML: { $content }

parse-tag-missing-close-tag = Ugyldig DoenetML: Taggen `{ $tag }` har ingen sluttagg. Forventet en selvlukkende tagg eller en `</{ $tagName }>`-tagg.

parse-tag-error = Ugyldig DoenetML: Feil i taggen `<{ $tagName }>`

parse-attribute-missing-value = Ugyldig DoenetML: Det ugyldige attributtet `{ $attribute }` ser ut til å mangle en verdi.

parse-attribute-invalid = Ugyldig DoenetML: Ugyldig attributt `{ $attribute }`

parse-attribute-value-invalid = Ugyldig DoenetML: Ugyldig attributtverdi `{ $value }`

parse-attribute-value-quote-mismatch = Ugyldig DoenetML: Ugyldig attributtverdi `{ $value }`. Anførselstegnene stemmer ikke. Det ser ut til å mangle et `{ $quote }`

parse-open-tag-name-missing = Ugyldig DoenetML: Fant en tagg uten taggnavn, f.eks. `<`

parse-tag-not-closed = Ugyldig DoenetML: Taggen `{ $tag }` ble ikke lukket (et `>` ser ut til å mangle).

parse-self-closing-tag-name-missing = Ugyldig DoenetML: Fant en tagg uten taggnavn `<{ $content }>`

parse-self-closing-tag-not-closed = Ugyldig DoenetML: Taggen `{ $tag }` ble ikke lukket (`/>` ser ut til å mangle).

parse-tag-invalid-attributes = Ugyldig DoenetML: Taggen `{ $tag }` er ikke gyldig. Den kan ha feil attributter.

parse-close-tag-name-missing = Ugyldig DoenetML: Fant en sluttagg uten taggnavn, f.eks. `</`

parse-attribute-value-unquoted = Attributtverdier må stå i anførselstegn: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Ugyldig DoenetML: Fant sluttaggen `{ $tag }`, men ingen tilsvarende starttagg

parse-close-tag-mismatched = Ugyldig DoenetML: Sluttaggen stemmer ikke. Forventet `</{ $expected }>`. Fant `{ $found }`

parser-node-unconvertible = Kunne ikke konvertere noden { $node } til en Dast-node.

## Names

name-attribute-invalid =
    Ugyldig attributt name='{ $name }'. { $reason ->
        [characters] Navn kan bare inneholde bokstaver, tall, understreker eller bindestreker.
       *[start] Navn må begynne med en bokstav.
    }

component-name-invalid-start = Ugyldig komponentnavn «{ $name }». Navn må begynne med en bokstav.

## `<answer>` sugar

answer-video-watched-missing-video = Et answer med type videoWatched må ha et video-attributt

answer-video-watched-video-not-reference = Et answer med type videoWatched må ha et video-attributt som er en referanse

answer-name-not-single-text = Et answers name-attributt må ha nøyaktig ett tekstbarn

## Referencing another document

external-doenetml-recursion-limit = Kunne ikke hente ekstern DoenetML på grunn av for mange rekursjonsnivåer. Finnes det en sirkulær referanse?

external-doenetml-unavailable = Kunne ikke hente DoenetML fra { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Ugyldig DoenetML ble hentet fra { $attribute }="{ $uri }": den stemte ikke med komponenttypen «{ $componentType }»

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Attributtet `{ $from }` er utdatert; bruk `{ $to }` i stedet.
       *[other] [deprecation] Attributtet `{ $from }` på `<{ $component }>` er utdatert; bruk `{ $to }` i stedet.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Attributtet `{ $from }` er utdatert og ignoreres fordi `{ $to }` også er angitt.
       *[other] [deprecation] Attributtet `{ $from }` på `<{ $component }>` er utdatert og ignoreres fordi `{ $to }` også er angitt.
    }

deprecated-attribute-ignored = [deprecation] Attributtet `{ $attribute }` på `<{ $component }>` er utdatert og ignoreres.


## Language coverage

pluralize-english-only = `<pluralize>` kan bare bøye flertall på engelsk, så i et dokument skrevet på { $locale } står teksten uendret. Skriv flertallsformen direkte, eller angi den med attributtet `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elementet `<{ $tag }>` er ikke et kjent Doenet-element.

schema-element-not-allowed-at-root = Elementet `<{ $tag }>` er ikke tillatt i roten av dokumentet.

schema-element-not-allowed-inside = Elementet `<{ $tag }>` er ikke tillatt inne i `<{ $parent }>`.

schema-attribute-unrecognized = Elementet `<{ $tag }>` har ikke et attributt som heter `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Attributtet `{ $attribute }` på elementet `<{ $tag }>` må være en liste der hvert element er ett av: { $allowed }
       *[other] Attributtet `{ $attribute }` på elementet `<{ $tag }>` må være ett av: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Ugyldig variantnavn for select.  Variantnavnet { $variantName } forekommer i { $numOptions } alternativer, men antallet som skal velges er { $numToSelect }.

select-variant-name-without-options = Det er angitt varianter for select, men ingen alternativer for det mulige variantnavnet: { $variantName }.

select-variant-name-not-possible = Variantnavnet { $variantName } som er angitt for select, er ikke et mulig variantnavn.

select-too-few-options = Kan ikke velge { $numToSelect } komponenter av bare { $numOptions }.

select-from-sequence-too-few-values = Kan ikke velge { $numToSelect } verdier fra en følge av lengde { $length }.

select-from-sequence-indices-count-mismatch = Antallet indekser som er angitt for select må stemme med antallet som skal velges

select-from-sequence-indices-not-integers = Alle indekser som er angitt for select må være heltall

select-from-sequence-index-excluded = Indeksen som ble angitt for selectfromsequence var utelukket

select-from-sequence-indices-excluded-combination = Indeksene som ble angitt for selectfromsequence utgjorde en utelukket kombinasjon

select-from-sequence-coprime-not-positive-integers = Kan ikke velge innbyrdes primiske kombinasjoner siden det ikke er positive heltall som velges.

select-from-sequence-coprime-common-factor = Kan ikke velge innbyrdes primiske tall. Alle mulige verdier har en felles faktor. (De angitte verdiene for "from" eller "to" må være innbyrdes primiske med "step".)

select-from-sequence-coprime-single-number = Kan ikke velge innbyrdes primiske kombinasjoner fra ett enkelt tall som ikke er 1.

select-from-sequence-excluded-too-many-combinations = Over 70 % av kombinasjonene ble utelukket i selectFromSequence

select-from-sequence-coprime-none-found = Kunne ikke velge innbyrdes primiske tall. Alle mulige verdier har en felles faktor.

select-from-sequence-too-few-unique-values = Kan ikke velge { $numToSelect } unike verdier fra en følge av lengde { $numPossibleValues }

select-prime-numbers-too-few-values = Kan ikke velge { $numToSelect } verdier fra en liste med primtall av lengde { $numValues }

select-prime-numbers-values-count-mismatch = Antallet verdier som er angitt for select må stemme med antallet som skal velges

select-prime-numbers-values-not-prime = Alle verdier som er angitt for valg av primtall må finnes i listen med primtall

select-prime-numbers-values-excluded-combination = Verdiene som ble angitt for selectPrimeNumbers utgjorde en utelukket kombinasjon

select-prime-numbers-excluded-too-many-combinations = Over 70 % av kombinasjonene ble utelukket i selectPrimeNumbers

select-random-combination-fluke = Ved et ytterst usannsynlig sammentreff lyktes det ikke å velge en kombinasjon av tilfeldige verdier

select-random-value-fluke = Ved et ytterst usannsynlig sammentreff lyktes det ikke å velge en tilfeldig verdi
