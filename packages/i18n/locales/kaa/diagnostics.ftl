# Karakalpak diagnostics. Translated from `locales/en/diagnostics.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the current Karakalpak Latin alphabet, consistently with the other
# three files of this locale; see `locales/kaa/content.ftl` for the choice.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# The technical nouns are the Russian ones as Karakalpak writes them —
# `komponent`, `atribut`, `funkciya`, `indeks`, `massiv`, `matrica`,
# `parametr`, `format`, `versiya`, `rekursiya` — because that is what the
# language actually uses for them.
#
# Karakalpak puts its verb last and its modifiers in front of what they modify,
# so most of these sentences are reordered rather than substituted into an
# English frame. Every count selection is a single `*[other]`: Karakalpak does
# not mark number after a numeral, and `Intl.PluralRules` has no data for `kaa`
# to select a `[one]` branch with.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
       *[other] eki ushı kórsetilgende { $attributes } itibarǵa alınbaydı
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
       *[other] bir ushı hám ortası birge kórsetilgende { $attributes } itibarǵa alınbaydı
    }

line-segment-midpoint-offset-without-midpoint = ortası kórsetilmese midpointOffset hesh nársege tásir etpeydi

## `<line>`

line-points-undetermined-dimensions = Ólshemi anıqlanbaǵan noqatlar arqalı ótetuǵın tuwrı sızıq.

line-points-too-few-dimensions = Tuwrı sızıq keminde eki ólshemli noqatlar arqalı ótiwi kerek.

line-points-depend-on-variables = Tuwrı sızıq ózgeriwshilerge baylanıslı noqatlar arqalı ótedi: { $variables }.

line-equation-invalid-format = { $variable1 } hám { $variable2 } ózgeriwshileri menen jazılǵan tuwrı sızıq teńlemesiniń formatı nadurıs.

## `<ray>`

ray-overprescribed-through = Nur through, endpoint hám direction arqalı berilgen. Kórsetilgen through itibarǵa alınbaydı.

ray-dimension-mismatch = nurda numDimensions sáykes kelmeydi.

## `<vector>`

vector-overprescribed-head = Vektor head, tail hám displacement arqalı berilgen. Kórsetilgen head itibarǵa alınbaydı.

vector-dimension-mismatch = vektorda numDimensions sáykes kelmeydi.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` elementine tartıw múmkin emes, sebebi onıń nearestPoint jaǵday ózgeriwshisi joq.

constrain-to-without-nearest-point = `<{ $component }>` elementi menen shekleu múmkin emes, sebebi onıń nearestPoint jaǵday ózgeriwshisi joq.

constrain-to-interior-without-nearest-point = `<{ $component }>` elementiniń ishi menen shekleu múmkin emes, sebebi onıń nearestPoint jaǵday ózgeriwshisi joq.

## `<choiceInput>`

choice-input-label-position-ignored = inline emes choiceInput ushın labelPosition itibarǵa alınbaydı

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput ushın kórsetilgen indeksler itibarǵa alınbaydı, sebebi indeksler sanı saylaw balaları sanına sáykes kelmeydi.

pretzel-indices-count-mismatch = problem ushın kórsetilgen indeksler itibarǵa alınbaydı, sebebi indeksler sanı problem balaları sanına sáykes kelmeydi.

shuffle-indices-count-mismatch = shuffle ushın kórsetilgen indeksler itibarǵa alınbaydı, sebebi indeksler sanı komponentler sanına sáykes kelmeydi.

indices-ignored-out-of-range = { $component } ushın kórsetilgen indeksler itibarǵa alınbaydı, sebebi geybir indeksler shegaradan tısqarı.

pretzel-indices-repeated = pretzel ushın kórsetilgen indeksler itibarǵa alınbaydı, sebebi geybir indeksler qaytalanadı.

pretzel-circuit-first-index = circuit rejimindegi pretzel ushın kórsetilgen indeksler itibarǵa alınbaydı, sebebi birinshi indeks 1 bolıwı kerek.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` qatar balaları menen islewi ushın `type` atributı kórsetiliwi kerek.

invalid-type-defaulting-to-math = { $component } komponenti ushın { $type } túri nadurıs. Ol math, text, number yamasa boolean bolıwı kerek. math alınadı.

string-not-valid-component-to-arrange = "{ $value }" qatarı { $component } ushın jaramlı komponent emes. Itibarǵa alınbaydı.

## Types and variables

invalid-type-defaulting-to-number = { $type } túri nadurıs, túr number etip qoyıladı.

invalid-variable-value = Ózgeriwshiniń mánisi nadurıs: `{ $value }`

## Variants

variant-index-must-be-number = { $index } variant indeksi san bolıwı kerek

variant-index-must-be-integer = { $index } variant indeksi pútin san bolıwı kerek

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` absolyut ólshemler ushın iske asırılmaǵan. Keńlikler salıstırmalı etip qoyıladı.

side-by-side-absolute-margins = `<{ $component }>` absolyut ólshemler ushın iske asırılmaǵan. Shetler salıstırmalı etip qoyıladı.

side-by-side-no-block-child = Nadurıs `<{ $component }>`: onıń keminde bir blok balası bolıwı kerek.

## `<label>`

label-for-ignored-on-graphical = Grafikalıq `<label>` ústindegi `for` atributı itibarǵa alınbaydı.

label-for-must-resolve-to-one = `<label>` ústindegi `for` atributı tek bir komponentke sáykes keliwi kerek.

label-for-unresolved = `<label>` ústindegi `for` atributın komponentke sáykeslendiriw múmkin bolmadı.

label-for-answer-with-authored-inputs = `<label>` ústindegi `for` atributı avtor ózi jazǵan kirgiziwleri bar `<answer>` ge silteydi; kirgiziwdiń ózine silteń.

label-for-answer-without-input = `<label>` ústindegi `for` atributı belgilewge kirgiziwi joq `<answer>` ge silteydi.

label-for-must-reference-input-or-answer = `<label>` ústindegi `for` atributı kirgiziwge yamasa juwapqa silteui kerek.

## Accessibility

accessibility-short-description-or-decorative = Qolaylıq ushın `<{ $component }>` yaki qısqa túsindirmege iye bolıwı, yaki bezew ushın dep kórsetiliwi kerek.

accessibility-video-short-description = Qolaylıq ushın `<video>` qısqa túsindirmege iye bolıwı kerek.

accessibility-input-short-description-or-label = Qolaylıq ushın `<{ $component }>` qısqa túsindirmege yamasa belgige iye bolıwı kerek.

accessibility-answer-input-short-description-or-label = Qolaylıq ushın kirgiziw jaratatuǵın `<answer>` qısqa túsindirmege yamasa belgige iye bolıwı kerek.

accessibility-short-description-contains-math = Qısqa túsindirmelerde `<{ $component }>` sıyaqlı matematikalıq komponentler bolmawı kerek. Matematikanı sózler menen jazıń.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } bólim atamasınıń tekstine jetkilikli kontrast bermeydi (qarańǵı rejim) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; keminde { $threshold }:1 talap etiledi).
       *[other] { $colorName } bólim atamasınıń tekstine jetkilikli kontrast bermeydi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; keminde { $threshold }:1 talap etiledi).
    }

## `<circle>`

circle-through-points-non-numerical = Noqatlardıń sanlı mánisi joq jaǵdayda { $count } noqat arqalı ótetuǵın `<circle>` iske asırılmaǵan.

circle-too-many-through-points = 3 tan kóp noqat arqalı ótetuǵın sheńberdi esaplaw múmkin emes.

circle-overprescribed-radius-center-points = Radiusı, orayı hám ótetuǵın noqatları birge kórsetilgen sheńberdi esaplaw múmkin emes.

circle-center-with-multiple-points = Orayı kórsetilgen sheńberdi 1 den kóp noqat arqalı esaplaw múmkin emes.

circle-radius-too-small = Sheńberdi esaplaw múmkin emes: eki noqat arasındaǵı aralıq { $distance } bolǵanda, kórsetilgen { $radius } radiusı júdá kishi.

circle-radius-with-many-points = Radiusı kórsetilgen sheńberdi eki den kóp noqat arqalı jaratıw múmkin emes.

circle-invalid-center-or-through-points = Sheńberdiń orayı yamasa ótetuǵın noqatları nadurıs.

circle-radius-center-with-multiple-points = Orayı kórsetilgen sheńberdiń radiusın 1 den kóp noqat arqalı esaplaw múmkin emes.

circle-change-radius-non-numerical = Sanlı emes noqatlar arqalı ótetuǵın sheńberdiń radiusın ózgertiw múmkin emes

circle-radius-with-points-non-numerical = Sanlı mánisler joq bolǵanda radiusı kórsetilgen sheńberdi bir den kóp noqat arqalı jaratıw múmkin emes.

circle-change-center-non-numerical = Sanlı emes noqatlar arqalı ótetuǵın sheńberdiń orayın ózgertiw iske asırılmaǵan.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
       *[other] Funkciyanıń anıqlanıw oblastınıń ólshemleri jetkiliksiz. Oblastta { $intervals } aralıq bar, al funkciyanıń { $inputs ->
           *[other] { $inputs } kirisi
        } bar.
    }

function-domain-invalid-format = Funkciyanıń anıqlanıw oblastınıń formatı nadurıs.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Funkciyanıń sanlı emes maksimumı itibarǵa alınbaydı.
        [minimum] Funkciyanıń sanlı emes minimumı itibarǵa alınbaydı.
        [extremum] Funkciyanıń sanlı emes ekstremumı itibarǵa alınbaydı.
        [point] Funkciyanıń sanlı emes noqatı itibarǵa alınbaydı.
        [slope] Funkciyanıń sanlı emes múyeshlik koefficienti itibarǵa alınbaydı.
       *[other] Funkciyanıń sanlı emes { $type } mánisi itibarǵa alınbaydı.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Funkciyanıń bos maksimumı itibarǵa alınbaydı.
        [minimum] Funkciyanıń bos minimumı itibarǵa alınbaydı.
        [extremum] Funkciyanıń bos ekstremumı itibarǵa alınbaydı.
        [point] Funkciyanıń bos noqatı itibarǵa alınbaydı.
       *[other] Funkciyanıń bos { $type } mánisi itibarǵa alınbaydı.
    }

function-points-too-close = Funkciyada ornı bir-birine júdá jaqın eki noqat bar. Funkciyanı anıqlaw múmkin emes.

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] Funkciya iteraciyaları tek kirisler sanı shıǵıslar sanına teń bolǵanda ǵana múmkin. Bul funkciyada { $inputs } kiris hám { $outputs ->
           *[other] { $outputs } shıǵıs
        } bar.
    }

## `<sequence>`

sequence-invalid-length = Izbe-izliktiń uzınlıǵı nadurıs. Ol teris emes pútin san bolıwı kerek.

sequence-invalid-step = Izbe-izliktiń qádemi nadurıs. { $type } túrindegi izbe-izlik ushın ol san bolıwı kerek.

sequence-invalid-endpoint-number = San izbe-izligindegi "{ $attribute }" nadurıs. Ol san bolıwı kerek.

sequence-invalid-endpoint-letters = Háribler izbe-izligindegi "{ $attribute }" nadurıs. Ol hárib dizbegi bolıwı kerek.

sequence-invalid-endpoint = Izbe-izliktegi "{ $attribute }" nadurıs.

select-from-sequence-coprime-not-numbers = san saylanbaǵanlıqtan coprime itibarǵa alınbaydı

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations kórsetilgenlikten coprime itibarǵa alınbaydı

## Resolving a `target`

target-not-found = `<{ $source }>` ushın target nadurıs: nısan tabılmadı.

target-state-variable-not-found = `<{ $source }>` ushın target nadurıs: `<{ $component }>` de "{ $property }" atlı jaǵday ózgeriwshisi tabılmadı.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` niń ózgeriwshileri ǵárezsiz ózgeriwshiden basqa bolıwı kerek.

ode-system-duplicate-variable-names = Ǵárezli ózgeriwshi atları qaytalanǵan ODE RHS funkciyaların anıqlaw múmkin emes.

ode-system-rhs-function-error = ODE RHS funkciyasın anıqlaw múmkin emes. mathjs funkciyasın jaratıwda qátelik.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } tuwrı sızıq arasındaǵı múyeshti anıqlaw múmkin emes

angle-invalid-through-point = `<angle>` niń through ındaǵı noqat nadurıs

parabola-vertex-too-many-points = Tóbesi berilgen parabolanı 1 den kóp noqat arqalı ótkeriw iske asırılmaǵan.

parabola-too-many-points = Parabolanı 3 ten kóp noqat arqalı ótkeriw iske asırılmaǵan.

intersection-too-many-items = Ekiden kóp obekttiń kesilisiwi iske asırılmaǵan

## Other math components

ionic-compound-not-two-ions = Eki ionnan basqa ion birikpesi iske asırılmaǵan.

ionic-compound-needs-cation-and-anion = Ion birikpesi tek bir kation hám bir anion ushın iske asırılǵan.

solve-equations-cannot-evaluate = Teńlemeni sheshiw múmkin emes, sebebi onı esaplaw múmkin bolmadı: { $equation }

math-operators-operand-number-required = Matematikalıq operandtı alǵanda operandNumber kórsetiliwi kerek.

eigen-decomposition-failed = Matricanıń menshikli mánislerin esaplaw múmkin bolmadı

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
       *[other] `<matchesPattern>`: { $parameters } parametrleri úlgide ushıraspaydı, sonlıqtan olar hámishe bos orınǵa sáykes keledi.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" túsinikli emes. Ol none, medium, dense yamasa bos orın menen ajıratılǵan eki oń san bolıwı kerek, mısalı grid="1 0.5". Tor sızılmaydı.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` ushın { $expected ->
        [1] hár noqattaǵı y' múyeshlik koefficientin beretuǵın bir shıǵıslı, mısalı `y - x` sıyaqlı
       *[other] hár noqattaǵı vektordı beretuǵın eki shıǵıslı, mısalı `(y, -x)` sıyaqlı
    } funkciya kerek, biraq berilgen funkciyada { $found ->
       *[other] { $found } shıǵıs
    } bar. { $alternative ->
        [none] Hesh nárse sızılmaydı.
       *[other] Bul funkciya ushın `<{ $alternative }>` komponenti tuwrı keledi. Hesh nárse sızılmaydı.
    }

field-function-attribute-ignored-with-child = `function` atributı itibarǵa alınbaydı, sebebi funkciya komponenttiń ishinde de berilgen; ishindegisi paydalanıladı. Funkciyanı tek bir jol menen beriń.

field-variables-ignored =
    `<{ $component }>`: `variables` atributı komponenttiń ishinde tikkeley jazılǵan ańlatpanıń ózgeriwshilerin ataydı. { $reason ->
        [function-child] Bul jerdegi funkciya `<function>` balası retinde berilgen hám ol óz ózgeriwshilerin ózi ataydı, sonlıqtan `variables` itibarǵa alınbaydı.
       *[no-expression] Bul jerde bunday ańlatpa berilmegen, sonlıqtan `variables` itibarǵa alınbaydı.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure kórsetiwshisinde xLabelPosition="left" qollap-quwatlanbaydı; oń tárep ushın ámel etiletuǵın minez paydalanıladı.

prefigure-y-label-position-unsupported = `<graph>`: prefigure kórsetiwshisinde yLabelPosition="bottom" qollap-quwatlanbaydı; joqarǵı tárep ushın ámel etiletuǵın minez paydalanıladı.

prefigure-invalid-axis-bounds = `<graph>`: prefigure ge aylandırıw ushın kósherler shegarası nadurıs; sáykes bbox (-10,-10,10,10) paydalanıladı.

prefigure-invalid-width = `<graph>`: prefigure ge aylandırıw ushın keńlik nadurıs; sáykes diagramma keńligi 425 paydalanıladı.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure ge aylandırıw ushın aspectRatio nadurıs; sáykes 1 qatnası paydalanıladı.

prefigure-grid-spacing-too-fine = `<graph>`: tor qádemi kósher shegaraları ushın júdá mayda; prefigure kórsetiwshisinde tor sızılmaydı.

prefigure-annotations-not-rendered = `<graph>`: PreFigure kórsetiwshisi paydalanılmasa annotaciyalar sızılmaydı.

multiple-annotations-children = `<graph>` ishinde bir neshe `<annotations>` balası tabıldı; aqırǵısınan basqasınıń hámmesi itibarǵa alınbaydı.

## Referring to other components

copy-unrecognized-component-type = Tanılmaǵan komponent túrin keńeytiw yamasa kóshiriw múmkin emes: { $type }.

copy-prop-not-found = { $component } túrindegi komponentte { $property } props tabılmadı

collect-no-source = collect ushın derek tabılmadı.

collect-invalid-component-type = `<{ $component }>` túrindegi komponentlerdi jıynaw múmkin emes, sebebi bul jaramsız komponent túri.

reference-index-unavailable = `{ $reference }` indeksine silteu múmkin emes

## `<callAction>`

component-action-unavailable = `{ $reference }` komponentinde { $action } shaqırıw múmkin emes

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Maǵlıwmatlardıń formatı nadurıs. Qatarlardıń uzınlıǵı hár túrli. Tabılǵan jeri componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Maǵlıwmatlarda qaytalanǵan baǵana atları bar. Tabılǵan jeri componentIdx :{ $componentIdx }

data-frame-missing-column-name = Maǵlıwmatlarda baǵana atı jetispeydi. Tabılǵan jeri componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Bul juwaptıń bahalawı juwap tegıniń ózi jibergen juwapqa tiykarlanǵan, bul kútilmegen minezge alıp keledi.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` bar konteynerdiń ishindegi `<answer>` ge `maxNumAttempts` qoyıw hesh nársege tásir etpeydi, sebebi urınıslar sanın konteyner basqaradı. `maxNumAttempts` tı konteynerdiń ózine qoyıń.

nested-section-wide-check-work-max-num-attempts = Basqa `sectionWideCheckWork` konteyneriniń ishinde turǵan `sectionWideCheckWork` konteynerine `maxNumAttempts` qoyıw hesh nársege tásir etpeydi, sebebi urınıslar sanın sırtqı konteyner basqaradı. `maxNumAttempts` tı sırtqı konteynerge qoyıń.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
       *[other] symbolicEquality qoyılmasa { $attributes } atributları hesh nársege tásir etpeydi.
    }

answer-invalid-type = Juwap ushın túr nadurıs: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` komponentiniń atı bolmaǵanlıqtan, onı modul atributı retinde paydalanıw múmkin emes

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` komponentin modul ushın atribut retinde paydalanıw múmkin emes, sebebi `<module>` komponent túrinde "{ $name }" atributı áliyette anıqlanǵan.

conditional-content-condition-ignored = case yamasa else balaları bar `<conditionalContent>` komponentinde `condition` atributı itibarǵa alınbaydı.

slider-markers-type-mismatch = Markerler túri slider túrine sáykes kelmeydi.

pretzel-problem-needs-statement-and-answer = Nadurıs pretzel: hár `<problem>` bir `<statement>` hám bir `<answer>` di óz ishine alıwı kerek.

pretzel-circuit-first-problem-distractor = Nadurıs pretzel: mode="circuit" da birinshi `<problem>` distraktor bola almaydı.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
       *[other] `{ $attribute }` atributı ushın { $values } mánisleri nadurıs; itibarǵa alınbaydı.
    }

attribute-must-be-references = `{ $attribute }` atributı ushın `{ $value }` mánisi nadurıs. Atribut `$` penen baslanatuǵın siltemelerden turıwı kerek.

math-input-invalid-function-names = <mathInput>: { $attribute } dagı jaramsız funkciya atları itibarǵa alınbadı: { $names }. Hár attıń kórinetuǵın bólegi keminde 2 belgiden (hárib yamasa sızıqsha) turıwı kerek; onnan keyin qálegende `|<mathspeak alternative>` jalǵawı kelisi múmkin.

## Building components from the source

component-type-invalid = Komponent túri nadurıs: `<{ $componentType }>`

attribute-repeated = { $attribute } atributın qaytalaw múmkin emes.

attribute-invalid-for-component = `<{ $componentType }>` túrindegi komponent ushın "{ $attribute }" atributı nadurıs.

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } stil anıqlaması { $context ->
        [text-on-background] tekst reńi menen fon reńi arasında
        [high-contrast] joqarı kontrastlı reń menen kanvas arasında
        [line] sızıq reńi menen kanvas arasında
        [marker] marker reńi menen kanvas arasında
       *[text-on-canvas] tekst reńi menen kanvas arasında
    } jetkilikli kontrast bermeydi{ $mode ->
        [dark] { " (qarańǵı rejim)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; keminde { $threshold }:1 talap etiledi).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } stil anıqlamasında kórsetilgen reńler jaqtı rejim ushın jetkilikli kontrast berse de, olardan alınǵan qarańǵı rejim reńleri tekst reńi menen fon reńi arasında jetkilikli kontrast bermeydi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; keminde { $threshold }:1 talap etiledi). { $suggestion ->
        [available] Qarańǵı rejimde jetkilikli kontrast bolıwı ushın yaki jaqtı rejim kontrastın asırıń (mısalı { $lightAttribute }="{ $lightColor }" qoyıń), yaki qarańǵı rejim reńin ózińiz beriń (mısalı { $darkAttribute }="{ $darkColor }" qoyıń).
       *[none] Qarańǵı rejimde jetkilikli kontrast bolıwı ushın jaqtı rejim kontrastın asırıń yamasa alınǵan reńlerdi textColorDarkMode hám/yamasa backgroundColorDarkMode arqalı ózińiz beriń.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } stil anıqlamasında kórsetilgen tekst reńi jaqtı rejim ushın jetkilikli kontrast berse de, odan alınǵan qarańǵı rejim tekst reńi kanvasqa qaraǵanda jetkilikli kontrast bermeydi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; keminde { $threshold }:1 talap etiledi). { $suggestion ->
        [available] Qarańǵı rejimde jetkilikli kontrast bolıwı ushın yaki jaqtı rejim kontrastın asırıń (mısalı textColor="{ $lightColor }" qoyıń), yaki qarańǵı rejim reńin ózińiz beriń (mısalı textColorDarkMode="{ $darkColor }" qoyıń).
       *[none] Qarańǵı rejimde jetkilikli kontrast bolıwı ushın jaqtı rejim kontrastın asırıń yamasa alınǵan reńdi textColorDarkMode arqalı ózińiz beriń.
    }

section-multiple-style-palettes = Bir bólim tek bir <stylePalette> ti saylay aladı; aqırǵısı paydalanıladı.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } niń birden-bir variantların anıqlaw múmkin emes, sebebi numToSelect teris emes pútin san emes.

variant-num-to-select-not-constant-number = { $component } niń birden-bir variantların anıqlaw múmkin emes, sebebi numToSelect turaqlı san emes.

variant-with-replacement-not-constant-boolean = { $component } niń birden-bir variantların anıqlaw múmkin emes, sebebi withReplacement turaqlı boolean emes.

variant-select-weight-disables-unique = selectWeight yamasa selectForVariants kórsetilgen variantı bar bolsa, select ushın birden-bir variantlar óshiriledi

variant-coprime-undetermined = { $component } niń birden-bir variantların anıqlaw múmkin emes, sebebi coprime hámishe false ekenin anıqlaw múmkin emes.

variant-attribute-not-constant = { $component } niń birden-bir variantların anıqlaw múmkin emes, sebebi { $attribute } turaqlı emes.

variant-attribute-not-number = { $component } niń birden-bir variantların anıqlaw múmkin emes, sebebi { $attribute } san emes.

variant-attribute-wrong-type-for-sequence =
    { $type } túrindegi { $component } niń birden-bir variantların anıqlaw múmkin emes, sebebi { $attribute } { $expected ->
        [letters-combination] hárib dizbegi
        [math-expression] jaramlı matematikalıq ańlatpa
        [integer] pútin san
       *[number] san
    } emes.

variant-length-not-integer = { $component } niń birden-bir variantların anıqlaw múmkin emes, sebebi length pútin san emes.

variant-sort-not-implemented = sort bar { $component } niń birden-bir variantları iske asırılmaǵan

variant-exclude-combinations-not-implemented = excludeCombinations bar { $component } niń birden-bir variantları iske asırılmaǵan

variant-math-exclude-not-implemented = exclude bar math túrindegi { $component } niń birden-bir variantları iske asırılmaǵan

variant-non-constant-exclude-not-implemented = turaqlı emes exclude bar { $component } niń birden-bir variantları iske asırılmaǵan

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure kórsetiwshisinde qollap-quwatlanbaydı; urpaq atlanıp ótildi.

prefigure-descendant-invalid-geometry = { $subject }: shekli emes yamasa tolıq emes geometriya; urpaq atlanıp ótildi.

prefigure-curve-label-omitted = { $subject }: aylandırılǵan iymek elementlerinde belgiler qollap-quwatlanbaydı; belgi túsirilip qaldırıldı.

prefigure-curve-unsupported-definition-type = { $subject }: iymek funkciyasınıń '{ $definitionType }' anıqlaw túri qollap-quwatlanbaydı; urpaq atlanıp ótildi.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves dagı flipFunctions atributı qollap-quwatlanbaydı; urpaq atlanıp ótildi.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves tek formula túrindegi bala funkciyalardı qollap-quwatlaydı; urpaq atlanıp ótildi.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] sızıq shańaraǵınıń belgisi
       *[point] noqat belgisi
    } ushın '{ $labelPosition }' labelPosition qollap-quwatlanbaydı; PreFigure niń ádettegi teńlestiriwi paydalanıladı.

prefigure-fill-style-unsupported = { $subject }: '{ $fillStyle }' boyaw stilin PreFigure qollap-quwatlamaydı; tolıq boyaw menen almastırıladı.

prefigure-line-style-unknown = { $subject }: belgisiz '{ $lineStyle }' sızıq stili PreFigure shıǵısınan túsirilip qaldırıldı.

prefigure-marker-style-mapped-to-diamond = { $subject }: '{ $markerStyle }' marker stili PreFigure niń 'diamond' stiline sáykeslendirildi.

prefigure-marker-style-unsupported = { $subject }: '{ $markerStyle }' marker stilin PreFigure qollap-quwatlamaydı; ádettegi stil paydalanıladı.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` nadurıs; nısandı tabıw múmkin emes. Annotaciya túsirilip qaldırıldı.

annotation-ref-multiple-targets = `<annotation>`: `ref` bir neshe nısanǵa sáykes keldi; birinshisi paydalanıladı.

annotation-ref-outside-graph = `<annotation>`: `ref` nadurıs; nısan óz grafiginiń sırtında. Annotaciya túsirilip qaldırıldı.

annotation-ref-unsupported-target = `<annotation>`: `ref` nadurıs; nısan prefigure ge aylandırıwda qollap-quwatlanatuǵın grafikalıq obekt emes. Annotaciya túsirilip qaldırıldı.

annotation-text-missing = `<annotation>`: `text` joq yamasa bos; bos tekst shıǵarıladı.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Sheńberli ǵárezlilik tabıldı.
       *[other] `<{ $componentType }>` komponentine baylanıslı sheńberli ǵárezlilik tabıldı.
    }

reference-no-referent = Siltemege obekt tabılmadı: `{ $reference }`

reference-multiple-referents = Siltemege bir neshe obekt tabıldı: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` niń { $attribute } atributınıń formatı nadurıs.

children-invalid = `<{ $componentType }>` ushın balaları nadurıs: jaramsız balalar tabıldı: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` atributı ushın `{ $value }` mánisi nadurıs, `{ $default }` mánisi paydalanıladı

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } versiyası tabılmadı.
       *[other] DoenetML { $version } versiyası tabılmadı. { $fallback } versiyasına qaytıladı
    }

## Reading the DoenetML

parse-invalid-doenetml = Nadurıs DoenetML: { $content }

parse-tag-missing-close-tag = Nadurıs DoenetML: `{ $tag }` tegıniń jabıwshı tegı joq. Ózi jabılatuǵın teg yamasa `</{ $tagName }>` tegı kútilgen edi.

parse-tag-error = Nadurıs DoenetML: `<{ $tagName }>` tegında qátelik

parse-attribute-missing-value = Nadurıs DoenetML: `{ $attribute }` atributınıń mánisi jetispeytuǵın kórinedi.

parse-attribute-invalid = Nadurıs DoenetML: `{ $attribute }` atributı nadurıs

parse-attribute-value-invalid = Nadurıs DoenetML: `{ $value }` atribut mánisi nadurıs

parse-attribute-value-quote-mismatch = Nadurıs DoenetML: `{ $value }` atribut mánisi nadurıs. Tırnaqshalar sáykes kelmeydi. `{ $quote }` jetispeytuǵın kórinedi

parse-open-tag-name-missing = Nadurıs DoenetML: Atı joq teg tabıldı, mısalı `<`

parse-tag-not-closed = Nadurıs DoenetML: `{ $tag }` tegı jabılmaǵan (`>` jetispeytuǵın kórinedi).

parse-self-closing-tag-name-missing = Nadurıs DoenetML: Atı joq teg tabıldı `<{ $content }>`

parse-self-closing-tag-not-closed = Nadurıs DoenetML: `{ $tag }` tegı jabılmaǵan (`/>` jetispeytuǵın kórinedi).

parse-tag-invalid-attributes = Nadurıs DoenetML: `{ $tag }` tegı jaramsız. Onıń atributları qáte bolıwı múmkin.

parse-close-tag-name-missing = Nadurıs DoenetML: Atı joq jabıwshı teg tabıldı, mısalı `</`

parse-attribute-value-unquoted = Atribut mánisleri tırnaqshaǵa alınıwı kerek: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Nadurıs DoenetML: `{ $tag }` jabıwshı tegı tabıldı, biraq oǵan sáykes ashıwshı teg joq

parse-close-tag-mismatched = Nadurıs DoenetML: Jabıwshı teg sáykes kelmeydi. `</{ $expected }>` kútilgen edi. `{ $found }` tabıldı

parser-node-unconvertible = { $node } túyinin Dast túyinine aylandırıw múmkin bolmadı.

## Names

name-attribute-invalid =
    name='{ $name }' atributı nadurıs. { $reason ->
        [characters] Atlarda tek háribler, sanlar, astıńǵı sızıq yamasa sızıqsha bolıwı múmkin.
       *[start] Atlar hárip penen baslanıwı kerek.
    }

component-name-invalid-start = "{ $name }" komponent atı nadurıs. Atlar hárip penen baslanıwı kerek.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched túrindegi juwaptıń video atributı bolıwı kerek

answer-video-watched-video-not-reference = videoWatched túrindegi juwaptıń video atributı silteme bolıwı kerek

answer-name-not-single-text = Juwaptıń name atributınıń tek bir tekst balası bolıwı kerek

## Referencing another document

external-doenetml-recursion-limit = Rekursiya dárejesi júdá kóp bolǵanlıqtan sırtqı DoenetML di alıw múmkin emes. Sheńberli silteme bar ma?

external-doenetml-unavailable = { $attribute }="{ $uri }" den DoenetML di alıw múmkin emes

external-doenetml-type-mismatch = { $attribute }="{ $uri }" den alınǵan DoenetML nadurıs: ol "{ $componentType }" komponent túrine sáykes kelmedi

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` atributı eskirgen; onıń ornına `{ $to }` paydalanıń.
       *[other] [deprecation] `<{ $component }>` dagı `{ $from }` atributı eskirgen; onıń ornına `{ $to }` paydalanıń.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` atributı eskirgen hám `{ $to }` da kórsetilgenlikten itibarǵa alınbaydı.
       *[other] [deprecation] `<{ $component }>` dagı `{ $from }` atributı eskirgen hám `{ $to }` da kórsetilgenlikten itibarǵa alınbaydı.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` dagı `{ $attribute }` atributı eskirgen hám itibarǵa alınbaydı.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` dagı `{ $attribute }` atributı eskirgen; onıń ornına `<{ $child }>` balasın paydalanıń.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` dagı `{ $attribute }` atributınıń `{ $value }` mánisi eskirgen; onıń ornına `{ $to }` paydalanıń.


## Language coverage

pluralize-english-only = `<pluralize>` tek inglis tilindegi sózdi kóplikke aylandıra aladı, sonlıqtan { $locale } tilinde jazılǵan hújjette onıń teksti ózgermey qaladı. Kóplik formasın tikkeley jazıń yamasa onı `pluralForm` atributı arqalı beriń.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` elementi Doenet tanıytuǵın element emes.

schema-element-not-allowed-at-root = `<{ $tag }>` elementine hújjettiń tamırında ruqsat etilmeydi.

schema-element-not-allowed-inside = `<{ $tag }>` elementine `<{ $parent }>` ishinde ruqsat etilmeydi.

schema-attribute-unrecognized = `<{ $tag }>` elementiniń `{ $attribute }` atlı atributı joq.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` elementiniń `{ $attribute }` atributı hár aǵzası tómendegilerdiń biri bolǵan dizim bolıwı kerek: { $allowed }
       *[other] `<{ $tag }>` elementiniń `{ $attribute }` atributı tómendegilerdiń biri bolıwı kerek: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select ushın variant atı nadurıs. { $variantName } variant atı { $numOptions } variantta ushırasadı, al saylanatuǵın san { $numToSelect }.

select-variant-name-without-options = select ushın geybir variantlar kórsetilgen, biraq múmkin bolǵan { $variantName } variant atı ushın hesh qanday variant kórsetilmegen.

select-variant-name-not-possible = select ushın kórsetilgen { $variantName } variant atı múmkin bolǵan variant atı emes.

select-too-few-options = Bar bolǵan { $numOptions } komponentten { $numToSelect } in saylaw múmkin emes.

select-from-sequence-too-few-values = Uzınlıǵı { $length } bolǵan izbe-izlikten { $numToSelect } mánis saylaw múmkin emes.

select-from-sequence-indices-count-mismatch = select ushın kórsetilgen indeksler sanı saylanatuǵın sanǵa sáykes keliwi kerek

select-from-sequence-indices-not-integers = select ushın kórsetilgen barlıq indeksler pútin san bolıwı kerek

select-from-sequence-index-excluded = selectfromsequence ushın shıǵarıp taslanǵan indeks kórsetilgen

select-from-sequence-indices-excluded-combination = selectfromsequence ushın shıǵarıp taslanǵan dizbek kórsetilgen

select-from-sequence-coprime-not-positive-integers = Oń pútin sanlar saylanbaǵanlıqtan óz-ara ápiwayı dizbeklerdi saylaw múmkin emes.

select-from-sequence-coprime-common-factor = Óz-ara ápiwayı sanlardı saylaw múmkin emes. Barlıq múmkin mánislerdiń ortaq bóliwshisi bar. ("from" yamasa "to" nıń kórsetilgen mánisleri "step" penen óz-ara ápiwayı bolıwı kerek.)

select-from-sequence-coprime-single-number = 1 den basqa jalǵız sannan óz-ara ápiwayı dizbeklerdi saylaw múmkin emes.

select-from-sequence-excluded-too-many-combinations = selectFromSequence te dizbeklerdiń 70% nan kóbi shıǵarıp taslanǵan

select-from-sequence-coprime-none-found = Óz-ara ápiwayı sanlardı saylaw múmkin bolmadı. Barlıq múmkin mánislerdiń ortaq bóliwshisi bar.

select-from-sequence-too-few-unique-values = Uzınlıǵı { $numPossibleValues } bolǵan izbe-izlikten { $numToSelect } birden-bir mánis saylaw múmkin emes

select-prime-numbers-too-few-values = Uzınlıǵı { $numValues } bolǵan ápiwayı sanlar dizimınen { $numToSelect } mánis saylaw múmkin emes

select-prime-numbers-values-count-mismatch = select ushın kórsetilgen mánisler sanı saylanatuǵın sanǵa sáykes keliwi kerek

select-prime-numbers-values-not-prime = select prime number ushın kórsetilgen barlıq mánisler ápiwayı sanlar dizimınde bolıwı kerek

select-prime-numbers-values-excluded-combination = selectPrimeNumbers ushın kórsetilgen mánisler shıǵarıp taslanǵan dizbek boldı

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers te dizbeklerdiń 70% nan kóbi shıǵarıp taslanǵan

select-random-combination-fluke = Júdá kem ushırasatuǵın tosınnan jaǵday sebepli tosınnan mánisler dizbegin saylaw múmkin bolmadı

select-random-value-fluke = Júdá kem ushırasatuǵın tosınnan jaǵday sebepli tosınnan mánisti saylaw múmkin bolmadı

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` matematikanıń ishinde sızılmaydı; ańlatpa kirgiziwler ishke jaylastırılmaǵan waqıttaǵıday teriledi. { $reason ->
        [not-inline] Ańlatpanıń ishine tek `inline` saylaw kirgiziwi sıyadı; `inline` bolmasa ol tuymeler blogı boladı.
        [expanded] `expanded` tekst kirgiziwi kóp qatarlı qutı, ol ańlatpanıń ishinde turıw ushın júdá úlken.
        [on-graph] Grafikte ańlatpa bir pútin súwret retinde sızıladı, onda basqarıw elementine orın joq.
       *[relative-width] Onıń `width` i salıstırmalı (procent yamasa `em`), al ańlatpanıń ishinde onı salıstıratuǵın hesh nárse joq. Keńlikti `px` sıyaqlı absolyut birlikte beriń.
    }
