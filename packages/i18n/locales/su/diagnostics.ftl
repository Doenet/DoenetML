# Sundanese diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# SPEECH LEVEL. Written in **loma**, the neutral level, throughout — see the
# header of `chrome.ftl`.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# Sundanese has a single plural category, so a countable message needs no
# selection.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } teu dipaliré lamun dua titik tungtung geus ditangtukeun

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } teu dipaliré lamun titik tungtung jeung titik tengah duanana geus ditangtukeun

line-segment-midpoint-offset-without-midpoint = midpointOffset teu mangaruhan naon-naon lamun euweuh titik tengah

## `<line>`

line-points-undetermined-dimensions = Garis ngaliwatan titik nu diménsina can tangtu.

line-points-too-few-dimensions = Garis kudu ngaliwatan titik nu sahenteuna dua diménsi.

line-points-depend-on-variables = Garis ngaliwatan titik nu gumantung kana variabel: { $variables }.

line-equation-invalid-format = Format persamaan garis dina variabel { $variable1 } jeung { $variable2 } teu bener.

## `<ray>`

ray-overprescribed-through = Sinar ditangtukeun ku through, endpoint jeung direction sakaligus. through nu ditangtukeun teu dipaliré.

ray-dimension-mismatch = numDimensions dina sinar teu cocog.

## `<vector>`

vector-overprescribed-head = Véktor ditangtukeun ku head, tail jeung displacement sakaligus. head nu ditangtukeun teu dipaliré.

vector-dimension-mismatch = numDimensions dina véktor teu cocog.

## Attracting and constraining

attract-to-without-nearest-point = Teu bisa narik ka `<{ $component }>` sabab teu boga variabel kaayaan nearestPoint.

constrain-to-without-nearest-point = Teu bisa ngawatesan ka `<{ $component }>` sabab teu boga variabel kaayaan nearestPoint.

constrain-to-interior-without-nearest-point = Teu bisa ngawatesan ka jero `<{ $component }>` sabab teu boga variabel kaayaan nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition teu dipaliré pikeun choiceInput nu lain inline

## Ordering children by index

choice-input-indices-count-mismatch = indices nu ditangtukeun pikeun choiceInput teu dipaliré sabab jumlah indices teu cocog jeung jumlah anak choice.

pretzel-indices-count-mismatch = indices nu ditangtukeun pikeun problem teu dipaliré sabab jumlah indices teu cocog jeung jumlah anak problem.

shuffle-indices-count-mismatch = indices nu ditangtukeun pikeun shuffle teu dipaliré sabab jumlah indices teu cocog jeung jumlah komponén.

indices-ignored-out-of-range = indices nu ditangtukeun pikeun { $component } teu dipaliré sabab aya indices nu ngaliwat wates.

pretzel-indices-repeated = indices nu ditangtukeun pikeun pretzel teu dipaliré sabab aya indices nu diulang.

pretzel-circuit-first-index = indices nu ditangtukeun pikeun pretzel dina mode circuit teu dipaliré sabab index kahiji kudu 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Sangkan `<{ $component }>` jalan jeung anak nu mangrupa téks, atribut `type` kudu ditangtukeun.

invalid-type-defaulting-to-math = type { $type } teu bener pikeun komponén { $component }. Kudu salah sahiji ti math, text, number atawa boolean. Bakal maké math.

string-not-valid-component-to-arrange = Téks "{ $value }" lain komponén nu bener pikeun { $component }. Teu dipaliré.

## Types and variables

invalid-type-defaulting-to-number = type { $type } teu bener, type disetél jadi number.

invalid-variable-value = Niléy variabel teu bener: `{ $value }`

## Variants

variant-index-must-be-number = index variant { $index } kudu mangrupa angka

variant-index-must-be-integer = index variant { $index } kudu mangrupa wilangan bulat

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` can dijieun pikeun ukuran mutlak. Rubakna disetél jadi rélatif.

side-by-side-absolute-margins = `<{ $component }>` can dijieun pikeun ukuran mutlak. Sisina disetél jadi rélatif.

side-by-side-no-block-child = `<{ $component }>` teu bener: kudu boga sahenteuna hiji anak blok.

## `<label>`

label-for-ignored-on-graphical = Atribut `for` dina `<label>` grafis teu dipaliré.

label-for-must-resolve-to-one = Atribut `for` dina `<label>` kudu nunjuk ka hiji komponén wungkul.

label-for-unresolved = Atribut `for` dina `<label>` teu bisa nunjuk ka komponén naon waé.

label-for-answer-with-authored-inputs = Atribut `for` dina `<label>` nunjuk ka `<answer>` nu inputna ditulis ku pangarangna sorangan; tunjuk inputna langsung.

label-for-answer-without-input = Atribut `for` dina `<label>` nunjuk ka `<answer>` nu teu boga input pikeun dilabélan.

label-for-must-reference-input-or-answer = Atribut `for` dina `<label>` kudu nunjuk ka input atawa answer.

## Accessibility

accessibility-short-description-or-decorative = Pikeun aksésibilitas, `<{ $component }>` kudu boga katerangan pondok atawa ditangtukeun salaku hiasan.

accessibility-video-short-description = Pikeun aksésibilitas, `<video>` kudu boga katerangan pondok.

accessibility-input-short-description-or-label = Pikeun aksésibilitas, `<{ $component }>` kudu boga katerangan pondok atawa labél.

accessibility-answer-input-short-description-or-label = Pikeun aksésibilitas, `<answer>` nu nyieun input kudu boga katerangan pondok atawa labél.

accessibility-short-description-contains-math = Katerangan pondok ulah ngandung komponén matematika saperti `<{ $component }>`. Tuliskeun matematikana ku kecap.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } kontrasna kurang pikeun téks judul bagian (mode poék) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; sahenteuna kudu { $threshold }:1).
       *[other] { $colorName } kontrasna kurang pikeun téks judul bagian ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; sahenteuna kudu { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` ngaliwatan { $count } titik can dijieun pikeun kaayaan titikna teu boga niléy angka.

circle-too-many-through-points = Teu bisa ngitung bunderan nu ngaliwatan leuwih ti 3 titik.

circle-overprescribed-radius-center-points = Teu bisa ngitung bunderan nu jari-jari, puseur jeung titikna ditangtukeun kabéh.

circle-center-with-multiple-points = Teu bisa ngitung bunderan nu puseurna ditangtukeun ngaliwatan leuwih ti 1 titik.

circle-radius-too-small = Teu bisa ngitung bunderan: ku sabab jarak antara dua titik téh { $distance }, jari-jari { $radius } nu ditangtukeun leuwih leutik teuing.

circle-radius-with-many-points = Teu bisa nyieun bunderan ngaliwatan leuwih ti dua titik kalawan jari-jari nu ditangtukeun.

circle-invalid-center-or-through-points = Puseur atawa titik nu diliwatan bunderan teu bener.

circle-radius-center-with-multiple-points = Teu bisa ngitung jari-jari bunderan nu puseurna ditangtukeun ngaliwatan leuwih ti 1 titik.

circle-change-radius-non-numerical = Teu bisa ngarobah jari-jari bunderan nu titikna lain angka

circle-radius-with-points-non-numerical = Teu bisa nyieun bunderan ngaliwatan leuwih ti hiji titik kalawan jari-jari nu ditangtukeun mun teu boga niléy angka.

circle-change-center-non-numerical = Ngarobah puseur bunderan nu ngaliwatan titik lain angka can dijieun.

## `<function>`

function-domain-insufficient-dimensions = Diménsi domain pikeun fungsi kurang. Domain boga { $intervals } interval tapi fungsina boga { $inputs } input.

function-domain-invalid-format = Format domain pikeun fungsi teu bener.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Maksimum fungsi nu lain angka teu dipaliré.
        [minimum] Minimum fungsi nu lain angka teu dipaliré.
        [extremum] Ékstrimum fungsi nu lain angka teu dipaliré.
        [point] Titik fungsi nu lain angka teu dipaliré.
        [slope] Kamiringan fungsi nu lain angka teu dipaliré.
       *[other] { $type } fungsi nu lain angka teu dipaliré.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Maksimum fungsi nu kosong teu dipaliré.
        [minimum] Minimum fungsi nu kosong teu dipaliré.
        [extremum] Ékstrimum fungsi nu kosong teu dipaliré.
        [point] Titik fungsi nu kosong teu dipaliré.
       *[other] { $type } fungsi nu kosong teu dipaliré.
    }

function-points-too-close = Fungsi ngandung dua titik nu tempatna deukeut teuing. Fungsi teu bisa ditangtukeun.

function-iterates-input-output-mismatch = Itérasi fungsi ngan bisa lamun jumlah input sarua jeung jumlah output. Fungsi ieu boga { $inputs } input jeung { $outputs } output.

## `<sequence>`

sequence-invalid-length = Panjang runtuyan teu bener. Kudu wilangan bulat nu teu négatif.

sequence-invalid-step = Léngkah runtuyan teu bener. Kudu angka pikeun runtuyan jinis { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" tina runtuyan angka teu bener. Kudu mangrupa angka.

sequence-invalid-endpoint-letters = "{ $attribute }" tina runtuyan aksara teu bener. Kudu mangrupa kombinasi aksara.

sequence-invalid-endpoint = "{ $attribute }" tina runtuyan teu bener.

select-from-sequence-coprime-not-numbers = coprime teu dipaliré sabab teu keur milih angka

select-from-sequence-coprime-with-exclude-combinations = coprime teu dipaliré sabab excludeCombinations ditangtukeun

## Resolving a `target`

target-not-found = target teu bener pikeun `<{ $source }>`: target teu kapanggih.

target-state-variable-not-found = target teu bener pikeun `<{ $source }>`: variabel kaayaan nu ngaranna "{ $property }" dina `<{ $component }>` teu kapanggih.

## `<odeSystem>`

ode-system-variables-match-independent = Variabel `<odeSystem>` kudu béda ti variabel bébas.

ode-system-duplicate-variable-names = Teu bisa nangtukeun fungsi sisi katuhu ODE nu ngaran variabel gumantungna sarua.

ode-system-rhs-function-error = Teu bisa nangtukeun fungsi sisi katuhu ODE. Aya kasalahan waktu nyieun fungsi mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Teu bisa nangtukeun sudut antara { $count } garis

angle-invalid-through-point = Titik dina through tina `<angle>` teu bener

parabola-vertex-too-many-points = Parabola nu boga puncak sarta ngaliwatan leuwih ti 1 titik can dijieun.

parabola-too-many-points = Parabola nu ngaliwatan leuwih ti 3 titik can dijieun.

intersection-too-many-items = Simpangan pikeun leuwih ti dua barang can dijieun

## Other math components

ionic-compound-not-two-ions = Sanyawa ionik pikeun salian ti dua ion can dijieun.

ionic-compound-needs-cation-and-anion = Sanyawa ionik ngan dijieun pikeun hiji kation jeung hiji anion.

solve-equations-cannot-evaluate = Teu bisa ngarengsekeun persamaan sabab persamaanna teu bisa diévaluasi: { $equation }

math-operators-operand-number-required = operandNumber kudu ditangtukeun waktu nyokot operan matematika.

eigen-decomposition-failed = Teu bisa ngitung niléy éigen tina matriks

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: paraméter { $parameters } teu aya dina polana, jadi bakal salawasna cocog jeung eusi kosong.

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" teu bisa dihartikeun. Kudu none, medium, dense, atawa dua angka positif nu dipisah ku spasi, saperti grid="1 0.5". Teu aya kisi nu digambar.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" teu dirojong dina perénder prefigure; maké paripolah posisi katuhu.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" teu dirojong dina perénder prefigure; maké paripolah posisi luhur.

prefigure-invalid-axis-bounds = `<graph>`: wates sumbu teu bener pikeun konvérsi prefigure; maké bbox baku (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: rubak teu bener pikeun konvérsi prefigure; maké rubak diagram baku 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio teu bener pikeun konvérsi prefigure; maké rasio baku 1.

prefigure-grid-spacing-too-fine = `<graph>`: jarak kisi lemes teuing pikeun wates sumbu; kisina teu digambar dina perénder prefigure.

prefigure-annotations-not-rendered = `<graph>`: anotasi moal digambar lamun teu maké perénder PreFigure.

multiple-annotations-children = Aya anak `<annotations>` leuwih ti hiji dina `<graph>`; kabéh iwal nu panungtungan teu dipaliré.

## Referring to other components

copy-unrecognized-component-type = Teu bisa ngalanjutkeun atawa nyalin jinis komponén nu teu dipikawanoh: { $type }.

copy-prop-not-found = prop { $property } dina komponén jinis { $component } teu kapanggih

collect-no-source = Sumber pikeun collect teu kapanggih.

collect-invalid-component-type = Teu bisa ngumpulkeun komponén jinis `<{ $component }>` sabab éta jinis komponén nu teu bener.

reference-index-unavailable = Teu bisa nunjuk index `{ $reference }`

## `<callAction>`

component-action-unavailable = Teu bisa ngageroan { $action } dina komponén `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Wangun data teu bener. Panjang barisna teu sarua. Kapanggih dina componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data boga ngaran kolom nu sarua. Kapanggih dina componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data kurang ngaran kolom. Kapanggih dina componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award pikeun jawaban ieu dumasar kana jawaban nu dikirim ku answer sorangan, nu bakal ngabalukarkeun paripolah nu teu dipiharep.

answer-max-num-attempts-in-section-wide-check-work = Nyetél `maxNumAttempts` dina `<answer>` di jero wadah nu boga `sectionWideCheckWork` teu mangaruhan naon-naon, sabab jumlah kasempetan dikadalikeun ku wadahna. Setél `maxNumAttempts` dina wadahna waé.

nested-section-wide-check-work-max-num-attempts = Nyetél `maxNumAttempts` dina wadah nu boga `sectionWideCheckWork` sarta aya di jero wadah séjén nu ogé boga `sectionWideCheckWork` teu mangaruhan naon-naon, sabab jumlah kasempetan dikadalikeun ku wadah luar. Setél `maxNumAttempts` dina wadah luar waé.

answer-attributes-need-symbolic-equality = Atribut { $attributes } moal mangaruhan naon-naon lamun symbolicEquality teu disetél.

answer-invalid-type = Jinis teu bener pikeun answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ku sabab komponén `<{ $component }>` teu boga ngaran, éta teu bisa dipaké jadi atribut module

module-attribute-name-already-defined = Komponén `<{ $component } name="{ $name }">` teu bisa dipaké jadi atribut module sabab jinis komponén `<module>` geus boga atribut "{ $name }".

conditional-content-condition-ignored = Atribut `condition` teu dipaliré dina komponén `<conditionalContent>` nu boga anak case atawa else.

slider-markers-type-mismatch = Jinis panyirian teu cocog jeung jinis slider.

pretzel-problem-needs-statement-and-answer = pretzel teu bener: unggal `<problem>` kudu ngandung hiji `<statement>` jeung hiji `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel teu bener: dina mode="circuit", `<problem>` kahiji teu meunang jadi distractor.

## Attribute values

attribute-invalid-values = Niléy { $values } teu bener pikeun atribut `{ $attribute }`; teu dipaliré.

attribute-must-be-references = Niléy `{ $value }` teu bener pikeun atribut `{ $attribute }`. Atribut kudu diwangun ku rujukan nu dimimitian ku `$`.

math-input-invalid-function-names = <mathInput>: ngaran fungsi nu teu bener dina { $attribute } teu dipaliré: { $names }. Bagian témbong unggal ngaran kudu sahenteuna 2 aksara (hurup atawa garis pondok); tungtung `|<mathspeak alternative>` bisa ditambahkeun.

## Building components from the source

component-type-invalid = Jinis komponén teu bener: `<{ $componentType }>`

attribute-repeated = Atribut { $attribute } teu meunang diulang.

attribute-invalid-for-component = Atribut "{ $attribute }" teu bener pikeun komponén jinis `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Watesan gaya { $styleNumber } kontrasna kurang pikeun { $context ->
        [text-on-background] warna téks kana warna latar
        [high-contrast] warna kontras luhur kana kanvas
        [line] warna garis kana kanvas
        [marker] warna panyirian kana kanvas
       *[text-on-canvas] warna téks kana kanvas
    }{ $mode ->
        [dark] { " (mode poék)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; sahenteuna kudu { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Sanajan watesan gaya { $styleNumber } geus nangtukeun warna nu kontrasna cukup pikeun mode caang, warna mode poék nu diturunkeun tina niléy éta kontrasna kurang pikeun warna téks kana warna latar ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; sahenteuna kudu { $threshold }:1). { $suggestion ->
        [available] Sangkan kontrasna cukup dina mode poék, tambahan kontras dina mode caang (contona, setél { $lightAttribute }="{ $lightColor }") atawa ganti warna mode poékna (contona, setél { $darkAttribute }="{ $darkColor }").
       *[none] Sangkan kontrasna cukup dina mode poék, tambahan kontras dina mode caang atawa ganti warna turunanana ku textColorDarkMode jeung/atawa backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Sanajan watesan gaya { $styleNumber } geus nangtukeun warna téks nu kontrasna cukup pikeun mode caang, warna téks mode poék nu diturunkeun tina niléy éta kontrasna kurang kana kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; sahenteuna kudu { $threshold }:1). { $suggestion ->
        [available] Sangkan kontrasna cukup dina mode poék, tambahan kontras dina mode caang (contona, setél textColor="{ $lightColor }") atawa ganti warna mode poékna (contona, setél textColorDarkMode="{ $darkColor }").
       *[none] Sangkan kontrasna cukup dina mode poék, tambahan kontras dina mode caang atawa ganti warna turunanana ku textColorDarkMode.
    }

section-multiple-style-palettes = Hiji bagian ngan bisa milih hiji <stylePalette>; nu panungtungan nu dipaké.

## Unique variants

variant-num-to-select-not-non-negative-integer = teu bisa nangtukeun variant unik tina { $component } sabab numToSelect lain wilangan bulat nu teu négatif.

variant-num-to-select-not-constant-number = teu bisa nangtukeun variant unik tina { $component } sabab numToSelect lain angka anu tetep.

variant-with-replacement-not-constant-boolean = teu bisa nangtukeun variant unik tina { $component } sabab withReplacement lain boolean anu tetep.

variant-select-weight-disables-unique = Variant unik pikeun select dipareuman lamun aya option nu nangtukeun selectWeight atawa selectForVariants

variant-coprime-undetermined = teu bisa nangtukeun variant unik tina { $component } sabab teu bisa ditangtukeun yén coprime salawasna salah.

variant-attribute-not-constant = teu bisa nangtukeun variant unik tina { $component } sabab { $attribute } lain niléy anu tetep.

variant-attribute-not-number = teu bisa nangtukeun variant unik tina { $component } sabab { $attribute } lain angka.

variant-attribute-wrong-type-for-sequence =
    teu bisa nangtukeun variant unik tina { $component } jinis { $type } sabab { $attribute } lain { $expected ->
        [letters-combination] kombinasi aksara
        [math-expression] éksprési matematika nu bener
        [integer] wilangan bulat
       *[number] angka
    }.

variant-length-not-integer = teu bisa nangtukeun variant unik tina { $component } sabab length lain wilangan bulat.

variant-sort-not-implemented = variant unik tina { $component } nu maké sort can dijieun

variant-exclude-combinations-not-implemented = variant unik tina { $component } nu maké excludeCombinations can dijieun

variant-math-exclude-not-implemented = variant unik tina { $component } jinis math nu maké exclude can dijieun

variant-non-constant-exclude-not-implemented = variant unik tina { $component } nu maké exclude teu tetep can dijieun

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: teu dirojong dina perénder prefigure grafik; turunanana dileuwihan.

prefigure-descendant-invalid-geometry = { $subject }: géométrina teu terhingga atawa teu lengkep; turunanana dileuwihan.

prefigure-curve-label-omitted = { $subject }: labél teu dirojong dina élemén kurva nu geus dikonvérsi; labélna dipiceun.

prefigure-curve-unsupported-definition-type = { $subject }: jinis watesan fungsi kurva '{ $definitionType }' teu dirojong; turunanana dileuwihan.

prefigure-region-flip-functions-unsupported = { $subject }: atribut flipFunctions dina regionBetweenCurves teu dirojong; turunanana dileuwihan.

prefigure-region-non-formula-child = { $subject }: ngan fungsi anak jinis rumus nu dirojong dina regionBetweenCurves; turunanana dileuwihan.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' teu dirojong pikeun { $labelKind ->
        [line-family] labél kulawarga garis
       *[point] labél titik
    }; maké susunan baku PreFigure.

prefigure-fill-style-unsupported = { $subject }: gaya eusi '{ $fillStyle }' teu dirojong ku PreFigure; balik ka eusi pinuh.

prefigure-line-style-unknown = { $subject }: gaya garis '{ $lineStyle }' teu dipikawanoh, dipiceun tina kaluaran PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: gaya panyirian '{ $markerStyle }' dipétakeun kana gaya 'diamond' dina PreFigure.

prefigure-marker-style-unsupported = { $subject }: gaya panyirian '{ $markerStyle }' teu dirojong ku PreFigure; maké gaya baku.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` teu bener; targétna teu kapanggih. Anotasina dipiceun.

annotation-ref-multiple-targets = `<annotation>`: `ref` nunjuk ka sababaraha targét; targét kahiji nu dipaké.

annotation-ref-outside-graph = `<annotation>`: `ref` teu bener; targétna aya di luar grafik nu ngamuat. Anotasina dipiceun.

annotation-ref-unsupported-target = `<annotation>`: `ref` teu bener; targétna lain objék grafis nu dirojong dina konvérsi prefigure. Anotasina dipiceun.

annotation-text-missing = `<annotation>`: `text` euweuh atawa kosong; téks kosong nu dikaluarkeun.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Kapanggih gumantungan muter.
       *[other] Kapanggih gumantungan muter nu ngalibetkeun komponén `<{ $componentType }>`.
    }

reference-no-referent = Teu kapanggih nu ditunjuk ku rujukan: `{ $reference }`

reference-multiple-referents = Kapanggih leuwih ti hiji nu ditunjuk ku rujukan: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format atribut { $attribute } tina `<{ $componentType }>` teu bener.

children-invalid = Anak teu bener pikeun `<{ $componentType }>`: kapanggih anak nu teu bener: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Niléy `{ $value }` teu bener pikeun atribut `{ $attribute }`, maké niléy `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML vérsi { $version } teu kapanggih.
       *[other] DoenetML vérsi { $version } teu kapanggih. Balik ka vérsi { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML teu bener: { $content }

parse-tag-missing-close-tag = DoenetML teu bener: Tag `{ $tag }` teu boga tag panutup. Kudu tag nu nutup sorangan atawa tag `</{ $tagName }>`.

parse-tag-error = DoenetML teu bener: Aya kasalahan dina tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML teu bener: Atribut `{ $attribute }` nu teu bener katémbongna kurang niléy.

parse-attribute-invalid = DoenetML teu bener: Atribut `{ $attribute }` teu bener

parse-attribute-value-invalid = DoenetML teu bener: Niléy atribut `{ $value }` teu bener

parse-attribute-value-quote-mismatch = DoenetML teu bener: Niléy atribut `{ $value }` teu bener. Tanda petikna teu cocog. Katémbongna kurang `{ $quote }`

parse-open-tag-name-missing = DoenetML teu bener: Kapanggih tag tanpa ngaran tag, contona `<`

parse-tag-not-closed = DoenetML teu bener: Tag `{ $tag }` can ditutup (katémbongna kurang `>`).

parse-self-closing-tag-name-missing = DoenetML teu bener: Kapanggih tag tanpa ngaran tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML teu bener: Tag `{ $tag }` can ditutup (katémbongna kurang `/>`).

parse-tag-invalid-attributes = DoenetML teu bener: Tag `{ $tag }` teu bener. Bisa jadi atributna salah.

parse-close-tag-name-missing = DoenetML teu bener: Kapanggih tag panutup tanpa ngaran tag, contona `</`

parse-attribute-value-unquoted = Niléy atribut kudu diapit ku tanda petik: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML teu bener: Kapanggih tag panutup `{ $tag }`, tapi euweuh tag muka nu cocog

parse-close-tag-mismatched = DoenetML teu bener: Tag panutup teu cocog. Nu dipiharep `</{ $expected }>`. Nu kapanggih `{ $found }`

parser-node-unconvertible = Node { $node } teu bisa dikonvérsi jadi node Dast.

## Names

name-attribute-invalid =
    Atribut name='{ $name }' teu bener. { $reason ->
        [characters] Ngaran ngan meunang ngandung hurup, angka, garis handap atawa garis pondok.
       *[start] Ngaran kudu dimimitian ku hurup.
    }

component-name-invalid-start = Ngaran komponén "{ $name }" teu bener. Ngaran kudu dimimitian ku hurup.

## `<answer>` sugar

answer-video-watched-missing-video = answer jinis videoWatched kudu boga atribut video

answer-video-watched-video-not-reference = answer jinis videoWatched kudu boga atribut video nu mangrupa rujukan

answer-name-not-single-text = Atribut name dina answer kudu boga hiji anak téks

## Referencing another document

external-doenetml-recursion-limit = DoenetML luar teu bisa dicokot sabab rekursina loba teuing tingkat. Naha aya rujukan nu muter?

external-doenetml-unavailable = DoenetML ti { $attribute }="{ $uri }" teu bisa dicokot

external-doenetml-type-mismatch = DoenetML nu dicokot ti { $attribute }="{ $uri }" teu bener: teu cocog jeung jinis komponén "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` geus teu dipaké deui; paké `{ $to }`.
       *[other] [deprecation] Atribut `{ $from }` dina `<{ $component }>` geus teu dipaké deui; paké `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` geus teu dipaké deui sarta teu dipaliré sabab `{ $to }` ogé ditangtukeun.
       *[other] [deprecation] Atribut `{ $from }` dina `<{ $component }>` geus teu dipaké deui sarta teu dipaliré sabab `{ $to }` ogé ditangtukeun.
    }

deprecated-attribute-ignored = [deprecation] Atribut `{ $attribute }` dina `<{ $component }>` geus teu dipaké deui sarta teu dipaliré.


## Language coverage

pluralize-english-only = `<pluralize>` ngan bisa nyieun wangun jamak basa Inggris, jadi téksna ditinggalkeun sakumaha aslina dina dokumén nu ditulis ku { $locale }. Tuliskeun wangun jamakna langsung, atawa setél ku atribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Élemén `<{ $tag }>` lain élemén Doenet nu dipikawanoh.

schema-element-not-allowed-at-root = Élemén `<{ $tag }>` teu meunang aya dina akar dokumén.

schema-element-not-allowed-inside = Élemén `<{ $tag }>` teu meunang aya di jero `<{ $parent }>`.

schema-attribute-unrecognized = Élemén `<{ $tag }>` teu boga atribut nu ngaranna `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribut `{ $attribute }` dina élemén `<{ $tag }>` kudu mangrupa daptar nu unggal eusina salah sahiji ti: { $allowed }
       *[other] Atribut `{ $attribute }` dina élemén `<{ $tag }>` kudu salah sahiji ti: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Ngaran variant teu bener pikeun select. Ngaran variant { $variantName } muncul dina { $numOptions } option tapi jumlah nu kudu dipilih téh { $numToSelect }.

select-variant-name-without-options = Aya variant nu ditangtukeun pikeun select tapi euweuh option pikeun ngaran variant nu mungkin: { $variantName }.

select-variant-name-not-possible = Ngaran variant { $variantName } nu ditangtukeun pikeun select lain ngaran variant nu mungkin.

select-too-few-options = Teu bisa milih { $numToSelect } komponén ti ngan { $numOptions }.

select-from-sequence-too-few-values = Teu bisa milih { $numToSelect } niléy tina runtuyan nu panjangna { $length }.

select-from-sequence-indices-count-mismatch = Jumlah indices nu ditangtukeun pikeun select kudu sarua jeung jumlah nu kudu dipilih

select-from-sequence-indices-not-integers = Sakabéh indices nu ditangtukeun pikeun select kudu wilangan bulat

select-from-sequence-index-excluded = index selectfromsequence nu ditangtukeun kaasup nu disingkahkeun

select-from-sequence-indices-excluded-combination = indices selectfromsequence nu ditangtukeun téh kombinasi nu disingkahkeun

select-from-sequence-coprime-not-positive-integers = Teu bisa milih kombinasi coprime sabab teu keur milih wilangan bulat positif.

select-from-sequence-coprime-common-factor = Teu bisa milih angka coprime. Sakabéh niléy nu mungkin boga faktor nu sarua. (Niléy "from" atawa "to" nu ditangtukeun kudu coprime jeung "step".)

select-from-sequence-coprime-single-number = Teu bisa milih kombinasi coprime tina hiji angka nu lain 1.

select-from-sequence-excluded-too-many-combinations = Leuwih ti 70% kombinasi dina selectFromSequence disingkahkeun

select-from-sequence-coprime-none-found = Teu bisa milih angka coprime. Sakabéh niléy nu mungkin boga faktor nu sarua.

select-from-sequence-too-few-unique-values = Teu bisa milih { $numToSelect } niléy unik tina runtuyan nu panjangna { $numPossibleValues }

select-prime-numbers-too-few-values = Teu bisa milih { $numToSelect } niléy tina daptar wilangan prima nu panjangna { $numValues }

select-prime-numbers-values-count-mismatch = Jumlah niléy nu ditangtukeun pikeun select kudu sarua jeung jumlah nu kudu dipilih

select-prime-numbers-values-not-prime = Sakabéh niléy nu ditangtukeun pikeun select wilangan prima kudu aya dina daptar wilangan prima

select-prime-numbers-values-excluded-combination = Niléy selectPrimeNumbers nu ditangtukeun téh kombinasi nu disingkahkeun

select-prime-numbers-excluded-too-many-combinations = Leuwih ti 70% kombinasi dina selectPrimeNumbers disingkahkeun

select-random-combination-fluke = Ku kajadian nu arang pisan, kombinasi niléy acak teu bisa dipilih

select-random-value-fluke = Ku kajadian nu arang pisan, niléy acak teu bisa dipilih
