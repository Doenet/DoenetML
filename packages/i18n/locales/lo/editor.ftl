# Lao editor and language-server surfaces. Translated from
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
# Lao has a single plural category, so a countable message needs no selection.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] ຕັ້ງຄືນ
       *[update] ອັບເດດ
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word }ຕົວເບິ່ງ
       *[other] { $word }ຕົວເບິ່ງ { $shortcut }
    }


## The variant picker

editor-variant = ຮູບແບບ
editor-variant-filter = ກັ່ນຕອງ...
editor-variant-next = ເລືອກຮູບແບບຕໍ່ໄປ
editor-variant-previous = ເລືອກຮູບແບບກ່ອນໜ້າ


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] ພົບການລະເມີດການເຂົ້າເຖິງ WCAG AA. ຄລິກເພື່ອ{ $action ->
            [close] ປິດ
           *[open] ເປີດ
        }ລາຍງານການເຂົ້າເຖິງ.
        [advisories] ຄລິກເພື່ອ{ $action ->
            [close] ປິດ
           *[open] ເປີດ
        }ລາຍງານການເຂົ້າເຖິງ. ບໍ່ພົບການລະເມີດ WCAG AA ແຕ່ມີຄຳແນະນຳເພີ່ມເຕີມກ່ຽວກັບການເຂົ້າເຖິງ.
       *[clean] ຄລິກເພື່ອ{ $action ->
            [close] ປິດ
           *[open] ເປີດ
        }ລາຍງານການເຂົ້າເຖິງ. ບໍ່ພົບບັນຫາການເຂົ້າເຖິງ.
    }

editor-accessibility-label =
    { $status ->
        [violations] ພົບການລະເມີດການເຂົ້າເຖິງ WCAG AA. ພົບການລະເມີດ WCAG AA { $count } ລາຍການ. ຄລິກເພື່ອ{ $action ->
            [close] ປິດ
           *[open] ເປີດ
        }ລາຍງານການເຂົ້າເຖິງ.
        [advisories] ບໍ່ພົບການລະເມີດ WCAG AA. ພົບຄຳແນະນຳເພີ່ມເຕີມກ່ຽວກັບການເຂົ້າເຖິງ { $count } ລາຍການ. ຄລິກເພື່ອ{ $action ->
            [close] ປິດ
           *[open] ເປີດ
        }ລາຍງານການເຂົ້າເຖິງ.
       *[clean] ບໍ່ພົບການລະເມີດ WCAG AA. ຄລິກເພື່ອ{ $action ->
            [close] ປິດ
           *[open] ເປີດ
        }ລາຍງານການເຂົ້າເຖິງ.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML ລຸ້ນ { $version }

editor-tab-help = ຄວາມຊ່ວຍເຫຼືອຕາມບໍລິບົດ
editor-tab-help-short = ບໍລິບົດ
editor-tab-errors = ຂໍ້ຜິດພາດ
editor-tab-warnings = ຄຳເຕືອນ
editor-tab-info = ຂໍ້ມູນ
editor-tab-accessibility = ການເຂົ້າເຖິງ
editor-tab-responses = ຄຳຕອບທີ່ສົ່ງແລ້ວ

editor-tab-with-count = { $label }: { $count }

editor-options = ຕົວເລືອກຂອງຕົວແກ້ໄຂ
editor-format-as-doenetml = ຈັດຮູບແບບເປັນ DoenetML
editor-format-as-xml = ຈັດຮູບແບບເປັນ XML


## The diagnostics panel

editor-diagnostic-line = ແຖວທີ { $line }

editor-no-errors = ບໍ່ມີຂໍ້ຜິດພາດ
editor-no-warnings = ບໍ່ມີຄຳເຕືອນ
editor-no-info = ບໍ່ມີຂໍ້ມູນວິນິດໄສ

editor-show-info-annotations = ສະແດງຂໍ້ມູນວິນິດໄສໃນຕົວແກ້ໄຂ
editor-show-accessibility-annotations = ສະແດງການວິນິດໄສການເຂົ້າເຖິງໃນຕົວແກ້ໄຂ

editor-accessibility-learn-more = ຮຽນຮູ້ວິທີທີ່ Doenet ເບິ່ງເລື່ອງການເຂົ້າເຖິງ

editor-accessibility-violations-heading = ການລະເມີດການເຂົ້າເຖິງ ({ $standard })

editor-accessibility-other-heading = ບັນຫາການເຂົ້າເຖິງອື່ນໆ
editor-none-found = ບໍ່ພົບ


## Submitted responses

editor-no-responses = ຍັງບໍ່ມີຄຳຕອບທີ່ສົ່ງ
editor-response-answer-id = Answer Id
editor-response-response = ຄຳຕອບ
editor-response-credit = ຄະແນນ
editor-response-submitted = ສົ່ງແລ້ວ


## The context-help panel

help-placeholder = ວາງເຄີເຊີເທິງຊື່ແທັກ, ແອັດທຣິບິວ ຫຼື { $ref } ເພື່ອເບິ່ງເອກະສານ.

help-unsupported-ref-chain = ຄວາມຊ່ວຍເຫຼືອສຳລັບການອ້າງອີງຫຼາຍສ່ວນເຊັ່ນ { $example } ຍັງບໍ່ຮອງຮັບ.

help-unresolved-ref =
    { $reason ->
        [notFound] ຫາສິ່ງທີ່ການອ້າງອີງຊີ້ໄປບໍ່ພົບ: { $ref }.
        [multiple] ພົບຫຼາຍສິ່ງທີ່ການອ້າງອີງຊີ້ໄປ: { $ref }.
       *[indeterminate] ບໍ່ສາມາດກຳນົດສິ່ງທີ່ { $ref } ຊີ້ໄປໄດ້.
    }

help-learn-about-references = ຮຽນຮູ້ກ່ຽວກັບການອ້າງອີງ →
help-reference-page = ໜ້າອ້າງອີງ →

help-suggestions-header =
    { $location ->
        [inside] ພາຍໃນ { $element }
       *[top] ຢູ່ລະດັບເທິງສຸດ
    }{ $allowed ->
        [none] { " — ບໍ່ມີສິ່ງໃດວາງຢູ່ນີ້ໄດ້." }
        [text] { " — ພິມຂໍ້ຄວາມຢູ່ນີ້." }
        [text-and-components] { " — ພິມຂໍ້ຄວາມຢູ່ນີ້ ຫຼື ລອງ:" }
       *[components] { " — ສິ່ງທີ່ລອງໄດ້:" }
    }

help-suggestions-footer = ກົດ { $shortcut } ເພື່ອເບິ່ງອົງປະກອບທັງໝົດ { $total } ອັນ.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ເປັນການອ້າງອີງເຖິງ { $target }.
       *[other] { $ref } ເປັນການອ້າງອີງເຖິງ { $target } (ແຖວທີ { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] ສ້າງຂຶ້ນໂດຍ { $owner } ໃນຖານະ { $role }.
       *[other] ສ້າງຂຶ້ນໂດຍ { $owner } ຢູ່ແຖວທີ { $line } ໃນຖານະ { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ເປັນການອ້າງອີງເຖິງຄຸນສົມບັດ { $property } ຂອງ { $element }.
       *[other] { $ref } ເປັນການອ້າງອີງເຖິງຄຸນສົມບັດ { $property } ຂອງ { $element } (ແຖວທີ { $line }).
    }

help-kind-attribute = ແອັດທຣິບິວ
help-kind-snippet = ຕົວຢ່າງໂຄດ
help-kind-array-entry = ລາຍການໃນອາເຣ

help-default = ຄ່າເລີ່ມຕົ້ນ:
help-active-default = ຄ່າເລີ່ມຕົ້ນທີ່ໃຊ້ຢູ່:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] ຄ່າທີ່ອະນຸຍາດ (ໜຶ່ງຕໍ່ໜຶ່ງລາຍການ):
       *[other] ຄ່າທີ່ອະນຸຍາດ:
    }

help-suggested-values = ຄ່າທີ່ແນະນຳ:

help-inserts = ແຊກ:

help-coordinates = ພິກັດ:

help-type = ຊະນິດ:

help-resolved-style = ຮູບແບບທີ່ກຳນົດແລ້ວ (styleNumber { $styleNumber }):

help-resolved-function-names = ຊື່ຟັງຊັນທີ່ກຳນົດແລ້ວ:
help-reset-list = ລາຍການຕັ້ງຄືນເທິງຊ່ອງປ້ອນຂໍ້ມູນນີ້:
help-added-on-input = ເພີ່ມເທິງຊ່ອງປ້ອນຂໍ້ມູນນີ້:
help-removed-on-input = ຕັດອອກຈາກຊ່ອງປ້ອນຂໍ້ມູນນີ້:

help-reset-overrides = { $reset } ແທນທີ່ { $additional } ແລະ { $removed }.
