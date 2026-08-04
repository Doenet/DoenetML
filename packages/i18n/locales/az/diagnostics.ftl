# Azerbaijani diagnostics. Translated from `locales/en/diagnostics.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
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
# Azerbaijani counts in the same two categories English does, so every selection
# below keeps both branches — but a noun after a numeral stays singular, so the
# two usually differ only in the number they print.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] hər iki uc nöqtə göstərildikdə { $attributes } nəzərə alınmır
       *[other] hər iki uc nöqtə göstərildikdə { $attributes } nəzərə alınmır
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] həm uc nöqtə, həm də orta nöqtə göstərildikdə { $attributes } nəzərə alınmır
       *[other] həm uc nöqtə, həm də orta nöqtə göstərildikdə { $attributes } nəzərə alınmır
    }

line-segment-midpoint-offset-without-midpoint = orta nöqtə olmadan midpointOffset heç nəyə təsir etmir

## `<line>`

line-points-undetermined-dimensions = Ölçüsü müəyyən olmayan nöqtələrdən keçən düz xətt.

line-points-too-few-dimensions = Düz xətt ən azı ikiölçülü nöqtələrdən keçməlidir.

line-points-depend-on-variables = Düz xətt dəyişənlərdən asılı olan nöqtələrdən keçir: { $variables }.

line-equation-invalid-format = { $variable1 } və { $variable2 } dəyişənlərində düz xətt tənliyinin formatı yanlışdır.

## `<ray>`

ray-overprescribed-through = Şüa through, endpoint və direction ilə verilib. Göstərilən through nəzərə alınmır.

ray-dimension-mismatch = şüada numDimensions uyğun gəlmir.

## `<vector>`

vector-overprescribed-head = Vektor head, tail və displacement ilə verilib. Göstərilən head nəzərə alınmır.

vector-dimension-mismatch = vektorda numDimensions uyğun gəlmir.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` elementinə cəzb etmək olmur, çünki onun nearestPoint vəziyyət dəyişəni yoxdur.

constrain-to-without-nearest-point = `<{ $component }>` elementi ilə məhdudlaşdırmaq olmur, çünki onun nearestPoint vəziyyət dəyişəni yoxdur.

constrain-to-interior-without-nearest-point = `<{ $component }>` elementinin daxili ilə məhdudlaşdırmaq olmur, çünki onun nearestPoint vəziyyət dəyişəni yoxdur.

## `<choiceInput>`

choice-input-label-position-ignored = sətirdaxili olmayan choiceInput üçün labelPosition nəzərə alınmır

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput üçün göstərilən indekslər nəzərə alınmır, çünki onların sayı choice övladlarının sayına uyğun gəlmir.

pretzel-indices-count-mismatch = problem üçün göstərilən indekslər nəzərə alınmır, çünki onların sayı problem övladlarının sayına uyğun gəlmir.

shuffle-indices-count-mismatch = shuffle üçün göstərilən indekslər nəzərə alınmır, çünki onların sayı komponentlərin sayına uyğun gəlmir.

indices-ignored-out-of-range = { $component } üçün göstərilən indekslər nəzərə alınmır, çünki bəziləri diapazondan kənardır.

pretzel-indices-repeated = pretzel üçün göstərilən indekslər nəzərə alınmır, çünki bəziləri təkrarlanır.

pretzel-circuit-first-index = circuit rejimində pretzel üçün göstərilən indekslər nəzərə alınmır, çünki ilk indeks 1 olmalıdır.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` mətn övladları ilə işləməsi üçün `type` atributu göstərilməlidir.

invalid-type-defaulting-to-math = { $component } komponenti üçün yanlış tip { $type }. math, text, number və ya boolean olmalıdır. math istifadə olunur.

string-not-valid-component-to-arrange = „{ $value }“ sətri { $component } üçün yararlı komponent deyil. Nəzərə alınmır.

## Types and variables

invalid-type-defaulting-to-number = Yanlış tip { $type }, tip number olaraq təyin edilir.

invalid-variable-value = Dəyişənin yanlış dəyəri: `{ $value }`

## Variants

variant-index-must-be-number = Variant indeksi { $index } ədəd olmalıdır

variant-index-must-be-integer = Variant indeksi { $index } tam ədəd olmalıdır

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` mütləq ölçülər üçün reallaşdırılmayıb. Enlər nisbi edilir.

side-by-side-absolute-margins = `<{ $component }>` mütləq ölçülər üçün reallaşdırılmayıb. Kənar boşluqlar nisbi edilir.

side-by-side-no-block-child = Yanlış `<{ $component }>`: onun ən azı bir blok övladı olmalıdır.

## `<label>`

label-for-ignored-on-graphical = Qrafik `<label>` üzərindəki `for` atributu nəzərə alınmır.

label-for-must-resolve-to-one = `<label>` üzərindəki `for` atributu tam bir komponentə uyğun gəlməlidir.

label-for-unresolved = `<label>` üzərindəki `for` atributu komponentlə əlaqələndirilə bilmədi.

label-for-answer-with-authored-inputs = `<label>` üzərindəki `for` atributu müəllif tərəfindən yazılmış giriş sahələri olan `<answer>` elementinə istinad edir; birbaşa sahəyə istinad edin.

label-for-answer-without-input = `<label>` üzərindəki `for` atributu etiketlənəcək giriş sahəsi olmayan `<answer>` elementinə istinad edir.

label-for-must-reference-input-or-answer = `<label>` üzərindəki `for` atributu giriş sahəsinə və ya cavaba istinad etməlidir.

## Accessibility

accessibility-short-description-or-decorative = Əlçatanlıq üçün `<{ $component }>` ya qısa təsvirə malik olmalı, ya da dekorativ kimi göstərilməlidir.

accessibility-video-short-description = Əlçatanlıq üçün `<video>` qısa təsvirə malik olmalıdır.

accessibility-input-short-description-or-label = Əlçatanlıq üçün `<{ $component }>` qısa təsvirə və ya etiketə malik olmalıdır.

accessibility-answer-input-short-description-or-label = Əlçatanlıq üçün giriş sahəsi yaradan `<answer>` qısa təsvirə və ya etiketə malik olmalıdır.

accessibility-short-description-contains-math = Qısa təsvirlər `<{ $component }>` kimi riyazi komponentlər ehtiva etməməlidir. Riyaziyyatı sözlə yazın.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } bölmə başlığının mətni üçün kifayət qədər kontrast vermir (tünd rejim) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ən azı { $threshold }:1 tələb olunur).
       *[other] { $colorName } bölmə başlığının mətni üçün kifayət qədər kontrast vermir ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ən azı { $threshold }:1 tələb olunur).
    }

## `<circle>`

circle-through-points-non-numerical = Nöqtələrin ədədi qiymətləri olmadıqda { $count } nöqtədən keçən `<circle>` reallaşdırılmayıb.

circle-too-many-through-points = 3-dən çox nöqtədən keçən çevrəni hesablamaq olmur.

circle-overprescribed-radius-center-points = Göstərilən radius, mərkəz və nöqtələrlə çevrəni hesablamaq olmur.

circle-center-with-multiple-points = Göstərilən mərkəzlə 1-dən çox nöqtədən keçən çevrəni hesablamaq olmur.

circle-radius-too-small = Çevrəni hesablamaq olmur: iki nöqtə arasındakı məsafə { $distance } olduğuna görə göstərilən radius { $radius } çox kiçikdir.

circle-radius-with-many-points = Göstərilən radiusla ikidən çox nöqtədən keçən çevrə yaratmaq olmur.

circle-invalid-center-or-through-points = Çevrənin mərkəzi və ya nöqtələri yanlışdır.

circle-radius-center-with-multiple-points = Göstərilən mərkəzlə 1-dən çox nöqtədən keçən çevrənin radiusunu hesablamaq olmur.

circle-change-radius-non-numerical = Ədədi olmayan nöqtələrlə çevrənin radiusunu dəyişmək olmur

circle-radius-with-points-non-numerical = Ədədi qiymətlər olmadıqda göstərilən radiusla birdən çox nöqtədən keçən çevrə yaratmaq olmur.

circle-change-center-non-numerical = Ədədi olmayan nöqtələrdən keçən çevrənin mərkəzinin dəyişdirilməsi reallaşdırılmayıb.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Funksiyanın təyin oblastının ölçüsü kifayət etmir. Oblastda { $intervals } interval var, funksiyada isə { $inputs ->
            [one] { $inputs } giriş
           *[other] { $inputs } giriş
        }.
       *[other] Funksiyanın təyin oblastının ölçüsü kifayət etmir. Oblastda { $intervals } interval var, funksiyada isə { $inputs ->
            [one] { $inputs } giriş
           *[other] { $inputs } giriş
        }.
    }

function-domain-invalid-format = Funksiyanın təyin oblastının formatı yanlışdır.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Funksiyanın ədədi olmayan maksimumu nəzərə alınmır.
        [minimum] Funksiyanın ədədi olmayan minimumu nəzərə alınmır.
        [extremum] Funksiyanın ədədi olmayan ekstremumu nəzərə alınmır.
        [point] Funksiyanın ədədi olmayan nöqtəsi nəzərə alınmır.
        [slope] Funksiyanın ədədi olmayan bucaq əmsalı nəzərə alınmır.
       *[other] Funksiyanın ədədi olmayan { $type } dəyəri nəzərə alınmır.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Funksiyanın boş maksimumu nəzərə alınmır.
        [minimum] Funksiyanın boş minimumu nəzərə alınmır.
        [extremum] Funksiyanın boş ekstremumu nəzərə alınmır.
        [point] Funksiyanın boş nöqtəsi nəzərə alınmır.
       *[other] Funksiyanın boş { $type } dəyəri nəzərə alınmır.
    }

function-points-too-close = Funksiyada bir-birinə çox yaxın iki nöqtə var. Funksiyanı təyin etmək olmur.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Funksiya iterasiyaları yalnız girişlərin sayı çıxışların sayına bərabər olduqda mümkündür. Bu funksiyada { $inputs } giriş və { $outputs ->
            [one] { $outputs } çıxış
           *[other] { $outputs } çıxış
        } var.
       *[other] Funksiya iterasiyaları yalnız girişlərin sayı çıxışların sayına bərabər olduqda mümkündür. Bu funksiyada { $inputs } giriş və { $outputs ->
            [one] { $outputs } çıxış
           *[other] { $outputs } çıxış
        } var.
    }

## `<sequence>`

sequence-invalid-length = Ardıcıllığın uzunluğu yanlışdır. Mənfi olmayan tam ədəd olmalıdır.

sequence-invalid-step = Ardıcıllığın addımı yanlışdır. { $type } tipli ardıcıllıq üçün ədəd olmalıdır.

sequence-invalid-endpoint-number = Ədədi ardıcıllığın „{ $attribute }“ dəyəri yanlışdır. Ədəd olmalıdır.

sequence-invalid-endpoint-letters = Hərf ardıcıllığının „{ $attribute }“ dəyəri yanlışdır. Hərf birləşməsi olmalıdır.

sequence-invalid-endpoint = Ardıcıllığın „{ $attribute }“ dəyəri yanlışdır.

select-from-sequence-coprime-not-numbers = ədəd seçilmədiyi üçün coprime nəzərə alınmır

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations göstərildiyi üçün coprime nəzərə alınmır

## Resolving a `target`

target-not-found = `<{ $source }>` üçün yanlış target: hədəf tapılmadı.

target-state-variable-not-found = `<{ $source }>` üçün yanlış target: `<{ $component }>` üzərində „{ $property }“ adlı vəziyyət dəyişəni tapılmadı.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` dəyişənləri asılı olmayan dəyişəndən fərqli olmalıdır.

ode-system-duplicate-variable-names = Təkrarlanan asılı dəyişən adları ilə DT sağ tərəf funksiyalarını təyin etmək olmur.

ode-system-rhs-function-error = DT sağ tərəf funksiyasını təyin etmək olmur. mathjs funksiyası yaradılarkən xəta.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } düz xətt arasında bucaq təyin etmək olmur

angle-invalid-through-point = `<angle>` elementinin through dəyərində yanlış nöqtə

parabola-vertex-too-many-points = Göstərilən təpə ilə 1-dən çox nöqtədən keçən parabola reallaşdırılmayıb.

parabola-too-many-points = 3-dən çox nöqtədən keçən parabola reallaşdırılmayıb.

intersection-too-many-items = İkidən çox obyektin kəsişməsi reallaşdırılmayıb

## Other math components

ionic-compound-not-two-ions = İki iondan başqa ion birləşmələri reallaşdırılmayıb.

ionic-compound-needs-cation-and-anion = İon birləşmələri yalnız bir kation və bir anion üçün reallaşdırılıb.

solve-equations-cannot-evaluate = Tənliyi həll etmək olmur, çünki onu hesablamaq mümkün olmadı: { $equation }

math-operators-operand-number-required = Riyazi operandı çıxarmaq üçün operandNumber göstərilməlidir.

eigen-decomposition-failed = Matrisin məxsusi qiymətlərini hesablamaq mümkün olmadı

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: { $parameters } parametri şablonda rast gəlinmir, ona görə həmişə boş dəyərə uyğun gələcək.
       *[other] `<matchesPattern>`: { $parameters } parametrləri şablonda rast gəlinmir, ona görə həmişə boş dəyərə uyğun gələcək.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" şərh oluna bilmir. O, none, medium, dense və ya boşluqla ayrılmış iki müsbət ədəd olmalıdır, məsələn grid="1 0.5". Şəbəkə çəkilmir.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure göstəricisində xLabelPosition="left" dəstəklənmir; sağ mövqe davranışı istifadə olunur.

prefigure-y-label-position-unsupported = `<graph>`: prefigure göstəricisində yLabelPosition="bottom" dəstəklənmir; yuxarı mövqe davranışı istifadə olunur.

prefigure-invalid-axis-bounds = `<graph>`: prefigure çevrilməsi üçün oxların sərhədləri yanlışdır; susmaya görə bbox (-10,-10,10,10) istifadə olunur.

prefigure-invalid-width = `<graph>`: prefigure çevrilməsi üçün en yanlışdır; diaqramın susmaya görə eni 425 istifadə olunur.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure çevrilməsi üçün aspectRatio yanlışdır; susmaya görə tərəflər nisbəti 1 istifadə olunur.

prefigure-grid-spacing-too-fine = `<graph>`: şəbəkə addımı oxların sərhədləri üçün çox xırdadır; prefigure göstəricisində şəbəkə buraxılır.

prefigure-annotations-not-rendered = `<graph>`: PreFigure göstəricisi istifadə olunmadıqda annotasiyalar çəkilməyəcək.

multiple-annotations-children = `<graph>` daxilində bir neçə `<annotations>` övladı tapıldı; sonuncudan başqa hamısı nəzərə alınmır.

## Referring to other components

copy-unrecognized-component-type = Tanınmayan komponent tipini genişləndirmək və ya kopyalamaq olmur: { $type }.

copy-prop-not-found = { $component } tipli komponentdə { $property } xassəsi tapılmadı

collect-no-source = collect üçün mənbə tapılmadı.

collect-invalid-component-type = `<{ $component }>` tipli komponentləri toplamaq olmur, çünki bu yanlış komponent tipidir.

reference-index-unavailable = `{ $reference }` indeksinə istinad etmək olmur

## `<callAction>`

component-action-unavailable = `{ $reference }` komponentində { $action } çağırmaq olmur

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Məlumatların forması yanlışdır. Sətirlərin uzunluqları fərqlidir. Tapıldı componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Məlumatlarda təkrarlanan sütun adları var. Tapıldı componentIdx :{ $componentIdx }

data-frame-missing-column-name = Məlumatlarda sütun adı çatışmır. Tapıldı componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Bu cavabın award-ı answer teqinin öz göndərilmiş cavabına əsaslanır, bu isə gözlənilməz davranışa gətirib çıxaracaq.

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` olan konteyner daxilində `<answer>` üzərində `maxNumAttempts` təyin etmək təsir etmir, çünki cəhdlərin sayını konteyner müəyyən edir. `maxNumAttempts` dəyərini konteyner üzərində təyin edin.

nested-section-wide-check-work-max-num-attempts = Başqa `sectionWideCheckWork` konteynerinin içində olan `sectionWideCheckWork` konteyneri üzərində `maxNumAttempts` təyin etmək təsir etmir, çünki cəhdlərin sayını xarici konteyner müəyyən edir. `maxNumAttempts` dəyərini xarici konteyner üzərində təyin edin.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] symbolicEquality təyin edilmədən { $attributes } atributu heç nəyə təsir etməyəcək.
       *[other] symbolicEquality təyin edilmədən { $attributes } atributları heç nəyə təsir etməyəcək.
    }

answer-invalid-type = answer üçün yanlış tip: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` komponentinin adı olmadığı üçün onu modul atributu kimi istifadə etmək olmur

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` komponentini modul atributu kimi istifadə etmək olmur, çünki `<module>` komponent tipində artıq „{ $name }“ atributu təyin edilib.

conditional-content-condition-ignored = case və ya else övladları olan `<conditionalContent>` komponentində `condition` atributu nəzərə alınmır.

slider-markers-type-mismatch = Markerlərin tipi sürüşdürücünün tipinə uyğun gəlmir.

pretzel-problem-needs-statement-and-answer = Yanlış pretzel: hər `<problem>` bir `<statement>` və bir `<answer>` ehtiva etməlidir.

pretzel-circuit-first-problem-distractor = Yanlış pretzel: mode="circuit" rejimində ilk `<problem>` yayındırıcı ola bilməz.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] `{ $attribute }` atributu üçün yanlış dəyər { $values }; nəzərə alınmır.
       *[other] `{ $attribute }` atributu üçün yanlış dəyərlər { $values }; nəzərə alınmır.
    }

attribute-must-be-references = `{ $attribute }` atributu üçün yanlış dəyər `{ $value }`. Atribut `$` ilə başlayan istinadlardan ibarət olmalıdır.

math-input-invalid-function-names = <mathInput>: { $attribute } daxilində yanlış funksiya adları nəzərə alınmadı: { $names }. Hər adın göstərilən hissəsi ən azı 2 simvol olmalıdır (hərflər və ya defislər); ondan sonra istəyə bağlı `|<mathspeak alternativ>` şəkilçisi gələ bilər.

## Building components from the source

component-type-invalid = Yanlış komponent tipi: `<{ $componentType }>`

attribute-repeated = { $attribute } atributunu təkrarlamaq olmur.

attribute-invalid-for-component = `<{ $componentType }>` tipli komponent üçün yanlış atribut „{ $attribute }“.

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } üslub təyinatında { $context ->
        [text-on-background] mətn rəngi ilə fon rəngi arasında
        [high-contrast] yüksək kontrastlı rənglə kətan arasında
        [line] xətt rəngi ilə kətan arasında
        [marker] marker rəngi ilə kətan arasında
       *[text-on-canvas] mətn rəngi ilə kətan arasında
    } kontrast kifayət etmir{ $mode ->
        [dark] { " (tünd rejim)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ən azı { $threshold }:1 tələb olunur).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } üslub təyinatında göstərilən rənglər açıq rejim üçün kifayət qədər kontrast versə də, onlardan alınan tünd rejim rəngləri mətnlə fon arasında kifayət qədər kontrast vermir ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ən azı { $threshold }:1 tələb olunur). { $suggestion ->
        [available] Tünd rejimdə kifayət qədər kontrast üçün ya açıq rejimdə kontrastı artırın (məsələn { $lightAttribute }="{ $lightColor }"), ya da tünd rejim rəngini əvəz edin (məsələn { $darkAttribute }="{ $darkColor }").
       *[none] Tünd rejimdə kifayət qədər kontrast üçün açıq rejimdə kontrastı artırın və ya alınan rəngləri textColorDarkMode və/və ya backgroundColorDarkMode ilə əvəz edin.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } üslub təyinatında göstərilən mətn rəngi açıq rejim üçün kifayət qədər kontrast versə də, ondan alınan tünd rejim mətn rəngi kətanla kifayət qədər kontrast vermir ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ən azı { $threshold }:1 tələb olunur). { $suggestion ->
        [available] Tünd rejimdə kifayət qədər kontrast üçün ya açıq rejimdə kontrastı artırın (məsələn textColor="{ $lightColor }"), ya da tünd rejim rəngini əvəz edin (məsələn textColorDarkMode="{ $darkColor }").
       *[none] Tünd rejimdə kifayət qədər kontrast üçün açıq rejimdə kontrastı artırın və ya alınan rəngi textColorDarkMode ilə əvəz edin.
    }

section-multiple-style-palettes = Bölmə yalnız bir <stylePalette> seçə bilər; sonuncusu istifadə olunur.

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } üçün unikal variantları müəyyən etmək olmur, çünki numToSelect mənfi olmayan tam ədəd deyil.

variant-num-to-select-not-constant-number = { $component } üçün unikal variantları müəyyən etmək olmur, çünki numToSelect sabit ədəd deyil.

variant-with-replacement-not-constant-boolean = { $component } üçün unikal variantları müəyyən etmək olmur, çünki withReplacement sabit məntiqi dəyər deyil.

variant-select-weight-disables-unique = hər hansı seçimdə selectWeight və ya selectForVariants göstərilibsə, select üçün unikal variantlar söndürülür

variant-coprime-undetermined = { $component } üçün unikal variantları müəyyən etmək olmur, çünki coprime-ın həmişə yanlış olduğunu müəyyən etmək mümkün deyil.

variant-attribute-not-constant = { $component } üçün unikal variantları müəyyən etmək olmur, çünki { $attribute } sabit deyil.

variant-attribute-not-number = { $component } üçün unikal variantları müəyyən etmək olmur, çünki { $attribute } ədəd deyil.

variant-attribute-wrong-type-for-sequence =
    { $type } tipli { $component } üçün unikal variantları müəyyən etmək olmur, çünki { $attribute } { $expected ->
        [letters-combination] hərf birləşməsi
        [math-expression] yararlı riyazi ifadə
        [integer] tam ədəd
       *[number] ədəd
    } deyil.

variant-length-not-integer = { $component } üçün unikal variantları müəyyən etmək olmur, çünki length tam ədəd deyil.

variant-sort-not-implemented = sort olan { $component } üçün unikal variantlar reallaşdırılmayıb

variant-exclude-combinations-not-implemented = excludeCombinations olan { $component } üçün unikal variantlar reallaşdırılmayıb

variant-math-exclude-not-implemented = exclude olan math tipli { $component } üçün unikal variantlar reallaşdırılmayıb

variant-non-constant-exclude-not-implemented = sabit olmayan exclude olan { $component } üçün unikal variantlar reallaşdırılmayıb

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: qrafikin prefigure göstəricisində dəstəklənmir; alt element buraxıldı.

prefigure-descendant-invalid-geometry = { $subject }: sonsuz və ya natamam həndəsə; alt element buraxıldı.

prefigure-curve-label-omitted = { $subject }: çevrilmiş əyri elementlərində etiketlər dəstəklənmir; etiket buraxıldı.

prefigure-curve-unsupported-definition-type = { $subject }: dəstəklənməyən əyri funksiyası təyinat tipi „{ $definitionType }“; alt element buraxıldı.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves üzərində flipFunctions atributu dəstəklənmir; alt element buraxıldı.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves yalnız düsturla verilmiş övlad funksiyaları dəstəkləyir; alt element buraxıldı.

prefigure-label-position-unsupported =
    { $subject }: dəstəklənməyən labelPosition „{ $labelPosition }“ { $labelKind ->
        [line-family] xətt ailəsi etiketi üçün
       *[point] nöqtə etiketi üçün
    }; PreFigure-ın susmaya görə düzləndirməsi istifadə olunur.

prefigure-fill-style-unsupported = { $subject }: doldurma üslubu „{ $fillStyle }“ PreFigure tərəfindən dəstəklənmir; bütöv doldurmaya keçilir.

prefigure-line-style-unknown = { $subject }: naməlum xətt üslubu „{ $lineStyle }“ PreFigure çıxışından buraxıldı.

prefigure-marker-style-mapped-to-diamond = { $subject }: marker üslubu „{ $markerStyle }“ PreFigure üslubu „diamond“ ilə əlaqələndirildi.

prefigure-marker-style-unsupported = { $subject }: marker üslubu „{ $markerStyle }“ PreFigure tərəfindən dəstəklənmir; susmaya görə üslub istifadə olunur.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: yanlış `ref`; hədəfi əlaqələndirmək olmur. Annotasiya buraxıldı.

annotation-ref-multiple-targets = `<annotation>`: `ref` bir neçə hədəflə əlaqələndi; birincisi istifadə olunur.

annotation-ref-outside-graph = `<annotation>`: yanlış `ref`; hədəf onu əhatə edən qrafikdən kənardadır. Annotasiya buraxıldı.

annotation-ref-unsupported-target = `<annotation>`: yanlış `ref`; hədəf prefigure çevrilməsində dəstəklənən qrafik obyekt deyil. Annotasiya buraxıldı.

annotation-text-missing = `<annotation>`: `text` yoxdur və ya boşdur; boş mətn çıxarılır.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Dairəvi asılılıq aşkarlandı.
       *[other] `<{ $componentType }>` komponentini əhatə edən dairəvi asılılıq aşkarlandı.
    }

reference-no-referent = İstinad üçün obyekt tapılmadı: `{ $reference }`

reference-multiple-referents = İstinad üçün bir neçə obyekt tapıldı: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` elementinin { $attribute } atributunun formatı yanlışdır.

children-invalid = `<{ $componentType }>` üçün yanlış övladlar: yanlış övladlar tapıldı: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` atributu üçün yanlış dəyər `{ $value }`; `{ $default }` dəyəri istifadə olunur

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } versiyası tapılmadı.
       *[other] DoenetML { $version } versiyası tapılmadı. { $fallback } versiyası istifadə olunur
    }

## Reading the DoenetML

parse-invalid-doenetml = Yanlış DoenetML: { $content }

parse-tag-missing-close-tag = Yanlış DoenetML: `{ $tag }` teqinin bağlayıcı teqi yoxdur. Özü bağlanan teq və ya `</{ $tagName }>` teqi gözlənilirdi.

parse-tag-error = Yanlış DoenetML: `<{ $tagName }>` teqində xəta

parse-attribute-missing-value = Yanlış DoenetML: `{ $attribute }` atributunda dəyər çatışmır kimi görünür.

parse-attribute-invalid = Yanlış DoenetML: yanlış atribut `{ $attribute }`

parse-attribute-value-invalid = Yanlış DoenetML: yanlış atribut dəyəri `{ $value }`

parse-attribute-value-quote-mismatch = Yanlış DoenetML: yanlış atribut dəyəri `{ $value }`. Dırnaqlar uyğun gəlmir. Deyəsən `{ $quote }` çatışmır

parse-open-tag-name-missing = Yanlış DoenetML: adı olmayan teq tapıldı, məsələn `<`

parse-tag-not-closed = Yanlış DoenetML: `{ $tag }` teqi bağlanmayıb (deyəsən `>` çatışmır).

parse-self-closing-tag-name-missing = Yanlış DoenetML: adı olmayan teq tapıldı `<{ $content }>`

parse-self-closing-tag-not-closed = Yanlış DoenetML: `{ $tag }` teqi bağlanmayıb (deyəsən `/>` çatışmır).

parse-tag-invalid-attributes = Yanlış DoenetML: `{ $tag }` teqi yararlı deyil. Onun atributları səhv ola bilər.

parse-close-tag-name-missing = Yanlış DoenetML: adı olmayan bağlayıcı teq tapıldı, məsələn `</`

parse-attribute-value-unquoted = Atribut dəyərləri dırnaq içində olmalıdır: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Yanlış DoenetML: `{ $tag }` bağlayıcı teqi tapıldı, lakin ona uyğun açıcı teq yoxdur

parse-close-tag-mismatched = Yanlış DoenetML: uyğun gəlməyən bağlayıcı teq. `</{ $expected }>` gözlənilirdi. `{ $found }` tapıldı

parser-node-unconvertible = { $node } düyünü Dast düyününə çevrilə bilmədi.

## Names

name-attribute-invalid =
    Yanlış atribut name='{ $name }'. { $reason ->
        [characters] Adlar yalnız hərflər, rəqəmlər, alt xətlər və ya defislər ehtiva edə bilər.
       *[start] Adlar hərflə başlamalıdır.
    }

component-name-invalid-start = Yanlış komponent adı „{ $name }“. Adlar hərflə başlamalıdır.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched tipli answer-in video atributu olmalıdır

answer-video-watched-video-not-reference = videoWatched tipli answer-in video atributu istinad olmalıdır

answer-name-not-single-text = answer-in name atributunun tam bir mətn övladı olmalıdır

## Referencing another document

external-doenetml-recursion-limit = Həddindən artıq çox rekursiya səviyyəsi səbəbindən xarici DoenetML alına bilmədi. Dairəvi istinad yoxdur ki?

external-doenetml-unavailable = { $attribute }="{ $uri }" ünvanından DoenetML alına bilmədi

external-doenetml-type-mismatch = { $attribute }="{ $uri }" ünvanından yanlış DoenetML alındı: o, „{ $componentType }“ komponent tipinə uyğun gəlmədi

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` atributu köhnəlib; əvəzinə `{ $to }` istifadə edin.
       *[other] [deprecation] `<{ $component }>` üzərindəki `{ $from }` atributu köhnəlib; əvəzinə `{ $to }` istifadə edin.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $from }` atributu köhnəlib və nəzərə alınmır, çünki `{ $to }` da göstərilib.
       *[other] [deprecation] `<{ $component }>` üzərindəki `{ $from }` atributu köhnəlib və nəzərə alınmır, çünki `{ $to }` da göstərilib.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` üzərindəki `{ $attribute }` atributu köhnəlib və nəzərə alınmır.


## Language coverage

pluralize-english-only = `<pluralize>` yalnız ingilis dilində cəm düzəldə bilir, ona görə { $locale } dilində yazılmış sənəddə onun mətni dəyişmədən qalır. Cəm formasını özünüz yazın və ya `pluralForm` atributu ilə göstərin.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` elementi tanınan Doenet elementi deyil.

schema-element-not-allowed-at-root = `<{ $tag }>` elementinə sənədin kökündə icazə verilmir.

schema-element-not-allowed-inside = `<{ $tag }>` elementinə `<{ $parent }>` daxilində icazə verilmir.

schema-attribute-unrecognized = `<{ $tag }>` elementində `{ $attribute }` adlı atribut yoxdur.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` elementinin `{ $attribute }` atributu elə bir siyahı olmalıdır ki, hər elementi bunlardan biri olsun: { $allowed }
       *[other] `<{ $tag }>` elementinin `{ $attribute }` atributu bunlardan biri olmalıdır: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select üçün yanlış variant adı. { $variantName } variant adı { $numOptions } seçimdə rast gəlinir, seçiləcək say isə { $numToSelect }.

select-variant-name-without-options = select üçün variantlar göstərilib, lakin mümkün variant adı üçün heç bir seçim yoxdur: { $variantName }.

select-variant-name-not-possible = select üçün göstərilən { $variantName } variant adı mümkün variant adı deyil.

select-too-few-options = Cəmi { $numOptions } içindən { $numToSelect } komponent seçmək olmur.

select-from-sequence-too-few-values = { $length } uzunluqlu ardıcıllıqdan { $numToSelect } dəyər seçmək olmur.

select-from-sequence-indices-count-mismatch = select üçün göstərilən indekslərin sayı seçiləcək saya uyğun olmalıdır

select-from-sequence-indices-not-integers = select üçün göstərilən bütün indekslər tam ədəd olmalıdır

select-from-sequence-index-excluded = selectfromsequence üçün göstərilən indeks istisna edilmişdi

select-from-sequence-indices-excluded-combination = selectfromsequence üçün göstərilən indekslər istisna edilmiş kombinasiya idi

select-from-sequence-coprime-not-positive-integers = Müsbət tam ədədlər seçilmədiyi üçün qarşılıqlı sadə kombinasiyalar seçmək olmur.

select-from-sequence-coprime-common-factor = Qarşılıqlı sadə ədədlər seçmək olmur. Bütün mümkün dəyərlərin ortaq böləni var. (Göstərilən "from" və ya "to" dəyərləri "step" ilə qarşılıqlı sadə olmalıdır.)

select-from-sequence-coprime-single-number = 1 olmayan tək bir ədəddən qarşılıqlı sadə kombinasiyalar seçmək olmur.

select-from-sequence-excluded-too-many-combinations = selectFromSequence-də kombinasiyaların 70%-dən çoxu istisna edilib

select-from-sequence-coprime-none-found = Qarşılıqlı sadə ədədlər seçmək mümkün olmadı. Bütün mümkün dəyərlərin ortaq böləni var.

select-from-sequence-too-few-unique-values = { $numPossibleValues } uzunluqlu ardıcıllıqdan { $numToSelect } fərqli dəyər seçmək olmur

select-prime-numbers-too-few-values = { $numValues } uzunluqlu sadə ədədlər siyahısından { $numToSelect } dəyər seçmək olmur

select-prime-numbers-values-count-mismatch = select üçün göstərilən dəyərlərin sayı seçiləcək saya uyğun olmalıdır

select-prime-numbers-values-not-prime = select prime number üçün göstərilən bütün dəyərlər sadə ədədlər siyahısında olmalıdır

select-prime-numbers-values-excluded-combination = selectPrimeNumbers üçün göstərilən dəyərlər istisna edilmiş kombinasiya idi

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers-də kombinasiyaların 70%-dən çoxu istisna edilib

select-random-combination-fluke = Son dərəcə az ehtimallı təsadüf üzündən təsadüfi dəyərlərin kombinasiyası seçilə bilmədi

select-random-value-fluke = Son dərəcə az ehtimallı təsadüf üzündən təsadüfi dəyər seçilə bilmədi
