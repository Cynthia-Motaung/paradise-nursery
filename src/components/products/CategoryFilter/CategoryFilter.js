import React from 'react';
import PropTypes from 'prop-types';
import styles from './CategoryFilter.module.css';

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className={styles.container} role="group" aria-label="Filter products by category">
      <div className={styles.categories}>
        {categories.map(category => (
          <button
            key={category.id}
            className={`${styles.categoryButton} ${
              activeCategory === category.id ? styles.active : ''
            }`}
            onClick={() => onCategoryChange(category.id)}
            aria-pressed={activeCategory === category.id}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  activeCategory: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired
};

export default CategoryFilter;