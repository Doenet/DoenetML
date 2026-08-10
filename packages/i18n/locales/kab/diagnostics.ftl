# Kabyle diagnostics: errors and warnings surfaced to the reader or author.
# Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element, attribute and value names — `through`, `endpoint`,
# `midpointOffset`, `numDimensions`, `symbolicEquality`, `selectFromSequence`
# and the rest — are part of the language rather than prose, and stay in
# English exactly as written. So does the `[deprecation]` marker.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } yettwazgel ticki ttwafernen snat n tenqiḍin n tagara
       *[other] { $attributes } ttwazglen ticki ttwafernen snat n tenqiḍin n tagara
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } yettwazgel ticki ttwafernen tanqiḍt n tagara d tenqiḍt talemmast
       *[other] { $attributes } ttwazglen ticki ttwafernen tanqiḍt n tagara d tenqiḍt talemmast
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ulac fell-as azal war tanqiḍt talemmast

## `<line>`

line-points-undetermined-dimensions = Izirig yettɛeddin ɣef tenqiḍin n tesekkirin ur nettwassen ara.

line-points-too-few-dimensions = Izirig ilaq ad iɛeddi ɣef tenqiḍin n snat n tesekkirin d asawen.

line-points-depend-on-variables = Izirig yettɛeddi ɣef tenqiḍin i yesteɛmilen imutiyen: { $variables }.

line-equation-invalid-format = Amasal arameɣtu n tegda n yizirig deg yimutiyen { $variable1 } d { $variable2 }.

## `<ray>`

ray-overprescribed-through = Azrar yettwasbadu s through, endpoint d direction.  through i yettwafernen yettwazgel.

ray-dimension-mismatch = numDimensions ur temṣada ara deg uzrar.

## `<vector>`

vector-overprescribed-head = Avektur yettwasbadu s head, tail d displacement.  head i yettwafernen yettwazgel.

vector-dimension-mismatch = numDimensions ur temṣada ara deg uvektur.

## Attracting and constraining

attract-to-without-nearest-point = Ur yezmir ara ad d-yejbed ɣer `<{ $component }>` acku ulac ɣur-s amuti n waddad nearestPoint.

constrain-to-without-nearest-point = Ur yezmir ara ad iḥbes ɣer `<{ $component }>` acku ulac ɣur-s amuti n waddad nearestPoint.

constrain-to-interior-without-nearest-point = Ur yezmir ara ad iḥbes deg daxel n `<{ $component }>` acku ulac ɣur-s amuti n waddad nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition yettwazgel i choiceInput ur nelli d inline

## Ordering children by index

choice-input-indices-count-mismatch = Imḍanen yettwafernen i choiceInput ttwazglen acku amḍan n yimḍanen ur yemṣada ara d umḍan n warraw n ufran.

pretzel-indices-count-mismatch = Imḍanen yettwafernen i problem ttwazglen acku amḍan n yimḍanen ur yemṣada ara d umḍan n warraw n problem.

shuffle-indices-count-mismatch = Imḍanen yettwafernen i shuffle ttwazglen acku amḍan n yimḍanen ur yemṣada ara d umḍan n yiferdisen.

indices-ignored-out-of-range = Imḍanen yettwafernen i { $component } ttwazglen acku kra deg-sen ffɣen i tuget.

pretzel-indices-repeated = Imḍanen yettwafernen i pretzel ttwazglen acku kra deg-sen ttwalsen.

pretzel-circuit-first-index = Imḍanen yettwafernen i pretzel deg mode circuit ttwazglen acku amḍan amezwaru ilaq ad yili d 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Akken `<{ $component }>` ad yeddu d warraw n wawalen, ameslay `type` ilaq ad yettwafren.

invalid-type-defaulting-to-math = Anaw { $type } d arameɣtu i uferdis { $component }. Ilaq ad yili d yiwen seg math, text, number neɣ boolean. Yettwarra ɣer math s wudem amezwer.

string-not-valid-component-to-arrange = Awal "{ $value }" mačči d aferdis yettusirgen i { $component }. Yettwazgel.

## Types and variables

invalid-type-defaulting-to-number = Anaw { $type } d arameɣtu, anaw yettwarra ɣer number.

invalid-variable-value = Azal arameɣtu n umuti: `{ $value }`

## Variants

variant-index-must-be-number = Amḍan n telɣa { $index } ilaq ad yili d amḍan

variant-index-must-be-integer = Amḍan n telɣa { $index } ilaq ad yili d amḍan ummid

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ur yettwaseddu ara i uskan usdid. Tehri tettwarra d tamṣadant.

side-by-side-absolute-margins = `<{ $component }>` ur yettwaseddu ara i uskan usdid. Tiwennaḍin ttwarrant d timṣadanin.

side-by-side-no-block-child = `<{ $component }>` arameɣtu: ilaq ad yesɛu ma drus yiwen n warraw n ublur.

## `<label>`

label-for-ignored-on-graphical = Ameslay `for` deg `<label>` n tugna yettwazgel.

label-for-must-resolve-to-one = Ameslay `for` deg `<label>` ilaq ad yemmel yiwen n uferdis kan.

label-for-unresolved = Ameslay `for` deg `<label>` ur yezmir ara ad yemmel aferdis.

label-for-answer-with-authored-inputs = Ameslay `for` deg `<label>` yettmuqul ɣer `<answer>` i yesɛan inekcam i yura umeskar; mmel anekcum s timmad-is.

label-for-answer-without-input = Ameslay `for` deg `<label>` yettmuqul ɣer `<answer>` war anekcum ara yettwabedren.

label-for-must-reference-input-or-answer = Ameslay `for` deg `<label>` ilaq ad yemmel anekcum neɣ tiririt.

## Accessibility

accessibility-short-description-or-decorative = I wanekcum, `<{ $component }>` ilaq ad yesɛu aglam awezlan neɣ ad yettwafren d decorative.

accessibility-video-short-description = I wanekcum, `<video>` ilaq ad yesɛu aglam awezlan.

accessibility-input-short-description-or-label = I wanekcum, `<{ $component }>` ilaq ad yesɛu aglam awezlan neɣ tabzimt.

accessibility-answer-input-short-description-or-label = I wanekcum, `<answer>` i d-yesnulfuyen anekcum ilaq ad yesɛu aglam awezlan neɣ tabzimt.

accessibility-short-description-contains-math = Iglamen iwezlanen ur ilaq ara ad sɛun iferdisen usnanen am `<{ $component }>`. Aru tusnakt s wawalen.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ulac ɣur-s amgirred ineǧmen i uḍris n uzwel n tgezmi (askar aberkan) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ilaq { $threshold }:1 ma drus).
       *[other] { $colorName } ulac ɣur-s amgirred ineǧmen i uḍris n uzwel n tgezmi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ilaq { $threshold }:1 ma drus).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` i yettɛeddin ɣef { $count } n tenqiḍin ur yettwaxdem ara ticki tinqiḍin ur sɛint ara azalen umḍinen.

circle-too-many-through-points = Ur yezmir ara ad yesiḍen tawinest i yettɛeddin ɣef ugar n tlata n tenqiḍin.

circle-overprescribed-radius-center-points = Ur yezmir ara ad yesiḍen tawinest s uzagur, tlemmast d tenqiḍin i yettwafernen.

circle-center-with-multiple-points = Ur yezmir ara ad yesiḍen tawinest s tlemmast yettwafernen i yettɛeddin ɣef ugar n yiwet n tenqiḍt.

circle-radius-too-small = Ur yezmir ara ad yesiḍen tawinest: acku tallunt gar snat n tenqiḍin d { $distance }, azagur { $radius } yettwafernen d amecṭuḥ aṭas.

circle-radius-with-many-points = Ur yezmir ara ad yesnulfu tawinest i yettɛeddin ɣef ugar n snat n tenqiḍin s uzagur yettwafernen.

circle-invalid-center-or-through-points = Tilemmast neɣ tinqiḍin n twinest d tirameɣtuyin.

circle-radius-center-with-multiple-points = Ur yezmir ara ad yesiḍen azagur n twinest s tlemmast yettwafernen i yettɛeddin ɣef ugar n yiwet n tenqiḍt.

circle-change-radius-non-numerical = Ur yezmir ara ad ibeddel azagur n twinest i yettɛeddin ɣef tenqiḍin war imḍanen

circle-radius-with-points-non-numerical = Ur yezmir ara ad yesnulfu tawinest i yettɛeddin ɣef ugar n yiwet n tenqiḍt s uzagur yettwafernen ticki ulac azalen umḍinen.

circle-change-center-non-numerical = Abeddel n tlemmast n twinest i yettɛeddin ɣef tenqiḍin war azalen umḍinen ur yettwaxdem ara.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Tisekkirin drusit i taɣult n twuri. Taɣult tesɛa { $intervals } n wakud maca tawuri tesɛa { $inputs ->
            [one] { $inputs } n unekcum
           *[other] { $inputs } n yinekcam
        }.
       *[other] Tisekkirin drusit i taɣult n twuri. Taɣult tesɛa { $intervals } n wakuden maca tawuri tesɛa { $inputs ->
            [one] { $inputs } n unekcum
           *[other] { $inputs } n yinekcam
        }.
    }

function-domain-invalid-format = Amasal arameɣtu n taɣult n twuri.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Azal afellay ur nelli d amḍin n twuri yettwazgel.
        [minimum] Azal adday ur nelli d amḍin n twuri yettwazgel.
        [extremum] Azal aneggaru ur nelli d amḍin n twuri yettwazgel.
        [point] Tanqiḍt ur nelli d tamḍint n twuri tettwazgel.
        [slope] Asuddem ur nelli d amḍin n twuri yettwazgel.
       *[other] { $type } ur nelli d amḍin n twuri yettwazgel.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Azal afellay ilem n twuri yettwazgel.
        [minimum] Azal adday ilem n twuri yettwazgel.
        [extremum] Azal aneggaru ilem n twuri yettwazgel.
        [point] Tanqiḍt tilemt n twuri tettwazgel.
       *[other] { $type } ilem n twuri yettwazgel.
    }

function-points-too-close = Tawuri tesɛa snat n tenqiḍin qerbent aṭas. Ur yezmir ara ad d-yesbadu tawuri.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Allus n twuri yezmer kan ma amḍan n yinekcam yemṣada d umḍan n tuffɣiwin. Tawuri-agi tesɛa { $inputs } n unekcum d { $outputs ->
            [one] { $outputs } n tuffɣa
           *[other] { $outputs } n tuffɣiwin
        }.
       *[other] Allus n twuri yezmer kan ma amḍan n yinekcam yemṣada d umḍan n tuffɣiwin. Tawuri-agi tesɛa { $inputs } n yinekcam d { $outputs ->
            [one] { $outputs } n tuffɣa
           *[other] { $outputs } n tuffɣiwin
        }.
    }

## `<sequence>`

sequence-invalid-length = Teɣzi tarameɣtut n useddi.  Ilaq ad tili d amḍan ummid ur nelli ddaw n wamdun.

sequence-invalid-step = Asurif arameɣtu n useddi.  Ilaq ad yili d amḍan i useddi n unaw { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" tarameɣtut n useddi n yimḍanen.  Ilaq ad tili d amḍan.

sequence-invalid-endpoint-letters = "{ $attribute }" tarameɣtut n useddi n yisekkilen.  Ilaq ad tili d asdukkel n yisekkilen.

sequence-invalid-endpoint = "{ $attribute }" tarameɣtut n useddi.

select-from-sequence-coprime-not-numbers = coprime yettwazgel acku ur ttwafernen ara yimḍanen

select-from-sequence-coprime-with-exclude-combinations = coprime yettwazgel acku excludeCombinations yettwafren

## Resolving a `target`

target-not-found = Iswi arameɣtu n `<{ $source }>`: iswi ur yettwaf ara.

target-state-variable-not-found = Iswi arameɣtu n `<{ $source }>`: ur yettwaf ara umuti n waddad i yettusemman "{ $property }" deg `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Imutiyen n `<odeSystem>` ilaq ad mgarraden d umuti ilelli.

ode-system-duplicate-variable-names = Ur yezmir ara ad d-yesbadu tiwuriwin ODE RHS s yismawen n yimutiyen yettwalsen.

ode-system-rhs-function-error = Ur yezmir ara ad d-yesbadu tawuri ODE RHS.  Tuccḍa deg usnulfu n twuri mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ur yezmir ara ad d-yesbadu tiɣmert gar { $count } n yizirigen

angle-invalid-through-point = Tanqiḍt tarameɣtut deg through n `<angle>`

parabola-vertex-too-many-points = Tapirabult s uqerru i yettɛeddin ɣef ugar n yiwet n tenqiḍt ur tettwaxdem ara.

parabola-too-many-points = Tapirabult i yettɛeddin ɣef ugar n tlata n tenqiḍin ur tettwaxdem ara.

intersection-too-many-items = Amgadal n ugar n snat n tɣawsiwin ur yettwaxdem ara

## Other math components

ionic-compound-not-two-ions = Asdukkel ayunan ur nelli n sin n yiyunen ur yettwaxdem ara.

ionic-compound-needs-cation-and-anion = Asdukkel ayunan yettwaxdem kan i yiwen n ukatyun d yiwen n unyun.

solve-equations-cannot-evaluate = Ur yezmir ara ad yefru tagda acku ur yezmir ara ad tt-yeskyed: { $equation }

math-operators-operand-number-required = Ilaq ad tferneḍ operandNumber ticki tekksed operand tusnakt.

eigen-decomposition-failed = Ur yezmir ara ad yesiḍen azalen eigen n tegrurt

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: aɣewwar { $parameters } ulac-it deg umasal, ihi ad yemṣada yal tikkelt d wadeg ilem.
       *[other] `<matchesPattern>`: iɣewwaren { $parameters } ulac-iten deg umasal, ihi ad mṣadan yal tikkelt d wadeg ilem.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ur yezmir ara ad yegzu grid="{ $grid }". Ilaq ad yili d none, medium, dense, neɣ sin n yimḍanen ufrinen yettwabḍan s tallunt, am grid="1 0.5". Ulac tarakna i yettwasuddmen.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ur yettusefrak ara deg umsken prefigure; yettwaseqdec uskar right.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ur yettusefrak ara deg umsken prefigure; yettwaseqdec uskar top.

prefigure-invalid-axis-bounds = `<graph>`: tilisa n tegrarin d tirameɣtuyin i usnifel prefigure; yettwaseqdec bbox amezwer (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: tehri tarameɣtut i usnifel prefigure; tettwaseqdec tehri tamezwert 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio arameɣtu i usnifel prefigure; yettwaseqdec uskan amezwer 1.

prefigure-grid-spacing-too-fine = `<graph>`: tallunt n trakna d tamecṭuḥt aṭas i tlisa n tegrarin; tarakna tettwaǧǧa deg umsken prefigure.

prefigure-annotations-not-rendered = `<graph>`: tizmilin ur ttwaskanent ara ticki ur yettwaseqdec ara umsken PreFigure.

multiple-annotations-children = Ttwafen waṭas n warraw `<annotations>` deg `<graph>`; akk slid aneggaru ttwazglen.

## Referring to other components

copy-unrecognized-component-type = Ur yezmir ara ad yesiɣzef neɣ ad yenɣel anaw n uferdis ur nettwassen ara: { $type }.

copy-prop-not-found = Ur yettwaf ara umeslay { $property } deg uferdis n unaw { $component }

collect-no-source = Ur yettwaf ara uɣbalu i collect.

collect-invalid-component-type = Ur yezmir ara ad yesdukkel iferdisen n unaw `<{ $component }>` acku d anaw n uferdis arameɣtu.

reference-index-unavailable = Ur yezmir ara ad yemmel amḍan `{ $reference }`

## `<callAction>`

component-action-unavailable = Ur yezmir ara ad d-yessiwel { $action } deg uferdis `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Isefka sɛan amasal arameɣtu.  Izirigen sɛan teɣzi ur nemṣada ara. Yettwaf deg componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Isefka sɛan ismawen n tegjda yettwalsen.  Yettwaf deg componentIdx :{ $componentIdx }

data-frame-missing-column-name = Isefka ulac ɣur-sen isem n tgejdit.  Yettwaf deg componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award n tririt-agi yebna ɣef tririt n tebzimt answer s timmad-is, ayen ara d-yawin tikli ur nettwagan ara.

answer-max-num-attempts-in-section-wide-check-work = Asers n `maxNumAttempts` deg `<answer>` yellan deg umatar i yesɛan `sectionWideCheckWork` ulac fell-as azal, acku amḍan n yiɛraḍen yettwaseyyer s umatar. Sers `maxNumAttempts` deg umatar.

nested-section-wide-check-work-max-num-attempts = Asers n `maxNumAttempts` deg umatar i yesɛan `sectionWideCheckWork` yellan deg wayeḍ i yesɛan `sectionWideCheckWork` ulac fell-as azal, acku amḍan n yiɛraḍen yettwaseyyer s umatar n beṛṛa. Sers `maxNumAttempts` deg umatar n beṛṛa.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Ameslay { $attributes } ur yesɛi ara azal war symbolicEquality.
       *[other] Imeslayen { $attributes } ur sɛin ara azal war symbolicEquality.
    }

answer-invalid-type = Anaw arameɣtu n tririt: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Imi uferdis `<{ $component }>` ulac ɣur-s isem, ur yezmir ara ad yettwaseqdec d ameslay n module

module-attribute-name-already-defined = Aferdis `<{ $component } name="{ $name }">` ur yezmir ara ad yettwaseqdec d ameslay n module acku anaw n uferdis `<module>` yesɛa yakan ameslay "{ $name }".

conditional-content-condition-ignored = Ameslay `condition` yettwazgel deg uferdis `<conditionalContent>` i yesɛan arraw case neɣ else.

slider-markers-type-mismatch = Anaw n yizamulen ur yemṣada ara d unaw n slider.

pretzel-problem-needs-statement-and-answer = pretzel arameɣtu: yal `<problem>` ilaq ad yesɛu yiwen `<statement>` d yiwen `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel arameɣtu: deg mode="circuit", `<problem>` amezwaru ur yezmir ara ad yili d asexser.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Azal arameɣtu { $values } n umeslay `{ $attribute }`; yettwazgel.
       *[other] Azalen irameɣtuyen { $values } n umeslay `{ $attribute }`; ttwazglen.
    }

attribute-must-be-references = Azal arameɣtu `{ $value }` n umeslay `{ $attribute }`. Ameslay ilaq ad yebnu ɣef tmeɣṛiwin i yebdan s `$`.

math-input-invalid-function-names = <mathInput>: ismawen n twuriwin irameɣtuyen ttwazglen deg { $attribute }: { $names }. Aḥric n uskan n yal isem ilaq ad yesɛu ma drus sin n yisekkilen (isekkilen neɣ ijerriden); `|<mathspeak alternative>` yezmer ad yeḍfer.

## Building components from the source

component-type-invalid = Anaw arameɣtu n uferdis: `<{ $componentType }>`

attribute-repeated = Ur yezmir ara ad yales ameslay { $attribute }.

attribute-invalid-for-component = Ameslay arameɣtu "{ $attribute }" i uferdis n unaw `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Tabadut n uɣanib { $styleNumber } ulac ɣur-s amgirred ineǧmen n { $context ->
        [text-on-background] initen n uḍris ɣef yiniten n ugilal
        [high-contrast] initen n umgirred ameqqran ɣef tfelwit
        [line] initen n yizirig ɣef tfelwit
        [marker] initen n uzamul ɣef tfelwit
       *[text-on-canvas] initen n uḍris ɣef tfelwit
    }{ $mode ->
        [dark] { " (askar aberkan)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ilaq { $threshold }:1 ma drus).

style-definition-dark-mode-text-background-contrast =
    Ɣas akken tabadut n uɣanib { $styleNumber } tefren initen i yesɛan amgirred ineǧmen i uskar amellal, initen n uskar aberkan i d-yekkan seg wazalen-agi ulac ɣur-sen amgirred ineǧmen gar yiniten n uḍris d yiniten n ugilal ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ilaq { $threshold }:1 ma drus). { $suggestion ->
        [available] Akken amgirred ad yineǧ deg uskar aberkan, semɣer amgirred n uskar amellal (amedya, sers { $lightAttribute }="{ $lightColor }") neɣ beddel initen n uskar aberkan (amedya, sers { $darkAttribute }="{ $darkColor }").
       *[none] Akken amgirred ad yineǧ deg uskar aberkan, semɣer amgirred n uskar amellal neɣ beddel initen i d-yekkan s textColorDarkMode d/neɣ backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ɣas akken tabadut n uɣanib { $styleNumber } tefren initen n uḍris i yesɛan amgirred ineǧmen i uskar amellal, initen n uḍris n uskar aberkan i d-yekkan seg wazal-agi ulac ɣur-sen amgirred ineǧmen ɣef tfelwit ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ilaq { $threshold }:1 ma drus). { $suggestion ->
        [available] Akken amgirred ad yineǧ deg uskar aberkan, semɣer amgirred n uskar amellal (amedya, sers textColor="{ $lightColor }") neɣ beddel initen n uskar aberkan (amedya, sers textColorDarkMode="{ $darkColor }").
       *[none] Akken amgirred ad yineǧ deg uskar aberkan, semɣer amgirred n uskar amellal neɣ beddel initen i d-yekkan s textColorDarkMode.
    }

section-multiple-style-palettes = Tigezmi tezmer ad tefren yiwen `<stylePalette>` kan; yettwaseqdec aneggaru.

## Unique variants

variant-num-to-select-not-non-negative-integer = ur yezmir ara ad yissin tilɣa tummiḍin n { $component } acku numToSelect mačči d amḍan ummid ur nelli ddaw n wamdun.

variant-num-to-select-not-constant-number = ur yezmir ara ad yissin tilɣa tummiḍin n { $component } acku numToSelect mačči d amḍan ubdid.

variant-with-replacement-not-constant-boolean = ur yezmir ara ad yissin tilɣa tummiḍin n { $component } acku withReplacement mačči d boolean ubdid.

variant-select-weight-disables-unique = Tilɣa tummiḍin n select ttwasensent ma yella ufran i yesɛan selectWeight neɣ selectForVariants

variant-coprime-undetermined = ur yezmir ara ad yissin tilɣa tummiḍin n { $component } acku ur yezmir ara ad yissin ma coprime d lekdeb yal tikkelt.

variant-attribute-not-constant = ur yezmir ara ad yissin tilɣa tummiḍin n { $component } acku { $attribute } ur yeqqim ara am akken.

variant-attribute-not-number = ur yezmir ara ad yissin tilɣa tummiḍin n { $component } acku { $attribute } mačči d amḍan.

variant-attribute-wrong-type-for-sequence =
    ur yezmir ara ad yissin tilɣa tummiḍin n { $component } n unaw { $type } acku { $attribute } mačči d { $expected ->
        [letters-combination] asdukkel n yisekkilen
        [math-expression] tanfalit tusnakt yettusirgen
        [integer] amḍan ummid
       *[number] amḍan
    }.

variant-length-not-integer = ur yezmir ara ad yissin tilɣa tummiḍin n { $component } acku length mačči d amḍan ummid.

variant-sort-not-implemented = tilɣa tummiḍin n { $component } i yesɛan sort ur ttwaxedment ara

variant-exclude-combinations-not-implemented = tilɣa tummiḍin n { $component } i yesɛan excludeCombinations ur ttwaxedment ara

variant-math-exclude-not-implemented = tilɣa tummiḍin n { $component } n unaw math i yesɛan exclude ur ttwaxedment ara

variant-non-constant-exclude-not-implemented = tilɣa tummiḍin n { $component } i yesɛan exclude ubeddal ur ttwaxedment ara

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ur yettusefrak ara deg umsken graph prefigure; amdur yettwaǧǧa.

prefigure-descendant-invalid-geometry = { $subject }: tanzeggit ur nfukk neɣ ur nemmid; amdur yettwaǧǧa.

prefigure-curve-label-omitted = { $subject }: tibzimin ur ttusefrakent ara deg yiferdisen n uknan yettusnifel; tabzimt tettwaǧǧa.

prefigure-curve-unsupported-definition-type = { $subject }: anaw n tbadut n twuri n uknan '{ $definitionType }' ur yettusefrak ara; amdur yettwaǧǧa.

prefigure-region-flip-functions-unsupported = { $subject }: ameslay flipFunctions deg regionBetweenCurves ur yettusefrak ara; amdur yettwaǧǧa.

prefigure-region-non-formula-child = { $subject }: d tiwuriwin n warraw n unaw formula kan i yettusefraken deg regionBetweenCurves; amdur yettwaǧǧa.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' ur yettusefrak ara i { $labelKind ->
        [line-family] tebzimt n twacult n yizirigen
       *[point] tebzimt n tenqiḍt
    }; yettwaseqdec umṣadi amezwer n PreFigure.

prefigure-fill-style-unsupported = { $subject }: aɣanib n uččar '{ $fillStyle }' ur yettusefrak ara s PreFigure; yettwaɣal ɣer uččar aqqur.

prefigure-line-style-unknown = { $subject }: aɣanib n yizirig ur nettwassen '{ $lineStyle }' yettwaǧǧa deg tuffɣa n PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: aɣanib n uzamul '{ $markerStyle }' yettwasnifel ɣer uɣanib PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: aɣanib n uzamul '{ $markerStyle }' ur yettusefrak ara s PreFigure; yettwaseqdec uɣanib amezwer.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` arameɣtu; ur yezmir ara ad yaf iswi. Tazmilt tettwaǧǧa.

annotation-ref-multiple-targets = `<annotation>`: `ref` yemmel waṭas n yiswiyen; yettwaseqdec amezwaru.

annotation-ref-outside-graph = `<annotation>`: `ref` arameɣtu; iswi yella beṛṛa n graph i t-yeṭṭfen. Tazmilt tettwaǧǧa.

annotation-ref-unsupported-target = `<annotation>`: `ref` arameɣtu; iswi mačči d taɣawsa n tugna yettusefraken deg usnifel prefigure. Tazmilt tettwaǧǧa.

annotation-text-missing = `<annotation>`: `text` ulac-it neɣ d ilem; tettwasuffeɣ-d aḍris ilem.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Yettwaf usteɛmel awinsan.
       *[other] Yettwaf usteɛmel awinsan i yesɛan aferdis `<{ $componentType }>`.
    }

reference-no-referent = Ulac acemma yettwafen i tmeɣṛit: `{ $reference }`

reference-multiple-referents = Ttwafen waṭas n tɣawsiwin i tmeɣṛit: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Amasal arameɣtu n umeslay { $attribute } n `<{ $componentType }>`.

children-invalid = Arraw irameɣtuyen n `<{ $componentType }>`: Ttwafen warraw irameɣtuyen: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Azal arameɣtu `{ $value }` n umeslay `{ $attribute }`, yettwaseqdec wazal `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Lqem DoenetML { $version } ur yettwaf ara.
       *[other] Lqem DoenetML { $version } ur yettwaf ara. Yettwaɣal ɣer lqem { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML arameɣtu: { $content }

parse-tag-missing-close-tag = DoenetML arameɣtu: Tabzimt `{ $tag }` ulac ɣur-s tabzimt n umdal. Yettwaṛǧa ubzim i yettmedlen s timmad-is neɣ tabzimt `</{ $tagName }>`.

parse-tag-error = DoenetML arameɣtu: Tuccḍa deg tebzimt `<{ $tagName }>`

parse-attribute-missing-value = DoenetML arameɣtu: Ameslay arameɣtu `{ $attribute }` yettban am akken ulac ɣur-s azal.

parse-attribute-invalid = DoenetML arameɣtu: Ameslay arameɣtu `{ $attribute }`

parse-attribute-value-invalid = DoenetML arameɣtu: Azal n umeslay arameɣtu `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML arameɣtu: Azal n umeslay arameɣtu `{ $value }`. Ticraḍ n tebdert ur mṣadant ara. Yettban am akken yexṣeṛ `{ $quote }`

parse-open-tag-name-missing = DoenetML arameɣtu: Tettwaf tebzimt war isem, amedya `<`

parse-tag-not-closed = DoenetML arameɣtu: Tabzimt `{ $tag }` ur tettwamdel ara (yettban am akken yexṣeṛ `>`).

parse-self-closing-tag-name-missing = DoenetML arameɣtu: Tettwaf tebzimt war isem `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML arameɣtu: Tabzimt `{ $tag }` ur tettwamdel ara (yettban am akken yexṣeṛ `/>`).

parse-tag-invalid-attributes = DoenetML arameɣtu: Tabzimt `{ $tag }` ur tettusireg ara. Tezmer ad tesɛu imeslayen irameɣtuyen.

parse-close-tag-name-missing = DoenetML arameɣtu: Tettwaf tebzimt n umdal war isem, amedya `</`

parse-attribute-value-unquoted = Azalen n yimeslayen ilaq ad ilin gar ticraḍ n tebdert: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML arameɣtu: Tettwaf tebzimt n umdal `{ $tag }`, maca ulac tabzimt n uldi i tt-yemṣadan

parse-close-tag-mismatched = DoenetML arameɣtu: Tabzimt n umdal ur temṣada ara. Yettwaṛǧa `</{ $expected }>`. Yettwaf `{ $found }`

parser-node-unconvertible = Ur yezmir ara ad yesnifel anagraw { $node } ɣer unagraw Dast.

## Names

name-attribute-invalid =
    Isem n umeslay d arameɣtu name='{ $name }'. { $reason ->
        [characters] Ismawen zemren ad sɛun kan isekkilen, imḍanen, ijerriden n wadda neɣ ijerriden.
       *[start] Ismawen ilaq ad bdun s usekkil.
    }

component-name-invalid-start = Isem n uferdis d arameɣtu "{ $name }". Ismawen ilaq ad bdun s usekkil.

## `<answer>` sugar

answer-video-watched-missing-video = Tiririt n unaw videoWatched ilaq ad tesɛu ameslay video

answer-video-watched-video-not-reference = Tiririt n unaw videoWatched ilaq ad tesɛu ameslay video i yellan d tameɣṛit

answer-name-not-single-text = Ameslay name n tririt ilaq ad yesɛu yiwen n warraw n uḍris

## Referencing another document

external-doenetml-recursion-limit = Ur yezmir ara ad d-yawi DoenetML n beṛṛa acku aṭas n yiswiren n wallus. Yella wugar n tmeɣṛit tawinsant?

external-doenetml-unavailable = Ur yezmir ara ad d-yawi DoenetML seg { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML i d-yettwawin seg { $attribute }="{ $uri }" d arameɣtu: ur yemṣada ara d unaw n uferdis "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Ameslay `{ $from }` ur yettwaseqdac ara; seqdec `{ $to }` deg umkan-is.
       *[other] [deprecation] Ameslay `{ $from }` deg `<{ $component }>` ur yettwaseqdac ara; seqdec `{ $to }` deg umkan-is.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Ameslay `{ $from }` ur yettwaseqdac ara yerna yettwazgel acku `{ $to }` yettwafren daɣen.
       *[other] [deprecation] Ameslay `{ $from }` deg `<{ $component }>` ur yettwaseqdac ara yerna yettwazgel acku `{ $to }` yettwafren daɣen.
    }

deprecated-attribute-ignored = [deprecation] Ameslay `{ $attribute }` deg `<{ $component }>` ur yettwaseqdac ara yerna yettwazgel.

deprecated-attribute-to-child = [deprecation] Ameslay `{ $attribute }` deg `<{ $component }>` ur yettwaseqdac ara; seqdec arraw `<{ $child }>` deg umkan-is.

deprecated-attribute-value-renamed = [deprecation] Azal `{ $value }` n umeslay `{ $attribute }` deg `<{ $component }>` ur yettwaseqdac ara; seqdec `{ $to }` deg umkan-is.


## Language coverage

pluralize-english-only = `<pluralize>` tezmer kan ad tesnulfu asget n Teglizit, ihi aḍris-is yettwaǧǧa akken yella deg usemli yuran s { $locale }. Aru talɣa n usget s timmad-is, neɣ sers-itt s umeslay `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Aferdis `<{ $tag }>` mačči d aferdis Doenet yettwassnen.

schema-element-not-allowed-at-root = Aferdis `<{ $tag }>` ur yettusireg ara deg uẓar n usemli.

schema-element-not-allowed-inside = Aferdis `<{ $tag }>` ur yettusireg ara deg `<{ $parent }>`.

schema-attribute-unrecognized = Aferdis `<{ $tag }>` ulac ɣur-s ameslay i yettusemman `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Ameslay `{ $attribute }` n uferdis `<{ $tag }>` ilaq ad yili d umuɣ anda yal taɣawsa d yiwet seg: { $allowed }
       *[other] Ameslay `{ $attribute }` n uferdis `<{ $tag }>` ilaq ad yili d yiwen seg: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Isem n telɣa d arameɣtu i select.  Isem n telɣa { $variantName } yettban deg { $numOptions } n yifranen maca amḍan i yettwafernen d { $numToSelect }.

select-variant-name-without-options = Kra n telɣa ttwafernen i select maca ulac ifranen i yettwafernen i yisem n telɣa i yezmren: { $variantName }.

select-variant-name-not-possible = Isem n telɣa { $variantName } i yettwafernen i select mačči d isem n telɣa i yezmren.

select-too-few-options = Ur yezmir ara ad yefren { $numToSelect } n yiferdisen seg { $numOptions } kan.

select-from-sequence-too-few-values = Ur yezmir ara ad yefren { $numToSelect } n wazalen seg useddi n teɣzi { $length }.

select-from-sequence-indices-count-mismatch = Amḍan n yimḍanen yettwafernen i select ilaq ad yemṣada d umḍan i yettwafernen

select-from-sequence-indices-not-integers = Akk imḍanen yettwafernen i select ilaq ad ilin d imḍanen immiden

select-from-sequence-index-excluded = Amḍan yettwafernen n selectfromsequence yettwakkes

select-from-sequence-indices-excluded-combination = Imḍanen yettwafernen n selectfromsequence llan d asdukkel yettwakksen

select-from-sequence-coprime-not-positive-integers = Ur yezmir ara ad yefren isdukkal coprime acku ur ttwafernen ara yimḍanen immiden ufrinen.

select-from-sequence-coprime-common-factor = Ur yezmir ara ad yefren imḍanen coprime. Akk azalen i yezmren sɛan yiwen n ufakteur. (Azalen yettwafernen n "from" neɣ "to" ilaq ad ilin d coprime d "step".)

select-from-sequence-coprime-single-number = Ur yezmir ara ad yefren isdukkal coprime seg yiwen n umḍan ur nelli d 1.

select-from-sequence-excluded-too-many-combinations = Ttwakksen ugar n 70% n yisdukkal deg selectFromSequence

select-from-sequence-coprime-none-found = Ur yezmir ara ad yefren imḍanen coprime. Akk azalen i yezmren sɛan yiwen n ufakteur.

select-from-sequence-too-few-unique-values = Ur yezmir ara ad yefren { $numToSelect } n wazalen ummiden seg useddi n teɣzi { $numPossibleValues }

select-prime-numbers-too-few-values = Ur yezmir ara ad yefren { $numToSelect } n wazalen seg umuɣ n yimḍanen prime n teɣzi { $numValues }

select-prime-numbers-values-count-mismatch = Amḍan n wazalen yettwafernen i select ilaq ad yemṣada d umḍan i yettwafernen

select-prime-numbers-values-not-prime = Akk azalen yettwafernen i select prime number ilaq ad ilin deg umuɣ n yimḍanen prime

select-prime-numbers-values-excluded-combination = Azalen yettwafernen n selectPrimeNumbers llan d asdukkel yettwakksen

select-prime-numbers-excluded-too-many-combinations = Ttwakksen ugar n 70% n yisdukkal deg selectPrimeNumbers

select-random-combination-fluke = S wayen ur nettwagan ara, ur yezmir ara ad yefren asdukkel n wazalen war afran

select-random-value-fluke = S wayen ur nettwagan ara, ur yezmir ara ad yefren azal war afran
