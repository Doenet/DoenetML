# Malay diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
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
#
# Malay has a single plural category, so a countable message needs no
# selection.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } diabaikan apabila dua titik hujung dinyatakan

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } diabaikan apabila titik hujung dan titik tengah kedua-duanya dinyatakan

line-segment-midpoint-offset-without-midpoint = midpointOffset tidak memberi kesan tanpa titik tengah

## `<line>`

line-points-undetermined-dimensions = Garis lurus melalui titik yang dimensinya tidak ditentukan.

line-points-too-few-dimensions = Garis lurus mesti melalui titik yang berdimensi sekurang-kurangnya dua.

line-points-depend-on-variables = Garis lurus melalui titik yang bergantung pada pemboleh ubah: { $variables }.

line-equation-invalid-format = Format tidak sah bagi persamaan garis lurus dalam pemboleh ubah { $variable1 } dan { $variable2 }.

## `<ray>`

ray-overprescribed-through = Sinar ditentukan oleh through, endpoint dan direction sekali gus. through yang dinyatakan diabaikan.

ray-dimension-mismatch = numDimensions tidak sepadan dalam sinar.

## `<vector>`

vector-overprescribed-head = Vektor ditentukan oleh head, tail dan displacement sekali gus. head yang dinyatakan diabaikan.

vector-dimension-mismatch = numDimensions tidak sepadan dalam vektor.

## Attracting and constraining

attract-to-without-nearest-point = Tidak boleh menarik ke `<{ $component }>` kerana ia tiada pemboleh ubah keadaan nearestPoint.

constrain-to-without-nearest-point = Tidak boleh mengekang kepada `<{ $component }>` kerana ia tiada pemboleh ubah keadaan nearestPoint.

constrain-to-interior-without-nearest-point = Tidak boleh mengekang ke bahagian dalam `<{ $component }>` kerana ia tiada pemboleh ubah keadaan nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition diabaikan bagi choiceInput yang bukan sebaris

## Ordering children by index

choice-input-indices-count-mismatch = Mengabaikan indeks yang dinyatakan bagi choiceInput kerana bilangan indeks tidak sepadan dengan bilangan anak choice.

pretzel-indices-count-mismatch = Mengabaikan indeks yang dinyatakan bagi problem kerana bilangan indeks tidak sepadan dengan bilangan anak problem.

shuffle-indices-count-mismatch = Mengabaikan indeks yang dinyatakan bagi shuffle kerana bilangan indeks tidak sepadan dengan bilangan komponen.

indices-ignored-out-of-range = Mengabaikan indeks yang dinyatakan bagi { $component } kerana ada indeks di luar julat.

pretzel-indices-repeated = Mengabaikan indeks yang dinyatakan bagi pretzel kerana ada indeks berulang.

pretzel-circuit-first-index = Mengabaikan indeks yang dinyatakan bagi pretzel dalam mod circuit kerana indeks pertama mesti 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Agar `<{ $component }>` berfungsi dengan anak jenis rentetan, atribut `type` mesti dinyatakan.

invalid-type-defaulting-to-math = type { $type } tidak sah bagi komponen { $component }. Ia mesti salah satu daripada math, text, number atau boolean. Ditetapkan kepada math.

string-not-valid-component-to-arrange = Rentetan "{ $value }" bukan komponen yang sah untuk { $component }. Diabaikan.

## Types and variables

invalid-type-defaulting-to-number = type { $type } tidak sah, type ditetapkan kepada number.

invalid-variable-value = Nilai pemboleh ubah tidak sah: `{ $value }`

## Variants

variant-index-must-be-number = Indeks varian { $index } mesti nombor

variant-index-must-be-integer = Indeks varian { $index } mesti integer

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` belum dilaksanakan bagi ukuran mutlak. Lebar ditetapkan kepada relatif.

side-by-side-absolute-margins = `<{ $component }>` belum dilaksanakan bagi ukuran mutlak. Jidar ditetapkan kepada relatif.

side-by-side-no-block-child = `<{ $component }>` tidak sah: ia mesti mempunyai sekurang-kurangnya satu anak jenis blok.

## `<label>`

label-for-ignored-on-graphical = Atribut `for` pada `<label>` bergrafik diabaikan.

label-for-must-resolve-to-one = Atribut `for` pada `<label>` mesti terungkai kepada tepat satu komponen.

label-for-unresolved = Atribut `for` pada `<label>` tidak dapat diungkai kepada sebarang komponen.

label-for-answer-with-authored-inputs = Atribut `for` pada `<label>` merujuk `<answer>` yang mempunyai input ditulis secara nyata; rujuk input itu terus.

label-for-answer-without-input = Atribut `for` pada `<label>` merujuk `<answer>` yang tiada input untuk dilabelkan.

label-for-must-reference-input-or-answer = Atribut `for` pada `<label>` mesti merujuk sebuah input atau sebuah jawapan.

## Accessibility

accessibility-short-description-or-decorative = Demi kebolehcapaian, `<{ $component }>` mesti mempunyai perihalan ringkas atau dinyatakan sebagai hiasan.

accessibility-video-short-description = Demi kebolehcapaian, `<video>` mesti mempunyai perihalan ringkas.

accessibility-input-short-description-or-label = Demi kebolehcapaian, `<{ $component }>` mesti mempunyai perihalan ringkas atau label.

accessibility-answer-input-short-description-or-label = Demi kebolehcapaian, `<answer>` yang mencipta input mesti mempunyai perihalan ringkas atau label.

accessibility-short-description-contains-math = Perihalan ringkas tidak sepatutnya mengandungi komponen matematik seperti `<{ $component }>`. Ejalah matematik itu dengan perkataan.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } mempunyai beza jelas yang tidak mencukupi bagi teks tajuk seksyen (mod gelap) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; memerlukan sekurang-kurangnya { $threshold }:1).
       *[other] { $colorName } mempunyai beza jelas yang tidak mencukupi bagi teks tajuk seksyen ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; memerlukan sekurang-kurangnya { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Belum melaksanakan `<circle>` melalui { $count } titik dalam kes titik itu tiada nilai berangka.

circle-too-many-through-points = Tidak dapat mengira bulatan melalui lebih daripada 3 titik.

circle-overprescribed-radius-center-points = Tidak dapat mengira bulatan dengan jejari, pusat dan titik lalu yang ketiga-tiganya dinyatakan.

circle-center-with-multiple-points = Tidak dapat mengira bulatan berpusat tertentu yang melalui lebih daripada 1 titik.

circle-radius-too-small = Tidak dapat mengira bulatan: memandangkan jarak antara dua titik itu ialah { $distance }, jejari { $radius } yang dinyatakan terlalu kecil.

circle-radius-with-many-points = Tidak dapat mencipta bulatan melalui lebih daripada dua titik dengan jejari yang dinyatakan.

circle-invalid-center-or-through-points = Pusat atau titik lalu bulatan tidak sah.

circle-radius-center-with-multiple-points = Tidak dapat mengira jejari bulatan berpusat tertentu yang melalui lebih daripada 1 titik.

circle-change-radius-non-numerical = Tidak dapat mengubah jejari bulatan yang melalui titik tanpa nilai berangka

circle-radius-with-points-non-numerical = Tidak dapat mencipta bulatan melalui lebih daripada satu titik dengan jejari yang dinyatakan apabila tiada nilai berangka.

circle-change-center-non-numerical = Belum melaksanakan penukaran pusat bulatan yang melalui titik tanpa nilai berangka.

## `<function>`

function-domain-insufficient-dimensions = Dimensi domain fungsi tidak mencukupi. Domain mempunyai { $intervals } selang tetapi fungsi mempunyai { $inputs } input.

function-domain-invalid-format = Format domain fungsi tidak sah.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Mengabaikan maksimum fungsi yang bukan berangka.
        [minimum] Mengabaikan minimum fungsi yang bukan berangka.
        [extremum] Mengabaikan ekstremum fungsi yang bukan berangka.
        [point] Mengabaikan titik fungsi yang bukan berangka.
        [slope] Mengabaikan kecerunan fungsi yang bukan berangka.
       *[other] Mengabaikan { $type } fungsi yang bukan berangka.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Mengabaikan maksimum fungsi yang kosong.
        [minimum] Mengabaikan minimum fungsi yang kosong.
        [extremum] Mengabaikan ekstremum fungsi yang kosong.
        [point] Mengabaikan titik fungsi yang kosong.
       *[other] Mengabaikan { $type } fungsi yang kosong.
    }

function-points-too-close = Fungsi mengandungi dua titik yang kedudukannya terlalu rapat. Fungsi tidak dapat ditakrifkan.

function-iterates-input-output-mismatch = Lelaran fungsi hanya mungkin jika bilangan input fungsi sama dengan bilangan outputnya. Fungsi ini mempunyai { $inputs } input dan { $outputs } output.

## `<sequence>`

sequence-invalid-length = Panjang jujukan tidak sah. Ia mesti integer bukan negatif.

sequence-invalid-step = Langkah jujukan tidak sah. Bagi jujukan jenis { $type } ia mesti nombor.

sequence-invalid-endpoint-number = "{ $attribute }" jujukan nombor tidak sah. Ia mesti nombor.

sequence-invalid-endpoint-letters = "{ $attribute }" jujukan huruf tidak sah. Ia mesti gabungan huruf.

sequence-invalid-endpoint = "{ $attribute }" jujukan tidak sah.

select-from-sequence-coprime-not-numbers = coprime diabaikan kerana bukan nombor yang dipilih

select-from-sequence-coprime-with-exclude-combinations = coprime diabaikan kerana excludeCombinations dinyatakan

## Resolving a `target`

target-not-found = target tidak sah bagi `<{ $source }>`: sasaran tidak ditemui.

target-state-variable-not-found = target tidak sah bagi `<{ $source }>`: pemboleh ubah keadaan bernama "{ $property }" tidak ditemui pada `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Pemboleh ubah `<odeSystem>` mesti berbeza daripada pemboleh ubah tak bersandar.

ode-system-duplicate-variable-names = Tidak dapat mentakrifkan fungsi ODE RHS dengan nama pemboleh ubah bersandar yang berulang.

ode-system-rhs-function-error = Tidak dapat mentakrifkan fungsi ODE RHS. Ralat semasa mencipta fungsi mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Tidak dapat mentakrifkan sudut antara { $count } garis lurus

angle-invalid-through-point = Titik tidak sah dalam through bagi `<angle>`

parabola-vertex-too-many-points = Belum melaksanakan parabola bertitik bucu yang melalui lebih daripada 1 titik.

parabola-too-many-points = Belum melaksanakan parabola yang melalui lebih daripada 3 titik.

intersection-too-many-items = Belum melaksanakan persilangan bagi lebih daripada dua item

## Other math components

ionic-compound-not-two-ions = Belum melaksanakan sebatian ionik bagi apa-apa selain dua ion.

ionic-compound-needs-cation-and-anion = Sebatian ionik hanya dilaksanakan bagi satu kation dan satu anion.

solve-equations-cannot-evaluate = Tidak dapat menyelesaikan persamaan kerana persamaan itu tidak dapat dinilai: { $equation }

math-operators-operand-number-required = operandNumber mesti dinyatakan semasa mengeluarkan operan matematik.

eigen-decomposition-failed = Tidak dapat mengira nilai eigen bagi matriks

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: parameter { $parameters } tidak muncul dalam corak, jadi ia akan sentiasa sepadan dengan ruang kosong.

## `<graph>`

graph-grid-invalid = `<graph>`: tidak dapat mentafsir grid="{ $grid }". Ia mesti none, medium, dense, atau dua nombor positif yang dipisahkan ruang, seperti grid="1 0.5". Tiada grid dilukis.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" tidak disokong dalam pemapar prefigure; kelakuan kedudukan kanan digunakan.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" tidak disokong dalam pemapar prefigure; kelakuan kedudukan atas digunakan.

prefigure-invalid-axis-bounds = `<graph>`: batas paksi tidak sah bagi penukaran prefigure; bbox lalai (-10,-10,10,10) digunakan.

prefigure-invalid-width = `<graph>`: lebar tidak sah bagi penukaran prefigure; lebar rajah lalai 425 digunakan.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio tidak sah bagi penukaran prefigure; nisbah lalai 1 digunakan.

prefigure-grid-spacing-too-fine = `<graph>`: jarak grid terlalu halus bagi had paksi; grid ditinggalkan dalam pemapar prefigure.

prefigure-annotations-not-rendered = `<graph>`: anotasi tidak akan dipaparkan apabila pemapar PreFigure tidak digunakan.

multiple-annotations-children = Beberapa anak `<annotations>` ditemui dalam `<graph>`; semuanya diabaikan kecuali yang terakhir.

## Referring to other components

copy-unrecognized-component-type = Tidak dapat melanjutkan atau menyalin jenis komponen yang tidak dikenali: { $type }.

copy-prop-not-found = Tidak menemui sifat { $property } pada komponen berjenis { $component }

collect-no-source = Tiada sumber ditemui bagi collect.

collect-invalid-component-type = Tidak dapat mengumpul komponen berjenis `<{ $component }>` kerana ia jenis komponen yang tidak sah.

reference-index-unavailable = Tidak dapat merujuk indeks `{ $reference }`

## `<callAction>`

component-action-unavailable = Tidak dapat memanggil { $action } pada komponen `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Bentuk data tidak sah. Panjang baris tidak konsisten. Ditemui dalam componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data mempunyai nama lajur yang berulang. Ditemui dalam componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data kekurangan satu nama lajur. Ditemui dalam componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Satu award bagi jawapan ini berasaskan jawapan yang dihantar oleh tag answer itu sendiri, yang akan membawa kepada kelakuan di luar jangkaan.

answer-max-num-attempts-in-section-wide-check-work = Menetapkan `maxNumAttempts` pada `<answer>` di dalam bekas yang mempunyai `sectionWideCheckWork` tidak memberi kesan, kerana bilangan percubaan dikawal oleh bekas itu. Tetapkan `maxNumAttempts` pada bekas itu.

nested-section-wide-check-work-max-num-attempts = Menetapkan `maxNumAttempts` pada bekas yang mempunyai `sectionWideCheckWork` di dalam bekas lain yang mempunyai `sectionWideCheckWork` tidak memberi kesan, kerana bilangan percubaan dikawal oleh bekas luar. Tetapkan `maxNumAttempts` pada bekas luar.

answer-attributes-need-symbolic-equality = Atribut { $attributes } tidak akan memberi kesan tanpa symbolicEquality ditetapkan.

answer-invalid-type = Jenis tidak sah bagi jawapan: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Oleh sebab komponen `<{ $component }>` tiada nama, ia tidak boleh digunakan sebagai atribut module

module-attribute-name-already-defined = Komponen `<{ $component } name="{ $name }">` tidak boleh digunakan sebagai atribut bagi module kerana jenis komponen `<module>` sudah mempunyai atribut bernama "{ $name }".

conditional-content-condition-ignored = Atribut `condition` diabaikan pada komponen `<conditionalContent>` yang mempunyai anak case atau else.

slider-markers-type-mismatch = Jenis penanda tidak sepadan dengan jenis slider.

pretzel-problem-needs-statement-and-answer = pretzel tidak sah: setiap `<problem>` mesti mengandungi satu `<statement>` dan satu `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel tidak sah: dalam mode="circuit", `<problem>` pertama tidak boleh menjadi pengganggu.

## Attribute values

attribute-invalid-values = Nilai { $values } tidak sah bagi atribut `{ $attribute }`; diabaikan.

attribute-must-be-references = Nilai `{ $value }` tidak sah bagi atribut `{ $attribute }`. Atribut itu mesti terdiri daripada rujukan yang bermula dengan `$`.

math-input-invalid-function-names = <mathInput>: mengabaikan nama fungsi yang tidak sah dalam { $attribute }: { $names }. Bahagian paparan setiap nama mesti sekurang-kurangnya 2 aksara (huruf atau sengkang); akhiran `|<mathspeak alternative>` boleh menyusul.

## Building components from the source

component-type-invalid = Jenis komponen tidak sah: `<{ $componentType }>`

attribute-repeated = Tidak boleh mengulang atribut { $attribute }.

attribute-invalid-for-component = Atribut "{ $attribute }" tidak sah bagi komponen berjenis `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Takrif gaya { $styleNumber } mempunyai beza jelas yang tidak mencukupi bagi { $context ->
        [text-on-background] warna teks terhadap warna latar belakang
        [high-contrast] warna beza tinggi terhadap kanvas
        [line] warna garis terhadap kanvas
        [marker] warna penanda terhadap kanvas
       *[text-on-canvas] warna teks terhadap kanvas
    }{ $mode ->
        [dark] { " (mod gelap)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; memerlukan sekurang-kurangnya { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Walaupun takrif gaya { $styleNumber } menyatakan warna yang memberi beza jelas mencukupi bagi mod cerah, warna mod gelap yang diterbitkan daripadanya mempunyai beza jelas yang tidak mencukupi bagi warna teks terhadap warna latar belakang ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; memerlukan sekurang-kurangnya { $threshold }:1). { $suggestion ->
        [available] Untuk memastikan beza jelas mencukupi dalam mod gelap, tingkatkan beza jelas mod cerah (contohnya tetapkan { $lightAttribute }="{ $lightColor }") atau ganti warna mod gelap (contohnya tetapkan { $darkAttribute }="{ $darkColor }").
       *[none] Untuk memastikan beza jelas mencukupi dalam mod gelap, tingkatkan beza jelas mod cerah atau ganti warna terbitan itu dengan textColorDarkMode dan/atau backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Walaupun takrif gaya { $styleNumber } menyatakan warna teks yang memberi beza jelas mencukupi bagi mod cerah, warna teks mod gelap yang diterbitkan daripadanya mempunyai beza jelas yang tidak mencukupi terhadap kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; memerlukan sekurang-kurangnya { $threshold }:1). { $suggestion ->
        [available] Untuk memastikan beza jelas mencukupi dalam mod gelap, tingkatkan beza jelas mod cerah (contohnya tetapkan textColor="{ $lightColor }") atau ganti warna mod gelap (contohnya tetapkan textColorDarkMode="{ $darkColor }").
       *[none] Untuk memastikan beza jelas mencukupi dalam mod gelap, tingkatkan beza jelas mod cerah atau ganti warna terbitan itu dengan textColorDarkMode.
    }

section-multiple-style-palettes = Satu seksyen hanya boleh memilih satu <stylePalette>; yang terakhir digunakan.

## Unique variants

variant-num-to-select-not-non-negative-integer = tidak dapat menentukan varian unik bagi { $component } kerana numToSelect bukan integer bukan negatif.

variant-num-to-select-not-constant-number = tidak dapat menentukan varian unik bagi { $component } kerana numToSelect bukan nombor malar.

variant-with-replacement-not-constant-boolean = tidak dapat menentukan varian unik bagi { $component } kerana withReplacement bukan boolean malar.

variant-select-weight-disables-unique = Varian unik bagi select dimatikan jika ada pilihan yang menyatakan selectWeight atau selectForVariants

variant-coprime-undetermined = tidak dapat menentukan varian unik bagi { $component } kerana tidak dapat memastikan coprime sentiasa palsu.

variant-attribute-not-constant = tidak dapat menentukan varian unik bagi { $component } kerana { $attribute } bukan pemalar.

variant-attribute-not-number = tidak dapat menentukan varian unik bagi { $component } kerana { $attribute } bukan nombor.

variant-attribute-wrong-type-for-sequence =
    tidak dapat menentukan varian unik bagi { $component } jenis { $type } kerana { $attribute } bukan { $expected ->
        [letters-combination] gabungan huruf
        [math-expression] ungkapan matematik yang sah
        [integer] integer
       *[number] nombor
    }.

variant-length-not-integer = tidak dapat menentukan varian unik bagi { $component } kerana length bukan integer.

variant-sort-not-implemented = belum melaksanakan varian unik bagi { $component } dengan sort

variant-exclude-combinations-not-implemented = belum melaksanakan varian unik bagi { $component } dengan excludeCombinations

variant-math-exclude-not-implemented = belum melaksanakan varian unik bagi { $component } jenis math dengan exclude

variant-non-constant-exclude-not-implemented = belum melaksanakan varian unik bagi { $component } dengan exclude yang bukan pemalar

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: tidak disokong dalam pemapar graph prefigure; keturunan dilangkau.

prefigure-descendant-invalid-geometry = { $subject }: geometri tidak terhingga atau tidak lengkap; keturunan dilangkau.

prefigure-curve-label-omitted = { $subject }: label tidak disokong pada unsur lengkung yang ditukar; label ditinggalkan.

prefigure-curve-unsupported-definition-type = { $subject }: jenis takrif fungsi lengkung '{ $definitionType }' tidak disokong; keturunan dilangkau.

prefigure-region-flip-functions-unsupported = { $subject }: atribut flipFunctions pada regionBetweenCurves tidak disokong; keturunan dilangkau.

prefigure-region-non-formula-child = { $subject }: hanya fungsi anak berjenis formula disokong pada regionBetweenCurves; keturunan dilangkau.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' tidak disokong bagi { $labelKind ->
        [line-family] label keluarga garis
       *[point] label titik
    }; penjajaran PreFigure lalai digunakan.

prefigure-fill-style-unsupported = { $subject }: gaya isian '{ $fillStyle }' tidak disokong oleh PreFigure; kembali kepada isian pejal.

prefigure-line-style-unknown = { $subject }: gaya garis '{ $lineStyle }' tidak dikenali dan ditinggalkan daripada output PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: gaya penanda '{ $markerStyle }' dipetakan kepada gaya PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: gaya penanda '{ $markerStyle }' tidak disokong oleh PreFigure; gaya lalai digunakan.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` tidak sah; sasaran tidak dapat diungkai. Anotasi ditinggalkan.

annotation-ref-multiple-targets = `<annotation>`: `ref` terungkai kepada beberapa sasaran; sasaran pertama digunakan.

annotation-ref-outside-graph = `<annotation>`: `ref` tidak sah; sasaran berada di luar graf yang mengandunginya. Anotasi ditinggalkan.

annotation-ref-unsupported-target = `<annotation>`: `ref` tidak sah; sasaran bukan objek grafik yang disokong dalam penukaran prefigure. Anotasi ditinggalkan.

annotation-text-missing = `<annotation>`: `text` tiada atau kosong; teks kosong dikeluarkan.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Kebergantungan membulat dikesan.
       *[other] Kebergantungan membulat dikesan yang melibatkan komponen `<{ $componentType }>`.
    }

reference-no-referent = Tiada rujukan ditemui bagi: `{ $reference }`

reference-multiple-referents = Beberapa rujukan ditemui bagi: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format tidak sah bagi atribut { $attribute } pada `<{ $componentType }>`.

children-invalid = Anak tidak sah bagi `<{ $componentType }>`: Ditemui anak yang tidak sah: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Nilai `{ $value }` tidak sah bagi atribut `{ $attribute }`, menggunakan nilai `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML versi { $version } tidak ditemui.
       *[other] DoenetML versi { $version } tidak ditemui. Kembali kepada versi { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML tidak sah: { $content }

parse-tag-missing-close-tag = DoenetML tidak sah: Tag `{ $tag }` tiada tag penutup. Tag yang menutup sendiri atau tag `</{ $tagName }>` dijangka.

parse-tag-error = DoenetML tidak sah: Ralat dalam tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML tidak sah: Atribut `{ $attribute }` yang tidak sah nampaknya kekurangan nilai.

parse-attribute-invalid = DoenetML tidak sah: Atribut `{ $attribute }` tidak sah

parse-attribute-value-invalid = DoenetML tidak sah: Nilai atribut `{ $value }` tidak sah

parse-attribute-value-quote-mismatch = DoenetML tidak sah: Nilai atribut `{ $value }` tidak sah. Tanda petik tidak sepadan. Nampaknya `{ $quote }` tertinggal

parse-open-tag-name-missing = DoenetML tidak sah: Ditemui tag tanpa nama tag, contohnya `<`

parse-tag-not-closed = DoenetML tidak sah: Tag `{ $tag }` tidak ditutup (nampaknya `>` tertinggal).

parse-self-closing-tag-name-missing = DoenetML tidak sah: Ditemui tag tanpa nama tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML tidak sah: Tag `{ $tag }` tidak ditutup (nampaknya `/>` tertinggal).

parse-tag-invalid-attributes = DoenetML tidak sah: Tag `{ $tag }` tidak sah. Atributnya mungkin salah.

parse-close-tag-name-missing = DoenetML tidak sah: Ditemui tag penutup tanpa nama tag, contohnya `</`

parse-attribute-value-unquoted = Nilai atribut mesti diapit tanda petik: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML tidak sah: Ditemui tag penutup `{ $tag }`, tetapi tiada tag pembuka yang sepadan

parse-close-tag-mismatched = DoenetML tidak sah: Tag penutup tidak sepadan. `</{ $expected }>` dijangka. `{ $found }` ditemui

parser-node-unconvertible = Tidak dapat menukar nod { $node } kepada nod Dast.

## Names

name-attribute-invalid =
    Atribut name='{ $name }' tidak sah. { $reason ->
        [characters] Nama hanya boleh mengandungi huruf, angka, garis bawah atau sengkang.
       *[start] Nama mesti bermula dengan huruf.
    }

component-name-invalid-start = Nama komponen "{ $name }" tidak sah. Nama mesti bermula dengan huruf.

## `<answer>` sugar

answer-video-watched-missing-video = Jawapan berjenis videoWatched mesti mempunyai atribut video

answer-video-watched-video-not-reference = Jawapan berjenis videoWatched mesti mempunyai atribut video yang merupakan rujukan

answer-name-not-single-text = Atribut name bagi jawapan mesti mempunyai satu anak text sahaja

## Referencing another document

external-doenetml-recursion-limit = Tidak dapat mengambil DoenetML luaran kerana terlalu banyak aras rekursi. Adakah terdapat rujukan membulat?

external-doenetml-unavailable = Tidak dapat mengambil DoenetML daripada { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML yang diambil daripada { $attribute }="{ $uri }" tidak sah: ia tidak sepadan dengan jenis komponen "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` akan ditamatkan; gunakan `{ $to }` sebaliknya.
       *[other] [deprecation] Atribut `{ $from }` pada `<{ $component }>` akan ditamatkan; gunakan `{ $to }` sebaliknya.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` akan ditamatkan dan diabaikan kerana `{ $to }` turut dinyatakan.
       *[other] [deprecation] Atribut `{ $from }` pada `<{ $component }>` akan ditamatkan dan diabaikan kerana `{ $to }` turut dinyatakan.
    }

deprecated-attribute-ignored = [deprecation] Atribut `{ $attribute }` pada `<{ $component }>` akan ditamatkan dan diabaikan.


## Language coverage

pluralize-english-only = `<pluralize>` hanya boleh menjamakkan bahasa Inggeris, jadi teksnya dibiarkan tidak berubah dalam dokumen yang ditulis dalam { $locale }. Tulis bentuk jamak itu terus, atau tetapkannya dengan atribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Unsur `<{ $tag }>` bukan unsur Doenet yang dikenali.

schema-element-not-allowed-at-root = Unsur `<{ $tag }>` tidak dibenarkan pada akar dokumen.

schema-element-not-allowed-inside = Unsur `<{ $tag }>` tidak dibenarkan di dalam `<{ $parent }>`.

schema-attribute-unrecognized = Unsur `<{ $tag }>` tiada atribut bernama `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribut `{ $attribute }` bagi unsur `<{ $tag }>` mesti berupa senarai yang setiap itemnya salah satu daripada: { $allowed }
       *[other] Atribut `{ $attribute }` bagi unsur `<{ $tag }>` mesti salah satu daripada: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nama varian tidak sah bagi select. Nama varian { $variantName } muncul dalam { $numOptions } pilihan tetapi bilangan yang hendak dipilih ialah { $numToSelect }.

select-variant-name-without-options = Beberapa varian dinyatakan bagi select tetapi tiada pilihan dinyatakan bagi nama varian yang mungkin: { $variantName }.

select-variant-name-not-possible = Nama varian { $variantName } yang dinyatakan bagi select bukan nama varian yang mungkin.

select-too-few-options = Tidak dapat memilih { $numToSelect } komponen daripada hanya { $numOptions }.

select-from-sequence-too-few-values = Tidak dapat memilih { $numToSelect } nilai daripada jujukan sepanjang { $length }.

select-from-sequence-indices-count-mismatch = Bilangan indeks yang dinyatakan bagi select mesti sepadan dengan bilangan yang hendak dipilih

select-from-sequence-indices-not-integers = Semua indeks yang dinyatakan bagi select mesti integer

select-from-sequence-index-excluded = Indeks selectfromsequence yang dikecualikan telah dinyatakan

select-from-sequence-indices-excluded-combination = Indeks selectfromsequence yang merupakan gabungan dikecualikan telah dinyatakan

select-from-sequence-coprime-not-positive-integers = Tidak dapat memilih gabungan koprima kerana bukan integer positif yang dipilih.

select-from-sequence-coprime-common-factor = Tidak dapat memilih nombor koprima. Semua nilai yang mungkin berkongsi satu faktor sepunya. (Nilai "from" atau "to" yang dinyatakan mesti koprima dengan "step".)

select-from-sequence-coprime-single-number = Tidak dapat memilih gabungan koprima daripada satu nombor tunggal yang bukan 1.

select-from-sequence-excluded-too-many-combinations = Lebih 70% gabungan dikecualikan dalam selectFromSequence

select-from-sequence-coprime-none-found = Tidak dapat memilih nombor koprima. Semua nilai yang mungkin berkongsi satu faktor sepunya.

select-from-sequence-too-few-unique-values = Tidak dapat memilih { $numToSelect } nilai unik daripada jujukan sepanjang { $numPossibleValues }

select-prime-numbers-too-few-values = Tidak dapat memilih { $numToSelect } nilai daripada senarai nombor perdana sepanjang { $numValues }

select-prime-numbers-values-count-mismatch = Bilangan nilai yang dinyatakan bagi select mesti sepadan dengan bilangan yang hendak dipilih

select-prime-numbers-values-not-prime = Semua nilai yang dinyatakan bagi select prime number mesti ada dalam senarai nombor perdana

select-prime-numbers-values-excluded-combination = Nilai yang dinyatakan bagi selectPrimeNumbers merupakan gabungan yang dikecualikan

select-prime-numbers-excluded-too-many-combinations = Lebih 70% gabungan dikecualikan dalam selectPrimeNumbers

select-random-combination-fluke = Disebabkan kebetulan yang amat mustahil, gabungan nilai rawak tidak dapat dipilih

select-random-value-fluke = Disebabkan kebetulan yang amat mustahil, nilai rawak tidak dapat dipilih
