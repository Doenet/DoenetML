# Javanese diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# SPEECH LEVEL. Written in **ngoko**, the plain level, throughout — see the
# header of `chrome.ftl`.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# Javanese has a single plural category, so a countable message needs no
# selection.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } ora digatèkaké yèn loro titik pungkasan wis ditemtokaké

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } ora digatèkaké yèn titik pungkasan lan titik tengah wis ditemtokaké kabèh

line-segment-midpoint-offset-without-midpoint = midpointOffset ora duwé pangaruh tanpa titik tengah

## `<line>`

line-points-undetermined-dimensions = Garis liwat titik sing dimènsiné durung mesthi.

line-points-too-few-dimensions = Garis kudu liwat titik sing paling sethithik duwé rong dimènsi.

line-points-depend-on-variables = Garis liwat titik sing gumantung marang variabel: { $variables }.

line-equation-invalid-format = Format persamaan garis ing variabel { $variable1 } lan { $variable2 } ora bener.

## `<ray>`

ray-overprescribed-through = Sinar ditemtokaké déning through, endpoint lan direction. through sing ditemtokaké ora digatèkaké.

ray-dimension-mismatch = numDimensions ing sinar ora cocog.

## `<vector>`

vector-overprescribed-head = Vèktor ditemtokaké déning head, tail lan displacement. head sing ditemtokaké ora digatèkaké.

vector-dimension-mismatch = numDimensions ing vèktor ora cocog.

## Attracting and constraining

attract-to-without-nearest-point = Ora bisa narik menyang `<{ $component }>` amarga ora duwé variabel kahanan nearestPoint.

constrain-to-without-nearest-point = Ora bisa mbatesi menyang `<{ $component }>` amarga ora duwé variabel kahanan nearestPoint.

constrain-to-interior-without-nearest-point = Ora bisa mbatesi menyang jero `<{ $component }>` amarga ora duwé variabel kahanan nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ora digatèkaké kanggo choiceInput sing dudu inline

## Ordering children by index

choice-input-indices-count-mismatch = indices sing ditemtokaké kanggo choiceInput ora digatèkaké amarga cacahé indices ora cocog karo cacahé anak choice.

pretzel-indices-count-mismatch = indices sing ditemtokaké kanggo problem ora digatèkaké amarga cacahé indices ora cocog karo cacahé anak problem.

shuffle-indices-count-mismatch = indices sing ditemtokaké kanggo shuffle ora digatèkaké amarga cacahé indices ora cocog karo cacahé komponèn.

indices-ignored-out-of-range = indices sing ditemtokaké kanggo { $component } ora digatèkaké amarga ana indices sing metu saka watesan.

pretzel-indices-repeated = indices sing ditemtokaké kanggo pretzel ora digatèkaké amarga ana indices sing dibolan-baleni.

pretzel-circuit-first-index = indices sing ditemtokaké kanggo pretzel ing mode circuit ora digatèkaké amarga index kapisan kudu 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Supaya `<{ $component }>` bisa mlaku karo anak arupa teks, atribut `type` kudu ditemtokaké.

invalid-type-defaulting-to-math = type { $type } ora bener kanggo komponèn { $component }. Kudu salah siji saka math, text, number utawa boolean. Bakal nganggo math.

string-not-valid-component-to-arrange = Teks "{ $value }" dudu komponèn sing bener kanggo { $component }. Ora digatèkaké.

## Types and variables

invalid-type-defaulting-to-number = type { $type } ora bener, type disetèl dadi number.

invalid-variable-value = Nilai variabel ora bener: `{ $value }`

## Variants

variant-index-must-be-number = index variant { $index } kudu arupa angka

variant-index-must-be-integer = index variant { $index } kudu arupa wilangan bulat

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` durung dianakaké kanggo ukuran absolut. Ambané disetèl dadi rélatif.

side-by-side-absolute-margins = `<{ $component }>` durung dianakaké kanggo ukuran absolut. Pinggirané disetèl dadi rélatif.

side-by-side-no-block-child = `<{ $component }>` ora bener: kudu duwé paling sethithik siji anak blok.

## `<label>`

label-for-ignored-on-graphical = Atribut `for` ing `<label>` grafis ora digatèkaké.

label-for-must-resolve-to-one = Atribut `for` ing `<label>` kudu nuduh menyang siji komponèn waé.

label-for-unresolved = Atribut `for` ing `<label>` ora bisa ditemtokaké menyang komponèn apa waé.

label-for-answer-with-authored-inputs = Atribut `for` ing `<label>` nuduh menyang `<answer>` sing inputé ditulis dhéwé déning panganggit; nuduha langsung menyang inputé.

label-for-answer-without-input = Atribut `for` ing `<label>` nuduh menyang `<answer>` sing ora duwé input kanggo dilabeli.

label-for-must-reference-input-or-answer = Atribut `for` ing `<label>` kudu nuduh menyang input utawa answer.

## Accessibility

accessibility-short-description-or-decorative = Kanggo aksesibilitas, `<{ $component }>` kudu duwé katrangan cendhak utawa ditemtokaké minangka hiasan.

accessibility-video-short-description = Kanggo aksesibilitas, `<video>` kudu duwé katrangan cendhak.

accessibility-input-short-description-or-label = Kanggo aksesibilitas, `<{ $component }>` kudu duwé katrangan cendhak utawa label.

accessibility-answer-input-short-description-or-label = Kanggo aksesibilitas, `<answer>` sing nggawé input kudu duwé katrangan cendhak utawa label.

accessibility-short-description-contains-math = Katrangan cendhak ora kena ngemot komponèn matématika kaya `<{ $component }>`. Tulisen matématikané nganggo tembung.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } kontrasé kurang kanggo teks judhul bagéan (mode peteng) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; paling sethithik kudu { $threshold }:1).
       *[other] { $colorName } kontrasé kurang kanggo teks judhul bagéan ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; paling sethithik kudu { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` liwat { $count } titik durung dianakaké kanggo kahanan titiké ora duwé nilai angka.

circle-too-many-through-points = Ora bisa ngitung bunder liwat luwih saka 3 titik.

circle-overprescribed-radius-center-points = Ora bisa ngitung bunder karo radius, pusat lan titik sing ditemtokaké kabèh.

circle-center-with-multiple-points = Ora bisa ngitung bunder karo pusat sing ditemtokaké liwat luwih saka 1 titik.

circle-radius-too-small = Ora bisa ngitung bunder: amarga adohé antarané rong titik iku { $distance }, radius { $radius } sing ditemtokaké cilik banget.

circle-radius-with-many-points = Ora bisa nggawé bunder liwat luwih saka rong titik karo radius sing ditemtokaké.

circle-invalid-center-or-through-points = Pusat utawa titik liwat bunder ora bener.

circle-radius-center-with-multiple-points = Ora bisa ngitung radius bunder karo pusat sing ditemtokaké liwat luwih saka 1 titik.

circle-change-radius-non-numerical = Ora bisa ngganti radius bunder sing titiké dudu angka

circle-radius-with-points-non-numerical = Ora bisa nggawé bunder liwat luwih saka siji titik karo radius sing ditemtokaké nalika ora duwé nilai angka.

circle-change-center-non-numerical = Ngganti pusat bunder sing liwat titik dudu angka durung dianakaké.

## `<function>`

function-domain-insufficient-dimensions = Dimènsi domain kanggo fungsi kurang. Domain duwé { $intervals } interval nanging fungsiné duwé { $inputs } input.

function-domain-invalid-format = Format domain kanggo fungsi ora bener.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Maksimum fungsi sing dudu angka ora digatèkaké.
        [minimum] Minimum fungsi sing dudu angka ora digatèkaké.
        [extremum] Èkstremum fungsi sing dudu angka ora digatèkaké.
        [point] Titik fungsi sing dudu angka ora digatèkaké.
        [slope] Kemiringan fungsi sing dudu angka ora digatèkaké.
       *[other] { $type } fungsi sing dudu angka ora digatèkaké.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Maksimum fungsi sing kosong ora digatèkaké.
        [minimum] Minimum fungsi sing kosong ora digatèkaké.
        [extremum] Èkstremum fungsi sing kosong ora digatèkaké.
        [point] Titik fungsi sing kosong ora digatèkaké.
       *[other] { $type } fungsi sing kosong ora digatèkaké.
    }

function-points-too-close = Fungsi ngemot rong titik sing panggonané cedhak banget. Fungsi ora bisa ditemtokaké.

function-iterates-input-output-mismatch = Iterasi fungsi mung bisa yèn cacahé input padha karo cacahé output. Fungsi iki duwé { $inputs } input lan { $outputs } output.

## `<sequence>`

sequence-invalid-length = Dawané urutan ora bener. Kudu wilangan bulat sing ora negatif.

sequence-invalid-step = Langkah urutan ora bener. Kudu angka kanggo urutan jinis { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" saka urutan angka ora bener. Kudu arupa angka.

sequence-invalid-endpoint-letters = "{ $attribute }" saka urutan aksara ora bener. Kudu arupa kombinasi aksara.

sequence-invalid-endpoint = "{ $attribute }" saka urutan ora bener.

select-from-sequence-coprime-not-numbers = coprime ora digatèkaké amarga ora milih angka

select-from-sequence-coprime-with-exclude-combinations = coprime ora digatèkaké amarga excludeCombinations ditemtokaké

## Resolving a `target`

target-not-found = target ora bener kanggo `<{ $source }>`: target ora ketemu.

target-state-variable-not-found = target ora bener kanggo `<{ $source }>`: variabel kahanan jenengé "{ $property }" ing `<{ $component }>` ora ketemu.

## `<odeSystem>`

ode-system-variables-match-independent = Variabel `<odeSystem>` kudu béda karo variabel bébas.

ode-system-duplicate-variable-names = Ora bisa nemtokaké fungsi sisih tengen ODE karo jeneng variabel gumantung sing padha.

ode-system-rhs-function-error = Ora bisa nemtokaké fungsi sisih tengen ODE. Ana kaluputan nalika nggawé fungsi mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ora bisa nemtokaké sudut antarané { $count } garis

angle-invalid-through-point = Titik ing through saka `<angle>` ora bener

parabola-vertex-too-many-points = Parabola karo puncak sing liwat luwih saka 1 titik durung dianakaké.

parabola-too-many-points = Parabola liwat luwih saka 3 titik durung dianakaké.

intersection-too-many-items = Irisan kanggo luwih saka rong barang durung dianakaké

## Other math components

ionic-compound-not-two-ions = Senyawa ionik kanggo liyané saka rong ion durung dianakaké.

ionic-compound-needs-cation-and-anion = Senyawa ionik mung dianakaké kanggo siji kation lan siji anion.

solve-equations-cannot-evaluate = Ora bisa ngrampungaké persamaan amarga persamaané ora bisa dievaluasi: { $equation }

math-operators-operand-number-required = operandNumber kudu ditemtokaké nalika njupuk operan matématika.

eigen-decomposition-failed = Ora bisa ngitung nilai èigen saka matriks

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: paramèter { $parameters } ora ana ing pola, mula bakal tansah cocog karo isi kosong.

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" ora bisa ditegesi. Kudu none, medium, dense, utawa rong angka positif sing dipisah spasi, kaya grid="1 0.5". Ora ana kothak-kothak sing digambar.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ora didhukung ing perènder prefigure; nganggo prilaku posisi tengen.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ora didhukung ing perènder prefigure; nganggo prilaku posisi ndhuwur.

prefigure-invalid-axis-bounds = `<graph>`: watesan sumbu ora bener kanggo konvèrsi prefigure; nganggo bbox baku (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: amba ora bener kanggo konvèrsi prefigure; nganggo amba diagram baku 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio ora bener kanggo konvèrsi prefigure; nganggo rasio baku 1.

prefigure-grid-spacing-too-fine = `<graph>`: jarak kothak-kothak kekencengen kanggo watesan sumbu; kothak-kothaké ora digambar ing perènder prefigure.

prefigure-annotations-not-rendered = `<graph>`: anotasi ora bakal digambar yèn ora nganggo perènder PreFigure.

multiple-annotations-children = Ana anak `<annotations>` luwih saka siji ing `<graph>`; kabèh kajaba sing pungkasan ora digatèkaké.

## Referring to other components

copy-unrecognized-component-type = Ora bisa nglanjutaké utawa nyalin jinis komponèn sing ora dikenal: { $type }.

copy-prop-not-found = prop { $property } ing komponèn jinis { $component } ora ketemu

collect-no-source = Sumber kanggo collect ora ketemu.

collect-invalid-component-type = Ora bisa nglumpukaké komponèn jinis `<{ $component }>` amarga iku jinis komponèn sing ora bener.

reference-index-unavailable = Ora bisa nuduh index `{ $reference }`

## `<callAction>`

component-action-unavailable = Ora bisa nyeluk { $action } ing komponèn `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Wangun data ora bener. Larik-lariké dawané ora padha. Ketemu ing componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data duwé jeneng kolom sing padha. Ketemu ing componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data kurang jeneng kolom. Ketemu ing componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award kanggo wangsulan iki adhedhasar wangsulan sing dikirim déning answer dhéwé, sing bakal njalari prilaku sing ora dikarepaké.

answer-max-num-attempts-in-section-wide-check-work = Nyetèl `maxNumAttempts` ing `<answer>` sajroné wadhah sing duwé `sectionWideCheckWork` ora duwé pangaruh, amarga cacahé kesempatan dikontrol déning wadhahé. Setèlen `maxNumAttempts` ing wadhahé waé.

nested-section-wide-check-work-max-num-attempts = Nyetèl `maxNumAttempts` ing wadhah sing duwé `sectionWideCheckWork` lan manggon sajroné wadhah liya sing uga duwé `sectionWideCheckWork` ora duwé pangaruh, amarga cacahé kesempatan dikontrol déning wadhah njaba. Setèlen `maxNumAttempts` ing wadhah njaba waé.

answer-attributes-need-symbolic-equality = Atribut { $attributes } ora bakal duwé pangaruh tanpa symbolicEquality disetèl.

answer-invalid-type = Jinis ora bener kanggo answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Amarga komponèn `<{ $component }>` ora duwé jeneng, iku ora bisa dienggo minangka atribut module

module-attribute-name-already-defined = Komponèn `<{ $component } name="{ $name }">` ora bisa dienggo minangka atribut module amarga jinis komponèn `<module>` wis duwé atribut "{ $name }".

conditional-content-condition-ignored = Atribut `condition` ora digatèkaké ing komponèn `<conditionalContent>` sing duwé anak case utawa else.

slider-markers-type-mismatch = Jinis panandha ora cocog karo jinis slider.

pretzel-problem-needs-statement-and-answer = pretzel ora bener: saben `<problem>` kudu ngemot siji `<statement>` lan siji `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel ora bener: ing mode="circuit", `<problem>` kapisan ora kena dadi distractor.

## Attribute values

attribute-invalid-values = Nilai { $values } ora bener kanggo atribut `{ $attribute }`; ora digatèkaké.

attribute-must-be-references = Nilai `{ $value }` ora bener kanggo atribut `{ $attribute }`. Atribut kudu kasusun saka rujukan sing diwiwiti nganggo `$`.

math-input-invalid-function-names = <mathInput>: jeneng fungsi sing ora bener ing { $attribute } ora digatèkaké: { $names }. Pérangan tampilan saben jeneng kudu paling sethithik 2 aksara (huruf utawa garis-garis); pungkasan `|<mathspeak alternative>` kena ditambahaké.

## Building components from the source

component-type-invalid = Jinis komponèn ora bener: `<{ $componentType }>`

attribute-repeated = Atribut { $attribute } ora kena dibolan-baleni.

attribute-invalid-for-component = Atribut "{ $attribute }" ora bener kanggo komponèn jinis `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Definisi gaya { $styleNumber } kontrasé kurang kanggo { $context ->
        [text-on-background] warna teks tumrap warna latar
        [high-contrast] warna kontras dhuwur tumrap kanvas
        [line] warna garis tumrap kanvas
        [marker] warna panandha tumrap kanvas
       *[text-on-canvas] warna teks tumrap kanvas
    }{ $mode ->
        [dark] { " (mode peteng)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; paling sethithik kudu { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Senajan definisi gaya { $styleNumber } nemtokaké warna sing kontrasé cukup kanggo mode padhang, warna mode peteng sing diturunaké saka nilai kuwi kontrasé kurang kanggo warna teks tumrap warna latar ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; paling sethithik kudu { $threshold }:1). { $suggestion ->
        [available] Supaya kontrasé cukup ing mode peteng, tambahana kontras ing mode padhang (contoné, setèl { $lightAttribute }="{ $lightColor }") utawa gantinen warna mode peteng (contoné, setèl { $darkAttribute }="{ $darkColor }").
       *[none] Supaya kontrasé cukup ing mode peteng, tambahana kontras ing mode padhang utawa gantinen warna turunané nganggo textColorDarkMode lan/utawa backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Senajan definisi gaya { $styleNumber } nemtokaké warna teks sing kontrasé cukup kanggo mode padhang, warna teks mode peteng sing diturunaké saka nilai kuwi kontrasé kurang tumrap kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; paling sethithik kudu { $threshold }:1). { $suggestion ->
        [available] Supaya kontrasé cukup ing mode peteng, tambahana kontras ing mode padhang (contoné, setèl textColor="{ $lightColor }") utawa gantinen warna mode peteng (contoné, setèl textColorDarkMode="{ $darkColor }").
       *[none] Supaya kontrasé cukup ing mode peteng, tambahana kontras ing mode padhang utawa gantinen warna turunané nganggo textColorDarkMode.
    }

section-multiple-style-palettes = Siji bagéan mung bisa milih siji <stylePalette>; sing pungkasan sing dienggo.

## Unique variants

variant-num-to-select-not-non-negative-integer = ora bisa nemtokaké variant unik saka { $component } amarga numToSelect dudu wilangan bulat sing ora negatif.

variant-num-to-select-not-constant-number = ora bisa nemtokaké variant unik saka { $component } amarga numToSelect dudu angka tetep.

variant-with-replacement-not-constant-boolean = ora bisa nemtokaké variant unik saka { $component } amarga withReplacement dudu boolean tetep.

variant-select-weight-disables-unique = Variant unik kanggo select dipatèni yèn ana option sing nemtokaké selectWeight utawa selectForVariants

variant-coprime-undetermined = ora bisa nemtokaké variant unik saka { $component } amarga ora bisa ditemtokaké yèn coprime tansah salah.

variant-attribute-not-constant = ora bisa nemtokaké variant unik saka { $component } amarga { $attribute } dudu nilai tetep.

variant-attribute-not-number = ora bisa nemtokaké variant unik saka { $component } amarga { $attribute } dudu angka.

variant-attribute-wrong-type-for-sequence =
    ora bisa nemtokaké variant unik saka { $component } jinis { $type } amarga { $attribute } dudu { $expected ->
        [letters-combination] kombinasi aksara
        [math-expression] èkspresi matématika sing bener
        [integer] wilangan bulat
       *[number] angka
    }.

variant-length-not-integer = ora bisa nemtokaké variant unik saka { $component } amarga length dudu wilangan bulat.

variant-sort-not-implemented = variant unik saka { $component } karo sort durung dianakaké

variant-exclude-combinations-not-implemented = variant unik saka { $component } karo excludeCombinations durung dianakaké

variant-math-exclude-not-implemented = variant unik saka { $component } jinis math karo exclude durung dianakaké

variant-non-constant-exclude-not-implemented = variant unik saka { $component } karo exclude sing ora tetep durung dianakaké

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ora didhukung ing perènder prefigure grafik; turunané dilewati.

prefigure-descendant-invalid-geometry = { $subject }: gèomètriné ora winates utawa ora jangkep; turunané dilewati.

prefigure-curve-label-omitted = { $subject }: label ora didhukung ing èlemèn kurva sing wis dikonvèrsi; labelé ditinggal.

prefigure-curve-unsupported-definition-type = { $subject }: jinis definisi fungsi kurva '{ $definitionType }' ora didhukung; turunané dilewati.

prefigure-region-flip-functions-unsupported = { $subject }: atribut flipFunctions ing regionBetweenCurves ora didhukung; turunané dilewati.

prefigure-region-non-formula-child = { $subject }: mung fungsi anak jinis rumus sing didhukung ing regionBetweenCurves; turunané dilewati.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' ora didhukung kanggo { $labelKind ->
        [line-family] label kulawarga garis
       *[point] label titik
    }; nganggo perataan baku PreFigure.

prefigure-fill-style-unsupported = { $subject }: gaya isi '{ $fillStyle }' ora didhukung déning PreFigure; bali menyang isi kebak.

prefigure-line-style-unknown = { $subject }: gaya garis '{ $lineStyle }' ora dikenal, ditinggal saka kluaran PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: gaya panandha '{ $markerStyle }' dipetakaké menyang gaya 'diamond' ing PreFigure.

prefigure-marker-style-unsupported = { $subject }: gaya panandha '{ $markerStyle }' ora didhukung déning PreFigure; nganggo gaya baku.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ora bener; targeté ora ketemu. Anotasiné ditinggal.

annotation-ref-multiple-targets = `<annotation>`: `ref` nuduh menyang pirang-pirang target; target kapisan sing dienggo.

annotation-ref-outside-graph = `<annotation>`: `ref` ora bener; targeté ana ing njaba grafik sing ngemot. Anotasiné ditinggal.

annotation-ref-unsupported-target = `<annotation>`: `ref` ora bener; targeté dudu obyèk grafis sing didhukung ing konvèrsi prefigure. Anotasiné ditinggal.

annotation-text-missing = `<annotation>`: `text` ora ana utawa kosong; teks kosong sing diwetokaké.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Ketemu gumantungan muter.
       *[other] Ketemu gumantungan muter sing nglibataké komponèn `<{ $componentType }>`.
    }

reference-no-referent = Ora ketemu sing dituduh déning rujukan: `{ $reference }`

reference-multiple-referents = Ketemu luwih saka siji sing dituduh déning rujukan: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format atribut { $attribute } saka `<{ $componentType }>` ora bener.

children-invalid = Anak ora bener kanggo `<{ $componentType }>`: ketemu anak sing ora bener: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Nilai `{ $value }` ora bener kanggo atribut `{ $attribute }`, nganggo nilai `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML vèrsi { $version } ora ketemu.
       *[other] DoenetML vèrsi { $version } ora ketemu. Bali menyang vèrsi { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ora bener: { $content }

parse-tag-missing-close-tag = DoenetML ora bener: Tag `{ $tag }` ora duwé tag panutup. Kudu tag sing nutup dhéwé utawa tag `</{ $tagName }>`.

parse-tag-error = DoenetML ora bener: Ana kaluputan ing tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML ora bener: Atribut `{ $attribute }` sing ora bener kétoké kurang nilai.

parse-attribute-invalid = DoenetML ora bener: Atribut `{ $attribute }` ora bener

parse-attribute-value-invalid = DoenetML ora bener: Nilai atribut `{ $value }` ora bener

parse-attribute-value-quote-mismatch = DoenetML ora bener: Nilai atribut `{ $value }` ora bener. Tandha pethiké ora cocog. Kétoké kurang `{ $quote }`

parse-open-tag-name-missing = DoenetML ora bener: Ketemu tag tanpa jeneng tag, contoné `<`

parse-tag-not-closed = DoenetML ora bener: Tag `{ $tag }` durung ditutup (kétoké kurang `>`).

parse-self-closing-tag-name-missing = DoenetML ora bener: Ketemu tag tanpa jeneng tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ora bener: Tag `{ $tag }` durung ditutup (kétoké kurang `/>`).

parse-tag-invalid-attributes = DoenetML ora bener: Tag `{ $tag }` ora bener. Bisa waé atribute salah.

parse-close-tag-name-missing = DoenetML ora bener: Ketemu tag panutup tanpa jeneng tag, contoné `</`

parse-attribute-value-unquoted = Nilai atribut kudu diapit tandha pethik: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ora bener: Ketemu tag panutup `{ $tag }`, nanging ora ana tag pambuka sing cocog

parse-close-tag-mismatched = DoenetML ora bener: Tag panutup ora cocog. Sing dikarepaké `</{ $expected }>`. Sing ketemu `{ $found }`

parser-node-unconvertible = Node { $node } ora bisa dikonvèrsi dadi node Dast.

## Names

name-attribute-invalid =
    Atribut name='{ $name }' ora bener. { $reason ->
        [characters] Jeneng mung kena isi huruf, angka, garis ngisor utawa garis pethok.
       *[start] Jeneng kudu diwiwiti nganggo huruf.
    }

component-name-invalid-start = Jeneng komponèn "{ $name }" ora bener. Jeneng kudu diwiwiti nganggo huruf.

## `<answer>` sugar

answer-video-watched-missing-video = answer jinis videoWatched kudu duwé atribut video

answer-video-watched-video-not-reference = answer jinis videoWatched kudu duwé atribut video sing arupa rujukan

answer-name-not-single-text = Atribut name ing answer kudu duwé siji anak teks

## Referencing another document

external-doenetml-recursion-limit = DoenetML njaba ora bisa dijupuk amarga rekursiné kakèhan tingkat. Apa ana rujukan sing muter?

external-doenetml-unavailable = DoenetML saka { $attribute }="{ $uri }" ora bisa dijupuk

external-doenetml-type-mismatch = DoenetML sing dijupuk saka { $attribute }="{ $uri }" ora bener: ora cocog karo jinis komponèn "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` wis ora dienggo manèh; nganggoa `{ $to }`.
       *[other] [deprecation] Atribut `{ $from }` ing `<{ $component }>` wis ora dienggo manèh; nganggoa `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` wis ora dienggo manèh lan ora digatèkaké amarga `{ $to }` uga ditemtokaké.
       *[other] [deprecation] Atribut `{ $from }` ing `<{ $component }>` wis ora dienggo manèh lan ora digatèkaké amarga `{ $to }` uga ditemtokaké.
    }

deprecated-attribute-ignored = [deprecation] Atribut `{ $attribute }` ing `<{ $component }>` wis ora dienggo manèh lan ora digatèkaké.


## Language coverage

pluralize-english-only = `<pluralize>` mung bisa nggawé wangun jamak basa Inggris, mula teksé ditinggal kaya asliné ing dokumèn sing ditulis nganggo { $locale }. Tulisen wangun jamaké langsung, utawa setèlen nganggo atribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Èlemèn `<{ $tag }>` dudu èlemèn Doenet sing dikenal.

schema-element-not-allowed-at-root = Èlemèn `<{ $tag }>` ora kena ana ing oyod dokumèn.

schema-element-not-allowed-inside = Èlemèn `<{ $tag }>` ora kena ana ing jero `<{ $parent }>`.

schema-attribute-unrecognized = Èlemèn `<{ $tag }>` ora duwé atribut sing jenengé `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribut `{ $attribute }` ing èlemèn `<{ $tag }>` kudu arupa dhaftar sing saben isiné salah siji saka: { $allowed }
       *[other] Atribut `{ $attribute }` ing èlemèn `<{ $tag }>` kudu salah siji saka: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Jeneng variant ora bener kanggo select. Jeneng variant { $variantName } tampil ing { $numOptions } option nanging cacah sing kudu dipilih iku { $numToSelect }.

select-variant-name-without-options = Ana variant sing ditemtokaké kanggo select nanging ora ana option kanggo jeneng variant sing mungkin: { $variantName }.

select-variant-name-not-possible = Jeneng variant { $variantName } sing ditemtokaké kanggo select dudu jeneng variant sing mungkin.

select-too-few-options = Ora bisa milih { $numToSelect } komponèn saka mung { $numOptions }.

select-from-sequence-too-few-values = Ora bisa milih { $numToSelect } nilai saka urutan sing dawané { $length }.

select-from-sequence-indices-count-mismatch = Cacahé indices sing ditemtokaké kanggo select kudu padha karo cacah sing kudu dipilih

select-from-sequence-indices-not-integers = Kabèh indices sing ditemtokaké kanggo select kudu wilangan bulat

select-from-sequence-index-excluded = index selectfromsequence sing ditemtokaké kalebu sing disingkiraké

select-from-sequence-indices-excluded-combination = indices selectfromsequence sing ditemtokaké iku kombinasi sing disingkiraké

select-from-sequence-coprime-not-positive-integers = Ora bisa milih kombinasi coprime amarga ora milih wilangan bulat positif.

select-from-sequence-coprime-common-factor = Ora bisa milih angka coprime. Kabèh nilai sing mungkin duwé faktor sing padha. (Nilai "from" utawa "to" sing ditemtokaké kudu coprime karo "step".)

select-from-sequence-coprime-single-number = Ora bisa milih kombinasi coprime saka siji angka sing dudu 1.

select-from-sequence-excluded-too-many-combinations = Luwih saka 70% kombinasi ing selectFromSequence disingkiraké

select-from-sequence-coprime-none-found = Ora bisa milih angka coprime. Kabèh nilai sing mungkin duwé faktor sing padha.

select-from-sequence-too-few-unique-values = Ora bisa milih { $numToSelect } nilai unik saka urutan sing dawané { $numPossibleValues }

select-prime-numbers-too-few-values = Ora bisa milih { $numToSelect } nilai saka dhaftar wilangan prima sing dawané { $numValues }

select-prime-numbers-values-count-mismatch = Cacahé nilai sing ditemtokaké kanggo select kudu padha karo cacah sing kudu dipilih

select-prime-numbers-values-not-prime = Kabèh nilai sing ditemtokaké kanggo select wilangan prima kudu ana ing dhaftar wilangan prima

select-prime-numbers-values-excluded-combination = Nilai selectPrimeNumbers sing ditemtokaké iku kombinasi sing disingkiraké

select-prime-numbers-excluded-too-many-combinations = Luwih saka 70% kombinasi ing selectPrimeNumbers disingkiraké

select-random-combination-fluke = Merga kedadéan sing arang banget, kombinasi nilai acak ora bisa dipilih

select-random-value-fluke = Merga kedadéan sing arang banget, nilai acak ora bisa dipilih
