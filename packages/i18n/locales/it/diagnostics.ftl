# Italian diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
        [one] { $attributes } viene ignorato quando sono specificati due estremi
       *[other] { $attributes } vengono ignorati quando sono specificati due estremi
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } viene ignorato quando sono specificati sia un estremo sia un punto medio
       *[other] { $attributes } vengono ignorati quando sono specificati sia un estremo sia un punto medio
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset non ha effetto senza un punto medio

## `<line>`

line-points-undetermined-dimensions = Retta per punti di dimensioni indeterminate.

line-points-too-few-dimensions = Una retta deve passare per punti di almeno due dimensioni.

line-points-depend-on-variables = La retta passa per punti che dipendono da variabili: { $variables }.

line-equation-invalid-format = Formato non valido per l’equazione di una retta nelle variabili { $variable1 } e { $variable2 }.

## `<ray>`

ray-overprescribed-through = La semiretta è determinata da through, endpoint e direction. Il through specificato viene ignorato.

ray-dimension-mismatch = numDimensions non corrisponde nella semiretta.

## `<vector>`

vector-overprescribed-head = Il vettore è determinato da head, tail e displacement. Lo head specificato viene ignorato.

vector-dimension-mismatch = numDimensions non corrisponde nel vettore.

## Attracting and constraining

attract-to-without-nearest-point = Non è possibile attrarre verso un `<{ $component }>`, perché non ha una variabile di stato nearestPoint.

constrain-to-without-nearest-point = Non è possibile vincolare a un `<{ $component }>`, perché non ha una variabile di stato nearestPoint.

constrain-to-interior-without-nearest-point = Non è possibile vincolare all’interno di un `<{ $component }>`, perché non ha una variabile di stato nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition viene ignorato per un choiceInput non in linea

## Ordering children by index

choice-input-indices-count-mismatch = Gli indici specificati per choiceInput vengono ignorati, perché il loro numero non corrisponde al numero di figli choice.

pretzel-indices-count-mismatch = Gli indici specificati per problem vengono ignorati, perché il loro numero non corrisponde al numero di figli problem.

shuffle-indices-count-mismatch = Gli indici specificati per shuffle vengono ignorati, perché il loro numero non corrisponde al numero di componenti.

indices-ignored-out-of-range = Gli indici specificati per { $component } vengono ignorati, perché alcuni sono fuori intervallo.

pretzel-indices-repeated = Gli indici specificati per pretzel vengono ignorati, perché alcuni sono ripetuti.

pretzel-circuit-first-index = Gli indici specificati per pretzel in modalità circuit vengono ignorati, perché il primo indice deve essere 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Perché `<{ $component }>` funzioni con figli di tipo stringa, occorre specificare un attributo `type`.

invalid-type-defaulting-to-math = Tipo { $type } non valido per il componente { $component }. Deve essere math, text, number o boolean. Viene usato math.

string-not-valid-component-to-arrange = La stringa «{ $value }» non è un componente valido per { $component }. Viene ignorata.

## Types and variables

invalid-type-defaulting-to-number = Tipo { $type } non valido; il tipo viene impostato a number.

invalid-variable-value = Valore di variabile non valido: `{ $value }`

## Variants

variant-index-must-be-number = L’indice di variante { $index } deve essere un numero

variant-index-must-be-integer = L’indice di variante { $index } deve essere un intero

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` non è implementato per misure assolute. Le larghezze diventano relative.

side-by-side-absolute-margins = `<{ $component }>` non è implementato per misure assolute. I margini diventano relativi.

side-by-side-no-block-child = `<{ $component }>` non valido: deve avere almeno un figlio di tipo blocco.

## `<label>`

label-for-ignored-on-graphical = L’attributo `for` su un `<label>` grafico viene ignorato.

label-for-must-resolve-to-one = L’attributo `for` di `<label>` deve risolversi in esattamente un componente.

label-for-unresolved = L’attributo `for` di `<label>` non è stato risolto in un componente.

label-for-answer-with-authored-inputs = L’attributo `for` di `<label>` fa riferimento a un `<answer>` con input scritti esplicitamente; fai riferimento direttamente all’input.

label-for-answer-without-input = L’attributo `for` di `<label>` fa riferimento a un `<answer>` privo di input da etichettare.

label-for-must-reference-input-or-answer = L’attributo `for` di `<label>` deve fare riferimento a un input o a una risposta.

## Accessibility

accessibility-short-description-or-decorative = Per l’accessibilità, `<{ $component }>` deve avere una descrizione breve o essere indicato come decorativo.

accessibility-video-short-description = Per l’accessibilità, `<video>` deve avere una descrizione breve.

accessibility-input-short-description-or-label = Per l’accessibilità, `<{ $component }>` deve avere una descrizione breve o un’etichetta.

accessibility-answer-input-short-description-or-label = Per l’accessibilità, un `<answer>` che crea un input deve avere una descrizione breve o un’etichetta.

accessibility-short-description-contains-math = Le descrizioni brevi non dovrebbero contenere componenti matematici come `<{ $component }>`. Scrivi la matematica a parole.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } non ha contrasto sufficiente per il testo del titolo di sezione (modalità scura) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ne serve almeno { $threshold }:1).
       *[other] { $colorName } non ha contrasto sufficiente per il testo del titolo di sezione ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ne serve almeno { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` per { $count } punti non è implementato quando i punti non hanno valori numerici.

circle-too-many-through-points = Non è possibile calcolare una circonferenza per più di 3 punti.

circle-overprescribed-radius-center-points = Non è possibile calcolare una circonferenza con raggio, centro e punti di passaggio specificati.

circle-center-with-multiple-points = Non è possibile calcolare una circonferenza di centro dato che passa per più di 1 punto.

circle-radius-too-small = Non è possibile calcolare la circonferenza: essendo { $distance } la distanza tra i due punti, il raggio specificato { $radius } è troppo piccolo.

circle-radius-with-many-points = Non è possibile creare una circonferenza per più di due punti con un raggio specificato.

circle-invalid-center-or-through-points = Centro o punti di passaggio della circonferenza non validi.

circle-radius-center-with-multiple-points = Non è possibile calcolare il raggio di una circonferenza di centro dato che passa per più di 1 punto.

circle-change-radius-non-numerical = Non è possibile cambiare il raggio di una circonferenza con punti di passaggio non numerici

circle-radius-with-points-non-numerical = Non è possibile creare una circonferenza per più di un punto con raggio specificato senza valori numerici.

circle-change-center-non-numerical = Il cambio di centro di una circonferenza per punti non numerici non è implementato.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Dimensioni insufficienti per il dominio della funzione. Il dominio ha { $intervals } intervallo ma la funzione ha { $inputs ->
            [one] { $inputs } ingresso
           *[other] { $inputs } ingressi
        }.
       *[other] Dimensioni insufficienti per il dominio della funzione. Il dominio ha { $intervals } intervalli ma la funzione ha { $inputs ->
            [one] { $inputs } ingresso
           *[other] { $inputs } ingressi
        }.
    }

function-domain-invalid-format = Formato non valido per il dominio della funzione.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Il massimo non numerico della funzione viene ignorato.
        [minimum] Il minimo non numerico della funzione viene ignorato.
        [extremum] L’estremo non numerico della funzione viene ignorato.
        [point] Il punto non numerico della funzione viene ignorato.
        [slope] La pendenza non numerica della funzione viene ignorata.
       *[other] { $type } non numerico della funzione viene ignorato.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Il massimo vuoto della funzione viene ignorato.
        [minimum] Il minimo vuoto della funzione viene ignorato.
        [extremum] L’estremo vuoto della funzione viene ignorato.
        [point] Il punto vuoto della funzione viene ignorato.
       *[other] { $type } vuoto della funzione viene ignorato.
    }

function-points-too-close = La funzione contiene due punti troppo vicini tra loro. Impossibile definire la funzione.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Le iterate di una funzione sono possibili solo se il numero di ingressi è uguale al numero di uscite. Questa funzione ha { $inputs } ingresso e { $outputs ->
            [one] { $outputs } uscita
           *[other] { $outputs } uscite
        }.
       *[other] Le iterate di una funzione sono possibili solo se il numero di ingressi è uguale al numero di uscite. Questa funzione ha { $inputs } ingressi e { $outputs ->
            [one] { $outputs } uscita
           *[other] { $outputs } uscite
        }.
    }

## `<sequence>`

sequence-invalid-length = Lunghezza della successione non valida. Deve essere un intero non negativo.

sequence-invalid-step = Passo della successione non valido. Deve essere un numero per una successione di tipo { $type }.

sequence-invalid-endpoint-number = «{ $attribute }» non valido per una successione di numeri. Deve essere un numero.

sequence-invalid-endpoint-letters = «{ $attribute }» non valido per una successione di lettere. Deve essere una combinazione di lettere.

sequence-invalid-endpoint = «{ $attribute }» non valido per la successione.

select-from-sequence-coprime-not-numbers = coprime viene ignorato, perché non si stanno selezionando numeri

select-from-sequence-coprime-with-exclude-combinations = coprime viene ignorato, perché è specificato excludeCombinations

## Resolving a `target`

target-not-found = target non valido per `<{ $source }>`: destinazione non trovata.

target-state-variable-not-found = target non valido per `<{ $source }>`: nessuna variabile di stato di nome «{ $property }» su un `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Le variabili di un `<odeSystem>` devono essere diverse dalla variabile indipendente.

ode-system-duplicate-variable-names = Non è possibile definire i secondi membri dell’ODE con nomi di variabili dipendenti duplicati.

ode-system-rhs-function-error = Non è possibile definire il secondo membro dell’ODE. Errore nella creazione della funzione mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Non è possibile definire un angolo tra { $count } rette

angle-invalid-through-point = Punto non valido nel through di un `<angle>`

parabola-vertex-too-many-points = Una parabola con vertice dato per più di 1 punto non è implementata.

parabola-too-many-points = Una parabola per più di 3 punti non è implementata.

intersection-too-many-items = L’intersezione di più di due oggetti non è implementata

## Other math components

ionic-compound-not-two-ions = I composti ionici diversi da quelli a due ioni non sono implementati.

ionic-compound-needs-cation-and-anion = I composti ionici sono implementati solo per un catione e un anione.

solve-equations-cannot-evaluate = Non è possibile risolvere l’equazione, perché non è stato possibile valutarla: { $equation }

math-operators-operand-number-required = Per estrarre un operando matematico occorre specificare un operandNumber.

eigen-decomposition-failed = Non è stato possibile calcolare gli autovalori della matrice

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: il parametro { $parameters } non compare nel modello, quindi corrisponderà sempre a uno spazio vuoto.
       *[other] `<matchesPattern>`: i parametri { $parameters } non compaiono nel modello, quindi corrisponderanno sempre a uno spazio vuoto.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: impossibile interpretare grid="{ $grid }". Il valore deve essere none, medium, dense oppure due numeri positivi separati da uno spazio, come grid="1 0.5". Non viene disegnata alcuna griglia.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" non è supportato dal renderer prefigure; viene usato il comportamento della posizione destra.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" non è supportato dal renderer prefigure; viene usato il comportamento della posizione alta.

prefigure-invalid-axis-bounds = `<graph>`: limiti degli assi non validi per la conversione prefigure; viene usata la bbox predefinita (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: larghezza non valida per la conversione prefigure; viene usata la larghezza predefinita 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio non valido per la conversione prefigure; viene usato il rapporto d’aspetto predefinito 1.

prefigure-grid-spacing-too-fine = `<graph>`: il passo della griglia è troppo fine per i limiti degli assi; nel renderer prefigure la griglia viene omessa.

prefigure-annotations-not-rendered = `<graph>`: le annotazioni non vengono disegnate al di fuori del renderer PreFigure.

multiple-annotations-children = Trovati più figli `<annotations>` in `<graph>`; tutti tranne l’ultimo vengono ignorati.

## Referring to other components

copy-unrecognized-component-type = Non è possibile estendere o copiare un tipo di componente non riconosciuto: { $type }.

copy-prop-not-found = Proprietà { $property } non trovata su un componente di tipo { $component }

collect-no-source = Nessuna sorgente trovata per collect.

collect-invalid-component-type = Non è possibile raccogliere componenti di tipo `<{ $component }>`, perché non è un tipo valido.

reference-index-unavailable = Non è possibile fare riferimento all’indice `{ $reference }`

## `<callAction>`

component-action-unavailable = Non è possibile chiamare { $action } sul componente `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = I dati hanno una forma non valida. Le righe hanno lunghezze incoerenti. Trovato in componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = I dati hanno nomi di colonna duplicati. Trovato in componentIdx :{ $componentIdx }

data-frame-missing-column-name = Ai dati manca un nome di colonna. Trovato in componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Un award di questa risposta si basa sulla risposta inviata dal tag answer stesso, il che porterà a un comportamento inatteso.

answer-max-num-attempts-in-section-wide-check-work = Impostare `maxNumAttempts` su un `<answer>` dentro un contenitore con `sectionWideCheckWork` non ha effetto: il numero di tentativi è controllato dal contenitore. Imposta `maxNumAttempts` sul contenitore.

nested-section-wide-check-work-max-num-attempts = Impostare `maxNumAttempts` su un contenitore con `sectionWideCheckWork` che si trova dentro un altro contenitore con `sectionWideCheckWork` non ha effetto: il numero di tentativi è controllato dal contenitore esterno. Imposta `maxNumAttempts` sul contenitore esterno.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] L’attributo { $attributes } non avrà effetto senza symbolicEquality.
       *[other] Gli attributi { $attributes } non avranno effetto senza symbolicEquality.
    }

answer-invalid-type = Tipo non valido per answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Poiché il componente `<{ $component }>` non ha un nome, non può essere usato come attributo di modulo

module-attribute-name-already-defined = Il componente `<{ $component } name="{ $name }">` non può essere usato come attributo di un modulo, perché il tipo di componente `<module>` definisce già un attributo «{ $name }».

conditional-content-condition-ignored = L’attributo `condition` viene ignorato su un componente `<conditionalContent>` con figli case o else.

slider-markers-type-mismatch = Il tipo dei marcatori non corrisponde al tipo del cursore.

pretzel-problem-needs-statement-and-answer = pretzel non valido: ogni `<problem>` deve contenere uno `<statement>` e un `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel non valido: in mode="circuit" il primo `<problem>` non può essere un distrattore.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Valore { $values } non valido per l’attributo `{ $attribute }`; viene ignorato.
       *[other] Valori { $values } non validi per l’attributo `{ $attribute }`; vengono ignorati.
    }

attribute-must-be-references = Valore `{ $value }` non valido per l’attributo `{ $attribute }`. L’attributo deve essere composto da riferimenti che iniziano con `$`.

math-input-invalid-function-names = <mathInput>: nomi di funzione non validi ignorati in { $attribute }: { $names }. La parte visualizzata di ogni nome deve avere almeno 2 caratteri (lettere o trattini); può seguire un suffisso facoltativo `|<alternativa mathspeak>`.

## Building components from the source

component-type-invalid = Tipo di componente non valido: `<{ $componentType }>`

attribute-repeated = L’attributo { $attribute } non può essere ripetuto.

attribute-invalid-for-component = Attributo «{ $attribute }» non valido per un componente di tipo `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    La definizione di stile { $styleNumber } non ha contrasto sufficiente per { $context ->
        [text-on-background] il colore del testo sul colore di sfondo
        [high-contrast] il colore ad alto contrasto sull’area di disegno
        [line] il colore delle linee sull’area di disegno
        [marker] il colore dei marcatori sull’area di disegno
       *[text-on-canvas] il colore del testo sull’area di disegno
    }{ $mode ->
        [dark] { " (modalità scura)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ne serve almeno { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Sebbene la definizione di stile { $styleNumber } specifichi colori con contrasto sufficiente in modalità chiara, i colori per la modalità scura da essi derivati non offrono contrasto sufficiente tra testo e sfondo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ne serve almeno { $threshold }:1). { $suggestion ->
        [available] Per garantire un contrasto sufficiente in modalità scura, aumenta il contrasto in modalità chiara (ad esempio { $lightAttribute }="{ $lightColor }") oppure sostituisci il colore della modalità scura (ad esempio { $darkAttribute }="{ $darkColor }").
       *[none] Per garantire un contrasto sufficiente in modalità scura, aumenta il contrasto in modalità chiara oppure sostituisci i colori derivati con textColorDarkMode e/o backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Sebbene la definizione di stile { $styleNumber } specifichi un colore del testo con contrasto sufficiente in modalità chiara, il colore del testo per la modalità scura da esso derivato non offre contrasto sufficiente sull’area di disegno ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ne serve almeno { $threshold }:1). { $suggestion ->
        [available] Per garantire un contrasto sufficiente in modalità scura, aumenta il contrasto in modalità chiara (ad esempio textColor="{ $lightColor }") oppure sostituisci il colore della modalità scura (ad esempio textColorDarkMode="{ $darkColor }").
       *[none] Per garantire un contrasto sufficiente in modalità scura, aumenta il contrasto in modalità chiara oppure sostituisci il colore derivato con textColorDarkMode.
    }

section-multiple-style-palettes = Una sezione può selezionare una sola <stylePalette>; viene usata l’ultima.

## Unique variants

variant-num-to-select-not-non-negative-integer = non è possibile determinare le varianti uniche di { $component }, perché numToSelect non è un intero non negativo.

variant-num-to-select-not-constant-number = non è possibile determinare le varianti uniche di { $component }, perché numToSelect non è un numero costante.

variant-with-replacement-not-constant-boolean = non è possibile determinare le varianti uniche di { $component }, perché withReplacement non è un booleano costante.

variant-select-weight-disables-unique = Le varianti uniche per select sono disattivate se un’opzione specifica selectWeight o selectForVariants

variant-coprime-undetermined = non è possibile determinare le varianti uniche di { $component }, perché non si può stabilire che coprime sia sempre falso.

variant-attribute-not-constant = non è possibile determinare le varianti uniche di { $component }, perché { $attribute } non è una costante.

variant-attribute-not-number = non è possibile determinare le varianti uniche di { $component }, perché { $attribute } non è un numero.

variant-attribute-wrong-type-for-sequence =
    non è possibile determinare le varianti uniche di { $component } di tipo { $type }, perché { $attribute } non è { $expected ->
        [letters-combination] una combinazione di lettere
        [math-expression] un’espressione matematica valida
        [integer] un intero
       *[number] un numero
    }.

variant-length-not-integer = non è possibile determinare le varianti uniche di { $component }, perché length non è un intero.

variant-sort-not-implemented = le varianti uniche di un { $component } con sort non sono implementate

variant-exclude-combinations-not-implemented = le varianti uniche di un { $component } con excludeCombinations non sono implementate

variant-math-exclude-not-implemented = le varianti uniche di un { $component } di tipo math con exclude non sono implementate

variant-non-constant-exclude-not-implemented = le varianti uniche di un { $component } con exclude non costante non sono implementate

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: non supportato nel renderer prefigure del grafico; discendente saltato.

prefigure-descendant-invalid-geometry = { $subject }: geometria non finita o incompleta; discendente saltato.

prefigure-curve-label-omitted = { $subject }: le etichette non sono supportate sugli elementi curva convertiti; etichetta omessa.

prefigure-curve-unsupported-definition-type = { $subject }: tipo di definizione della funzione curva «{ $definitionType }» non supportato; discendente saltato.

prefigure-region-flip-functions-unsupported = { $subject }: l’attributo flipFunctions su regionBetweenCurves non è supportato; discendente saltato.

prefigure-region-non-formula-child = { $subject }: su regionBetweenCurves sono supportate solo funzioni figlie di tipo formula; discendente saltato.

prefigure-label-position-unsupported =
    { $subject }: labelPosition «{ $labelPosition }» non supportata per { $labelKind ->
        [line-family] un’etichetta della famiglia delle rette
       *[point] un’etichetta di punto
    }; viene usato l’allineamento PreFigure predefinito.

prefigure-fill-style-unsupported = { $subject }: lo stile di riempimento «{ $fillStyle }» non è supportato da PreFigure; viene usato un riempimento pieno.

prefigure-line-style-unknown = { $subject }: stile di linea «{ $lineStyle }» sconosciuto, omesso dall’output PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: lo stile di marcatore «{ $markerStyle }» viene convertito nello stile PreFigure «diamond».

prefigure-marker-style-unsupported = { $subject }: lo stile di marcatore «{ $markerStyle }» non è supportato da PreFigure; viene usato lo stile predefinito.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` non valido; impossibile risolvere la destinazione. Annotazione omessa.

annotation-ref-multiple-targets = `<annotation>`: `ref` si è risolto in più destinazioni; viene usata la prima.

annotation-ref-outside-graph = `<annotation>`: `ref` non valido; la destinazione è fuori dal grafico che la contiene. Annotazione omessa.

annotation-ref-unsupported-target = `<annotation>`: `ref` non valido; la destinazione non è un oggetto grafico supportato dalla conversione prefigure. Annotazione omessa.

annotation-text-missing = `<annotation>`: `text` mancante o vuoto; viene emesso testo vuoto.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Rilevata dipendenza circolare.
       *[other] Rilevata dipendenza circolare che coinvolge un componente `<{ $componentType }>`.
    }

reference-no-referent = Nessun referente trovato per il riferimento: `{ $reference }`

reference-multiple-referents = Trovati più referenti per il riferimento: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Formato non valido per l’attributo { $attribute } di `<{ $componentType }>`.

children-invalid = Figli non validi per `<{ $componentType }>`: trovati figli non validi: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valore `{ $value }` non valido per l’attributo `{ $attribute }`; viene usato il valore `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Versione { $version } di DoenetML non trovata.
       *[other] Versione { $version } di DoenetML non trovata. Si ripiega sulla versione { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML non valido: { $content }

parse-tag-missing-close-tag = DoenetML non valido: il tag `{ $tag }` non ha un tag di chiusura. Era atteso un tag auto-chiudente o un tag `</{ $tagName }>`.

parse-tag-error = DoenetML non valido: errore nel tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML non valido: all’attributo `{ $attribute }` sembra mancare un valore.

parse-attribute-invalid = DoenetML non valido: attributo `{ $attribute }` non valido

parse-attribute-value-invalid = DoenetML non valido: valore di attributo `{ $value }` non valido

parse-attribute-value-quote-mismatch = DoenetML non valido: valore di attributo `{ $value }` non valido. Le virgolette non corrispondono. Sembra mancare un `{ $quote }`

parse-open-tag-name-missing = DoenetML non valido: trovato un tag senza nome, ad esempio `<`

parse-tag-not-closed = DoenetML non valido: il tag `{ $tag }` non è stato chiuso (sembra mancare un `>`).

parse-self-closing-tag-name-missing = DoenetML non valido: trovato un tag senza nome `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML non valido: il tag `{ $tag }` non è stato chiuso (sembra mancare `/>`).

parse-tag-invalid-attributes = DoenetML non valido: il tag `{ $tag }` non è valido. Potrebbe avere attributi errati.

parse-close-tag-name-missing = DoenetML non valido: trovato un tag di chiusura senza nome, ad esempio `</`

parse-attribute-value-unquoted = I valori degli attributi devono essere racchiusi tra virgolette: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML non valido: trovato il tag di chiusura `{ $tag }`, ma nessun tag di apertura corrispondente

parse-close-tag-mismatched = DoenetML non valido: tag di chiusura non corrispondente. Atteso `</{ $expected }>`. Trovato `{ $found }`

parser-node-unconvertible = Non è stato possibile convertire il nodo { $node } in un nodo Dast.

## Names

name-attribute-invalid =
    Attributo name='{ $name }' non valido. { $reason ->
        [characters] I nomi possono contenere solo lettere, numeri, trattini bassi o trattini.
       *[start] I nomi devono iniziare con una lettera.
    }

component-name-invalid-start = Nome di componente «{ $name }» non valido. I nomi devono iniziare con una lettera.

## `<answer>` sugar

answer-video-watched-missing-video = Un answer di tipo videoWatched deve avere un attributo video

answer-video-watched-video-not-reference = Un answer di tipo videoWatched deve avere un attributo video che sia un riferimento

answer-name-not-single-text = L’attributo name di un answer deve avere un unico figlio di tipo testo

## Referencing another document

external-doenetml-recursion-limit = Non è stato possibile recuperare il DoenetML esterno per troppi livelli di ricorsione. C’è un riferimento circolare?

external-doenetml-unavailable = Non è stato possibile recuperare il DoenetML da { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML non valido recuperato da { $attribute }="{ $uri }": non corrisponde al tipo di componente «{ $componentType }»

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] L’attributo `{ $from }` è deprecato; usa `{ $to }`.
       *[other] [deprecation] L’attributo `{ $from }` su `<{ $component }>` è deprecato; usa `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] L’attributo `{ $from }` è deprecato e viene ignorato, perché è specificato anche `{ $to }`.
       *[other] [deprecation] L’attributo `{ $from }` su `<{ $component }>` è deprecato e viene ignorato, perché è specificato anche `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] L’attributo `{ $attribute }` su `<{ $component }>` è deprecato e viene ignorato.


## Language coverage

pluralize-english-only = `<pluralize>` sa mettere al plurale solo l’inglese, quindi in un documento scritto in { $locale } il suo testo resta invariato. Scrivi direttamente il plurale, oppure indicalo con l’attributo `pluralForm`.


## Checking against the schema

schema-element-unrecognized = L’elemento `<{ $tag }>` non è un elemento Doenet riconosciuto.

schema-element-not-allowed-at-root = L’elemento `<{ $tag }>` non è ammesso alla radice del documento.

schema-element-not-allowed-inside = L’elemento `<{ $tag }>` non è ammesso dentro `<{ $parent }>`.

schema-attribute-unrecognized = L’elemento `<{ $tag }>` non ha un attributo di nome `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] L’attributo `{ $attribute }` dell’elemento `<{ $tag }>` deve essere un elenco i cui elementi siano ciascuno uno tra: { $allowed }
       *[other] L’attributo `{ $attribute }` dell’elemento `<{ $tag }>` deve essere uno tra: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nome di variante non valido per select. Il nome di variante { $variantName } compare in { $numOptions } opzioni, ma il numero da selezionare è { $numToSelect }.

select-variant-name-without-options = Per select sono specificate delle varianti, ma nessuna opzione per il possibile nome di variante: { $variantName }.

select-variant-name-not-possible = Il nome di variante { $variantName } specificato per select non è un nome di variante possibile.

select-too-few-options = Non è possibile selezionare { $numToSelect } componenti da soli { $numOptions }.

select-from-sequence-too-few-values = Non è possibile selezionare { $numToSelect } valori da una successione di lunghezza { $length }.

select-from-sequence-indices-count-mismatch = Il numero di indici specificati per select deve corrispondere al numero da selezionare

select-from-sequence-indices-not-integers = Tutti gli indici specificati per select devono essere interi

select-from-sequence-index-excluded = Un indice specificato di selectfromsequence era escluso

select-from-sequence-indices-excluded-combination = Gli indici specificati di selectfromsequence formavano una combinazione esclusa

select-from-sequence-coprime-not-positive-integers = Non è possibile selezionare combinazioni di numeri coprimi, perché non si stanno selezionando interi positivi.

select-from-sequence-coprime-common-factor = Non è possibile selezionare numeri coprimi. Tutti i valori possibili hanno un fattore comune. (I valori specificati di "from" o "to" devono essere coprimi con "step".)

select-from-sequence-coprime-single-number = Non è possibile selezionare combinazioni di numeri coprimi da un solo numero diverso da 1.

select-from-sequence-excluded-too-many-combinations = Escluso oltre il 70% delle combinazioni in selectFromSequence

select-from-sequence-coprime-none-found = Non è stato possibile selezionare numeri coprimi. Tutti i valori possibili hanno un fattore comune.

select-from-sequence-too-few-unique-values = Non è possibile selezionare { $numToSelect } valori distinti da una successione di lunghezza { $numPossibleValues }

select-prime-numbers-too-few-values = Non è possibile selezionare { $numToSelect } valori da un elenco di { $numValues } numeri primi

select-prime-numbers-values-count-mismatch = Il numero di valori specificati per select deve corrispondere al numero da selezionare

select-prime-numbers-values-not-prime = Tutti i valori specificati per select prime number devono essere nell’elenco dei numeri primi

select-prime-numbers-values-excluded-combination = I valori specificati di selectPrimeNumbers formavano una combinazione esclusa

select-prime-numbers-excluded-too-many-combinations = Escluso oltre il 70% delle combinazioni in selectPrimeNumbers

select-random-combination-fluke = Per una coincidenza estremamente improbabile, non è stato possibile selezionare una combinazione di valori casuali

select-random-value-fluke = Per una coincidenza estremamente improbabile, non è stato possibile selezionare un valore casuale
