# Danish diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Danish does not change the verb with the number of its subject, so where
# English separates «is ignored» from «are ignored» there is one form and the
# select is dropped.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } ignoreres, når der er angivet to endepunkter

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } ignoreres, når der er angivet både et endepunkt og et midtpunkt

line-segment-midpoint-offset-without-midpoint = midpointOffset har ingen virkning uden midpoint

## `<line>`

line-points-undetermined-dimensions = Linje gennem punkter med ubestemt antal dimensioner.

line-points-too-few-dimensions = Linjen skal gå gennem punkter med mindst to dimensioner.

line-points-depend-on-variables = Linjen går gennem punkter, der afhænger af variable: { $variables }.

line-equation-invalid-format = Ugyldigt format for linjens ligning i variablene { $variable1 } og { $variable2 }.

## `<ray>`

ray-overprescribed-through = Halvlinjen er bestemt af through, endpoint og direction.  Det angivne through ignoreres.

ray-dimension-mismatch = numDimensions passer ikke i halvlinjen.

## `<vector>`

vector-overprescribed-head = Vektoren er bestemt af head, tail og displacement.  Det angivne head ignoreres.

vector-dimension-mismatch = numDimensions passer ikke i vektoren.

## Attracting and constraining

attract-to-without-nearest-point = Kan ikke tiltrækkes mod `<{ $component }>`, da den ikke har tilstandsvariablen nearestPoint.

constrain-to-without-nearest-point = Kan ikke begrænses til `<{ $component }>`, da den ikke har tilstandsvariablen nearestPoint.

constrain-to-interior-without-nearest-point = Kan ikke begrænses til det indre af `<{ $component }>`, da den ikke har tilstandsvariablen nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ignoreres for choiceInput, der ikke er inline

## Ordering children by index

choice-input-indices-count-mismatch = Indeks angivet for choiceInput ignoreres, da antallet ikke svarer til antallet af choice-børn.

pretzel-indices-count-mismatch = Indeks angivet for problem ignoreres, da antallet ikke svarer til antallet af problem-børn.

shuffle-indices-count-mismatch = Indeks angivet for shuffle ignoreres, da antallet ikke svarer til antallet af komponenter.

indices-ignored-out-of-range = Indeks angivet for { $component } ignoreres, da nogle ligger uden for det gyldige område.

pretzel-indices-repeated = Indeks angivet for pretzel ignoreres, da nogle gentages.

pretzel-circuit-first-index = Indeks angivet for pretzel i tilstanden circuit ignoreres, da det første indeks skal være 1.

## `<shuffle>` and `<sort>`

string-children-need-type = For at `<{ $component }>` kan virke med strengbørn, skal attributten `type` angives.

invalid-type-defaulting-to-math = Ugyldig type { $type } for komponenten { $component }. Skal være en af math, text, number eller boolean. Bruger math.

string-not-valid-component-to-arrange = Strengen »{ $value }« er ikke en gyldig komponent til { $component }. Ignoreres.

## Types and variables

invalid-type-defaulting-to-number = Ugyldig type { $type }, type sættes til number.

invalid-variable-value = Ugyldig værdi for en variabel: `{ $value }`

## Variants

variant-index-must-be-number = Variantindekset { $index } skal være et tal

variant-index-must-be-integer = Variantindekset { $index } skal være et heltal

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` er ikke implementeret for absolutte mål. Bredderne sættes til relative.

side-by-side-absolute-margins = `<{ $component }>` er ikke implementeret for absolutte mål. Margenerne sættes til relative.

side-by-side-no-block-child = Ugyldig `<{ $component }>`: den skal have mindst ét blokbarn.

## `<label>`

label-for-ignored-on-graphical = Attributten `for` på et grafisk `<label>` ignoreres.

label-for-must-resolve-to-one = Attributten `for` på `<label>` skal udpege præcis én komponent.

label-for-unresolved = Attributten `for` på `<label>` kunne ikke knyttes til en komponent.

label-for-answer-with-authored-inputs = Attributten `for` på `<label>` henviser til et `<answer>` med udtrykkeligt skrevne inputfelter; henvis direkte til inputfeltet.

label-for-answer-without-input = Attributten `for` på `<label>` henviser til et `<answer>` uden et inputfelt at mærke.

label-for-must-reference-input-or-answer = Attributten `for` på `<label>` skal henvise til et inputfelt eller til et answer.

## Accessibility

accessibility-short-description-or-decorative = Af hensyn til tilgængeligheden skal `<{ $component }>` enten have en kort beskrivelse eller være angivet som dekorativ.

accessibility-video-short-description = Af hensyn til tilgængeligheden skal `<video>` have en kort beskrivelse.

accessibility-input-short-description-or-label = Af hensyn til tilgængeligheden skal `<{ $component }>` have en kort beskrivelse eller en mærkat.

accessibility-answer-input-short-description-or-label = Af hensyn til tilgængeligheden skal et `<answer>`, der opretter et inputfelt, have en kort beskrivelse eller en mærkat.

accessibility-short-description-contains-math = Korte beskrivelser bør ikke indeholde matematiske komponenter som `<{ $component }>`. Skriv matematikken med ord.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } har utilstrækkelig kontrast til afsnitsoverskriftens tekst (mørk tilstand) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kræver mindst { $threshold }:1).
       *[other] { $colorName } har utilstrækkelig kontrast til afsnitsoverskriftens tekst ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kræver mindst { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` gennem { $count } punkter er ikke implementeret i det tilfælde, hvor punkterne ikke har numeriske værdier.

circle-too-many-through-points = Kan ikke beregne en cirkel gennem mere end 3 punkter.

circle-overprescribed-radius-center-points = Kan ikke beregne en cirkel med angivet radius, centrum og punkter.

circle-center-with-multiple-points = Kan ikke beregne en cirkel med angivet centrum gennem mere end 1 punkt.

circle-radius-too-small = Kan ikke beregne cirklen: da afstanden mellem de to punkter er { $distance }, er den angivne radius { $radius } for lille.

circle-radius-with-many-points = Kan ikke oprette en cirkel gennem mere end to punkter med en angivet radius.

circle-invalid-center-or-through-points = Ugyldigt centrum eller ugyldige punkter for cirklen.

circle-radius-center-with-multiple-points = Kan ikke beregne radius for en cirkel med angivet centrum gennem mere end 1 punkt.

circle-change-radius-non-numerical = Kan ikke ændre radius for en cirkel med ikke-numeriske punkter

circle-radius-with-points-non-numerical = Kan ikke oprette en cirkel gennem mere end ét punkt med angivet radius, når der ikke er numeriske værdier.

circle-change-center-non-numerical = At ændre centrum for en cirkel gennem punkter med ikke-numeriske værdier er ikke implementeret.

## `<function>`

# «input» is invariant in the plural but «interval» is not, so this message
# selects on the interval count and leaves the input count plain.
function-domain-insufficient-dimensions =
    Utilstrækkeligt antal dimensioner for funktionens definitionsmængde. Mængden har { $intervals ->
        [one] { $intervals } interval
       *[other] { $intervals } intervaller
    }, men funktionen har { $inputs } input.

function-domain-invalid-format = Ugyldigt format for funktionens definitionsmængde.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ikke-numerisk maksimum for funktionen ignoreres.
        [minimum] Ikke-numerisk minimum for funktionen ignoreres.
        [extremum] Ikke-numerisk ekstremum for funktionen ignoreres.
        [point] Ikke-numerisk punkt for funktionen ignoreres.
        [slope] Ikke-numerisk hældning for funktionen ignoreres.
       *[other] Ikke-numerisk { $type } for funktionen ignoreres.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Tomt maksimum for funktionen ignoreres.
        [minimum] Tomt minimum for funktionen ignoreres.
        [extremum] Tomt ekstremum for funktionen ignoreres.
        [point] Tomt punkt for funktionen ignoreres.
       *[other] Tomt { $type } for funktionen ignoreres.
    }

function-points-too-close = Funktionen indeholder to punkter, hvis placeringer ligger for tæt på hinanden. Funktionen kan ikke defineres.

function-iterates-input-output-mismatch = Funktionsiterationer er kun mulige, hvis antallet af input er lig med antallet af output. Denne funktion har { $inputs } input og { $outputs } output.

## `<sequence>`

sequence-invalid-length = Ugyldig længde af følgen.  Skal være et ikke-negativt heltal.

sequence-invalid-step = Ugyldigt skridt i følgen.  Skal være et tal for en følge af typen { $type }.

sequence-invalid-endpoint-number = Ugyldigt »{ $attribute }« i en talfølge.  Skal være et tal.

sequence-invalid-endpoint-letters = Ugyldigt »{ $attribute }« i en bogstavfølge.  Skal være en bogstavkombination.

sequence-invalid-endpoint = Ugyldigt »{ $attribute }« i følgen.

select-from-sequence-coprime-not-numbers = coprime ignoreres, da det ikke er tal, der vælges

select-from-sequence-coprime-with-exclude-combinations = coprime ignoreres, da excludeCombinations er angivet

## Resolving a `target`

target-not-found = Ugyldigt target for `<{ $source }>`: målet kan ikke findes.

target-state-variable-not-found = Ugyldigt target for `<{ $source }>`: finder ingen tilstandsvariabel med navnet »{ $property }« på et `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Variablene i `<odeSystem>` skal være forskellige fra den uafhængige variabel.

ode-system-duplicate-variable-names = Kan ikke definere højresidefunktioner for differentialligningen med gentagne navne på afhængige variable.

ode-system-rhs-function-error = Kan ikke definere højresidefunktionen for differentialligningen.  Fejl ved oprettelse af mathjs-funktionen.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Kan ikke definere en vinkel mellem { $count } linjer

angle-invalid-through-point = Ugyldigt punkt i through på `<angle>`

parabola-vertex-too-many-points = Parabel med toppunkt gennem mere end 1 punkt er ikke implementeret.

parabola-too-many-points = Parabel gennem mere end 3 punkter er ikke implementeret.

intersection-too-many-items = Skæring mellem mere end to objekter er ikke implementeret

## Other math components

ionic-compound-not-two-ions = Ionforbindelse er ikke implementeret for andet end to ioner.

ionic-compound-needs-cation-and-anion = Ionforbindelse er kun implementeret for én kation og én anion.

solve-equations-cannot-evaluate = Kan ikke løse ligningen, da den ikke kunne beregnes: { $equation }

math-operators-operand-number-required = operandNumber skal angives, når en matematisk operand udtrækkes.

eigen-decomposition-failed = Kunne ikke beregne matricens egenværdier

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameteren { $parameters } forekommer ikke i mønsteret, så den matcher altid et tomrum.
       *[other] `<matchesPattern>`: parametrene { $parameters } forekommer ikke i mønsteret, så de matcher altid et tomrum.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: kan ikke fortolke grid="{ $grid }". Det skal være none, medium, dense eller to positive tal adskilt af et mellemrum, for eksempel grid="1 0.5". Der tegnes intet gitter.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" understøttes ikke i prefigure-gengiveren; adfærden for right bruges.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" understøttes ikke i prefigure-gengiveren; adfærden for top bruges.

prefigure-invalid-axis-bounds = `<graph>`: ugyldige aksegrænser til prefigure-konverteringen; standardværdien bbox (-10,-10,10,10) bruges.

prefigure-invalid-width = `<graph>`: ugyldig bredde til prefigure-konverteringen; standardbredden 425 bruges.

prefigure-invalid-aspect-ratio = `<graph>`: ugyldigt aspectRatio til prefigure-konverteringen; standardforholdet 1 bruges.

prefigure-grid-spacing-too-fine = `<graph>`: gitterafstanden er for fin til aksegrænserne; gitteret udelades i prefigure-gengiveren.

prefigure-annotations-not-rendered = `<graph>`: annotationer gengives ikke, når PreFigure-gengiveren ikke bruges.

multiple-annotations-children = Der blev fundet flere `<annotations>`-børn i `<graph>`; alle undtagen det sidste ignoreres.

## Referring to other components

copy-unrecognized-component-type = Kan ikke udvide eller kopiere en ukendt komponenttype: { $type }.

copy-prop-not-found = Fandt ikke egenskaben { $property } på en komponent af typen { $component }

collect-no-source = Der blev ikke fundet nogen kilde til collect.

collect-invalid-component-type = Kan ikke indsamle komponenter af typen `<{ $component }>`, da det er en ugyldig komponenttype.

reference-index-unavailable = Kan ikke henvise til indekset `{ $reference }`

## `<callAction>`

component-action-unavailable = Kan ikke kalde { $action } på komponenten `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Data har en ugyldig form.  Rækkerne har forskellig længde. Fundet i componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data har gentagne kolonnenavne.  Fundet i componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data mangler et kolonnenavn.  Fundet i componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Et award for dette svar bygger på answer-taggets eget indsendte svar, hvilket fører til uventet adfærd.

answer-max-num-attempts-in-section-wide-check-work = At sætte `maxNumAttempts` på et `<answer>` inde i en beholder med `sectionWideCheckWork` har ingen virkning, da antallet af forsøg styres af beholderen. Sæt `maxNumAttempts` på beholderen i stedet.

nested-section-wide-check-work-max-num-attempts = At sætte `maxNumAttempts` på en beholder med `sectionWideCheckWork`, der ligger i en anden beholder med `sectionWideCheckWork`, har ingen virkning, da antallet af forsøg styres af den ydre beholder. Sæt `maxNumAttempts` på den ydre beholder i stedet.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Attributten { $attributes } har ingen virkning uden symbolicEquality sat.
       *[other] Attributterne { $attributes } har ingen virkning uden symbolicEquality sat.
    }

answer-invalid-type = Ugyldig type for answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Da komponenten `<{ $component }>` ikke har et navn, kan den ikke bruges som modulattribut

module-attribute-name-already-defined = Komponenten `<{ $component } name="{ $name }">` kan ikke bruges som attribut for et modul, da komponenttypen `<module>` allerede har en attribut »{ $name }«.

conditional-content-condition-ignored = Attributten `condition` ignoreres på en `<conditionalContent>`-komponent med case- eller else-børn.

slider-markers-type-mismatch = Markørernes type passer ikke til skyderens type.

pretzel-problem-needs-statement-and-answer = Ugyldig pretzel: hvert `<problem>` skal indeholde ét `<statement>` og ét `<answer>`.

pretzel-circuit-first-problem-distractor = Ugyldig pretzel: i mode="circuit" må det første `<problem>` ikke være en distraktor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Ugyldig værdi { $values } for attributten `{ $attribute }`; ignoreres.
       *[other] Ugyldige værdier { $values } for attributten `{ $attribute }`; ignoreres.
    }

attribute-must-be-references = Ugyldig værdi `{ $value }` for attributten `{ $attribute }`. Attributten skal bestå af referencer, der begynder med `$`.

math-input-invalid-function-names = <mathInput>: ugyldige funktionsnavne blev ignoreret i { $attribute }: { $names }. Hvert navns visningsdel skal være mindst 2 tegn (bogstaver eller bindestreger); et valgfrit suffiks `|<mathspeak alternative>` kan følge.

## Building components from the source

component-type-invalid = Ugyldig komponenttype: `<{ $componentType }>`

attribute-repeated = Attributten { $attribute } må ikke gentages.

attribute-invalid-for-component = Ugyldig attribut »{ $attribute }« for en komponent af typen `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Stildefinitionen { $styleNumber } har utilstrækkelig kontrast { $context ->
        [text-on-background] mellem tekstfarven og baggrundsfarven
        [high-contrast] mellem højkontrastfarven og lærredet
        [line] mellem linjefarven og lærredet
        [marker] mellem markørfarven og lærredet
       *[text-on-canvas] mellem tekstfarven og lærredet
    }{ $mode ->
        [dark] { " (mørk tilstand)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kræver mindst { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Selvom stildefinitionen { $styleNumber } angiver farver med tilstrækkelig kontrast i lys tilstand, har de mørketilstandsfarver, der udledes af disse værdier, utilstrækkelig kontrast mellem tekstfarven og baggrundsfarven ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kræver mindst { $threshold }:1). { $suggestion ->
        [available] For tilstrækkelig kontrast i mørk tilstand kan du enten øge kontrasten i lys tilstand (f.eks. sætte { $lightAttribute }="{ $lightColor }") eller tilsidesætte mørketilstandsfarven (f.eks. sætte { $darkAttribute }="{ $darkColor }").
       *[none] For tilstrækkelig kontrast i mørk tilstand skal du øge kontrasten i lys tilstand eller tilsidesætte de udledte farver med textColorDarkMode og/eller backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Selvom stildefinitionen { $styleNumber } angiver en tekstfarve med tilstrækkelig kontrast i lys tilstand, har den mørketilstandstekstfarve, der udledes af denne værdi, utilstrækkelig kontrast mod lærredet ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kræver mindst { $threshold }:1). { $suggestion ->
        [available] For tilstrækkelig kontrast i mørk tilstand kan du enten øge kontrasten i lys tilstand (f.eks. sætte textColor="{ $lightColor }") eller tilsidesætte mørketilstandsfarven (f.eks. sætte textColorDarkMode="{ $darkColor }").
       *[none] For tilstrækkelig kontrast i mørk tilstand skal du øge kontrasten i lys tilstand eller tilsidesætte den udledte farve med textColorDarkMode.
    }

section-multiple-style-palettes = Et afsnit kan kun vælge én <stylePalette>; den sidste bruges.

## Unique variants

variant-num-to-select-not-non-negative-integer = kan ikke bestemme unikke varianter af { $component }, da numToSelect ikke er et ikke-negativt heltal.

variant-num-to-select-not-constant-number = kan ikke bestemme unikke varianter af { $component }, da numToSelect ikke er et konstant tal.

variant-with-replacement-not-constant-boolean = kan ikke bestemme unikke varianter af { $component }, da withReplacement ikke er en konstant boolesk værdi.

variant-select-weight-disables-unique = Unikke varianter for select slås fra, hvis en mulighed har selectWeight eller selectForVariants angivet

variant-coprime-undetermined = kan ikke bestemme unikke varianter af { $component }, da det ikke kan afgøres, at coprime altid er falsk.

variant-attribute-not-constant = kan ikke bestemme unikke varianter af { $component }, da { $attribute } ikke er en konstant.

variant-attribute-not-number = kan ikke bestemme unikke varianter af { $component }, da { $attribute } ikke er et tal.

variant-attribute-wrong-type-for-sequence =
    kan ikke bestemme unikke varianter af { $component } af typen { $type }, da { $attribute } ikke er { $expected ->
        [letters-combination] en bogstavkombination
        [math-expression] et gyldigt matematisk udtryk
        [integer] et heltal
       *[number] et tal
    }.

variant-length-not-integer = kan ikke bestemme unikke varianter af { $component }, da length ikke er et heltal.

variant-sort-not-implemented = unikke varianter af en { $component } med sort er ikke implementeret

variant-exclude-combinations-not-implemented = unikke varianter af en { $component } med excludeCombinations er ikke implementeret

variant-math-exclude-not-implemented = unikke varianter af en { $component } af typen math med exclude er ikke implementeret

variant-non-constant-exclude-not-implemented = unikke varianter af en { $component } med ikke-konstant exclude er ikke implementeret

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: understøttes ikke i graph prefigure-gengiveren; efterkommeren blev sprunget over.

prefigure-descendant-invalid-geometry = { $subject }: ikke-endelig eller ufuldstændig geometri; efterkommeren blev sprunget over.

prefigure-curve-label-omitted = { $subject }: mærkater understøttes ikke på konverterede kurveelementer; mærkaten blev udeladt.

prefigure-curve-unsupported-definition-type = { $subject }: definitionstypen »{ $definitionType }« for kurven understøttes ikke; efterkommeren blev sprunget over.

prefigure-region-flip-functions-unsupported = { $subject }: attributten flipFunctions på regionBetweenCurves understøttes ikke; efterkommeren blev sprunget over.

prefigure-region-non-formula-child = { $subject }: kun børnefunktioner af formeltype understøttes på regionBetweenCurves; efterkommeren blev sprunget over.

prefigure-label-position-unsupported =
    { $subject }: labelPosition »{ $labelPosition }« understøttes ikke for { $labelKind ->
        [line-family] mærkat på et objekt i linjefamilien
       *[point] punktmærkat
    }; PreFigures standardjustering blev brugt.

prefigure-fill-style-unsupported = { $subject }: udfyldningsstilen »{ $fillStyle }« understøttes ikke af PreFigure; en ensfarvet udfyldning bruges i stedet.

prefigure-line-style-unknown = { $subject }: den ukendte linjestil »{ $lineStyle }« blev udeladt fra PreFigures output.

prefigure-marker-style-mapped-to-diamond = { $subject }: markørstilen »{ $markerStyle }« blev afbildet på PreFigure-stilen »diamond«.

prefigure-marker-style-unsupported = { $subject }: markørstilen »{ $markerStyle }« understøttes ikke af PreFigure; standardstilen blev brugt.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ugyldig `ref`; målet kan ikke bestemmes. Annotationen blev udeladt.

annotation-ref-multiple-targets = `<annotation>`: `ref` udpegede flere mål; det første bruges.

annotation-ref-outside-graph = `<annotation>`: ugyldig `ref`; målet ligger uden for den omgivende graf. Annotationen blev udeladt.

annotation-ref-unsupported-target = `<annotation>`: ugyldig `ref`; målet er ikke et understøttet grafisk objekt i prefigure-konverteringen. Annotationen blev udeladt.

annotation-text-missing = `<annotation>`: `text` mangler eller er tom; der udskrives tom tekst.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Der blev fundet en cirkulær afhængighed.
       *[other] Der blev fundet en cirkulær afhængighed, der involverer en `<{ $componentType }>`-komponent.
    }

reference-no-referent = Der blev ikke fundet nogen referent for referencen: `{ $reference }`

reference-multiple-referents = Der blev fundet flere referenter for referencen: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ugyldigt format for attributten { $attribute } på `<{ $componentType }>`.

children-invalid = Ugyldige børn for `<{ $componentType }>`: fandt ugyldige børn: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ugyldig værdi `{ $value }` for attributten `{ $attribute }`, bruger værdien `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML-versionen { $version } blev ikke fundet.
       *[other] DoenetML-versionen { $version } blev ikke fundet. Bruger version { $fallback } i stedet
    }

## Reading the DoenetML

parse-invalid-doenetml = Ugyldig DoenetML: { $content }

parse-tag-missing-close-tag = Ugyldig DoenetML: Tagget `{ $tag }` har intet sluttag. Forventede et selvlukkende tag eller et `</{ $tagName }>`-tag.

parse-tag-error = Ugyldig DoenetML: Fejl i tagget `<{ $tagName }>`

parse-attribute-missing-value = Ugyldig DoenetML: Den ugyldige attribut `{ $attribute }` ser ud til at mangle en værdi.

parse-attribute-invalid = Ugyldig DoenetML: Ugyldig attribut `{ $attribute }`

parse-attribute-value-invalid = Ugyldig DoenetML: Ugyldig attributværdi `{ $value }`

parse-attribute-value-quote-mismatch = Ugyldig DoenetML: Ugyldig attributværdi `{ $value }`. Anførselstegnene passer ikke sammen. Der ser ud til at mangle et `{ $quote }`

parse-open-tag-name-missing = Ugyldig DoenetML: Fandt et tag uden tagnavn, f.eks. `<`

parse-tag-not-closed = Ugyldig DoenetML: Tagget `{ $tag }` blev ikke lukket (et `>` ser ud til at mangle).

parse-self-closing-tag-name-missing = Ugyldig DoenetML: Fandt et tag uden tagnavn `<{ $content }>`

parse-self-closing-tag-not-closed = Ugyldig DoenetML: Tagget `{ $tag }` blev ikke lukket (`/>` ser ud til at mangle).

parse-tag-invalid-attributes = Ugyldig DoenetML: Tagget `{ $tag }` er ikke gyldigt. Det kan have forkerte attributter.

parse-close-tag-name-missing = Ugyldig DoenetML: Fandt et sluttag uden tagnavn, f.eks. `</`

parse-attribute-value-unquoted = Attributværdier skal stå i anførselstegn: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Ugyldig DoenetML: Fandt sluttagget `{ $tag }`, men intet tilsvarende starttag

parse-close-tag-mismatched = Ugyldig DoenetML: Sluttagget passer ikke. Forventede `</{ $expected }>`. Fandt `{ $found }`

parser-node-unconvertible = Kunne ikke konvertere knuden { $node } til en Dast-knude.

## Names

name-attribute-invalid =
    Ugyldig attribut name='{ $name }'. { $reason ->
        [characters] Navne må kun indeholde bogstaver, tal, understregninger eller bindestreger.
       *[start] Navne skal begynde med et bogstav.
    }

component-name-invalid-start = Ugyldigt komponentnavn »{ $name }«. Navne skal begynde med et bogstav.

## `<answer>` sugar

answer-video-watched-missing-video = Et answer med type videoWatched skal have en video-attribut

answer-video-watched-video-not-reference = Et answer med type videoWatched skal have en video-attribut, der er en reference

answer-name-not-single-text = Et answers name-attribut skal have præcis ét tekstbarn

## Referencing another document

external-doenetml-recursion-limit = Kunne ikke hente ekstern DoenetML på grund af for mange rekursionsniveauer. Er der en cirkulær reference?

external-doenetml-unavailable = Kunne ikke hente DoenetML fra { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Der blev hentet ugyldig DoenetML fra { $attribute }="{ $uri }": den passede ikke til komponenttypen »{ $componentType }«

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Attributten `{ $from }` er forældet; brug `{ $to }` i stedet.
       *[other] [deprecation] Attributten `{ $from }` på `<{ $component }>` er forældet; brug `{ $to }` i stedet.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Attributten `{ $from }` er forældet og ignoreres, fordi `{ $to }` også er angivet.
       *[other] [deprecation] Attributten `{ $from }` på `<{ $component }>` er forældet og ignoreres, fordi `{ $to }` også er angivet.
    }

deprecated-attribute-ignored = [deprecation] Attributten `{ $attribute }` på `<{ $component }>` er forældet og ignoreres.


## Language coverage

pluralize-english-only = `<pluralize>` kan kun danne flertal på engelsk, så i et dokument skrevet på { $locale } står teksten uændret. Skriv flertalsformen direkte, eller angiv den med attributten `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elementet `<{ $tag }>` er ikke et kendt Doenet-element.

schema-element-not-allowed-at-root = Elementet `<{ $tag }>` er ikke tilladt i dokumentets rod.

schema-element-not-allowed-inside = Elementet `<{ $tag }>` er ikke tilladt inde i `<{ $parent }>`.

schema-attribute-unrecognized = Elementet `<{ $tag }>` har ingen attribut, der hedder `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Attributten `{ $attribute }` på elementet `<{ $tag }>` skal være en liste, hvor hvert element er et af: { $allowed }
       *[other] Attributten `{ $attribute }` på elementet `<{ $tag }>` skal være et af: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Ugyldigt variantnavn for select.  Variantnavnet { $variantName } forekommer i { $numOptions } muligheder, men antallet, der skal vælges, er { $numToSelect }.

select-variant-name-without-options = Der er angivet varianter for select, men ingen muligheder for det mulige variantnavn: { $variantName }.

select-variant-name-not-possible = Variantnavnet { $variantName }, der er angivet for select, er ikke et muligt variantnavn.

select-too-few-options = Kan ikke vælge { $numToSelect } komponenter ud af kun { $numOptions }.

select-from-sequence-too-few-values = Kan ikke vælge { $numToSelect } værdier fra en følge af længden { $length }.

select-from-sequence-indices-count-mismatch = Antallet af indeks angivet for select skal svare til antallet, der skal vælges

select-from-sequence-indices-not-integers = Alle indeks angivet for select skal være heltal

select-from-sequence-index-excluded = Det indeks, der blev angivet for selectfromsequence, var udelukket

select-from-sequence-indices-excluded-combination = De indeks, der blev angivet for selectfromsequence, udgjorde en udelukket kombination

select-from-sequence-coprime-not-positive-integers = Kan ikke vælge indbyrdes primiske kombinationer, da det ikke er positive heltal, der vælges.

select-from-sequence-coprime-common-factor = Kan ikke vælge indbyrdes primiske tal. Alle mulige værdier har en fælles faktor. (De angivne værdier for "from" eller "to" skal være indbyrdes primiske med "step".)

select-from-sequence-coprime-single-number = Kan ikke vælge indbyrdes primiske kombinationer fra ét enkelt tal, der ikke er 1.

select-from-sequence-excluded-too-many-combinations = Over 70 % af kombinationerne blev udelukket i selectFromSequence

select-from-sequence-coprime-none-found = Kunne ikke vælge indbyrdes primiske tal. Alle mulige værdier har en fælles faktor.

select-from-sequence-too-few-unique-values = Kan ikke vælge { $numToSelect } unikke værdier fra en følge af længden { $numPossibleValues }

select-prime-numbers-too-few-values = Kan ikke vælge { $numToSelect } værdier fra en liste med primtal af længden { $numValues }

select-prime-numbers-values-count-mismatch = Antallet af værdier angivet for select skal svare til antallet, der skal vælges

select-prime-numbers-values-not-prime = Alle værdier angivet til valg af primtal skal findes i listen med primtal

select-prime-numbers-values-excluded-combination = De værdier, der blev angivet for selectPrimeNumbers, udgjorde en udelukket kombination

select-prime-numbers-excluded-too-many-combinations = Over 70 % af kombinationerne blev udelukket i selectPrimeNumbers

select-random-combination-fluke = Ved et yderst usandsynligt tilfælde lykkedes det ikke at vælge en kombination af tilfældige værdier

select-random-value-fluke = Ved et yderst usandsynligt tilfælde lykkedes det ikke at vælge en tilfældig værdi
