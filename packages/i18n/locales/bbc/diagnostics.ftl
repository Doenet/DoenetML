# Toba Batak (Hata Batak Toba) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Latin**, in the spelling `chrome.ftl`'s header sets out. No Surat
# Batak anywhere in this file.
#
# **The frames.** This file is 220 sentences built out of a dozen recurring
# frames, and reading the frames is the fastest way to review it:
#
#     ndang diparrohahon      is ignored
#     Ndang boi …             cannot …
#     ingkon …                must …
#     … na sala               invalid …
#     Ndang dope dibahen …    has not been implemented …
#     ndang jumpang           not found
#     ndang tudos             does not match
#     ala …                   because …
#     ndang marguna           has no effect
#     Ndang adong …           there is no …
#
# Correcting one frame corrects a fifth of the file, which is why they are
# named here.
#
# **Register.** Indonesian for the technical nouns — `atribut`, `komponen`,
# `nilai`, `variabel`, `titik`, `garis`, `lingkaran`, `fungsi`, `dimensi`,
# `indeks`, `referensi`, `versi`, `format`, `dokumen` — declared as a loan
# register in `chrome.ftl`'s header, with a Toba Batak frame around them.
# Nothing here is a coinage.
#
# **Plural.** Toba Batak leaves a noun unmarked after a numeral, so every
# `[one]`/`[other]` fork in the English collapses to a single `*[other]`
# branch. Two messages keep an explicit `[1]` literal, because English forks
# there on *one output* against *two outputs* and the distinction is about the
# shape of the function rather than about agreement; Fluent matches a numeric
# literal against the number itself, before any plural rule, so those stay
# selectable.
#
# **What this catalog does not know.** Whether «diparrohahon» or a shorter verb
# reads better for *ignored* in a warning a beginner sees fifty times; the seed
# picked one and used it everywhere so that changing it is one search.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } ndang diparrohahon molo dua titik ujung ditontuhon

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } ndang diparrohahon molo titik ujung dohot titik tonga rap ditontuhon

line-segment-midpoint-offset-without-midpoint = midpointOffset ndang marguna molo ndang adong titik tonga

## `<line>`

line-points-undetermined-dimensions = Garis mamolus titik na so boi ditontuhon dimensina.

line-points-too-few-dimensions = Garis ingkon mamolus titik na marbahen dua dimensi paling otik.

line-points-depend-on-variables = Garis mamolus titik na marhite variabel: { $variables }.

line-equation-invalid-format = Format ni persamaan garis di variabel { $variable1 } dohot { $variable2 } sala.

## `<ray>`

ray-overprescribed-through = Sinar ditontuhon rap marhite through, endpoint dohot direction. Ndang diparrohahon through na ditontuhon i.

ray-dimension-mismatch = numDimensions ni sinar ndang tudos.

## `<vector>`

vector-overprescribed-head = Vektor ditontuhon rap marhite head, tail dohot displacement. Ndang diparrohahon head na ditontuhon i.

vector-dimension-mismatch = numDimensions ni vektor ndang tudos.

## Attracting and constraining

attract-to-without-nearest-point = Ndang boi marsihol tu `<{ $component }>` ala ndang adong variabel keadaan nearestPoint disi.

constrain-to-without-nearest-point = Ndang boi mangkatai tu `<{ $component }>` ala ndang adong variabel keadaan nearestPoint disi.

constrain-to-interior-without-nearest-point = Ndang boi mangkatai tu bagasan `<{ $component }>` ala ndang adong variabel keadaan nearestPoint disi.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ndang diparrohahon di choiceInput na so inline

## Ordering children by index

choice-input-indices-count-mismatch = Ndang diparrohahon indices na ditontuhon di choiceInput ala godang ni indices ndang tudos tu godang ni anak choice.

pretzel-indices-count-mismatch = Ndang diparrohahon indices na ditontuhon di problem ala godang ni indices ndang tudos tu godang ni anak problem.

shuffle-indices-count-mismatch = Ndang diparrohahon indices na ditontuhon di shuffle ala godang ni indices ndang tudos tu godang ni komponen.

indices-ignored-out-of-range = Ndang diparrohahon indices na ditontuhon di { $component } ala adong indeks na di balian ni jangkauan.

pretzel-indices-repeated = Ndang diparrohahon indices na ditontuhon di pretzel ala adong indeks na diulang.

pretzel-circuit-first-index = Ndang diparrohahon indices na ditontuhon di pretzel mode circuit ala indeks parjolo ingkon 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Asa mardalan `<{ $component }>` dohot anak na string, atribut `type` ingkon ditontuhon.

invalid-type-defaulting-to-math = Tipe { $type } sala di komponen { $component }. Ingkon sada sian math, text, number, manang boolean. Dipangke math.

string-not-valid-component-to-arrange = String "{ $value }" ndang komponen na denggan di { $component }. Ndang diparrohahon.

## Types and variables

invalid-type-defaulting-to-number = Tipe { $type } sala, tipe dibahen gabe number.

invalid-variable-value = Nilai ni variabel sala: `{ $value }`

## Variants

variant-index-must-be-number = Indeks varian { $index } ingkon bilangan

variant-index-must-be-integer = Indeks varian { $index } ingkon bilangan bulat

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ndang dope dibahen tu ukuran absolut. Lebar digantihon gabe relatif.

side-by-side-absolute-margins = `<{ $component }>` ndang dope dibahen tu ukuran absolut. Margin digantihon gabe relatif.

side-by-side-no-block-child = `<{ $component }>` sala: ingkon adong sada anak na blok paling otik.

## `<label>`

label-for-ignored-on-graphical = Atribut `for` di `<label>` grafis ndang diparrohahon.

label-for-must-resolve-to-one = Atribut `for` di `<label>` ingkon manudu tu sada komponen sambing.

label-for-unresolved = Atribut `for` di `<label>` ndang boi manudu tu sada komponen.

label-for-answer-with-authored-inputs = Atribut `for` di `<label>` manudu tu `<answer>` na masukanna disurathon sandiri; tudu ma masukan i tigor.

label-for-answer-without-input = Atribut `for` di `<label>` manudu tu `<answer>` na so adong masukanna na boi dilabeli.

label-for-must-reference-input-or-answer = Atribut `for` di `<label>` ingkon manudu tu sada masukan manang sada jawaban.

## Accessibility

accessibility-short-description-or-decorative = Ala ni aksesibilitas, `<{ $component }>` ingkon marbahen deskripsi na jempek manang ditandai gabe hiasan.

accessibility-video-short-description = Ala ni aksesibilitas, `<video>` ingkon marbahen deskripsi na jempek.

accessibility-input-short-description-or-label = Ala ni aksesibilitas, `<{ $component }>` ingkon marbahen deskripsi na jempek manang label.

accessibility-answer-input-short-description-or-label = Ala ni aksesibilitas, `<answer>` na mambahen masukan ingkon marbahen deskripsi na jempek manang label.

accessibility-short-description-contains-math = Deskripsi na jempek ndang denggan marisi komponen matematika songon `<{ $component }>`. Surathon ma isi matematikana marhite hata.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } hurang kontrasna di teks judul bagian (mode na birong) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; porlu paling otik { $threshold }:1).
       *[other] { $colorName } hurang kontrasna di teks judul bagian ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; porlu paling otik { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Ndang dope dibahen `<circle>` mamolus { $count } titik molo titik i ndang marnilai numerik.

circle-too-many-through-points = Ndang boi dihira lingkaran na mamolus lobi sian 3 titik.

circle-overprescribed-radius-center-points = Ndang boi dihira lingkaran molo jari-jari, pusat dohot titik na dipolus rap ditontuhon.

circle-center-with-multiple-points = Ndang boi dihira lingkaran na martontu pusat mamolus lobi sian 1 titik.

circle-radius-too-small = Ndang boi dihira lingkaran: ala jarak ni dua titik i { $distance }, jari-jari { $radius } na ditontuhon i metmet situtu.

circle-radius-with-many-points = Ndang boi dibahen lingkaran na mamolus lobi sian dua titik molo jari-jari ditontuhon.

circle-invalid-center-or-through-points = Pusat manang titik na dipolus ni lingkaran sala.

circle-radius-center-with-multiple-points = Ndang boi dihira jari-jari ni lingkaran na martontu pusat mamolus lobi sian 1 titik.

circle-change-radius-non-numerical = Ndang boi digantihon jari-jari ni lingkaran na titik dipolusna ndang numerik

circle-radius-with-points-non-numerical = Ndang boi dibahen lingkaran na mamolus lobi sian sada titik dohot jari-jari na ditontuhon molo ndang adong nilai numerik.

circle-change-center-non-numerical = Ndang dope dibahen panggantion ni pusat ni lingkaran na mamolus titik na so numerik.

## `<function>`

function-domain-insufficient-dimensions = Hurang dimensi ni domain ni fungsi. Domain marisi { $intervals } selang alai fungsi i marisi { $inputs } masukan.

function-domain-invalid-format = Format ni domain ni fungsi sala.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ndang diparrohahon maximum ni fungsi na so numerik.
        [minimum] Ndang diparrohahon minimum ni fungsi na so numerik.
        [extremum] Ndang diparrohahon extremum ni fungsi na so numerik.
        [point] Ndang diparrohahon titik ni fungsi na so numerik.
        [slope] Ndang diparrohahon kemiringan ni fungsi na so numerik.
       *[other] Ndang diparrohahon { $type } ni fungsi na so numerik.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ndang diparrohahon maximum ni fungsi na lowong.
        [minimum] Ndang diparrohahon minimum ni fungsi na lowong.
        [extremum] Ndang diparrohahon extremum ni fungsi na lowong.
        [point] Ndang diparrohahon titik ni fungsi na lowong.
       *[other] Ndang diparrohahon { $type } ni fungsi na lowong.
    }

function-points-too-close = Fungsi marisi dua titik na jonok situtu. Ndang boi dibahen fungsi.

function-iterates-input-output-mismatch = Iterasi ni fungsi holan boi molo godang ni masukan tudos tu godang ni luaran. Fungsi on marisi { $inputs } masukan dohot { $outputs } luaran.

## `<sequence>`

sequence-invalid-length = Panjang ni sequence sala.  Ingkon bilangan bulat na so negatif.

sequence-invalid-step = Step ni sequence sala.  Ingkon bilangan di sequence tipe { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" ni sequence bilangan sala.  Ingkon bilangan.

sequence-invalid-endpoint-letters = "{ $attribute }" ni sequence surat sala.  Ingkon rangkaian surat.

sequence-invalid-endpoint = "{ $attribute }" ni sequence sala.

select-from-sequence-coprime-not-numbers = coprime ndang diparrohahon ala na dipillit i ndang bilangan

select-from-sequence-coprime-with-exclude-combinations = coprime ndang diparrohahon ala excludeCombinations ditontuhon

## Resolving a `target`

target-not-found = Target ni `<{ $source }>` sala: ndang jumpang targetna.

target-state-variable-not-found = Target ni `<{ $source }>` sala: ndang jumpang variabel keadaan na margoar "{ $property }" di sada `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Variabel ni `<odeSystem>` ingkon asing sian variabel bebas.

ode-system-duplicate-variable-names = Ndang boi dibahen fungsi RHS ODE na marisi goar variabel na dua hali.

ode-system-rhs-function-error = Ndang boi dibahen fungsi RHS ODE.  Hasalaan di pambahenan fungsi mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ndang boi dibahen sudut di holang-holang ni { $count } garis

angle-invalid-through-point = Titik di through ni `<angle>` sala

parabola-vertex-too-many-points = Ndang dope dibahen parabola na marpuncak mamolus lobi sian 1 titik.

parabola-too-many-points = Ndang dope dibahen parabola na mamolus lobi sian 3 titik.

intersection-too-many-items = Ndang dope dibahen perpotongan tu lobi sian dua barang

## Other math components

ionic-compound-not-two-ions = Ndang dope dibahen senyawa ionik tu na asing sian dua ion.

ionic-compound-needs-cation-and-anion = Senyawa ionik holan dibahen tu sada kation dohot sada anion.

solve-equations-cannot-evaluate = Ndang boi disolusihon persamaan on ala ndang boi dihira persamaanna: { $equation }

math-operators-operand-number-required = Ingkon ditontuhon operandNumber molo mambuat operand matematika.

eigen-decomposition-failed = Ndang boi dihira nilai eigen ni matriks

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: parameter { $parameters } ndang adong di pola i, gabe tongtong do i tudos tu na lowong.

## `<graph>`

graph-grid-invalid = `<graph>`: ndang boi diantusi grid="{ $grid }". Ingkon none, medium, dense, manang dua bilangan positif na dipisat spasi, songon grid="1 0.5". Ndang adong kisi na digambar.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` porlu fungsi na marisi { $expected ->
        [1] sada luaran, i ma kemiringan y' di ganup titik, songon `y - x`
       *[other] dua luaran, i ma vektor di ganup titik, songon `(y, -x)`
    }, alai fungsi na dilehon i marisi { $found } luaran. { $alternative ->
        [none] Ndang adong na digambar.
       *[other] `<{ $alternative }>` do komponen tu fungsi songon i. Ndang adong na digambar.
    }

field-function-attribute-ignored-with-child = Atribut `function` ndang diparrohahon ala fungsi i dilehon huhut di bagasan komponen; na di bagasan i do dipangke. Lehon ma fungsi i holan sada dalan.

field-variables-ignored =
    `<{ $component }>`: atribut `variables` mangaraphon variabel ni ekspresi na disurat tigor di bagasan komponen. { $reason ->
        [function-child] Fungsi dison dilehon songon anak `<function>`, na mangaraphon variabelna sandiri, gabe `variables` ndang diparrohahon.
       *[no-expression] Ndang adong ekspresi songon i dison, gabe `variables` ndang diparrohahon.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ndang didukung di perender prefigure; dipangke parange posisi siamun.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ndang didukung di perender prefigure; dipangke parange posisi ginjang.

prefigure-invalid-axis-bounds = `<graph>`: batas sumbu sala tu konversi prefigure; dipangke bbox bawaan (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: lebar sala tu konversi prefigure; dipangke lebar diagram bawaan 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio sala tu konversi prefigure; dipangke rasio aspek bawaan 1.

prefigure-grid-spacing-too-fine = `<graph>`: holang-holang ni kisi i lumat situtu tu batas sumbu; kisi i ndang dibahen di perender prefigure.

prefigure-annotations-not-rendered = `<graph>`: anotasi ndang digambar molo ndang dipangke perender PreFigure.

multiple-annotations-children = Torop anak `<annotations>` jumpang di `<graph>`; sude na so parpudi ndang diparrohahon.

## Referring to other components

copy-unrecognized-component-type = Ndang boi ditamba manang dicopy tipe komponen na so tarboto: { $type }.

copy-prop-not-found = Ndang jumpang prop { $property } di komponen tipe { $component }

collect-no-source = Ndang jumpang sumber tu collect.

collect-invalid-component-type = Ndang boi dipapungu komponen tipe `<{ $component }>` ala tipe komponen i sala.

reference-index-unavailable = Ndang boi ditudu indeks `{ $reference }`

## `<callAction>`

component-action-unavailable = Ndang boi dipangido { $action } di komponen `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Bentuk ni data sala.  Panjang ni baris ndang rap. Jumpang di componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data marisi goar kolom na dua hali.  Jumpang di componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data hurang sada goar kolom.  Jumpang di componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Award ni jawaban on marhite alus na pinasahat ni tag jawaban i sandiri, jala i mambahen parange na so dihalomohon.

answer-max-num-attempts-in-section-wide-check-work = Pambahenan `maxNumAttempts` di `<answer>` na di bagasan wadah na marbahen `sectionWideCheckWork` ndang marguna, ala godang ni usaha diatur wadah i. Bahen ma `maxNumAttempts` di wadah i.

nested-section-wide-check-work-max-num-attempts = Pambahenan `maxNumAttempts` di wadah na marbahen `sectionWideCheckWork` na di bagasan wadah na marbahen `sectionWideCheckWork` muse ndang marguna, ala godang ni usaha diatur wadah na di balian. Bahen ma `maxNumAttempts` di wadah na di balian i.

answer-attributes-need-symbolic-equality = Atribut { $attributes } ndang marguna molo symbolicEquality ndang ditontuhon.

answer-invalid-type = Tipe ni jawaban sala: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ala ndang margoar komponen `<{ $component }>`, ndang boi i dipangke gabe atribut ni module

module-attribute-name-already-defined = Komponen `<{ $component } name="{ $name }">` ndang boi dipangke gabe atribut ni module ala tipe komponen `<module>` nunga marbahen atribut "{ $name }".

conditional-content-condition-ignored = Atribut `condition` ndang diparrohahon di komponen `<conditionalContent>` na marbahen anak case manang else.

slider-markers-type-mismatch = Tipe ni marker ndang tudos tu tipe ni slider.

pretzel-problem-needs-statement-and-answer = Pretzel sala: ganup `<problem>` ingkon marisi sada `<statement>` dohot sada `<answer>`.

pretzel-circuit-first-problem-distractor = Pretzel sala: di mode="circuit", `<problem>` parjolo ndang boi gabe distraktor.

## Attribute values

attribute-invalid-values = Nilai { $values } sala tu atribut `{ $attribute }`; ndang diparrohahon.

attribute-must-be-references = Nilai `{ $value }` sala tu atribut `{ $attribute }`. Atribut ingkon dibahen sian referensi na mamungka dohot `$`.

math-input-invalid-function-names = <mathInput>: ndang diparrohahon goar fungsi na sala di { $attribute }: { $names }. Ganup goar ingkon marisi paling otik 2 karakter (surat manang garis pisat); boi ditamba akhiran `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Tipe komponen sala: `<{ $componentType }>`

attribute-repeated = Ndang boi diulang atribut { $attribute }.

attribute-invalid-for-component = Atribut "{ $attribute }" sala tu komponen tipe `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Definisi gaya { $styleNumber } hurang kontrasna tu { $context ->
        [text-on-background] warna teks tu warna latar
        [high-contrast] warna kontras na timbo tu kanvas
        [line] warna garis tu kanvas
        [marker] warna marker tu kanvas
       *[text-on-canvas] warna teks tu kanvas
    }{ $mode ->
        [dark] { " (mode na birong)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; porlu paling otik { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Nang pe definisi gaya { $styleNumber } marbahen warna na sae kontrasna tu mode na tiur, warna mode na birong na ro sian nilai i hurang kontrasna tu warna teks tu warna latar ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; porlu paling otik { $threshold }:1). { $suggestion ->
        [available] Asa sae kontrasna di mode na birong, patimbo ma kontras mode na tiur (umpamana bahen { $lightAttribute }="{ $lightColor }") manang gantihon warna mode na birong (umpamana bahen { $darkAttribute }="{ $darkColor }").
       *[none] Asa sae kontrasna di mode na birong, patimbo ma kontras mode na tiur manang gantihon warna na ro i marhite textColorDarkMode dohot/manang backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Nang pe definisi gaya { $styleNumber } marbahen warna teks na sae kontrasna tu mode na tiur, warna teks mode na birong na ro sian nilai i hurang kontrasna tu kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; porlu paling otik { $threshold }:1). { $suggestion ->
        [available] Asa sae kontrasna di mode na birong, patimbo ma kontras mode na tiur (umpamana bahen textColor="{ $lightColor }") manang gantihon warna mode na birong (umpamana bahen textColorDarkMode="{ $darkColor }").
       *[none] Asa sae kontrasna di mode na birong, patimbo ma kontras mode na tiur manang gantihon warna na ro i marhite textColorDarkMode.
    }

section-multiple-style-palettes = Sada bagian holan boi mamillit sada <stylePalette>; na parpudi do dipangke.

## Unique variants

variant-num-to-select-not-non-negative-integer = ndang boi ditontuhon varian na unik ni { $component } ala numToSelect ndang bilangan bulat na so negatif.

variant-num-to-select-not-constant-number = ndang boi ditontuhon varian na unik ni { $component } ala numToSelect ndang bilangan na hot.

variant-with-replacement-not-constant-boolean = ndang boi ditontuhon varian na unik ni { $component } ala withReplacement ndang boolean na hot.

variant-select-weight-disables-unique = Varian na unik tu select ndang mardalan molo adong option na marbahen selectWeight manang selectForVariants

variant-coprime-undetermined = ndang boi ditontuhon varian na unik ni { $component } ala ndang boi ditontuhon coprime tongtong salah.

variant-attribute-not-constant = ndang boi ditontuhon varian na unik ni { $component } ala { $attribute } ndang hot.

variant-attribute-not-number = ndang boi ditontuhon varian na unik ni { $component } ala { $attribute } ndang bilangan.

variant-attribute-wrong-type-for-sequence =
    ndang boi ditontuhon varian na unik ni { $component } tipe { $type } ala { $attribute } ndang { $expected ->
        [letters-combination] rangkaian surat
        [math-expression] ekspresi matematika na denggan
        [integer] bilangan bulat
       *[number] bilangan
    }.

variant-length-not-integer = ndang boi ditontuhon varian na unik ni { $component } ala length ndang bilangan bulat.

variant-sort-not-implemented = ndang dope dibahen varian na unik ni { $component } na marbahen sort

variant-exclude-combinations-not-implemented = ndang dope dibahen varian na unik ni { $component } na marbahen excludeCombinations

variant-math-exclude-not-implemented = ndang dope dibahen varian na unik ni { $component } tipe math na marbahen exclude

variant-non-constant-exclude-not-implemented = ndang dope dibahen varian na unik ni { $component } na marbahen exclude na so hot

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ndang didukung di perender prefigure ni graph; pinompar dilaosi.

prefigure-descendant-invalid-geometry = { $subject }: geometri na so hot manang na hurang; pinompar dilaosi.

prefigure-curve-label-omitted = { $subject }: label ndang didukung di elemen kurva na dikonversi; label dilaosi.

prefigure-curve-unsupported-definition-type = { $subject }: tipe definisi fungsi kurva '{ $definitionType }' ndang didukung; pinompar dilaosi.

prefigure-region-flip-functions-unsupported = { $subject }: atribut flipFunctions di regionBetweenCurves ndang didukung; pinompar dilaosi.

prefigure-region-non-formula-child = { $subject }: holan anak fungsi tipe formula na didukung di regionBetweenCurves; pinompar dilaosi.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' ndang didukung tu { $labelKind ->
        [line-family] label ni kelompok garis
       *[point] label ni titik
    }; dipangke perataan PreFigure bawaan.

prefigure-fill-style-unsupported = { $subject }: gaya isi '{ $fillStyle }' ndang didukung PreFigure; mulak tu isi na solid.

prefigure-line-style-unknown = { $subject }: gaya garis '{ $lineStyle }' na so tarboto dilaosi sian luaran PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: gaya marker '{ $markerStyle }' dibahen gabe gaya PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: gaya marker '{ $markerStyle }' ndang didukung PreFigure; dipangke gaya bawaan.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` sala; ndang boi ditontuhon targetna. Anotasi dilaosi.

annotation-ref-multiple-targets = `<annotation>`: `ref` manudu tu torop target; na parjolo do dipangke.

annotation-ref-outside-graph = `<annotation>`: `ref` sala; target i di balian ni graph na mangompol i. Anotasi dilaosi.

annotation-ref-unsupported-target = `<annotation>`: `ref` sala; target i ndang objek grafis na didukung di konversi prefigure. Anotasi dilaosi.

annotation-text-missing = `<annotation>`: `text` hurang manang lowong; teks na lowong do dibahen.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Jumpang katergantungan na marputar.
       *[other] Jumpang katergantungan na marputar na maniop komponen `<{ $componentType }>`.
    }

reference-no-referent = Ndang jumpang na ditudu referensi: `{ $reference }`

reference-multiple-referents = Torop na ditudu referensi: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format ni atribut { $attribute } ni `<{ $componentType }>` sala.

children-invalid = Anak ni `<{ $componentType }>` sala: Jumpang anak na sala: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Nilai `{ $value }` sala tu atribut `{ $attribute }`, dipangke nilai `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Ndang jumpang versi DoenetML { $version }.
       *[other] Ndang jumpang versi DoenetML { $version }. Mulak tu versi { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML sala: { $content }

parse-tag-missing-close-tag = DoenetML sala: Tag `{ $tag }` ndang marbahen tag panutup. Ingkon tag na manutup dirina manang tag `</{ $tagName }>`.

parse-tag-error = DoenetML sala: Hasalaan di tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML sala: Atribut `{ $attribute }` na sala on rupana hurang nilai.

parse-attribute-invalid = DoenetML sala: Atribut `{ $attribute }` sala

parse-attribute-value-invalid = DoenetML sala: Nilai atribut `{ $value }` sala

parse-attribute-value-quote-mismatch = DoenetML sala: Nilai atribut `{ $value }` sala. Tanda kutip ndang tudos. Rupana hurang sada `{ $quote }`

parse-open-tag-name-missing = DoenetML sala: Jumpang tag na so margoar tag, songon `<`

parse-tag-not-closed = DoenetML sala: Tag `{ $tag }` ndang ditutup (rupana hurang `>`).

parse-self-closing-tag-name-missing = DoenetML sala: Jumpang tag na so margoar tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML sala: Tag `{ $tag }` ndang ditutup (rupana hurang `/>`).

parse-tag-invalid-attributes = DoenetML sala: Tag `{ $tag }` sala. Boi jadi atributna sala.

parse-close-tag-name-missing = DoenetML sala: Jumpang tag panutup na so margoar tag, songon `</`

parse-attribute-value-unquoted = Nilai atribut ingkon dilehon di bagasan tanda kutip: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML sala: Jumpang tag panutup `{ $tag }`, alai ndang adong tag pambungka na hombar

parse-close-tag-mismatched = DoenetML sala: Tag panutup ndang tudos. Na diharaphon `</{ $expected }>`. Na jumpang `{ $found }`

parser-node-unconvertible = Ndang boi dikonversi node { $node } gabe node Dast.

## Names

name-attribute-invalid =
    Goar atribut name='{ $name }' sala. { $reason ->
        [characters] Goar holan boi marisi surat, angka, garis di toru manang garis pisat.
       *[start] Goar ingkon mamungka dohot sada surat.
    }

component-name-invalid-start = Goar komponen "{ $name }" sala. Goar ingkon mamungka dohot sada surat.

## `<answer>` sugar

answer-video-watched-missing-video = Jawaban tipe videoWatched ingkon marbahen atribut video

answer-video-watched-video-not-reference = Jawaban tipe videoWatched ingkon marbahen atribut video na sada referensi

answer-name-not-single-text = Atribut name ni jawaban ingkon marbahen sada anak text sambing

## Referencing another document

external-doenetml-recursion-limit = Ndang boi dibuat DoenetML sian luar ala lam bagas rekursina. Adong do referensi na marputar?

external-doenetml-unavailable = Ndang boi dibuat DoenetML sian { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML na dibuat sian { $attribute }="{ $uri }" sala: ndang tudos tu tipe komponen "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` nunga ditadingkon; pangke ma `{ $to }`.
       *[other] [deprecation] Atribut `{ $from }` di `<{ $component }>` nunga ditadingkon; pangke ma `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` nunga ditadingkon jala ndang diparrohahon ala `{ $to }` ditontuhon huhut.
       *[other] [deprecation] Atribut `{ $from }` di `<{ $component }>` nunga ditadingkon jala ndang diparrohahon ala `{ $to }` ditontuhon huhut.
    }

deprecated-attribute-ignored = [deprecation] Atribut `{ $attribute }` di `<{ $component }>` nunga ditadingkon jala ndang diparrohahon.

deprecated-attribute-to-child = [deprecation] Atribut `{ $attribute }` di `<{ $component }>` nunga ditadingkon; pangke ma anak `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Nilai `{ $value }` ni atribut `{ $attribute }` di `<{ $component }>` nunga ditadingkon; pangke ma `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` holan boi mambahen bentuk jamak ni hata Inggris, gabe teksna ndang digantihon di dokumen na sinurat marhite { $locale }. Surathon ma bentuk jamakna tigor, manang bahen marhite atribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elemen `<{ $tag }>` ndang elemen Doenet na tarboto.

schema-element-not-allowed-at-root = Elemen `<{ $tag }>` ndang boi di bona ni dokumen.

schema-element-not-allowed-inside = Elemen `<{ $tag }>` ndang boi di bagasan `<{ $parent }>`.

schema-attribute-unrecognized = Elemen `<{ $tag }>` ndang marbahen atribut na margoar `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribut `{ $attribute }` ni elemen `<{ $tag }>` ingkon sada daftar na ganup itemna sada sian: { $allowed }
       *[other] Atribut `{ $attribute }` ni elemen `<{ $tag }>` ingkon sada sian: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Goar varian ni select sala.  Goar varian { $variantName } adong di { $numOptions } option alai godang na dipillit { $numToSelect }.

select-variant-name-without-options = Adong varian na ditontuhon di select alai ndang adong option tu goar varian na boi: { $variantName }.

select-variant-name-not-possible = Goar varian { $variantName } na ditontuhon di select ndang goar varian na boi.

select-too-few-options = Ndang boi dipillit { $numToSelect } komponen sian holan { $numOptions }.

select-from-sequence-too-few-values = Ndang boi dipillit { $numToSelect } nilai sian sequence na marpanjang { $length }.

select-from-sequence-indices-count-mismatch = Godang ni indices na ditontuhon di select ingkon tudos tu godang na dipillit

select-from-sequence-indices-not-integers = Sude indices na ditontuhon di select ingkon bilangan bulat

select-from-sequence-index-excluded = Indeks selectfromsequence na ditontuhon i nunga dipabali

select-from-sequence-indices-excluded-combination = Indices selectfromsequence na ditontuhon i sada kombinasi na dipabali

select-from-sequence-coprime-not-positive-integers = Ndang boi dipillit kombinasi coprime ala na dipillit i ndang bilangan bulat positif.

select-from-sequence-coprime-common-factor = Ndang boi dipillit bilangan coprime. Sude nilai na boi marbahen faktor na rap. (Nilai "from" manang "to" na ditontuhon ingkon coprime dohot "step".)

select-from-sequence-coprime-single-number = Ndang boi dipillit kombinasi coprime sian sada bilangan na so 1.

select-from-sequence-excluded-too-many-combinations = Lobi sian 70% kombinasi dipabali di selectFromSequence

select-from-sequence-coprime-none-found = Ndang boi dipillit bilangan coprime. Sude nilai na boi marbahen faktor na rap.

select-from-sequence-too-few-unique-values = Ndang boi dipillit { $numToSelect } nilai na unik sian sequence na marpanjang { $numPossibleValues }

select-prime-numbers-too-few-values = Ndang boi dipillit { $numToSelect } nilai sian daftar bilangan prima na marpanjang { $numValues }

select-prime-numbers-values-count-mismatch = Godang ni nilai na ditontuhon di select ingkon tudos tu godang na dipillit

select-prime-numbers-values-not-prime = Sude nilai na ditontuhon di select bilangan prima ingkon adong di daftar bilangan prima

select-prime-numbers-values-excluded-combination = Nilai selectPrimeNumbers na ditontuhon i sada kombinasi na dipabali

select-prime-numbers-excluded-too-many-combinations = Lobi sian 70% kombinasi dipabali di selectPrimeNumbers

select-random-combination-fluke = Ala hasompatan na jarang situtu, ndang boi dipillit kombinasi ni nilai acak

select-random-value-fluke = Ala hasompatan na jarang situtu, ndang boi dipillit nilai acak

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] `<{ $component }>` on ndang dipatuduhon ala di bagasan matematika jala ndang `inline`. Tamba ma `inline` asa gabe daftar na turun, na muat di bagasan sada ekspresi.
        [expanded] `<{ $component }>` on ndang dipatuduhon ala di bagasan matematika jala `expanded`. Buang ma `expanded`; kotak na godang barisna ndang muat di bagasan sada ekspresi.
        [on-graph] `<{ $component }>` on ndang dipatuduhon ala di bagasan matematika na digambar di graph, na so maringanan tu masukan.
       *[relative-width] `<{ $component }>` on ndang dipatuduhon ala di bagasan matematika jala marlebar relatif. Lehon ma lebarna marhite satuan absolut, songon `px`.
    }
