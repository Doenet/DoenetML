# Odia content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Odia has grammatical gender in its pronouns but no adjective agreement, so
# `$gender` and `$role` go unused here exactly as they do in English.
# Adjectives precede their noun, as in English, so the composition messages
# keep the English order.
#
# What moves is the adposition. Odia postposes: "with a thick red border" is
# «ମୋଟା ଲାଲ ଧାର ସହିତ», the marker following the noun rather than a word in
# front of it. The two `-article` branches read like the ones without — Odia
# has no article.
#
# Numbers render in Latin digits rather than in Odia numerals, which is the
# digit policy in the package README (#1615).


## Style vocabulary

color =
    .black = କଳା
    .white = ଧଳା
    .gray = ଧୂସର
    .red = ଲାଲ
    .orange = କମଳା
    .yellow = ହଳଦିଆ
    .green = ସବୁଜ
    .cyan = ଆକାଶୀ
    .blue = ନୀଳ
    .purple = ବାଇଗଣୀ
    .pink = ଗୋଲାପୀ
    .brown = ମାଟିଆ

line-width =
    .thick = ମୋଟା
    .thin = ପତଳା

line-style =
    .dashed = ଛିନ୍ନ
    .dotted = ବିନ୍ଦୁଯୁକ୍ତ

# Noun phrases: they stand in front of the «ସହିତ» the composition messages
# supply, and modify nothing.
fill-style =
    .horizontal = ଅନୁଭୂମିକ ରେଖା
    .vertical = ଲମ୍ବ ରେଖା
    .diagonal = କର୍ଣ୍ଣ ରେଖା
    .backdiagonal = ବିପରୀତ କର୍ଣ୍ଣ ରେଖା
    .dots = ବିନ୍ଦୁ
    .diamonds = ହୀରା

noun =
    .line = ସରଳରେଖା
    .line-segment = ରେଖାଖଣ୍ଡ
    .ray = ରଶ୍ମି
    .vector = ଭେକ୍ଟର
    .curve = ବକ୍ରରେଖା
    .function = ଫଳନ
    .parabola = ପରାବୃତ୍ତ
    .polyline = ବହୁରେଖା
    .polygon = ବହୁଭୁଜ
    .triangle = ତ୍ରିଭୁଜ
    .rectangle = ଆୟତ
    .circle = ବୃତ୍ତ
    .region = ଅଞ୍ଚଳ
    .point = ବିନ୍ଦୁ
    .square = ବର୍ଗ
    .diamond = ହୀରା
    .cross = କ୍ରସ ଚିହ୍ନ
    .plus = ଯୋଗ ଚିହ୍ନ

# The side count precedes the noun, as every modifier in Odia does, so it folds
# into the head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } ବାହୁ ବିଶିଷ୍ଟ ନିୟମିତ ବହୁଭୁଜ
    }

# Odia adjectives take no agreement marking, so every noun answers the same and
# the answer goes unused — as in English.
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

style-filled-word = ପୂରଣ ହୋଇଥିବା

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } { $pattern } ସହିତ
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } { $pattern } ସହିତ
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } { $pattern } ସହିତ
       *[plain] { $filled } { $color } { $noun }
    }

# «ଧାର» takes the same postposition, and «ଏବଂ» opens the further clause where
# English opens it with "and". Odia has no article, so the two `-article`
# branches read like the ones without.
style-border-clause =
    { $parts ->
        [with-article] { $border } ଧାର ସହିତ
        [and] ଏବଂ { $border } ଧାର ସହିତ
        [and-article] ଏବଂ { $border } ଧାର ସହିତ
       *[with] { $border } ଧାର ସହିତ
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = ପୂରଣ ନହୋଇଥିବା

# «ପୃଷ୍ଠଭୂମି» takes the locative -ରେ, so the background leads and the text
# colour follows it.
style-text =
    { $parts ->
        [background] { $background } ପୃଷ୍ଠଭୂମିରେ { $color }
       *[plain] { $color }
    }

style-background-none = କିଛି ନାହିଁ


## Boolean words

boolean-true = ସତ
boolean-false = ମିଥ୍ୟା


## Answer buttons

answer-submit-label = ଯାଞ୍ଚ କରନ୍ତୁ
answer-submit-label-no-correctness = ଉତ୍ତର ପଠାନ୍ତୁ


## Sectional blocks

section-name =
    .activity = କାର୍ଯ୍ୟକଳାପ
    .aside = ପାର୍ଶ୍ୱଟିପ୍ପଣୀ
    .cascade = ଶୃଙ୍ଖଳା
    .definition = ସଂଜ୍ଞା
    .example = ଉଦାହରଣ
    .exercise = ଅଭ୍ୟାସ
    .exercises = ଅଭ୍ୟାସମାଳା
    .given-answer = ଉତ୍ତର
    .note = ଟିପ୍ପଣୀ
    .objectives = ଉଦ୍ଦେଶ୍ୟ
    .paragraphs = ଅନୁଚ୍ଛେଦ
    .part = ଭାଗ
    .problem = ସମସ୍ୟା
    .problems = ସମସ୍ୟାମାନ
    .proof = ପ୍ରମାଣ
    .question = ପ୍ରଶ୍ନ
    .section = ବିଭାଗ
    .solution = ସମାଧାନ
    .task = କାର୍ଯ୍ୟ
    .theorem = ଉପପାଦ୍ୟ

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = ସୂଚନା


## Tables and figures

table-name =
    { $parts ->
        [numbered] ସାରଣୀ { $enumeration }
        [numbered-title] ସାରଣୀ { $enumeration }{ ": " }
        [unnumbered-title] ସାରଣୀ{ ": " }
       *[unnumbered] ସାରଣୀ
    }

figure-name =
    { $parts ->
        [numbered] ଚିତ୍ର { $enumeration }
        [numbered-caption] ଚିତ୍ର { $enumeration }{ ": " }
        [unnumbered-caption] ଚିତ୍ର{ ": " }
       *[unnumbered] ଚିତ୍ର
    }


## Paginator controls

paginator-previous = ପୂର୍ବବର୍ତ୍ତୀ
paginator-next = ପରବର୍ତ୍ତୀ
paginator-page = ପୃଷ୍ଠା

# The total leads, marked with «ମଧ୍ୟରୁ», which is how Odia says "3 of 5".
paginator-page-status = { $numPages } ମଧ୍ୟରୁ { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = କିମ୍ବା
piecewise-condition-if = ଯଦି
piecewise-condition-otherwise = ଅନ୍ୟଥା


## Chemistry

# The names Odia-medium school chemistry uses. Most are the international names
# written in Odia script; the handful that name a metal known long before its
# element was — ଲୁହା, ତମ୍ବା, ରୂପା, ସୁନା, ସୀସା, ଟିଣ, ପାରଦ — are the ordinary
# Odia words, which is what a textbook prints.
element-name =
    .h = ହାଇଡ୍ରୋଜେନ
    .he = ହିଲିୟମ
    .li = ଲିଥିୟମ
    .be = ବେରିଲିୟମ
    .b = ବୋରନ
    .c = କାର୍ବନ
    .n = ନାଇଟ୍ରୋଜେନ
    .o = ଅକ୍ସିଜେନ
    .f = ଫ୍ଲୋରିନ
    .ne = ନିୟନ
    .na = ସୋଡିୟମ
    .mg = ମ୍ୟାଗ୍ନେସିୟମ
    .al = ଆଲୁମିନିୟମ
    .si = ସିଲିକନ
    .p = ଫସଫରସ
    .s = ସଲଫର
    .cl = କ୍ଲୋରିନ
    .ar = ଆର୍ଗନ
    .k = ପୋଟାସିୟମ
    .ca = କ୍ୟାଲସିୟମ
    .sc = ସ୍କାଣ୍ଡିୟମ
    .ti = ଟାଇଟାନିୟମ
    .v = ଭାନାଡିୟମ
    .cr = କ୍ରୋମିୟମ
    .mn = ମାଙ୍ଗାନିଜ
    .fe = ଲୁହା
    .co = କୋବାଲ୍ଟ
    .ni = ନିକେଲ
    .cu = ତମ୍ବା
    .zn = ଜିଙ୍କ
    .ga = ଗାଲିୟମ
    .ge = ଜର୍ମାନିୟମ
    .as = ଆର୍ସେନିକ
    .se = ସେଲେନିୟମ
    .br = ବ୍ରୋମିନ
    .kr = କ୍ରିପ୍ଟନ
    .rb = ରୁବିଡିୟମ
    .sr = ଷ୍ଟ୍ରନ୍ସିୟମ
    .y = ଇଟ୍ରିୟମ
    .zr = ଜିର୍କୋନିୟମ
    .nb = ନାଇଓବିୟମ
    .mo = ମଲିବଡେନମ
    .tc = ଟେକ୍ନେସିୟମ
    .ru = ରୁଥେନିୟମ
    .rh = ରୋଡିୟମ
    .pd = ପାଲାଡିୟମ
    .ag = ରୂପା
    .cd = କ୍ୟାଡମିୟମ
    .in = ଇଣ୍ଡିୟମ
    .sn = ଟିଣ
    .sb = ଆଣ୍ଟିମନି
    .te = ଟେଲୁରିୟମ
    .i = ଆୟୋଡିନ
    .xe = ଜେନନ
    .cs = ସିଜିୟମ
    .ba = ବେରିୟମ
    .la = ଲାନ୍ଥାନମ
    .ce = ସେରିୟମ
    .pr = ପ୍ରାସିଓଡିମିୟମ
    .nd = ନିଓଡିମିୟମ
    .pm = ପ୍ରୋମିଥିୟମ
    .sm = ସାମାରିୟମ
    .eu = ୟୁରୋପିୟମ
    .gd = ଗାଡୋଲିନିୟମ
    .tb = ଟର୍ବିୟମ
    .dy = ଡିସପ୍ରୋସିୟମ
    .ho = ହୋଲମିୟମ
    .er = ଏର୍ବିୟମ
    .tm = ଥୁଲିୟମ
    .yb = ଇଟର୍ବିୟମ
    .lu = ଲୁଟେସିୟମ
    .hf = ହାଫନିୟମ
    .ta = ଟାଣ୍ଟାଲମ
    .w = ଟଙ୍ଗଷ୍ଟେନ
    .re = ରେନିୟମ
    .os = ଓସମିୟମ
    .ir = ଇରିଡିୟମ
    .pt = ପ୍ଲାଟିନମ
    .au = ସୁନା
    .hg = ପାରଦ
    .tl = ଥାଲିୟମ
    .pb = ସୀସା
    .bi = ବିସମଥ
    .po = ପୋଲୋନିୟମ
    .at = ଆଷ୍ଟାଟିନ
    .rn = ରାଡନ
    .fr = ଫ୍ରାନ୍ସିୟମ
    .ra = ରେଡିୟମ
    .ac = ଆକ୍ଟିନିୟମ
    .th = ଥୋରିୟମ
    .pa = ପ୍ରୋଟାକ୍ଟିନିୟମ
    .u = ୟୁରାନିୟମ
    .np = ନେପଚୁନିୟମ
    .pu = ପ୍ଲୁଟୋନିୟମ
    .am = ଆମେରିସିୟମ
    .cm = କ୍ୟୁରିୟମ
    .bk = ବର୍କେଲିୟମ
    .cf = କାଲିଫର୍ନିୟମ
    .es = ଆଇନଷ୍ଟାଇନିୟମ
    .fm = ଫର୍ମିୟମ
    .md = ମେଣ୍ଡେଲିଭିୟମ
    .no = ନୋବେଲିୟମ
    .lr = ଲରେନ୍ସିୟମ
    .rf = ରଦରଫୋର୍ଡିୟମ
    .db = ଡବ୍ନିୟମ
    .sg = ସୀବୋର୍ଗିୟମ
    .bh = ବୋରିୟମ
    .hs = ହାସିୟମ
    .mt = ମାଇଟ୍ନେରିୟମ
    .ds = ଡାର୍ମଷ୍ଟାଡିୟମ
    .rg = ରୋଣ୍ଟଜେନିୟମ
    .cn = କୋପର୍ନିସିୟମ
    .nh = ନିହୋନିୟମ
    .fl = ଫ୍ଲେରୋଭିୟମ
    .mc = ମସ୍କୋଭିୟମ
    .lv = ଲିଭରମୋରିୟମ
    .ts = ଟେନେସିନ
    .og = ଓଗାନେସନ

element-anion-name =
    .h = ହାଇଡ୍ରାଇଡ
    .c = କାର୍ବାଇଡ
    .n = ନାଇଟ୍ରାଇଡ
    .o = ଅକ୍ସାଇଡ
    .f = ଫ୍ଲୋରାଇଡ
    .p = ଫସଫାଇଡ
    .s = ସଲଫାଇଡ
    .cl = କ୍ଲୋରାଇଡ
    .br = ବ୍ରୋମାଇଡ
    .i = ଆୟୋଡାଇଡ
    .at = ଆଷ୍ଟାଟାଇଡ
    .ts = ଟେନେସାଇଡ

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = ଅବୈଧ ରାସାୟନିକ ସଙ୍କେତ
chemistry-invalid-ionic-compound = ଅବୈଧ ଆୟୋନିକ ଯୌଗିକ
