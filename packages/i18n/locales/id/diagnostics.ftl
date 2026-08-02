# Indonesian diagnostics. Translated from `locales/en/diagnostics.ftl`, which
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
# Indonesian has a single plural category, so a countable message needs no
# selection.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } diabaikan ketika dua titik ujung ditentukan

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } diabaikan ketika titik ujung dan titik tengah sama-sama ditentukan

line-segment-midpoint-offset-without-midpoint = midpointOffset tidak berpengaruh tanpa titik tengah

## `<line>`

line-points-undetermined-dimensions = Garis melalui titik-titik dengan dimensi yang tidak dapat ditentukan.

line-points-too-few-dimensions = Garis harus melalui titik-titik berdimensi paling sedikit dua.

line-points-depend-on-variables = Garis melalui titik-titik yang bergantung pada variabel: { $variables }.

line-equation-invalid-format = Format persamaan garis dalam variabel { $variable1 } dan { $variable2 } tidak valid.

## `<ray>`

ray-overprescribed-through = Sinar ditentukan sekaligus oleh through, endpoint, dan direction. Mengabaikan through yang ditentukan.

ray-dimension-mismatch = numDimensions pada sinar tidak cocok.

## `<vector>`

vector-overprescribed-head = Vektor ditentukan sekaligus oleh head, tail, dan displacement. Mengabaikan head yang ditentukan.

vector-dimension-mismatch = numDimensions pada vektor tidak cocok.

## Attracting and constraining

attract-to-without-nearest-point = Tidak dapat menarik ke `<{ $component }>` karena ia tidak memiliki variabel keadaan nearestPoint.

constrain-to-without-nearest-point = Tidak dapat membatasi ke `<{ $component }>` karena ia tidak memiliki variabel keadaan nearestPoint.

constrain-to-interior-without-nearest-point = Tidak dapat membatasi ke bagian dalam `<{ $component }>` karena ia tidak memiliki variabel keadaan nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition diabaikan untuk choiceInput yang bukan inline

## Ordering children by index

choice-input-indices-count-mismatch = Mengabaikan indices yang ditentukan untuk choiceInput karena jumlah indices tidak cocok dengan jumlah anak choice.

pretzel-indices-count-mismatch = Mengabaikan indices yang ditentukan untuk problem karena jumlah indices tidak cocok dengan jumlah anak problem.

shuffle-indices-count-mismatch = Mengabaikan indices yang ditentukan untuk shuffle karena jumlah indices tidak cocok dengan jumlah komponen.

indices-ignored-out-of-range = Mengabaikan indices yang ditentukan untuk { $component } karena ada indeks di luar jangkauan.

pretzel-indices-repeated = Mengabaikan indices yang ditentukan untuk pretzel karena ada indeks yang berulang.

pretzel-circuit-first-index = Mengabaikan indices yang ditentukan untuk pretzel pada mode circuit karena indeks pertama harus 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Agar `<{ $component }>` bekerja dengan anak berupa string, atribut `type` harus ditentukan.

invalid-type-defaulting-to-math = Tipe { $type } tidak valid untuk komponen { $component }. Harus salah satu dari math, text, number, atau boolean. Menggunakan math.

string-not-valid-component-to-arrange = String "{ $value }" bukan komponen yang valid untuk { $component }. Diabaikan.

## Types and variables

invalid-type-defaulting-to-number = Tipe { $type } tidak valid, tipe disetel ke number.

invalid-variable-value = Nilai variabel tidak valid: `{ $value }`

## Variants

variant-index-must-be-number = Indeks varian { $index } harus berupa bilangan

variant-index-must-be-integer = Indeks varian { $index } harus berupa bilangan bulat

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` belum diterapkan untuk ukuran absolut. Lebar diubah menjadi relatif.

side-by-side-absolute-margins = `<{ $component }>` belum diterapkan untuk ukuran absolut. Margin diubah menjadi relatif.

side-by-side-no-block-child = `<{ $component }>` tidak valid: ia harus memiliki setidaknya satu anak berupa blok.

## `<label>`

label-for-ignored-on-graphical = Atribut `for` pada `<label>` grafis diabaikan.

label-for-must-resolve-to-one = Atribut `for` pada `<label>` harus mengarah tepat ke satu komponen.

label-for-unresolved = Atribut `for` pada `<label>` tidak dapat diarahkan ke sebuah komponen.

label-for-answer-with-authored-inputs = Atribut `for` pada `<label>` merujuk ke `<answer>` yang masukannya ditulis secara eksplisit; rujuk masukan itu secara langsung.

label-for-answer-without-input = Atribut `for` pada `<label>` merujuk ke `<answer>` yang tidak memiliki masukan untuk diberi label.

label-for-must-reference-input-or-answer = Atribut `for` pada `<label>` harus merujuk ke sebuah masukan atau sebuah jawaban.

## Accessibility

accessibility-short-description-or-decorative = Demi aksesibilitas, `<{ $component }>` harus memiliki deskripsi singkat atau ditandai sebagai dekoratif.

accessibility-video-short-description = Demi aksesibilitas, `<video>` harus memiliki deskripsi singkat.

accessibility-input-short-description-or-label = Demi aksesibilitas, `<{ $component }>` harus memiliki deskripsi singkat atau label.

accessibility-answer-input-short-description-or-label = Demi aksesibilitas, sebuah `<answer>` yang membuat masukan harus memiliki deskripsi singkat atau label.

accessibility-short-description-contains-math = Deskripsi singkat sebaiknya tidak memuat komponen matematika seperti `<{ $component }>`. Tuliskan isi matematikanya dengan kata-kata.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } memiliki kontras yang tidak memadai untuk teks judul bagian (mode gelap) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; memerlukan setidaknya { $threshold }:1).
       *[other] { $colorName } memiliki kontras yang tidak memadai untuk teks judul bagian ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; memerlukan setidaknya { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Belum diterapkan `<circle>` melalui { $count } titik ketika titik-titiknya tidak bernilai numerik.

circle-too-many-through-points = Tidak dapat menghitung lingkaran melalui lebih dari 3 titik.

circle-overprescribed-radius-center-points = Tidak dapat menghitung lingkaran dengan jari-jari, pusat, dan titik-titik yang dilalui ditentukan sekaligus.

circle-center-with-multiple-points = Tidak dapat menghitung lingkaran dengan pusat tertentu yang melalui lebih dari 1 titik.

circle-radius-too-small = Tidak dapat menghitung lingkaran: mengingat jarak antara kedua titik adalah { $distance }, jari-jari { $radius } yang ditentukan terlalu kecil.

circle-radius-with-many-points = Tidak dapat membuat lingkaran melalui lebih dari dua titik dengan jari-jari tertentu.

circle-invalid-center-or-through-points = Pusat atau titik-titik yang dilalui lingkaran tidak valid.

circle-radius-center-with-multiple-points = Tidak dapat menghitung jari-jari lingkaran dengan pusat tertentu yang melalui lebih dari 1 titik.

circle-change-radius-non-numerical = Tidak dapat mengubah jari-jari lingkaran yang titik-titik lintasannya tidak numerik

circle-radius-with-points-non-numerical = Tidak dapat membuat lingkaran melalui lebih dari satu titik dengan jari-jari tertentu ketika tidak ada nilai numerik.

circle-change-center-non-numerical = Belum diterapkan pengubahan pusat lingkaran yang melalui titik-titik tidak numerik.

## `<function>`

function-domain-insufficient-dimensions = Dimensi domain fungsi tidak mencukupi. Domain memiliki { $intervals } selang tetapi fungsi memiliki { $inputs } masukan.

function-domain-invalid-format = Format domain fungsi tidak valid.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Mengabaikan maksimum fungsi yang tidak numerik.
        [minimum] Mengabaikan minimum fungsi yang tidak numerik.
        [extremum] Mengabaikan ekstremum fungsi yang tidak numerik.
        [point] Mengabaikan titik fungsi yang tidak numerik.
        [slope] Mengabaikan kemiringan fungsi yang tidak numerik.
       *[other] Mengabaikan { $type } fungsi yang tidak numerik.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Mengabaikan maksimum fungsi yang kosong.
        [minimum] Mengabaikan minimum fungsi yang kosong.
        [extremum] Mengabaikan ekstremum fungsi yang kosong.
        [point] Mengabaikan titik fungsi yang kosong.
       *[other] Mengabaikan { $type } fungsi yang kosong.
    }

function-points-too-close = Fungsi memuat dua titik yang letaknya terlalu berdekatan. Fungsi tidak dapat didefinisikan.

function-iterates-input-output-mismatch = Iterasi fungsi hanya mungkin jika jumlah masukan sama dengan jumlah keluaran. Fungsi ini memiliki { $inputs } masukan dan { $outputs } keluaran.

## `<sequence>`

sequence-invalid-length = Panjang barisan tidak valid. Harus berupa bilangan bulat tak negatif.

sequence-invalid-step = Langkah barisan tidak valid. Harus berupa bilangan untuk barisan bertipe { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" pada barisan bilangan tidak valid. Harus berupa bilangan.

sequence-invalid-endpoint-letters = "{ $attribute }" pada barisan huruf tidak valid. Harus berupa kombinasi huruf.

sequence-invalid-endpoint = "{ $attribute }" pada barisan tidak valid.

select-from-sequence-coprime-not-numbers = coprime diabaikan karena yang dipilih bukan bilangan

select-from-sequence-coprime-with-exclude-combinations = coprime diabaikan karena excludeCombinations ditentukan

## Resolving a `target`

target-not-found = target untuk `<{ $source }>` tidak valid: target tidak ditemukan.

target-state-variable-not-found = target untuk `<{ $source }>` tidak valid: tidak ditemukan variabel keadaan bernama "{ $property }" pada `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Variabel `<odeSystem>` harus berbeda dari variabel bebas.

ode-system-duplicate-variable-names = Tidak dapat mendefinisikan fungsi ruas kanan ODE dengan nama variabel terikat yang berulang.

ode-system-rhs-function-error = Tidak dapat mendefinisikan fungsi ruas kanan ODE. Kesalahan saat membuat fungsi mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Tidak dapat mendefinisikan sudut antara { $count } garis

angle-invalid-through-point = Terdapat titik tidak valid pada through milik `<angle>`

parabola-vertex-too-many-points = Belum diterapkan parabola dengan titik puncak tertentu yang melalui lebih dari 1 titik.

parabola-too-many-points = Belum diterapkan parabola melalui lebih dari 3 titik.

intersection-too-many-items = Belum diterapkan irisan untuk lebih dari dua objek

## Other math components

ionic-compound-not-two-ions = Belum diterapkan senyawa ion selain untuk dua ion.

ionic-compound-needs-cation-and-anion = Senyawa ion hanya diterapkan untuk satu kation dan satu anion.

solve-equations-cannot-evaluate = Tidak dapat menyelesaikan persamaan karena persamaan tidak dapat dievaluasi: { $equation }

math-operators-operand-number-required = operandNumber harus ditentukan ketika mengambil sebuah operan matematika.

eigen-decomposition-failed = Tidak dapat menghitung nilai eigen matriks

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: parameter { $parameters } tidak muncul dalam pola, sehingga akan selalu cocok dengan kekosongan.

## `<graph>`

graph-grid-invalid = `<graph>`: tidak dapat menafsirkan grid="{ $grid }". Nilainya harus none, medium, dense, atau dua bilangan positif yang dipisahkan spasi, misalnya grid="1 0.5". Kisi tidak digambar.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" tidak didukung pada perender prefigure; menggunakan perilaku posisi kanan.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" tidak didukung pada perender prefigure; menggunakan perilaku posisi atas.

prefigure-invalid-axis-bounds = `<graph>`: batas sumbu tidak valid untuk konversi prefigure; menggunakan bbox bawaan (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: lebar tidak valid untuk konversi prefigure; menggunakan lebar diagram bawaan 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio tidak valid untuk konversi prefigure; menggunakan rasio aspek bawaan 1.

prefigure-grid-spacing-too-fine = `<graph>`: jarak kisi terlalu rapat untuk batas sumbunya; kisi dihilangkan pada perender prefigure.

prefigure-annotations-not-rendered = `<graph>`: anotasi tidak akan digambar ketika perender PreFigure tidak digunakan.

multiple-annotations-children = Ditemukan beberapa anak `<annotations>` dalam `<graph>`; semuanya diabaikan kecuali yang terakhir.

## Referring to other components

copy-unrecognized-component-type = Tidak dapat memperluas atau menyalin tipe komponen yang tidak dikenali: { $type }.

copy-prop-not-found = Tidak dapat menemukan properti { $property } pada komponen bertipe { $component }

collect-no-source = Tidak ditemukan sumber untuk collect.

collect-invalid-component-type = Tidak dapat mengumpulkan komponen bertipe `<{ $component }>` karena itu bukan tipe komponen yang valid.

reference-index-unavailable = Tidak dapat merujuk indeks `{ $reference }`

## `<callAction>`

component-action-unavailable = Tidak dapat memanggil { $action } pada komponen `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Bentuk data tidak valid. Panjang baris tidak konsisten. Ditemukan pada componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data memiliki nama kolom yang berulang. Ditemukan pada componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data kehilangan sebuah nama kolom. Ditemukan pada componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Sebuah award untuk jawaban ini didasarkan pada jawaban yang dikirim oleh tag answer itu sendiri, yang akan menimbulkan perilaku tak terduga.

answer-max-num-attempts-in-section-wide-check-work = Menyetel `maxNumAttempts` pada `<answer>` di dalam wadah dengan `sectionWideCheckWork` tidak berpengaruh, karena jumlah percobaan dikendalikan oleh wadah tersebut. Setel `maxNumAttempts` pada wadahnya.

nested-section-wide-check-work-max-num-attempts = Menyetel `maxNumAttempts` pada wadah dengan `sectionWideCheckWork` yang berada di dalam wadah lain dengan `sectionWideCheckWork` tidak berpengaruh, karena jumlah percobaan dikendalikan oleh wadah terluar. Setel `maxNumAttempts` pada wadah terluar.

answer-attributes-need-symbolic-equality = Atribut { $attributes } tidak akan berpengaruh tanpa symbolicEquality disetel.

answer-invalid-type = Tipe untuk answer tidak valid: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Karena komponen `<{ $component }>` tidak memiliki nama, ia tidak dapat dipakai sebagai atribut modul

module-attribute-name-already-defined = Komponen `<{ $component } name="{ $name }">` tidak dapat dipakai sebagai atribut sebuah modul karena tipe komponen `<module>` sudah mendefinisikan atribut "{ $name }".

conditional-content-condition-ignored = Atribut `condition` diabaikan pada komponen `<conditionalContent>` yang memiliki anak case atau else.

slider-markers-type-mismatch = Tipe penanda tidak cocok dengan tipe penggeser.

pretzel-problem-needs-statement-and-answer = pretzel tidak valid: setiap `<problem>` harus memuat satu `<statement>` dan satu `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel tidak valid: pada mode="circuit", `<problem>` pertama tidak boleh berupa pengecoh.

## Attribute values

attribute-invalid-values = Nilai { $values } untuk atribut `{ $attribute }` tidak valid; diabaikan.

attribute-must-be-references = Nilai `{ $value }` untuk atribut `{ $attribute }` tidak valid. Atribut harus tersusun dari referensi yang diawali `$`.

math-input-invalid-function-names = <mathInput>: mengabaikan nama fungsi yang tidak valid pada { $attribute }: { $names }. Bagian tampilan setiap nama harus terdiri atas paling sedikit 2 karakter (huruf atau tanda hubung); boleh diikuti akhiran opsional `|<alternatif mathspeak>`.

## Building components from the source

component-type-invalid = Tipe komponen tidak valid: `<{ $componentType }>`

attribute-repeated = Atribut { $attribute } tidak boleh diulang.

attribute-invalid-for-component = Atribut "{ $attribute }" tidak valid untuk komponen bertipe `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Definisi gaya { $styleNumber } memiliki kontras yang tidak memadai untuk { $context ->
        [text-on-background] warna teks terhadap warna latar
        [high-contrast] warna kontras tinggi terhadap kanvas
        [line] warna garis terhadap kanvas
        [marker] warna penanda terhadap kanvas
       *[text-on-canvas] warna teks terhadap kanvas
    }{ $mode ->
        [dark] { " (mode gelap)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; memerlukan setidaknya { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Meskipun definisi gaya { $styleNumber } menentukan warna-warna dengan kontras yang memadai untuk mode terang, warna mode gelap yang diturunkan dari nilai-nilai itu memiliki kontras yang tidak memadai antara warna teks dan warna latar ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; memerlukan setidaknya { $threshold }:1). { $suggestion ->
        [available] Untuk memastikan kontras memadai pada mode gelap, tingkatkan kontras mode terang (misalnya setel { $lightAttribute }="{ $lightColor }") atau timpa warna mode gelap (misalnya setel { $darkAttribute }="{ $darkColor }").
       *[none] Untuk memastikan kontras memadai pada mode gelap, tingkatkan kontras mode terang atau timpa warna turunan dengan textColorDarkMode dan/atau backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Meskipun definisi gaya { $styleNumber } menentukan warna teks dengan kontras yang memadai untuk mode terang, warna teks mode gelap yang diturunkan dari nilai itu memiliki kontras yang tidak memadai terhadap kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; memerlukan setidaknya { $threshold }:1). { $suggestion ->
        [available] Untuk memastikan kontras memadai pada mode gelap, tingkatkan kontras mode terang (misalnya setel textColor="{ $lightColor }") atau timpa warna mode gelap (misalnya setel textColorDarkMode="{ $darkColor }").
       *[none] Untuk memastikan kontras memadai pada mode gelap, tingkatkan kontras mode terang atau timpa warna turunan dengan textColorDarkMode.
    }

section-multiple-style-palettes = Sebuah bagian hanya dapat memilih satu <stylePalette>; menggunakan yang terakhir.

## Unique variants

variant-num-to-select-not-non-negative-integer = tidak dapat menentukan varian unik dari { $component } karena numToSelect bukan bilangan bulat tak negatif.

variant-num-to-select-not-constant-number = tidak dapat menentukan varian unik dari { $component } karena numToSelect bukan konstanta.

variant-with-replacement-not-constant-boolean = tidak dapat menentukan varian unik dari { $component } karena withReplacement bukan boolean konstan.

variant-select-weight-disables-unique = varian unik dari select dinonaktifkan jika sebuah opsi menentukan selectWeight atau selectForVariants

variant-coprime-undetermined = tidak dapat menentukan varian unik dari { $component } karena tidak dapat dipastikan coprime selalu salah.

variant-attribute-not-constant = tidak dapat menentukan varian unik dari { $component } karena { $attribute } bukan konstanta.

variant-attribute-not-number = tidak dapat menentukan varian unik dari { $component } karena { $attribute } bukan bilangan.

variant-attribute-wrong-type-for-sequence =
    tidak dapat menentukan varian unik dari { $component } bertipe { $type } karena { $attribute } bukan { $expected ->
        [letters-combination] kombinasi huruf
        [math-expression] ekspresi matematika yang valid
        [integer] bilangan bulat
       *[number] bilangan
    }.

variant-length-not-integer = tidak dapat menentukan varian unik dari { $component } karena length bukan bilangan bulat.

variant-sort-not-implemented = belum diterapkan varian unik dari { $component } dengan sort

variant-exclude-combinations-not-implemented = belum diterapkan varian unik dari { $component } dengan excludeCombinations

variant-math-exclude-not-implemented = belum diterapkan varian unik dari { $component } bertipe math dengan exclude

variant-non-constant-exclude-not-implemented = belum diterapkan varian unik dari { $component } dengan exclude yang tidak konstan

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: tidak didukung pada perender prefigure grafik; turunan dilewati.

prefigure-descendant-invalid-geometry = { $subject }: geometri tidak hingga atau tidak lengkap; turunan dilewati.

prefigure-curve-label-omitted = { $subject }: label tidak didukung pada elemen kurva hasil konversi; label dihilangkan.

prefigure-curve-unsupported-definition-type = { $subject }: tipe definisi fungsi kurva '{ $definitionType }' tidak didukung; turunan dilewati.

prefigure-region-flip-functions-unsupported = { $subject }: atribut flipFunctions pada regionBetweenCurves tidak didukung; turunan dilewati.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves hanya mendukung fungsi anak bertipe formula; turunan dilewati.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' tidak didukung untuk { $labelKind ->
        [line-family] label keluarga garis
       *[point] label titik
    }; menggunakan perataan bawaan PreFigure.

prefigure-fill-style-unsupported = { $subject }: gaya isian '{ $fillStyle }' tidak didukung oleh PreFigure; beralih ke isian padat.

prefigure-line-style-unknown = { $subject }: gaya garis '{ $lineStyle }' tidak dikenali dan dihilangkan dari keluaran PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: gaya penanda '{ $markerStyle }' dipetakan ke gaya 'diamond' milik PreFigure.

prefigure-marker-style-unsupported = { $subject }: gaya penanda '{ $markerStyle }' tidak didukung oleh PreFigure; menggunakan gaya bawaan.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` tidak valid; target tidak dapat diarahkan. Anotasi dihilangkan.

annotation-ref-multiple-targets = `<annotation>`: `ref` mengarah ke beberapa target; menggunakan target pertama.

annotation-ref-outside-graph = `<annotation>`: `ref` tidak valid; target berada di luar grafik yang memuatnya. Anotasi dihilangkan.

annotation-ref-unsupported-target = `<annotation>`: `ref` tidak valid; target bukan objek grafis yang didukung dalam konversi prefigure. Anotasi dihilangkan.

annotation-text-missing = `<annotation>`: `text` hilang atau kosong; menghasilkan teks kosong.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Terdeteksi ketergantungan melingkar.
       *[other] Terdeteksi ketergantungan melingkar yang melibatkan komponen `<{ $componentType }>`.
    }

reference-no-referent = Tidak ditemukan acuan untuk referensi: `{ $reference }`

reference-multiple-referents = Ditemukan beberapa acuan untuk referensi: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format atribut { $attribute } pada `<{ $componentType }>` tidak valid.

children-invalid = Anak `<{ $componentType }>` tidak valid: ditemukan anak yang tidak valid: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Nilai `{ $value }` untuk atribut `{ $attribute }` tidak valid, menggunakan nilai `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML versi { $version } tidak ditemukan.
       *[other] DoenetML versi { $version } tidak ditemukan. Kembali ke versi { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML tidak valid: { $content }

parse-tag-missing-close-tag = DoenetML tidak valid: Tag `{ $tag }` tidak memiliki tag penutup. Diharapkan sebuah tag yang menutup sendiri atau sebuah tag `</{ $tagName }>`.

parse-tag-error = DoenetML tidak valid: Kesalahan pada tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML tidak valid: Atribut `{ $attribute }` tampaknya kehilangan nilai.

parse-attribute-invalid = DoenetML tidak valid: Atribut `{ $attribute }` tidak valid

parse-attribute-value-invalid = DoenetML tidak valid: Nilai atribut `{ $value }` tidak valid

parse-attribute-value-quote-mismatch = DoenetML tidak valid: Nilai atribut `{ $value }` tidak valid. Tanda kutip tidak cocok. Anda tampaknya kehilangan sebuah `{ $quote }`

parse-open-tag-name-missing = DoenetML tidak valid: Ditemukan tag tanpa nama tag, misalnya `<`

parse-tag-not-closed = DoenetML tidak valid: Tag `{ $tag }` belum ditutup (tampaknya `>` hilang).

parse-self-closing-tag-name-missing = DoenetML tidak valid: Ditemukan tag tanpa nama tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML tidak valid: Tag `{ $tag }` belum ditutup (tampaknya `/>` hilang).

parse-tag-invalid-attributes = DoenetML tidak valid: Tag `{ $tag }` tidak valid. Atributnya mungkin keliru.

parse-close-tag-name-missing = DoenetML tidak valid: Ditemukan tag penutup tanpa nama tag, misalnya `</`

parse-attribute-value-unquoted = Nilai atribut harus diapit tanda kutip: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML tidak valid: Ditemukan tag penutup `{ $tag }`, tetapi tidak ada tag pembuka yang bersesuaian

parse-close-tag-mismatched = DoenetML tidak valid: Tag penutup tidak cocok. Diharapkan `</{ $expected }>`. Ditemukan `{ $found }`

parser-node-unconvertible = Tidak dapat mengubah simpul { $node } menjadi simpul Dast.

## Names

name-attribute-invalid =
    Atribut name='{ $name }' tidak valid. { $reason ->
        [characters] Nama hanya boleh memuat huruf, angka, garis bawah, atau tanda hubung.
       *[start] Nama harus diawali dengan huruf.
    }

component-name-invalid-start = Nama komponen "{ $name }" tidak valid. Nama harus diawali dengan huruf.

## `<answer>` sugar

answer-video-watched-missing-video = answer bertipe videoWatched harus memiliki atribut video

answer-video-watched-video-not-reference = answer bertipe videoWatched harus memiliki atribut video berupa sebuah referensi

answer-name-not-single-text = Atribut name pada answer harus memiliki tepat satu anak berupa teks

## Referencing another document

external-doenetml-recursion-limit = Tidak dapat mengambil DoenetML eksternal karena terlalu banyak tingkat rekursi. Adakah referensi melingkar?

external-doenetml-unavailable = Tidak dapat mengambil DoenetML dari { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML yang diambil dari { $attribute }="{ $uri }" tidak valid: ia tidak cocok dengan tipe komponen "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` sudah usang; gunakan `{ $to }`.
       *[other] [deprecation] Atribut `{ $from }` pada `<{ $component }>` sudah usang; gunakan `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` sudah usang dan diabaikan karena `{ $to }` juga ditentukan.
       *[other] [deprecation] Atribut `{ $from }` pada `<{ $component }>` sudah usang dan diabaikan karena `{ $to }` juga ditentukan.
    }

deprecated-attribute-ignored = [deprecation] Atribut `{ $attribute }` pada `<{ $component }>` sudah usang dan diabaikan.


## Language coverage

pluralize-english-only = `<pluralize>` hanya dapat membentuk jamak bahasa Inggris, sehingga teksnya dibiarkan apa adanya dalam dokumen yang ditulis dalam { $locale }. Tuliskan bentuk jamaknya langsung, atau tentukan dengan atribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elemen `<{ $tag }>` bukan elemen Doenet yang dikenali.

schema-element-not-allowed-at-root = Elemen `<{ $tag }>` tidak diizinkan pada akar dokumen.

schema-element-not-allowed-inside = Elemen `<{ $tag }>` tidak diizinkan di dalam `<{ $parent }>`.

schema-attribute-unrecognized = Elemen `<{ $tag }>` tidak memiliki atribut bernama `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribut `{ $attribute }` pada elemen `<{ $tag }>` harus berupa daftar yang setiap itemnya salah satu dari: { $allowed }
       *[other] Atribut `{ $attribute }` pada elemen `<{ $tag }>` harus salah satu dari: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nama varian untuk select tidak valid. Nama varian { $variantName } muncul pada { $numOptions } opsi tetapi jumlah yang dipilih adalah { $numToSelect }.

select-variant-name-without-options = Beberapa varian ditentukan untuk select tetapi tidak ada opsi untuk nama varian yang mungkin: { $variantName }.

select-variant-name-not-possible = Nama varian { $variantName } yang ditentukan untuk select bukan nama varian yang mungkin.

select-too-few-options = Tidak dapat memilih { $numToSelect } komponen dari hanya { $numOptions }.

select-from-sequence-too-few-values = Tidak dapat memilih { $numToSelect } nilai dari barisan sepanjang { $length }.

select-from-sequence-indices-count-mismatch = Jumlah indeks yang ditentukan untuk select harus sama dengan jumlah yang dipilih

select-from-sequence-indices-not-integers = Semua indeks yang ditentukan untuk select harus berupa bilangan bulat

select-from-sequence-index-excluded = Indeks yang ditentukan untuk selectfromsequence termasuk yang dikecualikan

select-from-sequence-indices-excluded-combination = Indeks yang ditentukan untuk selectfromsequence membentuk kombinasi yang dikecualikan

select-from-sequence-coprime-not-positive-integers = Tidak dapat memilih kombinasi saling prima karena yang dipilih bukan bilangan bulat positif.

select-from-sequence-coprime-common-factor = Tidak dapat memilih bilangan-bilangan yang saling prima. Semua nilai yang mungkin memiliki faktor persekutuan. (Nilai "from" atau "to" yang ditentukan harus saling prima dengan "step".)

select-from-sequence-coprime-single-number = Tidak dapat memilih kombinasi saling prima dari sebuah bilangan tunggal yang bukan 1.

select-from-sequence-excluded-too-many-combinations = Lebih dari 70% kombinasi dikecualikan pada selectFromSequence

select-from-sequence-coprime-none-found = Tidak berhasil memilih bilangan-bilangan yang saling prima. Semua nilai yang mungkin memiliki faktor persekutuan.

select-from-sequence-too-few-unique-values = Tidak dapat memilih { $numToSelect } nilai berbeda dari barisan sepanjang { $numPossibleValues }

select-prime-numbers-too-few-values = Tidak dapat memilih { $numToSelect } nilai dari daftar bilangan prima sepanjang { $numValues }

select-prime-numbers-values-count-mismatch = Jumlah nilai yang ditentukan untuk select harus sama dengan jumlah yang dipilih

select-prime-numbers-values-not-prime = Semua nilai yang ditentukan untuk select prime number harus ada dalam daftar bilangan prima

select-prime-numbers-values-excluded-combination = Nilai yang ditentukan untuk selectPrimeNumbers membentuk kombinasi yang dikecualikan

select-prime-numbers-excluded-too-many-combinations = Lebih dari 70% kombinasi dikecualikan pada selectPrimeNumbers

select-random-combination-fluke = Karena kebetulan yang amat sangat jarang, kombinasi nilai acak tidak berhasil dipilih

select-random-value-fluke = Karena kebetulan yang amat sangat jarang, nilai acak tidak berhasil dipilih
