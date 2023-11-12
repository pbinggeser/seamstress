import { generatePermutations  } from "../dist/esm/main.js";

let inputObject = {
  color: ['red', 'green', 'blue'],
  size: ['small', 'medium', 'large'],
  count1: {
    min: 1,
    max: 3,
    step: 1,
  },
  count2: {
    min: 1,
    max: 3,
    step: 1,
  },
};

let options = {
  rules: [
    {
      if: p => p.count1 > p.count2,
      then: { 
        color: ['red']
      }
    }
  ]
};

let permutations = generatePermutations(inputObject, options);
console.log(permutations);