# Yiddish content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Yiddish is written right to left in Hebrew letters. Nothing about this file
# changes for that: a pattern is a sequence of characters in logical order —
# the order the words are spoken — and `directionOf` reports `rtl` from the
# script, so the text below is written the way it is read and is never
# reordered by hand. `direction.ts` already lists both `yi` and the retired
# `ji`, so this catalog needed no change there.
#
# The three digraphs are written as **two letters each** — «וו», «וי», «יי» —
# and never as the precomposed ligature characters U+05F0–U+05F2, which render
# the same and compare unequal. That is the spelling CLDR itself uses for the
# endonym «ייִדיש», so a search across these four files and the roster's own
# label find the same characters. The pointed digraph follows the same rule:
# the pasekh sits on the second of the two yuds, as in «ווייַס».
#
# Adjectives *precede* their noun, as in English, so the composition messages
# at the foot of the file keep the English order — the one thing here that is
# unlike `locales/he` and `locales/ar`, whose adjectives follow.
#
# An attributive adjective agrees with its noun in gender and in the case its
# position governs, so every describing word selects on `$role` first and only
# then on `$gender`:
#
#   standalone          nominative: `-ער` m, `-ע` f
#   border-clause       after «מיט», which governs the dative, of «ראַנד» —
#                       masculine: `-ן`
#   background-clause   after «אויף», dative here, of «הינטערגרונט» — also
#                       masculine, so the form is the same as the border's
#   text-clause         nominative masculine, agreeing with «טעקסט»
#
# The dative ending is `-ן` after most stems and `-ען` after a vowel or a final
# `נ`/`מ` — «גרין» → «גרינען», «בלוי» → «בלויען» — which is why the branches are
# written out per word rather than derived.
#
# «לילאַ» is indeclinable, as colour words borrowed whole often are, so purple
# reads the same in all four positions. That is a fact about the word and not
# an unfinished branch.
#
# No noun in the table below is neuter, so no adjective writes an `[n]` branch:
# it would be a variant nothing could select. A neuter noun added to
# `noun-gender` needs those branches added with it.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] שוואַרצן
            [background-clause] שוואַרצן
            [text-clause] שוואַרצער
           *[standalone]
                { $gender ->
                    [f] שוואַרצע
                   *[m] שוואַרצער
                }
        }
    .white =
        { $role ->
            [border-clause] ווייַסן
            [background-clause] ווייַסן
            [text-clause] ווייַסער
           *[standalone]
                { $gender ->
                    [f] ווייַסע
                   *[m] ווייַסער
                }
        }
    .gray =
        { $role ->
            [border-clause] גרויען
            [background-clause] גרויען
            [text-clause] גרויער
           *[standalone]
                { $gender ->
                    [f] גרויע
                   *[m] גרויער
                }
        }
    .red =
        { $role ->
            [border-clause] רויטן
            [background-clause] רויטן
            [text-clause] רויטער
           *[standalone]
                { $gender ->
                    [f] רויטע
                   *[m] רויטער
                }
        }
    .orange =
        { $role ->
            [border-clause] אָראַנזשן
            [background-clause] אָראַנזשן
            [text-clause] אָראַנזשער
           *[standalone]
                { $gender ->
                    [f] אָראַנזשע
                   *[m] אָראַנזשער
                }
        }
    .yellow =
        { $role ->
            [border-clause] געלן
            [background-clause] געלן
            [text-clause] געלער
           *[standalone]
                { $gender ->
                    [f] געלע
                   *[m] געלער
                }
        }
    .green =
        { $role ->
            [border-clause] גרינען
            [background-clause] גרינען
            [text-clause] גרינער
           *[standalone]
                { $gender ->
                    [f] גרינע
                   *[m] גרינער
                }
        }
    .cyan =
        { $role ->
            [border-clause] טערקיזן
            [background-clause] טערקיזן
            [text-clause] טערקיזער
           *[standalone]
                { $gender ->
                    [f] טערקיזע
                   *[m] טערקיזער
                }
        }
    .blue =
        { $role ->
            [border-clause] בלויען
            [background-clause] בלויען
            [text-clause] בלויער
           *[standalone]
                { $gender ->
                    [f] בלויע
                   *[m] בלויער
                }
        }
    .purple = לילאַ
    .pink =
        { $role ->
            [border-clause] ראָזעווען
            [background-clause] ראָזעווען
            [text-clause] ראָזעווער
           *[standalone]
                { $gender ->
                    [f] ראָזעווע
                   *[m] ראָזעווער
                }
        }
    .brown =
        { $role ->
            [border-clause] ברוינען
            [background-clause] ברוינען
            [text-clause] ברוינער
           *[standalone]
                { $gender ->
                    [f] ברוינע
                   *[m] ברוינער
                }
        }

line-width =
    .thick =
        { $role ->
            [border-clause] גראָבן
            [background-clause] גראָבן
            [text-clause] גראָבער
           *[standalone]
                { $gender ->
                    [f] גראָבע
                   *[m] גראָבער
                }
        }
    .thin =
        { $role ->
            [border-clause] דינען
            [background-clause] דינען
            [text-clause] דינער
           *[standalone]
                { $gender ->
                    [f] דינע
                   *[m] דינער
                }
        }

line-style =
    .dashed =
        { $role ->
            [border-clause] געשטריכלטן
            [background-clause] געשטריכלטן
            [text-clause] געשטריכלטער
           *[standalone]
                { $gender ->
                    [f] געשטריכלטע
                   *[m] געשטריכלטער
                }
        }
    .dotted =
        { $role ->
            [border-clause] געפּינטלטן
            [background-clause] געפּינטלטן
            [text-clause] געפּינטלטער
           *[standalone]
                { $gender ->
                    [f] געפּינטלטע
                   *[m] געפּינטלטער
                }
        }

# Plural noun phrases, which is what follows «מיט» in `style-filled`. They agree
# with nothing.
fill-style =
    .horizontal = האָריזאָנטאַלע ליניעס
    .vertical = ווערטיקאַלע ליניעס
    .diagonal = דיאַגאָנאַלע ליניעס
    .backdiagonal = פֿאַרקערטע דיאַגאָנאַלע ליניעס
    .dots = פּינטלעך
    .diamonds = ראָמבן

noun =
    .line = ליניע
    .line-segment = אָפּשניט
    .ray = שטראַל
    .vector = וועקטאָר
    .curve = קרומע
    .function = פֿונקציע
    .parabola = פּאַראַבאָלע
    .polyline = געבראָכענע ליניע
    .polygon = פּאָליגאָן
    .triangle = דרייַעק
    .rectangle = רעכטעק
    .circle = קרייַז
    .region = געגנט
    .point = פּונקט
    .square = קוואַדראַט
    .diamond = ראָמב
    .cross = קרייץ
    .plus = פּלוס

# Yiddish keeps the side count in front of the noun, so the whole of it is one
# head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] רעגולערער { $numSides }-זייַטיקער פּאָליגאָן
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (פּאָליגאָן, m) or the
# head of a phrase the description never names: `border` (ראַנד, m), `fill`
# (אָנפֿיל, m), `text` (טעקסט, m), `background` (הינטערגרונט, m).
noun-gender =
    { $noun ->
        [line] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [region] f
       *[other] m
    }


## Style composition

style-stroke =
    { $parts ->
        [width-style-color] { $width } { $lineStyle } { $color }
        [width-color] { $width } { $color }
        [style-color] { $lineStyle } { $color }
        [width-style] { $width } { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }

style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }

# Only ever said of the shape itself, so it is standalone in every description
# and takes no `$role` branch.
style-filled-word =
    { $gender ->
        [f] אָנגעפֿילטע
       *[m] אָנגעפֿילטער
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } מיט { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } מיט { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } מיט { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# «ראַנד» is masculine, so the border's adjectives agree with it and not with
# the shape it surrounds, and they are in the dative, which «מיט» governs.
# Yiddish has an indefinite article, «אַ», so the two `-article` branches really
# do differ from the two without.
style-border-clause =
    { $parts ->
        [with-article] מיט אַ { $border } ראַנד
        [and] און { $border } ראַנד
        [and-article] און אַ { $border } ראַנד
       *[with] מיט { $border } ראַנד
    }

# The fill-pattern words are plurals, because their other use is the
# «מיט { $pattern }» clause in `style-filled`. So this message supplies a noun
# for them to hang off — «אָנפֿיל», masculine, which is the gender `noun-gender`
# already answers for `fill`.
style-fill =
    { $parts ->
        [pattern] { $color } אָנפֿיל מיט { $pattern }
       *[plain] { $color } אָנפֿיל
    }

style-unfilled = ניט אָנגעפֿילט

style-text =
    { $parts ->
        [background] { $color } אויף אַ { $background } הינטערגרונט
       *[plain] { $color }
    }

style-background-none = קיינער


## Boolean words

boolean-true = אמת
boolean-false = פֿאַלש


## Answer buttons

answer-submit-label = קאָנטראָליר די אַרבעט
answer-submit-label-no-correctness = שיק דעם ענטפֿער


## Sectional blocks

section-name =
    .activity = אַקטיוויטעט
    .aside = זייַטיקע באַמערקונג
    .cascade = קאַסקאַד
    .definition = דעפֿיניציע
    .example = בייַשפּיל
    .exercise = געניטונג
    .exercises = געניטונגען
    .given-answer = ענטפֿער
    .note = באַמערקונג
    .objectives = צילן
    .paragraphs = פּאַראַגראַפֿן
    .part = טייל
    .problem = אויפֿגאַבע
    .problems = אויפֿגאַבעס
    .proof = באַווייַז
    .question = פֿראַגע
    .section = אָפּטייל
    .solution = לייזונג
    .task = אויפֿטו
    .theorem = טעאָרעם

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = אָנווייַז


## Tables and figures

table-name =
    { $parts ->
        [numbered] טאַבעלע { $enumeration }
        [numbered-title] טאַבעלע { $enumeration }{ ": " }
        [unnumbered-title] טאַבעלע{ ": " }
       *[unnumbered] טאַבעלע
    }

figure-name =
    { $parts ->
        [numbered] פֿיגור { $enumeration }
        [numbered-caption] פֿיגור { $enumeration }{ ": " }
        [unnumbered-caption] פֿיגור{ ": " }
       *[unnumbered] פֿיגור
    }


## Paginator controls

paginator-previous = פֿריִערדיקע
paginator-next = קומענדיקע
paginator-page = זייַט

paginator-page-status = { $pageLabel } { $currentPage } פֿון { $numPages }


## Piecewise functions

piecewise-condition-or = אָדער
piecewise-condition-if = אויב
piecewise-condition-otherwise = אַנדערש


## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Yiddish has chemical vocabulary in its scientific and encyclopedic
## writing, but no school system teaches secondary chemistry in it, so there is
## no settled table for a seed to reproduce — and an invented one, in letters
## the reader cannot check against the English beside it, would be worse than
## the English. This is where a speaker should look first.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = אומגילטיקער כעמישער סימבאָל
chemistry-invalid-ionic-compound = אומגילטיקע יאָנישע פֿאַרבינדונג
