/**
 *  Detect modified elements → Mark them with { status: "modified" }.
 *  Detect deleted elements → Mark them with { status: "deleted" }.
 * @param {*} oldArray
 * @param {*} newArray
 * @returns modified and deleted elements from oldArray.
 */
exports.getChanges = (oldArray, newArray) => {
    return oldArray
        .map(oldItem => {
            const matchingNewItem = newArray.find(newItem => this.deepEqual(newItem, oldItem));

            if (!matchingNewItem) {
                // Deleted element (exists in oldArray but not in newArray)
                return { ...oldItem, status: "deleted" };
            }

            // Check if modified (exists but with changes)
            if (!this.deepEqual(oldItem, matchingNewItem)) {
                return { ...matchingNewItem, status: "modified" };
            }

            return null; // Unchanged elements are ignored
        })
        .filter(Boolean); // Remove null values (unchanged elements)
}

/**
 * Deep comparison function (checks nested objects/arrays)
 * @param {arr1} a
 * @param {arr2} b
 * @returns Boolean
 */
exports.deepEqual = (a, b) => {
    if (a === b) return true;

    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        return a.every((el, i) => this.deepEqual(el, b[i]));
    }

    if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;
        return keysA.every(key => this.deepEqual(a[key], b[key]));
    }

    return false;
}

/**
 *

// Example Usage:

const oldArray = [
    { id: 1, name: "Alice", age: 25 },
    { id: 2, name: "Bob", age: 30 },
    { id: 3, name: "Charlie", age: 22 }
];

const newArray = [
    { id: 1, name: "Alice", age: 26 }, // 🔴 Tampered (age changed)
    { id: 2, name: "Bob", age: 30 },   // ✅ Same (ignored)
    { id: 4, name: "Dave", age: 28 }   // 🆕 New entry (ignored)
];

console.log(getChanges(oldArray, newArray));
 */
/* Output:
[
    { id: 1, name: "Alice", age: 26, status: "modified" },  // Age changed (modified)
    { id: 3, name: "Charlie", age: 22, status: "deleted" }  // Deleted
]
*/
