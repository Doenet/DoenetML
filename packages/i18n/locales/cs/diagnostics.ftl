# Czech diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
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
        [one] { $attributes } je ignorován, pokud jsou zadány dva krajní body
       *[other] { $attributes } jsou ignorovány, pokud jsou zadány dva krajní body
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } je ignorován, pokud je zadán krajní bod i střed
       *[other] { $attributes } jsou ignorovány, pokud je zadán krajní bod i střed
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset nemá bez midpoint žádný účinek

## `<line>`

line-points-undetermined-dimensions = Přímka prochází body s neurčeným počtem dimenzí.

line-points-too-few-dimensions = Přímka musí procházet body alespoň dvou dimenzí.

line-points-depend-on-variables = Přímka prochází body, které závisejí na proměnných: { $variables }.

line-equation-invalid-format = Neplatný formát rovnice přímky v proměnných { $variable1 } a { $variable2 }.

## `<ray>`

ray-overprescribed-through = Polopřímka je zadána pomocí through, endpoint i direction.  Zadané through je ignorováno.

ray-dimension-mismatch = Nesoulad numDimensions v polopřímce.

## `<vector>`

vector-overprescribed-head = Vektor je zadán pomocí head, tail i displacement.  Zadané head je ignorováno.

vector-dimension-mismatch = Nesoulad numDimensions ve vektoru.

## Attracting and constraining

attract-to-without-nearest-point = K `<{ $component }>` nelze přitahovat, protože nemá stavovou proměnnou nearestPoint.

constrain-to-without-nearest-point = Na `<{ $component }>` nelze omezit, protože nemá stavovou proměnnou nearestPoint.

constrain-to-interior-without-nearest-point = Na vnitřek `<{ $component }>` nelze omezit, protože nemá stavovou proměnnou nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition je u choiceInput, který není inline, ignorován

## Ordering children by index

choice-input-indices-count-mismatch = Indexy zadané pro choiceInput jsou ignorovány, protože jejich počet neodpovídá počtu potomků choice.

pretzel-indices-count-mismatch = Indexy zadané pro problem jsou ignorovány, protože jejich počet neodpovídá počtu potomků problem.

shuffle-indices-count-mismatch = Indexy zadané pro shuffle jsou ignorovány, protože jejich počet neodpovídá počtu komponent.

indices-ignored-out-of-range = Indexy zadané pro { $component } jsou ignorovány, protože některé jsou mimo rozsah.

pretzel-indices-repeated = Indexy zadané pro pretzel jsou ignorovány, protože se některé opakují.

pretzel-circuit-first-index = Indexy zadané pro pretzel v režimu circuit jsou ignorovány, protože první index musí být 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Aby `<{ $component }>` fungoval s řetězcovými potomky, musí být zadán atribut `type`.

invalid-type-defaulting-to-math = Neplatný type { $type } pro komponentu { $component }. Musí být jeden z math, text, number nebo boolean. Použije se math.

string-not-valid-component-to-arrange = Řetězec „{ $value }“ není platná komponenta pro { $component }. Ignoruje se.

## Types and variables

invalid-type-defaulting-to-number = Neplatný type { $type }, type nastaven na number.

invalid-variable-value = Neplatná hodnota proměnné: `{ $value }`

## Variants

variant-index-must-be-number = Index varianty { $index } musí být číslo

variant-index-must-be-integer = Index varianty { $index } musí být celé číslo

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` není implementován pro absolutní míry. Šířky nastaveny jako relativní.

side-by-side-absolute-margins = `<{ $component }>` není implementován pro absolutní míry. Okraje nastaveny jako relativní.

side-by-side-no-block-child = Neplatný `<{ $component }>`: musí mít alespoň jednoho blokového potomka.

## `<label>`

label-for-ignored-on-graphical = Atribut `for` u grafického `<label>` je ignorován.

label-for-must-resolve-to-one = Atribut `for` u `<label>` musí odkazovat právě na jednu komponentu.

label-for-unresolved = Atribut `for` u `<label>` se nepodařilo přiřadit k žádné komponentě.

label-for-answer-with-authored-inputs = Atribut `for` u `<label>` odkazuje na `<answer>` s výslovně zapsanými vstupy; odkazujte přímo na vstup.

label-for-answer-without-input = Atribut `for` u `<label>` odkazuje na `<answer>`, který nemá vstup k popsání.

label-for-must-reference-input-or-answer = Atribut `for` u `<label>` musí odkazovat na vstup nebo na odpověď.

## Accessibility

accessibility-short-description-or-decorative = Kvůli přístupnosti musí mít `<{ $component }>` buď krátký popis, nebo být označen jako dekorativní.

accessibility-video-short-description = Kvůli přístupnosti musí mít `<video>` krátký popis.

accessibility-input-short-description-or-label = Kvůli přístupnosti musí mít `<{ $component }>` krátký popis nebo popisek.

accessibility-answer-input-short-description-or-label = Kvůli přístupnosti musí mít `<answer>`, který vytváří vstup, krátký popis nebo popisek.

accessibility-short-description-contains-math = Krátké popisy by neměly obsahovat matematické komponenty jako `<{ $component }>`. Matematiku vypište slovy.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } má nedostatečný kontrast pro text nadpisu oddílu (tmavý režim) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vyžaduje se alespoň { $threshold }:1).
       *[other] { $colorName } má nedostatečný kontrast pro text nadpisu oddílu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vyžaduje se alespoň { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` procházející { $count } body není implementován pro případ, kdy body nemají číselné hodnoty.

circle-too-many-through-points = Kružnici nelze vypočítat pro více než 3 body.

circle-overprescribed-radius-center-points = Kružnici nelze vypočítat se zadaným poloměrem, středem i body.

circle-center-with-multiple-points = Kružnici se zadaným středem nelze vypočítat pro více než 1 bod.

circle-radius-too-small = Kružnici nelze vypočítat: při vzdálenosti { $distance } mezi oběma body je zadaný poloměr { $radius } příliš malý.

circle-radius-with-many-points = Kružnici se zadaným poloměrem nelze vytvořit pro více než dva body.

circle-invalid-center-or-through-points = Neplatný střed nebo body kružnice.

circle-radius-center-with-multiple-points = Poloměr kružnice se zadaným středem nelze vypočítat pro více než 1 bod.

circle-change-radius-non-numerical = Poloměr kružnice s nečíselnými body nelze změnit

circle-radius-with-points-non-numerical = Kružnici se zadaným poloměrem nelze vytvořit pro více než jeden bod, pokud nejsou k dispozici číselné hodnoty.

circle-change-center-non-numerical = Změna středu kružnice procházející body s nečíselnými hodnotami není implementována.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Nedostatečný počet dimenzí definičního oboru funkce. Obor má { $intervals } interval, ale funkce má { $inputs ->
            [one] { $inputs } vstup
            [few] { $inputs } vstupy
           *[other] { $inputs } vstupů
        }.
        [few] Nedostatečný počet dimenzí definičního oboru funkce. Obor má { $intervals } intervaly, ale funkce má { $inputs ->
            [one] { $inputs } vstup
            [few] { $inputs } vstupy
           *[other] { $inputs } vstupů
        }.
       *[other] Nedostatečný počet dimenzí definičního oboru funkce. Obor má { $intervals } intervalů, ale funkce má { $inputs ->
            [one] { $inputs } vstup
            [few] { $inputs } vstupy
           *[other] { $inputs } vstupů
        }.
    }

function-domain-invalid-format = Neplatný formát definičního oboru funkce.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Nečíselné maximum funkce se ignoruje.
        [minimum] Nečíselné minimum funkce se ignoruje.
        [extremum] Nečíselný extrém funkce se ignoruje.
        [point] Nečíselný bod funkce se ignoruje.
        [slope] Nečíselná směrnice funkce se ignoruje.
       *[other] Nečíselné { $type } funkce se ignoruje.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Prázdné maximum funkce se ignoruje.
        [minimum] Prázdné minimum funkce se ignoruje.
        [extremum] Prázdný extrém funkce se ignoruje.
        [point] Prázdný bod funkce se ignoruje.
       *[other] Prázdné { $type } funkce se ignoruje.
    }

function-points-too-close = Funkce obsahuje dva body, jejichž polohy jsou příliš blízko u sebe. Funkci nelze definovat.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Iterace funkce jsou možné, jen když se počet vstupů rovná počtu výstupů. Tato funkce má { $inputs } vstup a { $outputs ->
            [one] { $outputs } výstup
            [few] { $outputs } výstupy
           *[other] { $outputs } výstupů
        }.
        [few] Iterace funkce jsou možné, jen když se počet vstupů rovná počtu výstupů. Tato funkce má { $inputs } vstupy a { $outputs ->
            [one] { $outputs } výstup
            [few] { $outputs } výstupy
           *[other] { $outputs } výstupů
        }.
       *[other] Iterace funkce jsou možné, jen když se počet vstupů rovná počtu výstupů. Tato funkce má { $inputs } vstupů a { $outputs ->
            [one] { $outputs } výstup
            [few] { $outputs } výstupy
           *[other] { $outputs } výstupů
        }.
    }

## `<sequence>`

sequence-invalid-length = Neplatná délka posloupnosti.  Musí být nezáporné celé číslo.

sequence-invalid-step = Neplatný krok posloupnosti.  Pro posloupnost typu { $type } musí být číslo.

sequence-invalid-endpoint-number = Neplatné „{ $attribute }“ číselné posloupnosti.  Musí být číslo.

sequence-invalid-endpoint-letters = Neplatné „{ $attribute }“ písmenné posloupnosti.  Musí být kombinace písmen.

sequence-invalid-endpoint = Neplatné „{ $attribute }“ posloupnosti.

select-from-sequence-coprime-not-numbers = coprime se ignoruje, protože se nevybírají čísla

select-from-sequence-coprime-with-exclude-combinations = coprime se ignoruje, protože je zadáno excludeCombinations

## Resolving a `target`

target-not-found = Neplatný target pro `<{ $source }>`: cíl nelze najít.

target-state-variable-not-found = Neplatný target pro `<{ $source }>`: na `<{ $component }>` nelze najít stavovou proměnnou „{ $property }“.

## `<odeSystem>`

ode-system-variables-match-independent = Proměnné `<odeSystem>` se musí lišit od nezávisle proměnné.

ode-system-duplicate-variable-names = Pravé strany ODR nelze definovat s duplicitními názvy závisle proměnných.

ode-system-rhs-function-error = Pravou stranu ODR nelze definovat.  Chyba při vytváření funkce mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Úhel mezi { $count } přímkami nelze definovat

angle-invalid-through-point = Neplatný bod v through u `<angle>`

parabola-vertex-too-many-points = Parabola s vrcholem procházející více než 1 bodem není implementována.

parabola-too-many-points = Parabola procházející více než 3 body není implementována.

intersection-too-many-items = Průnik více než dvou objektů není implementován

## Other math components

ionic-compound-not-two-ions = Iontová sloučenina je implementována jen pro dva ionty.

ionic-compound-needs-cation-and-anion = Iontová sloučenina je implementována jen pro jeden kation a jeden anion.

solve-equations-cannot-evaluate = Rovnici nelze vyřešit, protože ji nebylo možné vyhodnotit: { $equation }

math-operators-operand-number-required = Při vyjímání matematického operandu je nutné zadat operandNumber.

eigen-decomposition-failed = Vlastní čísla matice nebylo možné vypočítat

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parametr { $parameters } se ve vzoru nevyskytuje, takže bude vždy odpovídat prázdnému místu.
       *[other] `<matchesPattern>`: parametry { $parameters } se ve vzoru nevyskytují, takže budou vždy odpovídat prázdnému místu.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: hodnotu grid="{ $grid }" nelze interpretovat. Musí to být none, medium, dense nebo dvě kladná čísla oddělená mezerou, například grid="1 0.5". Mřížka se nevykreslí.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" není ve vykreslovacím modulu prefigure podporováno; použije se chování pro right.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" není ve vykreslovacím modulu prefigure podporováno; použije se chování pro top.

prefigure-invalid-axis-bounds = `<graph>`: neplatné meze os pro převod na prefigure; použije se výchozí bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: neplatná šířka pro převod na prefigure; použije se výchozí šířka diagramu 425.

prefigure-invalid-aspect-ratio = `<graph>`: neplatný aspectRatio pro převod na prefigure; použije se výchozí poměr stran 1.

prefigure-grid-spacing-too-fine = `<graph>`: rozteč mřížky je pro dané meze os příliš jemná; ve vykreslovacím modulu prefigure se mřížka vynechá.

prefigure-annotations-not-rendered = `<graph>`: anotace se nevykreslí, pokud se nepoužívá vykreslovací modul PreFigure.

multiple-annotations-children = V `<graph>` bylo nalezeno více potomků `<annotations>`; všichni kromě posledního jsou ignorováni.

## Referring to other components

copy-unrecognized-component-type = Nelze rozšířit ani zkopírovat neznámý typ komponenty: { $type }.

copy-prop-not-found = Na komponentě typu { $component } nebyla nalezena vlastnost { $property }

collect-no-source = Pro collect nebyl nalezen žádný zdroj.

collect-invalid-component-type = Komponenty typu `<{ $component }>` nelze sbírat, protože jde o neplatný typ komponenty.

reference-index-unavailable = Na index `{ $reference }` nelze odkazovat

## `<callAction>`

component-action-unavailable = Na komponentě `{ $reference }` nelze zavolat { $action }

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Data mají neplatný tvar.  Řádky mají nestejnou délku. Nalezeno v componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data obsahují duplicitní názvy sloupců.  Nalezeno v componentIdx :{ $componentIdx }

data-frame-missing-column-name = Datům chybí název sloupce.  Nalezeno v componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Prvek award u této odpovědi vychází z odeslané odpovědi samotné značky answer, což povede k neočekávanému chování.

answer-max-num-attempts-in-section-wide-check-work = Nastavení `maxNumAttempts` na `<answer>` uvnitř kontejneru s `sectionWideCheckWork` nemá žádný účinek, protože počet pokusů řídí kontejner. Nastavte `maxNumAttempts` místo toho na kontejneru.

nested-section-wide-check-work-max-num-attempts = Nastavení `maxNumAttempts` na kontejneru s `sectionWideCheckWork`, který je uvnitř jiného kontejneru s `sectionWideCheckWork`, nemá žádný účinek, protože počet pokusů řídí vnější kontejner. Nastavte `maxNumAttempts` na vnějším kontejneru.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Atribut { $attributes } nebude mít bez nastaveného symbolicEquality žádný účinek.
       *[other] Atributy { $attributes } nebudou mít bez nastaveného symbolicEquality žádný účinek.
    }

answer-invalid-type = Neplatný typ pro answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Protože komponenta `<{ $component }>` nemá název, nelze ji použít jako atribut modulu

module-attribute-name-already-defined = Komponentu `<{ $component } name="{ $name }">` nelze použít jako atribut modulu, protože typ komponenty `<module>` už atribut „{ $name }“ definuje.

conditional-content-condition-ignored = Atribut `condition` je u komponenty `<conditionalContent>` s potomky case nebo else ignorován.

slider-markers-type-mismatch = Typ značek neodpovídá typu posuvníku.

pretzel-problem-needs-statement-and-answer = Neplatný pretzel: každý `<problem>` musí obsahovat jeden `<statement>` a jeden `<answer>`.

pretzel-circuit-first-problem-distractor = Neplatný pretzel: v mode="circuit" nesmí být první `<problem>` distraktor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Neplatná hodnota { $values } atributu `{ $attribute }`; ignoruje se.
       *[other] Neplatné hodnoty { $values } atributu `{ $attribute }`; ignorují se.
    }

attribute-must-be-references = Neplatná hodnota `{ $value }` atributu `{ $attribute }`. Atribut musí být složen z odkazů začínajících na `$`.

math-input-invalid-function-names = <mathInput>: v { $attribute } byly ignorovány neplatné názvy funkcí: { $names }. Zobrazovaná část každého názvu musí mít alespoň 2 znaky (písmena nebo pomlčky); za ní může následovat nepovinná přípona `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Neplatný typ komponenty: `<{ $componentType }>`

attribute-repeated = Atribut { $attribute } nelze opakovat.

attribute-invalid-for-component = Neplatný atribut „{ $attribute }“ pro komponentu typu `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Definice stylu { $styleNumber } má nedostatečný kontrast { $context ->
        [text-on-background] barvy textu vůči barvě pozadí
        [high-contrast] vysoce kontrastní barvy vůči plátnu
        [line] barvy čáry vůči plátnu
        [marker] barvy značky vůči plátnu
       *[text-on-canvas] barvy textu vůči plátnu
    }{ $mode ->
        [dark] { " (tmavý režim)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vyžaduje se alespoň { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Ačkoli definice stylu { $styleNumber } zadává barvy s dostatečným kontrastem pro světlý režim, barvy odvozené z těchto hodnot pro tmavý režim mají nedostatečný kontrast barvy textu vůči barvě pozadí ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vyžaduje se alespoň { $threshold }:1). { $suggestion ->
        [available] Pro dostatečný kontrast v tmavém režimu buď zvyšte kontrast ve světlém režimu (např. nastavte { $lightAttribute }="{ $lightColor }"), nebo přepište barvu tmavého režimu (např. nastavte { $darkAttribute }="{ $darkColor }").
       *[none] Pro dostatečný kontrast v tmavém režimu zvyšte kontrast ve světlém režimu nebo přepište odvozené barvy pomocí textColorDarkMode a/nebo backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ačkoli definice stylu { $styleNumber } zadává barvu textu s dostatečným kontrastem pro světlý režim, barva textu odvozená z této hodnoty pro tmavý režim má nedostatečný kontrast vůči plátnu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vyžaduje se alespoň { $threshold }:1). { $suggestion ->
        [available] Pro dostatečný kontrast v tmavém režimu buď zvyšte kontrast ve světlém režimu (např. nastavte textColor="{ $lightColor }"), nebo přepište barvu tmavého režimu (např. nastavte textColorDarkMode="{ $darkColor }").
       *[none] Pro dostatečný kontrast v tmavém režimu zvyšte kontrast ve světlém režimu nebo přepište odvozenou barvu pomocí textColorDarkMode.
    }

section-multiple-style-palettes = Oddíl může vybrat jen jednu <stylePalette>; použije se poslední.

## Unique variants

variant-num-to-select-not-non-negative-integer = jedinečné varianty { $component } nelze určit, protože numToSelect není nezáporné celé číslo.

variant-num-to-select-not-constant-number = jedinečné varianty { $component } nelze určit, protože numToSelect není konstantní číslo.

variant-with-replacement-not-constant-boolean = jedinečné varianty { $component } nelze určit, protože withReplacement není konstantní boolean.

variant-select-weight-disables-unique = Jedinečné varianty pro select jsou vypnuty, pokud má některá možnost zadaný selectWeight nebo selectForVariants

variant-coprime-undetermined = jedinečné varianty { $component } nelze určit, protože nelze zjistit, že coprime je vždy nepravda.

variant-attribute-not-constant = jedinečné varianty { $component } nelze určit, protože { $attribute } není konstanta.

variant-attribute-not-number = jedinečné varianty { $component } nelze určit, protože { $attribute } není číslo.

variant-attribute-wrong-type-for-sequence =
    jedinečné varianty { $component } typu { $type } nelze určit, protože { $attribute } není { $expected ->
        [letters-combination] kombinace písmen
        [math-expression] platný matematický výraz
        [integer] celé číslo
       *[number] číslo
    }.

variant-length-not-integer = jedinečné varianty { $component } nelze určit, protože length není celé číslo.

variant-sort-not-implemented = jedinečné varianty { $component } se sort nejsou implementovány

variant-exclude-combinations-not-implemented = jedinečné varianty { $component } s excludeCombinations nejsou implementovány

variant-math-exclude-not-implemented = jedinečné varianty { $component } typu math s exclude nejsou implementovány

variant-non-constant-exclude-not-implemented = jedinečné varianty { $component } s nekonstantním exclude nejsou implementovány

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: není podporováno ve vykreslovacím modulu graph prefigure; potomek přeskočen.

prefigure-descendant-invalid-geometry = { $subject }: geometrie není konečná nebo je neúplná; potomek přeskočen.

prefigure-curve-label-omitted = { $subject }: popisky nejsou u převedených prvků křivky podporovány; popisek vynechán.

prefigure-curve-unsupported-definition-type = { $subject }: nepodporovaný typ definice křivky „{ $definitionType }“; potomek přeskočen.

prefigure-region-flip-functions-unsupported = { $subject }: nepodporovaný atribut flipFunctions u regionBetweenCurves; potomek přeskočen.

prefigure-region-non-formula-child = { $subject }: u regionBetweenCurves jsou podporovány jen podřízené funkce zadané vzorcem; potomek přeskočen.

prefigure-label-position-unsupported =
    { $subject }: nepodporovaný labelPosition „{ $labelPosition }“ pro { $labelKind ->
        [line-family] popisek objektu z rodiny přímek
       *[point] popisek bodu
    }; použito výchozí zarovnání PreFigure.

prefigure-fill-style-unsupported = { $subject }: styl výplně „{ $fillStyle }“ PreFigure nepodporuje; použije se plná výplň.

prefigure-line-style-unknown = { $subject }: neznámý styl čáry „{ $lineStyle }“ byl z výstupu PreFigure vynechán.

prefigure-marker-style-mapped-to-diamond = { $subject }: styl značky „{ $markerStyle }“ byl namapován na styl PreFigure „diamond“.

prefigure-marker-style-unsupported = { $subject }: styl značky „{ $markerStyle }“ PreFigure nepodporuje; použije se výchozí styl.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: neplatný `ref`; cíl nelze určit. Anotace vynechána.

annotation-ref-multiple-targets = `<annotation>`: `ref` odkazuje na více cílů; použije se první.

annotation-ref-outside-graph = `<annotation>`: neplatný `ref`; cíl leží mimo obsahující graf. Anotace vynechána.

annotation-ref-unsupported-target = `<annotation>`: neplatný `ref`; cíl není při převodu na prefigure podporovaný grafický objekt. Anotace vynechána.

annotation-text-missing = `<annotation>`: chybějící nebo prázdný `text`; vypsán prázdný text.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Byla zjištěna cyklická závislost.
       *[other] Byla zjištěna cyklická závislost zahrnující komponentu `<{ $componentType }>`.
    }

reference-no-referent = Pro odkaz nebyl nalezen žádný cíl: `{ $reference }`

reference-multiple-referents = Pro odkaz bylo nalezeno více cílů: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Neplatný formát atributu { $attribute } u `<{ $componentType }>`.

children-invalid = Neplatní potomci u `<{ $componentType }>`: nalezeni neplatní potomci: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Neplatná hodnota `{ $value }` atributu `{ $attribute }`, použije se hodnota `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Verze DoenetML { $version } nebyla nalezena.
       *[other] Verze DoenetML { $version } nebyla nalezena. Použije se verze { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Neplatný DoenetML: { $content }

parse-tag-missing-close-tag = Neplatný DoenetML: značka `{ $tag }` nemá uzavírací značku. Očekává se samouzavírací značka nebo značka `</{ $tagName }>`.

parse-tag-error = Neplatný DoenetML: chyba ve značce `<{ $tagName }>`

parse-attribute-missing-value = Neplatný DoenetML: neplatnému atributu `{ $attribute }` zřejmě chybí hodnota.

parse-attribute-invalid = Neplatný DoenetML: neplatný atribut `{ $attribute }`

parse-attribute-value-invalid = Neplatný DoenetML: neplatná hodnota atributu `{ $value }`

parse-attribute-value-quote-mismatch = Neplatný DoenetML: neplatná hodnota atributu `{ $value }`. Uvozovky si neodpovídají. Zřejmě chybí `{ $quote }`

parse-open-tag-name-missing = Neplatný DoenetML: nalezena značka bez názvu, např. `<`

parse-tag-not-closed = Neplatný DoenetML: značka `{ $tag }` nebyla uzavřena (zřejmě chybí `>`).

parse-self-closing-tag-name-missing = Neplatný DoenetML: nalezena značka bez názvu `<{ $content }>`

parse-self-closing-tag-not-closed = Neplatný DoenetML: značka `{ $tag }` nebyla uzavřena (zřejmě chybí `/>`).

parse-tag-invalid-attributes = Neplatný DoenetML: značka `{ $tag }` není platná. Může mít nesprávné atributy.

parse-close-tag-name-missing = Neplatný DoenetML: nalezena uzavírací značka bez názvu, např. `</`

parse-attribute-value-unquoted = Hodnoty atributů musí být v uvozovkách: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Neplatný DoenetML: nalezena uzavírací značka `{ $tag }`, ale bez odpovídající otevírací

parse-close-tag-mismatched = Neplatný DoenetML: neodpovídající uzavírací značka. Očekáváno `</{ $expected }>`. Nalezeno `{ $found }`

parser-node-unconvertible = Uzel { $node } se nepodařilo převést na uzel Dast.

## Names

name-attribute-invalid =
    Neplatný atribut name='{ $name }'. { $reason ->
        [characters] Jména mohou obsahovat jen písmena, číslice, podtržítka nebo spojovníky.
       *[start] Jména musí začínat písmenem.
    }

component-name-invalid-start = Neplatný název komponenty „{ $name }“. Názvy musí začínat písmenem.

## `<answer>` sugar

answer-video-watched-missing-video = answer s type videoWatched musí mít atribut video

answer-video-watched-video-not-reference = answer s type videoWatched musí mít atribut video, který je odkazem

answer-name-not-single-text = Atribut name u answer musí mít jednoho textového potomka

## Referencing another document

external-doenetml-recursion-limit = Externí DoenetML se nepodařilo načíst kvůli příliš mnoha úrovním rekurze. Není zde kruhový odkaz?

external-doenetml-unavailable = DoenetML z { $attribute }="{ $uri }" nebylo možné načíst

external-doenetml-type-mismatch = Z { $attribute }="{ $uri }" byl načten neplatný DoenetML: neodpovídá typu komponenty „{ $componentType }“

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` je zastaralý; použijte místo něj `{ $to }`.
       *[other] [deprecation] Atribut `{ $from }` u `<{ $component }>` je zastaralý; použijte místo něj `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` je zastaralý a ignoruje se, protože je zadáno také `{ $to }`.
       *[other] [deprecation] Atribut `{ $from }` u `<{ $component }>` je zastaralý a ignoruje se, protože je zadáno také `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Atribut `{ $attribute }` u `<{ $component }>` je zastaralý a ignoruje se.


## Language coverage

pluralize-english-only = `<pluralize>` umí tvořit množné číslo jen v angličtině, takže v dokumentu psaném v jazyce { $locale } zůstává jeho text beze změny. Napište tvar množného čísla přímo, nebo jej zadejte atributem `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Prvek `<{ $tag }>` není známý prvek Doenet.

schema-element-not-allowed-at-root = Prvek `<{ $tag }>` není v kořeni dokumentu povolen.

schema-element-not-allowed-inside = Prvek `<{ $tag }>` není uvnitř `<{ $parent }>` povolen.

schema-attribute-unrecognized = Prvek `<{ $tag }>` nemá atribut s názvem `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribut `{ $attribute }` prvku `<{ $tag }>` musí být seznam, jehož každá položka je jedna z: { $allowed }
       *[other] Atribut `{ $attribute }` prvku `<{ $tag }>` musí být jedna z: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Neplatný název varianty pro select.  Název varianty { $variantName } se vyskytuje v { $numOptions } možnostech, ale vybrat se má { $numToSelect }.

select-variant-name-without-options = Pro select jsou zadány varianty, ale pro možný název varianty nejsou zadány žádné možnosti: { $variantName }.

select-variant-name-not-possible = Název varianty { $variantName } zadaný pro select není možný název varianty.

select-too-few-options = Nelze vybrat { $numToSelect } komponent pouze z { $numOptions }.

select-from-sequence-too-few-values = Nelze vybrat { $numToSelect } hodnot z posloupnosti délky { $length }.

select-from-sequence-indices-count-mismatch = Počet indexů zadaných pro select musí odpovídat počtu, který se má vybrat

select-from-sequence-indices-not-integers = Všechny indexy zadané pro select musí být celá čísla

select-from-sequence-index-excluded = Zadaný index selectfromsequence byl vyloučen

select-from-sequence-indices-excluded-combination = Zadané indexy selectfromsequence tvořily vyloučenou kombinaci

select-from-sequence-coprime-not-positive-integers = Nelze vybrat nesoudělné kombinace, protože se nevybírají kladná celá čísla.

select-from-sequence-coprime-common-factor = Nelze vybrat nesoudělná čísla. Všechny možné hodnoty mají společného dělitele. (Zadané hodnoty "from" nebo "to" musí být nesoudělné se "step".)

select-from-sequence-coprime-single-number = Nelze vybrat nesoudělné kombinace z jediného čísla různého od 1.

select-from-sequence-excluded-too-many-combinations = V selectFromSequence bylo vyloučeno přes 70 % kombinací

select-from-sequence-coprime-none-found = Nesoudělná čísla se nepodařilo vybrat. Všechny možné hodnoty mají společného dělitele.

select-from-sequence-too-few-unique-values = Nelze vybrat { $numToSelect } jedinečných hodnot z posloupnosti délky { $numPossibleValues }

select-prime-numbers-too-few-values = Nelze vybrat { $numToSelect } hodnot ze seznamu prvočísel délky { $numValues }

select-prime-numbers-values-count-mismatch = Počet hodnot zadaných pro select musí odpovídat počtu, který se má vybrat

select-prime-numbers-values-not-prime = Všechny hodnoty zadané pro výběr prvočísla musí být v seznamu prvočísel

select-prime-numbers-values-excluded-combination = Zadané hodnoty selectPrimeNumbers tvořily vyloučenou kombinaci

select-prime-numbers-excluded-too-many-combinations = V selectPrimeNumbers bylo vyloučeno přes 70 % kombinací

select-random-combination-fluke = Krajně nepravděpodobnou shodou okolností se nepodařilo vybrat kombinaci náhodných hodnot

select-random-value-fluke = Krajně nepravděpodobnou shodou okolností se nepodařilo vybrat náhodnou hodnotu
