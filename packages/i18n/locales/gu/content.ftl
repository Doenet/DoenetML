# Gujarati content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Gujarati has three genders, and an adjective ending in -ો agrees with its
# noun: કાળો m, કાળી f, કાળું n. Adjectives precede the noun, as in English,
# so only the words change and not their order.
#
# `$role` goes unused, as it does in English: Gujarati does not inflect for
# case, and an adjective in front of a postposition is spelled exactly as it is
# standing alone. `$gender` alone carries every distinction the four positions
# make, because each already arrives with the gender of the noun it lands on —
# કિનારી f for `border-clause`, પૃષ્ઠભૂમિ f for `background-clause`, લખાણ n for
# `text-clause`, and the noun described for `standalone`. That is what
# `noun-gender` below is answering when it is asked about a head the
# description never names.
#
# Half the colour words do not agree at all. લાલ, સફેદ, રાખોડી, નારંગી,
# આસમાની, જાંબલી, ગુલાબી and કથ્થઈ end in a consonant or in -ી and are
# invariant in Gujarati, so they are written once and every branch reads the
# same.
#
# The postpositions follow their noun — «જાડી કાળી કિનારી સાથે» — so the
# `with`/`and` branches put the phrase first and the marker last, and the two
# `-article` branches read like the ones without: Gujarati has no article.
#
# Numbers render in Latin digits rather than in Gujarati numerals, which is the
# digit policy in the package README (#1615).


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] કાળી
            [n] કાળું
           *[m] કાળો
        }
    .white = સફેદ
    .gray = રાખોડી
    .red = લાલ
    .orange = નારંગી
    .yellow =
        { $gender ->
            [f] પીળી
            [n] પીળું
           *[m] પીળો
        }
    .green =
        { $gender ->
            [f] લીલી
            [n] લીલું
           *[m] લીલો
        }
    .cyan = આસમાની
    .blue = વાદળી
    .purple = જાંબલી
    .pink = ગુલાબી
    .brown = કથ્થઈ

line-width =
    .thick =
        { $gender ->
            [f] જાડી
            [n] જાડું
           *[m] જાડો
        }
    .thin =
        { $gender ->
            [f] પાતળી
            [n] પાતળું
           *[m] પાતળો
        }

# તૂટક ends in a consonant and never changes; ટપકાંવાળો does.
line-style =
    .dashed = તૂટક
    .dotted =
        { $gender ->
            [f] ટપકાંવાળી
            [n] ટપકાંવાળું
           *[m] ટપકાંવાળો
        }

# Noun phrases: they stand in front of the «સાથે» the composition messages
# supply, and agree with nothing.
fill-style =
    .horizontal = આડી લીટીઓ
    .vertical = ઊભી લીટીઓ
    .diagonal = ત્રાંસી લીટીઓ
    .backdiagonal = સામી ત્રાંસી લીટીઓ
    .dots = ટપકાં
    .diamonds = હીરા

noun =
    .line = રેખા
    .line-segment = રેખાખંડ
    .ray = કિરણ
    .vector = સદિશ
    .curve = વક્રરેખા
    .function = વિધેય
    .parabola = પરવલય
    .polyline = બહુરેખા
    .polygon = બહુકોણ
    .triangle = ત્રિકોણ
    .rectangle = લંબચોરસ
    .circle = વર્તુળ
    .region = પ્રદેશ
    .point = બિંદુ
    .square = ચોરસ
    .diamond = હીરો
    .cross = ચોકડી
    .plus = સરવાળાનું ચિહ્ન

# The side count precedes the noun, as every modifier in Gujarati does, so it
# folds into the head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } બાજુવાળો નિયમિત બહુકોણ
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (બહુકોણ, m) or the
# head of a phrase the description never names: `border` (કિનારી, f), `fill`
# (ભરણી, f), `text` (લખાણ, n), `background` (પૃષ્ઠભૂમિ, f).
noun-gender =
    { $noun ->
        [line] f
        [curve] f
        [polyline] f
        [cross] f
        [border] f
        [fill] f
        [background] f
        [ray] n
        [function] n
        [circle] n
        [point] n
        [plus] n
        [text] n
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

# Said only of the shape itself, so it agrees with the noun described.
style-filled-word =
    { $gender ->
        [f] ભરેલી
        [n] ભરેલું
       *[m] ભરેલો
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } { $pattern } સાથે
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } { $pattern } સાથે
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } { $pattern } સાથે
       *[plain] { $filled } { $color } { $noun }
    }

# «કિનારી» is feminine, so the border's adjectives agree with it and not with
# the shape it surrounds. Gujarati has no article, so the two `-article`
# branches read like the ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border } કિનારી સાથે
        [and] અને { $border } કિનારી સાથે
        [and-article] અને { $border } કિનારી સાથે
       *[with] { $border } કિનારી સાથે
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = ન ભરેલું

# «પૃષ્ઠભૂમિ» takes the postposition «પર», so the background leads and the text
# colour follows it.
style-text =
    { $parts ->
        [background] { $background } પૃષ્ઠભૂમિ પર { $color }
       *[plain] { $color }
    }

style-background-none = કંઈ નહીં


## Boolean words

boolean-true = સાચું
boolean-false = ખોટું


## Answer buttons

answer-submit-label = તપાસો
answer-submit-label-no-correctness = જવાબ મોકલો


## Sectional blocks

section-name =
    .activity = પ્રવૃત્તિ
    .aside = બાજુનોંધ
    .cascade = શ્રેણી
    .definition = વ્યાખ્યા
    .example = ઉદાહરણ
    .exercise = સ્વાધ્યાય
    .exercises = સ્વાધ્યાયો
    .given-answer = જવાબ
    .note = નોંધ
    .objectives = હેતુઓ
    .paragraphs = ફકરા
    .part = ભાગ
    .problem = સમસ્યા
    .problems = સમસ્યાઓ
    .proof = સાબિતી
    .question = પ્રશ્ન
    .section = વિભાગ
    .solution = ઉકેલ
    .task = કાર્ય
    .theorem = પ્રમેય

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = સંકેત


## Tables and figures

table-name =
    { $parts ->
        [numbered] કોષ્ટક { $enumeration }
        [numbered-title] કોષ્ટક { $enumeration }{ ": " }
        [unnumbered-title] કોષ્ટક{ ": " }
       *[unnumbered] કોષ્ટક
    }

figure-name =
    { $parts ->
        [numbered] આકૃતિ { $enumeration }
        [numbered-caption] આકૃતિ { $enumeration }{ ": " }
        [unnumbered-caption] આકૃતિ{ ": " }
       *[unnumbered] આકૃતિ
    }


## Paginator controls

paginator-previous = પાછલું
paginator-next = આગલું
paginator-page = પાનું

# The total leads, marked with «માંથી», which is how Gujarati says "3 of 5".
paginator-page-status = { $numPages } માંથી { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = અથવા
piecewise-condition-if = જો
piecewise-condition-otherwise = અન્યથા


## Chemistry

# The names Gujarati-medium school chemistry uses. Most are the international
# names written in Gujarati script; the handful that name a metal known long
# before its element was — લોખંડ, તાંબું, ચાંદી, સોનું, સીસું, કલાઈ, જસત,
# પારો — are the ordinary Gujarati words, which is what a textbook prints.
element-name =
    .h = હાઇડ્રોજન
    .he = હિલિયમ
    .li = લિથિયમ
    .be = બેરિલિયમ
    .b = બોરોન
    .c = કાર્બન
    .n = નાઇટ્રોજન
    .o = ઑક્સિજન
    .f = ફ્લોરિન
    .ne = નિયોન
    .na = સોડિયમ
    .mg = મૅગ્નેશિયમ
    .al = ઍલ્યુમિનિયમ
    .si = સિલિકોન
    .p = ફૉસ્ફરસ
    .s = સલ્ફર
    .cl = ક્લોરિન
    .ar = આર્ગોન
    .k = પોટૅશિયમ
    .ca = કૅલ્શિયમ
    .sc = સ્કૅન્ડિયમ
    .ti = ટાઇટેનિયમ
    .v = વેનેડિયમ
    .cr = ક્રોમિયમ
    .mn = મૅંગેનીઝ
    .fe = લોખંડ
    .co = કોબાલ્ટ
    .ni = નિકલ
    .cu = તાંબું
    .zn = જસત
    .ga = ગૅલિયમ
    .ge = જર્મેનિયમ
    .as = આર્સેનિક
    .se = સેલેનિયમ
    .br = બ્રોમિન
    .kr = ક્રિપ્ટોન
    .rb = રુબિડિયમ
    .sr = સ્ટ્રોન્શિયમ
    .y = યિટ્રિયમ
    .zr = ઝિર્કોનિયમ
    .nb = નાયોબિયમ
    .mo = મોલિબ્ડેનમ
    .tc = ટેક્નેશિયમ
    .ru = રુથેનિયમ
    .rh = રોડિયમ
    .pd = પેલેડિયમ
    .ag = ચાંદી
    .cd = કૅડમિયમ
    .in = ઇન્ડિયમ
    .sn = કલાઈ
    .sb = ઍન્ટિમની
    .te = ટેલ્યુરિયમ
    .i = આયોડિન
    .xe = ઝેનોન
    .cs = સીઝિયમ
    .ba = બેરિયમ
    .la = લેન્થેનમ
    .ce = સીરિયમ
    .pr = પ્રેસિયોડાયમિયમ
    .nd = નિયોડાયમિયમ
    .pm = પ્રોમિથિયમ
    .sm = સમેરિયમ
    .eu = યુરોપિયમ
    .gd = ગેડોલિનિયમ
    .tb = ટર્બિયમ
    .dy = ડિસ્પ્રોસિયમ
    .ho = હોલ્મિયમ
    .er = અર્બિયમ
    .tm = થુલિયમ
    .yb = યિટર્બિયમ
    .lu = લ્યુટેશિયમ
    .hf = હાફ્નિયમ
    .ta = ટેન્ટેલમ
    .w = ટંગ્સ્ટન
    .re = રીનિયમ
    .os = ઓસ્મિયમ
    .ir = ઇરિડિયમ
    .pt = પ્લેટિનમ
    .au = સોનું
    .hg = પારો
    .tl = થેલિયમ
    .pb = સીસું
    .bi = બિસ્મથ
    .po = પોલોનિયમ
    .at = એસ્ટેટિન
    .rn = રેડોન
    .fr = ફ્રાન્સિયમ
    .ra = રેડિયમ
    .ac = ઍક્ટિનિયમ
    .th = થોરિયમ
    .pa = પ્રોટેક્ટિનિયમ
    .u = યુરેનિયમ
    .np = નેપ્ચ્યુનિયમ
    .pu = પ્લુટોનિયમ
    .am = અમેરિસિયમ
    .cm = ક્યુરિયમ
    .bk = બર્કેલિયમ
    .cf = કૅલિફોર્નિયમ
    .es = આઇન્સ્ટાઇનિયમ
    .fm = ફર્મિયમ
    .md = મેન્ડેલેવિયમ
    .no = નોબેલિયમ
    .lr = લોરેન્સિયમ
    .rf = રધરફોર્ડિયમ
    .db = ડબ્નિયમ
    .sg = સીબોર્ગિયમ
    .bh = બોહરિયમ
    .hs = હેશિયમ
    .mt = માઇટ્નેરિયમ
    .ds = ડાર્મસ્ટેડિયમ
    .rg = રોન્ટજેનિયમ
    .cn = કોપરનિસિયમ
    .nh = નિહોનિયમ
    .fl = ફ્લેરોવિયમ
    .mc = મોસ્કોવિયમ
    .lv = લિવરમોરિયમ
    .ts = ટેનેસિન
    .og = ઓગેનેસન

element-anion-name =
    .h = હાઇડ્રાઇડ
    .c = કાર્બાઇડ
    .n = નાઇટ્રાઇડ
    .o = ઑક્સાઇડ
    .f = ફ્લોરાઇડ
    .p = ફૉસ્ફાઇડ
    .s = સલ્ફાઇડ
    .cl = ક્લોરાઇડ
    .br = બ્રોમાઇડ
    .i = આયોડાઇડ
    .at = એસ્ટેટાઇડ
    .ts = ટેનેસાઇડ

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = અમાન્ય રાસાયણિક સંજ્ઞા
chemistry-invalid-ionic-compound = અમાન્ય આયનીય સંયોજન
