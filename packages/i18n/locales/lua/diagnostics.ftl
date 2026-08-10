# Luba-Lulua diagnostics: errors and warnings surfaced to the reader or author.
# Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element, attribute and value names — `through`, `endpoint`,
# `midpointOffset`, `numDimensions`, `symbolicEquality`, `selectFromSequence`
# and the rest — are part of the language rather than prose, and stay in
# English exactly as written. So does the `[deprecation]` marker.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } udi ulengulula padi mpwente ibidi ya ku mfudilu iteka
       *[other] { $attributes } idi ilengululua padi mpwente ibidi ya ku mfudilu iteka
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } udi ulengulula padi pwente wa ku mfudilu ne wa munkatshi bonso bateka
       *[other] { $attributes } idi ilengululua padi pwente wa ku mfudilu ne wa munkatshi bonso bateka
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset kena wenza mudimu kakuyi pwente wa munkatshi

## `<line>`

line-points-undetermined-dimensions = Mulongo udi upita ku mpwente ya bunene budi kabuyi bumanyika.

line-points-too-few-dimensions = Mulongo udi ne bua kupita ku mpwente ya bunene bubidi anyi kupita apu.

line-points-depend-on-variables = Mulongo udi upita ku mpwente idi yeyemena ku bintu bidi bishintuluka: { $variables }.

line-equation-invalid-format = Mushindu kawuena muimpe wa dilingakaja dia mulongo mu bintu bidi bishintuluka { $variable1 } ne { $variable2 }.

## `<ray>`

ray-overprescribed-through = Leyo udi muteka kudi through, endpoint ne direction.  Tudi tulengulula through muteka.

ray-dimension-mismatch = numDimensions kayena yumvuangana mu leyo.

## `<vector>`

vector-overprescribed-head = Vekitere udi muteka kudi head, tail ne displacement.  Tudi tulengulula head muteka.

vector-dimension-mismatch = numDimensions kayena yumvuangana mu vekitere.

## Attracting and constraining

attract-to-without-nearest-point = Kabiena bienzeka kukoka ku `<{ $component }>` bualu kayena ne cimanyinu nearestPoint.

constrain-to-without-nearest-point = Kabiena bienzeka kukanda ku `<{ $component }>` bualu kayena ne cimanyinu nearestPoint.

constrain-to-interior-without-nearest-point = Kabiena bienzeka kukanda munda mua `<{ $component }>` bualu kayena ne cimanyinu nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition udi ulengululua ku choiceInput udi kayi wa mu mulongo

## Ordering children by index

choice-input-indices-count-mismatch = Tudi tulengulula indices miteka ku choiceInput bualu bungi bua indices kabuena bumvuangana ne bungi bua bana ba choice.

pretzel-indices-count-mismatch = Tudi tulengulula indices miteka ku problem bualu bungi bua indices kabuena bumvuangana ne bungi bua bana ba problem.

shuffle-indices-count-mismatch = Tudi tulengulula indices miteka ku shuffle bualu bungi bua indices kabuena bumvuangana ne bungi bua bitupa.

indices-ignored-out-of-range = Tudi tulengulula indices miteka ku { $component } bualu mikuabo idi pambelu pa cipimu.

pretzel-indices-repeated = Tudi tulengulula indices miteka ku pretzel bualu mikuabo idi mipitulula.

pretzel-circuit-first-index = Tudi tulengulula indices miteka ku pretzel mu mode="circuit" bualu wa kumpala udi ne bua kuikala 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Bua `<{ $component }>` kuenza mudimu ne bana ba miaku, cimanyinu `type` cidi ne bua kutekibua.

invalid-type-defaulting-to-math = Mushindu { $type } kawuena muimpe bua { $component }. Udi ne bua kuikala math, text, number anyi boolean. Tudi tupingana ku math.

string-not-valid-component-to-arrange = Muaku "{ $value }" kena citupa cidi mua kuenza mudimu ku { $component }. Tudi tuulengulula.

## Types and variables

invalid-type-defaulting-to-number = Mushindu { $type } kawuena muimpe, tudi tuteka mushindu ku number.

invalid-variable-value = Mbalu wa cintu cidi cishintuluka kena muimpe: `{ $value }`

## Variants

variant-index-must-be-number = Cimanyinu cia mushindu { $index } cidi ne bua kuikala mbalu

variant-index-must-be-integer = Cimanyinu cia mushindu { $index } cidi ne bua kuikala mbalu mujima

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` kavua muenzeke ku bipimu bidi kabiyi bishintuluka. Tudi tuteka bunene ku dipimangana.

side-by-side-absolute-margins = `<{ $component }>` kavua muenzeke ku bipimu bidi kabiyi bishintuluka. Tudi tuteka mfudilu ku dipimangana.

side-by-side-no-block-child = `<{ $component }>` kena muimpe: udi ne bua kuikala ne muana umue wa citupa.

## `<label>`

label-for-ignored-on-graphical = Cimanyinu `for` ku `<label>` wa cimfuanyi cidi cilengululua.

label-for-must-resolve-to-one = Cimanyinu `for` ku `<label>` cidi ne bua kuleja citupa cimue nkayaci.

label-for-unresolved = Cimanyinu `for` ku `<label>` kacivua mua kuleja citupa.

label-for-answer-with-authored-inputs = Cimanyinu `for` ku `<label>` cidi cileja `<answer>` udi ne mabuejibue mafunda kudi mufundi; leja dibuejibue ndi nkayadi.

label-for-answer-without-input = Cimanyinu `for` ku `<label>` cidi cileja `<answer>` udi kayi ne dibuejibue dia kuinyika dina.

label-for-must-reference-input-or-answer = Cimanyinu `for` ku `<label>` cidi ne bua kuleja dibuejibue anyi diandamuna.

## Accessibility

accessibility-short-description-or-decorative = Bua difikila, `<{ $component }>` udi ne bua kuikala ne dijingulula dipi anyi kutekibua bu cintu cia bulengele.

accessibility-video-short-description = Bua difikila, `<video>` udi ne bua kuikala ne dijingulula dipi.

accessibility-input-short-description-or-label = Bua difikila, `<{ $component }>` udi ne bua kuikala ne dijingulula dipi anyi dina.

accessibility-answer-input-short-description-or-label = Bua difikila, `<answer>` udi wenza dibuejibue udi ne bua kuikala ne dijingulula dipi anyi dina.

accessibility-short-description-contains-math = Majingulula mapi kaena ne bua kuikala ne bitupa bia mbalu bu `<{ $component }>`. Funda mbalu yonso mu miaku.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } kena ne dishilangana dikumbane bua miaku ya mutu wa citupa (mu mîdima) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; bidi bilomba nansha { $threshold }:1).
       *[other] { $colorName } kena ne dishilangana dikumbane bua miaku ya mutu wa citupa ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; bidi bilomba nansha { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Katuvua tuenze `<circle>` udi upita ku mpwente { $count } padi mpwente kayiyi ne mbalu ya nomba.

circle-too-many-through-points = Kabiena bienzeka kubala cijengu cidi cipita ku mpwente ipita 3.

circle-overprescribed-radius-center-points = Kabiena bienzeka kubala cijengu cidi ne leyo, muaba wa munkatshi ne mpwente bionso biteka.

circle-center-with-multiple-points = Kabiena bienzeka kubala cijengu cidi ne muaba wa munkatshi cipita ku pwente upita 1.

circle-radius-too-small = Kabiena bienzeka kubala cijengu: bualu bule budi pankatshi pa mpwente ibidi budi { $distance }, leyo { $radius } muteka mmukese menemene.

circle-radius-with-many-points = Kabiena bienzeka kuenza cijengu cidi cipita ku mpwente ipita ibidi cidi ne leyo muteka.

circle-invalid-center-or-through-points = Muaba wa munkatshi anyi mpwente ya cijengu kaena mimpe.

circle-radius-center-with-multiple-points = Kabiena bienzeka kubala leyo wa cijengu cidi ne muaba wa munkatshi cipita ku pwente upita 1.

circle-change-radius-non-numerical = Kabiena bienzeka kushintulula leyo wa cijengu cidi ne mpwente kayiyi ne nomba

circle-radius-with-points-non-numerical = Kabiena bienzeka kuenza cijengu cidi cipita ku pwente upita umue cidi ne leyo muteka padi kakuyi mbalu ya nomba.

circle-change-center-non-numerical = Katuvua tuenze dishintulula dia muaba wa munkatshi wa cijengu cidi cipita ku mpwente kayiyi ne nomba.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Bunene kabuena bukumbane bua citupa cia fonksio. Citupa cidi ne cipatshila { $intervals } kadi fonksio udi ne { $inputs ->
            [one] dibuejibue { $inputs }
           *[other] mabuejibue { $inputs }
        }.
       *[other] Bunene kabuena bukumbane bua citupa cia fonksio. Citupa cidi ne bipatshila { $intervals } kadi fonksio udi ne { $inputs ->
            [one] dibuejibue { $inputs }
           *[other] mabuejibue { $inputs }
        }.
    }

function-domain-invalid-format = Mushindu kawuena muimpe wa citupa cia fonksio.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Tudi tulengulula cia kuulu cidi kaciyi ne nomba cia fonksio.
        [minimum] Tudi tulengulula cia kuinshi cidi kaciyi ne nomba cia fonksio.
        [extremum] Tudi tulengulula mfudilu udi kayi ne nomba wa fonksio.
        [point] Tudi tulengulula pwente udi kayi ne nomba wa fonksio.
        [slope] Tudi tulengulula didiamba didi kadiyi ne nomba dia fonksio.
       *[other] Tudi tulengulula { $type } udi kayi ne nomba wa fonksio.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Tudi tulengulula cia kuulu cia tshianana cia fonksio.
        [minimum] Tudi tulengulula cia kuinshi cia tshianana cia fonksio.
        [extremum] Tudi tulengulula mfudilu wa tshianana wa fonksio.
        [point] Tudi tulengulula pwente wa tshianana wa fonksio.
       *[other] Tudi tulengulula { $type } wa tshianana wa fonksio.
    }

function-points-too-close = Fonksio udi ne mpwente ibidi idi pabuipi menemene. Kabiena bienzeka kuteka fonksio.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Dipitulula dia fonksio didi mua kuenzeka anu padi bungi bua mabuejibue bumvuangana ne bungi bua bipatuka. Fonksio eu udi ne dibuejibue { $inputs } ne { $outputs ->
            [one] cipatuka { $outputs }
           *[other] bipatuka { $outputs }
        }.
       *[other] Dipitulula dia fonksio didi mua kuenzeka anu padi bungi bua mabuejibue bumvuangana ne bungi bua bipatuka. Fonksio eu udi ne mabuejibue { $inputs } ne { $outputs ->
            [one] cipatuka { $outputs }
           *[other] bipatuka { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Bule bua mulongolodi kabuena buimpe.  Budi ne bua kuikala mbalu mujima udi kayi muinshi mua zelo.

sequence-invalid-step = Cinyembu cia mulongolodi kacena cimpe.  Cidi ne bua kuikala mbalu ku mulongolodi wa mushindu { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" wa mulongolodi wa nomba kena muimpe.  Udi ne bua kuikala mbalu.

sequence-invalid-endpoint-letters = "{ $attribute }" wa mulongolodi wa mifundu kena muimpe.  Udi ne bua kuikala disangisha dia mifundu.

sequence-invalid-endpoint = "{ $attribute }" wa mulongolodi kena muimpe.

select-from-sequence-coprime-not-numbers = coprime mulengululue bualu katuena tusungula nomba

select-from-sequence-coprime-with-exclude-combinations = coprime mulengululue bualu excludeCombinations muteka

## Resolving a `target`

target-not-found = target kena muimpe ku `<{ $source }>`: katuvua tupete target.

target-state-variable-not-found = target kena muimpe ku `<{ $source }>`: katuvua tupete cimanyinu cidibu babikila ne "{ $property }" ku `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Bintu bidi bishintuluka bia `<odeSystem>` bidi ne bua kushilangana ne cintu cidi cishintuluka cia bulamate.

ode-system-duplicate-variable-names = Kabiena bienzeka kuteka fonksio ya ODE RHS idi ne mena a bintu bidi bishintuluka mapitulule.

ode-system-rhs-function-error = Kabiena bienzeka kuteka fonksio wa ODE RHS.  Dipanga mu dienza dia fonksio wa mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Kabiena bienzeka kuteka konji pankatshi pa milongo { $count }

angle-invalid-through-point = Pwente kena muimpe mu through wa `<angle>`

parabola-vertex-too-many-points = Katuvua tuenze parabole udi ne konji upita ku pwente upita 1.

parabola-too-many-points = Katuvua tuenze parabole udi upita ku mpwente ipita 3.

intersection-too-many-items = Katuvua tuenze disambakena bua bintu bipita bibidi

## Other math components

ionic-compound-not-two-ions = Katuvua tuenze disangisha dia ayoni bua cintu cidi kaciyi ayoni ibidi.

ionic-compound-needs-cation-and-anion = Disangisha dia ayoni dienza anu bua katiyo umue ne aniyo umue.

solve-equations-cannot-evaluate = Kabiena bienzeka kujikija dilingakaja bualu kadivua mua kubalua: { $equation }

math-operators-operand-number-required = Udi ne bua kuteka operandNumber padiwe umbusha operand wa mbalu.

eigen-decomposition-failed = Katuvua mua kubala eigenvalues ya matrisi

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parametre { $parameters } kena usanganyibua mu pattern, nanku neikale yumvuangana ne tshianana misangu yonso.
       *[other] `<matchesPattern>`: parametre { $parameters } kaena isanganyibua mu pattern, nanku neyikale yumvuangana ne tshianana misangu yonso.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: kabiena bienzeka kumvua grid="{ $grid }". Udi ne bua kuikala none, medium, dense, anyi nomba ibidi mimpe mitapulule ne muaba, bu grid="1 0.5". Kakuena bukesa buenzibue.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" kayena mutabujibue mu mulejianyi prefigure; tudi tuenza bu ku lubadi lua balume.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" kayena mutabujibue mu mulejianyi prefigure; tudi tuenza bu ku kuulu.

prefigure-invalid-axis-bounds = `<graph>`: mfudilu ya mulongo mukolo kaena mimpe bua dishintuluka dia prefigure; tudi tuenza ne bbox wa tshiakadi (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: bunene kabuena buimpe bua dishintuluka dia prefigure; tudi tuenza ne bunene bua cimfuanyi bua tshiakadi 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio kena muimpe bua dishintuluka dia prefigure; tudi tuenza ne cipimu cia tshiakadi 1.

prefigure-grid-spacing-too-fine = `<graph>`: muaba wa bukesa mmukese menemene bua mfudilu ya mulongo mukolo; bukesa kabuena buenzibua mu mulejianyi prefigure.

prefigure-annotations-not-rendered = `<graph>`: majingulula kaena aenzibua padi mulejianyi PreFigure kayi wenza mudimu.

multiple-annotations-children = Bana `<annotations>` ba bungi basanganyibue mu `<graph>`; bonso pa kumbusha wa ndekelu balengululue.

## Referring to other components

copy-unrecognized-component-type = Kabiena bienzeka kutandalaja anyi kukopa mushindu wa citupa udi kayi mumanyika: { $type }.

copy-prop-not-found = Katuvua tupete prop { $property } ku citupa cia mushindu { $component }

collect-no-source = Kakuena mfumu musanganyibue wa collect.

collect-invalid-component-type = Kabiena bienzeka kusangisha bitupa bia mushindu `<{ $component }>` bualu udi mushindu udi kawuyi muimpe.

reference-index-unavailable = Kabiena bienzeka kuleja cimanyinu `{ $reference }`

## `<callAction>`

component-action-unavailable = Kabiena bienzeka kubikila { $action } ku citupa `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Bipatuka bidi ne mushindu udi kawuyi muimpe.  Milongo idi ne bule budi kabuyi bumvuangana. Bisanganyibue mu componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Bipatuka bidi ne mena a mitshi mapitulule.  Bisanganyibue mu componentIdx :{ $componentIdx }

data-frame-missing-column-name = Bipatuka bidi kabiyi ne dina dia mutshi.  Bisanganyibue mu componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Manganyi a diandamuna edi adi eyemena ku diandamuna didi tagi ndi nkayadi mutume, bualu ebu nebulue ne bualu budi kabuyi buakanyine.

answer-max-num-attempts-in-section-wide-check-work = Kuteka `maxNumAttempts` ku `<answer>` udi mu citupa cidi ne `sectionWideCheckWork` kakuena kuenza cintu, bualu bungi bua mateta budi bulamibua kudi citupa. Teka `maxNumAttempts` ku citupa.

nested-section-wide-check-work-max-num-attempts = Kuteka `maxNumAttempts` ku citupa cidi ne `sectionWideCheckWork` cidi munda mua citupa cikuabo cidi ne `sectionWideCheckWork` kakuena kuenza cintu, bualu bungi bua mateta budi bulamibua kudi citupa cia pambelu. Teka `maxNumAttempts` ku citupa cia pambelu.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Cimanyinu { $attributes } kacena mua kuenza cintu kakuyi symbolicEquality muteka.
       *[other] Bimanyinu { $attributes } kabiena mua kuenza cintu kakuyi symbolicEquality muteka.
    }

answer-invalid-type = Mushindu udi kawuyi muimpe wa diandamuna: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Bualu citupa `<{ $component }>` kacena ne dina, kacena mua kuenza mudimu bu cimanyinu cia module

module-attribute-name-already-defined = Citupa `<{ $component } name="{ $name }">` kacena mua kuenza mudimu bu cimanyinu cia module bualu mushindu `<module>` udi ne cimanyinu "{ $name }" cidiku kale.

conditional-content-condition-ignored = Cimanyinu `condition` cidi cilengululua ku `<conditionalContent>` udi ne bana ba case anyi else.

slider-markers-type-mismatch = Mushindu wa bimanyinu kawuena wumvuangana ne mushindu wa slider.

pretzel-problem-needs-statement-and-answer = pretzel kena muimpe: `<problem>` yonso idi ne bua kuikala ne `<statement>` umue ne `<answer>` umue.

pretzel-circuit-first-problem-distractor = pretzel kena muimpe: mu mode="circuit", `<problem>` wa kumpala kena mua kuikala distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Mbalu udi kayi muimpe { $values } ku cimanyinu `{ $attribute }`; tudi tuulengulula.
       *[other] Mbalu idi kayi mimpe { $values } ku cimanyinu `{ $attribute }`; tudi tuilengulula.
    }

attribute-must-be-references = Mbalu `{ $value }` kena muimpe ku cimanyinu `{ $attribute }`. Cimanyinu cidi ne bua kuikala cienzeka ne bilejilu bidi bituadija ne `$`.

math-input-invalid-function-names = <mathInput>: tudi tulengulula mena a fonksio adi kayi mimpe mu { $attribute }: { $names }. Citupa cileja cia dina dionso cidi ne bua kuikala ne mifundu 2 nansha (mifundu anyi tumikoni); udi mua kubueja `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Mushindu wa citupa kawuena muimpe: `<{ $componentType }>`

attribute-repeated = Kabiena bienzeka kupitulula cimanyinu { $attribute }.

attribute-invalid-for-component = Cimanyinu "{ $attribute }" kacena cia citupa cia mushindu `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Dijingulula dia mushindu { $styleNumber } kadiena ne dishilangana dikumbane bua { $context ->
        [text-on-background] mubidi wa miaku ku mubidi wa kunyima
        [high-contrast] mubidi udi ushilangana bikole ku cibadilu
        [line] mubidi wa mulongo ku cibadilu
        [marker] mubidi wa cimanyinu ku cibadilu
       *[text-on-canvas] mubidi wa miaku ku cibadilu
    }{ $mode ->
        [dark] { " (mu mîdima)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; bidi bilomba nansha { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Nansha mudi dijingulula dia mushindu { $styleNumber } ne mibidi idi ipesha dishilangana dikumbane mu butoke, mibidi ya mu mîdima idi ifumina kuadi kayena ne dishilangana dikumbane pankatshi pa mubidi wa miaku ne mubidi wa kunyima ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; bidi bilomba nansha { $threshold }:1). { $suggestion ->
        [available] Bua dishilangana kuikala dikumbane mu mîdima, tandalaja dishilangana dia mu butoke (bu cilejilu, teka { $lightAttribute }="{ $lightColor }") anyi shintulula mubidi wa mu mîdima (bu cilejilu, teka { $darkAttribute }="{ $darkColor }").
       *[none] Bua dishilangana kuikala dikumbane mu mîdima, tandalaja dishilangana dia mu butoke anyi shintulula mibidi ifumina kuadi ne textColorDarkMode anyi backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Nansha mudi dijingulula dia mushindu { $styleNumber } ne mubidi wa miaku udi upesha dishilangana dikumbane mu butoke, mubidi wa miaku wa mu mîdima udi ufumina kuadi kawuena ne dishilangana dikumbane ku cibadilu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; bidi bilomba nansha { $threshold }:1). { $suggestion ->
        [available] Bua dishilangana kuikala dikumbane mu mîdima, tandalaja dishilangana dia mu butoke (bu cilejilu, teka textColor="{ $lightColor }") anyi shintulula mubidi wa mu mîdima (bu cilejilu, teka textColorDarkMode="{ $darkColor }").
       *[none] Bua dishilangana kuikala dikumbane mu mîdima, tandalaja dishilangana dia mu butoke anyi shintulula mubidi udi ufumina kuadi ne textColorDarkMode.
    }

section-multiple-style-palettes = Citupa cidi mua kusungula <stylePalette> umue nkayawu; tudi tuenza ne wa ndekelu.

## Unique variants

variant-num-to-select-not-non-negative-integer = kabiena bienzeka kumanya mishindu idi kayi ipitulula ya { $component } bualu numToSelect kena mbalu mujima udi kayi muinshi mua zelo.

variant-num-to-select-not-constant-number = kabiena bienzeka kumanya mishindu idi kayi ipitulula ya { $component } bualu numToSelect kena mbalu udi kayi ushintuluka.

variant-with-replacement-not-constant-boolean = kabiena bienzeka kumanya mishindu idi kayi ipitulula ya { $component } bualu withReplacement kena boolean udi kayi ushintuluka.

variant-select-weight-disables-unique = Mishindu idi kayi ipitulula ya select idi ikandika padi disungula didi ne selectWeight anyi selectForVariants

variant-coprime-undetermined = kabiena bienzeka kumanya mishindu idi kayi ipitulula ya { $component } bualu katuena mua kumanya ne coprime udi misangu yonso false.

variant-attribute-not-constant = kabiena bienzeka kumanya mishindu idi kayi ipitulula ya { $component } bualu { $attribute } udi ushintuluka.

variant-attribute-not-number = kabiena bienzeka kumanya mishindu idi kayi ipitulula ya { $component } bualu { $attribute } kena mbalu.

variant-attribute-wrong-type-for-sequence =
    kabiena bienzeka kumanya mishindu idi kayi ipitulula ya { $component } wa mushindu { $type } bualu { $attribute } kena { $expected ->
        [letters-combination] disangisha dia mifundu
        [math-expression] diambila dia mbalu ditabujibue
        [integer] mbalu mujima
       *[number] mbalu
    }.

variant-length-not-integer = kabiena bienzeka kumanya mishindu idi kayi ipitulula ya { $component } bualu length kena mbalu mujima.

variant-sort-not-implemented = katuvua tuenze mishindu idi kayi ipitulula ya { $component } udi ne sort

variant-exclude-combinations-not-implemented = katuvua tuenze mishindu idi kayi ipitulula ya { $component } udi ne excludeCombinations

variant-math-exclude-not-implemented = katuvua tuenze mishindu idi kayi ipitulula ya { $component } wa mushindu math udi ne exclude

variant-non-constant-exclude-not-implemented = katuvua tuenze mishindu idi kayi ipitulula ya { $component } udi ne exclude udi ushintuluka

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: kayena mutabujibue mu mulejianyi prefigure wa graph; muledibue mulengululue.

prefigure-descendant-invalid-geometry = { $subject }: mushindu wa muaba udi kawuyi ne mfudilu anyi udi kawuyi mujima; muledibue mulengululue.

prefigure-curve-label-omitted = { $subject }: mena kaena matabujibue ku milongo mikonyike mishintuludibue; dina dilengululue.

prefigure-curve-unsupported-definition-type = { $subject }: mushindu wa dijingulula dia mulongo mukonyike '{ $definitionType }' kawuena mutabujibue; muledibue mulengululue.

prefigure-region-flip-functions-unsupported = { $subject }: cimanyinu flipFunctions kacena citabujibue ku regionBetweenCurves; muledibue mulengululue.

prefigure-region-non-formula-child = { $subject }: nfonksio ya bana ya mushindu formula nkayayi idi itabujibua ku regionBetweenCurves; muledibue mulengululue.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' kayena mutabujibue ku { $labelKind ->
        [line-family] dina dia dîku dia milongo
       *[point] dina dia pwente
    }; tudi tuenza ne disangisha dia PreFigure dia tshiakadi.

prefigure-fill-style-unsupported = { $subject }: mushindu wa diwuja '{ $fillStyle }' kawuena mutabujibue kudi PreFigure; tudi tupingana ku diwuja dikole.

prefigure-line-style-unknown = { $subject }: mushindu wa mulongo udi kawuyi mumanyika '{ $lineStyle }' mumbushibue mu bipatuka bia PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: mushindu wa cimanyinu '{ $markerStyle }' mushintuludibue mushindu wa PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: mushindu wa cimanyinu '{ $markerStyle }' kawuena mutabujibue kudi PreFigure; tudi tuenza ne mushindu wa tshiakadi.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` kena muimpe; katuvua tupete cidiye uleja. Dijingulula dilengululue.

annotation-ref-multiple-targets = `<annotation>`: `ref` udi uleja bintu bia bungi; tudi tuenza ne cia kumpala.

annotation-ref-outside-graph = `<annotation>`: `ref` kena muimpe; cidiye uleja cidi pambelu pa graph udi nawu. Dijingulula dilengululue.

annotation-ref-unsupported-target = `<annotation>`: `ref` kena muimpe; cidiye uleja kacena cintu cia cimfuanyi citabujibue mu dishintuluka dia prefigure. Dijingulula dilengululue.

annotation-text-missing = `<annotation>`: `text` udi kayiku anyi udi tshianana; tudi tupatula miaku ya tshianana.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Tudi tumone dieyemena didi dinyunguluka.
       *[other] Tudi tumone dieyemena didi dinyunguluka didi ne citupa `<{ $componentType }>`.
    }

reference-no-referent = Kakuena cintu cisanganyibue ku cilejilu: `{ $reference }`

reference-multiple-referents = Bintu bia bungi bisanganyibue ku cilejilu: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Mushindu kawuena muimpe wa cimanyinu { $attribute } cia `<{ $componentType }>`.

children-invalid = Bana kabena bimpe ba `<{ $componentType }>`: Tudi tumone bana kabayi bimpe: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Mbalu `{ $value }` kena muimpe ku cimanyinu `{ $attribute }`, tudi tuenza ne mbalu `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Mvelesio wa DoenetML { $version } kavua musanganyibue.
       *[other] Mvelesio wa DoenetML { $version } kavua musanganyibue. Tudi tupingana ku mvelesio { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML kena muimpe: { $content }

parse-tag-missing-close-tag = DoenetML kena muimpe: Tagi `{ $tag }` kena ne tagi udi ukanga. Tuvua tuindila tagi udi udikanga anyi tagi `</{ $tagName }>`.

parse-tag-error = DoenetML kena muimpe: Dipanga mu tagi `<{ $tagName }>`

parse-attribute-missing-value = DoenetML kena muimpe: Cimanyinu `{ $attribute }` cidi kaciyi cimpe cidi cimueneka bu cidi kacinyi ne mbalu.

parse-attribute-invalid = DoenetML kena muimpe: Cimanyinu `{ $attribute }` kacena cimpe

parse-attribute-value-invalid = DoenetML kena muimpe: Mbalu wa cimanyinu `{ $value }` kena muimpe

parse-attribute-value-quote-mismatch = DoenetML kena muimpe: Mbalu wa cimanyinu `{ $value }` kena muimpe. Tumanyinu tua miaku katuena tumvuangana. Bidi bimueneka bu udi kayi ne `{ $quote }`

parse-open-tag-name-missing = DoenetML kena muimpe: Tudi tumone tagi udi kayi ne dina, bu `<`

parse-tag-not-closed = DoenetML kena muimpe: Tagi `{ $tag }` kavua mukangibue (bidi bimueneka bu `>` udi kayiku).

parse-self-closing-tag-name-missing = DoenetML kena muimpe: Tudi tumone tagi udi kayi ne dina `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML kena muimpe: Tagi `{ $tag }` kavua mukangibue (bidi bimueneka bu `/>` udi kayiku).

parse-tag-invalid-attributes = DoenetML kena muimpe: Tagi `{ $tag }` kena muimpe. Udi mua kuikala ne bimanyinu bidi kabiyi bimpe.

parse-close-tag-name-missing = DoenetML kena muimpe: Tudi tumone tagi udi ukanga udi kayi ne dina, bu `</`

parse-attribute-value-unquoted = Mbalu ya bimanyinu idi ne bua kuikala munkatshi mua tumanyinu tua miaku: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML kena muimpe: Tudi tumone tagi udi ukanga `{ $tag }`, kadi kakuena tagi udi ubulula udi wumvuangana

parse-close-tag-mismatched = DoenetML kena muimpe: Tagi udi ukanga kena wumvuangana. Tuvua tuindila `</{ $expected }>`. Tudi tumone `{ $found }`

parser-node-unconvertible = Katuvua mua kushintulula node { $node } mu node wa Dast.

## Names

name-attribute-invalid =
    Dina name='{ $name }' kadiena dimpe. { $reason ->
        [characters] Mena adi mua kuikala ne mifundu, nomba, tumikoni tua kuinshi anyi tumikoni nkayatu.
       *[start] Mena adi ne bua kutuadija ne mufundu.
    }

component-name-invalid-start = Dina dia citupa "{ $name }" kadiena dimpe. Mena adi ne bua kutuadija ne mufundu.

## `<answer>` sugar

answer-video-watched-missing-video = Diandamuna dia mushindu videoWatched didi ne bua kuikala ne cimanyinu video

answer-video-watched-video-not-reference = Diandamuna dia mushindu videoWatched didi ne bua kuikala ne cimanyinu video cidi cilejilu

answer-name-not-single-text = Cimanyinu name cia diandamuna cidi ne bua kuikala ne muana umue wa miaku

## Referencing another document

external-doenetml-recursion-limit = Katuvua mua kupeta DoenetML wa pambelu bualu bua mapitulula a bungi menemene. Kudiku cilejilu cidi cinyunguluka?

external-doenetml-unavailable = Katuvua mua kupeta DoenetML ku { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML mupete ku { $attribute }="{ $uri }" kena muimpe: kavua mumvuangane ne mushindu wa citupa "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Cimanyinu `{ $from }` kacicidi cienza mudimu; enza ne `{ $to }`.
       *[other] [deprecation] Cimanyinu `{ $from }` ku `<{ $component }>` kacicidi cienza mudimu; enza ne `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Cimanyinu `{ $from }` kacicidi cienza mudimu ne cidi cilengululua bualu `{ $to }` udi pende muteka.
       *[other] [deprecation] Cimanyinu `{ $from }` ku `<{ $component }>` kacicidi cienza mudimu ne cidi cilengululua bualu `{ $to }` udi pende muteka.
    }

deprecated-attribute-ignored = [deprecation] Cimanyinu `{ $attribute }` ku `<{ $component }>` kacicidi cienza mudimu ne cidi cilengululua.

deprecated-attribute-to-child = [deprecation] Cimanyinu `{ $attribute }` ku `<{ $component }>` kacicidi cienza mudimu; enza ne muana `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Mbalu `{ $value }` wa cimanyinu `{ $attribute }` ku `<{ $component }>` kacidi wenza mudimu; enza ne `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` udi mua kuenza bungi mu Anglais nkayawu, nanku miaku yende idi ishala bu muvua mufundi muyifunde mu mukanda mufunda mu { $locale }. Funda bungi buebe, anyi ubuteke ne cimanyinu `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Citupa `<{ $tag }>` kacena citupa cia Doenet cidi cimanyika.

schema-element-not-allowed-at-root = Citupa `<{ $tag }>` kacena citabujibue ku muji wa mukanda.

schema-element-not-allowed-inside = Citupa `<{ $tag }>` kacena citabujibue munda mua `<{ $parent }>`.

schema-attribute-unrecognized = Citupa `<{ $tag }>` kacena ne cimanyinu cidibu babikila ne `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Cimanyinu `{ $attribute }` cia citupa `<{ $tag }>` cidi ne bua kuikala mulongolodi udi ne bintu bidi cionso ku cionso cimue cia ku: { $allowed }
       *[other] Cimanyinu `{ $attribute }` cia citupa `<{ $tag }>` cidi ne bua kuikala cimue cia ku: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Dina dia mushindu kadiena dimpe ku select.  Dina dia mushindu { $variantName } didi disanganyibua mu disungula { $numOptions } kadi bungi bua kusungula ndi { $numToSelect }.

select-variant-name-without-options = Mishindu mikuabo miteka ku select kadi kakuena disungula diteka ku dina dia mushindu udi mua kuikalaku: { $variantName }.

select-variant-name-not-possible = Dina dia mushindu { $variantName } diteka ku select kadiena dina dia mushindu udi mua kuikalaku.

select-too-few-options = Kabiena bienzeka kusungula bitupa { $numToSelect } munkatshi mua bitupa { $numOptions } nkayabi.

select-from-sequence-too-few-values = Kabiena bienzeka kusungula mbalu { $numToSelect } mu mulongolodi wa bule { $length }.

select-from-sequence-indices-count-mismatch = Bungi bua indices miteka ku select budi ne bua kumvuangana ne bungi bua kusungula

select-from-sequence-indices-not-integers = Indices yonso miteka ku select idi ne bua kuikala mbalu mijima

select-from-sequence-index-excluded = Cimanyinu citeka cia selectfromsequence civua cimbushibue

select-from-sequence-indices-excluded-combination = Indices miteka ya selectfromsequence ivua disangisha dimbushibue

select-from-sequence-coprime-not-positive-integers = Kabiena bienzeka kusungula masangisha a coprime bualu katuena tusungula mbalu mimpe mijima.

select-from-sequence-coprime-common-factor = Kabiena bienzeka kusungula nomba ya coprime. Mbalu yonso idi mua kuikalaku idi ne cibalu cimue. (Mbalu miteka ya "from" anyi "to" idi ne bua kuikala coprime ne "step".)

select-from-sequence-coprime-single-number = Kabiena bienzeka kusungula masangisha a coprime mu nomba umue udi kayi 1.

select-from-sequence-excluded-too-many-combinations = Tumbusha masangisha apita 70% mu selectFromSequence

select-from-sequence-coprime-none-found = Katuvua mua kusungula nomba ya coprime. Mbalu yonso idi mua kuikalaku idi ne cibalu cimue.

select-from-sequence-too-few-unique-values = Kabiena bienzeka kusungula mbalu { $numToSelect } idi kayi ipitulula mu mulongolodi wa bule { $numPossibleValues }

select-prime-numbers-too-few-values = Kabiena bienzeka kusungula mbalu { $numToSelect } mu mulongolodi wa nomba ya prime wa bule { $numValues }

select-prime-numbers-values-count-mismatch = Bungi bua mbalu miteka ku select budi ne bua kumvuangana ne bungi bua kusungula

select-prime-numbers-values-not-prime = Mbalu yonso miteka ku select prime number idi ne bua kuikala mu mulongolodi wa nomba ya prime

select-prime-numbers-values-excluded-combination = Mbalu miteka ya selectPrimeNumbers ivua disangisha dimbushibue

select-prime-numbers-excluded-too-many-combinations = Tumbusha masangisha apita 70% mu selectPrimeNumbers

select-random-combination-fluke = Ku bualu budi kabuyi mua kuenzeka menemene, katuvua mua kusungula disangisha dia mbalu ya patupu

select-random-value-fluke = Ku bualu budi kabuyi mua kuenzeka menemene, katuvua mua kusungula mbalu wa patupu
