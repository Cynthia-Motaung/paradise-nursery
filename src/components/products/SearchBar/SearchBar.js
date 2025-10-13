
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { debounce } from '../../../utils/helpers';
import styles from './SearchBar.module.css';

const SearchBar = ({ onSearch, placeholder = "Search plants...", initialValue = "" }) => {
  const [query, setQuery] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      if (searchQuery.trim().length >= 2 || searchQuery.trim().length === 0) {
        setIsSearching(true);
        onSearch(searchQuery.trim()).finally(() => setIsSearching(false));
      }
    }, 500),
    [onSearch]
  );

  useEffect(() => {
    if (query !== initialValue) {
      debouncedSearch(query);
    }
  }, [query, debouncedSearch, initialValue]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    debouncedSearch.flush?.(); // Immediate execution
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit} role="search">
      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <i className={`fas fa-search ${styles.searchIcon}`} aria-hidden="true"></i>
          <input
            type="text"
            className={styles.searchInput}
            placeholder={placeholder}
            value={query}
            onChange={handleChange}
            aria-label="Search plants"
          />
          {isSearching && (
            <div className={styles.searchingIndicator}>
              <i className="fas fa-spinner fa-spin"></i>
            </div>
          )}
          {query && !isSearching && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClear}
              aria-label="Clear search"
            >
              <i className="fas fa-times" aria-hidden="true"></i>
            </button>
          )}
        </div>
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </div>
    </form>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  initialValue: PropTypes.string
};

export default SearchBar;
