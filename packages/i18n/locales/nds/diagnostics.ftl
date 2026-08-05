# Low German diagnostics. Translated from `locales/en/diagnostics.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
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
# Where English separates a singular from a plural only in the verb — "is
# ignored" against "are ignored" — Low German marks it on the verb too, so
# those selects are kept.


## `<lineSegment>`

# No select in either of these two: «warrt övergahn» is the same for one
# attribute and for several, so the count would pick between two identical
# strings. It still arrives; only the branching is gone.
line-segment-attributes-ignored-with-endpoints = { $attributes } warrt övergahn, wenn beide Endpünkte angeven sünd

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } warrt övergahn, wenn en Endpunkt un en Middelpunkt tosamen angeven sünd

line-segment-midpoint-offset-without-midpoint = midpointOffset hett keen Wirkung ahn Middelpunkt

## `<line>`

line-points-undetermined-dimensions = Lien dör Pünkte mit nich fastleggte Dimensionen.

line-points-too-few-dimensions = De Lien mutt dör Pünkte vun tominnst twee Dimensionen gahn.

line-points-depend-on-variables = De Lien geiht dör Pünkte, de vun Variabeln afhangt: { $variables }.

line-equation-invalid-format = Ungülltig Form för de Gliekung vun en Lien in de Variabeln { $variable1 } un { $variable2 }.

## `<ray>`

ray-overprescribed-through = De Straal is dör through, endpoint un direction fastleggt. Dat angevene through warrt övergahn.

ray-dimension-mismatch = numDimensions passt nich in ray.

## `<vector>`

vector-overprescribed-head = De Vekter is dör head, tail un displacement fastleggt. Dat angevene head warrt övergahn.

vector-dimension-mismatch = numDimensions passt nich in vector.

## Attracting and constraining

attract-to-without-nearest-point = Dat kann nich na en `<{ $component }>` antrocken warrn, wiel de keen nearestPoint-Tostandsvariabel hett.

constrain-to-without-nearest-point = Dat kann nich op en `<{ $component }>` ingrenzt warrn, wiel de keen nearestPoint-Tostandsvariabel hett.

constrain-to-interior-without-nearest-point = Dat kann nich op dat Binnere vun en `<{ $component }>` ingrenzt warrn, wiel de keen nearestPoint-Tostandsvariabel hett.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition warrt bi en choiceInput övergahn, de nich inline is

## Ordering children by index

choice-input-indices-count-mismatch = De Indexen, de för choiceInput angeven sünd, warrt övergahn, wiel de Tall vun de Indexen nich to de Tall vun de choice-Kinner passt.

pretzel-indices-count-mismatch = De Indexen, de för problem angeven sünd, warrt övergahn, wiel de Tall vun de Indexen nich to de Tall vun de problem-Kinner passt.

shuffle-indices-count-mismatch = De Indexen, de för shuffle angeven sünd, warrt övergahn, wiel de Tall vun de Indexen nich to de Tall vun de Komponenten passt.

indices-ignored-out-of-range = De Indexen, de för { $component } angeven sünd, warrt övergahn, wiel en Deel vun de Indexen buten den Bereek liggt.

pretzel-indices-repeated = De Indexen, de för pretzel angeven sünd, warrt övergahn, wiel en Deel vun de Indexen wedderhaalt warrt.

pretzel-circuit-first-index = De Indexen, de för pretzel in mode="circuit" angeven sünd, warrt övergahn, wiel de eerste Index 1 wesen mutt.

## `<shuffle>` and `<sort>`

string-children-need-type = Dormit `<{ $component }>` mit Textkinner arbeidt, mutt en Attribut `type` angeven wesen.

invalid-type-defaulting-to-math = Ungülltig type { $type } för de Komponent { $component }. Dat mutt math, text, number oder boolean wesen. Dat warrt op math sett.

string-not-valid-component-to-arrange = De Text "{ $value }" is keen gülltige Komponent för { $component }. Warrt övergahn.

## Types and variables

invalid-type-defaulting-to-number = Ungülltig type { $type }, type warrt op number sett.

invalid-variable-value = Ungülltig Weert vun en Variabel: `{ $value }`

## Variants

variant-index-must-be-number = De Variantindex { $index } mutt en Tall wesen

variant-index-must-be-integer = De Variantindex { $index } mutt en hele Tall wesen

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` is nich för afsolute Maten ümsett. De Breeden warrt op relativ sett.

side-by-side-absolute-margins = `<{ $component }>` is nich för afsolute Maten ümsett. De Ränner warrt op relativ sett.

side-by-side-no-block-child = Ungülltig `<{ $component }>`: dat mutt tominnst een Blockkind hebben.

## `<label>`

label-for-ignored-on-graphical = Dat Attribut `for` op en graafsch `<label>` warrt övergahn.

label-for-must-resolve-to-one = Dat Attribut `for` op `<label>` mutt op akkraat een Komponent wiesen.

label-for-unresolved = Dat Attribut `for` op `<label>` kunn nich op en Komponent oplööst warrn.

label-for-answer-with-authored-inputs = Dat Attribut `for` op `<label>` wiest op en `<answer>` mit sülvst schreven Ingaavfelder; wies beter direkt op dat Feld.

label-for-answer-without-input = Dat Attribut `for` op `<label>` wiest op en `<answer>` ahn Ingaavfeld, dat betekent warrn kann.

label-for-must-reference-input-or-answer = Dat Attribut `for` op `<label>` mutt op en Ingaavfeld oder op en answer wiesen.

## Accessibility

accessibility-short-description-or-decorative = För de Togänglichkeit mutt `<{ $component }>` en korte Beschrieven hebben oder as smückend angeven wesen.

accessibility-video-short-description = För de Togänglichkeit mutt `<video>` en korte Beschrieven hebben.

accessibility-input-short-description-or-label = För de Togänglichkeit mutt `<{ $component }>` en korte Beschrieven oder en Beteken hebben.

accessibility-answer-input-short-description-or-label = För de Togänglichkeit mutt en `<answer>`, de en Ingaavfeld maakt, en korte Beschrieven oder en Beteken hebben.

accessibility-short-description-contains-math = Korte Beschrieven schöölt keen mathemaatsche Komponenten as `<{ $component }>` bargen. Schriev de Mathematik mit Wöör ut.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } hett nich noog Kontrast för den Text vun de Överschrift (düüster Modus) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; tominnst { $threshold }:1 nödig).
       *[other] { $colorName } hett nich noog Kontrast för den Text vun de Överschrift ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; tominnst { $threshold }:1 nödig).
    }

## `<circle>`

circle-through-points-non-numerical = En `<circle>` dör { $count } Pünkte is nich ümsett, wenn de Pünkte keen numeersche Weerten hebbt.

circle-too-many-through-points = En Krink dör mehr as 3 Pünkte kann nich utreekt warrn.

circle-overprescribed-radius-center-points = En Krink mit angeven Halfmeter, Middelpunkt un Dörgangspünkte kann nich utreekt warrn.

circle-center-with-multiple-points = En Krink mit angeven Middelpunkt dör mehr as 1 Punkt kann nich utreekt warrn.

circle-radius-too-small = De Krink kann nich utreekt warrn: wiel de Afstand twischen de beiden Pünkte { $distance } is, is de angevene Halfmeter { $radius } to lütt.

circle-radius-with-many-points = En Krink dör mehr as twee Pünkte mit en angeven Halfmeter kann nich maakt warrn.

circle-invalid-center-or-through-points = Ungülltig Middelpunkt oder ungülltige Dörgangspünkte vun’n Krink.

circle-radius-center-with-multiple-points = De Halfmeter vun en Krink mit angeven Middelpunkt dör mehr as 1 Punkt kann nich utreekt warrn.

circle-change-radius-non-numerical = De Halfmeter vun en Krink mit nich numeersche Pünkte kann nich ännert warrn

circle-radius-with-points-non-numerical = En Krink dör mehr as een Punkt mit en angeven Halfmeter kann nich maakt warrn, wenn de Weerten nich numeersch sünd.

circle-change-center-non-numerical = Dat Ännern vun’n Middelpunkt vun en Krink dör Pünkte mit nich numeersche Weerten is nich ümsett.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Nich noog Dimensionen för den Definitschoonsbereek vun de Funkschoon. De Bereek hett { $intervals } Intervall, aver de Funkschoon hett { $inputs ->
            [one] { $inputs } Ingaav
           *[other] { $inputs } Ingaven
        }.
       *[other] Nich noog Dimensionen för den Definitschoonsbereek vun de Funkschoon. De Bereek hett { $intervals } Intervallen, aver de Funkschoon hett { $inputs ->
            [one] { $inputs } Ingaav
           *[other] { $inputs } Ingaven
        }.
    }

function-domain-invalid-format = Ungülltig Form för den Definitschoonsbereek vun de Funkschoon.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Dat nich numeersche Maximum vun de Funkschoon warrt övergahn.
        [minimum] Dat nich numeersche Minimum vun de Funkschoon warrt övergahn.
        [extremum] Dat nich numeersche Extremum vun de Funkschoon warrt övergahn.
        [point] De nich numeersche Punkt vun de Funkschoon warrt övergahn.
        [slope] De nich numeersche Stiegen vun de Funkschoon warrt övergahn.
       *[other] Dat nich numeersche { $type } vun de Funkschoon warrt övergahn.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Dat leddige Maximum vun de Funkschoon warrt övergahn.
        [minimum] Dat leddige Minimum vun de Funkschoon warrt övergahn.
        [extremum] Dat leddige Extremum vun de Funkschoon warrt övergahn.
        [point] De leddige Punkt vun de Funkschoon warrt övergahn.
       *[other] Dat leddige { $type } vun de Funkschoon warrt övergahn.
    }

function-points-too-close = De Funkschoon bargt twee Pünkte, de to dicht bienanner liggt. De Funkschoon kann nich fastleggt warrn.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Iteratschonen vun en Funkschoon sünd bloots mööglich, wenn de Tall vun de Ingaven de Tall vun de Utgaven gliek is. Disse Funkschoon hett { $inputs } Ingaav un { $outputs ->
            [one] { $outputs } Utgaav
           *[other] { $outputs } Utgaven
        }.
       *[other] Iteratschonen vun en Funkschoon sünd bloots mööglich, wenn de Tall vun de Ingaven de Tall vun de Utgaven gliek is. Disse Funkschoon hett { $inputs } Ingaven un { $outputs ->
            [one] { $outputs } Utgaav
           *[other] { $outputs } Utgaven
        }.
    }

## `<sequence>`

sequence-invalid-length = Ungülltige Längde vun de Reeg. Mutt en nich negative hele Tall wesen.

sequence-invalid-step = Ungülltige Schritt vun de Reeg. Mutt en Tall wesen för en Reeg vun’n Typ { $type }.

sequence-invalid-endpoint-number = Ungülltig "{ $attribute }" vun en Tallenreeg. Mutt en Tall wesen.

sequence-invalid-endpoint-letters = Ungülltig "{ $attribute }" vun en Bookstavenreeg. Mutt en Kombinatschoon vun Bookstaven wesen.

sequence-invalid-endpoint = Ungülltig "{ $attribute }" vun de Reeg.

select-from-sequence-coprime-not-numbers = coprime warrt övergahn, wiel keen Tallen utsöcht warrt

select-from-sequence-coprime-with-exclude-combinations = coprime warrt övergahn, wiel excludeCombinations angeven is

## Resolving a `target`

target-not-found = Ungülltig target för `<{ $source }>`: dat Teel kann nich funnen warrn.

target-state-variable-not-found = Ungülltig target för `<{ $source }>`: dat gifft keen Tostandsvariabel mit den Naam "{ $property }" op en `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = De Variabeln vun `<odeSystem>` mööt anners wesen as de unafhangige Variabel.

ode-system-duplicate-variable-names = De rechten Sieden vun de ODE köönt nich mit wedderhaalte Namen vun afhangige Variabeln fastleggt warrn.

ode-system-rhs-function-error = De rechte Siet vun de ODE kann nich fastleggt warrn. Fehler bi’t Maken vun de mathjs-Funkschoon.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = En Winkel twischen { $count } Lienen kann nich fastleggt warrn

angle-invalid-through-point = Ungülltig Punkt in’t through vun `<angle>`

parabola-vertex-too-many-points = En Parabel mit Schetelpunkt dör mehr as 1 Punkt is nich ümsett.

parabola-too-many-points = En Parabel dör mehr as 3 Pünkte is nich ümsett.

intersection-too-many-items = En Snitt vun mehr as twee Objekten is nich ümsett

## Other math components

ionic-compound-not-two-ions = En ioonsche Verbinnen is bloots för twee Ionen ümsett.

ionic-compound-needs-cation-and-anion = En ioonsche Verbinnen is bloots för een Kation un een Anion ümsett.

solve-equations-cannot-evaluate = De Gliekung kann nich lööst warrn, wiel se nich utreekt warrn kunn: { $equation }

math-operators-operand-number-required = Bi’t Rutnehmen vun en mathemaatschen Operand mutt en operandNumber angeven wesen.

eigen-decomposition-failed = De Egenweerten vun de Matrix kunnen nich utreekt warrn

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: de Parameter { $parameters } kummt in’t Muster nich vör, so dat he jümmers op wat Leddiges passt.
       *[other] `<matchesPattern>`: de Parametern { $parameters } kaamt in’t Muster nich vör, so dat se jümmers op wat Leddiges passt.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" kann nich verstahn warrn. Dat mutt none, medium, dense oder twee positive Tallen mit en Freeteken twischen wesen, to’n Bispill grid="1 0.5". Dat warrt keen Gadder teekent.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" warrt in’n prefigure-Renderer nich ünnerstütt; dat Verhollen vun de rechte Positschoon warrt bruukt.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" warrt in’n prefigure-Renderer nich ünnerstütt; dat Verhollen vun de bövere Positschoon warrt bruukt.

prefigure-invalid-axis-bounds = `<graph>`: ungülltige Assgrenzen för de Ümsettung na prefigure; de Standard-bbox (-10,-10,10,10) warrt bruukt.

prefigure-invalid-width = `<graph>`: ungülltige Breed för de Ümsettung na prefigure; de Standardbreed 425 warrt bruukt.

prefigure-invalid-aspect-ratio = `<graph>`: ungülltig aspectRatio för de Ümsettung na prefigure; dat Standardverhältnis 1 warrt bruukt.

prefigure-grid-spacing-too-fine = `<graph>`: de Gadderafstand is to fien för de Assgrenzen; dat Gadder warrt in’n prefigure-Renderer weglaten.

prefigure-annotations-not-rendered = `<graph>`: Anmarken warrt nich wiest, wenn de PreFigure-Renderer nich bruukt warrt.

multiple-annotations-children = Mehr as een `<annotations>`-Kind in `<graph>` funnen; all bit op dat leste warrt övergahn.

## Referring to other components

copy-unrecognized-component-type = En unbekannten Komponenttyp kann nich verwiedert oder kopeert warrn: { $type }.

copy-prop-not-found = De Egenschop { $property } is op en Komponent vun’n Typ { $component } nich funnen worrn

collect-no-source = Keen Born för collect funnen.

collect-invalid-component-type = Komponenten vun’n Typ `<{ $component }>` köönt nich sammelt warrn, wiel dat en ungülltige Komponenttyp is.

reference-index-unavailable = Dat kann nich op den Index `{ $reference }` wiest warrn

## `<callAction>`

component-action-unavailable = { $action } kann op de Komponent `{ $reference }` nich opropen warrn

## `<dataFrame>`

data-frame-inconsistent-row-lengths = De Daten hebbt en ungülltige Form. De Regen hebbt verschedene Längden. Funnen in componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = De Daten hebbt wedderhaalte Striepnamen. Funnen in componentIdx :{ $componentIdx }

data-frame-missing-column-name = De Daten fehlt en Striepnaam. Funnen in componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = En award för disse Antwoort steiht op de egene afschickte Antwoort vun’n answer-Tag, wat to unverwachtet Verhollen föhrt.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` op en `<answer>` binnen en Behöller mit `sectionWideCheckWork` to setten hett keen Wirkung, wiel de Tall vun de Versöken vun’n Behöller stüert warrt. Sett `maxNumAttempts` op den Behöller.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` op en Behöller mit `sectionWideCheckWork` to setten, de binnen en annern Behöller mit `sectionWideCheckWork` liggt, hett keen Wirkung, wiel de Tall vun de Versöken vun’n bueten Behöller stüert warrt. Sett `maxNumAttempts` op den bueten Behöller.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Dat Attribut { $attributes } hett ahn symbolicEquality keen Wirkung.
       *[other] De Attributen { $attributes } hebbt ahn symbolicEquality keen Wirkung.
    }

answer-invalid-type = Ungülltig Typ för de Antwoort: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Wiel de Komponent `<{ $component }>` keen Naam hett, kann se nich as Attribut vun en Modul bruukt warrn

module-attribute-name-already-defined = De Komponent `<{ $component } name="{ $name }">` kann nich as Attribut för en Modul bruukt warrn, wiel de Komponenttyp `<module>` al en Attribut "{ $name }" fastleggt hett.

conditional-content-condition-ignored = Dat Attribut `condition` warrt op en `<conditionalContent>`-Komponent mit case- oder else-Kinner övergahn.

slider-markers-type-mismatch = De Typ vun de Marken passt nich to’n Typ vun’n Schuver.

pretzel-problem-needs-statement-and-answer = Ungülltig pretzel: elk `<problem>` mutt een `<statement>` un een `<answer>` bargen.

pretzel-circuit-first-problem-distractor = Ungülltig pretzel: in mode="circuit" kann de eerste `<problem>` keen Aflenker wesen.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Ungülltig Weert { $values } för dat Attribut `{ $attribute }`; warrt övergahn.
       *[other] Ungülltige Weerten { $values } för dat Attribut `{ $attribute }`; warrt övergahn.
    }

attribute-must-be-references = Ungülltig Weert `{ $value }` för dat Attribut `{ $attribute }`. Dat Attribut mutt ut Verwiesen bestahn, de mit en `$` anfangt.

math-input-invalid-function-names = <mathInput>: ungülltige Funkschoonnamen in { $attribute } sünd övergahn worrn: { $names }. De Wiesdeel vun elk Naam mutt tominnst 2 Teken lang wesen (Bookstaven oder Streken); dornah kann en freewillig Anhang `|<mathspeak Alternativ>` kamen.

## Building components from the source

component-type-invalid = Ungülltig Komponenttyp: `<{ $componentType }>`

attribute-repeated = Dat Attribut { $attribute } kann nich wedderhaalt warrn.

attribute-invalid-for-component = Ungülltig Attribut "{ $attribute }" för en Komponent vun’n Typ `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    De Stildefinitschoon { $styleNumber } hett nich noog Kontrast för { $context ->
        [text-on-background] de Textklöör gegen de Achtergrundklöör
        [high-contrast] de Klöör mit hoog Kontrast gegen de Teekenflach
        [line] de Lienklöör gegen de Teekenflach
        [marker] de Markenklöör gegen de Teekenflach
       *[text-on-canvas] de Textklöör gegen de Teekenflach
    }{ $mode ->
        [dark] { " (düüster Modus)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; tominnst { $threshold }:1 nödig).

style-definition-dark-mode-text-background-contrast =
    Ok wenn de Stildefinitschoon { $styleNumber } Klören angeven hett, de in’n hellen Modus noog Kontrast bringt, hebbt de dorut afleiten Klören för den düüstern Modus nich noog Kontrast vun de Textklöör gegen de Achtergrundklöör ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; tominnst { $threshold }:1 nödig). { $suggestion ->
        [available] Üm in’n düüstern Modus noog Kontrast to hebben, maak entweder den Kontrast in’n hellen Modus grötter (to’n Bispill { $lightAttribute }="{ $lightColor }") oder överschriev de Klöör för den düüstern Modus (to’n Bispill { $darkAttribute }="{ $darkColor }").
       *[none] Üm in’n düüstern Modus noog Kontrast to hebben, maak den Kontrast in’n hellen Modus grötter oder överschriev de afleiten Klören mit textColorDarkMode un/oder backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ok wenn de Stildefinitschoon { $styleNumber } en Textklöör angeven hett, de in’n hellen Modus noog Kontrast bringt, hett de dorut afleitte Textklöör för den düüstern Modus nich noog Kontrast gegen de Teekenflach ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; tominnst { $threshold }:1 nödig). { $suggestion ->
        [available] Üm in’n düüstern Modus noog Kontrast to hebben, maak entweder den Kontrast in’n hellen Modus grötter (to’n Bispill textColor="{ $lightColor }") oder överschriev de Klöör för den düüstern Modus (to’n Bispill textColorDarkMode="{ $darkColor }").
       *[none] Üm in’n düüstern Modus noog Kontrast to hebben, maak den Kontrast in’n hellen Modus grötter oder överschriev de afleitte Klöör mit textColorDarkMode.
    }

section-multiple-style-palettes = En Kapittel kann bloots een <stylePalette> utsöken; dat leste warrt bruukt.

## Unique variants

variant-num-to-select-not-non-negative-integer = de eenmaligen Varianten vun { $component } köönt nich fastleggt warrn, wiel numToSelect keen nich negative hele Tall is.

variant-num-to-select-not-constant-number = de eenmaligen Varianten vun { $component } köönt nich fastleggt warrn, wiel numToSelect keen konstante Tall is.

variant-with-replacement-not-constant-boolean = de eenmaligen Varianten vun { $component } köönt nich fastleggt warrn, wiel withReplacement keen konstante boolean is.

variant-select-weight-disables-unique = Eenmalige Varianten för select sünd utschalt, wenn en Optschoon en selectWeight oder selectForVariants angeven hett

variant-coprime-undetermined = de eenmaligen Varianten vun { $component } köönt nich fastleggt warrn, wiel nich faststellt warrn kann, dat coprime jümmers falsch is.

variant-attribute-not-constant = de eenmaligen Varianten vun { $component } köönt nich fastleggt warrn, wiel { $attribute } nich konstant is.

variant-attribute-not-number = de eenmaligen Varianten vun { $component } köönt nich fastleggt warrn, wiel { $attribute } keen Tall is.

variant-attribute-wrong-type-for-sequence =
    de eenmaligen Varianten vun { $component } vun’n Typ { $type } köönt nich fastleggt warrn, wiel { $attribute } keen { $expected ->
        [letters-combination] Kombinatschoon vun Bookstaven
        [math-expression] gülltige mathemaatsche Utdruck
        [integer] hele Tall
       *[number] Tall
    } is.

variant-length-not-integer = de eenmaligen Varianten vun { $component } köönt nich fastleggt warrn, wiel length keen hele Tall is.

variant-sort-not-implemented = eenmalige Varianten vun en { $component } mit sort sünd nich ümsett

variant-exclude-combinations-not-implemented = eenmalige Varianten vun en { $component } mit excludeCombinations sünd nich ümsett

variant-math-exclude-not-implemented = eenmalige Varianten vun en { $component } vun’n Typ math mit exclude sünd nich ümsett

variant-non-constant-exclude-not-implemented = eenmalige Varianten vun en { $component } mit en nich konstant exclude sünd nich ümsett

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: warrt in’n prefigure-Renderer vun’n Grafen nich ünnerstütt; de Nakamen warrt övergahn.

prefigure-descendant-invalid-geometry = { $subject }: nich endliche oder unvullstännige Geometrie; de Nakamen warrt övergahn.

prefigure-curve-label-omitted = { $subject }: Betekens warrt op ümsette Krummelementen nich ünnerstütt; dat Beteken warrt weglaten.

prefigure-curve-unsupported-definition-type = { $subject }: nich ünnerstütt Typ vun Krummfunkschoonsdefinitschoon '{ $definitionType }'; de Nakamen warrt övergahn.

prefigure-region-flip-functions-unsupported = { $subject }: nich ünnerstütt Attribut flipFunctions op regionBetweenCurves; de Nakamen warrt övergahn.

prefigure-region-non-formula-child = { $subject }: op regionBetweenCurves warrt bloots Kindfunkschonen ünnerstütt, de dör en Formel fastleggt sünd; de Nakamen warrt övergahn.

prefigure-label-position-unsupported =
    { $subject }: nich ünnerstütt labelPosition '{ $labelPosition }' för { $labelKind ->
        [line-family] en Beteken ut de Lienfamilie
       *[point] en Puntbeteken
    }; de Standardutrichten vun PreFigure warrt bruukt.

prefigure-fill-style-unsupported = { $subject }: de Füllstil '{ $fillStyle }' warrt vun PreFigure nich ünnerstütt; dat warrt op en vulle Füllung torüchgrepen.

prefigure-line-style-unknown = { $subject }: unbekannte Lienstil '{ $lineStyle }' is ut de PreFigure-Utgaav weglaten worrn.

prefigure-marker-style-mapped-to-diamond = { $subject }: de Markenstil '{ $markerStyle }' is op den PreFigure-Stil 'diamond' afbildt worrn.

prefigure-marker-style-unsupported = { $subject }: de Markenstil '{ $markerStyle }' warrt vun PreFigure nich ünnerstütt; de Standardstil warrt bruukt.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ungülltig `ref`; dat Teel kann nich oplööst warrn. De Anmark warrt weglaten.

annotation-ref-multiple-targets = `<annotation>`: `ref` is op mehrere Telen oplööst worrn; dat eerste Teel warrt bruukt.

annotation-ref-outside-graph = `<annotation>`: ungülltig `ref`; dat Teel liggt buten den ümgevenden Grafen. De Anmark warrt weglaten.

annotation-ref-unsupported-target = `<annotation>`: ungülltig `ref`; dat Teel is keen ünnerstütt graafsch Objekt in de prefigure-Ümsettung. De Anmark warrt weglaten.

annotation-text-missing = `<annotation>`: `text` fehlt oder is leddig; dat warrt leddigen Text utgeven.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] En kringförmige Afhangigkeit is funnen worrn.
       *[other] En kringförmige Afhangigkeit mit en `<{ $componentType }>`-Komponent is funnen worrn.
    }

reference-no-referent = Keen Objekt för de Verwiesen funnen: `{ $reference }`

reference-multiple-referents = Mehr as een Objekt för de Verwiesen funnen: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ungülltige Form för dat Attribut { $attribute } vun `<{ $componentType }>`.

children-invalid = Ungülltige Kinner för `<{ $componentType }>`: ungülltige Kinner funnen: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ungülltig Weert `{ $value }` för dat Attribut `{ $attribute }`, de Weert `{ $default }` warrt bruukt

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] De DoenetML-Verschoon { $version } is nich funnen worrn.
       *[other] De DoenetML-Verschoon { $version } is nich funnen worrn. Dat warrt op de Verschoon { $fallback } torüchgrepen
    }

## Reading the DoenetML

parse-invalid-doenetml = Ungülltig DoenetML: { $content }

parse-tag-missing-close-tag = Ungülltig DoenetML: de Tag `{ $tag }` hett keen sluten Tag. Verwacht wörr en sülvstsluten Tag oder en `</{ $tagName }>`-Tag.

parse-tag-error = Ungülltig DoenetML: Fehler in’n Tag `<{ $tagName }>`

parse-attribute-missing-value = Ungülltig DoenetML: dat ungülltige Attribut `{ $attribute }` schient en Weert to fehlen.

parse-attribute-invalid = Ungülltig DoenetML: ungülltig Attribut `{ $attribute }`

parse-attribute-value-invalid = Ungülltig DoenetML: ungülltig Attributweert `{ $value }`

parse-attribute-value-quote-mismatch = Ungülltig DoenetML: ungülltig Attributweert `{ $value }`. De Ankreken passt nich tosamen. Dat schient en `{ $quote }` to fehlen

parse-open-tag-name-missing = Ungülltig DoenetML: en Tag ahn Naam funnen, to’n Bispill `<`

parse-tag-not-closed = Ungülltig DoenetML: de Tag `{ $tag }` is nich sloten worrn (dat schient en `>` to fehlen).

parse-self-closing-tag-name-missing = Ungülltig DoenetML: en Tag ahn Naam funnen `<{ $content }>`

parse-self-closing-tag-not-closed = Ungülltig DoenetML: de Tag `{ $tag }` is nich sloten worrn (`/>` schient to fehlen).

parse-tag-invalid-attributes = Ungülltig DoenetML: de Tag `{ $tag }` is nich gülltig. He hett villicht verkehrte Attributen.

parse-close-tag-name-missing = Ungülltig DoenetML: en sluten Tag ahn Naam funnen, to’n Bispill `</`

parse-attribute-value-unquoted = Attributweerten mööt in Ankreken stahn: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Ungülltig DoenetML: sluten Tag `{ $tag }` funnen, aver keen tohören apen Tag

parse-close-tag-mismatched = Ungülltig DoenetML: sluten Tag passt nich. Verwacht wörr `</{ $expected }>`. Funnen `{ $found }`

parser-node-unconvertible = De Knütt { $node } kunn nich in en Dast-Knütt ümsett warrn.

## Names

name-attribute-invalid =
    Ungülltig Attributnaam name='{ $name }'. { $reason ->
        [characters] Namen dörvt bloots Bookstaven, Tallen, Ünnerstreken oder Streken bargen.
       *[start] Namen mööt mit en Bookstaven anfangen.
    }

component-name-invalid-start = Ungülltig Komponentnaam "{ $name }". Namen mööt mit en Bookstaven anfangen.

## `<answer>` sugar

answer-video-watched-missing-video = En answer vun’n Typ videoWatched mutt en Attribut video hebben

answer-video-watched-video-not-reference = En answer vun’n Typ videoWatched mutt en Attribut video hebben, dat en Verwiesen is

answer-name-not-single-text = Dat Attribut name vun en answer mutt een enkelt Textkind hebben

## Referencing another document

external-doenetml-recursion-limit = Dat butenstahn DoenetML kann nich haalt warrn, wiel dat to veel Evenen vun Rekursion gifft. Gifft dat en kringförmige Verwiesen?

external-doenetml-unavailable = Dat kann keen DoenetML vun { $attribute }="{ $uri }" haalt warrn

external-doenetml-type-mismatch = Ungülltig DoenetML vun { $attribute }="{ $uri }" haalt: dat passt nich to’n Komponenttyp "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Dat Attribut `{ $from }` is överhaalt; bruuk dorför `{ $to }`.
       *[other] [deprecation] Dat Attribut `{ $from }` op `<{ $component }>` is överhaalt; bruuk dorför `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Dat Attribut `{ $from }` is överhaalt un warrt övergahn, wiel ok `{ $to }` angeven is.
       *[other] [deprecation] Dat Attribut `{ $from }` op `<{ $component }>` is överhaalt un warrt övergahn, wiel ok `{ $to }` angeven is.
    }

deprecated-attribute-ignored = [deprecation] Dat Attribut `{ $attribute }` op `<{ $component }>` is överhaalt un warrt övergahn.

deprecated-attribute-to-child = [deprecation] Dat Attribut `{ $attribute }` op `<{ $component }>` is överhaalt; bruuk dorför en `<{ $child }>`-Kind.

deprecated-attribute-value-renamed = [deprecation] De Weert `{ $value }` vun’t Attribut `{ $attribute }` op `<{ $component }>` is överhaalt; bruuk dorför `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` kann bloots Engelsch in de Mehrtall setten, so dat de Text in en Dokument op { $locale } liek blifft. Schriev de Mehrtallform direkt, oder giff se mit dat Attribut `pluralForm` an.


## Checking against the schema

schema-element-unrecognized = Dat Element `<{ $tag }>` is keen kennt Doenet-Element.

schema-element-not-allowed-at-root = Dat Element `<{ $tag }>` is an de Wortel vun’t Dokument nich verlöövt.

schema-element-not-allowed-inside = Dat Element `<{ $tag }>` is binnen `<{ $parent }>` nich verlöövt.

schema-attribute-unrecognized = Dat Element `<{ $tag }>` hett keen Attribut mit den Naam `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Dat Attribut `{ $attribute }` vun’t Element `<{ $tag }>` mutt en List wesen, in de elk Element een vun disse is: { $allowed }
       *[other] Dat Attribut `{ $attribute }` vun’t Element `<{ $tag }>` mutt een vun disse wesen: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Ungülltig Variantnaam för select. De Variantnaam { $variantName } kummt in { $numOptions } Optschonen vör, aver de Tall, de utsöcht warrn schall, is { $numToSelect }.

select-variant-name-without-options = För select sünd en Deel Varianten angeven, aver dat sünd keen Optschonen för den möögliken Variantnaam angeven: { $variantName }.

select-variant-name-not-possible = De Variantnaam { $variantName }, de för select angeven is, is keen möögliche Variantnaam.

select-too-few-options = { $numToSelect } Komponenten köönt nich ut bloots { $numOptions } utsöcht warrn.

select-from-sequence-too-few-values = { $numToSelect } Weerten köönt nich ut en Reeg vun de Längde { $length } utsöcht warrn.

select-from-sequence-indices-count-mismatch = De Tall vun de Indexen, de för select angeven sünd, mutt to de Tall passen, de utsöcht warrn schall

select-from-sequence-indices-not-integers = All Indexen, de för select angeven sünd, mööt hele Tallen wesen

select-from-sequence-index-excluded = En angeven Index vun selectfromsequence weer utsloten

select-from-sequence-indices-excluded-combination = Angevene Indexen vun selectfromsequence weren en utsloten Kombinatschoon

select-from-sequence-coprime-not-positive-integers = Teilerfreme Kombinatschonen köönt nich utsöcht warrn, wiel keen positive hele Tallen utsöcht warrt.

select-from-sequence-coprime-common-factor = Teilerfreme Tallen köönt nich utsöcht warrn. All möögliche Weerten hebbt en gemeensamen Faktor. (De angevenen Weerten vun "from" oder "to" mööt teilerfreem mit "step" wesen.)

select-from-sequence-coprime-single-number = Teilerfreme Kombinatschonen köönt nich ut een enkelte Tall utsöcht warrn, de nich 1 is.

select-from-sequence-excluded-too-many-combinations = Mehr as 70% vun de Kombinatschonen sünd in selectFromSequence utsloten worrn

select-from-sequence-coprime-none-found = Teilerfreme Tallen kunnen nich utsöcht warrn. All möögliche Weerten hebbt en gemeensamen Faktor.

select-from-sequence-too-few-unique-values = { $numToSelect } eenmalige Weerten köönt nich ut en Reeg vun de Längde { $numPossibleValues } utsöcht warrn

select-prime-numbers-too-few-values = { $numToSelect } Weerten köönt nich ut en List vun Primtallen vun de Längde { $numValues } utsöcht warrn

select-prime-numbers-values-count-mismatch = De Tall vun de Weerten, de för select angeven sünd, mutt to de Tall passen, de utsöcht warrn schall

select-prime-numbers-values-not-prime = All Weerten, de för dat Utsöken vun Primtallen angeven sünd, mööt in de List vun de Primtallen stahn

select-prime-numbers-values-excluded-combination = De angevenen Weerten vun selectPrimeNumbers weren en utsloten Kombinatschoon

select-prime-numbers-excluded-too-many-combinations = Mehr as 70% vun de Kombinatschonen sünd in selectPrimeNumbers utsloten worrn

select-random-combination-fluke = Dör en bannig unwohrschienlichen Tofall kunn keen Kombinatschoon vun tofällige Weerten utsöcht warrn

select-random-value-fluke = Dör en bannig unwohrschienlichen Tofall kunn keen tofällige Weert utsöcht warrn
