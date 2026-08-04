# Georgian diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# Georgian counts in the same two categories English does, so every selection
# below keeps both branches — but a noun after a numeral stays singular, so the
# two usually differ only in the number they print.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } იგნორირდება, როცა მითითებულია ორივე ბოლო წერტილი
       *[other] { $attributes } იგნორირდება, როცა მითითებულია ორივე ბოლო წერტილი
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } იგნორირდება, როცა მითითებულია ბოლო წერტილიც და შუა წერტილიც
       *[other] { $attributes } იგნორირდება, როცა მითითებულია ბოლო წერტილიც და შუა წერტილიც
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset არაფერს ცვლის შუა წერტილის გარეშე

## `<line>`

line-points-undetermined-dimensions = წრფე გაურკვეველი განზომილების წერტილებზე.

line-points-too-few-dimensions = წრფე უნდა გადიოდეს სულ მცირე ორგანზომილებიან წერტილებზე.

line-points-depend-on-variables = წრფე გადის წერტილებზე, რომლებიც დამოკიდებულია ცვლადებზე: { $variables }.

line-equation-invalid-format = წრფის განტოლების არასწორი ფორმატი ცვლადებში { $variable1 } და { $variable2 }.

## `<ray>`

ray-overprescribed-through = სხივი მოცემულია through-ით, endpoint-ით და direction-ით. მითითებული through იგნორირდება.

ray-dimension-mismatch = numDimensions არ ემთხვევა სხივში.

## `<vector>`

vector-overprescribed-head = ვექტორი მოცემულია head-ით, tail-ით და displacement-ით. მითითებული head იგნორირდება.

vector-dimension-mismatch = numDimensions არ ემთხვევა ვექტორში.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>`-ზე მიზიდვა შეუძლებელია, რადგან მას არ აქვს nearestPoint მდგომარეობის ცვლადი.

constrain-to-without-nearest-point = `<{ $component }>`-ით შემოსაზღვრა შეუძლებელია, რადგან მას არ აქვს nearestPoint მდგომარეობის ცვლადი.

constrain-to-interior-without-nearest-point = `<{ $component }>`-ის შიგნით შემოსაზღვრა შეუძლებელია, რადგან მას არ აქვს nearestPoint მდგომარეობის ცვლადი.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition იგნორირდება არაჩაშენებული choiceInput-ისთვის

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput-ისთვის მითითებული ინდექსები იგნორირდება, რადგან მათი რაოდენობა არ ემთხვევა choice შვილების რაოდენობას.

pretzel-indices-count-mismatch = problem-ისთვის მითითებული ინდექსები იგნორირდება, რადგან მათი რაოდენობა არ ემთხვევა problem შვილების რაოდენობას.

shuffle-indices-count-mismatch = shuffle-ისთვის მითითებული ინდექსები იგნორირდება, რადგან მათი რაოდენობა არ ემთხვევა კომპონენტების რაოდენობას.

indices-ignored-out-of-range = { $component }-ისთვის მითითებული ინდექსები იგნორირდება, რადგან ზოგი მათგანი დიაპაზონს სცილდება.

pretzel-indices-repeated = pretzel-ისთვის მითითებული ინდექსები იგნორირდება, რადგან ზოგი მათგანი მეორდება.

pretzel-circuit-first-index = circuit რეჟიმში pretzel-ისთვის მითითებული ინდექსები იგნორირდება, რადგან პირველი ინდექსი უნდა იყოს 1.

## `<shuffle>` and `<sort>`

string-children-need-type = იმისათვის, რომ `<{ $component }>` იმუშაოს ტექსტურ შვილებთან, უნდა მიეთითოს `type` ატრიბუტი.

invalid-type-defaulting-to-math = არასწორი ტიპი { $type } { $component } კომპონენტისთვის. უნდა იყოს math, text, number ან boolean. გამოიყენება math.

string-not-valid-component-to-arrange = სტრიქონი „{ $value }“ არ არის ვარგისი კომპონენტი { $component }-ისთვის. იგნორირდება.

## Types and variables

invalid-type-defaulting-to-number = არასწორი ტიპი { $type }, ტიპად დაყენდა number.

invalid-variable-value = ცვლადის არასწორი მნიშვნელობა: `{ $value }`

## Variants

variant-index-must-be-number = ვარიანტის ინდექსი { $index } უნდა იყოს რიცხვი

variant-index-must-be-integer = ვარიანტის ინდექსი { $index } უნდა იყოს მთელი რიცხვი

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` არ არის რეალიზებული აბსოლუტური ზომებისთვის. სიგანეები ხდება ფარდობითი.

side-by-side-absolute-margins = `<{ $component }>` არ არის რეალიზებული აბსოლუტური ზომებისთვის. ველები ხდება ფარდობითი.

side-by-side-no-block-child = არასწორი `<{ $component }>`: მას უნდა ჰქონდეს სულ მცირე ერთი ბლოკური შვილი.

## `<label>`

label-for-ignored-on-graphical = გრაფიკული `<label>`-ის `for` ატრიბუტი იგნორირდება.

label-for-must-resolve-to-one = `<label>`-ის `for` ატრიბუტი უნდა მიუთითებდეს ზუსტად ერთ კომპონენტზე.

label-for-unresolved = `<label>`-ის `for` ატრიბუტის კომპონენტთან დაკავშირება ვერ მოხერხდა.

label-for-answer-with-authored-inputs = `<label>`-ის `for` ატრიბუტი მიუთითებს `<answer>`-ზე, რომელსაც აქვს ავტორის მიერ დაწერილი შეყვანის ველები; მიუთითეთ პირდაპირ ველზე.

label-for-answer-without-input = `<label>`-ის `for` ატრიბუტი მიუთითებს `<answer>`-ზე, რომელსაც არ აქვს წარსაწერი შეყვანის ველი.

label-for-must-reference-input-or-answer = `<label>`-ის `for` ატრიბუტი უნდა მიუთითებდეს შეყვანის ველზე ან პასუხზე.

## Accessibility

accessibility-short-description-or-decorative = ხელმისაწვდომობისთვის `<{ $component }>`-ს უნდა ჰქონდეს მოკლე აღწერა ან მითითებული იყოს როგორც დეკორატიული.

accessibility-video-short-description = ხელმისაწვდომობისთვის `<video>`-ს უნდა ჰქონდეს მოკლე აღწერა.

accessibility-input-short-description-or-label = ხელმისაწვდომობისთვის `<{ $component }>`-ს უნდა ჰქონდეს მოკლე აღწერა ან წარწერა.

accessibility-answer-input-short-description-or-label = ხელმისაწვდომობისთვის შეყვანის ველის შემქმნელ `<answer>`-ს უნდა ჰქონდეს მოკლე აღწერა ან წარწერა.

accessibility-short-description-contains-math = მოკლე აღწერები არ უნდა შეიცავდეს მათემატიკურ კომპონენტებს, როგორიცაა `<{ $component }>`. მათემატიკა სიტყვებით ჩაწერეთ.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName }-ის კონტრასტი არასაკმარისია სექციის სათაურის ტექსტისთვის (მუქი თემა) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; საჭიროა სულ მცირე { $threshold }:1).
       *[other] { $colorName }-ის კონტრასტი არასაკმარისია სექციის სათაურის ტექსტისთვის ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; საჭიროა სულ მცირე { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` { $count } წერტილზე არ არის რეალიზებული, როცა წერტილებს არ აქვთ რიცხვითი მნიშვნელობები.

circle-too-many-through-points = 3-ზე მეტ წერტილზე გამავალი წრეწირის გამოთვლა შეუძლებელია.

circle-overprescribed-radius-center-points = მითითებული რადიუსით, ცენტრით და წერტილებით წრეწირის გამოთვლა შეუძლებელია.

circle-center-with-multiple-points = მითითებული ცენტრით და 1-ზე მეტ წერტილზე გამავალი წრეწირის გამოთვლა შეუძლებელია.

circle-radius-too-small = წრეწირის გამოთვლა შეუძლებელია: რადგან ორ წერტილს შორის მანძილი არის { $distance }, მითითებული რადიუსი { $radius } ძალიან მცირეა.

circle-radius-with-many-points = ორზე მეტ წერტილზე გამავალი წრეწირის შექმნა მითითებული რადიუსით შეუძლებელია.

circle-invalid-center-or-through-points = წრეწირის არასწორი ცენტრი ან წერტილები.

circle-radius-center-with-multiple-points = მითითებული ცენტრით წრეწირის რადიუსის გამოთვლა 1-ზე მეტ წერტილზე შეუძლებელია.

circle-change-radius-non-numerical = არარიცხვითი წერტილებით წრეწირის რადიუსის შეცვლა შეუძლებელია

circle-radius-with-points-non-numerical = ერთზე მეტ წერტილზე გამავალი წრეწირის შექმნა მითითებული რადიუსით შეუძლებელია, როცა რიცხვითი მნიშვნელობები არ არის.

circle-change-center-non-numerical = არარიცხვით წერტილებზე გამავალი წრეწირის ცენტრის შეცვლა არ არის რეალიზებული.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] ფუნქციის განსაზღვრის არის განზომილება არასაკმარისია. არეს აქვს { $intervals } შუალედი, ფუნქციას კი { $inputs ->
            [one] { $inputs } შესავალი
           *[other] { $inputs } შესავალი
        }.
       *[other] ფუნქციის განსაზღვრის არის განზომილება არასაკმარისია. არეს აქვს { $intervals } შუალედი, ფუნქციას კი { $inputs ->
            [one] { $inputs } შესავალი
           *[other] { $inputs } შესავალი
        }.
    }

function-domain-invalid-format = ფუნქციის განსაზღვრის არის არასწორი ფორმატი.

function-ignoring-non-numerical =
    { $type ->
        [maximum] ფუნქციის არარიცხვითი მაქსიმუმი იგნორირდება.
        [minimum] ფუნქციის არარიცხვითი მინიმუმი იგნორირდება.
        [extremum] ფუნქციის არარიცხვითი ექსტრემუმი იგნორირდება.
        [point] ფუნქციის არარიცხვითი წერტილი იგნორირდება.
        [slope] ფუნქციის არარიცხვითი დახრილობა იგნორირდება.
       *[other] ფუნქციის არარიცხვითი { $type } იგნორირდება.
    }

function-ignoring-empty =
    { $type ->
        [maximum] ფუნქციის ცარიელი მაქსიმუმი იგნორირდება.
        [minimum] ფუნქციის ცარიელი მინიმუმი იგნორირდება.
        [extremum] ფუნქციის ცარიელი ექსტრემუმი იგნორირდება.
        [point] ფუნქციის ცარიელი წერტილი იგნორირდება.
       *[other] ფუნქციის ცარიელი { $type } იგნორირდება.
    }

function-points-too-close = ფუნქცია შეიცავს ორ ერთმანეთთან ძალიან ახლოს მდებარე წერტილს. ფუნქციის განსაზღვრა შეუძლებელია.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] ფუნქციის იტერაციები შესაძლებელია მხოლოდ მაშინ, როცა შესავლების რაოდენობა უდრის გამოსავლების რაოდენობას. ამ ფუნქციას აქვს { $inputs } შესავალი და { $outputs ->
            [one] { $outputs } გამოსავალი
           *[other] { $outputs } გამოსავალი
        }.
       *[other] ფუნქციის იტერაციები შესაძლებელია მხოლოდ მაშინ, როცა შესავლების რაოდენობა უდრის გამოსავლების რაოდენობას. ამ ფუნქციას აქვს { $inputs } შესავალი და { $outputs ->
            [one] { $outputs } გამოსავალი
           *[other] { $outputs } გამოსავალი
        }.
    }

## `<sequence>`

sequence-invalid-length = მიმდევრობის არასწორი სიგრძე. უნდა იყოს არაუარყოფითი მთელი რიცხვი.

sequence-invalid-step = მიმდევრობის არასწორი ბიჯი. { $type } ტიპის მიმდევრობისთვის უნდა იყოს რიცხვი.

sequence-invalid-endpoint-number = რიცხვითი მიმდევრობის არასწორი „{ $attribute }“. უნდა იყოს რიცხვი.

sequence-invalid-endpoint-letters = ასოთა მიმდევრობის არასწორი „{ $attribute }“. უნდა იყოს ასოების კომბინაცია.

sequence-invalid-endpoint = მიმდევრობის არასწორი „{ $attribute }“.

select-from-sequence-coprime-not-numbers = coprime იგნორირდება, რადგან რიცხვები არ ირჩევა

select-from-sequence-coprime-with-exclude-combinations = coprime იგნორირდება, რადგან მითითებულია excludeCombinations

## Resolving a `target`

target-not-found = `<{ $source }>`-ის არასწორი target: სამიზნე ვერ მოიძებნა.

target-state-variable-not-found = `<{ $source }>`-ის არასწორი target: `<{ $component }>`-ზე „{ $property }“ სახელის მდგომარეობის ცვლადი ვერ მოიძებნა.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>`-ის ცვლადები უნდა განსხვავდებოდეს დამოუკიდებელი ცვლადისგან.

ode-system-duplicate-variable-names = დიფერენციალური განტოლებების მარჯვენა მხარეების განსაზღვრა შეუძლებელია დამოკიდებული ცვლადების განმეორებადი სახელებით.

ode-system-rhs-function-error = დიფერენციალური განტოლების მარჯვენა მხარის განსაზღვრა შეუძლებელია. შეცდომა mathjs ფუნქციის შექმნისას.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } წრფეს შორის კუთხის განსაზღვრა შეუძლებელია

angle-invalid-through-point = არასწორი წერტილი `<angle>`-ის through-ში

parabola-vertex-too-many-points = მითითებული წვეროთი პარაბოლა 1-ზე მეტ წერტილზე არ არის რეალიზებული.

parabola-too-many-points = პარაბოლა 3-ზე მეტ წერტილზე არ არის რეალიზებული.

intersection-too-many-items = ორზე მეტი ობიექტის თანაკვეთა არ არის რეალიზებული

## Other math components

ionic-compound-not-two-ions = ორი იონისგან განსხვავებული იონური ნაერთები არ არის რეალიზებული.

ionic-compound-needs-cation-and-anion = იონური ნაერთები რეალიზებულია მხოლოდ ერთი კატიონისა და ერთი ანიონისთვის.

solve-equations-cannot-evaluate = განტოლების ამოხსნა შეუძლებელია, რადგან მისი გამოთვლა ვერ მოხერხდა: { $equation }

math-operators-operand-number-required = მათემატიკური ოპერანდის ამოსაღებად უნდა მიეთითოს operandNumber.

eigen-decomposition-failed = მატრიცის საკუთარი მნიშვნელობების გამოთვლა ვერ მოხერხდა

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: პარამეტრი { $parameters } შაბლონში არ გვხვდება, ამიტომ ის ყოველთვის ცარიელს დაემთხვევა.
       *[other] `<matchesPattern>`: პარამეტრები { $parameters } შაბლონში არ გვხვდება, ამიტომ ისინი ყოველთვის ცარიელს დაემთხვევა.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }"-ის ინტერპრეტაცია შეუძლებელია. ის უნდა იყოს none, medium, dense ან ორი დადებითი რიცხვი გამოყოფილი ინტერვალით, მაგალითად grid="1 0.5". ბადე არ იხაზება.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" არ არის მხარდაჭერილი prefigure გამომსახველში; გამოიყენება მარჯვენა პოზიციის ქცევა.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" არ არის მხარდაჭერილი prefigure გამომსახველში; გამოიყენება ზედა პოზიციის ქცევა.

prefigure-invalid-axis-bounds = `<graph>`: ღერძების არასწორი საზღვრები prefigure-ად გარდაქმნისას; გამოიყენება ნაგულისხმევი bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: არასწორი სიგანე prefigure-ად გარდაქმნისას; გამოიყენება დიაგრამის ნაგულისხმევი სიგანე 425.

prefigure-invalid-aspect-ratio = `<graph>`: არასწორი aspectRatio prefigure-ად გარდაქმნისას; გამოიყენება ნაგულისხმევი გვერდების შეფარდება 1.

prefigure-grid-spacing-too-fine = `<graph>`: ბადის ბიჯი ძალიან წვრილია ღერძების საზღვრებისთვის; prefigure გამომსახველში ბადე გამოტოვებულია.

prefigure-annotations-not-rendered = `<graph>`: ანოტაციები არ დაიხაზება, თუ PreFigure გამომსახველი არ გამოიყენება.

multiple-annotations-children = `<graph>`-ში ნაპოვნია რამდენიმე `<annotations>` შვილი; ბოლოს გარდა ყველა იგნორირდება.

## Referring to other components

copy-unrecognized-component-type = უცნობი კომპონენტის ტიპის გაფართოება ან კოპირება შეუძლებელია: { $type }.

copy-prop-not-found = თვისება { $property } ვერ მოიძებნა { $component } ტიპის კომპონენტზე

collect-no-source = collect-ისთვის წყარო ვერ მოიძებნა.

collect-invalid-component-type = `<{ $component }>` ტიპის კომპონენტების შეგროვება შეუძლებელია, რადგან ეს არასწორი კომპონენტის ტიპია.

reference-index-unavailable = ინდექსზე `{ $reference }` მიმართვა შეუძლებელია

## `<callAction>`

component-action-unavailable = კომპონენტ `{ $reference }`-ზე { $action }-ის გამოძახება შეუძლებელია

## `<dataFrame>`

data-frame-inconsistent-row-lengths = მონაცემებს არასწორი ფორმა აქვს. სტრიქონების სიგრძეები განსხვავდება. ნაპოვნია componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = მონაცემებში სვეტების სახელები მეორდება. ნაპოვნია componentIdx :{ $componentIdx }

data-frame-missing-column-name = მონაცემებს აკლია სვეტის სახელი. ნაპოვნია componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = ამ პასუხის award ეყრდნობა answer ტეგის საკუთარ გაგზავნილ პასუხს, რაც მოულოდნელ ქცევას გამოიწვევს.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts`-ის მითითება `<answer>`-ზე `sectionWideCheckWork`-ის მქონე კონტეინერის შიგნით არაფერს ცვლის, რადგან მცდელობების რაოდენობას კონტეინერი განსაზღვრავს. მიუთითეთ `maxNumAttempts` კონტეინერზე.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts`-ის მითითება `sectionWideCheckWork`-ის მქონე კონტეინერზე, რომელიც თავად სხვა `sectionWideCheckWork`-ის მქონე კონტეინერშია, არაფერს ცვლის, რადგან მცდელობების რაოდენობას გარე კონტეინერი განსაზღვრავს. მიუთითეთ `maxNumAttempts` გარე კონტეინერზე.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] ატრიბუტი { $attributes } არაფერს შეცვლის symbolicEquality-ის მითითების გარეშე.
       *[other] ატრიბუტები { $attributes } არაფერს შეცვლის symbolicEquality-ის მითითების გარეშე.
    }

answer-invalid-type = answer-ის არასწორი ტიპი: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = რადგან კომპონენტ `<{ $component }>`-ს არ აქვს სახელი, ის ვერ გამოიყენება მოდულის ატრიბუტად

module-attribute-name-already-defined = კომპონენტი `<{ $component } name="{ $name }">` ვერ გამოიყენება მოდულის ატრიბუტად, რადგან `<module>` კომპონენტის ტიპს უკვე აქვს განსაზღვრული ატრიბუტი „{ $name }“.

conditional-content-condition-ignored = ატრიბუტი `condition` იგნორირდება `<conditionalContent>` კომპონენტზე, რომელსაც აქვს case ან else შვილები.

slider-markers-type-mismatch = მარკერების ტიპი არ ემთხვევა სლაიდერის ტიპს.

pretzel-problem-needs-statement-and-answer = არასწორი pretzel: თითოეული `<problem>` უნდა შეიცავდეს ერთ `<statement>`-სა და ერთ `<answer>`-ს.

pretzel-circuit-first-problem-distractor = არასწორი pretzel: mode="circuit" რეჟიმში პირველი `<problem>` ვერ იქნება ყურადღების გადამტანი.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] არასწორი მნიშვნელობა { $values } ატრიბუტისთვის `{ $attribute }`; იგნორირდება.
       *[other] არასწორი მნიშვნელობები { $values } ატრიბუტისთვის `{ $attribute }`; იგნორირდება.
    }

attribute-must-be-references = არასწორი მნიშვნელობა `{ $value }` ატრიბუტისთვის `{ $attribute }`. ატრიბუტი უნდა შედგებოდეს `$`-ით დაწყებული მიმართვებისგან.

math-input-invalid-function-names = <mathInput>: { $attribute }-ში არასწორი ფუნქციების სახელები იგნორირებულია: { $names }. თითოეული სახელის საჩვენებელი ნაწილი უნდა იყოს სულ მცირე 2 სიმბოლო (ასოები ან დეფისები); მას შეიძლება მოჰყვეს არასავალდებულო `|<mathspeak ალტერნატივა>` სუფიქსი.

## Building components from the source

component-type-invalid = არასწორი კომპონენტის ტიპი: `<{ $componentType }>`

attribute-repeated = ატრიბუტი { $attribute } ვერ განმეორდება.

attribute-invalid-for-component = არასწორი ატრიბუტი „{ $attribute }“ `<{ $componentType }>` ტიპის კომპონენტისთვის.

## Style definition contrast

style-definition-insufficient-contrast =
    სტილის აღწერას { $styleNumber } აქვს არასაკმარისი კონტრასტი { $context ->
        [text-on-background] ტექსტის ფერისთვის ფონის ფერთან
        [high-contrast] მაღალკონტრასტული ფერისთვის ტილოსთან
        [line] ხაზის ფერისთვის ტილოსთან
        [marker] მარკერის ფერისთვის ტილოსთან
       *[text-on-canvas] ტექსტის ფერისთვის ტილოსთან
    }{ $mode ->
        [dark] { " (მუქი თემა)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; საჭიროა სულ მცირე { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    თუმცა სტილის აღწერაში { $styleNumber } მითითებული ფერები საკმარის კონტრასტს იძლევა ღია თემისთვის, მათგან მიღებული მუქი თემის ფერები ტექსტსა და ფონს შორის არასაკმარის კონტრასტს იძლევა ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; საჭიროა სულ მცირე { $threshold }:1). { $suggestion ->
        [available] მუქ თემაში საკმარისი კონტრასტისთვის ან გაზარდეთ კონტრასტი ღია თემაში (მაგალითად { $lightAttribute }="{ $lightColor }"), ან გადააწერეთ მუქი თემის ფერი (მაგალითად { $darkAttribute }="{ $darkColor }").
       *[none] მუქ თემაში საკმარისი კონტრასტისთვის გაზარდეთ კონტრასტი ღია თემაში ან გადააწერეთ მიღებული ფერები textColorDarkMode-ითა და/ან backgroundColorDarkMode-ით.
    }

style-definition-dark-mode-text-canvas-contrast =
    თუმცა სტილის აღწერაში { $styleNumber } მითითებული ტექსტის ფერი საკმარის კონტრასტს იძლევა ღია თემისთვის, მისგან მიღებული მუქი თემის ტექსტის ფერი ტილოსთან არასაკმარის კონტრასტს იძლევა ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; საჭიროა სულ მცირე { $threshold }:1). { $suggestion ->
        [available] მუქ თემაში საკმარისი კონტრასტისთვის ან გაზარდეთ კონტრასტი ღია თემაში (მაგალითად textColor="{ $lightColor }"), ან გადააწერეთ მუქი თემის ფერი (მაგალითად textColorDarkMode="{ $darkColor }").
       *[none] მუქ თემაში საკმარისი კონტრასტისთვის გაზარდეთ კონტრასტი ღია თემაში ან გადააწერეთ მიღებული ფერი textColorDarkMode-ით.
    }

section-multiple-style-palettes = სექციას შეუძლია აირჩიოს მხოლოდ ერთი <stylePalette>; გამოიყენება ბოლო.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component }-ის უნიკალური ვარიანტების დადგენა შეუძლებელია, რადგან numToSelect არ არის არაუარყოფითი მთელი რიცხვი.

variant-num-to-select-not-constant-number = { $component }-ის უნიკალური ვარიანტების დადგენა შეუძლებელია, რადგან numToSelect არ არის მუდმივი რიცხვი.

variant-with-replacement-not-constant-boolean = { $component }-ის უნიკალური ვარიანტების დადგენა შეუძლებელია, რადგან withReplacement არ არის მუდმივი ლოგიკური მნიშვნელობა.

variant-select-weight-disables-unique = select-ის უნიკალური ვარიანტები გამორთულია, თუ რომელიმე ვარიანტს აქვს მითითებული selectWeight ან selectForVariants

variant-coprime-undetermined = { $component }-ის უნიკალური ვარიანტების დადგენა შეუძლებელია, რადგან ვერ დგინდება, რომ coprime ყოველთვის მცდარია.

variant-attribute-not-constant = { $component }-ის უნიკალური ვარიანტების დადგენა შეუძლებელია, რადგან { $attribute } არ არის მუდმივი.

variant-attribute-not-number = { $component }-ის უნიკალური ვარიანტების დადგენა შეუძლებელია, რადგან { $attribute } არ არის რიცხვი.

variant-attribute-wrong-type-for-sequence =
    { $type } ტიპის { $component }-ის უნიკალური ვარიანტების დადგენა შეუძლებელია, რადგან { $attribute } არ არის { $expected ->
        [letters-combination] ასოების კომბინაცია
        [math-expression] ვარგისი მათემატიკური გამოსახულება
        [integer] მთელი რიცხვი
       *[number] რიცხვი
    }.

variant-length-not-integer = { $component }-ის უნიკალური ვარიანტების დადგენა შეუძლებელია, რადგან length არ არის მთელი რიცხვი.

variant-sort-not-implemented = sort-ის მქონე { $component }-ის უნიკალური ვარიანტები არ არის რეალიზებული

variant-exclude-combinations-not-implemented = excludeCombinations-ის მქონე { $component }-ის უნიკალური ვარიანტები არ არის რეალიზებული

variant-math-exclude-not-implemented = exclude-ის მქონე math ტიპის { $component }-ის უნიკალური ვარიანტები არ არის რეალიზებული

variant-non-constant-exclude-not-implemented = არამუდმივი exclude-ის მქონე { $component }-ის უნიკალური ვარიანტები არ არის რეალიზებული

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: არ არის მხარდაჭერილი გრაფიკის prefigure გამომსახველში; შთამომავალი გამოტოვებულია.

prefigure-descendant-invalid-geometry = { $subject }: არასასრული ან არასრული გეომეტრია; შთამომავალი გამოტოვებულია.

prefigure-curve-label-omitted = { $subject }: წარწერები არ არის მხარდაჭერილი გარდაქმნილ მრუდის ელემენტებზე; წარწერა გამოტოვებულია.

prefigure-curve-unsupported-definition-type = { $subject }: მხარდაუჭერელი მრუდის ფუნქციის აღწერის ტიპი „{ $definitionType }“; შთამომავალი გამოტოვებულია.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves-ის flipFunctions ატრიბუტი მხარდაუჭერელია; შთამომავალი გამოტოვებულია.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves მხარს უჭერს მხოლოდ ფორმულით მოცემულ შვილ ფუნქციებს; შთამომავალი გამოტოვებულია.

prefigure-label-position-unsupported =
    { $subject }: მხარდაუჭერელი labelPosition „{ $labelPosition }“ { $labelKind ->
        [line-family] წრფეთა ოჯახის წარწერისთვის
       *[point] წერტილის წარწერისთვის
    }; გამოიყენება PreFigure-ის ნაგულისხმევი სწორება.

prefigure-fill-style-unsupported = { $subject }: შევსების სტილი „{ $fillStyle }“ არ არის მხარდაჭერილი PreFigure-ში; გამოიყენება მთლიანი შევსება.

prefigure-line-style-unknown = { $subject }: უცნობი ხაზის სტილი „{ $lineStyle }“ გამოტოვებულია PreFigure-ის გამოსავალიდან.

prefigure-marker-style-mapped-to-diamond = { $subject }: მარკერის სტილი „{ $markerStyle }“ დაუკავშირდა PreFigure-ის სტილს „diamond“.

prefigure-marker-style-unsupported = { $subject }: მარკერის სტილი „{ $markerStyle }“ არ არის მხარდაჭერილი PreFigure-ში; გამოიყენება ნაგულისხმევი სტილი.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: არასწორი `ref`; სამიზნის დაკავშირება შეუძლებელია. ანოტაცია გამოტოვებულია.

annotation-ref-multiple-targets = `<annotation>`: `ref` დაუკავშირდა რამდენიმე სამიზნეს; გამოიყენება პირველი.

annotation-ref-outside-graph = `<annotation>`: არასწორი `ref`; სამიზნე შემცველი გრაფიკის გარეთაა. ანოტაცია გამოტოვებულია.

annotation-ref-unsupported-target = `<annotation>`: არასწორი `ref`; სამიზნე არ არის prefigure-ად გარდაქმნისას მხარდაჭერილი გრაფიკული ობიექტი. ანოტაცია გამოტოვებულია.

annotation-text-missing = `<annotation>`: `text` აკლია ან ცარიელია; გამოიტანება ცარიელი ტექსტი.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] აღმოჩენილია წრიული დამოკიდებულება.
       *[other] აღმოჩენილია წრიული დამოკიდებულება, რომელიც მოიცავს `<{ $componentType }>` კომპონენტს.
    }

reference-no-referent = მიმართვისთვის ობიექტი ვერ მოიძებნა: `{ $reference }`

reference-multiple-referents = მიმართვისთვის რამდენიმე ობიექტი მოიძებნა: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>`-ის { $attribute } ატრიბუტის არასწორი ფორმატი.

children-invalid = არასწორი შვილები `<{ $componentType }>`-ისთვის: ნაპოვნია არასწორი შვილები: { $children }

## Falling back to a default

attribute-value-invalid-using-default = არასწორი მნიშვნელობა `{ $value }` ატრიბუტისთვის `{ $attribute }`; გამოიყენება მნიშვნელობა `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML ვერსია { $version } ვერ მოიძებნა.
       *[other] DoenetML ვერსია { $version } ვერ მოიძებნა. გამოიყენება ვერსია { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = არასწორი DoenetML: { $content }

parse-tag-missing-close-tag = არასწორი DoenetML: ტეგს `{ $tag }` არ აქვს დამხურავი ტეგი. მოსალოდნელი იყო თვითდახურვადი ტეგი ან `</{ $tagName }>` ტეგი.

parse-tag-error = არასწორი DoenetML: შეცდომა ტეგში `<{ $tagName }>`

parse-attribute-missing-value = არასწორი DoenetML: ატრიბუტს `{ $attribute }` როგორც ჩანს აკლია მნიშვნელობა.

parse-attribute-invalid = არასწორი DoenetML: არასწორი ატრიბუტი `{ $attribute }`

parse-attribute-value-invalid = არასწორი DoenetML: ატრიბუტის არასწორი მნიშვნელობა `{ $value }`

parse-attribute-value-quote-mismatch = არასწორი DoenetML: ატრიბუტის არასწორი მნიშვნელობა `{ $value }`. ბრჭყალები არ ემთხვევა. როგორც ჩანს, აკლია `{ $quote }`

parse-open-tag-name-missing = არასწორი DoenetML: ნაპოვნია ტეგი სახელის გარეშე, მაგალითად `<`

parse-tag-not-closed = არასწორი DoenetML: ტეგი `{ $tag }` არ არის დახურული (როგორც ჩანს, აკლია `>`).

parse-self-closing-tag-name-missing = არასწორი DoenetML: ნაპოვნია ტეგი სახელის გარეშე `<{ $content }>`

parse-self-closing-tag-not-closed = არასწორი DoenetML: ტეგი `{ $tag }` არ არის დახურული (როგორც ჩანს, აკლია `/>`).

parse-tag-invalid-attributes = არასწორი DoenetML: ტეგი `{ $tag }` არ არის ვარგისი. მას შესაძლოა არასწორი ატრიბუტები ჰქონდეს.

parse-close-tag-name-missing = არასწორი DoenetML: ნაპოვნია დამხურავი ტეგი სახელის გარეშე, მაგალითად `</`

parse-attribute-value-unquoted = ატრიბუტების მნიშვნელობები ბრჭყალებში უნდა იყოს: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = არასწორი DoenetML: ნაპოვნია დამხურავი ტეგი `{ $tag }`, მაგრამ შესაბამისი გამხსნელი ტეგი არ არის

parse-close-tag-mismatched = არასწორი DoenetML: შეუსაბამო დამხურავი ტეგი. მოსალოდნელი იყო `</{ $expected }>`. ნაპოვნია `{ $found }`

parser-node-unconvertible = კვანძის { $node } გარდაქმნა Dast კვანძად ვერ მოხერხდა.

## Names

name-attribute-invalid =
    არასწორი ატრიბუტი name='{ $name }'. { $reason ->
        [characters] სახელები შეიძლება შეიცავდეს მხოლოდ ასოებს, ციფრებს, ქვედა ტირეებს ან დეფისებს.
       *[start] სახელები უნდა იწყებოდეს ასოთი.
    }

component-name-invalid-start = არასწორი კომპონენტის სახელი „{ $name }“. სახელები უნდა იწყებოდეს ასოთი.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched ტიპის answer-ს უნდა ჰქონდეს video ატრიბუტი

answer-video-watched-video-not-reference = videoWatched ტიპის answer-ის video ატრიბუტი უნდა იყოს მიმართვა

answer-name-not-single-text = answer-ის name ატრიბუტს უნდა ჰქონდეს ზუსტად ერთი ტექსტური შვილი

## Referencing another document

external-doenetml-recursion-limit = გარე DoenetML-ის მიღება ვერ მოხერხდა რეკურსიის ზედმეტად ბევრი დონის გამო. ხომ არ არის წრიული მიმართვა?

external-doenetml-unavailable = DoenetML-ის მიღება ვერ მოხერხდა აქედან: { $attribute }="{ $uri }"

external-doenetml-type-mismatch = { $attribute }="{ $uri }"-დან მიღებულია არასწორი DoenetML: ის არ შეესაბამება კომპონენტის ტიპს „{ $componentType }“

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] ატრიბუტი `{ $from }` მოძველებულია; გამოიყენეთ `{ $to }`.
       *[other] [deprecation] `<{ $component }>`-ის ატრიბუტი `{ $from }` მოძველებულია; გამოიყენეთ `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] ატრიბუტი `{ $from }` მოძველებულია და იგნორირდება, რადგან მითითებულია ასევე `{ $to }`.
       *[other] [deprecation] `<{ $component }>`-ის ატრიბუტი `{ $from }` მოძველებულია და იგნორირდება, რადგან მითითებულია ასევე `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>`-ის ატრიბუტი `{ $attribute }` მოძველებულია და იგნორირდება.


## Language coverage

pluralize-english-only = `<pluralize>` მრავლობითს მხოლოდ ინგლისურისთვის აწარმოებს, ამიტომ { $locale } ენაზე დაწერილ დოკუმენტში მისი ტექსტი უცვლელი რჩება. ჩაწერეთ მრავლობითი ფორმა თავად, ან მიუთითეთ `pluralForm` ატრიბუტით.


## Checking against the schema

schema-element-unrecognized = ელემენტი `<{ $tag }>` არ არის Doenet-ის ცნობილი ელემენტი.

schema-element-not-allowed-at-root = ელემენტი `<{ $tag }>` დაუშვებელია დოკუმენტის ფესვში.

schema-element-not-allowed-inside = ელემენტი `<{ $tag }>` დაუშვებელია `<{ $parent }>`-ის შიგნით.

schema-attribute-unrecognized = ელემენტს `<{ $tag }>` არ აქვს ატრიბუტი სახელად `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] ელემენტ `<{ $tag }>`-ის ატრიბუტი `{ $attribute }` უნდა იყოს სია, რომლის თითოეული ელემენტი შემდეგთაგან ერთ-ერთია: { $allowed }
       *[other] ელემენტ `<{ $tag }>`-ის ატრიბუტი `{ $attribute }` უნდა იყოს შემდეგთაგან ერთ-ერთი: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select-ის არასწორი ვარიანტის სახელი. ვარიანტის სახელი { $variantName } გვხვდება { $numOptions } ვარიანტში, ასარჩევი რაოდენობა კი { $numToSelect }-ია.

select-variant-name-without-options = select-ისთვის მითითებულია ვარიანტები, მაგრამ შესაძლო ვარიანტის სახელისთვის არცერთი არჩევანი არ არის: { $variantName }.

select-variant-name-not-possible = select-ისთვის მითითებული ვარიანტის სახელი { $variantName } არ არის შესაძლო ვარიანტის სახელი.

select-too-few-options = შეუძლებელია { $numToSelect } კომპონენტის არჩევა მხოლოდ { $numOptions }-დან.

select-from-sequence-too-few-values = შეუძლებელია { $numToSelect } მნიშვნელობის არჩევა { $length } სიგრძის მიმდევრობიდან.

select-from-sequence-indices-count-mismatch = select-ისთვის მითითებული ინდექსების რაოდენობა უნდა ემთხვეოდეს ასარჩევ რაოდენობას

select-from-sequence-indices-not-integers = select-ისთვის მითითებული ყველა ინდექსი უნდა იყოს მთელი რიცხვი

select-from-sequence-index-excluded = selectfromsequence-ის მითითებული ინდექსი გამორიცხული იყო

select-from-sequence-indices-excluded-combination = selectfromsequence-ის მითითებული ინდექსები გამორიცხული კომბინაცია იყო

select-from-sequence-coprime-not-positive-integers = ურთიერთმარტივი კომბინაციების არჩევა შეუძლებელია, რადგან დადებითი მთელი რიცხვები არ ირჩევა.

select-from-sequence-coprime-common-factor = ურთიერთმარტივი რიცხვების არჩევა შეუძლებელია. ყველა შესაძლო მნიშვნელობას აქვს საერთო გამყოფი. (მითითებული "from" ან "to" მნიშვნელობები უნდა იყოს "step"-თან ურთიერთმარტივი.)

select-from-sequence-coprime-single-number = ურთიერთმარტივი კომბინაციების არჩევა შეუძლებელია ერთი რიცხვიდან, რომელიც 1 არ არის.

select-from-sequence-excluded-too-many-combinations = selectFromSequence-ში გამორიცხულია კომბინაციების 70%-ზე მეტი

select-from-sequence-coprime-none-found = ურთიერთმარტივი რიცხვების არჩევა ვერ მოხერხდა. ყველა შესაძლო მნიშვნელობას აქვს საერთო გამყოფი.

select-from-sequence-too-few-unique-values = შეუძლებელია { $numToSelect } განსხვავებული მნიშვნელობის არჩევა { $numPossibleValues } სიგრძის მიმდევრობიდან

select-prime-numbers-too-few-values = შეუძლებელია { $numToSelect } მნიშვნელობის არჩევა { $numValues } სიგრძის მარტივ რიცხვთა სიიდან

select-prime-numbers-values-count-mismatch = select-ისთვის მითითებული მნიშვნელობების რაოდენობა უნდა ემთხვეოდეს ასარჩევ რაოდენობას

select-prime-numbers-values-not-prime = select prime number-ისთვის მითითებული ყველა მნიშვნელობა უნდა იყოს მარტივ რიცხვთა სიაში

select-prime-numbers-values-excluded-combination = selectPrimeNumbers-ის მითითებული მნიშვნელობები გამორიცხული კომბინაცია იყო

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers-ში გამორიცხულია კომბინაციების 70%-ზე მეტი

select-random-combination-fluke = უკიდურესად ნაკლებსავარაუდო შემთხვევითობის გამო შემთხვევითი მნიშვნელობების კომბინაციის არჩევა ვერ მოხერხდა

select-random-value-fluke = უკიდურესად ნაკლებსავარაუდო შემთხვევითობის გამო შემთხვევითი მნიშვნელობის არჩევა ვერ მოხერხდა
