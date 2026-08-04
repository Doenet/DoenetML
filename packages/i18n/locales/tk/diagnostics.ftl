# Turkmen diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Turkmen counts in the same two categories English does, so every selection
# below keeps both branches — but a noun after a numeral stays singular, so the
# two usually differ only in the number they print.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] iki uç nokat hem berlende { $attributes } hasaba alynmaýar
       *[other] iki uç nokat hem berlende { $attributes } hasaba alynmaýar
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] uç nokat hem, orta nokat hem berlende { $attributes } hasaba alynmaýar
       *[other] uç nokat hem, orta nokat hem berlende { $attributes } hasaba alynmaýar
    }

line-segment-midpoint-offset-without-midpoint = orta nokatsyz midpointOffset hiç zada täsir etmeýär

## `<line>`

line-points-undetermined-dimensions = Ölçegi näbelli nokatlardan geçýän göni çyzyk.

line-points-too-few-dimensions = Göni çyzyk iň azyndan iki ölçegli nokatlardan geçmeli.

line-points-depend-on-variables = Göni çyzyk üýtgeýänlere bagly nokatlardan geçýär: { $variables }.

line-equation-invalid-format = { $variable1 } we { $variable2 } üýtgeýänlerindäki göni çyzygyň deňlemesiniň formaty nädogry.

## `<ray>`

ray-overprescribed-through = Şöhle through, endpoint we direction arkaly berlen. Berlen through hasaba alynmaýar.

ray-dimension-mismatch = şöhlede numDimensions gabat gelmeýär.

## `<vector>`

vector-overprescribed-head = Wektor head, tail we displacement arkaly berlen. Berlen head hasaba alynmaýar.

vector-dimension-mismatch = wektorda numDimensions gabat gelmeýär.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` elementine çekmek bolmaýar, sebäbi onuň nearestPoint ýagdaý üýtgeýäni ýok.

constrain-to-without-nearest-point = `<{ $component }>` elementi bilen çäklendirmek bolmaýar, sebäbi onuň nearestPoint ýagdaý üýtgeýäni ýok.

constrain-to-interior-without-nearest-point = `<{ $component }>` elementiniň içi bilen çäklendirmek bolmaýar, sebäbi onuň nearestPoint ýagdaý üýtgeýäni ýok.

## `<choiceInput>`

choice-input-label-position-ignored = setir içinde bolmadyk choiceInput üçin labelPosition hasaba alynmaýar

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput üçin berlen indeksler hasaba alynmaýar, sebäbi olaryň sany choice çagalarynyň sanyna gabat gelmeýär.

pretzel-indices-count-mismatch = problem üçin berlen indeksler hasaba alynmaýar, sebäbi olaryň sany problem çagalarynyň sanyna gabat gelmeýär.

shuffle-indices-count-mismatch = shuffle üçin berlen indeksler hasaba alynmaýar, sebäbi olaryň sany komponentleriň sanyna gabat gelmeýär.

indices-ignored-out-of-range = { $component } üçin berlen indeksler hasaba alynmaýar, sebäbi käbiri araçäkden daşarda.

pretzel-indices-repeated = pretzel üçin berlen indeksler hasaba alynmaýar, sebäbi käbiri gaýtalanýar.

pretzel-circuit-first-index = circuit režiminde pretzel üçin berlen indeksler hasaba alynmaýar, sebäbi birinji indeks 1 bolmaly.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` tekst çagalary bilen işlemegi üçin `type` atributy berilmeli.

invalid-type-defaulting-to-math = { $component } komponenti üçin nädogry görnüş { $type }. Ol math, text, number ýa-da boolean bolmaly. math ulanylýar.

string-not-valid-component-to-arrange = «{ $value }» setiri { $component } üçin ýaramly komponent däl. Hasaba alynmaýar.

## Types and variables

invalid-type-defaulting-to-number = Nädogry görnüş { $type }, görnüş number diýlip bellenýär.

invalid-variable-value = Üýtgeýäniň nädogry bahasy: `{ $value }`

## Variants

variant-index-must-be-number = Wariantyň indeksi { $index } san bolmaly

variant-index-must-be-integer = Wariantyň indeksi { $index } bitin san bolmaly

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` absolýut ölçegler üçin amala aşyrylmadyk. Giňlikler gatnaşykly bolýar.

side-by-side-absolute-margins = `<{ $component }>` absolýut ölçegler üçin amala aşyrylmadyk. Gyra boşluklary gatnaşykly bolýar.

side-by-side-no-block-child = Nädogry `<{ $component }>`: onuň iň azyndan bir blok çagasy bolmaly.

## `<label>`

label-for-ignored-on-graphical = Grafiki `<label>` elementindäki `for` atributy hasaba alynmaýar.

label-for-must-resolve-to-one = `<label>` elementindäki `for` atributy takyk bir komponente görkezmeli.

label-for-unresolved = `<label>` elementindäki `for` atributyny komponent bilen baglanyşdyrmak başartmady.

label-for-answer-with-authored-inputs = `<label>` elementindäki `for` atributy awtoryň ýazan giriş meýdanlary bolan `<answer>` elementine görkezýär; meýdana göni görkeziň.

label-for-answer-without-input = `<label>` elementindäki `for` atributy belgilenmeli giriş meýdany bolmadyk `<answer>` elementine görkezýär.

label-for-must-reference-input-or-answer = `<label>` elementindäki `for` atributy giriş meýdanyna ýa-da jogaba görkezmeli.

## Accessibility

accessibility-short-description-or-decorative = Elýeterlilik üçin `<{ $component }>` ýa gysga düşündirişe eýe bolmaly, ýa-da bezeg hökmünde bellenmeli.

accessibility-video-short-description = Elýeterlilik üçin `<video>` gysga düşündirişe eýe bolmaly.

accessibility-input-short-description-or-label = Elýeterlilik üçin `<{ $component }>` gysga düşündirişe ýa-da belgä eýe bolmaly.

accessibility-answer-input-short-description-or-label = Elýeterlilik üçin giriş meýdanyny döredýän `<answer>` gysga düşündirişe ýa-da belgä eýe bolmaly.

accessibility-short-description-contains-math = Gysga düşündirişlerde `<{ $component }>` ýaly matematiki komponentler bolmaly däl. Matematikany sözler bilen ýazyň.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } bölümiň sözbaşysynyň teksti üçin ýeterlik kontrast bermeýär (garaňky tema) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; iň azyndan { $threshold }:1 gerek).
       *[other] { $colorName } bölümiň sözbaşysynyň teksti üçin ýeterlik kontrast bermeýär ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; iň azyndan { $threshold }:1 gerek).
    }

## `<circle>`

circle-through-points-non-numerical = Nokatlaryň san bahalary ýok mahaly { $count } nokatdan geçýän `<circle>` amala aşyrylmadyk.

circle-too-many-through-points = 3-den köp nokatdan geçýän aýlawy hasaplap bolmaýar.

circle-overprescribed-radius-center-points = Berlen radius, merkez we nokatlar bilen aýlawy hasaplap bolmaýar.

circle-center-with-multiple-points = Berlen merkez bilen 1-den köp nokatdan geçýän aýlawy hasaplap bolmaýar.

circle-radius-too-small = Aýlawy hasaplap bolmaýar: iki nokadyň arasyndaky aralyk { $distance } bolansoň, berlen radius { $radius } örän kiçi.

circle-radius-with-many-points = Berlen radius bilen ikiden köp nokatdan geçýän aýlaw döredip bolmaýar.

circle-invalid-center-or-through-points = Aýlawyň merkezi ýa-da nokatlary nädogry.

circle-radius-center-with-multiple-points = Berlen merkez bilen 1-den köp nokatdan geçýän aýlawyň radiusyny hasaplap bolmaýar.

circle-change-radius-non-numerical = San däl nokatly aýlawyň radiusyny üýtgedip bolmaýar

circle-radius-with-points-non-numerical = San bahalary ýok mahaly berlen radius bilen birden köp nokatdan geçýän aýlaw döredip bolmaýar.

circle-change-center-non-numerical = San däl nokatlardan geçýän aýlawyň merkezini üýtgetmek amala aşyrylmadyk.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Funksiýanyň kesgitleniş oblastynyň ölçegi ýeterlik däl. Oblastda { $intervals } aralyk bar, funksiýada bolsa { $inputs ->
            [one] { $inputs } giriş
           *[other] { $inputs } giriş
        }.
       *[other] Funksiýanyň kesgitleniş oblastynyň ölçegi ýeterlik däl. Oblastda { $intervals } aralyk bar, funksiýada bolsa { $inputs ->
            [one] { $inputs } giriş
           *[other] { $inputs } giriş
        }.
    }

function-domain-invalid-format = Funksiýanyň kesgitleniş oblastynyň formaty nädogry.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Funksiýanyň san däl maksimumy hasaba alynmaýar.
        [minimum] Funksiýanyň san däl minimumy hasaba alynmaýar.
        [extremum] Funksiýanyň san däl ekstremumy hasaba alynmaýar.
        [point] Funksiýanyň san däl nokady hasaba alynmaýar.
        [slope] Funksiýanyň san däl burç koeffisiýenti hasaba alynmaýar.
       *[other] Funksiýanyň san däl { $type } bahasy hasaba alynmaýar.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Funksiýanyň boş maksimumy hasaba alynmaýar.
        [minimum] Funksiýanyň boş minimumy hasaba alynmaýar.
        [extremum] Funksiýanyň boş ekstremumy hasaba alynmaýar.
        [point] Funksiýanyň boş nokady hasaba alynmaýar.
       *[other] Funksiýanyň boş { $type } bahasy hasaba alynmaýar.
    }

function-points-too-close = Funksiýada biri-birine örän ýakyn iki nokat bar. Funksiýany kesgitläp bolmaýar.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Funksiýanyň iterasiýalary diňe girişleriň sany çykyşlaryň sanyna deň bolanda mümkin. Bu funksiýada { $inputs } giriş we { $outputs ->
            [one] { $outputs } çykyş
           *[other] { $outputs } çykyş
        } bar.
       *[other] Funksiýanyň iterasiýalary diňe girişleriň sany çykyşlaryň sanyna deň bolanda mümkin. Bu funksiýada { $inputs } giriş we { $outputs ->
            [one] { $outputs } çykyş
           *[other] { $outputs } çykyş
        } bar.
    }

## `<sequence>`

sequence-invalid-length = Yzygiderligiň uzynlygy nädogry. Ol otrisatel däl bitin san bolmaly.

sequence-invalid-step = Yzygiderligiň ädimi nädogry. { $type } görnüşli yzygiderlik üçin ol san bolmaly.

sequence-invalid-endpoint-number = San yzygiderliginiň «{ $attribute }» bahasy nädogry. Ol san bolmaly.

sequence-invalid-endpoint-letters = Harp yzygiderliginiň «{ $attribute }» bahasy nädogry. Ol harplaryň utgaşmasy bolmaly.

sequence-invalid-endpoint = Yzygiderligiň «{ $attribute }» bahasy nädogry.

select-from-sequence-coprime-not-numbers = sanlar saýlanmaýandygy üçin coprime hasaba alynmaýar

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations berlendigi üçin coprime hasaba alynmaýar

## Resolving a `target`

target-not-found = `<{ $source }>` üçin nädogry target: nyşana tapylmady.

target-state-variable-not-found = `<{ $source }>` üçin nädogry target: `<{ $component }>` elementinde «{ $property }» atly ýagdaý üýtgeýäni tapylmady.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` üýtgeýänleri garaşsyz üýtgeýänden tapawutlanmaly.

ode-system-duplicate-variable-names = Bagly üýtgeýänleriň gaýtalanýan atlary bilen DT sag tarap funksiýalaryny kesgitläp bolmaýar.

ode-system-rhs-function-error = DT sag tarap funksiýasyny kesgitläp bolmaýar. mathjs funksiýasyny döretmekde ýalňyşlyk.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } göni çyzygyň arasyndaky burçy kesgitläp bolmaýar

angle-invalid-through-point = `<angle>` elementiniň through bahasynda nädogry nokat

parabola-vertex-too-many-points = Berlen depe bilen 1-den köp nokatdan geçýän parabola amala aşyrylmadyk.

parabola-too-many-points = 3-den köp nokatdan geçýän parabola amala aşyrylmadyk.

intersection-too-many-items = Ikiden köp obýektiň kesişmesi amala aşyrylmadyk

## Other math components

ionic-compound-not-two-ions = Iki iondan başga ion birleşmeleri amala aşyrylmadyk.

ionic-compound-needs-cation-and-anion = Ion birleşmeleri diňe bir kation we bir anion üçin amala aşyryldy.

solve-equations-cannot-evaluate = Deňlemäni çözüp bolmaýar, sebäbi ony hasaplamak başartmady: { $equation }

math-operators-operand-number-required = Matematiki operandy bölüp almak üçin operandNumber berilmeli.

eigen-decomposition-failed = Matrisanyň hususy bahalaryny hasaplamak başartmady

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } parametri nusgada duş gelmeýär, şonuň üçin ol elmydama boşa gabat gelýär.
       *[other] `<matchesPattern>`: { $parameters } parametrleri nusgada duş gelmeýär, şonuň üçin olar elmydama boşa gabat gelýär.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" bahasyny düşündirip bolmaýar. Ol none, medium, dense ýa-da boşluk bilen bölünen iki položitel san bolmaly, mysal üçin grid="1 0.5". Tor çyzylmaýar.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure şekillendirijisinde xLabelPosition="left" goldanylmaýar; sag ýerleşiş özüni alyp barşy ulanylýar.

prefigure-y-label-position-unsupported = `<graph>`: prefigure şekillendirijisinde yLabelPosition="bottom" goldanylmaýar; ýokarky ýerleşiş özüni alyp barşy ulanylýar.

prefigure-invalid-axis-bounds = `<graph>`: prefigure öwrülmesi üçin oklaryň çäkleri nädogry; başlangyç bbox (-10,-10,10,10) ulanylýar.

prefigure-invalid-width = `<graph>`: prefigure öwrülmesi üçin giňlik nädogry; diagrammanyň başlangyç giňligi 425 ulanylýar.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure öwrülmesi üçin aspectRatio nädogry; başlangyç taraplaryň gatnaşygy 1 ulanylýar.

prefigure-grid-spacing-too-fine = `<graph>`: toruň ädimi oklaryň çäkleri üçin örän ownuk; prefigure şekillendirijisinde tor taşlanýar.

prefigure-annotations-not-rendered = `<graph>`: PreFigure şekillendirijisi ulanylmadyk halatynda annotasiýalar çyzylmaýar.

multiple-annotations-children = `<graph>` içinde birnäçe `<annotations>` çagasy tapyldy; soňkusyndan başgasy hasaba alynmaýar.

## Referring to other components

copy-unrecognized-component-type = Tanalmadyk komponent görnüşini giňeldip ýa-da göçürip bolmaýar: { $type }.

copy-prop-not-found = { $component } görnüşli komponentde { $property } häsiýeti tapylmady

collect-no-source = collect üçin çeşme tapylmady.

collect-invalid-component-type = `<{ $component }>` görnüşli komponentleri ýygnap bolmaýar, sebäbi bu nädogry komponent görnüşi.

reference-index-unavailable = `{ $reference }` indeksine salgylanyp bolmaýar

## `<callAction>`

component-action-unavailable = `{ $reference }` komponentinde { $action } çagyryp bolmaýar

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Maglumatlaryň görnüşi nädogry. Setirleriň uzynlyklary dürli. Tapyldy componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Maglumatlarda gaýtalanýan sütün atlary bar. Tapyldy componentIdx :{ $componentIdx }

data-frame-missing-column-name = Maglumatlarda sütün ady ýetmeýär. Tapyldy componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Bu jogabyň award bahasy answer tegiň öz iberilen jogabyna esaslanýar, bu bolsa garaşylmadyk özüni alyp barşa getirer.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` bar konteýneriň içindäki `<answer>` elementine `maxNumAttempts` bellemek täsir etmeýär, sebäbi synanyşyklaryň sanyny konteýner kesgitleýär. `maxNumAttempts` bahasyny konteýnere belläň.

nested-section-wide-check-work-max-num-attempts = Başga `sectionWideCheckWork` konteýneriniň içinde duran `sectionWideCheckWork` konteýnerine `maxNumAttempts` bellemek täsir etmeýär, sebäbi synanyşyklaryň sanyny daşky konteýner kesgitleýär. `maxNumAttempts` bahasyny daşky konteýnere belläň.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality bellenmese, { $attributes } atributy täsir etmez.
       *[other] symbolicEquality bellenmese, { $attributes } atributlary täsir etmez.
    }

answer-invalid-type = answer üçin nädogry görnüş: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` komponentiniň ady ýokdugy sebäpli ony modul atributy hökmünde ulanyp bolmaýar

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` komponentini modul atributy hökmünde ulanyp bolmaýar, sebäbi `<module>` komponent görnüşinde eýýäm «{ $name }» atributy kesgitlenen.

conditional-content-condition-ignored = case ýa-da else çagalary bolan `<conditionalContent>` komponentinde `condition` atributy hasaba alynmaýar.

slider-markers-type-mismatch = Markerleriň görnüşi süýşürijiniň görnüşine gabat gelmeýär.

pretzel-problem-needs-statement-and-answer = Nädogry pretzel: her `<problem>` bir `<statement>` we bir `<answer>` saklamaly.

pretzel-circuit-first-problem-distractor = Nädogry pretzel: mode="circuit" režiminde birinji `<problem>` ünsi sowujy bolup bilmez.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` atributy üçin nädogry baha { $values }; hasaba alynmaýar.
       *[other] `{ $attribute }` atributy üçin nädogry bahalar { $values }; hasaba alynmaýar.
    }

attribute-must-be-references = `{ $attribute }` atributy üçin nädogry baha `{ $value }`. Atribut `$` bilen başlaýan salgylanmalardan durmaly.

math-input-invalid-function-names = <mathInput>: { $attribute } içindäki nädogry funksiýa atlary hasaba alynmady: { $names }. Her adyň görkezilýän bölegi iň azyndan 2 belgi bolmaly (harplar ýa-da defisler); ondan soň hökmany däl `|<mathspeak alternatiw>` goşulmasy gelip biler.

## Building components from the source

component-type-invalid = Nädogry komponent görnüşi: `<{ $componentType }>`

attribute-repeated = { $attribute } atributyny gaýtalap bolmaýar.

attribute-invalid-for-component = `<{ $componentType }>` görnüşli komponent üçin nädogry atribut «{ $attribute }».

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } stil kesgitlemesinde { $context ->
        [text-on-background] tekstiň reňki bilen fonuň reňkiniň
        [high-contrast] ýokary kontrastly reňk bilen kendiriň
        [line] çyzygyň reňki bilen kendiriň
        [marker] markeriň reňki bilen kendiriň
       *[text-on-canvas] tekstiň reňki bilen kendiriň
    } arasyndaky kontrast ýeterlik däl{ $mode ->
        [dark] { " (garaňky tema)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; iň azyndan { $threshold }:1 gerek).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } stil kesgitlemesinde berlen reňkler açyk tema üçin ýeterlik kontrast berse-de, olardan alnan garaňky tema reňkleri tekst bilen fonuň arasynda ýeterlik kontrast bermeýär ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; iň azyndan { $threshold }:1 gerek). { $suggestion ->
        [available] Garaňky temada ýeterlik kontrast üçin ýa açyk temadaky kontrasty ýokarlandyryň (mysal üçin { $lightAttribute }="{ $lightColor }"), ýa-da garaňky tema reňkini çalşyň (mysal üçin { $darkAttribute }="{ $darkColor }").
       *[none] Garaňky temada ýeterlik kontrast üçin açyk temadaky kontrasty ýokarlandyryň ýa-da alnan reňkleri textColorDarkMode we/ýa-da backgroundColorDarkMode bilen çalşyň.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } stil kesgitlemesinde berlen tekstiň reňki açyk tema üçin ýeterlik kontrast berse-de, ondan alnan garaňky tema tekst reňki kendir bilen ýeterlik kontrast bermeýär ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; iň azyndan { $threshold }:1 gerek). { $suggestion ->
        [available] Garaňky temada ýeterlik kontrast üçin ýa açyk temadaky kontrasty ýokarlandyryň (mysal üçin textColor="{ $lightColor }"), ýa-da garaňky tema reňkini çalşyň (mysal üçin textColorDarkMode="{ $darkColor }").
       *[none] Garaňky temada ýeterlik kontrast üçin açyk temadaky kontrasty ýokarlandyryň ýa-da alnan reňki textColorDarkMode bilen çalşyň.
    }

section-multiple-style-palettes = Bölüm diňe bir <stylePalette> saýlap bilýär; soňkusy ulanylýar.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } üçin üýtgeşik wariantlary kesgitläp bolmaýar, sebäbi numToSelect otrisatel däl bitin san däl.

variant-num-to-select-not-constant-number = { $component } üçin üýtgeşik wariantlary kesgitläp bolmaýar, sebäbi numToSelect hemişelik san däl.

variant-with-replacement-not-constant-boolean = { $component } üçin üýtgeşik wariantlary kesgitläp bolmaýar, sebäbi withReplacement hemişelik logiki baha däl.

variant-select-weight-disables-unique = haýsydyr bir saýlawda selectWeight ýa-da selectForVariants berlen bolsa, select üçin üýtgeşik wariantlar öçürilýär

variant-coprime-undetermined = { $component } üçin üýtgeşik wariantlary kesgitläp bolmaýar, sebäbi coprime elmydama ýalňyşdygyny kesgitläp bolmaýar.

variant-attribute-not-constant = { $component } üçin üýtgeşik wariantlary kesgitläp bolmaýar, sebäbi { $attribute } hemişelik däl.

variant-attribute-not-number = { $component } üçin üýtgeşik wariantlary kesgitläp bolmaýar, sebäbi { $attribute } san däl.

variant-attribute-wrong-type-for-sequence =
    { $type } görnüşli { $component } üçin üýtgeşik wariantlary kesgitläp bolmaýar, sebäbi { $attribute } { $expected ->
        [letters-combination] harplaryň utgaşmasy
        [math-expression] ýaramly matematiki aňlatma
        [integer] bitin san
       *[number] san
    } däl.

variant-length-not-integer = { $component } üçin üýtgeşik wariantlary kesgitläp bolmaýar, sebäbi length bitin san däl.

variant-sort-not-implemented = sort bolan { $component } üçin üýtgeşik wariantlar amala aşyrylmadyk

variant-exclude-combinations-not-implemented = excludeCombinations bolan { $component } üçin üýtgeşik wariantlar amala aşyrylmadyk

variant-math-exclude-not-implemented = exclude bolan math görnüşli { $component } üçin üýtgeşik wariantlar amala aşyrylmadyk

variant-non-constant-exclude-not-implemented = hemişelik däl exclude bolan { $component } üçin üýtgeşik wariantlar amala aşyrylmadyk

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: grafigiň prefigure şekillendirijisinde goldanylmaýar; nesil geçirildi.

prefigure-descendant-invalid-geometry = { $subject }: çäksiz ýa-da doly däl geometriýa; nesil geçirildi.

prefigure-curve-label-omitted = { $subject }: öwrülen egri elementlerinde belgiler goldanylmaýar; belgi taşlandy.

prefigure-curve-unsupported-definition-type = { $subject }: goldanylmaýan egri funksiýa kesgitlemesiniň görnüşi «{ $definitionType }»; nesil geçirildi.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves elementindäki flipFunctions atributy goldanylmaýar; nesil geçirildi.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves diňe formula bilen berlen çaga funksiýalary goldaýar; nesil geçirildi.

prefigure-label-position-unsupported =
    { $subject }: goldanylmaýan labelPosition «{ $labelPosition }» { $labelKind ->
        [line-family] çyzyklar maşgalasynyň belgisi üçin
       *[point] nokadyň belgisi üçin
    }; PreFigure-iň başlangyç deňleşdirmesi ulanylýar.

prefigure-fill-style-unsupported = { $subject }: doldurma stili «{ $fillStyle }» PreFigure tarapyndan goldanylmaýar; bitewi doldurma geçilýär.

prefigure-line-style-unknown = { $subject }: näbelli çyzyk stili «{ $lineStyle }» PreFigure çykyşyndan aýryldy.

prefigure-marker-style-mapped-to-diamond = { $subject }: marker stili «{ $markerStyle }» PreFigure «diamond» stiline gabat getirildi.

prefigure-marker-style-unsupported = { $subject }: marker stili «{ $markerStyle }» PreFigure tarapyndan goldanylmaýar; başlangyç stil ulanylýar.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: nädogry `ref`; nyşanany baglanyşdyryp bolmaýar. Annotasiýa taşlandy.

annotation-ref-multiple-targets = `<annotation>`: `ref` birnäçe nyşana bilen baglanyşdy; birinjisi ulanylýar.

annotation-ref-outside-graph = `<annotation>`: nädogry `ref`; nyşana ony saklaýan grafikden daşarda. Annotasiýa taşlandy.

annotation-ref-unsupported-target = `<annotation>`: nädogry `ref`; nyşana prefigure öwrülmesinde goldanylýan grafiki obýekt däl. Annotasiýa taşlandy.

annotation-text-missing = `<annotation>`: `text` ýok ýa-da boş; boş tekst çykarylýar.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Aýlaw baglanyşygy ýüze çykaryldy.
       *[other] `<{ $componentType }>` komponentini öz içine alýan aýlaw baglanyşygy ýüze çykaryldy.
    }

reference-no-referent = Salgylanma üçin obýekt tapylmady: `{ $reference }`

reference-multiple-referents = Salgylanma üçin birnäçe obýekt tapyldy: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` elementiniň { $attribute } atributynyň formaty nädogry.

children-invalid = `<{ $componentType }>` üçin nädogry çagalar: nädogry çagalar tapyldy: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` atributy üçin nädogry baha `{ $value }`; `{ $default }` bahasy ulanylýar

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } wersiýasy tapylmady.
       *[other] DoenetML { $version } wersiýasy tapylmady. { $fallback } wersiýasy ulanylýar
    }

## Reading the DoenetML

parse-invalid-doenetml = Nädogry DoenetML: { $content }

parse-tag-missing-close-tag = Nädogry DoenetML: `{ $tag }` tegiň ýapyjy tegi ýok. Özi ýapylýan teg ýa-da `</{ $tagName }>` tegi garaşylýardy.

parse-tag-error = Nädogry DoenetML: `<{ $tagName }>` teginde ýalňyşlyk

parse-attribute-missing-value = Nädogry DoenetML: `{ $attribute }` atributynda baha ýetmeýän ýaly.

parse-attribute-invalid = Nädogry DoenetML: nädogry atribut `{ $attribute }`

parse-attribute-value-invalid = Nädogry DoenetML: nädogry atribut bahasy `{ $value }`

parse-attribute-value-quote-mismatch = Nädogry DoenetML: nädogry atribut bahasy `{ $value }`. Dyrnaklar gabat gelmeýär. `{ $quote }` ýetmeýän ýaly

parse-open-tag-name-missing = Nädogry DoenetML: adsyz teg tapyldy, mysal üçin `<`

parse-tag-not-closed = Nädogry DoenetML: `{ $tag }` tegi ýapylmadyk (`>` ýetmeýän ýaly).

parse-self-closing-tag-name-missing = Nädogry DoenetML: adsyz teg tapyldy `<{ $content }>`

parse-self-closing-tag-not-closed = Nädogry DoenetML: `{ $tag }` tegi ýapylmadyk (`/>` ýetmeýän ýaly).

parse-tag-invalid-attributes = Nädogry DoenetML: `{ $tag }` tegi ýaramly däl. Onuň atributlary nädogry bolup biler.

parse-close-tag-name-missing = Nädogry DoenetML: adsyz ýapyjy teg tapyldy, mysal üçin `</`

parse-attribute-value-unquoted = Atribut bahalary dyrnaklaryň içinde bolmaly: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Nädogry DoenetML: `{ $tag }` ýapyjy tegi tapyldy, ýöne oňa gabat gelýän açyjy teg ýok

parse-close-tag-mismatched = Nädogry DoenetML: gabat gelmeýän ýapyjy teg. `</{ $expected }>` garaşylýardy. `{ $found }` tapyldy

parser-node-unconvertible = { $node } düwünini Dast düwünine öwürmek başartmady.

## Names

name-attribute-invalid =
    Nädogry atribut name='{ $name }'. { $reason ->
        [characters] Atlarda diňe harplar, sanlar, aşaky çyzyklar ýa-da defisler bolup biler.
       *[start] Atlar harp bilen başlamaly.
    }

component-name-invalid-start = Nädogry komponent ady «{ $name }». Atlar harp bilen başlamaly.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched görnüşli answer-iň video atributy bolmaly

answer-video-watched-video-not-reference = videoWatched görnüşli answer-iň video atributy salgylanma bolmaly

answer-name-not-single-text = answer-iň name atributynda takyk bir tekst çagasy bolmaly

## Referencing another document

external-doenetml-recursion-limit = Rekursiýa derejeleri örän köp bolansoň daşarky DoenetML alynmady. Aýlaw salgylanma barmyka?

external-doenetml-unavailable = { $attribute }="{ $uri }" salgysyndan DoenetML alynmady

external-doenetml-type-mismatch = { $attribute }="{ $uri }" salgysyndan nädogry DoenetML alyndy: ol «{ $componentType }» komponent görnüşine gabat gelmedi

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` atributy köneldi; onuň ýerine `{ $to }` ulanyň.
       *[other] [deprecation] `<{ $component }>` elementindäki `{ $from }` atributy köneldi; onuň ýerine `{ $to }` ulanyň.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` atributy köneldi we hasaba alynmaýar, sebäbi `{ $to }` hem berlen.
       *[other] [deprecation] `<{ $component }>` elementindäki `{ $from }` atributy köneldi we hasaba alynmaýar, sebäbi `{ $to }` hem berlen.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` elementindäki `{ $attribute }` atributy köneldi we hasaba alynmaýar.


## Language coverage

pluralize-english-only = `<pluralize>` diňe iňlis dilinde köplük ýasap bilýär, şonuň üçin { $locale } dilinde ýazylan resminamada onuň teksti üýtgewsiz galýar. Köplük görnüşini özüňiz ýazyň ýa-da ony `pluralForm` atributy bilen belläň.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` elementi tanalýan Doenet elementi däl.

schema-element-not-allowed-at-root = `<{ $tag }>` elementine resminamanyň kökünde rugsat berilmeýär.

schema-element-not-allowed-inside = `<{ $tag }>` elementine `<{ $parent }>` içinde rugsat berilmeýär.

schema-attribute-unrecognized = `<{ $tag }>` elementinde `{ $attribute }` atly atribut ýok.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` elementiniň `{ $attribute }` atributy her elementi şulardan biri bolan sanaw bolmaly: { $allowed }
       *[other] `<{ $tag }>` elementiniň `{ $attribute }` atributy şulardan biri bolmaly: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select üçin nädogry wariant ady. { $variantName } wariant ady { $numOptions } saýlawda duş gelýär, saýlanmaly sany bolsa { $numToSelect }.

select-variant-name-without-options = select üçin wariantlar berlen, ýöne mümkin bolan wariant ady üçin hiç bir saýlaw ýok: { $variantName }.

select-variant-name-not-possible = select üçin berlen { $variantName } wariant ady mümkin bolan wariant ady däl.

select-too-few-options = Diňe { $numOptions } içinden { $numToSelect } komponenti saýlap bolmaýar.

select-from-sequence-too-few-values = Uzynlygy { $length } yzygiderlikden { $numToSelect } baha saýlap bolmaýar.

select-from-sequence-indices-count-mismatch = select üçin berlen indeksleriň sany saýlanmaly sana gabat gelmeli

select-from-sequence-indices-not-integers = select üçin berlen ähli indeksler bitin san bolmaly

select-from-sequence-index-excluded = selectfromsequence üçin berlen indeks aýrylandy

select-from-sequence-indices-excluded-combination = selectfromsequence üçin berlen indeksler aýrylan utgaşmady

select-from-sequence-coprime-not-positive-integers = Položitel bitin sanlar saýlanmaýandygy üçin özara ýönekeý utgaşmalary saýlap bolmaýar.

select-from-sequence-coprime-common-factor = Özara ýönekeý sanlary saýlap bolmaýar. Ähli mümkin bolan bahalaryň umumy bölüjisi bar. (Berlen "from" ýa-da "to" bahalary "step" bilen özara ýönekeý bolmaly.)

select-from-sequence-coprime-single-number = 1 bolmadyk ýeke sandan özara ýönekeý utgaşmalary saýlap bolmaýar.

select-from-sequence-excluded-too-many-combinations = selectFromSequence içinde utgaşmalaryň 70%-den gowragy aýryldy

select-from-sequence-coprime-none-found = Özara ýönekeý sanlary saýlamak başartmady. Ähli mümkin bolan bahalaryň umumy bölüjisi bar.

select-from-sequence-too-few-unique-values = Uzynlygy { $numPossibleValues } yzygiderlikden { $numToSelect } dürli baha saýlap bolmaýar

select-prime-numbers-too-few-values = Uzynlygy { $numValues } ýönekeý sanlar sanawyndan { $numToSelect } baha saýlap bolmaýar

select-prime-numbers-values-count-mismatch = select üçin berlen bahalaryň sany saýlanmaly sana gabat gelmeli

select-prime-numbers-values-not-prime = select prime number üçin berlen ähli bahalar ýönekeý sanlar sanawynda bolmaly

select-prime-numbers-values-excluded-combination = selectPrimeNumbers üçin berlen bahalar aýrylan utgaşmady

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers içinde utgaşmalaryň 70%-den gowragy aýryldy

select-random-combination-fluke = Örän ähtimal däl tötänlik sebäpli tötänleýin bahalaryň utgaşmasyny saýlamak başartmady

select-random-value-fluke = Örän ähtimal däl tötänlik sebäpli tötänleýin bahany saýlamak başartmady
