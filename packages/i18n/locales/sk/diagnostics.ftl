# Slovak diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
        [one] { $attributes } sa ignoruje, keď sú zadané dva krajné body
       *[other] { $attributes } sa ignorujú, keď sú zadané dva krajné body
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } sa ignoruje, keď je zadaný krajný bod aj stred
       *[other] { $attributes } sa ignorujú, keď je zadaný krajný bod aj stred
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset nemá bez midpoint žiadny účinok

## `<line>`

line-points-undetermined-dimensions = Priamka prechádza bodmi s neurčeným počtom rozmerov.

line-points-too-few-dimensions = Priamka musí prechádzať bodmi aspoň dvoch rozmerov.

line-points-depend-on-variables = Priamka prechádza bodmi, ktoré závisia od premenných: { $variables }.

line-equation-invalid-format = Neplatný formát rovnice priamky v premenných { $variable1 } a { $variable2 }.

## `<ray>`

ray-overprescribed-through = Polpriamka je zadaná pomocou through, endpoint aj direction.  Zadané through sa ignoruje.

ray-dimension-mismatch = Nesúlad numDimensions v polpriamke.

## `<vector>`

vector-overprescribed-head = Vektor je zadaný pomocou head, tail aj displacement.  Zadané head sa ignoruje.

vector-dimension-mismatch = Nesúlad numDimensions vo vektore.

## Attracting and constraining

attract-to-without-nearest-point = K `<{ $component }>` nemožno priťahovať, pretože nemá stavovú premennú nearestPoint.

constrain-to-without-nearest-point = Na `<{ $component }>` nemožno obmedziť, pretože nemá stavovú premennú nearestPoint.

constrain-to-interior-without-nearest-point = Na vnútro `<{ $component }>` nemožno obmedziť, pretože nemá stavovú premennú nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition sa pri neriadkovom choiceInput ignoruje

## Ordering children by index

choice-input-indices-count-mismatch = Indexy zadané pre choiceInput sa ignorujú, pretože ich počet nezodpovedá počtu potomkov choice.

pretzel-indices-count-mismatch = Indexy zadané pre problem sa ignorujú, pretože ich počet nezodpovedá počtu potomkov problem.

shuffle-indices-count-mismatch = Indexy zadané pre shuffle sa ignorujú, pretože ich počet nezodpovedá počtu komponentov.

indices-ignored-out-of-range = Indexy zadané pre { $component } sa ignorujú, pretože niektoré sú mimo rozsahu.

pretzel-indices-repeated = Indexy zadané pre pretzel sa ignorujú, pretože sa niektoré opakujú.

pretzel-circuit-first-index = Indexy zadané pre pretzel v režime circuit sa ignorujú, pretože prvý index musí byť 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Aby `<{ $component }>` fungoval s reťazcovými potomkami, musí byť zadaný atribút `type`.

invalid-type-defaulting-to-math = Neplatný type { $type } pre komponent { $component }. Musí byť jeden z math, text, number alebo boolean. Použije sa math.

string-not-valid-component-to-arrange = Reťazec „{ $value }“ nie je platný komponent pre { $component }. Ignoruje sa.

## Types and variables

invalid-type-defaulting-to-number = Neplatný type { $type }, type nastavený na number.

invalid-variable-value = Neplatná hodnota premennej: `{ $value }`

## Variants

variant-index-must-be-number = Index variantu { $index } musí byť číslo

variant-index-must-be-integer = Index variantu { $index } musí byť celé číslo

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` nie je implementovaný pre absolútne miery. Šírky nastavené ako relatívne.

side-by-side-absolute-margins = `<{ $component }>` nie je implementovaný pre absolútne miery. Okraje nastavené ako relatívne.

side-by-side-no-block-child = Neplatný `<{ $component }>`: musí mať aspoň jedného blokového potomka.

## `<label>`

label-for-ignored-on-graphical = Atribút `for` pri grafickom `<label>` sa ignoruje.

label-for-must-resolve-to-one = Atribút `for` pri `<label>` musí odkazovať práve na jeden komponent.

label-for-unresolved = Atribút `for` pri `<label>` sa nepodarilo priradiť k žiadnemu komponentu.

label-for-answer-with-authored-inputs = Atribút `for` pri `<label>` odkazuje na `<answer>` s výslovne zapísanými vstupmi; odkazujte priamo na vstup.

label-for-answer-without-input = Atribút `for` pri `<label>` odkazuje na `<answer>`, ktorý nemá vstup na označenie.

label-for-must-reference-input-or-answer = Atribút `for` pri `<label>` musí odkazovať na vstup alebo na answer.

## Accessibility

accessibility-short-description-or-decorative = Kvôli prístupnosti musí mať `<{ $component }>` buď krátky opis, alebo byť označený ako dekoratívny.

accessibility-video-short-description = Kvôli prístupnosti musí mať `<video>` krátky opis.

accessibility-input-short-description-or-label = Kvôli prístupnosti musí mať `<{ $component }>` krátky opis alebo označenie.

accessibility-answer-input-short-description-or-label = Kvôli prístupnosti musí mať `<answer>`, ktorý vytvára vstup, krátky opis alebo označenie.

accessibility-short-description-contains-math = Krátke opisy by nemali obsahovať matematické komponenty ako `<{ $component }>`. Matematiku vypíšte slovami.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } má nedostatočný kontrast pre text nadpisu oddielu (tmavý režim) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vyžaduje sa aspoň { $threshold }:1).
       *[other] { $colorName } má nedostatočný kontrast pre text nadpisu oddielu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vyžaduje sa aspoň { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` prechádzajúca { $count } bodmi nie je implementovaná pre prípad, keď body nemajú číselné hodnoty.

circle-too-many-through-points = Kružnicu nemožno vypočítať pre viac než 3 body.

circle-overprescribed-radius-center-points = Kružnicu nemožno vypočítať so zadaným polomerom, stredom aj bodmi.

circle-center-with-multiple-points = Kružnicu so zadaným stredom nemožno vypočítať pre viac než 1 bod.

circle-radius-too-small = Kružnicu nemožno vypočítať: pri vzdialenosti { $distance } medzi oboma bodmi je zadaný polomer { $radius } príliš malý.

circle-radius-with-many-points = Kružnicu so zadaným polomerom nemožno vytvoriť pre viac než dva body.

circle-invalid-center-or-through-points = Neplatný stred alebo body kružnice.

circle-radius-center-with-multiple-points = Polomer kružnice so zadaným stredom nemožno vypočítať pre viac než 1 bod.

circle-change-radius-non-numerical = Polomer kružnice s nečíselnými bodmi nemožno zmeniť

circle-radius-with-points-non-numerical = Kružnicu so zadaným polomerom nemožno vytvoriť pre viac než jeden bod, keď nie sú k dispozícii číselné hodnoty.

circle-change-center-non-numerical = Zmena stredu kružnice prechádzajúcej bodmi s nečíselnými hodnotami nie je implementovaná.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Nedostatočný počet rozmerov definičného oboru funkcie. Obor má { $intervals } interval, ale funkcia má { $inputs ->
            [one] { $inputs } vstup
            [few] { $inputs } vstupy
           *[other] { $inputs } vstupov
        }.
        [few] Nedostatočný počet rozmerov definičného oboru funkcie. Obor má { $intervals } intervaly, ale funkcia má { $inputs ->
            [one] { $inputs } vstup
            [few] { $inputs } vstupy
           *[other] { $inputs } vstupov
        }.
       *[other] Nedostatočný počet rozmerov definičného oboru funkcie. Obor má { $intervals } intervalov, ale funkcia má { $inputs ->
            [one] { $inputs } vstup
            [few] { $inputs } vstupy
           *[other] { $inputs } vstupov
        }.
    }

function-domain-invalid-format = Neplatný formát definičného oboru funkcie.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Nečíselné maximum funkcie sa ignoruje.
        [minimum] Nečíselné minimum funkcie sa ignoruje.
        [extremum] Nečíselný extrém funkcie sa ignoruje.
        [point] Nečíselný bod funkcie sa ignoruje.
        [slope] Nečíselná smernica funkcie sa ignoruje.
       *[other] Nečíselné { $type } funkcie sa ignoruje.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Prázdne maximum funkcie sa ignoruje.
        [minimum] Prázdne minimum funkcie sa ignoruje.
        [extremum] Prázdny extrém funkcie sa ignoruje.
        [point] Prázdny bod funkcie sa ignoruje.
       *[other] Prázdne { $type } funkcie sa ignoruje.
    }

function-points-too-close = Funkcia obsahuje dva body, ktorých polohy sú príliš blízko pri sebe. Funkciu nemožno definovať.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Iterácie funkcie sú možné, len keď sa počet vstupov rovná počtu výstupov. Táto funkcia má { $inputs } vstup a { $outputs ->
            [one] { $outputs } výstup
            [few] { $outputs } výstupy
           *[other] { $outputs } výstupov
        }.
        [few] Iterácie funkcie sú možné, len keď sa počet vstupov rovná počtu výstupov. Táto funkcia má { $inputs } vstupy a { $outputs ->
            [one] { $outputs } výstup
            [few] { $outputs } výstupy
           *[other] { $outputs } výstupov
        }.
       *[other] Iterácie funkcie sú možné, len keď sa počet vstupov rovná počtu výstupov. Táto funkcia má { $inputs } vstupov a { $outputs ->
            [one] { $outputs } výstup
            [few] { $outputs } výstupy
           *[other] { $outputs } výstupov
        }.
    }

## `<sequence>`

sequence-invalid-length = Neplatná dĺžka postupnosti.  Musí byť nezáporné celé číslo.

sequence-invalid-step = Neplatný krok postupnosti.  Pre postupnosť typu { $type } musí byť číslo.

sequence-invalid-endpoint-number = Neplatné „{ $attribute }“ číselnej postupnosti.  Musí byť číslo.

sequence-invalid-endpoint-letters = Neplatné „{ $attribute }“ písmenovej postupnosti.  Musí byť kombinácia písmen.

sequence-invalid-endpoint = Neplatné „{ $attribute }“ postupnosti.

select-from-sequence-coprime-not-numbers = coprime sa ignoruje, pretože sa nevyberajú čísla

select-from-sequence-coprime-with-exclude-combinations = coprime sa ignoruje, pretože je zadané excludeCombinations

## Resolving a `target`

target-not-found = Neplatný target pre `<{ $source }>`: cieľ nemožno nájsť.

target-state-variable-not-found = Neplatný target pre `<{ $source }>`: na `<{ $component }>` nemožno nájsť stavovú premennú „{ $property }“.

## `<odeSystem>`

ode-system-variables-match-independent = Premenné `<odeSystem>` sa musia líšiť od nezávislej premennej.

ode-system-duplicate-variable-names = Pravé strany ODR nemožno definovať s rovnakými názvami závislých premenných.

ode-system-rhs-function-error = Pravú stranu ODR nemožno definovať.  Chyba pri vytváraní funkcie mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Uhol medzi { $count } priamkami nemožno definovať

angle-invalid-through-point = Neplatný bod v through pri `<angle>`

parabola-vertex-too-many-points = Parabola s vrcholom prechádzajúca viac než 1 bodom nie je implementovaná.

parabola-too-many-points = Parabola prechádzajúca viac než 3 bodmi nie je implementovaná.

intersection-too-many-items = Prienik viac než dvoch objektov nie je implementovaný

## Other math components

ionic-compound-not-two-ions = Iónová zlúčenina je implementovaná len pre dva ióny.

ionic-compound-needs-cation-and-anion = Iónová zlúčenina je implementovaná len pre jeden katión a jeden anión.

solve-equations-cannot-evaluate = Rovnicu nemožno vyriešiť, pretože sa ju nepodarilo vyhodnotiť: { $equation }

math-operators-operand-number-required = Pri vyberaní matematického operandu treba zadať operandNumber.

eigen-decomposition-failed = Vlastné čísla matice sa nepodarilo vypočítať

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameter { $parameters } sa vo vzore nevyskytuje, takže bude vždy zodpovedať prázdnemu miestu.
       *[other] `<matchesPattern>`: parametre { $parameters } sa vo vzore nevyskytujú, takže budú vždy zodpovedať prázdnemu miestu.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: hodnotu grid="{ $grid }" nemožno interpretovať. Musí to byť none, medium, dense alebo dve kladné čísla oddelené medzerou, napríklad grid="1 0.5". Mriežka sa nevykreslí.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" nie je vo vykresľovacom module prefigure podporované; použije sa správanie pre right.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" nie je vo vykresľovacom module prefigure podporované; použije sa správanie pre top.

prefigure-invalid-axis-bounds = `<graph>`: neplatné hranice osí pre prevod na prefigure; použije sa predvolený bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: neplatná šírka pre prevod na prefigure; použije sa predvolená šírka diagramu 425.

prefigure-invalid-aspect-ratio = `<graph>`: neplatný aspectRatio pre prevod na prefigure; použije sa predvolený pomer strán 1.

prefigure-grid-spacing-too-fine = `<graph>`: rozstup mriežky je pre dané hranice osí príliš jemný; vo vykresľovacom module prefigure sa mriežka vynechá.

prefigure-annotations-not-rendered = `<graph>`: anotácie sa nevykreslia, ak sa nepoužíva vykresľovací modul PreFigure.

multiple-annotations-children = V `<graph>` sa našlo viac potomkov `<annotations>`; všetci okrem posledného sa ignorujú.

## Referring to other components

copy-unrecognized-component-type = Neznámy typ komponentu nemožno rozšíriť ani skopírovať: { $type }.

copy-prop-not-found = Na komponente typu { $component } sa nenašla vlastnosť { $property }

collect-no-source = Pre collect sa nenašiel žiadny zdroj.

collect-invalid-component-type = Komponenty typu `<{ $component }>` nemožno zbierať, pretože ide o neplatný typ komponentu.

reference-index-unavailable = Na index `{ $reference }` nemožno odkazovať

## `<callAction>`

component-action-unavailable = Na komponente `{ $reference }` nemožno zavolať { $action }

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Údaje majú neplatný tvar.  Riadky majú nerovnakú dĺžku. Nájdené v componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Údaje obsahujú rovnaké názvy stĺpcov.  Nájdené v componentIdx :{ $componentIdx }

data-frame-missing-column-name = Údajom chýba názov stĺpca.  Nájdené v componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Hodnotenie tejto odpovede vychádza z odoslanej odpovede samotnej značky answer, čo povedie k neočakávanému správaniu.

answer-max-num-attempts-in-section-wide-check-work = Nastavenie `maxNumAttempts` na `<answer>` vnútri kontajnera s `sectionWideCheckWork` nemá žiadny účinok, pretože počet pokusov riadi kontajner. Nastavte `maxNumAttempts` na kontajneri.

nested-section-wide-check-work-max-num-attempts = Nastavenie `maxNumAttempts` na kontajneri s `sectionWideCheckWork`, ktorý je vnútri iného kontajnera s `sectionWideCheckWork`, nemá žiadny účinok, pretože počet pokusov riadi vonkajší kontajner. Nastavte `maxNumAttempts` na vonkajšom kontajneri.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Atribút { $attributes } nebude mať bez nastaveného symbolicEquality žiadny účinok.
       *[other] Atribúty { $attributes } nebudú mať bez nastaveného symbolicEquality žiadny účinok.
    }

answer-invalid-type = Neplatný typ pre answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Keďže komponent `<{ $component }>` nemá meno, nemožno ho použiť ako atribút modulu

module-attribute-name-already-defined = Komponent `<{ $component } name="{ $name }">` nemožno použiť ako atribút modulu, pretože typ komponentu `<module>` už atribút „{ $name }“ definuje.

conditional-content-condition-ignored = Atribút `condition` sa pri komponente `<conditionalContent>` s potomkami case alebo else ignoruje.

slider-markers-type-mismatch = Typ značiek nezodpovedá typu posuvníka.

pretzel-problem-needs-statement-and-answer = Neplatný pretzel: každý `<problem>` musí obsahovať jeden `<statement>` a jeden `<answer>`.

pretzel-circuit-first-problem-distractor = Neplatný pretzel: v mode="circuit" nesmie byť prvý `<problem>` distraktor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Neplatná hodnota { $values } atribútu `{ $attribute }`; ignoruje sa.
       *[other] Neplatné hodnoty { $values } atribútu `{ $attribute }`; ignorujú sa.
    }

attribute-must-be-references = Neplatná hodnota `{ $value }` atribútu `{ $attribute }`. Atribút musí byť zložený z odkazov začínajúcich na `$`.

math-input-invalid-function-names = <mathInput>: v { $attribute } sa ignorovali neplatné názvy funkcií: { $names }. Zobrazovaná časť každého názvu musí mať aspoň 2 znaky (písmená alebo spojovníky); po nej môže nasledovať nepovinná prípona `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Neplatný typ komponentu: `<{ $componentType }>`

attribute-repeated = Atribút { $attribute } nemožno opakovať.

attribute-invalid-for-component = Neplatný atribút „{ $attribute }“ pre komponent typu `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Definícia štýlu { $styleNumber } má nedostatočný kontrast { $context ->
        [text-on-background] farby textu voči farbe pozadia
        [high-contrast] vysoko kontrastnej farby voči plátnu
        [line] farby čiary voči plátnu
        [marker] farby značky voči plátnu
       *[text-on-canvas] farby textu voči plátnu
    }{ $mode ->
        [dark] { " (tmavý režim)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vyžaduje sa aspoň { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Hoci definícia štýlu { $styleNumber } zadáva farby s dostatočným kontrastom pre svetlý režim, farby odvodené z týchto hodnôt pre tmavý režim majú nedostatočný kontrast farby textu voči farbe pozadia ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vyžaduje sa aspoň { $threshold }:1). { $suggestion ->
        [available] Pre dostatočný kontrast v tmavom režime buď zvýšte kontrast vo svetlom režime (napr. nastavte { $lightAttribute }="{ $lightColor }"), alebo prepíšte farbu tmavého režimu (napr. nastavte { $darkAttribute }="{ $darkColor }").
       *[none] Pre dostatočný kontrast v tmavom režime zvýšte kontrast vo svetlom režime alebo prepíšte odvodené farby pomocou textColorDarkMode a/alebo backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Hoci definícia štýlu { $styleNumber } zadáva farbu textu s dostatočným kontrastom pre svetlý režim, farba textu odvodená z tejto hodnoty pre tmavý režim má nedostatočný kontrast voči plátnu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vyžaduje sa aspoň { $threshold }:1). { $suggestion ->
        [available] Pre dostatočný kontrast v tmavom režime buď zvýšte kontrast vo svetlom režime (napr. nastavte textColor="{ $lightColor }"), alebo prepíšte farbu tmavého režimu (napr. nastavte textColorDarkMode="{ $darkColor }").
       *[none] Pre dostatočný kontrast v tmavom režime zvýšte kontrast vo svetlom režime alebo prepíšte odvodenú farbu pomocou textColorDarkMode.
    }

section-multiple-style-palettes = Oddiel môže vybrať len jednu <stylePalette>; použije sa posledná.

## Unique variants

variant-num-to-select-not-non-negative-integer = jedinečné varianty { $component } nemožno určiť, pretože numToSelect nie je nezáporné celé číslo.

variant-num-to-select-not-constant-number = jedinečné varianty { $component } nemožno určiť, pretože numToSelect nie je konštantné číslo.

variant-with-replacement-not-constant-boolean = jedinečné varianty { $component } nemožno určiť, pretože withReplacement nie je konštantný boolean.

variant-select-weight-disables-unique = Jedinečné varianty pre select sú vypnuté, ak má niektorá možnosť zadaný selectWeight alebo selectForVariants

variant-coprime-undetermined = jedinečné varianty { $component } nemožno určiť, pretože nemožno zistiť, že coprime je vždy nepravda.

variant-attribute-not-constant = jedinečné varianty { $component } nemožno určiť, pretože { $attribute } nie je konštanta.

variant-attribute-not-number = jedinečné varianty { $component } nemožno určiť, pretože { $attribute } nie je číslo.

variant-attribute-wrong-type-for-sequence =
    jedinečné varianty { $component } typu { $type } nemožno určiť, pretože { $attribute } nie je { $expected ->
        [letters-combination] kombinácia písmen
        [math-expression] platný matematický výraz
        [integer] celé číslo
       *[number] číslo
    }.

variant-length-not-integer = jedinečné varianty { $component } nemožno určiť, pretože length nie je celé číslo.

variant-sort-not-implemented = jedinečné varianty { $component } so sort nie sú implementované

variant-exclude-combinations-not-implemented = jedinečné varianty { $component } s excludeCombinations nie sú implementované

variant-math-exclude-not-implemented = jedinečné varianty { $component } typu math s exclude nie sú implementované

variant-non-constant-exclude-not-implemented = jedinečné varianty { $component } s nekonštantným exclude nie sú implementované

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: nie je podporované vo vykresľovacom module graph prefigure; potomok preskočený.

prefigure-descendant-invalid-geometry = { $subject }: nekonečná alebo neúplná geometria; potomok preskočený.

prefigure-curve-label-omitted = { $subject }: označenia nie sú pri prevedených prvkoch krivky podporované; označenie vynechané.

prefigure-curve-unsupported-definition-type = { $subject }: nepodporovaný typ definície krivky „{ $definitionType }“; potomok preskočený.

prefigure-region-flip-functions-unsupported = { $subject }: nepodporovaný atribút flipFunctions pri regionBetweenCurves; potomok preskočený.

prefigure-region-non-formula-child = { $subject }: pri regionBetweenCurves sú podporované len detské funkcie zadané vzorcom; potomok preskočený.

prefigure-label-position-unsupported =
    { $subject }: nepodporovaný labelPosition „{ $labelPosition }“ pre { $labelKind ->
        [line-family] označenie objektu z rodiny priamok
       *[point] označenie bodu
    }; použité predvolené zarovnanie PreFigure.

prefigure-fill-style-unsupported = { $subject }: štýl výplne „{ $fillStyle }“ PreFigure nepodporuje; použije sa plná výplň.

prefigure-line-style-unknown = { $subject }: neznámy štýl čiary „{ $lineStyle }“ bol z výstupu PreFigure vynechaný.

prefigure-marker-style-mapped-to-diamond = { $subject }: štýl značky „{ $markerStyle }“ bol namapovaný na štýl PreFigure „diamond“.

prefigure-marker-style-unsupported = { $subject }: štýl značky „{ $markerStyle }“ PreFigure nepodporuje; použije sa predvolený štýl.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: neplatný `ref`; cieľ nemožno určiť. Anotácia vynechaná.

annotation-ref-multiple-targets = `<annotation>`: `ref` odkazuje na viac cieľov; použije sa prvý.

annotation-ref-outside-graph = `<annotation>`: neplatný `ref`; cieľ leží mimo obsahujúceho grafu. Anotácia vynechaná.

annotation-ref-unsupported-target = `<annotation>`: neplatný `ref`; cieľ nie je pri prevode na prefigure podporovaný grafický objekt. Anotácia vynechaná.

annotation-text-missing = `<annotation>`: chýbajúci alebo prázdny `text`; vypísaný prázdny text.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Zistila sa cyklická závislosť.
       *[other] Zistila sa cyklická závislosť zahŕňajúca komponent `<{ $componentType }>`.
    }

reference-no-referent = Pre odkaz sa nenašiel žiadny cieľ: `{ $reference }`

reference-multiple-referents = Pre odkaz sa našlo viac cieľov: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Neplatný formát atribútu { $attribute } pri `<{ $componentType }>`.

children-invalid = Neplatní potomkovia pri `<{ $componentType }>`: nájdení neplatní potomkovia: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Neplatná hodnota `{ $value }` atribútu `{ $attribute }`, použije sa hodnota `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Verzia DoenetML { $version } sa nenašla.
       *[other] Verzia DoenetML { $version } sa nenašla. Použije sa verzia { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Neplatný DoenetML: { $content }

parse-tag-missing-close-tag = Neplatný DoenetML: značka `{ $tag }` nemá uzatváraciu značku. Očakáva sa samouzatváracia značka alebo značka `</{ $tagName }>`.

parse-tag-error = Neplatný DoenetML: chyba v značke `<{ $tagName }>`

parse-attribute-missing-value = Neplatný DoenetML: neplatnému atribútu `{ $attribute }` zrejme chýba hodnota.

parse-attribute-invalid = Neplatný DoenetML: neplatný atribút `{ $attribute }`

parse-attribute-value-invalid = Neplatný DoenetML: neplatná hodnota atribútu `{ $value }`

parse-attribute-value-quote-mismatch = Neplatný DoenetML: neplatná hodnota atribútu `{ $value }`. Úvodzovky si nezodpovedajú. Zrejme chýba `{ $quote }`

parse-open-tag-name-missing = Neplatný DoenetML: našla sa značka bez názvu, napr. `<`

parse-tag-not-closed = Neplatný DoenetML: značka `{ $tag }` nebola uzavretá (zrejme chýba `>`).

parse-self-closing-tag-name-missing = Neplatný DoenetML: našla sa značka bez názvu `<{ $content }>`

parse-self-closing-tag-not-closed = Neplatný DoenetML: značka `{ $tag }` nebola uzavretá (zrejme chýba `/>`).

parse-tag-invalid-attributes = Neplatný DoenetML: značka `{ $tag }` nie je platná. Môže mať nesprávne atribúty.

parse-close-tag-name-missing = Neplatný DoenetML: našla sa uzatváracia značka bez názvu, napr. `</`

parse-attribute-value-unquoted = Hodnoty atribútov musia byť v úvodzovkách: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Neplatný DoenetML: našla sa uzatváracia značka `{ $tag }`, ale bez zodpovedajúcej otváracej

parse-close-tag-mismatched = Neplatný DoenetML: nezodpovedajúca uzatváracia značka. Očakávané `</{ $expected }>`. Nájdené `{ $found }`

parser-node-unconvertible = Uzol { $node } sa nepodarilo previesť na uzol Dast.

## Names

name-attribute-invalid =
    Neplatný atribút name='{ $name }'. { $reason ->
        [characters] Mená môžu obsahovať len písmená, číslice, podčiarkovníky alebo spojovníky.
       *[start] Mená musia začínať písmenom.
    }

component-name-invalid-start = Neplatné meno komponentu „{ $name }“. Mená musia začínať písmenom.

## `<answer>` sugar

answer-video-watched-missing-video = answer s type videoWatched musí mať atribút video

answer-video-watched-video-not-reference = answer s type videoWatched musí mať atribút video, ktorý je odkazom

answer-name-not-single-text = Atribút name pri answer musí mať jedného textového potomka

## Referencing another document

external-doenetml-recursion-limit = Externý DoenetML sa nepodarilo načítať pre priveľa úrovní rekurzie. Nie je tu kruhový odkaz?

external-doenetml-unavailable = DoenetML z { $attribute }="{ $uri }" sa nepodarilo načítať

external-doenetml-type-mismatch = Z { $attribute }="{ $uri }" sa načítal neplatný DoenetML: nezodpovedá typu komponentu „{ $componentType }“

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribút `{ $from }` je zastaraný; použite namiesto neho `{ $to }`.
       *[other] [deprecation] Atribút `{ $from }` pri `<{ $component }>` je zastaraný; použite namiesto neho `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribút `{ $from }` je zastaraný a ignoruje sa, pretože je zadané aj `{ $to }`.
       *[other] [deprecation] Atribút `{ $from }` pri `<{ $component }>` je zastaraný a ignoruje sa, pretože je zadané aj `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Atribút `{ $attribute }` pri `<{ $component }>` je zastaraný a ignoruje sa.


## Language coverage

pluralize-english-only = `<pluralize>` vie tvoriť množné číslo len v angličtine, takže v dokumente písanom v jazyku { $locale } zostáva jeho text nezmenený. Napíšte tvar množného čísla priamo alebo ho zadajte atribútom `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Prvok `<{ $tag }>` nie je známy prvok Doenet.

schema-element-not-allowed-at-root = Prvok `<{ $tag }>` nie je v koreni dokumentu povolený.

schema-element-not-allowed-inside = Prvok `<{ $tag }>` nie je vnútri `<{ $parent }>` povolený.

schema-attribute-unrecognized = Prvok `<{ $tag }>` nemá atribút s názvom `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribút `{ $attribute }` prvku `<{ $tag }>` musí byť zoznam, ktorého každá položka je jedna z: { $allowed }
       *[other] Atribút `{ $attribute }` prvku `<{ $tag }>` musí byť jedna z: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Neplatný názov variantu pre select.  Názov variantu { $variantName } sa vyskytuje v { $numOptions } možnostiach, ale vybrať sa má { $numToSelect }.

select-variant-name-without-options = Pre select sú zadané varianty, ale pre možný názov variantu nie sú zadané žiadne možnosti: { $variantName }.

select-variant-name-not-possible = Názov variantu { $variantName } zadaný pre select nie je možný názov variantu.

select-too-few-options = Nemožno vybrať { $numToSelect } komponentov len z { $numOptions }.

select-from-sequence-too-few-values = Nemožno vybrať { $numToSelect } hodnôt z postupnosti dĺžky { $length }.

select-from-sequence-indices-count-mismatch = Počet indexov zadaných pre select musí zodpovedať počtu, ktorý sa má vybrať

select-from-sequence-indices-not-integers = Všetky indexy zadané pre select musia byť celé čísla

select-from-sequence-index-excluded = Zadaný index selectfromsequence bol vylúčený

select-from-sequence-indices-excluded-combination = Zadané indexy selectfromsequence tvorili vylúčenú kombináciu

select-from-sequence-coprime-not-positive-integers = Nemožno vybrať nesúdeliteľné kombinácie, pretože sa nevyberajú kladné celé čísla.

select-from-sequence-coprime-common-factor = Nemožno vybrať nesúdeliteľné čísla. Všetky možné hodnoty majú spoločného deliteľa. (Zadané hodnoty "from" alebo "to" musia byť nesúdeliteľné so "step".)

select-from-sequence-coprime-single-number = Nemožno vybrať nesúdeliteľné kombinácie z jediného čísla rôzneho od 1.

select-from-sequence-excluded-too-many-combinations = V selectFromSequence sa vylúčilo vyše 70 % kombinácií

select-from-sequence-coprime-none-found = Nesúdeliteľné čísla sa nepodarilo vybrať. Všetky možné hodnoty majú spoločného deliteľa.

select-from-sequence-too-few-unique-values = Nemožno vybrať { $numToSelect } jedinečných hodnôt z postupnosti dĺžky { $numPossibleValues }

select-prime-numbers-too-few-values = Nemožno vybrať { $numToSelect } hodnôt zo zoznamu prvočísel dĺžky { $numValues }

select-prime-numbers-values-count-mismatch = Počet hodnôt zadaných pre select musí zodpovedať počtu, ktorý sa má vybrať

select-prime-numbers-values-not-prime = Všetky hodnoty zadané pre výber prvočísla musia byť v zozname prvočísel

select-prime-numbers-values-excluded-combination = Zadané hodnoty selectPrimeNumbers tvorili vylúčenú kombináciu

select-prime-numbers-excluded-too-many-combinations = V selectPrimeNumbers sa vylúčilo vyše 70 % kombinácií

select-random-combination-fluke = Krajne nepravdepodobnou zhodou okolností sa nepodarilo vybrať kombináciu náhodných hodnôt

select-random-value-fluke = Krajne nepravdepodobnou zhodou okolností sa nepodarilo vybrať náhodnú hodnotu
