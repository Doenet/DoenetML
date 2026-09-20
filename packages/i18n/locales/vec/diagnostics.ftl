# Venetian (veneto) diagnostics. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The unified Venetian spelling, «x» for the voiced sibilant
# and no «ł»; see `chrome.ftl` for the whole note.
#
# **What makes these sentences Venetian rather than Italian in Venetian
# spelling** is the clitic subject and the auxiliary: «el xe», «la xe», «i ga»,
# «no se pol», «el ga», «no'l xe». A sentence here without one of those is very
# likely still Italian, and that is this file's quickest check.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber` — are part of the language, not prose,
# and stay in English exactly as written. So does anything quoted back from the
# author's own source, and so do `WCAG AA`, `DoenetML`, `PreFigure` and
# `prefigure`, which are names.
#
# **Number.** CLDR has plural rules for `vec`; its `many` selects only at exact
# millions and no counted noun here changes shape there, so no `[many]` branch
# appears. Every **symbolic** selector — `$type`, `$mode`, `$reason`,
# `$context`, `$suggestion`, `$alternative`, `$fallback`, `$expected`,
# `$labelKind`, `$isList`, `$componentType` — is kept byte for byte from
# English, keys included.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } el vien ignorà quando che se dà do estremi
       *[other] { $attributes } i vien ignorà quando che se dà do estremi
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } el vien ignorà quando che se dà un estremo e un punto de mexo
       *[other] { $attributes } i vien ignorà quando che se dà un estremo e un punto de mexo
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset no'l ga efeto sensa un punto de mexo

## `<line>`

line-points-undetermined-dimensions = Linea par punti de dimension mia determinà.

line-points-too-few-dimensions = Na linea la ga da passar par punti de almanco do dimension.

line-points-depend-on-variables = La linea la passa par punti che i dipende da le variabili: { $variables }.

line-equation-invalid-format = Formato mia valido par la equasion de la linea in te le variabili { $variable1 } e { $variable2 }.

## `<ray>`

ray-overprescribed-through = La semireta la xe definia da through, endpoint e direction.  El through dà el vien ignorà.

ray-dimension-mismatch = numDimensions no'l coincide in te la semireta.

## `<vector>`

vector-overprescribed-head = El vetor el xe definio da head, tail e displacement.  El head dà el vien ignorà.

vector-dimension-mismatch = numDimensions no'l coincide in tel vetor.

## Attracting and constraining

attract-to-without-nearest-point = No se pol tirar verso un `<{ $component }>`, parché no'l ga la variabile de stato nearestPoint.

constrain-to-without-nearest-point = No se pol vincolar a un `<{ $component }>`, parché no'l ga la variabile de stato nearestPoint.

constrain-to-interior-without-nearest-point = No se pol vincolar a l'interno de un `<{ $component }>`, parché no'l ga la variabile de stato nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition el vien ignorà par un choiceInput che no'l xe inline

## Ordering children by index

choice-input-indices-count-mismatch = Se ignora i indisi dà par choiceInput, parché el numero de indisi no'l corisponde al numero de fioi choice.

pretzel-indices-count-mismatch = Se ignora i indisi dà par problem, parché el numero de indisi no'l corisponde al numero de fioi problem.

shuffle-indices-count-mismatch = Se ignora i indisi dà par shuffle, parché el numero de indisi no'l corisponde al numero de conponenti.

indices-ignored-out-of-range = Se ignora i indisi dà par { $component }, parché qualche indise el xe fora del intervalo.

pretzel-indices-repeated = Se ignora i indisi dà par pretzel, parché qualche indise el xe ripetuo.

pretzel-circuit-first-index = Se ignora i indisi dà par pretzel in modalità circuit, parché el primo indise el ga da esser 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Parché `<{ $component }>` el funsiona co fioi de testo, ghe vol dar un atributo `type`.

invalid-type-defaulting-to-math = Tipo { $type } mia valido par el conponente { $component }. El ga da esser uno tra math, text, number o boolean. Se dopara math.

string-not-valid-component-to-arrange = El testo "{ $value }" no'l xe un conponente valido da { $component }. Se lo ignora.

## Types and variables

invalid-type-defaulting-to-number = Tipo { $type } mia valido, se mete el tipo a number.

invalid-variable-value = Valor mia valido de na variabile: `{ $value }`

## Variants

variant-index-must-be-number = L'indise de variante { $index } el ga da esser un numero

variant-index-must-be-integer = L'indise de variante { $index } el ga da esser un numero intiero

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` no'l xe fato par mixure asolute. Se mete le larghese a relative.

side-by-side-absolute-margins = `<{ $component }>` no'l xe fato par mixure asolute. Se mete i margini a relativi.

side-by-side-no-block-child = `<{ $component }>` mia valido: el ga da aver almanco un fiol de bloco.

## `<label>`

label-for-ignored-on-graphical = L'atributo `for` su na `<label>` grafica el vien ignorà.

label-for-must-resolve-to-one = L'atributo `for` su `<label>` el ga da rixolversi in giusto un conponente.

label-for-unresolved = L'atributo `for` su `<label>` no'l se ga podesto rixolver in un conponente.

label-for-answer-with-authored-inputs = L'atributo `for` su `<label>` el fa riferimento a un `<answer>` co input scriti a man; fa riferimento drito al input.

label-for-answer-without-input = L'atributo `for` su `<label>` el fa riferimento a un `<answer>` sensa un input da etichetar.

label-for-must-reference-input-or-answer = L'atributo `for` su `<label>` el ga da far riferimento a un input o a na rispota.

## Accessibility

accessibility-short-description-or-decorative = Par la acesibilità, `<{ $component }>` el ga da aver na descrision curta o esser segnà come decorativo.

accessibility-video-short-description = Par la acesibilità, `<video>` el ga da aver na descrision curta.

accessibility-input-short-description-or-label = Par la acesibilità, `<{ $component }>` el ga da aver na descrision curta o na eticheta.

accessibility-answer-input-short-description-or-label = Par la acesibilità, un `<answer>` che'l crea un input el ga da aver na descrision curta o na eticheta.

accessibility-short-description-contains-math = Le descrision curte no le ga da aver rentro conponenti matematici come `<{ $component }>`. Scrivi la matematica co le parole.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } no'l ga contrasto asè par el testo del titolo de la sesion (modalità scura) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ghe vol almanco { $threshold }:1).
       *[other] { $colorName } no'l ga contrasto asè par el testo del titolo de la sesion ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ghe vol almanco { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Un `<circle>` par { $count } punti no'l xe fato par el caxo che i punti no i gabia valori numerici.

circle-too-many-through-points = No se pol calcolar un sercio par pì de 3 punti.

circle-overprescribed-radius-center-points = No se pol calcolar un sercio co ragio, sentro e punti de pasagio dà.

circle-center-with-multiple-points = No se pol calcolar un sercio co sentro dà par pì de 1 punto.

circle-radius-too-small = No se pol calcolar el sercio: dà che la distansa tra i do punti la xe { $distance }, el ragio dà { $radius } el xe massa picolo.

circle-radius-with-many-points = No se pol far un sercio par pì de do punti co un ragio dà.

circle-invalid-center-or-through-points = Sentro o punti de pasagio del sercio mia validi.

circle-radius-center-with-multiple-points = No se pol calcolar el ragio de un sercio co sentro dà par pì de 1 punto.

circle-change-radius-non-numerical = No se pol canbiar el ragio de un sercio co punti de pasagio mia numerici

circle-radius-with-points-non-numerical = No se pol far un sercio par pì de un punto co un ragio dà quando che no se ga valori numerici.

circle-change-center-non-numerical = Canbiar el sentro de un sercio par punti sensa valori numerici no'l xe ancora fato.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Dimension mia asè par el dominio de la funsion. El dominio el ga { $intervals } intervalo ma la funsion la ga { $inputs ->
            [one] { $inputs } input
           *[other] { $inputs } input
        }.
       *[other] Dimension mia asè par el dominio de la funsion. El dominio el ga { $intervals } intervai ma la funsion la ga { $inputs ->
            [one] { $inputs } input
           *[other] { $inputs } input
        }.
    }

function-domain-invalid-format = Formato mia valido par el dominio de la funsion.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Se ignora un masimo de la funsion che no'l xe numerico.
        [minimum] Se ignora un minimo de la funsion che no'l xe numerico.
        [extremum] Se ignora un estremo de la funsion che no'l xe numerico.
        [point] Se ignora un punto de la funsion che no'l xe numerico.
        [slope] Se ignora na pendensa de la funsion che no la xe numerica.
       *[other] Se ignora un { $type } de la funsion che no'l xe numerico.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Se ignora un masimo vodo de la funsion.
        [minimum] Se ignora un minimo vodo de la funsion.
        [extremum] Se ignora un estremo vodo de la funsion.
        [point] Se ignora un punto vodo de la funsion.
       *[other] Se ignora un { $type } vodo de la funsion.
    }

function-points-too-close = La funsion la ga do punti massa visin uno co l'altro. No se pol definir la funsion.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Le iterasion de na funsion le xe posibili solo se el numero de input el xe conpagno del numero de output. Sta funsion la ga { $inputs } input e { $outputs } output.
       *[other] Le iterasion de na funsion le xe posibili solo se el numero de input el xe conpagno del numero de output. Sta funsion la ga { $inputs } input e { $outputs } output.
    }

## `<sequence>`

sequence-invalid-length = Longhessa de la sequensa mia valida.  La ga da esser un numero intiero mia negativo.

sequence-invalid-step = Paso de la sequensa mia valido.  El ga da esser un numero par na sequensa de tipo { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" mia valido de na sequensa de numeri.  El ga da esser un numero.

sequence-invalid-endpoint-letters = "{ $attribute }" mia valido de na sequensa de letere.  La ga da esser na conbinasion de letere.

sequence-invalid-endpoint = "{ $attribute }" de la sequensa mia valido.

select-from-sequence-coprime-not-numbers = coprime el vien ignorà parché no se siegle numeri

select-from-sequence-coprime-with-exclude-combinations = coprime el vien ignorà parché xe dà excludeCombinations

## Resolving a `target`

target-not-found = target mia valido par `<{ $source }>`: no se cata el destinatario.

target-state-variable-not-found = target mia valido par `<{ $source }>`: no se cata na variabile de stato ciamà "{ $property }" su un `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Le variabili de `<odeSystem>` le ga da esser diverse da la variabile indipendente.

ode-system-duplicate-variable-names = No se pol definir le funsion RHS de la ODE co nomi de variabili dipendenti ripetui.

ode-system-rhs-function-error = No se pol definir la funsion RHS de la ODE.  Eror in te la creasion de la funsion mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = No se pol definir un angolo tra { $count } linee

angle-invalid-through-point = Punto mia valido in through de `<angle>`

parabola-vertex-too-many-points = Na parabola co vertise par pì de 1 punto no la xe ancora fata.

parabola-too-many-points = Na parabola par pì de 3 punti no la xe ancora fata.

intersection-too-many-items = La intersesion de pì de do elementi no la xe ancora fata

## Other math components

ionic-compound-not-two-ions = Un conposto ionico de altro che do ioni no'l xe ancora fato.

ionic-compound-needs-cation-and-anion = El conposto ionico el xe fato solo par un cation e un anion.

solve-equations-cannot-evaluate = No se pol rixolver la equasion parché no se la ga podesta valutar: { $equation }

math-operators-operand-number-required = Ghe vol dar un operandNumber quando che se tira fora un operando matematico.

eigen-decomposition-failed = No se ga podesto calcolar i autovalori de la matrice

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: el parametro { $parameters } no'l conpare in tel modelo, cusì el ndarà senpre a stare co un vodo.
       *[other] `<matchesPattern>`: i parametri { $parameters } no i conpare in tel modelo, cusì i ndarà senpre a stare co un vodo.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: no se pol interpretar grid="{ $grid }". El ga da esser none, medium, dense o do numeri positivi divixi da un spasio, come grid="1 0.5". No se dixegna nisuna gradela.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` el ga bixogno de na funsion co { $expected ->
        [one] un output, la pendensa y' in ogni punto, come `y - x`
       *[other] do output, el vetor in ogni punto, come `(y, -x)`
    }, ma la funsion dà la ga { $found } output. { $alternative ->
        [none] No se dixegna gnente.
       *[other] `<{ $alternative }>` el xe el conponente par chela funsion. No se dixegna gnente.
    }

field-function-attribute-ignored-with-child = L'atributo `function` el vien ignorà parché la funsion la xe dà anca rentro del conponente; se dopara quela rentro. Da la funsion in un modo solo dei do.

field-variables-ignored =
    `<{ $component }>`: l'atributo `variables` el nomina le variabili de na espresion scrita drito rentro del conponente. { $reason ->
        [function-child] La funsion qua la xe dà come fiol `<function>`, che'l nomina le so variabili, cusì `variables` el vien ignorà.
       *[no-expression] Qua no ghe xe nisuna espresion de quela sorte, cusì `variables` el vien ignorà.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" no'l xe suportà in tel renderixador prefigure; se dopara el conportamento de la posision a drita.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" no'l xe suportà in tel renderixador prefigure; se dopara el conportamento de la posision in alto.

prefigure-invalid-axis-bounds = `<graph>`: limiti dei asi mia validi par la conversion prefigure; se dopara el bbox predefinio (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: larghesa mia valida par la conversion prefigure; se dopara la larghesa predefinia del diagrama 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio mia valido par la conversion prefigure; se dopara la proporsion predefinia 1.

prefigure-grid-spacing-too-fine = `<graph>`: la gradela la xe massa fina par i limiti dei asi; la gradela la vien lasà fora in tel renderixador prefigure.

prefigure-annotations-not-rendered = `<graph>`: le anotasion no le vien dixegnà quando che no se dopara el renderixador PreFigure.

multiple-annotations-children = Se ga trovà pì fioi `<annotations>` in `<graph>`; tuti fora che l'ultimo i vien ignorà.

## Referring to other components

copy-unrecognized-component-type = No se pol estender o copiar un tipo de conponente mia riconosuo: { $type }.

copy-prop-not-found = No se ga catà la proprietà { $property } su un conponente de tipo { $component }

collect-no-source = Nisuna sorxente catà par collect.

collect-invalid-component-type = No se pol tirar insieme conponenti de tipo `<{ $component }>`, parché el xe un tipo de conponente mia valido.

reference-index-unavailable = No se pol far riferimento al indise `{ $reference }`

## `<callAction>`

component-action-unavailable = No se pol ciamar { $action } sul conponente `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = I dati i ga na forma mia valida.  Le righe le ga longhese diverse. Trovà in componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = I dati i ga nomi de colona ripetui.  Trovà in componentIdx :{ $componentIdx }

data-frame-missing-column-name = Ai dati ghe manca un nome de colona.  Trovà in componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Un premio par sta rispota el xe baxà su la rispota mandà dal tag answer stesso, e questo el portarà a un conportamento mia spetà.

answer-max-num-attempts-in-section-wide-check-work = Meter `maxNumAttempts` su un `<answer>` rentro de un contenidor co `sectionWideCheckWork` no'l ga efeto, parché el numero de tentativi el xe controlà dal contenidor. Meti `maxNumAttempts` sul contenidor invese.

nested-section-wide-check-work-max-num-attempts = Meter `maxNumAttempts` su un contenidor co `sectionWideCheckWork` che'l sta rentro de un altro contenidor co `sectionWideCheckWork` no'l ga efeto, parché el numero de tentativi el xe controlà dal contenidor esterno. Meti `maxNumAttempts` sul contenidor esterno invese.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] L'atributo { $attributes } no'l gavarà efeto sensa symbolicEquality mèsso.
       *[other] I atributi { $attributes } no i gavarà efeto sensa symbolicEquality mèsso.
    }

answer-invalid-type = Tipo mia valido par la rispota: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Sicome che el conponente `<{ $component }>` no'l ga un nome, no se lo pol doparar come atributo de modulo

module-attribute-name-already-defined = El conponente `<{ $component } name="{ $name }">` no se lo pol doparar come atributo de un modulo parché el tipo de conponente `<module>` el ga xa un atributo "{ $name }" definio.

conditional-content-condition-ignored = L'atributo `condition` el vien ignorà su un conponente `<conditionalContent>` co fioi case o else.

slider-markers-type-mismatch = El tipo dei marcadori no'l coincide col tipo del slider.

pretzel-problem-needs-statement-and-answer = pretzel mia valido: ogni `<problem>` el ga da aver rentro un `<statement>` e un `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel mia valido: in mode="circuit", el primo `<problem>` no'l pol esser un distratore.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Valor mia valido { $values } par l'atributo `{ $attribute }`; se lo ignora.
       *[other] Valori mia validi { $values } par l'atributo `{ $attribute }`; se li ignora.
    }

attribute-must-be-references = Valor mia valido `{ $value }` par l'atributo `{ $attribute }`. L'atributo el ga da esser fato de riferimenti che i scominsia co un `$`.

math-input-invalid-function-names = <mathInput>: se ga ignorà nomi de funsion mia validi in { $attribute }: { $names }. El toco mostrà de ogni nome el ga da aver almanco 2 caratari (letere o tratini); dopo el pol vegner un sufiso opsional `|<alternativa mathspeak>`.

## Building components from the source

component-type-invalid = Tipo de conponente mia valido: `<{ $componentType }>`

attribute-repeated = No se pol ripeter l'atributo { $attribute }.

attribute-invalid-for-component = Atributo "{ $attribute }" mia valido par un conponente de tipo `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    La definision de stil { $styleNumber } no la ga contrasto asè par { $context ->
        [text-on-background] el color del testo contro el color del fondo
        [high-contrast] el color a alto contrasto contro la tela
        [line] el color de la linea contro la tela
        [marker] el color del marcador contro la tela
       *[text-on-canvas] el color del testo contro la tela
    }{ $mode ->
        [dark] { " (modalità scura)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ghe vol almanco { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Anca se la definision de stil { $styleNumber } la ga colori che i dà contrasto asè par la modalità ciara, i colori par la modalità scura ricavà da sti valori no i ga contrasto asè tra el color del testo e el color del fondo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ghe vol almanco { $threshold }:1). { $suggestion ->
        [available] Par aver contrasto asè in te la modalità scura, o alsa el contrasto de la modalità ciara (p.e. meti { $lightAttribute }="{ $lightColor }") o passa sora al color de la modalità scura (p.e. meti { $darkAttribute }="{ $darkColor }").
       *[none] Par aver contrasto asè in te la modalità scura, alsa el contrasto de la modalità ciara o passa sora ai colori ricavà co textColorDarkMode e/o backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Anca se la definision de stil { $styleNumber } la ga un color del testo che'l dà contrasto asè par la modalità ciara, el color del testo par la modalità scura ricavà da chel valor no'l ga contrasto asè contro la tela ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ghe vol almanco { $threshold }:1). { $suggestion ->
        [available] Par aver contrasto asè in te la modalità scura, o alsa el contrasto de la modalità ciara (p.e. meti textColor="{ $lightColor }") o passa sora al color de la modalità scura (p.e. meti textColorDarkMode="{ $darkColor }").
       *[none] Par aver contrasto asè in te la modalità scura, alsa el contrasto de la modalità ciara o passa sora al color ricavà co textColorDarkMode.
    }

section-multiple-style-palettes = Na sesion la pol sielser un <stylePalette> solo; se dopara l'ultimo.

## Unique variants

variant-num-to-select-not-non-negative-integer = no se pol determinar le varianti uniche de { $component }, parché numToSelect no'l xe un numero intiero mia negativo.

variant-num-to-select-not-constant-number = no se pol determinar le varianti uniche de { $component }, parché numToSelect no'l xe un numero costante.

variant-with-replacement-not-constant-boolean = no se pol determinar le varianti uniche de { $component }, parché withReplacement no'l xe un boolean costante.

variant-select-weight-disables-unique = Le varianti uniche par select le xe dixativà se na opsion la ga selectWeight o selectForVariants dà

variant-coprime-undetermined = no se pol determinar le varianti uniche de { $component }, parché no se pol determinar che coprime el sia senpre falso.

variant-attribute-not-constant = no se pol determinar le varianti uniche de { $component }, parché { $attribute } no'l xe na costante.

variant-attribute-not-number = no se pol determinar le varianti uniche de { $component }, parché { $attribute } no'l xe un numero.

variant-attribute-wrong-type-for-sequence =
    no se pol determinar le varianti uniche de { $component } de tipo { $type }, parché { $attribute } no'l xe { $expected ->
        [letters-combination] na conbinasion de letere
        [math-expression] na espresion matematica valida
        [integer] un numero intiero
       *[number] un numero
    }.

variant-length-not-integer = no se pol determinar le varianti uniche de { $component }, parché length no'l xe un numero intiero.

variant-sort-not-implemented = le varianti uniche de un { $component } co sort no le xe ancora fate

variant-exclude-combinations-not-implemented = le varianti uniche de un { $component } co excludeCombinations no le xe ancora fate

variant-math-exclude-not-implemented = le varianti uniche de un { $component } de tipo math co exclude no le xe ancora fate

variant-non-constant-exclude-not-implemented = le varianti uniche de un { $component } co un exclude mia costante no le xe ancora fate

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: no'l xe suportà in tel renderixador prefigure del grafico; el dissendente el vien saltà.

prefigure-descendant-invalid-geometry = { $subject }: geometria mia finia o mia conpleta; el dissendente el vien saltà.

prefigure-curve-label-omitted = { $subject }: le etichete no le xe suportà sui elementi de curva convertii; la eticheta la vien lasà fora.

prefigure-curve-unsupported-definition-type = { $subject }: tipo de definision de la curva '{ $definitionType }' mia suportà; el dissendente el vien saltà.

prefigure-region-flip-functions-unsupported = { $subject }: atributo flipFunctions mia suportà su regionBetweenCurves; el dissendente el vien saltà.

prefigure-region-non-formula-child = { $subject }: solo le funsion fiol de tipo formula le xe suportà su regionBetweenCurves; el dissendente el vien saltà.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' mia suportà par { $labelKind ->
        [line-family] na eticheta de la fameia de le linee
       *[point] na eticheta de punto
    }; se dopara l'alineamento predefinio de PreFigure.

prefigure-fill-style-unsupported = { $subject }: el stil de inpienimento '{ $fillStyle }' no'l xe suportà da PreFigure; se torna a un inpienimento pien.

prefigure-line-style-unknown = { $subject }: el stil de linea mia conosuo '{ $lineStyle }' el xe lasà fora del output de PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: el stil de marcador '{ $markerStyle }' el xe stà mapà sul stil PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: el stil de marcador '{ $markerStyle }' no'l xe suportà da PreFigure; se dopara el stil predefinio.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` mia valido; no se pol rixolver el destinatario. La anotasion la vien lasà fora.

annotation-ref-multiple-targets = `<annotation>`: `ref` el se ga rixolto in pì destinatari; se dopara el primo.

annotation-ref-outside-graph = `<annotation>`: `ref` mia valido; el destinatario el xe fora del grafico che lo contien. La anotasion la vien lasà fora.

annotation-ref-unsupported-target = `<annotation>`: `ref` mia valido; el destinatario no'l xe un ogeto grafico suportà in te la conversion prefigure. La anotasion la vien lasà fora.

annotation-text-missing = `<annotation>`: `text` el manca o el xe vodo; se manda fora testo vodo.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Se ga trovà na dipendensa circolar.
       *[other] Se ga trovà na dipendensa circolar che la ciapa rentro un conponente `<{ $componentType }>`.
    }

reference-no-referent = Nisun referente trovà par el riferimento: `{ $reference }`

reference-multiple-referents = Pì referenti trovà par el riferimento: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Formato mia valido par l'atributo { $attribute } de `<{ $componentType }>`.

children-invalid = Fioi mia validi par `<{ $componentType }>`: se ga trovà fioi mia validi: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valor mia valido `{ $value }` par l'atributo `{ $attribute }`, se dopara el valor `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Version de DoenetML { $version } mia trovà.
       *[other] Version de DoenetML { $version } mia trovà. Se torna a la version { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML mia valido: { $content }

parse-tag-missing-close-tag = DoenetML mia valido: El tag `{ $tag }` no'l ga un tag de seradura. Se spetava un tag che se sera da solo o un tag `</{ $tagName }>`.

parse-tag-error = DoenetML mia valido: Eror in tel tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML mia valido: El pare che al atributo mia valido `{ $attribute }` ghe manca un valor.

parse-attribute-invalid = DoenetML mia valido: Atributo mia valido `{ $attribute }`

parse-attribute-value-invalid = DoenetML mia valido: Valor de atributo mia valido `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML mia valido: Valor de atributo mia valido `{ $value }`. Le virgolete no le corisponde. El pare che te manca un `{ $quote }`

parse-open-tag-name-missing = DoenetML mia valido: Se ga trovà un tag sensa nome de tag, p.e. `<`

parse-tag-not-closed = DoenetML mia valido: El tag `{ $tag }` no'l xe stà serà (el pare che manca un `>`).

parse-self-closing-tag-name-missing = DoenetML mia valido: Se ga trovà un tag sensa nome de tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML mia valido: El tag `{ $tag }` no'l xe stà serà (el pare che manca `/>`).

parse-tag-invalid-attributes = DoenetML mia valido: El tag `{ $tag }` no'l xe valido. El podarìa aver atributi sbaglià.

parse-close-tag-name-missing = DoenetML mia valido: Se ga trovà un tag de seradura sensa nome de tag, p.e. `</`

parse-attribute-value-unquoted = I valori dei atributi i ga da esser tra virgolete: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML mia valido: Se ga trovà el tag de seradura `{ $tag }`, ma nisun tag de vertura corispondente

parse-close-tag-mismatched = DoenetML mia valido: Tag de seradura che no'l corisponde. Se spetava `</{ $expected }>`. Se ga trovà `{ $found }`

parser-node-unconvertible = No se ga podesto convertir el nodo { $node } in un nodo Dast.

## Names

name-attribute-invalid =
    Atributo mia valido name='{ $name }'. { $reason ->
        [characters] I nomi i pol aver solo letere, numeri, sotolineadure o tratini.
       *[start] I nomi i ga da scominsiar co na letera.
    }

component-name-invalid-start = Nome de conponente mia valido "{ $name }". I nomi i ga da scominsiar co na letera.

## `<answer>` sugar

answer-video-watched-missing-video = Na rispota de tipo videoWatched la ga da aver un atributo video

answer-video-watched-video-not-reference = Na rispota de tipo videoWatched la ga da aver un atributo video che'l sia un riferimento

answer-name-not-single-text = L'atributo name de la rispota el ga da aver un solo fiol de testo

## Referencing another document

external-doenetml-recursion-limit = No se pol recuperar el DoenetML esterno par via de massa liveli de ricorsion. Ghe xe un riferimento circolar?

external-doenetml-unavailable = No se pol recuperar el DoenetML da { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML mia valido recuperà da { $attribute }="{ $uri }": no'l coincideva col tipo de conponente "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] L'atributo `{ $from }` el xe superà; dopara `{ $to }` invese.
       *[other] [deprecation] L'atributo `{ $from }` su `<{ $component }>` el xe superà; dopara `{ $to }` invese.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] L'atributo `{ $from }` el xe superà e el vien ignorà parché xe dà anca `{ $to }`.
       *[other] [deprecation] L'atributo `{ $from }` su `<{ $component }>` el xe superà e el vien ignorà parché xe dà anca `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] L'atributo `{ $attribute }` su `<{ $component }>` el xe superà e el vien ignorà.

deprecated-attribute-to-child = [deprecation] L'atributo `{ $attribute }` su `<{ $component }>` el xe superà; dopara invese un fiol `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] El valor `{ $value }` de l'atributo `{ $attribute }` su `<{ $component }>` el xe superà; dopara `{ $to }` invese.


## Language coverage

pluralize-english-only = `<pluralize>` el pol meter al plurale solo l'inglexe, cusì el so testo el resta tal e qual in un documento scrito in { $locale }. Scrivi la forma plurale drito, o metila co l'atributo `pluralForm`.


## Checking against the schema

schema-element-unrecognized = L'elemento `<{ $tag }>` no'l xe un elemento Doenet riconosuo.

schema-element-not-allowed-at-root = L'elemento `<{ $tag }>` no'l xe permesso a la radixe del documento.

schema-element-not-allowed-inside = L'elemento `<{ $tag }>` no'l xe permesso rentro de `<{ $parent }>`.

schema-attribute-unrecognized = L'elemento `<{ $tag }>` no'l ga un atributo ciamà `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] L'atributo `{ $attribute }` de l'elemento `<{ $tag }>` el ga da esser na lista che ogni elemento el sia uno tra: { $allowed }
       *[other] L'atributo `{ $attribute }` de l'elemento `<{ $tag }>` el ga da esser uno tra: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nome de variante mia valido par select.  El nome de variante { $variantName } el conpare in { $numOptions } opsion ma el numero da sielser el xe { $numToSelect }.

select-variant-name-without-options = Xe dà qualche variante par select ma nisuna opsion par el nome de variante posibile: { $variantName }.

select-variant-name-not-possible = El nome de variante { $variantName } dà par select no'l xe un nome de variante posibile.

select-too-few-options = No se pol sielser { $numToSelect } conponenti da solo { $numOptions }.

select-from-sequence-too-few-values = No se pol sielser { $numToSelect } valori da na sequensa de longhessa { $length }.

select-from-sequence-indices-count-mismatch = El numero de indisi dà par select el ga da corisponder al numero da sielser

select-from-sequence-indices-not-integers = Tuti i indisi dà par select i ga da esser numeri intieri

select-from-sequence-index-excluded = L'indise dà de selectfromsequence el jera esclusso

select-from-sequence-indices-excluded-combination = I indisi dà de selectfromsequence i jera na conbinasion esclussa

select-from-sequence-coprime-not-positive-integers = No se pol sielser conbinasion coprime parché no se siegle numeri intieri positivi.

select-from-sequence-coprime-common-factor = No se pol sielser numeri coprimi. Tuti i valori posibili i ga un fator comun. (I valori dà de "from" o "to" i ga da esser coprimi co "step".)

select-from-sequence-coprime-single-number = No se pol sielser conbinasion coprime da un numero solo che no'l xe 1.

select-from-sequence-excluded-too-many-combinations = Se ga esclusso pì del 70% de le conbinasion in selectFromSequence

select-from-sequence-coprime-none-found = No se ga podesto sielser numeri coprimi. Tuti i valori posibili i ga un fator comun.

select-from-sequence-too-few-unique-values = No se pol sielser { $numToSelect } valori unici da na sequensa de longhessa { $numPossibleValues }

select-prime-numbers-too-few-values = No se pol sielser { $numToSelect } valori da na lista de numeri primi de longhessa { $numValues }

select-prime-numbers-values-count-mismatch = El numero de valori dà par select el ga da corisponder al numero da sielser

select-prime-numbers-values-not-prime = Tuti i valori dà par select de numeri primi i ga da esser in te la lista dei numeri primi

select-prime-numbers-values-excluded-combination = I valori dà de selectPrimeNumbers i jera na conbinasion esclussa

select-prime-numbers-excluded-too-many-combinations = Se ga esclusso pì del 70% de le conbinasion in selectPrimeNumbers

select-random-combination-fluke = Par un caxo straordinariamente inprobabile, no se ga podesto sielser na conbinasion de valori a caxo

select-random-value-fluke = Par un caxo straordinariamente inprobabile, no se ga podesto sielser un valor a caxo

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` no'l vien dixegnà rentro de la matematica; la espresion la vien conposta come la jera prima che se podesse meter input rentro. { $reason ->
        [not-inline] Solo un input de sielta `inline` el sta rentro de na espresion; sensa `inline` el xe un bloco de botoni.
        [expanded] Un input de testo `expanded` el xe na caxela su pì righe, massa granda par star rentro de na espresion.
        [on-graph] Su un grafico la espresion la vien dixegnà come na figura sola, che no la ga posto par un controlo.
       *[relative-width] La so `width` la xe relativa (na persentual o `em`), e no la ga gnente da mixurar rentro de na espresion. Da la larghesa in unità asolute, come `px`, invese.
    }
