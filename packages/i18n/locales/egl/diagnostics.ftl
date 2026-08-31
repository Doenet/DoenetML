# Emilian (emiliàn) diagnostics. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **`egl` is the Emilian half** of what the widely-seen `eml` tag lumps
# together with Romagnol; see `chrome.ftl`. The variety is **Bolognese**, in
# the Vitali/Lepri lexicographic orthography, and the note on the letters «â ê
# î ô û», «å», «ä», «ç» and «ṡ» is there too.
#
# **The quickest check that a line here is Emilian** and not Italian in
# Bolognese spelling: the two-part negation **«an … brîṡa»** («an s pôl brîṡa»,
# «an n é brîṡa vàlid»), the obligatory subject clitic on a finite verb («al
# é», «i én», «ai é», «al à»), the past participle in «-è» / «-èda», «quasst»
# for *this*, «tótt» for *all*, «gnínta» for *nothing*, «pió» for *more*. A
# sentence in this file with none of those is very likely still Italian.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber` — are part of the language, not prose,
# and stay in English exactly as written. So does anything quoted back from the
# author's own source, and so do `WCAG AA`, `DoenetML`, `PreFigure` and
# `prefigure`, which are names. Digits render in Latin numerals everywhere.
#
# **Counts.** CLDR has **no** plural rules for `egl`, so **no** `zero`, `two`,
# `few` or `many` branch appears anywhere in this locale. `[one]`/`*[other]` is
# kept, and only that: it is the split the runtime fallback makes, it is the
# split Bolognese itself needs (the feminine plural is a real ending and the
# verb agrees even where a masculine noun does not), and in
# `field-function-wrong-num-outputs` the two branches say different things
# rather than the same thing twice. Every **symbolic** selector — `$type`,
# `$mode`, `$reason`, `$context`, `$suggestion`, `$alternative`, `$fallback`,
# `$expected`, `$labelKind`, `$isList`, `$componentType` — is kept byte for
# byte from English, keys included.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } al vén ignorè quand ch'as dà dû pónt finèl
       *[other] { $attributes } i vénnen ignorè quand ch'as dà dû pónt finèl
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } al vén ignorè quand ch'as dà un pónt finèl e un pónt ed mèż
       *[other] { $attributes } i vénnen ignorè quand ch'as dà un pónt finèl e un pónt ed mèż
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset an n à inción efèt sänza un pónt ed mèż

## `<line>`

line-points-undetermined-dimensions = Lénnia par pónt ed dimensiån brîṡa determinè.

line-points-too-few-dimensions = Na lénnia la à da pasèr par pónt d'almànc dåu dimensiån.

line-points-depend-on-variables = La lénnia la pâsa par pónt ch'i dipànden da variâbil: { $variables }.

line-equation-invalid-format = Furmè brîṡa vàlid pr l'equaziån dla lénnia int äl variâbil { $variable1 } e { $variable2 }.

## `<ray>`

ray-overprescribed-through = La semirèta l'é definé da through, endpoint e direction.  Al through dè al vén ignorè.

ray-dimension-mismatch = numDimensions an n va brîṡa d'acôrd int la semirèta.

## `<vector>`

vector-overprescribed-head = Al vetåur l é definé da head, tail e displacement.  Al head dè al vén ignorè.

vector-dimension-mismatch = numDimensions an n va brîṡa d'acôrd int al vetåur.

## Attracting and constraining

attract-to-without-nearest-point = An s pôl brîṡa tirèr vêrs un `<{ $component }>`, parché an n à brîṡa la variâbil ed stât nearestPoint.

constrain-to-without-nearest-point = An s pôl brîṡa vinculèr a un `<{ $component }>`, parché an n à brîṡa la variâbil ed stât nearestPoint.

constrain-to-interior-without-nearest-point = An s pôl brîṡa vinculèr al inetêren d'un `<{ $component }>`, parché an n à brîṡa la variâbil ed stât nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition al vén ignorè par un choiceInput ch'an n é brîṡa inline

## Ordering children by index

choice-input-indices-count-mismatch = As ignôra i índiz dè par choiceInput, parché al nûmer di índiz an và brîṡa d'acôrd con al nûmer di fiû choice.

pretzel-indices-count-mismatch = As ignôra i índiz dè par problem, parché al nûmer di índiz an và brîṡa d'acôrd con al nûmer di fiû problem.

shuffle-indices-count-mismatch = As ignôra i índiz dè par shuffle, parché al nûmer di índiz an và brîṡa d'acôrd con al nûmer di cumponént.

indices-ignored-out-of-range = As ignôra i índiz dè par { $component }, parché quèlc índiz l é fôra dl intervâl.

pretzel-indices-repeated = As ignôra i índiz dè par pretzel, parché quèlc índiz l é ripetó.

pretzel-circuit-first-index = As ignôra i índiz dè par pretzel int la modalitè circuit, parché al prémm índiz al à da èser 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Parché `<{ $component }>` al funzionna con di fiû ed tèst, as à da dèr un atribût `type`.

invalid-type-defaulting-to-math = Tîp { $type } brîṡa vàlid pr al cumponänt { $component }. Al à da èser ón tra math, text, number o boolean. As drôva math.

string-not-valid-component-to-arrange = Al tèst "{ $value }" an n é brîṡa un cumponänt vàlid par { $component }. As al ignôra.

## Types and variables

invalid-type-defaulting-to-number = Tîp { $type } brîṡa vàlid, as mètt al tîp a number.

invalid-variable-value = Valåur brîṡa vàlid d'una variâbil: `{ $value }`

## Variants

variant-index-must-be-number = L índiz ed variànt { $index } al à da èser un nûmer

variant-index-must-be-integer = L índiz ed variànt { $index } al à da èser un nûmer intêr

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` an n é brîṡa implementè par miṡûr aṡolût. As mètt äl larghèzz a relatîv.

side-by-side-absolute-margins = `<{ $component }>` an n é brîṡa implementè par miṡûr aṡolût. As mètt i mârgin a relatîv.

side-by-side-no-block-child = `<{ $component }>` brîṡa vàlid: al à da avair almànc un fiôl ed blòc.

## `<label>`

label-for-ignored-on-graphical = L atribût `for` só na `<label>` gràfica al vén ignorè.

label-for-must-resolve-to-one = L atribût `for` só `<label>` al à da riṡôlvres in giósst un cumponänt.

label-for-unresolved = L atribût `for` só `<label>` an s é brîṡa psó riṡôlver in un cumponänt.

label-for-answer-with-authored-inputs = L atribût `for` só `<label>` al fà riferimänt a un `<answer>` con di input scrétt a man; fà riferimänt drétt al input.

label-for-answer-without-input = L atribût `for` só `<label>` al fà riferimänt a un `<answer>` sänza un input da etichetèr.

label-for-must-reference-input-or-answer = L atribût `for` só `<label>` al à da fèr riferimänt a un input o a na rispòsta.

## Accessibility

accessibility-short-description-or-decorative = Pr l'acesibilitè, `<{ $component }>` al à da avair na descriziån cûrta o da èser segnè cme decoratîv.

accessibility-video-short-description = Pr l'acesibilitè, `<video>` al à da avair na descriziån cûrta.

accessibility-input-short-description-or-label = Pr l'acesibilitè, `<{ $component }>` al à da avair na descriziån cûrta o na etichèta.

accessibility-answer-input-short-description-or-label = Pr l'acesibilitè, un `<answer>` ch'al crêa un input al à da avair na descriziån cûrta o na etichèta.

accessibility-short-description-contains-math = Äl descriziån cûrt an n an da avair dänter di cumponént matemâtic cme `<{ $component }>`. Scrív la matemâtica con däl parôl.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } an n à brîṡa asè cuntrèst pr al tèst dal titol dla seziån (modalitè scûra) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ai vôl almànc { $threshold }:1).
       *[other] { $colorName } an n à brîṡa asè cuntrèst pr al tèst dal titol dla seziån ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ai vôl almànc { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Un `<circle>` par { $count } pónt an n é brîṡa implementè int al chèṡ che i pónt an n an brîṡa di valûr numêric.

circle-too-many-through-points = An s pôl brîṡa calcolèr un zércc par pió ed 3 pónt.

circle-overprescribed-radius-center-points = An s pôl brîṡa calcolèr un zércc con râg, zänter e pónt ed pasâg dè.

circle-center-with-multiple-points = An s pôl brîṡa calcolèr un zércc con zänter dè par pió d'1 pónt.

circle-radius-too-small = An s pôl brîṡa calcolèr al zércc: dè che la distanza tra i dû pónt l'é { $distance }, al râg dè { $radius } l é tròp cinno.

circle-radius-with-many-points = An s pôl brîṡa creèr un zércc par pió ed dû pónt con un râg dè.

circle-invalid-center-or-through-points = Zänter o pónt ed pasâg dal zércc brîṡa vàlid.

circle-radius-center-with-multiple-points = An s pôl brîṡa calcolèr al râg d'un zércc con zänter dè par pió d'1 pónt.

circle-change-radius-non-numerical = An s pôl brîṡa canbièr al râg d'un zércc con pónt ed pasâg brîṡa numêric

circle-radius-with-points-non-numerical = An s pôl brîṡa creèr un zércc par pió d'un pónt con un râg dè quand ch'an i é brîṡa di valûr numêric.

circle-change-center-non-numerical = Canbièr al zänter d'un zércc par pónt sänza valûr numêric an n é ancåura brîṡa implementè.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Brîṡa asè dimensiån pr al domìni dla funziån. Al domìni al à { $intervals } intervâl mo la funziån la à { $inputs ->
            [one] { $inputs } input
           *[other] { $inputs } input
        }.
       *[other] Brîṡa asè dimensiån pr al domìni dla funziån. Al domìni al à { $intervals } intervâl mo la funziån la à { $inputs ->
            [one] { $inputs } input
           *[other] { $inputs } input
        }.
    }

function-domain-invalid-format = Furmè brîṡa vàlid pr al domìni dla funziån.

function-ignoring-non-numerical =
    { $type ->
        [maximum] As ignôra un màsim dla funziån ch'an n é brîṡa numêric.
        [minimum] As ignôra un mínnim dla funziån ch'an n é brîṡa numêric.
        [extremum] As ignôra un estrêm dla funziån ch'an n é brîṡa numêric.
        [point] As ignôra un pónt dla funziån ch'an n é brîṡa numêric.
        [slope] As ignôra na pendänza dla funziån ch'an n é brîṡa numêrica.
       *[other] As ignôra un { $type } dla funziån ch'an n é brîṡa numêric.
    }

function-ignoring-empty =
    { $type ->
        [maximum] As ignôra un màsim vûd dla funziån.
        [minimum] As ignôra un mínnim vûd dla funziån.
        [extremum] As ignôra un estrêm vûd dla funziån.
        [point] As ignôra un pónt vûd dla funziån.
       *[other] As ignôra un { $type } vûd dla funziån.
    }

function-points-too-close = La funziån la à dû pónt tròp vṡén ón cl èter. An s pôl brîṡa definîr la funziån.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Äl iteraziån d'na funziån äli én posébil såul se al nûmer di input l é cunpâgn al nûmer di output. Sta funziån qué la à { $inputs } input e { $outputs ->
            [one] { $outputs } output
           *[other] { $outputs } output
        }.
       *[other] Äl iteraziån d'na funziån äli én posébil såul se al nûmer di input l é cunpâgn al nûmer di output. Sta funziån qué la à { $inputs } input e { $outputs ->
            [one] { $outputs } output
           *[other] { $outputs } output
        }.
    }

## `<sequence>`

sequence-invalid-length = Lunghèzza dla sequänza brîṡa vàlida.  La à da èser un nûmer intêr brîṡa negatîv.

sequence-invalid-step = Pâs dla sequänza brîṡa vàlid.  Al à da èser un nûmer par na sequänza ed tîp { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" brîṡa vàlid d'na sequänza ed nûmer.  Al à da èser un nûmer.

sequence-invalid-endpoint-letters = "{ $attribute }" brîṡa vàlid d'na sequänza ed lèter.  Al à da èser na cunbinaziån ed lèter.

sequence-invalid-endpoint = "{ $attribute }" dla sequänza brîṡa vàlid.

select-from-sequence-coprime-not-numbers = coprime al vén ignorè parché an s ṡcanpa brîṡa di nûmer

select-from-sequence-coprime-with-exclude-combinations = coprime al vén ignorè parché as é dè excludeCombinations

## Resolving a `target`

target-not-found = target brîṡa vàlid par `<{ $source }>`: an s trôva brîṡa al destinatèri.

target-state-variable-not-found = target brîṡa vàlid par `<{ $source }>`: an s trôva brîṡa na variâbil ed stât ch'la s ciâma "{ $property }" só un `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Äl variâbil ed `<odeSystem>` äli an da èser difarénti dala variâbil indipendänta.

ode-system-duplicate-variable-names = An s pôl brîṡa definîr äl funziån RHS dl ODE con di nómm ed variâbil dipendénti ripetó.

ode-system-rhs-function-error = An s pôl brîṡa definîr la funziån RHS dl ODE.  Erôr int la creaziån dla funziån mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = An s pôl brîṡa definîr un àngol tra { $count } lénni

angle-invalid-through-point = Pónt brîṡa vàlid in through ed `<angle>`

parabola-vertex-too-many-points = Na parâbola con vêrtiz par pió d'1 pónt an n é ancåura brîṡa implementè.

parabola-too-many-points = Na parâbola par pió ed 3 pónt an n é ancåura brîṡa implementè.

intersection-too-many-items = L interséziån ed pió ed dû elemént an n é ancåura brîṡa implementè

## Other math components

ionic-compound-not-two-ions = Un cunpòst iònic ed quèl èter che dû ion an n é ancåura brîṡa implementè.

ionic-compound-needs-cation-and-anion = Al cunpòst iònic l é implementè såul par un cation e un anion.

solve-equations-cannot-evaluate = An s pôl brîṡa riṡôlver l'equaziån parché an s é brîṡa psó valutèrla: { $equation }

math-operators-operand-number-required = As à da dèr un operandNumber quand ch'as tîra fôra un operànd matemâtic.

eigen-decomposition-failed = An s é brîṡa psó calcolèr i autovalûr dla matrîz

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: al paràmetro { $parameters } an cunpèr brîṡa int al modèl, e acsé al andrà sänper insàmm a un vûd.
       *[other] `<matchesPattern>`: i paràmetri { $parameters } an cunpèren brîṡa int al modèl, e acsé i andaràn sänper insàmm a un vûd.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: an s pôl brîṡa interpretèr grid="{ $grid }". Al à da èser none, medium, dense o dû nûmer poṡitîv divîṡ da un spâzi, cme grid="1 0.5". An s diṡêgna inciónna gradèla.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` al à biṡåggn d'na funziån con { $expected ->
        [one] un output, la pendänza y' in ògni pónt, cme `y - x`
       *[other] dû output, al vetåur in ògni pónt, cme `(y, -x)`
    }, mo la funziån ch'ai é stè dè la à { $found ->
        [one] { $found } output
       *[other] { $found } output
    }. { $alternative ->
        [none] An s diṡêgna gnínta.
       *[other] `<{ $alternative }>` l é al cumponänt par cla funziån. An s diṡêgna gnínta.
    }

field-function-attribute-ignored-with-child = L atribût `function` al vén ignorè parché la funziån l'é dè ànc dänter int al cumponänt; as drôva cla dänter. Dà la funziån såul in ónna däl dåu manîr.

field-variables-ignored =
    `<{ $component }>`: l atribût `variables` al nómmna äl variâbil d'un'esprasiån scrétta drétt dänter int al cumponänt. { $reason ->
        [function-child] La funziån qué l'é dè cme fiôl `<function>`, ch'al nómmna äl sô variâbil, e acsé `variables` al vén ignorè.
       *[no-expression] Qué an i é inciónna esprasiån ed cla sôrta, e acsé `variables` al vén ignorè.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" an n é brîṡa suportè int al renderiżadåur prefigure; as drôva al cunpurtamänt dla poṡiziån a drétta.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" an n é brîṡa suportè int al renderiżadåur prefigure; as drôva al cunpurtamänt dla poṡiziån in èlt.

prefigure-invalid-axis-bounds = `<graph>`: lémmit di âs brîṡa vàlid pr la cunversiån prefigure; as drôva al bbox predefiné (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: larghèzza brîṡa vàlida pr la cunversiån prefigure; as drôva la larghèzza predefiné dal diagrâma 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio brîṡa vàlid pr la cunversiån prefigure; as drôva la propurziån predefiné 1.

prefigure-grid-spacing-too-fine = `<graph>`: la gradèla l'é tròp fénna pr i lémmit di âs; la gradèla la vén lasè fôra int al renderiżadåur prefigure.

prefigure-annotations-not-rendered = `<graph>`: äl anotaziån an vénnen brîṡa diṡegnè quand ch'an s drôva brîṡa al renderiżadåur PreFigure.

multiple-annotations-children = As é truvè pió fiû `<annotations>` in `<graph>`; tótt fôra che l ûltum i vénnen ignorè.

## Referring to other components

copy-unrecognized-component-type = An s pôl brîṡa estànder o copièr un tîp ed cumponänt brîṡa cgnusó: { $type }.

copy-prop-not-found = An s é brîṡa truvè la proprietè { $property } só un cumponänt ed tîp { $component }

collect-no-source = Inciónna surżänt truvè par collect.

collect-invalid-component-type = An s pôl brîṡa tirèr insàmm di cumponént ed tîp `<{ $component }>`, parché l é un tîp ed cumponänt brîṡa vàlid.

reference-index-unavailable = An s pôl brîṡa fèr riferimänt al índiz `{ $reference }`

## `<callAction>`

component-action-unavailable = An s pôl brîṡa ciamèr { $action } só al cumponänt `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = I dèt i an na fôrma brîṡa vàlida.  Äl rîg äli an däl lunghèzz difarénti. Truvè in componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = I dèt i an di nómm ed colòna ripetó.  Truvè in componentIdx :{ $componentIdx }

data-frame-missing-column-name = Ai dèt ai manca un nómm ed colòna.  Truvè in componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Un prêmi par sta rispòsta qué l é baṡè só la rispòsta mandè dal tag answer istàss, e quasst al purtarà a un cunpurtamänt brîṡa spetè.

answer-max-num-attempts-in-section-wide-check-work = Métter `maxNumAttempts` só un `<answer>` dänter in un cuntgnidåur con `sectionWideCheckWork` an n à inción efèt, parché al nûmer di tentatîv l é cuntrolè dal cuntgnidåur. Mèt `maxNumAttempts` só al cuntgnidåur invêzi.

nested-section-wide-check-work-max-num-attempts = Métter `maxNumAttempts` só un cuntgnidåur con `sectionWideCheckWork` ch'al stà dänter in un èter cuntgnidåur con `sectionWideCheckWork` an n à inción efèt, parché al nûmer di tentatîv l é cuntrolè dal cuntgnidåur ed fôra. Mèt `maxNumAttempts` só al cuntgnidåur ed fôra invêzi.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] L atribût { $attributes } an n avrà inción efèt sänza symbolicEquality mìs.
       *[other] I atribût { $attributes } an avràn inción efèt sänza symbolicEquality mìs.
    }

answer-invalid-type = Tîp brîṡa vàlid pr la rispòsta: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Dato che al cumponänt `<{ $component }>` an n à brîṡa un nómm, an s al pôl brîṡa druvèr cme atribût d'un mòdul

module-attribute-name-already-defined = Al cumponänt `<{ $component } name="{ $name }">` an s al pôl brîṡa druvèr cme atribût d'un mòdul parché al tîp ed cumponänt `<module>` al à bèle un atribût "{ $name }" definé.

conditional-content-condition-ignored = L atribût `condition` al vén ignorè só un cumponänt `<conditionalContent>` con di fiû case o else.

slider-markers-type-mismatch = Al tîp di marcadûr an và brîṡa d'acôrd con al tîp dal slider.

pretzel-problem-needs-statement-and-answer = pretzel brîṡa vàlid: ògni `<problem>` al à da avair dänter un `<statement>` e un `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel brîṡa vàlid: in mode="circuit", al prémm `<problem>` an pôl brîṡa èser un distratåur.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Valåur brîṡa vàlid { $values } pr l atribût `{ $attribute }`; as al ignôra.
       *[other] Valûr brîṡa vàlid { $values } pr l atribût `{ $attribute }`; as i ignôra.
    }

attribute-must-be-references = Valåur brîṡa vàlid `{ $value }` pr l atribût `{ $attribute }`. L atribût al à da èser fât ed riferimént ch'i cuménzen con un `$`.

math-input-invalid-function-names = <mathInput>: as é ignorè di nómm ed funziån brîṡa vàlid in { $attribute }: { $names }. Al tòc mustrè ed ògni nómm al à da avair almànc 2 caràter (lèter o tratén); dåpp ai pôl gnîr un sufés opzionèl `|<alternatîva mathspeak>`.

## Building components from the source

component-type-invalid = Tîp ed cumponänt brîṡa vàlid: `<{ $componentType }>`

attribute-repeated = An s pôl brîṡa ripêter l atribût { $attribute }.

attribute-invalid-for-component = Atribût "{ $attribute }" brîṡa vàlid par un cumponänt ed tîp `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    La definiziån ed stîl { $styleNumber } an n à brîṡa asè cuntrèst par { $context ->
        [text-on-background] al colåur dal tèst contra al colåur dal fånd
        [high-contrast] al colåur a èlt cuntrèst contra la têla
        [line] al colåur dla lénnia contra la têla
        [marker] al colåur dal marcadåur contra la têla
       *[text-on-canvas] al colåur dal tèst contra la têla
    }{ $mode ->
        [dark] { " (modalitè scûra)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ai vôl almànc { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Ànc s' la definiziån ed stîl { $styleNumber } la à di colûr ch'i dan asè cuntrèst pr la modalitè cèra, i colûr pr la modalitè scûra tirè fôra da sti valûr an an brîṡa asè cuntrèst tra al colåur dal tèst e al colåur dal fånd ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ai vôl almànc { $threshold }:1). { $suggestion ->
        [available] Par avair asè cuntrèst int la modalitè scûra, o èlza al cuntrèst dla modalitè cèra (p.eṡ. mèt { $lightAttribute }="{ $lightColor }") o pâsa dnanz al colåur dla modalitè scûra (p.eṡ. mèt { $darkAttribute }="{ $darkColor }").
       *[none] Par avair asè cuntrèst int la modalitè scûra, èlza al cuntrèst dla modalitè cèra o pâsa dnanz ai colûr tirè fôra con textColorDarkMode e/o backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ànc s' la definiziån ed stîl { $styleNumber } la à un colåur dal tèst ch'al dà asè cuntrèst pr la modalitè cèra, al colåur dal tèst pr la modalitè scûra tirè fôra da cal valåur an n à brîṡa asè cuntrèst contra la têla ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ai vôl almànc { $threshold }:1). { $suggestion ->
        [available] Par avair asè cuntrèst int la modalitè scûra, o èlza al cuntrèst dla modalitè cèra (p.eṡ. mèt textColor="{ $lightColor }") o pâsa dnanz al colåur dla modalitè scûra (p.eṡ. mèt textColorDarkMode="{ $darkColor }").
       *[none] Par avair asè cuntrèst int la modalitè scûra, èlza al cuntrèst dla modalitè cèra o pâsa dnanz al colåur tirè fôra con textColorDarkMode.
    }

section-multiple-style-palettes = Na seziån la pôl ṡcanpèr såul un <stylePalette>; as drôva l ûltum.

## Unique variants

variant-num-to-select-not-non-negative-integer = an s pôl brîṡa determinèr i variànt ûnic ed { $component }, parché numToSelect an n é brîṡa un nûmer intêr brîṡa negatîv.

variant-num-to-select-not-constant-number = an s pôl brîṡa determinèr i variànt ûnic ed { $component }, parché numToSelect an n é brîṡa un nûmer custànt.

variant-with-replacement-not-constant-boolean = an s pôl brîṡa determinèr i variànt ûnic ed { $component }, parché withReplacement an n é brîṡa un boolean custànt.

variant-select-weight-disables-unique = I variànt ûnic par select i én dṡativè s' n'opziån la à selectWeight o selectForVariants dè

variant-coprime-undetermined = an s pôl brîṡa determinèr i variànt ûnic ed { $component }, parché an s pôl brîṡa determinèr che coprime al séppa sänper fâls.

variant-attribute-not-constant = an s pôl brîṡa determinèr i variànt ûnic ed { $component }, parché { $attribute } an n é brîṡa na custànta.

variant-attribute-not-number = an s pôl brîṡa determinèr i variànt ûnic ed { $component }, parché { $attribute } an n é brîṡa un nûmer.

variant-attribute-wrong-type-for-sequence =
    an s pôl brîṡa determinèr i variànt ûnic ed { $component } ed tîp { $type }, parché { $attribute } an n é brîṡa { $expected ->
        [letters-combination] na cunbinaziån ed lèter
        [math-expression] un'esprasiån matemâtica vàlida
        [integer] un nûmer intêr
       *[number] un nûmer
    }.

variant-length-not-integer = an s pôl brîṡa determinèr i variànt ûnic ed { $component }, parché length an n é brîṡa un nûmer intêr.

variant-sort-not-implemented = i variànt ûnic d'un { $component } con sort an n én ancåura brîṡa implementè

variant-exclude-combinations-not-implemented = i variànt ûnic d'un { $component } con excludeCombinations an n én ancåura brîṡa implementè

variant-math-exclude-not-implemented = i variànt ûnic d'un { $component } ed tîp math con exclude an n én ancåura brîṡa implementè

variant-non-constant-exclude-not-implemented = i variànt ûnic d'un { $component } con un exclude brîṡa custànt an n én ancåura brîṡa implementè

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: an n é brîṡa suportè int al renderiżadåur prefigure dal gràfic; al dscendänt al vén saltè.

prefigure-descendant-invalid-geometry = { $subject }: geometrî brîṡa finé o brîṡa cumplêta; al dscendänt al vén saltè.

prefigure-curve-label-omitted = { $subject }: äl etichèt an n én brîṡa suportè só i elemént ed cûrva cunverté; l'etichèta la vén lasè fôra.

prefigure-curve-unsupported-definition-type = { $subject }: tîp ed definiziån dla cûrva '{ $definitionType }' brîṡa suportè; al dscendänt al vén saltè.

prefigure-region-flip-functions-unsupported = { $subject }: atribût flipFunctions brîṡa suportè só regionBetweenCurves; al dscendänt al vén saltè.

prefigure-region-non-formula-child = { $subject }: såul äl funziån fiôl ed tîp fôrmula äli én suportè só regionBetweenCurves; al dscendänt al vén saltè.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' brîṡa suportè par { $labelKind ->
        [line-family] n'etichèta dla famajja däl lénni
       *[point] n'etichèta ed pónt
    }; as drôva l alineamänt predefiné ed PreFigure.

prefigure-fill-style-unsupported = { $subject }: al stîl d'impiniduréa '{ $fillStyle }' an n é brîṡa suportè da PreFigure; as tåurna a n'impiniduréa pénna.

prefigure-line-style-unknown = { $subject }: al stîl ed lénnia brîṡa cgnusó '{ $lineStyle }' l é lasè fôra dl output ed PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: al stîl ed marcadåur '{ $markerStyle }' l é stè mapè só al stîl PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: al stîl ed marcadåur '{ $markerStyle }' an n é brîṡa suportè da PreFigure; as drôva al stîl predefiné.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` brîṡa vàlid; an s pôl brîṡa riṡôlver al destinatèri. L'anotaziån la vén lasè fôra.

annotation-ref-multiple-targets = `<annotation>`: `ref` l é stè riṡôlt in pió destinatèri; as drôva al prémm.

annotation-ref-outside-graph = `<annotation>`: `ref` brîṡa vàlid; al destinatèri l é fôra dal gràfic ch'al al tén dänter. L'anotaziån la vén lasè fôra.

annotation-ref-unsupported-target = `<annotation>`: `ref` brîṡa vàlid; al destinatèri an n é brîṡa un ogèt gràfic suportè int la cunversiån prefigure. L'anotaziån la vén lasè fôra.

annotation-text-missing = `<annotation>`: `text` al manca o l é vûd; as manda fôra tèst vûd.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] As é truvè na dipendänza zircolèr.
       *[other] As é truvè na dipendänza zircolèr ch'la ciapa dänter un cumponänt `<{ $componentType }>`.
    }

reference-no-referent = Inción referänt truvè pr al riferimänt: `{ $reference }`

reference-multiple-referents = Pió referént truvè pr al riferimänt: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Furmè brîṡa vàlid pr l atribût { $attribute } ed `<{ $componentType }>`.

children-invalid = Fiû brîṡa vàlid par `<{ $componentType }>`: as é truvè di fiû brîṡa vàlid: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valåur brîṡa vàlid `{ $value }` pr l atribût `{ $attribute }`, as drôva al valåur `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Versiån ed DoenetML { $version } brîṡa truvè.
       *[other] Versiån ed DoenetML { $version } brîṡa truvè. As tåurna ala versiån { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML brîṡa vàlid: { $content }

parse-tag-missing-close-tag = DoenetML brîṡa vàlid: Al tag `{ $tag }` an n à brîṡa un tag ed seradûra. As spetèva un tag ch'as sèra da par ló o un tag `</{ $tagName }>`.

parse-tag-error = DoenetML brîṡa vàlid: Erôr int al tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML brîṡa vàlid: Al pèr ch'al atribût brîṡa vàlid `{ $attribute }` ai manca un valåur.

parse-attribute-invalid = DoenetML brîṡa vàlid: Atribût brîṡa vàlid `{ $attribute }`

parse-attribute-value-invalid = DoenetML brîṡa vàlid: Valåur d'atribût brîṡa vàlid `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML brîṡa vàlid: Valåur d'atribût brîṡa vàlid `{ $value }`. Äl virgulèt an van brîṡa d'acôrd. Al pèr ch'at manca un `{ $quote }`

parse-open-tag-name-missing = DoenetML brîṡa vàlid: As é truvè un tag sänza nómm ed tag, p.eṡ. `<`

parse-tag-not-closed = DoenetML brîṡa vàlid: Al tag `{ $tag }` an n é brîṡa stè serrè (al pèr ch'ai manca un `>`).

parse-self-closing-tag-name-missing = DoenetML brîṡa vàlid: As é truvè un tag sänza nómm ed tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML brîṡa vàlid: Al tag `{ $tag }` an n é brîṡa stè serrè (al pèr ch'ai manca `/>`).

parse-tag-invalid-attributes = DoenetML brîṡa vàlid: Al tag `{ $tag }` an n é brîṡa vàlid. Al psré avair di atribût ṡbaglè.

parse-close-tag-name-missing = DoenetML brîṡa vàlid: As é truvè un tag ed seradûra sänza nómm ed tag, p.eṡ. `</`

parse-attribute-value-unquoted = I valûr di atribût i an da èser tra virgulèt: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML brîṡa vàlid: As é truvè al tag ed seradûra `{ $tag }`, mo inción tag d'avridûra corispundänt

parse-close-tag-mismatched = DoenetML brîṡa vàlid: Tag ed seradûra ch'an và brîṡa d'acôrd. As spetèva `</{ $expected }>`. As é truvè `{ $found }`

parser-node-unconvertible = An s é brîṡa psó cunvertîr al nôd { $node } in un nôd Dast.

## Names

name-attribute-invalid =
    Atribût brîṡa vàlid name='{ $name }'. { $reason ->
        [characters] I nómm i pôlen avair såul lèter, nûmer, sotlineadûr o tratén.
       *[start] I nómm i an da cuminzèr con na lètra.
    }

component-name-invalid-start = Nómm ed cumponänt brîṡa vàlid "{ $name }". I nómm i an da cuminzèr con na lètra.

## `<answer>` sugar

answer-video-watched-missing-video = Na rispòsta ed tîp videoWatched la à da avair un atribût video

answer-video-watched-video-not-reference = Na rispòsta ed tîp videoWatched la à da avair un atribût video ch'al séppa un riferimänt

answer-name-not-single-text = L atribût name dla rispòsta al à da avair un såul fiôl ed tèst

## Referencing another document

external-doenetml-recursion-limit = An s pôl brîṡa recuperèr al DoenetML ed fôra par tròp livî ed ricursiån. Ai éla un riferimänt zircolèr?

external-doenetml-unavailable = An s pôl brîṡa recuperèr al DoenetML da { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML brîṡa vàlid recuperè da { $attribute }="{ $uri }": an và brîṡa d'acôrd con al tîp ed cumponänt "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] L atribût `{ $from }` l é surpasè; drôva `{ $to }` invêzi.
       *[other] [deprecation] L atribût `{ $from }` só `<{ $component }>` l é surpasè; drôva `{ $to }` invêzi.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] L atribût `{ $from }` l é surpasè e al vén ignorè parché as é dè ànc `{ $to }`.
       *[other] [deprecation] L atribût `{ $from }` só `<{ $component }>` l é surpasè e al vén ignorè parché as é dè ànc `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] L atribût `{ $attribute }` só `<{ $component }>` l é surpasè e al vén ignorè.

deprecated-attribute-to-child = [deprecation] L atribût `{ $attribute }` só `<{ $component }>` l é surpasè; drôva invêzi un fiôl `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Al valåur `{ $value }` dl atribût `{ $attribute }` só `<{ $component }>` l é surpasè; drôva `{ $to }` invêzi.


## Language coverage

pluralize-english-only = `<pluralize>` al pôl métter al plurèl såul l inglaiṡ, e acsé al sô tèst al resta cme l é in un documänt scrétt in { $locale }. Scrív la fôrma plurèl drétt, o mèttla con l atribût `pluralForm`.


## Checking against the schema

schema-element-unrecognized = L elemänt `<{ $tag }>` an n é brîṡa un elemänt Doenet cgnusó.

schema-element-not-allowed-at-root = L elemänt `<{ $tag }>` an n é brîṡa permíss int la radîṡ dal documänt.

schema-element-not-allowed-inside = L elemänt `<{ $tag }>` an n é brîṡa permíss dänter in `<{ $parent }>`.

schema-attribute-unrecognized = L elemänt `<{ $tag }>` an n à brîṡa un atribût ch'as ciâma `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] L atribût `{ $attribute }` dl elemänt `<{ $tag }>` al à da èser na lésta che ògni elemänt al séppa ón tra: { $allowed }
       *[other] L atribût `{ $attribute }` dl elemänt `<{ $tag }>` al à da èser ón tra: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nómm ed variànt brîṡa vàlid par select.  Al nómm ed variànt { $variantName } al cunpèr in { $numOptions } opziån mo al nûmer da ṡcanpèr l é { $numToSelect }.

select-variant-name-without-options = As é dè quèlc variànt par select mo inciónna opziån pr al nómm ed variànt posébil: { $variantName }.

select-variant-name-not-possible = Al nómm ed variànt { $variantName } dè par select an n é brîṡa un nómm ed variànt posébil.

select-too-few-options = An s pôl brîṡa ṡcanpèr { $numToSelect } cumponént såul da { $numOptions }.

select-from-sequence-too-few-values = An s pôl brîṡa ṡcanpèr { $numToSelect } valûr da na sequänza ed lunghèzza { $length }.

select-from-sequence-indices-count-mismatch = Al nûmer di índiz dè par select al à da andèr d'acôrd con al nûmer da ṡcanpèr

select-from-sequence-indices-not-integers = Tótt i índiz dè par select i an da èser nûmer intêr

select-from-sequence-index-excluded = L índiz dè ed selectfromsequence l êra eṡclûṡ

select-from-sequence-indices-excluded-combination = I índiz dè ed selectfromsequence i êren na cunbinaziån eṡclûṡa

select-from-sequence-coprime-not-positive-integers = An s pôl brîṡa ṡcanpèr cunbinaziån coprémm parché an s ṡcanpa brîṡa di nûmer intêr poṡitîv.

select-from-sequence-coprime-common-factor = An s pôl brîṡa ṡcanpèr nûmer coprémm. Tótt i valûr posébil i an un fatåur cumón. (I valûr dè ed "from" o "to" i an da èser coprémm con "step".)

select-from-sequence-coprime-single-number = An s pôl brîṡa ṡcanpèr cunbinaziån coprémm da un såul nûmer ch'an n é brîṡa 1.

select-from-sequence-excluded-too-many-combinations = As é eṡclûṡ pió dal 70% däl cunbinaziån in selectFromSequence

select-from-sequence-coprime-none-found = An s é brîṡa psó ṡcanpèr nûmer coprémm. Tótt i valûr posébil i an un fatåur cumón.

select-from-sequence-too-few-unique-values = An s pôl brîṡa ṡcanpèr { $numToSelect } valûr ûnic da na sequänza ed lunghèzza { $numPossibleValues }

select-prime-numbers-too-few-values = An s pôl brîṡa ṡcanpèr { $numToSelect } valûr da na lésta ed nûmer prémm ed lunghèzza { $numValues }

select-prime-numbers-values-count-mismatch = Al nûmer di valûr dè par select al à da andèr d'acôrd con al nûmer da ṡcanpèr

select-prime-numbers-values-not-prime = Tótt i valûr dè par select ed nûmer prémm i an da èser int la lésta di nûmer prémm

select-prime-numbers-values-excluded-combination = I valûr dè ed selectPrimeNumbers i êren na cunbinaziån eṡclûṡa

select-prime-numbers-excluded-too-many-combinations = As é eṡclûṡ pió dal 70% däl cunbinaziån in selectPrimeNumbers

select-random-combination-fluke = Par un chèṡ straurdinariamänt improbâbil, an s é brîṡa psó ṡcanpèr na cunbinaziån ed valûr a chèṡ

select-random-value-fluke = Par un chèṡ straurdinariamänt improbâbil, an s é brîṡa psó ṡcanpèr un valåur a chèṡ

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] Ste `<{ $component }>` an vén brîṡa mustrè parché l é dänter int la matemâtica e an n é brîṡa `inline`. Żónta `inline`, acsé al dvänta na lésta a tendénna, ch'la và dänter in un'esprasiån.
        [expanded] Ste `<{ $component }>` an vén brîṡa mustrè parché l é dänter int la matemâtica e l é `expanded`. Câva `expanded`; na caṡèla só pió rîg an và brîṡa dänter in un'esprasiån.
        [on-graph] Ste `<{ $component }>` an vén brîṡa mustrè parché l é dänter in matemâtica diṡegnè só un gràfic, ch'an n à brîṡa pòst par un input.
       *[relative-width] Ste `<{ $component }>` an vén brîṡa mustrè parché l é dänter int la matemâtica e al à na larghèzza relatîva. Dà la larghèzza in unitè aṡolût, cme `px`, invêzi.
    }
