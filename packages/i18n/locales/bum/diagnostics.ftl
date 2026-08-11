# Bulu diagnostics: errors and warnings surfaced to the reader or author.
# Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the noun-class table and the vocabulary
# strategy: most of the technical nouns in this file are French loanwords,
# adapted phonologically, following the same school-system logic as the
# chemistry note there. DoenetML element, attribute and value names —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`,
# `symbolicEquality`, `selectFromSequence` and the rest — are part of the
# language rather than prose, and stay in English exactly as written. So
# does the `[deprecation]` marker.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] A ke lôs { $attributes } nge bipwɛ̃ bibaé bi ne fine
       *[other] A ke lôs { $attributes } nge bipwɛ̃ bibaé bi ne fine
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] A ke lôs { $attributes } nge pwɛ̃ éziñ ai pwɛ̃ a ntete bi ne bibaé fine
       *[other] A ke lôs { $attributes } nge pwɛ̃ éziñ ai pwɛ̃ a ntete bi ne bibaé fine
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset a si ke jôm éziñ ki nge pwɛ̃ a ntete te

## `<line>`

line-points-undetermined-dimensions = Liñ é ke ke a bipwɛ̃ bi ne dimansiɔ̃ é si yiane ki.

line-points-too-few-dimensions = Liñ a yiane ke a bipwɛ̃ bi ne dimansiɔ̃ bibaé nge abui.

line-points-depend-on-variables = Liñ é ke ke a bipwɛ̃ bi ke tegbane a variabl: { $variables }.

line-equation-invalid-format = Fɔrma é si mvaé ki a ekwasiɔ̃ a liñ a variabl { $variable1 } ai { $variable2 }.

## `<ray>`

ray-overprescribed-through = Rayɔ̃ a bo ndimba na through, endpoint, ai direction. A ke lôs through é'a yiane.

ray-dimension-mismatch = numDimensions é si tegbane ki a rayɔ̃.

## `<vector>`

vector-overprescribed-head = Vektɛr a bo ndimba na head, tail, ai displacement. A ke lôs head é'a yiane.

vector-dimension-mismatch = numDimensions é si tegbane ki a vektɛr.

## Attracting and constraining

attract-to-without-nearest-point = Te ngul wa yeban a `<{ $component }>` amu a si ne mbamba nearestPoint ki.

constrain-to-without-nearest-point = Te ngul wa kabane a `<{ $component }>` amu a si ne mbamba nearestPoint ki.

constrain-to-interior-without-nearest-point = Te ngul wa kabane aluñ a `<{ $component }>` amu a si ne mbamba nearestPoint ki.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition a ke lôs a choiceInput é si ne inline ki

## Ordering children by index

choice-input-indices-count-mismatch = A ke lôs bimbalan bi'a yiane a choiceInput amu abui a bimbalan é si tegbane ki ai abui a bon.

pretzel-indices-count-mismatch = A ke lôs bimbalan bi'a yiane a problem amu abui a bimbalan é si tegbane ki ai abui a bon a problem.

shuffle-indices-count-mismatch = A ke lôs bimbalan bi'a yiane a shuffle amu abui a bimbalan é si tegbane ki ai abui a bikɔ̃posan.

indices-ignored-out-of-range = A ke lôs bimbalan bi'a yiane a { $component } amu bivok bi ne étam a mekɛñ.

pretzel-indices-repeated = A ke lôs bimbalan bi'a yiane a pretzel amu bivok bi lelɛbane.

pretzel-circuit-first-index = A ke lôs bimbalan bi'a yiane a pretzel a mode circuit amu mbalan a ntete a yiane ke 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Asu na `<{ $component }>` é bo mfefe ai bon bi ne string, mbamba `type` a yiane ke fine.

invalid-type-defaulting-to-math = Ntôtôlô { $type } é si mvaé ki a { $component }. A yiane ke éziñ a math, text, number, nge boolean. A ke ke math avale a tebe.

string-not-valid-component-to-arrange = String "{ $value }" é si ne kɔ̃posan é mvaé ki asu na { $component }. A ke lôs.

## Types and variables

invalid-type-defaulting-to-number = Ntôtôlô { $type } é si mvaé ki, a ke ke ntôtôlô avale number.

invalid-variable-value = Mbamba a variabl é si mvaé ki: `{ $value }`

## Variants

variant-index-must-be-number = Mbalan a ntôtôlô { $index } a yiane ke mbalan

variant-index-must-be-integer = Mbalan a ntôtôlô { $index } a yiane ke mbalan mvus

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` é si tebe ki asu bipimu bi ne fine mvus. A ke ke bwidi avale relatif.

side-by-side-absolute-margins = `<{ $component }>` é si tebe ki asu bipimu bi ne fine mvus. A ke ke marj avale relatif.

side-by-side-no-block-child = `<{ $component }>` é si mvaé ki: a yiane ke ai mon éziñ w'ébwaé nge abui.

## `<label>`

label-for-ignored-on-graphical = Mbamba `for` a `<label>` é ne graphik a ke lôs.

label-for-must-resolve-to-one = Mbamba `for` a `<label>` a yiane lañ a kɔ̃posan éziñ éziñ.

label-for-unresolved = Mbamba `for` a `<label>` é si ngul lañ ki a kɔ̃posan éziñ.

label-for-answer-with-authored-inputs = Mbamba `for` a `<label>` a lañ a `<answer>` é ne input bi lelabane; lañ input mfe.

label-for-answer-without-input = Mbamba `for` a `<label>` a lañ a `<answer>` é si ne input ki asu na o jôé.

label-for-must-reference-input-or-answer = Mbamba `for` a `<label>` a yiane lañ a input nge a nkobo.

## Accessibility

accessibility-short-description-or-decorative = Asu akusa, `<{ $component }>` a yiane ke ai ndimba é kekele nge a ke fine avale décoratif.

accessibility-video-short-description = Asu akusa, `<video>` a yiane ke ai ndimba é kekele.

accessibility-input-short-description-or-label = Asu akusa, `<{ $component }>` a yiane ke ai ndimba é kekele nge jôé.

accessibility-answer-input-short-description-or-label = Asu akusa, `<answer>` é tôbô input a yiane ke ai ndimba é kekele nge jôé.

accessibility-short-description-contains-math = Bindimba bi kekele bi si yiane ke bikɔ̃posan bia math ki avale `<{ $component }>`. Kobo math ai bikobo.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } é si ne kɔ̃tras é yiane ki asu jôé a sɛksiɔ̃ (mode a wôlan) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a yiane ke nge abui { $threshold }:1).
       *[other] { $colorName } é si ne kɔ̃tras é yiane ki asu jôé a sɛksiɔ̃ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a yiane ke nge abui { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = A si tebe ki `<circle>` a bipwɛ̃ { $count } nge bipwɛ̃ bi si ne mbalan ki.

circle-too-many-through-points = Te ngul wa balan sɛrkl a bipwɛ̃ bi lôbô 3.

circle-overprescribed-radius-center-points = Te ngul wa balan sɛrkl a rayɔ̃, ntete, ai bipwɛ̃ bi'a yiane.

circle-center-with-multiple-points = Te ngul wa balan sɛrkl a ntete é ke a pwɛ̃ é lôbô 1.

circle-radius-too-small = Te ngul wa balan sɛrkl: nge nkañ a vôm bipwɛ̃ bibaé é ne { $distance }, rayɔ̃ { $radius } é'a yiane é ne kekele fe.

circle-radius-with-many-points = Te ngul wa tôbô sɛrkl a bipwɛ̃ bi lôbô bibaé ai rayɔ̃ é'a yiane.

circle-invalid-center-or-through-points = Ntete nge bipwɛ̃ a sɛrkl bi si mvaé ki.

circle-radius-center-with-multiple-points = Te ngul wa balan rayɔ̃ a sɛrkl a ntete é ke a pwɛ̃ é lôbô 1.

circle-change-radius-non-numerical = Te ngul wa kelege rayɔ̃ a sɛrkl a bipwɛ̃ bi si ne mbalan ki

circle-radius-with-points-non-numerical = Te ngul wa tôbô sɛrkl a bipwɛ̃ bi lôbô éziñ ai rayɔ̃ é'a yiane nge bi si ne mbalan ki.

circle-change-center-non-numerical = A si tebe ki o kelege ntete a sɛrkl a bipwɛ̃ bi si ne mbalan ki.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Dimansiɔ̃ é si yiane ki asu domɛn a fonksiɔ̃. Domɛn é ne mintɛrval { $intervals } nga fonksiɔ̃ é ne { $inputs ->
            [one] input { $inputs }
           *[other] input { $inputs }
        }.
       *[other] Dimansiɔ̃ é si yiane ki asu domɛn a fonksiɔ̃. Domɛn é ne mintɛrval { $intervals } nga fonksiɔ̃ é ne { $inputs ->
            [one] input { $inputs }
           *[other] input { $inputs }
        }.
    }

function-domain-invalid-format = Fɔrma é si mvaé ki asu domɛn a fonksiɔ̃.

function-ignoring-non-numerical =
    { $type ->
        [maximum] A ke lôs maksimɔm é si ne mbalan ki a fonksiɔ̃.
        [minimum] A ke lôs minimɔm é si ne mbalan ki a fonksiɔ̃.
        [extremum] A ke lôs jôm w'étam é si ne mbalan ki a fonksiɔ̃.
        [point] A ke lôs pwɛ̃ é si ne mbalan ki a fonksiɔ̃.
        [slope] A ke lôs kelege é si ne mbalan ki a fonksiɔ̃.
       *[other] A ke lôs { $type } é si ne mbalan ki a fonksiɔ̃.
    }

function-ignoring-empty =
    { $type ->
        [maximum] A ke lôs maksimɔm é ne jôm éziñ a fonksiɔ̃.
        [minimum] A ke lôs minimɔm é ne jôm éziñ a fonksiɔ̃.
        [extremum] A ke lôs jôm w'étam é ne jôm éziñ a fonksiɔ̃.
        [point] A ke lôs pwɛ̃ é ne jôm éziñ a fonksiɔ̃.
       *[other] A ke lôs { $type } é ne jôm éziñ a fonksiɔ̃.
    }

function-points-too-close = Fonksiɔ̃ é ne bipwɛ̃ bibaé bi ne fine nkoañ fe. Te ngul wa timba fonksiɔ̃.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Fonksiɔ̃ é ngul wa lelabane fefe nge abui a input é tegbane ai abui a output. Fonksiɔ̃ nyi é ne input { $inputs } ai { $outputs ->
            [one] output { $outputs }
           *[other] output { $outputs }
        }.
       *[other] Fonksiɔ̃ é ngul wa lelabane fefe nge abui a input é tegbane ai abui a output. Fonksiɔ̃ nyi é ne input { $inputs } ai { $outputs ->
            [one] output { $outputs }
           *[other] output { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Bulɛ a sekans é si mvaé ki. A yiane ke mbalan mvus é si ke asi 0 ki.

sequence-invalid-step = Étep a sekans é si mvaé ki. A yiane ke mbalan asu sekans a ntôtôlô { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" a sekans a mbalan é si mvaé ki. A yiane ke mbalan.

sequence-invalid-endpoint-letters = "{ $attribute }" a sekans a lɛtr é si mvaé ki. A yiane ke ndamba a lɛtr.

sequence-invalid-endpoint = "{ $attribute }" a sekans é si mvaé ki.

select-from-sequence-coprime-not-numbers = coprime a ke lôs amu bimbalan bi si kabane ki

select-from-sequence-coprime-with-exclude-combinations = coprime a ke lôs amu excludeCombinations é'a yiane

## Resolving a `target`

target-not-found = Target é si mvaé ki asu `<{ $source }>`: te ngul wa yene target.

target-state-variable-not-found = Target é si mvaé ki asu `<{ $source }>`: te ngul wa yene mbamba é jôé "{ $property }" a `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Bivariabl bia `<odeSystem>` bi yiane bo mbwoé ai variabl é si tegbane ki.

ode-system-duplicate-variable-names = Te ngul wa timba fonksiɔ̃ ODE RHS ai bijôé bia variabl bi lelabane.

ode-system-rhs-function-error = Te ngul wa timba fonksiɔ̃ ODE RHS. Abé a timba fonksiɔ̃ a mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Te ngul wa timba angl a vôm liñ { $count }

angle-invalid-through-point = Pwɛ̃ é si mvaé ki a through a `<angle>`

parabola-vertex-too-many-points = A si tebe ki parabol é ne pwɛ̃ w'étam a pwɛ̃ é lôbô 1.

parabola-too-many-points = A si tebe ki parabol a bipwɛ̃ bi lôbô 3.

intersection-too-many-items = A si tebe ki intɛrsɛksiɔ̃ asu bijôm bi lôbô bibaé

## Other math components

ionic-compound-not-two-ions = A si tebe ki nkobo w'ayɔ̃ nge é si ne ayɔ̃ bibaé ki.

ionic-compound-needs-cation-and-anion = Nkobo w'ayɔ̃ é tebe fo asu katiɔ̃ éziñ ai aniɔ̃ éziñ.

solve-equations-cannot-evaluate = Te ngul wa timba ekwasiɔ̃ amu a si ngul wa balan ki: { $equation }

math-operators-operand-number-required = A yiane ke operandNumber nge o ke lôs operand a mbalan.

eigen-decomposition-failed = Te ngul wa balan bimbalan eigen a matris

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: paramɛtr { $parameters } é si ne a mfefe ki, e mfe a ke tegbane ai jôm éziñ te éziñ.
       *[other] `<matchesPattern>`: baramɛtr { $parameters } bi si ne a mfefe ki, e mfe bi ke tegbane ai jôm éziñ te éziñ.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: te ngul wa vaan grid="{ $grid }". A yiane ke none, medium, dense, nge bimbalan bibaé bi lôbô 0 bi ne fine étam a mbua, avale grid="1 0.5". Grid éziñ te é si timbane ki.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" é si tebe ki a ntolan a prefigure; a ke bo avale right.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" é si tebe ki a ntolan a prefigure; a ke bo avale top.

prefigure-invalid-axis-bounds = `<graph>`: bindamba bia aks bi si mvaé ki asu kelege a prefigure; a ke bo bbox a tebe (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: bwidi é si mvaé ki asu kelege a prefigure; a ke bo bwidi a tebe 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio é si mvaé ki asu kelege a prefigure; a ke bo ratio a tebe 1.

prefigure-grid-spacing-too-fine = `<graph>`: nkoañ a grid é ne kekele fe asu bindamba bia aks; grid é si timbane ki a ntolan a prefigure.

prefigure-annotations-not-rendered = `<graph>`: bilangilila bi si timbane ki nge é si ne ntolan a PreFigure ki.

multiple-annotations-children = Bon bi `<annotations>` bibui bi yiane a `<graph>`; bese ve wu w'apre bi ke lôs.

## Referring to other components

copy-unrecognized-component-type = Te ngul wa lôbô nge kɔpi ntôtôlô a kɔ̃posan é si yeban ki: { $type }.

copy-prop-not-found = Te ngul wa yene mbamba { $property } a kɔ̃posan a ntôtôlô a { $component }

collect-no-source = Nsɔrs éziñ te asu collect.

collect-invalid-component-type = Te ngul wa lôklôge bikɔ̃posan bia ntôtôlô `<{ $component }>` amu a ne ntôtôlô a kɔ̃posan é si mvaé ki.

reference-index-unavailable = Te ngul wa lañ mbalan `{ $reference }`

## `<callAction>`

component-action-unavailable = Te ngul wa lôm { $action } a kɔ̃posan `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Data é si mvaé ki. Ndamba bi si tegbane ki a bulɛ. A yiane a componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data é ne bijôé bia kolonu bi lelabane. A yiane a componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data é si ne jôé a kolonu ki. A yiane a componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Award a nkobo nyi é tegbane a nkobo w'a answer mfe é lômane, ai jôm nyi é ngul tôbô mvis é si yenban ki.

answer-max-num-attempts-in-section-wide-check-work = A tôbô `maxNumAttempts` a `<answer>` é ne aluñ a kɔ̃posan é ne `sectionWideCheckWork` a si ke jôm éziñ ki, amu abui a mekeñ é kabo ai kɔ̃posan. Tôbô `maxNumAttempts` a kɔ̃posan mfe.

nested-section-wide-check-work-max-num-attempts = A tôbô `maxNumAttempts` a kɔ̃posan é ne `sectionWideCheckWork` é ne aluñ a kɔ̃posan éziñ mfe é ne `sectionWideCheckWork` a si ke jôm éziñ ki, amu abui a mekeñ é kabo ai kɔ̃posan w'étam. Tôbô `maxNumAttempts` a kɔ̃posan w'étam.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Mbamba { $attributes } a si ke jôm éziñ ki nge symbolicEquality é si fine ki.
       *[other] Mimbamba { $attributes } mi si ke jôm éziñ ki nge symbolicEquality é si fine ki.
    }

answer-invalid-type = Ntôtôlô a nkobo é si mvaé ki: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Amu kɔ̃posan `<{ $component }>` é si ne jôé ki, te ngul wa lôm nyi avale mbamba a module

module-attribute-name-already-defined = Kɔ̃posan `<{ $component } name="{ $name }">` te ngul wa lôm nyi avale mbamba a module amu ntôtôlô a kɔ̃posan `<module>` é ne fine mbamba "{ $name }".

conditional-content-condition-ignored = Mbamba `condition` a ke lôs a `<conditionalContent>` é ne bon bia case nge else.

slider-markers-type-mismatch = Ntôtôlô a bikpe é si tegbane ki ai ntôtôlô a slider.

pretzel-problem-needs-statement-and-answer = Pretzel é si mvaé ki: `<problem>` a bese a yiane ke `<statement>` éziñ ai `<answer>` éziñ.

pretzel-circuit-first-problem-distractor = Pretzel é si mvaé ki: a mode="circuit", `<problem>` a ntete a si ngul ke distraktɛr ki.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Mbamba { $values } é si mvaé ki asu mbamba `{ $attribute }`; a ke lôs.
       *[other] Mimbamba { $values } mi si mvaé ki asu mbamba `{ $attribute }`; a ke lôs.
    }

attribute-must-be-references = Mbamba `{ $value }` é si mvaé ki asu mbamba `{ $attribute }`. Mbamba a yiane ke bilangilila bi tebe a `$`.

math-input-invalid-function-names = <mathInput>: a ke lôs bijôé bia fonksiɔ̃ bi si mvaé ki a { $attribute }: { $names }. Ékotogo a nônga a jôé éziñ éziñ a yiane ke lɛtr nge tirɛ bibaé nge abui; `|<mathspeak alternative>` a ngul lañ.

## Building components from the source

component-type-invalid = Ntôtôlô a kɔ̃posan é si mvaé ki: `<{ $componentType }>`

attribute-repeated = Te ngul wa lelabane mbamba { $attribute }.

attribute-invalid-for-component = Mbamba "{ $attribute }" é si mvaé ki asu kɔ̃posan a ntôtôlô `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Ndimba a stayl { $styleNumber } é si ne kɔ̃tras é yiane ki asu { $context ->
        [text-on-background] kalɛr a tɛkst vôm kalɛr a fɔ̃
        [high-contrast] kalɛr a kɔ̃tras é lôbô vôm kanvas
        [line] kalɛr a liñ vôm kanvas
        [marker] kalɛr a mark vôm kanvas
       *[text-on-canvas] kalɛr a tɛkst vôm kanvas
    }{ $mode ->
        [dark] { " (mode a wôlan)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a yiane ke nge abui { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Nge ndimba a stayl { $styleNumber } é ne bikalɛr bi ne kɔ̃tras é yiane asu mode a étam, bikalɛr bia mode a wôlan bi tebane a mimbamba mi si ne kɔ̃tras é yiane ki asu kalɛr a tɛkst vôm kalɛr a fɔ̃ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a yiane ke nge abui { $threshold }:1). { $suggestion ->
        [available] Asu na kɔ̃tras é yiane a mode a wôlan, tôbô kɔ̃tras a mode a étam (avale egzanp, fine { $lightAttribute }="{ $lightColor }") nge kelege kalɛr a mode a wôlan (avale egzanp, fine { $darkAttribute }="{ $darkColor }").
       *[none] Asu na kɔ̃tras é yiane a mode a wôlan, tôbô kɔ̃tras a mode a étam nge kelege bikalɛr bi tebane ai textColorDarkMode nge/ai backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Nge ndimba a stayl { $styleNumber } é ne kalɛr a tɛkst é ne kɔ̃tras é yiane asu mode a étam, kalɛr a tɛkst a mode a wôlan é tebane a mbamba nyi é si ne kɔ̃tras é yiane ki vôm kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a yiane ke nge abui { $threshold }:1). { $suggestion ->
        [available] Asu na kɔ̃tras é yiane a mode a wôlan, tôbô kɔ̃tras a mode a étam (avale egzanp, fine textColor="{ $lightColor }") nge kelege kalɛr a mode a wôlan (avale egzanp, fine textColorDarkMode="{ $darkColor }").
       *[none] Asu na kɔ̃tras é yiane a mode a wôlan, tôbô kɔ̃tras a mode a étam nge kelege kalɛr é tebane ai textColorDarkMode.
    }

section-multiple-style-palettes = Sɛksiɔ̃ é ngul kabe fo <stylePalette> éziñ; a ke bo wu w'apre.

## Unique variants

variant-num-to-select-not-non-negative-integer = te ngul wa yem ntôtôlô mi ne éziñ mia { $component } amu numToSelect é si ne mbalan mvus é si ke asi 0 ki ki.

variant-num-to-select-not-constant-number = te ngul wa yem ntôtôlô mi ne éziñ mia { $component } amu numToSelect é si ne mbalan é si kelege ki ki.

variant-with-replacement-not-constant-boolean = te ngul wa yem ntôtôlô mi ne éziñ mia { $component } amu withReplacement é si ne boolean é si kelege ki ki.

variant-select-weight-disables-unique = Ntôtôlô mi ne éziñ asu select mi si ke fine ki nge éziñ a bikabe é ne selectWeight nge selectForVariants é'a yiane

variant-coprime-undetermined = te ngul wa yem ntôtôlô mi ne éziñ mia { $component } amu te ngul wa yem ki nge coprime é ne abé ntyi.

variant-attribute-not-constant = te ngul wa yem ntôtôlô mi ne éziñ mia { $component } amu { $attribute } é si ke kelege ki.

variant-attribute-not-number = te ngul wa yem ntôtôlô mi ne éziñ mia { $component } amu { $attribute } é si ne mbalan ki.

variant-attribute-wrong-type-for-sequence =
    te ngul wa yem ntôtôlô mi ne éziñ mia { $component } a ntôtôlô { $type } amu { $attribute } é si ke { $expected ->
        [letters-combination] ndamba a lɛtr
        [math-expression] nônga a math é fine
        [integer] mbalan mvus
       *[number] mbalan
    } ki.

variant-length-not-integer = te ngul wa yem ntôtôlô mi ne éziñ mia { $component } amu bulɛ é si ne mbalan mvus ki.

variant-sort-not-implemented = a si tebe ki ntôtôlô mi ne éziñ mia { $component } é ne sort

variant-exclude-combinations-not-implemented = a si tebe ki ntôtôlô mi ne éziñ mia { $component } é ne excludeCombinations

variant-math-exclude-not-implemented = a si tebe ki ntôtôlô mi ne éziñ mia { $component } a ntôtôlô math é ne exclude

variant-non-constant-exclude-not-implemented = a si tebe ki ntôtôlô mi ne éziñ mia { $component } é ne exclude é si kelege ki

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: é si tebe ki a ntolan a graph prefigure; mon é ke lôs.

prefigure-descendant-invalid-geometry = { $subject }: jeometri é si fulu ki nge é si mvus ki; mon é ke lôs.

prefigure-curve-label-omitted = { $subject }: bijôé bi si tebe ki a bikɔ̃posan bia kurb bi'a kelabane; jôé é ke lôs.

prefigure-curve-unsupported-definition-type = { $subject }: ntôtôlô a ndimba a fonksiɔ̃ a kurb '{ $definitionType }' é si tebe ki; mon é ke lôs.

prefigure-region-flip-functions-unsupported = { $subject }: mbamba flipFunctions a regionBetweenCurves é si tebe ki; mon é ke lôs.

prefigure-region-non-formula-child = { $subject }: fefe fonksiɔ̃ mia bon bia ntôtôlô formula bi'a tebe a regionBetweenCurves; mon é ke lôs.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' é si tebe ki asu { $labelKind ->
        [line-family] jôé a bibuma bia liñ
       *[point] jôé a pwɛ̃
    }; a ke bo kelege a tebe a PreFigure.

prefigure-fill-style-unsupported = { $subject }: stayl a lôné '{ $fillStyle }' é si tebe ki ai PreFigure; a ke bwélé a stayl é lôné mvus.

prefigure-line-style-unknown = { $subject }: stayl a liñ é si yeban ki '{ $lineStyle }' é ke lôs a jôm é tebane a PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: stayl a mark '{ $markerStyle }' a kelabane a stayl a PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: stayl a mark '{ $markerStyle }' é si tebe ki ai PreFigure; a ke bo stayl a tebe.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` é si mvaé ki; te ngul wa yene target. Ndimba é ke lôs.

annotation-ref-multiple-targets = `<annotation>`: `ref` é'a yiane a bitarget bibui; a ke bo w'a ntete.

annotation-ref-outside-graph = `<annotation>`: `ref` é si mvaé ki; target é ne étam a graph é lôbô nyi. Ndimba é ke lôs.

annotation-ref-unsupported-target = `<annotation>`: `ref` é si mvaé ki; target é si ne jôm é graphik é tebe a kelege a prefigure ki. Ndimba é ke lôs.

annotation-text-missing = `<annotation>`: `text` é si fine ki nge é si ne jôm éziñ ki; a ke lôm tɛkst é si ne jôm éziñ ki.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Tegbane é sirkilɛr é'a yiane.
       *[other] Tegbane é sirkilɛr é'a yiane é lôbô kɔ̃posan `<{ $componentType }>`.
    }

reference-no-referent = Jôm éziñ te é'a yiane asu langilila: `{ $reference }`

reference-multiple-referents = Bijôm bibui bi'a yiane asu langilila: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Fɔrma é si mvaé ki asu mbamba { $attribute } a `<{ $componentType }>`.

children-invalid = Bon bi si mvaé ki asu `<{ $componentType }>`: Bon bi si mvaé ki bi'a yiane: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Mbamba `{ $value }` é si mvaé ki asu mbamba `{ $attribute }`, a ke bo mbamba `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Vɛrsiɔ̃ a DoenetML { $version } é si yeban ki.
       *[other] Vɛrsiɔ̃ a DoenetML { $version } é si yeban ki. A ke bwélé a vɛrsiɔ̃ { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML é si mvaé ki: { $content }

parse-tag-missing-close-tag = DoenetML é si mvaé ki: Tag `{ $tag }` é si ne tag a kale ki. Kalabane tag é kale mfe nge tag `</{ $tagName }>`.

parse-tag-error = DoenetML é si mvaé ki: Abé a tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML é si mvaé ki: Mbamba é si mvaé ki `{ $attribute }` é si ne mbamba ki.

parse-attribute-invalid = DoenetML é si mvaé ki: Mbamba é si mvaé ki `{ $attribute }`

parse-attribute-value-invalid = DoenetML é si mvaé ki: Mbamba a mbamba é si mvaé ki `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML é si mvaé ki: Mbamba a mbamba é si mvaé ki `{ $value }`. Bikpe bia kobo bi si tegbane ki. A yiane ke `{ $quote }`

parse-open-tag-name-missing = DoenetML é si mvaé ki: Tag é si ne jôé ki é'a yiane, avale egzanp `<`

parse-tag-not-closed = DoenetML é si mvaé ki: Tag `{ $tag }` é si kale ki (`>` é si fine ki).

parse-self-closing-tag-name-missing = DoenetML é si mvaé ki: Tag é si ne jôé ki é'a yiane `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML é si mvaé ki: Tag `{ $tag }` é si kale ki (`/>` é si fine ki).

parse-tag-invalid-attributes = DoenetML é si mvaé ki: Tag `{ $tag }` é si mvaé ki. A ngul ke mimbamba mi si mvaé ki.

parse-close-tag-name-missing = DoenetML é si mvaé ki: Tag a kale é si ne jôé ki é'a yiane, avale egzanp `</`

parse-attribute-value-unquoted = Mimbamba mia mimbamba mi yiane ke a bikpe bia kobo: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML é si mvaé ki: Tag a kale `{ $tag }` é'a yiane, nga tag a kuli é tegbane te

parse-close-tag-mismatched = DoenetML é si mvaé ki: Tag a kale é si tegbane ki. Kalabane `</{ $expected }>`. A yiane `{ $found }`

parser-node-unconvertible = Te ngul wa kelege nod { $node } avale nod a Dast.

## Names

name-attribute-invalid =
    Jôé a mbamba é si mvaé ki name='{ $name }'. { $reason ->
        [characters] Bijôé bi ngul ke fefe lɛtr, mbalan, tirɛ a asi nge tirɛ.
       *[start] Bijôé bi yiane tebe ai lɛtr.
    }

component-name-invalid-start = Jôé a kɔ̃posan é si mvaé ki "{ $name }". Bijôé bi yiane tebe ai lɛtr.

## `<answer>` sugar

answer-video-watched-missing-video = Nkobo a ntôtôlô videoWatched a yiane ke mbamba a video

answer-video-watched-video-not-reference = Nkobo a ntôtôlô videoWatched a yiane ke mbamba a video é ne langilila

answer-name-not-single-text = Mbamba jôé a nkobo a yiane ke mon éziñ éziñ w'ébwaé

## Referencing another document

external-doenetml-recursion-limit = Te ngul wa lôm DoenetML é ne étam amu abui a nkoañ é lelabane é lôbô. É ne langilila é sirkilɛr?

external-doenetml-unavailable = Te ngul wa lôm DoenetML é fufulane a { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML é lômane a { $attribute }="{ $uri }" é si mvaé ki: é si tegbane ki ai ntôtôlô a kɔ̃posan "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Mbamba `{ $from }` é si bo mfefe ki fe; bo `{ $to }` a fulu jôm éziñ.
       *[other] [deprecation] Mbamba `{ $from }` a `<{ $component }>` é si bo mfefe ki fe; bo `{ $to }` a fulu jôm éziñ.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Mbamba `{ $from }` é si bo mfefe ki fe ai a ke lôs amu `{ $to }` é'a yiane fe.
       *[other] [deprecation] Mbamba `{ $from }` a `<{ $component }>` é si bo mfefe ki fe ai a ke lôs amu `{ $to }` é'a yiane fe.
    }

deprecated-attribute-ignored = [deprecation] Mbamba `{ $attribute }` a `<{ $component }>` é si bo mfefe ki fe ai a ke lôs.

deprecated-attribute-to-child = [deprecation] Mbamba `{ $attribute }` a `<{ $component }>` é si bo mfefe ki fe; bo mon w'`<{ $child }>` a fulu jôm éziñ.

deprecated-attribute-value-renamed = [deprecation] Mbamba `{ $value }` a mbamba `{ $attribute }` a `<{ $component }>` é si bo mfefe ki fe; bo `{ $to }` a fulu jôm éziñ.


## Language coverage

pluralize-english-only = `<pluralize>` é ngul lelabane fefe Angle, e mfe tɛkst wu é ke tegbane a kalate é ne { $locale }. Kobo mvegan mfe, nge fine ai mbamba `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Élémant `<{ $tag }>` é si ne élémant a Doenet é yeban ki.

schema-element-not-allowed-at-root = Élémant `<{ $tag }>` é si fine ki a étam a kalate.

schema-element-not-allowed-inside = Élémant `<{ $tag }>` é si fine ki aluñ a `<{ $parent }>`.

schema-attribute-unrecognized = Élémant `<{ $tag }>` é si ne mbamba é jôé `{ $attribute }` ki.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Mbamba `{ $attribute }` a élémant `<{ $tag }>` a yiane ke lis é ne bijôm bise éziñ pali: { $allowed }
       *[other] Mbamba `{ $attribute }` a élémant `<{ $tag }>` a yiane ke éziñ pali: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Jôé a ntôtôlô é si mvaé ki asu select. Jôé a ntôtôlô { $variantName } é'a yiane a bikabe { $numOptions } nga abui a kabe é ne { $numToSelect }.

select-variant-name-without-options = Bintôtôlô bi'a yiane asu select nga bikabe éziñ te bi'a yiane asu jôé a ntôtôlô é ngul ke: { $variantName }.

select-variant-name-not-possible = Jôé a ntôtôlô { $variantName } é'a yiane asu select é si ne jôé a ntôtôlô é ngul ke ki.

select-too-few-options = Te ngul wa kabe bikɔ̃posan { $numToSelect } a { $numOptions } fefe.

select-from-sequence-too-few-values = Te ngul wa kabe bimbalan { $numToSelect } a sekans a bulɛ { $length }.

select-from-sequence-indices-count-mismatch = Abui a bimbalan bi'a yiane asu select a yiane tegbane ai abui a kabe

select-from-sequence-indices-not-integers = Bimbalan bise bi'a yiane asu select bi yiane ke mbalan mvus

select-from-sequence-index-excluded = Mbalan é'a yiane a selectfromsequence é lôsane

select-from-sequence-indices-excluded-combination = Bimbalan bi'a yiane bia selectfromsequence bi ne ndamba é lôsane

select-from-sequence-coprime-not-positive-integers = Te ngul wa kabe ndamba a coprime amu mbalan mvus é lôbô 0 é si kabane ki.

select-from-sequence-coprime-common-factor = Te ngul wa kabe bimbalan bia coprime. Bimbalan bise bi ngul ke bi ne jôm éziñ é tôtôlane. (Mimbamba mi'a yiane mia "from" nge "to" mi yiane ke coprime ai "step".)

select-from-sequence-coprime-single-number = Te ngul wa kabe ndamba a coprime a mbalan éziñ é si ne 1 ki.

select-from-sequence-excluded-too-many-combinations = A lôsane nge abui a 70% a bindamba a selectFromSequence

select-from-sequence-coprime-none-found = Te ngul wa kabe bimbalan bia coprime. Bimbalan bise bi ngul ke bi ne jôm éziñ é tôtôlane.

select-from-sequence-too-few-unique-values = Te ngul wa kabe bimbalan mi ne éziñ { $numToSelect } a sekans a bulɛ { $numPossibleValues }

select-prime-numbers-too-few-values = Te ngul wa kabe bimbalan { $numToSelect } a lis a mbalan mia prime a bulɛ { $numValues }

select-prime-numbers-values-count-mismatch = Abui a bimbalan bi'a yiane asu select a yiane tegbane ai abui a kabe

select-prime-numbers-values-not-prime = Bimbalan bise bi'a yiane asu select prime number bi yiane ke a lis a mbalan mia prime

select-prime-numbers-values-excluded-combination = Bimbalan bi'a yiane bia selectPrimeNumbers bi ne ndamba é lôsane

select-prime-numbers-excluded-too-many-combinations = A lôsane nge abui a 70% a bindamba a selectPrimeNumbers

select-random-combination-fluke = Asu jôm é si yenban fe ki, te ngul wa kabe ndamba a bimbalan mi si kabane ki

select-random-value-fluke = Asu jôm é si yenban fe ki, te ngul wa kabe mbalan é si kabane ki
