export const generatePermutations = (rawInputObject, options = {}) => {
  const inputObject = preprocessInput(JSON.parse(JSON.stringify(rawInputObject))); // Deep copy and preprocess


    // Helper function to check if the rule applies
  function checkRule(rule, combination) {
    // Check if a value matches the condition set in a rule
    function checkCondition(field, operator, testValue, fieldValue) {
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
          return false; // Invalid operator
      }
    }

    // Execute the 'if' part of the rule
    const [field, operator, conditionValue] = rule.if;
    if (Array.isArray(conditionValue)) {
      // If conditionValue is an array, check if any value in the array meets the condition
      return conditionValue.some((value) => checkCondition(field, operator, value, combination[field]));
    } else {
      // If conditionValue is not an array, directly check the condition
      return checkCondition(field, operator, conditionValue, combination[field]);
    }
  }

  // Helper function to apply rules to current combination
  function applyRules(rules, permutation) {
    return rules.every((rule) => {
      if (checkRule(rule, permutation)) {
        // If the rule applies, check that all 'then' conditions are satisfied
        return Object.entries(rule.then).every(([thenField, thenValues]) => {
          // If thenValues is not an array, convert it to an array for consistency
          thenValues = Array.isArray(thenValues) ? thenValues : [thenValues];
          // The current value for thenField in permutation must be one of the thenValues
          return thenValues.includes(permutation[thenField]);
        });
      }
      // If the rule doesn't apply, return true as this rule does not restrict this permutation
      return true;
    });
  }

  // Recursive function to generate all combinations
  function permute(options, currentCombination = {}, remainingKeys = Object.keys(inputObject)) {
    if (remainingKeys.length === 0) {
      // Check if currentCombination respects the rules before adding it to results
      if (!options.rules || applyRules(options.rules, currentCombination)) {
        return [currentCombination];
      }
      return []; // If rules don't apply, return an empty array to filter out this permutation.
    }
  
    let [key, ...nextKeys] = remainingKeys;
    let results = [];
  
    for (let value of inputObject[key]) {
      let newCombination = { ...currentCombination, [key]: value };
      results = results.concat(permute(options, newCombination, nextKeys));
    }
  
    return results;
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

  // Generate and return permutations with rules applied
  return permute({ rules: options.rules }, {});
}


const preprocessInput = (inputObject) => {
  // Function to convert range definition to an array
  const rangeToArray = (range) => {
    const { min, max, step } = range;
    let arr = [];
    for (let value = min; value <= max; value += step) {
      arr.push(value);
    }
    return arr;
  };

  // Process each field of the input object
  for (const key in inputObject) {
    if (inputObject.hasOwnProperty(key)) {
      const value = inputObject[key];
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Convert range object to array if min, max, and step are present
        if ('min' in value && 'max' in value && 'step' in value) {
          inputObject[key] = rangeToArray(value);
        } else {
          throw new Error(`Invalid range object for field '${key}'. Must contain min, max, and step properties.`);
        }
      }
    }
  }
  return inputObject; // Return the processed input object
};