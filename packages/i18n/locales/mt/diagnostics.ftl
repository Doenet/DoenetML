# Maltese diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Maltese counts in five plural categories, but nothing below counts high
# enough to separate them, so the selections keep the two branches the English
# source has.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } jiġi injorat meta jiġu speċifikati żewġ truf
       *[other] { $attributes } jiġu injorati meta jiġu speċifikati żewġ truf
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } jiġi injorat meta jiġu speċifikati kemm tarf kif ukoll punt tan-nofs
       *[other] { $attributes } jiġu injorati meta jiġu speċifikati kemm tarf kif ukoll punt tan-nofs
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ma għandu l-ebda effett mingħajr punt tan-nofs

## `<line>`

line-points-undetermined-dimensions = Linja li tgħaddi minn punti b'dimensjonijiet mhux determinati.

line-points-too-few-dimensions = Il-linja trid tgħaddi minn punti ta' mill-inqas żewġ dimensjonijiet.

line-points-depend-on-variables = Il-linja tgħaddi minn punti li jiddependu fuq varjabbli: { $variables }.

line-equation-invalid-format = Format invalidu għall-ekwazzjoni tal-linja fil-varjabbli { $variable1 } u { $variable2 }.

## `<ray>`

ray-overprescribed-through = Ir-raġġ huwa determinat minn through, endpoint u direction.  Il-through speċifikat qed jiġi injorat.

ray-dimension-mismatch = Diskrepanza f'numDimensions fir-raġġ.

## `<vector>`

vector-overprescribed-head = Il-vettur huwa determinat minn head, tail u displacement.  Il-head speċifikat qed jiġi injorat.

vector-dimension-mismatch = Diskrepanza f'numDimensions fil-vettur.

## Attracting and constraining

attract-to-without-nearest-point = Ma jistax jiġi attirat lejn `<{ $component }>` peress li ma għandux il-varjabbli ta' stat nearestPoint.

constrain-to-without-nearest-point = Ma jistax jiġi ristrett għal `<{ $component }>` peress li ma għandux il-varjabbli ta' stat nearestPoint.

constrain-to-interior-without-nearest-point = Ma jistax jiġi ristrett għall-parti ta' ġewwa ta' `<{ $component }>` peress li ma għandux il-varjabbli ta' stat nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition jiġi injorat għal choiceInput li mhuwiex inline

## Ordering children by index

choice-input-indices-count-mismatch = L-indiċi speċifikati għal choiceInput qed jiġu injorati peress li n-numru tagħhom ma jaqbilx man-numru ta' wlied choice.

pretzel-indices-count-mismatch = L-indiċi speċifikati għal problem qed jiġu injorati peress li n-numru tagħhom ma jaqbilx man-numru ta' wlied problem.

shuffle-indices-count-mismatch = L-indiċi speċifikati għal shuffle qed jiġu injorati peress li n-numru tagħhom ma jaqbilx man-numru ta' komponenti.

indices-ignored-out-of-range = L-indiċi speċifikati għal { $component } qed jiġu injorati peress li xi wħud minnhom huma barra mill-firxa.

pretzel-indices-repeated = L-indiċi speċifikati għal pretzel qed jiġu injorati peress li xi wħud minnhom huma ripetuti.

pretzel-circuit-first-index = L-indiċi speċifikati għal pretzel fil-modalità circuit qed jiġu injorati peress li l-ewwel indiċi jrid ikun 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Biex `<{ $component }>` jaħdem ma' wlied ta' tip string, irid jiġi speċifikat l-attribut `type`.

invalid-type-defaulting-to-math = Tip invalidu { $type } għall-komponent { $component }. Irid ikun wieħed minn math, text, number jew boolean. Qed jintuża math.

string-not-valid-component-to-arrange = L-istring "{ $value }" mhuwiex komponent validu biex { $component }. Qed jiġi injorat.

## Types and variables

invalid-type-defaulting-to-number = Tip invalidu { $type }, it-tip qed jiġi ssettjat għal number.

invalid-variable-value = Valur invalidu ta' varjabbli: `{ $value }`

## Variants

variant-index-must-be-number = L-indiċi tal-varjant { $index } irid ikun numru

variant-index-must-be-integer = L-indiċi tal-varjant { $index } irid ikun numru sħiħ

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` mhuwiex implimentat għal kejl assolut. Il-wisgħat qed jiġu ssettjati bħala relattivi.

side-by-side-absolute-margins = `<{ $component }>` mhuwiex implimentat għal kejl assolut. Il-marġni qed jiġu ssettjati bħala relattivi.

side-by-side-no-block-child = `<{ $component }>` invalidu: irid ikollu mill-inqas wild wieħed ta' tip blokk.

## `<label>`

label-for-ignored-on-graphical = L-attribut `for` fuq `<label>` grafiku jiġi injorat.

label-for-must-resolve-to-one = L-attribut `for` fuq `<label>` irid jirriżolvi għal eżattament komponent wieħed.

label-for-unresolved = L-attribut `for` fuq `<label>` ma setax jiġi riżolt għal komponent.

label-for-answer-with-authored-inputs = L-attribut `for` fuq `<label>` jirreferi għal `<answer>` b'inputs miktuba espliċitament; irreferi direttament għall-input.

label-for-answer-without-input = L-attribut `for` fuq `<label>` jirreferi għal `<answer>` mingħajr input x'jiġi ttikkettat.

label-for-must-reference-input-or-answer = L-attribut `for` fuq `<label>` irid jirreferi għal input jew għal tweġiba.

## Accessibility

accessibility-short-description-or-decorative = Għall-aċċessibbiltà, `<{ $component }>` irid ikollu deskrizzjoni qasira jew ikun speċifikat bħala dekorattiv.

accessibility-video-short-description = Għall-aċċessibbiltà, `<video>` irid ikollu deskrizzjoni qasira.

accessibility-input-short-description-or-label = Għall-aċċessibbiltà, `<{ $component }>` irid ikollu deskrizzjoni qasira jew tikketta.

accessibility-answer-input-short-description-or-label = Għall-aċċessibbiltà, `<answer>` li joħloq input irid ikollu deskrizzjoni qasira jew tikketta.

accessibility-short-description-contains-math = Id-deskrizzjonijiet qosra ma għandhomx ikun fihom komponenti matematiċi bħal `<{ $component }>`. Ikteb kull matematika bil-kliem.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ma għandux biżżejjed kuntrast għat-test tat-titlu tat-taqsima (modalità skura) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; jeħtieġ mill-inqas { $threshold }:1).
       *[other] { $colorName } ma għandux biżżejjed kuntrast għat-test tat-titlu tat-taqsima ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; jeħtieġ mill-inqas { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` minn { $count } punti mhuwiex implimentat meta l-punti ma jkollhomx valuri numeriċi.

circle-too-many-through-points = Ma jistax jiġi kkalkulat ċirku li jgħaddi minn aktar minn 3 punti.

circle-overprescribed-radius-center-points = Ma jistax jiġi kkalkulat ċirku b'raġġ, ċentru u punti speċifikati flimkien.

circle-center-with-multiple-points = Ma jistax jiġi kkalkulat ċirku b'ċentru speċifikat li jgħaddi minn aktar minn punt wieħed.

circle-radius-too-small = Ma jistax jiġi kkalkulat iċ-ċirku: peress li d-distanza bejn iż-żewġ punti hija { $distance }, ir-raġġ speċifikat { $radius } huwa żgħir wisq.

circle-radius-with-many-points = Ma jistax jinħoloq ċirku li jgħaddi minn aktar minn żewġ punti b'raġġ speċifikat.

circle-invalid-center-or-through-points = Ċentru jew punti taċ-ċirku invalidi.

circle-radius-center-with-multiple-points = Ma jistax jiġi kkalkulat ir-raġġ ta' ċirku b'ċentru speċifikat li jgħaddi minn aktar minn punt wieħed.

circle-change-radius-non-numerical = Ma jistax jinbidel ir-raġġ ta' ċirku meta l-punti ma jkollhomx valuri numeriċi

circle-radius-with-points-non-numerical = Ma jistax jinħoloq ċirku li jgħaddi minn aktar minn punt wieħed b'raġġ speċifikat meta ma jkunx hemm valuri numeriċi.

circle-change-center-non-numerical = Il-bidla taċ-ċentru ta' ċirku li jgħaddi minn punti mingħajr valuri numeriċi ma ġietx implimentata.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Dimensjonijiet insuffiċjenti għad-dominju tal-funzjoni. Id-dominju għandu { $intervals } intervall iżda l-funzjoni għandha { $inputs ->
            [one] { $inputs } input
           *[other] { $inputs } inputs
        }.
       *[other] Dimensjonijiet insuffiċjenti għad-dominju tal-funzjoni. Id-dominju għandu { $intervals } intervalli iżda l-funzjoni għandha { $inputs ->
            [one] { $inputs } input
           *[other] { $inputs } inputs
        }.
    }

function-domain-invalid-format = Format invalidu għad-dominju tal-funzjoni.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Il-massimu mhux numeriku tal-funzjoni qed jiġi injorat.
        [minimum] Il-minimu mhux numeriku tal-funzjoni qed jiġi injorat.
        [extremum] L-estrem mhux numeriku tal-funzjoni qed jiġi injorat.
        [point] Il-punt mhux numeriku tal-funzjoni qed jiġi injorat.
        [slope] L-inklinazzjoni mhux numerika tal-funzjoni qed tiġi injorata.
       *[other] { $type } mhux numeriku tal-funzjoni qed jiġi injorat.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Il-massimu vojt tal-funzjoni qed jiġi injorat.
        [minimum] Il-minimu vojt tal-funzjoni qed jiġi injorat.
        [extremum] L-estrem vojt tal-funzjoni qed jiġi injorat.
        [point] Il-punt vojt tal-funzjoni qed jiġi injorat.
       *[other] { $type } vojt tal-funzjoni qed jiġi injorat.
    }

function-points-too-close = Il-funzjoni fiha żewġ punti qrib wisq ta' xulxin. Il-funzjoni ma tistax tiġi definita.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] L-iterazzjonijiet ta' funzjoni huma possibbli biss jekk in-numru ta' inputs ikun daqs in-numru ta' outputs. Din il-funzjoni għandha { $inputs } input u { $outputs ->
            [one] { $outputs } output
           *[other] { $outputs } outputs
        }.
       *[other] L-iterazzjonijiet ta' funzjoni huma possibbli biss jekk in-numru ta' inputs ikun daqs in-numru ta' outputs. Din il-funzjoni għandha { $inputs } inputs u { $outputs ->
            [one] { $outputs } output
           *[other] { $outputs } outputs
        }.
    }

## `<sequence>`

sequence-invalid-length = Tul invalidu tas-sekwenza.  Irid ikun numru sħiħ mhux negattiv.

sequence-invalid-step = Pass invalidu tas-sekwenza.  Irid ikun numru għal sekwenza tat-tip { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" invalidu ta' sekwenza ta' numri.  Irid ikun numru.

sequence-invalid-endpoint-letters = "{ $attribute }" invalidu ta' sekwenza ta' ittri.  Irid ikun kombinazzjoni ta' ittri.

sequence-invalid-endpoint = "{ $attribute }" invalidu ta' sekwenza.

select-from-sequence-coprime-not-numbers = coprime qed jiġi injorat peress li mhumiex qed jintgħażlu numri

select-from-sequence-coprime-with-exclude-combinations = coprime qed jiġi injorat peress li ġie speċifikat excludeCombinations

## Resolving a `target`

target-not-found = target invalidu għal `<{ $source }>`: il-mira ma nstabitx.

target-state-variable-not-found = target invalidu għal `<{ $source }>`: ma nstabet l-ebda varjabbli ta' stat bl-isem "{ $property }" fuq `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Il-varjabbli ta' `<odeSystem>` iridu jkunu differenti mill-varjabbli indipendenti.

ode-system-duplicate-variable-names = Il-funzjonijiet RHS tal-ODE ma jistgħux jiġu definiti b'ismijiet duplikati ta' varjabbli dipendenti.

ode-system-rhs-function-error = Il-funzjoni RHS tal-ODE ma tistax tiġi definita.  Żball fil-ħolqien tal-funzjoni mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ma jistax jiġi definit angolu bejn { $count } linji

angle-invalid-through-point = Punt invalidu f'through ta' `<angle>`

parabola-vertex-too-many-points = Parabola b'vertiċi li tgħaddi minn aktar minn punt wieħed ma ġietx implimentata.

parabola-too-many-points = Parabola li tgħaddi minn aktar minn 3 punti ma ġietx implimentata.

intersection-too-many-items = L-intersezzjoni ta' aktar minn żewġ elementi ma ġietx implimentata

## Other math components

ionic-compound-not-two-ions = Il-kompost joniku ġie implimentat biss għal żewġ joni.

ionic-compound-needs-cation-and-anion = Il-kompost joniku ġie implimentat biss għal katjon wieħed u anjon wieħed.

solve-equations-cannot-evaluate = L-ekwazzjoni ma tistax tiġi solvuta peress li ma setgħetx tiġi evalwata: { $equation }

math-operators-operand-number-required = Irid jiġi speċifikat operandNumber meta jiġi estratt operand matematiku.

eigen-decomposition-failed = L-eigenvalues tal-matriċi ma setgħux jiġu kkalkulati

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: il-parametru { $parameters } ma jidhirx fil-mudell, u għalhekk dejjem se jaqbel ma' vojt.
       *[other] `<matchesPattern>`: il-parametri { $parameters } ma jidhrux fil-mudell, u għalhekk dejjem se jaqblu ma' vojt.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" ma jistax jiġi interpretat. Irid ikun none, medium, dense, jew żewġ numri pożittivi separati bi spazju, bħal grid="1 0.5". Ma tinġibed l-ebda gradilja.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" mhuwiex appoġġat fir-renderer prefigure; qed tintuża l-imġiba tal-pożizzjoni tal-lemin.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" mhuwiex appoġġat fir-renderer prefigure; qed tintuża l-imġiba tal-pożizzjoni ta' fuq.

prefigure-invalid-axis-bounds = `<graph>`: limiti tal-assi invalidi għall-konverżjoni prefigure; qed jintuża l-bbox awtomatiku (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: wisa' invalida għall-konverżjoni prefigure; qed tintuża l-wisa' awtomatika tad-dijagramma 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio invalidu għall-konverżjoni prefigure; qed jintuża l-proporzjon awtomatiku 1.

prefigure-grid-spacing-too-fine = `<graph>`: l-ispazjar tal-gradilja huwa fin wisq għal-limiti tal-assi; il-gradilja titħalla barra fir-renderer prefigure.

prefigure-annotations-not-rendered = `<graph>`: l-annotazzjonijiet ma jiġux renderjati jekk ma jintużax ir-renderer PreFigure.

multiple-annotations-children = Instabu diversi wlied `<annotations>` ġewwa `<graph>`; kollha ħlief tal-aħħar qed jiġu injorati.

## Referring to other components

copy-unrecognized-component-type = Tip ta' komponent mhux magħruf ma jistax jiġi estiż jew ikkupjat: { $type }.

copy-prop-not-found = Il-prop { $property } ma nstabx fuq komponent tat-tip { $component }

collect-no-source = Ma nstab l-ebda sors għal collect.

collect-invalid-component-type = Ma jistgħux jinġabru komponenti tat-tip `<{ $component }>` peress li huwa tip ta' komponent invalidu.

reference-index-unavailable = Ma jistax isir riferiment għall-indiċi `{ $reference }`

## `<callAction>`

component-action-unavailable = { $action } ma jistax jissejjaħ fuq il-komponent `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Id-data għandha forma invalida.  Ir-ringieli għandhom tulijiet inkonsistenti. Instab f'componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Id-data għandha ismijiet ta' kolonni duplikati.  Instab f'componentIdx :{ $componentIdx }

data-frame-missing-column-name = Id-data nieqsa minn isem ta' kolonna.  Instab f'componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Premju għal din it-tweġiba huwa bbażat fuq it-tweġiba mibgħuta mit-tag answer innifsu, u dan iwassal għal imġiba mhux mistennija.

answer-max-num-attempts-in-section-wide-check-work = Li tissettja `maxNumAttempts` fuq `<answer>` ġewwa kontenitur b'`sectionWideCheckWork` ma għandu l-ebda effett, peress li l-kontenitur jikkontrolla n-numru ta' provi. Issettja `maxNumAttempts` fuq il-kontenitur minflok.

nested-section-wide-check-work-max-num-attempts = Li tissettja `maxNumAttempts` fuq kontenitur b'`sectionWideCheckWork` li jinsab ġewwa kontenitur ieħor b'`sectionWideCheckWork` ma għandu l-ebda effett, peress li l-kontenitur ta' barra jikkontrolla n-numru ta' provi. Issettja `maxNumAttempts` fuq il-kontenitur ta' barra minflok.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] L-attribut { $attributes } ma jkollu l-ebda effett mingħajr symbolicEquality issettjat.
       *[other] L-attributi { $attributes } ma jkollhom l-ebda effett mingħajr symbolicEquality issettjat.
    }

answer-invalid-type = Tip invalidu għat-tweġiba: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Peress li l-komponent `<{ $component }>` ma għandux isem, ma jistax jintuża bħala attribut ta' modulu

module-attribute-name-already-defined = Il-komponent `<{ $component } name="{ $name }">` ma jistax jintuża bħala attribut għal modulu peress li t-tip ta' komponent `<module>` diġà għandu attribut "{ $name }" definit.

conditional-content-condition-ignored = L-attribut `condition` jiġi injorat fuq komponent `<conditionalContent>` bi wlied case jew else.

slider-markers-type-mismatch = It-tip tal-markaturi ma jaqbilx mat-tip tal-islajder.

pretzel-problem-needs-statement-and-answer = pretzel invalidu: kull `<problem>` irid ikun fih `<statement>` wieħed u `<answer>` wieħed.

pretzel-circuit-first-problem-distractor = pretzel invalidu: f'mode="circuit", l-ewwel `<problem>` ma jistax ikun distrattur.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Valur invalidu { $values } għall-attribut `{ $attribute }`; qed jiġi injorat.
       *[other] Valuri invalidi { $values } għall-attribut `{ $attribute }`; qed jiġu injorati.
    }

attribute-must-be-references = Valur invalidu `{ $value }` għall-attribut `{ $attribute }`. L-attribut irid ikun magħmul minn referenzi li jibdew b'`$`.

math-input-invalid-function-names = <mathInput>: ismijiet ta' funzjonijiet invalidi f'{ $attribute } ġew injorati: { $names }. Is-segment li jintwera ta' kull isem irid ikun ta' mill-inqas 2 karattri (ittri jew sing); jista' jsegwi suffiss fakultattiv `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Tip ta' komponent invalidu: `<{ $componentType }>`

attribute-repeated = L-attribut { $attribute } ma jistax jiġi ripetut.

attribute-invalid-for-component = Attribut "{ $attribute }" invalidu għal komponent tat-tip `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Id-definizzjoni tal-istil { $styleNumber } ma għandhiex biżżejjed kuntrast għal { $context ->
        [text-on-background] il-kulur tat-test kontra l-kulur tal-isfond
        [high-contrast] il-kulur ta' kuntrast għoli kontra t-tila
        [line] il-kulur tal-linja kontra t-tila
        [marker] il-kulur tal-markatur kontra t-tila
       *[text-on-canvas] il-kulur tat-test kontra t-tila
    }{ $mode ->
        [dark] { " (modalità skura)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; jeħtieġ mill-inqas { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Għalkemm id-definizzjoni tal-istil { $styleNumber } tispeċifika kuluri li jagħtu biżżejjed kuntrast għall-modalità ċara, il-kuluri tal-modalità skura derivati minnhom ma għandhomx biżżejjed kuntrast bejn il-kulur tat-test u l-kulur tal-isfond ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; jeħtieġ mill-inqas { $threshold }:1). { $suggestion ->
        [available] Biex tiżgura biżżejjed kuntrast fil-modalità skura, jew żid il-kuntrast tal-modalità ċara (eż. issettja { $lightAttribute }="{ $lightColor }") jew issostitwixxi l-kulur tal-modalità skura (eż. issettja { $darkAttribute }="{ $darkColor }").
       *[none] Biex tiżgura biżżejjed kuntrast fil-modalità skura, żid il-kuntrast tal-modalità ċara jew issostitwixxi l-kuluri derivati b'textColorDarkMode u/jew backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Għalkemm id-definizzjoni tal-istil { $styleNumber } tispeċifika kulur tat-test li jagħti biżżejjed kuntrast għall-modalità ċara, il-kulur tat-test tal-modalità skura derivat minnu ma għandux biżżejjed kuntrast kontra t-tila ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; jeħtieġ mill-inqas { $threshold }:1). { $suggestion ->
        [available] Biex tiżgura biżżejjed kuntrast fil-modalità skura, jew żid il-kuntrast tal-modalità ċara (eż. issettja textColor="{ $lightColor }") jew issostitwixxi l-kulur tal-modalità skura (eż. issettja textColorDarkMode="{ $darkColor }").
       *[none] Biex tiżgura biżżejjed kuntrast fil-modalità skura, żid il-kuntrast tal-modalità ċara jew issostitwixxi l-kulur derivat b'textColorDarkMode.
    }

section-multiple-style-palettes = Taqsima tista' tagħżel <stylePalette> wieħed biss; qed jintuża tal-aħħar.

## Unique variants

variant-num-to-select-not-non-negative-integer = il-varjanti uniċi ta' { $component } ma jistgħux jiġu determinati peress li numToSelect mhuwiex numru sħiħ mhux negattiv.

variant-num-to-select-not-constant-number = il-varjanti uniċi ta' { $component } ma jistgħux jiġu determinati peress li numToSelect mhuwiex numru kostanti.

variant-with-replacement-not-constant-boolean = il-varjanti uniċi ta' { $component } ma jistgħux jiġu determinati peress li withReplacement mhuwiex Boolean kostanti.

variant-select-weight-disables-unique = Il-varjanti uniċi għal select jiġu diżattivati jekk ikun hemm għażla b'selectWeight jew selectForVariants speċifikat

variant-coprime-undetermined = il-varjanti uniċi ta' { $component } ma jistgħux jiġu determinati peress li ma jistax jiġi determinat li coprime huwa dejjem falz.

variant-attribute-not-constant = il-varjanti uniċi ta' { $component } ma jistgħux jiġu determinati peress li { $attribute } mhuwiex kostanti.

variant-attribute-not-number = il-varjanti uniċi ta' { $component } ma jistgħux jiġu determinati peress li { $attribute } mhuwiex numru.

variant-attribute-wrong-type-for-sequence =
    il-varjanti uniċi ta' { $component } tat-tip { $type } ma jistgħux jiġu determinati peress li { $attribute } mhuwiex { $expected ->
        [letters-combination] kombinazzjoni ta' ittri
        [math-expression] espressjoni matematika valida
        [integer] numru sħiħ
       *[number] numru
    }.

variant-length-not-integer = il-varjanti uniċi ta' { $component } ma jistgħux jiġu determinati peress li length mhuwiex numru sħiħ.

variant-sort-not-implemented = il-varjanti uniċi ta' { $component } b'sort ma ġewx implimentati

variant-exclude-combinations-not-implemented = il-varjanti uniċi ta' { $component } b'excludeCombinations ma ġewx implimentati

variant-math-exclude-not-implemented = il-varjanti uniċi ta' { $component } tat-tip math b'exclude ma ġewx implimentati

variant-non-constant-exclude-not-implemented = il-varjanti uniċi ta' { $component } b'exclude mhux kostanti ma ġewx implimentati

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: mhuwiex appoġġat fir-renderer prefigure tal-graff; id-dixxendent tħalla barra.

prefigure-descendant-invalid-geometry = { $subject }: ġeometrija mhux finita jew inkompleta; id-dixxendent tħalla barra.

prefigure-curve-label-omitted = { $subject }: it-tikketti mhumiex appoġġati fuq elementi ta' kurva konvertiti; it-tikketta tħalliet barra.

prefigure-curve-unsupported-definition-type = { $subject }: tip ta' definizzjoni ta' funzjoni ta' kurva mhux appoġġat '{ $definitionType }'; id-dixxendent tħalla barra.

prefigure-region-flip-functions-unsupported = { $subject }: l-attribut flipFunctions mhuwiex appoġġat fuq regionBetweenCurves; id-dixxendent tħalla barra.

prefigure-region-non-formula-child = { $subject }: fuq regionBetweenCurves huma appoġġati biss funzjonijiet wlied tat-tip formula; id-dixxendent tħalla barra.

prefigure-label-position-unsupported =
    { $subject }: labelPosition mhux appoġġat '{ $labelPosition }' għal { $labelKind ->
        [line-family] tikketta tal-familja tal-linji
       *[point] tikketta ta' punt
    }; intuża l-allinjament awtomatiku ta' PreFigure.

prefigure-fill-style-unsupported = { $subject }: l-istil ta' mili '{ $fillStyle }' mhuwiex appoġġat minn PreFigure; qed jintuża mili solidu.

prefigure-line-style-unknown = { $subject }: l-istil ta' linja mhux magħruf '{ $lineStyle }' tħalla barra mill-output ta' PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: l-istil ta' markatur '{ $markerStyle }' ġie mmappjat għall-istil 'diamond' ta' PreFigure.

prefigure-marker-style-unsupported = { $subject }: l-istil ta' markatur '{ $markerStyle }' mhuwiex appoġġat minn PreFigure; intuża l-istil awtomatiku.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` invalidu; il-mira ma tistax tiġi riżolta. L-annotazzjoni tħalliet barra.

annotation-ref-multiple-targets = `<annotation>`: `ref` irriżolva għal diversi miri; qed tintuża l-ewwel waħda.

annotation-ref-outside-graph = `<annotation>`: `ref` invalidu; il-mira hija barra mill-graff li jinkludiha. L-annotazzjoni tħalliet barra.

annotation-ref-unsupported-target = `<annotation>`: `ref` invalidu; il-mira mhijiex oġġett grafiku appoġġat fil-konverżjoni prefigure. L-annotazzjoni tħalliet barra.

annotation-text-missing = `<annotation>`: `text` nieqes jew vojt; qed jinħareġ test vojt.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Instabet dipendenza ċirkolari.
       *[other] Instabet dipendenza ċirkolari li tinvolvi komponent `<{ $componentType }>`.
    }

reference-no-referent = Ma nstab l-ebda referent għar-referenza: `{ $reference }`

reference-multiple-referents = Instabu diversi referenti għar-referenza: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format invalidu għall-attribut { $attribute } ta' `<{ $componentType }>`.

children-invalid = Wlied invalidi għal `<{ $componentType }>`: Instabu wlied invalidi: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valur invalidu `{ $value }` għall-attribut `{ $attribute }`, qed jintuża l-valur `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Il-verżjoni { $version } ta' DoenetML ma nstabitx.
       *[other] Il-verżjoni { $version } ta' DoenetML ma nstabitx. Qed tintuża l-verżjoni { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML invalidu: { $content }

parse-tag-missing-close-tag = DoenetML invalidu: It-tag `{ $tag }` ma għandux tag tal-għeluq. Kien mistenni tag li jagħlaq lilu nnifsu jew tag `</{ $tagName }>`.

parse-tag-error = DoenetML invalidu: Żball fit-tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML invalidu: Jidher li l-attribut invalidu `{ $attribute }` huwa nieqes minn valur.

parse-attribute-invalid = DoenetML invalidu: Attribut invalidu `{ $attribute }`

parse-attribute-value-invalid = DoenetML invalidu: Valur ta' attribut invalidu `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML invalidu: Valur ta' attribut invalidu `{ $value }`. Il-virgoletti ma jaqblux. Jidher li huwa nieqes `{ $quote }`

parse-open-tag-name-missing = DoenetML invalidu: Instab tag mingħajr isem, eż. `<`

parse-tag-not-closed = DoenetML invalidu: It-tag `{ $tag }` ma ngħalaqx (jidher li huwa nieqes `>`).

parse-self-closing-tag-name-missing = DoenetML invalidu: Instab tag mingħajr isem `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML invalidu: It-tag `{ $tag }` ma ngħalaqx (jidher li huwa nieqes `/>`).

parse-tag-invalid-attributes = DoenetML invalidu: It-tag `{ $tag }` mhuwiex validu. Jista' jkollu attributi żbaljati.

parse-close-tag-name-missing = DoenetML invalidu: Instab tag tal-għeluq mingħajr isem, eż. `</`

parse-attribute-value-unquoted = Il-valuri tal-attributi jridu jkunu bejn il-virgoletti: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML invalidu: Instab it-tag tal-għeluq `{ $tag }`, iżda l-ebda tag tal-ftuħ korrispondenti

parse-close-tag-mismatched = DoenetML invalidu: Tag tal-għeluq li ma jaqbilx. Kien mistenni `</{ $expected }>`. Instab `{ $found }`

parser-node-unconvertible = In-node { $node } ma setax jiġi kkonvertit f'node Dast.

## Names

name-attribute-invalid =
    Isem ta' attribut invalidu name='{ $name }'. { $reason ->
        [characters] L-ismijiet jistgħu jkun fihom biss ittri, numri, underscores jew sing.
       *[start] L-ismijiet iridu jibdew b'ittra.
    }

component-name-invalid-start = Isem ta' komponent invalidu "{ $name }". L-ismijiet iridu jibdew b'ittra.

## `<answer>` sugar

answer-video-watched-missing-video = Tweġiba tat-tip videoWatched trid ikollha attribut video

answer-video-watched-video-not-reference = L-attribut video ta' tweġiba tat-tip videoWatched irid ikun referenza

answer-name-not-single-text = L-attribut name tat-tweġiba jrid ikollu wild wieħed ta' test

## Referencing another document

external-doenetml-recursion-limit = Ma setax jinkiseb DoenetML estern minħabba wisq livelli ta' rikorsjoni. Hemm xi referenza ċirkolari?

external-doenetml-unavailable = Ma setax jinkiseb DoenetML minn { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML invalidu miksub minn { $attribute }="{ $uri }": ma qabilx mat-tip ta' komponent "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] L-attribut `{ $from }` huwa skadut; uża `{ $to }` minfloku.
       *[other] [deprecation] L-attribut `{ $from }` fuq `<{ $component }>` huwa skadut; uża `{ $to }` minfloku.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] L-attribut `{ $from }` huwa skadut u qed jiġi injorat peress li ġie speċifikat ukoll `{ $to }`.
       *[other] [deprecation] L-attribut `{ $from }` fuq `<{ $component }>` huwa skadut u qed jiġi injorat peress li ġie speċifikat ukoll `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] L-attribut `{ $attribute }` fuq `<{ $component }>` huwa skadut u qed jiġi injorat.


## Language coverage

pluralize-english-only = `<pluralize>` jista' jqiegħed fil-plural l-Ingliż biss, u għalhekk it-test tiegħu jitħalla mhux mibdul f'dokument miktub bi { $locale }. Ikteb il-forma plurali direttament, jew issettjaha bl-attribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = L-element `<{ $tag }>` mhuwiex element ta' Doenet rikonoxxut.

schema-element-not-allowed-at-root = L-element `<{ $tag }>` mhuwiex permess fl-għerq tad-dokument.

schema-element-not-allowed-inside = L-element `<{ $tag }>` mhuwiex permess ġewwa `<{ $parent }>`.

schema-attribute-unrecognized = L-element `<{ $tag }>` ma għandu l-ebda attribut bl-isem `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] L-attribut `{ $attribute }` tal-element `<{ $tag }>` irid ikun lista fejn kull element ikun wieħed minn: { $allowed }
       *[other] L-attribut `{ $attribute }` tal-element `<{ $tag }>` irid ikun wieħed minn: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Isem ta' varjant invalidu għal select.  L-isem tal-varjant { $variantName } jidher f'{ $numOptions } għażliet iżda n-numru li jrid jintgħażel huwa { $numToSelect }.

select-variant-name-without-options = Ġew speċifikati varjanti għal select iżda ma ġiet speċifikata l-ebda għażla għall-isem possibbli tal-varjant: { $variantName }.

select-variant-name-not-possible = L-isem tal-varjant { $variantName } speċifikat għal select mhuwiex isem possibbli ta' varjant.

select-too-few-options = Ma jistgħux jintgħażlu { $numToSelect } komponenti minn { $numOptions } biss.

select-from-sequence-too-few-values = Ma jistgħux jintgħażlu { $numToSelect } valuri minn sekwenza ta' tul { $length }.

select-from-sequence-indices-count-mismatch = In-numru ta' indiċi speċifikati għal select irid jaqbel man-numru li jrid jintgħażel

select-from-sequence-indices-not-integers = L-indiċi kollha speċifikati għal select iridu jkunu numri sħaħ

select-from-sequence-index-excluded = Ġie speċifikat indiċi ta' selectfromsequence li kien eskluż

select-from-sequence-indices-excluded-combination = Ġew speċifikati indiċi ta' selectfromsequence li kienu kombinazzjoni eskluża

select-from-sequence-coprime-not-positive-integers = Ma jistgħux jintgħażlu kombinazzjonijiet koprimi peress li mhumiex qed jintgħażlu numri sħaħ pożittivi.

select-from-sequence-coprime-common-factor = Ma jistgħux jintgħażlu numri koprimi. Il-valuri possibbli kollha jaqsmu fattur komuni. (Il-valuri speċifikati ta' "from" jew "to" iridu jkunu koprimi ma' "step".)

select-from-sequence-coprime-single-number = Ma jistgħux jintgħażlu kombinazzjonijiet koprimi minn numru wieħed li mhuwiex 1.

select-from-sequence-excluded-too-many-combinations = Aktar minn 70% tal-kombinazzjonijiet ġew esklużi f'selectFromSequence

select-from-sequence-coprime-none-found = Ma setgħux jintgħażlu numri koprimi. Il-valuri possibbli kollha jaqsmu fattur komuni.

select-from-sequence-too-few-unique-values = Ma jistgħux jintgħażlu { $numToSelect } valuri uniċi minn sekwenza ta' tul { $numPossibleValues }

select-prime-numbers-too-few-values = Ma jistgħux jintgħażlu { $numToSelect } valuri minn lista ta' numri primi ta' tul { $numValues }

select-prime-numbers-values-count-mismatch = In-numru ta' valuri speċifikati għal select irid jaqbel man-numru li jrid jintgħażel

select-prime-numbers-values-not-prime = Il-valuri kollha speċifikati għal select prime number iridu jkunu fil-lista tan-numri primi

select-prime-numbers-values-excluded-combination = Il-valuri speċifikati ta' selectPrimeNumbers kienu kombinazzjoni eskluża

select-prime-numbers-excluded-too-many-combinations = Aktar minn 70% tal-kombinazzjonijiet ġew esklużi f'selectPrimeNumbers

select-random-combination-fluke = B'kumbinazzjoni estremament improbabbli, ma setgħetx tintgħażel kombinazzjoni ta' valuri każwali

select-random-value-fluke = B'kumbinazzjoni estremament improbabbli, ma setax jintgħażel valur każwali
