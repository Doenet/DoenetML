# Georgian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Georgian has seven cases and no grammatical gender, and an attributive
# adjective agrees for case in exactly one of the four positions here. A
# consonant-stem adjective — the ones spelled with a final -ი — keeps that -ი in
# the nominative, the genitive and the instrumental, and drops it in the dative:
#
#   standalone          nominative: «წითელი»
#   border-clause       instrumental, agreeing with «ჩარჩოთი»: «წითელი»
#   background-clause   dative, before the postposition -ზე: «წითელ»
#   text-clause         nominative, agreeing with «ტექსტი»: «წითელი»
#
# So only `background-clause` is written out below, and the other three fall to
# the default — the same shape `locales/pa` has, arrived at from a different
# grammar. It is written out for the colours alone: only a colour is ever looked
# up in that position, so the widths and the dash patterns are plain values.
# Which words move is a fact about the word rather than the position: «მწვანე»
# ends in a vowel and never truncates, so green reads alike in all four.
#
# The border and the fill patterns are marked by an instrumental ending on the
# noun rather than by a preposition, so `style-border-clause` and `style-filled`
# place nothing in front of what they govern. Georgian has no letter case, so a
# heading word is spelled here the way it is spelled anywhere else.


## Style vocabulary

# `.green` is a vowel stem: it has no -ი to drop, so it is the one colour that
# does not move between the positions. The note sits here rather than beside the
# attribute because an indented `#` line is more of the pattern above it, not a
# comment — see the README's note on multiline patterns.
color =
    .black =
        { $role ->
            [background-clause] შავ
           *[standalone] შავი
        }
    .white =
        { $role ->
            [background-clause] თეთრ
           *[standalone] თეთრი
        }
    .gray =
        { $role ->
            [background-clause] ნაცრისფერ
           *[standalone] ნაცრისფერი
        }
    .red =
        { $role ->
            [background-clause] წითელ
           *[standalone] წითელი
        }
    .orange =
        { $role ->
            [background-clause] ნარინჯისფერ
           *[standalone] ნარინჯისფერი
        }
    .yellow =
        { $role ->
            [background-clause] ყვითელ
           *[standalone] ყვითელი
        }
    .green = მწვანე
    .cyan =
        { $role ->
            [background-clause] ცისფერ
           *[standalone] ცისფერი
        }
    .blue =
        { $role ->
            [background-clause] ლურჯ
           *[standalone] ლურჯი
        }
    .purple =
        { $role ->
            [background-clause] იისფერ
           *[standalone] იისფერი
        }
    .pink =
        { $role ->
            [background-clause] ვარდისფერ
           *[standalone] ვარდისფერი
        }
    .brown =
        { $role ->
            [background-clause] ყავისფერ
           *[standalone] ყავისფერი
        }

# Only a colour is ever looked up in `background-clause`, so a width and a dash
# pattern reach just the nominative and the instrumental, where they read alike.
# No select is written here: the dative form these words would take there is
# unreachable.
line-width =
    .thick = სქელი
    .thin = თხელი

line-style =
    .dashed = წყვეტილი
    .dotted = წერტილოვანი

# Instrumental plurals — the case that renders as "with" in English. The ending
# carries the sense, so nothing is written in front of them where they are
# placed.
fill-style =
    .horizontal = ჰორიზონტალური ხაზებით
    .vertical = ვერტიკალური ხაზებით
    .diagonal = დიაგონალური ხაზებით
    .backdiagonal = უკუდიაგონალური ხაზებით
    .dots = წერტილებით
    .diamonds = რომბებით

noun =
    .line = წრფე
    .line-segment = მონაკვეთი
    .ray = სხივი
    .vector = ვექტორი
    .curve = მრუდი
    .function = ფუნქცია
    .parabola = პარაბოლა
    .polyline = ტეხილი
    .polygon = მრავალკუთხედი
    .triangle = სამკუთხედი
    .rectangle = მართკუთხედი
    .circle = წრეწირი
    .region = არე
    .point = წერტილი
    .square = კვადრატი
    .diamond = რომბი
    .cross = ჯვარი
    .plus = პლუსი

# Georgian builds the word from the side count in front of the noun, so the
# whole of it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] წესიერი { $numSides }-კუთხედი
    }

# Georgian has no grammatical gender, so every noun answers the same and the
# answer goes unused. What this catalog agrees for is case, which `$role`
# carries.
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

style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }

# A participle, which stands here in the nominative and takes neither argument.
style-filled-word = შევსებული

# `{ $pattern }` is already instrumental, so no connective is written.
style-filled =
    { $parts ->
        [pattern] { $color } { $filled } { $pattern }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $color } { $filled } { $noun } { $pattern }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $color } { $filled } { $noun } { $nounTail } { $pattern }
       *[plain] { $color } { $filled } { $noun }
    }

# «ჩარჩოთი» is the instrumental of «ჩარჩო», and it is the ending rather than a
# preposition that says "with" — so the clause opens on the border's own
# adjectives, which the instrumental leaves in their nominative shape. Georgian
# has no article, so the two `-article` branches read like the two without.
style-border-clause =
    { $parts ->
        [with-article] { $border } ჩარჩოთი
        [and] და { $border } ჩარჩოთი
        [and-article] და { $border } ჩარჩოთი
       *[with] { $border } ჩარჩოთი
    }

style-fill =
    { $parts ->
        [pattern] { $color } შევსება { $pattern }
       *[plain] { $color } შევსება
    }

style-unfilled = შეუვსებელი

# «ფონზე» is the dative of «ფონი» plus the postposition -ზე, and it is the
# dative that truncates the colour in front of it. The text colour beside it is
# nominative, agreeing with «ტექსტი».
style-text =
    { $parts ->
        [background] { $background } ფონზე { $color }
       *[plain] { $color }
    }

style-background-none = არ არის


## Boolean words

boolean-true = ჭეშმარიტი
boolean-false = მცდარი


## Answer buttons

answer-submit-label = შემოწმება
answer-submit-label-no-correctness = პასუხის გაგზავნა


## Sectional blocks

section-name =
    .activity = აქტივობა
    .aside = გვერდითი შენიშვნა
    .cascade = კასკადი
    .definition = განსაზღვრება
    .example = მაგალითი
    .exercise = სავარჯიშო
    .exercises = სავარჯიშოები
    .given-answer = პასუხი
    .note = შენიშვნა
    .objectives = მიზნები
    .paragraphs = აბზაცები
    .part = ნაწილი
    .problem = ამოცანა
    .problems = ამოცანები
    .proof = დამტკიცება
    .question = კითხვა
    .section = სექცია
    .solution = ამოხსნა
    .task = დავალება
    .theorem = თეორემა

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ". " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ". " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = მინიშნება


## Tables and figures

table-name =
    { $parts ->
        [numbered] ცხრილი { $enumeration }
        [numbered-title] ცხრილი { $enumeration }{ ". " }
        [unnumbered-title] ცხრილი{ ". " }
       *[unnumbered] ცხრილი
    }

figure-name =
    { $parts ->
        [numbered] ნახაზი { $enumeration }
        [numbered-caption] ნახაზი { $enumeration }{ ". " }
        [unnumbered-caption] ნახაზი{ ". " }
       *[unnumbered] ნახაზი
    }


## Paginator controls

paginator-previous = წინა
paginator-next = შემდეგი
paginator-page = გვერდი

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = ან
piecewise-condition-if = თუ
piecewise-condition-otherwise = წინააღმდეგ შემთხვევაში


## Chemistry

element-name =
    .h = წყალბადი
    .he = ჰელიუმი
    .li = ლითიუმი
    .be = ბერილიუმი
    .b = ბორი
    .c = ნახშირბადი
    .n = აზოტი
    .o = ჟანგბადი
    .f = ფტორი
    .ne = ნეონი
    .na = ნატრიუმი
    .mg = მაგნიუმი
    .al = ალუმინი
    .si = სილიციუმი
    .p = ფოსფორი
    .s = გოგირდი
    .cl = ქლორი
    .ar = არგონი
    .k = კალიუმი
    .ca = კალციუმი
    .sc = სკანდიუმი
    .ti = ტიტანი
    .v = ვანადიუმი
    .cr = ქრომი
    .mn = მანგანუმი
    .fe = რკინა
    .co = კობალტი
    .ni = ნიკელი
    .cu = სპილენძი
    .zn = თუთია
    .ga = გალიუმი
    .ge = გერმანიუმი
    .as = დარიშხანი
    .se = სელენი
    .br = ბრომი
    .kr = კრიპტონი
    .rb = რუბიდიუმი
    .sr = სტრონციუმი
    .y = იტრიუმი
    .zr = ცირკონიუმი
    .nb = ნიობიუმი
    .mo = მოლიბდენი
    .tc = ტექნეციუმი
    .ru = რუთენიუმი
    .rh = როდიუმი
    .pd = პალადიუმი
    .ag = ვერცხლი
    .cd = კადმიუმი
    .in = ინდიუმი
    .sn = კალა
    .sb = სტიბიუმი
    .te = ტელური
    .i = იოდი
    .xe = ქსენონი
    .cs = ცეზიუმი
    .ba = ბარიუმი
    .la = ლანთანი
    .ce = ცერიუმი
    .pr = პრაზეოდიმი
    .nd = ნეოდიმი
    .pm = პრომეთიუმი
    .sm = სამარიუმი
    .eu = ევროპიუმი
    .gd = გადოლინიუმი
    .tb = ტერბიუმი
    .dy = დისპროზიუმი
    .ho = ჰოლმიუმი
    .er = ერბიუმი
    .tm = თულიუმი
    .yb = იტერბიუმი
    .lu = ლუტეციუმი
    .hf = ჰაფნიუმი
    .ta = ტანტალი
    .w = ვოლფრამი
    .re = რენიუმი
    .os = ოსმიუმი
    .ir = ირიდიუმი
    .pt = პლატინა
    .au = ოქრო
    .hg = ვერცხლისწყალი
    .tl = თალიუმი
    .pb = ტყვია
    .bi = ბისმუტი
    .po = პოლონიუმი
    .at = ასტატი
    .rn = რადონი
    .fr = ფრანციუმი
    .ra = რადიუმი
    .ac = აქტინიუმი
    .th = თორიუმი
    .pa = პროტაქტინიუმი
    .u = ურანი
    .np = ნეპტუნიუმი
    .pu = პლუტონიუმი
    .am = ამერიციუმი
    .cm = კიურიუმი
    .bk = ბერკელიუმი
    .cf = კალიფორნიუმი
    .es = აინშტაინიუმი
    .fm = ფერმიუმი
    .md = მენდელევიუმი
    .no = ნობელიუმი
    .lr = ლოურენსიუმი
    .rf = რეზერფორდიუმი
    .db = დუბნიუმი
    .sg = სიბორგიუმი
    .bh = ბორიუმი
    .hs = ჰასიუმი
    .mt = მაიტნერიუმი
    .ds = დარმშტადტიუმი
    .rg = რენტგენიუმი
    .cn = კოპერნიციუმი
    .nh = ნიჰონიუმი
    .fl = ფლეროვიუმი
    .mc = მოსკოვიუმი
    .lv = ლივერმორიუმი
    .ts = ტენესინი
    .og = ოგანესონი

element-anion-name =
    .h = ჰიდრიდი
    .c = კარბიდი
    .n = ნიტრიდი
    .o = ოქსიდი
    .f = ფტორიდი
    .p = ფოსფიდი
    .s = სულფიდი
    .cl = ქლორიდი
    .br = ბრომიდი
    .i = იოდიდი
    .at = ასტატიდი
    .ts = ტენესიდი

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = არასწორი ქიმიური სიმბოლო
chemistry-invalid-ionic-compound = არასწორი იონური ნაერთი
