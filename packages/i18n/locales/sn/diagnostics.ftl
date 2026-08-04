# Shona diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
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
# Where English separates a singular from a plural only in the verb — "is
# ignored" against "are ignored" — the Shona verb takes its subject concord
# from the noun class rather than from the count, and the argument is a list
# either way. So those selects are dropped and the count argument goes unused.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } zvinofuratirwa kana mapoindi ekupedzisira maviri atsanangurwa

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } zvinofuratirwa kana poindi rekupedzisira nepoindi repakati zvese zvatsanangurwa

line-segment-midpoint-offset-without-midpoint = midpointOffset haina basa pasina poindi repakati

## `<line>`

line-points-undetermined-dimensions = Mutsara unopfuura nemumapoindi ane madimensheni asingazivikanwi.

line-points-too-few-dimensions = Mutsara unofanira kupfuura nemumapoindi ane madimensheni maviri zvirinani.

line-points-depend-on-variables = Mutsara unopfuura nemumapoindi anotsamira pazvinochinja: { $variables }.

line-equation-invalid-format = Chimiro hachina kururama pamuenzaniso wemutsara muzvinochinja { $variable1 } ne{ $variable2 }.

## `<ray>`

ray-overprescribed-through = Mwaranzi wakatsanangurwa ne through, endpoint ne direction zvese. through yakatsanangurwa inofuratirwa.

ray-dimension-mismatch = numDimensions hazvienderani mumwaranzi.

## `<vector>`

vector-overprescribed-head = Vhekita rakatsanangurwa ne head, tail ne displacement zvese. head yakatsanangurwa inofuratirwa.

vector-dimension-mismatch = numDimensions hazvienderani muvhekita.

## Attracting and constraining

attract-to-without-nearest-point = Hazvigoni kukwevewa ku`<{ $component }>` nekuti haina chinochinja chemamiriro nearestPoint.

constrain-to-without-nearest-point = Hazvigoni kusungwa ku`<{ $component }>` nekuti haina chinochinja chemamiriro nearestPoint.

constrain-to-interior-without-nearest-point = Hazvigoni kusungwa mukati me`<{ $component }>` nekuti haina chinochinja chemamiriro nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition inofuratirwa pachoiceInput isiri yemutsara mumwe

## Ordering children by index

choice-input-indices-count-mismatch = Zvinongedzo zvakatsanangurwa pachoiceInput zvinofuratirwa nekuti huwandu hwezvinongedzo hahuenderani nehuwandu hwevana vechoice.

pretzel-indices-count-mismatch = Zvinongedzo zvakatsanangurwa paproblem zvinofuratirwa nekuti huwandu hwezvinongedzo hahuenderani nehuwandu hwevana veproblem.

shuffle-indices-count-mismatch = Zvinongedzo zvakatsanangurwa pashuffle zvinofuratirwa nekuti huwandu hwezvinongedzo hahuenderani nehuwandu hwezvinhu.

indices-ignored-out-of-range = Zvinongedzo zvakatsanangurwa pa{ $component } zvinofuratirwa nekuti zvimwe zvinongedzo zviri kunze kwenhambo.

pretzel-indices-repeated = Zvinongedzo zvakatsanangurwa papretzel zvinofuratirwa nekuti zvimwe zvinongedzo zvakadzokororwa.

pretzel-circuit-first-index = Zvinongedzo zvakatsanangurwa papretzel mumodhi circuit zvinofuratirwa nekuti chinongedzo chekutanga chinofanira kuva 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Kuti `<{ $component }>` ishande nevana verudzi rwezvinyorwa, chimiro `type` chinofanira kutsanangurwa.

invalid-type-defaulting-to-math = type { $type } haina kururama pachinhu { $component }. Inofanira kuva imwe ye math, text, number kana boolean. Iri kuiswa math.

string-not-valid-component-to-arrange = Zvinyorwa "{ $value }" hachisi chinhu che{ $component } chakakodzera. Chinofuratirwa.

## Types and variables

invalid-type-defaulting-to-number = type { $type } haina kururama, type iri kuiswa number.

invalid-variable-value = Kukosha kwechinochinja hakuna kururama: `{ $value }`

## Variants

variant-index-must-be-number = Chinongedzo chemhando { $index } chinofanira kuva nhamba

variant-index-must-be-integer = Chinongedzo chemhando { $index } chinofanira kuva nhamba yakazara

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` haina kugadzirwa nezviyero zvakatarwa. Upamhi huri kuiswa muzvikamu.

side-by-side-absolute-margins = `<{ $component }>` haina kugadzirwa nezviyero zvakatarwa. Miganhu iri kuiswa muzvikamu.

side-by-side-no-block-child = `<{ $component }>` haina kururama: inofanira kuva nemwana mumwe zvirinani werudzi rwebhuroko.

## `<label>`

label-for-ignored-on-graphical = Chimiro `for` pa`<label>` yemufananidzo chinofuratirwa.

label-for-must-resolve-to-one = Chimiro `for` pa`<label>` chinofanira kunongedza chinhu chimwe chete.

label-for-unresolved = Chimiro `for` pa`<label>` hachina kukwanisa kunongedza chinhu chero chipi.

label-for-answer-with-authored-inputs = Chimiro `for` pa`<label>` chinonongedza `<answer>` ine zvipinzwa zvakanyorwa; nongedza chipinzwa pachacho.

label-for-answer-without-input = Chimiro `for` pa`<label>` chinonongedza `<answer>` isina chipinzwa chekutumidza.

label-for-must-reference-input-or-answer = Chimiro `for` pa`<label>` chinofanira kunongedza chipinzwa kana mhinduro.

## Accessibility

accessibility-short-description-or-decorative = Nekuda kwekuwanikwa, `<{ $component }>` inofanira kuva netsanangudzo pfupi kana kutsanangurwa sechishongedzo.

accessibility-video-short-description = Nekuda kwekuwanikwa, `<video>` inofanira kuva netsanangudzo pfupi.

accessibility-input-short-description-or-label = Nekuda kwekuwanikwa, `<{ $component }>` inofanira kuva netsanangudzo pfupi kana zita.

accessibility-answer-input-short-description-or-label = Nekuda kwekuwanikwa, `<answer>` inogadzira chipinzwa inofanira kuva netsanangudzo pfupi kana zita.

accessibility-short-description-contains-math = Tsanangudzo pfupi haifaniri kuva nezvinhu zvemasvomhu se`<{ $component }>`. Tsanangura masvomhu ese nemazwi.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ine musiyano usingakwani pazvinyorwa zvemusoro wechikamu (modhi yerima) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; inoda { $threshold }:1 zvirinani).
       *[other] { $colorName } ine musiyano usingakwani pazvinyorwa zvemusoro wechikamu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; inoda { $threshold }:1 zvirinani).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` inopfuura nemumapoindi { $count } haisati yagadzirwa kana mapoindi iwayo asina kukosha kwenhamba.

circle-too-many-through-points = Hazvigoni kuverenga denderedzwa rinopfuura nemumapoindi anopfuura 3.

circle-overprescribed-radius-center-points = Hazvigoni kuverenga denderedzwa rine rediyasi, pakati nemapoindi ekupfuura zvese zvakatsanangurwa.

circle-center-with-multiple-points = Hazvigoni kuverenga denderedzwa rine pakati pakatsanangurwa rinopfuura nemumapoindi anopfuura 1.

circle-radius-too-small = Hazvigoni kuverenga denderedzwa: sezvo nhambo iri pakati pemapoindi maviri iri { $distance }, rediyasi { $radius } yakatsanangurwa idiki kwazvo.

circle-radius-with-many-points = Hazvigoni kugadzira denderedzwa rinopfuura nemumapoindi anopfuura maviri rine rediyasi yakatsanangurwa.

circle-invalid-center-or-through-points = Pakati pedenderedzwa kana mapoindi aro ekupfuura hazvina kururama.

circle-radius-center-with-multiple-points = Hazvigoni kuverenga rediyasi yedenderedzwa rine pakati pakatsanangurwa rinopfuura nemumapoindi anopfuura 1.

circle-change-radius-non-numerical = Hazvigoni kuchinja rediyasi yedenderedzwa rinopfuura nemumapoindi asina kukosha kwenhamba

circle-radius-with-points-non-numerical = Hazvigoni kugadzira denderedzwa rinopfuura nemumapoindi anopfuura rimwe rine rediyasi yakatsanangurwa pasina kukosha kwenhamba.

circle-change-center-non-numerical = Kuchinja pakati pedenderedzwa rinopfuura nemumapoindi asina kukosha kwenhamba hakusati kwagadzirwa.

## `<function>`

function-domain-insufficient-dimensions = Madimensheni edomeni yebasa haakwani. Domeni ine nhambo { $intervals } asi basa rine zvipinzwa { $inputs }.

function-domain-invalid-format = Chimiro chedomeni yebasa hachina kururama.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Musoro wepamusoro webasa usiri wenhamba uri kufuratirwa.
        [minimum] Musoro wepasi webasa usiri wenhamba uri kufuratirwa.
        [extremum] Musoro webasa usiri wenhamba uri kufuratirwa.
        [point] Poindi rebasa risiri renhamba riri kufuratirwa.
        [slope] Kutsveyama kwebasa kusiri kwenhamba kuri kufuratirwa.
       *[other] { $type } yebasa isiri yenhamba iri kufuratirwa.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Musoro wepamusoro webasa usina chinhu uri kufuratirwa.
        [minimum] Musoro wepasi webasa usina chinhu uri kufuratirwa.
        [extremum] Musoro webasa usina chinhu uri kufuratirwa.
        [point] Poindi rebasa risina chinhu riri kufuratirwa.
       *[other] { $type } yebasa isina chinhu iri kufuratirwa.
    }

function-points-too-close = Basa rine mapoindi maviri ari pedyo kwazvo. Basa harigoni kutsanangurwa.

function-iterates-input-output-mismatch = Kudzokororwa kwebasa kunogona chete kana huwandu hwezvipinzwa huchienderana nehuwandu hwezvinobuda. Basa iri rine zvipinzwa { $inputs } nezvinobuda { $outputs }.

## `<sequence>`

sequence-invalid-length = Urefu hweteedzano hahuna kururama. Hunofanira kuva nhamba yakazara isiri pasi pezero.

sequence-invalid-step = Danho reteedzano harina kururama. Muteedzano yerudzi { $type } rinofanira kuva nhamba.

sequence-invalid-endpoint-number = "{ $attribute }" yeteedzano yenhamba haina kururama. Inofanira kuva nhamba.

sequence-invalid-endpoint-letters = "{ $attribute }" yeteedzano yemavara haina kururama. Inofanira kuva mavara.

sequence-invalid-endpoint = "{ $attribute }" yeteedzano haina kururama.

select-from-sequence-coprime-not-numbers = coprime iri kufuratirwa nekuti hadzisi nhamba dziri kusarudzwa

select-from-sequence-coprime-with-exclude-combinations = coprime iri kufuratirwa nekuti excludeCombinations yakatsanangurwa

## Resolving a `target`

target-not-found = target haina kururama pa`<{ $source }>`: chinangwa hachina kuwanikwa.

target-state-variable-not-found = target haina kururama pa`<{ $source }>`: chinochinja chemamiriro chine zita "{ $property }" hachina kuwanikwa pa`<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Zvinochinja zve`<odeSystem>` zvinofanira kusiyana nechinochinja chakazvimirira.

ode-system-duplicate-variable-names = Hazvigoni kutsanangura mabasa eODE RHS ane mazita ezvinochinja akadzokororwa.

ode-system-rhs-function-error = Hazvigoni kutsanangura basa reODE RHS. Kukanganisa pakugadzira basa remathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Hazvigoni kutsanangura kona pakati pemitsara { $count }

angle-invalid-through-point = Poindi harina kururama muthrough ye`<angle>`

parabola-vertex-too-many-points = Parabhora ine musoro inopfuura nemumapoindi anopfuura 1 haisati yagadzirwa.

parabola-too-many-points = Parabhora inopfuura nemumapoindi anopfuura 3 haisati yagadzirwa.

intersection-too-many-items = Kusangana kwezvinhu zvinopfuura zviviri hakusati kwagadzirwa

## Other math components

ionic-compound-not-two-ions = Musanganiswa weioni unopfuura maioni maviri hausati wagadzirwa.

ionic-compound-needs-cation-and-anion = Musanganiswa weioni wakagadzirirwa kateni imwe neanioni imwe chete.

solve-equations-cannot-evaluate = Hazvigoni kugadzirisa muenzaniso nekuti muenzaniso hauna kukwanisa kuverengwa: { $equation }

math-operators-operand-number-required = operandNumber inofanira kutsanangurwa pakubudisa opharendi yemasvomhu.

eigen-decomposition-failed = Hazvigoni kuverenga kukosha kweeigen kwematiriki

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: paramita { $parameters } hadzisi mumufananidzo, saka dzichaenderana nepasina nguva dzese.

## `<graph>`

graph-grid-invalid = `<graph>`: hazvigoni kududzira grid="{ $grid }". Inofanira kuva none, medium, dense, kana nhamba mbiri dzakanaka dzakaparadzaniswa nenzvimbo, se grid="1 0.5". Hapana girini riri kudhirowewa.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" haitsigirwe mumuratidzi weprefigure; maitiro erutivi rwerudyi ari kushandiswa.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" haitsigirwe mumuratidzi weprefigure; maitiro erutivi rwepamusoro ari kushandiswa.

prefigure-invalid-axis-bounds = `<graph>`: miganhu yeakisi haina kururama pakushandurwa kweprefigure; bbox (-10,-10,10,10) iri kushandiswa.

prefigure-invalid-width = `<graph>`: upamhi hahuna kururama pakushandurwa kweprefigure; upamhi hwemufananidzo 425 huri kushandiswa.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio haina kururama pakushandurwa kweprefigure; chiyero 1 chiri kushandiswa.

prefigure-grid-spacing-too-fine = `<graph>`: nhambo dzegirini idiki kwazvo pamiganhu yeakisi; girini rakasiiwa mumuratidzi weprefigure.

prefigure-annotations-not-rendered = `<graph>`: zvicherechedzo hazvizoratidzwe kana muratidzi wePreFigure usiri kushandiswa.

multiple-annotations-children = Vana `<annotations>` vakawanda vakawanikwa mu`<graph>`; vese vanofuratirwa kunze kwewekupedzisira.

## Referring to other components

copy-unrecognized-component-type = Hazvigoni kuwedzera kana kukopa rudzi rwechinhu rusingazivikanwi: { $type }.

copy-prop-not-found = Chimiro { $property } hachina kuwanikwa pachinhu cherudzi { $component }

collect-no-source = Hapana chinobva chakawanikwa pacollect.

collect-invalid-component-type = Hazvigoni kuunganidza zvinhu zverudzi `<{ $component }>` nekuti irudzi rwechinhu rusina kururama.

reference-index-unavailable = Hazvigoni kunongedza chinongedzo `{ $reference }`

## `<callAction>`

component-action-unavailable = Hazvigoni kudaidza { $action } pachinhu `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Chimiro chedata hachina kururama. Mitsara ine urefu husingaenderani. Zvakawanikwa pacomponentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Data rine mazita emitsara yakamira akadzokororwa. Zvakawanikwa pacomponentIdx :{ $componentIdx }

data-frame-missing-column-name = Data harina zita remutsara wakamira. Zvakawanikwa pacomponentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Imwe award yemhinduro iyi inotsamira pamhinduro yakatumirwa netagi answer pachayo, izvo zvichaunza maitiro asingatarisirwi.

answer-max-num-attempts-in-section-wide-check-work = Kuisa `maxNumAttempts` pa`<answer>` iri mukati mechigadziko chine `sectionWideCheckWork` hakuna basa, nekuti chigadziko ichocho ndicho chinodzora huwandu hwemaedzo. Isa `maxNumAttempts` pachigadziko pachacho.

nested-section-wide-check-work-max-num-attempts = Kuisa `maxNumAttempts` pachigadziko chine `sectionWideCheckWork` chiri mukati mechimwe chigadziko chine `sectionWideCheckWork` hakuna basa, nekuti chigadziko chekunze ndicho chinodzora huwandu hwemaedzo. Isa `maxNumAttempts` pachigadziko chekunze.

answer-attributes-need-symbolic-equality = Zvimiro { $attributes } hazvizovi nebasa kana symbolicEquality isina kuiswa.

answer-invalid-type = Rudzi haruna kururama pamhinduro: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Sezvo chinhu `<{ $component }>` chisina zita, hachigoni kushandiswa sechimiro chemodule

module-attribute-name-already-defined = Chinhu `<{ $component } name="{ $name }">` hachigoni kushandiswa sechimiro chemodule nekuti rudzi rwechinhu `<module>` rwatova nechimiro chine zita "{ $name }".

conditional-content-condition-ignored = Chimiro `condition` chinofuratirwa pachinhu `<conditionalContent>` chine vana case kana else.

slider-markers-type-mismatch = Rudzi rwezviratidzo haruenderani nerudzi rweslider.

pretzel-problem-needs-statement-and-answer = pretzel haina kururama: `<problem>` yega yega inofanira kuva ne`<statement>` imwe ne`<answer>` imwe.

pretzel-circuit-first-problem-distractor = pretzel haina kururama: mumode="circuit", `<problem>` yekutanga haigoni kuva yekutsausa.

## Attribute values

attribute-invalid-values = Kukosha { $values } hakuna kururama pachimiro `{ $attribute }`; kunofuratirwa.

attribute-must-be-references = Kukosha `{ $value }` hakuna kururama pachimiro `{ $attribute }`. Chimiro chinofanira kuumbwa nezvinongedzo zvinotanga ne`$`.

math-input-invalid-function-names = <mathInput>: mazita emabasa asina kururama mu{ $attribute } ari kufuratirwa: { $names }. Chikamu chekuratidza chezita rimwe nerimwe chinofanira kuva nemavara 2 zvirinani (mavara kana mitsara); chiwedzero `|<mathspeak alternative>` chinogona kutevera.

## Building components from the source

component-type-invalid = Rudzi rwechinhu haruna kururama: `<{ $componentType }>`

attribute-repeated = Chimiro { $attribute } hachigoni kudzokororwa.

attribute-invalid-for-component = Chimiro "{ $attribute }" hachina kururama pachinhu cherudzi `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Tsanangudzo yechimiro { $styleNumber } ine musiyano usingakwani pa{ $context ->
        [text-on-background] ruvara rwezvinyorwa pamusoro peruvara rwechigadziko
        [high-contrast] ruvara rwemusiyano mukuru pamusoro pekenvasi
        [line] ruvara rwemutsara pamusoro pekenvasi
        [marker] ruvara rwechiratidzo pamusoro pekenvasi
       *[text-on-canvas] ruvara rwezvinyorwa pamusoro pekenvasi
    }{ $mode ->
        [dark] { " (modhi yerima)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; inoda { $threshold }:1 zvirinani).

style-definition-dark-mode-text-background-contrast =
    Kunyange tsanangudzo yechimiro { $styleNumber } yakatsanangura mavara anopa musiyano wakakwana pamodhi yechiedza, mavara emodhi yerima anobva paari ane musiyano usingakwani paruvara rwezvinyorwa pamusoro peruvara rwechigadziko ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; inoda { $threshold }:1 zvirinani). { $suggestion ->
        [available] Kuti musiyano ukwane mumodhi yerima, wedzera musiyano wemodhi yechiedza (semuenzaniso isa { $lightAttribute }="{ $lightColor }") kana chinja ruvara rwemodhi yerima (semuenzaniso isa { $darkAttribute }="{ $darkColor }").
       *[none] Kuti musiyano ukwane mumodhi yerima, wedzera musiyano wemodhi yechiedza kana chinja mavara anobva paari ne textColorDarkMode ne/kana backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Kunyange tsanangudzo yechimiro { $styleNumber } yakatsanangura ruvara rwezvinyorwa runopa musiyano wakakwana pamodhi yechiedza, ruvara rwezvinyorwa rwemodhi yerima runobva parwuri rune musiyano usingakwani pamusoro pekenvasi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; inoda { $threshold }:1 zvirinani). { $suggestion ->
        [available] Kuti musiyano ukwane mumodhi yerima, wedzera musiyano wemodhi yechiedza (semuenzaniso isa textColor="{ $lightColor }") kana chinja ruvara rwemodhi yerima (semuenzaniso isa textColorDarkMode="{ $darkColor }").
       *[none] Kuti musiyano ukwane mumodhi yerima, wedzera musiyano wemodhi yechiedza kana chinja ruvara runobva parwuri ne textColorDarkMode.
    }

section-multiple-style-palettes = Chikamu chinogona kusarudza <stylePalette> imwe chete; yekupedzisira iri kushandiswa.

## Unique variants

variant-num-to-select-not-non-negative-integer = hazvigoni kutsanangura mhando dzakasiyana dze{ $component } nekuti numToSelect haisi nhamba yakazara isiri pasi pezero.

variant-num-to-select-not-constant-number = hazvigoni kutsanangura mhando dzakasiyana dze{ $component } nekuti numToSelect haisi nhamba isingachinji.

variant-with-replacement-not-constant-boolean = hazvigoni kutsanangura mhando dzakasiyana dze{ $component } nekuti withReplacement haisi bhuriyani isingachinji.

variant-select-weight-disables-unique = Mhando dzakasiyana dzeselect dzinodzimwa kana paine sarudzo ine selectWeight kana selectForVariants yakatsanangurwa

variant-coprime-undetermined = hazvigoni kutsanangura mhando dzakasiyana dze{ $component } nekuti hazvigoni kuvimbisa kuti coprime manyepo nguva dzese.

variant-attribute-not-constant = hazvigoni kutsanangura mhando dzakasiyana dze{ $component } nekuti { $attribute } haina kusimba.

variant-attribute-not-number = hazvigoni kutsanangura mhando dzakasiyana dze{ $component } nekuti { $attribute } haisi nhamba.

variant-attribute-wrong-type-for-sequence =
    hazvigoni kutsanangura mhando dzakasiyana dze{ $component } dzerudzi { $type } nekuti { $attribute } haisi { $expected ->
        [letters-combination] musanganiswa wemavara
        [math-expression] chirevo chemasvomhu chakakodzera
        [integer] nhamba yakazara
       *[number] nhamba
    }.

variant-length-not-integer = hazvigoni kutsanangura mhando dzakasiyana dze{ $component } nekuti length haisi nhamba yakazara.

variant-sort-not-implemented = mhando dzakasiyana dze{ $component } dzine sort hadzisati dzagadzirwa

variant-exclude-combinations-not-implemented = mhando dzakasiyana dze{ $component } dzine excludeCombinations hadzisati dzagadzirwa

variant-math-exclude-not-implemented = mhando dzakasiyana dze{ $component } dzerudzi math dzine exclude hadzisati dzagadzirwa

variant-non-constant-exclude-not-implemented = mhando dzakasiyana dze{ $component } dzine exclude isina kusimba hadzisati dzagadzirwa

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: hazvitsigirwe mumuratidzi wegraph prefigure; mwana asvetukwa.

prefigure-descendant-invalid-geometry = { $subject }: jiyometiri isina magumo kana isina kukwana; mwana asvetukwa.

prefigure-curve-label-omitted = { $subject }: mazita haatsigirwe pazvinhu zvechikombamiro zvakashandurwa; zita rasiiwa.

prefigure-curve-unsupported-definition-type = { $subject }: rudzi rwetsanangudzo yebasa rechikombamiro '{ $definitionType }' harutsigirwe; mwana asvetukwa.

prefigure-region-flip-functions-unsupported = { $subject }: chimiro flipFunctions paregionBetweenCurves hachitsigirwe; mwana asvetukwa.

prefigure-region-non-formula-child = { $subject }: mabasa evana verudzi formula chete ndiwo anotsigirwa paregionBetweenCurves; mwana asvetukwa.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' haitsigirwe pa{ $labelKind ->
        [line-family] zita remhuri yemutsara
       *[point] zita repoindi
    }; kurongwa kwePreFigure kuri kushandiswa.

prefigure-fill-style-unsupported = { $subject }: chimiro chekuzadza '{ $fillStyle }' hachitsigirwe nePreFigure; iri kudzokera kukuzadza neruvara rumwe.

prefigure-line-style-unknown = { $subject }: chimiro chemutsara '{ $lineStyle }' hachizivikanwi uye chasiiwa muzvinobuda zvePreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: chimiro chechiratidzo '{ $markerStyle }' chakaenzaniswa nechimiro chePreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: chimiro chechiratidzo '{ $markerStyle }' hachitsigirwe nePreFigure; chimiro chiripo kare chiri kushandiswa.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` haina kururama; chinangwa hachigoni kuzivikanwa. Chicherechedzo chasiiwa.

annotation-ref-multiple-targets = `<annotation>`: `ref` yakatsanangura zvinangwa zvakawanda; chinangwa chekutanga chiri kushandiswa.

annotation-ref-outside-graph = `<annotation>`: `ref` haina kururama; chinangwa chiri kunze kwegirafu rinochichengeta. Chicherechedzo chasiiwa.

annotation-ref-unsupported-target = `<annotation>`: `ref` haina kururama; chinangwa hachisi chinhu chemufananidzo chinotsigirwa mukushandurwa kweprefigure. Chicherechedzo chasiiwa.

annotation-text-missing = `<annotation>`: `text` haipo kana haina chinhu; zvinyorwa zvisina chinhu zviri kubudiswa.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Kutsamira kwakatenderera kwaonekwa.
       *[other] Kutsamira kwakatenderera kunosanganisira chinhu `<{ $componentType }>` kwaonekwa.
    }

reference-no-referent = Hapana chakawanikwa pachinongedzo: `{ $reference }`

reference-multiple-referents = Zvinhu zvakawanda zvakawanikwa pachinongedzo: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Chimiro hachina kururama pachimiro { $attribute } che`<{ $componentType }>`.

children-invalid = Vana havana kururama pa`<{ $componentType }>`: Vana vasina kururama vakawanikwa: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Kukosha `{ $value }` hakuna kururama pachimiro `{ $attribute }`, kukosha `{ $default }` kuri kushandiswa

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML vhezheni { $version } haina kuwanikwa.
       *[other] DoenetML vhezheni { $version } haina kuwanikwa. Iri kudzokera kuvhezheni { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML haina kururama: { $content }

parse-tag-missing-close-tag = DoenetML haina kururama: Tagi `{ $tag }` haina tagi yekuvhara. Paitarisirwa tagi inozvivhara kana tagi `</{ $tagName }>`.

parse-tag-error = DoenetML haina kururama: Kukanganisa mutagi `<{ $tagName }>`

parse-attribute-missing-value = DoenetML haina kururama: Chimiro `{ $attribute }` chisina kururama chinoita sechisina kukosha.

parse-attribute-invalid = DoenetML haina kururama: Chimiro `{ $attribute }` hachina kururama

parse-attribute-value-invalid = DoenetML haina kururama: Kukosha kwechimiro `{ $value }` hakuna kururama

parse-attribute-value-quote-mismatch = DoenetML haina kururama: Kukosha kwechimiro `{ $value }` hakuna kururama. Zviratidzo zvemashoko hazvienderani. Zvinoita se`{ $quote }` yakashaikwa

parse-open-tag-name-missing = DoenetML haina kururama: Tagi isina zita yakawanikwa, semuenzaniso `<`

parse-tag-not-closed = DoenetML haina kururama: Tagi `{ $tag }` haina kuvharwa (zvinoita se`>` yakashaikwa).

parse-self-closing-tag-name-missing = DoenetML haina kururama: Tagi isina zita yakawanikwa `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML haina kururama: Tagi `{ $tag }` haina kuvharwa (zvinoita se`/>` yakashaikwa).

parse-tag-invalid-attributes = DoenetML haina kururama: Tagi `{ $tag }` haina kururama. Ingave ine zvimiro zvisina kururama.

parse-close-tag-name-missing = DoenetML haina kururama: Tagi yekuvhara isina zita yakawanikwa, semuenzaniso `</`

parse-attribute-value-unquoted = Kukosha kwezvimiro kunofanira kuiswa mukati mezviratidzo zvemashoko: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML haina kururama: Tagi yekuvhara `{ $tag }` yakawanikwa, asi hapana tagi yekuvhura inoenderana

parse-close-tag-mismatched = DoenetML haina kururama: Tagi yekuvhara haienderani. Paitarisirwa `</{ $expected }>`. Pakawanikwa `{ $found }`

parser-node-unconvertible = Hazvina kukwanisa kushandura nodhi { $node } kuita nodhi yeDast.

## Names

name-attribute-invalid =
    Chimiro name='{ $name }' hachina kururama. { $reason ->
        [characters] Mazita anogona kuva nemavara, nhamba, mitsara yepasi kana mitsara chete.
       *[start] Mazita anofanira kutanga nevara.
    }

component-name-invalid-start = Zita rechinhu "{ $name }" harina kururama. Mazita anofanira kutanga nevara.

## `<answer>` sugar

answer-video-watched-missing-video = Mhinduro yerudzi videoWatched inofanira kuva nechimiro video

answer-video-watched-video-not-reference = Mhinduro yerudzi videoWatched inofanira kuva nechimiro video chiri chinongedzo

answer-name-not-single-text = Chimiro name chemhinduro chinofanira kuva nemwana text mumwe chete

## Referencing another document

external-doenetml-recursion-limit = Hazvigoni kuwana DoenetML yekunze nekuda kwekudzokorora kwakawandisa. Ko paine chinongedzo chakatenderera here?

external-doenetml-unavailable = Hazvigoni kuwana DoenetML kubva ku{ $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML yakawanikwa kubva ku{ $attribute }="{ $uri }" haina kururama: haienderani nerudzi rwechinhu "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Chimiro `{ $from }` chapfuura nenguva; shandisa `{ $to }`.
       *[other] [deprecation] Chimiro `{ $from }` pa`<{ $component }>` chapfuura nenguva; shandisa `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Chimiro `{ $from }` chapfuura nenguva uye chinofuratirwa nekuti `{ $to }` chakatsanangurwawo.
       *[other] [deprecation] Chimiro `{ $from }` pa`<{ $component }>` chapfuura nenguva uye chinofuratirwa nekuti `{ $to }` chakatsanangurwawo.
    }

deprecated-attribute-ignored = [deprecation] Chimiro `{ $attribute }` pa`<{ $component }>` chapfuura nenguva uye chinofuratirwa.

deprecated-attribute-to-child = [deprecation] Chimiro `{ $attribute }` pa`<{ $component }>` chapfuura nenguva; shandisa mwana `<{ $child }>`.


## Language coverage

pluralize-english-only = `<pluralize>` inogona kuita huwandu muChirungu chete, saka zvinyorwa zvayo zvinosara sezvazviri mugwaro rakanyorwa mu{ $locale }. Nyora chimiro chehuwandu iwe pachako, kana uchiise pachimiro `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Chinhu `<{ $tag }>` hachisi chinhu cheDoenet chinozivikanwa.

schema-element-not-allowed-at-root = Chinhu `<{ $tag }>` hachibvumirwi pamudzi wegwaro.

schema-element-not-allowed-inside = Chinhu `<{ $tag }>` hachibvumirwi mukati me`<{ $parent }>`.

schema-attribute-unrecognized = Chinhu `<{ $tag }>` hachina chimiro chine zita `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Chimiro `{ $attribute }` chechinhu `<{ $tag }>` chinofanira kuva runyorwa rune chinhu chimwe nechimwe chiri chimwe che: { $allowed }
       *[other] Chimiro `{ $attribute }` chechinhu `<{ $tag }>` chinofanira kuva chimwe che: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Zita remhando harina kururama paselect. Zita remhando { $variantName } rinowanikwa musarudzo { $numOptions } asi huwandu hwekusarudza i{ $numToSelect }.

select-variant-name-without-options = Dzimwe mhando dzakatsanangurwa paselect asi hapana sarudzo yakatsanangurwa pazita remhando rinogoneka: { $variantName }.

select-variant-name-not-possible = Zita remhando { $variantName } rakatsanangurwa paselect harisi zita remhando rinogoneka.

select-too-few-options = Hazvigoni kusarudza zvinhu { $numToSelect } kubva pa{ $numOptions } chete.

select-from-sequence-too-few-values = Hazvigoni kusarudza kukosha { $numToSelect } kubva muteedzano ine urefu { $length }.

select-from-sequence-indices-count-mismatch = Huwandu hwezvinongedzo zvakatsanangurwa paselect hunofanira kuenderana nehuwandu hwekusarudza

select-from-sequence-indices-not-integers = Zvinongedzo zvese zvakatsanangurwa paselect zvinofanira kuva nhamba dzakazara

select-from-sequence-index-excluded = Chinongedzo cheselectfromsequence chakabviswa chakatsanangurwa

select-from-sequence-indices-excluded-combination = Zvinongedzo zveselectfromsequence zvakanga zviri musanganiswa wakabviswa zvakatsanangurwa

select-from-sequence-coprime-not-positive-integers = Hazvigoni kusarudza misanganiswa yenhamba dzisingagoverani nekuti hadzisi nhamba dzakazara dziri pamusoro pezero dziri kusarudzwa.

select-from-sequence-coprime-common-factor = Hazvigoni kusarudza nhamba dzisingagoverani. Kukosha kwese kunogoneka kunogovana chigoveso chimwe. (Kukosha kwakatsanangurwa kwe"from" kana "to" kunofanira kusagoverana ne"step".)

select-from-sequence-coprime-single-number = Hazvigoni kusarudza misanganiswa yenhamba dzisingagoverani kubva panhamba imwe isiri 1.

select-from-sequence-excluded-too-many-combinations = Anopfuura 70% emisanganiswa akabviswa muselectFromSequence

select-from-sequence-coprime-none-found = Hazvina kukwanisa kusarudza nhamba dzisingagoverani. Kukosha kwese kunogoneka kunogovana chigoveso chimwe.

select-from-sequence-too-few-unique-values = Hazvigoni kusarudza kukosha kwakasiyana { $numToSelect } kubva muteedzano ine urefu { $numPossibleValues }

select-prime-numbers-too-few-values = Hazvigoni kusarudza kukosha { $numToSelect } kubva murunyorwa rwenhamba dzeprime rune urefu { $numValues }

select-prime-numbers-values-count-mismatch = Huwandu hwekukosha kwakatsanangurwa paselect hunofanira kuenderana nehuwandu hwekusarudza

select-prime-numbers-values-not-prime = Kukosha kwese kwakatsanangurwa paselect prime number kunofanira kuva murunyorwa rwenhamba dzeprime

select-prime-numbers-values-excluded-combination = Kukosha kweselectPrimeNumbers kwakatsanangurwa kwakanga kuri musanganiswa wakabviswa

select-prime-numbers-excluded-too-many-combinations = Anopfuura 70% emisanganiswa akabviswa muselectPrimeNumbers

select-random-combination-fluke = Nenzira isingawanzoitiki, hazvina kukwanisa kusarudza musanganiswa wekukosha kwehuchapu

select-random-value-fluke = Nenzira isingawanzoitiki, hazvina kukwanisa kusarudza kukosha kwehuchapu
