# Buginese (Basa Ugi) diagnostics: the warnings and errors the worker raises
# and the reader is shown. Translated from `locales/en/diagnostics.ftl`, which
# is the source of truth. Selected by `uiLocale`, not by the language the
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
# **Script and apostrophe** are `chrome.ftl`'s: Latin rather than Lontara, and
# the final glottal stop written with the ASCII apostrophe `'` (U+0027)
# everywhere.
#
# **The technical vocabulary is Indonesian and is declared as such** —
# komponen, atribut, variabel, dimensi, matriks, referensi, fungsi, persamaan.
# Buginese speakers are schooled in Indonesian, and these are the words the
# community uses; inventing Buginese equivalents would put words in front of a
# reader that no Buginese reader has met.
#
# **What is Buginese is the frame**, and it carries the whole file:
#
#   «de'»              *tidak*, the plain negator
#   «de' nawedding»    *tidak dapat* — «wedding» is *dapat*
#   «de'gaga»          *tidak ada*
#   «de'pa»            *belum*; «de'pa nariébbu» is *belum diterapkan*
#   «tenripaduli»      *diabaikan* — the passive negative of «paduli»
#   «riruntu'»         *ditemukan*; «de' nariruntu'» is *tidak ditemukan*
#   «harusu'»          *harus*
#   «nasaba»           *karena*
#   «rékko»            *jika*
#   «naé»              *tetapi*
#   «sibawa» / «na»    *dengan* / *dan*
#   «iyaré'ga»         *atau*
#   «pole ri»          *dari*; «untu'» *untuk*; «ri» *di*
#   «maneng»           *semua*; «tungke'» *tiap*; «lebbi pole ri» *lebih dari*
#   «mappunnai»        *memiliki*; «de' nappunnai» *tidak memiliki*
#
# A sentence that has slipped back into «tidak», «yang», «karena» or «dari» is
# a mistake to fix rather than a stylistic choice. This is a **framed**
# catalog: the sentences are Buginese, the nouns inside them are declared
# Indonesian, and a speaker should expect to correct the sentences as often as
# the words.
#
# **No plural branches.** CLDR has no plural data for `bug`, so every
# `[one]`/`[other]` fork English writes over a count is collapsed here; most
# become a plain message, since a Buginese noun is unmarked after a numeral.
# The one exception is `field-function-wrong-num-outputs`, where English is
# not counting but distinguishing a one-output field from a two-output one;
# that fork is kept as the numeric literal `[1]`, which Fluent matches against
# the number itself rather than against a plural category.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } tenripaduli rékko dua tetti' ujung ripattentu

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } tenripaduli rékko tetti' ujung na tetti' tengnga ripattentu maneng

line-segment-midpoint-offset-without-midpoint = midpointOffset de'gaga akkegunanna rékko de'gaga tetti' tengnga

## `<line>`

line-points-undetermined-dimensions = Garis molai tetti'-tetti' iya dimensinna de' nawedding ripattentu.

line-points-too-few-dimensions = Garis harusu' molai tetti'-tetti' iya dimensinna kurang-kurangna duwa.

line-points-depend-on-variables = Garis molai tetti'-tetti' iya maccoé ri variabel: { $variables }.

line-equation-invalid-format = Format persamaan garis ri variabel { $variable1 } na { $variable2 } de' nasah.

## `<ray>`

ray-overprescribed-through = Sinar ripattentu massidi ri through, endpoint, na direction. Through iya ripattentué tenripaduli.

ray-dimension-mismatch = numDimensions ri sinar de' nasitinaja.

## `<vector>`

vector-overprescribed-head = Vektor ripattentu massidi ri head, tail, na displacement. Head iya ripattentué tenripaduli.

vector-dimension-mismatch = numDimensions ri vektor de' nasitinaja.

## Attracting and constraining

attract-to-without-nearest-point = De' nawedding rigettengngi lao ri `<{ $component }>` nasaba de' nappunnai variabel keadaan nearestPoint.

constrain-to-without-nearest-point = De' nawedding ribatasi lao ri `<{ $component }>` nasaba de' nappunnai variabel keadaan nearestPoint.

constrain-to-interior-without-nearest-point = De' nawedding ribatasi lao ri laleng `<{ $component }>` nasaba de' nappunnai variabel keadaan nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition tenripaduli untu' choiceInput iya tanniyaé inline

## Ordering children by index

choice-input-indices-count-mismatch = Indices iya ripattentué untu' choiceInput tenripaduli nasaba jumla indices de' nasitinaja sibawa jumla ana' choice.

pretzel-indices-count-mismatch = Indices iya ripattentué untu' problem tenripaduli nasaba jumla indices de' nasitinaja sibawa jumla ana' problem.

shuffle-indices-count-mismatch = Indices iya ripattentué untu' shuffle tenripaduli nasaba jumla indices de' nasitinaja sibawa jumla komponen.

indices-ignored-out-of-range = Indices iya ripattentué untu' { $component } tenripaduli nasaba engka indeks iya massué pole ri jangkauan.

pretzel-indices-repeated = Indices iya ripattentué untu' pretzel tenripaduli nasaba engka indeks iya makkolik.

pretzel-circuit-first-index = Indices iya ripattentué untu' pretzel ri mode circuit tenripaduli nasaba indeks mammulangngé harusu' 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Kuammengngi `<{ $component }>` majjama sibawa ana' rupa string, atribut `type` harusu' ripattentu.

invalid-type-defaulting-to-math = Tipe { $type } de' nasah untu' komponen { $component }. Harusu' séddi pole ri math, text, number, iyaré'ga boolean. Napaké math.

string-not-valid-component-to-arrange = String "{ $value }" tenniya komponen iya sahé untu' { $component }. Tenripaduli.

## Types and variables

invalid-type-defaulting-to-number = Tipe { $type } de' nasah, tipe ripattentu ri number.

invalid-variable-value = Nilai variabel de' nasah: `{ $value }`

## Variants

variant-index-must-be-number = Indeks varian { $index } harusu' rupa bilangan

variant-index-must-be-integer = Indeks varian { $index } harusu' rupa bilangan bulat

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` de'pa nariébbu untu' ukuran absolut. Lebbara' ripinra mancaji relatif.

side-by-side-absolute-margins = `<{ $component }>` de'pa nariébbu untu' ukuran absolut. Margin ripinra mancaji relatif.

side-by-side-no-block-child = `<{ $component }>` de' nasah: harusu' mappunnai kurang-kurangna séddi ana' rupa blok.

## `<label>`

label-for-ignored-on-graphical = Atribut `for` ri `<label>` grafis tenripaduli.

label-for-must-resolve-to-one = Atribut `for` ri `<label>` harusu' mattuju tepa' ri séddi komponen.

label-for-unresolved = Atribut `for` ri `<label>` de' nawedding rituju lao ri séddi komponen.

label-for-answer-with-authored-inputs = Atribut `for` ri `<label>` mattuju ri `<answer>` iya masukanna riokii alena; tujuiwi masukan iyaro matteru.

label-for-answer-without-input = Atribut `for` ri `<label>` mattuju ri `<answer>` iya de'gaga masukanna untu' rilabeli.

label-for-must-reference-input-or-answer = Atribut `for` ri `<label>` harusu' mattuju ri séddi masukan iyaré'ga séddi pappébali.

## Accessibility

accessibility-short-description-or-decorative = Untu' aksesibilitas, `<{ $component }>` harusu' mappunnai keterangan ponco' iyaré'ga ripattentu selaku dekoratif.

accessibility-video-short-description = Untu' aksesibilitas, `<video>` harusu' mappunnai keterangan ponco'.

accessibility-input-short-description-or-label = Untu' aksesibilitas, `<{ $component }>` harusu' mappunnai keterangan ponco' iyaré'ga label.

accessibility-answer-input-short-description-or-label = Untu' aksesibilitas, séddi `<answer>` iya ébbu'é masukan harusu' mappunnai keterangan ponco' iyaré'ga label.

accessibility-short-description-contains-math = Keterangan ponco' de' nasitinaja mappunnai komponen matematika pada-pada `<{ $component }>`. Okii isi matematikana sibawa ada-ada.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } kontrasna de' nagenne' untu' teks judul bagiang (mode malotong) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; napparelluang kurang-kurangna { $threshold }:1).
       *[other] { $colorName } kontrasna de' nagenne' untu' teks judul bagiang ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; napparelluang kurang-kurangna { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = De'pa nariébbu `<circle>` molai { $count } tetti' rékko tetti'-tetti'na de'gaga nilai numerikna.

circle-too-many-through-points = De' nawedding ribilang lingkaran iya molaé lebbi pole ri 3 tetti'.

circle-overprescribed-radius-center-points = De' nawedding ribilang lingkaran iya jari-jarina, posina na tetti' laloanna ripattentu maneng.

circle-center-with-multiple-points = De' nawedding ribilang lingkaran sibawa posi tertentu iya molaé lebbi pole ri 1 tetti'.

circle-radius-too-small = De' nawedding ribilang lingkaran: nasaba éllé' duwa tetti'é iyanaritu { $distance }, jari-jari { $radius } iya ripattentué lalo baiccu'.

circle-radius-with-many-points = De' nawedding riébbu lingkaran iya molaé lebbi pole ri duwa tetti' sibawa jari-jari tertentu.

circle-invalid-center-or-through-points = Posi iyaré'ga tetti' laloanna lingkaran de' nasah.

circle-radius-center-with-multiple-points = De' nawedding ribilang jari-jarina lingkaran sibawa posi tertentu iya molaé lebbi pole ri 1 tetti'.

circle-change-radius-non-numerical = De' nawedding ripinra jari-jarina lingkaran iya tetti' laloanna de' namanumerik

circle-radius-with-points-non-numerical = De' nawedding riébbu lingkaran iya molaé lebbi pole ri séddi tetti' sibawa jari-jari tertentu rékko de'gaga nilai numerik.

circle-change-center-non-numerical = De'pa nariébbu pappinra posina lingkaran iya molaé tetti'-tetti' de' namanumerik.

## `<function>`

function-domain-insufficient-dimensions = Dimensi domainna fungsi de' nagenne'. Domain mappunnai { $intervals } selang naé fungsi mappunnai { $inputs } masukan.

function-domain-invalid-format = Format domainna fungsi de' nasah.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Maksimum fungsi iya de'é namanumerik tenripaduli.
        [minimum] Minimum fungsi iya de'é namanumerik tenripaduli.
        [extremum] Ekstremum fungsi iya de'é namanumerik tenripaduli.
        [point] Tetti' fungsi iya de'é namanumerik tenripaduli.
        [slope] Kemiringan fungsi iya de'é namanumerik tenripaduli.
       *[other] { $type } fungsi iya de'é namanumerik tenripaduli.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Maksimum fungsi iya lobbangngé tenripaduli.
        [minimum] Minimum fungsi iya lobbangngé tenripaduli.
        [extremum] Ekstremum fungsi iya lobbangngé tenripaduli.
        [point] Tetti' fungsi iya lobbangngé tenripaduli.
       *[other] { $type } fungsi iya lobbangngé tenripaduli.
    }

function-points-too-close = Fungsi mappunnai duwa tetti' iya lalo maddeppé onronna. Fungsi de' nawedding ripattentu.

function-iterates-input-output-mismatch = Iterasi fungsi wedding bawang rékko jumla masukanna pada sibawa jumla assuna. Fungsi iyaé mappunnai { $inputs } masukan na { $outputs } assu.

## `<sequence>`

sequence-invalid-length = Lampéna barisan de' nasah. Harusu' rupa bilangan bulat iya tenniyaé negatif.

sequence-invalid-step = Langkana barisan de' nasah. Harusu' rupa bilangan untu' barisan tipe { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" ri barisan bilangan de' nasah. Harusu' rupa bilangan.

sequence-invalid-endpoint-letters = "{ $attribute }" ri barisan huruf de' nasah. Harusu' rupa kombinasi huruf.

sequence-invalid-endpoint = "{ $attribute }" ri barisan de' nasah.

select-from-sequence-coprime-not-numbers = coprime tenripaduli nasaba iya ripilé'é tenniya bilangan

select-from-sequence-coprime-with-exclude-combinations = coprime tenripaduli nasaba excludeCombinations ripattentu

## Resolving a `target`

target-not-found = Target untu' `<{ $source }>` de' nasah: target de' nariruntu'.

target-state-variable-not-found = Target untu' `<{ $source }>` de' nasah: de' nariruntu' variabel keadaan iya riasengngé "{ $property }" ri `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Variabelna `<odeSystem>` harusu' laingngé pole ri variabel bebas.

ode-system-duplicate-variable-names = De' nawedding ripattentu fungsi ruas atau ODE sibawa aseng variabel terikat iya makkolik.

ode-system-rhs-function-error = De' nawedding ripattentu fungsi ruas atau ODE. Engka asalang wettunna riébbu fungsi mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = De' nawedding ripattentu sudu' ri pallawangenna { $count } garis

angle-invalid-through-point = Engka tetti' de' nasah ri through appunnangenna `<angle>`

parabola-vertex-too-many-points = De'pa nariébbu parabola sibawa tetti' puncak tertentu iya molaé lebbi pole ri 1 tetti'.

parabola-too-many-points = De'pa nariébbu parabola iya molaé lebbi pole ri 3 tetti'.

intersection-too-many-items = De'pa nariébbu irisan untu' lebbi pole ri duwa objek

## Other math components

ionic-compound-not-two-ions = De'pa nariébbu senyawa ion sangadinna untu' duwa ion.

ionic-compound-needs-cation-and-anion = Senyawa ion riébbu bawang untu' séddi kation na séddi anion.

solve-equations-cannot-evaluate = De' nawedding ripettu persamaan nasaba persamaanna de' nawedding rievaluasi: { $equation }

math-operators-operand-number-required = operandNumber harusu' ripattentu rékko maéloki mala séddi operan matematika.

eigen-decomposition-failed = De' nawedding ribilang nilai eigenna matriks

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: parameter { $parameters } de' nakompoi ri laleng pola, jaji tuli sitinaja sibawa alobbangeng.

## `<graph>`

graph-grid-invalid = `<graph>`: de' nawedding ripahang grid="{ $grid }". Nilaina harusu' none, medium, dense, iyaré'ga duwa bilangan positif iya ripasarangngé spasi, contona grid="1 0.5". Kisi de' nariébbu.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` napparelluang fungsi sibawa { $expected ->
        [1] séddi assu, iyanaritu kemiringan y' ri tungke' tetti', contona `y - x`
       *[other] duwa assu, iyanaritu vektor ri tungke' tetti', contona `(y, -x)`
    }, naé fungsi iya riwéréngngé mappunnai { $found ->
       *[other] { $found } assu
    }. { $alternative ->
        [none] De'gaga iya riébbué.
       *[other] `<{ $alternative }>` iyanaritu komponen untu' fungsi makkuwaéro. De'gaga iya riébbué.
    }

field-function-attribute-ignored-with-child = Atribut `function` tenripaduli nasaba fungsina riwéréng towi ri laleng komponen; iya ri lalengngé iya ripaké. Wéréngngi fungsina séddi bawang pole ri duwa carana.

field-variables-ignored =
    `<{ $component }>`: atribut `variables` masengngi variabelna ungkapan iya riokié matteru ri laleng komponen. { $reason ->
        [function-child] Fungsi kuae riwéréng selaku ana' `<function>`, iya masengngé variabelna alena, jaji `variables` tenripaduli.
       *[no-expression] De'gaga ungkapan makkuwaéro kuae, jaji `variables` tenripaduli.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" de' naridukung ri perender prefigure; napaké kelakuan posisi atau.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" de' naridukung ri perender prefigure; napaké kelakuan posisi liyasé.

prefigure-invalid-axis-bounds = `<graph>`: batas sumbu de' nasah untu' konversi prefigure; napaké bbox bawaan (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: lebbara' de' nasah untu' konversi prefigure; napaké lebbara' diagram bawaan 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio de' nasah untu' konversi prefigure; napaké rasio aspek bawaan 1.

prefigure-grid-spacing-too-fine = `<graph>`: éllé' kisina lalo maddeppé untu' batas sumbuna; kisi ripallennye' ri perender prefigure.

prefigure-annotations-not-rendered = `<graph>`: anotasi de' nariébbu rékko perender PreFigure de' naripaké.

multiple-annotations-children = Riruntu' maéga ana' `<annotations>` ri laleng `<graph>`; maneng tenripaduli sangadinna iya paccappurengngé.

## Referring to other components

copy-unrecognized-component-type = De' nawedding ripaluwa iyaré'ga ricopy tipe komponen iya de'é naissengngi: { $type }.

copy-prop-not-found = De' nariruntu' prop { $property } ri komponen tipe { $component }

collect-no-source = De'gaga sumber iya riruntu'é untu' collect.

collect-invalid-component-type = De' nawedding ripaddeppungeng komponen tipe `<{ $component }>` nasaba iyaro tenniya tipe komponen iya sahé.

reference-index-unavailable = De' nawedding rituju indeks `{ $reference }`

## `<callAction>`

component-action-unavailable = De' nawedding riobbi { $action } ri komponen `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Rupanna data de' nasah. Lampéna baris de' napada. Riruntu' ri componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data mappunnai aseng kolom iya makkolik. Riruntu' ri componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data ateddéngeng séddi aseng kolom. Riruntu' ri componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Séddi award untu' pappébali iyaé mappallaiseng ri pappébali iya nakiringngé tag answer alena, iya mébbué kelakuan iya de'é narisenna.

answer-max-num-attempts-in-section-wide-check-work = Pattentu `maxNumAttempts` ri `<answer>` iya engkaé ri laleng wadah sibawa `sectionWideCheckWork` de'gaga akkegunanna, nasaba jumla cobana nakuasai wadah iyaro. Pattentui `maxNumAttempts` ri wadahna.

nested-section-wide-check-work-max-num-attempts = Pattentu `maxNumAttempts` ri wadah sibawa `sectionWideCheckWork` iya engkaé ri laleng wadah laingngé sibawa `sectionWideCheckWork` de'gaga akkegunanna, nasaba jumla cobana nakuasai wadah kaminang saliweng. Pattentui `maxNumAttempts` ri wadah kaminang saliweng.

answer-attributes-need-symbolic-equality = Atribut { $attributes } de'gaga akkegunanna rékko symbolicEquality de' naripattentu.

answer-invalid-type = Tipe untu' answer de' nasah: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Nasaba komponen `<{ $component }>` de' nappunnai aseng, de' nawedding ripaké selaku atribut modul

module-attribute-name-already-defined = Komponen `<{ $component } name="{ $name }">` de' nawedding ripaké selaku atribut séddi modul nasaba tipe komponen `<module>` purani mappunnai atribut "{ $name }".

conditional-content-condition-ignored = Atribut `condition` tenripaduli ri komponen `<conditionalContent>` iya mappunnaié ana' case iyaré'ga else.

slider-markers-type-mismatch = Tipe tanrang de' nasitinaja sibawa tipe panggeser.

pretzel-problem-needs-statement-and-answer = Pretzel de' nasah: tungke' `<problem>` harusu' mappunnai séddi `<statement>` na séddi `<answer>`.

pretzel-circuit-first-problem-distractor = Pretzel de' nasah: ri mode="circuit", `<problem>` mammulangngé de' nawedding mancaji pabbelléang.

## Attribute values

attribute-invalid-values = Nilai { $values } untu' atribut `{ $attribute }` de' nasah; tenripaduli.

attribute-must-be-references = Nilai `{ $value }` untu' atribut `{ $attribute }` de' nasah. Atribut harusu' ripatettong pole ri referensi iya mammulaé sibawa `$`.

math-input-invalid-function-names = <mathInput>: aseng fungsi iya de'é nasah ri { $attribute } tenripaduli: { $names }. Bagiang tampilanna tungke' aseng harusu' kurang-kurangna 2 karakter (huruf iyaré'ga tanrang sambung); wedding naccoé akhiran pilihan `|<alternatif mathspeak>`.

## Building components from the source

component-type-invalid = Tipe komponen de' nasah: `<{ $componentType }>`

attribute-repeated = Atribut { $attribute } de' nawedding rikolik.

attribute-invalid-for-component = Atribut "{ $attribute }" de' nasah untu' komponen tipe `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Definisi gaya { $styleNumber } kontrasna de' nagenne' untu' { $context ->
        [text-on-background] warna teks lao ri warna latar
        [high-contrast] warna kontras matanré lao ri kanvas
        [line] warna garis lao ri kanvas
        [marker] warna tanrang lao ri kanvas
       *[text-on-canvas] warna teks lao ri kanvas
    }{ $mode ->
        [dark] { " (mode malotong)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; napparelluang kurang-kurangna { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Namuni definisi gaya { $styleNumber } pattentui warna iya kontrasna genne' untu' mode macakka, warna mode malotong iya ripaompoé pole ri nilai-nilaéro kontrasna de' nagenne' ri pallawangenna warna teks na warna latar ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; napparelluang kurang-kurangna { $threshold }:1). { $suggestion ->
        [available] Kuammengngi kontrasna genne' ri mode malotong, pattanréi kontras mode macakka (contona pattentui { $lightAttribute }="{ $lightColor }") iyaré'ga timpai warna mode malotong (contona pattentui { $darkAttribute }="{ $darkColor }").
       *[none] Kuammengngi kontrasna genne' ri mode malotong, pattanréi kontras mode macakka iyaré'ga timpai warna ripaompoé sibawa textColorDarkMode na/iyaré'ga backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Namuni definisi gaya { $styleNumber } pattentui warna teks iya kontrasna genne' untu' mode macakka, warna teks mode malotong iya ripaompoé pole ri nilaéro kontrasna de' nagenne' lao ri kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; napparelluang kurang-kurangna { $threshold }:1). { $suggestion ->
        [available] Kuammengngi kontrasna genne' ri mode malotong, pattanréi kontras mode macakka (contona pattentui textColor="{ $lightColor }") iyaré'ga timpai warna mode malotong (contona pattentui textColorDarkMode="{ $darkColor }").
       *[none] Kuammengngi kontrasna genne' ri mode malotong, pattanréi kontras mode macakka iyaré'ga timpai warna ripaompoé sibawa textColorDarkMode.
    }

section-multiple-style-palettes = Séddi bagiang wedding bawang mamilé séddi <stylePalette>; napaké iya paccappurengngé.

## Unique variants

variant-num-to-select-not-non-negative-integer = de' nawedding ripattentu varian unik pole ri { $component } nasaba numToSelect tenniya bilangan bulat iya tenniyaé negatif.

variant-num-to-select-not-constant-number = de' nawedding ripattentu varian unik pole ri { $component } nasaba numToSelect tenniya bilangan tetteng.

variant-with-replacement-not-constant-boolean = de' nawedding ripattentu varian unik pole ri { $component } nasaba withReplacement tenniya boolean tetteng.

variant-select-weight-disables-unique = Varian unik untu' select ripeddé rékko engka opsi iya pattentué selectWeight iyaré'ga selectForVariants

variant-coprime-undetermined = de' nawedding ripattentu varian unik pole ri { $component } nasaba de' nawedding ripattentu makkedaé coprime tuli sala.

variant-attribute-not-constant = de' nawedding ripattentu varian unik pole ri { $component } nasaba { $attribute } tenniya nilai tetteng.

variant-attribute-not-number = de' nawedding ripattentu varian unik pole ri { $component } nasaba { $attribute } tenniya bilangan.

variant-attribute-wrong-type-for-sequence =
    de' nawedding ripattentu varian unik pole ri { $component } tipe { $type } nasaba { $attribute } tenniya { $expected ->
        [letters-combination] kombinasi huruf
        [math-expression] ungkapan matematika iya sahé
        [integer] bilangan bulat
       *[number] bilangan
    }.

variant-length-not-integer = de' nawedding ripattentu varian unik pole ri { $component } nasaba length tenniya bilangan bulat.

variant-sort-not-implemented = de'pa nariébbu varian unik pole ri { $component } sibawa sort

variant-exclude-combinations-not-implemented = de'pa nariébbu varian unik pole ri { $component } sibawa excludeCombinations

variant-math-exclude-not-implemented = de'pa nariébbu varian unik pole ri { $component } tipe math sibawa exclude

variant-non-constant-exclude-not-implemented = de'pa nariébbu varian unik pole ri { $component } sibawa exclude iya tenniyaé tetteng

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: de' naridukung ri perender prefigure grafik; turunanna rilalo.

prefigure-descendant-invalid-geometry = { $subject }: geometri de' namattentu iyaré'ga de' nasukku'; turunanna rilalo.

prefigure-curve-label-omitted = { $subject }: label de' naridukung ri elemen kurva assalenna konversi; label ripallennye'.

prefigure-curve-unsupported-definition-type = { $subject }: tipe definisi fungsi kurva '{ $definitionType }' de' naridukung; turunanna rilalo.

prefigure-region-flip-functions-unsupported = { $subject }: atribut flipFunctions ri regionBetweenCurves de' naridukung; turunanna rilalo.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves nadukung bawang fungsi ana' tipe formula; turunanna rilalo.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' de' naridukung untu' { $labelKind ->
        [line-family] label rumpunna garis
       *[point] label tetti'
    }; napaké perataan bawaan PreFigure.

prefigure-fill-style-unsupported = { $subject }: gaya isi '{ $fillStyle }' de' naridukung ri PreFigure; palisu lao ri isi padat.

prefigure-line-style-unknown = { $subject }: gaya garis '{ $lineStyle }' de' naissengngi na ripallennye' pole ri assuna PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: gaya tanrang '{ $markerStyle }' ripalétté lao ri gaya 'diamond' appunnangenna PreFigure.

prefigure-marker-style-unsupported = { $subject }: gaya tanrang '{ $markerStyle }' de' naridukung ri PreFigure; napaké gaya bawaan.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` de' nasah; target de' nawedding rituju. Anotasi ripallennye'.

annotation-ref-multiple-targets = `<annotation>`: `ref` mattuju ri maéga target; napaké target mammulangngé.

annotation-ref-outside-graph = `<annotation>`: `ref` de' nasah; target engka ri saliwenna grafik iya mattampu'é. Anotasi ripallennye'.

annotation-ref-unsupported-target = `<annotation>`: `ref` de' nasah; target tenniya objek grafis iya naridukungngé ri konversi prefigure. Anotasi ripallennye'.

annotation-text-missing = `<annotation>`: `text` teddéng iyaré'ga lobbang; mébbu teks lobbang.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Riruntu' appallaisengeng mattulili.
       *[other] Riruntu' appallaisengeng mattulili iya maccampuru'é komponen `<{ $componentType }>`.
    }

reference-no-referent = De'gaga acuan iya riruntu'é untu' referensi: `{ $reference }`

reference-multiple-referents = Riruntu' maéga acuan untu' referensi: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format atribut { $attribute } ri `<{ $componentType }>` de' nasah.

children-invalid = Ana' `<{ $componentType }>` de' nasah: riruntu' ana' iya de'é nasah: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Nilai `{ $value }` untu' atribut `{ $attribute }` de' nasah, napaké nilai `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML versi { $version } de' nariruntu'.
       *[other] DoenetML versi { $version } de' nariruntu'. Palisu lao ri versi { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML de' nasah: { $content }

parse-tag-missing-close-tag = DoenetML de' nasah: Tag `{ $tag }` de' nappunnai tag pattutu'. Nasenna' engka tag iya mattutu' alena iyaré'ga tag `</{ $tagName }>`.

parse-tag-error = DoenetML de' nasah: Engka asalang ri tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML de' nasah: Atribut `{ $attribute }` pada-pada ateddéngeng nilai.

parse-attribute-invalid = DoenetML de' nasah: Atribut `{ $attribute }` de' nasah

parse-attribute-value-invalid = DoenetML de' nasah: Nilai atribut `{ $value }` de' nasah

parse-attribute-value-quote-mismatch = DoenetML de' nasah: Nilai atribut `{ $value }` de' nasah. Tanrang kutipna de' nasitinaja. Pada-pada ateddéngengki séddi `{ $quote }`

parse-open-tag-name-missing = DoenetML de' nasah: Riruntu' tag iya de'é nappunnai aseng tag, contona `<`

parse-tag-not-closed = DoenetML de' nasah: Tag `{ $tag }` de'pa naritutu' (pada-pada ateddéngeng `>`).

parse-self-closing-tag-name-missing = DoenetML de' nasah: Riruntu' tag iya de'é nappunnai aseng tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML de' nasah: Tag `{ $tag }` de'pa naritutu' (pada-pada ateddéngeng `/>`).

parse-tag-invalid-attributes = DoenetML de' nasah: Tag `{ $tag }` de' nasah. Atributna wedding sala.

parse-close-tag-name-missing = DoenetML de' nasah: Riruntu' tag pattutu' iya de'é nappunnai aseng tag, contona `</`

parse-attribute-value-unquoted = Nilai atribut harusu' riala sibawa tanrang kutip: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML de' nasah: Riruntu' tag pattutu' `{ $tag }`, naé de'gaga tag pattimpa' iya sitinajaé

parse-close-tag-mismatched = DoenetML de' nasah: Tag pattutu' de' nasitinaja. Nasenna' `</{ $expected }>`. Riruntu' `{ $found }`

parser-node-unconvertible = De' nawedding ripinra simpul { $node } mancaji simpul Dast.

## Names

name-attribute-invalid =
    Atribut name='{ $name }' de' nasah. { $reason ->
        [characters] Aseng wedding bawang mappunnai huruf, angka, garis yawa, iyaré'ga tanrang sambung.
       *[start] Aseng harusu' mammula sibawa huruf.
    }

component-name-invalid-start = Aseng komponen "{ $name }" de' nasah. Aseng harusu' mammula sibawa huruf.

## `<answer>` sugar

answer-video-watched-missing-video = Answer tipe videoWatched harusu' mappunnai atribut video

answer-video-watched-video-not-reference = Answer tipe videoWatched harusu' mappunnai atribut video iya rupa referensi

answer-name-not-single-text = Atribut name ri answer harusu' mappunnai tepa' séddi ana' rupa teks

## Referencing another document

external-doenetml-recursion-limit = De' nawedding riala DoenetML saliweng nasaba lalo maéga tingkat rekursi. Engkaga referensi mattulili?

external-doenetml-unavailable = De' nawedding riala DoenetML pole ri { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML iya rialaé pole ri { $attribute }="{ $uri }" de' nasah: de' nasitinaja sibawa tipe komponen "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` purani teddéng; paké `{ $to }`.
       *[other] [deprecation] Atribut `{ $from }` ri `<{ $component }>` purani teddéng; paké `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` purani teddéng na tenripaduli nasaba `{ $to }` ripattentu towi.
       *[other] [deprecation] Atribut `{ $from }` ri `<{ $component }>` purani teddéng na tenripaduli nasaba `{ $to }` ripattentu towi.
    }

deprecated-attribute-ignored = [deprecation] Atribut `{ $attribute }` ri `<{ $component }>` purani teddéng na tenripaduli.

deprecated-attribute-to-child = [deprecation] Atribut `{ $attribute }` ri `<{ $component }>` purani teddéng; paké ana' `<{ $child }>` bawang.

deprecated-attribute-value-renamed = [deprecation] Nilai `{ $value }` pole ri atribut `{ $attribute }` ri `<{ $component }>` purani teddéng; paké `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` wedding bawang mébbu jama'na basa Inggris, jaji teksna ritaro pada-padanna ri dokumen iya riokié ri { $locale }. Okii bentu' jama'na matteru, iyaré'ga pattentui sibawa atribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elemen `<{ $tag }>` tenniya elemen Doenet iya riissengngé.

schema-element-not-allowed-at-root = Elemen `<{ $tag }>` de' nariwéréng ri ure'na dokumen.

schema-element-not-allowed-inside = Elemen `<{ $tag }>` de' nariwéréng ri laleng `<{ $parent }>`.

schema-attribute-unrecognized = Elemen `<{ $tag }>` de' nappunnai atribut iya riasengngé `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribut `{ $attribute }` ri elemen `<{ $tag }>` harusu' rupa daftar iya tungke' isinna séddi pole ri: { $allowed }
       *[other] Atribut `{ $attribute }` ri elemen `<{ $tag }>` harusu' séddi pole ri: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Aseng varian untu' select de' nasah. Aseng varian { $variantName } kompoi ri { $numOptions } opsi naé jumla iya ripilé'é { $numToSelect }.

select-variant-name-without-options = Engka varian iya ripattentué untu' select naé de'gaga opsi untu' aseng varian iya weddingngé: { $variantName }.

select-variant-name-not-possible = Aseng varian { $variantName } iya ripattentué untu' select tenniya aseng varian iya weddingngé.

select-too-few-options = De' nawedding ripilé { $numToSelect } komponen pole ri { $numOptions } bawang.

select-from-sequence-too-few-values = De' nawedding ripilé { $numToSelect } nilai pole ri barisan iya lampéna { $length }.

select-from-sequence-indices-count-mismatch = Jumla indeks iya ripattentué untu' select harusu' pada sibawa jumla iya ripilé'é

select-from-sequence-indices-not-integers = Maneng indeks iya ripattentué untu' select harusu' rupa bilangan bulat

select-from-sequence-index-excluded = Indeks iya ripattentué untu' selectfromsequence maccowé ri iya ripasalaié

select-from-sequence-indices-excluded-combination = Indeks iya ripattentué untu' selectfromsequence mébbu kombinasi iya ripasalaié

select-from-sequence-coprime-not-positive-integers = De' nawedding ripilé kombinasi sipprima nasaba iya ripilé'é tenniya bilangan bulat positif.

select-from-sequence-coprime-common-factor = De' nawedding ripilé bilangan iya sipprima. Maneng nilai iya weddingngé mappunnai faktor sisumpung. (Nilai "from" iyaré'ga "to" iya ripattentué harusu' sipprima sibawa "step".)

select-from-sequence-coprime-single-number = De' nawedding ripilé kombinasi sipprima pole ri séddi bilangan alena iya tenniyaé 1.

select-from-sequence-excluded-too-many-combinations = Lebbi pole ri 70% kombinasi ripasalai ri selectFromSequence

select-from-sequence-coprime-none-found = De' naulléi ripilé bilangan iya sipprima. Maneng nilai iya weddingngé mappunnai faktor sisumpung.

select-from-sequence-too-few-unique-values = De' nawedding ripilé { $numToSelect } nilai iya laingngé pole ri barisan iya lampéna { $numPossibleValues }

select-prime-numbers-too-few-values = De' nawedding ripilé { $numToSelect } nilai pole ri daftar bilangan prima iya lampéna { $numValues }

select-prime-numbers-values-count-mismatch = Jumla nilai iya ripattentué untu' select harusu' pada sibawa jumla iya ripilé'é

select-prime-numbers-values-not-prime = Maneng nilai iya ripattentué untu' select prime number harusu' engka ri daftar bilangan prima

select-prime-numbers-values-excluded-combination = Nilai iya ripattentué untu' selectPrimeNumbers mébbu kombinasi iya ripasalaié

select-prime-numbers-excluded-too-many-combinations = Lebbi pole ri 70% kombinasi ripasalai ri selectPrimeNumbers

select-random-combination-fluke = Nasaba appakkennang iya majarangngé senna', kombinasi nilai acak de' naulléi ripilé

select-random-value-fluke = Nasaba appakkennang iya majarangngé senna', nilai acak de' naulléi ripilé

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] `<{ $component }>` iyaé de' naripaita nasaba engkai ri laleng matematika naé tenniya `inline`. Tambai `inline` kuammengngi mancaji daftar nonno', iya muttamana ri laleng ungkapan.
        [expanded] `<{ $component }>` iyaé de' naripaita nasaba engkai ri laleng matematika na `expanded`. Abbéangngi `expanded`; kotak maéga barisna de' namuttama ri laleng ungkapan.
        [on-graph] `<{ $component }>` iyaé de' naripaita nasaba engkai ri laleng matematika iya riébbué ri grafik, iya de'é nappunnai onrong untu' masukan.
       *[relative-width] `<{ $component }>` iyaé de' naripaita nasaba engkai ri laleng matematika na lebbara'na relatif. Wéréngngi lebbara'na ri satuan absolut, contona `px`.
    }
