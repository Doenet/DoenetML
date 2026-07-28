/**
 * The words the chemistry components generate: element names, periodic group
 * names, and the name an ion derives from its element's.
 *
 * These reach the reader as `$atom.name`, `$ion.name` and `$atom.groupName`,
 * so they are *content* and follow the document's language rather than the
 * reader's UI language.
 *
 * ## Symbols are not words
 *
 * `H`, `He`, `Fe` are international and are never translated, and neither is
 * anything else an author's `<award>` compares against by value. Only what is
 * *displayed as prose* is here. Element names are keyed **by symbol**, which
 * is both the stable identifier and the key the atom database is already read
 * through.
 *
 * ## Ion names are data, not a rule
 *
 * English derives an anion's name from the element's: strip a trailing "ine"
 * and add "ide" (Fluorine → Fluoride), with a small table for the words that
 * rule does not fit (Oxygen → Oxide). That is English morphology. No other
 * language derives its anion names that way and several do not derive them
 * from the element name at all, so the derived name is data here too — one
 * entry per element that has one, and the element's own name for every element
 * that does not, which is what the English rule also does.
 *
 * The oxidation state a transition metal's name carries is a different thing:
 * the Roman numeral is IUPAC notation and is international, but where it sits
 * and how it is punctuated is not, so that is a message with the numeral as an
 * argument.
 *
 * ## Written out one call per word
 *
 * `lint:i18n` reads translator call sites textually and only sees a key
 * spelled as a string literal, so a key built from the symbol would be
 * invisible to it: every one of these entries would be reported as an orphan
 * and a typo would surface only at runtime, in one language, for one element.
 * The English beside each key is the fallback, and is the word this replaced.
 */

const ELEMENT_NAME_WORDS = {
    H: (t) => t("element-name.h", undefined, "Hydrogen"),
    He: (t) => t("element-name.he", undefined, "Helium"),
    Li: (t) => t("element-name.li", undefined, "Lithium"),
    Be: (t) => t("element-name.be", undefined, "Beryllium"),
    B: (t) => t("element-name.b", undefined, "Boron"),
    C: (t) => t("element-name.c", undefined, "Carbon"),
    N: (t) => t("element-name.n", undefined, "Nitrogen"),
    O: (t) => t("element-name.o", undefined, "Oxygen"),
    F: (t) => t("element-name.f", undefined, "Fluorine"),
    Ne: (t) => t("element-name.ne", undefined, "Neon"),
    Na: (t) => t("element-name.na", undefined, "Sodium"),
    Mg: (t) => t("element-name.mg", undefined, "Magnesium"),
    Al: (t) => t("element-name.al", undefined, "Aluminum"),
    Si: (t) => t("element-name.si", undefined, "Silicon"),
    P: (t) => t("element-name.p", undefined, "Phosphorus"),
    S: (t) => t("element-name.s", undefined, "Sulfur"),
    Cl: (t) => t("element-name.cl", undefined, "Chlorine"),
    Ar: (t) => t("element-name.ar", undefined, "Argon"),
    K: (t) => t("element-name.k", undefined, "Potassium"),
    Ca: (t) => t("element-name.ca", undefined, "Calcium"),
    Sc: (t) => t("element-name.sc", undefined, "Scandium"),
    Ti: (t) => t("element-name.ti", undefined, "Titanium"),
    V: (t) => t("element-name.v", undefined, "Vanadium"),
    Cr: (t) => t("element-name.cr", undefined, "Chromium"),
    Mn: (t) => t("element-name.mn", undefined, "Manganese"),
    Fe: (t) => t("element-name.fe", undefined, "Iron"),
    Co: (t) => t("element-name.co", undefined, "Cobalt"),
    Ni: (t) => t("element-name.ni", undefined, "Nickel"),
    Cu: (t) => t("element-name.cu", undefined, "Copper"),
    Zn: (t) => t("element-name.zn", undefined, "Zinc"),
    Ga: (t) => t("element-name.ga", undefined, "Gallium"),
    Ge: (t) => t("element-name.ge", undefined, "Germanium"),
    As: (t) => t("element-name.as", undefined, "Arsenic"),
    Se: (t) => t("element-name.se", undefined, "Selenium"),
    Br: (t) => t("element-name.br", undefined, "Bromine"),
    Kr: (t) => t("element-name.kr", undefined, "Krypton"),
    Rb: (t) => t("element-name.rb", undefined, "Rubidium"),
    Sr: (t) => t("element-name.sr", undefined, "Strontium"),
    Y: (t) => t("element-name.y", undefined, "Yttrium"),
    Zr: (t) => t("element-name.zr", undefined, "Zirconium"),
    Nb: (t) => t("element-name.nb", undefined, "Niobium"),
    Mo: (t) => t("element-name.mo", undefined, "Molybdenum"),
    Tc: (t) => t("element-name.tc", undefined, "Technetium"),
    Ru: (t) => t("element-name.ru", undefined, "Ruthenium"),
    Rh: (t) => t("element-name.rh", undefined, "Rhodium"),
    Pd: (t) => t("element-name.pd", undefined, "Palladium"),
    Ag: (t) => t("element-name.ag", undefined, "Silver"),
    Cd: (t) => t("element-name.cd", undefined, "Cadmium"),
    In: (t) => t("element-name.in", undefined, "Indium"),
    Sn: (t) => t("element-name.sn", undefined, "Tin"),
    Sb: (t) => t("element-name.sb", undefined, "Antimony"),
    Te: (t) => t("element-name.te", undefined, "Tellurium"),
    I: (t) => t("element-name.i", undefined, "Iodine"),
    Xe: (t) => t("element-name.xe", undefined, "Xenon"),
    Cs: (t) => t("element-name.cs", undefined, "Cesium"),
    Ba: (t) => t("element-name.ba", undefined, "Barium"),
    La: (t) => t("element-name.la", undefined, "Lanthanum"),
    Ce: (t) => t("element-name.ce", undefined, "Cerium"),
    Pr: (t) => t("element-name.pr", undefined, "Praseodymium"),
    Nd: (t) => t("element-name.nd", undefined, "Neodymium"),
    Pm: (t) => t("element-name.pm", undefined, "Promethium"),
    Sm: (t) => t("element-name.sm", undefined, "Samarium"),
    Eu: (t) => t("element-name.eu", undefined, "Europium"),
    Gd: (t) => t("element-name.gd", undefined, "Gadolinium"),
    Tb: (t) => t("element-name.tb", undefined, "Terbium"),
    Dy: (t) => t("element-name.dy", undefined, "Dysprosium"),
    Ho: (t) => t("element-name.ho", undefined, "Holmium"),
    Er: (t) => t("element-name.er", undefined, "Erbium"),
    Tm: (t) => t("element-name.tm", undefined, "Thulium"),
    Yb: (t) => t("element-name.yb", undefined, "Ytterbium"),
    Lu: (t) => t("element-name.lu", undefined, "Lutetium"),
    Hf: (t) => t("element-name.hf", undefined, "Hafnium"),
    Ta: (t) => t("element-name.ta", undefined, "Tantalum"),
    W: (t) => t("element-name.w", undefined, "Tungsten"),
    Re: (t) => t("element-name.re", undefined, "Rhenium"),
    Os: (t) => t("element-name.os", undefined, "Osmium"),
    Ir: (t) => t("element-name.ir", undefined, "Iridium"),
    Pt: (t) => t("element-name.pt", undefined, "Platinum"),
    Au: (t) => t("element-name.au", undefined, "Gold"),
    Hg: (t) => t("element-name.hg", undefined, "Mercury"),
    Tl: (t) => t("element-name.tl", undefined, "Thallium"),
    Pb: (t) => t("element-name.pb", undefined, "Lead"),
    Bi: (t) => t("element-name.bi", undefined, "Bismuth"),
    Po: (t) => t("element-name.po", undefined, "Polonium"),
    At: (t) => t("element-name.at", undefined, "Astatine"),
    Rn: (t) => t("element-name.rn", undefined, "Radon"),
    Fr: (t) => t("element-name.fr", undefined, "Francium"),
    Ra: (t) => t("element-name.ra", undefined, "Radium"),
    Ac: (t) => t("element-name.ac", undefined, "Actinium"),
    Th: (t) => t("element-name.th", undefined, "Thorium"),
    Pa: (t) => t("element-name.pa", undefined, "Protactinium"),
    U: (t) => t("element-name.u", undefined, "Uranium"),
    Np: (t) => t("element-name.np", undefined, "Neptunium"),
    Pu: (t) => t("element-name.pu", undefined, "Plutonium"),
    Am: (t) => t("element-name.am", undefined, "Americium"),
    Cm: (t) => t("element-name.cm", undefined, "Curium"),
    Bk: (t) => t("element-name.bk", undefined, "Berkelium"),
    Cf: (t) => t("element-name.cf", undefined, "Californium"),
    Es: (t) => t("element-name.es", undefined, "Einsteinium"),
    Fm: (t) => t("element-name.fm", undefined, "Fermium"),
    Md: (t) => t("element-name.md", undefined, "Mendelevium"),
    No: (t) => t("element-name.no", undefined, "Nobelium"),
    Lr: (t) => t("element-name.lr", undefined, "Lawrencium"),
    Rf: (t) => t("element-name.rf", undefined, "Rutherfordium"),
    Db: (t) => t("element-name.db", undefined, "Dubnium"),
    Sg: (t) => t("element-name.sg", undefined, "Seaborgium"),
    Bh: (t) => t("element-name.bh", undefined, "Bohrium"),
    Hs: (t) => t("element-name.hs", undefined, "Hassium"),
    Mt: (t) => t("element-name.mt", undefined, "Meitnerium"),
    Ds: (t) => t("element-name.ds", undefined, "Darmstadtium"),
    Rg: (t) => t("element-name.rg", undefined, "Roentgenium"),
    Cn: (t) => t("element-name.cn", undefined, "Copernicium"),
    Nh: (t) => t("element-name.nh", undefined, "Nihonium"),
    Fl: (t) => t("element-name.fl", undefined, "Flerovium"),
    Mc: (t) => t("element-name.mc", undefined, "Moscovium"),
    Lv: (t) => t("element-name.lv", undefined, "Livermorium"),
    Ts: (t) => t("element-name.ts", undefined, "Tennessine"),
    Og: (t) => t("element-name.og", undefined, "Oganesson"),
};

const ELEMENT_ANION_NAME_WORDS = {
    H: (t) => t("element-anion-name.h", undefined, "Hydride"),
    C: (t) => t("element-anion-name.c", undefined, "Carbide"),
    N: (t) => t("element-anion-name.n", undefined, "Nitride"),
    O: (t) => t("element-anion-name.o", undefined, "Oxide"),
    F: (t) => t("element-anion-name.f", undefined, "Fluoride"),
    P: (t) => t("element-anion-name.p", undefined, "Phosphide"),
    S: (t) => t("element-anion-name.s", undefined, "Sulfide"),
    Cl: (t) => t("element-anion-name.cl", undefined, "Chloride"),
    Br: (t) => t("element-anion-name.br", undefined, "Bromide"),
    I: (t) => t("element-anion-name.i", undefined, "Iodide"),
    At: (t) => t("element-anion-name.at", undefined, "Astatide"),
    Ts: (t) => t("element-anion-name.ts", undefined, "Tennesside"),
};

/**
 * The periodic group names the atom database uses, keyed by the English value
 * in the `Group Name` column. An element with no group has an empty value,
 * which is not a word and passes through as it is.
 */
const GROUP_NAME_WORDS = {
    "Alkali Metal": (t) =>
        t("periodic-group-name.alkali-metal", undefined, "Alkali Metal"),
    "Alkaline Earth Metal": (t) =>
        t(
            "periodic-group-name.alkaline-earth-metal",
            undefined,
            "Alkaline Earth Metal",
        ),
    Chalcogen: (t) =>
        t("periodic-group-name.chalcogen", undefined, "Chalcogen"),
    Halogen: (t) => t("periodic-group-name.halogen", undefined, "Halogen"),
    "Noble Gas": (t) =>
        t("periodic-group-name.noble-gas", undefined, "Noble Gas"),
    "Rare Earth Metal": (t) =>
        t(
            "periodic-group-name.rare-earth-metal",
            undefined,
            "Rare Earth Metal",
        ),
    "Transition Metal": (t) =>
        t(
            "periodic-group-name.transition-metal",
            undefined,
            "Transition Metal",
        ),
};

/**
 * The oxidation state a transition metal's ion name carries, as a Roman
 * numeral. IUPAC notation, so the numerals themselves are international.
 */
const OXIDATION_STATE_NUMERALS = {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V",
    6: "VI",
    7: "VII",
    8: "VIII",
};

/**
 * The name of the element with symbol `symbol`, in `t`'s language.
 *
 * @param fallback The English name from the atom database, for a symbol the
 *   catalog has never seen.
 */
export function elementName(t, symbol, fallback) {
    const word = ELEMENT_NAME_WORDS[symbol];
    return word === undefined ? fallback : word(t);
}

/**
 * The name of the anion of the element with symbol `symbol`.
 *
 * An element with no derived anion name is called by its own name, which is
 * what English's rule also does for everything it does not match.
 */
export function anionName(t, symbol, fallback) {
    const word = ELEMENT_ANION_NAME_WORDS[symbol];
    return word === undefined ? elementName(t, symbol, fallback) : word(t);
}

/**
 * The English anion name the derivation used to produce, for a locale whose
 * catalog has never seen the message.
 *
 * The rule verbatim: strip a trailing "ine" and add "ide", or take the word
 * from the table for the six that rule does not fit.
 */
export function englishAnionName(name) {
    const mapping = {
        Hydrogen: "Hydride",
        Oxygen: "Oxide",
        Sulfur: "Sulfide",
        Nitrogen: "Nitride",
        Phosphorus: "Phosphide",
        Carbon: "Carbide",
    };
    const len = name.length;
    if (name.substring(len - 3, len) === "ine") {
        return name.substring(0, len - 3) + "ide";
    }
    return mapping[name] ?? name;
}

/**
 * `name` with its oxidation state appended: "Iron (II)".
 *
 * Returns `name` unchanged for a charge with no numeral, which is what
 * appending an empty suffix did.
 */
export function withOxidationState(t, name, charge) {
    const numeral = OXIDATION_STATE_NUMERALS[charge];
    if (numeral === undefined) {
        return name;
    }
    return t(
        "ion-name-oxidation-state",
        { name, numeral },
        `${name} (${numeral})`,
    );
}

/** The name of the periodic group `group`, in `t`'s language. */
export function periodicGroupName(t, group) {
    const word = GROUP_NAME_WORDS[group];
    return word === undefined ? group : word(t);
}

/** Which symbols {@link elementName} can name. For tests. */
export function elementWordsCoverage() {
    return Object.keys(ELEMENT_NAME_WORDS);
}
