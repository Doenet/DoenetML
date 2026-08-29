# Abkhaz diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the extended Cyrillic alphabet Abkhazia's schools and publishing
# use, which is what CLDR fills a bare `ab` in as (`ab-Cyrl-GE`). ԥ is U+0525
# rather than the older ҧ U+04A7, and ә is U+04D9 rather than a Latin a; ҟ, ҭ,
# ҳ, ҵ, ҷ, ҽ, ҿ, ҩ and ҕ are each one letter. This is the longest of the four
# files and so the one where a mis-keyed letter is likeliest to hide.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber` — are part of the language rather than
# prose and stay in English exactly as written, as does anything quoted back
# from the author's own source.
#
# Abkhaz counts in two plural categories, `one` and `other`, so every counted
# message keeps the shape English gave it, and a noun after a numeral stays
# singular — which is why the two branches of most of them differ in nothing
# but the number they print.
#
# Abkhaz agreement is a prefix on a verb, and nothing in this file describes a
# noun the catalog itself supplies, so no message here forks on a class.
# `content.ftl`'s header works out why the fork is absent there too.
#
# **Where a speaker should start.** The technical register below is built out
# of a small set of recurring formulae rather than idiomatic prose, and if any
# of them is wrong it is wrong in fifty places at once: «ахархәара амам» for
# "is ignored", «… ауам» for "cannot", «… акәзароуп» for "must be", «иԥшаам»
# for "not found", «ииашам» for "invalid" and «избанзар» for "because". Four
# words are doing more work than they should and are the likeliest to want
# replacing: «ацәаҳәа» stands for a source line, a matrix row *and* a sequence;
# «аҽыԥсахуа» for a variable; «алахьынҵатә» for random; and «еицны ипростоу»
# for coprime. The last two are coinages, not terms read out of an Abkhaz
# textbook — Abkhaz-medium schooling stops below the grades where this
# vocabulary is taught.

## `<lineSegment>`

# $attributes is a list of attribute names; $attributesCount is its length.
line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] аҵыхәтәантәи ҩ-кәаԥк анарбо, { $attributes } ахархәара амам
       *[other] аҵыхәтәантәи ҩ-кәаԥк анарбо, { $attributes } ахархәара амам
    }

# $attributes is a list of attribute names; $attributesCount is its length.
line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] аҵыхәтәантәи акәаԥи агәҭантәи акәаԥи анарбо, { $attributes } ахархәара амам
       *[other] аҵыхәтәантәи акәаԥи агәҭантәи акәаԥи анарбо, { $attributes } ахархәара амам
    }

line-segment-midpoint-offset-without-midpoint = агәҭантәи акәаԥ ада midpointOffset аҵак амам

## `<line>`

line-points-undetermined-dimensions = Аҵәаӷәа иарбам аҩаӡара змоу акәаԥқәа ирхысуеит.

line-points-too-few-dimensions = Аҵәаӷәа еиҵамкәа ҩ-ҩаӡарак змоу акәаԥқәа ирхыс акәзароуп.

# $variables is a bare enumeration of variable names, not an "and" list.
line-points-depend-on-variables = Аҵәаӷәа аҽыԥсахуақәа ирыхьыԥшу акәаԥқәа ирхысуеит: { $variables }.

line-equation-invalid-format = { $variable1 } насгьы { $variable2 } змоу аҵәаӷәа аиҟарара аформат ииашам.

## `<ray>`

ray-overprescribed-through = Алуч through, endpoint насгьы direction рыла иарбоуп. Иарбоу through ахархәара амам.

ray-dimension-mismatch = алуч аҿы numDimensions еиқәшәом.

## `<vector>`

vector-overprescribed-head = Авектор head, tail насгьы displacement рыла иарбоуп. Иарбоу head ахархәара амам.

vector-dimension-mismatch = авектор аҿы numDimensions еиқәшәом.

## Attracting and constraining

# $component is the DoenetML tag of the child that was named, e.g. "polygon".
attract-to-without-nearest-point = `<{ $component }>` иадҳәалара ауам, избанзар уи nearestPoint аҭагылазаашьатә ҽыԥсахуа амам.

constrain-to-without-nearest-point = `<{ $component }>` ала аҳәаақәҵара ауам, избанзар уи nearestPoint аҭагылазаашьатә ҽыԥсахуа амам.

constrain-to-interior-without-nearest-point = `<{ $component }>` аҩныҵҟала аҳәаақәҵара ауам, избанзар уи nearestPoint аҭагылазаашьатә ҽыԥсахуа амам.

## `<choiceInput>`

choice-input-label-position-ignored = ацәаҳәаҿы иҟам choiceInput азы labelPosition ахархәара амам

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput азы иарбоу аиндексқәа ахархәара рымам, избанзар риԥхьаӡара choice ахәыҷқәа риԥхьаӡара иақәшәом.

pretzel-indices-count-mismatch = problem азы иарбоу аиндексқәа ахархәара рымам, избанзар риԥхьаӡара problem ахәыҷқәа риԥхьаӡара иақәшәом.

shuffle-indices-count-mismatch = shuffle азы иарбоу аиндексқәа ахархәара рымам, избанзар риԥхьаӡара акомпонентқәа риԥхьаӡара иақәшәом.

# $component is `choiceInput`, `pretzel` or `shuffle` — a DoenetML component
# name, so it stays in English.
indices-ignored-out-of-range = { $component } азы иарбоу аиндексқәа ахархәара рымам, избанзар аиндексқәак аҳәаақәа ирҭыҵуеит.

pretzel-indices-repeated = pretzel азы иарбоу аиндексқәа ахархәара рымам, избанзар аиндексқәак еиҭаҳәоуп.

pretzel-circuit-first-index = circuit арежим аҿы pretzel азы иарбоу аиндексқәа ахархәара рымам, избанзар актәи аиндекс 1 акәзароуп.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` астроктә хәыҷқәа рыла аус аруразы `type` атрибут арбатәуп.

invalid-type-defaulting-to-math = { $component } акомпонент азы ииашам атип { $type }. math, text, number ма boolean руакы акәзароуп. math ахь ииасуеит.

# $value is the string child that could not be used.
string-not-valid-component-to-arrange = Астрока "{ $value }" { $component } азы иашоу акомпонент акәӡам. Ахархәара амам.

## Types and variables

invalid-type-defaulting-to-number = Ииашам атип { $type }, атип number ахь ииасуеит.

invalid-variable-value = Аҽыԥсахуа ииашам аҵакы: `{ $value }`

## Variants

variant-index-must-be-number = Авариант аиндекс { $index } ахыԥхьаӡара акәзароуп

variant-index-must-be-integer = Авариант аиндекс { $index } еибгоу ахыԥхьаӡара акәзароуп

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` абсолиуттә шәагаақәа рзы иҟаҵам. Аҭбаарақәа аиҿырԥшратә ахь ииасуеит.

side-by-side-absolute-margins = `<{ $component }>` абсолиуттә шәагаақәа рзы иҟаҵам. Аҳәаақәа аиҿырԥшратә ахь ииасуеит.

side-by-side-no-block-child = Ииашам `<{ $component }>`: еиҵамкәа аблоктә хәыҷык амазароуп.

## `<label>`

label-for-ignored-on-graphical = Аграфикатә `<label>` аҿы `for` атрибут ахархәара амам.

label-for-must-resolve-to-one = `<label>` аҿы `for` атрибут акомпонент заҵәык иазкызароуп.

label-for-unresolved = `<label>` аҿы `for` атрибут акомпонент аҟынӡа инагӡахом.

label-for-answer-with-authored-inputs = `<label>` аҿы `for` атрибут иарбоу аҭагаларақәа змоу `<answer>` иазхьарԥшуеит; аҭагалара хаҭала иазхьарԥш.

label-for-answer-without-input = `<label>` аҿы `for` атрибут аҭагалара змам `<answer>` иазхьарԥшуеит.

label-for-must-reference-input-or-answer = `<label>` аҿы `for` атрибут аҭагалара ма аҭак иазхьарԥшзароуп.

## Accessibility

accessibility-short-description-or-decorative = Анеира алшара азы `<{ $component }>` акьаҿу ахҳәаа амазароуп ма аԥшӡаратә ҳасабла иарбазароуп.

accessibility-video-short-description = Анеира алшара азы `<video>` акьаҿу ахҳәаа амазароуп.

accessibility-input-short-description-or-label = Анеира алшара азы `<{ $component }>` акьаҿу ахҳәаа ма ахьӡ амазароуп.

accessibility-answer-input-short-description-or-label = Анеира алшара азы аҭагалара зыҟанаҵо `<answer>` акьаҿу ахҳәаа ма ахьӡ амазароуп.

accessibility-short-description-contains-math = Акьаҿу ахҳәаақәа `<{ $component }>` еиԥш иҟоу аматематикатә компонентқәа рымазар ауам. Аматематика ажәақәа рыла иаҳәатәуп.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } аҟәша ахы атеқст азы иаҭаху аконтраст амам (аиқәаҵәа арежим) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; еиҵамкәа { $threshold }:1 иаҭахуп).
       *[other] { $colorName } аҟәша ахы атеқст азы иаҭаху аконтраст амам ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; еиҵамкәа { $threshold }:1 иаҭахуп).
    }

## `<circle>`

circle-through-points-non-numerical = { $count } кәаԥ ирхысуа `<circle>` иҟаҵам, акәаԥқәа ахыԥхьаӡаратә ҵакқәа рымамзар.

circle-too-many-through-points = Хԥа кәаԥ иреиҳаны ирхысуа агьежь аԥхьаӡара ауам.

circle-overprescribed-radius-center-points = Иарбоу арадиуси ацентри ирхысуа акәаԥқәеи змоу агьежь аԥхьаӡара ауам.

circle-center-with-multiple-points = Иарбоу ацентр змоу агьежь акәаԥ заҵәык иреиҳаны ирхыс ауам.

circle-radius-too-small = Агьежь аԥхьаӡара ауам: ҩ-кәаԥк рыбжьара ибжьоу { $distance } акәзар, иарбоу арадиус { $radius } хәыҷуп.

circle-radius-with-many-points = Иарбоу арадиус змоу агьежь ҩ-кәаԥк иреиҳаны ирхыс ауам.

circle-invalid-center-or-through-points = Агьежь ацентр ма ирхысуа акәаԥқәа ииашам.

circle-radius-center-with-multiple-points = Иарбоу ацентр змоу агьежь арадиус аԥхьаӡара ауам, акәаԥ заҵәык иреиҳаны ирхысуазар.

circle-change-radius-non-numerical = Ахыԥхьаӡаратә ҵак змам акәаԥқәа ирхысуа агьежь арадиус аԥсахра ауам

circle-radius-with-points-non-numerical = Ахыԥхьаӡаратә ҵакқәа анымам, иарбоу арадиус змоу, акәаԥ заҵәык иреиҳаны ирхысуа агьежь аԥҵара ауам.

circle-change-center-non-numerical = Ахыԥхьаӡаратә ҵак змам акәаԥқәа ирхысуа агьежь ацентр аԥсахра иҟаҵам.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Афункциа аобласт азы аҩаӡарақәа маҷуп. Аобласт { $intervals } аинтервал амоуп, афункциа иамоуп { $inputs ->
            [one] { $inputs } аҭагалара
           *[other] { $inputs } аҭагалара
        }.
       *[other] Афункциа аобласт азы аҩаӡарақәа маҷуп. Аобласт { $intervals } аинтервал амоуп, афункциа иамоуп { $inputs ->
            [one] { $inputs } аҭагалара
           *[other] { $inputs } аҭагалара
        }.
    }

function-domain-invalid-format = Афункциа аобласт аформат ииашам.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Афункциа ахыԥхьаӡаратә ҵак змам амаксимум ахархәара амам.
        [minimum] Афункциа ахыԥхьаӡаратә ҵак змам аминимум ахархәара амам.
        [extremum] Афункциа ахыԥхьаӡаратә ҵак змам аекстремум ахархәара амам.
        [point] Афункциа ахыԥхьаӡаратә ҵак змам акәаԥ ахархәара амам.
        [slope] Афункциа ахыԥхьаӡаратә ҵак змам анаклон ахархәара амам.
       *[other] Афункциа ахыԥхьаӡаратә ҵак змам { $type } ахархәара амам.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Афункциа иҭацәу амаксимум ахархәара амам.
        [minimum] Афункциа иҭацәу аминимум ахархәара амам.
        [extremum] Афункциа иҭацәу аекстремум ахархәара амам.
        [point] Афункциа иҭацәу акәаԥ ахархәара амам.
       *[other] Афункциа иҭацәу { $type } ахархәара амам.
    }

function-points-too-close = Афункциа иамоуп рҭыԥқәа даара еиқәшәо ҩ-кәаԥк. Афункциа алкаара ауам.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Афункциа аиҭаҟаҵарақәа рылшоит аҭагаларақәа рхыԥхьаӡареи аҭыҵгақәа рхыԥхьаӡареи еиҟарзар мацара. Ари афункциа иамоуп { $inputs } аҭагалара насгьы { $outputs ->
            [one] { $outputs } аҭыҵга
           *[other] { $outputs } аҭыҵга
        }.
       *[other] Афункциа аиҭаҟаҵарақәа рылшоит аҭагаларақәа рхыԥхьаӡареи аҭыҵгақәа рхыԥхьаӡареи еиҟарзар мацара. Ари афункциа иамоуп { $inputs } аҭагалара насгьы { $outputs ->
            [one] { $outputs } аҭыҵга
           *[other] { $outputs } аҭыҵга
        }.
    }

## `<sequence>`

sequence-invalid-length = Ацәаҳәа аура ииашам. Ноль еиҵамкәа еибгоу ахыԥхьаӡара акәзароуп.

# $type is a sequence type: number, letters, or math.
sequence-invalid-step = Ацәаҳәа ашьаҿа ииашам. { $type } атип змоу ацәаҳәа азы ахыԥхьаӡара акәзароуп.

# $attribute is `from` or `to` — an attribute name, so it stays in English.
sequence-invalid-endpoint-number = Ахыԥхьаӡаратә цәаҳәа "{ $attribute }" ииашам. Ахыԥхьаӡара акәзароуп.

sequence-invalid-endpoint-letters = Анбантә цәаҳәа "{ $attribute }" ииашам. Анбанқәа реилаҵа акәзароуп.

sequence-invalid-endpoint = Ацәаҳәа "{ $attribute }" ииашам.

select-from-sequence-coprime-not-numbers = coprime ахархәара амам, избанзар ахыԥхьаӡарақәа алхӡом

select-from-sequence-coprime-with-exclude-combinations = coprime ахархәара амам, избанзар excludeCombinations арбоуп

## Resolving a `target`

target-not-found = `<{ $source }>` азы ииашам target: ахықәкы иԥшаам.

# $property is the state variable that was looked for; $component is the tag it
# was looked for on.
target-state-variable-not-found = `<{ $source }>` азы ииашам target: `<{ $component }>` аҿы "{ $property }" ахьӡ змоу аҭагылазаашьатә ҽыԥсахуа иԥшаам.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` аҽыԥсахуақәа ихьыԥшым аҽыԥсахуа иақәшәар ауам.

ode-system-duplicate-variable-names = Еиҭаҳәоу ахьӡқәа змоу аҽыԥсахуақәа рыла ОДУ афункциақәа рԥҵара ауам.

ode-system-rhs-function-error = ОДУ афункциа аԥҵара ауам. mathjs афункциа аԥҵараҿы агха.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } ҵәаӷәа рыбжьара акәакь аԥҵара ауам

angle-invalid-through-point = `<angle>` through аҿы ииашам акәаԥ

parabola-vertex-too-many-points = Иарбоу авершина змоу апарабола акәаԥ заҵәык иреиҳаны ирхыс иҟаҵам.

parabola-too-many-points = Хԥа кәаԥ иреиҳаны ирхысуа апарабола иҟаҵам.

intersection-too-many-items = Ҩ-хәҭак иреиҳаны раиԥырҵра иҟаҵам

## Other math components

ionic-compound-not-two-ions = Ҩ-ионк ада егьырҭ рзы аионтә еилаҵа иҟаҵам.

ionic-compound-needs-cation-and-anion = Аионтә еилаҵа акатион заҵәыки анион заҵәыки рзы мацара иҟаҵоуп.

# $equation is the equation as the author wrote it.
solve-equations-cannot-evaluate = Аиҟарара аӡбара ауам, избанзар аиҟарара аԥхьаӡара ауам: { $equation }

math-operators-operand-number-required = Аматематикатә операнд аныхразы operandNumber арбатәуп.

eigen-decomposition-failed = Аматрица ахатәы ҵакқәа рыԥхьаӡара ауам

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: апараметр { $parameters } ашаблон аҿы иҟаӡам, убри аҟнытә иарбанзаалак аамҭазы иҭацәу иақәшәоит.
       *[other] `<matchesPattern>`: апараметрқәа { $parameters } ашаблон аҿы иҟаӡам, убри аҟнытә иарбанзаалак аамҭазы иҭацәу ирқәшәоит.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" аилкаара ауам. none, medium, dense ма абжьажәа ала еиҟәшоу ҩ-позитивтә хыԥхьаӡарак акәзароуп, аҿырԥштәыс grid="1 0.5". Асеть ҭыхӡом.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` иаҭахуп афункциа змоу { $expected ->
        [one] аҭыҵга заҵәык, акәаԥ зегь аҿы анаклон y', аҿырԥштәыс `y - x`
       *[other] ҩ-ҭыҵгак, акәаԥ зегь аҿы авектор, аҿырԥштәыс `(y, -x)`
    }, аха иарбоу афункциа иамоуп { $found ->
        [one] { $found } аҭыҵга
       *[other] { $found } аҭыҵга
    }. { $alternative ->
        [none] Акгьы ҭыхӡом.
       *[other] Уи афункциа азы `<{ $alternative }>` акомпонент ауп. Акгьы ҭыхӡом.
    }

# Translators: retired. `function` is an attribute name and stays in English.
field-function-attribute-ignored-with-child = `function` атрибут ахархәара амам, избанзар афункциа акомпонент аҩныҵҟагьы иарбоуп; ахархәара амоуп аҩныҵҟатәи. Афункциа ҩ-мҩак руакы мацара ала иарба.

field-variables-ignored =
    `<{ $component }>`: `variables` атрибут акомпонент аҩныҵҟа иҩу аформула аҽыԥсахуақәа рырбоит. { $reason ->
        [function-child] Араҟа афункциа `<function>` хәыҷык ҳасабла иарбоуп, уи ахатә ҽыԥсахуақәа ирбоит, убри аҟнытә `variables` ахархәара амам.
       *[no-expression] Араҟа уи еиԥш аформула ыҟаӡам, убри аҟнытә `variables` ахархәара амам.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure асахьаҭыхгаҿы xLabelPosition="left" аднагалаӡом; арӷьарахьтәи аҭыԥ ахымҩаԥгашьа ахы иархәоуп.

prefigure-y-label-position-unsupported = `<graph>`: prefigure асахьаҭыхгаҿы yLabelPosition="bottom" аднагалаӡом; хыхьтәи аҭыԥ ахымҩаԥгашьа ахы иархәоуп.

prefigure-invalid-axis-bounds = `<graph>`: prefigure ахь аиасразы ааҭгылара аҳәаақәа ииашам; астандарттә bbox (-10,-10,10,10) ахы иархәоуп.

prefigure-invalid-width = `<graph>`: prefigure ахь аиасразы аҭбаара ииашам; астандарттә аҭбаара 425 ахы иархәоуп.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure ахь аиасразы aspectRatio ииашам; астандарттә аҵакы 1 ахы иархәоуп.

prefigure-grid-spacing-too-fine = `<graph>`: асеть абжьаанҵа ааҭгылара аҳәаақәа рзы даара имаҷуп; prefigure асахьаҭыхгаҿы асеть ҭыхӡом.

prefigure-annotations-not-rendered = `<graph>`: PreFigure асахьаҭыхга ахархәара анымам, азгәаҭарақәа ҭыхӡом.

multiple-annotations-children = `<graph>` аҿы `<annotations>` хәыҷқәа рацәаны иԥшаауп; аҵыхәтәантәи ада егьырҭ зегь ахархәара рымам.

## Referring to other components

copy-unrecognized-component-type = Ирдырӡом акомпонент атип аиҵыхра ма акопиа аҟаҵара ауам: { $type }.

copy-prop-not-found = { $component } атип змоу акомпонент аҿы { $property } аҷыдаҟазшьа иԥшаам

collect-no-source = collect азы ахыҵхырҭа иԥшаам.

collect-invalid-component-type = `<{ $component }>` атип змоу акомпонентқәа реизгара ауам, избанзар уи ииашам акомпонент атипуп.

reference-index-unavailable = Аиндекс `{ $reference }` азхьарԥшра ауам

## `<callAction>`

component-action-unavailable = Акомпонент `{ $reference }` аҿы { $action } ааԥхьара ауам

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Адырқәа ииашам аформа рымоуп. Ацәаҳәақәа аура еиқәшәом. Иԥшаауп componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Адырқәа еиҭаҳәоу аколонкақәа рыхьӡқәа рымоуп. Иԥшаауп componentIdx :{ $componentIdx }

data-frame-missing-column-name = Адырқәа аколонка ахьӡ рымам. Иԥшаауп componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Ари аҭак абал арҭара ихьыԥшуп аҭак ихатәы идәықәҵоу аҭак, уи иаԥсам ахымҩаԥгашьа алнагалоит.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` змоу аконтеинер аҩныҵҟа иҟоу `<answer>` аҿы `maxNumAttempts` аҵак амам, избанзар аԥышәарақәа рхыԥхьаӡара аконтеинер иаднакылоит. `maxNumAttempts` аконтеинер аҿы иқәыргыл.

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` змоу даҽа контеинерк аҩныҵҟа иҟоу `sectionWideCheckWork` змоу аконтеинер аҿы `maxNumAttempts` аҵак амам, избанзар аԥышәарақәа рхыԥхьаӡара адәныҟатәи аконтеинер иаднакылоит. `maxNumAttempts` адәныҟатәи аконтеинер аҿы иқәыргыл.

# $attributes is a list of attribute names; $attributesCount is its length.
answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality ада { $attributes } атрибут аҵак амоуам.
       *[other] symbolicEquality ада { $attributes } атрибутқәа рҵак рымоуам.
    }

answer-invalid-type = Аҭак азы ииашам атип: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` акомпонент ахьӡ анамам, амодуль атрибут ҳасабла ахархәара ауам

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` акомпонент амодуль азы атрибут ҳасабла ахархәара ауам, избанзар `<module>` акомпонент атип аҿы "{ $name }" атрибут ыҟоуп.

conditional-content-condition-ignored = case ма else хәыҷқәа змоу `<conditionalContent>` акомпонент аҿы `condition` атрибут ахархәара амам.

slider-markers-type-mismatch = Амаркерқәа ратип аслаидер атип иақәшәом.

pretzel-problem-needs-statement-and-answer = Ииашам pretzel: `<problem>` зегь `<statement>` заҵәыки `<answer>` заҵәыки рымазароуп.

pretzel-circuit-first-problem-distractor = Ииашам pretzel: mode="circuit" аҿы актәи `<problem>` дистрактор акәзар ауам.

## Attribute values

# $values is a list of the values that were rejected, each already in
# backticks; $valuesCount is how many there were.
attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` атрибут азы ииашам аҵакы { $values }; ахархәара амам.
       *[other] `{ $attribute }` атрибут азы ииашам аҵакқәа { $values }; ахархәара рымам.
    }

attribute-must-be-references = `{ $attribute }` атрибут азы ииашам аҵакы `{ $value }`. Атрибут `$` ала иалагоу азхьарԥшқәа рыла еиқәыршәазароуп.

# $names is a list of the rejected names, each already in single quotes.
math-input-invalid-function-names = <mathInput>: { $attribute } аҿы ииашам афункциа ахьӡқәа ахархәара рымам: { $names }. Ахьӡ зегь раарԥшратә хәҭа еиҵамкәа 2 символ (анбанқәа ма адефисқәа) амазароуп; уи ашьҭахь `|<mathspeak alternative>` ацҵазар ауеит.

## Building components from the source

component-type-invalid = Ииашам акомпонент атип: `<{ $componentType }>`

attribute-repeated = Атрибут { $attribute } еиҭаҳәара ауам.

attribute-invalid-for-component = `<{ $componentType }>` атип змоу акомпонент азы ииашам атрибут "{ $attribute }".

## Style definition contrast

style-definition-insufficient-contrast =
    Астиль { $styleNumber } иаҭаху аконтраст амам { $context ->
        [text-on-background] афон иаҿагылоу атеқст аԥштәы азы
        [high-contrast] аканва иаҿагылоу иконтрастны иҟоу аԥштәы азы
        [line] аканва иаҿагылоу аҵәаӷәа аԥштәы азы
        [marker] аканва иаҿагылоу амаркер аԥштәы азы
       *[text-on-canvas] аканва иаҿагылоу атеқст аԥштәы азы
    }{ $mode ->
        [dark] { " (аиқәаҵәа арежим)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; еиҵамкәа { $threshold }:1 иаҭахуп).

style-definition-dark-mode-text-background-contrast =
    Астиль { $styleNumber } алашара арежим азы иаҭаху аконтраст змоу аԥштәқәа рымазаргьы, урҭ рыла иҟоу аиқәаҵәа арежим аԥштәқәа рҿы афон иаҿагылоу атеқст аԥштәы иаҭаху аконтраст амам ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; еиҵамкәа { $threshold }:1 иаҭахуп). { $suggestion ->
        [available] Аиқәаҵәа арежим аҿы аконтраст еиӷьхаразы алашара арежим аконтраст еизырҳатәуп (аҿырԥштәыс { $lightAttribute }="{ $lightColor }" аҭаргалара), мамзаргьы аиқәаҵәа арежим аԥштәы ԥсахтәуп (аҿырԥштәыс { $darkAttribute }="{ $darkColor }" аҭаргалара).
       *[none] Аиқәаҵәа арежим аҿы аконтраст еиӷьхаразы алашара арежим аконтраст еизырҳатәуп, мамзаргьы textColorDarkMode ма backgroundColorDarkMode рыла аԥштәқәа ԥсахтәуп.
    }

style-definition-dark-mode-text-canvas-contrast =
    Астиль { $styleNumber } алашара арежим азы иаҭаху аконтраст змоу атеқст аԥштәы амазаргьы, уи ала иҟоу аиқәаҵәа арежим атеқст аԥштәы аканва иаҿагыланы иаҭаху аконтраст амам ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; еиҵамкәа { $threshold }:1 иаҭахуп). { $suggestion ->
        [available] Аиқәаҵәа арежим аҿы аконтраст еиӷьхаразы алашара арежим аконтраст еизырҳатәуп (аҿырԥштәыс textColor="{ $lightColor }" аҭаргалара), мамзаргьы аиқәаҵәа арежим аԥштәы ԥсахтәуп (аҿырԥштәыс textColorDarkMode="{ $darkColor }" аҭаргалара).
       *[none] Аиқәаҵәа арежим аҿы аконтраст еиӷьхаразы алашара арежим аконтраст еизырҳатәуп, мамзаргьы textColorDarkMode ала аԥштәы ԥсахтәуп.
    }

section-multiple-style-palettes = Аҟәша <stylePalette> заҵәык алнахуеит; ахархәара амоуп аҵыхәтәантәи.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } аҷыда вариантқәа рылкаара ауам, избанзар numToSelect ноль еиҵамкәа еибгоу ахыԥхьаӡара акәӡам.

variant-num-to-select-not-constant-number = { $component } аҷыда вариантқәа рылкаара ауам, избанзар numToSelect иҭышәынтәалоу ахыԥхьаӡара акәӡам.

variant-with-replacement-not-constant-boolean = { $component } аҷыда вариантқәа рылкаара ауам, избанзар withReplacement иҭышәынтәалоу абулевтә ҵакы акәӡам.

variant-select-weight-disables-unique = select азы аҷыда вариантқәа аанкылоуп, selectWeight ма selectForVariants змоу алхрак анымоу

variant-coprime-undetermined = { $component } аҷыда вариантқәа рылкаара ауам, избанзар coprime еснагь имцу ауп ҳәа алкаара ауам.

# $attribute is an attribute name (`from`, `to`, `step`, `sort`, `length`) and
# stays as written.
variant-attribute-not-constant = { $component } аҷыда вариантқәа рылкаара ауам, избанзар { $attribute } иҭышәынтәалам.

variant-attribute-not-number = { $component } аҷыда вариантқәа рылкаара ауам, избанзар { $attribute } ахыԥхьаӡара акәӡам.

variant-attribute-wrong-type-for-sequence =
    { $type } атип змоу { $component } аҷыда вариантқәа рылкаара ауам, избанзар { $attribute } { $expected ->
        [letters-combination] анбанқәа реилаҵа
        [math-expression] иашоу аматематикатә формула
        [integer] еибгоу ахыԥхьаӡара
       *[number] ахыԥхьаӡара
    } акәӡам.

variant-length-not-integer = { $component } аҷыда вариантқәа рылкаара ауам, избанзар аура еибгоу ахыԥхьаӡара акәӡам.

variant-sort-not-implemented = sort змоу { $component } аҷыда вариантқәа иҟаҵам

variant-exclude-combinations-not-implemented = excludeCombinations змоу { $component } аҷыда вариантқәа иҟаҵам

variant-math-exclude-not-implemented = exclude змоу math атип змоу { $component } аҷыда вариантқәа иҟаҵам

variant-non-constant-exclude-not-implemented = иҭышәынтәалам exclude змоу { $component } аҷыда вариантқәа иҟаҵам

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: аграфик prefigure асахьаҭыхгаҿы аднагалаӡом; ахылҵ аанрыжьуп.

prefigure-descendant-invalid-geometry = { $subject }: агеометриа ҵыхәтәа змам ма нагӡам; ахылҵ аанрыжьуп.

prefigure-curve-label-omitted = { $subject }: еиҭагоу аҵәаӷәа гьежь аелементқәа рҿы ахьӡқәа аднагалаӡом; ахьӡ аанрыжьуп.

prefigure-curve-unsupported-definition-type = { $subject }: аҵәаӷәа гьежь аилкаара атип '{ $definitionType }' аднагалаӡом; ахылҵ аанрыжьуп.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves аҿы flipFunctions атрибут аднагалаӡом; ахылҵ аанрыжьуп.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves аҿы аформулатә тип змоу ахәыҷқәа рфункциақәа мацара аднагалоит; ахылҵ аанрыжьуп.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] аҵәаӷәатә гәыԥ ахьӡ
       *[point] акәаԥ ахьӡ
    } азы labelPosition '{ $labelPosition }' аднагалаӡом; PreFigure астандарттә еиҟаратәра ахы иархәоуп.

prefigure-fill-style-unsupported = { $subject }: аҭәара астиль '{ $fillStyle }' PreFigure иаднагалаӡом; аԥштәы заҵәык ала аҭәара ахь ииасуеит.

prefigure-line-style-unknown = { $subject }: еилкаам аҵәаӷәа астиль '{ $lineStyle }' PreFigure аҭыҵгаҿы аанрыжьуп.

prefigure-marker-style-mapped-to-diamond = { $subject }: амаркер астиль '{ $markerStyle }' PreFigure астиль 'diamond' ахь ииасуеит.

prefigure-marker-style-unsupported = { $subject }: амаркер астиль '{ $markerStyle }' PreFigure иаднагалаӡом; астандарттә стиль ахы иархәоуп.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ииашам `ref`; ахықәкы аԥшаара ауам. Азгәаҭа аанрыжьуп.

annotation-ref-multiple-targets = `<annotation>`: `ref` хықәкқәа рацәак иазкуп; ахархәара амоуп актәи.

annotation-ref-outside-graph = `<annotation>`: ииашам `ref`; ахықәкы аграфик анҭыҵ иҟоуп. Азгәаҭа аанрыжьуп.

annotation-ref-unsupported-target = `<annotation>`: ииашам `ref`; ахықәкы prefigure ахь аиасраҿы иаднагало графикатә объект акәӡам. Азгәаҭа аанрыжьуп.

annotation-text-missing = `<annotation>`: `text` ыҟаӡам ма иҭацәуп; иҭацәу атеқст аҭыҵуеит.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Агьежьтә хьыԥшра ԥшаауп.
       *[other] `<{ $componentType }>` акомпонент иадҳәалоу агьежьтә хьыԥшра ԥшаауп.
    }

reference-no-referent = Азхьарԥш азы иазку акгьы иԥшаам: `{ $reference }`

reference-multiple-referents = Азхьарԥш азы иазку рацәак иԥшааит: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` атрибут { $attribute } аформат ииашам.

# $children is the list of child types that did not match, already joined.
children-invalid = `<{ $componentType }>` азы ииашам ахәыҷқәа: иԥшаауп ииашам ахәыҷқәа: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` атрибут азы ииашам аҵакы `{ $value }`, ахархәара амоуп аҵакы `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML аверсиа { $version } иԥшаам.
       *[other] DoenetML аверсиа { $version } иԥшаам. Аверсиа { $fallback } ахь ииасуеит
    }

## Reading the DoenetML

parse-invalid-doenetml = Ииашам DoenetML: { $content }

parse-tag-missing-close-tag = Ииашам DoenetML: Атег `{ $tag }` аркга тег амам. Хаҭала иаркуа атег ма `</{ $tagName }>` атег иаҭахын.

parse-tag-error = Ииашам DoenetML: Атег `<{ $tagName }>` аҿы агха

parse-attribute-missing-value = Ииашам DoenetML: Ииашам атрибут `{ $attribute }` аҵакы амам ҳәа иҟалоит.

parse-attribute-invalid = Ииашам DoenetML: Ииашам атрибут `{ $attribute }`

parse-attribute-value-invalid = Ииашам DoenetML: Ииашам атрибут аҵакы `{ $value }`

# $quote is the quote character that would balance the pair: `"` or `'`.
parse-attribute-value-quote-mismatch = Ииашам DoenetML: Ииашам атрибут аҵакы `{ $value }`. Акавычкақәа еиқәшәом. `{ $quote }` шәымам ҳәа иҟалоит

parse-open-tag-name-missing = Ииашам DoenetML: Ахьӡ змам атег ԥшаауп, аҿырԥштәыс `<`

parse-tag-not-closed = Ииашам DoenetML: Атег `{ $tag }` аркӡам (`>` ыҟаӡам ҳәа иҟалоит).

parse-self-closing-tag-name-missing = Ииашам DoenetML: Ахьӡ змам атег ԥшаауп `<{ $content }>`

parse-self-closing-tag-not-closed = Ииашам DoenetML: Атег `{ $tag }` аркӡам (`/>` ыҟаӡам ҳәа иҟалоит).

parse-tag-invalid-attributes = Ииашам DoenetML: Атег `{ $tag }` ииашам. Ииашам атрибутқәа амазар ауеит.

parse-close-tag-name-missing = Ииашам DoenetML: Ахьӡ змам аркга тег ԥшаауп, аҿырԥштәыс `</`

parse-attribute-value-unquoted = Атрибут аҵакқәа акавычкақәа рыбжьара иҟазароуп: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Ииашам DoenetML: Аркга тег `{ $tag }` ԥшаауп, аха иақәшәо аартга тег ыҟаӡам

parse-close-tag-mismatched = Ииашам DoenetML: Аркга тег еиқәшәом. Иаҭахын `</{ $expected }>`. Иԥшаауп `{ $found }`

parser-node-unconvertible = Анод { $node } Dast анод ахь аиагара ауам.

## Names

name-attribute-invalid =
    Ииашам атрибут name='{ $name }'. { $reason ->
        [characters] Ахьӡқәа анбанқәа, ахыԥхьаӡарақәа, аҵаҟатәи аҵәаӷәақәа ма адефисқәа мацара рымазар ауеит.
       *[start] Ахьӡқәа анбан ала иалагазароуп.
    }

component-name-invalid-start = Ииашам акомпонент ахьӡ "{ $name }". Ахьӡқәа анбан ала иалагазароуп.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched атип змоу аҭак video атрибут амазароуп

answer-video-watched-video-not-reference = videoWatched атип змоу аҭак азхьарԥш зкоу video атрибут амазароуп

answer-name-not-single-text = Аҭак name атрибут атеқсттә хәыҷ заҵәык амазароуп

## Referencing another document

external-doenetml-recursion-limit = Адәныҟатәи DoenetML аиура ауам, арекурсиа аҩаӡарақәа рацәоуп. Агьежьтә зхьарԥш ыҟазар акәхап?

external-doenetml-unavailable = { $attribute }="{ $uri }" аҟынтә DoenetML аиура ауам

external-doenetml-type-mismatch = { $attribute }="{ $uri }" аҟынтә иаагоу DoenetML ииашам: акомпонент атип "{ $componentType }" иақәшәом

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Атрибут `{ $from }` ижәытәуп; уи аҭыԥан `{ $to }` шәхы иашәырхәа.
       *[other] [deprecation] `<{ $component }>` аҿы атрибут `{ $from }` ижәытәуп; уи аҭыԥан `{ $to }` шәхы иашәырхәа.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Атрибут `{ $from }` ижәытәуп, `{ $to }` гьы иарбоуп, убри аҟнытә ахархәара амам.
       *[other] [deprecation] `<{ $component }>` аҿы атрибут `{ $from }` ижәытәуп, `{ $to }` гьы иарбоуп, убри аҟнытә ахархәара амам.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` аҿы атрибут `{ $attribute }` ижәытәуп, ахархәара амам.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` аҿы атрибут `{ $attribute }` ижәытәуп; уи аҭыԥан `<{ $child }>` хәыҷ шәхы иашәырхәа.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` аҿы атрибут `{ $attribute }` аҵакы `{ $value }` ижәытәуп; уи аҭыԥан `{ $to }` шәхы иашәырхәа.


## Language coverage

# $locale is the document's language tag, as declared.
pluralize-english-only = `<pluralize>` аинглыз бызшәа мацара арацәабатә ахь иагоит, убри аҟнытә { $locale } ала иҩу адокумент аҿы уи атеқст ԥсахда иаанхоит. Арацәабатә хаҭала иҩ, мамзаргьы `pluralForm` атрибут ала иарба.


## Checking against the schema

schema-element-unrecognized = Аелемент `<{ $tag }>` ирдырхо Doenet елемент акәӡам.

schema-element-not-allowed-at-root = Аелемент `<{ $tag }>` адокумент ахцәа аҿы азин амам.

schema-element-not-allowed-inside = Аелемент `<{ $tag }>` `<{ $parent }>` аҩныҵҟа азин амам.

schema-attribute-unrecognized = Аелемент `<{ $tag }>` `{ $attribute }` ахьӡ змоу атрибут амам.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Аелемент `<{ $tag }>` атрибут `{ $attribute }` ахьӡынҵа акәзароуп, уи ахәҭа зегь ари аҟынтә акәзароуп: { $allowed }
       *[other] Аелемент `<{ $tag }>` атрибут `{ $attribute }` ари аҟынтә акәзароуп: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select азы ииашам авариант ахьӡ. Авариант ахьӡ { $variantName } { $numOptions } алхраҿы иԥшаауп, алхтәу ракәзар { $numToSelect } ауп.

select-variant-name-without-options = select азы авариантқәа арбоуп, аха иҟалар зылшо авариант ахьӡ азы алхрақәа арбаӡам: { $variantName }.

select-variant-name-not-possible = select азы иарбоу авариант ахьӡ { $variantName } иҟалар зылшо авариант ахьӡ акәӡам.

select-too-few-options = { $numOptions } мацара рҟынтә { $numToSelect } компонент алхра ауам.

select-from-sequence-too-few-values = Аура { $length } змоу ацәаҳәа аҟынтә { $numToSelect } ҵакы алхра ауам.

select-from-sequence-indices-count-mismatch = select азы иарбоу аиндексқәа рхыԥхьаӡара алхтәу рхыԥхьаӡара иақәшәазароуп

select-from-sequence-indices-not-integers = select азы иарбоу аиндексқәа зегь еибгоу ахыԥхьаӡарақәа ракәзароуп

select-from-sequence-index-excluded = selectfromsequence азы иарбоу аиндекс иҭыганы иҟан

select-from-sequence-indices-excluded-combination = selectfromsequence азы иарбоу аиндексқәа иҭыгоу еилаҵаны иҟан

select-from-sequence-coprime-not-positive-integers = Еицны ипростоу еилаҵақәа алхра ауам, избанзар апозитивтә еибгоу хыԥхьаӡарақәа алхӡом.

# Translators: from, to and step are attribute names.
select-from-sequence-coprime-common-factor = Еицны ипростоу ахыԥхьаӡарақәа алхра ауам. Иҟалар зылшо аҵакқәа зегь еицырзеиԥшу аиҟәшага рымоуп. (Иарбоу "from" ма "to" аҵакқәа "step" ацы еицны ипростозароуп.)

select-from-sequence-coprime-single-number = 1 акәым хыԥхьаӡара заҵәык аҟынтә еицны ипростоу еилаҵақәа алхра ауам.

select-from-sequence-excluded-too-many-combinations = selectFromSequence аҿы аилаҵақәа 70% инеиҳаны иҭыгоуп

select-from-sequence-coprime-none-found = Еицны ипростоу ахыԥхьаӡарақәа алхра ауам. Иҟалар зылшо аҵакқәа зегь еицырзеиԥшу аиҟәшага рымоуп.

select-from-sequence-too-few-unique-values = Аура { $numPossibleValues } змоу ацәаҳәа аҟынтә { $numToSelect } ҷыда ҵакы алхра ауам

select-prime-numbers-too-few-values = Аура { $numValues } змоу апростатә хыԥхьаӡарақәа рыхьӡынҵа аҟынтә { $numToSelect } ҵакы алхра ауам

select-prime-numbers-values-count-mismatch = select азы иарбоу аҵакқәа рхыԥхьаӡара алхтәу рхыԥхьаӡара иақәшәазароуп

select-prime-numbers-values-not-prime = select prime number азы иарбоу аҵакқәа зегь апростатә хыԥхьаӡарақәа рыхьӡынҵаҿы иҟазароуп

select-prime-numbers-values-excluded-combination = selectPrimeNumbers азы иарбоу аҵакқәа иҭыгоу еилаҵаны иҟан

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers аҿы аилаҵақәа 70% инеиҳаны иҭыгоуп

select-random-combination-fluke = Даара иҟалар зылшам ҭагылазаашьала алахьынҵатә ҵакқәа реилаҵа алхра ауам

select-random-value-fluke = Даара иҟалар зылшам ҭагылазаашьала алахьынҵатә ҵакы алхра ауам
