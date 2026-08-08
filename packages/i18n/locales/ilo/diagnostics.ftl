# Ilocano diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
#
# Ilocano marks no number on the noun, so a counted message whose only English
# difference is the noun's number renders one string here and the select is
# dropped. The count still arrives and is still formatted.
#
# A value quoted back from the author's source is reached through «ti» or
# «iti» rather than through a ligature, so that no «a»/«nga» choice depends on
# a word this catalog has never seen. See `content.ftl`'s header for the rule
# and for the one place it could not be avoided.


## `<lineSegment>`

# No select: «mailaksid» does not agree with what is ignored, and the list
# carries no number of its own. One string covers both English categories.
line-segment-attributes-ignored-with-endpoints = mailaksid ti { $attributes } no naespesipika ti dua a bout

line-segment-attributes-ignored-with-endpoint-and-midpoint = mailaksid ti { $attributes } no naespesipika ti maysa a bout ken ti tengnga

line-segment-midpoint-offset-without-midpoint = awan ti epekto ti midpointOffset no awan ti tengnga

## `<line>`

line-points-undetermined-dimensions = Linia a lumasat kadagiti punto a saan a nadeterminaran ti dimension da.

line-points-too-few-dimensions = Masapul a lumasat ti linia kadagiti punto nga addaan iti saan a nababbaba ngem dua a dimension.

line-points-depend-on-variables = Lumasat ti linia kadagiti punto nga agpannuray kadagiti baribariabol: { $variables }.

line-equation-invalid-format = Imbalido a pormat ti ekuasion ti linia kadagiti baribariabol a { $variable1 } ken { $variable2 }.

## `<ray>`

ray-overprescribed-through = Naiprisibi ti sinag babaen ti through, endpoint ken direction.  Mailaksid ti naespesipika a through.

ray-dimension-mismatch = saan nga agtutunos ti numDimensions iti sinag.

## `<vector>`

vector-overprescribed-head = Naiprisibi ti bektor babaen ti head, tail ken displacement.  Mailaksid ti naespesipika a head.

vector-dimension-mismatch = saan nga agtutunos ti numDimensions iti bektor.

## Attracting and constraining

attract-to-without-nearest-point = Saan a mabalin nga agguyod iti `<{ $component }>` ta awan ti baribariabol nga estado a nearestPoint na.

constrain-to-without-nearest-point = Saan a mabalin a mangpatingga iti `<{ $component }>` ta awan ti baribariabol nga estado a nearestPoint na.

constrain-to-interior-without-nearest-point = Saan a mabalin a mangpatingga iti uneg ti `<{ $component }>` ta awan ti baribariabol nga estado a nearestPoint na.

## `<choiceInput>`

choice-input-label-position-ignored = mailaksid ti labelPosition iti choiceInput a saan nga inline

## Ordering children by index

choice-input-indices-count-mismatch = Mailaksid dagiti indeks a naespesipika para iti choiceInput ta saan nga agtutunos ti bilang dagiti indeks ken ti bilang dagiti anak a pagpilian.

pretzel-indices-count-mismatch = Mailaksid dagiti indeks a naespesipika para iti problem ta saan nga agtutunos ti bilang dagiti indeks ken ti bilang dagiti anak a problem.

shuffle-indices-count-mismatch = Mailaksid dagiti indeks a naespesipika para iti shuffle ta saan nga agtutunos ti bilang dagiti indeks ken ti bilang dagiti komponente.

indices-ignored-out-of-range = Mailaksid dagiti indeks a naespesipika para iti { $component } ta adda indeks a rimmuar iti benneg.

pretzel-indices-repeated = Mailaksid dagiti indeks a naespesipika para iti pretzel ta adda indeks a naulit.

pretzel-circuit-first-index = Mailaksid dagiti indeks a naespesipika para iti pretzel iti mode a circuit ta masapul a 1 ti umuna nga indeks.

## `<shuffle>` and `<sort>`

string-children-need-type = Tapno agandar ti `<{ $component }>` kadagiti anak a string, masapul a maespesipika ti atributo a `type`.

invalid-type-defaulting-to-math = Imbalido a type { $type } para iti komponente a { $component }. Masapul a maysa kadagiti math, text, number, wenno boolean. Agus-usar iti math.

string-not-valid-component-to-arrange = Ti string a "{ $value }" ket saan a balido a komponente para iti { $component }. Mailaksid.

## Types and variables

invalid-type-defaulting-to-number = Imbalido a type { $type }, maisaad ti type iti number.

invalid-variable-value = Imbalido a pateg ti maysa a baribariabol: `{ $value }`

## Variants

variant-index-must-be-number = Masapul a numero ti indeks ti baryante a { $index }

variant-index-must-be-integer = Masapul nga integer ti indeks ti baryante a { $index }

## `<sideBySide>`

side-by-side-absolute-widths = Saan a naipatungpal ti `<{ $component }>` para kadagiti absoluto a rukod. Maisaad dagiti kaakaba a relatibo.

side-by-side-absolute-margins = Saan a naipatungpal ti `<{ $component }>` para kadagiti absoluto a rukod. Maisaad dagiti margin a relatibo.

side-by-side-no-block-child = Imbalido a `<{ $component }>`: masapul nga addaan iti saan a nababbaba ngem maysa nga anak a block.

## `<label>`

label-for-ignored-on-graphical = Mailaksid ti atributo a `for` iti grapikal a `<label>`.

label-for-must-resolve-to-one = Masapul a maiturong ti atributo a `for` iti `<label>` iti eksakto a maysa a komponente.

label-for-unresolved = Saan a naiturong ti atributo a `for` iti `<label>` iti maysa a komponente.

label-for-answer-with-authored-inputs = Tuktukoyen ti atributo a `for` iti `<label>` ti maysa nga `<answer>` nga addaan kadagiti input a sinurat ti autor; tukoyen ti input a mismo.

label-for-answer-without-input = Tuktukoyen ti atributo a `for` iti `<label>` ti maysa nga `<answer>` nga awan ti input a maetiketaan.

label-for-must-reference-input-or-answer = Masapul a tukoyen ti atributo a `for` iti `<label>` ti maysa nga input wenno maysa nga answer.

## Accessibility

accessibility-short-description-or-decorative = Para iti aksesibilidad, masapul nga addaan ti `<{ $component }>` iti ababa a deskripsion wenno maespesipika a dekoratibo.

accessibility-video-short-description = Para iti aksesibilidad, masapul nga addaan ti `<video>` iti ababa a deskripsion.

accessibility-input-short-description-or-label = Para iti aksesibilidad, masapul nga addaan ti `<{ $component }>` iti ababa a deskripsion wenno etiketa.

accessibility-answer-input-short-description-or-label = Para iti aksesibilidad, masapul nga addaan iti ababa a deskripsion wenno etiketa ti maysa nga `<answer>` a mangpartuat iti input.

accessibility-short-description-contains-math = Saan koma nga aglaon dagiti ababa a deskripsion kadagiti komponente a matematika a kas ti `<{ $component }>`. Isurat iti sasao ti aniaman a matematika.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Kurang ti kontraste ti { $colorName } para iti teksto ti ulo ti seksion (nasipnget a mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; masapul ti saan a nababbaba ngem { $threshold }:1).
       *[other] Kurang ti kontraste ti { $colorName } para iti teksto ti ulo ti seksion ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; masapul ti saan a nababbaba ngem { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Saan pay a naipatungpal ti `<circle>` a lumasat iti { $count } a punto no awan ti numeriko a pateg dagiti punto.

circle-too-many-through-points = Saan a mabalin a kalkulaen ti sirkulo a lumasat iti nasursurok ngem 3 a punto.

circle-overprescribed-radius-center-points = Saan a mabalin a kalkulaen ti sirkulo nga addaan iti naespesipika a radio, sentro ken punto a lasatenna.

circle-center-with-multiple-points = Saan a mabalin a kalkulaen ti sirkulo nga addaan iti naespesipika a sentro a lumasat iti nasursurok ngem 1 a punto.

circle-radius-too-small = Saan a mabalin a kalkulaen ti sirkulo: gapu ta ti distansia ti dua a punto ket { $distance }, bassit unay ti naespesipika a radio a { $radius }.

circle-radius-with-many-points = Saan a mabalin a mangpartuat iti sirkulo a lumasat iti nasursurok ngem dua a punto nga addaan iti naespesipika a radio.

circle-invalid-center-or-through-points = Imbalido ti sentro wenno dagiti punto a lasaten ti sirkulo.

circle-radius-center-with-multiple-points = Saan a mabalin a kalkulaen ti radio ti sirkulo nga addaan iti naespesipika a sentro a lumasat iti nasursurok ngem 1 a punto.

circle-change-radius-non-numerical = Saan a mabalin a sukatan ti radio ti sirkulo a lumasat kadagiti punto a saan a numeriko

circle-radius-with-points-non-numerical = Saan a mabalin a mangpartuat iti sirkulo a lumasat iti nasursurok ngem maysa a punto nga addaan iti naespesipika a radio no awan dagiti numeriko a pateg.

circle-change-center-non-numerical = Saan pay a naipatungpal ti panangsukat iti sentro ti sirkulo a lumasat kadagiti punto nga awan ti numeriko a pateg da.

## `<function>`

# English's two counts multiply out to four sentences; Ilocano has one, because
# «interbalo» and «input» do not change for number. Both selects are dropped
# and both counts still arrive.
function-domain-insufficient-dimensions = Kurang ti dimension ti domain para iti punsion. Ti domain ket addaan iti { $intervals } nga interbalo ngem ti punsion ket addaan iti { $inputs } nga input.

function-domain-invalid-format = Imbalido a pormat ti domain para iti punsion.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Mailaksid ti saan a numeriko a kangatuan ti punsion.
        [minimum] Mailaksid ti saan a numeriko a kababaan ti punsion.
        [extremum] Mailaksid ti saan a numeriko nga ekstremum ti punsion.
        [point] Mailaksid ti saan a numeriko a punto ti punsion.
        [slope] Mailaksid ti saan a numeriko a kilo ti punsion.
       *[other] Mailaksid ti saan a numeriko a { $type } ti punsion.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Mailaksid ti awan naglaonna a kangatuan ti punsion.
        [minimum] Mailaksid ti awan naglaonna a kababaan ti punsion.
        [extremum] Mailaksid ti awan naglaonna nga ekstremum ti punsion.
        [point] Mailaksid ti awan naglaonna a punto ti punsion.
       *[other] Mailaksid ti awan naglaonna a { $type } ti punsion.
    }

function-points-too-close = Aglaon ti punsion iti dua a punto nga asideg unay ti ayan da. Saan a maidepinar ti punsion.

# Both selects dropped, for the reason above.
function-iterates-input-output-mismatch = Mabalin laeng dagiti iterasion ti punsion no agpada ti bilang dagiti input ken ti bilang dagiti output. Daytoy a punsion ket addaan iti { $inputs } nga input ken { $outputs } nga output.

## `<sequence>`

sequence-invalid-length = Imbalido ti kaatiddog ti sequence.  Masapul a saan a negatibo nga integer.

sequence-invalid-step = Imbalido ti step ti sequence.  Masapul a numero para iti sequence a type { $type }.

sequence-invalid-endpoint-number = Imbalido a "{ $attribute }" ti sequence a numero.  Masapul a numero.

sequence-invalid-endpoint-letters = Imbalido a "{ $attribute }" ti sequence a letra.  Masapul a kombinasion dagiti letra.

sequence-invalid-endpoint = Imbalido a "{ $attribute }" ti sequence.

select-from-sequence-coprime-not-numbers = mailaksid ti coprime ta saan a numero ti mapilpili

select-from-sequence-coprime-with-exclude-combinations = mailaksid ti coprime ta naespesipika ti excludeCombinations

## Resolving a `target`

target-not-found = Imbalido a target para iti `<{ $source }>`: saan a masarakan ti target.

target-state-variable-not-found = Imbalido a target para iti `<{ $source }>`: saan a masarakan ti baribariabol nga estado a managan iti "{ $property }" iti maysa a `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Masapul a naiduma dagiti baribariabol ti `<odeSystem>` iti nawaya a baribariabol.

ode-system-duplicate-variable-names = Saan a maidepinar dagiti punsion nga RHS ti ODE nga addaan iti agpada a nagan ti baribariabol nga agpannuray.

ode-system-rhs-function-error = Saan a maidepinar ti punsion nga RHS ti ODE.  Adda biddut iti panangpartuat iti punsion a mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Saan a maidepinar ti anggulo iti nagbaetan ti { $count } a linia

angle-invalid-through-point = Imbalido a punto iti through ti `<angle>`

parabola-vertex-too-many-points = Saan pay a naipatungpal ti parabola nga addaan iti bertise a lumasat iti nasursurok ngem 1 a punto.

parabola-too-many-points = Saan pay a naipatungpal ti parabola a lumasat iti nasursurok ngem 3 a punto.

intersection-too-many-items = Saan pay a naipatungpal ti panagsabet iti nasursurok ngem dua a banag

## Other math components

ionic-compound-not-two-ions = Saan pay a naipatungpal ti kompuesto nga ioniko malaksid iti dua nga ion.

ionic-compound-needs-cation-and-anion = Naipatungpal ti kompuesto nga ioniko para laeng iti maysa a cation ken maysa nga anion.

solve-equations-cannot-evaluate = Saan a marisut ti ekuasion ta saan a nabalatong ti ekuasion: { $equation }

math-operators-operand-number-required = Masapul a maespesipika ti operandNumber no mangalaen ti maysa nga operand a matematika.

eigen-decomposition-failed = Saan a nakalkula dagiti eigenvalue ti matris

## `<matchesPattern>`

# No select: the parameter list carries no number that the noun would show.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: ti parametro a { $parameters } ket saan nga agparang iti pattern, isu nga agtutunosto latta iti blangko.

## `<graph>`

graph-grid-invalid = `<graph>`: saan a maawatan ti grid="{ $grid }". Masapul a none, medium, dense, wenno dua a positibo a numero a nagsina iti espasio, a kas ti grid="1 0.5". Awan ti grid a maidrowing.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: saan a suportado ti xLabelPosition="left" iti renderer a prefigure; usaren ti kababalin ti kanawan a posision.

prefigure-y-label-position-unsupported = `<graph>`: saan a suportado ti yLabelPosition="bottom" iti renderer a prefigure; usaren ti kababalin ti akin-ngato a posision.

prefigure-invalid-axis-bounds = `<graph>`: imbalido dagiti benneg ti aksis para iti konbersion a prefigure; usaren ti kasisigud a bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: imbalido ti kaakaba para iti konbersion a prefigure; usaren ti kasisigud a kaakaba ti diagram a 425.

prefigure-invalid-aspect-ratio = `<graph>`: imbalido ti aspectRatio para iti konbersion a prefigure; usaren ti kasisigud nga aspect ratio a 1.

prefigure-grid-spacing-too-fine = `<graph>`: nakaringgat unay ti nagbaetan ti grid para kadagiti patingga ti aksis; mailaksid ti grid iti renderer a prefigure.

prefigure-annotations-not-rendered = `<graph>`: saan a mairender dagiti annotation no saan a ti renderer a PreFigure ti maus-usar.

multiple-annotations-children = Adu nga anak nga `<annotations>` ti nasarakan iti `<graph>`; mailaksid amin malaksid iti maudi.

## Referring to other components

copy-unrecognized-component-type = Saan a mabalin nga i-extend wenno kopiaen ti saan a mabigbig a kita ti komponente: { $type }.

copy-prop-not-found = Saan a nasarakan ti prop a { $property } iti komponente a kita { $component }

collect-no-source = Awan ti nasarakan a source para iti collect.

collect-invalid-component-type = Saan a mabalin nga urnongen dagiti komponente a kita `<{ $component }>` ta imbalido a kita ti komponente.

reference-index-unavailable = Saan a matukoy ti indeks a `{ $reference }`

## `<callAction>`

component-action-unavailable = Saan a maawagan ti { $action } iti komponente a `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Imbalido ti langa ti datos.  Saan nga agpapada ti kaatiddog dagiti intar. Nasarakan iti componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Adda agpada a nagan ti adigi ti datos.  Nasarakan iti componentIdx :{ $componentIdx }

data-frame-missing-column-name = Awan ti nagan ti maysa nga adigi ti datos.  Nasarakan iti componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Ti award daytoy a sungbat ket naibatay iti mismo a naipatulod a sungbat ti answer tag, ket agbanagto daytoy iti saan a namnamaen a kababalin.

answer-max-num-attempts-in-section-wide-check-work = Awan ti epekto ti panangisaad iti `maxNumAttempts` iti maysa nga `<answer>` iti uneg ti kontenedor nga addaan iti `sectionWideCheckWork`, ta ti kontenedor ti mangtengngel iti bilang dagiti padas. Isaad ti `maxNumAttempts` iti kontenedor.

nested-section-wide-check-work-max-num-attempts = Awan ti epekto ti panangisaad iti `maxNumAttempts` iti kontenedor nga addaan iti `sectionWideCheckWork` nga adda iti uneg ti sabali a kontenedor nga addaan iti `sectionWideCheckWork`, ta ti akinruar a kontenedor ti mangtengngel iti bilang dagiti padas. Isaad ti `maxNumAttempts` iti akinruar a kontenedor.

# No select: «atributo» is the same word for one and for many.
answer-attributes-need-symbolic-equality = Awanto ti epekto ti atributo a { $attributes } no saan a naisaad ti symbolicEquality.

answer-invalid-type = Imbalido a kita para iti sungbat: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Gapu ta awan ti nagan ti komponente a `<{ $component }>`, saan a mabalin nga usaren para iti atributo ti module

module-attribute-name-already-defined = Saan a mabalin nga usaren ti komponente a `<{ $component } name="{ $name }">` a kas atributo ti module gapu ta addaan ti kita a komponente nga `<module>` iti atributo a "{ $name }".

conditional-content-condition-ignored = Mailaksid ti atributo a `condition` iti komponente a `<conditionalContent>` nga addaan kadagiti anak a case wenno else.

slider-markers-type-mismatch = Saan nga agtutunos ti kita dagiti marker iti kita ti slider.

pretzel-problem-needs-statement-and-answer = Imbalido a pretzel: masapul nga aglaon ti tunggal `<problem>` iti maysa a `<statement>` ken maysa nga `<answer>`.

pretzel-circuit-first-problem-distractor = Imbalido a pretzel: iti mode="circuit", saan a mabalin a distractor ti umuna a `<problem>`.

## Attribute values

# No select: «pateg» is the same word for one and for many.
attribute-invalid-values = Imbalido a pateg a { $values } para iti atributo a `{ $attribute }`; mailaksid.

attribute-must-be-references = Imbalido a pateg a `{ $value }` para iti atributo a `{ $attribute }`. Masapul a nabuo ti atributo kadagiti reperensia a mangrugi iti `$`.

math-input-invalid-function-names = <mathInput>: mailaksid dagiti imbalido a nagan ti punsion iti { $attribute }: { $names }. Masapul nga addaan ti tunggal nagan iti saan a nababbaba ngem 2 a karakter (letra wenno gitlo); mabalin a sumaruno ti maysa a suffix a `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Imbalido a kita ti komponente: `<{ $componentType }>`

attribute-repeated = Saan a mabalin nga uliten ti atributo a { $attribute }.

attribute-invalid-for-component = Imbalido nga atributo a "{ $attribute }" para iti komponente a kita `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Kurang ti kontraste ti depinision ti estilo a { $styleNumber } para iti { $context ->
        [text-on-background] kolor ti teksto maibusor iti kolor ti likudan
        [high-contrast] kolor a nangato ti kontraste maibusor iti kanbas
        [line] kolor ti linia maibusor iti kanbas
        [marker] kolor ti marker maibusor iti kanbas
       *[text-on-canvas] kolor ti teksto maibusor iti kanbas
    }{ $mode ->
        [dark] { " (nasipnget a mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; masapul ti saan a nababbaba ngem { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Uray no ti depinision ti estilo a { $styleNumber } ket addaan kadagiti naespesipika a kolor nga umanay ti kontraste da para iti nalawag a mode, kurang ti kontraste ti kolor ti teksto maibusor iti kolor ti likudan kadagiti kolor a naala para iti nasipnget a mode ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; masapul ti saan a nababbaba ngem { $threshold }:1). { $suggestion ->
        [available] Tapno umanay ti kontraste iti nasipnget a mode, nayonan ti kontraste ti nalawag a mode (kas pagarigan, isaad ti { $lightAttribute }="{ $lightColor }") wenno sukatan ti kolor ti nasipnget a mode (kas pagarigan, isaad ti { $darkAttribute }="{ $darkColor }").
       *[none] Tapno umanay ti kontraste iti nasipnget a mode, nayonan ti kontraste ti nalawag a mode wenno sukatan dagiti naala a kolor babaen ti textColorDarkMode ken/wenno backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Uray no ti depinision ti estilo a { $styleNumber } ket addaan iti naespesipika a kolor ti teksto nga umanay ti kontraste na para iti nalawag a mode, kurang ti kontraste ti kolor ti teksto a naala para iti nasipnget a mode maibusor iti kanbas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; masapul ti saan a nababbaba ngem { $threshold }:1). { $suggestion ->
        [available] Tapno umanay ti kontraste iti nasipnget a mode, nayonan ti kontraste ti nalawag a mode (kas pagarigan, isaad ti textColor="{ $lightColor }") wenno sukatan ti kolor ti nasipnget a mode (kas pagarigan, isaad ti textColorDarkMode="{ $darkColor }").
       *[none] Tapno umanay ti kontraste iti nasipnget a mode, nayonan ti kontraste ti nalawag a mode wenno sukatan ti naala a kolor babaen ti textColorDarkMode.
    }

section-multiple-style-palettes = Maysa laeng a <stylePalette> ti mabalin a pilien ti maysa a seksion; usaren ti maudi.

## Unique variants

variant-num-to-select-not-non-negative-integer = saan a madeterminaran dagiti naisangsangayan a baryante ti { $component } ta saan a saan a negatibo nga integer ti numToSelect.

variant-num-to-select-not-constant-number = saan a madeterminaran dagiti naisangsangayan a baryante ti { $component } ta saan a konstante a numero ti numToSelect.

variant-with-replacement-not-constant-boolean = saan a madeterminaran dagiti naisangsangayan a baryante ti { $component } ta saan a konstante a boolean ti withReplacement.

variant-select-weight-disables-unique = Maiddep dagiti naisangsangayan a baryante para iti select no adda opsion nga addaan iti selectWeight wenno selectForVariants a naespesipika

variant-coprime-undetermined = saan a madeterminaran dagiti naisangsangayan a baryante ti { $component } ta saan a madeterminaran no kanayon a false ti coprime.

variant-attribute-not-constant = saan a madeterminaran dagiti naisangsangayan a baryante ti { $component } ta saan a konstante ti { $attribute }.

variant-attribute-not-number = saan a madeterminaran dagiti naisangsangayan a baryante ti { $component } ta saan a numero ti { $attribute }.

variant-attribute-wrong-type-for-sequence =
    saan a madeterminaran dagiti naisangsangayan a baryante ti { $component } a kita { $type } ta ti { $attribute } ket saan a { $expected ->
        [letters-combination] kombinasion dagiti letra
        [math-expression] balido nga ekspresion a matematika
        [integer] integer
       *[number] numero
    }.

variant-length-not-integer = saan a madeterminaran dagiti naisangsangayan a baryante ti { $component } ta saan nga integer ti length.

variant-sort-not-implemented = saan pay a naipatungpal dagiti naisangsangayan a baryante ti maysa a { $component } nga addaan iti sort

variant-exclude-combinations-not-implemented = saan pay a naipatungpal dagiti naisangsangayan a baryante ti maysa a { $component } nga addaan iti excludeCombinations

variant-math-exclude-not-implemented = saan pay a naipatungpal dagiti naisangsangayan a baryante ti maysa a { $component } a kita math nga addaan iti exclude

variant-non-constant-exclude-not-implemented = saan pay a naipatungpal dagiti naisangsangayan a baryante ti maysa a { $component } nga addaan iti saan a konstante nga exclude

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: saan a suportado iti renderer a prefigure ti graph; nailaksid ti kaputotan.

prefigure-descendant-invalid-geometry = { $subject }: saan a limitado wenno saan a kompleto ti heometria; nailaksid ti kaputotan.

prefigure-curve-label-omitted = { $subject }: saan a suportado dagiti etiketa kadagiti nakombierte a kurba; nailaksid ti etiketa.

prefigure-curve-unsupported-definition-type = { $subject }: saan a suportado a kita ti depinision ti punsion a kurba a '{ $definitionType }'; nailaksid ti kaputotan.

prefigure-region-flip-functions-unsupported = { $subject }: saan a suportado nga atributo a flipFunctions iti regionBetweenCurves; nailaksid ti kaputotan.

prefigure-region-non-formula-child = { $subject }: dagiti anak a punsion a kita formula laeng ti suportado iti regionBetweenCurves; nailaksid ti kaputotan.

prefigure-label-position-unsupported =
    { $subject }: saan a suportado a labelPosition '{ $labelPosition }' para iti { $labelKind ->
        [line-family] etiketa ti pamilia ti linia
       *[point] etiketa ti punto
    }; usaren ti kasisigud a panagpartuat ti PreFigure.

prefigure-fill-style-unsupported = { $subject }: saan a suportado ti PreFigure iti estilo ti punno a '{ $fillStyle }'; agsubli iti napunno a kolor.

prefigure-line-style-unknown = { $subject }: saan a mabigbig nga estilo ti linia a '{ $lineStyle }', nailaksid iti output ti PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: naisilpo ti estilo ti marker a '{ $markerStyle }' iti estilo a 'diamond' ti PreFigure.

prefigure-marker-style-unsupported = { $subject }: saan a suportado ti PreFigure iti estilo ti marker a '{ $markerStyle }'; usaren ti kasisigud nga estilo.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: imbalido a `ref`; saan a matukoy ti target. Nailaksid ti annotation.

annotation-ref-multiple-targets = `<annotation>`: naiturong ti `ref` iti adu a target; usaren ti umuna a target.

annotation-ref-outside-graph = `<annotation>`: imbalido a `ref`; adda ti target iti ruar ti graph a naglaon kenkuana. Nailaksid ti annotation.

annotation-ref-unsupported-target = `<annotation>`: imbalido a `ref`; saan a suportado a grapikal a banag ti target iti konbersion a prefigure. Nailaksid ti annotation.

annotation-text-missing = `<annotation>`: awan wenno blangko ti `text`; agpataud iti blangko a teksto.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Adda nasarakan a nagsikkarud a panagpannuray.
       *[other] Adda nasarakan a nagsikkarud a panagpannuray a mairaman ti komponente a `<{ $componentType }>`.
    }

reference-no-referent = Awan ti nasarakan a tuktukoyen ti reperensia: `{ $reference }`

reference-multiple-referents = Adu ti nasarakan a tuktukoyen ti reperensia: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Imbalido a pormat ti atributo a { $attribute } ti `<{ $componentType }>`.

children-invalid = Imbalido dagiti anak ti `<{ $componentType }>`: nasarakan dagiti imbalido nga anak: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Imbalido a pateg a `{ $value }` para iti atributo a `{ $attribute }`, usaren ti pateg a `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Saan a nasarakan ti bersion ti DoenetML a { $version }.
       *[other] Saan a nasarakan ti bersion ti DoenetML a { $version }. Agsubli iti bersion a { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Imbalido a DoenetML: { $content }

parse-tag-missing-close-tag = Imbalido a DoenetML: Awan ti pangserra a tag ti tag a `{ $tag }`. Namnamaen ti tag a mangserra iti bagina wenno tag a `</{ $tagName }>`.

parse-tag-error = Imbalido a DoenetML: Adda biddut iti tag a `<{ $tagName }>`

parse-attribute-missing-value = Imbalido a DoenetML: Kasla awan ti pateg ti imbalido nga atributo a `{ $attribute }`.

parse-attribute-invalid = Imbalido a DoenetML: Imbalido nga atributo a `{ $attribute }`

parse-attribute-value-invalid = Imbalido a DoenetML: Imbalido a pateg ti atributo a `{ $value }`

parse-attribute-value-quote-mismatch = Imbalido a DoenetML: Imbalido a pateg ti atributo a `{ $value }`. Saan nga agtutunos dagiti marka ti sipi. Kasla awan ti maysa a `{ $quote }`

parse-open-tag-name-missing = Imbalido a DoenetML: Adda nasarakan a tag nga awan ti nagan na, kas pagarigan `<`

parse-tag-not-closed = Imbalido a DoenetML: Saan a naserraan ti tag a `{ $tag }` (kasla awan ti `>`).

parse-self-closing-tag-name-missing = Imbalido a DoenetML: Adda nasarakan a tag nga awan ti nagan na `<{ $content }>`

parse-self-closing-tag-not-closed = Imbalido a DoenetML: Saan a naserraan ti tag a `{ $tag }` (kasla awan ti `/>`).

parse-tag-invalid-attributes = Imbalido a DoenetML: Saan a balido ti tag a `{ $tag }`. Mabalin nga adda saan a husto nga atributo na.

parse-close-tag-name-missing = Imbalido a DoenetML: Adda nasarakan a pangserra a tag nga awan ti nagan na, kas pagarigan `</`

parse-attribute-value-unquoted = Masapul nga adda iti uneg dagiti marka ti sipi ti pateg ti atributo: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Imbalido a DoenetML: Adda nasarakan a pangserra a tag a `{ $tag }`, ngem awan ti kapada na a pangluktan a tag

parse-close-tag-mismatched = Imbalido a DoenetML: Saan nga agtutunos ti pangserra a tag. Namnamaen ti `</{ $expected }>`. Nasarakan ti `{ $found }`

parser-node-unconvertible = Saan a nakombierte ti node a { $node } iti node a Dast.

## Names

name-attribute-invalid =
    Imbalido nga atributo a name='{ $name }'. { $reason ->
        [characters] Mabalin nga aglaon dagiti nagan kadagiti letra, numero, underscore wenno gitlo laeng.
       *[start] Masapul nga agrugi dagiti nagan iti letra.
    }

component-name-invalid-start = Imbalido a nagan ti komponente a "{ $name }". Masapul nga agrugi dagiti nagan iti letra.

## `<answer>` sugar

answer-video-watched-missing-video = Masapul nga addaan ti answer a type videoWatched iti atributo a video

answer-video-watched-video-not-reference = Masapul nga addaan ti answer a type videoWatched iti atributo a video a maysa a reperensia

answer-name-not-single-text = Masapul nga addaan ti atributo a name ti answer iti maymaysa nga anak a text

## Referencing another document

external-doenetml-recursion-limit = Saan a naala ti akinruar a DoenetML gapu iti nakaad-adu a tukad ti panagulit-ulit. Adda kadi nagsikkarud a reperensia?

external-doenetml-unavailable = Saan a naala ti DoenetML manipud iti { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Imbalido a DoenetML ti naala manipud iti { $attribute }="{ $uri }": saan nga agtutunos iti kita ti komponente a "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Saanen a maus-usar ti atributo a `{ $from }`; usaren ti `{ $to }`.
       *[other] [deprecation] Saanen a maus-usar ti atributo a `{ $from }` iti `<{ $component }>`; usaren ti `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Saanen a maus-usar ti atributo a `{ $from }` ket mailaksid gapu ta naespesipika met ti `{ $to }`.
       *[other] [deprecation] Saanen a maus-usar ti atributo a `{ $from }` iti `<{ $component }>` ket mailaksid gapu ta naespesipika met ti `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Saanen a maus-usar ti atributo a `{ $attribute }` iti `<{ $component }>` ket mailaksid.

deprecated-attribute-to-child = [deprecation] Saanen a maus-usar ti atributo a `{ $attribute }` iti `<{ $component }>`; usaren ti anak a `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Saanen a maus-usar ti pateg a `{ $value }` ti atributo a `{ $attribute }` iti `<{ $component }>`; usaren ti `{ $to }`.


## Language coverage

pluralize-english-only = Ti `<pluralize>` ket mabalin na laeng a pagpaadduen ti Ingles, isu a saan a masukatan ti teksto na iti dokumento a naisurat iti { $locale }. Isurat a mismo ti porma a paadu, wenno isaad daytoy babaen ti atributo a `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Ti elemento a `<{ $tag }>` ket saan a mabigbig nga elemento ti Doenet.

schema-element-not-allowed-at-root = Saan a mapalubosan ti elemento a `<{ $tag }>` iti ramut ti dokumento.

schema-element-not-allowed-inside = Saan a mapalubosan ti elemento a `<{ $tag }>` iti uneg ti `<{ $parent }>`.

schema-attribute-unrecognized = Awan ti atributo a managan iti `{ $attribute }` ti elemento a `<{ $tag }>`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Masapul a listaan ti atributo a `{ $attribute }` ti elemento a `<{ $tag }>` a ti tunggal banag na ket maysa kadagiti: { $allowed }
       *[other] Masapul a maysa kadagiti sumaganad ti atributo a `{ $attribute }` ti elemento a `<{ $tag }>`: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Imbalido a nagan ti baryante para iti select.  Agparang ti nagan ti baryante a { $variantName } iti { $numOptions } nga opsion ngem ti bilang a pilien ket { $numToSelect }.

select-variant-name-without-options = Adda naespesipika a baryante para iti select ngem awan ti naespesipika nga opsion para iti mabalin a nagan ti baryante: { $variantName }.

select-variant-name-not-possible = Ti nagan ti baryante a { $variantName } a naespesipika para iti select ket saan a mabalin a nagan ti baryante.

select-too-few-options = Saan a mabalin a mangpili iti { $numToSelect } a komponente manipud iti { $numOptions } laeng.

select-from-sequence-too-few-values = Saan a mabalin a mangpili iti { $numToSelect } a pateg manipud iti sequence a kaatiddog na ket { $length }.

select-from-sequence-indices-count-mismatch = Masapul nga agtutunos ti bilang dagiti indeks a naespesipika para iti select ken ti bilang a pilien

select-from-sequence-indices-not-integers = Masapul nga integer amin dagiti indeks a naespesipika para iti select

select-from-sequence-index-excluded = Naespesipika ti indeks ti selectfromsequence a nailaksid

select-from-sequence-indices-excluded-combination = Naespesipika dagiti indeks ti selectfromsequence a maysa a nailaksid a kombinasion

select-from-sequence-coprime-not-positive-integers = Saan a mabalin a mangpili kadagiti kombinasion a coprime ta saan a positibo nga integer ti mapilpili.

select-from-sequence-coprime-common-factor = Saan a mabalin a mangpili kadagiti numero a coprime. Aggiddan dagiti amin a posible a pateg iti maysa a paktor. (Masapul a coprime ti naespesipika a pateg ti "from" wenno "to" iti "step".)

select-from-sequence-coprime-single-number = Saan a mabalin a mangpili kadagiti kombinasion a coprime manipud iti maymaysa a numero a saan a 1.

select-from-sequence-excluded-too-many-combinations = Nailaksid ti nasursurok ngem 70% dagiti kombinasion iti selectFromSequence

select-from-sequence-coprime-none-found = Saan a nakapili kadagiti numero a coprime. Aggiddan dagiti amin a posible a pateg iti maysa a paktor.

select-from-sequence-too-few-unique-values = Saan a mabalin a mangpili iti { $numToSelect } a naisangsangayan a pateg manipud iti sequence a kaatiddog na ket { $numPossibleValues }

select-prime-numbers-too-few-values = Saan a mabalin a mangpili iti { $numToSelect } a pateg manipud iti listaan dagiti prime a kaatiddog na ket { $numValues }

select-prime-numbers-values-count-mismatch = Masapul nga agtutunos ti bilang dagiti pateg a naespesipika para iti select ken ti bilang a pilien

select-prime-numbers-values-not-prime = Masapul nga adda iti listaan dagiti prime ti amin a pateg a naespesipika para iti select prime number

select-prime-numbers-values-excluded-combination = Ti naespesipika a pateg ti selectPrimeNumbers ket maysa a nailaksid a kombinasion

select-prime-numbers-excluded-too-many-combinations = Nailaksid ti nasursurok ngem 70% dagiti kombinasion iti selectPrimeNumbers

select-random-combination-fluke = Gapu iti nakaskasdaaw a gasat, saan a nakapili iti kombinasion dagiti nagraman a pateg

select-random-value-fluke = Gapu iti nakaskasdaaw a gasat, saan a nakapili iti nagraman a pateg
