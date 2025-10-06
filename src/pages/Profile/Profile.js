import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import styles from './Profile.module.css';

const Profile = ({ onNavigate }) => {
  const { user, userProfile, userPreferences, updateProfile, updatePreferences, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || ''
  });

  if (!user) {
    return (
      <div className={styles.container}>
        <div className="container">
          <div className={styles.notAuthenticated}>
            <i className="fas fa-user-slash" aria-hidden="true"></i>
            <h2>Please log in to view your profile</h2>
            <p>You need to be logged in to access your account information.</p>
            <button className="btn" onClick={() => onNavigate('products')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    setIsEditing(false);
  };

  const handlePreferenceChange = (key, value) => {
    updatePreferences({ [key]: value });
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'fas fa-user' },
    { id: 'orders', label: 'Order History', icon: 'fas fa-history' },
    { id: 'addresses', label: 'Saved Addresses', icon: 'fas fa-map-marker-alt' },
    { id: 'wishlist', label: 'Wishlist', icon: 'fas fa-heart' },
    { id: 'preferences', label: 'Preferences', icon: 'fas fa-cog' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className={styles.tabContent}>
            <div className={styles.profileHeader}>
              <img
                src={user.picture || '/images/default-avatar.png'}
                alt={user.name}
                className={styles.profileAvatar}
              />
              <div>
                <h3>{user.name}</h3>
                <p>Member since {new Date(userProfile?.createdAt).toLocaleDateString()}</p>
              </div>
              {!isEditing && (
                <button
                  className="btn btn--secondary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className={styles.profileForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.formLabel}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.formLabel}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.formLabel}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className="btn">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className={styles.profileInfo}>
                <div className={styles.infoItem}>
                  <strong>Email:</strong> {user.email}
                </div>
                <div className={styles.infoItem}>
                  <strong>Phone:</strong> {userProfile?.phone || 'Not provided'}
                </div>
              </div>
            )}
          </div>
        );

      case 'preferences':
        return (
          <div className={styles.tabContent}>
            <h3>Notification Preferences</h3>
            <div className={styles.preferenceItem}>
              <label className={styles.preferenceLabel}>
                <input
                  type="checkbox"
                  checked={userPreferences.newsletter}
                  onChange={(e) => handlePreferenceChange('newsletter', e.target.checked)}
                />
                <span>Receive plant care tips and newsletter</span>
              </label>
            </div>
            <div className={styles.preferenceItem}>
              <label className={styles.preferenceLabel}>
                <input
                  type="checkbox"
                  checked={userPreferences.notifications}
                  onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                />
                <span>Order and shipping notifications</span>
              </label>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className={styles.tabContent}>
            <h3>Order History</h3>
            <div className={styles.emptyState}>
              <i className="fas fa-shopping-bag" aria-hidden="true"></i>
              <p>No orders yet</p>
              <button 
                className="btn"
                onClick={() => onNavigate('products')}
              >
                Start Shopping
              </button>
            </div>
          </div>
        );

      case 'addresses':
        return (
          <div className={styles.tabContent}>
            <h3>Saved Addresses</h3>
            <div className={styles.emptyState}>
              <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
              <p>No saved addresses</p>
              <p>Add addresses for faster checkout</p>
            </div>
          </div>
        );

      case 'wishlist':
        return (
          <div className={styles.tabContent}>
            <h3>Your Wishlist</h3>
            <div className={styles.emptyState}>
              <i className="fas fa-heart" aria-hidden="true"></i>
              <p>Your wishlist is empty</p>
              <p>Save your favorite plants for later</p>
              <button 
                className="btn"
                onClick={() => onNavigate('products')}
              >
                Browse Plants
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className={styles.container}>
      <div className="container">
        <div className={styles.profileLayout}>
          <aside className={styles.sidebar}>
            <nav className={styles.sidebarNav}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`${styles.sidebarItem} ${activeTab === tab.id ? styles.active : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <i className={tab.icon} aria-hidden="true"></i>
                  {tab.label}
                </button>
              ))}
              <hr className={styles.sidebarDivider} />
              <button
                className={`${styles.sidebarItem} ${styles.logoutButton}`}
                onClick={logout}
              >
                <i className="fas fa-sign-out-alt" aria-hidden="true"></i>
                Logout
              </button>
            </nav>
          </aside>

          <main className={styles.mainContent}>
            {renderTabContent()}
          </main>
        </div>
      </div>
    </section>
  );
};

Profile.propTypes = {
  onNavigate: PropTypes.func.isRequired
};

export default Profile;