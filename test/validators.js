
const expect = require('chai').expect;
const validators = require('../lib/validators');


describe('validators', () => {

  function testValidator(
    validator,
    successList,
    failList) {

    successList.forEach((value) => {
      expect(validator(value)).to.be.true;
    });

    failList.forEach((value) => {
      expect(validator(value)).to.be.false;
    });
  }

  it('string', () => {
    const successes = ['{}', 'hello', '123', ''];
    const fails = [0, 123, null, undefined, ['h','i'], {}, []];
    testValidator(validators.string, successes, fails);
  });

  it('number', () => {
    const successes = [NaN, 1, Infinity, 0, -0];
    const fails = ['1', 'asdf', null, undefined, {}, []];

    testValidator(validators.number, successes, fails);
  });

  it('function', () => {
    function t() {};
    const successes = [() => {}, t];
    const fails = [1, '1', null, undefined, {}, []];

    testValidator(validators.function, successes, fails);
  });

  it('object', () => {
    function t() {}
    const successes = [{}, {'a': 'b'}, new t()];
    const fails = [1, '1', null, undefined, []];

    testValidator(validators.object, successes, fails);
  });

  it('array', () => {
    const successes = [[], [1, 2], ['h']];
    const fails = [1, '1', null, undefined, {}, {1: 2}];
    testValidator(validators.array, successes, fails);
  });

  it('null', () => {
    const successes = [null];
    const fails = [0, '', undefined, {}, []];
    testValidator(validators.null, successes, fails);
  });

  it('undefined', () => {
    const successes = [undefined];
    const fails = [0, '', null, {}, []];
    testValidator(validators.undefined, successes, fails);
  });

  it('finite', () => {
    const successes = [0, -123123123, 123123123];
    const fails = [NaN, Infinity, -Infinity];
    testValidator(validators.finite, successes, fails);
  });

  it('instanceOf', () => {
    class t {}
    class tt extends t{}
    class f {}
    const validator = validators.instanceOf(t);
    const successes = [new t(), new tt()];
    const fails = [{}, new f()];
    testValidator(validator, successes, fails);
  });

  it('oneOf', () => {
    const validator = validators.oneOf(['a', 0, null]);
    const successes = ['a', 0, null, -0];
    const fails = ['0', undefined, {}, []];
    testValidator(validator, successes, fails);
  });

  it('oneOfType', () => {
    const validator = validators.oneOfType([
      validators.string,
      validators.oneOf([0, 1, 2]),
    ]);

    const successes = ['', 'a', 0, 1, 2];
    const fails = [3, [], {}, null, undefined];
    testValidator(validator, successes, fails);
  });

});

