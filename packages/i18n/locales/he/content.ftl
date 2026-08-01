# Hebrew content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written right to left, in a script of its own rather than the Arabic one. See
# the Direction section of the README for what that does and does not change:
# the text below is in logical order, and `dir` decides where it is drawn.
#
# Adjectives follow their noun and agree with it in gender, so
# `style-with-noun` reverses the two halves and every adjective selects on
# `$gender`. None selects on `$role`: Hebrew marks no case, so the four
# positions it distinguishes are spelled alike.
#
# Numbers reach the reader in Latin digits, as everywhere in these catalogs.


## Style vocabulary

# «תכלת» is a noun used as a colour word rather than an adjective, so `.cyan`
# does not inflect and takes no branch. The note sits here rather than beside
# that attribute: an indented `#` line inside a message is not a comment but a
# continuation of the pattern above it, and would be rendered.
color =
    .black =
        { $gender ->
            [f] שחורה
           *[m] שחור
        }
    .white =
        { $gender ->
            [f] לבנה
           *[m] לבן
        }
    .gray =
        { $gender ->
            [f] אפורה
           *[m] אפור
        }
    .red =
        { $gender ->
            [f] אדומה
           *[m] אדום
        }
    .orange =
        { $gender ->
            [f] כתומה
           *[m] כתום
        }
    .yellow =
        { $gender ->
            [f] צהובה
           *[m] צהוב
        }
    .green =
        { $gender ->
            [f] ירוקה
           *[m] ירוק
        }
    .cyan = תכלת
    .blue =
        { $gender ->
            [f] כחולה
           *[m] כחול
        }
    .purple =
        { $gender ->
            [f] סגולה
           *[m] סגול
        }
    .pink =
        { $gender ->
            [f] ורודה
           *[m] ורוד
        }
    .brown =
        { $gender ->
            [f] חומה
           *[m] חום
        }

# «עבה» is spelled the same in both genders once the vowels are left out, which
# they are, so it takes no branch.
line-width =
    .thick = עבה
    .thin =
        { $gender ->
            [f] דקה
           *[m] דק
        }

line-style =
    .dashed =
        { $gender ->
            [f] מקווקוות
           *[m] מקווקו
        }
    .dotted =
        { $gender ->
            [f] מנוקדת
           *[m] מנוקד
        }

# Fill patterns are plural nouns rather than adjectives and take no gender
# branch; `style-fill` names their colour with «בצבע» instead of agreeing an
# adjective with them.
fill-style =
    .horizontal = קווים אופקיים
    .vertical = קווים אנכיים
    .diagonal = קווים אלכסוניים
    .backdiagonal = קווים אלכסוניים הפוכים
    .dots = נקודות
    .diamonds = מעוינים

# «איקס» names the marker by the sign it is drawn as; «צלב» is the word for a
# cross as an object and carries a sense a plotted point does not.
noun =
    .line = קו
    .line-segment = קטע
    .ray = קרן
    .vector = וקטור
    .curve = עקומה
    .function = פונקציה
    .parabola = פרבולה
    .polyline = קו שבור
    .polygon = מצולע
    .triangle = משולש
    .rectangle = מלבן
    .circle = מעגל
    .region = אזור
    .point = נקודה
    .square = ריבוע
    .diamond = מעוין
    .cross = איקס
    .plus = פלוס

# The side count is a complement closing the phrase, after the adjectives, so
# that they stay beside the noun they agree with: «מצולע משוכלל אדום עבה בעל 5
# צלעות».
noun-regular-polygon =
    { $part ->
        [tail] בעל { $numSides } צלעות
       *[head] מצולע משוכלל
    }

noun-gender =
    { $noun ->
        [ray] f
        [curve] f
        [function] f
        [parabola] f
        [point] f
       *[other] m
    }


## Style composition

# The mirror of the English order, so the adjective English puts nearest the
# noun is the one Hebrew puts nearest it: "thick dashed red line" becomes
# «קו אדום מקווקו עבה».
style-stroke =
    { $parts ->
        [width-style-color] { $color } { $lineStyle } { $width }
        [width-color] { $color } { $width }
        [style-color] { $color } { $lineStyle }
        [width-style] { $lineStyle } { $width }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }

style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word =
    { $gender ->
        [f] מלאה
       *[m] מלא
    }

style-filled =
    { $parts ->
        [pattern] { $color } { $filled } עם { $pattern }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } עם { $pattern }
        [plain-tail] { $noun } { $color } { $filled } { $nounTail }
        [pattern-tail] { $noun } { $color } { $filled } { $nounTail } עם { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }

# Hebrew has no indefinite article, so the two `-article` branches say what
# their plain counterparts do. «מסגרת» is feminine, so the border's adjectives
# agree with it rather than with the shape around it.
style-border-clause =
    { $parts ->
        [with-article] עם מסגרת { $border }
        [and] ומסגרת { $border }
        [and-article] ומסגרת { $border }
       *[with] עם מסגרת { $border }
    }

# «בצבע» — "in the colour of" — because the pattern is a plural noun and the
# colour arrives agreed with «מילוי», which is masculine singular.
style-fill =
    { $parts ->
        [pattern] { $pattern } בצבע { $color }
       *[plain] { $color }
    }

# Said of no particular shape — `describeFill` passes no gender — so it is put
# as a phrase that does not inflect at all.
style-unfilled = ללא מילוי

style-text =
    { $parts ->
        [background] { $color } על רקע { $background }
       *[plain] { $color }
    }

style-background-none = ללא


## Boolean words

boolean-true = אמת
boolean-false = שקר


## Answer buttons

answer-submit-label = בדיקת התשובה
answer-submit-label-no-correctness = שליחת התשובה


## Sectional blocks

section-name =
    .activity = פעילות
    .aside = הערת צד
    .cascade = מפל
    .definition = הגדרה
    .example = דוגמה
    .exercise = תרגיל
    .exercises = תרגילים
    .given-answer = תשובה
    .note = הערה
    .objectives = מטרות
    .paragraphs = פסקאות
    .part = חלק
    .problem = בעיה
    .problems = בעיות
    .proof = הוכחה
    .question = שאלה
    .section = סעיף
    .solution = פתרון
    .task = משימה
    .theorem = משפט

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = רמז


## Tables and figures

table-name =
    { $parts ->
        [numbered] טבלה { $enumeration }
        [numbered-title] טבלה { $enumeration }{ ": " }
        [unnumbered-title] טבלה{ ": " }
       *[unnumbered] טבלה
    }

figure-name =
    { $parts ->
        [numbered] איור { $enumeration }
        [numbered-caption] איור { $enumeration }{ ": " }
        [unnumbered-caption] איור{ ": " }
       *[unnumbered] איור
    }


## Paginator controls

paginator-previous = הקודם
paginator-next = הבא
paginator-page = עמוד

paginator-page-status = { $pageLabel } { $currentPage } מתוך { $numPages }


## Piecewise functions

piecewise-condition-or = או

piecewise-condition-if = אם

piecewise-condition-otherwise = אחרת


## Chemistry

element-name =
    .h = מימן
    .he = הליום
    .li = ליתיום
    .be = בריליום
    .b = בורון
    .c = פחמן
    .n = חנקן
    .o = חמצן
    .f = פלואור
    .ne = ניאון
    .na = נתרן
    .mg = מגנזיום
    .al = אלומיניום
    .si = צורן
    .p = זרחן
    .s = גופרית
    .cl = כלור
    .ar = ארגון
    .k = אשלגן
    .ca = סידן
    .sc = סקנדיום
    .ti = טיטניום
    .v = ונדיום
    .cr = כרום
    .mn = מנגן
    .fe = ברזל
    .co = קובלט
    .ni = ניקל
    .cu = נחושת
    .zn = אבץ
    .ga = גליום
    .ge = גרמניום
    .as = ארסן
    .se = סלניום
    .br = ברום
    .kr = קריפטון
    .rb = רובידיום
    .sr = סטרונציום
    .y = איטריום
    .zr = זירקוניום
    .nb = ניוביום
    .mo = מוליבדן
    .tc = טכנציום
    .ru = רותניום
    .rh = רודיום
    .pd = פלדיום
    .ag = כסף
    .cd = קדמיום
    .in = אינדיום
    .sn = בדיל
    .sb = אנטימון
    .te = טלוריום
    .i = יוד
    .xe = קסנון
    .cs = צסיום
    .ba = בריום
    .la = לנתן
    .ce = צריום
    .pr = פרסאודימיום
    .nd = נאודימיום
    .pm = פרומתיום
    .sm = סמריום
    .eu = אירופיום
    .gd = גדוליניום
    .tb = טרביום
    .dy = דיספרוסיום
    .ho = הולמיום
    .er = ארביום
    .tm = תוליום
    .yb = איטרביום
    .lu = לוטציום
    .hf = הפניום
    .ta = טנטלום
    .w = טונגסטן
    .re = רניום
    .os = אוסמיום
    .ir = אירידיום
    .pt = פלטינה
    .au = זהב
    .hg = כספית
    .tl = תליום
    .pb = עופרת
    .bi = ביסמוט
    .po = פולוניום
    .at = אסטטין
    .rn = ראדון
    .fr = פרנציום
    .ra = רדיום
    .ac = אקטיניום
    .th = תוריום
    .pa = פרוטקטיניום
    .u = אורניום
    .np = נפטוניום
    .pu = פלוטוניום
    .am = אמריציום
    .cm = קוריום
    .bk = ברקליום
    .cf = קליפורניום
    .es = איינשטייניום
    .fm = פרמיום
    .md = מנדלביום
    .no = נובליום
    .lr = לורנציום
    .rf = רתרפורדיום
    .db = דובניום
    .sg = סיבורגיום
    .bh = בוריום
    .hs = הסיום
    .mt = מייטנריום
    .ds = דרמשטדטיום
    .rg = רנטגניום
    .cn = קופרניציום
    .nh = ניהוניום
    .fl = פלרוביום
    .mc = מוסקוביום
    .lv = ליברמוריום
    .ts = טנסין
    .og = אוגנסון

element-anion-name =
    .h = הידריד
    .c = קרביד
    .n = ניטריד
    .o = אוקסיד
    .f = פלואוריד
    .p = פוספיד
    .s = סולפיד
    .cl = כלוריד
    .br = ברומיד
    .i = יודיד
    .at = אסטטיד
    .ts = טנסיד

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = סמל כימי לא תקין
chemistry-invalid-ionic-compound = תרכובת יונית לא תקינה
