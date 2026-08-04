# Slovene diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Slovene counts in four plural categories, `two` among them, and which of them
# a message needs depends on what the count does in it. A message that prints
# the number next to a noun agrees that noun with it and so spells out `one`,
# `two` and `few`. A message where the number never appears — the list
# messages, whose count only decides whether a verb is singular or plural — has
# the two forms Slovene offers there, so `one` and `*[other]` are the whole
# selection.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } se prezre, kadar sta podani obe krajišči
       *[other] { $attributes } se prezrejo, kadar sta podani obe krajišči
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } se prezre, kadar sta podana krajišče in razpolovišče
       *[other] { $attributes } se prezrejo, kadar sta podana krajišče in razpolovišče
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset nima učinka brez podanega razpolovišča

## `<line>`

line-points-undetermined-dimensions = Premica skozi točke nedoločene razsežnosti.

line-points-too-few-dimensions = Premica mora potekati skozi točke razsežnosti vsaj dve.

line-points-depend-on-variables = Premica poteka skozi točke, ki so odvisne od spremenljivk: { $variables }.

line-equation-invalid-format = Neveljavna oblika enačbe premice v spremenljivkah { $variable1 } in { $variable2 }.

## `<ray>`

ray-overprescribed-through = Poltrak je podan z through, endpoint in direction. Podano through se prezre.

ray-dimension-mismatch = Neujemanje numDimensions pri poltraku.

## `<vector>`

vector-overprescribed-head = Vektor je podan s head, tail in displacement. Podano head se prezre.

vector-dimension-mismatch = Neujemanje numDimensions pri vektorju.

## Attracting and constraining

attract-to-without-nearest-point = Privlačevanje k `<{ $component }>` ni mogoče, ker nima spremenljivke stanja nearestPoint.

constrain-to-without-nearest-point = Omejevanje na `<{ $component }>` ni mogoče, ker nima spremenljivke stanja nearestPoint.

constrain-to-interior-without-nearest-point = Omejevanje na notranjost `<{ $component }>` ni mogoče, ker nima spremenljivke stanja nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition se pri nevgrajenem choiceInput prezre

## Ordering children by index

choice-input-indices-count-mismatch = Indeksi, podani za choiceInput, se prezrejo, ker njihovo število ne ustreza številu podrejenih choice.

pretzel-indices-count-mismatch = Indeksi, podani za problem, se prezrejo, ker njihovo število ne ustreza številu podrejenih problem.

shuffle-indices-count-mismatch = Indeksi, podani za shuffle, se prezrejo, ker njihovo število ne ustreza številu komponent.

indices-ignored-out-of-range = Indeksi, podani za { $component }, se prezrejo, ker so nekateri zunaj obsega.

pretzel-indices-repeated = Indeksi, podani za pretzel, se prezrejo, ker se nekateri ponavljajo.

pretzel-circuit-first-index = Indeksi, podani za pretzel v načinu circuit, se prezrejo, ker mora biti prvi indeks 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Da bi `<{ $component }>` deloval z besedilnimi podrejenimi elementi, mora biti podan atribut `type`.

invalid-type-defaulting-to-math = Neveljavna vrsta { $type } za komponento { $component }. Biti mora math, text, number ali boolean. Uporablja se math.

string-not-valid-component-to-arrange = Niz »{ $value }« ni veljavna komponenta za { $component }. Prezre se.

## Types and variables

invalid-type-defaulting-to-number = Neveljavna vrsta { $type }; vrsta se nastavi na number.

invalid-variable-value = Neveljavna vrednost spremenljivke: `{ $value }`

## Variants

variant-index-must-be-number = Indeks različice { $index } mora biti število

variant-index-must-be-integer = Indeks različice { $index } mora biti celo število

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ni izveden za absolutne mere. Širine postanejo relativne.

side-by-side-absolute-margins = `<{ $component }>` ni izveden za absolutne mere. Robovi postanejo relativni.

side-by-side-no-block-child = Neveljaven `<{ $component }>`: imeti mora vsaj enega bločnega podrejenega elementa.

## `<label>`

label-for-ignored-on-graphical = Atribut `for` pri grafičnem `<label>` se prezre.

label-for-must-resolve-to-one = Atribut `for` pri `<label>` mora voditi natanko do ene komponente.

label-for-unresolved = Atributa `for` pri `<label>` ni bilo mogoče razrešiti v komponento.

label-for-answer-with-authored-inputs = Atribut `for` pri `<label>` se sklicuje na `<answer>` z izrecno zapisanimi vnosnimi polji; sklicujte se neposredno na polje.

label-for-answer-without-input = Atribut `for` pri `<label>` se sklicuje na `<answer>` brez vnosnega polja, ki bi ga označil.

label-for-must-reference-input-or-answer = Atribut `for` pri `<label>` se mora sklicevati na vnosno polje ali na odgovor.

## Accessibility

accessibility-short-description-or-decorative = Zaradi dostopnosti mora `<{ $component }>` imeti kratek opis ali biti označen kot okrasen.

accessibility-video-short-description = Zaradi dostopnosti mora `<video>` imeti kratek opis.

accessibility-input-short-description-or-label = Zaradi dostopnosti mora `<{ $component }>` imeti kratek opis ali oznako.

accessibility-answer-input-short-description-or-label = Zaradi dostopnosti mora `<answer>`, ki ustvarja vnosno polje, imeti kratek opis ali oznako.

accessibility-short-description-contains-math = Kratki opisi ne bi smeli vsebovati matematičnih komponent, kot je `<{ $component }>`. Matematiko izpišite z besedami.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ima premajhen kontrast za besedilo naslova razdelka (temna tema) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; potrebno je vsaj { $threshold }:1).
       *[other] { $colorName } ima premajhen kontrast za besedilo naslova razdelka ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; potrebno je vsaj { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` skozi { $count } točk ni izvedena, kadar točke nimajo številskih vrednosti.

circle-too-many-through-points = Krožnice skozi več kot 3 točke ni mogoče izračunati.

circle-overprescribed-radius-center-points = Krožnice s podanim polmerom, središčem in točkami ni mogoče izračunati.

circle-center-with-multiple-points = Krožnice s podanim središčem skozi več kot 1 točko ni mogoče izračunati.

circle-radius-too-small = Krožnice ni mogoče izračunati: ker je razdalja med točkama { $distance }, je podani polmer { $radius } premajhen.

circle-radius-with-many-points = Krožnice skozi več kot dve točki s podanim polmerom ni mogoče sestaviti.

circle-invalid-center-or-through-points = Neveljavno središče ali točke krožnice.

circle-radius-center-with-multiple-points = Polmera krožnice s podanim središčem skozi več kot 1 točko ni mogoče izračunati.

circle-change-radius-non-numerical = Polmera krožnice s neštevilskimi točkami ni mogoče spremeniti

circle-radius-with-points-non-numerical = Krožnice skozi več kot eno točko s podanim polmerom ni mogoče sestaviti, kadar ni številskih vrednosti.

circle-change-center-non-numerical = Spreminjanje središča krožnice skozi neštevilske točke ni izvedeno.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Premalo razsežnosti za domeno funkcije. Domena ima { $intervals } interval, funkcija pa { $inputs ->
            [one] { $inputs } vhod
            [two] { $inputs } vhoda
            [few] { $inputs } vhode
           *[other] { $inputs } vhodov
        }.
        [two] Premalo razsežnosti za domeno funkcije. Domena ima { $intervals } intervala, funkcija pa { $inputs ->
            [one] { $inputs } vhod
            [two] { $inputs } vhoda
            [few] { $inputs } vhode
           *[other] { $inputs } vhodov
        }.
        [few] Premalo razsežnosti za domeno funkcije. Domena ima { $intervals } intervale, funkcija pa { $inputs ->
            [one] { $inputs } vhod
            [two] { $inputs } vhoda
            [few] { $inputs } vhode
           *[other] { $inputs } vhodov
        }.
       *[other] Premalo razsežnosti za domeno funkcije. Domena ima { $intervals } intervalov, funkcija pa { $inputs ->
            [one] { $inputs } vhod
            [two] { $inputs } vhoda
            [few] { $inputs } vhode
           *[other] { $inputs } vhodov
        }.
    }

function-domain-invalid-format = Neveljavna oblika domene funkcije.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Neštevilski maksimum funkcije se prezre.
        [minimum] Neštevilski minimum funkcije se prezre.
        [extremum] Neštevilski ekstrem funkcije se prezre.
        [point] Neštevilska točka funkcije se prezre.
        [slope] Neštevilski naklon funkcije se prezre.
       *[other] Neštevilsko { $type } funkcije se prezre.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Prazen maksimum funkcije se prezre.
        [minimum] Prazen minimum funkcije se prezre.
        [extremum] Prazen ekstrem funkcije se prezre.
        [point] Prazna točka funkcije se prezre.
       *[other] Prazno { $type } funkcije se prezre.
    }

function-points-too-close = Funkcija vsebuje dve točki, ki sta preblizu. Funkcije ni mogoče določiti.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Iteracije funkcije so mogoče le, če je število vhodov enako številu izhodov. Ta funkcija ima { $inputs } vhod in { $outputs ->
            [one] { $outputs } izhod
            [two] { $outputs } izhoda
            [few] { $outputs } izhode
           *[other] { $outputs } izhodov
        }.
        [two] Iteracije funkcije so mogoče le, če je število vhodov enako številu izhodov. Ta funkcija ima { $inputs } vhoda in { $outputs ->
            [one] { $outputs } izhod
            [two] { $outputs } izhoda
            [few] { $outputs } izhode
           *[other] { $outputs } izhodov
        }.
        [few] Iteracije funkcije so mogoče le, če je število vhodov enako številu izhodov. Ta funkcija ima { $inputs } vhode in { $outputs ->
            [one] { $outputs } izhod
            [two] { $outputs } izhoda
            [few] { $outputs } izhode
           *[other] { $outputs } izhodov
        }.
       *[other] Iteracije funkcije so mogoče le, če je število vhodov enako številu izhodov. Ta funkcija ima { $inputs } vhodov in { $outputs ->
            [one] { $outputs } izhod
            [two] { $outputs } izhoda
            [few] { $outputs } izhode
           *[other] { $outputs } izhodov
        }.
    }

## `<sequence>`

sequence-invalid-length = Neveljavna dolžina zaporedja. Biti mora nenegativno celo število.

sequence-invalid-step = Neveljaven korak zaporedja. Za zaporedje vrste { $type } mora biti število.

sequence-invalid-endpoint-number = Neveljaven »{ $attribute }« številskega zaporedja. Biti mora število.

sequence-invalid-endpoint-letters = Neveljaven »{ $attribute }« črkovnega zaporedja. Biti mora kombinacija črk.

sequence-invalid-endpoint = Neveljaven »{ $attribute }« zaporedja.

select-from-sequence-coprime-not-numbers = coprime se prezre, ker se ne izbirajo števila

select-from-sequence-coprime-with-exclude-combinations = coprime se prezre, ker je podan excludeCombinations

## Resolving a `target`

target-not-found = Neveljaven target za `<{ $source }>`: cilja ni mogoče najti.

target-state-variable-not-found = Neveljaven target za `<{ $source }>`: `<{ $component }>` nima spremenljivke stanja z imenom »{ $property }«.

## `<odeSystem>`

ode-system-variables-match-independent = Spremenljivke `<odeSystem>` se morajo razlikovati od neodvisne spremenljivke.

ode-system-duplicate-variable-names = Desnih strani DE ni mogoče določiti s podvojenimi imeni odvisnih spremenljivk.

ode-system-rhs-function-error = Desne strani DE ni mogoče določiti. Napaka pri ustvarjanju funkcije mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Kota med { $count } premicami ni mogoče določiti

angle-invalid-through-point = Neveljavna točka v through pri `<angle>`

parabola-vertex-too-many-points = Parabola s podanim temenom skozi več kot 1 točko ni izvedena.

parabola-too-many-points = Parabola skozi več kot 3 točke ni izvedena.

intersection-too-many-items = Presek več kot dveh objektov ni izveden

## Other math components

ionic-compound-not-two-ions = Ionske spojine razen tistih iz dveh ionov niso izvedene.

ionic-compound-needs-cation-and-anion = Ionske spojine so izvedene le za en kation in en anion.

solve-equations-cannot-evaluate = Enačbe ni mogoče rešiti, ker je ni bilo mogoče izračunati: { $equation }

math-operators-operand-number-required = Za izluščenje matematičnega operanda je treba podati operandNumber.

eigen-decomposition-failed = Lastnih vrednosti matrike ni bilo mogoče izračunati

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameter { $parameters } se v vzorcu ne pojavi, zato se bo vedno ujemal s praznino.
       *[other] `<matchesPattern>`: parametri { $parameters } se v vzorcu ne pojavijo, zato se bodo vedno ujemali s praznino.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" ni mogoče razbrati. Vrednost mora biti none, medium, dense ali dve pozitivni števili, ločeni s presledkom, na primer grid="1 0.5". Mreža se ne nariše.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" v izrisovalniku prefigure ni podprt; uporablja se vedenje za desni položaj.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" v izrisovalniku prefigure ni podprt; uporablja se vedenje za zgornji položaj.

prefigure-invalid-axis-bounds = `<graph>`: neveljavne meje osi za pretvorbo v prefigure; uporablja se privzeti bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: neveljavna širina za pretvorbo v prefigure; uporablja se privzeta širina diagrama 425.

prefigure-invalid-aspect-ratio = `<graph>`: neveljaven aspectRatio za pretvorbo v prefigure; uporablja se privzeto razmerje stranic 1.

prefigure-grid-spacing-too-fine = `<graph>`: razmik mreže je pregost za meje osi; v izrisovalniku prefigure se mreža izpusti.

prefigure-annotations-not-rendered = `<graph>`: zunaj izrisovalnika PreFigure se pripisi ne izrišejo.

multiple-annotations-children = V `<graph>` je najdenih več podrejenih `<annotations>`; vsi razen zadnjega se prezrejo.

## Referring to other components

copy-unrecognized-component-type = Neprepoznane vrste komponente ni mogoče razširiti ali kopirati: { $type }.

copy-prop-not-found = Lastnosti { $property } ni mogoče najti na komponenti vrste { $component }

collect-no-source = Za collect ni najdenega vira.

collect-invalid-component-type = Komponent vrste `<{ $component }>` ni mogoče zbirati, ker je to neveljavna vrsta komponente.

reference-index-unavailable = Na indeks `{ $reference }` se ni mogoče sklicevati

## `<callAction>`

component-action-unavailable = { $action } ni mogoče poklicati na komponenti `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Podatki imajo neveljavno obliko. Vrstice so različno dolge. Najdeno v componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Podatki imajo podvojena imena stolpcev. Najdeno v componentIdx :{ $componentIdx }

data-frame-missing-column-name = Podatkom manjka ime stolpca. Najdeno v componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award tega odgovora se opira na oddani odgovor same oznake answer, kar bo vodilo do nepričakovanega vedenja.

answer-max-num-attempts-in-section-wide-check-work = Nastavitev `maxNumAttempts` na `<answer>` znotraj vsebnika s `sectionWideCheckWork` nima učinka, ker število poskusov določa vsebnik. Nastavite `maxNumAttempts` na vsebniku.

nested-section-wide-check-work-max-num-attempts = Nastavitev `maxNumAttempts` na vsebniku s `sectionWideCheckWork`, ki je sam znotraj drugega vsebnika s `sectionWideCheckWork`, nima učinka, ker število poskusov določa zunanji vsebnik. Nastavite `maxNumAttempts` na zunanjem vsebniku.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Atribut { $attributes } brez nastavljenega symbolicEquality ne bo imel učinka.
       *[other] Atributi { $attributes } brez nastavljenega symbolicEquality ne bodo imeli učinka.
    }

answer-invalid-type = Neveljavna vrsta za answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Komponenta `<{ $component }>` nima imena, zato je ni mogoče uporabiti kot atribut modula

module-attribute-name-already-defined = Komponente `<{ $component } name="{ $name }">` ni mogoče uporabiti kot atribut modula, ker ima vrsta komponente `<module>` že določen atribut »{ $name }«.

conditional-content-condition-ignored = Atribut `condition` se pri komponenti `<conditionalContent>` s podrejenimi case ali else prezre.

slider-markers-type-mismatch = Vrsta oznak se ne ujema z vrsto drsnika.

pretzel-problem-needs-statement-and-answer = Neveljaven pretzel: vsak `<problem>` mora vsebovati en `<statement>` in en `<answer>`.

pretzel-circuit-first-problem-distractor = Neveljaven pretzel: pri mode="circuit" prvi `<problem>` ne more biti motilec.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Neveljavna vrednost { $values } za atribut `{ $attribute }`; prezre se.
       *[other] Neveljavne vrednosti { $values } za atribut `{ $attribute }`; prezrejo se.
    }

attribute-must-be-references = Neveljavna vrednost `{ $value }` za atribut `{ $attribute }`. Atribut mora biti sestavljen iz sklicev, ki se začnejo z `$`.

math-input-invalid-function-names = <mathInput>: neveljavna imena funkcij v { $attribute } so bila prezrta: { $names }. Prikazni del vsakega imena mora imeti vsaj 2 znaka (črke ali vezaje); sledi mu lahko neobvezna pripona `|<mathspeak različica>`.

## Building components from the source

component-type-invalid = Neveljavna vrsta komponente: `<{ $componentType }>`

attribute-repeated = Atributa { $attribute } ni mogoče ponoviti.

attribute-invalid-for-component = Neveljaven atribut »{ $attribute }« za komponento vrste `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Določilo sloga { $styleNumber } ima premajhen kontrast za { $context ->
        [text-on-background] barvo besedila glede na barvo ozadja
        [high-contrast] visokokontrastno barvo glede na platno
        [line] barvo črt glede na platno
        [marker] barvo oznak glede na platno
       *[text-on-canvas] barvo besedila glede na platno
    }{ $mode ->
        [dark] { " (temna tema)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; potrebno je vsaj { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Čeprav določilo sloga { $styleNumber } podaja barve z zadostnim kontrastom za svetlo temo, iz njih izpeljane barve za temno temo dajejo premajhen kontrast besedila glede na ozadje ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; potrebno je vsaj { $threshold }:1). { $suggestion ->
        [available] Za zadosten kontrast v temni temi bodisi povečajte kontrast v svetli temi (na primer { $lightAttribute }="{ $lightColor }") bodisi povozite barvo za temno temo (na primer { $darkAttribute }="{ $darkColor }").
       *[none] Za zadosten kontrast v temni temi povečajte kontrast v svetli temi ali povozite izpeljane barve z textColorDarkMode in/ali backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Čeprav določilo sloga { $styleNumber } podaja barvo besedila z zadostnim kontrastom za svetlo temo, iz nje izpeljana barva besedila za temno temo daje premajhen kontrast glede na platno ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; potrebno je vsaj { $threshold }:1). { $suggestion ->
        [available] Za zadosten kontrast v temni temi bodisi povečajte kontrast v svetli temi (na primer textColor="{ $lightColor }") bodisi povozite barvo za temno temo (na primer textColorDarkMode="{ $darkColor }").
       *[none] Za zadosten kontrast v temni temi povečajte kontrast v svetli temi ali povozite izpeljano barvo z textColorDarkMode.
    }

section-multiple-style-palettes = Razdelek lahko izbere samo eno <stylePalette>; uporablja se zadnja.

## Unique variants

variant-num-to-select-not-non-negative-integer = enoličnih različic komponente { $component } ni mogoče določiti, ker numToSelect ni nenegativno celo število.

variant-num-to-select-not-constant-number = enoličnih različic komponente { $component } ni mogoče določiti, ker numToSelect ni konstantno število.

variant-with-replacement-not-constant-boolean = enoličnih različic komponente { $component } ni mogoče določiti, ker withReplacement ni konstantna logična vrednost.

variant-select-weight-disables-unique = Enolične različice za select so onemogočene, če ima katera možnost podan selectWeight ali selectForVariants

variant-coprime-undetermined = enoličnih različic komponente { $component } ni mogoče določiti, ker ni mogoče ugotoviti, da je coprime vedno neresničen.

variant-attribute-not-constant = enoličnih različic komponente { $component } ni mogoče določiti, ker { $attribute } ni konstanta.

variant-attribute-not-number = enoličnih različic komponente { $component } ni mogoče določiti, ker { $attribute } ni število.

variant-attribute-wrong-type-for-sequence =
    enoličnih različic komponente { $component } vrste { $type } ni mogoče določiti, ker { $attribute } ni { $expected ->
        [letters-combination] kombinacija črk
        [math-expression] veljaven matematični izraz
        [integer] celo število
       *[number] število
    }.

variant-length-not-integer = enoličnih različic komponente { $component } ni mogoče določiti, ker length ni celo število.

variant-sort-not-implemented = enolične različice komponente { $component } s sort niso izvedene

variant-exclude-combinations-not-implemented = enolične različice komponente { $component } z excludeCombinations niso izvedene

variant-math-exclude-not-implemented = enolične različice komponente { $component } vrste math z exclude niso izvedene

variant-non-constant-exclude-not-implemented = enolične različice komponente { $component } z nekonstantnim exclude niso izvedene

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: v izrisovalniku prefigure za grafe ni podprto; potomec je preskočen.

prefigure-descendant-invalid-geometry = { $subject }: neskončna ali nepopolna geometrija; potomec je preskočen.

prefigure-curve-label-omitted = { $subject }: oznake na pretvorjenih elementih krivulj niso podprte; oznaka je izpuščena.

prefigure-curve-unsupported-definition-type = { $subject }: nepodprta vrsta določila funkcije krivulje »{ $definitionType }«; potomec je preskočen.

prefigure-region-flip-functions-unsupported = { $subject }: atribut flipFunctions pri regionBetweenCurves ni podprt; potomec je preskočen.

prefigure-region-non-formula-child = { $subject }: pri regionBetweenCurves so podprte samo podrejene funkcije, podane s formulo; potomec je preskočen.

prefigure-label-position-unsupported =
    { $subject }: nepodprt labelPosition »{ $labelPosition }« za { $labelKind ->
        [line-family] oznako iz družine premic
       *[point] oznako točke
    }; uporablja se privzeta poravnava PreFigure.

prefigure-fill-style-unsupported = { $subject }: slog polnila »{ $fillStyle }« v PreFigure ni podprt; uporablja se polno polnilo.

prefigure-line-style-unknown = { $subject }: neznan slog črte »{ $lineStyle }« je izpuščen iz izhoda PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: slog oznake »{ $markerStyle }« je preslikan v slog »diamond« v PreFigure.

prefigure-marker-style-unsupported = { $subject }: slog oznake »{ $markerStyle }« v PreFigure ni podprt; uporablja se privzeti slog.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: neveljaven `ref`; cilja ni mogoče razrešiti. Pripis je izpuščen.

annotation-ref-multiple-targets = `<annotation>`: `ref` se je razrešil v več ciljev; uporablja se prvi.

annotation-ref-outside-graph = `<annotation>`: neveljaven `ref`; cilj je zunaj grafa, ki ga vsebuje. Pripis je izpuščen.

annotation-ref-unsupported-target = `<annotation>`: neveljaven `ref`; cilj pri pretvorbi v prefigure ni podprt grafični objekt. Pripis je izpuščen.

annotation-text-missing = `<annotation>`: `text` manjka ali je prazen; izpiše se prazno besedilo.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Zaznana je krožna odvisnost.
       *[other] Zaznana je krožna odvisnost, ki vključuje komponento `<{ $componentType }>`.
    }

reference-no-referent = Za sklic ni najdenega predmeta: `{ $reference }`

reference-multiple-referents = Za sklic je najdenih več predmetov: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Neveljavna oblika atributa { $attribute } pri `<{ $componentType }>`.

children-invalid = Neveljavni podrejeni elementi za `<{ $componentType }>`: najdeni so neveljavni podrejeni elementi: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Neveljavna vrednost `{ $value }` za atribut `{ $attribute }`; uporablja se vrednost `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Različice { $version } DoenetML ni mogoče najti.
       *[other] Različice { $version } DoenetML ni mogoče najti. Uporablja se različica { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Neveljaven DoenetML: { $content }

parse-tag-missing-close-tag = Neveljaven DoenetML: oznaka `{ $tag }` nima zaključne oznake. Pričakovana je bila samozaključna oznaka ali oznaka `</{ $tagName }>`.

parse-tag-error = Neveljaven DoenetML: napaka v oznaki `<{ $tagName }>`

parse-attribute-missing-value = Neveljaven DoenetML: atributu `{ $attribute }` očitno manjka vrednost.

parse-attribute-invalid = Neveljaven DoenetML: neveljaven atribut `{ $attribute }`

parse-attribute-value-invalid = Neveljaven DoenetML: neveljavna vrednost atributa `{ $value }`

parse-attribute-value-quote-mismatch = Neveljaven DoenetML: neveljavna vrednost atributa `{ $value }`. Narekovaji se ne ujemajo. Očitno manjka `{ $quote }`

parse-open-tag-name-missing = Neveljaven DoenetML: najdena je oznaka brez imena, na primer `<`

parse-tag-not-closed = Neveljaven DoenetML: oznaka `{ $tag }` ni zaprta (očitno manjka `>`).

parse-self-closing-tag-name-missing = Neveljaven DoenetML: najdena je oznaka brez imena `<{ $content }>`

parse-self-closing-tag-not-closed = Neveljaven DoenetML: oznaka `{ $tag }` ni zaprta (očitno manjka `/>`).

parse-tag-invalid-attributes = Neveljaven DoenetML: oznaka `{ $tag }` ni veljavna. Morda ima napačne atribute.

parse-close-tag-name-missing = Neveljaven DoenetML: najdena je zaključna oznaka brez imena, na primer `</`

parse-attribute-value-unquoted = Vrednosti atributov morajo biti v narekovajih: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Neveljaven DoenetML: najdena je zaključna oznaka `{ $tag }`, a ni ustrezne začetne

parse-close-tag-mismatched = Neveljaven DoenetML: neujemajoča se zaključna oznaka. Pričakovana je bila `</{ $expected }>`. Najdena je `{ $found }`

parser-node-unconvertible = Vozlišča { $node } ni bilo mogoče pretvoriti v vozlišče Dast.

## Names

name-attribute-invalid =
    Neveljaven atribut name='{ $name }'. { $reason ->
        [characters] Imena lahko vsebujejo samo črke, števke, podčrtaje ali vezaje.
       *[start] Imena se morajo začeti s črko.
    }

component-name-invalid-start = Neveljavno ime komponente »{ $name }«. Imena se morajo začeti s črko.

## `<answer>` sugar

answer-video-watched-missing-video = answer vrste videoWatched mora imeti atribut video

answer-video-watched-video-not-reference = Pri answer vrste videoWatched mora biti atribut video sklic

answer-name-not-single-text = Atribut name komponente answer mora imeti natanko en besedilni podrejeni element

## Referencing another document

external-doenetml-recursion-limit = Zunanjega DoenetML ni bilo mogoče pridobiti zaradi preveč ravni rekurzije. Ali obstaja krožni sklic?

external-doenetml-unavailable = DoenetML iz { $attribute }="{ $uri }" ni bilo mogoče pridobiti

external-doenetml-type-mismatch = Iz { $attribute }="{ $uri }" je bil pridobljen neveljaven DoenetML: ne ustreza vrsti komponente »{ $componentType }«

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` je opuščen; uporabite `{ $to }`.
       *[other] [deprecation] Atribut `{ $from }` pri `<{ $component }>` je opuščen; uporabite `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` je opuščen in se prezre, ker je podan tudi `{ $to }`.
       *[other] [deprecation] Atribut `{ $from }` pri `<{ $component }>` je opuščen in se prezre, ker je podan tudi `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Atribut `{ $attribute }` pri `<{ $component }>` je opuščen in se prezre.


## Language coverage

pluralize-english-only = `<pluralize>` zna tvoriti množino samo v angleščini, zato v dokumentu v jeziku { $locale } njegovo besedilo ostane nespremenjeno. Množinsko obliko napišite sami ali jo podajte z atributom `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Element `<{ $tag }>` ni prepoznan element Doenet.

schema-element-not-allowed-at-root = Element `<{ $tag }>` v korenu dokumenta ni dovoljen.

schema-element-not-allowed-inside = Element `<{ $tag }>` znotraj `<{ $parent }>` ni dovoljen.

schema-attribute-unrecognized = Element `<{ $tag }>` nima atributa z imenom `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribut `{ $attribute }` elementa `<{ $tag }>` mora biti seznam, katerega vsak član je eden od: { $allowed }
       *[other] Atribut `{ $attribute }` elementa `<{ $tag }>` mora biti eden od: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Neveljavno ime različice za select. Ime različice { $variantName } se pojavi v { $numOptions } možnostih, izbrati pa je treba { $numToSelect }.

select-variant-name-without-options = Za select so podane različice, a ni podana nobena možnost za mogoče ime različice: { $variantName }.

select-variant-name-not-possible = Ime različice { $variantName }, podano za select, ni mogoče ime različice.

select-too-few-options = Ni mogoče izbrati { $numToSelect } komponent iz zgolj { $numOptions }.

select-from-sequence-too-few-values = Ni mogoče izbrati { $numToSelect } vrednosti iz zaporedja dolžine { $length }.

select-from-sequence-indices-count-mismatch = Število indeksov, podanih za select, mora ustrezati številu za izbiro

select-from-sequence-indices-not-integers = Vsi indeksi, podani za select, morajo biti cela števila

select-from-sequence-index-excluded = Podani indeks za selectfromsequence je bil izključen

select-from-sequence-indices-excluded-combination = Podani indeksi za selectfromsequence so tvorili izključeno kombinacijo

select-from-sequence-coprime-not-positive-integers = Tujih kombinacij ni mogoče izbrati, ker se ne izbirajo pozitivna cela števila.

select-from-sequence-coprime-common-factor = Tujih števil ni mogoče izbrati. Vse mogoče vrednosti imajo skupni delitelj. (Podani vrednosti "from" ali "to" morata biti tuji s "step".)

select-from-sequence-coprime-single-number = Tujih kombinacij ni mogoče izbrati iz enega samega števila, ki ni 1.

select-from-sequence-excluded-too-many-combinations = V selectFromSequence je izključenih več kot 70 % kombinacij

select-from-sequence-coprime-none-found = Tujih števil ni bilo mogoče izbrati. Vse mogoče vrednosti imajo skupni delitelj.

select-from-sequence-too-few-unique-values = Ni mogoče izbrati { $numToSelect } različnih vrednosti iz zaporedja dolžine { $numPossibleValues }

select-prime-numbers-too-few-values = Ni mogoče izbrati { $numToSelect } vrednosti s seznama praštevil dolžine { $numValues }

select-prime-numbers-values-count-mismatch = Število vrednosti, podanih za select, mora ustrezati številu za izbiro

select-prime-numbers-values-not-prime = Vse vrednosti, podane za select prime number, morajo biti na seznamu praštevil

select-prime-numbers-values-excluded-combination = Podane vrednosti za selectPrimeNumbers so tvorile izključeno kombinacijo

select-prime-numbers-excluded-too-many-combinations = V selectPrimeNumbers je izključenih več kot 70 % kombinacij

select-random-combination-fluke = Po skrajno neverjetnem naključju ni bilo mogoče izbrati kombinacije naključnih vrednosti

select-random-value-fluke = Po skrajno neverjetnem naključju ni bilo mogoče izbrati naključne vrednosti
