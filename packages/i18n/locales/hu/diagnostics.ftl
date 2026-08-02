# Hungarian diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Two Hungarian habits shape these messages. A counted noun stays singular, so
# a select English writes only to change «is» to «are» is dropped. And «a(z)»
# stands wherever the article's form would depend on an argument.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = A(z) { $attributes } figyelmen kívül marad, ha két végpont van megadva

line-segment-attributes-ignored-with-endpoint-and-midpoint = A(z) { $attributes } figyelmen kívül marad, ha egy végpont és egy felezőpont is meg van adva

line-segment-midpoint-offset-without-midpoint = a midpointOffset midpoint nélkül nem fejt ki hatást

## `<line>`

line-points-undetermined-dimensions = Egyenes meghatározatlan dimenziójú pontokon át.

line-points-too-few-dimensions = Az egyenesnek legalább kétdimenziós pontokon kell átmennie.

line-points-depend-on-variables = Az egyenes olyan pontokon megy át, amelyek változóktól függenek: { $variables }.

line-equation-invalid-format = Érvénytelen formátum az egyenes egyenletéhez a(z) { $variable1 } és { $variable2 } változóban.

## `<ray>`

ray-overprescribed-through = A félegyenest a through, az endpoint és a direction is meghatározza.  A megadott through figyelmen kívül marad.

ray-dimension-mismatch = numDimensions eltérés a félegyenesben.

## `<vector>`

vector-overprescribed-head = A vektort a head, a tail és a displacement is meghatározza.  A megadott head figyelmen kívül marad.

vector-dimension-mismatch = numDimensions eltérés a vektorban.

## Attracting and constraining

attract-to-without-nearest-point = Nem lehet a(z) `<{ $component }>` elemhez vonzani, mert nincs nearestPoint állapotváltozója.

constrain-to-without-nearest-point = Nem lehet a(z) `<{ $component }>` elemre korlátozni, mert nincs nearestPoint állapotváltozója.

constrain-to-interior-without-nearest-point = Nem lehet a(z) `<{ $component }>` belsejére korlátozni, mert nincs nearestPoint állapotváltozója.

## `<choiceInput>`

choice-input-label-position-ignored = a labelPosition figyelmen kívül marad a nem inline choiceInput esetén

## Ordering children by index

choice-input-indices-count-mismatch = A choiceInput számára megadott indexek figyelmen kívül maradnak, mert számuk nem egyezik a choice gyermekek számával.

pretzel-indices-count-mismatch = A problem számára megadott indexek figyelmen kívül maradnak, mert számuk nem egyezik a problem gyermekek számával.

shuffle-indices-count-mismatch = A shuffle számára megadott indexek figyelmen kívül maradnak, mert számuk nem egyezik a komponensek számával.

indices-ignored-out-of-range = A(z) { $component } számára megadott indexek figyelmen kívül maradnak, mert némelyik tartományon kívül esik.

pretzel-indices-repeated = A pretzel számára megadott indexek figyelmen kívül maradnak, mert némelyik ismétlődik.

pretzel-circuit-first-index = A pretzel számára circuit módban megadott indexek figyelmen kívül maradnak, mert az első indexnek 1-nek kell lennie.

## `<shuffle>` and `<sort>`

string-children-need-type = Ahhoz, hogy a(z) `<{ $component }>` szöveges gyermekekkel működjön, meg kell adni a `type` attribútumot.

invalid-type-defaulting-to-math = Érvénytelen type { $type } a(z) { $component } komponenshez. A math, text, number vagy boolean egyike lehet. A math lesz használva.

string-not-valid-component-to-arrange = A(z) „{ $value }” szöveg nem érvényes komponens ehhez: { $component }. Figyelmen kívül marad.

## Types and variables

invalid-type-defaulting-to-number = Érvénytelen type { $type }, a type number lesz.

invalid-variable-value = Egy változó érvénytelen értéke: `{ $value }`

## Variants

variant-index-must-be-number = A(z) { $index } változatindexnek számnak kell lennie

variant-index-must-be-integer = A(z) { $index } változatindexnek egész számnak kell lennie

## `<sideBySide>`

side-by-side-absolute-widths = A(z) `<{ $component }>` nincs megvalósítva abszolút mértékekhez. A szélességek relatívra állnak.

side-by-side-absolute-margins = A(z) `<{ $component }>` nincs megvalósítva abszolút mértékekhez. A margók relatívra állnak.

side-by-side-no-block-child = Érvénytelen `<{ $component }>`: legalább egy blokk típusú gyermekének kell lennie.

## `<label>`

label-for-ignored-on-graphical = A grafikus `<label>` `for` attribútuma figyelmen kívül marad.

label-for-must-resolve-to-one = A `<label>` `for` attribútumának pontosan egy komponensre kell mutatnia.

label-for-unresolved = A `<label>` `for` attribútuma nem volt komponenshez rendelhető.

label-for-answer-with-authored-inputs = A `<label>` `for` attribútuma olyan `<answer>` elemre hivatkozik, amelynek bemenetei kifejezetten meg vannak írva; hivatkozzon közvetlenül a bemenetre.

label-for-answer-without-input = A `<label>` `for` attribútuma olyan `<answer>` elemre hivatkozik, amelyhez nincs felcímkézhető bemenet.

label-for-must-reference-input-or-answer = A `<label>` `for` attribútumának bemenetre vagy answer elemre kell hivatkoznia.

## Accessibility

accessibility-short-description-or-decorative = Az akadálymentesség érdekében a(z) `<{ $component }>` elemnek vagy rövid leírással kell rendelkeznie, vagy dekoratívként kell megjelölni.

accessibility-video-short-description = Az akadálymentesség érdekében a `<video>` elemnek rövid leírással kell rendelkeznie.

accessibility-input-short-description-or-label = Az akadálymentesség érdekében a(z) `<{ $component }>` elemnek rövid leírással vagy címkével kell rendelkeznie.

accessibility-answer-input-short-description-or-label = Az akadálymentesség érdekében a bemenetet létrehozó `<answer>` elemnek rövid leírással vagy címkével kell rendelkeznie.

accessibility-short-description-contains-math = A rövid leírások ne tartalmazzanak matematikai komponenseket, például `<{ $component }>` elemet. A matematikát írja ki szavakkal.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] A(z) { $colorName } kontrasztja nem elegendő a fejezetcím szövegéhez (sötét mód) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; legalább { $threshold }:1 szükséges).
       *[other] A(z) { $colorName } kontrasztja nem elegendő a fejezetcím szövegéhez ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; legalább { $threshold }:1 szükséges).
    }

## `<circle>`

circle-through-points-non-numerical = A(z) { $count } ponton átmenő `<circle>` nincs megvalósítva arra az esetre, amikor a pontoknak nincs számértékük.

circle-too-many-through-points = Nem számítható kör 3-nál több ponton át.

circle-overprescribed-radius-center-points = Nem számítható kör megadott sugárral, középponttal és pontokkal együtt.

circle-center-with-multiple-points = Nem számítható megadott középpontú kör 1-nél több ponton át.

circle-radius-too-small = Nem számítható a kör: mivel a két pont távolsága { $distance }, a megadott { $radius } sugár túl kicsi.

circle-radius-with-many-points = Nem hozható létre kör kettőnél több ponton át megadott sugárral.

circle-invalid-center-or-through-points = A kör középpontja vagy pontjai érvénytelenek.

circle-radius-center-with-multiple-points = Nem számítható a megadott középpontú kör sugara 1-nél több ponton át.

circle-change-radius-non-numerical = Nem változtatható meg a kör sugara nem számértékű pontokkal

circle-radius-with-points-non-numerical = Nem hozható létre kör egynél több ponton át megadott sugárral, ha nincsenek számértékek.

circle-change-center-non-numerical = Nem számértékű pontokon átmenő kör középpontjának módosítása nincs megvalósítva.

## `<function>`

function-domain-insufficient-dimensions = A függvény értelmezési tartományának dimenziója nem elegendő. A tartománynak { $intervals } intervalluma van, a függvénynek pedig { $inputs } bemenete.

function-domain-invalid-format = Érvénytelen formátum a függvény értelmezési tartományához.

function-ignoring-non-numerical =
    { $type ->
        [maximum] A függvény nem számértékű maximuma figyelmen kívül marad.
        [minimum] A függvény nem számértékű minimuma figyelmen kívül marad.
        [extremum] A függvény nem számértékű szélsőértéke figyelmen kívül marad.
        [point] A függvény nem számértékű pontja figyelmen kívül marad.
        [slope] A függvény nem számértékű meredeksége figyelmen kívül marad.
       *[other] A függvény nem számértékű { $type } értéke figyelmen kívül marad.
    }

function-ignoring-empty =
    { $type ->
        [maximum] A függvény üres maximuma figyelmen kívül marad.
        [minimum] A függvény üres minimuma figyelmen kívül marad.
        [extremum] A függvény üres szélsőértéke figyelmen kívül marad.
        [point] A függvény üres pontja figyelmen kívül marad.
       *[other] A függvény üres { $type } értéke figyelmen kívül marad.
    }

function-points-too-close = A függvény két olyan pontot tartalmaz, amelyek helye túl közel esik egymáshoz. A függvény nem definiálható.

function-iterates-input-output-mismatch = Függvényiterációk csak akkor lehetségesek, ha a bemenetek száma megegyezik a kimenetek számával. Ennek a függvénynek { $inputs } bemenete és { $outputs } kimenete van.

## `<sequence>`

sequence-invalid-length = A sorozat hossza érvénytelen.  Nemnegatív egész számnak kell lennie.

sequence-invalid-step = A sorozat lépésköze érvénytelen.  A(z) { $type } típusú sorozathoz számnak kell lennie.

sequence-invalid-endpoint-number = Érvénytelen „{ $attribute }” a számsorozatban.  Számnak kell lennie.

sequence-invalid-endpoint-letters = Érvénytelen „{ $attribute }” a betűsorozatban.  Betűkombinációnak kell lennie.

sequence-invalid-endpoint = Érvénytelen „{ $attribute }” a sorozatban.

select-from-sequence-coprime-not-numbers = a coprime figyelmen kívül marad, mert nem számokat választunk

select-from-sequence-coprime-with-exclude-combinations = a coprime figyelmen kívül marad, mert excludeCombinations van megadva

## Resolving a `target`

target-not-found = Érvénytelen target ehhez: `<{ $source }>`: a cél nem található.

target-state-variable-not-found = Érvénytelen target ehhez: `<{ $source }>`: nem található „{ $property }” nevű állapotváltozó a(z) `<{ $component }>` elemen.

## `<odeSystem>`

ode-system-variables-match-independent = Az `<odeSystem>` változóinak különbözniük kell a független változótól.

ode-system-duplicate-variable-names = Nem definiálhatók a differenciálegyenlet jobb oldali függvényei ismétlődő függő változónevekkel.

ode-system-rhs-function-error = Nem definiálható a differenciálegyenlet jobb oldali függvénye.  Hiba a mathjs függvény létrehozásakor.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Nem definiálható szög { $count } egyenes között

angle-invalid-through-point = Érvénytelen pont az `<angle>` through attribútumában

parabola-vertex-too-many-points = Nincs megvalósítva csúcsponttal megadott parabola 1-nél több ponton át.

parabola-too-many-points = Nincs megvalósítva parabola 3-nál több ponton át.

intersection-too-many-items = Nincs megvalósítva metszet kettőnél több objektumra

## Other math components

ionic-compound-not-two-ions = Az ionvegyület csak két ionra van megvalósítva.

ionic-compound-needs-cation-and-anion = Az ionvegyület csak egy kationra és egy anionra van megvalósítva.

solve-equations-cannot-evaluate = Nem oldható meg az egyenlet, mert nem volt kiértékelhető: { $equation }

math-operators-operand-number-required = Matematikai operandus kiemelésekor meg kell adni az operandNumber értéket.

eigen-decomposition-failed = Nem sikerült kiszámítani a mátrix sajátértékeit

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: a(z) { $parameters } paraméter nem fordul elő a mintában, ezért mindig üres helyre fog illeszkedni.

## `<graph>`

graph-grid-invalid = `<graph>`: a grid="{ $grid }" nem értelmezhető. none, medium, dense vagy két szóközzel elválasztott pozitív szám lehet, például grid="1 0.5". Nem rajzolódik rács.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: az xLabelPosition="left" nem támogatott a prefigure megjelenítőmodulban; a right viselkedése lép életbe.

prefigure-y-label-position-unsupported = `<graph>`: az yLabelPosition="bottom" nem támogatott a prefigure megjelenítőmodulban; a top viselkedése lép életbe.

prefigure-invalid-axis-bounds = `<graph>`: érvénytelen tengelyhatárok a prefigure átalakításhoz; az alapértelmezett bbox (-10,-10,10,10) lép életbe.

prefigure-invalid-width = `<graph>`: érvénytelen szélesség a prefigure átalakításhoz; az alapértelmezett 425 diagramszélesség lép életbe.

prefigure-invalid-aspect-ratio = `<graph>`: érvénytelen aspectRatio a prefigure átalakításhoz; az alapértelmezett 1 oldalarány lép életbe.

prefigure-grid-spacing-too-fine = `<graph>`: a rács osztásköze túl finom a tengelyhatárokhoz; a prefigure megjelenítőmodulban a rács kimarad.

prefigure-annotations-not-rendered = `<graph>`: a jegyzetek nem jelennek meg, ha nem a PreFigure megjelenítőmodult használjuk.

multiple-annotations-children = Több `<annotations>` gyermek található a `<graph>` elemben; az utolsó kivételével mind figyelmen kívül marad.

## Referring to other components

copy-unrecognized-component-type = Nem bővíthető és nem másolható ismeretlen komponenstípus: { $type }.

copy-prop-not-found = Nem található { $property } tulajdonság a(z) { $component } típusú komponensen

collect-no-source = A collect számára nem található forrás.

collect-invalid-component-type = Nem gyűjthetők `<{ $component }>` típusú komponensek, mert ez érvénytelen komponenstípus.

reference-index-unavailable = Nem hivatkozható a(z) `{ $reference }` index

## `<callAction>`

component-action-unavailable = Nem hívható meg a(z) { $action } a(z) `{ $reference }` komponensen

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Az adatok alakja érvénytelen.  A sorok hossza nem egyforma. Itt található: componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Az adatokban ismétlődő oszlopnevek vannak.  Itt található: componentIdx :{ $componentIdx }

data-frame-missing-column-name = Az adatokból hiányzik egy oszlopnév.  Itt található: componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = E válasz egyik award eleme magának az answer címkének a beküldött válaszára épül, ami váratlan viselkedéshez vezet.

answer-max-num-attempts-in-section-wide-check-work = A `maxNumAttempts` megadása egy `sectionWideCheckWork` tulajdonságú tárolón belüli `<answer>` elemen nem fejt ki hatást, mert a próbálkozások számát a tároló szabja meg. A `maxNumAttempts` értéket a tárolón adja meg.

nested-section-wide-check-work-max-num-attempts = A `maxNumAttempts` megadása olyan `sectionWideCheckWork` tulajdonságú tárolón, amely egy másik `sectionWideCheckWork` tulajdonságú tárolóban van, nem fejt ki hatást, mert a próbálkozások számát a külső tároló szabja meg. A `maxNumAttempts` értéket a külső tárolón adja meg.

answer-attributes-need-symbolic-equality = A(z) { $attributes } attribútum nem fejt ki hatást a symbolicEquality beállítása nélkül.

answer-invalid-type = Érvénytelen típus az answer elemhez: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Mivel a(z) `<{ $component }>` komponensnek nincs neve, nem használható modulattribútumként

module-attribute-name-already-defined = A(z) `<{ $component } name="{ $name }">` komponens nem használható modulattribútumként, mert a `<module>` komponenstípusnak már van „{ $name }” attribútuma.

conditional-content-condition-ignored = A `condition` attribútum figyelmen kívül marad a case vagy else gyermekekkel rendelkező `<conditionalContent>` komponensen.

slider-markers-type-mismatch = A jelölők típusa nem egyezik a csúszka típusával.

pretzel-problem-needs-statement-and-answer = Érvénytelen pretzel: minden `<problem>` elemnek egy `<statement>` és egy `<answer>` elemet kell tartalmaznia.

pretzel-circuit-first-problem-distractor = Érvénytelen pretzel: mode="circuit" esetén az első `<problem>` nem lehet elterelő.

## Attribute values

attribute-invalid-values = Érvénytelen érték { $values } a(z) `{ $attribute }` attribútumhoz; figyelmen kívül marad.

attribute-must-be-references = Érvénytelen érték `{ $value }` a(z) `{ $attribute }` attribútumhoz. Az attribútumnak `$` jellel kezdődő hivatkozásokból kell állnia.

math-input-invalid-function-names = <mathInput>: érvénytelen függvénynevek maradtak figyelmen kívül itt: { $attribute }: { $names }. Minden név megjelenő része legalább 2 karakter (betű vagy kötőjel) legyen; ezt követheti egy elhagyható `|<mathspeak alternative>` utótag.

## Building components from the source

component-type-invalid = Érvénytelen komponenstípus: `<{ $componentType }>`

attribute-repeated = A(z) { $attribute } attribútum nem ismételhető.

attribute-invalid-for-component = Érvénytelen „{ $attribute }” attribútum a(z) `<{ $componentType }>` típusú komponenshez.

## Style definition contrast

style-definition-insufficient-contrast =
    A(z) { $styleNumber } stílusdefiníció kontrasztja nem elegendő { $context ->
        [text-on-background] a szövegszín és a háttérszín között
        [high-contrast] a nagy kontrasztú szín és a vászon között
        [line] a vonalszín és a vászon között
        [marker] a jelölőszín és a vászon között
       *[text-on-canvas] a szövegszín és a vászon között
    }{ $mode ->
        [dark] { " (sötét mód)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; legalább { $threshold }:1 szükséges).

style-definition-dark-mode-text-background-contrast =
    Bár a(z) { $styleNumber } stílusdefiníció világos módhoz elegendő kontrasztú színeket ad meg, az ezekből származtatott sötét módú színek kontrasztja a szövegszín és a háttérszín között nem elegendő ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; legalább { $threshold }:1 szükséges). { $suggestion ->
        [available] A sötét módú kontraszt eléréséhez vagy növelje a világos módú kontrasztot (például { $lightAttribute }="{ $lightColor }"), vagy írja felül a sötét módú színt (például { $darkAttribute }="{ $darkColor }").
       *[none] A sötét módú kontraszt eléréséhez növelje a világos módú kontrasztot, vagy írja felül a származtatott színeket a textColorDarkMode és/vagy a backgroundColorDarkMode értékkel.
    }

style-definition-dark-mode-text-canvas-contrast =
    Bár a(z) { $styleNumber } stílusdefiníció világos módhoz elegendő kontrasztú szövegszínt ad meg, az ebből származtatott sötét módú szövegszín kontrasztja a vászonhoz képest nem elegendő ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; legalább { $threshold }:1 szükséges). { $suggestion ->
        [available] A sötét módú kontraszt eléréséhez vagy növelje a világos módú kontrasztot (például textColor="{ $lightColor }"), vagy írja felül a sötét módú színt (például textColorDarkMode="{ $darkColor }").
       *[none] A sötét módú kontraszt eléréséhez növelje a világos módú kontrasztot, vagy írja felül a származtatott színt a textColorDarkMode értékkel.
    }

section-multiple-style-palettes = Egy fejezet csak egy <stylePalette> elemet választhat; az utolsó lép életbe.

## Unique variants

variant-num-to-select-not-non-negative-integer = nem határozhatók meg a(z) { $component } egyedi változatai, mert a numToSelect nem nemnegatív egész szám.

variant-num-to-select-not-constant-number = nem határozhatók meg a(z) { $component } egyedi változatai, mert a numToSelect nem állandó szám.

variant-with-replacement-not-constant-boolean = nem határozhatók meg a(z) { $component } egyedi változatai, mert a withReplacement nem állandó logikai érték.

variant-select-weight-disables-unique = A select egyedi változatai ki vannak kapcsolva, ha valamelyik opciónak van selectWeight vagy selectForVariants értéke

variant-coprime-undetermined = nem határozhatók meg a(z) { $component } egyedi változatai, mert nem állapítható meg, hogy a coprime mindig hamis.

variant-attribute-not-constant = nem határozhatók meg a(z) { $component } egyedi változatai, mert a(z) { $attribute } nem állandó.

variant-attribute-not-number = nem határozhatók meg a(z) { $component } egyedi változatai, mert a(z) { $attribute } nem szám.

variant-attribute-wrong-type-for-sequence =
    nem határozhatók meg a(z) { $type } típusú { $component } egyedi változatai, mert a(z) { $attribute } nem { $expected ->
        [letters-combination] betűkombináció
        [math-expression] érvényes matematikai kifejezés
        [integer] egész szám
       *[number] szám
    }.

variant-length-not-integer = nem határozhatók meg a(z) { $component } egyedi változatai, mert a length nem egész szám.

variant-sort-not-implemented = nincs megvalósítva a(z) { $component } egyedi változatainak kezelése sort esetén

variant-exclude-combinations-not-implemented = nincs megvalósítva a(z) { $component } egyedi változatainak kezelése excludeCombinations esetén

variant-math-exclude-not-implemented = nincs megvalósítva a math típusú { $component } egyedi változatainak kezelése exclude esetén

variant-non-constant-exclude-not-implemented = nincs megvalósítva a(z) { $component } egyedi változatainak kezelése nem állandó exclude esetén

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: nem támogatott a graph prefigure megjelenítőmodulban; a leszármazott kimarad.

prefigure-descendant-invalid-geometry = { $subject }: nem véges vagy hiányos geometria; a leszármazott kimarad.

prefigure-curve-label-omitted = { $subject }: az átalakított görbeelemeken nem támogatottak a címkék; a címke kimarad.

prefigure-curve-unsupported-definition-type = { $subject }: nem támogatott görbedefiníció-típus: „{ $definitionType }”; a leszármazott kimarad.

prefigure-region-flip-functions-unsupported = { $subject }: nem támogatott flipFunctions attribútum a regionBetweenCurves elemen; a leszármazott kimarad.

prefigure-region-non-formula-child = { $subject }: a regionBetweenCurves elemen csak képlettel megadott gyermekfüggvények támogatottak; a leszármazott kimarad.

prefigure-label-position-unsupported =
    { $subject }: nem támogatott labelPosition: „{ $labelPosition }” a következőhöz: { $labelKind ->
        [line-family] egyenescsalád címkéje
       *[point] pontcímke
    }; az alapértelmezett PreFigure igazítás lép életbe.

prefigure-fill-style-unsupported = { $subject }: a(z) „{ $fillStyle }” kitöltési stílust a PreFigure nem támogatja; teli kitöltés lép életbe.

prefigure-line-style-unknown = { $subject }: az ismeretlen „{ $lineStyle }” vonalstílus kimaradt a PreFigure kimenetéből.

prefigure-marker-style-mapped-to-diamond = { $subject }: a(z) „{ $markerStyle }” jelölőstílus a PreFigure „diamond” stílusára képződött le.

prefigure-marker-style-unsupported = { $subject }: a(z) „{ $markerStyle }” jelölőstílust a PreFigure nem támogatja; az alapértelmezett stílus lép életbe.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: érvénytelen `ref`; a cél nem határozható meg. A jegyzet kimarad.

annotation-ref-multiple-targets = `<annotation>`: a `ref` több célra mutat; az első lép életbe.

annotation-ref-outside-graph = `<annotation>`: érvénytelen `ref`; a cél a befoglaló grafikonon kívül esik. A jegyzet kimarad.

annotation-ref-unsupported-target = `<annotation>`: érvénytelen `ref`; a cél nem támogatott grafikus objektum a prefigure átalakításban. A jegyzet kimarad.

annotation-text-missing = `<annotation>`: hiányzó vagy üres `text`; üres szöveg kerül kiírásra.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Körkörös függőség észlelhető.
       *[other] Körkörös függőség észlelhető, amelyben `<{ $componentType }>` komponens vesz részt.
    }

reference-no-referent = Nem található hivatkozott elem ehhez: `{ $reference }`

reference-multiple-referents = Több hivatkozott elem található ehhez: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Érvénytelen formátum a(z) `<{ $componentType }>` { $attribute } attribútumához.

children-invalid = Érvénytelen gyermekek a(z) `<{ $componentType }>` elemben: érvénytelen gyermekek találhatók: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Érvénytelen érték `{ $value }` a(z) `{ $attribute }` attribútumhoz, a(z) `{ $default }` érték lép életbe

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] A(z) { $version } DoenetML verzió nem található.
       *[other] A(z) { $version } DoenetML verzió nem található. A(z) { $fallback } verzió lép életbe
    }

## Reading the DoenetML

parse-invalid-doenetml = Érvénytelen DoenetML: { $content }

parse-tag-missing-close-tag = Érvénytelen DoenetML: A(z) `{ $tag }` címkének nincs záró párja. Önzáró címke vagy `</{ $tagName }>` címke várható.

parse-tag-error = Érvénytelen DoenetML: Hiba a(z) `<{ $tagName }>` címkében

parse-attribute-missing-value = Érvénytelen DoenetML: A(z) `{ $attribute }` érvénytelen attribútumból mintha hiányozna az érték.

parse-attribute-invalid = Érvénytelen DoenetML: Érvénytelen attribútum: `{ $attribute }`

parse-attribute-value-invalid = Érvénytelen DoenetML: Érvénytelen attribútumérték: `{ $value }`

parse-attribute-value-quote-mismatch = Érvénytelen DoenetML: Érvénytelen attribútumérték: `{ $value }`. Az idézőjelek nem illeszkednek. Mintha hiányozna egy `{ $quote }`

parse-open-tag-name-missing = Érvénytelen DoenetML: Név nélküli címke található, például `<`

parse-tag-not-closed = Érvénytelen DoenetML: A(z) `{ $tag }` címke nem lett lezárva (mintha hiányozna egy `>`).

parse-self-closing-tag-name-missing = Érvénytelen DoenetML: Név nélküli címke található: `<{ $content }>`

parse-self-closing-tag-not-closed = Érvénytelen DoenetML: A(z) `{ $tag }` címke nem lett lezárva (mintha hiányozna a `/>`).

parse-tag-invalid-attributes = Érvénytelen DoenetML: A(z) `{ $tag }` címke érvénytelen. Lehet, hogy hibás attribútumai vannak.

parse-close-tag-name-missing = Érvénytelen DoenetML: Név nélküli záró címke található, például `</`

parse-attribute-value-unquoted = Az attribútumértékeket idézőjelbe kell tenni: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Érvénytelen DoenetML: `{ $tag }` záró címke található, de nincs hozzá tartozó nyitó címke

parse-close-tag-mismatched = Érvénytelen DoenetML: Nem illeszkedő záró címke. Várt: `</{ $expected }>`. Talált: `{ $found }`

parser-node-unconvertible = A(z) { $node } csomópont nem alakítható át Dast csomóponttá.

## Names

name-attribute-invalid =
    Érvénytelen name='{ $name }' attribútum. { $reason ->
        [characters] A nevek csak betűket, számokat, aláhúzásjeleket vagy kötőjeleket tartalmazhatnak.
       *[start] A neveknek betűvel kell kezdődniük.
    }

component-name-invalid-start = Érvénytelen komponensnév: „{ $name }”. A neveknek betűvel kell kezdődniük.

## `<answer>` sugar

answer-video-watched-missing-video = A videoWatched típusú answer elemnek video attribútummal kell rendelkeznie

answer-video-watched-video-not-reference = A videoWatched típusú answer elem video attribútumának hivatkozásnak kell lennie

answer-name-not-single-text = Az answer name attribútumának egyetlen szöveges gyermeke lehet

## Referencing another document

external-doenetml-recursion-limit = A külső DoenetML nem tölthető le a túl sok rekurziós szint miatt. Nincs itt körkörös hivatkozás?

external-doenetml-unavailable = Nem tölthető le DoenetML innen: { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Érvénytelen DoenetML érkezett innen: { $attribute }="{ $uri }": nem felel meg a(z) „{ $componentType }” komponenstípusnak

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] A(z) `{ $from }` attribútum elavult; helyette a(z) `{ $to }` használandó.
       *[other] [deprecation] A(z) `<{ $component }>` elem `{ $from }` attribútuma elavult; helyette a(z) `{ $to }` használandó.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] A(z) `{ $from }` attribútum elavult, és figyelmen kívül marad, mert a(z) `{ $to }` is meg van adva.
       *[other] [deprecation] A(z) `<{ $component }>` elem `{ $from }` attribútuma elavult, és figyelmen kívül marad, mert a(z) `{ $to }` is meg van adva.
    }

deprecated-attribute-ignored = [deprecation] A(z) `<{ $component }>` elem `{ $attribute }` attribútuma elavult, és figyelmen kívül marad.


## Language coverage

pluralize-english-only = A `<pluralize>` csak angolul tud többes számot képezni, ezért a(z) { $locale } nyelven írt dokumentumban a szövege változatlan marad. Írja ki közvetlenül a többes számú alakot, vagy adja meg a `pluralForm` attribútummal.


## Checking against the schema

schema-element-unrecognized = A(z) `<{ $tag }>` elem nem ismert Doenet elem.

schema-element-not-allowed-at-root = A(z) `<{ $tag }>` elem nem megengedett a dokumentum gyökerében.

schema-element-not-allowed-inside = A(z) `<{ $tag }>` elem nem megengedett a(z) `<{ $parent }>` elemen belül.

schema-attribute-unrecognized = A(z) `<{ $tag }>` elemnek nincs `{ $attribute }` nevű attribútuma.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] A(z) `<{ $tag }>` elem `{ $attribute }` attribútumának olyan listának kell lennie, amelynek minden eleme egy a következők közül: { $allowed }
       *[other] A(z) `<{ $tag }>` elem `{ $attribute }` attribútumának egynek kell lennie a következők közül: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Érvénytelen változatnév a select számára.  A(z) { $variantName } változatnév { $numOptions } opcióban fordul elő, de a kiválasztandók száma { $numToSelect }.

select-variant-name-without-options = A select számára vannak megadva változatok, de a lehetséges változatnévhez nincs opció: { $variantName }.

select-variant-name-not-possible = A select számára megadott { $variantName } változatnév nem lehetséges változatnév.

select-too-few-options = Nem választható ki { $numToSelect } komponens mindössze { $numOptions } közül.

select-from-sequence-too-few-values = Nem választható ki { $numToSelect } érték egy { $length } hosszú sorozatból.

select-from-sequence-indices-count-mismatch = A select számára megadott indexek számának meg kell egyeznie a kiválasztandók számával

select-from-sequence-indices-not-integers = A select számára megadott minden indexnek egész számnak kell lennie

select-from-sequence-index-excluded = A selectfromsequence megadott indexe ki volt zárva

select-from-sequence-indices-excluded-combination = A selectfromsequence megadott indexei kizárt kombinációt alkottak

select-from-sequence-coprime-not-positive-integers = Nem választhatók relatív prím kombinációk, mert nem pozitív egész számokat választunk.

select-from-sequence-coprime-common-factor = Nem választhatók relatív prím számok. Minden lehetséges értéknek van közös osztója. (A "from" vagy "to" megadott értékének relatív prímnek kell lennie a "step" értékéhez.)

select-from-sequence-coprime-single-number = Nem választhatók relatív prím kombinációk egyetlen, 1-től különböző számból.

select-from-sequence-excluded-too-many-combinations = A selectFromSequence a kombinációk több mint 70%-át kizárta

select-from-sequence-coprime-none-found = Nem sikerült relatív prím számokat választani. Minden lehetséges értéknek van közös osztója.

select-from-sequence-too-few-unique-values = Nem választható ki { $numToSelect } egyedi érték egy { $numPossibleValues } hosszú sorozatból

select-prime-numbers-too-few-values = Nem választható ki { $numToSelect } érték egy { $numValues } hosszú prímszámlistából

select-prime-numbers-values-count-mismatch = A select számára megadott értékek számának meg kell egyeznie a kiválasztandók számával

select-prime-numbers-values-not-prime = A prímszám kiválasztásához megadott minden értéknek szerepelnie kell a prímszámlistában

select-prime-numbers-values-excluded-combination = A selectPrimeNumbers megadott értékei kizárt kombinációt alkottak

select-prime-numbers-excluded-too-many-combinations = A selectPrimeNumbers a kombinációk több mint 70%-át kizárta

select-random-combination-fluke = Rendkívül valószínűtlen véletlen folytán nem sikerült véletlen értékek kombinációját kiválasztani

select-random-value-fluke = Rendkívül valószínűtlen véletlen folytán nem sikerült véletlen értéket kiválasztani
