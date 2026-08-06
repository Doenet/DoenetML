# Minangkabau diagnostics. Translated from `locales/en/diagnostics.ftl`, which
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
# Minangkabau marks no number on the noun, so a counted message whose only
# English difference is the noun's number renders one string here and the
# select is dropped. The count still arrives and is still formatted.


## `<lineSegment>`

# No select: «diabaikan» does not agree with what is ignored, and the list
# carries no number of its own.
line-segment-attributes-ignored-with-endpoints = { $attributes } diabaikan bilo duo ujuang alah ditantukan

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } diabaikan bilo ciek ujuang jo titiak tangah alah ditantukan kaduonyo

line-segment-midpoint-offset-without-midpoint = midpointOffset indak baguno tanpa titiak tangah

## `<line>`

line-points-undetermined-dimensions = Garih nan malalui titiak nan dimensinyo indak tantu.

line-points-too-few-dimensions = Garih harus malalui titiak nan padoso duo dimensi.

line-points-depend-on-variables = Garih malalui titiak nan bagantuang ka variabel: { $variables }.

line-equation-invalid-format = Format persamaan garih nan indak sah pado variabel { $variable1 } jo { $variable2 }.

## `<ray>`

ray-overprescribed-through = Sinar ditantukan dek through, endpoint jo direction.  through nan ditantukan diabaikan.

ray-dimension-mismatch = numDimensions indak cocok di sinar.

## `<vector>`

vector-overprescribed-head = Vektor ditantukan dek head, tail jo displacement.  head nan ditantukan diabaikan.

vector-dimension-mismatch = numDimensions indak cocok di vektor.

## Attracting and constraining

attract-to-without-nearest-point = Indak dapek manarik ka `<{ $component }>` karano inyo indak padoso variabel keadaan nearestPoint.

constrain-to-without-nearest-point = Indak dapek maikek ka `<{ $component }>` karano inyo indak padoso variabel keadaan nearestPoint.

constrain-to-interior-without-nearest-point = Indak dapek maikek ka dalam `<{ $component }>` karano inyo indak padoso variabel keadaan nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition diabaikan pado choiceInput nan indak inline

## Ordering children by index

choice-input-indices-count-mismatch = Indeks nan ditantukan untuak choiceInput diabaikan karano jumlah indeks indak cocok jo jumlah anak piliahan.

pretzel-indices-count-mismatch = Indeks nan ditantukan untuak problem diabaikan karano jumlah indeks indak cocok jo jumlah anak problem.

shuffle-indices-count-mismatch = Indeks nan ditantukan untuak shuffle diabaikan karano jumlah indeks indak cocok jo jumlah komponen.

indices-ignored-out-of-range = Indeks nan ditantukan untuak { $component } diabaikan karano ado indeks nan lua jangkauan.

pretzel-indices-repeated = Indeks nan ditantukan untuak pretzel diabaikan karano ado indeks nan baulang.

pretzel-circuit-first-index = Indeks nan ditantukan untuak pretzel di mode circuit diabaikan karano indeks partamo harus 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Supayo `<{ $component }>` bajalan jo anak string, atribut `type` harus ditantukan.

invalid-type-defaulting-to-math = type { $type } indak sah untuak komponen { $component }. Harus salah ciek dari math, text, number, atau boolean. Mamakai math.

string-not-valid-component-to-arrange = String "{ $value }" bukan komponen nan sah untuak { $component }. Diabaikan.

## Types and variables

invalid-type-defaulting-to-number = type { $type } indak sah, type diatur ka number.

invalid-variable-value = Nilai variabel nan indak sah: `{ $value }`

## Variants

variant-index-must-be-number = Indeks varian { $index } harus angko

variant-index-must-be-integer = Indeks varian { $index } harus bilangan bulek

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` alun diterapkan untuak ukuran mutlak. Leba diatur jadi relatif.

side-by-side-absolute-margins = `<{ $component }>` alun diterapkan untuak ukuran mutlak. Margin diatur jadi relatif.

side-by-side-no-block-child = `<{ $component }>` indak sah: inyo harus padoso ciek anak block.

## `<label>`

label-for-ignored-on-graphical = Atribut `for` pado `<label>` grafis diabaikan.

label-for-must-resolve-to-one = Atribut `for` pado `<label>` harus manunjuak tapek ka ciek komponen.

label-for-unresolved = Atribut `for` pado `<label>` indak dapek manunjuak ka komponen.

label-for-answer-with-authored-inputs = Atribut `for` pado `<label>` manunjuak ka `<answer>` nan padoso input nan ditulis dek panulis; tunjuak input tu langsuang.

label-for-answer-without-input = Atribut `for` pado `<label>` manunjuak ka `<answer>` nan indak padoso input untuak dilabeli.

label-for-must-reference-input-or-answer = Atribut `for` pado `<label>` harus manunjuak ka input atau ka answer.

## Accessibility

accessibility-short-description-or-decorative = Untuak aksesibilitas, `<{ $component }>` harus padoso katarangan singkek atau ditantukan sabagai hiasan.

accessibility-video-short-description = Untuak aksesibilitas, `<video>` harus padoso katarangan singkek.

accessibility-input-short-description-or-label = Untuak aksesibilitas, `<{ $component }>` harus padoso katarangan singkek atau label.

accessibility-answer-input-short-description-or-label = Untuak aksesibilitas, `<answer>` nan mambuek input harus padoso katarangan singkek atau label.

accessibility-short-description-contains-math = Katarangan singkek indak buliah maisi komponen matematika saroman `<{ $component }>`. Tuliskan matematikanyo jo kato.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Kontras { $colorName } kurang untuak teks judul bagian (mode kalam) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mambutuahkan padoso { $threshold }:1).
       *[other] Kontras { $colorName } kurang untuak teks judul bagian ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mambutuahkan padoso { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` nan malalui { $count } titiak alun diterapkan bilo titiaknyo indak padoso nilai angko.

circle-too-many-through-points = Indak dapek maituang bulatan nan malalui labiah dari 3 titiak.

circle-overprescribed-radius-center-points = Indak dapek maituang bulatan nan ditantukan jari-jari, pusek jo titiak nan dilalui.

circle-center-with-multiple-points = Indak dapek maituang bulatan nan ditantukan puseknyo tapi malalui labiah dari 1 titiak.

circle-radius-too-small = Indak dapek maituang bulatan: karano jarak antaro duo titiak tu { $distance }, jari-jari { $radius } nan ditantukan talalu ketek.

circle-radius-with-many-points = Indak dapek mambuek bulatan nan malalui labiah dari duo titiak jo jari-jari nan ditantukan.

circle-invalid-center-or-through-points = Pusek atau titiak nan dilalui bulatan indak sah.

circle-radius-center-with-multiple-points = Indak dapek maituang jari-jari bulatan nan ditantukan puseknyo tapi malalui labiah dari 1 titiak.

circle-change-radius-non-numerical = Indak dapek maubah jari-jari bulatan nan malalui titiak nan indak baangko

circle-radius-with-points-non-numerical = Indak dapek mambuek bulatan nan malalui labiah dari ciek titiak jo jari-jari nan ditantukan bilo indak ado nilai angko.

circle-change-center-non-numerical = Maubah pusek bulatan nan malalui titiak nan indak padoso nilai angko alun diterapkan.

## `<function>`

# English's two counts multiply out to four sentences; Minangkabau has one,
# because «interval» and «input» do not change for number. Both selects are
# dropped and both counts still arrive.
function-domain-insufficient-dimensions = Dimensi domain untuak fungsi kurang. Domain padoso { $intervals } interval tapi fungsi padoso { $inputs } input.

function-domain-invalid-format = Format domain untuak fungsi indak sah.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Nilai paliang gadang fungsi nan indak baangko diabaikan.
        [minimum] Nilai paliang ketek fungsi nan indak baangko diabaikan.
        [extremum] Ekstremum fungsi nan indak baangko diabaikan.
        [point] Titiak fungsi nan indak baangko diabaikan.
        [slope] Kamiriangan fungsi nan indak baangko diabaikan.
       *[other] { $type } fungsi nan indak baangko diabaikan.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Nilai paliang gadang fungsi nan kosong diabaikan.
        [minimum] Nilai paliang ketek fungsi nan kosong diabaikan.
        [extremum] Ekstremum fungsi nan kosong diabaikan.
        [point] Titiak fungsi nan kosong diabaikan.
       *[other] { $type } fungsi nan kosong diabaikan.
    }

function-points-too-close = Fungsi maisi duo titiak nan tampeknyo talalu dakek. Fungsi indak dapek dibateh.

# Both selects dropped, for the reason above.
function-iterates-input-output-mismatch = Iterasi fungsi hanyo mungkin bilo jumlah input samo jo jumlah output. Fungsi ko padoso { $inputs } input jo { $outputs } output.

## `<sequence>`

sequence-invalid-length = Panjang sequence indak sah.  Harus bilangan bulek nan indak negatif.

sequence-invalid-step = step sequence indak sah.  Harus angko untuak sequence type { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" sequence angko indak sah.  Harus angko.

sequence-invalid-endpoint-letters = "{ $attribute }" sequence huruf indak sah.  Harus kombinasi huruf.

sequence-invalid-endpoint = "{ $attribute }" sequence indak sah.

select-from-sequence-coprime-not-numbers = coprime diabaikan karano nan dipiliah bukan angko

select-from-sequence-coprime-with-exclude-combinations = coprime diabaikan karano excludeCombinations ditantukan

## Resolving a `target`

target-not-found = target indak sah untuak `<{ $source }>`: target indak basuo.

target-state-variable-not-found = target indak sah untuak `<{ $source }>`: variabel keadaan nan banamo "{ $property }" indak basuo pado `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Variabel `<odeSystem>` harus balain jo variabel bebas.

ode-system-duplicate-variable-names = Indak dapek mambateh fungsi RHS ODE nan namo variabel bagantuangnyo samo.

ode-system-rhs-function-error = Indak dapek mambateh fungsi RHS ODE.  Ado kasalahan mambuek fungsi mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Indak dapek mambateh sudut antaro { $count } garih

angle-invalid-through-point = Titiak nan indak sah di through `<angle>`

parabola-vertex-too-many-points = Parabola nan padoso puncak tapi malalui labiah dari 1 titiak alun diterapkan.

parabola-too-many-points = Parabola nan malalui labiah dari 3 titiak alun diterapkan.

intersection-too-many-items = Parpotongan untuak labiah dari duo bandanyo alun diterapkan

## Other math components

ionic-compound-not-two-ions = Sanyawa ionik untuak salain duo ion alun diterapkan.

ionic-compound-needs-cation-and-anion = Sanyawa ionik hanyo diterapkan untuak ciek kation jo ciek anion.

solve-equations-cannot-evaluate = Indak dapek manyalasaikan persamaan karano persamaan indak dapek dinilai: { $equation }

math-operators-operand-number-required = operandNumber harus ditantukan bilo maambiak operand matematika.

eigen-decomposition-failed = Indak dapek maituang eigenvalue matriks

## `<matchesPattern>`

# No select: the parameter list carries no number that the noun would show.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: parameter { $parameters } indak muncua di pattern, jadi inyo salalu cocok jo nan kosong.

## `<graph>`

graph-grid-invalid = `<graph>`: indak mangarati grid="{ $grid }". Harus none, medium, dense, atau duo angko positif nan dipisah spasi, saroman grid="1 0.5". Indak ado grid nan digambar.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" indak didukuang di renderer prefigure; mamakai parilaku posisi suok.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" indak didukuang di renderer prefigure; mamakai parilaku posisi ateh.

prefigure-invalid-axis-bounds = `<graph>`: bateh sumbu indak sah untuak konversi prefigure; mamakai bbox baku (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: leba indak sah untuak konversi prefigure; mamakai leba diagram baku 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio indak sah untuak konversi prefigure; mamakai aspect ratio baku 1.

prefigure-grid-spacing-too-fine = `<graph>`: jarak grid talalu rapek untuak bateh sumbu; grid indak digambar di renderer prefigure.

prefigure-annotations-not-rendered = `<graph>`: annotation indak digambar bilo indak mamakai renderer PreFigure.

multiple-annotations-children = Banyak anak `<annotations>` basuo di `<graph>`; sadonyo diabaikan salain nan tarakhia.

## Referring to other components

copy-unrecognized-component-type = Indak dapek maambiak atau manyalin jinih komponen nan indak dikana: { $type }.

copy-prop-not-found = Prop { $property } indak basuo pado komponen jinih { $component }

collect-no-source = Indak ado source nan basuo untuak collect.

collect-invalid-component-type = Indak dapek mangumpuan komponen jinih `<{ $component }>` karano jinih komponen indak sah.

reference-index-unavailable = Indak dapek marujuak indeks `{ $reference }`

## `<callAction>`

component-action-unavailable = Indak dapek mamanggia { $action } pado komponen `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Bantuak data indak sah.  Panjang barih indak samo. Basuo di componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data padoso namo kolom nan samo.  Basuo di componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data kurang namo kolom.  Basuo di componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Award jawaban ko badasarkan jawaban nan dikirim dek answer tag surang, dan ko ka mambaok parilaku nan indak diharokkan.

answer-max-num-attempts-in-section-wide-check-work = Maatur `maxNumAttempts` pado `<answer>` di dalam wadah nan padoso `sectionWideCheckWork` indak baguno, karano wadah tu nan mangatua jumlah cubo. Atur `maxNumAttempts` pado wadahnyo.

nested-section-wide-check-work-max-num-attempts = Maatur `maxNumAttempts` pado wadah nan padoso `sectionWideCheckWork` nan barado di dalam wadah lain nan padoso `sectionWideCheckWork` indak baguno, karano wadah nan di lua nan mangatua jumlah cubo. Atur `maxNumAttempts` pado wadah nan di lua.

# No select: «atribut» is the same word for one and for many.
answer-attributes-need-symbolic-equality = Atribut { $attributes } indak ka baguno tanpa symbolicEquality diatur.

answer-invalid-type = Jinih jawaban nan indak sah: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Karano komponen `<{ $component }>` indak banamo, inyo indak dapek dipakai untuak atribut module

module-attribute-name-already-defined = Komponen `<{ $component } name="{ $name }">` indak dapek dipakai sabagai atribut module karano jinih komponen `<module>` alah padoso atribut "{ $name }".

conditional-content-condition-ignored = Atribut `condition` diabaikan pado komponen `<conditionalContent>` nan padoso anak case atau else.

slider-markers-type-mismatch = Jinih marker indak cocok jo jinih slider.

pretzel-problem-needs-statement-and-answer = Pretzel indak sah: satiok `<problem>` harus maisi ciek `<statement>` jo ciek `<answer>`.

pretzel-circuit-first-problem-distractor = Pretzel indak sah: di mode="circuit", `<problem>` partamo indak buliah distractor.

## Attribute values

# No select: «nilai» is the same word for one and for many.
attribute-invalid-values = Nilai { $values } indak sah untuak atribut `{ $attribute }`; diabaikan.

attribute-must-be-references = Nilai `{ $value }` indak sah untuak atribut `{ $attribute }`. Atribut harus disusun dari rujuakan nan mulai jo `$`.

math-input-invalid-function-names = <mathInput>: namo fungsi nan indak sah di { $attribute } diabaikan: { $names }. Satiok namo harus padoso 2 karakter (huruf atau tando sambuang); buliah diikuti sufiks `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Jinih komponen nan indak sah: `<{ $componentType }>`

attribute-repeated = Atribut { $attribute } indak buliah diulang.

attribute-invalid-for-component = Atribut "{ $attribute }" indak sah untuak komponen jinih `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Kontras batasan gaya { $styleNumber } kurang untuak { $context ->
        [text-on-background] warno teks malawan warno latar
        [high-contrast] warno kontras tinggi malawan kanvas
        [line] warno garih malawan kanvas
        [marker] warno marker malawan kanvas
       *[text-on-canvas] warno teks malawan kanvas
    }{ $mode ->
        [dark] { " (mode kalam)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mambutuahkan padoso { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Walaupun batasan gaya { $styleNumber } padoso warno nan ditantukan jo kontras nan cukuik untuak mode tarang, kontras warno teks malawan warno latar kurang pado warno nan diambiak untuak mode kalam ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mambutuahkan padoso { $threshold }:1). { $suggestion ->
        [available] Supayo kontrasnyo cukuik di mode kalam, tambah kontras mode tarang (contoh, atur { $lightAttribute }="{ $lightColor }") atau ganti warno mode kalam (contoh, atur { $darkAttribute }="{ $darkColor }").
       *[none] Supayo kontrasnyo cukuik di mode kalam, tambah kontras mode tarang atau ganti warno nan diambiak jo textColorDarkMode dan/atau backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Walaupun batasan gaya { $styleNumber } padoso warno teks nan ditantukan jo kontras nan cukuik untuak mode tarang, kontras warno teks nan diambiak untuak mode kalam kurang malawan kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mambutuahkan padoso { $threshold }:1). { $suggestion ->
        [available] Supayo kontrasnyo cukuik di mode kalam, tambah kontras mode tarang (contoh, atur textColor="{ $lightColor }") atau ganti warno mode kalam (contoh, atur textColorDarkMode="{ $darkColor }").
       *[none] Supayo kontrasnyo cukuik di mode kalam, tambah kontras mode tarang atau ganti warno nan diambiak jo textColorDarkMode.
    }

section-multiple-style-palettes = Ciek bagian hanyo buliah mamiliah ciek <stylePalette>; mamakai nan tarakhia.

## Unique variants

variant-num-to-select-not-non-negative-integer = indak dapek manantukan varian tunggal { $component } karano numToSelect bukan bilangan bulek nan indak negatif.

variant-num-to-select-not-constant-number = indak dapek manantukan varian tunggal { $component } karano numToSelect bukan angko tetap.

variant-with-replacement-not-constant-boolean = indak dapek manantukan varian tunggal { $component } karano withReplacement bukan boolean tetap.

variant-select-weight-disables-unique = Varian tunggal untuak select dimatikan bilo ado opsi nan ditantukan selectWeight atau selectForVariants

variant-coprime-undetermined = indak dapek manantukan varian tunggal { $component } karano indak dapek manantukan coprime salalu false.

variant-attribute-not-constant = indak dapek manantukan varian tunggal { $component } karano { $attribute } indak tetap.

variant-attribute-not-number = indak dapek manantukan varian tunggal { $component } karano { $attribute } bukan angko.

variant-attribute-wrong-type-for-sequence =
    indak dapek manantukan varian tunggal { $component } jinih { $type } karano { $attribute } bukan { $expected ->
        [letters-combination] kombinasi huruf
        [math-expression] ungkapan matematika nan sah
        [integer] bilangan bulek
       *[number] angko
    }.

variant-length-not-integer = indak dapek manantukan varian tunggal { $component } karano length bukan bilangan bulek.

variant-sort-not-implemented = varian tunggal { $component } nan padoso sort alun diterapkan

variant-exclude-combinations-not-implemented = varian tunggal { $component } nan padoso excludeCombinations alun diterapkan

variant-math-exclude-not-implemented = varian tunggal { $component } jinih math nan padoso exclude alun diterapkan

variant-non-constant-exclude-not-implemented = varian tunggal { $component } nan padoso exclude indak tetap alun diterapkan

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: indak didukuang di renderer prefigure graph; katurunan dilewati.

prefigure-descendant-invalid-geometry = { $subject }: geometrinyo indak tabateh atau indak lengkap; katurunan dilewati.

prefigure-curve-label-omitted = { $subject }: label indak didukuang pado elemen lengkuang nan dikonversi; label diabaikan.

prefigure-curve-unsupported-definition-type = { $subject }: jinih batasan fungsi lengkuang '{ $definitionType }' indak didukuang; katurunan dilewati.

prefigure-region-flip-functions-unsupported = { $subject }: atribut flipFunctions pado regionBetweenCurves indak didukuang; katurunan dilewati.

prefigure-region-non-formula-child = { $subject }: hanyo anak fungsi jinih formula nan didukuang pado regionBetweenCurves; katurunan dilewati.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' indak didukuang untuak { $labelKind ->
        [line-family] label kaluargo garih
       *[point] label titiak
    }; mamakai perataan baku PreFigure.

prefigure-fill-style-unsupported = { $subject }: gaya isi '{ $fillStyle }' indak didukuang dek PreFigure; baliak ka isi padek.

prefigure-line-style-unknown = { $subject }: gaya garih '{ $lineStyle }' indak dikana, diabaikan dari output PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: gaya marker '{ $markerStyle }' dipetakan ka gaya 'diamond' PreFigure.

prefigure-marker-style-unsupported = { $subject }: gaya marker '{ $markerStyle }' indak didukuang dek PreFigure; mamakai gaya baku.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` indak sah; target indak dapek ditunjuak. Annotation diabaikan.

annotation-ref-multiple-targets = `<annotation>`: `ref` manunjuak ka banyak target; mamakai target partamo.

annotation-ref-outside-graph = `<annotation>`: `ref` indak sah; target barado di lua graph nan maisinyo. Annotation diabaikan.

annotation-ref-unsupported-target = `<annotation>`: `ref` indak sah; target bukan objek grafis nan didukuang di konversi prefigure. Annotation diabaikan.

annotation-text-missing = `<annotation>`: `text` kurang atau kosong; mangaluakan teks kosong.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Basuo katagantuangan nan bakuliliang.
       *[other] Basuo katagantuangan nan bakuliliang nan malibatkan komponen `<{ $componentType }>`.
    }

reference-no-referent = Indak basuo nan ditunjuak dek rujuakan: `{ $reference }`

reference-multiple-referents = Banyak nan ditunjuak dek rujuakan: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format atribut { $attribute } pado `<{ $componentType }>` indak sah.

children-invalid = Anak `<{ $componentType }>` indak sah: basuo anak nan indak sah: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Nilai `{ $value }` indak sah untuak atribut `{ $attribute }`, mamakai nilai `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Versi DoenetML { $version } indak basuo.
       *[other] Versi DoenetML { $version } indak basuo. Baliak ka versi { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML indak sah: { $content }

parse-tag-missing-close-tag = DoenetML indak sah: Tag `{ $tag }` indak padoso tag panutuik. Diharokkan tag nan manutuik surang atau tag `</{ $tagName }>`.

parse-tag-error = DoenetML indak sah: Ado kasalahan di tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML indak sah: Atribut `{ $attribute }` nan indak sah nampak kurang nilai.

parse-attribute-invalid = DoenetML indak sah: Atribut `{ $attribute }` indak sah

parse-attribute-value-invalid = DoenetML indak sah: Nilai atribut `{ $value }` indak sah

parse-attribute-value-quote-mismatch = DoenetML indak sah: Nilai atribut `{ $value }` indak sah. Tando kutiknyo indak cocok. Nampak kurang ciek `{ $quote }`

parse-open-tag-name-missing = DoenetML indak sah: Basuo tag nan indak banamo, contoh `<`

parse-tag-not-closed = DoenetML indak sah: Tag `{ $tag }` indak ditutuik (nampak kurang `>`).

parse-self-closing-tag-name-missing = DoenetML indak sah: Basuo tag nan indak banamo `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML indak sah: Tag `{ $tag }` indak ditutuik (nampak kurang `/>`).

parse-tag-invalid-attributes = DoenetML indak sah: Tag `{ $tag }` indak sah. Mungkin atributnyo indak batua.

parse-close-tag-name-missing = DoenetML indak sah: Basuo tag panutuik nan indak banamo, contoh `</`

parse-attribute-value-unquoted = Nilai atribut harus dilatakkan di dalam tando kutik: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML indak sah: Basuo tag panutuik `{ $tag }`, tapi indak ado tag pambukak nan cocok

parse-close-tag-mismatched = DoenetML indak sah: Tag panutuik indak cocok. Diharokkan `</{ $expected }>`. Basuo `{ $found }`

parser-node-unconvertible = Node { $node } indak dapek dikonversi jadi node Dast.

## Names

name-attribute-invalid =
    Atribut name='{ $name }' indak sah. { $reason ->
        [characters] Namo hanyo buliah maisi huruf, angko, garih bawah atau tando sambuang.
       *[start] Namo harus mulai jo huruf.
    }

component-name-invalid-start = Namo komponen "{ $name }" indak sah. Namo harus mulai jo huruf.

## `<answer>` sugar

answer-video-watched-missing-video = Answer nan type videoWatched harus padoso atribut video

answer-video-watched-video-not-reference = Answer nan type videoWatched harus padoso atribut video nan barupo rujuakan

answer-name-not-single-text = Atribut name pado answer harus padoso ciek anak text sajo

## Referencing another document

external-doenetml-recursion-limit = Indak dapek maambiak DoenetML dari lua karano tingkek pangulangannyo talalu banyak. Adokah rujuakan nan bakuliliang?

external-doenetml-unavailable = Indak dapek maambiak DoenetML dari { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML nan diambiak dari { $attribute }="{ $uri }" indak sah: inyo indak cocok jo jinih komponen "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` indak dipakai lai; pakai `{ $to }`.
       *[other] [deprecation] Atribut `{ $from }` pado `<{ $component }>` indak dipakai lai; pakai `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` indak dipakai lai jo diabaikan karano `{ $to }` juo ditantukan.
       *[other] [deprecation] Atribut `{ $from }` pado `<{ $component }>` indak dipakai lai jo diabaikan karano `{ $to }` juo ditantukan.
    }

deprecated-attribute-ignored = [deprecation] Atribut `{ $attribute }` pado `<{ $component }>` indak dipakai lai jo diabaikan.

deprecated-attribute-to-child = [deprecation] Atribut `{ $attribute }` pado `<{ $component }>` indak dipakai lai; pakai anak `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Nilai `{ $value }` pado atribut `{ $attribute }` di `<{ $component }>` indak dipakai lai; pakai `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` hanyo dapek mambuek jamak bahaso Inggirih, jadi teksnyo indak barubah di dokumen nan ditulis jo { $locale }. Tuliskan langsuang bantuak jamaknyo, atau atur jo atribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elemen `<{ $tag }>` bukan elemen Doenet nan dikana.

schema-element-not-allowed-at-root = Elemen `<{ $tag }>` indak dibuliahkan di akar dokumen.

schema-element-not-allowed-inside = Elemen `<{ $tag }>` indak dibuliahkan di dalam `<{ $parent }>`.

schema-attribute-unrecognized = Elemen `<{ $tag }>` indak padoso atribut nan banamo `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribut `{ $attribute }` pado elemen `<{ $tag }>` harus barupo daftar nan satiok isinyo salah ciek dari: { $allowed }
       *[other] Atribut `{ $attribute }` pado elemen `<{ $tag }>` harus salah ciek dari: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Namo varian indak sah untuak select.  Namo varian { $variantName } muncua di { $numOptions } opsi tapi jumlah nan ka dipiliah { $numToSelect }.

select-variant-name-without-options = Ado varian nan ditantukan untuak select tapi indak ado opsi nan ditantukan untuak namo varian nan mungkin: { $variantName }.

select-variant-name-not-possible = Namo varian { $variantName } nan ditantukan untuak select bukan namo varian nan mungkin.

select-too-few-options = Indak dapek mamiliah { $numToSelect } komponen dari { $numOptions } sajo.

select-from-sequence-too-few-values = Indak dapek mamiliah { $numToSelect } nilai dari sequence nan panjangnyo { $length }.

select-from-sequence-indices-count-mismatch = Jumlah indeks nan ditantukan untuak select harus cocok jo jumlah nan ka dipiliah

select-from-sequence-indices-not-integers = Sadonyo indeks nan ditantukan untuak select harus bilangan bulek

select-from-sequence-index-excluded = Indeks selectfromsequence nan ditantukan tu dikaluakan

select-from-sequence-indices-excluded-combination = Indeks selectfromsequence nan ditantukan tu kombinasi nan dikaluakan

select-from-sequence-coprime-not-positive-integers = Indak dapek mamiliah kombinasi coprime karano nan dipiliah bukan bilangan bulek positif.

select-from-sequence-coprime-common-factor = Indak dapek mamiliah angko coprime. Sadonyo nilai nan mungkin padoso faktor nan samo. (Nilai "from" atau "to" nan ditantukan harus coprime jo "step".)

select-from-sequence-coprime-single-number = Indak dapek mamiliah kombinasi coprime dari ciek angko nan bukan 1.

select-from-sequence-excluded-too-many-combinations = Labiah dari 70% kombinasi dikaluakan di selectFromSequence

select-from-sequence-coprime-none-found = Indak dapek mamiliah angko coprime. Sadonyo nilai nan mungkin padoso faktor nan samo.

select-from-sequence-too-few-unique-values = Indak dapek mamiliah { $numToSelect } nilai tunggal dari sequence nan panjangnyo { $numPossibleValues }

select-prime-numbers-too-few-values = Indak dapek mamiliah { $numToSelect } nilai dari daftar prima nan panjangnyo { $numValues }

select-prime-numbers-values-count-mismatch = Jumlah nilai nan ditantukan untuak select harus cocok jo jumlah nan ka dipiliah

select-prime-numbers-values-not-prime = Sadonyo nilai nan ditantukan untuak select prime number harus ado di daftar prima

select-prime-numbers-values-excluded-combination = Nilai selectPrimeNumbers nan ditantukan tu kombinasi nan dikaluakan

select-prime-numbers-excluded-too-many-combinations = Labiah dari 70% kombinasi dikaluakan di selectPrimeNumbers

select-random-combination-fluke = Karano untuang nan sangaik jarang, indak dapek mamiliah kombinasi nilai acak

select-random-value-fluke = Karano untuang nan sangaik jarang, indak dapek mamiliah nilai acak
