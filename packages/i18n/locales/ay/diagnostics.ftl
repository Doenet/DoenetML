# Aymara diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
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
# This is the file where Aymara's marking of knowledge source matters most,
# because these messages are all assertions about the author's document. The
# direct-knowledge «-wa» is written on them: the software read the source, so it
# reports at first hand. See `chrome.ftl`'s header for the whole of that decision.
#
# Aymara drops «-naka» after a numeral and its verbs do not agree with an
# inanimate subject's number, so a counted message whose only English difference
# is number renders one string here and the select is dropped. A comment marks
# each site.


## `<lineSegment>`

# No select: «-naka» is dropped after a count and the verb does not agree with
# the number of what is ignored, so one string covers both English categories.
# The count still arrives.
line-segment-attributes-ignored-with-endpoints = paya tukuyawi uchata ukhaxa { $attributes } janiwa katuqatakiti

line-segment-attributes-ignored-with-endpoint-and-midpoint = mä tukuyawi ukhamaraki mä taypi uchata ukhaxa { $attributes } janiwa katuqatakiti

line-segment-midpoint-offset-without-midpoint = midpointOffset janiwa kunas luriti taypi jan utjipana

## `<line>`

line-points-undetermined-dimensions = Jan yatita tupuni chimpunakat misturi siqi.

line-points-too-few-dimensions = Siqixa payat juk'ampi tupuni chimpunakata mistuñapawa.

line-points-depend-on-variables = Siqixa mayjt'irinakaru katuyasiri chimpunakat mistuwa: { $variables }.

line-equation-invalid-format = { $variable1 } ukhamaraki { $variable2 } mayjt'irinakana siqi kipkachawitaki jan aski uñnaqa.

## `<ray>`

ray-overprescribed-through = Wach'ixa through, endpoint ukhamaraki direction ukanakampiwa uchata.  Uchata through janiwa katuqatakiti.

ray-dimension-mismatch = Wach'ina numDimensions janiwa kipkakiti.

## `<vector>`

vector-overprescribed-head = Bektorexa head, tail ukhamaraki displacement ukanakampiwa uchata.  Uchata head janiwa katuqatakiti.

vector-dimension-mismatch = Bektorena numDimensions janiwa kipkakiti.

## Attracting and constraining

attract-to-without-nearest-point = Janiwa mä `<{ $component }>` markaru irpañ atkiti, nearestPoint utjiri jan utjipata.

constrain-to-without-nearest-point = Janiwa mä `<{ $component }>` markaru chinuñ atkiti, nearestPoint utjiri jan utjipata.

constrain-to-interior-without-nearest-point = Janiwa mä `<{ $component }>` manqharu chinuñ atkiti, nearestPoint utjiri jan utjipata.

## `<choiceInput>`

choice-input-label-position-ignored = jan inline choiceInput ukatakix labelPosition janiwa katuqatakiti

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput ukatakix uchata indices janiwa katuqatakiti, chimpu jakhuwixa choice wawanakana jakhuwipampi jan kipkapata.

pretzel-indices-count-mismatch = problem ukatakix uchata indices janiwa katuqatakiti, chimpu jakhuwixa problem wawanakana jakhuwipampi jan kipkapata.

shuffle-indices-count-mismatch = shuffle ukatakix uchata indices janiwa katuqatakiti, chimpu jakhuwixa chikatanakana jakhuwipampi jan kipkapata.

indices-ignored-out-of-range = { $component } ukatakix uchata indices janiwa katuqatakiti, yaqhip chimpunaka anqaxaru mistuta.

pretzel-indices-repeated = pretzel ukatakix uchata indices janiwa katuqatakiti, yaqhip chimpunaka payjata.

pretzel-circuit-first-index = circuit kastani pretzel ukatakix uchata indices janiwa katuqatakiti, nayrïri chimpuxa 1 uñstañapata.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` qillqa wawanakampi irnaqañapataki, mä `type` chimpu uchañamawa.

invalid-type-defaulting-to-math = { $component } chikatatakix { $type } kastaxa jan askiwa. math, text, number jan ukaxa boolean uñstañapawa. math uchatawa.

string-not-valid-component-to-arrange = "{ $value }" qillqaxa janiwa aski chikatäkiti { $component } luräwitaki. Janiwa katuqatakiti.

## Types and variables

invalid-type-defaulting-to-number = { $type } kastaxa jan askiwa, kastaxa number uchatawa.

invalid-variable-value = Mayjt'irina jan aski chani: `{ $value }`

## Variants

variant-index-must-be-number = { $index } mayja uñacha chimpuxa jakhuwïñapawa

variant-index-must-be-integer = { $index } mayja uñacha chimpuxa phuqata jakhuwïñapawa

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` janiwa phuqata tupunakataki luratakiti. Jaya tupunakaxa chikachatawa.

side-by-side-absolute-margins = `<{ $component }>` janiwa phuqata tupunakataki luratakiti. Jarphanakaxa chikachatawa.

side-by-side-no-block-child = Jan aski `<{ $component }>`: mä bloke wawanïñapawa.

## `<label>`

label-for-ignored-on-graphical = Uñachani `<label>` ukana `for` chimpuxa janiwa katuqatakiti.

label-for-must-resolve-to-one = `<label>` ukana `for` chimpuxa mä chikataruki uñtañapawa.

label-for-unresolved = `<label>` ukana `for` chimpuxa janiwa mä chikataru uñtañ atkanti.

label-for-answer-with-authored-inputs = `<label>` ukana `for` chimpuxa qillqirina uchata mantawinakani `<answer>` ukaru uñtawa; mantawiruki uñtayaña.

label-for-answer-without-input = `<label>` ukana `for` chimpuxa sutichañataki mantawi jan utjkiri `<answer>` ukaru uñtawa.

label-for-must-reference-input-or-answer = `<label>` ukana `for` chimpuxa mä mantawiru jan ukaxa mä jaysäwiru uñtañapawa.

## Accessibility

accessibility-short-description-or-decorative = Puriñataki, `<{ $component }>` ukax jisk'a qhanañchawinïñapawa jan ukaxa k'achachiriki satañapawa.

accessibility-video-short-description = Puriñataki, `<video>` ukax jisk'a qhanañchawinïñapawa.

accessibility-input-short-description-or-label = Puriñataki, `<{ $component }>` ukax jisk'a qhanañchawinïñapawa jan ukaxa sutinïñapawa.

accessibility-answer-input-short-description-or-label = Puriñataki, mantawi luriri mä `<answer>` ukax jisk'a qhanañchawinïñapawa jan ukaxa sutinïñapawa.

accessibility-short-description-contains-math = Jisk'a qhanañchawinakaxa janiwa `<{ $component }>` kipka jakhuwi chikatanaka apañapäkiti. Jakhuwixa arunakampi qillqaña.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ukax janiwa jaljawi suti qillqataki uñjaña chaninïkiti (ch'iyara uñacha) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 munasi).
       *[other] { $colorName } ukax janiwa jaljawi suti qillqataki uñjaña chaninïkiti ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 munasi).
    }

## `<circle>`

circle-through-points-non-numerical = Janira lurataki { $count } chimpunakat misturi `<circle>`, chimpunaka jakhuwi chaninï jan ukhaxa.

circle-too-many-through-points = Janiwa 3 chimpunakat juk'ampit misturi muruq'u jakhuñ atkiti.

circle-overprescribed-radius-center-points = Janiwa uchata tupu, taypi ukhamaraki chimpunakampi muruq'u jakhuñ atkiti.

circle-center-with-multiple-points = Janiwa uchata taypini ukhamaraki 1 chimputa juk'ampit misturi muruq'u jakhuñ atkiti.

circle-radius-too-small = Janiwa muruq'u jakhuñ atkiti: paya chimpuna jayapa { $distance } ukhamäpana, uchata tupu { $radius } jisk'aptawa.

circle-radius-with-many-points = Janiwa payat juk'ampi chimpunakat misturi muruq'u uchata tupumpi luräñ atkiti.

circle-invalid-center-or-through-points = Muruq'una taypipa jan ukaxa chimpunakapa jan askiwa.

circle-radius-center-with-multiple-points = Janiwa uchata taypini ukhamaraki 1 chimputa juk'ampit misturi muruq'una tupupa jakhuñ atkiti.

circle-change-radius-non-numerical = Janiwa jan jakhuwïri chimpunakat misturi muruq'una tupupa mayjt'ayañ atkiti

circle-radius-with-points-non-numerical = Janiwa mä chimputa juk'ampit misturi muruq'u uchata tupumpi luräñ atkiti, jakhuwi chaninaka jan utjipana.

circle-change-center-non-numerical = Janira lurataki jan jakhuwi chaninïri chimpunakat misturi muruq'una taypipa mayjt'ayaña.

## `<function>`

# Both selects dropped: «taypi» and «mantawi» take no plural suffix after a
# numeral, so English's four sentences are one here. Both counts still arrive and
# are still formatted.
function-domain-insufficient-dimensions = Funsyunana chiqapana tupupa janiwa phuqhakiti. Chiqaxa { $intervals } taypinïwa ukampisa funsyunaxa { $inputs } mantawinïwa.

function-domain-invalid-format = Funsyunana chiqapataki jan aski uñnaqa.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Funsyunana jan jakhuwi jach'apa janiwa katuqatakiti.
        [minimum] Funsyunana jan jakhuwi jisk'apa janiwa katuqatakiti.
        [extremum] Funsyunana jan jakhuwi tukuyawipa janiwa katuqatakiti.
        [point] Funsyunana jan jakhuwi chimpupa janiwa katuqatakiti.
        [slope] Funsyunana jan jakhuwi wint'upa janiwa katuqatakiti.
       *[other] Funsyunana jan jakhuwi { $type } janiwa katuqatakiti.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Funsyunana ch'usa jach'apa janiwa katuqatakiti.
        [minimum] Funsyunana ch'usa jisk'apa janiwa katuqatakiti.
        [extremum] Funsyunana ch'usa tukuyawipa janiwa katuqatakiti.
        [point] Funsyunana ch'usa chimpupa janiwa katuqatakiti.
       *[other] Funsyunana ch'usa { $type } janiwa katuqatakiti.
    }

function-points-too-close = Funsyunana paya chimpuxa jak'atapuniwa. Janiwa funsyun qhanañchañ atkiti.

# Both selects dropped, for the reason above.
function-iterates-input-output-mismatch = Funsyun payjawinakaxa mantawi jakhuwixa mistuwi jakhuwimpi kipkäpanaki atipxi. Aka funsyunaxa { $inputs } mantawinïwa ukhamaraki { $outputs } mistuwinïwa.

## `<sequence>`

sequence-invalid-length = Siqichawina jayapa jan askiwa.  Jan jisk'aptiri phuqata jakhuwïñapawa.

sequence-invalid-step = Siqichawina thakhipa jan askiwa.  { $type } kastani siqichawitakix jakhuwïñapawa.

sequence-invalid-endpoint-number = Jakhuwi siqichawina "{ $attribute }" jan askiwa.  Jakhuwïñapawa.

sequence-invalid-endpoint-letters = Qillqa siqichawina "{ $attribute }" jan askiwa.  Qillqa mayachawïñapawa.

sequence-invalid-endpoint = Siqichawina "{ $attribute }" jan askiwa.

select-from-sequence-coprime-not-numbers = coprime janiwa katuqatakiti, jan jakhuwinaka ajlliñata

select-from-sequence-coprime-with-exclude-combinations = coprime janiwa katuqatakiti, excludeCombinations uchatäxata

## Resolving a `target`

target-not-found = `<{ $source }>` ukatakix jan aski target: janiwa jikitkiti.

target-state-variable-not-found = `<{ $source }>` ukatakix jan aski target: mä `<{ $component }>` ukana "{ $property }" sutini utjiri janiwa jikitkiti.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` ukana mayjt'irinakapaxa sapa mayjt'irita mayjäñapawa.

ode-system-duplicate-variable-names = Janiwa ODE RHS funsyunanaka payjata mayjt'iri sutinakampi qhanañchañ atkiti.

ode-system-rhs-function-error = Janiwa ODE RHS funsyun qhanañchañ atkiti.  Pantjawi mathjs funsyun luräwina.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Janiwa { $count } siqinaka taypina k'uchu qhanañchañ atkiti

angle-invalid-through-point = `<angle>` ukana through ukana jan aski chimpu

parabola-vertex-too-many-points = Janira lurataki k'uchuni parabola 1 chimputa juk'ampit misturi.

parabola-too-many-points = Janira lurataki 3 chimpunakat juk'ampit misturi parabola.

intersection-too-many-items = Janira lurataki payat juk'ampi chikatanakataki jaljantawi

## Other math components

ionic-compound-not-two-ions = Janira lurataki mayacha ioniku paya iyonita yaqhataki.

ionic-compound-needs-cation-and-anion = Mayacha ionikuxa mä katiyunataki ukhamaraki mä aniyunatakiwa lurata.

solve-equations-cannot-evaluate = Janiwa kipkachawi askichañ atkiti, jan chaninchañ atisata: { $equation }

math-operators-operand-number-required = Mä jakhuwi luriri apsusaxa operandNumber uchañamawa.

eigen-decomposition-failed = Janiwa matrisana pachpa chaninakapa jakhuñ atkanti

## `<matchesPattern>`

# No select: «-naka» is dropped after a count and the verb does not agree, so both
# English categories are one string.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: { $parameters } tupuxa saltana janiwa uñstkiti, ukatwa ch'usampi taqi kutiwa kipkasini.

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" janiwa amuyt'añ atkiti. none, medium, dense, jan ukaxa mä ch'usampi jaljata paya jan jisk'aptiri jakhuwïñapawa, akhama grid="1 0.5". Janiwa siqi kata lurataki.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" janiwa prefigure uñachayirina katuqatakiti; kupi tuqi luräwi apnaqata.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" janiwa prefigure uñachayirina katuqatakiti; alaya tuqi luräwi apnaqata.

prefigure-invalid-axis-bounds = `<graph>`: prefigure mayjt'ayawitakix jan aski muyuri jarphanaka; nayra bbox apnaqata (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: prefigure mayjt'ayawitakix jan aski jaya tupu; nayra uñacha jaya tupu 425 apnaqata.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure mayjt'ayawitakix jan aski aspectRatio; nayra kipkachawi 1 apnaqata.

prefigure-grid-spacing-too-fine = `<graph>`: siqi katana jayapa juch'usaptawa muyuri jarphanakataki; siqi kataxa prefigure uñachayirina jaytatawa.

prefigure-annotations-not-rendered = `<graph>`: PreFigure uñachayiri jan apnaqata ukhaxa qillqa yapanakaxa janiwa uñachayatäkaniti.

multiple-annotations-children = `<graph>` ukana walja `<annotations>` wawanaka jikitawa; taqpachaxa janiwa katuqatakiti, tukuyawiruki.

## Referring to other components

copy-unrecognized-component-type = Janiwa jan uñt'ata kasta chikata jach'aptayañ jan ukaxa kupiyañ atkiti: { $type }.

copy-prop-not-found = Janiwa { $property } prop jikitkanti { $component } kastani mä chikatana

collect-no-source = collect ukatakix janiwa kuna phuqhawisa jikitkiti.

collect-invalid-component-type = Janiwa `<{ $component }>` kastani chikatanaka mayachañ atkiti, jan aski kastäxata.

reference-index-unavailable = Janiwa `{ $reference }` chimpuru uñtayañ atkiti

## `<callAction>`

component-action-unavailable = Janiwa { $action } `{ $reference }` chikatana jawsañ atkiti

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Yatiyawinakana uñnaqapa jan askiwa.  Siqinakana jayapa janiwa kipkakiti. Akana jikitawa componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Yatiyawinakana payjata sayt'iri sutinakawa utji.  Akana jikitawa componentIdx :{ $componentIdx }

data-frame-missing-column-name = Yatiyawinakana mä sayt'iri sutiwa pisiwi.  Akana jikitawa componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Aka jaysäwitaki mä award ukax jaysäwi tag pachpana apayata jaysäwiparu katuyasiwa, ukax jan suyt'ata luräwiruwa irpani.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` utjiri mä q'ipi manqhankiri `<answer>` ukaru `maxNumAttempts` uchañaxa janiwa kunas lurkiti, yant'a jakhuwixa q'ipina apnaqatäxata. `maxNumAttempts` ukax q'ipiru uchaña.

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` utjiri yaqha q'ipi manqhankiri `sectionWideCheckWork` utjiri mä q'ipiru `maxNumAttempts` uchañaxa janiwa kunas lurkiti, yant'a jakhuwixa anqaxa q'ipina apnaqatäxata. `maxNumAttempts` ukax anqaxa q'ipiru uchaña.

# No select: «chimpu» takes no plural suffix after a count and the verb does not
# agree with it.
answer-attributes-need-symbolic-equality = { $attributes } chimpuxa janiwa kunas lurkaniti symbolicEquality jan uchata ukhaxa.

answer-invalid-type = Jaysäwitakix jan aski kasta: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` chikataxa jan sutinïpata, janiwa module chimputaki apnaqañ atkiti

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` chikataxa janiwa module ukatakix chimpu kipka apnaqañ atkiti, `<module>` kasta chikataxa "{ $name }" chimpu uñstayatäxpanawa.

conditional-content-condition-ignored = case jan ukaxa else wawanakani `<conditionalContent>` chikatana `condition` chimpuxa janiwa katuqatakiti.

slider-markers-type-mismatch = Chimpu kastaxa slider kastampi janiwa kipkakiti.

pretzel-problem-needs-statement-and-answer = Jan aski pretzel: sapa `<problem>` mä `<statement>` ukhamaraki mä `<answer>` apañapawa.

pretzel-circuit-first-problem-distractor = Jan aski pretzel: mode="circuit" ukana, nayrïri `<problem>` janiwa pantjayiriti.

## Attribute values

# No select: «chani» takes no plural suffix after a count.
attribute-invalid-values = `{ $attribute }` chimputakix { $values } chani jan askiwa; janiwa katuqatakiti.

attribute-must-be-references = `{ $attribute }` chimputakix `{ $value }` chani jan askiwa. Chimpuxa `$` ukampi qalltiri uñtawinakat lurata uñstañapawa.

math-input-invalid-function-names = <mathInput>: { $attribute } ukana jan aski funsyun sutinaka janiwa katuqatakiti: { $names }. Sapa sutina uñachayawi t'aqapaxa payat juk'ampi qillqanïñapawa (qillqanaka jan ukaxa jaya chimpunaka); mä munañani `|<mathspeak alternative>` qhipa uchañaxa jutaspawa.

## Building components from the source

component-type-invalid = Jan aski kasta chikata: `<{ $componentType }>`

attribute-repeated = Janiwa { $attribute } chimpu payjañ atkiti.

attribute-invalid-for-component = `<{ $componentType }>` kastani mä chikatatakix "{ $attribute }" chimpu jan askiwa.

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } uñnaqa qhanañchawixa janiwa uñjaña chaninïkiti { $context ->
        [text-on-background] qillqa saminti laphi samimpi
        [high-contrast] jach'a uñjaña sami kanwasampi
        [line] siqi sami kanwasampi
        [marker] chimpu sami kanwasampi
       *[text-on-canvas] qillqa sami kanwasampi
    }{ $mode ->
        [dark] { " (ch'iyara uñacha)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 munasi).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } uñnaqa qhanañchawixa qhana uñachataki aski uñjaña chanini saminaka uchawayi, ukampisa uka chaninakat mistuyata ch'iyara uñacha saminakaxa janiwa qillqa saminti laphi samimpi uñjaña chaninïkiti ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 munasi). { $suggestion ->
        [available] Ch'iyara uñachana uñjaña chani utjañapataki, qhana uñacha uñjaña chani jach'aptayaña (akhama, { $lightAttribute }="{ $lightColor }" uchaña) jan ukaxa ch'iyara uñacha sami mayjt'ayaña (akhama, { $darkAttribute }="{ $darkColor }" uchaña).
       *[none] Ch'iyara uñachana uñjaña chani utjañapataki, qhana uñacha uñjaña chani jach'aptayaña jan ukaxa mistuyata saminaka textColorDarkMode ukhamaraki/jan ukaxa backgroundColorDarkMode ukampi mayjt'ayaña.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } uñnaqa qhanañchawixa qhana uñachataki aski uñjaña chanini qillqa sami uchawayi, ukampisa uka chanit mistuyata ch'iyara uñacha qillqa samixa janiwa kanwasampi uñjaña chaninïkiti ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 munasi). { $suggestion ->
        [available] Ch'iyara uñachana uñjaña chani utjañapataki, qhana uñacha uñjaña chani jach'aptayaña (akhama, textColor="{ $lightColor }" uchaña) jan ukaxa ch'iyara uñacha sami mayjt'ayaña (akhama, textColorDarkMode="{ $darkColor }" uchaña).
       *[none] Ch'iyara uñachana uñjaña chani utjañapataki, qhana uñacha uñjaña chani jach'aptayaña jan ukaxa mistuyata sami textColorDarkMode ukampi mayjt'ayaña.
    }

section-multiple-style-palettes = Mä jaljawixa mä <stylePalette> ukiwa ajlliñ atipxi; tukuyawiwa apnaqata.

## Unique variants

variant-num-to-select-not-non-negative-integer = janiwa { $component } ukana sapa mayja uñachanakapa yatiñ atkiti, numToSelect jan jisk'aptiri phuqata jakhuwi jan ukhamäxata.

variant-num-to-select-not-constant-number = janiwa { $component } ukana sapa mayja uñachanakapa yatiñ atkiti, numToSelect jan kipka jakhuwi ukhamäxata.

variant-with-replacement-not-constant-boolean = janiwa { $component } ukana sapa mayja uñachanakapa yatiñ atkiti, withReplacement jan kipka boolean ukhamäxata.

variant-select-weight-disables-unique = select ukatakix sapa mayja uñachanakaxa jist'antatawa, selectWeight jan ukaxa selectForVariants uchata ajlliwi utjipana

variant-coprime-undetermined = janiwa { $component } ukana sapa mayja uñachanakapa yatiñ atkiti, coprime taqi kuti k'ari ukhamäxpacha jan yatisata.

variant-attribute-not-constant = janiwa { $component } ukana sapa mayja uñachanakapa yatiñ atkiti, { $attribute } jan kipkäxata.

variant-attribute-not-number = janiwa { $component } ukana sapa mayja uñachanakapa yatiñ atkiti, { $attribute } jan jakhuwïxata.

variant-attribute-wrong-type-for-sequence =
    janiwa { $type } kastani { $component } ukana sapa mayja uñachanakapa yatiñ atkiti, { $attribute } jan { $expected ->
        [letters-combination] qillqa mayachawi
        [math-expression] aski jakhuwi aru
        [integer] phuqata jakhuwi
       *[number] jakhuwi
    } ukhamäxata.

variant-length-not-integer = janiwa { $component } ukana sapa mayja uñachanakapa yatiñ atkiti, length jan phuqata jakhuwïxata.

variant-sort-not-implemented = janira lurataki sort utjiri mä { $component } ukana sapa mayja uñachanakapa

variant-exclude-combinations-not-implemented = janira lurataki excludeCombinations utjiri mä { $component } ukana sapa mayja uñachanakapa

variant-math-exclude-not-implemented = janira lurataki math kastani mä { $component } ukana exclude utjiri sapa mayja uñachanakapa

variant-non-constant-exclude-not-implemented = janira lurataki jan kipka exclude utjiri mä { $component } ukana sapa mayja uñachanakapa

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: janiwa graph prefigure uñachayirina katuqatakiti; wawapa jaytatawa.

prefigure-descendant-invalid-geometry = { $subject }: jan tukuyata jan ukaxa jan phuqata tupu uñnaqa; wawapa jaytatawa.

prefigure-curve-label-omitted = { $subject }: mayjt'ayata q'iwi chikatanakana sutinakaxa janiwa katuqatakiti; sutipa jaytatawa.

prefigure-curve-unsupported-definition-type = { $subject }: q'iwi funsyun qhanañchawi kasta '{ $definitionType }' janiwa katuqatakiti; wawapa jaytatawa.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves ukana flipFunctions chimpuxa janiwa katuqatakiti; wawapa jaytatawa.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves ukanx formula kastani funsyun wawanakakiwa katuqata; wawapa jaytatawa.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] siqi ayllu suti
       *[point] chimpu suti
    } ukatakix labelPosition '{ $labelPosition }' janiwa katuqatakiti; nayra PreFigure chiqanchawi apnaqata.

prefigure-fill-style-unsupported = { $subject }: PreFigure janiwa '{ $fillStyle }' phuqhawi uñnaqa katuqkiti; phuqata phuqhawiruwa kutti.

prefigure-line-style-unknown = { $subject }: jan uñt'ata siqi uñnaqa '{ $lineStyle }' PreFigure mistuwita jaytatawa.

prefigure-marker-style-mapped-to-diamond = { $subject }: chimpu uñnaqa '{ $markerStyle }' PreFigure 'diamond' uñnaqaru chiqanchatawa.

prefigure-marker-style-unsupported = { $subject }: PreFigure janiwa '{ $markerStyle }' chimpu uñnaqa katuqkiti; nayra uñnaqa apnaqata.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: jan aski `ref`; janiwa amtata jikiñ atkiti. Qillqa yapaxa jaytatawa.

annotation-ref-multiple-targets = `<annotation>`: `ref` walja amtatanakaruwa puri; nayrïri amtataxa apnaqata.

annotation-ref-outside-graph = `<annotation>`: jan aski `ref`; amtataxa graph anqaxankiwa. Qillqa yapaxa jaytatawa.

annotation-ref-unsupported-target = `<annotation>`: jan aski `ref`; amtataxa janiwa prefigure mayjt'ayawina katuqata uñacha chikatäkiti. Qillqa yapaxa jaytatawa.

annotation-text-missing = `<annotation>`: `text` pisiwi jan ukaxa ch'usawa; ch'usa qillqa uchatawa.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Muyuri katuyasiwi jikitawa.
       *[other] `<{ $componentType }>` chikatampi muyuri katuyasiwi jikitawa.
    }

reference-no-referent = Aka uñtawitaki janiwa kunasa jikitkiti: `{ $reference }`

reference-multiple-referents = Aka uñtawitaki waljawa jikitawa: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` ukana { $attribute } chimputakix jan aski uñnaqa.

children-invalid = `<{ $componentType }>` ukatakix jan aski wawanaka: jan aski wawanaka jikitawa: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` chimputakix `{ $value }` chani jan askiwa, `{ $default }` chaniwa apnaqata

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } janiwa jikitkiti.
       *[other] DoenetML { $version } janiwa jikitkiti. { $fallback } ukaruwa kutti
    }

## Reading the DoenetML

parse-invalid-doenetml = Jan aski DoenetML: { $content }

parse-tag-missing-close-tag = Jan aski DoenetML: `{ $tag }` tag ukax jan jist'antiri tagnïkiti. Pachpa jist'antasiri tag jan ukaxa mä `</{ $tagName }>` tag suyt'atawa.

parse-tag-error = Jan aski DoenetML: `<{ $tagName }>` tag ukana pantjawi

parse-attribute-missing-value = Jan aski DoenetML: Jan aski `{ $attribute }` chimpuxa chani pisiwi ukhamawa.

parse-attribute-invalid = Jan aski DoenetML: `{ $attribute }` chimpu jan askiwa

parse-attribute-value-invalid = Jan aski DoenetML: `{ $value }` chimpu chani jan askiwa

parse-attribute-value-quote-mismatch = Jan aski DoenetML: `{ $value }` chimpu chani jan askiwa. Aru chimpunakaxa janiwa kipkakiti. Mä `{ $quote }` pisitaskiwa

parse-open-tag-name-missing = Jan aski DoenetML: Jan sutini tag jikitawa, akhama `<`

parse-tag-not-closed = Jan aski DoenetML: `{ $tag }` tag janiwa jist'antatäkanti (mä `>` pisitaskiwa).

parse-self-closing-tag-name-missing = Jan aski DoenetML: Jan sutini tag jikitawa `<{ $content }>`

parse-self-closing-tag-not-closed = Jan aski DoenetML: `{ $tag }` tag janiwa jist'antatäkanti (`/>` pisitaskiwa).

parse-tag-invalid-attributes = Jan aski DoenetML: `{ $tag }` tag jan askiwa. Jan aski chimpunakanïspawa.

parse-close-tag-name-missing = Jan aski DoenetML: Jan sutini jist'antiri tag jikitawa, akhama `</`

parse-attribute-value-unquoted = Chimpu chaninakaxa aru chimpunaka taypina uñstañapawa: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Jan aski DoenetML: `{ $tag }` jist'antiri tag jikitawa, ukampisa janiwa kipkachiri jist'ariri tag utjkiti

parse-close-tag-mismatched = Jan aski DoenetML: Jist'antiri tag janiwa kipkakiti. `</{ $expected }>` suyt'atawa. `{ $found }` jikitawa

parser-node-unconvertible = Janiwa { $node } muqu Dast muquru mayjt'ayañ atkanti.

## Names

name-attribute-invalid =
    Jan aski name='{ $name }' chimpu. { $reason ->
        [characters] Sutinakaxa qillqanakaki, jakhuwinakaki, aynacha jaljawinakaki jan ukaxa jaya chimpunakaki apañapawa.
       *[start] Sutinakaxa mä qillqampi qalltañapawa.
    }

component-name-invalid-start = Jan aski "{ $name }" chikata suti. Sutinakaxa mä qillqampi qalltañapawa.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched kastani jaysäwixa mä video chimpunïñapawa

answer-video-watched-video-not-reference = videoWatched kastani jaysäwixa mä uñtawi ukhamäri video chimpunïñapawa

answer-name-not-single-text = Jaysäwina name chimpupaxa mä qillqa wawakiwa apañapa

## Referencing another document

external-doenetml-recursion-limit = Janiwa anqaxa DoenetML katuqañ atkanti, walja payjawi patanakäxata. ¿Mä muyuri uñtawiwa utjiti?

external-doenetml-unavailable = Janiwa { $attribute }="{ $uri }" ukat DoenetML katuqañ atkanti

external-doenetml-type-mismatch = { $attribute }="{ $uri }" ukat jan aski DoenetML katuqata: janiwa "{ $componentType }" kasta chikatampi kipkakanti

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` chimpuxa nayraptawa; `{ $to }` apnaqaña.
       *[other] [deprecation] `<{ $component }>` ukana `{ $from }` chimpuxa nayraptawa; `{ $to }` apnaqaña.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` chimpuxa nayraptawa ukhamaraki janiwa katuqatakiti, `{ $to }` ukax uchatäxata.
       *[other] [deprecation] `<{ $component }>` ukana `{ $from }` chimpuxa nayraptawa ukhamaraki janiwa katuqatakiti, `{ $to }` ukax uchatäxata.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` ukana `{ $attribute }` chimpuxa nayraptawa ukhamaraki janiwa katuqatakiti.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` ukana `{ $attribute }` chimpuxa nayraptawa; mä `<{ $child }>` wawa apnaqaña.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` ukana `{ $attribute }` chimpuna `{ $value }` chanipaxa nayraptawa; `{ $to }` apnaqaña.


## Language coverage

pluralize-english-only = `<pluralize>` ukax inglés arukiwa waljaptayañ atipxi, ukatwa qillqapaxa { $locale } aruna qillqata qillqana kipkakiwa jaytata. Walja uñnaqa pachpa qillqaña, jan ukaxa `pluralForm` chimpumpi uchaña.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` chikataxa janiwa uñt'ata Doenet chikatäkiti.

schema-element-not-allowed-at-root = `<{ $tag }>` chikataxa janiwa qillqana saphipana jaytatäkiti.

schema-element-not-allowed-inside = `<{ $tag }>` chikataxa janiwa `<{ $parent }>` manqhana jaytatäkiti.

schema-attribute-unrecognized = `<{ $tag }>` chikataxa janiwa `{ $attribute }` sutini chimpunïkiti.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` chikatana `{ $attribute }` chimpupaxa mä siqïñapawa, sapa chikatapa akanakat mäni: { $allowed }
       *[other] `<{ $tag }>` chikatana `{ $attribute }` chimpupaxa akanakat mänïñapawa: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select ukatakix jan aski mayja uñacha suti.  { $variantName } mayja uñacha sutixa { $numOptions } ajlliwinakana uñstiwa ukampisa ajlliña jakhuwixa { $numToSelect }.

select-variant-name-without-options = select ukatakix yaqhip mayja uñachanakawa uchata ukampisa aka atipiri mayja uñacha sutitakix janiwa ajlliwinaka uchatäkiti: { $variantName }.

select-variant-name-not-possible = select ukatakix uchata { $variantName } mayja uñacha sutixa janiwa atipiri mayja uñacha sutïkiti.

select-too-few-options = Janiwa { $numToSelect } chikatanaka { $numOptions } ukatakit ajlliñ atkiti.

select-from-sequence-too-few-values = Janiwa { $numToSelect } chaninaka { $length } jayani siqichawit ajlliñ atkiti.

select-from-sequence-indices-count-mismatch = select ukatakix uchata indices jakhuwixa ajlliña jakhuwimpi kipkäñapawa

select-from-sequence-indices-not-integers = select ukatakix uchata taqi indices phuqata jakhuwïñapawa

select-from-sequence-index-excluded = selectfromsequence ukana uchata chimpuxa jaytatänwa

select-from-sequence-indices-excluded-combination = selectfromsequence ukana uchata chimpunakaxa jaytata mayachawïnwa

select-from-sequence-coprime-not-positive-integers = Janiwa coprime mayachawinaka ajlliñ atkiti, jan jisk'aptiri phuqata jakhuwinaka jan ajllisata.

select-from-sequence-coprime-common-factor = Janiwa coprime jakhuwinaka ajlliñ atkiti. Taqi atipiri chaninakaxa mä kipka luririwa apxi. (Uchata "from" jan ukaxa "to" chaninakaxa "step" ukampi coprime uñstañapawa.)

select-from-sequence-coprime-single-number = Janiwa coprime mayachawinaka jan 1 ukhamäri mä jakhuwit ajlliñ atkiti.

select-from-sequence-excluded-too-many-combinations = selectFromSequence ukana mayachawinakat 70% juk'ampiwa jaytata

select-from-sequence-coprime-none-found = Janiwa coprime jakhuwinaka ajlliñ atkanti. Taqi atipiri chaninakaxa mä kipka luririwa apxi.

select-from-sequence-too-few-unique-values = Janiwa { $numToSelect } sapa chaninaka { $numPossibleValues } jayani siqichawit ajlliñ atkiti

select-prime-numbers-too-few-values = Janiwa { $numToSelect } chaninaka { $numValues } jayani primu jakhuwi siqit ajlliñ atkiti

select-prime-numbers-values-count-mismatch = select ukatakix uchata chaninaka jakhuwixa ajlliña jakhuwimpi kipkäñapawa

select-prime-numbers-values-not-prime = select primu jakhuwitakix uchata taqi chaninakaxa primu jakhuwi siqinankañapawa

select-prime-numbers-values-excluded-combination = selectPrimeNumbers ukana uchata chaninakaxa jaytata mayachawïnwa

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers ukana mayachawinakat 70% juk'ampiwa jaytata

select-random-combination-fluke = Wali jan atipiri kutimpi, janiwa jan yatita chaninakana mayachawipa ajlliñ atkanti

select-random-value-fluke = Wali jan atipiri kutimpi, janiwa jan yatita chani ajlliñ atkanti
