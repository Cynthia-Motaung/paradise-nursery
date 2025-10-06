import React from 'react';
import PropTypes from 'prop-types';
import styles from './Landing.module.css';

const Landing = ({ onNavigate }) => {
  const features = [
    {
      icon: 'fas fa-truck',
      title: 'Free Shipping',
      description: 'Free shipping on orders over $50'
    },
    {
      icon: 'fas fa-leaf',
      title: 'Healthy Plants',
      description: 'Guaranteed healthy and well-cared for plants'
    },
    {
      icon: 'fas fa-headset',
      title: 'Expert Support',
      description: 'Get plant care advice from our experts'
    },
    {
      icon: 'fas fa-recycle',
      title: 'Eco-Friendly',
      description: 'Sustainable packaging and practices'
    }
  ];

  return (
    <section className={styles.landing} aria-label="Welcome to Paradise Nursery">
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Welcome to Paradise Nursery</h1>
          <p className={styles.subtitle}>
            Bring nature indoors with our carefully curated collection of houseplants. 
            From low-maintenance succulents to statement fiddle-leaf figs, we have the 
            perfect green companion for every space and skill level.
          </p>
          <button 
            className={`btn ${styles.ctaButton}`}
            onClick={() => onNavigate('products')}
          >
            Explore Our Plants
          </button>
        </div>
      </div>

      <div className="container">
        <div className={styles.features}>
          <h2 className={styles.featuresTitle}>Why Choose Paradise Nursery?</h2>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.feature}>
                <i className={feature.icon} aria-hidden="true"></i>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

Landing.propTypes = {
  onNavigate: PropTypes.func.isRequired
};

export default Landing;