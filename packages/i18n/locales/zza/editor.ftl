# Zazaki (Zazakî / Kirmanckî) editor and language-server surfaces: the footer,
# the diagnostics panel, the variant picker, the accessibility button and the
# context-help panel beside them. Translated from `locales/en/editor.ftl`,
# which is the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Vate written standard, Zazaki Latin alphabet with the dotless `ı`; the same
# convention `chrome.ftl` states, and the four files of this locale must not
# be split between two orthographies.
#
# Register as in `chrome.ftl`: a control is a verbal noun, and a sentence
# telling the reader to do something is imperative singular. Zazaki is
# verb-final, so where English drops a bare verb into the middle of a sentence
# — "Click to { $action } accessibility report" — the whole sentence sits
# inside the selector instead. Fluent does not care where a select falls
# inside a pattern.
#
# `WCAG`, `DoenetML`, `XML`, `styleNumber` and every element or attribute name
# are identifiers rather than words and stay exactly as written.
#
# This catalog is **thinner than `chrome.ftl` and `content.ftl` in one place**:
# the context-help panel's vocabulary for references and properties is
# software terminology Zazaki has no settled words for, and the words below
# are Kurmanji or international terms — `referans`, `prop`, `tîp`, `stîl`,
# `koordînat` — kept rather than coined.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Peyser
       *[update] Rocanekerdış
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Wendox rê { $word }
       *[other] Wendox rê { $word } { $shortcut }
    }


## The variant picker

editor-variant = Varyant
editor-variant-filter = Filtre...
editor-variant-next = Varyantê peyênî weçînayış
editor-variant-previous = Varyantê verênî weçînayış


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Îhlalêko WCAG AA yo resayîşî dîya. { $action ->
            [close] Raporê resayîşî qefilnayış rê tıkne.
           *[open] Raporê resayîşî akerdış rê tıkne.
        }
        [advisories] { $action ->
            [close] Raporê resayîşî qefilnayış rê tıkne.
           *[open] Raporê resayîşî akerdış rê tıkne.
        } Îhlalê WCAG AA nêdîyayî, la tewsîyeyê resayîşî yê bînî estê.
       *[clean] { $action ->
            [close] Raporê resayîşî qefilnayış rê tıkne.
           *[open] Raporê resayîşî akerdış rê tıkne.
        } Tu problemê resayîşî nêdîya.
    }

editor-accessibility-label =
    { $status ->
        [violations] Îhlalêko WCAG AA yo resayîşî dîya. { $count } îhlalê WCAG AA dîyayî. { $action ->
            [close] Raporê resayîşî qefilnayış rê tıkne.
           *[open] Raporê resayîşî akerdış rê tıkne.
        }
        [advisories] Îhlalê WCAG AA nêdîyayî. { $count } tewsîyeyê resayîşî yê bînî dîyayî. { $action ->
            [close] Raporê resayîşî qefilnayış rê tıkne.
           *[open] Raporê resayîşî akerdış rê tıkne.
        }
       *[clean] Îhlalê WCAG AA nêdîyayî. { $action ->
            [close] Raporê resayîşî qefilnayış rê tıkne.
           *[open] Raporê resayîşî akerdış rê tıkne.
        }
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Versîyonê DoenetML { $version }

editor-tab-help = Rêberîya girêdayeya çerçewe
editor-tab-help-short = Çerçewe
editor-tab-errors = Xetayî
editor-tab-warnings = Îqazî
editor-tab-info = Melumat
editor-tab-accessibility = Resayîş
editor-tab-responses = Cewabê rusnayeyî

editor-tab-with-count = { $label }: { $count }

editor-options = Weçînekê edîtorî
editor-format-as-doenetml = DoenetML sey formatkerdış
editor-format-as-xml = XML sey formatkerdış


## The diagnostics panel

editor-diagnostic-line = Rêze #{ $line }

editor-no-errors = Xeta çin o
editor-no-warnings = Îqaz çin o
editor-no-info = Melumat çin o

editor-show-info-annotations = Melumatan edîtorî de mocnayış
editor-show-accessibility-annotations = Teşxîsê resayîşî edîtorî de mocnayış

editor-accessibility-learn-more = Doenet resayîşî ra se fam keno, bımusne →

editor-accessibility-violations-heading = Îhlalê resayîşî ({ $standard })

editor-accessibility-other-heading = Problemê resayîşî yê bînî
editor-none-found = Çîyê nêdîya


## Submitted responses

editor-no-responses = Hema tu cewab nêrusnayo
editor-response-answer-id = Îdê cewabî
editor-response-response = Cewab
editor-response-credit = Puan
editor-response-submitted = Wextê rusnayışî


## The context-help panel

help-placeholder = Belgekerdış seba, îmleci nameyê etîketî, xusûsîyet ya zî { $ref } ser o rone.

help-unsupported-ref-chain = { $example } sey referansê zafbeşan rê rêberî hema çin a.

help-unresolved-ref =
    { $reason ->
        [notFound] { $ref } rê tu merci nêdîya.
        [multiple] { $ref } rê zaf mercî dîyayî.
       *[indeterminate] { $ref } rê merc tesbît nêbi.
    }

# The arrow is direction rather than punctuation; Zazaki runs left to right,
# so it points the way English's does.
help-learn-about-references = Referansan ser o bımusne →
help-reference-page = Pela referansî →

help-suggestions-header =
    { $location ->
        [inside] { $element } zerre de
       *[top] Tewr corê asta de
    }{ $allowed ->
        [none] { " — tîya de çîyê nêronîyeno." }
        [text] { " — tîya de metın nusîyeno." }
        [text-and-components] { " — tîya de metın binuse, ya zî nînan bıcerebne:" }
       *[components] { " — çîyê ke eşkenê bêrê cerebnayış:" }
    }

help-suggestions-footer = Pêro { $total } beşan dîyayış rê { $shortcut } bıtıkne.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref }, { $target } rê referans o.
       *[other] { $ref }, { $target } rê referans o (rêze { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ey sey { $role } dayo şınasnayış.
       *[other] { $owner } ey rêze { $line } de sey { $role } dayo şınasnayış.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref }, { $element } de xusûsîyetê { $property } rê referans o.
       *[other] { $ref }, { $element } de xusûsîyetê { $property } rê referans o (rêze { $line }).
    }

help-kind-attribute = xusûsîyet
help-kind-snippet = parçe
help-kind-array-entry = cayê arrayî

help-default = Standard:
help-active-default = Standardo aktîf:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Erjê îzınkerdeyî (her cayî rê yew):
       *[other] Erjê îzınkerdeyî:
    }

help-suggested-values = Erjê tewsîyekerdeyî:

help-inserts = Cı keno:

help-coordinates =
    { $count ->
       *[other] Koordînatî:
    }

help-type = Tîp:

help-resolved-style = Stîlo tesbîtkerde (styleNumber { $styleNumber }):

help-resolved-function-names = Nameyê fonksîyonan ê tesbîtkerdeyî:
help-reset-list = Nê înputî ser o lîste peyser bıke:
help-added-on-input = Nê înputî ser o zêdekerde:
help-removed-on-input = Nê înputî ser o wedarde:

help-reset-overrides = { $reset }, { $additional } û { $removed } ser o ronışeno.
