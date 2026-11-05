# Vietnamese content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Vietnamese has no grammatical gender and no adjective agreement, so `$gender`
# goes unused here exactly as it does in English. Adjectives *follow* the noun
# they modify — "đường thẳng đậm nét đứt màu đỏ" — so the composition messages
# put the noun first, as Spanish does, and keep the English order among the
# adjectives themselves.
#
# The element names are deliberately absent; see the note above `element-name`.


## Style vocabulary

color =
    .black = màu đen
    .white = màu trắng
    .gray = màu xám
    .red = màu đỏ
    .orange = màu cam
    .yellow = màu vàng
    .green = màu xanh lá
    .cyan = màu xanh lơ
    .blue = màu xanh dương
    .purple = màu tím
    .pink = màu hồng
    .brown = màu nâu
line-width =
    .thick = đậm
    .thin = mảnh
line-style =
    .dashed = nét đứt
    .dotted = nét chấm
# Noun phrases: they follow "với" and modify nothing.
fill-style =
    .horizontal = đường kẻ ngang
    .vertical = đường kẻ dọc
    .diagonal = đường kẻ chéo
    .backdiagonal = đường kẻ chéo ngược
    .dots = chấm tròn
    .diamonds = hình thoi
noun =
    .line = đường thẳng
    .line-segment = đoạn thẳng
    .ray = tia
    .vector = vectơ
    .curve = đường cong
    .function = hàm số
    .parabola = parabol
    .polyline = đường gấp khúc
    .polygon = đa giác
    .triangle = tam giác
    .rectangle = hình chữ nhật
    .circle = đường tròn
    .region = miền
    .point = điểm
    .square = hình vuông
    .diamond = hình thoi
    .cross = dấu nhân
    .plus = dấu cộng
# The side count is part of the noun phrase and sits immediately after it —
# "đa giác đều 5 cạnh" — before any adjective, so it folds into the head and
# there is no tail. Putting it after the adjectives would separate "cạnh" from
# the number that counts it.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] đa giác đều { $numSides } cạnh
    }
# Vietnamese has no grammatical gender, so every noun answers the same and the
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
# The noun leads and its adjectives follow: "đường thẳng đậm nét đứt màu đỏ".
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word = được tô
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } với { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } với { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } với { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# Vietnamese needs no article, so the `-article` branches read the same as the
# ones without.
style-border-clause =
    { $parts ->
        [with-article] với viền { $border }
        [and] và viền { $border }
        [and-article] và viền { $border }
       *[with] với viền { $border }
    }
# The pattern is a noun and the colour follows it, as everywhere else.
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = không tô
style-text =
    { $parts ->
        [background] { $color } trên nền { $background }
       *[plain] { $color }
    }
style-background-none = không có

## Boolean words

boolean-true = đúng
boolean-false = sai

## Answer buttons

answer-submit-label = Kiểm tra
answer-submit-label-no-correctness = Gửi câu trả lời

## Sectional blocks

section-name =
    .activity = Hoạt động
    .aside = Ghi chú bên lề
    .cascade = Chuỗi
    .definition = Định nghĩa
    .example = Ví dụ
    .exercise = Bài tập
    .exercises = Bài tập
    .given-answer = Đáp án
    .note = Ghi chú
    .objectives = Mục tiêu
    .paragraphs = Đoạn văn
    .part = Phần
    .problem = Bài toán
    .problems = Bài toán
    .proof = Chứng minh
    .question = Câu hỏi
    .section = Mục
    .solution = Lời giải
    .task = Nhiệm vụ
    .theorem = Định lý
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Gợi ý

## Tables and figures

table-name =
    { $parts ->
        [numbered] Bảng { $enumeration }
        [numbered-title] Bảng { $enumeration }{ ": " }
        [unnumbered-title] Bảng{ ": " }
       *[unnumbered] Bảng
    }
figure-name =
    { $parts ->
        [numbered] Hình { $enumeration }
        [numbered-caption] Hình { $enumeration }{ ": " }
        [unnumbered-caption] Hình{ ": " }
       *[unnumbered] Hình
    }

## Paginator controls

paginator-previous = Trước
paginator-next = Sau
paginator-page = Trang
paginator-page-status = { $pageLabel } { $currentPage } trên { $numPages }

## Piecewise functions

piecewise-condition-or = hoặc
piecewise-condition-if = nếu
piecewise-condition-otherwise = trường hợp còn lại

## Chemistry


# `element-name` and `element-anion-name` are deliberately omitted, and the 130
# keys fall back to English.
#
# Not for want of a nomenclature but because Vietnamese has two, and the current
# one is English. School chemistry has moved from the transliterated names
# (hiđro, cacbon, natri, lưu huỳnh) to the IUPAC forms (hydrogen, carbon,
# sodium, sulfur), which are the English words already in `locales/en`. Seeding
# the older names would teach against the curriculum; seeding the newer ones
# would restate the fallback. A speaker who wants the transliterated set in a
# document can add these keys, and `lint:i18n` reports the gap until then.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Ký hiệu hóa học không hợp lệ
chemistry-invalid-ionic-compound = Hợp chất ion không hợp lệ
