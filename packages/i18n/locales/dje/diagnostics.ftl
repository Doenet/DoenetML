# Zarma diagnostics: errors and warnings surfaced to the reader or author.
# Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element names, attribute names and attribute values — `through`,
# `endpoint`, `midpointOffset`, `numDimensions`, `math`, `text` and the rest —
# are part of the language rather than prose, and stay in English exactly as
# written.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] i ga { $attributes } furu waati kaŋ i na me hinka ci
       *[other] i ga { $attributes } furu waati kaŋ i na me hinka ci
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] i ga { $attributes } furu waati kaŋ i na me nda bindi ci care banda
       *[other] i ga { $attributes } furu waati kaŋ i na me nda bindi ci care banda
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset si goy da bindi si no

## `<line>`

line-points-undetermined-dimensions = Kar kaŋ ga bisa alaama-yaŋ kaŋ i beero mana bay ga.

line-points-too-few-dimensions = Kar ga hima ka bisa alaama-yaŋ kaŋ gonda beeray hinka wala ka bisa.

line-points-depend-on-variables = Kar ga bisa alaama-yaŋ kaŋ ga barmayyaŋ gaay: { $variables }.

line-equation-invalid-format = Kar ekwasiyon dumo si boori { $variable1 } nda { $variable2 } ra.

## `<ray>`

ray-overprescribed-through = I na hayno ci nda through, endpoint nda direction.  I ga through kaŋ i ci furu.

ray-dimension-mismatch = numDimensions si saba hayno ra.

## `<vector>`

vector-overprescribed-head = I na vekteero ci nda head, tail nda displacement.  I ga head kaŋ i ci furu.

vector-dimension-mismatch = numDimensions si saba vekteero ra.

## Attracting and constraining

attract-to-without-nearest-point = I si hin ka candi `<{ $component }>` ga zama a sinda nearestPoint stet barmayyaŋ.

constrain-to-without-nearest-point = I si hin ka haw `<{ $component }>` ga zama a sinda nearestPoint stet barmayyaŋ.

constrain-to-interior-without-nearest-point = I si hin ka haw `<{ $component }>` ra zama a sinda nearestPoint stet barmayyaŋ.

## `<choiceInput>`

choice-input-label-position-ignored = i ga labelPosition furu choiceInput kaŋ manti inline se

## Ordering children by index

choice-input-indices-count-mismatch = I ga indices kaŋ i ci choiceInput se furu zama indices lasaabo si saba nda choice izey lasaabo.

pretzel-indices-count-mismatch = I ga indices kaŋ i ci problem se furu zama indices lasaabo si saba nda problem izey lasaabo.

shuffle-indices-count-mismatch = I ga indices kaŋ i ci shuffle se furu zama indices lasaabo si saba nda hariyey lasaabo.

indices-ignored-out-of-range = I ga indices kaŋ i ci { $component } se furu zama afooyaŋ go taray.

pretzel-indices-repeated = I ga indices kaŋ i ci pretzel se furu zama afooyaŋ ye ka kaa.

pretzel-circuit-first-index = I ga indices kaŋ i ci pretzel se mode="circuit" ra furu zama index sintina ga hima ka ciya 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Zama `<{ $component }>` ma goy nda string izey, i ga hima ka `type` attribute ci.

invalid-type-defaulting-to-math = Type { $type } si boori { $component } se. A ga hima ka ciya math, text, number wala boolean. I ga math goy.

string-not-valid-component-to-arrange = String "{ $value }" manti hari hanno no { $component } se. I g'a furu.

## Types and variables

invalid-type-defaulting-to-number = Type { $type } si boori, i na type daŋ number ga.

invalid-variable-value = Barmayyaŋ hari kaŋ si boori: `{ $value }`

## Variants

variant-index-must-be-number = Dumi index { $index } ga hima ka ciya lasaabu

variant-index-must-be-integer = Dumi index { $index } ga hima ka ciya lasaabu timme

## `<sideBySide>`

side-by-side-absolute-widths = I mana `<{ $component }>` te neesiji timmey se. I na beerayey daŋ neesiji fo-yaŋ ga.

side-by-side-absolute-margins = I mana `<{ $component }>` te neesiji timmey se. I na hirriyey daŋ neesiji fo-yaŋ ga.

side-by-side-no-block-child = `<{ $component }>` si boori: a ga hima ka block ize folloŋ wala ka bisa du.

## `<label>`

label-for-ignored-on-graphical = I ga `for` attribute biiyaŋ `<label>` ga furu.

label-for-must-resolve-to-one = `for` attribute `<label>` ga ga hima ka koy hari folloŋ hinne ga.

label-for-unresolved = `for` attribute `<label>` ga mana hin ka koy hari kulu ga.

label-for-answer-with-authored-inputs = `for` attribute `<label>` ga ga `<answer>` kaŋ gonda inputs kaŋ i hantum ci; ma input bumbo ci.

label-for-answer-without-input = `for` attribute `<label>` ga ga `<answer>` kaŋ sinda input ci.

label-for-must-reference-input-or-answer = `for` attribute `<label>` ga ga hima ka input wala answer ci.

## Accessibility

accessibility-short-description-or-decorative = Duyaŋ se, `<{ $component }>` ga hima ka feerijandi dunbu du wala i m'a ci danga decorative.

accessibility-video-short-description = Duyaŋ se, `<video>` ga hima ka feerijandi dunbu du.

accessibility-input-short-description-or-label = Duyaŋ se, `<{ $component }>` ga hima ka feerijandi dunbu wala maa du.

accessibility-answer-input-short-description-or-label = Duyaŋ se, `<answer>` kaŋ ga input te ga hima ka feerijandi dunbu wala maa du.

accessibility-short-description-contains-math = Feerijandi dunbu-yaŋ si hima ka lasaabu hari-yaŋ du danga `<{ $component }>`. Ma lasaabo hantum nda sanni.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } sinda fayanka kaŋ ga wasa dumbu boŋ sanno se (mode bi) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ga { $threshold }:1 wala ka bisa ŋwaaray).
       *[other] { $colorName } sinda fayanka kaŋ ga wasa dumbu boŋ sanno se ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ga { $threshold }:1 wala ka bisa ŋwaaray).
    }

## `<circle>`

circle-through-points-non-numerical = I mana `<circle>` kaŋ ga bisa alaama { $count } ga te waati kaŋ alaamey sinda lasaabu.

circle-too-many-through-points = I si hin ka windi lasaabu kaŋ ga bisa alaama 3 ka bisa ga.

circle-overprescribed-radius-center-points = I si hin ka windi lasaabu nda radius, bindi nda alaamey care banda.

circle-center-with-multiple-points = I si hin ka windi lasaabu nda bindi kaŋ ga bisa alaama 1 ka bisa ga.

circle-radius-too-small = I si hin ka windo lasaabu: zama nangu kaŋ go alaama hinka game ra ga ti { $distance }, radius { $radius } kaŋ i ci ga kayna gumo.

circle-radius-with-many-points = I si hin ka windi te kaŋ ga bisa alaama hinka ka bisa ga nda radius kaŋ i ci.

circle-invalid-center-or-through-points = Windo bindi wala a alaamey si boori.

circle-radius-center-with-multiple-points = I si hin ka windo radius lasaabu nda bindi kaŋ ga bisa alaama 1 ka bisa ga.

circle-change-radius-non-numerical = I si hin ka windo radius barmay nda alaama-yaŋ kaŋ sinda lasaabu

circle-radius-with-points-non-numerical = I si hin ka windi te kaŋ ga bisa alaama folloŋ ka bisa ga nda radius waati kaŋ lasaabey si no.

circle-change-center-non-numerical = I mana windo bindi barmayyaŋ te kaŋ ga bisa alaama-yaŋ kaŋ sinda lasaabu ga.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Beerayey si wasa fonksiyon domain se. Domain gonda alwaati { $intervals } amma fonksiyono gonda { $inputs ->
            [one] input { $inputs }
           *[other] input { $inputs }
        }.
       *[other] Beerayey si wasa fonksiyon domain se. Domain gonda alwaati { $intervals } amma fonksiyono gonda { $inputs ->
            [one] input { $inputs }
           *[other] input { $inputs }
        }.
    }

function-domain-invalid-format = Fonksiyon domain dumo si boori.

function-ignoring-non-numerical =
    { $type ->
        [maximum] I ga fonksiyono beero kaŋ sinda lasaabu furu.
        [minimum] I ga fonksiyono kaynayaŋo kaŋ sinda lasaabu furu.
        [extremum] I ga fonksiyono meyo kaŋ sinda lasaabu furu.
        [point] I ga fonksiyono alaamo kaŋ sinda lasaabu furu.
        [slope] I ga fonksiyono gungumyaŋo kaŋ sinda lasaabu furu.
       *[other] I ga fonksiyono { $type } kaŋ sinda lasaabu furu.
    }

function-ignoring-empty =
    { $type ->
        [maximum] I ga fonksiyono beero kaŋ sinda hay kulu furu.
        [minimum] I ga fonksiyono kaynayaŋo kaŋ sinda hay kulu furu.
        [extremum] I ga fonksiyono meyo kaŋ sinda hay kulu furu.
        [point] I ga fonksiyono alaamo kaŋ sinda hay kulu furu.
       *[other] I ga fonksiyono { $type } kaŋ sinda hay kulu furu.
    }

function-points-too-close = Fonksiyono gonda alaama hinka kaŋ ga maan care gumo. I si hin ka fonksiyono feeri.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Fonksiyon yeyaŋ ga hin hinne da inputs lasaabo ga saba nda outputs lasaabo. Fonksiyon woo gonda input { $inputs } nda { $outputs ->
            [one] output { $outputs }
           *[other] output { $outputs }
        }.
       *[other] Fonksiyon yeyaŋ ga hin hinne da inputs lasaabo ga saba nda outputs lasaabo. Fonksiyon woo gonda inputs { $inputs } nda { $outputs ->
            [one] output { $outputs }
           *[other] output { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Sequence salaŋo si boori.  A ga hima ka ciya lasaabu timme kaŋ si ganda ziro ga.

sequence-invalid-step = Sequence step si boori.  A ga hima ka ciya lasaabu sequence type { $type } se.

sequence-invalid-endpoint-number = Number sequence "{ $attribute }" si boori.  A ga hima ka ciya lasaabu.

sequence-invalid-endpoint-letters = Letters sequence "{ $attribute }" si boori.  A ga hima ka ciya hantum alaama margayaŋ.

sequence-invalid-endpoint = Sequence "{ $attribute }" si boori.

select-from-sequence-coprime-not-numbers = i ga coprime furu zama i si lasaabu-yaŋ suuban

select-from-sequence-coprime-with-exclude-combinations = i ga coprime furu zama i na excludeCombinations ci

## Resolving a `target`

target-not-found = `<{ $source }>` target si boori: i si hin ka targeto du.

target-state-variable-not-found = `<{ $source }>` target si boori: i si hin ka stet barmayyaŋ kaŋ maa ga ti "{ $property }" du `<{ $component }>` ga.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` barmayyaŋey ga hima ka fay nda barmayyaŋ kaŋ ga tun nga boŋ se.

ode-system-duplicate-variable-names = I si hin ka ODE RHS fonksiyon-yaŋ feeri nda barmayyaŋ maa-yaŋ kaŋ ye ka kaa.

ode-system-rhs-function-error = I si hin ka ODE RHS fonksiyon feeri.  Taali go mathjs fonksiyon teeyaŋ ra.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = I si hin ka kanjari feeri kar { $count } game ra

angle-invalid-through-point = Alaama si boori `<angle>` through ra

parabola-vertex-too-many-points = I mana parabol nda vertex kaŋ ga bisa alaama 1 ka bisa ga te.

parabola-too-many-points = I mana parabol kaŋ ga bisa alaama 3 ka bisa ga te.

intersection-too-many-items = I mana hari hinka ka bisa margayaŋ te

## Other math components

ionic-compound-not-two-ions = I mana iyon margayaŋ te hari fo se kaŋ manti iyon hinka.

ionic-compound-needs-cation-and-anion = I na iyon margayaŋ te katiyon folloŋ nda aniyon folloŋ se hinne.

solve-equations-cannot-evaluate = I si hin ka ekwasiyono feeri zama i si hin k'a lasaabu: { $equation }

math-operators-operand-number-required = I ga hima ka operandNumber ci waati kaŋ i ga lasaabu operand kaa.

eigen-decomposition-failed = I mana hin ka matris aygenvalue-yaŋ lasaabu

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameter { $parameters } si dumo ra, woodin se a ga saba nda nangu koonu alwaati kulu.
       *[other] `<matchesPattern>`: parameters { $parameters } si dumo ra, woodin se i ga saba nda nangu koonu alwaati kulu.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: i si hin ka grid="{ $grid }" faham. A ga hima ka ciya none, medium, dense, wala lasaabu hinka kaŋ go beene ziro ga kaŋ nangu na i fay, danga grid="1 0.5". I si grid kulu te.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" si goy prefigure cabeko ra; i ga kambe ŋwaari kambo goy.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" si goy prefigure cabeko ra; i ga beene kambo goy.

prefigure-invalid-axis-bounds = `<graph>`: aksis hirriyey si boori prefigure se; i ga bbox (-10,-10,10,10) goy.

prefigure-invalid-width = `<graph>`: beeray si boori prefigure se; i ga beeray 425 goy.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio si boori prefigure se; i ga aspekt rasiyo 1 goy.

prefigure-grid-spacing-too-fine = `<graph>`: grid nanguyaŋo ga kayna gumo aksis hirriyey se; i ga grid kaa prefigure cabeko ra.

prefigure-annotations-not-rendered = `<graph>`: i si annotations cabe da i si PreFigure cabeko goy.

multiple-annotations-children = I du `<annotations>` ize boobo `<graph>` ra; i g'i kulu furu kala kaŋ ga ban.

## Referring to other components

copy-unrecognized-component-type = I si hin ka hari dumi kaŋ i mana bay tonton wala ka duplika: { $type }.

copy-prop-not-found = I mana hin ka prop { $property } du hari dumi { $component } ga

collect-no-source = I mana tunyaŋ du collect se.

collect-invalid-component-type = I si hin ka hari dumi `<{ $component }>` margu zama dumo si boori.

reference-index-unavailable = I si hin ka index `{ $reference }` ci

## `<callAction>`

component-action-unavailable = I si hin ka { $action } ce hari `{ $reference }` ga

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Bayrandi dumo si boori.  Karey gonda salaŋ waani-waani. I du a componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Bayrandey gonda kolon maa-yaŋ kaŋ ye ka kaa.  I du a componentIdx :{ $componentIdx }

data-frame-missing-column-name = Kolon maa folloŋ si bayrandey ra.  I du a componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Tuuruyaŋ woo award ga answer tag bumbo tuuruyaŋo kaŋ i samba gaay, woodin ga hari kaŋ ni mana batu kande.

answer-max-num-attempts-in-section-wide-check-work = Da ni na `maxNumAttempts` daŋ `<answer>` kaŋ go hari kaŋ gonda `sectionWideCheckWork` ra ga, a si goy, zama haro din no ga dooni lasaabo gaay. Ma `maxNumAttempts` daŋ haro din ga.

nested-section-wide-check-work-max-num-attempts = Da ni na `maxNumAttempts` daŋ hari kaŋ gonda `sectionWideCheckWork` kaŋ go hari fo kaŋ gonda `sectionWideCheckWork` ra ga, a si goy, zama taray haro no ga dooni lasaabo gaay. Ma `maxNumAttempts` daŋ taray haro ga.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] { $attributes } attribute si goy da i mana symbolicEquality daŋ.
       *[other] { $attributes } attributes si goy da i mana symbolicEquality daŋ.
    }

answer-invalid-type = Tuuruyaŋ type si boori: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Zama hari `<{ $component }>` sinda maa, i si hin k'a goy danga module attribute

module-attribute-name-already-defined = I si hin ka hari `<{ $component } name="{ $name }">` goy danga module attribute zama `<module>` gonda "{ $name }" attribute za jina.

conditional-content-condition-ignored = I ga `condition` attribute furu `<conditionalContent>` kaŋ gonda case wala else izey ga.

slider-markers-type-mismatch = Markers type si saba nda slider type.

pretzel-problem-needs-statement-and-answer = Pretzel si boori: `<problem>` kulu ga hima ka `<statement>` folloŋ nda `<answer>` folloŋ du.

pretzel-circuit-first-problem-distractor = Pretzel si boori: mode="circuit" ra, `<problem>` sintina si hin ka ciya distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Hari { $values } si boori attribute `{ $attribute }` se; i g'a furu.
       *[other] Hari-yaŋ { $values } si boori attribute `{ $attribute }` se; i g'i furu.
    }

attribute-must-be-references = Hari `{ $value }` si boori attribute `{ $attribute }` se. Attribute ga hima ka ciya sanni-yaŋ kaŋ ga sintin nda `$`.

math-input-invalid-function-names = <mathInput>: i ga fonksiyon maa-yaŋ kaŋ si boori furu { $attribute } ra: { $names }. Maa kulu a cabeyaŋ dumbo ga hima ka hantum alaama hinka wala ka bisa du (hantum alaama wala dash); `|<mathspeak alternative>` ga hin k'a gana.

## Building components from the source

component-type-invalid = Hari dumi si boori: `<{ $componentType }>`

attribute-repeated = I si hin ka attribute { $attribute } ye ka ci.

attribute-invalid-for-component = Attribute "{ $attribute }" si boori hari dumi `<{ $componentType }>` se.

## Style definition contrast

style-definition-insufficient-contrast =
    Dumi feerijandi { $styleNumber } sinda fayanka kaŋ ga wasa { $context ->
        [text-on-background] sanni nooro nda banda nooro game ra
        [high-contrast] fayanka beeri nooro nda kanvas game ra
        [line] kar nooro nda kanvas game ra
        [marker] alaama nooro nda kanvas game ra
       *[text-on-canvas] sanni nooro nda kanvas game ra
    }{ $mode ->
        [dark] { " (mode bi)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ga { $threshold }:1 wala ka bisa ŋwaaray).

style-definition-dark-mode-text-background-contrast =
    Baa kaŋ dumi feerijandi { $styleNumber } gonda noor-yaŋ kaŋ gonda fayanka kaŋ ga wasa mode kwaaray se, mode bi noorey kaŋ i kaa i ra sinda fayanka kaŋ ga wasa sanni nooro nda banda nooro game ra ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ga { $threshold }:1 wala ka bisa ŋwaaray). { $suggestion ->
        [available] Zama fayanka ma wasa mode bi ra, ma mode kwaaray fayanka tonton (danga, ma { $lightAttribute }="{ $lightColor }" daŋ) wala ma mode bi nooro barmay (danga, ma { $darkAttribute }="{ $darkColor }" daŋ).
       *[none] Zama fayanka ma wasa mode bi ra, ma mode kwaaray fayanka tonton wala ma noorey barmay nda textColorDarkMode wala backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Baa kaŋ dumi feerijandi { $styleNumber } gonda sanni noor kaŋ gonda fayanka kaŋ ga wasa mode kwaaray se, mode bi sanni nooro kaŋ i kaa a ra sinda fayanka kaŋ ga wasa kanvas ga ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ga { $threshold }:1 wala ka bisa ŋwaaray). { $suggestion ->
        [available] Zama fayanka ma wasa mode bi ra, ma mode kwaaray fayanka tonton (danga, ma textColor="{ $lightColor }" daŋ) wala ma mode bi nooro barmay (danga, ma textColorDarkMode="{ $darkColor }" daŋ).
       *[none] Zama fayanka ma wasa mode bi ra, ma mode kwaaray fayanka tonton wala ma nooro barmay nda textColorDarkMode.
    }

section-multiple-style-palettes = Dumbu ga hin ka <stylePalette> folloŋ hinne suuban; i ga kaŋ ga ban goy.

## Unique variants

variant-num-to-select-not-non-negative-integer = i si hin ka { $component } dumi waani-waaney bay zama numToSelect manti lasaabu timme kaŋ si ganda ziro ga.

variant-num-to-select-not-constant-number = i si hin ka { $component } dumi waani-waaney bay zama numToSelect manti lasaabu kaŋ si barmay.

variant-with-replacement-not-constant-boolean = i si hin ka { $component } dumi waani-waaney bay zama withReplacement manti boolean kaŋ si barmay.

variant-select-weight-disables-unique = I ga select dumi waani-waaney daabu da option fo gonda selectWeight wala selectForVariants

variant-coprime-undetermined = i si hin ka { $component } dumi waani-waaney bay zama i si hin ka bay hala coprime ga ciya tangari alwaati kulu.

variant-attribute-not-constant = i si hin ka { $component } dumi waani-waaney bay zama { $attribute } ga barmay.

variant-attribute-not-number = i si hin ka { $component } dumi waani-waaney bay zama { $attribute } manti lasaabu.

variant-attribute-wrong-type-for-sequence =
    i si hin ka { $component } type { $type } dumi waani-waaney bay zama { $attribute } manti { $expected ->
        [letters-combination] hantum alaama margayaŋ
        [math-expression] lasaabu sanni hanno
        [integer] lasaabu timme
       *[number] lasaabu
    }.

variant-length-not-integer = i si hin ka { $component } dumi waani-waaney bay zama length manti lasaabu timme.

variant-sort-not-implemented = i mana { $component } nda sort dumi waani-waaney te

variant-exclude-combinations-not-implemented = i mana { $component } nda excludeCombinations dumi waani-waaney te

variant-math-exclude-not-implemented = i mana { $component } type math nda exclude dumi waani-waaney te

variant-non-constant-exclude-not-implemented = i mana { $component } nda exclude kaŋ ga barmay dumi waani-waaney te

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: a si goy graph prefigure cabeko ra; i na izo furu.

prefigure-descendant-invalid-geometry = { $subject }: jiyometri si boori wala a mana timme; i na izo furu.

prefigure-curve-label-omitted = { $subject }: maa-yaŋ si goy curve hari-yaŋ kaŋ i barmay ga; i na maa kaa.

prefigure-curve-unsupported-definition-type = { $subject }: curve fonksiyon feerijandi dumi '{ $definitionType }' si goy; i na izo furu.

prefigure-region-flip-functions-unsupported = { $subject }: flipFunctions attribute regionBetweenCurves ga si goy; i na izo furu.

prefigure-region-non-formula-child = { $subject }: formula-dumi ize fonksiyon-yaŋ hinne no ga goy regionBetweenCurves ga; i na izo furu.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' si goy { $labelKind ->
        [line-family] kar dumi maa
       *[point] alaama maa
    } se; i ga PreFigure sinjiyaŋ goy.

prefigure-fill-style-unsupported = { $subject }: PreFigure si toonandi dumi '{ $fillStyle }' bay; i ga toonandi timme goy.

prefigure-line-style-unknown = { $subject }: i si kar dumi '{ $lineStyle }' bay, woodin se i n'a kaa PreFigure ra.

prefigure-marker-style-mapped-to-diamond = { $subject }: i na alaama dumi '{ $markerStyle }' barmay PreFigure dumi 'diamond' ga.

prefigure-marker-style-unsupported = { $subject }: PreFigure si alaama dumi '{ $markerStyle }' bay; i ga dumi kaŋ go no za jina goy.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` si boori; i si hin ka targeto du. I na annotation kaa.

annotation-ref-multiple-targets = `<annotation>`: `ref` du target boobo; i ga sintina goy.

annotation-ref-outside-graph = `<annotation>`: `ref` si boori; targeto go grapho taray. I na annotation kaa.

annotation-ref-unsupported-target = `<annotation>`: `ref` si boori; targeto manti biiyaŋ hari kaŋ prefigure ga bay. I na annotation kaa.

annotation-text-missing = `<annotation>`: `text` si no wala a sinda hay kulu; i ga sanni kaŋ sinda hay kulu hantum.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] I du windi gaayyaŋ.
       *[other] I du windi gaayyaŋ nda hari `<{ $componentType }>`.
    }

reference-no-referent = I mana hay kulu du sanno se: `{ $reference }`

reference-multiple-referents = I du hari boobo sanno se: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Attribute { $attribute } dumo `<{ $componentType }>` se si boori.

children-invalid = `<{ $componentType }>` izey si boori: I du ize-yaŋ kaŋ si boori: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Hari `{ $value }` si boori attribute `{ $attribute }` se, i ga `{ $default }` goy

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] I mana DoenetML dumi { $version } du.
       *[other] I mana DoenetML dumi { $version } du. I ga dumi { $fallback } goy
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML si boori: { $content }

parse-tag-missing-close-tag = DoenetML si boori: Tag `{ $tag }` sinda daabuyaŋ tag. I ga batu tag kaŋ ga nga boŋ daabu wala tag `</{ $tagName }>`.

parse-tag-error = DoenetML si boori: Taali go tag `<{ $tagName }>` ra

parse-attribute-missing-value = DoenetML si boori: Attribute `{ $attribute }` si boori, a ga cabe danga a sinda hari.

parse-attribute-invalid = DoenetML si boori: Attribute `{ $attribute }` si boori

parse-attribute-value-invalid = DoenetML si boori: Attribute haro `{ $value }` si boori

parse-attribute-value-quote-mismatch = DoenetML si boori: Attribute haro `{ $value }` si boori. Kwot alaamey si saba. A ga cabe danga `{ $quote }` si no

parse-open-tag-name-missing = DoenetML si boori: I du tag kaŋ sinda maa, danga `<`

parse-tag-not-closed = DoenetML si boori: I mana tag `{ $tag }` daabu (a ga cabe danga `>` si no).

parse-self-closing-tag-name-missing = DoenetML si boori: I du tag kaŋ sinda maa `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML si boori: I mana tag `{ $tag }` daabu (a ga cabe danga `/>` si no).

parse-tag-invalid-attributes = DoenetML si boori: Tag `{ $tag }` si boori. A ga hin ka attributes kaŋ si boori du.

parse-close-tag-name-missing = DoenetML si boori: I du daabuyaŋ tag kaŋ sinda maa, danga `</`

parse-attribute-value-unquoted = Attribute hari-yaŋ ga hima ka goro kwot alaamey ra: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML si boori: I du daabuyaŋ tag `{ $tag }`, amma feeriyaŋ tag si no

parse-close-tag-mismatched = DoenetML si boori: Daabuyaŋ tag si saba. I ga batu `</{ $expected }>`. I du `{ $found }`

parser-node-unconvertible = I si hin ka node { $node } barmay Dast node ga.

## Names

name-attribute-invalid =
    Attribute name='{ $name }' si boori. { $reason ->
        [characters] Maa-yaŋ ga hin ka hantum alaama, lasaabu, ganda hirri wala hirri hinne du.
       *[start] Maa-yaŋ ga hima ka sintin nda hantum alaama.
    }

component-name-invalid-start = Hari maa "{ $name }" si boori. Maa-yaŋ ga hima ka sintin nda hantum alaama.

## `<answer>` sugar

answer-video-watched-missing-video = Answer type videoWatched ga hima ka video attribute du

answer-video-watched-video-not-reference = Answer type videoWatched ga hima ka video attribute kaŋ ga ti sanni du

answer-name-not-single-text = Answer name attribute ga hima ka text ize folloŋ hinne du

## Referencing another document

external-doenetml-recursion-limit = I mana hin ka taray DoenetML du zama yeyaŋ ga baa gumo. Windi sanni go no?

external-doenetml-unavailable = I mana hin ka DoenetML du { $attribute }="{ $uri }" ra

external-doenetml-type-mismatch = DoenetML kaŋ i du { $attribute }="{ $uri }" ra si boori: a si saba nda hari dumi "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` zeen; ma `{ $to }` goy.
       *[other] [deprecation] Attribute `{ $from }` `<{ $component }>` ga zeen; ma `{ $to }` goy.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` zeen nda i g'a furu zama `{ $to }` mo go no.
       *[other] [deprecation] Attribute `{ $from }` `<{ $component }>` ga zeen nda i g'a furu zama `{ $to }` mo go no.
    }

deprecated-attribute-ignored = [deprecation] Attribute `{ $attribute }` `<{ $component }>` ga zeen nda i g'a furu.

deprecated-attribute-to-child = [deprecation] Attribute `{ $attribute }` `<{ $component }>` ga zeen; ma `<{ $child }>` ize goy.

deprecated-attribute-value-renamed = [deprecation] Hari `{ $value }` attribute `{ $attribute }` wano `<{ $component }>` ga zeen; ma `{ $to }` goy.


## Language coverage

pluralize-english-only = `<pluralize>` ga hin ka Inglisi hinne baayaŋ te, woodin se a ga sanno naŋ danga mate kaŋ ni n'a hantum tira kaŋ i hantum { $locale } ra. Ma baayaŋ dumo hantum bumbo, wala m'a daŋ nda `pluralForm` attribute.


## Checking against the schema

schema-element-unrecognized = Hari `<{ $tag }>` manti Doenet hari kaŋ i ga bay.

schema-element-not-allowed-at-root = I si yadda nda hari `<{ $tag }>` tira boŋo ga.

schema-element-not-allowed-inside = I si yadda nda hari `<{ $tag }>` `<{ $parent }>` ra.

schema-attribute-unrecognized = Hari `<{ $tag }>` sinda attribute kaŋ maa ga ti `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Attribute `{ $attribute }` hari `<{ $tag }>` wano ga hima ka ciya lisi kaŋ a hari kulu ga ti afo woone yaŋ ra: { $allowed }
       *[other] Attribute `{ $attribute }` hari `<{ $tag }>` wano ga hima ka ciya afo woone yaŋ ra: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Select dumi maa si boori.  Dumi maa { $variantName } ga cabe option { $numOptions } ra amma suubanyaŋ lasaabo ga ti { $numToSelect }.

select-variant-name-without-options = I na dumi fo-yaŋ ci select se amma i mana option kulu ci dumi maa kaŋ ga hin ka bara se: { $variantName }.

select-variant-name-not-possible = Dumi maa { $variantName } kaŋ i ci select se manti dumi maa kaŋ ga hin ka bara.

select-too-few-options = I si hin ka hari { $numToSelect } suuban { $numOptions } hinne ra.

select-from-sequence-too-few-values = I si hin ka hari { $numToSelect } suuban sequence kaŋ salaŋ ga ti { $length } ra.

select-from-sequence-indices-count-mismatch = Indices lasaabo kaŋ i ci select se ga hima ka saba nda suubanyaŋ lasaabo

select-from-sequence-indices-not-integers = Indices kulu kaŋ i ci select se ga hima ka ciya lasaabu timme-yaŋ

select-from-sequence-index-excluded = I na selectfromsequence index kaŋ i kaa ci

select-from-sequence-indices-excluded-combination = I na selectfromsequence indices kaŋ ga ti margayaŋ kaŋ i kaa ci

select-from-sequence-coprime-not-positive-integers = I si hin ka coprime margayaŋ suuban zama i si lasaabu timme kaŋ go beene ziro ga suuban.

select-from-sequence-coprime-common-factor = I si hin ka coprime lasaabu-yaŋ suuban. Hari kulu kaŋ ga hin ka bara gonda faktoor folloŋ. ("from" wala "to" hari-yaŋ kaŋ i ci ga hima ka ciya coprime nda "step".)

select-from-sequence-coprime-single-number = I si hin ka coprime margayaŋ suuban lasaabu folloŋ kaŋ manti 1 ra.

select-from-sequence-excluded-too-many-combinations = I na margayaŋ 70% ka bisa kaa selectFromSequence ra

select-from-sequence-coprime-none-found = I mana hin ka coprime lasaabu-yaŋ suuban. Hari kulu kaŋ ga hin ka bara gonda faktoor folloŋ.

select-from-sequence-too-few-unique-values = I si hin ka hari waani { $numToSelect } suuban sequence kaŋ salaŋ ga ti { $numPossibleValues } ra

select-prime-numbers-too-few-values = I si hin ka hari { $numToSelect } suuban praym lisi kaŋ salaŋ ga ti { $numValues } ra

select-prime-numbers-values-count-mismatch = Hari-yaŋ lasaabo kaŋ i ci select se ga hima ka saba nda suubanyaŋ lasaabo

select-prime-numbers-values-not-prime = Hari kulu kaŋ i ci select prime number se ga hima ka goro praym liso ra

select-prime-numbers-values-excluded-combination = Hari-yaŋ kaŋ i ci selectPrimeNumbers se ga ti margayaŋ kaŋ i kaa

select-prime-numbers-excluded-too-many-combinations = I na margayaŋ 70% ka bisa kaa selectPrimeNumbers ra

select-random-combination-fluke = Nda hari kaŋ si hima ka te, i mana hin ka hari suuban-suuban margayaŋ suuban

select-random-value-fluke = Nda hari kaŋ si hima ka te, i mana hin ka hari suuban-suuban suuban
