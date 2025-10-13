import { createError, ErrorCodes } from './errorHandler';

export const ValidationRules = {
  required: (value) => ({
    isValid: value !== null && value !== undefined && value.toString().trim() !== '',
    message: 'This field is required'
  }),

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: emailRegex.test(value),
      message: 'Please enter a valid email address'
    };
  },

  phone: (value) => {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return {
      isValid: phoneRegex.test(value),
      message: 'Please enter a valid phone number'
    };
  },

  minLength: (min) => (value) => ({
    isValid: value.length >= min,
    message: `Must be at least ${min} characters`
  }),

  maxLength: (max) => (value) => ({
    isValid: value.length <= max,
    message: `Must be no more than ${max} characters`
  }),

  number: (value) => ({
    isValid: !isNaN(parseFloat(value)) && isFinite(value),
    message: 'Must be a valid number'
  }),

  positiveNumber: (value) => ({
    isValid: !isNaN(parseFloat(value)) && parseFloat(value) > 0,
    message: 'Must be a positive number'
  }),

  price: (value) => ({
    isValid: !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
    message: 'Must be a valid price'
  }),

  url: (value) => {
    try {
      new URL(value);
      return { isValid: true, message: '' };
    } catch {
      return { isValid: false, message: 'Must be a valid URL' };
    }
  }
};

export const validateField = (value, rules) => {
  if (!Array.isArray(rules)) {
    rules = [rules];
  }

  for (const rule of rules) {
    const result = typeof rule === 'function' ? rule(value) : rule;
    if (!result.isValid) {
      return result;
    }
  }

  return { isValid: true, message: '' };
};

export const validateForm = (formData, schema) => {
  const errors = {};
  let isValid = true;

  Object.keys(schema).forEach(field => {
    const value = formData[field];
    const fieldRules = schema[field];
    
    const result = validateField(value, fieldRules);
    
    if (!result.isValid) {
      errors[field] = result.message;
      isValid = false;
    }
  });

  return {
    isValid,
    errors,
    hasErrors: !isValid
  };
};

export const createValidator = (schema) => {
  return (formData) => validateForm(formData, schema);
};

// Common validation schemas
export const ValidationSchemas = {
  newsletter: {
    email: [ValidationRules.required, ValidationRules.email]
  },

  profile: {
    name: [ValidationRules.required, ValidationRules.minLength(2)],
    email: [ValidationRules.required, ValidationRules.email],
    phone: [ValidationRules.phone]
  },

  product: {
    name: [ValidationRules.required, ValidationRules.minLength(2)],
    price: [ValidationRules.required, ValidationRules.price],
    description: [ValidationRules.required, ValidationRules.minLength(10)]
  }
};

export class ValidationError extends Error {
  constructor(errors, message = 'Validation failed') {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
    this.timestamp = new Date().toISOString();
  }
}

export const withValidation = (schema, formData) => {
  const result = validateForm(formData, schema);
  
  if (!result.isValid) {
    throw new ValidationError(result.errors);
  }
  
  return formData;
};
