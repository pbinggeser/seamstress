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


describe('generatePermutations with date ranges', function() {
  it('should generate permutations with date ranges using default ISO format', function() {
    const inputObject = {
      eventDates: {
        min: '2021-01-01',
        max: '2021-01-03',
        step: { days: 1 },
        datetime: true
      },
      color: ['red', 'green']
    };

    const permutations = generatePermutations(inputObject);
    // Check if the dates are in ISO format and the expected length of permutations is correct
    const isoDateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;
    permutations.forEach(permutation => {
      expect(permutation.eventDates).to.match(isoDateRegex);
    });
    expect(permutations).to.have.lengthOf(6); // 3 dates * 2 colors
  });

  it('should generate permutations with date ranges and custom format', function() {
    const inputObject = {
      eventDates: {
        min: '2021-01-01T00:00:00Z',
        max: '2021-01-03T00:00:00Z',
        step: { days: 1 },
        datetime: true,
        format: 'dd LLL yyyy' // Custom format e.g., "01 Jan 2021"
      },
      color: ['red']
    };

    const permutations = generatePermutations(inputObject);
    // Verify that the formatted dates match the expected output
    expect(permutations).to.deep.include.members([
      { eventDates: '01 Jan 2021', color: 'red' },
      { eventDates: '02 Jan 2021', color: 'red' },
      { eventDates: '03 Jan 2021', color: 'red' }
    ]);
    expect(permutations).to.have.lengthOf(3); // 3 dates
  });
});
