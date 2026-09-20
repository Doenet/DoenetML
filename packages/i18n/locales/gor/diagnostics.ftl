# Gorontalo (Bahasa Hulontalo) diagnostics. Translated from
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
# **Orthography: the Latin practice in current use**, no diacritics, the
# glottal stop written `'` only where a word would otherwise be ambiguous;
# `chrome.ftl`'s header sets it out in full.
#
# **This file is a Gorontalo frame around Indonesian nouns**, and the frames
# are worth reading before the sentences, because a dozen of them carry the
# whole file:
#
#     … diila pohutuwolo      … is not acted on   (see below)
#     Diila mowali …          cannot …
#     … musi …                must …
#     … u diila banari        invalid …
#     Dipo pilohutu …         has not yet been done …
#     diila iloontonga        not found / not seen
#     diila motu'ude          does not match
#     sababu …                because …
#     diila o pengaruh        has no effect
#     Diila woluwo …          there is no …
#     … ma woluwo             … is specified / is already there
#
# **Two of those are paraphrases and are declared as such**, because Gorontalo
# words for them are not something this seed can reach. «diila pohutuwolo» is
# literally *is not acted on*, built from «mohutu» (to do); it stands
# throughout for English's *is ignored*, and it is used everywhere rather than
# varied, so that a speaker who has a better word changes one string and finds
# every site. «… ma woluwo» is literally *is already there*, and stands for
# English's *is specified*. Neither is a coinage; both are ordinary Gorontalo
# saying something slightly wider than the English does.
#
# **Register.** Indonesian for the technical nouns — `atribut`, `komponen`,
# `nilai`, `variabel`, `titik`, `garis`, `lingkaran`, `fungsi`, `dimensi`,
# `indeks`, `referensi`, `versi`, `format`, `dokumen` — declared as a loan
# register in `chrome.ftl`'s header, with a Gorontalo frame around them.
# Nothing here is a coinage, and no Indonesian word here has been respelled to
# look like a Gorontalo loan.
#
# **Plural.** Gorontalo leaves a noun unmarked after a numeral, so every
# `[one]`/`[other]` fork in the English collapses to a single `*[other]`
# branch. One message keeps an explicit `[1]` literal, because English forks
# there on *one output* against *two outputs* and the distinction is about the
# shape of the function rather than about agreement; Fluent matches a numeric
# literal against the number itself, before any plural rule, so it stays
# selectable.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } diila pohutuwolo wonu dulota titik ujung ma woluwo

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } diila pohutuwolo wonu titik ujung wawu titik tengah ma woluwo pe'enta

line-segment-midpoint-offset-without-midpoint = midpointOffset diila o pengaruh wonu diila woluwo titik tengah

## `<line>`

line-points-undetermined-dimensions = Garis mo'otalu titik u dimensina diila mowali otawa.

line-points-too-few-dimensions = Garis musi mo'otalu titik u o dimensi palingu ngoidi dulo.

line-points-depend-on-variables = Garis mo'otalu titik u modepitayi variabel: { $variables }.

line-equation-invalid-format = Format lo persamaan garis to variabel { $variable1 } wawu { $variable2 } diila banari.

## `<ray>`

ray-overprescribed-through = Sinar ma woluwo pe'enta lonto through, endpoint wawu direction. through u ma woluwo boito diila pohutuwolo.

ray-dimension-mismatch = numDimensions lo sinar diila motu'ude.

## `<vector>`

vector-overprescribed-head = Vektor ma woluwo pe'enta lonto head, tail wawu displacement. head u ma woluwo boito diila pohutuwolo.

vector-dimension-mismatch = numDimensions lo vektor diila motu'ude.

## Attracting and constraining

attract-to-without-nearest-point = Diila mowali motarika ode `<{ $component }>` sababu diila woluwo variabel keadaan nearestPoint teto.

constrain-to-without-nearest-point = Diila mowali mopobatasi ode `<{ $component }>` sababu diila woluwo variabel keadaan nearestPoint teto.

constrain-to-interior-without-nearest-point = Diila mowali mopobatasi ode delomo `<{ $component }>` sababu diila woluwo variabel keadaan nearestPoint teto.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition diila pohutuwolo to choiceInput u diila inline

## Ordering children by index

choice-input-indices-count-mismatch = indices u ma woluwo to choiceInput diila pohutuwolo sababu jumlah lo indices diila motu'ude wolo jumlah lo walao choice.

pretzel-indices-count-mismatch = indices u ma woluwo to problem diila pohutuwolo sababu jumlah lo indices diila motu'ude wolo jumlah lo walao problem.

shuffle-indices-count-mismatch = indices u ma woluwo to shuffle diila pohutuwolo sababu jumlah lo indices diila motu'ude wolo jumlah lo komponen.

indices-ignored-out-of-range = indices u ma woluwo to { $component } diila pohutuwolo sababu woluwo indeks to bulemengo jangkauan.

pretzel-indices-repeated = indices u ma woluwo to pretzel diila pohutuwolo sababu woluwo indeks u tilulude poluli.

pretzel-circuit-first-index = indices u ma woluwo to pretzel to mode circuit diila pohutuwolo sababu indeks bohulio musi 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Alihu `<{ $component }>` mokaraja wolo walao u string, atribut `type` musi woluwo.

invalid-type-defaulting-to-math = Tipe { $type } diila banari ode komponen { $component }. Musi tuwawu lonto math, text, number, meyalo boolean. math u pilake.

string-not-valid-component-to-arrange = String "{ $value }" diila komponen u banari ode { $component }. Diila pohutuwolo.

## Types and variables

invalid-type-defaulting-to-number = Tipe { $type } diila banari, tipe pilotaalo number.

invalid-variable-value = Nilai lo variabel diila banari: `{ $value }`

## Variants

variant-index-must-be-number = Indeks varian { $index } musi bilangan

variant-index-must-be-integer = Indeks varian { $index } musi bilangan bulat

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` dipo pilohutu ode ukuran absolut. Lebar pilotaalo relatif.

side-by-side-absolute-margins = `<{ $component }>` dipo pilohutu ode ukuran absolut. Margin pilotaalo relatif.

side-by-side-no-block-child = `<{ $component }>` diila banari: musi o walao u blok palingu ngoidi tuwawu.

## `<label>`

label-for-ignored-on-graphical = Atribut `for` to `<label>` grafis diila pohutuwolo.

label-for-must-resolve-to-one = Atribut `for` to `<label>` musi motunu ode tuwawu komponen bo.

label-for-unresolved = Atribut `for` to `<label>` diila mowali motunu ode ngotalu komponen.

label-for-answer-with-authored-inputs = Atribut `for` to `<label>` motunu ode `<answer>` u masukanilio tiluladu lohihilao; tunu masukan boito tulusu.

label-for-answer-without-input = Atribut `for` to `<label>` motunu ode `<answer>` u diila o masukan u mowali labelilo.

label-for-must-reference-input-or-answer = Atribut `for` to `<label>` musi motunu ode ngotalu masukan meyalo ngotalu jawaban.

## Accessibility

accessibility-short-description-or-decorative = Alihu aksesibilitas, `<{ $component }>` musi o deskripsi u limbu'u meyalo tilandai debo hiasan.

accessibility-video-short-description = Alihu aksesibilitas, `<video>` musi o deskripsi u limbu'u.

accessibility-input-short-description-or-label = Alihu aksesibilitas, `<{ $component }>` musi o deskripsi u limbu'u meyalo label.

accessibility-answer-input-short-description-or-label = Alihu aksesibilitas, `<answer>` u mohutu masukan musi o deskripsi u limbu'u meyalo label.

accessibility-short-description-contains-math = Deskripsi u limbu'u diila mopiyohu o komponen matematika debo `<{ $component }>`. Tulade isi matematikalio wolo huruf.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } kurang kontrasilio ode teks judul bagian (mode moitomo) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; palingu ngoidi musi { $threshold }:1).
       *[other] { $colorName } kurang kontrasilio ode teks judul bagian ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; palingu ngoidi musi { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Dipo pilohutu `<circle>` mo'otalu { $count } titik wonu titik boito diila o nilai numerik.

circle-too-many-through-points = Diila mowali hitungolo lingkaran u mo'otalu lebe lonto 3 titik.

circle-overprescribed-radius-center-points = Diila mowali hitungolo lingkaran wonu jari-jari, pusat wawu titik u otalu ma woluwo pe'enta.

circle-center-with-multiple-points = Diila mowali hitungolo lingkaran u o pusat mo'otalu lebe lonto 1 titik.

circle-radius-too-small = Diila mowali hitungolo lingkaran: sababu jarak lo dulota titik boito { $distance }, jari-jari { $radius } u ma woluwo boito lebe kecil.

circle-radius-with-many-points = Diila mowali pohutuwolo lingkaran u mo'otalu lebe lonto dulota titik wonu jari-jari ma woluwo.

circle-invalid-center-or-through-points = Pusat meyalo titik u otalu lo lingkaran diila banari.

circle-radius-center-with-multiple-points = Diila mowali hitungolo jari-jari lo lingkaran u o pusat mo'otalu lebe lonto 1 titik.

circle-change-radius-non-numerical = Diila mowali bulitolo jari-jari lo lingkaran u titik otalulio diila numerik

circle-radius-with-points-non-numerical = Diila mowali pohutuwolo lingkaran u mo'otalu lebe lonto tuwawu titik wolo jari-jari u ma woluwo wonu diila woluwo nilai numerik.

circle-change-center-non-numerical = Dipo pilohutu pobulita lo pusat lo lingkaran u mo'otalu titik u diila numerik.

## `<function>`

function-domain-insufficient-dimensions = Kurang dimensi lo domain lo fungsi. Domain o { $intervals } selang bo fungsi boito o { $inputs } masukan.

function-domain-invalid-format = Format lo domain lo fungsi diila banari.

function-ignoring-non-numerical =
    { $type ->
        [maximum] maximum lo fungsi u diila numerik diila pohutuwolo.
        [minimum] minimum lo fungsi u diila numerik diila pohutuwolo.
        [extremum] extremum lo fungsi u diila numerik diila pohutuwolo.
        [point] titik lo fungsi u diila numerik diila pohutuwolo.
        [slope] kemiringan lo fungsi u diila numerik diila pohutuwolo.
       *[other] { $type } lo fungsi u diila numerik diila pohutuwolo.
    }

function-ignoring-empty =
    { $type ->
        [maximum] maximum lo fungsi u lowong diila pohutuwolo.
        [minimum] minimum lo fungsi u lowong diila pohutuwolo.
        [extremum] extremum lo fungsi u lowong diila pohutuwolo.
        [point] titik lo fungsi u lowong diila pohutuwolo.
       *[other] { $type } lo fungsi u lowong diila pohutuwolo.
    }

function-points-too-close = Fungsi o dulota titik u lebe membide. Diila mowali pohutuwolo fungsi.

function-iterates-input-output-mismatch = Iterasi lo fungsi bo mowali wonu jumlah lo masukan motu'ude wolo jumlah lo luaran. Fungsi botie o { $inputs } masukan wawu { $outputs } luaran.

## `<sequence>`

sequence-invalid-length = Panjang lo sequence diila banari.  Musi bilangan bulat u diila negatif.

sequence-invalid-step = Step lo sequence diila banari.  Musi bilangan ode sequence tipe { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" lo sequence bilangan diila banari.  Musi bilangan.

sequence-invalid-endpoint-letters = "{ $attribute }" lo sequence huruf diila banari.  Musi rangkaian huruf.

sequence-invalid-endpoint = "{ $attribute }" lo sequence diila banari.

select-from-sequence-coprime-not-numbers = coprime diila pohutuwolo sababu u tilulawoto diila bilangan

select-from-sequence-coprime-with-exclude-combinations = coprime diila pohutuwolo sababu excludeCombinations ma woluwo

## Resolving a `target`

target-not-found = Target lo `<{ $source }>` diila banari: target diila iloontonga.

target-state-variable-not-found = Target lo `<{ $source }>` diila banari: variabel keadaan u o tanggulo "{ $property }" to `<{ $component }>` diila iloontonga.

## `<odeSystem>`

ode-system-variables-match-independent = Variabel lo `<odeSystem>` musi wuwewo lonto variabel bebas.

ode-system-duplicate-variable-names = Diila mowali pohutuwolo fungsi RHS ODE u o tanggulo variabel u tilulude poluli.

ode-system-rhs-function-error = Diila mowali pohutuwolo fungsi RHS ODE.  Ututala to pohutu lo fungsi mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Diila mowali pohutuwolo sudut to wolota lo { $count } garis

angle-invalid-through-point = Titik to through lo `<angle>` diila banari

parabola-vertex-too-many-points = Dipo pilohutu parabola u o puncak mo'otalu lebe lonto 1 titik.

parabola-too-many-points = Dipo pilohutu parabola u mo'otalu lebe lonto 3 titik.

intersection-too-many-items = Dipo pilohutu perpotongan ode lebe lonto dulota barang

## Other math components

ionic-compound-not-two-ions = Dipo pilohutu senyawa ionik ode u wuwewo lonto dulota ion.

ionic-compound-needs-cation-and-anion = Senyawa ionik bo pilohutu ode tuwawu kation wawu tuwawu anion.

solve-equations-cannot-evaluate = Diila mowali tulusiyolo persamaan botie sababu persamaanilio diila mowali hitungolo: { $equation }

math-operators-operand-number-required = operandNumber musi woluwo wonu mohama operand matematika.

eigen-decomposition-failed = Diila mowali hitungolo nilai eigen lo matriks

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: parameter { $parameters } diila woluwo to pola boito, so'o layito motu'ude wolo u lowong.

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" diila mowali otawa. Musi none, medium, dense, meyalo dulota bilangan positif u pilotayade lo spasi, debo grid="1 0.5". Diila woluwo kisi u tiluladu.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` mo'ohuna fungsi u o { $expected ->
        [1] tuwawu luaran, deuito kemiringan y' to tuwa-tuwawu titik, debo `y - x`
       *[other] dulota luaran, deuito vektor to tuwa-tuwawu titik, debo `(y, -x)`
    }, bo fungsi u yiluhu boito o { $found } luaran. { $alternative ->
        [none] Diila woluwo u tiluladu.
       *[other] `<{ $alternative }>` komponen ode fungsi u odito. Diila woluwo u tiluladu.
    }

field-function-attribute-ignored-with-child = Atribut `function` diila pohutuwolo sababu fungsi boito yiluhu olo to delomo komponen; u to delomo boito u pilake. Wohi fungsi boito bo lonto tuwawu dalalo.

field-variables-ignored =
    `<{ $component }>`: atribut `variables` motanggulo variabel lo ekspresi u tiluladu tulusu to delomo komponen. { $reason ->
        [function-child] Fungsi teya yiluhu debo walao `<function>`, u motanggulo variabelilio lohihilao, so'o `variables` diila pohutuwolo.
       *[no-expression] Diila woluwo ekspresi u odito teya, so'o `variables` diila pohutuwolo.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" diila dukungolo to perender prefigure; u pilake parangi posisi olowala.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" diila dukungolo to perender prefigure; u pilake parangi posisi yitato.

prefigure-invalid-axis-bounds = `<graph>`: batas sumbu diila banari ode konversi prefigure; u pilake bbox bawaan (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: lebar diila banari ode konversi prefigure; u pilake lebar diagram bawaan 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio diila banari ode konversi prefigure; u pilake rasio aspek bawaan 1.

prefigure-grid-spacing-too-fine = `<graph>`: wolota lo kisi boito lebe limbu'u ode batas sumbu; kisi boito diila pohutuwolo to perender prefigure.

prefigure-annotations-not-rendered = `<graph>`: anotasi diila tuladulo wonu diila pilake perender PreFigure.

multiple-annotations-children = Daata walao `<annotations>` iloontonga to `<graph>`; ngoa'amila u diila pulitio diila pohutuwolo.

## Referring to other components

copy-unrecognized-component-type = Diila mowali tambahilo meyalo salinolo tipe komponen u diila otawa: { $type }.

copy-prop-not-found = prop { $property } to komponen tipe { $component } diila iloontonga

collect-no-source = Sumber ode collect diila iloontonga.

collect-invalid-component-type = Diila mowali himoa'a komponen tipe `<{ $component }>` sababu tipe komponen boito diila banari.

reference-index-unavailable = Diila mowali tunuwolo indeks `{ $reference }`

## `<callAction>`

component-action-unavailable = Diila mowali pohutuwolo { $action } to komponen `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Bentuk lo data diila banari.  Panjang lo baris diila motu'ude. Iloontonga to componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data o tanggulo kolom u tilulude poluli.  Iloontonga to componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data kurang tuwawu tanggulo kolom.  Iloontonga to componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Award lo jawaban botie modepitayi jawaban u diludelo lo tag jawaban boito lohihilao, wawu uito mo'owali parangi u diila harapulo.

answer-max-num-attempts-in-section-wide-check-work = Pohutu lo `maxNumAttempts` to `<answer>` u to delomo wadah u o `sectionWideCheckWork` diila o pengaruh, sababu jumlah lo usaha yilaturu lo wadah boito. Pohutu `maxNumAttempts` to wadah boito.

nested-section-wide-check-work-max-num-attempts = Pohutu lo `maxNumAttempts` to wadah u o `sectionWideCheckWork` u to delomo wadah wuwewo u o `sectionWideCheckWork` diila o pengaruh, sababu jumlah lo usaha yilaturu lo wadah u to bulemengo. Pohutu `maxNumAttempts` to wadah u to bulemengo boito.

answer-attributes-need-symbolic-equality = Atribut { $attributes } diila o pengaruh wonu symbolicEquality diila woluwo.

answer-invalid-type = Tipe lo jawaban diila banari: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Sababu komponen `<{ $component }>` diila o tanggulo, boito diila mowali pilake debo atribut lo module

module-attribute-name-already-defined = Komponen `<{ $component } name="{ $name }">` diila mowali pilake debo atribut lo module sababu tipe komponen `<module>` ma o atribut "{ $name }".

conditional-content-condition-ignored = Atribut `condition` diila pohutuwolo to komponen `<conditionalContent>` u o walao case meyalo else.

slider-markers-type-mismatch = Tipe lo marker diila motu'ude wolo tipe lo slider.

pretzel-problem-needs-statement-and-answer = Pretzel diila banari: tuwa-tuwawu `<problem>` musi o tuwawu `<statement>` wawu tuwawu `<answer>`.

pretzel-circuit-first-problem-distractor = Pretzel diila banari: to mode="circuit", `<problem>` bohulio diila mowali mowali distraktor.

## Attribute values

attribute-invalid-values = Nilai { $values } diila banari ode atribut `{ $attribute }`; diila pohutuwolo.

attribute-must-be-references = Nilai `{ $value }` diila banari ode atribut `{ $attribute }`. Atribut musi pohutuwolo lonto referensi u momula wolo `$`.

math-input-invalid-function-names = <mathInput>: tanggulo fungsi u diila banari to { $attribute } diila pohutuwolo: { $names }. Tuwa-tuwawu tanggulo musi o palingu ngoidi 2 karakter (huruf meyalo garis tayade); mowali tambahilo akhiran `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Tipe komponen diila banari: `<{ $componentType }>`

attribute-repeated = Diila mowali tulude poluli atribut { $attribute }.

attribute-invalid-for-component = Atribut "{ $attribute }" diila banari ode komponen tipe `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Definisi gaya { $styleNumber } kurang kontrasilio ode { $context ->
        [text-on-background] warna teks ode warna latar
        [high-contrast] warna kontras u molanggato ode kanvas
        [line] warna garis ode kanvas
        [marker] warna marker ode kanvas
       *[text-on-canvas] warna teks ode kanvas
    }{ $mode ->
        [dark] { " (mode moitomo)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; palingu ngoidi musi { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Openu definisi gaya { $styleNumber } ma o warna u sae kontrasilio ode mode mobango, warna mode moitomo u lonto nilai boito kurang kontrasilio ode warna teks wolo warna latar ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; palingu ngoidi musi { $threshold }:1). { $suggestion ->
        [available] Alihu sae kontrasilio to mode moitomo, popolanggato kontras mode mobango (misalu pohutu { $lightAttribute }="{ $lightColor }") meyalo bulita warna mode moitomo (misalu pohutu { $darkAttribute }="{ $darkColor }").
       *[none] Alihu sae kontrasilio to mode moitomo, popolanggato kontras mode mobango meyalo bulita warna u lonto boito wolo textColorDarkMode wawu/meyalo backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Openu definisi gaya { $styleNumber } ma o warna teks u sae kontrasilio ode mode mobango, warna teks mode moitomo u lonto nilai boito kurang kontrasilio ode kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; palingu ngoidi musi { $threshold }:1). { $suggestion ->
        [available] Alihu sae kontrasilio to mode moitomo, popolanggato kontras mode mobango (misalu pohutu textColor="{ $lightColor }") meyalo bulita warna mode moitomo (misalu pohutu textColorDarkMode="{ $darkColor }").
       *[none] Alihu sae kontrasilio to mode moitomo, popolanggato kontras mode mobango meyalo bulita warna u lonto boito wolo textColorDarkMode.
    }

section-multiple-style-palettes = Ngotalu bagian bo mowali motulawoto tuwawu <stylePalette>; u pulitio u pilake.

## Unique variants

variant-num-to-select-not-non-negative-integer = varian u unik lo { $component } diila mowali otawa sababu numToSelect diila bilangan bulat u diila negatif.

variant-num-to-select-not-constant-number = varian u unik lo { $component } diila mowali otawa sababu numToSelect diila bilangan u tatapu.

variant-with-replacement-not-constant-boolean = varian u unik lo { $component } diila mowali otawa sababu withReplacement diila boolean u tatapu.

variant-select-weight-disables-unique = Varian u unik ode select diila mokaraja wonu woluwo option u o selectWeight meyalo selectForVariants

variant-coprime-undetermined = varian u unik lo { $component } diila mowali otawa sababu coprime layito salah diila mowali otawa.

variant-attribute-not-constant = varian u unik lo { $component } diila mowali otawa sababu { $attribute } diila tatapu.

variant-attribute-not-number = varian u unik lo { $component } diila mowali otawa sababu { $attribute } diila bilangan.

variant-attribute-wrong-type-for-sequence =
    varian u unik lo { $component } tipe { $type } diila mowali otawa sababu { $attribute } diila { $expected ->
        [letters-combination] rangkaian huruf
        [math-expression] ekspresi matematika u banari
        [integer] bilangan bulat
       *[number] bilangan
    }.

variant-length-not-integer = varian u unik lo { $component } diila mowali otawa sababu length diila bilangan bulat.

variant-sort-not-implemented = dipo pilohutu varian u unik lo { $component } u o sort

variant-exclude-combinations-not-implemented = dipo pilohutu varian u unik lo { $component } u o excludeCombinations

variant-math-exclude-not-implemented = dipo pilohutu varian u unik lo { $component } tipe math u o exclude

variant-non-constant-exclude-not-implemented = dipo pilohutu varian u unik lo { $component } u o exclude u diila tatapu

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: diila dukungolo to perender prefigure lo graph; walao dilalowa.

prefigure-descendant-invalid-geometry = { $subject }: geometri u diila tatapu meyalo u kurang; walao dilalowa.

prefigure-curve-label-omitted = { $subject }: label diila dukungolo to elemen kurva u yiluli; label dilalowa.

prefigure-curve-unsupported-definition-type = { $subject }: tipe definisi fungsi kurva '{ $definitionType }' diila dukungolo; walao dilalowa.

prefigure-region-flip-functions-unsupported = { $subject }: atribut flipFunctions to regionBetweenCurves diila dukungolo; walao dilalowa.

prefigure-region-non-formula-child = { $subject }: bo walao fungsi tipe formula u dukungolo to regionBetweenCurves; walao dilalowa.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' diila dukungolo ode { $labelKind ->
        [line-family] label lo kelompok garis
       *[point] label lo titik
    }; u pilake perataan PreFigure bawaan.

prefigure-fill-style-unsupported = { $subject }: gaya isi '{ $fillStyle }' diila dukungolo lo PreFigure; muli ode isi u solid.

prefigure-line-style-unknown = { $subject }: gaya garis '{ $lineStyle }' u diila otawa dilalowa lonto luaran PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: gaya marker '{ $markerStyle }' pilotaalo gaya PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: gaya marker '{ $markerStyle }' diila dukungolo lo PreFigure; u pilake gaya bawaan.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` diila banari; target diila mowali otawa. Anotasi dilalowa.

annotation-ref-multiple-targets = `<annotation>`: `ref` motunu ode daata target; u bohulio u pilake.

annotation-ref-outside-graph = `<annotation>`: `ref` diila banari; target boito to bulemengo graph u modu'olo. Anotasi dilalowa.

annotation-ref-unsupported-target = `<annotation>`: `ref` diila banari; target boito diila objek grafis u dukungolo to konversi prefigure. Anotasi dilalowa.

annotation-text-missing = `<annotation>`: `text` kurang meyalo lowong; teks u lowong u pilohutu.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Iloontonga katergantungan u molihu.
       *[other] Iloontonga katergantungan u molihu u o komponen `<{ $componentType }>`.
    }

reference-no-referent = U tilunuhu lo referensi diila iloontonga: `{ $reference }`

reference-multiple-referents = Daata u tilunuhu lo referensi: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format lo atribut { $attribute } lo `<{ $componentType }>` diila banari.

children-invalid = Walao lo `<{ $componentType }>` diila banari: Iloontonga walao u diila banari: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Nilai `{ $value }` diila banari ode atribut `{ $attribute }`, nilai `{ $default }` u pilake

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Versi DoenetML { $version } diila iloontonga.
       *[other] Versi DoenetML { $version } diila iloontonga. Muli ode versi { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML diila banari: { $content }

parse-tag-missing-close-tag = DoenetML diila banari: Tag `{ $tag }` diila o tag palautu. Musi tag u molautu batangalio meyalo tag `</{ $tagName }>`.

parse-tag-error = DoenetML diila banari: Ututala to tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML diila banari: Atribut `{ $attribute }` u diila banari botie tanu kurang nilai.

parse-attribute-invalid = DoenetML diila banari: Atribut `{ $attribute }` diila banari

parse-attribute-value-invalid = DoenetML diila banari: Nilai atribut `{ $value }` diila banari

parse-attribute-value-quote-mismatch = DoenetML diila banari: Nilai atribut `{ $value }` diila banari. Tanda kutip diila motu'ude. Tanu kurang tuwawu `{ $quote }`

parse-open-tag-name-missing = DoenetML diila banari: Iloontonga tag u diila o tanggulo tag, debo `<`

parse-tag-not-closed = DoenetML diila banari: Tag `{ $tag }` diila lilautu (tanu kurang `>`).

parse-self-closing-tag-name-missing = DoenetML diila banari: Iloontonga tag u diila o tanggulo tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML diila banari: Tag `{ $tag }` diila lilautu (tanu kurang `/>`).

parse-tag-invalid-attributes = DoenetML diila banari: Tag `{ $tag }` diila banari. Tanu atributilio diila banari.

parse-close-tag-name-missing = DoenetML diila banari: Iloontonga tag palautu u diila o tanggulo tag, debo `</`

parse-attribute-value-unquoted = Nilai atribut musi to delomo tanda kutip: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML diila banari: Iloontonga tag palautu `{ $tag }`, bo diila woluwo tag pamula u motu'ude

parse-close-tag-mismatched = DoenetML diila banari: Tag palautu diila motu'ude. U harapulo `</{ $expected }>`. U iloontonga `{ $found }`

parser-node-unconvertible = Node { $node } diila mowali uliyolo ode node Dast.

## Names

name-attribute-invalid =
    Tanggulo atribut name='{ $name }' diila banari. { $reason ->
        [characters] Tanggulo bo mowali o huruf, angka, garis to walungo meyalo garis tayade.
       *[start] Tanggulo musi momula wolo tuwawu huruf.
    }

component-name-invalid-start = Tanggulo komponen "{ $name }" diila banari. Tanggulo musi momula wolo tuwawu huruf.

## `<answer>` sugar

answer-video-watched-missing-video = Jawaban tipe videoWatched musi o atribut video

answer-video-watched-video-not-reference = Jawaban tipe videoWatched musi o atribut video u ngotalu referensi

answer-name-not-single-text = Atribut name lo jawaban musi o tuwawu walao text bo

## Referencing another document

external-doenetml-recursion-limit = DoenetML lonto bulemengo diila mowali hamawa sababu rekursilio lebe daata lapisilio. Woluwo referensi u molihu?

external-doenetml-unavailable = DoenetML lonto { $attribute }="{ $uri }" diila mowali hamawa

external-doenetml-type-mismatch = DoenetML u yilohama lonto { $attribute }="{ $uri }" diila banari: diila motu'ude wolo tipe komponen "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` ma tilolaalo; pake `{ $to }`.
       *[other] [deprecation] Atribut `{ $from }` to `<{ $component }>` ma tilolaalo; pake `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` ma tilolaalo wawu diila pohutuwolo sababu `{ $to }` ma woluwo olo.
       *[other] [deprecation] Atribut `{ $from }` to `<{ $component }>` ma tilolaalo wawu diila pohutuwolo sababu `{ $to }` ma woluwo olo.
    }

deprecated-attribute-ignored = [deprecation] Atribut `{ $attribute }` to `<{ $component }>` ma tilolaalo wawu diila pohutuwolo.

deprecated-attribute-to-child = [deprecation] Atribut `{ $attribute }` to `<{ $component }>` ma tilolaalo; pake walao `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Nilai `{ $value }` lo atribut `{ $attribute }` to `<{ $component }>` ma tilolaalo; pake `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` bo mowali mopobentuk jamak lo bahasa Inggris, so'o teksilio diila bulitolo to dokumen u tiluladu wolo { $locale }. Tulade bentuk jamakilio tulusu, meyalo pohutu wolo atribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elemen `<{ $tag }>` diila elemen Doenet u otawa.

schema-element-not-allowed-at-root = Elemen `<{ $tag }>` diila mowali to wumbuto lo dokumen.

schema-element-not-allowed-inside = Elemen `<{ $tag }>` diila mowali to delomo `<{ $parent }>`.

schema-attribute-unrecognized = Elemen `<{ $tag }>` diila o atribut u o tanggulo `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribut `{ $attribute }` lo elemen `<{ $tag }>` musi ngotalu daftar u tuwa-tuwawu itemilio tuwawu lonto: { $allowed }
       *[other] Atribut `{ $attribute }` lo elemen `<{ $tag }>` musi tuwawu lonto: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Tanggulo varian lo select diila banari.  Tanggulo varian { $variantName } woluwo to { $numOptions } option bo jumlah u tulawoto { $numToSelect }.

select-variant-name-without-options = Woluwo varian u ma woluwo to select bo diila woluwo option ode tanggulo varian u mowali: { $variantName }.

select-variant-name-not-possible = Tanggulo varian { $variantName } u ma woluwo to select diila tanggulo varian u mowali.

select-too-few-options = Diila mowali tulawoto { $numToSelect } komponen lonto bo { $numOptions }.

select-from-sequence-too-few-values = Diila mowali tulawoto { $numToSelect } nilai lonto sequence u o panjang { $length }.

select-from-sequence-indices-count-mismatch = Jumlah lo indices u ma woluwo to select musi motu'ude wolo jumlah u tulawoto

select-from-sequence-indices-not-integers = Ngoa'amila indices u ma woluwo to select musi bilangan bulat

select-from-sequence-index-excluded = Indeks selectfromsequence u ma woluwo boito ma yilulutalo

select-from-sequence-indices-excluded-combination = indices selectfromsequence u ma woluwo boito ngotalu kombinasi u yilulutalo

select-from-sequence-coprime-not-positive-integers = Diila mowali tulawoto kombinasi coprime sababu u tilulawoto diila bilangan bulat positif.

select-from-sequence-coprime-common-factor = Diila mowali tulawoto bilangan coprime. Ngoa'amila nilai u mowali o faktor u tuwawu. (Nilai "from" meyalo "to" u ma woluwo musi coprime wolo "step".)

select-from-sequence-coprime-single-number = Diila mowali tulawoto kombinasi coprime lonto tuwawu bilangan u diila 1.

select-from-sequence-excluded-too-many-combinations = Lebe lonto 70% kombinasi yilulutalo to selectFromSequence

select-from-sequence-coprime-none-found = Diila mowali tulawoto bilangan coprime. Ngoa'amila nilai u mowali o faktor u tuwawu.

select-from-sequence-too-few-unique-values = Diila mowali tulawoto { $numToSelect } nilai u unik lonto sequence u o panjang { $numPossibleValues }

select-prime-numbers-too-few-values = Diila mowali tulawoto { $numToSelect } nilai lonto daftar bilangan prima u o panjang { $numValues }

select-prime-numbers-values-count-mismatch = Jumlah lo nilai u ma woluwo to select musi motu'ude wolo jumlah u tulawoto

select-prime-numbers-values-not-prime = Ngoa'amila nilai u ma woluwo to select bilangan prima musi woluwo to daftar bilangan prima

select-prime-numbers-values-excluded-combination = Nilai selectPrimeNumbers u ma woluwo boito ngotalu kombinasi u yilulutalo

select-prime-numbers-excluded-too-many-combinations = Lebe lonto 70% kombinasi yilulutalo to selectPrimeNumbers

select-random-combination-fluke = Sababu kabatula u jarang da'a, kombinasi lo nilai acak diila mowali tulawoto

select-random-value-fluke = Sababu kabatula u jarang da'a, nilai acak diila mowali tulawoto

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] `<{ $component }>` botie diila biluohu sababu to delomo matematika wawu diila `inline`. Tambahi `inline` alihu mowali daftar u motuhuto, u motu'ude to delomo ngotalu ekspresi.
        [expanded] `<{ $component }>` botie diila biluohu sababu to delomo matematika wawu `expanded`. Luluta `expanded`; kotak u daata barisilio diila motu'ude to delomo ngotalu ekspresi.
        [on-graph] `<{ $component }>` botie diila biluohu sababu to delomo matematika u tiluladu to graph, u diila o tambati ode masukan.
       *[relative-width] `<{ $component }>` botie diila biluohu sababu to delomo matematika wawu o lebar relatif. Wohi lebarilio wolo satuan absolut, debo `px`.
    }
