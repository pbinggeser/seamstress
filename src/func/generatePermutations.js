const { DateTime } = require('luxon');

export const generatePermutations = (rawInputObject, options = {}) => {
  const {inputObject, fieldTypes} = preprocessInput(JSON.parse(JSON.stringify(rawInputObject))); // Deep copy and preprocess


  // Helper function to apply rules to current combination
  function applyRules(rules, permutation) {
    return rules.every((rule) => {
      if (typeof rule.if === 'function') {
        // Only apply 'then' conditions if 'if' condition returns true
        if (rule.if(permutation)) {
          // Check 'then' conditions for further restrictions
          return checkThenConditions(rule.then, permutation);
        } else {
          // If 'if' condition returns false, this rule does not restrict the permutation
          return true;
        }
      } else if (Array.isArray(rule.if)) {
        const [field, operator, conditionValue] = rule.if;
        // Apply 'then' conditions if the operator-based 'if' condition is met
        return checkRule(field, operator, conditionValue, permutation, inputObject) ? checkThenConditions(rule.then, permutation) : true;
      } else {
        // Throw an error if the rule format is not recognized
        throw new Error('Invalid rule format: "if" should be a function or an array.');
      }
    });
  }

  // Adjusted checkRule function to directly accept the parameters instead of the rule object
  function checkRule(field, operator, conditionValue, permutation, inputObject) {
    // console.log(field, operator, conditionValue, permutation, inputObject);
    function checkCondition(operator, fieldValue, testValue) {
      if (fieldTypes[field] === 'date') {
        let fieldValue = DateTime.fromISO(permutation[field], { zone: 'utc' });
        let testValue = DateTime.fromISO(conditionValue, { zone: 'utc' });
        console.log(fieldValue, testValue);
    
        // Perform comparison based on Luxon's DateTime comparison methods
        switch (operator) {
          case '==':
            return fieldValue.equals(testValue);
          case '!=':
            return !fieldValue.equals(testValue);
          case '<':
            return fieldValue < testValue;
          case '<=':
            return fieldValue <= testValue;
          case '>':
            return fieldValue > testValue;
          case '>=':
            return fieldValue >= testValue;
          default:
            throw new Error(`Invalid operator "${operator}" for date comparison.`);
        }
      } else {
          
        switch (operator) {
          case '==':
            return fieldValue == testValue;
          case '!=':
            return fieldValue != testValue;
          case '<':
            return fieldValue < testValue;
          case '<=':
            return fieldValue <= testValue;
          case '>':
            return fieldValue > testValue;
          case '>=':
            return fieldValue >= testValue;
          default:
            throw new Error(`Invalid operator "${operator}" used in rule definition.`);
        }
      }
    }

    let fieldValue = permutation[field];
    if (Array.isArray(conditionValue)) {
      // If conditionValue is an array, check if any value in the array meets the condition
      return conditionValue.some((value) => checkCondition(operator, fieldValue, value));
    } else {
      // If conditionValue is not an array, directly check the condition
      return checkCondition(operator, fieldValue, conditionValue);
    }
  }

  // Helper function to check then conditions based on the current permutation
  function checkThenConditions(thenConditions, permutation) {
    return Object.entries(thenConditions).every(([field, values]) => {
      values = Array.isArray(values) ? values : [values];
      return values.includes(permutation[field]);
    });
  }

  // Helper function to apply filters to permutations
  function applyFilters(permutations, filters) {
    return filters.reduce((filteredPermutations, filterFunc) => {
      return filteredPermutations.filter(filterFunc);
    }, permutations);
  }

  // Recursive function to generate all combinations
  function permute(currentCombination = {}, remainingKeys = Object.keys(inputObject)) {
    // If no remaining keys, apply rules and return the final combination
    if (remainingKeys.length === 0) {
      // First, apply rules to see if the current combination is valid
      if (options.rules && !applyRules(options.rules, currentCombination)) {
        return []; // If rules are not satisfied, filter out this combination
      }
      // If there are filters, apply them as well
      return [currentCombination]; // Return combination as an array of one
    }

    let [key, ...nextKeys] = remainingKeys;
    let results = [];

    // Generate permutations for the remaining keys
    const newOptions = nextKeys.length > 0 ? { ...inputObject, [key]: inputObject[key] } : inputObject;

    for (let value of inputObject[key]) {
      let newCombination = { ...currentCombination, [key]: value };
      results = results.concat(permute(newCombination, nextKeys));
    }

    return results;
  }

  // Generate permutations and then apply any filters
  let allPermutations = permute({}, Object.keys(inputObject));
  if (options.filters) {
    allPermutations = applyFilters(allPermutations, options.filters);
  }

  
  // Validate input and options
  if (typeof inputObject !== 'object' || inputObject == null) {
    throw new TypeError('Input must be an object with array properties.');
  }

  for (let key in inputObject) {
    if (!Array.isArray(inputObject[key])) {
      throw new TypeError(`Value for ${key} must be an array.`);
    }
  }


  if (options.sampleSize && Number.isInteger(options.sampleSize)) {
    return samplePermutations(allPermutations, options.sampleSize);
  } 

  // Generate and return permutations with rules applied
  return allPermutations;
}

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

// Function to sample N random permutations from the full list
function samplePermutations(permutations, sampleSize) {
  if (sampleSize >= permutations.length) {
    return permutations; // If sample size is greater than available permutations, return all
  }
  // Shuffle the array and then slice it to get a sample
  return shuffleArray(permutations).slice(0, sampleSize);
}

const preprocessInput = (inputObject) => {

  let fieldTypes = {};

  // Function to convert range definition to an array
  const rangeToArray = (range) => {
    if (range.datetime) { // Check if the range is for datetime values
      const { min, max, step, format } = range;
      let arr = [];
      let current = DateTime.fromISO(min, { zone: 'utc' });
      const end = DateTime.fromISO(max, { zone: 'utc' });
      const stepDuration = DateTime.fromObject(step); // Create a duration object for stepping

      if (!current.isValid || !end.isValid) {
        throw new Error('Invalid DateTime range: Ensure "min" and "max" are valid ISO8601 strings.');
      }

      while (current <= end) {
        arr.push(format ? current.toFormat(format) : current.toISO());
        current = current.plus(step); // Ensure the 'step' object is a valid duration for Luxon
      }
      return arr;
    } else {
      // Handle numeric range...
      const { min, max, step } = range;
      let arr = [];
      for (let value = min; value <= max; value += step) {
        arr.push(value);
      }
      return arr;
    }

  };

  // Process each field of the input object
  for (const key in inputObject) {
    if (inputObject.hasOwnProperty(key)) {
      const value = inputObject[key];
      fieldTypes = { ...fieldTypes, [key]: 'string' };
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        
        if(value.datetime){
          fieldTypes = { ...fieldTypes, [key]: 'date' };
        } else {
          fieldTypes = { ...fieldTypes, [key]: 'number' };
        }

        // Convert range object to array if min, max, and step are present
        if ('min' in value && 'max' in value && 'step' in value) {
          inputObject[key] = rangeToArray(value);
        } else {
          throw new Error(`Invalid range object for field '${key}'. Must contain min, max, and step properties.`);
        }
      }
    }
  }

  // Add a tag to mark the field as a date field
  for (const key in inputObject) {
    if (inputObject.hasOwnProperty(key)) {
      const field = inputObject[key];
      if (field && typeof field === 'object' && !Array.isArray(field) && field.datetime) {
        // Convert date range definitions to arrays and tag as date fields
        
      }
    }
  }

  return {inputObject, fieldTypes}; // Return the processed input object
};