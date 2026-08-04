# Croatian diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Croatian counts in three plural categories, and which of them a message needs
# depends on what the count does in it. A message that prints the number next
# to a noun agrees that noun with it, so it spells out `one` and `few` and lets
# `*[other]` carry the rest. A message where the number never appears — the
# list messages, whose count only decides whether a verb is singular or plural
# — has just the two forms Croatian offers there, so `one` and `*[other]` are
# the whole selection.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } zanemaruje se kad su zadane obje krajnje točke
       *[other] { $attributes } zanemaruju se kad su zadane obje krajnje točke
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } zanemaruje se kad su zadani i krajnja točka i polovište
       *[other] { $attributes } zanemaruju se kad su zadani i krajnja točka i polovište
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset nema učinka bez zadanog polovišta

## `<line>`

line-points-undetermined-dimensions = Pravac kroz točke neodređene dimenzije.

line-points-too-few-dimensions = Pravac mora prolaziti kroz točke dimenzije barem dva.

line-points-depend-on-variables = Pravac prolazi kroz točke koje ovise o varijablama: { $variables }.

line-equation-invalid-format = Neispravan oblik jednadžbe pravca u varijablama { $variable1 } i { $variable2 }.

## `<ray>`

ray-overprescribed-through = Polupravac je zadan pomoću through, endpoint i direction. Zadano through se zanemaruje.

ray-dimension-mismatch = Nepodudaranje numDimensions u polupravcu.

## `<vector>`

vector-overprescribed-head = Vektor je zadan pomoću head, tail i displacement. Zadano head se zanemaruje.

vector-dimension-mismatch = Nepodudaranje numDimensions u vektoru.

## Attracting and constraining

attract-to-without-nearest-point = Nije moguće privlačiti prema `<{ $component }>` jer nema varijablu stanja nearestPoint.

constrain-to-without-nearest-point = Nije moguće ograničiti na `<{ $component }>` jer nema varijablu stanja nearestPoint.

constrain-to-interior-without-nearest-point = Nije moguće ograničiti na unutrašnjost `<{ $component }>` jer nema varijablu stanja nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition se zanemaruje za neugrađeni choiceInput

## Ordering children by index

choice-input-indices-count-mismatch = Indeksi zadani za choiceInput zanemaruju se jer njihov broj ne odgovara broju podređenih choice.

pretzel-indices-count-mismatch = Indeksi zadani za problem zanemaruju se jer njihov broj ne odgovara broju podređenih problem.

shuffle-indices-count-mismatch = Indeksi zadani za shuffle zanemaruju se jer njihov broj ne odgovara broju komponenata.

indices-ignored-out-of-range = Indeksi zadani za { $component } zanemaruju se jer su neki izvan raspona.

pretzel-indices-repeated = Indeksi zadani za pretzel zanemaruju se jer se neki ponavljaju.

pretzel-circuit-first-index = Indeksi zadani za pretzel u načinu circuit zanemaruju se jer prvi indeks mora biti 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Da bi `<{ $component }>` radio s tekstualnom djecom, mora biti zadan atribut `type`.

invalid-type-defaulting-to-math = Neispravan tip { $type } za komponentu { $component }. Mora biti math, text, number ili boolean. Koristi se math.

string-not-valid-component-to-arrange = Niz „{ $value }” nije valjana komponenta za { $component }. Zanemaruje se.

## Types and variables

invalid-type-defaulting-to-number = Neispravan tip { $type }; tip se postavlja na number.

invalid-variable-value = Neispravna vrijednost varijable: `{ $value }`

## Variants

variant-index-must-be-number = Indeks varijante { $index } mora biti broj

variant-index-must-be-integer = Indeks varijante { $index } mora biti cijeli broj

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` nije izveden za apsolutne mjere. Širine postaju relativne.

side-by-side-absolute-margins = `<{ $component }>` nije izveden za apsolutne mjere. Margine postaju relativne.

side-by-side-no-block-child = Neispravan `<{ $component }>`: mora imati barem jedno blokovsko dijete.

## `<label>`

label-for-ignored-on-graphical = Atribut `for` na grafičkom `<label>` se zanemaruje.

label-for-must-resolve-to-one = Atribut `for` na `<label>` mora voditi točno na jednu komponentu.

label-for-unresolved = Atribut `for` na `<label>` nije se mogao razriješiti u komponentu.

label-for-answer-with-authored-inputs = Atribut `for` na `<label>` upućuje na `<answer>` s izrijekom napisanim poljima za unos; uputite izravno na polje.

label-for-answer-without-input = Atribut `for` na `<label>` upućuje na `<answer>` bez polja za unos koje bi se označilo.

label-for-must-reference-input-or-answer = Atribut `for` na `<label>` mora upućivati na polje za unos ili na odgovor.

## Accessibility

accessibility-short-description-or-decorative = Radi pristupačnosti `<{ $component }>` mora imati kratki opis ili biti označen kao ukrasni.

accessibility-video-short-description = Radi pristupačnosti `<video>` mora imati kratki opis.

accessibility-input-short-description-or-label = Radi pristupačnosti `<{ $component }>` mora imati kratki opis ili oznaku.

accessibility-answer-input-short-description-or-label = Radi pristupačnosti `<answer>` koji stvara polje za unos mora imati kratki opis ili oznaku.

accessibility-short-description-contains-math = Kratki opisi ne bi smjeli sadržavati matematičke komponente poput `<{ $component }>`. Matematiku ispišite riječima.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ima nedovoljan kontrast za tekst naslova odjeljka (tamna tema) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; potrebno je barem { $threshold }:1).
       *[other] { $colorName } ima nedovoljan kontrast za tekst naslova odjeljka ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; potrebno je barem { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` kroz { $count } točaka nije izvedena kad točke nemaju brojčane vrijednosti.

circle-too-many-through-points = Nije moguće izračunati kružnicu kroz više od 3 točke.

circle-overprescribed-radius-center-points = Nije moguće izračunati kružnicu sa zadanim polumjerom, središtem i točkama.

circle-center-with-multiple-points = Nije moguće izračunati kružnicu sa zadanim središtem kroz više od 1 točku.

circle-radius-too-small = Nije moguće izračunati kružnicu: budući da je udaljenost između dviju točaka { $distance }, zadani polumjer { $radius } premalen je.

circle-radius-with-many-points = Nije moguće konstruirati kružnicu kroz više od dvije točke sa zadanim polumjerom.

circle-invalid-center-or-through-points = Neispravno središte ili točke kružnice.

circle-radius-center-with-multiple-points = Nije moguće izračunati polumjer kružnice sa zadanim središtem kroz više od 1 točku.

circle-change-radius-non-numerical = Nije moguće promijeniti polumjer kružnice s nebrojčanim točkama

circle-radius-with-points-non-numerical = Nije moguće konstruirati kružnicu kroz više od jedne točke sa zadanim polumjerom kad nema brojčanih vrijednosti.

circle-change-center-non-numerical = Mijenjanje središta kružnice kroz nebrojčane točke nije izvedeno.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Nedovoljno dimenzija za domenu funkcije. Domena ima { $intervals } interval, a funkcija ima { $inputs ->
            [one] { $inputs } ulaz
            [few] { $inputs } ulaza
           *[other] { $inputs } ulaza
        }.
        [few] Nedovoljno dimenzija za domenu funkcije. Domena ima { $intervals } intervala, a funkcija ima { $inputs ->
            [one] { $inputs } ulaz
            [few] { $inputs } ulaza
           *[other] { $inputs } ulaza
        }.
       *[other] Nedovoljno dimenzija za domenu funkcije. Domena ima { $intervals } intervala, a funkcija ima { $inputs ->
            [one] { $inputs } ulaz
            [few] { $inputs } ulaza
           *[other] { $inputs } ulaza
        }.
    }

function-domain-invalid-format = Neispravan oblik domene funkcije.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Nebrojčani maksimum funkcije se zanemaruje.
        [minimum] Nebrojčani minimum funkcije se zanemaruje.
        [extremum] Nebrojčani ekstrem funkcije se zanemaruje.
        [point] Nebrojčana točka funkcije se zanemaruje.
        [slope] Nebrojčani nagib funkcije se zanemaruje.
       *[other] Nebrojčano { $type } funkcije se zanemaruje.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Prazan maksimum funkcije se zanemaruje.
        [minimum] Prazan minimum funkcije se zanemaruje.
        [extremum] Prazan ekstrem funkcije se zanemaruje.
        [point] Prazna točka funkcije se zanemaruje.
       *[other] Prazno { $type } funkcije se zanemaruje.
    }

function-points-too-close = Funkcija sadrži dvije točke koje su preblizu. Funkciju nije moguće definirati.

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

sequence-invalid-length = Neispravna duljina niza. Mora biti nenegativan cijeli broj.

sequence-invalid-step = Neispravan korak niza. Za niz tipa { $type } mora biti broj.

sequence-invalid-endpoint-number = Neispravan „{ $attribute }” brojevnog niza. Mora biti broj.

sequence-invalid-endpoint-letters = Neispravan „{ $attribute }” slovnog niza. Mora biti kombinacija slova.

sequence-invalid-endpoint = Neispravan „{ $attribute }” niza.

select-from-sequence-coprime-not-numbers = coprime se zanemaruje jer se ne biraju brojevi

select-from-sequence-coprime-with-exclude-combinations = coprime se zanemaruje jer je zadan excludeCombinations

## Resolving a `target`

target-not-found = Neispravan target za `<{ $source }>`: cilj nije pronađen.

target-state-variable-not-found = Neispravan target za `<{ $source }>`: `<{ $component }>` nema varijablu stanja imena „{ $property }”.

## `<odeSystem>`

ode-system-variables-match-independent = Varijable `<odeSystem>` moraju se razlikovati od nezavisne varijable.

ode-system-duplicate-variable-names = Nije moguće definirati desne strane ODJ s ponovljenim imenima zavisnih varijabli.

ode-system-rhs-function-error = Nije moguće definirati desnu stranu ODJ. Pogreška pri stvaranju mathjs funkcije.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Nije moguće definirati kut između { $count } pravaca

angle-invalid-through-point = Neispravna točka u through kod `<angle>`

parabola-vertex-too-many-points = Parabola sa zadanim tjemenom kroz više od 1 točku nije izvedena.

parabola-too-many-points = Parabola kroz više od 3 točke nije izvedena.

intersection-too-many-items = Presjek više od dvaju objekata nije izveden

## Other math components

ionic-compound-not-two-ions = Ionski spojevi osim onih od dvaju iona nisu izvedeni.

ionic-compound-needs-cation-and-anion = Ionski spojevi izvedeni su samo za jedan kation i jedan anion.

solve-equations-cannot-evaluate = Jednadžbu nije moguće riješiti jer se nije mogla izračunati: { $equation }

math-operators-operand-number-required = Za izdvajanje matematičkog operanda mora se zadati operandNumber.

eigen-decomposition-failed = Svojstvene vrijednosti matrice nisu se mogle izračunati

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parametar { $parameters } ne pojavljuje se u uzorku pa će uvijek odgovarati praznini.
       *[other] `<matchesPattern>`: parametri { $parameters } ne pojavljuju se u uzorku pa će uvijek odgovarati praznini.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: nije moguće protumačiti grid="{ $grid }". Vrijednost mora biti none, medium, dense ili dva pozitivna broja odvojena razmakom, primjerice grid="1 0.5". Mreža se ne crta.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" nije podržan u prikazivaču prefigure; koristi se ponašanje za desni položaj.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" nije podržan u prikazivaču prefigure; koristi se ponašanje za gornji položaj.

prefigure-invalid-axis-bounds = `<graph>`: neispravne granice osi za pretvorbu u prefigure; koristi se zadani bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: neispravna širina za pretvorbu u prefigure; koristi se zadana širina dijagrama 425.

prefigure-invalid-aspect-ratio = `<graph>`: neispravan aspectRatio za pretvorbu u prefigure; koristi se zadani omjer stranica 1.

prefigure-grid-spacing-too-fine = `<graph>`: razmak mreže presitan je za granice osi; u prikazivaču prefigure mreža se izostavlja.

prefigure-annotations-not-rendered = `<graph>`: izvan prikazivača PreFigure napomene se ne prikazuju.

multiple-annotations-children = U `<graph>` pronađeno je više podređenih `<annotations>`; sve osim posljednje se zanemaruju.

## Referring to other components

copy-unrecognized-component-type = Nije moguće proširiti ili kopirati neprepoznat tip komponente: { $type }.

copy-prop-not-found = Svojstvo { $property } nije pronađeno na komponenti tipa { $component }

collect-no-source = Za collect nije pronađen izvor.

collect-invalid-component-type = Nije moguće sakupljati komponente tipa `<{ $component }>` jer je to neispravan tip komponente.

reference-index-unavailable = Nije moguće uputiti na indeks `{ $reference }`

## `<callAction>`

component-action-unavailable = Nije moguće pozvati { $action } na komponenti `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Podaci imaju neispravan oblik. Reci su različitih duljina. Pronađeno u componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Podaci imaju ponovljena imena stupaca. Pronađeno u componentIdx :{ $componentIdx }

data-frame-missing-column-name = Podacima nedostaje ime stupca. Pronađeno u componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = award ovog odgovora oslanja se na poslani odgovor same oznake answer, što će dovesti do neočekivanog ponašanja.

answer-max-num-attempts-in-section-wide-check-work = Postavljanje `maxNumAttempts` na `<answer>` unutar spremnika sa `sectionWideCheckWork` nema učinka jer broj pokušaja određuje spremnik. Postavite `maxNumAttempts` na spremnik.

nested-section-wide-check-work-max-num-attempts = Postavljanje `maxNumAttempts` na spremnik sa `sectionWideCheckWork` koji je i sam unutar drugog spremnika sa `sectionWideCheckWork` nema učinka jer broj pokušaja određuje vanjski spremnik. Postavite `maxNumAttempts` na vanjski spremnik.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Atribut { $attributes } neće imati učinka bez postavljenog symbolicEquality.
       *[other] Atributi { $attributes } neće imati učinka bez postavljenog symbolicEquality.
    }

answer-invalid-type = Neispravan tip za answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Komponenta `<{ $component }>` nema ime pa se ne može upotrijebiti kao atribut modula

module-attribute-name-already-defined = Komponenta `<{ $component } name="{ $name }">` ne može se upotrijebiti kao atribut modula jer tip komponente `<module>` već ima definiran atribut „{ $name }”.

conditional-content-condition-ignored = Atribut `condition` zanemaruje se na komponenti `<conditionalContent>` s podređenim case ili else.

slider-markers-type-mismatch = Tip oznaka ne odgovara tipu klizača.

pretzel-problem-needs-statement-and-answer = Neispravan pretzel: svaki `<problem>` mora sadržavati jedan `<statement>` i jedan `<answer>`.

pretzel-circuit-first-problem-distractor = Neispravan pretzel: pri mode="circuit" prvi `<problem>` ne može biti ometač.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Neispravna vrijednost { $values } za atribut `{ $attribute }`; zanemaruje se.
       *[other] Neispravne vrijednosti { $values } za atribut `{ $attribute }`; zanemaruju se.
    }

attribute-must-be-references = Neispravna vrijednost `{ $value }` za atribut `{ $attribute }`. Atribut mora biti sastavljen od uputa koje počinju s `$`.

math-input-invalid-function-names = <mathInput>: neispravna imena funkcija u { $attribute } su zanemarena: { $names }. Prikazni dio svakog imena mora imati barem 2 znaka (slova ili crtice); iza njega može slijediti neobvezan nastavak `|<mathspeak alternativa>`.

## Building components from the source

component-type-invalid = Neispravan tip komponente: `<{ $componentType }>`

attribute-repeated = Atribut { $attribute } ne smije se ponavljati.

attribute-invalid-for-component = Neispravan atribut „{ $attribute }” za komponentu tipa `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Definicija stila { $styleNumber } ima nedovoljan kontrast za { $context ->
        [text-on-background] boju teksta naspram boje pozadine
        [high-contrast] visokokontrastnu boju naspram podloge
        [line] boju linija naspram podloge
        [marker] boju oznaka naspram podloge
       *[text-on-canvas] boju teksta naspram podloge
    }{ $mode ->
        [dark] { " (tamna tema)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; potrebno je barem { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Iako definicija stila { $styleNumber } zadaje boje s dovoljnim kontrastom za svijetlu temu, iz njih izvedene boje za tamnu temu daju nedovoljan kontrast teksta naspram pozadine ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; potrebno je barem { $threshold }:1). { $suggestion ->
        [available] Za dovoljan kontrast u tamnoj temi ili povećajte kontrast u svijetloj temi (primjerice { $lightAttribute }="{ $lightColor }") ili nadjačajte boju za tamnu temu (primjerice { $darkAttribute }="{ $darkColor }").
       *[none] Za dovoljan kontrast u tamnoj temi povećajte kontrast u svijetloj temi ili nadjačajte izvedene boje pomoću textColorDarkMode i/ili backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Iako definicija stila { $styleNumber } zadaje boju teksta s dovoljnim kontrastom za svijetlu temu, iz nje izvedena boja teksta za tamnu temu daje nedovoljan kontrast naspram podloge ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; potrebno je barem { $threshold }:1). { $suggestion ->
        [available] Za dovoljan kontrast u tamnoj temi ili povećajte kontrast u svijetloj temi (primjerice textColor="{ $lightColor }") ili nadjačajte boju za tamnu temu (primjerice textColorDarkMode="{ $darkColor }").
       *[none] Za dovoljan kontrast u tamnoj temi povećajte kontrast u svijetloj temi ili nadjačajte izvedenu boju pomoću textColorDarkMode.
    }

section-multiple-style-palettes = Odjeljak može odabrati samo jednu <stylePalette>; koristi se posljednja.

## Unique variants

variant-num-to-select-not-non-negative-integer = nije moguće odrediti jedinstvene varijante komponente { $component } jer numToSelect nije nenegativan cijeli broj.

variant-num-to-select-not-constant-number = nije moguće odrediti jedinstvene varijante komponente { $component } jer numToSelect nije konstantan broj.

variant-with-replacement-not-constant-boolean = nije moguće odrediti jedinstvene varijante komponente { $component } jer withReplacement nije konstantna logička vrijednost.

variant-select-weight-disables-unique = Jedinstvene varijante za select isključene su ako neka mogućnost ima zadan selectWeight ili selectForVariants

variant-coprime-undetermined = nije moguće odrediti jedinstvene varijante komponente { $component } jer se ne može utvrditi da je coprime uvijek netočno.

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

variant-sort-not-implemented = jedinstvene varijante komponente { $component } sa sort nisu izvedene

variant-exclude-combinations-not-implemented = jedinstvene varijante komponente { $component } s excludeCombinations nisu izvedene

variant-math-exclude-not-implemented = jedinstvene varijante komponente { $component } tipa math s exclude nisu izvedene

variant-non-constant-exclude-not-implemented = jedinstvene varijante komponente { $component } s nekonstantnim exclude nisu izvedene

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: nije podržano u prikazivaču prefigure za grafove; potomak je preskočen.

prefigure-descendant-invalid-geometry = { $subject }: beskonačna ili nepotpuna geometrija; potomak je preskočen.

prefigure-curve-label-omitted = { $subject }: oznake nisu podržane na pretvorenim elementima krivulja; oznaka je izostavljena.

prefigure-curve-unsupported-definition-type = { $subject }: nepodržan tip definicije funkcije krivulje „{ $definitionType }”; potomak je preskočen.

prefigure-region-flip-functions-unsupported = { $subject }: atribut flipFunctions na regionBetweenCurves nije podržan; potomak je preskočen.

prefigure-region-non-formula-child = { $subject }: na regionBetweenCurves podržane su samo podređene funkcije zadane formulom; potomak je preskočen.

prefigure-label-position-unsupported =
    { $subject }: nepodržan labelPosition „{ $labelPosition }” za { $labelKind ->
        [line-family] oznaku iz obitelji pravaca
       *[point] oznaku točke
    }; koristi se zadano poravnanje PreFigurea.

prefigure-fill-style-unsupported = { $subject }: stil ispune „{ $fillStyle }” nije podržan u PreFigureu; koristi se puna ispuna.

prefigure-line-style-unknown = { $subject }: nepoznat stil linije „{ $lineStyle }” izostavljen je iz izlaza PreFigurea.

prefigure-marker-style-mapped-to-diamond = { $subject }: stil oznake „{ $markerStyle }” preslikan je u stil „diamond” u PreFigureu.

prefigure-marker-style-unsupported = { $subject }: stil oznake „{ $markerStyle }” nije podržan u PreFigureu; koristi se zadani stil.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: neispravan `ref`; cilj se ne može razriješiti. Napomena je izostavljena.

annotation-ref-multiple-targets = `<annotation>`: `ref` se razriješio u više ciljeva; koristi se prvi.

annotation-ref-outside-graph = `<annotation>`: neispravan `ref`; cilj je izvan grafa koji ga sadrži. Napomena je izostavljena.

annotation-ref-unsupported-target = `<annotation>`: neispravan `ref`; cilj nije podržan grafički objekt pri pretvorbi u prefigure. Napomena je izostavljena.

annotation-text-missing = `<annotation>`: `text` nedostaje ili je prazan; ispisuje se prazan tekst.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Otkrivena je kružna ovisnost.
       *[other] Otkrivena je kružna ovisnost koja uključuje komponentu `<{ $componentType }>`.
    }

reference-no-referent = Nije pronađen objekt za uputu: `{ $reference }`

reference-multiple-referents = Pronađeno je više objekata za uputu: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Neispravan oblik atributa { $attribute } komponente `<{ $componentType }>`.

children-invalid = Neispravna djeca za `<{ $componentType }>`: pronađena su neispravna djeca: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Neispravna vrijednost `{ $value }` za atribut `{ $attribute }`; koristi se vrijednost `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Verzija { $version } DoenetML-a nije pronađena.
       *[other] Verzija { $version } DoenetML-a nije pronađena. Koristi se verzija { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Neispravan DoenetML: { $content }

parse-tag-missing-close-tag = Neispravan DoenetML: oznaka `{ $tag }` nema zatvarajuću oznaku. Očekivala se samozatvarajuća oznaka ili oznaka `</{ $tagName }>`.

parse-tag-error = Neispravan DoenetML: pogreška u oznaci `<{ $tagName }>`

parse-attribute-missing-value = Neispravan DoenetML: atributu `{ $attribute }` čini se da nedostaje vrijednost.

parse-attribute-invalid = Neispravan DoenetML: neispravan atribut `{ $attribute }`

parse-attribute-value-invalid = Neispravan DoenetML: neispravna vrijednost atributa `{ $value }`

parse-attribute-value-quote-mismatch = Neispravan DoenetML: neispravna vrijednost atributa `{ $value }`. Navodnici se ne podudaraju. Čini se da nedostaje `{ $quote }`

parse-open-tag-name-missing = Neispravan DoenetML: pronađena je oznaka bez imena, primjerice `<`

parse-tag-not-closed = Neispravan DoenetML: oznaka `{ $tag }` nije zatvorena (čini se da nedostaje `>`).

parse-self-closing-tag-name-missing = Neispravan DoenetML: pronađena je oznaka bez imena `<{ $content }>`

parse-self-closing-tag-not-closed = Neispravan DoenetML: oznaka `{ $tag }` nije zatvorena (čini se da nedostaje `/>`).

parse-tag-invalid-attributes = Neispravan DoenetML: oznaka `{ $tag }` nije valjana. Možda ima pogrešne atribute.

parse-close-tag-name-missing = Neispravan DoenetML: pronađena je zatvarajuća oznaka bez imena, primjerice `</`

parse-attribute-value-unquoted = Vrijednosti atributa moraju biti u navodnicima: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Neispravan DoenetML: pronađena je zatvarajuća oznaka `{ $tag }`, ali nema odgovarajuće otvarajuće

parse-close-tag-mismatched = Neispravan DoenetML: nepodudarna zatvarajuća oznaka. Očekivala se `</{ $expected }>`. Pronađena je `{ $found }`

parser-node-unconvertible = Čvor { $node } nije se mogao pretvoriti u Dast čvor.

## Names

name-attribute-invalid =
    Neispravan atribut name='{ $name }'. { $reason ->
        [characters] Imena mogu sadržavati samo slova, brojke, podvlake ili crtice.
       *[start] Imena moraju počinjati slovom.
    }

component-name-invalid-start = Neispravno ime komponente „{ $name }”. Imena moraju počinjati slovom.

## `<answer>` sugar

answer-video-watched-missing-video = answer tipa videoWatched mora imati atribut video

answer-video-watched-video-not-reference = Kod answer tipa videoWatched atribut video mora biti uputa

answer-name-not-single-text = Atribut name komponente answer mora imati točno jedno tekstualno dijete

## Referencing another document

external-doenetml-recursion-limit = Vanjski DoenetML nije se mogao dohvatiti zbog previše razina rekurzije. Postoji li kružna uputa?

external-doenetml-unavailable = DoenetML se nije mogao dohvatiti s { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Dohvaćen je neispravan DoenetML s { $attribute }="{ $uri }": ne odgovara tipu komponente „{ $componentType }”

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` je zastario; upotrijebite `{ $to }`.
       *[other] [deprecation] Atribut `{ $from }` na `<{ $component }>` je zastario; upotrijebite `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atribut `{ $from }` je zastario i zanemaruje se jer je zadan i `{ $to }`.
       *[other] [deprecation] Atribut `{ $from }` na `<{ $component }>` je zastario i zanemaruje se jer je zadan i `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Atribut `{ $attribute }` na `<{ $component }>` je zastario i zanemaruje se.


## Language coverage

pluralize-english-only = `<pluralize>` može tvoriti množinu samo na engleskom, pa u dokumentu na jeziku { $locale } njegov tekst ostaje nepromijenjen. Napišite oblik množine sami ili ga zadajte atributom `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Element `<{ $tag }>` nije prepoznat Doenetov element.

schema-element-not-allowed-at-root = Element `<{ $tag }>` nije dopušten u korijenu dokumenta.

schema-element-not-allowed-inside = Element `<{ $tag }>` nije dopušten unutar `<{ $parent }>`.

schema-attribute-unrecognized = Element `<{ $tag }>` nema atribut imena `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atribut `{ $attribute }` elementa `<{ $tag }>` mora biti popis čiji je svaki član jedno od: { $allowed }
       *[other] Atribut `{ $attribute }` elementa `<{ $tag }>` mora biti jedno od: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Neispravno ime varijante za select. Ime varijante { $variantName } pojavljuje se u { $numOptions } mogućnosti, a odabrati treba { $numToSelect }.

select-variant-name-without-options = Za select su zadane varijante, ali nije zadana nijedna mogućnost za moguće ime varijante: { $variantName }.

select-variant-name-not-possible = Ime varijante { $variantName } zadano za select nije moguće ime varijante.

select-too-few-options = Nije moguće odabrati { $numToSelect } komponenata iz samo { $numOptions }.

select-from-sequence-too-few-values = Nije moguće odabrati { $numToSelect } vrijednosti iz niza duljine { $length }.

select-from-sequence-indices-count-mismatch = Broj indeksa zadanih za select mora odgovarati broju za odabir

select-from-sequence-indices-not-integers = Svi indeksi zadani za select moraju biti cijeli brojevi

select-from-sequence-index-excluded = Zadani indeks za selectfromsequence bio je isključen

select-from-sequence-indices-excluded-combination = Zadani indeksi za selectfromsequence činili su isključenu kombinaciju

select-from-sequence-coprime-not-positive-integers = Nije moguće odabrati relativno proste kombinacije jer se ne biraju pozitivni cijeli brojevi.

select-from-sequence-coprime-common-factor = Nije moguće odabrati relativno proste brojeve. Sve moguće vrijednosti imaju zajednički djelitelj. (Zadane vrijednosti "from" ili "to" moraju biti relativno proste sa "step".)

select-from-sequence-coprime-single-number = Nije moguće odabrati relativno proste kombinacije iz jednog broja različitog od 1.

select-from-sequence-excluded-too-many-combinations = U selectFromSequence isključeno je više od 70 % kombinacija

select-from-sequence-coprime-none-found = Relativno proste brojeve nije bilo moguće odabrati. Sve moguće vrijednosti imaju zajednički djelitelj.

select-from-sequence-too-few-unique-values = Nije moguće odabrati { $numToSelect } različitih vrijednosti iz niza duljine { $numPossibleValues }

select-prime-numbers-too-few-values = Nije moguće odabrati { $numToSelect } vrijednosti s popisa prostih brojeva duljine { $numValues }

select-prime-numbers-values-count-mismatch = Broj vrijednosti zadanih za select mora odgovarati broju za odabir

select-prime-numbers-values-not-prime = Sve vrijednosti zadane za select prime number moraju biti na popisu prostih brojeva

select-prime-numbers-values-excluded-combination = Zadane vrijednosti za selectPrimeNumbers činile su isključenu kombinaciju

select-prime-numbers-excluded-too-many-combinations = U selectPrimeNumbers isključeno je više od 70 % kombinacija

select-random-combination-fluke = Krajnje nevjerojatnom slučajnošću nije bilo moguće odabrati kombinaciju slučajnih vrijednosti

select-random-value-fluke = Krajnje nevjerojatnom slučajnošću nije bilo moguće odabrati slučajnu vrijednost
