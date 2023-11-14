import { generatePermutations  } from "../dist/esm/main.js";

let inputObject = {
  color: ['red', 'green', 'blue'],
  size: ['small', 'medium', 'large'],
  count: {
    min: 1,
    max: 40,
    step: 1,
  },
};

let permutations = generatePermutations(inputObject, {
  sampleSize: 10
});

console.log(permutations);