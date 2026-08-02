# Swedish diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } ignoreras när två ändpunkter anges
       *[other] { $attributes } ignoreras när två ändpunkter anges
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } ignoreras när både en ändpunkt och en mittpunkt anges
       *[other] { $attributes } ignoreras när både en ändpunkt och en mittpunkt anges
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset har ingen verkan utan midpoint

## `<line>`

line-points-undetermined-dimensions = Linje genom punkter med obestämt antal dimensioner.

line-points-too-few-dimensions = Linjen måste gå genom punkter med minst två dimensioner.

line-points-depend-on-variables = Linjen går genom punkter som beror på variabler: { $variables }.

line-equation-invalid-format = Ogiltigt format för linjens ekvation i variablerna { $variable1 } och { $variable2 }.

## `<ray>`

ray-overprescribed-through = Strålen är bestämd av through, endpoint och direction.  Angivet through ignoreras.

ray-dimension-mismatch = numDimensions stämmer inte i strålen.

## `<vector>`

vector-overprescribed-head = Vektorn är bestämd av head, tail och displacement.  Angivet head ignoreras.

vector-dimension-mismatch = numDimensions stämmer inte i vektorn.

## Attracting and constraining

attract-to-without-nearest-point = Kan inte dras mot `<{ $component }>` eftersom den saknar tillståndsvariabeln nearestPoint.

constrain-to-without-nearest-point = Kan inte begränsas till `<{ $component }>` eftersom den saknar tillståndsvariabeln nearestPoint.

constrain-to-interior-without-nearest-point = Kan inte begränsas till det inre av `<{ $component }>` eftersom den saknar tillståndsvariabeln nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ignoreras för choiceInput som inte är inline

## Ordering children by index

choice-input-indices-count-mismatch = Index som angetts för choiceInput ignoreras eftersom antalet inte stämmer med antalet choice-barn.

pretzel-indices-count-mismatch = Index som angetts för problem ignoreras eftersom antalet inte stämmer med antalet problem-barn.

shuffle-indices-count-mismatch = Index som angetts för shuffle ignoreras eftersom antalet inte stämmer med antalet komponenter.

indices-ignored-out-of-range = Index som angetts för { $component } ignoreras eftersom några ligger utanför intervallet.

pretzel-indices-repeated = Index som angetts för pretzel ignoreras eftersom några upprepas.

pretzel-circuit-first-index = Index som angetts för pretzel i läget circuit ignoreras eftersom det första indexet måste vara 1.

## `<shuffle>` and `<sort>`

string-children-need-type = För att `<{ $component }>` ska fungera med strängbarn måste attributet `type` anges.

invalid-type-defaulting-to-math = Ogiltig type { $type } för komponenten { $component }. Måste vara en av math, text, number eller boolean. Använder math.

string-not-valid-component-to-arrange = Strängen ”{ $value }” är inte en giltig komponent för { $component }. Ignoreras.

## Types and variables

invalid-type-defaulting-to-number = Ogiltig type { $type }, type sätts till number.

invalid-variable-value = Ogiltigt värde för en variabel: `{ $value }`

## Variants

variant-index-must-be-number = Variantindexet { $index } måste vara ett tal

variant-index-must-be-integer = Variantindexet { $index } måste vara ett heltal

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` är inte implementerad för absoluta mått. Bredderna sätts till relativa.

side-by-side-absolute-margins = `<{ $component }>` är inte implementerad för absoluta mått. Marginalerna sätts till relativa.

side-by-side-no-block-child = Ogiltig `<{ $component }>`: den måste ha minst ett blockbarn.

## `<label>`

label-for-ignored-on-graphical = Attributet `for` på en grafisk `<label>` ignoreras.

label-for-must-resolve-to-one = Attributet `for` på `<label>` måste peka ut exakt en komponent.

label-for-unresolved = Attributet `for` på `<label>` kunde inte kopplas till någon komponent.

label-for-answer-with-authored-inputs = Attributet `for` på `<label>` refererar till en `<answer>` med uttryckligen skrivna inmatningar; referera direkt till inmatningen.

label-for-answer-without-input = Attributet `for` på `<label>` refererar till en `<answer>` utan någon inmatning att märka.

label-for-must-reference-input-or-answer = Attributet `for` på `<label>` måste referera till en inmatning eller till en answer.

## Accessibility

accessibility-short-description-or-decorative = Av tillgänglighetsskäl måste `<{ $component }>` antingen ha en kort beskrivning eller anges som dekorativ.

accessibility-video-short-description = Av tillgänglighetsskäl måste `<video>` ha en kort beskrivning.

accessibility-input-short-description-or-label = Av tillgänglighetsskäl måste `<{ $component }>` ha en kort beskrivning eller en etikett.

accessibility-answer-input-short-description-or-label = Av tillgänglighetsskäl måste en `<answer>` som skapar en inmatning ha en kort beskrivning eller en etikett.

accessibility-short-description-contains-math = Korta beskrivningar bör inte innehålla matematiska komponenter som `<{ $component }>`. Skriv ut matematiken med ord.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } har otillräcklig kontrast för avsnittsrubrikens text (mörkt läge) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kräver minst { $threshold }:1).
       *[other] { $colorName } har otillräcklig kontrast för avsnittsrubrikens text ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kräver minst { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` genom { $count } punkter är inte implementerad för fallet då punkterna saknar numeriska värden.

circle-too-many-through-points = Kan inte beräkna en cirkel genom fler än 3 punkter.

circle-overprescribed-radius-center-points = Kan inte beräkna en cirkel med angiven radie, medelpunkt och punkter.

circle-center-with-multiple-points = Kan inte beräkna en cirkel med angiven medelpunkt genom fler än 1 punkt.

circle-radius-too-small = Kan inte beräkna cirkeln: eftersom avståndet mellan de två punkterna är { $distance } är den angivna radien { $radius } för liten.

circle-radius-with-many-points = Kan inte skapa en cirkel genom fler än två punkter med angiven radie.

circle-invalid-center-or-through-points = Ogiltig medelpunkt eller ogiltiga punkter för cirkeln.

circle-radius-center-with-multiple-points = Kan inte beräkna radien för en cirkel med angiven medelpunkt genom fler än 1 punkt.

circle-change-radius-non-numerical = Kan inte ändra radien för en cirkel med icke-numeriska punkter

circle-radius-with-points-non-numerical = Kan inte skapa en cirkel genom fler än en punkt med angiven radie när numeriska värden saknas.

circle-change-center-non-numerical = Att ändra medelpunkt för en cirkel genom punkter med icke-numeriska värden är inte implementerat.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Otillräckligt antal dimensioner för funktionens definitionsmängd. Mängden har { $intervals } intervall men funktionen har { $inputs ->
            [one] { $inputs } indata
           *[other] { $inputs } indata
        }.
       *[other] Otillräckligt antal dimensioner för funktionens definitionsmängd. Mängden har { $intervals } intervall men funktionen har { $inputs ->
            [one] { $inputs } indata
           *[other] { $inputs } indata
        }.
    }

function-domain-invalid-format = Ogiltigt format för funktionens definitionsmängd.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Icke-numeriskt maximum för funktionen ignoreras.
        [minimum] Icke-numeriskt minimum för funktionen ignoreras.
        [extremum] Icke-numeriskt extremvärde för funktionen ignoreras.
        [point] Icke-numerisk punkt för funktionen ignoreras.
        [slope] Icke-numerisk lutning för funktionen ignoreras.
       *[other] Icke-numeriskt { $type } för funktionen ignoreras.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Tomt maximum för funktionen ignoreras.
        [minimum] Tomt minimum för funktionen ignoreras.
        [extremum] Tomt extremvärde för funktionen ignoreras.
        [point] Tom punkt för funktionen ignoreras.
       *[other] Tomt { $type } för funktionen ignoreras.
    }

function-points-too-close = Funktionen innehåller två punkter vars lägen ligger för nära varandra. Funktionen kan inte definieras.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Funktionsiterationer är möjliga endast om antalet indata är lika med antalet utdata. Denna funktion har { $inputs } indata och { $outputs } utdata.
       *[other] Funktionsiterationer är möjliga endast om antalet indata är lika med antalet utdata. Denna funktion har { $inputs } indata och { $outputs } utdata.
    }

## `<sequence>`

sequence-invalid-length = Ogiltig längd på följden.  Måste vara ett icke-negativt heltal.

sequence-invalid-step = Ogiltigt steg i följden.  Måste vara ett tal för en följd av typen { $type }.

sequence-invalid-endpoint-number = Ogiltigt ”{ $attribute }” i en talföljd.  Måste vara ett tal.

sequence-invalid-endpoint-letters = Ogiltigt ”{ $attribute }” i en bokstavsföljd.  Måste vara en bokstavskombination.

sequence-invalid-endpoint = Ogiltigt ”{ $attribute }” i följden.

select-from-sequence-coprime-not-numbers = coprime ignoreras eftersom det inte är tal som väljs

select-from-sequence-coprime-with-exclude-combinations = coprime ignoreras eftersom excludeCombinations är angivet

## Resolving a `target`

target-not-found = Ogiltigt target för `<{ $source }>`: målet kan inte hittas.

target-state-variable-not-found = Ogiltigt target för `<{ $source }>`: hittar ingen tillståndsvariabel med namnet ”{ $property }” på en `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Variablerna i `<odeSystem>` måste skilja sig från den oberoende variabeln.

ode-system-duplicate-variable-names = Kan inte definiera högerledsfunktioner för ODE med upprepade namn på beroende variabler.

ode-system-rhs-function-error = Kan inte definiera högerledsfunktionen för ODE.  Fel vid skapandet av mathjs-funktionen.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Kan inte definiera en vinkel mellan { $count } linjer

angle-invalid-through-point = Ogiltig punkt i through på `<angle>`

parabola-vertex-too-many-points = Parabel med vertex genom fler än 1 punkt är inte implementerad.

parabola-too-many-points = Parabel genom fler än 3 punkter är inte implementerad.

intersection-too-many-items = Skärning mellan fler än två objekt är inte implementerad

## Other math components

ionic-compound-not-two-ions = Jonförening är inte implementerad för något annat än två joner.

ionic-compound-needs-cation-and-anion = Jonförening är implementerad endast för en katjon och en anjon.

solve-equations-cannot-evaluate = Kan inte lösa ekvationen eftersom den inte kunde beräknas: { $equation }

math-operators-operand-number-required = operandNumber måste anges när en matematisk operand plockas ut.

eigen-decomposition-failed = Kunde inte beräkna matrisens egenvärden

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parametern { $parameters } förekommer inte i mönstret, så den matchar alltid ett tomrum.
       *[other] `<matchesPattern>`: parametrarna { $parameters } förekommer inte i mönstret, så de matchar alltid ett tomrum.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: kan inte tolka grid="{ $grid }". Det måste vara none, medium, dense eller två positiva tal åtskilda av ett mellanslag, till exempel grid="1 0.5". Inget rutnät ritas.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" stöds inte i renderaren prefigure; beteendet för right används.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" stöds inte i renderaren prefigure; beteendet för top används.

prefigure-invalid-axis-bounds = `<graph>`: ogiltiga axelgränser för prefigure-konverteringen; standardvärdet bbox (-10,-10,10,10) används.

prefigure-invalid-width = `<graph>`: ogiltig bredd för prefigure-konverteringen; standardbredden 425 används.

prefigure-invalid-aspect-ratio = `<graph>`: ogiltigt aspectRatio för prefigure-konverteringen; standardförhållandet 1 används.

prefigure-grid-spacing-too-fine = `<graph>`: rutnätets avstånd är för fint för axelgränserna; rutnätet utelämnas i renderaren prefigure.

prefigure-annotations-not-rendered = `<graph>`: anteckningar ritas inte när renderaren PreFigure inte används.

multiple-annotations-children = Flera `<annotations>`-barn hittades i `<graph>`; alla utom det sista ignoreras.

## Referring to other components

copy-unrecognized-component-type = Kan inte utöka eller kopiera en okänd komponenttyp: { $type }.

copy-prop-not-found = Hittade inte egenskapen { $property } på en komponent av typen { $component }

collect-no-source = Ingen källa hittades för collect.

collect-invalid-component-type = Kan inte samla komponenter av typen `<{ $component }>` eftersom det är en ogiltig komponenttyp.

reference-index-unavailable = Kan inte referera till indexet `{ $reference }`

## `<callAction>`

component-action-unavailable = Kan inte anropa { $action } på komponenten `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Data har ogiltig form.  Raderna har olika längd. Hittades i componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data har upprepade kolumnnamn.  Hittades i componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data saknar ett kolumnnamn.  Hittades i componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = En award för detta svar bygger på answer-taggens eget inskickade svar, vilket leder till oväntat beteende.

answer-max-num-attempts-in-section-wide-check-work = Att sätta `maxNumAttempts` på en `<answer>` inuti en behållare med `sectionWideCheckWork` har ingen verkan, eftersom antalet försök styrs av behållaren. Sätt `maxNumAttempts` på behållaren i stället.

nested-section-wide-check-work-max-num-attempts = Att sätta `maxNumAttempts` på en behållare med `sectionWideCheckWork` som ligger i en annan behållare med `sectionWideCheckWork` har ingen verkan, eftersom antalet försök styrs av den yttre behållaren. Sätt `maxNumAttempts` på den yttre behållaren i stället.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Attributet { $attributes } har ingen verkan utan symbolicEquality satt.
       *[other] Attributen { $attributes } har ingen verkan utan symbolicEquality satt.
    }

answer-invalid-type = Ogiltig typ för answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Eftersom komponenten `<{ $component }>` saknar namn kan den inte användas som modulattribut

module-attribute-name-already-defined = Komponenten `<{ $component } name="{ $name }">` kan inte användas som attribut för en modul eftersom komponenttypen `<module>` redan har ett attribut ”{ $name }”.

conditional-content-condition-ignored = Attributet `condition` ignoreras på en `<conditionalContent>`-komponent med case- eller else-barn.

slider-markers-type-mismatch = Markörernas typ stämmer inte med reglagets typ.

pretzel-problem-needs-statement-and-answer = Ogiltig pretzel: varje `<problem>` måste innehålla ett `<statement>` och ett `<answer>`.

pretzel-circuit-first-problem-distractor = Ogiltig pretzel: i mode="circuit" får det första `<problem>` inte vara en distraktor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Ogiltigt värde { $values } för attributet `{ $attribute }`; ignoreras.
       *[other] Ogiltiga värden { $values } för attributet `{ $attribute }`; ignoreras.
    }

attribute-must-be-references = Ogiltigt värde `{ $value }` för attributet `{ $attribute }`. Attributet måste bestå av referenser som börjar med `$`.

math-input-invalid-function-names = <mathInput>: ogiltiga funktionsnamn ignorerades i { $attribute }: { $names }. Varje namns visningsdel måste vara minst 2 tecken (bokstäver eller bindestreck); ett valfritt suffix `|<mathspeak alternative>` får följa.

## Building components from the source

component-type-invalid = Ogiltig komponenttyp: `<{ $componentType }>`

attribute-repeated = Attributet { $attribute } får inte upprepas.

attribute-invalid-for-component = Ogiltigt attribut ”{ $attribute }” för en komponent av typen `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Stildefinitionen { $styleNumber } har otillräcklig kontrast { $context ->
        [text-on-background] mellan textfärgen och bakgrundsfärgen
        [high-contrast] mellan högkontrastfärgen och arbetsytan
        [line] mellan linjefärgen och arbetsytan
        [marker] mellan markörfärgen och arbetsytan
       *[text-on-canvas] mellan textfärgen och arbetsytan
    }{ $mode ->
        [dark] { " (mörkt läge)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kräver minst { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Även om stildefinitionen { $styleNumber } anger färger med tillräcklig kontrast för ljust läge har de mörkerlägesfärger som härleds ur dessa värden otillräcklig kontrast mellan textfärgen och bakgrundsfärgen ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kräver minst { $threshold }:1). { $suggestion ->
        [available] För tillräcklig kontrast i mörkt läge kan du antingen öka kontrasten i ljust läge (t.ex. sätta { $lightAttribute }="{ $lightColor }") eller åsidosätta mörkerlägesfärgen (t.ex. sätta { $darkAttribute }="{ $darkColor }").
       *[none] För tillräcklig kontrast i mörkt läge, öka kontrasten i ljust läge eller åsidosätt de härledda färgerna med textColorDarkMode och/eller backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Även om stildefinitionen { $styleNumber } anger en textfärg med tillräcklig kontrast för ljust läge har den mörkerlägestextfärg som härleds ur detta värde otillräcklig kontrast mot arbetsytan ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kräver minst { $threshold }:1). { $suggestion ->
        [available] För tillräcklig kontrast i mörkt läge kan du antingen öka kontrasten i ljust läge (t.ex. sätta textColor="{ $lightColor }") eller åsidosätta mörkerlägesfärgen (t.ex. sätta textColorDarkMode="{ $darkColor }").
       *[none] För tillräcklig kontrast i mörkt läge, öka kontrasten i ljust läge eller åsidosätt den härledda färgen med textColorDarkMode.
    }

section-multiple-style-palettes = Ett avsnitt kan välja endast en <stylePalette>; den sista används.

## Unique variants

variant-num-to-select-not-non-negative-integer = kan inte bestämma unika varianter av { $component } eftersom numToSelect inte är ett icke-negativt heltal.

variant-num-to-select-not-constant-number = kan inte bestämma unika varianter av { $component } eftersom numToSelect inte är ett konstant tal.

variant-with-replacement-not-constant-boolean = kan inte bestämma unika varianter av { $component } eftersom withReplacement inte är ett konstant booleskt värde.

variant-select-weight-disables-unique = Unika varianter för select stängs av om något alternativ har selectWeight eller selectForVariants angivet

variant-coprime-undetermined = kan inte bestämma unika varianter av { $component } eftersom det inte går att avgöra att coprime alltid är falskt.

variant-attribute-not-constant = kan inte bestämma unika varianter av { $component } eftersom { $attribute } inte är en konstant.

variant-attribute-not-number = kan inte bestämma unika varianter av { $component } eftersom { $attribute } inte är ett tal.

variant-attribute-wrong-type-for-sequence =
    kan inte bestämma unika varianter av { $component } av typen { $type } eftersom { $attribute } inte är { $expected ->
        [letters-combination] en bokstavskombination
        [math-expression] ett giltigt matematiskt uttryck
        [integer] ett heltal
       *[number] ett tal
    }.

variant-length-not-integer = kan inte bestämma unika varianter av { $component } eftersom length inte är ett heltal.

variant-sort-not-implemented = unika varianter av en { $component } med sort är inte implementerade

variant-exclude-combinations-not-implemented = unika varianter av en { $component } med excludeCombinations är inte implementerade

variant-math-exclude-not-implemented = unika varianter av en { $component } av typen math med exclude är inte implementerade

variant-non-constant-exclude-not-implemented = unika varianter av en { $component } med icke-konstant exclude är inte implementerade

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: stöds inte i renderaren graph prefigure; ättlingen hoppades över.

prefigure-descendant-invalid-geometry = { $subject }: icke-ändlig eller ofullständig geometri; ättlingen hoppades över.

prefigure-curve-label-omitted = { $subject }: etiketter stöds inte på konverterade kurvelement; etiketten utelämnades.

prefigure-curve-unsupported-definition-type = { $subject }: definitionstypen ”{ $definitionType }” för kurvan stöds inte; ättlingen hoppades över.

prefigure-region-flip-functions-unsupported = { $subject }: attributet flipFunctions på regionBetweenCurves stöds inte; ättlingen hoppades över.

prefigure-region-non-formula-child = { $subject }: endast barnfunktioner av formeltyp stöds på regionBetweenCurves; ättlingen hoppades över.

prefigure-label-position-unsupported =
    { $subject }: labelPosition ”{ $labelPosition }” stöds inte för { $labelKind ->
        [line-family] etikett på ett objekt i linjefamiljen
       *[point] punktetikett
    }; PreFigures standardjustering användes.

prefigure-fill-style-unsupported = { $subject }: fyllningsstilen ”{ $fillStyle }” stöds inte av PreFigure; en heltäckande fyllning används i stället.

prefigure-line-style-unknown = { $subject }: den okända linjestilen ”{ $lineStyle }” utelämnades ur PreFigures utdata.

prefigure-marker-style-mapped-to-diamond = { $subject }: markörstilen ”{ $markerStyle }” avbildades på PreFigure-stilen ”diamond”.

prefigure-marker-style-unsupported = { $subject }: markörstilen ”{ $markerStyle }” stöds inte av PreFigure; standardstilen användes.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ogiltig `ref`; målet kan inte bestämmas. Anteckningen utelämnades.

annotation-ref-multiple-targets = `<annotation>`: `ref` pekade ut flera mål; det första används.

annotation-ref-outside-graph = `<annotation>`: ogiltig `ref`; målet ligger utanför den omslutande grafen. Anteckningen utelämnades.

annotation-ref-unsupported-target = `<annotation>`: ogiltig `ref`; målet är inte ett grafiskt objekt som stöds i prefigure-konverteringen. Anteckningen utelämnades.

annotation-text-missing = `<annotation>`: `text` saknas eller är tom; tom text skrivs ut.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Cirkulärt beroende upptäcktes.
       *[other] Cirkulärt beroende upptäcktes som involverar en `<{ $componentType }>`-komponent.
    }

reference-no-referent = Ingen referent hittades för referensen: `{ $reference }`

reference-multiple-referents = Flera referenter hittades för referensen: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ogiltigt format för attributet { $attribute } på `<{ $componentType }>`.

children-invalid = Ogiltiga barn för `<{ $componentType }>`: hittade ogiltiga barn: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ogiltigt värde `{ $value }` för attributet `{ $attribute }`, använder värdet `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML-versionen { $version } hittades inte.
       *[other] DoenetML-versionen { $version } hittades inte. Använder version { $fallback } i stället
    }

## Reading the DoenetML

parse-invalid-doenetml = Ogiltig DoenetML: { $content }

parse-tag-missing-close-tag = Ogiltig DoenetML: Taggen `{ $tag }` saknar sluttagg. Förväntade en självstängande tagg eller en `</{ $tagName }>`-tagg.

parse-tag-error = Ogiltig DoenetML: Fel i taggen `<{ $tagName }>`

parse-attribute-missing-value = Ogiltig DoenetML: Det ogiltiga attributet `{ $attribute }` verkar sakna ett värde.

parse-attribute-invalid = Ogiltig DoenetML: Ogiltigt attribut `{ $attribute }`

parse-attribute-value-invalid = Ogiltig DoenetML: Ogiltigt attributvärde `{ $value }`

parse-attribute-value-quote-mismatch = Ogiltig DoenetML: Ogiltigt attributvärde `{ $value }`. Citattecknen stämmer inte. Det verkar saknas ett `{ $quote }`

parse-open-tag-name-missing = Ogiltig DoenetML: Hittade en tagg utan taggnamn, t.ex. `<`

parse-tag-not-closed = Ogiltig DoenetML: Taggen `{ $tag }` stängdes inte (ett `>` verkar saknas).

parse-self-closing-tag-name-missing = Ogiltig DoenetML: Hittade en tagg utan taggnamn `<{ $content }>`

parse-self-closing-tag-not-closed = Ogiltig DoenetML: Taggen `{ $tag }` stängdes inte (`/>` verkar saknas).

parse-tag-invalid-attributes = Ogiltig DoenetML: Taggen `{ $tag }` är inte giltig. Den kan ha felaktiga attribut.

parse-close-tag-name-missing = Ogiltig DoenetML: Hittade en sluttagg utan taggnamn, t.ex. `</`

parse-attribute-value-unquoted = Attributvärden måste omges av citattecken: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Ogiltig DoenetML: Hittade sluttaggen `{ $tag }`, men ingen motsvarande starttagg

parse-close-tag-mismatched = Ogiltig DoenetML: Sluttaggen stämmer inte. Förväntade `</{ $expected }>`. Hittade `{ $found }`

parser-node-unconvertible = Kunde inte konvertera noden { $node } till en Dast-nod.

## Names

name-attribute-invalid =
    Ogiltigt attribut name='{ $name }'. { $reason ->
        [characters] Namn får bara innehålla bokstäver, siffror, understreck eller bindestreck.
       *[start] Namn måste börja med en bokstav.
    }

component-name-invalid-start = Ogiltigt komponentnamn ”{ $name }”. Namn måste börja med en bokstav.

## `<answer>` sugar

answer-video-watched-missing-video = En answer med type videoWatched måste ha ett video-attribut

answer-video-watched-video-not-reference = En answer med type videoWatched måste ha ett video-attribut som är en referens

answer-name-not-single-text = En answers name-attribut måste ha exakt ett textbarn

## Referencing another document

external-doenetml-recursion-limit = Kunde inte hämta extern DoenetML på grund av för många rekursionsnivåer. Finns det en cirkulär referens?

external-doenetml-unavailable = Kunde inte hämta DoenetML från { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Ogiltig DoenetML hämtades från { $attribute }="{ $uri }": den stämde inte med komponenttypen ”{ $componentType }”

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Attributet `{ $from }` är föråldrat; använd `{ $to }` i stället.
       *[other] [deprecation] Attributet `{ $from }` på `<{ $component }>` är föråldrat; använd `{ $to }` i stället.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Attributet `{ $from }` är föråldrat och ignoreras eftersom `{ $to }` också är angivet.
       *[other] [deprecation] Attributet `{ $from }` på `<{ $component }>` är föråldrat och ignoreras eftersom `{ $to }` också är angivet.
    }

deprecated-attribute-ignored = [deprecation] Attributet `{ $attribute }` på `<{ $component }>` är föråldrat och ignoreras.


## Language coverage

pluralize-english-only = `<pluralize>` kan bara böja plural på engelska, så i ett dokument skrivet på { $locale } lämnas texten oförändrad. Skriv pluralformen direkt eller ange den med attributet `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elementet `<{ $tag }>` är inte ett känt Doenet-element.

schema-element-not-allowed-at-root = Elementet `<{ $tag }>` är inte tillåtet i dokumentets rot.

schema-element-not-allowed-inside = Elementet `<{ $tag }>` är inte tillåtet inuti `<{ $parent }>`.

schema-attribute-unrecognized = Elementet `<{ $tag }>` har inget attribut som heter `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Attributet `{ $attribute }` på elementet `<{ $tag }>` måste vara en lista där varje element är ett av: { $allowed }
       *[other] Attributet `{ $attribute }` på elementet `<{ $tag }>` måste vara ett av: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Ogiltigt variantnamn för select.  Variantnamnet { $variantName } förekommer i { $numOptions } alternativ men antalet som ska väljas är { $numToSelect }.

select-variant-name-without-options = Varianter är angivna för select men inga alternativ är angivna för det möjliga variantnamnet: { $variantName }.

select-variant-name-not-possible = Variantnamnet { $variantName } som angetts för select är inte ett möjligt variantnamn.

select-too-few-options = Kan inte välja { $numToSelect } komponenter ur endast { $numOptions }.

select-from-sequence-too-few-values = Kan inte välja { $numToSelect } värden ur en följd av längd { $length }.

select-from-sequence-indices-count-mismatch = Antalet index som angetts för select måste stämma med antalet som ska väljas

select-from-sequence-indices-not-integers = Alla index som angetts för select måste vara heltal

select-from-sequence-index-excluded = Det index som angetts för selectfromsequence var uteslutet

select-from-sequence-indices-excluded-combination = De index som angetts för selectfromsequence utgjorde en utesluten kombination

select-from-sequence-coprime-not-positive-integers = Kan inte välja relativt prima kombinationer eftersom det inte är positiva heltal som väljs.

select-from-sequence-coprime-common-factor = Kan inte välja relativt prima tal. Alla möjliga värden har en gemensam faktor. (De angivna värdena för "from" eller "to" måste vara relativt prima med "step".)

select-from-sequence-coprime-single-number = Kan inte välja relativt prima kombinationer ur ett enda tal som inte är 1.

select-from-sequence-excluded-too-many-combinations = Över 70 % av kombinationerna uteslöts i selectFromSequence

select-from-sequence-coprime-none-found = Kunde inte välja relativt prima tal. Alla möjliga värden har en gemensam faktor.

select-from-sequence-too-few-unique-values = Kan inte välja { $numToSelect } unika värden ur en följd av längd { $numPossibleValues }

select-prime-numbers-too-few-values = Kan inte välja { $numToSelect } värden ur en lista med primtal av längd { $numValues }

select-prime-numbers-values-count-mismatch = Antalet värden som angetts för select måste stämma med antalet som ska väljas

select-prime-numbers-values-not-prime = Alla värden som angetts för val av primtal måste finnas i listan med primtal

select-prime-numbers-values-excluded-combination = De värden som angetts för selectPrimeNumbers utgjorde en utesluten kombination

select-prime-numbers-excluded-too-many-combinations = Över 70 % av kombinationerna uteslöts i selectPrimeNumbers

select-random-combination-fluke = Genom en ytterst osannolik slump gick det inte att välja en kombination av slumpvärden

select-random-value-fluke = Genom en ytterst osannolik slump gick det inte att välja ett slumpvärde
