/**
 *  Detect modified elements → Mark them with { status: "modified" }.
 *  Detect deleted elements → Mark them with { status: "deleted" }.
 * @param {*} oldArray
 * @param {*} newArray
 * @returns modified and deleted elements from oldArray.
 */
exports.getChanges = (oldArray, newArray) => {
    // Convert single object to array if necessary
    const oldItems = Array.isArray(oldArray) ? oldArray : [oldArray];

    return oldItems
        .map(oldItem => {
            // Find matching item based on key identifiers (product_id and sales_detail_id)
            const matchingNewItem = newArray.find(newItem =>
                newItem.product_id === oldItem.product_id &&
                newItem.sales_detail_id === oldItem.sales_detail_id
            );

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
        // Get common keys between both objects
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        const commonKeys = keysA.filter(key => keysB.includes(key));

        // Compare only the common properties
        return commonKeys.every(key => {
            // Convert both values to strings for comparison
            const valA = a[key]?.toString();
            const valB = b[key]?.toString();
            return valA === valB;
        });
    }

    // Convert to string for comparison if types are different
    return a?.toString() === b?.toString();
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
