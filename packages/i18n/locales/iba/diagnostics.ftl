# Iban diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the standard Sarawak Iban orthography used by the other three
# files of this locale; see `locales/iba/chrome.ftl` for the whole note on the
# spelling and on the Iban function words this file can be checked against.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source, and so do `PreFigure`, `DoenetML` and `Dast`.
#
# TWO PHRASES CARRY MOST OF THIS FILE, and naming them here means a corrector
# can change all of them at once. "is ignored" is **«enda dititihka»** —
# literally "is not followed" — and "have not implemented" is **«apin
# digaga»**, using «apin», the Iban "not yet". «enda» negates a verb, «ukai» a
# noun, and «nadai» an existence; a Malay «tidak» or «bukan» anywhere in this
# file is a defect.
#
# DECLARED LOANS. The technical nouns are the Malay school words — `komponen`,
# `atribut`, `indeks`, `matriks`, `parameter`, `format`, `versi`, `rekursi`,
# `dimensyen`, `fungsi`, `vektor`, `nilai eigen`, `grid`, `label`, `input` —
# because that is what an Iban reader has met them as, and a coinage would be
# worse than a loan already in use.
#
# Every count selection is a single `*[other]`: Iban does not mark number on a
# noun after a numeral, and `Intl.PluralRules` has no data for `iba` to select
# a `[one]` branch with. The one `[1]` below is a numeric literal matched
# against the number itself, which stays legal.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
       *[other] { $attributes } enda dititihka lebuh dua ujung disebut
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
       *[other] { $attributes } enda dititihka lebuh siti ujung enggau titik tengah disebut sama-sama
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset nadai guna enti titik tengah enda disebut

## `<line>`

line-points-undetermined-dimensions = Garis ti nengah titik ti enda dikelala dimensyen iya.

line-points-too-few-dimensions = Garis patut nengah titik ti bisi sekurang-kurang dua dimensyen.

line-points-depend-on-variables = Garis nengah titik ti begantung ba pemubah: { $variables }.

line-equation-invalid-format = Format persamaan garis dalam pemubah { $variable1 } enggau { $variable2 } enda betul.

## `<ray>`

ray-overprescribed-through = Sinar disebut ngena through, endpoint enggau direction.  through ti disebut enda dititihka.

ray-dimension-mismatch = numDimensions enda sebaka dalam sinar.

## `<vector>`

vector-overprescribed-head = Vektor disebut ngena head, tail enggau displacement.  head ti disebut enda dititihka.

vector-dimension-mismatch = numDimensions enda sebaka dalam vektor.

## Attracting and constraining

attract-to-without-nearest-point = Enda ulih ditarit ngagai `<{ $component }>` laban iya nadai pemubah nearestPoint.

constrain-to-without-nearest-point = Enda ulih dikangkang ngagai `<{ $component }>` laban iya nadai pemubah nearestPoint.

constrain-to-interior-without-nearest-point = Enda ulih dikangkang ngagai dalam `<{ $component }>` laban iya nadai pemubah nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition enda dititihka ba choiceInput ti ukai inline

## Ordering children by index

choice-input-indices-count-mismatch = Indeks ti disebut ke choiceInput enda dititihka laban penyampau indeks enda sebaka enggau penyampau anak pilih.

pretzel-indices-count-mismatch = Indeks ti disebut ke problem enda dititihka laban penyampau indeks enda sebaka enggau penyampau anak problem.

shuffle-indices-count-mismatch = Indeks ti disebut ke shuffle enda dititihka laban penyampau indeks enda sebaka enggau penyampau komponen.

indices-ignored-out-of-range = Indeks ti disebut ke { $component } enda dititihka laban sekeda indeks luar ari julat.

pretzel-indices-repeated = Indeks ti disebut ke pretzel enda dititihka laban sekeda indeks diulang.

pretzel-circuit-first-index = Indeks ti disebut ke pretzel dalam mode circuit enda dititihka laban indeks ti keterubah patut 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Ngambika `<{ $component }>` bejalai enggau anak string, atribut `type` patut disebut.

invalid-type-defaulting-to-math = Type { $type } enda betul ke komponen { $component }. Patut siti ari math, text, number tauka boolean. Dipulaika ngagai math.

string-not-valid-component-to-arrange = String "{ $value }" ukai komponen ti ulih di{ $component }. Enda dititihka.

## Types and variables

invalid-type-defaulting-to-number = Type { $type } enda betul, type ditukar ngagai number.

invalid-variable-value = Nilai pemubah enda betul: `{ $value }`

## Variants

variant-index-must-be-number = Indeks varian { $index } patut nambar

variant-index-must-be-integer = Indeks varian { $index } patut nambar bulat

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` apin digaga ke ukur mutlak. Lebar ditukar ngagai relatif.

side-by-side-absolute-margins = `<{ $component }>` apin digaga ke ukur mutlak. Birai ditukar ngagai relatif.

side-by-side-no-block-child = `<{ $component }>` enda betul: iya patut bisi sekurang-kurang siti anak blok.

## `<label>`

label-for-ignored-on-graphical = Atribut `for` ba `<label>` grafik enda dititihka.

label-for-must-resolve-to-one = Atribut `for` ba `<label>` patut nunjuk ngagai siti komponen aja.

label-for-unresolved = Atribut `for` ba `<label>` enda ulih dipetara ngagai komponen.

label-for-answer-with-authored-inputs = Atribut `for` ba `<label>` nunjuk ngagai `<answer>` ti udah bisi input ditulis penulis; tunjuk terus ngagai input nya.

label-for-answer-without-input = Atribut `for` ba `<label>` nunjuk ngagai `<answer>` ti nadai input ke dilabel.

label-for-must-reference-input-or-answer = Atribut `for` ba `<label>` patut nunjuk ngagai input tauka answer.

## Accessibility

accessibility-short-description-or-decorative = Ke akses, `<{ $component }>` patut bisi penerang pandak tauka disebut baka perengka perias.

accessibility-video-short-description = Ke akses, `<video>` patut bisi penerang pandak.

accessibility-input-short-description-or-label = Ke akses, `<{ $component }>` patut bisi penerang pandak tauka label.

accessibility-answer-input-short-description-or-label = Ke akses, `<answer>` ti ngaga input patut bisi penerang pandak tauka label.

accessibility-short-description-contains-math = Penerang pandak enda patut bisi komponen matematik baka `<{ $component }>`. Tulis matematik nya ngena jaku.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } nadai kontras ti chukup ke teks pala seksyen (mode chelum) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; patut sekurang-kurang { $threshold }:1).
       *[other] { $colorName } nadai kontras ti chukup ke teks pala seksyen ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; patut sekurang-kurang { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` ti nengah { $count } titik apin digaga lebuh titik nya nadai nilai nambar.

circle-too-many-through-points = Enda ulih ngira bulatan ti nengah lebih ari 3 titik.

circle-overprescribed-radius-center-points = Enda ulih ngira bulatan enggau jejari, pun enggau titik ti disebut sama-sama.

circle-center-with-multiple-points = Enda ulih ngira bulatan enggau pun ti disebut nengah lebih ari 1 titik.

circle-radius-too-small = Enda ulih ngira bulatan: laban jarak entara dua titik nya { $distance }, jejari { $radius } ti disebut mimit agi ari patut.

circle-radius-with-many-points = Enda ulih ngaga bulatan nengah lebih ari dua titik enggau jejari ti disebut.

circle-invalid-center-or-through-points = Pun tauka titik ti dilalui bulatan enda betul.

circle-radius-center-with-multiple-points = Enda ulih ngira jejari bulatan enggau pun ti disebut nengah lebih ari 1 titik.

circle-change-radius-non-numerical = Enda ulih nukar jejari bulatan ti nengah titik ti nadai nilai nambar

circle-radius-with-points-non-numerical = Enda ulih ngaga bulatan nengah lebih ari siti titik enggau jejari ti disebut lebuh nadai nilai nambar.

circle-change-center-non-numerical = Nukar pun bulatan ti nengah titik ti nadai nilai nambar apin digaga.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
       *[other] Dimensyen domain fungsi enda chukup. Domain bisi { $intervals } selang tang fungsi bisi { $inputs ->
           *[other] { $inputs } input
        }.
    }

function-domain-invalid-format = Format domain fungsi enda betul.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Nilai pemadu besai fungsi ti ukai nambar enda dititihka.
        [minimum] Nilai pemadu mit fungsi ti ukai nambar enda dititihka.
        [extremum] Nilai ujung fungsi ti ukai nambar enda dititihka.
        [point] Titik fungsi ti ukai nambar enda dititihka.
        [slope] Cherun fungsi ti ukai nambar enda dititihka.
       *[other] { $type } fungsi ti ukai nambar enda dititihka.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Nilai pemadu besai fungsi ti kosong enda dititihka.
        [minimum] Nilai pemadu mit fungsi ti kosong enda dititihka.
        [extremum] Nilai ujung fungsi ti kosong enda dititihka.
        [point] Titik fungsi ti kosong enda dititihka.
       *[other] { $type } fungsi ti kosong enda dititihka.
    }

function-points-too-close = Fungsi bisi dua titik ti semak amat siti enggau siti. Fungsi enda ulih ditusun.

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] Ulang fungsi ulih dikira semina enti penyampau input fungsi sebaka enggau penyampau output. Fungsi tu bisi { $inputs } input enggau { $outputs ->
           *[other] { $outputs } output
        }.
    }

## `<sequence>`

sequence-invalid-length = Panjai jujut enda betul.  Patut nambar bulat ti ukai negatif.

sequence-invalid-step = Langkah jujut enda betul.  Patut nambar ke jujut jenis { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" jujut nambar enda betul.  Patut nambar.

sequence-invalid-endpoint-letters = "{ $attribute }" jujut huruf enda betul.  Patut gabung huruf.

sequence-invalid-endpoint = "{ $attribute }" jujut enda betul.

select-from-sequence-coprime-not-numbers = coprime enda dititihka laban ukai nambar ti dipilih

select-from-sequence-coprime-with-exclude-combinations = coprime enda dititihka laban excludeCombinations disebut

## Resolving a `target`

target-not-found = Target ke `<{ $source }>` enda betul: target enda ditemu.

target-state-variable-not-found = Target ke `<{ $source }>` enda betul: pemubah keadaan ti benama "{ $property }" enda ditemu ba `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Pemubah `<odeSystem>` patut belain ari pemubah ti bediri kediri.

ode-system-duplicate-variable-names = Enda ulih nusun fungsi RHS ODE enggau nama pemubah ti sama.

ode-system-rhs-function-error = Enda ulih nusun fungsi RHS ODE.  Penyalah ba mensia ngaga fungsi mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Enda ulih nusun sudut entara { $count } garis

angle-invalid-through-point = Titik dalam through `<angle>` enda betul

parabola-vertex-too-many-points = Parabola enggau puncha ti nengah lebih ari 1 titik apin digaga.

parabola-too-many-points = Parabola ti nengah lebih ari 3 titik apin digaga.

intersection-too-many-items = Temu simpang ke lebih ari dua utai apin digaga

## Other math components

ionic-compound-not-two-ions = Sebatian ionik ke utai bukai ari dua ion apin digaga.

ionic-compound-needs-cation-and-anion = Sebatian ionik semina digaga ke siti kation enggau siti anion.

solve-equations-cannot-evaluate = Enda ulih ngungkai persamaan laban persamaan enda ulih dinilai: { $equation }

math-operators-operand-number-required = operandNumber patut disebut lebuh ngambi operand matematik.

eigen-decomposition-failed = Enda ulih ngira nilai eigen matriks

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
       *[other] `<matchesPattern>`: parameter { $parameters } nadai dalam pola nya, nya alai iya seruran nemu ruang kosong.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" enda ulih dikelala. Iya patut none, medium, dense tauka dua nambar positif ti dipisah enggau ruang, baka grid="1 0.5". Nadai grid dilukis.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` minta fungsi ti bisi { $expected ->
        [1] siti output, iya nya cherun y' ba tiap titik, baka `y - x`
       *[other] dua output, iya nya vektor ba tiap titik, baka `(y, -x)`
    }, tang fungsi ti diberi bisi { $found ->
       *[other] { $found } output
    }. { $alternative ->
        [none] Nadai utai dilukis.
       *[other] `<{ $alternative }>` komponen ti ngena ke fungsi nya. Nadai utai dilukis.
    }

field-function-attribute-ignored-with-child = Atribut `function` enda dititihka laban fungsi mega diberi dalam komponen; ti dalam nya dipakai. Beri fungsi nya siti chara aja.

field-variables-ignored =
    `<{ $component }>`: atribut `variables` nyebut pemubah ungkapan ti ditulis terus dalam komponen. { $reason ->
        [function-child] Fungsi ditu diberi baka anak `<function>`, ti nyebut pemubah iya empu, nya alai `variables` enda dititihka.
       *[no-expression] Nadai ungkapan baka nya ditu, nya alai `variables` enda dititihka.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" enda disukung dalam renderer prefigure; chara sipak kanan dipakai.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" enda disukung dalam renderer prefigure; chara sipak atas dipakai.

prefigure-invalid-axis-bounds = `<graph>`: batas paksi enda betul ke tukar prefigure; bbox asal (-10,-10,10,10) dipakai.

prefigure-invalid-width = `<graph>`: lebar enda betul ke tukar prefigure; lebar rajah asal 425 dipakai.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio enda betul ke tukar prefigure; nisbah asal 1 dipakai.

prefigure-grid-spacing-too-fine = `<graph>`: jarak entara garis grid mimit amat ke batas paksi; grid enda dilukis dalam renderer prefigure.

prefigure-annotations-not-rendered = `<graph>`: anotasi enda dilukis enti renderer PreFigure enda dipakai.

multiple-annotations-children = Mayuh anak `<annotations>` ditemu dalam `<graph>`; semua kelia ari ti penudi enda dititihka.

## Referring to other components

copy-unrecognized-component-type = Enda ulih manjangka tauka nyalin jenis komponen ti enda dikelala: { $type }.

copy-prop-not-found = Prop { $property } enda ditemu ba komponen jenis { $component }

collect-no-source = Nadai source ditemu ke collect.

collect-invalid-component-type = Enda ulih ngempul komponen jenis `<{ $component }>` laban jenis komponen nya enda betul.

reference-index-unavailable = Enda ulih nunjuk ngagai indeks `{ $reference }`

## `<callAction>`

component-action-unavailable = Enda ulih ngangau { $action } ba komponen `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Bentuk data enda betul.  Baris bisi panjai ti belain-lain. Ditemu ba componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data bisi nama lajur ti sama.  Ditemu ba componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data kurang siti nama lajur.  Ditemu ba componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Siti award ke saut tu begantung ba saut ti dikirum answer tu empu, lalu tu ulih ngasuh iya bejalai enda baka ti dikinsika.

answer-max-num-attempts-in-section-wide-check-work = Nyetel `maxNumAttempts` ba `<answer>` ti dalam bekas ti bisi `sectionWideCheckWork` nadai guna, laban penyampau peluang dikemudi bekas nya. Setel `maxNumAttempts` ba bekas nya.

nested-section-wide-check-work-max-num-attempts = Nyetel `maxNumAttempts` ba bekas ti bisi `sectionWideCheckWork` ti dalam bekas bukai ti mega bisi `sectionWideCheckWork` nadai guna, laban penyampau peluang dikemudi bekas ti di luar. Setel `maxNumAttempts` ba bekas ti di luar.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
       *[other] Atribut { $attributes } nadai guna enti symbolicEquality enda disetel.
    }

answer-invalid-type = Jenis answer enda betul: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Laban komponen `<{ $component }>` nadai nama, iya enda ulih dipakai ke atribut module

module-attribute-name-already-defined = Komponen `<{ $component } name="{ $name }">` enda ulih dipakai ke atribut module laban jenis komponen `<module>` udah bisi atribut "{ $name }".

conditional-content-condition-ignored = Atribut `condition` enda dititihka ba komponen `<conditionalContent>` ti bisi anak case tauka else.

slider-markers-type-mismatch = Jenis markers enda sebaka enggau jenis slider.

pretzel-problem-needs-statement-and-answer = Pretzel enda betul: tiap `<problem>` patut bisi siti `<statement>` enggau siti `<answer>`.

pretzel-circuit-first-problem-distractor = Pretzel enda betul: dalam mode="circuit", `<problem>` ti keterubah enda ulih nyadi distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
       *[other] Nilai { $values } enda betul ke atribut `{ $attribute }`; enda dititihka.
    }

attribute-must-be-references = Nilai `{ $value }` enda betul ke atribut `{ $attribute }`. Atribut patut ditusun ari rujuk ti berengkah enggau `$`.

math-input-invalid-function-names = <mathInput>: nama fungsi ti enda betul dalam { $attribute } enda dititihka: { $names }. Tiap nama patut bisi sekurang-kurang 2 aksara ba bagi ti dipandang (huruf tauka sengkang); ekur `|<mathspeak alternative>` ulih ditambah enti dikedeka.

## Building components from the source

component-type-invalid = Jenis komponen enda betul: `<{ $componentType }>`

attribute-repeated = Atribut { $attribute } enda ulih diulang.

attribute-invalid-for-component = Atribut "{ $attribute }" enda betul ke komponen jenis `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Takrif gaya { $styleNumber } nadai kontras ti chukup ke { $context ->
        [text-on-background] warna teks ngelaban warna latar belakang
        [high-contrast] warna kontras tinggi ngelaban kanvas
        [line] warna garis ngelaban kanvas
        [marker] warna penanda ngelaban kanvas
       *[text-on-canvas] warna teks ngelaban kanvas
    }{ $mode ->
        [dark] { " (mode chelum)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; patut sekurang-kurang { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Taja pan takrif gaya { $styleNumber } nyebut warna ti chukup kontras ke mode terang, warna mode chelum ti diambi ari nilai nya nadai kontras ti chukup entara warna teks enggau warna latar belakang ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; patut sekurang-kurang { $threshold }:1). { $suggestion ->
        [available] Ngambika kontras chukup dalam mode chelum, tambah kontras mode terang (chunto, setel { $lightAttribute }="{ $lightColor }") tauka tukar warna mode chelum (chunto, setel { $darkAttribute }="{ $darkColor }").
       *[none] Ngambika kontras chukup dalam mode chelum, tambah kontras mode terang tauka tukar warna ti diambi nya ngena textColorDarkMode tauka backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Taja pan takrif gaya { $styleNumber } nyebut warna teks ti chukup kontras ke mode terang, warna teks mode chelum ti diambi ari nilai nya nadai kontras ti chukup ngelaban kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; patut sekurang-kurang { $threshold }:1). { $suggestion ->
        [available] Ngambika kontras chukup dalam mode chelum, tambah kontras mode terang (chunto, setel textColor="{ $lightColor }") tauka tukar warna mode chelum (chunto, setel textColorDarkMode="{ $darkColor }").
       *[none] Ngambika kontras chukup dalam mode chelum, tambah kontras mode terang tauka tukar warna ti diambi nya ngena textColorDarkMode.
    }

section-multiple-style-palettes = Siti seksyen ulih milih siti <stylePalette> aja; ti penudi dipakai.

## Unique variants

variant-num-to-select-not-non-negative-integer = varian tunggal { $component } enda ulih dipastika laban numToSelect ukai nambar bulat ti ukai negatif.

variant-num-to-select-not-constant-number = varian tunggal { $component } enda ulih dipastika laban numToSelect ukai nambar ti tetap.

variant-with-replacement-not-constant-boolean = varian tunggal { $component } enda ulih dipastika laban withReplacement ukai boolean ti tetap.

variant-select-weight-disables-unique = Varian tunggal ke select dipedika enti bisi option ti bisi selectWeight tauka selectForVariants

variant-coprime-undetermined = varian tunggal { $component } enda ulih dipastika laban enda ulih dipastika coprime seruran false.

variant-attribute-not-constant = varian tunggal { $component } enda ulih dipastika laban { $attribute } ukai nilai ti tetap.

variant-attribute-not-number = varian tunggal { $component } enda ulih dipastika laban { $attribute } ukai nambar.

variant-attribute-wrong-type-for-sequence =
    varian tunggal { $component } jenis { $type } enda ulih dipastika laban { $attribute } ukai { $expected ->
        [letters-combination] gabung huruf
        [math-expression] ungkapan matematik ti betul
        [integer] nambar bulat
       *[number] nambar
    }.

variant-length-not-integer = varian tunggal { $component } enda ulih dipastika laban length ukai nambar bulat.

variant-sort-not-implemented = varian tunggal { $component } ti bisi sort apin digaga

variant-exclude-combinations-not-implemented = varian tunggal { $component } ti bisi excludeCombinations apin digaga

variant-math-exclude-not-implemented = varian tunggal { $component } jenis math ti bisi exclude apin digaga

variant-non-constant-exclude-not-implemented = varian tunggal { $component } ti bisi exclude ti ukai tetap apin digaga

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: enda disukung dalam renderer prefigure graph; anak iya dilangkau.

prefigure-descendant-invalid-geometry = { $subject }: geometri ti enda tembu tauka enda terelak; anak iya dilangkau.

prefigure-curve-label-omitted = { $subject }: label enda disukung ba elemen lengkung ti udah ditukar; label dibuai.

prefigure-curve-unsupported-definition-type = { $subject }: jenis takrif fungsi lengkung '{ $definitionType }' enda disukung; anak iya dilangkau.

prefigure-region-flip-functions-unsupported = { $subject }: atribut flipFunctions ba regionBetweenCurves enda disukung; anak iya dilangkau.

prefigure-region-non-formula-child = { $subject }: semina anak fungsi jenis formula disukung ba regionBetweenCurves; anak iya dilangkau.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' enda disukung ke { $labelKind ->
        [line-family] label bala garis
       *[point] label titik
    }; jajar PreFigure asal dipakai.

prefigure-fill-style-unsupported = { $subject }: gaya isi '{ $fillStyle }' enda disukung PreFigure; isi pejal dipakai.

prefigure-line-style-unknown = { $subject }: gaya garis '{ $lineStyle }' enda dikelala lalu dibuai ari pengeluar PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: gaya penanda '{ $markerStyle }' ditukar ngagai gaya PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: gaya penanda '{ $markerStyle }' enda disukung PreFigure; gaya asal dipakai.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` enda betul; target enda ulih dipetara. Anotasi dibuai.

annotation-ref-multiple-targets = `<annotation>`: `ref` nunjuk ngagai mayuh target; target ti keterubah dipakai.

annotation-ref-outside-graph = `<annotation>`: `ref` enda betul; target di luar graph ti ngandung iya. Anotasi dibuai.

annotation-ref-unsupported-target = `<annotation>`: `ref` enda betul; target ukai utai grafik ti disukung dalam tukar prefigure. Anotasi dibuai.

annotation-text-missing = `<annotation>`: `text` kurang tauka kosong; teks kosong dikeluarka.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Pengantung ti bepusing ditemu.
       *[other] Pengantung ti bepusing ditemu ba komponen `<{ $componentType }>`.
    }

reference-no-referent = Nadai utai ditemu ke rujuk: `{ $reference }`

reference-multiple-referents = Mayuh utai ditemu ke rujuk: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format atribut { $attribute } ba `<{ $componentType }>` enda betul.

children-invalid = Anak `<{ $componentType }>` enda betul: anak ti enda betul ditemu: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Nilai `{ $value }` enda betul ke atribut `{ $attribute }`, nilai `{ $default }` dipakai

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Versi DoenetML { $version } enda ditemu.
       *[other] Versi DoenetML { $version } enda ditemu. Versi { $fallback } dipakai
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML enda betul: { $content }

parse-tag-missing-close-tag = DoenetML enda betul: Tag `{ $tag }` nadai tag penutup. Tag ti nutup diri empu tauka tag `</{ $tagName }>` dikinsika.

parse-tag-error = DoenetML enda betul: Penyalah ba tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML enda betul: Atribut `{ $attribute }` ti enda betul baka ke kurang nilai.

parse-attribute-invalid = DoenetML enda betul: Atribut `{ $attribute }` enda betul

parse-attribute-value-invalid = DoenetML enda betul: Nilai atribut `{ $value }` enda betul

parse-attribute-value-quote-mismatch = DoenetML enda betul: Nilai atribut `{ $value }` enda betul. Tanda petik enda sebaka. Nuan baka ke kurang siti `{ $quote }`

parse-open-tag-name-missing = DoenetML enda betul: Tag ti nadai nama ditemu, baka `<`

parse-tag-not-closed = DoenetML enda betul: Tag `{ $tag }` enda ditutup (baka ke kurang siti `>`).

parse-self-closing-tag-name-missing = DoenetML enda betul: Tag ti nadai nama ditemu `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML enda betul: Tag `{ $tag }` enda ditutup (baka ke kurang `/>`).

parse-tag-invalid-attributes = DoenetML enda betul: Tag `{ $tag }` enda betul. Engka atribut iya enda kena.

parse-close-tag-name-missing = DoenetML enda betul: Tag penutup ti nadai nama ditemu, baka `</`

parse-attribute-value-unquoted = Nilai atribut patut ditaruh dalam tanda petik: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML enda betul: Tag penutup `{ $tag }` ditemu, tang nadai tag pemuka ti kena enggau iya

parse-close-tag-mismatched = DoenetML enda betul: Tag penutup enda sebaka. `</{ $expected }>` dikinsika. `{ $found }` ditemu

parser-node-unconvertible = Node { $node } enda ulih ditukar ngagai node Dast.

## Names

name-attribute-invalid =
    Nama atribut name='{ $name }' enda betul. { $reason ->
        [characters] Nama semina ulih bisi huruf, nambar, garis bah tauka sengkang.
       *[start] Nama patut berengkah enggau huruf.
    }

component-name-invalid-start = Nama komponen "{ $name }" enda betul. Nama patut berengkah enggau huruf.

## `<answer>` sugar

answer-video-watched-missing-video = Answer jenis videoWatched patut bisi atribut video

answer-video-watched-video-not-reference = Answer jenis videoWatched patut bisi atribut video ti nyadi rujuk

answer-name-not-single-text = Atribut name ba answer patut bisi siti anak text aja

## Referencing another document

external-doenetml-recursion-limit = Enda ulih ngambi DoenetML ari luar laban rekursi kelalu dalam. Kati bisi rujuk ti bepusing?

external-doenetml-unavailable = Enda ulih ngambi DoenetML ari { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML ti diambi ari { $attribute }="{ $uri }" enda betul: iya enda sebaka enggau jenis komponen "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` udah lama; pakai `{ $to }` ganti iya.
       *[other] [deprecation] Atribut `{ $from }` ba `<{ $component }>` udah lama; pakai `{ $to }` ganti iya.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` udah lama lalu enda dititihka laban `{ $to }` mega disebut.
       *[other] [deprecation] Atribut `{ $from }` ba `<{ $component }>` udah lama lalu enda dititihka laban `{ $to }` mega disebut.
    }

deprecated-attribute-ignored = [deprecation] Atribut `{ $attribute }` ba `<{ $component }>` udah lama lalu enda dititihka.

deprecated-attribute-to-child = [deprecation] Atribut `{ $attribute }` ba `<{ $component }>` udah lama; pakai anak `<{ $child }>` ganti iya.

deprecated-attribute-value-renamed = [deprecation] Nilai `{ $value }` atribut `{ $attribute }` ba `<{ $component }>` udah lama; pakai `{ $to }` ganti iya.


## Language coverage

pluralize-english-only = `<pluralize>` semina ulih ngaga jamak jaku Inggeris, nya alai teks iya enda diubah dalam dokumen ti ditulis ngena { $locale }. Tulis terus bentuk jamak nya, tauka setel iya ngena atribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elemen `<{ $tag }>` ukai elemen Doenet ti dikelala.

schema-element-not-allowed-at-root = Elemen `<{ $tag }>` enda ulih ba pun dokumen.

schema-element-not-allowed-inside = Elemen `<{ $tag }>` enda ulih dalam `<{ $parent }>`.

schema-attribute-unrecognized = Elemen `<{ $tag }>` nadai atribut ti benama `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribut `{ $attribute }` elemen `<{ $tag }>` patut nyadi senarai ti tiap isi iya siti ari: { $allowed }
       *[other] Atribut `{ $attribute }` elemen `<{ $tag }>` patut siti ari: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nama varian ke select enda betul.  Nama varian { $variantName } pegari dalam { $numOptions } option tang penyampau ti dipilih { $numToSelect }.

select-variant-name-without-options = Sekeda varian disebut ke select tang nadai option disebut ke nama varian: { $variantName }.

select-variant-name-not-possible = Nama varian { $variantName } ti disebut ke select ukai nama varian ti ulih dipakai.

select-too-few-options = Enda ulih milih { $numToSelect } komponen ari { $numOptions } aja.

select-from-sequence-too-few-values = Enda ulih milih { $numToSelect } nilai ari jujut ti panjai iya { $length }.

select-from-sequence-indices-count-mismatch = Penyampau indeks ti disebut ke select patut sebaka enggau penyampau ti dipilih

select-from-sequence-indices-not-integers = Semua indeks ti disebut ke select patut nambar bulat

select-from-sequence-index-excluded = Indeks selectfromsequence ti disebut nya udah dibuai

select-from-sequence-indices-excluded-combination = Indeks selectfromsequence ti disebut nya gabung ti udah dibuai

select-from-sequence-coprime-not-positive-integers = Enda ulih milih gabung coprime laban ukai nambar bulat positif ti dipilih.

select-from-sequence-coprime-common-factor = Enda ulih milih nambar coprime. Semua nilai ti ulih dipakai bisi faktor ti sama. (Nilai "from" tauka "to" ti disebut patut coprime enggau "step".)

select-from-sequence-coprime-single-number = Enda ulih milih gabung coprime ari siti nambar ti ukai 1.

select-from-sequence-excluded-too-many-combinations = Lebih ari 70% gabung dibuai dalam selectFromSequence

select-from-sequence-coprime-none-found = Enda ulih milih nambar coprime. Semua nilai ti ulih dipakai bisi faktor ti sama.

select-from-sequence-too-few-unique-values = Enda ulih milih { $numToSelect } nilai tunggal ari jujut ti panjai iya { $numPossibleValues }

select-prime-numbers-too-few-values = Enda ulih milih { $numToSelect } nilai ari senarai nambar perdana ti panjai iya { $numValues }

select-prime-numbers-values-count-mismatch = Penyampau nilai ti disebut ke select patut sebaka enggau penyampau ti dipilih

select-prime-numbers-values-not-prime = Semua nilai ti disebut ke select nambar perdana patut bisi dalam senarai nambar perdana

select-prime-numbers-values-excluded-combination = Nilai selectPrimeNumbers ti disebut nya gabung ti udah dibuai

select-prime-numbers-excluded-too-many-combinations = Lebih ari 70% gabung dibuai dalam selectPrimeNumbers

select-random-combination-fluke = Ngambika enda ngasoh kaban, gabung nilai chabut enda ulih dipilih

select-random-value-fluke = Ngambika enda ngasoh kaban, nilai chabut enda ulih dipilih

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] `<{ $component }>` tu enda dipandang laban iya dalam matematik lalu ukai `inline`. Tambah `inline` ngambika iya nyadi senarai turun, ti muat dalam ungkapan.
        [expanded] `<{ $component }>` tu enda dipandang laban iya dalam matematik lalu `expanded`. Buai `expanded`; kutak mayuh baris enda muat dalam ungkapan.
        [on-graph] `<{ $component }>` tu enda dipandang laban iya dalam matematik ti dilukis ba graph, ti nadai ruang ke input.
       *[relative-width] `<{ $component }>` tu enda dipandang laban iya dalam matematik lalu bisi lebar relatif. Beri lebar nya dalam ukur mutlak, baka `px`.
    }
