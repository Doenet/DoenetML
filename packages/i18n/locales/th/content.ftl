# Thai content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Thai has no grammatical gender, no adjective agreement and no article, so
# `$gender` and `$role` go unused here exactly as they do in English, and the
# two `-article` branches read like the ones without.
#
# Adjectives *follow* the noun they modify — «เส้นตรงหนาประสีแดง» — so the
# composition messages put the noun first, as Vietnamese does, and keep the
# English order among the adjectives themselves.
#
# Thai is written without spaces between words, so the placeables sit flush
# against each other and a space appears only where the phrase genuinely
# breaks.
#
# Numbers render in Latin digits rather than in Thai numerals, which is the
# digit policy in the package README (#1615) and is what Thai schoolbooks
# print.


## Style vocabulary

# The colour words carry «สี», which is how Thai names a colour attributively.
color =
    .black = สีดำ
    .white = สีขาว
    .gray = สีเทา
    .red = สีแดง
    .orange = สีส้ม
    .yellow = สีเหลือง
    .green = สีเขียว
    .cyan = สีฟ้าอมเขียว
    .blue = สีน้ำเงิน
    .purple = สีม่วง
    .pink = สีชมพู
    .brown = สีน้ำตาล

line-width =
    .thick = หนา
    .thin = บาง

line-style =
    .dashed = ประ
    .dotted = จุด

# Noun phrases: they follow «พร้อม» and modify nothing.
fill-style =
    .horizontal = เส้นแนวนอน
    .vertical = เส้นแนวตั้ง
    .diagonal = เส้นทแยงมุม
    .backdiagonal = เส้นทแยงมุมกลับด้าน
    .dots = จุด
    .diamonds = รูปข้าวหลามตัด

noun =
    .line = เส้นตรง
    .line-segment = ส่วนของเส้นตรง
    .ray = รังสี
    .vector = เวกเตอร์
    .curve = เส้นโค้ง
    .function = ฟังก์ชัน
    .parabola = พาราโบลา
    .polyline = เส้นหักหลายท่อน
    .polygon = รูปหลายเหลี่ยม
    .triangle = รูปสามเหลี่ยม
    .rectangle = รูปสี่เหลี่ยมผืนผ้า
    .circle = วงกลม
    .region = บริเวณ
    .point = จุด
    .square = รูปสี่เหลี่ยมจัตุรัส
    .diamond = รูปข้าวหลามตัด
    .cross = เครื่องหมายกากบาท
    .plus = เครื่องหมายบวก

# The side count sits immediately after the noun and before any adjective —
# «รูปหลายเหลี่ยมด้านเท่า 5 ด้าน» — so it folds into the head and there is no
# tail. Putting it after the adjectives would separate «ด้าน» from the number
# counting it.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] รูปหลายเหลี่ยมด้านเท่า { $numSides } ด้าน
    }

# Thai has no grammatical gender, so every noun answers the same and the answer
# goes unused — as in English.
noun-gender = neuter


## Style composition

style-stroke =
    { $parts ->
        [width-style-color] { $width }{ $lineStyle }{ $color }
        [width-color] { $width }{ $color }
        [style-color] { $lineStyle }{ $color }
        [width-style] { $width }{ $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }

# The noun leads and its adjectives follow: «เส้นตรงหนาประสีแดง».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun }{ $description }{ $nounTail }
       *[noun] { $noun }{ $description }
    }

# «ระบาย» rather than «ระบายสี»: every colour word above already carries its
# own สี, and `$filled` is placed immediately in front of `$color` in all four
# messages below, so spelling it out here would render «ระบายสีสีน้ำเงิน». What
# the composition produces is «ระบายสีน้ำเงิน» — the same phrase, said once.
# `style-unfilled` stands alone and keeps the full form.
style-filled-word = ระบาย

style-filled =
    { $parts ->
        [pattern] { $filled }{ $color } พร้อม{ $pattern }
       *[plain] { $filled }{ $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun }{ $filled }{ $color } พร้อม{ $pattern }
        [plain-tail] { $noun }{ $nounTail }{ $filled }{ $color }
        [pattern-tail] { $noun }{ $nounTail }{ $filled }{ $color } พร้อม{ $pattern }
       *[plain] { $noun }{ $filled }{ $color }
    }

# «ขอบ» leads its own adjectives, the same way every noun here does. Thai needs
# no article, so the `-article` branches read like the ones without.
style-border-clause =
    { $parts ->
        [with-article] พร้อมขอบ{ $border }
        [and] และขอบ{ $border }
        [and-article] และขอบ{ $border }
       *[with] พร้อมขอบ{ $border }
    }

# The pattern is a noun and the colour follows it, as everywhere else.
style-fill =
    { $parts ->
        [pattern] { $pattern }{ $color }
       *[plain] { $color }
    }

style-unfilled = ไม่ระบายสี

style-text =
    { $parts ->
        [background] { $color }บนพื้นหลัง{ $background }
       *[plain] { $color }
    }

style-background-none = ไม่มี


## Boolean words

boolean-true = จริง
boolean-false = เท็จ


## Answer buttons

answer-submit-label = ตรวจคำตอบ
answer-submit-label-no-correctness = ส่งคำตอบ


## Sectional blocks

section-name =
    .activity = กิจกรรม
    .aside = หมายเหตุข้าง
    .cascade = ลำดับ
    .definition = บทนิยาม
    .example = ตัวอย่าง
    .exercise = แบบฝึกหัด
    .exercises = แบบฝึกหัด
    .given-answer = คำตอบ
    .note = หมายเหตุ
    .objectives = จุดประสงค์
    .paragraphs = ย่อหน้า
    .part = ตอน
    .problem = โจทย์
    .problems = โจทย์
    .proof = การพิสูจน์
    .question = คำถาม
    .section = หัวข้อ
    .solution = เฉลย
    .task = ภารกิจ
    .theorem = ทฤษฎีบท

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = คำใบ้


## Tables and figures

table-name =
    { $parts ->
        [numbered] ตาราง { $enumeration }
        [numbered-title] ตาราง { $enumeration }{ ": " }
        [unnumbered-title] ตาราง{ ": " }
       *[unnumbered] ตาราง
    }

figure-name =
    { $parts ->
        [numbered] รูป { $enumeration }
        [numbered-caption] รูป { $enumeration }{ ": " }
        [unnumbered-caption] รูป{ ": " }
       *[unnumbered] รูป
    }


## Paginator controls

paginator-previous = ก่อนหน้า
paginator-next = ถัดไป
paginator-page = หน้า

paginator-page-status = { $pageLabel } { $currentPage } จาก { $numPages }


## Piecewise functions

piecewise-condition-or = หรือ
piecewise-condition-if = เมื่อ
piecewise-condition-otherwise = กรณีอื่น


## Chemistry

# The Thai names, which are the transcriptions the Royal Society settled and
# every Thai chemistry textbook prints. The metals known long before their
# elements were — เหล็ก, ทองแดง, เงิน, ทองคำ, ตะกั่ว, ดีบุก, สังกะสี, ปรอท,
# กำมะถัน, พลวง, สารหนู — keep their ordinary Thai names, as the same
# textbooks do.
element-name =
    .h = ไฮโดรเจน
    .he = ฮีเลียม
    .li = ลิเทียม
    .be = เบริลเลียม
    .b = โบรอน
    .c = คาร์บอน
    .n = ไนโตรเจน
    .o = ออกซิเจน
    .f = ฟลูออรีน
    .ne = นีออน
    .na = โซเดียม
    .mg = แมกนีเซียม
    .al = อะลูมิเนียม
    .si = ซิลิคอน
    .p = ฟอสฟอรัส
    .s = กำมะถัน
    .cl = คลอรีน
    .ar = อาร์กอน
    .k = โพแทสเซียม
    .ca = แคลเซียม
    .sc = สแคนเดียม
    .ti = ไทเทเนียม
    .v = วาเนเดียม
    .cr = โครเมียม
    .mn = แมงกานีส
    .fe = เหล็ก
    .co = โคบอลต์
    .ni = นิกเกิล
    .cu = ทองแดง
    .zn = สังกะสี
    .ga = แกลเลียม
    .ge = เจอร์เมเนียม
    .as = สารหนู
    .se = ซีลีเนียม
    .br = โบรมีน
    .kr = คริปทอน
    .rb = รูบิเดียม
    .sr = สตรอนเชียม
    .y = อิตเทรียม
    .zr = เซอร์โคเนียม
    .nb = ไนโอเบียม
    .mo = โมลิบดีนัม
    .tc = เทคนีเชียม
    .ru = รูทีเนียม
    .rh = โรเดียม
    .pd = แพลเลเดียม
    .ag = เงิน
    .cd = แคดเมียม
    .in = อินเดียม
    .sn = ดีบุก
    .sb = พลวง
    .te = เทลลูเรียม
    .i = ไอโอดีน
    .xe = ซีนอน
    .cs = ซีเซียม
    .ba = แบเรียม
    .la = แลนทานัม
    .ce = ซีเรียม
    .pr = เพรซีโอดิเมียม
    .nd = นีโอดิเมียม
    .pm = โพรมีเทียม
    .sm = ซาแมเรียม
    .eu = ยูโรเพียม
    .gd = แกโดลิเนียม
    .tb = เทอร์เบียม
    .dy = ดิสโพรเซียม
    .ho = โฮลเมียม
    .er = เออร์เบียม
    .tm = ทูเลียม
    .yb = อิตเทอร์เบียม
    .lu = ลูทีเทียม
    .hf = แฮฟเนียม
    .ta = แทนทาลัม
    .w = ทังสเตน
    .re = รีเนียม
    .os = ออสเมียม
    .ir = อิริเดียม
    .pt = แพลทินัม
    .au = ทองคำ
    .hg = ปรอท
    .tl = แทลเลียม
    .pb = ตะกั่ว
    .bi = บิสมัท
    .po = พอโลเนียม
    .at = แอสทาทีน
    .rn = เรดอน
    .fr = แฟรนเซียม
    .ra = เรเดียม
    .ac = แอกทิเนียม
    .th = ทอเรียม
    .pa = โพรแทกทิเนียม
    .u = ยูเรเนียม
    .np = เนปทูเนียม
    .pu = พลูโทเนียม
    .am = อะเมริเซียม
    .cm = คูเรียม
    .bk = เบอร์คีเลียม
    .cf = แคลิฟอร์เนียม
    .es = ไอน์สไตเนียม
    .fm = เฟอร์เมียม
    .md = เมนเดลีเวียม
    .no = โนเบเลียม
    .lr = ลอว์เรนเซียม
    .rf = รัทเทอร์ฟอร์เดียม
    .db = ดุบเนียม
    .sg = ซีบอร์เกียม
    .bh = โบห์เรียม
    .hs = ฮัสเซียม
    .mt = ไมต์เนเรียม
    .ds = ดาร์มสตัดเทียม
    .rg = เรินต์เกเนียม
    .cn = โคเปอร์นิเซียม
    .nh = นิโฮเนียม
    .fl = ฟลีโรเวียม
    .mc = มอสโกเวียม
    .lv = ลิเวอร์มอเรียม
    .ts = เทนเนสซีน
    .og = ออกาเนสซอน

element-anion-name =
    .h = ไฮไดรด์
    .c = คาร์ไบด์
    .n = ไนไตรด์
    .o = ออกไซด์
    .f = ฟลูออไรด์
    .p = ฟอสไฟด์
    .s = ซัลไฟด์
    .cl = คลอไรด์
    .br = โบรไมด์
    .i = ไอโอไดด์
    .at = แอสทาไทด์
    .ts = เทนเนสไซด์

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = สัญลักษณ์เคมีไม่ถูกต้อง
chemistry-invalid-ionic-compound = สารประกอบไอออนิกไม่ถูกต้อง
