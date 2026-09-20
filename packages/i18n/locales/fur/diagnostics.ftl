# Friulian (furlan) diagnostics. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The official spelling; see `chrome.ftl` for the note on the
# circumflex, «ç», «cj» and «gj».
#
# **Friulian's obligatory clitic subject** is what makes these sentences
# Friulian rather than Italian in Friulian words: a finite verb takes «al» /
# «e» / «a» in front of it — «al è», «e je», «a son», «al pues» — and a
# sentence here without one is very likely still Italian. That is this file's
# quickest check.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber` — are part of the language, not prose,
# and stay in English exactly as written. So does anything quoted back from the
# author's own source, and so do `WCAG AA`, `DoenetML`, `PreFigure` and
# `prefigure`, which are names.
#
# **Number.** CLDR has plural rules for `fur`, so a `one`/`other` branch is
# selected by Friulian's own rules. Every **symbolic** selector — `$type`,
# `$mode`, `$reason`, `$context`, `$suggestion`, `$alternative`, `$fallback`,
# `$expected`, `$labelKind`, `$isList`, `$componentType` — is kept byte for
# byte from English, keys included.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } al ven ignorât cuant che a son dâts doi pons finâi
       *[other] { $attributes } a vegnin ignorâts cuant che a son dâts doi pons finâi
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } al ven ignorât cuant che a son dâts un pont finâl e un pont di mieç
       *[other] { $attributes } a vegnin ignorâts cuant che a son dâts un pont finâl e un pont di mieç
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset nol à efiet cence un pont di mieç

## `<line>`

line-points-undetermined-dimensions = Linie par ponts di dimension no determinade.

line-points-too-few-dimensions = Une linie e à di passâ par ponts di almancul dôs dimensions.

line-points-depend-on-variables = La linie e passe par ponts che a dipendin des variabilis: { $variables }.

line-equation-invalid-format = Format no valit pe ecuazion de linie tes variabilis { $variable1 } e { $variable2 }.

## `<ray>`

ray-overprescribed-through = La semirete e je definide di through, endpoint e direction.  Il through dât al ven ignorât.

ray-dimension-mismatch = numDimensions nol coincît te semirete.

## `<vector>`

vector-overprescribed-head = Il vetôr al è definît di head, tail e displacement.  Il head dât al ven ignorât.

vector-dimension-mismatch = numDimensions nol coincît tal vetôr.

## Attracting and constraining

attract-to-without-nearest-point = No si pues tirâ viers un `<{ $component }>`, parcè che nol à la variabile di stât nearestPoint.

constrain-to-without-nearest-point = No si pues vincolâ a un `<{ $component }>`, parcè che nol à la variabile di stât nearestPoint.

constrain-to-interior-without-nearest-point = No si pues vincolâ al interni di un `<{ $component }>`, parcè che nol à la variabile di stât nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition al ven ignorât par un choiceInput che nol è inline

## Ordering children by index

choice-input-indices-count-mismatch = Si ignore i indics dâts par choiceInput, parcè che il numar di indics nol corispuint al numar di fîs choice.

pretzel-indices-count-mismatch = Si ignore i indics dâts par problem, parcè che il numar di indics nol corispuint al numar di fîs problem.

shuffle-indices-count-mismatch = Si ignore i indics dâts par shuffle, parcè che il numar di indics nol corispuint al numar di components.

indices-ignored-out-of-range = Si ignore i indics dâts par { $component }, parcè che cualchi indiç al è fûr dal interval.

pretzel-indices-repeated = Si ignore i indics dâts par pretzel, parcè che cualchi indiç al è ripetût.

pretzel-circuit-first-index = Si ignore i indics dâts par pretzel te modalitât circuit, parcè che il prin indiç al à di jessi 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Par che `<{ $component }>` al funzioni cun fîs di test, si à di dâ un atribût `type`.

invalid-type-defaulting-to-math = Gjenar { $type } no valit pal component { $component }. Al à di jessi un tra math, text, number o boolean. Si dopre math.

string-not-valid-component-to-arrange = Il test "{ $value }" nol è un component valit di { $component }. Si lu ignore.

## Types and variables

invalid-type-defaulting-to-number = Gjenar { $type } no valit, si met il gjenar a number.

invalid-variable-value = Valôr no valit di une variabile: `{ $value }`

## Variants

variant-index-must-be-number = L'indiç di variante { $index } al à di jessi un numar

variant-index-must-be-integer = L'indiç di variante { $index } al à di jessi un numar intîr

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` nol è implementât par misuris assolutis. Si met lis largjecis a relativis.

side-by-side-absolute-margins = `<{ $component }>` nol è implementât par misuris assolutis. Si met i margjins a relatîfs.

side-by-side-no-block-child = `<{ $component }>` no valit: al à di vê almancul un fi di bloc.

## `<label>`

label-for-ignored-on-graphical = L'atribût `for` suntune `<label>` grafiche al ven ignorât.

label-for-must-resolve-to-one = L'atribût `for` su `<label>` al à di risolvisi in juste un component.

label-for-unresolved = L'atribût `for` su `<label>` nol à podût jessi risolt in un component.

label-for-answer-with-authored-inputs = L'atribût `for` su `<label>` al fâs riferiment a un `<answer>` cun inputs scrits a man; fâs riferiment dret al input.

label-for-answer-without-input = L'atribût `for` su `<label>` al fâs riferiment a un `<answer>` cence un input di etichetâ.

label-for-must-reference-input-or-answer = L'atribût `for` su `<label>` al à di fâ riferiment a un input o a une rispueste.

## Accessibility

accessibility-short-description-or-decorative = Pe acessibilitât, `<{ $component }>` al à di vê une descrizion curte o di jessi segnât come decoratîf.

accessibility-video-short-description = Pe acessibilitât, `<video>` al à di vê une descrizion curte.

accessibility-input-short-description-or-label = Pe acessibilitât, `<{ $component }>` al à di vê une descrizion curte o une etichete.

accessibility-answer-input-short-description-or-label = Pe acessibilitât, un `<answer>` che al cree un input al à di vê une descrizion curte o une etichete.

accessibility-short-description-contains-math = Lis descrizions curtis no àn di vê dentri components matematics come `<{ $component }>`. Scrîf la matematiche cun peraulis.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } nol à contrast avonde pal test dal titul de sezion (modalitât scure) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; al covente almancul { $threshold }:1).
       *[other] { $colorName } nol à contrast avonde pal test dal titul de sezion ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; al covente almancul { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Un `<circle>` par { $count } ponts nol è implementât tal câs che i ponts no àn valôrs numerics.

circle-too-many-through-points = No si pues calcolâ un cercli par plui di 3 ponts.

circle-overprescribed-radius-center-points = No si pues calcolâ un cercli cun rai, centri e ponts di passaç dâts.

circle-center-with-multiple-points = No si pues calcolâ un cercli cun centri dât par plui di 1 pont.

circle-radius-too-small = No si pues calcolâ il cercli: dât che la distance tra i doi ponts e je { $distance }, il rai dât { $radius } al è masse piçul.

circle-radius-with-many-points = No si pues creâ un cercli par plui di doi ponts cuntun rai dât.

circle-invalid-center-or-through-points = Centri o ponts di passaç dal cercli no valits.

circle-radius-center-with-multiple-points = No si pues calcolâ il rai di un cercli cun centri dât par plui di 1 pont.

circle-change-radius-non-numerical = No si pues cambiâ il rai di un cercli cun ponts di passaç no numerics

circle-radius-with-points-non-numerical = No si pues creâ un cercli par plui di un pont cuntun rai dât cuant che no si à valôrs numerics.

circle-change-center-non-numerical = Cambiâ il centri di un cercli par ponts cence valôrs numerics nol è ancjemò implementât.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Dimensions no avonde pal domini de funzion. Il domini al à { $intervals } interval ma la funzion e à { $inputs ->
            [one] { $inputs } input
           *[other] { $inputs } inputs
        }.
       *[other] Dimensions no avonde pal domini de funzion. Il domini al à { $intervals } intervai ma la funzion e à { $inputs ->
            [one] { $inputs } input
           *[other] { $inputs } inputs
        }.
    }

function-domain-invalid-format = Format no valit pal domini de funzion.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Si ignore un massim de funzion che nol è numeric.
        [minimum] Si ignore un minim de funzion che nol è numeric.
        [extremum] Si ignore un estrem de funzion che nol è numeric.
        [point] Si ignore un pont de funzion che nol è numeric.
        [slope] Si ignore une pendence de funzion che no je numeriche.
       *[other] Si ignore un { $type } de funzion che nol è numeric.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Si ignore un massim vueit de funzion.
        [minimum] Si ignore un minim vueit de funzion.
        [extremum] Si ignore un estrem vueit de funzion.
        [point] Si ignore un pont vueit de funzion.
       *[other] Si ignore un { $type } vueit de funzion.
    }

function-points-too-close = La funzion e à doi ponts masse dongje un dal altri. No si pues definî la funzion.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Lis iterazions di une funzion a son pussibilis dome se il numar di inputs al è compagn dal numar di outputs. Cheste funzion e à { $inputs } input e { $outputs ->
            [one] { $outputs } output
           *[other] { $outputs } outputs
        }.
       *[other] Lis iterazions di une funzion a son pussibilis dome se il numar di inputs al è compagn dal numar di outputs. Cheste funzion e à { $inputs } inputs e { $outputs ->
            [one] { $outputs } output
           *[other] { $outputs } outputs
        }.
    }

## `<sequence>`

sequence-invalid-length = Lungjece de secuence no valide.  E à di jessi un numar intîr no negatîf.

sequence-invalid-step = Pas de secuence no valit.  Al à di jessi un numar par une secuence di gjenar { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" no valit di une secuence di numars.  Al à di jessi un numar.

sequence-invalid-endpoint-letters = "{ $attribute }" no valit di une secuence di letaris.  E à di jessi une cumbinazion di letaris.

sequence-invalid-endpoint = "{ $attribute }" de secuence no valit.

select-from-sequence-coprime-not-numbers = coprime al ven ignorât parcè che no si sielç numars

select-from-sequence-coprime-with-exclude-combinations = coprime al ven ignorât parcè che al è dât excludeCombinations

## Resolving a `target`

target-not-found = target no valit par `<{ $source }>`: no si cjate il destinatari.

target-state-variable-not-found = target no valit par `<{ $source }>`: no si cjate une variabile di stât clamade "{ $property }" suntun `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Lis variabilis di `<odeSystem>` a àn di jessi diviersis de variabile indipendente.

ode-system-duplicate-variable-names = No si pues definî lis funzions RHS de ODE cun nons di variabilis dipendentis ripetûts.

ode-system-rhs-function-error = No si pues definî la funzion RHS de ODE.  Erôr te creazion de funzion mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = No si pues definî un angul tra { $count } liniis

angle-invalid-through-point = Pont no valit in through di `<angle>`

parabola-vertex-too-many-points = Une parabule cun vertiç par plui di 1 pont no je ancjemò implementade.

parabola-too-many-points = Une parabule par plui di 3 ponts no je ancjemò implementade.

intersection-too-many-items = La intersezion di plui di doi elements no je ancjemò implementade

## Other math components

ionic-compound-not-two-ions = Un compost ionic di alc altri che doi ions nol è ancjemò implementât.

ionic-compound-needs-cation-and-anion = Il compost ionic al è implementât dome par un cation e un anion.

solve-equations-cannot-evaluate = No si pues risolvi la ecuazion parcè che no si à podût valutâle: { $equation }

math-operators-operand-number-required = Si à di dâ un operandNumber cuant che si tire fûr un operant matematic.

eigen-decomposition-failed = No si è rivâts a calcolâ i autovalôrs de matrice

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: il parametri { $parameters } nol comparìs tal model, cussì al larà simpri a stâ cuntun vueit.
       *[other] `<matchesPattern>`: i parametris { $parameters } no comparissin tal model, cussì a laran simpri a stâ cuntun vueit.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: no si pues interpretâ grid="{ $grid }". Al à di jessi none, medium, dense o doi numars positîfs dividûts di un spazi, come grid="1 0.5". No si dissegne nissune gridele.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` al à bisugne di une funzion cun { $expected ->
        [one] un output, la pendence y' in ogni pont, come `y - x`
       *[other] doi outputs, il vetôr in ogni pont, come `(y, -x)`
    }, ma la funzion dade e à { $found ->
        [one] { $found } output
       *[other] { $found } outputs
    }. { $alternative ->
        [none] No si dissegne nuie.
       *[other] `<{ $alternative }>` al è il component par chê funzion. No si dissegne nuie.
    }

field-function-attribute-ignored-with-child = L'atribût `function` al ven ignorât parcè che la funzion e je dade ancje dentri dal component; si dopre chê dentri. Da la funzion dome intune des dôs manieris.

field-variables-ignored =
    `<{ $component }>`: l'atribût `variables` al nomene lis variabilis di une espression scrite dret dentri dal component. { $reason ->
        [function-child] La funzion chi e je dade come fi `<function>`, che al nomene lis sôs variabilis, cussì `variables` al ven ignorât.
       *[no-expression] Chi no'nd è nissune espression di chê fate, cussì `variables` al ven ignorât.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" nol è supuartât tal renderizadôr prefigure; si dopre il compuartament de posizion a diestre.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" nol è supuartât tal renderizadôr prefigure; si dopre il compuartament de posizion in alt.

prefigure-invalid-axis-bounds = `<graph>`: limits dai as no valits pe conversion prefigure; si dopre il bbox predefinît (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: largjece no valide pe conversion prefigure; si dopre la largjece predefinide dal diagram 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio no valit pe conversion prefigure; si dopre la proporzion predefinide 1.

prefigure-grid-spacing-too-fine = `<graph>`: la gridele e je masse fine pai limits dai as; la gridele e ven lassade fûr tal renderizadôr prefigure.

prefigure-annotations-not-rendered = `<graph>`: lis anotazions no vegnin dissegnadis cuant che no si dopre il renderizadôr PreFigure.

multiple-annotations-children = Si à cjatât plui fîs `<annotations>` in `<graph>`; ducj fûr che l'ultin a vegnin ignorâts.

## Referring to other components

copy-unrecognized-component-type = No si pues estindi o copiâ un gjenar di component no ricognossût: { $type }.

copy-prop-not-found = No si è cjatade la proprietât { $property } suntun component di gjenar { $component }

collect-no-source = Nissune sorzint cjatade par collect.

collect-invalid-component-type = No si pues tirâ dongje components di gjenar `<{ $component }>`, parcè che al è un gjenar di component no valit.

reference-index-unavailable = No si pues fâ riferiment al indiç `{ $reference }`

## `<callAction>`

component-action-unavailable = No si pues clamâ { $action } sul component `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = I dâts a àn une forme no valide.  Lis riis a àn lungjecis diferentis. Cjatât in componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = I dâts a àn nons di colone ripetûts.  Cjatât in componentIdx :{ $componentIdx }

data-frame-missing-column-name = Ai dâts ur mancje un non di colone.  Cjatât in componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Un premi par cheste rispueste al è basât su la rispueste mandade dal tag answer stes, e chest al puarterà a un compuartament no spietât.

answer-max-num-attempts-in-section-wide-check-work = Meti `maxNumAttempts` suntun `<answer>` dentri di un contignidôr cun `sectionWideCheckWork` nol à efiet, parcè che il numar di tentatîfs al è controlât dal contignidôr. Met `maxNumAttempts` sul contignidôr invezit.

nested-section-wide-check-work-max-num-attempts = Meti `maxNumAttempts` suntun contignidôr cun `sectionWideCheckWork` che al sta dentri di un altri contignidôr cun `sectionWideCheckWork` nol à efiet, parcè che il numar di tentatîfs al è controlât dal contignidôr esterni. Met `maxNumAttempts` sul contignidôr esterni invezit.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] L'atribût { $attributes } nol varà efiet cence symbolicEquality metût.
       *[other] I atribûts { $attributes } no varan efiet cence symbolicEquality metût.
    }

answer-invalid-type = Gjenar no valit pe rispueste: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Stant che il component `<{ $component }>` nol à un non, no si lu pues doprâ come atribût di modul

module-attribute-name-already-defined = Il component `<{ $component } name="{ $name }">` no si lu pues doprâ come atribût di un modul parcè che il gjenar di component `<module>` al à za un atribût "{ $name }" definît.

conditional-content-condition-ignored = L'atribût `condition` al ven ignorât suntun component `<conditionalContent>` cun fîs case o else.

slider-markers-type-mismatch = Il gjenar dai marcadôrs nol coincît cul gjenar dal slider.

pretzel-problem-needs-statement-and-answer = pretzel no valit: ogni `<problem>` al à di vê dentri un `<statement>` e un `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel no valit: in mode="circuit", il prin `<problem>` nol pues jessi un distratôr.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Valôr no valit { $values } pal atribût `{ $attribute }`; si lu ignore.
       *[other] Valôrs no valits { $values } pal atribût `{ $attribute }`; si ju ignore.
    }

attribute-must-be-references = Valôr no valit `{ $value }` pal atribût `{ $attribute }`. L'atribût al à di jessi componût di riferiments che a scomencin cuntun `$`.

math-input-invalid-function-names = <mathInput>: si à ignorât nons di funzion no valits in { $attribute }: { $names }. Il toc mostrât di ogni non al à di vê almancul 2 caratars (letaris o tratuts); daspò al pues vignî un sufìs opzionâl `|<alternative mathspeak>`.

## Building components from the source

component-type-invalid = Gjenar di component no valit: `<{ $componentType }>`

attribute-repeated = No si pues ripeti l'atribût { $attribute }.

attribute-invalid-for-component = Atribût "{ $attribute }" no valit par un component di gjenar `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    La definizion di stîl { $styleNumber } no à contrast avonde par { $context ->
        [text-on-background] il colôr dal test cuintri il colôr dal fonts
        [high-contrast] il colôr a alt contrast cuintri la tele
        [line] il colôr de linie cuintri la tele
        [marker] il colôr dal marcadôr cuintri la tele
       *[text-on-canvas] il colôr dal test cuintri la tele
    }{ $mode ->
        [dark] { " (modalitât scure)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; al covente almancul { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Ancje se la definizion di stîl { $styleNumber } e à colôrs che a dan contrast avonde pe modalitât clare, i colôrs pe modalitât scure ricavâts di chescj valôrs no àn contrast avonde tra il colôr dal test e il colôr dal fonts ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; al covente almancul { $threshold }:1). { $suggestion ->
        [available] Par vê contrast avonde te modalitât scure, o alce il contrast de modalitât clare (p.e. met { $lightAttribute }="{ $lightColor }") o passe parsore al colôr de modalitât scure (p.e. met { $darkAttribute }="{ $darkColor }").
       *[none] Par vê contrast avonde te modalitât scure, alce il contrast de modalitât clare o passe parsore ai colôrs ricavâts cun textColorDarkMode e/o backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ancje se la definizion di stîl { $styleNumber } e à un colôr dal test che al da contrast avonde pe modalitât clare, il colôr dal test pe modalitât scure ricavât di chel valôr nol à contrast avonde cuintri la tele ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; al covente almancul { $threshold }:1). { $suggestion ->
        [available] Par vê contrast avonde te modalitât scure, o alce il contrast de modalitât clare (p.e. met textColor="{ $lightColor }") o passe parsore al colôr de modalitât scure (p.e. met textColorDarkMode="{ $darkColor }").
       *[none] Par vê contrast avonde te modalitât scure, alce il contrast de modalitât clare o passe parsore al colôr ricavât cun textColorDarkMode.
    }

section-multiple-style-palettes = Une sezion e pues sielgi dome un <stylePalette>; si dopre l'ultin.

## Unique variants

variant-num-to-select-not-non-negative-integer = no si pues determinâ lis variantis unichis di { $component }, parcè che numToSelect nol è un numar intîr no negatîf.

variant-num-to-select-not-constant-number = no si pues determinâ lis variantis unichis di { $component }, parcè che numToSelect nol è un numar costant.

variant-with-replacement-not-constant-boolean = no si pues determinâ lis variantis unichis di { $component }, parcè che withReplacement nol è un boolean costant.

variant-select-weight-disables-unique = Lis variantis unichis par select a son disativadis se une opzion e à selectWeight o selectForVariants dâts

variant-coprime-undetermined = no si pues determinâ lis variantis unichis di { $component }, parcè che no si pues determinâ che coprime al sedi simpri fals.

variant-attribute-not-constant = no si pues determinâ lis variantis unichis di { $component }, parcè che { $attribute } nol è une costante.

variant-attribute-not-number = no si pues determinâ lis variantis unichis di { $component }, parcè che { $attribute } nol è un numar.

variant-attribute-wrong-type-for-sequence =
    no si pues determinâ lis variantis unichis di { $component } di gjenar { $type }, parcè che { $attribute } nol è { $expected ->
        [letters-combination] une cumbinazion di letaris
        [math-expression] une espression matematiche valide
        [integer] un numar intîr
       *[number] un numar
    }.

variant-length-not-integer = no si pues determinâ lis variantis unichis di { $component }, parcè che length nol è un numar intîr.

variant-sort-not-implemented = lis variantis unichis di un { $component } cun sort no son ancjemò implementadis

variant-exclude-combinations-not-implemented = lis variantis unichis di un { $component } cun excludeCombinations no son ancjemò implementadis

variant-math-exclude-not-implemented = lis variantis unichis di un { $component } di gjenar math cun exclude no son ancjemò implementadis

variant-non-constant-exclude-not-implemented = lis variantis unichis di un { $component } cun un exclude no costant no son ancjemò implementadis

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: nol è supuartât tal renderizadôr prefigure dal grafic; il dissendent al ven saltât.

prefigure-descendant-invalid-geometry = { $subject }: gjeometrie no finide o no complete; il dissendent al ven saltât.

prefigure-curve-label-omitted = { $subject }: lis etichetis no son supuartadis sui elements di curve convertîts; la etichete e ven lassade fûr.

prefigure-curve-unsupported-definition-type = { $subject }: gjenar di definizion de curve '{ $definitionType }' no supuartât; il dissendent al ven saltât.

prefigure-region-flip-functions-unsupported = { $subject }: atribût flipFunctions no supuartât su regionBetweenCurves; il dissendent al ven saltât.

prefigure-region-non-formula-child = { $subject }: dome lis funzions fi di gjenar formule a son supuartadis su regionBetweenCurves; il dissendent al ven saltât.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' no supuartât par { $labelKind ->
        [line-family] une etichete de famee des liniis
       *[point] une etichete di pont
    }; si dopre l'alineament predefinît di PreFigure.

prefigure-fill-style-unsupported = { $subject }: il stîl di jemplament '{ $fillStyle }' nol è supuartât di PreFigure; si torne a un jemplament plen.

prefigure-line-style-unknown = { $subject }: il stîl di linie no cognossût '{ $lineStyle }' al è lassât fûr dal output di PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: il stîl di marcadôr '{ $markerStyle }' al è stât mapât sul stîl PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: il stîl di marcadôr '{ $markerStyle }' nol è supuartât di PreFigure; si dopre il stîl predefinît.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` no valit; no si pues risolvi il destinatari. La anotazion e ven lassade fûr.

annotation-ref-multiple-targets = `<annotation>`: `ref` al è stât risolt in plui destinataris; si dopre il prin.

annotation-ref-outside-graph = `<annotation>`: `ref` no valit; il destinatari al è fûr dal grafic che lu conten. La anotazion e ven lassade fûr.

annotation-ref-unsupported-target = `<annotation>`: `ref` no valit; il destinatari nol è un ogjet grafic supuartât te conversion prefigure. La anotazion e ven lassade fûr.

annotation-text-missing = `<annotation>`: `text` al mancje o al è vueit; si mande fûr test vueit.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Si à cjatât une dipendence circolâr.
       *[other] Si à cjatât une dipendence circolâr che e cjape dentri un component `<{ $componentType }>`.
    }

reference-no-referent = Nissun referent cjatât pal riferiment: `{ $reference }`

reference-multiple-referents = Plui referents cjatâts pal riferiment: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format no valit pal atribût { $attribute } di `<{ $componentType }>`.

children-invalid = Fîs no valits par `<{ $componentType }>`: si à cjatât fîs no valits: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valôr no valit `{ $value }` pal atribût `{ $attribute }`, si dopre il valôr `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Version di DoenetML { $version } no cjatade.
       *[other] Version di DoenetML { $version } no cjatade. Si torne ae version { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML no valit: { $content }

parse-tag-missing-close-tag = DoenetML no valit: Il tag `{ $tag }` nol à un tag di sieradure. Si spietave un tag che si siere di bessôl o un tag `</{ $tagName }>`.

parse-tag-error = DoenetML no valit: Erôr tal tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML no valit: Al pâr che al atribût no valit `{ $attribute }` i mancji un valôr.

parse-attribute-invalid = DoenetML no valit: Atribût no valit `{ $attribute }`

parse-attribute-value-invalid = DoenetML no valit: Valôr di atribût no valit `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML no valit: Valôr di atribût no valit `{ $value }`. Lis virgulutis no si corispuindin. Al pâr che ti mancji un `{ $quote }`

parse-open-tag-name-missing = DoenetML no valit: Si à cjatât un tag cence non di tag, p.e. `<`

parse-tag-not-closed = DoenetML no valit: Il tag `{ $tag }` nol è stât sierât (al pâr che al mancji un `>`).

parse-self-closing-tag-name-missing = DoenetML no valit: Si à cjatât un tag cence non di tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML no valit: Il tag `{ $tag }` nol è stât sierât (al pâr che al mancji `/>`).

parse-tag-invalid-attributes = DoenetML no valit: Il tag `{ $tag }` nol è valit. Al podarès vê atribûts sbaliâts.

parse-close-tag-name-missing = DoenetML no valit: Si à cjatât un tag di sieradure cence non di tag, p.e. `</`

parse-attribute-value-unquoted = I valôrs dai atribûts a àn di jessi tra virgulutis: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML no valit: Si à cjatât il tag di sieradure `{ $tag }`, ma nissun tag di vierdure corispuindent

parse-close-tag-mismatched = DoenetML no valit: Tag di sieradure che nol corispuint. Si spietave `</{ $expected }>`. Si à cjatât `{ $found }`

parser-node-unconvertible = No si è rivâts a convertî il grop { $node } intun grop Dast.

## Names

name-attribute-invalid =
    Atribût no valit name='{ $name }'. { $reason ->
        [characters] I nons a puedin vê dome letaris, numars, sotliniis o tratuts.
       *[start] I nons a àn di scomençâ cuntune letare.
    }

component-name-invalid-start = Non di component no valit "{ $name }". I nons a àn di scomençâ cuntune letare.

## `<answer>` sugar

answer-video-watched-missing-video = Une rispueste di gjenar videoWatched e à di vê un atribût video

answer-video-watched-video-not-reference = Une rispueste di gjenar videoWatched e à di vê un atribût video che al sedi un riferiment

answer-name-not-single-text = L'atribût name de rispueste al à di vê un sôl fi di test

## Referencing another document

external-doenetml-recursion-limit = No si pues recuperâ il DoenetML esterni par vie di masse nivei di ricorsion. Isal un riferiment circolâr?

external-doenetml-unavailable = No si pues recuperâ il DoenetML di { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML no valit recuperât di { $attribute }="{ $uri }": nol coincideve cul gjenar di component "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] L'atribût `{ $from }` al è sorpassât; dopre `{ $to }` invezit.
       *[other] [deprecation] L'atribût `{ $from }` su `<{ $component }>` al è sorpassât; dopre `{ $to }` invezit.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] L'atribût `{ $from }` al è sorpassât e al ven ignorât parcè che al è dât ancje `{ $to }`.
       *[other] [deprecation] L'atribût `{ $from }` su `<{ $component }>` al è sorpassât e al ven ignorât parcè che al è dât ancje `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] L'atribût `{ $attribute }` su `<{ $component }>` al è sorpassât e al ven ignorât.

deprecated-attribute-to-child = [deprecation] L'atribût `{ $attribute }` su `<{ $component }>` al è sorpassât; dopre invezit un fi `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Il valôr `{ $value }` dal atribût `{ $attribute }` su `<{ $component }>` al è sorpassât; dopre `{ $to }` invezit.


## Language coverage

pluralize-english-only = `<pluralize>` al pues meti al plurâl dome l'inglês, cussì il so test al reste tâl e cuâl intun document scrit in { $locale }. Scrîf la forme plurâl dret, o metile cul atribût `pluralForm`.


## Checking against the schema

schema-element-unrecognized = L'element `<{ $tag }>` nol è un element Doenet ricognossût.

schema-element-not-allowed-at-root = L'element `<{ $tag }>` nol è permetût te lidrîs dal document.

schema-element-not-allowed-inside = L'element `<{ $tag }>` nol è permetût dentri di `<{ $parent }>`.

schema-attribute-unrecognized = L'element `<{ $tag }>` nol à un atribût clamât `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] L'atribût `{ $attribute }` dal element `<{ $tag }>` al à di jessi une liste che ogni element al sedi un tra: { $allowed }
       *[other] L'atribût `{ $attribute }` dal element `<{ $tag }>` al à di jessi un tra: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Non di variante no valit par select.  Il non di variante { $variantName } al comparìs in { $numOptions } opzions ma il numar di sielgi al è { $numToSelect }.

select-variant-name-without-options = A son dadis cualchi variante par select ma nissune opzion pal non di variante pussibil: { $variantName }.

select-variant-name-not-possible = Il non di variante { $variantName } dât par select nol è un non di variante pussibil.

select-too-few-options = No si pues sielgi { $numToSelect } components di nome { $numOptions }.

select-from-sequence-too-few-values = No si pues sielgi { $numToSelect } valôrs di une secuence di lungjece { $length }.

select-from-sequence-indices-count-mismatch = Il numar di indics dâts par select al à di corispuindi al numar di sielgi

select-from-sequence-indices-not-integers = Ducj i indics dâts par select a àn di jessi numars intîrs

select-from-sequence-index-excluded = L'indiç dât di selectfromsequence al jere esclus

select-from-sequence-indices-excluded-combination = I indics dâts di selectfromsequence a jerin une cumbinazion escludude

select-from-sequence-coprime-not-positive-integers = No si pues sielgi cumbinazions coprimis parcè che no si sielç numars intîrs positîfs.

select-from-sequence-coprime-common-factor = No si pues sielgi numars coprims. Ducj i valôrs pussibii a àn un fatôr comun. (I valôrs dâts di "from" o "to" a àn di jessi coprims cun "step".)

select-from-sequence-coprime-single-number = No si pues sielgi cumbinazions coprimis di un numar sôl che nol è 1.

select-from-sequence-excluded-too-many-combinations = Si à escludût plui dal 70% des cumbinazions in selectFromSequence

select-from-sequence-coprime-none-found = No si è rivâts a sielgi numars coprims. Ducj i valôrs pussibii a àn un fatôr comun.

select-from-sequence-too-few-unique-values = No si pues sielgi { $numToSelect } valôrs unics di une secuence di lungjece { $numPossibleValues }

select-prime-numbers-too-few-values = No si pues sielgi { $numToSelect } valôrs di une liste di numars prins di lungjece { $numValues }

select-prime-numbers-values-count-mismatch = Il numar di valôrs dâts par select al à di corispuindi al numar di sielgi

select-prime-numbers-values-not-prime = Ducj i valôrs dâts par select di numars prins a àn di jessi te liste dai numars prins

select-prime-numbers-values-excluded-combination = I valôrs dâts di selectPrimeNumbers a jerin une cumbinazion escludude

select-prime-numbers-excluded-too-many-combinations = Si à escludût plui dal 70% des cumbinazions in selectPrimeNumbers

select-random-combination-fluke = Par une cumbinazion straordenarimentri improbabile, no si è rivâts a sielgi une cumbinazion di valôrs a câs

select-random-value-fluke = Par une cumbinazion straordenarimentri improbabile, no si è rivâts a sielgi un valôr a câs

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` nol ven dissegnât dentri de matematiche; la espression e ven composte come e jere prime che si podessin meti inputs dentri. { $reason ->
        [not-inline] Dome un input di sielte `inline` al sta dentri di une espression; cence `inline` al è un bloc di botons.
        [expanded] Un input di test `expanded` al è une casele su plui riis, masse grande par stâ dentri di une espression.
        [on-graph] Suntun grafic la espression e ven dissegnade come une figure sole, che no à puest par un control.
       *[relative-width] La sô `width` e je relative (une percentuâl o `em`), e no à nuie di misurâ dentri di une espression. Da la largjece in unitâts assolutis, come `px`, invezit.
    }
