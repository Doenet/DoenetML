# Bemba diagnostics: errors and warnings surfaced to the reader or author.
# Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# DoenetML element, attribute and value names — `through`, `endpoint`,
# `midpointOffset`, `numDimensions`, `symbolicEquality`, `selectFromSequence`
# and the rest — are part of the language rather than prose, and stay in
# English exactly as written. So does the `[deprecation]` marker.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } yalasuulwa nga amapoyinti yabili ya kumpela yasalwa
       *[other] { $attributes } yalasuulwa nga amapoyinti yabili ya kumpela yasalwa
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } yalasuulwa nga ipoyinti lya kumpela ne lya pakati fyonse fyasalwa
       *[other] { $attributes } yalasuulwa nga ipoyinti lya kumpela ne lya pakati fyonse fyasalwa
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset taikwata mulimo ukwabula ipoyinti lya pakati

## `<line>`

line-points-undetermined-dimensions = Umutalale upitila mu mapoyinti ya bukulu ubushaishibikwa.

line-points-too-few-dimensions = Umutalale ufwile ukupitila mu mapoyinti ya bukulu bubili nangu ni panono.

line-points-depend-on-variables = Umutalale upitila mu mapoyinti ayashintilila pa fyaaluka: { $variables }.

line-equation-invalid-format = Imipangile yabipa iya cilingano ca mutalale mu fyaaluka { $variable1 } na { $variable2 }.

## `<ray>`

ray-overprescribed-through = Umushinshi wasalwa na through, endpoint na direction.  Kuleesuula through iyasalwa.

ray-dimension-mismatch = numDimensions taililingana mu mushinshi.

## `<vector>`

vector-overprescribed-head = Vekita yasalwa na head, tail na displacement.  Kuleesuula head iyasalwa.

vector-dimension-mismatch = numDimensions taililingana mu vekita.

## Attracting and constraining

attract-to-without-nearest-point = Te kuti ukobeke ku `<{ $component }>` pantu taikwata icaaluka ca mibele ca nearestPoint.

constrain-to-without-nearest-point = Te kuti ukakile ku `<{ $component }>` pantu taikwata icaaluka ca mibele ca nearestPoint.

constrain-to-interior-without-nearest-point = Te kuti ukakile mukati mwa `<{ $component }>` pantu taikwata icaaluka ca mibele ca nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ilasuulwa ku choiceInput iishili ya inline

## Ordering children by index

choice-input-indices-count-mismatch = Kuleesuula inambala ishasalwa ku choiceInput pantu umwingi wa nambala taulingana no mwingi wa bana ba kusala.

pretzel-indices-count-mismatch = Kuleesuula inambala ishasalwa ku problem pantu umwingi wa nambala taulingana no mwingi wa bana ba problem.

shuffle-indices-count-mismatch = Kuleesuula inambala ishasalwa ku shuffle pantu umwingi wa nambala taulingana no mwingi wa fipande.

indices-ignored-out-of-range = Kuleesuula inambala ishasalwa ku { $component } pantu shimo shili ku nse ya cipimo.

pretzel-indices-repeated = Kuleesuula inambala ishasalwa ku pretzel pantu shimo shalibwelezhiwa.

pretzel-circuit-first-index = Kuleesuula inambala ishasalwa ku pretzel mu mode wa circuit pantu inambala ya kubalilapo ifwile ukuba 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Pa kuti `<{ $component }>` ibombe na bana ba mashiwi, icishinka ca `type` cifwile ukusalwa.

invalid-type-defaulting-to-math = Umusango { $type } wabipa ku cipande ca { $component }. Ufwile ukuba umo pali math, text, number nangu boolean. Kulebikwa math nga ica cinkulu.

string-not-valid-component-to-arrange = Ishiwi "{ $value }" tacili cipande icasuminishiwa ku { $component }. Kuleesuula.

## Types and variables

invalid-type-defaulting-to-number = Umusango { $type } wabipa, umusango uleebikwa ku number.

invalid-variable-value = Umubalo uwabipa uwa caaluka: `{ $value }`

## Variants

variant-index-must-be-number = Inambala ya musango { $index } ifwile ukuba umubalo

variant-index-must-be-integer = Inambala ya musango { $index } ifwile ukuba umubalo uwapwa

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` tayapangilwe ifipimo ifyapwa. Ubwipi buleebikwa ku bwa kulinganya.

side-by-side-absolute-margins = `<{ $component }>` tayapangilwe ifipimo ifyapwa. Impela shileebikwa ku sha kulinganya.

side-by-side-no-block-child = `<{ $component }>` iyabipa: ifwile ukukwata umwana umo uwa buloko nangu ni panono.

## `<label>`

label-for-ignored-on-graphical = Icishinka ca `for` pa `<label>` ya cikope cilasuulwa.

label-for-must-resolve-to-one = Icishinka ca `for` pa `<label>` cifwile ukulanga icipande cimo fye.

label-for-unresolved = Icishinka ca `for` pa `<label>` tacalengele ukulanga icipande.

label-for-answer-with-authored-inputs = Icishinka ca `for` pa `<label>` cilanga `<answer>` iyakwata ifyaingishiwa ifyo kalemba alembele; langa ukwingisha kwine kwine.

label-for-answer-without-input = Icishinka ca `for` pa `<label>` cilanga `<answer>` iishikwete ukwingisha ukwingapeelwa ishina.

label-for-must-reference-input-or-answer = Icishinka ca `for` pa `<label>` cifwile ukulanga ukwingisha nangu icasuko.

## Accessibility

accessibility-short-description-or-decorative = Pa kufikako, `<{ $component }>` ifwile ukukwata ubulondoloshi ubwipi nangu ukusalwa nga decorative.

accessibility-video-short-description = Pa kufikako, `<video>` ifwile ukukwata ubulondoloshi ubwipi.

accessibility-input-short-description-or-label = Pa kufikako, `<{ $component }>` ifwile ukukwata ubulondoloshi ubwipi nangu ishina.

accessibility-answer-input-short-description-or-label = Pa kufikako, `<answer>` iilepanga ukwingisha ifwile ukukwata ubulondoloshi ubwipi nangu ishina.

accessibility-short-description-contains-math = Ubulondoloshi ubwipi tabufwile ukukwata ifipande fya mibalo nga `<{ $component }>`. Lemba imibalo na mashiwi.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } taikwata ukupusana ukwakumanina kwa malembo ya mutwe wa cipandwa (imibele ya mfifi) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kulekabilwa { $threshold }:1 nangu ni panono).
       *[other] { $colorName } taikwata ukupusana ukwakumanina kwa malembo ya mutwe wa cipandwa ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kulekabilwa { $threshold }:1 nangu ni panono).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` iipitila mu mapoyinti { $count } tayapangilwe apo amapoyinti yashikwete imibalo ya nambala.

circle-too-many-through-points = Te kuti wapende icizingulushi icipitila mu mapoyinti ayacila pali yatatu.

circle-overprescribed-radius-center-points = Te kuti wapende icizingulushi na rediyasi, ipakati na mapoyinti ayasalwa.

circle-center-with-multiple-points = Te kuti wapende icizingulushi na ipakati lyasalwa icipitila mu ipoyinti ilyacila pali limo.

circle-radius-too-small = Te kuti wapende icizingulushi: apo ubutali pakati ka mapoyinti yabili buli { $distance }, rediyasi { $radius } iyasalwa yalinono nga nshi.

circle-radius-with-many-points = Te kuti wapange icizingulushi icipitila mu mapoyinti ayacila pali yabili na rediyasi iyasalwa.

circle-invalid-center-or-through-points = Ipakati nangu amapoyinti ya cizingulushi yabipa.

circle-radius-center-with-multiple-points = Te kuti wapende redioyasi ya cizingulushi na ipakati lyasalwa icipitila mu ipoyinti ilyacila pali limo.

circle-change-radius-non-numerical = Te kuti waalule redioyasi ya cizingulushi icipitila mu mapoyinti ayashikwete inambala

circle-radius-with-points-non-numerical = Te kuti wapange icizingulushi icipitila mu ipoyinti ilyacila pali limo na redioyasi iyasalwa nga takuli imibalo ya nambala.

circle-change-center-non-numerical = Ukwaalula ipakati lya cizingulushi icipitila mu mapoyinti ayashikwete imibalo ya nambala takwapangilwe.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Ubukulu tabwakumanina ku ncende ya ncito. Incende ikwata inshita { $intervals } lelo incito ikwata { $inputs ->
            [one] ukwingisha { $inputs }
           *[other] ukwingisha { $inputs }
        }.
       *[other] Ubukulu tabwakumanina ku ncende ya ncito. Incende ikwata inshita { $intervals } lelo incito ikwata { $inputs ->
            [one] ukwingisha { $inputs }
           *[other] ukwingisha { $inputs }
        }.
    }

function-domain-invalid-format = Imipangile yabipa iya ncende ya ncito.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Kuleesuula umubalo ukalamba uushili wa nambala uwa ncito.
        [minimum] Kuleesuula umubalo uunono uushili wa nambala uwa ncito.
        [extremum] Kuleesuula umubalo wa kumpela uushili wa nambala uwa ncito.
        [point] Kuleesuula ipoyinti ilishili lya nambala ilya ncito.
        [slope] Kuleesuula ukuselemuka ukushili kwa nambala ukwa ncito.
       *[other] Kuleesuula { $type } iishili ya nambala iya ncito.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Kuleesuula umubalo ukalamba uushikwete cintu uwa ncito.
        [minimum] Kuleesuula umubalo uunono uushikwete cintu uwa ncito.
        [extremum] Kuleesuula umubalo wa kumpela uushikwete cintu uwa ncito.
        [point] Kuleesuula ipoyinti ilishikwete cintu ilya ncito.
       *[other] Kuleesuula { $type } iishikwete cintu iya ncito.
    }

function-points-too-close = Incito ikwata amapoyinti yabili ayali mupepi nga nshi. Te kuti walondolole incito.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Ukubwekeshapo kwa ncito kulacitika fye nga umwingi wa fyaingishiwa walingana no mwingi wa fifuma. Iyi ncito ikwata ukwingisha { $inputs } na { $outputs ->
            [one] ukufuma { $outputs }
           *[other] ukufuma { $outputs }
        }.
       *[other] Ukubwekeshapo kwa ncito kulacitika fye nga umwingi wa fyaingishiwa walingana no mwingi wa fifuma. Iyi ncito ikwata ukwingisha { $inputs } na { $outputs ->
            [one] ukufuma { $outputs }
           *[other] ukufuma { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Ubutali bwabipa ubwa mutande.  Bufwile ukuba umubalo uwapwa uushili wa panshi ya cabe.

sequence-invalid-step = Intampulo yabipa iya mutande.  Ifwile ukuba umubalo ku mutande wa musango wa { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" iyabipa iya mutande wa mibalo.  Ifwile ukuba umubalo.

sequence-invalid-endpoint-letters = "{ $attribute }" iyabipa iya mutande wa filembo.  Ifwile ukuba ukusakanya kwa filembo.

sequence-invalid-endpoint = "{ $attribute }" iyabipa iya mutande.

select-from-sequence-coprime-not-numbers = coprime yasuulwa pantu takulesalwa imibalo

select-from-sequence-coprime-with-exclude-combinations = coprime yasuulwa pantu excludeCombinations yasalwa

## Resolving a `target`

target-not-found = Ico cilelolwa icabipa ica `<{ $source }>`: ico cilelolwa tacasangwa.

target-state-variable-not-found = Ico cilelolwa icabipa ica `<{ $source }>`: takwasangilwe icaaluka ca mibele iciitwa "{ $property }" pa `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Ifyaaluka fya `<odeSystem>` fifwile ukupusana ne caaluka iciiminina cine.

ode-system-duplicate-variable-names = Te kuti walondolole imilimo ya ODE RHS na mashina ya fyaaluka ayabwelezhiwa.

ode-system-rhs-function-error = Te kuti walondolole umulimo wa ODE RHS.  Ubulubo mu kupanga umulimo wa mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Te kuti walondolole ingeli pakati ka mitalale { $count }

angle-invalid-through-point = Ipoyinti ilyabipa pa through ya `<angle>`

parabola-vertex-too-many-points = Parabola na ipoyinti lya pa muulu iipitila mu ipoyinti ilyacila pali limo tayapangilwe.

parabola-too-many-points = Parabola iipitila mu mapoyinti ayacila pali yatatu tayapangilwe.

intersection-too-many-items = Ukukumanya kwa fintu ifyacila pali fibili takwapangilwe

## Other math components

ionic-compound-not-two-ions = Ukusakanya kwa ayoni ukushili kwa ayoni shibili takwapangilwe.

ionic-compound-needs-cation-and-anion = Ukusakanya kwa ayoni kwapangilwe fye kwa katayoni imo na anayoni imo.

solve-equations-cannot-evaluate = Te kuti wapwishe icilingano pantu tacapimwa: { $equation }

math-operators-operand-number-required = Ufwile ukusala operandNumber nga ulefumya operand ya mibalo.

eigen-decomposition-failed = Takwacitikile ukupenda imibalo ya eigen iya metrikisi

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: iparameta { $parameters } taili mu mipangile, e ico ikalalingana ne cifulo icabula icintu lyonse.
       *[other] `<matchesPattern>`: amaparameta { $parameters } tayali mu mipangile, e ico yakalalingana ne cifulo icabula icintu lyonse.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: te kuti wumfwe grid="{ $grid }". Ifwile ukuba none, medium, dense, nangu imibalo ibili iikalamba ukucila cabe iyapaatukanya no mwanya, nga grid="1 0.5". Takwalembwe girindi.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" tayaafwilishiwa ku kalanga wa prefigure; kulebomfiwa imibele ya right.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" tayaafwilishiwa ku kalanga wa prefigure; kulebomfiwa imibele ya top.

prefigure-invalid-axis-bounds = `<graph>`: impela sha akisi ishabipa isha kwaalula kwa prefigure; kulebomfiwa bbox ya cinkulu (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: ubwipi ubwabipa ubwa kwaalula kwa prefigure; kulebomfiwa ubwipi bwa cinkulu ubwa 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio iyabipa iya kwaalula kwa prefigure; kulebomfiwa icipimo ca cinkulu ica 1.

prefigure-grid-spacing-too-fine = `<graph>`: umwanya wa girindi walinono nga nshi ku mpela sha akisi; girindi yashiiwa ku kalanga wa prefigure.

prefigure-annotations-not-rendered = `<graph>`: ifyalembwa tafyakalangwe nga tekubomfiwa kalanga wa PreFigure.

multiple-annotations-children = Kwasangwa abana abengi aba `<annotations>` muli `<graph>`; bonse kano uwa kumpela balisuulwa.

## Referring to other components

copy-unrecognized-component-type = Te kuti wakushe nangu ukukopa umusango wa cipande uushaishibikwa: { $type }.

copy-prop-not-found = Takwasangilwe icishinka { $property } pa cipande ca musango wa { $component }

collect-no-source = Takwasangilwe intulo ya collect.

collect-invalid-component-type = Te kuti walonganike ifipande fya musango wa `<{ $component }>` pantu ni musango wa cipande uwabipa.

reference-index-unavailable = Te kuti walange inambala `{ $reference }`

## `<callAction>`

component-action-unavailable = Te kuti waite { $action } pa cipande `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Idata ikwata imipangile yabipa.  Imitalale ikwata ubutali ubushilingene. Yasangwa pa componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Idata ikwata amashina ya makolomu ayabwelezhiwa.  Yasangwa pa componentIdx :{ $componentIdx }

data-frame-missing-column-name = Idata taikwata ishina lya kolomu.  Yasangwa pa componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award ya ici casuko yashintilila pa casuko ca tagi ya answer iine, ico cikaleta imibele iishilelolelwe.

answer-max-num-attempts-in-section-wide-check-work = Ukubika `maxNumAttempts` pa `<answer>` iili mukati mwa cakwatila icakwata `sectionWideCheckWork` takukwata mulimo, pantu umwingi wa kwesha ulateekwa ne cakwatila. Bika `maxNumAttempts` pa cakwatila.

nested-section-wide-check-work-max-num-attempts = Ukubika `maxNumAttempts` pa cakwatila icakwata `sectionWideCheckWork` icili mukati mwa cimbi icakwata `sectionWideCheckWork` takukwata mulimo, pantu umwingi wa kwesha ulateekwa ne cakwatila ca kunse. Bika `maxNumAttempts` pa cakwatila ca kunse.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Icishinka ca { $attributes } tacakakwate mulimo ukwabula symbolicEquality.
       *[other] Ifishinka fya { $attributes } tafyakakwate mulimo ukwabula symbolicEquality.
    }

answer-invalid-type = Umusango uwabipa uwa casuko: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Apo icipande `<{ $component }>` cishikwete ishina, te kuti cibomfiwe nga icishinka ca module

module-attribute-name-already-defined = Icipande `<{ $component } name="{ $name }">` te kuti cibomfiwe nga icishinka ca module pantu umusango wa cipande wa `<module>` walikwata kale icishinka ca "{ $name }".

conditional-content-condition-ignored = Icishinka ca `condition` cilasuulwa pa cipande ca `<conditionalContent>` icakwata abana ba case nangu ba else.

slider-markers-type-mismatch = Umusango wa fishibilo taulingana no musango wa slider.

pretzel-problem-needs-statement-and-answer = pretzel iyabipa: `<problem>` yonse ifwile ukukwata `<statement>` imo na `<answer>` imo.

pretzel-circuit-first-problem-distractor = pretzel iyabipa: pa mode="circuit", `<problem>` ya kubalilapo te kuti ibe iya kupumbula.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Umubalo uwabipa { $values } uwa cishinka `{ $attribute }`; kuleesuula.
       *[other] Imibalo iyabipa { $values } iya cishinka `{ $attribute }`; kuleesuula.
    }

attribute-must-be-references = Umubalo uwabipa `{ $value }` uwa cishinka `{ $attribute }`. Icishinka cifwile ukupangwa na fyalangilila ifitendeka na `$`.

math-input-invalid-function-names = <mathInput>: kwasuulwa amashina ya ncito ayabipa pa { $attribute }: { $names }. Icipande ca kulanga ica ishina lyonse cifwile ukukwata ifilembo fibili nangu ni panono (ifilembo nangu utumitalale); `|<mathspeak alternative>` kuti yakonkapo.

## Building components from the source

component-type-invalid = Umusango uwabipa uwa cipande: `<{ $componentType }>`

attribute-repeated = Te kuti ubwelezhe icishinka { $attribute }.

attribute-invalid-for-component = Icishinka icabipa "{ $attribute }" ica cipande ca musango wa `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Ubulondoloshi bwa musango { $styleNumber } tabukwete ukupusana ukwakumanina kwa { $context ->
        [text-on-background] mubala wa malembo ku mubala wa cishinte
        [high-contrast] mubala wa kupusana ukukalamba ku kanvasi
        [line] mubala wa mutalale ku kanvasi
        [marker] mubala wa cishibilo ku kanvasi
       *[text-on-canvas] mubala wa malembo ku kanvasi
    }{ $mode ->
        [dark] { " (imibele ya mfifi)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kulekabilwa { $threshold }:1 nangu ni panono).

style-definition-dark-mode-text-background-contrast =
    Nangu ca kuti ubulondoloshi bwa musango { $styleNumber } bwasala imibala iyakwata ukupusana ukwakumanina ukwa mibele ya lubuuto, imibala ya mibele ya mfifi iyafuma ku mibalo iyi taikwete ukupusana ukwakumanina kwa mubala wa malembo ku mubala wa cishinte ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kulekabilwa { $threshold }:1 nangu ni panono). { $suggestion ->
        [available] Pa kuti ukupusana kukumanine mu mibele ya mfifi, kusha ukupusana kwa mibele ya lubuuto (ku ca kumwenako, bika { $lightAttribute }="{ $lightColor }") nangu waalule umubala wa mibele ya mfifi (ku ca kumwenako, bika { $darkAttribute }="{ $darkColor }").
       *[none] Pa kuti ukupusana kukumanine mu mibele ya mfifi, kusha ukupusana kwa mibele ya lubuuto nangu waalule imibala iyafuma na textColorDarkMode na/nangu backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Nangu ca kuti ubulondoloshi bwa musango { $styleNumber } bwasala umubala wa malembo uukwete ukupusana ukwakumanina ukwa mibele ya lubuuto, umubala wa malembo uwa mibele ya mfifi uwafuma ku mubalo uyu taukwete ukupusana ukwakumanina ku kanvasi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kulekabilwa { $threshold }:1 nangu ni panono). { $suggestion ->
        [available] Pa kuti ukupusana kukumanine mu mibele ya mfifi, kusha ukupusana kwa mibele ya lubuuto (ku ca kumwenako, bika textColor="{ $lightColor }") nangu waalule umubala wa mibele ya mfifi (ku ca kumwenako, bika textColorDarkMode="{ $darkColor }").
       *[none] Pa kuti ukupusana kukumanine mu mibele ya mfifi, kusha ukupusana kwa mibele ya lubuuto nangu waalule umubala uwafuma na textColorDarkMode.
    }

section-multiple-style-palettes = Icipandwa kuti casala <stylePalette> imo fye; kulebomfiwa iya kumpela.

## Unique variants

variant-num-to-select-not-non-negative-integer = te kuti wishibe imisango yaibela iya { $component } pantu numToSelect tauli mubalo uwapwa uushili wa panshi ya cabe.

variant-num-to-select-not-constant-number = te kuti wishibe imisango yaibela iya { $component } pantu numToSelect tauli mubalo uushaaluka.

variant-with-replacement-not-constant-boolean = te kuti wishibe imisango yaibela iya { $component } pantu withReplacement taili boolean iishaaluka.

variant-select-weight-disables-unique = Imisango yaibela iya select ilaisalwa nga kwaba ukusala ukwakwata selectWeight nangu selectForVariants

variant-coprime-undetermined = te kuti wishibe imisango yaibela iya { $component } pantu te kuti wishibe ukuti coprime ni bufi lyonse.

variant-attribute-not-constant = te kuti wishibe imisango yaibela iya { $component } pantu { $attribute } taikala ifyo fine.

variant-attribute-not-number = te kuti wishibe imisango yaibela iya { $component } pantu { $attribute } tauli mubalo.

variant-attribute-wrong-type-for-sequence =
    te kuti wishibe imisango yaibela iya { $component } iya musango wa { $type } pantu { $attribute } taili { $expected ->
        [letters-combination] ukusakanya kwa filembo
        [math-expression] ukulanda kwa mibalo ukwasuminishiwa
        [integer] umubalo uwapwa
       *[number] umubalo
    }.

variant-length-not-integer = te kuti wishibe imisango yaibela iya { $component } pantu length tauli mubalo uwapwa.

variant-sort-not-implemented = imisango yaibela iya { $component } iyakwata sort tayapangilwe

variant-exclude-combinations-not-implemented = imisango yaibela iya { $component } iyakwata excludeCombinations tayapangilwe

variant-math-exclude-not-implemented = imisango yaibela iya { $component } iya musango wa math iyakwata exclude tayapangilwe

variant-non-constant-exclude-not-implemented = imisango yaibela iya { $component } iyakwata exclude iyaaluka tayapangilwe

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: tayaafwilishiwa ku kalanga wa graph prefigure; umukonshi washiiwa.

prefigure-descendant-invalid-geometry = { $subject }: jiyometri iishipwa nangu iishakumana; umukonshi washiiwa.

prefigure-curve-label-omitted = { $subject }: amashina tayaafwilishiwa ku fipande fya mutalale uwapindama ifyaalulwa; ishina lyashiiwa.

prefigure-curve-unsupported-definition-type = { $subject }: umusango wa bulondoloshi bwa ncito ya mutalale uwapindama '{ $definitionType }' taufwilishiwa; umukonshi washiiwa.

prefigure-region-flip-functions-unsupported = { $subject }: icishinka ca flipFunctions pa regionBetweenCurves tacafwilishiwa; umukonshi washiiwa.

prefigure-region-non-formula-child = { $subject }: imilimo ya bana iya musango wa formula e yeka iyafwilishiwa pa regionBetweenCurves; umukonshi washiiwa.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' taifwilishiwa ku { $labelKind ->
        [line-family] ishina lya lupwa lwa mitalale
       *[point] ishina lya poyinti
    }; kulebomfiwa ukulinganya kwa cinkulu ukwa PreFigure.

prefigure-fill-style-unsupported = { $subject }: umusango wa kwisusha '{ $fillStyle }' taufwilishiwa na PreFigure; kulebwelela ku kwisusha ukwakosa.

prefigure-line-style-unknown = { $subject }: umusango wa mutalale uushaishibikwa '{ $lineStyle }' washiiwa ku fifuma fya PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: umusango wa cishibilo '{ $markerStyle }' waalulwa ku musango wa PreFigure uwa 'diamond'.

prefigure-marker-style-unsupported = { $subject }: umusango wa cishibilo '{ $markerStyle }' taufwilishiwa na PreFigure; kulebomfiwa umusango wa cinkulu.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` iyabipa; te kuti wasange ico cilelolwa. Ubulondoloshi bwashiiwa.

annotation-ref-multiple-targets = `<annotation>`: `ref` yalangile ifintu ifingi; kulebomfiwa ica kubalilapo.

annotation-ref-outside-graph = `<annotation>`: `ref` iyabipa; ico cilelolwa cili ku nse ya graph iicikwete. Ubulondoloshi bwashiiwa.

annotation-ref-unsupported-target = `<annotation>`: `ref` iyabipa; ico cilelolwa tacili cintu ca cikope icafwilishiwa mu kwaalula kwa prefigure. Ubulondoloshi bwashiiwa.

annotation-text-missing = `<annotation>`: `text` tailipo nangu taikwete cintu; kulefumya amalembo ayabula icintu.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Kwasangwa ukushintilila ukwazingulusha.
       *[other] Kwasangwa ukushintilila ukwazingulusha ukwabimba icipande ca `<{ $componentType }>`.
    }

reference-no-referent = Takwasangilwe cintu pa cilangilila: `{ $reference }`

reference-multiple-referents = Kwasangwa ifintu ifingi pa cilangilila: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Imipangile yabipa iya cishinka { $attribute } ica `<{ $componentType }>`.

children-invalid = Abana ababipa aba `<{ $componentType }>`: Kwasangwa abana ababipa: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Umubalo uwabipa `{ $value }` uwa cishinka `{ $attribute }`, kulebomfiwa umubalo `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Ubwikashi bwa DoenetML { $version } tabwasangwa.
       *[other] Ubwikashi bwa DoenetML { $version } tabwasangwa. Kulebwelela ku bwikashi { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML iyabipa: { $content }

parse-tag-missing-close-tag = DoenetML iyabipa: Tagi `{ $tag }` taikwete tagi ya kwisala. Kwalelolelwa tagi iiisala nangu tagi ya `</{ $tagName }>`.

parse-tag-error = DoenetML iyabipa: Ubulubo pa tagi `<{ $tagName }>`

parse-attribute-missing-value = DoenetML iyabipa: Icishinka icabipa `{ $attribute }` cimoneka ukwabula umubalo.

parse-attribute-invalid = DoenetML iyabipa: Icishinka icabipa `{ $attribute }`

parse-attribute-value-invalid = DoenetML iyabipa: Umubalo wa cishinka uwabipa `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML iyabipa: Umubalo wa cishinka uwabipa `{ $value }`. Ifishibilo fya kwambula tafililingana. Cimoneka ukubula `{ $quote }`

parse-open-tag-name-missing = DoenetML iyabipa: Kwasangwa tagi iishikwete ishina, ku ca kumwenako `<`

parse-tag-not-closed = DoenetML iyabipa: Tagi `{ $tag }` taisalilwe (cimoneka ukubula `>`).

parse-self-closing-tag-name-missing = DoenetML iyabipa: Kwasangwa tagi iishikwete ishina `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML iyabipa: Tagi `{ $tag }` taisalilwe (cimoneka ukubula `/>`).

parse-tag-invalid-attributes = DoenetML iyabipa: Tagi `{ $tag }` taisuminishiwa. Kuti yakwata ifishinka ifyabipa.

parse-close-tag-name-missing = DoenetML iyabipa: Kwasangwa tagi ya kwisala iishikwete ishina, ku ca kumwenako `</`

parse-attribute-value-unquoted = Imibalo ya fishinka ifwile ukuba mukati mwa fishibilo fya kwambula: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML iyabipa: Kwasangwa tagi ya kwisala `{ $tag }`, lelo takuli tagi ya kwisula iilingene

parse-close-tag-mismatched = DoenetML iyabipa: Tagi ya kwisala tailingene. Kwalelolelwa `</{ $expected }>`. Kwasangwa `{ $found }`

parser-node-unconvertible = Takwacitikile ukwaalula nodi { $node } ukuba nodi ya Dast.

## Names

name-attribute-invalid =
    Ishina lya cishinka lyabipa name='{ $name }'. { $reason ->
        [characters] Amashina kuti yakwata fye ifilembo, inambala, utumitalale twa panshi nangu utumitalale.
       *[start] Amashina yafwile ukutendeka ne cilembo.
    }

component-name-invalid-start = Ishina lya cipande lyabipa "{ $name }". Amashina yafwile ukutendeka ne cilembo.

## `<answer>` sugar

answer-video-watched-missing-video = Icasuko ca musango wa videoWatched cifwile ukukwata icishinka ca video

answer-video-watched-video-not-reference = Icasuko ca musango wa videoWatched cifwile ukukwata icishinka ca video icili cilangilila

answer-name-not-single-text = Icishinka ca name ica casuko cifwile ukukwata umwana umo uwa malembo

## Referencing another document

external-doenetml-recursion-limit = Takwacitikile ukuleta DoenetML ya kunse pa mulandu wa mataampulo ayengi nga nshi aya kubwekeshapo. Bushe kwaba icilangilila icazingulusha?

external-doenetml-unavailable = Takwacitikile ukuleta DoenetML ukufuma ku { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML iyaletwa ukufuma ku { $attribute }="{ $uri }" yabipa: tailingene no musango wa cipande wa "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Icishinka `{ $from }` tacilebomfiwa; bomfya `{ $to }` mu cifulo cakwe.
       *[other] [deprecation] Icishinka `{ $from }` pa `<{ $component }>` tacilebomfiwa; bomfya `{ $to }` mu cifulo cakwe.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Icishinka `{ $from }` tacilebomfiwa kabili cilasuulwa pantu na `{ $to }` yasalwa.
       *[other] [deprecation] Icishinka `{ $from }` pa `<{ $component }>` tacilebomfiwa kabili cilasuulwa pantu na `{ $to }` yasalwa.
    }

deprecated-attribute-ignored = [deprecation] Icishinka `{ $attribute }` pa `<{ $component }>` tacilebomfiwa kabili cilasuulwa.

deprecated-attribute-to-child = [deprecation] Icishinka `{ $attribute }` pa `<{ $component }>` tacilebomfiwa; bomfya umwana wa `<{ $child }>` mu cifulo cakwe.

deprecated-attribute-value-renamed = [deprecation] Umubalo `{ $value }` uwa cishinka `{ $attribute }` pa `<{ $component }>` taulebomfiwa; bomfya `{ $to }` mu cifulo cakwe.


## Language coverage

pluralize-english-only = `<pluralize>` kuti yapanga fye ubwingi bwa ciNgeleshi, e ico amalembo yakwe yalashiwa ifyo yaba mu cipepala icalembwa mu { $locale }. Lemba imipangile ya bwingi wine wine, nangu uibike ne cishinka ca `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Icipande `<{ $tag }>` tacili cipande ca Doenet icaishibikwa.

schema-element-not-allowed-at-root = Icipande `<{ $tag }>` tacasuminishiwa pa mushi wa cipepala.

schema-element-not-allowed-inside = Icipande `<{ $tag }>` tacasuminishiwa mukati mwa `<{ $parent }>`.

schema-attribute-unrecognized = Icipande `<{ $tag }>` tacikwete icishinka iciitwa `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Icishinka `{ $attribute }` ica cipande `<{ $tag }>` cifwile ukuba umutande uo ifintu fyakwe fyaba fimo pali: { $allowed }
       *[other] Icishinka `{ $attribute }` ica cipande `<{ $tag }>` cifwile ukuba cimo pali: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Ishina lya musango lyabipa ku select.  Ishina lya musango { $variantName } lilamoneka mu fyakusala { $numOptions } lelo umwingi wa kusala ni { $numToSelect }.

select-variant-name-without-options = Imisango imo yasalwa ku select lelo takuli ifyakusala ifyasalwa ifya ishina lya musango ilingacitika: { $variantName }.

select-variant-name-not-possible = Ishina lya musango { $variantName } ilyasalwa ku select tacili ishina lya musango ilingacitika.

select-too-few-options = Te kuti wasale ifipande { $numToSelect } ukufuma fye muli { $numOptions }.

select-from-sequence-too-few-values = Te kuti wasale imibalo { $numToSelect } ukufuma mu mutande wa butali bwa { $length }.

select-from-sequence-indices-count-mismatch = Umwingi wa nambala ishasalwa ku select ufwile ukulingana no mwingi wa kusala

select-from-sequence-indices-not-integers = Inambala shonse ishasalwa ku select shifwile ukuba imibalo iyapwa

select-from-sequence-index-excluded = Inambala iyasalwa iya selectfromsequence yalifumishiwepo

select-from-sequence-indices-excluded-combination = Inambala ishasalwa isha selectfromsequence shali kusakanya ukwafumishiwepo

select-from-sequence-coprime-not-positive-integers = Te kuti wasale ukusakanya kwa coprime pantu takulesalwa imibalo iyapwa iikalamba ukucila cabe.

select-from-sequence-coprime-common-factor = Te kuti wasale imibalo ya coprime. Imibalo yonse iingacitika ikwata icakupaatukanya cimo cine. (Imibalo iyasalwa iya "from" nangu "to" ifwile ukuba coprime na "step".)

select-from-sequence-coprime-single-number = Te kuti wasale ukusakanya kwa coprime ukufuma ku mubalo umo uushili 1.

select-from-sequence-excluded-too-many-combinations = Kwafumishiwepo ukucila 70% ya kusakanya mu selectFromSequence

select-from-sequence-coprime-none-found = Takwacitikile ukusala imibalo ya coprime. Imibalo yonse iingacitika ikwata icakupaatukanya cimo cine.

select-from-sequence-too-few-unique-values = Te kuti wasale imibalo yaibela { $numToSelect } ukufuma mu mutande wa butali bwa { $numPossibleValues }

select-prime-numbers-too-few-values = Te kuti wasale imibalo { $numToSelect } ukufuma mu mutande wa nambala sha prime uwa butali bwa { $numValues }

select-prime-numbers-values-count-mismatch = Umwingi wa mibalo iyasalwa ku select ufwile ukulingana no mwingi wa kusala

select-prime-numbers-values-not-prime = Imibalo yonse iyasalwa ku select prime number ifwile ukuba mu mutande wa nambala sha prime

select-prime-numbers-values-excluded-combination = Imibalo iyasalwa iya selectPrimeNumbers yali kusakanya ukwafumishiwepo

select-prime-numbers-excluded-too-many-combinations = Kwafumishiwepo ukucila 70% ya kusakanya mu selectPrimeNumbers

select-random-combination-fluke = Pa mulandu wa cintu icishalelolelwe nga nshi, takwacitikile ukusala ukusakanya kwa mibalo iyabula ukusala

select-random-value-fluke = Pa mulandu wa cintu icishalelolelwe nga nshi, takwacitikile ukusala umubalo uwabula ukusala
