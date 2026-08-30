# Makasar (Basa Mangkasara') diagnostics: the warnings and errors the worker
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
# **Script and apostrophe** are `chrome.ftl`'s: Latin rather than Lontara or
# Ukiri' Jangang-jangang, and the final glottal stop written with the ASCII
# apostrophe `'` (U+0027) everywhere.
#
# **The technical vocabulary is Indonesian and is declared as such** —
# komponen, atribut, variabel, dimensi, matriks, referensi, fungsi, persamaan.
# Makasar speakers are schooled in Indonesian, and these are the words the
# community uses; inventing Makasar equivalents would put words in front of a
# reader that no Makasar reader has met.
#
# **What is Makasar is the frame**, and it carries the whole file:
#
#   «tena»             *tidak*, the plain negator
#   «tena nakkulle»    *tidak dapat* — «akkulle» is *dapat*
#   «tena nia'»        *tidak ada*
#   «tenapa»           *belum*; «tenapa nipare'» is *belum diterapkan*
#   «tanipaduli»       *diabaikan*
#   «nigappa»          *ditemukan*; «tena nigappa» is *tidak ditemukan*
#   «musti»            *harus*
#   «lanri»            *karena*
#   «punna»            *jika*
#   «mingka»           *tetapi*
#   «siagang»          *dengan*, and also *dan*
#   «yareka»           *atau*
#   «battu ri»         *dari*; «untu'» *untuk*; «ri» *di*; «ri lalanna» *di dalam*
#   «ngaseng»          *semua*; «tunggala'» *tiap*; «lebbi na» *lebih dari*
#   «dudu»             *terlalu*, written after the adjective: «ca'di dudu»
#   «anne» / «anjo»    *ini* / *itu*
#
# **This is not the Buginese catalog respelled.** `locales/bug` is the
# neighbouring language, and its function words are different words: «de'»,
# «wedding», «sibawa», «iyaré'ga», «nasaba», «rékko», «naé», «pole ri»,
# «maneng». A sentence here written with one of those is a mistake, not a
# variant, and so is one that has slipped back into Indonesian «tidak», «yang»
# or «karena».
#
# This is a **framed** catalog: the sentences are Makasar, the nouns inside
# them are declared Indonesian, and a speaker should expect to correct the
# sentences as often as the words.
#
# **No plural branches.** CLDR has no plural data for `mak`, so every
# `[one]`/`[other]` fork English writes over a count is collapsed here; most
# become a plain message, since a Makasar noun is unmarked after a numeral.
# The one exception is `field-function-wrong-num-outputs`, where English is
# not counting but distinguishing a one-output field from a two-output one;
# that fork is kept as the numeric literal `[1]`, which Fluent matches against
# the number itself rather than against a plural category.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } tanipaduli punna rua titik ujung nipattantu

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } tanipaduli punna titik ujung siagang titik tangnga nipattantu ngaseng

line-segment-midpoint-offset-without-midpoint = midpointOffset tena nia' matu-matunna punna tena nia' titik tangnga

## `<line>`

line-points-undetermined-dimensions = Garis anrolai titik-titik dimensina tena nakkulle nipattantu.

line-points-too-few-dimensions = Garis musti anrolai titik-titik dimensina kurang-kurangna rua.

line-points-depend-on-variables = Garis anrolai titik-titik anturukia variabel: { $variables }.

line-equation-invalid-format = Format persamaan garis ri variabel { $variable1 } siagang { $variable2 } sala.

## `<ray>`

ray-overprescribed-through = Sinar nipattantu sipa'rua ri through, endpoint, siagang direction. Through le'baka nipattantu tanipaduli.

ray-dimension-mismatch = numDimensions ri sinar tena nasiratang.

## `<vector>`

vector-overprescribed-head = Vektor nipattantu sipa'rua ri head, tail, siagang displacement. Head le'baka nipattantu tanipaduli.

vector-dimension-mismatch = numDimensions ri vektor tena nasiratang.

## Attracting and constraining

attract-to-without-nearest-point = Tena nakkulle nibesok mange ri `<{ $component }>` lanri tena nia' variabel keadaan nearestPoint.

constrain-to-without-nearest-point = Tena nakkulle nibatasi mange ri `<{ $component }>` lanri tena nia' variabel keadaan nearestPoint.

constrain-to-interior-without-nearest-point = Tena nakkulle nibatasi mange ri lalanna `<{ $component }>` lanri tena nia' variabel keadaan nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition tanipaduli untu' choiceInput teaya inline

## Ordering children by index

choice-input-indices-count-mismatch = Indices le'baka nipattantu untu' choiceInput tanipaduli lanri jaina indices tena nasiratang siagang jaina ana' choice.

pretzel-indices-count-mismatch = Indices le'baka nipattantu untu' problem tanipaduli lanri jaina indices tena nasiratang siagang jaina ana' problem.

shuffle-indices-count-mismatch = Indices le'baka nipattantu untu' shuffle tanipaduli lanri jaina indices tena nasiratang siagang jaina komponen.

indices-ignored-out-of-range = Indices le'baka nipattantu untu' { $component } tanipaduli lanri nia' indeks assulu' battu ri jangkauang.

pretzel-indices-repeated = Indices le'baka nipattantu untu' pretzel tanipaduli lanri nia' indeks nipakamma pole.

pretzel-circuit-first-index = Indices le'baka nipattantu untu' pretzel ri mode circuit tanipaduli lanri indeks uruna musti 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Sollanna `<{ $component }>` anjama siagang ana' rupa string, atribut `type` musti nipattantu.

invalid-type-defaulting-to-math = Tipe { $type } sala untu' komponen { $component }. Musti se're battu ri math, text, number, yareka boolean. Ammake math.

string-not-valid-component-to-arrange = String "{ $value }" teai komponen baji' untu' { $component }. Tanipaduli.

## Types and variables

invalid-type-defaulting-to-number = Tipe { $type } sala, tipe nipattantu ri number.

invalid-variable-value = Nilai variabel sala: `{ $value }`

## Variants

variant-index-must-be-number = Indeks varian { $index } musti rupa bilangan

variant-index-must-be-integer = Indeks varian { $index } musti rupa bilangan bulat

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` tenapa nipare' untu' ukuran absolut. Sangkara' nipinra a'jari relatif.

side-by-side-absolute-margins = `<{ $component }>` tenapa nipare' untu' ukuran absolut. Margin nipinra a'jari relatif.

side-by-side-no-block-child = `<{ $component }>` sala: musti nia' kurang-kurangna se're ana' rupa blok.

## `<label>`

label-for-ignored-on-graphical = Atribut `for` ri `<label>` grafis tanipaduli.

label-for-must-resolve-to-one = Atribut `for` ri `<label>` musti annuju tepa' ri se're komponen.

label-for-unresolved = Atribut `for` ri `<label>` tena nakkulle nituju mange ri se're komponen.

label-for-answer-with-authored-inputs = Atribut `for` ri `<label>` annuju ri `<answer>` masukanna nitulisi' langsung; tujui anjo masukanga langsung.

label-for-answer-without-input = Atribut `for` ri `<label>` annuju ri `<answer>` tenaya nia' masukanna untu' nilabeli.

label-for-must-reference-input-or-answer = Atribut `for` ri `<label>` musti annuju ri se're masukan yareka se're jawaban.

## Accessibility

accessibility-short-description-or-decorative = Untu' aksesibilitas, `<{ $component }>` musti nia' katarangang bodona yareka nipattantu salaku dekoratif.

accessibility-video-short-description = Untu' aksesibilitas, `<video>` musti nia' katarangang bodona.

accessibility-input-short-description-or-label = Untu' aksesibilitas, `<{ $component }>` musti nia' katarangang bodona yareka label.

accessibility-answer-input-short-description-or-label = Untu' aksesibilitas, se're `<answer>` ampareka masukan musti nia' katarangang bodona yareka label.

accessibility-short-description-contains-math = Katarangang bodo tena nabaji' punna nia' komponen matematika kamma `<{ $component }>`. Tulisi' isi matematikana siagang kana-kana.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } kontrasna tena nagannaki untu' teks judul bageang (mode le'leng) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; naparalluang kurang-kurangna { $threshold }:1).
       *[other] { $colorName } kontrasna tena nagannaki untu' teks judul bageang ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; naparalluang kurang-kurangna { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Tenapa nipare' `<circle>` anrolai { $count } titik punna titik-titikna tena nia' nilai numerikna.

circle-too-many-through-points = Tena nakkulle nirekeng lingkaran anrolaia lebbi na 3 titik.

circle-overprescribed-radius-center-points = Tena nakkulle nirekeng lingkaran jari-jarina, posina siagang titik nirolaina nipattantu ngaseng.

circle-center-with-multiple-points = Tena nakkulle nirekeng lingkaran siagang posi tertentu anrolaia lebbi na 1 titik.

circle-radius-too-small = Tena nakkulle nirekeng lingkaran: lanri bella'na rua titika iamintu { $distance }, jari-jari { $radius } le'baka nipattantu ca'di dudu.

circle-radius-with-many-points = Tena nakkulle nipare' lingkaran anrolaia lebbi na rua titik siagang jari-jari tertentu.

circle-invalid-center-or-through-points = Posi yareka titik nirolaina lingkaran sala.

circle-radius-center-with-multiple-points = Tena nakkulle nirekeng jari-jarina lingkaran siagang posi tertentu anrolaia lebbi na 1 titik.

circle-change-radius-non-numerical = Tena nakkulle nipinra jari-jarina lingkaran titik nirolaina teaya numerik

circle-radius-with-points-non-numerical = Tena nakkulle nipare' lingkaran anrolaia lebbi na se're titik siagang jari-jari tertentu punna tena nia' nilai numerik.

circle-change-center-non-numerical = Tenapa nipare' pappinra posina lingkaran anrolaia titik-titik teaya numerik.

## `<function>`

function-domain-insufficient-dimensions = Dimensi domainna fungsi tena nagannaki. Domain nia' { $intervals } selanna mingka fungsi nia' { $inputs } masukanna.

function-domain-invalid-format = Format domainna fungsi sala.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Maksimum fungsi teaya numerik tanipaduli.
        [minimum] Minimum fungsi teaya numerik tanipaduli.
        [extremum] Ekstremum fungsi teaya numerik tanipaduli.
        [point] Titik fungsi teaya numerik tanipaduli.
        [slope] Kemiringan fungsi teaya numerik tanipaduli.
       *[other] { $type } fungsi teaya numerik tanipaduli.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Maksimum fungsi kosonga tanipaduli.
        [minimum] Minimum fungsi kosonga tanipaduli.
        [extremum] Ekstremum fungsi kosonga tanipaduli.
        [point] Titik fungsi kosonga tanipaduli.
       *[other] { $type } fungsi kosonga tanipaduli.
    }

function-points-too-close = Fungsi nia' rua titikna reppe' dudu tampa'na. Fungsi tena nakkulle nipattantu.

function-iterates-input-output-mismatch = Iterasi fungsi akkulle bawang punna jaina masukanna sangkamma jaina assuluna. Anne fungsia nia' { $inputs } masukanna siagang { $outputs } assuluna.

## `<sequence>`

sequence-invalid-length = La'buna barisan sala. Musti rupa bilangan bulat teaya negatif.

sequence-invalid-step = Langkana barisan sala. Musti rupa bilangan untu' barisan tipe { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" ri barisan bilangan sala. Musti rupa bilangan.

sequence-invalid-endpoint-letters = "{ $attribute }" ri barisan huruf sala. Musti rupa kombinasi huruf.

sequence-invalid-endpoint = "{ $attribute }" ri barisan sala.

select-from-sequence-coprime-not-numbers = coprime tanipaduli lanri nipileya teai bilangan

select-from-sequence-coprime-with-exclude-combinations = coprime tanipaduli lanri excludeCombinations nipattantu

## Resolving a `target`

target-not-found = Target untu' `<{ $source }>` sala: target tena nigappa.

target-state-variable-not-found = Target untu' `<{ $source }>` sala: tena nigappa variabel keadaan niarenga "{ $property }" ri `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Variabelna `<odeSystem>` musti maraeng battu ri variabel bebas.

ode-system-duplicate-variable-names = Tena nakkulle nipattantu fungsi ruas kanan ODE siagang areng variabel terikat nipakamma pole.

ode-system-rhs-function-error = Tena nakkulle nipattantu fungsi ruas kanan ODE. Nia' kasalang ri wattunna nipare' fungsi mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Tena nakkulle nipattantu sudu' ri alla'na { $count } garis

angle-invalid-through-point = Nia' titik sala ri through battu ri `<angle>`

parabola-vertex-too-many-points = Tenapa nipare' parabola siagang titik puncak tertentu anrolaia lebbi na 1 titik.

parabola-too-many-points = Tenapa nipare' parabola anrolaia lebbi na 3 titik.

intersection-too-many-items = Tenapa nipare' irisan untu' lebbi na rua objek

## Other math components

ionic-compound-not-two-ions = Tenapa nipare' senyawa ion pantaranganna untu' rua ion.

ionic-compound-needs-cation-and-anion = Senyawa ion nipare' bawang untu' se're kation siagang se're anion.

solve-equations-cannot-evaluate = Tena nakkulle nipassala' persamaan lanri persamaanna tena nakkulle nievaluasi: { $equation }

math-operators-operand-number-required = operandNumber musti nipattantu punna eroki nialle se're operan matematika.

eigen-decomposition-failed = Tena nakkulle nirekeng nilai eigenna matriks

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: parameter { $parameters } tena nammumba ri lalanna pola, jari tuli siratangi siagang kakosongang.

## `<graph>`

graph-grid-invalid = `<graph>`: tena nakkulle nipahang grid="{ $grid }". Nilaina musti none, medium, dense, yareka rua bilangan positif nipasisa'la' spasi, contona grid="1 0.5". Kisi tena nipare'.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` naparalluang fungsi siagang { $expected ->
        [1] se're assulu', iamintu kemiringan y' ri tunggala' titik, contona `y - x`
       *[other] rua assulu', iamintu vektor ri tunggala' titik, contona `(y, -x)`
    }, mingka fungsi nisarea nia' { $found ->
       *[other] { $found } assulu'
    }. { $alternative ->
        [none] Tena nia' nipare'.
       *[other] `<{ $alternative }>` iamintu komponen untu' fungsi kammaya anjo. Tena nia' nipare'.
    }

field-function-attribute-ignored-with-child = Atribut `function` tanipaduli lanri fungsina nisare tommi ri lalanna komponen; ia ri lalanga nipake. Sarei fungsina se're bawang battu ri rua caraya.

field-variables-ignored =
    `<{ $component }>`: atribut `variables` angngarengi variabelna ungkapan nitulisia langsung ri lalanna komponen. { $reason ->
        [function-child] Fungsi anrinni nisare salaku ana' `<function>`, angngarengia variabelna kalenna, jari `variables` tanipaduli.
       *[no-expression] Tena nia' ungkapan kammaya anjo anrinni, jari `variables` tanipaduli.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" tena nirurungang ri perender prefigure; ammake sipa' posisi kanang.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" tena nirurungang ri perender prefigure; ammake sipa' posisi rate.

prefigure-invalid-axis-bounds = `<graph>`: batas sumbu sala untu' konversi prefigure; ammake bbox bawaan (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: sangkara' sala untu' konversi prefigure; ammake sangkara' diagram bawaan 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio sala untu' konversi prefigure; ammake rasio aspek bawaan 1.

prefigure-grid-spacing-too-fine = `<graph>`: bella'na kisi reppe' dudu untu' batas sumbuna; kisi nipela' ri perender prefigure.

prefigure-annotations-not-rendered = `<graph>`: anotasi tena nanipare' punna perender PreFigure tena nipake.

multiple-annotations-children = Nigappa jai ana' `<annotations>` ri lalanna `<graph>`; tanipaduli ngaseng pantaranganna ia kala'busanga.

## Referring to other components

copy-unrecognized-component-type = Tena nakkulle nipalua yareka nisalin tipe komponen tenaya niasseng: { $type }.

copy-prop-not-found = Tena nigappa prop { $property } ri komponen tipe { $component }

collect-no-source = Tena nia' sumber nigappa untu' collect.

collect-invalid-component-type = Tena nakkulle nipa'rappungang komponen tipe `<{ $component }>` lanri anjo teai tipe komponen baji'.

reference-index-unavailable = Tena nakkulle nituju indeks `{ $reference }`

## `<callAction>`

component-action-unavailable = Tena nakkulle nikio' { $action } ri komponen `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Rupanna data sala. La'buna baris tena nasangkamma. Nigappa ri componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data nia' areng kolom nipakamma pole. Nigappa ri componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data tappela' se're areng kolom. Nigappa ri componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Se're award untu' anne jawabanga a'jari battu ri jawaban nikiringa ri tag answer kalenna, na anjo ampareki sipa' tenaya nikapang.

answer-max-num-attempts-in-section-wide-check-work = Ampattantui `maxNumAttempts` ri `<answer>` niaka ri lalanna wadah siagang `sectionWideCheckWork` tena nia' matu-matunna, lanri jaina percobaan nakuasai anjo wadaha. Pattantui `maxNumAttempts` ri wadahna.

nested-section-wide-check-work-max-num-attempts = Ampattantui `maxNumAttempts` ri wadah siagang `sectionWideCheckWork` niaka ri lalanna wadah maraeng siagang `sectionWideCheckWork` tena nia' matu-matunna, lanri jaina percobaan nakuasai wadah kaminang pantaraka. Pattantui `maxNumAttempts` ri wadah kaminang pantaraka.

answer-attributes-need-symbolic-equality = Atribut { $attributes } tena nia' matu-matunna punna symbolicEquality tena nipattantu.

answer-invalid-type = Tipe untu' answer sala: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Lanri komponen `<{ $component }>` tena nia' arenna, tena nakkulle nipake salaku atribut modul

module-attribute-name-already-defined = Komponen `<{ $component } name="{ $name }">` tena nakkulle nipake salaku atribut se're modul lanri tipe komponen `<module>` le'ba'mi nia' atribut "{ $name }".

conditional-content-condition-ignored = Atribut `condition` tanipaduli ri komponen `<conditionalContent>` niaka ana' case yareka else.

slider-markers-type-mismatch = Tipe tanra tena nasiratang siagang tipe panggeser.

pretzel-problem-needs-statement-and-answer = Pretzel sala: tunggala' `<problem>` musti nia' se're `<statement>` siagang se're `<answer>`.

pretzel-circuit-first-problem-distractor = Pretzel sala: ri mode="circuit", `<problem>` uruna tena nakkulle a'jari pangicu'.

## Attribute values

attribute-invalid-values = Nilai { $values } untu' atribut `{ $attribute }` sala; tanipaduli.

attribute-must-be-references = Nilai `{ $value }` untu' atribut `{ $attribute }` sala. Atribut musti nipare' battu ri referensi appakkaramulaya siagang `$`.

math-input-invalid-function-names = <mathInput>: areng fungsi salaya ri { $attribute } tanipaduli: { $names }. Bageang tampilanna tunggala' areng musti kurang-kurangna 2 karakter (huruf yareka tanra sambung); akkulle naturuki akhiran pilihang `|<alternatif mathspeak>`.

## Building components from the source

component-type-invalid = Tipe komponen sala: `<{ $componentType }>`

attribute-repeated = Atribut { $attribute } tena nakkulle nipakamma pole.

attribute-invalid-for-component = Atribut "{ $attribute }" sala untu' komponen tipe `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Definisi gaya { $styleNumber } kontrasna tena nagannaki untu' { $context ->
        [text-on-background] warna teks mange ri warna latar
        [high-contrast] warna kontras tinggi mange ri kanvas
        [line] warna garis mange ri kanvas
        [marker] warna tanra mange ri kanvas
       *[text-on-canvas] warna teks mange ri kanvas
    }{ $mode ->
        [dark] { " (mode le'leng)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; naparalluang kurang-kurangna { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Manna definisi gaya { $styleNumber } ampattantui warna kontrasna gannaki untu' mode singara', warna mode le'leng nipa'jaria battu ri anjo nilaia kontrasna tena nagannaki ri alla'na warna teks siagang warna latar ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; naparalluang kurang-kurangna { $threshold }:1). { $suggestion ->
        [available] Sollanna kontrasna gannaki ri mode le'leng, tinggikangi kontras mode singara' (contona pattantui { $lightAttribute }="{ $lightColor }") yareka timpai warna mode le'leng (contona pattantui { $darkAttribute }="{ $darkColor }").
       *[none] Sollanna kontrasna gannaki ri mode le'leng, tinggikangi kontras mode singara' yareka timpai warna nipa'jaria siagang textColorDarkMode siagang/yareka backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Manna definisi gaya { $styleNumber } ampattantui warna teks kontrasna gannaki untu' mode singara', warna teks mode le'leng nipa'jaria battu ri anjo nilaia kontrasna tena nagannaki mange ri kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; naparalluang kurang-kurangna { $threshold }:1). { $suggestion ->
        [available] Sollanna kontrasna gannaki ri mode le'leng, tinggikangi kontras mode singara' (contona pattantui textColor="{ $lightColor }") yareka timpai warna mode le'leng (contona pattantui textColorDarkMode="{ $darkColor }").
       *[none] Sollanna kontrasna gannaki ri mode le'leng, tinggikangi kontras mode singara' yareka timpai warna nipa'jaria siagang textColorDarkMode.
    }

section-multiple-style-palettes = Se're bageang akkulle bawang ampilei se're <stylePalette>; ammake ia kala'busanga.

## Unique variants

variant-num-to-select-not-non-negative-integer = tena nakkulle nipattantu varian unik battu ri { $component } lanri numToSelect teai bilangan bulat teaya negatif.

variant-num-to-select-not-constant-number = tena nakkulle nipattantu varian unik battu ri { $component } lanri numToSelect teai bilangan tetap.

variant-with-replacement-not-constant-boolean = tena nakkulle nipattantu varian unik battu ri { $component } lanri withReplacement teai boolean tetap.

variant-select-weight-disables-unique = Varian unik untu' select nipa'jari tena punna nia' opsi ampattantua selectWeight yareka selectForVariants

variant-coprime-undetermined = tena nakkulle nipattantu varian unik battu ri { $component } lanri tena nakkulle nipattantu angkana coprime tuli sala.

variant-attribute-not-constant = tena nakkulle nipattantu varian unik battu ri { $component } lanri { $attribute } teai nilai tetap.

variant-attribute-not-number = tena nakkulle nipattantu varian unik battu ri { $component } lanri { $attribute } teai bilangan.

variant-attribute-wrong-type-for-sequence =
    tena nakkulle nipattantu varian unik battu ri { $component } tipe { $type } lanri { $attribute } teai { $expected ->
        [letters-combination] kombinasi huruf
        [math-expression] ungkapan matematika baji'
        [integer] bilangan bulat
       *[number] bilangan
    }.

variant-length-not-integer = tena nakkulle nipattantu varian unik battu ri { $component } lanri length teai bilangan bulat.

variant-sort-not-implemented = tenapa nipare' varian unik battu ri { $component } siagang sort

variant-exclude-combinations-not-implemented = tenapa nipare' varian unik battu ri { $component } siagang excludeCombinations

variant-math-exclude-not-implemented = tenapa nipare' varian unik battu ri { $component } tipe math siagang exclude

variant-non-constant-exclude-not-implemented = tenapa nipare' varian unik battu ri { $component } siagang exclude teaya tetap

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: tena nirurungang ri perender prefigure grafik; turunanna nilaloi.

prefigure-descendant-invalid-geometry = { $subject }: geometri tena nappantu' yareka tena nasukku'; turunanna nilaloi.

prefigure-curve-label-omitted = { $subject }: label tena nirurungang ri elemen kurva battua ri konversi; label nipela'.

prefigure-curve-unsupported-definition-type = { $subject }: tipe definisi fungsi kurva '{ $definitionType }' tena nirurungang; turunanna nilaloi.

prefigure-region-flip-functions-unsupported = { $subject }: atribut flipFunctions ri regionBetweenCurves tena nirurungang; turunanna nilaloi.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves anrurungangi bawang fungsi ana' tipe formula; turunanna nilaloi.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' tena nirurungang untu' { $labelKind ->
        [line-family] label golongang garis
       *[point] label titik
    }; ammake perataan bawaan PreFigure.

prefigure-fill-style-unsupported = { $subject }: gaya bone '{ $fillStyle }' tena nirurungang ri PreFigure; ammotere' mange ri bone padat.

prefigure-line-style-unknown = { $subject }: gaya garis '{ $lineStyle }' tena niasseng na nipela' battu ri assuluna PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: gaya tanra '{ $markerStyle }' nipalette' mange ri gaya 'diamond' battu ri PreFigure.

prefigure-marker-style-unsupported = { $subject }: gaya tanra '{ $markerStyle }' tena nirurungang ri PreFigure; ammake gaya bawaan.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` sala; target tena nakkulle nituju. Anotasi nipela'.

annotation-ref-multiple-targets = `<annotation>`: `ref` annuju ri jai target; ammake target uruna.

annotation-ref-outside-graph = `<annotation>`: `ref` sala; target nia' ri pantaranna grafik ampakemaea. Anotasi nipela'.

annotation-ref-unsupported-target = `<annotation>`: `ref` sala; target teai objek grafis nirurungang ri konversi prefigure. Anotasi nipela'.

annotation-text-missing = `<annotation>`: `text` tappela' yareka kosong; ampare' teks kosong.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Nigappa pattoli' anggulilinga.
       *[other] Nigappa pattoli' anggulilinga anrurungangi komponen `<{ $componentType }>`.
    }

reference-no-referent = Tena nia' acuan nigappa untu' referensi: `{ $reference }`

reference-multiple-referents = Nigappa jai acuan untu' referensi: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format atribut { $attribute } ri `<{ $componentType }>` sala.

children-invalid = Ana' `<{ $componentType }>` sala: nigappa ana' salaya: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Nilai `{ $value }` untu' atribut `{ $attribute }` sala, ammake nilai `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML versi { $version } tena nigappa.
       *[other] DoenetML versi { $version } tena nigappa. Ammotere' mange ri versi { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML sala: { $content }

parse-tag-missing-close-tag = DoenetML sala: Tag `{ $tag }` tena nia' tag pattongko'na. Nitayang nia' tag antongko' kalenna yareka tag `</{ $tagName }>`.

parse-tag-error = DoenetML sala: Nia' kasalang ri tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML sala: Atribut `{ $attribute }` kamma tappela' nilai.

parse-attribute-invalid = DoenetML sala: Atribut `{ $attribute }` sala

parse-attribute-value-invalid = DoenetML sala: Nilai atribut `{ $value }` sala

parse-attribute-value-quote-mismatch = DoenetML sala: Nilai atribut `{ $value }` sala. Tanra kutipna tena nasiratang. Kamma tappela'ki se're `{ $quote }`

parse-open-tag-name-missing = DoenetML sala: Nigappa tag tenaya nia' areng tagna, contona `<`

parse-tag-not-closed = DoenetML sala: Tag `{ $tag }` tenapa nitongko' (kamma tappela' `>`).

parse-self-closing-tag-name-missing = DoenetML sala: Nigappa tag tenaya nia' areng tagna `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML sala: Tag `{ $tag }` tenapa nitongko' (kamma tappela' `/>`).

parse-tag-invalid-attributes = DoenetML sala: Tag `{ $tag }` sala. Atributna akkulle sala.

parse-close-tag-name-missing = DoenetML sala: Nigappa tag pattongko' tenaya nia' areng tagna, contona `</`

parse-attribute-value-unquoted = Nilai atribut musti nialle siagang tanra kutip: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML sala: Nigappa tag pattongko' `{ $tag }`, mingka tena nia' tag passungke siratanna

parse-close-tag-mismatched = DoenetML sala: Tag pattongko' tena nasiratang. Nitayang `</{ $expected }>`. Nigappa `{ $found }`

parser-node-unconvertible = Tena nakkulle nipinra simpul { $node } a'jari simpul Dast.

## Names

name-attribute-invalid =
    Atribut name='{ $name }' sala. { $reason ->
        [characters] Areng akkulle bawang nia' huruf, angka, garis rawa, yareka tanra sambung.
       *[start] Areng musti appakkaramula siagang huruf.
    }

component-name-invalid-start = Areng komponen "{ $name }" sala. Areng musti appakkaramula siagang huruf.

## `<answer>` sugar

answer-video-watched-missing-video = Answer tipe videoWatched musti nia' atribut video

answer-video-watched-video-not-reference = Answer tipe videoWatched musti nia' atribut video rupa referensi

answer-name-not-single-text = Atribut name ri answer musti nia' tepa' se're ana' rupa teks

## Referencing another document

external-doenetml-recursion-limit = Tena nakkulle nialle DoenetML pantara' lanri jai dudu tingkat rekursi. Nia'ka referensi anggulilinga?

external-doenetml-unavailable = Tena nakkulle nialle DoenetML battu ri { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML nialleya battu ri { $attribute }="{ $uri }" sala: tena nasiratang siagang tipe komponen "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` le'ba'mi tappela'; pake `{ $to }`.
       *[other] [deprecation] Atribut `{ $from }` ri `<{ $component }>` le'ba'mi tappela'; pake `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` le'ba'mi tappela' na tanipaduli lanri `{ $to }` nipattantu tommi.
       *[other] [deprecation] Atribut `{ $from }` ri `<{ $component }>` le'ba'mi tappela' na tanipaduli lanri `{ $to }` nipattantu tommi.
    }

deprecated-attribute-ignored = [deprecation] Atribut `{ $attribute }` ri `<{ $component }>` le'ba'mi tappela' na tanipaduli.

deprecated-attribute-to-child = [deprecation] Atribut `{ $attribute }` ri `<{ $component }>` le'ba'mi tappela'; pake bawang ana' `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Nilai `{ $value }` battu ri atribut `{ $attribute }` ri `<{ $component }>` le'ba'mi tappela'; pake `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` akkulle bawang ampa'jari jamak basa Inggris, jari teksna niboli' kamma anjo ri dokumen nitulisia ri { $locale }. Tulisi' bentu' jamakna langsung, yareka pattantui siagang atribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elemen `<{ $tag }>` teai elemen Doenet niassenga.

schema-element-not-allowed-at-root = Elemen `<{ $tag }>` tena nipa'biang ri aka'na dokumen.

schema-element-not-allowed-inside = Elemen `<{ $tag }>` tena nipa'biang ri lalanna `<{ $parent }>`.

schema-attribute-unrecognized = Elemen `<{ $tag }>` tena nia' atribut niarenga `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribut `{ $attribute }` ri elemen `<{ $tag }>` musti rupa daftar tunggala' isina se're battu ri: { $allowed }
       *[other] Atribut `{ $attribute }` ri elemen `<{ $tag }>` musti se're battu ri: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Areng varian untu' select sala. Areng varian { $variantName } ammumba ri { $numOptions } opsi mingka jaina nipilea { $numToSelect }.

select-variant-name-without-options = Nia' varian nipattantu untu' select mingka tena nia' opsi untu' areng varian akkullea: { $variantName }.

select-variant-name-not-possible = Areng varian { $variantName } nipattantua untu' select teai areng varian akkullea.

select-too-few-options = Tena nakkulle nipilei { $numToSelect } komponen battu ri { $numOptions } bawang.

select-from-sequence-too-few-values = Tena nakkulle nipilei { $numToSelect } nilai battu ri barisan la'buna { $length }.

select-from-sequence-indices-count-mismatch = Jaina indeks nipattantua untu' select musti sangkamma jaina nipilea

select-from-sequence-indices-not-integers = Ngaseng indeks nipattantua untu' select musti rupa bilangan bulat

select-from-sequence-index-excluded = Indeks nipattantua untu' selectfromsequence antamai ri nipasalaya

select-from-sequence-indices-excluded-combination = Indeks nipattantua untu' selectfromsequence ampare' kombinasi nipasalaya

select-from-sequence-coprime-not-positive-integers = Tena nakkulle nipilei kombinasi siprima lanri nipileya teai bilangan bulat positif.

select-from-sequence-coprime-common-factor = Tena nakkulle nipilei bilangan siprima. Ngaseng nilai akkullea nia' faktor passamanna. (Nilai "from" yareka "to" nipattantua musti siprima siagang "step".)

select-from-sequence-coprime-single-number = Tena nakkulle nipilei kombinasi siprima battu ri se're bilangan kalenna teaya 1.

select-from-sequence-excluded-too-many-combinations = Lebbi na 70% kombinasi nipasala ri selectFromSequence

select-from-sequence-coprime-none-found = Tena akkulle nipilei bilangan siprima. Ngaseng nilai akkullea nia' faktor passamanna.

select-from-sequence-too-few-unique-values = Tena nakkulle nipilei { $numToSelect } nilai maraeng battu ri barisan la'buna { $numPossibleValues }

select-prime-numbers-too-few-values = Tena nakkulle nipilei { $numToSelect } nilai battu ri daftar bilangan prima la'buna { $numValues }

select-prime-numbers-values-count-mismatch = Jaina nilai nipattantua untu' select musti sangkamma jaina nipilea

select-prime-numbers-values-not-prime = Ngaseng nilai nipattantua untu' select prime number musti nia' ri daftar bilangan prima

select-prime-numbers-values-excluded-combination = Nilai nipattantua untu' selectPrimeNumbers ampare' kombinasi nipasalaya

select-prime-numbers-excluded-too-many-combinations = Lebbi na 70% kombinasi nipasala ri selectPrimeNumbers

select-random-combination-fluke = Lanri kabatulang jarang dudu, kombinasi nilai acak tena akkulle nipilei

select-random-value-fluke = Lanri kabatulang jarang dudu, nilai acak tena akkulle nipilei

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] Anne `<{ $component }>` tena nipaccinikang lanri nia'i ri lalanna matematika mingka teai `inline`. Tambai `inline` sollanna a'jari daftar naung, akkullea antama ri lalanna ungkapan.
        [expanded] Anne `<{ $component }>` tena nipaccinikang lanri nia'i ri lalanna matematika na `expanded`. Pela'i `expanded`; kotak jaia barisna tena nakkulle antama ri lalanna ungkapan.
        [on-graph] Anne `<{ $component }>` tena nipaccinikang lanri nia'i ri lalanna matematika nipare'a ri grafik, tenaya nia' tampa'na untu' masukan.
       *[relative-width] Anne `<{ $component }>` tena nipaccinikang lanri nia'i ri lalanna matematika na sangkara'na relatif. Sarei sangkara'na ri satuan absolut, contona `px`.
    }
