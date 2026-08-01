# Bangla content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Bangla has no grammatical gender and does not inflect an attributive
# adjective, so both `$gender` and `$role` go unused here exactly as they do in
# English. What case there is lands on the *noun* as a suffix — পটভূমিতে, "on
# the background" — and never on the adjectives standing in front of it, which
# is why nothing below has to vary by position.
#
# Adjectives precede the noun as they do in English, so the composition
# messages keep the English order. What moves is the postposition: English puts
# `with` and `on` in front of their noun and Bangla puts সহ and -তে behind it,
# so those clauses are reordered rather than translated word for word.
#
# CLDR counts Bangla in Bengali digits, and DoenetML does not: every number
# renders in Latin digits under Bangla's own grouping, which is India's twos
# above the first thousand (#1615). So a side count reads `1,234` here, not
# `১,২৩৪`.


## Style vocabulary

color =
    .black = কালো
    .white = সাদা
    .gray = ধূসর
    .red = লাল
    .orange = কমলা
    .yellow = হলুদ
    .green = সবুজ
    .cyan = সায়ান
    .blue = নীল
    .purple = বেগুনি
    .pink = গোলাপি
    .brown = বাদামি

line-width =
    .thick = মোটা
    .thin = সরু

line-style =
    .dashed = ড্যাশযুক্ত
    .dotted = বিন্দুযুক্ত

# Noun phrases rather than adjectives: they are introduced by দিয়ে ("using"),
# which takes a bare noun, so each one stands on its own below.
fill-style =
    .horizontal = অনুভূমিক রেখা
    .vertical = উল্লম্ব রেখা
    .diagonal = কর্ণ রেখা
    .backdiagonal = বিপরীত কর্ণ রেখা
    .dots = বিন্দু
    .diamonds = রম্বস

noun =
    .line = রেখা
    .line-segment = রেখাংশ
    .ray = রশ্মি
    .vector = ভেক্টর
    .curve = বক্ররেখা
    .function = ফাংশন
    .parabola = পরাবৃত্ত
    .polyline = বহুরেখা
    .polygon = বহুভুজ
    .triangle = ত্রিভুজ
    .rectangle = আয়তক্ষেত্র
    .circle = বৃত্ত
    .region = অঞ্চল
    .point = বিন্দু
    .square = বর্গক্ষেত্র
    .diamond = রম্বস
    .cross = ক্রস
    .plus = যোগ চিহ্ন

# বাহুবিশিষ্ট ("having sides") attaches the count to the noun that follows, so
# the whole phrase is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } বাহুবিশিষ্ট সুষম বহুভুজ
    }

# Bangla has no grammatical gender, so every noun answers the same and the
# answer goes unused — as in English.
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

style-filled-word = ভরাট

# দিয়ে follows the pattern it applies to, so the clause English appends comes
# to the front here.
style-filled =
    { $parts ->
        [pattern] { $pattern } দিয়ে { $filled } { $color }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } দিয়ে { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern } দিয়ে { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }

# সহ is a postposition, so it follows সীমানা rather than preceding it as
# English's `with` does. Bangla has no article, which leaves the `-article`
# branches reading exactly like the ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border } সীমানা সহ
        [and] এবং { $border } সীমানা সহ
        [and-article] এবং { $border } সীমানা সহ
       *[with] { $border } সীমানা সহ
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = ভরাটহীন

# The locative -তে marks পটভূমি, and the colour word in front of it is
# untouched by that.
style-text =
    { $parts ->
        [background] { $background } পটভূমিতে { $color }
       *[plain] { $color }
    }

style-background-none = নেই


## Boolean words

boolean-true = সত্য
boolean-false = মিথ্যা


## Answer buttons

answer-submit-label = যাচাই করুন
answer-submit-label-no-correctness = উত্তর জমা দিন


## Sectional blocks

section-name =
    .activity = কার্যকলাপ
    .aside = পার্শ্বটীকা
    .cascade = ক্যাসকেড
    .definition = সংজ্ঞা
    .example = উদাহরণ
    .exercise = অনুশীলনী
    .exercises = অনুশীলনী
    .given-answer = উত্তর
    .note = টীকা
    .objectives = উদ্দেশ্য
    .paragraphs = অনুচ্ছেদ
    .part = অংশ
    .problem = সমস্যা
    .problems = সমস্যা
    .proof = প্রমাণ
    .question = প্রশ্ন
    .section = বিভাগ
    .solution = সমাধান
    .task = কাজ
    .theorem = উপপাদ্য

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = ইঙ্গিত


## Tables and figures

table-name =
    { $parts ->
        [numbered] সারণি { $enumeration }
        [numbered-title] সারণি { $enumeration }{ ": " }
        [unnumbered-title] সারণি{ ": " }
       *[unnumbered] সারণি
    }

figure-name =
    { $parts ->
        [numbered] চিত্র { $enumeration }
        [numbered-caption] চিত্র { $enumeration }{ ": " }
        [unnumbered-caption] চিত্র{ ": " }
       *[unnumbered] চিত্র
    }


## Paginator controls

paginator-previous = পূর্ববর্তী
paginator-next = পরবর্তী
paginator-page = পৃষ্ঠা

# «X-এর মধ্যে Y» — "Y out of X" — puts the total first, so the two counts
# change places.
paginator-page-status = { $numPages }-এর মধ্যে { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = অথবা

piecewise-condition-if = যদি

piecewise-condition-otherwise = অন্যথায়


## Chemistry
##
## The transliterated names Bangla-medium school chemistry uses, in Bangladesh
## and in West Bengal alike. Symbols and formulas are untouched.

element-name =
    .h = হাইড্রোজেন
    .he = হিলিয়াম
    .li = লিথিয়াম
    .be = বেরিলিয়াম
    .b = বোরন
    .c = কার্বন
    .n = নাইট্রোজেন
    .o = অক্সিজেন
    .f = ফ্লোরিন
    .ne = নিয়ন
    .na = সোডিয়াম
    .mg = ম্যাগনেসিয়াম
    .al = অ্যালুমিনিয়াম
    .si = সিলিকন
    .p = ফসফরাস
    .s = সালফার
    .cl = ক্লোরিন
    .ar = আর্গন
    .k = পটাশিয়াম
    .ca = ক্যালসিয়াম
    .sc = স্ক্যান্ডিয়াম
    .ti = টাইটানিয়াম
    .v = ভ্যানাডিয়াম
    .cr = ক্রোমিয়াম
    .mn = ম্যাঙ্গানিজ
    .fe = লোহা
    .co = কোবাল্ট
    .ni = নিকেল
    .cu = তামা
    .zn = দস্তা
    .ga = গ্যালিয়াম
    .ge = জার্মেনিয়াম
    .as = আর্সেনিক
    .se = সেলেনিয়াম
    .br = ব্রোমিন
    .kr = ক্রিপ্টন
    .rb = রুবিডিয়াম
    .sr = স্ট্রনসিয়াম
    .y = ইট্রিয়াম
    .zr = জিরকোনিয়াম
    .nb = নাইওবিয়াম
    .mo = মলিবডেনাম
    .tc = টেকনেশিয়াম
    .ru = রুথেনিয়াম
    .rh = রোডিয়াম
    .pd = প্যালাডিয়াম
    .ag = রুপা
    .cd = ক্যাডমিয়াম
    .in = ইন্ডিয়াম
    .sn = টিন
    .sb = অ্যান্টিমনি
    .te = টেলুরিয়াম
    .i = আয়োডিন
    .xe = জেনন
    .cs = সিজিয়াম
    .ba = বেরিয়াম
    .la = ল্যান্থানাম
    .ce = সিরিয়াম
    .pr = প্রাসিওডিমিয়াম
    .nd = নিওডিমিয়াম
    .pm = প্রমিথিয়াম
    .sm = সামারিয়াম
    .eu = ইউরোপিয়াম
    .gd = গ্যাডোলিনিয়াম
    .tb = টার্বিয়াম
    .dy = ডিসপ্রোসিয়াম
    .ho = হলমিয়াম
    .er = আরবিয়াম
    .tm = থুলিয়াম
    .yb = ইটারবিয়াম
    .lu = লুটেশিয়াম
    .hf = হাফনিয়াম
    .ta = ট্যান্টালাম
    .w = টাংস্টেন
    .re = রেনিয়াম
    .os = অসমিয়াম
    .ir = ইরিডিয়াম
    .pt = প্ল্যাটিনাম
    .au = সোনা
    .hg = পারদ
    .tl = থ্যালিয়াম
    .pb = সীসা
    .bi = বিসমাথ
    .po = পোলোনিয়াম
    .at = অ্যাস্টাটিন
    .rn = রেডন
    .fr = ফ্রান্সিয়াম
    .ra = রেডিয়াম
    .ac = অ্যাক্টিনিয়াম
    .th = থোরিয়াম
    .pa = প্রোট্যাক্টিনিয়াম
    .u = ইউরেনিয়াম
    .np = নেপচুনিয়াম
    .pu = প্লুটোনিয়াম
    .am = আমেরিসিয়াম
    .cm = কিউরিয়াম
    .bk = বার্কেলিয়াম
    .cf = ক্যালিফোর্নিয়াম
    .es = আইনস্টাইনিয়াম
    .fm = ফার্মিয়াম
    .md = মেন্ডেলেভিয়াম
    .no = নোবেলিয়াম
    .lr = লরেনসিয়াম
    .rf = রাদারফোর্ডিয়াম
    .db = ডুবনিয়াম
    .sg = সিবোর্গিয়াম
    .bh = বোহরিয়াম
    .hs = হ্যাসিয়াম
    .mt = মাইটনেরিয়াম
    .ds = ডার্মস্ট্যাডিয়াম
    .rg = রন্টজেনিয়াম
    .cn = কোপার্নিসিয়াম
    .nh = নিহোনিয়াম
    .fl = ফ্লেরোভিয়াম
    .mc = মস্কোভিয়াম
    .lv = লিভারমোরিয়াম
    .ts = টেনেসিন
    .og = ওগানেসন

element-anion-name =
    .h = হাইড্রাইড
    .c = কার্বাইড
    .n = নাইট্রাইড
    .o = অক্সাইড
    .f = ফ্লোরাইড
    .p = ফসফাইড
    .s = সালফাইড
    .cl = ক্লোরাইড
    .br = ব্রোমাইড
    .i = আয়োডাইড
    .at = অ্যাস্টাটাইড
    .ts = টেনেসাইড

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = অবৈধ রাসায়নিক প্রতীক
chemistry-invalid-ionic-compound = অবৈধ আয়নিক যৌগ
