# Chuukese (Fóósun Chuuk) editor and language-server surfaces, Chuuk Lagoon
# variety: the footer, the diagnostics panel, the variant picker, the
# accessibility button and the context-help panel beside them. Selected by
# `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Orthography, number, gender and word order are settled in `chrome.ftl`'s
# header: Goodenough–Sugita spelling, vowel length written by doubling, `ó`,
# `ú` and `á` part of the spelling, `pw` and `mw` written everywhere; no number
# marking on the noun; no grammatical gender and no `$role` fork; the
# describing word follows the noun, joined by «mi». `content.ftl`'s coinage
# table is canonical for the words shared across the four files — «pwóón» for
# both *answer* and *response*, «tongeni tori» for accessibility, «áninnis»
# for help and for a hint, «mwáál» for an error, «túmwúnú» for a warning,
# «pwóróus» for information.
#
# ## Words this file adds to that table
#
#   «nenien makkey»   the editor, "the place of writing", on «makkey», to
#                     write. Its short tab label is the same phrase.
#   «nenien nengeni»  the viewer, "the place of looking".
#   «fariant»         variant, borrowed. Chuukese would otherwise use
#                     «sókkun», which this catalog needs for *type*, and one
#                     word cannot carry both in the same panel.
#   «anapanapa»       to format, built on «napanap» (shape) — to give it its
#                     shape.
#   «apoputá sefán»   to reset, "to start it again"; «asefáni» to update.
#   «kiritit»         credit, borrowed, as in `chrome.ftl`.
#   «kursor»          cursor, borrowed.
#   «mi púsin fis»    default, "what happens of itself".
#
# **English words kept as they stand.** `attribute`, `component`, `property`,
# `array`, `input`, `list`, `tag` and `reference` are DoenetML machinery rather
# than prose, and Chuukese has no settled equivalents for them; they are left
# in English inside otherwise Chuukese sentences, and this is the same decision
# `diagnostics.ftl` makes and records. `WCAG AA` is the standard's name and is
# never translated, as `chrome.ftl` already leaves it.
#
# **Counts do not fork.** A Chuukese noun is not marked for number, so
# `editor-accessibility-label` and `help-coordinates` write one unselected form
# where the English selects on `$count`. `Intl.PluralRules("chk")` has no CLDR
# data in any case; never add `[two]`, `[few]` or `[many]` here.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Apoputá Sefán
       *[update] Asefáni
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Nenien Nengeni
       *[other] { $word } Nenien Nengeni { $shortcut }
    }


## The variant picker

editor-variant = Fariant

editor-variant-filter = Kútta...

editor-variant-next = Fini ewe fariant mwirin

editor-variant-previous = Fini ewe fariant mwen


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] A kúna atain WCAG AA usun tongeni tori. Chchik pwe epwe { $action ->
            [close] eppino
           *[open] suuk
        } ewe pwóróusen tongeni tori.
        [advisories] Chchik pwe epwe { $action ->
            [close] eppino
           *[open] suuk
        } ewe pwóróusen tongeni tori. Esap wor atain WCAG AA mi kúna, nge mi wor ekkóch kapas emmwen usun tongeni tori.
       *[clean] Chchik pwe epwe { $action ->
            [close] eppino
           *[open] suuk
        } ewe pwóróusen tongeni tori. Esap wor weiresin tongeni tori mi kúna.
    }

editor-accessibility-label =
    { $status ->
        [violations] A kúna atain WCAG AA usun tongeni tori. { $count } atain WCAG AA mi kúna. Chchik pwe epwe { $action ->
            [close] eppino
           *[open] suuk
        } ewe pwóróusen tongeni tori.
        [advisories] Esap wor atain WCAG AA mi kúna. { $count } kapas emmwen usun tongeni tori mi kúna. Chchik pwe epwe { $action ->
            [close] eppino
           *[open] suuk
        } ewe pwóróusen tongeni tori.
       *[clean] Esap wor atain WCAG AA mi kúna. Chchik pwe epwe { $action ->
            [close] eppino
           *[open] suuk
        } ewe pwóróusen tongeni tori.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Sókkun DoenetML { $version }

editor-tab-help = Áninnis mi fiti met ka fóri
editor-tab-help-short = Áninnis
editor-tab-errors = Mwáál
editor-tab-warnings = Túmwúnú
editor-tab-info = Pwóróus
editor-tab-accessibility = Tongeni tori
editor-tab-responses = Pwóón mi fen tinanó

editor-tab-with-count = { $label }: { $count }

editor-options = Fini án Nenien Makkey
editor-format-as-doenetml = Anapanapa usun DoenetML
editor-format-as-xml = Anapanapa usun XML


## The diagnostics panel

editor-diagnostic-line = Nain #{ $line }

editor-no-errors = Esap wor Mwáál
editor-no-warnings = Esap wor Túmwúnú
editor-no-info = Esap wor Pwóróus

editor-show-info-annotations = Pwáraatá pwóróus wóón nenien makkey
editor-show-accessibility-annotations = Pwáraatá pwóróusen tongeni tori wóón nenien makkey

editor-accessibility-learn-more = Káé usun án Doenet nengeni tongeni tori

editor-accessibility-violations-heading = Atain tongeni tori ({ $standard })

editor-accessibility-other-heading = Ekkóch weiresin tongeni tori
editor-none-found = Esap wor mi kúna


## Submitted responses

editor-no-responses = Esaamwo wor pwóón mi tinanó
editor-response-answer-id = Iten ewe Pwóón
editor-response-response = Pwóón
editor-response-credit = Kiritit
editor-response-submitted = Mi Tinanó


## The context-help panel

help-placeholder = Isetiw ewe kursor wóón eew iten tag, eew attribute, are { $ref } pwe kopwe kúna áninnis.

help-unsupported-ref-chain = Esaamwo wor áninnis fán ekkewe reference mi chómmóng kinikinir usun { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Esap wor mettóch mi kúna fán ei reference: { $ref }.
        [multiple] Chómmóng mettóch ra kúna fán ei reference: { $ref }.
       *[indeterminate] Ese tongeni ffat met { $ref } a weweiti.
    }

help-learn-about-references = Káé usun ekkewe reference →
help-reference-page = Peichen reference →

help-suggestions-header =
    { $location ->
        [inside] Nónnóm non { $element }
       *[top] Wóón asamwen ewe taropwe
    }{ $allowed ->
        [none] { " — esap wor mettóch epwe nónnóm ikei." }
        [text] { " — makkey kapas ikei." }
        [text-and-components] { " — makkey kapas ikei, are sótuni:" }
       *[components] { " — mettóch kopwe sótuni:" }
    }

help-suggestions-footer = Chchik { $shortcut } pwe kopwe kúna ekkewe { $total } component meinisin.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } eew reference ngeni { $target }.
       *[other] { $ref } eew reference ngeni { $target } (nain { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] A poputá seni { $owner } usun { $role }.
       *[other] A poputá seni { $owner } wóón nain { $line } usun { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } eew reference ngeni ewe { $property } property án { $element }.
       *[other] { $ref } eew reference ngeni ewe { $property } property án { $element } (nain { $line }).
    }

help-kind-attribute = attribute
help-kind-snippet = kinikinin makkey
help-kind-array-entry = kinikinin array

help-default = Mi púsin fis:
help-active-default = Mi púsin fis iei:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Mettóch mi tongeni (eew fán eew):
       *[other] Mettóch mi tongeni:
    }

help-suggested-values = Mettóch kopwe tongeni áeá:

help-inserts = A isetiw:

# A Chuukese noun is not marked for number, so the English selection on
# `$count` would render the same words twice; one form stands for both.
help-coordinates = Nenien:

help-type = Sókkun:

help-resolved-style = Napanap mi kúna (styleNumber { $styleNumber }):

help-resolved-function-names = Iten fanksin mi kúna:
help-reset-list = Apoputá sefán ewe list wóón ei input:
help-added-on-input = A apacha wóón ei input:
help-removed-on-input = A amwúchú wóón ei input:

help-reset-overrides = { $reset } a némeni { $additional } me { $removed }.
