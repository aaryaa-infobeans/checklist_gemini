import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ value, onChange, placeholder = '', type = 'text' }) => (
  <input value={value} onChange={onChange} placeholder={placeholder} type={type} className="p-2 border rounded w-full" />
);

Input.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
};

export default Input;
