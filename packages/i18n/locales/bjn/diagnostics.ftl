# Banjar (Bahasa Banjar) diagnostics: the warnings and errors the worker
# raises and the reader is shown. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth. Selected by `uiLocale`, not by the language the
# document was written in.
#
# Message ids are never translated — only the text to the right of `=`. Neither
# are the DoenetML identifiers quoted inside these sentences: `through`,
# `endpoint`, `midpointOffset`, `numDimensions`, `maxNumAttempts`,
# `selectFromSequence` and every tag and attribute name like them are part of
# the language an author writes, not prose, and stay in English exactly as
# written. So does the `[deprecation]` marker, which is a label rather than a
# word.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography and register** are `chrome.ftl`'s: Banjar Hulu in the ordinary
# Indonesian Latin alphabet, three vowels, no diacritics. The technical
# vocabulary — komponen, atribut, variabel, dimensi, matriks, referensi — is
# Indonesian and is declared as such: Banjar-speaking schools teach mathematics
# and computing in Indonesian, and inventing Banjar equivalents would put words
# in front of a reader that no Banjar reader has met.
#
# **What holds this apart from `locales/id`** is the grammatical layer, used
# without exception: «kada» for *tidak*, «kada kawa» for *tidak dapat*,
# «kadada» for *tidak ada*, «nang» for *yang*, «gasan» for *untuk*, «matan»
# for *dari*, «lawan» for *dengan*, «wan» for *dan*, «atawa» for *atau*,
# «amun» for *jika*, «tagal» for *tetapi*, «lantaran» for *karena*, «katamu»
# for *ditemukan*, «barataan» for *semua*, «balum» for *belum*, «sabuting» for
# *sebuah*. A sentence that has slipped back into «tidak», «yang» or «untuk»
# is a mistake to fix, not a stylistic choice.
#
# **No plural branches.** CLDR has no plural data for `bjn`, so every
# `[one]`/`[other]` fork English writes over a count is collapsed here: most
# become a plain message, since a Banjar noun is unmarked after a numeral and
# one form is correct. The one exception is
# `field-function-wrong-num-outputs`, where English is not counting but
# distinguishing a one-output field from a two-output one; that fork is kept
# as the numeric literal `[1]`, which Fluent matches against the number itself
# rather than against a plural category.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } kada dihiraukan amun dua titik ujung ditantuakan

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } kada dihiraukan amun titik ujung wan titik tangah sama-sama ditantuakan

line-segment-midpoint-offset-without-midpoint = midpointOffset kadada pangaruhnya amun kadada titik tangah

## `<line>`

line-points-undetermined-dimensions = Garis malalui titik-titik nang dimensinya kada kawa ditantuakan.

line-points-too-few-dimensions = Garis harus malalui titik-titik nang dimensinya kada kurang matan dua.

line-points-depend-on-variables = Garis malalui titik-titik nang bagantung wan variabel: { $variables }.

line-equation-invalid-format = Format persamaan garis dalam variabel { $variable1 } wan { $variable2 } kada sah.

## `<ray>`

ray-overprescribed-through = Sinar ditantuakan sakaligus ulih through, endpoint, wan direction. Through nang ditantuakan kada dihiraukan.

ray-dimension-mismatch = numDimensions di sinar kada cucuk.

## `<vector>`

vector-overprescribed-head = Vektor ditantuakan sakaligus ulih head, tail, wan displacement. Head nang ditantuakan kada dihiraukan.

vector-dimension-mismatch = numDimensions di vektor kada cucuk.

## Attracting and constraining

attract-to-without-nearest-point = Kada kawa manarik ka `<{ $component }>` lantaran inya kadada variabel kaadaan nearestPoint.

constrain-to-without-nearest-point = Kada kawa mambatasi ka `<{ $component }>` lantaran inya kadada variabel kaadaan nearestPoint.

constrain-to-interior-without-nearest-point = Kada kawa mambatasi ka bagian dalam `<{ $component }>` lantaran inya kadada variabel kaadaan nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition kada dihiraukan gasan choiceInput nang bukan inline

## Ordering children by index

choice-input-indices-count-mismatch = Indices nang ditantuakan gasan choiceInput kada dihiraukan lantaran jumlah indices kada cucuk lawan jumlah anak choice.

pretzel-indices-count-mismatch = Indices nang ditantuakan gasan problem kada dihiraukan lantaran jumlah indices kada cucuk lawan jumlah anak problem.

shuffle-indices-count-mismatch = Indices nang ditantuakan gasan shuffle kada dihiraukan lantaran jumlah indices kada cucuk lawan jumlah komponen.

indices-ignored-out-of-range = Indices nang ditantuakan gasan { $component } kada dihiraukan lantaran ada indeks nang di luar jangkauan.

pretzel-indices-repeated = Indices nang ditantuakan gasan pretzel kada dihiraukan lantaran ada indeks nang baulang.

pretzel-circuit-first-index = Indices nang ditantuakan gasan pretzel di mode circuit kada dihiraukan lantaran indeks nang partama harus 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Supaya `<{ $component }>` bajalan lawan anak barupa string, atribut `type` harus ditantuakan.

invalid-type-defaulting-to-math = Tipe { $type } kada sah gasan komponen { $component }. Harus salah satu matan math, text, number, atawa boolean. Mamakai math.

string-not-valid-component-to-arrange = String "{ $value }" bukan komponen nang sah gasan { $component }. Kada dihiraukan.

## Types and variables

invalid-type-defaulting-to-number = Tipe { $type } kada sah, tipe disatel ka number.

invalid-variable-value = Nilai variabel kada sah: `{ $value }`

## Variants

variant-index-must-be-number = Indeks varian { $index } harus barupa bilangan

variant-index-must-be-integer = Indeks varian { $index } harus barupa bilangan bulat

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` balum diadaakan gasan ukuran absolut. Lebar diubah jadi relatif.

side-by-side-absolute-margins = `<{ $component }>` balum diadaakan gasan ukuran absolut. Margin diubah jadi relatif.

side-by-side-no-block-child = `<{ $component }>` kada sah: inya harus bapunya paling kada satu anak barupa blok.

## `<label>`

label-for-ignored-on-graphical = Atribut `for` di `<label>` grafis kada dihiraukan.

label-for-must-resolve-to-one = Atribut `for` di `<label>` harus mangarah pas ka satu komponen.

label-for-unresolved = Atribut `for` di `<label>` kada kawa diarahakan ka sabuting komponen.

label-for-answer-with-authored-inputs = Atribut `for` di `<label>` marujuk ka `<answer>` nang masukannya ditulis surang; rujuk masukan itu langsung.

label-for-answer-without-input = Atribut `for` di `<label>` marujuk ka `<answer>` nang kadada masukan gasan dilabeli.

label-for-must-reference-input-or-answer = Atribut `for` di `<label>` harus marujuk ka sabuting masukan atawa sabuting jawaban.

## Accessibility

accessibility-short-description-or-decorative = Gasan aksesibilitas, `<{ $component }>` harus bapunya katarangan singkat atawa ditandai sabagai dekoratif.

accessibility-video-short-description = Gasan aksesibilitas, `<video>` harus bapunya katarangan singkat.

accessibility-input-short-description-or-label = Gasan aksesibilitas, `<{ $component }>` harus bapunya katarangan singkat atawa label.

accessibility-answer-input-short-description-or-label = Gasan aksesibilitas, sabuting `<answer>` nang maulah masukan harus bapunya katarangan singkat atawa label.

accessibility-short-description-contains-math = Katarangan singkat kada baik mamuat komponen matematika kaya `<{ $component }>`. Tulisakan isi matematikanya lawan kata-kata.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } kontrasnya kada cukup gasan teks judul bagian (mode kalam) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mamarluakan paling kada { $threshold }:1).
       *[other] { $colorName } kontrasnya kada cukup gasan teks judul bagian ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mamarluakan paling kada { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Balum diadaakan `<circle>` malalui { $count } titik amun titik-titiknya kadada nilai numerik.

circle-too-many-through-points = Kada kawa manghitung lingkaran malalui labih matan 3 titik.

circle-overprescribed-radius-center-points = Kada kawa manghitung lingkaran nang jari-jari, pusat, wan titik lintasannya ditantuakan sakaligus.

circle-center-with-multiple-points = Kada kawa manghitung lingkaran lawan pusat tartantu nang malalui labih matan 1 titik.

circle-radius-too-small = Kada kawa manghitung lingkaran: lantaran jarak antara dua titik itu { $distance }, jari-jari { $radius } nang ditantuakan talalu halus.

circle-radius-with-many-points = Kada kawa maulah lingkaran malalui labih matan dua titik lawan jari-jari tartantu.

circle-invalid-center-or-through-points = Pusat atawa titik lintasan lingkaran kada sah.

circle-radius-center-with-multiple-points = Kada kawa manghitung jari-jari lingkaran lawan pusat tartantu nang malalui labih matan 1 titik.

circle-change-radius-non-numerical = Kada kawa maubah jari-jari lingkaran nang titik lintasannya kada numerik

circle-radius-with-points-non-numerical = Kada kawa maulah lingkaran malalui labih matan satu titik lawan jari-jari tartantu amun kadada nilai numerik.

circle-change-center-non-numerical = Balum diadaakan pangubahan pusat lingkaran nang malalui titik-titik kada numerik.

## `<function>`

function-domain-insufficient-dimensions = Dimensi domain fungsi kada cukup. Domain bapunya { $intervals } salang tagal fungsi bapunya { $inputs } masukan.

function-domain-invalid-format = Format domain fungsi kada sah.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Maksimum fungsi nang kada numerik kada dihiraukan.
        [minimum] Minimum fungsi nang kada numerik kada dihiraukan.
        [extremum] Ekstremum fungsi nang kada numerik kada dihiraukan.
        [point] Titik fungsi nang kada numerik kada dihiraukan.
        [slope] Kamiringan fungsi nang kada numerik kada dihiraukan.
       *[other] { $type } fungsi nang kada numerik kada dihiraukan.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Maksimum fungsi nang kosong kada dihiraukan.
        [minimum] Minimum fungsi nang kosong kada dihiraukan.
        [extremum] Ekstremum fungsi nang kosong kada dihiraukan.
        [point] Titik fungsi nang kosong kada dihiraukan.
       *[other] { $type } fungsi nang kosong kada dihiraukan.
    }

function-points-too-close = Fungsi mamuat dua titik nang talalu rapat lataknya. Fungsi kada kawa didefinisiakan.

function-iterates-input-output-mismatch = Iterasi fungsi hanya kawa amun jumlah masukan sama lawan jumlah kaluaran. Fungsi ini bapunya { $inputs } masukan wan { $outputs } kaluaran.

## `<sequence>`

sequence-invalid-length = Panjang barisan kada sah. Harus barupa bilangan bulat kada negatif.

sequence-invalid-step = Langkah barisan kada sah. Harus barupa bilangan gasan barisan batipe { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" di barisan bilangan kada sah. Harus barupa bilangan.

sequence-invalid-endpoint-letters = "{ $attribute }" di barisan huruf kada sah. Harus barupa kombinasi huruf.

sequence-invalid-endpoint = "{ $attribute }" di barisan kada sah.

select-from-sequence-coprime-not-numbers = coprime kada dihiraukan lantaran nang dipilih bukan bilangan

select-from-sequence-coprime-with-exclude-combinations = coprime kada dihiraukan lantaran excludeCombinations ditantuakan

## Resolving a `target`

target-not-found = Target gasan `<{ $source }>` kada sah: target kada katamu.

target-state-variable-not-found = Target gasan `<{ $source }>` kada sah: kada katamu variabel kaadaan banama "{ $property }" di `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Variabel `<odeSystem>` harus balain matan variabel babas.

ode-system-duplicate-variable-names = Kada kawa mandefinisiakan fungsi ruas kanan ODE lawan nama variabel tarikat nang baulang.

ode-system-rhs-function-error = Kada kawa mandefinisiakan fungsi ruas kanan ODE. Ada kasalahan waktu maulah fungsi mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Kada kawa mandefinisiakan sudut antara { $count } garis

angle-invalid-through-point = Ada titik kada sah di through milik `<angle>`

parabola-vertex-too-many-points = Balum diadaakan parabola lawan titik puncak tartantu nang malalui labih matan 1 titik.

parabola-too-many-points = Balum diadaakan parabola malalui labih matan 3 titik.

intersection-too-many-items = Balum diadaakan irisan gasan labih matan dua objek

## Other math components

ionic-compound-not-two-ions = Balum diadaakan sanyawa ion salain gasan dua ion.

ionic-compound-needs-cation-and-anion = Sanyawa ion hanya diadaakan gasan satu kation wan satu anion.

solve-equations-cannot-evaluate = Kada kawa manyalasaiakan persamaan lantaran persamaannya kada kawa dievaluasi: { $equation }

math-operators-operand-number-required = operandNumber harus ditantuakan amun handak maambil sabuting operan matematika.

eigen-decomposition-failed = Kada kawa manghitung nilai eigen matriks

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: parameter { $parameters } kada muncul dalam pola, jadi inya akan salalu cucuk lawan kakosongan.

## `<graph>`

graph-grid-invalid = `<graph>`: kada kawa manafsirakan grid="{ $grid }". Nilainya harus none, medium, dense, atawa dua bilangan positif nang dipisah spasi, misalnya grid="1 0.5". Kisi kada digambar.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` mamarluakan fungsi lawan { $expected ->
        [1] satu kaluaran, yaitu kamiringan y' di tiap titik, misalnya `y - x`
       *[other] dua kaluaran, yaitu vektor di tiap titik, misalnya `(y, -x)`
    }, tagal fungsi nang dibari bapunya { $found ->
       *[other] { $found } kaluaran
    }. { $alternative ->
        [none] Kadada nang digambar.
       *[other] `<{ $alternative }>` marupakan komponen gasan fungsi macam itu. Kadada nang digambar.
    }

field-function-attribute-ignored-with-child = Atribut `function` kada dihiraukan lantaran fungsinya dibari jua di dalam komponen; nang di dalam itu nang dipakai. Bari fungsinya lawan salah satu cara haja.

field-variables-ignored =
    `<{ $component }>`: atribut `variables` manyambat variabel matan ungkapan nang ditulis langsung di dalam komponen. { $reason ->
        [function-child] Fungsi di sini dibari sabagai anak `<function>`, nang manyambat variabelnya surang, jadi `variables` kada dihiraukan.
       *[no-expression] Kadada ungkapan macam itu di sini, jadi `variables` kada dihiraukan.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" kada didukung di perender prefigure; mamakai parilaku posisi kanan.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" kada didukung di perender prefigure; mamakai parilaku posisi atas.

prefigure-invalid-axis-bounds = `<graph>`: batas sumbu kada sah gasan konversi prefigure; mamakai bbox bawaan (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: lebar kada sah gasan konversi prefigure; mamakai lebar diagram bawaan 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio kada sah gasan konversi prefigure; mamakai rasio aspek bawaan 1.

prefigure-grid-spacing-too-fine = `<graph>`: jarak kisi talalu rapat gasan batas sumbunya; kisi dihilangakan di perender prefigure.

prefigure-annotations-not-rendered = `<graph>`: anotasi kada akan digambar amun perender PreFigure kada dipakai.

multiple-annotations-children = Katamu babarapa anak `<annotations>` di dalam `<graph>`; barataan kada dihiraukan kacuali nang pahabisan.

## Referring to other components

copy-unrecognized-component-type = Kada kawa mamperluas atawa manyalin tipe komponen nang kada takanal: { $type }.

copy-prop-not-found = Kada katamu prop { $property } di komponen batipe { $component }

collect-no-source = Kadada sumber nang katamu gasan collect.

collect-invalid-component-type = Kada kawa mangumpulakan komponen batipe `<{ $component }>` lantaran itu bukan tipe komponen nang sah.

reference-index-unavailable = Kada kawa marujuk indeks `{ $reference }`

## `<callAction>`

component-action-unavailable = Kada kawa mamanggil { $action } di komponen `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Bantuk data kada sah. Panjang baris kada sama. Katamu di componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data bapunya nama kolom nang baulang. Katamu di componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data kahilangan sabuting nama kolom. Katamu di componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Sabuting award gasan jawaban ini badasar di jawaban nang dikirim ulih tag answer itu surang, nang akan maulah parilaku nang kada disangka.

answer-max-num-attempts-in-section-wide-check-work = Manyatel `maxNumAttempts` di `<answer>` nang ada di dalam wadah nang bapunya `sectionWideCheckWork` kadada pangaruhnya, lantaran jumlah cuba dikandalikan ulih wadah itu. Satel `maxNumAttempts` di wadahnya.

nested-section-wide-check-work-max-num-attempts = Manyatel `maxNumAttempts` di wadah nang bapunya `sectionWideCheckWork` nang ada di dalam wadah lain nang bapunya `sectionWideCheckWork` kadada pangaruhnya, lantaran jumlah cuba dikandalikan ulih wadah nang paling luar. Satel `maxNumAttempts` di wadah nang paling luar.

answer-attributes-need-symbolic-equality = Atribut { $attributes } kadada pangaruhnya amun symbolicEquality kada disatel.

answer-invalid-type = Tipe gasan answer kada sah: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Lantaran komponen `<{ $component }>` kadada nama, inya kada kawa dipakai sabagai atribut modul

module-attribute-name-already-defined = Komponen `<{ $component } name="{ $name }">` kada kawa dipakai sabagai atribut sabuting modul lantaran tipe komponen `<module>` sudah bapunya atribut "{ $name }".

conditional-content-condition-ignored = Atribut `condition` kada dihiraukan di komponen `<conditionalContent>` nang bapunya anak case atawa else.

slider-markers-type-mismatch = Tipe pananda kada cucuk lawan tipe panggeser.

pretzel-problem-needs-statement-and-answer = Pretzel kada sah: satiap `<problem>` harus mamuat satu `<statement>` wan satu `<answer>`.

pretzel-circuit-first-problem-distractor = Pretzel kada sah: di mode="circuit", `<problem>` nang partama kada bulih barupa pangicuh.

## Attribute values

attribute-invalid-values = Nilai { $values } gasan atribut `{ $attribute }` kada sah; kada dihiraukan.

attribute-must-be-references = Nilai `{ $value }` gasan atribut `{ $attribute }` kada sah. Atribut harus tasusun matan referensi nang diawali `$`.

math-input-invalid-function-names = <mathInput>: nama fungsi nang kada sah di { $attribute } kada dihiraukan: { $names }. Bagian tampilan tiap nama harus paling kada 2 karakter (huruf atawa tanda hubung); kawa diikuti akhiran pilihan `|<alternatif mathspeak>`.

## Building components from the source

component-type-invalid = Tipe komponen kada sah: `<{ $componentType }>`

attribute-repeated = Atribut { $attribute } kada kawa diulang.

attribute-invalid-for-component = Atribut "{ $attribute }" kada sah gasan komponen batipe `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Definisi gaya { $styleNumber } kontrasnya kada cukup gasan { $context ->
        [text-on-background] warna teks tarhadap warna latar
        [high-contrast] warna kontras tinggi tarhadap kanvas
        [line] warna garis tarhadap kanvas
        [marker] warna pananda tarhadap kanvas
       *[text-on-canvas] warna teks tarhadap kanvas
    }{ $mode ->
        [dark] { " (mode kalam)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mamarluakan paling kada { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Walaupun definisi gaya { $styleNumber } manantuakan warna nang kontrasnya cukup gasan mode tarang, warna mode kalam nang diturunakan matan nilai-nilai itu kontrasnya kada cukup antara warna teks wan warna latar ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mamarluakan paling kada { $threshold }:1). { $suggestion ->
        [available] Supaya kontrasnya cukup di mode kalam, tinggiakan kontras mode tarang (misalnya satel { $lightAttribute }="{ $lightColor }") atawa timpa warna mode kalam (misalnya satel { $darkAttribute }="{ $darkColor }").
       *[none] Supaya kontrasnya cukup di mode kalam, tinggiakan kontras mode tarang atawa timpa warna turunannya lawan textColorDarkMode wan/atawa backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Walaupun definisi gaya { $styleNumber } manantuakan warna teks nang kontrasnya cukup gasan mode tarang, warna teks mode kalam nang diturunakan matan nilai itu kontrasnya kada cukup tarhadap kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mamarluakan paling kada { $threshold }:1). { $suggestion ->
        [available] Supaya kontrasnya cukup di mode kalam, tinggiakan kontras mode tarang (misalnya satel textColor="{ $lightColor }") atawa timpa warna mode kalam (misalnya satel textColorDarkMode="{ $darkColor }").
       *[none] Supaya kontrasnya cukup di mode kalam, tinggiakan kontras mode tarang atawa timpa warna turunannya lawan textColorDarkMode.
    }

section-multiple-style-palettes = Sabuting bagian hanya kawa mamilih satu <stylePalette>; mamakai nang pahabisan.

## Unique variants

variant-num-to-select-not-non-negative-integer = kada kawa manantuakan varian unik matan { $component } lantaran numToSelect bukan bilangan bulat kada negatif.

variant-num-to-select-not-constant-number = kada kawa manantuakan varian unik matan { $component } lantaran numToSelect bukan bilangan nang tatap.

variant-with-replacement-not-constant-boolean = kada kawa manantuakan varian unik matan { $component } lantaran withReplacement bukan boolean nang tatap.

variant-select-weight-disables-unique = Varian unik gasan select dimatiakan amun ada opsi nang manantuakan selectWeight atawa selectForVariants

variant-coprime-undetermined = kada kawa manantuakan varian unik matan { $component } lantaran kada kawa dipastiakan coprime salalu salah.

variant-attribute-not-constant = kada kawa manantuakan varian unik matan { $component } lantaran { $attribute } bukan nilai nang tatap.

variant-attribute-not-number = kada kawa manantuakan varian unik matan { $component } lantaran { $attribute } bukan bilangan.

variant-attribute-wrong-type-for-sequence =
    kada kawa manantuakan varian unik matan { $component } batipe { $type } lantaran { $attribute } bukan { $expected ->
        [letters-combination] kombinasi huruf
        [math-expression] ungkapan matematika nang sah
        [integer] bilangan bulat
       *[number] bilangan
    }.

variant-length-not-integer = kada kawa manantuakan varian unik matan { $component } lantaran length bukan bilangan bulat.

variant-sort-not-implemented = balum diadaakan varian unik matan { $component } lawan sort

variant-exclude-combinations-not-implemented = balum diadaakan varian unik matan { $component } lawan excludeCombinations

variant-math-exclude-not-implemented = balum diadaakan varian unik matan { $component } batipe math lawan exclude

variant-non-constant-exclude-not-implemented = balum diadaakan varian unik matan { $component } lawan exclude nang kada tatap

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: kada didukung di perender prefigure grafik; turunan dilewati.

prefigure-descendant-invalid-geometry = { $subject }: geometri kada hingga atawa kada langkap; turunan dilewati.

prefigure-curve-label-omitted = { $subject }: label kada didukung di elemen kurva hasil konversi; label dihilangakan.

prefigure-curve-unsupported-definition-type = { $subject }: tipe definisi fungsi kurva '{ $definitionType }' kada didukung; turunan dilewati.

prefigure-region-flip-functions-unsupported = { $subject }: atribut flipFunctions di regionBetweenCurves kada didukung; turunan dilewati.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves hanya mandukung fungsi anak batipe formula; turunan dilewati.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' kada didukung gasan { $labelKind ->
        [line-family] label kaluarga garis
       *[point] label titik
    }; mamakai parataan bawaan PreFigure.

prefigure-fill-style-unsupported = { $subject }: gaya isian '{ $fillStyle }' kada didukung ulih PreFigure; baalih ka isian padat.

prefigure-line-style-unknown = { $subject }: gaya garis '{ $lineStyle }' kada takanal wan dihilangakan matan kaluaran PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: gaya pananda '{ $markerStyle }' dipetaakan ka gaya 'diamond' milik PreFigure.

prefigure-marker-style-unsupported = { $subject }: gaya pananda '{ $markerStyle }' kada didukung ulih PreFigure; mamakai gaya bawaan.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` kada sah; target kada kawa diarahakan. Anotasi dihilangakan.

annotation-ref-multiple-targets = `<annotation>`: `ref` mangarah ka babarapa target; mamakai target nang partama.

annotation-ref-outside-graph = `<annotation>`: `ref` kada sah; target ada di luar grafik nang mamuatnya. Anotasi dihilangakan.

annotation-ref-unsupported-target = `<annotation>`: `ref` kada sah; target bukan objek grafis nang didukung dalam konversi prefigure. Anotasi dihilangakan.

annotation-text-missing = `<annotation>`: `text` hilang atawa kosong; maulah teks kosong.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Katamu katagantungan malingkar.
       *[other] Katamu katagantungan malingkar nang malibatakan komponen `<{ $componentType }>`.
    }

reference-no-referent = Kadada acuan nang katamu gasan referensi: `{ $reference }`

reference-multiple-referents = Katamu babarapa acuan gasan referensi: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format atribut { $attribute } di `<{ $componentType }>` kada sah.

children-invalid = Anak `<{ $componentType }>` kada sah: katamu anak nang kada sah: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Nilai `{ $value }` gasan atribut `{ $attribute }` kada sah, mamakai nilai `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML versi { $version } kada katamu.
       *[other] DoenetML versi { $version } kada katamu. Baulih ka versi { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML kada sah: { $content }

parse-tag-missing-close-tag = DoenetML kada sah: Tag `{ $tag }` kadada tag panutup. Diharap ada tag nang manutup surang atawa tag `</{ $tagName }>`.

parse-tag-error = DoenetML kada sah: Ada kasalahan di tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML kada sah: Atribut `{ $attribute }` kaya kahilangan nilai.

parse-attribute-invalid = DoenetML kada sah: Atribut `{ $attribute }` kada sah

parse-attribute-value-invalid = DoenetML kada sah: Nilai atribut `{ $value }` kada sah

parse-attribute-value-quote-mismatch = DoenetML kada sah: Nilai atribut `{ $value }` kada sah. Tanda kutipnya kada cucuk. Pian kaya kahilangan sabuting `{ $quote }`

parse-open-tag-name-missing = DoenetML kada sah: Katamu tag nang kadada nama tag, misalnya `<`

parse-tag-not-closed = DoenetML kada sah: Tag `{ $tag }` balum ditutup (kaya `>` nang hilang).

parse-self-closing-tag-name-missing = DoenetML kada sah: Katamu tag nang kadada nama tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML kada sah: Tag `{ $tag }` balum ditutup (kaya `/>` nang hilang).

parse-tag-invalid-attributes = DoenetML kada sah: Tag `{ $tag }` kada sah. Atributnya mungkin salah.

parse-close-tag-name-missing = DoenetML kada sah: Katamu tag panutup nang kadada nama tag, misalnya `</`

parse-attribute-value-unquoted = Nilai atribut harus diapit tanda kutip: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML kada sah: Katamu tag panutup `{ $tag }`, tagal kadada tag pambuka nang cucuk

parse-close-tag-mismatched = DoenetML kada sah: Tag panutup kada cucuk. Diharap `</{ $expected }>`. Katamu `{ $found }`

parser-node-unconvertible = Kada kawa maubah simpul { $node } jadi simpul Dast.

## Names

name-attribute-invalid =
    Atribut name='{ $name }' kada sah. { $reason ->
        [characters] Nama hanya kawa mamuat huruf, angka, garis bawah, atawa tanda hubung.
       *[start] Nama harus diawali lawan huruf.
    }

component-name-invalid-start = Nama komponen "{ $name }" kada sah. Nama harus diawali lawan huruf.

## `<answer>` sugar

answer-video-watched-missing-video = Answer batipe videoWatched harus bapunya atribut video

answer-video-watched-video-not-reference = Answer batipe videoWatched harus bapunya atribut video nang barupa referensi

answer-name-not-single-text = Atribut name di answer harus bapunya pas satu anak barupa teks

## Referencing another document

external-doenetml-recursion-limit = Kada kawa maambil DoenetML luar lantaran talalu banyak tingkat rekursi. Adakah referensi nang malingkar?

external-doenetml-unavailable = Kada kawa maambil DoenetML matan { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML nang diambil matan { $attribute }="{ $uri }" kada sah: inya kada cucuk lawan tipe komponen "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` sudah usang; pakai `{ $to }`.
       *[other] [deprecation] Atribut `{ $from }` di `<{ $component }>` sudah usang; pakai `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` sudah usang wan kada dihiraukan lantaran `{ $to }` ditantuakan jua.
       *[other] [deprecation] Atribut `{ $from }` di `<{ $component }>` sudah usang wan kada dihiraukan lantaran `{ $to }` ditantuakan jua.
    }

deprecated-attribute-ignored = [deprecation] Atribut `{ $attribute }` di `<{ $component }>` sudah usang wan kada dihiraukan.

deprecated-attribute-to-child = [deprecation] Atribut `{ $attribute }` di `<{ $component }>` sudah usang; pakai anak `<{ $child }>` haja.

deprecated-attribute-value-renamed = [deprecation] Nilai `{ $value }` matan atribut `{ $attribute }` di `<{ $component }>` sudah usang; pakai `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` hanya kawa manjamakakan bahasa Inggris, jadi teksnya dibiarakan apa adanya di dokumen nang ditulis dalam { $locale }. Tulisakan bantuk jamaknya langsung, atawa satel lawan atribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elemen `<{ $tag }>` bukan elemen Doenet nang takanal.

schema-element-not-allowed-at-root = Elemen `<{ $tag }>` kada dibulihakan di akar dokumen.

schema-element-not-allowed-inside = Elemen `<{ $tag }>` kada dibulihakan di dalam `<{ $parent }>`.

schema-attribute-unrecognized = Elemen `<{ $tag }>` kadada atribut banama `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribut `{ $attribute }` di elemen `<{ $tag }>` harus barupa daftar nang tiap isiannya salah satu matan: { $allowed }
       *[other] Atribut `{ $attribute }` di elemen `<{ $tag }>` harus salah satu matan: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nama varian gasan select kada sah. Nama varian { $variantName } muncul di { $numOptions } opsi tagal jumlah nang dipilih { $numToSelect }.

select-variant-name-without-options = Ada varian nang ditantuakan gasan select tagal kadada opsi gasan nama varian nang mungkin: { $variantName }.

select-variant-name-not-possible = Nama varian { $variantName } nang ditantuakan gasan select bukan nama varian nang mungkin.

select-too-few-options = Kada kawa mamilih { $numToSelect } komponen matan hanya { $numOptions }.

select-from-sequence-too-few-values = Kada kawa mamilih { $numToSelect } nilai matan barisan sapanjang { $length }.

select-from-sequence-indices-count-mismatch = Jumlah indeks nang ditantuakan gasan select harus sama lawan jumlah nang dipilih

select-from-sequence-indices-not-integers = Barataan indeks nang ditantuakan gasan select harus barupa bilangan bulat

select-from-sequence-index-excluded = Indeks nang ditantuakan gasan selectfromsequence tamasuk nang dikacualiakan

select-from-sequence-indices-excluded-combination = Indeks nang ditantuakan gasan selectfromsequence maulah kombinasi nang dikacualiakan

select-from-sequence-coprime-not-positive-integers = Kada kawa mamilih kombinasi saling prima lantaran nang dipilih bukan bilangan bulat positif.

select-from-sequence-coprime-common-factor = Kada kawa mamilih bilangan nang saling prima. Barataan nilai nang mungkin bapunya faktor pasakutuan. (Nilai "from" atawa "to" nang ditantuakan harus saling prima lawan "step".)

select-from-sequence-coprime-single-number = Kada kawa mamilih kombinasi saling prima matan sabuting bilangan tunggal nang bukan 1.

select-from-sequence-excluded-too-many-combinations = Labih matan 70% kombinasi dikacualiakan di selectFromSequence

select-from-sequence-coprime-none-found = Kada baisi mamilih bilangan nang saling prima. Barataan nilai nang mungkin bapunya faktor pasakutuan.

select-from-sequence-too-few-unique-values = Kada kawa mamilih { $numToSelect } nilai nang balain matan barisan sapanjang { $numPossibleValues }

select-prime-numbers-too-few-values = Kada kawa mamilih { $numToSelect } nilai matan daftar bilangan prima sapanjang { $numValues }

select-prime-numbers-values-count-mismatch = Jumlah nilai nang ditantuakan gasan select harus sama lawan jumlah nang dipilih

select-prime-numbers-values-not-prime = Barataan nilai nang ditantuakan gasan select prime number harus ada di daftar bilangan prima

select-prime-numbers-values-excluded-combination = Nilai nang ditantuakan gasan selectPrimeNumbers maulah kombinasi nang dikacualiakan

select-prime-numbers-excluded-too-many-combinations = Labih matan 70% kombinasi dikacualiakan di selectPrimeNumbers

select-random-combination-fluke = Lantaran kabatulan nang amat langka, kombinasi nilai acak kada baisi dipilih

select-random-value-fluke = Lantaran kabatulan nang amat langka, nilai acak kada baisi dipilih

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] `<{ $component }>` ini kada ditampaiakan lantaran inya ada di dalam matematika tagal kada `inline`. Tambahakan `inline` supaya inya jadi daftar turun, nang muat di dalam ungkapan.
        [expanded] `<{ $component }>` ini kada ditampaiakan lantaran inya ada di dalam matematika wan `expanded`. Hapus `expanded`; kutak babaris banyak kada muat di dalam ungkapan.
        [on-graph] `<{ $component }>` ini kada ditampaiakan lantaran inya ada di dalam matematika nang digambar di grafik, nang kadada ruang gasan masukan.
       *[relative-width] `<{ $component }>` ini kada ditampaiakan lantaran inya ada di dalam matematika wan lebarnya relatif. Bari lebarnya dalam satuan absolut, misalnya `px`.
    }
