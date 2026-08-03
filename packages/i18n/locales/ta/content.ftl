# Tamil content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Tamil has no grammatical gender and no adjective agreement, so `$gender` and
# `$role` go unused here exactly as they do in English. Adjectives precede
# their noun, as in English, so the composition messages keep the English
# order.
#
# What does move is the adposition. Tamil postposes: "with a thick red border"
# is «தடிமனான சிவப்பு விளிம்புடன்», the -உடன் suffixed to the noun rather than
# a word in front of it. So the `with`/`and` branches below put the whole
# phrase first and the marker last, and the two `-article` branches read like
# the ones without — Tamil has no article.
#
# Numbers render in Latin digits rather than in Tamil numerals, which is the
# digit policy in the package README (#1615). Tamil digits are historical and
# no school textbook writes a quantity in them.


## Style vocabulary

# Tamil uses the bare colour noun attributively — «சிவப்பு கோடு» — so these
# need no adjectival form of their own.
color =
    .black = கருப்பு
    .white = வெள்ளை
    .gray = சாம்பல்
    .red = சிவப்பு
    .orange = ஆரஞ்சு
    .yellow = மஞ்சள்
    .green = பச்சை
    .cyan = நீலப்பச்சை
    .blue = நீலம்
    .purple = ஊதா
    .pink = இளஞ்சிவப்பு
    .brown = பழுப்பு

line-width =
    .thick = தடிமனான
    .thin = மெல்லிய

line-style =
    .dashed = துண்டிக்கப்பட்ட
    .dotted = புள்ளியிட்ட

# Noun phrases: they stand in front of the «கொண்ட» the composition messages
# supply, and modify nothing.
fill-style =
    .horizontal = கிடைமட்டக் கோடுகள்
    .vertical = செங்குத்துக் கோடுகள்
    .diagonal = மூலைவிட்டக் கோடுகள்
    .backdiagonal = எதிர் மூலைவிட்டக் கோடுகள்
    .dots = புள்ளிகள்
    .diamonds = சாய்சதுரங்கள்

noun =
    .line = கோடு
    .line-segment = கோட்டுத்துண்டு
    .ray = கதிர்
    .vector = வெக்டர்
    .curve = வளைவரை
    .function = சார்பு
    .parabola = பரவளையம்
    .polyline = பலகோடு
    .polygon = பலகோணம்
    .triangle = முக்கோணம்
    .rectangle = செவ்வகம்
    .circle = வட்டம்
    .region = பகுதி
    .point = புள்ளி
    .square = சதுரம்
    .diamond = சாய்சதுரம்
    .cross = குறுக்குக் குறி
    .plus = கூட்டல் குறி

# The side count precedes the noun, as every modifier in Tamil does, so it
# folds into the head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } பக்க ஒழுங்கு பலகோணம்
    }

# Tamil has no grammatical gender, so every noun answers the same and the
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

style-filled-word = நிரப்பப்பட்ட

# The pattern is marked with «கொண்ட», a participle that stands as a word of
# its own in front of what it modifies, so the pattern clause leads. The bound
# «-உடன்» the border takes below cannot be used here: joining it to a word
# absorbs that word's final consonant — புள்ளிகள் + உடன் is புள்ளிகளுடன் —
# and the pattern arrives as an argument this catalog never sees, which is the
# affix rule in the package README.
style-filled =
    { $parts ->
        [pattern] { $pattern } கொண்ட { $filled } { $color }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } கொண்ட { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern } கொண்ட { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }

# «விளிம்பு» is the catalog's own word, so «-உடன்» is joined to it directly,
# and «மற்றும்» opens the further clause where English opens it with "and".
# Tamil has no article, so the two `-article` branches read like the ones
# without.
style-border-clause =
    { $parts ->
        [with-article] { $border } விளிம்புடன்
        [and] மற்றும் { $border } விளிம்புடன்
        [and-article] மற்றும் { $border } விளிம்புடன்
       *[with] { $border } விளிம்புடன்
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = நிரப்பப்படாத

# «பின்னணி» takes the locative -இல், so the background leads and the text
# colour follows it.
style-text =
    { $parts ->
        [background] { $background } பின்னணியில் { $color }
       *[plain] { $color }
    }

style-background-none = இல்லை


## Boolean words

boolean-true = உண்மை
boolean-false = பொய்


## Answer buttons

answer-submit-label = சரிபார்
answer-submit-label-no-correctness = பதிலைச் சமர்ப்பி


## Sectional blocks

section-name =
    .activity = செயல்பாடு
    .aside = குறிப்புரை
    .cascade = அடுக்கு
    .definition = வரையறை
    .example = எடுத்துக்காட்டு
    .exercise = பயிற்சி
    .exercises = பயிற்சிகள்
    .given-answer = விடை
    .note = குறிப்பு
    .objectives = நோக்கங்கள்
    .paragraphs = பத்திகள்
    .part = பகுதி
    .problem = கணக்கு
    .problems = கணக்குகள்
    .proof = நிரூபணம்
    .question = வினா
    .section = பிரிவு
    .solution = தீர்வு
    .task = பணி
    .theorem = தேற்றம்

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = உதவிக்குறிப்பு


## Tables and figures

table-name =
    { $parts ->
        [numbered] அட்டவணை { $enumeration }
        [numbered-title] அட்டவணை { $enumeration }{ ": " }
        [unnumbered-title] அட்டவணை{ ": " }
       *[unnumbered] அட்டவணை
    }

figure-name =
    { $parts ->
        [numbered] படம் { $enumeration }
        [numbered-caption] படம் { $enumeration }{ ": " }
        [unnumbered-caption] படம்{ ": " }
       *[unnumbered] படம்
    }


## Paginator controls

paginator-previous = முந்தையது
paginator-next = அடுத்தது
paginator-page = பக்கம்

# The total leads, marked with the locative -இல், which is how Tamil says
# "3 of 5".
paginator-page-status = { $numPages } இல் { $pageLabel } { $currentPage }


## Piecewise functions

piecewise-condition-or = அல்லது
piecewise-condition-if = எனில்
piecewise-condition-otherwise = இல்லையெனில்


## Chemistry

# The names Tamil-medium school chemistry uses. Most are the international
# names written in Tamil script; the handful that name a metal known long
# before its element was — இரும்பு, செம்பு, வெள்ளி, தங்கம், ஈயம், தகரம்,
# துத்தநாகம், பாதரசம் — are the ordinary Tamil words, which is what a
# textbook prints.
element-name =
    .h = ஹைட்ரஜன்
    .he = ஹீலியம்
    .li = லித்தியம்
    .be = பெரிலியம்
    .b = போரான்
    .c = கார்பன்
    .n = நைட்ரஜன்
    .o = ஆக்சிஜன்
    .f = ஃபுளூரின்
    .ne = நியான்
    .na = சோடியம்
    .mg = மெக்னீசியம்
    .al = அலுமினியம்
    .si = சிலிக்கான்
    .p = பாஸ்பரஸ்
    .s = சல்பர்
    .cl = குளோரின்
    .ar = ஆர்கான்
    .k = பொட்டாசியம்
    .ca = கால்சியம்
    .sc = ஸ்கேண்டியம்
    .ti = டைட்டானியம்
    .v = வெனேடியம்
    .cr = குரோமியம்
    .mn = மாங்கனீசு
    .fe = இரும்பு
    .co = கோபால்ட்
    .ni = நிக்கல்
    .cu = செம்பு
    .zn = துத்தநாகம்
    .ga = காலியம்
    .ge = ஜெர்மேனியம்
    .as = ஆர்சனிக்
    .se = செலினியம்
    .br = புரோமின்
    .kr = கிரிப்டான்
    .rb = ருபிடியம்
    .sr = ஸ்ட்ரோன்சியம்
    .y = இட்ரியம்
    .zr = சிர்கோனியம்
    .nb = நையோபியம்
    .mo = மாலிப்டினம்
    .tc = டெக்னீசியம்
    .ru = ருத்தேனியம்
    .rh = ரோடியம்
    .pd = பலேடியம்
    .ag = வெள்ளி
    .cd = காட்மியம்
    .in = இண்டியம்
    .sn = தகரம்
    .sb = ஆண்டிமனி
    .te = டெல்லூரியம்
    .i = அயோடின்
    .xe = செனான்
    .cs = சீசியம்
    .ba = பேரியம்
    .la = லாந்தனம்
    .ce = சீரியம்
    .pr = பிரசியோடைமியம்
    .nd = நியோடைமியம்
    .pm = புரோமித்தியம்
    .sm = சமேரியம்
    .eu = யூரோப்பியம்
    .gd = காடோலினியம்
    .tb = டெர்பியம்
    .dy = டிஸ்புரோசியம்
    .ho = ஹோல்மியம்
    .er = எர்பியம்
    .tm = துலியம்
    .yb = இட்டர்பியம்
    .lu = லுடீசியம்
    .hf = ஹாஃப்னியம்
    .ta = டாண்டலம்
    .w = டங்ஸ்டன்
    .re = ரீனியம்
    .os = ஆஸ்மியம்
    .ir = இரிடியம்
    .pt = பிளாட்டினம்
    .au = தங்கம்
    .hg = பாதரசம்
    .tl = தாலியம்
    .pb = ஈயம்
    .bi = பிஸ்மத்
    .po = பொலோனியம்
    .at = அஸ்டாட்டின்
    .rn = ரேடான்
    .fr = பிரான்சியம்
    .ra = ரேடியம்
    .ac = ஆக்டினியம்
    .th = தோரியம்
    .pa = புரோட்டாக்டினியம்
    .u = யுரேனியம்
    .np = நெப்டியூனியம்
    .pu = புளூட்டோனியம்
    .am = அமெரிசியம்
    .cm = கியூரியம்
    .bk = பெர்க்கிலியம்
    .cf = கலிஃபோர்னியம்
    .es = ஐன்ஸ்டைனியம்
    .fm = ஃபெர்மியம்
    .md = மெண்டலீவியம்
    .no = நோபிலியம்
    .lr = லாரென்சியம்
    .rf = ரூதர்ஃபோர்டியம்
    .db = டப்னியம்
    .sg = சீபோர்கியம்
    .bh = போரியம்
    .hs = ஹாசியம்
    .mt = மெய்ட்னீரியம்
    .ds = டார்ம்ஸ்டாட்டியம்
    .rg = ரோன்ட்ஜீனியம்
    .cn = கோப்பர்நிசியம்
    .nh = நிஹோனியம்
    .fl = ஃபிளெரோவியம்
    .mc = மாஸ்கோவியம்
    .lv = லிவர்மோரியம்
    .ts = டென்னசைன்
    .og = ஓகனிசான்

element-anion-name =
    .h = ஹைட்ரைடு
    .c = கார்பைடு
    .n = நைட்ரைடு
    .o = ஆக்சைடு
    .f = ஃபுளூரைடு
    .p = பாஸ்பைடு
    .s = சல்பைடு
    .cl = குளோரைடு
    .br = புரோமைடு
    .i = அயோடைடு
    .at = அஸ்டட்டைடு
    .ts = டென்னசைடு

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = தவறான வேதியியல் குறியீடு
chemistry-invalid-ionic-compound = தவறான அயனிச் சேர்மம்
