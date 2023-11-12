# seamstress

Seamstress is a versatile Node.js library for generating permutations of input data. It allows developers to provide an object with fields containing arrays or numeric ranges and outputs an array of objects covering every possible combination. Seamstress also supports conditional rules and filtering for advanced list manipulations.

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

Rules allow you to conditionally limit the permutations based on logical relations between fields. You can use simple comparisons or provide a function for complex logic.

```javascript
// Using array syntax for simple rules
const optionsWithSimpleRules = {
  rules: [
    {
      if: ['color', '==', 'red'],
      then: { size: ['medium', 'large'] }
    }
  ]
};

// Using function syntax for complex rules
const optionsWithFunctionRules = {
  rules: [
    {
      if: (permutation) => permutation.count1 > permutation.count2,
      then: { color: ['red'] }
    }
  ]
};

const permutationsWithRules = seamstress.generatePermutations(inputObject, optionsWithFunctionRules);
console.log(permutationsWithRules);
```

### With Numeric Generated Data and Rules

You can define numeric ranges in the input object which seamstress will expand into a list of values.

```javascript
const inputObjectWithNumericRanges = {
  // ... (other fields)
  number: {
    min: 1,
    max: 10,
    step: 1
  }
};

// ... (usage with numeric ranges and rules as above)
```

### Applying Filters

After generating permutations, you can apply filters to the result set to include or exclude certain permutations based on custom logic.

```javascript
const optionsWithFilters = {
  // ... (rules if any)
  filters: [
    permutation => permutation.size === 'large', // Keep only large sizes
    permutation => permutation.color !== 'blue'  // Exclude blue color
  ]
};

const filteredPermutations = seamstress.generatePermutations(inputObject, optionsWithFilters);
console.log(filteredPermutations);
```

## API Reference

### `generatePermutations(inputObject, options)`

Generates an array of permutations based on the provided input object and options.

#### Parameters

- `inputObject`: An object with fields containing arrays of possible values or objects describing a numeric range with `min`, `max`, and `step` properties.
- `options` (optional): An object that can contain a `rules` array to conditionally limit the permutations based on the values and a `filters` array to apply additional filtering.

#### Return Value

- An array of permutation objects after applying rules and filters.

## Contributing

Contributions to Seamstress are welcome! Please follow the existing code style, add tests for new features, fork the repository, and submit a pull request.

## License

Seamstress is [MIT licensed](./LICENSE).