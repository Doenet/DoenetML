# Faroese diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Faroese counts in the same two categories English does, so every selection
# below keeps both branches.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } verður hunsað, tá ið tveir endapunktar eru tilskilaðir
       *[other] { $attributes } verða hunsað, tá ið tveir endapunktar eru tilskilaðir
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } verður hunsað, tá ið bæði endapunktur og miðpunktur eru tilskilaðir
       *[other] { $attributes } verða hunsað, tá ið bæði endapunktur og miðpunktur eru tilskilaðir
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset hevur onga ávirkan uttan miðpunkt

## `<line>`

line-points-undetermined-dimensions = Linja gjøgnum punkt við óávgjørdum víddum.

line-points-too-few-dimensions = Linjan má ganga gjøgnum punkt við í minsta lagi tveimum víddum.

line-points-depend-on-variables = Linjan gongur gjøgnum punkt sum eru bundin at variablum: { $variables }.

line-equation-invalid-format = Ógildugt snið á javning fyri linju í variablunum { $variable1 } og { $variable2 }.

## `<ray>`

ray-overprescribed-through = Geislin er ásettur við through, endpoint og direction.  Hunsar tilskilaða through.

ray-dimension-mismatch = Ósamsvar í numDimensions í geisla.

## `<vector>`

vector-overprescribed-head = Vektorurin er ásettur við head, tail og displacement.  Hunsar tilskilaða head.

vector-dimension-mismatch = Ósamsvar í numDimensions í vektori.

## Attracting and constraining

attract-to-without-nearest-point = Ikki møguligt at draga at `<{ $component }>`, tí hann hevur ikki støðuvariabluna nearestPoint.

constrain-to-without-nearest-point = Ikki møguligt at avmarka at `<{ $component }>`, tí hann hevur ikki støðuvariabluna nearestPoint.

constrain-to-interior-without-nearest-point = Ikki møguligt at avmarka at innara partinum av `<{ $component }>`, tí hann hevur ikki støðuvariabluna nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition verður hunsað fyri eitt choiceInput sum ikki er inline

## Ordering children by index

choice-input-indices-count-mismatch = Hunsar tey vísitøl sum eru tilskilað fyri choiceInput, tí talið av teimum svarar ikki til talið av choice-undireindum.

pretzel-indices-count-mismatch = Hunsar tey vísitøl sum eru tilskilað fyri problem, tí talið av teimum svarar ikki til talið av problem-undireindum.

shuffle-indices-count-mismatch = Hunsar tey vísitøl sum eru tilskilað fyri shuffle, tí talið av teimum svarar ikki til talið av eindum.

indices-ignored-out-of-range = Hunsar tey vísitøl sum eru tilskilað fyri { $component }, tí summi teirra eru uttan fyri økið.

pretzel-indices-repeated = Hunsar tey vísitøl sum eru tilskilað fyri pretzel, tí summi teirra eru endurtikin.

pretzel-circuit-first-index = Hunsar tey vísitøl sum eru tilskilað fyri pretzel í circuit-standi, tí fyrsta vísitalið má vera 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Fyri at `<{ $component }>` skal virka við streingjaundireindum, má eginleikin `type` tilskilast.

invalid-type-defaulting-to-math = Ógildugt slag { $type } fyri eindina { $component }. Tað má vera eitt av math, text, number ella boolean. Fer aftur til math.

string-not-valid-component-to-arrange = Streingurin "{ $value }" er ikki ein gildug eind at { $component }. Hunsar hann.

## Types and variables

invalid-type-defaulting-to-number = Ógildugt slag { $type }, setir slagið til number.

invalid-variable-value = Ógildugt virði á variablu: `{ $value }`

## Variants

variant-index-must-be-number = Útgávuvísitalið { $index } má vera eitt tal

variant-index-must-be-integer = Útgávuvísitalið { $index } má vera eitt heiltal

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` er ikki útint fyri algildar mátingar. Setir breiddirnar sum lutfalsligar.

side-by-side-absolute-margins = `<{ $component }>` er ikki útint fyri algildar mátingar. Setir breddarnar sum lutfalsligar.

side-by-side-no-block-child = Ógildugt `<{ $component }>`: tað má hava í minsta lagi eina blokk-undireind.

## `<label>`

label-for-ignored-on-graphical = Eginleikin `for` á einum grafiskum `<label>` verður hunsaður.

label-for-must-resolve-to-one = Eginleikin `for` á `<label>` má loysast til júst eina eind.

label-for-unresolved = Eginleikin `for` á `<label>` kundi ikki loysast til eina eind.

label-for-answer-with-authored-inputs = Eginleikin `for` á `<label>` vísir til eitt `<answer>` við serskilt skrivaðum innsláttrum; vís beinleiðis til innsláttrin.

label-for-answer-without-input = Eginleikin `for` á `<label>` vísir til eitt `<answer>` uttan innslátt at merkja.

label-for-must-reference-input-or-answer = Eginleikin `for` á `<label>` má vísa til ein innslátt ella eitt svar.

## Accessibility

accessibility-short-description-or-decorative = Fyri atkomu má `<{ $component }>` antin hava eina stutta lýsing ella vera tilskilað sum prýði.

accessibility-video-short-description = Fyri atkomu má `<video>` hava eina stutta lýsing.

accessibility-input-short-description-or-label = Fyri atkomu má `<{ $component }>` hava eina stutta lýsing ella eitt merki.

accessibility-answer-input-short-description-or-label = Fyri atkomu má eitt `<answer>` sum skapar ein innslátt hava eina stutta lýsing ella eitt merki.

accessibility-short-description-contains-math = Stuttar lýsingar eiga ikki at hava støddfrøðieindir sum `<{ $component }>` í sær. Skriva alla støddfrøði við orðum.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } hevur ikki nóg mikið mun fyri tekstin í kapittulyvirskriftini (myrkt stand) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; krevur í minsta lagi { $threshold }:1).
       *[other] { $colorName } hevur ikki nóg mikið mun fyri tekstin í kapittulyvirskriftini ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; krevur í minsta lagi { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` gjøgnum { $count } punkt er ikki útint, tá ið punktini ikki hava talvirði.

circle-too-many-through-points = Ikki møguligt at rokna ring gjøgnum meir enn 3 punkt.

circle-overprescribed-radius-center-points = Ikki møguligt at rokna ring við tilskilaðum radius, miðdepli og punktum.

circle-center-with-multiple-points = Ikki møguligt at rokna ring við tilskilaðum miðdepli gjøgnum meir enn eitt punkt.

circle-radius-too-small = Ikki møguligt at rokna ringin: tá ið fjarstøðan millum punktini bæði er { $distance }, er tilskilaði radiusin { $radius } ov lítil.

circle-radius-with-many-points = Ikki møguligt at skapa ring gjøgnum meir enn tvey punkt við tilskilaðum radiusi.

circle-invalid-center-or-through-points = Ógildugur miðdepil ella ógildug punkt hjá ringinum.

circle-radius-center-with-multiple-points = Ikki møguligt at rokna radius í ringi við tilskilaðum miðdepli gjøgnum meir enn eitt punkt.

circle-change-radius-non-numerical = Ikki møguligt at broyta radius í ringi, tá ið punktini ikki hava talvirði

circle-radius-with-points-non-numerical = Ikki møguligt at skapa ring gjøgnum meir enn eitt punkt við tilskilaðum radiusi, tá ið talvirði ikki eru til.

circle-change-center-non-numerical = Tað er ikki útint at broyta miðdepilin í ringi gjøgnum punkt uttan talvirði.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Ov fáar víddir í definitiónsmongdini hjá funktiónini. Definitiónsmongdin hevur { $intervals } millumbil, men funktiónin hevur { $inputs ->
            [one] { $inputs } innslátt
           *[other] { $inputs } innsláttir
        }.
       *[other] Ov fáar víddir í definitiónsmongdini hjá funktiónini. Definitiónsmongdin hevur { $intervals } millumbil, men funktiónin hevur { $inputs ->
            [one] { $inputs } innslátt
           *[other] { $inputs } innsláttir
        }.
    }

function-domain-invalid-format = Ógildugt snið á definitiónsmongdini hjá funktiónini.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Hunsar hægsta virði í funktiónini sum ikki er talvirði.
        [minimum] Hunsar lægsta virði í funktiónini sum ikki er talvirði.
        [extremum] Hunsar ytstu virði í funktiónini sum ikki er talvirði.
        [point] Hunsar punkt í funktiónini sum ikki er talvirði.
        [slope] Hunsar hall í funktiónini sum ikki er talvirði.
       *[other] Hunsar { $type } í funktiónini sum ikki er talvirði.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Hunsar tómt hægsta virði í funktiónini.
        [minimum] Hunsar tómt lægsta virði í funktiónini.
        [extremum] Hunsar tómt ytstu virði í funktiónini.
        [point] Hunsar tómt punkt í funktiónini.
       *[other] Hunsar tómt { $type } í funktiónini.
    }

function-points-too-close = Funktiónin hevur tvey punkt sum eru ov nær hvørt øðrum. Funktiónin kann ikki skilgreinast.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Ítratiónir av eini funktión eru bert møguligar, um talið av innsláttrum er tað sama sum talið av útsláttrum. Henda funktiónin hevur { $inputs } innslátt og { $outputs ->
            [one] { $outputs } útslátt
           *[other] { $outputs } útsláttir
        }.
       *[other] Ítratiónir av eini funktión eru bert møguligar, um talið av innsláttrum er tað sama sum talið av útsláttrum. Henda funktiónin hevur { $inputs } innsláttir og { $outputs ->
            [one] { $outputs } útslátt
           *[other] { $outputs } útsláttir
        }.
    }

## `<sequence>`

sequence-invalid-length = Ógildug longd á rað.  Hon má vera eitt heiltal sum ikki er negativt.

sequence-invalid-step = Ógildugt stig í rað.  Tað má vera eitt tal fyri eina rað av slagnum { $type }.

sequence-invalid-endpoint-number = Ógildugt "{ $attribute }" í talrað.  Tað má vera eitt tal.

sequence-invalid-endpoint-letters = Ógildugt "{ $attribute }" í bókstavarað.  Tað má vera ein bókstavasamanseting.

sequence-invalid-endpoint = Ógildugt "{ $attribute }" í rað.

select-from-sequence-coprime-not-numbers = coprime verður hunsað, tí tað eru ikki tøl sum verða vald

select-from-sequence-coprime-with-exclude-combinations = coprime verður hunsað, tí excludeCombinations er tilskilað

## Resolving a `target`

target-not-found = Ógildugt target fyri `<{ $source }>`: málið finst ikki.

target-state-variable-not-found = Ógildugt target fyri `<{ $source }>`: eingin støðuvariabla við navninum "{ $property }" finst á `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Variablurnar í `<odeSystem>` mugu vera aðrar enn tann óheftu variablan.

ode-system-duplicate-variable-names = Ikki møguligt at skilgreina RHS-funktiónir í ODE við eins nøvnum á heftum variablum.

ode-system-rhs-function-error = Ikki møguligt at skilgreina RHS-funktión í ODE.  Villa við at skapa mathjs-funktión.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ikki møguligt at skilgreina eitt horn millum { $count } linjur

angle-invalid-through-point = Ógildugt punkt í through á `<angle>`

parabola-vertex-too-many-points = Parabul við toppdepli gjøgnum meir enn eitt punkt er ikki útint.

parabola-too-many-points = Parabul gjøgnum meir enn 3 punkt er ikki útint.

intersection-too-many-items = Skurður millum meir enn tveir lutir er ikki útintur

## Other math components

ionic-compound-not-two-ions = Iónsamband er bert útint fyri tvey ión.

ionic-compound-needs-cation-and-anion = Iónsamband er bert útint fyri eitt katión og eitt anión.

solve-equations-cannot-evaluate = Ikki møguligt at loysa javningina, tí hon kundi ikki roknast: { $equation }

math-operators-operand-number-required = operandNumber má tilskilast, tá ið ein støddfrøðiligur operandur verður tikin út.

eigen-decomposition-failed = Kundi ikki rokna eigingildini í matrisuni

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameturin { $parameters } er ikki í mynstrinum, so hann fer altíð at passa við eitt tómt pláss.
       *[other] `<matchesPattern>`: parametrarnir { $parameters } eru ikki í mynstrinum, so teir fara altíð at passa við eitt tómt pláss.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: kann ikki tulka grid="{ $grid }". Tað má vera none, medium, dense, ella tvey positiv tøl skild við eitt millumrúm, sum grid="1 0.5". Einki net verður tikið.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" er ikki stuðlað í prefigure-teknaranum; brúkar atferðina fyri høgru støðu.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" er ikki stuðlað í prefigure-teknaranum; brúkar atferðina fyri ovaru støðu.

prefigure-invalid-axis-bounds = `<graph>`: ógildug ásmark fyri prefigure-umsetingina; brúkar sjálvvalda bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: ógildug breidd fyri prefigure-umsetingina; brúkar sjálvvalda myndabreidd 425.

prefigure-invalid-aspect-ratio = `<graph>`: ógildugt aspectRatio fyri prefigure-umsetingina; brúkar sjálvvalda lutfallið 1.

prefigure-grid-spacing-too-fine = `<graph>`: bilið í netinum er ov fínt fyri ásmarkini; netið verður sleppt í prefigure-teknaranum.

prefigure-annotations-not-rendered = `<graph>`: viðmerkingar verða ikki tiknaðar, uttan so at PreFigure-teknarin verður brúktur.

multiple-annotations-children = Fleiri `<annotations>`-undireindir vórðu funnar í `<graph>`; allar uttan tann síðstu verða hunsaðar.

## Referring to other components

copy-unrecognized-component-type = Ikki møguligt at víðka ella avrita ókent eindarslag: { $type }.

copy-prop-not-found = Eginleikin { $property } fanst ikki á eind av slagnum { $component }

collect-no-source = Eingin kelda fanst fyri collect.

collect-invalid-component-type = Ikki møguligt at savna eindir av slagnum `<{ $component }>`, tí tað er eitt ógildugt eindarslag.

reference-index-unavailable = Ikki møguligt at vísa til vísitalið `{ $reference }`

## `<callAction>`

component-action-unavailable = Ikki møguligt at kalla { $action } á eindini `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Dátan hevur ógildugt form.  Raðirnar hava ósamsvarandi longdir. Funnið í componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Dátan hevur eins dálkanøvn.  Funnið í componentIdx :{ $componentIdx }

data-frame-missing-column-name = Eitt dálkanavn vantar í dátuni.  Funnið í componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Ein løn fyri hetta svarið byggir á tað svar sum answer-merkið sjálvt sendi inn, sum fer at geva óvæntaða atferð.

answer-max-num-attempts-in-section-wide-check-work = Tað hevur onga ávirkan at seta `maxNumAttempts` á eitt `<answer>` inni í einum íláti við `sectionWideCheckWork`, tí ílátið stýrir talinum av royndum. Set `maxNumAttempts` á ílátið í staðin.

nested-section-wide-check-work-max-num-attempts = Tað hevur onga ávirkan at seta `maxNumAttempts` á eitt ílát við `sectionWideCheckWork` sum er inni í øðrum íláti við `sectionWideCheckWork`, tí ytra ílátið stýrir talinum av royndum. Set `maxNumAttempts` á ytra ílátið í staðin.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Eginleikin { $attributes } hevur onga ávirkan uttan at symbolicEquality er sett.
       *[other] Eginleikarnir { $attributes } hava onga ávirkan uttan at symbolicEquality er sett.
    }

answer-invalid-type = Ógildugt slag fyri svar: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Tí eindin `<{ $component }>` hevur einki navn, kann hon ikki brúkast sum ein modul-eginleiki

module-attribute-name-already-defined = Eindin `<{ $component } name="{ $name }">` kann ikki brúkast sum eginleiki fyri ein modul, tí eindarslagið `<module>` hevur longu ein eginleika "{ $name }" skilgreindan.

conditional-content-condition-ignored = Eginleikin `condition` verður hunsaður á eini `<conditionalContent>`-eind við case- ella else-undireindum.

slider-markers-type-mismatch = Slagið á merkjunum svarar ikki til slagið á skúvaranum.

pretzel-problem-needs-statement-and-answer = Ógildugt pretzel: hvørt `<problem>` má hava eitt `<statement>` og eitt `<answer>`.

pretzel-circuit-first-problem-distractor = Ógildugt pretzel: í mode="circuit" kann fyrsta `<problem>` ikki vera ein villleiðing.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Ógildugt virði { $values } fyri eginleikan `{ $attribute }`; hunsar tað.
       *[other] Ógildug virði { $values } fyri eginleikan `{ $attribute }`; hunsar tey.
    }

attribute-must-be-references = Ógildugt virði `{ $value }` fyri eginleikan `{ $attribute }`. Eginleikin má vera samansettur av tilvísingum sum byrja við `$`.

math-input-invalid-function-names = <mathInput>: hunsaði ógildug funktiónsnøvn í { $attribute }: { $names }. Vísingarparturin í hvørjum navni má vera í minsta lagi 2 tekin (bókstavir ella bindistrik); ein valfríur `|<mathspeak alternative>` viðheingi kann fylgja.

## Building components from the source

component-type-invalid = Ógildugt eindarslag: `<{ $componentType }>`

attribute-repeated = Eginleikin { $attribute } kann ikki endurtakast.

attribute-invalid-for-component = Ógildugur eginleiki "{ $attribute }" fyri eind av slagnum `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Stílskilgreining { $styleNumber } hevur ikki nóg mikið mun fyri { $context ->
        [text-on-background] tekstlitin móti bakgrundslitinum
        [high-contrast] høgmunslitin móti flatuni
        [line] linjulitin móti flatuni
        [marker] merkislitin móti flatuni
       *[text-on-canvas] tekstlitin móti flatuni
    }{ $mode ->
        [dark] { " (myrkt stand)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; krevur í minsta lagi { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Hóast stílskilgreining { $styleNumber } tilskilar litir sum geva nóg mikið mun í ljósum standi, hava teir litir fyri myrkt stand sum av teimum eru leiddir ikki nóg mikið mun millum tekstlit og bakgrundslit ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; krevur í minsta lagi { $threshold }:1). { $suggestion ->
        [available] Fyri at tryggja nóg mikið mun í myrkum standi kanst tú antin økja munin í ljósum standi (t.d. seta { $lightAttribute }="{ $lightColor }") ella yvirskriva litin fyri myrkt stand (t.d. seta { $darkAttribute }="{ $darkColor }").
       *[none] Fyri at tryggja nóg mikið mun í myrkum standi kanst tú økja munin í ljósum standi ella yvirskriva teir leiddu litirnar við textColorDarkMode og/ella backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Hóast stílskilgreining { $styleNumber } tilskilar ein tekstlit sum gevur nóg mikið mun í ljósum standi, hevur tann tekstliturin fyri myrkt stand sum av honum er leiddur ikki nóg mikið mun móti flatuni ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; krevur í minsta lagi { $threshold }:1). { $suggestion ->
        [available] Fyri at tryggja nóg mikið mun í myrkum standi kanst tú antin økja munin í ljósum standi (t.d. seta textColor="{ $lightColor }") ella yvirskriva litin fyri myrkt stand (t.d. seta textColorDarkMode="{ $darkColor }").
       *[none] Fyri at tryggja nóg mikið mun í myrkum standi kanst tú økja munin í ljósum standi ella yvirskriva tann leidda litin við textColorDarkMode.
    }

section-multiple-style-palettes = Ein kapittul kann bert velja eitt <stylePalette>; brúkar tað síðsta.

## Unique variants

variant-num-to-select-not-non-negative-integer = kann ikki áseta einstakar útgávur av { $component }, tí numToSelect er ikki eitt heiltal sum ikki er negativt.

variant-num-to-select-not-constant-number = kann ikki áseta einstakar útgávur av { $component }, tí numToSelect er ikki eitt fast tal.

variant-with-replacement-not-constant-boolean = kann ikki áseta einstakar útgávur av { $component }, tí withReplacement er ikki eitt fast Boole-virði.

variant-select-weight-disables-unique = Einstakar útgávur fyri select verða óvirknar, um ein møguleiki hevur selectWeight ella selectForVariants tilskilað

variant-coprime-undetermined = kann ikki áseta einstakar útgávur av { $component }, tí tað kann ikki ásetast at coprime altíð er ósatt.

variant-attribute-not-constant = kann ikki áseta einstakar útgávur av { $component }, tí { $attribute } er ikki fast.

variant-attribute-not-number = kann ikki áseta einstakar útgávur av { $component }, tí { $attribute } er ikki eitt tal.

variant-attribute-wrong-type-for-sequence =
    kann ikki áseta einstakar útgávur av { $component } av slagnum { $type }, tí { $attribute } er ikki { $expected ->
        [letters-combination] ein bókstavasamanseting
        [math-expression] eitt gildugt støddfrøðiligt úttrykk
        [integer] eitt heiltal
       *[number] eitt tal
    }.

variant-length-not-integer = kann ikki áseta einstakar útgávur av { $component }, tí length er ikki eitt heiltal.

variant-sort-not-implemented = einstakar útgávur av { $component } við sort eru ikki útintar

variant-exclude-combinations-not-implemented = einstakar útgávur av { $component } við excludeCombinations eru ikki útintar

variant-math-exclude-not-implemented = einstakar útgávur av { $component } av slagnum math við exclude eru ikki útintar

variant-non-constant-exclude-not-implemented = einstakar útgávur av { $component } við exclude sum ikki er fast eru ikki útintar

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ikki stuðlað í prefigure-teknaranum hjá grafinum; sleppti eftirkomaranum.

prefigure-descendant-invalid-geometry = { $subject }: óendalig ella ófullfíggjað rúmfrøði; sleppti eftirkomaranum.

prefigure-curve-label-omitted = { $subject }: merki eru ikki stuðlað á umsettum kurvueindum; sleppti merkinum.

prefigure-curve-unsupported-definition-type = { $subject }: óstuðlað skilgreiningarslag fyri kurvufunktión '{ $definitionType }'; sleppti eftirkomaranum.

prefigure-region-flip-functions-unsupported = { $subject }: eginleikin flipFunctions á regionBetweenCurves er ikki stuðlaður; sleppti eftirkomaranum.

prefigure-region-non-formula-child = { $subject }: bert undirfunktiónir av slagnum formula eru stuðlaðar á regionBetweenCurves; sleppti eftirkomaranum.

prefigure-label-position-unsupported =
    { $subject }: óstuðlað labelPosition '{ $labelPosition }' fyri { $labelKind ->
        [line-family] merki úr linjufamiljuni
       *[point] punktmerki
    }; brúkti sjálvvalda javning í PreFigure.

prefigure-fill-style-unsupported = { $subject }: fyllingarstílurin '{ $fillStyle }' er ikki stuðlaður av PreFigure; brúkar eina heila fylling í staðin.

prefigure-line-style-unknown = { $subject }: ókendur linjustílur '{ $lineStyle }' varð sleptur úr PreFigure-útsláttrinum.

prefigure-marker-style-mapped-to-diamond = { $subject }: merkisstílurin '{ $markerStyle }' varð avmyndaður til PreFigure-stílin 'diamond'.

prefigure-marker-style-unsupported = { $subject }: merkisstílurin '{ $markerStyle }' er ikki stuðlaður av PreFigure; brúkti sjálvvalda stílin.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ógildugt `ref`; málið kann ikki loysast. Viðmerkingin varð slept.

annotation-ref-multiple-targets = `<annotation>`: `ref` loystist til fleiri mál; brúkar tað fyrsta.

annotation-ref-outside-graph = `<annotation>`: ógildugt `ref`; málið er uttan fyri grafið rundan um. Viðmerkingin varð slept.

annotation-ref-unsupported-target = `<annotation>`: ógildugt `ref`; málið er ikki ein grafiskur lutur sum er stuðlaður í prefigure-umsetingini. Viðmerkingin varð slept.

annotation-text-missing = `<annotation>`: `text` vantar ella er tómt; sendir tóman tekst.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Ein ringbinding varð funnin.
       *[other] Ein ringbinding varð funnin sum viðvíkir eini `<{ $componentType }>`-eind.
    }

reference-no-referent = Einki mál varð funnið fyri tilvísingina: `{ $reference }`

reference-multiple-referents = Fleiri mál vórðu funnin fyri tilvísingina: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ógildugt snið á eginleikanum { $attribute } á `<{ $componentType }>`.

children-invalid = Ógildugar undireindir fyri `<{ $componentType }>`: Fann ógildugar undireindir: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ógildugt virði `{ $value }` fyri eginleikan `{ $attribute }`, brúkar virðið `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML útgáva { $version } fanst ikki.
       *[other] DoenetML útgáva { $version } fanst ikki. Brúkar útgávu { $fallback } í staðin
    }

## Reading the DoenetML

parse-invalid-doenetml = Ógildugt DoenetML: { $content }

parse-tag-missing-close-tag = Ógildugt DoenetML: Merkið `{ $tag }` hevur einki lokamerki. Væntaði eitt sjálvlokandi merki ella eitt `</{ $tagName }>`-merki.

parse-tag-error = Ógildugt DoenetML: Villa í merkinum `<{ $tagName }>`

parse-attribute-missing-value = Ógildugt DoenetML: Tað sær út til at ógildugi eginleikin `{ $attribute }` manglar eitt virði.

parse-attribute-invalid = Ógildugt DoenetML: Ógildugur eginleiki `{ $attribute }`

parse-attribute-value-invalid = Ógildugt DoenetML: Ógildugt eginleikavirði `{ $value }`

parse-attribute-value-quote-mismatch = Ógildugt DoenetML: Ógildugt eginleikavirði `{ $value }`. Sitatmerkini passa ikki saman. Tað sær út til at tú manglar eitt `{ $quote }`

parse-open-tag-name-missing = Ógildugt DoenetML: Fann eitt merki uttan navn, t.d. `<`

parse-tag-not-closed = Ógildugt DoenetML: Merkið `{ $tag }` varð ikki latið aftur (tað sær út til at `>` manglar).

parse-self-closing-tag-name-missing = Ógildugt DoenetML: Fann eitt merki uttan navn `<{ $content }>`

parse-self-closing-tag-not-closed = Ógildugt DoenetML: Merkið `{ $tag }` varð ikki latið aftur (tað sær út til at `/>` manglar).

parse-tag-invalid-attributes = Ógildugt DoenetML: Merkið `{ $tag }` er ikki gildugt. Tað kann hava skeivar eginleikar.

parse-close-tag-name-missing = Ógildugt DoenetML: Fann eitt lokamerki uttan navn, t.d. `</`

parse-attribute-value-unquoted = Eginleikavirði mugu standa millum sitatmerki: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Ógildugt DoenetML: Fann lokamerkið `{ $tag }`, men einki samsvarandi byrjanarmerki

parse-close-tag-mismatched = Ógildugt DoenetML: Ósamsvarandi lokamerki. Væntaði `</{ $expected }>`. Fann `{ $found }`

parser-node-unconvertible = Kundi ikki umseta knútin { $node } til ein Dast-knút.

## Names

name-attribute-invalid =
    Ógildugt eginleikanavn name='{ $name }'. { $reason ->
        [characters] Nøvn kunnu bert hava bókstavir, tøl, undirstrik ella bindistrik.
       *[start] Nøvn mugu byrja við einum bókstavi.
    }

component-name-invalid-start = Ógildugt eindarnavn "{ $name }". Nøvn mugu byrja við einum bókstavi.

## `<answer>` sugar

answer-video-watched-missing-video = Eitt svar av slagnum videoWatched má hava ein video-eginleika

answer-video-watched-video-not-reference = video-eginleikin á einum svari av slagnum videoWatched má vera ein tilvísing

answer-name-not-single-text = name-eginleikin á svarinum má hava eina einstaka tekstundireind

## Referencing another document

external-doenetml-recursion-limit = Kundi ikki heinta uttanhýsis DoenetML vegna ov nógv rekursiónsstig. Er ein ringtilvísing til?

external-doenetml-unavailable = Kundi ikki heinta DoenetML frá { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Ógildugt DoenetML heintað frá { $attribute }="{ $uri }": tað svaraði ikki til eindarslagið "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Eginleikin `{ $from }` er úreltur; brúka `{ $to }` í staðin.
       *[other] [deprecation] Eginleikin `{ $from }` á `<{ $component }>` er úreltur; brúka `{ $to }` í staðin.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Eginleikin `{ $from }` er úreltur og verður hunsaður, tí `{ $to }` eisini er tilskilað.
       *[other] [deprecation] Eginleikin `{ $from }` á `<{ $component }>` er úreltur og verður hunsaður, tí `{ $to }` eisini er tilskilað.
    }

deprecated-attribute-ignored = [deprecation] Eginleikin `{ $attribute }` á `<{ $component }>` er úreltur og verður hunsaður.


## Language coverage

pluralize-english-only = `<pluralize>` kann bert seta enskt í fleirtal, so teksturin verður latin óbroyttur í einum skjali sum er skrivað á { $locale }. Skriva fleirtalsformin beinleiðis, ella set hann við eginleikanum `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Eindin `<{ $tag }>` er ikki ein kend Doenet-eind.

schema-element-not-allowed-at-root = Eindin `<{ $tag }>` er ikki loyvd í rótini á skjalinum.

schema-element-not-allowed-inside = Eindin `<{ $tag }>` er ikki loyvd inni í `<{ $parent }>`.

schema-attribute-unrecognized = Eindin `<{ $tag }>` hevur ongan eginleika sum eitur `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Eginleikin `{ $attribute }` á eindini `<{ $tag }>` má vera ein listi har hvør lutur er ein av: { $allowed }
       *[other] Eginleikin `{ $attribute }` á eindini `<{ $tag }>` má vera ein av: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Ógildugt útgávunavn fyri select.  Útgávunavnið { $variantName } er í { $numOptions } møguleikum, men talið sum skal veljast er { $numToSelect }.

select-variant-name-without-options = Útgávur eru tilskilaðar fyri select, men ongir møguleikar eru tilskilaðir fyri møguliga útgávunavnið: { $variantName }.

select-variant-name-not-possible = Útgávunavnið { $variantName } sum er tilskilað fyri select er ikki eitt møguligt útgávunavn.

select-too-few-options = Ikki møguligt at velja { $numToSelect } eindir úr bert { $numOptions }.

select-from-sequence-too-few-values = Ikki møguligt at velja { $numToSelect } virði úr eini rað av longdini { $length }.

select-from-sequence-indices-count-mismatch = Talið av vísitølum sum eru tilskilað fyri select má svara til talið sum skal veljast

select-from-sequence-indices-not-integers = Øll vísitøl sum eru tilskilað fyri select mugu vera heiltøl

select-from-sequence-index-excluded = Eitt tilskilað vísital í selectfromsequence varð útihýst

select-from-sequence-indices-excluded-combination = Tilskilað vísitøl í selectfromsequence vóru ein útihýst samanseting

select-from-sequence-coprime-not-positive-integers = Ikki møguligt at velja innbyrðis primiskar samansetingar, tí tað eru ikki positiv heiltøl sum verða vald.

select-from-sequence-coprime-common-factor = Ikki møguligt at velja innbyrðis primisk tøl. Øll møgulig virði hava ein felags faktor. (Tey tilskilaðu virðini "from" ella "to" mugu vera innbyrðis primisk við "step".)

select-from-sequence-coprime-single-number = Ikki møguligt at velja innbyrðis primiskar samansetingar úr einum einstøkum tali sum ikki er 1.

select-from-sequence-excluded-too-many-combinations = Meir enn 70% av samansetingunum vórðu útihýstar í selectFromSequence

select-from-sequence-coprime-none-found = Kundi ikki velja innbyrðis primisk tøl. Øll møgulig virði hava ein felags faktor.

select-from-sequence-too-few-unique-values = Ikki møguligt at velja { $numToSelect } einstøk virði úr eini rað av longdini { $numPossibleValues }

select-prime-numbers-too-few-values = Ikki møguligt at velja { $numToSelect } virði úr einum lista av primtølum av longdini { $numValues }

select-prime-numbers-values-count-mismatch = Talið av virðum sum eru tilskilað fyri select má svara til talið sum skal veljast

select-prime-numbers-values-not-prime = Øll virði sum eru tilskilað fyri select prime number mugu vera á listanum av primtølum

select-prime-numbers-values-excluded-combination = Tey tilskilaðu virðini í selectPrimeNumbers vóru ein útihýst samanseting

select-prime-numbers-excluded-too-many-combinations = Meir enn 70% av samansetingunum vórðu útihýstar í selectPrimeNumbers

select-random-combination-fluke = Av einum ógvuliga ólíkligum tilvild kundi eingin samanseting av tilvildarligum virðum veljast

select-random-value-fluke = Av einum ógvuliga ólíkligum tilvild kundi einki tilvildarligt virði veljast
