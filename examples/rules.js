import { generatePermutations  } from "../dist/esm/main.js";

let inputObject = {
  color: ['red', 'green', 'blue'],
  size: ['small', 'medium', 'large'],
};

let options = {
  rules: [
    {
      if: ['color', '==', ['red', 'green']],
      then: { 
        size: ['medium', 'large'] 
      }
    },
    {
      if: ['color', '!=', 'red'],
      then: { 
        size: ['large'] 
      }
    }
  ],
};

let permutations = generatePermutations(inputObject, options);
console.log(permutations);