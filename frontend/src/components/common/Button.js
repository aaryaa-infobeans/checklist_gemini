import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ children, onClick, className = '' }) => (
  <button onClick={onClick} className={`px-4 py-2 rounded bg-blue-600 text-white ${className}`}>
    {children}
  </button>
);

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;
