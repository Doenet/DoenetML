# Bislama diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber`, `WCAG` — are part of the language, not
# prose, and stay in English exactly as written. So does anything quoted back
# from the author's own source, and so does the `[deprecation]` marker, which
# is a label rather than a word.
#
# **That line matters more in this catalog than in any other, and the usual
# check for it does not work here.** Bislama is the English-lexified creole of
# Vanuatu, so **its technical vocabulary is English-derived by nature**:
# «laen», «poen», «namba», «komponen», «atribiut» are Bislama words in Bislama
# sentences, not English left untranslated. Grepping this file for
# English-looking tokens would flag the language itself. What was checked
# instead:
#   1. every message carries the predicate marker «i» (or the plural «oli»)
#      where Bislama requires one — an untranslated English string never does;
#   2. every transitive verb carries the harmonizing suffix «-em»/«-im»/«-um»
#      («makem», «faenem», «putum», «klinim»), which an English verb never
#      does;
#   3. the function words are Bislama throughout — «blong», «long», «wetem»,
#      «mo», «we», «from we», «sipos», «be», «oli», «bambae»;
#   4. the identifiers that must stay English were diffed against the English
#      file rather than judged by eye, since here they are the one kind of
#      English token that is *supposed* to survive.
# A reviewer who wants a check that works: **read a message aloud.** «laen» is
# a translated word; `line` inside a tag name is not.
#
# The orthographic and Tok Pisin–comparison notes are in this locale's
# `chrome.ftl` header and are not repeated. The two grammatical points most
# likely to be got wrong by a corrector working from `locales/tpi`: Bislama has
# **no productive `-pela`**, and its transitive suffix is **`-em`/`-im`/`-um`
# by vowel harmony** rather than Tok Pisin's uniform `-im`.
#
# **Number.** A Bislama noun is not marked for it, so where English's two
# plural branches differ only in the noun this file writes one unselected form
# and drops the select. The count still arrives and is still formatted. Every
# *symbolic* selector — `$mode`, `$type`, `$reason`, `$context`, `$expected`,
# `$suggestion`, `$isList`, `$fallback`, `$component`, `$componentType`,
# `$labelKind`, `$alternative` — keeps all of English's branches with their
# keys copied letter for letter, because those keys are matched against values
# the core passes rather than read by anyone.
#
# **Two renderings are used throughout and are recorded here rather than
# repeated in a comment on every line.** "is ignored" is «oli lego» — the
# impersonal third-person plural, which is how Bislama says a thing was let go
# without naming who let it go — and "cannot" is «i no save». "Haven't
# implemented" is «Doenet i no mekem yet», which names Doenet rather than
# leaving an English passive with no subject, since Bislama has none.


## `<lineSegment>`

# No select: «oli lego» does not agree with what is ignored, and a Bislama noun
# carries no number of its own.
line-segment-attributes-ignored-with-endpoints = oli lego { $attributes } taem tufala endpoen oli makem finis
line-segment-attributes-ignored-with-endpoint-and-midpoint = oli lego { $attributes } taem wan endpoen mo wan medelpoen tufala i makem finis
line-segment-midpoint-offset-without-midpoint = midpointOffset i no gat wok sipos i no gat wan medelpoen

## `<line>`

line-points-undetermined-dimensions = Laen i go tru long ol poen we oli no save ol dimensen blong olgeta.
line-points-too-few-dimensions = Laen i mas go tru long ol poen we oli gat tu dimensen no moa.
line-points-depend-on-variables = Laen i go tru long ol poen we oli dipen long ol veriabol: { $variables }.
line-equation-invalid-format = Fomat blong ikwesen blong laen i no stret long ol veriabol { $variable1 } mo { $variable2 }.

## `<ray>`

ray-overprescribed-through = Re i kam long through, endpoint mo direction wanwan.  Oli lego through we oli makem.
ray-dimension-mismatch = numDimensions i no sem mak insaed long re.

## `<vector>`

vector-overprescribed-head = Vekta i kam long head, tail mo displacement wanwan.  Oli lego head we oli makem.
vector-dimension-mismatch = numDimensions i no sem mak insaed long vekta.

## Attracting and constraining

attract-to-without-nearest-point = I no save pulum i go long wan `<{ $component }>`, from we hem i no gat steit veriabol nearestPoint.
constrain-to-without-nearest-point = I no save fasem i go long wan `<{ $component }>`, from we hem i no gat steit veriabol nearestPoint.
constrain-to-interior-without-nearest-point = I no save fasem i go insaed long wan `<{ $component }>`, from we hem i no gat steit veriabol nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = oli lego labelPosition long wan choiceInput we i no inline

## Ordering children by index

choice-input-indices-count-mismatch = Oli lego ol indeks we oli makem long choiceInput, from we namba blong ol indeks i no sem mak wetem namba blong ol pikinini jois.
pretzel-indices-count-mismatch = Oli lego ol indeks we oli makem long problem, from we namba blong ol indeks i no sem mak wetem namba blong ol pikinini problem.
shuffle-indices-count-mismatch = Oli lego ol indeks we oli makem long shuffle, from we namba blong ol indeks i no sem mak wetem namba blong ol komponen.
indices-ignored-out-of-range = Oli lego ol indeks we oli makem long { $component }, from we sam indeks oli stap aotsaed long rej.
pretzel-indices-repeated = Oli lego ol indeks we oli makem long pretzel, from we sam indeks oli kamaot tu taem.
pretzel-circuit-first-index = Oli lego ol indeks we oli makem long pretzel long circuit mod, from we fas indeks i mas 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Blong `<{ $component }>` i save wok wetem ol pikinini string, yu mas makem wan atribiut `type`.
invalid-type-defaulting-to-math = Type { $type } i no stret long komponen { $component }. Hem i mas wan long math, text, number, no boolean. Bambae i tekem math.
string-not-valid-component-to-arrange = String "{ $value }" i no wan komponen we { $component } i save yusum. Oli lego hem.

## Types and variables

invalid-type-defaulting-to-number = Type { $type } i no stret, bambae i putum type i kam number.
invalid-variable-value = Valiu blong wan veriabol i no stret: `{ $value }`

## Variants

variant-index-must-be-number = Varian indeks { $index } i mas wan namba
variant-index-must-be-integer = Varian indeks { $index } i mas wan intija

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` i no wok wetem ol mesamen we oli absolut. Bambae i putum ol wit i kam relativ.
side-by-side-absolute-margins = `<{ $component }>` i no wok wetem ol mesamen we oli absolut. Bambae i putum ol majin i kam relativ.
side-by-side-no-block-child = `<{ $component }>` i no stret: hem i mas gat wan pikinini blok no moa.

## `<label>`

label-for-ignored-on-graphical = Oli lego atribiut `for` long wan `<label>` we i stap long graf.
label-for-must-resolve-to-one = Atribiut `for` long `<label>` i mas poentem wan komponen nomo.
label-for-unresolved = Atribiut `for` long `<label>` i no save poentem wan komponen.
label-for-answer-with-authored-inputs = Atribiut `for` long `<label>` i poentem wan `<answer>` we raeta i putum ol input blong hem finis; poentem input ya stret.
label-for-answer-without-input = Atribiut `for` long `<label>` i poentem wan `<answer>` we i no gat input blong putum lebol long hem.
label-for-must-reference-input-or-answer = Atribiut `for` long `<label>` i mas poentem wan input no wan answer.

## Accessibility

accessibility-short-description-or-decorative = Blong akses, `<{ $component }>` i mas gat wan sotfala deskripsen, no yu mas makem hem olsem decorative.
accessibility-video-short-description = Blong akses, `<video>` i mas gat wan sotfala deskripsen.
accessibility-input-short-description-or-label = Blong akses, `<{ $component }>` i mas gat wan sotfala deskripsen no wan lebol.
accessibility-answer-input-short-description-or-label = Blong akses, wan `<answer>` we i wokem wan input i mas gat wan sotfala deskripsen no wan lebol.
accessibility-short-description-contains-math = Ol sotfala deskripsen oli no mas gat ol komponen blong matematik olsem `<{ $component }>`. Raetem matematik ya wetem ol wod.
accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } i no gat naf kontras blong tekis blong hed blong seksen (dak mod) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; hem i mas kasem { $threshold }:1 no moa).
       *[other] { $colorName } i no gat naf kontras blong tekis blong hed blong seksen ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; hem i mas kasem { $threshold }:1 no moa).
    }

## `<circle>`

circle-through-points-non-numerical = Doenet i no mekem yet wan `<circle>` we i go tru long { $count } poen taem ol poen ya oli no gat valiu we i wan namba.
circle-too-many-through-points = I no save wokemaot wan sekel we i go tru long moa long 3 poen.
circle-overprescribed-radius-center-points = I no save wokemaot wan sekel wetem redias, senta mo ol poen blong go tru long olgeta wanwan.
circle-center-with-multiple-points = I no save wokemaot wan sekel wetem wan senta we i go tru long moa long 1 poen.
circle-radius-too-small = I no save wokemaot sekel: from we distens bitwin tufala poen i { $distance }, redias { $radius } we oli makem i smol tumas.
circle-radius-with-many-points = I no save wokem wan sekel we i go tru long moa long tu poen wetem wan redias we oli makem.
circle-invalid-center-or-through-points = Senta no ol poen blong go tru long olgeta blong sekel i no stret.
circle-radius-center-with-multiple-points = I no save wokemaot redias blong wan sekel wetem wan senta we i go tru long moa long 1 poen.
circle-change-radius-non-numerical = I no save jenisim redias blong wan sekel we ol poen blong hem oli no gat valiu we i wan namba
circle-radius-with-points-non-numerical = I no save wokem wan sekel we i go tru long moa long wan poen wetem wan redias we oli makem, taem i no gat valiu we i wan namba.
circle-change-center-non-numerical = Doenet i no mekem yet fasin blong jenisim senta blong wan sekel we i go tru long ol poen we oli no gat valiu we i wan namba.

## `<function>`

# No select on either count: a Bislama noun is not marked for number, so
# «intaval» and «input» are the same words for one and for many.
function-domain-insufficient-dimensions = I no gat naf dimensen long domen blong fanksen. Domen i gat { $intervals } intaval be fanksen i gat { $inputs } input.
function-domain-invalid-format = Fomat blong domen blong fanksen i no stret.
function-ignoring-non-numerical =
    { $type ->
        [maximum] Oli lego maksimum blong fanksen we i no wan namba.
        [minimum] Oli lego minimum blong fanksen we i no wan namba.
        [extremum] Oli lego ekstremum blong fanksen we i no wan namba.
        [point] Oli lego poen blong fanksen we i no wan namba.
        [slope] Oli lego slop blong fanksen we i no wan namba.
       *[other] Oli lego { $type } blong fanksen we i no wan namba.
    }
function-ignoring-empty =
    { $type ->
        [maximum] Oli lego maksimum blong fanksen we i emti.
        [minimum] Oli lego minimum blong fanksen we i emti.
        [extremum] Oli lego ekstremum blong fanksen we i emti.
        [point] Oli lego poen blong fanksen we i emti.
       *[other] Oli lego { $type } blong fanksen we i emti.
    }
function-points-too-close = Fanksen i gat tufala poen we tufala i stap klosap tumas long olgeta. I no save makem fanksen.
function-iterates-input-output-mismatch = Ol iterat blong wan fanksen oli save kamaot nomo sipos namba blong ol input blong fanksen i sem mak wetem namba blong ol aotput. Fanksen ya i gat { $inputs } input mo { $outputs } aotput.

## `<sequence>`

sequence-invalid-length = Lent blong sikwens i no stret.  Hem i mas wan intija we i no aninit long zero.
sequence-invalid-step = Step blong sikwens i no stret.  Hem i mas wan namba long wan sikwens blong type { $type }.
sequence-invalid-endpoint-number = "{ $attribute }" blong wan sikwens blong namba i no stret.  Hem i mas wan namba.
sequence-invalid-endpoint-letters = "{ $attribute }" blong wan sikwens blong leta i no stret.  Hem i mas wan grup blong ol leta.
sequence-invalid-endpoint = "{ $attribute }" blong sikwens i no stret.
select-from-sequence-coprime-not-numbers = oli lego coprime from we i no stap jusum ol namba
select-from-sequence-coprime-with-exclude-combinations = oli lego coprime from we oli makem excludeCombinations

## Resolving a `target`

target-not-found = Taget blong `<{ $source }>` i no stret: i no save faenem taget.
target-state-variable-not-found = Taget blong `<{ $source }>` i no stret: i no save faenem wan steit veriabol we nem blong hem i "{ $property }" long wan `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Ol veriabol blong `<odeSystem>` oli mas defren long veriabol we i stanap hem wan.
ode-system-duplicate-variable-names = I no save makem ol fanksen RHS blong ODE we ol nem blong ol dipenden veriabol oli kamaot tu taem.
ode-system-rhs-function-error = I no save makem fanksen RHS blong ODE.  I gat mastik long taem blong wokem fanksen mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = I no save makem wan engel bitwin long { $count } laen
angle-invalid-through-point = Poen insaed long through blong `<angle>` i no stret
parabola-vertex-too-many-points = Doenet i no mekem yet wan parabola wetem wan vekis we i go tru long moa long 1 poen.
parabola-too-many-points = Doenet i no mekem yet wan parabola we i go tru long moa long 3 poen.
intersection-too-many-items = Doenet i no mekem yet wan intaseksen blong moa long tu samting

## Other math components

ionic-compound-not-two-ions = Doenet i no mekem yet wan aionik kompaon we i no gat tu aion.
ionic-compound-needs-cation-and-anion = Aionik kompaon i wok nomo wetem wan katfaen mo wan anaion.
solve-equations-cannot-evaluate = I no save solvem ikwesen, from we i no save wokemaot ikwesen ya: { $equation }
math-operators-operand-number-required = Yu mas makem wan operandNumber taem yu tekemaot wan operan blong matematik.
eigen-decomposition-failed = I no save wokemaot ol aigenvaliu blong metriks

## `<matchesPattern>`

# No select: «paramita» is the same word for one and for many.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: paramita { $parameters } i no kamaot insaed long paten ya, taswe bambae hem i sem mak wetem wan emti spes oltaem.

## `<graph>`

graph-grid-invalid = `<graph>`: i no save ridim grid="{ $grid }". Hem i mas none, medium, dense, no tu namba we oli antap long zero mo wan spes i stap bitwin long tufala, olsem grid="1 0.5". I no draoem wan gred.

## `<slopeField>` and `<vectorField>`

# The `$expected` fork is not about number: one output is a slope and two are a
# vector, and the two branches name two different things. It stays. The
# `$found` count does not fork, for the reason in the header.
field-function-wrong-num-outputs =
    `<{ $component }>` i nidim wan fanksen we i gat { $expected ->
        [one] wan aotput, hemia slop y' long evri poen, olsem `y - x`
       *[other] tu aotput, hemia vekta long evri poen, olsem `(y, -x)`
    }, be fanksen we oli givim long hem i gat { $found } aotput. { $alternative ->
        [none] I no draoem wan samting.
       *[other] `<{ $alternative }>` i komponen blong fanksen ya. I no draoem wan samting.
    }
field-function-attribute-ignored-with-child = Oli lego atribiut `function` from we fanksen ya i stap insaed long komponen tu; bambae i yusum wan we i stap insaed. Givim fanksen ya long wan rod nomo.
field-variables-ignored =
    `<{ $component }>`: atribiut `variables` i nemem ol veriabol blong wan ekspresen we oli raetem stret insaed long komponen. { $reason ->
        [function-child] Fanksen ya i kam olsem wan pikinini `<function>`, we i nemem ol veriabol blong hem wan, taswe oli lego `variables`.
       *[no-expression] I no gat wan ekspresen olsem long ples ya, taswe oli lego `variables`.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" i no wok insaed long prefigure renderer; bambae i mekem olsem right-position.
prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" i no wok insaed long prefigure renderer; bambae i mekem olsem top-position.
prefigure-invalid-axis-bounds = `<graph>`: ol mak blong akses oli no stret blong jenisim i go long prefigure; bambae i yusum difolt bbox (-10,-10,10,10).
prefigure-invalid-width = `<graph>`: wit i no stret blong jenisim i go long prefigure; bambae i yusum difolt wit blong daeagram, 425.
prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio i no stret blong jenisim i go long prefigure; bambae i yusum difolt aspek resio 1.
prefigure-grid-spacing-too-fine = `<graph>`: ol laen blong gred oli stap klosap tumas long ol mak blong akses; bambae prefigure renderer i lego gred ya.
prefigure-annotations-not-rendered = `<graph>`: bambae i no draoem ol anoteson sipos i no yusum PreFigure renderer.
multiple-annotations-children = I gat plante pikinini `<annotations>` insaed long `<graph>`; oli lego olgeta, i gat las wan nomo i stap.

## Referring to other components

copy-unrecognized-component-type = I no save ekstendem no kopi wan kaen komponen we hem i no save hem: { $type }.
copy-prop-not-found = I no save faenem prop { $property } long wan komponen blong kaen { $component }
collect-no-source = I no faenem wan sos blong collect.
collect-invalid-component-type = I no save kolektem ol komponen blong kaen `<{ $component }>` from we hemia i no wan kaen komponen we i stret.
reference-index-unavailable = I no save poentem indeks `{ $reference }`

## `<callAction>`

component-action-unavailable = I no save singaotem { $action } long komponen `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Sep blong daeta i no stret.  Ol laen oli gat ol lent we oli defren. Oli faenem long componentIdx :{ $componentIdx }
data-frame-duplicate-column-names = Daeta i gat ol nem blong kolam we oli kamaot tu taem.  Oli faenem long componentIdx :{ $componentIdx }
data-frame-missing-column-name = Wan nem blong kolam i lus long daeta.  Oli faenem long componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Wan award blong ansa ya i stanap long respons we ansa tag ya hem wan i sanem, mo bambae hemia i mekem sam samting we yu no stap wetem.
answer-max-num-attempts-in-section-wide-check-work = Sipos yu putum `maxNumAttempts` long wan `<answer>` we i stap insaed long wan kontena wetem `sectionWideCheckWork`, hemia i no gat wok, from we kontena ya i bos long namba blong ol traem. Putum `maxNumAttempts` long kontena ya.
nested-section-wide-check-work-max-num-attempts = Sipos yu putum `maxNumAttempts` long wan kontena wetem `sectionWideCheckWork` we i stap insaed long wan narafala kontena wetem `sectionWideCheckWork`, hemia i no gat wok, from we kontena we i stap aotsaed i bos long namba blong ol traem. Putum `maxNumAttempts` long kontena we i stap aotsaed.
# No select: «atribiut» is the same word for one and for many.
answer-attributes-need-symbolic-equality = Atribiut { $attributes } bambae i no gat wok sipos symbolicEquality i no stap.
answer-invalid-type = Type blong ansa i no stret: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = From we komponen `<{ $component }>` i no gat wan nem, hem i no save wok olsem wan atribiut blong wan module
module-attribute-name-already-defined = Komponen `<{ $component } name="{ $name }">` i no save wok olsem wan atribiut blong wan module, from we kaen komponen `<module>` i gat wan atribiut "{ $name }" finis.
conditional-content-condition-ignored = Oli lego atribiut `condition` long wan komponen `<conditionalContent>` we i gat ol pikinini case no else.
slider-markers-type-mismatch = Type blong ol maka i no sem mak wetem type blong slaeda.
pretzel-problem-needs-statement-and-answer = Pretzel i no stret: evri `<problem>` i mas gat wan `<statement>` mo wan `<answer>`.
pretzel-circuit-first-problem-distractor = Pretzel i no stret: long mode="circuit", fas `<problem>` i no save wan distracta.

## Attribute values

# No select: «valiu» is the same word for one and for many.
attribute-invalid-values = Valiu { $values } blong atribiut `{ $attribute }` i no stret; oli lego hem.
attribute-must-be-references = Valiu `{ $value }` blong atribiut `{ $attribute }` i no stret. Atribiut i mas kam long ol refrens we oli stat wetem wan `$`.
math-input-invalid-function-names = <mathInput>: oli lego ol nem blong fanksen we oli no stret insaed long { $attribute }: { $names }. Evri nem i mas gat tu leta no moa long haf we i soemaot (ol leta no ol dash); wan `|<mathspeak alternative>` i save kam biaen, be hemia i no fosem.

## Building components from the source

component-type-invalid = Kaen komponen i no stret: `<{ $componentType }>`
attribute-repeated = I no save putum atribiut { $attribute } tu taem.
attribute-invalid-for-component = Atribiut "{ $attribute }" i no stret long wan komponen blong kaen `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Stael difinisen { $styleNumber } i no gat naf kontras long { $context ->
        [text-on-background] kala blong tekis agensem kala blong baksaed
        [high-contrast] kala blong bigfala kontras agensem kanvas
        [line] kala blong laen agensem kanvas
        [marker] kala blong maka agensem kanvas
       *[text-on-canvas] kala blong tekis agensem kanvas
    }{ $mode ->
        [dark] { " (dak mod)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; hem i mas kasem { $threshold }:1 no moa).
style-definition-dark-mode-text-background-contrast =
    Nating we stael difinisen { $styleNumber } i gat ol kala we oli givim naf kontras long laet mod, ol kala blong dak mod we oli kamaot long ol valiu ya oli no gat naf kontras blong kala blong tekis agensem kala blong baksaed ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; hem i mas kasem { $threshold }:1 no moa). { $suggestion ->
        [available] Blong mekem se i gat naf kontras long dak mod, yu save leftemap kontras blong laet mod (olsem, putum { $lightAttribute }="{ $lightColor }"), no yu save jenisim kala blong dak mod (olsem, putum { $darkAttribute }="{ $darkColor }").
       *[none] Blong mekem se i gat naf kontras long dak mod, leftemap kontras blong laet mod, no jenisim ol kala we oli kamaot, wetem textColorDarkMode mo/no backgroundColorDarkMode.
    }
style-definition-dark-mode-text-canvas-contrast =
    Nating we stael difinisen { $styleNumber } i gat wan kala blong tekis we i givim naf kontras long laet mod, kala blong tekis blong dak mod we i kamaot long valiu ya i no gat naf kontras agensem kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; hem i mas kasem { $threshold }:1 no moa). { $suggestion ->
        [available] Blong mekem se i gat naf kontras long dak mod, yu save leftemap kontras blong laet mod (olsem, putum textColor="{ $lightColor }"), no yu save jenisim kala blong dak mod (olsem, putum textColorDarkMode="{ $darkColor }").
       *[none] Blong mekem se i gat naf kontras long dak mod, leftemap kontras blong laet mod, no jenisim kala we i kamaot, wetem textColorDarkMode.
    }
section-multiple-style-palettes = Wan seksen i save jusum wan <stylePalette> nomo; bambae i yusum las wan.

## Unique variants

variant-num-to-select-not-non-negative-integer = i no save save ol varian blong { $component } we oli defren, from we numToSelect i no wan intija we i no aninit long zero.
variant-num-to-select-not-constant-number = i no save save ol varian blong { $component } we oli defren, from we numToSelect i no wan namba we i no jenis.
variant-with-replacement-not-constant-boolean = i no save save ol varian blong { $component } we oli defren, from we withReplacement i no wan boolean we i no jenis.
variant-select-weight-disables-unique = Ol varian blong select we oli defren oli no save wok sipos wan opsen i gat selectWeight no selectForVariants
variant-coprime-undetermined = i no save save ol varian blong { $component } we oli defren, from we i no save sipos coprime i giaman oltaem.
variant-attribute-not-constant = i no save save ol varian blong { $component } we oli defren, from we { $attribute } i jenis.
variant-attribute-not-number = i no save save ol varian blong { $component } we oli defren, from we { $attribute } i no wan namba.
variant-attribute-wrong-type-for-sequence =
    i no save save ol varian blong { $component } blong { $type } type we oli defren, from we { $attribute } i no { $expected ->
        [letters-combination] wan grup blong ol leta
        [math-expression] wan ekspresen blong matematik we i stret
        [integer] wan intija
       *[number] wan namba
    }.
variant-length-not-integer = i no save save ol varian blong { $component } we oli defren, from we length i no wan intija.
variant-sort-not-implemented = Doenet i no mekem yet ol varian we oli defren blong wan { $component } wetem sort
variant-exclude-combinations-not-implemented = Doenet i no mekem yet ol varian we oli defren blong wan { $component } wetem excludeCombinations
variant-math-exclude-not-implemented = Doenet i no mekem yet ol varian we oli defren blong wan { $component } blong type math wetem exclude
variant-non-constant-exclude-not-implemented = Doenet i no mekem yet ol varian we oli defren blong wan { $component } wetem wan exclude we i jenis

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: hem i no wok insaed long graf prefigure renderer; oli kalapem pikinini ya.
prefigure-descendant-invalid-geometry = { $subject }: jiometri i no finis no i no gat en; oli kalapem pikinini ya.
prefigure-curve-label-omitted = { $subject }: ol lebol oli no wok long ol elemen kurv we oli jenisim; oli lego lebol ya.
prefigure-curve-unsupported-definition-type = { $subject }: kaen difinisen blong fanksen kurv '{ $definitionType }' i no wok; oli kalapem pikinini ya.
prefigure-region-flip-functions-unsupported = { $subject }: atribiut flipFunctions long regionBetweenCurves i no wok; oli kalapem pikinini ya.
prefigure-region-non-formula-child = { $subject }: ol pikinini fanksen blong kaen formula nomo oli wok long regionBetweenCurves; oli kalapem pikinini ya.
prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' i no wok long { $labelKind ->
        [line-family] wan lebol blong famle blong laen
       *[point] wan lebol blong poen
    }; bambae i yusum difolt alaenmen blong PreFigure.
prefigure-fill-style-unsupported = { $subject }: PreFigure i no save fil stael '{ $fillStyle }'; bambae i yusum wan fil we i fulap gud.
prefigure-line-style-unknown = { $subject }: oli lego laen stael '{ $lineStyle }' we oli no save hem, i no go long aotput blong PreFigure.
prefigure-marker-style-mapped-to-diamond = { $subject }: maka stael '{ $markerStyle }' i go long stael 'diamond' blong PreFigure.
prefigure-marker-style-unsupported = { $subject }: PreFigure i no save maka stael '{ $markerStyle }'; bambae i yusum difolt stael.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` i no stret; i no save faenem taget. Oli lego anoteson ya.
annotation-ref-multiple-targets = `<annotation>`: `ref` i poentem plante taget; bambae i yusum fas taget.
annotation-ref-outside-graph = `<annotation>`: `ref` i no stret; taget i stap aotsaed long graf we i holem hem. Oli lego anoteson ya.
annotation-ref-unsupported-target = `<annotation>`: `ref` i no stret; taget i no wan grafikol samting we prefigure i save jenisim. Oli lego anoteson ya.
annotation-text-missing = `<annotation>`: `text` i lus no i emti; bambae i putum wan tekis we i emti.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Oli faenem wan raon dipendensi.
       *[other] Oli faenem wan raon dipendensi we i tajem komponen `<{ $componentType }>`.
    }
reference-no-referent = I no faenem wan samting we refrens ya i poentem: `{ $reference }`
reference-multiple-referents = Oli faenem plante samting we refrens ya i poentem: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Fomat blong atribiut { $attribute } blong `<{ $componentType }>` i no stret.
children-invalid = Ol pikinini blong `<{ $componentType }>` oli no stret: Oli faenem ol pikinini we oli no stret: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valiu `{ $value }` blong atribiut `{ $attribute }` i no stret, bambae i yusum valiu `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] I no faenem DoenetML vesen { $version }.
       *[other] I no faenem DoenetML vesen { $version }. Bambae i yusum vesen { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML i no stret: { $content }
parse-tag-missing-close-tag = DoenetML i no stret: Tag `{ $tag }` i no gat wan tag blong klosem hem. Yu mas gat wan tag we i klosem hem wan, no wan tag `</{ $tagName }>`.
parse-tag-error = DoenetML i no stret: I gat wan mastik long tag `<{ $tagName }>`
parse-attribute-missing-value = DoenetML i no stret: I luk olsem atribiut `{ $attribute }` we i no stret i no gat wan valiu.
parse-attribute-invalid = DoenetML i no stret: Atribiut `{ $attribute }` i no stret
parse-attribute-value-invalid = DoenetML i no stret: Valiu blong atribiut `{ $value }` i no stret
parse-attribute-value-quote-mismatch = DoenetML i no stret: Valiu blong atribiut `{ $value }` i no stret. Tufala kwot mak i no sem mak. I luk olsem wan `{ $quote }` i lus
parse-open-tag-name-missing = DoenetML i no stret: Oli faenem wan tag we i no gat nem blong tag, olsem `<`
parse-tag-not-closed = DoenetML i no stret: Tag `{ $tag }` i no klos (i luk olsem wan `>` i lus).
parse-self-closing-tag-name-missing = DoenetML i no stret: Oli faenem wan tag we i no gat nem blong tag `<{ $content }>`
parse-self-closing-tag-not-closed = DoenetML i no stret: Tag `{ $tag }` i no klos (i luk olsem `/>` i lus).
parse-tag-invalid-attributes = DoenetML i no stret: Tag `{ $tag }` i no stret. Ating ol atribiut blong hem oli no stret.
parse-close-tag-name-missing = DoenetML i no stret: Oli faenem wan tag blong klosem we i no gat nem blong tag, olsem `</`
parse-attribute-value-unquoted = Ol valiu blong atribiut oli mas stap insaed long ol kwot mak: `{ $attribute }="{ $value }"`
parse-close-tag-without-open-tag = DoenetML i no stret: Oli faenem tag blong klosem `{ $tag }`, be i no gat tag blong openem we i go wetem hem
parse-close-tag-mismatched = DoenetML i no stret: Tag blong klosem i no sem mak. I mas gat `</{ $expected }>`. Oli faenem `{ $found }`
parser-node-unconvertible = I no save jenisim nod { $node } i go long wan Dast nod.

## Names

name-attribute-invalid =
    Atribiut name='{ $name }' i no stret. { $reason ->
        [characters] Ol nem oli save gat ol leta, ol namba, ol andaskoa no ol haefen nomo.
       *[start] Ol nem oli mas stat wetem wan leta.
    }
component-name-invalid-start = Nem blong komponen "{ $name }" i no stret. Ol nem oli mas stat wetem wan leta.

## `<answer>` sugar

answer-video-watched-missing-video = Wan ansa blong type videoWatched i mas gat wan atribiut video
answer-video-watched-video-not-reference = Wan ansa blong type videoWatched i mas gat wan atribiut video we hem i wan refrens
answer-name-not-single-text = Atribiut name blong ansa i mas gat wan pikinini text nomo

## Referencing another document

external-doenetml-recursion-limit = I no save kasem DoenetML we i stap aotsaed, from we i gat tumas level blong rikashen. Ating i gat wan refrens we i go raon?
external-doenetml-unavailable = I no save kasem DoenetML long { $attribute }="{ $uri }"
external-doenetml-type-mismatch = DoenetML we i kam long { $attribute }="{ $uri }" i no stret: hem i no sem mak wetem kaen komponen "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribiut `{ $from }` i olfala finis; yusum `{ $to }` long ples blong hem.
       *[other] [deprecation] Atribiut `{ $from }` long `<{ $component }>` i olfala finis; yusum `{ $to }` long ples blong hem.
    }
deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribiut `{ $from }` i olfala finis mo oli lego hem, from we `{ $to }` i stap tu.
       *[other] [deprecation] Atribiut `{ $from }` long `<{ $component }>` i olfala finis mo oli lego hem, from we `{ $to }` i stap tu.
    }
deprecated-attribute-ignored = [deprecation] Atribiut `{ $attribute }` long `<{ $component }>` i olfala finis mo oli lego hem.
deprecated-attribute-to-child = [deprecation] Atribiut `{ $attribute }` long `<{ $component }>` i olfala finis; yusum wan pikinini `<{ $child }>` long ples blong hem.
deprecated-attribute-value-renamed = [deprecation] Valiu `{ $value }` blong atribiut `{ $attribute }` long `<{ $component }>` i olfala finis; yusum `{ $to }` long ples blong hem.


## Language coverage

pluralize-english-only = `<pluralize>` i save mekem plural long Inglis nomo, taswe tekis blong hem i stap olsem long wan dokiumen we oli raetem long { $locale }. Raetem fom blong plural stret, no putum hem wetem atribiut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elemen `<{ $tag }>` i no wan Doenet elemen we hem i save.
schema-element-not-allowed-at-root = Elemen `<{ $tag }>` i no save stap long rus blong dokiumen.
schema-element-not-allowed-inside = Elemen `<{ $tag }>` i no save stap insaed long `<{ $parent }>`.
schema-attribute-unrecognized = Elemen `<{ $tag }>` i no gat wan atribiut we nem blong hem i `{ $attribute }`.
schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribiut `{ $attribute }` blong elemen `<{ $tag }>` i mas wan lis we evri aetem blong hem i wan long: { $allowed }
       *[other] Atribiut `{ $attribute }` blong elemen `<{ $tag }>` i mas wan long: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nem blong varian blong select i no stret.  Nem blong varian { $variantName } i kamaot long { $numOptions } opsen be namba blong jusum i { $numToSelect }.
select-variant-name-without-options = Oli makem sam varian blong select be i no gat opsen long nem blong varian we i save kamaot: { $variantName }.
select-variant-name-not-possible = Nem blong varian { $variantName } we oli makem long select i no save kamaot olsem wan nem blong varian.
select-too-few-options = I no save jusum { $numToSelect } komponen long { $numOptions } nomo.
select-from-sequence-too-few-values = I no save jusum { $numToSelect } valiu long wan sikwens we lent blong hem i { $length }.
select-from-sequence-indices-count-mismatch = Namba blong ol indeks we oli makem long select i mas sem mak wetem namba blong jusum
select-from-sequence-indices-not-integers = Evri indeks we oli makem long select i mas wan intija
select-from-sequence-index-excluded = Oli makem wan indeks blong selectfromsequence we i stap aotsaed
select-from-sequence-indices-excluded-combination = Oli makem ol indeks blong selectfromsequence we oli wan kombineson we i stap aotsaed
select-from-sequence-coprime-not-positive-integers = I no save jusum ol kombineson coprime, from we i no stap jusum ol intija we oli antap long zero.
select-from-sequence-coprime-common-factor = I no save jusum ol namba coprime. Evri valiu we i save kamaot i gat wan sem fakta. (Ol valiu we oli makem long "from" no "to" oli mas coprime wetem "step".)
select-from-sequence-coprime-single-number = I no save jusum ol kombineson coprime long wan namba nomo we hem i no 1.
select-from-sequence-excluded-too-many-combinations = Oli tekemaot moa long 70% blong ol kombineson insaed long selectFromSequence
select-from-sequence-coprime-none-found = I no save jusum ol namba coprime. Evri valiu we i save kamaot i gat wan sem fakta.
select-from-sequence-too-few-unique-values = I no save jusum { $numToSelect } valiu we oli defren long wan sikwens we lent blong hem i { $numPossibleValues }
select-prime-numbers-too-few-values = I no save jusum { $numToSelect } valiu long wan lis blong ol praem namba we lent blong hem i { $numValues }
select-prime-numbers-values-count-mismatch = Namba blong ol valiu we oli makem long select i mas sem mak wetem namba blong jusum
select-prime-numbers-values-not-prime = Evri valiu we oli makem long select praem namba i mas stap insaed long lis blong ol praem namba
select-prime-numbers-values-excluded-combination = Ol valiu we oli makem long selectPrimeNumbers oli wan kombineson we i stap aotsaed
select-prime-numbers-excluded-too-many-combinations = Oli tekemaot moa long 70% blong ol kombineson insaed long selectPrimeNumbers
select-random-combination-fluke = Long wan janis we i had tumas blong kamaot, i no save jusum wan kombineson blong ol randem valiu
select-random-value-fluke = Long wan janis we i had tumas blong kamaot, i no save jusum wan randem valiu

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    I no draoem `<{ $component }>` insaed long matematik ya; oli setem ekspresen ya olsem bifo we ol input oli save go insaed. { $reason ->
        [not-inline] Wan `inline` jois input nomo i save fitim insaed long wan ekspresen; sipos `inline` i no stap, hem i wan blok blong ol baten.
        [expanded] Wan `expanded` tekis input i wan bokis we i gat plante laen, mo hem i bigfala tumas blong stap insaed long wan ekspresen.
        [on-graph] Long wan graf, oli draoem ekspresen ya olsem wan piksa nomo, mo i no gat rum blong wan kontrol.
       *[relative-width] `width` blong hem i relativ (wan pesen no `em`), mo i no gat wan samting blong mesarem hem agensem insaed long wan ekspresen. Givim wit ya long ol absolut yunit, olsem `px`.
    }
