# Jamaican Creole (Patwa, «Jamiekan») diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber`, `prefigure`/`PreFigure`, `WCAG AA`,
# `[deprecation]` — are part of the language, not prose, and stay in English
# exactly as written. So does anything quoted back from the author's own
# source. The backticks, angle brackets and quote marks around them are
# punctuation the code depends on and are reproduced exactly.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The **Cassidy phonemic orthography** (Cassidy 1961, as
# regularized by the Jamaican Language Unit at UWI Mona) is what is written in
# these four files. It is not English-based spelling. Most everyday written
# Jamaican — song lyrics, social media, advertising, published dialogue — uses
# English spelling conventions instead, so this catalog does not look like
# what a Jamaican reader usually sees written. A reviewer who chooses the
# English-based system would **respell** the entire catalog rather than
# retranslate it: the wording would stand and only the letters would move,
# which is why the choice has to be made once and applied to all four files
# together. `chrome.ftl` sets the system out in full — five vowels
# `i e a o u` with the long vowels doubled («tii», «taak», «tuu»), the three
# diphthongs `ie ai ou` («niem», «brait», «tou»), palatal `ky` and `gy`
# («kyaan», «gyal»), `h` written only where it is pronounced, and no
# apostrophes standing in for "missing" English letters. No diacritics are
# used.
#
# **Number.** `Intl.PluralRules` has no CLDR data of its own for `jam`; the
# probe resolves it to `en-US` and reports `['one', 'other']`. A Jamaican
# Creole noun after a numeral is unmarked — «tuu buk» — and plurality is
# marked by the postposed particle «dem», which a count does not trigger. The
# two branches would be word-for-word identical here, so every count-driven
# select in the English is written as **one unselected form**. The one place a
# select on a number is kept is `field-function-wrong-num-outputs`, where the
# `$expected` branches say two different things about the function rather than
# the same thing twice.
#
# Selects that are not plural selects — `$reason`, `$mode`, `$type`,
# `$component`, `$componentType`, `$suggestion`, `$context`, `$fallback`,
# `$isList`, `$labelKind`, `$expected`, `$subject` — are kept, and every
# branch of them is translated.
#
# **Grammar around the loans.** The technical nouns are English, in Cassidy
# spelling: «kompuonent», «atribyut», «elimant», «vieryabl», «fongkshan»,
# «siikwens», «matriks», «indeks», «refrans», «anatieshan», «kanchraas».
# The sentences around them are Jamaican: «kyaan» for *cannot*, «no av» for
# *does not have*, «mos» for *must*, «wi» for the future, «no»/«naa» for
# negation, «fi» for purpose and possession, «a» for the equative copula and
# the progressive, «de» for location, «se» for the complementizer. Two words
# a reviewer should look at first: **«dipriket»** for *deprecated*, which is a
# bare loan and has no currency outside software, and **«kanchraas»** for
# *contrast*, which is regular Cassidy but is not a word most readers will
# have seen written.
#
# What that amounts to is **an English loan set carried in Jamaican Creole's
# own grammar and written in Cassidy spelling**. The loans are the words the
# language actually uses for these things; the sentences around them are
# Jamaican, not English. A Cassidy-spelled English loan is correct here. An
# English sentence anywhere in these four files is a defect.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } get ignaar wen tuu endpoint spesifai

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } get ignaar wen wan endpoint an wan midpoint bot spesifai

line-segment-midpoint-offset-without-midpoint = midpointOffset no du notn if no midpoint no de-de

## `<line>`

line-points-undetermined-dimensions = Lain chruu pwaint we wi kyaan wok out di dimenshan fa.

line-points-too-few-dimensions = Lain mos go chruu pwaint we av at liis tuu dimenshan.

line-points-depend-on-variables = Lain a go chruu pwaint we dipen pan vieryabl: { $variables }.

line-equation-invalid-format = Di faamat fi di ikwieshan a di lain no valid iina vieryabl { $variable1 } an { $variable2 }.

## `<ray>`

ray-overprescribed-through = Di rie spesifai wid through, endpoint an direction bot.  Wi a ignaar di through we gi.

ray-dimension-mismatch = Di numDimensions no machop iina di rie.

## `<vector>`

vector-overprescribed-head = Di vekta spesifai wid head, tail an displacement aal chrii.  Wi a ignaar di head we gi.

vector-dimension-mismatch = Di numDimensions no machop iina di vekta.

## Attracting and constraining

attract-to-without-nearest-point = Kyaan achraak tu wan `<{ $component }>` kaaz it no av no nearestPoint stiet vieryabl.

constrain-to-without-nearest-point = Kyaan kanchriein tu wan `<{ $component }>` kaaz it no av no nearestPoint stiet vieryabl.

constrain-to-interior-without-nearest-point = Kyaan kanchriein tu di iinsaid a wan `<{ $component }>` kaaz it no av no nearestPoint stiet vieryabl.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition get ignaar pan wan choiceInput we no inline

## Ordering children by index

choice-input-indices-count-mismatch = Wi a ignaar di indeks dem we spesifai fi choiceInput kaaz di nomba a indeks no machop wid di nomba a choice chail.

pretzel-indices-count-mismatch = Wi a ignaar di indeks dem we spesifai fi di prablem kaaz di nomba a indeks no machop wid di nomba a prablem chail.

shuffle-indices-count-mismatch = Wi a ignaar di indeks dem we spesifai fi shuffle kaaz di nomba a indeks no machop wid di nomba a kompuonent.

indices-ignored-out-of-range = Wi a ignaar di indeks dem we spesifai fi { $component } kaaz som a dem outa rienj.

pretzel-indices-repeated = Wi a ignaar di indeks dem we spesifai fi pretzel kaaz som a dem ripiit.

pretzel-circuit-first-index = Wi a ignaar di indeks dem we spesifai fi pretzel iina circuit muod kaaz di fos indeks mos bi 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Fi mek `<{ $component }>` wok wid string chail, wan `type` atribyut mos spesifai.

invalid-type-defaulting-to-math = Di type { $type } no valid fi di { $component } kompuonent. It mos bi math, text, number ar boolean. Wi a difaalt tu math.

string-not-valid-component-to-arrange = Di string "{ $value }" no wan valid kompuonent fi { $component }. Wi a ignaar it.

## Types and variables

invalid-type-defaulting-to-number = Di type { $type } no valid, so wi a set di type tu number.

invalid-variable-value = Di valyu a di vieryabl no valid: `{ $value }`

## Variants

variant-index-must-be-number = Di vieryant indeks { $index } mos bi wan nomba

variant-index-must-be-integer = Di vieryant indeks { $index } mos bi wan intija

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` no impliment fi absaluut mezhament. Wi a set di widt dem tu relativ.

side-by-side-absolute-margins = `<{ $component }>` no impliment fi absaluut mezhament. Wi a set di maajin dem tu relativ.

side-by-side-no-block-child = `<{ $component }>` no valid: it mos av at liis wan blak chail.

## `<label>`

label-for-ignored-on-graphical = Di `for` atribyut pan wan graafikal `<label>` get ignaar.

label-for-must-resolve-to-one = Di `for` atribyut pan `<label>` mos point tu wan wan kompuonent.

label-for-unresolved = Wi kyaan wok out wich kompuonent di `for` atribyut pan `<label>` a point tu.

label-for-answer-with-authored-inputs = Di `for` atribyut pan `<label>` a point tu wan `<answer>` we di aata rait di input fa demself; point tu di input diirek.

label-for-answer-without-input = Di `for` atribyut pan `<label>` a point tu wan `<answer>` we no av no input fi liebl.

label-for-must-reference-input-or-answer = Di `for` atribyut pan `<label>` mos point tu wan input ar wan answer.

## Accessibility

accessibility-short-description-or-decorative = Fi aksesibiliti, `<{ $component }>` mos av wan shaat dekripshan ar it mos spesifai az decorative.

accessibility-video-short-description = Fi aksesibiliti, `<video>` mos av wan shaat dekripshan.

accessibility-input-short-description-or-label = Fi aksesibiliti, `<{ $component }>` mos av wan shaat dekripshan ar wan liebl.

accessibility-answer-input-short-description-or-label = Fi aksesibiliti, wan `<answer>` we a mek wan input mos av wan shaat dekripshan ar wan liebl.

accessibility-short-description-contains-math = Shaat dekripshan no fi av mat kompuonent iina dem, laik `<{ $component }>`. Spel out di mat wid wod.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } no av inof kanchraas fi di sekshan edin tex (daak muod) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; it niid at liis { $threshold }:1).
       *[other] { $colorName } no av inof kanchraas fi di sekshan edin tex ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; it niid at liis { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Wi no impliment `<circle>` chruu { $count } pwaint yet fi wen di pwaint dem no av no nomba valyu.

circle-too-many-through-points = Kyaan wok out wan sorkl chruu muo dan 3 pwaint.

circle-overprescribed-radius-center-points = Kyaan wok out wan sorkl wen di radius, di senta an di chruu-pwaint dem aal spesifai.

circle-center-with-multiple-points = Kyaan wok out wan sorkl wid wan spesifai senta we go chruu muo dan 1 pwaint.

circle-radius-too-small = Kyaan wok out di sorkl: siin se di distans bitwiin di tuu pwaint a { $distance }, di radius { $radius } we spesifai tuu likl.

circle-radius-with-many-points = Kyaan mek wan sorkl chruu muo dan tuu pwaint wid wan spesifai radius.

circle-invalid-center-or-through-points = Di senta ar di chruu-pwaint dem a di sorkl no valid.

circle-radius-center-with-multiple-points = Kyaan wok out di radius a wan sorkl wid wan spesifai senta we go chruu muo dan 1 pwaint.

circle-radius-with-points-non-numerical = Kyaan mek wan sorkl chruu muo dan wan pwaint wid wan spesifai radius wen di pwaint dem no av no nomba valyu.

circle-change-radius-non-numerical = Kyaan chienj di radius a wan sorkl we go chruu pwaint we no av no nomba valyu

circle-change-center-non-numerical = Wi no impliment chienjin di senta a wan sorkl we go chruu pwaint we no av no nomba valyu.

## `<function>`

function-domain-insufficient-dimensions = Di duumien fi di fongkshan no av inof dimenshan. Di duumien av { $intervals } intovol bot di fongkshan av { $inputs } input.

function-domain-invalid-format = Di faamat fi di duumien a di fongkshan no valid.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Wi a ignaar di maksimom a di fongkshan kaaz it no a nomba.
        [minimum] Wi a ignaar di minimom a di fongkshan kaaz it no a nomba.
        [extremum] Wi a ignaar di ekschiimom a di fongkshan kaaz it no a nomba.
        [point] Wi a ignaar di pwaint a di fongkshan kaaz it no a nomba.
        [slope] Wi a ignaar di sluop a di fongkshan kaaz it no a nomba.
       *[other] Wi a ignaar di { $type } a di fongkshan kaaz it no a nomba.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Wi a ignaar di maksimom a di fongkshan kaaz it emti.
        [minimum] Wi a ignaar di minimom a di fongkshan kaaz it emti.
        [extremum] Wi a ignaar di ekschiimom a di fongkshan kaaz it emti.
        [point] Wi a ignaar di pwaint a di fongkshan kaaz it emti.
       *[other] Wi a ignaar di { $type } a di fongkshan kaaz it emti.
    }

function-points-too-close = Di fongkshan av tuu pwaint we tuu niez tugeda. Wi kyaan difain di fongkshan.

function-iterates-input-output-mismatch = Fongkshan itaret ongl wok if di nomba a input di siem az di nomba a outpit. Dis fongkshan av { $inputs } input an { $outputs } outpit.

## `<sequence>`

sequence-invalid-length = Di lent a di siikwens no valid.  It mos bi wan intija we no negativ.

sequence-invalid-step = Di step a di siikwens no valid.  It mos bi wan nomba fi wan siikwens a di { $type } taip.

sequence-invalid-endpoint-number = Di "{ $attribute }" a di nomba siikwens no valid.  It mos bi wan nomba.

sequence-invalid-endpoint-letters = Di "{ $attribute }" a di leta siikwens no valid.  It mos bi wan kombinieshan a leta.

sequence-invalid-endpoint = Di "{ $attribute }" a di siikwens no valid.

select-from-sequence-coprime-not-numbers = coprime get ignaar kaaz wi no a pik nomba

select-from-sequence-coprime-with-exclude-combinations = coprime get ignaar kaaz excludeCombinations spesifai

## Resolving a `target`

target-not-found = Di target fi `<{ $source }>` no valid: wi kyaan fain di taagit.

target-state-variable-not-found = Di target fi `<{ $source }>` no valid: wi kyaan fain no stiet vieryabl niem "{ $property }" pan wan `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Di vieryabl dem a `<odeSystem>` mos difarant fram di indipendent vieryabl.

ode-system-duplicate-variable-names = Wi kyaan difain ODE RHS fongkshan wid di siem dipendent vieryabl niem tuu taim.

ode-system-rhs-function-error = Kyaan difain di ODE RHS fongkshan.  Wan era gwaan wen wi did a mek di mathjs fongkshan.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Kyaan difain wan angl bitwiin { $count } lain

angle-invalid-through-point = Wan pwaint iina di through a `<angle>` no valid

parabola-vertex-too-many-points = Wi no impliment wan parabola wid wan vortiks we go chruu muo dan 1 pwaint yet.

parabola-too-many-points = Wi no impliment wan parabola chruu muo dan 3 pwaint yet.

intersection-too-many-items = Wi no impliment intasekshan fi muo dan tuu tin yet

## Other math components

ionic-compound-not-two-ions = Wi no impliment aianik kompong fi notn ada dan tuu aian yet.

ionic-compound-needs-cation-and-anion = Aianik kompong ongl impliment fi wan kataian an wan anaian.

solve-equations-cannot-evaluate = Kyaan salv di ikwieshan kaaz wi kyaan wok out di ikwieshan: { $equation }

math-operators-operand-number-required = Yu mos spesifai wan operandNumber wen yu a tek out wan mat aparan.

eigen-decomposition-failed = Wi kyaan wok out di aiganvalyu dem a di matriks

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: di parameter { $parameters } no de iina di patan, so it wi aalwiez mach wan blangk.

## `<graph>`

graph-grid-invalid = `<graph>`: wi kyaan riid grid="{ $grid }". It mos bi none, medium, dense, ar tuu pazitiv nomba wid wan spies bitwiin dem, laik grid="1 0.5". No grid naa jraa.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` niid wan fongkshan wid { $expected ->
        [one] wan outpit, di sluop y' a ich pwaint, laik `y - x`
       *[other] tuu outpit, di vekta a ich pwaint, laik `(y, -x)`
    }, bot di fongkshan we it get av { $found } outpit. { $alternative ->
        [none] Notn naa jraa.
       *[other] A `<{ $alternative }>` a di kompuonent fi dat fongkshan. Notn naa jraa.
    }

field-function-attribute-ignored-with-child = Di `function` atribyut get ignaar kaaz di fongkshan gi iinsaid di kompuonent tu; a di wan iinsaid wi a yuuz. Gi di fongkshan wan wie ongl.

field-variables-ignored =
    `<{ $component }>`: di `variables` atribyut niem di vieryabl dem a wan espreshan we rait diirek iinsaid di kompuonent. { $reason ->
        [function-child] Di fongkshan ya gi az wan `<function>` chail, we niem im uona vieryabl, so `variables` get ignaar.
       *[no-expression] No sich espreshan no gi ya so, so `variables` get ignaar.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" no sopaat iina di prefigure renda; wi a yuuz di right-position bihievya.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" no sopaat iina di prefigure renda; wi a yuuz di top-position bihievya.

prefigure-invalid-axis-bounds = `<graph>`: di aksis bound dem no valid fi di prefigure konvorshan; wi a yuuz di difaalt bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: di widt no valid fi di prefigure konvorshan; wi a yuuz di difaalt daiagram widt 425.

prefigure-invalid-aspect-ratio = `<graph>`: di aspectRatio no valid fi di prefigure konvorshan; wi a yuuz di difaalt aspek rieshyo 1.

prefigure-grid-spacing-too-fine = `<graph>`: di spies bitwiin di grid lain dem tuu fain fi di aksis limit; di grid lef out a di prefigure renda.

prefigure-annotations-not-rendered = `<graph>`: anatieshan naa renda wen yu no a yuuz di PreFigure renda.

multiple-annotations-children = Wi fain muo dan wan `<annotations>` chail iina `<graph>`; aal a dem bot di laas wan get ignaar.

## Referring to other components

copy-unrecognized-component-type = Kyaan ekstend ar kapi wan kompuonent taip wi no nuo: { $type }.

copy-prop-not-found = Wi kyaan fain di prop { $property } pan wan kompuonent a taip { $component }

collect-no-source = Wi kyaan fain no suos fi collect.

collect-invalid-component-type = Kyaan kalek kompuonent a taip `<{ $component }>` kaaz dat no wan valid kompuonent taip.

reference-index-unavailable = Kyaan refrans di indeks `{ $reference }`

## `<callAction>`

component-action-unavailable = Kyaan kaal { $action } pan di kompuonent `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Di dieta shiep no valid.  Di ruo dem no av di siem lent. Fain iina componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Di dieta av di siem kolom niem muo dan wans.  Fain iina componentIdx :{ $componentIdx }

data-frame-missing-column-name = Wan kolom niem mis outa di dieta.  Fain iina componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Wan award fi dis ansa bies pan di answer tag uon ansa we sen, an dat wi mek it bihiev iina wie yu no ekspek.

answer-max-num-attempts-in-section-wide-check-work = Wen yu set `maxNumAttempts` pan wan `<answer>` we iina wan kanteina wid `sectionWideCheckWork`, it no du notn, kaaz a di kanteina kanchruol di nomba a chans. Set `maxNumAttempts` pan di kanteina instid.

nested-section-wide-check-work-max-num-attempts = Wen yu set `maxNumAttempts` pan wan kanteina wid `sectionWideCheckWork` we iina wan neda kanteina wid `sectionWideCheckWork`, it no du notn, kaaz a di outa kanteina kanchruol di nomba a chans. Set `maxNumAttempts` pan di outa kanteina instid.

answer-attributes-need-symbolic-equality = Di { $attributes } atribyut naa du notn if symbolicEquality no set.

answer-invalid-type = Di taip fi di ansa no valid: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Kaaz di kompuonent `<{ $component }>` no av no niem, it kyaan yuuz fi wan module atribyut

module-attribute-name-already-defined = Di kompuonent `<{ $component } name="{ $name }">` kyaan yuuz az wan atribyut fi wan module kaaz di `<module>` kompuonent taip aredi av wan "{ $name }" atribyut difain.

conditional-content-condition-ignored = Di `condition` atribyut get ignaar pan wan `<conditionalContent>` kompuonent we av case ar else chail.

slider-markers-type-mismatch = Di maaka taip no machop wid di slaida taip.

pretzel-problem-needs-statement-and-answer = Di pretzel no valid: ich `<problem>` mos av wan `<statement>` an wan `<answer>`.

pretzel-circuit-first-problem-distractor = Di pretzel no valid: iina mode="circuit", di fos `<problem>` kyaan bi wan dischrakta.

## Attribute values

attribute-invalid-values = Di valyu { $values } no valid fi di atribyut `{ $attribute }`; wi a ignaar it.

attribute-must-be-references = Di valyu `{ $value }` no valid fi di atribyut `{ $attribute }`. Di atribyut mos mek op a refrans we staat wid wan `$`.

math-input-invalid-function-names = <mathInput>: wi ignaar di fongkshan niem dem we no valid iina { $attribute }: { $names }. Ich niem displie paat mos av at liis 2 karakta (leta ar dash); wan `|<mathspeak alternative>` sofiks kyan kom aafta it if yu waahn.

## Building components from the source

component-type-invalid = Di kompuonent taip no valid: `<{ $componentType }>`

attribute-repeated = Yu kyaan ripiit di atribyut { $attribute }.

attribute-invalid-for-component = Di atribyut "{ $attribute }" no valid fi wan kompuonent a taip `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Stail definishan { $styleNumber } no av inof kanchraas fi { $context ->
        [text-on-background] di tex kola agens di bakgrong kola
        [high-contrast] di ai-kanchraas kola agens di kanvas
        [line] di lain kola agens di kanvas
        [marker] di maaka kola agens di kanvas
       *[text-on-canvas] di tex kola agens di kanvas
    }{ $mode ->
        [dark] { " (daak muod)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; it niid at liis { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Iivn dou stail definishan { $styleNumber } spesifai kola we av inof kanchraas fi lait muod, di daak-muod kola we kom outa dem valyu no av inof kanchraas fi di tex kola agens di bakgrong kola ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; it niid at liis { $threshold }:1). { $suggestion ->
        [available] Fi mek shuor se yu av inof kanchraas iina daak muod, ada yu mek di lait-muod kanchraas biga (fi egzampl, set { $lightAttribute }="{ $lightColor }") ar yu uovaraid di daak-muod kola (fi egzampl, set { $darkAttribute }="{ $darkColor }").
       *[none] Fi mek shuor se yu av inof kanchraas iina daak muod, mek di lait-muod kanchraas biga ar uovaraid di kola dem wid textColorDarkMode an/ar backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Iivn dou stail definishan { $styleNumber } spesifai wan tex kola we av inof kanchraas fi lait muod, di daak-muod tex kola we kom outa dat valyu no av inof kanchraas agens di kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; it niid at liis { $threshold }:1). { $suggestion ->
        [available] Fi mek shuor se yu av inof kanchraas iina daak muod, ada yu mek di lait-muod kanchraas biga (fi egzampl, set textColor="{ $lightColor }") ar yu uovaraid di daak-muod kola (fi egzampl, set textColorDarkMode="{ $darkColor }").
       *[none] Fi mek shuor se yu av inof kanchraas iina daak muod, mek di lait-muod kanchraas biga ar uovaraid di kola we kom outa it wid textColorDarkMode.
    }

section-multiple-style-palettes = Wan sekshan kyan pik wan wan <stylePalette>; wi a yuuz di laas wan.

## Unique variants

variant-num-to-select-not-non-negative-integer = wi kyaan wok out di yuuniik vieryant dem a { $component } kaaz numToSelect no wan intija we no negativ.

variant-num-to-select-not-constant-number = wi kyaan wok out di yuuniik vieryant dem a { $component } kaaz numToSelect no wan kanstant nomba.

variant-with-replacement-not-constant-boolean = wi kyaan wok out di yuuniik vieryant dem a { $component } kaaz withReplacement no wan kanstant boolean.

variant-select-weight-disables-unique = Yuuniik vieryant fi select torn aaf if wan a di opshan av selectWeight ar selectForVariants spesifai

variant-coprime-undetermined = wi kyaan wok out di yuuniik vieryant dem a { $component } kaaz wi kyaan wok out se coprime aalwiez false.

variant-attribute-not-constant = wi kyaan wok out di yuuniik vieryant dem a { $component } kaaz { $attribute } no kanstant.

variant-attribute-not-number = wi kyaan wok out di yuuniik vieryant dem a { $component } kaaz { $attribute } no wan nomba.

variant-attribute-wrong-type-for-sequence =
    wi kyaan wok out di yuuniik vieryant dem a { $component } a di { $type } taip kaaz { $attribute } no { $expected ->
        [letters-combination] wan kombinieshan a leta
        [math-expression] wan valid mat espreshan
        [integer] wan intija
       *[number] wan nomba
    }.

variant-length-not-integer = wi kyaan wok out di yuuniik vieryant dem a { $component } kaaz length no wan intija.

variant-sort-not-implemented = wi no impliment yuuniik vieryant fi wan { $component } wid sort yet

variant-exclude-combinations-not-implemented = wi no impliment yuuniik vieryant fi wan { $component } wid excludeCombinations yet

variant-math-exclude-not-implemented = wi no impliment yuuniik vieryant fi wan { $component } a taip math wid exclude yet

variant-non-constant-exclude-not-implemented = wi no impliment yuuniik vieryant fi wan { $component } wid wan exclude we no kanstant yet

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: no sopaat iina di graph prefigure renda; wi skip di disendant.

prefigure-descendant-invalid-geometry = { $subject }: di jiaametri no finait ar it no komplit; wi skip di disendant.

prefigure-curve-label-omitted = { $subject }: liebl no sopaat pan kov elimant we konvot; wi lef out di liebl.

prefigure-curve-unsupported-definition-type = { $subject }: di kov fongkshan definishan taip '{ $definitionType }' no sopaat; wi skip di disendant.

prefigure-region-flip-functions-unsupported = { $subject }: di flipFunctions atribyut no sopaat pan regionBetweenCurves; wi skip di disendant.

prefigure-region-non-formula-child = { $subject }: a ongl chail fongkshan a di formula taip sopaat pan regionBetweenCurves; wi skip di disendant.

prefigure-label-position-unsupported =
    { $subject }: di labelPosition '{ $labelPosition }' no sopaat fi wan { $labelKind ->
        [line-family] liebl a di lain famili
       *[point] pwaint liebl
    }; wi a yuuz di difaalt PreFigure alainment.

prefigure-fill-style-unsupported = { $subject }: PreFigure no sopaat di fil stail '{ $fillStyle }'; wi a jrap bak tu wan salid fil.

prefigure-line-style-unknown = { $subject }: wi no nuo di lain stail '{ $lineStyle }', so it lef out a di PreFigure outpit.

prefigure-marker-style-mapped-to-diamond = { $subject }: wi map di maaka stail '{ $markerStyle }' tu di PreFigure stail 'diamond'.

prefigure-marker-style-unsupported = { $subject }: PreFigure no sopaat di maaka stail '{ $markerStyle }'; wi a yuuz di difaalt stail.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: di `ref` no valid; wi kyaan fain di taagit. Wi lef out di anatieshan.

annotation-ref-multiple-targets = `<annotation>`: di `ref` point tu muo dan wan taagit; wi a yuuz di fos wan.

annotation-ref-outside-graph = `<annotation>`: di `ref` no valid; di taagit de outsaid a di graph we uol it. Wi lef out di anatieshan.

annotation-ref-unsupported-target = `<annotation>`: di `ref` no valid; di taagit no wan graafikal abjek we di prefigure konvorshan sopaat. Wi lef out di anatieshan.

annotation-text-missing = `<annotation>`: di `text` mis ar it emti; wi a put out emti tex.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Wi fain wan sorkila dipendensi.
       *[other] Wi fain wan sorkila dipendensi we av di `<{ $componentType }>` kompuonent iina it.
    }

reference-no-referent = Wi kyaan fain notn fi di refrans: `{ $reference }`

reference-multiple-referents = Wi fain muo dan wan tin fi di refrans: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Di faamat fi di atribyut { $attribute } a `<{ $componentType }>` no valid.

children-invalid = Di chail dem fi `<{ $componentType }>` no valid: wi fain dem ya chail we no valid: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Di valyu `{ $value }` no valid fi di atribyut `{ $attribute }`, so wi a yuuz di valyu `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Wi kyaan fain DoenetML vorshan { $version }.
       *[other] Wi kyaan fain DoenetML vorshan { $version }. Wi a jrap bak tu vorshan { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML we no valid: { $content }

parse-tag-missing-close-tag = DoenetML we no valid: Di tag `{ $tag }` no av no kluozin tag. Wi did ekspek wan self-kluozin tag ar wan `</{ $tagName }>` tag.

parse-tag-error = DoenetML we no valid: Wan era iina di tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML we no valid: Di atribyut `{ $attribute }` no valid — luk laik it mis wan valyu.

parse-attribute-invalid = DoenetML we no valid: Di atribyut `{ $attribute }` no valid

parse-attribute-value-invalid = DoenetML we no valid: Di atribyut valyu `{ $value }` no valid

parse-attribute-value-quote-mismatch = DoenetML we no valid: Di atribyut valyu `{ $value }` no valid. Di kwuot maak dem no machop. Luk laik yu mis wan `{ $quote }`

parse-open-tag-name-missing = DoenetML we no valid: Wi fain wan tag widout no tag niem, laik `<`

parse-tag-not-closed = DoenetML we no valid: Di tag `{ $tag }` neva kluoz (luk laik wan `>` mis).

parse-self-closing-tag-name-missing = DoenetML we no valid: Wi fain wan tag widout no tag niem `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML we no valid: Di tag `{ $tag }` neva kluoz (luk laik `/>` mis).

parse-tag-invalid-attributes = DoenetML we no valid: Di tag `{ $tag }` no valid. It kyan bi se di atribyut dem rang.

parse-close-tag-name-missing = DoenetML we no valid: Wi fain wan kluozin tag widout no tag niem, laik `</`

parse-attribute-value-unquoted = Atribyut valyu mos av kwuot maak roun dem: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML we no valid: Wi fain di kluozin tag `{ $tag }`, bot no uopnin tag no de-de fi it

parse-close-tag-mismatched = DoenetML we no valid: Di kluozin tag no machop. Wi did ekspek `</{ $expected }>`. Wi fain `{ $found }`

parser-node-unconvertible = Wi kyaan konvot di nuod { $node } tu wan Dast nuod.

## Names

name-attribute-invalid =
    Di atribyut name='{ $name }' no valid. { $reason ->
        [characters] Niem kyan av leta, nomba, onderskuor ar haifn ongl.
       *[start] Niem mos staat wid wan leta.
    }

component-name-invalid-start = Di kompuonent niem "{ $name }" no valid. Niem mos staat wid wan leta.

## `<answer>` sugar

answer-video-watched-missing-video = Wan answer a taip videoWatched mos av wan video atribyut

answer-video-watched-video-not-reference = Wan answer a taip videoWatched mos av wan video atribyut we a wan refrans

answer-name-not-single-text = Di answer name atribyut mos av wan wan text chail

## Referencing another document

external-doenetml-recursion-limit = Wi kyaan get di ekstonal DoenetML kaaz tuu moch liivl a rikorshan. Yu tink se wan sorkila refrans de-de?

external-doenetml-unavailable = Wi kyaan get di DoenetML fram { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Di DoenetML we wi get fram { $attribute }="{ $uri }" no valid: it no machop wid di kompuonent taip "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Di atribyut `{ $from }` dipriket; yuuz `{ $to }` instid.
       *[other] [deprecation] Di atribyut `{ $from }` pan `<{ $component }>` dipriket; yuuz `{ $to }` instid.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Di atribyut `{ $from }` dipriket an it get ignaar kaaz `{ $to }` spesifai tu.
       *[other] [deprecation] Di atribyut `{ $from }` pan `<{ $component }>` dipriket an it get ignaar kaaz `{ $to }` spesifai tu.
    }

deprecated-attribute-ignored = [deprecation] Di atribyut `{ $attribute }` pan `<{ $component }>` dipriket an it get ignaar.

deprecated-attribute-to-child = [deprecation] Di atribyut `{ $attribute }` pan `<{ $component }>` dipriket; yuuz wan `<{ $child }>` chail instid.

deprecated-attribute-value-renamed = [deprecation] Di valyu `{ $value }` a di atribyut `{ $attribute }` pan `<{ $component }>` dipriket; yuuz `{ $to }` instid.


## Language coverage

pluralize-english-only = `<pluralize>` kyan ongl mek Ingglish wod pluural, so di tex lef jos az di aata taip it iina wan dokyument we rait iina { $locale }. Rait di pluural faam yuself, ar set it wid di `pluralForm` atribyut.


## Checking against the schema

schema-element-unrecognized = Di elimant `<{ $tag }>` no wan Doenet elimant wi nuo.

schema-element-not-allowed-at-root = Di elimant `<{ $tag }>` no alou a di ruut a di dokyument.

schema-element-not-allowed-inside = Di elimant `<{ $tag }>` no alou iinsaid `<{ $parent }>`.

schema-attribute-unrecognized = Di elimant `<{ $tag }>` no av no atribyut niem `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Di atribyut `{ $attribute }` a di elimant `<{ $tag }>` mos bi wan lis we ich aitem a wan a dem ya: { $allowed }
       *[other] Di atribyut `{ $attribute }` a di elimant `<{ $tag }>` mos bi wan a dem ya: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Di vieryant niem fi select no valid.  Di vieryant niem { $variantName } de iina { $numOptions } opshan bot di nomba fi pik a { $numToSelect }.

select-variant-name-without-options = Som vieryant spesifai fi select bot no opshan no spesifai fi di vieryant niem we kyan de-de: { $variantName }.

select-variant-name-not-possible = Di vieryant niem { $variantName } we spesifai fi select no wan vieryant niem we kyan de-de.

select-too-few-options = Kyaan pik { $numToSelect } kompuonent outa ongl { $numOptions }.

select-from-sequence-too-few-values = Kyaan pik { $numToSelect } valyu outa wan siikwens we lent a { $length }.

select-from-sequence-indices-count-mismatch = Di nomba a indeks we spesifai fi select mos machop wid di nomba fi pik

select-from-sequence-indices-not-integers = Aal a di indeks we spesifai fi select mos bi intija

select-from-sequence-index-excluded = Di indeks we spesifai fi selectfromsequence did ekskluud

select-from-sequence-indices-excluded-combination = Di indeks dem we spesifai fi selectfromsequence did wan kombinieshan we ekskluud

select-from-sequence-coprime-not-positive-integers = Kyaan pik kuopraim kombinieshan kaaz wi no a pik pazitiv intija.

select-from-sequence-coprime-common-factor = Kyaan pik kuopraim nomba. Aal a di valyu dem shier wan kaman fakta. (Di valyu we spesifai fi "from" ar "to" mos bi kuopraim wid "step".)

select-from-sequence-coprime-single-number = Kyaan pik kuopraim kombinieshan outa wan wan nomba we no a 1.

select-from-sequence-excluded-too-many-combinations = Muo dan 70% a di kombinieshan dem ekskluud iina selectFromSequence

select-from-sequence-coprime-none-found = Wi kyaan pik kuopraim nomba. Aal a di valyu dem shier wan kaman fakta.

select-from-sequence-too-few-unique-values = Kyaan pik { $numToSelect } yuuniik valyu outa wan siikwens we lent a { $numPossibleValues }

select-prime-numbers-too-few-values = Kyaan pik { $numToSelect } valyu outa wan lis a praim nomba we lent a { $numValues }

select-prime-numbers-values-count-mismatch = Di nomba a valyu we spesifai fi select mos machop wid di nomba fi pik

select-prime-numbers-values-not-prime = Aal a di valyu we spesifai fi select praim nomba mos de iina di lis a praim

select-prime-numbers-values-excluded-combination = Di valyu dem we spesifai fi selectPrimeNumbers did wan kombinieshan we ekskluud

select-prime-numbers-excluded-too-many-combinations = Muo dan 70% a di kombinieshan dem ekskluud iina selectPrimeNumbers

select-random-combination-fluke = Bai wan flook we kyaan aadli apm, wi kyaan pik wan kombinieshan a randam valyu

select-random-value-fluke = Bai wan flook we kyaan aadli apm, wi kyaan pik wan randam valyu

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` naa jraa iinsaid di mat; di espreshan sethop jos laik ou it did bi bifuo input kuda go iinsaid. { $reason ->
        [not-inline] A ongl wan `inline` choice input fit iinsaid wan espreshan; widout `inline` it a wan blak a bokn.
        [expanded] Wan `expanded` text input a wan baks wid muo dan wan lain, an dat tuu big fi sidong iinsaid wan espreshan.
        [on-graph] Pan wan graph, di espreshan jraa az wan wan pikcha, we no av no ruum fi wan kanchruol.
       *[relative-width] Im `width` a relativ (wan porsentij ar `em`), an dat no av notn fi mezha agens iinsaid wan espreshan. Gi di widt iina absaluut yuunit, laik `px`, instid.
    }
