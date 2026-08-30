# Saramaccan (Saamáka tongo) content catalog: the prose the core computes into
# the document. Selected by `documentLocale` — the language the activity was
# written in. Translated from `locales/en/content.ftl`, which is the source of
# truth.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The standard Saramaccan orthography of the Rountree / Glock
# dictionary and of the Saramaccan scriptures: seven vowel letters `a e ë i o
# ö u`, with `ë` (U+00EB) and `ö` (U+00F6) as letters in their own right; a
# **doubled vowel writes length** («puu», «hii», «gaan», «baaka»);
# **nasality is written with an `n` after the vowel** («an», «en», «in», «on»,
# «un»), that `n` belonging to the vowel and not being a consonant of its own;
# prenasalized stops `mb`, `nd`, `ng`; `tj` and `dj` for the palatal
# affricates; and initial `h` («hopo», «hakisi», «hii», «hën»).
#
# **Tone is NOT written in this catalog, and that is a real loss.** Saramaccan
# is a tone language; the dictionary and the scriptures mark tone with
# accents, and tone distinguishes words otherwise spelled alike. These four
# files leave it unmarked throughout. A reviewer restoring it is adding
# information the files do not carry. The only accented letter outside `ë` and
# `ö` is **«á», the preverbal negator**, spelled with its accent because that
# is the negator's spelling, not a tone mark.
#
# **Saramaccan is Portuguese- as well as English-lexified**, and the
# Portuguese stratum is kept where the language has it: «alanza» (*orange*,
# *laranja*), «ezempu» (*example*, *exemplo*), «kaba», «kuma», «ku» (*and*,
# *com*), «sikifi», «manda». Ndyuka, in `locales/djk`, is a different language
# — its preverbal «e» and «be» are not Saramaccan's «ta» and «bi», and the two
# catalogs are not two spellings of one text.
#
# **Word order: the modifier comes before the noun.** Saramaccan puts an
# attributive adjective in front of its head — «wan dëkë bëë lin» is *a thick
# red line*, in that order. So every composition message here **keeps the
# English order**: `style-with-noun` puts the description first and the noun
# after it, and `style-stroke` runs width, then dash pattern, then colour.
# `noun-regular-polygon` is the one that moves: Saramaccan counts a side with
# a following «ku { $numSides } sei», so the count follows the noun instead of
# preceding it as English's «5-sided» does. It stays in the `head` branch,
# because it stays beside the noun rather than after the adjectives.
#
# **No grammatical gender and no agreement.** Saramaccan adjectives do not
# inflect for gender, number or case, so no message here forks on `$gender` or
# on `$role`, and `noun-gender` answers a single token that nothing reads.
#
# **Number.** `Intl.PluralRules("srm")` has no CLDR data for `srm` and falls
# back to English's `['one', 'other']`, which is not a fact about Saramaccan.
# A noun after a numeral is unmarked — «dii punti»; the plural marker «dee» is
# preposed and marks definiteness, not counting. So **nothing in this file
# selects on a count**.
#
# **The chemistry tables are deliberately absent.** `element-name` and
# `element-anion-name` are the only English keys this file does not cover.
# Science in Suriname is schooled in Dutch, from Dutch textbooks; there is no
# Saramaccan periodic table in use and no settled Saramaccan spelling for the
# hundred and eighteen names. Reshaping the Dutch list to Saramaccan phonology
# would be inventing a nomenclature rather than recording one. `lint:i18n`
# reports the two keys as missing coverage, and that report is correct: they
# fall back to English.
#
# **Loans.** Dutch and English reshaped to Saramaccan phonology: «vekitoo»,
# «funsi», «palabola», «poligon», «polilin», «definisi», «teolema», «seksi»,
# «palagaaf», «kaskade», «nota», «beweisi», «tabel», «figuu», «pagina»,
# «intavalu», «punti». Saramaccan's own words carry the rest: «lin», «lontu»
# (*circle*), «diiuku» (*triangle*, three-corner), «fokanti» (*square*,
# four-corner), «kookotu lin» (*curved line*), «kanti» (*border*), «bakagoon»
# (*background*), «fuu» (*full*), «tuu» / «falisi». Seven colour names —
# «asisi kulo», «alanza kulo», «sian», «paasi», «loosu», «buun», «geli» — are
# the least certain entries here, and «lo» for *row* in `chrome.ftl` is the
# next; a reviewer should check those first.


color =
    .black = baaka
    .white = weti
    .gray = asisi kulo
    .red = lebi
    .orange = alanza kulo
    .yellow = geli
    .green = guun
    .cyan = sian
    .blue = bulu
    .purple = paasi
    .pink = loosu
    .brown = buun

line-width =
    .thick = dëkë
    .thin = fini

line-style =
    .dashed = koti-koti
    .dotted = punti-punti

fill-style =
    .horizontal = lin di ta go longilongi
    .vertical = lin di ta go hei-basu
    .diagonal = lin di ta go a kanti
    .backdiagonal = lin di ta go a di woto kanti
    .dots = punti
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
    .rectangle = longi fokanti
    .circle = lontu
    .region = pisi peesi
    .point = punti
    .square = fokanti
    .diamond = diamanti
    .cross = koloisi
    .plus = pulusi

noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] leguleeu poligon ku { $numSides } sei
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
        [pattern] { $filled } { $color } ku { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } ku { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } ku { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

style-border-clause =
    { $parts ->
        [with-article] ku wan { $border } kanti
        [and] ku { $border } kanti
        [and-article] ku wan { $border } kanti
       *[with] ku { $border } kanti
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = á fuu

style-text =
    { $parts ->
        [background] { $color } ku wan { $background } bakagoon
       *[plain] { $color }
    }

style-background-none = na wan


boolean-true = tuu
boolean-false = falisi


answer-submit-label = Luku di wooko

answer-submit-label-no-correctness = Manda di piki


section-name =
    .activity = Aktiviteiti
    .aside = Sei-toli
    .cascade = Kaskade
    .definition = Definisi
    .example = Ezempu
    .exercise = Oefeni
    .exercises = Dee oefeni
    .given-answer = Piki
    .note = Nota
    .objectives = Dee dulu
    .paragraphs = Palagaaf
    .part = Pisi
    .problem = Pooblema
    .problems = Dee pooblema
    .proof = Beweisi
    .question = Hakisi
    .section = Seksi
    .solution = Lusu
    .task = Opodakiti
    .theorem = Teolema

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

paginator-page-status = { $pageLabel } { $currentPage } u { $numPages }


piecewise-condition-or = ofu

piecewise-condition-if = ee

piecewise-condition-otherwise = ee á de so


ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Di kemi-maiki á bunu
chemistry-invalid-ionic-compound = Di ioniki mokisisoni á bunu


math-embedded-input-blank = lëigi peesi

math-embedded-input-blank-ordinal = lëigi peesi { $ordinal } u { $total }
