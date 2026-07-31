# Korean content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Korean has no grammatical gender and no adjective agreement, so `$gender`
# goes unused here exactly as it does in English. Modifiers precede the noun,
# as in English, so the composition messages keep the English order.
#
# Particles that alternate on the preceding sound are avoided after a
# placeable. `{ $pattern } 무늬가 있는` is safe because 무늬 is fixed text and
# always takes 가; a bare `{ $pattern }이` would be wrong half the time. The
# one place the alternation could not be avoided, `{ $color }으로`, is safe
# because every colour word below ends in 색.


## Style vocabulary

color =
    .black = 검은색
    .white = 흰색
    .gray = 회색
    .red = 빨간색
    .orange = 주황색
    .yellow = 노란색
    .green = 초록색
    .cyan = 청록색
    .blue = 파란색
    .purple = 보라색
    .pink = 분홍색
    .brown = 갈색

line-width =
    .thick = 굵은
    .thin = 가는

line-style =
    .dashed = 파선
    .dotted = 점선

# Noun phrases: they precede 무늬가 있는 and modify nothing.
fill-style =
    .horizontal = 가로줄
    .vertical = 세로줄
    .diagonal = 대각선
    .backdiagonal = 역대각선
    .dots = 점
    .diamonds = 마름모

noun =
    .line = 직선
    .line-segment = 선분
    .ray = 반직선
    .vector = 벡터
    .curve = 곡선
    .function = 함수
    .parabola = 포물선
    .polyline = 꺾은선
    .polygon = 다각형
    .triangle = 삼각형
    .rectangle = 직사각형
    .circle = 원
    .region = 영역
    .point = 점
    .square = 정사각형
    .diamond = 마름모
    .cross = 십자
    .plus = 더하기 기호

# Korean puts the side count inside the noun itself — 정5각형 — so the whole
# thing is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] 정 { $numSides }각형
    }

# Korean has no grammatical gender, so every noun answers the same and the
# answer goes unused — as in English.
noun-gender = neuter


## Style composition

# 굵은 빨간색 파선: width, then colour, then the dash pattern, which is the
# noun the other two modify.
style-stroke =
    { $parts ->
        [width-style-color] { $width } { $color } { $lineStyle }
        [width-color] { $width } { $color }
        [style-color] { $color } { $lineStyle }
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

style-filled-word = 채워진

style-filled =
    { $parts ->
        [pattern] { $pattern } 무늬가 있는 { $color }으로 { $filled }
       *[plain] { $color }으로 { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } 무늬가 있는 { $color }으로 { $filled } { $noun }
        [plain-tail] { $color }으로 { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } 무늬가 있는 { $color }으로 { $filled } { $noun } { $nounTail }
       *[plain] { $color }으로 { $filled } { $noun }
    }

# Korean needs no article, so the `-article` branches read the same as the ones
# without.
style-border-clause =
    { $parts ->
        [with-article] { $border } 테두리가 있는
        [and] 그리고 { $border } 테두리
        [and-article] 그리고 { $border } 테두리
       *[with] { $border } 테두리가 있는
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = 채워지지 않은

style-text =
    { $parts ->
        [background] { $color }, 배경은 { $background }
       *[plain] { $color }
    }

style-background-none = 없음


## Boolean words

boolean-true = 참
boolean-false = 거짓


## Answer buttons

answer-submit-label = 정답 확인
answer-submit-label-no-correctness = 답안 제출


## Sectional blocks

section-name =
    .activity = 활동
    .aside = 참고
    .cascade = 캐스케이드
    .definition = 정의
    .example = 예제
    .exercise = 연습문제
    .exercises = 연습문제
    .given-answer = 정답
    .note = 노트
    .objectives = 학습 목표
    .paragraphs = 문단
    .part = 부
    .problem = 문제
    .problems = 문제
    .proof = 증명
    .question = 질문
    .section = 절
    .solution = 풀이
    .task = 과제
    .theorem = 정리

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = 힌트


## Tables and figures

table-name =
    { $parts ->
        [numbered] 표 { $enumeration }
        [numbered-title] 표 { $enumeration }{ ": " }
        [unnumbered-title] 표{ ": " }
       *[unnumbered] 표
    }

figure-name =
    { $parts ->
        [numbered] 그림 { $enumeration }
        [numbered-caption] 그림 { $enumeration }{ ": " }
        [unnumbered-caption] 그림{ ": " }
       *[unnumbered] 그림
    }


## Paginator controls

paginator-previous = 이전
paginator-next = 다음
paginator-page = 페이지

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = 또는
# Precedes the inequality the renderer writes after it, so it has to be a word
# that can come first — 만약 rather than the clause-final 일 때.
piecewise-condition-if = 만약
piecewise-condition-otherwise = 그 외의 경우


## Chemistry

# The names the Korean Chemical Society settled on, which is what current
# textbooks use: 소듐 and 포타슘 rather than the older 나트륨 and 칼륨.
element-name =
    .h = 수소
    .he = 헬륨
    .li = 리튬
    .be = 베릴륨
    .b = 붕소
    .c = 탄소
    .n = 질소
    .o = 산소
    .f = 플루오린
    .ne = 네온
    .na = 소듐
    .mg = 마그네슘
    .al = 알루미늄
    .si = 규소
    .p = 인
    .s = 황
    .cl = 염소
    .ar = 아르곤
    .k = 포타슘
    .ca = 칼슘
    .sc = 스칸듐
    .ti = 타이타늄
    .v = 바나듐
    .cr = 크로뮴
    .mn = 망가니즈
    .fe = 철
    .co = 코발트
    .ni = 니켈
    .cu = 구리
    .zn = 아연
    .ga = 갈륨
    .ge = 저마늄
    .as = 비소
    .se = 셀레늄
    .br = 브로민
    .kr = 크립톤
    .rb = 루비듐
    .sr = 스트론튬
    .y = 이트륨
    .zr = 지르코늄
    .nb = 나이오븀
    .mo = 몰리브데넘
    .tc = 테크네튬
    .ru = 루테늄
    .rh = 로듐
    .pd = 팔라듐
    .ag = 은
    .cd = 카드뮴
    .in = 인듐
    .sn = 주석
    .sb = 안티모니
    .te = 텔루륨
    .i = 아이오딘
    .xe = 제논
    .cs = 세슘
    .ba = 바륨
    .la = 란타넘
    .ce = 세륨
    .pr = 프라세오디뮴
    .nd = 네오디뮴
    .pm = 프로메튬
    .sm = 사마륨
    .eu = 유로퓸
    .gd = 가돌리늄
    .tb = 터븀
    .dy = 디스프로슘
    .ho = 홀뮴
    .er = 어븀
    .tm = 툴륨
    .yb = 이터븀
    .lu = 루테튬
    .hf = 하프늄
    .ta = 탄탈럼
    .w = 텅스텐
    .re = 레늄
    .os = 오스뮴
    .ir = 이리듐
    .pt = 백금
    .au = 금
    .hg = 수은
    .tl = 탈륨
    .pb = 납
    .bi = 비스무트
    .po = 폴로늄
    .at = 아스타틴
    .rn = 라돈
    .fr = 프랑슘
    .ra = 라듐
    .ac = 악티늄
    .th = 토륨
    .pa = 프로트악티늄
    .u = 우라늄
    .np = 넵투늄
    .pu = 플루토늄
    .am = 아메리슘
    .cm = 퀴륨
    .bk = 버클륨
    .cf = 캘리포늄
    .es = 아인슈타이늄
    .fm = 페르뮴
    .md = 멘델레븀
    .no = 노벨륨
    .lr = 로렌슘
    .rf = 러더포듐
    .db = 더브늄
    .sg = 시보귬
    .bh = 보륨
    .hs = 하슘
    .mt = 마이트너륨
    .ds = 다름슈타튬
    .rg = 뢴트게늄
    .cn = 코페르니슘
    .nh = 니호늄
    .fl = 플레로븀
    .mc = 모스코븀
    .lv = 리버모륨
    .ts = 테네신
    .og = 오가네손

element-anion-name =
    .h = 수소화물
    .c = 탄화물
    .n = 질화물
    .o = 산화물
    .f = 플루오린화물
    .p = 인화물
    .s = 황화물
    .cl = 염화물
    .br = 브로민화물
    .i = 아이오딘화물
    .at = 아스타틴화물
    .ts = 테네신화물

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = 잘못된 화학 기호
chemistry-invalid-ionic-compound = 잘못된 이온 화합물
