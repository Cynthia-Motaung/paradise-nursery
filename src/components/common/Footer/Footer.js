import React, { useState } from 'react';
import styles from './Footer.module.css';
import { ValidationSchemas, validateForm } from '../../../utils/validators';
import { withErrorHandling } from '../../../utils/errorHandler';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = withErrorHandling(async (e) => {
    e.preventDefault();
    
    // Validate email
    const validation = validateForm({ email }, ValidationSchemas.newsletter);
    
    if (!validation.isValid) {
      setValidationError(validation.errors.email);
      return;
    }

    setValidationError('');
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Integrate with actual newsletter API
      console.log('Subscribing email:', email);
      
      setSubscribed(true);
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => setSubscribed(false), 3000);
    } catch (error) {
      setValidationError('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, { operation: 'newsletterSubscription' });

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('');
    }
  };

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className="container">
        <div className={styles.footerContent}>
          {/* ... existing brand and links ... */}

          <div className={styles.newsletter}>
            <h4>Stay Updated</h4>
            <p>Get plant care tips and exclusive offers</p>
            
            {subscribed ? (
              <div className={styles.successMessage}>
                <i className="fas fa-check-circle"></i>
                Thank you for subscribing!
              </div>
            ) : (
              <form className={styles.newsletterForm} onSubmit={handleNewsletterSubmit} noValidate>
                <div className={styles.inputGroup}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={`${styles.newsletterInput} ${
                      validationError ? styles.inputError : ''
                    }`}
                    value={email}
                    onChange={handleEmailChange}
                    disabled={isSubmitting}
                    aria-label="Email for newsletter"
                    aria-describedby={validationError ? "email-error" : undefined}
                    required
                  />
                  {validationError && (
                    <div id="email-error" className={styles.errorMessage}>
                      {validationError}
                    </div>
                  )}
                </div>
                <button 
                  type="submit" 
                  className="btn btn--sm"
                  disabled={isSubmitting || !email}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Subscribing...
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.copyright}>
            &copy; {currentYear} Paradise Nursery. All rights reserved.
          </div>
          <div className={styles.social}>
            <a href="#facebook" aria-label="Facebook">
              <i className="fab fa-facebook" aria-hidden="true"></i>
            </a>
            <a href="#instagram" aria-label="Instagram">
              <i className="fab fa-instagram" aria-hidden="true"></i>
            </a>
            <a href="#pinterest" aria-label="Pinterest">
              <i className="fab fa-pinterest" aria-hidden="true"></i>
            </a>
            <a href="#twitter" aria-label="Twitter">
              <i className="fab fa-twitter" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;