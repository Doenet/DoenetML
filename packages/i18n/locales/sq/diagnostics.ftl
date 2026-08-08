# Albanian diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Albanian counts in the same two categories English does, so every selection
# below keeps both branches.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } shpërfillet kur jepen të dyja skajet
       *[other] { $attributes } shpërfillen kur jepen të dyja skajet
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } shpërfillet kur jepen edhe një skaj edhe një mesore
       *[other] { $attributes } shpërfillen kur jepen edhe një skaj edhe një mesore
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset nuk ka efekt pa një mesore

## `<line>`

line-points-undetermined-dimensions = Drejtëz nëpër pika me përmasa të papërcaktuara.

line-points-too-few-dimensions = Drejtëza duhet të kalojë nëpër pika me të paktën dy përmasa.

line-points-depend-on-variables = Drejtëza kalon nëpër pika që varen nga ndryshoret: { $variables }.

line-equation-invalid-format = Format i pavlefshëm i ekuacionit të drejtëzës në ndryshoret { $variable1 } dhe { $variable2 }.

## `<ray>`

ray-overprescribed-through = Gjysmëdrejtëza jepet me through, endpoint dhe direction. Through-i i dhënë shpërfillet.

ray-dimension-mismatch = Mospërputhje e numDimensions te gjysmëdrejtëza.

## `<vector>`

vector-overprescribed-head = Vektori jepet me head, tail dhe displacement. Head-i i dhënë shpërfillet.

vector-dimension-mismatch = Mospërputhje e numDimensions te vektori.

## Attracting and constraining

attract-to-without-nearest-point = Nuk mund të tërhiqet drejt `<{ $component }>` sepse nuk ka ndryshoren e gjendjes nearestPoint.

constrain-to-without-nearest-point = Nuk mund të kufizohet te `<{ $component }>` sepse nuk ka ndryshoren e gjendjes nearestPoint.

constrain-to-interior-without-nearest-point = Nuk mund të kufizohet te brendësia e `<{ $component }>` sepse nuk ka ndryshoren e gjendjes nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition shpërfillet për një choiceInput jo të brendashkruar

## Ordering children by index

choice-input-indices-count-mismatch = Indekset e dhënë për choiceInput shpërfillen sepse numri i tyre nuk përputhet me numrin e choice-ve fëmijë.

pretzel-indices-count-mismatch = Indekset e dhënë për problem shpërfillen sepse numri i tyre nuk përputhet me numrin e problem-eve fëmijë.

shuffle-indices-count-mismatch = Indekset e dhënë për shuffle shpërfillen sepse numri i tyre nuk përputhet me numrin e përbërësve.

indices-ignored-out-of-range = Indekset e dhënë për { $component } shpërfillen sepse disa dalin jashtë intervalit.

pretzel-indices-repeated = Indekset e dhënë për pretzel shpërfillen sepse disa përsëriten.

pretzel-circuit-first-index = Indekset e dhënë për pretzel në mënyrën circuit shpërfillen sepse indeksi i parë duhet të jetë 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Që `<{ $component }>` të punojë me fëmijë tekstualë, duhet dhënë atributi `type`.

invalid-type-defaulting-to-math = Lloj i pavlefshëm { $type } për përbërësin { $component }. Duhet të jetë math, text, number ose boolean. Përdoret math.

string-not-valid-component-to-arrange = Vargu „{ $value }” nuk është përbërës i vlefshëm për { $component }. Shpërfillet.

## Types and variables

invalid-type-defaulting-to-number = Lloj i pavlefshëm { $type }; lloji vendoset në number.

invalid-variable-value = Vlerë e pavlefshme e një ndryshoreje: `{ $value }`

## Variants

variant-index-must-be-number = Indeksi i variantit { $index } duhet të jetë numër

variant-index-must-be-integer = Indeksi i variantit { $index } duhet të jetë numër i plotë

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` nuk është zbatuar për matje absolute. Gjerësitë bëhen relative.

side-by-side-absolute-margins = `<{ $component }>` nuk është zbatuar për matje absolute. Anët bëhen relative.

side-by-side-no-block-child = `<{ $component }>` i pavlefshëm: duhet të ketë të paktën një fëmijë bllok.

## `<label>`

label-for-ignored-on-graphical = Atributi `for` te një `<label>` grafik shpërfillet.

label-for-must-resolve-to-one = Atributi `for` te `<label>` duhet të çojë saktësisht te një përbërës.

label-for-unresolved = Atributi `for` te `<label>` nuk mundi të zgjidhej në një përbërës.

label-for-answer-with-authored-inputs = Atributi `for` te `<label>` i referohet një `<answer>` me fusha hyrjeje të shkruara shprehimisht; referojuni drejtpërdrejt fushës.

label-for-answer-without-input = Atributi `for` te `<label>` i referohet një `<answer>` pa fushë hyrjeje për ta etiketuar.

label-for-must-reference-input-or-answer = Atributi `for` te `<label>` duhet t'i referohet një fushe hyrjeje ose një përgjigjeje.

## Accessibility

accessibility-short-description-or-decorative = Për qasshmëri, `<{ $component }>` duhet të ketë një përshkrim të shkurtër ose të shënohet si zbukurues.

accessibility-video-short-description = Për qasshmëri, `<video>` duhet të ketë një përshkrim të shkurtër.

accessibility-input-short-description-or-label = Për qasshmëri, `<{ $component }>` duhet të ketë një përshkrim të shkurtër ose një etiketë.

accessibility-answer-input-short-description-or-label = Për qasshmëri, një `<answer>` që krijon një fushë hyrjeje duhet të ketë një përshkrim të shkurtër ose një etiketë.

accessibility-short-description-contains-math = Përshkrimet e shkurtra nuk duhet të përmbajnë përbërës matematikorë si `<{ $component }>`. Shkruajeni matematikën me fjalë.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ka kontrast të pamjaftueshëm për tekstin e titullit të seksionit (mënyra e errët) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kërkohet të paktën { $threshold }:1).
       *[other] { $colorName } ka kontrast të pamjaftueshëm për tekstin e titullit të seksionit ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kërkohet të paktën { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` nëpër { $count } pika nuk është zbatuar kur pikat nuk kanë vlera numerike.

circle-too-many-through-points = Nuk mund të llogaritet rrethi nëpër më shumë se 3 pika.

circle-overprescribed-radius-center-points = Nuk mund të llogaritet rrethi me rreze, qendër dhe pika të dhëna njëherësh.

circle-center-with-multiple-points = Nuk mund të llogaritet rrethi me qendër të dhënë nëpër më shumë se 1 pikë.

circle-radius-too-small = Nuk mund të llogaritet rrethi: meqë largësia midis dy pikave është { $distance }, rrezja e dhënë { $radius } është shumë e vogël.

circle-radius-with-many-points = Nuk mund të ndërtohet rrethi nëpër më shumë se dy pika me rreze të dhënë.

circle-invalid-center-or-through-points = Qendër ose pika të pavlefshme të rrethit.

circle-radius-center-with-multiple-points = Nuk mund të llogaritet rrezja e rrethit me qendër të dhënë nëpër më shumë se 1 pikë.

circle-change-radius-non-numerical = Nuk mund të ndryshohet rrezja e një rrethi me pika jonumerike

circle-radius-with-points-non-numerical = Nuk mund të ndërtohet rrethi nëpër më shumë se një pikë me rreze të dhënë kur nuk ka vlera numerike.

circle-change-center-non-numerical = Ndryshimi i qendrës së një rrethi nëpër pika jonumerike nuk është zbatuar.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Përmasa të pamjaftueshme për bashkësinë e përcaktimit të funksionit. Bashkësia ka { $intervals } interval, kurse funksioni ka { $inputs ->
            [one] { $inputs } hyrje
           *[other] { $inputs } hyrje
        }.
       *[other] Përmasa të pamjaftueshme për bashkësinë e përcaktimit të funksionit. Bashkësia ka { $intervals } intervale, kurse funksioni ka { $inputs ->
            [one] { $inputs } hyrje
           *[other] { $inputs } hyrje
        }.
    }

function-domain-invalid-format = Format i pavlefshëm i bashkësisë së përcaktimit të funksionit.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Maksimumi jonumerik i funksionit shpërfillet.
        [minimum] Minimumi jonumerik i funksionit shpërfillet.
        [extremum] Ekstremumi jonumerik i funksionit shpërfillet.
        [point] Pika jonumerike e funksionit shpërfillet.
        [slope] Pjerrësia jonumerike e funksionit shpërfillet.
       *[other] { $type } jonumerik i funksionit shpërfillet.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Maksimumi bosh i funksionit shpërfillet.
        [minimum] Minimumi bosh i funksionit shpërfillet.
        [extremum] Ekstremumi bosh i funksionit shpërfillet.
        [point] Pika bosh e funksionit shpërfillet.
       *[other] { $type } bosh i funksionit shpërfillet.
    }

function-points-too-close = Funksioni përmban dy pika shumë afër njëra-tjetrës. Funksioni nuk mund të përcaktohet.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Përsëritjet e funksionit janë të mundshme vetëm nëse numri i hyrjeve barazohet me numrin e daljeve. Ky funksion ka { $inputs } hyrje dhe { $outputs ->
            [one] { $outputs } dalje
           *[other] { $outputs } dalje
        }.
       *[other] Përsëritjet e funksionit janë të mundshme vetëm nëse numri i hyrjeve barazohet me numrin e daljeve. Ky funksion ka { $inputs } hyrje dhe { $outputs ->
            [one] { $outputs } dalje
           *[other] { $outputs } dalje
        }.
    }

## `<sequence>`

sequence-invalid-length = Gjatësi e pavlefshme e vargut. Duhet të jetë numër i plotë jonegativ.

sequence-invalid-step = Hap i pavlefshëm i vargut. Për varg të llojit { $type } duhet të jetë numër.

sequence-invalid-endpoint-number = „{ $attribute }” i pavlefshëm i një vargu numerik. Duhet të jetë numër.

sequence-invalid-endpoint-letters = „{ $attribute }” i pavlefshëm i një vargu shkronjash. Duhet të jetë ndërthurje shkronjash.

sequence-invalid-endpoint = „{ $attribute }” i pavlefshëm i vargut.

select-from-sequence-coprime-not-numbers = coprime shpërfillet sepse nuk po zgjidhen numra

select-from-sequence-coprime-with-exclude-combinations = coprime shpërfillet sepse është dhënë excludeCombinations

## Resolving a `target`

target-not-found = target i pavlefshëm për `<{ $source }>`: objektivi nuk u gjet.

target-state-variable-not-found = target i pavlefshëm për `<{ $source }>`: `<{ $component }>` nuk ka ndryshore gjendjeje me emrin „{ $property }”.

## `<odeSystem>`

ode-system-variables-match-independent = Ndryshoret e `<odeSystem>` duhet të ndryshojnë nga ndryshorja e pavarur.

ode-system-duplicate-variable-names = Nuk mund të përcaktohen anët e djathta të EDZ me emra të përsëritur ndryshoresh të varura.

ode-system-rhs-function-error = Nuk mund të përcaktohet ana e djathtë e EDZ. Gabim gjatë krijimit të funksionit mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Nuk mund të përcaktohet një kënd midis { $count } drejtëzash

angle-invalid-through-point = Pikë e pavlefshme te through i `<angle>`

parabola-vertex-too-many-points = Parabola me kulm të dhënë nëpër më shumë se 1 pikë nuk është zbatuar.

parabola-too-many-points = Parabola nëpër më shumë se 3 pika nuk është zbatuar.

intersection-too-many-items = Prerja e më shumë se dy objekteve nuk është zbatuar

## Other math components

ionic-compound-not-two-ions = Përbërjet jonike përveç atyre me dy jone nuk janë zbatuar.

ionic-compound-needs-cation-and-anion = Përbërjet jonike janë zbatuar vetëm për një kation dhe një anion.

solve-equations-cannot-evaluate = Ekuacioni nuk mund të zgjidhet sepse nuk mundi të llogaritej: { $equation }

math-operators-operand-number-required = Për të nxjerrë një veprues matematikor duhet dhënë operandNumber.

eigen-decomposition-failed = Vlerat vetjake të matricës nuk mundën të llogariteshin

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parametri { $parameters } nuk shfaqet në model, prandaj do të përputhet gjithmonë me një bosh.
       *[other] `<matchesPattern>`: parametrat { $parameters } nuk shfaqen në model, prandaj do të përputhen gjithmonë me një bosh.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: nuk mund të kuptohet grid="{ $grid }". Vlera duhet të jetë none, medium, dense ose dy numra pozitivë të ndarë me hapësirë, si grid="1 0.5". Nuk vizatohet rrjetë.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" nuk mbulohet te paraqitësi prefigure; përdoret sjellja e pozicionit të djathtë.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" nuk mbulohet te paraqitësi prefigure; përdoret sjellja e pozicionit të sipërm.

prefigure-invalid-axis-bounds = `<graph>`: kufij boshtesh të pavlefshëm për shndërrimin në prefigure; përdoret bbox-i i parazgjedhur (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: gjerësi e pavlefshme për shndërrimin në prefigure; përdoret gjerësia e parazgjedhur e diagramit 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio i pavlefshëm për shndërrimin në prefigure; përdoret raporti i parazgjedhur i brinjëve 1.

prefigure-grid-spacing-too-fine = `<graph>`: hapi i rrjetës është shumë i imët për kufijtë e boshteve; te paraqitësi prefigure rrjeta hiqet.

prefigure-annotations-not-rendered = `<graph>`: jashtë paraqitësit PreFigure shënimet nuk vizatohen.

multiple-annotations-children = Te `<graph>` u gjetën disa `<annotations>` fëmijë; të gjithë përveç të fundit shpërfillen.

## Referring to other components

copy-unrecognized-component-type = Nuk mund të zgjerohet ose kopjohet një lloj përbërësi i panjohur: { $type }.

copy-prop-not-found = Vetia { $property } nuk u gjet te një përbërës i llojit { $component }

collect-no-source = Për collect nuk u gjet burim.

collect-invalid-component-type = Nuk mund të mblidhen përbërës të llojit `<{ $component }>` sepse është lloj i pavlefshëm përbërësi.

reference-index-unavailable = Nuk mund t'i referohesh indeksit `{ $reference }`

## `<callAction>`

component-action-unavailable = Nuk mund të thirret { $action } te përbërësi `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Të dhënat kanë formë të pavlefshme. Rreshtat kanë gjatësi të ndryshme. Gjetur te componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Të dhënat kanë emra shtyllash të përsëritur. Gjetur te componentIdx :{ $componentIdx }

data-frame-missing-column-name = Të dhënave u mungon një emër shtylle. Gjetur te componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award-i i kësaj përgjigjeje mbështetet te përgjigjja e dërguar e vetë etiketës answer, çka do të çojë në sjellje të papritur.

answer-max-num-attempts-in-section-wide-check-work = Vendosja e `maxNumAttempts` te një `<answer>` brenda një enë me `sectionWideCheckWork` nuk ka efekt, sepse numrin e përpjekjeve e përcakton ena. Vendoseni `maxNumAttempts` te ena.

nested-section-wide-check-work-max-num-attempts = Vendosja e `maxNumAttempts` te një enë me `sectionWideCheckWork` që vetë ndodhet brenda një ene tjetër me `sectionWideCheckWork` nuk ka efekt, sepse numrin e përpjekjeve e përcakton ena e jashtme. Vendoseni `maxNumAttempts` te ena e jashtme.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Atributi { $attributes } nuk do të ketë efekt pa vendosur symbolicEquality.
       *[other] Atributet { $attributes } nuk do të kenë efekt pa vendosur symbolicEquality.
    }

answer-invalid-type = Lloj i pavlefshëm për answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Përbërësi `<{ $component }>` nuk ka emër, prandaj nuk mund të përdoret si atribut moduli

module-attribute-name-already-defined = Përbërësi `<{ $component } name="{ $name }">` nuk mund të përdoret si atribut moduli sepse lloji i përbërësit `<module>` ka tashmë një atribut „{ $name }” të përcaktuar.

conditional-content-condition-ignored = Atributi `condition` shpërfillet te një përbërës `<conditionalContent>` me fëmijë case ose else.

slider-markers-type-mismatch = Lloji i shenjuesve nuk përputhet me llojin e rrëshqitësit.

pretzel-problem-needs-statement-and-answer = pretzel i pavlefshëm: çdo `<problem>` duhet të përmbajë një `<statement>` dhe një `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel i pavlefshëm: te mode="circuit" `<problem>`-i i parë nuk mund të jetë shpërqendrues.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Vlerë e pavlefshme { $values } për atributin `{ $attribute }`; shpërfillet.
       *[other] Vlera të pavlefshme { $values } për atributin `{ $attribute }`; shpërfillen.
    }

attribute-must-be-references = Vlerë e pavlefshme `{ $value }` për atributin `{ $attribute }`. Atributi duhet të përbëhet nga referenca që nisin me `$`.

math-input-invalid-function-names = <mathInput>: emrat e pavlefshëm të funksioneve te { $attribute } u shpërfillën: { $names }. Pjesa e shfaqur e çdo emri duhet të jetë të paktën 2 shenja (shkronja ose viza); pas saj mund të vijë një prapashtesë jo e detyrueshme `|<alternativa mathspeak>`.

## Building components from the source

component-type-invalid = Lloj i pavlefshëm përbërësi: `<{ $componentType }>`

attribute-repeated = Atributi { $attribute } nuk mund të përsëritet.

attribute-invalid-for-component = Atribut i pavlefshëm „{ $attribute }” për një përbërës të llojit `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Përcaktimi i stilit { $styleNumber } ka kontrast të pamjaftueshëm për { $context ->
        [text-on-background] ngjyrën e tekstit kundrejt ngjyrës së sfondit
        [high-contrast] ngjyrën me kontrast të lartë kundrejt kanavacës
        [line] ngjyrën e vijave kundrejt kanavacës
        [marker] ngjyrën e shenjuesve kundrejt kanavacës
       *[text-on-canvas] ngjyrën e tekstit kundrejt kanavacës
    }{ $mode ->
        [dark] { " (mënyra e errët)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kërkohet të paktën { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Edhe pse përcaktimi i stilit { $styleNumber } jep ngjyra me kontrast të mjaftueshëm për mënyrën e ndritshme, ngjyrat e mënyrës së errët të nxjerra prej tyre japin kontrast të pamjaftueshëm të tekstit kundrejt sfondit ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kërkohet të paktën { $threshold }:1). { $suggestion ->
        [available] Për kontrast të mjaftueshëm në mënyrën e errët, ose rritni kontrastin në mënyrën e ndritshme (për shembull { $lightAttribute }="{ $lightColor }"), ose zëvendësoni ngjyrën e mënyrës së errët (për shembull { $darkAttribute }="{ $darkColor }").
       *[none] Për kontrast të mjaftueshëm në mënyrën e errët, rritni kontrastin në mënyrën e ndritshme ose zëvendësoni ngjyrat e nxjerra me textColorDarkMode dhe/ose backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Edhe pse përcaktimi i stilit { $styleNumber } jep një ngjyrë teksti me kontrast të mjaftueshëm për mënyrën e ndritshme, ngjyra e tekstit e mënyrës së errët e nxjerrë prej saj jep kontrast të pamjaftueshëm kundrejt kanavacës ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kërkohet të paktën { $threshold }:1). { $suggestion ->
        [available] Për kontrast të mjaftueshëm në mënyrën e errët, ose rritni kontrastin në mënyrën e ndritshme (për shembull textColor="{ $lightColor }"), ose zëvendësoni ngjyrën e mënyrës së errët (për shembull textColorDarkMode="{ $darkColor }").
       *[none] Për kontrast të mjaftueshëm në mënyrën e errët, rritni kontrastin në mënyrën e ndritshme ose zëvendësoni ngjyrën e nxjerrë me textColorDarkMode.
    }

section-multiple-style-palettes = Një seksion mund të zgjedhë vetëm një <stylePalette>; përdoret e fundit.

## Unique variants

variant-num-to-select-not-non-negative-integer = nuk mund të përcaktohen variantet unike të { $component } sepse numToSelect nuk është numër i plotë jonegativ.

variant-num-to-select-not-constant-number = nuk mund të përcaktohen variantet unike të { $component } sepse numToSelect nuk është numër i qëndrueshëm.

variant-with-replacement-not-constant-boolean = nuk mund të përcaktohen variantet unike të { $component } sepse withReplacement nuk është vlerë logjike e qëndrueshme.

variant-select-weight-disables-unique = Variantet unike për select çaktivizohen nëse ndonjë mundësi ka selectWeight ose selectForVariants të dhënë

variant-coprime-undetermined = nuk mund të përcaktohen variantet unike të { $component } sepse nuk mund të vërtetohet se coprime është gjithmonë i rremë.

variant-attribute-not-constant = nuk mund të përcaktohen variantet unike të { $component } sepse { $attribute } nuk është konstante.

variant-attribute-not-number = nuk mund të përcaktohen variantet unike të { $component } sepse { $attribute } nuk është numër.

variant-attribute-wrong-type-for-sequence =
    nuk mund të përcaktohen variantet unike të { $component } të llojit { $type } sepse { $attribute } nuk është { $expected ->
        [letters-combination] ndërthurje shkronjash
        [math-expression] shprehje matematike e vlefshme
        [integer] numër i plotë
       *[number] numër
    }.

variant-length-not-integer = nuk mund të përcaktohen variantet unike të { $component } sepse length nuk është numër i plotë.

variant-sort-not-implemented = variantet unike të një { $component } me sort nuk janë zbatuar

variant-exclude-combinations-not-implemented = variantet unike të një { $component } me excludeCombinations nuk janë zbatuar

variant-math-exclude-not-implemented = variantet unike të një { $component } të llojit math me exclude nuk janë zbatuar

variant-non-constant-exclude-not-implemented = variantet unike të një { $component } me exclude jo të qëndrueshëm nuk janë zbatuar

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: nuk mbulohet te paraqitësi prefigure i grafikut; pasardhësi u anashkalua.

prefigure-descendant-invalid-geometry = { $subject }: gjeometri jo e fundme ose e paplotë; pasardhësi u anashkalua.

prefigure-curve-label-omitted = { $subject }: etiketat nuk mbulohen te elementet e shndërruara të kurbave; etiketa u hoq.

prefigure-curve-unsupported-definition-type = { $subject }: lloj i pambuluar i përcaktimit të funksionit të kurbës „{ $definitionType }”; pasardhësi u anashkalua.

prefigure-region-flip-functions-unsupported = { $subject }: atributi flipFunctions te regionBetweenCurves nuk mbulohet; pasardhësi u anashkalua.

prefigure-region-non-formula-child = { $subject }: te regionBetweenCurves mbulohen vetëm funksionet fëmijë të dhëna me formulë; pasardhësi u anashkalua.

prefigure-label-position-unsupported =
    { $subject }: labelPosition i pambuluar „{ $labelPosition }” për { $labelKind ->
        [line-family] etiketë të familjes së drejtëzave
       *[point] etiketë pike
    }; përdoret rreshtimi i parazgjedhur i PreFigure.

prefigure-fill-style-unsupported = { $subject }: stili i mbushjes „{ $fillStyle }” nuk mbulohet nga PreFigure; përdoret mbushje e plotë.

prefigure-line-style-unknown = { $subject }: stili i panjohur i vijës „{ $lineStyle }” u hoq nga dalja e PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: stili i shenjuesit „{ $markerStyle }” u pasqyrua te stili „diamond” i PreFigure.

prefigure-marker-style-unsupported = { $subject }: stili i shenjuesit „{ $markerStyle }” nuk mbulohet nga PreFigure; përdoret stili i parazgjedhur.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` i pavlefshëm; objektivi nuk mund të zgjidhet. Shënimi u hoq.

annotation-ref-multiple-targets = `<annotation>`: `ref` u zgjidh në disa objektiva; përdoret i pari.

annotation-ref-outside-graph = `<annotation>`: `ref` i pavlefshëm; objektivi është jashtë grafikut që e përmban. Shënimi u hoq.

annotation-ref-unsupported-target = `<annotation>`: `ref` i pavlefshëm; objektivi nuk është objekt grafik i mbuluar në shndërrimin prefigure. Shënimi u hoq.

annotation-text-missing = `<annotation>`: `text` mungon ose është bosh; nxirret tekst bosh.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] U zbulua një varësi rrethore.
       *[other] U zbulua një varësi rrethore që përfshin përbërësin `<{ $componentType }>`.
    }

reference-no-referent = Nuk u gjet objekt për referencën: `{ $reference }`

reference-multiple-referents = U gjetën disa objekte për referencën: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format i pavlefshëm i atributit { $attribute } të `<{ $componentType }>`.

children-invalid = Fëmijë të pavlefshëm për `<{ $componentType }>`: u gjetën fëmijë të pavlefshëm: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Vlerë e pavlefshme `{ $value }` për atributin `{ $attribute }`; përdoret vlera `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Versioni { $version } i DoenetML nuk u gjet.
       *[other] Versioni { $version } i DoenetML nuk u gjet. Përdoret versioni { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML i pavlefshëm: { $content }

parse-tag-missing-close-tag = DoenetML i pavlefshëm: etiketa `{ $tag }` nuk ka etiketë mbyllëse. Pritej një etiketë vetëmbyllëse ose një etiketë `</{ $tagName }>`.

parse-tag-error = DoenetML i pavlefshëm: gabim te etiketa `<{ $tagName }>`

parse-attribute-missing-value = DoenetML i pavlefshëm: atributit `{ $attribute }` duket se i mungon një vlerë.

parse-attribute-invalid = DoenetML i pavlefshëm: atribut i pavlefshëm `{ $attribute }`

parse-attribute-value-invalid = DoenetML i pavlefshëm: vlerë e pavlefshme atributi `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML i pavlefshëm: vlerë e pavlefshme atributi `{ $value }`. Thonjëzat nuk përputhen. Duket se mungon një `{ $quote }`

parse-open-tag-name-missing = DoenetML i pavlefshëm: u gjet një etiketë pa emër, si `<`

parse-tag-not-closed = DoenetML i pavlefshëm: etiketa `{ $tag }` nuk u mbyll (duket se mungon një `>`).

parse-self-closing-tag-name-missing = DoenetML i pavlefshëm: u gjet një etiketë pa emër `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML i pavlefshëm: etiketa `{ $tag }` nuk u mbyll (duket se mungon `/>`).

parse-tag-invalid-attributes = DoenetML i pavlefshëm: etiketa `{ $tag }` nuk është e vlefshme. Mund të ketë atribute të gabuara.

parse-close-tag-name-missing = DoenetML i pavlefshëm: u gjet një etiketë mbyllëse pa emër, si `</`

parse-attribute-value-unquoted = Vlerat e atributeve duhet të vihen në thonjëza: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML i pavlefshëm: u gjet etiketa mbyllëse `{ $tag }`, por nuk ka etiketë hapëse përkatëse

parse-close-tag-mismatched = DoenetML i pavlefshëm: etiketë mbyllëse e papërputhshme. Pritej `</{ $expected }>`. U gjet `{ $found }`

parser-node-unconvertible = Nyja { $node } nuk mundi të shndërrohej në nyjë Dast.

## Names

name-attribute-invalid =
    Atribut i pavlefshëm name='{ $name }'. { $reason ->
        [characters] Emrat mund të përmbajnë vetëm shkronja, shifra, nënvija ose viza.
       *[start] Emrat duhet të nisin me shkronjë.
    }

component-name-invalid-start = Emër i pavlefshëm përbërësi „{ $name }”. Emrat duhet të nisin me shkronjë.

## `<answer>` sugar

answer-video-watched-missing-video = Një answer i llojit videoWatched duhet të ketë një atribut video

answer-video-watched-video-not-reference = Te një answer i llojit videoWatched atributi video duhet të jetë referencë

answer-name-not-single-text = Atributi name i answer duhet të ketë saktësisht një fëmijë tekstual

## Referencing another document

external-doenetml-recursion-limit = DoenetML-ja e jashtme nuk mundi të merrej për shkak të tepër niveleve rekursioni. A ka ndonjë referencë rrethore?

external-doenetml-unavailable = DoenetML-ja nuk mundi të merrej nga { $attribute }="{ $uri }"

external-doenetml-type-mismatch = U mor DoenetML e pavlefshme nga { $attribute }="{ $uri }": nuk përputhej me llojin e përbërësit „{ $componentType }”

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atributi `{ $from }` është i vjetruar; përdorni `{ $to }`.
       *[other] [deprecation] Atributi `{ $from }` te `<{ $component }>` është i vjetruar; përdorni `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atributi `{ $from }` është i vjetruar dhe shpërfillet sepse është dhënë edhe `{ $to }`.
       *[other] [deprecation] Atributi `{ $from }` te `<{ $component }>` është i vjetruar dhe shpërfillet sepse është dhënë edhe `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Atributi `{ $attribute }` te `<{ $component }>` është i vjetruar dhe shpërfillet.


## Language coverage

pluralize-english-only = `<pluralize>` mund të formojë shumësin vetëm në anglisht, prandaj në një dokument në gjuhën { $locale } teksti i tij mbetet i pandryshuar. Shkruajeni vetë formën e shumësit ose jepeni me atributin `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elementi `<{ $tag }>` nuk është element i njohur i Doenet.

schema-element-not-allowed-at-root = Elementi `<{ $tag }>` nuk lejohet në rrënjën e dokumentit.

schema-element-not-allowed-inside = Elementi `<{ $tag }>` nuk lejohet brenda `<{ $parent }>`.

schema-attribute-unrecognized = Elementi `<{ $tag }>` nuk ka atribut me emrin `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atributi `{ $attribute }` i elementit `<{ $tag }>` duhet të jetë listë ku çdo njësi është një nga: { $allowed }
       *[other] Atributi `{ $attribute }` i elementit `<{ $tag }>` duhet të jetë një nga: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Emër i pavlefshëm varianti për select. Emri i variantit { $variantName } shfaqet te { $numOptions } mundësi, kurse duhen zgjedhur { $numToSelect }.

select-variant-name-without-options = Për select janë dhënë variante, por nuk është dhënë asnjë mundësi për emrin e mundshëm të variantit: { $variantName }.

select-variant-name-not-possible = Emri i variantit { $variantName } i dhënë për select nuk është emër i mundshëm varianti.

select-too-few-options = Nuk mund të zgjidhen { $numToSelect } përbërës nga vetëm { $numOptions }.

select-from-sequence-too-few-values = Nuk mund të zgjidhen { $numToSelect } vlera nga një varg me gjatësi { $length }.

select-from-sequence-indices-count-mismatch = Numri i indekseve të dhënë për select duhet të përputhet me numrin për t'u zgjedhur

select-from-sequence-indices-not-integers = Të gjithë indekset e dhënë për select duhet të jenë numra të plotë

select-from-sequence-index-excluded = Indeksi i dhënë i selectfromsequence ishte i përjashtuar

select-from-sequence-indices-excluded-combination = Indekset e dhënë të selectfromsequence formuan një ndërthurje të përjashtuar

select-from-sequence-coprime-not-positive-integers = Nuk mund të zgjidhen ndërthurje reciprokisht të thjeshta sepse nuk po zgjidhen numra të plotë pozitivë.

select-from-sequence-coprime-common-factor = Nuk mund të zgjidhen numra reciprokisht të thjeshtë. Të gjitha vlerat e mundshme kanë një pjesëtues të përbashkët. (Vlerat e dhëna të "from" ose "to" duhet të jenë reciprokisht të thjeshta me "step".)

select-from-sequence-coprime-single-number = Nuk mund të zgjidhen ndërthurje reciprokisht të thjeshta nga një numër i vetëm i ndryshëm nga 1.

select-from-sequence-excluded-too-many-combinations = Te selectFromSequence u përjashtuan mbi 70 % e ndërthurjeve

select-from-sequence-coprime-none-found = Nuk u zgjodhën dot numra reciprokisht të thjeshtë. Të gjitha vlerat e mundshme kanë një pjesëtues të përbashkët.

select-from-sequence-too-few-unique-values = Nuk mund të zgjidhen { $numToSelect } vlera të ndryshme nga një varg me gjatësi { $numPossibleValues }

select-prime-numbers-too-few-values = Nuk mund të zgjidhen { $numToSelect } vlera nga një listë numrash të thjeshtë me gjatësi { $numValues }

select-prime-numbers-values-count-mismatch = Numri i vlerave të dhëna për select duhet të përputhet me numrin për t'u zgjedhur

select-prime-numbers-values-not-prime = Të gjitha vlerat e dhëna për select prime number duhet të jenë në listën e numrave të thjeshtë

select-prime-numbers-values-excluded-combination = Vlerat e dhëna të selectPrimeNumbers formuan një ndërthurje të përjashtuar

select-prime-numbers-excluded-too-many-combinations = Te selectPrimeNumbers u përjashtuan mbi 70 % e ndërthurjeve

select-random-combination-fluke = Nga një rastësi jashtëzakonisht e pagjasë, nuk u zgjodh dot një ndërthurje vlerash të rastit

select-random-value-fluke = Nga një rastësi jashtëzakonisht e pagjasë, nuk u zgjodh dot një vlerë e rastit
