# Kadazandusun diagnostics. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the standardised Bundu-Liwan-based Kadazandusun orthography used
# by the other three files of this locale; see `locales/dtp/chrome.ftl` for
# the whole note, and for why the technical vocabulary below is a declared
# Malay loan rather than a Kadazandusun coinage.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source, and so do `PreFigure`, `DoenetML` and `Dast`.
#
# **THIS IS THE FILE WHERE THE CATALOG IS THINNEST**, because a diagnostic is
# a whole sentence and a sentence needs more of a language than a button
# label does. The sentences here are Malay; what is Kadazandusun is the frame
# they are hung on, and the frame is small enough to list:
#
#   - **«waro»** "there is" and **«aiso»** "there is none";
#   - **«amu'»** "not", **«amu' obuli»** "cannot", **«amu' nogi»** "not yet";
#   - **«om»** "and", **«toi»** "or", **«nga»** "but", **«nung»** "if";
#   - **«id»** "at, in", **«mantad»** "from", **«montok»** "for";
#   - **«dot»** the relative linker, **«diti»** "this", **«dilo'»** "that".
#
# Two phrases carry most of the file, and naming them here means a corrector
# can change all of them at once: "is ignored" is **«diabaikan»** and "have
# not implemented" is **«amu' nogi dilaksanakan»**. A speaker should expect to
# rewrite these sentences rather than to correct words inside them.
#
# Every count selection is a single `*[other]`: Kadazandusun does not mark
# number on a noun after a numeral, and `Intl.PluralRules` has no data for
# `dtp` to select a `[one]` branch with. The one `[1]` below is a numeric
# literal matched against the number itself, which stays legal.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
       *[other] { $attributes } diabaikan nung dua hujung ditetapkan
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
       *[other] { $attributes } diabaikan nung satu hujung om titik tengah ditetapkan serentak
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset aiso kesan nung aiso titik tengah

## `<line>`

line-points-undetermined-dimensions = Garis melalui titik dot amu' ditentukan dimensinya.

line-points-too-few-dimensions = Garis mesti melalui titik dot sekurang-kurangnya dua dimensi.

line-points-depend-on-variables = Garis melalui titik dot bergantung id pemboleh ubah: { $variables }.

line-equation-invalid-format = Format persamaan garis id pemboleh ubah { $variable1 } om { $variable2 } amu' otopot.

## `<ray>`

ray-overprescribed-through = Sinar ditetapkan mantad through, endpoint om direction.  through dot ditetapkan diabaikan.

ray-dimension-mismatch = numDimensions amu' sepadan id sinar.

## `<vector>`

vector-overprescribed-head = Vektor ditetapkan mantad head, tail om displacement.  head dot ditetapkan diabaikan.

vector-dimension-mismatch = numDimensions amu' sepadan id vektor.

## Attracting and constraining

attract-to-without-nearest-point = Amu' obuli ditarik id `<{ $component }>` sebab aiso pemboleh ubah keadaan nearestPoint.

constrain-to-without-nearest-point = Amu' obuli dikekang id `<{ $component }>` sebab aiso pemboleh ubah keadaan nearestPoint.

constrain-to-interior-without-nearest-point = Amu' obuli dikekang id dalam `<{ $component }>` sebab aiso pemboleh ubah keadaan nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition diabaikan montok choiceInput dot bukan inline

## Ordering children by index

choice-input-indices-count-mismatch = Indeks dot ditetapkan montok choiceInput diabaikan sebab bilangan indeks amu' sepadan om bilangan anak pilihan.

pretzel-indices-count-mismatch = Indeks dot ditetapkan montok problem diabaikan sebab bilangan indeks amu' sepadan om bilangan anak problem.

shuffle-indices-count-mismatch = Indeks dot ditetapkan montok shuffle diabaikan sebab bilangan indeks amu' sepadan om bilangan komponen.

indices-ignored-out-of-range = Indeks dot ditetapkan montok { $component } diabaikan sebab waro indeks di luar julat.

pretzel-indices-repeated = Indeks dot ditetapkan montok pretzel diabaikan sebab waro indeks dot berulang.

pretzel-circuit-first-index = Indeks dot ditetapkan montok pretzel id mode circuit diabaikan sebab indeks pertama mesti 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Supaya `<{ $component }>` berfungsi om anak string, atribut `type` mesti ditetapkan.

invalid-type-defaulting-to-math = Type { $type } amu' otopot montok komponen { $component }. Mesti salah satu mantad math, text, number toi boolean. Ditetapkan semula id math.

string-not-valid-component-to-arrange = String "{ $value }" bukan komponen dot obuli di{ $component }. Diabaikan.

## Types and variables

invalid-type-defaulting-to-number = Type { $type } amu' otopot, type ditukar id number.

invalid-variable-value = Nilai pemboleh ubah amu' otopot: `{ $value }`

## Variants

variant-index-must-be-number = Indeks varian { $index } mesti nombor

variant-index-must-be-integer = Indeks varian { $index } mesti integer

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` amu' nogi dilaksanakan montok ukuran mutlak. Lebar ditukar id relatif.

side-by-side-absolute-margins = `<{ $component }>` amu' nogi dilaksanakan montok ukuran mutlak. Jidar ditukar id relatif.

side-by-side-no-block-child = `<{ $component }>` amu' otopot: mesti waro sekurang-kurangnya satu anak blok.

## `<label>`

label-for-ignored-on-graphical = Atribut `for` id `<label>` grafik diabaikan.

label-for-must-resolve-to-one = Atribut `for` id `<label>` mesti menunjuk id satu komponen sahaja.

label-for-unresolved = Atribut `for` id `<label>` amu' obuli ditentukan id satu komponen.

label-for-answer-with-authored-inputs = Atribut `for` id `<label>` merujuk `<answer>` dot waro input ditulis penulis; rujuk terus input dilo'.

label-for-answer-without-input = Atribut `for` id `<label>` merujuk `<answer>` dot aiso input montok dilabel.

label-for-must-reference-input-or-answer = Atribut `for` id `<label>` mesti merujuk input toi answer.

## Accessibility

accessibility-short-description-or-decorative = Montok akses, `<{ $component }>` mesti waro keterangan ringkas toi ditetapkan sebagai hiasan.

accessibility-video-short-description = Montok akses, `<video>` mesti waro keterangan ringkas.

accessibility-input-short-description-or-label = Montok akses, `<{ $component }>` mesti waro keterangan ringkas toi label.

accessibility-answer-input-short-description-or-label = Montok akses, `<answer>` dot membina input mesti waro keterangan ringkas toi label.

accessibility-short-description-contains-math = Keterangan ringkas amu' patut waro komponen matematik macam `<{ $component }>`. Tulis matematik dilo' om perkataan.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } aiso kontras dot cukup montok teks tajuk seksyen (mod gelap) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; perlu sekurang-kurangnya { $threshold }:1).
       *[other] { $colorName } aiso kontras dot cukup montok teks tajuk seksyen ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; perlu sekurang-kurangnya { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` melalui { $count } titik amu' nogi dilaksanakan nung titik dilo' aiso nilai nombor.

circle-too-many-through-points = Amu' obuli mengira bulatan melalui lebih mantad 3 titik.

circle-overprescribed-radius-center-points = Amu' obuli mengira bulatan om jejari, pusat om titik dot ditetapkan serentak.

circle-center-with-multiple-points = Amu' obuli mengira bulatan om pusat dot ditetapkan melalui lebih mantad 1 titik.

circle-radius-too-small = Amu' obuli mengira bulatan: sebab jarak antara dua titik dilo' { $distance }, jejari { $radius } dot ditetapkan terlalu kecil.

circle-radius-with-many-points = Amu' obuli membina bulatan melalui lebih mantad dua titik om jejari dot ditetapkan.

circle-invalid-center-or-through-points = Pusat toi titik dot dilalui bulatan amu' otopot.

circle-radius-center-with-multiple-points = Amu' obuli mengira jejari bulatan om pusat dot ditetapkan melalui lebih mantad 1 titik.

circle-change-radius-non-numerical = Amu' obuli menukar jejari bulatan melalui titik dot aiso nilai nombor

circle-radius-with-points-non-numerical = Amu' obuli membina bulatan melalui lebih mantad satu titik om jejari dot ditetapkan nung aiso nilai nombor.

circle-change-center-non-numerical = Menukar pusat bulatan melalui titik dot aiso nilai nombor amu' nogi dilaksanakan.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
       *[other] Dimensi domain fungsi amu' cukup. Domain waro { $intervals } selang nga fungsi waro { $inputs ->
           *[other] { $inputs } input
        }.
    }

function-domain-invalid-format = Format domain fungsi amu' otopot.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Nilai maksimum fungsi dot bukan nombor diabaikan.
        [minimum] Nilai minimum fungsi dot bukan nombor diabaikan.
        [extremum] Nilai ekstremum fungsi dot bukan nombor diabaikan.
        [point] Titik fungsi dot bukan nombor diabaikan.
        [slope] Kecerunan fungsi dot bukan nombor diabaikan.
       *[other] { $type } fungsi dot bukan nombor diabaikan.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Nilai maksimum fungsi dot kosong diabaikan.
        [minimum] Nilai minimum fungsi dot kosong diabaikan.
        [extremum] Nilai ekstremum fungsi dot kosong diabaikan.
        [point] Titik fungsi dot kosong diabaikan.
       *[other] { $type } fungsi dot kosong diabaikan.
    }

function-points-too-close = Fungsi waro dua titik dot terlalu rapat. Fungsi amu' obuli ditakrifkan.

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] Lelaran fungsi obuli sahaja nung bilangan input fungsi sepadan om bilangan output. Fungsi diti waro { $inputs } input om { $outputs ->
           *[other] { $outputs } output
        }.
    }

## `<sequence>`

sequence-invalid-length = Panjang jujukan amu' otopot.  Mesti integer dot bukan negatif.

sequence-invalid-step = Langkah jujukan amu' otopot.  Mesti nombor montok jujukan jenis { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" jujukan nombor amu' otopot.  Mesti nombor.

sequence-invalid-endpoint-letters = "{ $attribute }" jujukan huruf amu' otopot.  Mesti gabungan huruf.

sequence-invalid-endpoint = "{ $attribute }" jujukan amu' otopot.

select-from-sequence-coprime-not-numbers = coprime diabaikan sebab bukan nombor dot dipilih

select-from-sequence-coprime-with-exclude-combinations = coprime diabaikan sebab excludeCombinations ditetapkan

## Resolving a `target`

target-not-found = Target montok `<{ $source }>` amu' otopot: target amu' dijumpai.

target-state-variable-not-found = Target montok `<{ $source }>` amu' otopot: pemboleh ubah keadaan dot bernama "{ $property }" amu' dijumpai id `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Pemboleh ubah `<odeSystem>` mesti berbeza mantad pemboleh ubah bebas.

ode-system-duplicate-variable-names = Amu' obuli menakrif fungsi RHS ODE om nama pemboleh ubah dot sama.

ode-system-rhs-function-error = Amu' obuli menakrif fungsi RHS ODE.  Ralat membina fungsi mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Amu' obuli menakrif sudut antara { $count } garis

angle-invalid-through-point = Titik id through `<angle>` amu' otopot

parabola-vertex-too-many-points = Parabola om bucu melalui lebih mantad 1 titik amu' nogi dilaksanakan.

parabola-too-many-points = Parabola melalui lebih mantad 3 titik amu' nogi dilaksanakan.

intersection-too-many-items = Persilangan montok lebih mantad dua item amu' nogi dilaksanakan

## Other math components

ionic-compound-not-two-ions = Sebatian ionik montok selain dua ion amu' nogi dilaksanakan.

ionic-compound-needs-cation-and-anion = Sebatian ionik dilaksanakan sahaja montok satu kation om satu anion.

solve-equations-cannot-evaluate = Amu' obuli menyelesaikan persamaan sebab persamaan amu' obuli dinilai: { $equation }

math-operators-operand-number-required = operandNumber mesti ditetapkan nung mengambil operand matematik.

eigen-decomposition-failed = Amu' obuli mengira nilai eigen matriks

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
       *[other] `<matchesPattern>`: parameter { $parameters } aiso id dalam pola, jadi sentiasa sepadan om ruang kosong.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" amu' obuli ditafsirkan. Mesti none, medium, dense toi dua nombor positif dipisahkan om ruang, macam grid="1 0.5". Aiso grid dilukis.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` perlu fungsi dot waro { $expected ->
        [1] satu output, iaitu kecerunan y' id setiap titik, macam `y - x`
       *[other] dua output, iaitu vektor id setiap titik, macam `(y, -x)`
    }, nga fungsi dot diberi waro { $found ->
       *[other] { $found } output
    }. { $alternative ->
        [none] Aiso dilukis.
       *[other] `<{ $alternative }>` komponen dot sesuai montok fungsi dilo'. Aiso dilukis.
    }

field-function-attribute-ignored-with-child = Atribut `function` diabaikan sebab fungsi juga diberi id dalam komponen; dot id dalam digunakan. Beri fungsi dilo' satu cara sahaja.

field-variables-ignored =
    `<{ $component }>`: atribut `variables` menamakan pemboleh ubah ungkapan dot ditulis terus id dalam komponen. { $reason ->
        [function-child] Fungsi diti diberi sebagai anak `<function>`, dot menamakan pemboleh ubahnya sendiri, jadi `variables` diabaikan.
       *[no-expression] Aiso ungkapan macam dilo' diti, jadi `variables` diabaikan.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" amu' disokong id renderer prefigure; cara kedudukan kanan digunakan.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" amu' disokong id renderer prefigure; cara kedudukan atas digunakan.

prefigure-invalid-axis-bounds = `<graph>`: batas paksi amu' otopot montok penukaran prefigure; bbox asal (-10,-10,10,10) digunakan.

prefigure-invalid-width = `<graph>`: lebar amu' otopot montok penukaran prefigure; lebar rajah asal 425 digunakan.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio amu' otopot montok penukaran prefigure; nisbah asal 1 digunakan.

prefigure-grid-spacing-too-fine = `<graph>`: jarak grid terlalu halus montok batas paksi; grid amu' dilukis id renderer prefigure.

prefigure-annotations-not-rendered = `<graph>`: anotasi amu' dilukis nung renderer PreFigure amu' digunakan.

multiple-annotations-children = Waro beberapa anak `<annotations>` id `<graph>`; semua kecuali dot terakhir diabaikan.

## Referring to other components

copy-unrecognized-component-type = Amu' obuli melanjutkan toi menyalin jenis komponen dot amu' dikenali: { $type }.

copy-prop-not-found = Prop { $property } amu' dijumpai id komponen jenis { $component }

collect-no-source = Aiso source dijumpai montok collect.

collect-invalid-component-type = Amu' obuli mengumpul komponen jenis `<{ $component }>` sebab jenis komponen dilo' amu' otopot.

reference-index-unavailable = Amu' obuli merujuk indeks `{ $reference }`

## `<callAction>`

component-action-unavailable = Amu' obuli memanggil { $action } id komponen `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Bentuk data amu' otopot.  Baris waro panjang dot berbeza. Dijumpai id componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data waro nama lajur dot sama.  Dijumpai id componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data kurang satu nama lajur.  Dijumpai id componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Satu award montok simbar diti bergantung id simbar dot dihantar answer diti sendiri, om dilo' akan membawa kelakuan dot amu' dijangka.

answer-max-num-attempts-in-section-wide-check-work = Menetapkan `maxNumAttempts` id `<answer>` dot id dalam bekas dot waro `sectionWideCheckWork` aiso kesan, sebab bilangan percubaan dikawal bekas dilo'. Tetapkan `maxNumAttempts` id bekas dilo'.

nested-section-wide-check-work-max-num-attempts = Menetapkan `maxNumAttempts` id bekas dot waro `sectionWideCheckWork` dot id dalam bekas lain dot juga waro `sectionWideCheckWork` aiso kesan, sebab bilangan percubaan dikawal bekas di luar. Tetapkan `maxNumAttempts` id bekas di luar.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
       *[other] Atribut { $attributes } aiso kesan nung symbolicEquality amu' ditetapkan.
    }

answer-invalid-type = Jenis answer amu' otopot: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Sebab komponen `<{ $component }>` aiso nama, amu' obuli digunakan montok atribut module

module-attribute-name-already-defined = Komponen `<{ $component } name="{ $name }">` amu' obuli digunakan sebagai atribut module sebab jenis komponen `<module>` sudah waro atribut "{ $name }".

conditional-content-condition-ignored = Atribut `condition` diabaikan id komponen `<conditionalContent>` dot waro anak case toi else.

slider-markers-type-mismatch = Jenis markers amu' sepadan om jenis slider.

pretzel-problem-needs-statement-and-answer = Pretzel amu' otopot: setiap `<problem>` mesti waro satu `<statement>` om satu `<answer>`.

pretzel-circuit-first-problem-distractor = Pretzel amu' otopot: id mode="circuit", `<problem>` pertama amu' obuli jadi distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
       *[other] Nilai { $values } amu' otopot montok atribut `{ $attribute }`; diabaikan.
    }

attribute-must-be-references = Nilai `{ $value }` amu' otopot montok atribut `{ $attribute }`. Atribut mesti terdiri mantad rujukan dot bermula om `$`.

math-input-invalid-function-names = <mathInput>: nama fungsi dot amu' otopot id { $attribute } diabaikan: { $names }. Setiap nama mesti waro sekurang-kurangnya 2 aksara id bahagian paparan (huruf toi sengkang); akhiran `|<mathspeak alternative>` obuli menyusul.

## Building components from the source

component-type-invalid = Jenis komponen amu' otopot: `<{ $componentType }>`

attribute-repeated = Atribut { $attribute } amu' obuli diulang.

attribute-invalid-for-component = Atribut "{ $attribute }" amu' otopot montok komponen jenis `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Takrif gaya { $styleNumber } aiso kontras dot cukup montok { $context ->
        [text-on-background] warna teks lawan warna latar belakang
        [high-contrast] warna kontras tinggi lawan kanvas
        [line] warna garis lawan kanvas
        [marker] warna penanda lawan kanvas
       *[text-on-canvas] warna teks lawan kanvas
    }{ $mode ->
        [dark] { " (mod gelap)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; perlu sekurang-kurangnya { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Walaupun takrif gaya { $styleNumber } menetapkan warna dot cukup kontras montok mod terang, warna mod gelap dot diperoleh mantad nilai dilo' aiso kontras dot cukup antara warna teks om warna latar belakang ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; perlu sekurang-kurangnya { $threshold }:1). { $suggestion ->
        [available] Supaya kontras cukup id mod gelap, tambah kontras mod terang (contoh, tetapkan { $lightAttribute }="{ $lightColor }") toi tukar warna mod gelap (contoh, tetapkan { $darkAttribute }="{ $darkColor }").
       *[none] Supaya kontras cukup id mod gelap, tambah kontras mod terang toi tukar warna dot diperoleh dilo' om textColorDarkMode toi backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Walaupun takrif gaya { $styleNumber } menetapkan warna teks dot cukup kontras montok mod terang, warna teks mod gelap dot diperoleh mantad nilai dilo' aiso kontras dot cukup lawan kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; perlu sekurang-kurangnya { $threshold }:1). { $suggestion ->
        [available] Supaya kontras cukup id mod gelap, tambah kontras mod terang (contoh, tetapkan textColor="{ $lightColor }") toi tukar warna mod gelap (contoh, tetapkan textColorDarkMode="{ $darkColor }").
       *[none] Supaya kontras cukup id mod gelap, tambah kontras mod terang toi tukar warna dot diperoleh dilo' om textColorDarkMode.
    }

section-multiple-style-palettes = Satu seksyen obuli memilih satu <stylePalette> sahaja; dot terakhir digunakan.

## Unique variants

variant-num-to-select-not-non-negative-integer = varian unik { $component } amu' obuli ditentukan sebab numToSelect bukan integer dot bukan negatif.

variant-num-to-select-not-constant-number = varian unik { $component } amu' obuli ditentukan sebab numToSelect bukan nombor tetap.

variant-with-replacement-not-constant-boolean = varian unik { $component } amu' obuli ditentukan sebab withReplacement bukan boolean tetap.

variant-select-weight-disables-unique = Varian unik montok select dimatikan nung waro option dot waro selectWeight toi selectForVariants

variant-coprime-undetermined = varian unik { $component } amu' obuli ditentukan sebab amu' obuli ditentukan coprime sentiasa false.

variant-attribute-not-constant = varian unik { $component } amu' obuli ditentukan sebab { $attribute } bukan nilai tetap.

variant-attribute-not-number = varian unik { $component } amu' obuli ditentukan sebab { $attribute } bukan nombor.

variant-attribute-wrong-type-for-sequence =
    varian unik { $component } jenis { $type } amu' obuli ditentukan sebab { $attribute } bukan { $expected ->
        [letters-combination] gabungan huruf
        [math-expression] ungkapan matematik dot otopot
        [integer] integer
       *[number] nombor
    }.

variant-length-not-integer = varian unik { $component } amu' obuli ditentukan sebab length bukan integer.

variant-sort-not-implemented = varian unik { $component } dot waro sort amu' nogi dilaksanakan

variant-exclude-combinations-not-implemented = varian unik { $component } dot waro excludeCombinations amu' nogi dilaksanakan

variant-math-exclude-not-implemented = varian unik { $component } jenis math dot waro exclude amu' nogi dilaksanakan

variant-non-constant-exclude-not-implemented = varian unik { $component } dot waro exclude dot bukan tetap amu' nogi dilaksanakan

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: amu' disokong id renderer prefigure graph; keturunan dilangkau.

prefigure-descendant-invalid-geometry = { $subject }: geometri amu' terhingga toi amu' lengkap; keturunan dilangkau.

prefigure-curve-label-omitted = { $subject }: label amu' disokong id elemen lengkung dot ditukar; label dibuang.

prefigure-curve-unsupported-definition-type = { $subject }: jenis takrif fungsi lengkung '{ $definitionType }' amu' disokong; keturunan dilangkau.

prefigure-region-flip-functions-unsupported = { $subject }: atribut flipFunctions id regionBetweenCurves amu' disokong; keturunan dilangkau.

prefigure-region-non-formula-child = { $subject }: hanya anak fungsi jenis formula disokong id regionBetweenCurves; keturunan dilangkau.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' amu' disokong montok { $labelKind ->
        [line-family] label keluarga garis
       *[point] label titik
    }; jajaran PreFigure asal digunakan.

prefigure-fill-style-unsupported = { $subject }: gaya isian '{ $fillStyle }' amu' disokong PreFigure; isian pejal digunakan.

prefigure-line-style-unknown = { $subject }: gaya garis '{ $lineStyle }' amu' dikenali om dibuang mantad output PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: gaya penanda '{ $markerStyle }' dipetakan id gaya PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: gaya penanda '{ $markerStyle }' amu' disokong PreFigure; gaya asal digunakan.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` amu' otopot; target amu' obuli ditentukan. Anotasi dibuang.

annotation-ref-multiple-targets = `<annotation>`: `ref` menunjuk id beberapa target; target pertama digunakan.

annotation-ref-outside-graph = `<annotation>`: `ref` amu' otopot; target id luar graph dot mengandunginya. Anotasi dibuang.

annotation-ref-unsupported-target = `<annotation>`: `ref` amu' otopot; target bukan objek grafik dot disokong id penukaran prefigure. Anotasi dibuang.

annotation-text-missing = `<annotation>`: `text` kurang toi kosong; teks kosong dikeluarkan.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Kebergantungan berpusing dikesan.
       *[other] Kebergantungan berpusing dikesan id komponen `<{ $componentType }>`.
    }

reference-no-referent = Aiso rujukan dijumpai montok: `{ $reference }`

reference-multiple-referents = Waro beberapa rujukan dijumpai montok: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format atribut { $attribute } id `<{ $componentType }>` amu' otopot.

children-invalid = Anak `<{ $componentType }>` amu' otopot: waro anak dot amu' otopot: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Nilai `{ $value }` amu' otopot montok atribut `{ $attribute }`, nilai `{ $default }` digunakan

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Versi DoenetML { $version } amu' dijumpai.
       *[other] Versi DoenetML { $version } amu' dijumpai. Versi { $fallback } digunakan
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML amu' otopot: { $content }

parse-tag-missing-close-tag = DoenetML amu' otopot: Tag `{ $tag }` aiso tag penutup. Tag dot menutup sendiri toi tag `</{ $tagName }>` dijangka.

parse-tag-error = DoenetML amu' otopot: Ralat id tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML amu' otopot: Atribut `{ $attribute }` dot amu' otopot nampaknya kurang nilai.

parse-attribute-invalid = DoenetML amu' otopot: Atribut `{ $attribute }` amu' otopot

parse-attribute-value-invalid = DoenetML amu' otopot: Nilai atribut `{ $value }` amu' otopot

parse-attribute-value-quote-mismatch = DoenetML amu' otopot: Nilai atribut `{ $value }` amu' otopot. Tanda petik amu' sepadan. Nampaknya kurang satu `{ $quote }`

parse-open-tag-name-missing = DoenetML amu' otopot: Waro tag dot aiso nama, macam `<`

parse-tag-not-closed = DoenetML amu' otopot: Tag `{ $tag }` amu' ditutup (nampaknya kurang satu `>`).

parse-self-closing-tag-name-missing = DoenetML amu' otopot: Waro tag dot aiso nama `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML amu' otopot: Tag `{ $tag }` amu' ditutup (nampaknya kurang `/>`).

parse-tag-invalid-attributes = DoenetML amu' otopot: Tag `{ $tag }` amu' otopot. Mungkin atributnya salah.

parse-close-tag-name-missing = DoenetML amu' otopot: Waro tag penutup dot aiso nama, macam `</`

parse-attribute-value-unquoted = Nilai atribut mesti diletak id dalam tanda petik: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML amu' otopot: Waro tag penutup `{ $tag }`, nga aiso tag pembuka dot sepadan

parse-close-tag-mismatched = DoenetML amu' otopot: Tag penutup amu' sepadan. `</{ $expected }>` dijangka. `{ $found }` dijumpai

parser-node-unconvertible = Node { $node } amu' obuli ditukar id node Dast.

## Names

name-attribute-invalid =
    Nama atribut name='{ $name }' amu' otopot. { $reason ->
        [characters] Nama obuli waro huruf, nombor, garis bawah toi sengkang sahaja.
       *[start] Nama mesti bermula om huruf.
    }

component-name-invalid-start = Nama komponen "{ $name }" amu' otopot. Nama mesti bermula om huruf.

## `<answer>` sugar

answer-video-watched-missing-video = Answer jenis videoWatched mesti waro atribut video

answer-video-watched-video-not-reference = Answer jenis videoWatched mesti waro atribut video dot jadi rujukan

answer-name-not-single-text = Atribut name id answer mesti waro satu anak text sahaja

## Referencing another document

external-doenetml-recursion-limit = Amu' obuli mengambil DoenetML luaran sebab rekursi terlalu dalam. Waro rujukan berpusing?

external-doenetml-unavailable = Amu' obuli mengambil DoenetML mantad { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML dot diambil mantad { $attribute }="{ $uri }" amu' otopot: amu' sepadan om jenis komponen "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` sudah lapuk; guna `{ $to }` ganti dilo'.
       *[other] [deprecation] Atribut `{ $from }` id `<{ $component }>` sudah lapuk; guna `{ $to }` ganti dilo'.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` sudah lapuk om diabaikan sebab `{ $to }` juga ditetapkan.
       *[other] [deprecation] Atribut `{ $from }` id `<{ $component }>` sudah lapuk om diabaikan sebab `{ $to }` juga ditetapkan.
    }

deprecated-attribute-ignored = [deprecation] Atribut `{ $attribute }` id `<{ $component }>` sudah lapuk om diabaikan.

deprecated-attribute-to-child = [deprecation] Atribut `{ $attribute }` id `<{ $component }>` sudah lapuk; guna anak `<{ $child }>` ganti dilo'.

deprecated-attribute-value-renamed = [deprecation] Nilai `{ $value }` atribut `{ $attribute }` id `<{ $component }>` sudah lapuk; guna `{ $to }` ganti dilo'.


## Language coverage

pluralize-english-only = `<pluralize>` obuli menjamakkan teks Inggeris sahaja, jadi teksnya amu' diubah id dokumen dot ditulis om { $locale }. Tulis terus bentuk jamak dilo', toi tetapkan om atribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elemen `<{ $tag }>` bukan elemen Doenet dot dikenali.

schema-element-not-allowed-at-root = Elemen `<{ $tag }>` amu' dibenarkan id akar dokumen.

schema-element-not-allowed-inside = Elemen `<{ $tag }>` amu' dibenarkan id dalam `<{ $parent }>`.

schema-attribute-unrecognized = Elemen `<{ $tag }>` aiso atribut bernama `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribut `{ $attribute }` elemen `<{ $tag }>` mesti senarai dot setiap itemnya salah satu mantad: { $allowed }
       *[other] Atribut `{ $attribute }` elemen `<{ $tag }>` mesti salah satu mantad: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nama varian montok select amu' otopot.  Nama varian { $variantName } muncul id { $numOptions } option nga bilangan dot dipilih { $numToSelect }.

select-variant-name-without-options = Waro varian ditetapkan montok select nga aiso option ditetapkan montok nama varian: { $variantName }.

select-variant-name-not-possible = Nama varian { $variantName } dot ditetapkan montok select bukan nama varian dot mungkin.

select-too-few-options = Amu' obuli memilih { $numToSelect } komponen mantad { $numOptions } sahaja.

select-from-sequence-too-few-values = Amu' obuli memilih { $numToSelect } nilai mantad jujukan dot panjangnya { $length }.

select-from-sequence-indices-count-mismatch = Bilangan indeks dot ditetapkan montok select mesti sepadan om bilangan dot dipilih

select-from-sequence-indices-not-integers = Semua indeks dot ditetapkan montok select mesti integer

select-from-sequence-index-excluded = Indeks selectfromsequence dot ditetapkan dilo' sudah dikecualikan

select-from-sequence-indices-excluded-combination = Indeks selectfromsequence dot ditetapkan dilo' gabungan dot dikecualikan

select-from-sequence-coprime-not-positive-integers = Amu' obuli memilih gabungan coprime sebab bukan integer positif dot dipilih.

select-from-sequence-coprime-common-factor = Amu' obuli memilih nombor coprime. Semua nilai dot mungkin waro faktor sepunya. (Nilai "from" toi "to" dot ditetapkan mesti coprime om "step".)

select-from-sequence-coprime-single-number = Amu' obuli memilih gabungan coprime mantad satu nombor dot bukan 1.

select-from-sequence-excluded-too-many-combinations = Lebih 70% gabungan dikecualikan id selectFromSequence

select-from-sequence-coprime-none-found = Amu' obuli memilih nombor coprime. Semua nilai dot mungkin waro faktor sepunya.

select-from-sequence-too-few-unique-values = Amu' obuli memilih { $numToSelect } nilai unik mantad jujukan dot panjangnya { $numPossibleValues }

select-prime-numbers-too-few-values = Amu' obuli memilih { $numToSelect } nilai mantad senarai nombor perdana dot panjangnya { $numValues }

select-prime-numbers-values-count-mismatch = Bilangan nilai dot ditetapkan montok select mesti sepadan om bilangan dot dipilih

select-prime-numbers-values-not-prime = Semua nilai dot ditetapkan montok select nombor perdana mesti waro id senarai nombor perdana

select-prime-numbers-values-excluded-combination = Nilai selectPrimeNumbers dot ditetapkan dilo' gabungan dot dikecualikan

select-prime-numbers-excluded-too-many-combinations = Lebih 70% gabungan dikecualikan id selectPrimeNumbers

select-random-combination-fluke = Sebab nasib dot amat jarang, gabungan nilai rawak amu' obuli dipilih

select-random-value-fluke = Sebab nasib dot amat jarang, nilai rawak amu' obuli dipilih

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] `<{ $component }>` diti amu' dipaparkan sebab id dalam matematik om bukan `inline`. Tambah `inline` supaya jadi senarai turun, dot muat id dalam ungkapan.
        [expanded] `<{ $component }>` diti amu' dipaparkan sebab id dalam matematik om `expanded`. Buang `expanded`; kotak berbilang baris amu' muat id dalam ungkapan.
        [on-graph] `<{ $component }>` diti amu' dipaparkan sebab id dalam matematik dot dilukis id graph, dot aiso ruang montok input.
       *[relative-width] `<{ $component }>` diti amu' dipaparkan sebab id dalam matematik om waro lebar relatif. Beri lebar dilo' id unit mutlak, macam `px`.
    }
