# Yiddish diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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
# own source. Each of them is a left-to-right run inside a right-to-left
# sentence, which the bidi algorithm resolves; nothing here reorders anything
# by hand.
#
# Where English separates a singular from a plural only in the verb — "is
# ignored" against "are ignored" — Yiddish changes the verb too, so those
# selects are kept rather than collapsed.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } ווערט איגנאָרירט ווען ביידע עקפּונקטן זייַנען אָנגעגעבן
       *[other] { $attributes } ווערן איגנאָרירט ווען ביידע עקפּונקטן זייַנען אָנגעגעבן
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } ווערט איגנאָרירט ווען אַן עקפּונקט און אַ מיטלפּונקט זייַנען ביידע אָנגעגעבן
       *[other] { $attributes } ווערן איגנאָרירט ווען אַן עקפּונקט און אַ מיטלפּונקט זייַנען ביידע אָנגעגעבן
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset האָט קיין ווירקונג ניט אָן אַ מיטלפּונקט

## `<line>`

line-points-undetermined-dimensions = אַ ליניע דורך פּונקטן מיט ניט־באַשטימטע דימענסיעס.

line-points-too-few-dimensions = אַ ליניע מוז גיין דורך פּונקטן פֿון לפּחות צוויי דימענסיעס.

line-points-depend-on-variables = די ליניע גייט דורך פּונקטן וואָס הענגען אָפּ פֿון וואַריאַבלען: { $variables }.

line-equation-invalid-format = אומגילטיקער פֿאָרמאַט פֿאַר דער גלייַכונג פֿון אַ ליניע אין די וואַריאַבלען { $variable1 } און { $variable2 }.

## `<ray>`

ray-overprescribed-through = דער שטראַל איז באַשטימט מיט through, endpoint און direction. דאָס אָנגעגעבענע through ווערט איגנאָרירט.

ray-dimension-mismatch = ניט־שטימיקער numDimensions אין ray.

## `<vector>`

vector-overprescribed-head = דער וועקטאָר איז באַשטימט מיט head, tail און displacement. דאָס אָנגעגעבענע head ווערט איגנאָרירט.

vector-dimension-mismatch = ניט־שטימיקער numDimensions אין vector.

## Attracting and constraining

attract-to-without-nearest-point = מען קען ניט צוציִען צו אַ `<{ $component }>` ווייַל ער האָט ניט קיין nearestPoint סטאַט־וואַריאַבל.

constrain-to-without-nearest-point = מען קען ניט באַגרענעצן צו אַ `<{ $component }>` ווייַל ער האָט ניט קיין nearestPoint סטאַט־וואַריאַבל.

constrain-to-interior-without-nearest-point = מען קען ניט באַגרענעצן צום אינעווייניקסטן פֿון אַ `<{ $component }>` ווייַל ער האָט ניט קיין nearestPoint סטאַט־וואַריאַבל.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ווערט איגנאָרירט פֿאַר אַ choiceInput וואָס איז ניט inline

## Ordering children by index

choice-input-indices-count-mismatch = די אָנגעגעבענע אינדעקסן פֿאַר choiceInput ווערן איגנאָרירט ווייַל די צאָל אינדעקסן שטימט ניט מיט דער צאָל choice־קינדער.

pretzel-indices-count-mismatch = די אָנגעגעבענע אינדעקסן פֿאַר problem ווערן איגנאָרירט ווייַל די צאָל אינדעקסן שטימט ניט מיט דער צאָל problem־קינדער.

shuffle-indices-count-mismatch = די אָנגעגעבענע אינדעקסן פֿאַר shuffle ווערן איגנאָרירט ווייַל די צאָל אינדעקסן שטימט ניט מיט דער צאָל קאָמפּאָנענטן.

indices-ignored-out-of-range = די אָנגעגעבענע אינדעקסן פֿאַר { $component } ווערן איגנאָרירט ווייַל טייל אינדעקסן זייַנען אַרויס פֿון תּחום.

pretzel-indices-repeated = די אָנגעגעבענע אינדעקסן פֿאַר pretzel ווערן איגנאָרירט ווייַל טייל אינדעקסן חזרן זיך איבער.

pretzel-circuit-first-index = די אָנגעגעבענע אינדעקסן פֿאַר pretzel אין mode="circuit" ווערן איגנאָרירט ווייַל דער ערשטער אינדעקס מוז זייַן 1.

## `<shuffle>` and `<sort>`

string-children-need-type = כּדי `<{ $component }>` זאָל אַרבעטן מיט טעקסט־קינדער מוז אַן אַטריבוט `type` זייַן אָנגעגעבן.

invalid-type-defaulting-to-math = אומגילטיקער type { $type } פֿאַר דער קאָמפּאָנענט { $component }. עס מוז זייַן math, text, number אָדער boolean. עס ווערט געשטעלט אויף math.

string-not-valid-component-to-arrange = דער טעקסט "{ $value }" איז ניט קיין גילטיקע קאָמפּאָנענט פֿאַר { $component }. ער ווערט איגנאָרירט.

## Types and variables

invalid-type-defaulting-to-number = אומגילטיקער type { $type }, type ווערט געשטעלט אויף number.

invalid-variable-value = אומגילטיקער ווערט פֿון אַ וואַריאַבל: `{ $value }`

## Variants

variant-index-must-be-number = דער וואַריאַנט־אינדעקס { $index } מוז זייַן אַ צאָל

variant-index-must-be-integer = דער וואַריאַנט־אינדעקס { $index } מוז זייַן אַ גאַנצע צאָל

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` איז ניט אויסגעפֿירט פֿאַר אַבסאָלוטע מאָסן. די ברייטן ווערן געשטעלט אויף רעלאַטיווע.

side-by-side-absolute-margins = `<{ $component }>` איז ניט אויסגעפֿירט פֿאַר אַבסאָלוטע מאָסן. די ראַנדן ווערן געשטעלט אויף רעלאַטיווע.

side-by-side-no-block-child = אומגילטיקער `<{ $component }>`: ער מוז האָבן לפּחות איין בלאָק־קינד.

## `<label>`

label-for-ignored-on-graphical = דער אַטריבוט `for` אויף אַ גראַפֿישן `<label>` ווערט איגנאָרירט.

label-for-must-resolve-to-one = דער אַטריבוט `for` אויף `<label>` מוז זיך אויסלייזן אין פּונקט איין קאָמפּאָנענט.

label-for-unresolved = דער אַטריבוט `for` אויף `<label>` האָט זיך ניט געלאָזט אויסלייזן אין אַ קאָמפּאָנענט.

label-for-answer-with-authored-inputs = דער אַטריבוט `for` אויף `<label>` ווייַזט אויף אַן `<answer>` מיט בפֿירוש געשריבענע אַרייַנפֿירן; ווייַזט בעסער אויף דעם אַרייַנפֿיר אַליין.

label-for-answer-without-input = דער אַטריבוט `for` אויף `<label>` ווייַזט אויף אַן `<answer>` אָן אַן אַרייַנפֿיר צו באַצייכענען.

label-for-must-reference-input-or-answer = דער אַטריבוט `for` אויף `<label>` מוז ווייַזן אויף אַן אַרייַנפֿיר אָדער אויף אַן answer.

## Accessibility

accessibility-short-description-or-decorative = צוליב צוטריטלעכקייט מוז `<{ $component }>` האָבן אַ קורצע באַשרייַבונג אָדער זייַן אָנגעגעבן ווי אַ באַפּוצנדיקער.

accessibility-video-short-description = צוליב צוטריטלעכקייט מוז `<video>` האָבן אַ קורצע באַשרייַבונג.

accessibility-input-short-description-or-label = צוליב צוטריטלעכקייט מוז `<{ $component }>` האָבן אַ קורצע באַשרייַבונג אָדער אַ צייכן.

accessibility-answer-input-short-description-or-label = צוליב צוטריטלעכקייט מוז אַן `<answer>` וואָס שאַפֿט אַן אַרייַנפֿיר האָבן אַ קורצע באַשרייַבונג אָדער אַ צייכן.

accessibility-short-description-contains-math = קורצע באַשרייַבונגען זאָלן ניט אַנטהאַלטן מאַטעמאַטישע קאָמפּאָנענטן ווי `<{ $component }>`. שרייַבט די מאַטעמאַטיק אויס מיט ווערטער.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } האָט ניט גענוג קאָנטראַסט פֿאַרן טעקסט פֿונעם אָפּטייל־קעפּל (טונקעלער מאָדע) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; עס פֿאָדערט זיך לפּחות { $threshold }:1).
       *[other] { $colorName } האָט ניט גענוג קאָנטראַסט פֿאַרן טעקסט פֿונעם אָפּטייל־קעפּל ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; עס פֿאָדערט זיך לפּחות { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = אַ `<circle>` דורך { $count } פּונקטן איז ניט אויסגעפֿירט אין דעם פֿאַל וווּ די פּונקטן האָבן ניט קיין נומערישע ווערטן.

circle-too-many-through-points = מען קען ניט אויסרעכענען אַ קרייַז דורך מער ווי 3 פּונקטן.

circle-overprescribed-radius-center-points = מען קען ניט אויסרעכענען אַ קרייַז מיט אַן אָנגעגעבענעם ראַדיוס, צענטער און פּונקטן.

circle-center-with-multiple-points = מען קען ניט אויסרעכענען אַ קרייַז מיט אַן אָנגעגעבענעם צענטער דורך מער ווי 1 פּונקט.

circle-radius-too-small = מען קען ניט אויסרעכענען דעם קרייַז: אַזוי ווי דער אָפּשטאַנד צווישן די צוויי פּונקטן איז { $distance }, איז דער אָנגעגעבענער ראַדיוס { $radius } צו קליין.

circle-radius-with-many-points = מען קען ניט שאַפֿן אַ קרייַז דורך מער ווי צוויי פּונקטן מיט אַן אָנגעגעבענעם ראַדיוס.

circle-invalid-center-or-through-points = אומגילטיקער צענטער אָדער אומגילטיקע פּונקטן פֿונעם קרייַז.

circle-radius-center-with-multiple-points = מען קען ניט אויסרעכענען דעם ראַדיוס פֿון אַ קרייַז מיט אַן אָנגעגעבענעם צענטער דורך מער ווי 1 פּונקט.

circle-change-radius-non-numerical = מען קען ניט בייַטן דעם ראַדיוס פֿון אַ קרייַז מיט ניט־נומערישע פּונקטן

circle-radius-with-points-non-numerical = מען קען ניט שאַפֿן אַ קרייַז דורך מער ווי איין פּונקט מיט אַן אָנגעגעבענעם ראַדיוס ווען די ווערטן זייַנען ניט נומעריש.

circle-change-center-non-numerical = דאָס בייַטן פֿונעם צענטער פֿון אַ קרייַז דורך פּונקטן מיט ניט־נומערישע ווערטן איז ניט אויסגעפֿירט.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] ניט גענוג דימענסיעס פֿאַרן געביט פֿון דער פֿונקציע. דאָס געביט האָט { $intervals } אינטערוואַל, און די פֿונקציע האָט { $inputs ->
            [one] { $inputs } אַרייַנפֿיר
           *[other] { $inputs } אַרייַנפֿירן
        }.
       *[other] ניט גענוג דימענסיעס פֿאַרן געביט פֿון דער פֿונקציע. דאָס געביט האָט { $intervals } אינטערוואַלן, און די פֿונקציע האָט { $inputs ->
            [one] { $inputs } אַרייַנפֿיר
           *[other] { $inputs } אַרייַנפֿירן
        }.
    }

function-domain-invalid-format = אומגילטיקער פֿאָרמאַט פֿאַרן געביט פֿון דער פֿונקציע.

function-ignoring-non-numerical =
    { $type ->
        [maximum] דער ניט־נומערישער מאַקסימום פֿון דער פֿונקציע ווערט איגנאָרירט.
        [minimum] דער ניט־נומערישער מינימום פֿון דער פֿונקציע ווערט איגנאָרירט.
        [extremum] דער ניט־נומערישער עקסטרעמום פֿון דער פֿונקציע ווערט איגנאָרירט.
        [point] דער ניט־נומערישער פּונקט פֿון דער פֿונקציע ווערט איגנאָרירט.
        [slope] דער ניט־נומערישער נייַג פֿון דער פֿונקציע ווערט איגנאָרירט.
       *[other] דער ניט־נומערישער { $type } פֿון דער פֿונקציע ווערט איגנאָרירט.
    }

function-ignoring-empty =
    { $type ->
        [maximum] דער ליידיקער מאַקסימום פֿון דער פֿונקציע ווערט איגנאָרירט.
        [minimum] דער ליידיקער מינימום פֿון דער פֿונקציע ווערט איגנאָרירט.
        [extremum] דער ליידיקער עקסטרעמום פֿון דער פֿונקציע ווערט איגנאָרירט.
        [point] דער ליידיקער פּונקט פֿון דער פֿונקציע ווערט איגנאָרירט.
       *[other] דער ליידיקער { $type } פֿון דער פֿונקציע ווערט איגנאָרירט.
    }

function-points-too-close = די פֿונקציע אַנטהאַלט צוויי פּונקטן וואָס ליגן צו נאָענט איינער צום אַנדערן. מען קען די פֿונקציע ניט דעפֿינירן.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] איטעראַציעס פֿון אַ פֿונקציע זייַנען מעגלעך בלויז אויב די צאָל אַרייַנפֿירן איז גלייַך צו דער צאָל אַרויספֿירן. די פֿונקציע האָט { $inputs } אַרייַנפֿיר און { $outputs ->
            [one] { $outputs } אַרויספֿיר
           *[other] { $outputs } אַרויספֿירן
        }.
       *[other] איטעראַציעס פֿון אַ פֿונקציע זייַנען מעגלעך בלויז אויב די צאָל אַרייַנפֿירן איז גלייַך צו דער צאָל אַרויספֿירן. די פֿונקציע האָט { $inputs } אַרייַנפֿירן און { $outputs ->
            [one] { $outputs } אַרויספֿיר
           *[other] { $outputs } אַרויספֿירן
        }.
    }

## `<sequence>`

sequence-invalid-length = אומגילטיקע לענג פֿון דער סעקווענץ. עס מוז זייַן אַ ניט־נעגאַטיווע גאַנצע צאָל.

sequence-invalid-step = אומגילטיקער טראָט פֿון דער סעקווענץ. עס מוז זייַן אַ צאָל פֿאַר אַ סעקווענץ פֿון טיפּ { $type }.

sequence-invalid-endpoint-number = אומגילטיקער "{ $attribute }" פֿון אַ נומערישער סעקווענץ. עס מוז זייַן אַ צאָל.

sequence-invalid-endpoint-letters = אומגילטיקער "{ $attribute }" פֿון אַ בוכשטאַבן־סעקווענץ. עס מוז זייַן אַ קאָמבינאַציע פֿון בוכשטאַבן.

sequence-invalid-endpoint = אומגילטיקער "{ $attribute }" פֿון דער סעקווענץ.

select-from-sequence-coprime-not-numbers = coprime ווערט איגנאָרירט ווייַל מען קלייַבט ניט קיין צאָלן

select-from-sequence-coprime-with-exclude-combinations = coprime ווערט איגנאָרירט ווייַל excludeCombinations איז אָנגעגעבן

## Resolving a `target`

target-not-found = אומגילטיקער target פֿאַר `<{ $source }>`: מען קען דעם ציל ניט געפֿינען.

target-state-variable-not-found = אומגילטיקער target פֿאַר `<{ $source }>`: מען קען ניט געפֿינען קיין סטאַט־וואַריאַבל מיטן נאָמען "{ $property }" אויף אַ `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = די וואַריאַבלען פֿון `<odeSystem>` מוזן זייַן אַנדערע ווי די אומאָפּהענגיקע וואַריאַבל.

ode-system-duplicate-variable-names = מען קען ניט דעפֿינירן די רעכטע זייַטן פֿון אַ דיפֿערענציאַל־גלייַכונג מיט איבערגעחזרטע נעמען פֿון אָפּהענגיקע וואַריאַבלען.

ode-system-rhs-function-error = מען קען ניט דעפֿינירן די רעכטע זייַט פֿון דער דיפֿערענציאַל־גלייַכונג. אַ טעות בייַם שאַפֿן דער mathjs־פֿונקציע.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = מען קען ניט דעפֿינירן קיין ווינקל צווישן { $count } ליניעס

angle-invalid-through-point = אַן אומגילטיקער פּונקט אין through פֿון `<angle>`

parabola-vertex-too-many-points = אַ פּאַראַבאָלע מיט אַ שפּיץ דורך מער ווי 1 פּונקט איז ניט אויסגעפֿירט.

parabola-too-many-points = אַ פּאַראַבאָלע דורך מער ווי 3 פּונקטן איז ניט אויסגעפֿירט.

intersection-too-many-items = אַ שנייַדונג פֿון מער ווי צוויי אָביעקטן איז ניט אויסגעפֿירט

## Other math components

ionic-compound-not-two-ions = אַ יאָנישע פֿאַרבינדונג איז ניט אויסגעפֿירט פֿאַר עפּעס אַנדערש ווי צוויי יאָנען.

ionic-compound-needs-cation-and-anion = אַ יאָנישע פֿאַרבינדונג איז אויסגעפֿירט בלויז פֿאַר איין קאַטיאָן און איין אַניאָן.

solve-equations-cannot-evaluate = מען קען די גלייַכונג ניט לייזן ווייַל מען האָט זי ניט געקענט אויסרעכענען: { $equation }

math-operators-operand-number-required = בייַם אַרויסציִען אַ מאַטעמאַטישן אָפּעראַנד מוז מען אָנגעבן אַן operandNumber.

eigen-decomposition-failed = מען האָט ניט געקענט אויסרעכענען די אייגנווערטן פֿון דער מאַטריצע

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: דער פּאַראַמעטער { $parameters } קומט ניט פֿאָר אין דעם מוסטער, טאָ וועט ער שטענדיק שטימען מיט אַ ליידיקן.
       *[other] `<matchesPattern>`: די פּאַראַמעטערס { $parameters } קומען ניט פֿאָר אין דעם מוסטער, טאָ וועלן זיי שטענדיק שטימען מיט אַ ליידיקן.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: מען קען ניט פֿאַרשטיין grid="{ $grid }". עס מוז זייַן none, medium, dense אָדער צוויי positive צאָלן געשיידט מיט אַ ליידיקן אָרט, למשל grid="1 0.5". קיין נעץ ווערט ניט געצייכנט.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" איז ניט געשטיצט אינעם prefigure־ווייַזער; עס ווערט גענוצט דאָס אויפֿפֿירן פֿון דער רעכטער פּאָזיציע.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" איז ניט געשטיצט אינעם prefigure־ווייַזער; עס ווערט גענוצט דאָס אויפֿפֿירן פֿון דער אויבערשטער פּאָזיציע.

prefigure-invalid-axis-bounds = `<graph>`: אומגילטיקע גרענעצן פֿון די אַקסן פֿאַר דער prefigure־איבערזעצונג; עס ווערט גענוצט דער פֿאַרפֿעלטער bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: אומגילטיקע ברייט פֿאַר דער prefigure־איבערזעצונג; עס ווערט גענוצט די פֿאַרפֿעלטע ברייט 425.

prefigure-invalid-aspect-ratio = `<graph>`: אומגילטיקער aspectRatio פֿאַר דער prefigure־איבערזעצונג; עס ווערט גענוצט די פֿאַרפֿעלטע פּראָפּאָרציע 1.

prefigure-grid-spacing-too-fine = `<graph>`: דער אָפּשטאַנד פֿון דער נעץ איז צו קליין פֿאַר די גרענעצן פֿון די אַקסן; די נעץ ווערט אויסגעלאָזט אינעם prefigure־ווייַזער.

prefigure-annotations-not-rendered = `<graph>`: אָנמערקונגען וועלן ניט געוויזן ווערן ווען מען נוצט ניט דעם PreFigure־ווייַזער.

multiple-annotations-children = מער ווי איין `<annotations>`־קינד איז געפֿונען געוואָרן אין `<graph>`; אַלע חוץ דעם לעצטן ווערן איגנאָרירט.

## Referring to other components

copy-unrecognized-component-type = מען קען ניט פֿאַרברייטערן אָדער קאָפּירן אַן אומבאַקאַנטן קאָמפּאָנענט־טיפּ: { $type }.

copy-prop-not-found = מען האָט ניט געפֿונען די אייגנשאַפֿט { $property } אויף אַ קאָמפּאָנענט פֿון טיפּ { $component }

collect-no-source = מען האָט ניט געפֿונען קיין מקור פֿאַר collect.

collect-invalid-component-type = מען קען ניט זאַמלען קאָמפּאָנענטן פֿון טיפּ `<{ $component }>` ווייַל דאָס איז אַן אומגילטיקער קאָמפּאָנענט־טיפּ.

reference-index-unavailable = מען קען ניט ווייַזן אויפֿן אינדעקס `{ $reference }`

## `<callAction>`

component-action-unavailable = מען קען ניט רופֿן { $action } אויף דער קאָמפּאָנענט `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = די דאַטן האָבן אַן אומגילטיקע פֿאָרעם. די רייען זייַנען ניט פֿון גלייַכער לענג. געפֿונען אין componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = די דאַטן האָבן איבערגעחזרטע זייַל־נעמען. געפֿונען אין componentIdx :{ $componentIdx }

data-frame-missing-column-name = די דאַטן פֿעלט אַ זייַל־נאָמען. געפֿונען אין componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = אַן award פֿאַר דעם ענטפֿער שטיצט זיך אויפֿן אייגענעם געשיקטן ענטפֿער פֿון דער answer־טעג, וואָס וועט פֿירן צו ניט־דערוואַרטן אויפֿפֿירן.

answer-max-num-attempts-in-section-wide-check-work = דאָס שטעלן `maxNumAttempts` אויף אַן `<answer>` אינעווייניק אין אַ בעהעלטער מיט `sectionWideCheckWork` האָט קיין ווירקונג ניט, ווייַל די צאָל פּרוּוון ווערט געפֿירט פֿונעם בעהעלטער. שטעלט `maxNumAttempts` אויפֿן בעהעלטער.

nested-section-wide-check-work-max-num-attempts = דאָס שטעלן `maxNumAttempts` אויף אַ בעהעלטער מיט `sectionWideCheckWork` וואָס געפֿינט זיך אינעווייניק אין אַן אַנדער בעהעלטער מיט `sectionWideCheckWork` האָט קיין ווירקונג ניט, ווייַל די צאָל פּרוּוון ווערט געפֿירט פֿונעם אויסווייניקסטן בעהעלטער. שטעלט `maxNumAttempts` אויפֿן אויסווייניקסטן בעהעלטער.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] דער אַטריבוט { $attributes } וועט קיין ווירקונג ניט האָבן אָן symbolicEquality.
       *[other] די אַטריבוטן { $attributes } וועלן קיין ווירקונג ניט האָבן אָן symbolicEquality.
    }

answer-invalid-type = אומגילטיקער טיפּ פֿאַרן ענטפֿער: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = אַזוי ווי די קאָמפּאָנענט `<{ $component }>` האָט ניט קיין נאָמען, קען זי ניט גענוצט ווערן פֿאַר אַן אַטריבוט פֿון אַ מאָדול

module-attribute-name-already-defined = די קאָמפּאָנענט `<{ $component } name="{ $name }">` קען ניט גענוצט ווערן ווי אַן אַטריבוט פֿאַר אַ מאָדול ווייַל דער קאָמפּאָנענט־טיפּ `<module>` האָט שוין אַן אַטריבוט "{ $name }".

conditional-content-condition-ignored = דער אַטריבוט `condition` ווערט איגנאָרירט אויף אַ `<conditionalContent>` מיט case־ אָדער else־קינדער.

slider-markers-type-mismatch = דער טיפּ פֿון די צייכנס שטימט ניט מיטן טיפּ פֿונעם שיבער.

pretzel-problem-needs-statement-and-answer = אומגילטיקער pretzel: יעדער `<problem>` מוז אַנטהאַלטן איין `<statement>` און איין `<answer>`.

pretzel-circuit-first-problem-distractor = אומגילטיקער pretzel: אין mode="circuit" קען דער ערשטער `<problem>` ניט זייַן קיין אָפּנאַרער.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] אומגילטיקער ווערט { $values } פֿאַרן אַטריבוט `{ $attribute }`; ער ווערט איגנאָרירט.
       *[other] אומגילטיקע ווערטן { $values } פֿאַרן אַטריבוט `{ $attribute }`; זיי ווערן איגנאָרירט.
    }

attribute-must-be-references = אומגילטיקער ווערט `{ $value }` פֿאַרן אַטריבוט `{ $attribute }`. דער אַטריבוט מוז זייַן צונויפֿגעשטעלט פֿון רעפֿערענצן וואָס הייבן זיך אָן מיט אַ `$`.

math-input-invalid-function-names = <mathInput>: אומגילטיקע פֿונקציע־נעמען אין { $attribute } זייַנען איגנאָרירט געוואָרן: { $names }. דער ווייַז־טייל פֿון יעדן נאָמען מוז זייַן לפּחות 2 צייכנס (בוכשטאַבן אָדער שטריכן); נאָך אים מעג קומען אַ באַגלייטיקער סופֿיקס `|<mathspeak אַלטערנאַטיוו>`.

## Building components from the source

component-type-invalid = אומגילטיקער קאָמפּאָנענט־טיפּ: `<{ $componentType }>`

attribute-repeated = מען קען דעם אַטריבוט { $attribute } ניט איבערחזרן.

attribute-invalid-for-component = אומגילטיקער אַטריבוט "{ $attribute }" פֿאַר אַ קאָמפּאָנענט פֿון טיפּ `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    די סטיל־דעפֿיניציע { $styleNumber } האָט ניט גענוג קאָנטראַסט פֿאַר { $context ->
        [text-on-background] דער טעקסט־קאָליר קעגן דעם הינטערגרונט־קאָליר
        [high-contrast] דעם הויך־קאָנטראַסטיקן קאָליר קעגן דער לייַוונט
        [line] דעם ליניע־קאָליר קעגן דער לייַוונט
        [marker] דעם צייכן־קאָליר קעגן דער לייַוונט
       *[text-on-canvas] דעם טעקסט־קאָליר קעגן דער לייַוונט
    }{ $mode ->
        [dark] { " (טונקעלער מאָדע)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; עס פֿאָדערט זיך לפּחות { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    כאָטש די סטיל־דעפֿיניציע { $styleNumber } האָט אָנגעגעבענע קאָלירן מיט גענוג קאָנטראַסט פֿאַר דער ליכטיקער מאָדע, האָבן די קאָלירן פֿאַר דער טונקעלער מאָדע וואָס ווערן דערפֿון אויסגערעכנט ניט גענוג קאָנטראַסט פֿונעם טעקסט־קאָליר קעגן דעם הינטערגרונט־קאָליר ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; עס פֿאָדערט זיך לפּחות { $threshold }:1). { $suggestion ->
        [available] כּדי צו פֿאַרזיכערן גענוג קאָנטראַסט אין דער טונקעלער מאָדע, פֿאַרגרעסערט דעם קאָנטראַסט פֿון דער ליכטיקער מאָדע (למשל שטעלט { $lightAttribute }="{ $lightColor }") אָדער זייַט גובֿר אויפֿן קאָליר פֿון דער טונקעלער מאָדע (למשל שטעלט { $darkAttribute }="{ $darkColor }").
       *[none] כּדי צו פֿאַרזיכערן גענוג קאָנטראַסט אין דער טונקעלער מאָדע, פֿאַרגרעסערט דעם קאָנטראַסט פֿון דער ליכטיקער מאָדע אָדער זייַט גובֿר אויף די אויסגערעכנטע קאָלירן מיט textColorDarkMode און/אָדער backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    כאָטש די סטיל־דעפֿיניציע { $styleNumber } האָט אַן אָנגעגעבענעם טעקסט־קאָליר מיט גענוג קאָנטראַסט פֿאַר דער ליכטיקער מאָדע, האָט דער טעקסט־קאָליר פֿאַר דער טונקעלער מאָדע וואָס ווערט דערפֿון אויסגערעכנט ניט גענוג קאָנטראַסט קעגן דער לייַוונט ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; עס פֿאָדערט זיך לפּחות { $threshold }:1). { $suggestion ->
        [available] כּדי צו פֿאַרזיכערן גענוג קאָנטראַסט אין דער טונקעלער מאָדע, פֿאַרגרעסערט דעם קאָנטראַסט פֿון דער ליכטיקער מאָדע (למשל שטעלט textColor="{ $lightColor }") אָדער זייַט גובֿר אויפֿן קאָליר פֿון דער טונקעלער מאָדע (למשל שטעלט textColorDarkMode="{ $darkColor }").
       *[none] כּדי צו פֿאַרזיכערן גענוג קאָנטראַסט אין דער טונקעלער מאָדע, פֿאַרגרעסערט דעם קאָנטראַסט פֿון דער ליכטיקער מאָדע אָדער זייַט גובֿר אויפֿן אויסגערעכנטן קאָליר מיט textColorDarkMode.
    }

section-multiple-style-palettes = אַן אָפּטייל קען אויסקלייַבן בלויז איין <stylePalette>; עס ווערט גענוצט דער לעצטער.

## Unique variants

variant-num-to-select-not-non-negative-integer = מען קען ניט באַשטימען די אייגנאַרטיקע וואַריאַנטן פֿון { $component } ווייַל numToSelect איז ניט קיין ניט־נעגאַטיווע גאַנצע צאָל.

variant-num-to-select-not-constant-number = מען קען ניט באַשטימען די אייגנאַרטיקע וואַריאַנטן פֿון { $component } ווייַל numToSelect איז ניט קיין קאָנסטאַנטע צאָל.

variant-with-replacement-not-constant-boolean = מען קען ניט באַשטימען די אייגנאַרטיקע וואַריאַנטן פֿון { $component } ווייַל withReplacement איז ניט קיין קאָנסטאַנטער boolean.

variant-select-weight-disables-unique = אייגנאַרטיקע וואַריאַנטן פֿאַר select זייַנען אָפּגעשטעלט אויב אַן אָפּציע האָט אַן אָנגעגעבענעם selectWeight אָדער selectForVariants

variant-coprime-undetermined = מען קען ניט באַשטימען די אייגנאַרטיקע וואַריאַנטן פֿון { $component } ווייַל מען קען ניט באַשטימען אַז coprime איז שטענדיק פֿאַלש.

variant-attribute-not-constant = מען קען ניט באַשטימען די אייגנאַרטיקע וואַריאַנטן פֿון { $component } ווייַל { $attribute } איז ניט קיין קאָנסטאַנטע.

variant-attribute-not-number = מען קען ניט באַשטימען די אייגנאַרטיקע וואַריאַנטן פֿון { $component } ווייַל { $attribute } איז ניט קיין צאָל.

variant-attribute-wrong-type-for-sequence =
    מען קען ניט באַשטימען די אייגנאַרטיקע וואַריאַנטן פֿון { $component } פֿון טיפּ { $type } ווייַל { $attribute } איז ניט { $expected ->
        [letters-combination] קיין קאָמבינאַציע פֿון בוכשטאַבן
        [math-expression] קיין גילטיקער מאַטעמאַטישער אויסדרוק
        [integer] קיין גאַנצע צאָל
       *[number] קיין צאָל
    }.

variant-length-not-integer = מען קען ניט באַשטימען די אייגנאַרטיקע וואַריאַנטן פֿון { $component } ווייַל length איז ניט קיין גאַנצע צאָל.

variant-sort-not-implemented = אייגנאַרטיקע וואַריאַנטן פֿון אַ { $component } מיט sort זייַנען ניט אויסגעפֿירט

variant-exclude-combinations-not-implemented = אייגנאַרטיקע וואַריאַנטן פֿון אַ { $component } מיט excludeCombinations זייַנען ניט אויסגעפֿירט

variant-math-exclude-not-implemented = אייגנאַרטיקע וואַריאַנטן פֿון אַ { $component } פֿון טיפּ math מיט exclude זייַנען ניט אויסגעפֿירט

variant-non-constant-exclude-not-implemented = אייגנאַרטיקע וואַריאַנטן פֿון אַ { $component } מיט אַ ניט־קאָנסטאַנטן exclude זייַנען ניט אויסגעפֿירט

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ניט געשטיצט אינעם prefigure־ווייַזער פֿאַרן גראַף; דער אָפּשטאַמיקער ווערט איבערגעהיפּט.

prefigure-descendant-invalid-geometry = { $subject }: ניט־ענדלעכע אָדער ניט־פֿולע געאָמעטריע; דער אָפּשטאַמיקער ווערט איבערגעהיפּט.

prefigure-curve-label-omitted = { $subject }: צייכנס זייַנען ניט געשטיצט אויף פֿאַרוואַנדלטע קרומע־עלעמענטן; דער צייכן ווערט אויסגעלאָזט.

prefigure-curve-unsupported-definition-type = { $subject }: ניט־געשטיצטער טיפּ פֿון קרומע־פֿונקציע־דעפֿיניציע '{ $definitionType }'; דער אָפּשטאַמיקער ווערט איבערגעהיפּט.

prefigure-region-flip-functions-unsupported = { $subject }: ניט־געשטיצטער אַטריבוט flipFunctions אויף regionBetweenCurves; דער אָפּשטאַמיקער ווערט איבערגעהיפּט.

prefigure-region-non-formula-child = { $subject }: אויף regionBetweenCurves זייַנען געשטיצט בלויז קינד־פֿונקציעס וואָס זייַנען געגעבן מיט אַ פֿאָרמל; דער אָפּשטאַמיקער ווערט איבערגעהיפּט.

prefigure-label-position-unsupported =
    { $subject }: ניט־געשטיצטער labelPosition '{ $labelPosition }' פֿאַר { $labelKind ->
        [line-family] אַ צייכן פֿון דער ליניע־משפּחה
       *[point] אַ פּונקט־צייכן
    }; עס ווערט גענוצט די פֿאַרפֿעלטע PreFigure־אויסגלייַכונג.

prefigure-fill-style-unsupported = { $subject }: דער אָנפֿיל־סטיל '{ $fillStyle }' איז ניט געשטיצט פֿון PreFigure; עס ווערט גענוצט אַ פֿולער אָנפֿיל.

prefigure-line-style-unknown = { $subject }: אומבאַקאַנטער ליניע־סטיל '{ $lineStyle }' איז אויסגעלאָזט געוואָרן פֿונעם PreFigure־אַרויסגאָב.

prefigure-marker-style-mapped-to-diamond = { $subject }: דער צייכן־סטיל '{ $markerStyle }' איז איבערגעטראָגן געוואָרן אויפֿן PreFigure־סטיל 'diamond'.

prefigure-marker-style-unsupported = { $subject }: דער צייכן־סטיל '{ $markerStyle }' איז ניט געשטיצט פֿון PreFigure; עס ווערט גענוצט דער פֿאַרפֿעלטער סטיל.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: אומגילטיקער `ref`; מען קען דעם ציל ניט אויסלייזן. די אָנמערקונג ווערט אויסגעלאָזט.

annotation-ref-multiple-targets = `<annotation>`: `ref` האָט זיך אויסגעלייזט אין מער ווי איין ציל; עס ווערט גענוצט דער ערשטער.

annotation-ref-outside-graph = `<annotation>`: אומגילטיקער `ref`; דער ציל איז אויסן פֿונעם גראַף וואָס אַנטהאַלט אים. די אָנמערקונג ווערט אויסגעלאָזט.

annotation-ref-unsupported-target = `<annotation>`: אומגילטיקער `ref`; דער ציל איז ניט קיין געשטיצטער גראַפֿישער אָביעקט אין דער prefigure־איבערזעצונג. די אָנמערקונג ווערט אויסגעלאָזט.

annotation-text-missing = `<annotation>`: `text` פֿעלט אָדער איז ליידיק; עס ווערט אַרויסגעגעבן אַ ליידיקער טעקסט.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] אַן אַרומיקע אָפּהענגיקייט איז אַנטדעקט געוואָרן.
       *[other] אַן אַרומיקע אָפּהענגיקייט מיט אַ `<{ $componentType }>` קאָמפּאָנענט איז אַנטדעקט געוואָרן.
    }

reference-no-referent = קיין אָביעקט איז ניט געפֿונען געוואָרן פֿאַר דער רעפֿערענץ: `{ $reference }`

reference-multiple-referents = מער ווי איין אָביעקט איז געפֿונען געוואָרן פֿאַר דער רעפֿערענץ: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = אומגילטיקער פֿאָרמאַט פֿאַרן אַטריבוט { $attribute } פֿון `<{ $componentType }>`.

children-invalid = אומגילטיקע קינדער פֿאַר `<{ $componentType }>`: געפֿונען אומגילטיקע קינדער: { $children }

## Falling back to a default

attribute-value-invalid-using-default = אומגילטיקער ווערט `{ $value }` פֿאַרן אַטריבוט `{ $attribute }`, עס ווערט גענוצט דער ווערט `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] די DoenetML־ווערסיע { $version } איז ניט געפֿונען געוואָרן.
       *[other] די DoenetML־ווערסיע { $version } איז ניט געפֿונען געוואָרן. עס ווערט גענוצט ווערסיע { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = אומגילטיקער DoenetML: { $content }

parse-tag-missing-close-tag = אומגילטיקער DoenetML: די טעג `{ $tag }` האָט קיין שליסנדיקע טעג ניט. עס האָט זיך געריכט אויף אַ זעלבסט־שליסנדיקער טעג אָדער אויף אַ `</{ $tagName }>` טעג.

parse-tag-error = אומגילטיקער DoenetML: אַ טעות אין דער טעג `<{ $tagName }>`

parse-attribute-missing-value = אומגילטיקער DoenetML: דעם אומגילטיקן אַטריבוט `{ $attribute }` פֿעלט אַ פּנים אַ ווערט.

parse-attribute-invalid = אומגילטיקער DoenetML: אומגילטיקער אַטריבוט `{ $attribute }`

parse-attribute-value-invalid = אומגילטיקער DoenetML: אומגילטיקער אַטריבוט־ווערט `{ $value }`

parse-attribute-value-quote-mismatch = אומגילטיקער DoenetML: אומגילטיקער אַטריבוט־ווערט `{ $value }`. די גענדזנפֿיסלעך שטימען ניט. עס פֿעלט אַ פּנים אַ `{ $quote }`

parse-open-tag-name-missing = אומגילטיקער DoenetML: געפֿונען אַ טעג אָן אַ נאָמען, למשל `<`

parse-tag-not-closed = אומגילטיקער DoenetML: די טעג `{ $tag }` איז ניט פֿאַרמאַכט געוואָרן (עס פֿעלט אַ פּנים אַ `>`).

parse-self-closing-tag-name-missing = אומגילטיקער DoenetML: געפֿונען אַ טעג אָן אַ נאָמען `<{ $content }>`

parse-self-closing-tag-not-closed = אומגילטיקער DoenetML: די טעג `{ $tag }` איז ניט פֿאַרמאַכט געוואָרן (עס פֿעלט אַ פּנים `/>`).

parse-tag-invalid-attributes = אומגילטיקער DoenetML: די טעג `{ $tag }` איז ניט גילטיק. זי האָט אפֿשר אומגילטיקע אַטריבוטן.

parse-close-tag-name-missing = אומגילטיקער DoenetML: געפֿונען אַ שליסנדיקע טעג אָן אַ נאָמען, למשל `</`

parse-attribute-value-unquoted = אַטריבוט־ווערטן מוזן שטיין אין גענדזנפֿיסלעך: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = אומגילטיקער DoenetML: געפֿונען אַ שליסנדיקע טעג `{ $tag }`, אָבער קיין פּאַסיקע עפֿנדיקע טעג ניטאָ

parse-close-tag-mismatched = אומגילטיקער DoenetML: ניט־שטימיקע שליסנדיקע טעג. עס האָט זיך געריכט אויף `</{ $expected }>`. געפֿונען `{ $found }`

parser-node-unconvertible = מען האָט ניט געקענט פֿאַרוואַנדלען דעם קנופּ { $node } אין אַ Dast־קנופּ.

## Names

name-attribute-invalid =
    אומגילטיקער אַטריבוט name='{ $name }'. { $reason ->
        [characters] נעמען מעגן אַנטהאַלטן בלויז בוכשטאַבן, ציפֿערן, אונטערשטריכן אָדער שטריכן.
       *[start] נעמען מוזן זיך אָנהייבן מיט אַ בוכשטאַב.
    }

component-name-invalid-start = אומגילטיקער קאָמפּאָנענט־נאָמען "{ $name }". נעמען מוזן זיך אָנהייבן מיט אַ בוכשטאַב.

## `<answer>` sugar

answer-video-watched-missing-video = אַן answer פֿון טיפּ videoWatched מוז האָבן אַן אַטריבוט video

answer-video-watched-video-not-reference = אַן answer פֿון טיפּ videoWatched מוז האָבן אַן אַטריבוט video וואָס איז אַ רעפֿערענץ

answer-name-not-single-text = דער אַטריבוט name פֿון אַן answer מוז האָבן איין טעקסט־קינד

## Referencing another document

external-doenetml-recursion-limit = מען קען ניט באַקומען דעם אויסווייניקסטן DoenetML צוליב צו פֿיל ניוואָען רעקורסיע. איז דאָ אַן אַרומיקע רעפֿערענץ?

external-doenetml-unavailable = מען קען ניט באַקומען קיין DoenetML פֿון { $attribute }="{ $uri }"

external-doenetml-type-mismatch = אומגילטיקער DoenetML באַקומען פֿון { $attribute }="{ $uri }": ער האָט ניט געשטימט מיטן קאָמפּאָנענט־טיפּ "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] דער אַטריבוט `{ $from }` איז פֿאַרעלטערט; נוצט בעסער `{ $to }`.
       *[other] [deprecation] דער אַטריבוט `{ $from }` אויף `<{ $component }>` איז פֿאַרעלטערט; נוצט בעסער `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] דער אַטריבוט `{ $from }` איז פֿאַרעלטערט און ווערט איגנאָרירט ווייַל `{ $to }` איז אויך אָנגעגעבן.
       *[other] [deprecation] דער אַטריבוט `{ $from }` אויף `<{ $component }>` איז פֿאַרעלטערט און ווערט איגנאָרירט ווייַל `{ $to }` איז אויך אָנגעגעבן.
    }

deprecated-attribute-ignored = [deprecation] דער אַטריבוט `{ $attribute }` אויף `<{ $component }>` איז פֿאַרעלטערט און ווערט איגנאָרירט.

deprecated-attribute-to-child = [deprecation] דער אַטריבוט `{ $attribute }` אויף `<{ $component }>` איז פֿאַרעלטערט; נוצט בעסער אַ `<{ $child }>` קינד.

deprecated-attribute-value-renamed = [deprecation] דער ווערט `{ $value }` פֿונעם אַטריבוט `{ $attribute }` אויף `<{ $component }>` איז פֿאַרעלטערט; נוצט בעסער `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` קען שאַפֿן אַ מערצאָל בלויז אויף ענגליש, טאָ בלייַבט זייַן טעקסט אומבאַטן אין אַ דאָקומענט געשריבן אויף { $locale }. שרייַבט די מערצאָל־פֿאָרעם דירעקט, אָדער גיט זי אָן מיטן אַטריבוט `pluralForm`.


## Checking against the schema

schema-element-unrecognized = דער עלעמענט `<{ $tag }>` איז ניט קיין דערקענטער Doenet־עלעמענט.

schema-element-not-allowed-at-root = דער עלעמענט `<{ $tag }>` איז ניט דערלויבט בייַם וואָרצל פֿונעם דאָקומענט.

schema-element-not-allowed-inside = דער עלעמענט `<{ $tag }>` איז ניט דערלויבט אינעווייניק אין `<{ $parent }>`.

schema-attribute-unrecognized = דער עלעמענט `<{ $tag }>` האָט ניט קיין אַטריבוט מיטן נאָמען `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] דער אַטריבוט `{ $attribute }` פֿונעם עלעמענט `<{ $tag }>` מוז זייַן אַ רשימה וווּ יעדער גליד איז איינס פֿון: { $allowed }
       *[other] דער אַטריבוט `{ $attribute }` פֿונעם עלעמענט `<{ $tag }>` מוז זייַן איינס פֿון: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = אומגילטיקער וואַריאַנט־נאָמען פֿאַר select. דער וואַריאַנט־נאָמען { $variantName } קומט פֿאָר אין { $numOptions } אָפּציעס, און די צאָל צו קלייַבן איז { $numToSelect }.

select-variant-name-without-options = פֿאַר select זייַנען אָנגעגעבן טייל וואַריאַנטן, אָבער קיין אָפּציעס זייַנען ניט אָנגעגעבן פֿאַרן מעגלעכן וואַריאַנט־נאָמען: { $variantName }.

select-variant-name-not-possible = דער וואַריאַנט־נאָמען { $variantName } וואָס איז אָנגעגעבן פֿאַר select איז ניט קיין מעגלעכער וואַריאַנט־נאָמען.

select-too-few-options = מען קען ניט קלייַבן { $numToSelect } קאָמפּאָנענטן פֿון בלויז { $numOptions }.

select-from-sequence-too-few-values = מען קען ניט קלייַבן { $numToSelect } ווערטן פֿון אַ סעקווענץ פֿון לענג { $length }.

select-from-sequence-indices-count-mismatch = די צאָל אינדעקסן אָנגעגעבן פֿאַר select מוז שטימען מיט דער צאָל צו קלייַבן

select-from-sequence-indices-not-integers = אַלע אינדעקסן אָנגעגעבן פֿאַר select מוזן זייַן גאַנצע צאָלן

select-from-sequence-index-excluded = אַן אָנגעגעבענער אינדעקס פֿון selectfromsequence איז אויסגעשלאָסן געוואָרן

select-from-sequence-indices-excluded-combination = די אָנגעגעבענע אינדעקסן פֿון selectfromsequence זייַנען געווען אַן אויסגעשלאָסענע קאָמבינאַציע

select-from-sequence-coprime-not-positive-integers = מען קען ניט קלייַבן קיין רעלאַטיוו פּרימע קאָמבינאַציעס ווייַל מען קלייַבט ניט קיין positive גאַנצע צאָלן.

select-from-sequence-coprime-common-factor = מען קען ניט קלייַבן קיין רעלאַטיוו פּרימע צאָלן. אַלע מעגלעכע ווערטן האָבן אַ געמיינזאַמען פֿאַקטאָר. (די אָנגעגעבענע ווערטן פֿון "from" אָדער "to" מוזן זייַן רעלאַטיוו פּרים מיט "step".)

select-from-sequence-coprime-single-number = מען קען ניט קלייַבן קיין רעלאַטיוו פּרימע קאָמבינאַציעס פֿון איין צאָל וואָס איז ניט 1.

select-from-sequence-excluded-too-many-combinations = אין selectFromSequence זייַנען אויסגעשלאָסן געוואָרן מער ווי 70% פֿון די קאָמבינאַציעס

select-from-sequence-coprime-none-found = מען האָט ניט געקענט קלייַבן קיין רעלאַטיוו פּרימע צאָלן. אַלע מעגלעכע ווערטן האָבן אַ געמיינזאַמען פֿאַקטאָר.

select-from-sequence-too-few-unique-values = מען קען ניט קלייַבן { $numToSelect } אייגנאַרטיקע ווערטן פֿון אַ סעקווענץ פֿון לענג { $numPossibleValues }

select-prime-numbers-too-few-values = מען קען ניט קלייַבן { $numToSelect } ווערטן פֿון אַ רשימה פּרימצאָלן פֿון לענג { $numValues }

select-prime-numbers-values-count-mismatch = די צאָל ווערטן אָנגעגעבן פֿאַר select מוז שטימען מיט דער צאָל צו קלייַבן

select-prime-numbers-values-not-prime = אַלע ווערטן אָנגעגעבן פֿאַר select פֿון פּרימצאָלן מוזן זייַן אין דער רשימה פּרימצאָלן

select-prime-numbers-values-excluded-combination = די אָנגעגעבענע ווערטן פֿון selectPrimeNumbers זייַנען געווען אַן אויסגעשלאָסענע קאָמבינאַציע

select-prime-numbers-excluded-too-many-combinations = אין selectPrimeNumbers זייַנען אויסגעשלאָסן געוואָרן מער ווי 70% פֿון די קאָמבינאַציעס

select-random-combination-fluke = דורך אַ העכסט אומגלייבלעכן צופֿאַל האָט מען ניט געקענט קלייַבן קיין קאָמבינאַציע פֿון צופֿעליקע ווערטן

select-random-value-fluke = דורך אַ העכסט אומגלייבלעכן צופֿאַל האָט מען ניט געקענט קלייַבן קיין צופֿעליקן ווערט
