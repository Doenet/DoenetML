# Klingon warnings and errors. Translated from `locales/en/diagnostics.ftl`,
# which is the source of truth.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **This is the emptiest catalog in the roster, and the reason is worth stating
# plainly rather than leaving to be inferred from the gap.** The English file
# holds a little over two hundred messages, and almost every one of them is
# built out of nouns Klingon does not have: *attribute*, *variant*, *matrix*,
# *interval*, *dimension*, *expression*. Under the rule
# `locales/tlh/content.ftl` opens with — a compound of canon words is written, a
# new root is not — translating them would mean coining most of a technical
# vocabulary, which is the thing this seed refuses to do.
#
# Not every noun in those messages is missing, and a corrector should not read
# the gap as one: «'ay'» covers *component* in its canon sense of a part, and
# «nompuq» is *reference* in the sense of a citation. What kept the messages
# around them in English is the rest of each sentence rather than that word.
#
# What is written here is the part that is about *finding* and *being wrong*,
# which Klingon has words for: «tu'lu'» (one finds it), «muj» (be wrong), «Qagh»
# (error), «'oS» (represent), «Hal» (source).
#
# The parser's messages come first among them on purpose. They are what a
# beginner meets before anything runs, and usually the first Doenet message
# anyone ever reads, so they are the ones worth having in the reader's own
# language even when the rest of the file cannot be.
#
# «muj DoenetML» — «the DoenetML is wrong» — opens each of those, in place of
# English's «Invalid DoenetML:». It is repeated in each message rather than
# being a shared term, for the reason English's own opening is: a term a locale
# forgets to define renders as its own name.
#
# `$tag`, `$value`, `$attribute` and their relatives quote the author's own
# source back at them and stay exactly as written, as do every DoenetML element
# and attribute name.


## Reading the DoenetML

parse-invalid-doenetml = muj DoenetML: { $content }

parse-tag-error = muj DoenetML: Qagh ngaS `<{ $tagName }>`.

parse-attribute-invalid = muj DoenetML: muj `{ $attribute }`.

parse-attribute-value-invalid = muj DoenetML: muj `{ $value }`.

parse-open-tag-name-missing = muj DoenetML: pong Hutlh per.

parse-close-tag-name-missing = muj DoenetML: pong Hutlh per SoQmoHwI'.

parse-self-closing-tag-name-missing = muj DoenetML: pong Hutlh per `<{ $content }>`.

parse-close-tag-without-open-tag = muj DoenetML: tu'lu' per SoQmoHwI' `{ $tag }`, 'ach tu'lu'be' per poSmoHwI'.

# «pIH» is «expect» and «-'e'» marks the topic — what was expected as against
# what turned up. The capital H matters: «h» alone is not a Klingon consonant,
# so a lowercase spelling here would be no word at all.
parse-close-tag-mismatched = muj DoenetML: pIm per SoQmoHwI'. `</{ $expected }>`'e' pIHlu'. `{ $found }` tu'lu'.


## Referring to other components

# «'oS» is «represent», so a reference with no referent represents «pagh» —
# nothing — and one with too many represents many things.
reference-no-referent = pagh 'oS `{ $reference }`.

reference-multiple-referents = Dochmey law' 'oS `{ $reference }`.

# «Hal» is «source».
collect-no-source = Hal tu'lu'be'.


## Building components from the source

# «Segh» is «race» in the sense of a type, sort or class.
component-type-invalid = muj Segh: `<{ $componentType }>`.


## Everything else
##
## Left to English, and not as an oversight — see the header. The nouns those
## messages are built from do not exist in Klingon, and a corrector who wants
## them here should bring words Okrand has published rather than invent a set
## beside this file's.
