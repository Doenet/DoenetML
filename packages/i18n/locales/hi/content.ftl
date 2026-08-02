# Hindi content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Hindi adjectives fall into two classes. *Marked* ones end in -ा and inflect —
# काला / काली / काले — while *unmarked* ones never change: लाल, सफ़ेद, नारंगी,
# गुलाबी, बैंगनी, स्लेटी, फ़िरोज़ी. Only the marked ones select below; the rest
# answer the same in every branch.
#
# A marked adjective takes the oblique -े before a noun governed by a
# postposition, so `$role` matters here as it does in Polish, though for a
# different reason — this is case in the direct/oblique sense rather than a
# seven-way paradigm:
#
#   standalone          direct, agreeing with the noun described
#   border-clause       oblique, before «किनारे के साथ» — किनारा is masculine
#   background-clause   feminine, agreeing with पृष्ठभूमि, which a marked
#                       adjective spells the same in direct and oblique
#   text-clause         direct masculine, agreeing with पाठ
#
# Numbers render as 1,234.5 and not in Devanagari numerals. That is Hindi's own
# CLDR numbering system, and it is also what DoenetML pins for every locale
# (`src/intl.ts`), so Marathi and Nepali — which share the script but not the
# numbering system — count the same way.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] काले
            [background-clause] काली
            [text-clause] काला
           *[standalone]
                { $gender ->
                    [f] काली
                   *[m] काला
                }
        }
    .white = सफ़ेद
    .gray = स्लेटी
    .red = लाल
    .orange = नारंगी
    .yellow =
        { $role ->
            [border-clause] पीले
            [background-clause] पीली
            [text-clause] पीला
           *[standalone]
                { $gender ->
                    [f] पीली
                   *[m] पीला
                }
        }
    .green =
        { $role ->
            [border-clause] हरे
            [background-clause] हरी
            [text-clause] हरा
           *[standalone]
                { $gender ->
                    [f] हरी
                   *[m] हरा
                }
        }
    .cyan = फ़िरोज़ी
    .blue =
        { $role ->
            [border-clause] नीले
            [background-clause] नीली
            [text-clause] नीला
           *[standalone]
                { $gender ->
                    [f] नीली
                   *[m] नीला
                }
        }
    .purple = बैंगनी
    .pink = गुलाबी
    .brown =
        { $role ->
            [border-clause] भूरे
            [background-clause] भूरी
            [text-clause] भूरा
           *[standalone]
                { $gender ->
                    [f] भूरी
                   *[m] भूरा
                }
        }

line-width =
    .thick =
        { $role ->
            [border-clause] मोटे
            [background-clause] मोटी
            [text-clause] मोटा
           *[standalone]
                { $gender ->
                    [f] मोटी
                   *[m] मोटा
                }
        }
    .thin =
        { $role ->
            [border-clause] पतले
            [background-clause] पतली
            [text-clause] पतला
           *[standalone]
                { $gender ->
                    [f] पतली
                   *[m] पतला
                }
        }

# Both are unmarked, so neither inflects.
line-style =
    .dashed = खंडित
    .dotted = बिंदुदार

# Noun phrases in the oblique plural, because their other use is in front of
# «वाला» — a postposition that governs the oblique and inflects like a marked
# adjective itself. They agree with nothing, so `style-fill` has to give them
# something to hang off rather than print them bare, the way German and Russian
# do.
fill-style =
    .horizontal = क्षैतिज रेखाओं
    .vertical = ऊर्ध्वाधर रेखाओं
    .diagonal = विकर्ण रेखाओं
    .backdiagonal = विपरीत विकर्ण रेखाओं
    .dots = बिंदुओं
    .diamonds = समचतुर्भुजों

noun =
    .line = रेखा
    .line-segment = रेखाखंड
    .ray = किरण
    .vector = सदिश
    .curve = वक्र
    .function = फलन
    .parabola = परवलय
    .polyline = बहुरेखा
    .polygon = बहुभुज
    .triangle = त्रिभुज
    .rectangle = आयत
    .circle = वृत्त
    .region = क्षेत्र
    .point = बिंदु
    .square = वर्ग
    .diamond = समचतुर्भुज
    .cross = क्रॉस
    .plus = धन चिह्न

# Hindi keeps the side count in front of the noun, so the whole thing is one
# head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } भुजाओं वाला सम बहुभुज
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (बहुभुज, m) or the
# head of a phrase the description never names: `border` (किनारा, m), `fill`
# (भराव, m), `text` (पाठ, m), `background` (पृष्ठभूमि, f).
noun-gender =
    { $noun ->
        [line] f
        [ray] f
        [polyline] f
        [background] f
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

# Adjectives precede the noun, as in English.
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }

# Only ever said of the shape itself, so it is standalone in every
# description and takes no `$role` branch.
style-filled-word =
    { $gender ->
        [f] भरी हुई
       *[m] भरा हुआ
    }

# «वाला» is a marked adjective itself, and it agrees with the shape rather than
# with the pattern in front of it: «बिंदुओं वाली रेखा», «बिंदुओं वाला वर्ग». It
# is always said of the shape, so the direct form is the only one needed here —
# `style-fill` writes it with no branch at all, because the noun it agrees with
# there is «भराव», which is always masculine.
style-filled =
    { $parts ->
        [pattern] { $pattern } { $gender ->
            [f] वाली
           *[m] वाला
        } { $color } { $filled }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } { $gender ->
            [f] वाली
           *[m] वाला
        } { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } { $gender ->
            [f] वाली
           *[m] वाला
        } { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }

# «के साथ» is a postposition, so «किनारा» takes the oblique «किनारे» and so do
# its adjectives — which is what the `border-clause` branch supplies. Hindi has
# no article, so the `-article` branches read the same as the ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border } किनारे के साथ
        [and] और { $border } किनारे के साथ
        [and-article] और { $border } किनारे के साथ
       *[with] { $border } किनारे के साथ
    }

# The fill-pattern words are oblique plurals, because their other use is the
# «{ $pattern } वाला» clause in `style-filled`. So this message supplies a noun
# for them to hang off — «भराव», masculine, which is the gender `noun-gender`
# already answers for `fill`, so the colour agrees with it in both variants.
style-fill =
    { $parts ->
        [pattern] { $pattern } वाला { $color } भराव
       *[plain] { $color } भराव
    }

style-unfilled = बिना भराव

# «पर» is a postposition too, but «पृष्ठभूमि» is feminine, and a marked
# adjective spells its feminine the same in the direct and the oblique — so the
# `background-clause` branch coincides with the standalone feminine.
style-text =
    { $parts ->
        [background] { $background } पृष्ठभूमि पर { $color }
       *[plain] { $color }
    }

style-background-none = कोई नहीं


## Boolean words

boolean-true = सत्य
boolean-false = असत्य


## Answer buttons

answer-submit-label = जाँचें
answer-submit-label-no-correctness = उत्तर भेजें


## Sectional blocks

section-name =
    .activity = गतिविधि
    .aside = पार्श्व टिप्पणी
    .cascade = क्रमिका
    .definition = परिभाषा
    .example = उदाहरण
    .exercise = अभ्यास
    .exercises = अभ्यास
    .given-answer = उत्तर
    .note = टिप्पणी
    .objectives = उद्देश्य
    .paragraphs = अनुच्छेद
    .part = भाग
    .problem = प्रश्न
    .problems = प्रश्न
    .proof = प्रमाण
    .question = सवाल
    .section = अनुभाग
    .solution = हल
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

hint-title = संकेत


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
        [numbered] चित्र { $enumeration }
        [numbered-caption] चित्र { $enumeration }{ ": " }
        [unnumbered-caption] चित्र{ ": " }
       *[unnumbered] चित्र
    }


## Paginator controls

paginator-previous = पिछला
paginator-next = अगला
paginator-page = पृष्ठ

paginator-page-status = { $numPages } में से { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = या
piecewise-condition-if = यदि
piecewise-condition-otherwise = अन्यथा


## Chemistry

element-name =
    .h = हाइड्रोजन
    .he = हीलियम
    .li = लिथियम
    .be = बेरिलियम
    .b = बोरॉन
    .c = कार्बन
    .n = नाइट्रोजन
    .o = ऑक्सीजन
    .f = फ्लोरीन
    .ne = नियॉन
    .na = सोडियम
    .mg = मैग्नीशियम
    .al = ऐलुमिनियम
    .si = सिलिकॉन
    .p = फॉस्फोरस
    .s = सल्फर
    .cl = क्लोरीन
    .ar = आर्गन
    .k = पोटैशियम
    .ca = कैल्शियम
    .sc = स्कैंडियम
    .ti = टाइटेनियम
    .v = वैनेडियम
    .cr = क्रोमियम
    .mn = मैंगनीज़
    .fe = लोहा
    .co = कोबाल्ट
    .ni = निकल
    .cu = ताँबा
    .zn = जस्ता
    .ga = गैलियम
    .ge = जर्मेनियम
    .as = आर्सेनिक
    .se = सेलेनियम
    .br = ब्रोमीन
    .kr = क्रिप्टॉन
    .rb = रुबिडियम
    .sr = स्ट्रॉन्शियम
    .y = इट्रियम
    .zr = ज़िरकोनियम
    .nb = नाइओबियम
    .mo = मॉलिब्डेनम
    .tc = टेक्नीशियम
    .ru = रुथेनियम
    .rh = रोडियम
    .pd = पैलेडियम
    .ag = चाँदी
    .cd = कैडमियम
    .in = इंडियम
    .sn = टिन
    .sb = ऐंटिमनी
    .te = टेल्यूरियम
    .i = आयोडीन
    .xe = ज़ेनॉन
    .cs = सीज़ियम
    .ba = बेरियम
    .la = लैंथेनम
    .ce = सीरियम
    .pr = प्रेज़ियोडाइमियम
    .nd = नियोडाइमियम
    .pm = प्रोमीथियम
    .sm = समेरियम
    .eu = यूरोपियम
    .gd = गैडोलिनियम
    .tb = टर्बियम
    .dy = डिस्प्रोसियम
    .ho = होल्मियम
    .er = अर्बियम
    .tm = थुलियम
    .yb = इटर्बियम
    .lu = ल्यूटीशियम
    .hf = हैफ़नियम
    .ta = टैंटलम
    .w = टंगस्टन
    .re = रीनियम
    .os = ऑस्मियम
    .ir = इरिडियम
    .pt = प्लैटिनम
    .au = सोना
    .hg = पारा
    .tl = थैलियम
    .pb = सीसा
    .bi = बिस्मथ
    .po = पोलोनियम
    .at = ऐस्टैटीन
    .rn = रेडॉन
    .fr = फ्रैंशियम
    .ra = रेडियम
    .ac = ऐक्टिनियम
    .th = थोरियम
    .pa = प्रोटैक्टिनियम
    .u = यूरेनियम
    .np = नेप्ट्यूनियम
    .pu = प्लूटोनियम
    .am = अमेरिशियम
    .cm = क्यूरियम
    .bk = बर्केलियम
    .cf = कैलिफ़ोर्नियम
    .es = आइंस्टीनियम
    .fm = फ़र्मियम
    .md = मेंडेलीवियम
    .no = नोबेलियम
    .lr = लॉरेंशियम
    .rf = रदरफ़ोर्डियम
    .db = डब्नियम
    .sg = सीबोर्गियम
    .bh = बोहरियम
    .hs = हैसियम
    .mt = माइट्नेरियम
    .ds = डार्मस्टेटियम
    .rg = रोएंटजेनियम
    .cn = कोपरनिसियम
    .nh = निहोनियम
    .fl = फ्लेरोवियम
    .mc = मॉस्कोवियम
    .lv = लिवरमोरियम
    .ts = टेनेसीन
    .og = ओगेनेसन

element-anion-name =
    .h = हाइड्राइड
    .c = कार्बाइड
    .n = नाइट्राइड
    .o = ऑक्साइड
    .f = फ्लोराइड
    .p = फॉस्फाइड
    .s = सल्फ़ाइड
    .cl = क्लोराइड
    .br = ब्रोमाइड
    .i = आयोडाइड
    .at = ऐस्टैटाइड
    .ts = टेनेसाइड

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = अमान्य रासायनिक संकेत
chemistry-invalid-ionic-compound = अमान्य आयनिक यौगिक
