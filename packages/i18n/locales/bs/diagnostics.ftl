# Bosnian diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Bosnian counts in three plural categories, and which of them a message needs
# depends on what the count does in it. A message that prints the number next
# to a noun agrees that noun with it, so it spells out `one` and `few` and lets
# `*[other]` carry the rest. A message where the number never appears — the
# list messages, whose count only decides whether a verb is singular or plural
# — has just the two forms Bosnian offers there, so `one` and `*[other]` are
# the whole selection.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } zanemaruje se kad su zadane obje krajnje tačke
       *[other] { $attributes } zanemaruju se kad su zadane obje krajnje tačke
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } zanemaruje se kad su zadani i krajnja tačka i središte
       *[other] { $attributes } zanemaruju se kad su zadani i krajnja tačka i središte
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset nema učinka bez zadanog središta

## `<line>`

line-points-undetermined-dimensions = Prava kroz tačke neodređene dimenzije.

line-points-too-few-dimensions = Prava mora prolaziti kroz tačke dimenzije najmanje dva.

line-points-depend-on-variables = Prava prolazi kroz tačke koje zavise od varijabli: { $variables }.

line-equation-invalid-format = Neispravan oblik jednačine prave u varijablama { $variable1 } i { $variable2 }.

## `<ray>`

ray-overprescribed-through = Poluprava je zadana pomoću through, endpoint i direction. Zadano through se zanemaruje.

ray-dimension-mismatch = Nesaglasnost numDimensions u komponenti ray.

## `<vector>`

vector-overprescribed-head = Vektor je zadan pomoću head, tail i displacement. Zadano head se zanemaruje.

vector-dimension-mismatch = Nesaglasnost numDimensions u komponenti vector.

## Attracting and constraining

attract-to-without-nearest-point = Nije moguće privlačiti na `<{ $component }>` jer nema state varijablu nearestPoint.

constrain-to-without-nearest-point = Nije moguće ograničiti na `<{ $component }>` jer nema state varijablu nearestPoint.

constrain-to-interior-without-nearest-point = Nije moguće ograničiti na unutrašnjost komponente `<{ $component }>` jer nema state varijablu nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition se zanemaruje za choiceInput koji nije inline

## Ordering children by index

choice-input-indices-count-mismatch = Zanemaruju se indeksi zadani za choiceInput jer broj indeksa ne odgovara broju djece choice.

pretzel-indices-count-mismatch = Zanemaruju se indeksi zadani za problem jer broj indeksa ne odgovara broju djece problem.

shuffle-indices-count-mismatch = Zanemaruju se indeksi zadani za shuffle jer broj indeksa ne odgovara broju komponenata.

indices-ignored-out-of-range = Zanemaruju se indeksi zadani za { $component } jer su neki indeksi izvan opsega.

pretzel-indices-repeated = Zanemaruju se indeksi zadani za pretzel jer se neki indeksi ponavljaju.

pretzel-circuit-first-index = Zanemaruju se indeksi zadani za pretzel u načinu circuit jer prvi indeks mora biti 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Da bi `<{ $component }>` radio s tekstualnom djecom, mora biti zadan atribut `type`.

invalid-type-defaulting-to-math = Neispravan type { $type } za komponentu { $component }. Mora biti math, text, number ili boolean. Postavlja se math.

string-not-valid-component-to-arrange = Tekst "{ $value }" nije valjana komponenta za { $component }. Zanemaruje se.

## Types and variables

invalid-type-defaulting-to-number = Neispravan type { $type }, type se postavlja na number.

invalid-variable-value = Neispravna vrijednost varijable: `{ $value }`

## Variants

variant-index-must-be-number = Indeks varijante { $index } mora biti broj

variant-index-must-be-integer = Indeks varijante { $index } mora biti cijeli broj

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` nije implementiran za apsolutne mjere. Širine se postavljaju na relativne.

side-by-side-absolute-margins = `<{ $component }>` nije implementiran za apsolutne mjere. Margine se postavljaju na relativne.

side-by-side-no-block-child = Neispravan `<{ $component }>`: mora imati barem jedno blokovsko dijete.

## `<label>`

label-for-ignored-on-graphical = Atribut `for` na grafičkom `<label>` se zanemaruje.

label-for-must-resolve-to-one = Atribut `for` na `<label>` mora se razriješiti na tačno jednu komponentu.

label-for-unresolved = Atribut `for` na `<label>` nije se mogao razriješiti na komponentu.

label-for-answer-with-authored-inputs = Atribut `for` na `<label>` upućuje na `<answer>` s izričito napisanim poljima za unos; uputite na samo polje.

label-for-answer-without-input = Atribut `for` na `<label>` upućuje na `<answer>` bez polja za unos koje bi se označilo.

label-for-must-reference-input-or-answer = Atribut `for` na `<label>` mora upućivati na polje za unos ili na answer.

## Accessibility

accessibility-short-description-or-decorative = Radi pristupačnosti, `<{ $component }>` mora imati kratak opis ili biti označen kao ukrasni.

accessibility-video-short-description = Radi pristupačnosti, `<video>` mora imati kratak opis.

accessibility-input-short-description-or-label = Radi pristupačnosti, `<{ $component }>` mora imati kratak opis ili oznaku.

accessibility-answer-input-short-description-or-label = Radi pristupačnosti, `<answer>` koji stvara polje za unos mora imati kratak opis ili oznaku.

accessibility-short-description-contains-math = Kratki opisi ne bi trebali sadržavati matematičke komponente poput `<{ $component }>`. Matematiku ispišite riječima.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } nema dovoljan kontrast za tekst naslova odjeljka (tamni način) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; potrebno je najmanje { $threshold }:1).
       *[other] { $colorName } nema dovoljan kontrast za tekst naslova odjeljka ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; potrebno je najmanje { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Nije implementirana `<circle>` kroz { $count } tačaka u slučaju kad tačke nemaju brojčane vrijednosti.

circle-too-many-through-points = Nije moguće izračunati kružnicu kroz više od 3 tačke.

circle-overprescribed-radius-center-points = Nije moguće izračunati kružnicu sa zadanim poluprečnikom, središtem i tačkama.

circle-center-with-multiple-points = Nije moguće izračunati kružnicu sa zadanim središtem kroz više od 1 tačke.

circle-radius-too-small = Nije moguće izračunati kružnicu: budući da je udaljenost između dvije tačke { $distance }, zadani poluprečnik { $radius } je premalen.

circle-radius-with-many-points = Nije moguće stvoriti kružnicu kroz više od dvije tačke sa zadanim poluprečnikom.

circle-invalid-center-or-through-points = Neispravno središte ili tačke kružnice.

circle-radius-center-with-multiple-points = Nije moguće izračunati poluprečnik kružnice sa zadanim središtem kroz više od 1 tačke.

circle-change-radius-non-numerical = Nije moguće promijeniti poluprečnik kružnice s nebrojčanim tačkama

circle-radius-with-points-non-numerical = Nije moguće stvoriti kružnicu kroz više od jedne tačke sa zadanim poluprečnikom kad vrijednosti nisu brojčane.

circle-change-center-non-numerical = Nije implementirana promjena središta kružnice kroz tačke s nebrojčanim vrijednostima.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Nedovoljno dimenzija domene funkcije. Domena ima { $intervals } interval, a funkcija ima { $inputs ->
            [one] { $inputs } ulaz
            [few] { $inputs } ulaza
           *[other] { $inputs } ulaza
        }.
        [few] Nedovoljno dimenzija domene funkcije. Domena ima { $intervals } intervala, a funkcija ima { $inputs ->
            [one] { $inputs } ulaz
            [few] { $inputs } ulaza
           *[other] { $inputs } ulaza
        }.
       *[other] Nedovoljno dimenzija domene funkcije. Domena ima { $intervals } intervala, a funkcija ima { $inputs ->
            [one] { $inputs } ulaz
            [few] { $inputs } ulaza
           *[other] { $inputs } ulaza
        }.
    }

function-domain-invalid-format = Neispravan oblik domene funkcije.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Zanemaruje se nebrojčani maksimum funkcije.
        [minimum] Zanemaruje se nebrojčani minimum funkcije.
        [extremum] Zanemaruje se nebrojčani ekstrem funkcije.
        [point] Zanemaruje se nebrojčana tačka funkcije.
        [slope] Zanemaruje se nebrojčani nagib funkcije.
       *[other] Zanemaruje se nebrojčani { $type } funkcije.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Zanemaruje se prazan maksimum funkcije.
        [minimum] Zanemaruje se prazan minimum funkcije.
        [extremum] Zanemaruje se prazan ekstrem funkcije.
        [point] Zanemaruje se prazna tačka funkcije.
       *[other] Zanemaruje se prazan { $type } funkcije.
    }

function-points-too-close = Funkcija sadrži dvije tačke koje su preblizu jedna drugoj. Funkcija se ne može definirati.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Iteracije funkcije moguće su samo ako je broj ulaza jednak broju izlaza. Ova funkcija ima { $inputs } ulaz i { $outputs ->
            [one] { $outputs } izlaz
            [few] { $outputs } izlaza
           *[other] { $outputs } izlaza
        }.
        [few] Iteracije funkcije moguće su samo ako je broj ulaza jednak broju izlaza. Ova funkcija ima { $inputs } ulaza i { $outputs ->
            [one] { $outputs } izlaz
            [few] { $outputs } izlaza
           *[other] { $outputs } izlaza
        }.
       *[other] Iteracije funkcije moguće su samo ako je broj ulaza jednak broju izlaza. Ova funkcija ima { $inputs } ulaza i { $outputs ->
            [one] { $outputs } izlaz
            [few] { $outputs } izlaza
           *[other] { $outputs } izlaza
        }.
    }

## `<sequence>`

sequence-invalid-length = Neispravna dužina niza. Mora biti nenegativan cijeli broj.

sequence-invalid-step = Neispravan korak niza. Mora biti broj za niz tipa { $type }.

sequence-invalid-endpoint-number = Neispravan "{ $attribute }" brojčanog niza. Mora biti broj.

sequence-invalid-endpoint-letters = Neispravan "{ $attribute }" slovnog niza. Mora biti kombinacija slova.

sequence-invalid-endpoint = Neispravan "{ $attribute }" niza.

select-from-sequence-coprime-not-numbers = coprime se zanemaruje jer se ne biraju brojevi

select-from-sequence-coprime-with-exclude-combinations = coprime se zanemaruje jer je zadan excludeCombinations

## Resolving a `target`

target-not-found = Neispravan target za `<{ $source }>`: cilj se ne može pronaći.

target-state-variable-not-found = Neispravan target za `<{ $source }>`: nije pronađena state varijabla "{ $property }" na `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Varijable komponente `<odeSystem>` moraju se razlikovati od nezavisne varijable.

ode-system-duplicate-variable-names = Nije moguće definirati desne strane ODJ s ponovljenim imenima zavisnih varijabli.

ode-system-rhs-function-error = Nije moguće definirati desnu stranu ODJ. Greška pri stvaranju mathjs funkcije.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Nije moguće definirati ugao između { $count } pravih

angle-invalid-through-point = Neispravna tačka u through komponente `<angle>`

parabola-vertex-too-many-points = Nije implementirana parabola s tjemenom kroz više od 1 tačke.

parabola-too-many-points = Nije implementirana parabola kroz više od 3 tačke.

intersection-too-many-items = Nije implementiran presjek za više od dva objekta

## Other math components

ionic-compound-not-two-ions = Jonsko jedinjenje nije implementirano ni za šta osim za dva jona.

ionic-compound-needs-cation-and-anion = Jonsko jedinjenje implementirano je samo za jedan kation i jedan anion.

solve-equations-cannot-evaluate = Nije moguće riješiti jednačinu jer se nije mogla izračunati: { $equation }

math-operators-operand-number-required = Pri izdvajanju matematičkog operanda mora se zadati operandNumber.

eigen-decomposition-failed = Nije moguće izračunati svojstvene vrijednosti matrice

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parametar { $parameters } ne pojavljuje se u uzorku, pa će uvijek odgovarati praznini.
       *[other] `<matchesPattern>`: parametri { $parameters } ne pojavljuju se u uzorku, pa će uvijek odgovarati praznini.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: nije moguće protumačiti grid="{ $grid }". Mora biti none, medium, dense ili dva pozitivna broja odvojena razmakom, na primjer grid="1 0.5". Mreža se ne crta.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" nije podržan u prikazivaču prefigure; koristi se ponašanje za desni položaj.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" nije podržan u prikazivaču prefigure; koristi se ponašanje za gornji položaj.

prefigure-invalid-axis-bounds = `<graph>`: neispravne granice osa za pretvorbu u prefigure; koristi se zadani bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: neispravna širina za pretvorbu u prefigure; koristi se zadana širina dijagrama 425.

prefigure-invalid-aspect-ratio = `<graph>`: neispravan aspectRatio za pretvorbu u prefigure; koristi se zadani omjer 1.

prefigure-grid-spacing-too-fine = `<graph>`: razmak mreže pregust je za granice osa; mreža se izostavlja u prikazivaču prefigure.

prefigure-annotations-not-rendered = `<graph>`: napomene se neće prikazati kad se ne koristi prikazivač PreFigure.

multiple-annotations-children = Pronađeno je više djece `<annotations>` u `<graph>`; sva osim posljednjeg se zanemaruju.

## Referring to other components

copy-unrecognized-component-type = Nije moguće proširiti ili kopirati nepoznat tip komponente: { $type }.

copy-prop-not-found = Nije pronađeno svojstvo { $property } na komponenti tipa { $component }

collect-no-source = Nije pronađen izvor za collect.

collect-invalid-component-type = Nije moguće prikupiti komponente tipa `<{ $component }>` jer je to neispravan tip komponente.

reference-index-unavailable = Nije moguće uputiti na indeks `{ $reference }`

## `<callAction>`

component-action-unavailable = Nije moguće pozvati { $action } na komponenti `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Podaci imaju neispravan oblik. Redovi su nejednakih dužina. Pronađeno u componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Podaci imaju ponovljena imena kolona. Pronađeno u componentIdx :{ $componentIdx }

data-frame-missing-column-name = Podacima nedostaje ime kolone. Pronađeno u componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Jedno priznanje za ovaj odgovor zasniva se na vlastitom poslanom odgovoru oznake answer, što će dovesti do neočekivanog ponašanja.

answer-max-num-attempts-in-section-wide-check-work = Postavljanje `maxNumAttempts` na `<answer>` unutar spremnika s `sectionWideCheckWork` nema učinka jer brojem pokušaja upravlja spremnik. Postavite `maxNumAttempts` na spremnik.

nested-section-wide-check-work-max-num-attempts = Postavljanje `maxNumAttempts` na spremnik s `sectionWideCheckWork` koji je unutar drugog spremnika s `sectionWideCheckWork` nema učinka jer brojem pokušaja upravlja vanjski spremnik. Postavite `maxNumAttempts` na vanjski spremnik.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Atribut { $attributes } neće imati učinka bez postavljenog symbolicEquality.
       *[other] Atributi { $attributes } neće imati učinka bez postavljenog symbolicEquality.
    }

answer-invalid-type = Neispravan tip za answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Budući da komponenta `<{ $component }>` nema ime, ne može se koristiti kao atribut modula

module-attribute-name-already-defined = Komponenta `<{ $component } name="{ $name }">` ne može se koristiti kao atribut modula jer tip komponente `<module>` već ima definiran atribut "{ $name }".

conditional-content-condition-ignored = Atribut `condition` se zanemaruje na komponenti `<conditionalContent>` s djecom case ili else.

slider-markers-type-mismatch = Tip oznaka ne odgovara tipu klizača.

pretzel-problem-needs-statement-and-answer = Neispravan pretzel: svaki `<problem>` mora sadržavati jedan `<statement>` i jedan `<answer>`.

pretzel-circuit-first-problem-distractor = Neispravan pretzel: u mode="circuit" prvi `<problem>` ne može biti ometač.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Neispravna vrijednost { $values } za atribut `{ $attribute }`; zanemaruje se.
       *[other] Neispravne vrijednosti { $values } za atribut `{ $attribute }`; zanemaruju se.
    }

attribute-must-be-references = Neispravna vrijednost `{ $value }` za atribut `{ $attribute }`. Atribut mora biti sastavljen od uputa koje počinju znakom `$`.

math-input-invalid-function-names = <mathInput>: zanemarena su neispravna imena funkcija u { $attribute }: { $names }. Prikazni dio svakog imena mora imati najmanje 2 znaka (slova ili crtice); iza njega može slijediti neobavezan nastavak `|<mathspeak alternativa>`.

## Building components from the source

component-type-invalid = Neispravan tip komponente: `<{ $componentType }>`

attribute-repeated = Atribut { $attribute } ne može se ponavljati.

attribute-invalid-for-component = Neispravan atribut "{ $attribute }" za komponentu tipa `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Definicija stila { $styleNumber } nema dovoljan kontrast za { $context ->
        [text-on-background] boju teksta u odnosu na boju pozadine
        [high-contrast] boju visokog kontrasta u odnosu na podlogu
        [line] boju linije u odnosu na podlogu
        [marker] boju oznake u odnosu na podlogu
       *[text-on-canvas] boju teksta u odnosu na podlogu
    }{ $mode ->
        [dark] { " (tamni način)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; potrebno je najmanje { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Iako definicija stila { $styleNumber } ima zadane boje s dovoljnim kontrastom za svijetli način, boje za tamni način izvedene iz tih vrijednosti nemaju dovoljan kontrast boje teksta u odnosu na boju pozadine ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; potrebno je najmanje { $threshold }:1). { $suggestion ->
        [available] Da biste osigurali dovoljan kontrast u tamnom načinu, povećajte kontrast za svijetli način (npr. postavite { $lightAttribute }="{ $lightColor }") ili nadjačajte boju za tamni način (npr. postavite { $darkAttribute }="{ $darkColor }").
       *[none] Da biste osigurali dovoljan kontrast u tamnom načinu, povećajte kontrast za svijetli način ili nadjačajte izvedene boje pomoću textColorDarkMode i/ili backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Iako definicija stila { $styleNumber } ima zadanu boju teksta s dovoljnim kontrastom za svijetli način, boja teksta za tamni način izvedena iz te vrijednosti nema dovoljan kontrast u odnosu na podlogu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; potrebno je najmanje { $threshold }:1). { $suggestion ->
        [available] Da biste osigurali dovoljan kontrast u tamnom načinu, povećajte kontrast za svijetli način (npr. postavite textColor="{ $lightColor }") ili nadjačajte boju za tamni način (npr. postavite textColorDarkMode="{ $darkColor }").
       *[none] Da biste osigurali dovoljan kontrast u tamnom načinu, povećajte kontrast za svijetli način ili nadjačajte izvedenu boju pomoću textColorDarkMode.
    }

section-multiple-style-palettes = Odjeljak može izabrati samo jedan <stylePalette>; koristi se posljednji.

## Unique variants

variant-num-to-select-not-non-negative-integer = nije moguće odrediti jedinstvene varijante komponente { $component } jer numToSelect nije nenegativan cijeli broj.

variant-num-to-select-not-constant-number = nije moguće odrediti jedinstvene varijante komponente { $component } jer numToSelect nije konstantan broj.

variant-with-replacement-not-constant-boolean = nije moguće odrediti jedinstvene varijante komponente { $component } jer withReplacement nije konstantan boolean.

variant-select-weight-disables-unique = Jedinstvene varijante za select onemogućene su ako neka opcija ima zadan selectWeight ili selectForVariants

variant-coprime-undetermined = nije moguće odrediti jedinstvene varijante komponente { $component } jer se ne može utvrditi da coprime uvijek nije tačno.

variant-attribute-not-constant = nije moguće odrediti jedinstvene varijante komponente { $component } jer { $attribute } nije konstanta.

variant-attribute-not-number = nije moguće odrediti jedinstvene varijante komponente { $component } jer { $attribute } nije broj.

variant-attribute-wrong-type-for-sequence =
    nije moguće odrediti jedinstvene varijante komponente { $component } tipa { $type } jer { $attribute } nije { $expected ->
        [letters-combination] kombinacija slova
        [math-expression] valjan matematički izraz
        [integer] cijeli broj
       *[number] broj
    }.

variant-length-not-integer = nije moguće odrediti jedinstvene varijante komponente { $component } jer length nije cijeli broj.

variant-sort-not-implemented = nisu implementirane jedinstvene varijante komponente { $component } sa sort

variant-exclude-combinations-not-implemented = nisu implementirane jedinstvene varijante komponente { $component } s excludeCombinations

variant-math-exclude-not-implemented = nisu implementirane jedinstvene varijante komponente { $component } tipa math s exclude

variant-non-constant-exclude-not-implemented = nisu implementirane jedinstvene varijante komponente { $component } s nekonstantnim exclude

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: nije podržano u prikazivaču prefigure za graf; potomak se preskače.

prefigure-descendant-invalid-geometry = { $subject }: nekonačna ili nepotpuna geometrija; potomak se preskače.

prefigure-curve-label-omitted = { $subject }: oznake nisu podržane na pretvorenim elementima krive; oznaka se izostavlja.

prefigure-curve-unsupported-definition-type = { $subject }: nepodržan tip definicije funkcije krive '{ $definitionType }'; potomak se preskače.

prefigure-region-flip-functions-unsupported = { $subject }: nepodržan atribut flipFunctions na regionBetweenCurves; potomak se preskače.

prefigure-region-non-formula-child = { $subject }: na regionBetweenCurves podržane su samo funkcije zadane formulom; potomak se preskače.

prefigure-label-position-unsupported =
    { $subject }: nepodržan labelPosition '{ $labelPosition }' za { $labelKind ->
        [line-family] oznaku iz porodice pravih
       *[point] oznaku tačke
    }; koristi se zadano poravnanje PreFigure.

prefigure-fill-style-unsupported = { $subject }: stil ispune '{ $fillStyle }' PreFigure ne podržava; koristi se puna ispuna.

prefigure-line-style-unknown = { $subject }: nepoznat stil linije '{ $lineStyle }' izostavljen je iz izlaza PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: stil oznake '{ $markerStyle }' preslikan je u PreFigure stil 'diamond'.

prefigure-marker-style-unsupported = { $subject }: stil oznake '{ $markerStyle }' PreFigure ne podržava; koristi se zadani stil.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: neispravan `ref`; cilj se ne može razriješiti. Napomena se izostavlja.

annotation-ref-multiple-targets = `<annotation>`: `ref` se razriješio na više ciljeva; koristi se prvi.

annotation-ref-outside-graph = `<annotation>`: neispravan `ref`; cilj je izvan grafa koji ga sadrži. Napomena se izostavlja.

annotation-ref-unsupported-target = `<annotation>`: neispravan `ref`; cilj nije podržan grafički objekat u pretvorbi u prefigure. Napomena se izostavlja.

annotation-text-missing = `<annotation>`: nedostaje ili je prazan `text`; ispisuje se prazan tekst.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Otkrivena je kružna zavisnost.
       *[other] Otkrivena je kružna zavisnost koja uključuje komponentu `<{ $componentType }>`.
    }

reference-no-referent = Nije pronađen objekat za uputu: `{ $reference }`

reference-multiple-referents = Pronađeno je više objekata za uputu: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Neispravan oblik atributa { $attribute } komponente `<{ $componentType }>`.

children-invalid = Neispravna djeca za `<{ $componentType }>`: pronađena su neispravna djeca: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Neispravna vrijednost `{ $value }` za atribut `{ $attribute }`, koristi se vrijednost `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Verzija DoenetML-a { $version } nije pronađena.
       *[other] Verzija DoenetML-a { $version } nije pronađena. Koristi se verzija { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Neispravan DoenetML: { $content }

parse-tag-missing-close-tag = Neispravan DoenetML: oznaka `{ $tag }` nema zatvarajuću oznaku. Očekivana je samozatvarajuća oznaka ili oznaka `</{ $tagName }>`.

parse-tag-error = Neispravan DoenetML: greška u oznaci `<{ $tagName }>`

parse-attribute-missing-value = Neispravan DoenetML: neispravnom atributu `{ $attribute }` izgleda nedostaje vrijednost.

parse-attribute-invalid = Neispravan DoenetML: neispravan atribut `{ $attribute }`

parse-attribute-value-invalid = Neispravan DoenetML: neispravna vrijednost atributa `{ $value }`

parse-attribute-value-quote-mismatch = Neispravan DoenetML: neispravna vrijednost atributa `{ $value }`. Navodnici se ne slažu. Izgleda da nedostaje `{ $quote }`

parse-open-tag-name-missing = Neispravan DoenetML: pronađena je oznaka bez imena, npr. `<`

parse-tag-not-closed = Neispravan DoenetML: oznaka `{ $tag }` nije zatvorena (izgleda da nedostaje `>`).

parse-self-closing-tag-name-missing = Neispravan DoenetML: pronađena je oznaka bez imena `<{ $content }>`

parse-self-closing-tag-not-closed = Neispravan DoenetML: oznaka `{ $tag }` nije zatvorena (izgleda da nedostaje `/>`).

parse-tag-invalid-attributes = Neispravan DoenetML: oznaka `{ $tag }` nije valjana. Možda ima neispravne atribute.

parse-close-tag-name-missing = Neispravan DoenetML: pronađena je zatvarajuća oznaka bez imena, npr. `</`

parse-attribute-value-unquoted = Vrijednosti atributa moraju biti u navodnicima: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Neispravan DoenetML: pronađena je zatvarajuća oznaka `{ $tag }`, ali nema odgovarajuće otvarajuće oznake

parse-close-tag-mismatched = Neispravan DoenetML: nesaglasna zatvarajuća oznaka. Očekivano `</{ $expected }>`. Pronađeno `{ $found }`

parser-node-unconvertible = Nije moguće pretvoriti čvor { $node } u Dast čvor.

## Names

name-attribute-invalid =
    Neispravno ime atributa name='{ $name }'. { $reason ->
        [characters] Imena mogu sadržavati samo slova, brojeve, donje crte ili crtice.
       *[start] Imena moraju počinjati slovom.
    }

component-name-invalid-start = Neispravno ime komponente "{ $name }". Imena moraju počinjati slovom.

## `<answer>` sugar

answer-video-watched-missing-video = Answer tipa videoWatched mora imati atribut video

answer-video-watched-video-not-reference = Answer tipa videoWatched mora imati atribut video koji je uputa

answer-name-not-single-text = Atribut name komponente answer mora imati jedno tekstualno dijete

## Referencing another document

external-doenetml-recursion-limit = Vanjski DoenetML nije moguće dohvatiti zbog previše nivoa rekurzije. Postoji li kružna uputa?

external-doenetml-unavailable = Nije moguće dohvatiti DoenetML iz { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Neispravan DoenetML dohvaćen iz { $attribute }="{ $uri }": ne odgovara tipu komponente "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` je zastario; koristite `{ $to }`.
       *[other] [deprecation] Atribut `{ $from }` na `<{ $component }>` je zastario; koristite `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` je zastario i zanemaruje se jer je zadan i `{ $to }`.
       *[other] [deprecation] Atribut `{ $from }` na `<{ $component }>` je zastario i zanemaruje se jer je zadan i `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Atribut `{ $attribute }` na `<{ $component }>` je zastario i zanemaruje se.

deprecated-attribute-to-child = [deprecation] Atribut `{ $attribute }` na `<{ $component }>` je zastario; umjesto njega koristite dijete `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Vrijednost `{ $value }` atributa `{ $attribute }` na `<{ $component }>` je zastarjela; koristite `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` može tvoriti množinu samo na engleskom, pa njegov tekst ostaje nepromijenjen u dokumentu napisanom na jeziku { $locale }. Napišite oblik množine izravno ili ga zadajte atributom `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Element `<{ $tag }>` nije prepoznat kao Doenet element.

schema-element-not-allowed-at-root = Element `<{ $tag }>` nije dopušten u korijenu dokumenta.

schema-element-not-allowed-inside = Element `<{ $tag }>` nije dopušten unutar `<{ $parent }>`.

schema-attribute-unrecognized = Element `<{ $tag }>` nema atribut `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribut `{ $attribute }` elementa `<{ $tag }>` mora biti spisak čiji je svaki član jedno od: { $allowed }
       *[other] Atribut `{ $attribute }` elementa `<{ $tag }>` mora biti jedno od: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Neispravno ime varijante za select. Ime varijante { $variantName } pojavljuje se u { $numOptions } opcija, a broj za izbor je { $numToSelect }.

select-variant-name-without-options = Za select su zadane neke varijante, ali nisu zadane opcije za moguće ime varijante: { $variantName }.

select-variant-name-not-possible = Ime varijante { $variantName } zadano za select nije moguće ime varijante.

select-too-few-options = Nije moguće izabrati { $numToSelect } komponenata od samo { $numOptions }.

select-from-sequence-too-few-values = Nije moguće izabrati { $numToSelect } vrijednosti iz niza dužine { $length }.

select-from-sequence-indices-count-mismatch = Broj indeksa zadanih za select mora odgovarati broju za izbor

select-from-sequence-indices-not-integers = Svi indeksi zadani za select moraju biti cijeli brojevi

select-from-sequence-index-excluded = Zadan je indeks komponente selectfromsequence koji je bio isključen

select-from-sequence-indices-excluded-combination = Zadani su indeksi komponente selectfromsequence koji su bili isključena kombinacija

select-from-sequence-coprime-not-positive-integers = Nije moguće izabrati uzajamno proste kombinacije jer se ne biraju pozitivni cijeli brojevi.

select-from-sequence-coprime-common-factor = Nije moguće izabrati uzajamno proste brojeve. Sve moguće vrijednosti imaju zajednički faktor. (Zadane vrijednosti "from" ili "to" moraju biti uzajamno proste sa "step".)

select-from-sequence-coprime-single-number = Nije moguće izabrati uzajamno proste kombinacije iz jednog broja koji nije 1.

select-from-sequence-excluded-too-many-combinations = U selectFromSequence isključeno je više od 70% kombinacija

select-from-sequence-coprime-none-found = Nije bilo moguće izabrati uzajamno proste brojeve. Sve moguće vrijednosti imaju zajednički faktor.

select-from-sequence-too-few-unique-values = Nije moguće izabrati { $numToSelect } jedinstvenih vrijednosti iz niza dužine { $numPossibleValues }

select-prime-numbers-too-few-values = Nije moguće izabrati { $numToSelect } vrijednosti iz spiska prostih brojeva dužine { $numValues }

select-prime-numbers-values-count-mismatch = Broj vrijednosti zadanih za select mora odgovarati broju za izbor

select-prime-numbers-values-not-prime = Sve vrijednosti zadane za select prostih brojeva moraju biti na spisku prostih brojeva

select-prime-numbers-values-excluded-combination = Zadane vrijednosti komponente selectPrimeNumbers bile su isključena kombinacija

select-prime-numbers-excluded-too-many-combinations = U selectPrimeNumbers isključeno je više od 70% kombinacija

select-random-combination-fluke = Zbog krajnje nevjerovatne slučajnosti nije bilo moguće izabrati kombinaciju slučajnih vrijednosti

select-random-value-fluke = Zbog krajnje nevjerovatne slučajnosti nije bilo moguće izabrati slučajnu vrijednost
