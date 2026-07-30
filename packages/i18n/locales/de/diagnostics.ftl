# German diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
        [one] { $attributes } wird ignoriert, wenn zwei Endpunkte angegeben sind
       *[other] { $attributes } werden ignoriert, wenn zwei Endpunkte angegeben sind
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } wird ignoriert, wenn sowohl ein Endpunkt als auch ein Mittelpunkt angegeben sind
       *[other] { $attributes } werden ignoriert, wenn sowohl ein Endpunkt als auch ein Mittelpunkt angegeben sind
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset hat ohne Mittelpunkt keine Wirkung

## `<line>`

line-points-undetermined-dimensions = Gerade durch Punkte unbestimmter Dimension.

line-points-too-few-dimensions = Eine Gerade muss durch Punkte von mindestens zwei Dimensionen verlaufen.

line-points-depend-on-variables = Die Gerade verläuft durch Punkte, die von Variablen abhängen: { $variables }.

line-equation-invalid-format = Ungültiges Format für die Gleichung einer Geraden in den Variablen { $variable1 } und { $variable2 }.

## `<ray>`

ray-overprescribed-through = Der Strahl ist durch through, endpoint und direction festgelegt. Das angegebene through wird ignoriert.

ray-dimension-mismatch = numDimensions stimmt im Strahl nicht überein.

## `<vector>`

vector-overprescribed-head = Der Vektor ist durch head, tail und displacement festgelegt. Das angegebene head wird ignoriert.

vector-dimension-mismatch = numDimensions stimmt im Vektor nicht überein.

## Attracting and constraining

attract-to-without-nearest-point = Anziehen an ein `<{ $component }>` ist nicht möglich, da es keine Zustandsvariable nearestPoint hat.

constrain-to-without-nearest-point = Beschränken auf ein `<{ $component }>` ist nicht möglich, da es keine Zustandsvariable nearestPoint hat.

constrain-to-interior-without-nearest-point = Beschränken auf das Innere eines `<{ $component }>` ist nicht möglich, da es keine Zustandsvariable nearestPoint hat.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition wird bei einem nicht eingebetteten choiceInput ignoriert

## Ordering children by index

choice-input-indices-count-mismatch = Die für choiceInput angegebenen Indizes werden ignoriert, da ihre Anzahl nicht zur Anzahl der choice-Kinder passt.

pretzel-indices-count-mismatch = Die für problem angegebenen Indizes werden ignoriert, da ihre Anzahl nicht zur Anzahl der problem-Kinder passt.

shuffle-indices-count-mismatch = Die für shuffle angegebenen Indizes werden ignoriert, da ihre Anzahl nicht zur Anzahl der Komponenten passt.

indices-ignored-out-of-range = Die für { $component } angegebenen Indizes werden ignoriert, da einige außerhalb des Bereichs liegen.

pretzel-indices-repeated = Die für pretzel angegebenen Indizes werden ignoriert, da einige mehrfach vorkommen.

pretzel-circuit-first-index = Die für pretzel im circuit-Modus angegebenen Indizes werden ignoriert, da der erste Index 1 sein muss.

## `<shuffle>` and `<sort>`

string-children-need-type = Damit `<{ $component }>` mit Zeichenketten-Kindern funktioniert, muss ein `type`-Attribut angegeben werden.

invalid-type-defaulting-to-math = Ungültiger Typ { $type } für die Komponente { $component }. Er muss math, text, number oder boolean sein. math wird verwendet.

string-not-valid-component-to-arrange = Die Zeichenkette „{ $value }“ ist keine gültige Komponente für { $component }. Sie wird ignoriert.

## Types and variables

invalid-type-defaulting-to-number = Ungültiger Typ { $type }; der Typ wird auf number gesetzt.

invalid-variable-value = Ungültiger Wert einer Variablen: `{ $value }`

## Variants

variant-index-must-be-number = Der Variantenindex { $index } muss eine Zahl sein

variant-index-must-be-integer = Der Variantenindex { $index } muss eine ganze Zahl sein

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ist für absolute Maße nicht implementiert. Die Breiten werden relativ gesetzt.

side-by-side-absolute-margins = `<{ $component }>` ist für absolute Maße nicht implementiert. Die Ränder werden relativ gesetzt.

side-by-side-no-block-child = Ungültiges `<{ $component }>`: Es muss mindestens ein Block-Kind haben.

## `<label>`

label-for-ignored-on-graphical = Das Attribut `for` an einem grafischen `<label>` wird ignoriert.

label-for-must-resolve-to-one = Das Attribut `for` an `<label>` muss sich auf genau eine Komponente auflösen.

label-for-unresolved = Das Attribut `for` an `<label>` konnte nicht auf eine Komponente aufgelöst werden.

label-for-answer-with-authored-inputs = Das Attribut `for` an `<label>` verweist auf ein `<answer>` mit ausdrücklich geschriebenen Eingaben; verweisen Sie direkt auf die Eingabe.

label-for-answer-without-input = Das Attribut `for` an `<label>` verweist auf ein `<answer>` ohne Eingabe, die beschriftet werden könnte.

label-for-must-reference-input-or-answer = Das Attribut `for` an `<label>` muss auf eine Eingabe oder eine Antwort verweisen.

## Accessibility

accessibility-short-description-or-decorative = Für die Barrierefreiheit muss `<{ $component }>` entweder eine Kurzbeschreibung haben oder als dekorativ gekennzeichnet sein.

accessibility-video-short-description = Für die Barrierefreiheit muss `<video>` eine Kurzbeschreibung haben.

accessibility-input-short-description-or-label = Für die Barrierefreiheit muss `<{ $component }>` eine Kurzbeschreibung oder eine Beschriftung haben.

accessibility-answer-input-short-description-or-label = Für die Barrierefreiheit muss ein `<answer>`, das eine Eingabe erzeugt, eine Kurzbeschreibung oder eine Beschriftung haben.

accessibility-short-description-contains-math = Kurzbeschreibungen sollten keine Mathematik-Komponenten wie `<{ $component }>` enthalten. Schreiben Sie Mathematik in Worten aus.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } hat zu wenig Kontrast für den Text der Abschnittsüberschrift (dunkler Modus) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mindestens { $threshold }:1 erforderlich).
       *[other] { $colorName } hat zu wenig Kontrast für den Text der Abschnittsüberschrift ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mindestens { $threshold }:1 erforderlich).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` durch { $count } Punkte ist nicht implementiert, wenn die Punkte keine numerischen Werte haben.

circle-too-many-through-points = Ein Kreis durch mehr als 3 Punkte lässt sich nicht berechnen.

circle-overprescribed-radius-center-points = Ein Kreis mit angegebenem Radius, Mittelpunkt und Durchgangspunkten lässt sich nicht berechnen.

circle-center-with-multiple-points = Ein Kreis mit angegebenem Mittelpunkt durch mehr als 1 Punkt lässt sich nicht berechnen.

circle-radius-too-small = Der Kreis lässt sich nicht berechnen: Da der Abstand der beiden Punkte { $distance } beträgt, ist der angegebene Radius { $radius } zu klein.

circle-radius-with-many-points = Ein Kreis durch mehr als zwei Punkte mit angegebenem Radius lässt sich nicht erzeugen.

circle-invalid-center-or-through-points = Ungültiger Mittelpunkt oder ungültige Durchgangspunkte des Kreises.

circle-radius-center-with-multiple-points = Der Radius eines Kreises mit angegebenem Mittelpunkt durch mehr als 1 Punkt lässt sich nicht berechnen.

circle-change-radius-non-numerical = Der Radius eines Kreises mit nicht numerischen Durchgangspunkten lässt sich nicht ändern

circle-radius-with-points-non-numerical = Ein Kreis durch mehr als einen Punkt mit angegebenem Radius lässt sich ohne numerische Werte nicht erzeugen.

circle-change-center-non-numerical = Das Ändern des Mittelpunkts eines Kreises durch nicht numerische Punkte ist nicht implementiert.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Zu wenige Dimensionen für den Definitionsbereich der Funktion. Der Bereich hat { $intervals } Intervall, die Funktion aber { $inputs ->
            [one] { $inputs } Eingabe
           *[other] { $inputs } Eingaben
        }.
       *[other] Zu wenige Dimensionen für den Definitionsbereich der Funktion. Der Bereich hat { $intervals } Intervalle, die Funktion aber { $inputs ->
            [one] { $inputs } Eingabe
           *[other] { $inputs } Eingaben
        }.
    }

function-domain-invalid-format = Ungültiges Format für den Definitionsbereich der Funktion.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Das nicht numerische Maximum der Funktion wird ignoriert.
        [minimum] Das nicht numerische Minimum der Funktion wird ignoriert.
        [extremum] Das nicht numerische Extremum der Funktion wird ignoriert.
        [point] Der nicht numerische Punkt der Funktion wird ignoriert.
        [slope] Die nicht numerische Steigung der Funktion wird ignoriert.
       *[other] Nicht numerisches { $type } der Funktion wird ignoriert.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Das leere Maximum der Funktion wird ignoriert.
        [minimum] Das leere Minimum der Funktion wird ignoriert.
        [extremum] Das leere Extremum der Funktion wird ignoriert.
        [point] Der leere Punkt der Funktion wird ignoriert.
       *[other] Leeres { $type } der Funktion wird ignoriert.
    }

function-points-too-close = Die Funktion enthält zwei Punkte, die zu dicht beieinander liegen. Die Funktion lässt sich nicht definieren.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Funktionsiterationen sind nur möglich, wenn die Zahl der Eingaben der Zahl der Ausgaben entspricht. Diese Funktion hat { $inputs } Eingabe und { $outputs ->
            [one] { $outputs } Ausgabe
           *[other] { $outputs } Ausgaben
        }.
       *[other] Funktionsiterationen sind nur möglich, wenn die Zahl der Eingaben der Zahl der Ausgaben entspricht. Diese Funktion hat { $inputs } Eingaben und { $outputs ->
            [one] { $outputs } Ausgabe
           *[other] { $outputs } Ausgaben
        }.
    }

## `<sequence>`

sequence-invalid-length = Ungültige Länge der Folge. Sie muss eine nichtnegative ganze Zahl sein.

sequence-invalid-step = Ungültige Schrittweite der Folge. Sie muss für eine Folge vom Typ { $type } eine Zahl sein.

sequence-invalid-endpoint-number = Ungültiges „{ $attribute }“ einer Zahlenfolge. Es muss eine Zahl sein.

sequence-invalid-endpoint-letters = Ungültiges „{ $attribute }“ einer Buchstabenfolge. Es muss eine Buchstabenkombination sein.

sequence-invalid-endpoint = Ungültiges „{ $attribute }“ der Folge.

select-from-sequence-coprime-not-numbers = coprime wird ignoriert, da keine Zahlen ausgewählt werden

select-from-sequence-coprime-with-exclude-combinations = coprime wird ignoriert, da excludeCombinations angegeben ist

## Resolving a `target`

target-not-found = Ungültiges target für `<{ $source }>`: Ziel nicht gefunden.

target-state-variable-not-found = Ungültiges target für `<{ $source }>`: keine Zustandsvariable namens „{ $property }“ an einem `<{ $component }>` gefunden.

## `<odeSystem>`

ode-system-variables-match-independent = Die Variablen eines `<odeSystem>` müssen sich von der unabhängigen Variablen unterscheiden.

ode-system-duplicate-variable-names = Die rechten Seiten der DGL lassen sich nicht mit doppelten Namen abhängiger Variablen definieren.

ode-system-rhs-function-error = Die rechte Seite der DGL lässt sich nicht definieren. Fehler beim Erzeugen der mathjs-Funktion.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ein Winkel zwischen { $count } Geraden lässt sich nicht definieren

angle-invalid-through-point = Ungültiger Punkt im through eines `<angle>`

parabola-vertex-too-many-points = Eine Parabel mit Scheitelpunkt durch mehr als 1 Punkt ist nicht implementiert.

parabola-too-many-points = Eine Parabel durch mehr als 3 Punkte ist nicht implementiert.

intersection-too-many-items = Der Schnitt von mehr als zwei Objekten ist nicht implementiert

## Other math components

ionic-compound-not-two-ions = Ionenverbindungen sind nur für genau zwei Ionen implementiert.

ionic-compound-needs-cation-and-anion = Ionenverbindungen sind nur für ein Kation und ein Anion implementiert.

solve-equations-cannot-evaluate = Die Gleichung lässt sich nicht lösen, da sie nicht ausgewertet werden konnte: { $equation }

math-operators-operand-number-required = Zum Extrahieren eines mathematischen Operanden muss eine operandNumber angegeben werden.

eigen-decomposition-failed = Die Eigenwerte der Matrix ließen sich nicht berechnen

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: Der Parameter { $parameters } kommt im Muster nicht vor und passt daher immer auf eine Leerstelle.
       *[other] `<matchesPattern>`: Die Parameter { $parameters } kommen im Muster nicht vor und passen daher immer auf eine Leerstelle.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" lässt sich nicht deuten. Der Wert muss none, medium, dense oder zwei durch ein Leerzeichen getrennte positive Zahlen sein, etwa grid="1 0.5". Es wird kein Gitter gezeichnet.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" wird vom prefigure-Renderer nicht unterstützt; es wird das Verhalten der rechten Position verwendet.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" wird vom prefigure-Renderer nicht unterstützt; es wird das Verhalten der oberen Position verwendet.

prefigure-invalid-axis-bounds = `<graph>`: ungültige Achsengrenzen für die prefigure-Konvertierung; es wird die Standard-bbox (-10,-10,10,10) verwendet.

prefigure-invalid-width = `<graph>`: ungültige Breite für die prefigure-Konvertierung; es wird die Standardbreite 425 verwendet.

prefigure-invalid-aspect-ratio = `<graph>`: ungültiges aspectRatio für die prefigure-Konvertierung; es wird das Standardseitenverhältnis 1 verwendet.

prefigure-grid-spacing-too-fine = `<graph>`: Der Gitterabstand ist für die Achsengrenzen zu fein; das Gitter wird im prefigure-Renderer weggelassen.

prefigure-annotations-not-rendered = `<graph>`: Anmerkungen werden außerhalb des PreFigure-Renderers nicht dargestellt.

multiple-annotations-children = Mehrere `<annotations>`-Kinder in `<graph>` gefunden; alle außer dem letzten werden ignoriert.

## Referring to other components

copy-unrecognized-component-type = Ein unbekannter Komponententyp lässt sich nicht erweitern oder kopieren: { $type }.

copy-prop-not-found = Die Eigenschaft { $property } wurde an einer Komponente vom Typ { $component } nicht gefunden

collect-no-source = Für collect wurde keine Quelle gefunden.

collect-invalid-component-type = Komponenten vom Typ `<{ $component }>` lassen sich nicht sammeln, da dies kein gültiger Komponententyp ist.

reference-index-unavailable = Der Index `{ $reference }` lässt sich nicht referenzieren

## `<callAction>`

component-action-unavailable = { $action } lässt sich an der Komponente `{ $reference }` nicht aufrufen

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Die Daten haben eine ungültige Form. Die Zeilen haben unterschiedliche Längen. Gefunden in componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Die Daten haben doppelte Spaltennamen. Gefunden in componentIdx :{ $componentIdx }

data-frame-missing-column-name = Den Daten fehlt ein Spaltenname. Gefunden in componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Ein award dieser Antwort stützt sich auf die eingereichte Antwort des answer-Tags selbst, was zu unerwartetem Verhalten führt.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` an einem `<answer>` innerhalb eines Containers mit `sectionWideCheckWork` hat keine Wirkung, da die Zahl der Versuche vom Container gesteuert wird. Setzen Sie `maxNumAttempts` stattdessen am Container.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` an einem Container mit `sectionWideCheckWork`, der selbst in einem Container mit `sectionWideCheckWork` liegt, hat keine Wirkung, da die Zahl der Versuche vom äußeren Container gesteuert wird. Setzen Sie `maxNumAttempts` am äußeren Container.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Das Attribut { $attributes } hat ohne symbolicEquality keine Wirkung.
       *[other] Die Attribute { $attributes } haben ohne symbolicEquality keine Wirkung.
    }

answer-invalid-type = Ungültiger Typ für answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Da die Komponente `<{ $component }>` keinen Namen hat, kann sie nicht als Modulattribut dienen

module-attribute-name-already-defined = Die Komponente `<{ $component } name="{ $name }">` kann nicht als Attribut eines Moduls dienen, da der Komponententyp `<module>` bereits ein Attribut „{ $name }“ definiert.

conditional-content-condition-ignored = Das Attribut `condition` wird an einer `<conditionalContent>`-Komponente mit case- oder else-Kindern ignoriert.

slider-markers-type-mismatch = Der Typ der Markierungen passt nicht zum Typ des Schiebereglers.

pretzel-problem-needs-statement-and-answer = Ungültiges pretzel: Jedes `<problem>` muss ein `<statement>` und ein `<answer>` enthalten.

pretzel-circuit-first-problem-distractor = Ungültiges pretzel: In mode="circuit" darf das erste `<problem>` kein Distraktor sein.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Ungültiger Wert { $values } für das Attribut `{ $attribute }`; er wird ignoriert.
       *[other] Ungültige Werte { $values } für das Attribut `{ $attribute }`; sie werden ignoriert.
    }

attribute-must-be-references = Ungültiger Wert `{ $value }` für das Attribut `{ $attribute }`. Das Attribut muss aus Referenzen bestehen, die mit `$` beginnen.

math-input-invalid-function-names = <mathInput>: ungültige(r) Funktionsname(n) in { $attribute } ignoriert: { $names }. Der angezeigte Teil jedes Namens muss mindestens 2 Zeichen lang sein (Buchstaben oder Bindestriche); ein optionaler Zusatz `|<mathspeak-Alternative>` darf folgen.

## Building components from the source

component-type-invalid = Ungültiger Komponententyp: `<{ $componentType }>`

attribute-repeated = Das Attribut { $attribute } darf nicht wiederholt werden.

attribute-invalid-for-component = Ungültiges Attribut „{ $attribute }“ für eine Komponente vom Typ `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Die Stildefinition { $styleNumber } hat zu wenig Kontrast für { $context ->
        [text-on-background] die Textfarbe gegen die Hintergrundfarbe
        [high-contrast] die kontrastreiche Farbe gegen die Zeichenfläche
        [line] die Linienfarbe gegen die Zeichenfläche
        [marker] die Markierungsfarbe gegen die Zeichenfläche
       *[text-on-canvas] die Textfarbe gegen die Zeichenfläche
    }{ $mode ->
        [dark] { " (dunkler Modus)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mindestens { $threshold }:1 erforderlich).

style-definition-dark-mode-text-background-contrast =
    Die Stildefinition { $styleNumber } gibt zwar Farben an, deren Kontrast im hellen Modus ausreicht, aber die daraus abgeleiteten Farben für den dunklen Modus haben zu wenig Kontrast zwischen Text- und Hintergrundfarbe ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mindestens { $threshold }:1 erforderlich). { $suggestion ->
        [available] Erhöhen Sie für ausreichenden Kontrast im dunklen Modus entweder den Kontrast im hellen Modus (etwa { $lightAttribute }="{ $lightColor }") oder überschreiben Sie die Farbe für den dunklen Modus (etwa { $darkAttribute }="{ $darkColor }").
       *[none] Erhöhen Sie für ausreichenden Kontrast im dunklen Modus den Kontrast im hellen Modus oder überschreiben Sie die abgeleiteten Farben mit textColorDarkMode und/oder backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Die Stildefinition { $styleNumber } gibt zwar eine Textfarbe an, deren Kontrast im hellen Modus ausreicht, aber die daraus abgeleitete Textfarbe für den dunklen Modus hat zu wenig Kontrast gegen die Zeichenfläche ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mindestens { $threshold }:1 erforderlich). { $suggestion ->
        [available] Erhöhen Sie für ausreichenden Kontrast im dunklen Modus entweder den Kontrast im hellen Modus (etwa textColor="{ $lightColor }") oder überschreiben Sie die Farbe für den dunklen Modus (etwa textColorDarkMode="{ $darkColor }").
       *[none] Erhöhen Sie für ausreichenden Kontrast im dunklen Modus den Kontrast im hellen Modus oder überschreiben Sie die abgeleitete Farbe mit textColorDarkMode.
    }

section-multiple-style-palettes = Ein Abschnitt kann nur eine <stylePalette> auswählen; die letzte wird verwendet.

## Unique variants

variant-num-to-select-not-non-negative-integer = die eindeutigen Varianten von { $component } lassen sich nicht bestimmen, da numToSelect keine nichtnegative ganze Zahl ist.

variant-num-to-select-not-constant-number = die eindeutigen Varianten von { $component } lassen sich nicht bestimmen, da numToSelect keine konstante Zahl ist.

variant-with-replacement-not-constant-boolean = die eindeutigen Varianten von { $component } lassen sich nicht bestimmen, da withReplacement kein konstanter Wahrheitswert ist.

variant-select-weight-disables-unique = Eindeutige Varianten für select sind abgeschaltet, wenn eine Option selectWeight oder selectForVariants angibt

variant-coprime-undetermined = die eindeutigen Varianten von { $component } lassen sich nicht bestimmen, da sich nicht feststellen lässt, dass coprime immer falsch ist.

variant-attribute-not-constant = die eindeutigen Varianten von { $component } lassen sich nicht bestimmen, da { $attribute } keine Konstante ist.

variant-attribute-not-number = die eindeutigen Varianten von { $component } lassen sich nicht bestimmen, da { $attribute } keine Zahl ist.

variant-attribute-wrong-type-for-sequence =
    die eindeutigen Varianten von { $component } vom Typ { $type } lassen sich nicht bestimmen, da { $attribute } nicht { $expected ->
        [letters-combination] eine Buchstabenkombination
        [math-expression] ein gültiger mathematischer Ausdruck
        [integer] eine ganze Zahl
       *[number] eine Zahl
    } ist.

variant-length-not-integer = die eindeutigen Varianten von { $component } lassen sich nicht bestimmen, da length keine ganze Zahl ist.

variant-sort-not-implemented = eindeutige Varianten eines { $component } mit sort sind nicht implementiert

variant-exclude-combinations-not-implemented = eindeutige Varianten eines { $component } mit excludeCombinations sind nicht implementiert

variant-math-exclude-not-implemented = eindeutige Varianten eines { $component } vom Typ math mit exclude sind nicht implementiert

variant-non-constant-exclude-not-implemented = eindeutige Varianten eines { $component } mit nicht konstantem exclude sind nicht implementiert

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: im prefigure-Renderer des Graphen nicht unterstützt; Nachkomme übersprungen.

prefigure-descendant-invalid-geometry = { $subject }: nicht endliche oder unvollständige Geometrie; Nachkomme übersprungen.

prefigure-curve-label-omitted = { $subject }: Beschriftungen werden an konvertierten Kurvenelementen nicht unterstützt; Beschriftung weggelassen.

prefigure-curve-unsupported-definition-type = { $subject }: nicht unterstützter Kurven-Definitionstyp „{ $definitionType }“; Nachkomme übersprungen.

prefigure-region-flip-functions-unsupported = { $subject }: das Attribut flipFunctions an regionBetweenCurves wird nicht unterstützt; Nachkomme übersprungen.

prefigure-region-non-formula-child = { $subject }: an regionBetweenCurves werden nur formelartige Kindfunktionen unterstützt; Nachkomme übersprungen.

prefigure-label-position-unsupported =
    { $subject }: nicht unterstützte labelPosition „{ $labelPosition }“ für { $labelKind ->
        [line-family] eine Beschriftung der Geradenfamilie
       *[point] eine Punktbeschriftung
    }; es wird die PreFigure-Standardausrichtung verwendet.

prefigure-fill-style-unsupported = { $subject }: der Füllstil „{ $fillStyle }“ wird von PreFigure nicht unterstützt; es wird eine einfarbige Füllung verwendet.

prefigure-line-style-unknown = { $subject }: unbekannter Linienstil „{ $lineStyle }“ aus der PreFigure-Ausgabe weggelassen.

prefigure-marker-style-mapped-to-diamond = { $subject }: der Markierungsstil „{ $markerStyle }“ wird auf den PreFigure-Stil „diamond“ abgebildet.

prefigure-marker-style-unsupported = { $subject }: der Markierungsstil „{ $markerStyle }“ wird von PreFigure nicht unterstützt; es wird der Standardstil verwendet.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ungültiges `ref`; das Ziel lässt sich nicht auflösen. Anmerkung weggelassen.

annotation-ref-multiple-targets = `<annotation>`: `ref` löste sich auf mehrere Ziele auf; das erste wird verwendet.

annotation-ref-outside-graph = `<annotation>`: ungültiges `ref`; das Ziel liegt außerhalb des umgebenden Graphen. Anmerkung weggelassen.

annotation-ref-unsupported-target = `<annotation>`: ungültiges `ref`; das Ziel ist in der prefigure-Konvertierung kein unterstütztes grafisches Objekt. Anmerkung weggelassen.

annotation-text-missing = `<annotation>`: `text` fehlt oder ist leer; es wird leerer Text ausgegeben.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Zirkuläre Abhängigkeit erkannt.
       *[other] Zirkuläre Abhängigkeit erkannt, an der eine `<{ $componentType }>`-Komponente beteiligt ist.
    }

reference-no-referent = Kein Bezug für die Referenz gefunden: `{ $reference }`

reference-multiple-referents = Mehrere Bezüge für die Referenz gefunden: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ungültiges Format für das Attribut { $attribute } von `<{ $componentType }>`.

children-invalid = Ungültige Kinder für `<{ $componentType }>`: ungültige Kinder gefunden: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ungültiger Wert `{ $value }` für das Attribut `{ $attribute }`; es wird der Wert `{ $default }` verwendet

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML-Version { $version } nicht gefunden.
       *[other] DoenetML-Version { $version } nicht gefunden. Es wird auf Version { $fallback } zurückgegriffen
    }

## Reading the DoenetML

parse-invalid-doenetml = Ungültiges DoenetML: { $content }

parse-tag-missing-close-tag = Ungültiges DoenetML: Das Tag `{ $tag }` hat kein schließendes Tag. Erwartet wurde ein selbstschließendes Tag oder ein `</{ $tagName }>`-Tag.

parse-tag-error = Ungültiges DoenetML: Fehler im Tag `<{ $tagName }>`

parse-attribute-missing-value = Ungültiges DoenetML: Dem Attribut `{ $attribute }` scheint ein Wert zu fehlen.

parse-attribute-invalid = Ungültiges DoenetML: ungültiges Attribut `{ $attribute }`

parse-attribute-value-invalid = Ungültiges DoenetML: ungültiger Attributwert `{ $value }`

parse-attribute-value-quote-mismatch = Ungültiges DoenetML: ungültiger Attributwert `{ $value }`. Die Anführungszeichen passen nicht zusammen. Es scheint ein `{ $quote }` zu fehlen

parse-open-tag-name-missing = Ungültiges DoenetML: Tag ohne Tag-Namen gefunden, etwa `<`

parse-tag-not-closed = Ungültiges DoenetML: Das Tag `{ $tag }` wurde nicht geschlossen (ein `>` scheint zu fehlen).

parse-self-closing-tag-name-missing = Ungültiges DoenetML: Tag ohne Tag-Namen gefunden `<{ $content }>`

parse-self-closing-tag-not-closed = Ungültiges DoenetML: Das Tag `{ $tag }` wurde nicht geschlossen (`/>` scheint zu fehlen).

parse-tag-invalid-attributes = Ungültiges DoenetML: Das Tag `{ $tag }` ist nicht gültig. Möglicherweise hat es falsche Attribute.

parse-close-tag-name-missing = Ungültiges DoenetML: schließendes Tag ohne Tag-Namen gefunden, etwa `</`

parse-attribute-value-unquoted = Attributwerte müssen in Anführungszeichen stehen: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Ungültiges DoenetML: schließendes Tag `{ $tag }` gefunden, aber kein zugehöriges öffnendes Tag

parse-close-tag-mismatched = Ungültiges DoenetML: nicht passendes schließendes Tag. Erwartet `</{ $expected }>`. Gefunden `{ $found }`

parser-node-unconvertible = Der Knoten { $node } ließ sich nicht in einen Dast-Knoten umwandeln.

## Names

name-attribute-invalid =
    Ungültiges Attribut name='{ $name }'. { $reason ->
        [characters] Namen dürfen nur Buchstaben, Ziffern, Unterstriche oder Bindestriche enthalten.
       *[start] Namen müssen mit einem Buchstaben beginnen.
    }

component-name-invalid-start = Ungültiger Komponentenname „{ $name }“. Namen müssen mit einem Buchstaben beginnen.

## `<answer>` sugar

answer-video-watched-missing-video = Ein answer vom Typ videoWatched muss ein video-Attribut haben

answer-video-watched-video-not-reference = Ein answer vom Typ videoWatched muss ein video-Attribut haben, das eine Referenz ist

answer-name-not-single-text = Das name-Attribut eines answer muss genau ein Textkind haben

## Referencing another document

external-doenetml-recursion-limit = Externes DoenetML ließ sich wegen zu vieler Rekursionsebenen nicht abrufen. Gibt es eine zirkuläre Referenz?

external-doenetml-unavailable = DoenetML ließ sich nicht von { $attribute }="{ $uri }" abrufen

external-doenetml-type-mismatch = Ungültiges DoenetML von { $attribute }="{ $uri }" abgerufen: Es passte nicht zum Komponententyp „{ $componentType }“

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Das Attribut `{ $from }` ist veraltet; verwenden Sie stattdessen `{ $to }`.
       *[other] [deprecation] Das Attribut `{ $from }` an `<{ $component }>` ist veraltet; verwenden Sie stattdessen `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Das Attribut `{ $from }` ist veraltet und wird ignoriert, da auch `{ $to }` angegeben ist.
       *[other] [deprecation] Das Attribut `{ $from }` an `<{ $component }>` ist veraltet und wird ignoriert, da auch `{ $to }` angegeben ist.
    }

deprecated-attribute-ignored = [deprecation] Das Attribut `{ $attribute }` an `<{ $component }>` ist veraltet und wird ignoriert.


## Language coverage

pluralize-english-only = `<pluralize>` kann nur Englisch in den Plural setzen; in einem Dokument in { $locale } bleibt der Text daher unverändert. Schreiben Sie die Pluralform direkt, oder geben Sie sie mit dem Attribut `pluralForm` an.


## Checking against the schema

schema-element-unrecognized = Das Element `<{ $tag }>` ist kein bekanntes Doenet-Element.

schema-element-not-allowed-at-root = Das Element `<{ $tag }>` ist an der Wurzel des Dokuments nicht erlaubt.

schema-element-not-allowed-inside = Das Element `<{ $tag }>` ist innerhalb von `<{ $parent }>` nicht erlaubt.

schema-attribute-unrecognized = Das Element `<{ $tag }>` hat kein Attribut namens `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Das Attribut `{ $attribute }` des Elements `<{ $tag }>` muss eine Liste sein, deren Einträge jeweils eines von Folgendem sind: { $allowed }
       *[other] Das Attribut `{ $attribute }` des Elements `<{ $tag }>` muss eines von Folgendem sein: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Ungültiger Variantenname für select. Der Variantenname { $variantName } kommt in { $numOptions } Optionen vor, ausgewählt werden sollen aber { $numToSelect }.

select-variant-name-without-options = Für select sind Varianten angegeben, aber für den möglichen Variantennamen { $variantName } keine Optionen.

select-variant-name-not-possible = Der für select angegebene Variantenname { $variantName } ist kein möglicher Variantenname.

select-too-few-options = { $numToSelect } Komponenten lassen sich nicht aus nur { $numOptions } auswählen.

select-from-sequence-too-few-values = { $numToSelect } Werte lassen sich nicht aus einer Folge der Länge { $length } auswählen.

select-from-sequence-indices-count-mismatch = Die Zahl der für select angegebenen Indizes muss der Zahl der auszuwählenden Elemente entsprechen

select-from-sequence-indices-not-integers = Alle für select angegebenen Indizes müssen ganze Zahlen sein

select-from-sequence-index-excluded = Ein angegebener Index von selectfromsequence war ausgeschlossen

select-from-sequence-indices-excluded-combination = Die angegebenen Indizes von selectfromsequence bildeten eine ausgeschlossene Kombination

select-from-sequence-coprime-not-positive-integers = Teilerfremde Kombinationen lassen sich nicht auswählen, da keine positiven ganzen Zahlen ausgewählt werden.

select-from-sequence-coprime-common-factor = Teilerfremde Zahlen lassen sich nicht auswählen. Alle möglichen Werte haben einen gemeinsamen Faktor. (Die angegebenen Werte von "from" oder "to" müssen zu "step" teilerfremd sein.)

select-from-sequence-coprime-single-number = Teilerfremde Kombinationen lassen sich nicht aus einer einzigen Zahl auswählen, die nicht 1 ist.

select-from-sequence-excluded-too-many-combinations = Über 70 % der Kombinationen wurden in selectFromSequence ausgeschlossen

select-from-sequence-coprime-none-found = Teilerfremde Zahlen ließen sich nicht auswählen. Alle möglichen Werte haben einen gemeinsamen Faktor.

select-from-sequence-too-few-unique-values = { $numToSelect } verschiedene Werte lassen sich nicht aus einer Folge der Länge { $numPossibleValues } auswählen

select-prime-numbers-too-few-values = { $numToSelect } Werte lassen sich nicht aus einer Primzahlliste der Länge { $numValues } auswählen

select-prime-numbers-values-count-mismatch = Die Zahl der für select angegebenen Werte muss der Zahl der auszuwählenden Elemente entsprechen

select-prime-numbers-values-not-prime = Alle für select prime number angegebenen Werte müssen in der Primzahlliste stehen

select-prime-numbers-values-excluded-combination = Die angegebenen Werte von selectPrimeNumbers bildeten eine ausgeschlossene Kombination

select-prime-numbers-excluded-too-many-combinations = Über 70 % der Kombinationen wurden in selectPrimeNumbers ausgeschlossen

select-random-combination-fluke = Durch einen äußerst unwahrscheinlichen Zufall ließ sich keine Kombination zufälliger Werte auswählen

select-random-value-fluke = Durch einen äußerst unwahrscheinlichen Zufall ließ sich kein Zufallswert auswählen
