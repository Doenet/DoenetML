/**
 * A store of all potential names. Used for potential rendered names.
 *
 * Fields:
 * - `byName`: either the unique component index with a name or an ambiguous list of all component indices with that name
 * - `byIdx`: an array of all names that could resolve to a component if there were no ambiguities
 */
export type PotentialNames = {
    byName: Record<string, PotentialNameRecord>;
    byIdx: (string[] | null)[];
};

/**
 * The unique `componentIdx` or an ambiguous list of component indices that could resolve to a name
 */
export type PotentialNameRecord =
    | {
          type: "unique";
          componentIdx: number;
      }
    | {
          type: "ambiguous";
          componentIndices: number[];
      };

/**
 * A compare function that sort strings first in order of increasing length the alphabetically.
 *
 * Used to sort potential render names in order of preference.
 */
export function renderedNameSortFunction(a: string, b: string) {
    if (a.length !== b.length) {
        return a.length - b.length;
    }
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    } else {
        return 0;
    }
}
