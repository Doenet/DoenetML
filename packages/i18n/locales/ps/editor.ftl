# Pashto editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Register as in `chrome.ftl`: the polite plural.
#
# Where English interpolates a bare verb — "Click to { $action } accessibility
# report" — Pashto puts its verb at the end of the clause and cannot take one
# dropped into the middle, so the selector carries the whole sentence. Fluent
# does not care where a select sits inside a pattern.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] بیا تنظیم
       *[update] تازه کول
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] د لیدونکي { $word }
       *[other] د لیدونکي { $word } { $shortcut }
    }


## The variant picker

editor-variant = بڼه
editor-variant-filter = چاڼ...
editor-variant-next = راتلونکې بڼه وټاکئ
editor-variant-previous = پخوانۍ بڼه وټاکئ


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] د WCAG AA له مخې د لاسرسي سرغړونه وموندل شوه. { $action ->
            [close] د لاسرسي راپور تړلو لپاره کلیک وکړئ.
           *[open] د لاسرسي راپور پرانیستلو لپاره کلیک وکړئ.
        }
        [advisories] { $action ->
            [close] د لاسرسي راپور تړلو لپاره کلیک وکړئ.
           *[open] د لاسرسي راپور پرانیستلو لپاره کلیک وکړئ.
        } د WCAG AA هېڅ سرغړونه ونه موندل شوه، خو د لاسرسي نورې سپارښتنې شته.
       *[clean] { $action ->
            [close] د لاسرسي راپور تړلو لپاره کلیک وکړئ.
           *[open] د لاسرسي راپور پرانیستلو لپاره کلیک وکړئ.
        } د لاسرسي هېڅ ستونزه ونه موندل شوه.
    }

editor-accessibility-label =
    { $status ->
        [violations] د WCAG AA له مخې د لاسرسي سرغړونه وموندل شوه. د WCAG AA { $count } سرغړونې وموندل شوې. { $action ->
            [close] د لاسرسي راپور تړلو لپاره کلیک وکړئ.
           *[open] د لاسرسي راپور پرانیستلو لپاره کلیک وکړئ.
        }
        [advisories] د WCAG AA هېڅ سرغړونه ونه موندل شوه. د لاسرسي { $count } نورې سپارښتنې وموندل شوې. { $action ->
            [close] د لاسرسي راپور تړلو لپاره کلیک وکړئ.
           *[open] د لاسرسي راپور پرانیستلو لپاره کلیک وکړئ.
        }
       *[clean] د WCAG AA هېڅ سرغړونه ونه موندل شوه. { $action ->
            [close] د لاسرسي راپور تړلو لپاره کلیک وکړئ.
           *[open] د لاسرسي راپور پرانیستلو لپاره کلیک وکړئ.
        }
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = د DoenetML بڼه { $version }

editor-tab-help = د سیاق سره سمه مرسته
editor-tab-help-short = سیاق
editor-tab-errors = تېروتنې
editor-tab-warnings = خبرتیاوې
editor-tab-info = معلومات
editor-tab-accessibility = لاسرسی
editor-tab-responses = لېږل شوي ځوابونه

editor-tab-with-count = { $label }: { $count }

editor-options = د سمونګر تنظیمات
editor-format-as-doenetml = د DoenetML په بڼه سمول
editor-format-as-xml = د XML په بڼه سمول


## The diagnostics panel

editor-diagnostic-line = کرښه شمېره { $line }

editor-no-errors = هېڅ تېروتنه نشته
editor-no-warnings = هېڅ خبرتیا نشته
editor-no-info = هېڅ معلوماتي تشخیص نشته

editor-show-info-annotations = په سمونګر کې معلوماتي تشخیصونه وښایاست
editor-show-accessibility-annotations = په سمونګر کې د لاسرسي تشخیصونه وښایاست

editor-accessibility-learn-more = د لاسرسي په اړه د Doenet لاره وپېژنئ

editor-accessibility-violations-heading = د لاسرسي سرغړونې ({ $standard })

editor-accessibility-other-heading = د لاسرسي نورې ستونزې
editor-none-found = هېڅ ونه موندل شو


## Submitted responses

editor-no-responses = تر اوسه هېڅ ځواب نه دی لېږل شوی
editor-response-answer-id = د ځواب پېژندنه
editor-response-response = ځواب
editor-response-credit = نمره
editor-response-submitted = د لېږلو وخت


## The context-help panel

help-placeholder = د اسنادو لیدلو لپاره کرسر د یوه عنصر نوم، یوې ځانګړنې یا { $ref } باندې کېږدئ.

help-unsupported-ref-chain = د { $example } په څېر څو برخیزو حوالو لپاره مرسته لا نه ده چمتو.

help-unresolved-ref =
    { $reason ->
        [notFound] هغه عنصر ونه موندل شو چې { $ref } ورته اشاره کوي.
        [multiple] له یوه څخه زیات عنصرونه وموندل شول چې { $ref } ورته اشاره کوي.
       *[indeterminate] دا معلومه نه شوه چې { $ref } کوم عنصر ته اشاره کوي.
    }

# The arrow is direction rather than punctuation, and Pashto runs the other
# way, so it points where the reader is going.
help-learn-about-references = د حوالو په اړه زده کړه ←
help-reference-page = د حوالې مخ ←

help-suggestions-header =
    { $location ->
        [inside] د { $element } دننه
       *[top] په لوړه کچه کې
    }{ $allowed ->
        [none] { " — دلته هېڅ نه ځای پر ځای کیږي." }
        [text] { " — دلته متن لیکل کېدای شي." }
        [text-and-components] { " — دلته متن لیکل کېدای شي، یا دا وآزمویئ:" }
       *[components] { " — د آزمویلو لپاره څیزونه:" }
    }

help-suggestions-footer = د ټولو { $total } برخو لیدلو لپاره { $shortcut } کېکاږئ.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } { $target } ته حواله ده.
       *[other] { $ref } { $target } ته حواله ده (کرښه { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } دا د { $role } په توګه معرفي کړ.
       *[other] { $owner } دا په کرښه { $line } کې د { $role } په توګه معرفي کړ.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } د { $element } د { $property } ځانګړنې ته حواله ده.
       *[other] { $ref } د { $element } د { $property } ځانګړنې ته حواله ده (کرښه { $line }).
    }

help-kind-attribute = ځانګړنه
help-kind-snippet = ټوټه
help-kind-array-entry = د لړ عنصر

help-default = تلواله ارزښت:
help-active-default = فعال تلواله ارزښت:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] اجازه شوي ارزښتونه (هر عنصر ته یو):
       *[other] اجازه شوي ارزښتونه:
    }

help-suggested-values = وړاندیز شوي ارزښتونه:

help-inserts = ننباسي:

help-coordinates =
    { $count ->
        [one] کوردینات:
       *[other] کوردیناتونه:
    }

help-type = ډول:

help-resolved-style = ټاکل شوی سبک (styleNumber { $styleNumber }):

help-resolved-function-names = د فنکشنونو ټاکل شوي نومونه:
help-reset-list = پر دې ننوتنه لړ بیا تنظیم کړئ:
help-added-on-input = پر دې ننوتنه زیات شو:
help-removed-on-input = پر دې ننوتنه لرې شو:

help-reset-overrides = { $reset } پر { $additional } او { $removed } لومړیتوب لري.
