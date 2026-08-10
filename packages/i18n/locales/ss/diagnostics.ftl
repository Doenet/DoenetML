# Swati diagnostics: errors and warnings surfaced to the reader or author.
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
        [one] { $attributes } kushaywa indziva nangabe emaphuzu lamabili ekugcina abekiwe
       *[other] { $attributes } kushaywa indziva nangabe emaphuzu lamabili ekugcina abekiwe
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } kushaywa indziva nangabe liphuzu lekugcina neliphuzu lelisemkhatsini kubekiwe kokubili
       *[other] { $attributes } kushaywa indziva nangabe liphuzu lekugcina neliphuzu lelisemkhatsini kubekiwe kokubili
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ayinamtselela ngaphandle kweliphuzu lelisemkhatsini

## `<line>`

line-points-undetermined-dimensions = Umudvwa lodlula emaphuzwini lanemikhakha lengatiwa.

line-points-too-few-dimensions = Umudvwa kufanele udlule emaphuzwini lanemikhakha lemibili nakancane.

line-points-depend-on-variables = Umudvwa udlula emaphuzwini lancike etintfweni letiguquguqukako: { $variables }.

line-equation-invalid-format = Sakhiwo lesingasilo sekulingana kwemudvwa etintfweni letiguquguqukako { $variable1 } na-{ $variable2 }.

## `<ray>`

ray-overprescribed-through = Umsebe ubekwe nge-through, endpoint ne-direction.  Kushaywa indziva i-through lebekiwe.

ray-dimension-mismatch = numDimensions ayihambelani emsebeni.

## `<vector>`

vector-overprescribed-head = Ivektha ibekwe nge-head, tail ne-displacement.  Kushaywa indziva i-head lebekiwe.

vector-dimension-mismatch = numDimensions ayihambelani kuvektha.

## Attracting and constraining

attract-to-without-nearest-point = Akukhonakali kudvonsela ku-`<{ $component }>` ngoba ayinaso sitfombe sesimo se-nearestPoint.

constrain-to-without-nearest-point = Akukhonakali kukhawulela ku-`<{ $component }>` ngoba ayinaso sitfombe sesimo se-nearestPoint.

constrain-to-interior-without-nearest-point = Akukhonakali kukhawulela ngekhatsi kwe-`<{ $component }>` ngoba ayinaso sitfombe sesimo se-nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ishaywa indziva ku-choiceInput lengasiyo ye-inline

## Ordering children by index

choice-input-indices-count-mismatch = Kushaywa indziva tinombolo letibekiwe ku-choiceInput ngobe linani letinombolo alihambelani nelinani lebantfwana bekukhetsa.

pretzel-indices-count-mismatch = Kushaywa indziva tinombolo letibekiwe ku-problem ngobe linani letinombolo alihambelani nelinani lebantfwana be-problem.

shuffle-indices-count-mismatch = Kushaywa indziva tinombolo letibekiwe ku-shuffle ngobe linani letinombolo alihambelani nelinani leticheme.

indices-ignored-out-of-range = Kushaywa indziva tinombolo letibekiwe ku-{ $component } ngobe letinye tingephandle kwelinani.

pretzel-indices-repeated = Kushaywa indziva tinombolo letibekiwe ku-pretzel ngobe letinye tiphindzaphindziwe.

pretzel-circuit-first-index = Kushaywa indziva tinombolo letibekiwe ku-pretzel kumo we-circuit ngobe inombolo yekucala kufanele ibe ngu-1.

## `<shuffle>` and `<sort>`

string-children-need-type = Kute `<{ $component }>` isebente nebantfwana bemagama, sici se-`type` kufanele sibekwe.

invalid-type-defaulting-to-math = Luhlobo { $type } alusilo kusicheme se-{ $component }. Kufanele lube ngulunye lwe-math, text, number nobe boolean. Kubekwa i-math njengelokuvamile.

string-not-valid-component-to-arrange = Ligama "{ $value }" akusiso sicheme lesivunyelwe ku-{ $component }. Kuyashaywa indziva.

## Types and variables

invalid-type-defaulting-to-number = Luhlobo { $type } alusilo, luhlobo lubekwa ku-number.

invalid-variable-value = Linani lelingasilo lentfo leguquguqukako: `{ $value }`

## Variants

variant-index-must-be-number = Inombolo yeluhlobo { $index } kufanele ibe linani

variant-index-must-be-integer = Inombolo yeluhlobo { $index } kufanele ibe linani lelipheleleko

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ayikenteliswa timo letiphelele. Bubanti bubekwa kutsi bube ngulobuhambisanako.

side-by-side-absolute-margins = `<{ $component }>` ayikenteliswa timo letiphelele. Emaceleni abekwa kutsi abe ngulahambisanako.

side-by-side-no-block-child = `<{ $component }>` lengasiyo: kufanele ibe nemntfwana munye webhulokhi nakancane.

## `<label>`

label-for-ignored-on-graphical = Sici se-`for` ku-`<label>` yemfanekiso siyashaywa indziva.

label-for-must-resolve-to-one = Sici se-`for` ku-`<label>` kufanele sikhombe kusicheme sinye kuphela.

label-for-unresolved = Sici se-`for` ku-`<label>` asikhonanga kukhomba kusicheme.

label-for-answer-with-authored-inputs = Sici se-`for` ku-`<label>` sikhomba ku-`<answer>` lenekufakwa lokubhalwe ngumbhali; khomba ngco kulokufakwako.

label-for-answer-without-input = Sici se-`for` ku-`<label>` sikhomba ku-`<answer>` lengenako kufakwa lokungabekwa libito.

label-for-must-reference-input-or-answer = Sici se-`for` ku-`<label>` kufanele sikhombe kulokufakwako nobe kumphendvulo.

## Accessibility

accessibility-short-description-or-decorative = Kute kufinyeleleke, `<{ $component }>` kufanele ibe nenchazelo lemfishane nobe ibekwe njenge-decorative.

accessibility-video-short-description = Kute kufinyeleleke, `<video>` kufanele ibe nenchazelo lemfishane.

accessibility-input-short-description-or-label = Kute kufinyeleleke, `<{ $component }>` kufanele ibe nenchazelo lemfishane nobe libito.

accessibility-answer-input-short-description-or-label = Kute kufinyeleleke, `<answer>` leyakha kufakwa kufanele ibe nenchazelo lemfishane nobe libito.

accessibility-short-description-contains-math = Tinchazelo letimfishane akukafaneli tibe netichemu tetibalo letifana ne-`<{ $component }>`. Bhala tibalo ngemagama.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ayinawo umehluko lowanele wembhalo wesihloko sesigaba (indlela lemnyama) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kudzingeka { $threshold }:1 nakancane).
       *[other] { $colorName } ayinawo umehluko lowanele wembhalo wesihloko sesigaba ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kudzingeka { $threshold }:1 nakancane).
    }

## `<circle>`

circle-through-points-non-numerical = Akukentiwa `<circle>` ledlula emaphuzwini langu-{ $count } lapho emaphuzu angenawo emanani etibalo.

circle-too-many-through-points = Akukhonakali kubala indingilizi ledlula emaphuzwini langetulu kwalamatsatfu.

circle-overprescribed-radius-center-points = Akukhonakali kubala indingilizi ngelireydiyasi, umkhatsi nemaphuzu labekiwe.

circle-center-with-multiple-points = Akukhonakali kubala indingilizi ngemkhatsi lobekiwe ledlula ephuzwini lelingetulu kwalinye.

circle-radius-too-small = Akukhonakali kubala indingilizi: njengoba libanga emkhatsini wemaphuzu lamabili lingu-{ $distance }, lireydiyasi { $radius } lelibekiwe lincane kakhulu.

circle-radius-with-many-points = Akukhonakali kwakha indingilizi ledlula emaphuzwini langetulu kwalamabili ngelireydiyasi lelibekiwe.

circle-invalid-center-or-through-points = Umkhatsi nobe emaphuzu endingilizi akusilo.

circle-radius-center-with-multiple-points = Akukhonakali kubala lireydiyasi lendingilizi ngemkhatsi lobekiwe ledlula ephuzwini lelingetulu kwalinye.

circle-change-radius-non-numerical = Akukhonakali kuguqula lireydiyasi lendingilizi ledlula emaphuzwini langenawo emanani

circle-radius-with-points-non-numerical = Akukhonakali kwakha indingilizi ledlula ephuzwini lelingetulu kwalinye ngelireydiyasi lelibekiwe nangabe kute emanani etibalo.

circle-change-center-non-numerical = Akukentiwa kuguqula umkhatsi wendingilizi ledlula emaphuzwini langenawo emanani etibalo.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Imikhakha ayanele kundzawo yemsebenti. Indzawo inesikhatsi lesingu-{ $intervals } kodvwa umsebenti une-{ $inputs ->
            [one] kufakwa lokungu-{ $inputs }
           *[other] kufakwa lokungu-{ $inputs }
        }.
       *[other] Imikhakha ayanele kundzawo yemsebenti. Indzawo inetikhatsi letingu-{ $intervals } kodvwa umsebenti une-{ $inputs ->
            [one] kufakwa lokungu-{ $inputs }
           *[other] kufakwa lokungu-{ $inputs }
        }.
    }

function-domain-invalid-format = Sakhiwo lesingasilo sendzawo yemsebenti.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Kushaywa indziva linani lelikhulu lelingesilo lesibalo lemsebenti.
        [minimum] Kushaywa indziva linani lelincane lelingesilo lesibalo lemsebenti.
        [extremum] Kushaywa indziva linani lekugcina lelingesilo lesibalo lemsebenti.
        [point] Kushaywa indziva liphuzu lelingesilo lesibalo lemsebenti.
        [slope] Kushaywa indziva kutseleka lokungesilo lesibalo kwemsebenti.
       *[other] Kushaywa indziva { $type } lokungesilo lesibalo kwemsebenti.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Kushaywa indziva linani lelikhulu lelingenalutfo lemsebenti.
        [minimum] Kushaywa indziva linani lelincane lelingenalutfo lemsebenti.
        [extremum] Kushaywa indziva linani lekugcina lelingenalutfo lemsebenti.
        [point] Kushaywa indziva liphuzu lelingenalutfo lemsebenti.
       *[other] Kushaywa indziva { $type } lokungenalutfo kwemsebenti.
    }

function-points-too-close = Umsebenti unemaphuzu lamabili lasedvute kakhulu. Akukhonakali kuchaza umsebenti.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Kuphindzaphindza kwemsebenti kwenteka kuphela nangabe linani lekufakwako lilingana nelinani lekuphumako. Lomsebenti unekufakwa lokungu-{ $inputs } ne-{ $outputs ->
            [one] kuphuma lokungu-{ $outputs }
           *[other] kuphuma lokungu-{ $outputs }
        }.
       *[other] Kuphindzaphindza kwemsebenti kwenteka kuphela nangabe linani lekufakwako lilingana nelinani lekuphumako. Lomsebenti unekufakwa lokungu-{ $inputs } ne-{ $outputs ->
            [one] kuphuma lokungu-{ $outputs }
           *[other] kuphuma lokungu-{ $outputs }
        }.
    }

## `<sequence>`

sequence-invalid-length = Budze lobungesilo belandzelano.  Kufanele kube linani lelipheleleko lelingesilo lelingenhla kwaliphelele.

sequence-invalid-step = Sinyatselo lesingasilo selandzelano.  Kufanele kube linani kulandzelano lweluhlobo lwe-{ $type }.

sequence-invalid-endpoint-number = "{ $attribute }" lengasiyo yelandzelano lwemanani.  Kufanele kube linani.

sequence-invalid-endpoint-letters = "{ $attribute }" lengasiyo yelandzelano lwetinhlamvu.  Kufanele kube kuhlanganiswa kwetinhlamvu.

sequence-invalid-endpoint = "{ $attribute }" lengasiyo yelandzelano.

select-from-sequence-coprime-not-numbers = coprime ishaywe indziva ngobe akukhetfwa emanani

select-from-sequence-coprime-with-exclude-combinations = coprime ishaywe indziva ngobe excludeCombinations ibekiwe

## Resolving a `target`

target-not-found = Umgomo longesilo we-`<{ $source }>`: umgomo awutfolakali.

target-state-variable-not-found = Umgomo longesilo we-`<{ $source }>`: akutfolakali sitfombe sesimo lesibitwa "{ $property }" ku-`<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Tintfo letiguquguqukako te-`<odeSystem>` kufanele tehluke entfweni leguquguqukako letimele yodvwa.

ode-system-duplicate-variable-names = Akukhonakali kuchaza imisebenti ye-ODE RHS ngemabito letintfo letiguquguqukako laphindzaphindziwe.

ode-system-rhs-function-error = Akukhonakali kuchaza umsebenti we-ODE RHS.  Liphutsa ekwakheni umsebenti we-mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Akukhonakali kuchaza li-engeli emkhatsini wemidvwa lengu-{ $count }

angle-invalid-through-point = Liphuzu lelingasilo ku-through ye-`<angle>`

parabola-vertex-too-many-points = Akukentiwa iparabhola nesicongo ledlula ephuzwini lelingetulu kwalinye.

parabola-too-many-points = Akukentiwa iparabhola ledlula emaphuzwini langetulu kwalamatsatfu.

intersection-too-many-items = Akukentiwa kuhlangana kwetintfo letingetulu kwaletimbili

## Other math components

ionic-compound-not-two-ions = Akukentiwa inhlanganisela ye-ayoni ngaphandle kwaleyemayoni lamabili.

ionic-compound-needs-cation-and-anion = Inhlanganisela ye-ayoni yentiwe kuphela ye-cation yinye ne-anion yinye.

solve-equations-cannot-evaluate = Akukhonakali kucatulula kulingana ngobe akukhonakalanga kuhlola: { $equation }

math-operators-operand-number-required = Kufanele ubeke i-operandNumber nawukhipha i-operand yetibalo.

eigen-decomposition-failed = Akukhonakalanga kubala emanani e-eigen wemethriksi

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: liphrametha { $parameters } alikho kuloluhlobo, ngako litawuhlala lihambisana nendzawo lengenalutfo.
       *[other] `<matchesPattern>`: emaphrametha { $parameters } akakho kuloluhlobo, ngako atawuhlala ahambisana nendzawo lengenalutfo.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: akukhonakali kucondza grid="{ $grid }". Kufanele kube none, medium, dense, nobe emanani lamabili lasetulu kwaliphelele lehlukaniswe ngesikhala, njenge-grid="1 0.5". Kute inetha lelidvwetjiwe.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ayisekelwa kumkhombisi we-prefigure; kusetjentiswa indlela ye-right.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ayisekelwa kumkhombisi we-prefigure; kusetjentiswa indlela ye-top.

prefigure-invalid-axis-bounds = `<graph>`: imikhawulo yendzawo lengasiyo yekuguculwa kwe-prefigure; kusetjentiswa i-bbox levamile (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: bubanti lobungasibo bekuguculwa kwe-prefigure; kusetjentiswa bubanti bemfanekiso lobuvamile bemu-425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio lengasiyo yekuguculwa kwe-prefigure; kusetjentiswa lisilinganiso lelivamile lelingu-1.

prefigure-grid-spacing-too-fine = `<graph>`: sikhala senetha sincane kakhulu kumikhawulo yendzawo; inetha lishiywe kumkhombisi we-prefigure.

prefigure-annotations-not-rendered = `<graph>`: tinchazelo angeke tikhonjiswe nangabe kungasetjentiswa umkhombisi we-PreFigure.

multiple-annotations-children = Kutfolwe bantfwana labanyenti be-`<annotations>` ku-`<graph>`; bonkhe ngaphandle kwelokugcina bashaywa indziva.

## Referring to other components

copy-unrecognized-component-type = Akukhonakali kwelula nobe kukopa luhlobo lwesicheme lolungatiwa: { $type }.

copy-prop-not-found = Akutfolakali sici { $property } kusicheme seluhlobo lwe-{ $component }

collect-no-source = Akutfolakali umtfombo we-collect.

collect-invalid-component-type = Akukhonakali kubutsa ticheme teluhlobo lwe-`<{ $component }>` ngobe kuluhlobo lwesicheme lolungasilo.

reference-index-unavailable = Akukhonakali kukhomba inombolo `{ $reference }`

## `<callAction>`

component-action-unavailable = Akukhonakali kubita { $action } kusicheme `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Idatha inesimo lesingasiso.  Imidvwa inebudze lobungefani. Kutfolwe ku-componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Idatha inemabito emakholomu laphindzaphindziwe.  Kutfolwe ku-componentIdx :{ $componentIdx }

data-frame-missing-column-name = Idatha ayinalo libito lelikholomu.  Kutfolwe ku-componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = I-award yalemphendvulo yakhelwe emphendvulweni yalethegi ye-answer ngekwayo, loko kutawuletsa kutiphatsa lokungakalindzeleki.

answer-max-num-attempts-in-section-wide-check-work = Kubeka `maxNumAttempts` ku-`<answer>` lengekhatsi kwesitsi lesine-`sectionWideCheckWork` akunamtselela, ngobe linani lekuzama likhawulelwa sitsi. Beka `maxNumAttempts` esitsini.

nested-section-wide-check-work-max-num-attempts = Kubeka `maxNumAttempts` esitsini lesine-`sectionWideCheckWork` lesingekhatsi kwalesinye lesine-`sectionWideCheckWork` akunamtselela, ngobe linani lekuzama likhawulelwa sitsi sangaphandle. Beka `maxNumAttempts` esitsini sangaphandle.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Sici se-{ $attributes } ngeke sibe nemtselela ngaphandle kwe-symbolicEquality.
       *[other] Tici te-{ $attributes } ngeke tibe nemtselela ngaphandle kwe-symbolicEquality.
    }

answer-invalid-type = Luhlobo lolungasilo lwemphendvulo: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Njengoba sicheme `<{ $component }>` singenalo libito, ngeke sisetjentiswe njengesici se-module

module-attribute-name-already-defined = Sicheme `<{ $component } name="{ $name }">` ngeke sisetjentiswe njengesici se-module ngobe luhlobo lwesicheme lwe-`<module>` selunaso sici se-"{ $name }".

conditional-content-condition-ignored = Sici se-`condition` siyashaywa indziva kusicheme se-`<conditionalContent>` lesinebantfwana be-case nobe be-else.

slider-markers-type-mismatch = Luhlobo lwemamakha aluhambelani neluhlobo lwe-slider.

pretzel-problem-needs-statement-and-answer = i-pretzel lengasiyo: `<problem>` yinye ngayinye kufanele ibe ne-`<statement>` yinye ne-`<answer>` yinye.

pretzel-circuit-first-problem-distractor = i-pretzel lengasiyo: ku-mode="circuit", `<problem>` yekucala ngeke ibe sitfikamezi.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Linani lelingasilo { $values } lesici `{ $attribute }`; kuyashaywa indziva.
       *[other] Emanani langesiwo { $values } esici `{ $attribute }`; kuyashaywa indziva.
    }

attribute-must-be-references = Linani lelingasilo `{ $value }` lesici `{ $attribute }`. Sici kufanele sakhiwe ngetinkhomba leticala nge-`$`.

math-input-invalid-function-names = <mathInput>: kushaywe indziva emabito emisebenti langesiwo ku-{ $attribute }: { $names }. Incenye yekukhombisa yelibito ngalinye kufanele ibe netinhlamvu letimbili nakancane (tinhlamvu nobe imigcina); i-`|<mathspeak alternative>` ingalandzela.

## Building components from the source

component-type-invalid = Luhlobo lwesicheme lolungasilo: `<{ $componentType }>`

attribute-repeated = Akukhonakali kuphindza sici { $attribute }.

attribute-invalid-for-component = Sici lesingasiso "{ $attribute }" sesicheme seluhlobo lwe-`<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Inchazelo yesitayela { $styleNumber } ayinawo umehluko lowanele we-{ $context ->
        [text-on-background] mbala wembhalo ngekumelana nembala wesizinda
        [high-contrast] mbala wemehluko lomkhulu ngekumelana nekhenvasi
        [line] mbala wemudvwa ngekumelana nekhenvasi
        [marker] mbala welimakha ngekumelana nekhenvasi
       *[text-on-canvas] mbala wembhalo ngekumelana nekhenvasi
    }{ $mode ->
        [dark] { " (indlela lemnyama)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kudzingeka { $threshold }:1 nakancane).

style-definition-dark-mode-text-background-contrast =
    Nanobe inchazelo yesitayela { $styleNumber } ibeke imibala lenemehluko lowanele wendlela lekhanyako, imibala yendlela lemnyama letfolwe kulamanani ayinawo umehluko lowanele wembala wembhalo ngekumelana nembala wesizinda ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kudzingeka { $threshold }:1 nakancane). { $suggestion ->
        [available] Kute kucine kunemehluko lowanele endleleni lemnyama, khulisa umehluko wendlela lekhanyako (sib., beka { $lightAttribute }="{ $lightColor }") nobe uguqule umbala wendlela lemnyama (sib., beka { $darkAttribute }="{ $darkColor }").
       *[none] Kute kucine kunemehluko lowanele endleleni lemnyama, khulisa umehluko wendlela lekhanyako nobe uguqule imibala letfolakele nge-textColorDarkMode na/nobe backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Nanobe inchazelo yesitayela { $styleNumber } ibeke umbala wembhalo lonemehluko lowanele wendlela lekhanyako, umbala wembhalo wendlela lemnyama lotfolwe kulelinani awunawo umehluko lowanele ngekumelana nekhenvasi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; kudzingeka { $threshold }:1 nakancane). { $suggestion ->
        [available] Kute kucine kunemehluko lowanele endleleni lemnyama, khulisa umehluko wendlela lekhanyako (sib., beka textColor="{ $lightColor }") nobe uguqule umbala wendlela lemnyama (sib., beka textColorDarkMode="{ $darkColor }").
       *[none] Kute kucine kunemehluko lowanele endleleni lemnyama, khulisa umehluko wendlela lekhanyako nobe uguqule umbala lotfolakele nge-textColorDarkMode.
    }

section-multiple-style-palettes = Sigaba singakhetsa <stylePalette> yinye kuphela; kusetjentiswa yekugcina.

## Unique variants

variant-num-to-select-not-non-negative-integer = akukhonakali kubona tinhlobo letehlukile te-{ $component } ngobe numToSelect akusilo linani lelipheleleko lelingenhla kwaliphelele.

variant-num-to-select-not-constant-number = akukhonakali kubona tinhlobo letehlukile te-{ $component } ngobe numToSelect akusilo linani lelingaguquki.

variant-with-replacement-not-constant-boolean = akukhonakali kubona tinhlobo letehlukile te-{ $component } ngobe withReplacement akusiyo i-boolean lengaguquki.

variant-select-weight-disables-unique = Tinhlobo letehlukile te-select tiyavalwa nangabe kunenketselo lene-selectWeight nobe selectForVariants

variant-coprime-undetermined = akukhonakali kubona tinhlobo letehlukile te-{ $component } ngobe akukhonakali kubona kutsi coprime ihlala ingemanga.

variant-attribute-not-constant = akukhonakali kubona tinhlobo letehlukile te-{ $component } ngobe { $attribute } ayihlali ifana.

variant-attribute-not-number = akukhonakali kubona tinhlobo letehlukile te-{ $component } ngobe { $attribute } akusilo linani.

variant-attribute-wrong-type-for-sequence =
    akukhonakali kubona tinhlobo letehlukile te-{ $component } yeluhlobo lwe-{ $type } ngobe { $attribute } akusiyo { $expected ->
        [letters-combination] inhlanganisela yetinhlamvu
        [math-expression] inkhulumo yetibalo levunyelwe
        [integer] linani lelipheleleko
       *[number] linani
    }.

variant-length-not-integer = akukhonakali kubona tinhlobo letehlukile te-{ $component } ngobe length akusilo linani lelipheleleko.

variant-sort-not-implemented = akukentiwa tinhlobo letehlukile te-{ $component } lene-sort

variant-exclude-combinations-not-implemented = akukentiwa tinhlobo letehlukile te-{ $component } lene-excludeCombinations

variant-math-exclude-not-implemented = akukentiwa tinhlobo letehlukile te-{ $component } yeluhlobo lwe-math lene-exclude

variant-non-constant-exclude-not-implemented = akukentiwa tinhlobo letehlukile te-{ $component } lene-exclude leguquguqukako

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ayisekelwa kumkhombisi we-graph prefigure; situkulwane sishiyiwe.

prefigure-descendant-invalid-geometry = { $subject }: i-geometry lengapheli nobe lengakapheleli; situkulwane sishiyiwe.

prefigure-curve-label-omitted = { $subject }: emabito akasekelwa kuticheme temjiko letiguculiwe; libito lishiyiwe.

prefigure-curve-unsupported-definition-type = { $subject }: luhlobo lwenchazelo yemsebenti wemjiko '{ $definitionType }' alusekelwa; situkulwane sishiyiwe.

prefigure-region-flip-functions-unsupported = { $subject }: sici se-flipFunctions ku-regionBetweenCurves asisekelwa; situkulwane sishiyiwe.

prefigure-region-non-formula-child = { $subject }: kusekelwa kuphela imisebenti yebantfwana yeluhlobo lwe-formula ku-regionBetweenCurves; situkulwane sishiyiwe.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' ayisekelwa ku-{ $labelKind ->
        [line-family] libito lemndeni wemidvwa
       *[point] libito leliphuzu
    }; kusetjentiswa kulinganisa lokuvamile kwe-PreFigure.

prefigure-fill-style-unsupported = { $subject }: sitayela sekugcwalisa '{ $fillStyle }' asisekelwa yi-PreFigure; kubuyelwa ekugcwaliseni lokuchubekako.

prefigure-line-style-unknown = { $subject }: sitayela semudvwa lesingatiwa '{ $lineStyle }' sishiywe kulokuphuma kwe-PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: sitayela selimakha '{ $markerStyle }' siguculelwe kusitayela se-PreFigure se-'diamond'.

prefigure-marker-style-unsupported = { $subject }: sitayela selimakha '{ $markerStyle }' asisekelwa yi-PreFigure; kusetjentiswa sitayela lesivamile.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` lengasiyo; akukhonakali kutfola umgomo. Inchazelo ishiyiwe.

annotation-ref-multiple-targets = `<annotation>`: `ref` ikhombe emigomeni leminyenti; kusetjentiswa umgomo wekucala.

annotation-ref-outside-graph = `<annotation>`: `ref` lengasiyo; umgomo ungephandle kwe-graph leyibambile. Inchazelo ishiyiwe.

annotation-ref-unsupported-target = `<annotation>`: `ref` lengasiyo; umgomo akusiyo intfo yemfanekiso lesekelwako ekuguculweni kwe-prefigure. Inchazelo ishiyiwe.

annotation-text-missing = `<annotation>`: `text` ayikho nobe ayinalutfo; kukhishwa umbhalo longenalutfo.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Kutfolwe kwentiwa kwendingilizi.
       *[other] Kutfolwe kwentiwa kwendingilizi lokufaka sicheme se-`<{ $componentType }>`.
    }

reference-no-referent = Akukho lokutfolakele kulenkhomba: `{ $reference }`

reference-multiple-referents = Kutfolwe tintfo letinyenti kulenkhomba: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Sakhiwo lesingasiso sesici { $attribute } se-`<{ $componentType }>`.

children-invalid = Bantfwana labangasibo be-`<{ $componentType }>`: Kutfolwe bantfwana labangasibo: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Linani lelingasilo `{ $value }` lesici `{ $attribute }`, kusetjentiswa linani `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Umshini we-DoenetML { $version } awutfolakali.
       *[other] Umshini we-DoenetML { $version } awutfolakali. Kubuyelwa emshinini { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = i-DoenetML lengasiyo: { $content }

parse-tag-missing-close-tag = i-DoenetML lengasiyo: Ithegi `{ $tag }` ayinayo ithegi yekuvala. Bekulindzeleke ithegi letivalako nobe ithegi ye-`</{ $tagName }>`.

parse-tag-error = i-DoenetML lengasiyo: Liphutsa kuthegi `<{ $tagName }>`

parse-attribute-missing-value = i-DoenetML lengasiyo: Sici lesingasiso `{ $attribute }` sibonakala singenalo linani.

parse-attribute-invalid = i-DoenetML lengasiyo: Sici lesingasiso `{ $attribute }`

parse-attribute-value-invalid = i-DoenetML lengasiyo: Linani lesici lelingasilo `{ $value }`

parse-attribute-value-quote-mismatch = i-DoenetML lengasiyo: Linani lesici lelingasilo `{ $value }`. Timphawu tekucaphuna atihambelani. Kubonakala kutsi kusweleka `{ $quote }`

parse-open-tag-name-missing = i-DoenetML lengasiyo: Kutfolwe ithegi lengenalo libito, sib. `<`

parse-tag-not-closed = i-DoenetML lengasiyo: Ithegi `{ $tag }` ayikavalwa (kubonakala `>` isweleka).

parse-self-closing-tag-name-missing = i-DoenetML lengasiyo: Kutfolwe ithegi lengenalo libito `<{ $content }>`

parse-self-closing-tag-not-closed = i-DoenetML lengasiyo: Ithegi `{ $tag }` ayikavalwa (kubonakala `/>` isweleka).

parse-tag-invalid-attributes = i-DoenetML lengasiyo: Ithegi `{ $tag }` ayivunyelwe. Ingaba netici letingasito.

parse-close-tag-name-missing = i-DoenetML lengasiyo: Kutfolwe ithegi yekuvala lengenalo libito, sib. `</`

parse-attribute-value-unquoted = Emanani etici kufanele abe ngekhatsi kwetimphawu tekucaphuna: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = i-DoenetML lengasiyo: Kutfolwe ithegi yekuvala `{ $tag }`, kodvwa kute ithegi yekuvula lehambisanako

parse-close-tag-mismatched = i-DoenetML lengasiyo: Ithegi yekuvala ayihambelani. Bekulindzeleke `</{ $expected }>`. Kutfolwe `{ $found }`

parser-node-unconvertible = Akukhonakalanga kuguqula i-node { $node } ibe yi-node ye-Dast.

## Names

name-attribute-invalid =
    Libito lesici alisilo name='{ $name }'. { $reason ->
        [characters] Emabito angaba netinhlamvu, emanani, timphawu letihlanganisako nobe imigcina kuphela.
       *[start] Emabito kufanele acale ngenhlamvu.
    }

component-name-invalid-start = Libito lesicheme alisilo "{ $name }". Emabito kufanele acale ngenhlamvu.

## `<answer>` sugar

answer-video-watched-missing-video = Imphendvulo yeluhlobo lwe-videoWatched kufanele ibe nesici se-video

answer-video-watched-video-not-reference = Imphendvulo yeluhlobo lwe-videoWatched kufanele ibe nesici se-video lesiyinkhomba

answer-name-not-single-text = Sici se-name semphendvulo kufanele sibe nemntfwana munye wembhalo

## Referencing another document

external-doenetml-recursion-limit = Akukhonakalanga kutfola i-DoenetML yangaphandle ngenca yemazinga lamanyenti kakhulu ekuphindzaphindza. Ingabe kunenkhomba lengumjikelezo?

external-doenetml-unavailable = Akukhonakalanga kutfola i-DoenetML ku-{ $attribute }="{ $uri }"

external-doenetml-type-mismatch = i-DoenetML letfolwe ku-{ $attribute }="{ $uri }" ayisiyo: ayihambelanga neluhlobo lwesicheme lwe-"{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Sici `{ $from }` asisasetjentiswa; sebentisa `{ $to }` esikhundleni sakhe.
       *[other] [deprecation] Sici `{ $from }` ku-`<{ $component }>` asisasetjentiswa; sebentisa `{ $to }` esikhundleni sakhe.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Sici `{ $from }` asisasetjentiswa futsi siyashaywa indziva ngobe na-`{ $to }` ubekiwe.
       *[other] [deprecation] Sici `{ $from }` ku-`<{ $component }>` asisasetjentiswa futsi siyashaywa indziva ngobe na-`{ $to }` ubekiwe.
    }

deprecated-attribute-ignored = [deprecation] Sici `{ $attribute }` ku-`<{ $component }>` asisasetjentiswa futsi siyashaywa indziva.

deprecated-attribute-to-child = [deprecation] Sici `{ $attribute }` ku-`<{ $component }>` asisasetjentiswa; sebentisa umntfwana we-`<{ $child }>` esikhundleni sakhe.

deprecated-attribute-value-renamed = [deprecation] Linani `{ $value }` lesici `{ $attribute }` ku-`<{ $component }>` alisasetjentiswa; sebentisa `{ $to }` esikhundleni salo.


## Language coverage

pluralize-english-only = `<pluralize>` ingakhona kwenta bunyenti besiNgisi kuphela, ngako umbhalo wayo ushiywa unjalo emculwini lobhalwe nge-{ $locale }. Bhala sakhiwo sebunyenti ngco, nobe usibeke ngesici se-`pluralForm`.


## Checking against the schema

schema-element-unrecognized = Sicheme `<{ $tag }>` akusiso sicheme se-Doenet lesatiwako.

schema-element-not-allowed-at-root = Sicheme `<{ $tag }>` asivunyelwe esicalweni semculu.

schema-element-not-allowed-inside = Sicheme `<{ $tag }>` asivunyelwe ngekhatsi kwe-`<{ $parent }>`.

schema-attribute-unrecognized = Sicheme `<{ $tag }>` asinaso sici lesibitwa `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Sici `{ $attribute }` sesicheme `<{ $tag }>` kufanele sibe luhlu lolunetintfo letinye ngayinye ngu: { $allowed }
       *[other] Sici `{ $attribute }` sesicheme `<{ $tag }>` kufanele sibe ngulesinye sa: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Libito leluhlobo alisilo ku-select.  Libito leluhlobo { $variantName } livela etinketselweni letingu-{ $numOptions } kodvwa linani lekukhetsa ngu-{ $numToSelect }.

select-variant-name-without-options = Letinye tinhlobo tibekiwe ku-select kodvwa kute tinketselo letibekiwe telibito leluhlobo lelingenteka: { $variantName }.

select-variant-name-not-possible = Libito leluhlobo { $variantName } lelibekiwe ku-select akusilo libito leluhlobo lelingenteka.

select-too-few-options = Akukhonakali kukhetsa ticheme letingu-{ $numToSelect } kuletingu-{ $numOptions } kuphela.

select-from-sequence-too-few-values = Akukhonakali kukhetsa emanani langu-{ $numToSelect } kulandzelano lwebudze bemu-{ $length }.

select-from-sequence-indices-count-mismatch = Linani letinombolo letibekiwe ku-select kufanele lihambelane nelinani lekukhetsa

select-from-sequence-indices-not-integers = Tonkhe tinombolo letibekiwe ku-select kufanele tibe ngemanani lapheleleko

select-from-sequence-index-excluded = Inombolo lebekiwe ye-selectfromsequence beyikhishiwe

select-from-sequence-indices-excluded-combination = Tinombolo letibekiwe te-selectfromsequence bekuyinhlanganisela lekhishiwe

select-from-sequence-coprime-not-positive-integers = Akukhonakali kukhetsa tinhlanganisela te-coprime ngobe akukhetfwa emanani lapheleleko lasetulu kwaliphelele.

select-from-sequence-coprime-common-factor = Akukhonakali kukhetsa emanani e-coprime. Onkhe emanani langenteka anesehlukanisi lesifanako. (Emanani labekiwe e-"from" nobe "to" kufanele abe yi-coprime ne-"step".)

select-from-sequence-coprime-single-number = Akukhonakali kukhetsa tinhlanganisela te-coprime kulinani linye lelingesilo 1.

select-from-sequence-excluded-too-many-combinations = Kukhishwe ngetulu kwema-70% etinhlanganisela ku-selectFromSequence

select-from-sequence-coprime-none-found = Akukhonakalanga kukhetsa emanani e-coprime. Onkhe emanani langenteka anesehlukanisi lesifanako.

select-from-sequence-too-few-unique-values = Akukhonakali kukhetsa emanani lehlukile langu-{ $numToSelect } kulandzelano lwebudze bemu-{ $numPossibleValues }

select-prime-numbers-too-few-values = Akukhonakali kukhetsa emanani langu-{ $numToSelect } eluhlwini lwemanani e-prime lwebudze bemu-{ $numValues }

select-prime-numbers-values-count-mismatch = Linani lemanani labekiwe ku-select kufanele lihambelane nelinani lekukhetsa

select-prime-numbers-values-not-prime = Onkhe emanani labekiwe ku-select prime number kufanele abe seluhlwini lwemanani e-prime

select-prime-numbers-values-excluded-combination = Emanani labekiwe e-selectPrimeNumbers bekuyinhlanganisela lekhishiwe

select-prime-numbers-excluded-too-many-combinations = Kukhishwe ngetulu kwema-70% etinhlanganisela ku-selectPrimeNumbers

select-random-combination-fluke = Ngenhlanhla lengakalindzeleki, akukhonakalanga kukhetsa inhlanganisela yemanani langakalindzeleki

select-random-value-fluke = Ngenhlanhla lengakalindzeleki, akukhonakalanga kukhetsa linani lelingakalindzeleki
