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
# Hindi uses Latin digits (`latn` in CLDR), so numbers render as 1,234.5 and
# not in Devanagari numerals — unlike Marathi and Nepali, which share the
# script but not the numbering system.


## शैली शब्दावली

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

# संज्ञा वाक्यांश: ये «वाले» से पहले आते हैं और किसी से मेल नहीं खाते।
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

# भुजाओं की गिनती संज्ञा से पहले आती है, इसलिए यह सिर पर ही जुड़ जाती है और
# कोई पुच्छ नहीं बचता।
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } भुजाओं वाला सम बहुभुज
    }

# ऊपर की संज्ञाओं के अलावा `$noun` «regular-polygon» (बहुभुज, पु.) हो सकता है
# या उस वाक्यांश का शीर्ष जिसे विवरण नाम नहीं देता: «border» (किनारा, पु.),
# «fill» (भराव, पु.), «text» (पाठ, पु.), «background» (पृष्ठभूमि, स्त्री.)।
noun-gender =
    { $noun ->
        [line] f
        [ray] f
        [polyline] f
        [curve] f
        [background] f
       *[other] m
    }


## शैली संयोजन

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

# विशेषण संज्ञा से पहले आते हैं, अंग्रेज़ी की तरह।
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

style-filled =
    { $parts ->
        [pattern] { $pattern } वाला { $color } { $filled }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } वाला { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } वाला { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }

# «के साथ» एक परसर्ग है, इसलिए «किनारा» तिर्यक रूप «किनारे» लेता है और उसके
# विशेषण भी — यही `border-clause` शाखा देती है। हिंदी में उपपद नहीं होता,
# इसलिए `-article` शाखाएँ बाकी जैसी ही पढ़ी जाती हैं।
style-border-clause =
    { $parts ->
        [with-article] { $border } किनारे के साथ
        [and] और { $border } किनारे के साथ
        [and-article] और { $border } किनारे के साथ
       *[with] { $border } किनारे के साथ
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = बिना भराव

# «पर» भी परसर्ग है, पर «पृष्ठभूमि» स्त्रीलिंग है और चिह्नित विशेषण का
# स्त्रीलिंग रूप सीधे और तिर्यक दोनों में एक ही रहता है।
style-text =
    { $parts ->
        [background] { $background } पृष्ठभूमि पर { $color }
       *[plain] { $color }
    }

style-background-none = कोई नहीं


## बूलीय शब्द

boolean-true = सत्य
boolean-false = असत्य


## उत्तर बटन

answer-submit-label = जाँचें
answer-submit-label-no-correctness = उत्तर भेजें


## खंड

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


## सारणियाँ और चित्र

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


## पृष्ठ नियंत्रण

paginator-previous = पिछला
paginator-next = अगला
paginator-page = पृष्ठ

paginator-page-status = { $numPages } में से { $pageLabel } { $currentPage }


## खंडशः फलन

piecewise-condition-or = या
piecewise-condition-if = यदि
piecewise-condition-otherwise = अन्यथा


## रसायन विज्ञान

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
