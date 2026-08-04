# Breton diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Breton counts in five plural categories, but nothing below counts high enough
# to separate them, so the selections keep the two branches the English source
# has.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] ne vez ket kemeret { $attributes } e kont pa vez spisaet daou boent-dibenn
       *[other] ne vez ket kemeret { $attributes } e kont pa vez spisaet daou boent-dibenn
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] ne vez ket kemeret { $attributes } e kont pa vez spisaet ur poent-dibenn hag ur c'hreizboent asambles
       *[other] ne vez ket kemeret { $attributes } e kont pa vez spisaet ur poent-dibenn hag ur c'hreizboent asambles
    }

line-segment-midpoint-offset-without-midpoint = n'en deus ket midpointOffset a efed hep kreizboent

## `<line>`

line-points-undetermined-dimensions = Linenn dre boentoù ha n'eo ket anavezet o mentoù.

line-points-too-few-dimensions = Ret eo d'al linenn tremen dre boentoù o deus div vent d'an nebeutañ.

line-points-depend-on-variables = Tremen a ra al linenn dre boentoù a zepant eus argemmennoù: { $variables }.

line-equation-invalid-format = Furmad direizh evit kevatalenn ul linenn en argemmennoù { $variable1 } ha { $variable2 }.

## `<ray>`

ray-overprescribed-through = Spisaet eo ar skin gant through, endpoint ha direction.  Ne vo ket kemeret e kont an through spisaet.

ray-dimension-mismatch = Diglotadur numDimensions er skin.

## `<vector>`

vector-overprescribed-head = Spisaet eo ar vektor gant head, tail ha displacement.  Ne vo ket kemeret e kont an head spisaet.

vector-dimension-mismatch = Diglotadur numDimensions er vektor.

## Attracting and constraining

attract-to-without-nearest-point = N'haller ket sachañ war-zu `<{ $component }>` rak n'en deus ket an argemmenn stad nearestPoint.

constrain-to-without-nearest-point = N'haller ket destrizhañ war-zu `<{ $component }>` rak n'en deus ket an argemmenn stad nearestPoint.

constrain-to-interior-without-nearest-point = N'haller ket destrizhañ war-zu diabarzh `<{ $component }>` rak n'en deus ket an argemmenn stad nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = Ne vez ket kemeret labelPosition e kont evit ur choiceInput ha n'eo ket inline

## Ordering children by index

choice-input-indices-count-mismatch = Ne vez ket kemeret e kont ar meneger spisaet evit choiceInput rak n'eo ket o niver kevatal da niver ar bugale choice.

pretzel-indices-count-mismatch = Ne vez ket kemeret e kont ar meneger spisaet evit problem rak n'eo ket o niver kevatal da niver ar bugale problem.

shuffle-indices-count-mismatch = Ne vez ket kemeret e kont ar meneger spisaet evit shuffle rak n'eo ket o niver kevatal da niver ar parzhioù.

indices-ignored-out-of-range = Ne vez ket kemeret e kont ar meneger spisaet evit { $component } rak lod anezho a zo er-maez eus al ledad.

pretzel-indices-repeated = Ne vez ket kemeret e kont ar meneger spisaet evit pretzel rak lod anezho a zo adlavaret.

pretzel-circuit-first-index = Ne vez ket kemeret e kont ar meneger spisaet evit pretzel er mod circuit rak ret eo d'ar meneger kentañ bezañ 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Evit ma labouro `<{ $component }>` gant bugale neudennoù eo ret spisaat un doareenn `type`.

invalid-type-defaulting-to-math = Seurt direizh { $type } evit ar parzh { $component }. Ret eo dezhañ bezañ unan eus math, text, number pe boolean. O tistreiñ da math.

string-not-valid-component-to-arrange = N'eo ket an neudenn "{ $value }" ur parzh reizh da { $component }. Ne vo ket kemeret e kont.

## Types and variables

invalid-type-defaulting-to-number = Seurt direizh { $type }, o lakaat ar seurt da number.

invalid-variable-value = Talvoud direizh evit un argemmenn: `{ $value }`

## Variants

variant-index-must-be-number = Ret eo da veneger an doare { $index } bezañ un niver

variant-index-must-be-integer = Ret eo da veneger an doare { $index } bezañ un anterin

## `<sideBySide>`

side-by-side-absolute-widths = N'eo ket bet kefloueret `<{ $component }>` evit muzulioù dizave. O lakaat al ledadoù da zaveel.

side-by-side-absolute-margins = N'eo ket bet kefloueret `<{ $component }>` evit muzulioù dizave. O lakaat ar marzioù da zaveel.

side-by-side-no-block-child = `<{ $component }>` direizh: ret eo dezhañ kaout ur bugel bloc'h d'an nebeutañ.

## `<label>`

label-for-ignored-on-graphical = Ne vez ket kemeret an doareenn `for` e kont war ul `<label>` grafek.

label-for-must-resolve-to-one = Ret eo d'an doareenn `for` war `<label>` diskoulmañ ouzh ur parzh hepken.

label-for-unresolved = N'eus ket bet gallet diskoulmañ an doareenn `for` war `<label>` ouzh ur parzh.

label-for-answer-with-authored-inputs = An doareenn `for` war `<label>` a zave ouzh un `<answer>` gant enankadoù skrivet gantañ; davit ouzh an enankad e-unan.

label-for-answer-without-input = An doareenn `for` war `<label>` a zave ouzh un `<answer>` hep enankad da vezañ tikedennet.

label-for-must-reference-input-or-answer = Ret eo d'an doareenn `for` war `<label>` daveiñ ouzh un enankad pe ouzh ur respont.

## Accessibility

accessibility-short-description-or-decorative = Evit an haezadusted eo ret da `<{ $component }>` kaout un deskrivadur berr pe bezañ spisaet evel kinklus.

accessibility-video-short-description = Evit an haezadusted eo ret da `<video>` kaout un deskrivadur berr.

accessibility-input-short-description-or-label = Evit an haezadusted eo ret da `<{ $component }>` kaout un deskrivadur berr pe un dikedenn.

accessibility-answer-input-short-description-or-label = Evit an haezadusted eo ret d'un `<answer>` a grou un enankad kaout un deskrivadur berr pe un dikedenn.

accessibility-short-description-contains-math = Ne zlefe ket un deskrivadur berr enderc'hel parzhioù jedoniel evel `<{ $component }>`. Skrivit ar jedoniezh gant gerioù.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] N'en deus ket { $colorName } dargemm a-walc'h evit testenn titl ar rann (mod teñval) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ret eo kaout { $threshold }:1 d'an nebeutañ).
       *[other] N'en deus ket { $colorName } dargemm a-walc'h evit testenn titl ar rann ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ret eo kaout { $threshold }:1 d'an nebeutañ).
    }

## `<circle>`

circle-through-points-non-numerical = N'eo ket bet kefloueret `<circle>` dre { $count } poent pa n'o deus ket ar poentoù talvoudoù niverel.

circle-too-many-through-points = N'haller ket jediñ ur c'helc'h dre ouzhpenn 3 foent.

circle-overprescribed-radius-center-points = N'haller ket jediñ ur c'helc'h gant skinvent, kreiz ha poentoù tremen spisaet.

circle-center-with-multiple-points = N'haller ket jediñ ur c'helc'h gant ur c'hreiz spisaet dre ouzhpenn ur poent.

circle-radius-too-small = N'haller ket jediñ ar c'helc'h: rak { $distance } eo an hed etre an daou boent, re vihan eo ar skinvent spisaet { $radius }.

circle-radius-with-many-points = N'haller ket krouiñ ur c'helc'h dre ouzhpenn daou boent gant ur skinvent spisaet.

circle-invalid-center-or-through-points = Kreiz pe boentoù tremen direizh evit ar c'helc'h.

circle-radius-center-with-multiple-points = N'haller ket jediñ skinvent ur c'helc'h gant ur c'hreiz spisaet dre ouzhpenn ur poent.

circle-change-radius-non-numerical = N'haller ket cheñch skinvent ur c'helc'h pa n'o deus ket ar poentoù tremen talvoudoù niverel

circle-radius-with-points-non-numerical = N'haller ket krouiñ ur c'helc'h dre ouzhpenn ur poent gant ur skinvent spisaet pa n'eus ket talvoudoù niverel.

circle-change-center-non-numerical = N'eo ket bet kefloueret cheñch kreiz ur c'helc'h dre boentoù hep talvoudoù niverel.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Mentoù re nebeut evit domani an arc'hwel. { $intervals } spas en deus an domani met { $inputs ->
            [one] { $inputs } enankad
           *[other] { $inputs } enankad
        } en deus an arc'hwel.
       *[other] Mentoù re nebeut evit domani an arc'hwel. { $intervals } spas en deus an domani met { $inputs ->
            [one] { $inputs } enankad
           *[other] { $inputs } enankad
        } en deus an arc'hwel.
    }

function-domain-invalid-format = Furmad direizh evit domani an arc'hwel.

function-ignoring-non-numerical =
    { $type ->
        [maximum] O tremen hep uc'hekaad dizigemm an arc'hwel.
        [minimum] O tremen hep izekaad dizigemm an arc'hwel.
        [extremum] O tremen hep pennadur dizigemm an arc'hwel.
        [point] O tremen hep poent dizigemm an arc'hwel.
        [slope] O tremen hep diribin dizigemm an arc'hwel.
       *[other] O tremen hep { $type } dizigemm an arc'hwel.
    }

function-ignoring-empty =
    { $type ->
        [maximum] O tremen hep uc'hekaad goullo an arc'hwel.
        [minimum] O tremen hep izekaad goullo an arc'hwel.
        [extremum] O tremen hep pennadur goullo an arc'hwel.
        [point] O tremen hep poent goullo an arc'hwel.
       *[other] O tremen hep { $type } goullo an arc'hwel.
    }

function-points-too-close = Daou boent re dost an eil d'egile a zo en arc'hwel. N'haller ket termeniñ an arc'hwel.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] N'eo posupl azgraat un arc'hwel nemet pa vez kevatal niver e enankadoù ha niver e ezankadoù. { $inputs } enankad ha { $outputs ->
            [one] { $outputs } ezankad
           *[other] { $outputs } ezankad
        } en deus an arc'hwel-mañ.
       *[other] N'eo posupl azgraat un arc'hwel nemet pa vez kevatal niver e enankadoù ha niver e ezankadoù. { $inputs } enankad ha { $outputs ->
            [one] { $outputs } ezankad
           *[other] { $outputs } ezankad
        } en deus an arc'hwel-mañ.
    }

## `<sequence>`

sequence-invalid-length = Hirder direizh evit ur steudad.  Ret eo dezhañ bezañ un anterin nann-negativel.

sequence-invalid-step = Paz direizh evit ur steudad.  Ret eo dezhañ bezañ un niver evit ur steudad eus ar seurt { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" direizh evit ur steudad niveroù.  Ret eo dezhañ bezañ un niver.

sequence-invalid-endpoint-letters = "{ $attribute }" direizh evit ur steudad lizherennoù.  Ret eo dezhañ bezañ ur c'hedaozadur lizherennoù.

sequence-invalid-endpoint = "{ $attribute }" direizh evit ur steudad.

select-from-sequence-coprime-not-numbers = ne vez ket kemeret coprime e kont rak n'eo ket niveroù a vez diuzet

select-from-sequence-coprime-with-exclude-combinations = ne vez ket kemeret coprime e kont rak spisaet eo bet excludeCombinations

## Resolving a `target`

target-not-found = Pal direizh evit `<{ $source }>`: n'haller ket kavout ar pal.

target-state-variable-not-found = Pal direizh evit `<{ $source }>`: n'haller ket kavout un argemmenn stad anvet "{ $property }" war ur `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Ret eo da argemmennoù `<odeSystem>` bezañ disheñvel diouzh an argemmenn dizalc'h.

ode-system-duplicate-variable-names = N'haller ket termeniñ arc'hwelioù RHS ODE gant anvioù argemmennoù dalc'hus doubl.

ode-system-rhs-function-error = N'haller ket termeniñ an arc'hwel RHS ODE.  Fazi en ur grouiñ un arc'hwel mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = N'haller ket termeniñ ur c'horn etre { $count } linenn

angle-invalid-through-point = Poent direizh e through un `<angle>`

parabola-vertex-too-many-points = N'eo ket bet kefloueret ur barabolenn gant ur beg dre ouzhpenn ur poent.

parabola-too-many-points = N'eo ket bet kefloueret ur barabolenn dre ouzhpenn 3 foent.

intersection-too-many-items = N'eo ket bet kefloueret an troc'hadur evit ouzhpenn daou elfenn

## Other math components

ionic-compound-not-two-ions = N'eo ket bet kefloueret ar gevreadenn ionek nemet evit daou ion.

ionic-compound-needs-cation-and-anion = N'eo ket bet kefloueret ar gevreadenn ionek nemet evit ur c'hation hag un anion.

solve-equations-cannot-evaluate = N'haller ket diskoulmañ ar gevatalenn rak n'eus ket bet gallet he zalvoudekaat: { $equation }

math-operators-operand-number-required = Ret eo spisaat operandNumber pa vez tennet un obererez jedoniel.

eigen-decomposition-failed = N'eus ket bet gallet jediñ eigentalvoudoù ar matris

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: n'emañ ket an arventenn { $parameters } er patrom, setu e klotay atav gant un toull.
       *[other] `<matchesPattern>`: n'emañ ket an arventennoù { $parameters } er patrom, setu e klotint atav gant un toull.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: n'haller ket kompren grid="{ $grid }". Ret eo dezhañ bezañ none, medium, dense, pe daou niver pozitivel dispartiet gant ur spas, evel grid="1 0.5". Ne vo ket treset kael ebet.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: n'eo ket skoret xLabelPosition="left" er c'hempouezer prefigure; oc'h implijout emzalc'h al lec'hiadur dehou.

prefigure-y-label-position-unsupported = `<graph>`: n'eo ket skoret yLabelPosition="bottom" er c'hempouezer prefigure; oc'h implijout emzalc'h al lec'hiadur krec'h.

prefigure-invalid-axis-bounds = `<graph>`: bevennoù ahel direizh evit an treuzfurmadur prefigure; oc'h implijout ar bbox dre ziouer (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: ledander direizh evit an treuzfurmadur prefigure; oc'h implijout ledander tresadenn dre ziouer 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio direizh evit an treuzfurmadur prefigure; oc'h implijout an dregantad neuz dre ziouer 1.

prefigure-grid-spacing-too-fine = `<graph>`: re voan eo esaouiñ ar gael evit bevennoù an ahel; laosket e vo ar gael er-maez er c'hempouezer prefigure.

prefigure-annotations-not-rendered = `<graph>`: ne vo ket kempouezet an notennoù ma n'implijer ket ar c'hempouezer PreFigure.

multiple-annotations-children = Meur a vugel `<annotations>` a zo bet kavet en un `<graph>`; ne vo kemeret e kont nemet an hini diwezhañ.

## Referring to other components

copy-unrecognized-component-type = N'haller ket astenn nag eilañ ur seurt parzh dianav: { $type }.

copy-prop-not-found = N'eus ket bet gallet kavout ar prop { $property } war ur parzh eus ar seurt { $component }

collect-no-source = N'eus bet kavet mammenn ebet evit collect.

collect-invalid-component-type = N'haller ket dastum parzhioù eus ar seurt `<{ $component }>` rak ur seurt parzh direizh eo.

reference-index-unavailable = N'haller ket daveiñ ouzh ar meneger `{ $reference }`

## `<callAction>`

component-action-unavailable = N'haller ket gervel { $action } war ar parzh `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Stumm direizh en deus ar roadennoù.  Hirderioù disklok o deus al linennoù. Kavet e componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Anvioù bann doubl a zo er roadennoù.  Kavet e componentIdx :{ $componentIdx }

data-frame-missing-column-name = Un anv bann a vank er roadennoù.  Kavet e componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Ur priz evit ar respont-mañ a zo diazezet war ar respont kaset gant ar valizenn answer he-unan, ar pezh a gaso da emzalc'h dic'hortoz.

answer-max-num-attempts-in-section-wide-check-work = N'en deus ket efed lakaat `maxNumAttempts` war un `<answer>` e-barzh un dalc'her gant `sectionWideCheckWork`, rak an dalc'her a ren niver an taolioù. Lakait `maxNumAttempts` war an dalc'her kentoc'h.

nested-section-wide-check-work-max-num-attempts = N'en deus ket efed lakaat `maxNumAttempts` war un dalc'her gant `sectionWideCheckWork` a zo e-barzh un dalc'her all gant `sectionWideCheckWork`, rak an dalc'her diavaez a ren niver an taolioù. Lakait `maxNumAttempts` war an dalc'her diavaez kentoc'h.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] N'en devo ket an doareenn { $attributes } a efed hep symbolicEquality lakaet.
       *[other] N'o devo ket an doareennoù { $attributes } a efed hep symbolicEquality lakaet.
    }

answer-invalid-type = Seurt direizh evit ar respont: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Rak n'en deus ket ar parzh `<{ $component }>` un anv, n'haller ket e implijout evel un doareenn vodulenn

module-attribute-name-already-defined = N'haller ket implijout ar parzh `<{ $component } name="{ $name }">` evel un doareenn evit ur vodulenn rak an doareenn "{ $name }" a zo termenet dija gant ar seurt parzh `<module>`.

conditional-content-condition-ignored = Ne vez ket kemeret an doareenn `condition` e kont war ur parzh `<conditionalContent>` gant bugale case pe else.

slider-markers-type-mismatch = Ne glot ket seurt ar merkerioù gant seurt al lammer.

pretzel-problem-needs-statement-and-answer = Pretzel direizh: ret eo da bep `<problem>` enderc'hel ur `<statement>` hag un `<answer>`.

pretzel-circuit-first-problem-distractor = Pretzel direizh: e mode="circuit" n'hall ket ar `<problem>` kentañ bezañ un distroer.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Talvoud direizh { $values } evit an doareenn `{ $attribute }`; ne vo ket kemeret e kont.
       *[other] Talvoudoù direizh { $values } evit an doareenn `{ $attribute }`; ne vint ket kemeret e kont.
    }

attribute-must-be-references = Talvoud direizh `{ $value }` evit an doareenn `{ $attribute }`. Ret eo d'an doareenn bezañ savet gant daveoù a grog gant ur `$`.

math-input-invalid-function-names = <mathInput>: n'eo ket bet kemeret e kont anv(ioù) arc'hwel direizh e { $attribute }: { $names }. Ret eo da lodenn ziskouez pep anv kaout 2 arouezenn d'an nebeutañ (lizherennoù pe gedstrizhoù); ur stagell diret `|<mathspeak alternative>` a c'hall heuliañ.

## Building components from the source

component-type-invalid = Seurt parzh direizh: `<{ $componentType }>`

attribute-repeated = N'haller ket adlavaret an doareenn { $attribute }.

attribute-invalid-for-component = Doareenn direizh "{ $attribute }" evit ur parzh eus ar seurt `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    N'en deus ket termenadur stil { $styleNumber } dargemm a-walc'h evit { $context ->
        [text-on-background] liv an destenn a-enep liv an drekleur
        [high-contrast] al liv dargemm uhel a-enep ar steuenn
        [line] liv al linenn a-enep ar steuenn
        [marker] liv ar merker a-enep ar steuenn
       *[text-on-canvas] liv an destenn a-enep ar steuenn
    }{ $mode ->
        [dark] { " (mod teñval)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ret eo kaout { $threshold }:1 d'an nebeutañ).

style-definition-dark-mode-text-background-contrast =
    Ha pa'z eus gant termenadur stil { $styleNumber } livioù spisaet a ro dargemm a-walc'h er mod sklaer, n'o deus ket al livioù mod teñval tennet diouto dargemm a-walc'h etre liv an destenn ha liv an drekleur ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ret eo kaout { $threshold }:1 d'an nebeutañ). { $suggestion ->
        [available] Evit surentez un dargemm a-walc'h er mod teñval, kreskit dargemm ar mod sklaer (da sk. lakait { $lightAttribute }="{ $lightColor }") pe flastrit liv ar mod teñval (da sk. lakait { $darkAttribute }="{ $darkColor }").
       *[none] Evit surentez un dargemm a-walc'h er mod teñval, kreskit dargemm ar mod sklaer pe flastrit al livioù tennet diouto gant textColorDarkMode ha/pe backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ha pa'z eus gant termenadur stil { $styleNumber } ul liv testenn spisaet a ro dargemm a-walc'h er mod sklaer, n'en deus ket liv testenn ar mod teñval tennet dioutañ dargemm a-walc'h a-enep ar steuenn ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ret eo kaout { $threshold }:1 d'an nebeutañ). { $suggestion ->
        [available] Evit surentez un dargemm a-walc'h er mod teñval, kreskit dargemm ar mod sklaer (da sk. lakait textColor="{ $lightColor }") pe flastrit liv ar mod teñval (da sk. lakait textColorDarkMode="{ $darkColor }").
       *[none] Evit surentez un dargemm a-walc'h er mod teñval, kreskit dargemm ar mod sklaer pe flastrit al liv tennet dioutañ gant textColorDarkMode.
    }

section-multiple-style-palettes = N'hall ur rann diuzañ nemet ur <stylePalette>; oc'h implijout an hini diwezhañ.

## Unique variants

variant-num-to-select-not-non-negative-integer = n'haller ket termeniñ doareoù dizhevelep { $component } rak n'eo ket numToSelect un anterin nann-negativel.

variant-num-to-select-not-constant-number = n'haller ket termeniñ doareoù dizhevelep { $component } rak n'eo ket numToSelect un niver digemm.

variant-with-replacement-not-constant-boolean = n'haller ket termeniñ doareoù dizhevelep { $component } rak n'eo ket withReplacement ur Boole digemm.

variant-select-weight-disables-unique = Diweredekaet e vez an doareoù dizhevelep evit select ma'z eus un dibab gant selectWeight pe selectForVariants spisaet

variant-coprime-undetermined = n'haller ket termeniñ doareoù dizhevelep { $component } rak n'haller ket termeniñ eo faos coprime atav.

variant-attribute-not-constant = n'haller ket termeniñ doareoù dizhevelep { $component } rak n'eo ket { $attribute } digemm.

variant-attribute-not-number = n'haller ket termeniñ doareoù dizhevelep { $component } rak n'eo ket { $attribute } un niver.

variant-attribute-wrong-type-for-sequence =
    n'haller ket termeniñ doareoù dizhevelep { $component } eus ar seurt { $type } rak n'eo ket { $attribute } { $expected ->
        [letters-combination] ur c'hedaozadur lizherennoù
        [math-expression] ur frazenn jedoniel reizh
        [integer] un anterin
       *[number] un niver
    }.

variant-length-not-integer = n'haller ket termeniñ doareoù dizhevelep { $component } rak n'eo ket length un anterin.

variant-sort-not-implemented = n'eo ket bet kefloueret an doareoù dizhevelep eus ur { $component } gant sort

variant-exclude-combinations-not-implemented = n'eo ket bet kefloueret an doareoù dizhevelep eus ur { $component } gant excludeCombinations

variant-math-exclude-not-implemented = n'eo ket bet kefloueret an doareoù dizhevelep eus ur { $component } eus ar seurt math gant exclude

variant-non-constant-exclude-not-implemented = n'eo ket bet kefloueret an doareoù dizhevelep eus ur { $component } gant un exclude nann-digemm

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: n'eo ket skoret er c'hempouezer prefigure eus ar grafik; tremenet eo bet an diskennad.

prefigure-descendant-invalid-geometry = { $subject }: mentoniezh anvevennet pe diglok; tremenet eo bet an diskennad.

prefigure-curve-label-omitted = { $subject }: n'eo ket skoret an tikedennoù war elfennoù krommenn treuzfurmet; laosket eo bet an dikedenn er-maez.

prefigure-curve-unsupported-definition-type = { $subject }: seurt termenadur arc'hwel krommenn nann-skoret '{ $definitionType }'; tremenet eo bet an diskennad.

prefigure-region-flip-functions-unsupported = { $subject }: n'eo ket skoret an doareenn flipFunctions war regionBetweenCurves; tremenet eo bet an diskennad.

prefigure-region-non-formula-child = { $subject }: n'eus nemet arc'hwelioù bugel eus ar seurt formula a vez skoret war regionBetweenCurves; tremenet eo bet an diskennad.

prefigure-label-position-unsupported =
    { $subject }: labelPosition nann-skoret '{ $labelPosition }' evit { $labelKind ->
        [line-family] un dikedenn eus familh al linennoù
       *[point] un dikedenn poent
    }; implijet eo bet steudadur dre ziouer PreFigure.

prefigure-fill-style-unsupported = { $subject }: n'eo ket skoret ar stil leuniañ '{ $fillStyle }' gant PreFigure; o tistreiñ d'ul leuniadur unvan.

prefigure-line-style-unknown = { $subject }: laosket eo bet ar stil linenn dianav '{ $lineStyle }' er-maez eus ezankad PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: kaset eo bet stil ar merker '{ $markerStyle }' war-zu stil PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: n'eo ket skoret stil ar merker '{ $markerStyle }' gant PreFigure; implijet eo bet ar stil dre ziouer.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` direizh; n'haller ket diskoulmañ ar pal. Laosket eo bet an notenn er-maez.

annotation-ref-multiple-targets = `<annotation>`: diskoulmet eo bet `ref` ouzh meur a bal; oc'h implijout an hini kentañ.

annotation-ref-outside-graph = `<annotation>`: `ref` direizh; er-maez eus ar grafik en-dro emañ ar pal. Laosket eo bet an notenn er-maez.

annotation-ref-unsupported-target = `<annotation>`: `ref` direizh; n'eo ket ar pal un elfenn c'hrafek skoret en treuzfurmadur prefigure. Laosket eo bet an notenn er-maez.

annotation-text-missing = `<annotation>`: `text` a vank pe goullo; oc'h ezankañ un destenn c'houllo.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Dizoloet ez eus bet un dalc'h kelc'hiek.
       *[other] Dizoloet ez eus bet un dalc'h kelc'hiek gant ur parzh `<{ $componentType }>` ennañ.
    }

reference-no-referent = N'eus bet kavet daveenn ebet evit an dave: `{ $reference }`

reference-multiple-referents = Meur a zaveenn a zo bet kavet evit an dave: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Furmad direizh evit an doareenn { $attribute } eus `<{ $componentType }>`.

children-invalid = Bugale direizh evit `<{ $componentType }>`: Bugale direizh kavet: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Talvoud direizh `{ $value }` evit an doareenn `{ $attribute }`, oc'h implijout an talvoud `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] N'eus ket bet kavet ar stumm DoenetML { $version }.
       *[other] N'eus ket bet kavet ar stumm DoenetML { $version }. O tistreiñ d'ar stumm { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML direizh: { $content }

parse-tag-missing-close-tag = DoenetML direizh: N'en deus ket ar valizenn `{ $tag }` a valizenn serriñ. Gortozet e oa ur valizenn emserr pe ur valizenn `</{ $tagName }>`.

parse-tag-error = DoenetML direizh: Fazi er valizenn `<{ $tagName }>`

parse-attribute-missing-value = DoenetML direizh: War a seblant e vank un talvoud d'an doareenn direizh `{ $attribute }`.

parse-attribute-invalid = DoenetML direizh: Doareenn direizh `{ $attribute }`

parse-attribute-value-invalid = DoenetML direizh: Talvoud doareenn direizh `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML direizh: Talvoud doareenn direizh `{ $value }`. Ne glot ket ar merkoù-kroaz. War a seblant e vank `{ $quote }` deoc'h

parse-open-tag-name-missing = DoenetML direizh: Kavet ez eus bet ur valizenn hep anv, da sk. `<`

parse-tag-not-closed = DoenetML direizh: N'eo ket bet serret ar valizenn `{ $tag }` (war a seblant e vank ur `>`).

parse-self-closing-tag-name-missing = DoenetML direizh: Kavet ez eus bet ur valizenn hep anv `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML direizh: N'eo ket bet serret ar valizenn `{ $tag }` (war a seblant e vank ur `/>`).

parse-tag-invalid-attributes = DoenetML direizh: N'eo ket reizh ar valizenn `{ $tag }`. Marteze he deus doareennoù faziek.

parse-close-tag-name-missing = DoenetML direizh: Kavet ez eus bet ur valizenn serriñ hep anv, da sk. `</`

parse-attribute-value-unquoted = Ret eo lakaat talvoudoù an doareennoù etre merkoù-kroaz: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML direizh: Kavet ez eus bet ar valizenn serriñ `{ $tag }`, met n'eus balizenn zigeriñ ebet a glot ganti

parse-close-tag-mismatched = DoenetML direizh: Balizenn serriñ diglot. Gortozet e oa `</{ $expected }>`. Kavet ez eus bet `{ $found }`

parser-node-unconvertible = N'eus ket bet gallet treuzfurmiñ ar skoulm { $node } e skoulm Dast.

## Names

name-attribute-invalid =
    Anv doareenn direizh name='{ $name }'. { $reason ->
        [characters] N'hall an anvioù enderc'hel nemet lizherennoù, niveroù, islinennoù pe gedstrizhoù.
       *[start] Ret eo d'an anvioù kregiñ gant ul lizherenn.
    }

component-name-invalid-start = Anv parzh direizh "{ $name }". Ret eo d'an anvioù kregiñ gant ul lizherenn.

## `<answer>` sugar

answer-video-watched-missing-video = Ret eo d'ur respont eus ar seurt videoWatched kaout un doareenn video

answer-video-watched-video-not-reference = Ret eo da zoareenn video ur respont eus ar seurt videoWatched bezañ un dave

answer-name-not-single-text = Ret eo da zoareenn name ar respont kaout ur bugel testenn hepken

## Referencing another document

external-doenetml-recursion-limit = N'haller ket tapout DoenetML diavaez rak re a liveoù azgraat. Daoust ha bez' ez eus un dave kelc'hiek?

external-doenetml-unavailable = N'haller ket tapout DoenetML eus { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML direizh tapet eus { $attribute }="{ $uri }": ne glote ket gant ar seurt parzh "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Dispredet eo an doareenn `{ $from }`; implijit `{ $to }` en he flas.
       *[other] [deprecation] Dispredet eo an doareenn `{ $from }` war `<{ $component }>`; implijit `{ $to }` en he flas.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Dispredet eo an doareenn `{ $from }` ha ne vez ket kemeret e kont rak spisaet eo bet `{ $to }` ivez.
       *[other] [deprecation] Dispredet eo an doareenn `{ $from }` war `<{ $component }>` ha ne vez ket kemeret e kont rak spisaet eo bet `{ $to }` ivez.
    }

deprecated-attribute-ignored = [deprecation] Dispredet eo an doareenn `{ $attribute }` war `<{ $component }>` ha ne vez ket kemeret e kont.


## Language coverage

pluralize-english-only = N'hall `<pluralize>` lakaat el liester nemet ar saozneg, setu e vez laosket e destenn hep cheñch en un teul skrivet e { $locale }. Skrivit ar stumm liester war-eeun, pe lakait anezhañ gant an doareenn `pluralForm`.


## Checking against the schema

schema-element-unrecognized = N'eo ket an elfenn `<{ $tag }>` un elfenn Doenet anavezet.

schema-element-not-allowed-at-root = N'eo ket aotreet an elfenn `<{ $tag }>` e gwrizienn an teul.

schema-element-not-allowed-inside = N'eo ket aotreet an elfenn `<{ $tag }>` e-barzh `<{ $parent }>`.

schema-attribute-unrecognized = N'en deus ket an elfenn `<{ $tag }>` un doareenn anvet `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Ret eo d'an doareenn `{ $attribute }` eus an elfenn `<{ $tag }>` bezañ ur roll ma'z eo pep elfenn unan eus: { $allowed }
       *[other] Ret eo d'an doareenn `{ $attribute }` eus an elfenn `<{ $tag }>` bezañ unan eus: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Anv doare direizh evit select.  An anv doare { $variantName } a zeu war wel e { $numOptions } dibab met { $numToSelect } eo an niver da ziuzañ.

select-variant-name-without-options = Doareoù a zo bet spisaet evit select met n'eus bet spisaet dibab ebet evit an anv doare posupl: { $variantName }.

select-variant-name-not-possible = N'eo ket an anv doare { $variantName } spisaet evit select un anv doare posupl.

select-too-few-options = N'haller ket diuzañ { $numToSelect } parzh eus { $numOptions } hepken.

select-from-sequence-too-few-values = N'haller ket diuzañ { $numToSelect } talvoud eus ur steudad a hirder { $length }.

select-from-sequence-indices-count-mismatch = Ret eo da niver ar meneger spisaet evit select klotaat gant an niver da ziuzañ

select-from-sequence-indices-not-integers = Ret eo da bep meneger spisaet evit select bezañ un anterin

select-from-sequence-index-excluded = Spisaet eo bet ur meneger eus selectfromsequence a oa bet lakaet er-maez

select-from-sequence-indices-excluded-combination = Spisaet eo bet menegerioù eus selectfromsequence a oa ur c'hedaozadur lakaet er-maez

select-from-sequence-coprime-not-positive-integers = N'haller ket diuzañ kedaozadurioù kenprim rak n'eo ket anterinoù pozitivel a vez diuzet.

select-from-sequence-coprime-common-factor = N'haller ket diuzañ niveroù kenprim. Un ampartadur boutin o deus an holl dalvoudoù posupl. (Ret eo d'an talvoudoù spisaet eus "from" pe "to" bezañ kenprim gant "step".)

select-from-sequence-coprime-single-number = N'haller ket diuzañ kedaozadurioù kenprim eus un niver hepken ha n'eo ket 1.

select-from-sequence-excluded-too-many-combinations = Ouzhpenn 70% eus ar c'hedaozadurioù a zo bet lakaet er-maez e selectFromSequence

select-from-sequence-coprime-none-found = N'eus ket bet gallet diuzañ niveroù kenprim. Un ampartadur boutin o deus an holl dalvoudoù posupl.

select-from-sequence-too-few-unique-values = N'haller ket diuzañ { $numToSelect } talvoud dizhevelep eus ur steudad a hirder { $numPossibleValues }

select-prime-numbers-too-few-values = N'haller ket diuzañ { $numToSelect } talvoud eus ur roll niveroù kentañ a hirder { $numValues }

select-prime-numbers-values-count-mismatch = Ret eo da niver an talvoudoù spisaet evit select klotaat gant an niver da ziuzañ

select-prime-numbers-values-not-prime = Ret eo da bep talvoud spisaet evit select prime number bezañ er roll niveroù kentañ

select-prime-numbers-values-excluded-combination = Un c'hedaozadur lakaet er-maez e oa an talvoudoù spisaet evit selectPrimeNumbers

select-prime-numbers-excluded-too-many-combinations = Ouzhpenn 70% eus ar c'hedaozadurioù a zo bet lakaet er-maez e selectPrimeNumbers

select-random-combination-fluke = Dre un darvoud dic'hortoz-tre n'eus ket bet gallet diuzañ ur c'hedaozadur talvoudoù dargouezhek

select-random-value-fluke = Dre un darvoud dic'hortoz-tre n'eus ket bet gallet diuzañ un talvoud dargouezhek
