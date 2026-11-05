# Neapolitan (napulitano) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography and metaphony.** See `chrome.ftl`.
#
# **What makes these sentences Neapolitan rather than Italian in Neapolitan
# spelling** is the negation and the auxiliary: «nun se pò», «nun tene», «s'è
# truvato», «ca» for *that*, «tené» rather than «avé» for *to have*. A sentence
# here without one of those is very likely still Italian, and that is this
# file's quickest check.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber` — are part of the language, not prose,
# and stay in English exactly as written. So does anything quoted back from the
# author's own source, and so do `WCAG AA`, `DoenetML`, `PreFigure` and
# `prefigure`, which are names.
#
# **Number.** CLDR has no plural rules for `nap`, so no `zero`, `two`, `few` or
# `many` branch appears anywhere. Every **symbolic** selector — `$type`,
# `$mode`, `$reason`, `$context`, `$suggestion`, `$alternative`, `$fallback`,
# `$expected`, `$labelKind`, `$isList`, `$componentType` — is kept byte for
# byte from English, keys included.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } vene lassato stà quanno se danno dduje strieme
       *[other] { $attributes } veneno lassate stà quanno se danno dduje strieme
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } vene lassato stà quanno se danno nu striemo e nu punto 'e miezo
       *[other] { $attributes } veneno lassate stà quanno se danno nu striemo e nu punto 'e miezo
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset nun tene effetto senza nu punto 'e miezo

## `<line>`

line-points-undetermined-dimensions = Linea pe punte 'e dimensione nun determinata.

line-points-too-few-dimensions = Na linea ha dda passà pe punte 'e almeno ddoje dimensione.

line-points-depend-on-variables = 'A linea passa pe punte ca dipenneno d''e variabbele: { $variables }.

line-equation-invalid-format = Furmato ca nun va bbuono p''a equazione d''a linea dint'e variabbele { $variable1 } e { $variable2 }.

## `<ray>`

ray-overprescribed-through = 'A semiretta è definita 'a through, endpoint e direction.  'O through dato vene lassato stà.

ray-dimension-mismatch = numDimensions nun cumbaccia dint''a semiretta.

## `<vector>`

vector-overprescribed-head = 'O vettore è definito 'a head, tail e displacement.  'O head dato vene lassato stà.

vector-dimension-mismatch = numDimensions nun cumbaccia dint''o vettore.

## Attracting and constraining

attract-to-without-nearest-point = Nun se pò tirà verso nu `<{ $component }>`, pecché nun tene 'a variabbele 'e stato nearestPoint.

constrain-to-without-nearest-point = Nun se pò vincolà a nu `<{ $component }>`, pecché nun tene 'a variabbele 'e stato nearestPoint.

constrain-to-interior-without-nearest-point = Nun se pò vincolà a 'o ddinto 'e nu `<{ $component }>`, pecché nun tene 'a variabbele 'e stato nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition vene lassato stà pe nu choiceInput ca nun è inline

## Ordering children by index

choice-input-indices-count-mismatch = Se lassano stà ll'innece date pe choiceInput, pecché 'o nummero 'e innece nun cumbaccia c''o nummero 'e figlie choice.

pretzel-indices-count-mismatch = Se lassano stà ll'innece date pe problem, pecché 'o nummero 'e innece nun cumbaccia c''o nummero 'e figlie problem.

shuffle-indices-count-mismatch = Se lassano stà ll'innece date pe shuffle, pecché 'o nummero 'e innece nun cumbaccia c''o nummero 'e cumpunente.

indices-ignored-out-of-range = Se lassano stà ll'innece date pe { $component }, pecché quacche innece sta fora d''o campo.

pretzel-indices-repeated = Se lassano stà ll'innece date pe pretzel, pecché quacche innece è ripetuto.

pretzel-circuit-first-index = Se lassano stà ll'innece date pe pretzel int''a manera circuit, pecché 'o primmo innece ha dda essere 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Pecché `<{ $component }>` funziona cu figlie 'e testo, ce vò nu attributo `type`.

invalid-type-defaulting-to-math = Tipo { $type } ca nun va bbuono p''o cumpunente { $component }. Ha dda essere uno 'nfra math, text, number o boolean. Se piglia math.

string-not-valid-component-to-arrange = 'O testo "{ $value }" nun è nu cumpunente bbuono 'a { $component }. Se lassa stà.

## Types and variables

invalid-type-defaulting-to-number = Tipo { $type } ca nun va bbuono, se mette 'o tipo a number.

invalid-variable-value = Valore ca nun va bbuono 'e na variabbele: `{ $value }`

## Variants

variant-index-must-be-number = ll'innece 'e variante { $index } ha dda essere nu nummero

variant-index-must-be-integer = ll'innece 'e variante { $index } ha dda essere nu nummero intero

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` nun è fatto pe mmesure assolute. Se metteno 'e larghezze a relative.

side-by-side-absolute-margins = `<{ $component }>` nun è fatto pe mmesure assolute. Se metteno 'e margine a relative.

side-by-side-no-block-child = `<{ $component }>` ca nun va bbuono: ha dda tené almeno nu figlio 'e blocco.

## `<label>`

label-for-ignored-on-graphical = ll'attributo `for` ncopp'a na `<label>` grafeca vene lassato stà.

label-for-must-resolve-to-one = ll'attributo `for` ncopp'a `<label>` ha dda purtà a giusto nu cumpunente.

label-for-unresolved = ll'attributo `for` ncopp'a `<label>` nun s'è arrivato a risolvere a nu cumpunente.

label-for-answer-with-authored-inputs = ll'attributo `for` ncopp'a `<label>` fa riferimento a nu `<answer>` cu input scritte a mmano; fa riferimento deritto a ll'input.

label-for-answer-without-input = ll'attributo `for` ncopp'a `<label>` fa riferimento a nu `<answer>` senza nu input 'a etichettà.

label-for-must-reference-input-or-answer = ll'attributo `for` ncopp'a `<label>` ha dda fà riferimento a nu input o a na risposta.

## Accessibility

accessibility-short-description-or-decorative = P''a accessibbilità, `<{ $component }>` ha dda tené na descrizione corta o essere signato comme decorativo.

accessibility-video-short-description = P''a accessibbilità, `<video>` ha dda tené na descrizione corta.

accessibility-input-short-description-or-label = P''a accessibbilità, `<{ $component }>` ha dda tené na descrizione corta o na etichetta.

accessibility-answer-input-short-description-or-label = P''a accessibbilità, nu `<answer>` ca crea nu input ha dda tené na descrizione corta o na etichetta.

accessibility-short-description-contains-math = 'E descrizione corte nun hanno dda tené dinto cumpunente matematece comme `<{ $component }>`. Scrive 'a matematica cu 'e pparole.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } nun tene abbastanza cuntrasto p''o testo d''o titolo d''a sezione (manera scura) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ce vò almeno { $threshold }:1).
       *[other] { $colorName } nun tene abbastanza cuntrasto p''o testo d''o titolo d''a sezione ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ce vò almeno { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Nu `<circle>` pe { $count } punte nun è fatto p''o caso ca 'e punte nun teneno valure numereche.

circle-too-many-through-points = Nun se pò calculà nu cerchio pe cchiù 'e 3 punte.

circle-overprescribed-radius-center-points = Nun se pò calculà nu cerchio cu raggio, cientro e punte 'e passaggio date.

circle-center-with-multiple-points = Nun se pò calculà nu cerchio cu cientro dato pe cchiù 'e 1 punto.

circle-radius-too-small = Nun se pò calculà 'o cerchio: dato ca 'a distanza 'nfra 'e dduje punte è { $distance }, 'o raggio dato { $radius } è troppo piccolo.

circle-radius-with-many-points = Nun se pò fà nu cerchio pe cchiù 'e dduje punte cu nu raggio dato.

circle-invalid-center-or-through-points = Cientro o punte 'e passaggio d''o cerchio ca nun vanno bbuone.

circle-radius-center-with-multiple-points = Nun se pò calculà 'o raggio 'e nu cerchio cu cientro dato pe cchiù 'e 1 punto.

circle-change-radius-non-numerical = Nun se pò cagnà 'o raggio 'e nu cerchio cu punte 'e passaggio ca nun so' numerece

circle-radius-with-points-non-numerical = Nun se pò fà nu cerchio pe cchiù 'e nu punto cu nu raggio dato quanno nun ce stanno valure numereche.

circle-change-center-non-numerical = Cagnà 'o cientro 'e nu cerchio pe punte senza valure numereche nun è ancora fatto.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Dimensione ca nun abbastano p''o duminio d''a funzione. 'O duminio tene { $intervals } ntervallo ma 'a funzione tene { $inputs } input.
       *[other] Dimensione ca nun abbastano p''o duminio d''a funzione. 'O duminio tene { $intervals } ntervalle ma 'a funzione tene { $inputs } input.
    }

function-domain-invalid-format = Furmato ca nun va bbuono p''o duminio d''a funzione.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Se lassa stà nu massemo d''a funzione ca nun è numereco.
        [minimum] Se lassa stà nu mìnemo d''a funzione ca nun è numereco.
        [extremum] Se lassa stà nu striemo d''a funzione ca nun è numereco.
        [point] Se lassa stà nu punto d''a funzione ca nun è numereco.
        [slope] Se lassa stà na pennenza d''a funzione ca nun è numereca.
       *[other] Se lassa stà nu { $type } d''a funzione ca nun è numereco.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Se lassa stà nu massemo vacante d''a funzione.
        [minimum] Se lassa stà nu mìnemo vacante d''a funzione.
        [extremum] Se lassa stà nu striemo vacante d''a funzione.
        [point] Se lassa stà nu punto vacante d''a funzione.
       *[other] Se lassa stà nu { $type } vacante d''a funzione.
    }

function-points-too-close = 'A funzione tene dduje punte troppo appriesso ll'uno a ll'ato. Nun se pò definì 'a funzione.

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] 'E iterazione 'e na funzione so' pussibbele sulo si 'o nummero 'e input è 'o stesso d''o nummero 'e output. Sta funzione tene { $inputs } input e { $outputs } output.
    }

## `<sequence>`

sequence-invalid-length = Lunghezza d''a sequenza ca nun va bbona.  Ha dda essere nu nummero intero ca nun è negativo.

sequence-invalid-step = Passo d''a sequenza ca nun va bbuono.  Ha dda essere nu nummero pe na sequenza 'e tipo { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" ca nun va bbuono 'e na sequenza 'e nummere.  Ha dda essere nu nummero.

sequence-invalid-endpoint-letters = "{ $attribute }" ca nun va bbuono 'e na sequenza 'e lettere.  Ha dda essere na cumbinazione 'e lettere.

sequence-invalid-endpoint = "{ $attribute }" d''a sequenza ca nun va bbuono.

select-from-sequence-coprime-not-numbers = coprime vene lassato stà pecché nun se scegleno nummere

select-from-sequence-coprime-with-exclude-combinations = coprime vene lassato stà pecché è dato excludeCombinations

## Resolving a `target`

target-not-found = target ca nun va bbuono pe `<{ $source }>`: nun se trova 'o destinatario.

target-state-variable-not-found = target ca nun va bbuono pe `<{ $source }>`: nun se trova na variabbele 'e stato chiammata "{ $property }" ncopp'a nu `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = 'E variabbele 'e `<odeSystem>` hanno dda essere diverse d''a variabbele indipendente.

ode-system-duplicate-variable-names = Nun se ponno definì 'e funzione RHS d''a ODE cu nomme 'e variabbele dipennente ripetute.

ode-system-rhs-function-error = Nun se pò definì 'a funzione RHS d''a ODE.  Errore int''a creazione d''a funzione mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Nun se pò definì n'angolo 'nfra { $count } linee

angle-invalid-through-point = Punto ca nun va bbuono int''o through 'e `<angle>`

parabola-vertex-too-many-points = Na paràbbola cu vertice pe cchiù 'e 1 punto nun è ancora fatta.

parabola-too-many-points = Na paràbbola pe cchiù 'e 3 punte nun è ancora fatta.

intersection-too-many-items = ll'antersezione 'e cchiù 'e dduje elemente nun è ancora fatta

## Other math components

ionic-compound-not-two-ions = Nu cumposto ionico 'e ato ca dduje ione nun è ancora fatto.

ionic-compound-needs-cation-and-anion = 'O cumposto ionico è fatto sulo pe nu catione e nu anione.

solve-equations-cannot-evaluate = Nun se pò risolvere ll'equazione pecché nun s'è arrivato a valutarla: { $equation }

math-operators-operand-number-required = Ce vò dà nu operandNumber quanno se caccia nu operanno matematico.

eigen-decomposition-failed = Nun s'è arrivato a calculà ll'autovalure d''a matrice

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: 'o paràmetro { $parameters } nun cumpare int''o mudello, accussì cumbaccerà sempe cu nu vacante.
       *[other] `<matchesPattern>`: 'e paràmetre { $parameters } nun cumpareno int''o mudello, accussì cumbacceranno sempe cu nu vacante.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: nun se pò capì grid="{ $grid }". Ha dda essere none, medium, dense o dduje nummere pusitive spartute da nu spazio, comme grid="1 0.5". Nun se disegna nisciuna griglia.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` tene bisogno 'e na funzione cu { $expected ->
        [one] nu output, 'a pennenza y' 'a ogne punto, comme `y - x`
       *[other] dduje output, 'o vettore 'a ogne punto, comme `(y, -x)`
    }, ma 'a funzione data tene { $found } output. { $alternative ->
        [none] Nun se disegna niente.
       *[other] `<{ $alternative }>` è 'o cumpunente pe chella funzione. Nun se disegna niente.
    }

field-function-attribute-ignored-with-child = ll'attributo `function` vene lassato stà pecché 'a funzione è data pure dinto 'o cumpunente; se piglia chella 'e dinto. Da 'a funzione sulo a na manera d''e ddoje.

field-variables-ignored =
    `<{ $component }>`: ll'attributo `variables` nomina 'e variabbele 'e na spressione scritta deritta dinto 'o cumpunente. { $reason ->
        [function-child] 'A funzione ccà è data comme figlio `<function>`, ca nomina 'e variabbele suoje, accussì `variables` vene lassato stà.
       *[no-expression] Ccà nun nce sta nisciuna spressione 'e chella sciorta, accussì `variables` vene lassato stà.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" nun è surretto int''o renderizzatore prefigure; se piglia 'o cumpurtamento d''a pusizione a destra.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" nun è surretto int''o renderizzatore prefigure; se piglia 'o cumpurtamento d''a pusizione ncoppa.

prefigure-invalid-axis-bounds = `<graph>`: limmete d''e asse ca nun vanno bbuone p''a cunversione prefigure; se piglia 'o bbox predefinito (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: larghezza ca nun va bbona p''a cunversione prefigure; se piglia 'a larghezza predefinita d''o diagramma 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio ca nun va bbuono p''a cunversione prefigure; se piglia 'a pruporzione predefinita 1.

prefigure-grid-spacing-too-fine = `<graph>`: 'a griglia è troppo fina p''e limmete d''e asse; 'a griglia resta fora int''o renderizzatore prefigure.

prefigure-annotations-not-rendered = `<graph>`: ll'annotazione nun se disegnano quanno nun se piglia 'o renderizzatore PreFigure.

multiple-annotations-children = S'è truvato cchiù figlie `<annotations>` dint'a `<graph>`; tutte fora ca ll'urdemo veneno lassate stà.

## Referring to other components

copy-unrecognized-component-type = Nun se pò stennere o cupià nu tipo 'e cumpunente ca nun se canosce: { $type }.

copy-prop-not-found = Nun s'è truvata 'a pruprietà { $property } ncopp'a nu cumpunente 'e tipo { $component }

collect-no-source = Nisciuna surgente truvata pe collect.

collect-invalid-component-type = Nun se ponno arraccogliere cumpunente 'e tipo `<{ $component }>`, pecché è nu tipo 'e cumpunente ca nun va bbuono.

reference-index-unavailable = Nun se pò fà riferimento a ll'innece `{ $reference }`

## `<callAction>`

component-action-unavailable = Nun se pò chiammà { $action } ncopp''o cumpunente `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = 'E date teneno na forma ca nun va bbona.  'E righe teneno lunghezze diverse. Truvato int'a componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = 'E date teneno nomme 'e culonna ripetute.  Truvato int'a componentIdx :{ $componentIdx }

data-frame-missing-column-name = A 'e date ce manca nu nomme 'e culonna.  Truvato int'a componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Nu premio pe sta risposta se fonna ncopp''a risposta mannata d''o tag answer stesso, e chesto purtarrà a nu cumpurtamento ca nun se aspetta.

answer-max-num-attempts-in-section-wide-check-work = Mettere `maxNumAttempts` ncopp'a nu `<answer>` dinto a nu cuntenitore cu `sectionWideCheckWork` nun tene effetto, pecché 'o nummero 'e prove è cuntrullato d''o cuntenitore. Miette `maxNumAttempts` ncopp''o cuntenitore mmece.

nested-section-wide-check-work-max-num-attempts = Mettere `maxNumAttempts` ncopp'a nu cuntenitore cu `sectionWideCheckWork` ca sta dinto a n'ato cuntenitore cu `sectionWideCheckWork` nun tene effetto, pecché 'o nummero 'e prove è cuntrullato d''o cuntenitore 'e fora. Miette `maxNumAttempts` ncopp''o cuntenitore 'e fora mmece.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] ll'attributo { $attributes } nun tenarrà effetto senza symbolicEquality miso.
       *[other] ll'attribute { $attributes } nun tenarranno effetto senza symbolicEquality miso.
    }

answer-invalid-type = Tipo ca nun va bbuono p''a risposta: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Siccome 'o cumpunente `<{ $component }>` nun tene nu nomme, nun se pò piglià comme attributo 'e mòdulo

module-attribute-name-already-defined = 'O cumpunente `<{ $component } name="{ $name }">` nun se pò piglià comme attributo 'e nu mòdulo pecché 'o tipo 'e cumpunente `<module>` tene già nu attributo "{ $name }" definito.

conditional-content-condition-ignored = ll'attributo `condition` vene lassato stà ncopp'a nu cumpunente `<conditionalContent>` cu figlie case o else.

slider-markers-type-mismatch = 'O tipo d''e marcature nun cumbaccia c''o tipo d''o slider.

pretzel-problem-needs-statement-and-answer = pretzel ca nun va bbuono: ogne `<problem>` ha dda tené dinto nu `<statement>` e nu `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel ca nun va bbuono: int'a mode="circuit", 'o primmo `<problem>` nun pò essere nu distrattore.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Valore ca nun va bbuono { $values } p''o attributo `{ $attribute }`; se lassa stà.
       *[other] Valure ca nun vanno bbuone { $values } p''o attributo `{ $attribute }`; se lassano stà.
    }

attribute-must-be-references = Valore ca nun va bbuono `{ $value }` p''o attributo `{ $attribute }`. ll'attributo ha dda essere fatto 'e riferimente ca accummenciano cu nu `$`.

math-input-invalid-function-names = <mathInput>: se so' lassate stà nomme 'e funzione ca nun vanno bbuone int'a { $attribute }: { $names }. 'O piezzo mmustato 'e ogne nomme ha dda tené almeno 2 caràttere (lettere o trattine); doppo pò venì nu suffisso opzionale `|<alternativa mathspeak>`.

## Building components from the source

component-type-invalid = Tipo 'e cumpunente ca nun va bbuono: `<{ $componentType }>`

attribute-repeated = Nun se pò ripetere ll'attributo { $attribute }.

attribute-invalid-for-component = Attributo "{ $attribute }" ca nun va bbuono pe nu cumpunente 'e tipo `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    'A definizione 'e stile { $styleNumber } nun tene abbastanza cuntrasto pe { $context ->
        [text-on-background] 'o culore d''o testo contr''o culore d''o fondo
        [high-contrast] 'o culore a auto cuntrasto contr''a tela
        [line] 'o culore d''a linea contr''a tela
        [marker] 'o culore d''a marcatura contr''a tela
       *[text-on-canvas] 'o culore d''o testo contr''a tela
    }{ $mode ->
        [dark] { " (manera scura)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ce vò almeno { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Pure ca 'a definizione 'e stile { $styleNumber } tene culure ca danno abbastanza cuntrasto p''a manera chiara, 'e culure p''a manera scura cacciate 'a sti valure nun teneno abbastanza cuntrasto 'nfra 'o culore d''o testo e 'o culore d''o fondo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ce vò almeno { $threshold }:1). { $suggestion ->
        [available] Pe tené abbastanza cuntrasto int''a manera scura, o auza 'o cuntrasto d''a manera chiara (p.es. miette { $lightAttribute }="{ $lightColor }") o passa ncoppa 'o culore d''a manera scura (p.es. miette { $darkAttribute }="{ $darkColor }").
       *[none] Pe tené abbastanza cuntrasto int''a manera scura, auza 'o cuntrasto d''a manera chiara o passa ncoppa 'e culure cacciate cu textColorDarkMode e/o backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Pure ca 'a definizione 'e stile { $styleNumber } tene nu culore d''o testo ca dà abbastanza cuntrasto p''a manera chiara, 'o culore d''o testo p''a manera scura cacciato 'a chillo valore nun tene abbastanza cuntrasto contr''a tela ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ce vò almeno { $threshold }:1). { $suggestion ->
        [available] Pe tené abbastanza cuntrasto int''a manera scura, o auza 'o cuntrasto d''a manera chiara (p.es. miette textColor="{ $lightColor }") o passa ncoppa 'o culore d''a manera scura (p.es. miette textColorDarkMode="{ $darkColor }").
       *[none] Pe tené abbastanza cuntrasto int''a manera scura, auza 'o cuntrasto d''a manera chiara o passa ncoppa 'o culore cacciato cu textColorDarkMode.
    }

section-multiple-style-palettes = Na sezione pò sceglière nu <stylePalette> sulo; se piglia ll'urdemo.

## Unique variants

variant-num-to-select-not-non-negative-integer = nun se ponno determinà 'e variante ùneche 'e { $component }, pecché numToSelect nun è nu nummero intero ca nun è negativo.

variant-num-to-select-not-constant-number = nun se ponno determinà 'e variante ùneche 'e { $component }, pecché numToSelect nun è nu nummero custante.

variant-with-replacement-not-constant-boolean = nun se ponno determinà 'e variante ùneche 'e { $component }, pecché withReplacement nun è nu boolean custante.

variant-select-weight-disables-unique = 'E variante ùneche pe select stanno stutate si na opzione tene selectWeight o selectForVariants dato

variant-coprime-undetermined = nun se ponno determinà 'e variante ùneche 'e { $component }, pecché nun se pò determinà ca coprime è sempe fauzo.

variant-attribute-not-constant = nun se ponno determinà 'e variante ùneche 'e { $component }, pecché { $attribute } nun è na custante.

variant-attribute-not-number = nun se ponno determinà 'e variante ùneche 'e { $component }, pecché { $attribute } nun è nu nummero.

variant-attribute-wrong-type-for-sequence =
    nun se ponno determinà 'e variante ùneche 'e { $component } 'e tipo { $type }, pecché { $attribute } nun è { $expected ->
        [letters-combination] na cumbinazione 'e lettere
        [math-expression] na spressione matematica bbona
        [integer] nu nummero intero
       *[number] nu nummero
    }.

variant-length-not-integer = nun se ponno determinà 'e variante ùneche 'e { $component }, pecché length nun è nu nummero intero.

variant-sort-not-implemented = 'e variante ùneche 'e nu { $component } cu sort nun so' ancora fatte

variant-exclude-combinations-not-implemented = 'e variante ùneche 'e nu { $component } cu excludeCombinations nun so' ancora fatte

variant-math-exclude-not-implemented = 'e variante ùneche 'e nu { $component } 'e tipo math cu exclude nun so' ancora fatte

variant-non-constant-exclude-not-implemented = 'e variante ùneche 'e nu { $component } cu nu exclude ca nun è custante nun so' ancora fatte

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: nun è surretto int''o renderizzatore prefigure d''o grafeco; 'o descennente vene sautato.

prefigure-descendant-invalid-geometry = { $subject }: geometria ca nun è fenita o nun è cumpleta; 'o descennente vene sautato.

prefigure-curve-label-omitted = { $subject }: 'e etichette nun so' surrette ncopp''e elemente 'e curva cunvertute; 'a etichetta resta fora.

prefigure-curve-unsupported-definition-type = { $subject }: tipo 'e definizione d''a curva '{ $definitionType }' ca nun è surretto; 'o descennente vene sautato.

prefigure-region-flip-functions-unsupported = { $subject }: attributo flipFunctions ca nun è surretto ncopp'a regionBetweenCurves; 'o descennente vene sautato.

prefigure-region-non-formula-child = { $subject }: sulo 'e funzione figlio 'e tipo fòrmula so' surrette ncopp'a regionBetweenCurves; 'o descennente vene sautato.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' ca nun è surretto pe { $labelKind ->
        [line-family] na etichetta d''a famiglia d''e linee
       *[point] na etichetta 'e punto
    }; se piglia ll'allineamento predefinito 'e PreFigure.

prefigure-fill-style-unsupported = { $subject }: 'o stile 'e chinatura '{ $fillStyle }' nun è surretto 'a PreFigure; se torna a na chinatura chiena.

prefigure-line-style-unknown = { $subject }: 'o stile 'e linea ca nun se canosce '{ $lineStyle }' resta fora d''o output 'e PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: 'o stile 'e marcatura '{ $markerStyle }' è stato purtato ncopp''o stile PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: 'o stile 'e marcatura '{ $markerStyle }' nun è surretto 'a PreFigure; se piglia 'o stile predefinito.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ca nun va bbuono; nun se pò risolvere 'o destinatario. ll'annotazione resta fora.

annotation-ref-multiple-targets = `<annotation>`: `ref` s'è risuluto a cchiù destinatarie; se piglia 'o primmo.

annotation-ref-outside-graph = `<annotation>`: `ref` ca nun va bbuono; 'o destinatario sta fora d''o grafeco ca 'o tene. ll'annotazione resta fora.

annotation-ref-unsupported-target = `<annotation>`: `ref` ca nun va bbuono; 'o destinatario nun è nu oggetto grafeco surretto int''a cunversione prefigure. ll'annotazione resta fora.

annotation-text-missing = `<annotation>`: `text` manca o è vacante; se manna fora testo vacante.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] S'è truvata na dipennenza circolare.
       *[other] S'è truvata na dipennenza circolare ca piglia dinto nu cumpunente `<{ $componentType }>`.
    }

reference-no-referent = Nisciuno referente truvato p''o riferimento: `{ $reference }`

reference-multiple-referents = Cchiù referente truvate p''o riferimento: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Furmato ca nun va bbuono p''o attributo { $attribute } 'e `<{ $componentType }>`.

children-invalid = Figlie ca nun vanno bbuone pe `<{ $componentType }>`: s'è truvato figlie ca nun vanno bbuone: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valore ca nun va bbuono `{ $value }` p''o attributo `{ $attribute }`, se piglia 'o valore `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Versione 'e DoenetML { $version } nun truvata.
       *[other] Versione 'e DoenetML { $version } nun truvata. Se torna â versione { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ca nun va bbuono: { $content }

parse-tag-missing-close-tag = DoenetML ca nun va bbuono: 'O tag `{ $tag }` nun tene nu tag 'e chiusura. Se aspettava nu tag ca se chiure d''o sujo o nu tag `</{ $tagName }>`.

parse-tag-error = DoenetML ca nun va bbuono: Errore int''o tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML ca nun va bbuono: Pare ca a ll'attributo ca nun va bbuono `{ $attribute }` ce manca nu valore.

parse-attribute-invalid = DoenetML ca nun va bbuono: Attributo ca nun va bbuono `{ $attribute }`

parse-attribute-value-invalid = DoenetML ca nun va bbuono: Valore 'e attributo ca nun va bbuono `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML ca nun va bbuono: Valore 'e attributo ca nun va bbuono `{ $value }`. 'E virgulette nun cumbacceno. Pare ca te manca nu `{ $quote }`

parse-open-tag-name-missing = DoenetML ca nun va bbuono: S'è truvato nu tag senza nomme 'e tag, p.es. `<`

parse-tag-not-closed = DoenetML ca nun va bbuono: 'O tag `{ $tag }` nun è stato chiuso (pare ca manca nu `>`).

parse-self-closing-tag-name-missing = DoenetML ca nun va bbuono: S'è truvato nu tag senza nomme 'e tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ca nun va bbuono: 'O tag `{ $tag }` nun è stato chiuso (pare ca manca `/>`).

parse-tag-invalid-attributes = DoenetML ca nun va bbuono: 'O tag `{ $tag }` nun va bbuono. Putarrìa tené attribute sbagliate.

parse-close-tag-name-missing = DoenetML ca nun va bbuono: S'è truvato nu tag 'e chiusura senza nomme 'e tag, p.es. `</`

parse-attribute-value-unquoted = 'E valure d''e attribute hanno dda stà 'nfra virgulette: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ca nun va bbuono: S'è truvato 'o tag 'e chiusura `{ $tag }`, ma nisciuno tag 'e apertura ca ce cumbaccia

parse-close-tag-mismatched = DoenetML ca nun va bbuono: Tag 'e chiusura ca nun cumbaccia. Se aspettava `</{ $expected }>`. S'è truvato `{ $found }`

parser-node-unconvertible = Nun s'è arrivato a cunvertì 'o nodo { $node } a nu nodo Dast.

## Names

name-attribute-invalid =
    Attributo ca nun va bbuono name='{ $name }'. { $reason ->
        [characters] 'E nomme ponno tené sulo lettere, nummere, sottolineate o trattine.
       *[start] 'E nomme hanno dda accummincià cu na lettera.
    }

component-name-invalid-start = Nomme 'e cumpunente ca nun va bbuono "{ $name }". 'E nomme hanno dda accummincià cu na lettera.

## `<answer>` sugar

answer-video-watched-missing-video = Na risposta 'e tipo videoWatched ha dda tené nu attributo video

answer-video-watched-video-not-reference = Na risposta 'e tipo videoWatched ha dda tené nu attributo video ca è nu riferimento

answer-name-not-single-text = ll'attributo name d''a risposta ha dda tené nu figlio 'e testo sulo

## Referencing another document

external-doenetml-recursion-limit = Nun se pò piglià 'o DoenetML 'e fora pe troppe livelle 'e ricursione. Nce sta nu riferimento circolare?

external-doenetml-unavailable = Nun se pò piglià 'o DoenetML 'a { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML ca nun va bbuono pigliato 'a { $attribute }="{ $uri }": nun cumbacciava c''o tipo 'e cumpunente "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] ll'attributo `{ $from }` è passato; piglia `{ $to }` mmece.
       *[other] [deprecation] ll'attributo `{ $from }` ncopp'a `<{ $component }>` è passato; piglia `{ $to }` mmece.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] ll'attributo `{ $from }` è passato e vene lassato stà pecché è dato pure `{ $to }`.
       *[other] [deprecation] ll'attributo `{ $from }` ncopp'a `<{ $component }>` è passato e vene lassato stà pecché è dato pure `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] ll'attributo `{ $attribute }` ncopp'a `<{ $component }>` è passato e vene lassato stà.

deprecated-attribute-to-child = [deprecation] ll'attributo `{ $attribute }` ncopp'a `<{ $component }>` è passato; piglia mmece nu figlio `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] 'O valore `{ $value }` 'e ll'attributo `{ $attribute }` ncopp'a `<{ $component }>` è passato; piglia `{ $to }` mmece.


## Language coverage

pluralize-english-only = `<pluralize>` pò mettere a 'o plurale sulo ll'inglese, accussì 'o testo suio resta comm'è int'a nu documento scritto in { $locale }. Scrive 'a forma plurale deritta, o mettela cu ll'attributo `pluralForm`.


## Checking against the schema

schema-element-unrecognized = ll'elemento `<{ $tag }>` nun è nu elemento Doenet ca se canosce.

schema-element-not-allowed-at-root = ll'elemento `<{ $tag }>` nun è permesso â radeca d''o documento.

schema-element-not-allowed-inside = ll'elemento `<{ $tag }>` nun è permesso dinto a `<{ $parent }>`.

schema-attribute-unrecognized = ll'elemento `<{ $tag }>` nun tene nu attributo chiammato `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] ll'attributo `{ $attribute }` 'e ll'elemento `<{ $tag }>` ha dda essere na lista addò ogne elemento è uno 'nfra: { $allowed }
       *[other] ll'attributo `{ $attribute }` 'e ll'elemento `<{ $tag }>` ha dda essere uno 'nfra: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nomme 'e variante ca nun va bbuono pe select.  'O nomme 'e variante { $variantName } cumpare int'a { $numOptions } opzione ma 'o nummero 'a sceglière è { $numToSelect }.

select-variant-name-without-options = So' date quacche variante pe select ma nisciuna opzione p''o nomme 'e variante pussibbele: { $variantName }.

select-variant-name-not-possible = 'O nomme 'e variante { $variantName } dato pe select nun è nu nomme 'e variante pussibbele.

select-too-few-options = Nun se ponno sceglière { $numToSelect } cumpunente 'a sulo { $numOptions }.

select-from-sequence-too-few-values = Nun se ponno sceglière { $numToSelect } valure 'a na sequenza 'e lunghezza { $length }.

select-from-sequence-indices-count-mismatch = 'O nummero 'e innece date pe select ha dda cumbaccià c''o nummero 'a sceglière

select-from-sequence-indices-not-integers = Tutte ll'innece date pe select hanno dda essere nummere intere

select-from-sequence-index-excluded = ll'innece dato 'e selectfromsequence steva fora

select-from-sequence-indices-excluded-combination = ll'innece date 'e selectfromsequence erano na cumbinazione lassata fora

select-from-sequence-coprime-not-positive-integers = Nun se ponno sceglière cumbinazione coprime pecché nun se scegleno nummere intere pusitive.

select-from-sequence-coprime-common-factor = Nun se ponno sceglière nummere coprime. Tutte 'e valure pussibbele teneno nu fattore cummune. ('E valure date 'e "from" o "to" hanno dda essere coprime cu "step".)

select-from-sequence-coprime-single-number = Nun se ponno sceglière cumbinazione coprime 'a nu nummero sulo ca nun è 1.

select-from-sequence-excluded-too-many-combinations = S'è lassato fora cchiù d''o 70% d''e cumbinazione int'a selectFromSequence

select-from-sequence-coprime-none-found = Nun s'è arrivato a sceglière nummere coprime. Tutte 'e valure pussibbele teneno nu fattore cummune.

select-from-sequence-too-few-unique-values = Nun se ponno sceglière { $numToSelect } valure ùneche 'a na sequenza 'e lunghezza { $numPossibleValues }

select-prime-numbers-too-few-values = Nun se ponno sceglière { $numToSelect } valure 'a na lista 'e nummere primme 'e lunghezza { $numValues }

select-prime-numbers-values-count-mismatch = 'O nummero 'e valure date pe select ha dda cumbaccià c''o nummero 'a sceglière

select-prime-numbers-values-not-prime = Tutte 'e valure date pe select 'e nummere primme hanno dda stà int''a lista d''e nummere primme

select-prime-numbers-values-excluded-combination = 'E valure date 'e selectPrimeNumbers erano na cumbinazione lassata fora

select-prime-numbers-excluded-too-many-combinations = S'è lassato fora cchiù d''o 70% d''e cumbinazione int'a selectPrimeNumbers

select-random-combination-fluke = Pe nu caso straurdinariamente mpruvàbbele, nun s'è arrivato a sceglière na cumbinazione 'e valure a ccaso

select-random-value-fluke = Pe nu caso straurdinariamente mpruvàbbele, nun s'è arrivato a sceglière nu valore a ccaso

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` nun se disegna dint''a matematica; 'a spressione se cumpone comm'era primma ca se putessero mettere input dinto. { $reason ->
        [not-inline] Sulo nu input 'e scelta `inline` ce trase dint'a na spressione; senza `inline` è nu blocco 'e buttune.
        [expanded] Nu input 'e testo `expanded` è na casella ncopp'a cchiù righe, troppo gruossa pe stà dint'a na spressione.
        [on-graph] Ncopp'a nu grafeco 'a spressione se disegna comme na figura sola, ca nun tene posto pe nu cuntrollo.
       *[relative-width] 'A `width` soia è relativa (na percentuale o `em`), e nun tene niente 'a mmesurà dint'a na spressione. Da 'a larghezza a unità assolute, comme `px`, mmece.
    }
