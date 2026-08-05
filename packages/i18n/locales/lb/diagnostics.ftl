# Luxembourgish diagnostics. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
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
# Where English separates a singular from a plural only in the verb — "is
# ignored" against "are ignored" — Luxembourgish changes the verb too, so those
# selects are kept rather than collapsed.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } gëtt ignoréiert, wa béid Endpunkte uginn sinn
       *[other] { $attributes } ginn ignoréiert, wa béid Endpunkte uginn sinn
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } gëtt ignoréiert, wann en Endpunkt an e Mëttelpunkt zesummen uginn sinn
       *[other] { $attributes } ginn ignoréiert, wann en Endpunkt an e Mëttelpunkt zesummen uginn sinn
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset huet keng Wierkung ouni Mëttelpunkt

## `<line>`

line-points-undetermined-dimensions = Linn duerch Punkte mat onbestëmmten Dimensiounen.

line-points-too-few-dimensions = D'Linn muss duerch Punkte vu mindestens zwou Dimensioune goen.

line-points-depend-on-variables = D'Linn geet duerch Punkten, déi vu Variablen ofhänken: { $variables }.

line-equation-invalid-format = Ongëltegt Format fir d'Gleichung vun enger Linn an de Variablen { $variable1 } an { $variable2 }.

## `<ray>`

ray-overprescribed-through = De Strahl ass duerch through, endpoint an direction festgeluecht. Dat uginnent through gëtt ignoréiert.

ray-dimension-mismatch = numDimensions passt net am ray.

## `<vector>`

vector-overprescribed-head = De Vektor ass duerch head, tail an displacement festgeluecht. Dat uginnent head gëtt ignoréiert.

vector-dimension-mismatch = numDimensions passt net am vector.

## Attracting and constraining

attract-to-without-nearest-point = Et kann net op e `<{ $component }>` ugezunn ginn, well en keng nearestPoint-Zoustandsvariabel huet.

constrain-to-without-nearest-point = Et kann net op e `<{ $component }>` agegrenzt ginn, well en keng nearestPoint-Zoustandsvariabel huet.

constrain-to-interior-without-nearest-point = Et kann net op d'Bannescht vun engem `<{ $component }>` agegrenzt ginn, well en keng nearestPoint-Zoustandsvariabel huet.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition gëtt bei engem choiceInput ignoréiert, deen net inline ass

## Ordering children by index

choice-input-indices-count-mismatch = D'Indexen, déi fir choiceInput uginn sinn, ginn ignoréiert, well d'Zuel vun den Indexen net der Zuel vun de choice-Kanner entsprécht.

pretzel-indices-count-mismatch = D'Indexen, déi fir problem uginn sinn, ginn ignoréiert, well d'Zuel vun den Indexen net der Zuel vun de problem-Kanner entsprécht.

shuffle-indices-count-mismatch = D'Indexen, déi fir shuffle uginn sinn, ginn ignoréiert, well d'Zuel vun den Indexen net der Zuel vun de Komponenten entsprécht.

indices-ignored-out-of-range = D'Indexen, déi fir { $component } uginn sinn, ginn ignoréiert, well e puer Indexen ausserhalb vum Beräich leien.

pretzel-indices-repeated = D'Indexen, déi fir pretzel uginn sinn, ginn ignoréiert, well e puer Indexe widderholl ginn.

pretzel-circuit-first-index = D'Indexen, déi fir pretzel am Modus circuit uginn sinn, ginn ignoréiert, well den éischten Index 1 muss sinn.

## `<shuffle>` and `<sort>`

string-children-need-type = Fir datt `<{ $component }>` mat Text-Kanner funktionéiert, muss en Attribut `type` uginn sinn.

invalid-type-defaulting-to-math = Ongëltegen type { $type } fir d'Komponent { $component }. Et muss math, text, number oder boolean sinn. Et gëtt op math gesat.

string-not-valid-component-to-arrange = Den Text "{ $value }" ass keng gëlteg Komponent fir { $component }. Gëtt ignoréiert.

## Types and variables

invalid-type-defaulting-to-number = Ongëltegen type { $type }, type gëtt op number gesat.

invalid-variable-value = Ongëltege Wäert vun enger Variabel: `{ $value }`

## Variants

variant-index-must-be-number = De Variantindex { $index } muss eng Zuel sinn

variant-index-must-be-integer = De Variantindex { $index } muss eng ganz Zuel sinn

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ass net fir absolut Moossen ëmgesat. D'Breede ginn op relativ gesat.

side-by-side-absolute-margins = `<{ $component }>` ass net fir absolut Moossen ëmgesat. D'Ränner ginn op relativ gesat.

side-by-side-no-block-child = Ongëltegen `<{ $component }>`: en muss mindestens ee Block-Kand hunn.

## `<label>`

label-for-ignored-on-graphical = D'Attribut `for` op engem grafeschen `<label>` gëtt ignoréiert.

label-for-must-resolve-to-one = D'Attribut `for` op `<label>` muss op genee eng Komponent verweisen.

label-for-unresolved = D'Attribut `for` op `<label>` konnt op keng Komponent opgeléist ginn.

label-for-answer-with-authored-inputs = D'Attribut `for` op `<label>` verweist op en `<answer>` mat ausdrécklech geschriwwenen Aginnfelder; verweist besser direkt op d'Feld.

label-for-answer-without-input = D'Attribut `for` op `<label>` verweist op en `<answer>` ouni Aginnfeld, dat bezeechent kéint ginn.

label-for-must-reference-input-or-answer = D'Attribut `for` op `<label>` muss op en Aginnfeld oder op en answer verweisen.

## Accessibility

accessibility-short-description-or-decorative = Fir d'Accessibilitéit muss `<{ $component }>` eng kuerz Beschreiwung hunn oder als dekorativ uginn sinn.

accessibility-video-short-description = Fir d'Accessibilitéit muss `<video>` eng kuerz Beschreiwung hunn.

accessibility-input-short-description-or-label = Fir d'Accessibilitéit muss `<{ $component }>` eng kuerz Beschreiwung oder eng Bezeechnung hunn.

accessibility-answer-input-short-description-or-label = Fir d'Accessibilitéit muss en `<answer>`, deen en Aginnfeld erstellt, eng kuerz Beschreiwung oder eng Bezeechnung hunn.

accessibility-short-description-contains-math = Kuerz Beschreiwunge sollte keng mathematesch Komponente wéi `<{ $component }>` enthalen. Schreift d'Mathematik mat Wierder aus.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } huet net genuch Kontrast fir den Text vun der Iwwerschrëft (donkele Modus) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; néideg sinn op mannst { $threshold }:1).
       *[other] { $colorName } huet net genuch Kontrast fir den Text vun der Iwwerschrëft ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; néideg sinn op mannst { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = E `<circle>` duerch { $count } Punkten ass net ëmgesat, wann d'Punkte keng numeresch Wäerter hunn.

circle-too-many-through-points = E Krees duerch méi wéi 3 Punkte kann net berechent ginn.

circle-overprescribed-radius-center-points = E Krees mat uginnenem Radius, Mëttelpunkt an Duerchgangspunkte kann net berechent ginn.

circle-center-with-multiple-points = E Krees mat uginnenem Mëttelpunkt duerch méi wéi 1 Punkt kann net berechent ginn.

circle-radius-too-small = De Krees kann net berechent ginn: well den Ofstand tëscht deenen zwee Punkten { $distance } ass, ass den uginnene Radius { $radius } ze kleng.

circle-radius-with-many-points = E Krees duerch méi wéi zwee Punkte mat engem uginnene Radius kann net erstallt ginn.

circle-invalid-center-or-through-points = Ongëltege Mëttelpunkt oder ongëlteg Duerchgangspunkte vum Krees.

circle-radius-center-with-multiple-points = De Radius vun engem Krees mat uginnenem Mëttelpunkt duerch méi wéi 1 Punkt kann net berechent ginn.

circle-change-radius-non-numerical = De Radius vun engem Krees mat net-numeresche Punkte kann net geännert ginn

circle-radius-with-points-non-numerical = E Krees duerch méi wéi ee Punkt mat engem uginnene Radius kann net erstallt ginn, wann d'Wäerter net numeresch sinn.

circle-change-center-non-numerical = D'Änneren vum Mëttelpunkt vun engem Krees duerch Punkte mat net-numeresche Wäerter ass net ëmgesat.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Net genuch Dimensioune fir den Definitiounsberäich vun der Funktioun. De Beräich huet { $intervals } Intervall, mä d'Funktioun huet { $inputs ->
            [one] { $inputs } Aginn
           *[other] { $inputs } Aginnen
        }.
       *[other] Net genuch Dimensioune fir den Definitiounsberäich vun der Funktioun. De Beräich huet { $intervals } Intervaller, mä d'Funktioun huet { $inputs ->
            [one] { $inputs } Aginn
           *[other] { $inputs } Aginnen
        }.
    }

function-domain-invalid-format = Ongëltegt Format fir den Definitiounsberäich vun der Funktioun.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Dat net-numerescht Maximum vun der Funktioun gëtt ignoréiert.
        [minimum] Dat net-numerescht Minimum vun der Funktioun gëtt ignoréiert.
        [extremum] Dat net-numerescht Extremum vun der Funktioun gëtt ignoréiert.
        [point] Deen net-numeresche Punkt vun der Funktioun gëtt ignoréiert.
        [slope] Déi net-numeresch Steigung vun der Funktioun gëtt ignoréiert.
       *[other] Dat net-numerescht { $type } vun der Funktioun gëtt ignoréiert.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Dat eidelt Maximum vun der Funktioun gëtt ignoréiert.
        [minimum] Dat eidelt Minimum vun der Funktioun gëtt ignoréiert.
        [extremum] Dat eidelt Extremum vun der Funktioun gëtt ignoréiert.
        [point] Deen eidele Punkt vun der Funktioun gëtt ignoréiert.
       *[other] Dat eidelt { $type } vun der Funktioun gëtt ignoréiert.
    }

function-points-too-close = D'Funktioun enthält zwee Punkten, déi ze no beienee leien. D'Funktioun kann net definéiert ginn.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Iteratioune vun enger Funktioun si just méiglech, wann d'Zuel vun den Aginnen der Zuel vun den Ausginnen entsprécht. Dës Funktioun huet { $inputs } Aginn an { $outputs ->
            [one] { $outputs } Ausginn
           *[other] { $outputs } Ausginnen
        }.
       *[other] Iteratioune vun enger Funktioun si just méiglech, wann d'Zuel vun den Aginnen der Zuel vun den Ausginnen entsprécht. Dës Funktioun huet { $inputs } Aginnen an { $outputs ->
            [one] { $outputs } Ausginn
           *[other] { $outputs } Ausginnen
        }.
    }

## `<sequence>`

sequence-invalid-length = Ongëlteg Längt vun der Sequenz. Muss eng net-negativ ganz Zuel sinn.

sequence-invalid-step = Ongëltege Schrëtt vun der Sequenz. Muss eng Zuel si fir eng Sequenz vum Typ { $type }.

sequence-invalid-endpoint-number = Ongëltegen "{ $attribute }" vun enger Zuelesequenz. Muss eng Zuel sinn.

sequence-invalid-endpoint-letters = Ongëltegen "{ $attribute }" vun enger Buschtawesequenz. Muss eng Kombinatioun vu Buschtawe sinn.

sequence-invalid-endpoint = Ongëltegen "{ $attribute }" vun der Sequenz.

select-from-sequence-coprime-not-numbers = coprime gëtt ignoréiert, well keng Zuele geholl ginn

select-from-sequence-coprime-with-exclude-combinations = coprime gëtt ignoréiert, well excludeCombinations uginn ass

## Resolving a `target`

target-not-found = Ongëltegen target fir `<{ $source }>`: d'Zil gëtt net fonnt.

target-state-variable-not-found = Ongëltegen target fir `<{ $source }>`: et gëtt keng Zoustandsvariabel mam Numm "{ $property }" op engem `<{ $component }>` fonnt.

## `<odeSystem>`

ode-system-variables-match-independent = D'Variable vun `<odeSystem>` musse sech vun der onofhängeger Variabel ënnerscheeden.

ode-system-duplicate-variable-names = D'RHS-Funktioune vun der ODE kënne net mat widderhuelten Nimm vun ofhängege Variablen definéiert ginn.

ode-system-rhs-function-error = D'RHS-Funktioun vun der ODE kann net definéiert ginn. Feeler beim Erstelle vun der mathjs-Funktioun.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = E Wénkel tëscht { $count } Linne kann net definéiert ginn

angle-invalid-through-point = Ongëltege Punkt am through vun `<angle>`

parabola-vertex-too-many-points = Eng Parabel mat Scheitelpunkt duerch méi wéi 1 Punkt ass net ëmgesat.

parabola-too-many-points = Eng Parabel duerch méi wéi 3 Punkten ass net ëmgesat.

intersection-too-many-items = En Duerchschnëtt vu méi wéi zwee Objeten ass net ëmgesat

## Other math components

ionic-compound-not-two-ions = Eng ionesch Verbindung ass just fir zwee Ionen ëmgesat.

ionic-compound-needs-cation-and-anion = Eng ionesch Verbindung ass just fir ee Kation an een Anion ëmgesat.

solve-equations-cannot-evaluate = D'Gleichung kann net geléist ginn, well se net ausgewäert konnt ginn: { $equation }

math-operators-operand-number-required = Beim Erausléise vun engem mathemateschen Operand muss en operandNumber uginn sinn.

eigen-decomposition-failed = D'Eegewäerter vun der Matrix konnten net berechent ginn

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: de Parameter { $parameters } kënnt am Muster net vir, dofir passt en ëmmer op eppes Eidelt.
       *[other] `<matchesPattern>`: d'Parameter { $parameters } kommen am Muster net vir, dofir passe se ëmmer op eppes Eidelt.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" kann net interpretéiert ginn. Et muss none, medium, dense oder zwou positiv Zuelen, duerch e Espace getrennt, sinn, zum Beispill grid="1 0.5". Et gëtt keng Grid gezeechent.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" gëtt am prefigure-Renderer net ënnerstëtzt; d'Verhale vun der rietser Positioun gëtt benotzt.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" gëtt am prefigure-Renderer net ënnerstëtzt; d'Verhale vun der uewerer Positioun gëtt benotzt.

prefigure-invalid-axis-bounds = `<graph>`: ongëlteg Achsegrenze fir d'Ëmwandlung a prefigure; d'Standard-bbox (-10,-10,10,10) gëtt benotzt.

prefigure-invalid-width = `<graph>`: ongëlteg Breet fir d'Ëmwandlung a prefigure; d'Standardbreet 425 gëtt benotzt.

prefigure-invalid-aspect-ratio = `<graph>`: ongëltegen aspectRatio fir d'Ëmwandlung a prefigure; d'Standardverhältnis 1 gëtt benotzt.

prefigure-grid-spacing-too-fine = `<graph>`: den Ofstand vun der Grid ass ze fein fir d'Achsegrenzen; d'Grid gëtt am prefigure-Renderer ewechgelooss.

prefigure-annotations-not-rendered = `<graph>`: Annotatioune ginn net ugewisen, wann de PreFigure-Renderer net benotzt gëtt.

multiple-annotations-children = Méi wéi ee `<annotations>`-Kand am `<graph>` fonnt; all bis op dat lescht ginn ignoréiert.

## Referring to other components

copy-unrecognized-component-type = En onbekannte Komponenttyp kann net erweidert oder kopéiert ginn: { $type }.

copy-prop-not-found = D'Eegeschaft { $property } gouf op enger Komponent vum Typ { $component } net fonnt

collect-no-source = Keng Quell fir collect fonnt.

collect-invalid-component-type = Komponente vum Typ `<{ $component }>` kënnen net gesammelt ginn, well dat en ongëltege Komponenttyp ass.

reference-index-unavailable = Op den Index `{ $reference }` kann net verwise ginn

## `<callAction>`

component-action-unavailable = { $action } kann op der Komponent `{ $reference }` net opgeruff ginn

## `<dataFrame>`

data-frame-inconsistent-row-lengths = D'Donnéeën hunn eng ongëlteg Form. D'Zeilen hunn ënnerschiddlech Längten. Fonnt am componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = D'Donnéeën hu widderhuelte Kolonnennimm. Fonnt am componentIdx :{ $componentIdx }

data-frame-missing-column-name = Den Donnéeë feelt e Kolonnennumm. Fonnt am componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = En award fir dës Äntwert baséiert op der eegener geschéckter Äntwert vum answer-Tag, wat zu onerwaartem Verhale féiert.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` op engem `<answer>` bannent engem Container mat `sectionWideCheckWork` ze setzen huet keng Wierkung, well d'Zuel vun de Versich vum Container gesteiert gëtt. Setzt `maxNumAttempts` amplaz um Container.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` op engem Container mat `sectionWideCheckWork` ze setzen, deen a engem anere Container mat `sectionWideCheckWork` läit, huet keng Wierkung, well d'Zuel vun de Versich vum baussenzege Container gesteiert gëtt. Setzt `maxNumAttempts` um baussenzege Container.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] D'Attribut { $attributes } huet ouni symbolicEquality keng Wierkung.
       *[other] D'Attributer { $attributes } hunn ouni symbolicEquality keng Wierkung.
    }

answer-invalid-type = Ongëltegen Typ fir d'Äntwert: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Well d'Komponent `<{ $component }>` keen Numm huet, kann se net als Attribut vun engem Modul benotzt ginn

module-attribute-name-already-defined = D'Komponent `<{ $component } name="{ $name }">` kann net als Attribut vun engem Modul benotzt ginn, well de Komponenttyp `<module>` schonn en Attribut "{ $name }" definéiert huet.

conditional-content-condition-ignored = D'Attribut `condition` gëtt op enger `<conditionalContent>`-Komponent mat case- oder else-Kanner ignoréiert.

slider-markers-type-mismatch = Den Typ vun de Marker passt net zum Typ vum Schieber.

pretzel-problem-needs-statement-and-answer = Ongëltege pretzel: all `<problem>` muss ee `<statement>` an een `<answer>` enthalen.

pretzel-circuit-first-problem-distractor = Ongëltege pretzel: am mode="circuit" kann deen éischte `<problem>` keen Ofleeder sinn.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Ongëltege Wäert { $values } fir d'Attribut `{ $attribute }`; gëtt ignoréiert.
       *[other] Ongëlteg Wäerter { $values } fir d'Attribut `{ $attribute }`; ginn ignoréiert.
    }

attribute-must-be-references = Ongëltege Wäert `{ $value }` fir d'Attribut `{ $attribute }`. D'Attribut muss aus Referenze bestoen, déi mat engem `$` ufänken.

math-input-invalid-function-names = <mathInput>: ongëlteg Funktiounsnimm am { $attribute } goufen ignoréiert: { $names }. Den Uweisdeel vun all Numm muss op mannst 2 Zeeche laang sinn (Buschtawen oder Bindestrécher); duerno kann e fakultative Suffix `|<mathspeak Alternativ>` kommen.

## Building components from the source

component-type-invalid = Ongëltege Komponenttyp: `<{ $componentType }>`

attribute-repeated = D'Attribut { $attribute } kann net widderholl ginn.

attribute-invalid-for-component = Ongëltegt Attribut "{ $attribute }" fir eng Komponent vum Typ `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    D'Stildefinitioun { $styleNumber } huet net genuch Kontrast fir { $context ->
        [text-on-background] d'Textfaarf géint d'Hannergrondfaarf
        [high-contrast] d'kontrastreich Faarf géint d'Zeechefläch
        [line] d'Linnefaarf géint d'Zeechefläch
        [marker] d'Markerfaarf géint d'Zeechefläch
       *[text-on-canvas] d'Textfaarf géint d'Zeechefläch
    }{ $mode ->
        [dark] { " (donkele Modus)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; néideg sinn op mannst { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Och wann d'Stildefinitioun { $styleNumber } Faarwen uginn huet, déi am hellen Modus genuch Kontrast bidden, hunn déi doraus ofgeleete Faarwe fir den donkele Modus net genuch Kontrast vun der Textfaarf géint d'Hannergrondfaarf ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; néideg sinn op mannst { $threshold }:1). { $suggestion ->
        [available] Fir am donkele Modus genuch Kontrast ze sécheren, erhéicht entweder de Kontrast am hellen Modus (z. B. setzt { $lightAttribute }="{ $lightColor }") oder iwwerschreift d'Faarf fir den donkele Modus (z. B. setzt { $darkAttribute }="{ $darkColor }").
       *[none] Fir am donkele Modus genuch Kontrast ze sécheren, erhéicht de Kontrast am hellen Modus oder iwwerschreift déi ofgeleete Faarwe mat textColorDarkMode an/oder backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Och wann d'Stildefinitioun { $styleNumber } eng Textfaarf uginn huet, déi am hellen Modus genuch Kontrast bitt, huet déi doraus ofgeleeten Textfaarf fir den donkele Modus net genuch Kontrast géint d'Zeechefläch ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; néideg sinn op mannst { $threshold }:1). { $suggestion ->
        [available] Fir am donkele Modus genuch Kontrast ze sécheren, erhéicht entweder de Kontrast am hellen Modus (z. B. setzt textColor="{ $lightColor }") oder iwwerschreift d'Faarf fir den donkele Modus (z. B. setzt textColorDarkMode="{ $darkColor }").
       *[none] Fir am donkele Modus genuch Kontrast ze sécheren, erhéicht de Kontrast am hellen Modus oder iwwerschreift déi ofgeleete Faarf mat textColorDarkMode.
    }

section-multiple-style-palettes = E Kapitel kann just ee <stylePalette> auswielen; dee leschte gëtt benotzt.

## Unique variants

variant-num-to-select-not-non-negative-integer = déi eenzegaarteg Variante vu { $component } kënnen net bestëmmt ginn, well numToSelect keng net-negativ ganz Zuel ass.

variant-num-to-select-not-constant-number = déi eenzegaarteg Variante vu { $component } kënnen net bestëmmt ginn, well numToSelect keng konstant Zuel ass.

variant-with-replacement-not-constant-boolean = déi eenzegaarteg Variante vu { $component } kënnen net bestëmmt ginn, well withReplacement kee konstante boolean ass.

variant-select-weight-disables-unique = Eenzegaarteg Variante fir select sinn ausgeschalt, wann eng Optioun e selectWeight oder selectForVariants uginn huet

variant-coprime-undetermined = déi eenzegaarteg Variante vu { $component } kënnen net bestëmmt ginn, well net festgestallt ka ginn, datt coprime ëmmer falsch ass.

variant-attribute-not-constant = déi eenzegaarteg Variante vu { $component } kënnen net bestëmmt ginn, well { $attribute } net konstant ass.

variant-attribute-not-number = déi eenzegaarteg Variante vu { $component } kënnen net bestëmmt ginn, well { $attribute } keng Zuel ass.

variant-attribute-wrong-type-for-sequence =
    déi eenzegaarteg Variante vu { $component } vum Typ { $type } kënnen net bestëmmt ginn, well { $attribute } net { $expected ->
        [letters-combination] eng Kombinatioun vu Buschtawen
        [math-expression] e gëltege mathemateschen Ausdrock
        [integer] eng ganz Zuel
       *[number] eng Zuel
    } ass.

variant-length-not-integer = déi eenzegaarteg Variante vu { $component } kënnen net bestëmmt ginn, well length keng ganz Zuel ass.

variant-sort-not-implemented = eenzegaarteg Variante vun engem { $component } mat sort sinn net ëmgesat

variant-exclude-combinations-not-implemented = eenzegaarteg Variante vun engem { $component } mat excludeCombinations sinn net ëmgesat

variant-math-exclude-not-implemented = eenzegaarteg Variante vun engem { $component } vum Typ math mat exclude sinn net ëmgesat

variant-non-constant-exclude-not-implemented = eenzegaarteg Variante vun engem { $component } mat engem net-konstanten exclude sinn net ëmgesat

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: gëtt am prefigure-Renderer vum Graf net ënnerstëtzt; den Nokomm gëtt iwwersprongen.

prefigure-descendant-invalid-geometry = { $subject }: net-endlech oder onvollstänneg Geometrie; den Nokomm gëtt iwwersprongen.

prefigure-curve-label-omitted = { $subject }: Bezeechnunge ginn op ëmgewandelte Kurvelementer net ënnerstëtzt; d'Bezeechnung gëtt ewechgelooss.

prefigure-curve-unsupported-definition-type = { $subject }: net ënnerstëtzten Typ vu Kurvefunktiounsdefinitioun '{ $definitionType }'; den Nokomm gëtt iwwersprongen.

prefigure-region-flip-functions-unsupported = { $subject }: net ënnerstëtzt Attribut flipFunctions op regionBetweenCurves; den Nokomm gëtt iwwersprongen.

prefigure-region-non-formula-child = { $subject }: op regionBetweenCurves gi just Kandfunktiounen ënnerstëtzt, déi duerch eng Formel definéiert sinn; den Nokomm gëtt iwwersprongen.

prefigure-label-position-unsupported =
    { $subject }: net ënnerstëtzten labelPosition '{ $labelPosition }' fir { $labelKind ->
        [line-family] eng Bezeechnung aus der Linnefamill
       *[point] eng Punktbezeechnung
    }; d'Standardausriichtung vu PreFigure gëtt benotzt.

prefigure-fill-style-unsupported = { $subject }: de Fëllstil '{ $fillStyle }' gëtt vu PreFigure net ënnerstëtzt; et gëtt op eng voll Fëllung zeréckgegraff.

prefigure-line-style-unknown = { $subject }: onbekannte Linnestil '{ $lineStyle }' gouf aus der PreFigure-Ausgab ewechgelooss.

prefigure-marker-style-mapped-to-diamond = { $subject }: de Markerstil '{ $markerStyle }' gouf op de PreFigure-Stil 'diamond' ofgebilt.

prefigure-marker-style-unsupported = { $subject }: de Markerstil '{ $markerStyle }' gëtt vu PreFigure net ënnerstëtzt; de Standardstil gëtt benotzt.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ongëltege `ref`; d'Zil kann net opgeléist ginn. D'Annotatioun gëtt ewechgelooss.

annotation-ref-multiple-targets = `<annotation>`: `ref` gouf op méi Ziler opgeléist; dat éischt Zil gëtt benotzt.

annotation-ref-outside-graph = `<annotation>`: ongëltege `ref`; d'Zil läit ausserhalb vum ëmginnende Graf. D'Annotatioun gëtt ewechgelooss.

annotation-ref-unsupported-target = `<annotation>`: ongëltege `ref`; d'Zil ass kee grafeschen Objet, deen an der prefigure-Ëmwandlung ënnerstëtzt gëtt. D'Annotatioun gëtt ewechgelooss.

annotation-text-missing = `<annotation>`: `text` feelt oder ass eidel; et gëtt en eidelen Text ausginn.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Eng zirkulär Ofhängegkeet gouf entdeckt.
       *[other] Eng zirkulär Ofhängegkeet mat enger `<{ $componentType }>`-Komponent gouf entdeckt.
    }

reference-no-referent = Keen Objet fir d'Referenz fonnt: `{ $reference }`

reference-multiple-referents = Méi wéi een Objet fir d'Referenz fonnt: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ongëltegt Format fir d'Attribut { $attribute } vu `<{ $componentType }>`.

children-invalid = Ongëlteg Kanner fir `<{ $componentType }>`: ongëlteg Kanner fonnt: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ongëltege Wäert `{ $value }` fir d'Attribut `{ $attribute }`, de Wäert `{ $default }` gëtt benotzt

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] D'DoenetML-Versioun { $version } gouf net fonnt.
       *[other] D'DoenetML-Versioun { $version } gouf net fonnt. Et gëtt op d'Versioun { $fallback } zeréckgegraff
    }

## Reading the DoenetML

parse-invalid-doenetml = Ongëltegen DoenetML: { $content }

parse-tag-missing-close-tag = Ongëltegen DoenetML: den Tag `{ $tag }` huet kee schléissenden Tag. Erwaart gouf e selbstschléissenden Tag oder en `</{ $tagName }>`-Tag.

parse-tag-error = Ongëltegen DoenetML: Feeler am Tag `<{ $tagName }>`

parse-attribute-missing-value = Ongëltegen DoenetML: dem ongëltegen Attribut `{ $attribute }` schéngt e Wäert ze feelen.

parse-attribute-invalid = Ongëltegen DoenetML: ongëltegt Attribut `{ $attribute }`

parse-attribute-value-invalid = Ongëltegen DoenetML: ongëltegen Attributwäert `{ $value }`

parse-attribute-value-quote-mismatch = Ongëltegen DoenetML: ongëltegen Attributwäert `{ $value }`. D'Ureféierungszeeche passen net zesummen. Et schéngt e `{ $quote }` ze feelen

parse-open-tag-name-missing = Ongëltegen DoenetML: en Tag ouni Numm fonnt, z. B. `<`

parse-tag-not-closed = Ongëltegen DoenetML: den Tag `{ $tag }` gouf net zougemaach (et schéngt e `>` ze feelen).

parse-self-closing-tag-name-missing = Ongëltegen DoenetML: en Tag ouni Numm fonnt `<{ $content }>`

parse-self-closing-tag-not-closed = Ongëltegen DoenetML: den Tag `{ $tag }` gouf net zougemaach (et schéngt `/>` ze feelen).

parse-tag-invalid-attributes = Ongëltegen DoenetML: den Tag `{ $tag }` ass net gëlteg. En huet villäicht falsch Attributer.

parse-close-tag-name-missing = Ongëltegen DoenetML: e schléissenden Tag ouni Numm fonnt, z. B. `</`

parse-attribute-value-unquoted = Attributwäerter mussen an Ureféierungszeeche stoen: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Ongëltegen DoenetML: schléissenden Tag `{ $tag }` fonnt, mä keen entspriechenden opmaachenden Tag

parse-close-tag-mismatched = Ongëltegen DoenetML: schléissenden Tag passt net. Erwaart gouf `</{ $expected }>`. Fonnt `{ $found }`

parser-node-unconvertible = De Knuet { $node } konnt net an e Dast-Knuet ëmgewandelt ginn.

## Names

name-attribute-invalid =
    Ongëltegen Attributnumm name='{ $name }'. { $reason ->
        [characters] Nimm dierfe just Buschtawen, Zuelen, Ënnerstrécher oder Bindestrécher enthalen.
       *[start] Nimm mussen mat engem Buschtaf ufänken.
    }

component-name-invalid-start = Ongëltege Komponentnumm "{ $name }". Nimm mussen mat engem Buschtaf ufänken.

## `<answer>` sugar

answer-video-watched-missing-video = En answer vum Typ videoWatched muss en Attribut video hunn

answer-video-watched-video-not-reference = En answer vum Typ videoWatched muss en Attribut video hunn, dat eng Referenz ass

answer-name-not-single-text = D'Attribut name vun engem answer muss ee eenzegt Text-Kand hunn

## Referencing another document

external-doenetml-recursion-limit = Den externen DoenetML kann net gelueden ginn, well et ze vill Rekursiounsniveaue gëtt. Gëtt et eng zirkulär Referenz?

external-doenetml-unavailable = Et kann kee DoenetML vu { $attribute }="{ $uri }" gelueden ginn

external-doenetml-type-mismatch = Ongëltegen DoenetML vu { $attribute }="{ $uri }" gelueden: en huet net zum Komponenttyp "{ $componentType }" gepasst

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] D'Attribut `{ $from }` ass veralt; benotzt amplaz `{ $to }`.
       *[other] [deprecation] D'Attribut `{ $from }` op `<{ $component }>` ass veralt; benotzt amplaz `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] D'Attribut `{ $from }` ass veralt a gëtt ignoréiert, well och `{ $to }` uginn ass.
       *[other] [deprecation] D'Attribut `{ $from }` op `<{ $component }>` ass veralt a gëtt ignoréiert, well och `{ $to }` uginn ass.
    }

deprecated-attribute-ignored = [deprecation] D'Attribut `{ $attribute }` op `<{ $component }>` ass veralt a gëtt ignoréiert.

deprecated-attribute-to-child = [deprecation] D'Attribut `{ $attribute }` op `<{ $component }>` ass veralt; benotzt amplaz e `<{ $child }>`-Kand.

deprecated-attribute-value-renamed = [deprecation] De Wäert `{ $value }` vum Attribut `{ $attribute }` op `<{ $component }>` ass veralt; benotzt amplaz `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` kann just Englesch an de Pluriel setzen, dofir bleift säin Text an engem Dokument op { $locale } onverännert. Schreift d'Pluralform direkt, oder gitt se mam Attribut `pluralForm` un.


## Checking against the schema

schema-element-unrecognized = D'Element `<{ $tag }>` ass keen unerkannten Doenet-Element.

schema-element-not-allowed-at-root = D'Element `<{ $tag }>` ass op der Wuerzel vum Dokument net erlaabt.

schema-element-not-allowed-inside = D'Element `<{ $tag }>` ass bannent `<{ $parent }>` net erlaabt.

schema-attribute-unrecognized = D'Element `<{ $tag }>` huet keen Attribut mam Numm `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] D'Attribut `{ $attribute }` vum Element `<{ $tag }>` muss eng Lëscht sinn, an där all Element ee vun dëse Wäerter ass: { $allowed }
       *[other] D'Attribut `{ $attribute }` vum Element `<{ $tag }>` muss ee vun dëse Wäerter sinn: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Ongëltege Variantnumm fir select. De Variantnumm { $variantName } kënnt an { $numOptions } Optioune vir, mä d'Zuel, déi ausgewielt gi soll, ass { $numToSelect }.

select-variant-name-without-options = Fir select sinn e puer Variantten uginn, mä et sinn keng Optioune fir de méigleche Variantnumm uginn: { $variantName }.

select-variant-name-not-possible = De Variantnumm { $variantName }, deen fir select uginn ass, ass kee méigleche Variantnumm.

select-too-few-options = { $numToSelect } Komponente kënnen net aus nëmmen { $numOptions } ausgewielt ginn.

select-from-sequence-too-few-values = { $numToSelect } Wäerter kënnen net aus enger Sequenz vun der Längt { $length } ausgewielt ginn.

select-from-sequence-indices-count-mismatch = D'Zuel vun den Indexen, déi fir select uginn sinn, muss der Zuel entspriechen, déi ausgewielt gi soll

select-from-sequence-indices-not-integers = All Indexen, déi fir select uginn sinn, musse ganz Zuele sinn

select-from-sequence-index-excluded = En uginnenen Index vu selectfromsequence war ausgeschloss

select-from-sequence-indices-excluded-combination = Uginne Indexe vu selectfromsequence waren eng ausgeschloss Kombinatioun

select-from-sequence-coprime-not-positive-integers = Teilerfriem Kombinatioune kënnen net ausgewielt ginn, well keng positiv ganz Zuele geholl ginn.

select-from-sequence-coprime-common-factor = Teilerfriem Zuele kënnen net ausgewielt ginn. All méiglech Wäerter hunn e gemeinsame Facteur. (Déi uginne Wäerter vu "from" oder "to" mussen teilerfriem mat "step" sinn.)

select-from-sequence-coprime-single-number = Teilerfriem Kombinatioune kënnen net aus enger eenzeger Zuel ausgewielt ginn, déi net 1 ass.

select-from-sequence-excluded-too-many-combinations = Méi wéi 70% vun de Kombinatioune goufen am selectFromSequence ausgeschloss

select-from-sequence-coprime-none-found = Teilerfriem Zuele konnten net ausgewielt ginn. All méiglech Wäerter hunn e gemeinsame Facteur.

select-from-sequence-too-few-unique-values = { $numToSelect } eenzegaarteg Wäerter kënnen net aus enger Sequenz vun der Längt { $numPossibleValues } ausgewielt ginn

select-prime-numbers-too-few-values = { $numToSelect } Wäerter kënnen net aus enger Lëscht vu Primzuele vun der Längt { $numValues } ausgewielt ginn

select-prime-numbers-values-count-mismatch = D'Zuel vun de Wäerter, déi fir select uginn sinn, muss der Zuel entspriechen, déi ausgewielt gi soll

select-prime-numbers-values-not-prime = All Wäerter, déi fir d'Auswiel vu Primzuelen uginn sinn, mussen an der Lëscht vun de Primzuele stoen

select-prime-numbers-values-excluded-combination = Déi uginne Wäerter vu selectPrimeNumbers waren eng ausgeschloss Kombinatioun

select-prime-numbers-excluded-too-many-combinations = Méi wéi 70% vun de Kombinatioune goufen am selectPrimeNumbers ausgeschloss

select-random-combination-fluke = Duerch en extrem onwahrscheinlechen Zoufall konnt keng Kombinatioun vun zoufällege Wäerter ausgewielt ginn

select-random-value-fluke = Duerch en extrem onwahrscheinlechen Zoufall konnt kee zoufällege Wäert ausgewielt ginn
