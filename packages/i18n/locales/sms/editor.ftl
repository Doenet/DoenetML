# Skolt Sami editor and language-server surfaces. Translated from
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
# Written with Skolt's own letters and the palatalisation mark `ʹ`; see
# `chrome.ftl` for what that mark is and for how much of this vocabulary is
# derived from Northern Sami rather than attested in Skolt.
#
# Skolt counts in three categories, `one`, `two` and `other`. A message that
# prints its count writes all three, as `chrome.ftl` explains — `two` and
# `other` carry the same genitive singular today, and are kept apart because a
# later correction to one of them is unlikely to be a correction to both.
# `help-coordinates` is the message that does not: it never prints a count, it
# decides a heading's singular against its plural, and Skolt's plural is one
# form, so a dual branch there would be a variant nothing could tell apart.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Maacct
       *[update] Ođđsmâʹtt
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } čuäʹjteei
       *[other] { $word } čuäʹjteei { $shortcut }
    }


## The variant picker

editor-variant = Variantt
editor-variant-filter = Seuʹlljem…
editor-variant-next = Vaʹlljed pueʹtti variantt
editor-variant-previous = Vaʹlljed ouddlaž variantt


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA vuäǯǯamvuõđ rikkmõš lij kaunnâm. Koʹčǩǩ { $action ->
            [close] ǩiddeed
           *[open] ääʹveed
        } vuäǯǯamvuõđ raportt.
        [advisories] Koʹčǩǩ { $action ->
            [close] ǩiddeed
           *[open] ääʹveed
        } vuäǯǯamvuõđ raportt. WCAG AA rikkmõõžž jiâ kaunnâm, leša lie lââʹss vuäǯǯamvuõđ raaʹvv.
       *[clean] Koʹčǩǩ { $action ->
            [close] ǩiddeed
           *[open] ääʹveed
        } vuäǯǯamvuõđ raportt. Vuäǯǯamvuõđ vaiggâdvuõđ jiâ kaunnâm.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA vuäǯǯamvuõđ rikkmõš lij kaunnâm. Kaunnâm { $count ->
            [one] { $count } WCAG AA rikkmõš
            [two] { $count } WCAG AA rikkmõõžž
           *[other] { $count } WCAG AA rikkmõõžž
        }. Koʹčǩǩ { $action ->
            [close] ǩiddeed
           *[open] ääʹveed
        } vuäǯǯamvuõđ raportt.
        [advisories] WCAG AA rikkmõõžž jiâ kaunnâm. Kaunnâm { $count ->
            [one] { $count } lââʹss vuäǯǯamvuõđ rääʹvv
            [two] { $count } lââʹss vuäǯǯamvuõđ raaʹvv
           *[other] { $count } lââʹss vuäǯǯamvuõđ raaʹvv
        }. Koʹčǩǩ { $action ->
            [close] ǩiddeed
           *[open] ääʹveed
        } vuäǯǯamvuõđ raportt.
       *[clean] WCAG AA rikkmõõžž jiâ kaunnâm. Koʹčǩǩ { $action ->
            [close] ǩiddeed
           *[open] ääʹveed
        } vuäǯǯamvuõđ raportt.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML veršâm { $version }

editor-tab-help = Õhttvuõđ mieʹldd vieʹǩǩ
editor-tab-help-short = Õhttvuõtt
editor-tab-errors = Puästtõõzz
editor-tab-warnings = Vaʹrrjõõzz
editor-tab-info = Teâđ
editor-tab-accessibility = Vuäǯǯamvuõtt
editor-tab-responses = Vuõltteemvaʹsttõõzz

editor-tab-with-count = { $label }: { $count }

editor-options = Ǩeeʹrjtemneävv-šiõtlmõõžž
editor-format-as-doenetml = Hääʹmed DoenetML:n
editor-format-as-xml = Hääʹmed XML:n


## The diagnostics panel

editor-diagnostic-line = Linjj nr { $line }

editor-no-errors = Puästtõõzz jiâ leäkku
editor-no-warnings = Vaʹrrjõõzz jiâ leäkku
editor-no-info = Teâttǩeeʹrjtõõzz jiâ leäkku

editor-show-info-annotations = Čuäʹjet teâttǩeeʹrjtõõzzid ǩeeʹrjtemneävvast
editor-show-accessibility-annotations = Čuäʹjet vuäǯǯamvuõđ ǩeeʹrjtõõzzid ǩeeʹrjtemneävvast

editor-accessibility-learn-more = Mäʹhtt Doenet tuâjjad vuäǯǯamvuõđin

editor-accessibility-violations-heading = Vuäǯǯamvuõđ rikkmõõžž ({ $standard })

editor-accessibility-other-heading = Jeeʹres vuäǯǯamvuõđ vaiggâdvuõđ
editor-none-found = Ij kaunnâm mõõnn


## Submitted responses

editor-no-responses = Vuõltteemvaʹsttõõzz jiâ leäkku ǩeäʹss
editor-response-answer-id = Vaʹsttõõzz Id
editor-response-response = Vaʹsttõs
editor-response-credit = Poeeʹn
editor-response-submitted = Vuõlttuum


## The context-help panel

help-placeholder = Piijj ǩeeʹrjtemmiârk nõõm, attribuutt leʹbe tän ool: { $ref } jõs haaʹlääk dokumentaatio.

help-unsupported-ref-chain = Vieʹǩǩ määŋgvuâđlaž vuäǯǯtõõzzid mâʹte { $example } ij leäkku ǩeäʹss tuärjjuum.

help-unresolved-ref =
    { $reason ->
        [notFound] Ij kaunnâm vuäǯǯtõõzz uʹvddi: { $ref }.
        [multiple] Kaunneʹšše määŋg vuäǯǯtõõzz uʹvddi: { $ref }.
       *[indeterminate] { $ref } uʹvddi ij vuäittam meäʹrtõõllâd.
    }

help-learn-about-references = Mättjed vuäǯǯtõõzzi pirr →
help-reference-page = Vuäǯǯtõsseidd →

help-suggestions-header =
    { $location ->
        [inside] { $element } seʹst
       *[top] Pââimõs tääʹzzest
    }{ $allowed ->
        [none] { " — täʹst ij pueʹtt mõõnn." }
        [text] { " — ǩeeʹrjet tekst tiiʹǩ." }
        [text-and-components] { " — ǩeeʹrjet tekst tiiʹǩ, leʹbe ǩiõččlõõđ:" }
       *[components] { " — ǩiõččlõõđ:" }
    }

help-suggestions-footer = Teädd { $shortcut } jõs haaʹlääk vueiʹnned puk { $total } komponeeʹnt.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } vuäǯǯat tän: { $target }.
       *[other] { $ref } vuäǯǯat tän: { $target } (linjj { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } lij tõn puuʹtʼtem rooʹlin { $role }.
       *[other] { $owner } lij tõn puuʹtʼtem linjjest { $line } rooʹlin { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } vuäǯǯat { $element } jiiʹjjesvuõʹtte { $property }.
       *[other] { $ref } vuäǯǯat { $element } jiiʹjjesvuõʹtte { $property } (linjj { $line }).
    }

help-kind-attribute = attribuutt
help-kind-snippet = teekstbieʹss
help-kind-array-entry = liistt vuäzzlaž

help-default = Standard:
help-active-default = Tuâjjai standard:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Lååʹpplaž äärv (õhtt juõʹǩǩ vuäzzla):
       *[other] Lååʹpplaž äärv:
    }

help-suggested-values = Eʹtǩǩuum äärv:

help-inserts = Piijj sizz:

help-coordinates =
    { $count ->
        [one] Koordinaatt:
       *[other] Koordinaatt:
    }

help-type = Šlaajj:

help-resolved-style = Meäʹrtõllum stiil (styleNumber { $styleNumber }):

help-resolved-function-names = Meäʹrtõllum funktionõõm:
help-reset-list = Tän sââʹj maacctemliistt:
help-added-on-input = Lââʹzztum tän sâjja:
help-removed-on-input = Väʹldded meädda tän sââʹjest:

help-reset-overrides = { $reset } pââʹjjǩiõčč { $additional } da { $removed }.
