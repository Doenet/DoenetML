# Limburgish (Limburgs) diagnostics. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The Veldeke spelling; see `chrome.ftl` for the note on «tj»,
# «dj» and the vowels «ö», «ü», «ä».
#
# **This file is not `locales/nl` and must not be edited into one.** The two
# are close and were read side by side, which makes their agreement no evidence
# either is right. Where they part company they do so in the commonest words:
# «good» for «goed», «verkierd» for «onjuist», «pöntj» for «punt», «riej» for
# «rij», «blaadzie» for «pagina», «faeler» for «fout», «gevónje» for
# «gevonden».
#
# **The quickest check.** These sentences are long and Dutch is never far away,
# so a reviewer scanning fast can look for four things that are Limburgish
# rather than Dutch and are in nearly every message here: **«neet»** for
# «niet», **«waere»** for «worden» (and «weurt» for «wordt»), **«zin»** for
# «zijn», and **«gein»** for «geen». A sentence carrying none of them is very
# likely still Dutch. «mie es» for «meer dan», «óngeldig» beside «deug neet»,
# «pöntj»/«pöntje» and «lien»/«liene» are the next thing to scan for.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber`, `maxNumAttempts`, `sectionWideCheckWork`
# — are part of the language, not prose, and stay in English exactly as
# written. So does anything quoted back from the author's own source, and so do
# `WCAG AA`, `DoenetML`, `PreFigure`, `prefigure`, `XML`, `mathjs` and `Dast`,
# which are names.
#
# **Number.** CLDR has **no** plural rules for `li`:
# `Intl.PluralRules("li")` resolves to the runtime's default locale, so a
# `zero`, `two`, `few` or `many` branch here would be selected by some other
# language. None appears anywhere. `one`/`other` is kept because it is the
# split the fallback happens to make correctly for Limburgish too. Every
# **symbolic** selector — `$type`, `$mode`, `$reason`, `$context`,
# `$suggestion`, `$alternative`, `$fallback`, `$expected`, `$labelKind`,
# `$isList`, `$componentType` — is kept byte for byte from English, keys
# included.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } weurt genegeerd wen twie eindpöntje opgegaeve zin
       *[other] { $attributes } waere genegeerd wen twie eindpöntje opgegaeve zin
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } weurt genegeerd wen zoewaal e eindpöntj es e middelpöntj opgegaeve zin
       *[other] { $attributes } waere genegeerd wen zoewaal e eindpöntj es e middelpöntj opgegaeve zin
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset haet gein effek zónger e middelpöntj

## `<line>`

line-points-undetermined-dimensions = Lien door pöntje mit ónbepaalde dimensies.

line-points-too-few-dimensions = E lien mót door pöntje van minstens twie dimensies gaon.

line-points-depend-on-variables = De lien geit door pöntje die van variabele aafhange: { $variables }.

line-equation-invalid-format = Óngeldig formaat veur de vergeliekung van e lien in de variabele { $variable1 } en { $variable2 }.

## `<ray>`

ray-overprescribed-through = De haafrechte is bepaald door through, endpoint en direction.  De opgegaeve through weurt genegeerd.

ray-dimension-mismatch = numDimensions kump neet euverein in de haafrechte.

## `<vector>`

vector-overprescribed-head = De vector is bepaald door head, tail en displacement.  De opgegaeve head weurt genegeerd.

vector-dimension-mismatch = numDimensions kump neet euverein in de vector.

## Attracting and constraining

attract-to-without-nearest-point = Aantrekke nao e `<{ $component }>` geit neet, wiel 't gein toestandsvariabele nearestPoint haet.

constrain-to-without-nearest-point = Beperke tot e `<{ $component }>` geit neet, wiel 't gein toestandsvariabele nearestPoint haet.

constrain-to-interior-without-nearest-point = Beperke tot 't binneste van e `<{ $component }>` geit neet, wiel 't gein toestandsvariabele nearestPoint haet.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition weurt genegeerd bie e neet-inline choiceInput

## Ordering children by index

choice-input-indices-count-mismatch = De veur choiceInput opgegaeve indices waere genegeerd, wiel hun aantal neet euverein kump mit 't aantal choice-kinger.

pretzel-indices-count-mismatch = De veur problem opgegaeve indices waere genegeerd, wiel hun aantal neet euverein kump mit 't aantal problem-kinger.

shuffle-indices-count-mismatch = De veur shuffle opgegaeve indices waere genegeerd, wiel hun aantal neet euverein kump mit 't aantal componente.

indices-ignored-out-of-range = De veur { $component } opgegaeve indices waere genegeerd, wiel e paar buute 't bereik valle.

pretzel-indices-repeated = De veur pretzel opgegaeve indices waere genegeerd, wiel e paar herhaald zin.

pretzel-circuit-first-index = De veur pretzel in circuit-modus opgegaeve indices waere genegeerd, wiel de ierste index 1 mót zin.

## `<shuffle>` and `<sort>`

string-children-need-type = Veur det `<{ $component }>` mit tekskinger werk, mót e `type`-kenmerk opgegaeve waere.

invalid-type-defaulting-to-math = Óngeldig type { $type } veur de component { $component }. 't Mót math, text, number of boolean zin. math weurt gebruuk.

string-not-valid-component-to-arrange = De teks "{ $value }" is gein geldige component veur { $component }. Dee weurt genegeerd.

## Types and variables

invalid-type-defaulting-to-number = Óngeldig type { $type }; 't type weurt op number gezat.

invalid-variable-value = Óngeldige waerd van e variabele: `{ $value }`

## Variants

variant-index-must-be-number = De variantindex { $index } mót e getal zin

variant-index-must-be-integer = De variantindex { $index } mót e gans getal zin

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` is neet gemaak veur absolute maote. De breides waere relatief gemaak.

side-by-side-absolute-margins = `<{ $component }>` is neet gemaak veur absolute maote. De marges waere relatief gemaak.

side-by-side-no-block-child = Óngeldige `<{ $component }>`: d'r mót minstens ei blokkindj zin.

## `<label>`

label-for-ignored-on-graphical = 't Kenmerk `for` op e grafisch `<label>` weurt genegeerd.

label-for-must-resolve-to-one = 't Kenmerk `for` op `<label>` mót nao krek ein component verwieze.

label-for-unresolved = 't Kenmerk `for` op `<label>` kós neet nao e component herleid waere.

label-for-answer-with-authored-inputs = 't Kenmerk `for` op `<label>` verwies nao e `<answer>` mit uutdrökkelik gesjreve invoervelder; verwies rechstreeks nao 't invoerveld.

label-for-answer-without-input = 't Kenmerk `for` op `<label>` verwies nao e `<answer>` zónger invoerveld veur te benuime.

label-for-must-reference-input-or-answer = 't Kenmerk `for` op `<label>` mót nao e invoerveld of e antwoord verwieze.

## Accessibility

accessibility-short-description-or-decorative = Veur de toegankelikheid mót `<{ $component }>` of e kórte besjrieving höbbe of es versiering aangeduud zin.

accessibility-video-short-description = Veur de toegankelikheid mót `<video>` e kórte besjrieving höbbe.

accessibility-input-short-description-or-label = Veur de toegankelikheid mót `<{ $component }>` e kórte besjrieving of e naamke höbbe.

accessibility-answer-input-short-description-or-label = Veur de toegankelikheid mót e `<answer>` det e invoerveld maak e kórte besjrieving of e naamke höbbe.

accessibility-short-description-contains-math = Kórte besjrievinge hure gein wiskundecomponente wie `<{ $component }>` te bevatte. Sjrief de wiskunde veluut in wäörd.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } haet te weinig contras veur de teks van de sectiekop (duustere modus) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; minstens { $threshold }:1 nudig).
       *[other] { $colorName } haet te weinig contras veur de teks van de sectiekop ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; minstens { $threshold }:1 nudig).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` door { $count } pöntje is neet gemaak veur 't geval det de pöntje gein getalswaerde höbbe.

circle-too-many-through-points = Ne circel door mie es 3 pöntje kan neet berekend waere.

circle-overprescribed-radius-center-points = Ne circel mit opgegaeve straol, middelpöntj en doorgangspöntje kan neet berekend waere.

circle-center-with-multiple-points = Ne circel mit opgegaeve middelpöntj door mie es 1 pöntj kan neet berekend waere.

circle-radius-too-small = De circel kan neet berekend waere: wiel de aafstandj tösje de twie pöntje { $distance } is, is de opgegaeve straol { $radius } te klein.

circle-radius-with-many-points = Ne circel door mie es twie pöntje mit ne opgegaeve straol kan neet gemaak waere.

circle-invalid-center-or-through-points = Óngeldig middelpöntj of óngeldige doorgangspöntje van de circel.

circle-radius-center-with-multiple-points = De straol van ne circel mit opgegaeve middelpöntj door mie es 1 pöntj kan neet berekend waere.

circle-change-radius-non-numerical = De straol van ne circel mit neet-getalsmaotige doorgangspöntje kan neet verangerd waere

circle-radius-with-points-non-numerical = Ne circel door mie es ei pöntj mit ne opgegaeve straol kan zónger getalswaerde neet gemaak waere.

circle-change-center-non-numerical = 't Verangere van 't middelpöntj van ne circel door neet-getalsmaotige pöntje is neet gemaak.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Te weinig dimensies veur 't domein van de functie. 't Domein haet { $intervals } interval mer de functie haet { $inputs ->
            [one] { $inputs } invoer
           *[other] { $inputs } invoere
        }.
       *[other] Te weinig dimensies veur 't domein van de functie. 't Domein haet { $intervals } intervalle mer de functie haet { $inputs ->
            [one] { $inputs } invoer
           *[other] { $inputs } invoere
        }.
    }

function-domain-invalid-format = Óngeldig formaat veur 't domein van de functie.

function-ignoring-non-numerical =
    { $type ->
        [maximum] 't Neet-getalsmaotige maximum van de functie weurt genegeerd.
        [minimum] 't Neet-getalsmaotige minimum van de functie weurt genegeerd.
        [extremum] 't Neet-getalsmaotige extremum van de functie weurt genegeerd.
        [point] 't Neet-getalsmaotige pöntj van de functie weurt genegeerd.
        [slope] De neet-getalsmaotige helling van de functie weurt genegeerd.
       *[other] Neet-getalsmaotige { $type } van de functie weurt genegeerd.
    }

function-ignoring-empty =
    { $type ->
        [maximum] 't Laeg maximum van de functie weurt genegeerd.
        [minimum] 't Laeg minimum van de functie weurt genegeerd.
        [extremum] 't Laeg extremum van de functie weurt genegeerd.
        [point] 't Laeg pöntj van de functie weurt genegeerd.
       *[other] Laeg { $type } van de functie weurt genegeerd.
    }

function-points-too-close = De functie haet twie pöntje die te dèks bie-ein ligke. De functie kan neet bepaald waere.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Functie-iteraties zin allein muigelik wen 't aantal invoere geliek is aan 't aantal uutvoere. Dees functie haet { $inputs } invoer en { $outputs ->
            [one] { $outputs } uutvoer
           *[other] { $outputs } uutvoere
        }.
       *[other] Functie-iteraties zin allein muigelik wen 't aantal invoere geliek is aan 't aantal uutvoere. Dees functie haet { $inputs } invoere en { $outputs ->
            [one] { $outputs } uutvoer
           *[other] { $outputs } uutvoere
        }.
    }

## `<sequence>`

sequence-invalid-length = Óngeldige lengde van de riej.  Dee mót e neet-negatief gans getal zin.

sequence-invalid-step = Óngeldige stap van de riej.  Dee mót e getal zin veur e riej van 't type { $type }.

sequence-invalid-endpoint-number = Óngeldige "{ $attribute }" van e getallenriej.  Dee mót e getal zin.

sequence-invalid-endpoint-letters = Óngeldige "{ $attribute }" van e letterriej.  Dee mót e lettercombinatie zin.

sequence-invalid-endpoint = Óngeldige "{ $attribute }" van de riej.

select-from-sequence-coprime-not-numbers = coprime weurt genegeerd, wiel d'r gein getalle gekaoze waere

select-from-sequence-coprime-with-exclude-combinations = coprime weurt genegeerd, wiel excludeCombinations opgegaeve is

## Resolving a `target`

target-not-found = Óngeldige target veur `<{ $source }>`: 't doel is neet te vinge.

target-state-variable-not-found = Óngeldige target veur `<{ $source }>`: gein toestandsvariabele mit de naam "{ $property }" op e `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = De variabele van e `<odeSystem>` mote anges zin es de ónaafhankelike variabele.

ode-system-duplicate-variable-names = De rechterleje van de ODE kanne neet bepaald waere mit dobbel name van aafhankelike variabele.

ode-system-rhs-function-error = 't Rechterlid van de ODE kan neet bepaald waere.  Faeler bie 't make van de mathjs-functie.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ne hook tösje { $count } liene kan neet bepaald waere

angle-invalid-through-point = Óngeldig pöntj in de through van e `<angle>`

parabola-vertex-too-many-points = E parabool mit gegaeve top door mie es 1 pöntj is neet gemaak.

parabola-too-many-points = E parabool door mie es 3 pöntje is neet gemaak.

intersection-too-many-items = De doorsnee van mie es twie dinger is neet gemaak

## Other math components

ionic-compound-not-two-ions = Ionverbindinge mit get anges es twie ione zin neet gemaak.

ionic-compound-needs-cation-and-anion = Ionverbindinge zin allein gemaak veur ei kation en ei anion.

solve-equations-cannot-evaluate = De vergeliekung kan neet opgelos waere, wiel ze neet te berekene waor: { $equation }

math-operators-operand-number-required = Veur e wiskundige operand eruut te haole mót e operandNumber opgegaeve waere.

eigen-decomposition-failed = De eigewaerde van de matrix kóste neet berekend waere

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: de parameter { $parameters } kump neet in 't patroon veur, en zal dus ummer op e laeg plaatsj passe.
       *[other] `<matchesPattern>`: de parameters { $parameters } kómme neet in 't patroon veur, en zulle dus ummer op e laeg plaatsj passe.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" is neet te begriepe. De waerd mót none, medium, dense of twie positieve getalle mit e spatie dertösje zin, wie grid="1 0.5". D'r weurt gein roester getikend.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` haet e functie nudig mit { $expected ->
        [one] ein uutvoer, de helling y' op elk pöntj, wie `y - x`
       *[other] twie uutvoere, de vector op elk pöntj, wie `(y, -x)`
    }, mer de functie die gegaeve is haet { $found ->
        [one] { $found } uutvoer
       *[other] { $found } uutvoere
    }. { $alternative ->
        [none] D'r weurt niks getikend.
       *[other] `<{ $alternative }>` is de component veur dee functie. D'r weurt niks getikend.
    }

field-function-attribute-ignored-with-child = 't Kenmerk `function` weurt genegeerd, wiel de functie ouch binne de component gegaeve is; dee binne weurt gebruuk. Gaef de functie mer op ein van de twie meniere.

field-variables-ignored =
    `<{ $component }>`: 't kenmerk `variables` benuimt de variabele van e uutdrökking die rechstreeks binne de component gesjreve is. { $reason ->
        [function-child] De functie is hie gegaeve es e `<function>`-kindj, det zien eige variabele benuimt, dus `variables` weurt genegeerd.
       *[no-expression] Zoe'n uutdrökking is hie neet gegaeve, dus `variables` weurt genegeerd.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" weurt neet óngersteund in de prefigure-renderer; 't gedraag van de rechterpositie weurt gebruuk.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" weurt neet óngersteund in de prefigure-renderer; 't gedraag van de bovepositie weurt gebruuk.

prefigure-invalid-axis-bounds = `<graph>`: óngeldige asgrenze veur de prefigure-ómzetting; de standaard-bbox (-10,-10,10,10) weurt gebruuk.

prefigure-invalid-width = `<graph>`: óngeldige breide veur de prefigure-ómzetting; de standaardbreide 425 weurt gebruuk.

prefigure-invalid-aspect-ratio = `<graph>`: óngeldige aspectRatio veur de prefigure-ómzetting; de standaardverhouding 1 weurt gebruuk.

prefigure-grid-spacing-too-fine = `<graph>`: de roesteraafstandj is te fien veur de asgrenze; 't roester weurt in de prefigure-renderer weggelaote.

prefigure-annotations-not-rendered = `<graph>`: annotaties waere neet getuind wen de PreFigure-renderer neet gebruuk weurt.

multiple-annotations-children = Mie `<annotations>`-kinger gevónje in `<graph>`; alles op 't lèste nao weurt genegeerd.

## Referring to other components

copy-unrecognized-component-type = E ónbekind componenttype kan neet uutgebreid of gekopieerd waere: { $type }.

copy-prop-not-found = Eigesjap { $property } neet gevónje op e component van 't type { $component }

collect-no-source = Gein bron gevónje veur collect.

collect-invalid-component-type = Componente van 't type `<{ $component }>` kanne neet verzameld waere, wiel det gein geldig componenttype is.

reference-index-unavailable = Nao de index `{ $reference }` kan neet verweze waere

## `<callAction>`

component-action-unavailable = { $action } kan neet aangerope waere op de component `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = De gegaeves höbbe e óngeldige vörm.  De riejer höbbe óngeliek lengdes. Gevónje in componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = De gegaeves höbbe dobbel kolomname.  Gevónje in componentIdx :{ $componentIdx }

data-frame-missing-column-name = Bie de gegaeves ontbrik e kolomnaam.  Gevónje in componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = E award van dit antwoord steunt op 't versjikde antwoord van de answer-tag zelf, wat tot ónverwach gedraag leit.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` insjtelle op e `<answer>` binne ne container mit `sectionWideCheckWork` haet gein effek, wiel 't aantal poginge door de container bepaald weurt. Sjtel `maxNumAttempts` op de container in.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` insjtelle op ne container mit `sectionWideCheckWork` dee zelf binne ne angere container mit `sectionWideCheckWork` zit haet gein effek, wiel 't aantal poginge door de buutenste container bepaald weurt. Sjtel `maxNumAttempts` op de buutenste container in.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] 't Kenmerk { $attributes } haet gein effek zónger symbolicEquality.
       *[other] De kenmerke { $attributes } höbbe gein effek zónger symbolicEquality.
    }

answer-invalid-type = Óngeldig type veur answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Wiel de component `<{ $component }>` gein naam haet, kan ze neet es modulekenmerk gebruuk waere

module-attribute-name-already-defined = De component `<{ $component } name="{ $name }">` kan neet es kenmerk van e module gebruuk waere, wiel 't componenttype `<module>` al e kenmerk "{ $name }" haet.

conditional-content-condition-ignored = 't Kenmerk `condition` weurt genegeerd op e `<conditionalContent>`-component mit case- of else-kinger.

slider-markers-type-mismatch = 't Type van de markeringe kump neet euverein mit 't type van de sjuufregelaar.

pretzel-problem-needs-statement-and-answer = Óngeldige pretzel: eder `<problem>` mót ein `<statement>` en ein `<answer>` bevatte.

pretzel-circuit-first-problem-distractor = Óngeldige pretzel: bie mode="circuit" mag de ierste `<problem>` gein aafleijer zin.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Óngeldige waerd { $values } veur 't kenmerk `{ $attribute }`; dee weurt genegeerd.
       *[other] Óngeldige waerde { $values } veur 't kenmerk `{ $attribute }`; die waere genegeerd.
    }

attribute-must-be-references = Óngeldige waerd `{ $value }` veur 't kenmerk `{ $attribute }`. 't Kenmerk mót bestaon uut verwiezinge die mit e `$` beginne.

math-input-invalid-function-names = <mathInput>: óngeldige functienaam of -name genegeerd in { $attribute }: { $names }. 't Getuinde deil van edere naam mót minstens 2 tekes lank zin (letters of streepkes); e optioneel achtervoogsel `|<mathspeak-alternatief>` mag dernao kómme.

## Building components from the source

component-type-invalid = Óngeldig componenttype: `<{ $componentType }>`

attribute-repeated = 't Kenmerk { $attribute } mag neet herhaald waere.

attribute-invalid-for-component = Óngeldig kenmerk "{ $attribute }" veur e component van 't type `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Stieldefinisie { $styleNumber } haet te weinig contras veur { $context ->
        [text-on-background] de tekskleur taege de achtergróndjkleur
        [high-contrast] de huugcontraskleur taege 't canvas
        [line] de lienkleur taege 't canvas
        [marker] de markeringskleur taege 't canvas
       *[text-on-canvas] de tekskleur taege 't canvas
    }{ $mode ->
        [dark] { " (duustere modus)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; minstens { $threshold }:1 nudig).

style-definition-dark-mode-text-background-contrast =
    Ouch al gaef stieldefinisie { $styleNumber } kleure op die in de lichte modus genóg contras höbbe, de dao-uut aafgeleide kleure veur de duustere modus höbbe te weinig contras tösje teks en achtergróndj ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; minstens { $threshold }:1 nudig). { $suggestion ->
        [available] Veur genóg contras in de duustere modus: verhoeg of 't contras in de lichte modus (beveurbeeld { $lightAttribute }="{ $lightColor }"), of euversjrief de kleur veur de duustere modus (beveurbeeld { $darkAttribute }="{ $darkColor }").
       *[none] Veur genóg contras in de duustere modus: verhoeg 't contras in de lichte modus, of euversjrief de aafgeleide kleure mit textColorDarkMode en/of backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ouch al gaef stieldefinisie { $styleNumber } e tekskleur op die in de lichte modus genóg contras haet, de dao-uut aafgeleide tekskleur veur de duustere modus haet te weinig contras taege 't canvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; minstens { $threshold }:1 nudig). { $suggestion ->
        [available] Veur genóg contras in de duustere modus: verhoeg of 't contras in de lichte modus (beveurbeeld textColor="{ $lightColor }"), of euversjrief de kleur veur de duustere modus (beveurbeeld textColorDarkMode="{ $darkColor }").
       *[none] Veur genóg contras in de duustere modus: verhoeg 't contras in de lichte modus, of euversjrief de aafgeleide kleur mit textColorDarkMode.
    }

section-multiple-style-palettes = E sectie kan mer ein <stylePalette> kieze; de lèste weurt gebruuk.

## Unique variants

variant-num-to-select-not-non-negative-integer = de unieke variante van { $component } kanne neet bepaald waere, wiel numToSelect gein neet-negatief gans getal is.

variant-num-to-select-not-constant-number = de unieke variante van { $component } kanne neet bepaald waere, wiel numToSelect gein constant getal is.

variant-with-replacement-not-constant-boolean = de unieke variante van { $component } kanne neet bepaald waere, wiel withReplacement gein constante booleaanse waerd is.

variant-select-weight-disables-unique = Unieke variante veur select zin uutgesjakeld wen ein optie selectWeight of selectForVariants opgeef

variant-coprime-undetermined = de unieke variante van { $component } kanne neet bepaald waere, wiel neet vas te stelle is det coprime ummer vals is.

variant-attribute-not-constant = de unieke variante van { $component } kanne neet bepaald waere, wiel { $attribute } gein constante is.

variant-attribute-not-number = de unieke variante van { $component } kanne neet bepaald waere, wiel { $attribute } gein getal is.

variant-attribute-wrong-type-for-sequence =
    de unieke variante van { $component } van 't type { $type } kanne neet bepaald waere, wiel { $attribute } gein { $expected ->
        [letters-combination] lettercombinatie
        [math-expression] geldige wiskundige uutdrökking
        [integer] gans getal
       *[number] getal
    } is.

variant-length-not-integer = de unieke variante van { $component } kanne neet bepaald waere, wiel length gein gans getal is.

variant-sort-not-implemented = unieke variante van e { $component } mit sort zin neet gemaak

variant-exclude-combinations-not-implemented = unieke variante van e { $component } mit excludeCombinations zin neet gemaak

variant-math-exclude-not-implemented = unieke variante van e { $component } van 't type math mit exclude zin neet gemaak

variant-non-constant-exclude-not-implemented = unieke variante van e { $component } mit e neet-constante exclude zin neet gemaak

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: neet óngersteund in de prefigure-renderer van de grafiek; naokómmeling euvergeslage.

prefigure-descendant-invalid-geometry = { $subject }: neet-eindige of ónvolledige geometrie; naokómmeling euvergeslage.

prefigure-curve-label-omitted = { $subject }: naamkes waere neet óngersteund op ómgezatte krommelemente; naamke weggelaote.

prefigure-curve-unsupported-definition-type = { $subject }: neet-óngersteund definisietype '{ $definitionType }' veur de kromme; naokómmeling euvergeslage.

prefigure-region-flip-functions-unsupported = { $subject }: 't kenmerk flipFunctions op regionBetweenCurves weurt neet óngersteund; naokómmeling euvergeslage.

prefigure-region-non-formula-child = { $subject }: op regionBetweenCurves waere allein kindjfuncties van 't type formule óngersteund; naokómmeling euvergeslage.

prefigure-label-position-unsupported =
    { $subject }: neet-óngersteunde labelPosition '{ $labelPosition }' veur { $labelKind ->
        [line-family] e naamke uut de lienfamilie
       *[point] e pöntjnaamke
    }; de standaarduutlijning van PreFigure weurt gebruuk.

prefigure-fill-style-unsupported = { $subject }: de völstiel '{ $fillStyle }' weurt neet óngersteund door PreFigure; d'r weurt op e effe völling trökgevalle.

prefigure-line-style-unknown = { $subject }: ónbekinde lienstiel '{ $lineStyle }' weggelaote uut de PreFigure-uutvoer.

prefigure-marker-style-mapped-to-diamond = { $subject }: de markeringsstiel '{ $markerStyle }' weurt ómgezat nao de PreFigure-stiel 'diamond'.

prefigure-marker-style-unsupported = { $subject }: de markeringsstiel '{ $markerStyle }' weurt neet óngersteund door PreFigure; de standaardstiel weurt gebruuk.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: óngeldige `ref`; 't doel kan neet herleid waere. Annotatie weggelaote.

annotation-ref-multiple-targets = `<annotation>`: `ref` verwees nao mie doele; 't ierste weurt gebruuk.

annotation-ref-outside-graph = `<annotation>`: óngeldige `ref`; 't doel ligk buute de ómvattende grafiek. Annotatie weggelaote.

annotation-ref-unsupported-target = `<annotation>`: óngeldige `ref`; 't doel is gein óngersteund grafisch object in de prefigure-ómzetting. Annotatie weggelaote.

annotation-text-missing = `<annotation>`: `text` ontbrik of is laeg; d'r weurt laege teks uutgegaeve.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Circulaire aafhankelikheid ontdèk.
       *[other] Circulaire aafhankelikheid ontdèk woebie e `<{ $componentType }>`-component betrokke is.
    }

reference-no-referent = Gein doel gevónje veur de verwiezing: `{ $reference }`

reference-multiple-referents = Mie doele gevónje veur de verwiezing: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Óngeldig formaat veur 't kenmerk { $attribute } van `<{ $componentType }>`.

children-invalid = Óngeldige kinger veur `<{ $componentType }>`: óngeldige kinger gevónje: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Óngeldige waerd `{ $value }` veur 't kenmerk `{ $attribute }`; de waerd `{ $default }` weurt gebruuk

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML-versie { $version } neet gevónje.
       *[other] DoenetML-versie { $version } neet gevónje. D'r weurt trökgevalle op versie { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Óngeldige DoenetML: { $content }

parse-tag-missing-close-tag = Óngeldige DoenetML: de tag `{ $tag }` haet gein sloettag. D'r woor e zelfsloetende tag of e `</{ $tagName }>`-tag verwach.

parse-tag-error = Óngeldige DoenetML: faeler in de tag `<{ $tagName }>`

parse-attribute-missing-value = Óngeldige DoenetML: bie 't kenmerk `{ $attribute }` liek e waerd te ontbraeke.

parse-attribute-invalid = Óngeldige DoenetML: óngeldig kenmerk `{ $attribute }`

parse-attribute-value-invalid = Óngeldige DoenetML: óngeldige kenmerkwaerd `{ $value }`

parse-attribute-value-quote-mismatch = Óngeldige DoenetML: óngeldige kenmerkwaerd `{ $value }`. De aanhaolingstekes kómme neet euverein. D'r liek e `{ $quote }` te ontbraeke

parse-open-tag-name-missing = Óngeldige DoenetML: e tag zónger tagnaam gevónje, beveurbeeld `<`

parse-tag-not-closed = Óngeldige DoenetML: de tag `{ $tag }` is neet gesloete (d'r liek e `>` te ontbraeke).

parse-self-closing-tag-name-missing = Óngeldige DoenetML: e tag zónger tagnaam gevónje `<{ $content }>`

parse-self-closing-tag-not-closed = Óngeldige DoenetML: de tag `{ $tag }` is neet gesloete (`/>` liek te ontbraeke).

parse-tag-invalid-attributes = Óngeldige DoenetML: de tag `{ $tag }` deug neet. Muigelik haet dee verkierde kenmerke.

parse-close-tag-name-missing = Óngeldige DoenetML: e sloettag zónger tagnaam gevónje, beveurbeeld `</`

parse-attribute-value-unquoted = Kenmerkwaerde mote tösje aanhaolingstekes staon: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Óngeldige DoenetML: sloettag `{ $tag }` gevónje, mer gein biebehurende openingstag

parse-close-tag-mismatched = Óngeldige DoenetML: sloettag dee neet euverein kump. Verwach `</{ $expected }>`. Gevónje `{ $found }`

parser-node-unconvertible = Knoop { $node } kós neet nao e Dast-knoop ómgezat waere.

## Names

name-attribute-invalid =
    Óngeldig kenmerk name='{ $name }'. { $reason ->
        [characters] Name maege allein letters, ciefers, lieg streepkes of koppeltekes bevatte.
       *[start] Name mote mit e letter beginne.
    }

component-name-invalid-start = Óngeldige componentnaam "{ $name }". Name mote mit e letter beginne.

## `<answer>` sugar

answer-video-watched-missing-video = E answer van 't type videoWatched mót e video-kenmerk höbbe

answer-video-watched-video-not-reference = E answer van 't type videoWatched mót e video-kenmerk höbbe det e verwiezing is

answer-name-not-single-text = 't name-kenmerk van e answer mót krek ei tekskindj höbbe

## Referencing another document

external-doenetml-recursion-limit = Externe DoenetML kós neet opgehaold waere door te veul nivo's van recursie. Is d'r e circulaire verwiezing?

external-doenetml-unavailable = DoenetML kós neet opgehaold waere van { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Óngeldige DoenetML opgehaold van { $attribute }="{ $uri }": dee kwaam neet euverein mit 't componenttype "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] 't Kenmerk `{ $from }` is verouwerd; gebruuk in plaatsj dervan `{ $to }`.
       *[other] [deprecation] 't Kenmerk `{ $from }` op `<{ $component }>` is verouwerd; gebruuk in plaatsj dervan `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] 't Kenmerk `{ $from }` is verouwerd en weurt genegeerd, wiel `{ $to }` ouch opgegaeve is.
       *[other] [deprecation] 't Kenmerk `{ $from }` op `<{ $component }>` is verouwerd en weurt genegeerd, wiel `{ $to }` ouch opgegaeve is.
    }

deprecated-attribute-ignored = [deprecation] 't Kenmerk `{ $attribute }` op `<{ $component }>` is verouwerd en weurt genegeerd.

deprecated-attribute-to-child = [deprecation] 't Kenmerk `{ $attribute }` op `<{ $component }>` is verouwerd; gebruuk in plaatsj dervan e `<{ $child }>`-kindj.

deprecated-attribute-value-renamed = [deprecation] De waerd `{ $value }` van 't kenmerk `{ $attribute }` op `<{ $component }>` is verouwerd; gebruuk in plaatsj dervan `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` kan allein Ingelsj in 't miervoud zètte, dus in e document in 't { $locale } bliuf de teks ónverangerd. Sjrief de miervoudsvörm rechstreeks, of gaef dee op mit 't kenmerk `pluralForm`.


## Checking against the schema

schema-element-unrecognized = 't Element `<{ $tag }>` is gein bekind Doenet-element.

schema-element-not-allowed-at-root = 't Element `<{ $tag }>` is neet toegestaon in de wortel van 't document.

schema-element-not-allowed-inside = 't Element `<{ $tag }>` is neet toegestaon binne `<{ $parent }>`.

schema-attribute-unrecognized = 't Element `<{ $tag }>` haet gein kenmerk mit de naam `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] 't Kenmerk `{ $attribute }` van 't element `<{ $tag }>` mót e lies zin woevan eder item ein van dees is: { $allowed }
       *[other] 't Kenmerk `{ $attribute }` van 't element `<{ $tag }>` mót ein van dees zin: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Óngeldige variantnaam veur select.  De variantnaam { $variantName } kump veur in { $numOptions } opties, mer 't aantal veur te kieze is { $numToSelect }.

select-variant-name-without-options = D'r zin variante opgegaeve veur select, mer gein opties veur de muigelike variantnaam: { $variantName }.

select-variant-name-not-possible = De veur select opgegaeve variantnaam { $variantName } is gein muigelike variantnaam.

select-too-few-options = { $numToSelect } componente kanne neet uut mer { $numOptions } gekaoze waere.

select-from-sequence-too-few-values = { $numToSelect } waerde kanne neet uut e riej mit de lengde { $length } gekaoze waere.

select-from-sequence-indices-count-mismatch = 't Aantal veur select opgegaeve indices mót euverein kómme mit 't aantal veur te kieze

select-from-sequence-indices-not-integers = Alle veur select opgegaeve indices mote ganse getalle zin

select-from-sequence-index-excluded = Ne opgegaeve index van selectfromsequence woor uutgesloete

select-from-sequence-indices-excluded-combination = De opgegaeve indices van selectfromsequence woore e uutgesloete combinatie

select-from-sequence-coprime-not-positive-integers = Óngerling óndeilbare combinaties kanne neet gekaoze waere, wiel d'r gein positieve ganse getalle gekaoze waere.

select-from-sequence-coprime-common-factor = Óngerling óndeilbare getalle kanne neet gekaoze waere. Alle muigelike waerde höbbe ne gemeinsjappelike factor. (De opgegaeve waerde van "from" of "to" mote óngerling óndeilbaar zin mit "step".)

select-from-sequence-coprime-single-number = Óngerling óndeilbare combinaties kanne neet gekaoze waere uut ei einkel getal det gein 1 is.

select-from-sequence-excluded-too-many-combinations = Mie es 70% van de combinaties is uutgesloete in selectFromSequence

select-from-sequence-coprime-none-found = Óngerling óndeilbare getalle kóste neet gekaoze waere. Alle muigelike waerde höbbe ne gemeinsjappelike factor.

select-from-sequence-too-few-unique-values = { $numToSelect } unieke waerde kanne neet uut e riej mit de lengde { $numPossibleValues } gekaoze waere

select-prime-numbers-too-few-values = { $numToSelect } waerde kanne neet uut e lies mit { $numValues } priemgetalle gekaoze waere

select-prime-numbers-values-count-mismatch = 't Aantal veur select opgegaeve waerde mót euverein kómme mit 't aantal veur te kieze

select-prime-numbers-values-not-prime = Alle veur select prime number opgegaeve waerde mote in de lies mit priemgetalle staon

select-prime-numbers-values-excluded-combination = De opgegaeve waerde van selectPrimeNumbers woore e uutgesloete combinatie

select-prime-numbers-excluded-too-many-combinations = Mie es 70% van de combinaties is uutgesloete in selectPrimeNumbers

select-random-combination-fluke = Door e uterst ónwaarsjienlik toeval kós gein combinatie van willekäörige waerde gekaoze waere

select-random-value-fluke = Door e uterst ónwaarsjienlik toeval kós gein willekäörige waerd gekaoze waere

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` weurt neet binne de wiskunde getikend; de uutdrökking weurt gezat wie ze woor veurdet invoervelder deri kóste. { $reason ->
        [not-inline] Allein e `inline` keuze-invoerveld pas binne e uutdrökking; zónger `inline` is 't e blok mit knuipkes.
        [expanded] E `expanded` teks-invoerveld is e vek mit mie regele, en det is te groet veur binne e uutdrökking.
        [on-graph] Op e grafiek weurt de uutdrökking es ein plaetje getikend, en dao is gein plaatsj veur e bedeiningselement.
       *[relative-width] De `width` is relatief (e percentage of `em`), en dao is binne e uutdrökking niks veur te maete. Gaef de breide in absolute einheide, wie `px`.
    }
