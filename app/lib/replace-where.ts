/**
 * Replace the first element in an array that matches a predicate.
 * Returns a new array (immutably).
 */
function replaceWhere<T>(
    array: T[],
    predicate: (item: T, index: number, arr: T[]) => boolean,
    newItem: T
): T[] {
    return array.map((item, i, arr) =>
        predicate(item, i, arr) ? newItem : item
    );
}

export default replaceWhere;