# Nias (Li Niha) diagnostics. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
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
# **Variety and orthography: the northern standard, in Latin**, with `ö` a
# letter of its own that must never be folded to `o` — a search for «börö»
# will not find «boro». `chrome.ftl`'s header sets out the alphabet, the
# final-vowel property and the compromise this catalog makes with it, and why
# initial mutation is not applied to any noun in any of the four files.
#
# **The frames.** This file is 220 sentences built out of a dozen recurring
# frames, and reading the frames is the fastest way to review it:
#
#     … lö tefaigi            … is not looked at   (stands for *is ignored*)
#     Tebai …                 cannot …
#     … moguna …              … must / is needed
#     … si lö atulö           invalid …
#     Lö nasa mufazökhi …     has not yet been made …
#     lö tesöndra             not found
#     lö faudu                does not match
#     börö me …               because …
#     lö moguna               has no effect
#     Lö so … / Lö hadöi …    there is no …
#     … nibe'e                … is given / is specified
#
# **Two of those are paraphrases and are declared as such.** «lö tefaigi» is
# literally *is not looked at*, from «faigi» (to see); Nias has a word for
# *ignore* and the seed does not know it, so one paraphrase is used at every
# site rather than a scatter of guesses, and replacing it is one search.
# «nibe'e» is literally *given*, the `ni-` passive of «be'e», and stands for
# English's *specified*.
#
# «minimal» is an **Indonesian loan used deliberately** where English says *at
# least*: the Nias construction the seed would otherwise reach for is one it
# cannot form confidently, and a loan a reader understands beats a phrase the
# seed invented.
#
# **Register.** Indonesian for the technical nouns — `atribut`, `komponen`,
# `nilai`, `variabel`, `titik`, `garis`, `lingkaran`, `fungsi`, `dimensi`,
# `indeks`, `referensi`, `versi`, `format`, `dokumen` — declared as a loan
# register in `chrome.ftl`'s header, in their Indonesian spellings, consonant
# finals and all. Nothing here is a coinage.
#
# **Plural.** Nias leaves a noun unmarked after a numeral, so every
# `[one]`/`[other]` fork in the English collapses to a single `*[other]`
# branch. One message keeps an explicit `[1]` literal, because English forks
# there on *one output* against *two outputs* and the distinction is about the
# shape of the function rather than about agreement; Fluent matches a numeric
# literal against the number itself, before any plural rule, so it stays
# selectable.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } lö tefaigi na dua titik ujung nibe'e

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } lö tefaigi na titik ujung awö titik tengah nibe'e fefu

line-segment-midpoint-offset-without-midpoint = midpointOffset lö moguna na lö so titik tengah

## `<line>`

line-points-undetermined-dimensions = Garis si möi ba titik si tebai mu'ila dimensinia.

line-points-too-few-dimensions = Garis moguna möi ba titik si so minimal dua dimensi.

line-points-depend-on-variables = Garis si möi ba titik si faoma variabel: { $variables }.

line-equation-invalid-format = Format persamaan garis ba variabel { $variable1 } awö { $variable2 } lö atulö.

## `<ray>`

ray-overprescribed-through = Sinar nibe'e faoma through, endpoint awö direction. through nibe'e andrö lö tefaigi.

ray-dimension-mismatch = numDimensions sinar lö faudu.

## `<vector>`

vector-overprescribed-head = Vektor nibe'e faoma head, tail awö displacement. head nibe'e andrö lö tefaigi.

vector-dimension-mismatch = numDimensions vektor lö faudu.

## Attracting and constraining

attract-to-without-nearest-point = Tebai mufa'ahatö ba `<{ $component }>` börö me lö so variabel keadaan nearestPoint ba da'ö.

constrain-to-without-nearest-point = Tebai mufabatasi ba `<{ $component }>` börö me lö so variabel keadaan nearestPoint ba da'ö.

constrain-to-interior-without-nearest-point = Tebai mufabatasi ba bakha `<{ $component }>` börö me lö so variabel keadaan nearestPoint ba da'ö.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition lö tefaigi ba choiceInput si lö inline

## Ordering children by index

choice-input-indices-count-mismatch = indices nibe'e ba choiceInput lö tefaigi börö me oyania indices lö faudu ba oyania ono choice.

pretzel-indices-count-mismatch = indices nibe'e ba problem lö tefaigi börö me oyania indices lö faudu ba oyania ono problem.

shuffle-indices-count-mismatch = indices nibe'e ba shuffle lö tefaigi börö me oyania indices lö faudu ba oyania komponen.

indices-ignored-out-of-range = indices nibe'e ba { $component } lö tefaigi börö me so indeks si baero moroi ba jangkauan.

pretzel-indices-repeated = indices nibe'e ba pretzel lö tefaigi börö me so indeks si mufuli.

pretzel-circuit-first-index = indices nibe'e ba pretzel ba mode circuit lö tefaigi börö me indeks si föföna moguna 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Ena'ö mohalöwö `<{ $component }>` awö ono si string, atribut `type` moguna nibe'e.

invalid-type-defaulting-to-math = Tipe { $type } lö atulö ba komponen { $component }. Moguna sara moroi ba math, text, number, ma boolean. math nioguna'ö.

string-not-valid-component-to-arrange = String "{ $value }" tenga komponen si atulö ba { $component }. Lö tefaigi.

## Types and variables

invalid-type-defaulting-to-number = Tipe { $type } lö atulö, tipe mufalalini ba number.

invalid-variable-value = Nilai variabel lö atulö: `{ $value }`

## Variants

variant-index-must-be-number = Indeks varian { $index } moguna bilangan

variant-index-must-be-integer = Indeks varian { $index } moguna bilangan bulat

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` lö nasa mufazökhi ba ukuran absolut. Lebar mufalalini ba relatif.

side-by-side-absolute-margins = `<{ $component }>` lö nasa mufazökhi ba ukuran absolut. Margin mufalalini ba relatif.

side-by-side-no-block-child = `<{ $component }>` lö atulö: moguna so minimal sara ono si blok.

## `<label>`

label-for-ignored-on-graphical = Atribut `for` ba `<label>` grafis lö tefaigi.

label-for-must-resolve-to-one = Atribut `for` ba `<label>` moguna tumunö ba sara komponen manö.

label-for-unresolved = Atribut `for` ba `<label>` tebai tumunö ba sara komponen.

label-for-answer-with-authored-inputs = Atribut `for` ba `<label>` tumunö ba `<answer>` si no musura masukanania samösa; tunö masukan andrö sanöndra.

label-for-answer-without-input = Atribut `for` ba `<label>` tumunö ba `<answer>` si lö so masukanania nilabeli.

label-for-must-reference-input-or-answer = Atribut `for` ba `<label>` moguna tumunö ba sara masukan ma sara jawaban.

## Accessibility

accessibility-short-description-or-decorative = Ena'ö atulö aksesibilitas, `<{ $component }>` moguna so deskripsi si adogo ma mutandrai simane hiasan.

accessibility-video-short-description = Ena'ö atulö aksesibilitas, `<video>` moguna so deskripsi si adogo.

accessibility-input-short-description-or-label = Ena'ö atulö aksesibilitas, `<{ $component }>` moguna so deskripsi si adogo ma label.

accessibility-answer-input-short-description-or-label = Ena'ö atulö aksesibilitas, `<answer>` samazökhi masukan moguna so deskripsi si adogo ma label.

accessibility-short-description-contains-math = Deskripsi si adogo lö sökhi na so komponen matematika simane `<{ $component }>`. Sura isi matematikania faoma li.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } lö adöni kontrasnia ba teks judul bagian (mode saitö) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; moguna minimal { $threshold }:1).
       *[other] { $colorName } lö adöni kontrasnia ba teks judul bagian ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; moguna minimal { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Lö nasa mufazökhi `<circle>` si möi ba { $count } titik na titik andrö lö so nilai numerik.

circle-too-many-through-points = Tebai mu'erai lingkaran si möi ba abölö moroi ba 3 titik.

circle-overprescribed-radius-center-points = Tebai mu'erai lingkaran na jari-jari, pusat awö titik nitörö nibe'e fefu.

circle-center-with-multiple-points = Tebai mu'erai lingkaran si so pusat si möi ba abölö moroi ba 1 titik.

circle-radius-too-small = Tebai mu'erai lingkaran: börö me jarak dua titik andrö { $distance }, jari-jari { $radius } nibe'e andrö side-ide sibai.

circle-radius-with-many-points = Tebai mufazökhi lingkaran si möi ba abölö moroi ba dua titik na jari-jari nibe'e.

circle-invalid-center-or-through-points = Pusat ma titik nitörö lingkaran lö atulö.

circle-radius-center-with-multiple-points = Tebai mu'erai jari-jari lingkaran si so pusat si möi ba abölö moroi ba 1 titik.

circle-change-radius-non-numerical = Tebai mufalalini jari-jari lingkaran si titik nitöröia lö numerik

circle-radius-with-points-non-numerical = Tebai mufazökhi lingkaran si möi ba abölö moroi ba sara titik awö jari-jari nibe'e na lö so nilai numerik.

circle-change-center-non-numerical = Lö nasa mufazökhi wamalalini pusat lingkaran si möi ba titik si lö numerik.

## `<function>`

function-domain-insufficient-dimensions = Lö adöni dimensi domain fungsi. Domain so { $intervals } selang ba fungsi andrö so { $inputs } masukan.

function-domain-invalid-format = Format domain fungsi lö atulö.

function-ignoring-non-numerical =
    { $type ->
        [maximum] maximum fungsi si lö numerik lö tefaigi.
        [minimum] minimum fungsi si lö numerik lö tefaigi.
        [extremum] extremum fungsi si lö numerik lö tefaigi.
        [point] titik fungsi si lö numerik lö tefaigi.
        [slope] kemiringan fungsi si lö numerik lö tefaigi.
       *[other] { $type } fungsi si lö numerik lö tefaigi.
    }

function-ignoring-empty =
    { $type ->
        [maximum] maximum fungsi si lowong lö tefaigi.
        [minimum] minimum fungsi si lowong lö tefaigi.
        [extremum] extremum fungsi si lowong lö tefaigi.
        [point] titik fungsi si lowong lö tefaigi.
       *[other] { $type } fungsi si lowong lö tefaigi.
    }

function-points-too-close = Fungsi so dua titik si ahatö sibai. Tebai mufazökhi fungsi.

function-iterates-input-output-mismatch = Iterasi fungsi tola ha na oyania masukan faudu ba oyania luaran. Fungsi andre so { $inputs } masukan awö { $outputs } luaran.

## `<sequence>`

sequence-invalid-length = Panjang sequence lö atulö.  Moguna bilangan bulat si lö negatif.

sequence-invalid-step = Step sequence lö atulö.  Moguna bilangan ba sequence tipe { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" sequence bilangan lö atulö.  Moguna bilangan.

sequence-invalid-endpoint-letters = "{ $attribute }" sequence huruf lö atulö.  Moguna rangkaian huruf.

sequence-invalid-endpoint = "{ $attribute }" sequence lö atulö.

select-from-sequence-coprime-not-numbers = coprime lö tefaigi börö me si nifili tenga bilangan

select-from-sequence-coprime-with-exclude-combinations = coprime lö tefaigi börö me excludeCombinations nibe'e

## Resolving a `target`

target-not-found = Target `<{ $source }>` lö atulö: target lö tesöndra.

target-state-variable-not-found = Target `<{ $source }>` lö atulö: variabel keadaan si möi töi "{ $property }" ba `<{ $component }>` lö tesöndra.

## `<odeSystem>`

ode-system-variables-match-independent = Variabel `<odeSystem>` moguna faböi faudu ba variabel bebas.

ode-system-duplicate-variable-names = Tebai mufazökhi fungsi RHS ODE si so töi variabel si mufuli.

ode-system-rhs-function-error = Tebai mufazökhi fungsi RHS ODE.  Fasala ba wamazökhi fungsi mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Tebai mufazökhi sudut ba talaga { $count } garis

angle-invalid-through-point = Titik ba through `<angle>` lö atulö

parabola-vertex-too-many-points = Lö nasa mufazökhi parabola si so puncak si möi ba abölö moroi ba 1 titik.

parabola-too-many-points = Lö nasa mufazökhi parabola si möi ba abölö moroi ba 3 titik.

intersection-too-many-items = Lö nasa mufazökhi perpotongan ba abölö moroi ba dua ngawalö

## Other math components

ionic-compound-not-two-ions = Lö nasa mufazökhi senyawa ionik ba zi tenga dua ion.

ionic-compound-needs-cation-and-anion = Senyawa ionik ha mufazökhi ba sara kation awö sara anion.

solve-equations-cannot-evaluate = Tebai mufa'ohe persamaan andre börö me persamaania tebai mu'erai: { $equation }

math-operators-operand-number-required = operandNumber moguna nibe'e na muhalö operand matematika.

eigen-decomposition-failed = Tebai mu'erai nilai eigen matriks

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: parameter { $parameters } lö so ba pola andrö, andrö wa lö mamalö faudu ia ba zi lowong.

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" tebai mu'ila. Moguna none, medium, dense, ma dua bilangan positif nifabali spasi, simane grid="1 0.5". Lö hadöi kisi nisura.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` moguna fungsi si so { $expected ->
        [1] sara luaran, ya'ia kemiringan y' ba zi sambua titik, simane `y - x`
       *[other] dua luaran, ya'ia vektor ba zi sambua titik, simane `(y, -x)`
    }, ba fungsi nibe'e andrö so { $found } luaran. { $alternative ->
        [none] Lö hadöi nisura.
       *[other] `<{ $alternative }>` komponen ba fungsi si manö. Lö hadöi nisura.
    }

field-function-attribute-ignored-with-child = Atribut `function` lö tefaigi börö me fungsi andrö nibe'e göi ba bakha komponen; si bakha andrö nioguna'ö. Be'e fungsi andrö ha sara lala.

field-variables-ignored =
    `<{ $component }>`: atribut `variables` mamotokhi töi variabel ekspresi nisura sanöndra ba bakha komponen. { $reason ->
        [function-child] Fungsi ba da'e nibe'e simane ono `<function>`, si mamotokhi töi variabelnia samösa, andrö wa `variables` lö tefaigi.
       *[no-expression] Lö so ekspresi si manö ba da'e, andrö wa `variables` lö tefaigi.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" lö tola ba perender prefigure; nioguna'ö parangi posisi kamböla.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" lö tola ba perender prefigure; nioguna'ö parangi posisi yawa.

prefigure-invalid-axis-bounds = `<graph>`: batas sumbu lö atulö ba konversi prefigure; nioguna'ö bbox bawaan (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: lebar lö atulö ba konversi prefigure; nioguna'ö lebar diagram bawaan 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio lö atulö ba konversi prefigure; nioguna'ö rasio aspek bawaan 1.

prefigure-grid-spacing-too-fine = `<graph>`: talaga kisi andrö adogo sibai ba batas sumbu; kisi andrö lö tesura ba perender prefigure.

prefigure-annotations-not-rendered = `<graph>`: anotasi lö tesura na lö nioguna'ö perender PreFigure.

multiple-annotations-children = Oya ono `<annotations>` tesöndra ba `<graph>`; fefu si tenga si ahonoa lö tefaigi.

## Referring to other components

copy-unrecognized-component-type = Tebai mutambö ma musalin tipe komponen si lö mu'ila: { $type }.

copy-prop-not-found = prop { $property } ba komponen tipe { $component } lö tesöndra

collect-no-source = Sumber ba collect lö tesöndra.

collect-invalid-component-type = Tebai mu'owuloi komponen tipe `<{ $component }>` börö me tipe komponen andrö lö atulö.

reference-index-unavailable = Tebai mutunö indeks `{ $reference }`

## `<callAction>`

component-action-unavailable = Tebai mufalua { $action } ba komponen `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Bentuk data lö atulö.  Panjang baris lö faudu. Tesöndra ba componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data so töi kolom si mufuli.  Tesöndra ba componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data lö so sara töi kolom.  Tesöndra ba componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Award wanema li andre faoma fanema li si no mufa'ohe khö tag jawaban andrö samösa, ba da'ö mamazökhi parangi si lö nifalukhaisa.

answer-max-num-attempts-in-section-wide-check-work = Wamazökhi `maxNumAttempts` ba `<answer>` si bakha ba wadah si so `sectionWideCheckWork` lö moguna, börö me oyania fanandraigö nitatö wadah andrö. Fazökhi `maxNumAttempts` ba wadah andrö.

nested-section-wide-check-work-max-num-attempts = Wamazökhi `maxNumAttempts` ba wadah si so `sectionWideCheckWork` si bakha ba wadah bö'ö si so `sectionWideCheckWork` lö moguna, börö me oyania fanandraigö nitatö wadah si baero. Fazökhi `maxNumAttempts` ba wadah si baero andrö.

answer-attributes-need-symbolic-equality = Atribut { $attributes } lö moguna na lö nibe'e symbolicEquality.

answer-invalid-type = Tipe wanema li lö atulö: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Börö me lö so töi komponen `<{ $component }>`, tebai da'ö nioguna'ö simane atribut module

module-attribute-name-already-defined = Komponen `<{ $component } name="{ $name }">` tebai nioguna'ö simane atribut module börö me tipe komponen `<module>` no so atribut "{ $name }".

conditional-content-condition-ignored = Atribut `condition` lö tefaigi ba komponen `<conditionalContent>` si so ono case ma else.

slider-markers-type-mismatch = Tipe marker lö faudu ba tipe slider.

pretzel-problem-needs-statement-and-answer = Pretzel lö atulö: zi sambua `<problem>` moguna so sara `<statement>` awö sara `<answer>`.

pretzel-circuit-first-problem-distractor = Pretzel lö atulö: ba mode="circuit", `<problem>` si föföna tebai tobali distraktor.

## Attribute values

attribute-invalid-values = Nilai { $values } lö atulö ba atribut `{ $attribute }`; lö tefaigi.

attribute-must-be-references = Nilai `{ $value }` lö atulö ba atribut `{ $attribute }`. Atribut moguna mufazökhi moroi ba referensi si mamöböi faoma `$`.

math-input-invalid-function-names = <mathInput>: töi fungsi si lö atulö ba { $attribute } lö tefaigi: { $names }. Zi sambua töi moguna so minimal 2 karakter (huruf ma garis fabali); tola mutambö akhiran `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Tipe komponen lö atulö: `<{ $componentType }>`

attribute-repeated = Tebai mufuli atribut { $attribute }.

attribute-invalid-for-component = Atribut "{ $attribute }" lö atulö ba komponen tipe `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Definisi gaya { $styleNumber } lö adöni kontrasnia ba { $context ->
        [text-on-background] warna teks ba warna latar
        [high-contrast] warna kontras si yawa ba kanvas
        [line] warna garis ba kanvas
        [marker] warna marker ba kanvas
       *[text-on-canvas] warna teks ba kanvas
    }{ $mode ->
        [dark] { " (mode saitö)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; moguna minimal { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Definisi gaya { $styleNumber } so warna si adöni kontrasnia ba mode sahaga, warna mode saitö si otarai nilai andrö lö adöni kontrasnia ba warna teks ba warna latar ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; moguna minimal { $threshold }:1). { $suggestion ->
        [available] Ena'ö adöni kontrasnia ba mode saitö, fa'abölö kontras mode sahaga (duma-duma fazökhi { $lightAttribute }="{ $lightColor }") ma falalini warna mode saitö (duma-duma fazökhi { $darkAttribute }="{ $darkColor }").
       *[none] Ena'ö adöni kontrasnia ba mode saitö, fa'abölö kontras mode sahaga ma falalini warna si otarai andrö faoma textColorDarkMode ba/ma backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Definisi gaya { $styleNumber } so warna teks si adöni kontrasnia ba mode sahaga, warna teks mode saitö si otarai nilai andrö lö adöni kontrasnia ba kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; moguna minimal { $threshold }:1). { $suggestion ->
        [available] Ena'ö adöni kontrasnia ba mode saitö, fa'abölö kontras mode sahaga (duma-duma fazökhi textColor="{ $lightColor }") ma falalini warna mode saitö (duma-duma fazökhi textColorDarkMode="{ $darkColor }").
       *[none] Ena'ö adöni kontrasnia ba mode saitö, fa'abölö kontras mode sahaga ma falalini warna si otarai andrö faoma textColorDarkMode.
    }

section-multiple-style-palettes = Sara bagian ha tola mamili sara <stylePalette>; si ahonoa nioguna'ö.

## Unique variants

variant-num-to-select-not-non-negative-integer = varian si unik khö { $component } tebai mu'ila börö me numToSelect tenga bilangan bulat si lö negatif.

variant-num-to-select-not-constant-number = varian si unik khö { $component } tebai mu'ila börö me numToSelect tenga bilangan si lö falalini.

variant-with-replacement-not-constant-boolean = varian si unik khö { $component } tebai mu'ila börö me withReplacement tenga boolean si lö falalini.

variant-select-weight-disables-unique = Varian si unik ba select lö mohalöwö na so option si so selectWeight ma selectForVariants

variant-coprime-undetermined = varian si unik khö { $component } tebai mu'ila börö me tebai mu'ila hadia coprime lö atulö mamalö.

variant-attribute-not-constant = varian si unik khö { $component } tebai mu'ila börö me { $attribute } falalini.

variant-attribute-not-number = varian si unik khö { $component } tebai mu'ila börö me { $attribute } tenga bilangan.

variant-attribute-wrong-type-for-sequence =
    varian si unik khö { $component } tipe { $type } tebai mu'ila börö me { $attribute } tenga { $expected ->
        [letters-combination] rangkaian huruf
        [math-expression] ekspresi matematika si atulö
        [integer] bilangan bulat
       *[number] bilangan
    }.

variant-length-not-integer = varian si unik khö { $component } tebai mu'ila börö me length tenga bilangan bulat.

variant-sort-not-implemented = lö nasa mufazökhi varian si unik khö { $component } si so sort

variant-exclude-combinations-not-implemented = lö nasa mufazökhi varian si unik khö { $component } si so excludeCombinations

variant-math-exclude-not-implemented = lö nasa mufazökhi varian si unik khö { $component } tipe math si so exclude

variant-non-constant-exclude-not-implemented = lö nasa mufazökhi varian si unik khö { $component } si so exclude si falalini

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: lö tola ba perender prefigure khö graph; ono nifalua'ö.

prefigure-descendant-invalid-geometry = { $subject }: geometri si lö atulö ma si lö ahono; ono nifalua'ö.

prefigure-curve-label-omitted = { $subject }: label lö tola ba elemen kurva nifalalini; label nifalua'ö.

prefigure-curve-unsupported-definition-type = { $subject }: tipe definisi fungsi kurva '{ $definitionType }' lö tola; ono nifalua'ö.

prefigure-region-flip-functions-unsupported = { $subject }: atribut flipFunctions ba regionBetweenCurves lö tola; ono nifalua'ö.

prefigure-region-non-formula-child = { $subject }: ha ono fungsi tipe formula si tola ba regionBetweenCurves; ono nifalua'ö.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' lö tola ba { $labelKind ->
        [line-family] label kelompok garis
       *[point] label titik
    }; nioguna'ö perataan PreFigure bawaan.

prefigure-fill-style-unsupported = { $subject }: gaya isi '{ $fillStyle }' lö tola ba PreFigure; mangawuli ba isi si solid.

prefigure-line-style-unknown = { $subject }: gaya garis '{ $lineStyle }' si lö mu'ila nifalua'ö moroi ba luaran PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: gaya marker '{ $markerStyle }' mufalalini ba gaya PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: gaya marker '{ $markerStyle }' lö tola ba PreFigure; nioguna'ö gaya bawaan.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` lö atulö; target tebai mu'ila. Anotasi nifalua'ö.

annotation-ref-multiple-targets = `<annotation>`: `ref` tumunö ba oya target; si föföna nioguna'ö.

annotation-ref-outside-graph = `<annotation>`: `ref` lö atulö; target andrö si baero moroi ba graph si mangosambua ia. Anotasi nifalua'ö.

annotation-ref-unsupported-target = `<annotation>`: `ref` lö atulö; target andrö tenga objek grafis si tola ba konversi prefigure. Anotasi nifalua'ö.

annotation-text-missing = `<annotation>`: `text` lö so ma lowong; teks si lowong nifazökhi.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Tesöndra katergantungan si mangawuli.
       *[other] Tesöndra katergantungan si mangawuli si so komponen `<{ $componentType }>`.
    }

reference-no-referent = Nitunö referensi lö tesöndra: `{ $reference }`

reference-multiple-referents = Oya nitunö referensi: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format atribut { $attribute } khö `<{ $componentType }>` lö atulö.

children-invalid = Ono `<{ $componentType }>` lö atulö: Tesöndra ono si lö atulö: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Nilai `{ $value }` lö atulö ba atribut `{ $attribute }`, nilai `{ $default }` nioguna'ö

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Versi DoenetML { $version } lö tesöndra.
       *[other] Versi DoenetML { $version } lö tesöndra. Mangawuli ba versi { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML lö atulö: { $content }

parse-tag-missing-close-tag = DoenetML lö atulö: Tag `{ $tag }` lö so tag wanutu. Moguna tag samatutu ia samösa ma tag `</{ $tagName }>`.

parse-tag-error = DoenetML lö atulö: Fasala ba tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML lö atulö: Atribut `{ $attribute }` si lö atulö andre hulö lö so nilainia.

parse-attribute-invalid = DoenetML lö atulö: Atribut `{ $attribute }` lö atulö

parse-attribute-value-invalid = DoenetML lö atulö: Nilai atribut `{ $value }` lö atulö

parse-attribute-value-quote-mismatch = DoenetML lö atulö: Nilai atribut `{ $value }` lö atulö. Tanda kutip lö faudu. Hulö lö so sara `{ $quote }`

parse-open-tag-name-missing = DoenetML lö atulö: Tesöndra tag si lö so töi tag, simane `<`

parse-tag-not-closed = DoenetML lö atulö: Tag `{ $tag }` lö tefatutu (hulö lö so `>`).

parse-self-closing-tag-name-missing = DoenetML lö atulö: Tesöndra tag si lö so töi tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML lö atulö: Tag `{ $tag }` lö tefatutu (hulö lö so `/>`).

parse-tag-invalid-attributes = DoenetML lö atulö: Tag `{ $tag }` lö atulö. Hulö lö atulö atributnia.

parse-close-tag-name-missing = DoenetML lö atulö: Tesöndra tag wanutu si lö so töi tag, simane `</`

parse-attribute-value-unquoted = Nilai atribut moguna ba bakha tanda kutip: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML lö atulö: Tesöndra tag wanutu `{ $tag }`, ba lö so tag wamokai si faudu

parse-close-tag-mismatched = DoenetML lö atulö: Tag wanutu lö faudu. Nifalukhaisa `</{ $expected }>`. Si tesöndra `{ $found }`

parser-node-unconvertible = Node { $node } tebai mufalalini tobali node Dast.

## Names

name-attribute-invalid =
    Töi atribut name='{ $name }' lö atulö. { $reason ->
        [characters] Töi ha tola so huruf, angka, garis ba dou ma garis fabali.
       *[start] Töi moguna mamöböi faoma sara huruf.
    }

component-name-invalid-start = Töi komponen "{ $name }" lö atulö. Töi moguna mamöböi faoma sara huruf.

## `<answer>` sugar

answer-video-watched-missing-video = Jawaban tipe videoWatched moguna so atribut video

answer-video-watched-video-not-reference = Jawaban tipe videoWatched moguna so atribut video si sara referensi

answer-name-not-single-text = Atribut name khö jawaban moguna so sara ono text manö

## Referencing another document

external-doenetml-recursion-limit = DoenetML si baero tebai muhalö börö me oya sibai lapisan rekursinia. Hadia so referensi si mangawuli?

external-doenetml-unavailable = DoenetML moroi ba { $attribute }="{ $uri }" tebai muhalö

external-doenetml-type-mismatch = DoenetML nihalö moroi ba { $attribute }="{ $uri }" lö atulö: lö faudu ba tipe komponen "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` no tebolokhi; oguna'ö `{ $to }`.
       *[other] [deprecation] Atribut `{ $from }` ba `<{ $component }>` no tebolokhi; oguna'ö `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` no tebolokhi ba lö tefaigi börö me `{ $to }` nibe'e göi.
       *[other] [deprecation] Atribut `{ $from }` ba `<{ $component }>` no tebolokhi ba lö tefaigi börö me `{ $to }` nibe'e göi.
    }

deprecated-attribute-ignored = [deprecation] Atribut `{ $attribute }` ba `<{ $component }>` no tebolokhi ba lö tefaigi.

deprecated-attribute-to-child = [deprecation] Atribut `{ $attribute }` ba `<{ $component }>` no tebolokhi; oguna'ö ono `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Nilai `{ $value }` khö atribut `{ $attribute }` ba `<{ $component }>` no tebolokhi; oguna'ö `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` ha tola mamazökhi bentuk jamak li Inggris, andrö wa teksnia lö mufalalini ba dokumen nisura faoma { $locale }. Sura bentuk jamaknia sanöndra, ma fazökhi faoma atribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elemen `<{ $tag }>` tenga elemen Doenet si mu'ila.

schema-element-not-allowed-at-root = Elemen `<{ $tag }>` lö tola ba wamöböi dokumen.

schema-element-not-allowed-inside = Elemen `<{ $tag }>` lö tola ba bakha `<{ $parent }>`.

schema-attribute-unrecognized = Elemen `<{ $tag }>` lö so atribut si möi töi `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribut `{ $attribute }` khö elemen `<{ $tag }>` moguna sara daftar si zi sambua itemnia sara moroi ba: { $allowed }
       *[other] Atribut `{ $attribute }` khö elemen `<{ $tag }>` moguna sara moroi ba: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Töi varian khö select lö atulö.  Töi varian { $variantName } so ba { $numOptions } option ba oyania nifili { $numToSelect }.

select-variant-name-without-options = So varian nibe'e ba select ba lö so option ba töi varian si tola: { $variantName }.

select-variant-name-not-possible = Töi varian { $variantName } nibe'e ba select tenga töi varian si tola.

select-too-few-options = Tebai mufili { $numToSelect } komponen moroi ba { $numOptions } manö.

select-from-sequence-too-few-values = Tebai mufili { $numToSelect } nilai moroi ba sequence si so panjang { $length }.

select-from-sequence-indices-count-mismatch = Oyania indices nibe'e ba select moguna faudu ba oyania nifili

select-from-sequence-indices-not-integers = Fefu indices nibe'e ba select moguna bilangan bulat

select-from-sequence-index-excluded = Indeks selectfromsequence nibe'e andrö no niheta

select-from-sequence-indices-excluded-combination = indices selectfromsequence nibe'e andrö sara kombinasi niheta

select-from-sequence-coprime-not-positive-integers = Tebai mufili kombinasi coprime börö me si nifili tenga bilangan bulat positif.

select-from-sequence-coprime-common-factor = Tebai mufili bilangan coprime. Fefu nilai si tola so faktor si sara. (Nilai "from" ma "to" nibe'e moguna coprime awö "step".)

select-from-sequence-coprime-single-number = Tebai mufili kombinasi coprime moroi ba sara bilangan si tenga 1.

select-from-sequence-excluded-too-many-combinations = Abölö moroi ba 70% kombinasi niheta ba selectFromSequence

select-from-sequence-coprime-none-found = Tebai mufili bilangan coprime. Fefu nilai si tola so faktor si sara.

select-from-sequence-too-few-unique-values = Tebai mufili { $numToSelect } nilai si unik moroi ba sequence si so panjang { $numPossibleValues }

select-prime-numbers-too-few-values = Tebai mufili { $numToSelect } nilai moroi ba daftar bilangan prima si so panjang { $numValues }

select-prime-numbers-values-count-mismatch = Oyania nilai nibe'e ba select moguna faudu ba oyania nifili

select-prime-numbers-values-not-prime = Fefu nilai nibe'e ba select bilangan prima moguna so ba daftar bilangan prima

select-prime-numbers-values-excluded-combination = Nilai selectPrimeNumbers nibe'e andrö sara kombinasi niheta

select-prime-numbers-excluded-too-many-combinations = Abölö moroi ba 70% kombinasi niheta ba selectPrimeNumbers

select-random-combination-fluke = Börö me hulö si lö falukha sibai, kombinasi nilai acak tebai mufili

select-random-value-fluke = Börö me hulö si lö falukha sibai, nilai acak tebai mufili

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] `<{ $component }>` andre lö tesura börö me ba bakha matematika ia ba lö `inline`. Tambö `inline` ena'ö tobali daftar si mangawuli tou, si faudu ba bakha sara ekspresi.
        [expanded] `<{ $component }>` andre lö tesura börö me ba bakha matematika ia ba `expanded`. Heta `expanded`; kotak si oya barisnia lö faudu ba bakha sara ekspresi.
        [on-graph] `<{ $component }>` andre lö tesura börö me ba bakha matematika nisura ba graph ia, si lö so nahia ba masukan.
       *[relative-width] `<{ $component }>` andre lö tesura börö me ba bakha matematika ia ba so lebar relatif. Be'e lebarnia faoma satuan absolut, simane `px`.
    }
