
function $parcel$exportWildcard(dest, source) {
  Object.keys(source).forEach(function(key) {
    if (key === 'default' || key === '__esModule' || dest.hasOwnProperty(key)) {
      return;
    }

    Object.defineProperty(dest, key, {
      enumerable: true,
      get: function get() {
        return source[key];
      }
    });
  });

  return dest;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
var $f798bad331860e2b$exports = {};

$parcel$export($f798bad331860e2b$exports, "generatePermutations", () => $f798bad331860e2b$export$c2e8d36f4b1181be);
const $f798bad331860e2b$export$c2e8d36f4b1181be = (rawInputObject, options = {})=>{
    const inputObject = $f798bad331860e2b$var$preprocessInput(JSON.parse(JSON.stringify(rawInputObject))); // Deep copy and preprocess
    // Helper function to apply rules to current combination
    function applyRules(rules, permutation) {
        return rules.every((rule)=>{
            if (typeof rule.if === "function") {
                // Only apply 'then' conditions if 'if' condition returns true
                if (rule.if(permutation)) // Check 'then' conditions for further restrictions
                return checkThenConditions(rule.then, permutation);
                else // If 'if' condition returns false, this rule does not restrict the permutation
                return true;
            } else if (Array.isArray(rule.if)) {
                const [field, operator, conditionValue] = rule.if;
                // Apply 'then' conditions if the operator-based 'if' condition is met
                return checkRule(field, operator, conditionValue, permutation) ? checkThenConditions(rule.then, permutation) : true;
            } else // Throw an error if the rule format is not recognized
            throw new Error('Invalid rule format: "if" should be a function or an array.');
        });
    }
    // Adjusted checkRule function to directly accept the parameters instead of the rule object
    function checkRule(field, operator, conditionValue, permutation) {
        function checkCondition(operator, fieldValue, testValue) {
            switch(operator){
                case "==":
                    return fieldValue == testValue;
                case "!=":
                    return fieldValue != testValue;
                case "<":
                    return fieldValue < testValue;
                case "<=":
                    return fieldValue <= testValue;
                case ">":
                    return fieldValue > testValue;
                case ">=":
                    return fieldValue >= testValue;
                default:
                    throw new Error(`Invalid operator "${operator}" used in rule definition.`);
            }
        }
        let fieldValue = permutation[field];
        if (Array.isArray(conditionValue)) // If conditionValue is an array, check if any value in the array meets the condition
        return conditionValue.some((value)=>checkCondition(operator, fieldValue, value));
        else // If conditionValue is not an array, directly check the condition
        return checkCondition(operator, fieldValue, conditionValue);
    }
    // Helper function to check then conditions based on the current permutation
    function checkThenConditions(thenConditions, permutation) {
        return Object.entries(thenConditions).every(([field, values])=>{
            values = Array.isArray(values) ? values : [
                values
            ];
            return values.includes(permutation[field]);
        });
    }
    // Helper function to apply filters to permutations
    function applyFilters(permutations, filters) {
        return filters.reduce((filteredPermutations, filterFunc)=>{
            return filteredPermutations.filter(filterFunc);
        }, permutations);
    }
    // Recursive function to generate all combinations
    function permute(currentCombination = {}, remainingKeys = Object.keys(inputObject)) {
        // If no remaining keys, apply rules and return the final combination
        if (remainingKeys.length === 0) {
            // First, apply rules to see if the current combination is valid
            if (options.rules && !applyRules(options.rules, currentCombination)) return []; // If rules are not satisfied, filter out this combination
            // If there are filters, apply them as well
            return [
                currentCombination
            ]; // Return combination as an array of one
        }
        let [key, ...nextKeys] = remainingKeys;
        let results = [];
        // Generate permutations for the remaining keys
        const newOptions = nextKeys.length > 0 ? {
            ...inputObject,
            [key]: inputObject[key]
        } : inputObject;
        for (let value of inputObject[key]){
            let newCombination = {
                ...currentCombination,
                [key]: value
            };
            results = results.concat(permute(newCombination, nextKeys));
        }
        return results;
    }
    // Generate permutations and then apply any filters
    let allPermutations = permute({}, Object.keys(inputObject));
    if (options.filters) allPermutations = applyFilters(allPermutations, options.filters);
    // Validate input and options
    if (typeof inputObject !== "object" || inputObject == null) throw new TypeError("Input must be an object with array properties.");
    for(let key in inputObject){
        if (!Array.isArray(inputObject[key])) throw new TypeError(`Value for ${key} must be an array.`);
    }
    // Generate and return permutations with rules applied
    return allPermutations;
};
const $f798bad331860e2b$var$preprocessInput = (inputObject)=>{
    // Function to convert range definition to an array
    const rangeToArray = (range)=>{
        const { min: min, max: max, step: step } = range;
        let arr = [];
        for(let value = min; value <= max; value += step)arr.push(value);
        return arr;
    };
    // Process each field of the input object
    for(const key in inputObject)if (inputObject.hasOwnProperty(key)) {
        const value = inputObject[key];
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            // Convert range object to array if min, max, and step are present
            if ("min" in value && "max" in value && "step" in value) inputObject[key] = rangeToArray(value);
            else throw new Error(`Invalid range object for field '${key}'. Must contain min, max, and step properties.`);
        }
    }
    return inputObject; // Return the processed input object
};


$parcel$exportWildcard(module.exports, $f798bad331860e2b$exports);


//# sourceMappingURL=main.cjs.map
