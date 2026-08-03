# Yoruba content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Yoruba has no grammatical gender, no noun class and no adjective agreement,
# so `$gender` and `$role` go unused here exactly as they do in English.
# Adjectives *follow* the noun they modify — «ìlà nípọn pupa» — so the
# composition messages put the noun first, as Malay and Vietnamese do.
#
# Yoruba has no article, so the two `-article` branches read like the ones
# without.
#
# The tone marks are part of the spelling, not decoration: «ìlà» is a line and
# «ilá» is okra. A correction that drops them is a different word.


## Style vocabulary

color =
    .black = dúdú
    .white = funfun
    .gray = eléérú
    .red = pupa
    .orange = aláwọ̀ ọ̀sàn
    .yellow = aláwọ̀ yẹ́lò
    .green = aláwọ̀ ewé
    .cyan = aláwọ̀ sáyánì
    .blue = aláwọ̀ búlúù
    .purple = aláwọ̀ àlùkò
    .pink = aláwọ̀ pìǹkì
    .brown = aláwọ̀ aró

line-width =
    .thick = nípọn
    .thin = tínrín

line-style =
    .dashed = onípínyà
    .dotted = oníààmì

# Noun phrases: they follow «pẹ̀lú» and modify nothing.
fill-style =
    .horizontal = àwọn ìlà ìbú
    .vertical = àwọn ìlà ìdúró
    .diagonal = àwọn ìlà ìkọjá
    .backdiagonal = àwọn ìlà ìkọjá ẹ̀yìn
    .dots = àwọn ààmì
    .diamonds = àwọn dáyámọ́ǹdì

noun =
    .line = ìlà
    .line-segment = apá ìlà
    .ray = ìtànṣán
    .vector = fẹ́ktọ̀
    .curve = ìtẹ̀
    .function = iṣẹ́
    .parabola = paràbólà
    .polyline = ìlà oníhà
    .polygon = oníhà púpọ̀
    .triangle = onígun mẹ́ta
    .rectangle = onígun mẹ́rin gígùn
    .circle = òbìríkítí
    .region = agbègbè
    .point = ààmì
    .square = onígun mẹ́rin dọ́gba
    .diamond = dáyámọ́ǹdì
    .cross = àgbélébùú
    .plus = àmì àfikún

# The side count goes in the tail, behind the adjectives: «oníhà dọ́gba pupa
# oníhà 5». Putting it in the head would separate «oníhà» from the number
# counting it only to reunite them at the far end of the phrase.
noun-regular-polygon =
    { $part ->
        [tail] oníhà { $numSides }
       *[head] oníhà dọ́gba
    }

# Yoruba has no grammatical gender, so every noun answers the same and the
# answer goes unused — as in English.
noun-gender = neuter


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

# The noun leads and its adjectives follow: «ìlà nípọn onípínyà pupa».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word = kíkún

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } pẹ̀lú { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } pẹ̀lú { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } pẹ̀lú { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# «ìlà ẹ̀gbẹ́» leads its own adjectives, the same way every noun here does.
style-border-clause =
    { $parts ->
        [with-article] pẹ̀lú ìlà ẹ̀gbẹ́ { $border }
        [and] àti ìlà ẹ̀gbẹ́ { $border }
        [and-article] àti ìlà ẹ̀gbẹ́ { $border }
       *[with] pẹ̀lú ìlà ẹ̀gbẹ́ { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = àìkún

style-text =
    { $parts ->
        [background] { $color } lórí ẹ̀yìn { $background }
       *[plain] { $color }
    }

style-background-none = kò sí


## Boolean words

boolean-true = òótọ́
boolean-false = irọ́


## Answer buttons

answer-submit-label = Ṣàyẹ̀wò Iṣẹ́
answer-submit-label-no-correctness = Fi Ìdáhùn Ránṣẹ́


## Sectional blocks

section-name =
    .activity = Iṣẹ́ Ṣíṣe
    .aside = Àfikún
    .cascade = Ìtẹ̀lera
    .definition = Ìtumọ̀
    .example = Àpẹẹrẹ
    .exercise = Ìdánrawò
    .exercises = Àwọn Ìdánrawò
    .given-answer = Ìdáhùn
    .note = Àkíyèsí
    .objectives = Àwọn Àfojúsùn
    .paragraphs = Àwọn Ìpínrọ̀
    .part = Apá
    .problem = Ìṣòro
    .problems = Àwọn Ìṣòro
    .proof = Ẹ̀rí
    .question = Ìbéèrè
    .section = Ìpín
    .solution = Ìdáhùn Kíkún
    .task = Iṣẹ́
    .theorem = Ìlànà

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Ìtọ́ka


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tábìlì { $enumeration }
        [numbered-title] Tábìlì { $enumeration }{ ": " }
        [unnumbered-title] Tábìlì{ ": " }
       *[unnumbered] Tábìlì
    }

figure-name =
    { $parts ->
        [numbered] Àwòrán { $enumeration }
        [numbered-caption] Àwòrán { $enumeration }{ ": " }
        [unnumbered-caption] Àwòrán{ ": " }
       *[unnumbered] Àwòrán
    }


## Paginator controls

paginator-previous = Tẹ́lẹ̀
paginator-next = Tókàn
paginator-page = Ojú-ìwé

paginator-page-status = { $pageLabel } { $currentPage } nínú { $numPages }


## Piecewise functions

piecewise-condition-or = tàbí
piecewise-condition-if = bí
piecewise-condition-otherwise = bí bẹ́ẹ̀ kọ́


## Chemistry

# Yoruba is one of the catalogs that leaves `element-name` and
# `element-anion-name` out, so those 130 keys fall back to English. Nigerian
# secondary chemistry is taught in English, and the Yoruba terminology work
# that has named some of the elements has not reached a classroom or settled on
# one list — the English a learner falls back to is what their own textbook
# prints.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Àmì Kẹ́mìkà Tí Kò Tọ́
chemistry-invalid-ionic-compound = Àdàpọ̀ Áyọ́nì Tí Kò Tọ́
