# Romani (Romani čhib) viewer chrome. Translated from `locales/en/chrome.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **`rom` is a macrolanguage tag.** It covers Vlax, Balkan, Carpathian, Sinte,
# Finnish Kalo, Welsh Romani and more, and those varieties differ in lexicon,
# in phonology and in how much of the Indo-Aryan inflection survives. **The
# written norm used here is closest to Vlax Romani**, which is the variety the
# international standardisation work was built around and the one with the most
# published teaching material. A Sinti or a Kalo reader will find much of this
# unfamiliar, and the fix is a `localeResources` catalog of their own rather
# than correcting this file word by word until it is in three varieties at
# once. **Do not use `rmy`** for a Vlax-specific deployment either: it
# canonicalises to `rom` and would collide with this catalog.
#
# **Script and orthography.** Latin script, in the **standardised international
# Romani orthography in the Hancock line** — the practical alphabet of the
# Romani Union's 1990 resolution as Ian Hancock writes it in *A Handbook of
# Vlax Romani* and *We are the Romani people*: `č š ž` for the affricate and
# the two fricatives, `čh ph th kh` for the aspirates, `x` for the velar
# fricative, `ř` for the uvular rhotic. **Courthiade's morpho-graphs are
# deliberately not used**: his `θ`, `ç`, `q` and `ǰ`, which encode a
# morphophonemic alternation rather than a sound, are unfamiliar to almost
# every Romani reader outside his own school, and a seed catalog is not the
# place to teach a second alphabet.
#
# **What is the language's own.** The grammatical spine is Romani and is meant
# to stay that way: the copula «si» and its negative «naj», the negator «či»
# — which is the one this catalog writes, in front of a finite verb, seventy
# times over, and it writes «na», the other negator Romani has, nowhere at
# all — «našti» for *cannot*, «trubul» for *must*, «thaj» for *and*, «vaj»
# for *or*, «te» for *if*, «kaj» for *because/that*, «khanči» for *nothing*,
# «nisavo» for *none*, «pale» for *again*. So are the everyday words: «phendipe»
# (answer, from *phenel* 'to say'), «pučipe» (question, from *pučel*),
# «zumavipe» (attempt, from *zumavel*), «doš» (fault → error), «patrin» (leaf
# → page), «buti» (work), «kotor» (part), «čačo» / «xoxavno» (true / false),
# «sikav» / «garav» (show / hide), «putar» / «phanda» (open / close), «kalo»,
# «parno», «lolo» for the colours that Romani has its own words for.
#
# **What is borrowed, and from where.** The technical nouns are international
# Latin-Romance stock — «komponento», «atributo», «dokumento», «funkcia»,
# «vektoro», «informacia», «referensa» — which is what the Romani Union's
# standard itself does for this register and what Romani-language teaching
# material does in practice. That is honest borrowing rather than a claim that
# Romani has these words. «avertismento» for *warning* and «aver» for
# *otherwise* are the two weakest choices in the catalog and are where a
# reviewer should start.
#
# **Counts.** CLDR has **no plural data for `rom` at all**, so no plural
# category can be selected here: this catalog writes **no** `[zero]`, `[one]`,
# `[two]`, `[few]` or `[many]` branch anywhere in any of its four files, and
# every count reads with a single form. This is a real loss — Romani marks
# number and gender richly, and «phendipe» / «phendimata» is a live
# distinction — but it is CLDR's silence
# rather than the language's. The loss is not resolved the same way twice, and
# a speaker should settle which: `answer-show-responses` writes the plural
# «phendimata» after any count, while `attempts-remaining` writes the singular
# «zumavipe» after any count. The numeric literal `[0]` in `attempts-remaining`
# is a different mechanism, an exact-value match rather than a plural category,
# and stays.
#
# **Digits.** Every number renders in Latin digits, so the digits written into
# prose here are Latin digits too.
#
# Register: impersonal where English is impersonal, and the familiar singular
# imperative on the buttons («sikav», «putar», «zumav»), which is what Romani
# actually says to one reader.


## Answer submission

answer-checking = Dikhel pes …
answer-submitting = Bičhalel pes …
answer-checking-status = O phendipe dikhel pes
answer-submitting-status = O phendipe bičhalel pes
answer-correct = Čačo
answer-incorrect = Naj čačo
answer-response-saved = O phendipe si arakhado
answer-percent-credit = { $percent } % kredito
answer-percent-correct = { $percent } % čačo
answer-percent-short = { $percent } %
max-credit-available = Maj baro kredito: { $percent } %
# CLDR has no plural rules for `rom`, so there is no category branch: one form
# for every count. The `[0]` key is an exact numeric match, not a category, and
# stays as it is.
attempts-remaining =
    { $count ->
        [0] khanči zumavipe či ačhilo
       *[other] { $count } zumavipe ačhilo
    }
validation-correct = (Čačo)
validation-incorrect = (Naj čačo)
validation-partially-correct = (Kotorestar čačo)
answer-show-responses = Sikav { $count } phendimata vaš { $answerId }

## Disclosure panels

feedback-heading = Palpale phendipe
collapsible-click-to-open = (klikisar te putres)
collapsible-click-to-close = (klikisar te phandes)
collapsible-initializing = Startil pes …
footnote-show = Sikav e telutni notica
footnote-hide = Garav e telutni notica
description-more-information = maj but informacia

## Controls

slider-previous = Palpale
slider-next = Angle
keyboard-open = Putar e klavijatura
keyboard-close = Phanda e klavijatura
choice-input-remove-choice = Ikal avri { $choice }
matrix-remove-row = Ikal avri o rando
matrix-add-row = Thov jekh rando
matrix-remove-column = Ikal avri e kolona
matrix-add-column = Thov jekh kolona
subset-add-remove-points = Thov / ikal avri punktura
subset-toggle-points-intervals = Parav maškar punktura thaj intervalura
subset-move-points = Cirde le punktura
subset-clear = Khosav sa
# A `box` here is one orbital, drawn as a square: «kutia».
orbital-add-row = Thov jekh rando
orbital-remove-row = Ikal avri o rando
orbital-add-box = Thov jekh kutia
orbital-remove-box = Ikal avri e kutia
orbital-add-up-arrow = Thov jekh strela opre
orbital-add-down-arrow = Thov jekh strela tele
orbital-remove-arrow = Ikal avri e strela
orbital-row-label = Etiketa vaš o rando { $row }
pretzel-answer = Phendipe

## Math input

math-input-preview-region = anglal-dikhipe le matematikake ekspresiako
math-input-preview = Anglal-dikhipe
math-input-invalid-expression = Bičači ekspresia:

## Document status

viewer-initializing = Startil pes …

## Errors

error-heading = Doš
error-found-at =
    { $span ->
        [line] Arakhadi pe linia { $startLine }.
       *[lines] Arakhadi pe linie { $startLine }–{ $endLine }.
    }
document-contains-errors = Kado dokumento si doša ande leste!
diagnostic-heading-error = Doš
diagnostic-heading-warning = Avertismento
diagnostic-heading-information = Informacia
diagnostic-heading-hint = Sikavipe
# `WCAG AA` is the name of the standard and is not translated.
accessibility-heading-level-1 = Phagipe le WCAG AA-sko (resipe)
accessibility-heading-level-2 = Sikavipe pa o resipe
something-went-wrong = Vareso gelo bilačhes.
renderer-load-failed = jekh modulo sikavimasko našti sas ladino. Lade e patrin pale.
core-start-failed = Kado dokumento našti sas startime. Lade e patrin pale.
core-start-failed-busy = Kado dokumento našti sas startime. But dokumentura startisarde ande jekh vrjama, thaj pe jekh maj polokho aparato kadaja šaj lel maj but vrjama. Te lades e patrin pale šaj žutil, kana le aver dokumentura si gata.
core-start-failed-retry = Kado dokumento našti sas startime.
core-start-failed-busy-retry = Kado dokumento našti sas startime. But dokumentura startisarde ande jekh vrjama, thaj pe jekh maj polokho aparato kadaja šaj lel maj but vrjama.
core-start-retry = Zumav pale
saved-state-unavailable = Tiri arakhadi buti našti sas ladini.
