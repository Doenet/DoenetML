# Malayalam content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Malayalam has no adjective agreement, so `$gender` and `$role` go unused here
# exactly as they do in English. Adjectives precede their noun, as in English,
# so the composition messages keep the English order.
#
# What moves is the adposition. Malayalam postposes: "with a thick red border"
# is «കട്ടിയുള്ള ചുവന്ന അതിരോടെ», the marker suffixed to the noun rather than
# a word in front of it. The two `-article` branches read like the ones
# without — Malayalam has no article.
#
# Numbers render in Latin digits rather than in Malayalam numerals, which is
# the digit policy in the package README (#1615).


## Style vocabulary

# The adjectival forms, which is what Malayalam puts in front of a noun:
# «ചുവന്ന വര», not the colour noun itself. The loans that have no such form —
# ഓറഞ്ച്, പിങ്ക്, പർപ്പിൾ — stand as they are, which is also how they are
# written.
color =
    .black = കറുത്ത
    .white = വെളുത്ത
    .gray = ചാരനിറമുള്ള
    .red = ചുവന്ന
    .orange = ഓറഞ്ച്
    .yellow = മഞ്ഞ
    .green = പച്ച
    .cyan = നീലപ്പച്ച
    .blue = നീല
    .purple = പർപ്പിൾ
    .pink = പിങ്ക്
    .brown = തവിട്ട്
line-width =
    .thick = കട്ടിയുള്ള
    .thin = നേർത്ത
line-style =
    .dashed = മുറിഞ്ഞ
    .dotted = കുത്തിട്ട
# Noun phrases: they stand in front of the «സഹിതം» the composition messages
# supply, and modify nothing.
fill-style =
    .horizontal = തിരശ്ചീന വരകൾ
    .vertical = ലംബ വരകൾ
    .diagonal = കോണോട്ടു വരകൾ
    .backdiagonal = എതിർ കോണോട്ടു വരകൾ
    .dots = കുത്തുകൾ
    .diamonds = വജ്രാകൃതികൾ
noun =
    .line = നേർരേഖ
    .line-segment = രേഖാഖണ്ഡം
    .ray = രശ്മി
    .vector = സദിശം
    .curve = വക്രരേഖ
    .function = ഫലനം
    .parabola = പരവലയം
    .polyline = ബഹുരേഖ
    .polygon = ബഹുഭുജം
    .triangle = ത്രികോണം
    .rectangle = ദീർഘചതുരം
    .circle = വൃത്തം
    .region = പ്രദേശം
    .point = ബിന്ദു
    .square = സമചതുരം
    .diamond = വജ്രാകൃതി
    .cross = കുരിശടയാളം
    .plus = സങ്കലനചിഹ്നം
# The side count precedes the noun, as every modifier in Malayalam does, so it
# folds into the head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } വശങ്ങളുള്ള സമബഹുഭുജം
    }
# Malayalam marks gender on nouns and pronouns, not on the adjectives in these
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
style-filled-word = നിറച്ച
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } { $pattern } സഹിതം
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } { $pattern } സഹിതം
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } { $pattern } സഹിതം
       *[plain] { $filled } { $color } { $noun }
    }
# «അതിര്» is a fixed word, so the comitative -ഓടെ is written onto it directly,
# and «കൂടാതെ» opens the further clause where English opens it with "and".
# Malayalam has no article, so the two `-article` branches read like the ones
# without.
style-border-clause =
    { $parts ->
        [with-article] { $border } അതിരോടെ
        [and] കൂടാതെ { $border } അതിരോടെ
        [and-article] കൂടാതെ { $border } അതിരോടെ
       *[with] { $border } അതിരോടെ
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = നിറയ്ക്കാത്ത
# «പശ്ചാത്തലം» takes the locative -ത്തിൽ, so the background leads and the text
# colour follows it.
style-text =
    { $parts ->
        [background] { $background } പശ്ചാത്തലത്തിൽ { $color }
       *[plain] { $color }
    }
style-background-none = ഒന്നുമില്ല

## Boolean words

boolean-true = സത്യം
boolean-false = അസത്യം

## Answer buttons

answer-submit-label = പരിശോധിക്കുക
answer-submit-label-no-correctness = ഉത്തരം സമർപ്പിക്കുക

## Sectional blocks

section-name =
    .activity = പ്രവർത്തനം
    .aside = പാർശ്വക്കുറിപ്പ്
    .cascade = ശ്രേണി
    .definition = നിർവചനം
    .example = ഉദാഹരണം
    .exercise = അഭ്യാസം
    .exercises = അഭ്യാസങ്ങൾ
    .given-answer = ഉത്തരം
    .note = കുറിപ്പ്
    .objectives = ലക്ഷ്യങ്ങൾ
    .paragraphs = ഖണ്ഡികകൾ
    .part = ഭാഗം
    .problem = പ്രശ്നം
    .problems = പ്രശ്നങ്ങൾ
    .proof = തെളിവ്
    .question = ചോദ്യം
    .section = വിഭാഗം
    .solution = നിർധാരണം
    .task = ദൗത്യം
    .theorem = സിദ്ധാന്തം
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = സൂചന

## Tables and figures

table-name =
    { $parts ->
        [numbered] പട്ടിക { $enumeration }
        [numbered-title] പട്ടിക { $enumeration }{ ": " }
        [unnumbered-title] പട്ടിക{ ": " }
       *[unnumbered] പട്ടിക
    }
figure-name =
    { $parts ->
        [numbered] ചിത്രം { $enumeration }
        [numbered-caption] ചിത്രം { $enumeration }{ ": " }
        [unnumbered-caption] ചിത്രം{ ": " }
       *[unnumbered] ചിത്രം
    }

## Paginator controls

paginator-previous = മുൻപത്തേത്
paginator-next = അടുത്തത്
paginator-page = പേജ്
# The total leads, marked with the locative -ൽ, which is how Malayalam says
# "3 of 5".
paginator-page-status = { $numPages } ൽ { $pageLabel } { $currentPage }

## Piecewise functions

piecewise-condition-or = അഥവാ
piecewise-condition-if = എങ്കിൽ
piecewise-condition-otherwise = അല്ലെങ്കിൽ

## Chemistry

# The names Malayalam-medium school chemistry uses. Most are the international
# names written in Malayalam script; the handful that name a metal known long
# before its element was — ഇരുമ്പ്, ചെമ്പ്, വെള്ളി, സ്വർണം, ഈയം, വെളുത്തീയം,
# രസം — are the ordinary Malayalam words, which is what a textbook prints.
element-name =
    .h = ഹൈഡ്രജൻ
    .he = ഹീലിയം
    .li = ലിഥിയം
    .be = ബെറിലിയം
    .b = ബോറോൺ
    .c = കാർബൺ
    .n = നൈട്രജൻ
    .o = ഓക്സിജൻ
    .f = ഫ്ലൂറിൻ
    .ne = നിയോൺ
    .na = സോഡിയം
    .mg = മഗ്നീഷ്യം
    .al = അലുമിനിയം
    .si = സിലിക്കൺ
    .p = ഫോസ്ഫറസ്
    .s = സൾഫർ
    .cl = ക്ലോറിൻ
    .ar = ആർഗൺ
    .k = പൊട്ടാസ്യം
    .ca = കാൽസ്യം
    .sc = സ്കാൻഡിയം
    .ti = ടൈറ്റാനിയം
    .v = വനേഡിയം
    .cr = ക്രോമിയം
    .mn = മാംഗനീസ്
    .fe = ഇരുമ്പ്
    .co = കൊബാൾട്ട്
    .ni = നിക്കൽ
    .cu = ചെമ്പ്
    .zn = സിങ്ക്
    .ga = ഗാലിയം
    .ge = ജെർമേനിയം
    .as = ആഴ്സനിക്
    .se = സെലീനിയം
    .br = ബ്രോമിൻ
    .kr = ക്രിപ്റ്റോൺ
    .rb = റുബീഡിയം
    .sr = സ്ട്രോൺഷ്യം
    .y = യിട്രിയം
    .zr = സിർക്കോണിയം
    .nb = നയോബിയം
    .mo = മോളിബ്ഡിനം
    .tc = ടെക്നീഷ്യം
    .ru = റുഥേനിയം
    .rh = റോഡിയം
    .pd = പലേഡിയം
    .ag = വെള്ളി
    .cd = കാഡ്മിയം
    .in = ഇൻഡിയം
    .sn = വെളുത്തീയം
    .sb = ആന്റിമണി
    .te = ടെല്ലൂറിയം
    .i = അയഡിൻ
    .xe = സെനോൺ
    .cs = സീസിയം
    .ba = ബേരിയം
    .la = ലാന്തനം
    .ce = സീറിയം
    .pr = പ്രസിയോഡൈമിയം
    .nd = നിയോഡൈമിയം
    .pm = പ്രൊമിഥിയം
    .sm = സമേറിയം
    .eu = യൂറോപ്യം
    .gd = ഗാഡോലിനിയം
    .tb = ടെർബിയം
    .dy = ഡിസ്പ്രോസിയം
    .ho = ഹോൾമിയം
    .er = എർബിയം
    .tm = തുലിയം
    .yb = ഇറ്റർബിയം
    .lu = ലുട്ടീഷ്യം
    .hf = ഹാഫ്നിയം
    .ta = ടാന്റലം
    .w = ടങ്സ്റ്റൺ
    .re = റീനിയം
    .os = ഓസ്മിയം
    .ir = ഇറിഡിയം
    .pt = പ്ലാറ്റിനം
    .au = സ്വർണം
    .hg = രസം
    .tl = താലിയം
    .pb = ഈയം
    .bi = ബിസ്മത്ത്
    .po = പൊളോണിയം
    .at = അസ്റ്റാറ്റിൻ
    .rn = റഡോൺ
    .fr = ഫ്രാൻസിയം
    .ra = റേഡിയം
    .ac = ആക്ടിനിയം
    .th = തോറിയം
    .pa = പ്രൊട്ടാക്റ്റിനിയം
    .u = യുറേനിയം
    .np = നെപ്ട്യൂണിയം
    .pu = പ്ലൂട്ടോണിയം
    .am = അമേരിസിയം
    .cm = ക്യൂറിയം
    .bk = ബെർക്കിലിയം
    .cf = കാലിഫോർണിയം
    .es = ഐൻസ്റ്റീനിയം
    .fm = ഫെർമിയം
    .md = മെൻഡലീവിയം
    .no = നൊബേലിയം
    .lr = ലോറൻസിയം
    .rf = റുഥർഫോർഡിയം
    .db = ഡബ്നിയം
    .sg = സീബോർജിയം
    .bh = ബോറിയം
    .hs = ഹാസിയം
    .mt = മെയ്റ്റ്നീരിയം
    .ds = ഡാർംസ്റ്റാഡിയം
    .rg = റോൻട്ജീനിയം
    .cn = കോപ്പർനീസിയം
    .nh = നിഹോണിയം
    .fl = ഫ്ലെറോവിയം
    .mc = മോസ്കോവിയം
    .lv = ലിവർമോറിയം
    .ts = ടെന്നസ്സിൻ
    .og = ഒഗനെസ്സൺ
element-anion-name =
    .h = ഹൈഡ്രൈഡ്
    .c = കാർബൈഡ്
    .n = നൈട്രൈഡ്
    .o = ഓക്സൈഡ്
    .f = ഫ്ലൂറൈഡ്
    .p = ഫോസ്ഫൈഡ്
    .s = സൾഫൈഡ്
    .cl = ക്ലോറൈഡ്
    .br = ബ്രോമൈഡ്
    .i = അയഡൈഡ്
    .at = അസ്റ്റാറ്റൈഡ്
    .ts = ടെന്നസ്സൈഡ്
ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = അസാധുവായ രാസ ചിഹ്നം
chemistry-invalid-ionic-compound = അസാധുവായ അയോണിക സംയുക്തം
