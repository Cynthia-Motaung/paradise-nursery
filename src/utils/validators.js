export const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  phone: (phone) => {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  },

  zipCode: (zipCode) => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode);
  },

  required: (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  },

  minLength: (value, min) => {
    return value.length >= min;
  },

  maxLength: (value, max) => {
    return value.length <= max;
  },

  number: (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },

  positiveNumber: (value) => {
    return validators.number(value) && parseFloat(value) > 0;
  }
};

export const validateForm = (formData, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];

    for (const rule of fieldRules) {
      if (rule === 'required' && !validators.required(value)) {
        errors[field] = 'This field is required';
        break;
      }

      if (rule.startsWith('minLength:')) {
        const min = parseInt(rule.split(':')[1]);
        if (!validators.minLength(value, min)) {
          errors[field] = `Must be at least ${min} characters`;
          break;
        }
      }

      if (rule.startsWith('maxLength:')) {
        const max = parseInt(rule.split(':')[1]);
        if (!validators.maxLength(value, max)) {
          errors[field] = `Must be no more than ${max} characters`;
          break;
        }
      }

      if (rule === 'email' && !validators.email(value)) {
        errors[field] = 'Please enter a valid email address';
        break;
      }

      if (rule === 'phone' && !validators.phone(value)) {
        errors[field] = 'Please enter a valid phone number';
        break;
      }

      if (rule === 'zipCode' && !validators.zipCode(value)) {
        errors[field] = 'Please enter a valid ZIP code';
        break;
      }

      if (rule === 'positiveNumber' && !validators.positiveNumber(value)) {
        errors[field] = 'Please enter a positive number';
        break;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};