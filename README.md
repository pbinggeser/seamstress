# seamstress

Seamstress is a versatile Node.js library for generating permutations of input data. It allows developers to provide an object with fields containing arrays, numeric ranges, or date-time ranges and outputs an array of objects covering every possible combination. Seamstress also supports conditional rules and filtering for advanced list manipulations.

## Features

- Generate permutations for arrays of values.
- Generate permutations for numeric ranges, including support for min, max, and step configuration.
- Generate permutations for date-time ranges with customizable output formatting.
- Apply conditional rules to include or exclude certain permutations based on simple or complex logic.
- Apply filters to the final set of permutations for additional custom post-processing.

## Installation

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
---

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


### Generating Date-Time Ranges
Seamstress can generate permutations including date-time ranges by using Luxon for date parsing and formatting. Simply set datetime: true in your range object and provide min, max, and step values as ISO date strings. You can also specify the output format for date-time values using Luxon's formatting tokens.

```javascript
const inputObject = {
  eventDates: {
    min: '2021-01-01',           // Start date in ISO format
    max: '2021-01-05',           // End date in ISO format
    step: { days: 1 },           // Step by one day
    datetime: true,              // Indicate that this is a date-time range
    format: 'dd LLL yyyy'        // Output format using Luxon's tokens
  },
  color: ['red', 'green']
};
```

This will generate permutations where eventDates are formatted as "01 Jan 2021", "02 Jan 2021", etc., and combined with each value in the color array.



### Rules for Date-Time Fields
When defining rules that compare date-time fields, simply use the field name in your rule definition. Seamstress will automatically handle the comparison logic for date fields.

Example of a rule using date-time comparison:

```javascript
const options = {
  rules: [
    {
      if: ['startDate', '>', '2020-01-03'],
      then: { location: ['New York', 'Berlin'] }
    }
  ],
  // ... other options ...
};
```
This rule restricts permutations to only include those where the startDate is after '2020-01-03', and only for 'New York' or 'Berlin' locations.

---

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

---

## Sampling Permutations

For cases where the total number of permutations is large, and you are interested in working with only a subset of those permutations, Seamstress provides a feature to obtain a random sample of the generated permutations.

To use this feature, simply specify a `sampleSize` in your options object when calling `generatePermutations`. The library will then return a random subset of permutations with a length equal to `sampleSize`.

Here's an example of how to use the sampling feature:

```javascript
const { generatePermutations } = require('seamstress');

let inputObject = {
  // ... your input definitions ...
};

let options = {
  // ... other options, such as rules and filters ...
  sampleSize: 50 // The desired sample size of the result set
};

let sampledPermutations = generatePermutations(inputObject, options);
console.log(sampledPermutations); // Outputs a random sample of 50 permutations
```

This feature is particularly useful when dealing with date-time ranges or large datasets where generating all permutations is impractical. By using sampleSize, you can control the output to only receive a manageable number of permutations, which is random and varied each time generatePermutations is called.

Remember, the sampling is performed after all permutations have been generated and any rules or filters have been applied, ensuring that the sample is representative of the filtered permutation space.



## API Reference

### `generatePermutations(inputObject, options)`

Generates an array of permutations based on the provided input object and options.

#### Parameters

- `inputObject`: An object with fields containing arrays of possible values or objects describing a numeric range with `min`, `max`, and `step` properties.
- `options` (optional): An object that can contain:
  - `rules`: array of objects to conditionally limit the permutations based on the values
  - `filters`: array of functions to apply additional filtering
  - `sampleSize`: integer that when set will return a random sample of the generated list of this length

#### Return Value

- An array of permutation objects after applying rules and filters.

## Contributing

Contributions to Seamstress are welcome! Please follow the existing code style, add tests for new features, fork the repository, and submit a pull request.

## License

Seamstress is [MIT licensed](./LICENSE).