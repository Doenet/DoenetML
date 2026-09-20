# Extremaduran (estremeñu) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** Latin script in the OSCEC standard: final -o → -u
# and -e → -i, infinitives in -l, participles -áu / -á, the clitic «si», «i»
# for *and*, «porqui» for *because*. See `chrome.ftl` for the whole note.
# Numbers render in Latin digits.
#
# **What makes these sentences Extremaduran rather than Spanish** is «no si
# pue», «tieni qui sel» for *must*, «tieni» and «á», «ai» for *there is*,
# «endavia» for *yet*, «dengún / denguna» for *no, any*, «porqui», «i» for
# *and*, and the -áu / -á participles («alcontráu», «especificáu»,
# «guardá»). A sentence in this file without one of those markers is very
# likely still Spanish, and that is the quickest check a reviewer has.
#
# **What is borrowed.** The whole technical register — «atributu»,
# «componenti», «variabri d'estáu», «matriz», «dominiu», «intervalu»,
# «secuencia», «coprimu», «contrasti» — is the learned Romance vocabulary an
# Extremaduran speaker meets through **Spanish**, the language of schooling in
# Extremadura. It is borrowed openly; there is no Extremaduran computing
# register to take it from.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber` — are part of the language, not prose,
# and stay in English exactly as written. So does anything quoted back from the
# author's own source, and so do `WCAG AA`, `DoenetML`, `PreFigure` and
# `prefigure`, which are names.
#
# **Counts.** CLDR has **no plural data for `ext`**, so `Intl.PluralRules`
# falls back to root, where the only category is `other`. This catalog
# therefore writes **no** `[one]`, `[zero]`, `[two]`, `[few]` or `[many]`
# branch anywhere: wherever English selects on a count — `$attributesCount`,
# `$valuesCount`, `$parametersCount`, `$intervals`, `$inputs`, `$outputs`,
# `$found` — one form is written that reads for any number, and the verb is
# put in the impersonal «si» construction so that it does not have to agree.
#
# The one place a distinction was worth keeping is
# `field-function-wrong-num-outputs`, where one output and two outputs are not
# a grammatical difference but two different pieces of advice. There it is
# written as the **numeric literal branch `[1]`** — an exact-value match, a
# different mechanism from a plural category, and legal in every locale.
#
# Every **symbolic** selector — `$type`, `$mode`, `$reason`, `$context`,
# `$suggestion`, `$alternative`, `$fallback`, `$expected`, `$labelKind`,
# `$isList`, `$componentType` — is kept byte for byte from English, keys
# included.
#
# **Weakest first.** The periphrases for *cannot* and *have not implemented*
# («no si pue», «endavia no s'á hechu») repeat a hundred times; changing them
# changes the tone of the whole file.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = Si ignora { $attributes } en cuantu si dan dos estremus

line-segment-attributes-ignored-with-endpoint-and-midpoint = Si ignora { $attributes } en cuantu si dan un estremu i un puntu mediu

line-segment-midpoint-offset-without-midpoint = midpointOffset no haci na sin un puntu mediu

## `<line>`

line-points-undetermined-dimensions = Linia por puntus de dimensionis no determinás.

line-points-too-few-dimensions = La linia tieni qui pasal por puntus de lo menus dos dimensionis.

line-points-depend-on-variables = La linia pasa por puntus que dependin de las variabris: { $variables }.

line-equation-invalid-format = Formatu no válidu pa la ecuacion de la linia en las variabris { $variable1 } i { $variable2 }.

## `<ray>`

ray-overprescribed-through = La semirrecta está definía por through, endpoint i direction.  Si ignora el through especificáu.

ray-dimension-mismatch = numDimensions no cuadra en la semirrecta.

## `<vector>`

vector-overprescribed-head = El vector está definíu por head, tail i displacement.  Si ignora el head especificáu.

vector-dimension-mismatch = numDimensions no cuadra nel vector.

## Attracting and constraining

attract-to-without-nearest-point = No si pue atrael pa un `<{ $component }>`, porqui no tieni la variabri d'estáu nearestPoint.

constrain-to-without-nearest-point = No si pue restrinhil a un `<{ $component }>`, porqui no tieni la variabri d'estáu nearestPoint.

constrain-to-interior-without-nearest-point = No si pue restrinhil al endrentu d'un `<{ $component }>`, porqui no tieni la variabri d'estáu nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = Si ignora labelPosition nun choiceInput que no es inline

## Ordering children by index

choice-input-indices-count-mismatch = Si ignoran los índicis especificáus pa choiceInput porqui el númeru d'índicis no cuadra col númeru de hihus choice.

pretzel-indices-count-mismatch = Si ignoran los índicis especificáus pa problem porqui el númeru d'índicis no cuadra col númeru de hihus problem.

shuffle-indices-count-mismatch = Si ignoran los índicis especificáus pa shuffle porqui el númeru d'índicis no cuadra col númeru de componentis.

indices-ignored-out-of-range = Si ignoran los índicis especificáus pa { $component } porqui argunus índicis están huera del rangu.

pretzel-indices-repeated = Si ignoran los índicis especificáus pa pretzel porqui argunus índicis están repetíus.

pretzel-circuit-first-index = Si ignoran los índicis especificáus pa pretzel en modu circuit porqui el primel índici tieni qui sel 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Pa que `<{ $component }>` funcioni con hihus de testu, ai qu'especifical un atributu `type`.

invalid-type-defaulting-to-math = Tipu { $type } no válidu pal componenti { $component }. Tieni qui sel unu destus: math, text, number o boolean. S'usa math.

string-not-valid-component-to-arrange = La cadena "{ $value }" no es un componenti válidu pa { $component }. Si ignora.

## Types and variables

invalid-type-defaulting-to-number = Tipu { $type } no válidu, si poni el tipu a number.

invalid-variable-value = Valol no válidu d'una variabri: `{ $value }`

## Variants

variant-index-must-be-number = L'índici de varianti { $index } tieni qui sel un númeru

variant-index-must-be-integer = L'índici de varianti { $index } tieni qui sel un númeru enteru

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` no está hechu pa medías absolutas. Si ponin las anchuras en relativas.

side-by-side-absolute-margins = `<{ $component }>` no está hechu pa medías absolutas. Si ponin los márhinis en relativus.

side-by-side-no-block-child = `<{ $component }>` no válidu: tieni qui tenel de lo menus un hihu de bloqui.

## `<label>`

label-for-ignored-on-graphical = Si ignora l'atributu `for` nuna `<label>` gráfica.

label-for-must-resolve-to-one = L'atributu `for` en `<label>` tieni qui resorvelsi nun solu componenti.

label-for-unresolved = L'atributu `for` en `<label>` no si puó resorvel nun componenti.

label-for-answer-with-authored-inputs = L'atributu `for` en `<label>` haci referencia a un `<answer>` con entrás escritas pol autol; hazi referencia derechamenti a la entrá.

label-for-answer-without-input = L'atributu `for` en `<label>` haci referencia a un `<answer>` sin denguna entrá qu'etiquetal.

label-for-must-reference-input-or-answer = L'atributu `for` en `<label>` tieni qui hazel referencia a una entrá o a una respuesta.

## Accessibility

accessibility-short-description-or-decorative = Pa l'accessibiliá, `<{ $component }>` tieni qui tenel una descripcion corta o estal marcáu comu decorativu.

accessibility-video-short-description = Pa l'accessibiliá, `<video>` tieni qui tenel una descripcion corta.

accessibility-input-short-description-or-label = Pa l'accessibiliá, `<{ $component }>` tieni qui tenel una descripcion corta o una etiqueta.

accessibility-answer-input-short-description-or-label = Pa l'accessibiliá, un `<answer>` que crea una entrá tieni qui tenel una descripcion corta o una etiqueta.

accessibility-short-description-contains-math = Las descripcionis cortas no devin tenel componentis matemáticus comu `<{ $component }>`. Escrivi la matemática con palabras.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } no tieni contrasti abondu pal testu del títulu de la seccion (modu escuru) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; haci farta de lo menus { $threshold }:1).
       *[other] { $colorName } no tieni contrasti abondu pal testu del títulu de la seccion ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; haci farta de lo menus { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Endavia no s'á hechu un `<circle>` por { $count } puntus nel casu de que los puntus no tengan valoris numéricus.

circle-too-many-through-points = No si pue calculal un círculu por mas de 3 puntus.

circle-overprescribed-radius-center-points = No si pue calculal un círculu con radiu, centru i puntus de pasu especificáus.

circle-center-with-multiple-points = No si pue calculal un círculu col centru especificáu que pasi por mas d'1 puntu.

circle-radius-too-small = No si pue calculal el círculu: dáu que la distancia entri los dos puntus es { $distance }, el radiu especificáu { $radius } es mu chicu.

circle-radius-with-many-points = No si pue creal un círculu por mas de dos puntus con un radiu especificáu.

circle-invalid-center-or-through-points = Centru o puntus de pasu del círculu no válidus.

circle-radius-center-with-multiple-points = No si pue calculal el radiu d'un círculu col centru especificáu que pasi por mas d'1 puntu.

circle-change-radius-non-numerical = No si pue cambeal el radiu d'un círculu con puntus de pasu no numéricus

circle-radius-with-points-non-numerical = No si pue creal un círculu por mas d'un puntu con un radiu especificáu en cuantu no ai valoris numéricus.

circle-change-center-non-numerical = Endavia no s'á hechu el cambiu del centru d'un círculu por puntus con valoris no numéricus.

## `<function>`

# CLDR has no plural data for `ext`, so the interval and input counts are not
# selected on: one form is written that reads for any number.
function-domain-insufficient-dimensions = Dimensionis no abondu pal dominiu de la funcion. El dominiu tieni { $intervals } intervalus pero la funcion tieni { $inputs } entrás.

function-domain-invalid-format = Formatu no válidu pal dominiu de la funcion.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Si ignora un máximu no numéricu de la funcion.
        [minimum] Si ignora un mínimu no numéricu de la funcion.
        [extremum] Si ignora un estremu no numéricu de la funcion.
        [point] Si ignora un puntu no numéricu de la funcion.
        [slope] Si ignora una pendienti no numérica de la funcion.
       *[other] Si ignora un { $type } no numéricu de la funcion.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Si ignora un máximu vacíu de la funcion.
        [minimum] Si ignora un mínimu vacíu de la funcion.
        [extremum] Si ignora un estremu vacíu de la funcion.
        [point] Si ignora un puntu vacíu de la funcion.
       *[other] Si ignora un { $type } vacíu de la funcion.
    }

function-points-too-close = La funcion tieni dos puntus mu hunticus unu del otru. No si pue definil la funcion.

function-iterates-input-output-mismatch = Las iteracionis d'una funcion solu son posibris si el númeru d'entrás es igual al númeru de salías. Esta funcion tieni { $inputs } entrás i { $outputs } salías.

## `<sequence>`

sequence-invalid-length = Longura no válida de la secuencia.  Tieni qui sel un númeru enteru no negativu.

sequence-invalid-step = Pasu no válidu de la secuencia.  Tieni qui sel un númeru pa una secuencia de tipu { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" no válidu d'una secuencia de númerus.  Tieni qui sel un númeru.

sequence-invalid-endpoint-letters = "{ $attribute }" no válidu d'una secuencia de letras.  Tieni qui sel una combinacion de letras.

sequence-invalid-endpoint = "{ $attribute }" de la secuencia no válidu.

select-from-sequence-coprime-not-numbers = si ignora coprime porqui no si escogin númerus

select-from-sequence-coprime-with-exclude-combinations = si ignora coprime porqui s'á especificáu excludeCombinations

## Resolving a `target`

target-not-found = target no válidu pa `<{ $source }>`: no s'alcuentra el destinu.

target-state-variable-not-found = target no válidu pa `<{ $source }>`: no s'alcuentra denguna variabri d'estáu que si llami "{ $property }" nun `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Las variabris de `<odeSystem>` tienin qui sel diferentis de la variabri independienti.

ode-system-duplicate-variable-names = No si pueín definil las funcionis RHS de la EDO con nombris de variabris dependientis repetíus.

ode-system-rhs-function-error = No si pue definil la funcion RHS de la EDO.  Erru creandu la funcion mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = No si pue definil un ángulu entri { $count } linias

angle-invalid-through-point = Puntu no válidu en through de `<angle>`

parabola-vertex-too-many-points = Endavia no s'á hechu una parábola con vérticis por mas d'1 puntu.

parabola-too-many-points = Endavia no s'á hechu una parábola por mas de 3 puntus.

intersection-too-many-items = Endavia no s'á hechu la interseccion de mas de dos elementus

## Other math components

ionic-compound-not-two-ions = Endavia no s'á hechu un compuestu iónicu d'otra cosa que dos ionis.

ionic-compound-needs-cation-and-anion = El compuestu iónicu solu está hechu pa un cation i un anion.

solve-equations-cannot-evaluate = No si pue resorvel la ecuacion porqui no si puó evalual: { $equation }

math-operators-operand-number-required = Ai qu'especifical un operandNumber pa sacal un operandu matemáticu.

eigen-decomposition-failed = No si pudierun calculal los valoris propius de la matriz

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: { $parameters } no aparecin nel patron, asina que siempri van a cuadral con un güecu.

## `<graph>`

graph-grid-invalid = `<graph>`: no si pue interpretal grid="{ $grid }". Tieni qui sel none, medium, dense o dos númerus positivus apartáus por un espaciu, comu grid="1 0.5". No si dibuha denguna cuadrícula.

## `<slopeField>` and `<vectorField>`

# `$expected` is a count, but CLDR has no plural data for `ext`, so it is
# matched as the numeric literal `[1]` rather than as the plural category
# `[one]`: the two branches carry different advice, not a different word shape.
field-function-wrong-num-outputs =
    `<{ $component }>` necessita una funcion con { $expected ->
        [1] una salía, la pendienti y' en cá puntu, comu `y - x`
       *[other] dos salías, el vector en cá puntu, comu `(y, -x)`
    }, pero la funcion que si le dio tieni { $found } salías. { $alternative ->
        [none] No si dibuha na.
       *[other] `<{ $alternative }>` es el componenti pa esa funcion. No si dibuha na.
    }

field-function-attribute-ignored-with-child = Si ignora l'atributu `function` porqui la funcion si da tamien endrentu del componenti; s'usa la d'endrentu. Da la funcion solu d'una de las dos maneras.

field-variables-ignored =
    `<{ $component }>`: l'atributu `variables` nombra las variabris d'una espresion escrita derechamenti endrentu del componenti. { $reason ->
        [function-child] Aquí la funcion si da comu hihu `<function>`, que nombra las suyas propias variabris, asina que si ignora `variables`.
       *[no-expression] Aquí no si da denguna espresion desas, asina que si ignora `variables`.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" no está sostiníu nel renderizadol prefigure; s'usa el comportamientu de la posicion a la derecha.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" no está sostiníu nel renderizadol prefigure; s'usa el comportamientu de la posicion d'arriba.

prefigure-invalid-axis-bounds = `<graph>`: límitis de los ehis no válidus pa la conversion prefigure; s'usa el bbox por defeutu (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: anchura no válida pa la conversion prefigure; s'usa la anchura por defeutu del diagrama 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio no válidu pa la conversion prefigure; s'usa la proporcion por defeutu 1.

prefigure-grid-spacing-too-fine = `<graph>`: el apartamientu de la cuadrícula es mu hinu pa los límitis de los ehis; la cuadrícula si desa huera nel renderizadol prefigure.

prefigure-annotations-not-rendered = `<graph>`: las anotacionis no si dibuhan en cuantu no s'usa el renderizadol PreFigure.

multiple-annotations-children = S'alcontrarun muchus hihus `<annotations>` en `<graph>`; si ignoran tos menus el úrtimu.

## Referring to other components

copy-unrecognized-component-type = No si pue estendel o copial un tipu de componenti no reconocíu: { $type }.

copy-prop-not-found = No s'alcontró la propieá { $property } nun componenti de tipu { $component }

collect-no-source = No s'alcontró denguna huenti pa collect.

collect-invalid-component-type = No si pueín recohel componentis de tipu `<{ $component }>` porqui es un tipu de componenti no válidu.

reference-index-unavailable = No si pue hazel referencia al índici `{ $reference }`

## `<callAction>`

component-action-unavailable = No si pue llamal { $action } nel componenti `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Los datus tienin una horma no válida.  Las hilas tienin longuras diferentis. Alcontráu en componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Los datus tienin nombris de coluna repetíus.  Alcontráu en componentIdx :{ $componentIdx }

data-frame-missing-column-name = A los datus les harta un nombri de coluna.  Alcontráu en componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Un premiu desta respuesta si basa en la respuesta mandá pola mesma etiqueta answer, i esu va a llevanos a un comportamientu no esperáu.

answer-max-num-attempts-in-section-wide-check-work = Ponel `maxNumAttempts` nun `<answer>` endrentu d'un contenedol con `sectionWideCheckWork` no haci na, porqui el númeru d'intentus lo controla el contenedol. Poni `maxNumAttempts` nel contenedol.

nested-section-wide-check-work-max-num-attempts = Ponel `maxNumAttempts` nun contenedol con `sectionWideCheckWork` qu'está endrentu d'otru contenedol con `sectionWideCheckWork` no haci na, porqui el númeru d'intentus lo controla el contenedol de huera. Poni `maxNumAttempts` nel contenedol de huera.

answer-attributes-need-symbolic-equality = { $attributes } no van a hazel na sin symbolicEquality especificáu.

answer-invalid-type = Tipu no válidu pa la respuesta: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Comu el componenti `<{ $component }>` no tieni nombri, no si pue usal comu atributu d'un módulu

module-attribute-name-already-defined = El componenti `<{ $component } name="{ $name }">` no si pue usal comu atributu d'un módulu porqui el tipu de componenti `<module>` ya tieni un atributu "{ $name }" definíu.

conditional-content-condition-ignored = Si ignora l'atributu `condition` nun componenti `<conditionalContent>` con hihus case o else.

slider-markers-type-mismatch = El tipu de los marcadoris no cuadra col tipu del slider.

pretzel-problem-needs-statement-and-answer = pretzel no válidu: cá `<problem>` tieni qui tenel un `<statement>` i un `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel no válidu: en mode="circuit", el primel `<problem>` no pue sel un distractol.

## Attribute values

attribute-invalid-values = { $values } no son valoris válidus pa l'atributu `{ $attribute }`; si ignoran.

attribute-must-be-references = Valol no válidu `{ $value }` pa l'atributu `{ $attribute }`. L'atributu tieni qu'estal hechu de referencias qu'empiecin con un `$`.

math-input-invalid-function-names = <mathInput>: s'ignorarun nombris de funcion no válidus en { $attribute }: { $names }. El trozu que s'amuestra de cá nombri tieni qui tenel de lo menus 2 caraiteris (letras o guionis); dispués pue vinil un suhihu opcional `|<arternativa mathspeak>`.

## Building components from the source

component-type-invalid = Tipu de componenti no válidu: `<{ $componentType }>`

attribute-repeated = No si pue repetil l'atributu { $attribute }.

attribute-invalid-for-component = Atributu "{ $attribute }" no válidu pa un componenti de tipu `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    La definicion d'estilu { $styleNumber } no tieni contrasti abondu pa { $context ->
        [text-on-background] el colol del testu contra el colol del fondu
        [high-contrast] el colol d'artu contrasti contra el lienzu
        [line] el colol de la linia contra el lienzu
        [marker] el colol del marcadol contra el lienzu
       *[text-on-canvas] el colol del testu contra el lienzu
    }{ $mode ->
        [dark] { " (modu escuru)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; haci farta de lo menus { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Anque la definicion d'estilu { $styleNumber } tenga coloris que dan contrasti abondu pal modu claru, los coloris pal modu escuru sacáus desus valoris no tienin contrasti abondu entri el colol del testu i el colol del fondu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; haci farta de lo menus { $threshold }:1). { $suggestion ->
        [available] Pa tenel contrasti abondu nel modu escuru, o sube el contrasti del modu claru (p. eh. poni { $lightAttribute }="{ $lightColor }") o sobrescrivi el colol del modu escuru (p. eh. poni { $darkAttribute }="{ $darkColor }").
       *[none] Pa tenel contrasti abondu nel modu escuru, sube el contrasti del modu claru o sobrescrivi los coloris sacáus con textColorDarkMode i/o backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Anque la definicion d'estilu { $styleNumber } tenga un colol de testu que da contrasti abondu pal modu claru, el colol del testu pal modu escuru sacáu desi valol no tieni contrasti abondu contra el lienzu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; haci farta de lo menus { $threshold }:1). { $suggestion ->
        [available] Pa tenel contrasti abondu nel modu escuru, o sube el contrasti del modu claru (p. eh. poni textColor="{ $lightColor }") o sobrescrivi el colol del modu escuru (p. eh. poni textColorDarkMode="{ $darkColor }").
       *[none] Pa tenel contrasti abondu nel modu escuru, sube el contrasti del modu claru o sobrescrivi el colol sacáu con textColorDarkMode.
    }

section-multiple-style-palettes = Una seccion solu pue escogel un <stylePalette>; s'usa el úrtimu.

## Unique variants

variant-num-to-select-not-non-negative-integer = no si pueín determinal las variantis únicas de { $component } porqui numToSelect no es un númeru enteru no negativu.

variant-num-to-select-not-constant-number = no si pueín determinal las variantis únicas de { $component } porqui numToSelect no es un númeru constanti.

variant-with-replacement-not-constant-boolean = no si pueín determinal las variantis únicas de { $component } porqui withReplacement no es un boolean constanti.

variant-select-weight-disables-unique = Las variantis únicas pa select si desativan si arguna opcion tieni selectWeight o selectForVariants especificáu

variant-coprime-undetermined = no si pueín determinal las variantis únicas de { $component } porqui no si pue determinal que coprime sea siempri farsu.

variant-attribute-not-constant = no si pueín determinal las variantis únicas de { $component } porqui { $attribute } no es una constanti.

variant-attribute-not-number = no si pueín determinal las variantis únicas de { $component } porqui { $attribute } no es un númeru.

variant-attribute-wrong-type-for-sequence =
    no si pueín determinal las variantis únicas de { $component } de tipu { $type } porqui { $attribute } no es { $expected ->
        [letters-combination] una combinacion de letras
        [math-expression] una espresion matemática válida
        [integer] un númeru enteru
       *[number] un númeru
    }.

variant-length-not-integer = no si pueín determinal las variantis únicas de { $component } porqui length no es un númeru enteru.

variant-sort-not-implemented = endavia no s'an hechu las variantis únicas d'un { $component } con sort

variant-exclude-combinations-not-implemented = endavia no s'an hechu las variantis únicas d'un { $component } con excludeCombinations

variant-math-exclude-not-implemented = endavia no s'an hechu las variantis únicas d'un { $component } de tipu math con exclude

variant-non-constant-exclude-not-implemented = endavia no s'an hechu las variantis únicas d'un { $component } con un exclude no constanti

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: no está sostiníu nel renderizadol prefigure de la gráfica; si sarta el descendienti.

prefigure-descendant-invalid-geometry = { $subject }: heometría no finita o incompleta; si sarta el descendienti.

prefigure-curve-label-omitted = { $subject }: las etiquetas no están sostinías en los elementus de curva convertíus; si desa huera la etiqueta.

prefigure-curve-unsupported-definition-type = { $subject }: tipu de definicion de curva '{ $definitionType }' no sostiníu; si sarta el descendienti.

prefigure-region-flip-functions-unsupported = { $subject }: atributu flipFunctions no sostiníu en regionBetweenCurves; si sarta el descendienti.

prefigure-region-non-formula-child = { $subject }: solu están sostinías las funcionis hihas de tipu formula en regionBetweenCurves; si sarta el descendienti.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' no sostiníu pa { $labelKind ->
        [line-family] una etiqueta de la familia de las linias
       *[point] una etiqueta de puntu
    }; s'usa la alineacion por defeutu de PreFigure.

prefigure-fill-style-unsupported = { $subject }: el estilu de rellenu '{ $fillStyle }' no está sostiníu por PreFigure; si vuervi a un rellenu llenu.

prefigure-line-style-unknown = { $subject }: estilu de linia desconocíu '{ $lineStyle }' desáu huera de la salía de PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: el estilu de marcadol '{ $markerStyle }' s'á mapeáu al estilu PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: el estilu de marcadol '{ $markerStyle }' no está sostiníu por PreFigure; s'usa el estilu por defeutu.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` no válidu; no si pue resorvel el destinu. Si desa huera la anotacion.

annotation-ref-multiple-targets = `<annotation>`: `ref` si resorvió en muchus destinus; s'usa el primeru.

annotation-ref-outside-graph = `<annotation>`: `ref` no válidu; el destinu está huera de la gráfica que lo contieni. Si desa huera la anotacion.

annotation-ref-unsupported-target = `<annotation>`: `ref` no válidu; el destinu no es un ohetu gráficu sostiníu en la conversion prefigure. Si desa huera la anotacion.

annotation-text-missing = `<annotation>`: `text` harta o está vacíu; si da testu vacíu.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] S'á detetáu una dependencia circulal.
       *[other] S'á detetáu una dependencia circulal que mete de por mediu un componenti `<{ $componentType }>`.
    }

reference-no-referent = No s'alcontró dengún referenti pa la referencia: `{ $reference }`

reference-multiple-referents = S'alcontrarun muchus referentis pa la referencia: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Formatu no válidu pa l'atributu { $attribute } de `<{ $componentType }>`.

children-invalid = Hihus no válidus pa `<{ $componentType }>`: s'alcontrarun hihus no válidus: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valol no válidu `{ $value }` pa l'atributu `{ $attribute }`, s'usa el valol `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] No s'alcontró la version de DoenetML { $version }.
       *[other] No s'alcontró la version de DoenetML { $version }. Si vuervi a la version { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML no válidu: { $content }

parse-tag-missing-close-tag = DoenetML no válidu: La etiqueta `{ $tag }` no tieni etiqueta de cierri. S'esperava una etiqueta que si cierri ella mesma o una etiqueta `</{ $tagName }>`.

parse-tag-error = DoenetML no válidu: Erru en la etiqueta `<{ $tagName }>`

parse-attribute-missing-value = DoenetML no válidu: Pareci qu'a l'atributu no válidu `{ $attribute }` le harta un valol.

parse-attribute-invalid = DoenetML no válidu: Atributu no válidu `{ $attribute }`

parse-attribute-value-invalid = DoenetML no válidu: Valol d'atributu no válidu `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML no válidu: Valol d'atributu no válidu `{ $value }`. Las comiyas no cuadran. Pareci qui te harta un `{ $quote }`

parse-open-tag-name-missing = DoenetML no válidu: S'alcontró una etiqueta sin nombri d'etiqueta, p. eh. `<`

parse-tag-not-closed = DoenetML no válidu: La etiqueta `{ $tag }` no si cerró (pareci qui harta un `>`).

parse-self-closing-tag-name-missing = DoenetML no válidu: S'alcontró una etiqueta sin nombri d'etiqueta `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML no válidu: La etiqueta `{ $tag }` no si cerró (pareci qui harta `/>`).

parse-tag-invalid-attributes = DoenetML no válidu: La etiqueta `{ $tag }` no es válida. Pue qui tenga atributus incorreutus.

parse-close-tag-name-missing = DoenetML no válidu: S'alcontró una etiqueta de cierri sin nombri d'etiqueta, p. eh. `</`

parse-attribute-value-unquoted = Los valoris de los atributus tienin qu'estal entri comiyas: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML no válidu: S'alcontró la etiqueta de cierri `{ $tag }`, pero denguna etiqueta d'abertura correspondienti

parse-close-tag-mismatched = DoenetML no válidu: Etiqueta de cierri que no cuadra. S'esperava `</{ $expected }>`. S'alcontró `{ $found }`

parser-node-unconvertible = No si puó convertil el nodu { $node } nun nodu Dast.

## Names

name-attribute-invalid =
    Atributu no válidu name='{ $name }'. { $reason ->
        [characters] Los nombris solu pueín tenel letras, númerus, guionis bahus o guionis.
       *[start] Los nombris tienin qu'empeçal con una letra.
    }

component-name-invalid-start = Nombri de componenti no válidu "{ $name }". Los nombris tienin qu'empeçal con una letra.

## `<answer>` sugar

answer-video-watched-missing-video = Una respuesta de tipu videoWatched tieni qui tenel un atributu video

answer-video-watched-video-not-reference = Una respuesta de tipu videoWatched tieni qui tenel un atributu video que sea una referencia

answer-name-not-single-text = L'atributu name de la respuesta tieni qui tenel un solu hihu de testu

## Referencing another document

external-doenetml-recursion-limit = No si pue consiguil el DoenetML de huera por mucha recursion. ¿Ai arguna referencia circulal?

external-doenetml-unavailable = No si pue consiguil el DoenetML de { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML no válidu consiguíu de { $attribute }="{ $uri }": no cuadrava col tipu de componenti "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] L'atributu `{ $from }` está anticuáu; usa `{ $to }`.
       *[other] [deprecation] L'atributu `{ $from }` en `<{ $component }>` está anticuáu; usa `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] L'atributu `{ $from }` está anticuáu i si ignora porqui tamien s'á especificáu `{ $to }`.
       *[other] [deprecation] L'atributu `{ $from }` en `<{ $component }>` está anticuáu i si ignora porqui tamien s'á especificáu `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] L'atributu `{ $attribute }` en `<{ $component }>` está anticuáu i si ignora.

deprecated-attribute-to-child = [deprecation] L'atributu `{ $attribute }` en `<{ $component }>` está anticuáu; usa nel su lugal un hihu `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] El valol `{ $value }` de l'atributu `{ $attribute }` en `<{ $component }>` está anticuáu; usa `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` solu pue ponel en prural el inglés, asina que el su testu si desa igual nun documentu escritu en { $locale }. Escrivi la horma prural derechamenti, o ponla col atributu `pluralForm`.


## Checking against the schema

schema-element-unrecognized = El elementu `<{ $tag }>` no es un elementu de Doenet reconocíu.

schema-element-not-allowed-at-root = El elementu `<{ $tag }>` no está premitíu en la raíz del documentu.

schema-element-not-allowed-inside = El elementu `<{ $tag }>` no está premitíu endrentu de `<{ $parent }>`.

schema-attribute-unrecognized = El elementu `<{ $tag }>` no tieni dengún atributu que si llami `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] L'atributu `{ $attribute }` del elementu `<{ $tag }>` tieni qui sel una lista andi cá elementu sea unu destus: { $allowed }
       *[other] L'atributu `{ $attribute }` del elementu `<{ $tag }>` tieni qui sel unu destus: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nombri de varianti no válidu pa select.  El nombri de varianti { $variantName } está en { $numOptions } opcionis pero el númeru qu'escogel es { $numToSelect }.

select-variant-name-without-options = S'especificarun argunas variantis pa select pero denguna opcion pal nombri de varianti posibri: { $variantName }.

select-variant-name-not-possible = El nombri de varianti { $variantName } especificáu pa select no es un nombri de varianti posibri.

select-too-few-options = No si pueín escogel { $numToSelect } componentis solu de { $numOptions }.

select-from-sequence-too-few-values = No si pueín escogel { $numToSelect } valoris d'una secuencia de longura { $length }.

select-from-sequence-indices-count-mismatch = El númeru d'índicis especificáus pa select tieni qui cuadral col númeru qu'escogel

select-from-sequence-indices-not-integers = Tos los índicis especificáus pa select tienin qui sel númerus enterus

select-from-sequence-index-excluded = El índici especificáu de selectfromsequence estava escluíu

select-from-sequence-indices-excluded-combination = Los índicis especificáus de selectfromsequence eran una combinacion escluía

select-from-sequence-coprime-not-positive-integers = No si pueín escogel combinacionis coprimas porqui no si escogin númerus enterus positivus.

select-from-sequence-coprime-common-factor = No si pueín escogel númerus coprimus. Tos los valoris posibris comparten un fautol comun. (Los valoris especificáus de "from" o "to" tienin qui sel coprimus con "step".)

select-from-sequence-coprime-single-number = No si pueín escogel combinacionis coprimas d'un solu númeru que no sea 1.

select-from-sequence-excluded-too-many-combinations = S'escluyó mas del 70% de las combinacionis en selectFromSequence

select-from-sequence-coprime-none-found = No si pudierun escogel númerus coprimus. Tos los valoris posibris comparten un fautol comun.

select-from-sequence-too-few-unique-values = No si pueín escogel { $numToSelect } valoris únicus d'una secuencia de longura { $numPossibleValues }

select-prime-numbers-too-few-values = No si pueín escogel { $numToSelect } valoris d'una lista de númerus primus de longura { $numValues }

select-prime-numbers-values-count-mismatch = El númeru de valoris especificáus pa select tieni qui cuadral col númeru qu'escogel

select-prime-numbers-values-not-prime = Tos los valoris especificáus pa escogel númerus primus tienin qu'estal en la lista de númerus primus

select-prime-numbers-values-excluded-combination = Los valoris especificáus de selectPrimeNumbers eran una combinacion escluía

select-prime-numbers-excluded-too-many-combinations = S'escluyó mas del 70% de las combinacionis en selectPrimeNumbers

select-random-combination-fluke = Por una casualiá estraordinariamenti improbabri, no si puó escogel una combinacion de valoris al azal

select-random-value-fluke = Por una casualiá estraordinariamenti improbabri, no si puó escogel un valol al azal

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] Esti `<{ $component }>` no s'amuestra porqui está endrentu de la matemática i no es `inline`. Añidi `inline` pa que si vuerva una lista desplegabri, que cabi endrentu d'una espresion.
        [expanded] Esti `<{ $component }>` no s'amuestra porqui está endrentu de la matemática i es `expanded`. Quita `expanded`; una caha de muchas linias no cabi endrentu d'una espresion.
        [on-graph] Esti `<{ $component }>` no s'amuestra porqui está endrentu de la matemática dibuhá nuna gráfica, que no tieni sitiu pa una entrá.
       *[relative-width] Esti `<{ $component }>` no s'amuestra porqui está endrentu de la matemática i tieni una anchura relativa. Da la anchura en unidais absolutas, comu `px`.
    }
