# Hausa content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Hausa is the one language in this batch with `$gender` in the sense the
# argument was named for: every noun is masculine or feminine, and an attributive
# adjective agrees with it and links to it with -n or -r — «farin layi» against
# «farar da'ira». `noun-gender` therefore answers `m` and `f`, and answers them
# for real rather than uniformly.
#
# And nothing selects on it. That is worth saying so nobody adds a fork
# expecting to find one missing: Hausa has a handful of true adjectives and
# describes everything else with «mai …» — "having …" — which follows the noun
# and never changes shape. Every word this catalog needs is in that second
# class, so the agreement the language certainly has is not reachable from any
# of them. `noun-gender` is written out anyway: it costs a table, and a
# translator who reaches for «farin»/«farar» later finds the genders already
# decided and correct.
#
# `$role` goes unused: Hausa marks no case.


## Style vocabulary

# «mai launin …» — "of the colour …". Invariable, and follows its noun.
color =
    .black = mai launin baƙi
    .white = mai launin fari
    .gray = mai launin toka
    .red = mai launin ja
    .orange = mai launin lemu
    .yellow = mai launin rawaya
    .green = mai launin kore
    .cyan = mai launin shuɗin kore
    .blue = mai launin shuɗi
    .purple = mai launin shunayya
    .pink = mai launin ruwan hoda
    .brown = mai launin ruwan ƙasa

line-width =
    .thick = mai kauri
    .thin = mai sirara

line-style =
    .dashed = mai gutsattsari
    .dotted = mai ɗigogi

# Noun phrases: they follow «da» and modify nothing.
fill-style =
    .horizontal = layukan kwance
    .vertical = layukan tsaye
    .diagonal = layukan karkata
    .backdiagonal = layukan karkata ta wancan gefe
    .dots = ɗigogi
    .diamonds = lu'ulu'ai

noun =
    .line = layi
    .line-segment = gutsuren layi
    .ray = layin haske
    .vector = vekta
    .curve = lanƙwasa
    .function = aiki
    .parabola = parabola
    .polyline = layi mai gutsattsari
    .polygon = siffa mai gefuna da yawa
    .triangle = alwatika
    .rectangle = murabba'i mai tsawo
    .circle = da'ira
    .region = yanki
    .point = digo
    .square = murabba'i
    .diamond = lu'ulu'u
    .cross = giciye
    .plus = alamar tarawa

# The side count goes in the tail, behind the describing words, because «mai
# gefuna 5» is one more «mai …» phrase and Hausa strings them after the noun
# rather than folding one into it.
noun-regular-polygon =
    { $part ->
        [tail] mai gefuna { $numSides }
       *[head] siffa daidaitacciya
    }

# Real genders, and nothing here reads them. See the header.
noun-gender =
    { $noun ->
        [curve] f
        [parabola] f
        [polygon] f
        [circle] f
        [regular-polygon] f
        [plus] f
        [border] f
        [fill] f
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

# The noun leads and its «mai …» phrases follow, with the noun's own
# complement closing the phrase: «siffa daidaitacciya mai launin ja mai gefuna
# 5».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word = cike

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } da { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } da { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } da { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# Hausa has no article, and it joins a complement with the invariable «da», so
# all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] da iyaka { $border }
        [and] da iyaka { $border }
        [and-article] da iyaka { $border }
       *[with] da iyaka { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = ba a cika ba

style-text =
    { $parts ->
        [background] { $color } a bango { $background }
       *[plain] { $color }
    }

style-background-none = babu


## Boolean words

boolean-true = gaskiya
boolean-false = ƙarya


## Answer buttons

answer-submit-label = Duba Aiki
answer-submit-label-no-correctness = Aika Amsa


## Sectional blocks

section-name =
    .activity = Aiki
    .aside = Ƙarin bayani
    .cascade = Jerin gwano
    .definition = Ma'ana
    .example = Misali
    .exercise = Motsa jiki
    .exercises = Motsa jiki
    .given-answer = Amsa
    .note = Lura
    .objectives = Manufofi
    .paragraphs = Sakin layi
    .part = Sashe
    .problem = Matsala
    .problems = Matsaloli
    .proof = Hujja
    .question = Tambaya
    .section = Babi
    .solution = Mafita
    .task = Aiki
    .theorem = Ka'ida

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Alama


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tebur { $enumeration }
        [numbered-title] Tebur { $enumeration }{ ": " }
        [unnumbered-title] Tebur{ ": " }
       *[unnumbered] Tebur
    }

figure-name =
    { $parts ->
        [numbered] Hoto { $enumeration }
        [numbered-caption] Hoto { $enumeration }{ ": " }
        [unnumbered-caption] Hoto{ ": " }
       *[unnumbered] Hoto
    }


## Paginator controls

paginator-previous = Baya
paginator-next = Gaba
paginator-page = Shafi

paginator-page-status = { $pageLabel } { $currentPage } daga cikin { $numPages }


## Piecewise functions

piecewise-condition-or = ko
piecewise-condition-if = idan
piecewise-condition-otherwise = in ba haka ba


## Chemistry

# Hausa is one of the catalogs that leaves `element-name` and
# `element-anion-name` out, so those 130 keys fall back to English. Nigerian
# and Nigerien secondary chemistry is taught in English and French
# respectively, and no Hausa list of the elements has reached a classroom to
# seed from — a Hausa-ized spelling of the English words would be an invention
# rather than a translation.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Alamar Sinadari Mara Inganci
chemistry-invalid-ionic-compound = Haɗin Ayon Mara Inganci
