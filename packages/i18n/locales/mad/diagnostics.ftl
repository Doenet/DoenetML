# Madurese diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Written throughout in enjâ'-iyâ, the plain everyday speech level; see
# `chrome.ftl`'s header.
#
# Madurese marks no number on the noun, so a counted message whose only English
# difference is the noun's number renders one string here and the select is
# dropped. The count still arrives and is still formatted.


## `<lineSegment>`

# No select: «ta' èanggep» does not agree with what is ignored, and the list
# carries no number of its own.
line-segment-attributes-ignored-with-endpoints = { $attributes } ta' èanggep mon dhuwâ' konco'na la èpastèagi

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } ta' èanggep mon settong konco' ban tengngana la èpastèagi kadhuwâ

line-segment-midpoint-offset-without-midpoint = midpointOffset tadâ' gunana mon tadâ' tengngana

## `<line>`

line-points-undetermined-dimensions = Garis se lèbât e titik se dimensina ta' tanto.

line-points-too-few-dimensions = Garis kodu lèbât e titik se badâ dhuwâ' dimensina.

line-points-depend-on-variables = Garis lèbât e titik se agântong ka variabel: { $variables }.

line-equation-invalid-format = Format persamaan garis se ta' sah e variabel { $variable1 } ban { $variable2 }.

## `<ray>`

ray-overprescribed-through = Sinar èpastèagi bi' through, endpoint ban direction.  through se èpastèagi ta' èanggep.

ray-dimension-mismatch = numDimensions ta' cocok e sinar.

## `<vector>`

vector-overprescribed-head = Vektor èpastèagi bi' head, tail ban displacement.  head se èpastèagi ta' èanggep.

vector-dimension-mismatch = numDimensions ta' cocok e vektor.

## Attracting and constraining

attract-to-without-nearest-point = Ta' bisa narè' ka `<{ $component }>` sabab tadâ' variabel kaadaan nearestPoint-na.

constrain-to-without-nearest-point = Ta' bisa ngèket ka `<{ $component }>` sabab tadâ' variabel kaadaan nearestPoint-na.

constrain-to-interior-without-nearest-point = Ta' bisa ngèket ka dâlem `<{ $component }>` sabab tadâ' variabel kaadaan nearestPoint-na.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ta' èanggep e choiceInput se ta' inline

## Ordering children by index

choice-input-indices-count-mismatch = Indeks se èpastèagi kaangguy choiceInput ta' èanggep sabab bânnya'na indeks ta' cocok bân bânnya'na ana' pelean.

pretzel-indices-count-mismatch = Indeks se èpastèagi kaangguy problem ta' èanggep sabab bânnya'na indeks ta' cocok bân bânnya'na ana' problem.

shuffle-indices-count-mismatch = Indeks se èpastèagi kaangguy shuffle ta' èanggep sabab bânnya'na indeks ta' cocok bân bânnya'na komponen.

indices-ignored-out-of-range = Indeks se èpastèagi kaangguy { $component } ta' èanggep sabab badâ indeks se lebbi dâri jangkauan.

pretzel-indices-repeated = Indeks se èpastèagi kaangguy pretzel ta' èanggep sabab badâ indeks se èolang.

pretzel-circuit-first-index = Indeks se èpastèagi kaangguy pretzel e mode circuit ta' èanggep sabab indeks se dâ'-adâ' kodu 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Sopaja `<{ $component }>` bisa ajhâlân bân ana' string, atribut `type` kodu èpastèagi.

invalid-type-defaulting-to-math = type { $type } ta' sah kaangguy komponen { $component }. Kodu sala settong dâri math, text, number, otabâ boolean. Ngangguy math.

string-not-valid-component-to-arrange = String "{ $value }" banne komponen se sah kaangguy { $component }. Ta' èanggep.

## Types and variables

invalid-type-defaulting-to-number = type { $type } ta' sah, type èsabâ' ka number.

invalid-variable-value = Nilai variabel se ta' sah: `{ $value }`

## Variants

variant-index-must-be-number = Indeks varian { $index } kodu angka

variant-index-must-be-integer = Indeks varian { $index } kodu bilangan bulat

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` gi' ta' èterapaghi kaangguy okoran mutlak. Lèbârra èsabâ' relatif.

side-by-side-absolute-margins = `<{ $component }>` gi' ta' èterapaghi kaangguy okoran mutlak. Marginna èsabâ' relatif.

side-by-side-no-block-child = `<{ $component }>` ta' sah: kodu badâ settong ana' block-na.

## `<label>`

label-for-ignored-on-graphical = Atribut `for` e `<label>` grafis ta' èanggep.

label-for-must-resolve-to-one = Atribut `for` e `<label>` kodu noduwagi pas ka settong komponen.

label-for-unresolved = Atribut `for` e `<label>` ta' bisa noduwagi ka komponen.

label-for-answer-with-authored-inputs = Atribut `for` e `<label>` noduwagi ka `<answer>` se badâ input se ètolès bi' se ngarang; toduwagi input rowa langsong.

label-for-answer-without-input = Atribut `for` e `<label>` noduwagi ka `<answer>` se tadâ' inputta se èlabelè.

label-for-must-reference-input-or-answer = Atribut `for` e `<label>` kodu noduwagi ka settong input otabâ settong answer.

## Accessibility

accessibility-short-description-or-decorative = Kaangguy aksesibilitas, `<{ $component }>` kodu badâ katerrangan pandhâ' otabâ èpastèagi menangka hiasan.

accessibility-video-short-description = Kaangguy aksesibilitas, `<video>` kodu badâ katerrangan pandhâ'.

accessibility-input-short-description-or-label = Kaangguy aksesibilitas, `<{ $component }>` kodu badâ katerrangan pandhâ' otabâ label.

accessibility-answer-input-short-description-or-label = Kaangguy aksesibilitas, `<answer>` se agabây input kodu badâ katerrangan pandhâ' otabâ label.

accessibility-short-description-contains-math = Katerrangan pandhâ' ta' olle badâ komponen matematika akadi `<{ $component }>`. Tolès matematikana ngangguy oca'.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Kontras { $colorName } korang kaangguy teks judul bâgiyân (mode petteng) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; parlo sakone'na { $threshold }:1).
       *[other] Kontras { $colorName } korang kaangguy teks judul bâgiyân ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; parlo sakone'na { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` se lèbât e { $count } titik gi' ta' èterapaghi mon titikka tadâ' nilai angkana.

circle-too-many-through-points = Ta' bisa ngètong bunderan se lèbât e lebbi dâri 3 titik.

circle-overprescribed-radius-center-points = Ta' bisa ngètong bunderan se èpastèagi jhâri-jhârina, tengngana ban titik se èlèbâdi.

circle-center-with-multiple-points = Ta' bisa ngètong bunderan se èpastèagi tengngana tapè lèbât e lebbi dâri 1 titik.

circle-radius-too-small = Ta' bisa ngètong bunderan: sabab jârâ'na dhuwâ' titik rowa { $distance }, jhâri-jhâri { $radius } se èpastèagi ce' kene'na.

circle-radius-with-many-points = Ta' bisa agabây bunderan se lèbât e lebbi dâri dhuwâ' titik bân jhâri-jhâri se èpastèagi.

circle-invalid-center-or-through-points = Tengngana otabâ titik se èlèbâdi bunderan ta' sah.

circle-radius-center-with-multiple-points = Ta' bisa ngètong jhâri-jhâri bunderan se èpastèagi tengngana tapè lèbât e lebbi dâri 1 titik.

circle-change-radius-non-numerical = Ta' bisa ngoba jhâri-jhâri bunderan se lèbât e titik se ta' aangka

circle-radius-with-points-non-numerical = Ta' bisa agabây bunderan se lèbât e lebbi dâri settong titik bân jhâri-jhâri se èpastèagi mon tadâ' nilai angkana.

circle-change-center-non-numerical = Ngoba tengngana bunderan se lèbât e titik se tadâ' nilai angkana gi' ta' èterapaghi.

## `<function>`

# English's two counts multiply out to four sentences; Madurese has one, because
# «interval» and «input» do not change for number. Both selects are dropped and
# both counts still arrive.
function-domain-insufficient-dimensions = Dimensi domain kaangguy fungsi korang. Domainna badâ { $intervals } interval tapè fungsina badâ { $inputs } input.

function-domain-invalid-format = Format domain kaangguy fungsi ta' sah.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Nilai se paleng tenggi dâri fungsi se ta' aangka ta' èanggep.
        [minimum] Nilai se paleng bâbâ dâri fungsi se ta' aangka ta' èanggep.
        [extremum] Ekstremum fungsi se ta' aangka ta' èanggep.
        [point] Titik fungsi se ta' aangka ta' èanggep.
        [slope] Kamèrèngan fungsi se ta' aangka ta' èanggep.
       *[other] { $type } fungsi se ta' aangka ta' èanggep.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Nilai se paleng tenggi dâri fungsi se kosong ta' èanggep.
        [minimum] Nilai se paleng bâbâ dâri fungsi se kosong ta' èanggep.
        [extremum] Ekstremum fungsi se kosong ta' èanggep.
        [point] Titik fungsi se kosong ta' èanggep.
       *[other] { $type } fungsi se kosong ta' èanggep.
    }

function-points-too-close = Fungsina badâ dhuwâ' titik se ce' semma'na. Fungsina ta' bisa èbâtessè.

# Both selects dropped, for the reason above.
function-iterates-input-output-mismatch = Iterasi fungsi pera' bisa mon bânnya'na input padâ bân bânnya'na output. Fungsi rèya badâ { $inputs } input ban { $outputs } output.

## `<sequence>`

sequence-invalid-length = Lanjhângnga sequence ta' sah.  Kodu bilangan bulat se ta' negatif.

sequence-invalid-step = step sequence ta' sah.  Kodu angka kaangguy sequence type { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" sequence angka ta' sah.  Kodu angka.

sequence-invalid-endpoint-letters = "{ $attribute }" sequence huruf ta' sah.  Kodu kombinasi huruf.

sequence-invalid-endpoint = "{ $attribute }" sequence ta' sah.

select-from-sequence-coprime-not-numbers = coprime ta' èanggep sabab se èpele banne angka

select-from-sequence-coprime-with-exclude-combinations = coprime ta' èanggep sabab excludeCombinations èpastèagi

## Resolving a `target`

target-not-found = target ta' sah kaangguy `<{ $source }>`: targetta ta' etemmo.

target-state-variable-not-found = target ta' sah kaangguy `<{ $source }>`: variabel kaadaan se anyama "{ $property }" ta' etemmo e `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Variabel `<odeSystem>` kodu bidâ dâri variabel bebas.

ode-system-duplicate-variable-names = Ta' bisa mâbâtes fungsi RHS ODE se nyamana variabel agântongnga padâ.

ode-system-rhs-function-error = Ta' bisa mâbâtes fungsi RHS ODE.  Badâ kasalaan e bakto agabây fungsi mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ta' bisa mâbâtes sudut e antarana { $count } garis

angle-invalid-through-point = Titik se ta' sah e through `<angle>`

parabola-vertex-too-many-points = Parabola se badâ pucca'na tapè lèbât e lebbi dâri 1 titik gi' ta' èterapaghi.

parabola-too-many-points = Parabola se lèbât e lebbi dâri 3 titik gi' ta' èterapaghi.

intersection-too-many-items = Papotongan kaangguy lebbi dâri dhuwâ' bârâng gi' ta' èterapaghi

## Other math components

ionic-compound-not-two-ions = Sanyawa ionik kaangguy se laèn dâri dhuwâ' ion gi' ta' èterapaghi.

ionic-compound-needs-cation-and-anion = Sanyawa ionik èterapaghi pera' kaangguy settong kation ban settong anion.

solve-equations-cannot-evaluate = Ta' bisa maberes persamaan sabab persamaanna ta' bisa ènilai: { $equation }

math-operators-operand-number-required = operandNumber kodu èpastèagi mon ngala' operand matematika.

eigen-decomposition-failed = Ta' bisa ngètong eigenvalue matriks

## `<matchesPattern>`

# No select: the parameter list carries no number that the noun would show.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: parameter { $parameters } ta' kalowar e pattern, daddi salanjângnga cocok bân se kosong.

## `<graph>`

graph-grid-invalid = `<graph>`: ta' ngarté grid="{ $grid }". Kodu none, medium, dense, otabâ dhuwâ' angka positif se èpèsa spasi, akadi grid="1 0.5". Tadâ' grid se èghâmbhâr.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ta' èdukung e renderer prefigure; ngangguy tengka posisi kanan.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ta' èdukung e renderer prefigure; ngangguy tengka posisi attas.

prefigure-invalid-axis-bounds = `<graph>`: bâtessa sumbu ta' sah kaangguy konversi prefigure; ngangguy bbox baku (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: lèbârra ta' sah kaangguy konversi prefigure; ngangguy lèbâr diagram baku 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio ta' sah kaangguy konversi prefigure; ngangguy aspect ratio baku 1.

prefigure-grid-spacing-too-fine = `<graph>`: jârâ'na grid ce' semma'na kaangguy bâtessa sumbu; grid ta' èghâmbhâr e renderer prefigure.

prefigure-annotations-not-rendered = `<graph>`: annotation ta' èghâmbhâr mon ta' ngangguy renderer PreFigure.

multiple-annotations-children = Bânnya' ana' `<annotations>` etemmo e `<graph>`; sakabbinna ta' èanggep kajhâbâ se dhi'-budhi'na.

## Referring to other components

copy-unrecognized-component-type = Ta' bisa manjhâng otabâ nyalèn jhinis komponen se ta' ètao: { $type }.

copy-prop-not-found = Prop { $property } ta' etemmo e komponen jhinis { $component }

collect-no-source = Tadâ' source se etemmo kaangguy collect.

collect-invalid-component-type = Ta' bisa ngompol komponen jhinis `<{ $component }>` sabab jhinis komponenna ta' sah.

reference-index-unavailable = Ta' bisa nyebbut indeks `{ $reference }`

## `<callAction>`

component-action-unavailable = Ta' bisa nyellok { $action } e komponen `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Bentuk datana ta' sah.  Lanjhângnga baris ta' padâ. Etemmo e componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Datana badâ nyama kolom se padâ.  Etemmo e componentIdx :{ $componentIdx }

data-frame-missing-column-name = Datana korang nyama kolom.  Etemmo e componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Award jhâwâban rèya adâsar ka jhâwâban se èkèrèm bi' answer tag dibi', ban rèya bâkal magibâ tengka se ta' èarep.

answer-max-num-attempts-in-section-wide-check-work = Nyabâ' `maxNumAttempts` e `<answer>` e dâlem wadâ se badâ `sectionWideCheckWork` tadâ' gunana, sabab wadâna se ngator bânnya'na coba. Sabâ' `maxNumAttempts` e wadâna.

nested-section-wide-check-work-max-num-attempts = Nyabâ' `maxNumAttempts` e wadâ se badâ `sectionWideCheckWork` se badâ e dâlem wadâ laèn se badâ `sectionWideCheckWork` tadâ' gunana, sabab wadâ se e lowar se ngator bânnya'na coba. Sabâ' `maxNumAttempts` e wadâ se e lowar.

# No select: «atribut» is the same word for one and for many.
answer-attributes-need-symbolic-equality = Atribut { $attributes } tadâ' gunana mon symbolicEquality ta' èsabâ'.

answer-invalid-type = Jhinis jhâwâban se ta' sah: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Sabab komponen `<{ $component }>` tadâ' nyamana, rowa ta' bisa èangguy kaangguy atribut module

module-attribute-name-already-defined = Komponen `<{ $component } name="{ $name }">` ta' bisa èangguy menangka atribut module sabab jhinis komponen `<module>` la badâ atribut "{ $name }"-na.

conditional-content-condition-ignored = Atribut `condition` ta' èanggep e komponen `<conditionalContent>` se badâ ana' case otabâ else.

slider-markers-type-mismatch = Jhinis marker ta' cocok bân jhinis slider.

pretzel-problem-needs-statement-and-answer = Pretzel ta' sah: sabbân `<problem>` kodu badâ settong `<statement>` ban settong `<answer>`.

pretzel-circuit-first-problem-distractor = Pretzel ta' sah: e mode="circuit", `<problem>` se dâ'-adâ' ta' olle distractor.

## Attribute values

# No select: «nilai» is the same word for one and for many.
attribute-invalid-values = Nilai { $values } ta' sah kaangguy atribut `{ $attribute }`; ta' èanggep.

attribute-must-be-references = Nilai `{ $value }` ta' sah kaangguy atribut `{ $attribute }`. Atribut kodu èsoson dâri rujuan se molaè bân `$`.

math-input-invalid-function-names = <mathInput>: nyamana fungsi se ta' sah e { $attribute } ta' èanggep: { $names }. Sabbân nyama kodu badâ 2 karakterra (huruf otabâ tanda sambung); olle èterrossagi sufiks `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Jhinis komponen se ta' sah: `<{ $componentType }>`

attribute-repeated = Atribut { $attribute } ta' olle èolang.

attribute-invalid-for-component = Atribut "{ $attribute }" ta' sah kaangguy komponen jhinis `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Kontras bâtessa gaya { $styleNumber } korang kaangguy { $context ->
        [text-on-background] wârnana teks nyabâ' wârnana latar
        [high-contrast] wârna kontras tenggi nyabâ' kanvas
        [line] wârnana garis nyabâ' kanvas
        [marker] wârnana marker nyabâ' kanvas
       *[text-on-canvas] wârnana teks nyabâ' kanvas
    }{ $mode ->
        [dark] { " (mode petteng)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; parlo sakone'na { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Maskè bâtessa gaya { $styleNumber } badâ wârna se èpastèagi bân kontras se cokop kaangguy mode terrang, kontras wârnana teks nyabâ' wârnana latar korang e wârna se èkala' kaangguy mode petteng ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; parlo sakone'na { $threshold }:1). { $suggestion ->
        [available] Sopaja kontrassa cokop e mode petteng, tambâ kontras mode terrang (contona, sabâ' { $lightAttribute }="{ $lightColor }") otabâ genté wârna mode petteng (contona, sabâ' { $darkAttribute }="{ $darkColor }").
       *[none] Sopaja kontrassa cokop e mode petteng, tambâ kontras mode terrang otabâ genté wârna se èkala' bân textColorDarkMode ban/otabâ backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Maskè bâtessa gaya { $styleNumber } badâ wârnana teks se èpastèagi bân kontras se cokop kaangguy mode terrang, kontras wârnana teks se èkala' kaangguy mode petteng korang nyabâ' kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; parlo sakone'na { $threshold }:1). { $suggestion ->
        [available] Sopaja kontrassa cokop e mode petteng, tambâ kontras mode terrang (contona, sabâ' textColor="{ $lightColor }") otabâ genté wârna mode petteng (contona, sabâ' textColorDarkMode="{ $darkColor }").
       *[none] Sopaja kontrassa cokop e mode petteng, tambâ kontras mode terrang otabâ genté wârna se èkala' bân textColorDarkMode.
    }

section-multiple-style-palettes = Settong bâgiyân pera' olle mele settong <stylePalette>; ngangguy se dhi'-budhi'na.

## Unique variants

variant-num-to-select-not-non-negative-integer = ta' bisa mastèagi varian tunggâl { $component } sabab numToSelect banne bilangan bulat se ta' negatif.

variant-num-to-select-not-constant-number = ta' bisa mastèagi varian tunggâl { $component } sabab numToSelect banne angka tetep.

variant-with-replacement-not-constant-boolean = ta' bisa mastèagi varian tunggâl { $component } sabab withReplacement banne boolean tetep.

variant-select-weight-disables-unique = Varian tunggâl kaangguy select èmatèagi mon badâ opsi se èpastèagi selectWeight otabâ selectForVariants

variant-coprime-undetermined = ta' bisa mastèagi varian tunggâl { $component } sabab ta' bisa èpastèagi coprime salanjângnga false.

variant-attribute-not-constant = ta' bisa mastèagi varian tunggâl { $component } sabab { $attribute } ta' tetep.

variant-attribute-not-number = ta' bisa mastèagi varian tunggâl { $component } sabab { $attribute } banne angka.

variant-attribute-wrong-type-for-sequence =
    ta' bisa mastèagi varian tunggâl { $component } jhinis { $type } sabab { $attribute } banne { $expected ->
        [letters-combination] kombinasi huruf
        [math-expression] ungkapan matematika se sah
        [integer] bilangan bulat
       *[number] angka
    }.

variant-length-not-integer = ta' bisa mastèagi varian tunggâl { $component } sabab length banne bilangan bulat.

variant-sort-not-implemented = varian tunggâl { $component } se badâ sort-na gi' ta' èterapaghi

variant-exclude-combinations-not-implemented = varian tunggâl { $component } se badâ excludeCombinations-sa gi' ta' èterapaghi

variant-math-exclude-not-implemented = varian tunggâl { $component } jhinis math se badâ exclude-na gi' ta' èterapaghi

variant-non-constant-exclude-not-implemented = varian tunggâl { $component } se badâ exclude ta' tetep gi' ta' èterapaghi

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ta' èdukung e renderer prefigure graph; katoronanna èlangkae.

prefigure-descendant-invalid-geometry = { $subject }: geometrina ta' abâtes otabâ ta' ganna'; katoronanna èlangkae.

prefigure-curve-label-omitted = { $subject }: label ta' èdukung e elemen lengkong se èkonversi; labella ta' èanggep.

prefigure-curve-unsupported-definition-type = { $subject }: jhinis bâtessa fungsi lengkong '{ $definitionType }' ta' èdukung; katoronanna èlangkae.

prefigure-region-flip-functions-unsupported = { $subject }: atribut flipFunctions e regionBetweenCurves ta' èdukung; katoronanna èlangkae.

prefigure-region-non-formula-child = { $subject }: pera' ana' fungsi jhinis formula se èdukung e regionBetweenCurves; katoronanna èlangkae.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' ta' èdukung kaangguy { $labelKind ->
        [line-family] label kaluarga garis
       *[point] label titik
    }; ngangguy perataan baku PreFigure.

prefigure-fill-style-unsupported = { $subject }: gaya essè '{ $fillStyle }' ta' èdukung bi' PreFigure; abâli ka essè se padet.

prefigure-line-style-unknown = { $subject }: gaya garis '{ $lineStyle }' ta' ètao, ta' èanggep e output PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: gaya marker '{ $markerStyle }' èpetakaghi ka gaya 'diamond' PreFigure.

prefigure-marker-style-unsupported = { $subject }: gaya marker '{ $markerStyle }' ta' èdukung bi' PreFigure; ngangguy gaya baku.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ta' sah; targetta ta' bisa èduduwagi. Annotationna ta' èanggep.

annotation-ref-multiple-targets = `<annotation>`: `ref` noduwagi ka bânnya' target; ngangguy target se dâ'-adâ'.

annotation-ref-outside-graph = `<annotation>`: `ref` ta' sah; targetta badâ e lowarra graph se badâ jârowa. Annotationna ta' èanggep.

annotation-ref-unsupported-target = `<annotation>`: `ref` ta' sah; targetta banne objek grafis se èdukung e konversi prefigure. Annotationna ta' èanggep.

annotation-text-missing = `<annotation>`: `text` korang otabâ kosong; makalowar teks kosong.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Etemmo kagântongan se abunder.
       *[other] Etemmo kagântongan se abunder se agâbung bân komponen `<{ $componentType }>`.
    }

reference-no-referent = Tadâ' se etemmo se èdduduwagi rujuanna: `{ $reference }`

reference-multiple-referents = Bânnya' se etemmo se èdduduwagi rujuanna: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format atribut { $attribute } e `<{ $componentType }>` ta' sah.

children-invalid = Ana' `<{ $componentType }>` ta' sah: etemmo ana' se ta' sah: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Nilai `{ $value }` ta' sah kaangguy atribut `{ $attribute }`, ngangguy nilai `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Versi DoenetML { $version } ta' etemmo.
       *[other] Versi DoenetML { $version } ta' etemmo. Abâli ka versi { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ta' sah: { $content }

parse-tag-missing-close-tag = DoenetML ta' sah: Tag `{ $tag }` tadâ' tag panotobba. Èarep tag se notop dibi' otabâ tag `</{ $tagName }>`.

parse-tag-error = DoenetML ta' sah: Badâ kasalaan e tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML ta' sah: Atribut `{ $attribute }` se ta' sah akadi korang nilaina.

parse-attribute-invalid = DoenetML ta' sah: Atribut `{ $attribute }` ta' sah

parse-attribute-value-invalid = DoenetML ta' sah: Nilai atribut `{ $value }` ta' sah

parse-attribute-value-quote-mismatch = DoenetML ta' sah: Nilai atribut `{ $value }` ta' sah. Tanda kutebba ta' cocok. Akadi korang settong `{ $quote }`

parse-open-tag-name-missing = DoenetML ta' sah: Etemmo tag se tadâ' nyamana, contona `<`

parse-tag-not-closed = DoenetML ta' sah: Tag `{ $tag }` ta' ètotop (akadi korang `>`).

parse-self-closing-tag-name-missing = DoenetML ta' sah: Etemmo tag se tadâ' nyamana `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ta' sah: Tag `{ $tag }` ta' ètotop (akadi korang `/>`).

parse-tag-invalid-attributes = DoenetML ta' sah: Tag `{ $tag }` ta' sah. Bisa jhâ' atributta ta' bendher.

parse-close-tag-name-missing = DoenetML ta' sah: Etemmo tag panotob se tadâ' nyamana, contona `</`

parse-attribute-value-unquoted = Nilai atribut kodu èsabâ' e dâlem tanda kuteb: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ta' sah: Etemmo tag panotob `{ $tag }`, tapè tadâ' tag pambukka' se cocok

parse-close-tag-mismatched = DoenetML ta' sah: Tag panotobba ta' cocok. Èarep `</{ $expected }>`. Etemmo `{ $found }`

parser-node-unconvertible = Node { $node } ta' bisa èkonversi daddi node Dast.

## Names

name-attribute-invalid =
    Atribut name='{ $name }' ta' sah. { $reason ->
        [characters] Nyama pera' olle badâ huruf, angka, garis bâbâ otabâ tanda sambung.
       *[start] Nyama kodu molaè bân huruf.
    }

component-name-invalid-start = Nyamana komponen "{ $name }" ta' sah. Nyama kodu molaè bân huruf.

## `<answer>` sugar

answer-video-watched-missing-video = Answer se type videoWatched kodu badâ atribut video-na

answer-video-watched-video-not-reference = Answer se type videoWatched kodu badâ atribut video se aropa rujuan

answer-name-not-single-text = Atribut name e answer kodu badâ settong ana' text malolo

## Referencing another document

external-doenetml-recursion-limit = Ta' bisa ngala' DoenetML dâri lowar sabab tingkat ngolangnga ce' bânnya'na. Badâ rujuan se abunder?

external-doenetml-unavailable = Ta' bisa ngala' DoenetML dâri { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML se èkala' dâri { $attribute }="{ $uri }" ta' sah: rowa ta' cocok bân jhinis komponen "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` ta' èangguy pole; angguy `{ $to }`.
       *[other] [deprecation] Atribut `{ $from }` e `<{ $component }>` ta' èangguy pole; angguy `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` ta' èangguy pole ban ta' èanggep sabab `{ $to }` èpastèagi keya.
       *[other] [deprecation] Atribut `{ $from }` e `<{ $component }>` ta' èangguy pole ban ta' èanggep sabab `{ $to }` èpastèagi keya.
    }

deprecated-attribute-ignored = [deprecation] Atribut `{ $attribute }` e `<{ $component }>` ta' èangguy pole ban ta' èanggep.

deprecated-attribute-to-child = [deprecation] Atribut `{ $attribute }` e `<{ $component }>` ta' èangguy pole; angguy ana' `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Nilai `{ $value }` e atribut `{ $attribute }` e `<{ $component }>` ta' èangguy pole; angguy `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` pera' bisa mabânnya' bâsa Inggris, daddi teksa ta' aoba e dokumen se ètolès bân { $locale }. Tolès langsong bentuk bânnya'na, otabâ sabâ' bân atribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elemen `<{ $tag }>` banne elemen Doenet se ètao.

schema-element-not-allowed-at-root = Elemen `<{ $tag }>` ta' èolèagi e ramona dokumen.

schema-element-not-allowed-inside = Elemen `<{ $tag }>` ta' èolèagi e dâlem `<{ $parent }>`.

schema-attribute-unrecognized = Elemen `<{ $tag }>` tadâ' atribut se anyama `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribut `{ $attribute }` e elemen `<{ $tag }>` kodu aropa daftar se sabbân essèna sala settong dâri: { $allowed }
       *[other] Atribut `{ $attribute }` e elemen `<{ $tag }>` kodu sala settong dâri: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nyamana varian ta' sah kaangguy select.  Nyamana varian { $variantName } kalowar e { $numOptions } opsi tapè bânnya'na se èpelea { $numToSelect }.

select-variant-name-without-options = Badâ varian se èpastèagi kaangguy select tapè tadâ' opsi se èpastèagi kaangguy nyamana varian se bisa: { $variantName }.

select-variant-name-not-possible = Nyamana varian { $variantName } se èpastèagi kaangguy select banne nyamana varian se bisa.

select-too-few-options = Ta' bisa mele { $numToSelect } komponen dâri { $numOptions } malolo.

select-from-sequence-too-few-values = Ta' bisa mele { $numToSelect } nilai dâri sequence se lanjhângnga { $length }.

select-from-sequence-indices-count-mismatch = Bânnya'na indeks se èpastèagi kaangguy select kodu cocok bân bânnya'na se èpelea

select-from-sequence-indices-not-integers = Sakabbinna indeks se èpastèagi kaangguy select kodu bilangan bulat

select-from-sequence-index-excluded = Indeks selectfromsequence se èpastèagi rowa èkalowarraghi

select-from-sequence-indices-excluded-combination = Indeks selectfromsequence se èpastèagi rowa kombinasi se èkalowarraghi

select-from-sequence-coprime-not-positive-integers = Ta' bisa mele kombinasi coprime sabab se èpele banne bilangan bulat positif.

select-from-sequence-coprime-common-factor = Ta' bisa mele angka coprime. Sakabbinna nilai se bisa badâ faktor se padâ. (Nilai "from" otabâ "to" se èpastèagi kodu coprime bân "step".)

select-from-sequence-coprime-single-number = Ta' bisa mele kombinasi coprime dâri settong angka se banne 1.

select-from-sequence-excluded-too-many-combinations = Lebbi dâri 70% kombinasina èkalowarraghi e selectFromSequence

select-from-sequence-coprime-none-found = Ta' bisa mele angka coprime. Sakabbinna nilai se bisa badâ faktor se padâ.

select-from-sequence-too-few-unique-values = Ta' bisa mele { $numToSelect } nilai tunggâl dâri sequence se lanjhângnga { $numPossibleValues }

select-prime-numbers-too-few-values = Ta' bisa mele { $numToSelect } nilai dâri daftar prima se lanjhângnga { $numValues }

select-prime-numbers-values-count-mismatch = Bânnya'na nilai se èpastèagi kaangguy select kodu cocok bân bânnya'na se èpelea

select-prime-numbers-values-not-prime = Sakabbinna nilai se èpastèagi kaangguy select prime number kodu badâ e daftar prima

select-prime-numbers-values-excluded-combination = Nilai selectPrimeNumbers se èpastèagi rowa kombinasi se èkalowarraghi

select-prime-numbers-excluded-too-many-combinations = Lebbi dâri 70% kombinasina èkalowarraghi e selectPrimeNumbers

select-random-combination-fluke = Sabab ontong se ce' jhârângnga, ta' bisa mele kombinasi nilai acak

select-random-value-fluke = Sabab ontong se ce' jhârângnga, ta' bisa mele nilai acak
