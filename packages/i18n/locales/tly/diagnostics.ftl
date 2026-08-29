# Talysh diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the **Latin** orthography Talysh publishing in Azerbaijan uses —
# the Azerbaijani alphabet, with ə, ı, ö, ü, ğ, ş and ç — which is what CLDR
# fills the bare tag in as: `tly` maximizes to `tly-Latn-AZ`. Talysh is also
# written in Cyrillic, and in Iran in the Perso-Arabic script; a reader
# arriving under `tly-Cyrl` or `tly-Arab` reaches this catalog and gets Latin,
# and the answer to that is a second catalog beside this one rather than a
# rename of it.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# Talysh counts in two plural categories, `one` and `other`, and a noun after
# a numeral stays singular, so the two branches of every selection below read
# alike. Nothing here agrees with a gender or a noun class: Talysh has neither,
# which is the whole of the agreement story for this locale.
#
# The technical vocabulary leans on Azerbaijani, as written Talysh in
# Azerbaijan does: «komponent», «atribut», «indeks», «funksiya», «dəyişən».
# The words this seed had to choose rather than find — «xəto» for error,
# «səhv» for invalid, «nəzərə səə nibe» for "is ignored", «nışondəkə» for
# renderer, «dastrəsi» for accessibility — are the first thing a speaker
# should go over.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] dı qılə kəno nuğtə təyin bəbu, { $attributes } nəzərə səə nibe
       *[other] dı qılə kəno nuğtə təyin bəbu, { $attributes } nəzərə səə nibe
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] kəno nuğtə iyən miyonə nuğtə har dı təyin bəbu, { $attributes } nəzərə səə nibe
       *[other] kəno nuğtə iyən miyonə nuğtə har dı təyin bəbu, { $attributes } nəzərə səə nibe
    }

line-segment-midpoint-offset-without-midpoint = miyonə nuğtə nıbu, midpointOffset heç təsir kardedəni

## `<line>`

line-points-undetermined-dimensions = Ölçüon təyin nıbə nuğtəonədə dəvardə xət.

line-points-too-few-dimensions = Xət bəpe ən kam dı ölçüynə nuğtəonədə dəvardo.

line-points-depend-on-variables = Xət dəyişənonro bastə bə nuğtəonədə dəvardedə: { $variables }.

line-equation-invalid-format = { $variable1 } iyən { $variable2 } dəyişənonədə xəti tənliki format səhve.

## `<ray>`

ray-overprescribed-through = Şüə through, endpoint iyən direction sədo təyin bə. Təyin bə through nəzərə səə nibe.

ray-dimension-mismatch = şüədə numDimensions uyğun nibe.

## `<vector>`

vector-overprescribed-head = Vektor head, tail iyən displacement sədo təyin bə. Təyin bə head nəzərə səə nibe.

vector-dimension-mismatch = vektordə numDimensions uyğun nibe.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` tərəf cəlb kardey nibe, çünki əy nearestPoint holətə dəyişən ni.

constrain-to-without-nearest-point = `<{ $component }>` sədo məhdud kardey nibe, çünki əy nearestPoint holətə dəyişən ni.

constrain-to-interior-without-nearest-point = `<{ $component }>` dılədə məhdud kardey nibe, çünki əy nearestPoint holətə dəyişən ni.

## `<choiceInput>`

choice-input-label-position-ignored = inline nıbə choiceInput-ro labelPosition nəzərə səə nibe

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput-ro təyin bə indekson nəzərə səə nibe, çünki indekson şumor choice dılə elementon şumori uyğun nibe.

pretzel-indices-count-mismatch = problem-ro təyin bə indekson nəzərə səə nibe, çünki indekson şumor problem dılə elementon şumori uyğun nibe.

shuffle-indices-count-mismatch = shuffle-ro təyin bə indekson nəzərə səə nibe, çünki indekson şumor komponenton şumori uyğun nibe.

indices-ignored-out-of-range = { $component } komponentiro təyin bə indekson nəzərə səə nibe, çünki bəzi indekson həddiku beşedən.

pretzel-indices-repeated = pretzel-ro təyin bə indekson nəzərə səə nibe, çünki bəzi indekson təkror bedən.

pretzel-circuit-first-index = circuit rejimədə pretzel-ro təyin bə indekson nəzərə səə nibe, çünki avvəlnə indeks bəpe 1 bıbu.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` mətnə dılə elementon sədo kor bıkəro, `type` atribut bəpe təyin bıbu.

invalid-type-defaulting-to-math = { $component } komponentiro { $type } tip səhve. Bəpe math, text, number ya boolean bıbu. math peqətə bedə.

string-not-valid-component-to-arrange = "{ $value }" mətn { $component } kardeyro düzə komponent ni. Nəzərə səə nibe.

## Types and variables

invalid-type-defaulting-to-number = { $type } tip səhve, tip number noə bedə.

invalid-variable-value = Dəyişəni ğıymət səhve: `{ $value }`

## Variants

variant-index-must-be-number = { $index } variant indeks bəpe ədəd bıbu

variant-index-must-be-integer = { $index } variant indeks bəpe tam ədəd bıbu

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` mütləğə ölçüon sədo kor kardedəni. Enon nisbi noə bedən.

side-by-side-absolute-margins = `<{ $component }>` mütləğə ölçüon sədo kor kardedəni. Kənoon nisbi noə bedən.

side-by-side-no-block-child = Səhvə `<{ $component }>`: əy bəpe ən kam i qılə blokə dılə element bıbu.

## `<label>`

label-for-ignored-on-graphical = Qrafikə `<label>` sədo `for` atribut nəzərə səə nibe.

label-for-must-resolve-to-one = `<label>` sədo `for` atribut bəpe düz i qılə komponent nışon bıdo.

label-for-unresolved = `<label>` sədo `for` atributi i qılə komponenti sədo təyin kardey nışe.

label-for-answer-with-authored-inputs = `<label>` sədo `for` atribut ə `<answer>` nışon dedə ki, dənoydəon əyo müəllif ıştən nıvıştə; dənoydə bevositə nışon bıdə.

label-for-answer-without-input = `<label>` sədo `for` atribut ə `<answer>` nışon dedə ki, əy nışonə noyro dənoydə ni.

label-for-must-reference-input-or-answer = `<label>` sədo `for` atribut bəpe dənoydə ya cəvob nışon bıdo.

## Accessibility

accessibility-short-description-or-decorative = Dastrəsiro `<{ $component }>` bəpe ya kırtə təsvir bıbu, ya bəzəkinə kimi təyin bıbu.

accessibility-video-short-description = Dastrəsiro `<video>` bəpe kırtə təsvir bıbu.

accessibility-input-short-description-or-label = Dastrəsiro `<{ $component }>` bəpe kırtə təsvir ya nışonə bıbu.

accessibility-answer-input-short-description-or-label = Dastrəsiro dənoydə soxdə `<answer>` bəpe kırtə təsvir ya nışonə bıbu.

accessibility-short-description-contains-math = Kırtə təsviron dılədə `<{ $component }>` kimi riyoziyə komponenton nıbəpe bıbun. Riyoziyot sıxanon sədo bınıvışt.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } bəxşi sərlöhə mətniro bəs nıbə kontrast dodə (tarikə rejim) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ən kam { $threshold }:1 lozime).
       *[other] { $colorName } bəxşi sərlöhə mətniro bəs nıbə kontrast dodə ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ən kam { $threshold }:1 lozime).
    }

## `<circle>`

circle-through-points-non-numerical = Nuğtəon ədədə ğıymət nıbəyədə { $count } nuğtə sədo dəvardə `<circle>` hələ həyotə dənoə nıbe.

circle-too-many-through-points = 3-ku vey nuğtəonədə dəvardə doyrə hisob kardey nibe.

circle-overprescribed-radius-center-points = Təyin bə radius, mərkəz iyən dəvardə nuğtəon sədo doyrə hisob kardey nibe.

circle-center-with-multiple-points = Təyin bə mərkəz iyən 1-ku vey nuğtə sədo doyrə hisob kardey nibe.

circle-radius-too-small = Doyrə hisob kardey nibe: dı qılə nuğtə arədə məsafə { $distance } bəbu, təyin bə { $radius } radius vey kıçhe.

circle-radius-with-many-points = Təyin bə radius sədo dı qıləku vey nuğtəonədə doyrə soxtey nibe.

circle-invalid-center-or-through-points = Doyrə mərkəz ya dəvardə nuğtəon səhvin.

circle-radius-center-with-multiple-points = Təyin bə mərkəz iyən 1-ku vey nuğtə sədo doyrə radius hisob kardey nibe.

circle-change-radius-non-numerical = Ədədə ğıymət nıbə nuğtəonədə dəvardə doyrə radius əvəz kardey nibe

circle-radius-with-points-non-numerical = Ədədə ğıymət nıbəyədə təyin bə radius sədo i qıləku vey nuğtəonədə doyrə soxtey nibe.

circle-change-center-non-numerical = Ədədə ğıymət nıbə nuğtəonədə dəvardə doyrə mərkəzi əvəz kardey hələ həyotə dənoə nıbe.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Funksiya təyin sahəro ölçüon bəs kardedənin. Sahədə { $intervals } interval heste, funksiyədə isə { $inputs ->
            [one] { $inputs } dəşiş
           *[other] { $inputs } dəşiş
        } heste.
       *[other] Funksiya təyin sahəro ölçüon bəs kardedənin. Sahədə { $intervals } interval heste, funksiyədə isə { $inputs ->
            [one] { $inputs } dəşiş
           *[other] { $inputs } dəşiş
        } heste.
    }

function-domain-invalid-format = Funksiya təyin sahəro format səhve.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Funksiya ədədə nıbə maksimum nəzərə səə nibe.
        [minimum] Funksiya ədədə nıbə minimum nəzərə səə nibe.
        [extremum] Funksiya ədədə nıbə ekstremum nəzərə səə nibe.
        [point] Funksiya ədədə nıbə nuğtə nəzərə səə nibe.
        [slope] Funksiya ədədə nıbə meyl nəzərə səə nibe.
       *[other] Funksiya ədədə nıbə { $type } nəzərə səə nibe.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Funksiya xolə maksimum nəzərə səə nibe.
        [minimum] Funksiya xolə minimum nəzərə səə nibe.
        [extremum] Funksiya xolə ekstremum nəzərə səə nibe.
        [point] Funksiya xolə nuğtə nəzərə səə nibe.
       *[other] Funksiya xolə { $type } nəzərə səə nibe.
    }

function-points-too-close = Funksiyədə dı qılə nuğtə bo-bə vey nezin. Funksiya təyin kardey nibe.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Funksiya təkroron ancaq dəşişon şumor beşişon şumori bərobər bəbu mümkine. Ə funksiyədə { $inputs } dəşiş iyən { $outputs ->
            [one] { $outputs } beşiş
           *[other] { $outputs } beşiş
        } heste.
       *[other] Funksiya təkroron ancaq dəşişon şumor beşişon şumori bərobər bəbu mümkine. Ə funksiyədə { $inputs } dəşiş iyən { $outputs ->
            [one] { $outputs } beşiş
           *[other] { $outputs } beşiş
        } heste.
    }

## `<sequence>`

sequence-invalid-length = Ardıcıllığ dırozi səhve. Bəpe mənfi nıbə tam ədəd bıbu.

sequence-invalid-step = Ardıcıllığ addım səhve. { $type } tipə ardıcıllığro bəpe ədəd bıbu.

sequence-invalid-endpoint-number = Ədədə ardıcıllığ "{ $attribute }" səhve. Bəpe ədəd bıbu.

sequence-invalid-endpoint-letters = Hərfinə ardıcıllığ "{ $attribute }" səhve. Bəpe hərfon birləşmə bıbu.

sequence-invalid-endpoint = Ardıcıllığ "{ $attribute }" səhve.

select-from-sequence-coprime-not-numbers = ədədon peqətə nibe, ımiro coprime nəzərə səə nibe

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations təyin bə, ımiro coprime nəzərə səə nibe

## Resolving a `target`

target-not-found = `<{ $source }>` sədo səhvə target: hədəf peydo nıbe.

target-state-variable-not-found = `<{ $source }>` sədo səhvə target: `<{ $component }>` sədo "{ $property }" nomədə holətə dəyişən peydo nıbe.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` dəyişənon bəpe müstəğilə dəyişəniku co bıbun.

ode-system-duplicate-variable-names = Təkrorinə asılə dəyişən nomon sədo ODE RHS funksiyaon təyin kardey nibe.

ode-system-rhs-function-error = ODE RHS funksiya təyin kardey nibe. mathjs funksiya soxdeydə xəto.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } xət arədə kunc təyin kardey nibe

angle-invalid-through-point = `<angle>` through dılədə nuğtə səhve

parabola-vertex-too-many-points = Təpə iyən 1-ku vey nuğtəonədə dəvardə parabola hələ həyotə dənoə nıbe.

parabola-too-many-points = 3-ku vey nuğtəonədə dəvardə parabola hələ həyotə dənoə nıbe.

intersection-too-many-items = Dı qıləku vey obyektiro kəsişmə hələ həyotə dənoə nıbe

## Other math components

ionic-compound-not-two-ions = Dı qılə ioniku co çiyiro ionə tərkib hələ həyotə dənoə nıbe.

ionic-compound-needs-cation-and-anion = Ionə tərkib ancaq i qılə kation iyən i qılə anioniro həyotə dənoə bə.

solve-equations-cannot-evaluate = Tənlik həll kardey nibe, çünki tənliki hisob kardey nışe: { $equation }

math-operators-operand-number-required = Riyoziyə operandi bekardeydə operandNumber bəpe təyin bıbu.

eigen-decomposition-failed = Matrisi məxsusə ğıyməton hisob kardey nışe

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } parametr şablonədə ni, ımiro həmişə xolə yer sədo uyğun bəome.
       *[other] `<matchesPattern>`: { $parameters } parametron şablonədə nin, ımiro həmişə xolə yer sədo uyğun bəomen.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" ənə kardey nibe. Bəpe none, medium, dense, ya boşluğ sədo co bə dı qılə müsbətə ədəd bıbu, məsələn grid="1 0.5". Şəbəkə kəşə nibe.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` komponentiro { $expected ->
        [one] i beşişinə funksiya lozime, har nuğtədə y' meyl, məsələn `y - x`
       *[other] dı beşişinə funksiya lozime, har nuğtədə vektor, məsələn `(y, -x)`
    }, əmmo doə bə funksiyədə { $found ->
        [one] { $found } beşiş
       *[other] { $found } beşiş
    } heste. { $alternative ->
        [none] Heçi kəşə nibe.
       *[other] Ə funksiyaro `<{ $alternative }>` komponente. Heçi kəşə nibe.
    }

field-function-attribute-ignored-with-child = `function` atribut nəzərə səə nibe, çünki funksiya komponenti dılədə ham doə bə; dılədəyni işlədə bedə. Funksiya ancaq i cür bıdə.

field-variables-ignored =
    `<{ $component }>`: `variables` atribut komponenti dılədə bevositə nıvıştə bə ifodə dəyişənon nom bardedə. { $reason ->
        [function-child] Ədə funksiya `<function>` dılə element kimi doə bə, əy ıştə dəyişənon ıştən nom bardedə, ımiro `variables` nəzərə səə nibe.
       *[no-expression] Ədə belə ifodə doə nıbe, ımiro `variables` nəzərə səə nibe.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure nışondəkədə xLabelPosition="left" dəstək bedəni; rost tərəfi davranış işlədə bedə.

prefigure-y-label-position-unsupported = `<graph>`: prefigure nışondəkədə yLabelPosition="bottom" dəstək bedəni; səpe tərəfi davranış işlədə bedə.

prefigure-invalid-axis-bounds = `<graph>`: prefigure çevirmiro oxi sərhədon səhvin; əsosə bbox (-10,-10,10,10) işlədə bedə.

prefigure-invalid-width = `<graph>`: prefigure çevirmiro en səhve; əsosə diaqram eni 425 işlədə bedə.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure çevirmiro aspectRatio səhve; əsosə nisbət 1 işlədə bedə.

prefigure-grid-spacing-too-fine = `<graph>`: oxi həddonro şəbəkə arə vey nozıke; prefigure nışondəkədə şəbəkə kəşə nibe.

prefigure-annotations-not-rendered = `<graph>`: PreFigure nışondəkə işlədə nıbəbu, ğeydon kəşə nibin.

multiple-annotations-children = `<graph>` dılədə çand `<annotations>` dılə element peydo be; axırınəku ğəyri həmməy nəzərə səə nibe.

## Referring to other components

copy-unrecognized-component-type = Ənə nıbə komponent tip dıroz kardey ya nusxə peqətey nibe: { $type }.

copy-prop-not-found = { $component } tipə komponentədə { $property } xüsusiyət peydo nıbe

collect-no-source = collect-ro mənbə peydo nıbe.

collect-invalid-component-type = `<{ $component }>` tipə komponenton co kardey nibe, çünki ım səhvə komponent tipe.

reference-index-unavailable = `{ $reference }` indeksi nışon doy nibe

## `<callAction>`

component-action-unavailable = `{ $reference }` komponentədə { $action } sədo kor kardey nibe

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Məlumaton şəkil səhve. Sıraon dırozi bo-bə uyğun ni. componentIdx :{ $componentIdx } dılədə peydo be

data-frame-duplicate-column-names = Məlumatonədə təkrorinə sutun nomon heste. componentIdx :{ $componentIdx } dılədə peydo be

data-frame-missing-column-name = Məlumatonədə i qılə sutuni nom ni. componentIdx :{ $componentIdx } dılədə peydo be

## `<answer>` and scoring

answer-award-depends-on-own-response = Ə cəvobiro i qılə mükafat ıştə `<answer>` teqi vığandə cəvobi səpe qıniyə, ım qözləniş nıbə davranışi bədoy.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` bə ğabi dılədə `<answer>` sədo `maxNumAttempts` noy heç təsir kardedəni, çünki cəhdon şumori ğab idarə kardedə. `maxNumAttempts` ğabi səpe bınə.

nested-section-wide-check-work-max-num-attempts = Co `sectionWideCheckWork` bə ğabi dılədə bə `sectionWideCheckWork` bə ğabi səpe `maxNumAttempts` noy heç təsir kardedəni, çünki cəhdon şumori bəyrunə ğab idarə kardedə. `maxNumAttempts` bəyrunə ğabi səpe bınə.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality noə nıbu, { $attributes } atribut heç təsir bənıkarde.
       *[other] symbolicEquality noə nıbu, { $attributes } atributon heç təsir bənıkarden.
    }

answer-invalid-type = Cəvobiro səhvə tip: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` komponenti nom nıbəyo, əy moduli atributiro işlədey nibe

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` komponenti moduli atributiro işlədey nibe, çünki `<module>` komponent tipədə jə "{ $name }" atribut təyin bə.

conditional-content-condition-ignored = case ya else dılə elementon bə `<conditionalContent>` komponentədə `condition` atribut nəzərə səə nibe.

slider-markers-type-mismatch = Nışonəon tip slayderi tipi uyğun nibe.

pretzel-problem-needs-statement-and-answer = Səhvə pretzel: har `<problem>` dılədə bəpe i qılə `<statement>` iyən i qılə `<answer>` bıbu.

pretzel-circuit-first-problem-distractor = Səhvə pretzel: mode="circuit" bəbu, avvəlnə `<problem>` çaşdəbardə bənıbe.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` atributiro { $values } ğıymət səhve; nəzərə səə nibe.
       *[other] `{ $attribute }` atributiro { $values } ğıyməton səhvin; nəzərə səə nibin.
    }

attribute-must-be-references = `{ $attribute }` atributiro `{ $value }` ğıymət səhve. Atribut bəpe `$` sədo bino bə istinodonku ibarət bıbu.

math-input-invalid-function-names = <mathInput>: { $attribute } dılədə səhvə funksiya nomon nəzərə səə nibin: { $names }. Har nomi nışon doə poə bəpe ən kam 2 işorə bıbu (hərf ya tire); peştəyo ixtiyorə `|<mathspeak alternative>` şəkilçi bome bəzıne.

## Building components from the source

component-type-invalid = Səhvə komponent tip: `<{ $componentType }>`

attribute-repeated = { $attribute } atributi təkror kardey nibe.

attribute-invalid-for-component = `<{ $componentType }>` tipə komponentiro "{ $attribute }" atribut səhve.

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } stil təyinotədə { $context ->
        [text-on-background] mətni rang fonə rangi sədo
        [high-contrast] vey kontrastinə rang lövhə sədo
        [line] xəti rang lövhə sədo
        [marker] nışonə rang lövhə sədo
       *[text-on-canvas] mətni rang lövhə sədo
    } bəs nıbə kontrast dodə{ $mode ->
        [dark] { " (tarikə rejim)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ən kam { $threshold }:1 lozime).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } stil təyinot ruşnə rejimiro bəs bə kontrastinə rangon təyin kardəş bıbu ham, ə ğıymətonku bekardə tarikə rejimi rangon mətni rangi fonə rangi sədo bəs nıbə kontrast dodən ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ən kam { $threshold }:1 lozime). { $suggestion ->
        [available] Tarikə rejimədə kontrast bəs bıburo, ya ruşnə rejimi kontrast vey bıkə (məsələn, { $lightAttribute }="{ $lightColor }" bınə), ya tarikə rejimi rang əvəz bıkə (məsələn, { $darkAttribute }="{ $darkColor }" bınə).
       *[none] Tarikə rejimədə kontrast bəs bıburo, ruşnə rejimi kontrast vey bıkə ya bekardə bə rangon textColorDarkMode iyən/ya backgroundColorDarkMode sədo əvəz bıkə.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } stil təyinot ruşnə rejimiro bəs bə kontrast bə mətni rang təyin kardəş bıbu ham, ə ğıymətiku bekardə tarikə rejimi mətni rang lövhə sədo bəs nıbə kontrast dodə ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ən kam { $threshold }:1 lozime). { $suggestion ->
        [available] Tarikə rejimədə kontrast bəs bıburo, ya ruşnə rejimi kontrast vey bıkə (məsələn, textColor="{ $lightColor }" bınə), ya tarikə rejimi rang əvəz bıkə (məsələn, textColorDarkMode="{ $darkColor }" bınə).
       *[none] Tarikə rejimədə kontrast bəs bıburo, ruşnə rejimi kontrast vey bıkə ya bekardə bə rang textColorDarkMode sədo əvəz bıkə.
    }

section-multiple-style-palettes = I qılə bəxş ancaq i qılə <stylePalette> peqətey bəzıne; axırınə işlədə bedə.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } komponenti təkinə varianton təyin kardey nibe, çünki numToSelect mənfi nıbə tam ədəd ni.

variant-num-to-select-not-constant-number = { $component } komponenti təkinə varianton təyin kardey nibe, çünki numToSelect sabitə ədəd ni.

variant-with-replacement-not-constant-boolean = { $component } komponenti təkinə varianton təyin kardey nibe, çünki withReplacement sabitə boolean ni.

variant-select-weight-disables-unique = selectWeight ya selectForVariants təyin bə seçim bıbu, select-ro təkinə varianton söndə bedən

variant-coprime-undetermined = { $component } komponenti təkinə varianton təyin kardey nibe, çünki coprime həmişə false bey təyin kardey nibe.

variant-attribute-not-constant = { $component } komponenti təkinə varianton təyin kardey nibe, çünki { $attribute } sabit ni.

variant-attribute-not-number = { $component } komponenti təkinə varianton təyin kardey nibe, çünki { $attribute } ədəd ni.

variant-attribute-wrong-type-for-sequence =
    { $type } tipə { $component } komponenti təkinə varianton təyin kardey nibe, çünki { $attribute } { $expected ->
        [letters-combination] hərfon birləşmə
        [math-expression] düzə riyoziyə ifodə
        [integer] tam ədəd
       *[number] ədəd
    } ni.

variant-length-not-integer = { $component } komponenti təkinə varianton təyin kardey nibe, çünki length tam ədəd ni.

variant-sort-not-implemented = sort bə { $component } komponenti təkinə varianton hələ həyotə dənoə nıbin

variant-exclude-combinations-not-implemented = excludeCombinations bə { $component } komponenti təkinə varianton hələ həyotə dənoə nıbin

variant-math-exclude-not-implemented = exclude bə math tipə { $component } komponenti təkinə varianton hələ həyotə dənoə nıbin

variant-non-constant-exclude-not-implemented = sabit nıbə exclude bə { $component } komponenti təkinə varianton hələ həyotə dənoə nıbin

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: qrafiki prefigure nışondəkədə dəstək bedəni; dılə element dəvardə bedə.

prefigure-descendant-invalid-geometry = { $subject }: sonsuzə ya nıtomə həndəsə; dılə element dəvardə bedə.

prefigure-curve-label-omitted = { $subject }: çevirə bə əyriyə elementonədə nışonəon dəstək bedənin; nışonə dəvardə bedə.

prefigure-curve-unsupported-definition-type = { $subject }: dəstək nıbə əyri funksiya təyinot tip '{ $definitionType }'; dılə element dəvardə bedə.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves sədo dəstək nıbə flipFunctions atribut; dılə element dəvardə bedə.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves sədo ancaq formula tipə dılə funksiyaon dəstək bedən; dılə element dəvardə bedə.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] xət ailə nışonəro
       *[point] nuğtə nışonəro
    } dəstək nıbə labelPosition '{ $labelPosition }'; əsosə PreFigure düzəniş işlədə bedə.

prefigure-fill-style-unsupported = { $subject }: '{ $fillStyle }' purkardə stil PreFigure tərəfo dəstək bedəni; bərkə pur bə oqardedə.

prefigure-line-style-unknown = { $subject }: ənə nıbə xəti stil '{ $lineStyle }' PreFigure bekardəku dəvardə bedə.

prefigure-marker-style-mapped-to-diamond = { $subject }: '{ $markerStyle }' nışonə stil PreFigure 'diamond' stili sədo uyğun kardə be.

prefigure-marker-style-unsupported = { $subject }: '{ $markerStyle }' nışonə stil PreFigure tərəfo dəstək bedəni; əsosə stil işlədə bedə.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: səhvə `ref`; hədəf təyin kardey nibe. Ğeyd dəvardə bedə.

annotation-ref-multiple-targets = `<annotation>`: `ref` çand hədəf nışon dodə; avvəlnə hədəf işlədə bedə.

annotation-ref-outside-graph = `<annotation>`: səhvə `ref`; hədəf ğabi qrafiki bekardəyo. Ğeyd dəvardə bedə.

annotation-ref-unsupported-target = `<annotation>`: səhvə `ref`; hədəf prefigure çevirmədə dəstək bə qrafikə obyekt ni. Ğeyd dəvardə bedə.

annotation-text-missing = `<annotation>`: `text` ni ya xolie; xolə mətn bekardə bedə.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Doyrəvi asılılığ peydo be.
       *[other] `<{ $componentType }>` komponenti sədo doyrəvi asılılığ peydo be.
    }

reference-no-referent = İstinodro obyekt peydo nıbe: `{ $reference }`

reference-multiple-referents = İstinodro çand obyekt peydo be: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` komponenti { $attribute } atributi format səhve.

children-invalid = `<{ $componentType }>` komponentiro dılə elementon səhvin: səhvə dılə elementon peydo be: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` atributiro `{ $value }` ğıymət səhve, `{ $default }` ğıymət işlədə bedə

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } versiya peydo nıbe.
       *[other] DoenetML { $version } versiya peydo nıbe. { $fallback } versiya işlədə bedə
    }

## Reading the DoenetML

parse-invalid-doenetml = Səhvə DoenetML: { $content }

parse-tag-missing-close-tag = Səhvə DoenetML: `{ $tag }` teqi bandə teq ni. Ya ıştən-bandə teq, ya `</{ $tagName }>` teq qözləniş bedəbe.

parse-tag-error = Səhvə DoenetML: `<{ $tagName }>` teqədə xəto

parse-attribute-missing-value = Səhvə DoenetML: `{ $attribute }` səhvə atributi ğıymət nıbe bənze.

parse-attribute-invalid = Səhvə DoenetML: `{ $attribute }` atribut səhve

parse-attribute-value-invalid = Səhvə DoenetML: `{ $value }` atributi ğıymət səhve

parse-attribute-value-quote-mismatch = Səhvə DoenetML: `{ $value }` atributi ğıymət səhve. Dırnəğon bo-bə uyğun nin. Şımə `{ $quote }` yoddo bənzedə

parse-open-tag-name-missing = Səhvə DoenetML: Nom nıbə teq peydo be, məsələn `<`

parse-tag-not-closed = Səhvə DoenetML: `{ $tag }` teq bandə nıbe (`>` ni bənze).

parse-self-closing-tag-name-missing = Səhvə DoenetML: Nom nıbə teq peydo be `<{ $content }>`

parse-self-closing-tag-not-closed = Səhvə DoenetML: `{ $tag }` teq bandə nıbe (`/>` ni bənze).

parse-tag-invalid-attributes = Səhvə DoenetML: `{ $tag }` teq düz ni. Bəlkə atributon səhvin.

parse-close-tag-name-missing = Səhvə DoenetML: Nom nıbə bandə teq peydo be, məsələn `</`

parse-attribute-value-unquoted = Atributon ğıyməton bəpe dırnəğ dılədə bıbun: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Səhvə DoenetML: `{ $tag }` bandə teq peydo be, əmmo uyğunə oj bə teq ni

parse-close-tag-mismatched = Səhvə DoenetML: Bandə teq uyğun nibe. `</{ $expected }>` qözləniş bedəbe. `{ $found }` peydo be

parser-node-unconvertible = { $node } düyüni Dast düyüni sədo çevirmiş kardey nışe.

## Names

name-attribute-invalid =
    Səhvə atribut name='{ $name }'. { $reason ->
        [characters] Nomonədə ancaq hərfon, ədədon, jiə xət ya tire bome bəzınen.
       *[start] Nomon bəpe hərfiku bino bıbun.
    }

component-name-invalid-start = Səhvə komponent nom "{ $name }". Nomon bəpe hərfiku bino bıbun.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched tipə cəvobədə bəpe video atribut bıbu

answer-video-watched-video-not-reference = videoWatched tipə cəvobi video atribut bəpe istinod bıbu

answer-name-not-single-text = Cəvobi name atributədə bəpe tanhə i qılə mətnə dılə element bıbu

## Referencing another document

external-doenetml-recursion-limit = Bəyrunə DoenetML peqətey nibe, çünki rekursiya səviyyəon vey vein. Doyrəvi istinod heste?

external-doenetml-unavailable = { $attribute }="{ $uri }" sədo DoenetML peqətey nibe

external-doenetml-type-mismatch = { $attribute }="{ $uri }" sədo peqətə bə DoenetML səhve: əy "{ $componentType }" komponent tipi uyğun nibe

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` atribut kohnə bə; ıvəzi `{ $to }` işlət.
       *[other] [deprecation] `<{ $component }>` sədo `{ $from }` atribut kohnə bə; ıvəzi `{ $to }` işlət.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` atribut kohnə bə iyən nəzərə səə nibe, çünki `{ $to }` ham təyin bə.
       *[other] [deprecation] `<{ $component }>` sədo `{ $from }` atribut kohnə bə iyən nəzərə səə nibe, çünki `{ $to }` ham təyin bə.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` sədo `{ $attribute }` atribut kohnə bə iyən nəzərə səə nibe.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` sədo `{ $attribute }` atribut kohnə bə; ıvəzi `<{ $child }>` dılə element işlət.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` sədo `{ $attribute }` atributi `{ $value }` ğıymət kohnə bə; ıvəzi `{ $to }` işlət.


## Language coverage

pluralize-english-only = `<pluralize>` ancaq inqiliso sıxanon cəm kardey bəzıne, ımiro { $locale } zıvonədə nıvıştə bə sənəddə əy mətn dəyiş nibe. Cəmə şəkil bevositə bınıvışt, ya `pluralForm` atribut sədo təyin bıkə.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` element ənə bə Doenet element ni.

schema-element-not-allowed-at-root = `<{ $tag }>` elementi sənədi rişədə noyro icozə ni.

schema-element-not-allowed-inside = `<{ $tag }>` elementi `<{ $parent }>` dılədə noyro icozə ni.

schema-attribute-unrecognized = `<{ $tag }>` elementədə `{ $attribute }` nomədə atribut ni.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` elementi `{ $attribute }` atribut bəpe siyahi bıbu ki, har elementış ımonku i qılə bıbu: { $allowed }
       *[other] `<{ $tag }>` elementi `{ $attribute }` atribut bəpe ımonku i qılə bıbu: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select-ro variant nom səhve. { $variantName } variant nom { $numOptions } seçimədə peydo bedə, əmmo peqətey lozim bə şumor { $numToSelect }e.

select-variant-name-without-options = select-ro bəzi varianton təyin bin, əmmo mümkün bə variant nomiro seçimon təyin nıbin: { $variantName }.

select-variant-name-not-possible = select-ro təyin bə { $variantName } variant nom mümkün bə variant nom ni.

select-too-few-options = Tanhə { $numOptions } seçimiku { $numToSelect } komponent peqətey nibe.

select-from-sequence-too-few-values = { $length } dırozinə ardıcıllığiku { $numToSelect } ğıymət peqətey nibe.

select-from-sequence-indices-count-mismatch = select-ro təyin bə indekson şumor peqətey lozim bə şumori uyğun bəpe bıbu

select-from-sequence-indices-not-integers = select-ro təyin bə həmmə indekson bəpe tam ədədon bıbun

select-from-sequence-index-excluded = selectfromsequence sədo bekardə bə indeks təyin bə

select-from-sequence-indices-excluded-combination = selectfromsequence sədo bekardə bə birləşmə indekson təyin bin

select-from-sequence-coprime-not-positive-integers = Müsbətə tam ədədon peqətə nibe, ımiro coprime birləşməon peqətey nibe.

select-from-sequence-coprime-common-factor = Coprime ədədon peqətey nibe. Həmmə mümkün bə ğıyməton ümumiyə bölən dodən. (Təyin bə "from" ya "to" ğıyməton bəpe "step" sədo coprime bıbun.)

select-from-sequence-coprime-single-number = 1 nıbə tanhə ədədiku coprime birləşməon peqətey nibe.

select-from-sequence-excluded-too-many-combinations = selectFromSequence dılədə birləşməon 70%-ku vey bekardə be

select-from-sequence-coprime-none-found = Coprime ədədon peqətey nışe. Həmmə mümkün bə ğıyməton ümumiyə bölən dodən.

select-from-sequence-too-few-unique-values = { $numPossibleValues } dırozinə ardıcıllığiku { $numToSelect } təkinə ğıymət peqətey nibe

select-prime-numbers-too-few-values = { $numValues } dırozinə sadə ədədon siyahiku { $numToSelect } ğıymət peqətey nibe

select-prime-numbers-values-count-mismatch = select-ro təyin bə ğıyməton şumor peqətey lozim bə şumori uyğun bəpe bıbu

select-prime-numbers-values-not-prime = select prime number-ro təyin bə həmmə ğıyməton bəpe sadə ədədon siyahidə bıbun

select-prime-numbers-values-excluded-combination = selectPrimeNumbers sədo təyin bə ğıyməton bekardə bə birləşmə bin

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers dılədə birləşməon 70%-ku vey bekardə be

select-random-combination-fluke = Vey kam mümkün bə təsodüfiku, təsodüfiyə ğıyməton birləşmə peqətey nışe

select-random-value-fluke = Vey kam mümkün bə təsodüfiku, təsodüfiyə ğıymət peqətey nışe
