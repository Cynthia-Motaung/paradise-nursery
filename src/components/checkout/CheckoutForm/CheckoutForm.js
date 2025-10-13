// src/components/checkout/CheckoutForm/CheckoutForm.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './CheckoutForm.module.css';

const CheckoutForm = ({ onSubmit, user, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: user?.email || '',
    shippingAddress: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    },
    paymentMethod: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: ''
    },
    billingSameAsShipping: true
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Shipping & Payment Information</h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Contact Information */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Contact Information</h3>
          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
        </div>

        {/* Shipping Address */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Shipping Address</h3>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="shippingAddress.firstName"
                placeholder="First Name"
                value={formData.shippingAddress.firstName}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="shippingAddress.lastName"
                placeholder="Last Name"
                value={formData.shippingAddress.lastName}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>
          </div>
          
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="shippingAddress.address"
              placeholder="Street Address"
              value={formData.shippingAddress.address}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="shippingAddress.city"
                placeholder="City"
                value={formData.shippingAddress.city}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="shippingAddress.state"
                placeholder="State"
                value={formData.shippingAddress.state}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="shippingAddress.zipCode"
                placeholder="ZIP Code"
                value={formData.shippingAddress.zipCode}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Payment Details</h3>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="paymentMethod.nameOnCard"
              placeholder="Name on Card"
              value={formData.paymentMethod.nameOnCard}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="paymentMethod.cardNumber"
              placeholder="Card Number"
              value={formData.paymentMethod.cardNumber}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="paymentMethod.expiryDate"
                placeholder="MM/YY"
                value={formData.paymentMethod.expiryDate}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="paymentMethod.cvv"
                placeholder="CVV"
                value={formData.paymentMethod.cvv}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>
          </div>
        </div>

        <button type="submit" className={styles.submitButton}>
          Place Order
        </button>
      </form>
    </div>
  );
};

CheckoutForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool
};

export default CheckoutForm;