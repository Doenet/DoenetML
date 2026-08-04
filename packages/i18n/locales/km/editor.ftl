# Khmer editor and language-server surfaces. Translated from
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
# Khmer has a single plural category, so a countable message needs no
# selection.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] កំណត់ឡើងវិញ
       *[update] ធ្វើបច្ចុប្បន្នភាព
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word }កម្មវិធីមើល
       *[other] { $word }កម្មវិធីមើល { $shortcut }
    }


## The variant picker

editor-variant = បម្រែបម្រួល
editor-variant-filter = ត្រង...
editor-variant-next = ជ្រើសរើសបម្រែបម្រួលបន្ទាប់
editor-variant-previous = ជ្រើសរើសបម្រែបម្រួលមុន


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] រកឃើញការបំពានលទ្ធភាពប្រើប្រាស់ WCAG AA។ ចុចដើម្បី{ $action ->
            [close] បិទ
           *[open] បើក
        }របាយការណ៍លទ្ធភាពប្រើប្រាស់។
        [advisories] ចុចដើម្បី{ $action ->
            [close] បិទ
           *[open] បើក
        }របាយការណ៍លទ្ធភាពប្រើប្រាស់។ រកមិនឃើញការបំពាន WCAG AA ទេ ប៉ុន្តែមានអនុសាសន៍បន្ថែមអំពីលទ្ធភាពប្រើប្រាស់។
       *[clean] ចុចដើម្បី{ $action ->
            [close] បិទ
           *[open] បើក
        }របាយការណ៍លទ្ធភាពប្រើប្រាស់។ រកមិនឃើញបញ្ហាលទ្ធភាពប្រើប្រាស់ទេ។
    }

editor-accessibility-label =
    { $status ->
        [violations] រកឃើញការបំពានលទ្ធភាពប្រើប្រាស់ WCAG AA។ រកឃើញការបំពាន WCAG AA ចំនួន { $count }។ ចុចដើម្បី{ $action ->
            [close] បិទ
           *[open] បើក
        }របាយការណ៍លទ្ធភាពប្រើប្រាស់។
        [advisories] រកមិនឃើញការបំពាន WCAG AA ទេ។ រកឃើញអនុសាសន៍បន្ថែមអំពីលទ្ធភាពប្រើប្រាស់ចំនួន { $count }។ ចុចដើម្បី{ $action ->
            [close] បិទ
           *[open] បើក
        }របាយការណ៍លទ្ធភាពប្រើប្រាស់។
       *[clean] រកមិនឃើញការបំពាន WCAG AA ទេ។ ចុចដើម្បី{ $action ->
            [close] បិទ
           *[open] បើក
        }របាយការណ៍លទ្ធភាពប្រើប្រាស់។
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML កំណែ { $version }

editor-tab-help = ជំនួយតាមបរិបទ
editor-tab-help-short = បរិបទ
editor-tab-errors = កំហុស
editor-tab-warnings = ការព្រមាន
editor-tab-info = ព័ត៌មាន
editor-tab-accessibility = លទ្ធភាពប្រើប្រាស់
editor-tab-responses = ចម្លើយដែលបានដាក់ស្នើ

editor-tab-with-count = { $label }៖ { $count }

editor-options = ជម្រើសកម្មវិធីនិពន្ធ
editor-format-as-doenetml = រៀបចំទម្រង់ជា DoenetML
editor-format-as-xml = រៀបចំទម្រង់ជា XML


## The diagnostics panel

editor-diagnostic-line = បន្ទាត់ទី { $line }

editor-no-errors = គ្មានកំហុស
editor-no-warnings = គ្មានការព្រមាន
editor-no-info = គ្មានព័ត៌មានវិនិច្ឆ័យ

editor-show-info-annotations = បង្ហាញព័ត៌មានវិនិច្ឆ័យក្នុងកម្មវិធីនិពន្ធ
editor-show-accessibility-annotations = បង្ហាញការវិនិច្ឆ័យលទ្ធភាពប្រើប្រាស់ក្នុងកម្មវិធីនិពន្ធ

editor-accessibility-learn-more = ស្វែងយល់ពីរបៀបដែល Doenet មើលលទ្ធភាពប្រើប្រាស់

editor-accessibility-violations-heading = ការបំពានលទ្ធភាពប្រើប្រាស់ ({ $standard })

editor-accessibility-other-heading = បញ្ហាលទ្ធភាពប្រើប្រាស់ផ្សេងទៀត
editor-none-found = រកមិនឃើញទេ


## Submitted responses

editor-no-responses = មិនទាន់មានចម្លើយដាក់ស្នើនៅឡើយទេ
editor-response-answer-id = Answer Id
editor-response-response = ចម្លើយ
editor-response-credit = ពិន្ទុ
editor-response-submitted = បានដាក់ស្នើ


## The context-help panel

help-placeholder = ដាក់ទស្សន៍ទ្រនិចលើឈ្មោះស្លាក អាត្រីប្យូត ឬ { $ref } ដើម្បីមើលឯកសារ។

help-unsupported-ref-chain = ជំនួយសម្រាប់ការយោងច្រើនផ្នែកដូចជា { $example } មិនទាន់ត្រូវបានគាំទ្រទេ។

help-unresolved-ref =
    { $reason ->
        [notFound] រកមិនឃើញអ្វីដែលការយោងសំដៅទៅ៖ { $ref }។
        [multiple] រកឃើញអ្វីច្រើនដែលការយោងសំដៅទៅ៖ { $ref }។
       *[indeterminate] មិនអាចកំណត់អ្វីដែល { $ref } សំដៅទៅបានទេ។
    }

help-learn-about-references = ស្វែងយល់អំពីការយោង →
help-reference-page = ទំព័រយោង →

help-suggestions-header =
    { $location ->
        [inside] ខាងក្នុង { $element }
       *[top] នៅកម្រិតខ្ពស់បំផុត
    }{ $allowed ->
        [none] { " — គ្មានអ្វីដាក់នៅទីនេះបានទេ។" }
        [text] { " — វាយអត្ថបទនៅទីនេះ។" }
        [text-and-components] { " — វាយអត្ថបទនៅទីនេះ ឬសាកល្បង៖" }
       *[components] { " — អ្វីដែលអាចសាកល្បង៖" }
    }

help-suggestions-footer = ចុច { $shortcut } ដើម្បីមើលសមាសភាគទាំង { $total }។

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ជាការយោងទៅ { $target }។
       *[other] { $ref } ជាការយោងទៅ { $target } (បន្ទាត់ទី { $line })។
    }

help-ref-derived-from =
    { $line ->
        [none] ណែនាំដោយ { $owner } ជា { $role }។
       *[other] ណែនាំដោយ { $owner } នៅបន្ទាត់ទី { $line } ជា { $role }។
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ជាការយោងទៅលក្ខណៈ { $property } នៃ { $element }។
       *[other] { $ref } ជាការយោងទៅលក្ខណៈ { $property } នៃ { $element } (បន្ទាត់ទី { $line })។
    }

help-kind-attribute = អាត្រីប្យូត
help-kind-snippet = បំណែកកូដ
help-kind-array-entry = ធាតុក្នុងអារេ

help-default = លំនាំដើម៖
help-active-default = លំនាំដើមសកម្ម៖

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] តម្លៃដែលអនុញ្ញាត (មួយក្នុងមួយធាតុ)៖
       *[other] តម្លៃដែលអនុញ្ញាត៖
    }

help-suggested-values = តម្លៃដែលស្នើ៖

help-inserts = បញ្ចូល៖

help-coordinates = កូអរដោនេ៖

help-type = ប្រភេទ៖

help-resolved-style = រចនាបថដែលបានកំណត់ (styleNumber { $styleNumber })៖

help-resolved-function-names = ឈ្មោះអនុគមន៍ដែលបានកំណត់៖
help-reset-list = បញ្ជីកំណត់ឡើងវិញលើប្រអប់បញ្ចូលនេះ៖
help-added-on-input = បានបន្ថែមលើប្រអប់បញ្ចូលនេះ៖
help-removed-on-input = បានដកចេញពីប្រអប់បញ្ចូលនេះ៖

help-reset-overrides = { $reset } មានអាទិភាពជាង { $additional } និង { $removed }។
