# Gagauz (gagauz dili) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The Latin alphabet official in Gagauzia (Moldova) since
# 1996: `ș` for sh — not Turkish `ş` — `ț` for ts, `ä` for the open front
# vowel, `ê` for the vowel of the «-êr» present tense, and `ç c ö ü ı i` with
# their Turkish values. The pre-1993 Cyrillic alphabet appears nowhere in
# these four files and must not be mixed into them. `chrome.ftl` sets the
# alphabet out letter by letter.
#
# **Number.** A Gagauz noun after a numeral is unmarked, so English's `one`
# and `other` branches would be word-for-word identical here and each is
# written as **a single unselected form**. `Intl.PluralRules` has no CLDR data
# for `gag`, so no `[zero]`, `[two]`, `[few]` or `[many]` branch appears
# anywhere in these files.
#
# **Suffixes and placeables.** Gagauz suffixes harmonize with the vowels of
# the word they attach to. An element name, attribute name or value quoted
# from the author's own source arrives as a placeable whose vowels this
# catalog never sees, so **no case ending is welded onto one**; the sentence
# is built around such a name with separate words instead. That is a recorded
# debt, not a preference.
#
# The **ordinal** is the case that looks like an exception and is not. A line
# or row number arrives as a number rather than as a word, and the Gagauz
# ordinal suffix harmonizes with the vowels of the *spoken* numeral — «beșinci»
# but «dokuzuncu», «dördüncü» — which a digit does not show. So the other three
# files write the ordinal the way Gagauz and Turkish orthography write it after
# a figure, with a **period**: `{ $line }. satır`, never `{ $line }-inci`. That
# is `locales/crh`'s convention too, and for the same reason.
#
# **Vocabulary.** The technical register is overwhelmingly borrowed, which is
# what Gagauz itself does — from Russian above all, and from Romanian:
# «komponent», «atribut», «funkțiya», «indeks», «variant», «matrița»,
# «rekursiya», «annotațiya», «versiya», «domen», «kontrast», «konteyner»,
# «slayder», «șablon», «prost sayı» (a prime, after Russian «простое число»),
# «format», «tip», «spisok», «diagramma», «geometriya», «operand». Where a
# native or shared Turkic word serves it is used: «geçersiz» invalid,
# «bulunmadı» not found, «hesaba alınmêêr» is ignored, «taa yapılmadı» not
# implemented, «gösterici» renderer, «ușak element» child element. The last
# three are calques and are the ones to read first.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = İki uç nokta belli edildiynän { $attributes } hesaba alınmêêr

line-segment-attributes-ignored-with-endpoint-and-midpoint = Bir uç noktaylan bir orta nokta bilä belli edildiynän { $attributes } hesaba alınmêêr

line-segment-midpoint-offset-without-midpoint = Orta nokta olmadaan midpointOffset iș görmeer

## `<line>`

line-points-undetermined-dimensions = Ölçüleri belli olmayan noktalardan geçän dooru.

line-points-too-few-dimensions = Dooru en az iki ölçülü noktalardan geçmää lääzım.

line-points-depend-on-variables = Dooru diișkennerä baalı noktalardan geçer: { $variables }.

line-equation-invalid-format = { $variable1 } hem { $variable2 } diișkennerinnän yazılan dooru uravneniyasının formatı geçersiz.

## `<ray>`

ray-overprescribed-through = Ișın aynı vakıtta through, endpoint hem direction ile belli edilmiș. Belli edilän through hesaba alınmêêr.

ray-dimension-mismatch = Ișında numDimensions uyușmêêr.

## `<vector>`

vector-overprescribed-head = Vektor aynı vakıtta head, tail hem displacement ile belli edilmiș. Belli edilän head hesaba alınmêêr.

vector-dimension-mismatch = Vektorda numDimensions uyușmêêr.

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` komponentinä çekilämeer: onun nearestPoint durum diișkeni yok.

constrain-to-without-nearest-point = `<{ $component }>` komponentinä sınırlanamêêr: onun nearestPoint durum diișkeni yok.

constrain-to-interior-without-nearest-point = `<{ $component }>` komponentinin içinä sınırlanamêêr: onun nearestPoint durum diișkeni yok.

## `<choiceInput>`

choice-input-label-position-ignored = Satır içi olmayan choiceInput için labelPosition hesaba alınmêêr

## Ordering children by index

choice-input-indices-count-mismatch = indices sayısı choice ușak elementlerinin sayısına uymadıı için choiceInput için belli edilän indices hesaba alınmêêr.

pretzel-indices-count-mismatch = indices sayısı problem ușak elementlerinin sayısına uymadıı için problem için belli edilän indices hesaba alınmêêr.

shuffle-indices-count-mismatch = indices sayısı komponent sayısına uymadıı için shuffle için belli edilän indices hesaba alınmêêr.

indices-ignored-out-of-range = Kimi indekslär aralık dıșında olduu için { $component } için belli edilän indices hesaba alınmêêr.

pretzel-indices-repeated = Kimi indekslär tekrarlandıı için pretzel için belli edilän indices hesaba alınmêêr.

pretzel-circuit-first-index = circuit rejimindä ilk indeks mutlaka 1 olmaa lääzım olduu için pretzel için belli edilän indices hesaba alınmêêr.

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` tekst ușak elementlerinnän ișlesin deyni, `type` atributu belli edilmää lääzım.

invalid-type-defaulting-to-math = { $component } komponenti için { $type } tipi geçersiz. math, text, number ya da boolean olmaa lääzım. math kullanılêr.

string-not-valid-component-to-arrange = "{ $value }" teksti { $component } için geçerli bir komponent diil. Hesaba alınmêêr.

## Types and variables

invalid-type-defaulting-to-number = { $type } tipi geçersiz; tip number olarak koyulêr.

invalid-variable-value = Diișkenin paası geçersiz: `{ $value }`

## Variants

variant-index-must-be-number = { $index } variant indeksi bir sayı olmaa lääzım

variant-index-must-be-integer = { $index } variant indeksi bir tam sayı olmaa lääzım

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` mutlak ölçülär için taa yapılmadı. Genișliklär oranlı paalara çevriler.

side-by-side-absolute-margins = `<{ $component }>` mutlak ölçülär için taa yapılmadı. Kenar boșlukları oranlı paalara çevriler.

side-by-side-no-block-child = `<{ $component }>` geçersiz: en az bir blok ușak elementi olmaa lääzım.

## `<label>`

label-for-ignored-on-graphical = Grafik `<label>` üstündeki `for` atributu hesaba alınmêêr.

label-for-must-resolve-to-one = `<label>` üstündeki `for` atributu tam bir komponentä çözülmää lääzım.

label-for-unresolved = `<label>` üstündeki `for` atributu bir komponentä çözülämedi.

label-for-answer-with-authored-inputs = `<label>` üstündeki `for` atributu girișleri açıktan yazılı bir `<answer>` üstünä gösterer; dooru-dooruya o girișä gösteriniz.

label-for-answer-without-input = `<label>` üstündeki `for` atributu etiketlenecek giriși olmayan bir `<answer>` üstünä gösterer.

label-for-must-reference-input-or-answer = `<label>` üstündeki `for` atributu bir girișä ya da bir cuvaba göstermää lääzım.

## Accessibility

accessibility-short-description-or-decorative = Erișilebilirlik için `<{ $component }>` ya kısa bir aciklamaya sahip olmaa, ya da süslemäk gibi belli edilmää lääzım.

accessibility-video-short-description = Erișilebilirlik için `<video>` kısa bir aciklamaya sahip olmaa lääzım.

accessibility-input-short-description-or-label = Erișilebilirlik için `<{ $component }>` kısa bir aciklamaya ya da bir etikettä sahip olmaa lääzım.

accessibility-answer-input-short-description-or-label = Erișilebilirlik için giriș yaradan `<answer>` kısa bir aciklamaya ya da bir etikettä sahip olmaa lääzım.

accessibility-short-description-contains-math = Kısa aciklamalarda `<{ $component }>` gibi matematika komponentleri olmamaa lääzım. Matematikayı laflarlan yazınız.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } bölüm bașlıı teksti için etișän kontrasta sahip diil (karannık rejim) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; en az { $threshold }:1 lääzım).
       *[other] { $colorName } bölüm bașlıı teksti için etișän kontrasta sahip diil ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; en az { $threshold }:1 lääzım).
    }

## `<circle>`

circle-through-points-non-numerical = Noktaların sayı paaları olmadıınnan { $count } noktadan geçän `<circle>` taa yapılmadı.

circle-too-many-through-points = 3 noktadan taa çok noktadan geçän çember hesaplanamêêr.

circle-overprescribed-radius-center-points = Radiusu, merkezi hem geçtii noktaları bilä belli edilän çember hesaplanamêêr.

circle-center-with-multiple-points = Merkezi belli edilän hem 1 noktadan taa çok noktadan geçän çember hesaplanamêêr.

circle-radius-too-small = Çember hesaplanamêêr: iki nokta arasındaki uzaklık { $distance } olduuna görä, belli edilän { $radius } radiusu pek küçük.

circle-radius-with-many-points = Radiusu belli edilän, ikidän taa çok noktadan geçän çember yaradılamêêr.

circle-invalid-center-or-through-points = Çemberin merkezi ya da geçtii noktalar geçersiz.

circle-radius-center-with-multiple-points = Merkezi belli edilän hem 1 noktadan taa çok noktadan geçän çemberin radiusu hesaplanamêêr.

circle-change-radius-non-numerical = Geçtii noktaları sayı olmayan çemberin radiusu diiștirilämeer

circle-radius-with-points-non-numerical = Sayı paaları yokkan, radiusu belli edilän hem birdän taa çok noktadan geçän çember yaradılamêêr.

circle-change-center-non-numerical = Sayı olmayan noktalardan geçän çemberin merkezini diiștirmäk taa yapılmadı.

## `<function>`

function-domain-insufficient-dimensions = Funkțiyanın domeni için ölçülär etișmeer. Domendä { $intervals } aralık var, ama funkțiyanın { $inputs } giriși var.

function-domain-invalid-format = Funkțiyanın domeninin formatı geçersiz.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Funkțiyanın sayı olmayan en büük paası hesaba alınmêêr.
        [minimum] Funkțiyanın sayı olmayan en küçük paası hesaba alınmêêr.
        [extremum] Funkțiyanın sayı olmayan uç paası hesaba alınmêêr.
        [point] Funkțiyanın sayı olmayan noktası hesaba alınmêêr.
        [slope] Funkțiyanın sayı olmayan eegimi hesaba alınmêêr.
       *[other] Funkțiyanın sayı olmayan { $type } paası hesaba alınmêêr.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Funkțiyanın boș en büük paası hesaba alınmêêr.
        [minimum] Funkțiyanın boș en küçük paası hesaba alınmêêr.
        [extremum] Funkțiyanın boș uç paası hesaba alınmêêr.
        [point] Funkțiyanın boș noktası hesaba alınmêêr.
       *[other] Funkțiyanın boș { $type } paası hesaba alınmêêr.
    }

function-points-too-close = Funkțiyada erleri biri-birinä pek yakın iki nokta var. Funkțiya belli edilämeer.

function-iterates-input-output-mismatch = Funkțiya iterațiyaları ancak giriș sayısı çıkıș sayısına eșit olsa mümkün. Bu funkțiyanın { $inputs } giriși hem { $outputs } çıkıșı var.

## `<sequence>`

sequence-invalid-length = Sıranın uzunnuu geçersiz. Negativ olmayan tam sayı olmaa lääzım.

sequence-invalid-step = Sıranın adımı geçersiz. { $type } tipindeki sıra için bir sayı olmaa lääzım.

sequence-invalid-endpoint-number = Sayı sırasının "{ $attribute }" paası geçersiz. Bir sayı olmaa lääzım.

sequence-invalid-endpoint-letters = Bukva sırasının "{ $attribute }" paası geçersiz. Bukvaların birleșmesi olmaa lääzım.

sequence-invalid-endpoint = Sıranın "{ $attribute }" paası geçersiz.

select-from-sequence-coprime-not-numbers = Sayılar seçilmedii için coprime hesaba alınmadı

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations belli edildii için coprime hesaba alınmadı

## Resolving a `target`

target-not-found = `<{ $source }>` için target geçersiz: hedef bulunmêêr.

target-state-variable-not-found = `<{ $source }>` için target geçersiz: `<{ $component }>` üstündä "{ $property }" adlı durum diișkeni bulunmêêr.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` diișkenneri baalı olmayan diișkendän ayırı olmaa lääzım.

ode-system-duplicate-variable-names = Tekrarlanan baalı diișken adlarınnan ODE saa taraf funkțiyaları belli edilämeer.

ode-system-rhs-function-error = ODE saa taraf funkțiyası belli edilämeer. mathjs funkțiyasını yaradarkan hata oldu.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = { $count } dooru arasındaki açı belli edilämeer

angle-invalid-through-point = `<angle>` elementinin through paasında geçersiz nokta var

parabola-vertex-too-many-points = Tepä noktası belli edilän hem 1 noktadan taa çok noktadan geçän parabola taa yapılmadı.

parabola-too-many-points = 3 noktadan taa çok noktadan geçän parabola taa yapılmadı.

intersection-too-many-items = İkidän taa çok nesnenin kesișmesi taa yapılmadı

## Other math components

ionic-compound-not-two-ions = İki iondan bașka ion birleșmeleri taa yapılmadı.

ionic-compound-needs-cation-and-anion = İon birleșmesi sade bir kationnan bir anion için yapıldı.

solve-equations-cannot-evaluate = Uravneniya hesaplanamadıı için çözülämeer: { $equation }

math-operators-operand-number-required = Bir matematika operandı alınarkan operandNumber belli edilmää lääzım.

eigen-decomposition-failed = Matrițanın öz paaları hesaplanamadı

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: { $parameters } parametrleri șablonda yok, onuștan her zaman boșlan uyacek.

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" annașılamêêr. none, medium, dense ya da boșlukçaan ayırılı iki pozitiv sayı olmaa lääzım, örnek: grid="1 0.5". Setka çizilmeer.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` için { $expected ->
        [one] bir çıkıșı — her noktada y' eegimi, örnek `y - x` — olan funkțiya
       *[other] iki çıkıșı — her noktada vektor, örnek `(y, -x)` — olan funkțiya
    } lääzım, ama verilän funkțiyanın { $found } çıkıșı var. { $alternative ->
        [none] Hiç bir șey çizilmeer.
       *[other] Bu funkțiya için uygun komponent — `<{ $alternative }>`. Hiç bir șey çizilmeer.
    }

field-function-attribute-ignored-with-child = Funkțiya komponentin içindä dä verildii için `function` atributu hesaba alınmêêr; içtekisi kullanılêr. Funkțiyayı bu iki yoldan sade birinnän veriniz.

field-variables-ignored =
    `<{ $component }>`: `variables` atributu komponentin içindä dooru-dooruya yazılı ifadenin diișkennerini adlandırêr. { $reason ->
        [function-child] Buradaki funkțiya `<function>` ușak elementi gibi verilmiș hem kendi diișkennerini kendisi adlandırêr, onuștan `variables` hesaba alınmêêr.
       *[no-expression] Burada ölä bir ifadä verilmemiș, onuștan `variables` hesaba alınmêêr.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure göstericisindä xLabelPosition="left" tutulmêêr; saa taraf davranıșı kullanılêr.

prefigure-y-label-position-unsupported = `<graph>`: prefigure göstericisindä yLabelPosition="bottom" tutulmêêr; üst taraf davranıșı kullanılêr.

prefigure-invalid-axis-bounds = `<graph>`: prefigure çevirmesi için os sınırları geçersiz; ön görülü bbox (-10,-10,10,10) kullanılêr.

prefigure-invalid-width = `<graph>`: prefigure çevirmesi için genișlik geçersiz; ön görülü diagramma genișlii 425 kullanılêr.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure çevirmesi için aspectRatio geçersiz; ön görülü en-boy oranı 1 kullanılêr.

prefigure-grid-spacing-too-fine = `<graph>`: setka aralıı os sınırlarına görä pek incä; prefigure göstericisindä setka çizilmeer.

prefigure-annotations-not-rendered = `<graph>`: PreFigure göstericisi kullanılmadıınnan annotațiyalar çizilmeer.

multiple-annotations-children = `<graph>` içindä birdän çok `<annotations>` ușak elementi bulundu; sonuncudan bașkaları hesaba alınmêêr.

## Referring to other components

copy-unrecognized-component-type = Tanınmayan komponent tipi genișledilämeer ya da kopiyalanamêêr: { $type }.

copy-prop-not-found = { $component } tipindeki komponenttä { $property } özellii bulunmadı

collect-no-source = collect için kaynak bulunmadı.

collect-invalid-component-type = `<{ $component }>` geçerli komponent tipi olmadıı için bu tiptekilär toplanamêêr.

reference-index-unavailable = `{ $reference }` indeksinä gösterilämeer

## `<callAction>`

component-action-unavailable = `{ $reference }` komponentindä { $action } çaarılamêêr

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Verilerin șekli geçersiz. Sıra uzunnukları uyușmêêr. componentIdx :{ $componentIdx } içindä bulundu

data-frame-duplicate-column-names = Verilerdä tekrarlanan sutun adları var. componentIdx :{ $componentIdx } içindä bulundu

data-frame-missing-column-name = Verilerdä bir sutun adı etișmeer. componentIdx :{ $componentIdx } içindä bulundu

## `<answer>` and scoring

answer-award-depends-on-own-response = Bu cuvabın bir award elementi answer tegin kendi yolladıı cuvaba dayanêr; bu beklenmedik davranıșa götürer.

answer-max-num-attempts-in-section-wide-check-work = Denemä sayısı konteyner tarafından güdüldüü için, `sectionWideCheckWork` olan konteynerin içindeki `<answer>` üstündä `maxNumAttempts` koymanın etkisi yok. `maxNumAttempts` paasını konteynerdä koyunuz.

nested-section-wide-check-work-max-num-attempts = Denemä sayısı dıștaki konteyner tarafından güdüldüü için, `sectionWideCheckWork` olan bașka bir konteynerin içindeki `sectionWideCheckWork` konteynerindä `maxNumAttempts` koymanın etkisi yok. `maxNumAttempts` paasını dıștaki konteynerdä koyunuz.

answer-attributes-need-symbolic-equality = symbolicEquality koyulmadaan { $attributes } atributlarının etkisi olmaz.

answer-invalid-type = answer için tip geçersiz: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` komponentinin adı olmadıı için modul atributu gibi kullanılamêêr

module-attribute-name-already-defined = `<module>` komponent tipindä zatın bir "{ $name }" atributu belli edildii için `<{ $component } name="{ $name }">` komponenti modulun atributu gibi kullanılamêêr.

conditional-content-condition-ignored = case ya da else ușak elementleri olan `<conditionalContent>` komponentindä `condition` atributu hesaba alınmêêr.

slider-markers-type-mismatch = İșaretçilerin tipi slayderin tipinä uymêêr.

pretzel-problem-needs-statement-and-answer = pretzel geçersiz: her `<problem>` bir `<statement>` hem bir `<answer>` içermää lääzım.

pretzel-circuit-first-problem-distractor = pretzel geçersiz: mode="circuit" olduunda ilk `<problem>` șașırdıcı olamaz.

## Attribute values

attribute-invalid-values = `{ $attribute }` atributu için { $values } paaları geçersiz; hesaba alınmêêr.

attribute-must-be-references = `{ $attribute }` atributu için `{ $value }` paası geçersiz. Atribut `$` ile bașlayan referenslardan kurulu olmaa lääzım.

math-input-invalid-function-names = <mathInput>: { $attribute } içindeki geçersiz funkțiya adları hesaba alınmadı: { $names }. Her adın görünän payı en az 2 harftän (bukva ya da tirä) kurulu olmaa lääzım; sondan sora seçim olarak `|<mathspeak alternativası>` gelebilir.

## Building components from the source

component-type-invalid = Komponent tipi geçersiz: `<{ $componentType }>`

attribute-repeated = { $attribute } atributu tekrarlanamaz.

attribute-invalid-for-component = "{ $attribute }" atributu `<{ $componentType }>` tipindeki komponent için geçersiz.

## Style definition contrast

style-definition-insufficient-contrast =
    { $styleNumber } nomerli stil tarifi { $context ->
        [text-on-background] fon rengine karșı tekst rengi
        [high-contrast] kanvasa karșı üüsek kontrastlı renk
        [line] kanvasa karșı çizgi rengi
        [marker] kanvasa karșı ișaretçi rengi
       *[text-on-canvas] kanvasa karșı tekst rengi
    } için etișän kontrasta sahip diil{ $mode ->
        [dark] { " (karannık rejim)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; en az { $threshold }:1 lääzım).

style-definition-dark-mode-text-background-contrast =
    { $styleNumber } nomerli stil tarifi açık rejim için etișän kontrast verän renklär belli etmiș olsa da, bu paalardan alınan karannık rejim renkleri tekst rengiylän fon rengi arasında etișän kontrasta sahip diil ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; en az { $threshold }:1 lääzım). { $suggestion ->
        [available] Karannık rejimdä kontrast etișsin deyni, ya açık rejim kontrastını büüdünüz (örnek: { $lightAttribute }="{ $lightColor }" koyunuz), ya da karannık rejim rengini bastırınız (örnek: { $darkAttribute }="{ $darkColor }" koyunuz).
       *[none] Karannık rejimdä kontrast etișsin deyni, açık rejim kontrastını büüdünüz ya da alınan renkleri textColorDarkMode hem/ya da backgroundColorDarkMode ile bastırınız.
    }

style-definition-dark-mode-text-canvas-contrast =
    { $styleNumber } nomerli stil tarifi açık rejim için etișän kontrast verän tekst rengi belli etmiș olsa da, bu paadan alınan karannık rejim tekst rengi kanvasa karșı etișän kontrasta sahip diil ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; en az { $threshold }:1 lääzım). { $suggestion ->
        [available] Karannık rejimdä kontrast etișsin deyni, ya açık rejim kontrastını büüdünüz (örnek: textColor="{ $lightColor }" koyunuz), ya da karannık rejim rengini bastırınız (örnek: textColorDarkMode="{ $darkColor }" koyunuz).
       *[none] Karannık rejimdä kontrast etișsin deyni, açık rejim kontrastını büüdünüz ya da alınan rengi textColorDarkMode ile bastırınız.
    }

section-multiple-style-palettes = Bir bölüm sade bir <stylePalette> seçebilir; sonuncusu kullanılêr.

## Unique variants

variant-num-to-select-not-non-negative-integer = numToSelect negativ olmayan tam sayı olmadıı için { $component } elementinin ayırı variantları belli edilämeer.

variant-num-to-select-not-constant-number = numToSelect sabit sayı olmadıı için { $component } elementinin ayırı variantları belli edilämeer.

variant-with-replacement-not-constant-boolean = withReplacement sabit boolean paa olmadıı için { $component } elementinin ayırı variantları belli edilämeer.

variant-select-weight-disables-unique = Bir opțiyada selectWeight ya da selectForVariants belli edilirsä, select için ayırı variantlar kapanêr

variant-coprime-undetermined = coprime her zaman yannıș olduu belli edilämedii için { $component } elementinin ayırı variantları belli edilämeer.

variant-attribute-not-constant = { $attribute } sabit olmadıı için { $component } elementinin ayırı variantları belli edilämeer.

variant-attribute-not-number = { $attribute } sayı olmadıı için { $component } elementinin ayırı variantları belli edilämeer.

variant-attribute-wrong-type-for-sequence =
    { $attribute } { $expected ->
        [letters-combination] bukvaların birleșmesi
        [math-expression] geçerli matematika ifadesi
        [integer] tam sayı
       *[number] sayı
    } olmadıı için { $type } tipindeki { $component } elementinin ayırı variantları belli edilämeer.

variant-length-not-integer = length tam sayı olmadıı için { $component } elementinin ayırı variantları belli edilämeer.

variant-sort-not-implemented = sort olan { $component } elementinin ayırı variantları taa yapılmadı

variant-exclude-combinations-not-implemented = excludeCombinations olan { $component } elementinin ayırı variantları taa yapılmadı

variant-math-exclude-not-implemented = exclude olan math tipindeki { $component } elementinin ayırı variantları taa yapılmadı

variant-non-constant-exclude-not-implemented = Sabit olmayan exclude olan { $component } elementinin ayırı variantları taa yapılmadı

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: grafik prefigure göstericisindä tutulmêêr; ușak element atlandı.

prefigure-descendant-invalid-geometry = { $subject }: geometriya sonlu diil ya da etișmeer; ușak element atlandı.

prefigure-curve-label-omitted = { $subject }: çevrilmiș iiri elementlerindä etiketlär tutulmêêr; etiket atlandı.

prefigure-curve-unsupported-definition-type = { $subject }: tutulmayan iiri funkțiyası tarif tipi '{ $definitionType }'; ușak element atlandı.

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves üstündä flipFunctions atributu tutulmêêr; ușak element atlandı.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves sade formula tipindeki ușak funkțiyaları tutêr; ușak element atlandı.

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] dooru ailesi etiketi
       *[point] nokta etiketi
    } için labelPosition '{ $labelPosition }' tutulmêêr; PreFigure ön görülü sıralanması kullanılêr.

prefigure-fill-style-unsupported = { $subject }: '{ $fillStyle }' doldurma stili PreFigure tarafından tutulmêêr; düz doldurmaya geçiler.

prefigure-line-style-unknown = { $subject }: bilinmeyän '{ $lineStyle }' çizgi stili PreFigure çıkıșından atlandı.

prefigure-marker-style-mapped-to-diamond = { $subject }: '{ $markerStyle }' ișaretçi stili PreFigure'un 'diamond' stilinä uygunnaștırıldı.

prefigure-marker-style-unsupported = { $subject }: '{ $markerStyle }' ișaretçi stili PreFigure tarafından tutulmêêr; ön görülü stil kullanılêr.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` geçersiz; hedef çözülämeer. Annotațiya atlandı.

annotation-ref-multiple-targets = `<annotation>`: `ref` birdän çok hedefä çözüldü; ilk hedef kullanılêr.

annotation-ref-outside-graph = `<annotation>`: `ref` geçersiz; hedef onu içerän grafiin dıșında. Annotațiya atlandı.

annotation-ref-unsupported-target = `<annotation>`: `ref` geçersiz; prefigure çevirmesindä hedef tutulan grafik nesnä diil. Annotațiya atlandı.

annotation-text-missing = `<annotation>`: `text` etișmeer ya da boș; boș tekst çıkarılêr.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Dolanık baalantı bulundu.
       *[other] `<{ $componentType }>` komponentini içerän dolanık baalantı bulundu.
    }

reference-no-referent = Referens için hedef bulunmadı: `{ $reference }`

reference-multiple-referents = Referens için birdän çok hedef bulundu: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` elementinin { $attribute } atributunun formatı geçersiz.

children-invalid = `<{ $componentType }>` için ușak elementlär geçersiz: geçersiz ușak elementlär bulundu: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` atributu için `{ $value }` paası geçersiz; `{ $default }` paası kullanılêr

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML { $version } versiyası bulunmadı.
       *[other] DoenetML { $version } versiyası bulunmadı. { $fallback } versiyasına dönüler
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML geçersiz: { $content }

parse-tag-missing-close-tag = DoenetML geçersiz: `{ $tag }` tegin kapanıș tegi yok. Kendi kapanan teg ya da `</{ $tagName }>` tegi beklenärdi.

parse-tag-error = DoenetML geçersiz: `<{ $tagName }>` tegindä hata var

parse-attribute-missing-value = DoenetML geçersiz: `{ $attribute }` atributunun paası etișmeer gibi görüner.

parse-attribute-invalid = DoenetML geçersiz: `{ $attribute }` atributu geçersiz

parse-attribute-value-invalid = DoenetML geçersiz: `{ $value }` atribut paası geçersiz

parse-attribute-value-quote-mismatch = DoenetML geçersiz: `{ $value }` atribut paası geçersiz. Tırnaklar uyușmêêr. Bir `{ $quote }` etișmeer gibi görüner

parse-open-tag-name-missing = DoenetML geçersiz: teg adı olmayan teg bulundu, örnek `<`

parse-tag-not-closed = DoenetML geçersiz: `{ $tag }` tegi kapanmamıș (bir `>` etișmeer gibi görüner).

parse-self-closing-tag-name-missing = DoenetML geçersiz: teg adı olmayan teg bulundu `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML geçersiz: `{ $tag }` tegi kapanmamıș (`/>` etișmeer gibi görüner).

parse-tag-invalid-attributes = DoenetML geçersiz: `{ $tag }` tegi geçerli diil. Atributları yannıș olabilir.

parse-close-tag-name-missing = DoenetML geçersiz: teg adı olmayan kapanıș tegi bulundu, örnek `</`

parse-attribute-value-unquoted = Atribut paaları tırnak içinä alınmaa lääzım: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML geçersiz: `{ $tag }` kapanıș tegi bulundu, ama ona uygun açılıș tegi yok

parse-close-tag-mismatched = DoenetML geçersiz: kapanıș tegi uyușmêêr. `</{ $expected }>` beklenärdi. `{ $found }` bulundu

parser-node-unconvertible = { $node } düümü Dast düümünä çevrilämedi.

## Names

name-attribute-invalid =
    name='{ $name }' atributu geçersiz. { $reason ->
        [characters] Adlarda sade bukvalar, țifralar, alt çizgi ya da tirä olabilir.
       *[start] Adlar bir bukvaylan bașlamaa lääzım.
    }

component-name-invalid-start = "{ $name }" komponent adı geçersiz. Adlar bir bukvaylan bașlamaa lääzım.

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched tipindeki answer elementinin video atributu olmaa lääzım

answer-video-watched-video-not-reference = videoWatched tipindeki answer elementinin video atributu bir referens olmaa lääzım

answer-name-not-single-text = answer elementinin name atributunun sade bir tekst ușak elementi olmaa lääzım

## Referencing another document

external-doenetml-recursion-limit = Rekursiya uuru pek çok olduu için dıștaki DoenetML alınamêêr. Dolanık referens var mı?

external-doenetml-unavailable = { $attribute }="{ $uri }" adresindän DoenetML alınamêêr

external-doenetml-type-mismatch = { $attribute }="{ $uri }" adresindän alınan DoenetML geçersiz: "{ $componentType }" komponent tipinä uymadı

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` atributu kullanıștan çıkarıldı; erinä `{ $to }` kullanınız.
       *[other] [deprecation] `<{ $component }>` üstündeki `{ $from }` atributu kullanıștan çıkarıldı; erinä `{ $to }` kullanınız.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $to }` da belli edildii için `{ $from }` atributu kullanıștan çıkarıldı hem hesaba alınmadı.
       *[other] [deprecation] `{ $to }` da belli edildii için `<{ $component }>` üstündeki `{ $from }` atributu kullanıștan çıkarıldı hem hesaba alınmadı.
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` üstündeki `{ $attribute }` atributu kullanıștan çıkarıldı hem hesaba alınmêêr.

deprecated-attribute-to-child = [deprecation] `<{ $component }>` üstündeki `{ $attribute }` atributu kullanıștan çıkarıldı; erinä bir `<{ $child }>` ușak elementi kullanınız.

deprecated-attribute-value-renamed = [deprecation] `<{ $component }>` üstündeki `{ $attribute }` atributunun `{ $value }` paası kullanıștan çıkarıldı; erinä `{ $to }` kullanınız.


## Language coverage

pluralize-english-only = `<pluralize>` sade ingilizcä lafları çokluk yapabildii için, { $locale } dilindä yazılı bir dokumenttä tekst diișilmedän kalêr. Çokluk formasını dooru-dooruya yazınız ya da `pluralForm` atributunnan koyunuz.


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` elementi tanınan Doenet elementi diil.

schema-element-not-allowed-at-root = `<{ $tag }>` elementinä dokumentin kökündä izin verilmeer.

schema-element-not-allowed-inside = `<{ $tag }>` elementinä `<{ $parent }>` içindä izin verilmeer.

schema-attribute-unrecognized = `<{ $tag }>` elementinin `{ $attribute }` adlı atributu yok.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` elementinin `{ $attribute }` atributu her elementi șunnardan biri olan bir spisok olmaa lääzım: { $allowed }
       *[other] `<{ $tag }>` elementinin `{ $attribute }` atributu șunnardan biri olmaa lääzım: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select için variant adı geçersiz. { $variantName } variant adı { $numOptions } opțiyada geçer, ama seçilecek sayı { $numToSelect }.

select-variant-name-without-options = select için variantlar belli edilmiș, ama mümkün olan { $variantName } variant adı için opțiya yok.

select-variant-name-not-possible = select için belli edilän { $variantName } variant adı mümkün olan variant adı diil.

select-too-few-options = Sade { $numOptions } komponenttän { $numToSelect } tanesi seçilämeer.

select-from-sequence-too-few-values = Uzunnuu { $length } olan sıradan { $numToSelect } paa seçilämeer.

select-from-sequence-indices-count-mismatch = select için belli edilän indeks sayısı seçilecek sayıya uymaa lääzım

select-from-sequence-indices-not-integers = select için belli edilän bütün indekslär tam sayı olmaa lääzım

select-from-sequence-index-excluded = selectfromsequence için belli edilän indeks çıkarılannardandı

select-from-sequence-indices-excluded-combination = selectfromsequence için belli edilän indekslär çıkarılan bir birleșmäydi

select-from-sequence-coprime-not-positive-integers = Pozitiv tam sayılar seçilmedii için aralarında prost birleșmelär seçilämeer.

select-from-sequence-coprime-common-factor = Aralarında prost sayılar seçilämeer. Mümkün olan paaların hepsinin ortak bölücüsü var. (Belli edilän "from" ya da "to" paaları "step" ile aralarında prost olmaa lääzım.)

select-from-sequence-coprime-single-number = 1 olmayan bir tek sayıdan aralarında prost birleșmelär seçilämeer.

select-from-sequence-excluded-too-many-combinations = selectFromSequence içindä birleșmelerin 70%-indän çoyu çıkarıldı

select-from-sequence-coprime-none-found = Aralarında prost sayılar seçilämedi. Mümkün olan paaların hepsinin ortak bölücüsü var.

select-from-sequence-too-few-unique-values = Uzunnuu { $numPossibleValues } olan sıradan { $numToSelect } ayırı paa seçilämeer

select-prime-numbers-too-few-values = Uzunnuu { $numValues } olan prost sayılar spiskusundan { $numToSelect } paa seçilämeer

select-prime-numbers-values-count-mismatch = select için belli edilän paa sayısı seçilecek sayıya uymaa lääzım

select-prime-numbers-values-not-prime = select prime number için belli edilän bütün paalar prost sayılar spiskusunda olmaa lääzım

select-prime-numbers-values-excluded-combination = selectPrimeNumbers için belli edilän paalar çıkarılan bir birleșmäydi

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers içindä birleșmelerin 70%-indän çoyu çıkarıldı

select-random-combination-fluke = Pek küçük bir olasılıklan, rastgelä paaların birleșmesi seçilämedi

select-random-value-fluke = Pek küçük bir olasılıklan, rastgelä paa seçilämedi

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` matematikanın içindä çizilmeer; ifadä, girișlär içinä koyulamadıı vakıtkı gibi yazılêr. { $reason ->
        [not-inline] İfadenin içinä sade `inline` seçim giriși sıașêr; `inline` olmadaan o bir düümä blokudur.
        [expanded] `expanded` tekst giriși birkaç satırlı bir kutudur hem ifadenin içinä sıașmayacek kadar büüktür.
        [on-graph] Grafiktä ifadä bütün bir resim gibi çizilêr hem onda kontrol için er yok.
       *[relative-width] Onun `width` paası oranlıdır (proțent ya da `em`) hem ifadenin içindä ölçülecek bir șey yoktur. Genișlii `px` gibi mutlak birliklärlän veriniz.
    }
