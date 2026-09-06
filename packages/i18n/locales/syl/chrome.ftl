# Sylheti (ছিলটি, Sylheti Nagri ꠍꠤꠟꠐꠤ) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: the Bengali script, as Sylheti is normally printed today, not
# Sylheti Nagri.** Sylheti has a script of its own — **Sylheti Nagri**
# (ꠍꠤꠟꠐꠤ ꠘꠣꠉꠞꠤ, Unicode U+A800–U+A82F), a Brahmic script unrelated in shape to
# Bengali, used for Sylheti manuscripts and printing from roughly the
# fifteenth century into the twentieth, revived deliberately since the 1970s,
# and taught today in community classes in Sylhet and in the British Sylheti
# diaspora. A reviewer may reasonably have expected it here, and its absence
# is not a judgement about which script belongs to the language.
#
# This catalog writes the **Bengali script**, for three reasons. The first is
# what a Sylheti reader reads: virtually everything published in or about
# Sylheti in the last century — newspapers, songbooks, dictionaries, social
# media, the Sylheti material on the Bangladeshi web — is set in Bengali
# letters, because that is the script every Sylheti speaker is schooled in.
# The second is mechanical: Sylheti Nagri font coverage in a browser is thin
# and inconsistent, and a catalog that renders as boxes on most machines helps
# nobody. The third is that Sylheti Nagri has a **smaller inventory** than
# Bengali — it writes no distinct ড়/ঢ়/য়, no independent vowel series of the
# same size, and no conjunct repertoire of the same depth — so a Nagri seed
# would collapse distinctions this seed cannot restore, and a reviewer could
# not tell a correction from a spelling convention. Converting this catalog to
# Sylheti Nagri means converting **all four files at once**, never a mixture
# inside one catalog, and it is a real conversion rather than a
# transliteration.
#
# **This seed leans heavily on Bengali, and says so.** Sylheti and Bengali
# share most of their written lexicon, and every technical word in these files
# — ত্রুটি, সতর্কতা, উপাদান, বৈশিষ্ট্য, চলক, মাত্রা, সারি, স্তম্ভ — is
# Bengali, because Sylheti-medium education does not exist and a Sylheti
# reader met these words in Bengali. What is Sylheti here is the **grammar and
# the function words**: নায় for verbal negation, নাই for absence, আছে for
# presence, অউ for *this*, ইতা for *these*, লাগি for *for*, লগে for *with*
# and *along with*, আর for *and*, মিছা for *false*, and the honorific
# imperative in -ইন — করইন, দেখইন, লেখইন — which is what a Sylheti reader
# expects a button to say. A message where বাংলা's করুন, এই, এগুলি, জন্য or
# নেই has crept back in is a defect rather than a variant, and is the easiest
# thing in this catalog to check.
#
# **Numbers render in Latin digits** rather than in Bengali numerals, which is
# the digit policy in the package README (#1615). The grouping is the
# locale's; the ten characters are not.
#
# **No plural branches.** CLDR has no plural data for `syl`, so a `one` branch
# here would be text selected by Bengali's rules rather than by this locale's.
# The numeric literal `[0]` in `attempts-remaining` stays, because Fluent
# matches it against the number itself before any plural rule is consulted.


## Answer submission

answer-checking = দেখরাম...
answer-submitting = পাঠাইরাম...
answer-checking-status = জুয়াপ দেখরাম
answer-submitting-status = জুয়াপ পাঠাইরাম
answer-correct = ঠিক
answer-incorrect = ঠিক নায়
answer-response-saved = জুয়াপ রাখা অইছে
answer-percent-credit = { $percent }% নম্বর
answer-percent-correct = { $percent }% ঠিক
answer-percent-short = { $percent } %
max-credit-available = সবতে বেশি নম্বর: { $percent }%
attempts-remaining =
    { $count ->
        [0] আর কোনো সুযোগ নাই
       *[other] আরো { $count } সুযোগ আছে
    }
validation-correct = (ঠিক)
validation-incorrect = (ঠিক নায়)
validation-partially-correct = (কিছু অংশ ঠিক)
answer-show-responses =
    { $count ->
       *[other] { $answerId }-র { $count } জুয়াপ দেখাইন
    }


## Disclosure panels

feedback-heading = মতামত
collapsible-click-to-open = (খুলতে ক্লিক করইন)
collapsible-click-to-close = (বন্ধ করতে ক্লিক করইন)
collapsible-initializing = শুরু অইরার...
footnote-show = পাদটীকা দেখাইন
footnote-hide = পাদটীকা লুকাইন
description-more-information = আরো খবর


## Controls

slider-previous = আগের
slider-next = পরের
keyboard-open = কিবোর্ড খুলইন
keyboard-close = কিবোর্ড বন্ধ করইন
choice-input-remove-choice = { $choice } সরাইন
matrix-remove-row = সারি সরাইন
matrix-add-row = সারি বাড়াইন
matrix-remove-column = স্তম্ভ সরাইন
matrix-add-column = স্তম্ভ বাড়াইন
subset-add-remove-points = বিন্দু বাড়ানি/সরানি
subset-toggle-points-intervals = বিন্দু আর ব্যবধান বদলাইন
subset-move-points = বিন্দু নাড়াইন
subset-clear = সাফ করইন
orbital-add-row = সারি বাড়াইন
orbital-remove-row = সারি সরাইন
orbital-add-box = বাকসো বাড়াইন
orbital-remove-box = বাকসো সরাইন
orbital-add-up-arrow = উপরের তীর বাড়াইন
orbital-add-down-arrow = নিচের তীর বাড়াইন
orbital-remove-arrow = তীর সরাইন
orbital-row-label = { $row } নম্বর সারির নাম
pretzel-answer = জুয়াপ


## Math input

math-input-preview-region = গণিত রাশির ঝলক
math-input-preview = ঝলক
math-input-invalid-expression = ভুল রাশি:


## Document status

viewer-initializing = শুরু অইরার...


## Errors

error-heading = ত্রুটি
error-found-at =
    { $span ->
        [line] { $startLine } নম্বর লাইনো পাওয়া গেছে।
       *[lines] { $startLine }–{ $endLine } নম্বর লাইনো পাওয়া গেছে।
    }
document-contains-errors = অউ দলিলো ত্রুটি আছে!
diagnostic-heading-error = ত্রুটি
diagnostic-heading-warning = সতর্কতা
diagnostic-heading-information = খবর
diagnostic-heading-hint = ইশারা
accessibility-heading-level-1 = WCAG AA প্রবেশগম্যতা লঙ্ঘন
accessibility-heading-level-2 = প্রবেশগম্যতা সতর্কতা
something-went-wrong = কিছু একটা ভুল অইছে।
renderer-load-failed = একটা রেন্ডারার লোড অইছে নায়। দয়া করি পাতাটা আবার লোড করইন।
core-start-failed = অউ দলিল চালু করা গেছে নায়। দয়া করি পাতাটা আবার লোড করইন।
core-start-failed-busy = অউ দলিল চালু করা গেছে নায়। একলগে অনেক দলিল চালু অইরাছিল, ধীর যন্ত্রো ইতাত আরো বেশি সময় লাগে। বাকি দলিল শেষ অইলে পাতাটা আবার লোড করলে কাম অইতে পারে।
core-start-failed-retry = অউ দলিল চালু করা গেছে নায়।
core-start-failed-busy-retry = অউ দলিল চালু করা গেছে নায়। একলগে অনেক দলিল চালু অইরাছিল, ধীর যন্ত্রো ইতাত আরো বেশি সময় লাগে।
core-start-retry = আবার চেষ্টা করইন
saved-state-unavailable = আপনার রাখা কাম লোড করা গেছে নায়।
