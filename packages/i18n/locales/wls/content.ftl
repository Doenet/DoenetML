# Wallisian (Fakaʻuvea) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **The endonym is «Fakaʻuvea»**, after ʻUvea (Wallis), and CLDR has no name
# for `wls` in any language, so `LOCALE_NAME_FALLBACKS` supplies both halves by
# hand: `englishName` "Wallisian", `endonym` "Fakaʻuvea". See `chrome.ftl`,
# which carries the full note.
#
# **Orthography.** Standard ʻUvean spelling: the glottal stop is «ʻ» (U+02BB, a
# letter), vowel length is the macron «ā ē ī ō ū», and **/ŋ/ is written «g»** —
# «gāue», not Tongan «ngāue». The plural article is «te ʻu», not «ngaahi».
# `chrome.ftl` tabulates the whole set of differences from `locales/to`, which
# is this locale's nearest existing sibling and was read line by line while
# this file was written.
#
# **The contact language is French**, so every loan below is French-mediated
# rather than English-mediated: «tapelo» (tableau) where Tongan has «tēpile»,
# «pasina» (page) where it has «peesi», «vekitele» (vecteur) where it has
# «veketā», «palapole» (parabole) where it has «palapola», «poligone»
# (polygone) where it has «polikoni», «koluse» (croix) where it has «kolosi».
# All of those are this seed's coinages by the ordinary loan phonology and are
# flagged as such.
#
# **No grammatical gender.** `noun-gender` answers one token for every noun and
# **nothing in these four files forks on `$gender`**, in the shape `locales/sm`
# and `locales/tpi` already use.
#
# **No `$role` fork either.** Wallisian does not inflect a noun or an adjective
# for case, and none of the three clause positions changes the shape of a word:
# what changes is the preposition in front of the phrase, and that preposition
# is written in the composition message rather than in the word. A `$role`
# branch would render what the branch under it already renders.
#
# **The adjectives follow the noun** — «laina kula», a red line — so every
# composition message inverts the English order, as `locales/to`, `locales/ty`
# and `locales/fj` do.
#
# **Where the colour table does not fit English's twelve keys.** «lanu» plus a
# thing of that colour is the Polynesian pattern, so blue is «lanumoana», the
# colour of the deep sea, and green «lanumata», the colour of unripe growth;
# the boundary between them falls where the sea meets the land rather than
# where English puts it. `.cyan` is the key with no answer at all — it lands
# inside «lanumoana» with nothing to separate it — and the French-mediated
# «siane» written there is a placeholder a speaker should replace or delete.
# `.yellow` is «felo», which is where this file most visibly disagrees with
# `locales/to`'s «engeenga»; `.purple`, `.pink` and `.brown` are loans.
#
# **One deliberate split from `locales/to` worth naming.** «poini» (French
# «point») is a mark of credit in `chrome.ftl`, and the geometric point here is
# **«togi»**, a dot or mark. Tongan writes «poini» for both. Splitting them
# keeps the same English word from coming out as one Wallisian word in two
# unrelated roles, which is the one thing these four files are checked against
# each other for.
#
# **Known residue.** «kapa» (border), «taimane» (diamond), «fefiofi»
# (compound) and «aʻusia» (accessibility) are written in their Tongan shape
# with ʻUvean spelling, because this seed could not establish a distinctly
# Wallisian word for any of the four. They are the first places a reviewer
# should look for a word that is actually said on ʻUvea.


## Style vocabulary

color =
    .black = ʻuliʻuli
    .white = hina
    .gray = ʻefuʻefu
    .red = kula
    .orange = moli
    .yellow = felo
    .green = lanumata
    .cyan = siane
    .blue = lanumoana
    .purple = violeti
    .pink = lose
    .brown = melo
line-width =
    .thick = matolu
    .thin = manifinifi
line-style =
    .dashed = motumotu
    .dotted = togitogi
# Noun phrases. Wallisian marks no plural on the noun, so «laina» is the word
# for one line and for many alike.
fill-style =
    .horizontal = laina fakatokalalo
    .vertical = laina fakatuʻu
    .diagonal = laina fakahekeheke
    .backdiagonal = laina fakahekeheke fakafoki
    .dots = togi
    .diamonds = taimane
noun =
    .line = laina
    .line-segment = koga laina
    .ray = huelo
    .vector = vekitele
    .curve = pikopiko
    .function = gāue fika
    .slope-field = malaʻe hekeheke
    .vector-field = malaʻe vekitele
    .parabola = palapole
    .polyline = laina tuʻo lahi
    .polygon = poligone
    .triangle = tapatolu
    .rectangle = tapafā loloa
    .circle = fuopotopoto
    .region = feituʻu
    .point = togi
    .square = tapafā tatau
    .diamond = taimane
    .cross = koluse
    .plus = tānaki
# The side count follows the adjectives as a complement, so that they stay
# beside the noun they describe.
noun-regular-polygon =
    { $part ->
        [tail] ʻe tapa { $numSides }
       *[head] poligone tatau
    }
# One answer for every noun: Wallisian has no grammatical gender.
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
# The noun first and the adjectives behind it, which is the opposite of English.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word = fonu
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } mo te { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } mo te { $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } mo te { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# Wallisian's articles are «te» (definite) and «he» (indefinite), and neither is
# doing what English's "a" does here, so all four branches read alike but for
# the connective: «mo te» opens the first clause and «pea mo te» a further one.
style-border-clause =
    { $parts ->
        [with-article] mo te kapa { $border }
        [and] pea mo te kapa { $border }
        [and-article] pea mo te kapa { $border }
       *[with] mo te kapa { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = mole fonu
style-text =
    { $parts ->
        [background] { $color } mo te tuʻuga { $background }
       *[plain] { $color }
    }
style-background-none = mole he taha

## Boolean words

boolean-true = moʻoni
boolean-false = loi

## Answer buttons

answer-submit-label = Sivi te gāue
answer-submit-label-no-correctness = ʻAve te tali

## Sectional blocks

# `.exercise` and `.exercises`, and `.problem` and `.problems`, are one word
# each: Wallisian marks no plural on the noun.
#
# `.cascade`, `.paragraphs`, `.problem`, `.theorem` and `.note` are
# French-mediated loans coined by this seed — «kasikate» (cascade),
# «palakalafe» (paragraphe), «polopelema» (problème), «teoleme» (théorème),
# «nota» (note). `.solution` is «solusio» (solution), where `locales/to` writes
# the native «Fakalelei»; a reviewer who prefers a native word here should say
# so, since this is the one loan below that displaces an available Polynesian
# term.
section-name =
    .activity = Gāue
    .aside = Fakamatala kehe
    .cascade = Kasikate
    .definition = Fakaʻuhiga
    .example = Fakatātā
    .exercise = Gāue fakaako
    .exercises = Gāue fakaako
    .given-answer = Tali
    .note = Nota
    .objectives = Taumuʻa
    .paragraphs = Palakalafe
    .part = Koga
    .problem = Polopelema
    .problems = Polopelema
    .proof = Fakamoʻoni
    .question = Fehuʻi
    .section = Vahe
    .solution = Solusio
    .task = Gāue
    .theorem = Teoleme
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Fakahinohino

## Tables and figures

# «Tapelo» is French «tableau» and «Ata» is the native word for a picture or
# image, where `locales/to` writes the English-mediated «Tēpile» and the
# native «Fakatātā». «Fakatātā» is kept above for `.example`, so no word does
# two jobs across these files.
table-name =
    { $parts ->
        [numbered] Tapelo { $enumeration }
        [numbered-title] Tapelo { $enumeration }{ ": " }
        [unnumbered-title] Tapelo{ ": " }
       *[unnumbered] Tapelo
    }
figure-name =
    { $parts ->
        [numbered] Ata { $enumeration }
        [numbered-caption] Ata { $enumeration }{ ": " }
        [unnumbered-caption] Ata{ ": " }
       *[unnumbered] Ata
    }

## Paginator controls

paginator-previous = Muʻa
paginator-next = Hoko
paginator-page = Pasina
paginator-page-status = { $pageLabel } { $currentPage } ʻo te { $numPages }

## Piecewise functions

piecewise-condition-or = pe
piecewise-condition-if = kapau
piecewise-condition-otherwise = kapau ʻe mole

## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. ʻUvea's schooling is French-medium — the periodic table a Wallisian
## pupil meets is printed in French — and Wallisian has no settled list of all
## 118 to seed from. Supplying one would report a fact about a curriculum
## rather than about the language, which is the case `locales/to`,
## `locales/sm` and `locales/haw` already record, with French in the place of
## English. A reviewer who wants the names here should copy `locales/fr`'s
## deliberately rather than have this seed guess at Wallisian ones.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Fakaʻiloga kemikale hala
chemistry-invalid-ionic-compound = Fefiofi ʻioniki hala

## Inputs embedded in math

# «ava», a gap or opening. Read aloud inside the mathematics and never shown on
# screen, so it stays to one word.
math-embedded-input-blank = ava
math-embedded-input-blank-ordinal = ava { $ordinal } ʻo te { $total }
