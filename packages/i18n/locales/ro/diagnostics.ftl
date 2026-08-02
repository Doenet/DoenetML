# Romanian diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# A counted noun takes «de» above nineteen — «20 de laturi» against «19
# laturi» — which is what Romanian's third CLDR plural category is for. Where a
# message selects on a count it has three branches rather than two and the
# `other` branch carries the preposition. Messages that interpolate a count
# without selecting on it are inherited from the English shape and still read
# «{ $count } puncte» at twenty; correcting them means adding the select.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } este ignorat când sunt specificate două capete
       *[other] { $attributes } sunt ignorate când sunt specificate două capete
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } este ignorat când sunt specificate atât un capăt, cât și un mijloc
       *[other] { $attributes } sunt ignorate când sunt specificate atât un capăt, cât și un mijloc
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset nu are efect fără midpoint

## `<line>`

line-points-undetermined-dimensions = Dreaptă prin puncte cu număr nedeterminat de dimensiuni.

line-points-too-few-dimensions = Dreapta trebuie să treacă prin puncte de cel puțin două dimensiuni.

line-points-depend-on-variables = Dreapta trece prin puncte care depind de variabilele: { $variables }.

line-equation-invalid-format = Format nevalid pentru ecuația dreptei în variabilele { $variable1 } și { $variable2 }.

## `<ray>`

ray-overprescribed-through = Semidreapta este prescrisă prin through, endpoint și direction.  Se ignoră through specificat.

ray-dimension-mismatch = Nepotrivire numDimensions în semidreaptă.

## `<vector>`

vector-overprescribed-head = Vectorul este prescris prin head, tail și displacement.  Se ignoră head specificat.

vector-dimension-mismatch = Nepotrivire numDimensions în vector.

## Attracting and constraining

attract-to-without-nearest-point = Nu se poate atrage către `<{ $component }>`, deoarece nu are variabila de stare nearestPoint.

constrain-to-without-nearest-point = Nu se poate constrânge la `<{ $component }>`, deoarece nu are variabila de stare nearestPoint.

constrain-to-interior-without-nearest-point = Nu se poate constrânge la interiorul unui `<{ $component }>`, deoarece nu are variabila de stare nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition este ignorat pentru un choiceInput care nu este inline

## Ordering children by index

choice-input-indices-count-mismatch = Indicii specificați pentru choiceInput sunt ignorați, deoarece numărul lor nu corespunde numărului de copii choice.

pretzel-indices-count-mismatch = Indicii specificați pentru problem sunt ignorați, deoarece numărul lor nu corespunde numărului de copii problem.

shuffle-indices-count-mismatch = Indicii specificați pentru shuffle sunt ignorați, deoarece numărul lor nu corespunde numărului de componente.

indices-ignored-out-of-range = Indicii specificați pentru { $component } sunt ignorați, deoarece unii sunt în afara intervalului.

pretzel-indices-repeated = Indicii specificați pentru pretzel sunt ignorați, deoarece unii se repetă.

pretzel-circuit-first-index = Indicii specificați pentru pretzel în modul circuit sunt ignorați, deoarece primul indice trebuie să fie 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Pentru ca `<{ $component }>` să funcționeze cu copii de tip șir, trebuie specificat atributul `type`.

invalid-type-defaulting-to-math = Tip nevalid { $type } pentru componenta { $component }. Trebuie să fie unul dintre math, text, number sau boolean. Se folosește math.

string-not-valid-component-to-arrange = Șirul „{ $value }” nu este o componentă validă pentru { $component }. Se ignoră.

## Types and variables

invalid-type-defaulting-to-number = Tip nevalid { $type }, tipul se stabilește la number.

invalid-variable-value = Valoare nevalidă a unei variabile: `{ $value }`

## Variants

variant-index-must-be-number = Indicele de variantă { $index } trebuie să fie un număr

variant-index-must-be-integer = Indicele de variantă { $index } trebuie să fie un întreg

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` nu este implementat pentru măsuri absolute. Lățimile devin relative.

side-by-side-absolute-margins = `<{ $component }>` nu este implementat pentru măsuri absolute. Marginile devin relative.

side-by-side-no-block-child = `<{ $component }>` nevalid: trebuie să aibă cel puțin un copil de tip bloc.

## `<label>`

label-for-ignored-on-graphical = Atributul `for` al unui `<label>` grafic este ignorat.

label-for-must-resolve-to-one = Atributul `for` al unui `<label>` trebuie să indice exact o componentă.

label-for-unresolved = Atributul `for` al unui `<label>` nu a putut fi asociat unei componente.

label-for-answer-with-authored-inputs = Atributul `for` al unui `<label>` face referire la un `<answer>` cu intrări scrise explicit; faceți referire direct la intrare.

label-for-answer-without-input = Atributul `for` al unui `<label>` face referire la un `<answer>` fără o intrare de etichetat.

label-for-must-reference-input-or-answer = Atributul `for` al unui `<label>` trebuie să facă referire la o intrare sau la un răspuns.

## Accessibility

accessibility-short-description-or-decorative = Pentru accesibilitate, `<{ $component }>` trebuie fie să aibă o descriere scurtă, fie să fie declarat decorativ.

accessibility-video-short-description = Pentru accesibilitate, `<video>` trebuie să aibă o descriere scurtă.

accessibility-input-short-description-or-label = Pentru accesibilitate, `<{ $component }>` trebuie să aibă o descriere scurtă sau o etichetă.

accessibility-answer-input-short-description-or-label = Pentru accesibilitate, un `<answer>` care creează o intrare trebuie să aibă o descriere scurtă sau o etichetă.

accessibility-short-description-contains-math = Descrierile scurte nu ar trebui să conțină componente matematice precum `<{ $component }>`. Exprimați matematica în cuvinte.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } are contrast insuficient pentru textul titlului de secțiune (mod întunecat) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; este necesar cel puțin { $threshold }:1).
       *[other] { $colorName } are contrast insuficient pentru textul titlului de secțiune ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; este necesar cel puțin { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Nu s-a implementat `<circle>` prin { $count } puncte în cazul în care punctele nu au valori numerice.

circle-too-many-through-points = Nu se poate calcula un cerc prin mai mult de 3 puncte.

circle-overprescribed-radius-center-points = Nu se poate calcula un cerc cu rază, centru și puncte specificate.

circle-center-with-multiple-points = Nu se poate calcula un cerc cu centru specificat prin mai mult de 1 punct.

circle-radius-too-small = Nu se poate calcula cercul: dat fiind că distanța dintre cele două puncte este { $distance }, raza specificată { $radius } este prea mică.

circle-radius-with-many-points = Nu se poate crea un cerc prin mai mult de două puncte cu rază specificată.

circle-invalid-center-or-through-points = Centru sau puncte nevalide ale cercului.

circle-radius-center-with-multiple-points = Nu se poate calcula raza unui cerc cu centru specificat prin mai mult de 1 punct.

circle-change-radius-non-numerical = Nu se poate schimba raza unui cerc cu puncte nenumerice

circle-radius-with-points-non-numerical = Nu se poate crea un cerc prin mai mult de un punct cu rază specificată când nu există valori numerice.

circle-change-center-non-numerical = Nu s-a implementat schimbarea centrului unui cerc prin puncte cu valori nenumerice.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Dimensiuni insuficiente pentru domeniul funcției. Domeniul are { $intervals } interval, dar funcția are { $inputs ->
            [one] { $inputs } intrare
            [few] { $inputs } intrări
           *[other] { $inputs } de intrări
        }.
        [few] Dimensiuni insuficiente pentru domeniul funcției. Domeniul are { $intervals } intervale, dar funcția are { $inputs ->
            [one] { $inputs } intrare
            [few] { $inputs } intrări
           *[other] { $inputs } de intrări
        }.
       *[other] Dimensiuni insuficiente pentru domeniul funcției. Domeniul are { $intervals } de intervale, dar funcția are { $inputs ->
            [one] { $inputs } intrare
            [few] { $inputs } intrări
           *[other] { $inputs } de intrări
        }.
    }

function-domain-invalid-format = Format nevalid pentru domeniul funcției.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Se ignoră maximul nenumeric al funcției.
        [minimum] Se ignoră minimul nenumeric al funcției.
        [extremum] Se ignoră extremul nenumeric al funcției.
        [point] Se ignoră punctul nenumeric al funcției.
        [slope] Se ignoră panta nenumerică a funcției.
       *[other] Se ignoră { $type } nenumeric al funcției.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Se ignoră maximul vid al funcției.
        [minimum] Se ignoră minimul vid al funcției.
        [extremum] Se ignoră extremul vid al funcției.
        [point] Se ignoră punctul vid al funcției.
       *[other] Se ignoră { $type } vid al funcției.
    }

function-points-too-close = Funcția conține două puncte cu poziții prea apropiate. Funcția nu poate fi definită.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Iterațiile unei funcții sunt posibile doar dacă numărul de intrări este egal cu numărul de ieșiri. Această funcție are { $inputs } intrare și { $outputs ->
            [one] { $outputs } ieșire
            [few] { $outputs } ieșiri
           *[other] { $outputs } de ieșiri
        }.
        [few] Iterațiile unei funcții sunt posibile doar dacă numărul de intrări este egal cu numărul de ieșiri. Această funcție are { $inputs } intrări și { $outputs ->
            [one] { $outputs } ieșire
            [few] { $outputs } ieșiri
           *[other] { $outputs } de ieșiri
        }.
       *[other] Iterațiile unei funcții sunt posibile doar dacă numărul de intrări este egal cu numărul de ieșiri. Această funcție are { $inputs } de intrări și { $outputs ->
            [one] { $outputs } ieșire
            [few] { $outputs } ieșiri
           *[other] { $outputs } de ieșiri
        }.
    }

## `<sequence>`

sequence-invalid-length = Lungime nevalidă a secvenței.  Trebuie să fie un întreg nenegativ.

sequence-invalid-step = Pas nevalid al secvenței.  Pentru o secvență de tip { $type } trebuie să fie un număr.

sequence-invalid-endpoint-number = „{ $attribute }” nevalid al unei secvențe numerice.  Trebuie să fie un număr.

sequence-invalid-endpoint-letters = „{ $attribute }” nevalid al unei secvențe de litere.  Trebuie să fie o combinație de litere.

sequence-invalid-endpoint = „{ $attribute }” nevalid al secvenței.

select-from-sequence-coprime-not-numbers = coprime este ignorat deoarece nu se selectează numere

select-from-sequence-coprime-with-exclude-combinations = coprime este ignorat deoarece este specificat excludeCombinations

## Resolving a `target`

target-not-found = target nevalid pentru `<{ $source }>`: nu se găsește ținta.

target-state-variable-not-found = target nevalid pentru `<{ $source }>`: nu se găsește o variabilă de stare numită „{ $property }” pe un `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Variabilele unui `<odeSystem>` trebuie să fie diferite de variabila independentă.

ode-system-duplicate-variable-names = Nu se pot defini funcțiile din membrul drept al EDO cu nume duplicate de variabile dependente.

ode-system-rhs-function-error = Nu se poate defini funcția din membrul drept al EDO.  Eroare la crearea funcției mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Nu se poate defini un unghi între { $count } drepte

angle-invalid-through-point = Punct nevalid în through al lui `<angle>`

parabola-vertex-too-many-points = Nu s-a implementat parabola cu vârf prin mai mult de 1 punct.

parabola-too-many-points = Nu s-a implementat parabola prin mai mult de 3 puncte.

intersection-too-many-items = Nu s-a implementat intersecția pentru mai mult de două obiecte

## Other math components

ionic-compound-not-two-ions = Nu s-a implementat compusul ionic pentru altceva decât doi ioni.

ionic-compound-needs-cation-and-anion = Compusul ionic este implementat doar pentru un cation și un anion.

solve-equations-cannot-evaluate = Nu se poate rezolva ecuația deoarece nu a putut fi evaluată: { $equation }

math-operators-operand-number-required = Trebuie specificat operandNumber la extragerea unui operand matematic.

eigen-decomposition-failed = Nu s-au putut calcula valorile proprii ale matricei

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parametrul { $parameters } nu apare în tipar, deci va corespunde întotdeauna unui gol.
       *[other] `<matchesPattern>`: parametrii { $parameters } nu apar în tipar, deci vor corespunde întotdeauna unui gol.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: nu se poate interpreta grid="{ $grid }". Trebuie să fie none, medium, dense sau două numere pozitive separate printr-un spațiu, precum grid="1 0.5". Nu se desenează nicio grilă.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" nu este acceptat în modulul de randare prefigure; se folosește comportamentul pentru right.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" nu este acceptat în modulul de randare prefigure; se folosește comportamentul pentru top.

prefigure-invalid-axis-bounds = `<graph>`: limite de axe nevalide pentru conversia prefigure; se folosește bbox implicit (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: lățime nevalidă pentru conversia prefigure; se folosește lățimea implicită a diagramei 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio nevalid pentru conversia prefigure; se folosește raportul implicit 1.

prefigure-grid-spacing-too-fine = `<graph>`: pasul grilei este prea fin pentru limitele axelor; grila este omisă în modulul de randare prefigure.

prefigure-annotations-not-rendered = `<graph>`: adnotările nu sunt randate când nu se folosește modulul de randare PreFigure.

multiple-annotations-children = S-au găsit mai mulți copii `<annotations>` într-un `<graph>`; toți în afară de ultimul sunt ignorați.

## Referring to other components

copy-unrecognized-component-type = Nu se poate extinde sau copia un tip de componentă nerecunoscut: { $type }.

copy-prop-not-found = Nu s-a găsit proprietatea { $property } pe o componentă de tip { $component }

collect-no-source = Nu s-a găsit nicio sursă pentru collect.

collect-invalid-component-type = Nu se pot colecta componente de tip `<{ $component }>`, deoarece este un tip de componentă nevalid.

reference-index-unavailable = Nu se poate face referire la indicele `{ $reference }`

## `<callAction>`

component-action-unavailable = Nu se poate apela { $action } pe componenta `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Datele au o formă nevalidă.  Rândurile au lungimi inconsecvente. Găsit în componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Datele au nume de coloane duplicate.  Găsit în componentIdx :{ $componentIdx }

data-frame-missing-column-name = Datelor le lipsește un nume de coloană.  Găsit în componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Un award al acestui răspuns se bazează pe însuși răspunsul trimis al etichetei answer, ceea ce va duce la un comportament neașteptat.

answer-max-num-attempts-in-section-wide-check-work = Stabilirea lui `maxNumAttempts` pe un `<answer>` aflat într-un container cu `sectionWideCheckWork` nu are efect, deoarece numărul de încercări este controlat de container. Stabiliți `maxNumAttempts` pe container.

nested-section-wide-check-work-max-num-attempts = Stabilirea lui `maxNumAttempts` pe un container cu `sectionWideCheckWork` aflat în alt container cu `sectionWideCheckWork` nu are efect, deoarece numărul de încercări este controlat de containerul exterior. Stabiliți `maxNumAttempts` pe containerul exterior.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Atributul { $attributes } nu va avea efect fără symbolicEquality stabilit.
       *[other] Atributele { $attributes } nu vor avea efect fără symbolicEquality stabilit.
    }

answer-invalid-type = Tip nevalid pentru answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Deoarece componenta `<{ $component }>` nu are nume, nu poate fi folosită pentru un atribut de modul

module-attribute-name-already-defined = Componenta `<{ $component } name="{ $name }">` nu poate fi folosită ca atribut al unui modul, deoarece tipul de componentă `<module>` are deja definit un atribut „{ $name }”.

conditional-content-condition-ignored = Atributul `condition` este ignorat pe o componentă `<conditionalContent>` cu copii case sau else.

slider-markers-type-mismatch = Tipul marcajelor nu corespunde tipului glisorului.

pretzel-problem-needs-statement-and-answer = Pretzel nevalid: fiecare `<problem>` trebuie să conțină un `<statement>` și un `<answer>`.

pretzel-circuit-first-problem-distractor = Pretzel nevalid: în mode="circuit", primul `<problem>` nu poate fi un distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Valoare nevalidă { $values } pentru atributul `{ $attribute }`; se ignoră.
       *[other] Valori nevalide { $values } pentru atributul `{ $attribute }`; se ignoră.
    }

attribute-must-be-references = Valoare nevalidă `{ $value }` pentru atributul `{ $attribute }`. Atributul trebuie compus din referințe care încep cu `$`.

math-input-invalid-function-names = <mathInput>: s-au ignorat nume de funcții nevalide în { $attribute }: { $names }. Segmentul afișat al fiecărui nume trebuie să aibă cel puțin 2 caractere (litere sau cratime); poate urma un sufix opțional `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Tip de componentă nevalid: `<{ $componentType }>`

attribute-repeated = Atributul { $attribute } nu poate fi repetat.

attribute-invalid-for-component = Atribut nevalid „{ $attribute }” pentru o componentă de tip `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Definiția de stil { $styleNumber } are contrast insuficient { $context ->
        [text-on-background] al culorii textului față de culoarea fundalului
        [high-contrast] al culorii de contrast ridicat față de canvas
        [line] al culorii liniei față de canvas
        [marker] al culorii marcajului față de canvas
       *[text-on-canvas] al culorii textului față de canvas
    }{ $mode ->
        [dark] { " (mod întunecat)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; este necesar cel puțin { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Deși definiția de stil { $styleNumber } specifică culori cu contrast suficient pentru modul luminos, culorile pentru modul întunecat derivate din aceste valori au contrast insuficient al culorii textului față de culoarea fundalului ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; este necesar cel puțin { $threshold }:1). { $suggestion ->
        [available] Pentru un contrast suficient în modul întunecat, fie măriți contrastul în modul luminos (de ex. stabiliți { $lightAttribute }="{ $lightColor }"), fie suprascrieți culoarea modului întunecat (de ex. stabiliți { $darkAttribute }="{ $darkColor }").
       *[none] Pentru un contrast suficient în modul întunecat, măriți contrastul în modul luminos sau suprascrieți culorile derivate cu textColorDarkMode și/sau backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Deși definiția de stil { $styleNumber } specifică o culoare de text cu contrast suficient pentru modul luminos, culoarea de text pentru modul întunecat derivată din această valoare are contrast insuficient față de canvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; este necesar cel puțin { $threshold }:1). { $suggestion ->
        [available] Pentru un contrast suficient în modul întunecat, fie măriți contrastul în modul luminos (de ex. stabiliți textColor="{ $lightColor }"), fie suprascrieți culoarea modului întunecat (de ex. stabiliți textColorDarkMode="{ $darkColor }").
       *[none] Pentru un contrast suficient în modul întunecat, măriți contrastul în modul luminos sau suprascrieți culoarea derivată cu textColorDarkMode.
    }

section-multiple-style-palettes = O secțiune poate selecta o singură <stylePalette>; se folosește ultima.

## Unique variants

variant-num-to-select-not-non-negative-integer = nu se pot determina variantele unice ale lui { $component } deoarece numToSelect nu este un întreg nenegativ.

variant-num-to-select-not-constant-number = nu se pot determina variantele unice ale lui { $component } deoarece numToSelect nu este un număr constant.

variant-with-replacement-not-constant-boolean = nu se pot determina variantele unice ale lui { $component } deoarece withReplacement nu este o valoare booleană constantă.

variant-select-weight-disables-unique = Variantele unice pentru select sunt dezactivate dacă există o opțiune cu selectWeight sau selectForVariants specificat

variant-coprime-undetermined = nu se pot determina variantele unice ale lui { $component } deoarece nu se poate stabili că coprime este întotdeauna fals.

variant-attribute-not-constant = nu se pot determina variantele unice ale lui { $component } deoarece { $attribute } nu este o constantă.

variant-attribute-not-number = nu se pot determina variantele unice ale lui { $component } deoarece { $attribute } nu este un număr.

variant-attribute-wrong-type-for-sequence =
    nu se pot determina variantele unice ale lui { $component } de tip { $type } deoarece { $attribute } nu este { $expected ->
        [letters-combination] o combinație de litere
        [math-expression] o expresie matematică validă
        [integer] un întreg
       *[number] un număr
    }.

variant-length-not-integer = nu se pot determina variantele unice ale lui { $component } deoarece length nu este un întreg.

variant-sort-not-implemented = nu s-au implementat variantele unice ale unui { $component } cu sort

variant-exclude-combinations-not-implemented = nu s-au implementat variantele unice ale unui { $component } cu excludeCombinations

variant-math-exclude-not-implemented = nu s-au implementat variantele unice ale unui { $component } de tip math cu exclude

variant-non-constant-exclude-not-implemented = nu s-au implementat variantele unice ale unui { $component } cu exclude neconstant

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: neacceptat în modulul de randare graph prefigure; descendentul a fost omis.

prefigure-descendant-invalid-geometry = { $subject }: geometrie nefinită sau incompletă; descendentul a fost omis.

prefigure-curve-label-omitted = { $subject }: etichetele nu sunt acceptate pe elementele de curbă convertite; eticheta a fost omisă.

prefigure-curve-unsupported-definition-type = { $subject }: tip de definiție a curbei neacceptat „{ $definitionType }”; descendentul a fost omis.

prefigure-region-flip-functions-unsupported = { $subject }: atribut flipFunctions neacceptat pe regionBetweenCurves; descendentul a fost omis.

prefigure-region-non-formula-child = { $subject }: pe regionBetweenCurves sunt acceptate doar funcțiile copil de tip formulă; descendentul a fost omis.

prefigure-label-position-unsupported =
    { $subject }: labelPosition neacceptat „{ $labelPosition }” pentru { $labelKind ->
        [line-family] eticheta unui obiect din familia dreptelor
       *[point] eticheta unui punct
    }; s-a folosit alinierea implicită PreFigure.

prefigure-fill-style-unsupported = { $subject }: stilul de umplere „{ $fillStyle }” nu este acceptat de PreFigure; se revine la o umplere plină.

prefigure-line-style-unknown = { $subject }: stilul de linie necunoscut „{ $lineStyle }” a fost omis din ieșirea PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: stilul de marcaj „{ $markerStyle }” a fost mapat la stilul PreFigure „diamond”.

prefigure-marker-style-unsupported = { $subject }: stilul de marcaj „{ $markerStyle }” nu este acceptat de PreFigure; s-a folosit stilul implicit.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` nevalid; ținta nu poate fi determinată. Adnotarea a fost omisă.

annotation-ref-multiple-targets = `<annotation>`: `ref` a indicat mai multe ținte; se folosește prima.

annotation-ref-outside-graph = `<annotation>`: `ref` nevalid; ținta este în afara graficului care o conține. Adnotarea a fost omisă.

annotation-ref-unsupported-target = `<annotation>`: `ref` nevalid; ținta nu este un obiect grafic acceptat în conversia prefigure. Adnotarea a fost omisă.

annotation-text-missing = `<annotation>`: `text` lipsă sau gol; se emite text gol.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] S-a detectat o dependență circulară.
       *[other] S-a detectat o dependență circulară care implică o componentă `<{ $componentType }>`.
    }

reference-no-referent = Nu s-a găsit niciun referent pentru referința: `{ $reference }`

reference-multiple-referents = S-au găsit mai mulți referenți pentru referința: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format nevalid pentru atributul { $attribute } al `<{ $componentType }>`.

children-invalid = Copii nevalizi pentru `<{ $componentType }>`: s-au găsit copii nevalizi: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valoare nevalidă `{ $value }` pentru atributul `{ $attribute }`, se folosește valoarea `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Versiunea DoenetML { $version } nu a fost găsită.
       *[other] Versiunea DoenetML { $version } nu a fost găsită. Se revine la versiunea { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML nevalid: { $content }

parse-tag-missing-close-tag = DoenetML nevalid: Eticheta `{ $tag }` nu are etichetă de închidere. Se aștepta o etichetă auto-închisă sau o etichetă `</{ $tagName }>`.

parse-tag-error = DoenetML nevalid: Eroare în eticheta `<{ $tagName }>`

parse-attribute-missing-value = DoenetML nevalid: Atributului nevalid `{ $attribute }` pare să îi lipsească o valoare.

parse-attribute-invalid = DoenetML nevalid: Atribut nevalid `{ $attribute }`

parse-attribute-value-invalid = DoenetML nevalid: Valoare de atribut nevalidă `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML nevalid: Valoare de atribut nevalidă `{ $value }`. Ghilimelele nu se potrivesc. Pare să lipsească un `{ $quote }`

parse-open-tag-name-missing = DoenetML nevalid: S-a găsit o etichetă fără nume, de ex. `<`

parse-tag-not-closed = DoenetML nevalid: Eticheta `{ $tag }` nu a fost închisă (pare să lipsească un `>`).

parse-self-closing-tag-name-missing = DoenetML nevalid: S-a găsit o etichetă fără nume `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML nevalid: Eticheta `{ $tag }` nu a fost închisă (pare să lipsească `/>`).

parse-tag-invalid-attributes = DoenetML nevalid: Eticheta `{ $tag }` nu este validă. Poate avea atribute incorecte.

parse-close-tag-name-missing = DoenetML nevalid: S-a găsit o etichetă de închidere fără nume, de ex. `</`

parse-attribute-value-unquoted = Valorile atributelor trebuie puse între ghilimele: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML nevalid: S-a găsit eticheta de închidere `{ $tag }`, dar nicio etichetă de deschidere corespunzătoare

parse-close-tag-mismatched = DoenetML nevalid: Etichetă de închidere nepotrivită. Se aștepta `</{ $expected }>`. S-a găsit `{ $found }`

parser-node-unconvertible = Nodul { $node } nu a putut fi convertit într-un nod Dast.

## Names

name-attribute-invalid =
    Atribut nevalid name='{ $name }'. { $reason ->
        [characters] Numele pot conține doar litere, cifre, liniuțe de subliniere sau cratime.
       *[start] Numele trebuie să înceapă cu o literă.
    }

component-name-invalid-start = Nume de componentă nevalid „{ $name }”. Numele trebuie să înceapă cu o literă.

## `<answer>` sugar

answer-video-watched-missing-video = Un answer cu type videoWatched trebuie să aibă un atribut video

answer-video-watched-video-not-reference = Un answer cu type videoWatched trebuie să aibă un atribut video care este o referință

answer-name-not-single-text = Atributul name al unui answer trebuie să aibă un singur copil de tip text

## Referencing another document

external-doenetml-recursion-limit = Nu s-a putut prelua DoenetML extern din cauza prea multor niveluri de recursivitate. Există o referință circulară?

external-doenetml-unavailable = Nu s-a putut prelua DoenetML din { $attribute }="{ $uri }"

external-doenetml-type-mismatch = S-a preluat DoenetML nevalid din { $attribute }="{ $uri }": nu corespunde tipului de componentă „{ $componentType }”

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atributul `{ $from }` este învechit; folosiți `{ $to }` în loc.
       *[other] [deprecation] Atributul `{ $from }` de pe `<{ $component }>` este învechit; folosiți `{ $to }` în loc.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atributul `{ $from }` este învechit și ignorat deoarece este specificat și `{ $to }`.
       *[other] [deprecation] Atributul `{ $from }` de pe `<{ $component }>` este învechit și ignorat deoarece este specificat și `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Atributul `{ $attribute }` de pe `<{ $component }>` este învechit și ignorat.


## Language coverage

pluralize-english-only = `<pluralize>` poate forma pluralul doar în engleză, așa că într-un document scris în { $locale } textul său rămâne neschimbat. Scrieți direct forma de plural sau stabiliți-o cu atributul `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elementul `<{ $tag }>` nu este un element Doenet recunoscut.

schema-element-not-allowed-at-root = Elementul `<{ $tag }>` nu este permis la rădăcina documentului.

schema-element-not-allowed-inside = Elementul `<{ $tag }>` nu este permis în interiorul lui `<{ $parent }>`.

schema-attribute-unrecognized = Elementul `<{ $tag }>` nu are un atribut numit `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atributul `{ $attribute }` al elementului `<{ $tag }>` trebuie să fie o listă ale cărei elemente sunt fiecare unul dintre: { $allowed }
       *[other] Atributul `{ $attribute }` al elementului `<{ $tag }>` trebuie să fie unul dintre: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nume de variantă nevalid pentru select.  Numele de variantă { $variantName } apare în { $numOptions } opțiuni, dar numărul de selectat este { $numToSelect }.

select-variant-name-without-options = Sunt specificate variante pentru select, dar nicio opțiune pentru posibilul nume de variantă: { $variantName }.

select-variant-name-not-possible = Numele de variantă { $variantName } specificat pentru select nu este un nume de variantă posibil.

select-too-few-options = Nu se pot selecta { $numToSelect } componente din doar { $numOptions }.

select-from-sequence-too-few-values = Nu se pot selecta { $numToSelect } valori dintr-o secvență de lungime { $length }.

select-from-sequence-indices-count-mismatch = Numărul de indici specificați pentru select trebuie să corespundă numărului de selectat

select-from-sequence-indices-not-integers = Toți indicii specificați pentru select trebuie să fie întregi

select-from-sequence-index-excluded = Indicele specificat pentru selectfromsequence a fost exclus

select-from-sequence-indices-excluded-combination = Indicii specificați pentru selectfromsequence formau o combinație exclusă

select-from-sequence-coprime-not-positive-integers = Nu se pot selecta combinații de numere prime între ele deoarece nu se selectează întregi pozitivi.

select-from-sequence-coprime-common-factor = Nu se pot selecta numere prime între ele. Toate valorile posibile au un divizor comun. (Valorile specificate pentru "from" sau "to" trebuie să fie prime cu "step".)

select-from-sequence-coprime-single-number = Nu se pot selecta combinații de numere prime între ele dintr-un singur număr diferit de 1.

select-from-sequence-excluded-too-many-combinations = S-au exclus peste 70% dintre combinații în selectFromSequence

select-from-sequence-coprime-none-found = Nu s-au putut selecta numere prime între ele. Toate valorile posibile au un divizor comun.

select-from-sequence-too-few-unique-values = Nu se pot selecta { $numToSelect } valori unice dintr-o secvență de lungime { $numPossibleValues }

select-prime-numbers-too-few-values = Nu se pot selecta { $numToSelect } valori dintr-o listă de numere prime de lungime { $numValues }

select-prime-numbers-values-count-mismatch = Numărul de valori specificate pentru select trebuie să corespundă numărului de selectat

select-prime-numbers-values-not-prime = Toate valorile specificate pentru selectarea unui număr prim trebuie să se afle în lista de numere prime

select-prime-numbers-values-excluded-combination = Valorile specificate pentru selectPrimeNumbers formau o combinație exclusă

select-prime-numbers-excluded-too-many-combinations = S-au exclus peste 70% dintre combinații în selectPrimeNumbers

select-random-combination-fluke = Printr-o coincidență extrem de improbabilă, nu s-a putut selecta o combinație de valori aleatorii

select-random-value-fluke = Printr-o coincidență extrem de improbabilă, nu s-a putut selecta o valoare aleatorie
