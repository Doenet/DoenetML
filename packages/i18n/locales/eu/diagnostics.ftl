# Basque diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Basque counts in the same two categories English does, so every selection
# below keeps both branches.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } ez da kontuan hartzen bi mutur zehazten direnean
       *[other] { $attributes } ez dira kontuan hartzen bi mutur zehazten direnean
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } ez da kontuan hartzen mutur bat eta erdiko puntu bat zehazten direnean
       *[other] { $attributes } ez dira kontuan hartzen mutur bat eta erdiko puntu bat zehazten direnean
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset-ek ez du eraginik erdiko punturik gabe

## `<line>`

line-points-undetermined-dimensions = Dimentsio zehaztugabeko puntuetatik igarotzen den marra.

line-points-too-few-dimensions = Marrak gutxienez bi dimentsioko puntuetatik igaro behar du.

line-points-depend-on-variables = Marra aldagaien menpe dauden puntuetatik igarotzen da: { $variables }.

line-equation-invalid-format = Formatu baliogabea { $variable1 } eta { $variable2 } aldagaietako marraren ekuaziorako.

## `<ray>`

ray-overprescribed-through = Izpia through, endpoint eta direction bidez zehaztuta dago.  Zehaztutako through ez da kontuan hartzen.

ray-dimension-mismatch = numDimensions ez dator bat izpian.

## `<vector>`

vector-overprescribed-head = Bektorea head, tail eta displacement bidez zehaztuta dago.  Zehaztutako head ez da kontuan hartzen.

vector-dimension-mismatch = numDimensions ez dator bat bektorean.

## Attracting and constraining

attract-to-without-nearest-point = Ezin da `<{ $component }>` elementura erakarri, ez baitu nearestPoint egoera-aldagaia.

constrain-to-without-nearest-point = Ezin da `<{ $component }>` elementura murriztu, ez baitu nearestPoint egoera-aldagaia.

constrain-to-interior-without-nearest-point = Ezin da `<{ $component }>` elementuaren barrualdera murriztu, ez baitu nearestPoint egoera-aldagaia.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ez da kontuan hartzen inline ez den choiceInput baterako

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput-erako zehaztutako indizeak ez dira kontuan hartzen, kopurua ez baitator bat choice seme-alaben kopuruarekin.

pretzel-indices-count-mismatch = problem-erako zehaztutako indizeak ez dira kontuan hartzen, kopurua ez baitator bat problem seme-alaben kopuruarekin.

shuffle-indices-count-mismatch = shuffle-erako zehaztutako indizeak ez dira kontuan hartzen, kopurua ez baitator bat osagaien kopuruarekin.

indices-ignored-out-of-range = { $component } elementurako zehaztutako indizeak ez dira kontuan hartzen, batzuk barrutitik kanpo baitaude.

pretzel-indices-repeated = pretzel-erako zehaztutako indizeak ez dira kontuan hartzen, batzuk errepikatuta baitaude.

pretzel-circuit-first-index = circuit moduko pretzel-erako zehaztutako indizeak ez dira kontuan hartzen, lehen indizeak 1 izan behar baitu.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` kate-seme-alabekin ibiltzeko, `type` atributua zehaztu behar da.

invalid-type-defaulting-to-math = { $type } mota baliogabea { $component } osagairako. math, text, number edo boolean izan behar du. math erabiliko da.

string-not-valid-component-to-arrange = "{ $value }" katea ez da { $component } egiteko osagai baliozkoa. Ez da kontuan hartzen.

## Types and variables

invalid-type-defaulting-to-number = { $type } mota baliogabea, mota number gisa ezartzen da.

invalid-variable-value = Aldagai baten balio baliogabea: `{ $value }`

## Variants

variant-index-must-be-number = { $index } aldaera-indizeak zenbaki bat izan behar du

variant-index-must-be-integer = { $index } aldaera-indizeak zenbaki oso bat izan behar du

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ez dago inplementatuta neurri absolutuetarako. Zabalerak erlatibo gisa ezartzen dira.

side-by-side-absolute-margins = `<{ $component }>` ez dago inplementatuta neurri absolutuetarako. Marjinak erlatibo gisa ezartzen dira.

side-by-side-no-block-child = `<{ $component }>` baliogabea: gutxienez bloke-seme bat izan behar du.

## `<label>`

label-for-ignored-on-graphical = `<label>` grafiko bateko `for` atributua ez da kontuan hartzen.

label-for-must-resolve-to-one = `<label>` elementuko `for` atributuak osagai bakar batera ebatzi behar du.

label-for-unresolved = Ezin izan da `<label>` elementuko `for` atributua osagai batera ebatzi.

label-for-answer-with-authored-inputs = `<label>` elementuko `for` atributuak berariaz idatzitako sarrerak dituen `<answer>` bati egiten dio erreferentzia; egin erreferentzia sarrerari zuzenean.

label-for-answer-without-input = `<label>` elementuko `for` atributuak etiketatzeko sarrerarik ez duen `<answer>` bati egiten dio erreferentzia.

label-for-must-reference-input-or-answer = `<label>` elementuko `for` atributuak sarrera bati edo erantzun bati egin behar dio erreferentzia.

## Accessibility

accessibility-short-description-or-decorative = Irisgarritasunerako, `<{ $component }>` elementuak deskribapen labur bat izan behar du edo apaingarri gisa zehaztuta egon behar du.

accessibility-video-short-description = Irisgarritasunerako, `<video>` elementuak deskribapen labur bat izan behar du.

accessibility-input-short-description-or-label = Irisgarritasunerako, `<{ $component }>` elementuak deskribapen labur bat edo etiketa bat izan behar du.

accessibility-answer-input-short-description-or-label = Irisgarritasunerako, sarrera bat sortzen duen `<answer>` batek deskribapen labur bat edo etiketa bat izan behar du.

accessibility-short-description-contains-math = Deskribapen laburrek ez lukete `<{ $component }>` bezalako osagai matematikorik izan behar. Idatzi matematika hitzez.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ez du nahikoa kontraste atalaren goiburuko testurako (modu iluna) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; gutxienez { $threshold }:1 behar da).
       *[other] { $colorName } ez du nahikoa kontraste atalaren goiburuko testurako ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; gutxienez { $threshold }:1 behar da).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` { $count } puntutatik ez dago inplementatuta puntuek balio zenbakizkorik ez dutenean.

circle-too-many-through-points = Ezin da 3 puntu baino gehiagotatik igarotzen den zirkulua kalkulatu.

circle-overprescribed-radius-center-points = Ezin da zirkulua kalkulatu erradioa, zentroa eta puntuak zehaztuta daudenean.

circle-center-with-multiple-points = Ezin da zentro zehaztu batekin puntu bat baino gehiagotatik igarotzen den zirkulua kalkulatu.

circle-radius-too-small = Ezin da zirkulua kalkulatu: bi puntuen arteko distantzia { $distance } denez, zehaztutako { $radius } erradioa txikiegia da.

circle-radius-with-many-points = Ezin da bi puntu baino gehiagotatik igarotzen den zirkulua sortu erradio zehatz batekin.

circle-invalid-center-or-through-points = Zirkuluaren zentro edo puntu baliogabeak.

circle-radius-center-with-multiple-points = Ezin da zentro zehaztu batekin puntu bat baino gehiagotatik igarotzen den zirkuluaren erradioa kalkulatu.

circle-change-radius-non-numerical = Ezin da zirkuluaren erradioa aldatu puntuek balio zenbakizkorik ez dutenean

circle-radius-with-points-non-numerical = Ezin da puntu bat baino gehiagotatik igarotzen den zirkulua erradio zehatz batekin sortu balio zenbakizkorik ez dagoenean.

circle-change-center-non-numerical = Ez dago inplementatuta balio zenbakizkorik gabeko puntuetatik igarotzen den zirkuluaren zentroa aldatzea.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Dimentsio gutxiegi funtzioaren domeinurako. Domeinuak { $intervals } tarte du baina funtzioak { $inputs ->
            [one] sarrera { $inputs }
           *[other] { $inputs } sarrera
        } ditu.
       *[other] Dimentsio gutxiegi funtzioaren domeinurako. Domeinuak { $intervals } tarte ditu baina funtzioak { $inputs ->
            [one] sarrera { $inputs }
           *[other] { $inputs } sarrera
        } ditu.
    }

function-domain-invalid-format = Formatu baliogabea funtzioaren domeinurako.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Funtzioaren maximo ez-zenbakizkoa ez da kontuan hartzen.
        [minimum] Funtzioaren minimo ez-zenbakizkoa ez da kontuan hartzen.
        [extremum] Funtzioaren muturreko ez-zenbakizkoa ez da kontuan hartzen.
        [point] Funtzioaren puntu ez-zenbakizkoa ez da kontuan hartzen.
        [slope] Funtzioaren malda ez-zenbakizkoa ez da kontuan hartzen.
       *[other] Funtzioaren { $type } ez-zenbakizkoa ez da kontuan hartzen.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Funtzioaren maximo hutsa ez da kontuan hartzen.
        [minimum] Funtzioaren minimo hutsa ez da kontuan hartzen.
        [extremum] Funtzioaren muturreko hutsa ez da kontuan hartzen.
        [point] Funtzioaren puntu hutsa ez da kontuan hartzen.
       *[other] Funtzioaren { $type } hutsa ez da kontuan hartzen.
    }

function-points-too-close = Funtzioak elkarrengandik hurbilegi dauden bi puntu ditu. Ezin da funtzioa definitu.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Funtzio baten iterazioak sarrera-kopurua eta irteera-kopurua berdinak direnean bakarrik dira posible. Funtzio honek sarrera { $inputs } eta { $outputs ->
            [one] irteera { $outputs }
           *[other] { $outputs } irteera
        } ditu.
       *[other] Funtzio baten iterazioak sarrera-kopurua eta irteera-kopurua berdinak direnean bakarrik dira posible. Funtzio honek { $inputs } sarrera eta { $outputs ->
            [one] irteera { $outputs }
           *[other] { $outputs } irteera
        } ditu.
    }

## `<sequence>`

sequence-invalid-length = Segidaren luzera baliogabea.  Zenbaki oso ez-negatibo bat izan behar du.

sequence-invalid-step = Segidaren urratsa baliogabea.  Zenbaki bat izan behar du { $type } motako segida baterako.

sequence-invalid-endpoint-number = Zenbaki-segidaren "{ $attribute }" baliogabea.  Zenbaki bat izan behar du.

sequence-invalid-endpoint-letters = Letra-segidaren "{ $attribute }" baliogabea.  Letra-konbinazio bat izan behar du.

sequence-invalid-endpoint = Segidaren "{ $attribute }" baliogabea.

select-from-sequence-coprime-not-numbers = coprime ez da kontuan hartzen, ez baitira zenbakiak hautatzen

select-from-sequence-coprime-with-exclude-combinations = coprime ez da kontuan hartzen, excludeCombinations zehaztuta baitago

## Resolving a `target`

target-not-found = `<{ $source }>` elementuaren target baliogabea: ezin da helburua aurkitu.

target-state-variable-not-found = `<{ $source }>` elementuaren target baliogabea: ezin da "{ $property }" izeneko egoera-aldagairik aurkitu `<{ $component }>` batean.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` elementuaren aldagaiek aldagai askearekiko desberdinak izan behar dute.

ode-system-duplicate-variable-names = Ezin dira ODE RHS funtzioak definitu mendeko aldagaien izen bikoiztuekin.

ode-system-rhs-function-error = Ezin da ODE RHS funtzioa definitu.  Errorea mathjs funtzioa sortzean.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ezin da { $count } marraren arteko angelurik definitu

angle-invalid-through-point = Puntu baliogabea `<angle>` elementuaren through atributuan

parabola-vertex-too-many-points = Ez dago inplementatuta erpina duen parabola puntu bat baino gehiagotatik.

parabola-too-many-points = Ez dago inplementatuta parabola 3 puntu baino gehiagotatik.

intersection-too-many-items = Ez dago inplementatuta bi elementu baino gehiagoren ebakidura

## Other math components

ionic-compound-not-two-ions = Konposatu ionikoa bi ioirentzat bakarrik dago inplementatuta.

ionic-compound-needs-cation-and-anion = Konposatu ionikoa katioi batentzat eta anioi batentzat bakarrik dago inplementatuta.

solve-equations-cannot-evaluate = Ezin da ekuazioa ebatzi, ezin izan baita ebaluatu: { $equation }

math-operators-operand-number-required = operandNumber zehaztu behar da eragigai matematiko bat ateratzean.

eigen-decomposition-failed = Ezin izan dira matrizearen autobalioak kalkulatu

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } parametroa ez dago ereduan, beraz beti hutsune batekin bat etorriko da.
       *[other] `<matchesPattern>`: { $parameters } parametroak ez daude ereduan, beraz beti hutsune batekin bat etorriko dira.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ezin da grid="{ $grid }" interpretatu. none, medium, dense edo zuriune batez bereizitako bi zenbaki positibo izan behar du, adibidez grid="1 0.5". Ez da saretarik marrazten.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ez da onartzen prefigure errendatzailean; eskuineko kokapenaren portaera erabiltzen da.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ez da onartzen prefigure errendatzailean; goiko kokapenaren portaera erabiltzen da.

prefigure-invalid-axis-bounds = `<graph>`: ardatz-muga baliogabeak prefigure bihurketarako; bbox lehenetsia erabiltzen da (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: zabalera baliogabea prefigure bihurketarako; 425 diagrama-zabalera lehenetsia erabiltzen da.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio baliogabea prefigure bihurketarako; 1 proportzio lehenetsia erabiltzen da.

prefigure-grid-spacing-too-fine = `<graph>`: saretaren tartea finegia da ardatzaren mugetarako; sareta baztertzen da prefigure errendatzailean.

prefigure-annotations-not-rendered = `<graph>`: oharrak ez dira errendatzen PreFigure errendatzailea erabiltzen ez bada.

multiple-annotations-children = `<annotations>` seme bat baino gehiago aurkitu dira `<graph>` batean; azkena izan ezik guztiak baztertzen dira.

## Referring to other components

copy-unrecognized-component-type = Ezin da osagai-mota ezezaguna hedatu edo kopiatu: { $type }.

copy-prop-not-found = Ezin izan da { $property } propietatea aurkitu { $component } motako osagai batean

collect-no-source = Ez da iturririk aurkitu collect-erako.

collect-invalid-component-type = Ezin dira `<{ $component }>` motako osagaiak bildu, osagai-mota baliogabea baita.

reference-index-unavailable = Ezin da `{ $reference }` indizeari erreferentzia egin

## `<callAction>`

component-action-unavailable = Ezin da { $action } deitu `{ $reference }` osagaian

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Datuek forma baliogabea dute.  Errenkadek luzera desberdinak dituzte. componentIdx :{ $componentIdx } atalean aurkitua

data-frame-duplicate-column-names = Datuek zutabe-izen bikoiztuak dituzte.  componentIdx :{ $componentIdx } atalean aurkitua

data-frame-missing-column-name = Datuei zutabe-izen bat falta zaie.  componentIdx :{ $componentIdx } atalean aurkitua

## `<answer>` and scoring

answer-award-depends-on-own-response = Erantzun honen sari bat answer etiketak berak bidalitako erantzunean oinarrituta dago, eta horrek ustekabeko portaera ekarriko du.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` ezartzeak ez du eraginik `sectionWideCheckWork` duen edukiontzi baten barruko `<answer>` batean, edukiontziak kontrolatzen baitu saiakera-kopurua. Ezarri `maxNumAttempts` edukiontzian.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` ezartzeak ez du eraginik `sectionWideCheckWork` duen beste edukiontzi baten barruan dagoen `sectionWideCheckWork` duen edukiontzi batean, kanpoko edukiontziak kontrolatzen baitu saiakera-kopurua. Ezarri `maxNumAttempts` kanpoko edukiontzian.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] { $attributes } atributuak ez du eraginik symbolicEquality ezarri gabe.
       *[other] { $attributes } atributuek ez dute eraginik symbolicEquality ezarri gabe.
    }

answer-invalid-type = Erantzunerako mota baliogabea: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` osagaiak izenik ez duenez, ezin da modulu-atributu gisa erabili

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` osagaia ezin da modulu baterako atributu gisa erabili, `<module>` osagai-motak "{ $name }" atributua definituta baitu jada.

conditional-content-condition-ignored = `condition` atributua ez da kontuan hartzen case edo else seme-alabak dituen `<conditionalContent>` osagai batean.

slider-markers-type-mismatch = Markatzaileen mota ez dator bat graduatzailearen motarekin.

pretzel-problem-needs-statement-and-answer = pretzel baliogabea: `<problem>` bakoitzak `<statement>` bat eta `<answer>` bat izan behar ditu.

pretzel-circuit-first-problem-distractor = pretzel baliogabea: mode="circuit" moduan lehen `<problem>` ezin da distraigarri bat izan.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Balio baliogabea { $values } `{ $attribute }` atributurako; ez da kontuan hartzen.
       *[other] Balio baliogabeak { $values } `{ $attribute }` atributurako; ez dira kontuan hartzen.
    }

attribute-must-be-references = Balio baliogabea `{ $value }` `{ $attribute }` atributurako. Atributua `$` ikurrez hasten diren erreferentziez osatuta egon behar da.

math-input-invalid-function-names = <mathInput>: funtzio-izen baliogabeak baztertu dira { $attribute } atalean: { $names }. Izen bakoitzaren bistaratze-zatiak gutxienez 2 karaktere izan behar ditu (letrak edo marratxoak); aukerako `|<mathspeak alternative>` atzizkia jarrai daiteke.

## Building components from the source

component-type-invalid = Osagai-mota baliogabea: `<{ $componentType }>`

attribute-repeated = Ezin da { $attribute } atributua errepikatu.

attribute-invalid-for-component = "{ $attribute }" atributu baliogabea `<{ $componentType }>` motako osagai baterako.

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } estilo-definizioak ez du nahikoa kontraste { $context ->
        [text-on-background] testuaren kolorea atzeko planoaren kolorearen aurka
        [high-contrast] kontraste handiko kolorea oihalaren aurka
        [line] marraren kolorea oihalaren aurka
        [marker] markatzailearen kolorea oihalaren aurka
       *[text-on-canvas] testuaren kolorea oihalaren aurka
    }{ $mode ->
        [dark] { " (modu iluna)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; gutxienez { $threshold }:1 behar da).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } estilo-definizioak modu argirako nahikoa kontraste ematen duten koloreak zehaztu arren, haietatik eratorritako modu iluneko koloreek ez dute nahikoa kontraste testuaren kolorearen eta atzeko planoaren kolorearen artean ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; gutxienez { $threshold }:1 behar da). { $suggestion ->
        [available] Modu ilunean nahikoa kontraste bermatzeko, handitu modu argiaren kontrastea (adib. ezarri { $lightAttribute }="{ $lightColor }") edo gainidatzi modu iluneko kolorea (adib. ezarri { $darkAttribute }="{ $darkColor }").
       *[none] Modu ilunean nahikoa kontraste bermatzeko, handitu modu argiaren kontrastea edo gainidatzi eratorritako koloreak textColorDarkMode eta/edo backgroundColorDarkMode erabiliz.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } estilo-definizioak modu argirako nahikoa kontraste ematen duen testu-kolorea zehaztu arren, hartatik eratorritako modu iluneko testu-koloreak ez du nahikoa kontraste oihalaren aurka ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; gutxienez { $threshold }:1 behar da). { $suggestion ->
        [available] Modu ilunean nahikoa kontraste bermatzeko, handitu modu argiaren kontrastea (adib. ezarri textColor="{ $lightColor }") edo gainidatzi modu iluneko kolorea (adib. ezarri textColorDarkMode="{ $darkColor }").
       *[none] Modu ilunean nahikoa kontraste bermatzeko, handitu modu argiaren kontrastea edo gainidatzi eratorritako kolorea textColorDarkMode erabiliz.
    }

section-multiple-style-palettes = Atal batek <stylePalette> bakarra hauta dezake; azkena erabiltzen da.

## Unique variants

variant-num-to-select-not-non-negative-integer = ezin dira { $component } elementuaren aldaera bakarrak zehaztu, numToSelect ez baita zenbaki oso ez-negatiboa.

variant-num-to-select-not-constant-number = ezin dira { $component } elementuaren aldaera bakarrak zehaztu, numToSelect ez baita zenbaki konstantea.

variant-with-replacement-not-constant-boolean = ezin dira { $component } elementuaren aldaera bakarrak zehaztu, withReplacement ez baita Boole konstantea.

variant-select-weight-disables-unique = select-erako aldaera bakarrak desgaitu egiten dira aukera batek selectWeight edo selectForVariants zehaztuta baditu

variant-coprime-undetermined = ezin dira { $component } elementuaren aldaera bakarrak zehaztu, ezin baita zehaztu coprime beti faltsua denik.

variant-attribute-not-constant = ezin dira { $component } elementuaren aldaera bakarrak zehaztu, { $attribute } ez baita konstantea.

variant-attribute-not-number = ezin dira { $component } elementuaren aldaera bakarrak zehaztu, { $attribute } ez baita zenbakia.

variant-attribute-wrong-type-for-sequence =
    ezin dira { $type } motako { $component } elementuaren aldaera bakarrak zehaztu, { $attribute } ez baita { $expected ->
        [letters-combination] letra-konbinazio bat
        [math-expression] adierazpen matematiko baliozko bat
        [integer] zenbaki oso bat
       *[number] zenbaki bat
    }.

variant-length-not-integer = ezin dira { $component } elementuaren aldaera bakarrak zehaztu, length ez baita zenbaki osoa.

variant-sort-not-implemented = ez dago inplementatuta sort duen { $component } baten aldaera bakarrik

variant-exclude-combinations-not-implemented = ez dago inplementatuta excludeCombinations duen { $component } baten aldaera bakarrik

variant-math-exclude-not-implemented = ez dago inplementatuta exclude duen math motako { $component } baten aldaera bakarrik

variant-non-constant-exclude-not-implemented = ez dago inplementatuta exclude ez-konstantea duen { $component } baten aldaera bakarrik

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ez da onartzen grafikoaren prefigure errendatzailean; ondorengoa saltatu da.

prefigure-descendant-invalid-geometry = { $subject }: geometria ez-finitua edo osatugabea; ondorengoa saltatu da.

prefigure-curve-label-omitted = { $subject }: etiketak ez dira onartzen bihurtutako kurba-elementuetan; etiketa baztertu da.

prefigure-curve-unsupported-definition-type = { $subject }: onartzen ez den kurba-funtzioaren definizio-mota '{ $definitionType }'; ondorengoa saltatu da.

prefigure-region-flip-functions-unsupported = { $subject }: flipFunctions atributua ez da onartzen regionBetweenCurves elementuan; ondorengoa saltatu da.

prefigure-region-non-formula-child = { $subject }: formula motako seme-funtzioak baino ez dira onartzen regionBetweenCurves elementuan; ondorengoa saltatu da.

prefigure-label-position-unsupported =
    { $subject }: onartzen ez den labelPosition '{ $labelPosition }' { $labelKind ->
        [line-family] marra-familiako etiketa
       *[point] puntu-etiketa
    } baterako; PreFigure-ren lerrokatze lehenetsia erabili da.

prefigure-fill-style-unsupported = { $subject }: '{ $fillStyle }' betegarri-estiloa ez du onartzen PreFigure-k; betegarri solidora itzultzen da.

prefigure-line-style-unknown = { $subject }: '{ $lineStyle }' marra-estilo ezezaguna baztertu da PreFigure-ren irteeratik.

prefigure-marker-style-mapped-to-diamond = { $subject }: '{ $markerStyle }' markatzaile-estiloa PreFigure-ren 'diamond' estilora mapatu da.

prefigure-marker-style-unsupported = { $subject }: '{ $markerStyle }' markatzaile-estiloa ez du onartzen PreFigure-k; estilo lehenetsia erabili da.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` baliogabea; ezin da helburua ebatzi. Oharra baztertu da.

annotation-ref-multiple-targets = `<annotation>`: `ref` helburu bat baino gehiagotara ebatzi da; lehena erabiltzen da.

annotation-ref-outside-graph = `<annotation>`: `ref` baliogabea; helburua inguruko grafikotik kanpo dago. Oharra baztertu da.

annotation-ref-unsupported-target = `<annotation>`: `ref` baliogabea; helburua ez da prefigure bihurketan onartzen den objektu grafiko bat. Oharra baztertu da.

annotation-text-missing = `<annotation>`: `text` falta da edo hutsik dago; testu hutsa igortzen da.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Mendekotasun zirkularra detektatu da.
       *[other] `<{ $componentType }>` osagaia dakarren mendekotasun zirkularra detektatu da.
    }

reference-no-referent = Ez da erreferenterik aurkitu erreferentzia honentzat: `{ $reference }`

reference-multiple-referents = Erreferente bat baino gehiago aurkitu dira erreferentzia honentzat: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Formatu baliogabea `<{ $componentType }>` elementuaren { $attribute } atributurako.

children-invalid = Seme-alaba baliogabeak `<{ $componentType }>` elementurako: Seme-alaba baliogabeak aurkitu dira: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Balio baliogabea `{ $value }` `{ $attribute }` atributurako, `{ $default }` balioa erabiltzen da

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Ez da DoenetML { $version } bertsioa aurkitu.
       *[other] Ez da DoenetML { $version } bertsioa aurkitu. { $fallback } bertsiora itzultzen da
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML baliogabea: { $content }

parse-tag-missing-close-tag = DoenetML baliogabea: `{ $tag }` etiketak ez du ixteko etiketarik. Bere burua ixten duen etiketa bat edo `</{ $tagName }>` etiketa bat espero zen.

parse-tag-error = DoenetML baliogabea: Errorea `<{ $tagName }>` etiketan

parse-attribute-missing-value = DoenetML baliogabea: `{ $attribute }` atributu baliogabeari balio bat falta zaiola dirudi.

parse-attribute-invalid = DoenetML baliogabea: `{ $attribute }` atributu baliogabea

parse-attribute-value-invalid = DoenetML baliogabea: `{ $value }` atributu-balio baliogabea

parse-attribute-value-quote-mismatch = DoenetML baliogabea: `{ $value }` atributu-balio baliogabea. Komatxoak ez datoz bat. `{ $quote }` bat falta zaizula dirudi

parse-open-tag-name-missing = DoenetML baliogabea: Izenik gabeko etiketa bat aurkitu da, adib. `<`

parse-tag-not-closed = DoenetML baliogabea: `{ $tag }` etiketa ez da itxi (`>` bat falta dela dirudi).

parse-self-closing-tag-name-missing = DoenetML baliogabea: Izenik gabeko etiketa bat aurkitu da `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML baliogabea: `{ $tag }` etiketa ez da itxi (`/>` bat falta dela dirudi).

parse-tag-invalid-attributes = DoenetML baliogabea: `{ $tag }` etiketa ez da baliozkoa. Baliteke atributu okerrak izatea.

parse-close-tag-name-missing = DoenetML baliogabea: Izenik gabeko ixteko etiketa bat aurkitu da, adib. `</`

parse-attribute-value-unquoted = Atributu-balioak komatxo artean idatzi behar dira: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML baliogabea: `{ $tag }` ixteko etiketa aurkitu da, baina ez dago dagokion irekitzeko etiketarik

parse-close-tag-mismatched = DoenetML baliogabea: Ixteko etiketa ez dator bat. `</{ $expected }>` espero zen. `{ $found }` aurkitu da

parser-node-unconvertible = Ezin izan da { $node } nodoa Dast nodo bihurtu.

## Names

name-attribute-invalid =
    name='{ $name }' atributu-izen baliogabea. { $reason ->
        [characters] Izenek letrak, zenbakiak, azpimarrak edo marratxoak baino ezin dituzte izan.
       *[start] Izenak letra batez hasi behar dira.
    }

component-name-invalid-start = "{ $name }" osagai-izen baliogabea. Izenak letra batez hasi behar dira.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched motako erantzun batek video atributua izan behar du

answer-video-watched-video-not-reference = videoWatched motako erantzun baten video atributua erreferentzia bat izan behar da

answer-name-not-single-text = Erantzunaren name atributuak testu-seme bakar bat izan behar du

## Referencing another document

external-doenetml-recursion-limit = Ezin izan da kanpoko DoenetML eskuratu errekurtsio-maila gehiegi direla eta. Erreferentzia zirkularrik ba al dago?

external-doenetml-unavailable = Ezin izan da DoenetML eskuratu { $attribute }="{ $uri }" helbidetik

external-doenetml-type-mismatch = { $attribute }="{ $uri }" helbidetik eskuratutako DoenetML baliogabea: ez dator bat "{ $componentType }" osagai-motarekin

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` atributua zaharkituta dago; erabili `{ $to }` haren ordez.
       *[other] [deprecation] `<{ $component }>` elementuko `{ $from }` atributua zaharkituta dago; erabili `{ $to }` haren ordez.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` atributua zaharkituta dago eta ez da kontuan hartzen, `{ $to }` ere zehaztuta baitago.
       *[other] [deprecation] `<{ $component }>` elementuko `{ $from }` atributua zaharkituta dago eta ez da kontuan hartzen, `{ $to }` ere zehaztuta baitago.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` elementuko `{ $attribute }` atributua zaharkituta dago eta ez da kontuan hartzen.


## Language coverage

pluralize-english-only = `<pluralize>` elementuak ingelesa bakarrik jar dezake pluralean, beraz haren testua aldatu gabe geratzen da { $locale } hizkuntzan idatzitako dokumentu batean. Idatzi plural-forma zuzenean, edo ezarri `pluralForm` atributuarekin.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` elementua ez da Doenet elementu ezagun bat.

schema-element-not-allowed-at-root = `<{ $tag }>` elementua ez da onartzen dokumentuaren erroan.

schema-element-not-allowed-inside = `<{ $tag }>` elementua ez da onartzen `<{ $parent }>` barruan.

schema-attribute-unrecognized = `<{ $tag }>` elementuak ez du `{ $attribute }` izeneko atributurik.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` elementuaren `{ $attribute }` atributuak zerrenda bat izan behar du, non elementu bakoitza hauetako bat den: { $allowed }
       *[other] `<{ $tag }>` elementuaren `{ $attribute }` atributuak hauetako bat izan behar du: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select-erako aldaera-izen baliogabea.  { $variantName } aldaera-izena { $numOptions } aukeratan agertzen da baina hautatu beharreko kopurua { $numToSelect } da.

select-variant-name-without-options = select-erako aldaerak zehaztu dira baina ez da aukerarik zehaztu aldaera-izen posiblerako: { $variantName }.

select-variant-name-not-possible = select-erako zehaztutako { $variantName } aldaera-izena ez da aldaera-izen posible bat.

select-too-few-options = Ezin dira { $numToSelect } osagai hautatu { $numOptions } soiletik.

select-from-sequence-too-few-values = Ezin dira { $numToSelect } balio hautatu { $length } luzerako segida batetik.

select-from-sequence-indices-count-mismatch = select-erako zehaztutako indize-kopuruak hautatu beharreko kopuruarekin bat etorri behar du

select-from-sequence-indices-not-integers = select-erako zehaztutako indize guztiek zenbaki osoak izan behar dute

select-from-sequence-index-excluded = selectfromsequence-en baztertutako indize bat zehaztu da

select-from-sequence-indices-excluded-combination = selectfromsequence-en baztertutako konbinazio bat osatzen zuten indizeak zehaztu dira

select-from-sequence-coprime-not-positive-integers = Ezin dira konbinazio elkarren arteko lehenak hautatu, ez baitira zenbaki oso positiboak hautatzen.

select-from-sequence-coprime-common-factor = Ezin dira elkarren arteko zenbaki lehenak hautatu. Balio posible guztiek faktore komun bat dute. ("from" edo "to" balioek "step" balioarekiko elkarren arteko lehenak izan behar dute.)

select-from-sequence-coprime-single-number = Ezin dira konbinazio elkarren arteko lehenak hautatu 1 ez den zenbaki bakar batetik.

select-from-sequence-excluded-too-many-combinations = Konbinazioen % 70 baino gehiago baztertu dira selectFromSequence-n

select-from-sequence-coprime-none-found = Ezin izan dira elkarren arteko zenbaki lehenak hautatu. Balio posible guztiek faktore komun bat dute.

select-from-sequence-too-few-unique-values = Ezin dira { $numToSelect } balio bakar hautatu { $numPossibleValues } luzerako segida batetik

select-prime-numbers-too-few-values = Ezin dira { $numToSelect } balio hautatu { $numValues } luzerako zenbaki lehenen zerrenda batetik

select-prime-numbers-values-count-mismatch = select-erako zehaztutako balio-kopuruak hautatu beharreko kopuruarekin bat etorri behar du

select-prime-numbers-values-not-prime = select prime number-erako zehaztutako balio guztiek zenbaki lehenen zerrendan egon behar dute

select-prime-numbers-values-excluded-combination = selectPrimeNumbers-erako zehaztutako balioak baztertutako konbinazio bat ziren

select-prime-numbers-excluded-too-many-combinations = Konbinazioen % 70 baino gehiago baztertu dira selectPrimeNumbers-en

select-random-combination-fluke = Guztiz ustekabeko kasualitate batez, ezin izan da ausazko balioen konbinaziorik hautatu

select-random-value-fluke = Guztiz ustekabeko kasualitate batez, ezin izan da ausazko baliorik hautatu
