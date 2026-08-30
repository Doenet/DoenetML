# Piedmontese (piemontèis) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The grafìa piemontèisa; see `chrome.ftl` for the note on
# «ë», «ò», «ù», «n-» and «eu».
#
# **The verbal particle is this file's quickest check.** A finite verb takes
# «a» or «as» before it — «a l'é», «a son», «as peul nen», «a l'ha» — and the
# negation is postverbal «nen». A sentence here without one of those is very
# likely still Italian.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber` — are part of the language, not prose,
# and stay in English exactly as written. So does anything quoted back from the
# author's own source, and so do `WCAG AA`, `DoenetML`, `PreFigure` and
# `prefigure`, which are names.
#
# **Number.** CLDR has no plural rules for `pms`, so no `zero`, `two`, `few` or
# `many` branch appears anywhere. Every **symbolic** selector — `$type`,
# `$mode`, `$reason`, `$context`, `$suggestion`, `$alternative`, `$fallback`,
# `$expected`, `$labelKind`, `$isList`, `$componentType` — is kept byte for
# byte from English, keys included.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } a ven ignorà quand ch'as dan doi estrem
       *[other] { $attributes } a vëno ignorà quand ch'as dan doi estrem
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } a ven ignorà quand ch'as dan n'estrem e un pont ëd mes
       *[other] { $attributes } a vëno ignorà quand ch'as dan n'estrem e un pont ëd mes
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset a l'ha nen d'efet sensa un pont ëd mes

## `<line>`

line-points-undetermined-dimensions = Linia për pont ëd dimension nen determinà.

line-points-too-few-dimensions = Na linia a deuv passè për pont ëd almanch doe dimension.

line-points-depend-on-variables = La linia a passa për pont ch'a dipendo da le variàbij: { $variables }.

line-equation-invalid-format = Formà nen bon për l'equassion ëd la linia ant le variàbij { $variable1 } e { $variable2 }.

## `<ray>`

ray-overprescribed-through = La semirëtta a l'é definìa da through, endpoint e direction.  Ël through dàit a ven ignorà.

ray-dimension-mismatch = numDimensions a corispond nen ant la semirëtta.

## `<vector>`

vector-overprescribed-head = Ël vetor a l'é definì da head, tail e displacement.  Ël head dàit a ven ignorà.

vector-dimension-mismatch = numDimensions a corispond nen ant ël vetor.

## Attracting and constraining

attract-to-without-nearest-point = As peul nen tirè vers un `<{ $component }>`, përché a l'ha nen la variàbil ëd stat nearestPoint.

constrain-to-without-nearest-point = As peul nen vincolè a un `<{ $component }>`, përché a l'ha nen la variàbil ëd stat nearestPoint.

constrain-to-interior-without-nearest-point = As peul nen vincolè a l'andrinta ëd un `<{ $component }>`, përché a l'ha nen la variàbil ëd stat nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition a ven ignorà për un choiceInput ch'a l'é nen inline

## Ordering children by index

choice-input-indices-count-mismatch = As ignoro j'ìndes dàit për choiceInput, përché ël nùmer d'ìndes a corispond nen al nùmer ëd fieuj choice.

pretzel-indices-count-mismatch = As ignoro j'ìndes dàit për problem, përché ël nùmer d'ìndes a corispond nen al nùmer ëd fieuj problem.

shuffle-indices-count-mismatch = As ignoro j'ìndes dàit për shuffle, përché ël nùmer d'ìndes a corispond nen al nùmer ëd component.

indices-ignored-out-of-range = As ignoro j'ìndes dàit për { $component }, përché quàich ìndes a l'é fòra da l'antërval.

pretzel-indices-repeated = As ignoro j'ìndes dàit për pretzel, përché quàich ìndes a l'é ripetù.

pretzel-circuit-first-index = As ignoro j'ìndes dàit për pretzel an manera circuit, përché ël prim ìndes a deuv esse 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Përché `<{ $component }>` a fonsion-a con ëd fieuj ëd test, a-i va dait n'atribut `type`.

invalid-type-defaulting-to-math = Sòrt { $type } nen bon-a për ël component { $component }. A deuv esse un tra math, text, number o boolean. As dòvra math.

string-not-valid-component-to-arrange = Ël test "{ $value }" a l'é nen un component bon da { $component }. As lo ignora.

## Types and variables

invalid-type-defaulting-to-number = Sòrt { $type } nen bon-a, as buta la sòrt a number.

invalid-variable-value = Valor nen bon ëd na variàbil: `{ $value }`

## Variants

variant-index-must-be-number = L'ìndes ëd variant { $index } a deuv esse un nùmer

variant-index-must-be-integer = L'ìndes ëd variant { $index } a deuv esse un nùmer antregh

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` a l'é nen fàit për ëd mzure assolùe. As buto le larghësse a relative.

side-by-side-absolute-margins = `<{ $component }>` a l'é nen fàit për ëd mzure assolùe. As buto ij màrgin a relativ.

side-by-side-no-block-child = `<{ $component }>` nen bon: a deuv avèj almanch un fieul ëd blòch.

## `<label>`

label-for-ignored-on-graphical = L'atribut `for` an sun na `<label>` gràfica a ven ignorà.

label-for-must-resolve-to-one = L'atribut `for` an sun `<label>` a deuv arzòlvse an giust un component.

label-for-unresolved = L'atribut `for` an sun `<label>` a l'é nen podusse arzòlve an un component.

label-for-answer-with-authored-inputs = L'atribut `for` an sun `<label>` a fa riferiment a un `<answer>` con d'input scrit a man; fa riferiment drit a l'input.

label-for-answer-without-input = L'atribut `for` an sun `<label>` a fa riferiment a un `<answer>` sensa un input da etichetè.

label-for-must-reference-input-or-answer = L'atribut `for` an sun `<label>` a deuv fè riferiment a un input o a na rispòsta.

## Accessibility

accessibility-short-description-or-decorative = Për l'assessibilità, `<{ $component }>` a deuv avèj na descrission curta o esse marcà coma decorativ.

accessibility-video-short-description = Për l'assessibilità, `<video>` a deuv avèj na descrission curta.

accessibility-input-short-description-or-label = Për l'assessibilità, `<{ $component }>` a deuv avèj na descrission curta o n'etichëtta.

accessibility-answer-input-short-description-or-label = Për l'assessibilità, un `<answer>` ch'a crea un input a deuv avèj na descrission curta o n'etichëtta.

accessibility-short-description-contains-math = Le descrission curte a l'han nen da avèj andrinta ëd component matemàtich coma `<{ $component }>`. Scriv la matemàtica con ëd paròle.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } a l'ha nen basta contrast për ël test dël tìtol dla session (manera scura) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a-i va almanch { $threshold }:1).
       *[other] { $colorName } a l'ha nen basta contrast për ël test dël tìtol dla session ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a-i va almanch { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Un `<circle>` për { $count } pont a l'é nen fàit për ël cas che ij pont a l'abio nen ëd valor numérich.

circle-too-many-through-points = As peul nen calcolè un sercc për pì che 3 pont.

circle-overprescribed-radius-center-points = As peul nen calcolè un sercc con ragg, sènter e pont ëd passagi dàit.

circle-center-with-multiple-points = As peul nen calcolè un sercc con sènter dàit për pì che 1 pont.

circle-radius-too-small = As peul nen calcolè ël sercc: dàit che la distansa tra ij doi pont a l'é { $distance }, ël ragg dàit { $radius } a l'é tròp cit.

circle-radius-with-many-points = As peul nen fè un sercc për pì che doi pont con un ragg dàit.

circle-invalid-center-or-through-points = Sènter o pont ëd passagi dël sercc nen bon.

circle-radius-center-with-multiple-points = As peul nen calcolè ël ragg ëd un sercc con sènter dàit për pì che 1 pont.

circle-change-radius-non-numerical = As peul nen cambiè ël ragg ëd un sercc con pont ëd passagi nen numérich

circle-radius-with-points-non-numerical = As peul nen fè un sercc për pì che un pont con un ragg dàit quand ch'a-i son nen ëd valor numérich.

circle-change-center-non-numerical = Cambiè ël sènter ëd un sercc për pont sensa valor numérich a l'é ancó nen fàit.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Dimension nen basta për ël domini dla fonsion. Ël domini a l'ha { $intervals } antërval ma la fonsion a l'ha { $inputs } input.
       *[other] Dimension nen basta për ël domini dla fonsion. Ël domini a l'ha { $intervals } antërval ma la fonsion a l'ha { $inputs } input.
    }

function-domain-invalid-format = Formà nen bon për ël domini dla fonsion.

function-ignoring-non-numerical =
    { $type ->
        [maximum] As ignora un màssim dla fonsion ch'a l'é nen numérich.
        [minimum] As ignora un mìnim dla fonsion ch'a l'é nen numérich.
        [extremum] As ignora un estrem dla fonsion ch'a l'é nen numérich.
        [point] As ignora un pont dla fonsion ch'a l'é nen numérich.
        [slope] As ignora na pendensa dla fonsion ch'a l'é nen numérica.
       *[other] As ignora un { $type } dla fonsion ch'a l'é nen numérich.
    }

function-ignoring-empty =
    { $type ->
        [maximum] As ignora un màssim veuid dla fonsion.
        [minimum] As ignora un mìnim veuid dla fonsion.
        [extremum] As ignora un estrem veuid dla fonsion.
        [point] As ignora un pont veuid dla fonsion.
       *[other] As ignora un { $type } veuid dla fonsion.
    }

function-points-too-close = La fonsion a l'ha doi pont tròp davzin un a l'àutr. As peul nen definì la fonsion.

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] J'iterassion ëd na fonsion a son possìbij mach se ël nùmer d'input a l'é ël midem dël nùmer d'output. Sta fonsion a l'ha { $inputs } input e { $outputs } output.
    }

## `<sequence>`

sequence-invalid-length = Longhëssa dla sequensa nen bon-a.  A deuv esse un nùmer antregh nen negativ.

sequence-invalid-step = Pass dla sequensa nen bon.  A deuv esse un nùmer për na sequensa ëd sòrt { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" nen bon ëd na sequensa ëd nùmer.  A deuv esse un nùmer.

sequence-invalid-endpoint-letters = "{ $attribute }" nen bon ëd na sequensa ëd litre.  A deuv esse na combinassion ëd litre.

sequence-invalid-endpoint = "{ $attribute }" dla sequensa nen bon.

select-from-sequence-coprime-not-numbers = coprime a ven ignorà përché as sern nen ëd nùmer

select-from-sequence-coprime-with-exclude-combinations = coprime a ven ignorà përché a l'é dàit excludeCombinations

## Resolving a `target`

target-not-found = target nen bon për `<{ $source }>`: as treuva nen ël destinatari.

target-state-variable-not-found = target nen bon për `<{ $source }>`: as treuva nen na variàbil ëd stat ciamà "{ $property }" an sun un `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Le variàbij ëd `<odeSystem>` a l'han da esse diverse da la variàbil indipendenta.

ode-system-duplicate-variable-names = As peul nen definì le fonsion RHS ëd l'ODE con ëd nòm ëd variàbij dipendente ripetù.

ode-system-rhs-function-error = As peul nen definì la fonsion RHS ëd l'ODE.  Eror ant la creassion dla fonsion mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = As peul nen definì n'àngol tra { $count } linie

angle-invalid-through-point = Pont nen bon an through ëd `<angle>`

parabola-vertex-too-many-points = Na paràbola con vertes për pì che 1 pont a l'é ancó nen fàita.

parabola-too-many-points = Na paràbola për pì che 3 pont a l'é ancó nen fàita.

intersection-too-many-items = L'antërsession ëd pì che doi element a l'é ancó nen fàita

## Other math components

ionic-compound-not-two-ions = Un compòst iònich ëd àutr che doi ion a l'é ancó nen fàit.

ionic-compound-needs-cation-and-anion = Ël compòst iònich a l'é fàit mach për un cation e un anion.

solve-equations-cannot-evaluate = As peul nen arzòlve l'equassion përché as é nen podusse valutèla: { $equation }

math-operators-operand-number-required = A-i va dait n'operandNumber quand ch'as tira fòra n'operand matemàtich.

eigen-decomposition-failed = As é nen riussisse a calcolè j'autovalor dla matris

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: ël paràmetr { $parameters } a compar nen ant ël model, parèj a andrà sempe a stè con un veuid.
       *[other] `<matchesPattern>`: ij paràmetr { $parameters } a comparo nen ant ël model, parèj a andran sempe a stè con un veuid.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: as peul nen interpretè grid="{ $grid }". A deuv esse none, medium, dense o doi nùmer positiv separà da në spassi, coma grid="1 0.5". As dissegna gnun-a grija.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` a l'ha da manca ëd na fonsion con { $expected ->
        [one] n'output, la pendensa y' an minca pont, coma `y - x`
       *[other] doi output, ël vetor an minca pont, coma `(y, -x)`
    }, ma la fonsion dàita a l'ha { $found } output. { $alternative ->
        [none] As dissegna gnente.
       *[other] `<{ $alternative }>` a l'é ël component për cola fonsion. As dissegna gnente.
    }

field-function-attribute-ignored-with-child = L'atribut `function` a ven ignorà përché la fonsion a l'é dàita ëdcò andrinta al component; as dòvra cola andrinta. Da la fonsion mach an un-a dle doe manere.

field-variables-ignored =
    `<{ $component }>`: l'atribut `variables` a nòmina le variàbij ëd n'espression scrita drit andrinta al component. { $reason ->
        [function-child] La fonsion sì a l'é dàita coma fieul `<function>`, ch'a nòmina soe variàbij, parèj `variables` a ven ignorà.
       *[no-expression] Sì a-i é gnun-a espression ëd cola sòrt, parèj `variables` a ven ignorà.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" a l'é nen sostnù ant ël renderisador prefigure; as dòvra ël comportament dla posission a drita.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" a l'é nen sostnù ant ël renderisador prefigure; as dòvra ël comportament dla posission an àut.

prefigure-invalid-axis-bounds = `<graph>`: lìmit dj'ass nen bon për la conversion prefigure; as dòvra ël bbox predefinì (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: largura nen bon-a për la conversion prefigure; as dòvra la largura predefinìa dël diagrama 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio nen bon për la conversion prefigure; as dòvra la proporsion predefinìa 1.

prefigure-grid-spacing-too-fine = `<graph>`: la grija a l'é tròp fin-a për ij lìmit dj'ass; la grija a resta fòra ant ël renderisador prefigure.

prefigure-annotations-not-rendered = `<graph>`: j'anotassion a son nen dissegnà quand ch'as dòvra nen ël renderisador PreFigure.

multiple-annotations-children = As son trovasse pì fieuj `<annotations>` an `<graph>`; tuti fòra che l'ùltim a son ignorà.

## Referring to other components

copy-unrecognized-component-type = As peul nen ëstende o copiè na sòrt ëd component nen arconossùa: { $type }.

copy-prop-not-found = As é nen trovasse la proprietà { $property } an sun un component ëd sòrt { $component }

collect-no-source = Gnun-a sorgiss trovà për collect.

collect-invalid-component-type = As peul nen cheuje ëd component ëd sòrt `<{ $component }>`, përché a l'é na sòrt ëd component nen bon-a.

reference-index-unavailable = As peul nen fè riferiment a l'ìndes `{ $reference }`

## `<callAction>`

component-action-unavailable = As peul nen ciamè { $action } an sël component `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Ij dat a l'han na forma nen bon-a.  Le righe a l'han ëd longhësse diverse. Trovà an componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Ij dat a l'han ëd nòm ëd colòna ripetù.  Trovà an componentIdx :{ $componentIdx }

data-frame-missing-column-name = Ai dat a-i manca un nòm ëd colòna.  Trovà an componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Un premi për sta rispòsta a l'é basà an sla rispòsta mandà dal tag answer midem, e sòn a portrà a un comportament nen spetà.

answer-max-num-attempts-in-section-wide-check-work = Butè `maxNumAttempts` an sun un `<answer>` andrinta a un contenidor con `sectionWideCheckWork` a l'ha nen d'efet, përché ël nùmer ëd tentativ a l'é controlà dal contenidor. Buta `maxNumAttempts` an sël contenidor pitòst.

nested-section-wide-check-work-max-num-attempts = Butè `maxNumAttempts` an sun un contenidor con `sectionWideCheckWork` ch'a stà andrinta a n'àutr contenidor con `sectionWideCheckWork` a l'ha nen d'efet, përché ël nùmer ëd tentativ a l'é controlà dal contenidor ëd fòra. Buta `maxNumAttempts` an sël contenidor ëd fòra pitòst.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] L'atribut { $attributes } a l'avrà nen d'efet sensa symbolicEquality butà.
       *[other] J'atribut { $attributes } a l'avran nen d'efet sensa symbolicEquality butà.
    }

answer-invalid-type = Sòrt nen bon-a për la rispòsta: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Sicoma che ël component `<{ $component }>` a l'ha nen un nòm, as peul nen dovrèlo coma atribut ëd mòdul

module-attribute-name-already-defined = Ël component `<{ $component } name="{ $name }">` as peul nen dovrèlo coma atribut ëd un mòdul përché la sòrt ëd component `<module>` a l'ha già n'atribut "{ $name }" definì.

conditional-content-condition-ignored = L'atribut `condition` a ven ignorà an sun un component `<conditionalContent>` con ëd fieuj case o else.

slider-markers-type-mismatch = La sòrt dij marcador a corispond nen a la sòrt dël slider.

pretzel-problem-needs-statement-and-answer = pretzel nen bon: minca `<problem>` a deuv avèj andrinta un `<statement>` e un `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel nen bon: an mode="circuit", ël prim `<problem>` a peul nen esse un distrator.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Valor nen bon { $values } për l'atribut `{ $attribute }`; as lo ignora.
       *[other] Valor nen bon { $values } për l'atribut `{ $attribute }`; as ij ignora.
    }

attribute-must-be-references = Valor nen bon `{ $value }` për l'atribut `{ $attribute }`. L'atribut a deuv esse fàit ëd riferiment ch'a ancamin-o con un `$`.

math-input-invalid-function-names = <mathInput>: as son ignorasse ëd nòm ëd fonsion nen bon an { $attribute }: { $names }. Ël tòch mostrà ëd minca nòm a deuv avèj almanch 2 caràter (litre o tratin); dòp a peul ven-e un sufiss opsional `|<alternativa mathspeak>`.

## Building components from the source

component-type-invalid = Sòrt ëd component nen bon-a: `<{ $componentType }>`

attribute-repeated = As peul nen ripete l'atribut { $attribute }.

attribute-invalid-for-component = Atribut "{ $attribute }" nen bon për un component ëd sòrt `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    La definission ëd stil { $styleNumber } a l'ha nen basta contrast për { $context ->
        [text-on-background] ël color dël test contra ël color dël fond
        [high-contrast] ël color a àut contrast contra la tèila
        [line] ël color dla linia contra la tèila
        [marker] ël color dël marcador contra la tèila
       *[text-on-canvas] ël color dël test contra la tèila
    }{ $mode ->
        [dark] { " (manera scura)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a-i va almanch { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Combin che la definission ëd stil { $styleNumber } a l'abia ëd color ch'a dan basta contrast për la manera ciàira, ij color për la manera scura tirà fòra da sti valor a l'han nen basta contrast tra ël color dël test e ël color dël fond ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a-i va almanch { $threshold }:1). { $suggestion ->
        [available] Për avèj basta contrast ant la manera scura, o àussa ël contrast dla manera ciàira (p.es. buta { $lightAttribute }="{ $lightColor }") o passa dzora al color dla manera scura (p.es. buta { $darkAttribute }="{ $darkColor }").
       *[none] Për avèj basta contrast ant la manera scura, àussa ël contrast dla manera ciàira o passa dzora ai color tirà fòra con textColorDarkMode e/o backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Combin che la definission ëd stil { $styleNumber } a l'abia un color dël test ch'a dà basta contrast për la manera ciàira, ël color dël test për la manera scura tirà fòra da col valor a l'ha nen basta contrast contra la tèila ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a-i va almanch { $threshold }:1). { $suggestion ->
        [available] Për avèj basta contrast ant la manera scura, o àussa ël contrast dla manera ciàira (p.es. buta textColor="{ $lightColor }") o passa dzora al color dla manera scura (p.es. buta textColorDarkMode="{ $darkColor }").
       *[none] Për avèj basta contrast ant la manera scura, àussa ël contrast dla manera ciàira o passa dzora al color tirà fòra con textColorDarkMode.
    }

section-multiple-style-palettes = Na session a peul serne mach un <stylePalette>; as dòvra l'ùltim.

## Unique variants

variant-num-to-select-not-non-negative-integer = as peul nen determinè ij variant ùnich ëd { $component }, përché numToSelect a l'é nen un nùmer antregh nen negativ.

variant-num-to-select-not-constant-number = as peul nen determinè ij variant ùnich ëd { $component }, përché numToSelect a l'é nen un nùmer costant.

variant-with-replacement-not-constant-boolean = as peul nen determinè ij variant ùnich ëd { $component }, përché withReplacement a l'é nen un boolean costant.

variant-select-weight-disables-unique = Ij variant ùnich për select a son disativà se n'opsion a l'ha selectWeight o selectForVariants dàit

variant-coprime-undetermined = as peul nen determinè ij variant ùnich ëd { $component }, përché as peul nen determinè che coprime a sia sempe fàuss.

variant-attribute-not-constant = as peul nen determinè ij variant ùnich ëd { $component }, përché { $attribute } a l'é nen na costanta.

variant-attribute-not-number = as peul nen determinè ij variant ùnich ëd { $component }, përché { $attribute } a l'é nen un nùmer.

variant-attribute-wrong-type-for-sequence =
    as peul nen determinè ij variant ùnich ëd { $component } ëd sòrt { $type }, përché { $attribute } a l'é nen { $expected ->
        [letters-combination] na combinassion ëd litre
        [math-expression] n'espression matemàtica bon-a
        [integer] un nùmer antregh
       *[number] un nùmer
    }.

variant-length-not-integer = as peul nen determinè ij variant ùnich ëd { $component }, përché length a l'é nen un nùmer antregh.

variant-sort-not-implemented = ij variant ùnich ëd un { $component } con sort a son ancó nen fàit

variant-exclude-combinations-not-implemented = ij variant ùnich ëd un { $component } con excludeCombinations a son ancó nen fàit

variant-math-exclude-not-implemented = ij variant ùnich ëd un { $component } ëd sòrt math con exclude a son ancó nen fàit

variant-non-constant-exclude-not-implemented = ij variant ùnich ëd un { $component } con n'exclude nen costant a son ancó nen fàit

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: a l'é nen sostnù ant ël renderisador prefigure dël gràfich; ël dissendent a l'é sautà.

prefigure-descendant-invalid-geometry = { $subject }: geometrìa nen finìa o nen completa; ël dissendent a l'é sautà.

prefigure-curve-label-omitted = { $subject }: j'etichëtte a son nen sostnùe an sj'element ëd curva convertì; l'etichëtta a resta fòra.

prefigure-curve-unsupported-definition-type = { $subject }: sòrt ëd definission dla curva '{ $definitionType }' nen sostnùa; ël dissendent a l'é sautà.

prefigure-region-flip-functions-unsupported = { $subject }: atribut flipFunctions nen sostnù an sun regionBetweenCurves; ël dissendent a l'é sautà.

prefigure-region-non-formula-child = { $subject }: mach le fonsion fieul ëd sòrt fòrmula a son sostnùe an sun regionBetweenCurves; ël dissendent a l'é sautà.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' nen sostnù për { $labelKind ->
        [line-family] n'etichëtta dla famija dle linie
       *[point] n'etichëtta ëd pont
    }; as dòvra l'alineament predefinì ëd PreFigure.

prefigure-fill-style-unsupported = { $subject }: ël stil ëd pien-a '{ $fillStyle }' a l'é nen sostnù da PreFigure; as torna a na pien-a pien-a.

prefigure-line-style-unknown = { $subject }: ël stil ëd linia nen conossù '{ $lineStyle }' a resta fòra da l'output ëd PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: ël stil ëd marcador '{ $markerStyle }' a l'é stàit mapà an sël stil PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: ël stil ëd marcador '{ $markerStyle }' a l'é nen sostnù da PreFigure; as dòvra ël stil predefinì.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` nen bon; as peul nen arzòlve ël destinatari. L'anotassion a resta fòra.

annotation-ref-multiple-targets = `<annotation>`: `ref` a l'é arzolvusse an pì destinatari; as dòvra ël prim.

annotation-ref-outside-graph = `<annotation>`: `ref` nen bon; ël destinatari a l'é fòra dal gràfich ch'a lo conten. L'anotassion a resta fòra.

annotation-ref-unsupported-target = `<annotation>`: `ref` nen bon; ël destinatari a l'é nen n'oget gràfich sostnù ant la conversion prefigure. L'anotassion a resta fòra.

annotation-text-missing = `<annotation>`: `text` a manca o a l'é veuid; as manda fòra ëd test veuid.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] As é trovasse na dipendensa circolar.
       *[other] As é trovasse na dipendensa circolar ch'a pija andrinta un component `<{ $componentType }>`.
    }

reference-no-referent = Gnun referent trovà për ël riferiment: `{ $reference }`

reference-multiple-referents = Pì referent trovà për ël riferiment: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Formà nen bon për l'atribut { $attribute } ëd `<{ $componentType }>`.

children-invalid = Fieuj nen bon për `<{ $componentType }>`: as son trovasse ëd fieuj nen bon: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valor nen bon `{ $value }` për l'atribut `{ $attribute }`, as dòvra ël valor `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Version ëd DoenetML { $version } nen trovà.
       *[other] Version ëd DoenetML { $version } nen trovà. As torna a la version { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML nen bon: { $content }

parse-tag-missing-close-tag = DoenetML nen bon: Ël tag `{ $tag }` a l'ha nen un tag ëd saradura. As spetava un tag ch'as sara da sol o un tag `</{ $tagName }>`.

parse-tag-error = DoenetML nen bon: Eror ant ël tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML nen bon: A smija che a l'atribut nen bon `{ $attribute }` a-i manca un valor.

parse-attribute-invalid = DoenetML nen bon: Atribut nen bon `{ $attribute }`

parse-attribute-value-invalid = DoenetML nen bon: Valor d'atribut nen bon `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML nen bon: Valor d'atribut nen bon `{ $value }`. Le virgolëtte a corispondo nen. A smija ch'at manca un `{ $quote }`

parse-open-tag-name-missing = DoenetML nen bon: As é trovasse un tag sensa nòm ëd tag, p.es. `<`

parse-tag-not-closed = DoenetML nen bon: Ël tag `{ $tag }` a l'é nen stàit sarà (a smija ch'a manca un `>`).

parse-self-closing-tag-name-missing = DoenetML nen bon: As é trovasse un tag sensa nòm ëd tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML nen bon: Ël tag `{ $tag }` a l'é nen stàit sarà (a smija ch'a manca `/>`).

parse-tag-invalid-attributes = DoenetML nen bon: Ël tag `{ $tag }` a l'é nen bon. A podrìa avèj d'atribut sbalià.

parse-close-tag-name-missing = DoenetML nen bon: As é trovasse un tag ëd saradura sensa nòm ëd tag, p.es. `</`

parse-attribute-value-unquoted = Ij valor dj'atribut a l'han da esse tra virgolëtte: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML nen bon: As é trovasse ël tag ëd saradura `{ $tag }`, ma gnun tag d'ubertura corispondent

parse-close-tag-mismatched = DoenetML nen bon: Tag ëd saradura ch'a corispond nen. As spetava `</{ $expected }>`. As é trovasse `{ $found }`

parser-node-unconvertible = As é nen riussisse a convertì ël nòd { $node } an un nòd Dast.

## Names

name-attribute-invalid =
    Atribut nen bon name='{ $name }'. { $reason ->
        [characters] Ij nòm a peulo avèj mach ëd litre, nùmer, sotlinie o tratin.
       *[start] Ij nòm a l'han da ancaminè con na litra.
    }

component-name-invalid-start = Nòm ëd component nen bon "{ $name }". Ij nòm a l'han da ancaminè con na litra.

## `<answer>` sugar

answer-video-watched-missing-video = Na rispòsta ëd sòrt videoWatched a deuv avèj n'atribut video

answer-video-watched-video-not-reference = Na rispòsta ëd sòrt videoWatched a deuv avèj n'atribut video ch'a sia un riferiment

answer-name-not-single-text = L'atribut name dla rispòsta a deuv avèj un sol fieul ëd test

## Referencing another document

external-doenetml-recursion-limit = As peul nen pijè ël DoenetML estern për tròpi livej ëd ricorsion. A-i é un riferiment circolar?

external-doenetml-unavailable = As peul nen pijè ël DoenetML da { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML nen bon pijà da { $attribute }="{ $uri }": a corispondìa nen a la sòrt ëd component "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] L'atribut `{ $from }` a l'é passà; dòvra `{ $to }` pitòst.
       *[other] [deprecation] L'atribut `{ $from }` an sun `<{ $component }>` a l'é passà; dòvra `{ $to }` pitòst.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] L'atribut `{ $from }` a l'é passà e a ven ignorà përché a l'é dàit ëdcò `{ $to }`.
       *[other] [deprecation] L'atribut `{ $from }` an sun `<{ $component }>` a l'é passà e a ven ignorà përché a l'é dàit ëdcò `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] L'atribut `{ $attribute }` an sun `<{ $component }>` a l'é passà e a ven ignorà.

deprecated-attribute-to-child = [deprecation] L'atribut `{ $attribute }` an sun `<{ $component }>` a l'é passà; dòvra pitòst un fieul `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Ël valor `{ $value }` ëd l'atribut `{ $attribute }` an sun `<{ $component }>` a l'é passà; dòvra `{ $to }` pitòst.


## Language coverage

pluralize-english-only = `<pluralize>` a peul butè al plural mach l'inglèis, parèj sò test a resta parèj ant un document scrivù an { $locale }. Scriv la forma plural drit, o butla con l'atribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = L'element `<{ $tag }>` a l'é nen un element Doenet arconossù.

schema-element-not-allowed-at-root = L'element `<{ $tag }>` a l'é nen përmëttù a la rèis dël document.

schema-element-not-allowed-inside = L'element `<{ $tag }>` a l'é nen përmëttù andrinta a `<{ $parent }>`.

schema-attribute-unrecognized = L'element `<{ $tag }>` a l'ha nen n'atribut ciamà `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] L'atribut `{ $attribute }` ëd l'element `<{ $tag }>` a deuv esse na lista che minca element a sia un tra: { $allowed }
       *[other] L'atribut `{ $attribute }` ëd l'element `<{ $tag }>` a deuv esse un tra: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nòm ëd variant nen bon për select.  Ël nòm ëd variant { $variantName } a compar an { $numOptions } opsion ma ël nùmer da serne a l'é { $numToSelect }.

select-variant-name-without-options = A son dàit quàich variant për select ma gnun-a opsion për ël nòm ëd variant possìbil: { $variantName }.

select-variant-name-not-possible = Ël nòm ëd variant { $variantName } dàit për select a l'é nen un nòm ëd variant possìbil.

select-too-few-options = As peul nen serne { $numToSelect } component da mach { $numOptions }.

select-from-sequence-too-few-values = As peul nen serne { $numToSelect } valor da na sequensa ëd longhëssa { $length }.

select-from-sequence-indices-count-mismatch = Ël nùmer d'ìndes dàit për select a deuv corispond-e al nùmer da serne

select-from-sequence-indices-not-integers = Tuti j'ìndes dàit për select a l'han da esse ëd nùmer antregh

select-from-sequence-index-excluded = L'ìndes dàit ëd selectfromsequence a l'era esclus

select-from-sequence-indices-excluded-combination = J'ìndes dàit ëd selectfromsequence a l'ero na combinassion esclusa

select-from-sequence-coprime-not-positive-integers = As peul nen serne ëd combinassion coprime përché as sern nen ëd nùmer antregh positiv.

select-from-sequence-coprime-common-factor = As peul nen serne ëd nùmer coprim. Tuti ij valor possìbij a l'han un fator comun. (Ij valor dàit ëd "from" o "to" a l'han da esse coprim con "step".)

select-from-sequence-coprime-single-number = As peul nen serne ëd combinassion coprime da un nùmer sol ch'a l'é nen 1.

select-from-sequence-excluded-too-many-combinations = As é esclusse pì dël 70% dle combinassion an selectFromSequence

select-from-sequence-coprime-none-found = As é nen riussisse a serne ëd nùmer coprim. Tuti ij valor possìbij a l'han un fator comun.

select-from-sequence-too-few-unique-values = As peul nen serne { $numToSelect } valor ùnich da na sequensa ëd longhëssa { $numPossibleValues }

select-prime-numbers-too-few-values = As peul nen serne { $numToSelect } valor da na lista ëd nùmer prim ëd longhëssa { $numValues }

select-prime-numbers-values-count-mismatch = Ël nùmer ëd valor dàit për select a deuv corispond-e al nùmer da serne

select-prime-numbers-values-not-prime = Tuti ij valor dàit për select ëd nùmer prim a l'han da esse ant la lista dij nùmer prim

select-prime-numbers-values-excluded-combination = Ij valor dàit ëd selectPrimeNumbers a l'ero na combinassion esclusa

select-prime-numbers-excluded-too-many-combinations = As é esclusse pì dël 70% dle combinassion an selectPrimeNumbers

select-random-combination-fluke = Për un cas straordinariament improbàbil, as é nen riussisse a serne na combinassion ëd valor a cas

select-random-value-fluke = Për un cas straordinariament improbàbil, as é nen riussisse a serne un valor a cas

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` a l'é nen dissegnà andrinta a la matemàtica; l'espression a l'é composta coma a l'era prima ch'as podèissa butè d'input andrinta. { $reason ->
        [not-inline] Mach un input ëd serna `inline` a stà andrinta a n'espression; sensa `inline` a l'é un blòch ëd boton.
        [expanded] Un input ëd test `expanded` a l'é na casela an sun pì righe, tròp granda për stè andrinta a n'espression.
        [on-graph] An sun un gràfich l'espression a l'é dissegnà coma na figura sola, ch'a l'ha nen ëd pòst për un contròl.
       *[relative-width] Soa `width` a l'é relativa (na përsentual o `em`), e a l'ha gnente da mzurè andrinta a n'espression. Da la largura an unità assolùe, coma `px`, pitòst.
    }
