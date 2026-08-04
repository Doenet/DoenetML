# Icelandic diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Icelandic counts in the same two categories English does, `one` and `other`,
# and keeps both branches wherever the wording differs. Where it does not, the
# select is dropped rather than written out twice: `bil` is a neuter noun
# spelled the same in the plural, so counting intervals changes nothing but the
# numeral in front of it.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } er hunsað þegar tveir endapunktar eru tilgreindir
       *[other] { $attributes } eru hunsuð þegar tveir endapunktar eru tilgreindir
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } er hunsað þegar bæði endapunktur og miðpunktur eru tilgreind
       *[other] { $attributes } eru hunsuð þegar bæði endapunktur og miðpunktur eru tilgreind
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset hefur engin áhrif án miðpunkts

## `<line>`

line-points-undetermined-dimensions = Lína gegnum punkta með óákvarðaðar víddir.

line-points-too-few-dimensions = Lína verður að liggja gegnum punkta með að minnsta kosti tvær víddir.

line-points-depend-on-variables = Línan liggur gegnum punkta sem eru háðir breytum: { $variables }.

line-equation-invalid-format = Ógilt snið á jöfnu línu í breytunum { $variable1 } og { $variable2 }.

## `<ray>`

ray-overprescribed-through = Geislinn er ákvarðaður af through, endpoint og direction.  Hunsa tilgreint through.

ray-dimension-mismatch = Ósamræmi í numDimensions í geisla.

## `<vector>`

vector-overprescribed-head = Vigurinn er ákvarðaður af head, tail og displacement.  Hunsa tilgreint head.

vector-dimension-mismatch = Ósamræmi í numDimensions í vigri.

## Attracting and constraining

attract-to-without-nearest-point = Ekki er hægt að draga að `<{ $component }>` þar sem einingin hefur ekki ástandsbreytuna nearestPoint.

constrain-to-without-nearest-point = Ekki er hægt að þvinga að `<{ $component }>` þar sem einingin hefur ekki ástandsbreytuna nearestPoint.

constrain-to-interior-without-nearest-point = Ekki er hægt að þvinga að innra svæði `<{ $component }>` þar sem einingin hefur ekki ástandsbreytuna nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition er hunsað fyrir choiceInput sem er ekki inline

## Ordering children by index

choice-input-indices-count-mismatch = Hunsa vísa sem tilgreindir eru fyrir choiceInput þar sem fjöldi þeirra samsvarar ekki fjölda choice-undireininga.

pretzel-indices-count-mismatch = Hunsa vísa sem tilgreindir eru fyrir problem þar sem fjöldi þeirra samsvarar ekki fjölda problem-undireininga.

shuffle-indices-count-mismatch = Hunsa vísa sem tilgreindir eru fyrir shuffle þar sem fjöldi þeirra samsvarar ekki fjölda eininga.

indices-ignored-out-of-range = Hunsa vísa sem tilgreindir eru fyrir { $component } þar sem sumir þeirra eru utan bils.

pretzel-indices-repeated = Hunsa vísa sem tilgreindir eru fyrir pretzel þar sem sumir þeirra endurtaka sig.

pretzel-circuit-first-index = Hunsa vísa sem tilgreindir eru fyrir pretzel í circuit-ham þar sem fyrsti vísirinn verður að vera 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Til að `<{ $component }>` virki með strengjaundireiningum verður að tilgreina eigindina `type`.

invalid-type-defaulting-to-math = Ógild tegund { $type } fyrir eininguna { $component }. Hún verður að vera ein af math, text, number eða boolean. Nota math í staðinn.

string-not-valid-component-to-arrange = Strengurinn "{ $value }" er ekki gild eining til að { $component }. Hunsa hann.

## Types and variables

invalid-type-defaulting-to-number = Ógild tegund { $type }, set tegundina á number.

invalid-variable-value = Ógilt gildi breytu: `{ $value }`

## Variants

variant-index-must-be-number = Útgáfuvísirinn { $index } verður að vera tala

variant-index-must-be-integer = Útgáfuvísirinn { $index } verður að vera heiltala

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` er ekki útfært fyrir algildar mælingar. Set breiddirnar sem hlutfallslegar.

side-by-side-absolute-margins = `<{ $component }>` er ekki útfært fyrir algildar mælingar. Set spássíurnar sem hlutfallslegar.

side-by-side-no-block-child = Ógilt `<{ $component }>`: það verður að hafa að minnsta kosti eina blokkarundireiningu.

## `<label>`

label-for-ignored-on-graphical = Eigindin `for` á myndrænu `<label>` er hunsuð.

label-for-must-resolve-to-one = Eigindin `for` á `<label>` verður að leysast upp í nákvæmlega eina einingu.

label-for-unresolved = Ekki tókst að leysa eigindina `for` á `<label>` upp í einingu.

label-for-answer-with-authored-inputs = Eigindin `for` á `<label>` vísar í `<answer>` með sérstaklega skrifuðum inntaksreitum; vísaðu beint í inntaksreitinn.

label-for-answer-without-input = Eigindin `for` á `<label>` vísar í `<answer>` sem hefur engan inntaksreit til að merkja.

label-for-must-reference-input-or-answer = Eigindin `for` á `<label>` verður að vísa í inntaksreit eða í svar.

## Accessibility

accessibility-short-description-or-decorative = Vegna aðgengis verður `<{ $component }>` annaðhvort að hafa stutta lýsingu eða vera tilgreint sem skreyting.

accessibility-video-short-description = Vegna aðgengis verður `<video>` að hafa stutta lýsingu.

accessibility-input-short-description-or-label = Vegna aðgengis verður `<{ $component }>` að hafa stutta lýsingu eða merki.

accessibility-answer-input-short-description-or-label = Vegna aðgengis verður `<answer>` sem býr til inntaksreit að hafa stutta lýsingu eða merki.

accessibility-short-description-contains-math = Stuttar lýsingar ættu ekki að innihalda stærðfræðieiningar eins og `<{ $component }>`. Skrifaðu alla stærðfræði með orðum.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } hefur ekki nægileg birtuskil fyrir texta kaflafyrirsagnar (dökkur hamur) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; krefst að minnsta kosti { $threshold }:1).
       *[other] { $colorName } hefur ekki nægileg birtuskil fyrir texta kaflafyrirsagnar ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; krefst að minnsta kosti { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` gegnum { $count } punkta er ekki útfært þegar punktarnir hafa ekki tölugildi.

circle-too-many-through-points = Ekki er hægt að reikna hring gegnum fleiri en 3 punkta.

circle-overprescribed-radius-center-points = Ekki er hægt að reikna hring með tilgreindum geisla, miðju og punktum.

circle-center-with-multiple-points = Ekki er hægt að reikna hring með tilgreindri miðju gegnum fleiri en einn punkt.

circle-radius-too-small = Ekki er hægt að reikna hringinn: þar sem fjarlægðin milli punktanna tveggja er { $distance } er tilgreindi geislinn { $radius } of lítill.

circle-radius-with-many-points = Ekki er hægt að búa til hring gegnum fleiri en tvo punkta með tilgreindum geisla.

circle-invalid-center-or-through-points = Ógild miðja eða punktar hrings.

circle-radius-center-with-multiple-points = Ekki er hægt að reikna geisla hrings með tilgreindri miðju gegnum fleiri en einn punkt.

circle-change-radius-non-numerical = Ekki er hægt að breyta geisla hrings þegar punktarnir hafa ekki tölugildi

circle-radius-with-points-non-numerical = Ekki er hægt að búa til hring gegnum fleiri en einn punkt með tilgreindum geisla þegar tölugildi liggja ekki fyrir.

circle-change-center-non-numerical = Ekki hefur verið útfært að breyta miðju hrings gegnum punkta án tölugilda.

## `<function>`

function-domain-insufficient-dimensions =
    Ónógar víddir fyrir formengi falls. Formengið hefur { $intervals } bil en fallið hefur { $inputs ->
        [one] { $inputs } inntak
       *[other] { $inputs } inntök
    }.

function-domain-invalid-format = Ógilt snið á formengi falls.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Hunsa hágildi falls sem er ekki tölulegt.
        [minimum] Hunsa lággildi falls sem er ekki tölulegt.
        [extremum] Hunsa útgildi falls sem er ekki tölulegt.
        [point] Hunsa punkt falls sem er ekki tölulegur.
        [slope] Hunsa hallatölu falls sem er ekki töluleg.
       *[other] Hunsa { $type } falls sem er ekki tölulegt.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Hunsa tómt hágildi falls.
        [minimum] Hunsa tómt lággildi falls.
        [extremum] Hunsa tómt útgildi falls.
        [point] Hunsa tóman punkt falls.
       *[other] Hunsa tómt { $type } falls.
    }

function-points-too-close = Fallið inniheldur tvo punkta sem eru of nálægt hvor öðrum. Ekki er hægt að skilgreina fallið.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Ítranir falls eru aðeins mögulegar ef fjöldi inntaka er jafn fjölda úttaka. Þetta fall hefur { $inputs } inntak og { $outputs ->
            [one] { $outputs } úttak
           *[other] { $outputs } úttök
        }.
       *[other] Ítranir falls eru aðeins mögulegar ef fjöldi inntaka er jafn fjölda úttaka. Þetta fall hefur { $inputs } inntök og { $outputs ->
            [one] { $outputs } úttak
           *[other] { $outputs } úttök
        }.
    }

## `<sequence>`

sequence-invalid-length = Ógild lengd rununnar.  Hún verður að vera heiltala sem er ekki neikvæð.

sequence-invalid-step = Ógilt skref rununnar.  Það verður að vera tala fyrir runu af tegundinni { $type }.

sequence-invalid-endpoint-number = Ógilt "{ $attribute }" í talnarunu.  Það verður að vera tala.

sequence-invalid-endpoint-letters = Ógilt "{ $attribute }" í bókstafarunu.  Það verður að vera samsetning bókstafa.

sequence-invalid-endpoint = Ógilt "{ $attribute }" í runu.

select-from-sequence-coprime-not-numbers = coprime hunsað þar sem ekki er verið að velja tölur

select-from-sequence-coprime-with-exclude-combinations = coprime hunsað þar sem excludeCombinations er tilgreint

## Resolving a `target`

target-not-found = Ógilt target fyrir `<{ $source }>`: markið finnst ekki.

target-state-variable-not-found = Ógilt target fyrir `<{ $source }>`: engin ástandsbreyta að nafni "{ $property }" finnst á `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Breytur `<odeSystem>` verða að vera aðrar en óháða breytan.

ode-system-duplicate-variable-names = Ekki er hægt að skilgreina RHS-föll ODE með tvíteknum nöfnum háðra breyta.

ode-system-rhs-function-error = Ekki er hægt að skilgreina RHS-fall ODE.  Villa við að búa til mathjs-fall.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ekki er hægt að skilgreina horn milli { $count } lína

angle-invalid-through-point = Ógildur punktur í through á `<angle>`

parabola-vertex-too-many-points = Fleygbogi með topppunkt gegnum fleiri en einn punkt hefur ekki verið útfærður.

parabola-too-many-points = Fleygbogi gegnum fleiri en 3 punkta hefur ekki verið útfærður.

intersection-too-many-items = Sniðmengi fleiri en tveggja hluta hefur ekki verið útfært

## Other math components

ionic-compound-not-two-ions = Jónaefnasamband hefur aðeins verið útfært fyrir tvær jónir.

ionic-compound-needs-cation-and-anion = Jónaefnasamband er aðeins útfært fyrir eina katjón og eina anjón.

solve-equations-cannot-evaluate = Ekki er hægt að leysa jöfnuna þar sem ekki tókst að reikna hana: { $equation }

math-operators-operand-number-required = Tilgreina verður operandNumber þegar stærðfræðilegur liður er dreginn út.

eigen-decomposition-failed = Ekki tókst að reikna eigingildi fylkisins

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: viðfangið { $parameters } kemur ekki fyrir í mynstrinu og mun því alltaf passa við eyðu.
       *[other] `<matchesPattern>`: viðföngin { $parameters } koma ekki fyrir í mynstrinu og munu því alltaf passa við eyðu.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ekki er hægt að túlka grid="{ $grid }". Það verður að vera none, medium, dense eða tvær jákvæðar tölur aðskildar með bili, svo sem grid="1 0.5". Ekkert hnitanet er teiknað.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" er ekki stutt í prefigure-teiknaranum; nota hegðun hægri staðsetningar.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" er ekki stutt í prefigure-teiknaranum; nota hegðun efri staðsetningar.

prefigure-invalid-axis-bounds = `<graph>`: ógild ásamörk fyrir prefigure-umbreytingu; nota sjálfgefið bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: ógild breidd fyrir prefigure-umbreytingu; nota sjálfgefna myndbreidd 425.

prefigure-invalid-aspect-ratio = `<graph>`: ógilt aspectRatio fyrir prefigure-umbreytingu; nota sjálfgefið hlutfall 1.

prefigure-grid-spacing-too-fine = `<graph>`: bilið í hnitanetinu er of fínt fyrir mörk ássins; hnitanetið er sleppt í prefigure-teiknaranum.

prefigure-annotations-not-rendered = `<graph>`: skýringar eru ekki teiknaðar nema PreFigure-teiknarinn sé notaður.

multiple-annotations-children = Fleiri en ein `<annotations>`-undireining fannst í `<graph>`; öllum nema þeirri síðustu er sleppt.

## Referring to other components

copy-unrecognized-component-type = Ekki er hægt að útvíkka eða afrita óþekkta einingartegund: { $type }.

copy-prop-not-found = Eiginleikinn { $property } fannst ekki á einingu af tegundinni { $component }

collect-no-source = Engin uppspretta fannst fyrir collect.

collect-invalid-component-type = Ekki er hægt að safna einingum af tegundinni `<{ $component }>` þar sem hún er ógild einingartegund.

reference-index-unavailable = Ekki er hægt að vísa í vísinn `{ $reference }`

## `<callAction>`

component-action-unavailable = Ekki er hægt að kalla á { $action } á einingunni `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Gögnin hafa ógilt form.  Raðirnar hafa ósamræmdar lengdir. Fannst í componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Gögnin hafa tvítekin dálkanöfn.  Fannst í componentIdx :{ $componentIdx }

data-frame-missing-column-name = Dálkanafn vantar í gögnin.  Fannst í componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = `<award>` fyrir þetta svar byggir á svarinu sem `<answer>`-merkið sjálft sendi inn, sem leiðir til óvæntrar hegðunar.

answer-max-num-attempts-in-section-wide-check-work = Það hefur engin áhrif að setja `maxNumAttempts` á `<answer>` inni í íláti með `sectionWideCheckWork`, þar sem ílátið stýrir fjölda tilrauna. Settu `maxNumAttempts` á ílátið í staðinn.

nested-section-wide-check-work-max-num-attempts = Það hefur engin áhrif að setja `maxNumAttempts` á ílát með `sectionWideCheckWork` sem er inni í öðru íláti með `sectionWideCheckWork`, þar sem ytra ílátið stýrir fjölda tilrauna. Settu `maxNumAttempts` á ytra ílátið í staðinn.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Eigindin { $attributes } hefur engin áhrif án þess að symbolicEquality sé sett.
       *[other] Eigindirnar { $attributes } hafa engin áhrif án þess að symbolicEquality sé sett.
    }

answer-invalid-type = Ógild tegund fyrir svar: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Þar sem einingin `<{ $component }>` hefur ekkert nafn er ekki hægt að nota hana sem eigind einingar

module-attribute-name-already-defined = Ekki er hægt að nota eininguna `<{ $component } name="{ $name }">` sem eigind fyrir einingu þar sem einingartegundin `<module>` hefur þegar skilgreinda eigind "{ $name }".

conditional-content-condition-ignored = Eigindin `condition` er hunsuð á `<conditionalContent>`-einingu sem hefur case- eða else-undireiningar.

slider-markers-type-mismatch = Tegund merkjanna samsvarar ekki tegund sleðans.

pretzel-problem-needs-statement-and-answer = Ógilt pretzel: hvert `<problem>` verður að innihalda eitt `<statement>` og eitt `<answer>`.

pretzel-circuit-first-problem-distractor = Ógilt pretzel: í mode="circuit" má fyrsta `<problem>` ekki vera truflun.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Ógilt gildi { $values } fyrir eigindina `{ $attribute }`; hunsa það.
       *[other] Ógild gildi { $values } fyrir eigindina `{ $attribute }`; hunsa þau.
    }

attribute-must-be-references = Ógilt gildi `{ $value }` fyrir eigindina `{ $attribute }`. Eigindin verður að vera sett saman úr tilvísunum sem byrja á `$`.

math-input-invalid-function-names = <mathInput>: hunsaði ógild fallanöfn í { $attribute }: { $names }. Birtingarhluti hvers nafns verður að vera að minnsta kosti 2 stafir (bókstafir eða bandstrik); valfrjálst viðskeyti `|<mathspeak alternative>` má fylgja.

## Building components from the source

component-type-invalid = Ógild einingartegund: `<{ $componentType }>`

attribute-repeated = Ekki er hægt að endurtaka eigindina { $attribute }.

attribute-invalid-for-component = Ógild eigind "{ $attribute }" fyrir einingu af tegundinni `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Stílskilgreining { $styleNumber } hefur ekki nægileg birtuskil fyrir { $context ->
        [text-on-background] textalit á móti bakgrunnslit
        [high-contrast] háskerpulit á móti myndfleti
        [line] línulit á móti myndfleti
        [marker] merkislit á móti myndfleti
       *[text-on-canvas] textalit á móti myndfleti
    }{ $mode ->
        [dark] { " (dökkur hamur)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; krefst að minnsta kosti { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Þótt stílskilgreining { $styleNumber } tilgreini liti sem gefa nægileg birtuskil í ljósum ham hafa litirnir fyrir dökkan ham sem af þeim eru leiddir ekki nægileg birtuskil milli textalitar og bakgrunnslitar ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; krefst að minnsta kosti { $threshold }:1). { $suggestion ->
        [available] Til að tryggja nægileg birtuskil í dökkum ham skaltu annaðhvort auka birtuskil ljósa hamsins (t.d. setja { $lightAttribute }="{ $lightColor }") eða yfirskrifa litinn fyrir dökkan ham (t.d. setja { $darkAttribute }="{ $darkColor }").
       *[none] Til að tryggja nægileg birtuskil í dökkum ham skaltu auka birtuskil ljósa hamsins eða yfirskrifa leidda litina með textColorDarkMode og/eða backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Þótt stílskilgreining { $styleNumber } tilgreini textalit sem gefur nægileg birtuskil í ljósum ham hefur textaliturinn fyrir dökkan ham sem af honum er leiddur ekki nægileg birtuskil á móti myndfletinum ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; krefst að minnsta kosti { $threshold }:1). { $suggestion ->
        [available] Til að tryggja nægileg birtuskil í dökkum ham skaltu annaðhvort auka birtuskil ljósa hamsins (t.d. setja textColor="{ $lightColor }") eða yfirskrifa litinn fyrir dökkan ham (t.d. setja textColorDarkMode="{ $darkColor }").
       *[none] Til að tryggja nægileg birtuskil í dökkum ham skaltu auka birtuskil ljósa hamsins eða yfirskrifa leidda litinn með textColorDarkMode.
    }

section-multiple-style-palettes = Kafli getur aðeins valið eitt <stylePalette>; nota það síðasta.

## Unique variants

variant-num-to-select-not-non-negative-integer = ekki er hægt að ákvarða einkvæmar útgáfur af { $component } þar sem numToSelect er ekki heiltala sem er ekki neikvæð.

variant-num-to-select-not-constant-number = ekki er hægt að ákvarða einkvæmar útgáfur af { $component } þar sem numToSelect er ekki fastatala.

variant-with-replacement-not-constant-boolean = ekki er hægt að ákvarða einkvæmar útgáfur af { $component } þar sem withReplacement er ekki fast Boole-gildi.

variant-select-weight-disables-unique = Einkvæmar útgáfur fyrir select eru óvirkar ef einhver kostur hefur selectWeight eða selectForVariants tilgreint

variant-coprime-undetermined = ekki er hægt að ákvarða einkvæmar útgáfur af { $component } þar sem ekki er hægt að ákvarða að coprime sé alltaf ósatt.

variant-attribute-not-constant = ekki er hægt að ákvarða einkvæmar útgáfur af { $component } þar sem { $attribute } er ekki fasti.

variant-attribute-not-number = ekki er hægt að ákvarða einkvæmar útgáfur af { $component } þar sem { $attribute } er ekki tala.

variant-attribute-wrong-type-for-sequence =
    ekki er hægt að ákvarða einkvæmar útgáfur af { $component } af tegundinni { $type } þar sem { $attribute } er ekki { $expected ->
        [letters-combination] samsetning bókstafa
        [math-expression] gild stærðfræðisegð
        [integer] heiltala
       *[number] tala
    }.

variant-length-not-integer = ekki er hægt að ákvarða einkvæmar útgáfur af { $component } þar sem length er ekki heiltala.

variant-sort-not-implemented = einkvæmar útgáfur af { $component } með sort hafa ekki verið útfærðar

variant-exclude-combinations-not-implemented = einkvæmar útgáfur af { $component } með excludeCombinations hafa ekki verið útfærðar

variant-math-exclude-not-implemented = einkvæmar útgáfur af { $component } af tegundinni math með exclude hafa ekki verið útfærðar

variant-non-constant-exclude-not-implemented = einkvæmar útgáfur af { $component } með exclude sem er ekki fast hafa ekki verið útfærðar

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ekki stutt í prefigure-teiknara grafsins; sleppt afkomanda.

prefigure-descendant-invalid-geometry = { $subject }: óendanleg eða ófullgerð rúmfræði; sleppt afkomanda.

prefigure-curve-label-omitted = { $subject }: merki eru ekki studd á umbreyttum ferlaeiningum; merkinu sleppt.

prefigure-curve-unsupported-definition-type = { $subject }: óstudd skilgreiningartegund ferilfalls '{ $definitionType }'; sleppt afkomanda.

prefigure-region-flip-functions-unsupported = { $subject }: eigindin flipFunctions á regionBetweenCurves er ekki studd; sleppt afkomanda.

prefigure-region-non-formula-child = { $subject }: aðeins undirföll af tegundinni formula eru studd á regionBetweenCurves; sleppt afkomanda.

prefigure-label-position-unsupported =
    { $subject }: óstutt labelPosition '{ $labelPosition }' fyrir { $labelKind ->
        [line-family] merki úr línufjölskyldunni
       *[point] punktmerki
    }; notaði sjálfgefna jöfnun PreFigure.

prefigure-fill-style-unsupported = { $subject }: fyllingarstíllinn '{ $fillStyle }' er ekki studdur af PreFigure; nota gegnheila fyllingu í staðinn.

prefigure-line-style-unknown = { $subject }: óþekktum línustíl '{ $lineStyle }' sleppt úr PreFigure-úttakinu.

prefigure-marker-style-mapped-to-diamond = { $subject }: merkisstíllinn '{ $markerStyle }' varpaðist á PreFigure-stílinn 'diamond'.

prefigure-marker-style-unsupported = { $subject }: merkisstíllinn '{ $markerStyle }' er ekki studdur af PreFigure; notaði sjálfgefinn stíl.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ógilt `ref`; ekki er hægt að leysa markið. Skýringunni sleppt.

annotation-ref-multiple-targets = `<annotation>`: `ref` leystist upp í mörg mörk; nota það fyrsta.

annotation-ref-outside-graph = `<annotation>`: ógilt `ref`; markið er utan grafsins sem umlykur það. Skýringunni sleppt.

annotation-ref-unsupported-target = `<annotation>`: ógilt `ref`; markið er ekki myndrænn hlutur sem er studdur í prefigure-umbreytingu. Skýringunni sleppt.

annotation-text-missing = `<annotation>`: `text` vantar eða er tómt; skila tómum texta.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Hringtenging fannst.
       *[other] Hringtenging fannst sem tengist `<{ $componentType }>`-einingu.
    }

reference-no-referent = Ekkert viðfang fannst fyrir tilvísunina: `{ $reference }`

reference-multiple-referents = Fleiri en eitt viðfang fannst fyrir tilvísunina: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ógilt snið á eigindinni { $attribute } á `<{ $componentType }>`.

children-invalid = Ógildar undireiningar fyrir `<{ $componentType }>`: Fann ógildar undireiningar: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ógilt gildi `{ $value }` fyrir eigindina `{ $attribute }`, nota gildið `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML útgáfa { $version } fannst ekki.
       *[other] DoenetML útgáfa { $version } fannst ekki. Nota útgáfu { $fallback } í staðinn
    }

## Reading the DoenetML

parse-invalid-doenetml = Ógilt DoenetML: { $content }

parse-tag-missing-close-tag = Ógilt DoenetML: Merkið `{ $tag }` hefur ekkert lokamerki. Bjóst við sjálflokandi merki eða `</{ $tagName }>`-merki.

parse-tag-error = Ógilt DoenetML: Villa í merkinu `<{ $tagName }>`

parse-attribute-missing-value = Ógilt DoenetML: Ógildu eigindina `{ $attribute }` virðist vanta gildi.

parse-attribute-invalid = Ógilt DoenetML: Ógild eigind `{ $attribute }`

parse-attribute-value-invalid = Ógilt DoenetML: Ógilt eigindagildi `{ $value }`

parse-attribute-value-quote-mismatch = Ógilt DoenetML: Ógilt eigindagildi `{ $value }`. Gæsalappirnar passa ekki saman. Þig virðist vanta `{ $quote }`

parse-open-tag-name-missing = Ógilt DoenetML: Fann merki án merkisheitis, t.d. `<`

parse-tag-not-closed = Ógilt DoenetML: Merkinu `{ $tag }` var ekki lokað (`>` virðist vanta).

parse-self-closing-tag-name-missing = Ógilt DoenetML: Fann merki án merkisheitis `<{ $content }>`

parse-self-closing-tag-not-closed = Ógilt DoenetML: Merkinu `{ $tag }` var ekki lokað (`/>` virðist vanta).

parse-tag-invalid-attributes = Ógilt DoenetML: Merkið `{ $tag }` er ekki gilt. Það kann að hafa rangar eigindir.

parse-close-tag-name-missing = Ógilt DoenetML: Fann lokamerki án merkisheitis, t.d. `</`

parse-attribute-value-unquoted = Eigindagildi verða að vera innan gæsalappa: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Ógilt DoenetML: Fann lokamerkið `{ $tag }`, en ekkert samsvarandi upphafsmerki

parse-close-tag-mismatched = Ógilt DoenetML: Ósamstætt lokamerki. Bjóst við `</{ $expected }>`. Fann `{ $found }`

parser-node-unconvertible = Ekki tókst að umbreyta hnútnum { $node } í Dast-hnút.

## Names

name-attribute-invalid =
    Ógilt eigindaheiti name='{ $name }'. { $reason ->
        [characters] Nöfn mega aðeins innihalda bókstafi, tölustafi, undirstrik eða bandstrik.
       *[start] Nöfn verða að byrja á bókstaf.
    }

component-name-invalid-start = Ógilt einingarheiti "{ $name }". Nöfn verða að byrja á bókstaf.

## `<answer>` sugar

answer-video-watched-missing-video = Svar af tegundinni videoWatched verður að hafa video-eigind

answer-video-watched-video-not-reference = video-eigind svars af tegundinni videoWatched verður að vera tilvísun

answer-name-not-single-text = name-eigind svars verður að hafa eina textaundireiningu

## Referencing another document

external-doenetml-recursion-limit = Ekki tókst að sækja ytra DoenetML vegna of margra endurkvæmnistiga. Er hringtilvísun til staðar?

external-doenetml-unavailable = Ekki tókst að sækja DoenetML frá { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Ógilt DoenetML sótt frá { $attribute }="{ $uri }": það samsvaraði ekki einingartegundinni "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Eigindin `{ $from }` er úrelt; notaðu `{ $to }` í staðinn.
       *[other] [deprecation] Eigindin `{ $from }` á `<{ $component }>` er úrelt; notaðu `{ $to }` í staðinn.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Eigindin `{ $from }` er úrelt og er hunsuð þar sem `{ $to }` er einnig tilgreint.
       *[other] [deprecation] Eigindin `{ $from }` á `<{ $component }>` er úrelt og er hunsuð þar sem `{ $to }` er einnig tilgreint.
    }

deprecated-attribute-ignored = [deprecation] Eigindin `{ $attribute }` á `<{ $component }>` er úrelt og er hunsuð.


## Language coverage

pluralize-english-only = `<pluralize>` getur aðeins sett ensku í fleirtölu, svo textinn er skilinn eftir óbreyttur í skjali sem skrifað er á { $locale }. Skrifaðu fleirtöluna beint, eða settu hana með eigindinni `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Einingin `<{ $tag }>` er ekki þekkt Doenet-eining.

schema-element-not-allowed-at-root = Einingin `<{ $tag }>` er ekki leyfð í rót skjalsins.

schema-element-not-allowed-inside = Einingin `<{ $tag }>` er ekki leyfð inni í `<{ $parent }>`.

schema-attribute-unrecognized = Einingin `<{ $tag }>` hefur enga eigind sem heitir `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Eigindin `{ $attribute }` á einingunni `<{ $tag }>` verður að vera listi þar sem hvert atriði er eitt af: { $allowed }
       *[other] Eigindin `{ $attribute }` á einingunni `<{ $tag }>` verður að vera eitt af: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Ógilt útgáfuheiti fyrir select.  Útgáfuheitið { $variantName } kemur fyrir í { $numOptions } kostum en fjöldinn sem á að velja er { $numToSelect }.

select-variant-name-without-options = Útgáfur eru tilgreindar fyrir select en engir kostir eru tilgreindir fyrir mögulegt útgáfuheiti: { $variantName }.

select-variant-name-not-possible = Útgáfuheitið { $variantName } sem tilgreint er fyrir select er ekki mögulegt útgáfuheiti.

select-too-few-options = Ekki er hægt að velja { $numToSelect } einingar úr aðeins { $numOptions }.

select-from-sequence-too-few-values = Ekki er hægt að velja { $numToSelect } gildi úr runu af lengd { $length }.

select-from-sequence-indices-count-mismatch = Fjöldi vísa sem tilgreindir eru fyrir select verður að samsvara fjöldanum sem á að velja

select-from-sequence-indices-not-integers = Allir vísar sem tilgreindir eru fyrir select verða að vera heiltölur

select-from-sequence-index-excluded = Tilgreindur vísir í selectfromsequence sem var útilokaður

select-from-sequence-indices-excluded-combination = Tilgreindir vísar í selectfromsequence sem mynduðu útilokaða samsetningu

select-from-sequence-coprime-not-positive-integers = Ekki er hægt að velja ósamþátta samsetningar þar sem ekki er verið að velja jákvæðar heiltölur.

select-from-sequence-coprime-common-factor = Ekki er hægt að velja ósamþátta tölur. Öll möguleg gildi eiga sameiginlegan þátt. (Tilgreind gildi "from" eða "to" verða að vera ósamþátta við "step".)

select-from-sequence-coprime-single-number = Ekki er hægt að velja ósamþátta samsetningar úr einni tölu sem er ekki 1.

select-from-sequence-excluded-too-many-combinations = Yfir 70% samsetninga voru útilokaðar í selectFromSequence

select-from-sequence-coprime-none-found = Ekki tókst að velja ósamþátta tölur. Öll möguleg gildi eiga sameiginlegan þátt.

select-from-sequence-too-few-unique-values = Ekki er hægt að velja { $numToSelect } einkvæm gildi úr runu af lengd { $numPossibleValues }

select-prime-numbers-too-few-values = Ekki er hægt að velja { $numToSelect } gildi úr lista frumtalna af lengd { $numValues }

select-prime-numbers-values-count-mismatch = Fjöldi gilda sem tilgreind eru fyrir select verður að samsvara fjöldanum sem á að velja

select-prime-numbers-values-not-prime = Öll gildi sem tilgreind eru fyrir select prime number verða að vera á lista frumtalnanna

select-prime-numbers-values-excluded-combination = Tilgreind gildi selectPrimeNumbers mynduðu útilokaða samsetningu

select-prime-numbers-excluded-too-many-combinations = Yfir 70% samsetninga voru útilokaðar í selectPrimeNumbers

select-random-combination-fluke = Fyrir afar ólíklega tilviljun tókst ekki að velja samsetningu slembigilda

select-random-value-fluke = Fyrir afar ólíklega tilviljun tókst ekki að velja slembigildi
