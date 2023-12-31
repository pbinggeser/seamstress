import { generatePermutations  } from "../dist/esm/main.js";

let inputObject = {
  color: ['red', 'green', 'blue'],
  size: ['small', 'medium', 'large'],
  count: {
    min: 1,
    max: 10,
    step: 1,
  },
};

let options = {
  rules: [
    {
      if: ['count', '>', 4],
      then: { 
        size: ['medium', 'large'],
        color: 'red'
      }
    }
  ],
};

let permutations = generatePermutations(inputObject, options);
console.log(permutations);