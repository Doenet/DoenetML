# Tokelauan (Gagana Tokelau) editor and language-server surfaces. Translated
# from `locales/en/editor.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The standard spelling taught in Tokelau and used by the
# Tokelau Dictionary: the five vowels a e i o u, **macrons on the long
# vowels** (ā ē ī ō ū), and the velar nasal written **`g`** — never `ng` — so
# the language names itself «Gagana Tokelau». **Tokelauan has no glottal stop
# and none is written here**: the koma liliu «ʻ» that is part of Samoan
# spelling has no counterpart in this language, and a «ʻ» anywhere in these
# four files would be an error rather than a variant. A macron is part of the
# spelling and not decoration; where this seed has left one out it is a
# mistake to fix.
#
# **Samoan is the nearest existing catalog, and this file is not a copy of
# it.** Tokelauan and Samoan are both Samoic-Outlier Polynesian and share a
# great deal of inherited vocabulary, so a word that comes out the same in
# both is often simply right: «tali», «togi», «lanu», «laina», «igoa»,
# «vaega», «muamua», «taumafai» are the two languages' common inheritance and
# stand here because they are Tokelauan, not because `locales/sm` has them.
# What must never come out the same is anything the regular correspondences
# touch:
#
#   Samoan «s»  → Tokelauan «h»   sesē → hehē, sili → hili, sino → hino,
#                                 tasi → tahi, tutusa → tutuha,
#                                 faʻamalositino → fakamalohitino
#   Samoan «ʻ»  → Tokelauan «k»   where the glottal continues PPn *k:
#                                 faʻa- → faka-, aʻoaʻo → akoako,
#                                 piʻo → piko, tuaoi → tuakoi,
#                                 tuʻu → tuku, ʻafai → kafai,
#                                 amata → kamata, ʻese → kehe
#   Samoan «ʻ»  → nothing         where it does not: vaʻai → vaai,
#                                 faʻafitauli's «-fitauli» is untouched
#
# **That last pair is this seed's largest single risk.** The Samoan koma
# liliu has two histories and only one of them surfaces as a Tokelauan «k»,
# and this seed had to judge which applied word by word. Where it judged
# wrong the result is not a misspelling but a different word. The words it is
# least sure of are named at the foot of this header.
#
# **Tokelauan has no t/k register split.** Samoan's colloquial register turns
# «t» into «k» and «n» into «g»; Tokelauan does not, so there is one spelling
# here rather than a formal and an informal one, and every «k» in these files
# is a real «k».
#
# **`locales/tvl` (Tuvaluan) is a sibling in this same batch, and the two
# catalogs are expected to look alike.** Tuvaluan is Tokelauan's closest
# relative and the same correspondences run through it, so agreement between
# the two files is what relatedness predicts and is **not evidence that
# either is right** — two seeds can be wrong together in the same way. Check
# this file against Tokelauan, never against `tvl`.
#
# **No grammatical gender.** `noun-gender` answers one token and no adjective
# in these files forks on `$gender`. **No `$role` fork** either: nothing here
# changes shape between standing alone and sitting inside a clause.
#
# **Number.** A numeral in front of a Tokelauan noun leaves the noun alone —
# «tahi taumafai», «lua taumafai» — so a count never changes the word beside
# it, and the counted messages here are written as a single unselected form.
# Tokelauan does mark plural, but on the article («te» → «nā») and, in a
# family of adjectives, by **reduplicating a syllable**: «lahi» → «lalahi»,
# «loa» → «loloa», «poto» → «popoto». Every description these messages build
# is of one thing, so the singular is right throughout; a message about
# several things would want the reduplicated form, and no argument these
# messages receive would tell a translator so. `Intl.PluralRules` has no CLDR
# data for `tkl` and resolves against the runtime's default locale, so a
# `[two]`, `[few]` or `[many]` branch here would be text nothing could
# select.
#
# **Adjectives follow the noun**, as they do in Samoan — «laina mafiafia
# kula» — so the composition messages in `content.ftl` put the noun first and
# keep the English order among the adjectives themselves. That agreement with
# `locales/sm` is a real fact about both languages rather than a copy.
#
# **Loans, named rather than hidden.** Mathematics and computing are taught
# in Tokelau largely in English, so the technical nouns here are loans
# adapted to Tokelauan spelling and are marked as loans: «poini», «veta»,
# «poligoni», «parapola», «matematika», «kipoti», «lipoti», «etita»,
# «palakalafa», «numela», «koluhe», «matrix», «element». A loan takes «l» and
# never «r», Tokelauan having no /r/.
#
# **The words this seed is least sure of**, where a reviewer should start:
# «liko» (circle, from Samoan «liʻo» by the *k rule, which may not apply
# here), «fakataitaiga» (example — the same rule might make it
# «fakatakitakiga»), «lapatakiga» (warning), «hamahama» (yellow), «lanu
# meamata» (green), «enaena» (brown), «hoko» (next), «ka leai» (otherwise),
# «hakega» (slope, a coinage), «manatu fakafoki» (feedback, a coinage),
# «fakailoga tuhi» (the editor's cursor, a coinage), and «fakamama» (filter)
# beside «fakamamā» (clear), which differ only by a macron. None of these is
# attested by this seed; each is a derivation or a description.
#
# The counted messages here take a single unselected form, for the reason the
# `chrome.ftl` header gives: a numeral leaves a Tokelauan noun alone.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Toe fakatū
       *[update] Fakafou
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } te mea vaai
       *[other] { $word } te mea vaai { $shortcut }
    }


## The variant picker

editor-variant = Ituaiga
# «fakamama», to sift or strain, and not «fakamamā», to clean, which is what
# `chrome.ftl` renders `subset-clear` as. The two differ only by the macron
# and they are two words; this is a box that narrows a list, not a button that
# empties one, and collapsing them would leave the filter reading "Clear".
editor-variant-filter = Fakamama...
editor-variant-next = Filifili te ituaiga hoko
editor-variant-previous = Filifili te ituaiga muamua


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Kua maua he holitulafono i te avanoa faigofie WCAG AA. Kiliki ke { $action ->
            [close] tapuni
           *[open] tatala
        } te lipoti o te avanoa faigofie.
        [advisories] Kiliki ke { $action ->
            [close] tapuni
           *[open] tatala
        } te lipoti o te avanoa faigofie. E leai he holitulafono WCAG AA na maua, kae e i ai ni fautuaga fakaopoopo.
       *[clean] Kiliki ke { $action ->
            [close] tapuni
           *[open] tatala
        } te lipoti o te avanoa faigofie. E leai he fakafitauli o te avanoa faigofie na maua.
    }

editor-accessibility-label =
    { $status ->
        [violations] Kua maua he holitulafono i te avanoa faigofie WCAG AA. E { $count } holitulafono WCAG AA na maua. Kiliki ke { $action ->
            [close] tapuni
           *[open] tatala
        } te lipoti o te avanoa faigofie.
        [advisories] E leai he holitulafono WCAG AA na maua. E { $count } fautuaga fakaopoopo o te avanoa faigofie na maua. Kiliki ke { $action ->
            [close] tapuni
           *[open] tatala
        } te lipoti o te avanoa faigofie.
       *[clean] E leai he holitulafono WCAG AA na maua. Kiliki ke { $action ->
            [close] tapuni
           *[open] tatala
        } te lipoti o te avanoa faigofie.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML lomiga { $version }

editor-tab-help = Fehoahoani e fetaui ma te tulaga
editor-tab-help-short = Tulaga
editor-tab-errors = Mea hehē
editor-tab-warnings = Lapatakiga
editor-tab-info = Fakamatalaga
editor-tab-accessibility = Avanoa faigofie
editor-tab-responses = Tali kua lafo

editor-tab-with-count = { $label }: { $count }

editor-options = Filifiliga o te etita
editor-format-as-doenetml = Fakatulaga e pēnā mo te DoenetML
editor-format-as-xml = Fakatulaga e pēnā mo te XML


## The diagnostics panel

editor-diagnostic-line = Laina #{ $line }

editor-no-errors = E leai ni mea hehē
editor-no-warnings = E leai ni lapatakiga
editor-no-info = E leai ni fakamatalaga

editor-show-info-annotations = Fakaali fakamatalaga i te etita
editor-show-accessibility-annotations = Fakaali fakailoga o te avanoa faigofie i te etita

editor-accessibility-learn-more = Ako pe fakapēfea e Doenet ona vaai ki te avanoa faigofie

editor-accessibility-violations-heading = Holitulafono i te avanoa faigofie ({ $standard })

editor-accessibility-other-heading = Nisi fakafitauli o te avanoa faigofie
editor-none-found = E leai he mea na maua


## Submitted responses

editor-no-responses = E heki lafo mai he tali
editor-response-answer-id = Answer Id
editor-response-response = Tali
editor-response-credit = Togi
editor-response-submitted = Na lafo


## The context-help panel

help-placeholder = Tuku te fakailoga tuhi ki luga o he igoa tag, he uiga, pe ko te { $ref } mo ni fakamatalaga.

help-unsupported-ref-chain = E heki lagolagoina te fehoahoani mo ni fakahinomaga e uke ona vaega e pēnā mo te { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] E leai he mea na maua e fakahino ki ei te fakahinomaga: { $ref }.
        [multiple] E uke mea na maua e fakahino ki ei te fakahinomaga: { $ref }.
       *[indeterminate] E lē mafai ona fakamaoti te mea e fakahino ki ei te { $ref }.
    }

help-learn-about-references = Ako e uiga ki fakahinomaga →
help-reference-page = Itulau fakahinomaga →

help-suggestions-header =
    { $location ->
        [inside] I loto o te { $element }
       *[top] I te tulaga pito i luga
    }{ $allowed ->
        [none] { " — e leai he mea e mafai ona tuku ki heinei." }
        [text] { " — tuhi he tuhituhiga ki heinei." }
        [text-and-components] { " — tuhi he tuhituhiga ki heinei, pe taumafai ki nei:" }
       *[components] { " — mea e mafai ona taumafai ki ei:" }
    }

help-suggestions-footer = Oomi te { $shortcut } ke vaai ki vaega uma e { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] Ko te { $ref } ko he fakahinomaga ki te { $target }.
       *[other] Ko te { $ref } ko he fakahinomaga ki te { $target } (laina { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Na fakauluulu mai e { $owner } o he { $role }.
       *[other] Na fakauluulu mai e { $owner } i te laina { $line } o he { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] Ko te { $ref } ko he fakahinomaga ki te uiga { $property } o te { $element }.
       *[other] Ko te { $ref } ko he fakahinomaga ki te uiga { $property } o te { $element } (laina { $line }).
    }

help-kind-attribute = uiga
help-kind-snippet = vaega poto
help-kind-array-entry = ulufale array

help-default = Masani:
help-active-default = Masani e fakaaogā nei:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Tau e fakatagaina (tahi mo mea takitahi):
       *[other] Tau e fakatagaina:
    }

help-suggested-values = Tau e fautuaina:

help-inserts = E fakaofi:

help-coordinates = Fakahinomaga tulaga:

help-type = Ituaiga:

help-resolved-style = Hitaili kua fakamaoti (styleNumber { $styleNumber }):

help-resolved-function-names = Igoa gāluega kua fakamaoti:
help-reset-list = Lisi toe fakatū i te fakaofiga nei:
help-added-on-input = Na fakaopoopo i te fakaofiga nei:
help-removed-on-input = Na ave kehe mai te fakaofiga nei:

help-reset-overrides = E hili te { $reset } i te { $additional } ma te { $removed }.
