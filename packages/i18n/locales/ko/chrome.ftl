# Korean viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Korean has a single plural category, so a countable message needs no
# selection — `[other]` covers every count. `[0]` is still spelled out where
# the English wording changes for zero, because that is a different sentence
# rather than a different number.
#
# A count takes a counter word: `{ $count }회` rather than a bare number.
#
# Particles that alternate on the preceding sound (이/가, 을/를, 으로/로) are
# avoided after a placeable wherever the value could end either way, since
# Fluent cannot choose between them.


## Answer submission

answer-checking = 확인 중...
answer-submitting = 제출 중...
answer-checking-status = 답안을 확인하는 중
answer-submitting-status = 답안을 제출하는 중
answer-correct = 정답
answer-incorrect = 오답
answer-response-saved = 답안이 저장되었습니다
answer-percent-credit = { $percent }% 점수
answer-percent-correct = { $percent }% 정답
answer-percent-short = { $percent }%
max-credit-available = 받을 수 있는 최고 점수: { $percent }%
attempts-remaining =
    { $count ->
        [0] 남은 시도 횟수가 없습니다
       *[other] { $count }회 남음
    }
validation-correct = (정답)
validation-incorrect = (오답)
validation-partially-correct = (부분 정답)
answer-show-responses = { $answerId }에 대한 답안 { $count }개 보기

## Disclosure panels

feedback-heading = 피드백
collapsible-click-to-open = (클릭하여 열기)
collapsible-click-to-close = (클릭하여 닫기)
collapsible-initializing = 초기화 중...
footnote-show = 각주 보기
footnote-hide = 각주 숨기기
description-more-information = 자세한 정보

## Controls

slider-previous = 이전
slider-next = 다음
keyboard-open = 키보드 열기
keyboard-close = 키보드 닫기
choice-input-remove-choice = { $choice } 삭제
matrix-remove-row = 행 삭제
matrix-add-row = 행 추가
matrix-remove-column = 열 삭제
matrix-add-column = 열 추가
subset-add-remove-points = 점 추가/삭제
subset-toggle-points-intervals = 점과 구간 전환
subset-move-points = 점 이동
subset-clear = 지우기
# A `box` here is one orbital, drawn as a square: 상자.
orbital-add-row = 행 추가
orbital-remove-row = 행 삭제
orbital-add-box = 상자 추가
orbital-remove-box = 상자 삭제
orbital-add-up-arrow = 위쪽 화살표 추가
orbital-add-down-arrow = 아래쪽 화살표 추가
orbital-remove-arrow = 화살표 삭제
orbital-row-label = { $row }행의 레이블
pretzel-answer = 답

## Math input

math-input-preview-region = 수식 미리 보기
math-input-preview = 미리 보기
math-input-invalid-expression = 잘못된 수식:

## Document status

viewer-initializing = 초기화 중...

## Errors

error-heading = 오류
error-found-at =
    { $span ->
        [line] { $startLine }행에서 발견되었습니다.
       *[lines] { $startLine }–{ $endLine }행에서 발견되었습니다.
    }
document-contains-errors = 이 문서에는 오류가 있습니다!
diagnostic-heading-error = 오류
diagnostic-heading-warning = 경고
diagnostic-heading-information = 정보
diagnostic-heading-hint = 힌트
accessibility-heading-level-1 = WCAG AA 접근성 위반
accessibility-heading-level-2 = 접근성 알림
something-went-wrong = 문제가 발생했습니다.
renderer-load-failed = 렌더러를 불러오지 못했습니다. 페이지를 새로 고쳐 주세요.
core-start-failed = 문서 뷰어를 시작할 수 없습니다. 페이지를 새로 고쳐 주세요.
