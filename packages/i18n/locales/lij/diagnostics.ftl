# Ligurian (ligure) diagnostics. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The grafîa ofiçiâ; see `chrome.ftl` for the note on «ç», the
# circumflex, «ñ» and «eu».
#
# **What makes these sentences Ligurian rather than Italian in Ligurian
# spelling** is the clitic subject and the negation: «o l'é», «a l'é», «no se
# peu», «gh'é», «no gh'à». A sentence here without one of those is very likely
# still Italian, and that is this file's quickest check.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber` — are part of the language, not prose,
# and stay in English exactly as written. So does anything quoted back from the
# author's own source, and so do `WCAG AA`, `DoenetML`, `PreFigure` and
# `prefigure`, which are names.
#
# **Number.** CLDR has plural rules for `lij`. Every **symbolic** selector —
# `$type`, `$mode`, `$reason`, `$context`, `$suggestion`, `$alternative`,
# `$fallback`, `$expected`, `$labelKind`, `$isList`, `$componentType` — is kept
# byte for byte from English, keys included.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } o l'é ignoròu quande se dan doî estremi
       *[other] { $attributes } son ignoræ quande se dan doî estremi
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } o l'é ignoròu quande se dan 'n estremo e 'n ponto de mezo
       *[other] { $attributes } son ignoræ quande se dan 'n estremo e 'n ponto de mezo
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset o no gh'à effetto sensa 'n ponto de mezo

## `<line>`

line-points-undetermined-dimensions = Linia pe ponti de dimensción no determinâ.

line-points-too-few-dimensions = 'Na linia a deve pasâ pe ponti de armeno doe dimenscioin.

line-points-depend-on-variables = A linia a passa pe ponti che dipendan da-e variabili: { $variables }.

line-equation-invalid-format = Formato no vallido pe l'equaçión da linia inte variabili { $variable1 } e { $variable2 }.

## `<ray>`

ray-overprescribed-through = A semiretta a l'é definîa da through, endpoint e direction.  O through dæto o l'é ignoròu.

ray-dimension-mismatch = numDimensions o no combassa inta semiretta.

## `<vector>`

vector-overprescribed-head = O vettô o l'é definîo da head, tail e displacement.  O head dæto o l'é ignoròu.

vector-dimension-mismatch = numDimensions o no combassa into vettô.

## Attracting and constraining

attract-to-without-nearest-point = No se peu tiâ verso 'n `<{ $component }>`, perché o no gh'à a variabile de stato nearestPoint.

constrain-to-without-nearest-point = No se peu vincolâ a 'n `<{ $component }>`, perché o no gh'à a variabile de stato nearestPoint.

constrain-to-interior-without-nearest-point = No se peu vincolâ a-o de drento de 'n `<{ $component }>`, perché o no gh'à a variabile de stato nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition o l'é ignoròu pe 'n choiceInput che o no l'é inline

## Ordering children by index

choice-input-indices-count-mismatch = Se ignoran i indiçi dæti pe choiceInput, perché o numero de indiçi o no corisponde a-o numero de figgi choice.

pretzel-indices-count-mismatch = Se ignoran i indiçi dæti pe problem, perché o numero de indiçi o no corisponde a-o numero de figgi problem.

shuffle-indices-count-mismatch = Se ignoran i indiçi dæti pe shuffle, perché o numero de indiçi o no corisponde a-o numero de componenti.

indices-ignored-out-of-range = Se ignoran i indiçi dæti pe { $component }, perché quarche indiçe o l'é feua da l'intervallo.

pretzel-indices-repeated = Se ignoran i indiçi dæti pe pretzel, perché quarche indiçe o l'é repetîo.

pretzel-circuit-first-index = Se ignoran i indiçi dæti pe pretzel in mòddo circuit, perché o primmo indiçe o deve ese 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Perché `<{ $component }>` o fonçionn-e con figgi de testo, ghe veu dâ 'n attributo `type`.

invalid-type-defaulting-to-math = Tipo { $type } no vallido pe-o componente { $component }. O deve ese un tra math, text, number ò boolean. Se deuvia math.

string-not-valid-component-to-arrange = O testo "{ $value }" o no l'é 'n componente vallido da { $component }. Se l'ignora.

## Types and variables

invalid-type-defaulting-to-number = Tipo { $type } no vallido, se mette o tipo a number.

invalid-variable-value = Valô no vallido de 'na variabile: `{ $value }`

## Variants

variant-index-must-be-number = L'indiçe de variante { $index } o deve ese 'n numero

variant-index-must-be-integer = L'indiçe de variante { $index } o deve ese 'n numero intrego

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` o no l'é fæto pe mezûe asolûe. Se mettan e larghesse a relative.

side-by-side-absolute-margins = `<{ $component }>` o no l'é fæto pe mezûe asolûe. Se mettan i mærgini a relativi.

side-by-side-no-block-child = `<{ $component }>` no vallido: o deve avei armeno 'n figgio de blòcco.

## `<label>`

label-for-ignored-on-graphical = L'attributo `for` in sce 'na `<label>` grafica o l'é ignoròu.

label-for-must-resolve-to-one = L'attributo `for` in sce `<label>` o deve rezòlvise in giusto 'n componente.

label-for-unresolved = L'attributo `for` in sce `<label>` o no s'é riuscîo a rezòlve in 'n componente.

label-for-answer-with-authored-inputs = L'attributo `for` in sce `<label>` o fa riferimento a 'n `<answer>` con di input scriti a man; fanne riferimento drito a-o input.

label-for-answer-without-input = L'attributo `for` in sce `<label>` o fa riferimento a 'n `<answer>` sensa 'n input da etichettâ.

label-for-must-reference-input-or-answer = L'attributo `for` in sce `<label>` o deve fâ riferimento a 'n input ò a 'na risposta.

## Accessibility

accessibility-short-description-or-decorative = Pe l'acesciblitæ, `<{ $component }>` o deve avei 'na descriçión curta ò ese segnòu comme decorativo.

accessibility-video-short-description = Pe l'acesciblitæ, `<video>` o deve avei 'na descriçión curta.

accessibility-input-short-description-or-label = Pe l'acesciblitæ, `<{ $component }>` o deve avei 'na descriçión curta ò 'na etichetta.

accessibility-answer-input-short-description-or-label = Pe l'acesciblitæ, 'n `<answer>` che o crea 'n input o deve avei 'na descriçión curta ò 'na etichetta.

accessibility-short-description-contains-math = E descriçioin curte no devan avei drento componenti matemattichi comme `<{ $component }>`. Scrivi a matemattica con e paròlle.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } o no gh'à assæ contrasto pe-o testo do tittolo da seçión (mòddo scûo) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ghe veu armeno { $threshold }:1).
       *[other] { $colorName } o no gh'à assæ contrasto pe-o testo do tittolo da seçión ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ghe veu armeno { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = 'N `<circle>` pe { $count } ponti o no l'é fæto pe-o cazo che i ponti no gh'aggian valoî numerichi.

circle-too-many-through-points = No se peu carcolâ 'n çèrcio pe ciù de 3 ponti.

circle-overprescribed-radius-center-points = No se peu carcolâ 'n çèrcio con raggio, çentro e ponti de pasaggio dæti.

circle-center-with-multiple-points = No se peu carcolâ 'n çèrcio con çentro dæto pe ciù de 1 ponto.

circle-radius-too-small = No se peu carcolâ o çèrcio: dæto che a distansa tra i doî ponti a l'é { $distance }, o raggio dæto { $radius } o l'é tròppo picin.

circle-radius-with-many-points = No se peu fâ 'n çèrcio pe ciù de doî ponti con 'n raggio dæto.

circle-invalid-center-or-through-points = Çentro ò ponti de pasaggio do çèrcio no valliddi.

circle-radius-center-with-multiple-points = No se peu carcolâ o raggio de 'n çèrcio con çentro dæto pe ciù de 1 ponto.

circle-change-radius-non-numerical = No se peu cangiâ o raggio de 'n çèrcio con ponti de pasaggio no numerichi

circle-radius-with-points-non-numerical = No se peu fâ 'n çèrcio pe ciù de 'n ponto con 'n raggio dæto quande no gh'é valoî numerichi.

circle-change-center-non-numerical = Cangiâ o çentro de 'n çèrcio pe ponti sensa valoî numerichi o no l'é ancón fæto.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Dimenscioin no assæ pe-o dominio da fonçión. O dominio o gh'à { $intervals } intervallo ma a fonçión a gh'à { $inputs ->
            [one] { $inputs } input
           *[other] { $inputs } input
        }.
       *[other] Dimenscioin no assæ pe-o dominio da fonçión. O dominio o gh'à { $intervals } intervalli ma a fonçión a gh'à { $inputs ->
            [one] { $inputs } input
           *[other] { $inputs } input
        }.
    }

function-domain-invalid-format = Formato no vallido pe-o dominio da fonçión.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Se ignora 'n mascimo da fonçión che o no l'é numerico.
        [minimum] Se ignora 'n minimo da fonçión che o no l'é numerico.
        [extremum] Se ignora 'n estremo da fonçión che o no l'é numerico.
        [point] Se ignora 'n ponto da fonçión che o no l'é numerico.
        [slope] Se ignora 'na pendensa da fonçión che a no l'é numerica.
       *[other] Se ignora 'n { $type } da fonçión che o no l'é numerico.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Se ignora 'n mascimo veuo da fonçión.
        [minimum] Se ignora 'n minimo veuo da fonçión.
        [extremum] Se ignora 'n estremo veuo da fonçión.
        [point] Se ignora 'n ponto veuo da fonçión.
       *[other] Se ignora 'n { $type } veuo da fonçión.
    }

function-points-too-close = A fonçión a gh'à doî ponti tròppo vexin l'un a l'atro. No se peu definî a fonçión.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] E iteraçioin de 'na fonçión son poscibili solo se o numero de input o l'é o mæximo do numero de output. Sta fonçión a gh'à { $inputs } input e { $outputs } output.
       *[other] E iteraçioin de 'na fonçión son poscibili solo se o numero de input o l'é o mæximo do numero de output. Sta fonçión a gh'à { $inputs } input e { $outputs } output.
    }

## `<sequence>`

sequence-invalid-length = Longhessa da sequensa no vallida.  A deve ese 'n numero intrego no negativo.

sequence-invalid-step = Passo da sequensa no vallido.  O deve ese 'n numero pe 'na sequensa de tipo { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" no vallido de 'na sequensa de numeri.  O deve ese 'n numero.

sequence-invalid-endpoint-letters = "{ $attribute }" no vallido de 'na sequensa de lettie.  A deve ese 'na combinaçión de lettie.

sequence-invalid-endpoint = "{ $attribute }" da sequensa no vallido.

select-from-sequence-coprime-not-numbers = coprime o l'é ignoròu perché no se çernan di numeri

select-from-sequence-coprime-with-exclude-combinations = coprime o l'é ignoròu perché gh'é dæto excludeCombinations

## Resolving a `target`

target-not-found = target no vallido pe `<{ $source }>`: no se treuva o destinatäio.

target-state-variable-not-found = target no vallido pe `<{ $source }>`: no se treuva 'na variabile de stato ciamâ "{ $property }" in sce 'n `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = E variabili de `<odeSystem>` devan ese diverse da-a variabile indipendente.

ode-system-duplicate-variable-names = No se peu definî e fonçioin RHS da ODE con nommi de variabili dipendenti repetîi.

ode-system-rhs-function-error = No se peu definî a fonçión RHS da ODE.  Erô inta creaçión da fonçión mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = No se peu definî 'n angolo tra { $count } linie

angle-invalid-through-point = Ponto no vallido in through de `<angle>`

parabola-vertex-too-many-points = 'Na paràbola con vertice pe ciù de 1 ponto a no l'é ancón fæta.

parabola-too-many-points = 'Na paràbola pe ciù de 3 ponti a no l'é ancón fæta.

intersection-too-many-items = L'intersecçión de ciù de doî elementi a no l'é ancón fæta

## Other math components

ionic-compound-not-two-ions = 'N composto ionico de atro che doî ioni o no l'é ancón fæto.

ionic-compound-needs-cation-and-anion = O composto ionico o l'é fæto solo pe 'n catión e 'n anión.

solve-equations-cannot-evaluate = No se peu rezòlve l'equaçión perché no s'é riuscîo a valutâla: { $equation }

math-operators-operand-number-required = Ghe veu dâ 'n operandNumber quande se tia feua 'n operando matemattico.

eigen-decomposition-failed = No s'é riuscîo a carcolâ i autovaloî da matrice

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: o paràmetro { $parameters } o no compâ into modello, coscì o l'anderà sempre a stâ con 'n veuo.
       *[other] `<matchesPattern>`: i paràmetri { $parameters } no compâan into modello, coscì i anderàn sempre a stâ con 'n veuo.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: no se peu interpretâ grid="{ $grid }". O deve ese none, medium, dense ò doî numeri poxitivi separæ da 'n spaçio, comme grid="1 0.5". No se dizegna nisciuña gradella.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` o gh'à beseugno de 'na fonçión con { $expected ->
        [one] 'n output, a pendensa y' in ògni ponto, comme `y - x`
       *[other] doî output, o vettô in ògni ponto, comme `(y, -x)`
    }, ma a fonçión dæta a gh'à { $found } output. { $alternative ->
        [none] No se dizegna ninte.
       *[other] `<{ $alternative }>` o l'é o componente pe quella fonçión. No se dizegna ninte.
    }

field-function-attribute-ignored-with-child = L'attributo `function` o l'é ignoròu perché a fonçión a l'é dæta ascì drento a-o componente; se deuvia quella de drento. Dà a fonçión in 'n mòddo solo di doî.

field-variables-ignored =
    `<{ $component }>`: l'attributo `variables` o nomina e variabili de 'na espresción scrita drito drento a-o componente. { $reason ->
        [function-child] A fonçión chi a l'é dæta comme figgio `<function>`, che o nomina e seu variabili, coscì `variables` o l'é ignoròu.
       *[no-expression] Chi no gh'é nisciuña espresción de quella sòrte, coscì `variables` o l'é ignoròu.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" o no l'é supportòu into renderizatô prefigure; se deuvia o comportamento da poxiçión a drita.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" o no l'é supportòu into renderizatô prefigure; se deuvia o comportamento da poxiçión in erto.

prefigure-invalid-axis-bounds = `<graph>`: limiti di asci no valliddi pe-a converscion prefigure; se deuvia o bbox predefinîo (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: larghessa no vallida pe-a converscion prefigure; se deuvia a larghessa predefinîa do diagramma 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio no vallido pe-a converscion prefigure; se deuvia a proporçión predefinîa 1.

prefigure-grid-spacing-too-fine = `<graph>`: a gradella a l'é tròppo fiña pe-i limiti di asci; a gradella a l'é lasciâ feua into renderizatô prefigure.

prefigure-annotations-not-rendered = `<graph>`: e annotaçioin no son dizegnæ quande no se deuvia o renderizatô PreFigure.

multiple-annotations-children = S'é trovòu ciù figgi `<annotations>` in `<graph>`; tutti feua che l'urtimo son ignoræ.

## Referring to other components

copy-unrecognized-component-type = No se peu estende ò copiâ 'n tipo de componente no reconosciûo: { $type }.

copy-prop-not-found = No s'é trovòu a proprietæ { $property } in sce 'n componente de tipo { $component }

collect-no-source = Nisciuña sorgente trovâ pe collect.

collect-invalid-component-type = No se peu arecheugge componenti de tipo `<{ $component }>`, perché o l'é 'n tipo de componente no vallido.

reference-index-unavailable = No se peu fâ riferimento a l'indiçe `{ $reference }`

## `<callAction>`

component-action-unavailable = No se peu ciamâ { $action } in sce o componente `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = I dæti an 'na fòrma no vallida.  E righe an longhesse diverse. Trovòu in componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = I dæti an nommi de colònna repetîi.  Trovòu in componentIdx :{ $componentIdx }

data-frame-missing-column-name = A-i dæti ghe manca 'n nomme de colònna.  Trovòu in componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = 'N premio pe sta risposta o l'é bazòu in sce a risposta mandâ da-o tag answer mæximo, e questo o porterà a 'n comportamento no aspetòu.

answer-max-num-attempts-in-section-wide-check-work = Mette `maxNumAttempts` in sce 'n `<answer>` drento a 'n contenitô con `sectionWideCheckWork` o no gh'à effetto, perché o numero de tentatuoi o l'é controllòu da-o contenitô. Metti `maxNumAttempts` in sce o contenitô invece.

nested-section-wide-check-work-max-num-attempts = Mette `maxNumAttempts` in sce 'n contenitô con `sectionWideCheckWork` che o stà drento a 'n atro contenitô con `sectionWideCheckWork` o no gh'à effetto, perché o numero de tentatuoi o l'é controllòu da-o contenitô de feua. Metti `maxNumAttempts` in sce o contenitô de feua invece.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] L'attributo { $attributes } o no gh'avià effetto sensa symbolicEquality mìsso.
       *[other] I attributi { $attributes } no gh'avian effetto sensa symbolicEquality mìsso.
    }

answer-invalid-type = Tipo no vallido pe-a risposta: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Sicomme che o componente `<{ $component }>` o no gh'à 'n nomme, no se peu deuviâlo comme attributo de modulo

module-attribute-name-already-defined = O componente `<{ $component } name="{ $name }">` no se peu deuviâlo comme attributo de 'n modulo perché o tipo de componente `<module>` o gh'à za 'n attributo "{ $name }" definîo.

conditional-content-condition-ignored = L'attributo `condition` o l'é ignoròu in sce 'n componente `<conditionalContent>` con figgi case ò else.

slider-markers-type-mismatch = O tipo di marcatoî o no combassa co-o tipo do slider.

pretzel-problem-needs-statement-and-answer = pretzel no vallido: ògni `<problem>` o deve avei drento 'n `<statement>` e 'n `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel no vallido: in mode="circuit", o primmo `<problem>` o no peu ese 'n distrattô.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Valô no vallido { $values } pe l'attributo `{ $attribute }`; se l'ignora.
       *[other] Valoî no valliddi { $values } pe l'attributo `{ $attribute }`; se i ignoran.
    }

attribute-must-be-references = Valô no vallido `{ $value }` pe l'attributo `{ $attribute }`. L'attributo o deve ese fæto de riferimenti che comensan con 'n `$`.

math-input-invalid-function-names = <mathInput>: s'é ignoròu di nommi de fonçión no valliddi in { $attribute }: { $names }. O tòcco mostròu de ògni nomme o deve avei armeno 2 caratteri (lettie ò trattin); doppo o peu vegnî 'n sufisso opçionale `|<alternativa mathspeak>`.

## Building components from the source

component-type-invalid = Tipo de componente no vallido: `<{ $componentType }>`

attribute-repeated = No se peu repete l'attributo { $attribute }.

attribute-invalid-for-component = Attributo "{ $attribute }" no vallido pe 'n componente de tipo `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    A definiçión de stile { $styleNumber } a no gh'à assæ contrasto pe { $context ->
        [text-on-background] o coô do testo contra o coô do fondo
        [high-contrast] o coô a erto contrasto contra a tela
        [line] o coô da linia contra a tela
        [marker] o coô do marcatô contra a tela
       *[text-on-canvas] o coô do testo contra a tela
    }{ $mode ->
        [dark] { " (mòddo scûo)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ghe veu armeno { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Sciben che a definiçión de stile { $styleNumber } a gh'à di coloî che dan assæ contrasto pe-o mòddo ciæo, i coloî pe-o mòddo scûo tiæ feua da sti valoî no gh'an assæ contrasto tra o coô do testo e o coô do fondo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ghe veu armeno { $threshold }:1). { $suggestion ->
        [available] Pe avei assæ contrasto into mòddo scûo, ò arsa o contrasto do mòddo ciæo (p.es. metti { $lightAttribute }="{ $lightColor }") ò passa in sce o coô do mòddo scûo (p.es. metti { $darkAttribute }="{ $darkColor }").
       *[none] Pe avei assæ contrasto into mòddo scûo, arsa o contrasto do mòddo ciæo ò passa in sci coloî tiæ feua con textColorDarkMode e/ò backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Sciben che a definiçión de stile { $styleNumber } a gh'à 'n coô do testo che o dà assæ contrasto pe-o mòddo ciæo, o coô do testo pe-o mòddo scûo tiòu feua da quello valô o no gh'à assæ contrasto contra a tela ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ghe veu armeno { $threshold }:1). { $suggestion ->
        [available] Pe avei assæ contrasto into mòddo scûo, ò arsa o contrasto do mòddo ciæo (p.es. metti textColor="{ $lightColor }") ò passa in sce o coô do mòddo scûo (p.es. metti textColorDarkMode="{ $darkColor }").
       *[none] Pe avei assæ contrasto into mòddo scûo, arsa o contrasto do mòddo ciæo ò passa in sce o coô tiòu feua con textColorDarkMode.
    }

section-multiple-style-palettes = 'Na seçión a peu çerne 'n <stylePalette> solo; se deuvia l'urtimo.

## Unique variants

variant-num-to-select-not-non-negative-integer = no se peu determinâ e varianti uniche de { $component }, perché numToSelect o no l'é 'n numero intrego no negativo.

variant-num-to-select-not-constant-number = no se peu determinâ e varianti uniche de { $component }, perché numToSelect o no l'é 'n numero costante.

variant-with-replacement-not-constant-boolean = no se peu determinâ e varianti uniche de { $component }, perché withReplacement o no l'é 'n boolean costante.

variant-select-weight-disables-unique = E varianti uniche pe select son dizattivæ se 'na opçión a gh'à selectWeight ò selectForVariants dæto

variant-coprime-undetermined = no se peu determinâ e varianti uniche de { $component }, perché no se peu determinâ che coprime o segge sempre faso.

variant-attribute-not-constant = no se peu determinâ e varianti uniche de { $component }, perché { $attribute } o no l'é 'na costante.

variant-attribute-not-number = no se peu determinâ e varianti uniche de { $component }, perché { $attribute } o no l'é 'n numero.

variant-attribute-wrong-type-for-sequence =
    no se peu determinâ e varianti uniche de { $component } de tipo { $type }, perché { $attribute } o no l'é { $expected ->
        [letters-combination] 'na combinaçión de lettie
        [math-expression] 'na espresción matemattica vallida
        [integer] 'n numero intrego
       *[number] 'n numero
    }.

variant-length-not-integer = no se peu determinâ e varianti uniche de { $component }, perché length o no l'é 'n numero intrego.

variant-sort-not-implemented = e varianti uniche de 'n { $component } con sort no son ancón fæte

variant-exclude-combinations-not-implemented = e varianti uniche de 'n { $component } con excludeCombinations no son ancón fæte

variant-math-exclude-not-implemented = e varianti uniche de 'n { $component } de tipo math con exclude no son ancón fæte

variant-non-constant-exclude-not-implemented = e varianti uniche de 'n { $component } con 'n exclude no costante no son ancón fæte

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: o no l'é supportòu into renderizatô prefigure do grafico; o discendente o l'é sätòu.

prefigure-descendant-invalid-geometry = { $subject }: geometria no finia ò no completa; o discendente o l'é sätòu.

prefigure-curve-label-omitted = { $subject }: e etichette no son supportæ in sci elementi de curva convertîi; l'etichetta a l'é lasciâ feua.

prefigure-curve-unsupported-definition-type = { $subject }: tipo de definiçión da curva '{ $definitionType }' no supportòu; o discendente o l'é sätòu.

prefigure-region-flip-functions-unsupported = { $subject }: attributo flipFunctions no supportòu in sce regionBetweenCurves; o discendente o l'é sätòu.

prefigure-region-non-formula-child = { $subject }: solo e fonçioin figgio de tipo formula son supportæ in sce regionBetweenCurves; o discendente o l'é sätòu.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' no supportòu pe { $labelKind ->
        [line-family] 'na etichetta da famiggia de linie
       *[point] 'na etichetta de ponto
    }; se deuvia l'alliniamento predefinîo de PreFigure.

prefigure-fill-style-unsupported = { $subject }: o stile de rempimento '{ $fillStyle }' o no l'é supportòu da PreFigure; se torna a 'n rempimento pin.

prefigure-line-style-unknown = { $subject }: o stile de linia no conosciûo '{ $lineStyle }' o l'é lasciòu feua da l'output de PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: o stile de marcatô '{ $markerStyle }' o l'é stæto mappòu in sce o stile PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: o stile de marcatô '{ $markerStyle }' o no l'é supportòu da PreFigure; se deuvia o stile predefinîo.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` no vallido; no se peu rezòlve o destinatäio. L'annotaçión a l'é lasciâ feua.

annotation-ref-multiple-targets = `<annotation>`: `ref` o s'é rezòlto in ciù destinatäi; se deuvia o primmo.

annotation-ref-outside-graph = `<annotation>`: `ref` no vallido; o destinatäio o l'é feua do grafico che o lo contëgne. L'annotaçión a l'é lasciâ feua.

annotation-ref-unsupported-target = `<annotation>`: `ref` no vallido; o destinatäio o no l'é 'n oggetto grafico supportòu inta converscion prefigure. L'annotaçión a l'é lasciâ feua.

annotation-text-missing = `<annotation>`: `text` o manca ò o l'é veuo; se manda feua do testo veuo.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] S'é trovòu 'na dipendensa circolare.
       *[other] S'é trovòu 'na dipendensa circolare che a piggia drento 'n componente `<{ $componentType }>`.
    }

reference-no-referent = Nisciun referente trovòu pe-o riferimento: `{ $reference }`

reference-multiple-referents = Ciù referenti trovæ pe-o riferimento: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Formato no vallido pe l'attributo { $attribute } de `<{ $componentType }>`.

children-invalid = Figgi no valliddi pe `<{ $componentType }>`: s'é trovòu di figgi no valliddi: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valô no vallido `{ $value }` pe l'attributo `{ $attribute }`, se deuvia o valô `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Verscion de DoenetML { $version } no trovâ.
       *[other] Verscion de DoenetML { $version } no trovâ. Se torna a-a verscion { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML no vallido: { $content }

parse-tag-missing-close-tag = DoenetML no vallido: O tag `{ $tag }` o no gh'à 'n tag de serriña. Se aspetava 'n tag che o se serra da lê ò 'n tag `</{ $tagName }>`.

parse-tag-error = DoenetML no vallido: Erô into tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML no vallido: O pâ che a l'attributo no vallido `{ $attribute }` ghe manche 'n valô.

parse-attribute-invalid = DoenetML no vallido: Attributo no vallido `{ $attribute }`

parse-attribute-value-invalid = DoenetML no vallido: Valô de attributo no vallido `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML no vallido: Valô de attributo no vallido `{ $value }`. E vergolette no combassan. O pâ che te manche 'n `{ $quote }`

parse-open-tag-name-missing = DoenetML no vallido: S'é trovòu 'n tag sensa nomme de tag, p.es. `<`

parse-tag-not-closed = DoenetML no vallido: O tag `{ $tag }` o no l'é stæto serròu (o pâ che manche 'n `>`).

parse-self-closing-tag-name-missing = DoenetML no vallido: S'é trovòu 'n tag sensa nomme de tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML no vallido: O tag `{ $tag }` o no l'é stæto serròu (o pâ che manche `/>`).

parse-tag-invalid-attributes = DoenetML no vallido: O tag `{ $tag }` o no l'é vallido. O poriæ avei di attributi sbagliæ.

parse-close-tag-name-missing = DoenetML no vallido: S'é trovòu 'n tag de serriña sensa nomme de tag, p.es. `</`

parse-attribute-value-unquoted = I valoî di attributi devan stâ tra vergolette: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML no vallido: S'é trovòu o tag de serriña `{ $tag }`, ma nisciun tag de arvitûa corispondente

parse-close-tag-mismatched = DoenetML no vallido: Tag de serriña che o no combassa. Se aspetava `</{ $expected }>`. S'é trovòu `{ $found }`

parser-node-unconvertible = No s'é riuscîo a convertî o nodo { $node } in 'n nodo Dast.

## Names

name-attribute-invalid =
    Attributo no vallido name='{ $name }'. { $reason ->
        [characters] I nommi peuan avei solo lettie, numeri, sottolinie ò trattin.
       *[start] I nommi devan comensâ con 'na lettia.
    }

component-name-invalid-start = Nomme de componente no vallido "{ $name }". I nommi devan comensâ con 'na lettia.

## `<answer>` sugar

answer-video-watched-missing-video = 'Na risposta de tipo videoWatched a deve avei 'n attributo video

answer-video-watched-video-not-reference = 'Na risposta de tipo videoWatched a deve avei 'n attributo video che o segge 'n riferimento

answer-name-not-single-text = L'attributo name da risposta o deve avei 'n figgio de testo solo

## Referencing another document

external-doenetml-recursion-limit = No se peu recuperâ o DoenetML esterno pe tròppi livelli de ricorscion. Gh'é 'n riferimento circolare?

external-doenetml-unavailable = No se peu recuperâ o DoenetML da { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML no vallido recuperòu da { $attribute }="{ $uri }": o no combassava co-o tipo de componente "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] L'attributo `{ $from }` o l'é superòu; deuvia `{ $to }` invece.
       *[other] [deprecation] L'attributo `{ $from }` in sce `<{ $component }>` o l'é superòu; deuvia `{ $to }` invece.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] L'attributo `{ $from }` o l'é superòu e o l'é ignoròu perché gh'é dæto ascì `{ $to }`.
       *[other] [deprecation] L'attributo `{ $from }` in sce `<{ $component }>` o l'é superòu e o l'é ignoròu perché gh'é dæto ascì `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] L'attributo `{ $attribute }` in sce `<{ $component }>` o l'é superòu e o l'é ignoròu.

deprecated-attribute-to-child = [deprecation] L'attributo `{ $attribute }` in sce `<{ $component }>` o l'é superòu; deuvia invece 'n figgio `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] O valô `{ $value }` de l'attributo `{ $attribute }` in sce `<{ $component }>` o l'é superòu; deuvia `{ $to }` invece.


## Language coverage

pluralize-english-only = `<pluralize>` o peu mette a-o plurale solo l'ingleize, coscì o seu testo o resta tâ e quæ in 'n documento scrito in { $locale }. Scrivi a fòrma plurale drito, ò mettila co-l'attributo `pluralForm`.


## Checking against the schema

schema-element-unrecognized = L'elemento `<{ $tag }>` o no l'é 'n elemento Doenet reconosciûo.

schema-element-not-allowed-at-root = L'elemento `<{ $tag }>` o no l'é permisso a-a reixe do documento.

schema-element-not-allowed-inside = L'elemento `<{ $tag }>` o no l'é permisso drento a `<{ $parent }>`.

schema-attribute-unrecognized = L'elemento `<{ $tag }>` o no gh'à 'n attributo ciamòu `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] L'attributo `{ $attribute }` de l'elemento `<{ $tag }>` o deve ese 'na lista che ògni elemento o segge un tra: { $allowed }
       *[other] L'attributo `{ $attribute }` de l'elemento `<{ $tag }>` o deve ese un tra: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nomme de variante no vallido pe select.  O nomme de variante { $variantName } o compâ in { $numOptions } opçioin ma o numero da çerne o l'é { $numToSelect }.

select-variant-name-without-options = Gh'é dæto quarche variante pe select ma nisciuña opçión pe-o nomme de variante poscibile: { $variantName }.

select-variant-name-not-possible = O nomme de variante { $variantName } dæto pe select o no l'é 'n nomme de variante poscibile.

select-too-few-options = No se peu çerne { $numToSelect } componenti da solo { $numOptions }.

select-from-sequence-too-few-values = No se peu çerne { $numToSelect } valoî da 'na sequensa de longhessa { $length }.

select-from-sequence-indices-count-mismatch = O numero de indiçi dæti pe select o deve corisponde a-o numero da çerne

select-from-sequence-indices-not-integers = Tutti i indiçi dæti pe select devan ese numeri intreghi

select-from-sequence-index-excluded = L'indiçe dæto de selectfromsequence o l'ea esclûzo

select-from-sequence-indices-excluded-combination = I indiçi dæti de selectfromsequence ean 'na combinaçión esclûza

select-from-sequence-coprime-not-positive-integers = No se peu çerne combinaçioin coprime perché no se çernan numeri intreghi poxitivi.

select-from-sequence-coprime-common-factor = No se peu çerne numeri coprimmi. Tutti i valoî poscibili an 'n fattô comun. (I valoî dæti de "from" ò "to" devan ese coprimmi con "step".)

select-from-sequence-coprime-single-number = No se peu çerne combinaçioin coprime da 'n numero solo che o no l'é 1.

select-from-sequence-excluded-too-many-combinations = S'é esclûzo ciù do 70% de combinaçioin in selectFromSequence

select-from-sequence-coprime-none-found = No s'é riuscîo a çerne numeri coprimmi. Tutti i valoî poscibili an 'n fattô comun.

select-from-sequence-too-few-unique-values = No se peu çerne { $numToSelect } valoî unichi da 'na sequensa de longhessa { $numPossibleValues }

select-prime-numbers-too-few-values = No se peu çerne { $numToSelect } valoî da 'na lista de numeri primmi de longhessa { $numValues }

select-prime-numbers-values-count-mismatch = O numero de valoî dæti pe select o deve corisponde a-o numero da çerne

select-prime-numbers-values-not-prime = Tutti i valoî dæti pe select de numeri primmi devan ese inta lista di numeri primmi

select-prime-numbers-values-excluded-combination = I valoî dæti de selectPrimeNumbers ean 'na combinaçión esclûza

select-prime-numbers-excluded-too-many-combinations = S'é esclûzo ciù do 70% de combinaçioin in selectPrimeNumbers

select-random-combination-fluke = Pe 'n cazo straordinariamente improbabile, no s'é riuscîo a çerne 'na combinaçión de valoî a cazo

select-random-value-fluke = Pe 'n cazo straordinariamente improbabile, no s'é riuscîo a çerne 'n valô a cazo

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` o no l'é dizegnòu drento a-a matemattica; l'espresción a l'é composta comme a l'ea primma che se poëse mette di input drento. { $reason ->
        [not-inline] Solo 'n input de çernia `inline` o stà drento a 'na espresción; sensa `inline` o l'é 'n blòcco de botoin.
        [expanded] 'N input de testo `expanded` o l'é 'na casella in sce ciù righe, tròppo grande pe stâ drento a 'na espresción.
        [on-graph] In sce 'n grafico l'espresción a l'é dizegnâ comme 'na figûa sola, che a no gh'à pòsto pe 'n controllo.
       *[relative-width] A seu `width` a l'é relativa ('na percentuale ò `em`), e a no gh'à ninte da mezûâ drento a 'na espresción. Dà a larghessa in unitæ asolûe, comme `px`, invece.
    }
