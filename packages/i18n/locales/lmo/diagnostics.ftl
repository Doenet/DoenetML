# Lombard (lombard) diagnostics. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Variety and orthography.** Western Lombard in its Milanese form, in the
# classical Milanese orthography; see `chrome.ftl` for the note on «oeu», on
# «o» = /u/ against «u» = /y/, and on why Eastern Lombard would differ
# throughout.
#
# **The quickest check that a line here is Lombard** and not Italian in
# Milanese spelling: the postverbal negator **«minga»** («l'è minga valid»,
# «se pò minga», «el gh'ha minga»), the subject clitic on a finite verb («el
# gh'ha», «l'è», «hinn», «gh'è»), «pussee» for *more*, «tucc» for *all*,
# «nagott» for *nothing*, «amò» for *yet*, «erròr» for *error*. A sentence in
# this file with none of those is very likely still Italian.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber` — are part of the language, not prose,
# and stay in English exactly as written. So does anything quoted back from the
# author's own source, and so do `WCAG AA`, `DoenetML`, `PreFigure` and
# `prefigure`, which are names. Digits render in Latin numerals everywhere.
#
# **Counts.** CLDR has **no** plural rules for `lmo`, so **no** `zero`, `two`,
# `few` or `many` branch appears anywhere in this locale. `[one]`/`*[other]` is
# kept, and only that: it is the split the runtime fallback makes, it is the
# split Milanese itself needs (the feminine plural is a real ending and the
# verb agrees even where a masculine noun does not), and in
# `field-function-wrong-num-outputs` the two branches say different things
# rather than the same thing twice. Every **symbolic** selector — `$type`,
# `$mode`, `$reason`, `$context`, `$suggestion`, `$alternative`, `$fallback`,
# `$expected`, `$labelKind`, `$isList`, `$componentType` — is kept byte for
# byte from English, keys included.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } el ven ignoraa quand che se dà duu pont final
       *[other] { $attributes } vegnen ignoraa quand che se dà duu pont final
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } el ven ignoraa quand che se dà on pont final e on pont de mezz
       *[other] { $attributes } vegnen ignoraa quand che se dà on pont final e on pont de mezz
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset el gh'ha nissun effett senza on pont de mezz

## `<line>`

line-points-undetermined-dimensions = Linea per pont de dimension minga determinada.

line-points-too-few-dimensions = Ona linea la gh'ha de passà per pont de almen duu dimension.

line-points-depend-on-variables = La linea la passa per pont che dipenden de variabil: { $variables }.

line-equation-invalid-format = Format minga valid per l'equazion de la linea in li variabil { $variable1 } e { $variable2 }.

## `<ray>`

ray-overprescribed-through = La semiretta l'è definida de through, endpoint e direction.  El through daa el ven ignoraa.

ray-dimension-mismatch = numDimensions el corispond minga in la semiretta.

## `<vector>`

vector-overprescribed-head = El vettor l'è definii de head, tail e displacement.  El head daa el ven ignoraa.

vector-dimension-mismatch = numDimensions el corispond minga in del vettor.

## Attracting and constraining

attract-to-without-nearest-point = Se pò minga tirà vers on `<{ $component }>`, perché el gh'ha minga la variabil de staa nearestPoint.

constrain-to-without-nearest-point = Se pò minga vincolà a on `<{ $component }>`, perché el gh'ha minga la variabil de staa nearestPoint.

constrain-to-interior-without-nearest-point = Se pò minga vincolà a l'intern de on `<{ $component }>`, perché el gh'ha minga la variabil de staa nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition el ven ignoraa per on choiceInput che l'è minga inline

## Ordering children by index

choice-input-indices-count-mismatch = Se ignora i indes daa per choiceInput, perché el numer di indes el corispond minga al numer di fioeu choice.

pretzel-indices-count-mismatch = Se ignora i indes daa per problem, perché el numer di indes el corispond minga al numer di fioeu problem.

shuffle-indices-count-mismatch = Se ignora i indes daa per shuffle, perché el numer di indes el corispond minga al numer di component.

indices-ignored-out-of-range = Se ignora i indes daa per { $component }, perché quaich indes l'è foeura de l'interval.

pretzel-indices-repeated = Se ignora i indes daa per pretzel, perché quaich indes l'è ripetuu.

pretzel-circuit-first-index = Se ignora i indes daa per pretzel in la modalitaa circuit, perché el primm indes el gh'ha de vess 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Perché `<{ $component }>` el funzionna con fioeu de test, se gh'ha de dà on attribut `type`.

invalid-type-defaulting-to-math = Tipo { $type } minga valid per el component { $component }. El gh'ha de vess vun tra math, text, number o boolean. Se dopera math.

string-not-valid-component-to-arrange = El test "{ $value }" l'è minga on component valid per { $component }. Se lo ignora.

## Types and variables

invalid-type-defaulting-to-number = Tipo { $type } minga valid, se mett el tipo a number.

invalid-variable-value = Valor minga valid de ona variabil: `{ $value }`

## Variants

variant-index-must-be-number = L'indes de variant { $index } el gh'ha de vess on numer

variant-index-must-be-integer = L'indes de variant { $index } el gh'ha de vess on numer inter

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` l'è minga implementaa per misur assolut. Se mett li largezz a relativ.

side-by-side-absolute-margins = `<{ $component }>` l'è minga implementaa per misur assolut. Se mett i margin a relativ.

side-by-side-no-block-child = `<{ $component }>` minga valid: el gh'ha de avè almen on fioeu de bloch.

## `<label>`

label-for-ignored-on-graphical = L'attribut `for` su ona `<label>` grafica el ven ignoraa.

label-for-must-resolve-to-one = L'attribut `for` su `<label>` el gh'ha de risolves in giust on component.

label-for-unresolved = L'attribut `for` su `<label>` s'è minga poduu risolv in on component.

label-for-answer-with-authored-inputs = L'attribut `for` su `<label>` el fa riferiment a on `<answer>` con di input scritt a man; fà riferiment dritt a l'input.

label-for-answer-without-input = L'attribut `for` su `<label>` el fa riferiment a on `<answer>` senza on input de etichettà.

label-for-must-reference-input-or-answer = L'attribut `for` su `<label>` el gh'ha de fà riferiment a on input o a ona risposta.

## Accessibility

accessibility-short-description-or-decorative = Per l'accessibilitaa, `<{ $component }>` el gh'ha de avè ona descrizion curta o de vess segnaa come decorativ.

accessibility-video-short-description = Per l'accessibilitaa, `<video>` el gh'ha de avè ona descrizion curta.

accessibility-input-short-description-or-label = Per l'accessibilitaa, `<{ $component }>` el gh'ha de avè ona descrizion curta o ona etichetta.

accessibility-answer-input-short-description-or-label = Per l'accessibilitaa, on `<answer>` che el crea on input el gh'ha de avè ona descrizion curta o ona etichetta.

accessibility-short-description-contains-math = Li descrizion curt gh'hann minga de avè denter component matematich come `<{ $component }>`. Scriv la matematica con di parol.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } el gh'ha minga assee contrast per el test del titol de la session (modalitaa scura) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; el ghe voeur almen { $threshold }:1).
       *[other] { $colorName } el gh'ha minga assee contrast per el test del titol de la session ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; el ghe voeur almen { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = On `<circle>` per { $count } pont l'è minga implementaa in del cas che i pont gh'hann minga di valor numerich.

circle-too-many-through-points = Se pò minga calcolà on cerchi per pussee de 3 pont.

circle-overprescribed-radius-center-points = Se pò minga calcolà on cerchi con ragg, center e pont de passagg daa.

circle-center-with-multiple-points = Se pò minga calcolà on cerchi con center daa per pussee de 1 pont.

circle-radius-too-small = Se pò minga calcolà el cerchi: daa che la distanza tra i duu pont l'è { $distance }, el ragg daa { $radius } l'è tropp piscinin.

circle-radius-with-many-points = Se pò minga creà on cerchi per pussee de duu pont con on ragg daa.

circle-invalid-center-or-through-points = Center o pont de passagg del cerchi minga valid.

circle-radius-center-with-multiple-points = Se pò minga calcolà el ragg de on cerchi con center daa per pussee de 1 pont.

circle-change-radius-non-numerical = Se pò minga cambià el ragg de on cerchi con pont de passagg minga numerich

circle-radius-with-points-non-numerical = Se pò minga creà on cerchi per pussee de on pont con on ragg daa quand che gh'è minga di valor numerich.

circle-change-center-non-numerical = Cambià el center de on cerchi per pont senza valor numerich l'è amò minga implementaa.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Minga assee dimension per el domini de la funzion. El domini el gh'ha { $intervals } interval ma la funzion la gh'ha { $inputs ->
            [one] { $inputs } input
           *[other] { $inputs } input
        }.
       *[other] Minga assee dimension per el domini de la funzion. El domini el gh'ha { $intervals } interval ma la funzion la gh'ha { $inputs ->
            [one] { $inputs } input
           *[other] { $inputs } input
        }.
    }

function-domain-invalid-format = Format minga valid per el domini de la funzion.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Se ignora on massim de la funzion che l'è minga numerich.
        [minimum] Se ignora on minim de la funzion che l'è minga numerich.
        [extremum] Se ignora on estrem de la funzion che l'è minga numerich.
        [point] Se ignora on pont de la funzion che l'è minga numerich.
        [slope] Se ignora ona pendenza de la funzion che l'è minga numerica.
       *[other] Se ignora on { $type } de la funzion che l'è minga numerich.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Se ignora on massim voeud de la funzion.
        [minimum] Se ignora on minim voeud de la funzion.
        [extremum] Se ignora on estrem voeud de la funzion.
        [point] Se ignora on pont voeud de la funzion.
       *[other] Se ignora on { $type } voeud de la funzion.
    }

function-points-too-close = La funzion la gh'ha duu pont tropp visin vun a l'olter. Se pò minga definì la funzion.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Li iterazion de ona funzion hinn possibil domà se el numer di input l'è compagn del numer di output. Chesta funzion la gh'ha { $inputs } input e { $outputs ->
            [one] { $outputs } output
           *[other] { $outputs } output
        }.
       *[other] Li iterazion de ona funzion hinn possibil domà se el numer di input l'è compagn del numer di output. Chesta funzion la gh'ha { $inputs } input e { $outputs ->
            [one] { $outputs } output
           *[other] { $outputs } output
        }.
    }

## `<sequence>`

sequence-invalid-length = Longhezza de la sequenza minga valida.  La gh'ha de vess on numer inter minga negativ.

sequence-invalid-step = Pass de la sequenza minga valid.  El gh'ha de vess on numer per ona sequenza de tipo { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" minga valid de ona sequenza de numer.  El gh'ha de vess on numer.

sequence-invalid-endpoint-letters = "{ $attribute }" minga valid de ona sequenza de letter.  El gh'ha de vess ona combinazion de letter.

sequence-invalid-endpoint = "{ $attribute }" de la sequenza minga valid.

select-from-sequence-coprime-not-numbers = coprime el ven ignoraa perché se ciappa minga di numer

select-from-sequence-coprime-with-exclude-combinations = coprime el ven ignoraa perché s'è daa excludeCombinations

## Resolving a `target`

target-not-found = target minga valid per `<{ $source }>`: se troeuva minga el destinatari.

target-state-variable-not-found = target minga valid per `<{ $source }>`: se troeuva minga ona variabil de staa che la se ciama "{ $property }" su on `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Li variabil de `<odeSystem>` gh'hann de vess diferent de la variabil independent.

ode-system-duplicate-variable-names = Se pò minga definì li funzion RHS de l'ODE con nom de variabil dependent ripetuu.

ode-system-rhs-function-error = Se pò minga definì la funzion RHS de l'ODE.  Erròr in la creazion de la funzion mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Se pò minga definì on angol tra { $count } linee

angle-invalid-through-point = Pont minga valid in through de `<angle>`

parabola-vertex-too-many-points = Ona parabola con vertes per pussee de 1 pont l'è amò minga implementada.

parabola-too-many-points = Ona parabola per pussee de 3 pont l'è amò minga implementada.

intersection-too-many-items = L'intersezion de pussee de duu element l'è amò minga implementada

## Other math components

ionic-compound-not-two-ions = On compost ionich de quaicoss d'olter che duu ion l'è amò minga implementaa.

ionic-compound-needs-cation-and-anion = El compost ionich l'è implementaa domà per on cation e on anion.

solve-equations-cannot-evaluate = Se pò minga risolv l'equazion perché s'è minga poduu valutalla: { $equation }

math-operators-operand-number-required = Se gh'ha de dà on operandNumber quand che se tira foeura on operand matematich.

eigen-decomposition-failed = S'è minga poduu calcolà i autovalor de la matrice

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: el parametro { $parameters } el compar minga in del model, e inscì el andarà semper insemma a on voeud.
       *[other] `<matchesPattern>`: i parametri { $parameters } comparen minga in del model, e inscì andarann semper insemma a on voeud.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: se pò minga interpretà grid="{ $grid }". El gh'ha de vess none, medium, dense o duu numer positiv dividuu de on spazi, come grid="1 0.5". Se disegna nissuna gradella.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` el gh'ha bisogn de ona funzion con { $expected ->
        [one] on output, la pendenza y' in ogni pont, come `y - x`
       *[other] duu output, el vettor in ogni pont, come `(y, -x)`
    }, ma la funzion che gh'è stada dada la gh'ha { $found ->
        [one] { $found } output
       *[other] { $found } output
    }. { $alternative ->
        [none] Se disegna nagott.
       *[other] `<{ $alternative }>` l'è el component per chella funzion. Se disegna nagott.
    }

field-function-attribute-ignored-with-child = L'attribut `function` el ven ignoraa perché la funzion la gh'è dada anca denter in del component; se dopera chella denter. Dà la funzion domà in vuna de li duu manier.

field-variables-ignored =
    `<{ $component }>`: l'attribut `variables` el nomina li variabil de on'espression scritta dritt denter in del component. { $reason ->
        [function-child] La funzion chì l'è dada come fioeu `<function>`, che el nomina li so variabil, e inscì `variables` el ven ignoraa.
       *[no-expression] Chì gh'è nissuna espression de chella sort, e inscì `variables` el ven ignoraa.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" l'è minga sostegnuu in del renderizador prefigure; se dopera el compòrtament de la posizion a drizza.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" l'è minga sostegnuu in del renderizador prefigure; se dopera el compòrtament de la posizion in alt.

prefigure-invalid-axis-bounds = `<graph>`: limit di ass minga valid per la conversion prefigure; se dopera el bbox predefinii (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: largezza minga valida per la conversion prefigure; se dopera la largezza predefinida del diagramma 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio minga valid per la conversion prefigure; se dopera la proporzion predefinida 1.

prefigure-grid-spacing-too-fine = `<graph>`: la gradella l'è tropp fina per i limit di ass; la gradella la ven lassada foeura in del renderizador prefigure.

prefigure-annotations-not-rendered = `<graph>`: li anotazion vegnen minga disegnaa quand che se dopera minga el renderizador PreFigure.

multiple-annotations-children = S'è trovaa pussee fioeu `<annotations>` in `<graph>`; tucc foeura che l'ultim vegnen ignoraa.

## Referring to other components

copy-unrecognized-component-type = Se pò minga estend o copià on tipo de component minga conossuu: { $type }.

copy-prop-not-found = S'è minga trovaa la propietaa { $property } su on component de tipo { $component }

collect-no-source = Nissuna sorgent trovada per collect.

collect-invalid-component-type = Se pò minga tirà insemma di component de tipo `<{ $component }>`, perché l'è on tipo de component minga valid.

reference-index-unavailable = Se pò minga fà riferiment a l'indes `{ $reference }`

## `<callAction>`

component-action-unavailable = Se pò minga ciamà { $action } sul component `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = I daa gh'hann ona forma minga valida.  Li righ gh'hann longhezz diferent. Trovaa in componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = I daa gh'hann nom de colonna ripetuu.  Trovaa in componentIdx :{ $componentIdx }

data-frame-missing-column-name = Ai daa ghe manca on nom de colonna.  Trovaa in componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = On premi per chesta risposta l'è basaa su la risposta mandada del tag answer istess, e chest el portarà a on compòrtament minga spettaa.

answer-max-num-attempts-in-section-wide-check-work = Mett `maxNumAttempts` su on `<answer>` denter in on contegnidor con `sectionWideCheckWork` el gh'ha nissun effett, perché el numer di tentativ l'è controllaa del contegnidor. Mett `maxNumAttempts` sul contegnidor invece.

nested-section-wide-check-work-max-num-attempts = Mett `maxNumAttempts` su on contegnidor con `sectionWideCheckWork` che el sta denter in on olter contegnidor con `sectionWideCheckWork` el gh'ha nissun effett, perché el numer di tentativ l'è controllaa del contegnidor de foeura. Mett `maxNumAttempts` sul contegnidor de foeura invece.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] L'attribut { $attributes } el gh'avarà nissun effett senza symbolicEquality mettuu.
       *[other] I attribut { $attributes } gh'avarann nissun effett senza symbolicEquality mettuu.
    }

answer-invalid-type = Tipo minga valid per la risposta: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Sicome el component `<{ $component }>` el gh'ha minga on nom, se lo pò minga doperà come attribut de on modul

module-attribute-name-already-defined = El component `<{ $component } name="{ $name }">` se lo pò minga doperà come attribut de on modul perché el tipo de component `<module>` el gh'ha giamò on attribut "{ $name }" definii.

conditional-content-condition-ignored = L'attribut `condition` el ven ignoraa su on component `<conditionalContent>` con di fioeu case o else.

slider-markers-type-mismatch = El tipo di marcador el corispond minga al tipo del slider.

pretzel-problem-needs-statement-and-answer = pretzel minga valid: ogni `<problem>` el gh'ha de avè denter on `<statement>` e on `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel minga valid: in mode="circuit", el primm `<problem>` el pò minga vess on distrattor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Valor minga valid { $values } per l'attribut `{ $attribute }`; se lo ignora.
       *[other] Valor minga valid { $values } per l'attribut `{ $attribute }`; se i ignora.
    }

attribute-must-be-references = Valor minga valid `{ $value }` per l'attribut `{ $attribute }`. L'attribut el gh'ha de vess compost de riferiment che comincen con on `$`.

math-input-invalid-function-names = <mathInput>: s'è ignoraa di nom de funzion minga valid in { $attribute }: { $names }. El tocch mostraa de ogni nom el gh'ha de avè almen 2 carater (letter o tratin); dopo el pò vegnì on sufiss opzional `|<alternativa mathspeak>`.

## Building components from the source

component-type-invalid = Tipo de component minga valid: `<{ $componentType }>`

attribute-repeated = Se pò minga ripett l'attribut { $attribute }.

attribute-invalid-for-component = Attribut "{ $attribute }" minga valid per on component de tipo `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    La definizion de stil { $styleNumber } la gh'ha minga assee contrast per { $context ->
        [text-on-background] el color del test contra el color del fond
        [high-contrast] el color a alt contrast contra la tela
        [line] el color de la linea contra la tela
        [marker] el color del marcador contra la tela
       *[text-on-canvas] el color del test contra la tela
    }{ $mode ->
        [dark] { " (modalitaa scura)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; el ghe voeur almen { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Anca se la definizion de stil { $styleNumber } la gh'ha di color che dann assee contrast per la modalitaa ciara, i color per la modalitaa scura tiraa foeura de chi valor gh'hann minga assee contrast tra el color del test e el color del fond ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; el ghe voeur almen { $threshold }:1). { $suggestion ->
        [available] Per avè assee contrast in la modalitaa scura, o alza el contrast de la modalitaa ciara (p.es. mett { $lightAttribute }="{ $lightColor }") o passa denanz al color de la modalitaa scura (p.es. mett { $darkAttribute }="{ $darkColor }").
       *[none] Per avè assee contrast in la modalitaa scura, alza el contrast de la modalitaa ciara o passa denanz ai color tiraa foeura con textColorDarkMode e/o backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Anca se la definizion de stil { $styleNumber } la gh'ha on color del test che el dà assee contrast per la modalitaa ciara, el color del test per la modalitaa scura tiraa foeura de chel valor el gh'ha minga assee contrast contra la tela ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; el ghe voeur almen { $threshold }:1). { $suggestion ->
        [available] Per avè assee contrast in la modalitaa scura, o alza el contrast de la modalitaa ciara (p.es. mett textColor="{ $lightColor }") o passa denanz al color de la modalitaa scura (p.es. mett textColorDarkMode="{ $darkColor }").
       *[none] Per avè assee contrast in la modalitaa scura, alza el contrast de la modalitaa ciara o passa denanz al color tiraa foeura con textColorDarkMode.
    }

section-multiple-style-palettes = Ona session la pò ciappà domà on <stylePalette>; se dopera l'ultim.

## Unique variants

variant-num-to-select-not-non-negative-integer = se pò minga determinà i variant unich de { $component }, perché numToSelect l'è minga on numer inter minga negativ.

variant-num-to-select-not-constant-number = se pò minga determinà i variant unich de { $component }, perché numToSelect l'è minga on numer costant.

variant-with-replacement-not-constant-boolean = se pò minga determinà i variant unich de { $component }, perché withReplacement l'è minga on boolean costant.

variant-select-weight-disables-unique = I variant unich per select hinn disattivaa se ona opzion la gh'ha selectWeight o selectForVariants daa

variant-coprime-undetermined = se pò minga determinà i variant unich de { $component }, perché se pò minga determinà che coprime el sia semper fals.

variant-attribute-not-constant = se pò minga determinà i variant unich de { $component }, perché { $attribute } l'è minga ona costant.

variant-attribute-not-number = se pò minga determinà i variant unich de { $component }, perché { $attribute } l'è minga on numer.

variant-attribute-wrong-type-for-sequence =
    se pò minga determinà i variant unich de { $component } de tipo { $type }, perché { $attribute } l'è minga { $expected ->
        [letters-combination] ona combinazion de letter
        [math-expression] on'espression matematica valida
        [integer] on numer inter
       *[number] on numer
    }.

variant-length-not-integer = se pò minga determinà i variant unich de { $component }, perché length l'è minga on numer inter.

variant-sort-not-implemented = i variant unich de on { $component } con sort hinn amò minga implementaa

variant-exclude-combinations-not-implemented = i variant unich de on { $component } con excludeCombinations hinn amò minga implementaa

variant-math-exclude-not-implemented = i variant unich de on { $component } de tipo math con exclude hinn amò minga implementaa

variant-non-constant-exclude-not-implemented = i variant unich de on { $component } con on exclude minga costant hinn amò minga implementaa

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: l'è minga sostegnuu in del renderizador prefigure del grafich; el dissendent el ven saltaa.

prefigure-descendant-invalid-geometry = { $subject }: geometria minga finida o minga completa; el dissendent el ven saltaa.

prefigure-curve-label-omitted = { $subject }: li etichett hinn minga sostegnuu sui element de curva convertii; l'etichetta la ven lassada foeura.

prefigure-curve-unsupported-definition-type = { $subject }: tipo de definizion de la curva '{ $definitionType }' minga sostegnuu; el dissendent el ven saltaa.

prefigure-region-flip-functions-unsupported = { $subject }: attribut flipFunctions minga sostegnuu su regionBetweenCurves; el dissendent el ven saltaa.

prefigure-region-non-formula-child = { $subject }: domà li funzion fioeu de tipo formula hinn sostegnuu su regionBetweenCurves; el dissendent el ven saltaa.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' minga sostegnuu per { $labelKind ->
        [line-family] on'etichetta de la famiglia de li linee
       *[point] on'etichetta de pont
    }; se dopera l'aliniament predefinii de PreFigure.

prefigure-fill-style-unsupported = { $subject }: el stil de impienidura '{ $fillStyle }' l'è minga sostegnuu de PreFigure; se torna a on'impienidura piena.

prefigure-line-style-unknown = { $subject }: el stil de linea minga conossuu '{ $lineStyle }' l'è lassaa foeura de l'output de PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: el stil de marcador '{ $markerStyle }' l'è staa mappaa sul stil PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: el stil de marcador '{ $markerStyle }' l'è minga sostegnuu de PreFigure; se dopera el stil predefinii.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` minga valid; se pò minga risolv el destinatari. L'anotazion la ven lassada foeura.

annotation-ref-multiple-targets = `<annotation>`: `ref` l'è staa risolt in pussee destinatari; se dopera el primm.

annotation-ref-outside-graph = `<annotation>`: `ref` minga valid; el destinatari l'è foeura del grafich che lo ten denter. L'anotazion la ven lassada foeura.

annotation-ref-unsupported-target = `<annotation>`: `ref` minga valid; el destinatari l'è minga on oget grafich sostegnuu in la conversion prefigure. L'anotazion la ven lassada foeura.

annotation-text-missing = `<annotation>`: `text` el manca o l'è voeud; se manda foeura test voeud.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] S'è trovaa ona dipendenza circolar.
       *[other] S'è trovaa ona dipendenza circolar che la ciappa denter on component `<{ $componentType }>`.
    }

reference-no-referent = Nissun referent trovaa per el riferiment: `{ $reference }`

reference-multiple-referents = Pussee referent trovaa per el riferiment: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format minga valid per l'attribut { $attribute } de `<{ $componentType }>`.

children-invalid = Fioeu minga valid per `<{ $componentType }>`: s'è trovaa di fioeu minga valid: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valor minga valid `{ $value }` per l'attribut `{ $attribute }`, se dopera el valor `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Version de DoenetML { $version } minga trovada.
       *[other] Version de DoenetML { $version } minga trovada. Se torna a la version { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML minga valid: { $content }

parse-tag-missing-close-tag = DoenetML minga valid: El tag `{ $tag }` el gh'ha minga on tag de serradura. Se spettava on tag che se serra de per lù o on tag `</{ $tagName }>`.

parse-tag-error = DoenetML minga valid: Erròr in del tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML minga valid: El par che a l'attribut minga valid `{ $attribute }` ghe manca on valor.

parse-attribute-invalid = DoenetML minga valid: Attribut minga valid `{ $attribute }`

parse-attribute-value-invalid = DoenetML minga valid: Valor de attribut minga valid `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML minga valid: Valor de attribut minga valid `{ $value }`. Li virgolett corisponden minga. El par che te manca on `{ $quote }`

parse-open-tag-name-missing = DoenetML minga valid: S'è trovaa on tag senza nom de tag, p.es. `<`

parse-tag-not-closed = DoenetML minga valid: El tag `{ $tag }` l'è minga staa serraa (el par che manca on `>`).

parse-self-closing-tag-name-missing = DoenetML minga valid: S'è trovaa on tag senza nom de tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML minga valid: El tag `{ $tag }` l'è minga staa serraa (el par che manca `/>`).

parse-tag-invalid-attributes = DoenetML minga valid: El tag `{ $tag }` l'è minga valid. El podaria avè di attribut sbagliaa.

parse-close-tag-name-missing = DoenetML minga valid: S'è trovaa on tag de serradura senza nom de tag, p.es. `</`

parse-attribute-value-unquoted = I valor di attribut gh'hann de vess tra virgolett: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML minga valid: S'è trovaa el tag de serradura `{ $tag }`, ma nissun tag de vertura corispondent

parse-close-tag-mismatched = DoenetML minga valid: Tag de serradura che el corispond minga. Se spettava `</{ $expected }>`. S'è trovaa `{ $found }`

parser-node-unconvertible = S'è minga poduu convertì el nod { $node } in on nod Dast.

## Names

name-attribute-invalid =
    Attribut minga valid name='{ $name }'. { $reason ->
        [characters] I nom pòden avè domà letter, numer, sottliniadur o tratin.
       *[start] I nom gh'hann de cominci con ona letra.
    }

component-name-invalid-start = Nom de component minga valid "{ $name }". I nom gh'hann de cominci con ona letra.

## `<answer>` sugar

answer-video-watched-missing-video = Ona risposta de tipo videoWatched la gh'ha de avè on attribut video

answer-video-watched-video-not-reference = Ona risposta de tipo videoWatched la gh'ha de avè on attribut video che el sia on riferiment

answer-name-not-single-text = L'attribut name de la risposta el gh'ha de avè on sol fioeu de test

## Referencing another document

external-doenetml-recursion-limit = Se pò minga recuperà el DoenetML de foeura per tropp livei de ricorsion. Gh'è on riferiment circolar?

external-doenetml-unavailable = Se pò minga recuperà el DoenetML de { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML minga valid recuperaa de { $attribute }="{ $uri }": el corispondeva minga al tipo de component "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] L'attribut `{ $from }` l'è superaa; dopera `{ $to }` invece.
       *[other] [deprecation] L'attribut `{ $from }` su `<{ $component }>` l'è superaa; dopera `{ $to }` invece.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] L'attribut `{ $from }` l'è superaa e el ven ignoraa perché s'è daa anca `{ $to }`.
       *[other] [deprecation] L'attribut `{ $from }` su `<{ $component }>` l'è superaa e el ven ignoraa perché s'è daa anca `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] L'attribut `{ $attribute }` su `<{ $component }>` l'è superaa e el ven ignoraa.

deprecated-attribute-to-child = [deprecation] L'attribut `{ $attribute }` su `<{ $component }>` l'è superaa; dopera invece on fioeu `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] El valor `{ $value }` de l'attribut `{ $attribute }` su `<{ $component }>` l'è superaa; dopera `{ $to }` invece.


## Language coverage

pluralize-english-only = `<pluralize>` el pò mett al plural domà l'ingles, e inscì el sò test el resta come l'è in on document scritt in { $locale }. Scriv la forma plural dritt, o mettila con l'attribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = L'element `<{ $tag }>` l'è minga on element Doenet conossuu.

schema-element-not-allowed-at-root = L'element `<{ $tag }>` l'è minga permess in la radis del document.

schema-element-not-allowed-inside = L'element `<{ $tag }>` l'è minga permess denter in `<{ $parent }>`.

schema-attribute-unrecognized = L'element `<{ $tag }>` el gh'ha minga on attribut che se ciama `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] L'attribut `{ $attribute }` de l'element `<{ $tag }>` el gh'ha de vess ona lista che ogni element el sia vun tra: { $allowed }
       *[other] L'attribut `{ $attribute }` de l'element `<{ $tag }>` el gh'ha de vess vun tra: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nom de variant minga valid per select.  El nom de variant { $variantName } el compar in { $numOptions } opzion ma el numer de ciappà l'è { $numToSelect }.

select-variant-name-without-options = S'è daa quaich variant per select ma nissuna opzion per el nom de variant possibil: { $variantName }.

select-variant-name-not-possible = El nom de variant { $variantName } daa per select l'è minga on nom de variant possibil.

select-too-few-options = Se pò minga ciappà { $numToSelect } component domà de { $numOptions }.

select-from-sequence-too-few-values = Se pò minga ciappà { $numToSelect } valor de ona sequenza de longhezza { $length }.

select-from-sequence-indices-count-mismatch = El numer di indes daa per select el gh'ha de corispond al numer de ciappà

select-from-sequence-indices-not-integers = Tucc i indes daa per select gh'hann de vess numer inter

select-from-sequence-index-excluded = L'indes daa de selectfromsequence l'era escluduu

select-from-sequence-indices-excluded-combination = I indes daa de selectfromsequence eren ona combinazion escludida

select-from-sequence-coprime-not-positive-integers = Se pò minga ciappà combinazion coprim perché se ciappa minga di numer inter positiv.

select-from-sequence-coprime-common-factor = Se pò minga ciappà numer coprim. Tucc i valor possibil gh'hann on fattor comun. (I valor daa de "from" o "to" gh'hann de vess coprim con "step".)

select-from-sequence-coprime-single-number = Se pò minga ciappà combinazion coprim de on numer sol che l'è minga 1.

select-from-sequence-excluded-too-many-combinations = S'è escluduu pussee del 70% de li combinazion in selectFromSequence

select-from-sequence-coprime-none-found = S'è minga poduu ciappà numer coprim. Tucc i valor possibil gh'hann on fattor comun.

select-from-sequence-too-few-unique-values = Se pò minga ciappà { $numToSelect } valor unich de ona sequenza de longhezza { $numPossibleValues }

select-prime-numbers-too-few-values = Se pò minga ciappà { $numToSelect } valor de ona lista de numer primm de longhezza { $numValues }

select-prime-numbers-values-count-mismatch = El numer di valor daa per select el gh'ha de corispond al numer de ciappà

select-prime-numbers-values-not-prime = Tucc i valor daa per select de numer primm gh'hann de vess in la lista di numer primm

select-prime-numbers-values-excluded-combination = I valor daa de selectPrimeNumbers eren ona combinazion escludida

select-prime-numbers-excluded-too-many-combinations = S'è escluduu pussee del 70% de li combinazion in selectPrimeNumbers

select-random-combination-fluke = Per on cas straordinariament improbabil, s'è minga poduu ciappà ona combinazion de valor a cas

select-random-value-fluke = Per on cas straordinariament improbabil, s'è minga poduu ciappà on valor a cas

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] Chest `<{ $component }>` el ven minga mostraa perché l'è denter in la matematica e l'è minga `inline`. Gionta `inline`, inscì el diventa ona lista a tendina, che la va denter in on'espression.
        [expanded] Chest `<{ $component }>` el ven minga mostraa perché l'è denter in la matematica e l'è `expanded`. Cava `expanded`; ona casella su pussee righ la va minga denter in on'espression.
        [on-graph] Chest `<{ $component }>` el ven minga mostraa perché l'è denter in la matematica disegnada su on grafich, che la gh'ha minga de post per on input.
       *[relative-width] Chest `<{ $component }>` el ven minga mostraa perché l'è denter in la matematica e el gh'ha ona largezza relativa. Dà la largezza in unitaa assolut, come `px`, invece.
    }
