# Hebrew warnings and errors. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `through`, `endpoint`, `midpointOffset`, `numDimensions` and the like are
# DoenetML attribute names. They are part of the language, not prose, and are
# left in English exactly as written.
#
# Brackets, quotes and punctuation are the same characters as in English and
# are written opening-first, in logical order; the bidi algorithm turns them
# around when the text is drawn.
#
# Hebrew's one-letter prefixes — «ב», «ל», «כ», «ה», «ו» — attach to the word
# after them, and an argument is not a word. A message that in English reads
# "for `<{ $component }>`" therefore names what the argument is instead, and a
# prefix that has to meet a Latin-script name is written with a maqaf, «ב־»,
# which is what Hebrew does with a foreign word.
#
# Where English distinguishes a singular from a plural only in the verb — "is
# ignored" against "are ignored" — Hebrew says one thing, and the select is
# dropped rather than written out twice identically. The count argument then
# goes unused, which is harmless: it stays in the English message for the
# languages that need it.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } לא נלקח בחשבון כאשר מצוינות שתי נקודות קצה

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } לא נלקח בחשבון כאשר מצוינות גם נקודת קצה וגם נקודת אמצע

line-segment-midpoint-offset-without-midpoint = ל־midpointOffset אין השפעה בלי נקודת אמצע

## `<line>`

line-points-undetermined-dimensions = ישר העובר בנקודות שממדיהן לא נקבעו.

line-points-too-few-dimensions = ישר חייב לעבור בנקודות בעלות שני ממדים לפחות.

line-points-depend-on-variables = הישר עובר בנקודות התלויות במשתנים: { $variables }.

line-equation-invalid-format = תבנית לא תקינה למשוואת ישר במשתנים { $variable1 } ו־{ $variable2 }.

## `<ray>`

ray-overprescribed-through = הקרן מוגדרת באמצעות through, endpoint ו־direction. הערך של through לא ילקח בחשבון.

ray-dimension-mismatch = אי־התאמה ב־numDimensions בקרן.

## `<vector>`

vector-overprescribed-head = הווקטור מוגדר באמצעות head, tail ו־displacement. הערך של head לא ילקח בחשבון.

vector-dimension-mismatch = אי־התאמה ב־numDimensions בווקטור.

## Attracting and constraining

attract-to-without-nearest-point = אי אפשר להימשך אל `<{ $component }>` כי אין לו משתנה מצב nearestPoint.

constrain-to-without-nearest-point = אי אפשר להגביל אל `<{ $component }>` כי אין לו משתנה מצב nearestPoint.

constrain-to-interior-without-nearest-point = אי אפשר להגביל אל פנים `<{ $component }>` כי אין לו משתנה מצב nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition לא נלקח בחשבון ב־choiceInput שאינו בשורה

## Ordering children by index

choice-input-indices-count-mismatch = indices שצוינו ב־choiceInput לא נלקחים בחשבון כי מספר האינדקסים אינו תואם את מספר הצאצאים מסוג choice.

pretzel-indices-count-mismatch = indices שצוינו ב־problem לא נלקחים בחשבון כי מספר האינדקסים אינו תואם את מספר הצאצאים מסוג problem.

shuffle-indices-count-mismatch = indices שצוינו ב־shuffle לא נלקחים בחשבון כי מספר האינדקסים אינו תואם את מספר הרכיבים.

indices-ignored-out-of-range = indices שצוינו ב־{ $component } לא נלקחים בחשבון כי חלק מהאינדקסים מחוץ לתחום.

pretzel-indices-repeated = indices שצוינו ב־pretzel לא נלקחים בחשבון כי חלק מהאינדקסים חוזרים.

pretzel-circuit-first-index = indices שצוינו ב־pretzel במצב circuit לא נלקחים בחשבון כי האינדקס הראשון חייב להיות 1.

## `<shuffle>` and `<sort>`

string-children-need-type = כדי ש־`<{ $component }>` יעבוד עם צאצאי מחרוזת, יש לציין את המאפיין type.

invalid-type-defaulting-to-math = הסוג { $type } אינו תקין לרכיב { $component }. עליו להיות math, text, number או boolean. ייעשה שימוש ב־math.

string-not-valid-component-to-arrange = המחרוזת "{ $value }" אינה רכיב תקין ש־{ $component } יכול לסדר. היא לא תילקח בחשבון.

## Types and variables

invalid-type-defaulting-to-number = הסוג { $type } אינו תקין; הסוג נקבע ל־number.

invalid-variable-value = ערך לא תקין של משתנה: `{ $value }`

## Variants

variant-index-must-be-number = אינדקס הגרסה { $index } חייב להיות מספר

variant-index-must-be-integer = אינדקס הגרסה { $index } חייב להיות מספר שלם

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` לא מומש עבור מידות מוחלטות. הרוחבים נקבעים כיחסיים.

side-by-side-absolute-margins = `<{ $component }>` לא מומש עבור מידות מוחלטות. השוליים נקבעים כיחסיים.

side-by-side-no-block-child = `<{ $component }>` לא תקין: עליו להכיל לפחות צאצא אחד מסוג בלוק.

## `<label>`

label-for-ignored-on-graphical = המאפיין `for` על `<label>` גרפי לא נלקח בחשבון.

label-for-must-resolve-to-one = המאפיין `for` על `<label>` חייב להצביע על רכיב אחד בדיוק.

label-for-unresolved = לא ניתן היה לקשר את המאפיין `for` שעל `<label>` לרכיב כלשהו.

label-for-answer-with-authored-inputs = המאפיין `for` על `<label>` מפנה אל `<answer>` שהקלטים שלו נכתבו במפורש; יש להפנות ישירות אל הקלט.

label-for-answer-without-input = המאפיין `for` על `<label>` מפנה אל `<answer>` שאין לו קלט לתייג.

label-for-must-reference-input-or-answer = המאפיין `for` על `<label>` חייב להפנות אל קלט או אל `<answer>`.

## Accessibility

accessibility-short-description-or-decorative = למען הנגישות, ל־`<{ $component }>` חייב להיות תיאור קצר, או שיוגדר כדקורטיבי.

accessibility-video-short-description = למען הנגישות, ל־`<video>` חייב להיות תיאור קצר.

accessibility-input-short-description-or-label = למען הנגישות, ל־`<{ $component }>` חייב להיות תיאור קצר או תווית.

accessibility-answer-input-short-description-or-label = למען הנגישות, ל־`<answer>` שיוצר קלט חייב להיות תיאור קצר או תווית.

accessibility-short-description-contains-math = תיאור קצר אינו אמור להכיל רכיבים מתמטיים כמו `<{ $component }>`. יש לכתוב את המתמטיקה במילים.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] הניגודיות של { $colorName } אינה מספקת לטקסט של כותרת הסעיף (מצב כהה) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; נדרש לפחות { $threshold }:1).
       *[other] הניגודיות של { $colorName } אינה מספקת לטקסט של כותרת הסעיף ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; נדרש לפחות { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` העובר ב־{ $count } נקודות לא מומש כאשר לנקודות אין ערכים מספריים.

circle-too-many-through-points = אי אפשר לחשב מעגל העובר ביותר מ־3 נקודות.

circle-overprescribed-radius-center-points = אי אפשר לחשב מעגל עם רדיוס, מרכז ונקודות מעבר שכולם צוינו.

circle-center-with-multiple-points = אי אפשר לחשב מעגל עם מרכז נתון העובר ביותר מנקודה אחת.

circle-radius-too-small = אי אפשר לחשב את המעגל: מאחר שהמרחק בין שתי הנקודות הוא { $distance }, הרדיוס שצוין { $radius } קטן מדי.

circle-radius-with-many-points = אי אפשר ליצור מעגל העובר ביותר משתי נקודות עם רדיוס נתון.

circle-invalid-center-or-through-points = המרכז או נקודות המעבר של המעגל אינם תקינים.

circle-radius-center-with-multiple-points = אי אפשר לחשב את רדיוס המעגל עם מרכז נתון העובר ביותר מנקודה אחת.

circle-change-radius-non-numerical = אי אפשר לשנות את רדיוס המעגל העובר בנקודות לא מספריות

circle-radius-with-points-non-numerical = אי אפשר ליצור מעגל העובר ביותר מנקודה אחת עם רדיוס נתון כאשר אין ערכים מספריים.

circle-change-center-non-numerical = שינוי מרכז של מעגל העובר בנקודות לא מספריות לא מומש.

## `<function>`

function-domain-insufficient-dimensions =
    אין די ממדים לתחום של הפונקציה. בתחום יש { $intervals ->
        [one] קטע אחד
        [two] שני קטעים
       *[other] { $intervals } קטעים
    }, ואילו לפונקציה יש { $inputs ->
        [one] קלט אחד
        [two] שני קלטים
       *[other] { $inputs } קלטים
    }.

function-domain-invalid-format = תבנית לא תקינה לתחום של הפונקציה.

function-ignoring-non-numerical =
    { $type ->
        [maximum] המקסימום הלא מספרי של הפונקציה לא נלקח בחשבון.
        [minimum] המינימום הלא מספרי של הפונקציה לא נלקח בחשבון.
        [extremum] נקודת הקיצון הלא מספרית של הפונקציה לא נלקחה בחשבון.
        [point] הנקודה הלא מספרית של הפונקציה לא נלקחה בחשבון.
        [slope] השיפוע הלא מספרי של הפונקציה לא נלקח בחשבון.
       *[other] { $type } לא מספרי של הפונקציה לא נלקח בחשבון.
    }

function-ignoring-empty =
    { $type ->
        [maximum] המקסימום הריק של הפונקציה לא נלקח בחשבון.
        [minimum] המינימום הריק של הפונקציה לא נלקח בחשבון.
        [extremum] נקודת הקיצון הריקה של הפונקציה לא נלקחה בחשבון.
        [point] הנקודה הריקה של הפונקציה לא נלקחה בחשבון.
       *[other] { $type } ריק של הפונקציה לא נלקח בחשבון.
    }

function-points-too-close = בפונקציה יש שתי נקודות שמיקומיהן קרובים מדי זה לזה. אי אפשר להגדיר את הפונקציה.

function-iterates-input-output-mismatch =
    איטרציות של פונקציה אפשריות רק אם מספר הקלטים שווה למספר הפלטים. לפונקציה הזאת יש { $inputs ->
        [one] קלט אחד
        [two] שני קלטים
       *[other] { $inputs } קלטים
    } ו־{ $outputs ->
        [one] פלט אחד
        [two] שני פלטים
       *[other] { $outputs } פלטים
    }.

## `<sequence>`

sequence-invalid-length = אורך הסדרה אינו תקין. עליו להיות מספר שלם אי־שלילי.

sequence-invalid-step = צעד הסדרה אינו תקין. לסדרה מסוג { $type } עליו להיות מספר.

sequence-invalid-endpoint-number = הערך "{ $attribute }" של סדרת מספרים אינו תקין. עליו להיות מספר.

sequence-invalid-endpoint-letters = הערך "{ $attribute }" של סדרת אותיות אינו תקין. עליו להיות צירוף של אותיות.

sequence-invalid-endpoint = הערך "{ $attribute }" של הסדרה אינו תקין.

select-from-sequence-coprime-not-numbers = coprime לא נלקח בחשבון כי הבחירה אינה מתוך מספרים

select-from-sequence-coprime-with-exclude-combinations = coprime לא נלקח בחשבון כי צוין excludeCombinations

## Resolving a `target`

target-not-found = ערך target לא תקין ב־`<{ $source }>`: היעד לא נמצא.

target-state-variable-not-found = ערך target לא תקין ב־`<{ $source }>`: לא נמצא משתנה מצב בשם "{ $property }" על `<{ $component }>`.

## `<odeSystem>`

# «האגף הימני» is the right-hand side of the equation and stays the right one:
# mathematics is a left-to-right island inside a Hebrew document, so the
# equation the phrase names is drawn the same way round as in English.
ode-system-variables-match-independent = המשתנים של `<odeSystem>` חייבים להיות שונים מהמשתנה הבלתי תלוי.

ode-system-duplicate-variable-names = אי אפשר להגדיר את פונקציות האגף הימני של המשוואה הדיפרנציאלית עם שמות משתנים תלויים חוזרים.

ode-system-rhs-function-error = אי אפשר להגדיר את פונקציית האגף הימני של המשוואה הדיפרנציאלית. שגיאה ביצירת פונקציית mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = אי אפשר להגדיר זווית בין { $count } ישרים

angle-invalid-through-point = נקודה לא תקינה ב־through של `<angle>`

parabola-vertex-too-many-points = פרבולה עם קודקוד נתון העוברת ביותר מנקודה אחת לא מומשה.

parabola-too-many-points = פרבולה העוברת ביותר מ־3 נקודות לא מומשה.

intersection-too-many-items = חיתוך של יותר משני פריטים לא מומש

## Other math components

ionic-compound-not-two-ions = תרכובת יונית לא מומשה עבור דבר מלבד שני יונים.

ionic-compound-needs-cation-and-anion = תרכובת יונית מומשה רק עבור קטיון אחד ואניון אחד.

solve-equations-cannot-evaluate = אי אפשר לפתור את המשוואה כי לא ניתן היה להעריך אותה: { $equation }

math-operators-operand-number-required = יש לציין operandNumber בעת חילוץ אופרנד מתמטי.

eigen-decomposition-failed = לא ניתן היה לחשב את הערכים העצמיים של המטריצה

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: הפרמטרים { $parameters } אינם מופיעים בתבנית, ולכן הם יתאימו תמיד למקום ריק.

## `<graph>`

graph-grid-invalid = `<graph>`: לא ניתן היה לפרש את grid="{ $grid }". עליו להיות none, medium, dense, או שני מספרים חיוביים המופרדים ברווח, כמו grid="1 0.5". לא תצויר רשת.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: הערך xLabelPosition="left" אינו נתמך במציג prefigure; ייעשה שימוש בהתנהגות של המיקום right.

prefigure-y-label-position-unsupported = `<graph>`: הערך yLabelPosition="bottom" אינו נתמך במציג prefigure; ייעשה שימוש בהתנהגות של המיקום top.

prefigure-invalid-axis-bounds = `<graph>`: גבולות הצירים אינם תקינים להמרה ל־prefigure; ייעשה שימוש ב־bbox ברירת המחדל (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: הרוחב אינו תקין להמרה ל־prefigure; ייעשה שימוש ברוחב התרשים כברירת מחדל 425.

prefigure-invalid-aspect-ratio = `<graph>`: הערך aspectRatio אינו תקין להמרה ל־prefigure; ייעשה שימוש ביחס הממדים כברירת מחדל 1.

prefigure-grid-spacing-too-fine = `<graph>`: מרווחי הרשת דקים מדי ביחס לגבולות הצירים; הרשת מושמטת במציג prefigure.

prefigure-annotations-not-rendered = `<graph>`: הערות לא יצוירו כאשר לא נעשה שימוש במציג PreFigure.

multiple-annotations-children = נמצא יותר מצאצא `<annotations>` אחד בתוך `<graph>`; כולם מלבד האחרון לא נלקחים בחשבון.

## Referring to other components

copy-unrecognized-component-type = אי אפשר להרחיב או להעתיק סוג רכיב לא מוכר: { $type }.

copy-prop-not-found = לא נמצא המאפיין { $property } על רכיב מסוג { $component }

collect-no-source = לא נמצא מקור עבור collect.

collect-invalid-component-type = אי אפשר לאסוף רכיבים מסוג `<{ $component }>` כי זהו סוג רכיב לא תקין.

reference-index-unavailable = אי אפשר להפנות אל האינדקס `{ $reference }`

## `<callAction>`

component-action-unavailable = אי אפשר להפעיל את { $action } על הרכיב `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = צורת הנתונים אינה תקינה. אורכי השורות אינם עקביים. נמצא ב־componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = בנתונים יש שמות עמודות חוזרים. נמצא ב־componentIdx :{ $componentIdx }

data-frame-missing-column-name = בנתונים חסר שם של עמודה. נמצא ב־componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = אחד מרכיבי award של התשובה הזאת מתבסס על התשובה שנשלחה מרכיב answer עצמו, מה שיוביל להתנהגות בלתי צפויה.

answer-max-num-attempts-in-section-wide-check-work = הגדרת `maxNumAttempts` על `<answer>` בתוך מכל עם `sectionWideCheckWork` חסרת השפעה, כי מספר הניסיונות נשלט על ידי המכל. יש להגדיר את `maxNumAttempts` על המכל במקום זאת.

nested-section-wide-check-work-max-num-attempts = הגדרת `maxNumAttempts` על מכל עם `sectionWideCheckWork` שנמצא בתוך מכל אחר עם `sectionWideCheckWork` חסרת השפעה, כי מספר הניסיונות נשלט על ידי המכל החיצוני. יש להגדיר את `maxNumAttempts` על המכל החיצוני.

answer-attributes-need-symbolic-equality = למאפיינים { $attributes } לא תהיה השפעה בלי הגדרת symbolicEquality.

answer-invalid-type = סוג לא תקין לתשובה: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = מאחר שלרכיב `<{ $component }>` אין שם, אי אפשר להשתמש בו כמאפיין של module

module-attribute-name-already-defined = אי אפשר להשתמש ברכיב `<{ $component } name="{ $name }">` כמאפיין של module, כי לסוג הרכיב `<module>` כבר מוגדר מאפיין בשם "{ $name }".

conditional-content-condition-ignored = המאפיין `condition` לא נלקח בחשבון ברכיב `<conditionalContent>` שיש לו צאצאי case או else.

slider-markers-type-mismatch = סוג הסמנים אינו תואם את סוג המחוון.

pretzel-problem-needs-statement-and-answer = pretzel לא תקין: כל `<problem>` חייב להכיל `<statement>` אחד ו־`<answer>` אחד.

pretzel-circuit-first-problem-distractor = pretzel לא תקין: ב־mode="circuit" ה־`<problem>` הראשון אינו יכול להיות מסיח.

## Attribute values

attribute-invalid-values = הערכים { $values } אינם תקינים למאפיין `{ $attribute }`; הם לא ילקחו בחשבון.

attribute-must-be-references = הערך `{ $value }` אינו תקין למאפיין `{ $attribute }`. המאפיין חייב להיות מורכב מהפניות שמתחילות ב־`$`.

math-input-invalid-function-names = <mathInput>: שמות פונקציה לא תקינים ב־{ $attribute } לא נלקחו בחשבון: { $names }. מקטע התצוגה של כל שם חייב להיות באורך שני תווים לפחות (אותיות או מקפים); אחריו יכולה לבוא סיומת אופציונלית `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = סוג רכיב לא תקין: `<{ $componentType }>`

attribute-repeated = אי אפשר לחזור על המאפיין { $attribute }.

attribute-invalid-for-component = המאפיין "{ $attribute }" אינו תקין לרכיב מסוג `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    לניגודיות של הגדרת הסגנון { $styleNumber } אין די { $context ->
        [text-on-background] בין צבע הטקסט לצבע הרקע
        [high-contrast] בין הצבע בעל הניגודיות הגבוהה לבין הבד
        [line] בין צבע הקו לבין הבד
        [marker] בין צבע הסמן לבין הבד
       *[text-on-canvas] בין צבע הטקסט לבין הבד
    }{ $mode ->
        [dark] { " (מצב כהה)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; נדרש לפחות { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    אף שהגדרת הסגנון { $styleNumber } מציינת צבעים בעלי ניגודיות מספקת במצב בהיר, לצבעי המצב הכהה הנגזרים מהם אין די ניגודיות בין צבע הטקסט לצבע הרקע ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; נדרש לפחות { $threshold }:1). { $suggestion ->
        [available] כדי להבטיח ניגודיות מספקת במצב כהה, אפשר להגדיל את הניגודיות במצב בהיר (למשל { $lightAttribute }="{ $lightColor }") או לדרוס את צבע המצב הכהה (למשל { $darkAttribute }="{ $darkColor }").
       *[none] כדי להבטיח ניגודיות מספקת במצב כהה, יש להגדיל את הניגודיות במצב בהיר או לדרוס את הצבעים הנגזרים באמצעות textColorDarkMode ו/או backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    אף שהגדרת הסגנון { $styleNumber } מציינת צבע טקסט בעל ניגודיות מספקת במצב בהיר, לצבע הטקסט של המצב הכהה הנגזר ממנו אין די ניגודיות מול הבד ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; נדרש לפחות { $threshold }:1). { $suggestion ->
        [available] כדי להבטיח ניגודיות מספקת במצב כהה, אפשר להגדיל את הניגודיות במצב בהיר (למשל textColor="{ $lightColor }") או לדרוס את צבע המצב הכהה (למשל textColorDarkMode="{ $darkColor }").
       *[none] כדי להבטיח ניגודיות מספקת במצב כהה, יש להגדיל את הניגודיות במצב בהיר או לדרוס את הצבע הנגזר באמצעות textColorDarkMode.
    }

section-multiple-style-palettes = סעיף יכול לבחור <stylePalette> אחת בלבד; ייעשה שימוש באחרונה.

## Unique variants

variant-num-to-select-not-non-negative-integer = אי אפשר לקבוע את הגרסאות הייחודיות של הרכיב { $component } כי numToSelect אינו מספר שלם אי־שלילי.

variant-num-to-select-not-constant-number = אי אפשר לקבוע את הגרסאות הייחודיות של הרכיב { $component } כי numToSelect אינו מספר קבוע.

variant-with-replacement-not-constant-boolean = אי אפשר לקבוע את הגרסאות הייחודיות של הרכיב { $component } כי withReplacement אינו ערך בוליאני קבוע.

variant-select-weight-disables-unique = גרסאות ייחודיות עבור select מושבתות כאשר לאחת האפשרויות צוין selectWeight או selectForVariants

variant-coprime-undetermined = אי אפשר לקבוע את הגרסאות הייחודיות של הרכיב { $component } כי לא ניתן לקבוע ש־coprime תמיד שקרי.

variant-attribute-not-constant = אי אפשר לקבוע את הגרסאות הייחודיות של הרכיב { $component } כי { $attribute } אינו קבוע.

variant-attribute-not-number = אי אפשר לקבוע את הגרסאות הייחודיות של הרכיב { $component } כי { $attribute } אינו מספר.

variant-attribute-wrong-type-for-sequence =
    אי אפשר לקבוע את הגרסאות הייחודיות של הרכיב { $component } מסוג { $type } כי { $attribute } אינו { $expected ->
        [letters-combination] צירוף של אותיות
        [math-expression] ביטוי מתמטי תקין
        [integer] מספר שלם
       *[number] מספר
    }.

variant-length-not-integer = אי אפשר לקבוע את הגרסאות הייחודיות של הרכיב { $component } כי length אינו מספר שלם.

variant-sort-not-implemented = גרסאות ייחודיות של { $component } עם sort לא מומשו

variant-exclude-combinations-not-implemented = גרסאות ייחודיות של { $component } עם excludeCombinations לא מומשו

variant-math-exclude-not-implemented = גרסאות ייחודיות של { $component } מסוג math עם exclude לא מומשו

variant-non-constant-exclude-not-implemented = גרסאות ייחודיות של { $component } עם exclude לא קבוע לא מומשו

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: אינו נתמך במציג prefigure של התרשים; הצאצא דולג.

prefigure-descendant-invalid-geometry = { $subject }: גאומטריה לא סופית או חלקית; הצאצא דולג.

prefigure-curve-label-omitted = { $subject }: תוויות אינן נתמכות על רכיבי עקומה מומרים; התווית הושמטה.

prefigure-curve-unsupported-definition-type = { $subject }: סוג הגדרת פונקציית העקומה '{ $definitionType }' אינו נתמך; הצאצא דולג.

prefigure-region-flip-functions-unsupported = { $subject }: המאפיין flipFunctions אינו נתמך על regionBetweenCurves; הצאצא דולג.

prefigure-region-non-formula-child = { $subject }: על regionBetweenCurves נתמכות רק פונקציות צאצא המוגדרות בנוסחה; הצאצא דולג.

prefigure-label-position-unsupported =
    { $subject }: הערך labelPosition '{ $labelPosition }' אינו נתמך עבור { $labelKind ->
        [line-family] תווית ממשפחת הישרים
       *[point] תווית של נקודה
    }; נעשה שימוש ביישור ברירת המחדל של PreFigure.

prefigure-fill-style-unsupported = { $subject }: סגנון המילוי '{ $fillStyle }' אינו נתמך ב־PreFigure; ייעשה שימוש במילוי אחיד.

prefigure-line-style-unknown = { $subject }: סגנון הקו '{ $lineStyle }' אינו מוכר והושמט מהפלט של PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: סגנון הסמן '{ $markerStyle }' מופה לסגנון 'diamond' של PreFigure.

prefigure-marker-style-unsupported = { $subject }: סגנון הסמן '{ $markerStyle }' אינו נתמך ב־PreFigure; נעשה שימוש בסגנון ברירת המחדל.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ערך `ref` לא תקין; לא ניתן היה לקבוע את היעד. ההערה הושמטה.

annotation-ref-multiple-targets = `<annotation>`: `ref` הוביל ליותר מיעד אחד; ייעשה שימוש ביעד הראשון.

annotation-ref-outside-graph = `<annotation>`: ערך `ref` לא תקין; היעד נמצא מחוץ לתרשים המכיל. ההערה הושמטה.

annotation-ref-unsupported-target = `<annotation>`: ערך `ref` לא תקין; היעד אינו עצם גרפי נתמך בהמרה ל־prefigure. ההערה הושמטה.

annotation-text-missing = `<annotation>`: הערך `text` חסר או ריק; ייווצר טקסט ריק.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] זוהתה תלות מעגלית.
       *[other] זוהתה תלות מעגלית הכוללת רכיב `<{ $componentType }>`.
    }

reference-no-referent = לא נמצא מפנה עבור ההפניה: `{ $reference }`

reference-multiple-referents = נמצאו כמה מפנים עבור ההפניה: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = תבנית לא תקינה למאפיין { $attribute } של `<{ $componentType }>`.

children-invalid = צאצאים לא תקינים עבור `<{ $componentType }>`: נמצאו צאצאים לא תקינים: { $children }

## Falling back to a default

attribute-value-invalid-using-default = הערך `{ $value }` אינו תקין למאפיין `{ $attribute }`; ייעשה שימוש בערך `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] גרסת DoenetML { $version } לא נמצאה.
       *[other] גרסת DoenetML { $version } לא נמצאה. ייעשה שימוש בגרסה { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML לא תקין: { $content }

parse-tag-missing-close-tag = DoenetML לא תקין: לתגית `{ $tag }` אין תגית סוגרת. ציפינו לתגית סוגרת־עצמה או לתגית `</{ $tagName }>`.

parse-tag-error = DoenetML לא תקין: שגיאה בתגית `<{ $tagName }>`

parse-attribute-missing-value = DoenetML לא תקין: נראה שלמאפיין הלא תקין `{ $attribute }` חסר ערך.

parse-attribute-invalid = DoenetML לא תקין: המאפיין `{ $attribute }` אינו תקין

parse-attribute-value-invalid = DoenetML לא תקין: ערך המאפיין `{ $value }` אינו תקין

parse-attribute-value-quote-mismatch = DoenetML לא תקין: ערך המאפיין `{ $value }` אינו תקין. הגרשיים אינם תואמים. נראה שחסר `{ $quote }`

parse-open-tag-name-missing = DoenetML לא תקין: נמצאה תגית בלי שם, למשל `<`

parse-tag-not-closed = DoenetML לא תקין: התגית `{ $tag }` לא נסגרה (נראה שחסר `>`).

parse-self-closing-tag-name-missing = DoenetML לא תקין: נמצאה תגית בלי שם `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML לא תקין: התגית `{ $tag }` לא נסגרה (נראה שחסר `/>`).

parse-tag-invalid-attributes = DoenetML לא תקין: התגית `{ $tag }` אינה תקינה. ייתכן שהמאפיינים שלה שגויים.

parse-close-tag-name-missing = DoenetML לא תקין: נמצאה תגית סוגרת בלי שם, למשל `</`

parse-attribute-value-unquoted = ערכי מאפיינים חייבים להיות מוקפים בגרשיים: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML לא תקין: נמצאה התגית הסוגרת `{ $tag }`, אבל אין לה תגית פותחת מתאימה

parse-close-tag-mismatched = DoenetML לא תקין: תגית סוגרת שאינה תואמת. ציפינו ל־`</{ $expected }>`. נמצא `{ $found }`

parser-node-unconvertible = לא ניתן היה להמיר את הצומת { $node } לצומת Dast.

## Names

name-attribute-invalid =
    המאפיין name='{ $name }' אינו תקין. { $reason ->
        [characters] שמות יכולים להכיל רק אותיות, ספרות, קווים תחתונים או מקפים.
       *[start] שמות חייבים להתחיל באות.
    }

component-name-invalid-start = שם הרכיב "{ $name }" אינו תקין. שמות חייבים להתחיל באות.

## `<answer>` sugar

answer-video-watched-missing-video = לתשובה מסוג videoWatched חייב להיות מאפיין video

answer-video-watched-video-not-reference = המאפיין video של תשובה מסוג videoWatched חייב להיות הפניה

answer-name-not-single-text = למאפיין name של תשובה חייב להיות צאצא טקסט אחד

## Referencing another document

external-doenetml-recursion-limit = לא ניתן היה לאחזר DoenetML חיצוני בגלל יותר מדי רמות של רקורסיה. האם יש הפניה מעגלית?

external-doenetml-unavailable = לא ניתן היה לאחזר DoenetML מ־{ $attribute }="{ $uri }"

external-doenetml-type-mismatch = ה־DoenetML שאוחזר מ־{ $attribute }="{ $uri }" אינו תקין: הוא אינו תואם את סוג הרכיב "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] המאפיין `{ $from }` הוצא משימוש; יש להשתמש ב־`{ $to }` במקומו.
       *[other] [deprecation] המאפיין `{ $from }` על `<{ $component }>` הוצא משימוש; יש להשתמש ב־`{ $to }` במקומו.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] המאפיין `{ $from }` הוצא משימוש ולא נלקח בחשבון כי `{ $to }` צוין גם הוא.
       *[other] [deprecation] המאפיין `{ $from }` על `<{ $component }>` הוצא משימוש ולא נלקח בחשבון כי `{ $to }` צוין גם הוא.
    }

deprecated-attribute-ignored = [deprecation] המאפיין `{ $attribute }` על `<{ $component }>` הוצא משימוש ולא נלקח בחשבון.


## Language coverage

pluralize-english-only = `<pluralize>` יכול להטות לרבים רק באנגלית, ולכן הטקסט שלו נשאר כפי שנכתב במסמך שנכתב בשפה { $locale }. יש לכתוב את צורת הרבים ישירות, או לקבוע אותה במאפיין `pluralForm`.


## Checking against the schema

schema-element-unrecognized = האלמנט `<{ $tag }>` אינו אלמנט מוכר של Doenet.

schema-element-not-allowed-at-root = האלמנט `<{ $tag }>` אינו מותר בשורש המסמך.

schema-element-not-allowed-inside = האלמנט `<{ $tag }>` אינו מותר בתוך `<{ $parent }>`.

schema-attribute-unrecognized = לאלמנט `<{ $tag }>` אין מאפיין בשם `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] המאפיין `{ $attribute }` של האלמנט `<{ $tag }>` חייב להיות רשימה שכל איבר בה הוא אחד מאלה: { $allowed }
       *[other] המאפיין `{ $attribute }` של האלמנט `<{ $tag }>` חייב להיות אחד מאלה: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = שם גרסה לא תקין עבור select. שם הגרסה { $variantName } מופיע ב־{ $numOptions } אפשרויות, אבל המספר לבחירה הוא { $numToSelect }.

select-variant-name-without-options = צוינו כמה גרסאות עבור select, אבל לא צוינו אפשרויות לשם הגרסה האפשרי: { $variantName }.

select-variant-name-not-possible = שם הגרסה { $variantName } שצוין עבור select אינו שם גרסה אפשרי.

select-too-few-options = אי אפשר לבחור { $numToSelect } רכיבים מתוך { $numOptions } בלבד.

select-from-sequence-too-few-values = אי אפשר לבחור { $numToSelect } ערכים מסדרה באורך { $length }.

select-from-sequence-indices-count-mismatch = מספר האינדקסים שצוינו עבור select חייב להתאים למספר לבחירה

select-from-sequence-indices-not-integers = כל האינדקסים שצוינו עבור select חייבים להיות מספרים שלמים

select-from-sequence-index-excluded = האינדקס שצוין עבור selectfromsequence הוחרג

select-from-sequence-indices-excluded-combination = האינדקסים שצוינו עבור selectfromsequence היוו צירוף מוחרג

select-from-sequence-coprime-not-positive-integers = אי אפשר לבחור צירופים זרים כי הבחירה אינה מתוך מספרים שלמים חיוביים.

select-from-sequence-coprime-common-factor = אי אפשר לבחור מספרים זרים. לכל הערכים האפשריים יש גורם משותף. (הערך שצוין ב־"from" או ב־"to" חייב להיות זר ל־"step".)

select-from-sequence-coprime-single-number = אי אפשר לבחור צירופים זרים ממספר יחיד שאינו 1.

select-from-sequence-excluded-too-many-combinations = יותר מ־70% מהצירופים הוחרגו ב־selectFromSequence

select-from-sequence-coprime-none-found = לא ניתן היה לבחור מספרים זרים. לכל הערכים האפשריים יש גורם משותף.

select-from-sequence-too-few-unique-values = אי אפשר לבחור { $numToSelect } ערכים ייחודיים מסדרה באורך { $numPossibleValues }

select-prime-numbers-too-few-values = אי אפשר לבחור { $numToSelect } ערכים מרשימת ראשוניים באורך { $numValues }

select-prime-numbers-values-count-mismatch = מספר הערכים שצוינו עבור select חייב להתאים למספר לבחירה

select-prime-numbers-values-not-prime = כל הערכים שצוינו עבור select prime number חייבים להיות ברשימת הראשוניים

select-prime-numbers-values-excluded-combination = הערכים שצוינו עבור selectPrimeNumbers היוו צירוף מוחרג

select-prime-numbers-excluded-too-many-combinations = יותר מ־70% מהצירופים הוחרגו ב־selectPrimeNumbers

select-random-combination-fluke = במקרה נדיר במיוחד, לא ניתן היה לבחור צירוף של ערכים אקראיים

select-random-value-fluke = במקרה נדיר במיוחד, לא ניתן היה לבחור ערך אקראי
