import { expect } from 'chai';
import { generatePermutations } from '../dist/esm/main.js';

describe('generatePermutations', function() {
  it('should generate simple permutations', function() {
    const inputObject = {
      color: ['red', 'green'],
      size: ['small', 'medium']
    };

    const permutations = generatePermutations(inputObject);
    expect(permutations).to.deep.include.members([
      { color: 'red', size: 'small' },
      { color: 'red', size: 'medium' },
      { color: 'green', size: 'small' },
      { color: 'green', size: 'medium' }
    ]);
    expect(permutations).to.have.lengthOf(4);
  });

  it('should apply rules to permutations', function() {
    const inputObject = {
      color: ['red', 'green'],
      size: ['small', 'medium']
    };
    const options = {
      rules: [
        {
          if: ['color', '==', 'red'],
          then: { size: ['medium'] }
        }
      ]
    };

    const permutations = generatePermutations(inputObject, options);
    expect(permutations).to.deep.include({ color: 'red', size: 'medium' });
    expect(permutations).to.not.deep.include({ color: 'red', size: 'small' });
  });

  it('should filter permutations post-generation', function() {
    const inputObject = {
      color: ['red', 'green'],
      size: ['small', 'medium', 'large']
    };
    const options = {
      filters: [
        permutation => permutation.size !== 'small'
      ]
    };

    const permutations = generatePermutations(inputObject, options);
    expect(permutations).to.not.deep.include({ color: 'red', size: 'small' });
    expect(permutations).to.not.deep.include({ color: 'green', size: 'small' });
  });

  
});

