# Nahuatl diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
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
# Written in Central Nahuatl, SEP/INALI orthography; see `chrome.ftl`'s header for
# the variety and the register.
#
# The inanimate nouns these messages count take no plural, so a counted message
# whose only English difference is number renders one string here and the select
# is dropped. A comment marks each site.
#
# No possessive prefix is welded to a value anywhere here, for the reason
# `content.ftl`'s header sets out: its shape depends on what follows it. Where the
# English possessed a placeable, this catalog writes «ipan» — "on", a free word —
# instead.


## `<lineSegment>`

# No select: these nouns are inanimate and take no plural, and the verb does not
# agree with the number of what is ignored, so one string covers both English
# categories. The count still arrives.
line-segment-attributes-ignored-with-endpoints = ahmo mocui { $attributes } in ihcuāc ōme tlatzonquīzcāyōtl motlālia

line-segment-attributes-ignored-with-endpoint-and-midpoint = ahmo mocui { $attributes } in ihcuāc cē tlatzonquīzcāyōtl īhuān cē tlanepantlah motlālia

line-segment-midpoint-offset-without-midpoint = midpointOffset ahtlein quichīhua in ihcuāc ahmo cah tlanepantlah

## `<line>`

line-points-undetermined-dimensions = Tlīlli tlaīxpan tlīltzintli in ahmo momati intlamachiyōtl.

line-points-too-few-dimensions = In tlīlli monequi tlaīxpan tlīltzintli in quipiya ōme ahnōzo occequi tlamachiyōtl.

line-points-depend-on-variables = In tlīlli tlaīxpan tlīltzintli in quipiya tlapatlalōni: { $variables }.

line-equation-invalid-format = Ahmo cualli in tlaneneuhcāyōtl in tlīlli ipan tlapatlalōni { $variable1 } īhuān { $variable2 }.

## `<ray>`

ray-overprescribed-through = In meyalli motlālia īca through, endpoint īhuān direction.  Ahmo mocui in through ōmotlālih.

ray-dimension-mismatch = numDimensions ahmo neneuhqui ipan in meyalli.

## `<vector>`

vector-overprescribed-head = In bector motlālia īca head, tail īhuān displacement.  Ahmo mocui in head ōmotlālih.

vector-dimension-mismatch = numDimensions ahmo neneuhqui ipan in bector.

## Attracting and constraining

attract-to-without-nearest-point = Ahmo huel motīlāna ipan cē `<{ $component }>`, ipampa ahmo quipiya nearestPoint.

constrain-to-without-nearest-point = Ahmo huel motzacua ipan cē `<{ $component }>`, ipampa ahmo quipiya nearestPoint.

constrain-to-interior-without-nearest-point = Ahmo huel motzacua ihtic cē `<{ $component }>`, ipampa ahmo quipiya nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = ahmo mocui labelPosition ipan cē choiceInput in ahmo inline

## Ordering children by index

choice-input-indices-count-mismatch = Ahmo mocui in indices ōmotlālih inic choiceInput, ipampa in tlapōhualli ahmo neneuhqui īca in choice tlapiltzitzin.

pretzel-indices-count-mismatch = Ahmo mocui in indices ōmotlālih inic problem, ipampa in tlapōhualli ahmo neneuhqui īca in problem tlapiltzitzin.

shuffle-indices-count-mismatch = Ahmo mocui in indices ōmotlālih inic shuffle, ipampa in tlapōhualli ahmo neneuhqui īca in tlanechicōlli.

indices-ignored-out-of-range = Ahmo mocui in indices ōmotlālih inic { $component }, ipampa cequi tlapōhualli pani quīza.

pretzel-indices-repeated = Ahmo mocui in indices ōmotlālih inic pretzel, ipampa cequi tlapōhualli ōmoquetz ōccān.

pretzel-circuit-first-index = Ahmo mocui in indices ōmotlālih inic pretzel ipan circuit, ipampa in achto tlapōhualli monequi 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Inic `<{ $component }>` tequitiz īca tlahcuilōlli tlapiltzitzin, monequi ticlālīz cē `type` tlamachiyōtīlli.

invalid-type-defaulting-to-math = Ahmo cualli in tlamantli { $type } inic { $component }. Monequi math, text, number ahnōzo boolean. Motlālia math.

string-not-valid-component-to-arrange = In tlahcuilōlli "{ $value }" ahmo cualli tlanechicōlli inic { $component }. Ahmo mocui.

## Types and variables

invalid-type-defaulting-to-number = Ahmo cualli in tlamantli { $type }, motlālia number.

invalid-variable-value = Ahmo cualli in tlapatlalōni īpatiuh: `{ $value }`

## Variants

variant-index-must-be-number = In tlamantli tlapōhualli { $index } monequi tlapōhualli yez

variant-index-must-be-integer = In tlamantli tlapōhualli { $index } monequi tlacempōhualli yez

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ahmo mochīhua īca tlatamachīhualli tlacempōhualli. Motlālia in patlāhuac tlaneneuhcāyōtl.

side-by-side-absolute-margins = `<{ $component }>` ahmo mochīhua īca tlatamachīhualli tlacempōhualli. Motlālia in tenāmitl tlaneneuhcāyōtl.

side-by-side-no-block-child = Ahmo cualli `<{ $component }>`: monequi quipiyaz mā zan cē bloke tlapiltzintli.

## `<label>`

label-for-ignored-on-graphical = Ahmo mocui in `for` tlamachiyōtīlli ipan cē `<label>` tlaīxiptlayōtl.

label-for-must-resolve-to-one = In `for` tlamachiyōtīlli ipan `<label>` monequi quinōtzaz zan cē tlanechicōlli.

label-for-unresolved = In `for` tlamachiyōtīlli ipan `<label>` ahmo ōhuel quinōtz cē tlanechicōlli.

label-for-answer-with-authored-inputs = In `for` tlamachiyōtīlli ipan `<label>` quinōtza cē `<answer>` in quipiya calaquiliztli in tlahcuilōhqui ōquitlālih; xicnōtza in calaquiliztli.

label-for-answer-without-input = In `for` tlamachiyōtīlli ipan `<label>` quinōtza cē `<answer>` in ahmo quipiya calaquiliztli inic motōcāyōtīz.

label-for-must-reference-input-or-answer = In `for` tlamachiyōtīlli ipan `<label>` monequi quinōtzaz cē calaquiliztli ahnōzo cē tlanānquilīlli.

## Accessibility

accessibility-short-description-or-decorative = Inic calaquiliztli, `<{ $component }>` monequi quipiyaz cē tlanēxtīlli tepitōn ahnōzo motēnēhuaz tlachihchīhualōni.

accessibility-video-short-description = Inic calaquiliztli, `<video>` monequi quipiyaz cē tlanēxtīlli tepitōn.

accessibility-input-short-description-or-label = Inic calaquiliztli, `<{ $component }>` monequi quipiyaz cē tlanēxtīlli tepitōn ahnōzo cē tōcāitl.

accessibility-answer-input-short-description-or-label = Inic calaquiliztli, cē `<answer>` in quichīhua cē calaquiliztli monequi quipiyaz cē tlanēxtīlli tepitōn ahnōzo cē tōcāitl.

accessibility-short-description-contains-math = In tlanēxtīlli tepitōn ahmo monequi quipiyaz tlapōhualiztli tlanechicōlli iuhqui `<{ $component }>`. Xictlāli in tlapōhualiztli īca tlahtōlli.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ahmo quipiya tlaneltilōni inic in tlaxexelōlli ītōcā tlahcuilōlli (tlīltic tlamantli) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; monequi mā zan { $threshold }:1).
       *[other] { $colorName } ahmo quipiya tlaneltilōni inic in tlaxexelōlli ītōcā tlahcuilōlli ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; monequi mā zan { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Ayamo mochīhua `<circle>` tlaīxpan { $count } tlīltzintli in ihcuāc in tlīltzintli ahmo quipiya tlapōhualli īpatiuh.

circle-too-many-through-points = Ahmo huel mopōhua cē yāhualtic tlaīxpan occequi ihuān 3 tlīltzintli.

circle-overprescribed-radius-center-points = Ahmo huel mopōhua cē yāhualtic īca tlanepantlah ohtli, tlanepantlah īhuān tlīltzintli ōmotlālih.

circle-center-with-multiple-points = Ahmo huel mopōhua cē yāhualtic īca tlanepantlah ōmotlālih tlaīxpan occequi ihuān 1 tlīltzintli.

circle-radius-too-small = Ahmo huel mopōhua in yāhualtic: ipampa in ōme tlīltzintli īnehuāntlah { $distance }, in tlanepantlah ohtli { $radius } ōmotlālih zan tepitōn.

circle-radius-with-many-points = Ahmo huel mochīhua cē yāhualtic tlaīxpan occequi ihuān ōme tlīltzintli īca tlanepantlah ohtli ōmotlālih.

circle-invalid-center-or-through-points = Ahmo cualli in yāhualtic ītlanepantlah ahnōzo ītlīltzintli.

circle-radius-center-with-multiple-points = Ahmo huel mopōhua in yāhualtic ītlanepantlah ohtli īca tlanepantlah ōmotlālih tlaīxpan occequi ihuān 1 tlīltzintli.

circle-change-radius-non-numerical = Ahmo huel mopatla in yāhualtic ītlanepantlah ohtli in ihcuāc in tlīltzintli ahmo tlapōhualli

circle-radius-with-points-non-numerical = Ahmo huel mochīhua cē yāhualtic tlaīxpan occequi ihuān cē tlīltzintli īca tlanepantlah ohtli ōmotlālih, in ihcuāc ahmo cah tlapōhualli īpatiuh.

circle-change-center-non-numerical = Ayamo mochīhua in yāhualtic ītlanepantlah ipatlaliztli in ihcuāc in tlīltzintli ahmo quipiya tlapōhualli īpatiuh.

## `<function>`

# Both selects dropped: these nouns are inanimate and take no plural, so English's
# four sentences are one here. Both counts still arrive and are still formatted.
function-domain-insufficient-dimensions = Ahmo cahci in tlamachiyōtl inic in funsion ītlālpan. In tlālpan quipiya { $intervals } tlanepantlah tel in funsion quipiya { $inputs } calaquiliztli.

function-domain-invalid-format = Ahmo cualli in tlaneneuhcāyōtl inic in funsion ītlālpan.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ahmo mocui in funsion ītlapanahuia in ahmo tlapōhualli.
        [minimum] Ahmo mocui in funsion ītlatzintlān in ahmo tlapōhualli.
        [extremum] Ahmo mocui in funsion ītlatzonquīzca in ahmo tlapōhualli.
        [point] Ahmo mocui in funsion ītlīltzin in ahmo tlapōhualli.
        [slope] Ahmo mocui in funsion ītlaquetzca in ahmo tlapōhualli.
       *[other] Ahmo mocui in { $type } ipan in funsion in ahmo tlapōhualli.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ahmo mocui in funsion ītlapanahuia in cactic.
        [minimum] Ahmo mocui in funsion ītlatzintlān in cactic.
        [extremum] Ahmo mocui in funsion ītlatzonquīzca in cactic.
        [point] Ahmo mocui in funsion ītlīltzin in cactic.
       *[other] Ahmo mocui in { $type } ipan in funsion in cactic.
    }

function-points-too-close = In funsion quipiya ōme tlīltzintli in zan tlanāhuac cateh. Ahmo huel motlālia in funsion.

# Both selects dropped, for the reason above.
function-iterates-input-output-mismatch = In funsion tlacuepcāyōtl zan huel in ihcuāc in calaquiliztli tlapōhualli neneuhqui īca in quīzaliztli tlapōhualli. Inin funsion quipiya { $inputs } calaquiliztli īhuān { $outputs } quīzaliztli.

## `<sequence>`

sequence-invalid-length = Ahmo cualli in tlatehtectli īhuēyaca.  Monequi tlacempōhualli in ahmo tlatzintlān.

sequence-invalid-step = Ahmo cualli in tlatehtectli ītlaxitīnīlli.  Monequi tlapōhualli inic tlatehtectli tlamantli { $type }.

sequence-invalid-endpoint-number = Ahmo cualli in "{ $attribute }" inic tlapōhualli tlatehtectli.  Monequi tlapōhualli.

sequence-invalid-endpoint-letters = Ahmo cualli in "{ $attribute }" inic tlahcuilōlmachiyōtl tlatehtectli.  Monequi tlahcuilōlmachiyōtl tlanechicōlli.

sequence-invalid-endpoint = Ahmo cualli in tlatehtectli "{ $attribute }".

select-from-sequence-coprime-not-numbers = ahmo mocui coprime ipampa ahmo tlapōhualli mopehpena

select-from-sequence-coprime-with-exclude-combinations = ahmo mocui coprime ipampa excludeCombinations ōmotlālih

## Resolving a `target`

target-not-found = Ahmo cualli in target inic `<{ $source }>`: ahmo mottā.

target-state-variable-not-found = Ahmo cualli in target inic `<{ $source }>`: ahmo mottā cē tlacāhualli in ītōcā "{ $property }" ipan cē `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = In `<odeSystem>` ītlapatlalōni monequi occē yez in ahmo tlapatlalōni.

ode-system-duplicate-variable-names = Ahmo huel motlālia ODE RHS funsion īca tlapatlalōni tōcāitl ōmoquetz ōccān.

ode-system-rhs-function-error = Ahmo huel motlālia ODE RHS funsion.  Tlahtlacōlli in ihcuāc mochīhuaya mathjs funsion.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ahmo huel motlālia cē nacaztli ipan { $count } tlīlli

angle-invalid-through-point = Ahmo cualli tlīltzintli ipan `<angle>` ītlaīxpan

parabola-vertex-too-many-points = Ayamo mochīhua parabola īca nacaztli tlaīxpan occequi ihuān 1 tlīltzintli.

parabola-too-many-points = Ayamo mochīhua parabola tlaīxpan occequi ihuān 3 tlīltzintli.

intersection-too-many-items = Ayamo mochīhua tlanepanōlli inic occequi ihuān ōme tlanechicōlli

## Other math components

ionic-compound-not-two-ions = Ayamo mochīhua tlanechicōlli ioniko inic occē in ahmo ōme ion.

ionic-compound-needs-cation-and-anion = In tlanechicōlli ioniko zan mochīhua inic cē cation īhuān cē anion.

solve-equations-cannot-evaluate = Ahmo huel motlanāmictia in tlaneneuhcāyōtl, ipampa ahmo ōhuel mopōuh: { $equation }

math-operators-operand-number-required = Monequi ticlālīz cē operandNumber in ihcuāc tiquīxtia cē tlapōhualiztli operando.

eigen-decomposition-failed = Ahmo ōhuel mopōuh in matris ītlacempōhualli īpatiuh

## `<matchesPattern>`

# No select: these nouns are inanimate and take no plural, and the verb does not
# agree, so both English categories are one string.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: in { $parameters } tlatamachīhualli ahmo cah ipan in tlamachiyōtl, ic mochipa quināmiquiz in cactic.

## `<graph>`

graph-grid-invalid = `<graph>`: ahmo huel momati grid="{ $grid }". Monequi none, medium, dense, ahnōzo ōme tlapōhualli in ahmo tlatzintlān, motzehtzelohtoc īca cē cactic, iuhqui grid="1 0.5". Ahtlein tlanepanōlli mochīhua.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ahmo mocui ipan in prefigure tlanēxtiāni; mocui in tlamāyeccāmpa tlachīhualli.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ahmo mocui ipan in prefigure tlanēxtiāni; mocui in tlacpac tlachīhualli.

prefigure-invalid-axis-bounds = `<graph>`: ahmo cualli in tlamalacachōlli ītenāmitl inic prefigure ipatlaliztli; mocui in bbox achto (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: ahmo cualli in patlāhuac inic prefigure ipatlaliztli; mocui in tlaīxiptlayōtl ipatlāhuac achto 425.

prefigure-invalid-aspect-ratio = `<graph>`: ahmo cualli in aspectRatio inic prefigure ipatlaliztli; mocui in tlaneneuhcāyōtl achto 1.

prefigure-grid-spacing-too-fine = `<graph>`: in tlanepanōlli īnehuāntlah zan canāhuac inic in tlamalacachōlli ītenāmitl; in tlanepanōlli mocāhua ipan in prefigure tlanēxtiāni.

prefigure-annotations-not-rendered = `<graph>`: in tlahcuilōlnechicōlli ahmo monēxtīz in ihcuāc ahmo mocui in PreFigure tlanēxtiāni.

multiple-annotations-children = Miec `<annotations>` tlapiltzitzin ōmottac ipan `<graph>`; ahmo mocui in mochi, zan in tlatzonquīzca.

## Referring to other components

copy-unrecognized-component-type = Ahmo huel mohuēyaquilia ahnōzo mocopīna cē tlanechicōlli tlamantli in ahmo momati: { $type }.

copy-prop-not-found = Ahmo ōmottac in prop { $property } ipan cē tlanechicōlli tlamantli { $component }

collect-no-source = Ahtlein tlanelhuayōtl ōmottac inic collect.

collect-invalid-component-type = Ahmo huel monechicoa tlanechicōlli tlamantli `<{ $component }>`, ipampa ahmo cualli tlamantli.

reference-index-unavailable = Ahmo huel quinōtza in tlapōhualli `{ $reference }`

## `<callAction>`

component-action-unavailable = Ahmo huel monōtza { $action } ipan in tlanechicōlli `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Ahmo cualli in tlamachiliztli ītlaneneuhcāyōtl.  In tlamelāuhcāyōtl īhuēyaca ahmo neneuhqui. Ōmottac ipan componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = In tlamachiliztli quipiya tlaquetzalli tōcāitl ōmoquetz ōccān.  Ōmottac ipan componentIdx :{ $componentIdx }

data-frame-missing-column-name = In tlamachiliztli ahmo quipiya cē tlaquetzalli tōcāitl.  Ōmottac ipan componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Cē award inic inin tlanānquilīlli motlālia ipan in tlanānquilīlli tag ītlanānquilīl ōtitlanōc, īhuān inin quihuīcaz tlachīhualli in ahmo momati.

answer-max-num-attempts-in-section-wide-check-work = In `maxNumAttempts` motlālia ipan cē `<answer>` ihtic cē tlacaxitl in quipiya `sectionWideCheckWork` ahtlein quichīhua, ipampa in tlacaxitl quipiya in tlayehyecōlli tlapōhualli. Xictlāli `maxNumAttempts` ipan in tlacaxitl.

nested-section-wide-check-work-max-num-attempts = In `maxNumAttempts` motlālia ipan cē tlacaxitl in quipiya `sectionWideCheckWork` in cah ihtic occē tlacaxitl in quipiya `sectionWideCheckWork` ahtlein quichīhua, ipampa in pani tlacaxitl quipiya in tlayehyecōlli tlapōhualli. Xictlāli `maxNumAttempts` ipan in pani tlacaxitl.

# No select: «tlamachiyōtīlli» is inanimate and takes no plural.
answer-attributes-need-symbolic-equality = In tlamachiyōtīlli { $attributes } ahtlein quichīhuaz in ihcuāc ahmo motlālia symbolicEquality.

answer-invalid-type = Ahmo cualli in tlamantli inic in tlanānquilīlli: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ipampa in tlanechicōlli `<{ $component }>` ahmo quipiya tōcāitl, ahmo huel mocui inic cē module tlamachiyōtīlli

module-attribute-name-already-defined = In tlanechicōlli `<{ $component } name="{ $name }">` ahmo huel mocui iuhqui cē tlamachiyōtīlli inic cē module, ipampa in `<module>` tlamantli ye quipiya cē "{ $name }" tlamachiyōtīlli.

conditional-content-condition-ignored = Ahmo mocui in `condition` tlamachiyōtīlli ipan cē `<conditionalContent>` in quipiya case ahnōzo else tlapiltzitzin.

slider-markers-type-mismatch = In machiyōtl tlamantli ahmo neneuhqui īca in slider tlamantli.

pretzel-problem-needs-statement-and-answer = Ahmo cualli pretzel: cehcen `<problem>` monequi quipiyaz cē `<statement>` īhuān cē `<answer>`.

pretzel-circuit-first-problem-distractor = Ahmo cualli pretzel: ipan mode="circuit", in achto `<problem>` ahmo huel tlaīxpōlōlli.

## Attribute values

# No select: «īpatiuh» is inanimate and takes no plural.
attribute-invalid-values = Ahmo cualli in īpatiuh { $values } inic in tlamachiyōtīlli `{ $attribute }`; ahmo mocui.

attribute-must-be-references = Ahmo cualli in īpatiuh `{ $value }` inic in tlamachiyōtīlli `{ $attribute }`. In tlamachiyōtīlli monequi mochīhuaz īca tlanōtzalli in pēhua īca cē `$`.

math-input-invalid-function-names = <mathInput>: ahmo mocui in funsion tōcāitl in ahmo cualli ipan { $attribute }: { $names }. Cehcen tōcāitl ītlanēxtīlcotōnal monequi quipiyaz mā zan 2 machiyōtl (tlahcuilōlmachiyōtl ahnōzo tlahuīlteccāyōtl); huel hualhuīcaz cē `|<mathspeak alternative>` in monequi.

## Building components from the source

component-type-invalid = Ahmo cualli in tlanechicōlli tlamantli: `<{ $componentType }>`

attribute-repeated = Ahmo huel moquetza ōccān in tlamachiyōtīlli { $attribute }.

attribute-invalid-for-component = Ahmo cualli in tlamachiyōtīlli "{ $attribute }" inic cē tlanechicōlli tlamantli `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    In tlanēmilīlli { $styleNumber } ahmo quipiya tlaneltilōni inic { $context ->
        [text-on-background] in tlahcuilōlli ītlapallo īhuīc in tlacuitlapampa ītlapallo
        [high-contrast] in tlapallōtl chicāhuac īhuīc in tlacaxitl
        [line] in tlīlli ītlapallo īhuīc in tlacaxitl
        [marker] in machiyōtl ītlapallo īhuīc in tlacaxitl
       *[text-on-canvas] in tlahcuilōlli ītlapallo īhuīc in tlacaxitl
    }{ $mode ->
        [dark] { " (tlīltic tlamantli)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; monequi mā zan { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Mazo in tlanēmilīlli { $styleNumber } ōquitlālih tlapallōtl in quipiya tlaneltilōni inic in tlanēzcāyōtl tlanēxtic, in tlīltic tlapallōtl in ōmpa quīza ahmo quipiya tlaneltilōni inic in tlahcuilōlli ītlapallo īhuīc in tlacuitlapampa ītlapallo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; monequi mā zan { $threshold }:1). { $suggestion ->
        [available] Inic cah tlaneltilōni ipan in tlīltic tlamantli, xichuēyaqui in tlanēxtic tlaneltilōni (iuhqui, xictlāli { $lightAttribute }="{ $lightColor }") ahnōzo xicpatla in tlīltic tlapallōtl (iuhqui, xictlāli { $darkAttribute }="{ $darkColor }").
       *[none] Inic cah tlaneltilōni ipan in tlīltic tlamantli, xichuēyaqui in tlanēxtic tlaneltilōni ahnōzo xicpatla in tlapallōtl in ōmpa quīza īca textColorDarkMode īhuān/ahnōzo backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Mazo in tlanēmilīlli { $styleNumber } ōquitlālih cē tlahcuilōltlapallōtl in quipiya tlaneltilōni inic in tlanēzcāyōtl tlanēxtic, in tlīltic tlahcuilōltlapallōtl in ōmpa quīza ahmo quipiya tlaneltilōni īhuīc in tlacaxitl ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; monequi mā zan { $threshold }:1). { $suggestion ->
        [available] Inic cah tlaneltilōni ipan in tlīltic tlamantli, xichuēyaqui in tlanēxtic tlaneltilōni (iuhqui, xictlāli textColor="{ $lightColor }") ahnōzo xicpatla in tlīltic tlapallōtl (iuhqui, xictlāli textColorDarkMode="{ $darkColor }").
       *[none] Inic cah tlaneltilōni ipan in tlīltic tlamantli, xichuēyaqui in tlanēxtic tlaneltilōni ahnōzo xicpatla in tlapallōtl in ōmpa quīza īca textColorDarkMode.
    }

section-multiple-style-palettes = Cē tlaxexelōlli zan huel quipehpenaz cē <stylePalette>; mocui in tlatzonquīzca.

## Unique variants

variant-num-to-select-not-non-negative-integer = ahmo huel momati in { $component } ītlamantli cehcentetl, ipampa numToSelect ahmo tlacempōhualli in ahmo tlatzintlān.

variant-num-to-select-not-constant-number = ahmo huel momati in { $component } ītlamantli cehcentetl, ipampa numToSelect ahmo tlapōhualli in mochipa neneuhqui.

variant-with-replacement-not-constant-boolean = ahmo huel momati in { $component } ītlamantli cehcentetl, ipampa withReplacement ahmo boolean in mochipa neneuhqui.

variant-select-weight-disables-unique = In select ītlamantli cehcentetl motzacua in ihcuāc cah cē tlapehpenalli īca selectWeight ahnōzo selectForVariants ōmotlālih

variant-coprime-undetermined = ahmo huel momati in { $component } ītlamantli cehcentetl, ipampa ahmo huel momati ahzo coprime mochipa ahnelli.

variant-attribute-not-constant = ahmo huel momati in { $component } ītlamantli cehcentetl, ipampa { $attribute } ahmo mochipa neneuhqui.

variant-attribute-not-number = ahmo huel momati in { $component } ītlamantli cehcentetl, ipampa { $attribute } ahmo tlapōhualli.

variant-attribute-wrong-type-for-sequence =
    ahmo huel momati in { $component } tlamantli { $type } ītlamantli cehcentetl, ipampa { $attribute } ahmo { $expected ->
        [letters-combination] cē tlahcuilōlmachiyōtl tlanechicōlli
        [math-expression] cē tlapōhualiztli tlahtōlli cualli
        [integer] cē tlacempōhualli
       *[number] cē tlapōhualli
    }.

variant-length-not-integer = ahmo huel momati in { $component } ītlamantli cehcentetl, ipampa length ahmo tlacempōhualli.

variant-sort-not-implemented = ayamo mochīhua in cē { $component } ītlamantli cehcentetl īca sort

variant-exclude-combinations-not-implemented = ayamo mochīhua in cē { $component } ītlamantli cehcentetl īca excludeCombinations

variant-math-exclude-not-implemented = ayamo mochīhua in cē { $component } tlamantli math ītlamantli cehcentetl īca exclude

variant-non-constant-exclude-not-implemented = ayamo mochīhua in cē { $component } ītlamantli cehcentetl īca exclude in ahmo mochipa neneuhqui

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ahmo mocui ipan in graph prefigure tlanēxtiāni; mocāhua in tlapiltzintli.

prefigure-descendant-invalid-geometry = { $subject }: in tlatamachīhualli ahmo tzonquīza ahnōzo ahmo cahci; mocāhua in tlapiltzintli.

prefigure-curve-label-omitted = { $subject }: in tōcāitl ahmo mocui ipan in tlīlcoltic ōmopatlac; mocāhua in tōcāitl.

prefigure-curve-unsupported-definition-type = { $subject }: in tlīlcoltic funsion ītlamelāhuacāyōtl tlamantli '{ $definitionType }' ahmo mocui; mocāhua in tlapiltzintli.

prefigure-region-flip-functions-unsupported = { $subject }: in flipFunctions tlamachiyōtīlli ahmo mocui ipan regionBetweenCurves; mocāhua in tlapiltzintli.

prefigure-region-non-formula-child = { $subject }: zan in funsion tlapiltzitzin tlamantli formula mocui ipan regionBetweenCurves; mocāhua in tlapiltzintli.

prefigure-label-position-unsupported =
    { $subject }: in labelPosition '{ $labelPosition }' ahmo mocui inic { $labelKind ->
        [line-family] cē tlīlnechicōlli tōcāitl
       *[point] cē tlīltzintli tōcāitl
    }; mocui in PreFigure ītlanepantlah achto.

prefigure-fill-style-unsupported = { $subject }: in PreFigure ahmo quicui in tlatēmītilli tlamantli '{ $fillStyle }'; mocuepa in tlatēmītilli cahci.

prefigure-line-style-unknown = { $subject }: in tlīlli tlamantli '{ $lineStyle }' in ahmo momati mocāhua ipan in PreFigure ītlaquīxtīl.

prefigure-marker-style-mapped-to-diamond = { $subject }: in machiyōtl tlamantli '{ $markerStyle }' ōmotlālih iuhqui in PreFigure tlamantli 'diamond'.

prefigure-marker-style-unsupported = { $subject }: in PreFigure ahmo quicui in machiyōtl tlamantli '{ $markerStyle }'; mocui in tlamantli achto.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ahmo cualli in `ref`; ahmo huel mottā in tlanōtzalōni. Mocāhua in tlahcuilōlnechicōlli.

annotation-ref-multiple-targets = `<annotation>`: in `ref` ōahcic miec tlanōtzalōni; mocui in achto.

annotation-ref-outside-graph = `<annotation>`: ahmo cualli in `ref`; in tlanōtzalōni pani cah in graph. Mocāhua in tlahcuilōlnechicōlli.

annotation-ref-unsupported-target = `<annotation>`: ahmo cualli in `ref`; in tlanōtzalōni ahmo tlaīxiptlayōtl in mocui ipan in prefigure ipatlaliztli. Mocāhua in tlahcuilōlnechicōlli.

annotation-text-missing = `<annotation>`: in `text` ahmo cah ahnōzo cactic; motlālia cē tlahcuilōlli cactic.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Ōmottac cē tlayāhualōlli tlanetechānaliztli.
       *[other] Ōmottac cē tlayāhualōlli tlanetechānaliztli īca cē `<{ $componentType }>`.
    }

reference-no-referent = Ahtlein ōmottac inic inin tlanōtzalli: `{ $reference }`

reference-multiple-referents = Miec ōmottac inic inin tlanōtzalli: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ahmo cualli in tlaneneuhcāyōtl inic in tlamachiyōtīlli { $attribute } ipan `<{ $componentType }>`.

children-invalid = Ahmo cualli tlapiltzitzin inic `<{ $componentType }>`: ōmottac tlapiltzitzin in ahmo cualli: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ahmo cualli in īpatiuh `{ $value }` inic in tlamachiyōtīlli `{ $attribute }`, mocui in īpatiuh `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Ahmo ōmottac in DoenetML tlamantli { $version }.
       *[other] Ahmo ōmottac in DoenetML tlamantli { $version }. Mocuepa in tlamantli { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML in ahmo cualli: { $content }

parse-tag-missing-close-tag = DoenetML in ahmo cualli: In tag `{ $tag }` ahmo quipiya tag in quitzacua. Monequi cē tag in mozacua ahnōzo cē `</{ $tagName }>` tag.

parse-tag-error = DoenetML in ahmo cualli: Tlahtlacōlli ipan in tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML in ahmo cualli: In tlamachiyōtīlli `{ $attribute }` in ahmo cualli ahmo quipiya īpatiuh.

parse-attribute-invalid = DoenetML in ahmo cualli: Ahmo cualli in tlamachiyōtīlli `{ $attribute }`

parse-attribute-value-invalid = DoenetML in ahmo cualli: Ahmo cualli in tlamachiyōtīlli īpatiuh `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML in ahmo cualli: Ahmo cualli in tlamachiyōtīlli īpatiuh `{ $value }`. In tlahtōlmachiyōtl ahmo neneuhqui. Ahmo cah cē `{ $quote }`

parse-open-tag-name-missing = DoenetML in ahmo cualli: Ōmottac cē tag in ahmo quipiya tōcāitl, iuhqui `<`

parse-tag-not-closed = DoenetML in ahmo cualli: In tag `{ $tag }` ahmo ōmotzacu (ahmo cah cē `>`).

parse-self-closing-tag-name-missing = DoenetML in ahmo cualli: Ōmottac cē tag in ahmo quipiya tōcāitl `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML in ahmo cualli: In tag `{ $tag }` ahmo ōmotzacu (ahmo cah `/>`).

parse-tag-invalid-attributes = DoenetML in ahmo cualli: In tag `{ $tag }` ahmo cualli. Ahzo quipiya tlamachiyōtīlli in ahmo cualli.

parse-close-tag-name-missing = DoenetML in ahmo cualli: Ōmottac cē tag in quitzacua in ahmo quipiya tōcāitl, iuhqui `</`

parse-attribute-value-unquoted = In tlamachiyōtīlli īpatiuh monequi cah ihtic tlahtōlmachiyōtl: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML in ahmo cualli: Ōmottac in tag in quitzacua `{ $tag }`, tel ahmo cah in tag in quitlapoa

parse-close-tag-mismatched = DoenetML in ahmo cualli: In tag in quitzacua ahmo neneuhqui. Monequiya `</{ $expected }>`. Ōmottac `{ $found }`

parser-node-unconvertible = Ahmo ōhuel mopatlac in node { $node } iuhqui Dast node.

## Names

name-attribute-invalid =
    Ahmo cualli in tlamachiyōtīlli name='{ $name }'. { $reason ->
        [characters] In tōcāitl zan huel quipiyaz tlahcuilōlmachiyōtl, tlapōhualli, tlahuīlteccāyōtl tlani ahnōzo tlahuīlteccāyōtl.
       *[start] In tōcāitl monequi pēhuaz īca cē tlahcuilōlmachiyōtl.
    }

component-name-invalid-start = Ahmo cualli in tlanechicōlli ītōcā "{ $name }". In tōcāitl monequi pēhuaz īca cē tlahcuilōlmachiyōtl.

## `<answer>` sugar

answer-video-watched-missing-video = Cē tlanānquilīlli tlamantli videoWatched monequi quipiyaz cē video tlamachiyōtīlli

answer-video-watched-video-not-reference = Cē tlanānquilīlli tlamantli videoWatched monequi quipiyaz cē video tlamachiyōtīlli in cē tlanōtzalli

answer-name-not-single-text = In tlanānquilīlli ītlamachiyōtīl name monequi quipiyaz zan cē tlahcuilōlli tlapiltzintli

## Referencing another document

external-doenetml-recursion-limit = Ahmo ōhuel mocuic in pani DoenetML, ipampa miequin tlacuepcāyōtl. ¿Ahzo cah cē tlayāhualōlli tlanōtzalli?

external-doenetml-unavailable = Ahmo ōhuel mocuic in DoenetML ōmpa { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML in ahmo cualli ōmocuic ōmpa { $attribute }="{ $uri }": ahmo ōneneuhqui īca in tlanechicōlli tlamantli "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] In tlamachiyōtīlli `{ $from }` ye ōmocāuh; xiccui `{ $to }`.
       *[other] [deprecation] In tlamachiyōtīlli `{ $from }` ipan `<{ $component }>` ye ōmocāuh; xiccui `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] In tlamachiyōtīlli `{ $from }` ye ōmocāuh īhuān ahmo mocui, ipampa `{ $to }` nō ōmotlālih.
       *[other] [deprecation] In tlamachiyōtīlli `{ $from }` ipan `<{ $component }>` ye ōmocāuh īhuān ahmo mocui, ipampa `{ $to }` nō ōmotlālih.
    }

deprecated-attribute-ignored = [deprecation] In tlamachiyōtīlli `{ $attribute }` ipan `<{ $component }>` ye ōmocāuh īhuān ahmo mocui.

deprecated-attribute-to-child = [deprecation] In tlamachiyōtīlli `{ $attribute }` ipan `<{ $component }>` ye ōmocāuh; xiccui cē `<{ $child }>` tlapiltzintli.

deprecated-attribute-value-renamed = [deprecation] In īpatiuh `{ $value }` in tlamachiyōtīlli `{ $attribute }` ipan `<{ $component }>` ye ōmocāuh; xiccui `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` zan huel quimiequilia in inglés tlahtōlli, ic ītlahcuilōl mocāhua iuh in ihcuāc in āmoxtli mohcuiloh ipan { $locale }. Xictlāli in miec tlamantli, ahnōzo xictlāli īca in `pluralForm` tlamachiyōtīlli.


## Checking against the schema

schema-element-unrecognized = In `<{ $tag }>` ahmo cē Doenet tlanechicōlli in momati.

schema-element-not-allowed-at-root = In `<{ $tag }>` ahmo mocāhua ipan in āmoxtli ītzintlān.

schema-element-not-allowed-inside = In `<{ $tag }>` ahmo mocāhua ihtic `<{ $parent }>`.

schema-attribute-unrecognized = In `<{ $tag }>` ahmo quipiya cē tlamachiyōtīlli in ītōcā `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] In tlamachiyōtīlli `{ $attribute }` ipan `<{ $tag }>` monequi cē tlapōhualli yez, in cehcen quipiya zan cē in īnīn: { $allowed }
       *[other] In tlamachiyōtīlli `{ $attribute }` ipan `<{ $tag }>` monequi zan cē yez in īnīn: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Ahmo cualli in tlamantli tōcāitl inic select.  In tlamantli tōcāitl { $variantName } cah ipan { $numOptions } tlapehpenalli tel in tlapōhualli in mopehpenaz { $numToSelect }.

select-variant-name-without-options = Cequi tlamantli ōmotlālih inic select tel ahtlein tlapehpenalli ōmotlālih inic inin tlamantli tōcāitl: { $variantName }.

select-variant-name-not-possible = In tlamantli tōcāitl { $variantName } in ōmotlālih inic select ahmo cē tlamantli tōcāitl in huelī.

select-too-few-options = Ahmo huel mopehpena { $numToSelect } tlanechicōlli ōmpa zan { $numOptions }.

select-from-sequence-too-few-values = Ahmo huel mopehpena { $numToSelect } īpatiuh ōmpa cē tlatehtectli in īhuēyaca { $length }.

select-from-sequence-indices-count-mismatch = In indices tlapōhualli in ōmotlālih inic select monequi neneuhqui yez īca in tlapōhualli in mopehpenaz

select-from-sequence-indices-not-integers = In mochi indices in ōmotlālih inic select monequi tlacempōhualli yez

select-from-sequence-index-excluded = In selectfromsequence ītlapōhual in ōmotlālih ōmocāuh

select-from-sequence-indices-excluded-combination = In selectfromsequence ītlapōhual in ōmotlālih ōcatca cē tlanechicōlli in ōmocāuh

select-from-sequence-coprime-not-positive-integers = Ahmo huel mopehpena coprime tlanechicōlli, ipampa ahmo mopehpena tlacempōhualli in ahmo tlatzintlān.

select-from-sequence-coprime-common-factor = Ahmo huel mopehpena coprime tlapōhualli. In mochi īpatiuh quipiya cē tlaneneuhcāyōtl. (In "from" ahnōzo "to" ōmotlālih monequi coprime yez īca "step".)

select-from-sequence-coprime-single-number = Ahmo huel mopehpena coprime tlanechicōlli ōmpa zan cē tlapōhualli in ahmo 1.

select-from-sequence-excluded-too-many-combinations = Occequi ihuān 70% in tlanechicōlli ōmocāuh ipan selectFromSequence

select-from-sequence-coprime-none-found = Ahmo ōhuel mopehpen coprime tlapōhualli. In mochi īpatiuh quipiya cē tlaneneuhcāyōtl.

select-from-sequence-too-few-unique-values = Ahmo huel mopehpena { $numToSelect } īpatiuh cehcentetl ōmpa cē tlatehtectli in īhuēyaca { $numPossibleValues }

select-prime-numbers-too-few-values = Ahmo huel mopehpena { $numToSelect } īpatiuh ōmpa cē primo tlapōhualli tlanechicōlli in īhuēyaca { $numValues }

select-prime-numbers-values-count-mismatch = In īpatiuh tlapōhualli in ōmotlālih inic select monequi neneuhqui yez īca in tlapōhualli in mopehpenaz

select-prime-numbers-values-not-prime = In mochi īpatiuh in ōmotlālih inic select primo tlapōhualli monequi cah ipan in primo tlapōhualli tlanechicōlli

select-prime-numbers-values-excluded-combination = In selectPrimeNumbers īpatiuh in ōmotlālih ōcatca cē tlanechicōlli in ōmocāuh

select-prime-numbers-excluded-too-many-combinations = Occequi ihuān 70% in tlanechicōlli ōmocāuh ipan selectPrimeNumbers

select-random-combination-fluke = Īca cē tlamantli in ahmo huelī, ahmo ōhuel mopehpen cē tlanechicōlli in īpatiuh tlaīxnēxtīlli

select-random-value-fluke = Īca cē tlamantli in ahmo huelī, ahmo ōhuel mopehpen cē īpatiuh tlaīxnēxtīlli
