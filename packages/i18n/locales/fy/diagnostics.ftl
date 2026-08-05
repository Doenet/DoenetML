# Western Frisian diagnostics. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
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
# ignored" against "are ignored" — Frisian marks it on the verb too, so those
# selects are kept.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } wurdt negearre as beide einpunten opjûn binne
       *[other] { $attributes } wurde negearre as beide einpunten opjûn binne
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } wurdt negearre as sawol in einpunt as in middelpunt opjûn binne
       *[other] { $attributes } wurde negearre as sawol in einpunt as in middelpunt opjûn binne
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset hat gjin effekt sûnder middelpunt

## `<line>`

line-points-undetermined-dimensions = Line troch punten mei ûnbepaalde dimensjes.

line-points-too-few-dimensions = De line moat troch punten fan op syn minst twa dimensjes gean.

line-points-depend-on-variables = De line giet troch punten dy't fan fariabelen ôfhinklik binne: { $variables }.

line-equation-invalid-format = Unjildich formaat foar de fergeliking fan in line yn 'e fariabelen { $variable1 } en { $variable2 }.

## `<ray>`

ray-overprescribed-through = De healline is fêstlein troch through, endpoint en direction. It opjûne through wurdt negearre.

ray-dimension-mismatch = numDimensions komt net oerien yn ray.

## `<vector>`

vector-overprescribed-head = De fektor is fêstlein troch head, tail en displacement. It opjûne head wurdt negearre.

vector-dimension-mismatch = numDimensions komt net oerien yn vector.

## Attracting and constraining

attract-to-without-nearest-point = Der kin net oanlutsen wurde nei in `<{ $component }>`, om't dy gjin nearestPoint-tastânsfariabele hat.

constrain-to-without-nearest-point = Der kin net beheind wurde ta in `<{ $component }>`, om't dy gjin nearestPoint-tastânsfariabele hat.

constrain-to-interior-without-nearest-point = Der kin net beheind wurde ta de binnenkant fan in `<{ $component }>`, om't dy gjin nearestPoint-tastânsfariabele hat.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition wurdt negearre by in choiceInput dy't net inline is

## Ordering children by index

choice-input-indices-count-mismatch = De yndeksen dy't foar choiceInput opjûn binne wurde negearre, om't it tal yndeksen net oerienkomt mei it tal choice-bern.

pretzel-indices-count-mismatch = De yndeksen dy't foar problem opjûn binne wurde negearre, om't it tal yndeksen net oerienkomt mei it tal problem-bern.

shuffle-indices-count-mismatch = De yndeksen dy't foar shuffle opjûn binne wurde negearre, om't it tal yndeksen net oerienkomt mei it tal komponinten.

indices-ignored-out-of-range = De yndeksen dy't foar { $component } opjûn binne wurde negearre, om't guon yndeksen bûten it berik lizze.

pretzel-indices-repeated = De yndeksen dy't foar pretzel opjûn binne wurde negearre, om't guon yndeksen werhelle wurde.

pretzel-circuit-first-index = De yndeksen dy't foar pretzel yn mode="circuit" opjûn binne wurde negearre, om't de earste yndeks 1 wêze moat.

## `<shuffle>` and `<sort>`

string-children-need-type = Om `<{ $component }>` mei tekstbern wurkje te litten, moat in attribút `type` opjûn wêze.

invalid-type-defaulting-to-math = Unjildich type { $type } foar de komponint { $component }. It moat math, text, number of boolean wêze. It wurdt op math set.

string-not-valid-component-to-arrange = De tekst "{ $value }" is gjin jildige komponint foar { $component }. Wurdt negearre.

## Types and variables

invalid-type-defaulting-to-number = Unjildich type { $type }, type wurdt op number set.

invalid-variable-value = Unjildige wearde fan in fariabele: `{ $value }`

## Variants

variant-index-must-be-number = De fariantyndeks { $index } moat in getal wêze

variant-index-must-be-integer = De fariantyndeks { $index } moat in hiel getal wêze

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` is net útfierd foar absolute maten. De breedten wurde op relatyf set.

side-by-side-absolute-margins = `<{ $component }>` is net útfierd foar absolute maten. De marzjes wurde op relatyf set.

side-by-side-no-block-child = Unjildige `<{ $component }>`: dy moat op syn minst ien blokbern hawwe.

## `<label>`

label-for-ignored-on-graphical = It attribút `for` op in grafysk `<label>` wurdt negearre.

label-for-must-resolve-to-one = It attribút `for` op `<label>` moat nei krekt ien komponint ferwize.

label-for-unresolved = It attribút `for` op `<label>` koe net nei in komponint oplost wurde.

label-for-answer-with-authored-inputs = It attribút `for` op `<label>` ferwiist nei in `<answer>` mei sels skreaune ynfierfjilden; ferwiis leaver streekrjocht nei it fjild.

label-for-answer-without-input = It attribút `for` op `<label>` ferwiist nei in `<answer>` sûnder ynfierfjild om te beneamen.

label-for-must-reference-input-or-answer = It attribút `for` op `<label>` moat nei in ynfierfjild of nei in answer ferwize.

## Accessibility

accessibility-short-description-or-decorative = Foar de tagonklikens moat `<{ $component }>` in koarte beskriuwing hawwe of as dekoratyf opjûn wêze.

accessibility-video-short-description = Foar de tagonklikens moat `<video>` in koarte beskriuwing hawwe.

accessibility-input-short-description-or-label = Foar de tagonklikens moat `<{ $component }>` in koarte beskriuwing of in namme hawwe.

accessibility-answer-input-short-description-or-label = Foar de tagonklikens moat in `<answer>` dy't in ynfierfjild makket in koarte beskriuwing of in namme hawwe.

accessibility-short-description-contains-math = Koarte beskriuwings moatte gjin wiskundige komponinten lykas `<{ $component }>` befetsje. Skriuw de wiskunde mei wurden út.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } hat net genôch kontrast foar de tekst fan 'e kop (donkere modus) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; op syn minst { $threshold }:1 nedich).
       *[other] { $colorName } hat net genôch kontrast foar de tekst fan 'e kop ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; op syn minst { $threshold }:1 nedich).
    }

## `<circle>`

circle-through-points-non-numerical = In `<circle>` troch { $count } punten is net útfierd as de punten gjin numerike wearden hawwe.

circle-too-many-through-points = In sirkel troch mear as 3 punten kin net berekkene wurde.

circle-overprescribed-radius-center-points = In sirkel mei opjûne straal, middelpunt en trochgeande punten kin net berekkene wurde.

circle-center-with-multiple-points = In sirkel mei opjûn middelpunt troch mear as 1 punt kin net berekkene wurde.

circle-radius-too-small = De sirkel kin net berekkene wurde: om't de ôfstân tusken de twa punten { $distance } is, is de opjûne straal { $radius } te lyts.

circle-radius-with-many-points = In sirkel troch mear as twa punten mei in opjûne straal kin net makke wurde.

circle-invalid-center-or-through-points = Unjildich middelpunt of ûnjildige trochgeande punten fan 'e sirkel.

circle-radius-center-with-multiple-points = De straal fan in sirkel mei opjûn middelpunt troch mear as 1 punt kin net berekkene wurde.

circle-change-radius-non-numerical = De straal fan in sirkel mei net-numerike punten kin net feroare wurde

circle-radius-with-points-non-numerical = In sirkel troch mear as ien punt mei in opjûne straal kin net makke wurde as de wearden net numeryk binne.

circle-change-center-non-numerical = It feroarjen fan it middelpunt fan in sirkel troch punten mei net-numerike wearden is net útfierd.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Net genôch dimensjes foar it domein fan 'e funksje. It domein hat { $intervals } ynterval, mar de funksje hat { $inputs ->
            [one] { $inputs } ynfier
           *[other] { $inputs } ynfieren
        }.
       *[other] Net genôch dimensjes foar it domein fan 'e funksje. It domein hat { $intervals } yntervallen, mar de funksje hat { $inputs ->
            [one] { $inputs } ynfier
           *[other] { $inputs } ynfieren
        }.
    }

function-domain-invalid-format = Unjildich formaat foar it domein fan 'e funksje.

function-ignoring-non-numerical =
    { $type ->
        [maximum] It net-numerike maksimum fan 'e funksje wurdt negearre.
        [minimum] It net-numerike minimum fan 'e funksje wurdt negearre.
        [extremum] It net-numerike ekstremum fan 'e funksje wurdt negearre.
        [point] It net-numerike punt fan 'e funksje wurdt negearre.
        [slope] De net-numerike helling fan 'e funksje wurdt negearre.
       *[other] It net-numerike { $type } fan 'e funksje wurdt negearre.
    }

function-ignoring-empty =
    { $type ->
        [maximum] It lege maksimum fan 'e funksje wurdt negearre.
        [minimum] It lege minimum fan 'e funksje wurdt negearre.
        [extremum] It lege ekstremum fan 'e funksje wurdt negearre.
        [point] It lege punt fan 'e funksje wurdt negearre.
       *[other] It lege { $type } fan 'e funksje wurdt negearre.
    }

function-points-too-close = De funksje befettet twa punten dy't te ticht byinoar lizze. De funksje kin net definiearre wurde.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Iteraasjes fan in funksje binne allinnich mooglik as it tal ynfieren gelyk is oan it tal útfieren. Dizze funksje hat { $inputs } ynfier en { $outputs ->
            [one] { $outputs } útfier
           *[other] { $outputs } útfieren
        }.
       *[other] Iteraasjes fan in funksje binne allinnich mooglik as it tal ynfieren gelyk is oan it tal útfieren. Dizze funksje hat { $inputs } ynfieren en { $outputs ->
            [one] { $outputs } útfier
           *[other] { $outputs } útfieren
        }.
    }

## `<sequence>`

sequence-invalid-length = Unjildige lingte fan 'e rige. Moat in net-negatyf hiel getal wêze.

sequence-invalid-step = Unjildige stap fan 'e rige. Moat in getal wêze foar in rige fan it type { $type }.

sequence-invalid-endpoint-number = Unjildige "{ $attribute }" fan in getalrige. Moat in getal wêze.

sequence-invalid-endpoint-letters = Unjildige "{ $attribute }" fan in letterrige. Moat in kombinaasje fan letters wêze.

sequence-invalid-endpoint = Unjildige "{ $attribute }" fan 'e rige.

select-from-sequence-coprime-not-numbers = coprime wurdt negearre, om't der gjin getallen keazen wurde

select-from-sequence-coprime-with-exclude-combinations = coprime wurdt negearre, om't excludeCombinations opjûn is

## Resolving a `target`

target-not-found = Unjildich target foar `<{ $source }>`: it doel kin net fûn wurde.

target-state-variable-not-found = Unjildich target foar `<{ $source }>`: der is gjin tastânsfariabele mei de namme "{ $property }" op in `<{ $component }>` fûn.

## `<odeSystem>`

ode-system-variables-match-independent = De fariabelen fan `<odeSystem>` moatte oars wêze as de ûnôfhinklike fariabele.

ode-system-duplicate-variable-names = De rjochterlidfunksjes fan 'e ODE kinne net mei werhelle nammen fan ôfhinklike fariabelen definiearre wurde.

ode-system-rhs-function-error = De rjochterlidfunksje fan 'e ODE kin net definiearre wurde. Flater by it meitsjen fan 'e mathjs-funksje.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = In hoeke tusken { $count } linen kin net definiearre wurde

angle-invalid-through-point = Unjildich punt yn it through fan `<angle>`

parabola-vertex-too-many-points = In parabool mei top troch mear as 1 punt is net útfierd.

parabola-too-many-points = In parabool troch mear as 3 punten is net útfierd.

intersection-too-many-items = In trochsneed fan mear as twa objekten is net útfierd

## Other math components

ionic-compound-not-two-ions = In ioanyske ferbining is allinnich foar twa ioanen útfierd.

ionic-compound-needs-cation-and-anion = In ioanyske ferbining is allinnich foar ien kation en ien anion útfierd.

solve-equations-cannot-evaluate = De fergeliking kin net oplost wurde, om't dy net útrekkene wurde koe: { $equation }

math-operators-operand-number-required = By it útlêzen fan in wiskundige operand moat in operandNumber opjûn wêze.

eigen-decomposition-failed = De eigenwearden fan 'e matriks koene net berekkene wurde

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: de parameter { $parameters } komt net yn it patroan foar, dus dy sil altyd op wat leechs passe.
       *[other] `<matchesPattern>`: de parameters { $parameters } komme net yn it patroan foar, dus dy sille altyd op wat leechs passe.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" kin net begrepen wurde. It moat none, medium, dense of twa positive getallen skieden troch in spaasje wêze, bygelyks grid="1 0.5". Der wurdt gjin roaster tekene.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" wurdt yn 'e prefigure-renderer net stipe; it gedrach fan 'e rjochterposysje wurdt brûkt.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" wurdt yn 'e prefigure-renderer net stipe; it gedrach fan 'e boppeposysje wurdt brûkt.

prefigure-invalid-axis-bounds = `<graph>`: ûnjildige asgrinzen foar de omsetting nei prefigure; de standert-bbox (-10,-10,10,10) wurdt brûkt.

prefigure-invalid-width = `<graph>`: ûnjildige breedte foar de omsetting nei prefigure; de standertbreedte 425 wurdt brûkt.

prefigure-invalid-aspect-ratio = `<graph>`: ûnjildige aspectRatio foar de omsetting nei prefigure; de standertferhâlding 1 wurdt brûkt.

prefigure-grid-spacing-too-fine = `<graph>`: de roasterôfstân is te fyn foar de asgrinzen; it roaster wurdt yn 'e prefigure-renderer weilitten.

prefigure-annotations-not-rendered = `<graph>`: annotaasjes wurde net toand as de PreFigure-renderer net brûkt wurdt.

multiple-annotations-children = Mear as ien `<annotations>`-bern fûn yn `<graph>`; alle op it lêste nei wurde negearre.

## Referring to other components

copy-unrecognized-component-type = In ûnbekend komponinttype kin net útwreide of kopiearre wurde: { $type }.

copy-prop-not-found = De eigenskip { $property } is net fûn op in komponint fan it type { $component }

collect-no-source = Gjin boarne foar collect fûn.

collect-invalid-component-type = Komponinten fan it type `<{ $component }>` kinne net sammele wurde, om't dat in ûnjildich komponinttype is.

reference-index-unavailable = Der kin net nei de yndeks `{ $reference }` ferwiisd wurde

## `<callAction>`

component-action-unavailable = { $action } kin net oanroppen wurde op 'e komponint `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = De gegevens hawwe in ûnjildige foarm. De rigen hawwe ferskillende lingten. Fûn yn componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = De gegevens hawwe werhelle kolomnammen. Fûn yn componentIdx :{ $componentIdx }

data-frame-missing-column-name = De gegevens misse in kolomnamme. Fûn yn componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = In award foar dit antwurd is basearre op it eigen ynstjoerde antwurd fan 'e answer-tach, wat ta ûnferwacht gedrach liede sil.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` op in `<answer>` binnen in kontener mei `sectionWideCheckWork` sette hat gjin effekt, om't it tal besykjen troch de kontener stjoerd wurdt. Set `maxNumAttempts` op 'e kontener.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` sette op in kontener mei `sectionWideCheckWork` dy't binnen in oare kontener mei `sectionWideCheckWork` leit hat gjin effekt, om't it tal besykjen troch de bûtenste kontener stjoerd wurdt. Set `maxNumAttempts` op 'e bûtenste kontener.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] It attribút { $attributes } hat gjin effekt sûnder symbolicEquality.
       *[other] De attributen { $attributes } hawwe gjin effekt sûnder symbolicEquality.
    }

answer-invalid-type = Unjildich type foar it antwurd: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Om't de komponint `<{ $component }>` gjin namme hat, kin dy net as attribút fan in module brûkt wurde

module-attribute-name-already-defined = De komponint `<{ $component } name="{ $name }">` kin net as attribút foar in module brûkt wurde, om't it komponinttype `<module>` al in attribút "{ $name }" definiearre hat.

conditional-content-condition-ignored = It attribút `condition` wurdt negearre op in `<conditionalContent>`-komponint mei case- of else-bern.

slider-markers-type-mismatch = It type fan 'e markearrings komt net oerien mei it type fan 'e skúfregel.

pretzel-problem-needs-statement-and-answer = Unjildige pretzel: elke `<problem>` moat ien `<statement>` en ien `<answer>` befetsje.

pretzel-circuit-first-problem-distractor = Unjildige pretzel: yn mode="circuit" kin de earste `<problem>` gjin ôfliedersopjefte wêze.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Unjildige wearde { $values } foar it attribút `{ $attribute }`; wurdt negearre.
       *[other] Unjildige wearden { $values } foar it attribút `{ $attribute }`; wurde negearre.
    }

attribute-must-be-references = Unjildige wearde `{ $value }` foar it attribút `{ $attribute }`. It attribút moat út ferwizings bestean dy't mei in `$` begjinne.

math-input-invalid-function-names = <mathInput>: ûnjildige funksjenammen yn { $attribute } binne negearre: { $names }. It werjefte-diel fan elke namme moat op syn minst 2 tekens lang wêze (letters of keppelstreekjes); dêrnei mei in opsjoneel efterheaksel `|<mathspeak alternatyf>` folgje.

## Building components from the source

component-type-invalid = Unjildich komponinttype: `<{ $componentType }>`

attribute-repeated = It attribút { $attribute } kin net werhelle wurde.

attribute-invalid-for-component = Unjildich attribút "{ $attribute }" foar in komponint fan it type `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    De styldefinysje { $styleNumber } hat net genôch kontrast foar { $context ->
        [text-on-background] de tekstkleur tsjin de eftergrûnkleur
        [high-contrast] de kleur mei heech kontrast tsjin it tekenflak
        [line] de linekleur tsjin it tekenflak
        [marker] de markearringskleur tsjin it tekenflak
       *[text-on-canvas] de tekstkleur tsjin it tekenflak
    }{ $mode ->
        [dark] { " (donkere modus)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; op syn minst { $threshold }:1 nedich).

style-definition-dark-mode-text-background-contrast =
    Al hat de styldefinysje { $styleNumber } kleuren opjûn dy't yn 'e ljochte modus genôch kontrast jouwe, de dêrfan ôflate kleuren foar de donkere modus hawwe net genôch kontrast fan 'e tekstkleur tsjin de eftergrûnkleur ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; op syn minst { $threshold }:1 nedich). { $suggestion ->
        [available] Om yn 'e donkere modus genôch kontrast te garandearjen, ferheegje of it kontrast yn 'e ljochte modus (bygelyks { $lightAttribute }="{ $lightColor }") of oerskriuw de kleur foar de donkere modus (bygelyks { $darkAttribute }="{ $darkColor }").
       *[none] Om yn 'e donkere modus genôch kontrast te garandearjen, ferheegje it kontrast yn 'e ljochte modus of oerskriuw de ôflate kleuren mei textColorDarkMode en/of backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Al hat de styldefinysje { $styleNumber } in tekstkleur opjûn dy't yn 'e ljochte modus genôch kontrast jout, de dêrfan ôflate tekstkleur foar de donkere modus hat net genôch kontrast tsjin it tekenflak ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; op syn minst { $threshold }:1 nedich). { $suggestion ->
        [available] Om yn 'e donkere modus genôch kontrast te garandearjen, ferheegje of it kontrast yn 'e ljochte modus (bygelyks textColor="{ $lightColor }") of oerskriuw de kleur foar de donkere modus (bygelyks textColorDarkMode="{ $darkColor }").
       *[none] Om yn 'e donkere modus genôch kontrast te garandearjen, ferheegje it kontrast yn 'e ljochte modus of oerskriuw de ôflate kleur mei textColorDarkMode.
    }

section-multiple-style-palettes = In haadstik kin mar ien <stylePalette> kieze; de lêste wurdt brûkt.

## Unique variants

variant-num-to-select-not-non-negative-integer = de unike farianten fan { $component } kinne net bepaald wurde, om't numToSelect gjin net-negatyf hiel getal is.

variant-num-to-select-not-constant-number = de unike farianten fan { $component } kinne net bepaald wurde, om't numToSelect gjin konstant getal is.

variant-with-replacement-not-constant-boolean = de unike farianten fan { $component } kinne net bepaald wurde, om't withReplacement gjin konstante boolean is.

variant-select-weight-disables-unique = Unike farianten foar select binne útskeakele as in opsje in selectWeight of selectForVariants opjûn hat

variant-coprime-undetermined = de unike farianten fan { $component } kinne net bepaald wurde, om't net fêststeld wurde kin dat coprime altyd falsk is.

variant-attribute-not-constant = de unike farianten fan { $component } kinne net bepaald wurde, om't { $attribute } net konstant is.

variant-attribute-not-number = de unike farianten fan { $component } kinne net bepaald wurde, om't { $attribute } gjin getal is.

variant-attribute-wrong-type-for-sequence =
    de unike farianten fan { $component } fan it type { $type } kinne net bepaald wurde, om't { $attribute } gjin { $expected ->
        [letters-combination] kombinaasje fan letters
        [math-expression] jildige wiskundige útdrukking
        [integer] hiel getal
       *[number] getal
    } is.

variant-length-not-integer = de unike farianten fan { $component } kinne net bepaald wurde, om't length gjin hiel getal is.

variant-sort-not-implemented = unike farianten fan in { $component } mei sort binne net útfierd

variant-exclude-combinations-not-implemented = unike farianten fan in { $component } mei excludeCombinations binne net útfierd

variant-math-exclude-not-implemented = unike farianten fan in { $component } fan it type math mei exclude binne net útfierd

variant-non-constant-exclude-not-implemented = unike farianten fan in { $component } mei in net-konstante exclude binne net útfierd

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: wurdt yn 'e prefigure-renderer fan 'e grafyk net stipe; de neikommeling wurdt oerslein.

prefigure-descendant-invalid-geometry = { $subject }: net-einige of ûnfolsleine geometry; de neikommeling wurdt oerslein.

prefigure-curve-label-omitted = { $subject }: nammen wurde op omsette kromme-eleminten net stipe; de namme wurdt weilitten.

prefigure-curve-unsupported-definition-type = { $subject }: net-stipe type kromme-funksjedefinysje '{ $definitionType }'; de neikommeling wurdt oerslein.

prefigure-region-flip-functions-unsupported = { $subject }: net-stipe attribút flipFunctions op regionBetweenCurves; de neikommeling wurdt oerslein.

prefigure-region-non-formula-child = { $subject }: op regionBetweenCurves wurde allinnich bernfunksjes stipe dy't troch in formule definiearre binne; de neikommeling wurdt oerslein.

prefigure-label-position-unsupported =
    { $subject }: net-stipe labelPosition '{ $labelPosition }' foar { $labelKind ->
        [line-family] in namme út 'e linefamylje
       *[point] in puntnamme
    }; de standertútlining fan PreFigure wurdt brûkt.

prefigure-fill-style-unsupported = { $subject }: de folstyl '{ $fillStyle }' wurdt troch PreFigure net stipe; der wurdt op in folle folling weromfallen.

prefigure-line-style-unknown = { $subject }: ûnbekende linestyl '{ $lineStyle }' is út 'e PreFigure-útfier weilitten.

prefigure-marker-style-mapped-to-diamond = { $subject }: de markearringsstyl '{ $markerStyle }' is op 'e PreFigure-styl 'diamond' ôfbylde.

prefigure-marker-style-unsupported = { $subject }: de markearringsstyl '{ $markerStyle }' wurdt troch PreFigure net stipe; de standertstyl wurdt brûkt.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ûnjildige `ref`; it doel kin net oplost wurde. De annotaasje wurdt weilitten.

annotation-ref-multiple-targets = `<annotation>`: `ref` is nei meardere doelen oplost; it earste doel wurdt brûkt.

annotation-ref-outside-graph = `<annotation>`: ûnjildige `ref`; it doel leit bûten de omhulzende grafyk. De annotaasje wurdt weilitten.

annotation-ref-unsupported-target = `<annotation>`: ûnjildige `ref`; it doel is gjin stipe grafysk objekt yn 'e prefigure-omsetting. De annotaasje wurdt weilitten.

annotation-text-missing = `<annotation>`: `text` ûntbrekt of is leech; der wurdt lege tekst útjûn.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] In sirkelfoarmige ôfhinklikens is ûntdutsen.
       *[other] In sirkelfoarmige ôfhinklikens mei in `<{ $componentType }>`-komponint is ûntdutsen.
    }

reference-no-referent = Gjin doel fûn foar de ferwizing: `{ $reference }`

reference-multiple-referents = Mear as ien doel fûn foar de ferwizing: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Unjildich formaat foar it attribút { $attribute } fan `<{ $componentType }>`.

children-invalid = Unjildige bern foar `<{ $componentType }>`: ûnjildige bern fûn: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Unjildige wearde `{ $value }` foar it attribút `{ $attribute }`, de wearde `{ $default }` wurdt brûkt

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] De DoenetML-ferzje { $version } is net fûn.
       *[other] De DoenetML-ferzje { $version } is net fûn. Der wurdt op ferzje { $fallback } weromfallen
    }

## Reading the DoenetML

parse-invalid-doenetml = Unjildige DoenetML: { $content }

parse-tag-missing-close-tag = Unjildige DoenetML: de tach `{ $tag }` hat gjin slutende tach. Ferwachte waard in selsslutende tach of in `</{ $tagName }>`-tach.

parse-tag-error = Unjildige DoenetML: flater yn 'e tach `<{ $tagName }>`

parse-attribute-missing-value = Unjildige DoenetML: it ûnjildige attribút `{ $attribute }` liket in wearde te missen.

parse-attribute-invalid = Unjildige DoenetML: ûnjildich attribút `{ $attribute }`

parse-attribute-value-invalid = Unjildige DoenetML: ûnjildige attribútwearde `{ $value }`

parse-attribute-value-quote-mismatch = Unjildige DoenetML: ûnjildige attribútwearde `{ $value }`. De oanhellingstekens komme net oerien. Der liket in `{ $quote }` te ûntbrekken

parse-open-tag-name-missing = Unjildige DoenetML: in tach sûnder namme fûn, bygelyks `<`

parse-tag-not-closed = Unjildige DoenetML: de tach `{ $tag }` is net sluten (der liket in `>` te ûntbrekken).

parse-self-closing-tag-name-missing = Unjildige DoenetML: in tach sûnder namme fûn `<{ $content }>`

parse-self-closing-tag-not-closed = Unjildige DoenetML: de tach `{ $tag }` is net sluten (`/>` liket te ûntbrekken).

parse-tag-invalid-attributes = Unjildige DoenetML: de tach `{ $tag }` is net jildich. Dy hat mooglik ferkearde attributen.

parse-close-tag-name-missing = Unjildige DoenetML: in slutende tach sûnder namme fûn, bygelyks `</`

parse-attribute-value-unquoted = Attribútwearden moatte tusken oanhellingstekens stean: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Unjildige DoenetML: slutende tach `{ $tag }` fûn, mar gjin byhearrende iepenjende tach

parse-close-tag-mismatched = Unjildige DoenetML: slutende tach komt net oerien. Ferwachte waard `</{ $expected }>`. Fûn `{ $found }`

parser-node-unconvertible = De knoop { $node } koe net nei in Dast-knoop omset wurde.

## Names

name-attribute-invalid =
    Unjildige attribútnamme name='{ $name }'. { $reason ->
        [characters] Nammen meie allinnich letters, sifers, ûnderstreekjes of keppelstreekjes befetsje.
       *[start] Nammen moatte mei in letter begjinne.
    }

component-name-invalid-start = Unjildige komponintnamme "{ $name }". Nammen moatte mei in letter begjinne.

## `<answer>` sugar

answer-video-watched-missing-video = In answer fan it type videoWatched moat in attribút video hawwe

answer-video-watched-video-not-reference = In answer fan it type videoWatched moat in attribút video hawwe dat in ferwizing is

answer-name-not-single-text = It attribút name fan in answer moat ien inkeld tekstbern hawwe

## Referencing another document

external-doenetml-recursion-limit = De eksterne DoenetML kin net ophelle wurde troch te folle nivo's fan rekursje. Is der in sirkelfoarmige ferwizing?

external-doenetml-unavailable = Der kin gjin DoenetML ophelle wurde fan { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Unjildige DoenetML ophelle fan { $attribute }="{ $uri }": dy kaam net oerien mei it komponinttype "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] It attribút `{ $from }` is ferâldere; brûk yn plak dêrfan `{ $to }`.
       *[other] [deprecation] It attribút `{ $from }` op `<{ $component }>` is ferâldere; brûk yn plak dêrfan `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] It attribút `{ $from }` is ferâldere en wurdt negearre, om't ek `{ $to }` opjûn is.
       *[other] [deprecation] It attribút `{ $from }` op `<{ $component }>` is ferâldere en wurdt negearre, om't ek `{ $to }` opjûn is.
    }

deprecated-attribute-ignored = [deprecation] It attribút `{ $attribute }` op `<{ $component }>` is ferâldere en wurdt negearre.

deprecated-attribute-to-child = [deprecation] It attribút `{ $attribute }` op `<{ $component }>` is ferâldere; brûk yn plak dêrfan in `<{ $child }>`-bern.

deprecated-attribute-value-renamed = [deprecation] De wearde `{ $value }` fan it attribút `{ $attribute }` op `<{ $component }>` is ferâldere; brûk yn plak dêrfan `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` kin allinnich Ingelsk yn it meartal sette, dus de tekst bliuwt ûnferoare yn in dokumint dat yn { $locale } skreaun is. Skriuw de meartalsfoarm streekrjocht, of jou dy op mei it attribút `pluralForm`.


## Checking against the schema

schema-element-unrecognized = It elemint `<{ $tag }>` is gjin erkend Doenet-elemint.

schema-element-not-allowed-at-root = It elemint `<{ $tag }>` is net tastien op 'e woartel fan it dokumint.

schema-element-not-allowed-inside = It elemint `<{ $tag }>` is net tastien binnen `<{ $parent }>`.

schema-attribute-unrecognized = It elemint `<{ $tag }>` hat gjin attribút mei de namme `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] It attribút `{ $attribute }` fan it elemint `<{ $tag }>` moat in list wêze wêrfan elk elemint ien fan dizze is: { $allowed }
       *[other] It attribút `{ $attribute }` fan it elemint `<{ $tag }>` moat ien fan dizze wêze: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Unjildige fariantnamme foar select. De fariantnamme { $variantName } komt yn { $numOptions } opsjes foar, mar it tal dat keazen wurde moat is { $numToSelect }.

select-variant-name-without-options = Foar select binne guon farianten opjûn, mar der binne gjin opsjes opjûn foar de mooglike fariantnamme: { $variantName }.

select-variant-name-not-possible = De fariantnamme { $variantName } dy't foar select opjûn is, is gjin mooglike fariantnamme.

select-too-few-options = { $numToSelect } komponinten kinne net út mar { $numOptions } keazen wurde.

select-from-sequence-too-few-values = { $numToSelect } wearden kinne net út in rige fan lingte { $length } keazen wurde.

select-from-sequence-indices-count-mismatch = It tal yndeksen dat foar select opjûn is moat oerienkomme mei it tal dat keazen wurde moat

select-from-sequence-indices-not-integers = Alle yndeksen dy't foar select opjûn binne moatte hiele getallen wêze

select-from-sequence-index-excluded = In opjûne yndeks fan selectfromsequence wie útsletten

select-from-sequence-indices-excluded-combination = Opjûne yndeksen fan selectfromsequence wiene in útsletten kombinaasje

select-from-sequence-coprime-not-positive-integers = Underling ûndielbere kombinaasjes kinne net keazen wurde, om't der gjin positive hiele getallen keazen wurde.

select-from-sequence-coprime-common-factor = Underling ûndielbere getallen kinne net keazen wurde. Alle mooglike wearden hawwe in mienskiplike faktor. (De opjûne wearden fan "from" of "to" moatte ûnderling ûndielber wêze mei "step".)

select-from-sequence-coprime-single-number = Underling ûndielbere kombinaasjes kinne net út ien inkeld getal keazen wurde dat net 1 is.

select-from-sequence-excluded-too-many-combinations = Mear as 70% fan 'e kombinaasjes is yn selectFromSequence útsletten

select-from-sequence-coprime-none-found = Underling ûndielbere getallen koene net keazen wurde. Alle mooglike wearden hawwe in mienskiplike faktor.

select-from-sequence-too-few-unique-values = { $numToSelect } unike wearden kinne net út in rige fan lingte { $numPossibleValues } keazen wurde

select-prime-numbers-too-few-values = { $numToSelect } wearden kinne net út in list fan priemgetallen fan lingte { $numValues } keazen wurde

select-prime-numbers-values-count-mismatch = It tal wearden dat foar select opjûn is moat oerienkomme mei it tal dat keazen wurde moat

select-prime-numbers-values-not-prime = Alle wearden dy't foar it kiezen fan priemgetallen opjûn binne moatte yn 'e list fan priemgetallen stean

select-prime-numbers-values-excluded-combination = De opjûne wearden fan selectPrimeNumbers wiene in útsletten kombinaasje

select-prime-numbers-excluded-too-many-combinations = Mear as 70% fan 'e kombinaasjes is yn selectPrimeNumbers útsletten

select-random-combination-fluke = Troch in uterst ûnwierskynlik tafal koe der gjin kombinaasje fan tafallige wearden keazen wurde

select-random-value-fluke = Troch in uterst ûnwierskynlik tafal koe der gjin tafallige wearde keazen wurde
