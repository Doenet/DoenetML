# Norman (Nouormand) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Which Norman.** The tag `nrf` covers Jèrriais, Guernésiais (with
# Sercquiais and Auregnais) and continental Norman — Cotentinais, Augeron,
# Cauchois. There is no pan-Norman standard, so this catalog is written in
# **Jèrriais**, in the orthography of **Le Maistre's *Dictionnaire
# Jersiais–Français* (1966)**, which is the only Norman variety with a
# settled dictionary tradition behind it. A Guernésiais or continental
# reviewer should expect to respell rather than to correct. See `chrome.ftl`
# for the letter-by-letter account of the spelling: the dental **«th»**,
# **«bl» → «bli»**, **«pl» → «ply»**, **«tch»** and **«dg»** for the
# palatals.
#
# **Word order: the adjective follows the noun.** Norman is Gallo-Romance and
# postposes its describing words, so the composition messages at the foot of
# this file **invert** the English order: `style-with-noun` and
# `style-filled-with-noun` put «{ $noun }» in front of «{ $description }».
#
# **The catalog really agrees.** Jèrriais has two genders and a live feminine,
# so every adjective below selects on `$gender`: **«nièr/nièthe»**,
# **«blianc/blianche»**, «gris/grise», «vèrt/vèrte», **«bliu/bliue»**,
# «violet/violette», «brun/brune», «êpais/êpaisse», «fîn/fîne»,
# **«remplyi/remplyie»**. Four colour words are **invariable** — «rouoge»,
# «jaune», «rose», «orange», plus the loan «cyan» — and are cited in one
# shape. The uneven table is a fact about Norman adjective morphology, not an
# unfinished branch. Nothing selects on `$role`: a clause position is carried
# by a preposition here, never by the adjective's own form.
#
# **The two dash patterns are prepositional phrases, not adjectives.** «à
# traits» (dashed) and «à points» (dotted) are how Jèrriais says it, and a
# phrase cannot sit between two adjectives, so `style-stroke` **reorders**
# the pieces to width – colour – pattern. A thick dashed red line therefore
# reads «ligne êpaisse rouoge à traits», not the English width-style-colour
# order. This is the one place the catalog changes the sequence of the
# description rather than only its word forms.
#
# **The word for a line is «ligne» everywhere**, in this file and in
# `diagnostics.ftl`, for the drawn stroke and for the geometric object alike.
# Le Maistre records no separate Jèrriais term for a geometric line, and
# inventing one for the sake of a distinction English does not make would be
# coining rather than translating. The sister catalogs `wa` and `frp` do
# split the two words; this one deliberately does not.
#
# `noun-regular-polygon` splits the way French does: the head is «polygône
# régulyi» and the tail «à N côtés», and `style-with-noun` puts the tail
# straight after the head so the complement stays beside the noun it belongs
# to rather than being stranded behind the adjectives.
#
# **What is borrowed.** The colours, the shapes, the everyday words and the
# connectives are Norman: «ligne», «point», «carré», **«crouaix»**,
# «courbe», **«borduthe»**, «côté», «fond», **«auve»** (*with*), «sans»,
# «sus», «ou», «si», «autrément», «vrai», «faux», «rein», and the negator
# **«pon»**. The mathematical and editorial nouns are **French, respelled by
# Le Maistre's rules**: «segment», «vecteu», «fonction», «parabole»,
# «polygône», **«triangl'ye»**, **«rectangl'ye»**, **«cèrcl'ye»**,
# **«rédgion»**, «horizontal», «vèrtical», «diagonal», «activité»,
# «dêfinition», **«exempl'ye»**, «exercice», «objectif», «paragraphe»,
# «théorème», «solution», «cascade», **«tabl'ye»**, **«figuthe»»,
# «symbole», «composé», «ionique». Schooling in Jersey is in **English**, so
# this register is a written-French inheritance rather than a spoken one, and
# «remplîssage» for a fill and «losange» for a diamond are the two least
# certain words in the file.
#
# **Counts.** `Intl.PluralRules` has **no CLDR data for `nrf`**, so no
# `[zero]`, `[two]`, `[few]` or `[many]` branch appears anywhere in this
# catalog — and nothing in this file counts, so no message here writes a
# plural select at all. `noun-regular-polygon` says «à 1 côté» and «à 5
# côtés» with one word: the numeral does the work and this catalog does not
# inflect around it.
#
# **The chemistry tables are deliberately absent.** `element-name` and
# `element-anion-name` are the only English keys this file does not cover.
# There is no published Norman list of the hundred and eighteen elements, and
# science in Jersey is taught in **English**, on the English curriculum — the
# periodic table a Jersey pupil actually meets is `locales/en`'s, which is
# precisely what these two keys fall back to. In continental Normandy it is
# `locales/fr`'s. `lint:i18n` reporting the two keys as missing coverage is
# the correct report. `ion-name-oxidation-state` and the two invalid-symbol
# messages **are** covered: they are frames, not vocabulary.
#
# **Punctuation.** Jersey typography follows English practice: no space
# before `:`, `;`, `?` or `!`, and the separators in `section-title-prefix`
# and in the table and figure names are the English ones.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] nièthe
           *[m] nièr
        }
    .white =
        { $gender ->
            [f] blianche
           *[m] blianc
        }
    .gray =
        { $gender ->
            [f] grise
           *[m] gris
        }
    .red = rouoge
    .orange = orange
    .yellow = jaune
    .green =
        { $gender ->
            [f] vèrte
           *[m] vèrt
        }
    .cyan = cyan
    .blue =
        { $gender ->
            [f] bliue
           *[m] bliu
        }
    .purple =
        { $gender ->
            [f] violette
           *[m] violet
        }
    .pink = rose
    .brown =
        { $gender ->
            [f] brune
           *[m] brun
        }
line-width =
    .thick =
        { $gender ->
            [f] êpaisse
           *[m] êpais
        }
    .thin =
        { $gender ->
            [f] fîne
           *[m] fîn
        }
# Prepositional phrases, not adjectives: they agree with nothing, and
# `style-stroke` moves them behind the colour for that reason.
line-style =
    .dashed = à traits
    .dotted = à points
# Plural noun phrases, which is what follows «auve des» in `style-filled`.
# They agree with nothing.
fill-style =
    .horizontal = lignes horizontales
    .vertical = lignes vèrticales
    .diagonal = lignes diagonales
    .backdiagonal = lignes diagonales à l'invèrs
    .dots = points
    .diamonds = losanges
noun =
    .line = ligne
    .line-segment = segment
    .ray = d'mi-ligne
    .vector = vecteu
    .curve = courbe
    .function = fonction
    .slope-field = champ des pentes
    .vector-field = champ des vecteurs
    .parabola = parabole
    .polyline = ligne brisée
    .polygon = polygône
    .triangle = triangl'ye
    .rectangle = rectangl'ye
    .circle = cèrcl'ye
    .region = rédgion
    .point = point
    .square = carré
    .diamond = losange
    .cross = crouaix
    .plus = signe plus
# The head carries the agreement and the tail closes the phrase, so the side
# count stays beside its own noun. «côté» is regular: «à 1 côté»,
# «à 5 côtés» — the numeral does the counting and the noun follows it.
noun-regular-polygon =
    { $part ->
        [tail] à { $numSides } côtés
       *[head] polygône régulyi
    }
# Besides the nouns above, `$noun` can be `regular-polygon` («polygône», m)
# or the head of a phrase the description never names: `border` («borduthe»,
# f), `fill` («remplîssage», m), `text` («texte», m), `background»
# («fond», m).
noun-gender =
    { $noun ->
        [line] f
        [ray] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [region] f
        [cross] f
        [border] f
       *[other] m
    }

## Style composition

# The order is width – colour – pattern, not English's width – pattern –
# colour: «à traits» and «à points» are prepositional phrases and cannot
# stand between two adjectives.
style-stroke =
    { $parts ->
        [width-style-color] { $width } { $color } { $lineStyle }
        [width-color] { $width } { $color }
        [style-color] { $color } { $lineStyle }
        [width-style] { $width } { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }
# The noun leads and its adjectives follow, which is the opposite of English.
# A noun that splits keeps its complement beside its own head: «polygône
# régulyi à 5 côtés êpais rouoge».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }
style-filled-word =
    { $gender ->
        [f] remplyie
       *[m] remplyi
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } auve des { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } auve des { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } auve des { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «borduthe» is feminine, so the border's adjectives agree with it and not
# with the shape it surrounds. Jèrriais wants the article in every branch, so
# only the conjunction tells the four apart.
style-border-clause =
    { $parts ->
        [with-article] auve eune borduthe { $border }
        [and] et eune borduthe { $border }
        [and-article] et eune borduthe { $border }
       *[with] auve eune borduthe { $border }
    }
# The fill-pattern words are plural nouns, because their other use is the
# «auve des { $pattern }» clause above. So this message supplies a noun for
# the colour to hang off — «remplîssage», masculine, which is the gender
# `noun-gender` already answers for `fill`.
style-fill =
    { $parts ->
        [pattern] remplîssage { $color } auve des { $pattern }
       *[plain] remplîssage { $color }
    }
style-unfilled = pon remplyi
style-text =
    { $parts ->
        [background] { $color } sus un fond { $background }
       *[plain] { $color }
    }
style-background-none = rein

## Boolean words

boolean-true = vrai
boolean-false = faux

## Answer buttons

answer-submit-label = Vèrifier l'travas
answer-submit-label-no-correctness = Env'yer la rêponse

## Sectional blocks

section-name =
    .activity = Activité
    .aside = Note à côté
    .cascade = Cascade
    .definition = Dêfinition
    .example = Exempl'ye
    .exercise = Exercice
    .exercises = Exercices
    .given-answer = Rêponse
    .note = Note
    .objectives = Objectifs
    .paragraphs = Paragraphes
    .part = Partie
    .problem = Problème
    .problems = Problèmes
    .proof = Preuve
    .question = Tchestion
    .section = Section
    .solution = Solution
    .task = Tâche
    .theorem = Théorème
# Jersey typography follows English practice, so the separator has no space
# before the colon.
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Endice

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabl'ye { $enumeration }
        [numbered-title] Tabl'ye { $enumeration }{ ": " }
        [unnumbered-title] Tabl'ye{ ": " }
       *[unnumbered] Tabl'ye
    }
figure-name =
    { $parts ->
        [numbered] Figuthe { $enumeration }
        [numbered-caption] Figuthe { $enumeration }{ ": " }
        [unnumbered-caption] Figuthe{ ": " }
       *[unnumbered] Figuthe
    }

## Paginator controls

paginator-previous = Prêcédent
paginator-next = Siêvant
paginator-page = Page
paginator-page-status = { $pageLabel } { $currentPage } sus { $numPages }

## Piecewise functions

piecewise-condition-or = ou
piecewise-condition-if = si
piecewise-condition-otherwise = autrément

## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English — which in Jersey is not a compromise but the right answer:
## science there is taught in English, on the English curriculum, so the
## periodic table a pupil meets is exactly `locales/en`'s. In continental
## Normandy it is `locales/fr`'s. There is no settled Norman table for a seed
## to reproduce. See the header.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Symbole chimique pon valabl'ye
chemistry-invalid-ionic-compound = Composé ionique pon valabl'ye

## Inputs embedded in math

math-embedded-input-blank = blianc
math-embedded-input-blank-ordinal = blianc { $ordinal } sus { $total }
