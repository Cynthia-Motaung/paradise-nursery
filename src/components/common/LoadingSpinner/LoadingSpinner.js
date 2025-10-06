import React from 'react';
import PropTypes from 'prop-types';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ size = 'medium', color = 'primary', text }) => {
  const spinnerClass = `${styles.spinner} ${styles[size]} ${styles[color]}`;

  return (
    <div className={styles.container} role="status" aria-live="polite">
      <div className={spinnerClass} aria-hidden="true">
        <div className={styles.spinnerInner}></div>
      </div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['primary', 'secondary', 'light']),
  text: PropTypes.string
};

export default LoadingSpinner;