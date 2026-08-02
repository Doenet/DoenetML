# Greek content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Greek inflects an adjective for gender and case, and yet `$role` needs only
# one distinction here. All three clause positions land on a **neuter** noun —
# «περίγραμμα», «φόντο», «κείμενο» — and the accusative that «με» and «σε»
# govern is spelled like the nominative in the neuter. So the three clause
# roles coincide in one form and only `standalone` selects on `$gender`:
#
#   standalone          nominative, agreeing with the noun described:
#                       `-ος` m, `-η` f, `-ο` n
#   border-clause       accusative after «με», of «περίγραμμα» — neuter: `-ο`
#   background-clause   accusative after «σε», of «φόντο» — neuter: `-ο`
#   text-clause         nominative neuter, agreeing with «κείμενο»
#
# Half the colour words do not agree at all. «γκρι», «μπλε», «ροζ», «μοβ»,
# «καφέ» and «πορτοκαλί» are loans and are indeclinable in Greek, so they are
# written once and are the same in every branch.
#
# Greek drops the indefinite article where English keeps it, so the `-article`
# branches of `style-border-clause` read the same as the ones without. That is
# also the safe answer: the article's own form depends on the sound that starts
# the word after it — the final-ν rule — which a catalog cannot see when that
# word is an argument.
#
# Adjectives precede their noun, as in English, so the composition messages
# keep the English order.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] μαύρο
            [background-clause] μαύρο
            [text-clause] μαύρο
           *[standalone]
                { $gender ->
                    [f] μαύρη
                    [n] μαύρο
                   *[m] μαύρος
                }
        }
    .white =
        { $role ->
            [border-clause] λευκό
            [background-clause] λευκό
            [text-clause] λευκό
           *[standalone]
                { $gender ->
                    [f] λευκή
                    [n] λευκό
                   *[m] λευκός
                }
        }
    .gray = γκρι
    .red =
        { $role ->
            [border-clause] κόκκινο
            [background-clause] κόκκινο
            [text-clause] κόκκινο
           *[standalone]
                { $gender ->
                    [f] κόκκινη
                    [n] κόκκινο
                   *[m] κόκκινος
                }
        }
    .orange = πορτοκαλί
    .yellow =
        { $role ->
            [border-clause] κίτρινο
            [background-clause] κίτρινο
            [text-clause] κίτρινο
           *[standalone]
                { $gender ->
                    [f] κίτρινη
                    [n] κίτρινο
                   *[m] κίτρινος
                }
        }
    .green =
        { $role ->
            [border-clause] πράσινο
            [background-clause] πράσινο
            [text-clause] πράσινο
           *[standalone]
                { $gender ->
                    [f] πράσινη
                    [n] πράσινο
                   *[m] πράσινος
                }
        }
    .cyan =
        { $role ->
            [border-clause] κυανό
            [background-clause] κυανό
            [text-clause] κυανό
           *[standalone]
                { $gender ->
                    [f] κυανή
                    [n] κυανό
                   *[m] κυανός
                }
        }
    .blue = μπλε
    .purple = μοβ
    .pink = ροζ
    .brown = καφέ

line-width =
    .thick =
        { $role ->
            [border-clause] χοντρό
            [background-clause] χοντρό
            [text-clause] χοντρό
           *[standalone]
                { $gender ->
                    [f] χοντρή
                    [n] χοντρό
                   *[m] χοντρός
                }
        }
    .thin =
        { $role ->
            [border-clause] λεπτό
            [background-clause] λεπτό
            [text-clause] λεπτό
           *[standalone]
                { $gender ->
                    [f] λεπτή
                    [n] λεπτό
                   *[m] λεπτός
                }
        }

line-style =
    .dashed =
        { $role ->
            [border-clause] διακεκομμένο
            [background-clause] διακεκομμένο
            [text-clause] διακεκομμένο
           *[standalone]
                { $gender ->
                    [f] διακεκομμένη
                    [n] διακεκομμένο
                   *[m] διακεκομμένος
                }
        }
    .dotted =
        { $role ->
            [border-clause] διάστικτο
            [background-clause] διάστικτο
            [text-clause] διάστικτο
           *[standalone]
                { $gender ->
                    [f] διάστικτη
                    [n] διάστικτο
                   *[m] διάστικτος
                }
        }

# These stand on their own in `style-fill` and follow «με» in `style-filled`,
# which governs the accusative — so every one of them is a feminine or neuter
# plural, where Greek spells the accusative like the nominative. That is why
# the diamonds are «σχήματα ρόμβου» and not «ρόμβοι», whose accusative
# «ρόμβους» would have been a second form the same words could not carry.
fill-style =
    .horizontal = οριζόντιες γραμμές
    .vertical = κατακόρυφες γραμμές
    .diagonal = διαγώνιες γραμμές
    .backdiagonal = αντίστροφες διαγώνιες γραμμές
    .dots = κουκκίδες
    .diamonds = σχήματα ρόμβου

noun =
    .line = ευθεία
    .line-segment = ευθύγραμμο τμήμα
    .ray = ημιευθεία
    .vector = διάνυσμα
    .curve = καμπύλη
    .function = συνάρτηση
    .parabola = παραβολή
    .polyline = τεθλασμένη γραμμή
    .polygon = πολύγωνο
    .triangle = τρίγωνο
    .rectangle = ορθογώνιο
    .circle = κύκλος
    .region = περιοχή
    .point = σημείο
    .square = τετράγωνο
    .diamond = ρόμβος
    .cross = σταυρός
    .plus = συν

# Greek counts the sides after the noun and in the genitive, which keeps the
# phrase clear of «με» — the preposition the border clause already uses:
# «χοντρό κόκκινο κανονικό πολύγωνο 5 πλευρών».
noun-regular-polygon =
    { $part ->
        [tail] { $numSides } πλευρών
       *[head] κανονικό πολύγωνο
    }

# Neuter is the default because most of these shapes are neuter, including all
# four heads a description names without listing: `border` (περίγραμμα),
# `fill` (γέμισμα), `text` (κείμενο), `background` (φόντο), and
# `regular-polygon` (πολύγωνο).
noun-gender =
    { $noun ->
        [line] f
        [ray] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [region] f
        [circle] m
        [diamond] m
        [cross] m
       *[other] n
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
        [f] γεμάτη
        [n] γεμάτο
       *[m] γεμάτος
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } με { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } με { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } με { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# Greek drops the indefinite article, so all four branches read alike apart
# from the conjunction.
style-border-clause =
    { $parts ->
        [with-article] με { $border } περίγραμμα
        [and] και { $border } περίγραμμα
        [and-article] και { $border } περίγραμμα
       *[with] με { $border } περίγραμμα
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

# A phrase rather than an adjective, so that it agrees with nothing: the shape
# it is said of can be any of the three genders.
style-unfilled = χωρίς γέμισμα

style-text =
    { $parts ->
        [background] { $color } σε { $background } φόντο
       *[plain] { $color }
    }

style-background-none = κανένα


## Boolean words

boolean-true = αληθές
boolean-false = ψευδές


## Answer buttons

answer-submit-label = Έλεγχος
answer-submit-label-no-correctness = Υποβολή απάντησης


## Sectional blocks

section-name =
    .activity = Δραστηριότητα
    .aside = Παρένθεση
    .cascade = Καταρράκτης
    .definition = Ορισμός
    .example = Παράδειγμα
    .exercise = Άσκηση
    .exercises = Ασκήσεις
    .given-answer = Απάντηση
    .note = Σημείωση
    .objectives = Στόχοι
    .paragraphs = Παράγραφοι
    .part = Μέρος
    .problem = Πρόβλημα
    .problems = Προβλήματα
    .proof = Απόδειξη
    .question = Ερώτηση
    .section = Ενότητα
    .solution = Λύση
    .task = Εργασία
    .theorem = Θεώρημα

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Υπόδειξη


## Tables and figures

table-name =
    { $parts ->
        [numbered] Πίνακας { $enumeration }
        [numbered-title] Πίνακας { $enumeration }{ ": " }
        [unnumbered-title] Πίνακας{ ": " }
       *[unnumbered] Πίνακας
    }

figure-name =
    { $parts ->
        [numbered] Σχήμα { $enumeration }
        [numbered-caption] Σχήμα { $enumeration }{ ": " }
        [unnumbered-caption] Σχήμα{ ": " }
       *[unnumbered] Σχήμα
    }


## Paginator controls

paginator-previous = Προηγούμενη
paginator-next = Επόμενη
paginator-page = Σελίδα

paginator-page-status = { $pageLabel } { $currentPage } από { $numPages }


## Piecewise functions

piecewise-condition-or = ή
piecewise-condition-if = αν
piecewise-condition-otherwise = αλλιώς


## Chemistry

element-name =
    .h = Υδρογόνο
    .he = Ήλιο
    .li = Λίθιο
    .be = Βηρύλλιο
    .b = Βόριο
    .c = Άνθρακας
    .n = Άζωτο
    .o = Οξυγόνο
    .f = Φθόριο
    .ne = Νέον
    .na = Νάτριο
    .mg = Μαγνήσιο
    .al = Αργίλιο
    .si = Πυρίτιο
    .p = Φώσφορος
    .s = Θείο
    .cl = Χλώριο
    .ar = Αργό
    .k = Κάλιο
    .ca = Ασβέστιο
    .sc = Σκάνδιο
    .ti = Τιτάνιο
    .v = Βανάδιο
    .cr = Χρώμιο
    .mn = Μαγγάνιο
    .fe = Σίδηρος
    .co = Κοβάλτιο
    .ni = Νικέλιο
    .cu = Χαλκός
    .zn = Ψευδάργυρος
    .ga = Γάλλιο
    .ge = Γερμάνιο
    .as = Αρσενικό
    .se = Σελήνιο
    .br = Βρώμιο
    .kr = Κρυπτό
    .rb = Ρουβίδιο
    .sr = Στρόντιο
    .y = Ύττριο
    .zr = Ζιρκόνιο
    .nb = Νιόβιο
    .mo = Μολυβδαίνιο
    .tc = Τεχνήτιο
    .ru = Ρουθήνιο
    .rh = Ρόδιο
    .pd = Παλλάδιο
    .ag = Άργυρος
    .cd = Κάδμιο
    .in = Ίνδιο
    .sn = Κασσίτερος
    .sb = Αντιμόνιο
    .te = Τελλούριο
    .i = Ιώδιο
    .xe = Ξένο
    .cs = Καίσιο
    .ba = Βάριο
    .la = Λανθάνιο
    .ce = Δημήτριο
    .pr = Πρασεοδύμιο
    .nd = Νεοδύμιο
    .pm = Προμήθειο
    .sm = Σαμάριο
    .eu = Ευρώπιο
    .gd = Γαδολίνιο
    .tb = Τέρβιο
    .dy = Δυσπρόσιο
    .ho = Όλμιο
    .er = Έρβιο
    .tm = Θούλιο
    .yb = Υττέρβιο
    .lu = Λουτήτιο
    .hf = Άφνιο
    .ta = Ταντάλιο
    .w = Βολφράμιο
    .re = Ρήνιο
    .os = Όσμιο
    .ir = Ιρίδιο
    .pt = Λευκόχρυσος
    .au = Χρυσός
    .hg = Υδράργυρος
    .tl = Θάλλιο
    .pb = Μόλυβδος
    .bi = Βισμούθιο
    .po = Πολώνιο
    .at = Άστατο
    .rn = Ραδόνιο
    .fr = Φράγκιο
    .ra = Ράδιο
    .ac = Ακτίνιο
    .th = Θόριο
    .pa = Πρωτακτίνιο
    .u = Ουράνιο
    .np = Ποσειδώνιο
    .pu = Πλουτώνιο
    .am = Αμερίκιο
    .cm = Κιούριο
    .bk = Μπερκέλιο
    .cf = Καλιφόρνιο
    .es = Αϊνσταΐνιο
    .fm = Φέρμιο
    .md = Μεντελέβιο
    .no = Νομπέλιο
    .lr = Λωρένσιο
    .rf = Ραδερφόρντιο
    .db = Ντούμπνιο
    .sg = Σιμπόργκιο
    .bh = Μπόριο
    .hs = Χάσιο
    .mt = Μαϊτνέριο
    .ds = Νταρμστάντιο
    .rg = Ρεντγκένιο
    .cn = Κοπερνίκιο
    .nh = Νιχόνιο
    .fl = Φλερόβιο
    .mc = Μοσχόβιο
    .lv = Λιβερμόριο
    .ts = Τενέσιο
    .og = Ογκανέσιο

element-anion-name =
    .h = Υδρίδιο
    .c = Καρβίδιο
    .n = Νιτρίδιο
    .o = Οξείδιο
    .f = Φθορίδιο
    .p = Φωσφίδιο
    .s = Σουλφίδιο
    .cl = Χλωρίδιο
    .br = Βρωμίδιο
    .i = Ιωδίδιο
    .at = Αστατίδιο
    .ts = Τενεσίδιο

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Μη έγκυρο χημικό σύμβολο
chemistry-invalid-ionic-compound = Μη έγκυρη ιοντική ένωση
