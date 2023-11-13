import { generatePermutations  } from "../dist/esm/main.js";

let inputObject = {
  color: ['red', 'green', 'blue'],
  size: ['small', 'medium', 'large'],
  date: {
    min: '2023-01-01',
    max: '2023-01-10',
    step: {days: 1},
    datetime: true,
    format: 'yyyy-MM-dd'
  },
};

let options = {
  rules: [
    {
      if: ['date', '==', '2023-01-02'],
      then: { 
        color: 'red',
        size: 'large'
      }
    }
  ],
};

let permutations = generatePermutations(inputObject, options);