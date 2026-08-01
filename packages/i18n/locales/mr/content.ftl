# Marathi content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Marathi selects on both arguments, and on more of each than any catalog
# before it. Adjectives ending in -आ inflect for **three** genders — काळा /
# काळी / काळे — where Hindi has two, and they take a further *oblique* form in
# -या before a noun governed by a postposition. Adjectives not ending in -आ —
# लाल, नारिंगी, सायन, गुलाबी, तपकिरी, जाड, बारीक, तुटक, ठिपकेदार — never
# change, and answer the same in every branch.
#
# So `$role` sorts the four positions into three forms:
#
#   standalone          direct, agreeing with the noun described — three ways
#   border-clause       oblique, before किनारीसह
#   background-clause   oblique, before पार्श्वभूमीवर
#   text-clause         direct masculine, agreeing with मजकूर
#
# CLDR counts Marathi in Devanagari digits, and DoenetML does not: every
# number renders in Latin digits under Marathi's own grouping, which is India's
# twos above the first thousand (#1615). A side count therefore reads `1,234`
# rather than `१,२३४`, and matches the mathematics beside it.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] काळ्या
            [background-clause] काळ्या
            [text-clause] काळा
           *[standalone]
                { $gender ->
                    [f] काळी
                    [n] काळे
                   *[m] काळा
                }
        }
    .white =
        { $role ->
            [border-clause] पांढऱ्या
            [background-clause] पांढऱ्या
            [text-clause] पांढरा
           *[standalone]
                { $gender ->
                    [f] पांढरी
                    [n] पांढरे
                   *[m] पांढरा
                }
        }
    .gray =
        { $role ->
            [border-clause] करड्या
            [background-clause] करड्या
            [text-clause] करडा
           *[standalone]
                { $gender ->
                    [f] करडी
                    [n] करडे
                   *[m] करडा
                }
        }
    .red = लाल
    .orange = नारिंगी
    .yellow =
        { $role ->
            [border-clause] पिवळ्या
            [background-clause] पिवळ्या
            [text-clause] पिवळा
           *[standalone]
                { $gender ->
                    [f] पिवळी
                    [n] पिवळे
                   *[m] पिवळा
                }
        }
    .green =
        { $role ->
            [border-clause] हिरव्या
            [background-clause] हिरव्या
            [text-clause] हिरवा
           *[standalone]
                { $gender ->
                    [f] हिरवी
                    [n] हिरवे
                   *[m] हिरवा
                }
        }
    .cyan = सायन
    .blue =
        { $role ->
            [border-clause] निळ्या
            [background-clause] निळ्या
            [text-clause] निळा
           *[standalone]
                { $gender ->
                    [f] निळी
                    [n] निळे
                   *[m] निळा
                }
        }
    .purple =
        { $role ->
            [border-clause] जांभळ्या
            [background-clause] जांभळ्या
            [text-clause] जांभळा
           *[standalone]
                { $gender ->
                    [f] जांभळी
                    [n] जांभळे
                   *[m] जांभळा
                }
        }
    .pink = गुलाबी
    .brown = तपकिरी

# Neither ends in -आ, so neither inflects.
line-width =
    .thick = जाड
    .thin = बारीक

line-style =
    .dashed = तुटक
    .dotted = ठिपकेदार

# Plural nouns rather than adjectives: वापरून ("using") takes them bare, and
# `style-fill` sets them straight after a colour word that agrees with the fill
# rather than with them.
fill-style =
    .horizontal = आडव्या रेषा
    .vertical = उभ्या रेषा
    .diagonal = तिरप्या रेषा
    .backdiagonal = उलट तिरप्या रेषा
    .dots = ठिपके
    .diamonds = समभुज चौकोन

noun =
    .line = रेषा
    .line-segment = रेषाखंड
    .ray = किरण
    .vector = सदिश
    .curve = वक्र
    .function = फलन
    .parabola = अन्वस्त
    .polyline = बहुरेषा
    .polygon = बहुभुज
    .triangle = त्रिकोण
    .rectangle = आयत
    .circle = वर्तुळ
    .region = प्रदेश
    .point = बिंदू
    .square = चौरस
    .diamond = समभुज चौकोन
    .cross = फुली
    .plus = अधिक चिन्ह

# बाजूंचा agrees with बहुभुज, which is masculine, so the count attaches to the
# noun that follows and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } बाजूंचा नियमित बहुभुज
    }

# Besides the nouns above, `$noun` may be «regular-polygon» (बहुभुज, m) or the
# head of a phrase the description does not name: «border» (किनार, f), «fill»
# (भरण, n), «text» (मजकूर, m), «background» (पार्श्वभूमी, f).
noun-gender =
    { $noun ->
        [line] f
        [polyline] f
        [cross] f
        [border] f
        [background] f
        [function] n
        [circle] n
        [plus] n
        [fill] n
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

# Only ever said of the shape itself, so it is standalone in every description
# and takes no `$role` branch.
style-filled-word =
    { $gender ->
        [f] भरलेली
        [n] भरलेले
       *[m] भरलेला
    }

# वापरून ("using") is invariable and takes the pattern bare, so the clause
# English appends comes to the front here.
style-filled =
    { $parts ->
        [pattern] { $pattern } वापरून { $filled } { $color }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } वापरून { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern } वापरून { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }

# -सह is a postposition, so किनार goes oblique to किनारी- and the adjectives in
# front of it take the oblique -या that `border-clause` supplies. Marathi has
# no article, which leaves the `-article` branches reading like the others.
style-border-clause =
    { $parts ->
        [with-article] { $border } किनारीसह
        [and] आणि { $border } किनारीसह
        [and-article] आणि { $border } किनारीसह
       *[with] { $border } किनारीसह
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

# Invariable, because nothing is passed to agree it with.
style-unfilled = भरणविरहित

# -वर is a postposition too, so the background's colour is oblique; the text's
# own colour, which follows, agrees with मजकूर and is direct masculine.
style-text =
    { $parts ->
        [background] { $background } पार्श्वभूमीवर { $color }
       *[plain] { $color }
    }

style-background-none = काहीही नाही


## Boolean words

boolean-true = खरे
boolean-false = खोटे


## Answer buttons

answer-submit-label = तपासा
answer-submit-label-no-correctness = उत्तर पाठवा


## Sectional blocks

section-name =
    .activity = कृती
    .aside = बाजूटीप
    .cascade = कॅस्केड
    .definition = व्याख्या
    .example = उदाहरण
    .exercise = सराव
    .exercises = सराव
    .given-answer = उत्तर
    .note = टीप
    .objectives = उद्दिष्टे
    .paragraphs = परिच्छेद
    .part = भाग
    .problem = समस्या
    .problems = समस्या
    .proof = सिद्धता
    .question = प्रश्न
    .section = विभाग
    .solution = उकल
    .task = कार्य
    .theorem = प्रमेय

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = सूचना


## Tables and figures

table-name =
    { $parts ->
        [numbered] सारणी { $enumeration }
        [numbered-title] सारणी { $enumeration }{ ": " }
        [unnumbered-title] सारणी{ ": " }
       *[unnumbered] सारणी
    }

figure-name =
    { $parts ->
        [numbered] आकृती { $enumeration }
        [numbered-caption] आकृती { $enumeration }{ ": " }
        [unnumbered-caption] आकृती{ ": " }
       *[unnumbered] आकृती
    }


## Paginator controls

paginator-previous = मागील
paginator-next = पुढील
paginator-page = पृष्ठ

# «X पैकी Y» — "Y out of X" — puts the total first, so the two counts change
# places.
paginator-page-status = { $numPages } पैकी { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = किंवा

piecewise-condition-if = जर

piecewise-condition-otherwise = अन्यथा


## Chemistry
##
## The names Marathi-medium school chemistry uses in Maharashtra: native words
## for the elements known before the nomenclature was borrowed — लोह, तांबे,
## जस्त, कथिल, चांदी, सोने, पारा, शिसे and गंधक — and transliterations for the
## rest. Symbols and formulas are untouched.

element-name =
    .h = हायड्रोजन
    .he = हेलियम
    .li = लिथियम
    .be = बेरिलियम
    .b = बोरॉन
    .c = कार्बन
    .n = नायट्रोजन
    .o = ऑक्सिजन
    .f = फ्लोरिन
    .ne = निऑन
    .na = सोडियम
    .mg = मॅग्नेशियम
    .al = ॲल्युमिनियम
    .si = सिलिकॉन
    .p = फॉस्फरस
    .s = गंधक
    .cl = क्लोरिन
    .ar = आरगॉन
    .k = पोटॅशियम
    .ca = कॅल्शियम
    .sc = स्कँडियम
    .ti = टिटॅनियम
    .v = व्हॅनेडियम
    .cr = क्रोमियम
    .mn = मँगेनीज
    .fe = लोह
    .co = कोबाल्ट
    .ni = निकेल
    .cu = तांबे
    .zn = जस्त
    .ga = गॅलियम
    .ge = जर्मेनियम
    .as = आर्सेनिक
    .se = सेलेनियम
    .br = ब्रोमिन
    .kr = क्रिप्टॉन
    .rb = रुबिडियम
    .sr = स्ट्राँशियम
    .y = इट्रियम
    .zr = झिरकोनियम
    .nb = नायोबियम
    .mo = मॉलिब्डेनम
    .tc = टेक्नेशियम
    .ru = रुथेनियम
    .rh = ऱ्होडियम
    .pd = पॅलॅडियम
    .ag = चांदी
    .cd = कॅडमियम
    .in = इंडियम
    .sn = कथिल
    .sb = अँटिमनी
    .te = टेल्युरियम
    .i = आयोडिन
    .xe = झेनॉन
    .cs = सिझियम
    .ba = बेरियम
    .la = लँथॅनम
    .ce = सिरियम
    .pr = प्रासिओडिमियम
    .nd = निओडिमियम
    .pm = प्रोमिथियम
    .sm = समॅरियम
    .eu = युरोपियम
    .gd = गॅडोलिनियम
    .tb = टर्बियम
    .dy = डिस्प्रोसियम
    .ho = होल्मियम
    .er = अर्बियम
    .tm = थुलियम
    .yb = इटर्बियम
    .lu = ल्युटेशियम
    .hf = हाफनियम
    .ta = टँटॅलम
    .w = टंगस्टन
    .re = ऱ्हेनियम
    .os = ऑस्मियम
    .ir = इरिडियम
    .pt = प्लॅटिनम
    .au = सोने
    .hg = पारा
    .tl = थॅलियम
    .pb = शिसे
    .bi = बिस्मथ
    .po = पोलोनियम
    .at = ॲस्टाटिन
    .rn = रेडॉन
    .fr = फ्रान्सियम
    .ra = रेडियम
    .ac = ॲक्टिनियम
    .th = थोरियम
    .pa = प्रोटॅक्टिनियम
    .u = युरेनियम
    .np = नेपच्युनियम
    .pu = प्लुटोनियम
    .am = अमेरिसियम
    .cm = क्युरियम
    .bk = बर्केलियम
    .cf = कॅलिफोर्नियम
    .es = आइन्स्टाइनियम
    .fm = फर्मियम
    .md = मेंडेलेव्हियम
    .no = नोबेलियम
    .lr = लॉरेन्सियम
    .rf = रुदरफोर्डियम
    .db = डुबनियम
    .sg = सीबोर्गियम
    .bh = बोहरियम
    .hs = हॅशियम
    .mt = माइटनेरियम
    .ds = डार्मस्टाडियम
    .rg = रोंटजेनियम
    .cn = कोपर्निशियम
    .nh = निहोनियम
    .fl = फ्लेरोव्हियम
    .mc = मॉस्कोव्हियम
    .lv = लिव्हरमोरियम
    .ts = टेनेसिन
    .og = ओगानेसन

element-anion-name =
    .h = हायड्राइड
    .c = कार्बाइड
    .n = नायट्राइड
    .o = ऑक्साइड
    .f = फ्लोराइड
    .p = फॉस्फाइड
    .s = सल्फाइड
    .cl = क्लोराइड
    .br = ब्रोमाइड
    .i = आयोडाइड
    .at = ॲस्टाटाइड
    .ts = टेनेसाइड

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = अवैध रासायनिक चिन्ह
chemistry-invalid-ionic-compound = अवैध आयनिक संयुग
