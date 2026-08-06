# Fijian diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
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
# Fijian marks no number on the noun, so a counted message whose only English
# difference is the noun's number renders one string here and the select is
# dropped. The count still arrives and is still formatted.


## `<lineSegment>`

# No select: «sa beci» does not agree with what is ignored, and the list carries
# no number of its own.
line-segment-attributes-ignored-with-endpoints = sa beci na { $attributes } ni sa vakatakilai na rua na iyalayala

line-segment-attributes-ignored-with-endpoint-and-midpoint = sa beci na { $attributes } ni sa vakatakilai na dua na iyalayala kei na loma

line-segment-midpoint-offset-without-midpoint = e sega ni yaga na midpointOffset ke sega na loma

## `<line>`

line-points-undetermined-dimensions = Laini e lako yani ena poini e sega ni kilai na kena rabalevu.

line-points-too-few-dimensions = E dodonu me lako na laini ena poini e rua se sivia na kena rabalevu.

line-points-depend-on-variables = Na laini e lako yani ena poini e vakararavi ena veisau: { $variables }.

line-equation-invalid-format = Ivakarau ni ikuwe ni laini e sega ni dodonu ena veisau { $variable1 } kei na { $variable2 }.

## `<ray>`

ray-overprescribed-through = Na serau e vakatakilai ena through, endpoint kei na direction.  Sa beci na through e vakatakilai.

ray-dimension-mismatch = e sega ni veiganiti na numDimensions ena serau.

## `<vector>`

vector-overprescribed-head = Na vekita e vakatakilai ena head, tail kei na displacement.  Sa beci na head e vakatakilai.

vector-dimension-mismatch = e sega ni veiganiti na numDimensions ena vekita.

## Attracting and constraining

attract-to-without-nearest-point = E sega ni rawa ni dreti ki na `<{ $component }>` ni sega ni tiko vua na veisau ni ituvaki nearestPoint.

constrain-to-without-nearest-point = E sega ni rawa ni vakaiyalayalataki ki na `<{ $component }>` ni sega ni tiko vua na veisau ni ituvaki nearestPoint.

constrain-to-interior-without-nearest-point = E sega ni rawa ni vakaiyalayalataki ki na loma ni `<{ $component }>` ni sega ni tiko vua na veisau ni ituvaki nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = sa beci na labelPosition ena choiceInput e sega ni inline

## Ordering children by index

choice-input-indices-count-mismatch = Sa beci na indeki e vakatakilai me baleta na choiceInput ni sega ni veiganiti na iwiliwili ni indeki kei na iwiliwili ni digidigi.

pretzel-indices-count-mismatch = Sa beci na indeki e vakatakilai me baleta na problem ni sega ni veiganiti na iwiliwili ni indeki kei na iwiliwili ni problem.

shuffle-indices-count-mismatch = Sa beci na indeki e vakatakilai me baleta na shuffle ni sega ni veiganiti na iwiliwili ni indeki kei na iwiliwili ni iwasewase.

indices-ignored-out-of-range = Sa beci na indeki e vakatakilai me baleta na { $component } ni tiko e dua na indeki e sivia na iyalayala.

pretzel-indices-repeated = Sa beci na indeki e vakatakilai me baleta na pretzel ni tiko e dua na indeki e vakaruataki.

pretzel-circuit-first-index = Sa beci na indeki e vakatakilai me baleta na pretzel ena mode circuit ni dodonu me 1 na indeki imatai.

## `<shuffle>` and `<sort>`

string-children-need-type = Me cakacaka na `<{ $component }>` kei na luvena string, e dodonu me vakatakilai na atirabiuti `type`.

invalid-type-defaulting-to-math = Na type { $type } e sega ni dodonu me baleta na iwasewase { $component }. E dodonu me dua vei math, text, number, se boolean. Sa vakayagataki na math.

string-not-valid-component-to-arrange = Na string "{ $value }" e sega ni iwasewase dodonu me baleta na { $component }. Sa beci.

## Types and variables

invalid-type-defaulting-to-number = Na type { $type } e sega ni dodonu, sa biu na type ki na number.

invalid-variable-value = Ivalu ni veisau e sega ni dodonu: `{ $value }`

## Variants

variant-index-must-be-number = E dodonu me namba na indeki ni ivakaduidui { $index }

variant-index-must-be-integer = E dodonu me namba taucoko na indeki ni ivakaduidui { $index }

## `<sideBySide>`

side-by-side-absolute-widths = Se bera ni caka rawa na `<{ $component }>` me baleta na ivakarau dei. Sa biu me veisau na kena rabalevu.

side-by-side-absolute-margins = Se bera ni caka rawa na `<{ $component }>` me baleta na ivakarau dei. Sa biu me veisau na kena bati.

side-by-side-no-block-child = `<{ $component }>` e sega ni dodonu: e dodonu me tiko vua e dua na luvena block.

## `<label>`

label-for-ignored-on-graphical = Sa beci na atirabiuti `for` ena `<label>` vakairairai.

label-for-must-resolve-to-one = E dodonu me dusia na atirabiuti `for` ena `<label>` e dua ga na iwasewase.

label-for-unresolved = E sega ni dusia rawa na atirabiuti `for` ena `<label>` e dua na iwasewase.

label-for-answer-with-authored-inputs = Na atirabiuti `for` ena `<label>` e dusia e dua na `<answer>` e tiko kina na icurucuru e volai vua na dauvola; dusia sara ga na icurucuru.

label-for-answer-without-input = Na atirabiuti `for` ena `<label>` e dusia e dua na `<answer>` e sega ni tiko kina e dua na icurucuru me vakayacani.

label-for-must-reference-input-or-answer = E dodonu me dusia na atirabiuti `for` ena `<label>` e dua na icurucuru se e dua na answer.

## Accessibility

accessibility-short-description-or-decorative = Me baleta na rawarawa, e dodonu me tiko vua na `<{ $component }>` e dua na ivakamacala lekaleka se me vakatakilai me iukuuku.

accessibility-video-short-description = Me baleta na rawarawa, e dodonu me tiko vua na `<video>` e dua na ivakamacala lekaleka.

accessibility-input-short-description-or-label = Me baleta na rawarawa, e dodonu me tiko vua na `<{ $component }>` e dua na ivakamacala lekaleka se e dua na iyaca.

accessibility-answer-input-short-description-or-label = Me baleta na rawarawa, e dodonu me tiko vua e dua na `<answer>` e buli icurucuru e dua na ivakamacala lekaleka se e dua na iyaca.

accessibility-short-description-contains-math = E sega ni dodonu me tiko ena ivakamacala lekaleka na iwasewase vakaiwiliwili me vaka na `<{ $component }>`. Vola ena vosa na veika vakaiwiliwili.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] E sega ni rauta na duidui ni { $colorName } me baleta na itukutuku ni ulutaga ni wase (mode butobuto) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e gadrevi me { $threshold }:1 se sivia).
       *[other] E sega ni rauta na duidui ni { $colorName } me baleta na itukutuku ni ulutaga ni wase ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e gadrevi me { $threshold }:1 se sivia).
    }

## `<circle>`

circle-through-points-non-numerical = Se bera ni caka rawa na `<circle>` e lako ena { $count } na poini ke sega ni tiko na kedra ivalu vakanamba.

circle-too-many-through-points = E sega ni rawa ni wilika e dua na sekele e lako ena poini e sivia na 3.

circle-overprescribed-radius-center-points = E sega ni rawa ni wilika e dua na sekele e vakatakilai na kena reidiasi, na kena loma kei na poini e lako kina.

circle-center-with-multiple-points = E sega ni rawa ni wilika e dua na sekele e vakatakilai na kena loma ka lako ena poini e sivia na 1.

circle-radius-too-small = E sega ni rawa ni wilika na sekele: ni na yawa ni rua na poini e { $distance }, sa lailai vakalevu na reidiasi { $radius } e vakatakilai.

circle-radius-with-many-points = E sega ni rawa ni buli e dua na sekele e lako ena poini e sivia na rua kei na reidiasi e vakatakilai.

circle-invalid-center-or-through-points = E sega ni dodonu na loma se na poini e lako kina na sekele.

circle-radius-center-with-multiple-points = E sega ni rawa ni wilika na reidiasi ni sekele e vakatakilai na kena loma ka lako ena poini e sivia na 1.

circle-change-radius-non-numerical = E sega ni rawa ni veisautaki na reidiasi ni sekele e lako ena poini e sega ni vakanamba

circle-radius-with-points-non-numerical = E sega ni rawa ni buli e dua na sekele e lako ena poini e sivia na dua kei na reidiasi e vakatakilai ke sega na ivalu vakanamba.

circle-change-center-non-numerical = Se bera ni caka rawa na veisau ni loma ni sekele e lako ena poini e sega ni tiko na kedra ivalu vakanamba.

## `<function>`

# English's two counts multiply out to four sentences; Fijian has one, because
# «kalawa» and «icurucuru» do not change for number. Both selects are dropped
# and both counts still arrive.
function-domain-insufficient-dimensions = E sega ni rauta na rabalevu ni domain me baleta na fanisini. E tiko ena domain e { $intervals } na kalawa ia e tiko ena fanisini e { $inputs } na icurucuru.

function-domain-invalid-format = Ivakarau ni domain me baleta na fanisini e sega ni dodonu.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Sa beci na kena levu duadua ni fanisini e sega ni vakanamba.
        [minimum] Sa beci na kena lailai duadua ni fanisini e sega ni vakanamba.
        [extremum] Sa beci na kena iyalayala ni fanisini e sega ni vakanamba.
        [point] Sa beci na poini ni fanisini e sega ni vakanamba.
        [slope] Sa beci na kena tacini ni fanisini e sega ni vakanamba.
       *[other] Sa beci na { $type } ni fanisini e sega ni vakanamba.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Sa beci na kena levu duadua ni fanisini e lala.
        [minimum] Sa beci na kena lailai duadua ni fanisini e lala.
        [extremum] Sa beci na kena iyalayala ni fanisini e lala.
        [point] Sa beci na poini ni fanisini e lala.
       *[other] Sa beci na { $type } ni fanisini e lala.
    }

function-points-too-close = E tiko ena fanisini e rua na poini e veivolekati vakalevu. E sega ni rawa ni vakamacalataki na fanisini.

# Both selects dropped, for the reason above.
function-iterates-input-output-mismatch = E rawa ga na veivakaruataki ni fanisini ke tautauvata na iwiliwili ni icurucuru kei na iwiliwili ni ilavo. Na fanisini oqo e tiko kina e { $inputs } na icurucuru kei na { $outputs } na ilavo.

## `<sequence>`

sequence-invalid-length = Kena balavu ni sequence e sega ni dodonu.  E dodonu me namba taucoko e sega ni lolovira.

sequence-invalid-step = Na step ni sequence e sega ni dodonu.  E dodonu me namba me baleta na sequence type { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" ni sequence vakanamba e sega ni dodonu.  E dodonu me namba.

sequence-invalid-endpoint-letters = "{ $attribute }" ni sequence vakamatanivola e sega ni dodonu.  E dodonu me iwiliwili ni matanivola.

sequence-invalid-endpoint = "{ $attribute }" ni sequence e sega ni dodonu.

select-from-sequence-coprime-not-numbers = sa beci na coprime ni sega ni namba e digitaki

select-from-sequence-coprime-with-exclude-combinations = sa beci na coprime ni sa vakatakilai na excludeCombinations

## Resolving a `target`

target-not-found = target e sega ni dodonu me baleta na `<{ $source }>`: e sega ni kune na target.

target-state-variable-not-found = target e sega ni dodonu me baleta na `<{ $source }>`: e sega ni kune e dua na veisau ni ituvaki e yacana "{ $property }" ena dua na `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = E dodonu me duidui na veisau ni `<odeSystem>` mai na veisau galala.

ode-system-duplicate-variable-names = E sega ni rawa ni vakamacalataki na fanisini RHS ni ODE ke tautauvata na yaca ni veisau vakararavi.

ode-system-rhs-function-error = E sega ni rawa ni vakamacalataki na fanisini RHS ni ODE.  E dua na cala ena buli ni fanisini mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = E sega ni rawa ni vakamacalataki e dua na kona ena kedra maliwa e { $count } na laini

angle-invalid-through-point = Poini e sega ni dodonu ena through ni `<angle>`

parabola-vertex-too-many-points = Se bera ni caka rawa na parabola e tiko kina na kena dela ka lako ena poini e sivia na 1.

parabola-too-many-points = Se bera ni caka rawa na parabola e lako ena poini e sivia na 3.

intersection-too-many-items = Se bera ni caka rawa na veitaravi me sivia na rua na ka

## Other math components

ionic-compound-not-two-ions = Se bera ni caka rawa na iwiliwili ni aioni me baleta e dua tale na ka ka sega ni rua na aioni.

ionic-compound-needs-cation-and-anion = E caka ga na iwiliwili ni aioni me baleta e dua na kationi kei na dua na anioni.

solve-equations-cannot-evaluate = E sega ni rawa ni wali na ikuwe ni sega ni rawa ni vakadikevi: { $equation }

math-operators-operand-number-required = E dodonu me vakatakilai na operandNumber ni sa taura e dua na operand vakaiwiliwili.

eigen-decomposition-failed = E sega ni rawa ni wilika na eigenvalue ni matiriki

## `<matchesPattern>`

# No select: the parameter list carries no number that the noun would show.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: na parameter { $parameters } e sega ni basika ena pattern, o koya e na veiganiti wale ga kei na ka lala.

## `<graph>`

graph-grid-invalid = `<graph>`: e sega ni matata na grid="{ $grid }". E dodonu me none, medium, dense, se rua na namba vinaka e wasei ena kalawa, me vaka na grid="1 0.5". E sega ni droini e dua na grid.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: e sega ni tokoni na xLabelPosition="left" ena renderer prefigure; sa vakayagataki na itovo ni vanua imatau.

prefigure-y-label-position-unsupported = `<graph>`: e sega ni tokoni na yLabelPosition="bottom" ena renderer prefigure; sa vakayagataki na itovo ni vanua cake.

prefigure-invalid-axis-bounds = `<graph>`: e sega ni dodonu na iyalayala ni akesisi me baleta na veisau prefigure; sa vakayagataki na bbox dau vakayagataki (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: e sega ni dodonu na rabalevu me baleta na veisau prefigure; sa vakayagataki na rabalevu ni draki 425.

prefigure-invalid-aspect-ratio = `<graph>`: e sega ni dodonu na aspectRatio me baleta na veisau prefigure; sa vakayagataki na aspect ratio 1.

prefigure-grid-spacing-too-fine = `<graph>`: sa lailai vakalevu na kalawa ni grid me baleta na iyalayala ni akesisi; e sega ni droini na grid ena renderer prefigure.

prefigure-annotations-not-rendered = `<graph>`: e sega ni droini na annotation ke sega ni vakayagataki na renderer PreFigure.

multiple-annotations-children = E kune e levu na luvena `<annotations>` ena `<graph>`; sa beci kece vakavo na kena iotioti.

## Referring to other components

copy-unrecognized-component-type = E sega ni rawa ni vakabalavutaki se vakatetei e dua na mataqali iwasewase e sega ni kilai: { $type }.

copy-prop-not-found = E sega ni kune na prop { $property } ena iwasewase mataqali { $component }

collect-no-source = E sega ni kune e dua na source me baleta na collect.

collect-invalid-component-type = E sega ni rawa ni kumuni na iwasewase mataqali `<{ $component }>` ni sega ni dodonu na mataqali iwasewase.

reference-index-unavailable = E sega ni rawa ni dusi na indeki `{ $reference }`

## `<callAction>`

component-action-unavailable = E sega ni rawa ni kacivi na { $action } ena iwasewase `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = E sega ni dodonu na ivakarau ni idatabesi.  E sega ni tautauvata na kedra balavu na rowa. E kune ena componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = E tiko ena idatabesi e dua na yaca ni duru e vakaruataki.  E kune ena componentIdx :{ $componentIdx }

data-frame-missing-column-name = E sega ni tiko na yaca ni dua na duru ena idatabesi.  E kune ena componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Na award ni isau oqo e yavutaki ena isau e vakau mai na answer tag ga, ka na vakavuna e dua na itovo e sega ni namaki.

answer-max-num-attempts-in-section-wide-check-work = E sega ni yaga na biu ni `maxNumAttempts` ena dua na `<answer>` e tiko ena loma ni kato e tiko kina na `sectionWideCheckWork`, ni na kato e lewa na iwiliwili ni isaga. Biuta na `maxNumAttempts` ena kato.

nested-section-wide-check-work-max-num-attempts = E sega ni yaga na biu ni `maxNumAttempts` ena kato e tiko kina na `sectionWideCheckWork` ka tiko ena loma ni dua tale na kato e tiko kina na `sectionWideCheckWork`, ni na kato e tu i tuba e lewa na iwiliwili ni isaga. Biuta na `maxNumAttempts` ena kato e tu i tuba.

# No select: «atirabiuti» is the same word for one and for many.
answer-attributes-need-symbolic-equality = E na sega ni yaga na atirabiuti { $attributes } ke sega ni biu na symbolicEquality.

answer-invalid-type = Mataqali e sega ni dodonu me baleta na isau: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ni sega ni tiko vua na iwasewase `<{ $component }>` e dua na yaca, e sega ni rawa ni vakayagataki me atirabiuti ni module

module-attribute-name-already-defined = E sega ni rawa ni vakayagataki na iwasewase `<{ $component } name="{ $name }">` me atirabiuti ni module ni sa tiko rawa vua na mataqali iwasewase `<module>` na atirabiuti "{ $name }".

conditional-content-condition-ignored = Sa beci na atirabiuti `condition` ena iwasewase `<conditionalContent>` e tiko kina na luvena case se else.

slider-markers-type-mismatch = E sega ni veiganiti na mataqali ni marker kei na mataqali ni slider.

pretzel-problem-needs-statement-and-answer = Pretzel e sega ni dodonu: e dodonu me tiko ena `<problem>` yadua e dua na `<statement>` kei na dua na `<answer>`.

pretzel-circuit-first-problem-distractor = Pretzel e sega ni dodonu: ena mode="circuit", e sega ni rawa me distractor na `<problem>` imatai.

## Attribute values

# No select: «ivalu» is the same word for one and for many.
attribute-invalid-values = Ivalu { $values } e sega ni dodonu me baleta na atirabiuti `{ $attribute }`; sa beci.

attribute-must-be-references = Ivalu `{ $value }` e sega ni dodonu me baleta na atirabiuti `{ $attribute }`. E dodonu me buli na atirabiuti mai na ivakadewa e tekivu ena `$`.

math-input-invalid-function-names = <mathInput>: sa beci na yaca ni fanisini e sega ni dodonu ena { $attribute }: { $names }. E dodonu me tiko ena yaca yadua e rua se sivia na matanivola (matanivola se laini); e rawa ni muri e dua na suffix `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Mataqali iwasewase e sega ni dodonu: `<{ $componentType }>`

attribute-repeated = E sega ni rawa ni vakaruataki na atirabiuti { $attribute }.

attribute-invalid-for-component = Atirabiuti "{ $attribute }" e sega ni dodonu me baleta na iwasewase mataqali `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    E sega ni rauta na duidui ni ivakamacala ni isitaili { $styleNumber } me baleta na { $context ->
        [text-on-background] roka ni itukutuku vaka ki na roka ni tuvaki
        [high-contrast] roka duidui cecere vaka ki na kanavasi
        [line] roka ni laini vaka ki na kanavasi
        [marker] roka ni marker vaka ki na kanavasi
       *[text-on-canvas] roka ni itukutuku vaka ki na kanavasi
    }{ $mode ->
        [dark] { " (mode butobuto)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e gadrevi me { $threshold }:1 se sivia).

style-definition-dark-mode-text-background-contrast =
    Dina ga ni tiko ena ivakamacala ni isitaili { $styleNumber } na roka e vakatakilai ka rauta na kena duidui ena mode rarama, e sega ni rauta na duidui ni roka ni itukutuku vaka ki na roka ni tuvaki ena roka e taurivaki me baleta na mode butobuto ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e gadrevi me { $threshold }:1 se sivia). { $suggestion ->
        [available] Me rauta na duidui ena mode butobuto, vakalevutaka na duidui ni mode rarama (kena ivakaraitaki, biuta na { $lightAttribute }="{ $lightColor }") se sosomitaka na roka ni mode butobuto (kena ivakaraitaki, biuta na { $darkAttribute }="{ $darkColor }").
       *[none] Me rauta na duidui ena mode butobuto, vakalevutaka na duidui ni mode rarama se sosomitaka na roka e taurivaki ena textColorDarkMode kei/se na backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Dina ga ni tiko ena ivakamacala ni isitaili { $styleNumber } na roka ni itukutuku e vakatakilai ka rauta na kena duidui ena mode rarama, e sega ni rauta na duidui ni roka ni itukutuku e taurivaki me baleta na mode butobuto vaka ki na kanavasi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e gadrevi me { $threshold }:1 se sivia). { $suggestion ->
        [available] Me rauta na duidui ena mode butobuto, vakalevutaka na duidui ni mode rarama (kena ivakaraitaki, biuta na textColor="{ $lightColor }") se sosomitaka na roka ni mode butobuto (kena ivakaraitaki, biuta na textColorDarkMode="{ $darkColor }").
       *[none] Me rauta na duidui ena mode butobuto, vakalevutaka na duidui ni mode rarama se sosomitaka na roka e taurivaki ena textColorDarkMode.
    }

section-multiple-style-palettes = E dua ga na <stylePalette> e rawa ni digitaka e dua na wase; sa vakayagataki na kena iotioti.

## Unique variants

variant-num-to-select-not-non-negative-integer = e sega ni rawa ni vakadeitaki na ivakaduidui duatani ni { $component } ni sega ni namba taucoko e sega ni lolovira na numToSelect.

variant-num-to-select-not-constant-number = e sega ni rawa ni vakadeitaki na ivakaduidui duatani ni { $component } ni sega ni namba dei na numToSelect.

variant-with-replacement-not-constant-boolean = e sega ni rawa ni vakadeitaki na ivakaduidui duatani ni { $component } ni sega ni boolean dei na withReplacement.

variant-select-weight-disables-unique = Sa vakamatei na ivakaduidui duatani me baleta na select ke tiko e dua na digidigi e vakatakilai kina na selectWeight se selectForVariants

variant-coprime-undetermined = e sega ni rawa ni vakadeitaki na ivakaduidui duatani ni { $component } ni sega ni rawa ni vakadeitaki ni false tiko ga na coprime.

variant-attribute-not-constant = e sega ni rawa ni vakadeitaki na ivakaduidui duatani ni { $component } ni sega ni dei na { $attribute }.

variant-attribute-not-number = e sega ni rawa ni vakadeitaki na ivakaduidui duatani ni { $component } ni sega ni namba na { $attribute }.

variant-attribute-wrong-type-for-sequence =
    e sega ni rawa ni vakadeitaki na ivakaduidui duatani ni { $component } mataqali { $type } ni sega ni { $expected ->
        [letters-combination] iwiliwili ni matanivola
        [math-expression] ivakamacala vakaiwiliwili dodonu
        [integer] namba taucoko
       *[number] namba
    } na { $attribute }.

variant-length-not-integer = e sega ni rawa ni vakadeitaki na ivakaduidui duatani ni { $component } ni sega ni namba taucoko na length.

variant-sort-not-implemented = se bera ni caka rawa na ivakaduidui duatani ni dua na { $component } e tiko kina na sort

variant-exclude-combinations-not-implemented = se bera ni caka rawa na ivakaduidui duatani ni dua na { $component } e tiko kina na excludeCombinations

variant-math-exclude-not-implemented = se bera ni caka rawa na ivakaduidui duatani ni dua na { $component } mataqali math e tiko kina na exclude

variant-non-constant-exclude-not-implemented = se bera ni caka rawa na ivakaduidui duatani ni dua na { $component } e tiko kina na exclude e sega ni dei

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: e sega ni tokoni ena renderer prefigure ni graph; sa lauti na kawa.

prefigure-descendant-invalid-geometry = { $subject }: e sega ni yalani se sega ni taucoko na kena ivakarau; sa lauti na kawa.

prefigure-curve-label-omitted = { $subject }: e sega ni tokoni na iyaca ena kavu e vakasosomitaki; sa beci na iyaca.

prefigure-curve-unsupported-definition-type = { $subject }: mataqali ivakamacala ni fanisini kavu '{ $definitionType }' e sega ni tokoni; sa lauti na kawa.

prefigure-region-flip-functions-unsupported = { $subject }: e sega ni tokoni na atirabiuti flipFunctions ena regionBetweenCurves; sa lauti na kawa.

prefigure-region-non-formula-child = { $subject }: na luvena fanisini mataqali formula ga e tokoni ena regionBetweenCurves; sa lauti na kawa.

prefigure-label-position-unsupported =
    { $subject }: e sega ni tokoni na labelPosition '{ $labelPosition }' me baleta na { $labelKind ->
        [line-family] iyaca ni matavuvale ni laini
       *[point] iyaca ni poini
    }; sa vakayagataki na ivakadodonu ni PreFigure.

prefigure-fill-style-unsupported = { $subject }: e sega ni tokoni e PreFigure na isitaili ni loma '{ $fillStyle }'; sa lesu ki na loma sinai.

prefigure-line-style-unknown = { $subject }: isitaili ni laini '{ $lineStyle }' e sega ni kilai, sa beci mai na output ni PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: sa vauci na isitaili ni marker '{ $markerStyle }' ki na isitaili 'diamond' ni PreFigure.

prefigure-marker-style-unsupported = { $subject }: e sega ni tokoni e PreFigure na isitaili ni marker '{ $markerStyle }'; sa vakayagataki na isitaili dau vakayagataki.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` e sega ni dodonu; e sega ni rawa ni dusi na target. Sa beci na annotation.

annotation-ref-multiple-targets = `<annotation>`: e dusia na `ref` e levu na target; sa vakayagataki na target imatai.

annotation-ref-outside-graph = `<annotation>`: `ref` e sega ni dodonu; e tu i tuba na target mai na graph e tiko kina. Sa beci na annotation.

annotation-ref-unsupported-target = `<annotation>`: `ref` e sega ni dodonu; na target e sega ni ka vakairairai e tokoni ena veisau prefigure. Sa beci na annotation.

annotation-text-missing = `<annotation>`: e sega se lala na `text`; sa biu e dua na itukutuku lala.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] E kune e dua na veivakararavi vakavolivoli.
       *[other] E kune e dua na veivakararavi vakavolivoli e okati kina na iwasewase `<{ $componentType }>`.
    }

reference-no-referent = E sega ni kune e dua na ka e dusia na ivakadewa: `{ $reference }`

reference-multiple-referents = E levu na ka e kune e dusia na ivakadewa: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ivakarau ni atirabiuti { $attribute } ni `<{ $componentType }>` e sega ni dodonu.

children-invalid = E sega ni dodonu na luvena `<{ $componentType }>`: e kune na luvena e sega ni dodonu: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ivalu `{ $value }` e sega ni dodonu me baleta na atirabiuti `{ $attribute }`, sa vakayagataki na ivalu `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] E sega ni kune na kena ivakarau DoenetML { $version }.
       *[other] E sega ni kune na kena ivakarau DoenetML { $version }. Sa lesu ki na kena ivakarau { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML e sega ni dodonu: { $content }

parse-tag-missing-close-tag = DoenetML e sega ni dodonu: E sega ni tiko vua na tag `{ $tag }` e dua na tag ni sogo. E namaki e dua na tag e sogota koya se e dua na tag `</{ $tagName }>`.

parse-tag-error = DoenetML e sega ni dodonu: E dua na cala ena tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML e sega ni dodonu: E vaka me sega ni tiko vua na atirabiuti `{ $attribute }` e dua na ivalu.

parse-attribute-invalid = DoenetML e sega ni dodonu: Atirabiuti `{ $attribute }` e sega ni dodonu

parse-attribute-value-invalid = DoenetML e sega ni dodonu: Ivalu ni atirabiuti `{ $value }` e sega ni dodonu

parse-attribute-value-quote-mismatch = DoenetML e sega ni dodonu: Ivalu ni atirabiuti `{ $value }` e sega ni dodonu. E sega ni veiganiti na ivakatakilakila ni vosa. E vaka me sega e dua na `{ $quote }`

parse-open-tag-name-missing = DoenetML e sega ni dodonu: E kune e dua na tag e sega ni yacani, me vaka na `<`

parse-tag-not-closed = DoenetML e sega ni dodonu: E sega ni sogoti na tag `{ $tag }` (e vaka me sega e dua na `>`).

parse-self-closing-tag-name-missing = DoenetML e sega ni dodonu: E kune e dua na tag e sega ni yacani `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML e sega ni dodonu: E sega ni sogoti na tag `{ $tag }` (e vaka me sega e dua na `/>`).

parse-tag-invalid-attributes = DoenetML e sega ni dodonu: E sega ni dodonu na tag `{ $tag }`. De dua e sega ni dodonu na kena atirabiuti.

parse-close-tag-name-missing = DoenetML e sega ni dodonu: E kune e dua na tag ni sogo e sega ni yacani, me vaka na `</`

parse-attribute-value-unquoted = E dodonu me biu na ivalu ni atirabiuti ena loma ni ivakatakilakila ni vosa: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML e sega ni dodonu: E kune e dua na tag ni sogo `{ $tag }`, ia e sega ni tiko na tag ni dola e veiganiti

parse-close-tag-mismatched = DoenetML e sega ni dodonu: E sega ni veiganiti na tag ni sogo. E namaki na `</{ $expected }>`. E kune na `{ $found }`

parser-node-unconvertible = E sega ni rawa ni vakasosomitaki na node { $node } ki na node Dast.

## Names

name-attribute-invalid =
    Atirabiuti name='{ $name }' e sega ni dodonu. { $reason ->
        [characters] E rawa ga ni tiko ena yaca na matanivola, namba, laini e ra se laini ni veiwasei.
       *[start] E dodonu me tekivu na yaca ena dua na matanivola.
    }

component-name-invalid-start = Yaca ni iwasewase "{ $name }" e sega ni dodonu. E dodonu me tekivu na yaca ena dua na matanivola.

## `<answer>` sugar

answer-video-watched-missing-video = E dodonu me tiko vua na answer e type videoWatched e dua na atirabiuti video

answer-video-watched-video-not-reference = E dodonu me ivakadewa na atirabiuti video ni answer e type videoWatched

answer-name-not-single-text = E dodonu me tiko vua na atirabiuti name ni answer e dua ga na luvena text

## Referencing another document

external-doenetml-recursion-limit = E sega ni rawa ni taurivaki na DoenetML mai tuba ena vuku ni levu ni kena tabana ni veivakaruataki. E tiko beka e dua na ivakadewa vakavolivoli?

external-doenetml-unavailable = E sega ni rawa ni taurivaki na DoenetML mai na { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML e sega ni dodonu e taurivaki mai na { $attribute }="{ $uri }": e sega ni veiganiti kei na mataqali iwasewase "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Sa sega ni vakayagataki na atirabiuti `{ $from }`; vakayagataka na `{ $to }`.
       *[other] [deprecation] Sa sega ni vakayagataki na atirabiuti `{ $from }` ena `<{ $component }>`; vakayagataka na `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Sa sega ni vakayagataki na atirabiuti `{ $from }` ka sa beci ni sa vakatakilai talega na `{ $to }`.
       *[other] [deprecation] Sa sega ni vakayagataki na atirabiuti `{ $from }` ena `<{ $component }>` ka sa beci ni sa vakatakilai talega na `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Sa sega ni vakayagataki na atirabiuti `{ $attribute }` ena `<{ $component }>` ka sa beci.

deprecated-attribute-to-child = [deprecation] Sa sega ni vakayagataki na atirabiuti `{ $attribute }` ena `<{ $component }>`; vakayagataka e dua na luvena `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Sa sega ni vakayagataki na ivalu `{ $value }` ni atirabiuti `{ $attribute }` ena `<{ $component }>`; vakayagataka na `{ $to }`.


## Language coverage

pluralize-english-only = Na `<pluralize>` e rawa ga ni vakalevutaka na vosa vakavalagi, o koya e sega kina ni veisau na kena itukutuku ena ivola e volai ena { $locale }. Vola sara ga na kena ivakarau levu, se biuta ena atirabiuti `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Na elemede `<{ $tag }>` e sega ni elemede ni Doenet e kilai.

schema-element-not-allowed-at-root = E sega ni vakadonui na elemede `<{ $tag }>` ena wakana ni ivola.

schema-element-not-allowed-inside = E sega ni vakadonui na elemede `<{ $tag }>` ena loma ni `<{ $parent }>`.

schema-attribute-unrecognized = E sega ni tiko vua na elemede `<{ $tag }>` e dua na atirabiuti e yacana `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] E dodonu me ilisi na atirabiuti `{ $attribute }` ni elemede `<{ $tag }>` ka dua ena kena ka yadua mai na: { $allowed }
       *[other] E dodonu me dua mai na oqo na atirabiuti `{ $attribute }` ni elemede `<{ $tag }>`: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Yaca ni ivakaduidui e sega ni dodonu me baleta na select.  Na yaca ni ivakaduidui { $variantName } e basika ena { $numOptions } na digidigi ia na iwiliwili me digitaki e { $numToSelect }.

select-variant-name-without-options = E vakatakilai e so na ivakaduidui me baleta na select ia e sega ni vakatakilai e dua na digidigi me baleta na yaca ni ivakaduidui: { $variantName }.

select-variant-name-not-possible = Na yaca ni ivakaduidui { $variantName } e vakatakilai me baleta na select e sega ni yaca ni ivakaduidui e rawa.

select-too-few-options = E sega ni rawa ni digitaki e { $numToSelect } na iwasewase mai na { $numOptions } ga.

select-from-sequence-too-few-values = E sega ni rawa ni digitaki e { $numToSelect } na ivalu mai na sequence e { $length } na kena balavu.

select-from-sequence-indices-count-mismatch = E dodonu me veiganiti na iwiliwili ni indeki e vakatakilai me baleta na select kei na iwiliwili me digitaki

select-from-sequence-indices-not-integers = E dodonu me namba taucoko na indeki kece e vakatakilai me baleta na select

select-from-sequence-index-excluded = Na indeki ni selectfromsequence e vakatakilai e a tabu

select-from-sequence-indices-excluded-combination = Na indeki ni selectfromsequence e vakatakilai e dua na iwiliwili e a tabu

select-from-sequence-coprime-not-positive-integers = E sega ni rawa ni digitaki na iwiliwili coprime ni sega ni namba taucoko vinaka e digitaki.

select-from-sequence-coprime-common-factor = E sega ni rawa ni digitaki na namba coprime. E tiko ena ivalu kece e dua na faketa vata. (E dodonu me coprime na ivalu "from" se "to" kei na "step".)

select-from-sequence-coprime-single-number = E sega ni rawa ni digitaki na iwiliwili coprime mai na dua ga na namba e sega ni 1.

select-from-sequence-excluded-too-many-combinations = E sivia na 70% ni iwiliwili e tabu ena selectFromSequence

select-from-sequence-coprime-none-found = E sega ni rawa ni digitaki na namba coprime. E tiko ena ivalu kece e dua na faketa vata.

select-from-sequence-too-few-unique-values = E sega ni rawa ni digitaki e { $numToSelect } na ivalu duatani mai na sequence e { $numPossibleValues } na kena balavu

select-prime-numbers-too-few-values = E sega ni rawa ni digitaki e { $numToSelect } na ivalu mai na ilisi ni namba prime e { $numValues } na kena balavu

select-prime-numbers-values-count-mismatch = E dodonu me veiganiti na iwiliwili ni ivalu e vakatakilai me baleta na select kei na iwiliwili me digitaki

select-prime-numbers-values-not-prime = E dodonu me tiko ena ilisi ni namba prime na ivalu kece e vakatakilai me baleta na select prime number

select-prime-numbers-values-excluded-combination = Na ivalu ni selectPrimeNumbers e vakatakilai e dua na iwiliwili e a tabu

select-prime-numbers-excluded-too-many-combinations = E sivia na 70% ni iwiliwili e tabu ena selectPrimeNumbers

select-random-combination-fluke = Ena vuku ni dua na ka e dredre sara ni yaco, e sega ni rawa ni digitaki e dua na iwiliwili ni ivalu veiveisau

select-random-value-fluke = Ena vuku ni dua na ka e dredre sara ni yaco, e sega ni rawa ni digitaki e dua na ivalu veiveisau
