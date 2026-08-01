# Korean editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# Korean has a single plural category, so a countable message needs no
# selection — `[other]` covers every count.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] 초기화
       *[update] 갱신
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] 뷰어 { $word }
       *[other] 뷰어 { $word } { $shortcut }
    }


## The variant picker

editor-variant = 변형
editor-variant-filter = 필터...
editor-variant-next = 다음 변형 선택
editor-variant-previous = 이전 변형 선택


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA 접근성 위반이 발견되었습니다. 클릭하면 접근성 보고서를 { $action ->
            [close] 닫습니다
           *[open] 엽니다
        }.
        [advisories] 클릭하면 접근성 보고서를 { $action ->
            [close] 닫습니다
           *[open] 엽니다
        }. WCAG AA 위반은 없지만 추가 접근성 권장 사항이 있습니다.
       *[clean] 클릭하면 접근성 보고서를 { $action ->
            [close] 닫습니다
           *[open] 엽니다
        }. 접근성 문제가 발견되지 않았습니다.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA 접근성 위반이 발견되었습니다. WCAG AA 위반 { $count }건이 발견되었습니다. 클릭하면 접근성 보고서를 { $action ->
            [close] 닫습니다
           *[open] 엽니다
        }.
        [advisories] WCAG AA 위반은 발견되지 않았습니다. 추가 접근성 권장 사항 { $count }건이 발견되었습니다. 클릭하면 접근성 보고서를 { $action ->
            [close] 닫습니다
           *[open] 엽니다
        }.
       *[clean] WCAG AA 위반은 발견되지 않았습니다. 클릭하면 접근성 보고서를 { $action ->
            [close] 닫습니다
           *[open] 엽니다
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML 버전 { $version }

editor-tab-help = 상황별 도움말
editor-tab-help-short = 상황
editor-tab-errors = 오류
editor-tab-warnings = 경고
editor-tab-info = 정보
editor-tab-accessibility = 접근성
editor-tab-responses = 제출된 답안

editor-tab-with-count = { $label }: { $count }

editor-options = 편집기 옵션
editor-format-as-doenetml = DoenetML 형식으로 정리
editor-format-as-xml = XML 형식으로 정리


## The diagnostics panel

editor-diagnostic-line = { $line }행

editor-no-errors = 오류 없음
editor-no-warnings = 경고 없음
editor-no-info = 정보 진단 없음

editor-show-info-annotations = 편집기에 정보 진단 표시
editor-show-accessibility-annotations = 편집기에 접근성 진단 표시

editor-accessibility-learn-more = Doenet의 접근성 접근 방식 알아보기

editor-accessibility-violations-heading = 접근성 위반 ({ $standard })

editor-accessibility-other-heading = 기타 접근성 문제
editor-none-found = 발견된 항목 없음


## Submitted responses

editor-no-responses = 아직 제출된 답안이 없습니다
editor-response-answer-id = 답안 Id
editor-response-response = 답안
editor-response-credit = 점수
editor-response-submitted = 제출 시각


## The context-help panel

help-placeholder = 태그 이름, 속성 또는 { $ref } 위에 커서를 두면 문서를 볼 수 있습니다.

help-unsupported-ref-chain = { $example }와(과) 같은 다단계 참조에 대한 도움말은 아직 지원되지 않습니다.

help-unresolved-ref =
    { $reason ->
        [notFound] 참조 대상을 찾을 수 없습니다: { $ref }.
        [multiple] 참조 대상이 여러 개 발견되었습니다: { $ref }.
       *[indeterminate] { $ref }의 참조 대상을 확정할 수 없습니다.
    }

help-learn-about-references = 참조에 대해 알아보기 →
help-reference-page = 참고 페이지 →

help-suggestions-header =
    { $location ->
        [inside] { $element } 안
       *[top] 최상위
    }{ $allowed ->
        [none] { " — 여기에는 아무것도 넣을 수 없습니다." }
        [text] { " — 여기에 텍스트를 입력할 수 있습니다." }
        [text-and-components] { " — 여기에 텍스트를 입력하거나 다음을 시도해 보세요:" }
       *[components] { " — 다음을 시도해 보세요:" }
    }

help-suggestions-footer = { $shortcut }을(를) 누르면 전체 { $total }개 구성 요소를 볼 수 있습니다.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref }은(는) { $target }에 대한 참조입니다.
       *[other] { $ref }은(는) { $target }에 대한 참조입니다 ({ $line }행).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner }이(가) { $role }(으)로 도입했습니다.
       *[other] { $owner }이(가) { $line }행에서 { $role }(으)로 도입했습니다.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref }은(는) { $element }의 { $property } 속성에 대한 참조입니다.
       *[other] { $ref }은(는) { $element }의 { $property } 속성에 대한 참조입니다 ({ $line }행).
    }

help-kind-attribute = 속성
help-kind-snippet = 코드 조각
help-kind-array-entry = 배열 항목

help-default = 기본값:
help-active-default = 적용 중인 기본값:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] 허용되는 값 (항목당 하나):
       *[other] 허용되는 값:
    }

help-suggested-values = 권장되는 값:

help-inserts = 삽입:

help-coordinates = 좌표:

help-type = 자료형:

help-resolved-style = 확정된 스타일 (styleNumber { $styleNumber }):

help-resolved-function-names = 확정된 함수 이름:
help-reset-list = 이 입력의 초기화 목록:
help-added-on-input = 이 입력에서 추가됨:
help-removed-on-input = 이 입력에서 제거됨:

help-reset-overrides = { $reset }이(가) { $additional } 및 { $removed }보다 우선합니다.
