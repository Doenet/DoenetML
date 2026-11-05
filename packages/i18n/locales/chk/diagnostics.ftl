# Chuukese (Fóósun Chuuk) diagnostics, Chuuk Lagoon variety: the errors and
# warnings the worker raises. Produced by the worker but addressed to whoever
# is looking at the screen, so these are selected by `uiLocale`, not
# `documentLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Orthography, number, gender and word order are settled in `chrome.ftl`'s
# header, and `content.ftl` holds the canonical vocabulary table for the words
# shared across the four files.
#
# ## What stays in English
#
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `labelPosition` and
# their like are DoenetML attribute and component names. They are part of the
# language, not prose, and are left exactly as written — including inside
# `<angle brackets>` and `backticks`, which are punctuation this catalog
# supplies.
#
# Beyond those names, this catalog keeps a small set of English **common
# nouns** that name DoenetML machinery rather than anything in the world:
# `attribute`, `component`, `element`, `tag`, `variant`, `index`, `value`,
# `list`, `input`, `output`, `option`, `reference`, `state variable`,
# `property` and the mathematical `integer`, `number`, `equation`, `matrix`,
# `expression`, `domain`. Chuukese has no settled equivalents for them —
# secondary schooling in Chuuk is in English, and these are the words a Chuuk
# student meets in that classroom — and coining fifteen technical nouns inside
# a diagnostic no one has proofread would present a guess as a fact. The prose
# around them is Chuukese. A reviewer who has the Chuukese words should replace
# them; that is the largest single improvement available to this file.
#
# ## Verb number is real here
#
# Where the English forks between "is ignored" and "are ignored", the Chuukese
# forks too, and for its own reason: the third-person subject marker is «e/a»
# in the singular and «re/ra» in the plural, so «ese áeá» and «resap áeá» are
# genuinely two forms. Those `one` / `*[other]` pairs are kept. Where the
# English forks only because an English *noun* pluralizes — "1 interval" /
# "2 intervals" — the select is dropped and one form stands, because a Chuukese
# noun does not change after a numeral. `Intl.PluralRules("chk")` has no CLDR
# data in any case; never add `[two]`, `[few]` or `[many]` here.
#
# ## Recurring renderings, so that they stay one word each
#
#   «mi mwáál»        invalid, wrong. «mwáál» alone is the noun *error*.
#   «Ese tongeni …»   cannot …
#   «Esaamwo wor …»   has not been implemented, "there is not yet any …"
#   «ese áeá» / «resap áeá»   is / are ignored, "is not used"
#   «mi affat»        specified, stated
#   «epwe …»          must …
#   «a weweiti»       refers to
#   «úkúkún»          the number of, the measure of; also *dimension*
#   «ánnapan»         its length — a coinage on «nap», long
#   «mesan»           its colour, "its look" — a coinage, and the one this file
#                     leans on most in the contrast messages
#   «sokkonon»        contrast, "the difference between them" — likewise a
#                     coinage
#   «mi púsin fis»    the default, "what happens of itself"
#   «esap chiwen áeá» deprecated, "no longer used"
#   «achchómmónga»    to pluralize, built on «chómmóng», many
#   «mesen makkey»    a letter of the alphabet
#   «mi wirimwir»     circular, going round and round
#
# All six coinages are flagged rather than hidden, and each is used in exactly
# one sense throughout the four files.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } ese áeá nupwen ruuw endpoint ra affat
       *[other] { $attributes } resap áeá nupwen ruuw endpoint ra affat
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } ese áeá nupwen eew endpoint me eew midpoint ra affat fengen
       *[other] { $attributes } resap áeá nupwen eew endpoint me eew midpoint ra affat fengen
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ese fófór ika esap wor eew midpoint

## `<line>`

line-points-undetermined-dimensions = Eew nain won poin mi esap ffat úkúkúner.

line-points-too-few-dimensions = Ewe nain epwe won poin mi wor ánean ruuw úkúkún.

line-points-depend-on-variables = Ewe nain a won poin mi nónnóng wóón ekkei variable: { $variables }.

line-equation-invalid-format = Napanapen ewe equation fánin ewe nain mi mwáál non ekkewe variable { $variable1 } me { $variable2 }.

## `<ray>`

ray-overprescribed-through = Ewe reey a affat ren through, endpoint, me direction.  Esap áeá ewe through mi affat.

ray-dimension-mismatch = numDimensions ese fich non ewe reey.

## `<vector>`

vector-overprescribed-head = Ewe pekitá a affat ren head, tail, me displacement.  Esap áeá ewe head mi affat.

vector-dimension-mismatch = numDimensions ese fich non ewe pekitá.

## Attracting and constraining

attract-to-without-nearest-point = Ese tongeni attract ngeni eew `<{ $component }>` pun esap wor an nearestPoint state variable.

constrain-to-without-nearest-point = Ese tongeni constrain ngeni eew `<{ $component }>` pun esap wor an nearestPoint state variable.

constrain-to-interior-without-nearest-point = Ese tongeni constrain ngeni nenien nong non eew `<{ $component }>` pun esap wor an nearestPoint state variable.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ese áeá fán eew choiceInput mi esap inline

## Ordering children by index

choice-input-indices-count-mismatch = Esap áeá ekkewe index mi affat fán choiceInput pun úkúkún ekkewe index ese fich ngeni úkúkún ekkewe choice child.

pretzel-indices-count-mismatch = Esap áeá ekkewe index mi affat fán problem pun úkúkún ekkewe index ese fich ngeni úkúkún ekkewe problem child.

shuffle-indices-count-mismatch = Esap áeá ekkewe index mi affat fán shuffle pun úkúkún ekkewe index ese fich ngeni úkúkún ekkewe component.

indices-ignored-out-of-range = Esap áeá ekkewe index mi affat fán { $component } pun ekkóch index ra tou seni ewe úkúkún.

pretzel-indices-repeated = Esap áeá ekkewe index mi affat fán pretzel pun ekkóch index ra fis sefán.

pretzel-circuit-first-index = Esap áeá ekkewe index mi affat fán pretzel non circuit mode pun ewe áeúin index epwe 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Pwe `<{ $component }>` epwe angang ren string children, eew `type` attribute epwe affat.

invalid-type-defaulting-to-math = Ewe sókkun { $type } mi mwáál fán ewe { $component } component. Epwe eew me nein math, text, number, are boolean. A áeá math.

string-not-valid-component-to-arrange = Ewe string "{ $value }" esap eew component mi tongeni { $component }. Esap áeá.

## Types and variables

invalid-type-defaulting-to-number = Ewe sókkun { $type } mi mwáál, a áeá number.

invalid-variable-value = Ewe value án eew variable mi mwáál: `{ $value }`

## Variants

variant-index-must-be-number = Ewe variant index { $index } epwe eew number

variant-index-must-be-integer = Ewe variant index { $index } epwe eew integer

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` esaamwo fis fán úkúkún mi ffat. A siwini ekkewe width ngeni relative.

side-by-side-absolute-margins = `<{ $component }>` esaamwo fis fán úkúkún mi ffat. A siwini ekkewe margin ngeni relative.

side-by-side-no-block-child = `<{ $component }>` mi mwáál: epwe wor ánean eew block child.

## `<label>`

label-for-ignored-on-graphical = Ewe `for` attribute wóón eew `<label>` non graph ese áeá.

label-for-must-resolve-to-one = Ewe `for` attribute wóón `<label>` epwe tori chék eew component.

label-for-unresolved = Ewe `for` attribute wóón `<label>` ese tongeni tori eew component.

label-for-answer-with-authored-inputs = Ewe `for` attribute wóón `<label>` a weweiti eew `<answer>` mi wor an input mi makketiw; kopwe weweiti ewe input pwisin.

label-for-answer-without-input = Ewe `for` attribute wóón `<label>` a weweiti eew `<answer>` mi esap wor an input epwe iteni.

label-for-must-reference-input-or-answer = Ewe `for` attribute wóón `<label>` epwe weweiti eew input are eew answer.

## Accessibility

accessibility-short-description-or-decorative = Fán tongeni tori, `<{ $component }>` epwe wor an aweween mi mwochomwoch are epwe affat pwe a `decorative`.

accessibility-video-short-description = Fán tongeni tori, `<video>` epwe wor an aweween mi mwochomwoch.

accessibility-input-short-description-or-label = Fán tongeni tori, `<{ $component }>` epwe wor an aweween mi mwochomwoch are eew label.

accessibility-answer-input-short-description-or-label = Fán tongeni tori, eew `<answer>` mi fóri eew input epwe wor an aweween mi mwochomwoch are eew label.

accessibility-short-description-contains-math = Ekkewe aweween mi mwochomwoch resap wor math component usun `<{ $component }>`. Kopwe makkey ewe math ren kapas.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ese naf sokkonon fán kapasen asamwen ewe sópwun (dark mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; epwe ánean { $threshold }:1).
       *[other] { $colorName } ese naf sokkonon fán kapasen asamwen ewe sópwun ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; epwe ánean { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Esaamwo wor eew `<circle>` won { $count } poin nupwen ekkewe poin resap wor úkúkúner mi number.

circle-too-many-through-points = Ese tongeni aúkúkúú eew sáákun won mi nap seni 3 poin.

circle-overprescribed-radius-center-points = Ese tongeni aúkúkúú eew sáákun ren radius, center me through points mi affat meinisin.

circle-center-with-multiple-points = Ese tongeni aúkúkúú eew sáákun ren center mi affat won mi nap seni 1 poin.

circle-radius-too-small = Ese tongeni aúkúkúú eew sáákun: pun towauun ekkewe ruuw poin { $distance }, ewe radius { $radius } mi affat a kúkkún seni.

circle-radius-with-many-points = Ese tongeni fóri eew sáákun won mi nap seni ruuw poin ren eew radius mi affat.

circle-invalid-center-or-through-points = Ewe center are ekkewe through point án ewe sáákun mi mwáál.

circle-radius-center-with-multiple-points = Ese tongeni aúkúkúú radius án eew sáákun ren center mi affat won mi nap seni 1 poin.

circle-change-radius-non-numerical = Ese tongeni siwini radius án eew sáákun won poin mi esap number

circle-radius-with-points-non-numerical = Ese tongeni fóri eew sáákun won mi nap seni eew poin ren eew radius mi affat nupwen esap wor úkúkún mi number.

circle-change-center-non-numerical = Esaamwo wor siwinin center án eew sáákun won poin mi esap number.

## `<function>`

# A Chuukese noun does not change after a numeral, so the English's two nested
# selects would render four copies of one sentence. One form stands for all of
# them; the counts are still printed and still formatted.
function-domain-insufficient-dimensions = Ese naf úkúkún fánin ewe domain án ewe fanksin. Ewe domain a wor { $intervals } interval nge ewe fanksin a wor { $inputs } input.

function-domain-invalid-format = Napanapen ewe domain fánin ewe fanksin mi mwáál.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Esap áeá ewe maximum án ewe fanksin mi esap number.
        [minimum] Esap áeá ewe minimum án ewe fanksin mi esap number.
        [extremum] Esap áeá ewe extremum án ewe fanksin mi esap number.
        [point] Esap áeá ewe poin án ewe fanksin mi esap number.
        [slope] Esap áeá ewe sikóóp án ewe fanksin mi esap number.
       *[other] Esap áeá ewe { $type } án ewe fanksin mi esap number.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Esap áeá ewe maximum án ewe fanksin mi pwang.
        [minimum] Esap áeá ewe minimum án ewe fanksin mi pwang.
        [extremum] Esap áeá ewe extremum án ewe fanksin mi pwang.
        [point] Esap áeá ewe poin án ewe fanksin mi pwang.
       *[other] Esap áeá ewe { $type } án ewe fanksin mi pwang.
    }

function-points-too-close = Ewe fanksin a wor ruuw poin mi fókkun arap ngeni fengen. Ese tongeni ffata ewe fanksin.

function-iterates-input-output-mismatch = Ekkewe iterate án eew fanksin ra tongeni chék ika úkúkún ekkewe input a wewe ngeni úkúkún ekkewe output. Ei fanksin a wor { $inputs } input me { $outputs } output.

## `<sequence>`

sequence-invalid-length = Ánnapan ewe sequence mi mwáál.  Epwe eew integer mi esap tou fán zero.

sequence-invalid-step = Ewe step án ewe sequence mi mwáál.  Epwe eew number fán eew sequence mi { $type } sókkun.

sequence-invalid-endpoint-number = Ewe "{ $attribute }" án ewe number sequence mi mwáál.  Epwe eew number.

sequence-invalid-endpoint-letters = Ewe "{ $attribute }" án ewe letters sequence mi mwáál.  Epwe eew chufengenin mesen makkey.

sequence-invalid-endpoint = Ewe "{ $attribute }" án ewe sequence mi mwáál.

select-from-sequence-coprime-not-numbers = coprime ese áeá pun esap number mi fifini

select-from-sequence-coprime-with-exclude-combinations = coprime ese áeá pun excludeCombinations mi affat

## Resolving a `target`

target-not-found = Ewe target fán `<{ $source }>` mi mwáál: ese tongeni kúna ewe target.

target-state-variable-not-found = Ewe target fán `<{ $source }>` mi mwáál: ese tongeni kúna eew state variable itan "{ $property }" wóón eew `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Ekkewe variable án `<odeSystem>` repwe sókkoon seni ewe independent variable.

ode-system-duplicate-variable-names = Ese tongeni ffata ekkewe ODE RHS fanksin ren iten dependent variable mi fis sefán.

ode-system-rhs-function-error = Ese tongeni ffata ewe ODE RHS fanksin.  Mwáál non fférún ewe mathjs fanksin.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ese tongeni ffata eew angle nefinen { $count } nain

angle-invalid-through-point = Ewe poin non through án `<angle>` mi mwáál

parabola-vertex-too-many-points = Esaamwo wor eew paraapona mi wor vertex won mi nap seni 1 poin.

parabola-too-many-points = Esaamwo wor eew paraapona won mi nap seni 3 poin.

intersection-too-many-items = Esaamwo wor intersection fán mi nap seni ruuw mettóch

## Other math components

ionic-compound-not-two-ions = Esaamwo wor ionic compound fán mettóch mi esap ruuw ion.

ionic-compound-needs-cation-and-anion = Ionic compound a fis chék fán eew cation me eew anion.

solve-equations-cannot-evaluate = Ese tongeni ffata pwóónún ewe equation pun ese tongeni aúkúkúú ewe equation: { $equation }

math-operators-operand-number-required = Epwe affat eew operandNumber nupwen a angei eew math operand.

eigen-decomposition-failed = Ese tongeni aúkúkúú ekkewe eigenvalue án ewe matrix

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: ewe parameter { $parameters } ese nom non ewe pattern, iwe epwe chék fich ngeni eew pwang iteiten fansoun.
       *[other] `<matchesPattern>`: ekkewe parameter { $parameters } resap nom non ewe pattern, iwe repwe chék fich ngeni eew pwang iteiten fansoun.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ese tongeni weweiti grid="{ $grid }". Epwe none, medium, dense, are ruuw number mi nap seni zero mi mwii ren eew pwang, usun grid="1 0.5". Esap wor grid epwe makketiw.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` a osupwang ren eew fanksin mi wor { $expected ->
        [one] eew output, ewe slope y' wóón iteiten poin, usun `y - x`
       *[other] ruuw output, ewe pekitá wóón iteiten poin, usun `(y, -x)`
    }, nge ewe fanksin mi ngeni a wor { $found } output. { $alternative ->
        [none] Esap wor mettóch epwe makketiw.
       *[other] `<{ $alternative }>` ewe component fán ena fanksin. Esap wor mettóch epwe makketiw.
    }

field-function-attribute-ignored-with-child = Ewe `function` attribute ese áeá pun ewe fanksin a pwal nóm nong non ewe component; ewe mi nóm nong a áeá. Kopwe ngeni ewe fanksin non chék eew nefinen ekkena ruuw.

field-variables-ignored =
    `<{ $component }>`: ewe `variables` attribute a iteni ekkewe variable án eew expression mi makketiw nong non ewe component. { $reason ->
        [function-child] Ewe fanksin ikei a ngeni usun eew `<function>` child, iwe a pwisin iteni an kewe variable, iei mine `variables` ese áeá.
       *[no-expression] Esap wor ena expression ikei, iei mine `variables` ese áeá.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ese fis non ewe prefigure renderer; a áeá napanapen ewe right.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ese fis non ewe prefigure renderer; a áeá napanapen ewe top.

prefigure-invalid-axis-bounds = `<graph>`: ekkewe axis bounds mi mwáál fán ewe prefigure conversion; a áeá ewe bbox mi púsin fis (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: ewe width mi mwáál fán ewe prefigure conversion; a áeá ewe diagram width mi púsin fis 425.

prefigure-invalid-aspect-ratio = `<graph>`: ewe aspectRatio mi mwáál fán ewe prefigure conversion; a áeá ewe aspect ratio mi púsin fis 1.

prefigure-grid-spacing-too-fine = `<graph>`: ekkewe nain fetán ra fókkun arap ngeni fengen seni úkúkúnún ewe axis; resap makketiw non ewe prefigure renderer.

prefigure-annotations-not-rendered = `<graph>`: ekkewe annotation resap makketiw ika esap áeá ewe PreFigure renderer.

multiple-annotations-children = Chómmóng `<annotations>` children ra kúna non `<graph>`; meinisin resap áeá tiwenó ewe sáingoon.

## Referring to other components

copy-unrecognized-component-type = Ese tongeni extend are copy eew sókkun component mi esap silei: { $type }.

copy-prop-not-found = Ese tongeni kúna ewe prop { $property } wóón eew component mi { $component } sókkun

collect-no-source = Esap wor source mi kúna fán collect.

collect-invalid-component-type = Ese tongeni collect ekkewe component mi `<{ $component }>` sókkun pun eew sókkun component mi mwáál.

reference-index-unavailable = Ese tongeni weweiti ewe index `{ $reference }`

## `<callAction>`

component-action-unavailable = Ese tongeni kééri { $action } wóón ewe component `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Napanapen ewe data mi mwáál.  Ekkewe rooch resap wewe fengen ánnaper. Kúna non componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Iten koonom ra fis sefán non ewe data.  Kúna non componentIdx :{ $componentIdx }

data-frame-missing-column-name = A pwang eew iten koonom non ewe data.  Kúna non componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Eew award fánin ei answer a nónnóng wóón pwisin pwóónún ewe answer tag, iwe epwe efisi mettóch mi esap ffat.

answer-max-num-attempts-in-section-wide-check-work = Isetiwen `maxNumAttempts` wóón eew `<answer>` mi nóm non eew container mi wor `sectionWideCheckWork` ese wor fánien, pun ewe container a némeni úkúkún ekkewe sótun. Kopwe isetiw `maxNumAttempts` wóón ewe container.

nested-section-wide-check-work-max-num-attempts = Isetiwen `maxNumAttempts` wóón eew container mi wor `sectionWideCheckWork` mi nóm non pwal eew container mi wor `sectionWideCheckWork` ese wor fánien, pun ewe container mi nóm ekis a némeni úkúkún ekkewe sótun. Kopwe isetiw `maxNumAttempts` wóón ewe container mi nóm ekis.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Ewe { $attributes } attribute ese wor fánien ika esap affat symbolicEquality.
       *[other] Ekkewe { $attributes } attribute resap wor fánier ika esap affat symbolicEquality.
    }

answer-invalid-type = Ewe sókkun fán ewe answer mi mwáál: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Pun ewe component `<{ $component }>` esap wor itan, ese tongeni áeá fán eew module attribute

module-attribute-name-already-defined = Ewe component `<{ $component } name="{ $name }">` ese tongeni áeá usun eew attribute fán eew module pun ewe `<module>` component sókkun a fen wor an eew "{ $name }" attribute.

conditional-content-condition-ignored = Ewe attribute `condition` ese áeá wóón eew `<conditionalContent>` component mi wor an case are else children.

slider-markers-type-mismatch = Sókkun ekkewe marker ese fich ngeni sókkun ewe slider.

pretzel-problem-needs-statement-and-answer = Ewe pretzel mi mwáál: iteiten `<problem>` epwe wor an eew `<statement>` me eew `<answer>`.

pretzel-circuit-first-problem-distractor = Ewe pretzel mi mwáál: non mode="circuit", ewe áeúin `<problem>` esap tongeni eew distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Ewe value { $values } mi mwáál fán ewe attribute `{ $attribute }`; esap áeá.
       *[other] Ekkewe value { $values } mi mwáál fán ewe attribute `{ $attribute }`; resap áeá.
    }

attribute-must-be-references = Ewe value `{ $value }` mi mwáál fán ewe attribute `{ $attribute }`. Ewe attribute epwe fférún reference mi poputá ren eew `$`.

math-input-invalid-function-names = <mathInput>: esap áeá iten fanksin mi mwáál non { $attribute }: { $names }. Iteiten it epwe wor ánean ruuw mesen makkey (mesen makkey are hyphen); a tongeni pwal wor eew `|<mathspeak alternative>` mwirin.

## Building components from the source

component-type-invalid = Ewe sókkun component mi mwáál: `<{ $componentType }>`

attribute-repeated = Ese tongeni fis sefán ewe attribute { $attribute }.

attribute-invalid-for-component = Ewe attribute "{ $attribute }" mi mwáál fán eew component mi `<{ $componentType }>` sókkun.

## Style definition contrast

style-definition-insufficient-contrast =
    Ewe style definition { $styleNumber } ese naf sokkonon fán { $context ->
        [text-on-background] mesan ewe kapas ngeni mesan ewe mwúrin
        [high-contrast] ewe mesan high-contrast ngeni ewe canvas
        [line] mesan ewe nain ngeni ewe canvas
        [marker] mesan ewe marker ngeni ewe canvas
       *[text-on-canvas] mesan ewe kapas ngeni ewe canvas
    }{ $mode ->
        [dark] { " (dark mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; epwe ánean { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Inaamwo ika ewe style definition { $styleNumber } a affata mesan mi naf sokkonon fán light mode, nge ekkewe mesan fán dark mode mi feiseni ekkena resap naf sokkonon fán mesan ewe kapas ngeni mesan ewe mwúrin ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; epwe ánean { $threshold }:1). { $suggestion ->
        [available] Pwe epwe naf sokkonon fán dark mode, kopwe achchapa sokkonon fán light mode (usun, isetiw { $lightAttribute }="{ $lightColor }") are kopwe siwini ewe mesan fán dark mode (usun, isetiw { $darkAttribute }="{ $darkColor }").
       *[none] Pwe epwe naf sokkonon fán dark mode, kopwe achchapa sokkonon fán light mode are kopwe siwini ekkewe mesan mi feiseni ekkena ren textColorDarkMode me/are backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Inaamwo ika ewe style definition { $styleNumber } a affata mesan ewe kapas mi naf sokkonon fán light mode, nge ewe mesan ewe kapas fán dark mode mi feiseni ena ese naf sokkonon ngeni ewe canvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; epwe ánean { $threshold }:1). { $suggestion ->
        [available] Pwe epwe naf sokkonon fán dark mode, kopwe achchapa sokkonon fán light mode (usun, isetiw textColor="{ $lightColor }") are kopwe siwini ewe mesan fán dark mode (usun, isetiw textColorDarkMode="{ $darkColor }").
       *[none] Pwe epwe naf sokkonon fán dark mode, kopwe achchapa sokkonon fán light mode are kopwe siwini ewe mesan mi feiseni ena ren textColorDarkMode.
    }

section-multiple-style-palettes = Eew sópwun a tongeni fini chék eew <stylePalette>; a áeá ewe sáingoon.

## Unique variants

variant-num-to-select-not-non-negative-integer = ese tongeni ffat ekkewe unique variant án { $component } pun numToSelect esap eew integer mi esap tou fán zero.

variant-num-to-select-not-constant-number = ese tongeni ffat ekkewe unique variant án { $component } pun numToSelect esap eew number mi esap siwin.

variant-with-replacement-not-constant-boolean = ese tongeni ffat ekkewe unique variant án { $component } pun withReplacement esap eew boolean mi esap siwin.

variant-select-weight-disables-unique = Ekkewe unique variant fán select resap fis ika mi wor eew option mi wor selectWeight are selectForVariants

variant-coprime-undetermined = ese tongeni ffat ekkewe unique variant án { $component } pun ese tongeni ffat pwe coprime epwe chofona iteiten fansoun.

variant-attribute-not-constant = ese tongeni ffat ekkewe unique variant án { $component } pun { $attribute } esap mettóch mi esap siwin.

variant-attribute-not-number = ese tongeni ffat ekkewe unique variant án { $component } pun { $attribute } esap eew number.

variant-attribute-wrong-type-for-sequence =
    ese tongeni ffat ekkewe unique variant án { $component } mi { $type } sókkun pun { $attribute } esap { $expected ->
        [letters-combination] eew chufengenin mesen makkey
        [math-expression] eew math expression mi pwúng
        [integer] eew integer
       *[number] eew number
    }.

variant-length-not-integer = ese tongeni ffat ekkewe unique variant án { $component } pun ánnapan esap eew integer.

variant-sort-not-implemented = esaamwo wor unique variant án eew { $component } mi wor sort

variant-exclude-combinations-not-implemented = esaamwo wor unique variant án eew { $component } mi wor excludeCombinations

variant-math-exclude-not-implemented = esaamwo wor unique variant án eew { $component } mi math sókkun mi wor exclude

variant-non-constant-exclude-not-implemented = esaamwo wor unique variant án eew { $component } mi wor eew exclude mi siwin

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ese fis non ewe graph prefigure renderer; esap áeá ewe descendant.

prefigure-descendant-invalid-geometry = { $subject }: napanapan esap unus are esap wor sópwan; esap áeá ewe descendant.

prefigure-curve-label-omitted = { $subject }: ekkewe label resap fis wóón ekkewe curve element mi siwin; esap áeá ewe label.

prefigure-curve-unsupported-definition-type = { $subject }: ese fis ewe sókkun curve function definition '{ $definitionType }'; esap áeá ewe descendant.

prefigure-region-flip-functions-unsupported = { $subject }: ese fis ewe flipFunctions attribute wóón regionBetweenCurves; esap áeá ewe descendant.

prefigure-region-non-formula-child = { $subject }: chék ekkewe child function mi formula sókkun ra fis wóón regionBetweenCurves; esap áeá ewe descendant.

prefigure-label-position-unsupported =
    { $subject }: ese fis ewe labelPosition '{ $labelPosition }' fán { $labelKind ->
        [line-family] eew label án ewe nain family
       *[point] eew label án eew poin
    }; a áeá ewe alignment mi púsin fis án PreFigure.

prefigure-fill-style-unsupported = { $subject }: ewe fill style '{ $fillStyle }' ese fis non PreFigure; a áeá eew fill mi unus.

prefigure-line-style-unknown = { $subject }: ewe line style '{ $lineStyle }' mi esap silei, iwe esap nóm non ewe PreFigure output.

prefigure-marker-style-mapped-to-diamond = { $subject }: ewe marker style '{ $markerStyle }' a siwin ngeni ewe PreFigure style 'diamond'.

prefigure-marker-style-unsupported = { $subject }: ewe marker style '{ $markerStyle }' ese fis non PreFigure; a áeá ewe style mi púsin fis.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ewe `ref` mi mwáál; ese tongeni kúna ewe target. Esap áeá ewe annotation.

annotation-ref-multiple-targets = `<annotation>`: ewe `ref` a tori chómmóng target; a áeá ewe áeúin.

annotation-ref-outside-graph = `<annotation>`: ewe `ref` mi mwáál; ewe target a nóm ekis seni ewe graph mi angeeni. Esap áeá ewe annotation.

annotation-ref-unsupported-target = `<annotation>`: ewe `ref` mi mwáál; ewe target esap eew mettóch mi fis non ewe prefigure conversion. Esap áeá ewe annotation.

annotation-text-missing = `<annotation>`: a pwang are esap wor ewe `text`; a makketiw eew text mi pwang.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] A kúna eew nónnóngún mi wirimwir.
       *[other] A kúna eew nónnóngún mi wirimwir mi weweiti eew `<{ $componentType }>` component.
    }

reference-no-referent = Esap wor mettóch mi kúna fán ei reference: `{ $reference }`

reference-multiple-referents = Chómmóng mettóch ra kúna fán ei reference: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Napanapen ewe attribute { $attribute } án `<{ $componentType }>` mi mwáál.

children-invalid = Ekkewe children án `<{ $componentType }>` mi mwáál: A kúna children mi mwáál: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ewe value `{ $value }` mi mwáál fán ewe attribute `{ $attribute }`, a áeá ewe value `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Ese kúna ewe DoenetML sókkun { $version }.
       *[other] Ese kúna ewe DoenetML sókkun { $version }. A áeá ewe sókkun { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML mi mwáál: { $content }

parse-tag-missing-close-tag = DoenetML mi mwáál: Ewe tag `{ $tag }` esap wor an tag epwe eppino. Epwe eew tag mi pwisin eppino are eew `</{ $tagName }>` tag.

parse-tag-error = DoenetML mi mwáál: Mwáál non ewe tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML mi mwáál: Ewe attribute `{ $attribute }` mi mwáál, a usun ita a pwang an value.

parse-attribute-invalid = DoenetML mi mwáál: Ewe attribute `{ $attribute }` mi mwáál

parse-attribute-value-invalid = DoenetML mi mwáál: Ewe attribute value `{ $value }` mi mwáál

parse-attribute-value-quote-mismatch = DoenetML mi mwáál: Ewe attribute value `{ $value }` mi mwáál. Ekkewe quote mark resap fich fengen. A usun ita a pwang eew `{ $quote }`

parse-open-tag-name-missing = DoenetML mi mwáál: A kúna eew tag mi esap wor itan, usun `<`

parse-tag-not-closed = DoenetML mi mwáál: Ewe tag `{ $tag }` ese eppino (a usun ita a pwang eew `>`).

parse-self-closing-tag-name-missing = DoenetML mi mwáál: A kúna eew tag mi esap wor itan `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML mi mwáál: Ewe tag `{ $tag }` ese eppino (a usun ita a pwang eew `/>`).

parse-tag-invalid-attributes = DoenetML mi mwáál: Ewe tag `{ $tag }` mi mwáál. A tongeni pwe ekkewe attribute ra mwáál.

parse-close-tag-name-missing = DoenetML mi mwáál: A kúna eew closing tag mi esap wor itan, usun `</`

parse-attribute-value-unquoted = Ekkewe attribute value epwe nóm nefinen quote: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML mi mwáál: A kúna ewe closing tag `{ $tag }`, nge esap wor ewe opening tag mi fich ngeni

parse-close-tag-mismatched = DoenetML mi mwáál: Ewe closing tag ese fich. Epwe `</{ $expected }>`. A kúna `{ $found }`

parser-node-unconvertible = Ese tongeni siwini ewe node { $node } ngeni eew Dast node.

## Names

name-attribute-invalid =
    Ewe attribute name='{ $name }' mi mwáál. { $reason ->
        [characters] Eew it epwe wor chék mesen makkey, number, underscore are hyphen.
       *[start] Eew it epwe poputá ren eew mesen makkey.
    }

component-name-invalid-start = Iten component mi mwáál "{ $name }". Eew it epwe poputá ren eew mesen makkey.

## `<answer>` sugar

answer-video-watched-missing-video = Eew answer mi wor sókkun videoWatched epwe wor an eew video attribute

answer-video-watched-video-not-reference = Eew answer mi wor sókkun videoWatched epwe wor an eew video attribute mi eew reference

answer-name-not-single-text = Ewe answer name attribute epwe wor an eew chék text child

## Referencing another document

external-doenetml-recursion-limit = Ese tongeni angei ewe DoenetML seni ekis pun úkúkúnún an wirimwir a fen chómmóng. A wor eew reference mi wirimwir?

external-doenetml-unavailable = Ese tongeni angei ewe DoenetML seni { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Ewe DoenetML mi angei seni { $attribute }="{ $uri }" mi mwáál: ese fich ngeni ewe component sókkun "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Ewe attribute `{ $from }` esap chiwen áeá; kopwe áeá `{ $to }`.
       *[other] [deprecation] Ewe attribute `{ $from }` wóón `<{ $component }>` esap chiwen áeá; kopwe áeá `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Ewe attribute `{ $from }` esap chiwen áeá me esap áeá pun `{ $to }` a pwal affat.
       *[other] [deprecation] Ewe attribute `{ $from }` wóón `<{ $component }>` esap chiwen áeá me esap áeá pun `{ $to }` a pwal affat.
    }

deprecated-attribute-ignored = [deprecation] Ewe attribute `{ $attribute }` wóón `<{ $component }>` esap chiwen áeá me esap áeá.

deprecated-attribute-to-child = [deprecation] Ewe attribute `{ $attribute }` wóón `<{ $component }>` esap chiwen áeá; kopwe áeá eew `<{ $child }>` child.

deprecated-attribute-value-renamed = [deprecation] Ewe value `{ $value }` án ewe attribute `{ $attribute }` wóón `<{ $component }>` esap chiwen áeá; kopwe áeá `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` a tongeni chék achchómmónga kapasen Ingiris, iei mine an kapas esap siwin non eew taropwe mi makketiw non { $locale }. Kopwe makkey ewe plural form pwisin, are kopwe isetiw ren ewe `pluralForm` attribute.


## Checking against the schema

schema-element-unrecognized = Ewe element `<{ $tag }>` esap eew Doenet element mi silei.

schema-element-not-allowed-at-root = Ewe element `<{ $tag }>` esap tongeni nóm wóón asamwen ewe taropwe.

schema-element-not-allowed-inside = Ewe element `<{ $tag }>` esap tongeni nóm nong non `<{ $parent }>`.

schema-attribute-unrecognized = Ewe element `<{ $tag }>` esap wor an attribute itan `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Ewe attribute `{ $attribute }` án ewe element `<{ $tag }>` epwe eew list mi iteiten mettóch non a eew me nein: { $allowed }
       *[other] Ewe attribute `{ $attribute }` án ewe element `<{ $tag }>` epwe eew me nein: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Iten variant mi mwáál fán select.  Ewe iten variant { $variantName } a nóm non { $numOptions } option nge úkúkún epwe fifini { $numToSelect }.

select-variant-name-without-options = Ekkóch variant ra affat fán select nge esap wor option mi affat fán ei iten variant mi tongeni: { $variantName }.

select-variant-name-not-possible = Ewe iten variant { $variantName } mi affat fán select esap eew iten variant mi tongeni.

select-too-few-options = Ese tongeni fini { $numToSelect } component seni chék { $numOptions }.

select-from-sequence-too-few-values = Ese tongeni fini { $numToSelect } value seni eew sequence mi { $length } ánnapan.

select-from-sequence-indices-count-mismatch = Úkúkún ekkewe index mi affat fán select epwe fich ngeni úkúkún epwe fifini

select-from-sequence-indices-not-integers = Ekkewe index meinisin mi affat fán select repwe integer

select-from-sequence-index-excluded = Ewe index mi affat án selectfromsequence a fen tou

select-from-sequence-indices-excluded-combination = Ekkewe index mi affat án selectfromsequence eew chufengen mi fen tou

select-from-sequence-coprime-not-positive-integers = Ese tongeni fini chufengenin coprime pun esap fifini integer mi nap seni zero.

select-from-sequence-coprime-common-factor = Ese tongeni fini number mi coprime. Ekkewe value meinisin mi tongeni ra fiti eew factor. (Ekkewe value mi affat fán "from" are "to" repwe coprime ngeni "step".)

select-from-sequence-coprime-single-number = Ese tongeni fini chufengenin coprime seni eew chék number mi esap 1.

select-from-sequence-excluded-too-many-combinations = A tou mi nap seni 70% ekkewe chufengen non selectFromSequence

select-from-sequence-coprime-none-found = Ese tongeni fini number mi coprime. Ekkewe value meinisin mi tongeni ra fiti eew factor.

select-from-sequence-too-few-unique-values = Ese tongeni fini { $numToSelect } value mi sókkoon seni eew sequence mi { $numPossibleValues } ánnapan

select-prime-numbers-too-few-values = Ese tongeni fini { $numToSelect } value seni eew listen prime mi { $numValues } ánnapan

select-prime-numbers-values-count-mismatch = Úkúkún ekkewe value mi affat fán select epwe fich ngeni úkúkún epwe fifini

select-prime-numbers-values-not-prime = Ekkewe value meinisin mi affat fán select prime number repwe nóm non ewe listen prime

select-prime-numbers-values-excluded-combination = Ekkewe value mi affat án selectPrimeNumbers eew chufengen mi fen tou

select-prime-numbers-excluded-too-many-combinations = A tou mi nap seni 70% ekkewe chufengen non selectPrimeNumbers

select-random-combination-fluke = Ren eew mettóch mi fókkun weires an epwe fis, ese tongeni fini eew chufengenin value mi fifini fitiw

select-random-value-fluke = Ren eew mettóch mi fókkun weires an epwe fis, ese tongeni fini eew value mi fifini fitiw

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` esap makketiw nong non ewe math; ewe expression a makketiw usun me mwen án ekkewe input repwe tongeni nóm nong. { $reason ->
        [not-inline] Chék eew choice input mi `inline` a tongeni nóm nong non eew expression; ika esap `inline`, eew pwúkúnún pwoos.
        [expanded] Eew text input mi `expanded` eew pwoos mi chómmóng nain, iwe a wattee seni pwe epwe nóm nong non eew expression.
        [on-graph] Wóón eew graph ewe expression a makketiw usun eew chék sasing, iwe esap wor nenien eew control.
       *[relative-width] Ewe `width` mi relative (eew percent are `em`), iwe esap wor mettóch epwe aúkúkúú ren nong non eew expression. Kopwe ngeni ewe width ren úkúkún mi ffat, usun `px`.
    }
