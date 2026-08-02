import { stripBidiIsolates } from "@doenet/i18n";

export { stripBidiIsolates };

/**
 * A `.should()` callback asserting the subject's text contains `text`, once the
 * invisible bidi formatting characters are taken out.
 *
 * The chrome wraps every placeable in U+2068/U+2069 in every language but
 * English, so `cy.contains("Línea n.º 2")` no longer matches: the marks land
 * *inside* the string, on either side of the number. They render as nothing, so
 * a failure diff shows two strings that look identical — which is why an
 * assertion on translated chrome has to say out loud that it is ignoring them.
 *
 * Assert against English if what you mean to pin is the exact bytes, or against
 * the code points directly if what you mean to pin is the isolation itself.
 */
export function plainTextIncluding(text: string) {
    return ($el: JQuery<HTMLElement>) => {
        expect(stripBidiIsolates($el.text())).to.include(text);
    };
}
