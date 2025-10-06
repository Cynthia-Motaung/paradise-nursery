import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import styles from './Header.module.css';

const Header = ({ currentPage, onNavigate }) => {
  const { getCartItemsCount } = useCart();
  const { user, isAuthenticated, login, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleNavigation = (page) => {
    onNavigate(page);
    setShowUserMenu(false);
    window.scrollTo(0, 0);
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
    } else {
      login();
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <header className={styles.header} role="banner">
      <div className="container">
        <div className={styles.headerContent}>
          <button
            className={styles.logo}
            onClick={() => handleNavigation('landing')}
            aria-label="Paradise Nursery - Go to homepage"
          >
            <i className="fas fa-leaf" aria-hidden="true"></i>
            <span>Paradise Nursery</span>
          </button>
          
          <nav className={styles.nav} aria-label="Main navigation">
            <ul className={styles.navList}>
              <li>
                <button
                  className={`${styles.navLink} ${currentPage === 'landing' ? styles.active : ''}`}
                  onClick={() => handleNavigation('landing')}
                  aria-current={currentPage === 'landing' ? 'page' : undefined}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  className={`${styles.navLink} ${currentPage === 'products' ? styles.active : ''}`}
                  onClick={() => handleNavigation('products')}
                  aria-current={currentPage === 'products' ? 'page' : undefined}
                >
                  Plants
                </button>
              </li>
              <li>
                <button
                  className={`${styles.navLink} ${currentPage === 'cart' ? styles.active : ''}`}
                  onClick={() => handleNavigation('cart')}
                  aria-current={currentPage === 'cart' ? 'page' : undefined}
                >
                  Cart
                </button>
              </li>
            </ul>
          </nav>

          <div className={styles.headerActions}>
            {isAuthenticated && (
              <div className={styles.userMenu}>
                <button
                  className={styles.userButton}
                  onClick={toggleUserMenu}
                  aria-label="User menu"
                  aria-expanded={showUserMenu}
                >
                  <img
                    src={user.picture || '/images/default-avatar.png'}
                    alt={user.name || 'User'}
                    className={styles.userAvatar}
                  />
                  <span className={styles.userName}>
                    {user.name?.split(' ')[0] || 'Profile'}
                  </span>
                  <i className={`fas fa-chevron-${showUserMenu ? 'up' : 'down'}`}></i>
                </button>

                {showUserMenu && (
                  <div className={styles.userDropdown}>
                    <button
                      className={styles.dropdownItem}
                      onClick={() => handleNavigation('profile')}
                    >
                      <i className="fas fa-user" aria-hidden="true"></i>
                      My Profile
                    </button>
                    <button
                      className={styles.dropdownItem}
                      onClick={() => handleNavigation('profile')}
                    >
                      <i className="fas fa-heart" aria-hidden="true"></i>
                      Wishlist
                    </button>
                    <button
                      className={styles.dropdownItem}
                      onClick={() => handleNavigation('profile')}
                    >
                      <i className="fas fa-history" aria-hidden="true"></i>
                      Order History
                    </button>
                    <hr className={styles.dropdownDivider} />
                    <button
                      className={`${styles.dropdownItem} ${styles.logoutItem}`}
                      onClick={handleAuthAction}
                    >
                      <i className="fas fa-sign-out-alt" aria-hidden="true"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {!isAuthenticated && (
              <button
                className={`${styles.authButton} ${styles.loginButton}`}
                onClick={handleAuthAction}
              >
                <i className="fas fa-sign-in-alt" aria-hidden="true"></i>
                Login
              </button>
            )}

            <button
              className={styles.cartIcon}
              onClick={() => handleNavigation('cart')}
              aria-label={`Shopping cart with ${getCartItemsCount()} items`}
            >
              <i className="fas fa-shopping-cart" aria-hidden="true"></i>
              {getCartItemsCount() > 0 && (
                <span className={styles.cartCount} aria-live="polite">
                  {getCartItemsCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  currentPage: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired
};

export default Header;