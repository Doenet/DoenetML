# Polish diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Polish counts in four plural categories, and which of them a message needs
# depends on what the count does in it. A message that prints the number next
# to a noun has to agree that noun with it, so it spells out `one`, `few` and
# `many` and lets `*[other]` carry the fractional values CLDR routes there. A
# message where the number never appears — the list messages, whose count only
# decides whether a verb is singular or plural — has just the two forms Polish
# offers there, so `one` and `*[other]` are the whole selection.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } jest ignorowany, gdy podano dwa końce
       *[other] { $attributes } są ignorowane, gdy podano dwa końce
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } jest ignorowany, gdy podano jednocześnie koniec i środek
       *[other] { $attributes } są ignorowane, gdy podano jednocześnie koniec i środek
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset nie działa bez podanego środka

## `<line>`

line-points-undetermined-dimensions = Prosta przechodząca przez punkty o nieokreślonym wymiarze.

line-points-too-few-dimensions = Prosta musi przechodzić przez punkty co najmniej dwuwymiarowe.

line-points-depend-on-variables = Prosta przechodzi przez punkty zależne od zmiennych: { $variables }.

line-equation-invalid-format = Nieprawidłowy format równania prostej dla zmiennych { $variable1 } i { $variable2 }.

## `<ray>`

ray-overprescribed-through = Półprosta jest określona jednocześnie przez through, endpoint i direction. Podane through zostaje zignorowane.

ray-dimension-mismatch = Niezgodne numDimensions w półprostej.

## `<vector>`

vector-overprescribed-head = Wektor jest określony jednocześnie przez head, tail i displacement. Podane head zostaje zignorowane.

vector-dimension-mismatch = Niezgodne numDimensions w wektorze.

## Attracting and constraining

attract-to-without-nearest-point = Nie można przyciągnąć do `<{ $component }>`, ponieważ nie ma on zmiennej stanu nearestPoint.

constrain-to-without-nearest-point = Nie można ograniczyć do `<{ $component }>`, ponieważ nie ma on zmiennej stanu nearestPoint.

constrain-to-interior-without-nearest-point = Nie można ograniczyć do wnętrza `<{ $component }>`, ponieważ nie ma on zmiennej stanu nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition jest ignorowane dla choiceInput, który nie jest inline

## Ordering children by index

choice-input-indices-count-mismatch = Ignorowanie indices podanych dla choiceInput, ponieważ liczba indices nie odpowiada liczbie elementów potomnych choice.

pretzel-indices-count-mismatch = Ignorowanie indices podanych dla problem, ponieważ liczba indices nie odpowiada liczbie elementów potomnych problem.

shuffle-indices-count-mismatch = Ignorowanie indices podanych dla shuffle, ponieważ liczba indices nie odpowiada liczbie komponentów.

indices-ignored-out-of-range = Ignorowanie indices podanych dla { $component }, ponieważ część indeksów wykracza poza zakres.

pretzel-indices-repeated = Ignorowanie indices podanych dla pretzel, ponieważ część indeksów się powtarza.

pretzel-circuit-first-index = Ignorowanie indices podanych dla pretzel w trybie circuit, ponieważ pierwszy indeks musi wynosić 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Aby `<{ $component }>` działał z tekstowymi elementami potomnymi, trzeba podać atrybut `type`.

invalid-type-defaulting-to-math = Nieprawidłowy typ { $type } dla komponentu { $component }. Musi to być math, text, number albo boolean. Używany jest math.

string-not-valid-component-to-arrange = Tekst „{ $value }” nie jest prawidłowym komponentem dla { $component }. Zignorowano.

## Types and variables

invalid-type-defaulting-to-number = Nieprawidłowy typ { $type }; typ ustawiony na number.

invalid-variable-value = Nieprawidłowa wartość zmiennej: `{ $value }`

## Variants

variant-index-must-be-number = Indeks wariantu { $index } musi być liczbą

variant-index-must-be-integer = Indeks wariantu { $index } musi być liczbą całkowitą

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` nie obsługuje wymiarów bezwzględnych. Szerokości ustawiane są na względne.

side-by-side-absolute-margins = `<{ $component }>` nie obsługuje wymiarów bezwzględnych. Marginesy ustawiane są na względne.

side-by-side-no-block-child = Nieprawidłowy `<{ $component }>`: musi mieć co najmniej jeden blokowy element potomny.

## `<label>`

label-for-ignored-on-graphical = Atrybut `for` w graficznym `<label>` jest ignorowany.

label-for-must-resolve-to-one = Atrybut `for` w `<label>` musi wskazywać dokładnie jeden komponent.

label-for-unresolved = Nie udało się powiązać atrybutu `for` w `<label>` z żadnym komponentem.

label-for-answer-with-authored-inputs = Atrybut `for` w `<label>` odwołuje się do `<answer>` z jawnie zapisanymi polami; odwołaj się bezpośrednio do pola.

label-for-answer-without-input = Atrybut `for` w `<label>` odwołuje się do `<answer>` bez pola, które można opisać etykietą.

label-for-must-reference-input-or-answer = Atrybut `for` w `<label>` musi odwoływać się do pola albo do odpowiedzi.

## Accessibility

accessibility-short-description-or-decorative = Ze względu na dostępność `<{ $component }>` musi mieć krótki opis albo być oznaczony jako dekoracyjny.

accessibility-video-short-description = Ze względu na dostępność `<video>` musi mieć krótki opis.

accessibility-input-short-description-or-label = Ze względu na dostępność `<{ $component }>` musi mieć krótki opis albo etykietę.

accessibility-answer-input-short-description-or-label = Ze względu na dostępność `<answer>` tworzący pole musi mieć krótki opis albo etykietę.

accessibility-short-description-contains-math = Krótkie opisy nie powinny zawierać komponentów matematycznych takich jak `<{ $component }>`. Zapisz matematykę słowami.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ma niewystarczający kontrast dla tekstu nagłówka sekcji (tryb ciemny) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; wymagane co najmniej { $threshold }:1).
       *[other] { $colorName } ma niewystarczający kontrast dla tekstu nagłówka sekcji ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; wymagane co najmniej { $threshold }:1).
    }

## `<circle>`

# «przez» governs the accusative, and the negation in front of it does not
# reach inside a prepositional phrase — so the count still selects, and 2–4
# (which is what a circle through points actually gets) needs «punkty».
circle-through-points-non-numerical =
    { $count ->
        [one] Nie zaimplementowano jeszcze `<circle>` przechodzącego przez { $count } punkt, gdy punkty nie mają wartości liczbowych.
        [few] Nie zaimplementowano jeszcze `<circle>` przechodzącego przez { $count } punkty, gdy punkty nie mają wartości liczbowych.
       *[other] Nie zaimplementowano jeszcze `<circle>` przechodzącego przez { $count } punktów, gdy punkty nie mają wartości liczbowych.
    }

circle-too-many-through-points = Nie można wyznaczyć okręgu przechodzącego przez więcej niż 3 punkty.

circle-overprescribed-radius-center-points = Nie można wyznaczyć okręgu z jednocześnie podanym promieniem, środkiem i punktami przejścia.

circle-center-with-multiple-points = Nie można wyznaczyć okręgu o podanym środku przechodzącego przez więcej niż 1 punkt.

circle-radius-too-small = Nie można wyznaczyć okręgu: skoro odległość między dwoma punktami wynosi { $distance }, podany promień { $radius } jest za mały.

circle-radius-with-many-points = Nie można utworzyć okręgu przechodzącego przez więcej niż dwa punkty przy podanym promieniu.

circle-invalid-center-or-through-points = Nieprawidłowy środek albo punkty przejścia okręgu.

circle-radius-center-with-multiple-points = Nie można wyznaczyć promienia okręgu o podanym środku przechodzącego przez więcej niż 1 punkt.

circle-change-radius-non-numerical = Nie można zmienić promienia okręgu, którego punkty przejścia nie są liczbowe

circle-radius-with-points-non-numerical = Nie można utworzyć okręgu przechodzącego przez więcej niż jeden punkt przy podanym promieniu, gdy brak wartości liczbowych.

circle-change-center-non-numerical = Nie zaimplementowano jeszcze zmiany środka okręgu przechodzącego przez punkty nieliczbowe.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Niewystarczające wymiary dziedziny funkcji. Dziedzina ma { $intervals } przedział, a funkcja ma { $inputs ->
            [one] { $inputs } argument
            [few] { $inputs } argumenty
            [many] { $inputs } argumentów
           *[other] { $inputs } argumentu
        }.
        [few] Niewystarczające wymiary dziedziny funkcji. Dziedzina ma { $intervals } przedziały, a funkcja ma { $inputs ->
            [one] { $inputs } argument
            [few] { $inputs } argumenty
            [many] { $inputs } argumentów
           *[other] { $inputs } argumentu
        }.
        [many] Niewystarczające wymiary dziedziny funkcji. Dziedzina ma { $intervals } przedziałów, a funkcja ma { $inputs ->
            [one] { $inputs } argument
            [few] { $inputs } argumenty
            [many] { $inputs } argumentów
           *[other] { $inputs } argumentu
        }.
       *[other] Niewystarczające wymiary dziedziny funkcji. Dziedzina ma { $intervals } przedziału, a funkcja ma { $inputs ->
            [one] { $inputs } argument
            [few] { $inputs } argumenty
            [many] { $inputs } argumentów
           *[other] { $inputs } argumentu
        }.
    }

function-domain-invalid-format = Nieprawidłowy format dziedziny funkcji.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ignorowanie nieliczbowego maksimum funkcji.
        [minimum] Ignorowanie nieliczbowego minimum funkcji.
        [extremum] Ignorowanie nieliczbowego ekstremum funkcji.
        [point] Ignorowanie nieliczbowego punktu funkcji.
        [slope] Ignorowanie nieliczbowego nachylenia funkcji.
       *[other] Ignorowanie nieliczbowego { $type } funkcji.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ignorowanie pustego maksimum funkcji.
        [minimum] Ignorowanie pustego minimum funkcji.
        [extremum] Ignorowanie pustego ekstremum funkcji.
        [point] Ignorowanie pustego punktu funkcji.
       *[other] Ignorowanie pustego { $type } funkcji.
    }

function-points-too-close = Funkcja zawiera dwa punkty położone zbyt blisko siebie. Nie można zdefiniować funkcji.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Iterowanie funkcji jest możliwe tylko wtedy, gdy liczba argumentów równa się liczbie wartości. Ta funkcja ma { $inputs } argument i { $outputs ->
            [one] { $outputs } wartość
            [few] { $outputs } wartości
            [many] { $outputs } wartości
           *[other] { $outputs } wartości
        }.
        [few] Iterowanie funkcji jest możliwe tylko wtedy, gdy liczba argumentów równa się liczbie wartości. Ta funkcja ma { $inputs } argumenty i { $outputs ->
            [one] { $outputs } wartość
            [few] { $outputs } wartości
            [many] { $outputs } wartości
           *[other] { $outputs } wartości
        }.
        [many] Iterowanie funkcji jest możliwe tylko wtedy, gdy liczba argumentów równa się liczbie wartości. Ta funkcja ma { $inputs } argumentów i { $outputs ->
            [one] { $outputs } wartość
            [few] { $outputs } wartości
            [many] { $outputs } wartości
           *[other] { $outputs } wartości
        }.
       *[other] Iterowanie funkcji jest możliwe tylko wtedy, gdy liczba argumentów równa się liczbie wartości. Ta funkcja ma { $inputs } argumentu i { $outputs ->
            [one] { $outputs } wartość
            [few] { $outputs } wartości
            [many] { $outputs } wartości
           *[other] { $outputs } wartości
        }.
    }

## `<sequence>`

sequence-invalid-length = Nieprawidłowa długość ciągu. Musi to być nieujemna liczba całkowita.

sequence-invalid-step = Nieprawidłowy krok ciągu. Dla ciągu typu { $type } musi to być liczba.

sequence-invalid-endpoint-number = Nieprawidłowe „{ $attribute }” w ciągu liczbowym. Musi to być liczba.

sequence-invalid-endpoint-letters = Nieprawidłowe „{ $attribute }” w ciągu liter. Musi to być kombinacja liter.

sequence-invalid-endpoint = Nieprawidłowe „{ $attribute }” w ciągu.

select-from-sequence-coprime-not-numbers = coprime zignorowane, ponieważ nie są wybierane liczby

select-from-sequence-coprime-with-exclude-combinations = coprime zignorowane, ponieważ podano excludeCombinations

## Resolving a `target`

target-not-found = Nieprawidłowy target dla `<{ $source }>`: nie znaleziono celu.

target-state-variable-not-found = Nieprawidłowy target dla `<{ $source }>`: nie znaleziono zmiennej stanu o nazwie „{ $property }” w `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Zmienne `<odeSystem>` muszą różnić się od zmiennej niezależnej.

ode-system-duplicate-variable-names = Nie można zdefiniować prawych stron równań ODE przy powtarzających się nazwach zmiennych zależnych.

ode-system-rhs-function-error = Nie można zdefiniować prawej strony równania ODE. Błąd podczas tworzenia funkcji mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Nie można zdefiniować kąta między { $count } prostymi

angle-invalid-through-point = Nieprawidłowy punkt w through elementu `<angle>`

parabola-vertex-too-many-points = Nie zaimplementowano jeszcze paraboli o podanym wierzchołku przechodzącej przez więcej niż 1 punkt.

parabola-too-many-points = Nie zaimplementowano jeszcze paraboli przechodzącej przez więcej niż 3 punkty.

intersection-too-many-items = Nie zaimplementowano jeszcze przecięcia więcej niż dwóch obiektów

## Other math components

ionic-compound-not-two-ions = Nie zaimplementowano jeszcze związku jonowego o liczbie jonów innej niż dwa.

ionic-compound-needs-cation-and-anion = Związek jonowy zaimplementowano tylko dla jednego kationu i jednego anionu.

solve-equations-cannot-evaluate = Nie można rozwiązać równania, ponieważ nie udało się go obliczyć: { $equation }

math-operators-operand-number-required = Przy wyodrębnianiu argumentu matematycznego trzeba podać operandNumber.

eigen-decomposition-failed = Nie udało się obliczyć wartości własnych macierzy

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parametr { $parameters } nie występuje we wzorcu, więc zawsze dopasuje pustą wartość.
       *[other] `<matchesPattern>`: parametry { $parameters } nie występują we wzorcu, więc zawsze dopasują pustą wartość.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: nie można zinterpretować grid="{ $grid }". Musi to być none, medium, dense albo dwie liczby dodatnie oddzielone spacją, na przykład grid="1 0.5". Siatka nie jest rysowana.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" nie jest obsługiwane w rendererze prefigure; używane jest zachowanie dla pozycji po prawej.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" nie jest obsługiwane w rendererze prefigure; używane jest zachowanie dla pozycji u góry.

prefigure-invalid-axis-bounds = `<graph>`: nieprawidłowe granice osi dla konwersji prefigure; używane jest domyślne bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: nieprawidłowa szerokość dla konwersji prefigure; używana jest domyślna szerokość rysunku 425.

prefigure-invalid-aspect-ratio = `<graph>`: nieprawidłowe aspectRatio dla konwersji prefigure; używane są domyślne proporcje 1.

prefigure-grid-spacing-too-fine = `<graph>`: odstęp siatki jest zbyt gęsty względem zakresu osi; siatka jest pomijana w rendererze prefigure.

prefigure-annotations-not-rendered = `<graph>`: adnotacje nie będą rysowane, gdy nie jest używany renderer PreFigure.

multiple-annotations-children = Znaleziono wiele elementów potomnych `<annotations>` w `<graph>`; wszystkie poza ostatnim są ignorowane.

## Referring to other components

copy-unrecognized-component-type = Nie można rozszerzyć ani skopiować nierozpoznanego typu komponentu: { $type }.

copy-prop-not-found = Nie znaleziono właściwości { $property } w komponencie typu { $component }

collect-no-source = Nie znaleziono źródła dla collect.

collect-invalid-component-type = Nie można zebrać komponentów typu `<{ $component }>`, ponieważ nie jest to prawidłowy typ komponentu.

reference-index-unavailable = Nie można odwołać się do indeksu `{ $reference }`

## `<callAction>`

component-action-unavailable = Nie można wywołać { $action } w komponencie `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Dane mają nieprawidłowy kształt. Wiersze mają niejednakowe długości. Znaleziono w componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Dane zawierają powtarzające się nazwy kolumn. Znaleziono w componentIdx :{ $componentIdx }

data-frame-missing-column-name = W danych brakuje nazwy kolumny. Znaleziono w componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Element award tej odpowiedzi opiera się na odpowiedzi wysłanej przez sam znacznik answer, co doprowadzi do nieoczekiwanego działania.

answer-max-num-attempts-in-section-wide-check-work = Ustawienie `maxNumAttempts` w `<answer>` wewnątrz kontenera z `sectionWideCheckWork` nie działa, ponieważ liczbę prób kontroluje kontener. Ustaw `maxNumAttempts` na kontenerze.

nested-section-wide-check-work-max-num-attempts = Ustawienie `maxNumAttempts` na kontenerze z `sectionWideCheckWork`, który znajduje się wewnątrz innego kontenera z `sectionWideCheckWork`, nie działa, ponieważ liczbę prób kontroluje kontener zewnętrzny. Ustaw `maxNumAttempts` na kontenerze zewnętrznym.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Atrybut { $attributes } nie zadziała bez ustawionego symbolicEquality.
       *[other] Atrybuty { $attributes } nie zadziałają bez ustawionego symbolicEquality.
    }

answer-invalid-type = Nieprawidłowy typ dla answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ponieważ komponent `<{ $component }>` nie ma nazwy, nie można go użyć jako atrybutu modułu

module-attribute-name-already-defined = Komponentu `<{ $component } name="{ $name }">` nie można użyć jako atrybutu modułu, ponieważ typ komponentu `<module>` ma już zdefiniowany atrybut „{ $name }”.

conditional-content-condition-ignored = Atrybut `condition` jest ignorowany w komponencie `<conditionalContent>` mającym elementy potomne case albo else.

slider-markers-type-mismatch = Typ znaczników nie odpowiada typowi suwaka.

pretzel-problem-needs-statement-and-answer = Nieprawidłowy pretzel: każdy `<problem>` musi zawierać jeden `<statement>` i jeden `<answer>`.

pretzel-circuit-first-problem-distractor = Nieprawidłowy pretzel: w mode="circuit" pierwszy `<problem>` nie może być dystraktorem.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Nieprawidłowa wartość { $values } atrybutu `{ $attribute }`; zignorowano.
       *[other] Nieprawidłowe wartości { $values } atrybutu `{ $attribute }`; zignorowano.
    }

attribute-must-be-references = Nieprawidłowa wartość `{ $value }` atrybutu `{ $attribute }`. Atrybut musi składać się z odwołań zaczynających się od `$`.

math-input-invalid-function-names = <mathInput>: zignorowano nieprawidłowe nazwy funkcji w { $attribute }: { $names }. Widoczna część każdej nazwy musi mieć co najmniej 2 znaki (litery albo myślniki); może po niej wystąpić opcjonalny przyrostek `|<alternatywa mathspeak>`.

## Building components from the source

component-type-invalid = Nieprawidłowy typ komponentu: `<{ $componentType }>`

attribute-repeated = Nie można powtórzyć atrybutu { $attribute }.

attribute-invalid-for-component = Nieprawidłowy atrybut „{ $attribute }” dla komponentu typu `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Definicja stylu { $styleNumber } ma niewystarczający kontrast dla { $context ->
        [text-on-background] koloru tekstu względem koloru tła
        [high-contrast] koloru o wysokim kontraście względem płótna
        [line] koloru linii względem płótna
        [marker] koloru znacznika względem płótna
       *[text-on-canvas] koloru tekstu względem płótna
    }{ $mode ->
        [dark] { " (tryb ciemny)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; wymagane co najmniej { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Choć definicja stylu { $styleNumber } podaje kolory o wystarczającym kontraście dla trybu jasnego, kolory trybu ciemnego wyprowadzone z tych wartości mają niewystarczający kontrast między kolorem tekstu a kolorem tła ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; wymagane co najmniej { $threshold }:1). { $suggestion ->
        [available] Aby zapewnić wystarczający kontrast w trybie ciemnym, zwiększ kontrast trybu jasnego (na przykład ustaw { $lightAttribute }="{ $lightColor }") albo nadpisz kolor trybu ciemnego (na przykład ustaw { $darkAttribute }="{ $darkColor }").
       *[none] Aby zapewnić wystarczający kontrast w trybie ciemnym, zwiększ kontrast trybu jasnego albo nadpisz wyprowadzone kolory za pomocą textColorDarkMode i/lub backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Choć definicja stylu { $styleNumber } podaje kolor tekstu o wystarczającym kontraście dla trybu jasnego, kolor tekstu trybu ciemnego wyprowadzony z tej wartości ma niewystarczający kontrast względem płótna ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; wymagane co najmniej { $threshold }:1). { $suggestion ->
        [available] Aby zapewnić wystarczający kontrast w trybie ciemnym, zwiększ kontrast trybu jasnego (na przykład ustaw textColor="{ $lightColor }") albo nadpisz kolor trybu ciemnego (na przykład ustaw textColorDarkMode="{ $darkColor }").
       *[none] Aby zapewnić wystarczający kontrast w trybie ciemnym, zwiększ kontrast trybu jasnego albo nadpisz wyprowadzony kolor za pomocą textColorDarkMode.
    }

section-multiple-style-palettes = Sekcja może wybrać tylko jeden <stylePalette>; używany jest ostatni.

## Unique variants

variant-num-to-select-not-non-negative-integer = nie można ustalić unikatowych wariantów { $component }, ponieważ numToSelect nie jest nieujemną liczbą całkowitą.

variant-num-to-select-not-constant-number = nie można ustalić unikatowych wariantów { $component }, ponieważ numToSelect nie jest stałą.

variant-with-replacement-not-constant-boolean = nie można ustalić unikatowych wariantów { $component }, ponieważ withReplacement nie jest stałą wartością logiczną.

variant-select-weight-disables-unique = unikatowe warianty select są wyłączone, jeśli któraś opcja podaje selectWeight albo selectForVariants

variant-coprime-undetermined = nie można ustalić unikatowych wariantów { $component }, ponieważ nie da się stwierdzić, że coprime jest zawsze fałszywe.

variant-attribute-not-constant = nie można ustalić unikatowych wariantów { $component }, ponieważ { $attribute } nie jest stałą.

variant-attribute-not-number = nie można ustalić unikatowych wariantów { $component }, ponieważ { $attribute } nie jest liczbą.

variant-attribute-wrong-type-for-sequence =
    nie można ustalić unikatowych wariantów { $component } typu { $type }, ponieważ { $attribute } nie jest { $expected ->
        [letters-combination] kombinacją liter
        [math-expression] prawidłowym wyrażeniem matematycznym
        [integer] liczbą całkowitą
       *[number] liczbą
    }.

variant-length-not-integer = nie można ustalić unikatowych wariantów { $component }, ponieważ length nie jest liczbą całkowitą.

variant-sort-not-implemented = nie zaimplementowano jeszcze unikatowych wariantów { $component } z sort

variant-exclude-combinations-not-implemented = nie zaimplementowano jeszcze unikatowych wariantów { $component } z excludeCombinations

variant-math-exclude-not-implemented = nie zaimplementowano jeszcze unikatowych wariantów { $component } typu math z exclude

variant-non-constant-exclude-not-implemented = nie zaimplementowano jeszcze unikatowych wariantów { $component } z niestałym exclude

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: nieobsługiwane w rendererze prefigure wykresu; element potomny pominięty.

prefigure-descendant-invalid-geometry = { $subject }: nieskończone lub niepełne wartości geometryczne; element potomny pominięty.

prefigure-curve-label-omitted = { $subject }: przekształcone elementy krzywej nie obsługują etykiet; etykieta pominięta.

prefigure-curve-unsupported-definition-type = { $subject }: nieobsługiwany typ definicji funkcji krzywej „{ $definitionType }”; element potomny pominięty.

prefigure-region-flip-functions-unsupported = { $subject }: nieobsługiwany atrybut flipFunctions w regionBetweenCurves; element potomny pominięty.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves obsługuje tylko funkcje potomne typu formuła; element potomny pominięty.

prefigure-label-position-unsupported =
    { $subject }: nieobsługiwane labelPosition „{ $labelPosition }” dla { $labelKind ->
        [line-family] etykiety rodziny prostych
       *[point] etykiety punktu
    }; używane jest domyślne wyrównanie PreFigure.

prefigure-fill-style-unsupported = { $subject }: styl wypełnienia „{ $fillStyle }” nie jest obsługiwany przez PreFigure; użyto wypełnienia jednolitego.

prefigure-line-style-unknown = { $subject }: nieznany styl linii „{ $lineStyle }” pominięto w wyniku PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: styl znacznika „{ $markerStyle }” odwzorowano na styl „diamond” w PreFigure.

prefigure-marker-style-unsupported = { $subject }: styl znacznika „{ $markerStyle }” nie jest obsługiwany przez PreFigure; użyto stylu domyślnego.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: nieprawidłowe `ref`; nie można ustalić celu. Adnotacja pominięta.

annotation-ref-multiple-targets = `<annotation>`: `ref` wskazuje wiele celów; użyto pierwszego.

annotation-ref-outside-graph = `<annotation>`: nieprawidłowe `ref`; cel znajduje się poza wykresem, który go zawiera. Adnotacja pominięta.

annotation-ref-unsupported-target = `<annotation>`: nieprawidłowe `ref`; w konwersji prefigure cel nie jest obsługiwanym obiektem graficznym. Adnotacja pominięta.

annotation-text-missing = `<annotation>`: brak `text` albo jest puste; wypisywany jest pusty tekst.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Wykryto zależność cykliczną.
       *[other] Wykryto zależność cykliczną obejmującą komponent `<{ $componentType }>`.
    }

reference-no-referent = Nie znaleziono obiektu dla odwołania: `{ $reference }`

reference-multiple-referents = Znaleziono wiele obiektów dla odwołania: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Nieprawidłowy format atrybutu { $attribute } elementu `<{ $componentType }>`.

children-invalid = Nieprawidłowe elementy potomne `<{ $componentType }>`: znaleziono nieprawidłowe elementy potomne: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Nieprawidłowa wartość `{ $value }` atrybutu `{ $attribute }`; używana jest wartość `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Nie znaleziono wersji { $version } DoenetML.
       *[other] Nie znaleziono wersji { $version } DoenetML. Powrót do wersji { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Nieprawidłowy DoenetML: { $content }

parse-tag-missing-close-tag = Nieprawidłowy DoenetML: znacznik `{ $tag }` nie ma znacznika zamykającego. Oczekiwano znacznika samozamykającego albo znacznika `</{ $tagName }>`.

parse-tag-error = Nieprawidłowy DoenetML: błąd w znaczniku `<{ $tagName }>`

parse-attribute-missing-value = Nieprawidłowy DoenetML: atrybutowi `{ $attribute }` zdaje się brakować wartości.

parse-attribute-invalid = Nieprawidłowy DoenetML: nieprawidłowy atrybut `{ $attribute }`

parse-attribute-value-invalid = Nieprawidłowy DoenetML: nieprawidłowa wartość atrybutu `{ $value }`

parse-attribute-value-quote-mismatch = Nieprawidłowy DoenetML: nieprawidłowa wartość atrybutu `{ $value }`. Cudzysłowy się nie zgadzają. Zdaje się brakować `{ $quote }`

parse-open-tag-name-missing = Nieprawidłowy DoenetML: znaleziono znacznik bez nazwy, na przykład `<`

parse-tag-not-closed = Nieprawidłowy DoenetML: znacznik `{ $tag }` nie został zamknięty (zdaje się brakować `>`).

parse-self-closing-tag-name-missing = Nieprawidłowy DoenetML: znaleziono znacznik bez nazwy `<{ $content }>`

parse-self-closing-tag-not-closed = Nieprawidłowy DoenetML: znacznik `{ $tag }` nie został zamknięty (zdaje się brakować `/>`).

parse-tag-invalid-attributes = Nieprawidłowy DoenetML: znacznik `{ $tag }` jest nieprawidłowy. Może mieć błędne atrybuty.

parse-close-tag-name-missing = Nieprawidłowy DoenetML: znaleziono znacznik zamykający bez nazwy, na przykład `</`

parse-attribute-value-unquoted = Wartości atrybutów muszą być ujęte w cudzysłowy: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Nieprawidłowy DoenetML: znaleziono znacznik zamykający `{ $tag }`, ale bez odpowiadającego mu znacznika otwierającego

parse-close-tag-mismatched = Nieprawidłowy DoenetML: niedopasowany znacznik zamykający. Oczekiwano `</{ $expected }>`. Znaleziono `{ $found }`

parser-node-unconvertible = Nie udało się przekształcić węzła { $node } w węzeł Dast.

## Names

name-attribute-invalid =
    Nieprawidłowy atrybut name='{ $name }'. { $reason ->
        [characters] Nazwy mogą zawierać tylko litery, cyfry, podkreślenia albo myślniki.
       *[start] Nazwy muszą zaczynać się od litery.
    }

component-name-invalid-start = Nieprawidłowa nazwa komponentu „{ $name }”. Nazwy muszą zaczynać się od litery.

## `<answer>` sugar

answer-video-watched-missing-video = answer typu videoWatched musi mieć atrybut video

answer-video-watched-video-not-reference = answer typu videoWatched musi mieć atrybut video będący odwołaniem

answer-name-not-single-text = Atrybut name elementu answer musi mieć dokładnie jeden tekstowy element potomny

## Referencing another document

external-doenetml-recursion-limit = Nie można pobrać zewnętrznego DoenetML z powodu zbyt wielu poziomów rekurencji. Czy nie ma odwołania cyklicznego?

external-doenetml-unavailable = Nie można pobrać DoenetML z { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Nieprawidłowy DoenetML pobrany z { $attribute }="{ $uri }": nie odpowiada typowi komponentu „{ $componentType }”

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Atrybut `{ $from }` jest przestarzały; użyj `{ $to }`.
       *[other] [deprecation] Atrybut `{ $from }` w `<{ $component }>` jest przestarzały; użyj `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Atrybut `{ $from }` jest przestarzały i został zignorowany, ponieważ podano również `{ $to }`.
       *[other] [deprecation] Atrybut `{ $from }` w `<{ $component }>` jest przestarzały i został zignorowany, ponieważ podano również `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Atrybut `{ $attribute }` w `<{ $component }>` jest przestarzały i został zignorowany.


## Language coverage

pluralize-english-only = `<pluralize>` potrafi tworzyć liczbę mnogą tylko po angielsku, więc w dokumencie napisanym w języku { $locale } tekst pozostaje bez zmian. Zapisz formę mnogą wprost albo podaj ją atrybutem `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Element `<{ $tag }>` nie jest rozpoznawanym elementem Doenet.

schema-element-not-allowed-at-root = Element `<{ $tag }>` nie jest dozwolony w korzeniu dokumentu.

schema-element-not-allowed-inside = Element `<{ $tag }>` nie jest dozwolony wewnątrz `<{ $parent }>`.

schema-attribute-unrecognized = Element `<{ $tag }>` nie ma atrybutu o nazwie `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Atrybut `{ $attribute }` elementu `<{ $tag }>` musi być listą, której każdy element jest jednym z: { $allowed }
       *[other] Atrybut `{ $attribute }` elementu `<{ $tag }>` musi być jednym z: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nieprawidłowa nazwa wariantu dla select. Nazwa wariantu { $variantName } występuje w { $numOptions } opcjach, ale liczba do wybrania to { $numToSelect }.

select-variant-name-without-options = Dla select podano warianty, ale brak opcji dla możliwej nazwy wariantu: { $variantName }.

select-variant-name-not-possible = Nazwa wariantu { $variantName } podana dla select nie jest możliwą nazwą wariantu.

select-too-few-options = Nie można wybrać { $numToSelect } komponentów spośród zaledwie { $numOptions }.

select-from-sequence-too-few-values = Nie można wybrać { $numToSelect } wartości z ciągu o długości { $length }.

select-from-sequence-indices-count-mismatch = Liczba indeksów podanych dla select musi odpowiadać liczbie do wybrania

select-from-sequence-indices-not-integers = Wszystkie indeksy podane dla select muszą być liczbami całkowitymi

select-from-sequence-index-excluded = Indeks podany dla selectfromsequence był wykluczony

select-from-sequence-indices-excluded-combination = Indeksy podane dla selectfromsequence tworzyły wykluczoną kombinację

select-from-sequence-coprime-not-positive-integers = Nie można wybrać kombinacji względnie pierwszych, ponieważ nie są wybierane dodatnie liczby całkowite.

select-from-sequence-coprime-common-factor = Nie można wybrać liczb względnie pierwszych. Wszystkie możliwe wartości mają wspólny dzielnik. (Podane wartości „from” albo „to” muszą być względnie pierwsze z „step”.)

select-from-sequence-coprime-single-number = Nie można wybrać kombinacji względnie pierwszych z pojedynczej liczby różnej od 1.

select-from-sequence-excluded-too-many-combinations = Wykluczono ponad 70% kombinacji w selectFromSequence

select-from-sequence-coprime-none-found = Nie udało się wybrać liczb względnie pierwszych. Wszystkie możliwe wartości mają wspólny dzielnik.

select-from-sequence-too-few-unique-values = Nie można wybrać { $numToSelect } różnych wartości z ciągu o długości { $numPossibleValues }

select-prime-numbers-too-few-values = Nie można wybrać { $numToSelect } wartości z listy liczb pierwszych o długości { $numValues }

select-prime-numbers-values-count-mismatch = Liczba wartości podanych dla select musi odpowiadać liczbie do wybrania

select-prime-numbers-values-not-prime = Wszystkie wartości podane dla select prime number muszą znajdować się na liście liczb pierwszych

select-prime-numbers-values-excluded-combination = Wartości podane dla selectPrimeNumbers tworzyły wykluczoną kombinację

select-prime-numbers-excluded-too-many-combinations = Wykluczono ponad 70% kombinacji w selectPrimeNumbers

select-random-combination-fluke = Przez skrajnie nieprawdopodobny zbieg okoliczności nie udało się wybrać kombinacji wartości losowych

select-random-value-fluke = Przez skrajnie nieprawdopodobny zbieg okoliczności nie udało się wybrać wartości losowej
