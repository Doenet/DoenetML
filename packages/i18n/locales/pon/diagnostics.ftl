# Pohnpeian diagnostics: the errors and warnings the worker raises and the
# reader or author sees. Selected by `uiLocale`. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# ORTHOGRAPHY. Standard Pohnpeian spelling, as in the other three files. The
# digraphs `ng`, `oa`, `mw` and `pw` are single letters and are never broken
# up; a following `h` marks a long vowel («mehlel», «pwuhk», «kohdi») and is
# not a consonant. The letters `b`, `c`, `f`, `g`, `j`, `q`, `v`, `x` and `z`
# are not Pohnpeian, so every loan is respelled — «nempe», «wariapel»,
# «dimensin», «ekweising», «matriks», «kanwas», «krid», «wersin», «skima»,
# «lis», «sikwens», «interwal», «praim». A `b` or an `f` in a Pohnpeian word
# here is a bug, not a variant.
#
# REGISTER. Common, non-honorific speech throughout, as in `chrome.ftl`,
# `content.ftl` and `editor.ftl`. Pohnpeian's *meing* vocabulary is for address
# between a speaker and a title-holder; a warning shown to a student is not
# that, and nothing here should be raised into the honorific register.
#
# NO GENDER, NO `$role`. Pohnpeian marks neither, and nothing in this file
# forks on either.
#
# NUMBER. Pohnpeian does not mark a noun for number, and
# `Intl.PluralRules("pon")` has no CLDR data of its own — it resolves against
# the runtime's default locale — so no message here writes a `[two]`, `[few]`
# or `[many]` branch. Where English's two branches differ only in the number of
# a noun, this file writes **one unselected form**: the count still arrives and
# is still formatted, and only the branching is gone. That is `locales/sm`'s
# answer and the answer the sibling Micronesian catalogs of this batch — `mh`,
# `chk`, `kos` and `gil` — take as well. `one` and `*[other]` are kept
# only where the two English branches differ in something else besides the
# noun's number, so that no branch goes missing.
#
# THE CLASSIFIER THAT CANNOT BE WRITTEN. Pohnpeian counts with numeral
# classifiers fused into the numeral itself — «ehu», «riau», «siluh» general;
# «apwoat» for long things; «apali» for sides. A count that arrives as
# `{ $count }` is a placeable, so there is no numeral for a classifier to fuse
# with and the catalog cannot supply one. Every counted message below leaves
# the numeral bare, which is what Pohnpeian writing does with digits. This is
# the "an affix cannot be welded to a placeable" rule reached through a
# classifier rather than through a case ending, and it is recorded rather than
# hidden. See `chrome.ftl`'s header.
#
# WORD ORDER. Pohnpeian is verb-medial and head-initial, so a describing word
# follows its noun («lain weitahta») and these sentences keep close to the
# English clause order: the object follows its verb, and «pwehki» ("because")
# opens its clause where English writes "as" or "because". No message here had
# to be turned around the way the clause-final catalogs of the Uralic batch
# did.
#
# WHAT STAYS IN ENGLISH. Every DoenetML identifier — tag names, attribute
# names such as `through`, `endpoint`, `midpointOffset`, `numDimensions`,
# `sectionWideCheckWork`, and attribute *values* such as `math`, `text`,
# `none`, `medium`, `dense` — is part of the language rather than prose and is
# left exactly as written, together with the backticks and angle brackets
# around it. So are `WCAG AA`, `DoenetML`, `XML`, `PreFigure`, `prefigure`,
# `Dast` and the `[deprecation]` marker, which is a literal tag and not a word.
#
# THE FRAME VOCABULARY, and the first thing a reviewer should check, because
# one word here is repeated a hundred times and correcting it is one
# search-and-replace each:
#
#   «sapwung»            invalid, wrong, error
#   «sohte kak wiahda»   cannot calculate / cannot define / cannot create —
#                        one Pohnpeian phrase for three English verbs, because
#                        this seed could not establish three separate words
#   «Saikinte wiawihda»  "has not yet been done" — English "haven't
#                        implemented"
#   «Sohte doadoahngki»  "not making use of it" — English "ignoring"
#   «sohte katepe»       "it has no worth" — English "has no effect"
#   «uhdahn pahn»        must
#   «anahne»             needs, requires
#   «pwehki»             because, as
#   «sohte diarek»       not found
#   «pahrek»             matching, equal
#   «uwe»                value          «irair»    attribute
#   «ede»                name           «soahng»   type
#   «idihd»              reference      «akadei»   target
#   «kompohnent»         component      «seri»     children of an element
#   «wekpeseng»          contrast       «itar»     sufficient
#   «mwomwen rotorot» / «mwomwen marain»   dark mode / light mode
#   «kolo»               colour (the loan; the twelve colour *names* in
#                        `content.ftl` are a separate question)
#
# «kanwas» (canvas), «krid» (grid), «wariapel» (variable), «dimensin»,
# «ekweising» (equation), «nempe» (number), «nempe unsek» (integer), «nempe
# praim» (prime number), «matriks», «sikwens» (sequence), «skima» (schema),
# «wersin» (version), «kolum» (column) and «lis» (list) are respelled English
# loans, not attested Pohnpeian technical terms. School mathematics on Pohnpei
# is taught largely in English and there is no settled Pohnpeian list to copy,
# so borrowing visibly was preferred to inventing quietly. A speaker replacing
# any of them is doing the work this file was written to make easy.

## `<lineSegment>`

# No plural fork: Pohnpeian does not mark the noun for number, so both English
# branches would render one string.
line-segment-attributes-ignored-with-endpoints = Sohte doadoahngki { $attributes } ni ahnsou me endpoint riau koasoanedi

line-segment-attributes-ignored-with-endpoint-and-midpoint = Sohte doadoahngki { $attributes } ni ahnsou me endpoint oh midpoint koasoanedi pene

line-segment-midpoint-offset-without-midpoint = midpointOffset sohte katepe ma sohte midpoint

## `<line>`

line-points-undetermined-dimensions = Lain me kotehla poahn me dimensin sohte diarada.

line-points-too-few-dimensions = Lain uhdahn pahn kotehla poahn me mie dimensin riau de laud sang.

line-points-depend-on-variables = Lain kin kotehla poahn me poahsoanki wariapel pwukat: { $variables }.

line-equation-invalid-format = Mwomwen ekweising en lain sapwung nan wariapel { $variable1 } oh { $variable2 }.

## `<ray>`

ray-overprescribed-through = Rei koasoanedihda sang through, endpoint, oh direction.  Sohte doadoahngki through me koasoanedi.

ray-dimension-mismatch = numDimensions sohte pahrek nan rei.

## `<vector>`

vector-overprescribed-head = Pekter koasoanedihda sang head, tail, oh displacement.  Sohte doadoahngki head me koasoanedi.

vector-dimension-mismatch = numDimensions sohte pahrek nan pekter.

## Attracting and constraining

attract-to-without-nearest-point = Sohte kak kadeikiong `<{ $component }>` pwehki sohte ah nearestPoint state variable.

constrain-to-without-nearest-point = Sohte kak katengehiong `<{ $component }>` pwehki sohte ah nearestPoint state variable.

constrain-to-interior-without-nearest-point = Sohte kak katengehiong nan loalen `<{ $component }>` pwehki sohte ah nearestPoint state variable.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition sohte doadoahk ong choiceInput me kaidehn inline

## Ordering children by index

choice-input-indices-count-mismatch = Sohte doadoahngki indices me koasoanedi ong choiceInput pwehki uwen tohtohn indices sohte pahrek ong uwen tohtohn seri en choice.

pretzel-indices-count-mismatch = Sohte doadoahngki indices me koasoanedi ong problem pwehki uwen tohtohn indices sohte pahrek ong uwen tohtohn seri en problem.

shuffle-indices-count-mismatch = Sohte doadoahngki indices me koasoanedi ong shuffle pwehki uwen tohtohn indices sohte pahrek ong uwen tohtohn kompohnent.

indices-ignored-out-of-range = Sohte doadoahngki indices me koasoanedi ong { $component } pwehki ekei indices mihmi likin irepe.

pretzel-indices-repeated = Sohte doadoahngki indices me koasoanedi ong pretzel pwehki ekei indices pwurepwurehng.

pretzel-circuit-first-index = Sohte doadoahngki indices me koasoanedi ong pretzel nan mode="circuit" pwehki keieun index uhdahn pahn 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Pwe `<{ $component }>` en doadoahk iangahki seri en string, irair `type` uhdahn pahn koasoanedi.

invalid-type-defaulting-to-math = Soahng { $type } sapwung ong kompohnent { $component }. E uhdahn pahn ehu sang math, text, number, de boolean. Doadoahngki math.

string-not-valid-component-to-arrange = String "{ $value }" kaidehn kompohnent mwahu ong { $component }. Sohte doadoahngki.

## Types and variables

invalid-type-defaulting-to-number = Soahng { $type } sapwung, koasoanehdi soahng ong number.

invalid-variable-value = Uwen wariapel sapwung: `{ $value }`

## Variants

variant-index-must-be-number = Index en wariant { $index } uhdahn pahn nempe ehu

variant-index-must-be-integer = Index en wariant { $index } uhdahn pahn nempe unsek ehu

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` saikinte wiawihda ong sohng me tehk mehlel. Koasoanehdi tehlap kan ong me kohsang meteikan.

side-by-side-absolute-margins = `<{ $component }>` saikinte wiawihda ong sohng me tehk mehlel. Koasoanehdi keil kan ong me kohsang meteikan.

side-by-side-no-block-child = `<{ $component }>` sapwung: e uhdahn pahn mie seri en block ehu de laud sang.

## `<label>`

label-for-ignored-on-graphical = Irair `for` pohn `<label>` en kilel sohte doadoahngki.

label-for-must-resolve-to-one = Irair `for` pohn `<label>` uhdahn pahn kohla ong kompohnent tehieu.

label-for-unresolved = Irair `for` pohn `<label>` sohte kak diarada kompohnent ehu.

label-for-answer-with-authored-inputs = Irair `for` pohn `<label>` kin idihd `<answer>` me ah pedolong ntingihdier; idihd pedolong pein ih.

label-for-answer-without-input = Irair `for` pohn `<label>` kin idihd `<answer>` me sohte ah pedolong en kilelehdi.

label-for-must-reference-input-or-answer = Irair `for` pohn `<label>` uhdahn pahn idihd pedolong ehu de pasapeng ehu.

## Accessibility

accessibility-short-description-or-decorative = Pwehki kak en pedolong, `<{ $component }>` uhdahn pahn mie kawehwe mwotomwot de koasoanedi nin duwen mehn kapwat.

accessibility-video-short-description = Pwehki kak en pedolong, `<video>` uhdahn pahn mie kawehwe mwotomwot.

accessibility-input-short-description-or-label = Pwehki kak en pedolong, `<{ $component }>` uhdahn pahn mie kawehwe mwotomwot de kilel.

accessibility-answer-input-short-description-or-label = Pwehki kak en pedolong, `<answer>` me kin wiahda pedolong uhdahn pahn mie kawehwe mwotomwot de kilel.

accessibility-short-description-contains-math = Kawehwe mwotomwot sohte pahn audeki kompohnent en mahd duwehte `<{ $component }>`. Ntingihdi mahd ni lokaia.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } sohte itar ah wekpeseng ong ntingin oaralapen pwihn (mwomwen rotorot) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; anahne { $threshold }:1 de laud sang).
       *[other] { $colorName } sohte itar ah wekpeseng ong ntingin oaralapen pwihn ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; anahne { $threshold }:1 de laud sang).
    }

## `<circle>`

circle-through-points-non-numerical = Saikinte wiawihda `<circle>` me kotehla poahn { $count } ni ahnsou me poahn ako sohte ar uwen nempe.

circle-too-many-through-points = Sohte kak wiahda kapil me kotehla poahn me tohtohsang 3.

circle-overprescribed-radius-center-points = Sohte kak wiahda kapil me koasoanedi ah radius, ah lukepe, oh poahn me e kotehla.

circle-center-with-multiple-points = Sohte kak wiahda kapil me koasoanedi ah lukepe oh me kotehla poahn me tohtohsang 1.

circle-radius-too-small = Sohte kak wiahda kapil: pwehki dohpeseng en poahn riau me { $distance }, radius { $radius } me koasoanedi me tikitik lehte.

circle-radius-with-many-points = Sohte kak wiahda kapil me kotehla poahn me tohtohsang riau oh me koasoanedi ah radius.

circle-invalid-center-or-through-points = Lukepen kapil de poahn me e kotehla me sapwung.

circle-radius-center-with-multiple-points = Sohte kak wiahda radius en kapil me koasoanedi ah lukepe oh me kotehla poahn me tohtohsang 1.

circle-change-radius-non-numerical = Sohte kak wekidala radius en kapil me kotehla poahn me sohte ar uwen nempe

circle-radius-with-points-non-numerical = Sohte kak wiahda kapil me kotehla poahn me tohtohsang ehu oh me koasoanedi ah radius ni ahnsou me sohte uwen nempe mie.

circle-change-center-non-numerical = Saikinte wiawihda wekidepen lukepen kapil me kotehla poahn me sohte ar uwen nempe.

## `<function>`

# The two counts still arrive and are still formatted; the noun beside each
# does not change, so no branch forks on them.
function-domain-insufficient-dimensions = Dimensin sohte itar ong domain en pwuhnksin. Domain mie interwal { $intervals } a pwuhnksin mie pedolong { $inputs }.

function-domain-invalid-format = Mwomwen domain en pwuhnksin sapwung.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Sohte doadoahngki uwe lapalap en pwuhnksin me kaidehn nempe.
        [minimum] Sohte doadoahngki uwe tikitik en pwuhnksin me kaidehn nempe.
        [extremum] Sohte doadoahngki uwe imwi en pwuhnksin me kaidehn nempe.
        [point] Sohte doadoahngki poahn en pwuhnksin me kaidehn nempe.
        [slope] Sohte doadoahngki sloap en pwuhnksin me kaidehn nempe.
       *[other] Sohte doadoahngki { $type } en pwuhnksin me kaidehn nempe.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Sohte doadoahngki uwe lapalap en pwuhnksin me mwahl.
        [minimum] Sohte doadoahngki uwe tikitik en pwuhnksin me mwahl.
        [extremum] Sohte doadoahngki uwe imwi en pwuhnksin me mwahl.
        [point] Sohte doadoahngki poahn en pwuhnksin me mwahl.
       *[other] Sohte doadoahngki { $type } en pwuhnksin me mwahl.
    }

function-points-too-close = Pwuhnksin mie poahn riau me karanihpene lehte. Sohte kak wiahda pwuhnksin.

function-iterates-input-output-mismatch = Iterate en pwuhnksin kak wiawi ihte ma uwen tohtohn pedolong pahrek ong uwen tohtohn pedoisang. Pwuhnksin wet mie pedolong { $inputs } oh pedoisang { $outputs }.

## `<sequence>`

sequence-invalid-length = Reirein sikwens sapwung.  E uhdahn pahn nempe unsek me sohte tikitiksang 0.

sequence-invalid-step = Step en sikwens sapwung.  E uhdahn pahn nempe ehu ong sikwens en soahng { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" en sikwens en nempe sapwung.  E uhdahn pahn nempe ehu.

sequence-invalid-endpoint-letters = "{ $attribute }" en sikwens en lepin nting sapwung.  E uhdahn pahn koasoandi en lepin nting.

sequence-invalid-endpoint = "{ $attribute }" en sikwens sapwung.

select-from-sequence-coprime-not-numbers = Sohte doadoahngki coprime pwehki kaidehn nempe me pilipil

select-from-sequence-coprime-with-exclude-combinations = Sohte doadoahngki coprime pwehki excludeCombinations koasoanedi

## Resolving a `target`

target-not-found = Akadei sapwung ong `<{ $source }>`: sohte kak diarada akadei.

target-state-variable-not-found = Akadei sapwung ong `<{ $source }>`: sohte kak diarada state variable me ede "{ $property }" pohn `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Wariapel en `<odeSystem>` uhdahn pahn weksang wariapel me pein uhk.

ode-system-duplicate-variable-names = Sohte kak wiahda pwuhnksin RHS en ODE me eden wariapel kan pwurepwurehng.

ode-system-rhs-function-error = Sohte kak wiahda pwuhnksin RHS en ODE.  Sapwung ni ah wiahda pwuhnksin en mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Sohte kak wiahda keimw nanpwungen lain { $count }

angle-invalid-through-point = Poahn sapwung nan through en `<angle>`

parabola-vertex-too-many-points = Saikinte wiawihda parapola me ah wehrek kotehla poahn me tohtohsang 1.

parabola-too-many-points = Saikinte wiawihda parapola me kotehla poahn me tohtohsang 3.

intersection-too-many-items = Saikinte wiawihda kolakol nanpwungen mehkot me tohtohsang riau

## Other math components

ionic-compound-not-two-ions = Saikinte wiawihda kapatapat aionik ong mehkot me kaidehn ihon riau.

ionic-compound-needs-cation-and-anion = Kapatapat aionik wiawihda ihte ong kaion tehieu oh anion tehieu.

solve-equations-cannot-evaluate = Sohte kak kapwungala ekweising pwehki sohte kak tehk uwe en ekweising: { $equation }

math-operators-operand-number-required = operandNumber uhdahn pahn koasoanedi ni ahnsou en kihsang operand en mahd.

eigen-decomposition-failed = Sohte kak diarada eigenvalue en matriks

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: parameter { $parameters } sohte mihmi nan pattern-o, ihme e pahn pahrek ong wasa mwahl ahnsou koaros.

## `<graph>`

graph-grid-invalid = `<graph>`: sohte kak wehwehki grid="{ $grid }". E uhdahn pahn none, medium, dense, de nempe riau me laud sang 0 oh irepeseng ni wasa mwahl, duwehte grid="1 0.5". Sohte krid pahn wiawi.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` anahne pwuhnksin me ah { $expected ->
        [one] pedoisang ehu, iei sloap y' ni poahn koaros, duwehte `y - x`
       *[other] pedoisang riau, iei pekter ni poahn koaros, duwehte `(y, -x)`
    }, ahpw pwuhnksin me e ale mie pedoisang { $found }. { $alternative ->
        [none] Sohte mehkot pahn wiawi.
       *[other] `<{ $alternative }>` iei kompohnent me konehng pwuhnksin wet. Sohte mehkot pahn wiawi.
    }

field-function-attribute-ignored-with-child = Sohte doadoahngki irair `function` pwehki pwuhnksin pil kohsang nan loalen kompohnent-o; me nan loale me doadoahk. Kihda pwuhnksin ni ahl tehieu.

field-variables-ignored =
    `<{ $component }>`: irair `variables` kin kahdaneki wariapel en ekspresin me ntingihdi nan loalen kompohnent-o. { $reason ->
        [function-child] Pwuhnksin met kohsang seri en `<function>`, me kin kahdaneki pein ah wariapel, ihme `variables` sohte doadoahngki.
       *[no-expression] Sohte soangen ekspresin met, ihme `variables` sohte doadoahngki.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" sohte kak doadoahk nan mehn kasale prefigure; doadoahngki wiewia en right.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" sohte kak doadoahk nan mehn kasale prefigure; doadoahngki wiewia en top.

prefigure-invalid-axis-bounds = `<graph>`: irepen aksis sapwung ong wekidekla ong prefigure; doadoahngki bbox tepitep (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: tehlap sapwung ong wekidekla ong prefigure; doadoahngki tehlapen kilel tepitep 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio sapwung ong wekidekla ong prefigure; doadoahngki aspect ratio tepitep 1.

prefigure-grid-spacing-too-fine = `<graph>`: nanpwungen krid me karanih lehte ong irepen aksis; krid sohte pahn wiawi nan mehn kasale prefigure.

prefigure-annotations-not-rendered = `<graph>`: annotations sohte pahn wiawi ma mehn kasale PreFigure sohte doadoahk.

multiple-annotations-children = Seri en `<annotations>` tohto diarek nan `<graph>`; koaros sohte doadoahngki ihte me imwiseklahn.

## Referring to other components

copy-unrecognized-component-type = Sohte kak kalaudehla de kaparaparahda soangen kompohnent me sohte wehwehki: { $type }.

copy-prop-not-found = Sohte kak diarada prop { $property } pohn kompohnent en soahng { $component }

collect-no-source = Sohte poahsoan diarek ong collect.

collect-invalid-component-type = Sohte kak rikpene kompohnent en soahng `<{ $component }>` pwehki soahng wet sapwung.

reference-index-unavailable = Sohte kak idihd index `{ $reference }`

## `<callAction>`

component-action-unavailable = Sohte kak eker { $action } pohn kompohnent `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Mwomwen data sapwung.  Reirein irek kan sohte pahrek. Diarek nan componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data mie eden kolum me pwurepwurehng.  Diarek nan componentIdx :{ $componentIdx }

data-frame-missing-column-name = Data sohte ah eden kolum ehu.  Diarek nan componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Award en pasapeng wet poahsoanki pein sapeng en answer tag-o, met pahn kahrehda wiewia me sohte kasik.

answer-max-num-attempts-in-section-wide-check-work = Koasoanehdi `maxNumAttempts` pohn `<answer>` nan loalen ehu me ah `sectionWideCheckWork` sohte katepe, pwehki uwen tohtohn song kohsang me lapalapo. Koasoanehdi `maxNumAttempts` pohn me lapalapo.

nested-section-wide-check-work-max-num-attempts = Koasoanehdi `maxNumAttempts` pohn ehu me ah `sectionWideCheckWork` me mihmi nan ehu tohrohr me pil ah `sectionWideCheckWork` sohte katepe, pwehki uwen tohtohn song kohsang me mi likio. Koasoanehdi `maxNumAttempts` pohn me mi likio.

answer-attributes-need-symbolic-equality = Irair { $attributes } sohte pahn katepe ma symbolicEquality sohte koasoanedi.

answer-invalid-type = Soahng sapwung ong pasapeng: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Pwehki kompohnent `<{ $component }>` sohte ah ede, e sohte kak doadoahk ong irair en module

module-attribute-name-already-defined = Kompohnent `<{ $component } name="{ $name }">` sohte kak doadoahk nin duwen irair ong module pwehki soangen kompohnent `<module>` mieier ah irair "{ $name }".

conditional-content-condition-ignored = Sohte doadoahngki irair `condition` pohn kompohnent `<conditionalContent>` me mie seri en case de else.

slider-markers-type-mismatch = Soahng en marker sohte pahrek ong soahng en slider.

pretzel-problem-needs-statement-and-answer = Pretzel sapwung: `<problem>` koaros uhdahn pahn audeki `<statement>` tehieu oh `<answer>` tehieu.

pretzel-circuit-first-problem-distractor = Pretzel sapwung: nan mode="circuit", keieun `<problem>` sohte kak wia distractor.

## Attribute values

attribute-invalid-values = Uwe sapwung { $values } ong irair `{ $attribute }`; sohte doadoahngki.

attribute-must-be-references = Uwe `{ $value }` sapwung ong irair `{ $attribute }`. Irair wet uhdahn pahn wiawihkihda idihd me kin tepikihda `$`.

math-input-invalid-function-names = <mathInput>: sohte doadoahngki eden pwuhnksin sapwung nan { $attribute }: { $names }. Kisin nting en kasalepen ede koaros uhdahn pahn reirei duwehte lepin nting riau (lepin nting de dash); kisin nting `|<mahsen en mathspeak>` kak idawehn.

## Building components from the source

component-type-invalid = Soangen kompohnent sapwung: `<{ $componentType }>`

attribute-repeated = Sohte kak pwurehng ntingihdi irair { $attribute }.

attribute-invalid-for-component = Irair "{ $attribute }" sapwung ong kompohnent en soahng `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Koasoandi en stail { $styleNumber } sohte itar ah wekpeseng ong { $context ->
        [text-on-background] kolon nting ong kolon wasa mwuri
        [high-contrast] kolo me wekpeseng laud ong kanwas
        [line] kolon lain ong kanwas
        [marker] kolon marker ong kanwas
       *[text-on-canvas] kolon nting ong kanwas
    }{ $mode ->
        [dark] { " (mwomwen rotorot)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; anahne { $threshold }:1 de laud sang).

style-definition-dark-mode-text-background-contrast =
    Mendahki koasoandi en stail { $styleNumber } koasoanehdi kolo kan me ar wekpeseng itar ong mwomwen marain, kolo en mwomwen rotorot me kohsang uwe pwukat sohte itar ar wekpeseng ong kolon nting ong kolon wasa mwuri ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; anahne { $threshold }:1 de laud sang). { $suggestion ->
        [available] Pwe wekpeseng en itar nan mwomwen rotorot, kalaudehla wekpeseng en mwomwen marain (karasepe: koasoanehdi { $lightAttribute }="{ $lightColor }") de wekidala kolon mwomwen rotorot (karasepe: koasoanehdi { $darkAttribute }="{ $darkColor }").
       *[none] Pwe wekpeseng en itar nan mwomwen rotorot, kalaudehla wekpeseng en mwomwen marain de wekidala kolo pwukat sang textColorDarkMode oh/de backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Mendahki koasoandi en stail { $styleNumber } koasoanehdi kolon nting me ah wekpeseng itar ong mwomwen marain, kolon nting en mwomwen rotorot me kohsang uwe wet sohte itar ah wekpeseng ong kanwas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; anahne { $threshold }:1 de laud sang). { $suggestion ->
        [available] Pwe wekpeseng en itar nan mwomwen rotorot, kalaudehla wekpeseng en mwomwen marain (karasepe: koasoanehdi textColor="{ $lightColor }") de wekidala kolon mwomwen rotorot (karasepe: koasoanehdi textColorDarkMode="{ $darkColor }").
       *[none] Pwe wekpeseng en itar nan mwomwen rotorot, kalaudehla wekpeseng en mwomwen marain de wekidala kolo me kohsang uwe wet sang textColorDarkMode.
    }

section-multiple-style-palettes = Pwihn ehu kak pilada <stylePalette> tehieu; doadoahngki me imwiseklahn.

## Unique variants

variant-num-to-select-not-non-negative-integer = sohte kak diarada wariant tohrohr en { $component } pwehki numToSelect kaidehn nempe unsek me sohte tikitiksang 0.

variant-num-to-select-not-constant-number = sohte kak diarada wariant tohrohr en { $component } pwehki numToSelect kaidehn nempe me sohte kin wekidekla.

variant-with-replacement-not-constant-boolean = sohte kak diarada wariant tohrohr en { $component } pwehki withReplacement kaidehn boolean me sohte kin wekidekla.

variant-select-weight-disables-unique = Wariant tohrohr ong select sohte kak doadoahk ma mie option me ah selectWeight de selectForVariants koasoanedi

variant-coprime-undetermined = sohte kak diarada wariant tohrohr en { $component } pwehki sohte kak diarada ma coprime me likamw ahnsou koaros.

variant-attribute-not-constant = sohte kak diarada wariant tohrohr en { $component } pwehki { $attribute } kin wekidekla.

variant-attribute-not-number = sohte kak diarada wariant tohrohr en { $component } pwehki { $attribute } kaidehn nempe.

variant-attribute-wrong-type-for-sequence =
    sohte kak diarada wariant tohrohr en { $component } en soahng { $type } pwehki { $attribute } kaidehn { $expected ->
        [letters-combination] koasoandi en lepin nting
        [math-expression] ekspresin en mahd me pwung
        [integer] nempe unsek
       *[number] nempe
    }.

variant-length-not-integer = sohte kak diarada wariant tohrohr en { $component } pwehki reirei kaidehn nempe unsek.

variant-sort-not-implemented = saikinte wiawihda wariant tohrohr en { $component } me iangahki sort

variant-exclude-combinations-not-implemented = saikinte wiawihda wariant tohrohr en { $component } me iangahki excludeCombinations

variant-math-exclude-not-implemented = saikinte wiawihda wariant tohrohr en { $component } en soahng math me iangahki exclude

variant-non-constant-exclude-not-implemented = saikinte wiawihda wariant tohrohr en { $component } me ah exclude kin wekidekla

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: sohte kak doadoahk nan mehn kasale prefigure en graph; sohte doadoahngki kadaudoko.

prefigure-descendant-invalid-geometry = { $subject }: mwomwe sohte unsek de sohte kak tehk; sohte doadoahngki kadaudoko.

prefigure-curve-label-omitted = { $subject }: kilel sohte kak doadoahk pohn kurp me wekidekla; sohte doadoahngki kilel.

prefigure-curve-unsupported-definition-type = { $subject }: soangen koasoandi en pwuhnksin en kurp '{ $definitionType }' sohte kak doadoahk; sohte doadoahngki kadaudoko.

prefigure-region-flip-functions-unsupported = { $subject }: irair flipFunctions pohn regionBetweenCurves sohte kak doadoahk; sohte doadoahngki kadaudoko.

prefigure-region-non-formula-child = { $subject }: seri en pwuhnksin en soahng formula ihte me kak doadoahk pohn regionBetweenCurves; sohte doadoahngki kadaudoko.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' sohte kak doadoahk ong { $labelKind ->
        [line-family] kilel en peneineien lain
       *[point] kilel en poahn
    }; doadoahngki koasoandi tepitep en PreFigure.

prefigure-fill-style-unsupported = { $subject }: stail en audaud '{ $fillStyle }' sohte kak doadoahk nan PreFigure; doadoahngki audaud me unsek.

prefigure-line-style-unknown = { $subject }: stail en lain '{ $lineStyle }' me sohte wehwehki, sohte iang nan me PreFigure kihda.

prefigure-marker-style-mapped-to-diamond = { $subject }: stail en marker '{ $markerStyle }' wekidekla ong stail en PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: stail en marker '{ $markerStyle }' sohte kak doadoahk nan PreFigure; doadoahngki stail tepitep.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` sapwung; sohte kak diarada akadei. Sohte doadoahngki annotation.

annotation-ref-multiple-targets = `<annotation>`: `ref` kohla ong akadei tohto; doadoahngki me keieu.

annotation-ref-outside-graph = `<annotation>`: `ref` sapwung; akadei mihmi likin graph me audeki. Sohte doadoahngki annotation.

annotation-ref-unsupported-target = `<annotation>`: `ref` sapwung; akadei kaidehn mehn kilel me kak doadoahk nan wekidekla en prefigure. Sohte doadoahngki annotation.

annotation-text-missing = `<annotation>`: `text` sohte mie de mwahl; kihda nting mwahl.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Poahsoan me kapilpene diarekda.
       *[other] Poahsoan me kapilpene diarekda me pid kompohnent `<{ $componentType }>`.
    }

reference-no-referent = Sohte mehkot diarek ong idihd: `{ $reference }`

reference-multiple-referents = Mehkot tohto diarek ong idihd: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Mwomwen irair { $attribute } en `<{ $componentType }>` sapwung.

children-invalid = Seri sapwung ong `<{ $componentType }>`: Seri sapwung pwukat diarek: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Uwe `{ $value }` sapwung ong irair `{ $attribute }`, doadoahngki uwe `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Wersin en DoenetML { $version } sohte diarek.
       *[other] Wersin en DoenetML { $version } sohte diarek. Doadoahngki wersin { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML sapwung: { $content }

parse-tag-missing-close-tag = DoenetML sapwung: Tag `{ $tag }` sohte ah tag en ritingedi. Anahne tag me pein ritingedi de tag `</{ $tagName }>`.

parse-tag-error = DoenetML sapwung: Sapwung nan tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML sapwung: Irair sapwung `{ $attribute }` mwomwen sohte ah uwe.

parse-attribute-invalid = DoenetML sapwung: Irair sapwung `{ $attribute }`

parse-attribute-value-invalid = DoenetML sapwung: Uwen irair sapwung `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML sapwung: Uwen irair sapwung `{ $value }`. Kilel en kapasapa sohte pahrek. Mwomwen ke sohte ah `{ $quote }`

parse-open-tag-name-missing = DoenetML sapwung: Tag ehu diarek me sohte ah eden tag, duwehte `<`

parse-tag-not-closed = DoenetML sapwung: Tag `{ $tag }` sohte ritingedi (mwomwen `>` sohte mie).

parse-self-closing-tag-name-missing = DoenetML sapwung: Tag ehu diarek me sohte ah eden tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML sapwung: Tag `{ $tag }` sohte ritingedi (mwomwen `/>` sohte mie).

parse-tag-invalid-attributes = DoenetML sapwung: Tag `{ $tag }` sapwung. Mwomwen ah irair kan sapwung.

parse-close-tag-name-missing = DoenetML sapwung: Tag en ritingedi ehu diarek me sohte ah eden tag, duwehte `</`

parse-attribute-value-unquoted = Uwen irair uhdahn pahn mi nanpwungen kilel en kapasapa: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML sapwung: Tag en ritingedi `{ $tag }` diarek, ahpw sohte tag en ritingada me pahrek

parse-close-tag-mismatched = DoenetML sapwung: Tag en ritingedi sohte pahrek. Anahne `</{ $expected }>`. Diarek `{ $found }`

parser-node-unconvertible = Sohte kak wekidala node { $node } ong node en Dast.

## Names

name-attribute-invalid =
    Eden irair sapwung name='{ $name }'. { $reason ->
        [characters] Ede kak audeki lepin nting, nempe, underscore de hyphen ihte.
       *[start] Ede uhdahn pahn tepikihda lepin nting ehu.
    }

component-name-invalid-start = Eden kompohnent "{ $name }" sapwung. Ede uhdahn pahn tepikihda lepin nting ehu.

## `<answer>` sugar

answer-video-watched-missing-video = Pasapeng en soahng videoWatched uhdahn pahn mie irair video

answer-video-watched-video-not-reference = Pasapeng en soahng videoWatched uhdahn pahn ah irair video wia idihd ehu

answer-name-not-single-text = Irair name en pasapeng uhdahn pahn mie seri en text tehieu

## Referencing another document

external-doenetml-recursion-limit = Sohte kak ale DoenetML sang likin pwehki pwurepwur me tohto lehte. Mwomwen mie idihd me kapilpene?

external-doenetml-unavailable = Sohte kak ale DoenetML sang { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML me alehda sang { $attribute }="{ $uri }" sapwung: e sohte pahrek ong soangen kompohnent "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Irair `{ $from }` solahr doadoahk; doadoahngki `{ $to }`.
       *[other] [deprecation] Irair `{ $from }` pohn `<{ $component }>` solahr doadoahk; doadoahngki `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Irair `{ $from }` solahr doadoahk oh sohte doadoahngki pwehki `{ $to }` pil koasoanedi.
       *[other] [deprecation] Irair `{ $from }` pohn `<{ $component }>` solahr doadoahk oh sohte doadoahngki pwehki `{ $to }` pil koasoanedi.
    }

deprecated-attribute-ignored = [deprecation] Irair `{ $attribute }` pohn `<{ $component }>` solahr doadoahk oh sohte doadoahngki.

deprecated-attribute-to-child = [deprecation] Irair `{ $attribute }` pohn `<{ $component }>` solahr doadoahk; doadoahngki seri `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Uwe `{ $value }` en irair `{ $attribute }` pohn `<{ $component }>` solahr doadoahk; doadoahngki `{ $to }`.

## Language coverage

pluralize-english-only = `<pluralize>` kak wiahda mwomwen tohto nan lokaiahn wai ihte, ihme ah nting sohte wekidekla nan doakumend me ntingdi ni { $locale }. Ntingihdi pein mwomwen tohto, de koasoanehdi ni irair `pluralForm`.

## Checking against the schema

schema-element-unrecognized = Element `<{ $tag }>` kaidehn element en Doenet.

schema-element-not-allowed-at-root = Element `<{ $tag }>` sohte mweimweiong ni tepin doakumend.

schema-element-not-allowed-inside = Element `<{ $tag }>` sohte mweimweiong nan loalen `<{ $parent }>`.

schema-attribute-unrecognized = Element `<{ $tag }>` sohte ah irair me adaneki `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Irair `{ $attribute }` en element `<{ $tag }>` uhdahn pahn wia lis ehu me kis koaros ehu sang met: { $allowed }
       *[other] Irair `{ $attribute }` en element `<{ $tag }>` uhdahn pahn ehu sang met: { $allowed }
    }

## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Eden wariant sapwung ong select.  Eden wariant { $variantName } pwarada nan option { $numOptions } ahpw uwen me pahn pilipil iei { $numToSelect }.

select-variant-name-without-options = Wariant ekei koasoanedi ong select ahpw sohte option koasoanedi ong eden wariant wet: { $variantName }.

select-variant-name-not-possible = Eden wariant { $variantName } me koasoanedi ong select sohte kak wia eden wariant.

select-too-few-options = Sohte kak pilada kompohnent { $numToSelect } sang { $numOptions } ihte.

select-from-sequence-too-few-values = Sohte kak pilada uwe { $numToSelect } sang sikwens me reirei { $length }.

select-from-sequence-indices-count-mismatch = Uwen tohtohn indices me koasoanedi ong select uhdahn pahn pahrek ong uwen me pahn pilipil

select-from-sequence-indices-not-integers = Indices koaros me koasoanedi ong select uhdahn pahn nempe unsek

select-from-sequence-index-excluded = Index en selectfromsequence me koasoanedi me kesehsang

select-from-sequence-indices-excluded-combination = Indices en selectfromsequence me koasoanedi me wia koasoandi me kesehsang

select-from-sequence-coprime-not-positive-integers = Sohte kak pilada koasoandi en coprime pwehki kaidehn nempe unsek me laud sang 0 me pilipil.

select-from-sequence-coprime-common-factor = Sohte kak pilada nempe coprime. Uwe koaros me kak wia mie ehu factor me irail koaros ahneki. (Uwe en "from" de "to" me koasoanedi uhdahn pahn coprime ong "step".)

select-from-sequence-coprime-single-number = Sohte kak pilada koasoandi en coprime sang nempe tehieu me kaidehn 1.

select-from-sequence-excluded-too-many-combinations = Kesehsang laudsang 70% en koasoandi kan nan selectFromSequence

select-from-sequence-coprime-none-found = Sohte kak pilada nempe coprime. Uwe koaros me kak wia mie ehu factor me irail koaros ahneki.

select-from-sequence-too-few-unique-values = Sohte kak pilada uwe tohrohr { $numToSelect } sang sikwens me reirei { $numPossibleValues }

select-prime-numbers-too-few-values = Sohte kak pilada uwe { $numToSelect } sang lisen nempe praim me reirei { $numValues }

select-prime-numbers-values-count-mismatch = Uwen tohtohn uwe me koasoanedi ong select uhdahn pahn pahrek ong uwen me pahn pilipil

select-prime-numbers-values-not-prime = Uwe koaros me koasoanedi ong select prime number uhdahn pahn mihmi nan lisen nempe praim

select-prime-numbers-values-excluded-combination = Uwe en selectPrimeNumbers me koasoanedi me wia koasoandi me kesehsang

select-prime-numbers-excluded-too-many-combinations = Kesehsang laudsang 70% en koasoandi kan nan selectPrimeNumbers

select-random-combination-fluke = Ni mehkot me inenen sohte kin wiawi, sohte kak pilada koasoandi en uwe me sohte kileldi

select-random-value-fluke = Ni mehkot me inenen sohte kin wiawi, sohte kak pilada uwe me sohte kileldi

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` sohte wiawi nan mahd; ekspresin-o ntingdi duwehte mwohn ahnsou me pedolong kak mihmi loale. { $reason ->
        [not-inline] Choice input me `inline` ihte me kak mihmi nan ekspresin; ma sohte `inline`, e wia pwihn en pwuhs.
        [expanded] Text input me `expanded` wia pohs me lain tohto, me laud lehte ong mihmi nan ekspresin.
        [on-graph] Pohn graph, ekspresin-o wiawi nin duwen kilel tehieu, me sohte wasa ong mehn koasoane.
       *[relative-width] Ah `width` kohsang me teikan (persent de `em`), me sohte mehkot mie ong tehk nan ekspresin. Kihda tehlap ni sohng me tehk mehlel, duwehte `px`.
    }
