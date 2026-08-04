# Catalan diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Catalan's `many` category applies only to the compact millions, which nothing
# below counts to, so every selection keeps the two branches English has.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } s'ignora quan s'especifiquen dos extrems
       *[other] { $attributes } s'ignoren quan s'especifiquen dos extrems
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } s'ignora quan s'especifiquen alhora un extrem i un punt mitjà
       *[other] { $attributes } s'ignoren quan s'especifiquen alhora un extrem i un punt mitjà
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset no té cap efecte sense un punt mitjà

## `<line>`

line-points-undetermined-dimensions = Línia que passa per punts de dimensions indeterminades.

line-points-too-few-dimensions = La línia ha de passar per punts d'almenys dues dimensions.

line-points-depend-on-variables = La línia passa per punts que depenen de variables: { $variables }.

line-equation-invalid-format = Format no vàlid per a l'equació de la línia en les variables { $variable1 } i { $variable2 }.

## `<ray>`

ray-overprescribed-through = La semirecta està determinada per through, endpoint i direction.  S'ignora el through especificat.

ray-dimension-mismatch = Discrepància de numDimensions a la semirecta.

## `<vector>`

vector-overprescribed-head = El vector està determinat per head, tail i displacement.  S'ignora el head especificat.

vector-dimension-mismatch = Discrepància de numDimensions al vector.

## Attracting and constraining

attract-to-without-nearest-point = No es pot atreure cap a `<{ $component }>` perquè no té la variable d'estat nearestPoint.

constrain-to-without-nearest-point = No es pot restringir a `<{ $component }>` perquè no té la variable d'estat nearestPoint.

constrain-to-interior-without-nearest-point = No es pot restringir a l'interior de `<{ $component }>` perquè no té la variable d'estat nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = S'ignora labelPosition per a un choiceInput que no és inline

## Ordering children by index

choice-input-indices-count-mismatch = S'ignoren els índexs especificats per a choiceInput perquè el seu nombre no coincideix amb el nombre de fills choice.

pretzel-indices-count-mismatch = S'ignoren els índexs especificats per a problem perquè el seu nombre no coincideix amb el nombre de fills problem.

shuffle-indices-count-mismatch = S'ignoren els índexs especificats per a shuffle perquè el seu nombre no coincideix amb el nombre de components.

indices-ignored-out-of-range = S'ignoren els índexs especificats per a { $component } perquè alguns queden fora de l'interval.

pretzel-indices-repeated = S'ignoren els índexs especificats per a pretzel perquè alguns estan repetits.

pretzel-circuit-first-index = S'ignoren els índexs especificats per a pretzel en mode circuit perquè el primer índex ha de ser 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Perquè `<{ $component }>` funcioni amb fills de tipus cadena, cal especificar l'atribut `type`.

invalid-type-defaulting-to-math = Tipus no vàlid { $type } per al component { $component }. Ha de ser un de math, text, number o boolean. S'utilitza math.

string-not-valid-component-to-arrange = La cadena "{ $value }" no és un component vàlid per a { $component }. S'ignora.

## Types and variables

invalid-type-defaulting-to-number = Tipus no vàlid { $type }, s'estableix el tipus a number.

invalid-variable-value = Valor no vàlid d'una variable: `{ $value }`

## Variants

variant-index-must-be-number = L'índex de variant { $index } ha de ser un nombre

variant-index-must-be-integer = L'índex de variant { $index } ha de ser un nombre enter

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` no està implementat per a mesures absolutes. S'estableixen les amplades com a relatives.

side-by-side-absolute-margins = `<{ $component }>` no està implementat per a mesures absolutes. S'estableixen els marges com a relatius.

side-by-side-no-block-child = `<{ $component }>` no vàlid: ha de tenir almenys un fill de bloc.

## `<label>`

label-for-ignored-on-graphical = S'ignora l'atribut `for` en un `<label>` gràfic.

label-for-must-resolve-to-one = L'atribut `for` d'un `<label>` s'ha de resoldre exactament a un component.

label-for-unresolved = No s'ha pogut resoldre l'atribut `for` d'un `<label>` a cap component.

label-for-answer-with-authored-inputs = L'atribut `for` d'un `<label>` fa referència a un `<answer>` amb entrades escrites explícitament; feu referència directament a l'entrada.

label-for-answer-without-input = L'atribut `for` d'un `<label>` fa referència a un `<answer>` sense cap entrada per etiquetar.

label-for-must-reference-input-or-answer = L'atribut `for` d'un `<label>` ha de fer referència a una entrada o a una resposta.

## Accessibility

accessibility-short-description-or-decorative = Per accessibilitat, `<{ $component }>` ha de tenir una descripció breu o bé estar especificat com a decoratiu.

accessibility-video-short-description = Per accessibilitat, `<video>` ha de tenir una descripció breu.

accessibility-input-short-description-or-label = Per accessibilitat, `<{ $component }>` ha de tenir una descripció breu o una etiqueta.

accessibility-answer-input-short-description-or-label = Per accessibilitat, un `<answer>` que crea una entrada ha de tenir una descripció breu o una etiqueta.

accessibility-short-description-contains-math = Les descripcions breus no haurien de contenir components matemàtics com ara `<{ $component }>`. Escriviu qualsevol matemàtica amb paraules.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } no té prou contrast per al text del títol de la secció (mode fosc) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; en cal almenys { $threshold }:1).
       *[other] { $colorName } no té prou contrast per al text del títol de la secció ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; en cal almenys { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` a través de { $count } punts no està implementat quan els punts no tenen valors numèrics.

circle-too-many-through-points = No es pot calcular un cercle que passi per més de 3 punts.

circle-overprescribed-radius-center-points = No es pot calcular un cercle amb radi, centre i punts especificats alhora.

circle-center-with-multiple-points = No es pot calcular un cercle amb un centre especificat que passi per més d'un punt.

circle-radius-too-small = No es pot calcular el cercle: com que la distància entre els dos punts és { $distance }, el radi especificat { $radius } és massa petit.

circle-radius-with-many-points = No es pot crear un cercle que passi per més de dos punts amb un radi especificat.

circle-invalid-center-or-through-points = Centre o punts del cercle no vàlids.

circle-radius-center-with-multiple-points = No es pot calcular el radi d'un cercle amb un centre especificat que passi per més d'un punt.

circle-change-radius-non-numerical = No es pot canviar el radi d'un cercle quan els punts no tenen valors numèrics

circle-radius-with-points-non-numerical = No es pot crear un cercle que passi per més d'un punt amb un radi especificat quan no hi ha valors numèrics.

circle-change-center-non-numerical = No s'ha implementat canviar el centre d'un cercle que passa per punts sense valors numèrics.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Dimensions insuficients per al domini de la funció. El domini té { $intervals } interval però la funció té { $inputs ->
            [one] { $inputs } entrada
           *[other] { $inputs } entrades
        }.
       *[other] Dimensions insuficients per al domini de la funció. El domini té { $intervals } intervals però la funció té { $inputs ->
            [one] { $inputs } entrada
           *[other] { $inputs } entrades
        }.
    }

function-domain-invalid-format = Format no vàlid per al domini de la funció.

function-ignoring-non-numerical =
    { $type ->
        [maximum] S'ignora el màxim no numèric de la funció.
        [minimum] S'ignora el mínim no numèric de la funció.
        [extremum] S'ignora l'extrem no numèric de la funció.
        [point] S'ignora el punt no numèric de la funció.
        [slope] S'ignora el pendent no numèric de la funció.
       *[other] S'ignora { $type } no numèric de la funció.
    }

function-ignoring-empty =
    { $type ->
        [maximum] S'ignora el màxim buit de la funció.
        [minimum] S'ignora el mínim buit de la funció.
        [extremum] S'ignora l'extrem buit de la funció.
        [point] S'ignora el punt buit de la funció.
       *[other] S'ignora { $type } buit de la funció.
    }

function-points-too-close = La funció conté dos punts massa propers entre si. No es pot definir la funció.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Les iteracions d'una funció només són possibles si el nombre d'entrades és igual al nombre de sortides. Aquesta funció té { $inputs } entrada i { $outputs ->
            [one] { $outputs } sortida
           *[other] { $outputs } sortides
        }.
       *[other] Les iteracions d'una funció només són possibles si el nombre d'entrades és igual al nombre de sortides. Aquesta funció té { $inputs } entrades i { $outputs ->
            [one] { $outputs } sortida
           *[other] { $outputs } sortides
        }.
    }

## `<sequence>`

sequence-invalid-length = Longitud de seqüència no vàlida.  Ha de ser un enter no negatiu.

sequence-invalid-step = Pas de seqüència no vàlid.  Ha de ser un nombre per a una seqüència de tipus { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" no vàlid d'una seqüència de nombres.  Ha de ser un nombre.

sequence-invalid-endpoint-letters = "{ $attribute }" no vàlid d'una seqüència de lletres.  Ha de ser una combinació de lletres.

sequence-invalid-endpoint = "{ $attribute }" no vàlid d'una seqüència.

select-from-sequence-coprime-not-numbers = s'ignora coprime perquè no s'estan seleccionant nombres

select-from-sequence-coprime-with-exclude-combinations = s'ignora coprime perquè s'ha especificat excludeCombinations

## Resolving a `target`

target-not-found = target no vàlid per a `<{ $source }>`: no es troba l'objectiu.

target-state-variable-not-found = target no vàlid per a `<{ $source }>`: no es troba cap variable d'estat anomenada "{ $property }" en un `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Les variables d'`<odeSystem>` han de ser diferents de la variable independent.

ode-system-duplicate-variable-names = No es poden definir les funcions RHS de l'ODE amb noms de variables dependents duplicats.

ode-system-rhs-function-error = No es pot definir la funció RHS de l'ODE.  Error en crear la funció mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = No es pot definir un angle entre { $count } línies

angle-invalid-through-point = Punt no vàlid a through d'un `<angle>`

parabola-vertex-too-many-points = No s'ha implementat una paràbola amb vèrtex que passi per més d'un punt.

parabola-too-many-points = No s'ha implementat una paràbola que passi per més de 3 punts.

intersection-too-many-items = No s'ha implementat la intersecció de més de dos elements

## Other math components

ionic-compound-not-two-ions = El compost iònic només s'ha implementat per a dos ions.

ionic-compound-needs-cation-and-anion = El compost iònic només s'ha implementat per a un catió i un anió.

solve-equations-cannot-evaluate = No es pot resoldre l'equació perquè no s'ha pogut avaluar: { $equation }

math-operators-operand-number-required = Cal especificar operandNumber en extreure un operand matemàtic.

eigen-decomposition-failed = No s'han pogut calcular els valors propis de la matriu

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: el paràmetre { $parameters } no apareix al patró, de manera que sempre coincidirà amb un buit.
       *[other] `<matchesPattern>`: els paràmetres { $parameters } no apareixen al patró, de manera que sempre coincidiran amb un buit.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: no es pot interpretar grid="{ $grid }". Ha de ser none, medium, dense, o dos nombres positius separats per un espai, com ara grid="1 0.5". No es dibuixa cap graella.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" no s'admet en el renderitzador prefigure; s'utilitza el comportament de la posició dreta.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" no s'admet en el renderitzador prefigure; s'utilitza el comportament de la posició superior.

prefigure-invalid-axis-bounds = `<graph>`: límits d'eix no vàlids per a la conversió prefigure; s'utilitza el bbox per defecte (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: amplada no vàlida per a la conversió prefigure; s'utilitza l'amplada de diagrama per defecte 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio no vàlid per a la conversió prefigure; s'utilitza la relació d'aspecte per defecte 1.

prefigure-grid-spacing-too-fine = `<graph>`: l'espaiat de la graella és massa fi per als límits de l'eix; la graella s'omet en el renderitzador prefigure.

prefigure-annotations-not-rendered = `<graph>`: les anotacions no es renderitzen si no s'utilitza el renderitzador PreFigure.

multiple-annotations-children = S'han trobat diversos fills `<annotations>` dins d'un `<graph>`; s'ignoren tots menys l'últim.

## Referring to other components

copy-unrecognized-component-type = No es pot estendre ni copiar un tipus de component desconegut: { $type }.

copy-prop-not-found = No s'ha trobat la propietat { $property } en un component de tipus { $component }

collect-no-source = No s'ha trobat cap font per a collect.

collect-invalid-component-type = No es poden recollir components de tipus `<{ $component }>` perquè és un tipus de component no vàlid.

reference-index-unavailable = No es pot fer referència a l'índex `{ $reference }`

## `<callAction>`

component-action-unavailable = No es pot cridar { $action } al component `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Les dades tenen una forma no vàlida.  Les files tenen longituds inconsistents. Trobat a componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Les dades tenen noms de columna duplicats.  Trobat a componentIdx :{ $componentIdx }

data-frame-missing-column-name = A les dades els falta un nom de columna.  Trobat a componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Un premi d'aquesta resposta es basa en la resposta enviada per la mateixa etiqueta answer, cosa que provocarà un comportament inesperat.

answer-max-num-attempts-in-section-wide-check-work = Establir `maxNumAttempts` en un `<answer>` dins d'un contenidor amb `sectionWideCheckWork` no té cap efecte, perquè és el contenidor qui controla el nombre d'intents. Establiu `maxNumAttempts` al contenidor.

nested-section-wide-check-work-max-num-attempts = Establir `maxNumAttempts` en un contenidor amb `sectionWideCheckWork` que és dins d'un altre contenidor amb `sectionWideCheckWork` no té cap efecte, perquè és el contenidor exterior qui controla el nombre d'intents. Establiu `maxNumAttempts` al contenidor exterior.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] L'atribut { $attributes } no tindrà cap efecte sense symbolicEquality establert.
       *[other] Els atributs { $attributes } no tindran cap efecte sense symbolicEquality establert.
    }

answer-invalid-type = Tipus no vàlid per a la resposta: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Com que el component `<{ $component }>` no té nom, no es pot utilitzar com a atribut d'un mòdul

module-attribute-name-already-defined = El component `<{ $component } name="{ $name }">` no es pot utilitzar com a atribut d'un mòdul perquè el tipus de component `<module>` ja té definit un atribut "{ $name }".

conditional-content-condition-ignored = S'ignora l'atribut `condition` en un component `<conditionalContent>` amb fills case o else.

slider-markers-type-mismatch = El tipus dels marcadors no coincideix amb el tipus del control lliscant.

pretzel-problem-needs-statement-and-answer = pretzel no vàlid: cada `<problem>` ha de contenir un `<statement>` i un `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel no vàlid: en mode="circuit", el primer `<problem>` no pot ser un distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Valor no vàlid { $values } per a l'atribut `{ $attribute }`; s'ignora.
       *[other] Valors no vàlids { $values } per a l'atribut `{ $attribute }`; s'ignoren.
    }

attribute-must-be-references = Valor no vàlid `{ $value }` per a l'atribut `{ $attribute }`. L'atribut ha d'estar format per referències que comencin amb `$`.

math-input-invalid-function-names = <mathInput>: s'han ignorat noms de funció no vàlids a { $attribute }: { $names }. El segment visible de cada nom ha de tenir almenys 2 caràcters (lletres o guions); opcionalment pot seguir un sufix `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Tipus de component no vàlid: `<{ $componentType }>`

attribute-repeated = No es pot repetir l'atribut { $attribute }.

attribute-invalid-for-component = Atribut "{ $attribute }" no vàlid per a un component de tipus `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    La definició d'estil { $styleNumber } no té prou contrast per a { $context ->
        [text-on-background] el color del text respecte al color del fons
        [high-contrast] el color d'alt contrast respecte al llenç
        [line] el color de la línia respecte al llenç
        [marker] el color del marcador respecte al llenç
       *[text-on-canvas] el color del text respecte al llenç
    }{ $mode ->
        [dark] { " (mode fosc)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; en cal almenys { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Encara que la definició d'estil { $styleNumber } especifica colors amb prou contrast per al mode clar, els colors del mode fosc derivats d'aquests valors no tenen prou contrast entre el color del text i el color del fons ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; en cal almenys { $threshold }:1). { $suggestion ->
        [available] Per garantir prou contrast en mode fosc, augmenteu el contrast del mode clar (p. ex. establiu { $lightAttribute }="{ $lightColor }") o sobreescriviu el color del mode fosc (p. ex. establiu { $darkAttribute }="{ $darkColor }").
       *[none] Per garantir prou contrast en mode fosc, augmenteu el contrast del mode clar o sobreescriviu els colors derivats amb textColorDarkMode i/o backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Encara que la definició d'estil { $styleNumber } especifica un color de text amb prou contrast per al mode clar, el color de text del mode fosc derivat d'aquest valor no té prou contrast respecte al llenç ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; en cal almenys { $threshold }:1). { $suggestion ->
        [available] Per garantir prou contrast en mode fosc, augmenteu el contrast del mode clar (p. ex. establiu textColor="{ $lightColor }") o sobreescriviu el color del mode fosc (p. ex. establiu textColorDarkMode="{ $darkColor }").
       *[none] Per garantir prou contrast en mode fosc, augmenteu el contrast del mode clar o sobreescriviu el color derivat amb textColorDarkMode.
    }

section-multiple-style-palettes = Una secció només pot seleccionar un <stylePalette>; s'utilitza l'últim.

## Unique variants

variant-num-to-select-not-non-negative-integer = no es poden determinar les variants úniques de { $component } perquè numToSelect no és un enter no negatiu.

variant-num-to-select-not-constant-number = no es poden determinar les variants úniques de { $component } perquè numToSelect no és un nombre constant.

variant-with-replacement-not-constant-boolean = no es poden determinar les variants úniques de { $component } perquè withReplacement no és un booleà constant.

variant-select-weight-disables-unique = Les variants úniques de select es desactiven si hi ha una opció amb selectWeight o selectForVariants especificat

variant-coprime-undetermined = no es poden determinar les variants úniques de { $component } perquè no es pot determinar que coprime sigui sempre fals.

variant-attribute-not-constant = no es poden determinar les variants úniques de { $component } perquè { $attribute } no és constant.

variant-attribute-not-number = no es poden determinar les variants úniques de { $component } perquè { $attribute } no és un nombre.

variant-attribute-wrong-type-for-sequence =
    no es poden determinar les variants úniques de { $component } de tipus { $type } perquè { $attribute } no és { $expected ->
        [letters-combination] una combinació de lletres
        [math-expression] una expressió matemàtica vàlida
        [integer] un enter
       *[number] un nombre
    }.

variant-length-not-integer = no es poden determinar les variants úniques de { $component } perquè length no és un enter.

variant-sort-not-implemented = no s'han implementat les variants úniques d'un { $component } amb sort

variant-exclude-combinations-not-implemented = no s'han implementat les variants úniques d'un { $component } amb excludeCombinations

variant-math-exclude-not-implemented = no s'han implementat les variants úniques d'un { $component } de tipus math amb exclude

variant-non-constant-exclude-not-implemented = no s'han implementat les variants úniques d'un { $component } amb un exclude no constant

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: no s'admet en el renderitzador prefigure del gràfic; descendent omès.

prefigure-descendant-invalid-geometry = { $subject }: geometria no finita o incompleta; descendent omès.

prefigure-curve-label-omitted = { $subject }: no s'admeten etiquetes en elements de corba convertits; etiqueta omesa.

prefigure-curve-unsupported-definition-type = { $subject }: tipus de definició de funció de corba no admès '{ $definitionType }'; descendent omès.

prefigure-region-flip-functions-unsupported = { $subject }: l'atribut flipFunctions no s'admet a regionBetweenCurves; descendent omès.

prefigure-region-non-formula-child = { $subject }: a regionBetweenCurves només s'admeten funcions filles de tipus formula; descendent omès.

prefigure-label-position-unsupported =
    { $subject }: labelPosition no admès '{ $labelPosition }' per a { $labelKind ->
        [line-family] una etiqueta de la família de les línies
       *[point] una etiqueta de punt
    }; s'ha utilitzat l'alineació per defecte de PreFigure.

prefigure-fill-style-unsupported = { $subject }: PreFigure no admet l'estil d'emplenat '{ $fillStyle }'; es recorre a un emplenat sòlid.

prefigure-line-style-unknown = { $subject }: s'ha omès l'estil de línia desconegut '{ $lineStyle }' de la sortida de PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: l'estil de marcador '{ $markerStyle }' s'ha assignat a l'estil 'diamond' de PreFigure.

prefigure-marker-style-unsupported = { $subject }: PreFigure no admet l'estil de marcador '{ $markerStyle }'; s'ha utilitzat l'estil per defecte.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` no vàlid; no es pot resoldre l'objectiu. Anotació omesa.

annotation-ref-multiple-targets = `<annotation>`: `ref` s'ha resolt a diversos objectius; s'utilitza el primer.

annotation-ref-outside-graph = `<annotation>`: `ref` no vàlid; l'objectiu és fora del gràfic contenidor. Anotació omesa.

annotation-ref-unsupported-target = `<annotation>`: `ref` no vàlid; l'objectiu no és un objecte gràfic admès en la conversió prefigure. Anotació omesa.

annotation-text-missing = `<annotation>`: `text` absent o buit; s'emet text buit.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] S'ha detectat una dependència circular.
       *[other] S'ha detectat una dependència circular que implica un component `<{ $componentType }>`.
    }

reference-no-referent = No s'ha trobat cap referent per a la referència: `{ $reference }`

reference-multiple-referents = S'han trobat diversos referents per a la referència: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format no vàlid per a l'atribut { $attribute } de `<{ $componentType }>`.

children-invalid = Fills no vàlids per a `<{ $componentType }>`: S'han trobat fills no vàlids: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valor no vàlid `{ $value }` per a l'atribut `{ $attribute }`, s'utilitza el valor `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] No s'ha trobat la versió { $version } de DoenetML.
       *[other] No s'ha trobat la versió { $version } de DoenetML. Es recorre a la versió { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML no vàlid: { $content }

parse-tag-missing-close-tag = DoenetML no vàlid: L'etiqueta `{ $tag }` no té etiqueta de tancament. S'esperava una etiqueta autotancada o una etiqueta `</{ $tagName }>`.

parse-tag-error = DoenetML no vàlid: Error a l'etiqueta `<{ $tagName }>`

parse-attribute-missing-value = DoenetML no vàlid: Sembla que a l'atribut no vàlid `{ $attribute }` li falta un valor.

parse-attribute-invalid = DoenetML no vàlid: Atribut no vàlid `{ $attribute }`

parse-attribute-value-invalid = DoenetML no vàlid: Valor d'atribut no vàlid `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML no vàlid: Valor d'atribut no vàlid `{ $value }`. Les cometes no coincideixen. Sembla que us falta una `{ $quote }`

parse-open-tag-name-missing = DoenetML no vàlid: S'ha trobat una etiqueta sense nom, p. ex. `<`

parse-tag-not-closed = DoenetML no vàlid: L'etiqueta `{ $tag }` no s'ha tancat (sembla que falta un `>`).

parse-self-closing-tag-name-missing = DoenetML no vàlid: S'ha trobat una etiqueta sense nom `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML no vàlid: L'etiqueta `{ $tag }` no s'ha tancat (sembla que falta un `/>`).

parse-tag-invalid-attributes = DoenetML no vàlid: L'etiqueta `{ $tag }` no és vàlida. Pot tenir atributs incorrectes.

parse-close-tag-name-missing = DoenetML no vàlid: S'ha trobat una etiqueta de tancament sense nom, p. ex. `</`

parse-attribute-value-unquoted = Els valors dels atributs han d'anar entre cometes: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML no vàlid: S'ha trobat l'etiqueta de tancament `{ $tag }`, però cap etiqueta d'obertura corresponent

parse-close-tag-mismatched = DoenetML no vàlid: Etiqueta de tancament no coincident. S'esperava `</{ $expected }>`. S'ha trobat `{ $found }`

parser-node-unconvertible = No s'ha pogut convertir el node { $node } en un node Dast.

## Names

name-attribute-invalid =
    Nom d'atribut no vàlid name='{ $name }'. { $reason ->
        [characters] Els noms només poden contenir lletres, xifres, guions baixos o guions.
       *[start] Els noms han de començar amb una lletra.
    }

component-name-invalid-start = Nom de component no vàlid "{ $name }". Els noms han de començar amb una lletra.

## `<answer>` sugar

answer-video-watched-missing-video = Una resposta de tipus videoWatched ha de tenir un atribut video

answer-video-watched-video-not-reference = L'atribut video d'una resposta de tipus videoWatched ha de ser una referència

answer-name-not-single-text = L'atribut name de la resposta ha de tenir un únic fill de text

## Referencing another document

external-doenetml-recursion-limit = No s'ha pogut recuperar el DoenetML extern per massa nivells de recursió. Hi ha alguna referència circular?

external-doenetml-unavailable = No s'ha pogut recuperar el DoenetML de { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML no vàlid recuperat de { $attribute }="{ $uri }": no coincideix amb el tipus de component "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] L'atribut `{ $from }` està obsolet; utilitzeu `{ $to }` al seu lloc.
       *[other] [deprecation] L'atribut `{ $from }` de `<{ $component }>` està obsolet; utilitzeu `{ $to }` al seu lloc.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] L'atribut `{ $from }` està obsolet i s'ignora perquè també s'ha especificat `{ $to }`.
       *[other] [deprecation] L'atribut `{ $from }` de `<{ $component }>` està obsolet i s'ignora perquè també s'ha especificat `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] L'atribut `{ $attribute }` de `<{ $component }>` està obsolet i s'ignora.


## Language coverage

pluralize-english-only = `<pluralize>` només pot posar en plural l'anglès, de manera que el seu text es deixa sense canviar en un document escrit en { $locale }. Escriviu la forma plural directament, o establiu-la amb l'atribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = L'element `<{ $tag }>` no és un element de Doenet reconegut.

schema-element-not-allowed-at-root = L'element `<{ $tag }>` no es permet a l'arrel del document.

schema-element-not-allowed-inside = L'element `<{ $tag }>` no es permet dins de `<{ $parent }>`.

schema-attribute-unrecognized = L'element `<{ $tag }>` no té cap atribut anomenat `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] L'atribut `{ $attribute }` de l'element `<{ $tag }>` ha de ser una llista en què cada element sigui un de: { $allowed }
       *[other] L'atribut `{ $attribute }` de l'element `<{ $tag }>` ha de ser un de: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nom de variant no vàlid per a select.  El nom de variant { $variantName } apareix en { $numOptions } opcions però el nombre a seleccionar és { $numToSelect }.

select-variant-name-without-options = S'han especificat variants per a select però no s'ha especificat cap opció per al possible nom de variant: { $variantName }.

select-variant-name-not-possible = El nom de variant { $variantName } especificat per a select no és un nom de variant possible.

select-too-few-options = No es poden seleccionar { $numToSelect } components de només { $numOptions }.

select-from-sequence-too-few-values = No es poden seleccionar { $numToSelect } valors d'una seqüència de longitud { $length }.

select-from-sequence-indices-count-mismatch = El nombre d'índexs especificats per a select ha de coincidir amb el nombre a seleccionar

select-from-sequence-indices-not-integers = Tots els índexs especificats per a select han de ser enters

select-from-sequence-index-excluded = S'ha especificat un índex de selectfromsequence que estava exclòs

select-from-sequence-indices-excluded-combination = S'han especificat índexs de selectfromsequence que formaven una combinació exclosa

select-from-sequence-coprime-not-positive-integers = No es poden seleccionar combinacions coprimeres perquè no s'estan seleccionant enters positius.

select-from-sequence-coprime-common-factor = No es poden seleccionar nombres coprimers. Tots els valors possibles comparteixen un factor comú. (Els valors especificats de "from" o "to" han de ser coprimers amb "step".)

select-from-sequence-coprime-single-number = No es poden seleccionar combinacions coprimeres a partir d'un únic nombre que no sigui 1.

select-from-sequence-excluded-too-many-combinations = S'ha exclòs més del 70% de les combinacions a selectFromSequence

select-from-sequence-coprime-none-found = No s'han pogut seleccionar nombres coprimers. Tots els valors possibles comparteixen un factor comú.

select-from-sequence-too-few-unique-values = No es poden seleccionar { $numToSelect } valors únics d'una seqüència de longitud { $numPossibleValues }

select-prime-numbers-too-few-values = No es poden seleccionar { $numToSelect } valors d'una llista de nombres primers de longitud { $numValues }

select-prime-numbers-values-count-mismatch = El nombre de valors especificats per a select ha de coincidir amb el nombre a seleccionar

select-prime-numbers-values-not-prime = Tots els valors especificats per a select prime number han de ser a la llista de nombres primers

select-prime-numbers-values-excluded-combination = Els valors especificats de selectPrimeNumbers formaven una combinació exclosa

select-prime-numbers-excluded-too-many-combinations = S'ha exclòs més del 70% de les combinacions a selectPrimeNumbers

select-random-combination-fluke = Per una casualitat extremadament improbable, no s'ha pogut seleccionar cap combinació de valors aleatoris

select-random-value-fluke = Per una casualitat extremadament improbable, no s'ha pogut seleccionar cap valor aleatori
