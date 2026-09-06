# Khasi (Ka Ktien Khasi) viewer chrome: the buttons, panel headings and status
# words the reader interacts with. Selected by `uiLocale`. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids, `.attribute` names, select variant keys and placeable names are
# never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator, and
# no permission is needed to change a word.
#
# **Orthography: Roman, with its diacritics.** Khasi has been written in the
# Roman alphabet since the Welsh Presbyterian mission of the 1840s, and no
# other script is at issue for it — there is no rival orthography a reviewer
# might have expected. What the seed does have to be consistent about is the
# three marks that alphabet carries: `ï` (U+00EF) for the syllabic i in «ïa»
# and «ïaid», `ñ` (U+00F1) in «kñi» and its relatives, which this catalog happens never
# to need, and the ASCII
# apostrophe `'` (U+0027) for the glottal stop in «ka'», never the typographic
# U+2019. A search for `'` finds every glottal in all four files.
#
# **Much of the technical vocabulary is an English loan, and that is declared
# rather than disguised.** Meghalaya teaches mathematics and secondary science
# in English, and Khasi has a long English-medium tradition beside its
# missionary orthography, so the words a Khasi classroom actually uses for a
# matrix, a percentage, a keyboard, a column or a diagram are the English ones.
# They are written here in their English spelling. What is Khasi is the frame:
# «ïa» as the object marker, «ban» for the infinitive, «na» for *from/of*,
# «bad» for *with/and*, «ym» for the negative, «lah» for *can*, «don» for
# *there is*, «ym don» for *none*, «sngewbha» for *please*, «beit» for
# *correct* and «ym beit» for *incorrect*, «shem» for *found*, «plie»/«khang»
# for *open*/*close*, «pynpaw»/«pynjah» for *show*/*hide*, and «dang …» for the
# progressive.
#
# **Weakest words here, to check first:** «error» is left as the English loan
# because the seed found no Khasi noun it was confident of (contrast
# «jingsneng» for *warning*, from «sneng» *to advise*, which it is confident
# of); «Jingong Phai» for *feedback* is a coinage; and «futnot», «kibod», «ro»,
# «kolom», «bax» and «peij» are loans a speaker may well replace.
#
# No message here selects on a plural category: CLDR has no plural data for
# `kha`, and a Khasi noun is not marked for number after a numeral in any case.
# The `[0]` in `attempts-remaining` is matched against the number itself and is
# not a plural rule, so it stays exactly where English has it.


## Answer submission

answer-checking = Dang peit...
answer-submitting = Dang ai...

answer-checking-status = Dang peit ïa ka jingjubab
answer-submitting-status = Dang ai ïa ka jingjubab

answer-correct = Beit
answer-incorrect = Ym Beit

answer-response-saved = La Buh ïa ka Jingjubab

answer-percent-credit = { $percent }% Kredit
answer-percent-correct = { $percent }% Beit
answer-percent-short = { $percent } %

max-credit-available = Kredit bakhraw tam ba don: { $percent }%

attempts-remaining =
    { $count ->
        [0] ym don shuh ka jingpyrshang
       *[other] { $count } tylli ki jingpyrshang ba don shuh
    }

validation-correct = (Beit)
validation-incorrect = (Ym Beit)
validation-partially-correct = (Beit bynta)

answer-show-responses = Pynpaw ïa ki { $count } jingjubab sha { $answerId }


## Disclosure panels

feedback-heading = Jingong Phai

collapsible-click-to-open = (klik ban plie)
collapsible-click-to-close = (klik ban khang)

collapsible-initializing = Dang sdang...

footnote-show = Pynpaw ïa ka futnot
footnote-hide = Pynjah ïa ka futnot

description-more-information = kham bun jingtip


## Controls

slider-previous = Mynshuwa
slider-next = Shaphrang

keyboard-open = Plie ïa ka Kibod
keyboard-close = Khang ïa ka Kibod

choice-input-remove-choice = Rah noh ïa { $choice }

matrix-remove-row = Rah noh ïa ka ro
matrix-add-row = Buh ïa ka ro
matrix-remove-column = Rah noh ïa ka kolom
matrix-add-column = Buh ïa ka kolom

subset-add-remove-points = Buh/Rah noh ki point
subset-toggle-points-intervals = Kylla ki point bad ki interval
subset-move-points = Pynïaid ki point
subset-clear = Sait Noh

orbital-add-row = Buh Ro
orbital-remove-row = Rah noh Ro
orbital-add-box = Buh Bax
orbital-remove-box = Rah noh Bax
orbital-add-up-arrow = Buh Khnam Sha Khlieh
orbital-add-down-arrow = Buh Khnam Sha Khyndew
orbital-remove-arrow = Rah noh Khnam

orbital-row-label = Kyrteng ka ro { $row }

pretzel-answer = Jingjubab



## Math input

math-input-preview-region = jingpeit lypa ïa ka jingthoh math
math-input-preview = Peit Lypa
math-input-invalid-expression = Jingthoh ba ym beit:


## Document status

viewer-initializing = Dang sdang...


## Errors

error-heading = Error

error-found-at =
    { $span ->
        [line] La shem ha ka lain { $startLine }.
       *[lines] La shem ha ki lain { $startLine }–{ $endLine }.
    }

document-contains-errors = Kane ka dokumen ka don ki error!

diagnostic-heading-error = Error
diagnostic-heading-warning = Jingsneng
diagnostic-heading-information = Jingtip
diagnostic-heading-hint = Jingiarap

accessibility-heading-level-1 = Jingpudong ïa ka WCAG AA Aksesibiliti
accessibility-heading-level-2 = Jingsneng shaphang ka aksesibiliti

something-went-wrong = Don kaei kaei kaba ym beit.

renderer-load-failed = ym lah ban pynmih ïa ka renderer. Sngewbha pynthymmai ïa ka peij.

core-start-failed = Ym lah ban sdang ïa kane ka dokumen. Sngewbha pynthymmai ïa ka peij.

core-start-failed-busy = Ym lah ban sdang ïa kane ka dokumen. Bun ki dokumen ki la sdang lang ha kajuh ka por, kaba lah ban bat kham bun por ha ka dyrbon babym bakla. Ka jingpynthymmai ïa ka peij ka lah ban iarap haba ki dokumen kiwei ki la dep.

core-start-failed-retry = Ym lah ban sdang ïa kane ka dokumen.

core-start-failed-busy-retry = Ym lah ban sdang ïa kane ka dokumen. Bun ki dokumen ki la sdang lang ha kajuh ka por, kaba lah ban bat kham bun por ha ka dyrbon babym bakla.

core-start-retry = Pyrshang biang

saved-state-unavailable = Ym lah ban pynmih ïa ka kam jong phi kaba la buh.
