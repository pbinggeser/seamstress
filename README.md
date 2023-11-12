# seamstress

seamstress is a versatile Node.js library for generating permutations of input data. It allows developers to provide an object with fields containing arrays or numeric ranges and outputs an array of objects covering every possible combination. Seamstress also supports conditional rules for advanced list manipulations.

## Installation

Install seamstress using npm:

```bash
npm install seamstress
```

Or using yarn:

```bash
yarn add seamstress
```

## Usage

### CommonJS

```javascript
const seamstress = require('seamstress');

const inputObject = {
  color: ['red', 'green', 'blue'],
  size: ['small', 'medium', 'large']
};

const permutations = seamstress.generatePermutations(inputObject);
console.log(permutations);
```

### ES6

```javascript
import { generatePermutations } from 'seamstress';

const inputObject = {
  color: ['red', 'green', 'blue'],
  size: ['small', 'medium', 'large']
};

const permutations = generatePermutations(inputObject);
console.log(permutations);
```

### With Rules

```javascript
const inputObject = {
  color: ['red', 'green', 'blue'],
  size: ['small', 'medium', 'large']
};

const options = {
  rules: [
    {
      if: ['color', '==', 'red'],
      then: { size: ['medium', 'large'] }
    }
  ]
};

const permutationsWithRules = seamstress.generatePermutations(inputObject, options);
console.log(permutationsWithRules);
```

### With Numeric Generated Data and Rules

```javascript
const inputObject = {
  color: ['red', 'green', 'blue'],
  size: ['small', 'medium', 'large'],
  number: {
    min: 1,
    max: 10,
    step: 1
  }
};

const options = {
  rules: [
    {
      if: ['number', '>=', 4],
      then: { size: ['medium', 'large'] }
    }
  ]
};

const permutationsWithNumeric = seamstress.generatePermutations(inputObject, options);
console.log(permutationsWithNumeric);
```

## API Reference

### `generatePermutations(inputObject, options)`

Generates an array of permutations based on the provided input object and options.

#### Parameters

- `inputObject` - An object with fields containing arrays of possible values or objects describing a numeric range with `min`, `max`, and `step` properties.
- `options` (optional) - An object that can contain a `rules` array to conditionally limit the permutations based on the values.

#### Return Value

- An array of permutation objects.

## Contributing

Contributions to Seamstress are welcome! Please follow the existing code style, fork the repository and submit a pull request.

## License

Seamstress is [MIT licensed](./LICENSE).