# Walloon (walon) diagnostics. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** Latin script, in the *rifondou walon* unified
# spelling, as `chrome.ftl` sets it out. The **Feller system** is the
# alternative and none of it is mixed in here.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# **What is Walloon's own.** The frame around every message is: «On n' pout
# nén …» for *cannot*, «passer houte di» for *to ignore* (the ordinary
# Walloon verb, not a loan), «doet» / «dvèt» for *must*, «n' a nén co stî
# fwait» for *has not been implemented*, «nén valåbe» for *invalid*, «paski»
# for *because*, «donk» for *so*, «el plaece» for *instead*, «pol moens» for
# *at least*, «todi» for *always*, «vude» for *empty*, «prémetou» for *by
# default*, «foû mode» for *deprecated*. The postposed negator is **«nén»**,
# with the preverbal `ni` dropped as Walloon ordinarily drops it. Native
# nouns doing real work here: «roye» (a source line, a row), «no» (name),
# «lete» (letter), «nuk» (node), «cogne» (shape), «raecene» (root), «modêye»
# (version — the word the Walloon software localisations use), «grile»
# (grid), «cibe» (target), «marke» (marker), «toele» (canvas), «intrêye» /
# «sôrteye» (input / output).
#
# **What is borrowed.** The mathematical and computing nouns are French,
# respelled by rifondou rules: «componint», «atribut», «valeur», «variåve»,
# «indice», «secwince», «ecwåcion», «matrice», «fonccion», «intervale»,
# «dominne», «parabole», «interseccion», «dependince», «referince»,
# «contraste», «definicion», «anotåcion», «conversion», «catyon», «anion»,
# «accessibilité», «pluriyel», «schema», «modêye». Three are English, through
# the markup itself: «balize» is French but `tag`, `prop` and `bloc` are
# taken as written. `WCAG AA`, `PreFigure`, `DoenetML` and `mathjs` are names.
#
# **The word for a line.** Here «droete» is the geometric line the `<line>`
# component means, while «roye» is a row or a line of source text.
# `content.ftl` uses «roye» for the drawn stroke it describes. The split is
# deliberate and is stated in both headers.
#
# **Counts.** CLDR has its own plural data for `wa`, with two categories,
# `one` and `other`, and Walloon's `one` covers zero as well as one. Every
# `{ $count -> … }` below therefore keeps the English `[one]`/`*[other]`
# shape. Walloon marks its plural in writing («un atribut» / «des atributs»,
# «est passé houte» / «sont passés houte»), so both branches are doing work.
#
# Walloon punctuates as French does, with a space before `:`, `;`, `?` and
# `!`. That spacing belongs to this catalog and is written out here.
#
# **Weakest first.** A reviewer should attack the parser and schema sections
# (`parse-*`, `schema-*`): they are the messages a beginner meets first, and
# they carry the densest French loan vocabulary in the file.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } est passé houte cwand les deus dbouts sont dnés
       *[other] { $attributes } sont passés houte cwand les deus dbouts sont dnés
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } est passé houte cwand on dbout et on mitan sont dnés tos les deus
       *[other] { $attributes } sont passés houte cwand on dbout et on mitan sont dnés tos les deus
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset n' a pont d' efet sins mitan

## `<line>`

line-points-undetermined-dimensions = Droete ki passe pa des ponts di dimincions nén dnêyes.

line-points-too-few-dimensions = Li droete doet passer pa des ponts d' pol moens deus dimincions.

line-points-depend-on-variables = Li droete passe pa des ponts ki dependèt di variåves : { $variables }.

line-equation-invalid-format = Format nén valåbe po l' ecwåcion d' ene droete dins les variåves { $variable1 } et { $variable2 }.

## `<ray>`

ray-overprescribed-through = Li dimeye-droete est dnêye pa through, endpoint et direction. On passe houte do through dné.

ray-dimension-mismatch = numDimensions ni corespond nén dins ray.

## `<vector>`

vector-overprescribed-head = Li vecteur est dné pa head, tail et displacement. On passe houte do head dné.

vector-dimension-mismatch = numDimensions ni corespond nén dins vector.

## Attracting and constraining

attract-to-without-nearest-point = On n' pout nén atirer viè on `<{ $component }>` paski i n' a pont d' variåve d' estat nearestPoint.

constrain-to-without-nearest-point = On n' pout nén rastrinde a on `<{ $component }>` paski i n' a pont d' variåve d' estat nearestPoint.

constrain-to-interior-without-nearest-point = On n' pout nén rastrinde å dvins d' on `<{ $component }>` paski i n' a pont d' variåve d' estat nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = on passe houte di labelPosition po on choiceInput ki n' est nén inline

## Ordering children by index

choice-input-indices-count-mismatch = On passe houte des indices dnés po choiceInput paski leu nombe ni corespond nén å nombe d' efants choice.

pretzel-indices-count-mismatch = On passe houte des indices dnés po problem paski leu nombe ni corespond nén å nombe d' efants problem.

shuffle-indices-count-mismatch = On passe houte des indices dnés po shuffle paski leu nombe ni corespond nén å nombe di componints.

indices-ignored-out-of-range = On passe houte des indices dnés po { $component } paski des cis sont foû boûsse.

pretzel-indices-repeated = On passe houte des indices dnés po pretzel paski des cis si rpetèt.

pretzel-circuit-first-index = On passe houte des indices dnés po pretzel e môde circuit paski li prumî indice doet esse 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Po k' on `<{ $component }>` ovéve avou des efants tecse, i fåt dner on atribut `type`.

invalid-type-defaulting-to-math = Li type { $type } n' est nén valåbe pol componint { $component }. I doet esse math, text, number ou boolean. On prind math.

string-not-valid-component-to-arrange = Li tecse "{ $value }" n' est nén on componint valåbe po { $component }. On passe houte.

## Types and variables

invalid-type-defaulting-to-number = Li type { $type } n' est nén valåbe, on mete li type so number.

invalid-variable-value = Valeur nén valåbe d' ene variåve : `{ $value }`

## Variants

variant-index-must-be-number = L' indice di variante { $index } doet esse on nombe

variant-index-must-be-integer = L' indice di variante { $index } doet esse on etir

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` n' a nén co stî fwait po des mzeures absolowes. Les lårdjeurs sont metowes e relatif.

side-by-side-absolute-margins = `<{ $component }>` n' a nén co stî fwait po des mzeures absolowes. Les mådjes sont metowes e relatif.

side-by-side-no-block-child = `<{ $component }>` nén valåbe : i doet aveur pol moens on efant di bloc.

## `<label>`

label-for-ignored-on-graphical = On passe houte di l' atribut `for` so on `<label>` grafike.

label-for-must-resolve-to-one = L' atribut `for` so `<label>` si doet rzoude a djustumint on componint.

label-for-unresolved = L' atribut `for` so `<label>` n' a nén polou esse rzoû a on componint.

label-for-answer-with-authored-inputs = L' atribut `for` so `<label>` fwait referince a on `<answer>` avou des tchamps d' intrêye scrîts a l' idêye ; fioz referince å tchamp lu-minme.

label-for-answer-without-input = L' atribut `for` so `<label>` fwait referince a on `<answer>` sins tchamp d' intrêye a-z etiketer.

label-for-must-reference-input-or-answer = L' atribut `for` so `<label>` doet fé referince a on tchamp d' intrêye ou a on answer.

## Accessibility

accessibility-short-description-or-decorative = Po l' accessibilité, `<{ $component }>` doet aveur ene coûte discrijhaedje ou esse dné come decoratif.

accessibility-video-short-description = Po l' accessibilité, `<video>` doet aveur ene coûte discrijhaedje.

accessibility-input-short-description-or-label = Po l' accessibilité, `<{ $component }>` doet aveur ene coûte discrijhaedje ou ene etikete.

accessibility-answer-input-short-description-or-label = Po l' accessibilité, on `<answer>` ki fwait on tchamp d' intrêye doet aveur ene coûte discrijhaedje ou ene etikete.

accessibility-short-description-contains-math = Les coûtès discrijhaedjes ni dvèt nén aveur di componints matematikes come `<{ $component }>`. Scrijhoz les matematikes avou des mots.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } n' a nén assez d' contraste pol tecse do tite del seccion (môde foncé) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1 ; i fåt pol moens { $threshold }:1).
       *[other] { $colorName } n' a nén assez d' contraste pol tecse do tite del seccion ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1 ; i fåt pol moens { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = On `<circle>` ki passe pa { $count } ponts n' a nén co stî fwait cwand les ponts n' ont pont d' valeurs limerikes.

circle-too-many-through-points = On n' pout nén carculer on ceke ki passe pa pus di 3 ponts.

circle-overprescribed-radius-center-points = On n' pout nén carculer on ceke avou l' rayon, li cinte et les ponts dnés eshonne.

circle-center-with-multiple-points = On n' pout nén carculer on ceke avou on cinte dné ki passe pa pus d' 1 pont.

circle-radius-too-small = On n' pout nén carculer li ceke : li distance inte les deus ponts estant { $distance }, li rayon dné { $radius } est pår trop ptit.

circle-radius-with-many-points = On n' pout nén fé on ceke ki passe pa pus di deus ponts avou on rayon dné.

circle-invalid-center-or-through-points = Li cinte ou les ponts d' passaedje do ceke ni sont nén valåbes.

circle-radius-center-with-multiple-points = On n' pout nén carculer li rayon d' on ceke avou on cinte dné ki passe pa pus d' 1 pont.

circle-change-radius-non-numerical = On n' pout nén candjî l' rayon d' on ceke avou des ponts nén limerikes

circle-radius-with-points-non-numerical = On n' pout nén fé on ceke ki passe pa pus d' on pont avou on rayon dné cwand les valeurs ni sont nén limerikes.

circle-change-center-non-numerical = Candjî l' cinte d' on ceke ki passe pa des ponts avou des valeurs nén limerikes n' a nén co stî fwait.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] I n' a nén assez d' dimincions pol dominne del fonccion. Li dominne a { $intervals } intervale mins l' fonccion a { $inputs ->
            [one] { $inputs } intrêye
           *[other] { $inputs } intrêyes
        }.
       *[other] I n' a nén assez d' dimincions pol dominne del fonccion. Li dominne a { $intervals } intervales mins l' fonccion a { $inputs ->
            [one] { $inputs } intrêye
           *[other] { $inputs } intrêyes
        }.
    }

function-domain-invalid-format = Format nén valåbe pol dominne del fonccion.

function-ignoring-non-numerical =
    { $type ->
        [maximum] On passe houte do macsimom nén limerike del fonccion.
        [minimum] On passe houte do minimom nén limerike del fonccion.
        [extremum] On passe houte di l' estrémom nén limerike del fonccion.
        [point] On passe houte do pont nén limerike del fonccion.
        [slope] On passe houte del pinte nén limerike del fonccion.
       *[other] On passe houte do { $type } nén limerike del fonccion.
    }

function-ignoring-empty =
    { $type ->
        [maximum] On passe houte do macsimom vude del fonccion.
        [minimum] On passe houte do minimom vude del fonccion.
        [extremum] On passe houte di l' estrémom vude del fonccion.
        [point] On passe houte do pont vude del fonccion.
       *[other] On passe houte do { $type } vude del fonccion.
    }

function-points-too-close = Li fonccion a deus ponts k' est trop près onk di l' ôte. On n' pout nén definixhe li fonccion.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Les iteråcions d' ene fonccion ni sont possibes ki si l' nombe d' intrêyes est parey å nombe di sôrteyes. Cisse fonccion chal a { $inputs } intrêye et { $outputs ->
            [one] { $outputs } sôrteye
           *[other] { $outputs } sôrteyes
        }.
       *[other] Les iteråcions d' ene fonccion ni sont possibes ki si l' nombe d' intrêyes est parey å nombe di sôrteyes. Cisse fonccion chal a { $inputs } intrêyes et { $outputs ->
            [one] { $outputs } sôrteye
           *[other] { $outputs } sôrteyes
        }.
    }

## `<sequence>`

sequence-invalid-length = Longueur nén valåbe del secwince. I doet esse on etir nén negatif.

sequence-invalid-step = Pas nén valåbe del secwince. I doet esse on nombe po ene secwince do type { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" nén valåbe d' ene secwince di nombes. I doet esse on nombe.

sequence-invalid-endpoint-letters = "{ $attribute }" nén valåbe d' ene secwince di letes. I doet esse ene combinåcion di letes.

sequence-invalid-endpoint = "{ $attribute }" nén valåbe del secwince.

select-from-sequence-coprime-not-numbers = on passe houte di coprime paski on n' tchoezixh nén des nombes

select-from-sequence-coprime-with-exclude-combinations = on passe houte di coprime paski excludeCombinations est dné

## Resolving a `target`

target-not-found = target nén valåbe po `<{ $source }>` : on n' pout nén trover l' cibe.

target-state-variable-not-found = target nén valåbe po `<{ $source }>` : on n' pout nén trover ene variåve d' estat lomêye "{ $property }" so on `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Les variåves di `<odeSystem>` dvèt esse diferinnes del variåve independante.

ode-system-duplicate-variable-names = On n' pout nén definixhe les fonccions do costé droet di l' EDO avou des nos d' variåves dependantes ki s' ripetèt.

ode-system-rhs-function-error = On n' pout nén definixhe li fonccion do costé droet di l' EDO. Aroke a l' ahivaedje del fonccion mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = On n' pout nén definixhe on andje inte { $count } droetes

angle-invalid-through-point = Pont nén valåbe dins l' through di `<angle>`

parabola-vertex-too-many-points = Ene parabole avou on somet ki passe pa pus d' 1 pont n' a nén co stî fwaite.

parabola-too-many-points = Ene parabole ki passe pa pus di 3 ponts n' a nén co stî fwaite.

intersection-too-many-items = L' interseccion di pus di deus cayets n' a nén co stî fwaite

## Other math components

ionic-compound-not-two-ions = On compôzé ionike po ôte tchoi ki deus ions n' a nén co stî fwait.

ionic-compound-needs-cation-and-anion = On compôzé ionike n' a stî fwait ki po on catyon et on anion.

solve-equations-cannot-evaluate = On n' pout nén rzoude l' ecwåcion paski ele n' a nén polou esse evaluwêye : { $equation }

math-operators-operand-number-required = I fåt dner on operandNumber cwand on saetche on operande matematike.

eigen-decomposition-failed = On n' pout nén carculer les valeurs prôpes del matrice

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>` : li paramete { $parameters } n' est nén dins l' patron, donk i corespondrè todi a on vude.
       *[other] `<matchesPattern>` : les parametes { $parameters } n' sont nén dins l' patron, donk i corespondront todi a on vude.
    }

## `<graph>`

graph-grid-invalid = `<graph>` : on n' pout nén comprinde grid="{ $grid }". I doet esse none, medium, dense, ou deus nombes pôzitifs separés d' on blanc, come grid="1 0.5". Nole grile n' est tracêye.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` a mezåjhe d' ene fonccion avou { $expected ->
        [one] ene seule sôrteye, li pinte y' a tchaeke pont, come `y - x`
       *[other] deus sôrteyes, li vecteur a tchaeke pont, come `(y, -x)`
    }, mins l' fonccion k' on lyi a dné a { $found ->
        [one] { $found } sôrteye
       *[other] { $found } sôrteyes
    }. { $alternative ->
        [none] I gn a rén d' tracî.
       *[other] `<{ $alternative }>` est l' componint po cisse fonccion la. I gn a rén d' tracî.
    }

field-function-attribute-ignored-with-child = On passe houte di l' atribut `function` paski l' fonccion est ossu dnêye å dvins do componint ; c' est l' cene do dvins k' on prind. Ni dnez l' fonccion k' d' ene des deus manîres.

field-variables-ignored =
    `<{ $component }>` : l' atribut `variables` lome les variåves d' ene espression scrîte tot droet å dvins do componint. { $reason ->
        [function-child] Li fonccion est chal dnêye come on efant `<function>`, ki lome ses prôpès variåves, donk on passe houte di `variables`.
       *[no-expression] I gn a nole sifwaite espression chal, donk on passe houte di `variables`.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>` : xLabelPosition="left" n' est nén sopoirté på module prefigure ; on prind l' comportumint del pôzicion droete.

prefigure-y-label-position-unsupported = `<graph>` : yLabelPosition="bottom" n' est nén sopoirté på module prefigure ; on prind l' comportumint del pôzicion hôte.

prefigure-invalid-axis-bounds = `<graph>` : limites d' aidjes nén valåbes pol conversion e prefigure ; on prind l' bbox prémetowe (-10,-10,10,10).

prefigure-invalid-width = `<graph>` : lårdjeur nén valåbe pol conversion e prefigure ; on prind l' lårdjeur prémetowe 425.

prefigure-invalid-aspect-ratio = `<graph>` : aspectRatio nén valåbe pol conversion e prefigure ; on prind l' rapoirt prémetou 1.

prefigure-grid-spacing-too-fine = `<graph>` : l' espåçmint del grile est trop fén po les limites des aidjes ; li grile est omjhe dins l' module prefigure.

prefigure-annotations-not-rendered = `<graph>` : les anotåcions n' seront nén håynêyes cwand on n' eploye nén l' module PreFigure.

multiple-annotations-children = Pus d' on efant `<annotations>` di trové dins `<graph>` ; on passe houte di tos les cis foû do dierin.

## Referring to other components

copy-unrecognized-component-type = On n' pout nén stinde ou copyî on type di componint nén kinoxhou : { $type }.

copy-prop-not-found = On n' pout nén trover l' prop { $property } so on componint do type { $component }

collect-no-source = Nole soûrdant di trové po collect.

collect-invalid-component-type = On n' pout nén ramasser des componints do type `<{ $component }>` paski c' est on type di componint nén valåbe.

reference-index-unavailable = On n' pout nén fé referince a l' indice `{ $reference }`

## `<callAction>`

component-action-unavailable = On n' pout nén houkî { $action } sol componint `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Les dnêyes ont ene cogne nén valåbe. Les royes n' ont nén l' minme longueur. Trové dins componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Les dnêyes ont des nos d' colones ki s' ripetèt. Trové dins componentIdx :{ $componentIdx }

data-frame-missing-column-name = I manke on no d' colone azès dnêyes. Trové dins componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = On award di cisse response chal si båze sol response evoyeye pal balize answer leye-minme, çou ki dnrè on comportumint nén ratindou.

answer-max-num-attempts-in-section-wide-check-work = Mete `maxNumAttempts` so on `<answer>` å dvins d' on contnou avou `sectionWideCheckWork` n' a pont d' efet, paski c' est l' contnou ki mwinne li nombe di sayes. Metoz `maxNumAttempts` sol contnou el plaece.

nested-section-wide-check-work-max-num-attempts = Mete `maxNumAttempts` so on contnou avou `sectionWideCheckWork` ki s' trouve å dvins d' on ôte contnou avou `sectionWideCheckWork` n' a pont d' efet, paski c' est l' contnou di dfoû ki mwinne li nombe di sayes. Metoz `maxNumAttempts` sol contnou di dfoû el plaece.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] L' atribut { $attributes } n' årè pont d' efet sins symbolicEquality.
       *[other] Les atributs { $attributes } n' åront pont d' efet sins symbolicEquality.
    }

answer-invalid-type = Type nén valåbe pol response : { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Come li componint `<{ $component }>` n' a pont d' no, i n' pout nén siervi come atribut d' on module

module-attribute-name-already-defined = Li componint `<{ $component } name="{ $name }">` ni pout nén siervi come atribut d' on module paski l' type di componint `<module>` a ddja on atribut "{ $name }".

conditional-content-condition-ignored = On passe houte di l' atribut `condition` so on componint `<conditionalContent>` avou des efants case ou else.

slider-markers-type-mismatch = Li type des markes ni corespond nén å type do rissôrt.

pretzel-problem-needs-statement-and-answer = pretzel nén valåbe : tchaeke `<problem>` doet aveur on `<statement>` et on `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel nén valåbe : e mode="circuit", li prumî `<problem>` ni pout nén esse on distraiwaedje.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Valeur nén valåbe { $values } po l' atribut `{ $attribute }` ; on passe houte.
       *[other] Valeurs nén valåbes { $values } po l' atribut `{ $attribute }` ; on passe houte.
    }

attribute-must-be-references = Valeur nén valåbe `{ $value }` po l' atribut `{ $attribute }`. L' atribut doet esse fwait d' referinces ki cmincèt pa on `$`.

math-input-invalid-function-names = <mathInput> : on passe houte des nos d' fonccions nén valåbes dins { $attribute } : { $names }. Li pårt håynêye di tchaeke no doet fé pol moens 2 caracteres (des letes ou des loyeus) ; on suficse `|<mathspeak alternative>` pout shure, mins n' est nén oblidjî.

## Building components from the source

component-type-invalid = Type di componint nén valåbe : `<{ $componentType }>`

attribute-repeated = On n' pout nén rpeter l' atribut { $attribute }.

attribute-invalid-for-component = Atribut "{ $attribute }" nén valåbe po on componint do type `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Li definicion di stîle { $styleNumber } n' a nén assez d' contraste po { $context ->
        [text-on-background] li coleur do tecse conte li coleur do fond
        [high-contrast] li coleur di hôt contraste conte li toele
        [line] li coleur del roye conte li toele
        [marker] li coleur del marke conte li toele
       *[text-on-canvas] li coleur do tecse conte li toele
    }{ $mode ->
        [dark] { " (môde foncé)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1 ; i fåt pol moens { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Metans ki l' definicion di stîle { $styleNumber } done des coleurs avou assez d' contraste pol môde clair, les coleurs do môde foncé fwaites di ces valeurs la n' ont nén assez d' contraste pol coleur do tecse conte li coleur do fond ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1 ; i fåt pol moens { $threshold }:1). { $suggestion ->
        [available] Po-z aveur assez d' contraste e môde foncé, ou bén ragrandixhoz l' contraste do môde clair (metans { $lightAttribute }="{ $lightColor }"), ou bén candjîz l' coleur do môde foncé (metans { $darkAttribute }="{ $darkColor }").
       *[none] Po-z aveur assez d' contraste e môde foncé, ragrandixhoz l' contraste do môde clair ou candjîz les coleurs fwaites avou textColorDarkMode et/ou backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Metans ki l' definicion di stîle { $styleNumber } done ene coleur di tecse avou assez d' contraste pol môde clair, li coleur di tecse do môde foncé fwaite di cisse valeur la n' a nén assez d' contraste conte li toele ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1 ; i fåt pol moens { $threshold }:1). { $suggestion ->
        [available] Po-z aveur assez d' contraste e môde foncé, ou bén ragrandixhoz l' contraste do môde clair (metans textColor="{ $lightColor }"), ou bén candjîz l' coleur do môde foncé (metans textColorDarkMode="{ $darkColor }").
       *[none] Po-z aveur assez d' contraste e môde foncé, ragrandixhoz l' contraste do môde clair ou candjîz li coleur fwaite avou textColorDarkMode.
    }

section-multiple-style-palettes = Ene seccion n' pout tchoezi k' ene seule <stylePalette> ; on prind l' dierinne.

## Unique variants

variant-num-to-select-not-non-negative-integer = on n' pout nén dire les variantes unikes di { $component } paski numToSelect n' est nén on etir nén negatif.

variant-num-to-select-not-constant-number = on n' pout nén dire les variantes unikes di { $component } paski numToSelect n' est nén on nombe constant.

variant-with-replacement-not-constant-boolean = on n' pout nén dire les variantes unikes di { $component } paski withReplacement n' est nén on boolean constant.

variant-select-weight-disables-unique = Les variantes unikes po select sont dismetowes s' i gn a ene tchuze avou on selectWeight ou on selectForVariants dné

variant-coprime-undetermined = on n' pout nén dire les variantes unikes di { $component } paski on n' pout nén dire ki coprime est todi fås.

variant-attribute-not-constant = on n' pout nén dire les variantes unikes di { $component } paski { $attribute } n' est nén ene constante.

variant-attribute-not-number = on n' pout nén dire les variantes unikes di { $component } paski { $attribute } n' est nén on nombe.

variant-attribute-wrong-type-for-sequence =
    on n' pout nén dire les variantes unikes di { $component } do type { $type } paski { $attribute } n' est nén { $expected ->
        [letters-combination] ene combinåcion di letes
        [math-expression] ene espression matematike valåbe
        [integer] on etir
       *[number] on nombe
    }.

variant-length-not-integer = on n' pout nén dire les variantes unikes di { $component } paski length n' est nén on etir.

variant-sort-not-implemented = les variantes unikes d' on { $component } avou sort n' ont nén co stî fwaites

variant-exclude-combinations-not-implemented = les variantes unikes d' on { $component } avou excludeCombinations n' ont nén co stî fwaites

variant-math-exclude-not-implemented = les variantes unikes d' on { $component } do type math avou exclude n' ont nén co stî fwaites

variant-non-constant-exclude-not-implemented = les variantes unikes d' on { $component } avou on exclude nén constant n' ont nén co stî fwaites

## PreFigure conversion

prefigure-descendant-unsupported = { $subject } : nén sopoirté på module prefigure do grafike ; on passe houte do dischindant.

prefigure-descendant-invalid-geometry = { $subject } : djeyometreye nén fineye ou nén etire ; on passe houte do dischindant.

prefigure-curve-label-omitted = { $subject } : les etiketes ni sont nén sopoirtêyes so les elemints d' coûbe kiviersés ; l' etikete est omjhe.

prefigure-curve-unsupported-definition-type = { $subject } : type di definicion di fonccion di coûbe nén sopoirté '{ $definitionType }' ; on passe houte do dischindant.

prefigure-region-flip-functions-unsupported = { $subject } : atribut flipFunctions nén sopoirté so regionBetweenCurves ; on passe houte do dischindant.

prefigure-region-non-formula-child = { $subject } : so regionBetweenCurves, gn a k' les fonccions efants dnêyes pa ene formule ki sont sopoirtêyes ; on passe houte do dischindant.

prefigure-label-position-unsupported =
    { $subject } : labelPosition '{ $labelPosition }' nén sopoirté po { $labelKind ->
        [line-family] ene etikete del famile des royes
       *[point] ene etikete di pont
    } ; on prind l' aroymint PreFigure prémetou.

prefigure-fill-style-unsupported = { $subject } : li stîle di rimplixhaedje '{ $fillStyle }' n' est nén sopoirté pa PreFigure ; on rvént a on rimplixhaedje plin.

prefigure-line-style-unknown = { $subject } : stîle di roye nén kinoxhou '{ $lineStyle }' omis del sôrteye PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject } : li stîle di marke '{ $markerStyle }' a stî kiviersé el stîle PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject } : li stîle di marke '{ $markerStyle }' n' est nén sopoirté pa PreFigure ; on prind l' stîle prémetou.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>` : `ref` nén valåbe ; on n' pout nén rzoude li cibe. L' anotåcion est omjhe.

annotation-ref-multiple-targets = `<annotation>` : `ref` s' a rzoû a sacwantès cibes ; on prind l' prumire.

annotation-ref-outside-graph = `<annotation>` : `ref` nén valåbe ; li cibe est foû do grafike ki l' contént. L' anotåcion est omjhe.

annotation-ref-unsupported-target = `<annotation>` : `ref` nén valåbe ; li cibe n' est nén on objet grafike sopoirté dins l' conversion prefigure. L' anotåcion est omjhe.

annotation-text-missing = `<annotation>` : `text` ki manke ou vude ; on evoye on tecse vude.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] On-z a trové ene dependince circulaire.
       *[other] On-z a trové ene dependince circulaire avou on componint `<{ $componentType }>`.
    }

reference-no-referent = Nou referint di trové pol referince : `{ $reference }`

reference-multiple-referents = Sacwants referints di trovés pol referince : `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format nén valåbe po l' atribut { $attribute } di `<{ $componentType }>`.

children-invalid = Efants nén valåbes po `<{ $componentType }>` : efants nén valåbes di trovés : { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valeur nén valåbe `{ $value }` po l' atribut `{ $attribute }`, on prind l' valeur `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Modêye DoenetML { $version } nén trovêye.
       *[other] Modêye DoenetML { $version } nén trovêye. On rvént al modêye { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML nén valåbe : { $content }

parse-tag-missing-close-tag = DoenetML nén valåbe : li balize `{ $tag }` n' a pont d' balize di seraedje. On ratindeut ene balize ki s' sere leye-minme ou ene balize `</{ $tagName }>`.

parse-tag-error = DoenetML nén valåbe : aroke el balize `<{ $tagName }>`

parse-attribute-missing-value = DoenetML nén valåbe : i shonne ki l' atribut nén valåbe `{ $attribute }` n' a pont d' valeur.

parse-attribute-invalid = DoenetML nén valåbe : atribut nén valåbe `{ $attribute }`

parse-attribute-value-invalid = DoenetML nén valåbe : valeur d' atribut nén valåbe `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML nén valåbe : valeur d' atribut nén valåbe `{ $value }`. Les guimets ni vont nén eshonne. I shonne k' i vs manke on `{ $quote }`

parse-open-tag-name-missing = DoenetML nén valåbe : ene balize sins no d' trovêye, metans `<`

parse-tag-not-closed = DoenetML nén valåbe : li balize `{ $tag }` n' a nén stî serêye (i shonne k' i manke on `>`).

parse-self-closing-tag-name-missing = DoenetML nén valåbe : ene balize sins no d' trovêye `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML nén valåbe : li balize `{ $tag }` n' a nén stî serêye (i shonne k' i manke `/>`).

parse-tag-invalid-attributes = DoenetML nén valåbe : li balize `{ $tag }` n' est nén valåbe. Elle a motoit des atributs nén corekes.

parse-close-tag-name-missing = DoenetML nén valåbe : ene balize di seraedje sins no d' trovêye, metans `</`

parse-attribute-value-unquoted = Les valeurs des atributs dvèt esse inte des guimets : `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML nén valåbe : balize di seraedje `{ $tag }` di trovêye, mins nole balize di drovaedje ki lyi corespond

parse-close-tag-mismatched = DoenetML nén valåbe : balize di seraedje ki n' corespond nén. On ratindeut `</{ $expected }>`. On-z a trové `{ $found }`

parser-node-unconvertible = On n' pout nén kiviersî l' nuk { $node } e nuk Dast.

## Names

name-attribute-invalid =
    Atribut name='{ $name }' nén valåbe. { $reason ->
        [characters] Les nos n' polèt aveur ki des letes, des chifes, des loyeus bas ou des loyeus.
       *[start] Les nos dvèt cmincî pa ene lete.
    }

component-name-invalid-start = No d' componint "{ $name }" nén valåbe. Les nos dvèt cmincî pa ene lete.

## `<answer>` sugar

answer-video-watched-missing-video = On answer do type videoWatched doet aveur on atribut video

answer-video-watched-video-not-reference = On answer do type videoWatched doet aveur on atribut video k' est ene referince

answer-name-not-single-text = L' atribut name d' on answer doet aveur on seul efant tecse

## Referencing another document

external-doenetml-recursion-limit = On n' pout nén rapexhî l' DoenetML di dfoû paski gn a trop di liveas d' ricursion. N' î åreut i nén ene referince circulaire ?

external-doenetml-unavailable = On n' pout nén rapexhî do DoenetML dispoy { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML nén valåbe rapexhî dispoy { $attribute }="{ $uri }" : i n' corespond nén å type di componint "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] L' atribut `{ $from }` est foû mode ; eployîz `{ $to }` el plaece.
       *[other] [deprecation] L' atribut `{ $from }` so `<{ $component }>` est foû mode ; eployîz `{ $to }` el plaece.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] L' atribut `{ $from }` est foû mode et on passe houte paski `{ $to }` est ossu dné.
       *[other] [deprecation] L' atribut `{ $from }` so `<{ $component }>` est foû mode et on passe houte paski `{ $to }` est ossu dné.
    }

deprecated-attribute-ignored = [deprecation] L' atribut `{ $attribute }` so `<{ $component }>` est foû mode et on passe houte.

deprecated-attribute-to-child = [deprecation] L' atribut `{ $attribute }` so `<{ $component }>` est foû mode ; eployîz on efant `<{ $child }>` el plaece.

deprecated-attribute-value-renamed = [deprecation] Li valeur `{ $value }` di l' atribut `{ $attribute }` so `<{ $component }>` est foû mode ; eployîz `{ $to }` el plaece.


## Language coverage

pluralize-english-only = `<pluralize>` ni pout mete å pluriyel ki l' inglès, donk si tecse dimeure come il est dins on documint scrît e { $locale }. Scrijhoz l' cogne do pluriyel vos-minme, ou dnez l' avou l' atribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = L' elemint `<{ $tag }>` n' est nén on elemint Doenet kinoxhou.

schema-element-not-allowed-at-root = L' elemint `<{ $tag }>` n' est nén permis al raecene do documint.

schema-element-not-allowed-inside = L' elemint `<{ $tag }>` n' est nén permis å dvins d' on `<{ $parent }>`.

schema-attribute-unrecognized = L' elemint `<{ $tag }>` n' a pont d' atribut lomé `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] L' atribut `{ $attribute }` di l' elemint `<{ $tag }>` doet esse ene djîveye wice ki tchaeke cayet est onk di ces ci : { $allowed }
       *[other] L' atribut `{ $attribute }` di l' elemint `<{ $tag }>` doet esse onk di ces ci : { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = No d' variante nén valåbe po select. Li no d' variante { $variantName } est dins { $numOptions } tchuzes mins l' nombe a tchoezi est { $numToSelect }.

select-variant-name-without-options = Des variantes sont dnêyes po select mins nole tchuze n' est dnêye pol no d' variante possibe : { $variantName }.

select-variant-name-not-possible = Li no d' variante { $variantName } dné po select n' est nén on no d' variante possibe.

select-too-few-options = On n' pout nén tchoezi { $numToSelect } componints foû di seulmint { $numOptions }.

select-from-sequence-too-few-values = On n' pout nén tchoezi { $numToSelect } valeurs dins ene secwince di longueur { $length }.

select-from-sequence-indices-count-mismatch = Li nombe d' indices dnés po select doet coresponde å nombe a tchoezi

select-from-sequence-indices-not-integers = Tos les indices dnés po select dvèt esse des etirs

select-from-sequence-index-excluded = On indice dné di selectfromsequence esteut metou å lådje

select-from-sequence-indices-excluded-combination = Les indices dnés di selectfromsequence estént ene combinåcion metowe å lådje

select-from-sequence-coprime-not-positive-integers = On n' pout nén tchoezi des combinåcions di nombes premîs inte di zels paski on n' tchoezixh nén des etirs pôzitifs.

select-from-sequence-coprime-common-factor = On n' pout nén tchoezi des nombes premîs inte di zels. Totes les valeurs possibes ont on facteur comun. (Les valeurs dnêyes di "from" ou "to" dvèt esse premîres inte di zels avou "step".)

select-from-sequence-coprime-single-number = On n' pout nén tchoezi des combinåcions di nombes premîs inte di zels foû d' on seul nombe ki n' est nén 1.

select-from-sequence-excluded-too-many-combinations = Pus di 70% des combinåcions sont metowes å lådje dins selectFromSequence

select-from-sequence-coprime-none-found = On n' a nén polou tchoezi des nombes premîs inte di zels. Totes les valeurs possibes ont on facteur comun.

select-from-sequence-too-few-unique-values = On n' pout nén tchoezi { $numToSelect } valeurs unikes dins ene secwince di longueur { $numPossibleValues }

select-prime-numbers-too-few-values = On n' pout nén tchoezi { $numToSelect } valeurs dins ene djîveye di nombes premîs di longueur { $numValues }

select-prime-numbers-values-count-mismatch = Li nombe di valeurs dnêyes po select doet coresponde å nombe a tchoezi

select-prime-numbers-values-not-prime = Totes les valeurs dnêyes pol tchuze di nombes premîs dvèt esse el djîveye des nombes premîs

select-prime-numbers-values-excluded-combination = Les valeurs dnêyes di selectPrimeNumbers estént ene combinåcion metowe å lådje

select-prime-numbers-excluded-too-many-combinations = Pus di 70% des combinåcions sont metowes å lådje dins selectPrimeNumbers

select-random-combination-fluke = Pa on hazård foirt malåjhey a croere, nole combinåcion di valeurs a l' astcheyance n' a polou esse tchoezeye

select-random-value-fluke = Pa on hazård foirt malåjhey a croere, nole valeur a l' astcheyance n' a polou esse tchoezeye

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] Ci `<{ $component }>` chal n' est nén håyné paski il est å dvins des matematikes et n' est nén `inline`. Radjoutez `inline` po k' i dvegne ene djîveye disrôlante, ki tént dins ene espression.
        [expanded] Ci `<{ $component }>` chal n' est nén håyné paski il est å dvins des matematikes et il est `expanded`. Oistez `expanded` ; ene boesse di sacwantès royes ni tént nén dins ene espression.
        [on-graph] Ci `<{ $component }>` chal n' est nén håyné paski il est å dvins des matematikes tracêyes so on grafike, wice k' i gn a nole plaece po on tchamp d' intrêye.
       *[relative-width] Ci `<{ $component }>` chal n' est nén håyné paski il est å dvins des matematikes et a ene lårdjeur relative. Dnez l' lårdjeur e-n unités absolowes, come `px`, el plaece.
    }
