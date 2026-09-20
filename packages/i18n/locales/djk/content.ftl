# Aukan / Ndyuka (Okanisi tongo) content catalog: the prose the core computes
# into the document. Selected by `documentLocale` — the language the activity
# was written in. Translated from `locales/en/content.ftl`, which is the
# source of truth.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The SIL Ndyuka orthography: a **doubled vowel writes
# length** («puu», «kibii», «wooko», «gaan», «baaka»); there are **no
# consonant + `r` clusters** at all, so «kiin» not *krin*, «taa» not *tra*,
# «gaantangi» not *grantangi*; «u» never «oe» and «y» never «j»; and **tone is
# not written**, as the Ndyuka dictionary and scriptures leave it. Ndyuka is a
# tone language and that is a real loss the orthography accepts, stated here
# rather than passed over. Sranan Tongo spellings and Saramaccan spellings are
# **not mixed into these files**; `chrome.ftl`'s header sets the system out
# point by point.
#
# **Word order: the modifier comes before the noun.** Ndyuka puts an
# attributive adjective in front of its head — «wan deki lebi lin» is *a thick
# red line*, in that order. So every composition message here **keeps the
# English order**: `style-with-noun` puts the description first and the noun
# after it, and `style-stroke` runs width, then dash pattern, then colour.
# `noun-regular-polygon` is the one that moves: Ndyuka counts a side with a
# following «anga { $numSides } sei», so the count follows the noun instead of
# preceding it as English's «5-sided» does. It still goes in the `head`
# branch, because it stays beside the noun rather than after the adjectives.
#
# **No grammatical gender and no agreement.** Ndyuka adjectives do not inflect
# for gender, number or case, so no message here forks on `$gender` or on
# `$role`, and `noun-gender` answers a single token that nothing reads.
#
# **Number.** `Intl.PluralRules("djk")` has no CLDR data for `djk` and falls
# back to English's `['one', 'other']`, which is not a fact about Ndyuka. A
# noun after a numeral is unmarked — «dii punt»; the plural marker «den» is
# preposed and marks definiteness, not counting. So **nothing in this file
# selects on a count**.
#
# **The chemistry tables are deliberately absent.** `element-name` and
# `element-anion-name` are the only English keys this file does not cover.
# Science in Suriname is schooled in Dutch, from Dutch textbooks; there is no
# Ndyuka periodic table in use and no settled Ndyuka spelling for the hundred
# and eighteen names. Reshaping the Dutch list to Ndyuka phonology would be
# inventing a nomenclature rather than recording one. `lint:i18n` reports the
# two keys as missing coverage, and that report is correct: they fall back to
# English.
#
# **Loans.** Dutch and English reshaped to Ndyuka phonology: «vekitoo»,
# «funsi», «palabola», «poligon», «polilin», «definisi», «teorema»,
# «eksempee», «seksi», «palagaaf», «kaskade», «nota», «bewisi», «tabel»,
# «figuu», «pagina», «intavalu», «kediti». Ndyuka's own words carry the rest:
# «lin», «punt», «lontu» (*circle*), «diiuku» (*triangle*, literally
# three-corner), «fokanti» (*square*, four-corner), «kookotu lin» (*curved
# line*), «kanti» (*border*), «bakagoon» (*background*), «fuu» (*full*),
# «tuu» / «falisi». Seven colour names — «asisi kula», «alanya kula», «syan»,
# «paasi», «loosu», «boon», «geli» — are the least certain entries here; a
# reviewer should check them first.


color =
    .black = baaka
    .white = weti
    .gray = asisi kula
    .red = lebi
    .orange = alanya kula
    .yellow = geli
    .green = guun
    .cyan = syan
    .blue = buluu
    .purple = paasi
    .pink = loosu
    .brown = boon

line-width =
    .thick = deki
    .thin = fini

line-style =
    .dashed = koti-koti
    .dotted = punt-punt

fill-style =
    .horizontal = lin di e go langalanga
    .vertical = lin di e go tapu-ondoo
    .diagonal = lin di e go a kaanti
    .backdiagonal = lin di e go a taa kaanti
    .dots = punt
    .diamonds = diamanti

noun =
    .line = lin
    .line-segment = pisi lin
    .ray = sitaali
    .vector = vekitoo
    .curve = kookotu lin
    .function = funsi
    .slope-field = helin-feeld
    .vector-field = vekitoo-feeld
    .parabola = palabola
    .polyline = polilin
    .polygon = poligon
    .triangle = diiuku
    .rectangle = langa fokanti
    .circle = lontu
    .region = peesi
    .point = punt
    .square = fokanti
    .diamond = diamanti
    .cross = kooisi
    .plus = pulusi

noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] gelijki poligon anga { $numSides } sei
    }

noun-gender = neuter


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

style-filled-word = fuu

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } anga { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } anga { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } anga { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

style-border-clause =
    { $parts ->
        [with-article] anga wan { $border } kanti
        [and] anga { $border } kanti
        [and-article] anga wan { $border } kanti
       *[with] anga { $border } kanti
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = no fuu

style-text =
    { $parts ->
        [background] { $color } anga wan { $background } bakagoon
       *[plain] { $color }
    }

style-background-none = no wan


boolean-true = tuu
boolean-false = falisi


answer-submit-label = Luku a wooko

answer-submit-label-no-correctness = Seni a piki


section-name =
    .activity = Aktiviteiti
    .aside = Sei-toli
    .cascade = Kaskade
    .definition = Definisi
    .example = Eksempee
    .exercise = Oefeni
    .exercises = Den oefeni
    .given-answer = Piki
    .note = Nota
    .objectives = Den dulu
    .paragraphs = Palagaaf
    .part = Pisi
    .problem = Pooblema
    .problems = Den pooblema
    .proof = Bewisi
    .question = Akisi
    .section = Seksi
    .solution = Lusu
    .task = Opodaakiti
    .theorem = Teorema

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Tipi


table-name =
    { $parts ->
        [numbered] Tabel { $enumeration }
        [numbered-title] Tabel { $enumeration }{ ": " }
        [unnumbered-title] Tabel{ ": " }
       *[unnumbered] Tabel
    }

figure-name =
    { $parts ->
        [numbered] Figuu { $enumeration }
        [numbered-caption] Figuu { $enumeration }{ ": " }
        [unnumbered-caption] Figuu{ ": " }
       *[unnumbered] Figuu
    }


paginator-previous = Baka
paginator-next = Fesi
paginator-page = Pagina

paginator-page-status = { $pageLabel } { $currentPage } fu { $numPages }


piecewise-condition-or = noso

piecewise-condition-if = efu

piecewise-condition-otherwise = efu a no so


ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = A kemi-maiki no bun
chemistry-invalid-ionic-compound = A ioniki mokisani no bun


math-embedded-input-blank = leigi peesi

math-embedded-input-blank-ordinal = leigi peesi { $ordinal } fu { $total }
