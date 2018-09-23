/*
 * Validators
 * ----------
 *
 * Validation methods for various types.
 *
 */

const validators = {};

validators.typeof = (type) => {
  return (input) => {
    return typeof input === type;
  };
}

validators.string = validators.typeof('string');
validators.number = validators.typeof('number');
validators.function = validators.typeof('function');
validators.object = (input) => {
  return validators.typeof('object')(input) &&
    !validators.array(input) &&
    !validators.null(input);
}

validators.array = (input) => {
  return Array.isArray(input);
};

validators.null = (input) => (input === null);

validators.undefined = (input) => (input === undefined);

validators.finite = (input) => {
  return validators.number(input) && Number.isFinite(input);
};

validators.instanceOf = (cls) => {
  return (input) => (input instanceof cls);
};

validators.oneOf = (oneOf) => {
  return (input) => {
    for (let i = 0; i < oneOf.length; i++) {
      if (input === oneOf[i]) return true;
    }
    return false;
  }
};

validators.oneOfType = (valTypes) => {
  return (input) => {
    for (let i = 0; i < valTypes.length; i++) {
      if (valTypes[i](input)) return true;
    }
    return false;
  }
};


validators.createNumberBetween = (min, max) => {
  return (input) => {
    if (!validators.number) return false;
    if (min != null && input < min) return false;
    if (max != null && input > max) return false;
    return true;
  }
};

module.exports = validators;

