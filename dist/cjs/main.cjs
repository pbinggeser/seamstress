var e,r={};Object.defineProperty(r,"generatePermutations",{get:()=>t,set:void 0,enumerable:!0,configurable:!0});const t=(e,r={})=>{let t=n(JSON.parse(JSON.stringify(e)));// Deep copy and preprocess
// Validate input and options
if("object"!=typeof t||null==t)throw TypeError("Input must be an object with array properties.");for(let e in t)if(!Array.isArray(t[e]))throw TypeError(`Value for ${e} must be an array.`);// Generate and return permutations with rules applied
return(// Recursive function to generate all combinations
function e(r,n={},a=Object.keys(t)){if(0===a.length)return(// Check if currentCombination respects the rules before adding it to results
!r.rules||r.rules.every(e=>!// Helper function to check if the rule applies
    function(e,r){// Check if a value matches the condition set in a rule
    function t(e,r,t,n){switch(r){case"==":return n==t;case"!=":return n!=t;case"<":return n<t;case"<=":return n<=t;case">":return n>t;case">=":return n>=t;default:return!1;// Invalid operator
    }}// Execute the 'if' part of the rule
    let[n,a,o]=e.if;return Array.isArray(o)?o.some(e=>t(n,a,e,r[n])):t(n,a,o,r[n])}(e,n)||Object.entries(e.then).every(([e,r])=>// If thenValues is not an array, convert it to an array for consistency
        (r=Array.isArray(r)?r:[r]).includes(n[e])))?[n]:[]);let[o,...i]=a,u=[];for(let a of t[o]){let t={...n,[o]:a};u=u.concat(e(r,t,i))}return u}({rules:r.rules},{}))},n=e=>{// Function to convert range definition to an array
let r=e=>{let{min:r,max:t,step:n}=e,a=[];for(let e=r;e<=t;e+=n)a.push(e);return a};// Process each field of the input object
for(let t in e)if(e.hasOwnProperty(t)){let n=e[t];if("object"==typeof n&&null!==n&&!Array.isArray(n)){// Convert range object to array if min, max, and step are present
if("min"in n&&"max"in n&&"step"in n)e[t]=r(n);else throw Error(`Invalid range object for field '${t}'. Must contain min, max, and step properties.`)}}return e;// Return the processed input object
};e=module.exports,Object.keys(r).forEach(function(t){"default"===t||"__esModule"===t||e.hasOwnProperty(t)||Object.defineProperty(e,t,{enumerable:!0,get:function(){return r[t]}})});//# sourceMappingURL=main.cjs.map

//# sourceMappingURL=main.cjs.map
