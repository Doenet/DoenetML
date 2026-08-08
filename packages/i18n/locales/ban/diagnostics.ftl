# Balinese diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Written throughout in basa andap, the unmarked everyday speech level; see
# `chrome.ftl`'s header.
#
# Balinese marks no number on the noun, so a counted message whose only English
# difference is the noun's number renders one string here and the select is
# dropped. The count still arrives and is still formatted.


## `<lineSegment>`

# No select: «kalempasin» does not agree with what is ignored, and the list
# carries no number of its own.
line-segment-attributes-ignored-with-endpoints = { $attributes } kalempasin yen dadua tanggune suba katentuang

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } kalempasin yen tanggu lan tengah-tengahne suba katentuang makadadua

line-segment-midpoint-offset-without-midpoint = midpointOffset tusing madaya yen tusing ada tengah-tengah

## `<line>`

line-points-undetermined-dimensions = Garis ane liwat titik ane dimensine tusing pasti.

line-points-too-few-dimensions = Garise patut liwat titik ane madimensi paling bedik dadua.

line-points-depend-on-variables = Garise liwat titik ane gumantung ring variabel: { $variables }.

line-equation-invalid-format = Format persamaan garis ane tusing sah ring variabel { $variable1 } lan { $variable2 }.

## `<ray>`

ray-overprescribed-through = Sinare katentuang baan through, endpoint lan direction.  through ane katentuang kalempasin.

ray-dimension-mismatch = numDimensions tusing cocok di sinar.

## `<vector>`

vector-overprescribed-head = Vektore katentuang baan head, tail lan displacement.  head ane katentuang kalempasin.

vector-dimension-mismatch = numDimensions tusing cocok di vektor.

## Attracting and constraining

attract-to-without-nearest-point = Tusing nyidang narik ka `<{ $component }>` krana ia tusing ngelah variabel kahanan nearestPoint.

constrain-to-without-nearest-point = Tusing nyidang ngiket ka `<{ $component }>` krana ia tusing ngelah variabel kahanan nearestPoint.

constrain-to-interior-without-nearest-point = Tusing nyidang ngiket ka tengah `<{ $component }>` krana ia tusing ngelah variabel kahanan nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition kalempasin di choiceInput ane tusing inline

## Ordering children by index

choice-input-indices-count-mismatch = Indeks ane katentuang anggon choiceInput kalempasin krana liun indekse tusing cocok teken liun pianak pilihane.

pretzel-indices-count-mismatch = Indeks ane katentuang anggon problem kalempasin krana liun indekse tusing cocok teken liun pianak problem.

shuffle-indices-count-mismatch = Indeks ane katentuang anggon shuffle kalempasin krana liun indekse tusing cocok teken liun komponene.

indices-ignored-out-of-range = Indeks ane katentuang anggon { $component } kalempasin krana ada indeks ane liwat jangkauan.

pretzel-indices-repeated = Indeks ane katentuang anggon pretzel kalempasin krana ada indeks ane mabalik.

pretzel-circuit-first-index = Indeks ane katentuang anggon pretzel di mode circuit kalempasin krana indeks ane paling malu patut 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Apang `<{ $component }>` majalan ajak pianak string, atribut `type` patut katentuang.

invalid-type-defaulting-to-math = type { $type } tusing sah anggon komponen { $component }. Patut abesik uli math, text, number, utawi boolean. Nganggon math.

string-not-valid-component-to-arrange = String "{ $value }" tusing dadi komponen ane sah anggon { $component }. Kalempasin.

## Types and variables

invalid-type-defaulting-to-number = type { $type } tusing sah, typene kasetel dadi number.

invalid-variable-value = Nilai variabel ane tusing sah: `{ $value }`

## Variants

variant-index-must-be-number = Indeks varian { $index } patut angka

variant-index-must-be-integer = Indeks varian { $index } patut bilangan bulat

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` enu tusing kaimplementasi anggon ukuran absolut. Lebarne kasetel dadi relatif.

side-by-side-absolute-margins = `<{ $component }>` enu tusing kaimplementasi anggon ukuran absolut. Margine kasetel dadi relatif.

side-by-side-no-block-child = `<{ $component }>` tusing sah: ia patut ngelah paling bedik abesik pianak block.

## `<label>`

label-for-ignored-on-graphical = Atribut `for` di `<label>` grafis kalempasin.

label-for-must-resolve-to-one = Atribut `for` di `<label>` patut nuju pas abesik komponen.

label-for-unresolved = Atribut `for` di `<label>` tusing nyidang nuju komponen.

label-for-answer-with-authored-inputs = Atribut `for` di `<label>` nuju `<answer>` ane ngelah input ane katulis baan pangawine; tujuang inputne langsung.

label-for-answer-without-input = Atribut `for` di `<label>` nuju `<answer>` ane tusing ngelah input anggon kalabelin.

label-for-must-reference-input-or-answer = Atribut `for` di `<label>` patut nuju input utawi answer.

## Accessibility

accessibility-short-description-or-decorative = Anggon aksesibilitas, `<{ $component }>` patut ngelah deskripsi bawak utawi katentuang dadi dekoratif.

accessibility-video-short-description = Anggon aksesibilitas, `<video>` patut ngelah deskripsi bawak.

accessibility-input-short-description-or-label = Anggon aksesibilitas, `<{ $component }>` patut ngelah deskripsi bawak utawi label.

accessibility-answer-input-short-description-or-label = Anggon aksesibilitas, `<answer>` ane ngae input patut ngelah deskripsi bawak utawi label.

accessibility-short-description-contains-math = Deskripsi bawak tusing patut misi komponen matematika buka `<{ $component }>`. Tulisang matematikane aji kruna.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Kontras { $colorName } kuang anggon teks judul bab (mode peteng) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; merluang paling bedik { $threshold }:1).
       *[other] Kontras { $colorName } kuang anggon teks judul bab ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; merluang paling bedik { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` ane liwat { $count } titik enu tusing kaimplementasi yen titike tusing ngelah nilai numerik.

circle-too-many-through-points = Tusing nyidang ngitung bunderan ane liwat lebih teken 3 titik.

circle-overprescribed-radius-center-points = Tusing nyidang ngitung bunderan ane katentuang jejeg, tengah lan titik ane kaliwatin.

circle-center-with-multiple-points = Tusing nyidang ngitung bunderan ane katentuang tengahne tur liwat lebih teken 1 titik.

circle-radius-too-small = Tusing nyidang ngitung bunderan: krana jarak titike dadua { $distance }, jejeg { $radius } ane katentuang cenik gati.

circle-radius-with-many-points = Tusing nyidang ngae bunderan ane liwat lebih teken dadua titik ajak jejeg ane katentuang.

circle-invalid-center-or-through-points = Tengah utawi titik ane kaliwatin baan bunderane tusing sah.

circle-radius-center-with-multiple-points = Tusing nyidang ngitung jejeg bunderan ane katentuang tengahne tur liwat lebih teken 1 titik.

circle-change-radius-non-numerical = Tusing nyidang ngubah jejeg bunderan ane liwat titik ane tusing numerik

circle-radius-with-points-non-numerical = Tusing nyidang ngae bunderan ane liwat lebih teken abesik titik ajak jejeg ane katentuang yen tusing ada nilai numerik.

circle-change-center-non-numerical = Ngubah tengah bunderan ane liwat titik ane tusing ngelah nilai numerik enu tusing kaimplementasi.

## `<function>`

# English's two counts multiply out to four sentences; Balinese has one, because
# «interval» and «input» do not change for number. Both selects are dropped and
# both counts still arrive.
function-domain-insufficient-dimensions = Dimensi domain anggon fungsine kuang. Domaine ngelah { $intervals } interval nanging fungsine ngelah { $inputs } input.

function-domain-invalid-format = Format domain anggon fungsine tusing sah.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Maksimum fungsine ane tusing numerik kalempasin.
        [minimum] Minimum fungsine ane tusing numerik kalempasin.
        [extremum] Ekstremum fungsine ane tusing numerik kalempasin.
        [point] Titik fungsine ane tusing numerik kalempasin.
        [slope] Kemiringan fungsine ane tusing numerik kalempasin.
       *[other] { $type } fungsine ane tusing numerik kalempasin.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Maksimum fungsine ane puyung kalempasin.
        [minimum] Minimum fungsine ane puyung kalempasin.
        [extremum] Ekstremum fungsine ane puyung kalempasin.
        [point] Titik fungsine ane puyung kalempasin.
       *[other] { $type } fungsine ane puyung kalempasin.
    }

function-points-too-close = Fungsine misi dadua titik ane paek gati genahne. Tusing nyidang ngartiang fungsine.

# Both selects dropped, for the reason above.
function-iterates-input-output-mismatch = Iterasi fungsi tuah nyidang yen liun inputne patuh teken liun outputne. Fungsi ene ngelah { $inputs } input lan { $outputs } output.

## `<sequence>`

sequence-invalid-length = Panjang sequence tusing sah.  Patut bilangan bulat ane tusing negatif.

sequence-invalid-step = step sequence tusing sah.  Patut angka anggon sequence type { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" sequence angka tusing sah.  Patut angka.

sequence-invalid-endpoint-letters = "{ $attribute }" sequence huruf tusing sah.  Patut kombinasi huruf.

sequence-invalid-endpoint = "{ $attribute }" sequence tusing sah.

select-from-sequence-coprime-not-numbers = coprime kalempasin krana ane kapilih tusing angka

select-from-sequence-coprime-with-exclude-combinations = coprime kalempasin krana excludeCombinations katentuang

## Resolving a `target`

target-not-found = target tusing sah anggon `<{ $source }>`: targete tusing katemu.

target-state-variable-not-found = target tusing sah anggon `<{ $source }>`: variabel kahanan ane maadan "{ $property }" tusing katemu di `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Variabel `<odeSystem>` patut malenan teken variabel bebasne.

ode-system-duplicate-variable-names = Tusing nyidang ngartiang fungsi RHS ODE ane adan variabel gumantungne patuh.

ode-system-rhs-function-error = Tusing nyidang ngartiang fungsi RHS ODE.  Ada kaiwangan ngae fungsi mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Tusing nyidang ngartiang sudut di pantaran { $count } garis

angle-invalid-through-point = Titik ane tusing sah di through `<angle>`

parabola-vertex-too-many-points = Parabola ane ngelah puncak tur liwat lebih teken 1 titik enu tusing kaimplementasi.

parabola-too-many-points = Parabola ane liwat lebih teken 3 titik enu tusing kaimplementasi.

intersection-too-many-items = Perpotongan anggon lebih teken dadua barang enu tusing kaimplementasi

## Other math components

ionic-compound-not-two-ions = Senyawa ionik anggon ane lenan teken dadua ion enu tusing kaimplementasi.

ionic-compound-needs-cation-and-anion = Senyawa ionik kaimplementasi tuah anggon abesik kation lan abesik anion.

solve-equations-cannot-evaluate = Tusing nyidang ngamragatang persamaane krana persamaane tusing nyidang kaevaluasi: { $equation }

math-operators-operand-number-required = operandNumber patut katentuang yen nyemak operand matematika.

eigen-decomposition-failed = Tusing nyidang ngitung eigenvalue matriks

## `<matchesPattern>`

# No select: the parameter list carries no number that the noun would show.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: parameter { $parameters } tusing pesu di pattern, kanti ia setata cocok teken ane puyung.

## `<graph>`

graph-grid-invalid = `<graph>`: tusing ngerti grid="{ $grid }". Patut none, medium, dense, utawi dadua angka positif ane kapisahang aji spasi, buka grid="1 0.5". Tusing ada grid ane kagambar.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" tusing kasokong di renderer prefigure; nganggon kabiasaan posisi tengawan.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" tusing kasokong di renderer prefigure; nganggon kabiasaan posisi duur.

prefigure-invalid-axis-bounds = `<graph>`: batas sumbune tusing sah anggon konversi prefigure; nganggon bbox baku (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: lebarne tusing sah anggon konversi prefigure; nganggon lebar diagram baku 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio tusing sah anggon konversi prefigure; nganggon aspect ratio baku 1.

prefigure-grid-spacing-too-fine = `<graph>`: jarak gride alus gati anggon batas sumbune; gride tusing kagambar di renderer prefigure.

prefigure-annotations-not-rendered = `<graph>`: annotation tusing kagambar yen tusing nganggon renderer PreFigure.

multiple-annotations-children = Ada liu pianak `<annotations>` di `<graph>`; makejang kalempasin sajaba ane paling durine.

## Referring to other components

copy-unrecognized-component-type = Tusing nyidang ngamekelin utawi nyalin jenis komponen ane tusing kakenal: { $type }.

copy-prop-not-found = Prop { $property } tusing katemu di komponen jenis { $component }

collect-no-source = Tusing ada source ane katemu anggon collect.

collect-invalid-component-type = Tusing nyidang munduhang komponen jenis `<{ $component }>` krana jenis komponene tusing sah.

reference-index-unavailable = Tusing nyidang nuju indeks `{ $reference }`

## `<callAction>`

component-action-unavailable = Tusing nyidang ngaukin { $action } di komponen `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Bentuk datane tusing sah.  Panjang barisne tusing patuh. Katemu di componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Datane ngelah adan kolom ane patuh.  Katemu di componentIdx :{ $componentIdx }

data-frame-missing-column-name = Datane kuangan adan kolom.  Katemu di componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Award pasaut ene madasar teken pasaut ane kakirim baan answer tag padidi, tur ento lakar ngranayang paundukan ane tusing kaaptiang.

answer-max-num-attempts-in-section-wide-check-work = Nyetel `maxNumAttempts` di `<answer>` ane ada di tengah wadah ane ngelah `sectionWideCheckWork` tusing madaya, krana wadahe ane ngatur liun kesempatane. Setel `maxNumAttempts` di wadahe.

nested-section-wide-check-work-max-num-attempts = Nyetel `maxNumAttempts` di wadah ane ngelah `sectionWideCheckWork` tur ada di tengah wadah lenan ane ngelah `sectionWideCheckWork` tusing madaya, krana wadah ane di sisi ane ngatur liun kesempatane. Setel `maxNumAttempts` di wadah ane di sisi.

# No select: «atribut» is the same word for one and for many.
answer-attributes-need-symbolic-equality = Atribut { $attributes } tusing lakar madaya yen symbolicEquality tusing kasetel.

answer-invalid-type = Jenis pasaut ane tusing sah: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Krana komponen `<{ $component }>` tusing ngelah adan, ia tusing nyidang kaanggon dadi atribut module

module-attribute-name-already-defined = Komponen `<{ $component } name="{ $name }">` tusing nyidang kaanggon dadi atribut module krana jenis komponen `<module>` suba ngelah atribut "{ $name }".

conditional-content-condition-ignored = Atribut `condition` kalempasin di komponen `<conditionalContent>` ane ngelah pianak case utawi else.

slider-markers-type-mismatch = Jenis markere tusing cocok teken jenis slidere.

pretzel-problem-needs-statement-and-answer = Pretzel tusing sah: asing-asing `<problem>` patut misi abesik `<statement>` lan abesik `<answer>`.

pretzel-circuit-first-problem-distractor = Pretzel tusing sah: di mode="circuit", `<problem>` ane paling malu tusing dadi distractor.

## Attribute values

# No select: «nilai» is the same word for one and for many.
attribute-invalid-values = Nilai { $values } tusing sah anggon atribut `{ $attribute }`; kalempasin.

attribute-must-be-references = Nilai `{ $value }` tusing sah anggon atribut `{ $attribute }`. Atribute patut kasusun aji referensi ane ngawitin aji `$`.

math-input-invalid-function-names = <mathInput>: adan fungsi ane tusing sah di { $attribute } kalempasin: { $names }. Asing-asing adan patut ngelah paling bedik 2 karakter (huruf utawi garis pisah); dadi kasusul baan sufiks `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Jenis komponen ane tusing sah: `<{ $componentType }>`

attribute-repeated = Atribut { $attribute } tusing dadi kabalikang.

attribute-invalid-for-component = Atribut "{ $attribute }" tusing sah anggon komponen jenis `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Kontras definisi gaya { $styleNumber } kuang anggon { $context ->
        [text-on-background] warna teks nglawan warna dasar
        [high-contrast] warna kontras tegeh nglawan kanvas
        [line] warna garis nglawan kanvas
        [marker] warna marker nglawan kanvas
       *[text-on-canvas] warna teks nglawan kanvas
    }{ $mode ->
        [dark] { " (mode peteng)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; merluang paling bedik { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Yadiastun definisi gaya { $styleNumber } ngelah warna ane katentuang tur kontrasne cukup anggon mode galang, kontras warna teks nglawan warna dasar kuang di warna ane kaambil anggon mode peteng ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; merluang paling bedik { $threshold }:1). { $suggestion ->
        [available] Apang kontrasne cukup di mode peteng, imbuhin kontras mode galange (conto, setel { $lightAttribute }="{ $lightColor }") utawi silurin warna mode petenge (conto, setel { $darkAttribute }="{ $darkColor }").
       *[none] Apang kontrasne cukup di mode peteng, imbuhin kontras mode galange utawi silurin warna ane kaambil aji textColorDarkMode lan/utawi backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Yadiastun definisi gaya { $styleNumber } ngelah warna teks ane katentuang tur kontrasne cukup anggon mode galang, kontras warna teks ane kaambil anggon mode peteng kuang nglawan kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; merluang paling bedik { $threshold }:1). { $suggestion ->
        [available] Apang kontrasne cukup di mode peteng, imbuhin kontras mode galange (conto, setel textColor="{ $lightColor }") utawi silurin warna mode petenge (conto, setel textColorDarkMode="{ $darkColor }").
       *[none] Apang kontrasne cukup di mode peteng, imbuhin kontras mode galange utawi silurin warna ane kaambil aji textColorDarkMode.
    }

section-multiple-style-palettes = Abesik dogen <stylePalette> ane dadi kapilih baan abesik bab; nganggon ane paling durine.

## Unique variants

variant-num-to-select-not-non-negative-integer = tusing nyidang mastiang varian tunggal { $component } krana numToSelect tusing bilangan bulat ane tusing negatif.

variant-num-to-select-not-constant-number = tusing nyidang mastiang varian tunggal { $component } krana numToSelect tusing angka konstan.

variant-with-replacement-not-constant-boolean = tusing nyidang mastiang varian tunggal { $component } krana withReplacement tusing boolean konstan.

variant-select-weight-disables-unique = Varian tunggal anggon select kamatiang yen ada opsi ane katentuang selectWeight utawi selectForVariants

variant-coprime-undetermined = tusing nyidang mastiang varian tunggal { $component } krana tusing nyidang mastiang coprime setata false.

variant-attribute-not-constant = tusing nyidang mastiang varian tunggal { $component } krana { $attribute } tusing konstan.

variant-attribute-not-number = tusing nyidang mastiang varian tunggal { $component } krana { $attribute } tusing angka.

variant-attribute-wrong-type-for-sequence =
    tusing nyidang mastiang varian tunggal { $component } jenis { $type } krana { $attribute } tusing { $expected ->
        [letters-combination] kombinasi huruf
        [math-expression] ekspresi matematika ane sah
        [integer] bilangan bulat
       *[number] angka
    }.

variant-length-not-integer = tusing nyidang mastiang varian tunggal { $component } krana length tusing bilangan bulat.

variant-sort-not-implemented = varian tunggal { $component } ane ngelah sort enu tusing kaimplementasi

variant-exclude-combinations-not-implemented = varian tunggal { $component } ane ngelah excludeCombinations enu tusing kaimplementasi

variant-math-exclude-not-implemented = varian tunggal { $component } jenis math ane ngelah exclude enu tusing kaimplementasi

variant-non-constant-exclude-not-implemented = varian tunggal { $component } ane ngelah exclude tusing konstan enu tusing kaimplementasi

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: tusing kasokong di renderer prefigure graph; katurunane kalangkungin.

prefigure-descendant-invalid-geometry = { $subject }: geometrine tusing wates utawi tusing lengkap; katurunane kalangkungin.

prefigure-curve-label-omitted = { $subject }: label tusing kasokong di elemen lengkung ane kakonversi; labele kalempasin.

prefigure-curve-unsupported-definition-type = { $subject }: jenis definisi fungsi lengkung '{ $definitionType }' tusing kasokong; katurunane kalangkungin.

prefigure-region-flip-functions-unsupported = { $subject }: atribut flipFunctions di regionBetweenCurves tusing kasokong; katurunane kalangkungin.

prefigure-region-non-formula-child = { $subject }: tuah pianak fungsi jenis formula ane kasokong di regionBetweenCurves; katurunane kalangkungin.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' tusing kasokong anggon { $labelKind ->
        [line-family] label kulawarga garis
       *[point] label titik
    }; nganggon perataan baku PreFigure.

prefigure-fill-style-unsupported = { $subject }: gaya isi '{ $fillStyle }' tusing kasokong baan PreFigure; mabalik ka isi ane pejel.

prefigure-line-style-unknown = { $subject }: gaya garis '{ $lineStyle }' tusing kakenal, kalempasin uli output PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: gaya marker '{ $markerStyle }' kagenahang ka gaya 'diamond' PreFigure.

prefigure-marker-style-unsupported = { $subject }: gaya marker '{ $markerStyle }' tusing kasokong baan PreFigure; nganggon gaya baku.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` tusing sah; targete tusing nyidang katuju. Annotatione kalempasin.

annotation-ref-multiple-targets = `<annotation>`: `ref` nuju liu target; nganggon targete ane paling malu.

annotation-ref-outside-graph = `<annotation>`: `ref` tusing sah; targete ada di sisin graph ane misi ia. Annotatione kalempasin.

annotation-ref-unsupported-target = `<annotation>`: `ref` tusing sah; targete tusing objek grafis ane kasokong di konversi prefigure. Annotatione kalempasin.

annotation-text-missing = `<annotation>`: `text` kuangan utawi puyung; ngepesuang teks puyung.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Katemu ketergantungan ane mubeng.
       *[other] Katemu ketergantungan ane mubeng tur nglibatang komponen `<{ $componentType }>`.
    }

reference-no-referent = Tusing ada ane katujuang baan referensine: `{ $reference }`

reference-multiple-referents = Liu ane katujuang baan referensine: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format atribut { $attribute } di `<{ $componentType }>` tusing sah.

children-invalid = Pianak `<{ $componentType }>` tusing sah: katemu pianak ane tusing sah: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Nilai `{ $value }` tusing sah anggon atribut `{ $attribute }`, nganggon nilai `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Versi DoenetML { $version } tusing katemu.
       *[other] Versi DoenetML { $version } tusing katemu. Mabalik ka versi { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML tusing sah: { $content }

parse-tag-missing-close-tag = DoenetML tusing sah: Tag `{ $tag }` tusing ngelah tag penutup. Kaaptiang tag ane nutup padidi utawi tag `</{ $tagName }>`.

parse-tag-error = DoenetML tusing sah: Ada kaiwangan di tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML tusing sah: Atribut `{ $attribute }` ane tusing sah buka kuangan nilai.

parse-attribute-invalid = DoenetML tusing sah: Atribut `{ $attribute }` tusing sah

parse-attribute-value-invalid = DoenetML tusing sah: Nilai atribut `{ $value }` tusing sah

parse-attribute-value-quote-mismatch = DoenetML tusing sah: Nilai atribut `{ $value }` tusing sah. Tanda kutipne tusing cocok. Buka kuangan abesik `{ $quote }`

parse-open-tag-name-missing = DoenetML tusing sah: Katemu tag ane tusing ngelah adan, conto `<`

parse-tag-not-closed = DoenetML tusing sah: Tag `{ $tag }` tusing katutup (buka kuangan `>`).

parse-self-closing-tag-name-missing = DoenetML tusing sah: Katemu tag ane tusing ngelah adan `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML tusing sah: Tag `{ $tag }` tusing katutup (buka kuangan `/>`).

parse-tag-invalid-attributes = DoenetML tusing sah: Tag `{ $tag }` tusing sah. Mirib atributne tusing beneh.

parse-close-tag-name-missing = DoenetML tusing sah: Katemu tag penutup ane tusing ngelah adan, conto `</`

parse-attribute-value-unquoted = Nilai atribut patut kagenahang di tengah tanda kutip: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML tusing sah: Katemu tag penutup `{ $tag }`, nanging tusing ada tag pembuka ane cocok

parse-close-tag-mismatched = DoenetML tusing sah: Tag penutupne tusing cocok. Kaaptiang `</{ $expected }>`. Katemu `{ $found }`

parser-node-unconvertible = Node { $node } tusing nyidang kakonversi dadi node Dast.

## Names

name-attribute-invalid =
    Atribut name='{ $name }' tusing sah. { $reason ->
        [characters] Adan tuah dadi misi huruf, angka, garis bawah utawi garis pisah.
       *[start] Adan patut ngawitin aji huruf.
    }

component-name-invalid-start = Adan komponen "{ $name }" tusing sah. Adan patut ngawitin aji huruf.

## `<answer>` sugar

answer-video-watched-missing-video = Answer ane type videoWatched patut ngelah atribut video

answer-video-watched-video-not-reference = Answer ane type videoWatched patut ngelah atribut video ane dadi referensi

answer-name-not-single-text = Atribut name di answer patut ngelah abesik pianak text dogen

## Referencing another document

external-doenetml-recursion-limit = Tusing nyidang ngambil DoenetML uli sisi krana tingkat pengulangane liu gati. Ada referensi ane mubeng?

external-doenetml-unavailable = Tusing nyidang ngambil DoenetML uli { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML ane kaambil uli { $attribute }="{ $uri }" tusing sah: ia tusing cocok teken jenis komponen "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` tusing kaanggon buin; anggon `{ $to }`.
       *[other] [deprecation] Atribut `{ $from }` di `<{ $component }>` tusing kaanggon buin; anggon `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` tusing kaanggon buin tur kalempasin krana `{ $to }` masih katentuang.
       *[other] [deprecation] Atribut `{ $from }` di `<{ $component }>` tusing kaanggon buin tur kalempasin krana `{ $to }` masih katentuang.
    }

deprecated-attribute-ignored = [deprecation] Atribut `{ $attribute }` di `<{ $component }>` tusing kaanggon buin tur kalempasin.

deprecated-attribute-to-child = [deprecation] Atribut `{ $attribute }` di `<{ $component }>` tusing kaanggon buin; anggon pianak `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Nilai `{ $value }` di atribut `{ $attribute }` di `<{ $component }>` tusing kaanggon buin; anggon `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` tuah nyidang ngajamakang basa Inggris, kanti teksne tusing kaubah di dokumen ane katulis aji { $locale }. Tulisang langsung bentuk jamakne, utawi setel aji atribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elemen `<{ $tag }>` tusing dadi elemen Doenet ane kakenal.

schema-element-not-allowed-at-root = Elemen `<{ $tag }>` tusing kalugra di akah dokumene.

schema-element-not-allowed-inside = Elemen `<{ $tag }>` tusing kalugra di tengah `<{ $parent }>`.

schema-attribute-unrecognized = Elemen `<{ $tag }>` tusing ngelah atribut ane maadan `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribut `{ $attribute }` di elemen `<{ $tag }>` patut dadi daftar ane asing-asing isine abesik uli: { $allowed }
       *[other] Atribut `{ $attribute }` di elemen `<{ $tag }>` patut abesik uli: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Adan varian tusing sah anggon select.  Adan varian { $variantName } pesu di { $numOptions } opsi nanging liun ane lakar kapilih { $numToSelect }.

select-variant-name-without-options = Ada varian ane katentuang anggon select nanging tusing ada opsi ane katentuang anggon adan varian ane dadi: { $variantName }.

select-variant-name-not-possible = Adan varian { $variantName } ane katentuang anggon select tusing dadi adan varian.

select-too-few-options = Tusing nyidang milih { $numToSelect } komponen uli { $numOptions } dogen.

select-from-sequence-too-few-values = Tusing nyidang milih { $numToSelect } nilai uli sequence ane panjangne { $length }.

select-from-sequence-indices-count-mismatch = Liun indeks ane katentuang anggon select patut cocok teken liun ane lakar kapilih

select-from-sequence-indices-not-integers = Makejang indeks ane katentuang anggon select patut bilangan bulat

select-from-sequence-index-excluded = Indeks selectfromsequence ane katentuang ento kaejohang

select-from-sequence-indices-excluded-combination = Indeks selectfromsequence ane katentuang ento kombinasi ane kaejohang

select-from-sequence-coprime-not-positive-integers = Tusing nyidang milih kombinasi coprime krana ane kapilih tusing bilangan bulat positif.

select-from-sequence-coprime-common-factor = Tusing nyidang milih angka coprime. Makejang nilai ane dadi ngelah faktor ane patuh. (Nilai "from" utawi "to" ane katentuang patut coprime teken "step".)

select-from-sequence-coprime-single-number = Tusing nyidang milih kombinasi coprime uli abesik angka ane tusing 1.

select-from-sequence-excluded-too-many-combinations = Lebih teken 70% kombinasine kaejohang di selectFromSequence

select-from-sequence-coprime-none-found = Tusing nyidang milih angka coprime. Makejang nilai ane dadi ngelah faktor ane patuh.

select-from-sequence-too-few-unique-values = Tusing nyidang milih { $numToSelect } nilai tunggal uli sequence ane panjangne { $numPossibleValues }

select-prime-numbers-too-few-values = Tusing nyidang milih { $numToSelect } nilai uli daftar prima ane panjangne { $numValues }

select-prime-numbers-values-count-mismatch = Liun nilai ane katentuang anggon select patut cocok teken liun ane lakar kapilih

select-prime-numbers-values-not-prime = Makejang nilai ane katentuang anggon select prime number patut ada di daftar prima

select-prime-numbers-values-excluded-combination = Nilai selectPrimeNumbers ane katentuang ento kombinasi ane kaejohang

select-prime-numbers-excluded-too-many-combinations = Lebih teken 70% kombinasine kaejohang di selectPrimeNumbers

select-random-combination-fluke = Krana nasib ane langah gati, tusing nyidang milih kombinasi nilai acak

select-random-value-fluke = Krana nasib ane langah gati, tusing nyidang milih nilai acak
