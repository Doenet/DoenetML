# Jola-Fonyi diagnostics: errors and warnings surfaced to the reader or
# author. Selected by `uiLocale`, not `documentLocale`.
#
# UNREVIEWED SEED, and a partial one. Earlier drafts of this file and
# `editor.ftl` were produced by mechanically re-lexifying Temne's
# (`locales/tem`) diagnostics catalog — swapping Temne's class prefixes for
# invented Jola-Fonyi-styled ones sentence-by-sentence, keeping Temne's exact
# clause order and particle placement. That was not a translation and has
# been discarded. This rewrite instead composes each sentence independently,
# using the class-prefix system and compound vocabulary already established
# in `chrome.ftl` and `content.ftl` (`ka-`/`si-`/`bu-`/`fu-`; `arus` as the
# clause-final negator; `ka fo` "must"; `buka` as the infinitive/purposive
# marker, as in `chrome.ftl`'s `buka tulen` "to open") and reusing the nouns
# `content.ftl` already coined for shared concepts (`kalay` line, `kafɔnksiyɔŋ`
# function, `kavɛktɛr` vector, `bupoligɔn` polygon, etc.) rather than
# inventing new ones for the same idea.
#
# Where no Jola-Fonyi source was available for a technical or UI term, this
# catalog uses a French loanword adapted to Jola-Fonyi phonology (`atribi`,
# `varyaŋ`, `ekwasiyɔŋ`, `paramɛt`, `sekwaŋs`, `matris`), consistent with the
# reasoning `content.ftl`'s header gives for its own French mathematical
# vocabulary: Casamance schooling is French-medium, and a Jola-Fonyi speaker
# meets this technical register in French already.
#
# Honest confidence level: this is a fluent non-speaker's construction from
# published grammatical sketches of Diola-Fogny (concord pattern, negation,
# basic verb morphology), not a speaker's translation. Sentence structure and
# word choice are original to this file rather than copied from Temne, but
# they have not been checked against a Jola-Fonyi speaker or a dictionary
# beyond the vocabulary `content.ftl`/`chrome.ftl` already established. Treat
# every sentence as a rough gloss to be corrected, not as authoritative.
#
# DoenetML element names, attribute names and attribute values — `through`,
# `endpoint`, `midpointOffset`, `numDimensions`, `math`, `text` and the rest —
# are part of the language rather than prose, and stay in English exactly as
# written.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] Ka cim { $attributes } te ase katep sixaley
       *[other] Ka cim { $attributes } te ase katep sixaley
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] Ka cim { $attributes } te ase katep na kakar ka ase
       *[other] Ka cim { $attributes } te ase katep na kakar ka ase
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset arus yaal te kakar arus

## `<line>`

line-points-undetermined-dimensions = Kalay ka kar situt si siboor si arus siit.

line-points-too-few-dimensions = Kalay ka fo kar situt si ase siboor sixaley mba siboor.

line-points-depend-on-variables = Kalay ka kar situt si ase siyool ku sivaryaŋ: { $variables }.

line-equation-invalid-format = Ʌŋbay ku ekwasiyɔŋ ku kalay ka { $variable1 } na { $variable2 } yem arus.

## `<ray>`

ray-overprescribed-through = Kare ka lel na through, endpoint na direction; buka cim through ka lel.

ray-dimension-mismatch = numDimensions ka kare yem arus.

## `<vector>`

vector-overprescribed-head = Kavɛktɛr ka lel na head, tail na displacement; buka cim head ka lel.

vector-dimension-mismatch = numDimensions ka kavɛktɛr yem arus.

## Attracting and constraining

attract-to-without-nearest-point = Buka tënk `<{ $component }>` arus, baka ka ase kafir nearestPoint arus.

constrain-to-without-nearest-point = Buka kant `<{ $component }>` arus, baka ka ase kafir nearestPoint arus.

constrain-to-interior-without-nearest-point = Buka kant ku ro `<{ $component }>` arus, baka ka ase kafir nearestPoint arus.

## `<choiceInput>`

choice-input-label-position-ignored = Buka cim labelPosition ku choiceInput te ka yem inline arus

## Ordering children by index

choice-input-indices-count-mismatch = Buka cim indices ka lel ku choiceInput, baka funoome ku indices arus yool ku siwan si choice.

pretzel-indices-count-mismatch = Buka cim indices ka lel ku problem, baka funoome ku indices arus yool ku siwan si problem.

shuffle-indices-count-mismatch = Buka cim indices ka lel ku shuffle, baka funoome ku indices arus yool ku sijaŋ.

indices-ignored-out-of-range = Buka cim indices ka lel ku { $component }, baka sijaŋ si law ku karɛnj.

pretzel-indices-repeated = Buka cim indices ka lel ku pretzel, baka sijaŋ si ripit.

pretzel-circuit-first-index = Buka cim indices ka lel ku pretzel ku mode="circuit", baka index ka tam ka fo yem 1.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` ka lil ase siwan si string, `type` attribute ka fo lel.

invalid-type-defaulting-to-math = Type { $type } ku { $component } yem arus. Ka fo yem math, text, number mba boolean; buka jaw math.

string-not-valid-component-to-arrange = String "{ $value }" yem kajaŋ arus ku { $component }; buka cim ka.

## Types and variables

invalid-type-defaulting-to-number = Type { $type } yem arus; buka jaw type number.

invalid-variable-value = Ʌŋbʌŋ ku sivaryaŋ yem arus: `{ $value }`

## Variants

variant-index-must-be-number = Index ku varyaŋ { $index } ka fo yem funoome

variant-index-must-be-integer = Index ku varyaŋ { $index } ka fo yem funoome kapeŋ

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` arus lil ku sijɔth sipeŋ; buka jaw siboor ka sinuŋ.

side-by-side-absolute-margins = `<{ $component }>` arus lil ku sijɔth sipeŋ; buka jaw sijaŋ ka sinuŋ.

side-by-side-no-block-child = `<{ $component }>` yem arus: ka fo ase kawan ka block karoŋ mba kaboor.

## `<label>`

label-for-ignored-on-graphical = Buka cim `for` attribute ku `<label>` ka kamisal.

label-for-must-resolve-to-one = `for` attribute ku `<label>` ka fo yool kajaŋ karoŋ rekk.

label-for-unresolved = Buka yool `for` attribute ku `<label>` ku kajaŋ arus.

label-for-answer-with-authored-inputs = `for` attribute ku `<label>` ka yool `<answer>` ka ase input si lel te; nuŋ input ka kapeŋ te.

label-for-answer-without-input = `for` attribute ku `<label>` ka yool `<answer>` ka ase input arus.

label-for-must-reference-input-or-answer = `for` attribute ku `<label>` ka fo yool input mba answer.

## Accessibility

accessibility-short-description-or-decorative = Ku kasoot, `<{ $component }>` ka fo ase funkabat kabat mba ka fo lel ka decorative.

accessibility-video-short-description = Ku kasoot, `<video>` ka fo ase funkabat kabat.

accessibility-input-short-description-or-label = Ku kasoot, `<{ $component }>` ka fo ase funkabat kabat mba fues.

accessibility-answer-input-short-description-or-label = Ku kasoot, `<answer>` ka jaw input ka fo ase funkabat kabat mba fues.

accessibility-short-description-contains-math = Funkabat kabat ka fo ase sijaŋ si mat, ka `<{ $component }>`, arus; soŋ mat ase sikeer.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ka ase kafir kaboor arus ku funkeer ku katoŋ ku kapat (mode ka situp) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ka fo am { $threshold }:1 mba kaboor).
       *[other] { $colorName } ka ase kafir kaboor arus ku funkeer ku katoŋ ku kapat ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ka fo am { $threshold }:1 mba kaboor).
    }

## `<circle>`

circle-through-points-non-numerical = Busɛrkal ka kar situt { $count } te ase sinoome si arus lil arus.

circle-too-many-through-points = Buka juut busɛrkal ka kar situt si law 3 arus.

circle-overprescribed-radius-center-points = Buka juut busɛrkal ase radius, kakar na situt sipeŋ arus.

circle-center-with-multiple-points = Buka juut busɛrkal ase kakar ka kar katut ka law 1 arus.

circle-radius-too-small = Buka juut busɛrkal arus: futɔŋ ku situt sixaley yem { $distance }, radius { $radius } ka lel kəni siboor.

circle-radius-with-many-points = Buka jaw busɛrkal ka kar situt si law sixaley ase radius ka lel arus.

circle-invalid-center-or-through-points = Kakar mba situt si busɛrkal yem arus.

circle-radius-center-with-multiple-points = Buka juut radius ku busɛrkal ase kakar ka kar katut ka law 1 arus.

circle-change-radius-non-numerical = Buka yeen radius ku busɛrkal, baka situt si ase sinoome arus.

circle-radius-with-points-non-numerical = Buka jaw busɛrkal ka kar katut ka law karoŋ ase radius, baka sinoome si arus.

circle-change-center-non-numerical = Buka yeen kakar ku busɛrkal ka kar situt si ase sinoome arus arus lel.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Siboor si domɛn ku kafɔnksiyɔŋ arus law. Domɛn ka ase intɛrval { $intervals } kutaa kafɔnksiyɔŋ ka ase { $inputs ->
            [one] input { $inputs }
           *[other] input { $inputs }
        }.
       *[other] Siboor si domɛn ku kafɔnksiyɔŋ arus law. Domɛn ka ase intɛrval { $intervals } kutaa kafɔnksiyɔŋ ka ase { $inputs ->
            [one] input { $inputs }
           *[other] input { $inputs }
        }.
    }

function-domain-invalid-format = Ʌŋbay ku domɛn ku kafɔnksiyɔŋ yem arus.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Buka cim kaboor ku kafɔnksiyɔŋ, baka ase sinoome arus.
        [minimum] Buka cim kaken ku kafɔnksiyɔŋ, baka ase sinoome arus.
        [extremum] Buka cim katep ku kafɔnksiyɔŋ, baka ase sinoome arus.
        [point] Buka cim katut ku kafɔnksiyɔŋ, baka ase sinoome arus.
        [slope] Buka cim kakar ku kafɔnksiyɔŋ, baka ase sinoome arus.
       *[other] Buka cim { $type } ku kafɔnksiyɔŋ, baka ase sinoome arus.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Buka cim kaboor ku kafɔnksiyɔŋ, baka yem lëf.
        [minimum] Buka cim kaken ku kafɔnksiyɔŋ, baka yem lëf.
        [extremum] Buka cim katep ku kafɔnksiyɔŋ, baka yem lëf.
        [point] Buka cim katut ku kafɔnksiyɔŋ, baka yem lëf.
       *[other] Buka cim { $type } ku kafɔnksiyɔŋ, baka yem lëf.
    }

function-points-too-close = Kafɔnksiyɔŋ ka ase situt sixaley si futɔŋ arus law; buka lomb kafɔnksiyɔŋ arus.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Siripit si kafɔnksiyɔŋ ka lil rekk te funoome ku input ka yool ku funoome ku output. Kafɔnksiyɔŋ kanɛ ka ase input { $inputs } na { $outputs ->
            [one] output { $outputs }
           *[other] output { $outputs }
        }.
       *[other] Siripit si kafɔnksiyɔŋ ka lil rekk te funoome ku input ka yool ku funoome ku output. Kafɔnksiyɔŋ kanɛ ka ase input { $inputs } na { $outputs ->
            [one] output { $outputs }
           *[other] output { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Futɔŋ ku sekwaŋs yem arus; ka fo yem funoome kapeŋ ka təp ziro arus.

sequence-invalid-step = Step ku sekwaŋs yem arus; ka fo yem funoome ku sekwaŋs ku type { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" ku sekwaŋs ku number yem arus; ka fo yem funoome.

sequence-invalid-endpoint-letters = "{ $attribute }" ku sekwaŋs ku letters yem arus; ka fo yem katofi ku simark.

sequence-invalid-endpoint = "{ $attribute }" ku sekwaŋs yem arus.

select-from-sequence-coprime-not-numbers = Buka cim coprime, baka arus fen sinoome si.

select-from-sequence-coprime-with-exclude-combinations = Buka cim coprime, baka excludeCombinations ka lel.

## Resolving a `target`

target-not-found = Target ku `<{ $source }>` yem arus: buka siit target arus.

target-state-variable-not-found = Target ku `<{ $source }>` yem arus: buka siit kafir ka ase fues "{ $property }" ku `<{ $component }>` arus.

## `<odeSystem>`

ode-system-variables-match-independent = Sivaryaŋ si `<odeSystem>` si fo yem sijaŋ ku varyaŋ ka təfaŋ te.

ode-system-duplicate-variable-names = Buka lomb sifɔnksiyɔŋ si ODE RHS, baka fues ku sivaryaŋ si ripit.

ode-system-rhs-function-error = Buka lomb kafɔnksiyɔŋ ku ODE RHS arus; kakaañ ku kabay ku kafɔnksiyɔŋ ku mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Buka lomb kaangul ku silay { $count } arus

angle-invalid-through-point = Katut ku through ku `<angle>` yem arus

parabola-vertex-too-many-points = Kaparabɔl ase vertex ka kar katut ka law 1 arus lel.

parabola-too-many-points = Kaparabɔl ka kar situt si law 3 arus lel.

intersection-too-many-items = Katofi ku sijaŋ si law sixaley arus lel

## Other math components

ionic-compound-not-two-ions = Katofi ku ayɔŋ ku kajaŋ ka yem siayɔŋ sixaley arus lel; siayɔŋ sipeŋ rekk.

ionic-compound-needs-cation-and-anion = Katofi ku ayɔŋ ka jaw ku katayɔŋ karoŋ na anayɔŋ karoŋ rekk.

solve-equations-cannot-evaluate = Buka sɔlv ekwasiyɔŋ arus, baka buka juut ka arus: { $equation }

math-operators-operand-number-required = operandNumber ka fo lel buka cim operand ku mat.

eigen-decomposition-failed = Buka juut sivalɛr eigɛn si matris arus

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: paramɛt { $parameters } ase arus ku patɛrn, ka fo ñoom lëf rekk te.
       *[other] `<matchesPattern>`: siparamɛt { $parameters } ase arus ku patɛrn, si fo ñoom lëf rekk te.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: buka lomb grid="{ $grid }" arus. Ka fo yem none, medium, dense, mba sinoome sixaley siboor si ase karoo ka kant, ka kamisal grid="1 0.5". Buka jaw grid arus.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" arus lel ku kayiraŋ ku prefigure; buka jaw ka kajaŋ ku kagbon.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" arus lel ku kayiraŋ ku prefigure; buka jaw ka kajaŋ ku katoŋ.

prefigure-invalid-axis-bounds = `<graph>`: sijaŋ si aksi si yem arus ku prefigure; buka jaw bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: fubana yem arus ku prefigure; buka jaw fubana 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio yem arus ku prefigure; buka jaw reshio 1.

prefigure-grid-spacing-too-fine = `<graph>`: karoo ku grid kəni siboor ku sijaŋ si aksi; buka cim grid ku kayiraŋ ku prefigure.

prefigure-annotations-not-rendered = `<graph>`: annotations si buka won arus, baka kayiraŋ ku PreFigure arus lel.

multiple-annotations-children = Buka siit siwan si `<annotations>` siboor ku `<graph>`; buka cim sipeŋ nɛ ka sitəp.

## Referring to other components

copy-unrecognized-component-type = Buka lomb mba buka kɔpi kanoot ku kajaŋ ka buka siit arus: { $type }.

copy-prop-not-found = Buka siit prop { $property } ku kajaŋ ku kanoot { $component } arus

collect-no-source = Buka siit katəŋ ku collect arus.

collect-invalid-component-type = Buka thɔfi sijaŋ si kanoot `<{ $component }>` arus, baka kanoot yem arus.

reference-index-unavailable = Buka nuŋ index `{ $reference }` arus

## `<callAction>`

component-action-unavailable = Buka won { $action } ku kajaŋ `{ $reference }` arus

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Ʌŋbay ku data yem arus; siro si ase sitɔŋ sijaŋ. Buka siit ku componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data ka ase fues ku sikɔlum si ripit. Buka siit ku componentIdx :{ $componentIdx }

data-frame-missing-column-name = Fues ku kakolom ase arus ku data. Buka siit ku componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Award ku kalipi kanɛ ka yool kalipi ku answer tag kapeŋ; ka baa ase sijaŋ si mu koos arus.

answer-max-num-attempts-in-section-wide-check-work = Buka jaw `maxNumAttempts` ku `<answer>` ka ase ku ro kajaŋ ka ase `sectionWideCheckWork` arus lil, baka kajaŋ ka tënk funoome ku sitampa. Jaw `maxNumAttempts` ku kajaŋ.

nested-section-wide-check-work-max-num-attempts = Buka jaw `maxNumAttempts` ku kajaŋ ka ase `sectionWideCheckWork` ase ka ase ku ro kajaŋ ka ase `sectionWideCheckWork` arus lil, baka kajaŋ ku kagbon ka tënk funoome ku sitampa. Jaw `maxNumAttempts` ku kajaŋ ku kagbon.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Attribute { $attributes } arus yaal, baka symbolicEquality arus jaw.
       *[other] Sattribute { $attributes } arus yaal, baka symbolicEquality arus jaw.
    }

answer-invalid-type = Type ku kalipi yem arus: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Kajaŋ `<{ $component }>` ase fues arus, buka jaw ka ka attribute ku module arus

module-attribute-name-already-defined = Buka jaw kajaŋ `<{ $component } name="{ $name }">` ka attribute ku module arus, baka `<module>` ka ase "{ $name }" attribute nɛ.

conditional-content-condition-ignored = Buka cim `condition` attribute ku `<conditionalContent>` ka ase siwan si case mba else.

slider-markers-type-mismatch = Type ku markers arus yool type ku slider.

pretzel-problem-needs-statement-and-answer = Pretzel yem arus: `<problem>` karoŋ karoŋ ka fo ase `<statement>` karoŋ na `<answer>` karoŋ.

pretzel-circuit-first-problem-distractor = Pretzel yem arus: ku mode="circuit", `<problem>` ka tam arus yem distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Ʌŋbʌŋ { $values } yem arus ku attribute `{ $attribute }`; buka cim ka.
       *[other] Sijaŋ { $values } si yem arus ku attribute `{ $attribute }`; buka cim si.
    }

attribute-must-be-references = Ʌŋbʌŋ `{ $value }` yem arus ku attribute `{ $attribute }`. Attribute ka fo yem sinuŋ si tam ase `$`.

math-input-invalid-function-names = <mathInput>: buka cim fues si arus lel ku sifɔnksiyɔŋ ku { $attribute }: { $names }. Kapat ku kayiraŋ ku fues ka fo ase simark sixaley mba siboor (simark mba sidash); `|<mathspeak alternative>` ka taŋ mu.

## Building components from the source

component-type-invalid = Kanoot ku kajaŋ yem arus: `<{ $componentType }>`

attribute-repeated = Buka ripit attribute { $attribute } arus.

attribute-invalid-for-component = Attribute "{ $attribute }" yem arus ku kajaŋ ku kanoot `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Ʌŋkəbath ku kanoot { $styleNumber } ka ase kafir kaboor arus ku { $context ->
        [text-on-background] funkabak ku funkeer ku funkabak ku kabaka
        [high-contrast] funkabak ku kafir kaboor ku kanvas
        [line] funkabak ku kalay ku kanvas
        [marker] funkabak ku kamark ku kanvas
       *[text-on-canvas] funkabak ku funkeer ku kanvas
    }{ $mode ->
        [dark] { " (mode ka situp)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ka fo am { $threshold }:1 mba kaboor).

style-definition-dark-mode-text-background-contrast =
    Buka funkabat ku kanoot { $styleNumber } ka ase sikəbaka si ase kafir kaboor ku mode ka yoor te, sikəbaka si mode ka situp si buka cim ku si si ase kafir kaboor arus ku funkabak ku funkeer na funkabak ku kabaka ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ka fo am { $threshold }:1 mba kaboor). { $suggestion ->
        [available] Ka mu siit kafir kaboor ku mode ka situp, yem kafir ku mode ka yoor (ka kamisal, jaw { $lightAttribute }="{ $lightColor }") mba yeen funkabak ku mode ka situp (ka kamisal, jaw { $darkAttribute }="{ $darkColor }").
       *[none] Ka mu siit kafir kaboor ku mode ka situp, yem kafir ku mode ka yoor mba yeen sikəbaka ase textColorDarkMode mba backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Buka funkabat ku kanoot { $styleNumber } ka ase funkabak ku funkeer ka ase kafir kaboor ku mode ka yoor te, funkabak ku funkeer ku mode ka situp ka buka cim ku ka ka ase kafir kaboor arus ku kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ka fo am { $threshold }:1 mba kaboor). { $suggestion ->
        [available] Ka mu siit kafir kaboor ku mode ka situp, yem kafir ku mode ka yoor (ka kamisal, jaw textColor="{ $lightColor }") mba yeen funkabak ku mode ka situp (ka kamisal, jaw textColorDarkMode="{ $darkColor }").
       *[none] Ka mu siit kafir kaboor ku mode ka situp, yem kafir ku mode ka yoor mba yeen funkabak ase textColorDarkMode.
    }

section-multiple-style-palettes = Kapat ka am <stylePalette> karoŋ rekk; buka jaw ka katep.

## Unique variants

variant-num-to-select-not-non-negative-integer = Buka siit sivaryaŋ sijaŋ si { $component } arus, baka numToSelect arus yem funoome kapeŋ ka təp ziro.

variant-num-to-select-not-constant-number = Buka siit sivaryaŋ sijaŋ si { $component } arus, baka numToSelect arus yem funoome ka yeen arus.

variant-with-replacement-not-constant-boolean = Buka siit sivaryaŋ sijaŋ si { $component } arus, baka withReplacement arus yem boolean ka yeen arus.

variant-select-weight-disables-unique = Sivaryaŋ sijaŋ si select si kant, baka option kajaŋ ka ase selectWeight mba selectForVariants

variant-coprime-undetermined = Buka siit sivaryaŋ sijaŋ si { $component } arus, baka buka siit ka coprime yem funngool rekk arus.

variant-attribute-not-constant = Buka siit sivaryaŋ sijaŋ si { $component } arus, baka { $attribute } arus yeen.

variant-attribute-not-number = Buka siit sivaryaŋ sijaŋ si { $component } arus, baka { $attribute } arus yem funoome.

variant-attribute-wrong-type-for-sequence =
    Buka siit sivaryaŋ sijaŋ si { $component } ku type { $type } arus, baka { $attribute } arus yem { $expected ->
        [letters-combination] katofi ku simark
        [math-expression] funkeer ku mat ka yem
        [integer] funoome kapeŋ
       *[number] funoome
    }.

variant-length-not-integer = Buka siit sivaryaŋ sijaŋ si { $component } arus, baka length arus yem funoome kapeŋ.

variant-sort-not-implemented = Sivaryaŋ sijaŋ si { $component } ase sort arus lel

variant-exclude-combinations-not-implemented = Sivaryaŋ sijaŋ si { $component } ase excludeCombinations arus lel

variant-math-exclude-not-implemented = Sivaryaŋ sijaŋ si { $component } ku type math ase exclude arus lel

variant-non-constant-exclude-not-implemented = Sivaryaŋ sijaŋ si { $component } ase exclude ka yeen arus lel

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: arus lel ku kayiraŋ ku graph prefigure; buka cim kawan.

prefigure-descendant-invalid-geometry = { $subject }: jeometri yem arus mba pəŋ arus; buka cim kawan.

prefigure-curve-label-omitted = { $subject }: fues arus lel ku sijaŋ si curve si buka yeen; buka cim fues.

prefigure-curve-unsupported-definition-type = { $subject }: kanoot ku funkabat ku kafɔnksiyɔŋ ku curve '{ $definitionType }' arus lel; buka cim kawan.

prefigure-region-flip-functions-unsupported = { $subject }: flipFunctions attribute ku regionBetweenCurves arus lel; buka cim kawan.

prefigure-region-non-formula-child = { $subject }: sifɔnksiyɔŋ siwan si formula rekk si lil ku regionBetweenCurves; buka cim kawan.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' arus lel ku { $labelKind ->
        [line-family] fues ku katofi ku silay
       *[point] fues ku katut
    }; buka jaw kajaŋ ku PreFigure.

prefigure-fill-style-unsupported = { $subject }: kanoot ku kakaañ '{ $fillStyle }' arus lel ku PreFigure; buka jaw kakaañ kapeŋ.

prefigure-line-style-unknown = { $subject }: buka siit kanoot ku kalay '{ $lineStyle }' arus, buka cim ka ku PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: buka yeen kanoot ku kamark '{ $markerStyle }' ka kanoot 'diamond' ku PreFigure.

prefigure-marker-style-unsupported = { $subject }: kanoot ku kamark '{ $markerStyle }' arus lel ku PreFigure; buka jaw kanoot ka ase paa.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` yem arus; buka siit target arus. Buka cim annotation.

annotation-ref-multiple-targets = `<annotation>`: `ref` ka yool sitarget siboor; buka jaw ka katəŋ.

annotation-ref-outside-graph = `<annotation>`: `ref` yem arus; target ase ku kagbon ku graph. Buka cim annotation.

annotation-ref-unsupported-target = `<annotation>`: `ref` yem arus; target yem kajaŋ ku kamisal ka prefigure arus siit. Buka cim annotation.

annotation-text-missing = `<annotation>`: `text` ase arus mba yem lëf; buka soŋ funkeer ku lëf arus.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Buka siit kanuŋ ku sikaroŋ.
       *[other] Buka siit kanuŋ ku sikaroŋ, ka ase kajaŋ `<{ $componentType }>`.
    }

reference-no-referent = Buka siit lëf ku kanuŋ arus: `{ $reference }`

reference-multiple-referents = Buka siit sijaŋ siboor ku kanuŋ: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ʌŋbay ku attribute { $attribute } ku `<{ $componentType }>` yem arus.

children-invalid = Siwan si `<{ $componentType }>` yem arus: Buka siit siwan si yem arus: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ʌŋbʌŋ `{ $value }` yem arus ku attribute `{ $attribute }`; buka jaw `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Buka siit DoenetML version { $version } arus.
       *[other] Buka siit DoenetML version { $version } arus. Buka jaw version { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML yem arus: { $content }

parse-tag-missing-close-tag = DoenetML yem arus: Tag `{ $tag }` ase tag ku kakanti arus. Buka koos tag ka kant kapeŋ mba tag `</{ $tagName }>`.

parse-tag-error = DoenetML yem arus: Kakaañ ku tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML yem arus: Attribute `{ $attribute }` yem arus, ka won ase funbaŋ arus.

parse-attribute-invalid = DoenetML yem arus: Attribute `{ $attribute }` yem arus

parse-attribute-value-invalid = DoenetML yem arus: Ʌŋbʌŋ ku attribute `{ $value }` yem arus

parse-attribute-value-quote-mismatch = DoenetML yem arus: Ʌŋbʌŋ ku attribute `{ $value }` yem arus. Simark si kwot arus yool; ka won ka `{ $quote }` ase arus

parse-open-tag-name-missing = DoenetML yem arus: Buka siit tag ka ase fues arus, ka `<`

parse-tag-not-closed = DoenetML yem arus: Buka kant tag `{ $tag }` arus (ka won ka `>` ase arus).

parse-self-closing-tag-name-missing = DoenetML yem arus: Buka siit tag ka ase fues arus `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML yem arus: Buka kant tag `{ $tag }` arus (ka won ka `/>` ase arus).

parse-tag-invalid-attributes = DoenetML yem arus: Tag `{ $tag }` yem arus. Ka ase siattribute si yem arus.

parse-close-tag-name-missing = DoenetML yem arus: Buka siit tag ku kakanti ka ase fues arus, ka `</`

parse-attribute-value-unquoted = Sijaŋ si attribute si fo ase ku ro sikwot: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML yem arus: Buka siit tag ku kakanti `{ $tag }`, kutaa tag ku katuli ase arus

parse-close-tag-mismatched = DoenetML yem arus: Tag ku kakanti arus yool. Buka koos `</{ $expected }>`. Buka siit `{ $found }`

parser-node-unconvertible = Buka yeen node { $node } ka node ku Dast arus.

## Names

name-attribute-invalid =
    Attribute name='{ $name }' yem arus. { $reason ->
        [characters] Ʌŋes ka ase simark, sinoome, siandaskɔ mba sidash rekk.
       *[start] Ʌŋes ka fo tam ase kamark.
    }

component-name-invalid-start = Ʌŋes ku kajaŋ "{ $name }" yem arus. Ʌŋes ka fo tam ase kamark.

## `<answer>` sugar

answer-video-watched-missing-video = Answer ku type videoWatched ka fo ase video attribute

answer-video-watched-video-not-reference = Answer ku type videoWatched ka fo ase video attribute ka yem kanuŋ

answer-name-not-single-text = Answer name attribute ka fo ase kawan ku text karoŋ rekk

## Referencing another document

external-doenetml-recursion-limit = Buka siit DoenetML ku kagbon arus, baka siripit si law siboor. Kanuŋ ku sikaroŋ ase?

external-doenetml-unavailable = Buka siit DoenetML ku { $attribute }="{ $uri }" arus

external-doenetml-type-mismatch = DoenetML ka buka siit ku { $attribute }="{ $uri }" yem arus: arus yool ase kanoot ku kajaŋ "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` ka komo; jaw `{ $to }`.
       *[other] [deprecation] Attribute `{ $from }` ku `<{ $component }>` ka komo; jaw `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` ka komo; buka cim ka, baka `{ $to }` ase sipeŋ.
       *[other] [deprecation] Attribute `{ $from }` ku `<{ $component }>` ka komo; buka cim ka, baka `{ $to }` ase sipeŋ.
    }

deprecated-attribute-ignored = [deprecation] Attribute `{ $attribute }` ku `<{ $component }>` ka komo; buka cim ka.

deprecated-attribute-to-child = [deprecation] Attribute `{ $attribute }` ku `<{ $component }>` ka komo; jaw kawan `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Ʌŋbʌŋ `{ $value }` ku attribute `{ $attribute }` ku `<{ $component }>` ka komo; jaw `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` ka jaw Inglish siboor rekk, ka dëni funkeer ka mu soŋ te ku kabuk ka buka soŋ ku { $locale }. Soŋ funbay ku siboor kapeŋ, mba jaw ka ase `pluralForm` attribute.


## Checking against the schema

schema-element-unrecognized = Kajaŋ `<{ $tag }>` yem kajaŋ ku Doenet ka buka siit arus.

schema-element-not-allowed-at-root = Buka yif kajaŋ `<{ $tag }>` ku katoŋ ku kabuk arus.

schema-element-not-allowed-inside = Buka yif kajaŋ `<{ $tag }>` ku ro `<{ $parent }>` arus.

schema-attribute-unrecognized = Kajaŋ `<{ $tag }>` ase attribute ase fues `{ $attribute }` arus.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Attribute `{ $attribute }` ku kajaŋ `<{ $tag }>` ka fo yem kalist ka sijaŋ si ro si yem karoŋ ku: { $allowed }
       *[other] Attribute `{ $attribute }` ku kajaŋ `<{ $tag }>` ka fo yem karoŋ ku: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Ʌŋes ku varyaŋ ku select yem arus. Ʌŋes ku varyaŋ { $variantName } ka won ku option { $numOptions } kutaa funoome ku kafen yem { $numToSelect }.

select-variant-name-without-options = Sivaryaŋ sijaŋ si lel ku select, kutaa option arus lel ku fues ku varyaŋ: { $variantName }.

select-variant-name-not-possible = Ʌŋes ku varyaŋ { $variantName } ka lel ku select arus lel fues ku varyaŋ.

select-too-few-options = Buka am sijaŋ { $numToSelect } ku { $numOptions } rekk arus.

select-from-sequence-too-few-values = Buka am sijaŋ { $numToSelect } ku sekwaŋs ku futɔŋ { $length } arus.

select-from-sequence-indices-count-mismatch = Funoome ku indices ka lel ku select ka fo yool funoome ku kafen

select-from-sequence-indices-not-integers = Indices sipeŋ ka lel ku select ka fo yem sinoome sipeŋ

select-from-sequence-index-excluded = Index ku selectfromsequence ka buka cim ka lel

select-from-sequence-indices-excluded-combination = Indices ku selectfromsequence yem katofi ka buka cim ka lel

select-from-sequence-coprime-not-positive-integers = Buka am sitofi si coprime arus, baka arus am sinoome sipeŋ si law ziro.

select-from-sequence-coprime-common-factor = Buka am sinoome si coprime arus; sijaŋ sipeŋ si ase faktɔ karoŋ. (Sijaŋ si "from" mba "to" ka fo yem coprime na "step".)

select-from-sequence-coprime-single-number = Buka am sitofi si coprime ku funoome karoŋ ka arus yem 1 arus.

select-from-sequence-excluded-too-many-combinations = Buka cim sitofi si law 70% ku selectFromSequence

select-from-sequence-coprime-none-found = Buka am sinoome si coprime arus; sijaŋ sipeŋ si ase faktɔ karoŋ.

select-from-sequence-too-few-unique-values = Buka am sijaŋ sijaŋ { $numToSelect } ku sekwaŋs ku futɔŋ { $numPossibleValues } arus

select-prime-numbers-too-few-values = Buka am sijaŋ { $numToSelect } ku kalist ku sipraym ku futɔŋ { $numValues } arus

select-prime-numbers-values-count-mismatch = Funoome ku sijaŋ ka lel ku select ka fo yool funoome ku kafen

select-prime-numbers-values-not-prime = Sijaŋ sipeŋ ka lel ku select prime number ka fo ase ku kalist ku sipraym

select-prime-numbers-values-excluded-combination = Sijaŋ ka lel ku selectPrimeNumbers yem katofi ka buka cim

select-prime-numbers-excluded-too-many-combinations = Buka cim sitofi si law 70% ku selectPrimeNumbers

select-random-combination-fluke = Ku kajaŋ arus lil, buka am katofi ku sijaŋ sijaŋ arus

select-random-value-fluke = Ku kajaŋ arus lil, buka am funbaŋ kajaŋ arus
