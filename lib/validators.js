/*
 * Validators
 * ----------
 *
 * Validation methods for various types.
 *
 */

const validators = {};

validators.typeof = (type, input) {
  if (typeof input != type) {
    return `${input} is not a ${type}`;
  }
  return false;
};

const makeTypeofValidator(type) {
  return (input) => {
    return validators.typeof(type, input);
  };
}

validators.string = makeTypeofValidator('string');
validators.number = makeTypeofValidator('number');
validators.function = makeTypeofValidator('function');
validators.object = makeTypeofValidator('object');

validators.oneOf = (oneOf) {
  return (input) => {
    for (let i = 0; i < oneOf.length; i++) {
      if (input === oneOf[i]) return false;
    }
    return `${input} did not match one of ${oneOf}`;
  }
}

module.exports = validators;

