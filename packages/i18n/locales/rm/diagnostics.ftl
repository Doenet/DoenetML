# Romansh diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
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


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } vegn ignorà cur che tuts dus puncts final èn inditgads
       *[other] { $attributes } vegnan ignorads cur che tuts dus puncts final èn inditgads
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } vegn ignorà cur ch'in punct final ed in punct mesaun èn inditgads ensemen
       *[other] { $attributes } vegnan ignorads cur ch'in punct final ed in punct mesaun èn inditgads ensemen
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset n'ha nagin effect senza in punct mesaun

## `<line>`

line-points-undetermined-dimensions = Retta tras puncts da dimensiuns betg determinadas.

line-points-too-few-dimensions = La retta sto ir tras puncts da almain duas dimensiuns.

line-points-depend-on-variables = La retta va tras puncts che dependan da variablas: { $variables }.

line-equation-invalid-format = Format nunvalid per l'equaziun d'ina retta en las variablas { $variable1 } e { $variable2 }.

## `<ray>`

ray-overprescribed-through = La semiretta è determinada da through, endpoint e direction. Il through inditgà vegn ignorà.

ray-dimension-mismatch = numDimensions na correspunda betg en ray.

## `<vector>`

vector-overprescribed-head = Il vectur è determinà da head, tail e displacement. Il head inditgà vegn ignorà.

vector-dimension-mismatch = numDimensions na correspunda betg en vector.

## Attracting and constraining

attract-to-without-nearest-point = I na dat betg pussaivel d'attrair vers in `<{ $component }>` perquai ch'el n'ha nagina variabla da stadi nearestPoint.

constrain-to-without-nearest-point = I na dat betg pussaivel da limitar sin in `<{ $component }>` perquai ch'el n'ha nagina variabla da stadi nearestPoint.

constrain-to-interior-without-nearest-point = I na dat betg pussaivel da limitar sin l'intern d'in `<{ $component }>` perquai ch'el n'ha nagina variabla da stadi nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition vegn ignorà en in choiceInput che n'è betg inline

## Ordering children by index

choice-input-indices-count-mismatch = Ils indexs inditgads per choiceInput vegnan ignorads perquai che lur dumber na correspunda betg al dumber d'uffants choice.

pretzel-indices-count-mismatch = Ils indexs inditgads per problem vegnan ignorads perquai che lur dumber na correspunda betg al dumber d'uffants problem.

shuffle-indices-count-mismatch = Ils indexs inditgads per shuffle vegnan ignorads perquai che lur dumber na correspunda betg al dumber da components.

indices-ignored-out-of-range = Ils indexs inditgads per { $component } vegnan ignorads perquai che tscherts èn ordaifer il rom.

pretzel-indices-repeated = Ils indexs inditgads per pretzel vegnan ignorads perquai che tscherts sa repetan.

pretzel-circuit-first-index = Ils indexs inditgads per pretzel en mode="circuit" vegnan ignorads perquai che l'emprim index sto esser 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Per che `<{ $component }>` funcziunia cun uffants da text, sto in attribut `type` esser inditgà.

invalid-type-defaulting-to-math = type { $type } nunvalid per il component { $component }. El sto esser math, text, number u boolean. El vegn mess sin math.

string-not-valid-component-to-arrange = Il text "{ $value }" n'è betg in component valid per { $component }. El vegn ignorà.

## Types and variables

invalid-type-defaulting-to-number = type { $type } nunvalid, type vegn mess sin number.

invalid-variable-value = Valur nunvalida d'ina variabla: `{ $value }`

## Variants

variant-index-must-be-number = L'index da varianta { $index } sto esser in dumber

variant-index-must-be-integer = L'index da varianta { $index } sto esser in dumber entir

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` n'è betg implementà per mesiras absolutas. Las lartgezzas vegnan mess sin relativ.

side-by-side-absolute-margins = `<{ $component }>` n'è betg implementà per mesiras absolutas. Ils margins vegnan mess sin relativ.

side-by-side-no-block-child = `<{ $component }>` nunvalid: el sto avair almain in uffant da bloc.

## `<label>`

label-for-ignored-on-graphical = L'attribut `for` sin in `<label>` grafic vegn ignorà.

label-for-must-resolve-to-one = L'attribut `for` sin `<label>` sto resolver en exact in component.

label-for-unresolved = L'attribut `for` sin `<label>` n'ha betg pudì vegnir resolvì en in component.

label-for-answer-with-authored-inputs = L'attribut `for` sin `<label>` sa referescha ad in `<answer>` cun champs d'endataziun scrits expressiv; referi tar il champ directamain.

label-for-answer-without-input = L'attribut `for` sin `<label>` sa referescha ad in `<answer>` senza champ d'endataziun da denominar.

label-for-must-reference-input-or-answer = L'attribut `for` sin `<label>` sto sa referir ad in champ d'endataziun u ad in answer.

## Accessibility

accessibility-short-description-or-decorative = Per l'accessibladad sto `<{ $component }>` avair ina descripziun curta u esser inditgà sco decorativ.

accessibility-video-short-description = Per l'accessibladad sto `<video>` avair ina descripziun curta.

accessibility-input-short-description-or-label = Per l'accessibladad sto `<{ $component }>` avair ina descripziun curta u ina etichetta.

accessibility-answer-input-short-description-or-label = Per l'accessibladad sto in `<answer>` che crea in champ d'endataziun avair ina descripziun curta u ina etichetta.

accessibility-short-description-contains-math = Las descripziuns curtas na duessan betg cuntegnair components matematics sco `<{ $component }>`. Scrivai la matematica cun pleds.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } n'ha betg avunda contrast per il text dal titel da secziun (modus stgir) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i dovra almain { $threshold }:1).
       *[other] { $colorName } n'ha betg avunda contrast per il text dal titel da secziun ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i dovra almain { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = In `<circle>` tras { $count } puncts n'è betg implementà cur ch'ils puncts n'han naginas valurs numericas.

circle-too-many-through-points = I na dat betg pussaivel da calcular in circul tras dapli che 3 puncts.

circle-overprescribed-radius-center-points = I na dat betg pussaivel da calcular in circul cun radius, center e puncts inditgads.

circle-center-with-multiple-points = I na dat betg pussaivel da calcular in circul cun center inditgà tras dapli ch'1 punct.

circle-radius-too-small = I na dat betg pussaivel da calcular il circul: cunquai che la distanza tranter ils dus puncts è { $distance }, è il radius inditgà { $radius } memia pitschen.

circle-radius-with-many-points = I na dat betg pussaivel da crear in circul tras dapli che dus puncts cun in radius inditgà.

circle-invalid-center-or-through-points = Center u puncts da passascha dal circul nunvalids.

circle-radius-center-with-multiple-points = I na dat betg pussaivel da calcular il radius d'in circul cun center inditgà tras dapli ch'1 punct.

circle-change-radius-non-numerical = I na dat betg pussaivel da midar il radius d'in circul cun puncts betg numerics

circle-radius-with-points-non-numerical = I na dat betg pussaivel da crear in circul tras dapli ch'in punct cun in radius inditgà cur che las valurs n'èn betg numericas.

circle-change-center-non-numerical = La midada dal center d'in circul tras puncts cun valurs betg numericas n'è betg implementada.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Betg avunda dimensiuns per il domain da la funcziun. Il domain ha { $intervals } interval, ma la funcziun ha { $inputs ->
            [one] { $inputs } endataziun
           *[other] { $inputs } endataziuns
        }.
       *[other] Betg avunda dimensiuns per il domain da la funcziun. Il domain ha { $intervals } intervals, ma la funcziun ha { $inputs ->
            [one] { $inputs } endataziun
           *[other] { $inputs } endataziuns
        }.
    }

function-domain-invalid-format = Format nunvalid per il domain da la funcziun.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Il maximum betg numeric da la funcziun vegn ignorà.
        [minimum] Il minimum betg numeric da la funcziun vegn ignorà.
        [extremum] L'extremum betg numeric da la funcziun vegn ignorà.
        [point] Il punct betg numeric da la funcziun vegn ignorà.
        [slope] La pendenza betg numerica da la funcziun vegn ignorada.
       *[other] Il { $type } betg numeric da la funcziun vegn ignorà.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Il maximum vid da la funcziun vegn ignorà.
        [minimum] Il minimum vid da la funcziun vegn ignorà.
        [extremum] L'extremum vid da la funcziun vegn ignorà.
        [point] Il punct vid da la funcziun vegn ignorà.
       *[other] Il { $type } vid da la funcziun vegn ignorà.
    }

function-points-too-close = La funcziun cuntegna dus puncts memia datiers in da l'auter. La funcziun na po betg vegnir definida.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Las iteraziuns d'ina funcziun èn mo pussaivlas sche il dumber d'endataziuns è egual al dumber da resultats. Questa funcziun ha { $inputs } endataziun e { $outputs ->
            [one] { $outputs } resultat
           *[other] { $outputs } resultats
        }.
       *[other] Las iteraziuns d'ina funcziun èn mo pussaivlas sche il dumber d'endataziuns è egual al dumber da resultats. Questa funcziun ha { $inputs } endataziuns e { $outputs ->
            [one] { $outputs } resultat
           *[other] { $outputs } resultats
        }.
    }

## `<sequence>`

sequence-invalid-length = Lunghezza nunvalida da la sequenza. Ella sto esser in dumber entir betg negativ.

sequence-invalid-step = Pass nunvalid da la sequenza. El sto esser in dumber per ina sequenza dal tip { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" nunvalid d'ina sequenza da dumbers. El sto esser in dumber.

sequence-invalid-endpoint-letters = "{ $attribute }" nunvalid d'ina sequenza da bustabs. El sto esser ina cumbinaziun da bustabs.

sequence-invalid-endpoint = "{ $attribute }" nunvalid da la sequenza.

select-from-sequence-coprime-not-numbers = coprime vegn ignorà perquai ch'i na vegnan betg tschernids dumbers

select-from-sequence-coprime-with-exclude-combinations = coprime vegn ignorà perquai che excludeCombinations è inditgà

## Resolving a `target`

target-not-found = target nunvalid per `<{ $source }>`: la finamira na po betg vegnir chattada.

target-state-variable-not-found = target nunvalid per `<{ $source }>`: i na vegn betg chattada ina variabla da stadi cun il num "{ $property }" sin in `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Las variablas da `<odeSystem>` ston esser autras che la variabla independenta.

ode-system-duplicate-variable-names = Las funcziuns da la vart dretga da l'equaziun differenziala na pon betg vegnir definidas cun nums da variablas dependentas repetids.

ode-system-rhs-function-error = La funcziun da la vart dretga da l'equaziun differenziala na po betg vegnir definida. Errur cun crear la funcziun mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = I na dat betg pussaivel da definir in angul tranter { $count } rettas

angle-invalid-through-point = Punct nunvalid en il through da `<angle>`

parabola-vertex-too-many-points = Ina parabola cun vertex tras dapli ch'1 punct n'è betg implementada.

parabola-too-many-points = Ina parabola tras dapli che 3 puncts n'è betg implementada.

intersection-too-many-items = L'intersecziun da dapli che dus objects n'è betg implementada

## Other math components

ionic-compound-not-two-ions = Ina colliaziun ionica n'è betg implementada per auter che per dus iuns.

ionic-compound-needs-cation-and-anion = Ina colliaziun ionica è mo implementada per in cation ed in anion.

solve-equations-cannot-evaluate = L'equaziun na po betg vegnir resolvida perquai ch'ella n'ha betg pudì vegnir evaluada: { $equation }

math-operators-operand-number-required = In operandNumber sto vegnir inditgà cur ch'i vegn extratg in operand matematic.

eigen-decomposition-failed = Las valurs atgnas da la matrix n'han betg pudì vegnir calculadas

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: il parameter { $parameters } na cumpara betg en il model, uschia ch'el correspunda adina ad in vid.
       *[other] `<matchesPattern>`: ils parameters { $parameters } na cumparan betg en il model, uschia ch'els correspundan adina ad in vid.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" na po betg vegnir interpretà. El sto esser none, medium, dense u dus dumbers positivs separads d'in spazi, per exempel grid="1 0.5". I na vegn dessegnà nagin rester.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" n'è betg sustegnì en il motor prefigure; i vegn duvrà il cumportament da la posiziun dretga.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" n'è betg sustegnì en il motor prefigure; i vegn duvrà il cumportament da la posiziun sura.

prefigure-invalid-axis-bounds = `<graph>`: cunfins d'axas nunvalids per la conversiun en prefigure; i vegn duvrada la bbox predefinida (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: lartgezza nunvalida per la conversiun en prefigure; i vegn duvrada la lartgezza predefinida 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio nunvalid per la conversiun en prefigure; i vegn duvrada la proporziun predefinida 1.

prefigure-grid-spacing-too-fine = `<graph>`: la distanza dal rester è memia stretga per ils cunfins da las axas; il rester vegn tralaschà en il motor prefigure.

prefigure-annotations-not-rendered = `<graph>`: las annotaziuns na vegnan betg mussadas cur ch'i na vegn betg duvrà il motor PreFigure.

multiple-annotations-children = Plirs uffants `<annotations>` èn vegnids chattads en `<graph>`; tuts, ordlunder l'ultim, vegnan ignorads.

## Referring to other components

copy-unrecognized-component-type = In tip da component nunenconuschent na po betg vegnir extendì u copià: { $type }.

copy-prop-not-found = La caracteristica { $property } n'è betg vegnida chattada sin in component dal tip { $component }

collect-no-source = Nagina funtauna chattada per collect.

collect-invalid-component-type = Components dal tip `<{ $component }>` na pon betg vegnir rimnads perquai che quai è in tip da component nunvalid.

reference-index-unavailable = I na dat betg pussaivel da sa referir a l'index `{ $reference }`

## `<callAction>`

component-action-unavailable = { $action } na po betg vegnir clamà sin il component `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Las datas han ina furma nunvalida. Las lingias han lunghezzas differentas. Chattà en componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Las datas han nums da colonna repetids. Chattà en componentIdx :{ $componentIdx }

data-frame-missing-column-name = A las datas manca in num da colonna. Chattà en componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = In award da questa resposta sa basa sin la resposta tramessa dal tag answer sez, quai che maina ad in cumportament nunspetgà.

answer-max-num-attempts-in-section-wide-check-work = Metter `maxNumAttempts` sin in `<answer>` entaifer in cuntegnider cun `sectionWideCheckWork` n'ha nagin effect, perquai ch'il dumber d'empruvas vegn controllà dal cuntegnider. Mettai `maxNumAttempts` sin il cuntegnider.

nested-section-wide-check-work-max-num-attempts = Metter `maxNumAttempts` sin in cuntegnider cun `sectionWideCheckWork` ch'è entaifer in auter cuntegnider cun `sectionWideCheckWork` n'ha nagin effect, perquai ch'il dumber d'empruvas vegn controllà dal cuntegnider da dador. Mettai `maxNumAttempts` sin il cuntegnider da dador.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] L'attribut { $attributes } n'avrà nagin effect senza symbolicEquality.
       *[other] Ils attributs { $attributes } n'avran nagin effect senza symbolicEquality.
    }

answer-invalid-type = Tip nunvalid per la resposta: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Cunquai ch'il component `<{ $component }>` n'ha nagin num, na po el betg vegnir duvrà sco attribut d'in modul

module-attribute-name-already-defined = Il component `<{ $component } name="{ $name }">` na po betg vegnir duvrà sco attribut d'in modul perquai ch'il tip da component `<module>` ha gia in attribut "{ $name }".

conditional-content-condition-ignored = L'attribut `condition` vegn ignorà sin in component `<conditionalContent>` cun uffants case u else.

slider-markers-type-mismatch = Il tip dals marcaturs na correspunda betg al tip dal reglader.

pretzel-problem-needs-statement-and-answer = pretzel nunvalid: mintga `<problem>` sto cuntegnair in `<statement>` ed in `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel nunvalid: en mode="circuit" na po l'emprim `<problem>` betg esser in distractur.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Valur nunvalida { $values } per l'attribut `{ $attribute }`; ella vegn ignorada.
       *[other] Valurs nunvalidas { $values } per l'attribut `{ $attribute }`; ellas vegnan ignoradas.
    }

attribute-must-be-references = Valur nunvalida `{ $value }` per l'attribut `{ $attribute }`. L'attribut sto consister da referenzas che cumenzan cun in `$`.

math-input-invalid-function-names = <mathInput>: nums da funcziun nunvalids ignorads en { $attribute }: { $names }. La part mussada da mintga num sto avair almain 2 caracters (bustabs u stritgs); ina finiziun facultativa `|<mathspeak alternativa>` po suandar.

## Building components from the source

component-type-invalid = Tip da component nunvalid: `<{ $componentType }>`

attribute-repeated = L'attribut { $attribute } na po betg vegnir repetì.

attribute-invalid-for-component = Attribut "{ $attribute }" nunvalid per in component dal tip `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    La definiziun da stil { $styleNumber } n'ha betg avunda contrast per { $context ->
        [text-on-background] la colur dal text cunter la colur dal fund
        [high-contrast] la colur d'aut contrast cunter la tela
        [line] la colur da la lingia cunter la tela
        [marker] la colur dal marcatur cunter la tela
       *[text-on-canvas] la colur dal text cunter la tela
    }{ $mode ->
        [dark] { " (modus stgir)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i dovra almain { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Schebain che la definiziun da stil { $styleNumber } inditgescha colurs cun avunda contrast per il modus cler, n'han las colurs dal modus stgir derivadas da questas valurs betg avunda contrast tranter la colur dal text e la colur dal fund ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i dovra almain { $threshold }:1). { $suggestion ->
        [available] Per garantir avunda contrast en il modus stgir, augmentai il contrast dal modus cler (per exempel { $lightAttribute }="{ $lightColor }") u remplazzai la colur dal modus stgir (per exempel { $darkAttribute }="{ $darkColor }").
       *[none] Per garantir avunda contrast en il modus stgir, augmentai il contrast dal modus cler u remplazzai las colurs derivadas cun textColorDarkMode e/u backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Schebain che la definiziun da stil { $styleNumber } inditgescha ina colur da text cun avunda contrast per il modus cler, n'ha la colur da text dal modus stgir derivada da questa valur betg avunda contrast cunter la tela ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i dovra almain { $threshold }:1). { $suggestion ->
        [available] Per garantir avunda contrast en il modus stgir, augmentai il contrast dal modus cler (per exempel textColor="{ $lightColor }") u remplazzai la colur dal modus stgir (per exempel textColorDarkMode="{ $darkColor }").
       *[none] Per garantir avunda contrast en il modus stgir, augmentai il contrast dal modus cler u remplazzai la colur derivada cun textColorDarkMode.
    }

section-multiple-style-palettes = Ina secziun po tscherner mo ina <stylePalette>; i vegn duvrada l'ultima.

## Unique variants

variant-num-to-select-not-non-negative-integer = las variantas unicas da { $component } na pon betg vegnir determinadas perquai che numToSelect n'è betg in dumber entir betg negativ.

variant-num-to-select-not-constant-number = las variantas unicas da { $component } na pon betg vegnir determinadas perquai che numToSelect n'è betg in dumber constant.

variant-with-replacement-not-constant-boolean = las variantas unicas da { $component } na pon betg vegnir determinadas perquai che withReplacement n'è betg in boolean constant.

variant-select-weight-disables-unique = Las variantas unicas per select èn deactivadas sche ina opziun ha selectWeight u selectForVariants inditgà

variant-coprime-undetermined = las variantas unicas da { $component } na pon betg vegnir determinadas perquai ch'i na po betg vegnir determinà che coprime è adina fauss.

variant-attribute-not-constant = las variantas unicas da { $component } na pon betg vegnir determinadas perquai che { $attribute } n'è betg ina constanta.

variant-attribute-not-number = las variantas unicas da { $component } na pon betg vegnir determinadas perquai che { $attribute } n'è betg in dumber.

variant-attribute-wrong-type-for-sequence =
    las variantas unicas da { $component } dal tip { $type } na pon betg vegnir determinadas perquai che { $attribute } n'è betg { $expected ->
        [letters-combination] ina cumbinaziun da bustabs
        [math-expression] ina expressiun matematica valida
        [integer] in dumber entir
       *[number] in dumber
    }.

variant-length-not-integer = las variantas unicas da { $component } na pon betg vegnir determinadas perquai che length n'è betg in dumber entir.

variant-sort-not-implemented = las variantas unicas d'in { $component } cun sort n'èn betg implementadas

variant-exclude-combinations-not-implemented = las variantas unicas d'in { $component } cun excludeCombinations n'èn betg implementadas

variant-math-exclude-not-implemented = las variantas unicas d'in { $component } dal tip math cun exclude n'èn betg implementadas

variant-non-constant-exclude-not-implemented = las variantas unicas d'in { $component } cun in exclude betg constant n'èn betg implementadas

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: n'è betg sustegnì en il motor prefigure dal grafic; il descendent vegn siglì.

prefigure-descendant-invalid-geometry = { $subject }: geometria betg finita u incumpleta; il descendent vegn siglì.

prefigure-curve-label-omitted = { $subject }: las etichettas n'èn betg sustegnidas sin elements da curva convertids; l'etichetta vegn tralaschada.

prefigure-curve-unsupported-definition-type = { $subject }: tip da definiziun da funcziun da curva betg sustegnì '{ $definitionType }'; il descendent vegn siglì.

prefigure-region-flip-functions-unsupported = { $subject }: attribut flipFunctions betg sustegnì sin regionBetweenCurves; il descendent vegn siglì.

prefigure-region-non-formula-child = { $subject }: sin regionBetweenCurves èn mo sustegnidas las funcziuns uffant definidas cun ina furmla; il descendent vegn siglì.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' betg sustegnì per { $labelKind ->
        [line-family] ina etichetta da la famiglia da las lingias
       *[point] ina etichetta da punct
    }; i vegn duvrà l'alliniament PreFigure predefinì.

prefigure-fill-style-unsupported = { $subject }: il stil d'emplenida '{ $fillStyle }' n'è betg sustegnì da PreFigure; i vegn returnà ad ina emplenida cumpletta.

prefigure-line-style-unknown = { $subject }: stil da lingia nunenconuschent '{ $lineStyle }' tralaschà da l'output PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: il stil da marcatur '{ $markerStyle }' è vegnì convertì en il stil PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: il stil da marcatur '{ $markerStyle }' n'è betg sustegnì da PreFigure; i vegn duvrà il stil predefinì.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` nunvalid; la finamira na po betg vegnir resolvida. L'annotaziun vegn tralaschada.

annotation-ref-multiple-targets = `<annotation>`: `ref` è vegnì resolvì en pliras finamiras; i vegn duvrada l'emprima.

annotation-ref-outside-graph = `<annotation>`: `ref` nunvalid; la finamira è ordaifer il grafic che la cuntegna. L'annotaziun vegn tralaschada.

annotation-ref-unsupported-target = `<annotation>`: `ref` nunvalid; la finamira n'è betg in object grafic sustegnì en la conversiun prefigure. L'annotaziun vegn tralaschada.

annotation-text-missing = `<annotation>`: `text` manca u è vid; i vegn producì in text vid.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Ina dependenza circulara è vegnida chattada.
       *[other] Ina dependenza circulara cun in component `<{ $componentType }>` è vegnida chattada.
    }

reference-no-referent = Nagin referent chattà per la referenza: `{ $reference }`

reference-multiple-referents = Plirs referents chattads per la referenza: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format nunvalid per l'attribut { $attribute } da `<{ $componentType }>`.

children-invalid = Uffants nunvalids per `<{ $componentType }>`: uffants nunvalids chattads: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valur nunvalida `{ $value }` per l'attribut `{ $attribute }`, i vegn duvrada la valur `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] La versiun { $version } da DoenetML n'è betg vegnida chattada.
       *[other] La versiun { $version } da DoenetML n'è betg vegnida chattada. I vegn duvrada la versiun { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML nunvalid: { $content }

parse-tag-missing-close-tag = DoenetML nunvalid: il tag `{ $tag }` n'ha nagin tag da serrada. I vegn spetgà in tag che sa serra sez u in tag `</{ $tagName }>`.

parse-tag-error = DoenetML nunvalid: errur en il tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML nunvalid: al attribut nunvalid `{ $attribute }` para da mancar ina valur.

parse-attribute-invalid = DoenetML nunvalid: attribut nunvalid `{ $attribute }`

parse-attribute-value-invalid = DoenetML nunvalid: valur d'attribut nunvalida `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML nunvalid: valur d'attribut nunvalida `{ $value }`. Las virgulettas na correspundan betg. I para da mancar in `{ $quote }`

parse-open-tag-name-missing = DoenetML nunvalid: in tag senza num è vegnì chattà, per exempel `<`

parse-tag-not-closed = DoenetML nunvalid: il tag `{ $tag }` n'è betg vegnì serrà (i para da mancar in `>`).

parse-self-closing-tag-name-missing = DoenetML nunvalid: in tag senza num è vegnì chattà `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML nunvalid: il tag `{ $tag }` n'è betg vegnì serrà (i para da mancar `/>`).

parse-tag-invalid-attributes = DoenetML nunvalid: il tag `{ $tag }` n'è betg valid. El ha eventualmain attributs sbaliads.

parse-close-tag-name-missing = DoenetML nunvalid: in tag da serrada senza num è vegnì chattà, per exempel `</`

parse-attribute-value-unquoted = Las valurs d'attribut ston star tranter virgulettas: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML nunvalid: il tag da serrada `{ $tag }` è vegnì chattà, ma nagin tag d'avertura correspundent

parse-close-tag-mismatched = DoenetML nunvalid: tag da serrada che na correspunda betg. I vegn spetgà `</{ $expected }>`. Chattà `{ $found }`

parser-node-unconvertible = Il nod { $node } n'ha betg pudì vegnir convertì en in nod Dast.

## Names

name-attribute-invalid =
    Attribut name='{ $name }' nunvalid. { $reason ->
        [characters] Ils nums pon cuntegnair mo bustabs, cifras, stritgs bass u stritgs.
       *[start] Ils nums ston cumenzar cun in bustab.
    }

component-name-invalid-start = Num da component "{ $name }" nunvalid. Ils nums ston cumenzar cun in bustab.

## `<answer>` sugar

answer-video-watched-missing-video = In answer dal tip videoWatched sto avair in attribut video

answer-video-watched-video-not-reference = In answer dal tip videoWatched sto avair in attribut video ch'è ina referenza

answer-name-not-single-text = L'attribut name d'in answer sto avair in sulet uffant da text

## Referencing another document

external-doenetml-recursion-limit = Il DoenetML extern na po betg vegnir retschavì pervia da memia bleras stgalinadas da recursiun. Datti ina referenza circulara?

external-doenetml-unavailable = I na dat betg pussaivel da retschaiver DoenetML da { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML nunvalid retschavì da { $attribute }="{ $uri }": el na correspundeva betg al tip da component "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] L'attribut `{ $from }` è antiquà; duvrai `{ $to }` empè.
       *[other] [deprecation] L'attribut `{ $from }` sin `<{ $component }>` è antiquà; duvrai `{ $to }` empè.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] L'attribut `{ $from }` è antiquà e vegn ignorà perquai che `{ $to }` è era inditgà.
       *[other] [deprecation] L'attribut `{ $from }` sin `<{ $component }>` è antiquà e vegn ignorà perquai che `{ $to }` è era inditgà.
    }

deprecated-attribute-ignored = [deprecation] L'attribut `{ $attribute }` sin `<{ $component }>` è antiquà e vegn ignorà.

deprecated-attribute-to-child = [deprecation] L'attribut `{ $attribute }` sin `<{ $component }>` è antiquà; duvrai in uffant `<{ $child }>` empè.

deprecated-attribute-value-renamed = [deprecation] La valur `{ $value }` da l'attribut `{ $attribute }` sin `<{ $component }>` è antiquada; duvrai `{ $to }` empè.


## Language coverage

pluralize-english-only = `<pluralize>` po far il plural mo per l'englais, uschia che ses text resta nunmidà en in document scrit en { $locale }. Scrivai la furma dal plural directamain, u inditgai ella cun l'attribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = L'element `<{ $tag }>` n'è betg in element Doenet renconuschì.

schema-element-not-allowed-at-root = L'element `<{ $tag }>` n'è betg permess a la ragisch dal document.

schema-element-not-allowed-inside = L'element `<{ $tag }>` n'è betg permess entaifer `<{ $parent }>`.

schema-attribute-unrecognized = L'element `<{ $tag }>` n'ha nagin attribut cun il num `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] L'attribut `{ $attribute }` da l'element `<{ $tag }>` sto esser ina glista en la quala mintga element è in da quels: { $allowed }
       *[other] L'attribut `{ $attribute }` da l'element `<{ $tag }>` sto esser in da quels: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Num da varianta nunvalid per select. Il num da varianta { $variantName } cumpara en { $numOptions } opziuns, ma il dumber da tscherner è { $numToSelect }.

select-variant-name-without-options = Tschertas variantas èn inditgadas per select, ma naginas opziuns per il num da varianta pussaivel: { $variantName }.

select-variant-name-not-possible = Il num da varianta { $variantName } inditgà per select n'è betg in num da varianta pussaivel.

select-too-few-options = I na dat betg pussaivel da tscherner { $numToSelect } components da mo { $numOptions }.

select-from-sequence-too-few-values = I na dat betg pussaivel da tscherner { $numToSelect } valurs d'ina sequenza da la lunghezza { $length }.

select-from-sequence-indices-count-mismatch = Il dumber d'indexs inditgads per select sto correspunder al dumber da tscherner

select-from-sequence-indices-not-integers = Tut ils indexs inditgads per select ston esser dumbers entirs

select-from-sequence-index-excluded = In index inditgà da selectfromsequence era exclus

select-from-sequence-indices-excluded-combination = Ils indexs inditgads da selectfromsequence eran ina cumbinaziun excludida

select-from-sequence-coprime-not-positive-integers = I na dat betg pussaivel da tscherner cumbinaziuns relativamain primas perquai ch'i na vegnan betg tschernids dumbers entirs positivs.

select-from-sequence-coprime-common-factor = I na dat betg pussaivel da tscherner dumbers relativamain prims. Tut las valurs pussaivlas han in factur cuman. (Las valurs inditgadas da "from" u "to" ston esser relativamain primas cun "step".)

select-from-sequence-coprime-single-number = I na dat betg pussaivel da tscherner cumbinaziuns relativamain primas d'in sulet dumber che n'è betg 1.

select-from-sequence-excluded-too-many-combinations = Dapli che 70% da las cumbinaziuns èn vegnidas excludidas en selectFromSequence

select-from-sequence-coprime-none-found = Dumbers relativamain prims n'han betg pudì vegnir tschernids. Tut las valurs pussaivlas han in factur cuman.

select-from-sequence-too-few-unique-values = I na dat betg pussaivel da tscherner { $numToSelect } valurs unicas d'ina sequenza da la lunghezza { $numPossibleValues }

select-prime-numbers-too-few-values = I na dat betg pussaivel da tscherner { $numToSelect } valurs d'ina glista da dumbers prims da la lunghezza { $numValues }

select-prime-numbers-values-count-mismatch = Il dumber da valurs inditgadas per select sto correspunder al dumber da tscherner

select-prime-numbers-values-not-prime = Tut las valurs inditgadas per tscherner dumbers prims ston esser en la glista dals dumbers prims

select-prime-numbers-values-excluded-combination = Las valurs inditgadas da selectPrimeNumbers eran ina cumbinaziun excludida

select-prime-numbers-excluded-too-many-combinations = Dapli che 70% da las cumbinaziuns èn vegnidas excludidas en selectPrimeNumbers

select-random-combination-fluke = Tras in cas extremamain nunprobabel n'ha nagina cumbinaziun da valurs casualas pudì vegnir tschernida

select-random-value-fluke = Tras in cas extremamain nunprobabel n'ha nagina valur casuala pudì vegnir tschernida
