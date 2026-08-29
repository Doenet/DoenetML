# Võro diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
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
# Võro is a written standard of its own and not an Estonian spelling; see
# `chrome.ftl` for the three places that shows, and `content.ftl` for the
# vocabulary. The `q` glottal stop is all over this file, in the plurals
# («viaq», «punktiq») and in the plural imperatives the advice sentences use
# («Kirotagõq», «Säädkeq»).
#
# The technical vocabulary is the international one Estonian also uses —
# «komponent», «atribuut», «funktsioon», «indeks» — because that is what a
# Võro-speaking author meets in the DoenetML documentation and in school.
#
# Võro counts in the same two categories English does, so every selection below
# keeps both branches — but a noun after a numeral stands in the partitive
# singular, so the two branches often differ only in the verb, and where the
# verb does not differ either they are written out alike rather than collapsed.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } jäetäs tähelepandmalda, ku ommaq annõduq mõlõmbaq otspunktiq
       *[other] { $attributes } jäetäs tähelepandmalda, ku ommaq annõduq mõlõmbaq otspunktiq
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } jäetäs tähelepandmalda, ku ommaq annõduq nii otspunkt ku ka keskpunkt
       *[other] { $attributes } jäetäs tähelepandmalda, ku ommaq annõduq nii otspunkt ku ka keskpunkt
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ei mõjuq ilma keskpunktilda

## `<line>`

line-points-undetermined-dimensions = Sirgõ läbi määrämäldäq mõõtmõga punktõ.

line-points-too-few-dimensions = Sirgõ piät läbi minemä vähämbält katõmõõtmõlidsist punktõst.

line-points-depend-on-variables = Sirgõ lätt läbi punktõst, miä sõltusõq muutuidsist: { $variables }.

line-equation-invalid-format = Vigalinõ sirgõ võrrandi vorming muutuin { $variable1 } ja { $variable2 }.

## `<ray>`

ray-overprescribed-through = Kiir om annõt through, endpoint ja direction abiga. Annõt through jäetäs tähelepandmalda.

ray-dimension-mismatch = numDimensions ei klapiq kiiren.

## `<vector>`

vector-overprescribed-head = Vektor om annõt head, tail ja displacement abiga. Annõt head jäetäs tähelepandmalda.

vector-dimension-mismatch = numDimensions ei klapiq vektorin.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` külge ei saaq tõmmadaq, selle et täl ei olõq olõkumuutujat nearestPoint.

constrain-to-without-nearest-point = `<{ $component }>` külge ei saaq piiridäq, selle et täl ei olõq olõkumuutujat nearestPoint.

constrain-to-interior-without-nearest-point = `<{ $component }>` seesmisse külge ei saaq piiridäq, selle et täl ei olõq olõkumuutujat nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition jäetäs tähelepandmalda mitte-reaseesmädse choiceInput'i man

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput'ilõ annõduq indeksiq jäetäs tähelepandmalda: näide arv ei klapiq alambidõ choice'idõ arvuga.

pretzel-indices-count-mismatch = problem'ilõ annõduq indeksiq jäetäs tähelepandmalda: näide arv ei klapiq alambidõ problem'idõ arvuga.

shuffle-indices-count-mismatch = shuffle'ilõ annõduq indeksiq jäetäs tähelepandmalda: näide arv ei klapiq komponentõ arvuga.

indices-ignored-out-of-range = { $component }'ilõ annõduq indeksiq jäetäs tähelepandmalda: mõnõq jääväq vaihmigust välläq.

pretzel-indices-repeated = pretzel'ilõ annõduq indeksiq jäetäs tähelepandmalda: mõnõq kordusõq.

pretzel-circuit-first-index = pretzel'ilõ mode="circuit" seen annõduq indeksiq jäetäs tähelepandmalda: edimäne indeks piät olõma 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Et `<{ $component }>` tüütäsi tekstilidsi alambidõga, piät olõma määrät atribuut `type`.

invalid-type-defaulting-to-math = Vigalinõ tüüp { $type } komponendile { $component }. Taa piät olõma math, text, number vai boolean. Pruugitas math'i.

string-not-valid-component-to-arrange = Sõnõq „{ $value }“ ei olõq { $component } jaos sobiv komponent. Taa jäetäs tähelepandmalda.

## Types and variables

invalid-type-defaulting-to-number = Vigalinõ tüüp { $type }; tüübis säetäs number.

invalid-variable-value = Vigalinõ muutuja väärtüs: `{ $value }`

## Variants

variant-index-must-be-number = Variandi indeks { $index } piät olõma arv

variant-index-must-be-integer = Variandi indeks { $index } piät olõma täüsarv

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ei olõq absoluutsidõ mõõtõ jaos tettü. Laiusõq säetäs suhtõlidsis.

side-by-side-absolute-margins = `<{ $component }>` ei olõq absoluutsidõ mõõtõ jaos tettü. Veereq säetäs suhtõlidsis.

side-by-side-no-block-child = Vigalinõ `<{ $component }>`: täl piät olõma vähämbält üts plokk-alamb.

## `<label>`

label-for-ignored-on-graphical = Graafilidsõ `<label>` atribuut `for` jäetäs tähelepandmalda.

label-for-must-resolve-to-one = `<label>` atribuut `for` piät osutama täpsele ütele komponendile.

label-for-unresolved = `<label>` atribuuti `for` es saaq komponendiga köütäq.

label-for-answer-with-authored-inputs = `<label>` atribuut `for` osutas `<answer>`'ile, minkal ommaq esiq kirotõduq sisestüsväläq; osutagõq otsõ väläle.

label-for-answer-without-input = `<label>` atribuut `for` osutas `<answer>`'ile, minkal ei olõq sisestüsvällä, midä sildistäq.

label-for-must-reference-input-or-answer = `<label>` atribuut `for` piät osutama sisestüsvälläle vai vastussõlõ.

## Accessibility

accessibility-short-description-or-decorative = Ligipääsemise peräst piät `<{ $component }>` olõma lühkü kirjeldüs vai piät tä olõma märgit ehtes.

accessibility-video-short-description = Ligipääsemise peräst piät `<video>` olõma lühkü kirjeldüs.

accessibility-input-short-description-or-label = Ligipääsemise peräst piät `<{ $component }>` olõma lühkü kirjeldüs vai silt.

accessibility-answer-input-short-description-or-label = Ligipääsemise peräst piät sisestüsvällä tegeväl `<answer>`'il olõma lühkü kirjeldüs vai silt.

accessibility-short-description-contains-math = Lühkeisin kirjeldüisin ei tohtnuq olla matõmaatilidsi komponentõ nigu `<{ $component }>`. Kirotagõq matõmaatiga sõnnoga vällä.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } kontrast om jao päälkirä teksti jaos ülearvo väiku (tummõ tiim) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vaja om vähämbält { $threshold }:1).
       *[other] { $colorName } kontrast om jao päälkirä teksti jaos ülearvo väiku ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vaja om vähämbält { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` läbi { $count } punkti ei olõq tettü, ku punktõl ei olõq arvväärtüisi.

circle-too-many-through-points = Ringjuunt läbi inämb ku 3 punkti ei saaq arvutaq.

circle-overprescribed-radius-center-points = Ringjuunt annõt raadiusõ, keskpunkti ja punktõga ei saaq arvutaq.

circle-center-with-multiple-points = Ringjuunt annõt keskpunktiga läbi inämb ku 1 punkti ei saaq arvutaq.

circle-radius-too-small = Ringjuunt ei saaq arvutaq: et katõ punkti vaihõlinõ kaugus om { $distance }, om annõt raadius { $radius } ülearvo väiku.

circle-radius-with-many-points = Ringjuunt läbi inämb ku katõ punkti annõt raadiusõga ei saaq kokko pandaq.

circle-invalid-center-or-through-points = Vigalinõ ringjuunõ keskpunkt vai punktiq.

circle-radius-center-with-multiple-points = Annõt keskpunktiga ringjuunõ raadiust läbi inämb ku 1 punkti ei saaq arvutaq.

circle-change-radius-non-numerical = Arvväärtüisildäq punktõga ringjuunõ raadiust ei saaq muutaq

circle-radius-with-points-non-numerical = Ringjuunt läbi inämb ku üte punkti annõt raadiusõga ei saaq kokko pandaq, ku arvväärtüisi ei olõq.

circle-change-center-non-numerical = Arvväärtüisildäq punktõ perrä määrädü ringjuunõ keskpunkti muutminõ ei olõq tettü.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Funktsiooni määrämispiirkunna mõõtmit om ülearvo veidüq. Piirkunnan om { $intervals } vaihmik, funktsioonil a { $inputs ->
            [one] { $inputs } sissepandmine
           *[other] { $inputs } sissepandmist
        }.
       *[other] Funktsiooni määrämispiirkunna mõõtmit om ülearvo veidüq. Piirkunnan om { $intervals } vaihmikku, funktsioonil a { $inputs ->
            [one] { $inputs } sissepandmine
           *[other] { $inputs } sissepandmist
        }.
    }

function-domain-invalid-format = Vigalinõ funktsiooni määrämispiirkunna vorming.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Funktsiooni arvväärtüsetä maksimum jäetäs tähelepandmalda.
        [minimum] Funktsiooni arvväärtüsetä miinimum jäetäs tähelepandmalda.
        [extremum] Funktsiooni arvväärtüsetä ekstreemum jäetäs tähelepandmalda.
        [point] Funktsiooni arvväärtüsetä punkt jäetäs tähelepandmalda.
        [slope] Funktsiooni arvväärtüsetä tõsu jäetäs tähelepandmalda.
       *[other] Funktsiooni arvväärtüsetä { $type } jäetäs tähelepandmalda.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Funktsiooni tühi maksimum jäetäs tähelepandmalda.
        [minimum] Funktsiooni tühi miinimum jäetäs tähelepandmalda.
        [extremum] Funktsiooni tühi ekstreemum jäetäs tähelepandmalda.
        [point] Funktsiooni tühi punkt jäetäs tähelepandmalda.
       *[other] Funktsiooni tühi { $type } jäetäs tähelepandmalda.
    }

function-points-too-close = Funktsioonin om kats punkti, miä ommaq tõõsõlõ ülearvo lähkün. Funktsiooni ei saaq määrädäq.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Funktsiooni iteratsiooniq ommaq võimalikuq õnnõ sys, ku sissepandmiisi arv om sama suur ku vällämiisi arv. Seol funktsioonil om { $inputs } sissepandmine ja { $outputs ->
            [one] { $outputs } vällämine
           *[other] { $outputs } vällämist
        }.
       *[other] Funktsiooni iteratsiooniq ommaq võimalikuq õnnõ sys, ku sissepandmiisi arv om sama suur ku vällämiisi arv. Seol funktsioonil om { $inputs } sissepandmist ja { $outputs ->
            [one] { $outputs } vällämine
           *[other] { $outputs } vällämist
        }.
    }

## `<sequence>`

sequence-invalid-length = Vigalinõ jada pikkus. Taa piät olõma mittenegatiivnõ täüsarv.

sequence-invalid-step = Vigalinõ jada samm. { $type } tüüpi jada man piät taa olõma arv.

sequence-invalid-endpoint-number = Vigalinõ arvjada „{ $attribute }“. Taa piät olõma arv.

sequence-invalid-endpoint-letters = Vigalinõ tähejada „{ $attribute }“. Taa piät olõma tähti kombinatsioon.

sequence-invalid-endpoint = Vigalinõ jada „{ $attribute }“.

select-from-sequence-coprime-not-numbers = coprime jäetäs tähelepandmalda, selle et arvõ ei valitaq

select-from-sequence-coprime-with-exclude-combinations = coprime jäetäs tähelepandmalda, selle et om määrät excludeCombinations

## Resolving a `target`

target-not-found = Vigalinõ `<{ $source }>` target: sihti es lövvätäq.

target-state-variable-not-found = Vigalinõ `<{ $source }>` target: `<{ $component }>` man ei olõq olõkumuutujat nimega „{ $property }“.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` muutujaq piäväq olõma tõõsõq ku sõltumaldaq muutuja.

ode-system-duplicate-variable-names = Diferentsiaalvõrrandidõ hüväpoolõ funktsioonõ ei saaq määrädäq korduvidõ sõltuvidõ muutujidõ nimmiga.

ode-system-rhs-function-error = Diferentsiaalvõrrandi hüvvä poolt ei saaq määrädäq. Viga mathjs-funktsiooni luumisõl.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Nulka { $count } sirgõ vaihõl ei saaq määrädäq

angle-invalid-through-point = Vigalinõ punkt `<angle>` atribuudin through

parabola-vertex-too-many-points = Annõt tipuga parabuul läbi inämb ku 1 punkti ei olõq tettü.

parabola-too-many-points = Parabuul läbi inämb ku 3 punkti ei olõq tettü.

intersection-too-many-items = Inämb ku katõ objekti lõikminõ ei olõq tettü

## Other math components

ionic-compound-not-two-ions = Muid iuunlidsi ütendit ku katõst iuunist ei olõq tettü.

ionic-compound-needs-cation-and-anion = Iuunlidsõq ütendiq ommaq tettüq õnnõ üte katiuuni ja üte aniuuni jaos.

solve-equations-cannot-evaluate = Võrrandit ei saaq lahendaq, selle et tuud es saaq arvutaq: { $equation }

math-operators-operand-number-required = Matõmaatilidsõ operandi vällävõtmisõs piät määrämä operandNumber.

eigen-decomposition-failed = Maatriksi umaväärtüisi es saaq arvutaq

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameetrit { $parameters } mustrin ei olõq, nii et taa klapis alati tühäga.
       *[other] `<matchesPattern>`: parameetrit { $parameters } mustrin ei olõq, nii et naaq klapisõq alati tühäga.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" ei olõq arvosaadav. Väärtüs piät olõma none, medium, dense vai kats tühikuga eräldedüt positiivset arvo, näütüses grid="1 0.5". Ruudustikku ei joonistõdaq.

## Vector and slope fields

field-function-wrong-num-outputs =
    `<{ $component }>` vajas funktsiooni, minkal om { $expected ->
        [one] üts vällämine, tõsu y' egän punktin, näütüses `y - x`
       *[other] kats vällämist, vektor egän punktin, näütüses `(y, -x)`
    }, a annõt funktsioonil om { $found ->
        [one] { $found } vällämine
       *[other] { $found } vällämist
    }. { $alternative ->
        [none] Midägi ei joonistõdaq.
       *[other] Tuu funktsiooni jaos om komponent `<{ $alternative }>`. Midägi ei joonistõdaq.
    }

field-function-attribute-ignored-with-child = Atribuut `function` jäetäs tähelepandmalda, selle et funktsioon om annõt ka komponendi seen; pruugitas tuud, miä om seen. Andkõq funktsioon õnnõ ütel viil.

field-variables-ignored =
    `<{ $component }>`: atribuut `variables` nimetäs komponendi seen otsõ kirotõdu avaldusõ muutujaq. { $reason ->
        [function-child] Funktsioon om siin annõt `<function>` alambana, miä nimetäs esiq uma muutujaq, nii et `variables` jäetäs tähelepandmalda.
       *[no-expression] Säänest avaldust siin ei olõq annõt, nii et `variables` jäetäs tähelepandmalda.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ei olõq prefigure-näütäjän toetõt; pruugitas hüväpoolidsõ kotusõ käütümist.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ei olõq prefigure-näütäjän toetõt; pruugitas päälmädse kotusõ käütümist.

prefigure-invalid-axis-bounds = `<graph>`: vigalidsõq telgi piiriq prefigure'is ümbrepandmisõl; pruugitas vaikimisi bbox'i (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: vigalinõ lajus prefigure'is ümbrepandmisõl; pruugitas vaikimisi diagrammi lajust 425.

prefigure-invalid-aspect-ratio = `<graph>`: vigalinõ aspectRatio prefigure'is ümbrepandmisõl; pruugitas vaikimisi külgi suhõt 1.

prefigure-grid-spacing-too-fine = `<graph>`: ruudustigu samm om telgi piire jaos ülearvo peenükene; prefigure-näütäjän jäetäs ruudustik ärq.

prefigure-annotations-not-rendered = `<graph>`: väläspuul PreFigure-näütäjät märkmiisi ei joonistõdaq.

multiple-annotations-children = `<graph>`'in löüti mitu alambat `<annotations>`; kõik pääle perämädse jäetäs tähelepandmalda.

## Referring to other components

copy-unrecognized-component-type = Tundmaldaq komponenditüüpi ei saaq laendaq ega kopiiriq: { $type }.

copy-prop-not-found = Umadust { $property } es lövvätäq { $component } tüüpi komponendist

collect-no-source = collect'ile es lövvätäq allikat.

collect-invalid-component-type = `<{ $component }>` tüüpi komponentõ ei saaq kokko korjadaq, selle et taa om vigalinõ komponenditüüp.

reference-index-unavailable = Indeksile `{ $reference }` ei saaq viidädäq

## `<callAction>`

component-action-unavailable = Komponendin `{ $reference }` ei saaq kutsudaq { $action }

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Andmidõ kujo om vigalinõ. Ridu pikkusõq ommaq esiqsugumadsõq. Löüt kotussõn componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Andmin ommaq korduvaq veerünimeq. Löüt kotussõn componentIdx :{ $componentIdx }

data-frame-missing-column-name = Andmil om veerünimi puudu. Löüt kotussõn componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Seo vastussõ award tugõnõs answer-sildi hindä ärqsaadõdulõ vastussõlõ, miä tuu kaasa uutmalda käütümise.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` määrämine `<answer>`'ile, miä om `sectionWideCheckWork`-konteineri seen, ei mõjuq, selle et katsidõ arvo määräs konteiner. Määrgeq `maxNumAttempts` konteinerile.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` määrämine `sectionWideCheckWork`-konteinerile, miä esiq om tõõsõ `sectionWideCheckWork`-konteineri seen, ei mõjuq, selle et katsidõ arvo määräs välimäne konteiner. Määrgeq `maxNumAttempts` välimädsele konteinerile.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Atribuut { $attributes } ei mõjuq, ku symbolicEquality ei olõq määrät.
       *[other] Atribuudiq { $attributes } ei mõjuq, ku symbolicEquality ei olõq määrät.
    }

answer-invalid-type = Vigalinõ answer'i tüüp: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Komponendil `<{ $component }>` ei olõq nimme, nii et tuud ei saaq pruukiq muuduli atribuudina

module-attribute-name-already-defined = Komponenti `<{ $component } name="{ $name }">` ei saaq pruukiq muuduli atribuudina, selle et komponenditüübil `<module>` om jo atribuut „{ $name }“ olõman.

conditional-content-condition-ignored = Atribuut `condition` jäetäs tähelepandmalda `<conditionalContent>` komponendi man, minkal ommaq alambaq case vai else.

slider-markers-type-mismatch = Markerite tüüp ei klapiq liuguri tüübiga.

pretzel-problem-needs-statement-and-answer = Vigalinõ pretzel: egäl `<problem>`'il piät olõma üts `<statement>` ja üts `<answer>`.

pretzel-circuit-first-problem-distractor = Vigalinõ pretzel: mode="circuit" man ei saaq edimäne `<problem>` olla essütäjä.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Vigalinõ väärtüs { $values } atribuudile `{ $attribute }`; taa jäetäs tähelepandmalda.
       *[other] Vigalidsõq väärtüseq { $values } atribuudile `{ $attribute }`; naaq jäetäs tähelepandmalda.
    }

attribute-must-be-references = Vigalinõ väärtüs `{ $value }` atribuudile `{ $attribute }`. Atribuut piät kokko saama viidetest, miä nakkasõq märgiga `$`.

math-input-invalid-function-names = <mathInput>: vigalidsõq funktsiooninimeq atribuudin { $attribute } jäeti tähelepandmalda: { $names }. Ega nime näüdätäv osa piät olõma vähämbält 2 märki (tähüq vai kriipsuq); tuu perrä või tullaq valikulinõ `|<mathspeak alternatiiv>`.

## Building components from the source

component-type-invalid = Vigalinõ komponenditüüp: `<{ $componentType }>`

attribute-repeated = Atribuuti { $attribute } ei saaq kortaq.

attribute-invalid-for-component = Vigalinõ atribuut „{ $attribute }“ `<{ $componentType }>` tüüpi komponendile.

## Style definition contrast

style-definition-insufficient-contrast =
    Stiilimäärätüsel { $styleNumber } om ülearvo väiku kontrast { $context ->
        [text-on-background] teksti värmil tagapõhja värmi kotsilõ
        [high-contrast] korgõ kontrastiga värmil lõuendi kotsilõ
        [line] juunõ värmil lõuendi kotsilõ
        [marker] markerite värmil lõuendi kotsilõ
       *[text-on-canvas] teksti värmil lõuendi kotsilõ
    }{ $mode ->
        [dark] { " (tummõ tiim)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vaja om vähämbält { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Ku ka stiilimäärätüsen { $styleNumber } annõduil värmel om hellä tiimi jaos küländ kontrasti, sis naist tuudõduq tummõ tiimi värmiq annaseq teksti ja tagapõhja vaihõl ülearvo väiku kontrasti ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vaja om vähämbält { $threshold }:1). { $suggestion ->
        [available] Et tummõn tiimin olõsiq küländ kontrasti, kas suurõndagõq hellä tiimi kontrasti (näütüses { $lightAttribute }="{ $lightColor }") vai säädkeq tummõ tiimi värm esiq (näütüses { $darkAttribute }="{ $darkColor }").
       *[none] Et tummõn tiimin olõsiq küländ kontrasti, suurõndagõq hellä tiimi kontrasti vai säädkeq tuudõduq värmiq esiq textColorDarkMode ja/vai backgroundColorDarkMode abiga.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ku ka stiilimäärätüsen { $styleNumber } annõdul teksti värmil om hellä tiimi jaos küländ kontrasti, sis tuust tuudõt tummõ tiimi teksti värm and lõuendi kotsilõ ülearvo väiku kontrasti ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; vaja om vähämbält { $threshold }:1). { $suggestion ->
        [available] Et tummõn tiimin olõsiq küländ kontrasti, kas suurõndagõq hellä tiimi kontrasti (näütüses textColor="{ $lightColor }") vai säädkeq tummõ tiimi värm esiq (näütüses textColorDarkMode="{ $darkColor }").
       *[none] Et tummõn tiimin olõsiq küländ kontrasti, suurõndagõq hellä tiimi kontrasti vai säädkeq tuudõt värm esiq textColorDarkMode abiga.
    }

section-multiple-style-palettes = Jago või valliq õnnõ üte <stylePalette>; pruugitas perämäst.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } ainuldsi variantõ ei saaq määrädäq, selle et numToSelect ei olõq mittenegatiivnõ täüsarv.

variant-num-to-select-not-constant-number = { $component } ainuldsi variantõ ei saaq määrädäq, selle et numToSelect ei olõq püsüv arv.

variant-with-replacement-not-constant-boolean = { $component } ainuldsi variantõ ei saaq määrädäq, selle et withReplacement ei olõq püsüv tõõväärtüs.

variant-select-weight-disables-unique = select'i ainuldsõq variandiq ommaq vällä lülidedüq, ku mõnõl valikul om määrät selectWeight vai selectForVariants

variant-coprime-undetermined = { $component } ainuldsi variantõ ei saaq määrädäq, selle et ei saaq tiidäq, kas coprime om alati vale.

variant-attribute-not-constant = { $component } ainuldsi variantõ ei saaq määrädäq, selle et { $attribute } ei olõq konstant.

variant-attribute-not-number = { $component } ainuldsi variantõ ei saaq määrädäq, selle et { $attribute } ei olõq arv.

variant-attribute-wrong-type-for-sequence =
    { $type } tüüpi { $component } ainuldsi variantõ ei saaq määrädäq, selle et { $attribute } ei olõq { $expected ->
        [letters-combination] tähti kombinatsioon
        [math-expression] sobiv matõmaatilinõ avaldus
        [integer] täüsarv
       *[number] arv
    }.

variant-length-not-integer = { $component } ainuldsi variantõ ei saaq määrädäq, selle et length ei olõq täüsarv.

variant-sort-not-implemented = { $component } ainuldsõq variandiq sort'iga ei olõq tettüq

variant-exclude-combinations-not-implemented = { $component } ainuldsõq variandiq excludeCombinations'iga ei olõq tettüq

variant-math-exclude-not-implemented = math tüüpi { $component } ainuldsõq variandiq exclude'iga ei olõq tettüq

variant-non-constant-exclude-not-implemented = { $component } ainuldsõq variandiq mittepüsüvä exclude'iga ei olõq tettüq

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ei olõq graafigu prefigure-näütäjän toetõt; perätulõja jäeti vaihõlõ.

prefigure-descendant-invalid-geometry = { $subject }: lõpmaldaq vai puudulinõ geomeetria; perätulõja jäeti vaihõlõ.

prefigure-curve-label-omitted = { $subject }: sildiq ei olõq ümbrepantuil kõvvõraelemendel toetõduq; silt jäeti ärq.

prefigure-curve-unsupported-definition-type = { $subject }: toetamaldaq kõvvõrafunktsiooni määrätüse tüüp „{ $definitionType }“; perätulõja jäeti vaihõlõ.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves atribuut flipFunctions ei olõq toetõt; perätulõja jäeti vaihõlõ.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves toetas õnnõ valõmiga annõtuid alambit funktsioonõ; perätulõja jäeti vaihõlõ.

prefigure-label-position-unsupported =
    { $subject }: toetamaldaq labelPosition „{ $labelPosition }“ { $labelKind ->
        [line-family] sirgidõ pere sildi jaos
       *[point] punkti sildi jaos
    }; pruugitas PreFigure vaikimisi juundust.

prefigure-fill-style-unsupported = { $subject }: täütmisstiil „{ $fillStyle }“ ei olõq PreFigure'in toetõt; pruugitas ütelist täüdüst.

prefigure-line-style-unknown = { $subject }: tundmaldaq juunõstiil „{ $lineStyle }“ jäeti PreFigure vällämisest ärq.

prefigure-marker-style-mapped-to-diamond = { $subject }: markeristiil „{ $markerStyle }“ köüdeti PreFigure stiiliga „diamond“.

prefigure-marker-style-unsupported = { $subject }: markeristiil „{ $markerStyle }“ ei olõq PreFigure'in toetõt; pruugitas vaikimisi stiili.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: vigalinõ `ref`; sihti ei saaq köütäq. Märkminõ jäeti ärq.

annotation-ref-multiple-targets = `<annotation>`: `ref` köüdi mitu sihti; pruugitas edimäst.

annotation-ref-outside-graph = `<annotation>`: vigalinõ `ref`; siht om tedä hoitvast graafigust välläspuul. Märkminõ jäeti ärq.

annotation-ref-unsupported-target = `<annotation>`: vigalinõ `ref`; siht ei olõq prefigure'is ümbrepandmisõl toetõt graafilinõ objekt. Märkminõ jäeti ärq.

annotation-text-missing = `<annotation>`: `text` om puudu vai tühi; antas vällä tühi tekst.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Löüti ringsõltuvus.
       *[other] Löüti ringsõltuvus, minka seen om komponent `<{ $componentType }>`.
    }

reference-no-referent = Viitele es lövvätäq objekti: `{ $reference }`

reference-multiple-referents = Viitele löüti mitu objekti: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Vigalinõ `<{ $componentType }>` atribuudi { $attribute } vorming.

children-invalid = Vigalidsõq alambaq `<{ $componentType }>` jaos: löüti vigalidsi alambit: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Vigalinõ väärtüs `{ $value }` atribuudile `{ $attribute }`; pruugitas väärtüst `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML-i versiooni { $version } es lövvätäq.
       *[other] DoenetML-i versiooni { $version } es lövvätäq. Pruugitas versiooni { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Vigalinõ DoenetML: { $content }

parse-tag-missing-close-tag = Vigalinõ DoenetML: sildil `{ $tag }` ei olõq kinnipandvat silti. Uutõdi esiqkinnipandvat silti vai silti `</{ $tagName }>`.

parse-tag-error = Vigalinõ DoenetML: viga sildin `<{ $tagName }>`

parse-attribute-missing-value = Vigalinõ DoenetML: atribuudil `{ $attribute }` paistus väärtüs puudu olõvat.

parse-attribute-invalid = Vigalinõ DoenetML: vigalinõ atribuut `{ $attribute }`

parse-attribute-value-invalid = Vigalinõ DoenetML: vigalinõ atribuudi väärtüs `{ $value }`

parse-attribute-value-quote-mismatch = Vigalinõ DoenetML: vigalinõ atribuudi väärtüs `{ $value }`. Jutumärgiq ei klapiq. Paistus puudu olõvat `{ $quote }`

parse-open-tag-name-missing = Vigalinõ DoenetML: löüti nimeldäq silt, näütüses `<`

parse-tag-not-closed = Vigalinõ DoenetML: silt `{ $tag }` ei olõq kinniq pant (paistus puudu olõvat `>`).

parse-self-closing-tag-name-missing = Vigalinõ DoenetML: löüti nimeldäq silt `<{ $content }>`

parse-self-closing-tag-not-closed = Vigalinõ DoenetML: silt `{ $tag }` ei olõq kinniq pant (paistus puudu olõvat `/>`).

parse-tag-invalid-attributes = Vigalinõ DoenetML: silt `{ $tag }` ei olõq sobiv. Täl või ollaq valõq atribuudiq.

parse-close-tag-name-missing = Vigalinõ DoenetML: löüti nimeldäq kinnipandva silt, näütüses `</`

parse-attribute-value-unquoted = Atribuutõ väärtüseq piäväq olõma jutumärke seen: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Vigalinõ DoenetML: löüti kinnipandva silt `{ $tag }`, a vastavat vallalõtegevät silti ei olõq

parse-close-tag-mismatched = Vigalinõ DoenetML: klapmaldaq kinnipandva silt. Uutõdi `</{ $expected }>`. Löüti `{ $found }`

parser-node-unconvertible = Sõlmõ { $node } es saaq ümbre pandaq Dast-sõlmõs.

## Names

name-attribute-invalid =
    Vigalinõ atribuut name='{ $name }'. { $reason ->
        [characters] Nimin või ollaq õnnõ tähti, numbrit, alakriipsõ vai sidekriipsõ.
       *[start] Nimeq piäväq alostama tähega.
    }

component-name-invalid-start = Vigalinõ komponendi nimi „{ $name }“. Nimeq piäväq alostama tähega.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched tüüpi answer'il piät olõma atribuut video

answer-video-watched-video-not-reference = videoWatched tüüpi answer'i atribuut video piät olõma viideq

answer-name-not-single-text = answer'i atribuudil name piät olõma täpsele üts tekstilinõ alamb

## Referencing another document

external-doenetml-recursion-limit = Välist DoenetML-i es saaq kätte, selle et rekursioonitasõmit om ülearvo pallo. Kas ei olõq ringviidet?

external-doenetml-unavailable = DoenetML-i es saaq kätte aadrõssist { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Aadrõssist { $attribute }="{ $uri }" saadi vigalinõ DoenetML: taa es klapiq komponenditüübiga „{ $componentType }“

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribuut `{ $from }` om vana; pruukkõq tuu asõmõl `{ $to }`.
       *[other] [deprecation] `<{ $component }>` atribuut `{ $from }` om vana; pruukkõq tuu asõmõl `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribuut `{ $from }` om vana ja taa jäetäs tähelepandmalda, selle et määrät om ka `{ $to }`.
       *[other] [deprecation] `<{ $component }>` atribuut `{ $from }` om vana ja taa jäetäs tähelepandmalda, selle et määrät om ka `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` atribuut `{ $attribute }` om vana ja taa jäetäs tähelepandmalda.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` atribuut `{ $attribute }` om vana; pruukkõq tuu asõmõl alambat `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` atribuudi `{ $attribute }` väärtüs `{ $value }` om vana; pruukkõq tuu asõmõl `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` mõist mitmust tetäq õnnõ inglüse keelen, nii et { $locale } keelen kirotõdun dokumendin jääs taa tekst muutmalda. Kirotagõq mitmusõvorm esiq vai määrgeq taa atribuudiga `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Element `<{ $tag }>` ei olõq tunnõt Doeneti element.

schema-element-not-allowed-at-root = Element `<{ $tag }>` ei olõq dokumendi juurõn lubat.

schema-element-not-allowed-inside = Element `<{ $tag }>` ei olõq `<{ $parent }>` seen lubat.

schema-attribute-unrecognized = Elemendil `<{ $tag }>` ei olõq atribuuti nimega `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Elemendi `<{ $tag }>` atribuut `{ $attribute }` piät olõma nimekiri, minka ega liigõq om üts naist: { $allowed }
       *[other] Elemendi `<{ $tag }>` atribuut `{ $attribute }` piät olõma üts naist: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Vigalinõ select'i variandi nimi. Variandi nimi { $variantName } om { $numOptions } valikun, a valliq tulõ { $numToSelect }.

select-variant-name-without-options = select'ile ommaq määrädüq variandiq, a ütegi võimaligu variandi nime jaos ei olõq valikit: { $variantName }.

select-variant-name-not-possible = select'ile määrät variandi nimi { $variantName } ei olõq võimalik variandi nimi.

select-too-few-options = Ei saaq valliq { $numToSelect } komponenti õnnõ { $numOptions } siäst.

select-from-sequence-too-few-values = Ei saaq valliq { $numToSelect } väärtüst { $length } pikkusõga jadast.

select-from-sequence-indices-count-mismatch = select'ile määrädüide indekside arv piät klapma valitavidõ arvuga

select-from-sequence-indices-not-integers = Kõik select'ile määrädüq indeksiq piäväq olõma täüsarvoq

select-from-sequence-index-excluded = Määrät selectfromsequence'i indeks oll' vällä jätet

select-from-sequence-indices-excluded-combination = Määrädüq selectfromsequence'i indeksiq olliq vällä jätet kombinatsioon

select-from-sequence-coprime-not-positive-integers = Ütistegürildäq kombinatsioonõ ei saaq valliq, selle et positiivseid täüsarvõ ei valitaq.

select-from-sequence-coprime-common-factor = Ütistegürildäq arvõ ei saaq valliq. Kõigil võimaligul väärtüisil om ütine tegür. (Määrädüq "from" vai "to" väärtüseq piäväq olõma "step"'iga ütistegürildäq.)

select-from-sequence-coprime-single-number = Ütistegürildäq kombinatsioonõ ei saaq valliq ütest arvost, miä ei olõq 1.

select-from-sequence-excluded-too-many-combinations = selectFromSequence'in jäeti vällä üle 70 % kombinatsioonõst

select-from-sequence-coprime-none-found = Ütistegürildäq arvõ es saaq valliq. Kõigil võimaligul väärtüisil om ütine tegür.

select-from-sequence-too-few-unique-values = Ei saaq valliq { $numToSelect } esiqsugumast väärtüst { $numPossibleValues } pikkusõga jadast

select-prime-numbers-too-few-values = Ei saaq valliq { $numToSelect } väärtüst { $numValues } pikkusõga algarvõ nimekiräst

select-prime-numbers-values-count-mismatch = select'ile määrädüide väärtüisi arv piät klapma valitavidõ arvuga

select-prime-numbers-values-not-prime = Kõik select prime number'ile määrädüq väärtüseq piäväq olõma algarvõ nimekirän

select-prime-numbers-values-excluded-combination = Määrädüq selectPrimeNumbers'i väärtüseq olliq vällä jätet kombinatsioon

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers'in jäeti vällä üle 70 % kombinatsioonõst

select-random-combination-fluke = Väega ebatõõnäolidsõ juhussõ peräst es saaq valliq juhuslidsi väärtüisi kombinatsiooni

select-random-value-fluke = Väega ebatõõnäolidsõ juhussõ peräst es saaq valliq juhuslikku väärtüst
