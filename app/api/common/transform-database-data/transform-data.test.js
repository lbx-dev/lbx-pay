const dataTransformService = require('./transform-data.service');
const assert = require('assert');
const data = [ {
  unprepared: {
    one: '1',
    one_two: '1',
    one_two_three: '1'
  },
  prepared: {
    one: '1',
    oneTwo: '1',
    oneTwoThree: '1'
  }
} ];

function testTwoSets(set1, set2) {
  if(set1.size !== set2.size) {
    return false;
  }
  for(const element of set1) {
    if(!set2.has(element)) {
      return false;
    }
  }

  return true;
}
function testTransforming() {
  data.forEach(function (item) {
    const preparedSet = new Set(Object.keys(item.prepared)),
      newSet = new Set(Object.keys(dataTransformService.transform(item.unprepared)));
    
    assert(testTwoSets(preparedSet, newSet));
  });
}

describe('Testing services for transformation of database data', function() {
  it('Test validity', testTransforming);
});