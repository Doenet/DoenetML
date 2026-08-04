# Irish diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
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
# Irish counts in five plural categories, so a counted message is written out
# in all five. The noun after a numeral stays singular and is eclipsed after
# `seacht` to `deich`, which is what separates `many` from the rest.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] déantar neamhaird de { $attributes } nuair a shonraítear dhá chríochphointe
       *[other] déantar neamhaird de { $attributes } nuair a shonraítear dhá chríochphointe
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] déantar neamhaird de { $attributes } nuair a shonraítear críochphointe agus lárphointe le chéile
       *[other] déantar neamhaird de { $attributes } nuair a shonraítear críochphointe agus lárphointe le chéile
    }

line-segment-midpoint-offset-without-midpoint = níl aon éifeacht ag midpointOffset gan lárphointe

## `<line>`

line-points-undetermined-dimensions = Líne trí phointí nach eol a dtoisí.

line-points-too-few-dimensions = Caithfidh an líne dul trí phointí a bhfuil dhá thoise ar a laghad acu.

line-points-depend-on-variables = Téann an líne trí phointí atá ag brath ar athróga: { $variables }.

line-equation-invalid-format = Formáid neamhbhailí do chothromóid líne sna hathróga { $variable1 } agus { $variable2 }.

## `<ray>`

ray-overprescribed-through = Tá an ga sonraithe ag through, endpoint agus direction.  Déantar neamhaird den through sonraithe.

ray-dimension-mismatch = Mímheaitseáil numDimensions sa ga.

## `<vector>`

vector-overprescribed-head = Tá an veicteoir sonraithe ag head, tail agus displacement.  Déantar neamhaird den head sonraithe.

vector-dimension-mismatch = Mímheaitseáil numDimensions sa veicteoir.

## Attracting and constraining

attract-to-without-nearest-point = Ní féidir tarraingt chuig `<{ $component }>` toisc nach bhfuil athróg staide nearestPoint aige.

constrain-to-without-nearest-point = Ní féidir srianadh chuig `<{ $component }>` toisc nach bhfuil athróg staide nearestPoint aige.

constrain-to-interior-without-nearest-point = Ní féidir srianadh chuig taobh istigh de `<{ $component }>` toisc nach bhfuil athróg staide nearestPoint aige.

## `<choiceInput>`

choice-input-label-position-ignored = Déantar neamhaird de labelPosition i gcás choiceInput nach bhfuil inlíne

## Ordering children by index

choice-input-indices-count-mismatch = Déantar neamhaird de na hinnéacsanna a shonraítear do choiceInput toisc nach ionann líon na n-innéacsanna agus líon na leanaí choice.

pretzel-indices-count-mismatch = Déantar neamhaird de na hinnéacsanna a shonraítear do problem toisc nach ionann líon na n-innéacsanna agus líon na leanaí problem.

shuffle-indices-count-mismatch = Déantar neamhaird de na hinnéacsanna a shonraítear do shuffle toisc nach ionann líon na n-innéacsanna agus líon na gcomhpháirteanna.

indices-ignored-out-of-range = Déantar neamhaird de na hinnéacsanna a shonraítear do { $component } toisc go bhfuil roinnt innéacsanna lasmuigh den raon.

pretzel-indices-repeated = Déantar neamhaird de na hinnéacsanna a shonraítear do pretzel toisc go bhfuil innéacsanna áirithe athráite.

pretzel-circuit-first-index = Déantar neamhaird de na hinnéacsanna a shonraítear do pretzel i mód circuit toisc go gcaithfidh an chéad innéacs a bheith ina 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Le go n-oibreoidh `<{ $component }>` le leanaí teaghráin, caithfear aitreabúid `type` a shonrú.

invalid-type-defaulting-to-math = Cineál neamhbhailí { $type } don chomhpháirt { $component }. Caithfidh sé a bheith ina cheann de math, text, number nó boolean. Ag titim siar ar math.

string-not-valid-component-to-arrange = Ní comhpháirt bhailí do { $component } é an teaghrán "{ $value }". Ag déanamh neamhairde de.

## Types and variables

invalid-type-defaulting-to-number = Cineál neamhbhailí { $type }, ag socrú an chineáil go number.

invalid-variable-value = Luach neamhbhailí athróige: `{ $value }`

## Variants

variant-index-must-be-number = Caithfidh innéacs an leagain { $index } a bheith ina uimhir

variant-index-must-be-integer = Caithfidh innéacs an leagain { $index } a bheith ina shlánuimhir

## `<sideBySide>`

side-by-side-absolute-widths = Níl `<{ $component }>` curtha i bhfeidhm do thomhais dhearbha. Ag socrú na leithead go coibhneasta.

side-by-side-absolute-margins = Níl `<{ $component }>` curtha i bhfeidhm do thomhais dhearbha. Ag socrú na n-imeall go coibhneasta.

side-by-side-no-block-child = `<{ $component }>` neamhbhailí: caithfidh leanbh bloic amháin ar a laghad a bheith aige.

## `<label>`

label-for-ignored-on-graphical = Déantar neamhaird den aitreabúid `for` ar `<label>` grafach.

label-for-must-resolve-to-one = Caithfidh an aitreabúid `for` ar `<label>` réiteach go díreach comhpháirt amháin.

label-for-unresolved = Níorbh fhéidir an aitreabúid `for` ar `<label>` a réiteach go comhpháirt.

label-for-answer-with-authored-inputs = Tagraíonn an aitreabúid `for` ar `<label>` do `<answer>` a bhfuil ionchuir shainráite scríofa aige; tagair don ionchur go díreach.

label-for-answer-without-input = Tagraíonn an aitreabúid `for` ar `<label>` do `<answer>` gan ionchur le lipéadú.

label-for-must-reference-input-or-answer = Caithfidh an aitreabúid `for` ar `<label>` tagairt d'ionchur nó do fhreagra.

## Accessibility

accessibility-short-description-or-decorative = Ar mhaithe le hinrochtaineacht, caithfidh cur síos gearr a bheith ar `<{ $component }>` nó é a bheith sonraithe mar mhaisiúil.

accessibility-video-short-description = Ar mhaithe le hinrochtaineacht, caithfidh cur síos gearr a bheith ar `<video>`.

accessibility-input-short-description-or-label = Ar mhaithe le hinrochtaineacht, caithfidh cur síos gearr nó lipéad a bheith ar `<{ $component }>`.

accessibility-answer-input-short-description-or-label = Ar mhaithe le hinrochtaineacht, caithfidh cur síos gearr nó lipéad a bheith ar `<answer>` a chruthaíonn ionchur.

accessibility-short-description-contains-math = Níor cheart go mbeadh comhpháirteanna matamaitice ar nós `<{ $component }>` i gcur síos gearr. Scríobh amach aon mhatamaitic i bhfocail.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Níl codarsnacht leordhóthanach ag { $colorName } do théacs cheannteideal an rannáin (mód dorcha) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; teastaíonn { $threshold }:1 ar a laghad).
       *[other] Níl codarsnacht leordhóthanach ag { $colorName } do théacs cheannteideal an rannáin ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; teastaíonn { $threshold }:1 ar a laghad).
    }

## `<circle>`

circle-through-points-non-numerical = Níl `<circle>` trí { $count } pointe curtha i bhfeidhm sa chás nach bhfuil luachanna uimhriúla ag na pointí.

circle-too-many-through-points = Ní féidir ciorcal trí níos mó ná 3 phointe a ríomh.

circle-overprescribed-radius-center-points = Ní féidir ciorcal a ríomh le ga, lárphointe agus pointí trasnaithe sonraithe.

circle-center-with-multiple-points = Ní féidir ciorcal a ríomh le lárphointe sonraithe trí níos mó ná pointe amháin.

circle-radius-too-small = Ní féidir an ciorcal a ríomh: ós rud é gurb é { $distance } an fad idir an dá phointe, tá an ga sonraithe { $radius } róbheag.

circle-radius-with-many-points = Ní féidir ciorcal trí níos mó ná dhá phointe a chruthú le ga sonraithe.

circle-invalid-center-or-through-points = Lárphointe nó pointí trasnaithe neamhbhailí don chiorcal.

circle-radius-center-with-multiple-points = Ní féidir ga ciorcail a ríomh le lárphointe sonraithe trí níos mó ná pointe amháin.

circle-change-radius-non-numerical = Ní féidir ga ciorcail a athrú nuair nach bhfuil luachanna uimhriúla ag na pointí trasnaithe

circle-radius-with-points-non-numerical = Ní féidir ciorcal trí níos mó ná pointe amháin a chruthú le ga sonraithe nuair nach bhfuil luachanna uimhriúla ann.

circle-change-center-non-numerical = Níl athrú lárphointe ciorcail trí phointí gan luachanna uimhriúla curtha i bhfeidhm.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Toisí neamhleora don fhearann feidhme. Tá { $intervals } eatramh ag an bhfearann ach tá { $inputs ->
            [one] { $inputs } ionchur
           *[other] { $inputs } ionchur
        } ag an bhfeidhm.
       *[other] Toisí neamhleora don fhearann feidhme. Tá { $intervals } eatramh ag an bhfearann ach tá { $inputs ->
            [one] { $inputs } ionchur
           *[other] { $inputs } ionchur
        } ag an bhfeidhm.
    }

function-domain-invalid-format = Formáid neamhbhailí don fhearann feidhme.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ag déanamh neamhairde d'uasmhéid neamhuimhriúil na feidhme.
        [minimum] Ag déanamh neamhairde d'íosmhéid neamhuimhriúil na feidhme.
        [extremum] Ag déanamh neamhairde de fhoirceann neamhuimhriúil na feidhme.
        [point] Ag déanamh neamhairde de phointe neamhuimhriúil na feidhme.
        [slope] Ag déanamh neamhairde de fhána neamhuimhriúil na feidhme.
       *[other] Ag déanamh neamhairde de { $type } neamhuimhriúil na feidhme.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ag déanamh neamhairde d'uasmhéid folamh na feidhme.
        [minimum] Ag déanamh neamhairde d'íosmhéid folamh na feidhme.
        [extremum] Ag déanamh neamhairde d'fhoirceann folamh na feidhme.
        [point] Ag déanamh neamhairde de phointe folamh na feidhme.
       *[other] Ag déanamh neamhairde de { $type } folamh na feidhme.
    }

function-points-too-close = Tá dhá phointe sa fheidhm atá róghar dá chéile. Ní féidir an fheidhm a shainmhíniú.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Níl atriallta feidhme indéanta ach amháin nuair is ionann líon ionchur na feidhme agus líon a haschur. Tá { $inputs } ionchur agus { $outputs ->
            [one] { $outputs } aschur
           *[other] { $outputs } aschur
        } ag an bhfeidhm seo.
       *[other] Níl atriallta feidhme indéanta ach amháin nuair is ionann líon ionchur na feidhme agus líon a haschur. Tá { $inputs } ionchur agus { $outputs ->
            [one] { $outputs } aschur
           *[other] { $outputs } aschur
        } ag an bhfeidhm seo.
    }

## `<sequence>`

sequence-invalid-length = Fad neamhbhailí seichimh.  Caithfidh sé a bheith ina shlánuimhir neamhdhiúltach.

sequence-invalid-step = Céim neamhbhailí seichimh.  Caithfidh sé a bheith ina uimhir do sheicheamh den chineál { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" neamhbhailí de sheicheamh uimhreacha.  Caithfidh sé a bheith ina uimhir.

sequence-invalid-endpoint-letters = "{ $attribute }" neamhbhailí de sheicheamh litreacha.  Caithfidh sé a bheith ina chomhcheangal litreacha.

sequence-invalid-endpoint = "{ $attribute }" neamhbhailí de sheicheamh.

select-from-sequence-coprime-not-numbers = déantar neamhaird de coprime toisc nach uimhreacha atá á roghnú

select-from-sequence-coprime-with-exclude-combinations = déantar neamhaird de coprime toisc go bhfuil excludeCombinations sonraithe

## Resolving a `target`

target-not-found = Sprioc neamhbhailí do `<{ $source }>`: ní féidir an sprioc a aimsiú.

target-state-variable-not-found = Sprioc neamhbhailí do `<{ $source }>`: ní féidir athróg staide darb ainm "{ $property }" a aimsiú ar `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Caithfidh athróga `<odeSystem>` a bheith difriúil leis an athróg neamhspleách.

ode-system-duplicate-variable-names = Ní féidir feidhmeanna RHS ODE a shainmhíniú le hainmneacha athróg spleách dúblacha.

ode-system-rhs-function-error = Ní féidir feidhm RHS ODE a shainmhíniú.  Earráid agus feidhm mathjs á cruthú.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ní féidir uillinn idir { $count } líne a shainmhíniú

angle-invalid-through-point = Pointe neamhbhailí i through de `<angle>`

parabola-vertex-too-many-points = Níl parabóil le stuaic trí níos mó ná pointe amháin curtha i bhfeidhm.

parabola-too-many-points = Níl parabóil trí níos mó ná 3 phointe curtha i bhfeidhm.

intersection-too-many-items = Níl trasnú níos mó ná dhá mhír curtha i bhfeidhm

## Other math components

ionic-compound-not-two-ions = Níl comhdhúil ianach curtha i bhfeidhm ach amháin do dhá ian.

ionic-compound-needs-cation-and-anion = Níl comhdhúil ianach curtha i bhfeidhm ach do chatian amháin agus anian amháin.

solve-equations-cannot-evaluate = Ní féidir an chothromóid a réiteach toisc nárbh fhéidir í a luacháil: { $equation }

math-operators-operand-number-required = Caithfear operandNumber a shonrú agus oibreann matamaitice á bhaint.

eigen-decomposition-failed = Níorbh fhéidir luachanna dhúchasacha an mhaitrís a ríomh

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: ní tharlaíonn an paraiméadar { $parameters } sa phatrún, mar sin meaitseálfaidh sé bearna i gcónaí.
       *[other] `<matchesPattern>`: ní tharlaíonn na paraiméadair { $parameters } sa phatrún, mar sin meaitseálfaidh siad bearna i gcónaí.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ní féidir grid="{ $grid }" a léirmhíniú. Caithfidh sé a bheith ina none, medium, dense, nó dhá uimhir dheimhneacha scartha le spás, mar shampla grid="1 0.5". Ní tharraingítear aon ghreille.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: ní thacaítear le xLabelPosition="left" i rindreálaí prefigure; ag úsáid iompar an tsuímh dheis.

prefigure-y-label-position-unsupported = `<graph>`: ní thacaítear le yLabelPosition="bottom" i rindreálaí prefigure; ag úsáid iompar an tsuímh uachtair.

prefigure-invalid-axis-bounds = `<graph>`: teorainneacha aise neamhbhailí don tiontú prefigure; ag úsáid an bbox réamhshocraithe (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: leithead neamhbhailí don tiontú prefigure; ag úsáid leithead léaráide réamhshocraithe 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio neamhbhailí don tiontú prefigure; ag úsáid an chóimheas gné réamhshocraithe 1.

prefigure-grid-spacing-too-fine = `<graph>`: tá spásáil na greille rómhín do theorainneacha na haise; fágtar an ghreille ar lár i rindreálaí prefigure.

prefigure-annotations-not-rendered = `<graph>`: ní rindreálfar anótálacha mura n-úsáidtear rindreálaí PreFigure.

multiple-annotations-children = Aimsíodh níos mó ná leanbh `<annotations>` amháin i `<graph>`; déantar neamhaird de gach ceann ach an ceann deireanach.

## Referring to other components

copy-unrecognized-component-type = Ní féidir cineál comhpháirte nach n-aithnítear a shíneadh nó a chóipeáil: { $type }.

copy-prop-not-found = Níorbh fhéidir an prop { $property } a aimsiú ar chomhpháirt den chineál { $component }

collect-no-source = Níor aimsíodh aon fhoinse do collect.

collect-invalid-component-type = Ní féidir comhpháirteanna den chineál `<{ $component }>` a bhailiú toisc gur cineál comhpháirte neamhbhailí é.

reference-index-unavailable = Ní féidir tagairt a dhéanamh don innéacs `{ $reference }`

## `<callAction>`

component-action-unavailable = Ní féidir { $action } a ghlaoch ar an gcomhpháirt `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Tá cruth neamhbhailí ag na sonraí.  Tá faid neamh-chomhsheasmhacha ag na rónna. Aimsíodh i componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Tá ainmneacha colúin dhúblacha sna sonraí.  Aimsíodh i componentIdx :{ $componentIdx }

data-frame-missing-column-name = Tá ainm colúin ar iarraidh sna sonraí.  Aimsíodh i componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Tá duais don fhreagra seo bunaithe ar an bhfreagra a sheol an chlib answer féin, rud a fhágfaidh iompar gan choinne.

answer-max-num-attempts-in-section-wide-check-work = Níl aon éifeacht ag `maxNumAttempts` a shocrú ar `<answer>` atá taobh istigh de choimeádán le `sectionWideCheckWork`, toisc gurb é an coimeádán a rialaíonn líon na n-iarrachtaí. Socraigh `maxNumAttempts` ar an gcoimeádán ina áit sin.

nested-section-wide-check-work-max-num-attempts = Níl aon éifeacht ag `maxNumAttempts` a shocrú ar choimeádán le `sectionWideCheckWork` atá taobh istigh de choimeádán eile le `sectionWideCheckWork`, toisc gurb é an coimeádán seachtrach a rialaíonn líon na n-iarrachtaí. Socraigh `maxNumAttempts` ar an gcoimeádán seachtrach ina áit sin.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Ní bheidh aon éifeacht ag an aitreabúid { $attributes } gan symbolicEquality socraithe.
       *[other] Ní bheidh aon éifeacht ag na haitreabúidí { $attributes } gan symbolicEquality socraithe.
    }

answer-invalid-type = Cineál neamhbhailí don fhreagra: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Toisc nach bhfuil ainm ar an gcomhpháirt `<{ $component }>`, ní féidir í a úsáid mar aitreabúid modúil

module-attribute-name-already-defined = Ní féidir an chomhpháirt `<{ $component } name="{ $name }">` a úsáid mar aitreabúid do mhodúl toisc go bhfuil aitreabúid "{ $name }" sainmhínithe cheana féin ag an gcineál comhpháirte `<module>`.

conditional-content-condition-ignored = Déantar neamhaird den aitreabúid `condition` ar chomhpháirt `<conditionalContent>` a bhfuil leanaí case nó else aici.

slider-markers-type-mismatch = Ní ionann cineál na marcóirí agus cineál an tsleamhnáin.

pretzel-problem-needs-statement-and-answer = Pretzel neamhbhailí: caithfidh `<statement>` amháin agus `<answer>` amháin a bheith i ngach `<problem>`.

pretzel-circuit-first-problem-distractor = Pretzel neamhbhailí: i mode="circuit", ní féidir leis an gcéad `<problem>` a bheith ina seachránaí.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Luach neamhbhailí { $values } don aitreabúid `{ $attribute }`; ag déanamh neamhairde de.
       *[other] Luachanna neamhbhailí { $values } don aitreabúid `{ $attribute }`; ag déanamh neamhairde díobh.
    }

attribute-must-be-references = Luach neamhbhailí `{ $value }` don aitreabúid `{ $attribute }`. Caithfidh an aitreabúid a bheith comhdhéanta de thagairtí a thosaíonn le `$`.

math-input-invalid-function-names = <mathInput>: rinneadh neamhaird d'ainm(neacha) feidhme neamhbhailí i { $attribute }: { $names }. Caithfidh 2 charachtar ar a laghad (litreacha nó fleiscíní) a bheith i mír taispeána gach ainm; féadfaidh iarmhír roghnach `|<mathspeak alternative>` teacht ina dhiaidh.

## Building components from the source

component-type-invalid = Cineál comhpháirte neamhbhailí: `<{ $componentType }>`

attribute-repeated = Ní féidir an aitreabúid { $attribute } a athdhéanamh.

attribute-invalid-for-component = Aitreabúid neamhbhailí "{ $attribute }" do chomhpháirt den chineál `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Níl codarsnacht leordhóthanach ag sainmhíniú stíle { $styleNumber } do { $context ->
        [text-on-background] dhath an téacs in aghaidh dhath an chúlra
        [high-contrast] an dath ardchodarsnachta in aghaidh na canbháis
        [line] dhath na líne in aghaidh na canbháis
        [marker] dhath an mharcóra in aghaidh na canbháis
       *[text-on-canvas] dhath an téacs in aghaidh na canbháis
    }{ $mode ->
        [dark] { " (mód dorcha)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; teastaíonn { $threshold }:1 ar a laghad).

style-definition-dark-mode-text-background-contrast =
    Cé go bhfuil dathanna sonraithe ag sainmhíniú stíle { $styleNumber } a thugann codarsnacht leordhóthanach don mhód geal, níl codarsnacht leordhóthanach ag na dathanna mód dorcha a dhíorthaítear uathu idir dhath an téacs agus dath an chúlra ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; teastaíonn { $threshold }:1 ar a laghad). { $suggestion ->
        [available] Chun codarsnacht leordhóthanach a chinntiú sa mhód dorcha, méadaigh codarsnacht an mhóid ghil (m.sh. socraigh { $lightAttribute }="{ $lightColor }") nó sáraigh dath an mhóid dhorcha (m.sh. socraigh { $darkAttribute }="{ $darkColor }").
       *[none] Chun codarsnacht leordhóthanach a chinntiú sa mhód dorcha, méadaigh codarsnacht an mhóid ghil nó sáraigh na dathanna díorthaithe le textColorDarkMode agus/nó backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Cé go bhfuil dath téacs sonraithe ag sainmhíniú stíle { $styleNumber } a thugann codarsnacht leordhóthanach don mhód geal, níl codarsnacht leordhóthanach ag dath téacs an mhóid dhorcha a dhíorthaítear uaidh in aghaidh na canbháis ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; teastaíonn { $threshold }:1 ar a laghad). { $suggestion ->
        [available] Chun codarsnacht leordhóthanach a chinntiú sa mhód dorcha, méadaigh codarsnacht an mhóid ghil (m.sh. socraigh textColor="{ $lightColor }") nó sáraigh dath an mhóid dhorcha (m.sh. socraigh textColorDarkMode="{ $darkColor }").
       *[none] Chun codarsnacht leordhóthanach a chinntiú sa mhód dorcha, méadaigh codarsnacht an mhóid ghil nó sáraigh an dath díorthaithe le textColorDarkMode.
    }

section-multiple-style-palettes = Ní féidir le rannán ach <stylePalette> amháin a roghnú; ag úsáid an chinn dheireanaigh.

## Unique variants

variant-num-to-select-not-non-negative-integer = ní féidir leaganacha uathúla de { $component } a chinneadh toisc nach slánuimhir neamhdhiúltach é numToSelect.

variant-num-to-select-not-constant-number = ní féidir leaganacha uathúla de { $component } a chinneadh toisc nach uimhir thairiseach é numToSelect.

variant-with-replacement-not-constant-boolean = ní féidir leaganacha uathúla de { $component } a chinneadh toisc nach Boole tairiseach é withReplacement.

variant-select-weight-disables-unique = Díchumasaítear leaganacha uathúla do select má tá rogha ann a bhfuil selectWeight nó selectForVariants sonraithe uirthi

variant-coprime-undetermined = ní féidir leaganacha uathúla de { $component } a chinneadh toisc nach féidir a chinneadh go bhfuil coprime bréagach i gcónaí.

variant-attribute-not-constant = ní féidir leaganacha uathúla de { $component } a chinneadh toisc nach tairiseach é { $attribute }.

variant-attribute-not-number = ní féidir leaganacha uathúla de { $component } a chinneadh toisc nach uimhir é { $attribute }.

variant-attribute-wrong-type-for-sequence =
    ní féidir leaganacha uathúla de { $component } den chineál { $type } a chinneadh toisc nach { $expected ->
        [letters-combination] comhcheangal litreacha
        [math-expression] slonn matamaitice bailí
        [integer] slánuimhir
       *[number] uimhir
    } é { $attribute }.

variant-length-not-integer = ní féidir leaganacha uathúla de { $component } a chinneadh toisc nach slánuimhir é length.

variant-sort-not-implemented = níl leaganacha uathúla de { $component } le sort curtha i bhfeidhm

variant-exclude-combinations-not-implemented = níl leaganacha uathúla de { $component } le excludeCombinations curtha i bhfeidhm

variant-math-exclude-not-implemented = níl leaganacha uathúla de { $component } den chineál math le exclude curtha i bhfeidhm

variant-non-constant-exclude-not-implemented = níl leaganacha uathúla de { $component } le exclude neamhthairiseach curtha i bhfeidhm

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ní thacaítear leis i rindreálaí prefigure an ghraif; sleamhnaíodh thar an sliochtach.

prefigure-descendant-invalid-geometry = { $subject }: céimseata neamhchríochta nó neamhiomlán; sleamhnaíodh thar an sliochtach.

prefigure-curve-label-omitted = { $subject }: ní thacaítear le lipéid ar eilimintí cuair tiontaithe; fágadh an lipéad ar lár.

prefigure-curve-unsupported-definition-type = { $subject }: cineál sainmhínithe feidhme cuair nach dtacaítear leis '{ $definitionType }'; sleamhnaíodh thar an sliochtach.

prefigure-region-flip-functions-unsupported = { $subject }: ní thacaítear leis an aitreabúid flipFunctions ar regionBetweenCurves; sleamhnaíodh thar an sliochtach.

prefigure-region-non-formula-child = { $subject }: ní thacaítear ach le leanbhfheidhmeanna den chineál formula ar regionBetweenCurves; sleamhnaíodh thar an sliochtach.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' nach dtacaítear leis do { $labelKind ->
        [line-family] lipéad de chineál líne
       *[point] lipéad pointe
    }; úsáideadh ailíniú réamhshocraithe PreFigure.

prefigure-fill-style-unsupported = { $subject }: ní thacaíonn PreFigure leis an stíl líonta '{ $fillStyle }'; ag titim siar ar líonadh soladach.

prefigure-line-style-unknown = { $subject }: fágadh stíl líne anaithnid '{ $lineStyle }' ar lár as an aschur PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: mapáladh stíl an mharcóra '{ $markerStyle }' go stíl PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: ní thacaíonn PreFigure le stíl an mharcóra '{ $markerStyle }'; úsáideadh an stíl réamhshocraithe.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` neamhbhailí; ní féidir an sprioc a réiteach. Fágadh an anótáil ar lár.

annotation-ref-multiple-targets = `<annotation>`: réitigh `ref` go spriocanna iomadúla; ag úsáid na chéad sprice.

annotation-ref-outside-graph = `<annotation>`: `ref` neamhbhailí; tá an sprioc lasmuigh den ghraf máguaird. Fágadh an anótáil ar lár.

annotation-ref-unsupported-target = `<annotation>`: `ref` neamhbhailí; ní réad grafach é an sprioc a dtacaítear leis sa tiontú prefigure. Fágadh an anótáil ar lár.

annotation-text-missing = `<annotation>`: `text` ar iarraidh nó folamh; ag astú téacs folamh.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Braitheadh spleáchas ciorclach.
       *[other] Braitheadh spleáchas ciorclach a bhaineann le comhpháirt `<{ $componentType }>`.
    }

reference-no-referent = Níor aimsíodh aon tagra don tagairt: `{ $reference }`

reference-multiple-referents = Aimsíodh níos mó ná tagra amháin don tagairt: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Formáid neamhbhailí don aitreabúid { $attribute } de `<{ $componentType }>`.

children-invalid = Leanaí neamhbhailí do `<{ $componentType }>`: Aimsíodh leanaí neamhbhailí: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Luach neamhbhailí `{ $value }` don aitreabúid `{ $attribute }`, ag úsáid an luacha `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Níor aimsíodh leagan DoenetML { $version }.
       *[other] Níor aimsíodh leagan DoenetML { $version }. Ag titim siar ar leagan { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML neamhbhailí: { $content }

parse-tag-missing-close-tag = DoenetML neamhbhailí: Níl aon chlib dhúnta ag an gclib `{ $tag }`. Bhíothas ag súil le clib fhéindhúnta nó le clib `</{ $tagName }>`.

parse-tag-error = DoenetML neamhbhailí: Earráid sa chlib `<{ $tagName }>`

parse-attribute-missing-value = DoenetML neamhbhailí: Dealraíonn sé go bhfuil luach ar iarraidh ón aitreabúid neamhbhailí `{ $attribute }`.

parse-attribute-invalid = DoenetML neamhbhailí: Aitreabúid neamhbhailí `{ $attribute }`

parse-attribute-value-invalid = DoenetML neamhbhailí: Luach aitreabúide neamhbhailí `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML neamhbhailí: Luach aitreabúide neamhbhailí `{ $value }`. Ní réitíonn na comharthaí athfhriotail le chéile. Dealraíonn sé go bhfuil `{ $quote }` ar iarraidh ort

parse-open-tag-name-missing = DoenetML neamhbhailí: Aimsíodh clib gan ainm clibe, m.sh. `<`

parse-tag-not-closed = DoenetML neamhbhailí: Níor dúnadh an chlib `{ $tag }` (dealraíonn sé go bhfuil `>` ar iarraidh).

parse-self-closing-tag-name-missing = DoenetML neamhbhailí: Aimsíodh clib gan ainm clibe `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML neamhbhailí: Níor dúnadh an chlib `{ $tag }` (dealraíonn sé go bhfuil `/>` ar iarraidh).

parse-tag-invalid-attributes = DoenetML neamhbhailí: Níl an chlib `{ $tag }` bailí. B'fhéidir go bhfuil aitreabúidí míchearta uirthi.

parse-close-tag-name-missing = DoenetML neamhbhailí: Aimsíodh clib dhúnta gan ainm clibe, m.sh. `</`

parse-attribute-value-unquoted = Caithfear luachanna aitreabúide a chur idir comharthaí athfhriotail: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML neamhbhailí: Aimsíodh an chlib dhúnta `{ $tag }`, ach níl aon chlib oscailte comhfhreagrach ann

parse-close-tag-mismatched = DoenetML neamhbhailí: Clib dhúnta mhímheaitseáilte. Bhíothas ag súil le `</{ $expected }>`. Aimsíodh `{ $found }`

parser-node-unconvertible = Níorbh fhéidir an nód { $node } a thiontú ina nód Dast.

## Names

name-attribute-invalid =
    Ainm aitreabúide neamhbhailí name='{ $name }'. { $reason ->
        [characters] Ní féidir ach litreacha, uimhreacha, fostríoca nó fleiscíní a bheith in ainmneacha.
       *[start] Caithfidh ainmneacha tosú le litir.
    }

component-name-invalid-start = Ainm comhpháirte neamhbhailí "{ $name }". Caithfidh ainmneacha tosú le litir.

## `<answer>` sugar

answer-video-watched-missing-video = Caithfidh aitreabúid video a bheith ag freagra den chineál videoWatched

answer-video-watched-video-not-reference = Caithfidh an aitreabúid video ar fhreagra den chineál videoWatched a bheith ina tagairt

answer-name-not-single-text = Caithfidh leanbh téacs amháin a bheith ag aitreabúid name an fhreagra

## Referencing another document

external-doenetml-recursion-limit = Ní féidir DoenetML seachtrach a fháil de bharr an iomarca leibhéal athchúrsála. An bhfuil tagairt chiorclach ann?

external-doenetml-unavailable = Ní féidir DoenetML a fháil ó { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML neamhbhailí faighte ó { $attribute }="{ $uri }": níor mheaitseáil sé an cineál comhpháirte "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Tá an aitreabúid `{ $from }` dulta i léig; úsáid `{ $to }` ina hionad.
       *[other] [deprecation] Tá an aitreabúid `{ $from }` ar `<{ $component }>` dulta i léig; úsáid `{ $to }` ina hionad.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Tá an aitreabúid `{ $from }` dulta i léig agus déantar neamhaird di toisc go bhfuil `{ $to }` sonraithe freisin.
       *[other] [deprecation] Tá an aitreabúid `{ $from }` ar `<{ $component }>` dulta i léig agus déantar neamhaird di toisc go bhfuil `{ $to }` sonraithe freisin.
    }

deprecated-attribute-ignored = [deprecation] Tá an aitreabúid `{ $attribute }` ar `<{ $component }>` dulta i léig agus déantar neamhaird di.


## Language coverage

pluralize-english-only = Ní féidir le `<pluralize>` ach an Béarla a chur san iolra, mar sin fágtar a théacs gan athrú i gcáipéis atá scríofa i { $locale }. Scríobh an fhoirm iolra go díreach, nó socraigh í leis an aitreabúid `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Ní eilimint Doenet aitheanta í an eilimint `<{ $tag }>`.

schema-element-not-allowed-at-root = Ní cheadaítear an eilimint `<{ $tag }>` ag fréamh na cáipéise.

schema-element-not-allowed-inside = Ní cheadaítear an eilimint `<{ $tag }>` taobh istigh de `<{ $parent }>`.

schema-attribute-unrecognized = Níl aitreabúid darb ainm `{ $attribute }` ag an eilimint `<{ $tag }>`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Caithfidh an aitreabúid `{ $attribute }` den eilimint `<{ $tag }>` a bheith ina liosta a bhfuil gach mír de ina ceann de: { $allowed }
       *[other] Caithfidh an aitreabúid `{ $attribute }` den eilimint `<{ $tag }>` a bheith ina ceann de: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Ainm leagain neamhbhailí do select.  Tá an t-ainm leagain { $variantName } le fáil i { $numOptions } rogha ach is é { $numToSelect } an líon atá le roghnú.

select-variant-name-without-options = Tá leaganacha sonraithe do select ach níl aon rogha sonraithe don ainm leagain féideartha: { $variantName }.

select-variant-name-not-possible = Ní ainm leagain féideartha é an t-ainm leagain { $variantName } atá sonraithe do select.

select-too-few-options = Ní féidir { $numToSelect } comhpháirt a roghnú as { $numOptions } amháin.

select-from-sequence-too-few-values = Ní féidir { $numToSelect } luach a roghnú as seicheamh a bhfuil fad { $length } aige.

select-from-sequence-indices-count-mismatch = Caithfidh líon na n-innéacsanna atá sonraithe do select teacht le líon atá le roghnú

select-from-sequence-indices-not-integers = Caithfidh gach innéacs atá sonraithe do select a bheith ina shlánuimhir

select-from-sequence-index-excluded = Sonraíodh innéacs de selectfromsequence a fágadh as an áireamh

select-from-sequence-indices-excluded-combination = Sonraíodh innéacsanna de selectfromsequence a bhí ina gcomhcheangal fágtha as an áireamh

select-from-sequence-coprime-not-positive-integers = Ní féidir comhcheangail chomhphríomha a roghnú toisc nach slánuimhreacha deimhneacha atá á roghnú.

select-from-sequence-coprime-common-factor = Ní féidir uimhreacha comhphríomha a roghnú. Tá fachtóir coiteann ag gach luach féideartha. (Caithfidh na luachanna sonraithe de "from" nó "to" a bheith comhphríomha le "step".)

select-from-sequence-coprime-single-number = Ní féidir comhcheangail chomhphríomha a roghnú as uimhir aonair nach 1 í.

select-from-sequence-excluded-too-many-combinations = Fágadh níos mó ná 70% de na comhcheangail as an áireamh i selectFromSequence

select-from-sequence-coprime-none-found = Níorbh fhéidir uimhreacha comhphríomha a roghnú. Tá fachtóir coiteann ag gach luach féideartha.

select-from-sequence-too-few-unique-values = Ní féidir { $numToSelect } luach uathúil a roghnú as seicheamh a bhfuil fad { $numPossibleValues } aige

select-prime-numbers-too-few-values = Ní féidir { $numToSelect } luach a roghnú as liosta príomhuimhreacha a bhfuil fad { $numValues } aige

select-prime-numbers-values-count-mismatch = Caithfidh líon na luachanna atá sonraithe do select teacht le líon atá le roghnú

select-prime-numbers-values-not-prime = Caithfidh gach luach atá sonraithe do select prime number a bheith ar liosta na bpríomhuimhreacha

select-prime-numbers-values-excluded-combination = Bhí na luachanna sonraithe de selectPrimeNumbers ina gcomhcheangal fágtha as an áireamh

select-prime-numbers-excluded-too-many-combinations = Fágadh níos mó ná 70% de na comhcheangail as an áireamh i selectPrimeNumbers

select-random-combination-fluke = De bharr taisme thar a bheith neamhdhóchúil, níorbh fhéidir comhcheangal luachanna randamacha a roghnú

select-random-value-fluke = De bharr taisme thar a bheith neamhdhóchúil, níorbh fhéidir luach randamach a roghnú
