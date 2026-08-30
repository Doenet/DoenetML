# Mískito diagnostics: the errors and warnings the core and the parser report
# about a document. Translated from `locales/en/diagnostics.ftl`, which is the
# source of truth.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The standard Latin orthography of the Nicaraguan Caribbean
# coast; see `chrome.ftl`'s header for the alphabet, `ng`, the `aw`/`ai`
# diphthongs and the pronounced `h`. `c`, `f`, `g`, `j`, `q`, `v`, `x` and `z`
# are not in the alphabet, and that constraint governs every loan here: `k`
# does the work of `c` and `qu` («kompanenti», «kalkulaia», «kwut»), `p` the
# work of `f` («pormatka», «paktar», «porsentu»), `b` the work of `v`
# («balur», «bariabil», «bektar»), `h` the work of `j` and of Spanish `g`
# before a front vowel («heometria», «marhin»), and `s` the work of `z` and of
# `c` before `e`/`i` («definision», «interseksion»). DoenetML identifiers —
# element and attribute names, enumerated values, `mathjs`, `PreFigure`,
# `styleNumber`, `[deprecation]` — are not Mískito words and keep their own
# spelling; where English wrote one as bare prose this file puts it in
# backticks so a reader can see it is a name and not a word.
#
# **Number.** `Intl.PluralRules` has no CLDR data for `miq`; it falls back to
# the default locale and reports `one` and `other`, categories Mískito does not
# select. A Mískito noun after a numeral takes no plural marker, so every
# counted message English splits into `[one]`/`[other]` — the `$attributesCount`,
# `$valuesCount`, `$parametersCount`, `$intervals`, `$inputs`, `$outputs`,
# `$found` and `$count` selects — is **one unselected form** here. The selects
# on `$type`, `$mode`, `$context`, `$reason`, `$suggestion`, `$labelKind`,
# `$expected`, `$isList`, `$fallback`, `$component`, `$componentType`,
# `$alternative`, `$span` and `$location` are not plural selects and keep every
# branch English writes, with English's branch keys.
#
# **Loans.** These are sentences, not terminology, so the frame is Mískito
# throughout — «pain apia» for *invalid*, «sip apia» for *cannot*, «kaia sa»
# for *must be*, «swisa» for *ignoring*, «sakan apia» for *not found*, «daukan
# apia sin» for *has not been implemented*, the postposition «ra», the
# conjunction «bara», the disjunction «apia kaka», and SOV order. The technical
# nouns inside that frame are loans, mostly through Spanish: «atributu»,
# «kompanenti», «balur», «nambar», «bektar», «bariabil», «bariant», «lain»,
# «puntu», «sirkulu», «rehion», «punsion», «ekwasion», «ekspresion»,
# «parametru», «matris», «awtobalur», «sekwensia», «enteru», «larkuka»,
# «pormatka», «paktar», «heometria», «interseksion», «anklu»,
# «parabula», «bertis», «kolorka», «kontrast», «estilu», «propiedad»,
# «porsentu», «marhin», «lista», «Inglis». From English: «stet bariabilka»,
# «rindarar», «tak», «raw», «kolum», «wid», «boks», «baks», «kanbas»,
# «bakrawn», «lait mode», «dark mode», «praim», «kwut mark», «kontena»,
# «trai», «snipet», «krid», «distraktor».
#
# **Confidence.** All 220 messages are translated. One place loses a
# distinction English draws, because the branch keys were `[one]` and
# `[other]` on something that is not a count Mískito can mark: every message
# that named an input, output, interval, attribute, value or parameter count
# says it once rather than twice. `field-function-wrong-num-outputs` is not
# one of them any more — it names both the slope field and the vector field,
# so a reader whose function needs one output is told about one output. The
# weakest single words are «awtobalur» for *eigenvalue*, «heometria» for
# *geometry* and «stet bariabilka» for *state variable*; none of the three is
# said in Mískito outside a sentence like this one, and a speaker should feel
# free to replace them.


line-segment-attributes-ignored-with-endpoints = Tnata puntu wal marikan taim, { $attributes } ba swisa
line-segment-attributes-ignored-with-endpoint-and-midpoint = Tnata puntu kum wal tila puntu kum marikan taim, { $attributes } ba swisa
line-segment-midpoint-offset-without-midpoint = midpointOffset ba tila puntu apu kaka warkka daukras
line-points-undetermined-dimensions = Lain ba puntu nani ai dimensionka sakan apia ba ra luisa.
line-points-too-few-dimensions = Lain ba puntu nani dimension wal apia kaka kau brisa ba ra luaia sa.
line-points-depend-on-variables = Lain ba puntu nani bariabil nani ra mangki ba ra luisa: { $variables }.
line-equation-invalid-format = { $variable1 } wal { $variable2 } bariabil nani wal lain ekwasionka pormatka pain apia.
ray-overprescribed-through = Rayu ba through, endpoint bara direction ni marikan.  through marikan ba swisa.
ray-dimension-mismatch = Rayu ra numDimensions ba praki apia.
vector-overprescribed-head = Bektar ba head, tail bara displacement ni marikan.  head marikan ba swisa.
vector-dimension-mismatch = Bektar ra numDimensions ba praki apia.
attract-to-without-nearest-point = `<{ $component }>` ra alkaia sip apia, kan witin nearestPoint stet bariabilka apu.
constrain-to-without-nearest-point = `<{ $component }>` ra taibaia sip apia, kan witin nearestPoint stet bariabilka apu.
constrain-to-interior-without-nearest-point = `<{ $component }>` bilara taibaia sip apia, kan witin nearestPoint stet bariabilka apu.
choice-input-label-position-ignored = labelPosition ba inline apia choiceInput dukiara swisa
choice-input-indices-count-mismatch = choiceInput dukiara indices marikan ba swisa, kan indices nambarka ba `choice` luhpia nambarka wal praki apia.
pretzel-indices-count-mismatch = problem dukiara indices marikan ba swisa, kan indices nambarka ba `problem` luhpia nambarka wal praki apia.
shuffle-indices-count-mismatch = shuffle dukiara indices marikan ba swisa, kan indices nambarka ba kompanenti nambarka wal praki apia.
indices-ignored-out-of-range = { $component } dukiara indices marikan ba swisa, kan indices kum kum ba tnata luan.
pretzel-indices-repeated = pretzel dukiara indices marikan ba swisa, kan indices kum kum ba kli ulban.
pretzel-circuit-first-index = `circuit` mode ra pretzel dukiara indices marikan ba swisa, kan indices pas ba 1 kaia sa.
string-children-need-type = `<{ $component }>` ba `string` luhpia nani wal warkka daukaia dukiara, `type` atributu kum marikaia sa.
invalid-type-defaulting-to-math = { $component } kompanenti dukiara { $type } tipka pain apia. math, text, number apia kaka boolean kaia sa. math ra mangkisa.
string-not-valid-component-to-arrange = String "{ $value }" ba { $component } daukaia dukiara kompanenti pain kum apia sa. Swisa.
invalid-type-defaulting-to-number = { $type } tipka pain apia, tipka ba number ra mangkisa.
invalid-variable-value = Bariabil kum balurka pain apia: `{ $value }`
variant-index-must-be-number = Bariant `index` { $index } ba nambar kum kaia sa
variant-index-must-be-integer = Bariant `index` { $index } ba enteru kum kaia sa
side-by-side-absolute-widths = `<{ $component }>` ba absolute paskanka dukiara daukan apia sin. Wid nani ba `relative` ra mangkisa.
side-by-side-absolute-margins = `<{ $component }>` ba absolute paskanka dukiara daukan apia sin. Marhin nani ba `relative` ra mangkisa.
side-by-side-no-block-child = `<{ $component }>` pain apia: block luhpia kum kau brih kaia sa.
label-for-ignored-on-graphical = Krapiku `<label>` ra `for` atributu ba swisa.
label-for-must-resolve-to-one = `<label>` ra `for` atributu ba kompanenti kumi baman ra praki kaia sa.
label-for-unresolved = `<label>` ra `for` atributu ba kompanenti kum ra praki sip apia kan.
label-for-answer-with-authored-inputs = `<label>` ra `for` atributu ba `<answer>` kum ra riparens munisa, bara baha ansa ba input nani ulban brisa; input ba ra sirpi riparens muns.
label-for-answer-without-input = `<label>` ra `for` atributu ba `<answer>` kum ra riparens munisa, bara baha ansa ba nina mangkaia input kum apu.
label-for-must-reference-input-or-answer = `<label>` ra `for` atributu ba input kum apia kaka answer kum ra riparens munaia sa.
accessibility-short-description-or-decorative = Aksesibilidad dukiara, `<{ $component }>` ba tanka kunhka kum brih kaia sa, apia kaka `decorative` baku marikan kaia sa.
accessibility-video-short-description = Aksesibilidad dukiara, `<video>` ba tanka kunhka kum brih kaia sa.
accessibility-input-short-description-or-label = Aksesibilidad dukiara, `<{ $component }>` ba tanka kunhka kum apia kaka label kum brih kaia sa.
accessibility-answer-input-short-description-or-label = Aksesibilidad dukiara, `<answer>` kum input kum paski ba tanka kunhka kum apia kaka label kum brih kaia sa.
accessibility-short-description-contains-math = Tanka kunhka nani ba `<{ $component }>` baku matematika kompanenti nani briaia apia sa. Matematika ba bila nani ni aisi.
accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ba seksion tailka bila dukiara kontrast pain apia brisa (dark mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 kau kaia sa).
       *[other] { $colorName } ba seksion tailka bila dukiara kontrast pain apia brisa ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 kau kaia sa).
    }
circle-through-points-non-numerical = Puntu { $count } ra luan `<circle>` ba daukan apia sin, puntu nani nambar balurka apu kaka.
circle-too-many-through-points = Puntu 3 purara luan sirkulu kum kalkulaia sip apia.
circle-overprescribed-radius-center-points = Radius, senter bara luan puntu nani marikan ba wal sirkulu kalkulaia sip apia.
circle-center-with-multiple-points = Senter marikan wal puntu kumi purara luan sirkulu kalkulaia sip apia.
circle-radius-too-small = Sirkulu ba kalkulaia sip apia: puntu wal tila ba { $distance } sa kaka, radius marikan { $radius } ba sirpi pali sa.
circle-radius-with-many-points = Radius marikan wal puntu wal purara luan sirkulu kum paskaia sip apia.
circle-invalid-center-or-through-points = Sirkulu senterka apia kaka luan puntu nani pain apia.
circle-radius-center-with-multiple-points = Senter marikan wal puntu kumi purara luan sirkulu radiuska kalkulaia sip apia.
circle-change-radius-non-numerical = Nambar apia luan puntu nani brisa sirkulu radiuska lakaia sip apia
circle-radius-with-points-non-numerical = Nambar balurka apu kaka, radius marikan wal puntu kumi purara luan sirkulu paskaia sip apia.
circle-change-center-non-numerical = Nambar apia balur brisa puntu nani ra luan sirkulu senterka lakaia ba daukan apia sin.
function-domain-insufficient-dimensions = Punsion domainka dukiara dimension ba kau apu. Domain ba interbalu { $intervals } brisa, sakuna punsion ba input { $inputs } brisa.
function-domain-invalid-format = Punsion domainka pormatka pain apia.
function-ignoring-non-numerical =
    { $type ->
        [maximum] Punsion ai maximum nambar apia ba swisa.
        [minimum] Punsion ai minimum nambar apia ba swisa.
        [extremum] Punsion ai extremum nambar apia ba swisa.
        [point] Punsion ai puntu nambar apia ba swisa.
        [slope] Punsion ai slope nambar apia ba swisa.
       *[other] Punsion ai { $type } nambar apia ba swisa.
    }
function-ignoring-empty =
    { $type ->
        [maximum] Punsion ai maximum bila apu ba swisa.
        [minimum] Punsion ai minimum bila apu ba swisa.
        [extremum] Punsion ai extremum bila apu ba swisa.
        [point] Punsion ai puntu bila apu ba swisa.
       *[other] Punsion ai { $type } bila apu ba swisa.
    }
function-points-too-close = Punsion ba puntu wal pat baku kau tila apu brisa. Punsion ba paskaia sip apia.
function-iterates-input-output-mismatch = Punsion iterates nani ba punsion input nambarka wal output nambarka aikuki kaka baman sip sa. Naha punsion ba input { $inputs } bara output { $outputs } brisa.
sequence-invalid-length = Sekwensia larkuka pain apia.  Enteru kum, 0 munhta apia, kaia sa.
sequence-invalid-step = Sekwensia stepka pain apia.  { $type } tipka sekwensia dukiara nambar kum kaia sa.
sequence-invalid-endpoint-number = Nambar sekwensia dukiara "{ $attribute }" pain apia.  Nambar kum kaia sa.
sequence-invalid-endpoint-letters = Letra sekwensia dukiara "{ $attribute }" pain apia.  Letra nani asla mangkanka kum kaia sa.
sequence-invalid-endpoint = Sekwensia dukiara "{ $attribute }" pain apia.
select-from-sequence-coprime-not-numbers = `coprime` ba swisa, kan nambar nani bakras
select-from-sequence-coprime-with-exclude-combinations = `coprime` ba swisa, kan excludeCombinations marikan sa
target-not-found = `<{ $source }>` dukiara target pain apia: target ba sakaia sip apia.
target-state-variable-not-found = `<{ $source }>` dukiara target pain apia: `<{ $component }>` ra "{ $property }" nina stet bariabilka kum sakaia sip apia.
ode-system-variables-match-independent = `<odeSystem>` bariabil nani ba independent bariabil wal aikuki kaia apia sa.
ode-system-duplicate-variable-names = ODE RHS punsion nani ba dependent bariabil nina aikuki nani wal paskaia sip apia.
ode-system-rhs-function-error = ODE RHS punsion paskaia sip apia.  mathjs punsion paskaia ra saura takan.
angle-too-many-lines = Lain { $count } tila ra anklu kum paskaia sip apia
angle-invalid-through-point = `<angle>` ai through ra puntu pain apia
parabola-vertex-too-many-points = Bertis wal puntu kumi purara luan parabula ba daukan apia sin.
parabola-too-many-points = Puntu 3 purara luan parabula ba daukan apia sin.
intersection-too-many-items = Dukia wal purara dukiara interseksion ba daukan apia sin
ionic-compound-not-two-ions = Ion wal apia ba dukiara kompwestu ioniku ba daukan apia sin.
ionic-compound-needs-cation-and-anion = Kompwestu ioniku ba katiun kumi bara aniun kumi dukiara baman daukan sa.
solve-equations-cannot-evaluate = Ekwasion ba wapni daukaia sip apia, kan ekwasion balurka sakaia sip apia: { $equation }
math-operators-operand-number-required = Math operand kum sakisma taim, operandNumber kum marikaia sa.
eigen-decomposition-failed = Matris ai awtobalur nani ba kalkulaia sip apia
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: parametru { $parameters } ba patronka bilara bara apia, bara baha mita ban blanku wal praki kaisa.
graph-grid-invalid = `<graph>`: grid="{ $grid }" tanka briaia sip apia. none, medium, dense, apia kaka nambar wal, 0 purara, spes kum ni sirpi mangkan, kaia sa, baku: grid="1 0.5". Krid kum ulban apia.
field-function-wrong-num-outputs =
    `<{ $component }>` ba punsion kum { $expected } output brih ba want sa — kumi, puntu bani ra slope y' ba, baku: `y - x`, apia kaka wal, puntu bani ra bektar ba, baku: `(y, -x)` — sakuna punsion yaban ba output { $found } brisa. { $alternative ->
        [none] Diara kum ulban apia.
       *[other] `<{ $alternative }>` sika baha punsion dukiara kompanenti ba. Diara kum ulban apia.
    }
field-function-attribute-ignored-with-child = `function` atributu ba swisa, kan punsion ba kompanenti bilara sin yaban; bilara ba yus munisa. Punsion ba wal wina kumi baman ni yabs.
field-variables-ignored =
    `<{ $component }>`: `variables` atributu ba kompanenti bilara sirpi ulban ekspresion ai bariabil nani nina makisa. { $reason ->
        [function-child] Naha ra punsion ba `<function>` luhpia baku yaban, bara witin ai bariabil nani nina makisa, bara baha mita `variables` ba swisa.
       *[no-expression] Naha ra baku ekspresion kum yaban apia, bara baha mita `variables` ba swisa.
    }
prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ba prefigure rindarar ra daukan apia; right-position laka ni warkisa.
prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ba prefigure rindarar ra daukan apia; top-position laka ni warkisa.
prefigure-invalid-axis-bounds = `<graph>`: prefigure ra lakaia dukiara ehe tnatka nani pain apia; dipalt bbox (-10,-10,10,10) yus munisa.
prefigure-invalid-width = `<graph>`: prefigure ra lakaia dukiara wid pain apia; dipalt wid 425 yus munisa.
prefigure-invalid-aspect-ratio = `<graph>`: prefigure ra lakaia dukiara aspectRatio pain apia; dipalt aspect ratio 1 yus munisa.
prefigure-grid-spacing-too-fine = `<graph>`: krid tila ba sirpi pali sa ehe tnatka nani dukiara; prefigure rindarar ra krid ba swisa.
prefigure-annotations-not-rendered = `<graph>`: PreFigure rindarar yus munan apia kaka, annotations nani ulban apia kaisa.
multiple-annotations-children = `<graph>` bilara `<annotations>` luhpia manis sakan; las ba baman brisa, wala nani sut swisa.
copy-unrecognized-component-type = Kompanenti tipka kaikan apia kum ekstend apia kaka kapi munaia sip apia: { $type }.
copy-prop-not-found = { $component } tipka kompanenti kum ra { $property } prop ba sakaia sip apia
collect-no-source = collect dukiara `source` kum sakan apia.
collect-invalid-component-type = `<{ $component }>` tipka kompanenti nani ba kolekt munaia sip apia, kan kompanenti tipka pain apia sa.
reference-index-unavailable = `{ $reference }` index ra riparens munaia sip apia
component-action-unavailable = `{ $reference }` kompanenti ra { $action } paiwaia sip apia
data-frame-inconsistent-row-lengths = Data ba paskanka pain apia.  Raw nani ba larkuka aikuki apia. componentIdx ra sakan :{ $componentIdx }
data-frame-duplicate-column-names = Data ba kolum nina aikuki nani brisa.  componentIdx ra sakan :{ $componentIdx }
data-frame-missing-column-name = Data ba kolum nina kum apu.  componentIdx ra sakan :{ $componentIdx }
answer-award-depends-on-own-response = Naha ansa dukiara award kum ba answer tak ai ansa blikan purara mangki sa, bara baha mita diara luki apia nani takbia.
answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` brisa kontena kum bilara `<answer>` ra `maxNumAttempts` mangkaia ba warkka daukras, kan trai nambarka ba kontena mita mainkisa. `maxNumAttempts` ba kontena ra mangks.
nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` brisa kontena wala kum bilara bara `sectionWideCheckWork` brisa kontena kum ra `maxNumAttempts` mangkaia ba warkka daukras, kan trai nambarka ba latara kontena mita mainkisa. `maxNumAttempts` ba latara kontena ra mangks.
answer-attributes-need-symbolic-equality = symbolicEquality mangkan apia kaka, { $attributes } atributu ba warkka daukbia apia.
answer-invalid-type = Ansa dukiara tipka pain apia: { $type }
module-attribute-child-needs-name = `<{ $component }>` kompanenti ba nina apu bak, module atributu kum dukiara yus munaia sip apia
module-attribute-name-already-defined = `<{ $component } name="{ $name }">` kompanenti ba module dukiara atributu baku yus munaia sip apia, kan `<module>` kompanenti tipka ba pat "{ $name }" atributu kum brisa.
conditional-content-condition-ignored = `condition` atributu ba `case` apia kaka `else` luhpia nani brisa `<conditionalContent>` kompanenti ra swisa.
slider-markers-type-mismatch = Markers tipka ba slider tipka wal praki apia.
pretzel-problem-needs-statement-and-answer = `pretzel` pain apia: `<problem>` bani ba `<statement>` kumi bara `<answer>` kumi briaia sa.
pretzel-circuit-first-problem-distractor = `pretzel` pain apia: mode="circuit" ra, `<problem>` pas ba distraktor kaia sip apia.
attribute-invalid-values = `{ $attribute }` atributu dukiara balur pain apia { $values }; swisa.
attribute-must-be-references = `{ $attribute }` atributu dukiara `{ $value }` balur pain apia. Atributu ba `$` wal ta krikan riparens nani wal paskan kaia sa.
math-input-invalid-function-names = <mathInput>: { $attribute } ra punsion nina pain apia nani ba swisa: { $names }. Nina bani ai marikanka ba letra wal apia kaka kau briaia sa (letra nani apia kaka hyphen nani); `|<mathspeak alternative>` ba ninkara balaia sip sa.
component-type-invalid = Kompanenti tipka pain apia: `<{ $componentType }>`
attribute-repeated = { $attribute } atributu ba kli ulbaia sip apia.
attribute-invalid-for-component = `<{ $componentType }>` tipka kompanenti kum dukiara "{ $attribute }" atributu pain apia.
style-definition-insufficient-contrast =
    Estilu paskanka { $styleNumber } ba { $context ->
        [text-on-background] bila kolorka ba bakrawn kolorka mapara
        [high-contrast] kontrast tara kolorka ba kanbas mapara
        [line] lain kolorka ba kanbas mapara
        [marker] marker kolorka ba kanbas mapara
       *[text-on-canvas] bila kolorka ba kanbas mapara
    } kontrast pain apia brisa{ $mode ->
        [dark] { " (dark mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 kau kaia sa).
style-definition-dark-mode-text-background-contrast =
    Estilu paskanka { $styleNumber } ba lait mode dukiara kontrast pain marikan sa, sakuna baha balur nani wina sakan dark-mode kolorka nani ba bila kolorka ba bakrawn kolorka mapara kontrast pain apia brisa ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 kau kaia sa). { $suggestion ->
        [available] Dark mode ra kontrast pain briaia dukiara, lait-mode kontrast ba kau tara daukaia sa (baku: { $lightAttribute }="{ $lightColor }" mangks), apia kaka dark-mode kolorka ba lakaia sa (baku: { $darkAttribute }="{ $darkColor }" mangks).
       *[none] Dark mode ra kontrast pain briaia dukiara, lait-mode kontrast ba kau tara daukaia sa, apia kaka sakan kolorka nani ba textColorDarkMode bara backgroundColorDarkMode ni lakaia sa.
    }
style-definition-dark-mode-text-canvas-contrast =
    Estilu paskanka { $styleNumber } ba lait mode dukiara kontrast pain brisa bila kolorka kum marikan sa, sakuna baha balur wina sakan dark-mode bila kolorka ba kanbas mapara kontrast pain apia brisa ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 kau kaia sa). { $suggestion ->
        [available] Dark mode ra kontrast pain briaia dukiara, lait-mode kontrast ba kau tara daukaia sa (baku: textColor="{ $lightColor }" mangks), apia kaka dark-mode kolorka ba lakaia sa (baku: textColorDarkMode="{ $darkColor }" mangks).
       *[none] Dark mode ra kontrast pain briaia dukiara, lait-mode kontrast ba kau tara daukaia sa, apia kaka sakan kolorka ba textColorDarkMode ni lakaia sa.
    }
section-multiple-style-palettes = Seksion kum ba <stylePalette> kumi baman bakaia sip sa; las ba yus munisa.
variant-num-to-select-not-non-negative-integer = { $component } dukiara bariant aikuki apia nani ba kaikaia sip apia, kan numToSelect ba enteru kum, 0 munhta apia, apia sa.
variant-num-to-select-not-constant-number = { $component } dukiara bariant aikuki apia nani ba kaikaia sip apia, kan numToSelect ba nambar lakwan apia kum apia sa.
variant-with-replacement-not-constant-boolean = { $component } dukiara bariant aikuki apia nani ba kaikaia sip apia, kan withReplacement ba boolean lakwan apia kum apia sa.
variant-select-weight-disables-unique = selectWeight apia kaka selectForVariants marikan option kum bara kaka, select dukiara bariant aikuki apia nani ba takaskan sa
variant-coprime-undetermined = { $component } dukiara bariant aikuki apia nani ba kaikaia sip apia, kan `coprime` ba ban kasak apia sa ba kaikaia sip apia.
variant-attribute-not-constant = { $component } dukiara bariant aikuki apia nani ba kaikaia sip apia, kan { $attribute } ba lakwan apia kum apia sa.
variant-attribute-not-number = { $component } dukiara bariant aikuki apia nani ba kaikaia sip apia, kan { $attribute } ba nambar kum apia sa.
variant-attribute-wrong-type-for-sequence =
    { $type } tipka { $component } dukiara bariant aikuki apia nani ba kaikaia sip apia, kan { $attribute } ba { $expected ->
        [letters-combination] letra nani asla mangkanka kum
        [math-expression] matematika ekspresion pain kum
        [integer] enteru kum
       *[number] nambar kum
    } apia sa.
variant-length-not-integer = { $component } dukiara bariant aikuki apia nani ba kaikaia sip apia, kan length ba enteru kum apia sa.
variant-sort-not-implemented = sort brisa { $component } kum dukiara bariant aikuki apia nani ba daukan apia sin
variant-exclude-combinations-not-implemented = excludeCombinations brisa { $component } kum dukiara bariant aikuki apia nani ba daukan apia sin
variant-math-exclude-not-implemented = exclude brisa math tipka { $component } kum dukiara bariant aikuki apia nani ba daukan apia sin
variant-non-constant-exclude-not-implemented = lakwan apia kum apia exclude brisa { $component } kum dukiara bariant aikuki apia nani ba daukan apia sin
prefigure-descendant-unsupported = { $subject }: `<graph>` prefigure rindarar ra daukan apia; luhpia ba swisa.
prefigure-descendant-invalid-geometry = { $subject }: heometria ba tnata apu apia kaka aiska apia; luhpia ba swisa.
prefigure-curve-label-omitted = { $subject }: kurba elementka lakan nani ra label nani daukan apia; label ba swisa.
prefigure-curve-unsupported-definition-type = { $subject }: kurba punsion paskanka tipka '{ $definitionType }' ba daukan apia; luhpia ba swisa.
prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves ra flipFunctions atributu ba daukan apia; luhpia ba swisa.
prefigure-region-non-formula-child = { $subject }: regionBetweenCurves ra formula tipka luhpia punsion nani baman daukan sa; luhpia ba swisa.
prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] lain-taya label
       *[point] puntu label
    } dukiara labelPosition '{ $labelPosition }' ba daukan apia; PreFigure dipalt praki laka yus munisa.
prefigure-fill-style-unsupported = { $subject }: fill estilu '{ $fillStyle }' ba PreFigure ra daukan apia; solid fill kum ra kli mangkisa.
prefigure-line-style-unknown = { $subject }: lain estilu '{ $lineStyle }' kaikan apia ba PreFigure output wina swisa.
prefigure-marker-style-mapped-to-diamond = { $subject }: marker estilu '{ $markerStyle }' ba PreFigure estilu 'diamond' ra lakan.
prefigure-marker-style-unsupported = { $subject }: marker estilu '{ $markerStyle }' ba PreFigure ra daukan apia; dipalt estilu yus munisa.
annotation-ref-unresolvable = `<annotation>`: `ref` pain apia; target ba sakaia sip apia. Annotation ba swisa.
annotation-ref-multiple-targets = `<annotation>`: `ref` ba target manis ra praki takan; target pas ba yus munisa.
annotation-ref-outside-graph = `<annotation>`: `ref` pain apia; target ba `<graph>` latara sa. Annotation ba swisa.
annotation-ref-unsupported-target = `<annotation>`: `ref` pain apia; target ba prefigure lakanka ra krapiku dukia daukan kum apia sa. Annotation ba swisa.
annotation-text-missing = `<annotation>`: `text` ba apu apia kaka bila apu; bila apu tekst kum sakisa.
composite-circular-dependency =
    { $componentType ->
        [none] Sirkular dipendensia kum sakan.
       *[other] `<{ $componentType }>` kompanenti wal sirkular dipendensia kum sakan.
    }
reference-no-referent = Naha riparens dukiara diara kum sakan apia: `{ $reference }`
reference-multiple-referents = Naha riparens dukiara diara manis sakan: `{ $reference }`
children-invalid-attribute-format = `<{ $componentType }>` ai { $attribute } atributu pormatka pain apia.
children-invalid = `<{ $componentType }>` dukiara luhpia nani pain apia: Luhpia pain apia nani sakan: { $children }
attribute-value-invalid-using-default = `{ $attribute }` atributu dukiara `{ $value }` balur pain apia, `{ $default }` balur ba yus munisa
doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML bersion { $version } sakan apia.
       *[other] DoenetML bersion { $version } sakan apia. { $fallback } bersion ra kli mangkisa
    }
parse-invalid-doenetml = DoenetML pain apia: { $content }
parse-tag-missing-close-tag = DoenetML pain apia: `{ $tag }` tak ba prakaia tak apu. Ai wina prakan tak kum apia kaka `</{ $tagName }>` tak kum want kan.
parse-tag-error = DoenetML pain apia: `<{ $tagName }>` tak ra saura
parse-attribute-missing-value = DoenetML pain apia: `{ $attribute }` atributu pain apia ba balurka apu baku kaikisa.
parse-attribute-invalid = DoenetML pain apia: `{ $attribute }` atributu pain apia
parse-attribute-value-invalid = DoenetML pain apia: `{ $value }` atributu balurka pain apia
parse-attribute-value-quote-mismatch = DoenetML pain apia: `{ $value }` atributu balurka pain apia. Kwut markka nani ba praki apia. `{ $quote }` kum apu baku kaikisa
parse-open-tag-name-missing = DoenetML pain apia: Tak kum nina apu sakan, baku: `<`
parse-tag-not-closed = DoenetML pain apia: `{ $tag }` tak ba prakan apia (`>` kum apu baku kaikisa).
parse-self-closing-tag-name-missing = DoenetML pain apia: Tak kum nina apu sakan `<{ $content }>`
parse-self-closing-tag-not-closed = DoenetML pain apia: `{ $tag }` tak ba prakan apia (`/>` ba apu baku kaikisa).
parse-tag-invalid-attributes = DoenetML pain apia: `{ $tag }` tak ba pain apia. Ai atributu nani ba saura kabia.
parse-close-tag-name-missing = DoenetML pain apia: Prakaia tak kum nina apu sakan, baku: `</`
parse-attribute-value-unquoted = Atributu balur nani ba kwut mark nani bilara mangkan kaia sa: `{ $attribute }="{ $value }"`
parse-close-tag-without-open-tag = DoenetML pain apia: `{ $tag }` prakaia tak sakan, sakuna ai kwakaia tak apu
parse-close-tag-mismatched = DoenetML pain apia: Prakaia tak ba praki apia. `</{ $expected }>` want kan. `{ $found }` sakan
parser-node-unconvertible = { $node } node ba Dast node ra lakaia sip apia.
name-attribute-invalid =
    name='{ $name }' atributu pain apia. { $reason ->
        [characters] Nina nani ba letra, nambar, `_` apia kaka `-` baman briaia sip sa.
       *[start] Nina nani ba letra kum wal ta krikaia sa.
    }
component-name-invalid-start = "{ $name }" kompanenti nina pain apia. Nina nani ba letra kum wal ta krikaia sa.
answer-video-watched-missing-video = videoWatched tipka ansa ba video atributu kum briaia sa
answer-video-watched-video-not-reference = videoWatched tipka ansa ba riparens kum sa video atributu kum briaia sa
answer-name-not-single-text = Ansa name atributu ba text luhpia kumi baman briaia sa
external-doenetml-recursion-limit = Latara DoenetML ba sakaia sip apia, kan ai bilara kli kli dimisa. Sirkular riparens kum bara ki?
external-doenetml-unavailable = { $attribute }="{ $uri }" wina DoenetML sakaia sip apia
external-doenetml-type-mismatch = { $attribute }="{ $uri }" wina sakan DoenetML pain apia: "{ $componentType }" kompanenti tipka wal praki apia
deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` atributu ba swin sa; `{ $to }` yus muns.
       *[other] [deprecation] `<{ $component }>` ra `{ $from }` atributu ba swin sa; `{ $to }` yus muns.
    }
deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` atributu ba swin sa bara swisa, kan `{ $to }` sin marikan sa.
       *[other] [deprecation] `<{ $component }>` ra `{ $from }` atributu ba swin sa bara swisa, kan `{ $to }` sin marikan sa.
    }
deprecated-attribute-ignored = [deprecation] `<{ $component }>` ra `{ $attribute }` atributu ba swin sa bara swisa.
deprecated-attribute-to-child = [deprecation] `<{ $component }>` ra `{ $attribute }` atributu ba swin sa; `<{ $child }>` luhpia kum yus muns.
deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` ra `{ $attribute }` atributu ai `{ $value }` balurka ba swin sa; `{ $to }` yus muns.
pluralize-english-only = `<pluralize>` ba Inglis baman plural ra lakaia sip sa, bara baha mita { $locale } bila ni ulban dukumint kum ra ai tekstka ba lakan apia. Plural pormat ba sirpi ulbs, apia kaka `pluralForm` atributu ni mangks.
schema-element-unrecognized = `<{ $tag }>` element ba Doenet element kum apia sa.
schema-element-not-allowed-at-root = `<{ $tag }>` element ba dukumint tunkia ra swin apia.
schema-element-not-allowed-inside = `<{ $tag }>` element ba `<{ $parent }>` bilara swin apia.
schema-attribute-unrecognized = `<{ $tag }>` element ba `{ $attribute }` nina atributu kum apu.
schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` element ai `{ $attribute }` atributu ba lista kum kaia sa, bara ai dukia bani ba naha nani wina kumi kaia sa: { $allowed }
       *[other] `<{ $tag }>` element ai `{ $attribute }` atributu ba naha nani wina kumi kaia sa: { $allowed }
    }
select-variant-name-option-count-mismatch = select dukiara bariant nina pain apia.  { $variantName } bariant nina ba option { $numOptions } ra takisa, sakuna bakaia nambarka ba { $numToSelect } sa.
select-variant-name-without-options = select dukiara bariant kum kum marikan sa, sakuna bariant nina takaia sip ba dukiara option kum marikan apia: { $variantName }.
select-variant-name-not-possible = select dukiara marikan bariant nina { $variantName } ba bariant nina takaia sip kum apia sa.
select-too-few-options = { $numOptions } baman wina kompanenti { $numToSelect } bakaia sip apia.
select-from-sequence-too-few-values = Sekwensia larkuka { $length } wina balur { $numToSelect } bakaia sip apia.
select-from-sequence-indices-count-mismatch = select dukiara marikan indices nambarka ba bakaia nambarka wal praki kaia sa
select-from-sequence-indices-not-integers = select dukiara marikan indices sut ba enteru kaia sa
select-from-sequence-index-excluded = selectfromsequence ai index marikan ba sakan swin kan
select-from-sequence-indices-excluded-combination = selectfromsequence ai indices marikan ba sakan swin asla mangkanka kum kan
select-from-sequence-coprime-not-positive-integers = `coprime` asla mangkanka nani bakaia sip apia, kan enteru, 0 purara, nani bakras.
select-from-sequence-coprime-common-factor = `coprime` nambar nani bakaia sip apia. Balur sip sut ba paktar aikuki kum brisa. ("from" apia kaka "to" balur marikan nani ba "step" wal coprime kaia sa.)
select-from-sequence-coprime-single-number = Nambar kumi, 1 apia, wina `coprime` asla mangkanka nani bakaia sip apia.
select-from-sequence-excluded-too-many-combinations = selectFromSequence ra asla mangkanka nani wina 70% purara sakan swin
select-from-sequence-coprime-none-found = `coprime` nambar nani bakaia sip apia kan. Balur sip sut ba paktar aikuki kum brisa.
select-from-sequence-too-few-unique-values = Sekwensia larkuka { $numPossibleValues } wina balur aikuki apia { $numToSelect } bakaia sip apia
select-prime-numbers-too-few-values = Praim nambar lista larkuka { $numValues } wina balur { $numToSelect } bakaia sip apia
select-prime-numbers-values-count-mismatch = select dukiara marikan balur nambarka ba bakaia nambarka wal praki kaia sa
select-prime-numbers-values-not-prime = select prime number dukiara marikan balur sut ba praim nambar lista ra bara kaia sa
select-prime-numbers-values-excluded-combination = selectPrimeNumbers ai balur marikan nani ba sakan swin asla mangkanka kum kan
select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers ra asla mangkanka nani wina 70% purara sakan swin
select-random-combination-fluke = Diara sip apia baku takan bak, random balur nani asla mangkanka kum bakaia sip apia kan
select-random-value-fluke = Diara sip apia baku takan bak, random balur kum bakaia sip apia kan
math-embedded-input-shape-unsuitable =
    `<{ $component }>` ba matematika bilara ulban apia; ekspresion ba input nani bilara dimaia sip kan apia pyua ra baku ulban sa. { $reason ->
        [not-inline] `inline` choice input baman ekspresion kum bilara dimisa; `inline` apu kaka witin butan nani blakka kum sa.
        [expanded] `expanded` text input ba lain manis boks kum sa, bara ekspresion bilara dimaia dukiara tara pali sa.
        [on-graph] `<graph>` purara ekspresion ba lilka kumi baku ulban sa, bara baha ra kontrol kum dukiara pliska apu.
       *[relative-width] Ai `width` ba `relative` sa (porsentu apia kaka `em`), bara ekspresion bilara baha wal praki diara kum apu. Wid ba absolute paskanka ni yabs, baku: `px`.
    }
