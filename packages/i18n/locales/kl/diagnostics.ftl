# Kalaallisut (Greenlandic) diagnostics. Translated from
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
# **Orthography.** The 1973 orthography. The Kleinschmidt letter **ĸ (U+0138)
# appears nowhere in these four files**; every such sound is written `q`.
# Length is written by doubling — `aa ii uu ll rr tt`. `chrome.ftl` sets the
# letters out in full.
#
# **Number.** `Intl.PluralRules("kl")` selects **one** and **other**, and both
# are real: a counted noun takes the plural ending, so the two branches differ
# in more than the digit. No `few`, `many`, `two` or `zero` branch appears
# anywhere in these files, because the locale cannot select one.
#
# **A Danish loan register with a Kalaallisut frame.** The sentences here are
# ordinary sentences — "it was not found", "it must be a whole number", "it is
# ignored" — and Kalaallisut says all of them. The *nouns* inside them are
# another matter: «komponenti», «attributi», «funktioni», «variabeli»,
# «punkti», «linje», «matrixi», «indeksi», «sekvensi», «dimensioni»,
# «versioni», «formati», «domæni» and «koordinati» are Danish loans written in
# Greenlandic spelling, and they are what a Greenlandic speaker working with
# software actually says. They are kept as loans, and are not offered as
# translations of anything.
#
# **Suffixes and placeables.** A Kalaallisut case ending cannot be welded onto
# a placeable whose final sound this catalog never sees, so no `{ $x }`-mik or
# `{ $x }`-mut appears anywhere below; the sentence is built around the
# argument with separate words instead. A hyphen onto a *literal* identifier
# is fine and is used — «DoenetML-ip».
#
# **Coverage.** Every coded message in the English catalog is answered here.
# The two that lean hardest on loans are `math-input-invalid-function-names`,
# whose talk of a display segment and a mathspeak alternative has no
# Greenlandic equivalent at all, and
# `select-from-sequence-excluded-too-many-combinations`; both are worth a
# reviewer's attention before the rest.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } sumiginnarneqarpoq endpoint marluk aalajangersarneqarmata
       *[other] { $attributes } sumiginnarneqarput endpoint marluk aalajangersarneqarmata
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } sumiginnarneqarpoq endpoint aamma midpoint tamarmik aalajangersarneqarmata
       *[other] { $attributes } sumiginnarneqarput endpoint aamma midpoint tamarmik aalajangersarneqarmata
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset sunniuteqanngilaq midpoint peqanngippat

## `<line>`

line-points-undetermined-dimensions = Linje punktinik dimensioneqarnerat aalajangersimanngitsunik ingerlavoq.

line-points-too-few-dimensions = Linje punktinik minnerpaamik marlunnik dimensionilinnik ingerlassaaq.

line-points-depend-on-variables = Linje punktinik variabelinut attuumassuteqartunik ingerlavoq: { $variables }.

line-equation-invalid-format = Linjep equationianut formati eqqunngitsoq variabelini { $variable1 } aamma { $variable2 }.

## `<ray>`

ray-overprescribed-through = Ray through, endpoint aamma direction pingasut aalajangersarpaat. Through sumiginnarneqarpoq.

ray-dimension-mismatch = numDimensions ray-mi naapertuutinngilaq.

## `<vector>`

vector-overprescribed-head = Vector head, tail aamma displacement pingasut aalajangersarpaat. Head sumiginnarneqarpoq.

vector-dimension-mismatch = numDimensions vector-imi naapertuutinngilaq.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` attract-figinissaa ajornarpoq, nearestPoint peqanngimmat.

constrain-to-without-nearest-point = `<{ $component }>` constrain-figinissaa ajornarpoq, nearestPoint peqanngimmat.

constrain-to-interior-without-nearest-point = `<{ $component }>` iluanut constrain-figinissaa ajornarpoq, nearestPoint peqanngimmat.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition sumiginnarneqarpoq inline-iunngitsumi choiceInput

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput-imut indeksit sumiginnarneqarput, amerlassusaat choice-inik qitornaqarnera naapertunngimmagu.

pretzel-indices-count-mismatch = problem-imut indeksit sumiginnarneqarput, amerlassusaat problem-inik qitornaqarnera naapertunngimmagu.

shuffle-indices-count-mismatch = shuffle-imut indeksit sumiginnarneqarput, amerlassusaat komponentit amerlassusaannut naapertunngimmat.

indices-ignored-out-of-range = { $component }-imut indeksit sumiginnarneqarput, ilaasa killiit qaangimmatigit.

pretzel-indices-repeated = pretzel-imut indeksit sumiginnarneqarput, ilaat uteqqinneqarmata.

pretzel-circuit-first-index = pretzel-imut circuit-imiittumut indeksit sumiginnarneqarput, indeksi siulleq 1 tassaassammat.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` string-inik qitornalik atorniassappat `type` attributi aalajangersarneqassaaq.

invalid-type-defaulting-to-math = { $component }-imut type { $type } eqqunngilaq. math, text, number imaluunniit boolean tassaassaaq. math atorneqassaaq.

string-not-valid-component-to-arrange = String "{ $value }" { $component }-imut atorsinnaanngilaq. Sumiginnarneqarpoq.

## Types and variables

invalid-type-defaulting-to-number = type { $type } eqqunngilaq, type number-inngortinneqarpoq.

invalid-variable-value = Variabelip nalia eqqunngilaq: `{ $value }`

## Variants

variant-index-must-be-number = Variant-ip indeksia { $index } kisitsittuussaaq

variant-index-must-be-integer = Variant-ip indeksia { $index } kisitsit ilivitsuussaaq

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` uuttortaatinut aalajangersimasunut piareersimanngilaq. Silissusaat immikkut naleqqiussamik aalajangersarneqarput.

side-by-side-absolute-margins = `<{ $component }>` uuttortaatinut aalajangersimasunut piareersimanngilaq. Sinaakkutsit immikkut naleqqiussamik aalajangersarneqarput.

side-by-side-no-block-child = `<{ $component }>` eqqunngilaq: minnerpaamik ataatsimik block-imik qitornaqassaaq.

## `<label>`

label-for-ignored-on-graphical = `<label>` titartagaasumi `for` attributi sumiginnarneqarpoq.

label-for-must-resolve-to-one = `<label>` `for` attributia komponentimut ataatsimut naapissaaq.

label-for-unresolved = `<label>` `for` attributia komponentimut naapinneqarsinnaanngilaq.

label-for-answer-with-authored-inputs = `<label>` `for` attributia `<answer>`-imut input-iliortitanut innersuivoq; input namminermik innersuutigiuk.

label-for-answer-without-input = `<label>` `for` attributia `<answer>`-imut input-eqanngitsumut innersuivoq.

label-for-must-reference-input-or-answer = `<label>` `for` attributia input imaluunniit answer innersuutigissavaa.

## Accessibility

accessibility-short-description-or-decorative = Atorsinnaanissaa pillugu `<{ $component }>` nassuiaammik naatsumik peqassaaq imaluunniit decorative-itut aalajangersarneqassaaq.

accessibility-video-short-description = Atorsinnaanissaa pillugu `<video>` nassuiaammik naatsumik peqassaaq.

accessibility-input-short-description-or-label = Atorsinnaanissaa pillugu `<{ $component }>` nassuiaammik naatsumik imaluunniit label-imik peqassaaq.

accessibility-answer-input-short-description-or-label = Atorsinnaanissaa pillugu `<answer>` input-iliortoq nassuiaammik naatsumik imaluunniit label-imik peqassaaq.

accessibility-short-description-contains-math = Nassuiaatit naatsut matematikkikkut komponentinik soorlu `<{ $component }>` imaqassanngillat. Matematikki oqaatsinik allaguk.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } immikkoortup qulequtaanut naleqqiussineq naammanngilaq (dark mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; minnerpaamik { $threshold }:1 pisariaqarpoq).
       *[other] { $colorName } immikkoortup qulequtaanut naleqqiussineq naammanngilaq ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; minnerpaamik { $threshold }:1 pisariaqarpoq).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` punktit { $count } aqqutigalugit suli piareersimanngilaq punktit kisitsitinik nalilinngippata.

circle-too-many-through-points = Ammalortoq punktit pingasut amerlanerusut aqqutigalugit naatsorsorneqarsinnaanngilaq.

circle-overprescribed-radius-center-points = Ammalortoq radius, center aamma punktit aalajangersarneqarsimatillugit naatsorsorneqarsinnaanngilaq.

circle-center-with-multiple-points = Ammalortoq center aalajangersarneqarsimatillugu punkti ataaseq amerlaneruleraangat naatsorsorneqarsinnaanngilaq.

circle-radius-too-small = Ammalortoq naatsorsorneqarsinnaanngilaq: punktit marluk akornanni ungasissuseq { $distance } tikillugu, radius aalajangersarneqarsimasoq { $radius } mikinerungaarpoq.

circle-radius-with-many-points = Ammalortoq punktit marluk amerlanerusut aqqutigalugit radius aalajangersarneqarsimatillugu pilersinneqarsinnaanngilaq.

circle-invalid-center-or-through-points = Ammalortup center-ia imaluunniit punktii eqqunngillat.

circle-radius-center-with-multiple-points = Ammalortup radiusia center aalajangersarneqarsimatillugu punkti ataaseq amerlaneruleraangat naatsorsorneqarsinnaanngilaq.

circle-change-radius-non-numerical = Ammalortup radiusia allanngortinneqarsinnaanngilaq punktit kisitsitinik nalilinngippata

circle-radius-with-points-non-numerical = Ammalortoq punkti ataaseq amerlanerusut aqqutigalugit radius aalajangersarneqarsimatillugu pilersinneqarsinnaanngilaq kisitsitinik nalilinngippata.

circle-change-center-non-numerical = Ammalortup center-ia allanngortinnissaa suli piareersimanngilaq punktit kisitsitinik nalilinngippata.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Funktionip domænianut dimensionit naammanngillat. Domæni interval { $intervals }-limmik peqarpoq, funktionili { $inputs ->
            [one] input { $inputs }
           *[other] input-it { $inputs }
        } peqarpoq.
       *[other] Funktionip domænianut dimensionit naammanngillat. Domæni interval-it { $intervals } peqarpoq, funktionili { $inputs ->
            [one] input { $inputs }
           *[other] input-it { $inputs }
        } peqarpoq.
    }

function-domain-invalid-format = Funktionip domænianut formati eqqunngilaq.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Funktionip maximum-ia kisitsitinik nalilik pinnagu sumiginnarneqarpoq.
        [minimum] Funktionip minimum-ia kisitsitinik nalilik pinnagu sumiginnarneqarpoq.
        [extremum] Funktionip extremum-ia kisitsitinik nalilik pinnagu sumiginnarneqarpoq.
        [point] Funktionip punktia kisitsitinik nalilik pinnagu sumiginnarneqarpoq.
        [slope] Funktionip slope-ia kisitsitinik nalilik pinnagu sumiginnarneqarpoq.
       *[other] Funktionip { $type } kisitsitinik nalilik pinnagu sumiginnarneqarpoq.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Funktionip maximum-ia imaqanngitsoq sumiginnarneqarpoq.
        [minimum] Funktionip minimum-ia imaqanngitsoq sumiginnarneqarpoq.
        [extremum] Funktionip extremum-ia imaqanngitsoq sumiginnarneqarpoq.
        [point] Funktionip punktia imaqanngitsoq sumiginnarneqarpoq.
       *[other] Funktionip { $type } imaqanngitsoq sumiginnarneqarpoq.
    }

function-points-too-close = Funktioni punktinik marlunnik qanittuararsuunnik imaqarpoq. Funktioni aalajangersarneqarsinnaanngilaq.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Funktionip iterate-i input-it amerlassusaat output-it amerlassusaannut naapertuuppata taamaallaat pisinnaapput. Funktioni una { $inputs } input-eqarpoq { $outputs ->
            [one] output-ilu { $outputs }
           *[other] output-ilu { $outputs }
        }.
       *[other] Funktionip iterate-i input-it amerlassusaat output-it amerlassusaannut naapertuuppata taamaallaat pisinnaapput. Funktioni una { $inputs } input-eqarpoq { $outputs ->
            [one] output-ilu { $outputs }
           *[other] output-ilu { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Sekvensip takissusaa eqqunngilaq. Kisitsit ilivitsoq mikinerunngitsoq nulli tassaassaaq.

sequence-invalid-step = Sekvensip step-ia eqqunngilaq. type { $type }-imut sekvensimi kisitsittuussaaq.

sequence-invalid-endpoint-number = Kisitsitinik sekvensimi "{ $attribute }" eqqunngilaq. Kisitsittuussaaq.

sequence-invalid-endpoint-letters = Naqinnernik sekvensimi "{ $attribute }" eqqunngilaq. Naqinnernik ataqatigiissaaq.

sequence-invalid-endpoint = Sekvensimi "{ $attribute }" eqqunngilaq.

select-from-sequence-coprime-not-numbers = coprime sumiginnarneqarpoq, kisitsitit toqqarneqanngimmata

select-from-sequence-coprime-with-exclude-combinations = coprime sumiginnarneqarpoq, excludeCombinations aalajangersarneqarmat

## Resolving a `target`

target-not-found = `<{ $source }>` target-ia eqqunngilaq: nassaarineqarsinnaanngilaq.

target-state-variable-not-found = `<{ $source }>` target-ia eqqunngilaq: `<{ $component }>` "{ $property }"-imik state-variabeleqanngilaq.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` variabelii variabelimit independent-imit allaassuteqassapput.

ode-system-duplicate-variable-names = ODE RHS funktionit variabelinik taakkiisunik aalajangersarneqarsinnaanngillat.

ode-system-rhs-function-error = ODE RHS funktioni aalajangersarneqarsinnaanngilaq. mathjs funktionimik pilersitsinermi kukkuneq.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Linjet { $count } akornanni angle aalajangersarneqarsinnaanngilaq

angle-invalid-through-point = `<angle>` through-ianiittoq punkti eqqunngilaq

parabola-vertex-too-many-points = Parabola vertex-ilik punkti ataaseq amerlanerusut aqqutigalugit suli piareersimanngilaq.

parabola-too-many-points = Parabola punktit pingasut amerlanerusut aqqutigalugit suli piareersimanngilaq.

intersection-too-many-items = Intersection pisut marluk amerlanerusunut suli piareersimanngilaq

## Other math components

ionic-compound-not-two-ions = Ioninik marlunnik peqanngitsoq ionimik ataqatigiissitaq suli piareersimanngilaq.

ionic-compound-needs-cation-and-anion = Ionimik ataqatigiissitaq kation ataaseq anion ataasillu taamaallaat piareersimavoq.

solve-equations-cannot-evaluate = Equation aaqqinneqarsinnaanngilaq, naatsorsorneqarsinnaanngimmat: { $equation }

math-operators-operand-number-required = Math-imi operand tigussagaanni operandNumber aalajangersarneqassaaq.

eigen-decomposition-failed = Matrixip eigenvalue-i naatsorsorneqarsinnaanngillat

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameteri { $parameters } pattern-imiinngilaq, taamaattumik imaqanngitsumut naapertuutissaaq.
       *[other] `<matchesPattern>`: parameterit { $parameters } pattern-imiinngillat, taamaattumik imaqanngitsumut naapertuutissapput.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" paasineqarsinnaanngilaq. none, medium, dense imaluunniit kisitsitit marluk pikkut avissaartinneqarsimasut tassaassaaq, soorlu grid="1 0.5". Grid titartanneqanngilaq.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` funktionimik pisariaqartitsivoq { $expected ->
        [one] output ataaseq, tassa slope y' punktini tamani, soorlu `y - x`
       *[other] output marluk, tassa vector punktini tamani, soorlu `(y, -x)`
    }, funktionili tunniunneqartoq { $found ->
        [one] output { $found } peqarpoq
       *[other] output-inik { $found } peqarpoq
    }. { $alternative ->
        [none] Titartanneqartoqanngilaq.
       *[other] `<{ $alternative }>` tassaavoq funktionimut tamatumunnga komponenti. Titartanneqartoqanngilaq.
    }

field-function-attribute-ignored-with-child = `function` attributi sumiginnarneqarpoq, funktioni komponentip iluaniillu tunniunneqarmat; ilua atorneqarpoq. Funktioni ataasiinnarmik tunniuguk.

field-variables-ignored =
    `<{ $component }>`: `variables` attributi komponentip iluani allanneqarsimasup variabelii taasarpai. { $reason ->
        [function-child] Funktioni maani `<function>`-imik qitornaavoq, namminerlu variabelini taasarpai, taamaattumik `variables` sumiginnarneqarpoq.
       *[no-expression] Taama ittoq maani tunniunneqanngilaq, taamaattumik `variables` sumiginnarneqarpoq.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" prefigure-mi atorneqarsinnaanngilaq; right-itut iliuuseqartoqarpoq.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" prefigure-mi atorneqarsinnaanngilaq; top-itut iliuuseqartoqarpoq.

prefigure-invalid-axis-bounds = `<graph>`: prefigure-imut akse-killiit eqqunngillat; bbox nalinginnaasoq (-10,-10,10,10) atorneqarpoq.

prefigure-invalid-width = `<graph>`: prefigure-imut silissusaa eqqunngilaq; silissuseq nalinginnaasoq 425 atorneqarpoq.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure-imut aspectRatio eqqunngilaq; naleqqiussineq nalinginnaasoq 1 atorneqarpoq.

prefigure-grid-spacing-too-fine = `<graph>`: grid-ip akunneri akse-killiinut mikinerungaarput; prefigure-mi grid ilanngunneqanngilaq.

prefigure-annotations-not-rendered = `<graph>`: PreFigure atornagu annotation-it takutinneqassanngillat.

multiple-annotations-children = `<graph>`-imi `<annotations>` qitornat arlallit nassaarineqarput; kingulleq kisiat atorneqarpoq.

## Referring to other components

copy-unrecognized-component-type = Komponentip suussusia ilisimaneqanngitsoq extend- imaluunniit copy-neqarsinnaanngilaq: { $type }.

copy-prop-not-found = { $component }-imik suussuseqartumi prop { $property } nassaarineqarsinnaanngilaq

collect-no-source = Collect-imut source nassaarineqanngilaq.

collect-invalid-component-type = `<{ $component }>` komponentit collect-neqarsinnaanngillat, suussusia eqqunngimmat.

reference-index-unavailable = Indeksi `{ $reference }` innersuutigineqarsinnaanngilaq

## `<callAction>`

component-action-unavailable = Komponentimi `{ $reference }` { $action } atortinneqarsinnaanngilaq

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Data-p ilusaa eqqunngilaq. Sanilerissat takissusaat assigiinngillat. Nassaarineqarpoq componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data-p sanaartukkanik taakkiisunik aqqeqarpoq. Nassaarineqarpoq componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data-p sanaartukkap ateranik amigaateqarpoq. Nassaarineqarpoq componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Akissummut uuma award-ia akissutip namminerisaanut tunngavoq, tamannalu ilimagineqanngitsumik iliuuseqarnermik kinguneqassaaq.

answer-max-num-attempts-in-section-wide-check-work = `<answer>`-imi sectionWideCheckWork-imik imalimmi `maxNumAttempts` sunniuteqanngilaq, misileraanerit amerlassusaat imalimmit aqunneqarmata. `maxNumAttempts` imalimmut aalajangersaruk.

nested-section-wide-check-work-max-num-attempts = sectionWideCheckWork-imik imalimmi allami sectionWideCheckWork-imik imalimmiittumi `maxNumAttempts` sunniuteqanngilaq, misileraanerit amerlassusaat silataani imalimmit aqunneqarmata. `maxNumAttempts` silataaniittumut aalajangersaruk.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Attributi { $attributes } symbolicEquality aalajangersarneqanngippat sunniuteqassanngilaq.
       *[other] Attributit { $attributes } symbolicEquality aalajangersarneqanngippat sunniuteqassanngillat.
    }

answer-invalid-type = Akissummut type eqqunngilaq: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Komponenti `<{ $component }>` ateqanngimmat module-ip attributiatut atorneqarsinnaanngilaq

module-attribute-name-already-defined = Komponenti `<{ $component } name="{ $name }">` module-ip attributiatut atorneqarsinnaanngilaq, `<module>` komponentip "{ $name }" attributitut pigereermagu.

conditional-content-condition-ignored = `<conditionalContent>` case- imaluunniit else-imik qitornalimmi `condition` attributi sumiginnarneqarpoq.

slider-markers-type-mismatch = Marker-it type-iat slider-ip type-ianut naapertuutinngilaq.

pretzel-problem-needs-statement-and-answer = Pretzel eqqunngilaq: `<problem>` tamarmik ataatsimik `<statement>`-eqassapput ataatsimillu `<answer>`-eqassallutik.

pretzel-circuit-first-problem-distractor = Pretzel eqqunngilaq: mode="circuit"-imi `<problem>` siulleq distractor-iusinnaanngilaq.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Attributimut `{ $attribute }` naleq { $values } eqqunngilaq; sumiginnarneqarpoq.
       *[other] Attributimut `{ $attribute }` nalit { $values } eqqunngillat; sumiginnarneqarput.
    }

attribute-must-be-references = Attributimut `{ $attribute }` naleq `{ $value }` eqqunngilaq. Attributi `$`-mik aallartitsisunik innersuussuteqassaaq.

math-input-invalid-function-names = <mathInput>: { $attribute }-imi funktionit aqqi eqqunngitsut sumiginnarneqarput: { $names }. Ateq tamaat takutinneqartoq minnerpaamik naqinnernik marlunnik (naqinnerit imaluunniit hyphen-it) peqassaaq; kingorna `|<mathspeak alternative>` ilanngunneqarsinnaavoq.

## Building components from the source

component-type-invalid = Komponentip suussusia eqqunngilaq: `<{ $componentType }>`

attribute-repeated = Attributi { $attribute } uteqqinneqarsinnaanngilaq.

attribute-invalid-for-component = `<{ $componentType }>`-imik suussuseqartumut attributi "{ $attribute }" eqqunngilaq.

## Style definition contrast

style-definition-insufficient-contrast =
    Style-ip aalajangersagaa { $styleNumber } naleqqiussinermik naammanngitsumik peqarpoq { $context ->
        [text-on-background] allakkat qalipaataat tunuliaqutamut
        [high-contrast] high-contrast qalipaat canvas-imut
        [line] linjep qalipaataa canvas-imut
        [marker] marker-ip qalipaataa canvas-imut
       *[text-on-canvas] allakkat qalipaataat canvas-imut
    }{ $mode ->
        [dark] { " (dark mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; minnerpaamik { $threshold }:1 pisariaqarpoq).

style-definition-dark-mode-text-background-contrast =
    Style-ip aalajangersagaa { $styleNumber } light mode-imut qalipaatinik naammattunik peqaraluartoq, dark mode-imut qalipaatit taakkunannga pinngortitat allakkat qalipaataannut tunuliaqutamullu naleqqiussinermik naammanngitsumik peqarput ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; minnerpaamik { $threshold }:1 pisariaqarpoq). { $suggestion ->
        [available] Dark mode-imi naleqqiussineq naammassalluni, light mode-ip naleqqiussinera annertusiguk (soorlu { $lightAttribute }="{ $lightColor }") imaluunniit dark mode-ip qalipaataa allanngortiguk (soorlu { $darkAttribute }="{ $darkColor }").
       *[none] Dark mode-imi naleqqiussineq naammassalluni, light mode-ip naleqqiussinera annertusiguk imaluunniit qalipaatit textColorDarkMode aamma/imaluunniit backgroundColorDarkMode atorlugit allanngortikkit.
    }

style-definition-dark-mode-text-canvas-contrast =
    Style-ip aalajangersagaa { $styleNumber } light mode-imut allakkanik qalipaatinik naammattunik peqaraluartoq, dark mode-imut allakkat qalipaataat taassumannga pinngortitaq canvas-imut naleqqiussinermik naammanngitsumik peqarpoq ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; minnerpaamik { $threshold }:1 pisariaqarpoq). { $suggestion ->
        [available] Dark mode-imi naleqqiussineq naammassalluni, light mode-ip naleqqiussinera annertusiguk (soorlu textColor="{ $lightColor }") imaluunniit dark mode-ip qalipaataa allanngortiguk (soorlu textColorDarkMode="{ $darkColor }").
       *[none] Dark mode-imi naleqqiussineq naammassalluni, light mode-ip naleqqiussinera annertusiguk imaluunniit qalipaat textColorDarkMode atorlugu allanngortiguk.
    }

section-multiple-style-palettes = Immikkoortoq <stylePalette> ataaseq kisiat toqqarsinnaavaa; kingulleq atorneqarpoq.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component }-ip variant-i immikkut ittut aalajangersarneqarsinnaanngillat, numToSelect kisitsit ilivitsoq mikinerunngitsoq nulli pinnagu.

variant-num-to-select-not-constant-number = { $component }-ip variant-i immikkut ittut aalajangersarneqarsinnaanngillat, numToSelect kisitsit allanngunngitsoq pinnagu.

variant-with-replacement-not-constant-boolean = { $component }-ip variant-i immikkut ittut aalajangersarneqarsinnaanngillat, withReplacement boolean allanngunngitsoq pinnagu.

variant-select-weight-disables-unique = Select-imut variant-it immikkut ittut atorunnaarput selectWeight imaluunniit selectForVariants aalajangersarneqarsimappat

variant-coprime-undetermined = { $component }-ip variant-i immikkut ittut aalajangersarneqarsinnaanngillat, coprime tamatigut false-iusoq aalajangersarneqarsinnaanngimmat.

variant-attribute-not-constant = { $component }-ip variant-i immikkut ittut aalajangersarneqarsinnaanngillat, { $attribute } allanngunngitsuunngimmat.

variant-attribute-not-number = { $component }-ip variant-i immikkut ittut aalajangersarneqarsinnaanngillat, { $attribute } kisitsittuunngimmat.

variant-attribute-wrong-type-for-sequence =
    { $type }-imik suussuseqartup { $component }-ip variant-i immikkut ittut aalajangersarneqarsinnaanngillat, { $attribute } { $expected ->
        [letters-combination] naqinnernik ataqatigiissitaq
        [math-expression] matematikkikkut allataq eqqortoq
        [integer] kisitsit ilivitsoq
       *[number] kisitsit
    } pinnagu.

variant-length-not-integer = { $component }-ip variant-i immikkut ittut aalajangersarneqarsinnaanngillat, length kisitsit ilivitsoq pinnagu.

variant-sort-not-implemented = { $component } sort-ilik variant-inik immikkut ittunik suli piareersimanngilaq

variant-exclude-combinations-not-implemented = { $component } excludeCombinations-ilik variant-inik immikkut ittunik suli piareersimanngilaq

variant-math-exclude-not-implemented = { $component } math-imik suussuseqartoq exclude-ilik variant-inik immikkut ittunik suli piareersimanngilaq

variant-non-constant-exclude-not-implemented = { $component } exclude allanngortartumik peqartoq variant-inik immikkut ittunik suli piareersimanngilaq

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph-imi prefigure-mi atorneqarsinnaanngilaq; kingornussaq qaangerneqarpoq.

prefigure-descendant-invalid-geometry = { $subject }: geometria naammanngitsoq imaluunniit killeqanngitsoq; kingornussaq qaangerneqarpoq.

prefigure-curve-label-omitted = { $subject }: curve-inut nuutitanut label-it atorneqarsinnaanngillat; label ilanngunneqanngilaq.

prefigure-curve-unsupported-definition-type = { $subject }: curve-ip funktionianut aalajangersaammik suussusia '{ $definitionType }' atorneqarsinnaanngilaq; kingornussaq qaangerneqarpoq.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves-imi flipFunctions attributi atorneqarsinnaanngilaq; kingornussaq qaangerneqarpoq.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves-imi formula-mik suussuseqartut funktionit qitornat kisiisa atorneqarsinnaapput; kingornussaq qaangerneqarpoq.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' atorneqarsinnaanngilaq { $labelKind ->
        [line-family] linje-ilaannut label
       *[point] punktimut label
    }; PreFigure-ip inissinnera nalinginnaasoq atorneqarpoq.

prefigure-fill-style-unsupported = { $subject }: fill style '{ $fillStyle }' PreFigure-imi atorneqarsinnaanngilaq; immersuineq nalinginnaasoq atorneqarpoq.

prefigure-line-style-unknown = { $subject }: linjep ilusaa '{ $lineStyle }' ilisimaneqanngilaq, PreFigure-imut ilanngunneqanngilaq.

prefigure-marker-style-mapped-to-diamond = { $subject }: marker style '{ $markerStyle }' PreFigure-imi 'diamond'-imut nuunneqarpoq.

prefigure-marker-style-unsupported = { $subject }: marker style '{ $markerStyle }' PreFigure-imi atorneqarsinnaanngilaq; ilusaq nalinginnaasoq atorneqarpoq.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` eqqunngilaq; anguniagaq nassaarineqarsinnaanngilaq. Annotation ilanngunneqanngilaq.

annotation-ref-multiple-targets = `<annotation>`: `ref` anguniaganut arlalinnut naapippoq; siulleq atorneqarpoq.

annotation-ref-outside-graph = `<annotation>`: `ref` eqqunngilaq; anguniagaq graph-ip avataaniippoq. Annotation ilanngunneqanngilaq.

annotation-ref-unsupported-target = `<annotation>`: `ref` eqqunngilaq; anguniagaq prefigure-imi titartagaasunut ilaanngilaq. Annotation ilanngunneqanngilaq.

annotation-text-missing = `<annotation>`: `text` amigaappoq imaluunniit imaqanngilaq; allakkat imaqanngitsut atorneqarput.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Ammalortumik attuumassuteqarneq paasineqarpoq.
       *[other] `<{ $componentType }>` komponentimik ilaqartumik ammalortumik attuumassuteqarneq paasineqarpoq.
    }

reference-no-referent = Innersuussutimut referent nassaarineqanngilaq: `{ $reference }`

reference-multiple-referents = Innersuussutimut referent-it arlallit nassaarineqarput: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>`-ip attributianut { $attribute } formati eqqunngilaq.

children-invalid = `<{ $componentType }>`-imut qitornat eqqunngillat: qitornat eqqunngitsut nassaarineqarput: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Attributimut `{ $attribute }` naleq `{ $value }` eqqunngilaq, naleq `{ $default }` atorneqarpoq

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML versioni { $version } nassaarineqanngilaq.
       *[other] DoenetML versioni { $version } nassaarineqanngilaq. Versioni { $fallback } atorneqassaaq
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML eqqunngilaq: { $content }

parse-tag-missing-close-tag = DoenetML eqqunngilaq: Tag `{ $tag }` matuisumik tag-eqanngilaq. Namminermik matuisumik tag imaluunniit `</{ $tagName }>` tag naatsorsuutigineqarpoq.

parse-tag-error = DoenetML eqqunngilaq: Tag `<{ $tagName }>`-imi kukkuneq

parse-attribute-missing-value = DoenetML eqqunngilaq: Attributi `{ $attribute }` eqqunngilaq, nalimmik amigaateqartoq.

parse-attribute-invalid = DoenetML eqqunngilaq: Attributi `{ $attribute }` eqqunngilaq

parse-attribute-value-invalid = DoenetML eqqunngilaq: Attributip nalia `{ $value }` eqqunngilaq

parse-attribute-value-quote-mismatch = DoenetML eqqunngilaq: Attributip nalia `{ $value }` eqqunngilaq. Ussatit naapertuutinngillat. `{ $quote }` amigaassasoq isumaqarpoq

parse-open-tag-name-missing = DoenetML eqqunngilaq: Tag ateqanngitsoq nassaarineqarpoq, soorlu `<`

parse-tag-not-closed = DoenetML eqqunngilaq: Tag `{ $tag }` matuneqanngilaq (`>` amigaassasoq isumaqarpoq).

parse-self-closing-tag-name-missing = DoenetML eqqunngilaq: Tag ateqanngitsoq nassaarineqarpoq `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML eqqunngilaq: Tag `{ $tag }` matuneqanngilaq (`/>` amigaassasoq isumaqarpoq).

parse-tag-invalid-attributes = DoenetML eqqunngilaq: Tag `{ $tag }` eqqunngilaq. Attributinik eqqunngitsunik peqarsinnaavoq.

parse-close-tag-name-missing = DoenetML eqqunngilaq: Matuisoq tag ateqanngitsoq nassaarineqarpoq, soorlu `</`

parse-attribute-value-unquoted = Attributit nalii ussatinut ilineqassapput: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML eqqunngilaq: Matuisoq tag `{ $tag }` nassaarineqarpoq, ammaanerali tag peqanngilaq

parse-close-tag-mismatched = DoenetML eqqunngilaq: Matuisoq tag naapertuutinngilaq. `</{ $expected }>` naatsorsuutigineqarpoq. `{ $found }` nassaarineqarpoq

parser-node-unconvertible = Node { $node } Dast node-imut nuunneqarsinnaanngilaq.

## Names

name-attribute-invalid =
    Attributip atia name='{ $name }' eqqunngilaq. { $reason ->
        [characters] Aqqit naqinnernik, kisitsisinik, underscore-inik imaluunniit hyphen-inik kisiisa imaqarsinnaapput.
       *[start] Aqqit naqinnermik aallartissapput.
    }

component-name-invalid-start = Komponentip atia "{ $name }" eqqunngilaq. Aqqit naqinnermik aallartissapput.

## `<answer>` sugar

answer-video-watched-missing-video = type videoWatched-imik akissut video attributeqassaaq

answer-video-watched-video-not-reference = type videoWatched-imik akissummi video attributi innersuussutaassaaq

answer-name-not-single-text = Akissutip name attributia ataatsimik text-imik qitornaqassaaq

## Referencing another document

external-doenetml-recursion-limit = Avataaniit DoenetML aaneqarsinnaanngilaq, uteqqiinerit amerlangaarmata. Ammalortumik innersuussuteqarpa?

external-doenetml-unavailable = { $attribute }="{ $uri }"-miit DoenetML aaneqarsinnaanngilaq

external-doenetml-type-mismatch = { $attribute }="{ $uri }"-miit DoenetML aajuk eqqunngilaq: komponentip suussusianut "{ $componentType }" naapertuutinngilaq

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Attributi `{ $from }` atorunnaarsinneqarpoq; taassuma taarsiullugu `{ $to }` atoruk.
       *[other] [deprecation] `<{ $component }>`-imi attributi `{ $from }` atorunnaarsinneqarpoq; taassuma taarsiullugu `{ $to }` atoruk.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Attributi `{ $from }` atorunnaarsinneqarpoq sumiginnarneqarlunilu, `{ $to }` aamma aalajangersarneqarmat.
       *[other] [deprecation] `<{ $component }>`-imi attributi `{ $from }` atorunnaarsinneqarpoq sumiginnarneqarlunilu, `{ $to }` aamma aalajangersarneqarmat.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>`-imi attributi `{ $attribute }` atorunnaarsinneqarpoq sumiginnarneqarlunilu.

deprecated-attribute-to-child = [deprecation] `<{ $component }>`-imi attributi `{ $attribute }` atorunnaarsinneqarpoq; taassuma taarsiullugu `<{ $child }>` qitornatut atoruk.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>`-imi attributip `{ $attribute }` nalia `{ $value }` atorunnaarsinneqarpoq; taassuma taarsiullugu `{ $to }` atoruk.


## Language coverage

pluralize-english-only = `<pluralize>` tuluttut kisiat amerlanngortitsisinnaavoq, taamaattumik allakkani { $locale }-mik oqaatsilinni allakkat allanngortinneqanngillat. Amerlanngortitaq nammineq allaguk, imaluunniit `pluralForm` attributikkut aalajangersaruk.


## Checking against the schema

schema-element-unrecognized = Element `<{ $tag }>` Doenet-imut ilisimaneqanngilaq.

schema-element-not-allowed-at-root = Element `<{ $tag }>` allakkat aallaqqaataanni akuersissutaanngilaq.

schema-element-not-allowed-inside = Element `<{ $tag }>` `<{ $parent }>`-ip iluani akuersissutaanngilaq.

schema-attribute-unrecognized = Element `<{ $tag }>` `{ $attribute }`-imik attributeqanngilaq.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Element `<{ $tag }>`-ip attributia `{ $attribute }` allattorsimaffiussaaq, ilaasa tamarmik ukunannga ataaseq: { $allowed }
       *[other] Element `<{ $tag }>`-ip attributia `{ $attribute }` ukunannga ataaseq tassaassaaq: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Select-imut variant-ip atia eqqunngilaq. Variant-ip atia { $variantName } option-ini { $numOptions } takkuppoq, toqqagassalli amerlassusaat { $numToSelect }.

select-variant-name-without-options = Select-imut variant-it ilaat aalajangersarneqarput, variant-ip atianulli { $variantName } option-eqanngilaq.

select-variant-name-not-possible = Select-imut aalajangersagaq variant-ip atia { $variantName } pisinnaanngilaq.

select-too-few-options = Komponentit { $numToSelect } taamaallaat { $numOptions }-init toqqarneqarsinnaanngillat.

select-from-sequence-too-few-values = Nalit { $numToSelect } takissusaa { $length }-imik sekvensimit toqqarneqarsinnaanngillat.

select-from-sequence-indices-count-mismatch = Select-imut indeksit amerlassusaat toqqagassat amerlassusaannut naapertuussapput

select-from-sequence-indices-not-integers = Select-imut indeksit tamarmik kisitsisit ilivitsuussapput

select-from-sequence-index-excluded = selectfromsequence-imut indeksi aalajangersarneqarsimasoq peerneqarsimavoq

select-from-sequence-indices-excluded-combination = selectfromsequence-imut indeksit aalajangersarneqarsimasut ataqatigiissitaq peerneqarsimasoq

select-from-sequence-coprime-not-positive-integers = Coprime ataqatigiissitat toqqarneqarsinnaanngillat, kisitsisit ilivitsut pisut toqqarneqanngimmata.

select-from-sequence-coprime-common-factor = Coprime kisitsisit toqqarneqarsinnaanngillat. Nalit tamarmik faktorimik ataatsimik ataatsimoortumik peqarput. ("from" imaluunniit "to" nalit "step"-imut coprime-iussapput.)

select-from-sequence-excluded-too-many-combinations = selectFromSequence-imi ataqatigiissitat 70%-it sinnerlugit peerneqarput

select-from-sequence-coprime-single-number = Coprime ataqatigiissitat kisitsimit ataatsimit 1-iunngitsumit toqqarneqarsinnaanngillat.

select-from-sequence-coprime-none-found = Coprime kisitsisit toqqarneqarsinnaanngillat. Nalit tamarmik faktorimik ataatsimoortumik peqarput.

select-from-sequence-too-few-unique-values = Nalit immikkut ittut { $numToSelect } takissusaa { $numPossibleValues }-imik sekvensimit toqqarneqarsinnaanngillat

select-prime-numbers-too-few-values = Nalit { $numToSelect } prime-kisitsisit takissusaat { $numValues } iluanniit toqqarneqarsinnaanngillat

select-prime-numbers-values-count-mismatch = Select-imut nalit amerlassusaat toqqagassat amerlassusaannut naapertuussapput

select-prime-numbers-values-not-prime = Select prime number-imut nalit tamarmik prime-kisitsisini allattorsimassapput

select-prime-numbers-values-excluded-combination = selectPrimeNumbers-imut nalit aalajangersarneqarsimasut ataqatigiissitaq peerneqarsimasoq

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers-imi ataqatigiissitat 70%-it sinnerlugit peerneqarput

select-random-combination-fluke = Pinngitsoornermik ilimanaatsuararsuarmik nalit toqqarneqartut ataqatigiissitaq toqqarneqarsinnaanngilaq

select-random-value-fluke = Pinngitsoornermik ilimanaatsuararsuarmik naleq toqqarneqarsinnaanngilaq

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` matematikkip iluani titartanneqanngilaq; allakkat ilusilerneqarput input-it ilanngunneqarsinnaanngitsutut. { $reason ->
        [not-inline] `inline`-iusoq choice input kisiat allakkat iluanut naammappoq; `inline`-iunngippat naqitat katersugaataapput.
        [expanded] `expanded`-iusoq text input allattoqarfittut arlalinnik titeqarpoq, allakkat iluanut angitigingaartoq.
        [on-graph] Graph-imi allakkat assittut ataatsitut titartanneqarput, aqutsissummullu inissaqanngilaq.
       *[relative-width] `width`-ia naleqqiussamik aalajangersarneqarpoq (procent imaluunniit `em`), allakkat iluanilu uuttortagassaqanngilaq. Silissuseq uuttortaatinik aalajangersimasunik, soorlu `px`, aalajangersaruk.
    }
