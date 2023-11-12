import { generatePermutations  } from "../dist/esm/main.js";

let inputObject = {
  color: ['red', 'blue'],
  count1: {
    min: 1,
    max: 4,
    step: 1,
  },
  count2: {
    min: 1,
    max: 4,
    step: 1,
  },
};

let options = {
  filters: [
    p => p.count2 >= p.count1,
    p => p.count2 != 1
  ]
};

let permutations = generatePermutations(inputObject, options);
console.log(permutations);