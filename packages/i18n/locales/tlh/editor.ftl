# Klingon editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# See `locales/tlh/content.ftl` for the rule every omission here follows: a
# compound of canon words is written, a new root is not.
#
# **What this file leaves out is almost everything about accessibility, and
# every sentence of the context-help panel.** Klingon has no word for
# *accessibility*, none for *attribute*, *reference*, *default* or *snippet*,
# and those five nouns are what the help panel is made of. The messages that
# survive are the ones built out of finding, showing and choosing, which Klingon
# has verbs for. WCAG AA is the standard's name and would stay as written in any
# language, so the messages around it fall back whole rather than in halves.
#
# Klingon is verb-final, and the imperative prefix «yI-» marks a button as an
# order rather than a statement — the same convention `chrome.ftl` uses and for
# the same reason.


## The viewer's controls

# «chu'qa'» is «activate it again» and «taghqa'» «begin it again», which is the
# distinction English draws with *update* against *reset*.
editor-update-viewer =
    { $action ->
        [reset] yItaghqa'
       *[update] yIchu'qa'
    }

# «HaSta» is a visual display, which is what the viewer is. The object comes
# before its verb, so the button's own word follows rather than leads.
editor-update-viewer-title =
    { $shortcut ->
        [none] HaSta { $word }
       *[other] HaSta { $word } ({ $shortcut })
    }


## The variant picker

# «pImwI'» — «that which differs» — is this file's own, from the canon «pIm» (be
# different). «nej» is «seek», which is what the filter box does.
editor-variant = pImwI'
editor-variant-filter = yInej…
editor-variant-next = pImwI' veb yIwIv
editor-variant-previous = pImwI' vebHa' yIwIv


## The accessibility status button
##
## All four messages are left to English; see the header.


## The footer
##
## `editor-version-title` is left to English: Klingon has no word for a version,
## and «DoenetML» and the number are the whole of the message besides it.

# «boQ» is «aid», which is what the help tab offers. `content.ftl` gives
# `hint-title` the same word, and they are the same thing said twice.
editor-tab-help = boQ
editor-tab-help-short = boQ
editor-tab-errors = Qaghmey
editor-tab-warnings = ghuHmoHwI'mey
editor-tab-info = De'

# «ngeHlu'ta'bogh» is «those which have been sent», which is what a submitted
# response is in a language with no noun for one.
editor-tab-responses = ngeHlu'ta'bogh

editor-tab-with-count = { $label }: { $count }

# «DuH» is «be possible», so «DuHmey» is the set of things that can be done.
# «lIS» is «adjust», which is what reformatting the source is.
editor-options = DuHmey
editor-format-as-doenetml = DoenetML yIlIS
editor-format-as-xml = XML yIlIS


## The diagnostics panel

editor-diagnostic-line = { $line } tlhegh

# «tu'lu'be'» is «one does not find it» — Klingon's way of saying *none*, with
# the indefinite subject «-lu'» ahead of the negation «-be'», which is the order
# the suffix types put them in.
editor-no-errors = Qagh tu'lu'be'
editor-no-warnings = ghuHmoHwI' tu'lu'be'
editor-no-info = De' tu'lu'be'

editor-show-info-annotations = ghItlhDaq De' yI'ang

editor-none-found = tu'lu'be'


## Submitted responses

editor-no-responses = ngeHlu'ta'bogh tu'lu'be'
editor-response-answer-id = jang pong
editor-response-response = jang
editor-response-credit = pop
editor-response-submitted = ngeHlu'ta'


## The context-help panel
##
## Left to English entire, apart from the two labels below. The panel names
## attributes, references, defaults and snippets, and Klingon has a word for
## none of them; a sentence built around an English noun with Klingon grammar
## around it would read worse than the English sentence it replaced.

# «motlh» is «be usual», and «Segh» is «type, species».
help-default = motlhbogh:
help-type = Segh:
