# Ladin (ladin) diagnostics. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and standard.** Latin script, Ladin Dolomitan (the SPELL standard);
# see `chrome.ftl` for the note on the spelling and on the valley varieties
# (Gherdëina, Badiot, Fascian) that this koine stands over.
#
# **The quickest check that a line here is Ladin** and not Italian in Ladin
# spelling: «y» for *and*, «sce» for *if*, «nia» for the negator, «no se pò»
# for *cannot*, «mëss» for *must*, «l é» / «i é» for the copula, «ciaté» for
# *to find*, «fal» for *error*, «linia» for *line*, «chiló» for *here*. A
# sentence in this file with «e» for *and* is very likely still Italian.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber` — are part of the language, not prose,
# and stay in English exactly as written. So does anything quoted back from the
# author's own source, and so do `WCAG AA`, `DoenetML`, `PreFigure` and
# `prefigure`, which are names. Digits render in Latin numerals everywhere.
#
# **Counts.** CLDR has rules for `lld` declaring `one`, `many` and `other`.
# `many` is reached only by an exact whole multiple of a million, which no
# count in this file can be, so the `[one]`/`*[other]` branches here are
# selected by Ladin's own rules and no `[many]` branch appears anywhere. See
# `chrome.ftl`. Every **symbolic** selector — `$type`,
# `$mode`, `$reason`, `$context`, `$suggestion`, `$alternative`, `$fallback`,
# `$expected`, `$labelKind`, `$isList`, `$componentType` — is kept byte for
# byte from English, keys included.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } vën ignorà canche l é dai doi ponc finai
       *[other] { $attributes } vën ignoré canche l é dai doi ponc finai
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } vën ignorà canche l é dat n pont finel y n pont de mez
       *[other] { $attributes } vën ignoré canche l é dat n pont finel y n pont de mez
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset no à degun efet zenza n pont de mez

## `<line>`

line-points-undetermined-dimensions = Linia tres ponc de dimension nia determinada.

line-points-too-few-dimensions = Na linia mëss jì tres ponc de almanco does dimensions.

line-points-depend-on-variables = La linia va tres ponc che depënd da variables: { $variables }.

line-equation-invalid-format = Format nia valid per la ecuazion dla linia te les variables { $variable1 } y { $variable2 }.

## `<ray>`

ray-overprescribed-through = La semireta é definida da through, endpoint y direction.  L through dat vën ignorà.

ray-dimension-mismatch = numDimensions no va adum te la semireta.

## `<vector>`

vector-overprescribed-head = L vetor é definì da head, tail y displacement.  L head dat vën ignorà.

vector-dimension-mismatch = numDimensions no va adum tl vetor.

## Attracting and constraining

attract-to-without-nearest-point = No se pò tré viers n `<{ $component }>`, ajache al no à la variabla de stat nearestPoint.

constrain-to-without-nearest-point = No se pò vinculé a n `<{ $component }>`, ajache al no à la variabla de stat nearestPoint.

constrain-to-interior-without-nearest-point = No se pò vinculé al enter de n `<{ $component }>`, ajache al no à la variabla de stat nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition vën ignorà per n choiceInput che no é inline

## Ordering children by index

choice-input-indices-count-mismatch = Se ignora i indesc dac per choiceInput, ajache l numer di indesc no va adum col numer di fis choice.

pretzel-indices-count-mismatch = Se ignora i indesc dac per problem, ajache l numer di indesc no va adum col numer di fis problem.

shuffle-indices-count-mismatch = Se ignora i indesc dac per shuffle, ajache l numer di indesc no va adum col numer di componënc.

indices-ignored-out-of-range = Se ignora i indesc dac per { $component }, ajache valch indesc é fora dl intervall.

pretzel-indices-repeated = Se ignora i indesc dac per pretzel, ajache valch indesc é ripetù.

pretzel-circuit-first-index = Se ignora i indesc dac per pretzel te la modalité circuit, ajache l prim indesc mëss vester 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Per che `<{ $component }>` funzioneie con fis de test, mëss vester dat n atribut `type`.

invalid-type-defaulting-to-math = Sort { $type } nia valida per l componënt { $component }. Mëss vester una danter math, text, number o boolean. Se dopra math.

string-not-valid-component-to-arrange = L test "{ $value }" no é n componënt valid per { $component }. Se l ignora.

## Types and variables

invalid-type-defaulting-to-number = Sort { $type } nia valida, se mët la sort a number.

invalid-variable-value = Valour nia valid de na variabla: `{ $value }`

## Variants

variant-index-must-be-number = L indesc de variant { $index } mëss vester n numer

variant-index-must-be-integer = L indesc de variant { $index } mëss vester n numer entier

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` no é implementà per mesures assolutes. Se mët les largëzes a relatives.

side-by-side-absolute-margins = `<{ $component }>` no é implementà per mesures assolutes. Se mët i marecc a relatifs.

side-by-side-no-block-child = `<{ $component }>` nia valid: al mëss avëi almanco n fi de bloch.

## `<label>`

label-for-ignored-on-graphical = L atribut `for` sun na `<label>` grafica vën ignorà.

label-for-must-resolve-to-one = L atribut `for` sun `<label>` mëss se resolver te propi n componënt.

label-for-unresolved = L atribut `for` sun `<label>` no s'à nia podù resolver te n componënt.

label-for-answer-with-authored-inputs = L atribut `for` sun `<label>` fej referimënt a n `<answer>` con inputs scric a man; fej referimënt dërt al input.

label-for-answer-without-input = L atribut `for` sun `<label>` fej referimënt a n `<answer>` zenza n input da etichëté.

label-for-must-reference-input-or-answer = L atribut `for` sun `<label>` mëss fé referimënt a n input o a na resposta.

## Accessibility

accessibility-short-description-or-decorative = Per la azessibilité, `<{ $component }>` mëss avëi na descrizion curta o vester segnà sciche decoratif.

accessibility-video-short-description = Per la azessibilité, `<video>` mëss avëi na descrizion curta.

accessibility-input-short-description-or-label = Per la azessibilité, `<{ $component }>` mëss avëi na descrizion curta o na etichëta.

accessibility-answer-input-short-description-or-label = Per la azessibilité, n `<answer>` che cria n input mëss avëi na descrizion curta o na etichëta.

accessibility-short-description-contains-math = Les descrizions curtes no dess avëi ite componënc matematics coche `<{ $component }>`. Scrì la matematica con parores.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } no à assé contrast per l test dl titul dla sezion (modalité scura) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; l ó almanco { $threshold }:1).
       *[other] { $colorName } no à assé contrast per l test dl titul dla sezion ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; l ó almanco { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = N `<circle>` tres { $count } ponc no é implementà tl caje che i ponc no à valours numerics.

circle-too-many-through-points = No se pò calcolé n zircul tres plu de 3 ponc.

circle-overprescribed-radius-center-points = No se pò calcolé n zircul con radius, zënter y ponc de passage dac.

circle-center-with-multiple-points = No se pò calcolé n zircul con zënter dat tres plu de 1 pont.

circle-radius-too-small = No se pò calcolé l zircul: dat che la destanza danter i doi ponc é { $distance }, l radius dat { $radius } é massa pitl.

circle-radius-with-many-points = No se pò crié n zircul tres plu de doi ponc con n radius dat.

circle-invalid-center-or-through-points = Zënter o ponc de passage dl zircul nia valics.

circle-radius-center-with-multiple-points = No se pò calcolé l radius de n zircul con zënter dat tres plu de 1 pont.

circle-change-radius-non-numerical = No se pò mudé l radius de n zircul con ponc de passage nia numerics

circle-radius-with-points-non-numerical = No se pò crié n zircul tres plu de n pont con n radius dat canche no l é valours numerics.

circle-change-center-non-numerical = Mudé l zënter de n zircul tres ponc zenza valours numerics no é ćiamò implementà.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Nia assé dimensions per l domini dla funzion. L domini à { $intervals } intervall ma la funzion à { $inputs ->
            [one] { $inputs } input
           *[other] { $inputs } inputs
        }.
       *[other] Nia assé dimensions per l domini dla funzion. L domini à { $intervals } intervai ma la funzion à { $inputs ->
            [one] { $inputs } input
           *[other] { $inputs } inputs
        }.
    }

function-domain-invalid-format = Format nia valid per l domini dla funzion.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Se ignora n massim dla funzion che no é numerich.
        [minimum] Se ignora n minim dla funzion che no é numerich.
        [extremum] Se ignora n estrem dla funzion che no é numerich.
        [point] Se ignora n pont dla funzion che no é numerich.
        [slope] Se ignora na pendënza dla funzion che no é numerica.
       *[other] Se ignora n { $type } dla funzion che no é numerich.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Se ignora n massim vuet dla funzion.
        [minimum] Se ignora n minim vuet dla funzion.
        [extremum] Se ignora n estrem vuet dla funzion.
        [point] Se ignora n pont vuet dla funzion.
       *[other] Se ignora n { $type } vuet dla funzion.
    }

function-points-too-close = La funzion à doi ponc massa daimprò un dal auter. No se pò definì la funzion.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Les iterazions de na funzion é poscibles demé sce l numer di inputs é medemo al numer di outputs. Chesta funzion à { $inputs } input y { $outputs ->
            [one] { $outputs } output
           *[other] { $outputs } outputs
        }.
       *[other] Les iterazions de na funzion é poscibles demé sce l numer di inputs é medemo al numer di outputs. Chesta funzion à { $inputs } inputs y { $outputs ->
            [one] { $outputs } output
           *[other] { $outputs } outputs
        }.
    }

## `<sequence>`

sequence-invalid-length = Lunghëza dla sequënza nia valida.  Mëss vester n numer entier nia negatif.

sequence-invalid-step = Pas dla sequënza nia valid.  Mëss vester n numer per na sequënza de sort { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" nia valid de na sequënza de numeri.  Mëss vester n numer.

sequence-invalid-endpoint-letters = "{ $attribute }" nia valid de na sequënza de lëtres.  Mëss vester na combinazion de lëtres.

sequence-invalid-endpoint = "{ $attribute }" dla sequënza nia valid.

select-from-sequence-coprime-not-numbers = coprime vën ignorà ajache no se chir numeri

select-from-sequence-coprime-with-exclude-combinations = coprime vën ignorà ajache l é dat excludeCombinations

## Resolving a `target`

target-not-found = target nia valid per `<{ $source }>`: no se ciata l destinatar.

target-state-variable-not-found = target nia valid per `<{ $source }>`: no se ciata na variabla de stat che se tlama "{ $property }" sun n `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Les variables de `<odeSystem>` mëss vester desvalives dala variabla independënta.

ode-system-duplicate-variable-names = No se pò definì les funzions RHS dla ODE con inuems de variables dependëntes ripetui.

ode-system-rhs-function-error = No se pò definì la funzion RHS dla ODE.  Fal te la creazion dla funzion mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = No se pò definì n angul danter { $count } linies

angle-invalid-through-point = Pont nia valid te through de `<angle>`

parabola-vertex-too-many-points = Na parabola con vertesc tres plu de 1 pont no é ćiamò implementada.

parabola-too-many-points = Na parabola tres plu de 3 ponc no é ćiamò implementada.

intersection-too-many-items = La intersezion de plu de doi elemënc no é ćiamò implementada

## Other math components

ionic-compound-not-two-ions = N compost ionich de zeche auter che doi ions no é ćiamò implementà.

ionic-compound-needs-cation-and-anion = L compost ionich é implementà demé per n cation y n anion.

solve-equations-cannot-evaluate = No se pò resolver la ecuazion ajache no s'à nia podù la valuté: { $equation }

math-operators-operand-number-required = Mëss vester dat n operandNumber canche se tira fora n operand matematich.

eigen-decomposition-failed = No s'à nia podù calcolé i autovalours dla matriza

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: l parameter { $parameters } no vën dant tl model, coscì al jirà for adum con n vuet.
       *[other] `<matchesPattern>`: i parameters { $parameters } no vën dant tl model, coscì ai jirà for adum con n vuet.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: no se pò enterpreté grid="{ $grid }". Mëss vester none, medium, dense o doi numeri positifs departis da n spazie, coche grid="1 0.5". No vën trat deguna gradela.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` à debojen de na funzion con { $expected ->
        [one] n output, la pendënza y' te vigni pont, coche `y - x`
       *[other] doi outputs, l vetor te vigni pont, coche `(y, -x)`
    }, ma la funzion che i é stada data à { $found ->
        [one] { $found } output
       *[other] { $found } outputs
    }. { $alternative ->
        [none] No vën trat nia.
       *[other] `<{ $alternative }>` é l componënt per chela funzion. No vën trat nia.
    }

field-function-attribute-ignored-with-child = L atribut `function` vën ignorà ajache la funzion é data ence ite tl componënt; se dopra chela ite. Da la funzion demé te una dles does manieres.

field-variables-ignored =
    `<{ $component }>`: l atribut `variables` inuma les variables de na espression scrita dërt ite tl componënt. { $reason ->
        [function-child] La funzion chiló é data sciche fi `<function>`, che inuma sües variables, coscì `variables` vën ignorà.
       *[no-expression] Chiló no l é deguna espression de chela sort, coscì `variables` vën ignorà.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" no vën sostenì tl renderisadour prefigure; se dopra l comportamënt dla posizion a man dërta.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" no vën sostenì tl renderisadour prefigure; se dopra l comportamënt dla posizion en aut.

prefigure-invalid-axis-bounds = `<graph>`: limic di ass nia valics per la conversion prefigure; se dopra l bbox predefinì (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: largëza nia valida per la conversion prefigure; se dopra la largëza predefinida dl diagram 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio nia valid per la conversion prefigure; se dopra la proporzion predefinida 1.

prefigure-grid-spacing-too-fine = `<graph>`: la gradela é massa fina per i limic di ass; la gradela vën lasciada fora tl renderisadour prefigure.

prefigure-annotations-not-rendered = `<graph>`: les anotazions no vën trates canche no se dopra l renderisadour PreFigure.

multiple-annotations-children = S'à ciatà plu fis `<annotations>` te `<graph>`; duc fora che l ultim vën ignoré.

## Referring to other components

copy-unrecognized-component-type = No se pò estënder o copié na sort de componënt nia conesciuda: { $type }.

copy-prop-not-found = No s'à nia ciatà la proprieté { $property } sun n componënt de sort { $component }

collect-no-source = Deguna sorgiva ciatada per collect.

collect-invalid-component-type = No se pò tré adum componënc de sort `<{ $component }>`, ajache al é na sort de componënt nia valida.

reference-index-unavailable = No se pò fé referimënt al indesc `{ $reference }`

## `<callAction>`

component-action-unavailable = No se pò tlamé { $action } sun l componënt `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = I dac à na forma nia valida.  Les linies à lunghëzes desvalives. Ciatà te componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = I dac à inuems de colona ripetui.  Ciatà te componentIdx :{ $componentIdx }

data-frame-missing-column-name = Ai dac ti mancia n inuem de colona.  Ciatà te componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = N premi per chesta resposta é basà sun la resposta manada dl tag answer instës, y chest menerà a n comportamënt nia aspetà.

answer-max-num-attempts-in-section-wide-check-work = Meter `maxNumAttempts` sun n `<answer>` ite te n contenidour con `sectionWideCheckWork` no à degun efet, ajache l numer di tentatifs vën controlà dal contenidour. Mët `maxNumAttempts` sun l contenidour al post.

nested-section-wide-check-work-max-num-attempts = Meter `maxNumAttempts` sun n contenidour con `sectionWideCheckWork` che sta ite te n auter contenidour con `sectionWideCheckWork` no à degun efet, ajache l numer di tentatifs vën controlà dal contenidour de fora. Mët `maxNumAttempts` sun l contenidour de fora al post.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] L atribut { $attributes } no à degun efet zenza symbolicEquality metù.
       *[other] I atribuc { $attributes } no à degun efet zenza symbolicEquality metù.
    }

answer-invalid-type = Sort nia valida per la resposta: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ajache l componënt `<{ $component }>` no à n inuem, no se l pò doré sciche atribut de n modul

module-attribute-name-already-defined = L componënt `<{ $component } name="{ $name }">` no se l pò doré sciche atribut de n modul ajache la sort de componënt `<module>` à bele n atribut "{ $name }" definì.

conditional-content-condition-ignored = L atribut `condition` vën ignorà sun n componënt `<conditionalContent>` con fis case o else.

slider-markers-type-mismatch = La sort di marcadours no va adum con la sort dl slider.

pretzel-problem-needs-statement-and-answer = pretzel nia valid: vigni `<problem>` mëss avëi ite n `<statement>` y n `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel nia valid: te mode="circuit", l prim `<problem>` no pò vester n distratour.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Valour nia valid { $values } per l atribut `{ $attribute }`; se l ignora.
       *[other] Valours nia valics { $values } per l atribut `{ $attribute }`; se i ignora.
    }

attribute-must-be-references = Valour nia valid `{ $value }` per l atribut `{ $attribute }`. L atribut mëss vester metù adum de referimënc che scomëncia con n `$`.

math-input-invalid-function-names = <mathInput>: s'à ignorà inuems de funzion nia valics te { $attribute }: { $names }. L toch mostrà de vigni inuem mëss avëi almanco 2 carater (lëtres o tratins); do pò unì n sufis opzionel `|<alternativa mathspeak>`.

## Building components from the source

component-type-invalid = Sort de componënt nia valida: `<{ $componentType }>`

attribute-repeated = No se pò ripeter l atribut { $attribute }.

attribute-invalid-for-component = Atribut "{ $attribute }" nia valid per n componënt de sort `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    La definizion de stil { $styleNumber } no à assé contrast per { $context ->
        [text-on-background] l colour dl test contra l colour dl fond
        [high-contrast] l colour a aut contrast contra la tela
        [line] l colour dla linia contra la tela
        [marker] l colour dl marcadour contra la tela
       *[text-on-canvas] l colour dl test contra la tela
    }{ $mode ->
        [dark] { " (modalité scura)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; l ó almanco { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Ence sce la definizion de stil { $styleNumber } à colours che dà assé contrast per la modalité tlera, i colours per la modalité scura tirés fora da chisc valours no à assé contrast danter l colour dl test y l colour dl fond ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; l ó almanco { $threshold }:1). { $suggestion ->
        [available] Per avëi assé contrast te la modalité scura, o auza l contrast dla modalité tlera (p.ej. mët { $lightAttribute }="{ $lightColor }") o va sourapro al colour dla modalité scura (p.ej. mët { $darkAttribute }="{ $darkColor }").
       *[none] Per avëi assé contrast te la modalité scura, auza l contrast dla modalité tlera o va sourapro ai colours tirés fora con textColorDarkMode y/o backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ence sce la definizion de stil { $styleNumber } à n colour dl test che dà assé contrast per la modalité tlera, l colour dl test per la modalité scura tirà fora da chel valour no à assé contrast contra la tela ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; l ó almanco { $threshold }:1). { $suggestion ->
        [available] Per avëi assé contrast te la modalité scura, o auza l contrast dla modalité tlera (p.ej. mët textColor="{ $lightColor }") o va sourapro al colour dla modalité scura (p.ej. mët textColorDarkMode="{ $darkColor }").
       *[none] Per avëi assé contrast te la modalité scura, auza l contrast dla modalité tlera o va sourapro al colour tirà fora con textColorDarkMode.
    }

section-multiple-style-palettes = Na sezion pò chirì demé n <stylePalette>; se dopra l ultim.

## Unique variants

variant-num-to-select-not-non-negative-integer = no se pò determiné i varianc unics de { $component }, ajache numToSelect no é n numer entier nia negatif.

variant-num-to-select-not-constant-number = no se pò determiné i varianc unics de { $component }, ajache numToSelect no é n numer costant.

variant-with-replacement-not-constant-boolean = no se pò determiné i varianc unics de { $component }, ajache withReplacement no é n boolean costant.

variant-select-weight-disables-unique = I varianc unics per select é desmorcés sce na opzion à selectWeight o selectForVariants dat

variant-coprime-undetermined = no se pò determiné i varianc unics de { $component }, ajache no se pò determiné che coprime sie for fauz.

variant-attribute-not-constant = no se pò determiné i varianc unics de { $component }, ajache { $attribute } no é na costanta.

variant-attribute-not-number = no se pò determiné i varianc unics de { $component }, ajache { $attribute } no é n numer.

variant-attribute-wrong-type-for-sequence =
    no se pò determiné i varianc unics de { $component } de sort { $type }, ajache { $attribute } no é { $expected ->
        [letters-combination] na combinazion de lëtres
        [math-expression] na espression matematica valida
        [integer] n numer entier
       *[number] n numer
    }.

variant-length-not-integer = no se pò determiné i varianc unics de { $component }, ajache length no é n numer entier.

variant-sort-not-implemented = i varianc unics de n { $component } con sort no é ćiamò implementés

variant-exclude-combinations-not-implemented = i varianc unics de n { $component } con excludeCombinations no é ćiamò implementés

variant-math-exclude-not-implemented = i varianc unics de n { $component } de sort math con exclude no é ćiamò implementés

variant-non-constant-exclude-not-implemented = i varianc unics de n { $component } con n exclude nia costant no é ćiamò implementés

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: no vën sostenì tl renderisadour prefigure dl grafich; l dessendënt vën saltà.

prefigure-descendant-invalid-geometry = { $subject }: geometria nia finida o nia completa; l dessendënt vën saltà.

prefigure-curve-label-omitted = { $subject }: les etichëtes no vën sostenides sun i elemënc de curva convertis; la etichëta vën lasciada fora.

prefigure-curve-unsupported-definition-type = { $subject }: sort de definizion dla curva '{ $definitionType }' nia sostenida; l dessendënt vën saltà.

prefigure-region-flip-functions-unsupported = { $subject }: atribut flipFunctions nia sostenì sun regionBetweenCurves; l dessendënt vën saltà.

prefigure-region-non-formula-child = { $subject }: demé les funzions fi de sort formula vën sostenides sun regionBetweenCurves; l dessendënt vën saltà.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' nia sostenì per { $labelKind ->
        [line-family] na etichëta dla familia dles linies
       *[point] na etichëta de pont
    }; se dopra l alineamënt predefinì de PreFigure.

prefigure-fill-style-unsupported = { $subject }: l stil de empimënt '{ $fillStyle }' no vën sostenì da PreFigure; se torna a n empimënt plen.

prefigure-line-style-unknown = { $subject }: l stil de linia nia conesciù '{ $lineStyle }' é lascià fora dl output de PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: l stil de marcadour '{ $markerStyle }' é sté mapà sun l stil PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: l stil de marcadour '{ $markerStyle }' no vën sostenì da PreFigure; se dopra l stil predefinì.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` nia valid; no se pò resolver l destinatar. La anotazion vën lasciada fora.

annotation-ref-multiple-targets = `<annotation>`: `ref` é sté resolt te plu destinatars; se dopra l prim.

annotation-ref-outside-graph = `<annotation>`: `ref` nia valid; l destinatar é fora dl grafich che l tën ite. La anotazion vën lasciada fora.

annotation-ref-unsupported-target = `<annotation>`: `ref` nia valid; l destinatar no é n oget grafich sostenì te la conversion prefigure. La anotazion vën lasciada fora.

annotation-text-missing = `<annotation>`: `text` mancia o é vuet; se mana fora test vuet.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] S'à ciatà na dependënza zircolara.
       *[other] S'à ciatà na dependënza zircolara che ciapa ite n componënt `<{ $componentType }>`.
    }

reference-no-referent = Degun referënt ciatà per l referimënt: `{ $reference }`

reference-multiple-referents = Plu referënc ciatés per l referimënt: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format nia valid per l atribut { $attribute } de `<{ $componentType }>`.

children-invalid = Fis nia valics per `<{ $componentType }>`: s'à ciatà fis nia valics: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valour nia valid `{ $value }` per l atribut `{ $attribute }`, se dopra l valour `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Version de DoenetML { $version } nia ciatada.
       *[other] Version de DoenetML { $version } nia ciatada. Se torna a la version { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML nia valid: { $content }

parse-tag-missing-close-tag = DoenetML nia valid: L tag `{ $tag }` no à n tag de stlujuda. Se spetova n tag che se stluj da se instës o n tag `</{ $tagName }>`.

parse-tag-error = DoenetML nia valid: Fal tl tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML nia valid: L semea che al atribut nia valid `{ $attribute }` ti mancie n valour.

parse-attribute-invalid = DoenetML nia valid: Atribut nia valid `{ $attribute }`

parse-attribute-value-invalid = DoenetML nia valid: Valour de atribut nia valid `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML nia valid: Valour de atribut nia valid `{ $value }`. Les virgolëtes no va adum. L semea che te mancie n `{ $quote }`

parse-open-tag-name-missing = DoenetML nia valid: S'à ciatà n tag zenza inuem de tag, p.ej. `<`

parse-tag-not-closed = DoenetML nia valid: L tag `{ $tag }` no é sté stlut (l semea che mancie n `>`).

parse-self-closing-tag-name-missing = DoenetML nia valid: S'à ciatà n tag zenza inuem de tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML nia valid: L tag `{ $tag }` no é sté stlut (l semea che mancie `/>`).

parse-tag-invalid-attributes = DoenetML nia valid: L tag `{ $tag }` no é valid. Al podessa avëi atribuc sbaliés.

parse-close-tag-name-missing = DoenetML nia valid: S'à ciatà n tag de stlujuda zenza inuem de tag, p.ej. `</`

parse-attribute-value-unquoted = I valours di atribuc mëss vester danter virgolëtes: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML nia valid: S'à ciatà l tag de stlujuda `{ $tag }`, ma degun tag de daurida corespondënt

parse-close-tag-mismatched = DoenetML nia valid: Tag de stlujuda che no va adum. Se spetova `</{ $expected }>`. S'à ciatà `{ $found }`

parser-node-unconvertible = No s'à nia podù converti l grop { $node } te n grop Dast.

## Names

name-attribute-invalid =
    Atribut nia valid name='{ $name }'. { $reason ->
        [characters] I inuems pò avëi demé lëtres, numeri, sotlinies o tratins.
       *[start] I inuems mëss scomencé con na lëtra.
    }

component-name-invalid-start = Inuem de componënt nia valid "{ $name }". I inuems mëss scomencé con na lëtra.

## `<answer>` sugar

answer-video-watched-missing-video = Na resposta de sort videoWatched mëss avëi n atribut video

answer-video-watched-video-not-reference = Na resposta de sort videoWatched mëss avëi n atribut video che sie n referimënt

answer-name-not-single-text = L atribut name dla resposta mëss avëi n sol fi de test

## Referencing another document

external-doenetml-recursion-limit = No se pò recuperé l DoenetML de fora per gauja de massa livei de recursion. Éla n referimënt zircolar?

external-doenetml-unavailable = No se pò recuperé l DoenetML da { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML nia valid recuperà da { $attribute }="{ $uri }": al no jiva adum con la sort de componënt "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] L atribut `{ $from }` é sourapassà; dopra `{ $to }` al post.
       *[other] [deprecation] L atribut `{ $from }` sun `<{ $component }>` é sourapassà; dopra `{ $to }` al post.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] L atribut `{ $from }` é sourapassà y vën ignorà ajache l é dat ence `{ $to }`.
       *[other] [deprecation] L atribut `{ $from }` sun `<{ $component }>` é sourapassà y vën ignorà ajache l é dat ence `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] L atribut `{ $attribute }` sun `<{ $component }>` é sourapassà y vën ignorà.

deprecated-attribute-to-child = [deprecation] L atribut `{ $attribute }` sun `<{ $component }>` é sourapassà; dopra al post n fi `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] L valour `{ $value }` dl atribut `{ $attribute }` sun `<{ $component }>` é sourapassà; dopra `{ $to }` al post.


## Language coverage

pluralize-english-only = `<pluralize>` pò meter al plural demé l inglesc, coscì l so test resta coche l é te n document scrit te { $locale }. Scrì la forma plurala dërt, o metela con l atribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = L elemënt `<{ $tag }>` no é n elemënt Doenet conesciù.

schema-element-not-allowed-at-root = L elemënt `<{ $tag }>` no é permetù te la radisc dl document.

schema-element-not-allowed-inside = L elemënt `<{ $tag }>` no é permetù ite te `<{ $parent }>`.

schema-attribute-unrecognized = L elemënt `<{ $tag }>` no à n atribut che se tlama `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] L atribut `{ $attribute }` dl elemënt `<{ $tag }>` mëss vester na lista che vigni elemënt sie un danter: { $allowed }
       *[other] L atribut `{ $attribute }` dl elemënt `<{ $tag }>` mëss vester un danter: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Inuem de variant nia valid per select.  L inuem de variant { $variantName } vën dant te { $numOptions } opzions ma l numer da chirì é { $numToSelect }.

select-variant-name-without-options = L é dat valch variant per select ma deguna opzion per l inuem de variant poscibl: { $variantName }.

select-variant-name-not-possible = L inuem de variant { $variantName } dat per select no é n inuem de variant poscibl.

select-too-few-options = No se pò chirì { $numToSelect } componënc demé fora de { $numOptions }.

select-from-sequence-too-few-values = No se pò chirì { $numToSelect } valours fora de na sequënza de lunghëza { $length }.

select-from-sequence-indices-count-mismatch = L numer di indesc dac per select mëss jì adum col numer da chirì

select-from-sequence-indices-not-integers = Duc i indesc dac per select mëss vester numeri entiers

select-from-sequence-index-excluded = L indesc dat de selectfromsequence fova esclus

select-from-sequence-indices-excluded-combination = I indesc dac de selectfromsequence fova na combinazion esclududa

select-from-sequence-coprime-not-positive-integers = No se pò chirì combinazions coprimes ajache no se chir numeri entiers positifs.

select-from-sequence-coprime-common-factor = No se pò chirì numeri coprims. Duc i valours poscibli à n fator comun. (I valours dac de "from" o "to" mëss vester coprims con "step".)

select-from-sequence-coprime-single-number = No se pò chirì combinazions coprimes fora de n sol numer che no é 1.

select-from-sequence-excluded-too-many-combinations = S'à esclus plu dl 70% dles combinazions te selectFromSequence

select-from-sequence-coprime-none-found = No s'à nia podù chirì numeri coprims. Duc i valours poscibli à n fator comun.

select-from-sequence-too-few-unique-values = No se pò chirì { $numToSelect } valours unics fora de na sequënza de lunghëza { $numPossibleValues }

select-prime-numbers-too-few-values = No se pò chirì { $numToSelect } valours fora de na lista de numeri prims de lunghëza { $numValues }

select-prime-numbers-values-count-mismatch = L numer di valours dac per select mëss jì adum col numer da chirì

select-prime-numbers-values-not-prime = Duc i valours dac per select de numeri prims mëss vester te la lista di numeri prims

select-prime-numbers-values-excluded-combination = I valours dac de selectPrimeNumbers fova na combinazion esclududa

select-prime-numbers-excluded-too-many-combinations = S'à esclus plu dl 70% dles combinazions te selectPrimeNumbers

select-random-combination-fluke = Per n caje straordinarimënter improbabl, no s'à nia podù chirì na combinazion de valours a caje

select-random-value-fluke = Per n caje straordinarimënter improbabl, no s'à nia podù chirì n valour a caje

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] Chest `<{ $component }>` no vën mostrà ajache al é ite te la matematica y al no é `inline`. Njunta `inline`, coscì al devënta na lista a tendina, che va ite te na espression.
        [expanded] Chest `<{ $component }>` no vën mostrà ajache al é ite te la matematica y al é `expanded`. Tò demez `expanded`; na casela sun plu linies no va ite te na espression.
        [on-graph] Chest `<{ $component }>` no vën mostrà ajache al é ite te matematica trata sun n grafich, che no à post per n input.
       *[relative-width] Chest `<{ $component }>` no vën mostrà ajache al é ite te la matematica y al à na largëza relativa. Da la largëza te unitês assolutes, coche `px`, al post.
    }
