# Hausa diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# Hausa counts in two plural categories, but a noun after a numeral stays
# singular and the passive «ana yin watsi da …» does not change shape for
# number, so a countable message here reads the same in both branches and the
# select is dropped rather than written out twice identically.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = ana yin watsi da { $attributes } idan an bayyana digo biyu na ƙarshe

line-segment-attributes-ignored-with-endpoint-and-midpoint = ana yin watsi da { $attributes } idan an bayyana digon ƙarshe da digon tsakiya duka biyu

line-segment-midpoint-offset-without-midpoint = midpointOffset ba shi da tasiri ba tare da digon tsakiya ba

## `<line>`

line-points-undetermined-dimensions = Layi yana bi ta digogi waɗanda ba a san girmansu ba.

line-points-too-few-dimensions = Dole layi ya bi ta digogi masu girma aƙalla biyu.

line-points-depend-on-variables = Layi yana bi ta digogi waɗanda suka dogara da masu canji: { $variables }.

line-equation-invalid-format = Tsari mara inganci na daidaitaccen layi a masu canji { $variable1 } da { $variable2 }.

## `<ray>`

ray-overprescribed-through = An bayyana layin haske da through, endpoint da direction gaba ɗaya. Ana yin watsi da through da aka bayyana.

ray-dimension-mismatch = numDimensions bai dace ba a layin haske.

## `<vector>`

vector-overprescribed-head = An bayyana vekta da head, tail da displacement gaba ɗaya. Ana yin watsi da head da aka bayyana.

vector-dimension-mismatch = numDimensions bai dace ba a vekta.

## Attracting and constraining

attract-to-without-nearest-point = Ba za a iya jawowa zuwa `<{ $component }>` ba domin ba ta da mai canjin yanayi mai suna nearestPoint.

constrain-to-without-nearest-point = Ba za a iya iyakancewa zuwa `<{ $component }>` ba domin ba ta da mai canjin yanayi mai suna nearestPoint.

constrain-to-interior-without-nearest-point = Ba za a iya iyakancewa cikin `<{ $component }>` ba domin ba ta da mai canjin yanayi mai suna nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = ana yin watsi da labelPosition ga choiceInput da ba ta cikin layi ɗaya ba

## Ordering children by index

choice-input-indices-count-mismatch = Ana yin watsi da lambobin da aka bayyana ga choiceInput domin adadinsu bai dace da adadin 'ya'yan choice ba.

pretzel-indices-count-mismatch = Ana yin watsi da lambobin da aka bayyana ga problem domin adadinsu bai dace da adadin 'ya'yan problem ba.

shuffle-indices-count-mismatch = Ana yin watsi da lambobin da aka bayyana ga shuffle domin adadinsu bai dace da adadin sassa ba.

indices-ignored-out-of-range = Ana yin watsi da lambobin da aka bayyana ga { $component } domin wasu suna wajen iyaka.

pretzel-indices-repeated = Ana yin watsi da lambobin da aka bayyana ga pretzel domin an maimaita wasu.

pretzel-circuit-first-index = Ana yin watsi da lambobin da aka bayyana ga pretzel a yanayin circuit domin dole lamba ta farko ta zama 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Domin `<{ $component }>` ta yi aiki da 'ya'yan nau'in string, dole a bayyana sifar `type`.

invalid-type-defaulting-to-math = type { $type } bai inganta ba ga sashin { $component }. Dole ta zama ɗaya daga cikin math, text, number ko boolean. Ana saita ta zuwa math.

string-not-valid-component-to-arrange = String "{ $value }" ba sashe ne mai inganci na { $component } ba. Ana yin watsi da shi.

## Types and variables

invalid-type-defaulting-to-number = type { $type } bai inganta ba, ana saita type zuwa number.

invalid-variable-value = Ƙimar mai canji mara inganci: `{ $value }`

## Variants

variant-index-must-be-number = Dole lambar nau'i { $index } ta zama lamba

variant-index-must-be-integer = Dole lambar nau'i { $index } ta zama cikakkiyar lamba

## `<sideBySide>`

side-by-side-absolute-widths = Ba a aiwatar da `<{ $component }>` ga cikakkun ma'auni ba. Ana saita fadi zuwa na kwatanci.

side-by-side-absolute-margins = Ba a aiwatar da `<{ $component }>` ga cikakkun ma'auni ba. Ana saita gefe zuwa na kwatanci.

side-by-side-no-block-child = `<{ $component }>` mara inganci: dole ta kasance da aƙalla ɗa ɗaya na nau'in bulo.

## `<label>`

label-for-ignored-on-graphical = Ana yin watsi da sifar `for` a kan `<label>` na zane.

label-for-must-resolve-to-one = Dole sifar `for` a kan `<label>` ta nuna sashe ɗaya kaɗai.

label-for-unresolved = Ba a iya tantance sifar `for` a kan `<label>` zuwa wani sashe ba.

label-for-answer-with-authored-inputs = Sifar `for` a kan `<label>` tana nuni ga `<answer>` mai shigarwa da aka rubuta a fili; a yi nuni ga shigarwar kai tsaye.

label-for-answer-without-input = Sifar `for` a kan `<label>` tana nuni ga `<answer>` marar shigarwa da za a yi wa lakabi.

label-for-must-reference-input-or-answer = Dole sifar `for` a kan `<label>` ta yi nuni ga shigarwa ko amsa.

## Accessibility

accessibility-short-description-or-decorative = Domin samun dama, dole `<{ $component }>` ta kasance da taƙaitaccen bayani ko a bayyana ta a matsayin ta ado.

accessibility-video-short-description = Domin samun dama, dole `<video>` ta kasance da taƙaitaccen bayani.

accessibility-input-short-description-or-label = Domin samun dama, dole `<{ $component }>` ta kasance da taƙaitaccen bayani ko lakabi.

accessibility-answer-input-short-description-or-label = Domin samun dama, dole `<answer>` da ke ƙirƙirar shigarwa ta kasance da taƙaitaccen bayani ko lakabi.

accessibility-short-description-contains-math = Taƙaitattun bayanai bai kamata su ƙunshi sassan lissafi kamar `<{ $component }>` ba. A rubuta duk wani lissafi da kalmomi.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } tana da bambanci mara isa ga rubutun kan babi (yanayin duhu) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ana buƙatar aƙalla { $threshold }:1).
       *[other] { $colorName } tana da bambanci mara isa ga rubutun kan babi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ana buƙatar aƙalla { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Ba a aiwatar da `<circle>` mai bi ta digogi { $count } ba idan digogin ba su da ƙimar lamba.

circle-too-many-through-points = Ba za a iya lissafa da'ira mai bi ta digogi fiye da 3 ba.

circle-overprescribed-radius-center-points = Ba za a iya lissafa da'ira mai radius, tsakiya da digogin bi duka an bayyana su ba.

circle-center-with-multiple-points = Ba za a iya lissafa da'ira mai tsakiyar da aka bayyana mai bi ta digo fiye da 1 ba.

circle-radius-too-small = Ba za a iya lissafa da'ira ba: tunda tazara tsakanin digogin biyu ita ce { $distance }, radius { $radius } da aka bayyana ya yi ƙanƙanta.

circle-radius-with-many-points = Ba za a iya ƙirƙirar da'ira mai bi ta digogi fiye da biyu tare da radius da aka bayyana ba.

circle-invalid-center-or-through-points = Tsakiya ko digogin bi na da'ira ba su inganta ba.

circle-radius-center-with-multiple-points = Ba za a iya lissafa radius na da'ira mai tsakiyar da aka bayyana mai bi ta digo fiye da 1 ba.

circle-change-radius-non-numerical = Ba za a iya canza radius na da'ira mai bi ta digogi marasa ƙimar lamba ba

circle-radius-with-points-non-numerical = Ba za a iya ƙirƙirar da'ira mai bi ta digo fiye da ɗaya tare da radius da aka bayyana idan babu ƙimar lamba ba.

circle-change-center-non-numerical = Ba a aiwatar da canza tsakiyar da'ira mai bi ta digogi marasa ƙimar lamba ba.

## `<function>`

function-domain-insufficient-dimensions = Girman yankin aiki bai isa ba. Yankin yana da tazara { $intervals } amma aikin yana da shigarwa { $inputs }.

function-domain-invalid-format = Tsarin yankin aiki bai inganta ba.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ana yin watsi da mafi girman ƙimar aiki wadda ba lamba ba ce.
        [minimum] Ana yin watsi da mafi ƙanƙantar ƙimar aiki wadda ba lamba ba ce.
        [extremum] Ana yin watsi da ƙimar iyaka ta aiki wadda ba lamba ba ce.
        [point] Ana yin watsi da digon aiki wanda ba lamba ba ne.
        [slope] Ana yin watsi da gangaren aiki wanda ba lamba ba ne.
       *[other] Ana yin watsi da { $type } na aiki wanda ba lamba ba ne.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ana yin watsi da mafi girman ƙimar aiki wadda babu komai a ciki.
        [minimum] Ana yin watsi da mafi ƙanƙantar ƙimar aiki wadda babu komai a ciki.
        [extremum] Ana yin watsi da ƙimar iyaka ta aiki wadda babu komai a ciki.
        [point] Ana yin watsi da digon aiki wanda babu komai a ciki.
       *[other] Ana yin watsi da { $type } na aiki wanda babu komai a ciki.
    }

function-points-too-close = Aikin yana da digogi biyu masu kusa da juna sosai. Ba za a iya bayyana aikin ba.

function-iterates-input-output-mismatch = Maimaita aiki yana yiwuwa ne kawai idan adadin shigarwa ya yi daidai da adadin fitarwa. Wannan aikin yana da shigarwa { $inputs } da fitarwa { $outputs }.

## `<sequence>`

sequence-invalid-length = Tsawon jerin bai inganta ba. Dole ya zama cikakkiyar lamba wadda ba ta ƙasa da sifili ba.

sequence-invalid-step = Matakin jerin bai inganta ba. Dole ya zama lamba ga jerin nau'in { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" na jerin lambobi bai inganta ba. Dole ya zama lamba.

sequence-invalid-endpoint-letters = "{ $attribute }" na jerin haruffa bai inganta ba. Dole ya zama haɗin haruffa.

sequence-invalid-endpoint = "{ $attribute }" na jerin bai inganta ba.

select-from-sequence-coprime-not-numbers = ana yin watsi da coprime domin ba lambobi ake zaɓa ba

select-from-sequence-coprime-with-exclude-combinations = ana yin watsi da coprime domin an bayyana excludeCombinations

## Resolving a `target`

target-not-found = target mara inganci ga `<{ $source }>`: ba a sami abin da ake nufi ba.

target-state-variable-not-found = target mara inganci ga `<{ $source }>`: ba a sami mai canjin yanayi mai suna "{ $property }" a kan `<{ $component }>` ba.

## `<odeSystem>`

ode-system-variables-match-independent = Dole masu canjin `<odeSystem>` su bambanta da mai canji mai zaman kansa.

ode-system-duplicate-variable-names = Ba za a iya bayyana ayyukan ODE RHS masu sunayen masu canji masu dogaro da aka maimaita ba.

ode-system-rhs-function-error = Ba za a iya bayyana aikin ODE RHS ba. An sami kuskure wajen ƙirƙirar aikin mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ba za a iya bayyana kusurwa tsakanin layuka { $count } ba

angle-invalid-through-point = Digo mara inganci a cikin through na `<angle>`

parabola-vertex-too-many-points = Ba a aiwatar da parabola mai ƙwanƙwan da ke bi ta digo fiye da 1 ba.

parabola-too-many-points = Ba a aiwatar da parabola mai bi ta digogi fiye da 3 ba.

intersection-too-many-items = Ba a aiwatar da haɗuwar abubuwa fiye da biyu ba

## Other math components

ionic-compound-not-two-ions = Ba a aiwatar da haɗin ayon ga wani abu banda ayon guda biyu ba.

ionic-compound-needs-cation-and-anion = An aiwatar da haɗin ayon ga cation guda ɗaya da anion guda ɗaya kawai.

solve-equations-cannot-evaluate = Ba za a iya warware daidaituwa ba domin ba a iya tantance ta ba: { $equation }

math-operators-operand-number-required = Dole a bayyana operandNumber lokacin fitar da operand na lissafi.

eigen-decomposition-failed = Ba a iya lissafa eigenvalue na matrix ba

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: parameter { $parameters } ba ya bayyana a cikin tsarin, don haka koyaushe zai dace da fili.

## `<graph>`

graph-grid-invalid = `<graph>`: ba a iya fahimtar grid="{ $grid }" ba. Dole ta zama none, medium, dense, ko lambobi biyu masu kyau da aka raba da fili, kamar grid="1 0.5". Ba a zana grid ba.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: ba a tallafa wa xLabelPosition="left" a mai nunawa na prefigure ba; ana amfani da halin matsayin dama.

prefigure-y-label-position-unsupported = `<graph>`: ba a tallafa wa yLabelPosition="bottom" a mai nunawa na prefigure ba; ana amfani da halin matsayin sama.

prefigure-invalid-axis-bounds = `<graph>`: iyakokin axis ba su inganta ba ga jujjuyawar prefigure; ana amfani da bbox na asali (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: fadi bai inganta ba ga jujjuyawar prefigure; ana amfani da fadin zane na asali 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio bai inganta ba ga jujjuyawar prefigure; ana amfani da rabon asali 1.

prefigure-grid-spacing-too-fine = `<graph>`: tazarar grid ta yi ƙanƙanta sosai ga iyakokin axis; an bar grid a mai nunawa na prefigure.

prefigure-annotations-not-rendered = `<graph>`: ba za a nuna bayanan ƙarawa ba idan ba a yi amfani da mai nunawa na PreFigure ba.

multiple-annotations-children = An sami 'ya'yan `<annotations>` da yawa a cikin `<graph>`; ana yin watsi da dukkansu banda na ƙarshe.

## Referring to other components

copy-unrecognized-component-type = Ba za a iya faɗaɗa ko kwafa nau'in sashe da ba a sani ba: { $type }.

copy-prop-not-found = Ba a sami sifar { $property } a kan sashe na nau'in { $component } ba

collect-no-source = Ba a sami tushe ga collect ba.

collect-invalid-component-type = Ba za a iya tattara sassan nau'in `<{ $component }>` ba domin nau'in sashe ne mara inganci.

reference-index-unavailable = Ba za a iya yin nuni ga lambar `{ $reference }` ba

## `<callAction>`

component-action-unavailable = Ba za a iya kiran { $action } a kan sashin `{ $reference }` ba

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Siffar bayanai ba ta inganta ba. Jeri suna da tsayi mabambanta. An same shi a componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Bayanai suna da sunayen ginshiƙai da aka maimaita. An same shi a componentIdx :{ $componentIdx }

data-frame-missing-column-name = Bayanai sun rasa sunan ginshiƙi. An same shi a componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award na wannan amsa ya dogara ne a kan amsar da tag ɗin answer da kansa ya aika, wanda zai haifar da hali da ba a tsammani ba.

answer-max-num-attempts-in-section-wide-check-work = Saita `maxNumAttempts` a kan `<answer>` da ke cikin akwati mai `sectionWideCheckWork` ba shi da tasiri, domin akwatin ne ke sarrafa adadin yunƙuri. A saita `maxNumAttempts` a kan akwatin maimakon haka.

nested-section-wide-check-work-max-num-attempts = Saita `maxNumAttempts` a kan akwati mai `sectionWideCheckWork` da ke cikin wani akwati mai `sectionWideCheckWork` ba shi da tasiri, domin akwatin waje ne ke sarrafa adadin yunƙuri. A saita `maxNumAttempts` a kan akwatin waje maimakon haka.

answer-attributes-need-symbolic-equality = Sifofin { $attributes } ba za su yi tasiri ba idan ba a saita symbolicEquality ba.

answer-invalid-type = Nau'i mara inganci ga amsa: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Tunda sashin `<{ $component }>` ba shi da suna, ba za a iya amfani da shi a matsayin sifar module ba

module-attribute-name-already-defined = Ba za a iya amfani da sashin `<{ $component } name="{ $name }">` a matsayin sifar module ba domin nau'in sashe `<module>` ya riga ya kasance da sifa mai suna "{ $name }".

conditional-content-condition-ignored = Ana yin watsi da sifar `condition` a kan sashin `<conditionalContent>` mai 'ya'yan case ko else.

slider-markers-type-mismatch = Nau'in alamomi bai dace da nau'in slider ba.

pretzel-problem-needs-statement-and-answer = pretzel mara inganci: dole kowace `<problem>` ta ƙunshi `<statement>` guda ɗaya da `<answer>` guda ɗaya.

pretzel-circuit-first-problem-distractor = pretzel mara inganci: a mode="circuit", `<problem>` ta farko ba za ta iya zama ta ɓatarwa ba.

## Attribute values

attribute-invalid-values = Ƙimar { $values } ba ta inganta ba ga sifar `{ $attribute }`; ana yin watsi da ita.

attribute-must-be-references = Ƙimar `{ $value }` ba ta inganta ba ga sifar `{ $attribute }`. Dole a gina sifar da nassoshi da ke farawa da `$`.

math-input-invalid-function-names = <mathInput>: ana yin watsi da sunayen ayyuka marasa inganci a cikin { $attribute }: { $names }. Dole sashin nunawa na kowane suna ya kasance da aƙalla haruffa 2 (haruffa ko layukan haɗi); ana iya biye da ƙarin `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Nau'in sashe mara inganci: `<{ $componentType }>`

attribute-repeated = Ba za a iya maimaita sifar { $attribute } ba.

attribute-invalid-for-component = Sifar "{ $attribute }" ba ta inganta ba ga sashe na nau'in `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Bayyanar salo { $styleNumber } tana da bambanci mara isa ga { $context ->
        [text-on-background] launin rubutu idan aka kwatanta da launin bango
        [high-contrast] launin bambanci mai ƙarfi idan aka kwatanta da allo
        [line] launin layi idan aka kwatanta da allo
        [marker] launin alama idan aka kwatanta da allo
       *[text-on-canvas] launin rubutu idan aka kwatanta da allo
    }{ $mode ->
        [dark] { " (yanayin duhu)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ana buƙatar aƙalla { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Ko da yake bayyanar salo { $styleNumber } ta bayyana launuka masu isasshen bambanci ga yanayin haske, launukan yanayin duhu da aka samo daga gare su suna da bambanci mara isa tsakanin launin rubutu da launin bango ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ana buƙatar aƙalla { $threshold }:1). { $suggestion ->
        [available] Domin tabbatar da isasshen bambanci a yanayin duhu, a ƙara bambancin yanayin haske (misali a saita { $lightAttribute }="{ $lightColor }") ko a canza launin yanayin duhu (misali a saita { $darkAttribute }="{ $darkColor }").
       *[none] Domin tabbatar da isasshen bambanci a yanayin duhu, a ƙara bambancin yanayin haske ko a canza launukan da aka samo da textColorDarkMode da/ko backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ko da yake bayyanar salo { $styleNumber } ta bayyana launin rubutu mai isasshen bambanci ga yanayin haske, launin rubutu na yanayin duhu da aka samo daga gare shi yana da bambanci mara isa idan aka kwatanta da allo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ana buƙatar aƙalla { $threshold }:1). { $suggestion ->
        [available] Domin tabbatar da isasshen bambanci a yanayin duhu, a ƙara bambancin yanayin haske (misali a saita textColor="{ $lightColor }") ko a canza launin yanayin duhu (misali a saita textColorDarkMode="{ $darkColor }").
       *[none] Domin tabbatar da isasshen bambanci a yanayin duhu, a ƙara bambancin yanayin haske ko a canza launin da aka samo da textColorDarkMode.
    }

section-multiple-style-palettes = Babi zai iya zaɓar <stylePalette> guda ɗaya kawai; ana amfani da na ƙarshe.

## Unique variants

variant-num-to-select-not-non-negative-integer = ba za a iya tantance nau'ikan na musamman na { $component } ba domin numToSelect ba cikakkiyar lamba wadda ba ta ƙasa da sifili ba ce.

variant-num-to-select-not-constant-number = ba za a iya tantance nau'ikan na musamman na { $component } ba domin numToSelect ba lamba marar canzawa ba ce.

variant-with-replacement-not-constant-boolean = ba za a iya tantance nau'ikan na musamman na { $component } ba domin withReplacement ba boolean marar canzawa ba ce.

variant-select-weight-disables-unique = Ana kashe nau'ikan na musamman na select idan akwai zaɓi mai selectWeight ko selectForVariants da aka bayyana

variant-coprime-undetermined = ba za a iya tantance nau'ikan na musamman na { $component } ba domin ba za a iya tabbatar da cewa coprime koyaushe ƙarya ba ce.

variant-attribute-not-constant = ba za a iya tantance nau'ikan na musamman na { $component } ba domin { $attribute } ba abu marar canzawa ba ne.

variant-attribute-not-number = ba za a iya tantance nau'ikan na musamman na { $component } ba domin { $attribute } ba lamba ba ce.

variant-attribute-wrong-type-for-sequence =
    ba za a iya tantance nau'ikan na musamman na { $component } na nau'in { $type } ba domin { $attribute } ba { $expected ->
        [letters-combination] haɗin haruffa
        [math-expression] ingantaccen bayanin lissafi
        [integer] cikakkiyar lamba
       *[number] lamba
    } ba ce.

variant-length-not-integer = ba za a iya tantance nau'ikan na musamman na { $component } ba domin length ba cikakkiyar lamba ba ce.

variant-sort-not-implemented = ba a aiwatar da nau'ikan na musamman na { $component } mai sort ba

variant-exclude-combinations-not-implemented = ba a aiwatar da nau'ikan na musamman na { $component } mai excludeCombinations ba

variant-math-exclude-not-implemented = ba a aiwatar da nau'ikan na musamman na { $component } na nau'in math mai exclude ba

variant-non-constant-exclude-not-implemented = ba a aiwatar da nau'ikan na musamman na { $component } mai exclude mai canzawa ba

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ba a tallafa masa a mai nunawa na graph prefigure ba; an tsallake zuriyar.

prefigure-descendant-invalid-geometry = { $subject }: lissafin siffofi marar iyaka ko maras cika; an tsallake zuriyar.

prefigure-curve-label-omitted = { $subject }: ba a tallafa wa lakabi a kan sassan lanƙwasa da aka juyar ba; an bar lakabin.

prefigure-curve-unsupported-definition-type = { $subject }: ba a tallafa wa nau'in bayyanar aikin lanƙwasa '{ $definitionType }' ba; an tsallake zuriyar.

prefigure-region-flip-functions-unsupported = { $subject }: ba a tallafa wa sifar flipFunctions a kan regionBetweenCurves ba; an tsallake zuriyar.

prefigure-region-non-formula-child = { $subject }: ana tallafa wa ayyukan 'ya'ya na nau'in formula kawai a kan regionBetweenCurves; an tsallake zuriyar.

prefigure-label-position-unsupported =
    { $subject }: ba a tallafa wa labelPosition '{ $labelPosition }' ga { $labelKind ->
        [line-family] lakabin dangin layi
       *[point] lakabin digo
    } ba; ana amfani da daidaitawar PreFigure ta asali.

prefigure-fill-style-unsupported = { $subject }: ba a tallafa wa salon cikawa '{ $fillStyle }' a PreFigure ba; ana koma wa cikawa mai ƙarfi.

prefigure-line-style-unknown = { $subject }: an bar salon layi wanda ba a sani ba '{ $lineStyle }' daga fitarwar PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: an juya salon alama '{ $markerStyle }' zuwa salon PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: ba a tallafa wa salon alama '{ $markerStyle }' a PreFigure ba; ana amfani da salon asali.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` mara inganci; ba za a iya tantance abin da ake nufi ba. An bar bayanin ƙarawa.

annotation-ref-multiple-targets = `<annotation>`: `ref` ta nuna abubuwa da yawa; ana amfani da na farko.

annotation-ref-outside-graph = `<annotation>`: `ref` mara inganci; abin da ake nufi yana wajen zanen da ya ƙunshe shi. An bar bayanin ƙarawa.

annotation-ref-unsupported-target = `<annotation>`: `ref` mara inganci; abin da ake nufi ba abu ne na zane da ake tallafa masa a jujjuyawar prefigure ba. An bar bayanin ƙarawa.

annotation-text-missing = `<annotation>`: `text` ta ɓace ko babu komai a ciki; ana fitar da rubutu maras komai.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] An gano dogaro mai zagaye.
       *[other] An gano dogaro mai zagaye da ya shafi sashin `<{ $componentType }>`.
    }

reference-no-referent = Ba a sami abin da ake nufi ba ga nassi: `{ $reference }`

reference-multiple-referents = An sami abubuwa da yawa da ake nufi ga nassi: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Tsari mara inganci ga sifar { $attribute } ta `<{ $componentType }>`.

children-invalid = 'Ya'ya marasa inganci ga `<{ $componentType }>`: an sami 'ya'ya marasa inganci: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ƙimar `{ $value }` ba ta inganta ba ga sifar `{ $attribute }`; ana amfani da ƙimar `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Ba a sami sigar DoenetML { $version } ba.
       *[other] Ba a sami sigar DoenetML { $version } ba. Ana koma wa siga { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML mara inganci: { $content }

parse-tag-missing-close-tag = DoenetML mara inganci: Tag ɗin `{ $tag }` ba shi da tag ɗin rufewa. Ana tsammanin tag mai rufe kansa ko tag ɗin `</{ $tagName }>`.

parse-tag-error = DoenetML mara inganci: Kuskure a tag ɗin `<{ $tagName }>`

parse-attribute-missing-value = DoenetML mara inganci: Sifar `{ $attribute }` mara inganci tana kama da wadda ta rasa ƙima.

parse-attribute-invalid = DoenetML mara inganci: Sifar `{ $attribute }` ba ta inganta ba

parse-attribute-value-invalid = DoenetML mara inganci: Ƙimar sifa `{ $value }` ba ta inganta ba

parse-attribute-value-quote-mismatch = DoenetML mara inganci: Ƙimar sifa `{ $value }` ba ta inganta ba. Alamomin ƙira ba su dace ba. Yana kama da an rasa `{ $quote }`

parse-open-tag-name-missing = DoenetML mara inganci: An sami tag maras sunan tag, misali `<`

parse-tag-not-closed = DoenetML mara inganci: Ba a rufe tag ɗin `{ $tag }` ba (yana kama da an rasa `>`).

parse-self-closing-tag-name-missing = DoenetML mara inganci: An sami tag maras sunan tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML mara inganci: Ba a rufe tag ɗin `{ $tag }` ba (yana kama da an rasa `/>`).

parse-tag-invalid-attributes = DoenetML mara inganci: Tag ɗin `{ $tag }` bai inganta ba. Wataƙila yana da sifofi marasa daidai.

parse-close-tag-name-missing = DoenetML mara inganci: An sami tag ɗin rufewa maras sunan tag, misali `</`

parse-attribute-value-unquoted = Dole a sanya ƙimomin sifa cikin alamomin ƙira: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML mara inganci: An sami tag ɗin rufewa `{ $tag }`, amma babu tag ɗin buɗewa da ya dace

parse-close-tag-mismatched = DoenetML mara inganci: Tag ɗin rufewa bai dace ba. Ana tsammanin `</{ $expected }>`. An sami `{ $found }`

parser-node-unconvertible = Ba a iya juyar da node { $node } zuwa node na Dast ba.

## Names

name-attribute-invalid =
    Sifar name='{ $name }' ba ta inganta ba. { $reason ->
        [characters] Sunaye za su iya ƙunsar haruffa, lambobi, layukan ƙasa ko layukan haɗi kawai.
       *[start] Dole sunaye su fara da harafi.
    }

component-name-invalid-start = Sunan sashe "{ $name }" bai inganta ba. Dole sunaye su fara da harafi.

## `<answer>` sugar

answer-video-watched-missing-video = Dole amsa ta nau'in videoWatched ta kasance da sifar video

answer-video-watched-video-not-reference = Dole amsa ta nau'in videoWatched ta kasance da sifar video wadda take nassi

answer-name-not-single-text = Dole sifar name ta amsa ta kasance da ɗan text guda ɗaya kawai

## Referencing another document

external-doenetml-recursion-limit = Ba za a iya samun DoenetML na waje ba saboda matakan maimaitawa da suka yi yawa. Shin akwai nassi mai zagaye?

external-doenetml-unavailable = Ba za a iya samun DoenetML daga { $attribute }="{ $uri }" ba

external-doenetml-type-mismatch = DoenetML da aka samu daga { $attribute }="{ $uri }" bai inganta ba: bai dace da nau'in sashe "{ $componentType }" ba

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Ba a ƙara amfani da sifar `{ $from }`; a yi amfani da `{ $to }` maimakon haka.
       *[other] [deprecation] Ba a ƙara amfani da sifar `{ $from }` a kan `<{ $component }>`; a yi amfani da `{ $to }` maimakon haka.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Ba a ƙara amfani da sifar `{ $from }` kuma ana yin watsi da ita domin an bayyana `{ $to }` ma.
       *[other] [deprecation] Ba a ƙara amfani da sifar `{ $from }` a kan `<{ $component }>` kuma ana yin watsi da ita domin an bayyana `{ $to }` ma.
    }

deprecated-attribute-ignored = [deprecation] Ba a ƙara amfani da sifar `{ $attribute }` a kan `<{ $component }>` kuma ana yin watsi da ita.


## Language coverage

pluralize-english-only = `<pluralize>` tana iya jam'in Turanci kawai, don haka rubutunta ya kasance kamar yadda yake a takardar da aka rubuta da { $locale }. A rubuta siffar jam'i kai tsaye, ko a saita ta da sifar `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Sashin `<{ $tag }>` ba sashe ne na Doenet da aka sani ba.

schema-element-not-allowed-at-root = Ba a yarda da sashin `<{ $tag }>` a tushen takarda ba.

schema-element-not-allowed-inside = Ba a yarda da sashin `<{ $tag }>` cikin `<{ $parent }>` ba.

schema-attribute-unrecognized = Sashin `<{ $tag }>` ba shi da sifa mai suna `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Dole sifar `{ $attribute }` ta sashin `<{ $tag }>` ta zama jeri wanda kowane abu a ciki ɗaya ne daga cikin: { $allowed }
       *[other] Dole sifar `{ $attribute }` ta sashin `<{ $tag }>` ta zama ɗaya daga cikin: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Sunan nau'i mara inganci ga select. Sunan nau'i { $variantName } yana bayyana a zaɓuɓɓuka { $numOptions } amma adadin da za a zaɓa shi ne { $numToSelect }.

select-variant-name-without-options = An bayyana wasu nau'ika ga select amma ba a bayyana zaɓuɓɓuka ga sunan nau'i mai yiwuwa ba: { $variantName }.

select-variant-name-not-possible = Sunan nau'i { $variantName } da aka bayyana ga select ba sunan nau'i mai yiwuwa ba ne.

select-too-few-options = Ba za a iya zaɓar sassa { $numToSelect } daga { $numOptions } kaɗai ba.

select-from-sequence-too-few-values = Ba za a iya zaɓar ƙimomi { $numToSelect } daga jeri mai tsawon { $length } ba.

select-from-sequence-indices-count-mismatch = Dole adadin lambobin da aka bayyana ga select ya dace da adadin da za a zaɓa

select-from-sequence-indices-not-integers = Dole dukkan lambobin da aka bayyana ga select su zama cikakkun lambobi

select-from-sequence-index-excluded = An bayyana lambar selectfromsequence wadda aka cire

select-from-sequence-indices-excluded-combination = An bayyana lambobin selectfromsequence waɗanda suka kasance haɗin da aka cire

select-from-sequence-coprime-not-positive-integers = Ba za a iya zaɓar haɗin coprime ba domin ba cikakkun lambobi masu kyau ake zaɓa ba.

select-from-sequence-coprime-common-factor = Ba za a iya zaɓar lambobin coprime ba. Dukkan ƙimomin da za a iya samu suna raba abu ɗaya. (Dole ƙimomin "from" ko "to" da aka bayyana su zama coprime da "step".)

select-from-sequence-coprime-single-number = Ba za a iya zaɓar haɗin coprime daga lamba ɗaya wadda ba 1 ba.

select-from-sequence-excluded-too-many-combinations = An cire sama da 70% na haɗe-haɗe a selectFromSequence

select-from-sequence-coprime-none-found = Ba a iya zaɓar lambobin coprime ba. Dukkan ƙimomin da za a iya samu suna raba abu ɗaya.

select-from-sequence-too-few-unique-values = Ba za a iya zaɓar ƙimomi na musamman { $numToSelect } daga jeri mai tsawon { $numPossibleValues } ba

select-prime-numbers-too-few-values = Ba za a iya zaɓar ƙimomi { $numToSelect } daga jerin lambobin farko mai tsawon { $numValues } ba

select-prime-numbers-values-count-mismatch = Dole adadin ƙimomin da aka bayyana ga select ya dace da adadin da za a zaɓa

select-prime-numbers-values-not-prime = Dole dukkan ƙimomin da aka bayyana ga select prime number su kasance cikin jerin lambobin farko

select-prime-numbers-values-excluded-combination = Ƙimomin selectPrimeNumbers da aka bayyana sun kasance haɗin da aka cire

select-prime-numbers-excluded-too-many-combinations = An cire sama da 70% na haɗe-haɗe a selectPrimeNumbers

select-random-combination-fluke = Saboda dama mai wuyar faruwa sosai, ba a iya zaɓar haɗin ƙimomi na bazuwa ba

select-random-value-fluke = Saboda dama mai wuyar faruwa sosai, ba a iya zaɓar ƙima ta bazuwa ba
