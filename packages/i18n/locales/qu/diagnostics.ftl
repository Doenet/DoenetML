# Quechua diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Quechua drops «-kuna» after a numeral and its verbs do not agree with an
# inanimate subject's number, so a counted message whose only English difference
# is number renders one string here and the select is dropped. A comment marks
# each site.


## `<lineSegment>`

# No select: «-kuna» is dropped after a count and «hap'isqachu» does not agree
# with the number of what is ignored, so one string covers both English
# categories. The count still arrives.
line-segment-attributes-ignored-with-endpoints = iskay puchukay churasqa kaptin { $attributes } mana hap'isqachu

line-segment-attributes-ignored-with-endpoint-and-midpoint = huk puchukaypas huk chawpipas churasqa kaptin { $attributes } mana hap'isqachu

line-segment-midpoint-offset-without-midpoint = midpointOffset mana imananchu chawpi mana kaptin

## `<line>`

line-points-undetermined-dimensions = Mana yachasqa tupuyuq chimpukunanta pasaq siq'i.

line-points-too-few-dimensions = Siq'iqa iskaymanta pacha tupuyuq chimpukunanta pasananmi.

line-points-depend-on-variables = Siq'iqa tikraqkunaman hap'ikuq chimpukunanta pasan: { $variables }.

line-equation-invalid-format = { $variable1 } hinaspa { $variable2 } tikraqkunapi siq'ipa tupachiyninpaq mana allin kaynin.

## `<ray>`

ray-overprescribed-through = Wach'iqa through, endpoint hinaspa direction-wan churasqa.  Churasqa through-ta mana hap'isqachu.

ray-dimension-mismatch = Wach'ipi numDimensions mana tupanchu.

## `<vector>`

vector-overprescribed-head = Bektorqa head, tail hinaspa displacement-wan churasqa.  Churasqa head-ta mana hap'isqachu.

vector-dimension-mismatch = Bektorpi numDimensions mana tupanchu.

## Attracting and constraining

attract-to-without-nearest-point = Mana atinchu huk `<{ $component }>`-man aysayta, nearestPoint kaynin mana kasqanrayku.

constrain-to-without-nearest-point = Mana atinchu huk `<{ $component }>`-man harkayta, nearestPoint kaynin mana kasqanrayku.

constrain-to-interior-without-nearest-point = Mana atinchu huk `<{ $component }>` ukhunman harkayta, nearestPoint kaynin mana kasqanrayku.

## `<choiceInput>`

choice-input-label-position-ignored = mana inline kaq choiceInput-paq labelPosition mana hap'isqachu

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput-paq churasqa indices mana hap'isqachu, chiqan yupay choice wawakunapa yupayninwan mana tupasqanrayku.

pretzel-indices-count-mismatch = problem-paq churasqa indices mana hap'isqachu, chiqan yupay problem wawakunapa yupayninwan mana tupasqanrayku.

shuffle-indices-count-mismatch = shuffle-paq churasqa indices mana hap'isqachu, chiqan yupay kaqkunapa yupayninwan mana tupasqanrayku.

indices-ignored-out-of-range = { $component }-paq churasqa indices mana hap'isqachu, wakin chiqan qawaymanta lluqsisqanrayku.

pretzel-indices-repeated = pretzel-paq churasqa indices mana hap'isqachu, wakin chiqan kutipasqanrayku.

pretzel-circuit-first-index = circuit niray pretzel-paq churasqa indices mana hap'isqachu, ñawpaq chiqan 1 kananrayku.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` qillqa wawakunawan llamk'ananpaq, `type` unanchata churanayki.

invalid-type-defaulting-to-math = { $component } kaqpaq { $type } niray mana allinchu. math, text, number icha boolean kananmi. math churasqa.

string-not-valid-component-to-arrange = "{ $value }" qillqaqa mana allin kaqchu { $component } ruranapaq. Mana hap'isqachu.

## Types and variables

invalid-type-defaulting-to-number = { $type } niray mana allinchu, niray number churasqa.

invalid-variable-value = Tikraqpa mana allin chanin: `{ $value }`

## Variants

variant-index-must-be-number = { $index } niray chiqanqa yupay kananmi

variant-index-must-be-integer = { $index } niray chiqanqa hunt'a yupay kananmi

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` mana rurasqachu hunt'a tupuykunapaq. Kinraykuna tupanachisqaman churasqa.

side-by-side-absolute-margins = `<{ $component }>` mana rurasqachu hunt'a tupuykunapaq. Manyakuna tupanachisqaman churasqa.

side-by-side-no-block-child = Mana allin `<{ $component }>`: huk bloke wawayuq kananmi.

## `<label>`

label-for-ignored-on-graphical = Rikch'ay `<label>`-pi `for` unancha mana hap'isqachu.

label-for-must-resolve-to-one = `<label>`-pi `for` unanchaqa huk kaqllaman tupananmi.

label-for-unresolved = `<label>`-pi `for` unanchaqa mana huk kaqmanpas tupayta atirqanchu.

label-for-answer-with-authored-inputs = `<label>`-pi `for` unanchaqa qillqaqpa churasqan yaykuyniyuq `<answer>`-man tupan; yaykuymanpuni tupachiy.

label-for-answer-without-input = `<label>`-pi `for` unanchaqa sutichanapaq yaykuy mana kaq `<answer>`-man tupan.

label-for-must-reference-input-or-answer = `<label>`-pi `for` unanchaqa huk yaykuyman icha huk kutichiyman tupananmi.

## Accessibility

accessibility-short-description-or-decorative = Chayanapaq, `<{ $component }>`-qa huch'uy riqsichiyniyuq kananmi icha k'achachiqlla nisqa kananmi.

accessibility-video-short-description = Chayanapaq, `<video>`-qa huch'uy riqsichiyniyuq kananmi.

accessibility-input-short-description-or-label = Chayanapaq, `<{ $component }>`-qa huch'uy riqsichiyniyuq icha sutiyuq kananmi.

accessibility-answer-input-short-description-or-label = Chayanapaq, yaykuyta ruraq huk `<answer>`-qa huch'uy riqsichiyniyuq icha sutiyuq kananmi.

accessibility-short-description-contains-math = Huch'uy riqsichiykunaqa `<{ $component }>` hina yupay kaqkunata mana apananchu. Yupayta simikunawan qillqay.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } mana chiqan rikchapuranchu t'aqa suti qillqapaq (yana niray) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 kanan).
       *[other] { $colorName } mana chiqan rikchapuranchu t'aqa suti qillqapaq ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 kanan).
    }

## `<circle>`

circle-through-points-non-numerical = Manaraq rurasqachu { $count } chimpunta pasaq `<circle>`, chimpukuna yupay chanin mana kaptin.

circle-too-many-through-points = Mana atinchu 3-manta aswan chimpunta pasaq muyuta yupayta.

circle-overprescribed-radius-center-points = Mana atinchu muyuta yupayta, churasqa muyu tupu, chawpi hinaspa chimpukunawan.

circle-center-with-multiple-points = Mana atinchu muyuta yupayta, churasqa chawpiyuq hinaspa 1-manta aswan chimpunta pasaq.

circle-radius-too-small = Mana atinchu muyuta yupayta: iskay chimpupa karunin { $distance } kaptin, churasqa muyu tupu { $radius } ancha huch'uy.

circle-radius-with-many-points = Mana atinchu iskaymanta aswan chimpunta pasaq muyuta rurayta, churasqa muyu tupuyuq.

circle-invalid-center-or-through-points = Muyupa chawpin icha chimpukunan mana allinchu.

circle-radius-center-with-multiple-points = Mana atinchu muyupa muyu tupunta yupayta, churasqa chawpiyuq hinaspa 1-manta aswan chimpunta pasaq.

circle-change-radius-non-numerical = Mana atinchu muyupa muyu tupunta tikrayta, chimpukuna yupay mana kaptin

circle-radius-with-points-non-numerical = Mana atinchu huk chimpumanta aswanta pasaq muyuta rurayta churasqa muyu tupuwan, yupay chanikuna mana kaptin.

circle-change-center-non-numerical = Manaraq rurasqachu chimpukunanta pasaq muyupa chawpinta tikray, yupay chanin mana kaptin.

## `<function>`

# Both selects dropped: «pacha» and «yaykuy» take no plural suffix after a
# numeral, so English's four sentences are one here. Both counts still arrive and
# are still formatted.
function-domain-insufficient-dimensions = Funsyunpa k'itinpa tupuynin mana hunt'achu. K'itinqa { $intervals } pacha kachkan ichaqa funsyunqa { $inputs } yaykuyniyuq.

function-domain-invalid-format = Funsyunpa k'itinpaq mana allin kaynin.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Funsyunpa mana yupay hatun kaynin mana hap'isqachu.
        [minimum] Funsyunpa mana yupay huch'uy kaynin mana hap'isqachu.
        [extremum] Funsyunpa mana yupay puchukay kaynin mana hap'isqachu.
        [point] Funsyunpa mana yupay chimpun mana hap'isqachu.
        [slope] Funsyunpa mana yupay wichaynin mana hap'isqachu.
       *[other] Funsyunpa mana yupay { $type } mana hap'isqachu.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Funsyunpa ch'usaq hatun kaynin mana hap'isqachu.
        [minimum] Funsyunpa ch'usaq huch'uy kaynin mana hap'isqachu.
        [extremum] Funsyunpa ch'usaq puchukay kaynin mana hap'isqachu.
        [point] Funsyunpa ch'usaq chimpun mana hap'isqachu.
       *[other] Funsyunpa ch'usaq { $type } mana hap'isqachu.
    }

function-points-too-close = Funsyunpi iskay chimpu ancha kaylla kachkan. Mana atinchu funsyunta sut'ichayta.

# Both selects dropped, for the reason above.
function-iterates-input-output-mismatch = Funsyun kutipaykunaqa yaykuy yupay lluqsiy yupaywan kaqlla kaptinlla atikun. Kay funsyunqa { $inputs } yaykuyniyuq hinaspa { $outputs } lluqsiyniyuq.

## `<sequence>`

sequence-invalid-length = Qatiqpa sunin mana allinchu.  Mana pisiyaq hunt'a yupay kananmi.

sequence-invalid-step = Qatiqpa thaskiynin mana allinchu.  { $type } niray qatiqpaq yupay kananmi.

sequence-invalid-endpoint-number = Yupay qatiqpa "{ $attribute }" mana allinchu.  Yupay kananmi.

sequence-invalid-endpoint-letters = Sanampa qatiqpa "{ $attribute }" mana allinchu.  Sanampa huñu kananmi.

sequence-invalid-endpoint = Qatiqpa "{ $attribute }" mana allinchu.

select-from-sequence-coprime-not-numbers = coprime mana hap'isqachu, mana yupaykunata akllasqanrayku

select-from-sequence-coprime-with-exclude-combinations = coprime mana hap'isqachu, excludeCombinations churasqa kasqanrayku

## Resolving a `target`

target-not-found = `<{ $source }>`-paq mana allin target: mana tarikunchu.

target-state-variable-not-found = `<{ $source }>`-paq mana allin target: huk `<{ $component }>`-pi "{ $property }" sutiyuq kaynin mana tarikunchu.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>`-pa tikraqninkunaqa sapan tikraqmanta huk niray kananmi.

ode-system-duplicate-variable-names = Mana atinchu ODE RHS funsyunkunata sut'ichayta kutipasqa tikraq sutikunawan.

ode-system-rhs-function-error = Mana atinchu ODE RHS funsyunta sut'ichayta.  Pantay mathjs funsyunta rurastin.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Mana atinchu { $count } siq'i chawpipi k'uchuta sut'ichayta

angle-invalid-through-point = `<angle>`-pa through-ninpi mana allin chimpu

parabola-vertex-too-many-points = Manaraq rurasqachu k'uchuyuq parabola 1-manta aswan chimpunta pasaq.

parabola-too-many-points = Manaraq rurasqachu 3-manta aswan chimpunta pasaq parabola.

intersection-too-many-items = Manaraq rurasqachu iskaymanta aswan kaqpaq tupanakuy

## Other math components

ionic-compound-not-two-ions = Manaraq rurasqachu huñu iyoniku iskay iyonmanta huk hinapaq.

ionic-compound-needs-cation-and-anion = Huñu iyonikuqa huk katiyonpaq hinaspa huk aniyonpaqlla rurasqa.

solve-equations-cannot-evaluate = Mana atinchu tupachiyta paskayta, mana chaninchayta atisqanrayku: { $equation }

math-operators-operand-number-required = Yupay ruraqta hurqustin operandNumber churanayki.

eigen-decomposition-failed = Mana atirqanchu matrispa kikin chaninkunata yupayta

## `<matchesPattern>`

# No select: «-kuna» is dropped after a count and the verb does not agree, so
# both English categories are one string.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: { $parameters } tupuyqa pallaypi mana rikhurinchu, chayrayku ch'usaqwanpuni tupanqa.

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" mana entiendisqachu. none, medium, dense, icha huk ch'usaqwan t'aqasqa iskay mana pisiyaq yupay kananmi, kayhina grid="1 0.5". Mana siq'i katata rurasqachu.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" mana hap'isqachu prefigure rikuchiqpi; paña kaq ruray hap'isqa.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" mana hap'isqachu prefigure rikuchiqpi; wichay kaq ruray hap'isqa.

prefigure-invalid-axis-bounds = `<graph>`: prefigure tikraypaq mana allin muyuchiq manyakuna; ñawpaq bbox hap'isqa (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: prefigure tikraypaq mana allin kinray; ñawpaq rikch'a kinray 425 hap'isqa.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure tikraypaq mana allin aspectRatio; ñawpaq tupachiy 1 hap'isqa.

prefigure-grid-spacing-too-fine = `<graph>`: siq'i katapa karunin ancha ñañu muyuchiq manyakunapaq; siq'i kata mana churasqachu prefigure rikuchiqpi.

prefigure-annotations-not-rendered = `<graph>`: PreFigure rikuchiq mana hap'ikuptin qillqa yapaykuna mana rikuchisqachu.

multiple-annotations-children = `<graph>`-pi achka `<annotations>` wawa tarikun; puchukaqllamanta huk hinantin mana hap'isqachu.

## Referring to other components

copy-unrecognized-component-type = Mana atinchu mana riqsisqa niray kaqta hatunyachiyta icha kopiayta: { $type }.

copy-prop-not-found = Mana tarirqanchu { $property } prop-ta { $component } niray kaqpi

collect-no-source = collect-paq mana ima pukyupas tarikunchu.

collect-invalid-component-type = Mana atinchu `<{ $component }>` niray kaqkunata huñuyta, mana allin niray kasqanrayku.

reference-index-unavailable = Mana atinchu `{ $reference }` chiqanman tupachiyta

## `<callAction>`

component-action-unavailable = Mana atinchu { $action }-ta `{ $reference }` kaqpi qayayta

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Willaykunapa kaynin mana allinchu.  Siqikunapa sunin mana kaqllachu. Kaypi tarisqa componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Willaykunapi kutipasqa sayaq sutikuna kachkan.  Kaypi tarisqa componentIdx :{ $componentIdx }

data-frame-missing-column-name = Willaykunapi huk sayaq suti pisin.  Kaypi tarisqa componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Kay kutichiypaq huk award kikin kutichiy tag-pa apachisqan kutichiyman hap'ikun, chaymi mana suyasqa rurayman apanqa.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork`-niyuq q'ipi ukhupi kaq `<answer>`-pi `maxNumAttempts` churayqa mana imananchu, ruray yupayta q'ipi kamachisqanrayku. `maxNumAttempts`-ta q'ipipi churay.

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork`-niyuq huk q'ipi ukhupi kaq `sectionWideCheckWork`-niyuq q'ipipi `maxNumAttempts` churayqa mana imananchu, ruray yupayta hawa q'ipi kamachisqanrayku. `maxNumAttempts`-ta hawa q'ipipi churay.

# No select: «unancha» takes no plural suffix after a count and the verb does not
# agree with it.
answer-attributes-need-symbolic-equality = { $attributes } unanchaqa mana imananqachu symbolicEquality mana churasqa kaptin.

answer-invalid-type = Kutichiypaq mana allin niray: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` kaq mana sutiyuq kasqanrayku, mana atikunchu module unanchapaq hap'iyta

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` kaqta mana atikunchu module-paq unancha hina hap'iyta, `<module>` niray kaq ña "{ $name }" unanchayuq kasqanrayku.

conditional-content-condition-ignored = case icha else wawayuq `<conditionalContent>` kaqpi `condition` unancha mana hap'isqachu.

slider-markers-type-mismatch = Unancha niray slider nirayman mana tupanchu.

pretzel-problem-needs-statement-and-answer = Mana allin pretzel: sapa `<problem>` huk `<statement>` hinaspa huk `<answer>`-niyuq kananmi.

pretzel-circuit-first-problem-distractor = Mana allin pretzel: mode="circuit"-pi, ñawpaq `<problem>` mana pantachiq kanmanchu.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` unanchapaq { $values } chanin mana allinchu; mana hap'isqachu.
       *[other] `{ $attribute }` unanchapaq { $values } chanikuna mana allinchu; mana hap'isqachu.
    }

attribute-must-be-references = `{ $attribute }` unanchapaq `{ $value }` chanin mana allinchu. Unanchaqa `$`-wan qallariq tupachiykunamanta rurasqa kananmi.

math-input-invalid-function-names = <mathInput>: { $attribute }-pi mana allin funsyun sutikuna mana hap'isqachu: { $names }. Sapa sutipa rikuchiy phatman iskaymanta pacha sanampayuq kananmi (sanampakuna icha t'aqana siq'ikuna); huk munaylla `|<mathspeak alternative>` qatiy hamunmanmi.

## Building components from the source

component-type-invalid = Mana allin niray kaq: `<{ $componentType }>`

attribute-repeated = Mana atinchu { $attribute } unanchata kutipayta.

attribute-invalid-for-component = `<{ $componentType }>` niray kaqpaq "{ $attribute }" unancha mana allinchu.

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } rikch'ay sut'ichayqa mana chiqan rikchapuranchu { $context ->
        [text-on-background] qillqa llimp'i qhipa llimp'iwan
        [high-contrast] sinchi rikchapuray llimp'i pampawan
        [line] siq'i llimp'i pampawan
        [marker] unancha llimp'i pampawan
       *[text-on-canvas] qillqa llimp'i pampawan
    }{ $mode ->
        [dark] { " (yana niray)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 kanan).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } rikch'ay sut'ichayqa ch'aska niraypaq chiqan rikchapuraq llimp'ikunata churan, ichaqa chay chanikunamanta hurqusqa yana niray llimp'ikunaqa mana chiqan rikchapuranchu qillqa llimp'i qhipa llimp'iwan ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 kanan). { $suggestion ->
        [available] Yana niraypi chiqan rikchapuray kananpaq, ch'aska niray rikchapurayta yapay (kayhina, { $lightAttribute }="{ $lightColor }" churay) icha yana niray llimp'ita tikray (kayhina, { $darkAttribute }="{ $darkColor }" churay).
       *[none] Yana niraypi chiqan rikchapuray kananpaq, ch'aska niray rikchapurayta yapay icha hurqusqa llimp'ikunata textColorDarkMode hinaspa/icha backgroundColorDarkMode-wan tikray.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } rikch'ay sut'ichayqa ch'aska niraypaq chiqan rikchapuraq qillqa llimp'ita churan, ichaqa chay chaninmanta hurqusqa yana niray qillqa llimp'iqa mana chiqan rikchapuranchu pampawan ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; { $threshold }:1 kanan). { $suggestion ->
        [available] Yana niraypi chiqan rikchapuray kananpaq, ch'aska niray rikchapurayta yapay (kayhina, textColor="{ $lightColor }" churay) icha yana niray llimp'ita tikray (kayhina, textColorDarkMode="{ $darkColor }" churay).
       *[none] Yana niraypi chiqan rikchapuray kananpaq, ch'aska niray rikchapurayta yapay icha hurqusqa llimp'ita textColorDarkMode-wan tikray.
    }

section-multiple-style-palettes = Huk t'aqaqa huk <stylePalette>-llata akllayta atin; puchukaq hap'isqa.

## Unique variants

variant-num-to-select-not-non-negative-integer = mana atinchu { $component }-pa sapan nirayninkunata yachayta, numToSelect mana pisiyaq hunt'a yupay mana kasqanrayku.

variant-num-to-select-not-constant-number = mana atinchu { $component }-pa sapan nirayninkunata yachayta, numToSelect mana takyasqa yupay kasqanrayku.

variant-with-replacement-not-constant-boolean = mana atinchu { $component }-pa sapan nirayninkunata yachayta, withReplacement mana takyasqa boolean kasqanrayku.

variant-select-weight-disables-unique = select-paq sapan nirayninkuna wichq'asqa, selectWeight icha selectForVariants churasqa akllanayuq kaptin

variant-coprime-undetermined = mana atinchu { $component }-pa sapan nirayninkunata yachayta, coprime wiñaypaq llulla kasqan mana yachasqanrayku.

variant-attribute-not-constant = mana atinchu { $component }-pa sapan nirayninkunata yachayta, { $attribute } mana takyasqa kasqanrayku.

variant-attribute-not-number = mana atinchu { $component }-pa sapan nirayninkunata yachayta, { $attribute } mana yupay kasqanrayku.

variant-attribute-wrong-type-for-sequence =
    mana atinchu { $type } niray { $component }-pa sapan nirayninkunata yachayta, { $attribute } mana { $expected ->
        [letters-combination] sanampa huñu
        [math-expression] allin yupay rimay
        [integer] hunt'a yupay
       *[number] yupay
    } kasqanrayku.

variant-length-not-integer = mana atinchu { $component }-pa sapan nirayninkunata yachayta, length mana hunt'a yupay kasqanrayku.

variant-sort-not-implemented = manaraq rurasqachu sort-niyuq { $component }-pa sapan nirayninkuna

variant-exclude-combinations-not-implemented = manaraq rurasqachu excludeCombinations-niyuq { $component }-pa sapan nirayninkuna

variant-math-exclude-not-implemented = manaraq rurasqachu math niray { $component }-pa exclude-niyuq sapan nirayninkuna

variant-non-constant-exclude-not-implemented = manaraq rurasqachu mana takyasqa exclude-niyuq { $component }-pa sapan nirayninkuna

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure rikuchiqpi mana hap'isqachu; mirayninta saqisqa.

prefigure-descendant-invalid-geometry = { $subject }: mana hunt'a icha mana tukusqa tupu kaynin; mirayninta saqisqa.

prefigure-curve-label-omitted = { $subject }: tikrasqa q'iwi kaqkunapi sutikuna mana hap'isqachu; sutinta saqisqa.

prefigure-curve-unsupported-definition-type = { $subject }: q'iwi funsyun sut'ichay niray '{ $definitionType }' mana hap'isqachu; mirayninta saqisqa.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves-pi flipFunctions unancha mana hap'isqachu; mirayninta saqisqa.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves-pi formula niray funsyun wawakunallam hap'isqa; mirayninta saqisqa.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] siq'i ayllu suti
       *[point] chimpu suti
    }-paq labelPosition '{ $labelPosition }' mana hap'isqachu; ñawpaq PreFigure tupanachiy hap'isqa.

prefigure-fill-style-unsupported = { $subject }: PreFigure mana hap'inchu '{ $fillStyle }' hunt'ay rikch'ayta; hunt'a hunt'ayman kutin.

prefigure-line-style-unknown = { $subject }: mana riqsisqa siq'i rikch'ay '{ $lineStyle }' PreFigure lluqsiymanta saqisqa.

prefigure-marker-style-mapped-to-diamond = { $subject }: '{ $markerStyle }' unancha rikch'ay PreFigure 'diamond' rikch'ayman tupachisqa.

prefigure-marker-style-unsupported = { $subject }: PreFigure mana hap'inchu '{ $markerStyle }' unancha rikch'ayta; ñawpaq rikch'ay hap'isqa.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: mana allin `ref`; mana atinchu tupaqta tariyta. Qillqa yapayta saqisqa.

annotation-ref-multiple-targets = `<annotation>`: `ref` achka tupaqman chayan; ñawpaq tupaq hap'isqa.

annotation-ref-outside-graph = `<annotation>`: mana allin `ref`; tupaqqa graph hawapi kachkan. Qillqa yapayta saqisqa.

annotation-ref-unsupported-target = `<annotation>`: mana allin `ref`; tupaqqa prefigure tikraypi hap'isqa rikch'ay kaqchu. Qillqa yapayta saqisqa.

annotation-text-missing = `<annotation>`: `text` pisin icha ch'usaq; ch'usaq qillqa churasqa.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Muyu hap'ikuy tarisqa.
       *[other] `<{ $componentType }>` kaqwan muyu hap'ikuy tarisqa.
    }

reference-no-referent = Kay tupachiypaq mana ima tarikunchu: `{ $reference }`

reference-multiple-referents = Kay tupachiypaq achka tarikun: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>`-pa { $attribute } unanchanpaq mana allin kaynin.

children-invalid = `<{ $componentType }>`-paq mana allin wawakuna: mana allin wawakuna tarisqa: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` unanchapaq `{ $value }` chanin mana allinchu, `{ $default }` chanin hap'isqa

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } niray mana tarikunchu.
       *[other] DoenetML { $version } niray mana tarikunchu. { $fallback } nirayman kutin
    }

## Reading the DoenetML

parse-invalid-doenetml = Mana allin DoenetML: { $content }

parse-tag-missing-close-tag = Mana allin DoenetML: `{ $tag }` unanchaqa mana wichq'ay unanchayuqchu. Kikin wichq'akuq unancha icha `</{ $tagName }>` unancha suyasqa.

parse-tag-error = Mana allin DoenetML: `<{ $tagName }>` unanchapi pantay

parse-attribute-missing-value = Mana allin DoenetML: Mana allin `{ $attribute }` unanchaqa chanin pisiyuq kachkan.

parse-attribute-invalid = Mana allin DoenetML: Mana allin `{ $attribute }` unancha

parse-attribute-value-invalid = Mana allin DoenetML: Mana allin `{ $value }` unancha chanin

parse-attribute-value-quote-mismatch = Mana allin DoenetML: Mana allin `{ $value }` unancha chanin. Rimay unanchakuna mana tupanchu. Huk `{ $quote }` pisin.

parse-open-tag-name-missing = Mana allin DoenetML: Mana sutiyuq unancha tarisqa, kayhina `<`

parse-tag-not-closed = Mana allin DoenetML: `{ $tag }` unancha mana wichq'asqachu (huk `>` pisin).

parse-self-closing-tag-name-missing = Mana allin DoenetML: Mana sutiyuq unancha tarisqa `<{ $content }>`

parse-self-closing-tag-not-closed = Mana allin DoenetML: `{ $tag }` unancha mana wichq'asqachu (`/>` pisin).

parse-tag-invalid-attributes = Mana allin DoenetML: `{ $tag }` unancha mana allinchu. Mana allin unanchakunayuq kanman.

parse-close-tag-name-missing = Mana allin DoenetML: Mana sutiyuq wichq'ay unancha tarisqa, kayhina `</`

parse-attribute-value-unquoted = Unancha chanikunaqa rimay unanchakuna ukhupi kananmi: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Mana allin DoenetML: `{ $tag }` wichq'ay unancha tarisqa, ichaqa mana tupaq kichay unancha kanchu

parse-close-tag-mismatched = Mana allin DoenetML: Wichq'ay unancha mana tupanchu. `</{ $expected }>` suyasqa. `{ $found }` tarisqa

parser-node-unconvertible = Mana atirqanchu { $node } muquta Dast muquman tikrayta.

## Names

name-attribute-invalid =
    Mana allin name='{ $name }' unancha. { $reason ->
        [characters] Sutikunaqa sanampakunallata, yupaykunallata, uray t'aqanakunallata icha t'aqana siq'ikunallata apanman.
       *[start] Sutikunaqa huk sanampawan qallarinanmi.
    }

component-name-invalid-start = Mana allin "{ $name }" kaq suti. Sutikunaqa huk sanampawan qallarinanmi.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched niray kutichiyqa video unanchayuq kananmi

answer-video-watched-video-not-reference = videoWatched niray kutichiyqa tupachiy kaq video unanchayuq kananmi

answer-name-not-single-text = Kutichiypa name unanchanqa huk qillqa wawayuqlla kananmi

## Referencing another document

external-doenetml-recursion-limit = Mana atirqanchu hawa DoenetML-ta hap'iyta, ancha achka kutipay patakuna kasqanrayku. Muyu tupachiy kanchu?

external-doenetml-unavailable = Mana atirqanchu DoenetML-ta hap'iyta { $attribute }="{ $uri }"-manta

external-doenetml-type-mismatch = { $attribute }="{ $uri }"-manta mana allin DoenetML hap'isqa: "{ $componentType }" niray kaqwan mana tuparqanchu

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` unancha ñawpaqña; `{ $to }`-ta hap'iy.
       *[other] [deprecation] `<{ $component }>`-pi `{ $from }` unancha ñawpaqña; `{ $to }`-ta hap'iy.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` unancha ñawpaqña hinaspa mana hap'isqachu, `{ $to }` ima churasqa kasqanrayku.
       *[other] [deprecation] `<{ $component }>`-pi `{ $from }` unancha ñawpaqña hinaspa mana hap'isqachu, `{ $to }` ima churasqa kasqanrayku.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>`-pi `{ $attribute }` unancha ñawpaqña hinaspa mana hap'isqachu.

deprecated-attribute-to-child = [deprecation] `<{ $component }>`-pi `{ $attribute }` unancha ñawpaqña; huk `<{ $child }>` wawata hap'iy.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>`-pi `{ $attribute }` unanchapa `{ $value }` chanin ñawpaqña; `{ $to }`-ta hap'iy.


## Language coverage

pluralize-english-only = `<pluralize>` ingles simillata achkayachiyta atin, chayrayku { $locale } simipi qillqasqa qillqapi qillqan mana tikrasqachu. Achka kaqninta kikinmanta qillqay, icha `pluralForm` unanchawan churay.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` kaqqa mana riqsisqa Doenet kaqchu.

schema-element-not-allowed-at-root = `<{ $tag }>` kaqqa mana saqisqachu qillqapa saphinpi.

schema-element-not-allowed-inside = `<{ $tag }>` kaqqa mana saqisqachu `<{ $parent }>` ukhupi.

schema-attribute-unrecognized = `<{ $tag }>` kaqqa mana `{ $attribute }` sutiyuq unanchayuqchu.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` kaqpa `{ $attribute }` unanchanqa huk siqi kananmi, sapa kaqnin kaykunamanta huk kaptin: { $allowed }
       *[other] `<{ $tag }>` kaqpa `{ $attribute }` unanchanqa kaykunamanta huk kananmi: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select-paq mana allin niray suti.  { $variantName } niray suti { $numOptions } akllanapi rikhurin ichaqa akllanapaq yupay { $numToSelect }.

select-variant-name-without-options = select-paq wakin nirayninkuna churasqa ichaqa kay atiq niray sutipaq mana ima akllanapas churasqachu: { $variantName }.

select-variant-name-not-possible = select-paq churasqa { $variantName } niray suti mana atiq niray sutichu.

select-too-few-options = Mana atinchu { $numToSelect } kaqta { $numOptions }-llamanta akllayta.

select-from-sequence-too-few-values = Mana atinchu { $numToSelect } chanita { $length } suni qatiqmanta akllayta.

select-from-sequence-indices-count-mismatch = select-paq churasqa chiqan yupayqa akllanapaq yupaywan tupananmi

select-from-sequence-indices-not-integers = select-paq churasqa llapan chiqankunaqa hunt'a yupay kananmi

select-from-sequence-index-excluded = selectfromsequence-pa churasqa chiqannin wikch'usqa karqan

select-from-sequence-indices-excluded-combination = selectfromsequence-pa churasqa chiqankunan wikch'usqa huñu karqan

select-from-sequence-coprime-not-positive-integers = Mana atinchu coprime huñukunata akllayta, mana pisiyaq hunt'a yupaykunata akllasqanrayku.

select-from-sequence-coprime-common-factor = Mana atinchu coprime yupaykunata akllayta. Llapan atiq chanikuna huk kaqlla ruraqniyuq. (Churasqa "from" icha "to" chanikunaqa "step"-wan coprime kananmi.)

select-from-sequence-coprime-single-number = Mana atinchu coprime huñukunata huk 1 mana kaq yupayllamanta akllayta.

select-from-sequence-excluded-too-many-combinations = selectFromSequence-pi huñukunamanta 70%-manta aswan wikch'usqa

select-from-sequence-coprime-none-found = Mana atirqanchu coprime yupaykunata akllayta. Llapan atiq chanikuna huk kaqlla ruraqniyuq.

select-from-sequence-too-few-unique-values = Mana atinchu { $numToSelect } sapan chanita { $numPossibleValues } suni qatiqmanta akllayta

select-prime-numbers-too-few-values = Mana atinchu { $numToSelect } chanita { $numValues } suni ñawpaq yupay siqimanta akllayta

select-prime-numbers-values-count-mismatch = select-paq churasqa chanikunapa yupaynin akllanapaq yupaywan tupananmi

select-prime-numbers-values-not-prime = select ñawpaq yupaypaq churasqa llapan chanikunaqa ñawpaq yupay siqipi kananmi

select-prime-numbers-values-excluded-combination = selectPrimeNumbers-pa churasqa chaninkunan wikch'usqa huñu karqan

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers-pi huñukunamanta 70%-manta aswan wikch'usqa

select-random-combination-fluke = Ancha mana atiq kutimuywan, mana atirqanchu mana yachasqa chanikunapa huñunta akllayta

select-random-value-fluke = Ancha mana atiq kutimuywan, mana atirqanchu mana yachasqa chanita akllayta
