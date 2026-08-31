# Soga (Olusoga) diagnostics: errors and warnings surfaced to the reader or
# author. Produced by the worker but addressed to whoever is looking at the
# screen, so these are selected by `uiLocale`, not `documentLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** As `chrome.ftl` sets it out: the Lusoga
# Language Authority standard, `dh` written where Luganda writes `z` or `j`
# («okudhuula» for Luganda «okuzuula»), the initial vowel written, Latin
# digits.
#
# DoenetML element, attribute and value names — `through`, `endpoint`,
# `midpointOffset`, `numDimensions`, `symbolicEquality`, `selectFromSequence`,
# `math`, `text`, `number`, `boolean` and the rest — are part of the language
# rather than prose, and stay in English exactly as written. So does the
# `[deprecation]` marker, and so does anything quoted back from the author's
# own source.
#
# **What is Lusoga here.** The frame every message is built on: «Tikisoboka
# …» for *cannot*, «kirekebwa» / «Tuleka …» for *ignored* / *ignoring*,
# «kiteekwa okuba» for *must be*, «tikinnakolebwa» for *has not been
# implemented*, «tikituufu» for *invalid*, «kubanga» for *because*, «naye»
# for *but*, «oba» for *or*, «wakiri» for *at least*, «ekyereere» for
# *empty*, «ensobi» for an error. English's trailing *instead* has no phrase
# here: Lusoga carries it in the bare imperative that follows, so «Teeka
# `maxNumAttempts` ku kitundu» is the whole of it. Native nouns doing
# real work: «olunyiriri» (a source line, a row, and the geometric line),
# «empagi» (a column), «akatonnyeze» (a point), «enkulungo» (a circle),
# «ensonda» (an angle), «omuwendo» (a value), «ekikyuka» (a variable),
# «engeri» (an attribute), «ekika» (a type), «ekitundu» (a component, a
# section, a piece), «olubaawo» (the canvas), «olukalala» (a sequence, a
# list), «enjawulo» (contrast — literally *the difference*), «okudhuula» (to
# find).
#
# **What is borrowed, and from where.** **English**, because that is the
# register a Lusoga speaker does mathematics and computing in — Uganda teaches
# both in English from upper primary. The loans are kept openly rather than
# disguised: «fonkisoni», «vekita», «parabola», «matirikisi», «paramita»,
# «akisi», «ennamba», «tagi», «node», «data», «index». Swahili is **not** the
# loan language in Busoga. Nothing below is an English word respelled to look
# Lusoga: where there was no word and no honest description, the sentence
# keeps the English identifier and describes around it.
#
# **Counts.** CLDR gives `xog` its own plural data, with `one` and `other`.
# Lusoga marks number with a class prefix — «engeri» one attribute,
# «engeri» several but with a different concord on the verb; «omuwendo» one
# value, «emiwendo» several — so both branches of every select differ in more
# than a suffix. `field-function-wrong-num-outputs` keeps the English `[one]`,
# since `xog` really can select it.
#
# **Weakest here.** «okuserengeta» for *slope* and «enjawulo» for *contrast*
# are descriptions rather than established terms, and are the first two words
# a reviewer should attack. «erinnya» for a name may be a Luganda intrusion,
# as `chrome.ftl` says. The third risk is syntactic rather than lexical: the
# long conditional sentences below are Luganda's clause order written with
# Lusoga words, and a speaker should check that Lusoga wants them in that
# order.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } kirekebwa nga obutonnyeze bubiri obw'enkomerero buteekeddwawo
       *[other] { $attributes } birekebwa nga obutonnyeze bubiri obw'enkomerero buteekeddwawo
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } kirekebwa nga akatonnyeze ak'enkomerero n'ak'omu makkati byombi biteekeddwawo
       *[other] { $attributes } birekebwa nga akatonnyeze ak'enkomerero n'ak'omu makkati byombi biteekeddwawo
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset tikikola nga tewali katonnyeze ak'omu makkati

## `<line>`

line-points-undetermined-dimensions = Olunyiriri luyita mu butonnyeze obw'ebipimo ebitamanyiddwa.

line-points-too-few-dimensions = Olunyiriri luteekwa okuyita mu butonnyeze obw'ebipimo wakiri bibiri.

line-points-depend-on-variables = Olunyiriri luyita mu butonnyeze obwesigamye ku bikyuka: { $variables }.

line-equation-invalid-format = Enteekateeka y'ekigereka ky'olunyiriri mu bikyuka { $variable1 } ne { $variable2 } tituufu.

## `<ray>`

ray-overprescribed-through = Akasaale kateekeddwawo na through, endpoint ne direction.  Tuleka through eteekeddwawo.

ray-dimension-mismatch = numDimensions tetuukagana mu kasaale.

## `<vector>`

vector-overprescribed-head = Vekita eteekeddwawo na head, tail ne displacement.  Tuleka head eteekeddwawo.

vector-dimension-mismatch = numDimensions tetuukagana mu vekita.

## Attracting and constraining

attract-to-without-nearest-point = Tikisoboka okusika ku `<{ $component }>` kubanga terina ngeri nearestPoint.

constrain-to-without-nearest-point = Tikisoboka okuziyiza ku `<{ $component }>` kubanga terina ngeri nearestPoint.

constrain-to-interior-without-nearest-point = Tikisoboka okuziyiza munda mu `<{ $component }>` kubanga terina ngeri nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition kirekebwa ku choiceInput etali ya mu lunyiriri

## Ordering children by index

choice-input-indices-count-mismatch = Tuleka indices eziteekeddwawo ku choiceInput kubanga omuwendo gwazo tigutuukagana n'omuwendo gw'abaana ba choice.

pretzel-indices-count-mismatch = Tuleka indices eziteekeddwawo ku problem kubanga omuwendo gwazo tigutuukagana n'omuwendo gw'abaana ba problem.

shuffle-indices-count-mismatch = Tuleka indices eziteekeddwawo ku shuffle kubanga omuwendo gwazo tigutuukagana n'omuwendo gw'ebitundu.

indices-ignored-out-of-range = Tuleka indices eziteekeddwawo ku { $component } kubanga ezimu ziri ebweru w'ekigero.

pretzel-indices-repeated = Tuleka indices eziteekeddwawo ku pretzel kubanga ezimu zidhiddwamu.

pretzel-circuit-first-index = Tuleka indices eziteekeddwawo ku pretzel mu mode="circuit" kubanga ey'olubereberye eteekwa okuba 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Okusobola `<{ $component }>` okukolagana n'abaana b'ebigambo, engeri `type` eteekwa okuteekebwawo.

invalid-type-defaulting-to-math = Ekika { $type } tikituufu ku kitundu { $component }. Kiteekwa okuba math, text, number oba boolean. Tuzzaayo ku math.

string-not-valid-component-to-arrange = Ekigambo "{ $value }" tikiri kitundu kisoboka ku { $component }. Tukireka.

## Types and variables

invalid-type-defaulting-to-number = Ekika { $type } tikituufu, tuteeka ekika ku number.

invalid-variable-value = Omuwendo gw'ekikyuka tigutuufu: `{ $value }`

## Variants

variant-index-must-be-number = Omuwendo gw'ekika { $index } guteekwa okuba ennamba

variant-index-must-be-integer = Omuwendo gw'ekika { $index } guteekwa okuba ennamba entuufu

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` tikinnakolebwa ku bipimo ebinywevu. Tuteeka obugazi ku bugereeranye.

side-by-side-absolute-margins = `<{ $component }>` tikinnakolebwa ku bipimo ebinywevu. Tuteeka enkomerero ku bugereeranye.

side-by-side-no-block-child = `<{ $component }>` tikituufu: kiteekwa okuba n'omwana wakiri omu ow'ekitundu.

## `<label>`

label-for-ignored-on-graphical = Engeri `for` ku `<label>` ey'ekifaanani erekebwa.

label-for-must-resolve-to-one = Engeri `for` ku `<label>` eteekwa okulaga ekitundu kimu kyokka.

label-for-unresolved = Engeri `for` ku `<label>` tesobodde kulaga kitundu.

label-for-answer-with-authored-inputs = Engeri `for` ku `<label>` eraga `<answer>` erina ebiteekeddwamu ebiwandiikiddwa omuwandiisi; laga ekiteekeddwamu kyennyini.

label-for-answer-without-input = Engeri `for` ku `<label>` eraga `<answer>` etalina kiteekeddwamu kya kutuuma rinnya.

label-for-must-reference-input-or-answer = Engeri `for` ku `<label>` eteekwa okulaga ekiteekeddwamu oba eky'okwiramu.

## Accessibility

accessibility-short-description-or-decorative = Olw'okutuukirira, `<{ $component }>` eteekwa okuba n'okunyonyola okumpi oba okuteekebwawo ng'eky'okuwoomya.

accessibility-video-short-description = Olw'okutuukirira, `<video>` eteekwa okuba n'okunyonyola okumpi.

accessibility-input-short-description-or-label = Olw'okutuukirira, `<{ $component }>` eteekwa okuba n'okunyonyola okumpi oba erinnya.

accessibility-answer-input-short-description-or-label = Olw'okutuukirira, `<answer>` ekola ekiteekeddwamu eteekwa okuba n'okunyonyola okumpi oba erinnya.

accessibility-short-description-contains-math = Okunyonyola okumpi tikuteekwa kubaamu bitundu bya bibalo nga `<{ $component }>`. Nyonyola ebibalo n'ebigambo.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } terina njawulo emala ku biwandiike by'omutwe gw'ekitundu (mu ndabika ey'ekizikiza) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kyetaagisa wakiri { $threshold }:1).
       *[other] { $colorName } terina njawulo emala ku biwandiike by'omutwe gw'ekitundu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kyetaagisa wakiri { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Tikinnakolebwa `<circle>` eyita mu butonnyeze { $count } obutalina miwendo gya nnamba.

circle-too-many-through-points = Tikisoboka kubala nkulungo eyita mu butonnyeze obusukka mu busatu.

circle-overprescribed-radius-center-points = Tikisoboka kubala nkulungo erina radius, omukka n'obutonnyeze obuyitibwamu byonna.

circle-center-with-multiple-points = Tikisoboka kubala nkulungo erina omukka eyita mu katonnyeze akasukka mu kamu.

circle-radius-too-small = Tikisoboka kubala nkulungo: olw'okuba ebbanga wakati w'obutonnyeze bubiri ge { $distance }, radius { $radius } eteekeddwawo ntono nnyo.

circle-radius-with-many-points = Tikisoboka kukola nkulungo eyita mu butonnyeze obusukka mu bubiri erina radius eteekeddwawo.

circle-invalid-center-or-through-points = Omukka oba obutonnyeze obuyitibwamu obw'enkulungo tibituufu.

circle-radius-center-with-multiple-points = Tikisoboka kubala radius y'enkulungo erina omukka eyita mu katonnyeze akasukka mu kamu.

circle-change-radius-non-numerical = Tikisoboka kukyusa radius y'enkulungo erina obutonnyeze obutalina miwendo gya nnamba

circle-radius-with-points-non-numerical = Tikisoboka kukola nkulungo eyita mu katonnyeze akasukka mu kamu erina radius eteekeddwawo nga emiwendo gya nnamba tegiriwo.

circle-change-center-non-numerical = Tikinnakolebwa kukyusa mukka gw'enkulungo eyita mu butonnyeze obutalina miwendo gya nnamba.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Ebipimo bya domain ya fonkisoni tibimala. Domain erina ekitundu { $intervals } naye fonkisoni erina { $inputs ->
            [one] ekiteekeddwamu { $inputs }
           *[other] ebiteekeddwamu { $inputs }
        }.
       *[other] Ebipimo bya domain ya fonkisoni tibimala. Domain erina ebitundu { $intervals } naye fonkisoni erina { $inputs ->
            [one] ekiteekeddwamu { $inputs }
           *[other] ebiteekeddwamu { $inputs }
        }.
    }

function-domain-invalid-format = Enteekateeka ya domain ya fonkisoni tetuufu.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Tuleka omuwendo gwa fonkisoni ogusinga obunene ogutali gwa nnamba.
        [minimum] Tuleka omuwendo gwa fonkisoni ogusinga obutono ogutali gwa nnamba.
        [extremum] Tuleka omuwendo gwa fonkisoni ogw'oku nkomerero ogutali gwa nnamba.
        [point] Tuleka akatonnyeze ka fonkisoni akatali ka nnamba.
        [slope] Tuleka okuserengeta kwa fonkisoni okutali kwa nnamba.
       *[other] Tuleka { $type } ya fonkisoni etali ya nnamba.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Tuleka omuwendo gwa fonkisoni ogusinga obunene ogw'ereere.
        [minimum] Tuleka omuwendo gwa fonkisoni ogusinga obutono ogw'ereere.
        [extremum] Tuleka omuwendo gwa fonkisoni ogw'oku nkomerero ogw'ereere.
        [point] Tuleka akatonnyeze ka fonkisoni ak'ereere.
       *[other] Tuleka { $type } ya fonkisoni ey'ereere.
    }

function-points-too-close = Fonkisoni erina obutonnyeze bubiri obuli kumpi nnyo. Tikisoboka kunyonyola fonkisoni.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Okuddiŋŋana kwa fonkisoni kusoboka nga omuwendo gw'ebiteekeddwamu gwenkanankana n'ogw'ebifuluma. Fonkisoni eno erina ekiteekeddwamu { $inputs } n'{ $outputs ->
            [one] ekifuluma { $outputs }
           *[other] ebifuluma { $outputs }
        }.
       *[other] Okuddiŋŋana kwa fonkisoni kusoboka nga omuwendo gw'ebiteekeddwamu gwenkanankana n'ogw'ebifuluma. Fonkisoni eno erina ebiteekeddwamu { $inputs } n'{ $outputs ->
            [one] ekifuluma { $outputs }
           *[other] ebifuluma { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Obuwanvu bw'olukalala tibutuufu.  Buteekwa okuba ennamba entuufu etali wansi wa zeero.

sequence-invalid-step = Entambula y'olukalala tetuufu.  Eteekwa okuba ennamba ku lukalala olw'ekika { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" y'olukalala olw'ennamba tetuufu.  Eteekwa okuba ennamba.

sequence-invalid-endpoint-letters = "{ $attribute }" y'olukalala olw'ennukuta tetuufu.  Eteekwa okuba enkuŋŋaana y'ennukuta.

sequence-invalid-endpoint = "{ $attribute }" y'olukalala tetuufu.

select-from-sequence-coprime-not-numbers = coprime kirekebwa kubanga tetulonda nnamba

select-from-sequence-coprime-with-exclude-combinations = coprime kirekebwa kubanga excludeCombinations eteekeddwawo

## Resolving a `target`

target-not-found = Target ya `<{ $source }>` tetuufu: tikisobose kudhuula target.

target-state-variable-not-found = Target ya `<{ $source }>` tetuufu: tikisobose kudhuula kikyuka ekiyitibwa "{ $property }" ku `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Ebikyuka bya `<odeSystem>` biteekwa obutaba nga ekikyuka ekyeyimirizaawo.

ode-system-duplicate-variable-names = Tikisoboka kunyonyola fonkisoni za ODE RHS ezirina amannya g'ebikyuka agadhiddwamu.

ode-system-rhs-function-error = Tikisoboka kunyonyola fonkisoni ya ODE RHS.  Waliwo ensobi mu kukola fonkisoni ya mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Tikisoboka kunyonyola nsonda wakati w'ennyiriri { $count }

angle-invalid-through-point = Akatonnyeze aka through aka `<angle>` tikatuufu

parabola-vertex-too-many-points = Tikinnakolebwa parabola erina omutwe eyita mu katonnyeze akasukka mu kamu.

parabola-too-many-points = Tikinnakolebwa parabola eyita mu butonnyeze obusukka mu busatu.

intersection-too-many-items = Tikinnakolebwa okusisinkana kw'ebintu ebisukka mu bibiri

## Other math components

ionic-compound-not-two-ions = Tikinnakolebwa nteekateeka ya ayoni etali ya yoni bbiri.

ionic-compound-needs-cation-and-anion = Enteekateeka y'ayoni ekolebwa ku katayoni emu ne anayoni emu zokka.

solve-equations-cannot-evaluate = Tikisoboka kugonjoola kigereka kubanga tikisobose kukigereka: { $equation }

math-operators-operand-number-required = Oteekwa okuteekawo operandNumber ng'oggya operand y'ebibalo.

eigen-decomposition-failed = Tikisobose kubala eigenvalues za matirikisi

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: paramita { $parameters } telabika mu nteekateeka, era etuukagana n'ekyereere buli kiseera.
       *[other] `<matchesPattern>`: paramita { $parameters } tezirabika mu nteekateeka, era zituukagana n'ekyereere buli kiseera.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: tikisobose kutegeera grid="{ $grid }". Eteekwa okuba none, medium, dense, oba ennamba bbiri ezisukka mu zeero ezaawuliddwa n'ebbanga, ng'eno grid="1 0.5". Tewali grid ekubibwa.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` yeetaaga fonkisoni erina { $expected ->
        [one] ekifuluma kimu, okuserengeta ku buli katonnyeze, nga kino `y - x`
       *[other] ebifuluma bibiri, vekita ku buli katonnyeze, nga bino `(y, -x)`
    }, naye fonkisoni gy'eweereddwa erina { $found ->
        [one] ekifuluma { $found }
       *[other] ebifuluma { $found }
    }. { $alternative ->
        [none] Tewali kikubibwa.
       *[other] `<{ $alternative }>` kye kitundu ekya fonkisoni eyo. Tewali kikubibwa.
    }

field-function-attribute-ignored-with-child = Engeri `function` erekebwa kubanga fonkisoni eweereddwa era ne munda mu kitundu; ey'omunda ye ekozesebwa. Wa fonkisoni mu ngeri emu yokka.

field-variables-ignored =
    `<{ $component }>`: engeri `variables` etuuma ebikyuka by'ekiwandiike ekiri munda mu kitundu. { $reason ->
        [function-child] Fonkisoni eri wano eweereddwa ng'omwana `<function>`, atuuma ebikyuka bye, era `variables` erekebwa.
       *[no-expression] Tewali kiwandiike nga kino wano, era `variables` erekebwa.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" tikikolebwako mu mulaga wa prefigure; tuteeka ey'oku ddyo.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" tikikolebwako mu mulaga wa prefigure; tuteeka ey'waigulu.

prefigure-invalid-axis-bounds = `<graph>`: enkomerero za akisi tizituufu ku kukyusa kwa prefigure; tuteeka bbox ey'ebulijjo (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: obugazi tibutuufu ku kukyusa kwa prefigure; tuteeka obugazi bw'ekifaanani obw'ebulijjo 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio tetuufu ku kukyusa kwa prefigure; tuteeka aspect ratio ey'ebulijjo 1.

prefigure-grid-spacing-too-fine = `<graph>`: ebbanga lya grid ttono nnyo ku nkomerero za akisi; grid erekebwa mu mulaga wa prefigure.

prefigure-annotations-not-rendered = `<graph>`: annotations tizikubibwa bw'oba tokozesa mulaga wa PreFigure.

multiple-annotations-children = Badhuuliddwa abaana `<annotations>` bangi mu `<graph>`; bonna okuggyako ow'oku nkomerero barekebwa.

## Referring to other components

copy-unrecognized-component-type = Tikisoboka kwongera oba kukoppa kika kya kitundu ekitamanyiddwa: { $type }.

copy-prop-not-found = Tikisobose kudhuula prop { $property } ku kitundu eky'ekika { $component }

collect-no-source = Tewali nsibuko edhuuliddwa eya collect.

collect-invalid-component-type = Tikisoboka kukuŋŋaanya bitundu bya kika `<{ $component }>` kubanga ekika ekyo tikituufu.

reference-index-unavailable = Tikisoboka kulaga index `{ $reference }`

## `<callAction>`

component-action-unavailable = Tikisoboka kuyita { $action } ku kitundu `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Data erina enteekateeka etatuufu.  Ennyiriri zirina obuwanvu obwawukana. Kidhuuliddwa mu componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data erina amannya g'empagi agadhiddwamu.  Kidhuuliddwa mu componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data ebulwa erinnya ly'empagi.  Kidhuuliddwa mu componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Award y'eky'okwiramu kino yesigamye ku ky'okwiramu kya answer yennyini, ekidha okuleeta ebitasuubirwa.

answer-max-num-attempts-in-section-wide-check-work = Okuteeka `maxNumAttempts` ku `<answer>` eri munda mu kitundu ekirina `sectionWideCheckWork` tikikola, kubanga omuwendo gw'emirundi gutwalibwa ekitundu. Teeka `maxNumAttempts` ku kitundu.

nested-section-wide-check-work-max-num-attempts = Okuteeka `maxNumAttempts` ku kitundu ekirina `sectionWideCheckWork` ekiri munda mu kitundu ekirala ekirina `sectionWideCheckWork` tikikola, kubanga omuwendo gw'emirundi gutwalibwa ekitundu eky'ebweru. Teeka `maxNumAttempts` ku kitundu eky'ebweru.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Engeri { $attributes } tedhakola nga symbolicEquality teteekeddwawo.
       *[other] Engeri { $attributes } tezidhakola nga symbolicEquality teteekeddwawo.
    }

answer-invalid-type = Ekika ky'eky'okwiramu tikituufu: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Olw'okuba ekitundu `<{ $component }>` tikirina rinnya, tikisobola kukozesebwa ng'engeri ya module

module-attribute-name-already-defined = Ekitundu `<{ $component } name="{ $name }">` tikisobola kukozesebwa ng'engeri ya module kubanga ekitundu `<module>` kirina engeri "{ $name }" enyonyoddwa.

conditional-content-condition-ignored = Engeri `condition` erekebwa ku `<conditionalContent>` erina abaana ba case oba else.

slider-markers-type-mismatch = Ekika kya markers tikituukagana n'ekya slider.

pretzel-problem-needs-statement-and-answer = Pretzel tetuufu: buli `<problem>` eteekwa okuba ne `<statement>` emu ne `<answer>` emu.

pretzel-circuit-first-problem-distractor = Pretzel tetuufu: mu mode="circuit", `<problem>` ey'olubereberye tesobola kuba distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Omuwendo { $values } ogw'engeri `{ $attribute }` tigutuufu; tugureka.
       *[other] Emiwendo { $values } egy'engeri `{ $attribute }` tegituufu; tugireka.
    }

attribute-must-be-references = Omuwendo `{ $value }` ogw'engeri `{ $attribute }` tigutuufu. Engeri eteekwa okuba n'ebiraga ebitandika na `$`.

math-input-invalid-function-names = <mathInput>: gaarekeddwa amannya ga fonkisoni agatali matuufu mu { $attribute }: { $names }. Buli rinnya liteekwa okuba n'obubonero wakiri bubiri (ennukuta oba obusaze); bw'oba oyagala oyongerako `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Ekika ky'ekitundu tikituufu: `<{ $componentType }>`

attribute-repeated = Tikisoboka kuddiŋŋana ngeri { $attribute }.

attribute-invalid-for-component = Engeri "{ $attribute }" tiri ya kitundu kya kika `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Enteekateeka y'endabika { $styleNumber } terina njawulo emala ku { $context ->
        [text-on-background] langi y'ebiwandiike ku langi ey'ennyuma
        [high-contrast] langi ey'enjawulo ennene ku lubaawo
        [line] langi y'olunyiriri ku lubaawo
        [marker] langi y'akabonero ku lubaawo
       *[text-on-canvas] langi y'ebiwandiike ku lubaawo
    }{ $mode ->
        [dark] { " (mu ndabika ey'ekizikiza)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kyetaagisa wakiri { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Newankubadde enteekateeka y'endabika { $styleNumber } erina langi ezirina enjawulo emala mu ndabika ey'omusana, langi ez'omu ndabika ey'ekizikiza ezivudde mu zo tizirina njawulo emala wakati wa langi y'ebiwandiike ne langi ey'ennyuma ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kyetaagisa wakiri { $threshold }:1). { $suggestion ->
        [available] Okusobola okuba n'enjawulo emala mu ndabika ey'ekizikiza, yongera enjawulo ey'omu ndabika ey'omusana (ng'ekyokulabirako, teeka { $lightAttribute }="{ $lightColor }") oba okyuse langi ey'omu ndabika ey'ekizikiza (ng'ekyokulabirako, teeka { $darkAttribute }="{ $darkColor }").
       *[none] Okusobola okuba n'enjawulo emala mu ndabika ey'ekizikiza, yongera enjawulo ey'omu ndabika ey'omusana oba okyuse langi ezivuddemu na textColorDarkMode ne/oba backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Newankubadde enteekateeka y'endabika { $styleNumber } erina langi y'ebiwandiike erina enjawulo emala mu ndabika ey'omusana, langi y'ebiwandiike ey'omu ndabika ey'ekizikiza evudde mu yo terina njawulo emala ku lubaawo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kyetaagisa wakiri { $threshold }:1). { $suggestion ->
        [available] Okusobola okuba n'enjawulo emala mu ndabika ey'ekizikiza, yongera enjawulo ey'omu ndabika ey'omusana (ng'ekyokulabirako, teeka textColor="{ $lightColor }") oba okyuse langi ey'omu ndabika ey'ekizikiza (ng'ekyokulabirako, teeka textColorDarkMode="{ $darkColor }").
       *[none] Okusobola okuba n'enjawulo emala mu ndabika ey'ekizikiza, yongera enjawulo ey'omu ndabika ey'omusana oba okyuse langi evuddemu na textColorDarkMode.
    }

section-multiple-style-palettes = Ekitundu kisobola okulonda <stylePalette> emu yokka; tukozesa ey'oku nkomerero.

## Unique variants

variant-num-to-select-not-non-negative-integer = tikisoboka kumanya bika bitadhiddwamu bya { $component } kubanga numToSelect tiri nnamba ntuufu etali wansi wa zeero.

variant-num-to-select-not-constant-number = tikisoboka kumanya bika bitadhiddwamu bya { $component } kubanga numToSelect tiri nnamba nnywevu.

variant-with-replacement-not-constant-boolean = tikisoboka kumanya bika bitadhiddwamu bya { $component } kubanga withReplacement tiri boolean ennywevu.

variant-select-weight-disables-unique = Ebika ebitadhiddwamu ebya select biziyizibwa nga waliwo ekirondebwa ekirina selectWeight oba selectForVariants ekiteekeddwawo

variant-coprime-undetermined = tikisoboka kumanya bika bitadhiddwamu bya { $component } kubanga tikisoboka kumanya nga coprime buli kiseera tetuufu.

variant-attribute-not-constant = tikisoboka kumanya bika bitadhiddwamu bya { $component } kubanga { $attribute } tinywevu.

variant-attribute-not-number = tikisoboka kumanya bika bitadhiddwamu bya { $component } kubanga { $attribute } tiri nnamba.

variant-attribute-wrong-type-for-sequence =
    tikisoboka kumanya bika bitadhiddwamu bya { $component } eby'ekika { $type } kubanga { $attribute } tiri { $expected ->
        [letters-combination] nkuŋŋaana ya nnukuta
        [math-expression] kiwandiike kya bibalo ekituufu
        [integer] nnamba ntuufu
       *[number] nnamba
    }.

variant-length-not-integer = tikisoboka kumanya bika bitadhiddwamu bya { $component } kubanga length tiri nnamba ntuufu.

variant-sort-not-implemented = tikinnakolebwa kumanya bika bitadhiddwamu bya { $component } ebirina sort

variant-exclude-combinations-not-implemented = tikinnakolebwa kumanya bika bitadhiddwamu bya { $component } ebirina excludeCombinations

variant-math-exclude-not-implemented = tikinnakolebwa kumanya bika bitadhiddwamu bya { $component } eby'ekika math ebirina exclude

variant-non-constant-exclude-not-implemented = tikinnakolebwa kumanya bika bitadhiddwamu bya { $component } ebirina exclude etali nnywevu

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: tikikolebwako mu mulaga wa prefigure owa graph; omwana arekeddwa.

prefigure-descendant-invalid-geometry = { $subject }: enteekateeka tekoma oba tetuukiridde; omwana arekeddwa.

prefigure-curve-label-omitted = { $subject }: amannya tigakolebwako ku nnyiriri enkyamye ezikyusiddwa; erinnya lirekeddwa.

prefigure-curve-unsupported-definition-type = { $subject }: ekika ky'okunyonyola olunyiriri olukyamye '{ $definitionType }' tikikolebwako; omwana arekeddwa.

prefigure-region-flip-functions-unsupported = { $subject }: engeri flipFunctions ku regionBetweenCurves tikikolebwako; omwana arekeddwa.

prefigure-region-non-formula-child = { $subject }: ku regionBetweenCurves kukolebwako fonkisoni ez'ekika kya formula zokka; omwana arekeddwa.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' tikikolebwako ku { $labelKind ->
        [line-family] rinnya ly'eby'olunyiriri
       *[point] rinnya ly'akatonnyeze
    }; tuteeka enteekateeka ya PreFigure ey'ebulijjo.

prefigure-fill-style-unsupported = { $subject }: ekika ky'okudhuza '{ $fillStyle }' tikikolebwako na PreFigure; tuzzaayo ku kudhuza okunywevu.

prefigure-line-style-unknown = { $subject }: ekika ky'olunyiriri '{ $lineStyle }' ekitamanyiddwa kirekeddwa mu bifuluma mu PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: ekika ky'akabonero '{ $markerStyle }' kikyusiddwa mu kika kya PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: ekika ky'akabonero '{ $markerStyle }' tikikolebwako na PreFigure; tuteeka eky'ebulijjo.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` tetuufu; tikisobose kudhuula target. Annotation erekeddwa.

annotation-ref-multiple-targets = `<annotation>`: `ref` eraga targets nnyingi; tukozesa ey'olubereberye.

annotation-ref-outside-graph = `<annotation>`: `ref` tetuufu; target eri ebweru wa graph egitwala. Annotation erekeddwa.

annotation-ref-unsupported-target = `<annotation>`: `ref` tetuufu; target tikiri kintu kya kifaanani ekikolebwako mu kukyusa kwa prefigure. Annotation erekeddwa.

annotation-text-missing = `<annotation>`: `text` ebulwa oba ya kyereere; tuteekamu ebigambo ebyereere.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Kudhuuliddwa okwesigama okwetooloola.
       *[other] Kudhuuliddwa okwesigama okwetooloola okuli mu kitundu `<{ $componentType }>`.
    }

reference-no-referent = Tewali kidhuuliddwa ku kiraga kino: `{ $reference }`

reference-multiple-referents = Bidhuuliddwa ebintu bingi ku kiraga kino: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Enteekateeka y'engeri { $attribute } eya `<{ $componentType }>` tetuufu.

children-invalid = Abaana ba `<{ $componentType }>` tibatuufu: badhuuliddwa abaana abatali batuufu: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Omuwendo `{ $value }` ogw'engeri `{ $attribute }` tigutuufu, tukozesa omuwendo `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Enkola ya DoenetML { $version } tedhuuliddwa.
       *[other] Enkola ya DoenetML { $version } tedhuuliddwa. Tuzzaayo ku nkola { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML tetuufu: { $content }

parse-tag-missing-close-tag = DoenetML tetuufu: Tagi `{ $tag }` terina tagi ya kugiggalawo. Kyali kyetaagisa tagi eyeggalawo oba tagi `</{ $tagName }>`.

parse-tag-error = DoenetML tetuufu: Waliwo ensobi mu tagi `<{ $tagName }>`

parse-attribute-missing-value = DoenetML tetuufu: Engeri `{ $attribute }` etali ntuufu erabika ng'ebulwa omuwendo.

parse-attribute-invalid = DoenetML tetuufu: Engeri `{ $attribute }` tetuufu

parse-attribute-value-invalid = DoenetML tetuufu: Omuwendo gw'engeri `{ $value }` tigutuufu

parse-attribute-value-quote-mismatch = DoenetML tetuufu: Omuwendo gw'engeri `{ $value }` tigutuufu. Obubonero bw'okwawula tibutuukagana. Olabika obulwa `{ $quote }`

parse-open-tag-name-missing = DoenetML tetuufu: Kidhuuliddwa tagi etalina rinnya, nga kino `<`

parse-tag-not-closed = DoenetML tetuufu: Tagi `{ $tag }` teggaddwawo (`>` erabika ng'ebulwa).

parse-self-closing-tag-name-missing = DoenetML tetuufu: Kidhuuliddwa tagi etalina rinnya `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML tetuufu: Tagi `{ $tag }` teggaddwawo (`/>` erabika ng'ebulwa).

parse-tag-invalid-attributes = DoenetML tetuufu: Tagi `{ $tag }` tetuufu. Esobola okuba n'engeri ezitali ntuufu.

parse-close-tag-name-missing = DoenetML tetuufu: Kidhuuliddwa tagi ey'okuggalawo etalina rinnya, nga kino `</`

parse-attribute-value-unquoted = Emiwendo gy'engeri giteekwa okuba mu bubonero bw'okwawula: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML tetuufu: Kidhuuliddwa tagi ey'okuggalawo `{ $tag }`, naye tewali tagi ey'okugulawo egituukagana

parse-close-tag-mismatched = DoenetML tetuufu: Tagi ey'okuggalawo tetuukagana. Kyali kyetaagisa `</{ $expected }>`. Kidhuuliddwa `{ $found }`

parser-node-unconvertible = Tikisobose kukyusa node { $node } okudda mu node ya Dast.

## Names

name-attribute-invalid =
    Erinnya name='{ $name }' tirituufu. { $reason ->
        [characters] Amannya gasobola okuba n'ennukuta, ennamba, obusaze obw'ewansi oba obusaze obw'omu makkati byokka.
       *[start] Amannya gateekwa okutandika n'ennukuta.
    }

component-name-invalid-start = Erinnya ly'ekitundu "{ $name }" tirituufu. Amannya gateekwa okutandika n'ennukuta.

## `<answer>` sugar

answer-video-watched-missing-video = Answer ey'ekika videoWatched eteekwa okuba n'engeri video

answer-video-watched-video-not-reference = Answer ey'ekika videoWatched eteekwa okuba n'engeri video eri ekiraga

answer-name-not-single-text = Engeri name eya answer eteekwa okuba n'omwana omu ow'ebigambo

## Referencing another document

external-doenetml-recursion-limit = Tikisobose kuggya DoenetML ey'ebweru olw'okwetooloola okungi nnyo. Waliwo ekiraga ekyetooloola?

external-doenetml-unavailable = Tikisobose kuggya DoenetML ku { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML eggiddwa ku { $attribute }="{ $uri }" tetuufu: tetuukaganye n'ekika ky'ekitundu "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Engeri `{ $from }` tekyakozesebwa; kozesa `{ $to }`.
       *[other] [deprecation] Engeri `{ $from }` ku `<{ $component }>` tekyakozesebwa; kozesa `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Engeri `{ $from }` tekyakozesebwa era erekebwa kubanga `{ $to }` nayo eteekeddwawo.
       *[other] [deprecation] Engeri `{ $from }` ku `<{ $component }>` tekyakozesebwa era erekebwa kubanga `{ $to }` nayo eteekeddwawo.
    }

deprecated-attribute-ignored = [deprecation] Engeri `{ $attribute }` ku `<{ $component }>` tekyakozesebwa era erekebwa.

deprecated-attribute-to-child = [deprecation] Engeri `{ $attribute }` ku `<{ $component }>` tekyakozesebwa; kozesa omwana `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Omuwendo `{ $value }` ogw'engeri `{ $attribute }` ku `<{ $component }>` tigukyakozesebwa; kozesa `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` esobola okwongera obungi mu Lungereza lwokka, era ebigambo byayo tibikyusibwa mu kiwandiiko ekiwandiikiddwa mu { $locale }. Wandiika obungi wekka, oba obuteeke n'engeri `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Ekitundu `<{ $tag }>` tikiri kitundu kya Doenet ekimanyiddwa.

schema-element-not-allowed-at-root = Ekitundu `<{ $tag }>` tikikkirizibwa ku musingi gw'ekiwandiiko.

schema-element-not-allowed-inside = Ekitundu `<{ $tag }>` tikikkirizibwa munda mu `<{ $parent }>`.

schema-attribute-unrecognized = Ekitundu `<{ $tag }>` tikirina ngeri eyitibwa `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Engeri `{ $attribute }` eya `<{ $tag }>` eteekwa okuba olukalala nga buli kimu kimu ku bino: { $allowed }
       *[other] Engeri `{ $attribute }` eya `<{ $tag }>` eteekwa okuba kimu ku bino: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Erinnya ly'ekika erya select tirituufu.  Erinnya ly'ekika { $variantName } lirabika mu birondebwa { $numOptions } naye omuwendo gw'ebirondebwa gwe { $numToSelect }.

select-variant-name-without-options = Ebika ebimu biteekeddwawo ku select naye tewali birondebwa ebiteekeddwawo ku rinnya ly'ekika erisoboka: { $variantName }.

select-variant-name-not-possible = Erinnya ly'ekika { $variantName } eriteekeddwawo ku select tiriri rinnya lya kika lisoboka.

select-too-few-options = Tikisoboka kulonda bitundu { $numToSelect } mu { $numOptions } byokka.

select-from-sequence-too-few-values = Tikisoboka kulonda miwendo { $numToSelect } mu lukalala olw'obuwanvu { $length }.

select-from-sequence-indices-count-mismatch = Omuwendo gwa indices eziteekeddwawo ku select guteekwa okutuukagana n'omuwendo gw'ebirondebwa

select-from-sequence-indices-not-integers = Indices zonna eziteekeddwawo ku select ziteekwa okuba ennamba entuufu

select-from-sequence-index-excluded = Index ya selectfromsequence eteekeddwawo yali erekeddwa

select-from-sequence-indices-excluded-combination = Indices za selectfromsequence eziteekeddwawo zaali nkuŋŋaana erekeddwa

select-from-sequence-coprime-not-positive-integers = Tikisoboka kulonda nkuŋŋaana za coprime kubanga tetulonda nnamba ezisukka mu zeero.

select-from-sequence-coprime-common-factor = Tikisoboka kulonda nnamba za coprime. Emiwendo gyonna egisoboka girina ekigabanya kimu. (Emiwendo egiteekeddwawo ku "from" oba "to" giteekwa okuba coprime ne "step".)

select-from-sequence-coprime-single-number = Tikisoboka kulonda nkuŋŋaana za coprime mu nnamba emu etali 1.

select-from-sequence-excluded-too-many-combinations = Kwarekebwa enkuŋŋaana ezisukka mu 70% mu selectFromSequence

select-from-sequence-coprime-none-found = Tikisobose kulonda nnamba za coprime. Emiwendo gyonna egisoboka girina ekigabanya kimu.

select-from-sequence-too-few-unique-values = Tikisoboka kulonda miwendo { $numToSelect } egitadhiddwamu mu lukalala olw'obuwanvu { $numPossibleValues }

select-prime-numbers-too-few-values = Tikisoboka kulonda miwendo { $numToSelect } mu lukalala lwa nnamba za prime olw'obuwanvu { $numValues }

select-prime-numbers-values-count-mismatch = Omuwendo gw'emiwendo egiteekeddwawo ku select guteekwa okutuukagana n'omuwendo gw'ebirondebwa

select-prime-numbers-values-not-prime = Emiwendo gyonna egiteekeddwawo ku select prime number giteekwa okuba mu lukalala lwa nnamba za prime

select-prime-numbers-values-excluded-combination = Emiwendo gya selectPrimeNumbers egiteekeddwawo gyali nkuŋŋaana erekeddwa

select-prime-numbers-excluded-too-many-combinations = Kwarekebwa enkuŋŋaana ezisukka mu 70% mu selectPrimeNumbers

select-random-combination-fluke = Ku ngeri etasuubirwa nnyo, tikisobose kulonda nkuŋŋaana ya miwendo egitalondeddwa

select-random-value-fluke = Ku ngeri etasuubirwa nnyo, tikisobose kulonda muwendo ogutalondeddwa

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] `<{ $component }>` kino tikiragibwa kubanga kiri munda mu bibalo era tikiri `inline`. Yongerako `inline` kifuuke olukalala olw'okulondamu, olutuuka munda mu kiwandiike.
        [expanded] `<{ $component }>` kino tikiragibwa kubanga kiri munda mu bibalo era ni `expanded`. Ihawo `expanded`; akasanduuko k'ennyiriri nnyingi tikatuuka munda mu kiwandiike.
        [on-graph] `<{ $component }>` kino tikiragibwa kubanga kiri munda mu bibalo ebikubiddwa ku graph, ekitalina bbanga lya kiteekeddwamu.
       *[relative-width] `<{ $component }>` kino tikiragibwa kubanga kiri munda mu bibalo era kirina obugazi obw'ebugereeranye. Wa obugazi mu bipimo ebinywevu, nga `px`.
    }
