# Ewondo diagnostics: errors and warnings surfaced to the reader or author.
# Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element, attribute and value names — `through`, `endpoint`,
# `midpointOffset`, `numDimensions`, `symbolicEquality`, `selectFromSequence`
# and the rest — are part of the language rather than prose, and stay in
# English exactly as written. So does the `[deprecation]` marker.
#
# See `content.ftl`'s header for the loanword register this catalog's prose
# leans on for technical vocabulary («attribute», «component», «variant»),
# and for the `Intl.PluralRules("ewo")` categories, `one` and `other`.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } a lɛpban nge bipwɛ̃ bibaŋ bi mfeg bi tɛlɛban
       *[other] { $attributes } wa lɛpban nge bipwɛ̃ bibaŋ bi mfeg bi tɛlɛban
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } a lɛpban nge pwɛ̃ a mfeg a pwɛ̃ a metí bi tɛlɛban mbaŋ
       *[other] { $attributes } wa lɛpban nge pwɛ̃ a mfeg a pwɛ̃ a metí bi tɛlɛban mbaŋ
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset a si bɔ éziŋ hala pwɛ̃ a metí a si éziŋ te

## `<line>`

line-points-undetermined-dimensions = Liɲi a ke wu bipwɛ̃ bi numDimensions bi si yem te.

line-points-too-few-dimensions = Liɲi a yiane wu bipwɛ̃ bi numDimensions bebaŋ nge bɛbɛ.

line-points-depend-on-variables = Liɲi a ke wu bipwɛ̃ bi ne dama ba variables : { $variables }.

line-equation-invalid-format = Nfasô a si mvɛ̃ te asu equation ya liɲi a variables { $variable1 } a { $variable2 }.

## `<ray>`

ray-overprescribed-through = Rayɔŋ a tɛlɛban a through, endpoint, a direction. A lɛp through a tɛlɛban.

ray-dimension-mismatch = numDimensions a si lɔŋgi te dama rayɔŋ.

## `<vector>`

vector-overprescribed-head = Vɛktɛr a tɛlɛban a head, tail, a displacement. A lɛp head a tɛlɛban.

vector-dimension-mismatch = numDimensions a si lɔŋgi te dama vɛktɛr.

## Attracting and constraining

attract-to-without-nearest-point = A si bɔ éziŋ na o bulane `<{ $component }>` amu a bí state variable nearestPoint te.

constrain-to-without-nearest-point = A si bɔ éziŋ na o kɔŋ ba `<{ $component }>` amu a bí state variable nearestPoint te.

constrain-to-interior-without-nearest-point = A si bɔ éziŋ na o kɔŋ dama ndoŋ a `<{ $component }>` amu a bí state variable nearestPoint te.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition a lɛpban dama choiceInput a si inline te.

## Ordering children by index

choice-input-indices-count-mismatch = A lɛp indices ma tɛlɛban asu choiceInput amu ntíli ma indices a si lɔŋgi te a ntíli ma bon ba choice.

pretzel-indices-count-mismatch = A lɛp indices ma tɛlɛban asu problem amu ntíli ma indices a si lɔŋgi te a ntíli ma bon ba problem.

shuffle-indices-count-mismatch = A lɛp indices ma tɛlɛban asu shuffle amu ntíli ma indices a si lɔŋgi te a ntíli ma bon ba elát.

indices-ignored-out-of-range = A lɛp indices ma tɛlɛban asu { $component } amu indices bevok bi ne éziŋ dama mbog.

pretzel-indices-repeated = A lɛp indices ma tɛlɛban asu pretzel amu indices bevok bi bɔban mbaŋ.

pretzel-circuit-first-index = A lɛp indices ma tɛlɛban asu pretzel dama mode circuit amu index ya osú a yiane bɔ 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Asu `<{ $component }>` a bɔ a bon ba string, attribute `type` a yiane tɛlɛ.

invalid-type-defaulting-to-math = Nfasô { $type } a si mvɛ̃ te asu elát { $component }. A yiane bɔ math, text, number, to boolean. A ke bulane math.

string-not-valid-component-to-arrange = String "{ $value }" a si mvɛ̃ te asu { $component }. A lɛp nyo.

## Types and variables

invalid-type-defaulting-to-number = Nfasô { $type } a si mvɛ̃ te, a ke bulane nfasô number.

invalid-variable-value = Ntili ya variable a si mvɛ̃ te : `{ $value }`

## Variants

variant-index-must-be-number = Index ya variant { $index } a yiane bɔ number.

variant-index-must-be-integer = Index ya variant { $index } a yiane bɔ integer.

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` a si bɔ te asu ntíli ma absolu. A ke bulane ntíli ma relatif asu width.

side-by-side-absolute-margins = `<{ $component }>` a si bɔ te asu ntíli ma absolu. A ke bulane ntíli ma relatif asu margin.

side-by-side-no-block-child = `<{ $component }>` a si mvɛ̃ te : a yiane bí fok bon a bloc.

## `<label>`

label-for-ignored-on-graphical = Attribute `for` dama `<label>` ya graphique a lɛpban.

label-for-must-resolve-to-one = Attribute `for` dama `<label>` a yiane sɔŋ fok elát étam.

label-for-unresolved = Attribute `for` dama `<label>` a si sɔŋ elát éziŋ te.

label-for-answer-with-authored-inputs = Attribute `for` dama `<label>` a bilá `<answer>` a ne a mimbil mi tɛlɛban dá; bilá mimbil mu, ényiñ.

label-for-answer-without-input = Attribute `for` dama `<label>` a bilá `<answer>` a si bí embil te asu label.

label-for-must-reference-input-or-answer = Attribute `for` dama `<label>` a yiane bilá embil to answer.

## Accessibility

accessibility-short-description-or-decorative = Asu ndoŋ, `<{ $component }>` a yiane bí ntili nkukuma to a tɛlɛ decorative.

accessibility-video-short-description = Asu ndoŋ, `<video>` a yiane bí ntili nkukuma.

accessibility-input-short-description-or-label = Asu ndoŋ, `<{ $component }>` a yiane bí ntili nkukuma to label.

accessibility-answer-input-short-description-or-label = Asu ndoŋ, embil ya `<answer>` a yiane bí ntili nkukuma to label.

accessibility-short-description-contains-math = Ntili nkukuma a yiane bí elát ya math te nga `<{ $component }>`. Tili math mese a bikobo.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } a si bí contraste a yiane te asu nkobo ya title ya ekat (mode a metit) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a yiane bɔ nge yɔŋ { $threshold }:1).
       *[other] { $colorName } a si bí contraste a yiane te asu nkobo ya title ya ekat ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a yiane bɔ nge yɔŋ { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = A si bɔ éziŋ te `<circle>` a wu { $count } bipwɛ̃ dama jôm ba bipwɛ̃ bi si bí ntili numerik te.

circle-too-many-through-points = A si bɔ éziŋ te na o kabe sɛrkele a wu bipwɛ̃ bi lɛti 3.

circle-overprescribed-radius-center-points = A si bɔ éziŋ te na o kabe sɛrkele a radius, center, a bipwɛ̃ bi wu, mbaŋ.

circle-center-with-multiple-points = A si bɔ éziŋ te na o kabe sɛrkele a center a wu pwɛ̃ a lɛti 1.

circle-radius-too-small = A si bɔ éziŋ te na o kabe sɛrkele : distance dama bipwɛ̃ bibaŋ a ne { $distance }, radius { $radius } a tɛlɛban a nyɔlɔ.

circle-radius-with-many-points = A si bɔ éziŋ te na o bí sɛrkele a wu bipwɛ̃ bi lɛti 2 a radius a tɛlɛban.

circle-invalid-center-or-through-points = Center to bipwɛ̃ bi wu ya sɛrkele bi si mvɛ̃ te.

circle-radius-center-with-multiple-points = A si bɔ éziŋ te na o kabe radius ya sɛrkele a center a wu pwɛ̃ a lɛti 1.

circle-change-radius-non-numerical = A si bɔ éziŋ te na o bulane radius ya sɛrkele a bipwɛ̃ bi si bí ntili numerik te.

circle-radius-with-points-non-numerical = A si bɔ éziŋ te na o bí sɛrkele a wu pwɛ̃ a lɛti 1 a radius nge bipwɛ̃ bi si bí ntili numerik te.

circle-change-center-non-numerical = A si bɔ éziŋ te `<circle>` a bulane center a bipwɛ̃ bi si bí ntili numerik te.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Domaine a si bí dimensions a yiane te asu fɔŋksiɔŋ. Domaine a bí interval { $intervals }, ve fɔŋksiɔŋ a bí { $inputs ->
            [one] embil { $inputs }
           *[other] mimbil { $inputs }
        }.
       *[other] Domaine a si bí dimensions a yiane te asu fɔŋksiɔŋ. Domaine a bí intervals { $intervals }, ve fɔŋksiɔŋ a bí { $inputs ->
            [one] embil { $inputs }
           *[other] mimbil { $inputs }
        }.
    }

function-domain-invalid-format = Nfasô a si mvɛ̃ te asu domaine ya fɔŋksiɔŋ.

function-ignoring-non-numerical =
    { $type ->
        [maximum] A lɛp maximum ya fɔŋksiɔŋ, a si bí ntili numerik te.
        [minimum] A lɛp minimum ya fɔŋksiɔŋ, a si bí ntili numerik te.
        [extremum] A lɛp extremum ya fɔŋksiɔŋ, a si bí ntili numerik te.
        [point] A lɛp pwɛ̃ ya fɔŋksiɔŋ, a si bí ntili numerik te.
        [slope] A lɛp pente ya fɔŋksiɔŋ, a si bí ntili numerik te.
       *[other] A lɛp { $type } ya fɔŋksiɔŋ, a si bí ntili numerik te.
    }

function-ignoring-empty =
    { $type ->
        [maximum] A lɛp maximum ya fɔŋksiɔŋ, a ne éziŋ.
        [minimum] A lɛp minimum ya fɔŋksiɔŋ, a ne éziŋ.
        [extremum] A lɛp extremum ya fɔŋksiɔŋ, a ne éziŋ.
        [point] A lɛp pwɛ̃ ya fɔŋksiɔŋ, a ne éziŋ.
       *[other] A lɛp { $type } ya fɔŋksiɔŋ, a ne éziŋ.
    }

function-points-too-close = Fɔŋksiɔŋ a bí bipwɛ̃ bibaŋ bi dulɔ mbɔlɔ. A si bɔ éziŋ te na o tɛlɛ fɔŋksiɔŋ.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Iterates ya fɔŋksiɔŋ a bɔ éziŋ nge ntíli ma mimbil a lɔŋgi a ntíli ma mimbekaŋ. Fɔŋksiɔŋ nyu a bí embil { $inputs } a { $outputs ->
            [one] embekaŋ { $outputs }
           *[other] mimbekaŋ { $outputs }
        }.
       *[other] Iterates ya fɔŋksiɔŋ a bɔ éziŋ nge ntíli ma mimbil a lɔŋgi a ntíli ma mimbekaŋ. Fɔŋksiɔŋ nyu a bí mimbil { $inputs } a { $outputs ->
            [one] embekaŋ { $outputs }
           *[other] mimbekaŋ { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Ntíli ya sequence a si mvɛ̃ te. A yiane bɔ integer a si négatif te.

sequence-invalid-step = Step ya sequence a si mvɛ̃ te. A yiane bɔ number asu sequence a nfasô { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" ya sequence a number a si mvɛ̃ te. A yiane bɔ number.

sequence-invalid-endpoint-letters = "{ $attribute }" ya sequence a letters a si mvɛ̃ te. A yiane bɔ combinaison ya letters.

sequence-invalid-endpoint = "{ $attribute }" ya sequence a si mvɛ̃ te.

select-from-sequence-coprime-not-numbers = coprime a lɛpban amu a si bulane numbers te.

select-from-sequence-coprime-with-exclude-combinations = coprime a lɛpban amu excludeCombinations a tɛlɛban.

## Resolving a `target`

target-not-found = Target ya `<{ $source }>` a si mvɛ̃ te : a si sɔŋ te.

target-state-variable-not-found = Target ya `<{ $source }>` a si mvɛ̃ te : a si sɔŋ state variable a dzina "{ $property }" dama `<{ $component }>` te.

## `<odeSystem>`

ode-system-variables-match-independent = Variables ya `<odeSystem>` a yiane bɔ nsili nge variable indépendant.

ode-system-duplicate-variable-names = A si bɔ éziŋ te na o tɛlɛ fɔŋksiɔŋ ODE RHS a madzina ma variables ma bɔban mbaŋ.

ode-system-rhs-function-error = A si bɔ éziŋ te na o tɛlɛ fɔŋksiɔŋ ODE RHS. Abé a mfefeg fɔŋksiɔŋ mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = A si bɔ éziŋ te na o tɛlɛ angle a liɲi { $count }.

angle-invalid-through-point = Pwɛ̃ ya through ya `<angle>` a si mvɛ̃ te.

parabola-vertex-too-many-points = A si bɔ tɛ te parabɔl a vertex a wu pwɛ̃ a lɛti 1.

parabola-too-many-points = A si bɔ tɛ te parabɔl a wu bipwɛ̃ bi lɛti 3.

intersection-too-many-items = A si bɔ tɛ te intersection asu elát bi lɛti bebaŋ.

## Other math components

ionic-compound-not-two-ions = A si bɔ tɛ te compound ionique nge éziŋ ye ba ion bebaŋ.

ionic-compound-needs-cation-and-anion = Compound ionique a si bɔ te ve a cation étam a anion étam.

solve-equations-cannot-evaluate = A si bɔ éziŋ te na o kabe equation amu a si fefeg equation te : { $equation }

math-operators-operand-number-required = A yiane tɛlɛ operandNumber ngɛ o ke lat operand ya math.

eigen-decomposition-failed = A si bɔ éziŋ te na o kabe eigenvalues ya matrix.

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>` : parameter { $parameters } a si dama pattern te, a ke lat éziŋ mbɛnge.
       *[other] `<matchesPattern>` : parameters { $parameters } wa si dama pattern te, wa ke lat éziŋ mbɛnge.
    }

## `<graph>`

graph-grid-invalid = `<graph>` : a si fefeg te grid="{ $grid }". A yiane bɔ none, medium, dense, to numbers bebaŋ ba mvɛ̃, nga grid="1 0.5". Grid éziŋ a si bɔ te.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>` : xLabelPosition="left" a si bɔ te dama renderer prefigure; a ke bulane comportement ya right.

prefigure-y-label-position-unsupported = `<graph>` : yLabelPosition="bottom" a si bɔ te dama renderer prefigure; a ke bulane comportement ya top.

prefigure-invalid-axis-bounds = `<graph>` : axis bounds a si mvɛ̃ te asu conversion prefigure; a ke bulane bbox par défaut (-10,-10,10,10).

prefigure-invalid-width = `<graph>` : width a si mvɛ̃ te asu conversion prefigure; a ke bulane width par défaut 425.

prefigure-invalid-aspect-ratio = `<graph>` : aspectRatio a si mvɛ̃ te asu conversion prefigure; a ke bulane aspect ratio par défaut 1.

prefigure-grid-spacing-too-fine = `<graph>` : espace ya grid a nyɔlɔ ndɛn asu axis limits; grid a lɛpban dama renderer prefigure.

prefigure-annotations-not-rendered = `<graph>` : annotations wa si bɔ éziŋ te nge renderer PreFigure a si bulane te.

multiple-annotations-children = Bon ba `<annotations>` bebaŋ a yenene dama `<graph>`; be mese, ve a nsɔsɔŋ, wa lɛpban.

## Referring to other components

copy-unrecognized-component-type = A si bɔ éziŋ te na o extend to copy elát a nfasô a si yemban te : { $type }.

copy-prop-not-found = Prop { $property } a si sɔŋ te dama elát a nfasô { $component }.

collect-no-source = Source éziŋ a yenene asu collect.

collect-invalid-component-type = A si bɔ éziŋ te na o collect elát a nfasô `<{ $component }>` amu a si mvɛ̃ te nge nfasô ya elát.

reference-index-unavailable = A si bɔ éziŋ te na o bilá index `{ $reference }`.

## `<callAction>`

component-action-unavailable = A si bɔ éziŋ te na o bilá { $action } dama elát `{ $reference }`.

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Data a bí forme a si mvɛ̃ te. Elɔŋ wa bí ntíli mi si lɔŋgi te. A yenene dama componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data a bí madzina ma kolɔn ma bɔban mbaŋ. A yenene dama componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data a si bí dzina ya kolɔn te. A yenene dama componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Award ya answer nyu a bulu dama ajapkɔb answer nyu wa lɔɔtban, jôm éziŋ a si mvɛ̃ te a ke yenene.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` dama `<answer>` a ndoŋ a sectionWideCheckWork a si bɔ éziŋ te, amu ntíli ma étam wa bulu dama ndoŋ. Tɛlɛ `maxNumAttempts` dama ndoŋ, ényiñ.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` dama ndoŋ a sectionWideCheckWork a ndoŋ a ndoŋ éziŋ a bí sectionWideCheckWork a si bɔ éziŋ te, amu ntíli ma étam wa bulu dama ndoŋ a bulu. Tɛlɛ `maxNumAttempts` dama ndoŋ a bulu, ényiñ.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Attribute { $attributes } a si bɔ éziŋ te hala symbolicEquality a si tɛlɛban te.
       *[other] Attributes { $attributes } wa si bɔ éziŋ te hala symbolicEquality a si tɛlɛban te.
    }

answer-invalid-type = Nfasô a si mvɛ̃ te asu answer : { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Amu elát `<{ $component }>` a si bí dzina te, a si bɔ tɛ te a nga attribute ya module.

module-attribute-name-already-defined = Elát `<{ $component } name="{ $name }">` a si bɔ tɛ te a nga attribute ya module amu `<module>` a bí attribute "{ $name }" bulu.

conditional-content-condition-ignored = Attribute `condition` a lɛpban dama `<conditionalContent>` a bí bon ba case to else.

slider-markers-type-mismatch = Nfasô ya markers a si lɔŋgi te a nfasô ya slider.

pretzel-problem-needs-statement-and-answer = Pretzel a si mvɛ̃ te : fok `<problem>` a yiane bí fok `<statement>` a fok `<answer>`.

pretzel-circuit-first-problem-distractor = Pretzel a si mvɛ̃ te : dama mode="circuit", `<problem>` ya osú a si bɔ tɛ te a distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Ntili { $values } a si mvɛ̃ te asu attribute `{ $attribute }`; a lɛp nyo.
       *[other] Ntíli { $values } wa si mvɛ̃ te asu attribute `{ $attribute }`; a lɛp mo.
    }

attribute-must-be-references = Ntili `{ $value }` a si mvɛ̃ te asu attribute `{ $attribute }`. Attribute a yiane bɔ a bilá bi tébege a `$`.

math-input-invalid-function-names = <mathInput> : a lɛp madzina ma fɔŋksiɔŋ ma si mvɛ̃ te dama { $attribute } : { $names }. Segimã ya dzina wonyu a yiane bɔ nge létɛr 2 (letters to tirɛ); suffix `|<alternative mathspeak>` a bɔ éziŋ nge o kɔmbɔ.

## Building components from the source

component-type-invalid = Nfasô ya elát a si mvɛ̃ te : `<{ $componentType }>`

attribute-repeated = A si bɔ éziŋ te na o bulane attribute { $attribute } mbaŋ mbaŋ.

attribute-invalid-for-component = Attribute "{ $attribute }" a si mvɛ̃ te asu elát a nfasô `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Style definition { $styleNumber } a si bí contraste a yiane te asu { $context ->
        [text-on-background] color ya nkobo dama color ya ndoŋ
        [high-contrast] color ya contraste éte dama canvas
        [line] color ya liɲi dama canvas
        [marker] color ya marker dama canvas
       *[text-on-canvas] color ya nkobo dama canvas
    }{ $mode ->
        [dark] { " (mode a metit)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a yiane bɔ nge yɔŋ { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Style definition { $styleNumber } a bí colors a bí contraste a yiane asu mode a fúlé, ve colors ya mode a metit ma bulu dama ntíli nyu wa si bí contraste a yiane te asu color ya nkobo dama color ya ndoŋ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a yiane bɔ nge yɔŋ { $threshold }:1). { $suggestion ->
        [available] Asu o bɔ contraste a yiane dama mode a metit, tɔb contraste ya mode a fúlé (nga o tɛlɛ { $lightAttribute }="{ $lightColor }") to o bulane color ya mode a metit (nga o tɛlɛ { $darkAttribute }="{ $darkColor }").
       *[none] Asu o bɔ contraste a yiane dama mode a metit, tɔb contraste ya mode a fúlé to bulane colors ma bulu a textColorDarkMode to backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Style definition { $styleNumber } a bí color ya nkobo a bí contraste a yiane asu mode a fúlé, ve color ya nkobo ya mode a metit a bulu dama ntíli nyu a si bí contraste a yiane te dama canvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a yiane bɔ nge yɔŋ { $threshold }:1). { $suggestion ->
        [available] Asu o bɔ contraste a yiane dama mode a metit, tɔb contraste ya mode a fúlé (nga o tɛlɛ textColor="{ $lightColor }") to o bulane color ya mode a metit (nga o tɛlɛ textColorDarkMode="{ $darkColor }").
       *[none] Asu o bɔ contraste a yiane dama mode a metit, tɔb contraste ya mode a fúlé to bulane color a bulu a textColorDarkMode.
    }

section-multiple-style-palettes = Ekat a si bɔ tɛ te a fok `<stylePalette>` étam; a ke bulane nyu a nsɔsɔŋ.

## Unique variants

variant-num-to-select-not-non-negative-integer = A si sɔŋ te variants bi ne étam étam ya { $component } amu numToSelect a si integer a négatif te te.

variant-num-to-select-not-constant-number = A si sɔŋ te variants bi ne étam étam ya { $component } amu numToSelect a si number constant te.

variant-with-replacement-not-constant-boolean = A si sɔŋ te variants bi ne étam étam ya { $component } amu withReplacement a si boolean constant te.

variant-select-weight-disables-unique = Variants bi ne étam étam ya select wa lɛpban nge option a bí selectWeight to selectForVariants tɛlɛban.

variant-coprime-undetermined = A si sɔŋ te variants bi ne étam étam ya { $component } amu a si sɔŋ te coprime a bɔ bulu abé mbaŋ.

variant-attribute-not-constant = A si sɔŋ te variants bi ne étam étam ya { $component } amu { $attribute } a si constant te.

variant-attribute-not-number = A si sɔŋ te variants bi ne étam étam ya { $component } amu { $attribute } a si number te.

variant-attribute-wrong-type-for-sequence =
    A si sɔŋ te variants bi ne étam étam ya { $component } a nfasô { $type } amu { $attribute } a si { $expected ->
        [letters-combination] combinaison ya letters te
        [math-expression] expression ya math a mvɛ̃ te
        [integer] integer te
       *[number] number te
    }.

variant-length-not-integer = A si sɔŋ te variants bi ne étam étam ya { $component } amu length a si integer te.

variant-sort-not-implemented = A si bɔ tɛ te variants bi ne étam étam ya { $component } a sort.

variant-exclude-combinations-not-implemented = A si bɔ tɛ te variants bi ne étam étam ya { $component } a excludeCombinations.

variant-math-exclude-not-implemented = A si bɔ tɛ te variants bi ne étam étam ya { $component } a nfasô math a exclude.

variant-non-constant-exclude-not-implemented = A si bɔ tɛ te variants bi ne étam étam ya { $component } a exclude a si constant te.

## PreFigure conversion

prefigure-descendant-unsupported = { $subject } : a si bɔ te dama renderer graph prefigure; descendant a lɛpban.

prefigure-descendant-invalid-geometry = { $subject } : geometry a si mvɛ̃ te to a si étam te; descendant a lɛpban.

prefigure-curve-label-omitted = { $subject } : labels wa si bɔ te dama elát ba kurbu ma bulu; label a lɛpban.

prefigure-curve-unsupported-definition-type = { $subject } : nfasô ya définition ya kurbu '{ $definitionType }' a si bɔ te; descendant a lɛpban.

prefigure-region-flip-functions-unsupported = { $subject } : flipFunctions dama regionBetweenCurves a si bɔ te; descendant a lɛpban.

prefigure-region-non-formula-child = { $subject } : mfɔŋksiɔŋ ma nfasô formula avale ma bɔ te dama regionBetweenCurves; descendant a lɛpban.

prefigure-label-position-unsupported =
    { $subject } : labelPosition '{ $labelPosition }' a si bɔ te asu { $labelKind ->
        [line-family] label ya famille liɲi
       *[point] label ya pwɛ̃
    }; alignment PreFigure par défaut a bulu.

prefigure-fill-style-unsupported = { $subject } : fill style '{ $fillStyle }' a si bɔ te dama PreFigure; a ke bulane fill étam.

prefigure-line-style-unknown = { $subject } : line style '{ $lineStyle }' a si yemban te, a lɛpban dama PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject } : marker style '{ $markerStyle }' a kabban a style PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject } : marker style '{ $markerStyle }' a si bɔ te dama PreFigure; a ke bulane style par défaut.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>` : `ref` a si mvɛ̃ te; a si sɔŋ target te. Annotation a lɛpban.

annotation-ref-multiple-targets = `<annotation>` : `ref` a sɔŋ targets bebaŋ; a ke bulane target ya osú.

annotation-ref-outside-graph = `<annotation>` : `ref` a si mvɛ̃ te; target a si dama graph te. Annotation a lɛpban.

annotation-ref-unsupported-target = `<annotation>` : `ref` a si mvɛ̃ te; target a si elát ya graphique a mvɛ̃ te asu conversion prefigure. Annotation a lɛpban.

annotation-text-missing = `<annotation>` : `text` a si éziŋ to a si bɔ te; a ke tɔb text éziŋ.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Dépendance circulaire a yenene.
       *[other] Dépendance circulaire a yenene a bilá elát `<{ $componentType }>`.
    }

reference-no-referent = Éziŋ a yenene asu bilá : `{ $reference }`

reference-multiple-referents = Bilá bebaŋ a yenene asu bilá : `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Nfasô a si mvɛ̃ te asu attribute { $attribute } ya `<{ $componentType }>`.

children-invalid = Bon ba `<{ $componentType }>` wa si mvɛ̃ te : bon ba si mvɛ̃ te wa yenene : { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ntili `{ $value }` a si mvɛ̃ te asu attribute `{ $attribute }`, a ke bulane ntili `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Version DoenetML { $version } a si sɔŋ te.
       *[other] Version DoenetML { $version } a si sɔŋ te. A ke bulane version { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML a si mvɛ̃ te : { $content }

parse-tag-missing-close-tag = DoenetML a si mvɛ̃ te : tag `{ $tag }` a si bí close tag te. A yiane bɔ tag a self-closing to tag `</{ $tagName }>`.

parse-tag-error = DoenetML a si mvɛ̃ te : abé a tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML a si mvɛ̃ te : attribute `{ $attribute }` a si bí ntili te, jam.

parse-attribute-invalid = DoenetML a si mvɛ̃ te : attribute `{ $attribute }` a si mvɛ̃ te

parse-attribute-value-invalid = DoenetML a si mvɛ̃ te : ntili ya attribute `{ $value }` a si mvɛ̃ te

parse-attribute-value-quote-mismatch = DoenetML a si mvɛ̃ te : ntili ya attribute `{ $value }` a si mvɛ̃ te. Guillemets wa si lɔŋgi te. O si tɛlɛ `{ $quote }` te, jam.

parse-open-tag-name-missing = DoenetML a si mvɛ̃ te : tag a si bí dzina te a yenene, nga `<`

parse-tag-not-closed = DoenetML a si mvɛ̃ te : tag `{ $tag }` a si kɔŋban te (`>` a si te, jam).

parse-self-closing-tag-name-missing = DoenetML a si mvɛ̃ te : tag a si bí dzina te a yenene `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML a si mvɛ̃ te : tag `{ $tag }` a si kɔŋban te (`/>` a si te, jam).

parse-tag-invalid-attributes = DoenetML a si mvɛ̃ te : tag `{ $tag }` a si mvɛ̃ te. A ne dama attributes ma si mvɛ̃ te.

parse-close-tag-name-missing = DoenetML a si mvɛ̃ te : close tag a si bí dzina te a yenene, nga `</`

parse-attribute-value-unquoted = Ntíli ma attribute ma yiane bɔ dama guillemets : `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML a si mvɛ̃ te : close tag `{ $tag }` a yenene, ve open tag éziŋ a si te.

parse-close-tag-mismatched = DoenetML a si mvɛ̃ te : close tag a si lɔŋgi te. A yiane bɔ `</{ $expected }>`. A yenene `{ $found }`

parser-node-unconvertible = A si bɔ éziŋ te na o kabe node { $node } a node Dast.

## Names

name-attribute-invalid =
    Dzina ya attribute a si mvɛ̃ te name='{ $name }'. { $reason ->
        [characters] Madzina ma yiane bɔ letters, numbers, underscores, to hyphens.
       *[start] Madzina ma yiane bulu a letter.
    }

component-name-invalid-start = Dzina ya elát "{ $name }" a si mvɛ̃ te. Madzina ma yiane bulu a letter.

## `<answer>` sugar

answer-video-watched-missing-video = Answer a nfasô videoWatched a yiane bí attribute video.

answer-video-watched-video-not-reference = Answer a nfasô videoWatched a yiane bí attribute video a ne bilá.

answer-name-not-single-text = Attribute name ya answer a yiane bí fok bon a text étam.

## Referencing another document

external-doenetml-recursion-limit = A si bɔ éziŋ te na o kabe DoenetML éte amu récursion a lɛti bebaŋ. Bilá étam a ke bulu mbaŋ dí?

external-doenetml-unavailable = A si bɔ éziŋ te na o kabe DoenetML dama { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML a bulu dama { $attribute }="{ $uri }" a si mvɛ̃ te : a si lɔŋgi te a nfasô ya elát "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` a si bulu te, bulane `{ $to }` ényiñ.
       *[other] [deprecation] Attribute `{ $from }` dama `<{ $component }>` a si bulu te, bulane `{ $to }` ényiñ.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` a si bulu te, a lɛpban amu `{ $to }` a tɛlɛban mbaŋ.
       *[other] [deprecation] Attribute `{ $from }` dama `<{ $component }>` a si bulu te, a lɛpban amu `{ $to }` a tɛlɛban mbaŋ.
    }

deprecated-attribute-ignored = [deprecation] Attribute `{ $attribute }` dama `<{ $component }>` a si bulu te, a lɛpban.

deprecated-attribute-to-child = [deprecation] Attribute `{ $attribute }` dama `<{ $component }>` a si bulu te, bulane bon `<{ $child }>` ényiñ.

deprecated-attribute-value-renamed = [deprecation] Ntili `{ $value }` ya attribute `{ $attribute }` dama `<{ $component }>` a si bulu te, bulane `{ $to }` ényiñ.


## Language coverage

pluralize-english-only = `<pluralize>` a si bɔ éziŋ te ve a bikobo ya English, nkobo nyu a bɔ dama ayôs a nfasô { $locale } nga wa tili. Tili nkobo a pluriel dá, to tɛlɛ nyu a attribute `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elát `<{ $tag }>` a si elát Doenet ya yemban te.

schema-element-not-allowed-at-root = Elát `<{ $tag }>` a si bɔ te a ntɔŋ ya ayôs.

schema-element-not-allowed-inside = Elát `<{ $tag }>` a si bɔ te dama `<{ $parent }>`.

schema-attribute-unrecognized = Elát `<{ $tag }>` a si bí attribute a dzina `{ $attribute }` te.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Attribute `{ $attribute }` ya elát `<{ $tag }>` a yiane bɔ list, elát fok fok a yiane bɔ étam a mi : { $allowed }
       *[other] Attribute `{ $attribute }` ya elát `<{ $tag }>` a yiane bɔ étam a mi : { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Dzina ya variant asu select a si mvɛ̃ te. Dzina ya variant { $variantName } a yenene dama options { $numOptions }, ve ntíli ma a tɛlɛ a ne { $numToSelect }.

select-variant-name-without-options = Variants bevok wa tɛlɛban asu select ve options éziŋ wa tɛlɛban asu dzina ya variant nga a bɔ étam : { $variantName }.

select-variant-name-not-possible = Dzina ya variant { $variantName } a tɛlɛban asu select a si dzina ya variant a mvɛ̃ te.

select-too-few-options = A si bɔ éziŋ te na o kabe { $numToSelect } elát dama { $numOptions } fefele.

select-from-sequence-too-few-values = A si bɔ éziŋ te na o kabe { $numToSelect } ntíli dama sequence a lɛti { $length }.

select-from-sequence-indices-count-mismatch = Ntíli ma indices ma tɛlɛban asu select a yiane lɔŋgi a ntíli ma a tɛlɛ.

select-from-sequence-indices-not-integers = Indices mese ma tɛlɛban asu select ma yiane bɔ integers.

select-from-sequence-index-excluded = Index ya selectFromSequence a tɛlɛban a lɛpban.

select-from-sequence-indices-excluded-combination = Indices ma selectFromSequence ma tɛlɛban wa ne combinaison a lɛpban.

select-from-sequence-coprime-not-positive-integers = A si bɔ éziŋ te na o kabe combinaisons coprime amu numbers ma tɛlɛban ma si positif te.

select-from-sequence-coprime-common-factor = A si bɔ éziŋ te na o kabe numbers coprime. Ntíli mese wa bí facteur étam. (Ntíli ma "from" to "to" ma yiane bɔ coprime a "step".)

select-from-sequence-coprime-single-number = A si bɔ éziŋ te na o kabe combinaisons coprime dama number étam a si 1 te.

select-from-sequence-excluded-too-many-combinations = A lɛp combinaisons a lɛti 70% dama selectFromSequence

select-from-sequence-coprime-none-found = A si bɔ éziŋ te na o kabe numbers coprime. Ntíli mese wa bí facteur étam.

select-from-sequence-too-few-unique-values = A si bɔ éziŋ te na o kabe { $numToSelect } ntíli étam étam dama sequence a lɛti { $numPossibleValues }

select-prime-numbers-too-few-values = A si bɔ éziŋ te na o kabe { $numToSelect } ntíli dama list ya numbers premiers a lɛti { $numValues }

select-prime-numbers-values-count-mismatch = Ntíli ma tɛlɛban asu select ma yiane lɔŋgi a ntíli ma a tɛlɛ.

select-prime-numbers-values-not-prime = Ntíli mese ma tɛlɛban asu selectPrimeNumbers ma yiane bɔ dama list ya numbers premiers.

select-prime-numbers-values-excluded-combination = Ntíli ma selectPrimeNumbers wa ne combinaison a lɛpban.

select-prime-numbers-excluded-too-many-combinations = A lɛp combinaisons a lɛti 70% dama selectPrimeNumbers

select-random-combination-fluke = A si bɔ éziŋ te na o kabe combinaison ya ntíli étam étam, jôm éziŋ a si yembɔ te.

select-random-value-fluke = A si bɔ éziŋ te na o kabe ntili étam étam, jôm éziŋ a si yembɔ te.
