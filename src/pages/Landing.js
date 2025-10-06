import React from 'react';

const Landing = ({ onNavigate }) => {
  return (
    <section className="page landing active">
      <div className="landing-content">
        <h1>Welcome to Paradise Nursery</h1>
        <p>
          Bring nature indoors with our carefully curated collection of houseplants. 
          From low-maintenance succulents to statement fiddle-leaf figs, we have the 
          perfect green companion for every space and skill level.
        </p>
        <button className="btn" onClick={() => onNavigate('products')}>
          Get Started
        </button>
      </div>
    </section>
  );
};

export default Landing;