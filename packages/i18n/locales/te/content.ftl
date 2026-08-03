# Telugu content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Telugu has no adjective agreement, so `$gender` and `$role` go unused here
# exactly as they do in English. Adjectives precede their noun, as in English,
# so the composition messages keep the English order.
#
# What moves is the adposition. Telugu postposes: "with a thick red border" is
# «మందపాటి ఎరుపు అంచుతో», the -తో suffixed to the noun rather than a word in
# front of it. So the `with`/`and` branches put the phrase first and the marker
# last, and the two `-article` branches read like the ones without — Telugu has
# no article.
#
# Numbers render in Latin digits rather than in Telugu numerals, which is the
# digit policy in the package README (#1615).


## Style vocabulary

# Telugu uses the bare colour word attributively — «ఎరుపు గీత» — so these need
# no adjectival form of their own.
color =
    .black = నలుపు
    .white = తెలుపు
    .gray = బూడిద
    .red = ఎరుపు
    .orange = నారింజ
    .yellow = పసుపు
    .green = ఆకుపచ్చ
    .cyan = నీలిఆకుపచ్చ
    .blue = నీలం
    .purple = ఊదా
    .pink = గులాబీ
    .brown = గోధుమ

line-width =
    .thick = మందపాటి
    .thin = సన్నని

line-style =
    .dashed = తెగిన
    .dotted = చుక్కల

# Noun phrases: they take the -తో the composition messages suffix, and modify
# nothing.
fill-style =
    .horizontal = సమాంతర గీతలు
    .vertical = నిలువు గీతలు
    .diagonal = వికర్ణ గీతలు
    .backdiagonal = వ్యతిరేక వికర్ణ గీతలు
    .dots = చుక్కలు
    .diamonds = వజ్రాకారాలు

noun =
    .line = సరళరేఖ
    .line-segment = రేఖాఖండం
    .ray = కిరణం
    .vector = సదిశ
    .curve = వక్రరేఖ
    .function = ప్రమేయం
    .parabola = పరావలయం
    .polyline = బహురేఖ
    .polygon = బహుభుజి
    .triangle = త్రిభుజం
    .rectangle = దీర్ఘచతురస్రం
    .circle = వృత్తం
    .region = ప్రాంతం
    .point = బిందువు
    .square = చతురస్రం
    .diamond = వజ్రాకారం
    .cross = అడ్డగుర్తు
    .plus = కూడిక గుర్తు

# The side count precedes the noun, as every modifier in Telugu does, so it
# folds into the head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } భుజాల క్రమ బహుభుజి
    }

# Telugu marks gender on verbs and pronouns, not on the adjectives in these
# phrases, so every noun answers the same and the answer goes unused — as in
# English.
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

style-filled-word = నింపిన

# «-తో» is a postposition, so the pattern it marks comes before it and the
# whole clause follows what it describes.
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } { $pattern }తో
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } { $pattern }తో
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } { $pattern }తో
       *[plain] { $filled } { $color } { $noun }
    }

# «అంచు» takes the same postposition, and «మరియు» opens the further clause
# where English opens it with "and". Telugu has no article, so the two
# `-article` branches read like the ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border } అంచుతో
        [and] మరియు { $border } అంచుతో
        [and-article] మరియు { $border } అంచుతో
       *[with] { $border } అంచుతో
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = నింపని

# «నేపథ్యం» takes the locative -పై, so the background leads and the text
# colour follows it.
style-text =
    { $parts ->
        [background] { $background } నేపథ్యంపై { $color }
       *[plain] { $color }
    }

style-background-none = ఏదీ లేదు


## Boolean words

boolean-true = నిజం
boolean-false = అబద్ధం


## Answer buttons

answer-submit-label = సరిచూడు
answer-submit-label-no-correctness = సమాధానం సమర్పించు


## Sectional blocks

section-name =
    .activity = కార్యకలాపం
    .aside = పక్కగమనిక
    .cascade = వరుస
    .definition = నిర్వచనం
    .example = ఉదాహరణ
    .exercise = అభ్యాసం
    .exercises = అభ్యాసాలు
    .given-answer = సమాధానం
    .note = గమనిక
    .objectives = లక్ష్యాలు
    .paragraphs = పేరాలు
    .part = భాగం
    .problem = సమస్య
    .problems = సమస్యలు
    .proof = నిరూపణ
    .question = ప్రశ్న
    .section = విభాగం
    .solution = సాధన
    .task = పని
    .theorem = సిద్ధాంతం

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = సూచన


## Tables and figures

table-name =
    { $parts ->
        [numbered] పట్టిక { $enumeration }
        [numbered-title] పట్టిక { $enumeration }{ ": " }
        [unnumbered-title] పట్టిక{ ": " }
       *[unnumbered] పట్టిక
    }

figure-name =
    { $parts ->
        [numbered] పటం { $enumeration }
        [numbered-caption] పటం { $enumeration }{ ": " }
        [unnumbered-caption] పటం{ ": " }
       *[unnumbered] పటం
    }


## Paginator controls

paginator-previous = మునుపటిది
paginator-next = తదుపరిది
paginator-page = పేజీ

# The total leads, marked with the locative -లో, which is how Telugu says
# "3 of 5".
paginator-page-status = { $numPages } లో { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = లేదా
piecewise-condition-if = అయితే
piecewise-condition-otherwise = లేకపోతే


## Chemistry

# The names Telugu-medium school chemistry uses. Most are the international
# names written in Telugu script; the handful that name a metal known long
# before its element was — ఇనుము, రాగి, వెండి, బంగారం, సీసం, తగరం, పాదరసం —
# are the ordinary Telugu words, which is what a textbook prints.
element-name =
    .h = హైడ్రోజన్
    .he = హీలియం
    .li = లిథియం
    .be = బెరీలియం
    .b = బోరాన్
    .c = కార్బన్
    .n = నైట్రోజన్
    .o = ఆక్సిజన్
    .f = ఫ్లోరిన్
    .ne = నియాన్
    .na = సోడియం
    .mg = మెగ్నీషియం
    .al = అల్యూమినియం
    .si = సిలికాన్
    .p = ఫాస్ఫరస్
    .s = సల్ఫర్
    .cl = క్లోరిన్
    .ar = ఆర్గాన్
    .k = పొటాషియం
    .ca = కాల్షియం
    .sc = స్కాండియం
    .ti = టైటానియం
    .v = వెనేడియం
    .cr = క్రోమియం
    .mn = మాంగనీస్
    .fe = ఇనుము
    .co = కోబాల్ట్
    .ni = నికెల్
    .cu = రాగి
    .zn = జింక్
    .ga = గాలియం
    .ge = జెర్మేనియం
    .as = ఆర్సెనిక్
    .se = సెలీనియం
    .br = బ్రోమిన్
    .kr = క్రిప్టాన్
    .rb = రుబీడియం
    .sr = స్ట్రాన్షియం
    .y = ఇట్రియం
    .zr = జిర్కోనియం
    .nb = నయోబియం
    .mo = మాలిబ్డినం
    .tc = టెక్నీషియం
    .ru = రుథేనియం
    .rh = రోడియం
    .pd = పల్లాడియం
    .ag = వెండి
    .cd = కాడ్మియం
    .in = ఇండియం
    .sn = తగరం
    .sb = యాంటిమొని
    .te = టెల్లూరియం
    .i = అయోడిన్
    .xe = జినాన్
    .cs = సీసియం
    .ba = బేరియం
    .la = లాంథనం
    .ce = సీరియం
    .pr = ప్రెసియోడైమియం
    .nd = నియోడైమియం
    .pm = ప్రోమీథియం
    .sm = సమేరియం
    .eu = యూరోపియం
    .gd = గాడోలినియం
    .tb = టెర్బియం
    .dy = డిస్ప్రోసియం
    .ho = హోల్మియం
    .er = ఎర్బియం
    .tm = థూలియం
    .yb = ఇటర్బియం
    .lu = లుటీషియం
    .hf = హాఫ్నియం
    .ta = టాంటలం
    .w = టంగ్‌స్టన్
    .re = రీనియం
    .os = ఆస్మియం
    .ir = ఇరిడియం
    .pt = ప్లాటినం
    .au = బంగారం
    .hg = పాదరసం
    .tl = థాలియం
    .pb = సీసం
    .bi = బిస్మత్
    .po = పొలోనియం
    .at = అస్టటిన్
    .rn = రేడాన్
    .fr = ఫ్రాన్షియం
    .ra = రేడియం
    .ac = ఆక్టినియం
    .th = థోరియం
    .pa = ప్రొటాక్టినియం
    .u = యురేనియం
    .np = నెప్ట్యూనియం
    .pu = ప్లుటోనియం
    .am = అమెరిషియం
    .cm = క్యూరియం
    .bk = బెర్కీలియం
    .cf = కాలిఫోర్నియం
    .es = ఐన్‌స్టీనియం
    .fm = ఫెర్మియం
    .md = మెండలీవియం
    .no = నోబెలియం
    .lr = లారెన్షియం
    .rf = రూథర్‌ఫోర్డియం
    .db = డబ్నియం
    .sg = సీబోర్జియం
    .bh = బోహ్రియం
    .hs = హాసియం
    .mt = మైట్నీరియం
    .ds = డార్మ్‌స్టాడ్టియం
    .rg = రోంట్జీనియం
    .cn = కోపర్నీషియం
    .nh = నిహోనియం
    .fl = ఫ్లెరోవియం
    .mc = మాస్కోవియం
    .lv = లివర్‌మోరియం
    .ts = టెన్నస్సీన్
    .og = ఒగనెసాన్

element-anion-name =
    .h = హైడ్రైడ్
    .c = కార్బైడ్
    .n = నైట్రైడ్
    .o = ఆక్సైడ్
    .f = ఫ్లోరైడ్
    .p = ఫాస్ఫైడ్
    .s = సల్ఫైడ్
    .cl = క్లోరైడ్
    .br = బ్రోమైడ్
    .i = అయోడైడ్
    .at = అస్టటైడ్
    .ts = టెన్నస్సైడ్

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = చెల్లని రసాయన చిహ్నం
chemistry-invalid-ionic-compound = చెల్లని అయానిక సమ్మేళనం
