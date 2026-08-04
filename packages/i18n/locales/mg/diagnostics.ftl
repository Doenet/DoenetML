# Malagasy diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# A Malagasy noun is not marked for number, so the counted messages here need
# no selection — see the header of `chrome.ftl`.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = Tsy raharahaina ny { $attributes } rehefa voafaritra ny teboka faran'ny roa

line-segment-attributes-ignored-with-endpoint-and-midpoint = Tsy raharahaina ny { $attributes } rehefa voafaritra miaraka ny teboka farany sy ny teboka afovoany

line-segment-midpoint-offset-without-midpoint = Tsy misy fiantraikany ny midpointOffset raha tsy misy teboka afovoany

## `<line>`

line-points-undetermined-dimensions = Tsipika mandalo teboka tsy fantatra refy.

line-points-too-few-dimensions = Tsy maintsy mandalo teboka manana refy roa farafahakeliny ny tsipika.

line-points-depend-on-variables = Mandalo teboka miankina amin'ny variables ny tsipika: { $variables }.

line-equation-invalid-format = Tsy mety ny endriky ny equation-n'ny tsipika amin'ny variables { $variable1 } sy { $variable2 }.

## `<ray>`

ray-overprescribed-through = Voafaritry ny through, endpoint ary direction ny taratra. Tsy raharahaina ny through voafaritra.

ray-dimension-mismatch = Tsy mifanaraka ny numDimensions ao amin'ny taratra.

## `<vector>`

vector-overprescribed-head = Voafaritry ny head, tail ary displacement ny vektera. Tsy raharahaina ny head voafaritra.

vector-dimension-mismatch = Tsy mifanaraka ny numDimensions ao amin'ny vektera.

## Attracting and constraining

attract-to-without-nearest-point = Tsy afaka misintona mankany amin'ny `<{ $component }>` satria tsy manana variable nearestPoint izy.

constrain-to-without-nearest-point = Tsy afaka mametra amin'ny `<{ $component }>` satria tsy manana variable nearestPoint izy.

constrain-to-interior-without-nearest-point = Tsy afaka mametra ao anatin'ny `<{ $component }>` satria tsy manana variable nearestPoint izy.

## `<choiceInput>`

choice-input-label-position-ignored = Tsy raharahaina ny labelPosition ho an'ny choiceInput tsy inline

## Ordering children by index

choice-input-indices-count-mismatch = Tsy raharahaina ny indices voafaritra ho an'ny choiceInput satria tsy mifanaraka amin'ny isan'ny zanaka choice ny isan'ny indices.

pretzel-indices-count-mismatch = Tsy raharahaina ny indices voafaritra ho an'ny problem satria tsy mifanaraka amin'ny isan'ny zanaka problem ny isan'ny indices.

shuffle-indices-count-mismatch = Tsy raharahaina ny indices voafaritra ho an'ny shuffle satria tsy mifanaraka amin'ny isan'ny singa ny isan'ny indices.

indices-ignored-out-of-range = Tsy raharahaina ny indices voafaritra ho an'ny { $component } satria misy indices mihoatra ny fetra.

pretzel-indices-repeated = Tsy raharahaina ny indices voafaritra ho an'ny pretzel satria misy indices miverimberina.

pretzel-circuit-first-index = Tsy raharahaina ny indices voafaritra ho an'ny pretzel amin'ny mode circuit satria tsy maintsy 1 ny index voalohany.

## `<shuffle>` and `<sort>`

string-children-need-type = Mba handehanan'ny `<{ $component }>` miaraka amin'ny zanaka soratra, tsy maintsy voafaritra ny attribute `type`.

invalid-type-defaulting-to-math = Tsy mety ny type { $type } ho an'ny singa { $component }. Tsy maintsy anisan'ny math, text, number na boolean. Hampiasa math.

string-not-valid-component-to-arrange = Ny soratra "{ $value }" dia tsy singa mety ho an'ny { $component }. Tsy raharahaina.

## Types and variables

invalid-type-defaulting-to-number = Tsy mety ny type { $type }, apetraka ho number ny type.

invalid-variable-value = Sanda tsy mety amin'ny variable: `{ $value }`

## Variants

variant-index-must-be-number = Tsy maintsy isa ny index variant { $index }

variant-index-must-be-integer = Tsy maintsy isa feno ny index variant { $index }

## `<sideBySide>`

side-by-side-absolute-widths = Tsy mbola vita ho an'ny fandrefesana tanteraka ny `<{ $component }>`. Apetraka ho mifandraika ny sakany.

side-by-side-absolute-margins = Tsy mbola vita ho an'ny fandrefesana tanteraka ny `<{ $component }>`. Apetraka ho mifandraika ny sisiny.

side-by-side-no-block-child = Tsy mety ny `<{ $component }>`: tsy maintsy manana zanaka block iray farafahakeliny izy.

## `<label>`

label-for-ignored-on-graphical = Tsy raharahaina ny attribute `for` amin'ny `<label>` an-tsary.

label-for-must-resolve-to-one = Tsy maintsy manondro singa iray ihany ny attribute `for` amin'ny `<label>`.

label-for-unresolved = Tsy afaka nanondro singa ny attribute `for` amin'ny `<label>`.

label-for-answer-with-authored-inputs = Manondro `<answer>` manana input nosoratan'ny mpanoratra ny attribute `for` amin'ny `<label>`; manondroa mivantana ny input.

label-for-answer-without-input = Manondro `<answer>` tsy manana input hasiana marika ny attribute `for` amin'ny `<label>`.

label-for-must-reference-input-or-answer = Tsy maintsy manondro input na answer ny attribute `for` amin'ny `<label>`.

## Accessibility

accessibility-short-description-or-decorative = Ho an'ny fahafahana miditra, tsy maintsy manana fanoritsoritana fohy na voafaritra ho haingo ny `<{ $component }>`.

accessibility-video-short-description = Ho an'ny fahafahana miditra, tsy maintsy manana fanoritsoritana fohy ny `<video>`.

accessibility-input-short-description-or-label = Ho an'ny fahafahana miditra, tsy maintsy manana fanoritsoritana fohy na marika ny `<{ $component }>`.

accessibility-answer-input-short-description-or-label = Ho an'ny fahafahana miditra, tsy maintsy manana fanoritsoritana fohy na marika ny `<answer>` mamorona input.

accessibility-short-description-contains-math = Tsy tokony hisy singa matematika toy ny `<{ $component }>` ao amin'ny fanoritsoritana fohy. Soraty amin'ny teny ny matematika.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Tsy ampy ny fifanoherana amin'ny { $colorName } ho an'ny soratry ny lohatenin'ny fizarana (mode maizina) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mila { $threshold }:1 farafahakeliny).
       *[other] Tsy ampy ny fifanoherana amin'ny { $colorName } ho an'ny soratry ny lohatenin'ny fizarana ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mila { $threshold }:1 farafahakeliny).
    }

## `<circle>`

circle-through-points-non-numerical = Tsy mbola vita ny `<circle>` mandalo teboka { $count } raha tsy manana sanda isa ny teboka.

circle-too-many-through-points = Tsy afaka mikajy faribolana mandalo teboka mihoatra ny 3.

circle-overprescribed-radius-center-points = Tsy afaka mikajy faribolana voafaritra ny rayon, ny afovoany ary ny teboka aleha.

circle-center-with-multiple-points = Tsy afaka mikajy faribolana voafaritra afovoany mandalo teboka mihoatra ny 1.

circle-radius-too-small = Tsy afaka mikajy faribolana: satria { $distance } ny elanelan'ny teboka roa, kely loatra ny rayon { $radius } voafaritra.

circle-radius-with-many-points = Tsy afaka mamorona faribolana mandalo teboka mihoatra ny roa miaraka amin'ny rayon voafaritra.

circle-invalid-center-or-through-points = Tsy mety ny afovoany na ny teboka aleha amin'ny faribolana.

circle-radius-center-with-multiple-points = Tsy afaka mikajy ny rayon'ny faribolana voafaritra afovoany mandalo teboka mihoatra ny 1.

circle-change-radius-non-numerical = Tsy afaka manova ny rayon'ny faribolana izay tsy isa ny teboka alehany

circle-radius-with-points-non-numerical = Tsy afaka mamorona faribolana mandalo teboka mihoatra ny iray miaraka amin'ny rayon voafaritra rehefa tsy misy sanda isa.

circle-change-center-non-numerical = Tsy mbola vita ny fanovana ny afovoan'ny faribolana mandalo teboka tsy isa.

## `<function>`

function-domain-insufficient-dimensions = Tsy ampy ny refin'ny domain ho an'ny fiasa. Manana elanelana { $intervals } ny domain nefa manana input { $inputs } ny fiasa.

function-domain-invalid-format = Tsy mety ny endriky ny domain ho an'ny fiasa.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Tsy raharahaina ny maximum tsy isa amin'ny fiasa.
        [minimum] Tsy raharahaina ny minimum tsy isa amin'ny fiasa.
        [extremum] Tsy raharahaina ny extremum tsy isa amin'ny fiasa.
        [point] Tsy raharahaina ny teboka tsy isa amin'ny fiasa.
        [slope] Tsy raharahaina ny fihilanana tsy isa amin'ny fiasa.
       *[other] Tsy raharahaina ny { $type } tsy isa amin'ny fiasa.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Tsy raharahaina ny maximum foana amin'ny fiasa.
        [minimum] Tsy raharahaina ny minimum foana amin'ny fiasa.
        [extremum] Tsy raharahaina ny extremum foana amin'ny fiasa.
        [point] Tsy raharahaina ny teboka foana amin'ny fiasa.
       *[other] Tsy raharahaina ny { $type } foana amin'ny fiasa.
    }

function-points-too-close = Misy teboka roa akaiky loatra ao amin'ny fiasa. Tsy azo faritana ny fiasa.

function-iterates-input-output-mismatch = Azo atao ny famerimberenana fiasa raha mitovy amin'ny isan'ny output ny isan'ny input. Manana input { $inputs } sy output { $outputs } ity fiasa ity.

## `<sequence>`

sequence-invalid-length = Tsy mety ny halavan'ny filaharana. Tsy maintsy isa feno tsy miiba.

sequence-invalid-step = Tsy mety ny dingan'ny filaharana. Tsy maintsy isa ho an'ny filaharana karazana { $type }.

sequence-invalid-endpoint-number = Tsy mety ny "{ $attribute }" amin'ny filaharan'isa. Tsy maintsy isa.

sequence-invalid-endpoint-letters = Tsy mety ny "{ $attribute }" amin'ny filaharan-tsoratra. Tsy maintsy fitambaran-tsoratra.

sequence-invalid-endpoint = Tsy mety ny "{ $attribute }" amin'ny filaharana.

select-from-sequence-coprime-not-numbers = Tsy raharahaina ny coprime satria tsy isa no fidiana

select-from-sequence-coprime-with-exclude-combinations = Tsy raharahaina ny coprime satria voafaritra ny excludeCombinations

## Resolving a `target`

target-not-found = Tsy mety ny target ho an'ny `<{ $source }>`: tsy hita ny target.

target-state-variable-not-found = Tsy mety ny target ho an'ny `<{ $source }>`: tsy hita ny variable antsoina hoe "{ $property }" amin'ny `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Tsy maintsy hafa amin'ny variable mahaleo tena ny variables amin'ny `<odeSystem>`.

ode-system-duplicate-variable-names = Tsy afaka mamaritra ny fiasa an-kavanan'ny ODE misy anaran'ny variable miankina miverina.

ode-system-rhs-function-error = Tsy afaka mamaritra ny fiasa an-kavanan'ny ODE. Nisy hadisoana teo am-pamoronana ny fiasa mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Tsy afaka mamaritra zoro eo anelanelan'ny tsipika { $count }

angle-invalid-through-point = Teboka tsy mety ao amin'ny through an'ny `<angle>`

parabola-vertex-too-many-points = Tsy mbola vita ny parabola manana vertex mandalo teboka mihoatra ny 1.

parabola-too-many-points = Tsy mbola vita ny parabola mandalo teboka mihoatra ny 3.

intersection-too-many-items = Tsy mbola vita ny fihaonana ho an'ny singa mihoatra ny roa

## Other math components

ionic-compound-not-two-ions = Tsy mbola vita ny fitambarana ionika ankoatra ny ion roa.

ionic-compound-needs-cation-and-anion = Vita ho an'ny cation iray sy anion iray ihany ny fitambarana ionika.

solve-equations-cannot-evaluate = Tsy afaka mamaha ny equation satria tsy azo tombanana: { $equation }

math-operators-operand-number-required = Tsy maintsy voafaritra ny operandNumber rehefa maka operand matematika.

eigen-decomposition-failed = Tsy afaka nikajy ny eigenvalues amin'ny matrix

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: tsy ao anatin'ny lamina ny parameter { $parameters }, ka hifanaraka amin'ny banga foana izy.

## `<graph>`

graph-grid-invalid = `<graph>`: tsy azo hazavaina ny grid="{ $grid }". Tsy maintsy none, medium, dense, na isa roa mihoatra ny aotra sarahin'ny elanelana, toy ny grid="1 0.5". Tsy misy makarakara voasoritra.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: tsy tohanana ny xLabelPosition="left" amin'ny mpanolotra prefigure; ampiasaina ny fitondran-tena an-kavanana.

prefigure-y-label-position-unsupported = `<graph>`: tsy tohanana ny yLabelPosition="bottom" amin'ny mpanolotra prefigure; ampiasaina ny fitondran-tena ambony.

prefigure-invalid-axis-bounds = `<graph>`: tsy mety ny fetran'ny axis ho an'ny fanovana ho prefigure; ampiasaina ny bbox mahazatra (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: tsy mety ny sakany ho an'ny fanovana ho prefigure; ampiasaina ny sakan'ny diagram mahazatra 425.

prefigure-invalid-aspect-ratio = `<graph>`: tsy mety ny aspectRatio ho an'ny fanovana ho prefigure; ampiasaina ny tahan'ny endrika mahazatra 1.

prefigure-grid-spacing-too-fine = `<graph>`: madinika loatra ny elanelan'ny makarakara ho an'ny fetran'ny axis; esorina ny makarakara amin'ny mpanolotra prefigure.

prefigure-annotations-not-rendered = `<graph>`: tsy haseho ny fanamarihana raha tsy ampiasaina ny mpanolotra PreFigure.

multiple-annotations-children = Nisy zanaka `<annotations>` maromaro tao amin'ny `<graph>`; tsy raharahaina izy rehetra afa-tsy ny farany.

## Referring to other components

copy-unrecognized-component-type = Tsy afaka manitatra na mandika karazana singa tsy fantatra: { $type }.

copy-prop-not-found = Tsy hita ny prop { $property } amin'ny singa karazana { $component }

collect-no-source = Tsy nisy loharano hita ho an'ny collect.

collect-invalid-component-type = Tsy afaka manangona singa karazana `<{ $component }>` satria karazana singa tsy mety izany.

reference-index-unavailable = Tsy afaka manondro ny index `{ $reference }`

## `<callAction>`

component-action-unavailable = Tsy afaka miantso ny { $action } amin'ny singa `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Tsy mety ny endriky ny angona. Tsy mitovy halava ny andalana. Hita tao amin'ny componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Misy anaran-tsanganana miverina ny angona. Hita tao amin'ny componentIdx :{ $componentIdx }

data-frame-missing-column-name = Tsy misy anaran-tsanganana ny angona. Hita tao amin'ny componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Mifototra amin'ny valiny nalefan'ny answer ihany ny award ho an'ity valiny ity, ka hiteraka fitondran-tena tsy nampoizina.

answer-max-num-attempts-in-section-wide-check-work = Tsy misy fiantraikany ny fametrahana `maxNumAttempts` amin'ny `<answer>` ao anatin'ny fitoerana manana `sectionWideCheckWork`, satria ny fitoerana no mifehy ny isan'ny fanandramana. Apetraho amin'ny fitoerana kosa ny `maxNumAttempts`.

nested-section-wide-check-work-max-num-attempts = Tsy misy fiantraikany ny fametrahana `maxNumAttempts` amin'ny fitoerana manana `sectionWideCheckWork` izay ao anatin'ny fitoerana hafa manana `sectionWideCheckWork`, satria ny fitoerana ivelany no mifehy ny isan'ny fanandramana. Apetraho amin'ny fitoerana ivelany kosa ny `maxNumAttempts`.

answer-attributes-need-symbolic-equality = Tsy hisy fiantraikany ny attribute { $attributes } raha tsy voafaritra ny symbolicEquality.

answer-invalid-type = Karazana tsy mety ho an'ny answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Satria tsy manana anarana ny singa `<{ $component }>`, tsy azo ampiasaina ho attribute an'ny module izy

module-attribute-name-already-defined = Tsy azo ampiasaina ho attribute an'ny module ny singa `<{ $component } name="{ $name }">` satria efa manana attribute "{ $name }" ny karazana singa `<module>`.

conditional-content-condition-ignored = Tsy raharahaina ny attribute `condition` amin'ny singa `<conditionalContent>` manana zanaka case na else.

slider-markers-type-mismatch = Tsy mifanaraka amin'ny karazan'ny slider ny karazan'ny marika.

pretzel-problem-needs-statement-and-answer = Pretzel tsy mety: tsy maintsy misy `<statement>` iray sy `<answer>` iray ny `<problem>` tsirairay.

pretzel-circuit-first-problem-distractor = Pretzel tsy mety: amin'ny mode="circuit", tsy azo atao distractor ny `<problem>` voalohany.

## Attribute values

attribute-invalid-values = Sanda { $values } tsy mety ho an'ny attribute `{ $attribute }`; tsy raharahaina.

attribute-must-be-references = Sanda `{ $value }` tsy mety ho an'ny attribute `{ $attribute }`. Tsy maintsy voaforona amin'ny fanondroana manomboka amin'ny `$` ny attribute.

math-input-invalid-function-names = <mathInput>: tsy noraharahaina ny anaram-piasa tsy mety tao amin'ny { $attribute }: { $names }. Tsy maintsy misy tarehintsoratra 2 farafahakeliny (litera na tsipika) ny ampahany aseho amin'ny anarana tsirairay; azo ampiana ny tovana `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Karazana singa tsy mety: `<{ $componentType }>`

attribute-repeated = Tsy azo averimberina ny attribute { $attribute }.

attribute-invalid-for-component = Tsy mety ny attribute "{ $attribute }" ho an'ny singa karazana `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Tsy ampy ny fifanoheran'ny famaritana endrika { $styleNumber } ho an'ny { $context ->
        [text-on-background] lokon-tsoratra manoloana ny lokon'ny fotony
        [high-contrast] loko be fifanoherana manoloana ny faritra fanaovan-tsary
        [line] lokon-tsipika manoloana ny faritra fanaovan-tsary
        [marker] lokon-marika manoloana ny faritra fanaovan-tsary
       *[text-on-canvas] lokon-tsoratra manoloana ny faritra fanaovan-tsary
    }{ $mode ->
        [dark] { " (mode maizina)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mila { $threshold }:1 farafahakeliny).

style-definition-dark-mode-text-background-contrast =
    Na dia namaritra loko ampy fifanoherana ho an'ny mode mazava aza ny famaritana endrika { $styleNumber }, tsy ampy fifanoherana ho an'ny lokon-tsoratra manoloana ny lokon'ny fotony ny loko ho an'ny mode maizina noforonina avy amin'ireo sanda ireo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mila { $threshold }:1 farafahakeliny). { $suggestion ->
        [available] Mba hahazoana fifanoherana ampy amin'ny mode maizina, ampitomboy ny fifanoherana amin'ny mode mazava (ohatra, apetraho { $lightAttribute }="{ $lightColor }") na soloy ny lokon'ny mode maizina (ohatra, apetraho { $darkAttribute }="{ $darkColor }").
       *[none] Mba hahazoana fifanoherana ampy amin'ny mode maizina, ampitomboy ny fifanoherana amin'ny mode mazava na soloy ny loko noforonina amin'ny textColorDarkMode sy/na backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Na dia namaritra lokon-tsoratra ampy fifanoherana ho an'ny mode mazava aza ny famaritana endrika { $styleNumber }, tsy ampy fifanoherana manoloana ny faritra fanaovan-tsary ny lokon-tsoratra ho an'ny mode maizina noforonina avy amin'io sanda io ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mila { $threshold }:1 farafahakeliny). { $suggestion ->
        [available] Mba hahazoana fifanoherana ampy amin'ny mode maizina, ampitomboy ny fifanoherana amin'ny mode mazava (ohatra, apetraho textColor="{ $lightColor }") na soloy ny lokon'ny mode maizina (ohatra, apetraho textColorDarkMode="{ $darkColor }").
       *[none] Mba hahazoana fifanoherana ampy amin'ny mode maizina, ampitomboy ny fifanoherana amin'ny mode mazava na soloy ny loko noforonina amin'ny textColorDarkMode.
    }

section-multiple-style-palettes = Iray ihany ny <stylePalette> azon'ny fizarana iray fidiana; ny farany no ampiasaina.

## Unique variants

variant-num-to-select-not-non-negative-integer = tsy afaka mamaritra ny variant tokana amin'ny { $component } satria tsy isa feno tsy miiba ny numToSelect.

variant-num-to-select-not-constant-number = tsy afaka mamaritra ny variant tokana amin'ny { $component } satria tsy isa tsy miova ny numToSelect.

variant-with-replacement-not-constant-boolean = tsy afaka mamaritra ny variant tokana amin'ny { $component } satria tsy boolean tsy miova ny withReplacement.

variant-select-weight-disables-unique = Atsahatra ny variant tokana ho an'ny select raha misy option manana selectWeight na selectForVariants

variant-coprime-undetermined = tsy afaka mamaritra ny variant tokana amin'ny { $component } satria tsy azo faritana fa diso foana ny coprime.

variant-attribute-not-constant = tsy afaka mamaritra ny variant tokana amin'ny { $component } satria miovaova ny { $attribute }.

variant-attribute-not-number = tsy afaka mamaritra ny variant tokana amin'ny { $component } satria tsy isa ny { $attribute }.

variant-attribute-wrong-type-for-sequence =
    tsy afaka mamaritra ny variant tokana amin'ny { $component } karazana { $type } satria tsy { $expected ->
        [letters-combination] fitambaran-tsoratra
        [math-expression] fomba fanehoana matematika mety
        [integer] isa feno
       *[number] isa
    } ny { $attribute }.

variant-length-not-integer = tsy afaka mamaritra ny variant tokana amin'ny { $component } satria tsy isa feno ny length.

variant-sort-not-implemented = tsy mbola vita ny variant tokana amin'ny { $component } misy sort

variant-exclude-combinations-not-implemented = tsy mbola vita ny variant tokana amin'ny { $component } misy excludeCombinations

variant-math-exclude-not-implemented = tsy mbola vita ny variant tokana amin'ny { $component } karazana math misy exclude

variant-non-constant-exclude-not-implemented = tsy mbola vita ny variant tokana amin'ny { $component } misy exclude miovaova

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: tsy tohanana amin'ny mpanolotra prefigure an'ny graph; dinganina ny taranaka.

prefigure-descendant-invalid-geometry = { $subject }: jeometria tsy voafetra na tsy feno; dinganina ny taranaka.

prefigure-curve-label-omitted = { $subject }: tsy tohanana ny marika amin'ny singa tsipika miolaka voaova; esorina ny marika.

prefigure-curve-unsupported-definition-type = { $subject }: tsy tohanana ny karazana famaritana fiasa tsipika miolaka '{ $definitionType }'; dinganina ny taranaka.

prefigure-region-flip-functions-unsupported = { $subject }: tsy tohanana ny attribute flipFunctions amin'ny regionBetweenCurves; dinganina ny taranaka.

prefigure-region-non-formula-child = { $subject }: fiasa zanaka karazana formula ihany no tohanana amin'ny regionBetweenCurves; dinganina ny taranaka.

prefigure-label-position-unsupported =
    { $subject }: tsy tohanana ny labelPosition '{ $labelPosition }' ho an'ny { $labelKind ->
        [line-family] marika amin'ny fianakavian-tsipika
       *[point] marika teboka
    }; ampiasaina ny fandaminana mahazatra an'ny PreFigure.

prefigure-fill-style-unsupported = { $subject }: tsy tohanan'ny PreFigure ny endrika fenoana '{ $fillStyle }'; miverina amin'ny fenoana feno.

prefigure-line-style-unknown = { $subject }: tsy fantatra ny endrika tsipika '{ $lineStyle }', esorina amin'ny vokatry ny PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: novaina ho endrika 'diamond' an'ny PreFigure ny endrika marika '{ $markerStyle }'.

prefigure-marker-style-unsupported = { $subject }: tsy tohanan'ny PreFigure ny endrika marika '{ $markerStyle }'; ampiasaina ny endrika mahazatra.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` tsy mety; tsy hita ny target. Esorina ny fanamarihana.

annotation-ref-multiple-targets = `<annotation>`: nanondro target maromaro ny `ref`; ampiasaina ny target voalohany.

annotation-ref-outside-graph = `<annotation>`: `ref` tsy mety; any ivelan'ny graph mirakitra azy ny target. Esorina ny fanamarihana.

annotation-ref-unsupported-target = `<annotation>`: `ref` tsy mety; tsy zavatra an-tsary tohanana amin'ny fanovana ho prefigure ny target. Esorina ny fanamarihana.

annotation-text-missing = `<annotation>`: tsy misy na foana ny `text`; soratra foana no havoaka.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Hita ny fiankinana mihodidina.
       *[other] Hita ny fiankinana mihodidina mahakasika ny singa `<{ $componentType }>`.
    }

reference-no-referent = Tsy hita izay tondroin'ny fanondroana: `{ $reference }`

reference-multiple-referents = Maro ny hita tondroin'ny fanondroana: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Tsy mety ny endriky ny attribute { $attribute } amin'ny `<{ $componentType }>`.

children-invalid = Zanaka tsy mety ho an'ny `<{ $componentType }>`: hita ny zanaka tsy mety: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Sanda `{ $value }` tsy mety ho an'ny attribute `{ $attribute }`, ampiasaina ny sanda `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Tsy hita ny DoenetML dikan-drindrambaiko { $version }.
       *[other] Tsy hita ny DoenetML dikan-drindrambaiko { $version }. Miverina amin'ny dikan-drindrambaiko { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML tsy mety: { $content }

parse-tag-missing-close-tag = DoenetML tsy mety: Tsy manana tag famaranana ny tag `{ $tag }`. Andrasana ny tag mikatona ho azy na ny tag `</{ $tagName }>`.

parse-tag-error = DoenetML tsy mety: Misy hadisoana ao amin'ny tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML tsy mety: Toa tsy misy sanda ny attribute tsy mety `{ $attribute }`.

parse-attribute-invalid = DoenetML tsy mety: Attribute tsy mety `{ $attribute }`

parse-attribute-value-invalid = DoenetML tsy mety: Sandan'ny attribute tsy mety `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML tsy mety: Sandan'ny attribute tsy mety `{ $value }`. Tsy mifanaraka ny farango. Toa tsy misy `{ $quote }`

parse-open-tag-name-missing = DoenetML tsy mety: Nahitana tag tsy misy anarana, ohatra `<`

parse-tag-not-closed = DoenetML tsy mety: Tsy nakatona ny tag `{ $tag }` (toa tsy misy `>`).

parse-self-closing-tag-name-missing = DoenetML tsy mety: Nahitana tag tsy misy anarana `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML tsy mety: Tsy nakatona ny tag `{ $tag }` (toa tsy misy `/>`).

parse-tag-invalid-attributes = DoenetML tsy mety: Tsy mety ny tag `{ $tag }`. Mety diso ny attributes-ny.

parse-close-tag-name-missing = DoenetML tsy mety: Nahitana tag famaranana tsy misy anarana, ohatra `</`

parse-attribute-value-unquoted = Tsy maintsy ao anaty farango ny sandan'ny attribute: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML tsy mety: Nahitana tag famaranana `{ $tag }`, nefa tsy misy tag fanokafana mifanaraka aminy

parse-close-tag-mismatched = DoenetML tsy mety: Tsy mifanaraka ny tag famaranana. Andrasana `</{ $expected }>`. Hita `{ $found }`

parser-node-unconvertible = Tsy azo novaina ho node Dast ny node { $node }.

## Names

name-attribute-invalid =
    Attribute tsy mety name='{ $name }'. { $reason ->
        [characters] Litera, isa, tsipika ambany na tsipika fohy ihany no azon'ny anarana ahitana.
       *[start] Tsy maintsy manomboka amin'ny litera ny anarana.
    }

component-name-invalid-start = Anaran-tsinga tsy mety "{ $name }". Tsy maintsy manomboka amin'ny litera ny anarana.

## `<answer>` sugar

answer-video-watched-missing-video = Tsy maintsy manana attribute video ny answer karazana videoWatched

answer-video-watched-video-not-reference = Tsy maintsy manana attribute video izay fanondroana ny answer karazana videoWatched

answer-name-not-single-text = Tsy maintsy manana zanaka soratra tokana ny attribute name amin'ny answer

## Referencing another document

external-doenetml-recursion-limit = Tsy afaka naka ny DoenetML ivelany noho ny ambaratonga famerimberenana be loatra. Misy fanondroana mihodidina ve?

external-doenetml-unavailable = Tsy afaka naka DoenetML avy amin'ny { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Tsy mety ny DoenetML nalaina avy amin'ny { $attribute }="{ $uri }": tsy mifanaraka amin'ny karazana singa "{ $componentType }" izy

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Tsy ampiasaina intsony ny attribute `{ $from }`; ampiasao ny `{ $to }`.
       *[other] [deprecation] Tsy ampiasaina intsony ny attribute `{ $from }` amin'ny `<{ $component }>`; ampiasao ny `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Tsy ampiasaina intsony ary tsy raharahaina ny attribute `{ $from }` satria voafaritra koa ny `{ $to }`.
       *[other] [deprecation] Tsy ampiasaina intsony ary tsy raharahaina ny attribute `{ $from }` amin'ny `<{ $component }>` satria voafaritra koa ny `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Tsy ampiasaina intsony ary tsy raharahaina ny attribute `{ $attribute }` amin'ny `<{ $component }>`.


## Language coverage

pluralize-english-only = Ny teny anglisy ihany no azon'ny `<pluralize>` atao maro, ka tsy ovaina ny soratra ao aminy amin'ny antontan-taratasy nosoratana amin'ny { $locale }. Soraty mivantana ny endrika maro, na apetraho amin'ny attribute `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Ny singa `<{ $tag }>` dia tsy singa Doenet fantatra.

schema-element-not-allowed-at-root = Tsy avela eo am-pototry ny antontan-taratasy ny singa `<{ $tag }>`.

schema-element-not-allowed-inside = Tsy avela ao anatin'ny `<{ $parent }>` ny singa `<{ $tag }>`.

schema-attribute-unrecognized = Tsy manana attribute antsoina hoe `{ $attribute }` ny singa `<{ $tag }>`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Ny attribute `{ $attribute }` amin'ny singa `<{ $tag }>` dia tsy maintsy lisitra izay singa tsirairay dia anisan'ny: { $allowed }
       *[other] Ny attribute `{ $attribute }` amin'ny singa `<{ $tag }>` dia tsy maintsy anisan'ny: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Anaran'ny variant tsy mety ho an'ny select. Ny anarana variant { $variantName } dia miseho amin'ny option { $numOptions } nefa { $numToSelect } no isa tokony hofidina.

select-variant-name-without-options = Misy variant voafaritra ho an'ny select nefa tsy misy option ho an'ny anarana variant azo atao: { $variantName }.

select-variant-name-not-possible = Ny anarana variant { $variantName } voafaritra ho an'ny select dia tsy anarana variant azo atao.

select-too-few-options = Tsy afaka mifidy singa { $numToSelect } avy amin'ny { $numOptions } ihany.

select-from-sequence-too-few-values = Tsy afaka mifidy sanda { $numToSelect } avy amin'ny filaharana lava { $length }.

select-from-sequence-indices-count-mismatch = Ny isan'ny indices voafaritra ho an'ny select dia tsy maintsy mitovy amin'ny isa tokony hofidina

select-from-sequence-indices-not-integers = Ny indices rehetra voafaritra ho an'ny select dia tsy maintsy isa feno

select-from-sequence-index-excluded = Ny index voafaritra amin'ny selectfromsequence dia nesorina

select-from-sequence-indices-excluded-combination = Ny indices voafaritra amin'ny selectfromsequence dia fitambarana nesorina

select-from-sequence-coprime-not-positive-integers = Tsy afaka mifidy fitambarana coprime satria tsy isa feno mihoatra ny aotra no fidiana.

select-from-sequence-coprime-common-factor = Tsy afaka mifidy isa coprime. Manana factor iraisana ny sanda rehetra azo atao. (Ny sanda "from" na "to" voafaritra dia tsy maintsy coprime amin'ny "step".)

select-from-sequence-coprime-single-number = Tsy afaka mifidy fitambarana coprime avy amin'ny isa tokana tsy 1.

select-from-sequence-excluded-too-many-combinations = Nesorina ny mihoatra ny 70%-n'ny fitambarana ao amin'ny selectFromSequence

select-from-sequence-coprime-none-found = Tsy afaka nifidy isa coprime. Manana factor iraisana ny sanda rehetra azo atao.

select-from-sequence-too-few-unique-values = Tsy afaka mifidy sanda tokana { $numToSelect } avy amin'ny filaharana lava { $numPossibleValues }

select-prime-numbers-too-few-values = Tsy afaka mifidy sanda { $numToSelect } avy amin'ny lisitry ny isa tsotra lava { $numValues }

select-prime-numbers-values-count-mismatch = Ny isan'ny sanda voafaritra ho an'ny select dia tsy maintsy mitovy amin'ny isa tokony hofidina

select-prime-numbers-values-not-prime = Ny sanda rehetra voafaritra ho an'ny select isa tsotra dia tsy maintsy ao anatin'ny lisitry ny isa tsotra

select-prime-numbers-values-excluded-combination = Ny sanda voafaritra amin'ny selectPrimeNumbers dia fitambarana nesorina

select-prime-numbers-excluded-too-many-combinations = Nesorina ny mihoatra ny 70%-n'ny fitambarana ao amin'ny selectPrimeNumbers

select-random-combination-fluke = Noho ny kisendrasendra tena tsy fahita, tsy afaka nifidy fitambaran-tsanda kisendrasendra

select-random-value-fluke = Noho ny kisendrasendra tena tsy fahita, tsy afaka nifidy sanda kisendrasendra
