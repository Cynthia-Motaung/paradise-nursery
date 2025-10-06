import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <i className="fas fa-leaf" aria-hidden="true"></i>
              <span>Paradise Nursery</span>
            </div>
            <p className={styles.tagline}>
              Bringing nature's beauty into your home
            </p>
          </div>

          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h4>Shop</h4>
              <ul>
                <li><a href="#all-plants">All Plants</a></li>
                <li><a href="#succulents">Succulents</a></li>
                <li><a href="#tropical">Tropical Plants</a></li>
                <li><a href="#flowering">Flowering Plants</a></li>
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h4>Support</h4>
              <ul>
                <li><a href="#contact">Contact Us</a></li>
                <li><a href="#shipping">Shipping Info</a></li>
                <li><a href="#returns">Returns</a></li>
                <li><a href="#care">Plant Care</a></li>
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#sustainability">Sustainability</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#press">Press</a></li>
              </ul>
            </div>
          </div>

          <div className={styles.newsletter}>
            <h4>Stay Updated</h4>
            <p>Get plant care tips and exclusive offers</p>
            <form className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Enter your email"
                className={styles.newsletterInput}
                aria-label="Email for newsletter"
              />
              <button type="submit" className="btn btn--sm">
                Subscribe
              </button>
            </form>
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