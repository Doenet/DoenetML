# Gujarati diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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

## `<lineSegment>`

# English separates these two only in the verb — "is ignored" against "are
# ignored" — and Gujarati covers both with «અવગણાય છે», so the count selects
# nothing and the branch is dropped. `$attributesCount` goes unused here, as it
# does wherever a language makes no such distinction.
line-segment-attributes-ignored-with-endpoints = બે અંતિમ બિંદુઓ આપ્યાં હોય ત્યારે { $attributes } અવગણાય છે

line-segment-attributes-ignored-with-endpoint-and-midpoint = એક અંતિમ બિંદુ અને એક મધ્યબિંદુ બંને આપ્યાં હોય ત્યારે { $attributes } અવગણાય છે

line-segment-midpoint-offset-without-midpoint = મધ્યબિંદુ વગર midpointOffset ની કોઈ અસર થતી નથી

## `<line>`

line-points-undetermined-dimensions = અનિર્ધારિત પરિમાણોવાળાં બિંદુઓમાંથી પસાર થતી રેખા.

line-points-too-few-dimensions = રેખા ઓછામાં ઓછાં બે પરિમાણોવાળાં બિંદુઓમાંથી પસાર થવી જોઈએ.

line-points-depend-on-variables = રેખા ચલો પર આધારિત બિંદુઓમાંથી પસાર થાય છે: { $variables }.

line-equation-invalid-format = ચલ { $variable1 } અને { $variable2 } માં રેખાના સમીકરણ માટે અમાન્ય રૂપ.

## `<ray>`

ray-overprescribed-through = કિરણ through, endpoint અને direction ત્રણેયથી નિર્ધારિત થાય છે. આપેલું through અવગણાય છે.

ray-dimension-mismatch = કિરણમાં numDimensions મેળ ખાતાં નથી.

## `<vector>`

vector-overprescribed-head = સદિશ head, tail અને displacement ત્રણેયથી નિર્ધારિત થાય છે. આપેલું head અવગણાય છે.

vector-dimension-mismatch = સદિશમાં numDimensions મેળ ખાતાં નથી.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` પાસે nearestPoint સ્થિતિ ચલ ન હોવાથી તેની તરફ આકર્ષી શકાય નહીં.

constrain-to-without-nearest-point = `<{ $component }>` પાસે nearestPoint સ્થિતિ ચલ ન હોવાથી તેના પર મર્યાદિત કરી શકાય નહીં.

constrain-to-interior-without-nearest-point = `<{ $component }>` પાસે nearestPoint સ્થિતિ ચલ ન હોવાથી તેના અંદરના ભાગ પર મર્યાદિત કરી શકાય નહીં.

## `<choiceInput>`

choice-input-label-position-ignored = ઇનલાઇન ન હોય તેવા choiceInput માટે labelPosition અવગણાય છે

## Ordering children by index

choice-input-indices-count-mismatch = અનુક્રમાંકોની સંખ્યા choice બાળઘટકોની સંખ્યા સાથે મેળ ન ખાતી હોવાથી choiceInput માટે આપેલા અનુક્રમાંકો અવગણાય છે.

pretzel-indices-count-mismatch = અનુક્રમાંકોની સંખ્યા problem બાળઘટકોની સંખ્યા સાથે મેળ ન ખાતી હોવાથી problem માટે આપેલા અનુક્રમાંકો અવગણાય છે.

shuffle-indices-count-mismatch = અનુક્રમાંકોની સંખ્યા ઘટકોની સંખ્યા સાથે મેળ ન ખાતી હોવાથી shuffle માટે આપેલા અનુક્રમાંકો અવગણાય છે.

indices-ignored-out-of-range = કેટલાક અનુક્રમાંકો હદ બહાર હોવાથી { $component } માટે આપેલા અનુક્રમાંકો અવગણાય છે.

pretzel-indices-repeated = કેટલાક અનુક્રમાંકો પુનરાવર્તિત હોવાથી pretzel માટે આપેલા અનુક્રમાંકો અવગણાય છે.

pretzel-circuit-first-index = circuit રીતમાં પહેલો અનુક્રમાંક 1 હોવો જોઈએ, તેથી pretzel માટે આપેલા અનુક્રમાંકો અવગણાય છે.

## `<shuffle>` and `<sort>`

string-children-need-type = સ્ટ્રિંગ બાળઘટકો સાથે `<{ $component }>` કામ કરે તે માટે `type` ગુણધર્મ આપવો જરૂરી છે.

invalid-type-defaulting-to-math = { $component } ઘટક માટે { $type } એ અમાન્ય type છે. તે math, text, number કે boolean માંથી એક હોવો જોઈએ. math પર ગોઠવાય છે.

string-not-valid-component-to-arrange = "{ $value }" સ્ટ્રિંગ { $component } કરવા માટે યોગ્ય ઘટક નથી. અવગણાય છે.

## Types and variables

invalid-type-defaulting-to-number = { $type } એ અમાન્ય type છે, type ને number પર ગોઠવાય છે.

invalid-variable-value = ચલનું અમાન્ય મૂલ્ય: `{ $value }`

## Variants

variant-index-must-be-number = પ્રકાર અનુક્રમાંક { $index } સંખ્યા હોવો જોઈએ

variant-index-must-be-integer = પ્રકાર અનુક્રમાંક { $index } પૂર્ણાંક હોવો જોઈએ

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` નિરપેક્ષ માપ માટે અમલમાં નથી. પહોળાઈઓ સાપેક્ષ પર ગોઠવાય છે.

side-by-side-absolute-margins = `<{ $component }>` નિરપેક્ષ માપ માટે અમલમાં નથી. હાંસિયા સાપેક્ષ પર ગોઠવાય છે.

side-by-side-no-block-child = અમાન્ય `<{ $component }>`: તેમાં ઓછામાં ઓછું એક બ્લૉક બાળઘટક હોવું જોઈએ.

## `<label>`

label-for-ignored-on-graphical = આલેખાત્મક `<label>` પરનો `for` ગુણધર્મ અવગણાય છે.

label-for-must-resolve-to-one = `<label>` પરનો `for` ગુણધર્મ બરાબર એક ઘટક પર ઊકલવો જોઈએ.

label-for-unresolved = `<label>` પરનો `for` ગુણધર્મ કોઈ ઘટક પર ઊકલી શક્યો નહીં.

label-for-answer-with-authored-inputs = `<label>` પરનો `for` ગુણધર્મ સ્પષ્ટ લખેલા ઇનપુટવાળા `<answer>` નો સંદર્ભ આપે છે; ઇનપુટનો સીધો સંદર્ભ આપો.

label-for-answer-without-input = `<label>` પરનો `for` ગુણધર્મ લેબલ આપવા માટે ઇનપુટ ન હોય તેવા `<answer>` નો સંદર્ભ આપે છે.

label-for-must-reference-input-or-answer = `<label>` પરનો `for` ગુણધર્મ કોઈ ઇનપુટ કે જવાબનો સંદર્ભ આપવો જોઈએ.

## Accessibility

accessibility-short-description-or-decorative = સુગમતા માટે `<{ $component }>` પાસે ટૂંકું વર્ણન હોવું જોઈએ અથવા તેને સુશોભન તરીકે દર્શાવવું જોઈએ.

accessibility-video-short-description = સુગમતા માટે `<video>` પાસે ટૂંકું વર્ણન હોવું જોઈએ.

accessibility-input-short-description-or-label = સુગમતા માટે `<{ $component }>` પાસે ટૂંકું વર્ણન કે લેબલ હોવું જોઈએ.

accessibility-answer-input-short-description-or-label = સુગમતા માટે, ઇનપુટ બનાવતા `<answer>` પાસે ટૂંકું વર્ણન કે લેબલ હોવું જોઈએ.

accessibility-short-description-contains-math = ટૂંકાં વર્ણનોમાં `<{ $component }>` જેવા ગણિત ઘટકો ન હોવા જોઈએ. ગણિતને શબ્દોમાં લખો.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] વિભાગ શીર્ષકના લખાણ માટે { $colorName } નો વિરોધાભાસ પૂરતો નથી (શ્યામ શૈલી) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ઓછામાં ઓછો { $threshold }:1 જોઈએ).
       *[other] વિભાગ શીર્ષકના લખાણ માટે { $colorName } નો વિરોધાભાસ પૂરતો નથી ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ઓછામાં ઓછો { $threshold }:1 જોઈએ).
    }

## `<circle>`

circle-through-points-non-numerical = બિંદુઓનાં સંખ્યાત્મક મૂલ્યો ન હોય તેવા કિસ્સામાં { $count } બિંદુઓમાંથી પસાર થતું `<circle>` અમલમાં નથી.

circle-too-many-through-points = 3 થી વધુ બિંદુઓમાંથી પસાર થતું વર્તુળ ગણી શકાય નહીં.

circle-overprescribed-radius-center-points = ત્રિજ્યા, કેન્દ્ર અને પસાર થતાં બિંદુઓ ત્રણેય આપેલું વર્તુળ ગણી શકાય નહીં.

circle-center-with-multiple-points = આપેલા કેન્દ્ર સાથે 1 થી વધુ બિંદુમાંથી પસાર થતું વર્તુળ ગણી શકાય નહીં.

circle-radius-too-small = વર્તુળ ગણી શકાય નહીં: બે બિંદુઓ વચ્ચેનું અંતર { $distance } હોવાથી, આપેલી ત્રિજ્યા { $radius } ઘણી નાની છે.

circle-radius-with-many-points = આપેલી ત્રિજ્યા સાથે બે થી વધુ બિંદુઓમાંથી પસાર થતું વર્તુળ બનાવી શકાય નહીં.

circle-invalid-center-or-through-points = વર્તુળનું કેન્દ્ર કે પસાર થતાં બિંદુઓ અમાન્ય છે.

circle-radius-center-with-multiple-points = આપેલા કેન્દ્ર સાથે 1 થી વધુ બિંદુમાંથી પસાર થતા વર્તુળની ત્રિજ્યા ગણી શકાય નહીં.

circle-change-radius-non-numerical = સંખ્યાત્મક મૂલ્ય વગરનાં બિંદુઓમાંથી પસાર થતા વર્તુળની ત્રિજ્યા બદલી શકાય નહીં

circle-radius-with-points-non-numerical = સંખ્યાત્મક મૂલ્યો ન હોય ત્યારે, આપેલી ત્રિજ્યા સાથે એકથી વધુ બિંદુમાંથી પસાર થતું વર્તુળ બનાવી શકાય નહીં.

circle-change-center-non-numerical = સંખ્યાત્મક મૂલ્ય વગરનાં બિંદુઓમાંથી પસાર થતા વર્તુળનું કેન્દ્ર બદલવાનું અમલમાં નથી.

## `<function>`

# English counts the nouns as well as the verb here, but «છે» serves singular
# and plural alike and the loanwords «ઇનપુટ» and «આઉટપુટ» take no plural, so
# every branch would read the same and both selects are dropped. That leaves
# `$intervals`, `$inputs` and `$outputs` as plain placeables, which is what
# Hindi does with the same two messages.
function-domain-insufficient-dimensions = વિધેયના પ્રદેશ માટે પૂરતાં પરિમાણો નથી. પ્રદેશમાં { $intervals } અંતરાલ છે, પણ વિધેયમાં { $inputs } ઇનપુટ છે.

function-domain-invalid-format = વિધેયના પ્રદેશ માટે અમાન્ય રૂપ.

function-ignoring-non-numerical =
    { $type ->
        [maximum] વિધેયનું અસંખ્યાત્મક મહત્તમ અવગણાય છે.
        [minimum] વિધેયનું અસંખ્યાત્મક લઘુતમ અવગણાય છે.
        [extremum] વિધેયનું અસંખ્યાત્મક પરમ મૂલ્ય અવગણાય છે.
        [point] વિધેયનું અસંખ્યાત્મક બિંદુ અવગણાય છે.
        [slope] વિધેયનો અસંખ્યાત્મક ઢાળ અવગણાય છે.
       *[other] વિધેયનું અસંખ્યાત્મક { $type } અવગણાય છે.
    }

function-ignoring-empty =
    { $type ->
        [maximum] વિધેયનું ખાલી મહત્તમ અવગણાય છે.
        [minimum] વિધેયનું ખાલી લઘુતમ અવગણાય છે.
        [extremum] વિધેયનું ખાલી પરમ મૂલ્ય અવગણાય છે.
        [point] વિધેયનું ખાલી બિંદુ અવગણાય છે.
       *[other] વિધેયનું ખાલી { $type } અવગણાય છે.
    }

function-points-too-close = વિધેયમાં ખૂબ નજીક આવેલાં બે બિંદુઓ છે. વિધેય વ્યાખ્યાયિત કરી શકાય નહીં.

function-iterates-input-output-mismatch = વિધેયના ઇનપુટની સંખ્યા આઉટપુટની સંખ્યા જેટલી હોય તો જ વિધેય પુનરાવર્તનો શક્ય છે. આ વિધેયમાં { $inputs } ઇનપુટ અને { $outputs } આઉટપુટ છે.

## `<sequence>`

sequence-invalid-length = શ્રેણીની લંબાઈ અમાન્ય છે. તે ઋણેતર પૂર્ણાંક હોવી જોઈએ.

sequence-invalid-step = શ્રેણીનું પગલું અમાન્ય છે. { $type } પ્રકારની શ્રેણી માટે તે સંખ્યા હોવું જોઈએ.

sequence-invalid-endpoint-number = સંખ્યા શ્રેણીનું "{ $attribute }" અમાન્ય છે. તે સંખ્યા હોવું જોઈએ.

sequence-invalid-endpoint-letters = અક્ષર શ્રેણીનું "{ $attribute }" અમાન્ય છે. તે અક્ષરોનું સંયોજન હોવું જોઈએ.

sequence-invalid-endpoint = શ્રેણીનું "{ $attribute }" અમાન્ય છે.

select-from-sequence-coprime-not-numbers = સંખ્યાઓ પસંદ ન થતી હોવાથી coprime અવગણાય છે

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations આપ્યું હોવાથી coprime અવગણાય છે

## Resolving a `target`

target-not-found = `<{ $source }>` માટે અમાન્ય target: લક્ષ્ય મળ્યું નહીં.

target-state-variable-not-found = `<{ $source }>` માટે અમાન્ય target: `<{ $component }>` પર "{ $property }" નામનું સ્થિતિ ચલ મળ્યું નહીં.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` નાં ચલ સ્વતંત્ર ચલથી અલગ હોવાં જોઈએ.

ode-system-duplicate-variable-names = એકસરખાં આશ્રિત ચલ નામો સાથે ODE RHS વિધેયો વ્યાખ્યાયિત કરી શકાય નહીં.

ode-system-rhs-function-error = ODE RHS વિધેય વ્યાખ્યાયિત કરી શકાય નહીં. mathjs વિધેય બનાવવામાં ભૂલ.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } રેખાઓ વચ્ચેનો ખૂણો વ્યાખ્યાયિત કરી શકાય નહીં

angle-invalid-through-point = `<angle>` ના through માં અમાન્ય બિંદુ

parabola-vertex-too-many-points = શિરોબિંદુ સાથે 1 થી વધુ બિંદુમાંથી પસાર થતું પરવલય અમલમાં નથી.

parabola-too-many-points = 3 થી વધુ બિંદુઓમાંથી પસાર થતું પરવલય અમલમાં નથી.

intersection-too-many-items = બે થી વધુ વસ્તુઓ માટે છેદન અમલમાં નથી

## Other math components

ionic-compound-not-two-ions = બે આયન સિવાય બીજા કશા માટે આયનીય સંયોજન અમલમાં નથી.

ionic-compound-needs-cation-and-anion = એક ધનાયન અને એક ઋણાયન માટે જ આયનીય સંયોજન અમલમાં છે.

solve-equations-cannot-evaluate = સમીકરણનું મૂલ્યાંકન ન થઈ શકતાં તેને ઉકેલી શકાય નહીં: { $equation }

math-operators-operand-number-required = ગણિત ઘટક છૂટું પાડતી વખતે operandNumber આપવો જરૂરી છે.

eigen-decomposition-failed = શ્રેણિકની આઇગન કિંમતો ગણી શકાઈ નહીં

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } પરિમાણ ભાતમાં આવતું ન હોવાથી તે હંમેશાં ખાલી જગ્યા સાથે મેળ ખાશે.
       *[other] `<matchesPattern>`: { $parameters } પરિમાણો ભાતમાં આવતાં ન હોવાથી તે હંમેશાં ખાલી જગ્યા સાથે મેળ ખાશે.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" સમજી શકાયું નહીં. તે none, medium, dense અથવા જગ્યાથી અલગ પડેલી બે ધન સંખ્યાઓ — જેમ કે grid="1 0.5" — હોવું જોઈએ. કોઈ જાળી દોરાઈ નથી.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure રેન્ડરરમાં xLabelPosition="left" સમર્થિત નથી; જમણી બાજુના સ્થાનનું વર્તન વપરાય છે.

prefigure-y-label-position-unsupported = `<graph>`: prefigure રેન્ડરરમાં yLabelPosition="bottom" સમર્થિત નથી; ઉપરના સ્થાનનું વર્તન વપરાય છે.

prefigure-invalid-axis-bounds = `<graph>`: prefigure રૂપાંતર માટે અક્ષની હદ અમાન્ય છે; મૂળભૂત bbox (-10,-10,10,10) વપરાય છે.

prefigure-invalid-width = `<graph>`: prefigure રૂપાંતર માટે પહોળાઈ અમાન્ય છે; મૂળભૂત આકૃતિ પહોળાઈ 425 વપરાય છે.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure રૂપાંતર માટે aspectRatio અમાન્ય છે; મૂળભૂત ગુણોત્તર 1 વપરાય છે.

prefigure-grid-spacing-too-fine = `<graph>`: અક્ષની હદ માટે જાળીનું અંતર ખૂબ ઝીણું છે; prefigure રેન્ડરરમાં જાળી છોડી દેવાય છે.

prefigure-annotations-not-rendered = `<graph>`: PreFigure રેન્ડરર ન વપરાય ત્યારે ટિપ્પણીઓ દેખાશે નહીં.

multiple-annotations-children = `<graph>` માં એકથી વધુ `<annotations>` બાળઘટકો મળ્યાં; છેલ્લા સિવાયનાં બધાં અવગણાય છે.

## Referring to other components

copy-unrecognized-component-type = અજાણ્યા ઘટક પ્રકારને વિસ્તારી કે નકલ કરી શકાય નહીં: { $type }.

copy-prop-not-found = { $component } પ્રકારના ઘટક પર { $property } ગુણધર્મ મળ્યો નહીં

collect-no-source = collect માટે કોઈ સ્રોત મળ્યો નહીં.

collect-invalid-component-type = `<{ $component }>` અમાન્ય ઘટક પ્રકાર હોવાથી તે પ્રકારના ઘટકો એકઠા કરી શકાય નહીં.

reference-index-unavailable = `{ $reference }` અનુક્રમાંકનો સંદર્ભ આપી શકાય નહીં

## `<callAction>`

component-action-unavailable = `{ $reference }` ઘટક પર { $action } બોલાવી શકાય નહીં

## `<dataFrame>`

data-frame-inconsistent-row-lengths = માહિતીનો આકાર અમાન્ય છે. હરોળોની લંબાઈ અસંગત છે. componentIdx :{ $componentIdx } માં મળ્યું

data-frame-duplicate-column-names = માહિતીમાં સ્તંભનાં નામ પુનરાવર્તિત છે. componentIdx :{ $componentIdx } માં મળ્યું

data-frame-missing-column-name = માહિતીમાં એક સ્તંભનું નામ ખૂટે છે. componentIdx :{ $componentIdx } માં મળ્યું

## `<answer>` and scoring

answer-award-depends-on-own-response = આ જવાબનું એક award, એ જ answer ટૅગે મોકલેલા જવાબ પર જ આધારિત છે; આથી અણધાર્યું વર્તન થશે.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` વાળા પાત્રની અંદરના `<answer>` પર `maxNumAttempts` ગોઠવવાની કોઈ અસર થતી નથી; પ્રયાસોની સંખ્યા એ પાત્ર જ નિયંત્રિત કરે છે. `maxNumAttempts` પાત્ર પર ગોઠવો.

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` વાળા બીજા પાત્રની અંદરના, `sectionWideCheckWork` વાળા પાત્ર પર `maxNumAttempts` ગોઠવવાની કોઈ અસર થતી નથી; પ્રયાસોની સંખ્યા બહારનું પાત્ર જ નિયંત્રિત કરે છે. `maxNumAttempts` બહારના પાત્ર પર ગોઠવો.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality ગોઠવ્યા વગર { $attributes } ગુણધર્મની કોઈ અસર થશે નહીં.
       *[other] symbolicEquality ગોઠવ્યા વગર { $attributes } ગુણધર્મોની કોઈ અસર થશે નહીં.
    }

answer-invalid-type = જવાબ માટે અમાન્ય પ્રકાર: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` ઘટકને નામ ન હોવાથી, તેને module ગુણધર્મ તરીકે વાપરી શકાય નહીં

module-attribute-name-already-defined = `<module>` ઘટક પ્રકારમાં "{ $name }" ગુણધર્મ પહેલેથી વ્યાખ્યાયિત હોવાથી, `<{ $component } name="{ $name }">` ઘટકને module ના ગુણધર્મ તરીકે વાપરી શકાય નહીં.

conditional-content-condition-ignored = case કે else બાળઘટકોવાળા `<conditionalContent>` ઘટક પર `condition` ગુણધર્મ અવગણાય છે.

slider-markers-type-mismatch = નિશાનીઓનો પ્રકાર slider ના પ્રકાર સાથે મેળ ખાતો નથી.

pretzel-problem-needs-statement-and-answer = અમાન્ય pretzel: દરેક `<problem>` માં એક `<statement>` અને એક `<answer>` હોવાં જોઈએ.

pretzel-circuit-first-problem-distractor = અમાન્ય pretzel: mode="circuit" માં પહેલું `<problem>` ધ્યાનભંગ કરનારું ન હોઈ શકે.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` ગુણધર્મ માટે અમાન્ય મૂલ્ય { $values }; અવગણાય છે.
       *[other] `{ $attribute }` ગુણધર્મ માટે અમાન્ય મૂલ્યો { $values }; અવગણાય છે.
    }

attribute-must-be-references = `{ $attribute }` ગુણધર્મ માટે `{ $value }` અમાન્ય મૂલ્ય છે. તે ગુણધર્મ `$` થી શરૂ થતા સંદર્ભોનો બનેલો હોવો જોઈએ.

math-input-invalid-function-names = <mathInput>: { $attribute } માંનાં અમાન્ય વિધેય નામ(ો) અવગણ્યાં: { $names }. દરેક નામનો દેખાવ ભાગ ઓછામાં ઓછા 2 અક્ષરો (અક્ષરો કે ડૅશ) નો હોવો જોઈએ; પછી વૈકલ્પિક રીતે `|<mathspeak alternative>` પ્રત્યય આવી શકે.

## Building components from the source

component-type-invalid = અમાન્ય ઘટક પ્રકાર: `<{ $componentType }>`

attribute-repeated = { $attribute } ગુણધર્મ પુનરાવર્તિત કરી શકાય નહીં.

attribute-invalid-for-component = `<{ $componentType }>` પ્રકારના ઘટક માટે "{ $attribute }" અમાન્ય ગુણધર્મ છે.

## Style definition contrast

style-definition-insufficient-contrast =
    શૈલી વ્યાખ્યા { $styleNumber } માં { $context ->
        [text-on-background] પૃષ્ઠભૂમિ રંગ સામે લખાણના રંગનો
        [high-contrast] કૅન્વાસ સામે ઉચ્ચ-વિરોધાભાસી રંગનો
        [line] કૅન્વાસ સામે રેખાના રંગનો
        [marker] કૅન્વાસ સામે નિશાનીના રંગનો
       *[text-on-canvas] કૅન્વાસ સામે લખાણના રંગનો
    } વિરોધાભાસ પૂરતો નથી{ $mode ->
        [dark] { " (શ્યામ શૈલી)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ઓછામાં ઓછો { $threshold }:1 જોઈએ).

style-definition-dark-mode-text-background-contrast =
    શૈલી વ્યાખ્યા { $styleNumber } એ પ્રકાશ શૈલી માટે પૂરતો વિરોધાભાસ આપતા રંગો આપ્યા હોવા છતાં, તેમાંથી મેળવેલા શ્યામ શૈલીના રંગોમાં પૃષ્ઠભૂમિ રંગ સામે લખાણના રંગનો વિરોધાભાસ પૂરતો નથી ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ઓછામાં ઓછો { $threshold }:1 જોઈએ). { $suggestion ->
        [available] શ્યામ શૈલીમાં પૂરતો વિરોધાભાસ ખાતરી કરવા, પ્રકાશ શૈલીનો વિરોધાભાસ વધારો (દા.ત. { $lightAttribute }="{ $lightColor }" ગોઠવો) અથવા શ્યામ શૈલીનો રંગ ઓવરરાઇડ કરો (દા.ત. { $darkAttribute }="{ $darkColor }" ગોઠવો).
       *[none] શ્યામ શૈલીમાં પૂરતો વિરોધાભાસ ખાતરી કરવા, પ્રકાશ શૈલીનો વિરોધાભાસ વધારો અથવા મેળવેલા રંગોને textColorDarkMode અને/અથવા backgroundColorDarkMode થી ઓવરરાઇડ કરો.
    }

style-definition-dark-mode-text-canvas-contrast =
    શૈલી વ્યાખ્યા { $styleNumber } એ પ્રકાશ શૈલી માટે પૂરતો વિરોધાભાસ આપતો લખાણ રંગ આપ્યો હોવા છતાં, તેમાંથી મેળવેલા શ્યામ શૈલીના લખાણ રંગનો કૅન્વાસ સામે વિરોધાભાસ પૂરતો નથી ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ઓછામાં ઓછો { $threshold }:1 જોઈએ). { $suggestion ->
        [available] શ્યામ શૈલીમાં પૂરતો વિરોધાભાસ ખાતરી કરવા, પ્રકાશ શૈલીનો વિરોધાભાસ વધારો (દા.ત. textColor="{ $lightColor }" ગોઠવો) અથવા શ્યામ શૈલીનો રંગ ઓવરરાઇડ કરો (દા.ત. textColorDarkMode="{ $darkColor }" ગોઠવો).
       *[none] શ્યામ શૈલીમાં પૂરતો વિરોધાભાસ ખાતરી કરવા, પ્રકાશ શૈલીનો વિરોધાભાસ વધારો અથવા મેળવેલા રંગને textColorDarkMode થી ઓવરરાઇડ કરો.
    }

section-multiple-style-palettes = એક વિભાગ માત્ર એક જ <stylePalette> પસંદ કરી શકે; છેલ્લું વપરાય છે.

## Unique variants

variant-num-to-select-not-non-negative-integer = numToSelect ઋણેતર પૂર્ણાંક ન હોવાથી { $component } ના અનન્ય પ્રકારો નક્કી કરી શકાય નહીં.

variant-num-to-select-not-constant-number = numToSelect અચળ સંખ્યા ન હોવાથી { $component } ના અનન્ય પ્રકારો નક્કી કરી શકાય નહીં.

variant-with-replacement-not-constant-boolean = withReplacement અચળ boolean ન હોવાથી { $component } ના અનન્ય પ્રકારો નક્કી કરી શકાય નહીં.

variant-select-weight-disables-unique = selectWeight કે selectForVariants આપેલો કોઈ વિકલ્પ હોય તો select માટે અનન્ય પ્રકારો બંધ થાય છે

variant-coprime-undetermined = coprime હંમેશાં ખોટું છે એ નક્કી ન થઈ શકતાં { $component } ના અનન્ય પ્રકારો નક્કી કરી શકાય નહીં.

variant-attribute-not-constant = { $attribute } અચળ ન હોવાથી { $component } ના અનન્ય પ્રકારો નક્કી કરી શકાય નહીં.

variant-attribute-not-number = { $attribute } સંખ્યા ન હોવાથી { $component } ના અનન્ય પ્રકારો નક્કી કરી શકાય નહીં.

variant-attribute-wrong-type-for-sequence =
    { $attribute } એ { $expected ->
        [letters-combination] અક્ષરોનું સંયોજન
        [math-expression] માન્ય ગાણિતિક પદાવલિ
        [integer] પૂર્ણાંક
       *[number] સંખ્યા
    } ન હોવાથી { $type } પ્રકારના { $component } ના અનન્ય પ્રકારો નક્કી કરી શકાય નહીં.

variant-length-not-integer = length પૂર્ણાંક ન હોવાથી { $component } ના અનન્ય પ્રકારો નક્કી કરી શકાય નહીં.

variant-sort-not-implemented = sort વાળા { $component } ના અનન્ય પ્રકારો અમલમાં નથી

variant-exclude-combinations-not-implemented = excludeCombinations વાળા { $component } ના અનન્ય પ્રકારો અમલમાં નથી

variant-math-exclude-not-implemented = exclude વાળા math પ્રકારના { $component } ના અનન્ય પ્રકારો અમલમાં નથી

variant-non-constant-exclude-not-implemented = અચળ ન હોય તેવા exclude વાળા { $component } ના અનન્ય પ્રકારો અમલમાં નથી

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure રેન્ડરરમાં સમર્થિત નથી; વંશજ છોડી દેવાયો.

prefigure-descendant-invalid-geometry = { $subject }: અસીમ કે અધૂરી ભૂમિતિ; વંશજ છોડી દેવાયો.

prefigure-curve-label-omitted = { $subject }: રૂપાંતરિત વક્રરેખા ઘટકો પર લેબલ સમર્થિત નથી; લેબલ છોડી દેવાયું.

prefigure-curve-unsupported-definition-type = { $subject }: અસમર્થિત વક્રરેખા વિધેય વ્યાખ્યા પ્રકાર '{ $definitionType }'; વંશજ છોડી દેવાયો.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves પર અસમર્થિત flipFunctions ગુણધર્મ; વંશજ છોડી દેવાયો.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves પર માત્ર સૂત્ર પ્રકારનાં બાળ વિધેયો સમર્થિત છે; વંશજ છોડી દેવાયો.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] રેખા કુળના લેબલ માટે
       *[point] બિંદુના લેબલ માટે
    } અસમર્થિત labelPosition '{ $labelPosition }'; મૂળભૂત PreFigure ગોઠવણી વપરાઈ.

prefigure-fill-style-unsupported = { $subject }: ભરણી શૈલી '{ $fillStyle }' ને PreFigure સમર્થન આપતું નથી; ઘન ભરણી પર પાછા ફરાય છે.

prefigure-line-style-unknown = { $subject }: અજાણી રેખા શૈલી '{ $lineStyle }' PreFigure આઉટપુટમાંથી છોડી દેવાઈ.

prefigure-marker-style-mapped-to-diamond = { $subject }: નિશાની શૈલી '{ $markerStyle }' PreFigure શૈલી 'diamond' પર મૅપ કરાઈ.

prefigure-marker-style-unsupported = { $subject }: નિશાની શૈલી '{ $markerStyle }' ને PreFigure સમર્થન આપતું નથી; મૂળભૂત શૈલી વપરાઈ.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: અમાન્ય `ref`; લક્ષ્ય ઊકલી શક્યું નહીં. ટિપ્પણી છોડી દેવાઈ.

annotation-ref-multiple-targets = `<annotation>`: `ref` એકથી વધુ લક્ષ્ય પર ઊકલ્યું; પહેલું લક્ષ્ય વપરાય છે.

annotation-ref-outside-graph = `<annotation>`: અમાન્ય `ref`; લક્ષ્ય તેને સમાવતા આલેખની બહાર છે. ટિપ્પણી છોડી દેવાઈ.

annotation-ref-unsupported-target = `<annotation>`: અમાન્ય `ref`; prefigure રૂપાંતરમાં લક્ષ્ય સમર્થિત આલેખાત્મક વસ્તુ નથી. ટિપ્પણી છોડી દેવાઈ.

annotation-text-missing = `<annotation>`: `text` ખૂટે છે કે ખાલી છે; ખાલી લખાણ અપાય છે.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] ચક્રીય અવલંબન મળ્યું.
       *[other] `<{ $componentType }>` ઘટક સંકળાયેલું ચક્રીય અવલંબન મળ્યું.
    }

reference-no-referent = આ સંદર્ભ માટે કંઈ મળ્યું નથી: `{ $reference }`

reference-multiple-referents = આ સંદર્ભ માટે એકથી વધુ લક્ષ્ય મળ્યાં: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` ના { $attribute } ગુણધર્મ માટે અમાન્ય રૂપ.

children-invalid = `<{ $componentType }>` માટે અમાન્ય બાળઘટકો: અમાન્ય બાળઘટકો મળ્યાં: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` ગુણધર્મ માટે `{ $value }` અમાન્ય મૂલ્ય છે, `{ $default }` મૂલ્ય વપરાય છે

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML આવૃત્તિ { $version } મળી નહીં.
       *[other] DoenetML આવૃત્તિ { $version } મળી નહીં. આવૃત્તિ { $fallback } વપરાય છે
    }

## Reading the DoenetML

parse-invalid-doenetml = અમાન્ય DoenetML: { $content }

parse-tag-missing-close-tag = અમાન્ય DoenetML: `{ $tag }` ટૅગનો બંધ કરતો ટૅગ નથી. સ્વયં-બંધ થતો ટૅગ કે `</{ $tagName }>` ટૅગ અપેક્ષિત હતો.

parse-tag-error = અમાન્ય DoenetML: `<{ $tagName }>` ટૅગમાં ભૂલ

parse-attribute-missing-value = અમાન્ય DoenetML: `{ $attribute }` અમાન્ય ગુણધર્મનું મૂલ્ય ખૂટતું જણાય છે.

parse-attribute-invalid = અમાન્ય DoenetML: અમાન્ય ગુણધર્મ `{ $attribute }`

parse-attribute-value-invalid = અમાન્ય DoenetML: અમાન્ય ગુણધર્મ મૂલ્ય `{ $value }`

parse-attribute-value-quote-mismatch = અમાન્ય DoenetML: અમાન્ય ગુણધર્મ મૂલ્ય `{ $value }`. અવતરણ ચિહ્નો મેળ ખાતાં નથી. `{ $quote }` ખૂટતું જણાય છે

parse-open-tag-name-missing = અમાન્ય DoenetML: નામ વગરનો ટૅગ મળ્યો, દા.ત. `<`

parse-tag-not-closed = અમાન્ય DoenetML: `{ $tag }` ટૅગ બંધ થયો નથી (`>` ખૂટતું જણાય છે).

parse-self-closing-tag-name-missing = અમાન્ય DoenetML: નામ વગરનો ટૅગ મળ્યો `<{ $content }>`

parse-self-closing-tag-not-closed = અમાન્ય DoenetML: `{ $tag }` ટૅગ બંધ થયો નથી (`/>` ખૂટતું જણાય છે).

parse-tag-invalid-attributes = અમાન્ય DoenetML: `{ $tag }` ટૅગ માન્ય નથી. તેના ગુણધર્મો ખોટા હોઈ શકે.

parse-close-tag-name-missing = અમાન્ય DoenetML: નામ વગરનો બંધ કરતો ટૅગ મળ્યો, દા.ત. `</`

parse-attribute-value-unquoted = ગુણધર્મ મૂલ્યો અવતરણ ચિહ્નોમાં હોવાં જોઈએ: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = અમાન્ય DoenetML: `{ $tag }` બંધ કરતો ટૅગ મળ્યો, પણ તેને અનુરૂપ ખોલતો ટૅગ નથી

parse-close-tag-mismatched = અમાન્ય DoenetML: બંધ કરતો ટૅગ મેળ ખાતો નથી. `</{ $expected }>` અપેક્ષિત હતું. `{ $found }` મળ્યું

parser-node-unconvertible = { $node } નોડને Dast નોડમાં ફેરવી શકાયો નહીં.

## Names

name-attribute-invalid =
    અમાન્ય ગુણધર્મ name='{ $name }'. { $reason ->
        [characters] નામોમાં ફક્ત અક્ષરો, અંકો, અન્ડરસ્કોર કે ડૅશ હોઈ શકે.
       *[start] નામ અક્ષરથી શરૂ થવું જોઈએ.
    }

component-name-invalid-start = અમાન્ય ઘટક નામ "{ $name }". નામ અક્ષરથી શરૂ થવું જોઈએ.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched પ્રકારના જવાબમાં video ગુણધર્મ હોવો જોઈએ

answer-video-watched-video-not-reference = videoWatched પ્રકારના જવાબનો video ગુણધર્મ સંદર્ભ હોવો જોઈએ

answer-name-not-single-text = જવાબના name ગુણધર્મમાં એક જ text બાળઘટક હોવું જોઈએ

## Referencing another document

external-doenetml-recursion-limit = ઘણાં સ્તરોના પુનરાવર્તનને કારણે બહારનું DoenetML મેળવી શકાયું નહીં. શું કોઈ ચક્રીય સંદર્ભ છે?

external-doenetml-unavailable = { $attribute }="{ $uri }" માંથી DoenetML મેળવી શકાયું નહીં

external-doenetml-type-mismatch = { $attribute }="{ $uri }" માંથી મળેલું DoenetML અમાન્ય છે: તે "{ $componentType }" ઘટક પ્રકાર સાથે મેળ ખાતું નથી

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` ગુણધર્મ બંધ થઈ રહ્યો છે; તેના બદલે `{ $to }` વાપરો.
       *[other] [deprecation] `<{ $component }>` પરનો `{ $from }` ગુણધર્મ બંધ થઈ રહ્યો છે; તેના બદલે `{ $to }` વાપરો.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $to }` પણ આપ્યું હોવાથી `{ $from }` ગુણધર્મ બંધ થઈ રહ્યો છે અને અવગણાય છે.
       *[other] [deprecation] `{ $to }` પણ આપ્યું હોવાથી `<{ $component }>` પરનો `{ $from }` ગુણધર્મ બંધ થઈ રહ્યો છે અને અવગણાય છે.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` પરનો `{ $attribute }` ગુણધર્મ બંધ થઈ રહ્યો છે અને અવગણાય છે.


## Language coverage

pluralize-english-only = `<pluralize>` ફક્ત અંગ્રેજીનું બહુવચન કરી શકે છે, તેથી { $locale } ભાષામાં લખેલા દસ્તાવેજમાં તેનું લખાણ યથાવત્ રહે છે. બહુવચન રૂપ સીધું લખો, અથવા `pluralForm` ગુણધર્મથી ગોઠવો.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` એ ઓળખાયેલું Doenet તત્ત્વ નથી.

schema-element-not-allowed-at-root = દસ્તાવેજના મૂળમાં `<{ $tag }>` તત્ત્વની મંજૂરી નથી.

schema-element-not-allowed-inside = `<{ $parent }>` ની અંદર `<{ $tag }>` તત્ત્વની મંજૂરી નથી.

schema-attribute-unrecognized = `<{ $tag }>` તત્ત્વમાં `{ $attribute }` નામનો ગુણધર્મ નથી.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` તત્ત્વનો `{ $attribute }` ગુણધર્મ એવી યાદી હોવો જોઈએ જેની દરેક નોંધ આમાંથી એક હોય: { $allowed }
       *[other] `<{ $tag }>` તત્ત્વનો `{ $attribute }` ગુણધર્મ આમાંથી એક હોવો જોઈએ: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select માટે અમાન્ય પ્રકાર નામ. પ્રકાર નામ { $variantName } એ { $numOptions } વિકલ્પોમાં આવે છે, પણ પસંદ કરવાની સંખ્યા { $numToSelect } છે.

select-variant-name-without-options = select માટે કેટલાક પ્રકારો આપ્યા છે, પણ સંભવિત પ્રકાર નામ માટે કોઈ વિકલ્પ આપ્યો નથી: { $variantName }.

select-variant-name-not-possible = select માટે આપેલું પ્રકાર નામ { $variantName } સંભવિત પ્રકાર નામ નથી.

select-too-few-options = માત્ર { $numOptions } માંથી { $numToSelect } ઘટકો પસંદ કરી શકાય નહીં.

select-from-sequence-too-few-values = { $length } લંબાઈની શ્રેણીમાંથી { $numToSelect } મૂલ્યો પસંદ કરી શકાય નહીં.

select-from-sequence-indices-count-mismatch = select માટે આપેલા અનુક્રમાંકોની સંખ્યા પસંદ કરવાની સંખ્યા સાથે મેળ ખાવી જોઈએ

select-from-sequence-indices-not-integers = select માટે આપેલા બધા અનુક્રમાંકો પૂર્ણાંક હોવા જોઈએ

select-from-sequence-index-excluded = બાકાત રખાયેલો selectfromsequence અનુક્રમાંક આપ્યો છે

select-from-sequence-indices-excluded-combination = બાકાત રખાયેલું સંયોજન હોય તેવા selectfromsequence અનુક્રમાંકો આપ્યા છે

select-from-sequence-coprime-not-positive-integers = ધન પૂર્ણાંકો પસંદ ન થતા હોવાથી પરસ્પર અવિભાજ્ય સંયોજનો પસંદ કરી શકાય નહીં.

select-from-sequence-coprime-common-factor = પરસ્પર અવિભાજ્ય સંખ્યાઓ પસંદ કરી શકાય નહીં. બધાં સંભવિત મૂલ્યોનો એક સામાન્ય અવયવ છે. ("from" કે "to" નાં આપેલાં મૂલ્યો "step" સાથે પરસ્પર અવિભાજ્ય હોવાં જોઈએ.)

select-from-sequence-coprime-single-number = 1 ન હોય તેવી એક જ સંખ્યામાંથી પરસ્પર અવિભાજ્ય સંયોજનો પસંદ કરી શકાય નહીં.

select-from-sequence-excluded-too-many-combinations = selectFromSequence માં 70% થી વધુ સંયોજનો બાકાત રખાયાં છે

select-from-sequence-coprime-none-found = પરસ્પર અવિભાજ્ય સંખ્યાઓ પસંદ કરી શકાઈ નહીં. બધાં સંભવિત મૂલ્યોનો એક સામાન્ય અવયવ છે.

select-from-sequence-too-few-unique-values = { $numPossibleValues } લંબાઈની શ્રેણીમાંથી { $numToSelect } અનન્ય મૂલ્યો પસંદ કરી શકાય નહીં

select-prime-numbers-too-few-values = { $numValues } લંબાઈની અવિભાજ્ય સંખ્યાઓની યાદીમાંથી { $numToSelect } મૂલ્યો પસંદ કરી શકાય નહીં

select-prime-numbers-values-count-mismatch = select માટે આપેલાં મૂલ્યોની સંખ્યા પસંદ કરવાની સંખ્યા સાથે મેળ ખાવી જોઈએ

select-prime-numbers-values-not-prime = select prime number માટે આપેલાં બધાં મૂલ્યો અવિભાજ્ય સંખ્યાઓની યાદીમાં હોવાં જોઈએ

select-prime-numbers-values-excluded-combination = selectPrimeNumbers માટે આપેલાં મૂલ્યો બાકાત રખાયેલું સંયોજન હતાં

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers માં 70% થી વધુ સંયોજનો બાકાત રખાયાં છે

select-random-combination-fluke = અત્યંત અસંભવ યોગાનુયોગને કારણે, યાદચ્છિક મૂલ્યોનું સંયોજન પસંદ કરી શકાયું નહીં

select-random-value-fluke = અત્યંત અસંભવ યોગાનુયોગને કારણે, યાદચ્છિક મૂલ્ય પસંદ કરી શકાયું નહીં
