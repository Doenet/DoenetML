# Tsonga diagnostics: errors and warnings surfaced to the reader or author.
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
        [one] { $attributes } yi honisiwa loko tipoyinti timbirhi to hetelela ti bohiwile
       *[other] { $attributes } ti honisiwa loko tipoyinti timbirhi to hetelela ti bohiwile
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } yi honisiwa loko poyinti yo hetelela ni poyinti ya le xikarhi hinkwaswo swi bohiwile
       *[other] { $attributes } ti honisiwa loko poyinti yo hetelela ni poyinti ya le xikarhi hinkwaswo swi bohiwile
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset a yi na vuyelo handle ka poyinti ya le xikarhi

## `<line>`

line-points-undetermined-dimensions = Ntila lowu hundzaka etipoyintini ta mpimo lowu nga tiviwiki.

line-points-too-few-dimensions = Ntila wu fanele wu hundza etipoyintini ta mpimo wa timbirhi kwalomu.

line-points-depend-on-variables = Ntila wu hundza etipoyintini leti titshegeke hi swicincamahlo: { $variables }.

line-equation-invalid-format = Xivumbeko lexi hoxeke xa nkanelo wa ntila eka swicincamahlo { $variable1 } na { $variable2 }.

## `<ray>`

ray-overprescribed-through = Reyi yi bohiwe hi through, endpoint na direction.  Ku honisiwa through leyi bohiweke.

ray-dimension-mismatch = numDimensions a yi fambelani eka reyi.

## `<vector>`

vector-overprescribed-head = Vhekitha yi bohiwe hi head, tail na displacement.  Ku honisiwa head leyi bohiweke.

vector-dimension-mismatch = numDimensions a yi fambelani eka vhekitha.

## Attracting and constraining

attract-to-without-nearest-point = A swi koteki ku koka eka `<{ $component }>` hikuva a yi na xicincamahlo xa xiyimo xa nearestPoint.

constrain-to-without-nearest-point = A swi koteki ku pimela eka `<{ $component }>` hikuva a yi na xicincamahlo xa xiyimo xa nearestPoint.

constrain-to-interior-without-nearest-point = A swi koteki ku pimela endzeni ka `<{ $component }>` hikuva a yi na xicincamahlo xa xiyimo xa nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition yi honisiwa eka choiceInput leyi nga riki ya inline

## Ordering children by index

choice-input-indices-count-mismatch = Ku honisiwa tinomboro leti bohiweke eka choiceInput hikuva nhlayo ya tinomboro a yi fambelani ni nhlayo ya vana va ku hlawula.

pretzel-indices-count-mismatch = Ku honisiwa tinomboro leti bohiweke eka problem hikuva nhlayo ya tinomboro a yi fambelani ni nhlayo ya vana va problem.

shuffle-indices-count-mismatch = Ku honisiwa tinomboro leti bohiweke eka shuffle hikuva nhlayo ya tinomboro a yi fambelani ni nhlayo ya swiphemu.

indices-ignored-out-of-range = Ku honisiwa tinomboro leti bohiweke eka { $component } hikuva tin'wana ti le handle ka mpimo.

pretzel-indices-repeated = Ku honisiwa tinomboro leti bohiweke eka pretzel hikuva tin'wana ti phindhiwile.

pretzel-circuit-first-index = Ku honisiwa tinomboro leti bohiweke eka pretzel eka mode wa circuit hikuva nomboro yo sungula yi fanele yi va 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Leswaku `<{ $component }>` yi tirha ni vana va marito, xihlawulekisi xa `type` xi fanele xi bohiwa.

invalid-type-defaulting-to-math = Muxaka { $type } wu hoxekile eka xiphemu xa { $component }. Wu fanele wu va wun'wana wa math, text, number kumbe boolean. Ku vekiwa math hi xitolovelo.

string-not-valid-component-to-arrange = Rito "{ $value }" a hi xiphemu lexi pfumeleriwaka eka { $component }. Ku honisiwa.

## Types and variables

invalid-type-defaulting-to-number = Muxaka { $type } wu hoxekile, muxaka wu vekiwa eka number.

invalid-variable-value = Mpimo lowu hoxeke wa xicincamahlo: `{ $value }`

## Variants

variant-index-must-be-number = Nomboro ya muxaka { $index } yi fanele yi va nhlayo

variant-index-must-be-integer = Nomboro ya muxaka { $index } yi fanele yi va nhlayo leyi heleleke

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` a yi endleriwanga mimpimo leyi heleleke. Ku anama ku vekiwa eka loku fambelanaka.

side-by-side-absolute-margins = `<{ $component }>` a yi endleriwanga mimpimo leyi heleleke. Matlhelo ma vekiwa eka lama fambelanaka.

side-by-side-no-block-child = `<{ $component }>` leyi hoxeke: yi fanele yi va ni n'wana un'we wa buloko kwalomu.

## `<label>`

label-for-ignored-on-graphical = Xihlawulekisi xa `for` eka `<label>` ya xifaniso xi honisiwa.

label-for-must-resolve-to-one = Xihlawulekisi xa `for` eka `<label>` xi fanele xi kombetela eka xiphemu xin'we ntsena.

label-for-unresolved = Xihlawulekisi xa `for` eka `<label>` a xi kotanga ku kombetela eka xiphemu.

label-for-answer-with-authored-inputs = Xihlawulekisi xa `for` eka `<label>` xi kombetela eka `<answer>` leyi nga ni ku nghenisiwa loku tsariweke hi mutsari; kombetela eka ku nghenisiwa hi ku kongoma.

label-for-answer-without-input = Xihlawulekisi xa `for` eka `<label>` xi kombetela eka `<answer>` leyi nga riki na ku nghenisiwa loku nga vekiwaka vito.

label-for-must-reference-input-or-answer = Xihlawulekisi xa `for` eka `<label>` xi fanele xi kombetela eka ku nghenisiwa kumbe eka nhlamulo.

## Accessibility

accessibility-short-description-or-decorative = Leswaku ku fikeleleka, `<{ $component }>` yi fanele yi va ni nhlamuselo yo koma kumbe yi bohiwa tanihi decorative.

accessibility-video-short-description = Leswaku ku fikeleleka, `<video>` yi fanele yi va ni nhlamuselo yo koma.

accessibility-input-short-description-or-label = Leswaku ku fikeleleka, `<{ $component }>` yi fanele yi va ni nhlamuselo yo koma kumbe vito.

accessibility-answer-input-short-description-or-label = Leswaku ku fikeleleka, `<answer>` leyi tumbuluxaka ku nghenisiwa yi fanele yi va ni nhlamuselo yo koma kumbe vito.

accessibility-short-description-contains-math = Tinhlamuselo to koma a ti fanelanga ti va ni swiphemu swa tinhlayo tanihi `<{ $component }>`. Tsala tinhlayo hi marito.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } a yi na ku hambana loku ringaneleke ka matsalwa ya nhlokomhaka ya xiyenge (ndlela yo dzwihala) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ku laveka { $threshold }:1 kwalomu).
       *[other] { $colorName } a yi na ku hambana loku ringaneleke ka matsalwa ya nhlokomhaka ya xiyenge ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ku laveka { $threshold }:1 kwalomu).
    }

## `<circle>`

circle-through-points-non-numerical = A ku endliwanga `<circle>` leyi hundzaka etipoyintini ta { $count } laha tipoyinti ti nga riki na mimpimo ya tinhlayo.

circle-too-many-through-points = A swi koteki ku hlayela xirhendzevutana lexi hundzaka etipoyintini to tlula tinharhu.

circle-overprescribed-radius-center-points = A swi koteki ku hlayela xirhendzevutana hi radiyasi, xikarhi ni tipoyinti leti bohiweke.

circle-center-with-multiple-points = A swi koteki ku hlayela xirhendzevutana hi xikarhi lexi bohiweke lexi hundzaka epoyintini yo tlula yin'we.

circle-radius-too-small = A swi koteki ku hlayela xirhendzevutana: tanihi leswi mpfhuka exikarhi ka tipoyinti timbirhi wu nga { $distance }, radiyasi { $radius } leyi bohiweke yi tsongo swinene.

circle-radius-with-many-points = A swi koteki ku tumbuluxa xirhendzevutana lexi hundzaka etipoyintini to tlula timbirhi hi radiyasi leyi bohiweke.

circle-invalid-center-or-through-points = Xikarhi kumbe tipoyinti ta xirhendzevutana swi hoxekile.

circle-radius-center-with-multiple-points = A swi koteki ku hlayela radiyasi ya xirhendzevutana hi xikarhi lexi bohiweke lexi hundzaka epoyintini yo tlula yin'we.

circle-change-radius-non-numerical = A swi koteki ku cinca radiyasi ya xirhendzevutana lexi hundzaka etipoyintini leti nga riki na tinhlayo

circle-radius-with-points-non-numerical = A swi koteki ku tumbuluxa xirhendzevutana lexi hundzaka epoyintini yo tlula yin'we hi radiyasi leyi bohiweke loko ku nga ri na mimpimo ya tinhlayo.

circle-change-center-non-numerical = A ku endliwanga ku cinca xikarhi xa xirhendzevutana lexi hundzaka etipoyintini leti nga riki na tinhlayo.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Mimpimo a yi ringananga eka ndhawu ya ntirho. Ndhawu yi na xikhati xa { $intervals } kambe ntirho wu na { $inputs ->
            [one] ku nghenisiwa ka { $inputs }
           *[other] ku nghenisiwa ka { $inputs }
        }.
       *[other] Mimpimo a yi ringananga eka ndhawu ya ntirho. Ndhawu yi na swikhati swa { $intervals } kambe ntirho wu na { $inputs ->
            [one] ku nghenisiwa ka { $inputs }
           *[other] ku nghenisiwa ka { $inputs }
        }.
    }

function-domain-invalid-format = Xivumbeko lexi hoxeke xa ndhawu ya ntirho.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ku honisiwa mpimo lowukulu lowu nga riki wa tinhlayo wa ntirho.
        [minimum] Ku honisiwa mpimo lowutsongo lowu nga riki wa tinhlayo wa ntirho.
        [extremum] Ku honisiwa mpimo wo hetelela lowu nga riki wa tinhlayo wa ntirho.
        [point] Ku honisiwa poyinti leyi nga riki ya tinhlayo ya ntirho.
        [slope] Ku honisiwa ku rhembelela loku nga riki ka tinhlayo ka ntirho.
       *[other] Ku honisiwa { $type } leyi nga riki ya tinhlayo ya ntirho.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ku honisiwa mpimo lowukulu lowu nga riki na nchumu wa ntirho.
        [minimum] Ku honisiwa mpimo lowutsongo lowu nga riki na nchumu wa ntirho.
        [extremum] Ku honisiwa mpimo wo hetelela lowu nga riki na nchumu wa ntirho.
        [point] Ku honisiwa poyinti leyi nga riki na nchumu ya ntirho.
       *[other] Ku honisiwa { $type } leyi nga riki na nchumu ya ntirho.
    }

function-points-too-close = Ntirho wu na tipoyinti timbirhi leti nga ekusuhi swinene. A swi koteki ku hlamusela ntirho.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Ku phindhaphindha ka ntirho ku koteka ntsena loko nhlayo ya ku nghenisiwa yi ringana ni nhlayo ya ku humesiwa. Ntirho lowu wu na ku nghenisiwa ka { $inputs } na { $outputs ->
            [one] ku humesiwa ka { $outputs }
           *[other] ku humesiwa ka { $outputs }
        }.
       *[other] Ku phindhaphindha ka ntirho ku koteka ntsena loko nhlayo ya ku nghenisiwa yi ringana ni nhlayo ya ku humesiwa. Ntirho lowu wu na ku nghenisiwa ka { $inputs } na { $outputs ->
            [one] ku humesiwa ka { $outputs }
           *[other] ku humesiwa ka { $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Ku leha loku hoxeke ka landzelelano.  Ku fanele ku va nhlayo leyi heleleke leyi nga riki ehansi ka mpfumawulo.

sequence-invalid-step = Goza leri hoxeke ra landzelelano.  Ri fanele ri va nhlayo eka landzelelano ra muxaka wa { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" leyi hoxeke ya landzelelano ra tinhlayo.  Yi fanele yi va nhlayo.

sequence-invalid-endpoint-letters = "{ $attribute }" leyi hoxeke ya landzelelano ra maletere.  Yi fanele yi va nhlanganiso wa maletere.

sequence-invalid-endpoint = "{ $attribute }" leyi hoxeke ya landzelelano.

select-from-sequence-coprime-not-numbers = coprime yi honisiwile hikuva ku nga hlawuriwi tinhlayo

select-from-sequence-coprime-with-exclude-combinations = coprime yi honisiwile hikuva excludeCombinations yi bohiwile

## Resolving a `target`

target-not-found = Xikongomelo lexi hoxeke xa `<{ $source }>`: xikongomelo a xi kumeki.

target-state-variable-not-found = Xikongomelo lexi hoxeke xa `<{ $source }>`: a ku kumeki xicincamahlo xa xiyimo lexi vuriwaka "{ $property }" eka `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Swicincamahlo swa `<odeSystem>` swi fanele swi hambana ni xicincamahlo lexi tiyimelaka.

ode-system-duplicate-variable-names = A swi koteki ku hlamusela mintirho ya ODE RHS hi mavito ya swicincamahlo lama phindhiweke.

ode-system-rhs-function-error = A swi koteki ku hlamusela ntirho wa ODE RHS.  Xihoxo eka ku tumbuluxa ntirho wa mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = A swi koteki ku hlamusela engele exikarhi ka mintila ya { $count }

angle-invalid-through-point = Poyinti leyi hoxeke eka through ya `<angle>`

parabola-vertex-too-many-points = A ku endliwanga parabola ni nhlohlorhi leyi hundzaka epoyintini yo tlula yin'we.

parabola-too-many-points = A ku endliwanga parabola leyi hundzaka etipoyintini to tlula tinharhu.

intersection-too-many-items = A ku endliwanga ku hlangana ka swilo swo tlula swimbirhi

## Other math components

ionic-compound-not-two-ions = A ku endliwanga nhlanganiso wa ayoni handle ka wa tiayoni timbirhi.

ionic-compound-needs-cation-and-anion = Nhlanganiso wa ayoni wu endliwe ntsena wa cation yin'we ni anion yin'we.

solve-equations-cannot-evaluate = A swi koteki ku ntlhantlha nkanelo hikuva a swi kotekanga ku wu kambela: { $equation }

math-operators-operand-number-required = U fanele u boha operandNumber loko u humesa operand ya tinhlayo.

eigen-decomposition-failed = A swi kotekanga ku hlayela mimpimo ya eigen ya methiriksi

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: phuramitha { $parameters } a yi kona eka xivumbeko, hikwalaho yi ta tshama yi fambelana ni ndhawu leyi nga riki na nchumu.
       *[other] `<matchesPattern>`: tiphuramitha { $parameters } a ti kona eka xivumbeko, hikwalaho ti ta tshama ti fambelana ni ndhawu leyi nga riki na nchumu.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: a swi koteki ku twisisa grid="{ $grid }". Yi fanele yi va none, medium, dense, kumbe tinhlayo timbirhi to tlula mpfumawulo leti hambanisiweke hi xivandla, tanihi grid="1 0.5". A ku dirhiwanga girediva.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" a yi seketeriwi eka xikombisi xa prefigure; ku tirhisiwa ndlela ya right.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" a yi seketeriwi eka xikombisi xa prefigure; ku tirhisiwa ndlela ya top.

prefigure-invalid-axis-bounds = `<graph>`: mindzilakano ya akisi leyi hoxeke ya ku hundzuluxiwa ka prefigure; ku tirhisiwa bbox ya xitolovelo (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: ku anama loku hoxeke ka ku hundzuluxiwa ka prefigure; ku tirhisiwa ku anama ka xitolovelo ka 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio leyi hoxeke ya ku hundzuluxiwa ka prefigure; ku tirhisiwa xipimo xa xitolovelo xa 1.

prefigure-grid-spacing-too-fine = `<graph>`: xivandla xa girediva xi tsongo swinene eka mindzilakano ya tiakisi; girediva yi siyiwile eka xikombisi xa prefigure.

prefigure-annotations-not-rendered = `<graph>`: tinhlamuselo a ti nge kombisiwi loko ku nga tirhisiwi xikombisi xa PreFigure.

multiple-annotations-children = Ku kumeke vana vo tala va `<annotations>` eka `<graph>`; hinkwavo handle ka wo hetelela va honisiwile.

## Referring to other components

copy-unrecognized-component-type = A swi koteki ku engetela kumbe ku kopa muxaka wa xiphemu lowu nga tiviwiki: { $type }.

copy-prop-not-found = A ku kumeki xihlawulekisi { $property } eka xiphemu xa muxaka wa { $component }

collect-no-source = A ku kumekanga xihlovo xa collect.

collect-invalid-component-type = A swi koteki ku hlengeleta swiphemu swa muxaka wa `<{ $component }>` hikuva i muxaka wa xiphemu lowu hoxeke.

reference-index-unavailable = A swi koteki ku kombetela eka nomboro `{ $reference }`

## `<callAction>`

component-action-unavailable = A swi koteki ku vitana { $action } eka xiphemu `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Datha yi na xivumbeko lexi hoxeke.  Mintila yi na ku leha loku hambaneke. Yi kumeke eka componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Datha yi na mavito ya tikholomo lama phindhiweke.  Yi kumeke eka componentIdx :{ $componentIdx }

data-frame-missing-column-name = Datha a yi na vito ra kholomo.  Yi kumeke eka componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award ya nhlamulo leyi yi seketeriwe eka nhlamulo ya thegi ya answer hi yoxe, leswi swi ta tisa matikhomelo lama nga languteriwiki.

answer-max-num-attempts-in-section-wide-check-work = Ku veka `maxNumAttempts` eka `<answer>` leyi nga endzeni ka xikhomelo lexi nga ni `sectionWideCheckWork` a swi na vuyelo, hikuva nhlayo ya ku ringeta yi lawuriwa hi xikhomelo. Veka `maxNumAttempts` eka xikhomelo.

nested-section-wide-check-work-max-num-attempts = Ku veka `maxNumAttempts` eka xikhomelo lexi nga ni `sectionWideCheckWork` lexi nga endzeni ka xin'wana lexi nga ni `sectionWideCheckWork` a swi na vuyelo, hikuva nhlayo ya ku ringeta yi lawuriwa hi xikhomelo xa le handle. Veka `maxNumAttempts` eka xikhomelo xa le handle.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Xihlawulekisi xa { $attributes } a xi nge vi na vuyelo handle ka symbolicEquality.
       *[other] Swihlawulekisi swa { $attributes } a swi nge vi na vuyelo handle ka symbolicEquality.
    }

answer-invalid-type = Muxaka lowu hoxeke wa nhlamulo: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Tanihi leswi xiphemu `<{ $component }>` xi nga riki na vito, a xi nge tirhisiwi tanihi xihlawulekisi xa module

module-attribute-name-already-defined = Xiphemu `<{ $component } name="{ $name }">` a xi nge tirhisiwi tanihi xihlawulekisi xa module hikuva muxaka wa xiphemu wa `<module>` se wu na xihlawulekisi xa "{ $name }".

conditional-content-condition-ignored = Xihlawulekisi xa `condition` xi honisiwa eka xiphemu xa `<conditionalContent>` lexi nga ni vana va case kumbe va else.

slider-markers-type-mismatch = Muxaka wa swikombiso a wu fambelani ni muxaka wa slider.

pretzel-problem-needs-statement-and-answer = pretzel leyi hoxeke: `<problem>` yin'wana ni yin'wana yi fanele yi va ni `<statement>` yin'we ni `<answer>` yin'we.

pretzel-circuit-first-problem-distractor = pretzel leyi hoxeke: eka mode="circuit", `<problem>` yo sungula a yi nge vi xihungasi.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Mpimo lowu hoxeke { $values } wa xihlawulekisi `{ $attribute }`; ku honisiwa.
       *[other] Mimpimo leyi hoxeke { $values } ya xihlawulekisi `{ $attribute }`; ku honisiwa.
    }

attribute-must-be-references = Mpimo lowu hoxeke `{ $value }` wa xihlawulekisi `{ $attribute }`. Xihlawulekisi xi fanele xi vumbiwa hi tinkombo leti sungulaka hi `$`.

math-input-invalid-function-names = <mathInput>: ku honisiwile mavito ya mintirho lama hoxeke eka { $attribute }: { $names }. Xiphemu xa ku kombisa xa vito rin'wana ni rin'wana xi fanele xi va ni maletere mambirhi kwalomu (maletere kumbe swipimo); `|<mathspeak alternative>` yi nga landzela.

## Building components from the source

component-type-invalid = Muxaka lowu hoxeke wa xiphemu: `<{ $componentType }>`

attribute-repeated = A swi koteki ku phindha xihlawulekisi { $attribute }.

attribute-invalid-for-component = Xihlawulekisi lexi hoxeke "{ $attribute }" xa xiphemu xa muxaka wa `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Nhlamuselo ya xitayela { $styleNumber } a yi na ku hambana loku ringaneleke ka { $context ->
        [text-on-background] muhlovo wa matsalwa eka muhlovo wa xitshuriwa
        [high-contrast] muhlovo wa ku hambana lokukulu eka khenvasi
        [line] muhlovo wa ntila eka khenvasi
        [marker] muhlovo wa xikombiso eka khenvasi
       *[text-on-canvas] muhlovo wa matsalwa eka khenvasi
    }{ $mode ->
        [dark] { " (ndlela yo dzwihala)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ku laveka { $threshold }:1 kwalomu).

style-definition-dark-mode-text-background-contrast =
    Hambileswi nhlamuselo ya xitayela { $styleNumber } yi bohaka mihlovo leyi nga ni ku hambana loku ringaneleke ka ndlela yo vonakala, mihlovo ya ndlela yo dzwihala leyi humaka eka mimpimo leyi a yi na ku hambana loku ringaneleke ka muhlovo wa matsalwa eka muhlovo wa xitshuriwa ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ku laveka { $threshold }:1 kwalomu). { $suggestion ->
        [available] Leswaku ku va ni ku hambana loku ringaneleke eka ndlela yo dzwihala, engetela ku hambana ka ndlela yo vonakala (xik., veka { $lightAttribute }="{ $lightColor }") kumbe u cinca muhlovo wa ndlela yo dzwihala (xik., veka { $darkAttribute }="{ $darkColor }").
       *[none] Leswaku ku va ni ku hambana loku ringaneleke eka ndlela yo dzwihala, engetela ku hambana ka ndlela yo vonakala kumbe u cinca mihlovo leyi humaka hi textColorDarkMode na/kumbe backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Hambileswi nhlamuselo ya xitayela { $styleNumber } yi bohaka muhlovo wa matsalwa lowu nga ni ku hambana loku ringaneleke ka ndlela yo vonakala, muhlovo wa matsalwa wa ndlela yo dzwihala lowu humaka eka mpimo lowu a wu na ku hambana loku ringaneleke eka khenvasi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ku laveka { $threshold }:1 kwalomu). { $suggestion ->
        [available] Leswaku ku va ni ku hambana loku ringaneleke eka ndlela yo dzwihala, engetela ku hambana ka ndlela yo vonakala (xik., veka textColor="{ $lightColor }") kumbe u cinca muhlovo wa ndlela yo dzwihala (xik., veka textColorDarkMode="{ $darkColor }").
       *[none] Leswaku ku va ni ku hambana loku ringaneleke eka ndlela yo dzwihala, engetela ku hambana ka ndlela yo vonakala kumbe u cinca muhlovo lowu humaka hi textColorDarkMode.
    }

section-multiple-style-palettes = Xiyenge xi nga hlawula <stylePalette> yin'we ntsena; ku tirhisiwa yo hetelela.

## Unique variants

variant-num-to-select-not-non-negative-integer = a swi koteki ku vona mixaka yo hlawuleka ya { $component } hikuva numToSelect a hi nhlayo leyi heleleke leyi nga riki ehansi ka mpfumawulo.

variant-num-to-select-not-constant-number = a swi koteki ku vona mixaka yo hlawuleka ya { $component } hikuva numToSelect a hi nhlayo leyi nga cinciki.

variant-with-replacement-not-constant-boolean = a swi koteki ku vona mixaka yo hlawuleka ya { $component } hikuva withReplacement a hi boolean leyi nga cinciki.

variant-select-weight-disables-unique = Mixaka yo hlawuleka ya select yi pfariwa loko ku ri ni xihlawulo lexi nga ni selectWeight kumbe selectForVariants

variant-coprime-undetermined = a swi koteki ku vona mixaka yo hlawuleka ya { $component } hikuva a swi koteki ku vona leswaku coprime yi tshama yi ri mavunwa.

variant-attribute-not-constant = a swi koteki ku vona mixaka yo hlawuleka ya { $component } hikuva { $attribute } a yi tshami yi fana.

variant-attribute-not-number = a swi koteki ku vona mixaka yo hlawuleka ya { $component } hikuva { $attribute } a hi nhlayo.

variant-attribute-wrong-type-for-sequence =
    a swi koteki ku vona mixaka yo hlawuleka ya { $component } ya muxaka wa { $type } hikuva { $attribute } a hi { $expected ->
        [letters-combination] nhlanganiso wa maletere
        [math-expression] xivulwa xa tinhlayo lexi pfumeleriwaka
        [integer] nhlayo leyi heleleke
       *[number] nhlayo
    }.

variant-length-not-integer = a swi koteki ku vona mixaka yo hlawuleka ya { $component } hikuva length a hi nhlayo leyi heleleke.

variant-sort-not-implemented = a ku endliwanga mixaka yo hlawuleka ya { $component } leyi nga ni sort

variant-exclude-combinations-not-implemented = a ku endliwanga mixaka yo hlawuleka ya { $component } leyi nga ni excludeCombinations

variant-math-exclude-not-implemented = a ku endliwanga mixaka yo hlawuleka ya { $component } ya muxaka wa math leyi nga ni exclude

variant-non-constant-exclude-not-implemented = a ku endliwanga mixaka yo hlawuleka ya { $component } leyi nga ni exclude leyi cincaka

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: a yi seketeriwi eka xikombisi xa graph prefigure; xitukulwana xi siyiwile.

prefigure-descendant-invalid-geometry = { $subject }: jiyometri leyi nga heriki kumbe leyi nga heleliki; xitukulwana xi siyiwile.

prefigure-curve-label-omitted = { $subject }: mavito a ma seketeriwi eka swiphemu swa ntila wo goba leswi hundzuluxiweke; vito ri siyiwile.

prefigure-curve-unsupported-definition-type = { $subject }: muxaka wa nhlamuselo ya ntirho wa ntila wo goba '{ $definitionType }' a wu seketeriwi; xitukulwana xi siyiwile.

prefigure-region-flip-functions-unsupported = { $subject }: xihlawulekisi xa flipFunctions eka regionBetweenCurves a xi seketeriwi; xitukulwana xi siyiwile.

prefigure-region-non-formula-child = { $subject }: ku seketeriwa ntsena mintirho ya vana ya muxaka wa formula eka regionBetweenCurves; xitukulwana xi siyiwile.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' a yi seketeriwi eka { $labelKind ->
        [line-family] vito ra ndyangu wa mintila
       *[point] vito ra poyinti
    }; ku tirhisiwa ku ringanisa ka xitolovelo ka PreFigure.

prefigure-fill-style-unsupported = { $subject }: xitayela xa ku tata '{ $fillStyle }' a xi seketeriwi hi PreFigure; ku tlheleriwa eka ku tata loku tiyeke.

prefigure-line-style-unknown = { $subject }: xitayela xa ntila lexi nga tiviwiki '{ $lineStyle }' xi siyiwile eka ku huma ka PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: xitayela xa xikombiso '{ $markerStyle }' xi hundzuluxeriwe eka xitayela xa PreFigure xa 'diamond'.

prefigure-marker-style-unsupported = { $subject }: xitayela xa xikombiso '{ $markerStyle }' a xi seketeriwi hi PreFigure; ku tirhisiwa xitayela xa xitolovelo.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` leyi hoxeke; a swi koteki ku kuma xikongomelo. Nhlamuselo yi siyiwile.

annotation-ref-multiple-targets = `<annotation>`: `ref` yi kombetele eka swikongomelo swo tala; ku tirhisiwa xikongomelo xo sungula.

annotation-ref-outside-graph = `<annotation>`: `ref` leyi hoxeke; xikongomelo xi le handle ka graph leyi xi khomeke. Nhlamuselo yi siyiwile.

annotation-ref-unsupported-target = `<annotation>`: `ref` leyi hoxeke; xikongomelo a hi nchumu wa xifaniso lowu seketeriwaka eka ku hundzuluxiwa ka prefigure. Nhlamuselo yi siyiwile.

annotation-text-missing = `<annotation>`: `text` a yi kona kumbe a yi na nchumu; ku humesiwa matsalwa lama nga riki na nchumu.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Ku kumeke ku titshega loku rhendzeleke.
       *[other] Ku kumeke ku titshega loku rhendzeleke loku katsaka xiphemu xa `<{ $componentType }>`.
    }

reference-no-referent = A ku kumekanga nchumu eka nkombo: `{ $reference }`

reference-multiple-referents = Ku kumeke swilo swo tala eka nkombo: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Xivumbeko lexi hoxeke xa xihlawulekisi { $attribute } xa `<{ $componentType }>`.

children-invalid = Vana lava hoxeke va `<{ $componentType }>`: Ku kumeke vana lava hoxeke: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Mpimo lowu hoxeke `{ $value }` wa xihlawulekisi `{ $attribute }`, ku tirhisiwa mpimo `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Vuxaka bya DoenetML { $version } a byi kumeki.
       *[other] Vuxaka bya DoenetML { $version } a byi kumeki. Ku tlheleriwa eka vuxaka { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML leyi hoxeke: { $content }

parse-tag-missing-close-tag = DoenetML leyi hoxeke: Thegi `{ $tag }` a yi na thegi yo pfala. A ku languteriwa thegi leyi tipfalaka kumbe thegi ya `</{ $tagName }>`.

parse-tag-error = DoenetML leyi hoxeke: Xihoxo eka thegi `<{ $tagName }>`

parse-attribute-missing-value = DoenetML leyi hoxeke: Xihlawulekisi lexi hoxeke `{ $attribute }` xi vonaka xi nga ri na mpimo.

parse-attribute-invalid = DoenetML leyi hoxeke: Xihlawulekisi lexi hoxeke `{ $attribute }`

parse-attribute-value-invalid = DoenetML leyi hoxeke: Mpimo wa xihlawulekisi lowu hoxeke `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML leyi hoxeke: Mpimo wa xihlawulekisi lowu hoxeke `{ $value }`. Swikombiso swa ku tshaha a swi fambelani. Swi vonaka ku pfumaleka `{ $quote }`

parse-open-tag-name-missing = DoenetML leyi hoxeke: Ku kumeke thegi leyi nga riki na vito, xik. `<`

parse-tag-not-closed = DoenetML leyi hoxeke: Thegi `{ $tag }` a yi pfalanga (swi vonaka `>` yi pfumaleka).

parse-self-closing-tag-name-missing = DoenetML leyi hoxeke: Ku kumeke thegi leyi nga riki na vito `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML leyi hoxeke: Thegi `{ $tag }` a yi pfalanga (swi vonaka `/>` yi pfumaleka).

parse-tag-invalid-attributes = DoenetML leyi hoxeke: Thegi `{ $tag }` a yi pfumeleriwi. Yi nga va ni swihlawulekisi leswi hoxeke.

parse-close-tag-name-missing = DoenetML leyi hoxeke: Ku kumeke thegi yo pfala leyi nga riki na vito, xik. `</`

parse-attribute-value-unquoted = Mimpimo ya swihlawulekisi yi fanele yi va endzeni ka swikombiso swa ku tshaha: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML leyi hoxeke: Ku kumeke thegi yo pfala `{ $tag }`, kambe a ku na thegi yo pfula leyi fambelanaka

parse-close-tag-mismatched = DoenetML leyi hoxeke: Thegi yo pfala a yi fambelani. A ku languteriwa `</{ $expected }>`. Ku kumeke `{ $found }`

parser-node-unconvertible = A swi kotekanga ku hundzuluxa nodi { $node } yi va nodi ya Dast.

## Names

name-attribute-invalid =
    Vito ra xihlawulekisi ri hoxekile name='{ $name }'. { $reason ->
        [characters] Mavito ma nga va ni maletere, tinhlayo, swikombiso swo hlanganisa kumbe swipimo ntsena.
       *[start] Mavito ma fanele ma sungula hi letere.
    }

component-name-invalid-start = Vito ra xiphemu ri hoxekile "{ $name }". Mavito ma fanele ma sungula hi letere.

## `<answer>` sugar

answer-video-watched-missing-video = Nhlamulo ya muxaka wa videoWatched yi fanele yi va ni xihlawulekisi xa video

answer-video-watched-video-not-reference = Nhlamulo ya muxaka wa videoWatched yi fanele yi va ni xihlawulekisi xa video lexi nga nkombo

answer-name-not-single-text = Xihlawulekisi xa name xa nhlamulo xi fanele xi va ni n'wana un'we wa matsalwa

## Referencing another document

external-doenetml-recursion-limit = A swi kotekanga ku kuma DoenetML ya le handle hikwalaho ka mimpimo yo tala swinene ya ku phindhaphindha. Xana ku na nkombo lowu rhendzelekaka?

external-doenetml-unavailable = A swi kotekanga ku kuma DoenetML eka { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML leyi kumekeke eka { $attribute }="{ $uri }" yi hoxekile: a yi fambelananga ni muxaka wa xiphemu wa "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Xihlawulekisi `{ $from }` a xa ha tirhisiwi; tirhisa `{ $to }` ematshan'weni ya xona.
       *[other] [deprecation] Xihlawulekisi `{ $from }` eka `<{ $component }>` a xa ha tirhisiwi; tirhisa `{ $to }` ematshan'weni ya xona.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Xihlawulekisi `{ $from }` a xa ha tirhisiwi naswona xi honisiwa hikuva na `{ $to }` xi bohiwile.
       *[other] [deprecation] Xihlawulekisi `{ $from }` eka `<{ $component }>` a xa ha tirhisiwi naswona xi honisiwa hikuva na `{ $to }` xi bohiwile.
    }

deprecated-attribute-ignored = [deprecation] Xihlawulekisi `{ $attribute }` eka `<{ $component }>` a xa ha tirhisiwi naswona xi honisiwa.

deprecated-attribute-to-child = [deprecation] Xihlawulekisi `{ $attribute }` eka `<{ $component }>` a xa ha tirhisiwi; tirhisa n'wana wa `<{ $child }>` ematshan'weni ya xona.

deprecated-attribute-value-renamed = [deprecation] Mpimo `{ $value }` wa xihlawulekisi `{ $attribute }` eka `<{ $component }>` a wa ha tirhisiwi; tirhisa `{ $to }` ematshan'weni ya wona.


## Language coverage

pluralize-english-only = `<pluralize>` yi nga endla vunyingi bya Xinghezi ntsena, hikwalaho matsalwa ya yona ma siyiwa ma nga cinciwanga eka tsalwa leri tsariweke hi { $locale }. Tsala xivumbeko xa vunyingi hi ku kongoma, kumbe u xi veka hi xihlawulekisi xa `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Xiphemu `<{ $tag }>` a hi xiphemu xa Doenet lexi tiviwaka.

schema-element-not-allowed-at-root = Xiphemu `<{ $tag }>` a xi pfumeleriwi eka rimitsu ra tsalwa.

schema-element-not-allowed-inside = Xiphemu `<{ $tag }>` a xi pfumeleriwi endzeni ka `<{ $parent }>`.

schema-attribute-unrecognized = Xiphemu `<{ $tag }>` a xi na xihlawulekisi lexi vuriwaka `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Xihlawulekisi `{ $attribute }` xa xiphemu `<{ $tag }>` xi fanele xi va nxaxamelo lowu swilo swa wona swi nga xin'wana xa: { $allowed }
       *[other] Xihlawulekisi `{ $attribute }` xa xiphemu `<{ $tag }>` xi fanele xi va xin'wana xa: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Vito ra muxaka ri hoxekile eka select.  Vito ra muxaka { $variantName } ri humelela eka swihlawulo swa { $numOptions } kambe nhlayo yo hlawula i { $numToSelect }.

select-variant-name-without-options = Mixaka yin'wana yi bohiwile eka select kambe a ku na swihlawulo leswi bohiweke swa vito ra muxaka leri nga kotekaka: { $variantName }.

select-variant-name-not-possible = Vito ra muxaka { $variantName } leri bohiweke eka select a hi vito ra muxaka leri kotekaka.

select-too-few-options = A swi koteki ku hlawula swiphemu swa { $numToSelect } eka swa { $numOptions } ntsena.

select-from-sequence-too-few-values = A swi koteki ku hlawula mimpimo ya { $numToSelect } eka landzelelano ra ku leha ka { $length }.

select-from-sequence-indices-count-mismatch = Nhlayo ya tinomboro leti bohiweke eka select yi fanele yi fambelana ni nhlayo yo hlawula

select-from-sequence-indices-not-integers = Tinomboro hinkwato leti bohiweke eka select ti fanele ti va tinhlayo leti heleleke

select-from-sequence-index-excluded = Nomboro leyi bohiweke ya selectfromsequence a yi susiwile

select-from-sequence-indices-excluded-combination = Tinomboro leti bohiweke ta selectfromsequence a ti ri nhlanganiso lowu susiweke

select-from-sequence-coprime-not-positive-integers = A swi koteki ku hlawula minhlanganiso ya coprime hikuva ku nga hlawuriwi tinhlayo leti heleleke leti tlulaka mpfumawulo.

select-from-sequence-coprime-common-factor = A swi koteki ku hlawula tinhlayo ta coprime. Mimpimo hinkwayo leyi kotekaka yi na xihlawulekisi lexi fanaka. (Mimpimo leyi bohiweke ya "from" kumbe "to" yi fanele yi va coprime na "step".)

select-from-sequence-coprime-single-number = A swi koteki ku hlawula minhlanganiso ya coprime eka nhlayo yin'we leyi nga riki 1.

select-from-sequence-excluded-too-many-combinations = Ku susiwile ku tlula 70% ya minhlanganiso eka selectFromSequence

select-from-sequence-coprime-none-found = A swi kotekanga ku hlawula tinhlayo ta coprime. Mimpimo hinkwayo leyi kotekaka yi na xihlawulekisi lexi fanaka.

select-from-sequence-too-few-unique-values = A swi koteki ku hlawula mimpimo yo hlawuleka ya { $numToSelect } eka landzelelano ra ku leha ka { $numPossibleValues }

select-prime-numbers-too-few-values = A swi koteki ku hlawula mimpimo ya { $numToSelect } eka nxaxamelo wa tinhlayo ta prime wa ku leha ka { $numValues }

select-prime-numbers-values-count-mismatch = Nhlayo ya mimpimo leyi bohiweke eka select yi fanele yi fambelana ni nhlayo yo hlawula

select-prime-numbers-values-not-prime = Mimpimo hinkwayo leyi bohiweke eka select prime number yi fanele yi va eka nxaxamelo wa tinhlayo ta prime

select-prime-numbers-values-excluded-combination = Mimpimo leyi bohiweke ya selectPrimeNumbers a yi ri nhlanganiso lowu susiweke

select-prime-numbers-excluded-too-many-combinations = Ku susiwile ku tlula 70% ya minhlanganiso eka selectPrimeNumbers

select-random-combination-fluke = Hi mahlori lama nga languteriwiki, a swi kotekanga ku hlawula nhlanganiso wa mimpimo yo hlawuleka handle ka mpimo

select-random-value-fluke = Hi mahlori lama nga languteriwiki, a swi kotekanga ku hlawula mpimo wo hlawuleka handle ka mpimo
