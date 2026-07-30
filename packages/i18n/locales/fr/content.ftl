# French content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# French inflects. Adjectives follow their noun and agree with it in gender, so
# every adjective below selects on `$gender`, the gender of the noun it
# describes, and the composition messages put the noun first. Neither is
# expressible by substituting into the English word order, which is why the
# catalog controls the order and not the code.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] noire
           *[m] noir
        }
    .white =
        { $gender ->
            [f] blanche
           *[m] blanc
        }
    .gray =
        { $gender ->
            [f] grise
           *[m] gris
        }
    .red = rouge
    .orange = orange
    .yellow = jaune
    .green =
        { $gender ->
            [f] verte
           *[m] vert
        }
    .cyan = cyan
    .blue =
        { $gender ->
            [f] bleue
           *[m] bleu
        }
    .purple =
        { $gender ->
            [f] violette
           *[m] violet
        }
    .pink = rose
    .brown = marron

line-width =
    .thick =
        { $gender ->
            [f] épaisse
           *[m] épais
        }
    .thin =
        { $gender ->
            [f] fine
           *[m] fin
        }

line-style =
    .dashed =
        { $gender ->
            [f] discontinue
           *[m] discontinu
        }
    .dotted =
        { $gender ->
            [f] pointillée
           *[m] pointillé
        }

# Noun phrases: they follow «avec des» and agree with nothing. All six are
# plural, which is what lets one article cover them all.
fill-style =
    .horizontal = lignes horizontales
    .vertical = lignes verticales
    .diagonal = lignes diagonales
    .backdiagonal = lignes diagonales inverses
    .dots = points
    .diamonds = losanges

noun =
    .line = ligne
    .line-segment = segment
    .ray = demi-droite
    .vector = vecteur
    .curve = courbe
    .function = fonction
    .parabola = parabole
    .polyline = ligne brisée
    .polygon = polygone
    .triangle = triangle
    .rectangle = rectangle
    .circle = cercle
    .region = région
    .point = point
    .square = carré
    .diamond = losange
    .cross = croix
    .plus = signe plus

# The noun is split: «polygone régulier» carries the agreement and
# «à 5 côtés» closes the phrase, so the complement stays beside its own head
# rather than being stranded after the adjectives.
noun-regular-polygon =
    { $part ->
        [tail] à { $numSides } côtés
       *[head] polygone régulier
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (the shape
# `noun-regular-polygon` names) or the head of a phrase the description never
# names: `border`, `fill`, `text`, `background`. Of those only «bordure» is
# feminine; «remplissage», «texte», «arrière-plan» and «polygone» fall to the
# default.
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

# The noun leads and its adjectives follow: «ligne épaisse rouge». A noun with
# a complement keeps it: «polygone régulier à 5 côtés épais rouge».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }

style-filled-word =
    { $gender ->
        [f] remplie
       *[m] rempli
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } avec des { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } avec des { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } avec des { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# «bordure» is feminine, so the border's adjectives agree with it and not with
# the shape it surrounds. French wants the article in every branch, so only the
# conjunction distinguishes them.
style-border-clause =
    { $parts ->
        [with-article] avec une bordure { $border }
        [and] et une bordure { $border }
        [and-article] et une bordure { $border }
       *[with] avec une bordure { $border }
    }

# «de couleur» avoids having to agree the color with a plural pattern noun.
style-fill =
    { $parts ->
        [pattern] { $pattern } de couleur { $color }
       *[plain] { $color }
    }

style-unfilled = non rempli

style-text =
    { $parts ->
        [background] { $color } sur un fond { $background }
       *[plain] { $color }
    }

style-background-none = aucun


## Boolean words

boolean-true = vrai
boolean-false = faux


## Answer buttons

answer-submit-label = Vérifier
answer-submit-label-no-correctness = Envoyer la réponse


## Sectional blocks

section-name =
    .activity = Activité
    .aside = Encadré
    .cascade = Cascade
    .definition = Définition
    .example = Exemple
    .exercise = Exercice
    .exercises = Exercices
    .given-answer = Réponse
    .note = Note
    .objectives = Objectifs
    .paragraphs = Paragraphes
    .part = Partie
    .problem = Problème
    .problems = Problèmes
    .proof = Démonstration
    .question = Question
    .section = Section
    .solution = Solution
    .task = Tâche
    .theorem = Théorème

# French puts a space before a colon, which is why the separator differs from
# the English one rather than being reused.
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ " : " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ " : " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Indice


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tableau { $enumeration }
        [numbered-title] Tableau { $enumeration }{ " : " }
        [unnumbered-title] Tableau{ " : " }
       *[unnumbered] Tableau
    }

figure-name =
    { $parts ->
        [numbered] Figure { $enumeration }
        [numbered-caption] Figure { $enumeration }{ " : " }
        [unnumbered-caption] Figure{ " : " }
       *[unnumbered] Figure
    }


## Paginator controls

paginator-previous = Précédent
paginator-next = Suivant
paginator-page = Page

paginator-page-status = { $pageLabel } { $currentPage } sur { $numPages }


## Piecewise functions

piecewise-condition-or = ou
piecewise-condition-if = si
piecewise-condition-otherwise = sinon


## Chemistry

element-name =
    .h = Hydrogène
    .he = Hélium
    .li = Lithium
    .be = Béryllium
    .b = Bore
    .c = Carbone
    .n = Azote
    .o = Oxygène
    .f = Fluor
    .ne = Néon
    .na = Sodium
    .mg = Magnésium
    .al = Aluminium
    .si = Silicium
    .p = Phosphore
    .s = Soufre
    .cl = Chlore
    .ar = Argon
    .k = Potassium
    .ca = Calcium
    .sc = Scandium
    .ti = Titane
    .v = Vanadium
    .cr = Chrome
    .mn = Manganèse
    .fe = Fer
    .co = Cobalt
    .ni = Nickel
    .cu = Cuivre
    .zn = Zinc
    .ga = Gallium
    .ge = Germanium
    .as = Arsenic
    .se = Sélénium
    .br = Brome
    .kr = Krypton
    .rb = Rubidium
    .sr = Strontium
    .y = Yttrium
    .zr = Zirconium
    .nb = Niobium
    .mo = Molybdène
    .tc = Technétium
    .ru = Ruthénium
    .rh = Rhodium
    .pd = Palladium
    .ag = Argent
    .cd = Cadmium
    .in = Indium
    .sn = Étain
    .sb = Antimoine
    .te = Tellure
    .i = Iode
    .xe = Xénon
    .cs = Césium
    .ba = Baryum
    .la = Lanthane
    .ce = Cérium
    .pr = Praséodyme
    .nd = Néodyme
    .pm = Prométhium
    .sm = Samarium
    .eu = Europium
    .gd = Gadolinium
    .tb = Terbium
    .dy = Dysprosium
    .ho = Holmium
    .er = Erbium
    .tm = Thulium
    .yb = Ytterbium
    .lu = Lutécium
    .hf = Hafnium
    .ta = Tantale
    .w = Tungstène
    .re = Rhénium
    .os = Osmium
    .ir = Iridium
    .pt = Platine
    .au = Or
    .hg = Mercure
    .tl = Thallium
    .pb = Plomb
    .bi = Bismuth
    .po = Polonium
    .at = Astate
    .rn = Radon
    .fr = Francium
    .ra = Radium
    .ac = Actinium
    .th = Thorium
    .pa = Protactinium
    .u = Uranium
    .np = Neptunium
    .pu = Plutonium
    .am = Américium
    .cm = Curium
    .bk = Berkélium
    .cf = Californium
    .es = Einsteinium
    .fm = Fermium
    .md = Mendélévium
    .no = Nobélium
    .lr = Lawrencium
    .rf = Rutherfordium
    .db = Dubnium
    .sg = Seaborgium
    .bh = Bohrium
    .hs = Hassium
    .mt = Meitnérium
    .ds = Darmstadtium
    .rg = Roentgenium
    .cn = Copernicium
    .nh = Nihonium
    .fl = Flérovium
    .mc = Moscovium
    .lv = Livermorium
    .ts = Tennesse
    .og = Oganesson

element-anion-name =
    .h = Hydrure
    .c = Carbure
    .n = Nitrure
    .o = Oxyde
    .f = Fluorure
    .p = Phosphure
    .s = Sulfure
    .cl = Chlorure
    .br = Bromure
    .i = Iodure
    .at = Astature
    .ts = Tennessure

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Symbole chimique invalide
chemistry-invalid-ionic-compound = Composé ionique invalide
