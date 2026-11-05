# Niuean (ko e vagahau Niue) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `prefigure`, `WCAG AA` — are part of the language, not
# prose, and stay in English exactly as written. So does anything quoted back
# from the author's own source.
#
# Orthography, the absence of the glottal stop, and the departures from
# `locales/to` are set out in `chrome.ftl`'s header; `content.ftl`'s tables are
# canonical for the vocabulary.
#
# **Number.** Niuean marks plural with a preposed «tau» and never marks a noun
# after a numeral, so a counted message whose only English difference is the
# noun's number renders one string here and the select is dropped. Where the
# count sits inside a longer clause the count itself is still printed, so
# nothing is lost.
#
# **One word for two English ones, said plainly.** «vala» renders both
# *component* and *element*: the two are one thing to a Niuean reader and
# splitting them would have meant coining a word for the difference. «hehē» is
# both *error* and *wrong*. Neither is a gap this seed could close honestly.
#
# **Known residues**, for a speaker to settle:
#   «leitiu»      radius — a transliteration standing in for a word the seed
#                 could not establish. Replace it if Niuean school mathematics
#                 has its own term.
#   «fetogi»      variable, from «fetogi» to exchange. A coinage by a
#                 productive rule, not an attested mathematical term.
#   «huki»/«fua»  a function's input and output. Everyday words pressed into
#                 technical use; confirm or replace both together.
#   «kalafi», «palapola», «polikone», «matiliki», «aioni», «tioleme» are
#                 transliterations, which is what Niuean writing does with
#                 school terminology, since secondary mathematics on Niue is
#                 taught in English.


## `<lineSegment>`

# No select: «kua tiaki» does not agree with what is ignored, and the list
# carries no number of its own.
line-segment-attributes-ignored-with-endpoints = kua tiaki e { $attributes } ka talahau e tau ngataaga ua

line-segment-attributes-ignored-with-endpoint-and-midpoint = kua tiaki e { $attributes } ka talahau fakalataha e ngataaga mo e vahaloto

line-segment-midpoint-offset-without-midpoint = nakai fai aoga e midpointOffset ka nakai fai vahaloto

## `<line>`

line-points-undetermined-dimensions = Laini ne fano he tau poini nakai iloa e tau fuaaga.

line-points-too-few-dimensions = Kua lata e laini ke fano he tau poini ua po ke molea e fuaaga.

line-points-depend-on-variables = Kua fano e laini he tau poini ne fakavē ke he tau fetogi: { $variables }.

line-equation-invalid-format = Fakatokatokaaga nakai tonu ma e fakatatai he laini he tau fetogi { $variable1 } mo e { $variable2 }.

## `<ray>`

ray-overprescribed-through = Kua talahau e kaila he through, he endpoint, mo e direction.  Kua tiaki e through ne talahau.

ray-dimension-mismatch = Nakai felauaki e numDimensions he kaila.

## `<vector>`

vector-overprescribed-head = Kua talahau e veketā he head, he tail, mo e displacement.  Kua tiaki e head ne talahau.

vector-dimension-mismatch = Nakai felauaki e numDimensions he veketā.

## Attracting and constraining

attract-to-without-nearest-point = Nakai maeke ke futiaki ke he `<{ $component }>` ha kua nakai fai fetogi tuaga nearestPoint.

constrain-to-without-nearest-point = Nakai maeke ke fakakaupā ke he `<{ $component }>` ha kua nakai fai fetogi tuaga nearestPoint.

constrain-to-interior-without-nearest-point = Nakai maeke ke fakakaupā ke he loto he `<{ $component }>` ha kua nakai fai fetogi tuaga nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = Kua tiaki e labelPosition ma e choiceInput nakai inline

## Ordering children by index

choice-input-indices-count-mismatch = Kua tiaki e tau indices ne talahau ma e choiceInput ha kua nakai felauaki e tokologa he indices mo e tokologa he tau choice tama.

pretzel-indices-count-mismatch = Kua tiaki e tau indices ne talahau ma e problem ha kua nakai felauaki e tokologa he indices mo e tokologa he tau problem tama.

shuffle-indices-count-mismatch = Kua tiaki e tau indices ne talahau ma e shuffle ha kua nakai felauaki e tokologa he indices mo e tokologa he tau vala.

indices-ignored-out-of-range = Kua tiaki e tau indices ne talahau ma e { $component } ha kua ha ha i tua he kaupā falu indices.

pretzel-indices-repeated = Kua tiaki e tau indices ne talahau ma e pretzel ha kua liuliu falu indices.

pretzel-circuit-first-index = Kua tiaki e tau indices ne talahau ma e pretzel he circuit mode ha kua lata e index fakamua ke 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Ke gahua e `<{ $component }>` mo e tau string tama, kua lata ke talahau e atilipiuti `type`.

invalid-type-defaulting-to-math = Faahi nakai tonu { $type } ma e vala { $component }. Kua lata ke taha he math, text, number, po ke boolean. Kua liliu ke he math.

string-not-valid-component-to-arrange = Ko e string "{ $value }" nakai ko e vala tonu ke { $component }. Kua tiaki.

## Types and variables

invalid-type-defaulting-to-number = Faahi nakai tonu { $type }, kua fakatū e faahi ke number.

invalid-variable-value = Uho nakai tonu he fetogi: `{ $value }`

## Variants

variant-index-must-be-number = Kua lata e variant index { $index } ke fika

variant-index-must-be-integer = Kua lata e variant index { $index } ke fika katoa

## `<sideBySide>`

side-by-side-absolute-widths = Nakai la taute e `<{ $component }>` ma e tau fua fakatū. Kua fakatū e tau laulahi ke fakatatai.

side-by-side-absolute-margins = Nakai la taute e `<{ $component }>` ma e tau fua fakatū. Kua fakatū e tau kaupā ke fakatatai.

side-by-side-no-block-child = `<{ $component }>` nakai tonu: kua lata ke fai taha block tama.

## `<label>`

label-for-ignored-on-graphical = Kua tiaki e atilipiuti `for` he `<label>` fakatino.

label-for-must-resolve-to-one = Kua lata e atilipiuti `for` he `<label>` ke hoko ke he taha ni a vala.

label-for-unresolved = Nakai maeke e atilipiuti `for` he `<label>` ke hoko ke he taha vala.

label-for-answer-with-authored-inputs = Kua hagaao e atilipiuti `for` he `<label>` ke he `<answer>` ne fai tau input ne tohi pauaki; hagaao tonu ke he input.

label-for-answer-without-input = Kua hagaao e atilipiuti `for` he `<label>` ke he `<answer>` ne nakai fai input ke fakamailoga.

label-for-must-reference-input-or-answer = Kua lata e atilipiuti `for` he `<label>` ke hagaao ke he taha input po ke taha answer.

## Accessibility

accessibility-short-description-or-decorative = Ma e hokotia, kua lata e `<{ $component }>` ke fai fakamaamaaga kū po ke talahau ko e fakamatila ni.

accessibility-video-short-description = Ma e hokotia, kua lata e `<video>` ke fai fakamaamaaga kū.

accessibility-input-short-description-or-label = Ma e hokotia, kua lata e `<{ $component }>` ke fai fakamaamaaga kū po ke fakamailoga.

accessibility-answer-input-short-description-or-label = Ma e hokotia, ko e `<answer>` ne taute e input kua lata ke fai fakamaamaaga kū po ke fakamailoga.

accessibility-short-description-contains-math = Aua neke ha ha he tau fakamaamaaga kū e tau vala fika tuga e `<{ $component }>`. Tohi e tau fika aki e tau kupu.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Nakai lahi e keheaga he { $colorName } ma e kupu ulutogia he vahega (dark mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kua lata ke { $threshold }:1 po ke molea).
       *[other] Nakai lahi e keheaga he { $colorName } ma e kupu ulutogia he vahega ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kua lata ke { $threshold }:1 po ke molea).
    }

## `<circle>`

circle-through-points-non-numerical = Nakai la taute e `<circle>` he { $count } e poini ka nakai fai uho fika e tau poini.

circle-too-many-through-points = Nakai maeke ke fua e fuapotopoto he molea he 3 e poini.

circle-overprescribed-radius-center-points = Nakai maeke ke fua e fuapotopoto ka talahau fakalataha e leitiu, e loto, mo e tau poini.

circle-center-with-multiple-points = Nakai maeke ke fua e fuapotopoto ne talahau e loto ka fano he molea he 1 e poini.

circle-radius-too-small = Nakai maeke ke fua e fuapotopoto: ha ko e mamao he ua e poini ko e { $distance }, kua tote lahi e leitiu { $radius } ne talahau.

circle-radius-with-many-points = Nakai maeke ke taute e fuapotopoto he molea he ua e poini ka talahau e leitiu.

circle-invalid-center-or-through-points = Loto po ke tau poini he fuapotopoto nakai tonu.

circle-radius-center-with-multiple-points = Nakai maeke ke fua e leitiu he fuapotopoto ne talahau e loto ka fano he molea he 1 e poini.

circle-change-radius-non-numerical = Nakai maeke ke hiki e leitiu he fuapotopoto ka nakai fai uho fika e tau poini

circle-radius-with-points-non-numerical = Nakai maeke ke taute e fuapotopoto he molea he taha poini ka talahau e leitiu ka nakai fai uho fika.

circle-change-center-non-numerical = Nakai la taute e hikiaga he loto he fuapotopoto ne fano he tau poini nakai fai uho fika.

## `<function>`

# The two counts are printed; only the noun's number is dropped, which Niuean
# does not mark after a numeral.
function-domain-insufficient-dimensions = Nakai lahi e tau fuaaga ma e vahaaga he gahua fika. Fai { $intervals } e vahaloto e vahaaga ka e fai { $inputs } e huki e gahua fika.

function-domain-invalid-format = Fakatokatokaaga nakai tonu ma e vahaaga he gahua fika.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Kua tiaki e maximum nakai fika he gahua fika.
        [minimum] Kua tiaki e minimum nakai fika he gahua fika.
        [extremum] Kua tiaki e extremum nakai fika he gahua fika.
        [point] Kua tiaki e poini nakai fika he gahua fika.
        [slope] Kua tiaki e fakahifo nakai fika he gahua fika.
       *[other] Kua tiaki e { $type } nakai fika he gahua fika.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Kua tiaki e maximum tokoua he gahua fika.
        [minimum] Kua tiaki e minimum tokoua he gahua fika.
        [extremum] Kua tiaki e extremum tokoua he gahua fika.
        [point] Kua tiaki e poini tokoua he gahua fika.
       *[other] Kua tiaki e { $type } tokoua he gahua fika.
    }

function-points-too-close = Fai ua e poini he gahua fika kua tata lahi e tau tuaga. Nakai maeke ke fakamaama e gahua fika.

function-iterates-input-output-mismatch = Maeke ni e tau liuliuaga he gahua fika kaeke ke tatai e tokologa he huki mo e tokologa he fua. Fai { $inputs } e huki mo e { $outputs } e fua e gahua fika nei.

## `<sequence>`

sequence-invalid-length = Loloa nakai tonu he hokohokoaga.  Kua lata ke fika katoa nakai tote he noa.

sequence-invalid-step = Lakaaga nakai tonu he hokohokoaga.  Kua lata ke fika ma e hokohokoaga faahi { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" nakai tonu he hokohokoaga fika.  Kua lata ke fika.

sequence-invalid-endpoint-letters = "{ $attribute }" nakai tonu he hokohokoaga mataitohi.  Kua lata ke fakalatahaaga mataitohi.

sequence-invalid-endpoint = "{ $attribute }" nakai tonu he hokohokoaga.

select-from-sequence-coprime-not-numbers = kua tiaki e coprime ha kua nakai fifili e tau fika

select-from-sequence-coprime-with-exclude-combinations = kua tiaki e coprime ha kua talahau e excludeCombinations

## Resolving a `target`

target-not-found = Target nakai tonu ma e `<{ $source }>`: nakai maeke ke moua e target.

target-state-variable-not-found = Target nakai tonu ma e `<{ $source }>`: nakai maeke ke moua e fetogi tuaga higoa "{ $property }" he `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Kua lata e tau fetogi he `<odeSystem>` ke kehe mai he fetogi tokotaha.

ode-system-duplicate-variable-names = Nakai maeke ke fakamaama e tau gahua fika ODE RHS ne liuliu e tau higoa fetogi.

ode-system-rhs-function-error = Nakai maeke ke fakamaama e gahua fika ODE RHS.  Hehē he taute e gahua fika mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Nakai maeke ke fakamaama e tulala he { $count } e laini

angle-invalid-through-point = Poini nakai tonu he through he `<angle>`

parabola-vertex-too-many-points = Nakai la taute e palapola ne fai vertex ka fano he molea he 1 e poini.

parabola-too-many-points = Nakai la taute e palapola ne fano he molea he 3 e poini.

intersection-too-many-items = Nakai la taute e felauaki ma e molea he ua e mena

## Other math components

ionic-compound-not-two-ions = Nakai la taute e fakalatahaaga aioni ma e taha mena ka e ke ua e aioni.

ionic-compound-needs-cation-and-anion = Ne taute e fakalatahaaga aioni ma e taha cation mo e taha anion ni.

solve-equations-cannot-evaluate = Nakai maeke ke fakatonu e fakatatai ha kua nakai maeke ke fua e fakatatai: { $equation }

math-operators-operand-number-required = Kua lata ke talahau e operandNumber ka uta mai e taha math operand.

eigen-decomposition-failed = Nakai maeke ke fua e tau eigenvalue he laulau fika

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: nakai ha ha he fakatai e { $parameters }, ti to felauaki tumau mo e avanoa.

## `<graph>`

graph-grid-invalid = `<graph>`: nakai maeke ke maama e grid="{ $grid }". Kua lata ke none, medium, dense, po ke ua e fika lahi ne vehe he taha avanoa, tuga e grid="1 0.5". Nakai tā e mata.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    Kua lata e `<{ $component }>` ke fai gahua fika mo e { $expected ->
        [one] taha fua, ko e fakahifo y' he poini takitaha, tuga e `y - x`
       *[other] ua e fua, ko e veketā he poini takitaha, tuga e `(y, -x)`
    }, ka e fai { $found } e fua e gahua fika ne foaki ki ai. { $alternative ->
        [none] Nakai tā taha mena.
       *[other] Ko e `<{ $alternative }>` e vala ma e gahua fika ia. Nakai tā taha mena.
    }

field-function-attribute-ignored-with-child = Kua tiaki e atilipiuti `function` ha kua foaki foki e gahua fika he loto he vala; ko e mena i loto ne fakaaoga. Foaki e gahua fika he taha puhala ni.

field-variables-ignored =
    `<{ $component }>`: kua fakahigoa he atilipiuti `variables` e tau fetogi he talahauaga ne tohi tonu ki loto he vala. { $reason ->
        [function-child] Kua foaki e gahua fika hinei ko e `<function>` tama, ne fakahigoa e tau fetogi hana, ti kua tiaki e `variables`.
       *[no-expression] Nakai fai talahauaga pihia hinei, ti kua tiaki e `variables`.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: nakai lagomatai e xLabelPosition="left" he prefigure renderer; kua fakaaoga e mahani right-position.

prefigure-y-label-position-unsupported = `<graph>`: nakai lagomatai e yLabelPosition="bottom" he prefigure renderer; kua fakaaoga e mahani top-position.

prefigure-invalid-axis-bounds = `<graph>`: kaupā axis nakai tonu ma e liliuaga prefigure; kua fakaaoga e bbox fa mau (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: laulahi nakai tonu ma e liliuaga prefigure; kua fakaaoga e laulahi fa mau 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio nakai tonu ma e liliuaga prefigure; kua fakaaoga e aspect ratio fa mau 1.

prefigure-grid-spacing-too-fine = `<graph>`: kua tata lahi e tau mata ke he tau kaupā axis; kua tiaki e mata he prefigure renderer.

prefigure-annotations-not-rendered = `<graph>`: to nakai tā e tau annotation ka nakai fakaaoga e PreFigure renderer.

multiple-annotations-children = Ne moua e tau `<annotations>` tama loga he `<graph>`; kua tiaki oti ka ko e mena fakahiku.

## Referring to other components

copy-unrecognized-component-type = Nakai maeke ke fakalaulahi po ke kopi e faahi vala nakai maama: { $type }.

copy-prop-not-found = Nakai maeke ke moua e prop { $property } he vala faahi { $component }

collect-no-source = Nakai moua e punaaga ma e collect.

collect-invalid-component-type = Nakai maeke ke tanaki e tau vala faahi `<{ $component }>` ha ko e faahi vala nakai tonu.

reference-index-unavailable = Nakai maeke ke hagaao ke he index `{ $reference }`

## `<callAction>`

component-action-unavailable = Nakai maeke ke ui e { $action } he vala `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Tino nakai tonu he tau fakailoaaga.  Kua kehekehe e loloa he tau laini. Ne moua he componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Kua liuliu e tau higoa koluma he tau fakailoaaga.  Ne moua he componentIdx :{ $componentIdx }

data-frame-missing-column-name = Kua galo e taha higoa koluma he tau fakailoaaga.  Ne moua he componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Ko e award he tali nei kua fakavē ke he tali he answer tag ni, ti to kehe e mahani ka hoko.

answer-max-num-attempts-in-section-wide-check-work = Nakai fai aoga e fakatūaga he `maxNumAttempts` ke he `<answer>` i loto he vala ne fai `sectionWideCheckWork`, ha kua puipui he vala lahi e tokologa he tau lali. Fakatū e `maxNumAttempts` ke he vala lahi.

nested-section-wide-check-work-max-num-attempts = Nakai fai aoga e fakatūaga he `maxNumAttempts` ke he vala ne fai `sectionWideCheckWork` i loto he taha vala ne fai `sectionWideCheckWork`, ha kua puipui he vala i tua e tokologa he tau lali. Fakatū e `maxNumAttempts` ke he vala i tua.

answer-attributes-need-symbolic-equality = To nakai fai aoga e atilipiuti { $attributes } ka nakai fakatū e symbolicEquality.

answer-invalid-type = Faahi nakai tonu ma e tali: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ha kua nakai fai higoa e vala `<{ $component }>`, nakai maeke ke fakaaoga ma e atilipiuti he module

module-attribute-name-already-defined = Nakai maeke ke fakaaoga e vala `<{ $component } name="{ $name }">` ko e atilipiuti he module, ha kua fai atilipiuti "{ $name }" tuai e faahi vala `<module>`.

conditional-content-condition-ignored = Kua tiaki e atilipiuti `condition` he vala `<conditionalContent>` ne fai case po ke else tama.

slider-markers-type-mismatch = Nakai felauaki e faahi he tau markers mo e faahi he slider.

pretzel-problem-needs-statement-and-answer = Pretzel nakai tonu: kua lata e `<problem>` takitaha ke fai taha `<statement>` mo e taha `<answer>`.

pretzel-circuit-first-problem-distractor = Pretzel nakai tonu: he mode="circuit", nakai maeke e `<problem>` fakamua ke eke mo distractor.

## Attribute values

attribute-invalid-values = Uho nakai tonu { $values } ma e atilipiuti `{ $attribute }`; kua tiaki.

attribute-must-be-references = Uho nakai tonu `{ $value }` ma e atilipiuti `{ $attribute }`. Kua lata e atilipiuti ke taute aki e tau hagaaoaga ne kamata aki e `$`.

math-input-invalid-function-names = <mathInput>: kua tiaki e tau higoa gahua fika nakai tonu he { $attribute }: { $names }. Kua lata e vala fakakite he higoa takitaha ke ua po ke molea e mataitohi (tau mataitohi po ke tau hyphen); maeke ke mui mai e `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Faahi vala nakai tonu: `<{ $componentType }>`

attribute-repeated = Nakai maeke ke liuliu e atilipiuti { $attribute }.

attribute-invalid-for-component = Atilipiuti nakai tonu "{ $attribute }" ma e vala faahi `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Nakai lahi e keheaga he style definition { $styleNumber } ma e { $context ->
        [text-on-background] lanu kupu ke he lanu tua
        [high-contrast] lanu keheaga lahi ke he laupepa
        [line] lanu laini ke he laupepa
        [marker] lanu fakamailoga ke he laupepa
       *[text-on-canvas] lanu kupu ke he laupepa
    }{ $mode ->
        [dark] { " (dark mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kua lata ke { $threshold }:1 po ke molea).

style-definition-dark-mode-text-background-contrast =
    Pete ni he talahau he style definition { $styleNumber } e tau lanu ne lahi e keheaga ma e light mode, ko e tau lanu dark mode ne fua mai he tau uho ia kua nakai lahi e keheaga he lanu kupu ke he lanu tua ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kua lata ke { $threshold }:1 po ke molea). { $suggestion ->
        [available] Ke lahi e keheaga he dark mode, fakalahi e keheaga he light mode (tuga e fakatū { $lightAttribute }="{ $lightColor }") po ke hikihiki e lanu dark mode (tuga e fakatū { $darkAttribute }="{ $darkColor }").
       *[none] Ke lahi e keheaga he dark mode, fakalahi e keheaga he light mode po ke hikihiki e tau lanu ne fua mai aki e textColorDarkMode mo e/po ke backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Pete ni he talahau he style definition { $styleNumber } e lanu kupu ne lahi e keheaga ma e light mode, ko e lanu kupu dark mode ne fua mai he uho ia kua nakai lahi e keheaga ke he laupepa ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kua lata ke { $threshold }:1 po ke molea). { $suggestion ->
        [available] Ke lahi e keheaga he dark mode, fakalahi e keheaga he light mode (tuga e fakatū textColor="{ $lightColor }") po ke hikihiki e lanu dark mode (tuga e fakatū textColorDarkMode="{ $darkColor }").
       *[none] Ke lahi e keheaga he dark mode, fakalahi e keheaga he light mode po ke hikihiki e lanu ne fua mai aki e textColorDarkMode.
    }

section-multiple-style-palettes = Maeke he vahega ke fifili taha ni a <stylePalette>; kua fakaaoga e mena fakahiku.

## Unique variants

variant-num-to-select-not-non-negative-integer = nakai maeke ke iloa e tau kehekehe pauaki he { $component } ha kua nakai ko e fika katoa nakai tote he noa e numToSelect.

variant-num-to-select-not-constant-number = nakai maeke ke iloa e tau kehekehe pauaki he { $component } ha kua nakai ko e fika tumau e numToSelect.

variant-with-replacement-not-constant-boolean = nakai maeke ke iloa e tau kehekehe pauaki he { $component } ha kua nakai ko e boolean tumau e withReplacement.

variant-select-weight-disables-unique = Kua tapu e tau kehekehe pauaki ma e select kaeke fai option ne talahau e selectWeight po ke selectForVariants

variant-coprime-undetermined = nakai maeke ke iloa e tau kehekehe pauaki he { $component } ha kua nakai maeke ke iloa kua loi tumau e coprime.

variant-attribute-not-constant = nakai maeke ke iloa e tau kehekehe pauaki he { $component } ha kua nakai tumau e { $attribute }.

variant-attribute-not-number = nakai maeke ke iloa e tau kehekehe pauaki he { $component } ha kua nakai ko e fika e { $attribute }.

variant-attribute-wrong-type-for-sequence =
    nakai maeke ke iloa e tau kehekehe pauaki he { $component } he faahi { $type } ha kua nakai ko e { $expected ->
        [letters-combination] fakalatahaaga mataitohi
        [math-expression] talahauaga fika tonu
        [integer] fika katoa
       *[number] fika
    } e { $attribute }.

variant-length-not-integer = nakai maeke ke iloa e tau kehekehe pauaki he { $component } ha kua nakai ko e fika katoa e length.

variant-sort-not-implemented = nakai la taute e tau kehekehe pauaki he { $component } ne fai sort

variant-exclude-combinations-not-implemented = nakai la taute e tau kehekehe pauaki he { $component } ne fai excludeCombinations

variant-math-exclude-not-implemented = nakai la taute e tau kehekehe pauaki he { $component } faahi math ne fai exclude

variant-non-constant-exclude-not-implemented = nakai la taute e tau kehekehe pauaki he { $component } ne fai exclude nakai tumau

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: nakai lagomatai he graph prefigure renderer; kua fakalaka e tama.

prefigure-descendant-invalid-geometry = { $subject }: tino nakai katoa po ke nakai fai kaupā; kua fakalaka e tama.

prefigure-curve-label-omitted = { $subject }: nakai lagomatai e tau fakamailoga he tau vala laini pikopiko ne liliu; kua tiaki e fakamailoga.

prefigure-curve-unsupported-definition-type = { $subject }: faahi fakamaamaaga gahua fika laini pikopiko nakai lagomatai '{ $definitionType }'; kua fakalaka e tama.

prefigure-region-flip-functions-unsupported = { $subject }: nakai lagomatai e atilipiuti flipFunctions he regionBetweenCurves; kua fakalaka e tama.

prefigure-region-non-formula-child = { $subject }: ko e tau gahua fika tama faahi formula ni ne lagomatai he regionBetweenCurves; kua fakalaka e tama.

prefigure-label-position-unsupported =
    { $subject }: labelPosition nakai lagomatai '{ $labelPosition }' ma e { $labelKind ->
        [line-family] fakamailoga he magafaoa laini
       *[point] fakamailoga poini
    }; kua fakaaoga e fakatokatokaaga PreFigure fa mau.

prefigure-fill-style-unsupported = { $subject }: nakai lagomatai he PreFigure e fill style '{ $fillStyle }'; kua liliu ke he puke katoa.

prefigure-line-style-unknown = { $subject }: line style nakai maama '{ $lineStyle }' kua tiaki mai he fua PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: kua liliu e marker style '{ $markerStyle }' ke he style PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: nakai lagomatai he PreFigure e marker style '{ $markerStyle }'; kua fakaaoga e style fa mau.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` nakai tonu; nakai maeke ke moua e target. Kua tiaki e annotation.

annotation-ref-multiple-targets = `<annotation>`: kua hoko e `ref` ke he tau target loga; kua fakaaoga e target fakamua.

annotation-ref-outside-graph = `<annotation>`: `ref` nakai tonu; ha ha i tua he graph e target. Kua tiaki e annotation.

annotation-ref-unsupported-target = `<annotation>`: `ref` nakai tonu; nakai ko e mena fakatino ne lagomatai he liliuaga prefigure e target. Kua tiaki e annotation.

annotation-text-missing = `<annotation>`: kua galo po ke tokoua e `text`; kua tuku atu e kupu tokoua.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Kua moua e fakavēaga takai.
       *[other] Kua moua e fakavēaga takai ne putoia e vala `<{ $componentType }>`.
    }

reference-no-referent = Nakai moua ha mena ne hagaao ki ai e hagaaoaga: `{ $reference }`

reference-multiple-referents = Ne moua e tau mena loga ne hagaao ki ai e hagaaoaga: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Fakatokatokaaga nakai tonu ma e atilipiuti { $attribute } he `<{ $componentType }>`.

children-invalid = Tau tama nakai tonu ma e `<{ $componentType }>`: Ne moua e tau tama nakai tonu: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Uho nakai tonu `{ $value }` ma e atilipiuti `{ $attribute }`, kua fakaaoga e uho `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Nakai moua e fakaholoaga DoenetML { $version }.
       *[other] Nakai moua e fakaholoaga DoenetML { $version }. Kua liliu ke he fakaholoaga { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML nakai tonu: { $content }

parse-tag-missing-close-tag = DoenetML nakai tonu: Nakai fai closing tag e tag `{ $tag }`. Kua amanaki ke he self-closing tag po ke tag `</{ $tagName }>`.

parse-tag-error = DoenetML nakai tonu: Hehē he tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML nakai tonu: Tuga kua galo e uho he atilipiuti nakai tonu `{ $attribute }`.

parse-attribute-invalid = DoenetML nakai tonu: Atilipiuti nakai tonu `{ $attribute }`

parse-attribute-value-invalid = DoenetML nakai tonu: Uho atilipiuti nakai tonu `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML nakai tonu: Uho atilipiuti nakai tonu `{ $value }`. Nakai felauaki e tau mataitohi quote. Tuga kua galo e `{ $quote }`

parse-open-tag-name-missing = DoenetML nakai tonu: Ne moua e tag nakai fai higoa, tuga e `<`

parse-tag-not-closed = DoenetML nakai tonu: Nakai pā e tag `{ $tag }` (tuga kua galo e `>`).

parse-self-closing-tag-name-missing = DoenetML nakai tonu: Ne moua e tag nakai fai higoa `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML nakai tonu: Nakai pā e tag `{ $tag }` (tuga kua galo e `/>`).

parse-tag-invalid-attributes = DoenetML nakai tonu: Nakai tonu e tag `{ $tag }`. Liga hehē e tau atilipiuti.

parse-close-tag-name-missing = DoenetML nakai tonu: Ne moua e closing tag nakai fai higoa, tuga e `</`

parse-attribute-value-unquoted = Kua lata e tau uho atilipiuti ke tuku ki loto he tau quote: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML nakai tonu: Ne moua e closing tag `{ $tag }`, ka e nakai fai opening tag ne lata

parse-close-tag-mismatched = DoenetML nakai tonu: Closing tag nakai felauaki. Ne amanaki ke he `</{ $expected }>`. Ne moua e `{ $found }`

parser-node-unconvertible = Nakai maeke ke liliu e node { $node } ke he node Dast.

## Names

name-attribute-invalid =
    Higoa atilipiuti nakai tonu name='{ $name }'. { $reason ->
        [characters] Maeke ni ke fai mataitohi, fika, underscore po ke hyphen e tau higoa.
       *[start] Kua lata e tau higoa ke kamata aki e mataitohi.
    }

component-name-invalid-start = Higoa vala nakai tonu "{ $name }". Kua lata e tau higoa ke kamata aki e mataitohi.

## `<answer>` sugar

answer-video-watched-missing-video = Kua lata e answer faahi videoWatched ke fai atilipiuti video

answer-video-watched-video-not-reference = Kua lata e answer faahi videoWatched ke fai atilipiuti video ko e hagaaoaga

answer-name-not-single-text = Kua lata e atilipiuti name he answer ke fai taha ni a text tama

## Referencing another document

external-doenetml-recursion-limit = Nakai maeke ke uta mai e DoenetML i fafo ha kua lahi mahaki e tau tuaga liuliu. Fai hagaaoaga takai kia?

external-doenetml-unavailable = Nakai maeke ke uta mai e DoenetML mai he { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML nakai tonu ne uta mai he { $attribute }="{ $uri }": nakai felauaki mo e faahi vala "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Kua tuai e atilipiuti `{ $from }`; fakaaoga e `{ $to }`.
       *[other] [deprecation] Kua tuai e atilipiuti `{ $from }` he `<{ $component }>`; fakaaoga e `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Kua tuai mo e kua tiaki e atilipiuti `{ $from }` ha kua talahau foki e `{ $to }`.
       *[other] [deprecation] Kua tuai mo e kua tiaki e atilipiuti `{ $from }` he `<{ $component }>` ha kua talahau foki e `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Kua tuai mo e kua tiaki e atilipiuti `{ $attribute }` he `<{ $component }>`.

deprecated-attribute-to-child = [deprecation] Kua tuai e atilipiuti `{ $attribute }` he `<{ $component }>`; fakaaoga e `<{ $child }>` tama.

deprecated-attribute-value-renamed = [deprecation] Kua tuai e uho `{ $value }` he atilipiuti `{ $attribute }` he `<{ $component }>`; fakaaoga e `{ $to }`.


## Language coverage

pluralize-english-only = Maeke ni he `<pluralize>` ke fakaloga e vagahau Peritania, ti kua toka e kupu hana ke tuga ni he tohi he tagata tohi he tohi ne tohi he { $locale }. Tohi tonu e fōmu fakaloga, po ke fakatū aki e atilipiuti `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Ko e vala `<{ $tag }>` nakai ko e vala Doenet ne maama.

schema-element-not-allowed-at-root = Nakai ata e vala `<{ $tag }>` he vaega he tohi.

schema-element-not-allowed-inside = Nakai ata e vala `<{ $tag }>` i loto he `<{ $parent }>`.

schema-attribute-unrecognized = Nakai fai atilipiuti higoa `{ $attribute }` e vala `<{ $tag }>`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Kua lata e atilipiuti `{ $attribute }` he vala `<{ $tag }>` ke eke mo lisi ne taha he tau mena nei e mena takitaha: { $allowed }
       *[other] Kua lata e atilipiuti `{ $attribute }` he vala `<{ $tag }>` ke taha he tau mena nei: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Higoa variant nakai tonu ma e select.  Kua kitia e higoa variant { $variantName } he { $numOptions } e option ka e ko e tokologa ke fifili ko e { $numToSelect }.

select-variant-name-without-options = Kua talahau falu variant ma e select ka e nakai talahau ha option ma e higoa variant maeke: { $variantName }.

select-variant-name-not-possible = Ko e higoa variant { $variantName } ne talahau ma e select kua nakai maeke ke eke mo higoa variant.

select-too-few-options = Nakai maeke ke fifili { $numToSelect } e vala mai he { $numOptions } ni.

select-from-sequence-too-few-values = Nakai maeke ke fifili { $numToSelect } e uho mai he hokohokoaga ne loloa { $length }.

select-from-sequence-indices-count-mismatch = Kua lata e tokologa he indices ne talahau ma e select ke felauaki mo e tokologa ke fifili

select-from-sequence-indices-not-integers = Kua lata e tau indices oti ne talahau ma e select ke fika katoa

select-from-sequence-index-excluded = Ne talahau e index he selectfromsequence ne kua tiaki tuai

select-from-sequence-indices-excluded-combination = Ne talahau e tau indices he selectfromsequence ne ko e fakalatahaaga kua tiaki tuai

select-from-sequence-coprime-not-positive-integers = Nakai maeke ke fifili e tau fakalatahaaga coprime ha kua nakai fifili e tau fika katoa lahi he noa.

select-from-sequence-coprime-common-factor = Nakai maeke ke fifili e tau fika coprime. Kua fai factor tatai e tau uho oti ne maeke. (Kua lata e tau uho ne talahau ma e "from" po ke "to" ke coprime mo e "step".)

select-from-sequence-coprime-single-number = Nakai maeke ke fifili e tau fakalatahaaga coprime mai he taha fika ni ne nakai ko e 1.

select-from-sequence-excluded-too-many-combinations = Kua tiaki e molea he 70% he tau fakalatahaaga he selectFromSequence

select-from-sequence-coprime-none-found = Nakai maeke ke fifili e tau fika coprime. Kua fai factor tatai e tau uho oti ne maeke.

select-from-sequence-too-few-unique-values = Nakai maeke ke fifili { $numToSelect } e uho pauaki mai he hokohokoaga ne loloa { $numPossibleValues }

select-prime-numbers-too-few-values = Nakai maeke ke fifili { $numToSelect } e uho mai he lisi fika prime ne loloa { $numValues }

select-prime-numbers-values-count-mismatch = Kua lata e tokologa he tau uho ne talahau ma e select ke felauaki mo e tokologa ke fifili

select-prime-numbers-values-not-prime = Kua lata e tau uho oti ne talahau ma e select prime number ke ha ha he lisi fika prime

select-prime-numbers-values-excluded-combination = Ko e tau uho ne talahau ma e selectPrimeNumbers ko e fakalatahaaga kua tiaki tuai

select-prime-numbers-excluded-too-many-combinations = Kua tiaki e molea he 70% he tau fakalatahaaga he selectPrimeNumbers

select-random-combination-fluke = He mena uka lahi ke hoko, nakai maeke ke fifili e fakalatahaaga he tau uho fakateaga

select-random-value-fluke = He mena uka lahi ke hoko, nakai maeke ke fifili e uho fakateaga

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    Nakai tā e `<{ $component }>` i loto he fika; kua tā e talahauaga tuga ni he mua atu he maeke e tau input ke tuku ki loto. { $reason ->
        [not-inline] Ko e choice input `inline` ni ne maeke ke tuku ki loto he talahauaga; ka nakai fai `inline` ko e poloka patapata haia.
        [expanded] Ko e text input `expanded` ko e puha laini loga, ne lahi lahi ke tuku ki loto he talahauaga.
        [on-graph] He kalafi kua tā e talahauaga ko e taha fakatino ni, ti nakai fai avanoa ma e taha mena lomi.
       *[relative-width] Ko e `width` hana kua fakatatai (peseti po ke `em`), ti nakai fai mena ke fua ai i loto he talahauaga. Foaki e laulahi he tau fua fakatū, tuga e `px`.
    }
