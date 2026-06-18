// components/Loader.jsx
// Reusable spinner loader component

import React from 'react';

const Loader = ({ fullPage = false, size = 44, text = '' }) => {
  if (fullPage) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '100vh', gap: '16px'
      }}>
        <div className="spinner" style={{ width: size, height: size }} />
        {text && <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>{text}</p>}
      </div>
    );
  }

  return (
    <div className="loader-container" style={{ flexDirection: 'column', gap: '16px' }}>
      <div className="spinner" style={{ width: size, height: size }} />
      {text && <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>{text}</p>}
    </div>
  );
};

export default Loader;
