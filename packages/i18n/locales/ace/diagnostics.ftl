# Acehnese diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
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
# Acehnese marks no number on the noun, so a counted message whose only English
# difference is the noun's number renders one string here and the select is
# dropped. The count still arrives and is still formatted.


## `<lineSegment>`

# No select: «hana geuhiro» does not agree with what is ignored, and the list
# carries no number of its own.
line-segment-attributes-ignored-with-endpoints = hana geuhiro { $attributes } meunyo dua ujông ka geupeuteuntee

line-segment-attributes-ignored-with-endpoint-and-midpoint = hana geuhiro { $attributes } meunyo saboh ujông ngon titék teungoh ka geupeuteuntee bandua

line-segment-midpoint-offset-without-midpoint = midpointOffset hana meuguna meunyo hana titék teungoh

## `<line>`

line-points-undetermined-dimensions = Garéh nyang lheuëh bak titék nyang hana teupeuteuntee dimensi jih.

line-points-too-few-dimensions = Garéh harôh lheuëh bak titék nyang na paléng kureueng dua dimensi.

line-points-depend-on-variables = Garéh lheuëh bak titék nyang meugantông bak variabel: { $variables }.

line-equation-invalid-format = Format persamaan garéh nyang hana sah bak variabel { $variable1 } ngon { $variable2 }.

## `<ray>`

ray-overprescribed-through = Sinar geupeuteuntee lé through, endpoint ngon direction.  Hana geuhiro through nyang geupeuteuntee.

ray-dimension-mismatch = numDimensions hana meucoco bak sinar.

## `<vector>`

vector-overprescribed-head = Vektor geupeuteuntee lé head, tail ngon displacement.  Hana geuhiro head nyang geupeuteuntee.

vector-dimension-mismatch = numDimensions hana meucoco bak vektor.

## Attracting and constraining

attract-to-without-nearest-point = Hana jeuet teutarék u `<{ $component }>` sabab jih hana variabel keuadaan nearestPoint.

constrain-to-without-nearest-point = Hana jeuet teuikat u `<{ $component }>` sabab jih hana variabel keuadaan nearestPoint.

constrain-to-interior-without-nearest-point = Hana jeuet teuikat u lam `<{ $component }>` sabab jih hana variabel keuadaan nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = hana geuhiro labelPosition bak choiceInput nyang hana inline

## Ordering children by index

choice-input-indices-count-mismatch = Hana geuhiro indeks nyang geupeuteuntee keu choiceInput sabab jumlah indeks hana meucoco ngon jumlah aneuk pilihan.

pretzel-indices-count-mismatch = Hana geuhiro indeks nyang geupeuteuntee keu problem sabab jumlah indeks hana meucoco ngon jumlah aneuk problem.

shuffle-indices-count-mismatch = Hana geuhiro indeks nyang geupeuteuntee keu shuffle sabab jumlah indeks hana meucoco ngon jumlah komponen.

indices-ignored-out-of-range = Hana geuhiro indeks nyang geupeuteuntee keu { $component } sabab na indeks nyang leubèh nibak jangkauan.

pretzel-indices-repeated = Hana geuhiro indeks nyang geupeuteuntee keu pretzel sabab na indeks nyang meuulang.

pretzel-circuit-first-index = Hana geuhiro indeks nyang geupeuteuntee keu pretzel bak mode circuit sabab indeks phon harôh 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Mangat `<{ $component }>` jeuet meujalan ngon aneuk string, atribut `type` harôh geupeuteuntee.

invalid-type-defaulting-to-math = type { $type } hana sah keu komponen { $component }. Harôh saboh nibak math, text, number, atawa boolean. Geuguna math.

string-not-valid-component-to-arrange = String "{ $value }" kon komponen nyang sah keu { $component }. Hana geuhiro.

## Types and variables

invalid-type-defaulting-to-number = type { $type } hana sah, type geupeuduek u number.

invalid-variable-value = Nilai variabel nyang hana sah: `{ $value }`

## Variants

variant-index-must-be-number = Indeks varian { $index } harôh angka

variant-index-must-be-integer = Indeks varian { $index } harôh bileuëng buleuët

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` gohlom teupeuguna keu ukuran mutlak. Luaih geupeuduek jeuet relatif.

side-by-side-absolute-margins = `<{ $component }>` gohlom teupeuguna keu ukuran mutlak. Margin geupeuduek jeuet relatif.

side-by-side-no-block-child = `<{ $component }>` hana sah: jih harôh na paléng kureueng saboh aneuk block.

## `<label>`

label-for-ignored-on-graphical = Hana geuhiro atribut `for` bak `<label>` grafis.

label-for-must-resolve-to-one = Atribut `for` bak `<label>` harôh tunyok teupat u saboh komponen.

label-for-unresolved = Atribut `for` bak `<label>` hana ék jitunyok u saboh komponen.

label-for-answer-with-authored-inputs = Atribut `for` bak `<label>` jitunyok u `<answer>` nyang na input nyang geutuléh lé nyang tuléh; tunyok input nyan langsông.

label-for-answer-without-input = Atribut `for` bak `<label>` jitunyok u `<answer>` nyang hana input keu geubri label.

label-for-must-reference-input-or-answer = Atribut `for` bak `<label>` harôh tunyok u saboh input atawa saboh answer.

## Accessibility

accessibility-short-description-or-decorative = Keu aksesibilitas, `<{ $component }>` harôh na keterangan paneuk atawa geupeuteuntee sibagoë hiasan.

accessibility-video-short-description = Keu aksesibilitas, `<video>` harôh na keterangan paneuk.

accessibility-input-short-description-or-label = Keu aksesibilitas, `<{ $component }>` harôh na keterangan paneuk atawa label.

accessibility-answer-input-short-description-or-label = Keu aksesibilitas, `<answer>` nyang peugöt input harôh na keterangan paneuk atawa label.

accessibility-short-description-contains-math = Keterangan paneuk hana jeuet na komponen matematika lagée `<{ $component }>`. Tuléh matematika nyan ngon haba.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Kontras { $colorName } kureueng keu teks ulèë bagian (mode seupôt) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; peureulèë paléng kureueng { $threshold }:1).
       *[other] Kontras { $colorName } kureueng keu teks ulèë bagian ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; peureulèë paléng kureueng { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` nyang lheuëh bak { $count } titék gohlom teupeuguna meunyo titék nyan hana nilai angka.

circle-too-many-through-points = Hana jeuet teukira bulat nyang lheuëh bak leubèh nibak 3 titék.

circle-overprescribed-radius-center-points = Hana jeuet teukira bulat nyang geupeuteuntee jeujarôë, pusat ngon titék nyang jilheuëh.

circle-center-with-multiple-points = Hana jeuet teukira bulat nyang geupeuteuntee pusat jih teuma jilheuëh bak leubèh nibak 1 titék.

circle-radius-too-small = Hana jeuet teukira bulat: sabab jarak dua titék nyan { $distance }, jeujarôë { $radius } nyang geupeuteuntee ubit that.

circle-radius-with-many-points = Hana jeuet teupeugöt bulat nyang lheuëh bak leubèh nibak dua titék ngon jeujarôë nyang geupeuteuntee.

circle-invalid-center-or-through-points = Pusat atawa titék nyang jilheuëh lé bulat hana sah.

circle-radius-center-with-multiple-points = Hana jeuet teukira jeujarôë bulat nyang geupeuteuntee pusat jih teuma jilheuëh bak leubèh nibak 1 titék.

circle-change-radius-non-numerical = Hana jeuet teuubah jeujarôë bulat nyang lheuëh bak titék nyang hana angka

circle-radius-with-points-non-numerical = Hana jeuet teupeugöt bulat nyang lheuëh bak leubèh nibak saboh titék ngon jeujarôë nyang geupeuteuntee meunyo hana nilai angka.

circle-change-center-non-numerical = Peuubah pusat bulat nyang lheuëh bak titék nyang hana nilai angka gohlom teupeuguna.

## `<function>`

# English's two counts multiply out to four sentences; Acehnese has one, because
# «interval» and «input» do not change for number. Both selects are dropped and
# both counts still arrive.
function-domain-insufficient-dimensions = Dimensi domain keu fungsi kureueng. Domain na { $intervals } interval teuma fungsi na { $inputs } input.

function-domain-invalid-format = Format domain keu fungsi hana sah.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Hana geuhiro nilai paléng rayeuk fungsi nyang hana angka.
        [minimum] Hana geuhiro nilai paléng ubit fungsi nyang hana angka.
        [extremum] Hana geuhiro ekstremum fungsi nyang hana angka.
        [point] Hana geuhiro titék fungsi nyang hana angka.
        [slope] Hana geuhiro kemiringan fungsi nyang hana angka.
       *[other] Hana geuhiro { $type } fungsi nyang hana angka.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Hana geuhiro nilai paléng rayeuk fungsi nyang soh.
        [minimum] Hana geuhiro nilai paléng ubit fungsi nyang soh.
        [extremum] Hana geuhiro ekstremum fungsi nyang soh.
        [point] Hana geuhiro titék fungsi nyang soh.
       *[other] Hana geuhiro { $type } fungsi nyang soh.
    }

function-points-too-close = Fungsi na dua titék nyang teumpat jih rap that. Fungsi hana ék teubataih.

# Both selects dropped, for the reason above.
function-iterates-input-output-mismatch = Iterasi fungsi jeuet mantong meunyo jumlah input saban ngon jumlah output. Fungsi nyoe na { $inputs } input ngon { $outputs } output.

## `<sequence>`

sequence-invalid-length = Panyang sequence hana sah.  Harôh bileuëng buleuët nyang hana negatif.

sequence-invalid-step = step sequence hana sah.  Harôh angka keu sequence type { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" sequence angka hana sah.  Harôh angka.

sequence-invalid-endpoint-letters = "{ $attribute }" sequence huruf hana sah.  Harôh kombinasi huruf.

sequence-invalid-endpoint = "{ $attribute }" sequence hana sah.

select-from-sequence-coprime-not-numbers = hana geuhiro coprime sabab nyang geupileh kon angka

select-from-sequence-coprime-with-exclude-combinations = hana geuhiro coprime sabab excludeCombinations geupeuteuntee

## Resolving a `target`

target-not-found = target hana sah keu `<{ $source }>`: target hana meuteumeung.

target-state-variable-not-found = target hana sah keu `<{ $source }>`: variabel keuadaan nyang meunan "{ $property }" hana meuteumeung bak `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Variabel `<odeSystem>` harôh laén nibak variabel beubaih.

ode-system-duplicate-variable-names = Hana jeuet teubataih fungsi RHS ODE nyang nan variabel meugantông jih saban.

ode-system-rhs-function-error = Hana jeuet teubataih fungsi RHS ODE.  Na salah watèe peugöt fungsi mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Hana jeuet teubataih sudut lam antara { $count } garéh

angle-invalid-through-point = Titék nyang hana sah bak through `<angle>`

parabola-vertex-too-many-points = Parabola nyang na puncak teuma jilheuëh bak leubèh nibak 1 titék gohlom teupeuguna.

parabola-too-many-points = Parabola nyang lheuëh bak leubèh nibak 3 titék gohlom teupeuguna.

intersection-too-many-items = Peurpotongan keu leubèh nibak dua boh barang gohlom teupeuguna

## Other math components

ionic-compound-not-two-ions = Sanyawa ionik keu nyang laén nibak dua ion gohlom teupeuguna.

ionic-compound-needs-cation-and-anion = Sanyawa ionik teupeuguna mantong keu saboh kation ngon saboh anion.

solve-equations-cannot-evaluate = Hana jeuet teupeuseulesai persamaan sabab persamaan hana ék teunilai: { $equation }

math-operators-operand-number-required = operandNumber harôh geupeuteuntee meunyo neucok operand matematika.

eigen-decomposition-failed = Hana jeuet teukira eigenvalue matriks

## `<matchesPattern>`

# No select: the parameter list carries no number that the noun would show.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: parameter { $parameters } hana teuka bak pattern, ngon lagée nyan jih sabé meucoco ngon nyang soh.

## `<graph>`

graph-grid-invalid = `<graph>`: hana meupham grid="{ $grid }". Harôh none, medium, dense, atawa dua angka positif nyang meupisah ngon spasi, lagée grid="1 0.5". Hana grid nyang teulukéh.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" hana teudukong bak renderer prefigure; geuguna sifat posisi uneun.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" hana teudukong bak renderer prefigure; geuguna sifat posisi ateuh.

prefigure-invalid-axis-bounds = `<graph>`: bataih sumbu hana sah keu konversi prefigure; geuguna bbox baku (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: luaih hana sah keu konversi prefigure; geuguna luaih diagram baku 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio hana sah keu konversi prefigure; geuguna aspect ratio baku 1.

prefigure-grid-spacing-too-fine = `<graph>`: jarak grid rap that keu bataih sumbu; grid hana teulukéh bak renderer prefigure.

prefigure-annotations-not-rendered = `<graph>`: annotation hana teulukéh meunyo hana geuguna renderer PreFigure.

multiple-annotations-children = Le aneuk `<annotations>` meuteumeung bak `<graph>`; banmandum hana geuhiro seulaén nyang paléng akhé.

## Referring to other components

copy-unrecognized-component-type = Hana jeuet teupeupanyang atawa teusalén jeuneh komponen nyang hana teuturi: { $type }.

copy-prop-not-found = Prop { $property } hana meuteumeung bak komponen jeuneh { $component }

collect-no-source = Hana meuteumeung source keu collect.

collect-invalid-component-type = Hana jeuet teukumpôi komponen jeuneh `<{ $component }>` sabab jeuneh komponen hana sah.

reference-index-unavailable = Hana jeuet teurujuk indeks `{ $reference }`

## `<callAction>`

component-action-unavailable = Hana jeuet teuhôi { $action } bak komponen `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Bentuk data hana sah.  Panyang barih hana saban. Meuteumeung bak componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data na nan kolom nyang saban.  Meuteumeung bak componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data kureueng nan kolom.  Meuteumeung bak componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Award jaweueb nyoe meudasar bak jaweueb nyang geukirém lé answer tag keudroë, ngon nyan teuka sifat nyang hana geuharap.

answer-max-num-attempts-in-section-wide-check-work = Peuduek `maxNumAttempts` bak `<answer>` lam wadah nyang na `sectionWideCheckWork` hana meuguna, sabab wadah nyan nyang peuatô jumlah cuba. Peuduek `maxNumAttempts` bak wadah nyan.

nested-section-wide-check-work-max-num-attempts = Peuduek `maxNumAttempts` bak wadah nyang na `sectionWideCheckWork` nyang na lam wadah laén nyang na `sectionWideCheckWork` hana meuguna, sabab wadah di luwa nyang peuatô jumlah cuba. Peuduek `maxNumAttempts` bak wadah di luwa.

# No select: «atribut» is the same word for one and for many.
answer-attributes-need-symbolic-equality = Atribut { $attributes } hana meuguna meunyo symbolicEquality hana geupeuduek.

answer-invalid-type = Jeuneh jaweueb nyang hana sah: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Sabab komponen `<{ $component }>` hana meunan, jih hana jeuet teuguna keu atribut module

module-attribute-name-already-defined = Komponen `<{ $component } name="{ $name }">` hana jeuet teuguna sibagoë atribut module sabab jeuneh komponen `<module>` ka na atribut "{ $name }".

conditional-content-condition-ignored = Hana geuhiro atribut `condition` bak komponen `<conditionalContent>` nyang na aneuk case atawa else.

slider-markers-type-mismatch = Jeuneh marker hana meucoco ngon jeuneh slider.

pretzel-problem-needs-statement-and-answer = Pretzel hana sah: tiep `<problem>` harôh na saboh `<statement>` ngon saboh `<answer>`.

pretzel-circuit-first-problem-distractor = Pretzel hana sah: bak mode="circuit", `<problem>` phon hana jeuet distractor.

## Attribute values

# No select: «nilai» is the same word for one and for many.
attribute-invalid-values = Nilai { $values } hana sah keu atribut `{ $attribute }`; hana geuhiro.

attribute-must-be-references = Nilai `{ $value }` hana sah keu atribut `{ $attribute }`. Atribut harôh teususôn nibak rujukan nyang phon ngon `$`.

math-input-invalid-function-names = <mathInput>: hana geuhiro nan fungsi nyang hana sah bak { $attribute }: { $names }. Tiep nan harôh na paléng kureueng 2 karakter (huruf atawa tanda sambông); jeuet meuseutôt sufiks `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Jeuneh komponen nyang hana sah: `<{ $componentType }>`

attribute-repeated = Atribut { $attribute } hana jeuet teuulang.

attribute-invalid-for-component = Atribut "{ $attribute }" hana sah keu komponen jeuneh `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Kontras bataih gaya { $styleNumber } kureueng keu { $context ->
        [text-on-background] warna teks lawan warna laté
        [high-contrast] warna kontras manyang lawan kanvas
        [line] warna garéh lawan kanvas
        [marker] warna marker lawan kanvas
       *[text-on-canvas] warna teks lawan kanvas
    }{ $mode ->
        [dark] { " (mode seupôt)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; peureulèë paléng kureueng { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Bahle bataih gaya { $styleNumber } na warna nyang geupeuteuntee ngon kontras nyang cukôp keu mode trang, kontras warna teks lawan warna laté kureueng bak warna nyang geucok keu mode seupôt ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; peureulèë paléng kureueng { $threshold }:1). { $suggestion ->
        [available] Mangat kontras jih cukôp bak mode seupôt, tamah kontras mode trang (miseu, peuduek { $lightAttribute }="{ $lightColor }") atawa gantoë warna mode seupôt (miseu, peuduek { $darkAttribute }="{ $darkColor }").
       *[none] Mangat kontras jih cukôp bak mode seupôt, tamah kontras mode trang atawa gantoë warna nyang geucok ngon textColorDarkMode dan/atawa backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Bahle bataih gaya { $styleNumber } na warna teks nyang geupeuteuntee ngon kontras nyang cukôp keu mode trang, kontras warna teks nyang geucok keu mode seupôt kureueng lawan kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; peureulèë paléng kureueng { $threshold }:1). { $suggestion ->
        [available] Mangat kontras jih cukôp bak mode seupôt, tamah kontras mode trang (miseu, peuduek textColor="{ $lightColor }") atawa gantoë warna mode seupôt (miseu, peuduek textColorDarkMode="{ $darkColor }").
       *[none] Mangat kontras jih cukôp bak mode seupôt, tamah kontras mode trang atawa gantoë warna nyang geucok ngon textColorDarkMode.
    }

section-multiple-style-palettes = Saboh bagian jeuet jipileh saboh mantong <stylePalette>; geuguna nyang paléng akhé.

## Unique variants

variant-num-to-select-not-non-negative-integer = hana jeuet teupeuteuntee varian tunggai { $component } sabab numToSelect kon bileuëng buleuët nyang hana negatif.

variant-num-to-select-not-constant-number = hana jeuet teupeuteuntee varian tunggai { $component } sabab numToSelect kon angka teutap.

variant-with-replacement-not-constant-boolean = hana jeuet teupeuteuntee varian tunggai { $component } sabab withReplacement kon boolean teutap.

variant-select-weight-disables-unique = Varian tunggai keu select geupeumatee meunyo na opsi nyang geupeuteuntee selectWeight atawa selectForVariants

variant-coprime-undetermined = hana jeuet teupeuteuntee varian tunggai { $component } sabab hana jeuet teupeuteuntee coprime sabé false.

variant-attribute-not-constant = hana jeuet teupeuteuntee varian tunggai { $component } sabab { $attribute } hana teutap.

variant-attribute-not-number = hana jeuet teupeuteuntee varian tunggai { $component } sabab { $attribute } kon angka.

variant-attribute-wrong-type-for-sequence =
    hana jeuet teupeuteuntee varian tunggai { $component } jeuneh { $type } sabab { $attribute } kon { $expected ->
        [letters-combination] kombinasi huruf
        [math-expression] ungkapan matematika nyang sah
        [integer] bileuëng buleuët
       *[number] angka
    }.

variant-length-not-integer = hana jeuet teupeuteuntee varian tunggai { $component } sabab length kon bileuëng buleuët.

variant-sort-not-implemented = varian tunggai { $component } nyang na sort gohlom teupeuguna

variant-exclude-combinations-not-implemented = varian tunggai { $component } nyang na excludeCombinations gohlom teupeuguna

variant-math-exclude-not-implemented = varian tunggai { $component } jeuneh math nyang na exclude gohlom teupeuguna

variant-non-constant-exclude-not-implemented = varian tunggai { $component } nyang na exclude hana teutap gohlom teupeuguna

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: hana teudukong bak renderer prefigure graph; keuturunan teulangkah.

prefigure-descendant-invalid-geometry = { $subject }: geometri jih hana teubataih atawa hana leungkap; keuturunan teulangkah.

prefigure-curve-label-omitted = { $subject }: label hana teudukong bak elemen lengkông nyang geukonversi; label hana geuhiro.

prefigure-curve-unsupported-definition-type = { $subject }: jeuneh bataih fungsi lengkông '{ $definitionType }' hana teudukong; keuturunan teulangkah.

prefigure-region-flip-functions-unsupported = { $subject }: atribut flipFunctions bak regionBetweenCurves hana teudukong; keuturunan teulangkah.

prefigure-region-non-formula-child = { $subject }: aneuk fungsi jeuneh formula mantong nyang teudukong bak regionBetweenCurves; keuturunan teulangkah.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' hana teudukong keu { $labelKind ->
        [line-family] label keuluarga garéh
       *[point] label titék
    }; geuguna perataan baku PreFigure.

prefigure-fill-style-unsupported = { $subject }: gaya asoë '{ $fillStyle }' hana teudukong lé PreFigure; woë u asoë nyang padat.

prefigure-line-style-unknown = { $subject }: gaya garéh '{ $lineStyle }' hana teuturi, hana geuhiro bak output PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: gaya marker '{ $markerStyle }' geupeuduek u gaya 'diamond' PreFigure.

prefigure-marker-style-unsupported = { $subject }: gaya marker '{ $markerStyle }' hana teudukong lé PreFigure; geuguna gaya baku.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` hana sah; target hana ék teutunyok. Annotation hana geuhiro.

annotation-ref-multiple-targets = `<annotation>`: `ref` jitunyok u le target; geuguna target phon.

annotation-ref-outside-graph = `<annotation>`: `ref` hana sah; target na di luwa graph nyang na jih. Annotation hana geuhiro.

annotation-ref-unsupported-target = `<annotation>`: `ref` hana sah; target kon objek grafis nyang teudukong bak konversi prefigure. Annotation hana geuhiro.

annotation-text-missing = `<annotation>`: `text` kureueng atawa soh; geupeuteubiet teks soh.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Meuteumeung keugantôngan nyang meulingka.
       *[other] Meuteumeung keugantôngan nyang meulingka nyang meulibat komponen `<{ $componentType }>`.
    }

reference-no-referent = Hana meuteumeung nyang geutunyok lé rujukan: `{ $reference }`

reference-multiple-referents = Le nyang geutunyok lé rujukan: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format atribut { $attribute } bak `<{ $componentType }>` hana sah.

children-invalid = Aneuk `<{ $componentType }>` hana sah: meuteumeung aneuk nyang hana sah: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Nilai `{ $value }` hana sah keu atribut `{ $attribute }`, geuguna nilai `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Versi DoenetML { $version } hana meuteumeung.
       *[other] Versi DoenetML { $version } hana meuteumeung. Woë u versi { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML hana sah: { $content }

parse-tag-missing-close-tag = DoenetML hana sah: Tag `{ $tag }` hana na tag peunutôb. Geuharap tag nyang jitôb droë atawa tag `</{ $tagName }>`.

parse-tag-error = DoenetML hana sah: Na salah bak tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML hana sah: Atribut `{ $attribute }` nyang hana sah lagée kureueng nilai.

parse-attribute-invalid = DoenetML hana sah: Atribut `{ $attribute }` hana sah

parse-attribute-value-invalid = DoenetML hana sah: Nilai atribut `{ $value }` hana sah

parse-attribute-value-quote-mismatch = DoenetML hana sah: Nilai atribut `{ $value }` hana sah. Tanda kutip hana meucoco. Lagée kureueng saboh `{ $quote }`

parse-open-tag-name-missing = DoenetML hana sah: Meuteumeung tag nyang hana meunan, miseu `<`

parse-tag-not-closed = DoenetML hana sah: Tag `{ $tag }` hana teutôb (lagée kureueng `>`).

parse-self-closing-tag-name-missing = DoenetML hana sah: Meuteumeung tag nyang hana meunan `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML hana sah: Tag `{ $tag }` hana teutôb (lagée kureueng `/>`).

parse-tag-invalid-attributes = DoenetML hana sah: Tag `{ $tag }` hana sah. Mungken atribut jih hana beutôi.

parse-close-tag-name-missing = DoenetML hana sah: Meuteumeung tag peunutôb nyang hana meunan, miseu `</`

parse-attribute-value-unquoted = Nilai atribut harôh geupeuduek lam tanda kutip: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML hana sah: Meuteumeung tag peunutôb `{ $tag }`, teuma hana tag peuhah nyang meucoco

parse-close-tag-mismatched = DoenetML hana sah: Tag peunutôb hana meucoco. Geuharap `</{ $expected }>`. Meuteumeung `{ $found }`

parser-node-unconvertible = Node { $node } hana ék teukonversi jeuet node Dast.

## Names

name-attribute-invalid =
    Atribut name='{ $name }' hana sah. { $reason ->
        [characters] Nan jeuet na huruf, angka, garéh yup atawa tanda sambông mantong.
       *[start] Nan harôh phon ngon huruf.
    }

component-name-invalid-start = Nan komponen "{ $name }" hana sah. Nan harôh phon ngon huruf.

## `<answer>` sugar

answer-video-watched-missing-video = Answer nyang type videoWatched harôh na atribut video

answer-video-watched-video-not-reference = Answer nyang type videoWatched harôh na atribut video nyang meurupa rujukan

answer-name-not-single-text = Atribut name bak answer harôh na saboh aneuk text mantong

## Referencing another document

external-doenetml-recursion-limit = Hana jeuet teucok DoenetML di luwa sabab tingkat meuulang jih le that. Na kheueh rujukan nyang meulingka?

external-doenetml-unavailable = Hana jeuet teucok DoenetML nibak { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML nyang geucok nibak { $attribute }="{ $uri }" hana sah: jih hana meucoco ngon jeuneh komponen "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` hana teuguna lé; guna `{ $to }`.
       *[other] [deprecation] Atribut `{ $from }` bak `<{ $component }>` hana teuguna lé; guna `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` hana teuguna lé ngon hana geuhiro sabab `{ $to }` pih geupeuteuntee.
       *[other] [deprecation] Atribut `{ $from }` bak `<{ $component }>` hana teuguna lé ngon hana geuhiro sabab `{ $to }` pih geupeuteuntee.
    }

deprecated-attribute-ignored = [deprecation] Atribut `{ $attribute }` bak `<{ $component }>` hana teuguna lé ngon hana geuhiro.

deprecated-attribute-to-child = [deprecation] Atribut `{ $attribute }` bak `<{ $component }>` hana teuguna lé; guna aneuk `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Nilai `{ $value }` bak atribut `{ $attribute }` bak `<{ $component }>` hana teuguna lé; guna `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` jeuet jipeule bahsa Inggréh mantong, ngon lagée nyan teks jih hana meuubah lam dokumen nyang geutuléh ngon { $locale }. Tuléh langsông bentuk le jih, atawa peuduek ngon atribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elemen `<{ $tag }>` kon elemen Doenet nyang teuturi.

schema-element-not-allowed-at-root = Elemen `<{ $tag }>` hana teuidin bak ukhuë dokumen.

schema-element-not-allowed-inside = Elemen `<{ $tag }>` hana teuidin lam `<{ $parent }>`.

schema-attribute-unrecognized = Elemen `<{ $tag }>` hana na atribut nyang meunan `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribut `{ $attribute }` bak elemen `<{ $tag }>` harôh meurupa dapeuta nyang tiep asoë jih saboh nibak: { $allowed }
       *[other] Atribut `{ $attribute }` bak elemen `<{ $tag }>` harôh saboh nibak: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nan varian hana sah keu select.  Nan varian { $variantName } teuka bak { $numOptions } opsi teuma jumlah nyang keuneuk teupileh { $numToSelect }.

select-variant-name-without-options = Na varian nyang geupeuteuntee keu select teuma hana opsi nyang geupeuteuntee keu nan varian nyang mungken: { $variantName }.

select-variant-name-not-possible = Nan varian { $variantName } nyang geupeuteuntee keu select kon nan varian nyang mungken.

select-too-few-options = Hana jeuet teupileh { $numToSelect } komponen nibak { $numOptions } mantong.

select-from-sequence-too-few-values = Hana jeuet teupileh { $numToSelect } nilai nibak sequence nyang panyang jih { $length }.

select-from-sequence-indices-count-mismatch = Jumlah indeks nyang geupeuteuntee keu select harôh meucoco ngon jumlah nyang keuneuk teupileh

select-from-sequence-indices-not-integers = Banmandum indeks nyang geupeuteuntee keu select harôh bileuëng buleuët

select-from-sequence-index-excluded = Indeks selectfromsequence nyang geupeuteuntee nyan geupeuteubiet

select-from-sequence-indices-excluded-combination = Indeks selectfromsequence nyang geupeuteuntee nyan kombinasi nyang geupeuteubiet

select-from-sequence-coprime-not-positive-integers = Hana jeuet teupileh kombinasi coprime sabab nyang geupileh kon bileuëng buleuët positif.

select-from-sequence-coprime-common-factor = Hana jeuet teupileh angka coprime. Banmandum nilai nyang mungken na faktor nyang saban. (Nilai "from" atawa "to" nyang geupeuteuntee harôh coprime ngon "step".)

select-from-sequence-coprime-single-number = Hana jeuet teupileh kombinasi coprime nibak saboh angka nyang kon 1.

select-from-sequence-excluded-too-many-combinations = Leubèh nibak 70% kombinasi geupeuteubiet bak selectFromSequence

select-from-sequence-coprime-none-found = Hana ék teupileh angka coprime. Banmandum nilai nyang mungken na faktor nyang saban.

select-from-sequence-too-few-unique-values = Hana jeuet teupileh { $numToSelect } nilai tunggai nibak sequence nyang panyang jih { $numPossibleValues }

select-prime-numbers-too-few-values = Hana jeuet teupileh { $numToSelect } nilai nibak dapeuta prima nyang panyang jih { $numValues }

select-prime-numbers-values-count-mismatch = Jumlah nilai nyang geupeuteuntee keu select harôh meucoco ngon jumlah nyang keuneuk teupileh

select-prime-numbers-values-not-prime = Banmandum nilai nyang geupeuteuntee keu select prime number harôh na lam dapeuta prima

select-prime-numbers-values-excluded-combination = Nilai selectPrimeNumbers nyang geupeuteuntee nyan kombinasi nyang geupeuteubiet

select-prime-numbers-excluded-too-many-combinations = Leubèh nibak 70% kombinasi geupeuteubiet bak selectPrimeNumbers

select-random-combination-fluke = Sabab untông nyang jarang that, hana ék teupileh kombinasi nilai acak

select-random-value-fluke = Sabab untông nyang jarang that, hana ék teupileh nilai acak
