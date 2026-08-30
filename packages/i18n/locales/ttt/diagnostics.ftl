# Muslim Tat (zuhun-i tati) diagnostics. Translated from
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
# **Script.** The Latin alphabet of Azerbaijan, the tradition Tat material
# published in Azerbaijan follows. **Tat in Dagestan is written in Cyrillic**,
# equally currently and for longer; the two are never mixed, and a reviewer
# who prefers Cyrillic must convert all four files of this locale together.
# `chrome.ftl` states this in full.
#
# **This file is deliberately incomplete, and it is the thinnest catalog in
# its batch by a wide margin.** Tat is an Iranian language with a small
# written corpus, no schooling and no technical register; a great many of
# these messages are three- and four-clause sentences about software, and
# writing them out would mean inventing a Tat syntax for a subject Tat has
# never been written about. Rather than do that, this seed covers the
# messages it can write and **omits the longest ones**, which fall back to
# English and are reported by `lint:i18n` as missing coverage. The omitted
# groups are named where they would have appeared, so a reviewer can see the
# gaps rather than hunt for them: the three `style-definition-*` contrast
# paragraphs, the two `<slopeField>`/`<vectorField>` messages and
# `field-variables-ignored`, the two `sectionWideCheckWork` paragraphs,
# `math-input-invalid-function-names`, and `math-embedded-input-shape-
# unsuitable`. Everything else here is covered.
#
# **Vocabulary: mostly Azerbaijani, and said so.** Every technical word below
# is an Azerbaijani loan kept as a loan, because it is what a Tat speaker in
# Azerbaijan actually says — «komponent», «atribut», «element», «indeks»,
# «variant», «funksiya», «interval», «matris», «parametr», «format», «teq»,
# «referens», «versiya», «koordinat», «kontrast», «annotasiya»,
# «diaqnostika», «dəyişən», «ədəd», «qiymət», «pozuntu», «şəbəkə», «ox»,
# «sıfır». Tat's own Iranian words carry the frame around them: «nodürüs»
# invalid, «yoft nəbü» not found, «nist» there is none, «hüst» there is,
# «gərək» must, «çünki» because, «hənüz» yet, «əz» from, «bə» to, «ə» in,
# «ba» with, «ənə» like, «hər» every, «digər» other, «xəto» error, «sətir»
# line, «rejimi tarik» dark mode, «rejimi rüşən» light mode, and the plural
# «-ho».
#
# **Number.** A Tat noun after a numeral is unmarked, so every English `one`
# / `other` pair is written here as a single unselected form.
# `Intl.PluralRules` has no CLDR data for `ttt`, so no plural-category branch
# appears anywhere in these four files.
#
# **Ezafe and placeables.** As in `content.ftl`, the ezafe is written attached
# on a word this catalog writes itself and as a hyphenated `-i` after a
# placeable, and it is always `-i` even where a vowel-final word wants `-yi`.
# That is a recorded debt. Case and possessive endings are never welded onto a
# name quoted from the author's source.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = Vaxti dü nüqtəyi kənori təyin bire, { $attributes } nəzərə nə migirü

line-segment-attributes-ignored-with-endpoint-and-midpoint = Vaxti yə nüqtəyi kənor və yə nüqtəyi miyona həmro təyin bire, { $attributes } nəzərə nə migirü

line-segment-midpoint-offset-without-midpoint = Bi nüqtəyi miyona midpointOffset kor nə misozü

## `<line>`

line-points-undetermined-dimensions = Xətt əz nüqtəhoyi ba ölçühoyi nomə'lum miguzərə.

line-points-too-few-dimensions = Xətt gərək əz nüqtəhoyi kəmtərin dü ölçüyi biguzərə.

line-points-depend-on-variables = Xətt əz nüqtəhoyi bə dəyişənho vobəstə miguzərə: { $variables }.

line-equation-invalid-format = Formati tənləyi xətt ba dəyişənhoyi { $variable1 } və { $variable2 } nodürüs.

## `<ray>`

ray-overprescribed-through = Şüa həmro ba through, endpoint və direction təyin bire. Throughi təyinbire nəzərə nə migirü.

ray-dimension-mismatch = Ə şüa numDimensions cur nə miyo.

## `<vector>`

vector-overprescribed-head = Vektor həmro ba head, tail və displacement təyin bire. Headi təyinbire nəzərə nə migirü.

vector-dimension-mismatch = Ə vektor numDimensions cur nə miyo.

## Attracting and constraining

attract-to-without-nearest-point = Bə `<{ $component }>` cəzb soxdən nə mibu: dəyişəni holi nearestPoint-i ü nist.

constrain-to-without-nearest-point = Bə `<{ $component }>` məhdud soxdən nə mibu: dəyişəni holi nearestPoint-i ü nist.

constrain-to-interior-without-nearest-point = Bə dərüni `<{ $component }>` məhdud soxdən nə mibu: dəyişəni holi nearestPoint-i ü nist.

## `<choiceInput>`

choice-input-label-position-ignored = Bəroyi choiceInputi qeyri-sətri labelPosition nəzərə nə migirü

## Ordering children by index

choice-input-indices-count-mismatch = Çünki şümori indices ba şümori elementhoyi fərzəndi choice cur nə miyo, indicesi bəroyi choiceInput təyinbire nəzərə nə migirü.

pretzel-indices-count-mismatch = Çünki şümori indices ba şümori elementhoyi fərzəndi problem cur nə miyo, indicesi bəroyi problem təyinbire nəzərə nə migirü.

shuffle-indices-count-mismatch = Çünki şümori indices ba şümori komponentho cur nə miyo, indicesi bəroyi shuffle təyinbire nəzərə nə migirü.

indices-ignored-out-of-range = Çünki bəzi indeksho əz həddi xarici, indicesi bəroyi { $component } təyinbire nəzərə nə migirü.

pretzel-indices-repeated = Çünki bəzi indeksho təkror bire, indicesi bəroyi pretzel təyinbire nəzərə nə migirü.

pretzel-circuit-first-index = Çünki ə rejimi circuit indeksi əvvəlin gərək 1 bu, indicesi bəroyi pretzel təyinbire nəzərə nə migirü.

## `<shuffle>` and `<sort>`

string-children-need-type = Bəroyi ki `<{ $component }>` ba elementhoyi fərzəndi mətni kor bisozü, atributi `type` gərək təyin bu.

invalid-type-defaulting-to-math = Tipi { $type } bəroyi komponenti { $component } nodürüs. Gərək yəki əz math, text, number yo boolean bu. math kor migirü.

string-not-valid-component-to-arrange = Mətni "{ $value }" bəroyi { $component } komponenti dürüs nist. Nəzərə nə migirü.

## Types and variables

invalid-type-defaulting-to-number = Tipi { $type } nodürüs; tip ənə number təyin mibu.

invalid-variable-value = Qiyməti dəyişən nodürüs: `{ $value }`

## Variants

variant-index-must-be-number = Indeksi varianti { $index } gərək ədəd bu

variant-index-must-be-integer = Indeksi varianti { $index } gərək ədədi tom bu

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` bəroyi ölçühoyi mütləq hənüz sozorə nəbü. Enho bə qiyməthoyi nisbi vogərdunde mibu.

side-by-side-absolute-margins = `<{ $component }>` bəroyi ölçühoyi mütləq hənüz sozorə nəbü. Kenorho bə qiyməthoyi nisbi vogərdunde mibu.

side-by-side-no-block-child = `<{ $component }>` nodürüs: gərək kəmtərin yə elementi fərzəndi blok dorü.

## `<label>`

label-for-ignored-on-graphical = Atributi `for` ə səri `<label>`-i qrafiki nəzərə nə migirü.

label-for-must-resolve-to-one = Atributi `for` ə səri `<label>` gərək dürüs bə yə komponent həll bu.

label-for-unresolved = Atributi `for` ə səri `<label>` bə hiç komponent həll nəbü.

label-for-answer-with-authored-inputs = Atributi `for` ə səri `<label>` bə yə `<answer>`-i ba girişhoyi oşkoro nüştə işorə misozü; rost bə xudi giriş işorə sax.

label-for-answer-without-input = Atributi `for` ə səri `<label>` bə yə `<answer>`-i bi giriş işorə misozü.

label-for-must-reference-input-or-answer = Atributi `for` ə səri `<label>` gərək bə yə giriş yo bə yə cavob işorə bisozü.

## Accessibility

accessibility-short-description-or-decorative = Bəroyi əlçatanlığ `<{ $component }>` gərək yo yə tərifi kütoh dorü, yo ənə bəzək təyin bu.

accessibility-video-short-description = Bəroyi əlçatanlığ `<video>` gərək yə tərifi kütoh dorü.

accessibility-input-short-description-or-label = Bəroyi əlçatanlığ `<{ $component }>` gərək yə tərifi kütoh yo yə etiket dorü.

accessibility-answer-input-short-description-or-label = Bəroyi əlçatanlığ yə `<answer>`-i ki giriş misozü gərək yə tərifi kütoh yo yə etiket dorü.

accessibility-short-description-contains-math = Ə tərifhoyi kütoh gərək komponenthoyi riyozi ənə `<{ $component }>` nəbu. Riyozi-rə ba sühunho binvis.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } bəroyi mətni sərləvhəyi bəxş kontrasti kifoyət nə dorü (rejimi tarik) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kəmtərin { $threshold }:1 gərək).
       *[other] { $colorName } bəroyi mətni sərləvhəyi bəxş kontrasti kifoyət nə dorü ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kəmtərin { $threshold }:1 gərək).
    }

## `<circle>`

circle-through-points-non-numerical = Vaxti nüqtəho qiyməthoyi ədədi nə dorü, `<circle>`-i əz { $count } nüqtə guzərəndə hənüz sozorə nəbü.

circle-too-many-through-points = Dayirəyi əz ziyodtər əz 3 nüqtə guzərəndə hisob soxdən nə mibu.

circle-overprescribed-radius-center-points = Dayirəyi ba radius, mərkəz və nüqtəhoyi guzərəndə həmro təyinbire hisob soxdən nə mibu.

circle-center-with-multiple-points = Dayirəyi ba mərkəzi təyinbire ki əz ziyodtər əz 1 nüqtə miguzərə hisob soxdən nə mibu.

circle-radius-too-small = Dayirə hisob nə mibu: çünki fosilə beyni dü nüqtə { $distance }, radiusi təyinbireyi { $radius } xəyli kiçik.

circle-radius-with-many-points = Dayirəyi ba radiusi təyinbire ki əz ziyodtər əz dü nüqtə miguzərə sozorən nə mibu.

circle-invalid-center-or-through-points = Mərkəz yo nüqtəhoyi guzərəndəyi dayirə nodürüs.

circle-radius-center-with-multiple-points = Radiusi dayirəyi ba mərkəzi təyinbire ki əz ziyodtər əz 1 nüqtə miguzərə hisob soxdən nə mibu.

circle-change-radius-non-numerical = Radiusi dayirəyi ba nüqtəhoyi qeyri-ədədi dəyişmiş soxdən nə mibu

circle-radius-with-points-non-numerical = Vaxti qiyməthoyi ədədi nist, dayirəyi ba radiusi təyinbire ki əz ziyodtər əz yə nüqtə miguzərə sozorən nə mibu.

circle-change-center-non-numerical = Dəyişmiş soxdəni mərkəzi dayirəyi əz nüqtəhoyi qeyri-ədədi guzərəndə hənüz sozorə nəbü.

## `<function>`

function-domain-insufficient-dimensions = Bəroyi domeni funksiya ölçüho kifoyət nə misozü. Ə domen { $intervals } interval hüst, əmmo funksiya { $inputs } giriş dorü.

function-domain-invalid-format = Formati domeni funksiya nodürüs.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Qiyməti büzürgtərini qeyri-ədədiyi funksiya nəzərə nə migirü.
        [minimum] Qiyməti kiçiktərini qeyri-ədədiyi funksiya nəzərə nə migirü.
        [extremum] Qiyməti kənoriyi qeyri-ədədiyi funksiya nəzərə nə migirü.
        [point] Nüqtəyi qeyri-ədədiyi funksiya nəzərə nə migirü.
        [slope] Mayiliyi qeyri-ədədiyi funksiya nəzərə nə migirü.
       *[other] { $type }-i qeyri-ədədiyi funksiya nəzərə nə migirü.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Qiyməti büzürgtərini xoliyi funksiya nəzərə nə migirü.
        [minimum] Qiyməti kiçiktərini xoliyi funksiya nəzərə nə migirü.
        [extremum] Qiyməti kənoriyi xoliyi funksiya nəzərə nə migirü.
        [point] Nüqtəyi xoliyi funksiya nəzərə nə migirü.
       *[other] { $type }-i xoliyi funksiya nəzərə nə migirü.
    }

function-points-too-close = Ə funksiya dü nüqtəyi xəyli nizdik bə həmdigər hüst. Funksiya təyin nə mibu.

function-iterates-input-output-mismatch = İterasiyahoyi funksiya təno vaxti şümori girişho ba şümori çıxışho bərobər bu mümkün. İn funksiya { $inputs } giriş və { $outputs } çıxış dorü.

## `<sequence>`

sequence-invalid-length = Durozi silsilə nodürüs. Gərək ədədi tomi qeyri-mənfi bu.

sequence-invalid-step = Addımi silsilə nodürüs. Bəroyi silsiləyi tipi { $type } gərək ədəd bu.

sequence-invalid-endpoint-number = Qiyməti "{ $attribute }"-i silsiləyi ədədi nodürüs. Gərək ədəd bu.

sequence-invalid-endpoint-letters = Qiyməti "{ $attribute }"-i silsiləyi hərfi nodürüs. Gərək birləşməyi hərfho bu.

sequence-invalid-endpoint = Qiyməti "{ $attribute }"-i silsilə nodürüs.

select-from-sequence-coprime-not-numbers = Çünki ədədho vəçinde nəbü, coprime nəzərə girde nəbü

select-from-sequence-coprime-with-exclude-combinations = Çünki excludeCombinations təyin bire, coprime nəzərə girde nəbü

## Resolving a `target`

target-not-found = Targeti bəroyi `<{ $source }>` nodürüs: hədəf yoft nə mibu.

target-state-variable-not-found = Targeti bəroyi `<{ $source }>` nodürüs: ə səri `<{ $component }>` dəyişəni holi ba nomi "{ $property }" yoft nə mibu.

## `<odeSystem>`

ode-system-variables-match-independent = Dəyişənhoyi `<odeSystem>` gərək əz dəyişəni müstəqil digər bu.

ode-system-duplicate-variable-names = Ba nomhoyi dəyişəni təkrorbire funksiyahoyi rosti ODE təyin soxdən nə mibu.

ode-system-rhs-function-error = Funksiyayi rosti ODE təyin nə mibu. Vaxti sozorəni funksiyayi mathjs xəto bire.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Buri beyni { $count } xətt təyin soxdən nə mibu

angle-invalid-through-point = Ə throughi `<angle>` nüqtəyi nodürüs hüst

parabola-vertex-too-many-points = Parabolayi ba təpə ki əz ziyodtər əz 1 nüqtə miguzərə hənüz sozorə nəbü.

parabola-too-many-points = Parabolayi əz ziyodtər əz 3 nüqtə guzərəndə hənüz sozorə nəbü.

intersection-too-many-items = Kəsişməyi ziyodtər əz dü çi hənüz sozorə nəbü

## Other math components

ionic-compound-not-two-ions = Birləşməyi ioni bəroyi çihoyi qeyri əz dü ion hənüz sozorə nəbü.

ionic-compound-needs-cation-and-anion = Birləşməyi ioni təno bəroyi yə kation və yə anion sozorə bire.

solve-equations-cannot-evaluate = Çünki tənlə hisob nəbü, həll soxdən nə mibu: { $equation }

math-operators-operand-number-required = Vaxti girdəni operandi riyozi gərək operandNumber təyin bu.

eigen-decomposition-failed = Qiyməthoyi xudiyi matris hisob nəbü

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: parametrhoyi { $parameters } ə şablon nist, ə xoter-i in hər vaxt ba xoli cur miyo.

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" fəhmide nə mibu. Gərək none, medium, dense yo dü ədədi müsbəti ba fosilə cudobire bu, məsələn grid="1 0.5". Şəbəkə kəşide nə mibu.

## `<slopeField>` and `<vectorField>`
##
## `field-function-wrong-num-outputs`, `field-function-attribute-ignored-with-
## child` and `field-variables-ignored` are omitted: each is a three-clause
## explanation of a component's contract, and this seed cannot write them in
## Tat without inventing the syntax. They fall back to English.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: ə göstəriciyi prefigure xLabelPosition="left" dəstək nə migirü; rəftori tərəfi rost kor migirü.

prefigure-y-label-position-unsupported = `<graph>`: ə göstəriciyi prefigure yLabelPosition="bottom" dəstək nə migirü; rəftori tərəfi bolo kor migirü.

prefigure-invalid-axis-bounds = `<graph>`: bəroyi vogərdunəni prefigure həddhoyi ox nodürüs; bboxi pişfərz (-10,-10,10,10) kor migirü.

prefigure-invalid-width = `<graph>`: bəroyi vogərdunəni prefigure en nodürüs; eni pişfərzi diaqram 425 kor migirü.

prefigure-invalid-aspect-ratio = `<graph>`: bəroyi vogərdunəni prefigure aspectRatio nodürüs; nisbəti pişfərzi 1 kor migirü.

prefigure-grid-spacing-too-fine = `<graph>`: fosiləyi şəbəkə bə həddhoyi ox nisbətən xəyli nozuk; ə göstəriciyi prefigure şəbəkə kəşide nə mibu.

prefigure-annotations-not-rendered = `<graph>`: vaxti göstəriciyi PreFigure kor nə migirü, annotasiyaho kəşide nə mibu.

multiple-annotations-children = Ə `<graph>` çənd elementi fərzəndi `<annotations>` yoft bire; hər yəki qeyri əz oxirin nəzərə nə migirü.

## Referring to other components

copy-unrecognized-component-type = Tipi komponenti noşinos vəsi soxdən yo nusxə girdən nə mibu: { $type }.

copy-prop-not-found = Ə komponenti tipi { $component } xüsusiyəti { $property } yoft nəbü

collect-no-source = Bəroyi collect mənbə yoft nəbü.

collect-invalid-component-type = Çünki `<{ $component }>` tipi komponenti dürüs nist, komponenthoyi in tip cəm soxdən nə mibu.

reference-index-unavailable = Bə indeksi `{ $reference }` işorə soxdən nə mibu

## `<callAction>`

component-action-unavailable = Ə komponenti `{ $reference }` { $action } sədo soxdən nə mibu

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Şəkli məlumatho nodürüs. Durozhoyi sətirho cur nə miyo. Ə componentIdx :{ $componentIdx } yoft bire

data-frame-duplicate-column-names = Ə məlumatho nomhoyi sütuni təkrorbire hüst. Ə componentIdx :{ $componentIdx } yoft bire

data-frame-missing-column-name = Ə məlumatho yə nomi sütun nist. Ə componentIdx :{ $componentIdx } yoft bire

## `<answer>` and scoring
##
## `answer-max-num-attempts-in-section-wide-check-work` and
## `nested-section-wide-check-work-max-num-attempts` are omitted: both are
## long conditional explanations of where an attempt count is controlled, and
## they fall back to English.

answer-award-depends-on-own-response = Yə awardi in cavob bə cavobi xudi teqi answer fürüstire təkyə misozü; in bə rəftori gözlənilməz mibərə.

answer-attributes-need-symbolic-equality = Bi symbolicEquality atributhoyi { $attributes } tə'sir nə dorü.

answer-invalid-type = Tip bəroyi answer nodürüs: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Çünki komponenti `<{ $component }>` nom nə dorü, ənə atributi modul kor girde nə mibu

module-attribute-name-already-defined = Çünki tipi komponenti `<module>` xoli yə atributi "{ $name }" dorü, komponenti `<{ $component } name="{ $name }">` ənə atributi modul kor girde nə mibu.

conditional-content-condition-ignored = Ə komponenti `<conditionalContent>`-i ba elementhoyi fərzəndi case yo else atributi `condition` nəzərə nə migirü.

slider-markers-type-mismatch = Tipi nişunho ba tipi slayder cur nə miyo.

pretzel-problem-needs-statement-and-answer = pretzel nodürüs: hər `<problem>` gərək yə `<statement>` və yə `<answer>` dorü.

pretzel-circuit-first-problem-distractor = pretzel nodürüs: vaxti mode="circuit", `<problem>`-i əvvəlin distraktor bire nə mibu.

## Attribute values

attribute-invalid-values = Qiyməthoyi { $values } bəroyi atributi `{ $attribute }` nodürüs; nəzərə nə migirü.

attribute-must-be-references = Qiyməti `{ $value }` bəroyi atributi `{ $attribute }` nodürüs. Atribut gərək əz referenshoyi ba `$` sər soxdə düz bu.

## Building components from the source

component-type-invalid = Tipi komponent nodürüs: `<{ $componentType }>`

attribute-repeated = Atributi { $attribute } təkror soxdən nə mibu.

attribute-invalid-for-component = Atributi "{ $attribute }" bəroyi komponenti tipi `<{ $componentType }>` nodürüs.

## Style definition contrast
##
## `style-definition-insufficient-contrast`,
## `style-definition-dark-mode-text-background-contrast` and
## `style-definition-dark-mode-text-canvas-contrast` are omitted: each is a
## paragraph of conditional advice about deriving colours, and each falls back
## to English.

section-multiple-style-palettes = Yə bəxş təno yə <stylePalette> vəçide mibu; oxirin kor migirü.

## Unique variants

variant-num-to-select-not-non-negative-integer = Çünki numToSelect ədədi tomi qeyri-mənfi nist, varianthoyi yeganəyi { $component } təyin nə mibu.

variant-num-to-select-not-constant-number = Çünki numToSelect ədədi sobit nist, varianthoyi yeganəyi { $component } təyin nə mibu.

variant-with-replacement-not-constant-boolean = Çünki withReplacement qiyməti booleani sobit nist, varianthoyi yeganəyi { $component } təyin nə mibu.

variant-select-weight-disables-unique = Əgər yə variantdə selectWeight yo selectForVariants təyin bu, varianthoyi yeganə bəroyi select bastə mibu

variant-coprime-undetermined = Çünki təyin nəbü ki coprime hər vaxt duruğ, varianthoyi yeganəyi { $component } təyin nə mibu.

variant-attribute-not-constant = Çünki { $attribute } sobit nist, varianthoyi yeganəyi { $component } təyin nə mibu.

variant-attribute-not-number = Çünki { $attribute } ədəd nist, varianthoyi yeganəyi { $component } təyin nə mibu.

variant-attribute-wrong-type-for-sequence =
    Çünki { $attribute } { $expected ->
        [letters-combination] birləşməyi hərfho
        [math-expression] ifodəyi riyoziyi dürüs
        [integer] ədədi tom
       *[number] ədəd
    } nist, varianthoyi yeganəyi { $component }-i tipi { $type } təyin nə mibu.

variant-length-not-integer = Çünki length ədədi tom nist, varianthoyi yeganəyi { $component } təyin nə mibu.

variant-sort-not-implemented = Varianthoyi yeganəyi yə { $component }-i ba sort hənüz sozorə nəbü

variant-exclude-combinations-not-implemented = Varianthoyi yeganəyi yə { $component }-i ba excludeCombinations hənüz sozorə nəbü

variant-math-exclude-not-implemented = Varianthoyi yeganəyi yə { $component }-i tipi math ba exclude hənüz sozorə nəbü

variant-non-constant-exclude-not-implemented = Varianthoyi yeganəyi yə { $component }-i ba excludei qeyri-sobit hənüz sozorə nəbü

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ə göstəriciyi qrafiki prefigure dəstək nə migirü; elementi fərzənd ə kənor mund.

prefigure-descendant-invalid-geometry = { $subject }: həndəsə sonlu nist yo tomom nist; elementi fərzənd ə kənor mund.

prefigure-curve-label-omitted = { $subject }: ə elementhoyi əyriyi vogərdunde etiketho dəstək nə migirü; etiket ə kənor mund.

prefigure-curve-unsupported-definition-type = { $subject }: tipi tərifi funksiyayi əyriyi dəstəknəgirdə '{ $definitionType }'; elementi fərzənd ə kənor mund.

prefigure-region-flip-functions-unsupported = { $subject }: atributi flipFunctions ə səri regionBetweenCurves dəstək nə migirü; elementi fərzənd ə kənor mund.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves təno funksiyahoyi fərzəndi tipi formula dəstək migirü; elementi fərzənd ə kənor mund.

prefigure-label-position-unsupported =
    { $subject }: bəroyi { $labelKind ->
        [line-family] etiketi aeləyi xətt
       *[point] etiketi nüqtə
    } labelPosition '{ $labelPosition }' dəstək nə migirü; nizomi pişfərzi PreFigure kor migirü.

prefigure-fill-style-unsupported = { $subject }: stili puri '{ $fillStyle }' əz tərəfi PreFigure dəstək nə migirü; bə puri sodə vogərd mibu.

prefigure-line-style-unknown = { $subject }: stili xətti nomə'lumi '{ $lineStyle }' əz çıxışi PreFigure ə kənor mund.

prefigure-marker-style-mapped-to-diamond = { $subject }: stili nişuni '{ $markerStyle }' bə stili 'diamond'-i PreFigure cur ovorde bire.

prefigure-marker-style-unsupported = { $subject }: stili nişuni '{ $markerStyle }' əz tərəfi PreFigure dəstək nə migirü; stili pişfərz kor migirü.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` nodürüs; hədəf həll nə mibu. Annotasiya ə kənor mund.

annotation-ref-multiple-targets = `<annotation>`: `ref` bə çənd hədəf həll bire; hədəfi əvvəlin kor migirü.

annotation-ref-outside-graph = `<annotation>`: `ref` nodürüs; hədəf əz qrafiki ü-rə dorəndə xorici. Annotasiya ə kənor mund.

annotation-ref-unsupported-target = `<annotation>`: `ref` nodürüs; ə vogərdunəni prefigure hədəf obyekti qrafikiyi dəstəkbire nist. Annotasiya ə kənor mund.

annotation-text-missing = `<annotation>`: `text` nist yo xoli; mətni xoli çıxarde mibu.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Vobəstəgiyi dayirəyi yoft bire.
       *[other] Vobəstəgiyi dayirəyi ba komponenti `<{ $componentType }>` yoft bire.
    }

reference-no-referent = Bəroyi referens hədəf yoft nəbü: `{ $reference }`

reference-multiple-referents = Bəroyi referens çənd hədəf yoft bire: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Formati atributi { $attribute }-i `<{ $componentType }>` nodürüs.

children-invalid = Elementhoyi fərzəndi `<{ $componentType }>` nodürüs: elementhoyi fərzəndi nodürüs yoft bire: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Qiyməti `{ $value }` bəroyi atributi `{ $attribute }` nodürüs; qiyməti `{ $default }` kor migirü

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Versiyayi DoenetML { $version } yoft nəbü.
       *[other] Versiyayi DoenetML { $version } yoft nəbü. Bə versiyayi { $fallback } vogərd mibu
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML nodürüs: { $content }

parse-tag-missing-close-tag = DoenetML nodürüs: Teqi `{ $tag }` teqi bastəni nə dorü. Yə teqi xud-bastə yo yə teqi `</{ $tagName }>` gözlənirdi.

parse-tag-error = DoenetML nodürüs: Ə teqi `<{ $tagName }>` xəto hüst

parse-attribute-missing-value = DoenetML nodürüs: Ənə minümoyü ki atributi `{ $attribute }` qiymət nə dorü.

parse-attribute-invalid = DoenetML nodürüs: Atributi `{ $attribute }` nodürüs

parse-attribute-value-invalid = DoenetML nodürüs: Qiyməti atributi `{ $value }` nodürüs

parse-attribute-value-quote-mismatch = DoenetML nodürüs: Qiyməti atributi `{ $value }` nodürüs. Dırnaqho cur nə miyo. Ənə minümoyü ki yə `{ $quote }` nist

parse-open-tag-name-missing = DoenetML nodürüs: Teqi bi nomi teq yoft bire, məsələn `<`

parse-tag-not-closed = DoenetML nodürüs: Teqi `{ $tag }` bastə nəbü (ənə minümoyü ki yə `>` nist).

parse-self-closing-tag-name-missing = DoenetML nodürüs: Teqi bi nomi teq yoft bire `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML nodürüs: Teqi `{ $tag }` bastə nəbü (ənə minümoyü ki `/>` nist).

parse-tag-invalid-attributes = DoenetML nodürüs: Teqi `{ $tag }` dürüs nist. Şoyəd atributhoyi ü ğələt.

parse-close-tag-name-missing = DoenetML nodürüs: Teqi bastəni bi nomi teq yoft bire, məsələn `</`

parse-attribute-value-unquoted = Qiyməthoyi atribut gərək ə dərüni dırnaqho bu: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML nodürüs: Teqi bastəni `{ $tag }` yoft bire, əmmo teqi vokardəni ü nist

parse-close-tag-mismatched = DoenetML nodürüs: Teqi bastəni cur nə miyo. `</{ $expected }>` gözlənirdi. `{ $found }` yoft bire

parser-node-unconvertible = Düyümi { $node } bə düyümi Dast vogərdunde nəbü.

## Names

name-attribute-invalid =
    Atributi name='{ $name }' nodürüs. { $reason ->
        [characters] Ə nomho təno hərfho, rəqəmho, xətti zir yo defis mibu.
       *[start] Nomho gərək ba yə hərf sər bu.
    }

component-name-invalid-start = Nomi komponenti "{ $name }" nodürüs. Nomho gərək ba yə hərf sər bu.

## `<answer>` sugar

answer-video-watched-missing-video = Answeri tipi videoWatched gərək atributi video dorü

answer-video-watched-video-not-reference = Answeri tipi videoWatched gərək atributi videoyi ki referens bu dorü

answer-name-not-single-text = Atributi name-i answer gərək təno yə elementi fərzəndi mətni dorü

## Referencing another document

external-doenetml-recursion-limit = Çünki səviyəhoyi rekursiya xəyli ziyod, DoenetMLi xorici girde nə mibu. Şoyəd referensi dayirəyi hüst?

external-doenetml-unavailable = Əz { $attribute }="{ $uri }" DoenetML girde nə mibu

external-doenetml-type-mismatch = DoenetMLi əz { $attribute }="{ $uri }" girde bire nodürüs: ba tipi komponenti "{ $componentType }" cur nəmo

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atributi `{ $from }` əz kor mundə; ə coyi ü `{ $to }` kor bigir.
       *[other] [deprecation] Atributi `{ $from }` ə səri `<{ $component }>` əz kor mundə; ə coyi ü `{ $to }` kor bigir.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Çünki `{ $to }` həm təyin bire, atributi `{ $from }` əz kor mundə və nəzərə girde nəbü.
       *[other] [deprecation] Çünki `{ $to }` həm təyin bire, atributi `{ $from }` ə səri `<{ $component }>` əz kor mundə və nəzərə girde nəbü.
    }

deprecated-attribute-ignored = [deprecation] Atributi `{ $attribute }` ə səri `<{ $component }>` əz kor mundə və nəzərə nə migirü.

deprecated-attribute-to-child = [deprecation] Atributi `{ $attribute }` ə səri `<{ $component }>` əz kor mundə; ə coyi ü yə elementi fərzəndi `<{ $child }>` kor bigir.

deprecated-attribute-value-renamed = [deprecation] Qiyməti `{ $value }`-i atributi `{ $attribute }` ə səri `<{ $component }>` əz kor mundə; ə coyi ü `{ $to }` kor bigir.


## Language coverage

pluralize-english-only = Çünki `<pluralize>` təno sühunhoyi ingilisi cəm misozü, ə sənədi bə zuhuni { $locale } nüştəbire mətn bi dəyişmə mimundə. Şəkli cəm-rə rost binvis yo ba atributi `pluralForm` təyin sax.


## Checking against the schema

schema-element-unrecognized = Elementi `<{ $tag }>` elementi Doenet-i şinosbire nist.

schema-element-not-allowed-at-root = Elementi `<{ $tag }>` ə rişəyi sənəd icozə nə dorü.

schema-element-not-allowed-inside = Elementi `<{ $tag }>` ə dərüni `<{ $parent }>` icozə nə dorü.

schema-attribute-unrecognized = Elementi `<{ $tag }>` atributi ba nomi `{ $attribute }` nə dorü.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atributi `{ $attribute }`-i elementi `<{ $tag }>` gərək yə siyohi bu ki hər elementi ü yəki əz inho bu: { $allowed }
       *[other] Atributi `{ $attribute }`-i elementi `<{ $tag }>` gərək yəki əz inho bu: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nomi variant bəroyi select nodürüs. Nomi varianti { $variantName } ə { $numOptions } variant hüst, əmmo şümori vəçidəni { $numToSelect }.

select-variant-name-without-options = Bəroyi select variantho təyin bire, əmmo bəroyi nomi varianti mümküni { $variantName } hiç variant nist.

select-variant-name-not-possible = Nomi varianti { $variantName }-i bəroyi select təyinbire nomi varianti mümkün nist.

select-too-few-options = Əz təno { $numOptions } komponent { $numToSelect } komponent vəçide nə mibu.

select-from-sequence-too-few-values = Əz silsiləyi durozi { $length } { $numToSelect } qiymət vəçide nə mibu.

select-from-sequence-indices-count-mismatch = Şümori indekshoyi bəroyi select təyinbire gərək ba şümori vəçidəni cur biyo

select-from-sequence-indices-not-integers = Hər indeksi bəroyi select təyinbire gərək ədədi tom bu

select-from-sequence-index-excluded = Indeksi bəroyi selectfromsequence təyinbire əz xoricbirehora bire

select-from-sequence-indices-excluded-combination = Indekshoyi bəroyi selectfromsequence təyinbire yə birləşməyi xoricbire bire

select-from-sequence-coprime-not-positive-integers = Çünki ədədhoyi tomi müsbət vəçide nə mibu, birləşməhoyi coprime vəçide nə mibu.

select-from-sequence-coprime-common-factor = Ədədhoyi coprime vəçide nə mibu. Hər qiyməthoyi mümkün yə bölənde-i müştərək dorü. (Qiyməthoyi "from" yo "to"-i təyinbire gərək ba "step" coprime bu.)

select-from-sequence-coprime-single-number = Əz yə ədədi tənoyi ki 1 nist birləşməhoyi coprime vəçide nə mibu.

select-from-sequence-excluded-too-many-combinations = Ə selectFromSequence ziyodtər əz 70% birləşməho xoric bire

select-from-sequence-coprime-none-found = Ədədhoyi coprime vəçide nəbü. Hər qiyməthoyi mümkün yə bölənde-i müştərək dorü.

select-from-sequence-too-few-unique-values = Əz silsiləyi durozi { $numPossibleValues } { $numToSelect } qiyməti yeganə vəçide nə mibu

select-prime-numbers-too-few-values = Əz siyohiyi ədədhoyi sodəyi durozi { $numValues } { $numToSelect } qiymət vəçide nə mibu

select-prime-numbers-values-count-mismatch = Şümori qiyməthoyi bəroyi select təyinbire gərək ba şümori vəçidəni cur biyo

select-prime-numbers-values-not-prime = Hər qiyməti bəroyi select prime number təyinbire gərək ə siyohiyi ədədhoyi sodə bu

select-prime-numbers-values-excluded-combination = Qiyməthoyi bəroyi selectPrimeNumbers təyinbire yə birləşməyi xoricbire bire

select-prime-numbers-excluded-too-many-combinations = Ə selectPrimeNumbers ziyodtər əz 70% birləşməho xoric bire

select-random-combination-fluke = Ba yə ehtimoli xəyli kəm, birləşməyi qiyməthoyi təsodüfi vəçide nəbü

select-random-value-fluke = Ba yə ehtimoli xəyli kəm, qiyməti təsodüfi vəçide nəbü

## Inputs embedded in math
##
## `math-embedded-input-shape-unsuitable` is omitted: it is a four-branch
## explanation of why a control does not fit inside typeset mathematics, and
## it falls back to English.
