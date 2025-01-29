exports.deepEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true; // If both are the same reference

  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  ) {
    return false; // If either is not an object or is null
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false; // Different number of keys

  for (let key of keys1) {
    if (!keys2.includes(key) || !this.deepEqual(obj1[key], obj2[key])) {
      return false; // If key is missing or values don't match
    }
  }

  return true;
};

// // Example usage:
// const objA = {
//   name: "John",
//   age: 30,
//   hobbies: ["reading", "gaming"],
//   address: { city: "New York", zip: "10001" },
// };

// const objB = {
//   name: "John",
//   age: 30,
//   hobbies: ["reading", "gaming"],
//   address: { city: "New York", zip: "10001" },
// };
