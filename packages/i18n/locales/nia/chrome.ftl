# Nias (Li Niha) viewer chrome. Translated from `locales/en/chrome.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Variety and orthography: the northern standard, in Latin.** Nias is spoken
# on Nias and the Batu islands off western Sumatra, and its three main
# varieties — northern (Gunungsitoli), central and southern (Teluk Dalam) —
# differ enough that a southern reader will notice. This catalog is written in
# the **northern variety**, because that is the variety of the Nias Bible, of
# the standard orthography, and of nearly everything published in the language;
# a southern speaker should feel free to respell, and should do it to **all
# four files at once** rather than to one.
#
# The alphabet is `a b d e f g h i j k l m n o ö r s t u w y z` plus the
# digraphs and clusters `ng mb nd ndr`. `ö` is the mid central vowel and is a
# letter of its own: it must not be folded to `o`, and a search for «börö» will
# not find «boro».
#
# **Nias words end in a vowel — and the loans in this catalog do not.** That is
# the most visible thing about the language and the most visible compromise in
# the file. Every native Nias word here ends in a vowel («börö», «tebai»,
# «halöwö», «duma-duma», «sindruhu»), and every Indonesian technical loan is
# written the way Indonesian writes it, consonant and all: «atribut»,
# «komponen», «dokumen», «versi», «garis», «titik». The seed does **not** know
# how the community actually adapts these words in speech — whether it says
# «atribut» or «atributu» — and respelling them on a guess would invent a loan
# phonology rather than record one. So the Indonesian spellings stand, and this
# is the one place the file knowingly reads as two languages at once. A speaker
# who knows the spoken adaptations should put them in.
#
# **Initial mutation is not applied, and that is a stated limit.** A Nias noun
# changes its initial consonant in certain syntactic positions — the property
# the language is best known for. The seed cannot apply it reliably, and
# applying it in some places and not others would be worse than not applying it
# at all, so **every noun here is in its citation form**. A reviewer should
# expect to mutate rather than to correct: the words are meant to be right, the
# mutation is simply missing.
#
# **The technical register is Indonesian, declared as a loan register.** Nias
# speakers are schooled in Indonesian, and the vocabulary of a viewer's
# controls is Indonesian in a Nias classroom. What is Nias here is the frame:
# «lö» (not), «tebai» (cannot), «tola» (can), «so» (there is), «moroi» (from),
# «ba» (in, at, and), «awö» (with), «ma» (or), «na» (if, when), «börö me»
# (because), «fefu» (all), «oya» (many), «sibai» (very), «andrö» (that), and
# the verb-forming prefixes «fa-», «mu-» and the passive «ni-».
#
# **Nias words used here that are not loans**, so a reviewer can see the seam:
# «halöwö» (work, activity), «fanofu» (question), «fanema li» (answer),
# «duma-duma» (example), «sindruhu» (true), «atulö» (correct, straight),
# «fasala» (error), «töi» (name), «li» (word, language), «sökhi» (good),
# «sebua» (big), «side-ide» (small), «ahatö» (near), «oroma» (visible),
# «bunia» (hidden), «bokai» (open), «faudu» (fitting), «moguna» (needed),
# «nibe'e» (given), «fazökhi» (make), «sara», «dua», «tölu» (one, two, three).
#
# «Tutu» (close) is an **adapted loan** and is the one word in this catalog
# spelled with a Nias-shaped final vowel rather than Indonesian's: it stands
# opposite «bokai», and writing «tutup» beside a native imperative was worse
# than either choice. It is flagged here because it is the exception to the
# paragraph above, not because the seed is confident in it.
#
# Nias has a single plural category — a noun after a numeral is unmarked — so
# `attempts-remaining` and `answer-show-responses` collapse to a single
# `*[other]` branch. The `[0]` branch stays: Fluent matches a numeric literal
# against the number itself, before any plural rule.


## Answer submission

answer-checking = Nifareso...
answer-submitting = Nifa'ohe...

answer-checking-status = Nifareso wanema li
answer-submitting-status = Nifa'ohe wanema li

answer-correct = Atulö
answer-incorrect = Lö atulö

answer-response-saved = No terohu wanema li

answer-percent-credit = Nilai { $percent }%
answer-percent-correct = { $percent }% atulö
answer-percent-short = { $percent } %

max-credit-available = Nilai sebua zi tola tesöndra: { $percent }%

attempts-remaining =
    { $count ->
        [0] lö sa'ae so wanandraigö
       *[other] so nasa { $count } wanandraigö
    }

validation-correct = (Atulö)
validation-incorrect = (Lö atulö)
validation-partially-correct = (Atulö ösa)

answer-show-responses = Oroma'ö { $count } wanema li ba { $answerId }


## Disclosure panels

feedback-heading = Fangumaigö

collapsible-click-to-open = (klik ba wamokai)
collapsible-click-to-close = (klik ba wanutu)

collapsible-initializing = Mufa'anö...

footnote-show = Oroma'ö catatan ba dalu
footnote-hide = Bunia'ö catatan ba dalu

description-more-information = keterangan tanö bö'ö


## Controls

slider-previous = Si fatua
slider-next = Si so föna

keyboard-open = Bokai papan ketik
keyboard-close = Tutu papan ketik

choice-input-remove-choice = Heta { $choice }

matrix-remove-row = Heta baris
matrix-add-row = Tambö baris
matrix-remove-column = Heta kolom
matrix-add-column = Tambö kolom

subset-add-remove-points = Tambö/Heta titik
subset-toggle-points-intervals = Falalini titik awö selang
subset-move-points = Fa'ohe titik
subset-clear = Sasai

orbital-add-row = Tambö baris
orbital-remove-row = Heta baris
orbital-add-box = Tambö kotak
orbital-remove-box = Heta kotak
orbital-add-up-arrow = Tambö panah ba yawa
orbital-add-down-arrow = Tambö panah ba tou
orbital-remove-arrow = Heta panah

orbital-row-label = Label ba baris { $row }

pretzel-answer = Fanema li



## Math input

math-input-preview-region = pratinjau ekspresi matematika
math-input-preview = Pratinjau
math-input-invalid-expression = Ekspresi si lö atulö:


## Document status

viewer-initializing = Mufa'anö...


## Errors

error-heading = Fasala

error-found-at =
    { $span ->
        [line] Tesöndra ba baris { $startLine }.
       *[lines] Tesöndra ba baris { $startLine }–{ $endLine }.
    }

document-contains-errors = So fasala ba dokumen andre!

diagnostic-heading-error = Fasala
diagnostic-heading-warning = Fango'ou
diagnostic-heading-information = Info
diagnostic-heading-hint = Fanuturu

accessibility-heading-level-1 = Pelanggaran aksesibilitas WCAG AA
accessibility-heading-level-2 = Fango'ou aksesibilitas

something-went-wrong = So zi lö atulö.

renderer-load-failed = sara perender tebai mufa'anö. Fatambai wamokai halaman andre.

core-start-failed = Dokumen andre tebai mufamula. Fatambai wamokai halaman andre.

core-start-failed-busy = Dokumen andre tebai mufamula. Oya dokumen si famula ba ginötö si sara, ba tola ara ba alat samalö-malö. Fatambai wamokai halaman andre na no aefa dokumen tanö bö'ö.

core-start-failed-retry = Dokumen andre tebai mufamula.

core-start-failed-busy-retry = Dokumen andre tebai mufamula. Oya dokumen si famula ba ginötö si sara, ba tola ara ba alat samalö-malö.

core-start-retry = Fatambai

saved-state-unavailable = Halöwöu si no terohu tebai mufa'ema.
